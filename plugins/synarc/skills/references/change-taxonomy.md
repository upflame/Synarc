---
title: Change Taxonomy
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - taxonomy
  - change-types
  - classification
  - universal
---

# Purpose

I classify every change in any codebase by work type, risk, breadth, reversibility, urgency, detectability, and blast radius.

# Scope

All change dimensions applicable to any project scale, stack, or team. Does not cover project management states.

# Inputs

Git diff, commit messages, issue tracker metadata, user intent, file change patterns.

# Output

A classified change with risk level, breakage flags, and recommended injection level.

# Notes

All dimensions compose: one change has one value per dimension. Taxonomy is universal across project sizes.

# Dimension 1: Work Type

## FEATURE

New functionality added to the system.

| Sub-type | Description | Risk default |
|---|---|---|
| `FEATURE:PLANNED` | Pre-specified, ticket exists, intent declared first | MEDIUM |
| `FEATURE:UNPLANNED` | Discovered during work, no prior spec | HIGH |
| `FEATURE:SPIKE` | Experimental, may not ship, proof-of-concept | LOW |
| `FEATURE:FLAG` | Feature behind a flag — ships but not activated | MEDIUM |

Cognition behavior: capture intent before implementation, map which modules are touched, track as PLANNED or UNPLANNED, emit feature log entry on completion.

## FIX

Correcting existing behavior that is wrong, broken, or unsafe.

| Sub-type | Description | Risk default |
|---|---|---|
| `FIX:BUG` | Incorrect logic or output | HIGH |
| `FIX:CRASH` | Runtime exception, unhandled error, process death | HIGH |
| `FIX:REGRESSION` | Previously working, broke by a recent change | HIGH |
| `FIX:SECURITY` | Auth bypass, injection, exposure, unsafe operation | CRITICAL |
| `FIX:DATA` | Corrupt data, wrong migration, data inconsistency | CRITICAL |
| `FIX:PERFORMANCE` | Timeout, memory leak, slow query, CPU spike | MEDIUM |
| `FIX:SILENT` | No exception, wrong result, swallowed error | HIGH |
| `FIX:FLAKE` | Non-deterministic failure, intermittent issue | HIGH |
| `FIX:TYPO` | Naming, string, comment — no behavior change | INFO |
| `FIX:DEPENDENCY` | Library version bump to fix a known CVE or bug | HIGH |

Cognition behavior: execute full Error Intelligence protocol (SKILL.md S6), always check if fix introduces new risk, always ask what test covers this and write it if missing.

## REFACTOR

Code restructuring with no behavior change.

| Sub-type | Description | Risk default |
|---|---|---|
| `REFACTOR:EXTRACT` | Move logic into a function, module, or service | MEDIUM |
| `REFACTOR:RENAME` | Rename symbol, file, module, or route | HIGH (public) |
| `REFACTOR:REORGANIZE` | Move files or directories | MEDIUM |
| `REFACTOR:SIMPLIFY` | Reduce complexity, remove dead code | LOW |
| `REFACTOR:PATTERN` | Apply design pattern, standardize approach | MEDIUM |
| `REFACTOR:TYPE` | Add/improve types, generics, interfaces | LOW |
| `REFACTOR:PERF` | Algorithmic improvement, data structure change | MEDIUM |

Cognition behavior: verify behavior stays identical, flag public symbol rename as BREAKING, flag module move without re-export as BREAKING.

## SCHEMA

Any change to structured data definitions.

| Sub-type | Description | Risk default |
|---|---|---|
| `SCHEMA:DB_ADD` | New column or table — additive | MEDIUM |
| `SCHEMA:DB_REMOVE` | Column or table removed | CRITICAL |
| `SCHEMA:DB_RENAME` | Column or table renamed | CRITICAL |
| `SCHEMA:DB_TYPE` | Column type changed | CRITICAL |
| `SCHEMA:DB_INDEX` | Index added or removed | MEDIUM |
| `SCHEMA:EVENT_ADD` | New field in event payload — additive | LOW–MEDIUM |
| `SCHEMA:EVENT_REMOVE` | Field removed from event payload | CRITICAL |
| `SCHEMA:EVENT_RENAME` | Field renamed in event payload | CRITICAL |
| `SCHEMA:MODEL` | ORM model / Pydantic schema / Zod schema changed | HIGH |
| `SCHEMA:CONFIG` | Config schema (JSON/YAML shape) changed | HIGH |
| `SCHEMA:PROTO` | Protobuf / gRPC definition changed | HIGH–CRITICAL |
| `SCHEMA:OPENAPI` | OpenAPI spec changed | HIGH |

