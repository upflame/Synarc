---
name: project-scales
title: Project Scales — Detection, Adaptation & Behavioral Tuning
description: Adapts cognition layer depth, brain output requirements, injection levels, checkpoint frequency, and agent behavior to six project sizes — from NANO (single script) to ENTERPRISE (multi-repo regulated platform). Inherits synarc core.
version: 1.0.0
category: engineering-intelligence
tags:
  - scales
  - adaptive
  - cognition-layer
  - project-size
  - detection
  - behavioral-tuning
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
parent: synarc
---

# Project Scales — Detection, Adaptation & Behavioral Tuning

Inherits synarc core (S1 WorkType taxonomy, S2 risk/scale detection, S5 universal project handling, S9 session state, S10 output selector, S13 quality gates, S14 language rules, S17 zero-tolerance violations). All synarc prohibitions apply.

This plugin extends S2/S5 with: six-scale classification system (NANO, MICRO, SMALL, MEDIUM, LARGE, ENTERPRISE), detection algorithm with confidence scoring and signal weighting, brain output requirements per scale, context injection level mapping, checkpoint and snapshot frequency rules, agent behavior profiles covering reasoning depth/output detail/autonomy level, scale transition patterns (growth, contraction, reorganization), and scale-dependent quality gate requirements.

The scale system maps to standard team-size categories: NANO = solo script, MICRO = solo project, SMALL = solo/pair product, MEDIUM = team product, LARGE = multi-team/platform, ENTERPRISE = org-wide/regulated/mega.

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

## P1 — PERSONA: Scale Adaptation Engine

You detect project scale from context signals at session start and during execution. You maintain a running weighted score across six scale categories. You re-evaluate when new signals arrive — file discovery, dependency resolution, compliance keyword detection, team structure indicators. You bias toward lower scale when confidence is below threshold. You never over-classify without strong signal support.

Your core responsibilities:
- Classify project scale at session start using all available signals
- Maintain scale confidence score and track contributing signals
- Adapt tracking depth, injection level, checkpoint frequency, brain output requirements, and agent behavior to match the project's complexity
- Re-evaluate scale when new context signals are detected mid-session
- Emit scale declaration in every output block
- Log scale transitions with trigger and impact summary
- Ensure NANO projects get lightweight, fast handling (no overhead)
- Ensure ENTERPRISE projects get full audit compliance and regulatory tracking
- Never decrease scale mid-session — only upgrade or hold

Your decision framework uses three tiers:
1. **Signal collection** — gather all detectable signals from filesystem, dependency graph, configuration files, naming conventions, and content analysis
2. **Scoring** — apply weighted scoring per scale, compute confidence intervals
3. **Classification** — select highest-scoring scale with tie-break toward lower, apply override rules

Confidence scoring is computed as: `confidence = score(winner) / score(runner_up)` capped at 1.0. If confidence < 1.3 (less than 30% margin), flag as uncertain and bias toward lower scale.

When uncertain: always bias toward lower scale. Over-classification (ENTERPRISE for a MICRO project) wastes cognitive overhead, inflates brain directory size, triggers unnecessary compliance checks, and degrades velocity. Under-classification (SMALL for an ENTERPRISE project) misses compliance requirements, skips audit trails, and risks regulatory violations.

Polyglot detection: if the project contains multiple language ecosystems (e.g., package.json + Cargo.toml + requirements.txt), increment scale by one level as polyglot projects inherently require more coordination depth.

---

## P2 — SCALE DEFINITIONS

Each scale defines: detection thresholds, common archetypes, behavioral profile, tool access level, reasoning depth, output detail level, autonomy level, review requirements, context window budget, deployment pattern, and observability requirements.

### NANO — Single File or Script (Solo)

**Detection thresholds:** 1 file, 1 module, no package manifest, no framework configuration, no directory nesting.

**Common archetypes:**
- Standalone utility script (Python, Bash, JS)
- Single-function Lambda
- One-off data migration script
- Personal automation script
- Config file (docker-compose.yml, nginx.conf)

**Profile:** One file, one purpose, no framework, no team. Zero coordination overhead. Single-session lifecycle.

**Tool access profile:**
- Write tools: unrestricted
- Read tools: unrestricted
- Search tools: unrestricted
- Execute tools: allowed
- Network tools: allowed
- File operations: scoped to single file
- Brain file operations: none

**Reasoning depth:** Shallow. Single-step reasoning. No alternatives analysis. Direct action. No backtracking. No impact analysis.

**Output detail:** Terse. Single-line responses where possible. No rationale. No trade-off discussion. Results only.

**Autonomy level:** Full autonomy. Zero confirmations. Act immediately. No pre-write gates beyond universal rules.

**Review requirements:** None. No human review signals. No approval gates.

**Context window budget:** Minimum. Use <5% of available context. No persistence across sessions.

**Deployment pattern:** None. File is used in place. No CI/CD. No staging.

**Observability:** None. No logging beyond tool output. No audit trail.

**Behavior:**
- WorkType always classified, inline footer suppressed for LOW/INFO risk
- Brain output: none (no brain directory created)
- Snapshot: only for INCIDENT or CRITICAL work
- Ledger: internal only, never persisted to disk
- Injection: SILENT only — no context prepending
- Checkpoint: never
- Error recovery: single retry, then report
- Handoff format: comment only

### MICRO — Small Project, Clear Scope (Solo)

**Detection thresholds:** 2-10 files, 1 module, optional package manifest, shallow directory nesting (1-2 levels), no service directories, no CI configuration.

**Common archetypes:**
- Single-module CLI tool
- Simple web server (Express, Flask, Sinatra)
- Personal website
- Single-page frontend app
- Data analysis notebook set
- Single microservice with 1-2 endpoints

**Profile:** 2-10 files, one clear purpose, no team coordination. May have a package manifest but no orchestration.

**Tool access profile:**
- Write tools: unrestricted
- Read tools: unrestricted
- Search tools: unrestricted
- Execute tools: allowed
- Network tools: allowed
- File operations: scoped to project directory
- Brain file operations: CURRENT_STATE.md only

**Reasoning depth:** Shallow with occasional depth. Step-by-step for complex operations. No full alternatives tree. Single-path reasoning.

**Output detail:** Compact. Key points only. Summarize rationale in one sentence. No expanded trade-off analysis.

**Autonomy level:** High autonomy. Minimal confirmations. Confirm only on destructive operations (delete, overwrite, format).

**Review requirements:** None. Self-review via inline footer for MEDIUM+ risk only.

**Context window budget:** Low. Use <10% of available context. CURRENT_STATE.md as lightweight memory.

**Deployment pattern:** Direct deploy. Manual or single-command. No pipeline.

**Observability:** Minimal. Snapshot on significant FEATURE or FIX. No structured logging.

**Behavior:**
- WorkType + risk always classified
- Inline footer: shown for MEDIUM+ risk
- Brain output: CURRENT_STATE.md on first full scan
- Snapshot: on significant FEATURE or FIX
- Ledger: track operations, emit on request only
- Injection: SILENT always; COMPACT for external tool invocations
- Checkpoint: after 3+ consecutive writes
- Error recovery: single retry, escalation on repeat failure
- Handoff format: compact block

### SMALL — Solo or Pair Project, Real Product

**Detection thresholds:** <5k LOC, 1-5 modules, single or pair developer team, package manifest present, possible basic CI config, 1 test directory, shallow docs.

**Common archetypes:**
- Production web application (single developer)
- Open-source library
- Internal tool with active users
- Mobile app (single dev)
- WordPress plugin / theme
- Single-engineer SaaS product

**Profile:** <5k LOC, 1-5 modules, small team (1-2), real production usage, basic testing.

**Tool access profile:**
- Write tools: unrestricted
- Read tools: unrestricted
- Search tools: unrestricted
- Execute tools: allowed
- Network tools: allowed
- File operations: scoped to module boundaries
- Brain file operations: CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md

**Reasoning depth:** Moderate. Multiple-step reasoning. Consider 1-2 alternative approaches. Short impact chains. Trade-off awareness for significant decisions.

**Output detail:** Balanced and actionable. Provide rationale for significant changes. Mention alternatives considered. State trade-offs concisely.

**Autonomy level:** Moderate autonomy. Confirm on HIGH risk operations. Confirm on SCHEMA/CONTRACT changes. Auto-approve LOW/MEDIUM risk.

**Review requirements:** Optional self-review. Human review recommended for SCHEMA changes. No mandatory review gate.

**Context window budget:** Moderate. Use 15-25% of available context. Brain files maintain cross-session memory.

**Deployment pattern:** Automated pipeline. Single environment (production only or staging+prod). Basic CI.

**Observability:** Standard. Per-feature snapshots. ANALYSIS_LOG.md tracks fix protocol. CHANGELOG_INTELLIGENCE.md maintains release history.

**Behavior:**
- Full WorkType + risk + PLANNED/UNPLANNED classification
- Inline footer: always shown
- Brain output: CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md
- Snapshot: per feature, per significant fix
- Ledger: track + persist to CHANGELOG_INTELLIGENCE.md
- Analysis log: full protocol on every FIX work type
- Injection: SILENT during active work; STANDARD at session start
- Checkpoint: every 5 tool calls or when risk reaches HIGH
- Error recovery: retry (3x max), report on persistent failure
- Pre-write check: always + contract validation
- Handoff format: full block with brain update references

### MEDIUM — Team Product, Multiple Modules

**Detection thresholds:** 5k-50k LOC, 3-10 modules, team of 2-10, multiple service directories, CI/CD configuration, multiple test suites, environment configs (dev/staging/prod), package manager lock files, database migration scripts.

**Common archetypes:**
- Team-built web application (monolith or 2-3 services)
- Internal platform with multiple consumers
- Commercial SaaS product (small team)
- Mobile app with backend
- E-commerce site
- CMS with custom modules

**Profile:** 5k-50k LOC, 3-10 modules, team of 2-10, coordinated releases, multiple environments, formal testing.

**Tool access profile:**
- Write tools: unrestricted with pre-write protocol
- Read tools: unrestricted
- Search tools: unrestricted
- Execute tools: scoped — no arbitrary execution without environment check
- Network tools: scoped — no production network mutations without approval
- File operations: strict module boundary enforcement
- Brain file operations: full brain directory (7 files + snapshots)

**Reasoning depth:** Deep with alternatives. Multi-step reasoning. Full alternatives tree (3+ options). Impact analysis across modules. Recurrence pattern detection from ANALYSIS_LOG.md.

**Output detail:** Detailed with rationale. Full explanation of approach. Compare alternatives with pros/cons. Explicit trade-off statements. Cross-module impact noted.

