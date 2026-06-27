---
title: Risk Assessment
description: How Synarc produces a deterministic 6-level risk assessment for every change. Base risk, hard floors, dimension modifiers, composite, escalation.
version: 6.6.4
schema: skill-pack/v1
---

# Risk Assessment

> Risk is **deterministic**, **explainable**, and **non-bypassable**. Every assessment emits a structured object that matches `risk-assessment.schema.json`.

---

## The five inputs

| Input | Source | Mutability |
|---|---|---|
| WorkType | Change classification | Fixed by WorkType |
| Domain keywords | Intent + file diff | Auto-detected, hard floors applied |
| Dimension scores | Code analysis | Computed |
| Aggregate (session) | Recent ledger entries | Read-only |
| User-set cap | Intent Contract (optional) | User can lower; never raise above composite |

---

## The algorithm

```pseudocode
FUNCTION assess(change, intent, session):
  work_type = classify(change, intent)               # 12 WorkTypes
  base      = default_risk[work_type]                # see work-types.md
  floors    = apply_hard_floors(change, intent)      # domain keywords
  dims      = score_dimensions(change)               # 7 dimensions
  agg       = session.aggregate_risk                 # running session risk
  user_cap  = contract.risk_cap                      # optional, never raises

  composite = max(base, max(floors), max(dims), agg * 0.5)
  composite = min(composite, user_cap)               # user can only lower

  IF any floor > composite:
    RETURN violation(floors, composite)              # contract invalid

  escalation = derive_escalation(composite)
  rollback   = compute_rollback_path(change)

  RETURN {
    work_type, base, floors, dims, agg, user_cap,
    composite, escalation, rollback
  }
```

---

## Escalation ladder

| Composite risk | Escalation | What the runtime does |
|---|---|---|
| `INFO` | `none` | Proceed silently |
| `LOW` | `none` | Proceed with low-noise tracking |
| `MEDIUM` | `none` | Proceed with full ledger tracking |
| `HIGH` | `warning` | Emit impact statement, require ack on next tool call |
| `CRITICAL` | `checkpoint` | Pause, require explicit confirmation, snapshot files |
| `BLAST` | `block` | Block until human review |

---

## Hard floors (non-bypassable)

Hard floors are domain-keyword-driven. The current set:

| Keyword (intent or diff) | Floor | Notes |
|---|---|---|
| `payment`, `billing`, `charge`, `refund` | `CRITICAL` | Money movement |
| `auth`, `login`, `password`, `token`, `session` | `CRITICAL` | Identity |
| `pii`, `email`, `ssn`, `phone`, `address` | `CRITICAL` | PII |
| `phi`, `medical`, `patient`, `diagnosis` | `CRITICAL` | PHI / HIPAA |
| `secret`, `api_key`, `private_key` | `CRITICAL` | Secrets |
| `delete`, `drop`, `truncate`, `rm -rf` | `HIGH` | Destructive |
| `prod`, `production` | `HIGH` | Production env |
| `migrate`, `schema change`, `alter table` | `HIGH` | Data migration |

The full list is in `shared/guardrails/constitutional-rules.yaml`. Per-skill rules can **add** floors; they cannot **remove** them.

---

## Rollback paths

Every assessment emits a `rollback_path` describing how to revert:

- For file changes → `git revert <sha>` or `git checkout <sha> -- <file>`
- For dep changes → `npm uninstall <pkg>` / `pip uninstall <pkg>`
- For schema changes → the reverse DDL (`ALTER TABLE users DROP COLUMN ...`)
- For config changes → restore from the previous commit
- For data changes → restore from the most recent backup
- For `BLAST` risk → human review required; no auto-rollback

If no rollback path is computable, the risk is escalated to `BLAST`.

---

## See also

- [WorkTypes](./work-types.md) — the 12 WorkTypes and their defaults
- [Intent Contracts](./intent-contracts.md) — where `risk_cap` is set
- [`risk-assessment.schema.json`](../../shared/schemas/risk-assessment.schema.json) — formal spec