Cognition behavior: always produce deployment order recommendation, always state what breaks and who is affected, REMOVE/RENAME always CRITICAL with breaking change analysis.

## CONTRACT

Change to a boundary between two components.

| Sub-type | Description | Risk default |
|---|---|---|
| `CONTRACT:ROUTE_ADD` | New HTTP route — additive | LOW |
| `CONTRACT:ROUTE_REMOVE` | HTTP route removed | CRITICAL |
| `CONTRACT:ROUTE_CHANGE` | Route path or method changed | CRITICAL |
| `CONTRACT:PARAM_ADD` | New required parameter | CRITICAL |
| `CONTRACT:PARAM_REMOVE` | Parameter removed | CRITICAL |
| `CONTRACT:RESPONSE` | Response shape changed | HIGH |
| `CONTRACT:STATUS_CODE` | HTTP status code returned changed | HIGH |
| `CONTRACT:FUNCTION` | Function signature changed in shared module | HIGH |
| `CONTRACT:EXPORT` | Public export added, removed, or renamed | HIGH |
| `CONTRACT:INTERFACE` | TypeScript interface / abstract class changed | HIGH |
| `CONTRACT:WEBHOOK` | Webhook payload or trigger changed | HIGH |

## CONFIG

Operational configuration changes.

| Sub-type | Description | Risk default |
|---|---|---|
| `CONFIG:ENV_ADD` | New required env var | HIGH |
| `CONFIG:ENV_REMOVE` | Env var removed | HIGH |
| `CONFIG:ENV_RENAME` | Env var renamed | CRITICAL |
| `CONFIG:ENV_DEFAULT` | Default value changed | MEDIUM |
| `CONFIG:FLAG` | Feature flag added/changed/removed | MEDIUM |
| `CONFIG:SECRET` | Secret or credential changed | CRITICAL |
| `CONFIG:TIMEOUT` | Timeout or retry config changed | MEDIUM |
| `CONFIG:LIMIT` | Rate limit or quota changed | MEDIUM |
| `CONFIG:CICD` | Pipeline config changed (GitHub Actions, Jenkins) | HIGH |

## INFRA

Infrastructure and deployment changes.

| Sub-type | Description | Risk default |
|---|---|---|
| `INFRA:DOCKER` | Dockerfile or compose changed | HIGH |
| `INFRA:K8S` | Kubernetes manifest changed | HIGH |
| `INFRA:TERRAFORM` | Cloud resource changed | HIGH |
| `INFRA:NETWORK` | Network policy, ingress, firewall changed | CRITICAL |
| `INFRA:SCALING` | Replica count, autoscale config changed | MEDIUM |
| `INFRA:STORAGE` | Volume, S3 bucket, storage class changed | HIGH |
| `INFRA:IAM` | Permissions, roles, policies changed | CRITICAL |
| `INFRA:MONITORING` | Alerts, dashboards, logging changed | MEDIUM |
| `INFRA:DEPENDENCY` | Third-party service added or removed | HIGH |

## EXPERIMENT

Experimental or exploratory work — POC, spike, prototype, "try this."

| Sub-type | Description | Risk default |
|---|---|---|
| `EXPERIMENT:SPIKE` | Proof-of-concept, may not ship | LOW |
| `EXPERIMENT:PROTOTYPE` | Working model, not production-ready | LOW |
| `EXPERIMENT:A_B_TEST` | Production A/B test with small traffic | MEDIUM |

Cognition behavior: every EXPERIMENT must have an expiry. If still running past expiry, re-classify as FEATURE:PLANNED or delete.

## DOCS

Documentation-only changes — README, comments, diagrams, ADRs, guides.

| Sub-type | Description | Risk default |
|---|---|---|
| `DOCS:README` | README or project docs updated | INFO |
| `DOCS:COMMENT` | Inline code comments updated | INFO |
| `DOCS:API` | API documentation updated | MEDIUM |
| `DOCS:COMPLIANCE` | Compliance or regulatory docs updated | HIGH |
| `DOCS:RUNBOOK` | Operations or incident runbook updated | MEDIUM |

Cognition behavior: verify docs match implementation. Incorrect API docs cause integration errors. Incorrect runbooks cause incident response errors.

## ANALYSIS

Investigating or understanding existing code — no mutation.

| Sub-type | Description | Risk default |
|---|---|---|
| `ANALYSIS:EXPLAIN` | "Explain this code" or "what does X do" | INFO |
| `ANALYSIS:DEBUG` | Investigate root cause without fixing | INFO |
| `ANALYSIS:DIFF` | Review a diff or PR for risk | INFO |
| `ANALYSIS:IMPACT` | Determine blast radius of a proposed change | INFO |