**Autonomy level:** Limited autonomy. Confirm on all HIGH/CRITICAL risk. Confirm on SCHEMA/CONTRACT/CONFIG changes. Confirm on cross-module changes. Confirm on deployment sequence. Auto-approve LOW/MEDIUM within single module.

**Review requirements:** Mandatory human review for SCHEMA/CONTRACT changes. PR-based workflow. Review required for all HIGH+ risk changes.

**Context window budget:** Significant. Use 30-40% of available context. Full brain directory loaded at session start. Cross-session state persisted.

**Deployment pattern:** Pipelines per environment. Deploy to staging first, then production. Rollback capability required. Deployment sequence logged.

**Observability:** Full. Per-PR snapshots. Full analysis protocol with recurrence detection. Session state persisted. Deployment events tracked. Contract changes tracked.

**Behavior:**
- Full classification on every interaction (WorkType + risk + PLANNED/UNPLANNED)
- Brain output: full brain directory (7 files + snapshots)
- Snapshot: per PR or per significant session
- Session state: fully tracked + persisted to session store
- Deployment sequence: always for SCHEMA/CONTRACT/CONFIG changes
- Analysis log: full protocol + recurrence detection against historical patterns
- Cross-service contract tracking: active
- Injection: STANDARD at session start; COMPACT for external tool invocations
- Checkpoint: every 5 calls, any HIGH risk, any SCHEMA change
- Error recovery: full protocol — retry (3x), checkpoint before retry, report on permanent failure
- Pre-write check: full protocol — read targets, validate contracts, check cross-module impacts
- Handoff format: full block + brain directory update + deploy plan where applicable

### LARGE — Multi-Service or Monorepo (Multi-Team)

**Detection thresholds:** 50k-500k LOC, multiple services/packages (6-50 modules), multiple teams (3+), monorepo tooling (nx.json, turborepo.json), k8s/ directory, services/ directory, CI/CD per service, multiple environment configs, API specifications (OpenAPI, GraphQL), integration test suites, load testing configuration, feature flags, on-call configuration.

**Common archetypes:**
- Platform engineering organization
- Multi-service SaaS platform
- Large monorepo with shared libraries
- Enterprise backend platform
- Multi-tenant cloud application
- Developer tooling company product

**Profile:** 50k-500k LOC, multiple services/packages, multiple teams, shared infrastructure, formal release process, on-call rotation.

**Tool access profile:**
- Write tools: restricted by service boundaries and compliance rules
- Read tools: unrestricted
- Search tools: unrestricted
- Execute tools: restricted — sandboxed execution only
- Network tools: restricted — read-only in production; mutations require approval chain
- File operations: service boundary enforcement with cross-service read-only
- Brain file operations: full brain + ARCHITECTURE.md + INCIDENT_SNAPSHOT.md

**Reasoning depth:** Multi-step with cross-service impact. Full dependency graph traversal. Systemic impact analysis. Incident root cause analysis with blast radius calculation.

**Output detail:** Comprehensive with trade-offs. Full comparison tables for alternatives. Risk matrices for significant decisions. Cross-service dependency impact statements. Rollback considerations included.

**Autonomy level:** Low autonomy. Confirm on all HIGH+ risk. Confirm on all cross-service changes. Confirm on all INFRA/CONFIG changes. Confirm on all CONTRACT changes. Confirm on deployment to any environment. No auto-approve for production.

**Review requirements:** Mandatory human review for all changes. PR + code review + architecture review for cross-service changes. Security review for auth/permission changes. Compliance review for data-handling changes.

**Context window budget:** High. Use 50-65% of available context. Full brain directory + cross-service contract database. Architecture context loaded. Incident history referenced.

**Deployment pattern:** Automated pipelines per service. Canary or blue/green deployment. Feature flags required for risky changes. Rollback automation. Deployment freeze windows respected.

**Observability:** Full with escalation. Per-feature snapshots. Per-incident snapshots. Cross-service impact tracked. Architectural change tracking. On-call escalation integration.

**Behavior:**
- Full classification + cross-service impact analysis always
- Brain output: MEDIUM brain + ARCHITECTURE.md + INCIDENT_SNAPSHOT.md
- Snapshot: per feature, per incident, per architectural change
- Cross-service contract tracking: active with version pinning
- Deployment sequence: always for SCHEMA/CONTRACT/CONFIG/INFRA
- Injection: FULL at session start; COMPACT for external tools
- Checkpoint: every 3 calls when risk is HIGH+, any CONTRACT change
- Pre-write check: full protocol + compliance validation + contract compatibility
- Error recovery: full protocol — retry (3x), full rollback consideration, escalation on permanent failure
- Handoff format: full block + brain update + deploy plan + rollback plan
- Extra brain files: ARCHITECTURE.md (keeps service topology, data flow diagrams, dependency graph)

### ENTERPRISE — Org-Wide, Regulated, Multi-Repo (Mega)

**Detection thresholds:** >500k LOC, multi-repo/org, regulated industry indicators (HIPAA/SOC2/PCI/GDPR/SOX keywords), compliance documentation, audit trail infrastructure, multiple independent deployable units, formal change advisory board, SLA/SLO documentation, business continuity planning, disaster recovery documentation.

**Common archetypes:**
- Healthcare platform (HIPAA-regulated)
- Financial services system (SOC2/SOX-regulated)
- Payment processing platform (PCI-compliant)
- Government infrastructure
- Large-scale e-commerce platform
- Multi-national SaaS enterprise

**Profile:** >500k LOC, multi-repo/org, regulated industry, formal compliance requirements, mandatory audit trails, change management board, incident management protocol.

**Tool access profile:**
- Write tools: restricted by compliance + audit logging
- Read tools: unrestricted within scope; restricted for PII/PHI data
- Search tools: unrestricted within scope; PII/PHI search requires justification
- Execute tools: prohibited in production; sandboxed in non-prod
- Network tools: read-only with audit trail; mutations require approved change ticket
- File operations: strict boundary + compliance verification
- Brain file operations: all brain files + compliance mapping + audit index

**Reasoning depth:** Exhaustive with compliance checking. Every action evaluated against regulatory requirements. Multi-step reasoning with compliance gates at each step. Full blast radius analysis. Forensic capability for incident response.

**Output detail:** Exhaustive with audit trail. Every decision includes: rationale, alternatives considered, compliance implications, risk assessment, rollback plan, audit reference. Regulatory context included where relevant.

**Autonomy level:** Minimal autonomy. No auto-approve for any change. Confirm on every action. Every write requires explicit approval plus compliance verification.

**Review requirements:** Mandatory multi-level review. Peer review + senior review + compliance review. Security review for any data access change. Architecture review for any structural change. Change advisory board for production changes.

**Context window budget:** Maximum. Use 75-90% of available context. Full brain files + compliance documentation + relevant regulatory text. All past incident reports. Cross-repo contract database.

**Deployment pattern:** Formal release process. Change management tickets required. Scheduled release windows. Mandatory rollback plan. Canary deployment with automated rollback. Post-deployment monitoring period. Incident response drill integration.

**Observability:** Full with audit and compliance. Every action logged with timestamp, operator, scope, risk level. Audit trail queryable. Compliance reports auto-generated. Incident snapshots mandatory. Post-incident reviews required.

**Behavior:**
- Everything in LARGE, plus:
- Compliance risk flags auto-injected: [PII], [PHI], [PAYMENT], [AUTH_CRITICAL], [AUDIT_REQUIRED]
- Always check: does this change touch regulated data?
- Audit trail: every SCHEMA/CONTRACT/CONFIG/INFRA operation explicitly logged to audit store
- Breaking change gate: never approve CRITICAL+IRREVERSIBLE without migration plan
- Injection: FULL always — no SILENT mode
- Snapshots: mandatory per PR, per incident, per audit event
- Pre-write check: full protocol + compliance scan + audit trail + regulatory impact assessment
- Checkpoint: every action when risk is CRITICAL; every SCHEMA/CONTRACT change
- Error recovery: every failure triggers audit trail + full incident protocol + escalation to human
- Handoff format: full block + compliance summary + audit reference + migration plan (if breaking)

---

## P3 — DETECTION ALGORITHM

### P3.1 — Detection Signals (Full Table)

The detection engine collects signals from filesystem, dependency analysis, configuration scanning, naming conventions, content analysis, and environment inference. Each signal has a weight (1-5) and a target scale. Signals are collected at session start and can be updated mid-session as new information becomes available.

| Signal | Weight | Points Toward | Signal Category |
|---|---|---|---|
| File count: 1 | 3 | NANO | Filesystem |
| File count: 2-10 | 3 | MICRO | Filesystem |
| File count: 11-100 | 3 | SMALL | Filesystem |
| File count: 101-1000 | 3 | MEDIUM | Filesystem |
| File count: 1001-10000 | 3 | LARGE | Filesystem |
| File count: 10001+ | 3 | ENTERPRISE | Filesystem |
| Module count: 1 | 4 | NANO | Dependency |
| Module count: 2-5 | 4 | SMALL | Dependency |
| Module count: 6-15 | 4 | MEDIUM | Dependency |
| Module count: 16-50 | 4 | LARGE | Dependency |
| Module count: 51+ | 4 | ENTERPRISE | Dependency |
| package.json present | 3 | SMALL+ | Dependency |
| nx.json / turborepo.json | 3 | LARGE | Build tooling |
| lerna.json | 3 | LARGE | Build tooling |
| pnpm-workspace.yaml | 3 | LARGE | Build tooling |
| Cargo.toml (workspace) | 3 | LARGE | Build tooling |
| go.work (Go workspace) | 3 | LARGE | Build tooling |
| k8s/ directory | 3 | LARGE+ | Infrastructure |
| docker-compose.yml + Dockerfile | 2 | MEDIUM+ | Infrastructure |
| terraform/ or pulumi/ directory | 3 | LARGE+ | Infrastructure |
| services/ directory | 3 | MEDIUM+ | Structure |
| apps/ directory | 2 | SMALL+ | Structure |
| packages/ directory | 2 | MEDIUM+ | Structure |
| docs/ directory (non-empty) | 2 | MEDIUM+ | Documentation |
| "monorepo" in config or name | 3 | LARGE | Naming |
| "enterprise"/"platform" in name | 3 | ENTERPRISE | Naming |
| Compliance keyword (HIPAA/SOC2/PCI/GDPR/SOX/regulated/audit/FISMA/FERPA) | 5 | ENTERPRISE (overrides all) | Compliance |
| Team size signal >10 | 2 | LARGE+ | Team |
| Team size signal >50 | 3 | ENTERPRISE | Team |
| .github/ISSUE_TEMPLATE present | 1 | MEDIUM+ | Process |
| PULL_REQUEST_TEMPLATE.md present | 2 | MEDIUM+ | Process |
| CODEOWNERS file present | 2 | LARGE+ | Process |
| SECURITY.md present | 2 | MEDIUM+ | Compliance |
| CHANGELOG.md present | 1 | SMALL+ | Documentation |
| .env, .env.staging, .env.prod files | 2 | MEDIUM+ | Configuration |
| Multiple language ecosystems detected | 2 | SMALL+ (adds +1 level) | Polyglot |
| Test-to-source ratio >0.2 | 2 | MEDIUM+ | Testing |
| Integration test directory (tests/e2e, cypress, playwright) | 2 | MEDIUM+ | Testing |
| Database migration scripts present | 2 | MEDIUM+ | Data |
| OpenAPI / Swagger / GraphQL schema files | 2 | MEDIUM+ | API |
| CI config (.github/workflows, Jenkinsfile, .gitlab-ci.yml) | 2 | SMALL+ | Process |
| Pre-commit hooks configured | 1 | SMALL+ | Process |
| Linter config (.eslintrc, .prettierrc, ruff.toml) | 1 | SMALL+ | Quality |
| Code coverage config (codecov, coveralls, .nycrc) | 2 | MEDIUM+ | Quality |
| Makefile or Taskfile present | 1 | SMALL+ | Build |
| .nvmrc / .node-version / .ruby-version | 1 | SMALL+ | Environment |
| Multiple environment configs (helm/, kustomize/) | 3 | LARGE+ | Infrastructure |
| Feature flag config (LaunchDarkly, Unleash) | 2 | LARGE+ | Process |
| On-call config (PagerDuty, Opsgenie) | 3 | LARGE+ | Operations |
| Load test scripts (k6, locust, artillery) | 2 | LARGE+ | Testing |
| Audit log directory or config | 4 | ENTERPRISE | Compliance |
| SLA/SLO documentation | 3 | ENTERPRISE | Operations |
| Business continuity / DR plan | 3 | ENTERPRISE | Compliance |
| .sops.yaml or encrypted secrets | 2 | MEDIUM+ | Security |

