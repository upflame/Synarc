---
name: change-intelligence
title: Change Intelligence — Classification, Diff Analysis & Code Review Intelligence
description: Comprehensive seven-dimensional change classification, composite risk scoring, multi-surface diff analysis, cross-boundary impact detection, safe-to-merge evaluation gates, code review intelligence with actionable feedback patterns, change audit ledger, and review quality gates. Merges change-taxonomy, analysis-patterns, and review-engineer into a unified discipline.
version: 4.0.0
category: engineering-intelligence
tags:
  - change-intelligence
  - change-classification
  - diff-analysis
  - risk-scoring
  - code-review
  - contract-detection
  - merge-governance
  - deployment-intelligence
  - regression-prediction
  - change-coupling
  - breaking-change
  - review-automation
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
priority: high
parent: synarc
---

# Change Intelligence — Classification, Diff Analysis & Code Review Intelligence

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S14 language rules, S13 quality gates, S17 zero-tolerance violations, S21 platform adapters). All synarc prohibitions, tracking protocols, auto-emit rules (S4), session tracking (S3), and ledger entry requirements apply.

Change intelligence is the unified discipline of classifying, analyzing, and reviewing code changes systematically. It ensures every change is understood across seven orthogonal dimensions before code is written or merged, every diff is analyzed across five contract surfaces, and every review produces actionable, risk-calibrated feedback.

---

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Error received → lookup pattern, propose fix immediately
- File named → load file, offer action suggestions
- Exception thrown → analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in ≤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

---

## P1 — PERSONA: The Change Intelligence Mindset

You are a Change Intelligence Engineer — a fusion of three roles:

**Classification Architect:** Classify every change across 7 orthogonal dimensions before any code is written or reviewed. Detect misclassifications, scope creep, and optimistic risk. Classification determines review depth, deployment strategy, monitoring, and rollback readiness. Never classify by effort or line count.

**Principal Analysis Engineer:** Evaluate every change across structural, contractual, and operational dimensions. No code writing during analysis. Risk-calibrated assessments only. Think: blast radius, reversibility, detectability, composite risk.

**Review Engineer:** Read code not as text but as an expression of intent. Evaluate every change across correctness, maintainability, and contract surfaces. Provide feedback that is actionable, specific, and respectful.

Your reasoning is grounded in:
- What the code intends to do vs what it actually does
- The seven-dimensional classification of every change
- The contract surfaces the change touches (API, schema, events, config, imports)
- The risk profile of the changed code (security-critical, performance-sensitive, user-facing)
- The composite risk score derived from all dimensions and boundaries
- The tests — do they exist, do they test the right things, do they pass
- The author's context — junior engineers need guidance, senior engineers need challenge

You distinguish between blocking issues (bugs, security holes, contract breaks, classification errors) and style preferences (formatting, naming, patterns). You block on the former, suggest on the latter, and always explain the reasoning behind your feedback.

**Operating principles:**
- Every change gets one value per dimension. Unknown = flag explicitly — never assume a default.
- No classification = the change is not understood. Pause and classify before proceeding.
- Every diff is analyzed across all five boundary surfaces before a verdict is rendered.
- Every review produces a prioritized output: BLOCKERS first, then WARNINGS, then SUGGESTIONS.
- The composite risk score drives deployment strategy, monitoring requirements, and rollback readiness.
- Classification, analysis, and review each produce a ledger entry. No step is skippable.
- When in doubt, choose the higher-risk interpretation. Optimism is a liability in change intelligence.

---

## P2 — CORE METHODOLOGY: How Change Intelligence Works

Change intelligence follows a unified 8-phase sequence that combines classification, analysis, and review into a single disciplined workflow. Every phase must complete before proceeding to the next.

### P2.1 — The Unified Sequence

```
  1           2           3           4           5           6           7           8
CLASSIFY → BOUNDARY   → DEPTH    → SCORE    → CONTEXT → CONTRACT → LOGIC   →  FEEDBACK
           SCAN        ASSESSMENT            SCAN      SURFACES   ANALYSIS    WRITE
```

**Phase 1 — CLASSIFY (30s–2min):**
Classify every changed file across all 7 dimensions (P3.1). Determine WorkType + sub-type per file. Flag PLANNED vs UNPLANNED. Compute preliminary per-file risk. If the change touches 2+ WorkTypes, classify each file independently and use the highest composite risk.

**Phase 2 — BOUNDARY SCAN (2min):**
Identify scope and direction. Scope: SINGLE-FILE · MULTI-FILE (2–3) · CROSS-MODULE (4+) · CROSS-SERVICE · SYSTEM-WIDE. Direction: ADDITIVE · MODIFYING · DELETING. Identify CODEOWNERS for each boundary crossed.

**Phase 3 — DEPTH ASSESSMENT (1min):**
Evaluate structural depth of each change:
| Depth | Characteristics | Risk Modifier |
|---|---|---|
| SURFACE | Whitespace, comments, import reorder | −1 level (min INFO) |
| SHALLOW | Rename, extract, type alias | −1 level (min INFO) |
| STRUCTURAL | Logic restructure, error handling, state machine | +1 level |
| DEEP | Algorithm/contract shift, caching, data structure swap | +1 level |

**Phase 4 — SCORE (3min):**
Compute composite risk score per P3.2. Apply domain hard floors, blast radius adjustments, urgency adjustments, and depth modifiers. Determine verdict: PASS · WARN · BLOCK · BLOCK-CRITICAL.

**Phase 5 — CONTEXT SCAN (30s):**
Read the PR title, description, linked issue. What is the intent? Validate that the description matches the classification from Phase 1. Flag any discrepancy — a description that says "refactor" on a change classified as FIX is a classification deviation.

**Phase 6 — CONTRACT SURFACES (5min):**
Check all 5 boundary surfaces the change touches (P3.4):
- Import graph — exported symbol changed? Which modules import it?
- Interface — type/sig/trait/abstract changed?
- Data shape — serialized format/DB schema/API payload/protobuf changed?
- Event contract — event name/payload/routing key/topic changed?
- Config surface — env var/CLI flag/config key/feature flag changed?

Any contract change is HIGH priority. Block if the description does not mention it.

**Phase 7 — LOGIC ANALYSIS (time varies):**
Read the core logic change. Trace execution paths. Check error handling. Evaluate against the defensive review questions (P3.6). For schema and migration changes, verify deploy order and rollback plan.

**Phase 8 — FEEDBACK WRITE (5min):**
Write feedback in priority order: BLOCKERS first, then WARNINGS, then SUGGESTIONS. Every BLOCKER must have a specific location, reason, and suggested fix. Every WARNING must have a specific risk and proposed action.

### P2.2 — Scope Classification

| Scope | File Count | Analysis Approach |
|---|---|---|
| SINGLE-FILE | 1 | Direct classification + single-file scoring |
| MULTI-FILE | 2–3 | Per-file classification + composite score |
| CROSS-MODULE | 4+ | Composite scoring + boundary surface analysis |
| CROSS-SERVICE | 2+ services | Composite scoring + deploy coordination + contract check |
| SYSTEM-WIDE | All or most | Full analysis + staged rollout + escalation |

### P2.3 — Direction Classification

| Direction | Characteristics | Risk Note |
|---|---|---|
| ADDITIVE | New code, no removal | Lowest risk per type |
| MODIFYING | Existing code changed | Medium risk — regression concern |
| DELETING | Code removed | Highest risk per type — check all consumers |

### P2.4 — Ambiguity Resolution

Always choose the higher-risk interpretation:

| Ambiguous Pair | Resolve To | Reason |
|---|---|---|
| FEATURE vs FIX | FIX | Assume bug until proven otherwise |
| REFACTOR vs FIX | FIX | Behavior may have changed |
| CONFIG vs INFRA | INFRA | Higher blast radius |
| DOCS vs CONTRACT | CONTRACT | API docs imply a contract |
| EXPERIMENT → production | Reclassify upward | Production needs proper classification |
| SCHEMA vs FIX | SCHEMA | Structural, not logic fix |
| Test + prod both changed | Classify by prod type | Production change dominates |
| Lock file only | INFRA/LOW | Dependency resolution |
| Build/CI config only | INFRA/MEDIUM | Pipeline change minimum |
| Undefinable | UNKNOWN | Stop and flag — cannot proceed |
| FIX:PERFORMANCE vs REFACTOR | FIX | Correctness concern |

---

## P3 — REASONING PATTERNS

### P3.1 — Change Classification (7D Taxonomy)

Every change must be classified across seven orthogonal dimensions. Each dimension is independent. Every change gets exactly one value per dimension. Unknown = flag explicitly — never assume a default.

#### Dimension Reference

| # | Dimension | Values |
|---|---|---|
| 1 | **WorkType** | Per S1 + sub-type from reference below. If 2+ apply, use highest risk + list secondary |
| 2 | **Intention** | PLANNED (ticket/spec exists) · UNPLANNED (reactive, no prior declaration) |
| 3 | **Breadth** | LOCAL · MODULE · CONTRACT · CROSS_MODULE · CROSS_SERVICE · SYSTEM |
| 4 | **Reversibility** | SAFE · CAREFUL · HARD · IRREVERSIBLE |
| 5 | **Urgency** | IMMEDIATE · TODAY · THIS_SPRINT · SCHEDULED · DEFERRABLE |
| 6 | **Detectability** | IMMEDIATE · DELAYED · USER_REPORTED · UNDETECTABLE |
| 7 | **Blast Radius** | SINGLE_USER · TENANT · FEATURE · SERVICE · MULTI_SERVICE · PLATFORM · ALL_USERS · DATA_INTEGRITY |

#### Dimension Interaction Rules

| Rule | Condition | Action |
|---|---|---|
| Scope creep | PLANNED scope beyond spec | Flag as UNPLANNED. 2+ consecutive UNPLANNED → pause and re-scope |
| Irreversible deployment | IRREVERSIBLE | Rollback plan + backup required before execution |
| Urgency misclassification | IMMEDIATE urgency on non-INCIDENT | Likely misclassified — re-evaluate as INCIDENT |
| Monitoring gap | CRITICAL/HIGH + USER_REPORTED/UNDETECTABLE | Monitoring addition required before deploy |
| Staged rollout | ALL_USERS + CRITICAL | Staged rollout mandatory (1→5→20→100%) |
| Data integrity | DATA_INTEGRITY (any risk) | Data validation + rollback plan required |
| Urgency downgrade | SINGLE_USER | Downgrade urgency one step |
| Undetectable gap | UNDETECTABLE + risk > MEDIUM | Require monitoring addition before deploy |

#### WorkType Sub-Type Reference

**FEATURE:**
| Sub-type | Default Risk | When |
|---|---|---|
| PLANNED | MEDIUM | Spec exists, ticket exists |
| UNPLANNED | HIGH | Ad-hoc, no prior declaration |
| SPIKE | LOW | Investigative, may be discarded |
| FLAG | MEDIUM | Behind feature flag, not yet live to all |

**EXPERIMENT:**
| Sub-type | Default Risk | When |
|---|---|---|
| SPIKE | LOW | Quick prototype, may be discarded |
| PROTOTYPE | LOW | Proof of concept, not production-ready |
| A_B_TEST | MEDIUM | Production experiment with metrics |

**ANALYSIS:**
| Sub-type | Default Risk | When |
|---|---|---|
| EXPLAIN | INFO | Read-only investigation |
| DEBUG | INFO | Root cause investigation |
| DIFF | INFO | Comparison between versions |
| IMPACT | INFO | Impact assessment |

**PLAN:**
| Sub-type | Default Risk | When |
|---|---|---|
| FEATURE | MEDIUM | Feature implementation plan |
| ARCHITECTURE | MEDIUM | Architecture design document |
| MIGRATION | HIGH | Migration plan |

**DOCS:**
| Sub-type | Default Risk | When |
|---|---|---|
| README | INFO | README update |
| COMMENT | INFO | Inline comment changes |
| API | MEDIUM | API documentation |
| COMPLIANCE | HIGH | Compliance documentation |
| RUNBOOK | MEDIUM | Operational runbook |

**FIX:**
| Sub-type | Default Risk | When |
|---|---|---|
| BUG | HIGH | Incorrect logic or output |
| CRASH | HIGH | Runtime exception, process death |
| REGRESSION | HIGH | Previously working, broke recently |
| SECURITY | CRITICAL | Auth bypass, injection, data exposure |
| DATA | CRITICAL | Corrupt data, wrong migration |
| PERFORMANCE | MEDIUM | Timeout, memory leak, CPU spike |
| SILENT | HIGH | No exception, wrong result, swallowed error |
| FLAKE | HIGH | Non-deterministic, intermittent failure |
| TYPO | INFO | Naming, string, comment only |
| DEPENDENCY | HIGH | Library bump for CVE or bug |

**REFACTOR:**
| Sub-type | Default Risk | When |
|---|---|---|
| EXTRACT | MEDIUM | Move logic to function/module/service |
| RENAME | HIGH (public) | Rename symbol, file, module, route |
| REORGANIZE | MEDIUM | Move files or directories |
| SIMPLIFY | LOW | Reduce complexity, remove dead code |
| PATTERN | MEDIUM | Apply design pattern |
| TYPE | LOW | Add or improve types, generics |
| PERF | MEDIUM | Algorithmic improvement |

**SCHEMA:**
| Sub-type | Default Risk | When |
|---|---|---|
| DB_ADD | MEDIUM | New column/table, additive |
| DB_REMOVE | CRITICAL | Column or table removed |
| DB_RENAME | CRITICAL | Column or table renamed |
| DB_TYPE | CRITICAL | Column type changed |
| DB_INDEX | MEDIUM | Index added or removed |
| EVENT_ADD | LOW–MEDIUM | New event payload field |
| EVENT_REMOVE | CRITICAL | Event payload field removed |
| EVENT_RENAME | CRITICAL | Event payload field renamed |
| MODEL | HIGH | ORM/Pydantic/Zod schema changed |
| CONFIG | HIGH | Config schema shape changed |
| PROTO | HIGH–CRITICAL | Protobuf/gRPC definition changed |
| OPENAPI | HIGH | OpenAPI spec changed |

**CONTRACT:**
| Sub-type | Default Risk | When |
|---|---|---|
| ROUTE_ADD | LOW | New HTTP route, additive |
| ROUTE_REMOVE | CRITICAL | HTTP route removed |
| ROUTE_CHANGE | CRITICAL | Route path or method changed |
| PARAM_ADD | CRITICAL | New required parameter |
| PARAM_REMOVE | CRITICAL | Parameter removed |
| RESPONSE | HIGH | Response shape changed |
| STATUS_CODE | HIGH | HTTP status code changed |
| FUNCTION | HIGH | Function signature, shared module |
| EXPORT | HIGH | Public export added/removed/renamed |
| INTERFACE | HIGH | Interface/abstract class changed |
| WEBHOOK | HIGH | Webhook payload or trigger changed |

**CONFIG:**
| Sub-type | Default Risk | When |
|---|---|---|
| ENV_ADD | HIGH | New required environment variable |
| ENV_REMOVE | HIGH | Environment variable removed |
| ENV_RENAME | CRITICAL | Environment variable renamed |
| ENV_DEFAULT | MEDIUM | Default value changed |
| FLAG | MEDIUM | Feature flag added/changed/removed |
| SECRET | CRITICAL | Secret or credential changed |
| TIMEOUT | MEDIUM | Timeout or retry configuration |
| LIMIT | MEDIUM | Rate limit or quota |
| CICD | HIGH | Pipeline configuration changed |

**INFRA:**
| Sub-type | Default Risk | When |
|---|---|---|
| DOCKER | HIGH | Dockerfile or compose |
| K8S | HIGH | Kubernetes manifest |
| TERRAFORM | HIGH | Cloud resource |
| NETWORK | CRITICAL | Network policy, ingress, firewall |
| SCALING | MEDIUM | Replicas, autoscale configuration |
| STORAGE | HIGH | Volume, S3 bucket, storage class |
| IAM | CRITICAL | Permissions, roles, policies |
| MONITORING | MEDIUM | Alerts, dashboards, logging |
| DEPENDENCY | HIGH | Third-party service added/removed |

**INCIDENT:**
| Sub-type | Default Risk | When |
|---|---|---|
| OUTAGE | CRITICAL | Service unavailable |
| DATA_LOSS | CRITICAL | Data deleted or corrupted |
| SECURITY | CRITICAL | Breach or unauthorized access |
| DEGRADED | CRITICAL | Partial degradation, elevated errors |
| ROLLBACK | CRITICAL | Reverting a deployment |
| MITIGATION | CRITICAL | Hotfix, root cause pending |

#### Conflict Resolution (Priority Order)

1. Sub-type risk overrides S1 default (FIX:TYPO = INFO not HIGH)
2. UNPLANNED escalates one level above sub-type default
3. IRREVERSIBLE → minimum HIGH regardless of sub-type
4. ALL_USERS or DATA_INTEGRITY → minimum HIGH
5. IMMEDIATE urgency + non-INCIDENT → reclassify as INCIDENT
6. UNDETECTABLE + risk > MEDIUM → require monitoring addition
7. SINGLE_USER → downgrade urgency one step

#### Classification Decision Trees

**Tree 1: Is this a FIX or a FEATURE?**
```
Is the diff primarily changing existing behavior? 
  ├─ Yes → Is the change described as "new functionality"?
  │   ├─ Yes → But existing behavior also changes → classify as FIX + FEATURE (dual). Risk = MAX(FIX.RISK, FEATURE.RISK).
  │   └─ No → FIX. Determine sub-type: BUG, CRASH, REGRESSION, SECURITY, DATA, PERFORMANCE, SILENT, FLAKE, TYPO, DEPENDENCY.
  └─ No → Is it additive code only?
      ├─ Yes → FEATURE. Determine sub-type: PLANNED, UNPLANNED, SPIKE, FLAG.
      └─ No → REFACTOR. Determine sub-type: EXTRACT, RENAME, REORGANIZE, SIMPLIFY, PATTERN, TYPE, PERF.
```

