---
title: Intent Contracts
description: Formal pre-execution agent commitments. The agent signs a contract before the first tool call.
version: 6.6.4
schema: skill-pack/v1
---

# Intent Contracts

> Before an agent touches a file, it signs a contract. The contract commits the agent to a scope, a set of promises, and a risk cap. The Verification Engine then checks the contract was honored.

---

## Why contracts?

Without contracts, an AI agent that says "I will only edit `auth.ts`" has no accountability if it later edits `package.json` and `tsconfig.json` too. The user has no way to detect the scope drift until the damage is done.

With contracts:

1. **Before execution**, the agent writes a formal contract (a JSON object that validates against `intent-contract.schema.json`).
2. **The user (or the runtime) approves** the contract. With `risk_cap: HIGH+`, approval is mandatory.
3. **During execution**, every tool call is checked against the contract.
4. **After execution**, the Verification Engine compares the actual work to the contract and emits a verdict.

The contract is the **single source of truth** for what the agent claimed it would do.

---

## Contract lifecycle

```text
       ┌─────────────────────────────────────────────┐
       │ 1. DRAFT — agent reads intent + context     │
       │    and produces a candidate contract.       │
       └────────────────┬────────────────────────────┘
                        │
                        ▼
       ┌─────────────────────────────────────────────┐
       │ 2. TEMPLATE — agent picks an Intent         │
       │    Template for the WorkType and merges.    │
       └────────────────┬────────────────────────────┘
                        │
                        ▼
       ┌─────────────────────────────────────────────┐
       │ 3. SIGN — user (or auto-approval) signs.    │
       │    Signature = HMAC-SHA256 of canonical     │
       │    contract + agent_id.                     │
       └────────────────┬────────────────────────────┘
                        │
                        ▼
       ┌─────────────────────────────────────────────┐
       │ 4. EXECUTE — agent runs tool calls.         │
       │    Every call is checked: in_scope?         │
       │    risk <= risk_cap? aggregate below floor? │
       └────────────────┬────────────────────────────┘
                        │
                        ▼
       ┌─────────────────────────────────────────────┐
       │ 5. VERIFY — Verification Engine compares    │
       │    actual work to the contract, emits       │
       │    composite_verdict.                       │
       └────────────────┬────────────────────────────┘
                        │
                        ▼
       ┌─────────────────────────────────────────────┐
       │ 6. AUDIT — record appended to the audit    │
       │    trail (audit-record.schema.json).        │
       └─────────────────────────────────────────────┘
```

---

## Example contract

```yaml
contract_id: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
task_summary: "Add rate limiting to /api/login"
work_type: FEATURE
scope:
  in_scope:
    - src/middleware/rate-limit.ts
    - src/middleware/__tests__/rate-limit.test.ts
  out_of_scope:
    - package.json
    - src/auth/**         # do not touch the auth logic itself
promises:
  - promise: "Implement sliding window rate limiter (10 req / minute per IP)"
    verification: "Unit tests cover window expiry, IP rotation, and burst behavior"
  - promise: "Return 429 with Retry-After header on limit exceeded"
    verification: "Integration test asserts 429 + header"
  - promise: "No new runtime dependencies"
    verification: "package.json unchanged in commit diff"
risk_cap: MEDIUM
estimated_effort: S
hard_floors_applied:
  - "auth=CRITICAL"     # auth domain forces CRITICAL minimum; we capped at MEDIUM and explicitly downgraded with user approval
created_at: "2026-06-22T10:00:00Z"
agent_id: "synarc-core@1.0.0"
signature: "5f4dcc3b5aa765d61d8327deb882cf99..."
```

---

## Templates

For each of the 12 WorkTypes, an **Intent Template** ships in `shared/workflows/intent-templates/`. Templates provide:

- Default scope rules (heuristics for what is usually in/out of scope)
- Standard promises (the most common commitments for that WorkType)
- Clarifying questions to ask the user
- Default `risk_cap`
- Domain hard floors (e.g., any mention of "payment" auto-applies `CRITICAL` floor)

The agent picks a template, merges it with the user intent, and produces a draft contract. The user can then edit any field before signing.

---

## Risk cap and hard floors

`risk_cap` is the maximum risk the agent is allowed to expose. If during execution a tool call would push aggregate risk above the cap, the runtime halts and asks for confirmation.

`hard_floors_applied` lists every domain keyword that triggered a **hard floor** (e.g., `auth=CRITICAL`, `payment=CRITICAL`, `pii=CRITICAL`). If any floor is HIGHER than `risk_cap`, the contract is **invalid** unless explicitly downgraded with user approval and a note in the audit trail.

---

## Auto-approval rules

| `risk_cap` | Auto-approve? | User confirmation? |
|---|---|---|
| `INFO` / `LOW` | ✅ Yes | None |
| `MEDIUM` | ✅ Yes | None |
| `HIGH` | ⚠️ Optional | Recommended for production |
| `CRITICAL` | ❌ No | Required |
| `BLAST` | ❌ No | Required + human review |

`--yes` / `--no-interaction` flags override these. The override is logged in the audit trail.

---

## See also

- [Verification](./verification.md) — what happens after execution
- [Audit Trail](./audit.md) — how contracts are recorded
- [`intent-contract.schema.json`](../../shared/schemas/intent-contract.schema.json) — formal spec