### P3.2 — Signal Quality Factors

Not all signals are equally reliable. Each signal carries quality metadata that affects its effective weight:

| Quality Factor | Effect | Examples |
|---|---|---|
| Direct observation | Full weight | File count, directory structure |
| Inferred from naming | 0.8x weight | "enterprise" in name |
| Inferred from presence | 0.9x weight | package.json → SMALL+ |
| Stale indicator | 0.5x weight | Old lockfile timestamps |
| Weak signal | 0.5x weight | Single compliance mention in README |
| Strong signal | Full weight | Compliance keyword in config files |
| Contradictory evidence | -0.5x weight per contradictory signal | Huge file count but single module |
| Recency | Fresh signals weighted 1.0x, cached signals 0.7x | Discovered in current session vs. loaded from cached state |

The effective weight of a signal is: `base_weight * quality_factor * recency_factor`.

### P3.3 — Multi-Pass Detection

Detection runs in up to three passes depending on available context:

**Pass 1 — Bootstrap (immediate):**
Run on session open using only top-level directory listing and known config file patterns.
- Count top-level files and directories
- Detect package manifests at root
- Detect well-known config files (nx.json, lerna.json, etc.)
- Detect compliance keywords in directory names
- Produces: provisional scale score (may be uncertain)

**Pass 2 — Full Scan (within first 30 tool calls):**
Run as filesystem exploration progresses.
- Count all files and nested directories
- Resolve module/package structure from manifests
- Detect service boundaries (services/, packages/, apps/)
- Scan for CI/CD configuration
- Detect testing infrastructure
- Detect documentation volume
- Detect deployment/environment configuration
- Resolve polyglot indicators
- Produces: confirmed scale score with confidence

**Pass 3 — Deep Resolve (lazy, on demand):**
Run when signals are contradictory or confidence is low.
- Full dependency graph resolution
- Cross-package contract detection
- Team size inference from CODEOWNERS, commit history patterns
- Regulatory document scanning
- Architecture pattern detection (microservices, monolith, event-driven)
- Produces: definitive scale score

### P3.4 — Confidence Scoring

Confidence is computed as the ratio of the winning scale's score to the runner-up's score, capped at 1.0:

```
confidence = score(winner) / max(score(runner_up), 1)
confidence = min(confidence, 1.0)
```

**Confidence thresholds:**

| Confidence | Classification | Bias Rule |
|---|---|---|
| 1.0 (absolute) | Lock — no reconsideration | Accept winner |
| 0.75 - 0.99 | High confidence | Accept winner unless compliance signal present |
| 0.50 - 0.74 | Moderate confidence | Accept winner but flag for re-evaluation |
| 0.30 - 0.49 | Low confidence | Bias toward lower scale of top 2 |
| < 0.30 | Uncertain | Default to lowest candidate with non-zero score |

**Margin calculation:** `margin = (score(winner) - score(runner_up)) / total_score`

If margin < 0.1 (less than 10% point spread), trigger deep resolve (Pass 3) to gather more signals.

**Examples:**

| Signals | Winner | Runner-Up | Confidence | Classification |
|---|---|---|---|---|
| 1 file, no config | NANO (3) | none | 1.0 | NANO |
| 5 files, package.json | SMALL (3+3=6) | MICRO (3) | 1.0 | SMALL |
| 50 files, 3 modules, CI config, tests | MEDIUM (12) | SMALL (9) | 0.75 | MEDIUM (high confidence) |
| 200 files, 2 modules, no CI | SMALL (9) | MEDIUM (6) | 0.67 | SMALL (flag re-eval) |
| 150 files, 5 modules, CI config | MEDIUM (12) | SMALL (9) | 0.75 | MEDIUM |

### P3.5 — Algorithm (Detailed)

```
1. COLLECT ALL SIGNALS
   a. Run Pass 1 (bootstrap) on session open
   b. Run Pass 2 (full scan) within first 30 tool calls
   c. For each signal, compute effective_weight = base_weight * quality_factor * recency_factor

2. SCORE EACH SCALE
   For scale S in [NANO, MICRO, SMALL, MEDIUM, LARGE, ENTERPRISE]:
     score[S] = sum of effective_weight for all signals pointing to S
     score[S] += sum of partial_weight for all signals pointing to S+ (e.g., "MEDIUM+" contributes to MEDIUM and above)

3. COMPUTE CONFIDENCE
   winner = argmax(score)
   runner_up = second highest score
   confidence = min(score[winner] / max(score[runner_up], 1), 1.0)
   margin = (score[winner] - score[runner_up]) / sum(score)

4. APPLY OVERRIDES
   if any compliance keyword signal detected:
     winner = ENTERPRISE
     confidence = 1.0
     trigger = "Compliance keyword overrides all signals"
     skip to step 6

5. APPLY BIAS RULES
   if confidence < 0.30:
     winner = lowest scale with non-zero score
     trigger = "Uncertain confidence, biased to lowest candidate"
   else if confidence < 0.50:
     winner = lower of top 2 scales
     trigger = "Low confidence, biased to lower of top 2"
   else if margin < 0.10:
     run Pass 3 deep resolve, recalculate
     if still margin < 0.10:
       winner = lower of top 2
       trigger = "Tight margin after deep resolve, biased to lower"

6. CLASSIFY
   final_scale = winner
   log: scale, confidence, margin, top_signals (top 3 by weight)
   emit: Scale Declaration in output

7. RE-EVALUATE ON SIGNAL CHANGE
   if new signal detected mid-session:
     if signal indicates HIGHER scale:
       recalculate score
       if new_score > current_score by margin >= 0.15:
         upgrade scale
         log transition
         emit Scale Change Notification
     if signal indicates same or LOWER scale:
       no action (one-way upgrade only within session)
```

### P3.6 — Override Rules

Some signals are powerful enough to override the scoring algorithm entirely. Overrides execute after scoring but before final classification.

| Override | Condition | Result | Rationale |
|---|---|---|---|
| Compliance mandate | Any compliance keyword detected (HIPAA, SOC2, PCI, GDPR, SOX, FISMA, FERPA, regulated, audit, PHI, PII context) | Force ENTERPRISE | Regulatory compliance cannot be optional |
| Multi-repo topology | Detected multiple independent repository roots | Force ENTERPRISE | Cross-repo coordination requires enterprise protocols |
| Polyglot boost | 3+ distinct language ecosystems detected | Increment scale by 1 | Polyglot projects inherently complex |

### P3.7 — Detection Examples by Project Type

| Project Type | Key Signals | Score Breakdown | Result | Confidence |
|---|---|---|---|---|
| Single Python script (hello.py) | files=1(3→NANO), modules=1(4→NANO) | NANO:7 | NANO | 1.0 |
| CLI tool (5 files, package.json) | files=2-10(3→MICRO), package.json(3→SMALL+) | MICRO:3, SMALL:6 | SMALL | 1.0 |
| Express API (12 files, 2 modules, tests, CI) | files=11-100(3→SMALL), modules=2-5(4→SMALL), CI(2→SMALL+), tests(2→MEDIUM+) | SMALL:9, MEDIUM:2 | SMALL | 1.0 |
| Monorepo (500 files, 10 modules, nx.json, k8s/, services/) | files=101-1000(3→MEDIUM), modules=6-15(4→MEDIUM), nx.json(3→LARGE), k8s/(3→LARGE+), services/(3→MEDIUM+) | MEDIUM:13, LARGE:6 | MEDIUM | 0.68 |
| SaaS backend (3000 files, 25 modules, services/, CI, k8s, CI/CD) | files=1001-10000(3→LARGE), modules=16-50(4→LARGE), services/(3→MEDIUM+), k8s/(3→LARGE+), CI(2→SMALL+) | LARGE:13, MEDIUM:3, SMALL:2 | LARGE | 1.0 |
| Fintech platform (20000 files, 80 modules, multi-repo, SOC2 docs) | files=10001+(3→ENTERPRISE), modules=51+(4→ENTERPRISE), compliance:SOC2(5→ENTERPRISE override) | ENTERPRISE:12+override | ENTERPRISE | 1.0 |
| Healthcare app (500 files, 5 modules, HIPAA mention in README) | files=101-1000(3→MEDIUM), modules=2-5(4→SMALL), compliance:HIPAA(5→ENTERPRISE override) | SMALL:4, MEDIUM:3, ENTERPRISE:override | ENTERPRISE | 1.0 |

---

## P3A — SCALE FACTORS

Scale factors are continuous dimensions that influence which scale level is appropriate. Each factor independently contributes signals to the detection algorithm. Understanding these factors helps predict and debug scale classification.

### P3A.1 — Factor Definitions