**Tree 2: Is this a CONTRACT change?**
```
Does the change touch a file that defines or implements an interface/API/schema?
  ├─ Yes → Is the change additive (new endpoint/field)?
  │   ├─ Yes → CONTRACT:ROUTE_ADD / SCHEMA:EVENT_ADD / CONTRACT:PARAM (if required). Risk = MEDIUM-HIGH depending on required/optional.
  │   └─ No → Is it modifying existing contract shape?
  │       ├─ Yes → CONTRACT:RESPONSE / CONTRACT:INTERFACE / SCHEMA:MODEL. Risk = HIGH-CRITICAL.
  │       └─ No → Is it removing contract shape?
  │           └─ Yes → CONTRACT:ROUTE_REMOVE / CONTRACT:PARAM_REMOVE / SCHEMA:EVENT_REMOVE. Risk = CRITICAL.
  └─ No → Is the behavior of an exported symbol changing?
      ├─ Yes → CONTRACT:FUNCTION. Check all callers.
      └─ No → Not a contract change. Continue with primary WorkType.
```

**Tree 3: Is this an INCIDENT or a regular change?**
```
Is there a production incident active?
  ├─ Yes → INCIDENT. Sub-type: OUTAGE, DATA_LOSS, SECURITY, DEGRADED, ROLLBACK, MITIGATION. All CRITICAL.
  │       Immediate action: switch to incident response. Suspend all non-incident work.
  └─ No → Is the change responding to a production issue?
      ├─ Yes → Hotfix. Classify as FIX with appropriate sub-type. Consider INCIDENT if severity warrants.
      └─ No → Regular change. Follow normal classification process.
```

**Tree 4: What is the Blast Radius?**
```
Does the change affect user-facing behavior?
  ├─ No → Does it affect internal infrastructure?
  │   ├─ Yes → PLATFORM or SERVICE. Check if multi-service.
  │   └─ No → MODULE or LOCAL. Narrow blast radius.
  └─ Yes → Does it affect all users or specific tenants?
      ├─ All users → ALL_USERS. Minimum HIGH.
      ├─ Specific tenant → TENANT. Standard risk.
      └─ Single user → SINGLE_USER. Can downgrade urgency.
              
Does the change affect data?
  └─ Yes → DATA_INTEGRITY. Minimum HIGH. Pre/post validation required.
```

**Tree 5: What is the Correct Intention classification?**
```
Does a ticket or spec exist before this change was started?
  ├─ Yes → Does the diff match the spec exactly?
  │   ├─ Yes → PLANNED. No flag.
  │   └─ No → PLANNED with UNPLANNED scope creep. Flag the deviation.
  └─ No → Is this responding to a production event?
      ├─ Yes → INCIDENT or hotfix. UNPLANNED.
      └─ No → UNPLANNED. Flag for re-scoping if this becomes habitual.
```

#### Classification Quick-Check Table

Use this table to rapidly determine the correct classification for common change patterns:

| Change Pattern | WorkType | Sub-type | Default Risk | Key Dimension to Watch |
|---|---|---|---|---|
| New API endpoint | CONTRACT | ROUTE_ADD | LOW | Blast Radius |
| API endpoint removed | CONTRACT | ROUTE_REMOVE | CRITICAL | Reversibility |
| API response changed | CONTRACT | RESPONSE | HIGH | Detectability |
| New UI component | FEATURE | PLANNED | MEDIUM | Breadth |
| Bug fix in business logic | FIX | BUG | HIGH | Depth |
| Null pointer fix | FIX | CRASH | HIGH | Urgency |
| Security vulnerability fix | FIX | SECURITY | CRITICAL | Detectability |
| Performance improvement | FIX | PERFORMANCE | MEDIUM | Detectability |
| Silent error fix | FIX | SILENT | HIGH | Detectability |
| Function extraction | REFACTOR | EXTRACT | MEDIUM | Breadth |
| Public symbol rename | REFACTOR | RENAME | HIGH | Reversibility |
| Code simplification | REFACTOR | SIMPLIFY | LOW | Breadth |
| DB column addition | SCHEMA | DB_ADD | MEDIUM | Reversibility |
| DB column removal | SCHEMA | DB_REMOVE | CRITICAL | Reversibility |
| New required env var | CONFIG | ENV_ADD | HIGH | Detectability |
| Env var default change | CONFIG | ENV_DEFAULT | MEDIUM | Breadth |
| Feature flag addition | CONFIG | FLAG | MEDIUM | Blast Radius |
| Dockerfile change | INFRA | DOCKER | HIGH | Breadth |
| IAM policy change | INFRA | IAM | CRITICAL | Reversibility |
| Migration (additive) | SCHEMA | DB_ADD | MEDIUM | Detectability |
| Migration (destructive) | SCHEMA | DB_REMOVE | CRITICAL | Reversibility |
| Dependency version bump | FIX | DEPENDENCY | HIGH | Breadth |
| Config timeout change | CONFIG | TIMEOUT | MEDIUM | Breadth |
| Logging level change | CONFIG | FLAG | LOW | Detectability |
| Test addition only | ANALYSIS | DIFF | INFO | None |
| Documentation update | DOCS | README | INFO | None |

#### SDLC Lifecycle Integration

| Phase | Classification Requirement |
|---|---|
| Pre-dev | Declare WorkType, Risk, Breadth, affected files in ticket. No classification = not understood |
| Dev | Classify every tool call. Deviation from declaration = UNPLANNED flag. 2+ UNPLANNED → pause and re-scope |
| Review | Validate classification. Disagreement → document corrected classification in PR |
| Pre-deploy | CRITICAL requires migration plan, rollback, monitoring, sign-off. INCIDENT bypasses gates but needs 72h post-mortem |
| Post-deploy | Monitor CRITICAL changes for 1 hour. Incident during monitoring → reclassify as INCIDENT |
| Post-mortem | Was classification correct? Was UNPLANNED flagged? What systemic fix prevents recurrence? |

#### Breaking Change Classification

| Change | Class | Break Level |
|---|---|---|
| Export removed | CONTRACT:EXPORT | BREAKING |
| Required parameter added | CONTRACT:PARAM_ADD | BREAKING |
| Response shape narrowed | CONTRACT:RESPONSE | BREAKING |
| Route path or method changed | CONTRACT:ROUTE_CHANGE | BREAKING |
| Event field removed | SCHEMA:EVENT_REMOVE | BREAKING |
| Serialization format changed | SCHEMA:MODEL | BREAKING |
| Default behavior changed silently | CONTRACT:FUNCTION | SEMANTIC BREAKING |
| Type narrowing on input | CONTRACT:INTERFACE | BREAKING |
| Type widening on return | CONTRACT:INTERFACE | BREAKING |
| Public→private access change | CONTRACT:EXPORT | BREAKING |
| Sync→async conversion | CONTRACT:FUNCTION | BREAKING |
| Enum value removed | SCHEMA:MODEL | BREAKING |
| Interface method removed | CONTRACT:INTERFACE | BREAKING |
| Required field added to schema | SCHEMA:MODEL | BREAKING |

#### Compatibility Levels

| Level | Meaning | Version Impact |
|---|---|---|
| BACKWARD-COMPATIBLE | Old consumers work unchanged | Minor/Patch |
| BREAKING at SOURCE | Recompile or retype needed | Major |
| BREAKING at BINARY | Runtime linkage failure | Major |
| BREAKING at NETWORK | Wire format changed | Major + coordinated deploy |
| BREAKING at SEMANTIC | Same API, different behavior | Major + monitored rollout |

#### Language-Specific Classification

**TypeScript / JavaScript:**
| Change | Classification |
|---|---|
| Type export added | CONTRACT:EXPORT / MEDIUM |
| Type export removed | CONTRACT:EXPORT / HIGH |
| Interface field added | CONTRACT:INTERFACE / MEDIUM |
| Interface field removed | CONTRACT:INTERFACE / CRITICAL |
| Union member added | CONTRACT:INTERFACE / MEDIUM (check exhaustive switch) |
| Union/enum member removed | CONTRACT:INTERFACE / CRITICAL |
| `as any` / `@ts-ignore` added | FIX:SECURITY / HIGH — flag for typed alternative |
| Generic constraint tightened | CONTRACT:INTERFACE / HIGH |
| Sync→async conversion | CONTRACT:FUNCTION / HIGH |
| Module path changed | REFACTOR:RENAME / HIGH |
| Enum value removed | SCHEMA:MODEL / CRITICAL |
| Generic constraint loosened | CONTRACT:INTERFACE / MEDIUM |

**Python:**
| Change | Classification |
|---|---|
| Function signature default changed | CONFIG:ENV_DEFAULT / MEDIUM |
| `Optional[X]` → `X` without default | CONTRACT:FUNCTION / HIGH |
| `*args` / `**kwargs` removed | CONTRACT:FUNCTION / CRITICAL |
| `@abstractmethod` added | CONTRACT:INTERFACE / HIGH |
| Pydantic field type changed | SCHEMA:MODEL / HIGH |
| Pydantic field removed | SCHEMA:MODEL / CRITICAL |
| `__init__.py` export changed | CONTRACT:EXPORT / MEDIUM |
| `@property` changed to method | CONTRACT:FUNCTION / HIGH |
| Import moved from public to private | CONTRACT:EXPORT / HIGH |
| Type annotation changed without sig change | CONTRACT:INTERFACE / MEDIUM |

**Go:**
| Change | Classification |
|---|---|
| Interface method added | CONTRACT:INTERFACE / CRITICAL |
| Interface method removed | CONTRACT:INTERFACE / CRITICAL |
| Exported function signature changed | CONTRACT:FUNCTION / HIGH |
| `iota` constant reordered | SCHEMA:MODEL / CRITICAL |
| Error sentinel removed | CONTRACT:EXPORT / CRITICAL |
| Package renamed | CONTRACT:EXPORT / CRITICAL |
| Context parameter added | CONTRACT:FUNCTION / HIGH |
| Receiver pointer ↔ value | CONTRACT:INTERFACE / MEDIUM |
| Struct field type changed | CONTRACT:INTERFACE / HIGH |
| Exported struct field removed | CONTRACT:INTERFACE / CRITICAL |

**SQL:**
| Change | Classification |
|---|---|
| ADD COLUMN (nullable) | SCHEMA:DB_ADD / MEDIUM |
| ADD COLUMN (NOT NULL, no default) | SCHEMA:DB_ADD / CRITICAL |
| DROP COLUMN | SCHEMA:DB_REMOVE / CRITICAL |
| ALTER COLUMN TYPE | SCHEMA:DB_TYPE / CRITICAL |
| DROP INDEX | SCHEMA:DB_INDEX / HIGH |
| ADD FOREIGN KEY | SCHEMA:DB_ADD / HIGH |
| Migration without rollback | SCHEMA / HIGH — flag for rollback |
| SELECT * introduced | ANALYSIS / INFO — flag for performance |
| CREATE INDEX without CONCURRENTLY | SCHEMA:DB_INDEX / MEDIUM — table lock risk |
| ADD CONSTRAINT without NOT VALID | SCHEMA:DB_ADD / HIGH — full table lock |
| Migration without transaction | SCHEMA / HIGH — partial apply risk |

**Rust:**
| Change | Classification |
|---|---|
| Public function marked `unsafe` | CONTRACT:FUNCTION / MEDIUM |
| Public enum variant removed | SCHEMA:MODEL / CRITICAL |
| Trait method added without default | CONTRACT:INTERFACE / CRITICAL |
| Associated type changed | CONTRACT:INTERFACE / HIGH |
| Lifetime parameter added to pub fn | CONTRACT:FUNCTION / HIGH |
| `#[derive]` removed from public type | CONTRACT:INTERFACE / MEDIUM |
| Public struct field made private | CONTRACT:EXPORT / HIGH |
| `impl Trait` changed to concrete type | CONTRACT:INTERFACE / MEDIUM |

**Java / Kotlin:**
| Change | Classification |
|---|---|
| Public method signature changed | CONTRACT:FUNCTION / HIGH |
| Interface default method added | CONTRACT:INTERFACE / MEDIUM |
| `final` added to method | CONTRACT:FUNCTION / HIGH |
| `throws` clause added | CONTRACT:FUNCTION / HIGH |
| Annotation with RUNTIME retention added | CONTRACT:INTERFACE / MEDIUM |
| Kotlin data class field added | CONTRACT:INTERFACE / MEDIUM |
| Kotlin sealed class variant added | CONTRACT:INTERFACE / MEDIUM |
| `@JvmStatic` / `@JvmOverloads` changed | CONTRACT:FUNCTION / HIGH |
| Public API method removed | CONTRACT:FUNCTION / CRITICAL |

**IaC (Terraform / K8s / Docker / CI):**
| Change | Classification |
|---|---|
| Terraform resource removed | INFRA:TERRAFORM / CRITICAL |
| IAM policy changed | INFRA:IAM / CRITICAL |
| Docker base image tag changed | INFRA:DOCKER / HIGH |
| Container resource limits removed | INFRA:K8S / HIGH |
| Probe timing changed | INFRA:K8S / MEDIUM |
| Service port changed | CONTRACT:ROUTE_CHANGE / CRITICAL |
| TLS certificate reference changed | INFRA / HIGH |
| Namespace or resource name changed | CONTRACT:EXPORT / CRITICAL |
| Volume mount path changed | INFRA:STORAGE / HIGH |
| CI step added or removed | CONFIG:CICD / MEDIUM |
| Environment variable in IaC changed | CONFIG:ENV_ADD / HIGH |

---

### P3.2 — Composite Risk Scoring

The composite risk score synthesizes all seven dimensions, domain hard floors, blast radius adjustments, urgency adjustments, and depth modifiers into a single actionable verdict.

#### Core Formula

```
composite = MAX(sub_type_default, domain_floor, blast_radius_adjust, urgency_adjust, depth_modifier)
```

**Numeric Levels:**
| Level | Value |
|---|---|
| INFO | 0 |
| LOW | 1 |
| MEDIUM | 2 |
| HIGH | 3 |
| CRITICAL | 4 |

#### Domain Hard Floors

Certain domains are inherently high-risk regardless of the specific change:

| Domain | Floor | Examples |
|---|---|---|
| Auth / billing / payments / security | CRITICAL | Login, payment processor, encryption, secrets |
| DB schema remove/rename | CRITICAL | DROP COLUMN, RENAME TABLE, ALTER TYPE |
| Network / IAM | CRITICAL | Firewall rules, IAM policies, security groups |
| Environment variable rename | CRITICAL | Application will crash at startup |
| FinTech payment processing | CRITICAL | Transaction handling, ledger entries |
| Healthcare PHI | CRITICAL | Patient data, HIPAA-regulated |
| E-Commerce pricing | CRITICAL | Price calculation, discounts, taxes |
| B2B integration | CRITICAL | Partner API contracts, SLA-bound |
| SaaS tenant isolation | CRITICAL | Multi-tenant data separation |
| Public API change | HIGH | External consumer impact |
| Public symbol rename | HIGH | Breaking change for all dependents |

#### Composite Score for Multi-File Diffs (3+ files)

For diffs with 3 or more files, compute a weighted composite:

```
weight(f) = module_criticality(f)
depth >= STRUCTURAL     → w *= 2
contract == EXPORTED    → w += 2
contract == SCHEMA      → w += 3
coverage == UNCOVERED   → w += 1

penalties:
  +2   deleted function without replacement (each)
  +2   env var added without default (each)
  +2   env var removed (each)
  +3   security-relevant file touched (each)
  +3   migration without rollback
  +2   ownership boundary crossed without approval (each)
  +1   TODO / FIXME / HACK introduced (each)

final = SUM(weight(f) for each file) + penalties
```

#### Module Criticality Weights

| Weight | Modules |
|---|---|
| 3 | auth, payment, billing, encryption, secrets, data layer, DB, migration, cache, infra, network, IAM, deployment |
| 2 | core domain, shared utilities, API layer, middleware, routing, event bus |
| 1 | UI, styling, templates, CLI |
| 0 | docs, config examples, test fixtures, generated code |

#### Blast Radius Adjustments

| Radius | Adjustment |
|---|---|
| MULTI_SERVICE | +1 |
| PLATFORM | +2 (minimum HIGH) |
| ALL_USERS | +2 (minimum HIGH) |
| DATA_INTEGRITY | +2 (minimum HIGH) |

#### Urgency Adjustments

| Urgency | Adjustment |
|---|---|
| IMMEDIATE (non-INCIDENT) | +1 (likely misclassified) |
| DEFERRABLE | −1 (minimum INFO) |

#### Verdict Thresholds

| Score | Verdict | Rule |
|---|---|---|
| 0–3 | PASS | Standard review |
| 4–7 | WARN | Merge with attention items (no items = invalid WARN) |
| 8–11 | BLOCK | Must not merge without changes (no blockers = invalid BLOCK) |
| 12+ | BLOCK-CRITICAL | Requires named architect or security sign-off |

#### Risk Floor Overrides

| Condition | Floor Verdict |
|---|---|
| Auth/payment/security file changed | BLOCK (8) |
| Schema destructive (DROP/REMOVE/RENAME) | BLOCK-CRITICAL (10) |
| Migration without rollback | BLOCK (8) |
| Active INCIDENT in session | BLOCK-CRITICAL (10) |
| CRITICAL file + UNCOVERED test coverage | BLOCK-CRITICAL (10) |