Cognition behavior: ANALYSIS never modifies code. Always emit findings as a structured analysis. If analysis discovers a bug that needs fixing, classify the fix separately as FIX.

## PLAN

Feature planning, roadmap, architecture decision — no code written.

| Sub-type | Description | Risk default |
|---|---|---|
| `PLAN:FEATURE` | Plan a new feature's implementation | MEDIUM |
| `PLAN:ARCHITECTURE` | Architecture decision record or RFC | MEDIUM |
| `PLAN:MIGRATION` | Plan a data or service migration | HIGH |

Cognition behavior: PLAN produces design artifacts, not code. Risk represents the complexity of what is being planned, not runtime impact.

## INCIDENT

Production-affecting emergency response.

| Sub-type | Description | Risk default |
|---|---|---|
| `INCIDENT:OUTAGE` | Service unavailable to users | CRITICAL |
| `INCIDENT:DATA_LOSS` | Data deleted, corrupted, or inaccessible | CRITICAL |
| `INCIDENT:SECURITY` | Breach, exposure, or unauthorized access | CRITICAL |
| `INCIDENT:DEGRADED` | Service partially working, error rate elevated | CRITICAL |
| `INCIDENT:ROLLBACK` | Reverting a recent deployment | CRITICAL |
| `INCIDENT:MITIGATION` | Hotfix or workaround applied, root cause pending | CRITICAL |

Cognition behavior: override all other priorities, produce immediate impact assessment, affected users/data, rollback path, auto-emit full incident snapshot + mitigation plan, track in INCIDENT_SNAPSHOT.md.

# Dimension 2: Planned vs Unplanned

| Status | Criteria |
|---|---|
| `PLANNED` | Intent declared before implementation; ticket or spec exists |
| `UNPLANNED` | Change emerged reactively; no prior declaration |

Rule: if the scope of a PLANNED task expands beyond its spec, the expansion must be reclassified as UNPLANNED and flagged.

# Dimension 3: Breadth

| Breadth | Meaning |
|---|---|
| `LOCAL` | Single function or class |
| `MODULE` | Single module or service |
| `CONTRACT` | Public API surface of a module |
| `CROSS_MODULE` | Multiple modules, one repo |
| `CROSS_SERVICE` | Multiple services or packages |
| `SYSTEM` | System-wide: shared infra, global schema, all services |

# Dimension 4: Reversibility

| Reversibility | Meaning | Examples |
|---|---|---|
| `SAFE` | Fully reversible with no side effects | Add optional field, add endpoint |
| `CAREFUL` | Reversible with coordination | Rename with re-export alias |
| `HARD` | Reversible but complex, requires migration | DB column remove, API deprecate |
| `IRREVERSIBLE` | Cannot be undone cleanly without data loss | Hard delete, schema destructive |

# Dimension 5: Urgency

| Urgency | Meaning | Examples |
|---|---|---|
| `IMMEDIATE` | Must be resolved now — users actively impacted | Production outage, security breach |
| `TODAY` | Must be resolved within hours | Degraded performance, data corruption |
| `THIS_SPRINT` | Before next deployment cycle | Bug fix, dependency update |
| `SCHEDULED` | Part of planned roadmap | Feature, refactor, tech debt |
| `DEFERRABLE` | Can wait without user impact | Cosmetic, documentation, code style |

Rule: INCIDENT worktype always maps to IMMEDIATE or TODAY urgency. Any IMMEDIATE non-INCIDENT is likely misclassified.

# Dimension 6: Detectability

| Detectability | Meaning | Examples |
|---|---|---|
| `IMMEDIATE` | Would cause an alert within seconds | Crash, p99 spike, error rate jump |
| `DELAYED` | Would surface after minutes or hours | Data corruption, silent wrong answer |
| `USER_REPORTED` | No monitoring — user tells you | Wrong label, cosmetic, missing feature |
| `UNDETECTABLE` | Never caught — no monitor, no user report | Log-level-only changes, unused codepaths |

Rule: if risk is CRITICAL or HIGH and detectability is USER_REPORTED or UNDETECTABLE, the change must include a monitoring or alerting addition.

# Dimension 7: Blast Radius

| Radius | Meaning |
|---|---|
| `SINGLE_USER` | Affects at most one user session |
| `TENANT` | Affects one tenant, organization, or customer |
| `FEATURE` | Affects one feature area |
| `SERVICE` | Affects one service or module |
| `MULTI_SERVICE` | Affects multiple services via contract/schema changes |
| `PLATFORM` | Affects all services — shared infra, global config |
| `ALL_USERS` | Affects every user of the system |
| `DATA_INTEGRITY` | Affects correctness of stored data |