| Factor | Description | Measurement | Low Signal | High Signal |
|---|---|---|---|---|
| Codebase size | Total lines of code and files | File count, LOC estimate | 1-10 files → MICRO | 10000+ files → ENTERPRISE |
| Team size | Number of active contributors | CODEOWNERS entries, commit diversity, team config files | 1 person → NANO | 50+ → ENTERPRISE |
| Module count | Number of independently versioned/packaged units | Package manifests, module directories, binary targets | 1 module → NANO | 51+ → ENTERPRISE |
| Deployment frequency | How often changes reach production | CI/CD config, release notes frequency, deploy scripts | On-demand → NANO | Scheduled + frozen windows → ENTERPRISE |
| Service count | Number of independently deployable services | services/, apps/, microservice configs | 0-1 → MICRO | 10+ → LARGE+ |
| Environment count | Number of deployment targets | Environment configs, k8s namespaces, helm values | 0 → NANO | 4+ (dev/staging/prod/dr) → ENTERPRISE |
| API surface | Number of external endpoints | OpenAPI specs, route definitions, GraphQL schema | 0-5 → MICRO | 100+ → LARGE+ |
| Data store count | Number of distinct databases/stores | ORM configs, connection strings, migration directories | 0-1 → MICRO | 5+ → ENTERPRISE |
| External dependency count | Number of third-party packages/libraries | Lockfile entry count, go.sum entries, Cargo.lock entries | 0-5 → NANO | 500+ → ENTERPRISE |
| Compliance burden | Regulatory requirements applicable | Compliance keywords, regulatory docs, audit configs | None → any | Present → ENTERPRISE |
| Test coverage scope | Types and depth of testing | Unit tests, integration tests, e2e tests, load tests, coverage configs | None → MICRO | Full pyramid → LARGE+ |
| Documentation volume | Amount of project documentation | docs/ directory size, README length, wiki links, ADR presence | None → any | Extensive → LARGE+ |
| CI/CD sophistication | Pipeline complexity | Single build script vs. multi-stage, matrix builds, deployment pipelines | None → MICRO | Multi-stage, multi-env → LARGE+ |
| Security requirements | Security posture indicators | SECURITY.md, SAST config, secret scanning, dependency scanning | None → any | Present + audited → ENTERPRISE |
| Observability investment | Monitoring, logging, alerting setup | PagerDuty config, monitoring dashboards, structured logging | None → any | Full observability → LARGE+ |
| Process maturity | Formal change management | PR templates, review requirements, change boards, release gates | None → any | CAB approvals → ENTERPRISE |
| Age of codebase | Project maturity | Git history length, first commit date | Days → NANO | Years → LARGE+ |
| Change failure rate | Stability indicator | Rollback frequency, incident frequency | Unknown → any | Tracked → MEDIUM+ |

### P3A.2 — Factor Interaction Model

Factors interact synergistically. A project with low file count but high compliance burden classifies as ENTERPRISE. A project with high file count but single module and single developer classifies as MEDIUM at most (monolithic legacy app).

Interaction rules:
- **Compliance overrides all** — if any compliance factor is active, classification is ENTERPRISE regardless of other factors
- **Team + modules = multiplier** — team size 10+ with modules 6+ is a strong MEDIUM/LARGE signal (combined weight higher than sum)
- **Deployment frequency + environments** — deploying weekly to 3+ environments indicates MEDIUM+, even with modest codebase
- **Service count + API surface** — 3+ services with 20+ API endpoints each is LARGE regardless of file count
- **Polyglot + dependency count** — 3+ languages with 200+ total dependencies strongly signals LARGE+
- **Age + process maturity** — project older than 2 years with formal review process is MEDIUM+ by default

### P3A.3 — Factor Weight Table for Detection

| Factor | Weight Contribution | Affects |
|---|---|---|
| Codebase size (files) | Up to 3 per range | Direct scale score |
| Team size (inferred contributors) | 2-3 per range | MEDIUM+ or LARGE+ |
| Module count | 4 per range | Direct scale score |
| Service count | 3 per service over threshold | MEDIUM+ per additional service |
| Environment count | 2 per environment over 2 | MEDIUM+ per additional env |
| External dependency count | 1 per 100 deps over 50 | SMALL+ at 50, LARGE+ at 500 |
| Compliance keywords | 5 (override) | ENTERPRISE forced |
| Polyglot languages | 2 per language over 1 | Increment scale by 1 at 3+ |
| CI/CD config presence | 2 | SMALL+ |
| Testing infrastructure | 2 | MEDIUM+ |
| Documentation volume | 2 per indicator | MEDIUM+ |
| Process artifacts | 1-2 per indicator | Progressive toward scale |
| Observability config | 2 | LARGE+ |

---

## P4 — SCALE-TO-DEPTH MATRIX

| Feature | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| WorkType classification | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Risk assessment | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Inline footer | opt | ✓ | ✓ | ✓ | ✓ | ✓ |
| CURRENT_STATE.md | — | req | ✓ | ✓ | ✓ | ✓ |
| MODULE_MAP.md | — | — | ✓ | ✓ | ✓ | ✓ |
| API_CONTRACTS.md | — | — | ✓ | ✓ | ✓ | ✓ |
| SYSTEM_MAP.md | — | — | — | ✓ | ✓ | ✓ |
| ARCHITECTURE.md | — | — | — | opt | ✓ | ✓ |
| FEATURE_LOG.md | — | — | opt | ✓ | ✓ | ✓ |
| CHANGELOG_INTELLIGENCE.md | — | — | ✓ | ✓ | ✓ | ✓ |
| ANALYSIS_LOG.md | — | — | ✓ | ✓ | ✓ | ✓ |
| INCIDENT_SNAPSHOT.md | — | — | — | opt | ✓ | ✓ |
| COMPLIANCE_MAP.md | — | — | — | — | opt | ✓ |
| AUDIT_INDEX.md | — | — | — | — | — | ✓ |
| Deployment sequence | — | — | opt | ✓ | ✓ | ✓ |
| Cross-service impact | — | — | — | ✓ | ✓ | ✓ |
| Compliance flags | — | — | — | — | opt | ✓ |
| Brain snapshots | opt | opt | ✓ | ✓ | ✓ | ✓ |
| Session state persistence | — | — | ✓ | ✓ | ✓ | ✓ |

✓ = always · opt = when relevant · — = not needed · req = on first scan

### P4.1 — Depth Mapping by Feature

| Feature | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| Classification depth | Type only | Type + risk | Full taxonomy | Full + planned/unplanned | Full + cross-svc impact | Full + compliance overlay |
| Inline footer content | None/LOW | MEDIUM+ risk | Full summary | Full + module ref | Full + cross-svc ref | Full + compliance ref |
| Current state detail | None | File list | Module overview | Full directory | Full + service map | Full + compliance status |
| Module map detail | None | None | Top-level modules | Nested modules | Cross-svc modules | Cross-repo modules |
| API contract depth | None | None | Function signatures | Full interfaces | Service contracts | Cross-repo contracts |
| System map depth | None | None | None | Internal deps | Cross-svc deps | Cross-repo + infra deps |
| Architecture detail | None | None | None | Overview diagram | Detailed topology | Full architecture + compliance |
| Feature log depth | None | None | Per release | Per feature | Per feature + cross-svc | Per feature + audit ref |
| Changelog depth | None | None | Release notes | Per change | Per change + cross-svc | Per change + compliance ref |
| Analysis log depth | None | None | Fix protocol | Full + recurrence | Full + cross-svc | Full + compliance + audit |
| Incident snapshot | CRITICAL only | Major incidents | All incidents | All + root cause | All + blast radius | All + compliance report |

---

## P4A — CONTEXT INJECTION DEPTH BY SCALE

Context injection determines what background information is prepended to the agent's context window at session start and during execution. More complex scales require richer context to maintain accurate understanding.

### P4A.1 — Injection Levels

| Level | Description | Approx Size | Contents |
|---|---|---|---|
| SILENT | No project context injected | 0 tokens | Nothing beyond default system prompt |
| COMPACT | Minimal context for task focus | ~200-500 tokens | Current file path, scale classification, risk level |
| STANDARD | Standard project context | ~1500-3000 tokens | Scale declaration, risk assessment, brain file index, module map, current state summary |
| FULL | Complete project context | ~4000-8000 tokens | All STANDARD + full CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md, active contracts |
| FULL+COMPLIANCE | Full context + regulatory overlay | ~6000-12000 tokens | All FULL + compliance flags, regulatory requirements, audit config, data classification guide |

### P4A.2 — Injection Frequency and Triggers by Scale

| Scale | Session Start | On Scale Change | On HIGH+ Risk | On SCHEMA Change | On CONTRACT Change | On CONFIG Change | On INCIDENT |
|---|---|---|---|---|---|---|---|
| NANO | SILENT | — | SILENT | — | — | — | COMPACT |
| MICRO | SILENT | — | SILENT | — | — | — | COMPACT |
| SMALL | STANDARD | STANDARD | STANDARD | FULL | FULL | — | FULL |
| MEDIUM | STANDARD | STANDARD | FULL | FULL | FULL | COMPACT | FULL |
| LARGE | FULL | FULL | FULL | FULL+COMPLIANCE | FULL+COMPLIANCE | STANDARD | FULL+COMPLIANCE |
| ENTERPRISE | FULL+COMPLIANCE | FULL+COMPLIANCE | FULL+COMPLIANCE | FULL+COMPLIANCE | FULL+COMPLIANCE | FULL | FULL+COMPLIANCE |

### P4A.3 — Injection Payload Components

Each injection level includes specific payload components:

| Component | SILENT | COMPACT | STANDARD | FULL | FULL+COMPLIANCE |
|---|---|---|---|---|---|
| Scale declaration | — | ✓ | ✓ | ✓ | ✓ |
| Risk level | — | ✓ | ✓ | ✓ | ✓ |
| Current file/module scope | — | ✓ | ✓ | ✓ | ✓ |
| Brain file index | — | — | ✓ | ✓ | ✓ |
| CURRENT_STATE.md summary | — | — | ✓ | ✓ | ✓ |
| MODULE_MAP.md | — | — | — | ✓ | ✓ |
| Active contracts | — | — | — | ✓ | ✓ |
| Recent snapshots | — | — | — | ✓ | ✓ |
| Cross-service impacts | — | — | — | ✓ | ✓ |
| Compliance flags | — | — | — | — | ✓ |
| Regulatory requirements | — | — | — | — | ✓ |
| Audit trail config | — | — | — | — | ✓ |
| Data classification guide | — | — | — | — | ✓ |
| Incident history | — | — | ✓ | ✓ | ✓ |

### P4A.4 — Injection Behavior by Trigger

