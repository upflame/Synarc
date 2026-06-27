---
title: Verification Engine
description: Post-execution verification of Intent Contracts. The engine checks scope, promises, and risk delta, then emits a composite verdict.
version: 6.6.4
schema: skill-pack/v1
---

# Verification Engine

> After an agent finishes a task, the Verification Engine compares the actual work to the signed Intent Contract. It checks scope, promises, and risk — and emits a structured verdict.

---

## Pipeline

```text
Signed Intent Contract
         │
         ▼
┌────────────────────────────────────────────────┐
│ 1. Scope check                                  │
│    diff intended_files vs actual_files_touched  │
│    → out_of_scope_violations[]                  │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 2. Promise check                                │
│    for each promise:                            │
│      collect evidence (test output, diff, etc.) │
│      → status: passed | failed | skipped        │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 3. Risk delta                                   │
│    planned_risk (from contract)                 │
│    observed_risk (from actual work)             │
│    → risk_delta: { planned, observed, drift }   │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────┐
│ 4. Composite verdict                            │
│    pass | partial | fail                        │
│    + actionable next steps                      │
└────────────────────────────────────────────────┘
```

---

## Composite verdict logic

| Condition | Verdict |
|---|---|
| All promises passed, no scope violations, risk drift ≤ 0 | `pass` |
| ≥80% promises passed, ≤2 minor scope violations, risk drift ≤ 1 level | `partial` |
| Any hard floor violated, scope violations > 2, or risk drift > 1 level | `fail` |

`partial` verdicts include a list of unmet items and a recommended follow-up.

---

## Verification result schema

The full schema is [`verification-result.schema.json`](../../shared/schemas/verification-result.schema.json). Top-level fields:

| Field | Type | Meaning |
|---|---|---|
| `contract_id` | uuid | The signed contract being verified |
| `executed_at` | ISO 8601 | When the agent finished |
| `scope_check.actual_files_touched` | string[] | Files the agent actually modified |
| `scope_check.out_of_scope_violations` | string[] | Files modified that were out of scope |
| `promise_check` | object[] | Per-promise status + evidence |
| `risk_delta` | object | `planned`, `observed`, `drift`, `floor_violations[]` |
| `composite_verdict` | enum | `pass` \| `partial` \| `fail` |
| `rollback_to_intent` | string? | Path to a snapshot if available |
| `next_steps` | string[] | Actionable follow-up actions |

---

## Rollback to intent

If the verdict is `fail` and a pre-execution snapshot exists, the engine emits a `rollback_to_intent` path. The user can run `synarc rollback <contract_id>` to revert.

Snapshots are created on `sign` if the `snapshot` flag is set in the contract (default: `true` for `risk_cap: HIGH+`).

---

## CI integration

In CI, the verification result is the gate:

```yaml
- name: Run synarc
  run: npx synarc-universal@latest fresh --target all --yes
- name: Verify
  run: npx synarc-universal@latest verify --json
- name: Check intent contracts (if any)
  run: |
    for c in contracts/*.json; do
      node -e "import('synarc-universal').then(m => m.verifyContract('$c'))"
    done
```

---

## See also

- [Intent Contracts](./intent-contracts.md) — pre-execution
- [Audit Trail](./audit.md) — post-verification record
