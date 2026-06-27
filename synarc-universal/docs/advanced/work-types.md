---
title: WorkTypes and Classification
description: The 12 WorkTypes, their 7 dimensions, and how Synarc classifies every change deterministically.
version: 6.6.4
schema: skill-pack/v1
---

# WorkTypes and Classification

> Every change is classified into one of 12 WorkTypes. Classification is **deterministic** — same input, same output. Risk floors are hard; they cannot be lowered by user prompt.

---

## The 12 WorkTypes

| ID | WorkType | Default risk | Domain hard floors |
|---|---|---|---|
| `FEATURE` | New user-facing capability | `MEDIUM` | `payment=CRITICAL`, `auth=CRITICAL` |
| `FIX` | Bug fix | `LOW` | `data-loss=CRITICAL`, `auth=CRITICAL` |
| `REFACTOR` | Behavior-preserving restructure | `MEDIUM` | `public-api=CRITICAL` |
| `INCIDENT` | Production incident response | `CRITICAL` | All floors at `CRITICAL` |
| `ANALYSIS` | Read-only investigation | `INFO` | None |
| `DOCS` | Documentation change | `LOW` | None |
| `CONFIG` | Configuration change | `MEDIUM` | `prod=CRITICAL`, `secrets=CRITICAL` |
| `TEST` | Test-only change | `LOW` | `coverage-drop=MEDIUM` |
| `INFRA` | Infrastructure change | `HIGH` | `prod=CRITICAL`, `network=CRITICAL` |
| `DATA` | Data migration or schema change | `HIGH` | `pii=CRITICAL`, `prod=CRITICAL` |
| `MIGRATION` | Code/dependency upgrade | `MEDIUM` | `breaking=CRITICAL` |
| `EXPERIMENT` | A/B test or feature flag | `MEDIUM` | `prod-rollout=HIGH` |

---

## The 7 dimensions

Classification looks at 7 dimensions; each is a heuristic with a numeric score from 0 to 5.

| Dimension | What it measures | Examples |
|---|---|---|
| `file_breadth` | How many files are touched | 1 → 0, 10+ → 5 |
| `reversibility` | How easy to revert | `revertible` → 0, `irreversible` → 5 |
| `scope_alignment` | Is this within the declared scope? | `in_scope` → 0, `out_of_scope` → 5 |
| `public_api` | Does it touch a public API? | `internal` → 0, `public+breaking` → 5 |
| `data_classification` | What data does it touch? | `public` → 0, `pii`/`phi` → 5 |
| `test_coverage` | How well-tested is the change? | `covered` → 0, `untested` → 5 |
| `blast_radius` | Worst-case impact if it fails | `single_user` → 0, `org_wide` → 5 |

The composite dimension score is the max of the 7 (or the 90th percentile for "blast radius" — it is a long-tail risk).

---

## Composite risk

```text
composite_risk = max(
  base_risk(work_type),
  max(hard_floor_applied),
  risk_from_dimensions
)
```

The composite is **never lower** than the WorkType default or any applied hard floor. The dimensions can only **raise** the risk.

---

## The 6-level risk ladder

| Level | Numeric | Action |
|---|---|---|
| `INFO` | 0 | Proceed silently |
| `LOW` | 1 | Proceed with low-noise tracking |
| `MEDIUM` | 2 | Proceed with full ledger tracking |
| `HIGH` | 3 | Checkpoint + impact statement |
| `CRITICAL` | 4 | Checkpoint + explicit confirmation |
| `BLAST` | 5 | Block until human review |

---

## Determinism

Classification is **deterministic** — for the same input (intent, context, file diff), the output (WorkType, dimensions, composite risk) is identical. This is enforced by:

1. No stochastic steps in the classifier
2. Same heuristics on every runtime
3. Same hard floors on every runtime
4. The `risk-assessment.schema.json` contract

This means two agents classifying the same diff will always agree.

---

## Example

```text
User: "Add a column to the users table to track last_login_at"

Detection signals:
  - "users table" → data_classification = pii (contains email, name)
  - "add a column" → data WorkType (schema change)
  - "users" → domain = user-data → pii hard floor

Result:
  work_type       : DATA
  base_risk       : HIGH
  hard_floors     : [{ domain: pii, floor: CRITICAL }]
  composite_risk  : CRITICAL
  escalation      : checkpoint
  rollback_path   : "ALTER TABLE users DROP COLUMN last_login_at"
```

---

## See also

- [Risk Assessment](./risk-assessment.md) — full breakdown
- [`risk-assessment.schema.json`](../../shared/schemas/risk-assessment.schema.json) — formal spec