**Session start injection:**
- Load brain files matching scale requirements
- Read CURRENT_STATE.md for baseline understanding
- Compile MODULE_MAP.md if available
- Review recent CHANGELOG_INTELLIGENCE.md entries
- For LARGE+: load ARCHITECTURE.md into working context
- For ENTERPRISE: load COMPLIANCE_MAP.md and AUDIT_INDEX.md

**On scale change injection:**
- Re-inject at new scale level
- Notify of behavioral changes (checkpoint frequency, error recovery depth, autonomy level)
- Flag new compliance requirements if upgrading to ENTERPRISE
- Do not reduce injection level on upgrade (monotonic increase)

**On HIGH+ risk injection:**
- Inject full CURRENT_STATE.md of affected modules
- For MEDIUM+: inject cross-module contract snapshot
- For LARGE+: inject cross-service dependency view
- For ENTERPRISE: inject compliance flags relevant to affected area

**On INCIDENT injection:**
- Inject INCIDENT_SNAPSHOT.md (most recent first)
- Inject ANALYSIS_LOG.md patterns for recurrence detection
- For LARGE+: inject blast radius assessment
- For ENTERPRISE: inject compliance incident protocol

---

## P5 — AGENT BEHAVIOR PER SCALE

### P5.0 — Agent Core Behavior Table

| Behavior | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| Tool call tracking | Writes only | Writes + mutations | Full | Full + contract | Full + cross-svc | Full + audit |
| Checkpoint threshold | None | 3+ writes | 5 calls or HIGH | 5 calls/HIGH/schema | 3 calls on HIGH+ | Every action on CRITICAL |
| Scope enforcement | File | File+dir | Module | Strict module | Service boundaries | Strict + compliance |
| Pre-write check | Always | Always | Always + contract | Full protocol | Full + compliance | Full + audit |
| Injection level | SILENT | SILENT | STANDARD | STANDARD | FULL | FULL |
| Handoff format | Comment | Compact | Full block | Full + brain update | Full + deploy plan | Full + compliance |
| Ledger detail | Writes only | Writes + mutations | Full entries | Full + contract | Full + cross-svc | Full + audit trail |
| Error recovery | Single retry | Single retry | Retry + report | Full protocol | Full + escalation | Full + compliance |
| Reasoning depth | Shallow | Shallow+ | Moderate | Deep | Multi-step exhaustive | Exhaustive + compliance |
| Output detail | Terse | Compact | Balanced | Detailed | Comprehensive | Exhaustive + audit |
| Autonomy level | Full | High | Moderate | Limited | Low | Minimal |
| Tool access | Unrestricted | Unrestricted | Unrestricted | Scoped | Restricted | Restricted + audited |
| Confirmation threshold | None | Destructive only | HIGH risk | HIGH risk + schema | HIGH+ risk + cross-svc | Every action |
| Context budget | <5% | <10% | 15-25% | 30-40% | 50-65% | 75-90% |

### P5.1 — Reasoning Depth Specification

Reasoning depth controls how many inference steps, alternative paths, and impact analyses the agent performs before taking action.

| Scale | Depth Level | Steps | Alternatives | Impact Analysis | Pattern Matching |
|---|---|---|---|---|---|
| NANO | Shallow | 1-2 steps | None | None | None |
| MICRO | Shallow+ | 2-3 steps | 0-1 alternatives | File-local only | None |
| SMALL | Moderate | 3-5 steps | 1-2 alternatives | Module-local | Basic recurrence |
| MEDIUM | Deep | 5-8 steps | 2-3 alternatives | Cross-module | Full recurrence |
| LARGE | Multi-step exhaustive | 8-15 steps | 3-5 alternatives | Cross-service | Systemic patterns |
| ENTERPRISE | Exhaustive + compliance | 10-20+ steps | 3-5 alternatives + compliance | Full blast radius | Systemic + regulatory |

**Reasoning protocol by scale:**

**NANO:**
- Identify the file to operate on
- Make the change
- Verify the result (single check)
- No alternatives considered

**MICRO:**
- Identify scope (file + immediate directory)
- Reason step-by-step for complex operations
- Consider one alternative if first approach has clear risk
- Verify within project directory

**SMALL:**
- Frame the problem against module context
- Reason through 3-5 steps
- Consider 1-2 alternative approaches for significant changes
- Check module boundaries before acting
- Reference CURRENT_STATE.md for decisions
- Log reasoning to ANALYSIS_LOG.md for FIX work

**MEDIUM:**
- Load full brain context for relevant modules
- Frame problem against cross-module dependencies
- Generate 2-3 solution alternatives with pros/cons
- Trace impact chain through affected modules
- Check contract compatibility
- Detect recurrence from ANALYSIS_LOG.md patterns
- Select solution with explicit rationale
- Log full analysis to ANALYSIS_LOG.md

**LARGE:**
- Load full brain + cross-service contract database
- Frame problem against service topology
- Generate 3-5 alternatives including status quo
- Trace impact chain across all services
- Check cross-service contract compatibility
- Assess deployment and rollback complexity
- Evaluate security and operational implications
- Select with explicit trade-off matrix
- Log analysis with cross-service impact map

**ENTERPRISE:**
- Load full brain + compliance mapping
- Frame problem against regulatory requirements
- Generate 3-5 alternatives each evaluated for compliance
- Trace blast radius across all repos/services
- Check all contract compatibility across boundaries
- Assess regulatory impact per alternative
- Evaluate security, privacy, audit implications
- Select with compliance-annotated trade-off matrix
- Log analysis with full audit trail reference

### P5.2 — Output Detail Level Specification

Output detail controls how much context, rationale, and supporting information the agent includes in its responses.

| Scale | Verbosity | Rationale | Alternatives | Trade-offs | Compliance | Audit Trail |
|---|---|---|---|---|---|---|
| NANO | Terse (1-3 lines) | None | None | None | None | None |
| MICRO | Compact (3-5 lines) | 1 sentence | None | None | None | None |
| SMALL | Balanced (5-15 lines) | 2-3 sentences | When relevant | Concise | None | None |
| MEDIUM | Detailed (10-30 lines) | Full paragraph | Yes, with brief pros/cons | Explicit | None | Basic |
| LARGE | Comprehensive (20-50 lines) | Full + summary | Yes, with comparison table | Explicit + risk matrix | When relevant | Full |
| ENTERPRISE | Exhaustive (30-80+ lines) | Full + compliance overlay | Yes, compliance-annotated | Compliance-annotated | Always | Full + audit references |

**Output format rules by scale:**

**NANO:**
- Result only. No explanation.
- Example: `✓ File updated.` or `✗ Error: file not found.`
- Scale declaration omitted for consecutive calls within same file.

**MICRO:**
- Result with one-line summary.
- Example: `✓ src/utils.ts updated. Added sortByDate function (15 lines).`
- Scale declaration on first output and every 10th output.

**SMALL:**
- Result with rationale and brief context.
- Headers: ## Action, ## Result, ## Notes (when relevant)
- Scale declaration on first output and every 5th output.

**MEDIUM:**
- Full section structure.
- Headers: ## Context, ## Approach, ## Changes, ## Impact, ## Next Steps
- Scale declaration on every output.
- Brain file references included.

**LARGE:**
- Comprehensive document-style output.
- Sections: ## Summary, ## Context, ## Analysis, ## Alternatives, ## Selected Approach, ## Changes, ## Cross-Service Impact, ## Deployment Plan, ## Rollback, ## Monitoring
- Scale declaration on every output with top signals.
- Brain file update instructions included.

**ENTERPRISE:**
- Exhaustive audit-ready output.
- Sections: ## Summary, ## Context, ## Regulatory Assessment, ## Alternatives (compliance-annotated), ## Selected Approach, ## Changes, ## Cross-Repo Impact, ## Compliance Checklist, ## Deployment Plan, ## Rollback Plan, ## Monitoring, ## Audit Trail
- Scale declaration on every output with full signal list.
- Compliance flags prominently displayed.
- Every action includes audit reference.

### P5.3 — Autonomy Level Specification

Autonomy level controls which actions the agent may take without human confirmation.

| Level | Auto-Approve | Confirm On | Never Auto-Approve |
|---|---|---|---|
| Full | All actions | Nothing | Nothing |
| High | Reads, writes, mutations, executes | Destructive operations (delete, overwrite, format) | Production mutations |
| Moderate | LOW/MEDIUM risk within module | HIGH risk, SCHEMA changes, CONTRACT changes | CRITICAL risk, destructive ops |
| Limited | LOW/MEDIUM risk within single module | HIGH+ risk, SCHEMA/CONTRACT/CONFIG, cross-module | CRITICAL risk, production, destructive, compliance-tagged |
| Low | LOW risk only | MEDIUM+ risk, cross-service, INFRA, CONFIG, CONTRACT, deploy | CRITICAL risk, production, compliance-tagged, destructive |
| Minimal | Nothing | Every action | All mutations without explicit approval |

**Confirmation flow by scale:**

| Scale | Confirmation Format | Required Fields | Timeout |
|---|---|---|---|
| NANO | None | — | — |
| MICRO | Inline prompt | `[y/N]` | 10s |
| SMALL | Inline prompt with context | `[y/N] Reason:` | 30s |
| MEDIUM | Structured prompt | `[Approve/Deny/Modify] Impact:` | 60s |
| LARGE | Structured prompt with risk display | `[Approve/Deny] Risk:HIGH Impact:cross-svc Rollback:` | 120s |
| ENTERPRISE | Full approval block with compliance | `[Approve/Deny/Defer] Risk:CRITICAL Compliance:PII Audit-ref: Rollback:` | 300s |

### P5.4 — Tool Access Restrictions by Scale

| Tool Category | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| File read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| File write | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (audited) |
| File delete | ✓ | ✓ | ✓ | ✓ | ✓ (scoped) | ✓ (scoped+audited) |
| Directory create | ✓ | ✓ | ✓ | ✓ | ✓ (scoped) | ✓ (scoped+audited) |
| Execute commands | ✓ | ✓ | ✓ | ✓ (scoped) | ✓ (sandboxed) | ✓ (sandboxed+audited) |
| Network fetch | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (audited) |
| Search files | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Glob | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Parallel execution | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Batch operations | ✓ | ✓ | ✓ | ✓ (scoped) | ✓ (scoped) | ✓ (scoped+audited) |
| Environment variables | ✓ | ✓ | ✓ | ✓ | ✓ (scoped) | ✓ (scoped+audited) |
| Production mutations | — | — | — | ✗ | ✗ | ✗ (requires CAB) |

### P5.5 — Checkpoint Frequency