Composite rule: blast radius + risk level determines deployment strategy. ALL_USERS + CRITICAL = staged rollout mandatory. DATA_INTEGRITY + any risk = need data validation + rollback plan.

# Composite Classification

Final classification is MAX of all applicable dimensions:

```
composite_risk = MAX(worktype_risk, domain_risk, blast_radius_risk, data_risk, urgency_adjusted)
```

When uncertain: always choose the higher risk. A wrong HIGH classification causes extra review (safe). A wrong LOW classification causes production outages (dangerous).

# Classification Anti-Patterns

- **Classification by effort, not impact:** 3 lines in auth middleware = CRITICAL. The size of the change does not correlate with its risk.
- **"Just config" minimization:** A TIMEOUT default change from 30s to 5s breaks every caller that doesn't set timeout explicitly.
- **Scope creep classification bleed:** When a task touches CSS + auth + data model, classification must reflect the highest-risk change, not the original intent.
- **Optimistic classification:** Assumes best-case execution (small table, no load). Realistic classification assumes normal production conditions.

# Hard Floors by Domain

Risk floors cannot be lowered. These are minimums:

| Domain | Minimum Risk | Reasoning |
|---|---|---|
| Auth, billing, payments, security | HIGH | Revenue, access, or trust impact |
| Database schema change | MEDIUM (CRITICAL if remove/rename) | Data integrity and migration complexity |
| Environment variable add/remove/rename | HIGH (CRITICAL if rename) | Affects all deployments |
| Public API response change | HIGH | All consumers must adapt |
| Public symbol rename | HIGH | Callers break until updated |
| Network or IAM config | CRITICAL | Security boundary changes |
| INCIDENT response | CRITICAL | Production emergency |

Per-industry floors apply when detectable:
- FinTech: any payment processing code → CRITICAL floor. Currency, fee, or transaction logic is never MEDIUM.
- Healthcare (HIPAA): any PHI-touching code → CRITICAL floor. A logging change that touches PHI is CRITICAL.
- E-Commerce: pricing, tax, or checkout code → CRITICAL floor. Errors cost real revenue.
- Enterprise/B2B: any customer integration contract → CRITICAL floor. Breaking a customer's integration is a P1.
- SaaS: tenant isolation or SSO code → CRITICAL floor. Multi-tenant data leakage is unrecoverable.

# Risk Escalation Ladder

When cumulative risk rises during a session:

| Level | State | Action |
|---|---|---|
| 0 | All changes MEDIUM or below | Normal workflow |
| 1 | One change reaches HIGH | Surface in next checkpoint |
| 2 | Two+ changes reach HIGH | Stop, document escalation, confirm before continuing |
| 3 | Any change reaches CRITICAL | STOP. Surface to all stakeholders. Full reassessment. |
| 4 | CRITICAL + UNPLANNED | Full stop. Must be understood, assessed, and explicitly approved. |
| 5 | INCIDENT during non-incident task | Switch to incident response. Original task is secondary. |

# Deployment Strategy by Classification

| Risk | Blast Radius | Strategy |
|---|---|---|
| CRITICAL | ALL_USERS | Staged rollout (1% → 5% → 20% → 100%) with kill switch |
| CRITICAL | DATA_INTEGRITY | Migration with validation before AND after |
| HIGH | ALL_USERS/PLATFORM | Staged rollout (10% → 50% → 100%) |
| HIGH | SERVICE/MULTI_SERVICE | Standard deploy with extra monitoring |
| MEDIUM | any | Standard deploy |
| LOW | any | Direct merge |
| INFO | any | Auto-deploy |

# Classification Across the SDLC

**Pre-development:** Declare expected WorkType, Risk, Breadth, and affected files in the ticket. If you can't classify during planning, you don't understand the work enough to plan it.

**Development:** Classify every tool call. Compare against pre-classification. Each deviation is an UNPLANNED flag. If 2+ files are UNPLANNED, pause and re-scope.

**Code review:** Validate classification accuracy. Catch misclassifications. If reviewer disagrees, discuss and document the corrected classification in PR comments.

**Pre-deploy:** CRITICAL requires migration plan, rollback plan, monitoring addition (if detectability is USER_REPORTED or UNDETECTABLE), and sign-off from author + reviewer. INCIDENT bypasses gates but requires post-mortem within 72h.

**Post-deploy:** Monitor error rates and business metrics for CRITICAL changes for 1 hour minimum. If incident occurs, re-classify as INCIDENT and start incident response.

**Post-mortem:** Review classification accuracy. Was the change correctly classified? Was UNPLANNED scope flagged? What systemic change prevents this misclassification?
