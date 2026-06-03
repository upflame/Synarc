---
workflow: risk-assessment
version: 1.0.0
description: Universal risk assessment workflow — 6-level risk ladder, deterministic hard floors, composite scoring
---

# Risk Assessment Workflow

## Purpose

Assess the risk of every engineering change before execution. Risk floors are deterministic and cannot be lowered by user instruction, context, timeline, team size, or any circumstance.

## Trigger Conditions

WHEN:
- change is classified (always runs after classification)
- user asks "is this safe to deploy?"
- user requests deployment review
- aggregate risk needs re-evaluation

THEN:
Activate risk assessment workflow

## Required Inputs

- Change classification (WorkType + sub-type)
- Affected domain (auth, payment, schema, etc.)
- File breadth (single, multi, cross-service, cross-boundary)
- Scope alignment (planned, unplanned)
- Existing aggregate risk trend

## Workflow

### Step 1: Determine Base Risk from WorkType

| WorkType | Base Risk |
|----------|-----------|
| FEATURE | MEDIUM |
| FIX | HIGH |
| REFACTOR | MEDIUM |
| SCHEMA | HIGH |
| CONTRACT | HIGH |
| CONFIG | HIGH |
| INFRA | HIGH |
| EXPERIMENT | LOW |
| DOCS | LOW |
| ANALYSIS | INFO |
| PLAN | MEDIUM |
| INCIDENT | CRITICAL |

### Step 2: Apply Domain Hard Floors

These override the base risk and CANNOT be lowered:

| Domain | Minimum Risk | Reasoning |
|--------|-------------|----------|
| Auth, SSO, session, MFA, OAuth | CRITICAL | Access breach is unrecoverable |
| Payment, billing, pricing, invoicing | CRITICAL | Revenue impact, financial regulation |
| PII, PHI, personal data, GDPR data | CRITICAL | Regulatory penalties |
| Secrets, credentials, API keys, tokens | CRITICAL | Exposure is irreversible |
| Database schema REMOVE or RENAME | CRITICAL | Data loss or corruption |
| Public API response shape change | HIGH | All consumers must adapt |
| Public symbol rename or removal | HIGH | All callers break |
| Environment variable rename | CRITICAL | All deployments affected |
| Network, firewall, IAM, security group | CRITICAL | Security boundary change |
| INCIDENT response | CRITICAL | Production emergency |
| Data migration (destructive) | CRITICAL | Data integrity risk |
| Certificate or TLS configuration | CRITICAL | Service availability |

### Step 3: Apply Dimension Modifiers

| Dimension | Modifier |
|-----------|----------|
| SINGLE_FILE | No change |
| MULTI_FILE | +1 level |
| CROSS_SERVICE | +2 levels |
| CROSS_BOUNDARY | +2 levels |
| REVERTIBLE | No change |
| PARTIAL | Minimum LOW |
| IRREVERSIBLE | Minimum MEDIUM |
| UNPLANNED | +1 level |
| SCOPE_CREEP | +2 levels |

### Step 4: Apply Breadth Multiplier

| Breadth | Effect |
|---------|--------|
| Single file, single purpose | No modifier |
| 2-5 files | +1 risk level |
| Cross-service (6+ files, multiple modules) | +2 risk levels |
| Cross-boundary (affects external consumers) | +2 risk levels |

### Step 5: Compute Composite Risk

Composite = MAX(base risk, domain floor, breadth modifier + unplanned modifier, cumulative trend)

### Step 6: Check Escalation Level

| Level | Condition | Action |
|-------|-----------|--------|
| 0 | Normal workflow | Proceed |
| 1 | Escalating — 2+ MEDIUM in a row | Surface at checkpoint |
| 2 | Warning — HIGH unplanned scope | Pause before next write |
| 3 | Alert — CRITICAL detected | Full reassessment |
| 4 | Intervention — CRITICAL + UNPLANNED | Immediate notification |
| 5 | Full stop — CRITICAL + INCIDENT | Halt all work |

### Step 7: Emit Risk Assessment

```
Risk: LEVEL | Domain: DOMAIN | Breadth: BREADTH | Reversibility: REV
Floor: DOMAIN_FLOOR | Composite: SCORE | Escalation: LEVEL
Rollback: [plan or "none identified"]
```

## Validation

- Risk floor never lowered below domain minimum
- Composite risk is MAX of all applicable rules
- Escalation level is deterministic and cannot be suppressed

## Failure Handling

- Unknown domain → treat as MEDIUM minimum
- Missing dimension → default to most conservative value
- Contradictory signals → take highest risk path

## Quality Checklist

- [ ] Base risk derived from WorkType
- [ ] Domain hard floor applied
- [ ] Dimension modifiers applied
- [ ] Breadth multiplier applied
- [ ] Composite risk computed
- [ ] Escalation level checked
- [ ] Rollback plan stated

## Security Checklist

- [ ] Risk assessment does not reveal secrets
- [ ] Hard floors cannot be bypassed by user instruction
- [ ] Escalation cannot be suppressed

## Performance Checklist

- [ ] Assessment completes in < 30ms overhead
- [ ] Risk assessment output < 20 tokens