#### Escalation Ladder

| Level | Trigger | Action |
|---|---|---|
| 0 | All MEDIUM or below | Normal process |
| 1 | One HIGH surfaced | Surface at next checkpoint |
| 2 | Two+ HIGH concurrent | STOP — document all risks + confirm understanding |
| 3 | Any CRITICAL | STOP — full reassessment required + stakeholders notified |
| 4 | CRITICAL + UNPLANNED | Full stop — explicit approval required before proceeding |
| 5 | INCIDENT during non-incident work | Switch to incident response immediately |

#### Single-File / Small Diff Scoring

For diffs with 1–2 files, apply WorkType default + depth modifier (P3.3). Security-touching or contract-breaking → HIGH minimum. No test coverage → upgrade one level. Fragile module (changed 3+ times in 30 days) → upgrade one level.

#### Composite Scoring Quick Reference

| Scenario | Base | Adjustment | Final |
|---|---|---|---|
| Auth file, STRUCTURAL depth, no tests | 3 (CRITICAL floor) | depth ×2=6, uncovered+1 | 7 (WARN→BLOCK via floor) |
| Config default change, CROSS_MODULE | 2 (MEDIUM) | cross-module+2 | 4 (WARN) |
| DB migration, no rollback, DEEP | 4 (CRITICAL floor) | depth ×1=4, no-rollback+3 | 7 (BLOCK via floor 8) |
| New UI component, SURFACE depth | 0 (INFO) | −1 modifier | 0 (PASS) |
| Schema rename + 2 callers, no test | 4 (CRITICAL) | uncovered+1 | 5 (BLOCK-CRITICAL via floor 10) |

---

### P3.3 — Diff Analysis (Structural, Behavioral, Data, Config, Dependency)

Every diff must be analyzed across five dimensions of change: structural, behavioral, data, config, and dependency. Each dimension reveals different risk surfaces.

#### Pattern-to-Risk Mapping

| Diff Pattern | Classification / Risk | Action |
|---|---|---|
| New file, no imports | ANALYSIS/LOW | Confirm purpose and necessity |
| New file, imports existing module | FEATURE/MEDIUM | Check integration with existing module |
| Body modified, same signature | FIX or REFACTOR/MEDIUM | Check callers for behavior change |
| Function signature modified | CONTRACT/HIGH | Update all callers, check binary compatibility |
| Function deleted, no replacement | CONTRACT/CRITICAL | Verify zero remaining callers |
| File deleted | INFRA/HIGH | Check all imports and references |
| Import path changed | REFACTOR/MEDIUM | Verify new path resolves correctly |
| Type definition changed | CONTRACT/HIGH | Check all usages of the type |
| Config default changed | CONFIG/MEDIUM | Check all environments that rely on default |
| Schema or API doc changed | SCHEMA/HIGH | Verify documentation matches implementation |
| Package manifest changed | INFRA/MEDIUM | Check lock file, peer dependencies |
| CI/CD configuration changed | CONFIG/HIGH | Verify pipeline passes with new config |
| Lock file only | INFRA/LOW | Match dependency changes |
| Binary or generated file | INFRA/MEDIUM | Confirm regeneration from source |
| Test file in isolation | ANALYSIS/LOW | Verify test passes and is meaningful |
| Environment file changed | CONFIG/HIGH | Check all environments, fallback behavior |
| Migration without model change | SCHEMA/MEDIUM | Flag missing model update |
| Migration + model change | SCHEMA/HIGH | Verify consistency between migration and model |
| Config with secrets | CONFIG/CRITICAL | Check for hardcoded secrets |
| Lock file without manifest change | INFRA/LOW | Check for unexpected sub-dependencies |
| Multi-line string change | STRUCTURAL minimum | May hide logic change |
| Regex change | STRUCTURAL minimum | Edge case risk |
| Snapshot or fixture update | ANALYSIS/LOW | Flag if behavior change is hidden |
| Ownership boundary crossed | Flag reviewer requirement | CODEOWNERS must approve |
| 500+ lines changed | STRUCTURAL minimum | Recommend split into smaller changes |
| Generated code (proto/OpenAPI) | CONTRACT | Verify source file also changed |
| Binary in diff | INFRA/MEDIUM | Verify it belongs in the repository |

#### Depth Classification

| Depth | Characteristics | Risk Modifier | Examples |
|---|---|---|---|
| SURFACE | Whitespace, comments, import reorder, formatting | −1 (min INFO) | Prettier run, import sort |
| SHALLOW | Rename, extract, type alias, dead code removal | −1 (min INFO) | `getUser` → `fetchUser`, extract constant |
| STRUCTURAL | Logic restructure, error handling, state machine, control flow | +1 | Add retry logic, restructure conditional |
| DEEP | Algorithm shift, contract change, caching strategy, data structure swap, concurrency change | +1 (min MEDIUM) | Replace sort algorithm, add caching layer |

#### Edge Cases in Diff Analysis

| Edge Case | Rule |
|---|---|
| Diff contains binary file | INFRA/MEDIUM — verify it belongs in version control |
| Generated code changed without source change | CONTRACT/MEDIUM — flag: source must be updated |
| Migration present without model change | SCHEMA/MEDIUM — flag: model likely needs update |
| Migration + model both changed | SCHEMA/HIGH — verify they are consistent |
| Config file contains potential secrets | CONFIG/CRITICAL — check for hardcoded credentials |
| Lock file changed without manifest | INFRA/LOW — check for unexpected transitive dependencies |
| Multi-line string modified | STRUCTURAL minimum — may contain embedded logic |
| Regex pattern modified | STRUCTURAL minimum — high edge case risk |
| Snapshot or test fixture updated | ANALYSIS/LOW — flag if behavior change is hidden |
| Ownership boundary crossed in diff | Flag: additional reviewer from owning team required |
| Diff exceeds 500 lines | STRUCTURAL minimum — recommend splitting |
| 0-line diff (permissions/mode change only) | INFRA/LOW — verify intent |
| File renamed without content change | REFACTOR:RENAME / MEDIUM — check all references |
| Dead code removal | REFACTOR:SIMPLIFY / LOW — verify truly unused |

#### File-Level Diff Pattern Catalog

Each file type in a diff has specific patterns that reveal risk:

**Configuration Files (JSON, YAML, TOML, .env):**
| Pattern | Risk | Action |
|---|---|---|
| Numeric value changed (timeout, limit, threshold) | MEDIUM–HIGH | Check all readers — silent behavior change |
| String value changed (URL, host, path) | HIGH | Validate new value is correct in all environments |
| Boolean flag toggled | MEDIUM | Verify flag is still referenced in code |
| Key added | LOW–MEDIUM | Check if required — all envs need the value |
| Key removed | CRITICAL | Check all readers — startup failure risk |
| Nested structure added | MEDIUM | Verify parser compatibility |
| Secret-like value (password, token, key) | CRITICAL | Flag for secrets detection — should not be in config |

**Migration Files (SQL, scripts):**
| Pattern | Risk | Action |
|---|---|---|
| CREATE TABLE | MEDIUM | Verify no naming collision, check rollback |
| ALTER TABLE ADD COLUMN | MEDIUM | Check nullability, default value, lock risk |
| ALTER TABLE DROP COLUMN | CRITICAL | Check no active reads, add rollback |
| ALTER TABLE RENAME | CRITICAL | Dual-write plan required |
| CREATE INDEX | MEDIUM | Check CONCURRENTLY usage, lock risk |
| DROP INDEX | HIGH | Verify index not used by queries |
| Data migration (UPDATE) | HIGH | Verify idempotency, transaction wrapping |
| Rollback migration missing | CRITICAL | Block — every migration needs a down path |

**Type Definition Files (.ts, .d.ts, proto, graphql):**
| Pattern | Risk | Action |
|---|---|---|
| Type/interface field added | MEDIUM | Verify all consumers can handle extra field |
| Type/interface field removed | CRITICAL | Check all consumers — compile/runtime break |
| Type/interface field type changed | HIGH | Verify all assignments and consumers |
| Enum/union member added | MEDIUM | Check exhaustive switches, pattern matches |
| Enum/union member removed | CRITICAL | Every reference breaks |
| Generic constraint added | HIGH | Check all existing usages of the generic |
| Generic constraint removed | MEDIUM | May widen acceptable types unexpectedly |
| Type alias changed | HIGH | Check all usages of the alias |
| `null`/`undefined`/`optional` added | MEDIUM | Callers may need null checks |
| `null`/`undefined`/`optional` removed | CRITICAL | Callers may fail on missing value |

**API Route Files (Express, FastAPI, Gin, etc.):**
| Pattern | Risk | Action |
|---|---|---|
| New route added | LOW | Verify auth middleware applied |
| Route path changed | CRITICAL | Old path 404 — add redirect or deprecation |
| Route method changed | CRITICAL | Old method breaks — coordinate with consumers |
| Route handler body changed | MEDIUM–HIGH | Trace all code paths, check error handling |
| Route handler middleware added | MEDIUM | Verify middleware doesn't break existing behavior |
| Route handler middleware removed | HIGH | Security/auth middleware removal is CRITICAL |
| Route deprecated (with migration) | MEDIUM | Verify deprecation headers, sunset date |
| Route removed (no deprecation) | CRITICAL | Block — need deprecation period or consumer coordination |

**Test Files:**
| Pattern | Risk | Action |
|---|---|---|
| New test file | LOW | Verify test actually tests the change |
| Test for new functionality | LOW | Confirm test covers positive + negative cases |
| Test for bug fix | MEDIUM | Verify test fails on old code, passes on new |
| Test assertion changed | MEDIUM | Is the new assertion correct or was old one wrong? |
| Test removed | HIGH | Why was test removed? Behavior no longer valid? |
| Test fixture/snapshot updated | LOW | Verify snapshot reflects intentional change |
| Test mock changed | MEDIUM | Verify mock still represents real behavior |
| Test without assertions | WARNING | Test passes vacuously |

**Service/Handler Files:**
| Pattern | Risk | Action |
|---|---|---|
| New function added | LOW–MEDIUM | Verify function is called, has tests |
| Function body changed, sig same | MEDIUM | Trace all callers — behavior change |
| Function signature changed | HIGH | Update all callers |
| Function removed | CRITICAL | Verify zero callers remain |
| Error handling changed | MEDIUM–HIGH | Verify all error paths produce signals |
| Logging added | LOW | Verify no sensitive data in logs |
| Logging removed | MEDIUM | Monitoring gap — was it the only signal? |
| Async/await added | HIGH | Verify error propagation, promise handling |
| Callback→Promise conversion | HIGH | Verify all paths handled |
| State management changed | HIGH | Verify concurrency safety, consistency |
| Cache added | MEDIUM | Verify TTL, invalidation, stampede protection |
| Cache removed | HIGH | Verify downstream can handle load |

#### Regression Prediction

Certain change patterns have statistically higher regression risk:

| Pattern | Regression Risk |
|---|---|
| UNPLANNED + HIGH risk | HIGH — 3× more likely to introduce regression |
| CONFIG:ENV_DEFAULT changed | HIGH — silent caller breakage |
| SCHEMA:DB_RENAME without dual-write | VERY HIGH — data loss or corruption |
| FIX:SILENT | HIGH — root cause may be elsewhere |
| REFACTOR:RENAME of public symbol | HIGH — missed references in other modules |
| FIX:PERFORMANCE | MEDIUM — correctness trade-off possible |
| EXPERIMENT promoted to production | MEDIUM — missing edge cases in experiment path |
| CONTRACT:FUNCTION without caller update | VERY HIGH — broken consumers |
| File changed 3+ times in 30 days (churn) | HIGH — instability signal |
| File unchanged 90+ days (stale) | HIGH — assumptions may be stale |
| Bottom 20% test coverage module | HIGH — regression may go undetected |
| No accompanying test changes | HIGH — no regression safety net |
| Concurrency or async modified | HIGH — race condition risk |
| Datetime or timezone modified | HIGH — DST, locale, TZ edge cases |
| Module with 3+ open bugs | HIGH — pre-existing instability |

**Regression Score Calculation:**

| Factor | Score Addition |
|---|---|
| File changed 3+ times in 30 days (churn) | +2 |
| File unchanged 90+ days (stale) | +2 |
| Bottom 20% test coverage | +2 |
| Change is UNPLANNED | +1 |
| 5+ files touched | +1 |
| No accompanying test changes | +2 |
| FIX in fragile module (3+ prior fixes) | +2 |
| Experiment promoted to production | +1 |
| Module has 3+ open bugs | +2 |
| Concurrency or async modified | +2 |
| Datetime or timezone modified | +2 |

| Regression Score | Risk | Required Test Scope |
|---|---|---|
| 0–3 | LOW | Unit tests for changed module |
| 4–7 | MEDIUM | Unit + integration, module + direct dependents |
| 8–12 | HIGH | Full integration + smoke test, affected services |
| 13+ | VERY HIGH | Full regression + manual QA + 48h enhanced monitoring |

---

### P3.4 — Cross-Boundary Impact Detection

Every change operates within a system of interconnected boundaries. A change in module A can silently break modules B, C, and D. Cross-boundary impact detection systematically identifies all affected surfaces.

#### The Five Boundary Surfaces

For every changed module, check all five surfaces:

```
SURFACE 1 — IMPORT GRAPH:
  Exported symbol changed? Which modules import it?
  Action: grep for all importers. If 5+, note "AFFECTED: N modules"

SURFACE 2 — INTERFACE:
  Type/signature/trait/abstract class changed?
  Action: verify all implementations and callers

SURFACE 3 — DATA SHAPE:
  Serialized format/DB schema/API payload/protobuf changed?
  Action: verify all producers and consumers of the data

SURFACE 4 — EVENT CONTRACT:
  Event name/payload/routing key/topic changed?
  Action: verify all publishers and subscribers

SURFACE 5 — CONFIG SURFACE:
  Env var/CLI flag/config key/feature flag changed?
  Action: verify all readers and dependent configurations
```

#### Compatibility Rules

| Change in A | Check in B, C, D |
|---|---|
| Exported function signature changed | Every caller of that function |
| Interface or trait changed | Every implementation |
| Config key removed | Every reader of that key |
| Event field removed | Every subscriber to that event |
| DB column changed | Every query referencing that column |
| Error type added | Every catch or error handler |
| Import path changed | Every file with that import |
| Event routing key changed | Every subscriber filtering on that key |
| API endpoint path changed | Every client calling that endpoint |
| Public constant or enum value changed | Every reference to that value |

**Cardinality handling:**
- 1–4 callers: List them explicitly
- 5+ callers: Format as "AFFECTED: [N] modules — recommend grep-verify or add integration test"
- Never assert "no impact" without checking all 5 surfaces

#### Change Coupling Detection

Multiple changes that must deploy atomically to avoid inconsistent state:

**Coupling signals:**
- Two files reference the same contract (type, route, event, config key) and both are modified
- Schema migration + model + service all in the same diff
- Feature flag add + flag-gated code + monitoring alert addition
- API version bump + consumer update + documentation update
- Library version bump + consumer adaptation + integration test update

**Coupling rules:**

| Coupling Type | Requirement |
|---|---|
| Schema + code (same field) | Deploy as single atomic unit or use dual-write bridge |
| Producer + consumer (same event) | Coordinate deploy window; never deploy independently |
| Config rename + all readers | All readers must be updated before old key is removed |
| Library version + all consumers | Downstream must update before upstream breaking change deploys |
| IaC + service code | IaC first — resource must exist before application uses it |
| Migration + model + service | Deploy in order: migration → model update → service update |

**Decoupling strategies:**
- Expand-contract: add new, migrate, remove old (3-phase)
- Feature flag: gate code until infra or schema is ready
- Interface versioning: v1 and v2 coexist during migration period
- Shadow writes: write to both old and new until cutover confirmed
- Dual-read: read from both old and new key during config migration

#### Multi-Service Deploy Coordination

| Change Type | Deploy Order |
|---|---|
| Additive API | Provider first, consumer can follow |
| Breaking API | Consumer first (feature-detect or adapt), then provider |
| Event added | Producer first, then consumer |
| Event removed | Remove consumer first, then producer |
| Config key rename | Dual-read old + new → deploy all readers → remove old key |
| Database migration | Migration first → model update → service update → reader update |
| Library break | Downstream consumers first → upstream provider last |

When deploy order is ambiguous: "COORDINATED DEPLOY — [N] services — recommend feature flag or interface versioning."

#### Cross-Boundary Impact Template

```
CROSS-BOUNDARY IMPACT:
  Import surface:  [N] affected modules — [list or "grep-verify"]
  Interface:       [N] implementations affected — [list]
  Data shape:      [N] consumers affected — [list]
  Event contract:  [N] subscribers affected — [list]
  Config surface:  [N] readers affected — [list]
  ─────────────────────────────────────────────
  RECOMMENDATION:  [COORDINATED | STAGED | FEATURE-FLAG | NO-ISSUE]
```

---

### P3.5 — Safe-to-Merge Evaluation Gates

Safe-to-merge is not a boolean. It is a risk-calibrated determination derived from classification, scoring, boundary analysis, and deploy readiness.

#### Verdict Determination

```
SAFE TO MERGE: <YES | NO | CONDITIONAL>
  PRIMARY RISK:   <level> — <one-line description>
  CONTRACT BREAKS: <N> — <list>
  UNCOVERED CODE: <files without test changes>
  CROSS-SERVICE:  <affected | NONE>
  REVIEW NEEDED:  <SINGLE | PAIR | TEAM | SECURITY>
  DEPLOYMENT:     <DIRECT | STAGED | ROLLBACK_REQUIRED>
```

**PASS (score 0–3):** Safe to merge. Standard review. Direct deploy allowed.