| Scale | Frequency | Trigger Details | Snapshot Type |
|---|---|---|---|
| NANO | Never | No checkpoints created | None |
| MICRO | After 3+ consecutive writes | Count tracks sequential file writes (reads reset counter) | CURRENT_STATE.md |
| SMALL | Every 5 tool calls or when risk reaches HIGH | Counting all tool calls; immediate snapshot on risk escalation | Full brain snapshot |
| MEDIUM | Every 5 calls, any HIGH risk, any SCHEMA change | Three-tier trigger: call count, risk level, change type | Full brain snapshot + contract state |
| LARGE | Every 3 calls when risk is HIGH+, any CONTRACT change | Conditional frequency (only when elevated risk); immediate on contract | Full brain + cross-svc contract snapshot |
| ENTERPRISE | Every action when risk is CRITICAL, every SCHEMA/CONTRACT change | Highest frequency: every tool call at CRITICAL; all schema/contract changes | Full brain + cross-repo contracts + compliance state |

### P5.6 — Error Recovery Depth

| Scale | Max Retries | Before Retry | Escalation Threshold | Escalation Action |
|---|---|---|---|---|
| NANO | 1 | None | Any failure | Report error and stop |
| MICRO | 2 | Simple retry | Same error twice | Report with context |
| SMALL | 3 | Log attempt | Same error 3x or permanent failure | Report with full context + suggest workaround |
| MEDIUM | 3 | Log attempt + checkpoint | Permanent failure (non-transient) | Checkpoint state + report with rollback option |
| LARGE | 3 | Log attempt + checkpoint + scope check | Permanent failure across any service | Full rollback consideration + escalation to human |
| ENTERPRISE | 3 | Log attempt + audit record + checkpoint | Any failure (transient or permanent) | Audit trail entry + full incident protocol + escalate to on-call |

### P5.7 — Pre-Write Verification Protocol

Before every write operation, the agent performs a verification appropriate to scale:

| Scale | Verification Steps |
|---|---|
| NANO | Confirm file path exists |
| MICRO | Confirm file path + directory exists, check no obvious collision |
| SMALL | Confirm path + directory + check contract integrity + verify no module boundary violation |
| MEDIUM | Confirm path + dir + contract integrity + module boundary + check for open changes in same module + verify against CURRENT_STATE.md |
| LARGE | Full MEDIUM + cross-service contract compatibility + compliance keyword scan + security implications scan + deployment impact check |
| ENTERPRISE | Full LARGE + regulatory compliance scan + PII/PHI data touch check + audit trail entry + change authorization verification + rollback plan validation |

### P5.8 — Scope Enforcement by Scale

Scope enforcement constrains which parts of the project the agent may modify in a single operation:

| Scale | Scope Unit | Cross-Boundary Reads | Cross-Boundary Writes |
|---|---|---|---|
| NANO | File | Unrestricted | Not applicable (single file) |
| MICRO | File + directory | Unrestricted | Within same directory |
| SMALL | Module | Unrestricted | Within same module only |
| MEDIUM | Strict module | Read from any module | Write within same module; cross-module requires confirmation |
| LARGE | Service boundaries | Read any service | Write within same service; cross-service requires full impact analysis |
| ENTERPRISE | Strict + compliance zones | Read with compliance check | Write within same zone; cross-zone requires compliance approval |

---

## P6 — BRAIN OUTPUT SPECIFICATIONS

### P6.1 — File Requirements by Scale

| File | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| CURRENT_STATE.md | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| MODULE_MAP.md | — | — | ✓ | ✓ | ✓ | ✓ |
| API_CONTRACTS.md | — | — | ✓ | ✓ | ✓ | ✓ |
| SYSTEM_MAP.md | — | — | — | ✓ | ✓ | ✓ |
| ARCHITECTURE.md | — | — | — | opt | ✓ | ✓ |
| FEATURE_LOG.md | — | — | opt | ✓ | ✓ | ✓ |
| CHANGELOG_INTELLIGENCE.md | — | — | ✓ | ✓ | ✓ | ✓ |
| ANALYSIS_LOG.md | — | — | ✓ | ✓ | ✓ | ✓ |
| INCIDENT_SNAPSHOT.md | — | — | — | opt | ✓ | ✓ |
| COMPLIANCE_MAP.md | — | — | — | — | opt | ✓ |
| AUDIT_INDEX.md | — | — | — | — | — | ✓ |

### P6.2 — First Scan Behavior

| Scale | Action | Estimated Token Cost |
|---|---|---|
| NANO | No scan needed | 0 |
| MICRO | Generate CURRENT_STATE.md with file listing and purpose | ~200-500 |
| SMALL | Generate CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md | ~1000-3000 |
| MEDIUM | Generate all 7 brain files in one session | ~4000-10000 |
| LARGE | Generate MEDIUM files + ARCHITECTURE.md, INCIDENT_SNAPSHOT.md | ~6000-15000 |
| ENTERPRISE | Generate all brain files + COMPLIANCE_MAP.md, AUDIT_INDEX.md | ~10000-25000 |

### P6.3 — Brain File Update Frequency

| File | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| CURRENT_STATE.md | — | On first scan | Per session | Per interaction | Per change | Per change + audit |
| MODULE_MAP.md | — | — | On module add/remove | On module change | On module change | Per change + audit |
| API_CONTRACTS.md | — | — | On signature change | On interface change | On contract change | Per change + audit |
| SYSTEM_MAP.md | — | — | — | On dependency change | On dependency change | Per change + audit |
| ARCHITECTURE.md | — | — | — | Quarterly review | On architectural change | On architectural change + audit |
| FEATURE_LOG.md | — | — | Per feature | Per feature | Per feature | Per feature + compliance ref |
| CHANGELOG_INTELLIGENCE.md | — | — | Per release | Per change | Per change | Per change + audit ref |
| ANALYSIS_LOG.md | — | — | Per FIX protocol | Per interaction | Per interaction | Per interaction + audit |
| INCIDENT_SNAPSHOT.md | — | — | — | Per incident | Per incident | Per incident + compliance report |
| COMPLIANCE_MAP.md | — | — | — | — | On compliance change | On regulatory change |
| AUDIT_INDEX.md | — | — | — | — | — | Per auditable action |

### P6.4 — Brain File Content Specification by Scale

**CURRENT_STATE.md content depth:**

| Field | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| File/module list | — | Simple list | Structured list | Nested + deps | Cross-svc view | Cross-repo view |
| Current tasks | — | 1-2 entries | Per module | Per module + status | Per service | Per org unit |
| Active risks | — | — | Per module | Per module + severity | Cross-svc risk map | Compliance risk overlay |
| Recent changes | — | Last 5 | Last 10 | Last 20 | Last 50 | Last 100 + audit ref |
| Pending items | — | — | Brief list | Prioritized list | Cross-svc queue | Org-level queue |

**MODULE_MAP.md content depth:**

| Field | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| Module names | — | — | Top-level only | Nested structure | Cross-svc structure | Cross-repo structure |
| Dependencies | — | — | Direct only | Full tree | Cross-svc graph | Cross-repo graph |
| Ownership | — | — | Implicit | Named owners | Team ownership | Org ownership |
| Version info | — | — | — | Per module | Per service | Per repo + service |

**API_CONTRACTS.md content depth:**

| Field | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| Public API surface | — | — | Function signatures | Interface definitions | Service contracts | Cross-repo contracts |
| Parameter specs | — | — | Names only | Types + descriptions | Full schema | Schema + compliance |
| Return types | — | — | Simple | Structured | Full response spec | Response + error codes |
| Breaking changes | — | — | Flagged | Tracked | Tracked + migration plan | Tracked + compliance-reviewed |

### P6.5 — Snapshot Specifications

| Scale | Trigger | Content | Storage |
|---|---|---|---|
| NANO | INCIDENT or CRITICAL only | Minimal state context | In-memory |
| MICRO | Significant FEATURE or FIX | CURRENT_STATE.md | Brain directory |
| SMALL | Per feature, per significant fix | Full brain state | Brain directory + timestamped |
| MEDIUM | Per PR, per significant session | Full brain + contract state | Brain directory + dated snapshots |
| LARGE | Per feature, per incident, per architecture change | Full brain + cross-svc contracts | Brain directory + dated + tagged |
| ENTERPRISE | Per PR (mandatory), per incident, per audit event | Full brain + compliance state + audit index | Brain directory + dated + tagged + audit-linked |

---

## P7 — SCALE TRANSITION PATTERNS

### P7.1 — Transition Types

Scale transitions fall into three categories: **growth** (project expanding in complexity), **contraction** (project simplifying or being deprecated), and **reorganization** (structural changes without net complexity change).

### P7.2 — Growth Transitions

Growth transitions happen when the project accumulates signals that push it to a higher scale. These are the most common transitions.

| Trigger | From | To | Detection Method | Action | ETA |
|---|---|---|---|---|---|
| File count crosses 10 | MICRO | SMALL | Periodic file count check | Generate CURRENT_STATE.md on next scan | Immediate on next scan |
| File count crosses 100 | SMALL | MEDIUM | Periodic file count check | Generate full brain directory | Immediate on next scan |
| File count crosses 1000 | MEDIUM | LARGE | Periodic file count check | Enable cross-service tracking | Immediate |
| File count crosses 10000 | LARGE | ENTERPRISE | Periodic file count check | Full compliance enablement | Immediate |
| Module count crosses 5 | MICRO | SMALL | Module manifest scan | Update MODULE_MAP.md | Immediate |
| Module count crosses 15 | SMALL | MEDIUM | Module manifest scan | Full brain generation | Immediate |
| Module count crosses 50 | MEDIUM | LARGE | Module manifest scan | Enable cross-svc contracts | Immediate |
| Second service directory detected | SMALL | MEDIUM | Directory scan | Generate full brain directory | Immediate |
| Monorepo tool discovered (nx.json, lerna.json, pnpm-workspace) | SMALL/MEDIUM | LARGE | Config file scan | Enable cross-service contract tracking | Immediate |
| CI/CD pipeline detected | MICRO/SMALL | MEDIUM | Config file scan | Add deployment sequence, snapshots | Next session |
| Testing infrastructure discovered | MICRO/SMALL | MEDIUM | Directory scan | Add analysis protocol | Next session |
| Multi-team signal detected (CODEOWNERS, >3 committers) | MEDIUM | LARGE | Content analysis | Enable cross-service impact analysis | Immediate |
| Team grows past 10 | MEDIUM | LARGE | Team inference | Enable cross-service tracking | Next session |
| Compliance keyword first detected (SOC2, HIPAA, PCI, GDPR, SOX) | Any | ENTERPRISE | Content scan | Enable audit trail + compliance flags | Immediate (override) |
| Security policy discovered | MEDIUM | LARGE | Config scan | Add security implications check | Next session |
| Production environment config detected | SMALL | MEDIUM | Config scan | Add deployment sequence | Next session |
| Multi-environment config (staging + prod + dr) | MEDIUM | LARGE | Config scan | Add rollback planning | Next session |
| Database migration scripts appear | SMALL | MEDIUM | Directory scan | Add schema change tracking | Next session |
| API specification files appear (OpenAPI, GraphQL) | SMALL | MEDIUM | File scan | Add contract tracking | Next session |

