# Risk Ladder

6 risk levels. Every action has a risk level. Aggregate session risk is the maximum risk across all actions in the session.

## The 6 levels

| Level | Score | Definition | Examples |
|-------|-------|------------|----------|
| INFO | 0 | Read-only, no mutation, no side effects | Read file, search, list |
| LOW | 1 | Reversible local change, no contract impact | Add a comment, rename local var |
| MEDIUM | 2 | Module-scoped change with tests | Add a function, fix a bug with test |
| HIGH | 3 | Cross-module or contract-adjacent | Change a function signature, deploy to staging |
| CRITICAL | 4 | Production or irreversible | `git push` to main, prod deploy, schema migration |
| CATASTROPHIC | 5 | Data loss, security breach, or compliance violation | DROP TABLE, leaked secret, GDPR breach |

CATASTROPHIC is reserved for situations that have already occurred or are imminent. It is not a planning level — it is an incident level.

## Risk elevation rules

Some changes auto-elevate. These overrides the WorkType risk floor.

| Condition | Floor | Reason |
|-----------|-------|--------|
| File in `auth/`, `crypto/`, `permissions/`, `secrets/`, `keys/`, `.env*` | HIGH | Security-sensitive directories |
| SQL migration without a down | HIGH | One-way data change |
| Public API or schema change | HIGH | Consumers break silently |
| Production environment | CRITICAL | Real users, real money |
| Change touches PII or regulated data | HIGH | Compliance scope |
| Change is in a hot path (> 1000 RPS) | HIGH | Blast radius is large |
| Change involves a third-party API with rate limits | MEDIUM | Quota exhaustion risk |
| Change is the first deploy of a new service | HIGH | New code paths are unproven |

## Aggregate risk

The session's aggregate risk is the highest risk across all actions in the session. Escalate to a checkpoint when aggregate risk reaches HIGH.

A checkpoint is a snapshot of: classified state, ledger so far, aggregate risk, declared scope, files touched, and rollback state. Checkpoints go to `brain/checkpoints/<ISO-timestamp>.md`. They enable resume after interruption.

## Risk emission

Risk must be stated on every classification line:

```text
WorkType: FIX | Risk: MEDIUM
```

When emitting a ledger entry:

```text
[LEDGER 2026-06-04T14:32:11Z]
WorkType: FIX
Risk: MEDIUM
Files: src/services/user.js
Contracts: none
Breaking: NO
Rollback: git revert HEAD
```

When aggregate risk escalates, emit a banner:

```text
[RISK ESCALATION]
Previous: LOW
Current: HIGH
Reason: <one-line>
Action: <checkpoint written | hand-off triggered | stop requested>
```

## Gotchas

- Never state a lower risk to "make it look safer". The user needs the truth.
- "It's just a small change" is a banned phrase. State the actual risk.
- If a directory contains `auth/`, the whole repository does not auto-elevate. Only the files in that directory.
- LOW is not a synonym for "skip the workflow". The workflow is mandatory at all risk levels. LOW just means the rollback is simple.
- CRITICAL is a request for explicit confirmation, not refusal. Some CRITICAL actions are correct and necessary. Get the confirmation, then proceed.
- If you find yourself reclassifying a CRITICAL as MEDIUM to "be helpful", stop. The reclassification is a violation of the protocol.