**WARN (score 4–7):** Merge with attention items. Every WARN must have specific, actionable items. If no attention items exist, the WARN is invalid — downgrade to PASS.

**BLOCK (score 8–11):** Must not merge without changes. Every BLOCK has specific, actionable blockers. If no blockers exist, the BLOCK is invalid — downgrade to WARN.

**BLOCK-CRITICAL (score 12+):** Requires named architect or security sign-off. Documented approval must be attached. Deploy requires staged rollout.

#### Deployment Strategy by Risk + Blast Radius

| Risk | Radius | Strategy |
|---|---|---|
| CRITICAL | ALL_USERS | Staged 1% → 5% → 20% → 100% + kill switch |
| CRITICAL | DATA_INTEGRITY | Migration + pre/post validation + full rollback plan |
| CRITICAL | PLATFORM | Feature flag or blue-green + instant rollback capability |
| HIGH | ALL_USERS or PLATFORM | Staged 10% → 50% → 100% |
| HIGH | SERVICE or MULTI_SERVICE | Standard deploy + 1 hour post-deploy monitoring |
| MEDIUM | any | Standard deploy |
| LOW | any | Direct merge |
| INFO | any | Auto-deploy if CI passes |

#### Deployment Strategy by Reversibility

| Reversibility | Requirement |
|---|---|
| SAFE | Direct deploy |
| CAREFUL | Staged with coordination plan |
| HARD | Migration plan + explicit rollback procedure documented |
| IRREVERSIBLE | Backup + validation + sign-off before proceeding |

#### Detectability Gap Mitigation

| Detectability | Risk Threshold | Action |
|---|---|---|
| USER_REPORTED | HIGH+ | Add monitoring before deploy |
| UNDETECTABLE | MEDIUM+ | Add observable side effect (log or metric) |
| DELAYED | CRITICAL | Add early-warning alert |
| IMMEDIATE | any | Verify alert routing + on-call coverage |

#### CRITICAL Change Pre-Flight Checklist

- [ ] Canary group configured (minimum 1% traffic)
- [ ] Kill switch or feature flag available and tested
- [ ] Rollback procedure documented and tested
- [ ] Monitoring dashboards showing relevant metrics
- [ ] Alert thresholds tuned for this specific change
- [ ] On-call engineer notified of deploy window
- [ ] Migration plan (if applicable) with deploy order
- [ ] Data integrity validation query prepared

#### Migration Risk Matrix

| Migration Type | Risk | Rollback | Timing |
|---|---|---|---|
| ADD column (nullable, no default) | LOW | DROP instant | Any time |
| ADD column (NOT NULL, no default) | CRITICAL | Backfill required first | Deploy window |
| ADD column (with default) | MEDIUM | DROP + revert code | Low traffic |
| DROP column (no active reads) | MEDIUM | ADD + backfill | Deploy window |
| DROP column (active reads) | CRITICAL | ADD + restart service | Planned outage |
| RENAME column | CRITICAL | Both names must stay active | Read-only window |
| Type widen (int → bigint) | MEDIUM | Reverse if compatible | Off-peak |
| Type narrow (bigint → int) | CRITICAL | Truncation risk | Read-only window |
| ADD index | MEDIUM | DROP (if CONCURRENTLY) | Low traffic |
| ADD foreign key | HIGH | DROP, check data integrity | Low traffic |
| ADD constraint NOT VALID → VALIDATE | MEDIUM | Can validate later | Any time, no lock |

**Every migration output must include:**
- Deploy order (migration → model → service)
- Rollback SQL or procedure
- Expected duration
- Lock risk (ACCESS EXCLUSIVE blocks reads)
- Data integrity check query

#### Deploy Strategy Risk

| Strategy | Risk Level | Use When |
|---|---|---|
| DIRECT | HIGH | LOW risk or non-production only |
| ROLLING | MEDIUM | Standard production deploy |
| BLUE-GREEN | MEDIUM–HIGH | High traffic, cold cache acceptable |
| CANARY (1→5→20→100%) | LOW–MEDIUM | CRITICAL or HIGH risk changes |
| FEATURE FLAG | LOW | Kill switch available and tested |
| DARK LAUNCH | LOW | Schema changes, new consumer onboarding |

---

### P3.6 — Code Review Intelligence (Reading for Intent, Correctness, Maintainability)

The most valuable skill in code review is understanding intent versus implementation. You read code not as text but as an expression of what the author intended the system to do.

#### Intent vs Implementation

```
Implementation shows:
  - What the code DOES (the instructions executed)
  - HOW it achieves its goal (the algorithm)
  - The data flow (inputs, transforms, outputs)

Intent is revealed by:
  - Variable and function naming (does the name match the behavior?)
  - Comments and documentation (is there a gap between docs and code?)
  - Test cases (what scenarios did the author think of?)
  - Error handling (what did the author anticipate going wrong?)
  - Defensive checks (what assumptions is the author making?)
  - PR description (does the implementation match the stated goal?)
```

#### Intent Gaps

Flag these patterns as intent-reality mismatches:

| Gap | Signature | Action |
|---|---|---|
| Naming mismatch | `isValid()` returns status code, not boolean | Flag for rename or refactor |
| Comment-code drift | Comment says one thing, code does another | Block: documentation must match behavior |
| Missing edge case | Author assumed valid input, no validation | Flag: add edge case handling |
| Over-engineered | Complex abstraction for simple problem | Suggest simplification |
| Under-engineered | 500-line function with no abstractions | Suggest decomposition |
| Silent behavior change | PR says refactor, diff adds new behavior | Block: document the behavior change |
| Hidden dependency | PR doesn't mention new dependency in manifest | Flag: document dependency |
| Missing failure mode | Happy path only, no error handling | Block: add error handling |
| Assumption about environment | Hardcoded path or URL that differs by env | Flag: make configurable |

#### Defensive Review Questions

For every non-trivial change, ask these questions silently:

```
CORRECTNESS:
  - Does this code do what the description says?
  - Are there edge cases not handled? (empty, null, zero, negative, max)
  - What happens when a dependency fails or returns unexpected data?
  - What happens under concurrent access?
  - What happens on retry? Is the operation idempotent?

MAINTAINABILITY:
  - Will I understand this code in 6 months?
  - Does this introduce a pattern that conflicts with existing code?
  - Is the abstraction level appropriate? (Not too leaky, not too thick.)
  - Are there TODO / FIXME / HACK comments? Should they be tracked?
  - Is the added complexity proportional to the problem?

SECURITY-AWARE (flag, do not deep-review):
  - Does this touch authentication, authorization, or input validation?
  - Are user inputs sanitized? SQL injection? Command injection?
  - Are secrets handled correctly? (Not logged, not in code, not in URLs.)
  - Is there a rate limit or abuse vector?
  - Does this expose internal information?

PERFORMANCE-AWARE (flag, do not deep-review):
  - Is there an N+1 query or loop-within-loop?
  - Is there a synchronous call in a hot path?
  - Is there a cache miss or cache stampede risk?
  - Are data structures appropriate for the access pattern?
  - Are there unnecessary allocations, copies, or serializations?

TESTING-AWARE (flag, do not deep-review):
  - Do tests exist for every changed behavior?
  - Do tests fail if the fix is reverted?
  - Are there negative tests (error cases, edge cases)?
  - Are tests hermetic (no shared state, no external dependency)?
```

#### Code Reading Process: From Top to Bottom

Effective code reading follows a disciplined process. Do not jump to conclusions. Read in layers.

**Layer 1 — Structure (30s):**
Read the file's structure before reading any logic:
- What are the imports? (New dependencies? Changed import paths?)
- What are the exports? (Public API surface changed?)
- What is the module/class/function structure? (Architecture visible?)
- What is the control flow pattern? (Linear, branching, state machine, event-driven?)
- What external systems are referenced? (DB, cache, queue, API, file system?)

**Layer 2 — Data Flow (2min):**
Trace data through the changed code:
- Where does input come from? (Parameter, API request, DB query, event, file?)
- How is input validated? (Type check, schema validation, sanitization, assertion?)
- How is input transformed? (Mapping, filtering, aggregation, computation?)
- Where does output go? (Return value, DB write, event publish, API response, log?)
- What side effects occur? (State mutation, cache write, file write, external call?)
- Is there a side effect on a path that shouldn't have one?

**Layer 3 — Control Flow (3min):**
Trace every execution path:
```
For every conditional (if/else, switch, ternary, match):
  - Trace the TRUE branch — does it handle the expected case?
  - Trace the FALSE/ELSE branch — does it handle the unexpected case?
  - Is there a DEFAULT/CATCH-ALL branch? What happens if none match?

For every loop (for, while, map, filter, reduce):
  - Trace the EMPTY case — what happens with zero iterations?
  - Trace the SINGLE case — does one iteration work correctly?
  - Trace the MANY case — is there a performance concern?
  - Check termination — does the loop always terminate?

For every error path (try/catch, Result, Either, exception):
  - Trace the SUCCESS path — is the happy path complete?
  - Trace the FAILURE path — is the error properly handled?
  - Is the error logged/metrics? Is it re-thrown or swallowed?
  - Are resources cleaned up on both paths?

For every async operation (Promise, async/await, Future, callback):
  - Trace the RESOLVE path
  - Trace the REJECT path
  - Is there a TIMEOUT path?
  - Is there a RACE/CANCELLATION path?
```

**Layer 4 — State Changes (2min):**
- What mutable state does this code touch? (Variables, DB, cache, files, globals)
- Is state change atomic? (Transaction, lock, compare-and-swap?)
- What happens on concurrent access? (Two requests hitting the same state?)
- What happens on retry? (Idempotent? Deduplication key?)
- What happens on partial failure? (Some operations succeed, others fail?)

**Layer 5 — Integration Points (2min):**
- What external systems does this code call? (Services, DB, cache, queue, files)
- What happens if the external system is slow? (Timeout, circuit breaker?)
- What happens if the external system is down? (Graceful degradation, error message?)
- What happens if the external system returns unexpected data? (Validation, type check?)
- Are there retries? (Exponential backoff, jitter, retry limit?)

#### Common Defect Pattern Catalog

| Pattern | Signature | Review Check |
|---|---|---|
| Off-by-one | Loop condition, array index, pagination offset | Check boundary values: 0, 1, max, max+1 |
| Null or undefined | Access before null check, missing default | Trace all code paths — which bypass the null check? |
| Race condition | Shared mutable state, async without lock | Identify all readers and writers of shared state |
| Resource leak | Open without close/using/dispose | Match every open/dispose pair — are they on all paths? |
| Logic inversion | Wrong negation, wrong comparison, wrong branch | Trace both branches of every conditional |
| Type confusion | Mixed types in comparison, loose equality | Verify type contracts at function boundaries |
| Silent failure | Error swallowed, empty catch, ignored return value | Every error path must produce a signal (log/alert/metric) |
| Inconsistent state | Partial update, missing transaction | Is the operation atomic? Can the system read a partial state? |
| Security bypass | Missing auth check, exposed endpoint | Is every endpoint protected? Are there default-deny rules? |
| Performance regression | N+1 query, missing index, sync in hot path | Query count per request, loop-to-DB ratio |
| Idempotency violation | Same operation applied twice produces different result | Is the operation idempotent? Check for side effects |
| Time-of-check/time-of-use | Value checked then used later, may have changed | Is there a lock or atomic operation? |
| Magic number | Unexplained constant in logic | Extract to named constant with documentation |
| Dead code | Unreachable branch, unused variable, unused import | Remove or document why it exists |
| Error type swallowed | Generic error catch that discards type info | Preserve error type for caller handling |

---

### P3.7 — Review Prioritization by Risk

Not all changes need the same depth of review. Prioritize review effort proportional to risk. A 2-line change in auth needs more attention than a 200-line change in UI styling.

#### Review Depth by Change Type

| Change Type | Review Depth | Time Budget | Who Reviews |
|---|---|---|---|
| FIX — SECURITY | DEEP | Exhaustive | Security SME + author |
| FIX — DATA LOSS | DEEP | Exhaustive | Senior engineer |
| FIX — BUG (HIGH risk) | STANDARD | 15 min | Any engineer |
| FIX — BUG (LOW risk) | SHALLOW | 5 min | Any engineer |
| FEATURE — HIGH risk | DEEP | 30 min | Senior + peer |
| FEATURE — standard | STANDARD | 15 min | Any engineer |
| REFACTOR — structural | STANDARD | 20 min (focus on test diff) | Any engineer |
| REFACTOR — rename only | SHALLOW | 5 min | Any engineer |
| CONFIG | SHALLOW | 5 min | Any engineer |
| SCHEMA — additive | STANDARD | 10 min | Any engineer |
| SCHEMA — destructive | DEEP | 20 min | Senior engineer |
| DOCS or TESTS only | SHALLOW | 5 min | Any engineer |
| GENERATED CODE | SHALLOW (verify source) | 5 min | Any engineer |
| DEPENDENCY bump | SHALLOW | 5 min (review changelog) | Any engineer |
| INCIDENT hotfix | DEEP (post-hoc) | 30 min post-resolution | Lead engineer |

Time budget is maximum unless additional risk factors (security, data, public-facing, 500+ lines) require DEEP.

#### Review Priority by Risk Score

| Composite Score | Priority | Review SLA | Depth |
|---|---|---|---|
| 0–3 (PASS) | Low | 24 hours | SHALLOW |
| 4–7 (WARN) | Medium | 12 hours | STANDARD |
| 8–11 (BLOCK) | High | 4 hours | DEEP |
| 12+ (BLOCK-CRITICAL) | Critical | 2 hours | DEEP + sign-off |

#### The 500-Line Rule

Any diff over 500 lines is too large for effective review. The defect detection rate drops by 30% per additional 200 lines beyond 500. Block and request splitting into logical chunks. Review each chunk separately.

#### Review Velocity Management

| Situation | Approach |
|---|---|
| PR is small (<50 lines, clear scope) | Review immediately, SHALLOW depth |
| PR is medium (50–300 lines) | Review within 4 hours, STANDARD depth |
| PR is large (300–1000 lines) | Ask for split if >500 lines. Review within 24 hours, DEEP on core, SHALLOW on periphery |
| PR is massive (1000+ lines) | Block. Require split into logical chunks. Review each separately. |
| Author is junior | Deeper review, more explanation, more suggestions |
| Author is senior | Focus on correctness. Less style feedback. Challenge architectural choices. |
| High-risk module changed | DEEP regardless of line count |
| Multiple ownership boundaries crossed | Coordinate reviews with each CODEOWNER team |

---

### P3.8 — Actionable Feedback Patterns

Every piece of feedback falls into one of three categories. Classification must be explicit — never leave the author guessing about severity.

#### Feedback Classification

| Category | Impact | Action Required | Language Pattern |
|---|---|---|---|
| BLOCKER | Bug, security hole, contract break, test gap, classification error | Must fix before merge | "This must change because [reason]. Suggested fix: [specific]." |
| WARNING | Risk of future bug, maintainability concern, missing coverage, potential regression | Should fix before merge, or explicit defer with tracking issue | "This risks [impact] because [reason]. Consider [alternative]. If deferring, create issue: [link]." |
| SUGGESTION | Style, minor improvement, alternative approach, naming | Optional — author can accept or defer | "Consider [approach] for [benefit]. Not blocking." |

#### Blocker Litmus Tests

- **Production risk:** "If this merges as-is, could it cause a production incident?" If yes → BLOCKER
- **Contract break:** "Does this break an existing contract (API, schema, event, config) without migration?" If yes → BLOCKER
- **Data loss:** "Could this change cause data loss or corruption?" If yes → BLOCKER
- **Security:** "Does this introduce a security vulnerability?" If yes → BLOCKER
- **Test gap:** "Is the new or changed behavior completely untested?" If yes → BLOCKER
- **Classification error:** "Is the change classified incorrectly, leading to wrong review depth?" If yes → BLOCKER
- **Rollback:** "If this fails, is there no rollback plan for a CRITICAL change?" If yes → BLOCKER

#### Warning Litmus Tests

- **Future bug:** "If we merge this, will someone have to fix it later?" If yes → WARNING
- **Maintainability:** "Will this make future changes harder?" If yes → WARNING
- **Coverage gap:** "Is there a gap in test coverage that could hide a regression?" If yes → WARNING
- **Monitoring:** "If this fails, will we know before the user reports it?" If no → WARNING
- **Scope creep:** "Does this change include work not described in the PR?" If yes → WARNING

#### Suggestion Litmus Tests

- **Quality:** "Would the code be noticeably better with this change?" If yes → SUGGESTION
- **Consistency:** "Does this deviate from established patterns in the codebase?" If yes → SUGGESTION
- **Readability:** "Would a name change or restructuring make this clearer?" If yes → SUGGESTION

#### Feedback Structure

Every feedback item must follow this structure:

```
<CATEGORY>: <Location> — <One-line finding>
  <Specific reason explaining why it matters>
  Fix: <actionable suggestion, preferably with code>
```

Examples:

```
BLOCKER: auth/middleware.ts:47 — null pointer risk
  If `user` is null after the auth check, line 47 will throw a TypeError.
  Fix: add `if (!user) return res.status(401).json({ error: 'unauthorized' })` before accessing user.id.

WARNING: payment/processor.ts:89-92 — N+1 query pattern
  This loop executes a DB query per iteration. On 1000 items, this is 1000 queries.
  Consider: batch query using `WHERE id IN (?)` to reduce to 1 query.
  If deferring, create issue to track the optimization.

SUGGESTION: src/utils/helpers.ts:12 — function name clarity
  Consider renaming `getData` to `getUserProfile` to clarify what data is being fetched.
```

#### Feedback Communication Principles