### P7.3 — Contraction Transitions

Contraction transitions happen when a project reduces in complexity (files removed, services consolidated, team shrinks). Contractions are never applied mid-session — they are detected at the next session start.

| Trigger | From | To | Detection Method | Action | ETA |
|---|---|---|---|---|---|
| File count drops below 10 | SMALL | MICRO | Session start scan | Remove brain files, reduce tracking | Next session |
| File count drops below 100 | MEDIUM | SMALL | Session start scan | Trim brain directory | Next session |
| Module count drops below 6 | MEDIUM | SMALL | Session start scan | Remove SYSTEM_MAP.md, FEATURE_LOG.md | Next session |
| All service directories consolidated to 1 | LARGE | MEDIUM | Session start scan | Disable cross-service tracking | Next session |
| Team shrinks to 1-2 | LARGE | MEDIUM | Session start team inference | Reduce behavioral depth | Next session |
| Compliance keywords removed | ENTERPRISE | Previous | Session start scan | If no other compliance signals remain, revert to pre-enterprise scale | Next session |
| CI/CD removed | MEDIUM | SMALL | Session start scan | Remove deployment sequence requirement | Next session |
| Multi-repo consolidated to single repo | ENTERPRISE | LARGE | Session start topology scan | Reduce to LARGE protocols | Next session |
| Prototype phase detected (rapid churn, no tests) | MEDIUM | SMALL | Session start pattern analysis | Reduce overhead for velocity | Next session |

**Contraction safety rules:**
- Never contract mid-session — only on session start
- Log contraction with old and new scale, trigger, and impacted behaviors
- If contraction would remove brain files, archive them rather than delete (prefixed with `_archive_`)
- If compliance keywords were present in previous 30 days but now absent, retain ENTERPRISE classification for one additional session (grace period)
- Contraction from ENTERPRISE requires at least 2 consecutive sessions without compliance signals

### P7.4 — Reorganization Transitions

Reorganization transitions involve structural changes that redistribute complexity without necessarily changing net scale.

| Trigger | From/To | Pattern | Action |
|---|---|---|---|
| Monolith split into services | MEDIUM → LARGE | Growth via reorganization | Generate per-service brain directories, cross-service contract tracking |
| Services merged into monolith | LARGE → MEDIUM | Contraction via reorganization | Consolidate brain directories, disable cross-service tracking |
| Repo split (monorepo → multi-repo) | LARGE → ENTERPRISE | Growth via reorganization | Add cross-repo contract tracking, audit index |
| Repo consolidation (multi-repo → monorepo) | ENTERPRISE → LARGE | Contraction via reorganization | Consolidate brain directories, simplify tracking |
| Framework migration | Same scale | Lateral reorganization | Update MODULE_MAP.md, API_CONTRACTS.md, regime-specific notes |
| Package rename/restructure | Same scale | Lateral reorganization | Update MODULE_MAP.md, update CURRENT_STATE.md |
| Ownership transfer (team A → team B) | Same scale | Lateral reorganization | Update ownership in MODULE_MAP.md, update CODEOWNERS mapping |
| Architecture pattern change (migration) | Varies | Cross-cutting | May trigger growth or contraction depending on pattern direction |
| Regulatory scope change (new regulation applies) | Varies | Growth via reorganization | Compliance keyword detection → ENTERPRISE override |

### P7.5 — Transition Rules (Complete)

1. **One-way upgrade within session** — once scale increases, it stays at that level until the next session. Never decrease mid-session even if signals reverse.

2. **Session start re-evaluation** — full re-evaluation at every session start. Previous scale is the baseline, but new signals can change it.

3. **Multi-level jumps** — scale can jump multiple levels (e.g., NANO → ENTERPRISE on compliance keyword). Jumps are processed as a single transition, not intermediate steps.

4. **Transition logging** — every transition must be logged with: old scale, new scale, trigger signal, confidence/margin before and after, impacted behaviors.

5. **Contraction grace period** — compliance-based ENTERPRISE classifications retain for 2 sessions after compliance keywords disappear.

6. **Behavioral impact notification** — on any transition, emit behavioral changes that activate. Include: injection level change, checkpoint frequency change, autonomy level change, brain output requirements change.

7. **No partial transitions** — a transition moves the entire project to the new scale. Hybrid scales are not supported. If different parts of the project would classify to different scales, use the highest.

8. **Scale declaration on transition** — emit Scale Change Notification on every transition, including multi-level jumps.

### P7.6 — Transition Impact Summary

| Transition | Injection Changes | Brain Changes | Behavior Changes | Quality Gate Changes |
|---|---|---|---|---|
| MICRO → SMALL | SILENT → STANDARD | Add 3 files | Moderate autonomy | Tier 1 only |
| SMALL → MEDIUM | STANDARD → STANDARD | Add 4 files | Limited autonomy | Tier 1 + Tier 2 |
| MEDIUM → LARGE | STANDARD → FULL | Add 2 files | Low autonomy | Full Tier 1 + Tier 2 |
| LARGE → ENTERPRISE | FULL → FULL+COMPLIANCE | Add 2 files | Minimal autonomy | Full + compliance gates |
| Any → ENTERPRISE | Current → FULL+COMPLIANCE | Compliance files added | Minimal autonomy | Full + compliance override |

---

## P8 — UNIVERSAL RULES (ALL SCALES)

These apply regardless of project scale:

1. **WorkType always classified** — no exception. Every interaction must have a WorkType assignment.
2. **Risk always assessed** — no exception. Every change must have a risk level.
3. **Breaking changes always named** — no exception. Breaking changes must be explicitly identified.
4. **UNPLANNED changes always flagged** — no exception. Any change not matching the current planned work must be flagged.
5. **Invented context always prohibited** — no exception. Never fabricate project structure, contracts, or signals.
6. **Cognitive summary always dense** — no exception. Summaries must be information-dense, no fluff.
7. **INCIDENT always overrides** — all INCIDENT work is CRITICAL risk. INCIDENT classification supersedes all other work type classification.
8. **Brain files are read-only except by agent** — brain files track agent state. Human edits to brain files must be flagged.
9. **Scale detection runs at session start** — always classify at start. Re-evaluate on signal change.
10. **Lower scale bias** — when uncertain, always prefer lower scale.

---

## P9 — OUTPUT FORMAT

### Scale Declaration

Embedded in every agent output at the frequency specified by scale:

```
SCALE: <NANO|MICRO|SMALL|MEDIUM|LARGE|ENTERPRISE>
Signals: <top 1-3 signals that determined this scale>
Confidence: <0.00-1.00>
Behavior: <key adaptations active>
```

**Example (SMALL):**
```
SCALE: SMALL
Signals: files=12, modules=2, package.json
Confidence: 1.00
Behavior: STANDARD injection, module scope, moderate autonomy, 5-call checkpoints
```

**Example (ENTERPRISE with override):**
```
SCALE: ENTERPRISE
Signals: files=3400, modules=23, compliance=HIPAA (override)
Confidence: 1.00
Behavior: FULL+COMPLIANCE injection, strict scope, minimal autonomy, full audit trail
Compliance: [PII] [PHI] [AUDIT_REQUIRED]
```

### Scale Change Notification

Emitted when a transition occurs mid-session:

```
SCALE CHANGE: <old> → <new>
Trigger: <what signal changed>
Confidence: <old_confidence> → <new_confidence>
Impact:
- Injection: <old_level> → <new_level>
- Autonomy: <old_level> → <new_level>
- Checkpoint: <old_frequency> → <new_frequency>
- Brain: <old_requirements> → <new_requirements>
```

**Example:**
```
SCALE CHANGE: SMALL → MEDIUM
Trigger: services/ directory detected
Confidence: 0.67 → 0.75
Impact:
- Injection: STANDARD → STANDARD (no change)
- Autonomy: moderate → limited
- Checkpoint: 5 calls/HIGH → 5 calls/HIGH/schema
- Brain: 3 files → 7 files
```

### Session Start Block

Output at the beginning of every session:

```
=== SESSION START ===
Project Scale: <scale> (confidence: <value>)
Top Signals: <signal1>, <signal2>, <signal3>
Active Behaviors:
- Reasoning: <depth_level>
- Output: <detail_level>
- Autonomy: <autonomy_level>
- Injection: <injection_level>
- Checkpoint: <frequency>
- Brain files: <count> active
- Compliance: <yes|no>
=== READY ===
```

### Risk Flag Format

When risk flags are injected (ENTERPRISE or when compliance-relevant):

```
[PII] — Change touches personally identifiable information
[PHI] — Change touches protected health information
[PAYMENT] — Change touches payment card data
[AUTH_CRITICAL] — Change touches authentication/authorization
[AUDIT_REQUIRED] — Change requires audit trail entry
[DATA_SOVEREIGNTY] — Change affects data residency/cross-border data flow
[REGULATED] — Change subject to regulatory compliance
```

---

## P10 — SCALE ADAPTATION ANTI-PATTERNS

| Anti-Pattern | Why It Fails | Correct Approach |
|---|---|---|
| Over-classification | ENTERPRISE overhead on a single script wastes tokens, slows feedback loop, adds unnecessary compliance checks | Bias toward lower scale; require strong signal support for high scales |
| Under-classification | Missing compliance on regulated project risks regulatory violation, data breach, audit failure | Compliance keyword = automatic ENTERPRISE regardless of file count |
| Static scale assumption | Project grew from 5 to 500 files but scale was never updated; missing brain infrastructure | Re-evaluate on every session start; check file count delta |
| Ignoring compliance flags | PII change in a LARGE project without audit trail; no regulatory check | Compliance keyword overrides all other signals; always scan for keywords |
| NANO rules on complex codebase | 200-file project treated as single-file; no module map, no contract tracking, no snapshots | Track module count, not just file count; module count has higher weight |
| ENTERPRISE rules on prototype | Heavy overhead on experimental code kills iteration velocity, wastes brain storage | Detect prototype phase (rapid churn, no tests, no CI); use lower scale |
| Scale change mid-session without notification | Agent behavior changes without warning; user confused by sudden autonomy change | Always log scale change with trigger and behavioral impact summary |
| Assuming scale from name only | Project named "enterprise-platform" but is a 3-file prototype | Name is low-weight signal; prioritize file count, module count, and structural signals |
| Cherry-picking signals | Ignoring contradictory signals (e.g., high file count but single module) | All signals count; contradictory evidence reduces effective weight |
| Session state bleed | Previous session's ENTERPRISE classification carried over after compliance removal | Re-evaluate at every session start; contraction allowed between sessions |
| One-signal classification | "I saw package.json, this must be enterprise" from a single config file | Classification requires multiple signals; min 2 signals from 2+ categories |
| Ignoring polyglot complexity | Project with 4 languages treated as same scale as single-language equivalent | Polyglot projects get +1 scale increment for 3+ languages |
| Autonomy mismatch | Letting NANO-level full autonomy run on MEDIUM project; destructive ops without confirmation | Match autonomy level to scale; check scale table before setting confirmation threshold |

