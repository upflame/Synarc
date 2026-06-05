---
workflow: change-classification
version: 1.0.0
description: Universal change classification workflow — 12 WorkTypes, 7 dimensions, deterministic classification
---

# Change Classification Workflow

## Purpose

Classify every engineering interaction before execution. Classification is the foundation of risk assessment, quality gates, session tracking, and deployment decisions.

## Trigger Conditions

WHEN:
- user requests code change
- user reports error or bug
- user asks for architecture review
- user initiates deployment
- user requests planning or design
- any file modification is performed

THEN:
Activate change classification workflow

## Required Inputs

- User intent or request description
- Current scope declaration (explicit or inferred)
- File content before modification (for edits)
- Project context (language, framework, architecture)

## Workflow

### Step 1: Determine Primary WorkType

| WorkType | Description | Risk Default | When Used |
|----------|-------------|-------------|-----------|
| FEATURE | New functionality, additive behavior | MEDIUM | "Add X", "build Y", "implement Z" |
| FIX | Bug, error, crash, regression | HIGH | "broken", "not working", error trace |
| REFACTOR | Restructure without behavior change | MEDIUM | "clean up", "extract", "reorganize" |
| SCHEMA | Data model, migration, field change | HIGH | DB migration, model change, event shape |
| CONTRACT | API boundary, type export, signature | HIGH | Route change, response shape, function sig |
| CONFIG | Environment, flags, secrets, CI/CD | HIGH | ENV vars, config files, deployment params |
| INFRA | Infrastructure, deployment, platform | HIGH | Docker, K8s, Terraform, cloud, network |
| EXPERIMENT | POC, prototype, spike, research | LOW | "try this", "test if", "explore" |
| DOCS | Documentation, comments, guides | LOW | README, ADRs, comments, diagrams |
| ANALYSIS | Understanding, explanation, research | INFO | "explain", "what does", "how does" |
| PLAN | Planning, design, architecture | MEDIUM | Roadmap, ADR, feature planning |
| INCIDENT | Production issue, outage, security | CRITICAL | Pager alert, outage, data problem, CVE |

### Step 2: Determine Planned vs Unplanned

Every change is sub-classified as PLANNED or UNPLANNED.

- **PLANNED**: Described by user before coding began
- **UNPLANNED**: Discovered during work

When UNPLANNED is detected, emit before execution:

```
UNPLANNED CHANGE DETECTED
Declared scope: [original task]
Actual change: [what expanded]
Reason: [why encountered]
Additional risk: [level]
Recommendation: [proceed with awareness / separate PR / defer]
```

### Step 3: Apply Sub-Type Classification

Apply granular sub-type based on the specific change details:

**FEATURE sub-types:** PLANNED, UNPLANNED, SPIKE, FLAG, MVP, ITERATION, MIGRATION
**FIX sub-types:** BUG, CRASH, REGRESSION, SECURITY, DATA, PERFORMANCE, SILENT, FLAKE, DEPENDENCY, CONFIG, UI, TYPING
**REFACTOR sub-types:** EXTRACT, RENAME, REORGANIZE, SIMPLIFY, PATTERN, TYPE, PERF, API, CONTRACT
**SCHEMA sub-types:** DB_ADD, DB_REMOVE, DB_RENAME, DB_TYPE, DB_INDEX, DB_CONSTRAINT, EVENT_ADD, EVENT_REMOVE, EVENT_RENAME, MODEL, CONFIG, PROTO, OPENAPI, GRAPHQL, CACHE
**CONTRACT sub-types:** ROUTE_ADD/REMOVE/CHANGE, PARAM_ADD/REMOVE/RENAME/TYPE, RESPONSE_ADD/REMOVE/RENAME/TYPE, STATUS_CODE, HEADER, FUNCTION_SIG, EXPORT, INTERFACE, WEBHOOK, AUTH, RATE_LIMIT, ERROR
**CONFIG sub-types:** ENV_ADD/REMOVE/RENAME/VALUE/DEFAULT, FLAG, SECRET, TIMEOUT, LIMIT, RETRY, REGION, LOG_LEVEL, FEATURE
**INFRA sub-types:** DOCKER, K8S, TERRAFORM, NETWORK, SCALING, STORAGE, IAM, MONITORING, DEPENDENCY, CI, CD, BACKUP, COMPUTE, REGION, COST
**EXPERIMENT sub-types:** SPIKE, POC, PROTOTYPE, EVAL, BENCHMARK, A_B_TEST, FEASIBILITY
**INCIDENT sub-types:** OUTAGE, DATA_LOSS, SECURITY, DEGRADED, ROLLBACK, MITIGATION, PERFORMANCE, COMPLIANCE, DEPLOYMENT_FAILURE, CAPACITY

### Step 4: Assign Classification Confidence

| Confidence Level | Meaning | Action |
|-----------------|---------|--------|
| CERTAIN | Clear intent, explicit request | Proceed normally |
| LIKELY | Strong signal, some ambiguity | Classify with note |
| UNCERTAIN | Weak signal, multiple interpretations | Ask one clarifying question |
| CONTRADICTED | Conflicting signals | Stop, resolve contradiction |

### Step 5: Record Classification

Output in format:
```
[timestamp] WorkType:SUB_TYPE | Risk: LEVEL | Scope: ALIGNMENT | Confidence: LEVEL
```

## Ambiguity Resolution

| Ambiguity | Resolution | Rationale |
|-----------|-----------|----------|
| FIX vs FEATURE | FIX | Conservative — treat unknown behavior changes as bugs |
| REFACTOR vs FIX | FIX | Behavior may have changed — verify identical output |
| CONFIG vs INFRA | INFRA | Higher blast radius |
| DOCS vs CONTRACT | CONTRACT | Docs describing a contract = contract change |
| EXPERIMENT touching production | FEATURE or FIX | Experiment safety stops at production |
| SCHEMA vs CONFIG | SCHEMA | Schema changes data structure |
| FEATURE vs REFACTOR | FEATURE | Adding behavior vs preserving it |

## Validation

- Every change has a WorkType before execution
- Classification is unambiguous or user has been asked
- UNPLANNED changes are flagged before execution

## Failure Handling

- Ambiguous input → classify as ANALYSIS with INFO risk until clarified
- Contradicted signals → stop, ask user for clarification
- Multi-type changes → classify each independently, composite = highest risk

## Quality Checklist

- [ ] WorkType assigned
- [ ] Sub-type assigned
- [ ] Planned/Unplanned determined
- [ ] Confidence level assigned
- [ ] Classification recorded in session ledger
- [ ] User notified of UNPLANNED changes

## Security Checklist

- [ ] Classification does not reveal secrets or PII
- [ ] UNPLANNED flag does not bypass other security controls
- [ ] Highest-risk classification used for ambiguous cases

## Performance Checklist

- [ ] Classification completes in < 50ms reasoning overhead
- [ ] Classification output < 15 tokens