| Principle | Explanation | Example |
|---|---|---|
| Assume positive intent | Author made reasonable choice with available info | "I think there might be a null risk here — what if user is null?" |
| Be specific | Vague feedback is not actionable | "Line 34: variable `data` could be null after API call. Add null check." |
| Explain the why | Context helps the author learn | "This SQL is injectable because we're interpolating user input. Use parameterized queries." |
| Offer alternatives | Don't just say wrong, suggest fix | "Consider extracting this into a helper function for testability." |
| Prioritize | Not everything is equally important | "BLOCKER: null pointer L47. WARNING: N+1 L89. SUGGESTION: rename L12." |
| Ask questions | Author may have context you lack | "Is there a reason this uses a class instead of a function?" |
| Timely | Review within SLA (4–24 hours depending on risk) | Delay is the #1 source of review frustration |
| Focus on code, not author | No personal language | "This code has a null-safety issue" not "You forgot to check for null" |

#### Feedback Anti-Patterns

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Feedback sandwich | Positive-negative-positive dilutes signal | Direct categorization with BLOCKER/WARNING/SUGGESTION |
| Nitpicking as blocker | Style preference labeled as must-fix | Classify as SUGGESTION, not BLOCKER |
| Vague warning | "This might be a problem" without specifics | "This risks [impact] at [location] because [reason]" |
| All blockers, no substance | Every comment is a blocker | Most feedback should be WARNING or SUGGESTION |
| No positive feedback | Only criticism | Include what the author did well |
| Hostile tone | "This is obviously wrong" | Assume positive intent. Explain, don't accuse. |
| Drive-by comment | Comment without reading surrounding context | Read the full diff before commenting |

#### Review Completion Checklist

After writing feedback, verify:

- [ ] Every BLOCKER has a specific fix suggestion with location
- [ ] Every WARNING has a specific risk described with location
- [ ] No personal language — focus on the code, not the author
- [ ] Positive feedback included (what the author did well)
- [ ] No nitpicks labeled as BLOCKER or WARNING
- [ ] If no issues found, said so explicitly: "No issues found. Looks good."
- [ ] Review completed within agreed SLA
- [ ] Feedback classified correctly (BLOCKER / WARNING / SUGGESTION)
- [ ] Each comment stands alone with location, reason, and suggestion

---

### P3.9 — Change Ledger & Audit Trail

Every classification, analysis, and review produces an immutable ledger entry. The ledger provides traceability, accountability, and data for process improvement.

#### Ledger Entry Structure

Every ledger entry captures:

```
EVENT:        <classify | analyze | review>
TIMESTAMP:    <ISO 8601>
CHANGE:       <PR or commit reference>
CLASSIFICATION:
  WorkType:   <type:sub-type>
  Intention:  <PLANNED | UNPLANNED>
  Breadth:    <scope>
  Reversibility: <level>
  Urgency:    <level>
  Detectability: <level>
  Blast Radius: <level>
  Composite:  <score> — <verdict>
BOUNDARIES CHECKED: <import | interface | data | event | config>
FINDINGS:
  - <BLOCKER | WARNING | SUGGESTION>: <finding>
VERDICT:      <PASS | WARN | BLOCK | BLOCK-CRITICAL>
APPROVAL:     <engineer>
```

#### Ledger Usage Rules

- Every classification change must produce a ledger entry
- Every analysis with a BLOCK or BLOCK-CRITICAL verdict must produce a ledger entry
- Every code review must produce a ledger entry
- Ledger entries are append-only. Corrections add a new entry referencing the previous one.
- Post-incident review must compare the incident's actual classification against the ledger entry
- Ledger data feeds classification accuracy metrics and process improvement

#### Classification Accuracy Metrics

| Metric | Target | Source |
|---|---|---|
| Post-incident misclassification rate | <5% | Compare incident ledger vs actual classification |
| UNPLANNED rate per session | <20% of changes | Ledger intention field |
| Escalation ladder activations | <2 per sprint | Score >8 frequency |
| WorkType re-classification rate | <10% of changes | Corrections in ledger |
| Boundary check completeness | 100% of BLOCK+ | Ledger boundary fields |
| Review turnaround within SLA | >90% | Ledger timestamp vs SLA |

#### Observability Signals by Classification

| Classification | Required Monitoring | Alert Threshold |
|---|---|---|
| SCHEMA:DB_REMOVE | Query error rate | >0.1% increase |
| CONTRACT:FUNCTION | Caller error rate | >1% increase |
| CONFIG:ENV_DEFAULT | Startup failure rate | >0% |
| FIX:SECURITY | Auth failure rate | >5% increase |
| FIX:PERFORMANCE | p99 latency | >50ms increase |
| INFRA:NETWORK | Connection error rate | >0.1% increase |
| SCHEMA:DB_ADD | Write latency, lock wait | >2x baseline |
| CONFIG:TIMEOUT / LIMIT | Client timeout errors | >1% of requests |
| FIX:DATA | Data integrity check failure | >0% |
| INCIDENT:OUTAGE | Service availability | <99.9% |
| SCHEMA:EVENT_REMOVE | Consumer error rate | >0.5% increase |
| CONTRACT:ROUTE_CHANGE | 404 rate on old route | >1% of requests |
| REFACTOR:RENAME | Reference resolution error | >0% |
| CONFIG:SECRET | Credential rotation failure | >0% |

#### Performance Risk by Classification

| Classification | Performance Risk | Mitigation |
|---|---|---|
| SCHEMA:DB_* | Migration locking, slow queries | Run at low traffic; use CONCURRENTLY where supported |
| CONFIG:TIMEOUT / LIMIT | Cascading timeouts under load | Staged rollout with p99 latency monitoring |
| FIX:PERFORMANCE | New bottleneck on other code paths | Benchmark before and after deploy |
| INFRA:SCALING | Over or under-provisioning | Gradual changes, monitor utilization metrics |
| FIX:SECURITY | Rate limiting impacts legitimate users | Monitor 4xx/5xx status codes post-deploy |
| REFACTOR:PERF | Algorithm regression on other inputs | Full performance test suite run |

#### Audit Trail Retention

- Classification entries: retained for entire project lifecycle
- Analysis entries with BLOCK+ verdict: retained for entire project lifecycle
- Review entries: retained for minimum 1 year
- Post-incident corrections: retained permanently with cross-reference to incident
- Aggregated metrics: retained for trend analysis (minimum 5 sprints)

---

### P3.10 — Review Quality Gates

Quality gates ensure that every review meets a minimum standard of thoroughness. These gates apply to the reviewer's output, not the author's code.

#### Tier 1 — Hard Gates

Any failure in Tier 1 invalidates the review. The reviewer must redo the review before it can be accepted.

- [ ] Every changed file has a WorkType classification
- [ ] All 5 boundary surfaces checked (import, interface, data, event, config)
- [ ] No invented context — every finding is grounded in the actual diff
- [ ] Every BLOCKER has specific location, reason, and suggested fix
- [ ] Every WARNING has specific risk and proposed action
- [ ] Security-relevant code paths identified and evaluated for risk classification
- [ ] Schema changes include deploy order and rollback plan stated
- [ ] BLOCK verdict has specific actionable blockers (no blockers = invalid BLOCK)
- [ ] BLOCK-CRITICAL verdict names the required sign-off engineer

#### Tier 2 — Standard Gates

- [ ] WARN verdict has specific attention items (no items = invalid WARN)
- [ ] Env var changes include fallback or default behavior stated
- [ ] Deleted symbols have callers checked (if visible in the diff scope)
- [ ] Generated code verified against source (source must also be changed)
- [ ] Ownership boundaries flagged and correct CODEOWNERS engaged
- [ ] BLOCKER count < 3 per 200 lines (if more, consider structural issue)
- [ ] SUGGESTION count < BLOCKER + WARNING count (suggestions are optional)
- [ ] All feedback includes "why" — not just "what" is wrong
- [ ] Junior authors receive more explanation
- [ ] Senior authors receive higher-category feedback
- [ ] PR description matches the diff (no scope creep undetected)
- [ ] 500+ line diff flagged for splitting
- [ ] Generated code verified against source

#### Self-Audit (run before output)

```
Every changed file classified?           yes
Composite score computed?               yes (3+ files) or N/A
All 5 boundary surfaces checked?        yes
Each BLOCKER has reason + fix?          yes
Each WARNING has risk stated?           yes
Security-relevant paths evaluated?      yes
Test coverage assessed for meaning?     yes
No rubber stamp — concrete findings?    yes
Feedback classified correctly?          yes
BLOCK without blockers?                 no
WARN without items?                     no
Risk below domain floor?                no
No personal language?                   yes
```

#### Review Depth by Change Type — Expanded Guide

| Change Type | Classification | Depth | What to Focus On | What to Skip |
|---|---|---|---|---|
| Security fix | FIX:SECURITY | DEEP | All input paths, auth checks, data exposure, secrets handling | Style, naming, formatting |
| Data fix | FIX:DATA | DEEP | Data validation, migration correctness, rollback, integrity checks | Minor refactors |
| Bug fix — high risk file | FIX:BUG in auth/payment/core | DEEP | Root cause correctness, edge cases, test coverage, regression test | Comments, docs |
| Bug fix — standard | FIX:BUG | STANDARD | Logic correctness, test coverage, error handling | Performance optimization |
| New feature — high risk | FEATURE in auth/payment | DEEP | Contract surface, security, data flow, error paths, integration tests | Minor style, naming |
| New feature — standard | FEATURE in UI/reporting | STANDARD | Correctness, test coverage, error handling | Edge cases in unrelated modules |
| Refactor — structural | REFACTOR:EXTRACT | STANDARD | Behavior preservation, test coverage (test diff should be detailed) | Formatting |
| Refactor — rename | REFACTOR:RENAME | SHALLOW | All references updated, deprecation paths | Logic review (no logic change) |
| Schema — additive | SCHEMA:DB_ADD | STANDARD | Migration correctness, rollback, model alignment, lock risk | Performance (unless large table) |
| Schema — destructive | SCHEMA:DB_REMOVE | DEEP | Migration order, dual-write plan, rollback, data integrity, all consumers updated | Minor style |
| Config — new env var | CONFIG:ENV_ADD | SHALLOW | Required/optional, default value, all envs documented | Logic review |
| Config — value change | CONFIG:ENV_DEFAULT | STANDARD | Breadth check — all readers, impact of new value | Code quality |
| Config — destructive | CONFIG:ENV_REMOVE | DEEP | All readers, fallback plan, coordination with consuming services | Style |
| Dependency bump — CVE | FIX:DEPENDENCY | SHALLOW | Changelog review, breaking changes, lock file consistency | Code review of the dep itself |
| Dependency bump — feature | FIX:DEPENDENCY | SHALLOW | Breaking changes, API changes used in code | Transitive deps |
| Test only | ANALYSIS | SHALLOW | Test correctness, coverage of meaningful scenarios, no vacuously-passing tests | Production code logic |
| Documentation | DOCS | SHALLOW | Technical accuracy, no misleading content | Code review |
| Generated code | CONTRACT | SHALLOW | Source file changed, regeneration command run | The generated output itself |
| Incident hotfix | INCIDENT | DEEP (post-hoc) | Root cause, fix correctness, monitoring gap | During incident: minimal review. Post-incident: full review |

#### Review Patterns That Fail Quality Gates

| Pattern | Gate Violated | Correction |
|---|---|---|
| "LGTM" on a 300-line diff | Tier 1 — no classification, no boundary check | Complete full review or explicitly state "No issues found" |
| "High risk" with no specifics | Tier 1 — BLOCKER without fix | Every BLOCKER needs location + reason + fix |
| "This pattern is bad" with no why | Tier 2 — feedback without "why" | Explain reason and impact |
| "Fix all nits" (10+ style comments as BLOCKER) | Tier 2 — suggestion count exceeds blocker count | Reclassify style comments as SUGGESTION |
| Review done in 30 seconds | Tier 1 — no evidence of thoroughness | Redo review with documented findings |
| "Tests look fine" — didn't run them | Tier 1 — no test evaluation | Run tests, verify they pass and cover the change |
| Ignoring the PR description | Tier 2 — context missed | Always read description + linked issue before reviewing diff |
| Reviewing line-by-line without understanding intent | Tier 1 — no intent analysis | Read for intent first, then check implementation |
| Only commenting on the code you understand | Tier 1 — incomplete review | Review every file in the diff, even unfamiliar ones |
| Delegating security review | Tier 1 — security is everyone's responsibility | Flag security concerns, even if security team will also review |
| Not running the code | Tier 2 — missing runtime understanding | For complex logic, run tests or mentally trace execution |
| Confirmation bias — only looking for what you expect | Tier 1 — incomplete coverage | Actively look for what might be wrong, not just what matches expectations |

---

## P4 — WORKED EXAMPLES (Reference Cards)

### E1: Payment Threshold Change with Undetected Risk

**Change:** `payment/processor.ts` — minimum payout changed from $10 to $25. 1 file, 2 lines.

**Context scan:** "Update minimum payout threshold." No linked issue. No mention of impact analysis.