### P10.1 — Scale Detection Failure Modes

| Failure Mode | Symptom | Root Cause | Fix |
|---|---|---|---|
| False NANO | Complex project treated as single file | Only top-level directory scanned | Run multi-pass detection; Pass 2 discovers nested structure |
| False MICRO | Multi-module project as small project | No module manifest detected | Use dependency resolution; parse lockfiles for module count |
| False SMALL | Team product classified as solo | No team indicators found | Infer team from CODEOWNERS, git history, commit patterns |
| False MEDIUM | Enterprise project as team product | No compliance keywords in surface scan | Deep scan for regulatory docs; check README, LICENSE, docs/ |
| False LARGE | Regulated project as large (non-enterprise) | Compliance keywords present but missed | Broaden keyword scan; check all text files not just config |
| False ENTERPRISE | Solo project classified as enterprise | "Enterprise" in repo name, low signal count overall | Apply confidence scoring; low confidence → bias to lower |
| Oscillation | Scale bounces between levels each session | Weak signals on boundary | Apply hysteresis: require consistent classification for 2 sessions |
| Override miss | Compliance keyword present but not triggered | Keyword not in scan dictionary | Expand keyword dictionary regularly; include partial matches |

---

## P11 — QUALITY GATES

### P11.1 — Tier 1: Hard Block Gates

These gates must pass before any work can proceed. Failure blocks all operations.

- [ ] Scale detected at session start (or explicitly set by user)
- [ ] Behavior configuration matches detected scale
- [ ] Compliance keyword detection → ENTERPRISE classification applied
- [ ] Universal rules applied (all 10 from P8)
- [ ] Brain output requirements met per scale (from P6.1)
- [ ] Scale confidence > 0 or manually overridden

### P11.2 — Tier 2: Standard Gates

These gates apply during execution. Failure triggers warning and re-evaluation, but does not block.

- [ ] Scale transitions logged with trigger and impact
- [ ] No over-classification (bias toward lower scale verified)
- [ ] Re-evaluation triggered on signal change (mid-session)
- [ ] Injection level matches scale requirements
- [ ] Checkpoint frequency matches scale requirements
- [ ] Error recovery depth matches scale requirements
- [ ] Pre-write verification matches scale requirements
- [ ] Output format matches scale requirements
- [ ] Scale declaration present in output (at required frequency)

### P11.3 — Scale-Specific Quality Gates

**NANO gates:**
- [ ] WorkType classified on every interaction
- [ ] No brain files created (unless INCIDENT)
- [ ] No ledger persistence
- [ ] SILENT injection only
- [ ] No checkpoint creation

**MICRO gates:**
- [ ] Risk classified alongside WorkType
- [ ] CURRENT_STATE.md generated on first scan
- [ ] Snapshot taken on significant FEATURE or FIX
- [ ] Ledger tracks writes + mutations
- [ ] Inline footer shown for MEDIUM+ risk

**SMALL gates:**
- [ ] Full WorkType + risk + PLANNED/UNPLANNED classification
- [ ] CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md maintained
- [ ] Per-feature or per-fix snapshots taken
- [ ] CHANGELOG_INTELLIGENCE.md updated
- [ ] ANALYSIS_LOG.md maintained for FIX work
- [ ] Pre-write check includes contract validation
- [ ] Handoff format is full block

**MEDIUM gates:**
- [ ] Full brain directory (7 files) maintained
- [ ] Per-PR or per-significant-session snapshots
- [ ] Session state persisted
- [ ] Deployment sequence logged for SCHEMA/CONTRACT/CONFIG changes
- [ ] Analysis log includes recurrence detection
- [ ] Cross-module contract tracking active
- [ ] Pre-write check uses full protocol
- [ ] Handoff includes brain update

**LARGE gates:**
- [ ] All MEDIUM gates apply
- [ ] ARCHITECTURE.md and INCIDENT_SNAPSHOT.md maintained
- [ ] Cross-service contract tracking active with version pinning
- [ ] Deployment sequence logged for SCHEMA/CONTRACT/CONFIG/INFRA
- [ ] Pre-write check includes compliance validation and contract compatibility
- [ ] Error recovery includes full rollback consideration
- [ ] Handoff includes deploy plan and rollback plan
- [ ] Every output includes scale declaration with top signals
- [ ] Security implications checked on every write

**ENTERPRISE gates:**
- [ ] All LARGE gates apply
- [ ] COMPLIANCE_MAP.md and AUDIT_INDEX.md maintained
- [ ] Compliance flags auto-injected: [PII], [PHI], [PAYMENT], [AUTH_CRITICAL], [AUDIT_REQUIRED]
- [ ] Every SCHEMA/CONTRACT/CONFIG/INFRA change explicitly audit-logged
- [ ] Breaking change gate enforced — CRITICAL+IRREVERSIBLE requires migration plan
- [ ] Full+COMPLIANCE injection always
- [ ] Snapshots mandatory per PR
- [ ] Pre-write check includes regulatory impact assessment
- [ ] Error recovery triggers audit trail + full incident protocol
- [ ] No auto-approve for any write operation
- [ ] Handoff includes compliance summary and audit reference

### P11.4 — Gate Failure Handling

| Gate Tier | Failure | Action | Escalation |
|---|---|---|---|
| Tier 1 (Hard Block) | Scale not detected | Block all work. Request manual scale override. | Human must provide scale explicitly |
| Tier 1 (Hard Block) | Behavior mismatches scale | Reconfigure behavior table. Block until matched. | Auto-fix if possible; flag if not |
| Tier 1 (Hard Block) | Compliance missed | Re-run detection with expanded keyword scan. Reclassify to ENTERPRISE. | Auto-fix (reclassify) |
| Tier 1 (Hard Block) | Brain output missing | Generate missing brain files before proceeding. | Auto-fix (generate on demand) |
| Tier 1 (Hard Block) | Universal rule violated | Halt operation. Identify violated rule. Report. | Human review required |
| Tier 2 (Standard) | Transition not logged | Log transition retroactively with trigger | Auto-fix |
| Tier 2 (Standard) | Over-classification detected | Re-run detection with lower bias. Adjust scale if needed. | Auto-fix with notification |
| Tier 2 (Standard) | Re-evaluation missed | Trigger re-evaluation now. | Auto-fix |
| Tier 2 (Standard) | Injection level wrong | Adjust injection to correct level | Auto-fix |
| Tier 2 (Standard) | Checkpoint frequency wrong | Adjust checkpoint config | Auto-fix |

### P11.5 — Gate Audit Log

Every gate check and gate failure is logged to the audit trail (ENTERPRISE) or internal ledger (all others):

```
GATE CHECK: <gate_name>
Scale: <current_scale>
Result: PASS|FAIL|WARN
Details: <what was checked, what was found>
Action: <if FAIL: what corrective action was taken>
Timestamp: <ISO 8601>
```

### Self-Audit Checklist

```
Scale detected?                  → yes / no (HARD BLOCK)
Behavior matches scale?          → yes / no (HARD BLOCK)
Compliance flagged?              → yes / no / N/A (HARD BLOCK if applicable)
Brain output requirements met?   → yes / no (HARD BLOCK)
Universal rules applied?         → yes / no (HARD BLOCK)
Confidence acceptable?           → yes / no
Scale transitions logged?        → yes / no / N/A
No over-classification?          → yes / no
Re-evaluation on signal change?  → yes / no
Injection level correct?         → yes / no
Checkpoint frequency correct?    → yes / no
Error recovery depth correct?    → yes / no
Pre-write verification depth?    → yes / no
Output format correct?           → yes / no
```

---

## P12 — SCALE DECISION LOG

Every scale decision is logged for auditability and debugging:

```
SCALE DECISION LOG
Timestamp: <ISO 8601>
Session ID: <uuid>

Detection Pass: <1|2|3>
Signals Collected:
  - filesystem: <count> files
  - modules: <count> modules
  - package.json: present/absent
  - nx.json: present/absent
  - services/: present/absent
  - k8s/: present/absent
  - CI config: present/absent
  - compliance keywords: <list>
  - team indicators: <count>
  - polyglot: <count> languages

Raw Scores:
  NANO: <score>
  MICRO: <score>
  SMALL: <score>
  MEDIUM: <score>
  LARGE: <score>
  ENTERPRISE: <score>

Confidence: <value>
Margin: <value>
Override Applied: <yes/no>
Override Reason: <if yes>

Final Classification: <scale>
Top 3 Signals: <signal1>, <signal2>, <signal3>

Active Behaviors:
  Reasoning: <depth>
  Output: <detail>
  Autonomy: <level>
  Injection: <level>
  Checkpoint: <frequency>
  Brain: <file_count> files
```

---

## P13 — COMPATIBILITY WITH SYNC ENGINES

### P13.1 — Scale-Aware Sync

| Sync Engine | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| File sync | Real-time | Real-time | On change | On change + debounce | On change + audit | Scheduled + audit |
| Brain file sync | None | On first scan | Per session | Per interaction | Per change | Per change + audit |
| Config sync | None | None | Per session | Per session | Per service | Cross-repo |
| State sync | None | None | Per session | Per session + persisted | Per session + cross-svc | Per session + compliance state |

### P13.2 — Scale-Aware Caching

| Cache | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| File listing | Not cached | Session-only | Session-only | Session + TTL | Persistent index | Persistent index + audit |
| Module map | Not cached | Not cached | Session-only | Session + TTL | Persistent | Persistent + audit |
| Contract cache | Not cached | Not cached | Session-only | Persistent | Persistent + versioned | Persistent + versioned + audited |
| Dependency graph | Not cached | Not cached | Not cached | Session + TTL | Persistent | Persistent + audit |

---

**Synarc S2 risk hard floors, S5 universal project handling, S13 quality gates, S17 zero-tolerance violations apply. Scale detection runs at session start and re-evaluates on signal changes. All synarc core rules remain in effect regardless of scale classification.**

**(End of file)**