**Classification:**
| Dimension | Value |
|---|---|
| WorkType | FIX:BUG (silent behavior change) |
| Intention | UNPLANNED (no ticket, no spec) |
| Breadth | LOCAL (1 file changed) |
| Reversibility | SAFE (code change only) |
| Urgency | THIS_SPRINT |
| Detectability | USER_REPORTED (payout discrepancy caught by users) |
| Blast Radius | ALL_USERS (every user's payout affected) |

**Composite score:** FIX:BUG = HIGH (3) + ALL_USERS +2 → **CRITICAL (5)**

**Conflict resolution:** UNPLANNED escalates one level → already CRITICAL. ALL_USERS minimum HIGH → exceeded.

**Boundary surfaces checked:**
- Import: No exports changed
- Interface: No signature changes
- Data shape: Payout calculation output changes — affects reporting, notifications, tax documents
- Event: `payout.processed` event payload unchanged but values change
- Config: No config surface

**Cross-boundary impact:** Payout value change affects financial reporting, user notifications, tax form generation, and accounting exports. 4 downstream systems consume payout amounts.

**Safe-to-merge verdict:**
```
SAFE TO MERGE: CONDITIONAL
  PRIMARY RISK: CRITICAL — payout threshold change affects all users, financial reporting
  CONTRACT BREAKS: 0 (value change, not contract)
  UNCOVERED CODE: No test changes — how is the threshold tested?
  CROSS-SERVICE: 4 downstream systems affected (reporting, notifications, tax, accounting)
  REVIEW NEEDED: TEAM (senior + finance stakeholder)
  DEPLOYMENT: STAGED — 1% → 5% → 20% → 100%
```

**Feedback:**
- BLOCKER: No test changes. A financial calculation change must have tests that verify the new threshold produces correct payouts. Add tests for: $10 (below), $25 (at), $30 (above).
- BLOCKER: ALL_USERS + USER_REPORTED — add monitoring for `payout_under_minimum` alert before deploy. Currently undetectable until users complain.
- BLOCKER: UNPLANNED change to payment logic. Create a ticket, document the threshold decision, get product owner sign-off.
- WARNING: 4 downstream systems consume payout amounts. Verify each system can handle the new threshold without adjustment.
- WARNING: Notify finance team of the threshold change before deploy.
- SUGGESTION: Consider making the threshold config-driven rather than hardcoded.

**Deploy plan:**
1. Add monitoring alert for payout validation
2. Deploy with canary (1% traffic)
3. Monitor payout calculations for 30 min
4. Ramp to 25%, monitor
5. Full rollout after 1 hour of no anomalies
6. Notify finance team after successful deploy

---

### E2: Refactor with Scope Creep (Config Addition)

**Change:** `auth/session.ts` — extract session validation logic. Primary change: REFACTOR:EXTRACT. During work, developer added a `SESSION_TIMEOUT` config key.

**Classification:**
| Change | WorkType | Risk | Intention |
|---|---|---|---|
| Primary | REFACTOR:EXTRACT | MEDIUM | PLANNED |
| Scope creep | CONFIG:ENV_ADD | HIGH | UNPLANNED |

**Composite:** Primary MEDIUM (2) + scope creep HIGH (3) → use HIGH. UNPLANNED escalates one level → target HIGH, already HIGH.

**Conflict resolution:** Sub-type risk (ENV_ADD = HIGH) overrides primary (EXTRACT = MEDIUM).

**Boundary surfaces:**
- Primary: Session extraction — no interface change, internal only
- Scope creep: New env var `SESSION_TIMEOUT` — all session consumers implicitly affected

**Cross-boundary impact:** New `SESSION_TIMEOUT` env var affects all session creation paths. Must verify: (1) is the var documented? (2) do deployment configs have a default? (3) do all environments set this value?

**Safe-to-merge verdict:**
```
SAFE TO MERGE: CONDITIONAL
  PRIMARY RISK: MEDIUM — refactor with scope creep
  CONTRACT BREAKS: 0 (env var is additive, but check required status)
  UNCOVERED CODE: Session extraction has tests, config addition does not
  DEPLOYMENT: STANDARD
```

**Feedback:**
- WARNING: Scope creep detected — `SESSION_TIMEOUT` env var added without being in the PR scope. Options: (A) remove the config addition and submit separately with proper spec and tests, (B) re-scope this PR to include the config change with documentation and tests.
- WARNING: If `SESSION_TIMEOUT` is required (no default), all deployment environments must be updated before deploy. Flag if any environment would fail at startup.
- SUGGESTION: The extraction itself is clean. Good separation of validation from session management.

**Output formats applied:**
```
CLASSIFICATION DEVIATION — expected REFACTOR:EXTRACT/MEDIUM/PLANNED — actual CONFIG:ENV_ADD/HIGH/UNPLANNED
Delta: UNPLANNED scope creep — Action: option A (remove) or option B (re-scope with spec + tests)
```

---

### E3: Database Column Rename (Destructive Schema Change)

**Change:** Rename `users.status` → `users.account_status`. Includes: migration, model update, 2 query updates, 1 service update.

**Classification:**
| Dimension | Value |
|---|---|
| WorkType | SCHEMA:DB_RENAME |
| Intention | PLANNED |
| Breadth | CROSS_MODULE (migration + model + services + queries) |
| Reversibility | HARD (column rename is difficult to reverse) |
| Urgency | SCHEDULED |
| Detectability | DELAYED (queries fail at runtime when schema mismatches code) |
| Blast Radius | SERVICE (affects all user-related operations) |

**Composite score:** SCHEMA:DB_RENAME = CRITICAL (floor). HARD + SERVICE → no adjustment needed. **CRITICAL (4).**

**Domain floor:** DB schema remove/rename → CRITICAL (floor applies).

**Boundary surfaces:**
- Import: Model type changes propagate to all imports
- Interface: `user.status` accessor changes
- Data shape: Wire format of user objects changes
- Event: `user.updated` event payload field name changes (if status is included)
- Config: No config surface

**Cross-boundary impact:** 8 modules reference `user.status`. All must be updated or they will fail at compile time (TypeScript) or runtime (dynamic).

**Safe-to-merge verdict:**
```
SAFE TO MERGE: CONDITIONAL
  PRIMARY RISK: CRITICAL — destructive schema change
  CONTRACT BREAKS: 1 (user.status → user.account_status)
  UNCOVERED CODE: 3 of the 8 callers have no test coverage
  CROSS-SERVICE: 1 service consumes user events with old field name
  REVIEW NEEDED: SENIOR ENGINEER + DATA LEAD
  DEPLOYMENT: COORDINATED — migration → model → services (3-phase)
```

**Feedback:**
- BLOCKER: Schema requires 3-phase deploy: (1) add `account_status` column, dual-write both columns, (2) deploy code reading `account_status`, (3) remove `status` column after verification. Current diff skips phase 1. Add dual-write migration.
- BLOCKER: No rollback migration. Add down migration: rename `account_status` back to `status`.
- BLOCKER: No pre-migration data validation. Are there any NULL values in `status`? Add check migration.
- WARNING: 1 downstream service consumes `user.updated` events that include `status` field. Verify consumer can handle the renamed field or add a transition period with both fields in the event payload.
- WARNING: 3 of 8 callers updated have no test coverage. Add at minimum a smoke test for each.
- SUGGESTION: Consider using a database refactoring tool or ORM-level view for the transition period.

**Deploy order:**
1. Phase 1: Add `account_status` column, dual-write `status` and `account_status`
2. Verify dual-write: compare both columns for consistency
3. Phase 2: Deploy code reading `account_status`, update all 8 callers
4. Monitor: query latency, null_count on new column, error rate
5. Phase 3: After 1 week of stable operation, drop `status` column

---

### E4: The "Just Config" Trap — Timeout Change with 8 Callers

**Change:** `config/production.json` — `TIMEOUT_MS` changed from 30000 to 5000. 1 file changed. 8 implicit callers that read this config value.

**Classification:**
| Dimension | Value |
|---|---|
| WorkType | CONFIG:ENV_DEFAULT |
| Intention | UNPLANNED (not in ticket, not documented as impactful) |
| Breadth | CONTRACT (config is read by 8 modules across the system) |
| Reversibility | SAFE (code change only, can be reverted) |
| Urgency | THIS_SPRINT |
| Detectability | DELAYED (timeouts manifest under load, not immediately) |
| Blast Radius | MULTI_SERVICE (3 services read this config) |

**Composite score:** CONFIG:ENV_DEFAULT = MEDIUM (2) + MULTI_SERVICE +1 = 3. UNPLANNED → +1. Total = 4. Verdict: **WARN.**

**Cross-boundary impact:** 8 callers across 3 services. 6 of 8 callers have no explicit timeout override and will be affected. 2 callers already have lower timeouts and are unaffected.

**Safe-to-merge verdict:**
```
SAFE TO MERGE: CONDITIONAL
  PRIMARY RISK: HIGH (via cross-boundary escalation) — not "just config"
  CONTRACT BREAKS: 0 (no contract, but behavior changes for 6 callers)
  DEPLOYMENT: STANDARD + 1 hour monitoring
```

**Feedback:**
- BLOCKER: Config change affects 6 callers that have no explicit timeout override. Before changing the global default, either (A) audit all 8 callers and add explicit timeouts to those needing 30s, or (B) introduce a new config key for the specific service that needs 5s and leave the global default at 30s.
- WARNING: This change was classified as "just config" but has cross-module impact across 3 services. All config changes must be evaluated for implicit callers. Add config impact review to the PR template.
- SUGGESTION: Consider structured config with per-service overrides to avoid future "config trap" scenarios.

**Cross-boundary output:**
```
CROSS-BOUNDARY IMPACT:
  Import surface:  0 (config file, no exports)
  Interface:       0 (no type change)
  Data shape:      0 (no data format change)
  Event contract:  0 (no event change)
  Config surface:  8 callers, 6 affected — [services A, B, C]
  ──────────────────────────────────────
  RECOMMENDATION: Add explicit timeouts to 6 callers before changing default
```

---

### E5: Incident During Feature Work (Priority Switch)

**Situation:** PagerDuty fires for auth service (p99 latency spike to 5s) while engineer is working on user profile FEATURE.

**Classification (incident):**
| Dimension | Value |
|---|---|
| WorkType | INCIDENT:DEGRADED |
| Intention | UNPLANNED (reactive to production event) |
| Breadth | CROSS_SERVICE (auth affects all services) |
| Reversibility | HARD (performance regression may have complex root cause) |
| Urgency | IMMEDIATE |
| Detectability | IMMEDIATE (pager alert) |
| Blast Radius | PLATFORM (all services depend on auth) |

**Composite score:** INCIDENT:DEGRADED = CRITICAL (floor). PLATFORM +2. IMMEDIATE → already INCIDENT. **CRITICAL.**

**Escalation ladder:** Level 5 — INCIDENT during non-incident work. Switch to incident response immediately.

**Action sequence:**
1. Suspend feature work. Snapshot current state per S6.
2. Switch to INCIDENT response mode.
3. Classify the incident: is it a recent deploy? Code change? Traffic spike?
4. Mitigate (rollback, scale up, circuit-breaker).
5. After mitigation, reclassify separately as FIX:PERFORMANCE for root cause investigation.
6. Resume feature work only after incident is resolved and post-mortem scheduled.
7. Auto-emit incident snapshot per synarc S6. Ledger entry for the reclassification.

**Post-incident checks:**
- Was the original FEATURE classification correct? (Yes — it was pre-incident)
- Was the incident root cause related to the feature work? (Unlikely, but check)
- Did the incident reveal a monitoring gap? (Consider adding pre-deploy performance regression checks)
- What systemic fix prevents recurrence? (Performance test suite, canary analysis)

---

### E6: SQL Injection in Search Endpoint (Junior Engineer)

**Change:** New search endpoint with dynamic query building. 85 lines. Junior engineer.

**Diff:** 
```python
def search_users(query):
    sql = f"SELECT * FROM users WHERE name LIKE '%{query}%' OR email LIKE '%{query}%'"
    return db.execute(sql)
```

**Classification:**
| Dimension | Value |
|---|---|
| WorkType | FIX:SECURITY (the security hole exists in the new code) |
| Intention | PLANNED (contributing feature, but security issue is UNPLANNED) |
| Breadth | LOCAL (single endpoint) |
| Reversibility | SAFE |
| Urgency | IMMEDIATE (security vulnerability) |
| Detectability | IMMEDIATE (visible in diff) |
| Blast Radius | DATA_INTEGRITY (SQL injection can exfiltrate all data) |

**Composite score:** FIX:SECURITY = CRITICAL (floor). DATA_INTEGRITY +2. **CRITICAL.**

**Conflict resolution:** Even though the author classified this as FEATURE, the presence of SQL injection makes it FIX:SECURITY. Reclassification is mandatory.

**Safe-to-merge verdict:**
```
SAFE TO MERGE: NO
  PRIMARY RISK: CRITICAL — SQL injection vulnerability
  CONTRACT BREAKS: 0
  DEPLOYMENT: BLOCKED until fixed
```

**Feedback:**
- BLOCKER: L42 — SQL injection. String interpolation builds SQL with unsanitized user input. Use parameterized query: `"SELECT * FROM users WHERE name LIKE ? OR email LIKE ?"` with params `[f"%{query}%", f"%{query}%"]`. This is a security vulnerability — do not merge until fixed.
- BLOCKER: No tests for the search endpoint. Add tests: empty query, special characters, SQL injection attempt strings, long strings.
- WARNING: No input sanitization. Even without SQL injection, special characters in LIKE can cause unexpected behavior or performance issues (e.g., leading wildcard).
- SUGGESTION: Consider full-text search index for production-scale query performance. The current LIKE query will be slow on large tables.
- SUGGESTION: Add a web application firewall or query parameter validation layer for defense in depth.

**Author context handling (junior engineer):**
- Explain SQL injection in detail: "String interpolation in SQL queries allows attackers to modify the query structure by including SQL syntax in the search term."
- Provide concrete before/after code example
- Point to the team's ORM documentation
- Offer to pair on the fix
- Acknowledge what was done well: endpoint structure, error handling approach

---

### E7: Multi-Service Feature Flag Removal (Coordinated Deploy)

**Change:** Remove `enable_new_checkout` feature flag across 3 services. Files: `feature-flags/enable_new_checkout.go` (CONFIG:FLAG), `checkout/api.go` (FIX), `payment/api.go` (FIX), `analytics/events.go` (REFACTOR).

**Classification (per file):**

| File | WorkType | Risk | Breadth |
|---|---|---|---|
| `feature-flags/enable_new_checkout.go` | CONFIG:FLAG | MEDIUM | CROSS_SERVICE |
| `checkout/api.go` | FIX | HIGH | SERVICE |
| `payment/api.go` | FIX | HIGH | SERVICE |
| `analytics/events.go` | REFACTOR | MEDIUM | MODULE |

**Overall classification:** Highest risk = HIGH. Reversibility = IRREVERSIBLE (once code paths are removed, re-adding requires new deploy). Blast Radius = MULTI_SERVICE (3 services).

**Composite score:** checkout=2, payment=3, analytics=1 → base=6. MULTI_SERVICE +1, IRREVERSIBLE → minimum HIGH. Total = 7 (≥ BLOCK threshold via IRREVERSIBLE + MULTI_SERVICE).

**Domain floor:** Payment file touched → BLOCK minimum. Final: **BLOCK-CRITICAL (via floor).**

**Safe-to-merge verdict:**
```
SAFE TO MERGE: CONDITIONAL
  PRIMARY RISK: BLOCK-CRITICAL — multi-service flag removal, irreversible
  CONTRACT BREAKS: 0 (flag removal, no API change)
  UNCOVERED CODE: analytics/events.go has no tests for new checkout path
  CROSS-SERVICE: 3 services must deploy in coordinated window
  REVIEW NEEDED: TEAM + PLATFORM ARCHITECT
  DEPLOYMENT: COORDINATED — all 3 services same window
```

**Feedback:**
- BLOCKER: IRREVERSIBLE change — once the flag is removed, old checkout code path is gone. If the new checkout has a critical bug, there is no fast rollback. Add a kill-switch env var (`DISABLE_NEW_CHECKOUT=true`) that restores the old path as an emergency measure. Remove the kill-switch after 2 weeks of stable operation.
- BLOCKER: Coordinated deploy required — all 3 services must deploy in the same window. Verify deploy order: checkout → payment → analytics. If any service deploys independently, the system enters an inconsistent state where some services use new checkout and others expect the flag.
- BLOCKER: No monitoring references to the flag checked. If any monitoring dashboard or alert references `enable_new_checkout`, it must be updated to reference the new checkout metrics.
- BLOCKER: analytics/events.go has no tests for the new checkout event paths. Add tests before removing the flag path.
- WARNING: Verify that no external documentation, API references, or client SDKs reference the `enable_new_checkout` concept.
- WARNING: Is there a gradual rollout plan? The flag removal should still be rolled out via canary even though the flag is removed — deploy to 1% of instances first, monitor for 30 min, then full rollout.

**Deploy plan:**
1. Pre-deploy: Add kill-switch env var. Update monitoring dashboards. Verify all 3 services are at compatible versions.
2. Deploy order: checkout (1%) → monitor → payment (1%) → monitor → analytics (1%) → monitor
3. Full rollout: all 3 services to 100%
4. Post-deploy: Monitor key metrics for 1 hour (checkout success rate, payment errors, analytics events)
5. After 2 weeks stable: Remove kill-switch code

---

## P5 — ANTI-PATTERNS

### P5.1 — Classification Anti-Patterns

| # | Anti-Pattern | Problem | Correct |
|---|---|---|---|
| 1 | Classify by effort not impact | 3-line auth change classified as LOW because "it's small" | Classify by blast radius — auth changes are CRITICAL regardless of line count |
| 2 | "Just config" minimization | Timeout change classified as LOW because "it's just a config" | Check import graph and all implicit callers. Classify by breadth, not file type |
| 3 | Scope creep bleed | CSS + auth + data changes all in one PR classified at lowest common denominator | Classify each file independently, use MAX(risk) across all files as the overall risk |
| 4 | Optimistic classification | Change classified LOW assuming low/no load in production | Assume normal production conditions — classify by worst-case scenario |
| 5 | Past classification reuse | "This was LOW last time we did it" | Re-evaluate every change independently. Context, dependencies, and environment change |
| 6 | Ignoring detectability | HIGH risk change deployed without monitoring because detectability wasn't considered | Add monitoring as a deploy prerequisite for any HIGH+ change with USER_REPORTED or UNDETECTABLE |
| 7 | Missing dimension | "High risk" stated without supporting 7D context | State all 7 dimensions explicitly. "High risk" is meaningless without dimension support |
| 8 | Assumed default | Detectability not checked → assumed IMMEDIATE | Flag unknown dimensions — never assign a default |
| 9 | No escalation for 2+ HIGH changes | Multiple HIGH changes pass review without pause | Follow the escalation ladder (P3.2): 2+ HIGH = STOP and document |
| 10 | Classify by file count | 1 file = LOW risk | 1-file config change can affect 8 modules across 3 services |
| 11 | FIX for everything | Performance regression classified as FIX:BUG | Use FIX:PERFORMANCE correctly for performance issues |
| 12 | REFACTOR as SCHEMA shield | "Refactoring" a DB column rename to avoid CRITICAL classification | SCHEMA:DB_RENAME / CRITICAL — the sub-type determines the risk, not the top-level WorkType |
| 13 | FEATURE flag as risk shield | "It's behind a feature flag, so it's LOW" | FEATURE:FLAG / MEDIUM still reaches production. Needs monitoring, staged rollout |
| 14 | INCIDENT for non-emergency | Priority bypass used for non-critical work | INCIDENT is only for production-impacting events. Planned work must follow normal process |
| 15 | ANALYSIS as work avoidance | "Analyzing" when the intent is to write code | ANALYSIS is read-only. If code changes are planned, classify as the intended WorkType |
| 16 | Single-dimension classification | "HIGH risk" based on WorkType only | All 7 dimensions must be assigned. A FIX:HIGH with SINGLE_USER is different from FIX:HIGH with ALL_USERS |
| 17 | Ignoring coupling | Schema change reviewed in isolation without checking coupled code changes | If migration + model + service change in the same diff, they are coupled. Classify as a unit |
| 18 | Breaking change minimization | "It's just a param rename" — classified as REFACTOR instead of CONTRACT:PARAM_RENAME | Required param rename is BREAKING. Classify as CONTRACT/CRITICAL |

### P5.2 — Analysis Anti-Patterns

| # | Anti-Pattern | Problem | Correct |
|---|---|---|---|
| 19 | Deletion without caller check | Function deleted assuming no callers | Grep the entire codebase for references, including generated code and config files |
| 20 | Migration classified as FIX | "Fix migration" instead of SCHEMA | Schema changes have different deploy requirements than logic fixes |
| 21 | Generated code as REFACTOR | Protobuf changed but source .proto didn't | CONTRACT — flag that source must be updated |
| 22 | "No impact" without checking | Assuming no consumers without verifying | Check all 5 boundary surfaces before asserting no impact |
| 23 | Single-risk aggregation | Multi-file change assigned a single risk level | Per-file + composite scoring captures the full risk picture |
| 24 | BLOCK without blockers | "High risk" BLOCK with no specific requirements | BLOCK is invalid without specific, actionable blockers |
| 25 | WARN without items | WARN output with no attention items | WARN degrades to noise over time. Every WARN must have specific watch-items |
| 26 | Vague risk output | "Moderate risk" with no supporting data | "SCORE 8 — auth structural change + uncovered code — BLOCK" |
| 27 | Missing migration order | Schema change without deploy sequence | "Migration → model → service" — always specify the deploy order |
| 28 | Passive recommendations | "Engineers should be careful" | "BLOCKER: add rollback migration before deploying schema change" |
| 29 | Ignoring generated code | Only reviewing generated output, not source | Verify the source was changed and the regeneration command was run |
| 30 | Reviewing without context | Analyzing diff without reading PR description | Always read description and linked issue first |
| 31 | Assuming linear impact | "One file changed, one thing affected" | Config changes can have graph-propagated impact. Always check the import graph |
| 32 | Missing lock file check | Manifest changed but lock file not updated | Flag: manifest + lock file must change together (unless dep is optional) |

### P5.3 — Review Anti-Patterns

| # | Anti-Pattern | Problem | Correct |
|---|---|---|---|
| 33 | Nitpicking style as BLOCKER | Blocking on formatting or naming preference | Classify as SUGGESTION, not BLOCKER. Use formatters for automation |
| 34 | Rubber stamping | "LGTM" without reading the diff | Every review has a concrete finding or explicit "No issues found" |
| 35 | Bikeshedding | Debating trivial details while missing real bugs | Focus review time proportional to risk. 80% of effort on 20% of the change |
| 36 | Drive-by review | Skimming and assuming correctness | Read the diff line by line for files in scope |
| 37 | Review as gatekeeping | Using review to block rather than improve | Review is collaboration. Explain, don't dictate. |
| 38 | Authoritarian language | "This is wrong" without explanation | "This risks [impact] because [evidence]. Alternative: [specific]." |
| 39 | Too many blockers | Every comment is a BLOCKER | Classify by impact. Most feedback should be WARNING or SUGGESTION |
| 40 | Ignoring tests | "I reviewed the code, skipped tests" | Review tests first — they define expected behavior. Verify they test the change |
| 41 | Reviewing generated code only | Reading minified or compiled output | Review the source file. Verify the regeneration command |
| 42 | Delayed review | Sitting on a PR for days | Review within 4–24 hours. Delaying a PR is the #1 source of team frustration |
| 43 | Assuming correctness | "It compiles, it's probably fine" | Compilation does not guarantee correctness, security, or performance |
| 44 | Monkey-see pattern | "This is how it's done elsewhere" without evaluation | Each change evaluated on its own merits. Patterns can be wrong or outdated |
| 45 | Hostile tone | "This is obviously wrong" | Assume positive intent. Ask questions, don't accuse. |
| 46 | False consensus | Multiple reviewers, no issues found = must be correct | Each reviewer independently evaluates. Groupthink misses individual concerns |
| 47 | Reviewing without reproducing | Trusting that code works as described | Run the tests. Check the build. Verify CI passes. |
| 48 | Focusing on syntax over semantics | Commenting on code style while missing logic errors | Read for intent first, style second |

### P5.4 — Process Anti-Patterns

| # | Anti-Pattern | Problem | Correct |
|---|---|---|---|
| 49 | No pre-declaration | Starting work without classifying the change | Declare WorkType, Risk, Breadth, and affected files before writing code |
| 50 | Classification after the fact | Classifying the change when submitting for review | Classification happens before code is written. Change direction affects classification |
| 51 | Skipping phases | Jumping from classification straight to feedback | Follow the 8-phase unified sequence. Every phase must complete |
| 52 | Mixing analysis and writing | Analyzing code while also writing code | During analysis, no code writing. Separate the activities |
| 53 | Reviewing own work | Self-review without peer validation | Every change needs at least one other set of eyes |
| 54 | No post-deploy verification | Deploying and moving on without monitoring | Monitor CRITICAL changes for 1 hour post-deploy |
| 55 | No post-mortem for INCIDENT | Incident resolved, root cause not investigated | Every INCIDENT gets a post-mortem within 72 hours |
| 56 | Ignoring ledger data | Classification accuracy metrics not reviewed | Review ledger data every sprint. Are misclassifications trending up or down? |
| 57 | No feedback on feedback | Reviewer never hears if feedback was helpful | Occasionally follow up: "Was my review on PR #123 helpful?" |
| 58 | Inconsistent review depth | Same type of change gets different depth from different reviewers | Standardize review depth by risk classification |

---

## P6 — QUALITY GATES

Quality gates are the enforcement mechanism for change intelligence. They operate at three tiers and apply to every classification, analysis, and review.

### Tier 1 — Hard Block (Any Failure = Invalid Output)

These gates cannot be skipped or waived. Failure means the entire classification/analysis/review must be redone.

#### Classification Gates

- [ ] Every changed file has a WorkType assigned (per S1 + sub-type reference P3.1)
- [ ] All 7 dimensions assigned for the overall change
- [ ] PLANNED/UNPLANNED determined for every file
- [ ] Sub-type assigned per P3.1 for every file (not just top-level WorkType)
- [ ] Composite risk computed (simple for 1–2 files, weighted for 3+ files)
- [ ] Domain hard floor applied and documented
- [ ] UNPLANNED scope creep flagged explicitly
- [ ] CRITICAL change has migration plan + rollback plan stated
- [ ] Blast radius adjustment applied correctly
- [ ] Any CRITICAL + IRREVERSIBLE combination has explicit written approval

#### Analysis Gates

- [ ] Every changed file has a classification (from Phase 1)
- [ ] Composite score computed for 3+ file diffs
- [ ] All 5 boundary surfaces checked (import, interface, data, event, config)
- [ ] No invented context — every finding grounded in the actual diff
- [ ] Auth/payment/security files evaluated at HIGH minimum (floor enforced)
- [ ] Schema changes include deploy order + rollback plan stated
- [ ] BLOCK verdict has specific, actionable blockers (no blockers = invalid)
- [ ] BLOCK-CRITICAL verdict names the required sign-off engineer

#### Review Gates

- [ ] All contract surfaces checked (API, schema, events, config, imports)
- [ ] Every BLOCKER has specific location, reason, and suggested fix
- [ ] Every WARNING has specific risk and proposed action
- [ ] Security-relevant code paths identified and evaluated for risk classification
- [ ] Error handling paths traced for all new/changed logic
- [ ] No rubber stamping — concrete findings or explicit "no issues found"
- [ ] Test coverage assessed — not just "exists" but "meaningful"

### Tier 2 — Standard Gates

These gates should be met but may be waived with explicit documented justification.

#### Classification Gates

- [ ] Pre-declared classification matches actual diff (from ticket/issue)
- [ ] Risk + blast radius maps to valid deployment strategy (per P3.5)
- [ ] Escalation ladder evaluated and level determined
- [ ] Change coupling detected and documented (if applicable)
- [ ] Regression prediction scored (if applicable — use for 3+ file diffs)
- [ ] Breaking change classification applied (if any contract change)

#### Analysis Gates

- [ ] WARN verdict has specific attention items (no items = invalid WARN)
- [ ] Env var changes include fallback or default behavior documented
- [ ] Deleted symbols: callers checked and documented (if visible in scope)
- [ ] Generated code: source verified + regeneration command noted
- [ ] Ownership boundaries flagged and correct CODEOWNERS engaged
- [ ] Depth assessment correctly applied (P3.3 depth table)

#### Review Gates

- [ ] BLOCKER count < 3 per 200 lines (if more, flag structural issue)
- [ ] SUGGESTION count < BLOCKER + WARNING count (suggestions are optional)
- [ ] All feedback includes "why" — not just "what" is wrong
- [ ] Junior authors receive proportionally more explanation
- [ ] Senior authors receive proportionally more BLOCKER/WARNING feedback
- [ ] PR description matches the diff (no undetected scope creep)
- [ ] 500+ line diff flagged for splitting with recommendation
- [ ] Generated code verified against source in diff

### Tier 3 — Excellence Gates

These gates distinguish great change intelligence from adequate. They are aspirational targets.

- [ ] Every BLOCKER includes a code-level fix suggestion (not just description)
- [ ] Cross-boundary impact documented in structured format (P3.4 template)
- [ ] Deploy order specified for multi-service changes
- [ ] Monitoring recommendation included for UNDETECTABLE changes
- [ ] Regression score computed and documented for 5+ file diffs
- [ ] Ledger entry created with all required fields
- [ ] Feedback acknowledges what the author did well (not just problems)
- [ ] Review completed within SLA for the risk level
- [ ] Post-deploy monitoring recommendations included for CRITICAL changes
- [ ] Questions asked where author context may clarify intent

### Self-Audit Checklists

#### Before Classifying

```
Ticket has WorkType declared?              yes
Understanding of all 7 dimensions?         yes
No assumption of defaults?                 yes
Ambiguity resolved to higher risk?         yes
```

#### Before Analyzing

```
Every file classified?                     yes
Scope and direction determined?            yes
Score computed (3+ files) or N/A?          yes
All 5 boundary surfaces checked?           yes
No BLOCK without blockers?                 yes
No WARN without items?                     yes
Risk below domain floor?                   no
```

#### Before Reviewing

```
All contract surfaces checked?             yes
Blockers have reason + fix?                yes
Warnings have risk stated?                 yes
Security-relevant paths evaluated?         yes
Tests evaluated for meaning?               yes
No rubber stamp?                           yes
Feedback classified correctly?             yes
No personal language?                      yes
```

#### Before Outputting

```
Every file classified?                     yes
Composite score computed?                  yes (3+) or N/A
All 5 boundaries checked?                  yes
BLOCK without blockers?                    no
WARN without items?                        no
Risk below domain floor?                   no
PR description matches diff?               yes
Ledger entry prepared?                     yes
```

### Gate Failure Resolution

| Gate Tier | Failure Action | Who Can Override | Override Conditions |
|---|---|---|---|
| Tier 1 — Classification | Redo classification. Do not proceed to analysis. | Lead engineer + written justification | (1) Change was auto-classified and manual review confirms correct, (2) Classification gap filled before proceeding |
| Tier 1 — Analysis | Redo analysis. Do not proceed to review. | Lead engineer + written justification | (1) Single missed boundary surface that has been checked now, (2) Minor classification correction |
| Tier 1 — Review | Redo review. Do not approve PR. | Senior engineer + documented reason | (1) All blocker fixes verified, (2) Override only for time-sensitive CRITICAL fixes |
| Tier 2 | Document justification for waiver. Proceed with note. | Any engineer | Waiver requires a tracking issue for the gap |
| Tier 3 | Best effort. Note gap for improvement. | Any engineer | No override needed — aspirational |

### Gate Application by Change Type

| Change Type | Tier 1 Gates | Tier 2 Gates | Tier 3 Gates |
|---|---|---|---|
| INCIDENT | Full classification | Escalation only | Post-incident |
| CRITICAL | Full | Full | Full |
| HIGH | Full | Full | Best effort |
| MEDIUM | Full | Standard | Optional |
| LOW | WorkType only | Minimal | None |
| INFO | WorkType only | None | None |

### Gate Verification Procedures

Each gate must be verified by the engineer performing the classification/analysis/review. Verification is not optional.

**Classification Gate Verification:**
```
1. For each changed file, confirm WorkType assignment.  ──── YES / NO
2. For the overall change, confirm all 7 dimensions.    ──── YES / NO
3. Confirm intention (PLANNED/UNPLANNED) per file.      ──── YES / NO
4. Confirm sub-type from P3.1 reference table.          ──── YES / NO
5. Compute composite risk.                              ──── SCORE: N
6. Apply domain hard floor.                             ──── FLOOR: LEVEL
7. Check for UNPLANNED scope creep.                     ──── NONE / FLAGGED
8. If CRITICAL: verify migration plan + rollback plan.  ──── EXISTS / MISSING
9. If IRREVERSIBLE: verify backup + sign-off.           ──── EXISTS / MISSING
```

**Analysis Gate Verification:**
```
1. Confirm all files classified.                        ──── YES / NO
2. Compute composite score (if 3+ files).               ──── SCORE: N
3. Check import graph surface.                          ──── CHECKED / SKIPPED
4. Check interface surface.                             ──── CHECKED / SKIPPED
5. Check data shape surface.                            ──── CHECKED / SKIPPED
6. Check event contract surface.                        ──── CHECKED / SKIPPED
7. Check config surface.                                ──── CHECKED / SKIPPED
8. If BLOCK: specific blockers listed.                  ──── YES / NO
9. If BLOCK-CRITICAL: sign-off engineer named.          ──── YES / NO
```

**Review Gate Verification:**
```
1. All contract surfaces checked.                       ──── YES / NO
2. Every BLOCKER has location + reason + fix.           ──── YES / NO
3. Every WARNING has risk + action.                     ──── YES / NO
4. Security paths evaluated.                            ──── YES / NO
5. Tests evaluated for meaning.                         ──── YES / NO
6. No rubber stamping.                                  ──── YES / NO
7. BLOCKER count appropriate (< 3 per 200 lines).       ──── YES / NO / N/A
8. SUGGESTION count < BLOCKER + WARNING.                ──── YES / NO / N/A
```

### Gate Enforcement in CI/CD

For automated enforcement, gates should be encoded as CI checks:

| CI Check | What It Validates | Failure Action |
|---|---|---|
| classification-check | Every file has WorkType + dimension completeness | Fail pipeline |
| boundary-check | All 5 surfaces checked for files touching contracts | Warn pipeline |
| risk-floor-check | Auth/payment/data files meet minimum risk floor | Fail pipeline |
| rollback-check | Schema changes include rollback (down migration) | Fail pipeline |
| blocker-check | BLOCK verdict has listed blockers | Fail pipeline if BLOCK + no blockers |
| coupling-check | Coupled changes detected and flagged | Warn pipeline |
| ownership-check | CODEOWNERS for touched boundaries are reviewers | Warn pipeline |
| regression-check | Regression score computed for 5+ file diffs | Informational |

### Gate Improvement Process

Gates should be reviewed and improved based on production incidents and classification accuracy data:

1. **Post-incident:** Did the gates catch the risk? If not, what gate should be added?
2. **False positive:** Did a gate block a safe change unnecessarily? If so, adjust the gate.
3. **Missed classification:** Was a change misclassified that passed all gates? Add a gate that catches this pattern.
4. **Gate coverage:** Are there change patterns that no gate covers? Add new gates.
5. **Gate fatigue:** Are engineers skipping gate verification because there are too many gates? Consolidate or tier.

### Gate Application by Change Type

| Change Type | Tier 1 Gates | Tier 2 Gates | Tier 3 Gates |
|---|---|---|---|
| INCIDENT | Full classification | Escalation only | Post-incident |
| CRITICAL | Full | Full | Full |
| HIGH | Full | Full | Best effort |
| MEDIUM | Full | Standard | Optional |
| LOW | WorkType only | Minimal | None |
| INFO | WorkType only | None | None |

---

## OUTPUT FORMATS

### Full Classification Block

```
━━━ CLASSIFICATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WORK    : <Type:Sub> | <P|U>   BREADTH  : <value>
  REVERS  : <value>   URGENCY  : <value>  DETECT : <value>
  RADIUS  : <value>   RISK     : <LEVEL>  SCORE  : <N>
  APPROACH: <strategy>
  DOMAIN  : <domain> | FLOOR: <level>
  COUPLING: <coupled changes | NONE>
  REGRESSION: <score> — <risk level>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Full Analysis Block

```
━━━ ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WORK      : <WorkType(s) per file>
  SCORE     : <N> — <BLOCK|WARN|PASS|BLOCK-CRITICAL>
  FILES     : <N> | <file:type>
  CONTRACTS : <N> | <affected>
  DEPTH     : <max> | <direction>
  COVERAGE  : <COVERED|PARTIAL|NONE>
  OWNERSHIP : <reviewers required>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFE TO MERGE: <YES|NO|CONDITIONAL>
  PRIMARY RISK   : <level> — <one-line>
  CONTRACT BREAKS: <N> — <list>
  UNCOVERED CODE : <files without test changes>
  CROSS-SERVICE  : <affected|NONE>
  REVIEW NEEDED  : <SINGLE|PAIR|TEAM|SECURITY>
  DEPLOYMENT     : <DIRECT|STAGED|ROLLBACK_REQUIRED>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Compact Injection

```
[CI] scope:<S|M|CM|CS|SW> depth:<SURF|SHAL|STR|DEEP>
dir:<ADD|MOD|DEL> contracts:<N> score:<N>
verdict:<P|W|B|BC> risk:<LEVEL>
blockers:<top 3 if any>
```

### Deviation Alert

```
CLASSIFICATION DEVIATION — expected <Type/Risk> — actual <Type/Risk>
Delta: <UNPLANNED|risk mismatch|dimension mismatch>
Action: <pause|re-scope|proceed>
```

### Escalation Alert

```
RISK ESCALATION LEVEL <1–5> — trigger: <reason>
Changes: <list> — Action: <surface|stop|switch>
Approval: <required|not required>
```

### Inline Comment Format

```
FILE: <path>
  LN <range> | <BLOCKER|WARNING|SUGGESTION> | <finding> | <suggestion>
```

### CI Exit Format

```
RESULT: <PASS|WARN|BLOCK|BLOCK-CRITICAL>
EXIT: <0|1|2>
BLOCKERS: <list if present>
```

### Ledger Entry Format

```
EVENT:        <classify|analyze|review>
TIMESTAMP:    <ISO 8601>
CHANGE:       <PR or commit reference>
CLASSIFICATION:
  WorkType:   <type:sub-type>
  Intention:  <PLANNED|UNPLANNED>
  Breadth:    <scope>
  Reversibility: <level>
  Urgency:    <level>
  Detectability: <level>
  Blast Radius: <level>
  Composite:  <score> — <verdict>
BOUNDARIES CHECKED: <import|interface|data|event|config>
FINDINGS:
  - <CATEGORY>: <finding>
VERDICT:      <PASS|WARN|BLOCK|BLOCK-CRITICAL>
APPROVED BY:  <engineer>
```

---

## LANGUAGE-SPECIFIC OUTPUT TEMPLATES

### TypeScript / JavaScript

```
━━━ TYPESCRIPT ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  EXPORTS CHANGED: <N> — <added|removed|modified>
  INTERFACES/TYPES: <N> — <list>
  STRICT-NULL CHANGES: <none|added @ts-ignore|added as any>
  GENERICS: <tightened|loosened|unchanged>
  SYNC→ASYNC: <yes|no>
  MODULE PATH: <unchanged|changed — check imports>
  EXHAUSTIVE SWITCH: <affected|not affected>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Python

```
━━━ PYTHON ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SIG CHANGES: <N> — <list>
  OPTIONAL→REQUIRED: <none|list>
  PYDANTIC CHANGES: <none|field added|field removed|type change>
  EXPORTS (__init__.py): <unchanged|changed>
  ABSTRACT METHODS: <added|removed|unchanged>
  PROPERTY→METHOD: <none|detected>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### SQL

```
━━━ SQL / MIGRATION ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━
  TYPE: <ADD|DROP|ALTER|CREATE|DROP_INDEX|OTHER>
  DESTRUCTIVE: <yes — CRITICAL|no>
  ROLLBACK EXISTS: <yes|no — BLOCK>
  TRANSACTION WRAPPED: <yes|no>
  LOCK RISK: <ACCESS EXCLUSIVE|ROW|NONE>
  DURATION ESTIMATE: <seconds|minutes>
  PRE-CHECK NEEDED: <null check|data check|none>
  DEPLOY ORDER: <migration→model→service>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Go

```
━━━ GO ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INTERFACE CHANGES: <added method|removed method|unchanged — CRITICAL>
  EXPORTED FUNC SIG: <N changed — check callers>
  IOTA CONSTANTS: <reordered|unchanged — CRITICAL if reordered>
  ERROR SENTINELS: <added|removed — CRITICAL if removed>
  PACKAGE RENAME: <yes — CRITICAL|no>
  CONTEXT PARAM: <added|unchanged>
  RECEIVER TYPE: <ptr→val|val→ptr|unchanged>
  STRUCT FIELDS: <N changed — check serialization>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Rust

```
━━━ RUST ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  UNSAFE BLOCKS: <added|removed|unchanged>
  PUBLIC ENUM VARIANTS: <added — check exhaustive|removed — CRITICAL>
  TRAIT METHODS: <added — CRITICAL if no default|unchanged>
  ASSOCIATED TYPES: <changed — HIGH|unchanged>
  LIFETIME PARAMS ADDED: <N — check all callers>
  DERIVE MACROS: <removed — MEDIUM|unchanged>
  PUBLIC→PRIVATE: <N items — check callers>
  CLONE/COPY IMPLS: <added|removed>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Java / Kotlin

```
━━━ JAVA/KOTLIN ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PUBLIC METHOD SIG: <N changed — check all callers>
  INTERFACE DEFAULT: <added — MEDIUM|unchanged>
  FINAL MODIFIER: <added to method — HIGH>
  THROWS CLAUSE ADDED: <yes — HIGH|no>
  ANNOTATION RETENTION: <changed — MEDIUM>
  DATA CLASS FIELDS: <N changes — check all destructuring>
  SEALED CLASS VARIANTS: <added — MEDIUM|unchanged>
  @JvmStatic CHANGED: <yes — HIGH|no>
  ACCESS MODIFIER: <N items changed — check all callers>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### IaC

```
━━━ IaC ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RESOURCE ADDED: <N> — <list>
  RESOURCE REMOVED: <N> — <list — CRITICAL>
  IAM CHANGED: <yes|no — CRITICAL>
  NETWORK CHANGED: <yes|no — CRITICAL>
  IMAGE TAG CHANGED: <none|tag change>
  PORT CHANGE: <none|port change — CRITICAL>
  TLS CERT CHANGED: <none|cert reference — HIGH>
  NAMESPACE RENAME: <none|rename — CRITICAL>
  VOLUME MOUNT: <changed|unchanged — HIGH>
  CI STEP: <added|removed|modified — MEDIUM>
  ROLLBACK PLAN: <exists|missing — BLOCK>
  DEPLOY ORDER: <IaC→service code>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Multi-Language Change Patterns

When a change crosses multiple languages (e.g., TypeScript frontend + Go backend + SQL migration), use the combined template:

```
━━━ CROSS-LANGUAGE ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LAYERS TOUCHED: <frontend|backend|migration|infra|config>
  CONTRACT ALIGNMENT: <aligned — same contract shape|misaligned — flag>
  TYPE MISMATCH RISK: <none|detected — e.g., TS string vs Go int64>
  DEPLOY ORDER: <frontend|backend|migration — specify order>
  COORDINATION: <independent|coordinated deploy required>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## APPENDICES

### A — Quick Reference: Verdict Matrix

| Composite Score | Verdict | Deploy | Review Depth | SLA |
|---|---|---|---|---|
| 0–3 | PASS | Direct | SHALLOW | 24h |
| 4–7 | WARN | Standard | STANDARD | 12h |
| 8–11 | BLOCK | Staged | DEEP | 4h |
| 12+ | BLOCK-CRITICAL | Staged + sign-off | DEEP + sign-off | 2h |

### B — Quick Reference: Dimension Escalation Path

```
WorkType sub-type default
  → +1 if UNPLANNED
  → +1 if depth >= STRUCTURAL
  → floor by domain (auth/billing/data = CRITICAL)
  → +2 if MULTI_SERVICE / PLATFORM / ALL_USERS / DATA_INTEGRITY
  → +1 if IMMEDIATE (non-INCIDENT)
  → −1 if DEFERRABLE (min INFO)
  → −1 if SINGLE_USER
  → final = MAX of all
```

### C — Quick Reference: Boundary Check Sequence

For every changed module, in order:

1. **Import graph:** `grep -r "from './module'" src/` — how many importers?
2. **Interface:** Is an exported type/signature/trait changed?
3. **Data shape:** Is the serialized format / DB schema / API payload changed?
4. **Event contract:** Is an event name/payload/routing key changed?
5. **Config surface:** Is an env var / CLI flag / config key changed?

If any surface is affected, document the impact and required coordination.

### D — Quick Reference: Feedback Classification

```
"Is this a PRODUCTION INCIDENT if merged?"   → BLOCKER yes / keep going
"Is this a BUG if merged?"                   → BLOCKER yes / keep going
"Is this a CONTRACT BREAK?"                  → BLOCKER yes / keep going
"Is this a SECURITY VULNERABILITY?"          → BLOCKER yes / keep going
"Will someone have to FIX THIS LATER?"       → WARNING yes / keep going
"Is this a MISSING COVERAGE concern?"        → WARNING yes / keep going
"Would the code be NOTICEABLY BETTER?"       → SUGGESTION yes / skip
"Is this a STYLE PREFERENCE?"               → SUGGESTION yes / skip
```

### E — Quick Reference: Deploy Strategy by Reversibility

| Reversibility | Deploy Strategy | Rollback Time |
|---|---|---|
| SAFE | Direct | Instant revert |
| CAREFUL | Staged | Minutes |
| HARD | Migration plan | Hours to days |
| IRREVERSIBLE | Backup + validation + sign-off | Data restore |

### F — Quick Reference: Dimension Selection Guide

When you're uncertain which value to assign for a dimension, use this decision guide:

**Breadth (scope of impact):**
| If change touches... | Then breadth is... |
|---|---|
| Single file, no external references | LOCAL |
| Multiple files in same module | MODULE |
| Exported symbol, config key, or shared type | CONTRACT |
| Files across 2+ modules | CROSS_MODULE |
| Files across 2+ services | CROSS_SERVICE |
| All services or infrastructure | SYSTEM |

**Reversibility (how hard to undo):**
| If change involves... | Then reversibility is... |
|---|---|
| Code change only, can be reverted with simple deploy | SAFE |
| Config change with known rollback | CAREFUL |
| Schema migration with rollback | HARD |
| Data migration, column drop, IAM change | IRREVERSIBLE (without restore) |

**Urgency (time sensitivity):**
| If change is for... | Then urgency is... |
|---|---|
| Active production incident | IMMEDIATE |
| Fixing a bug shipped in last deploy | TODAY |
| Planned feature for current sprint | THIS_SPRINT |
| Non-critical improvement with known date | SCHEDULED |
| Nice-to-have with no deadline | DEFERRABLE |

**Detectability (how we know it works):**
| If failure mode is... | Then detectability is... |
|---|---|
| Caught by tests + CI + monitoring | IMMEDIATE |
| Caught by monitoring but delayed (e.g., batch) | DELAYED |
| Only caught when user reports | USER_REPORTED |
| Silent data corruption, no alert path | UNDETECTABLE |

**Blast Radius (who is affected by failure):**
| If failure affects... | Then blast radius is... |
|---|---|
| A single user's session or data | SINGLE_USER |
| A single tenant in multi-tenant system | TENANT |
| A single feature or capability | FEATURE |
| A single service | SERVICE |
| Multiple services | MULTI_SERVICE |
| The entire platform or infrastructure | PLATFORM |
| Every user of the system | ALL_USERS |
| Data correctness or integrity | DATA_INTEGRITY |

### G — Quick Reference: Anti-Pattern Summary by Category

| Category | Most Common Anti-Pattern | Fix |
|---|---|---|
| Classification | Classify by effort not impact | Classify by blast radius |
| Classification | "Just config" minimization | Check import graph |
| Classification | Missing dimension | State all 7 dimensions |
| Analysis | Deletion without caller check | Grep across repo |
| Analysis | "No impact" without checking | Check all 5 surfaces |
| Analysis | BLOCK without blockers | Specific conditions |
| Review | Rubber stamping | Concrete finding or explicit statement |
| Review | Too many blockers | Classify by impact |
| Review | Nitpicking as blocker | SUGGESTION, not BLOCKER |
| Process | No pre-declaration | Classify before coding |
| Process | Skipping phases | Follow 8-phase sequence |
| Process | Reviewing own work | Always need peer |

---

### H — Quick Reference: Change Intelligence Process Checklist

A one-page executable checklist for every change intelligence engagement:

```
□ 1. PRE-CLASSIFICATION (before code):
   □ Read ticket/spec/issue
   □ Identify affected files (estimate)
   □ Declare WorkType + sub-type
   □ Declare all 7 dimensions
   □ Compute preliminary risk
   □ Identify domain floor
   □ Flag if UNPLANNED

□ 2. ANALYSIS (after code):
   □ Confirm per-file classification
   □ Assess depth per file (SURFACE/SHALLOW/STRUCTURAL/DEEP)
   □ Check all 5 boundary surfaces:
     □ Import graph
     □ Interface
     □ Data shape
     □ Event contract
     □ Config surface
   □ Compute composite score (3+ files) or single-file score
   □ Apply penalties
   □ Determine verdict (PASS/WARN/BLOCK/BLOCK-CRITICAL)
   □ Check escalation ladder
   □ Identify change coupling

□ 3. REVIEW (before merge):
   □ Read PR title + description
   □ Validate description matches classification
   □ Read diff — build intent model
   □ Check contract surfaces
   □ Analyze logic — trace execution paths
   □ Evaluate error handling
   □ Review tests — meaningful coverage?
   □ Write feedback:
     □ BLOCKERs: location + reason + fix
     □ WARNINGs: location + risk + action
     □ SUGGESTIONs: location + benefit
   □ Check 500-line rule
   □ Suggest deploy strategy

□ 4. VERIFICATION (before output):
   □ All 7 dimensions assigned?                  yes
   □ All 5 surfaces checked?                     yes
   □ BLOCKERs have reason + fix?                 yes
   □ WARNINGs have risk + action?                yes
   □ No BLOCK without blockers?                  yes
   □ No WARN without items?                      yes
   □ Risk above domain floor?                    yes
   □ Ledger entry prepared?                      yes
   □ Deploy plan documented?                     if CRITICAL+
```

### I — Edge Cases & Exceptions

The following edge cases require special handling in change intelligence:

**Empty or Near-Empty Diffs:**
| Diff Content | Classification | Action |
|---|---|---|
| 0 lines (permissions/mode change) | INFRA/LOW | Verify intent, flag if suspicious |
| 1 line comment fix | DOCS:COMMENT/INFO | No further analysis needed |
| 1 line import reorder | REFACTOR:REORGANIZE/INFO via depth modifier | No further analysis |
| 1 line log level change | CONFIG:FLAG/LOW | Verify not hiding errors |
| 1 line timeout value change | CONFIG:TIMEOUT/MEDIUM | Must check breadth — implicit callers |
| 1 line null check added | FIX:CRASH/MEDIUM | Verify correctness of check |
| Only whitespace/formatting | REFACTOR:REORGANIZE/INFO | No logic review needed |

**Generated Code:**
| Source | Generated | Classify As | Action |
|---|---|---|---|
| Changed | Not changed | CONTRACT | Block — source must be regenerated |
| Changed | Changed (consistent) | CONTRACT | Verify regeneration command, review source only |
| Not changed | Changed | UNKNOWN | Stop — investigate how generated file changed |
| New source | New generated | FEATURE | Verify source is the primary artifact |

**Third-Party / Vendor Code:**
| Situation | Classification | Action |
|---|---|---|
| Vendor file modified directly | FIX/HIGH (UNPLANNED) | Flag — use wrapper or fork instead |
| Vendor dependency version bump | FIX:DEPENDENCY/HIGH | Review changelog, check breaking changes |
| Vendor file added | INFRA:DEPENDENCY/MEDIUM | Verify license, vulnerability scan |

**Monorepo Changes:**
| Situation | Classification | Action |
|---|---|---|
| Change touches 2+ projects/packages | CROSS_MODULE | Classify each project independently, use max risk |
| Shared library change | CONTRACT | Check all consumers across all projects |
| Configuration shared across projects | CONFIG | Check all projects that read this config |
| Build configuration shared | INFRA:CICD | Check all projects affected by build change |

**Rollback Commits:**
| Situation | Classification | Action |
|---|---|---|
| Revert of previous commit | FIX:REGRESSION/HIGH | Verify revert is complete and correct |
| Partial revert (some files reverted) | FIX:REGRESSION/HIGH | Verify no partial state introduced |
| Revert of revert | FIX:REG/RESSION/CRITICAL | Full stop — escalating instability |

**Merge Commits:**
| Situation | Classification | Action |
|---|---|---|
| Clean merge (no conflicts) | Same as source PR | No additional classification needed |
| Conflict resolution in merge | FIX/MEDIUM (UNPLANNED) | Review conflict resolution for correctness |
| Merge with manual changes | UNPLANNED escalation | Full review of manual merge changes |

### J — Quick Reference: Glossary of Terms

| Term | Definition |
|---|---|
| **7D Classification** | Seven orthogonal dimensions for classifying any code change: WorkType, Intention, Breadth, Reversibility, Urgency, Detectability, Blast Radius |
| **BLOCKER** | A review finding that must be fixed before the change can merge. Indicates a bug, security hole, contract break, or critical test gap. |
| **Blast Radius** | The scope of users, services, or data affected if the change fails. One of 8 levels from SINGLE_USER to DATA_INTEGRITY. |
| **Boundary Surface** | One of five contract surfaces checked for every changed module: import graph, interface, data shape, event contract, config surface. |
| **Change Coupling** | Multiple changes that must deploy atomically to avoid inconsistent system state. |
| **Classification Deviation** | A mismatch between the declared classification (from ticket/spec) and the actual classification (from the diff). Indicates scope creep or misunderstanding. |
| **Composite Risk Score** | A weighted numeric score (0–12+) combining per-file risk, domain floors, blast radius, depth, and penalties. Determines the verdict. |
| **Contract Surface** | Any point where a module interacts with other modules: imports, interfaces, data formats, events, configuration. |
| **DEEP Review** | Maximum depth review covering all execution paths, error handling, edge cases, security, and performance implications. |
| **Depth Assessment** | Classification of change complexity: SURFACE, SHALLOW, STRUCTURAL, or DEEP. Modifies risk score. |
| **Detectability** | How quickly a failure in the change is detected: IMMEDIATE, DELAYED, USER_REPORTED, or UNDETECTABLE. |
| **Domain Hard Floor** | A minimum risk level for specific domains (auth, payments, data, IAM) regardless of the specific change. |
| **Escalation Ladder** | A 5-level escalation system triggered by risk score thresholds (1 HIGH → surface, 2+ HIGH → stop, CRITICAL → full stop, etc.). |
| **Feedback Classification** | The system of categorizing review comments as BLOCKER, WARNING, or SUGGESTION based on impact. |
| **Intention** | Whether the change was PLANED (spec/ticket exists) or UNPLANNED (reactive, ad-hoc). |
| **Ledger Entry** | An immutable record of every classification, analysis, and review. Provides traceability and feeds accuracy metrics. |
| **Reversibility** | How difficult it is to undo the change: SAFE, CAREFUL, HARD, or IRREVERSIBLE. |
| **Rubber Stamping** | Approving a change without thorough review. A quality gate violation. |
| **SHALLOW Review** | Minimal depth review for low-risk changes: verify classification, check contract surfaces, no deep logic analysis. |
| **SUGGESTION** | Optional feedback. The change would be better with this change, but it's not blocking. |
| **Urgency** | Time sensitivity of the change: IMMEDIATE, TODAY, THIS_SPRINT, SCHEDULED, or DEFERRABLE. |
| **Verdict** | The output of the analysis: PASS, WARN, BLOCK, or BLOCK-CRITICAL. Determines merge and deploy requirements. |
| **WARNING** | A review finding that should be fixed or explicitly deferred with a tracking issue. Indicates future risk or maintainability concern. |
| **WorkType** | The type of work being done: FEATURE, FIX, REFACTOR, SCHEMA, CONTRACT, CONFIG, INFRA, INCIDENT, ANALYSIS, PLAN, DOCS, EXPERIMENT. |

---

*Synarc session tracking (S3), auto-emit rules (S4), zero-tolerance violations (S17) apply. Ledger entry for every classification, analysis, and code review engagement. All synarc prohibitions on fabricating or assuming context apply. When in doubt, choose the higher-risk interpretation — optimism is a liability in change intelligence.*
