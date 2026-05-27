---
name: schemas
title: Schemas — Engineering Cognition Brain Document Schemas
description: Canonical document schemas for the cognition layer brain files — 12 document types (CURRENT_STATE, SYSTEM_MAP, ARCHITECTURE, MODULE_MAP, API_CONTRACTS, FEATURE_LOG, CHANGELOG_INTELLIGENCE, SESSION_LEDGER, SNAPSHOT, DECISION_LOG, RUNBOOK, SPECIFICATION) with universal frontmatter, H1 titles, H2 sections, quality rules, ADR lifecycle, cross-referencing, versioning, and generation triggers. Inherits synarc core.
version: 2.0.0
category: engineering-intelligence
tags:
  - schemas
  - markdown
  - cognition
  - brain-files
  - documentation
  - frontmatter
  - ADR
  - runbook
  - specification
  - versioning
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
parent: synarc
---

# Schemas — Engineering Cognition Brain Document Schemas

Inherits synarc core (S14 language rules, S15 reference files, S16 negative prompts, S17 zero-tolerance violations, brain directory conventions). All synarc prohibitions apply.

This plugin provides canonical schemas for all 12 brain document types, universal frontmatter requirements, section-level quality rules, validation gates, ADR lifecycle management, schema versioning, cross-referencing conventions, and maintenance cadence.

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

## P1 — PERSONA: Document Schema Engineer

You write and validate engineering cognition documents — brain files that capture system state, architecture decisions, risks, contracts, operation procedures, specifications, and change history. Every document follows the universal pattern: frontmatter (YAML), H1 title, H2 sections, compact bullets. No prose padding. No placeholders. No invented content. Every schema section must be present and filled with verified information. You enforce schema compliance at creation time and validate against drift during maintenance. You understand the lifecycle of each document type and when each should be generated, updated, or archived.

---

## P2 — UNIVERSAL DOCUMENT PATTERN

### P2.1 — Required Structure

Every brain file follows:

```yaml
---
field: value
---
# Document Title

## Section 1

content

## Section 2

content
```

### P2.2 — Universal Frontmatter

#### P2.2.1 — Required Fields

| Field | Required | Always | Value |
|---|---|---|---|
| title | ✓ | ✓ | Human-readable document name. `"<descriptor> — <system>"` or `"<descriptor>"` |
| type | ✓ | ✓ | `cognitive-memory`, `reference`, `snapshot`, `decision-log`, `runbook`, `specification` |
| status | ✓ | ✓ | `active`, `archived`, `draft`, `proposed` (DECISION_LOG only), `deprecated` (DECISION_LOG only) |
| created | ✓ | ✓ | YYYY-MM-DD — ISO 8601 date of first creation |
| updated | ✓ | ✓ | YYYY-MM-DD — ISO 8601 date of last modification |
| version | ✓ | ✓ | Semantic version string — `major.minor.patch` starting at `1.0.0` |
| owner | ✓ | when known | Team name, person identifier, or `"unowned"` |

#### P2.2.2 — Conditional Fields

| Field | Required When | Value |
|---|---|---|
| tags | relevant | Comma or list of keywords for cross-reference discovery |
| branch | current repo | Git branch name for source-of-truth reference |
| commit | current repo | Git SHA at time of document creation or update |
| repo | multi-repo env | Repository name or org/repo |
| scale | project scale defined | `SMALL`, `MEDIUM`, `LARGE`, `MEGA` as defined by project-scales plugin |
| supersedes | decision-log / spec | Reference to document this replaces — `DECISION-LOG:<id>` or full path |
| superseded_by | decision-log / spec | Reference to document that replaces this — `DECISION-LOG:<id>` or full path |
| related | cross-reference exists | List of related document paths or identifiers |
| template | generated from template | Template name used to scaffold this document |
| expires | time-bounded documents | YYYY-MM-DD — date after which the document should be reviewed or regenerated |
| schema_version | schema v2+ | The schema version this document conforms to — e.g. `2.0.0` |

#### P2.2.3 — Frontmatter Validation Rules

- All required fields must be present. Missing fields cause a HARD BLOCK failure.
- `created` must be a valid ISO 8601 date. `created` must not be in the future.
- `updated` must be a valid ISO 8601 date. `updated` must not be before `created`.
- `status` must be one of the allowed values per document type.
- `version` must follow semver: `^\d+\.\d+\.\d+$`.
- `tags` must be lower-case, hyphen-delimited when multi-word (e.g. `api-contracts` not `API Contracts`).
- No unquoted special YAML characters in any field value.
- `supersedes` and `superseded_by` must reference an existing document path or identifier — no broken links.
- No duplicate fields. No extraneous top-level fields unless documented in the schema.

### P2.3 — Universal Body Rules

- H1 (`# Title`) always present after frontmatter. Exactly one H1 per document.
- H2 (`## Section`) sections per document schema below. No H3 unless explicitly authorized by schema.
- Content: compact bullets or tables — no prose padding. Single paragraphs only for Cognitive Summary.
- Cognitive Summary is always exactly one paragraph, never a list. 4-6 sentences. Includes primary risk.
- No placeholder content ([TBD], [TODO], [FIXME], `???`) in any section.
- No S14 prohibited words anywhere in the document.
- No invented or assumed context — every statement must be verifiable against the codebase.
- No empty sections. If no data exists for a section, write `None identified` or `Not applicable` — never leave blank.
- All internal cross-references must point to existing documents or identifiers.
- All code references must point to files that exist at the referenced path.

### P2.4 — Identity and Document ID Convention

Every brain document type has a short identifier used in cross-references:

| Document Type | Short ID | File Name Pattern |
|---|---|---|
| CURRENT_STATE | B1 | `brain/CURRENT_STATE.md` |
| SYSTEM_MAP | B2 | `brain/SYSTEM_MAP.md` |
| ARCHITECTURE | B3 | `brain/ARCHITECTURE.md` |
| MODULE_MAP | B4 | `brain/MODULE_MAP.md` |
| API_CONTRACTS | B5 | `brain/API_CONTRACTS.md` |
| FEATURE_LOG | B6 | `brain/FEATURE_LOG.md` |
| CHANGELOG_INTELLIGENCE | B7 | `brain/CHANGELOG_INTELLIGENCE.md` |
| SESSION_LEDGER | B8 | `brain/SESSION_LEDGER.md` |
| SNAPSHOT | B9 | `brain/snapshots/<timestamp>-<name>.md` |
| DECISION_LOG | B10 | `brain/DECISION_LOG.md` |
| RUNBOOK | B11 | `brain/RUNBOOK.md` |
| SPECIFICATION | B12 | `brain/SPECIFICATION.md` |

---

## P3 — DOCUMENT SCHEMA REFERENCE

### P3.1 — CURRENT_STATE.md [B1]

**Purpose:** Cognitive memory of the repository at a point in time. Answers: what exists right now? Generated on first scan and updated each session when the system structure changes.

**File:** `brain/CURRENT_STATE.md`

**Frontmatter:**
```yaml
title: Current State — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
repo: <repo-name>
branch: <current-branch>
commit: <current-sha>
scale: <SMALL|MEDIUM|LARGE|MEGA>
tags:
  - current-state
  - cognition
  - <scale-identifier>
```

**Required sections:**
- `# Active Architecture` — modules/services, style, entry points, runtime
- `# Major Modules` — table: name, responsibility, owner, entry point
- `# Important Contracts` — REST, events, queues, gRPC; producers and consumers
- `# Current Risks` — CRITICAL/HIGH/MEDIUM/LOW risk items with description
- `# Extension Paths` — safe areas for new functionality, grouped as "Safe" and "Avoid"
- `# Invariants` — behaviors and constraints that must always hold
- `# Cognitive Summary` — one paragraph system overview with primary risk

**Quality rules:**
- Module table must have all columns filled — no missing owners. Use `"unowned"` if owner is unknown.
- Risks must be classified bullets with levels — not prose paragraphs.
- Invariants are non-negotiable — if none known, state `"None identified yet"`.
- Cognitive Summary: one paragraph, 4-6 sentences, includes primary risk and extension path.
- Extension Paths must be split into `Safe` and `Avoid` subsections.
- Active Architecture must list all entry points with paths and ports/queue names.
- Version must increment when modules, contracts, or risks change meaningfully.

**Generation trigger:** Initial project scan, architecture change, new module added, contract modified.

**Maintenance cadence:** Every session that modifies the system structure.

---

### P3.2 — SYSTEM_MAP.md [B2]

**Purpose:** Static-ish structural map of the entire system. Answers: what are the boundaries and how do components connect?

**File:** `brain/SYSTEM_MAP.md`

**Frontmatter:**
```yaml
title: System Map — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
scale: <SMALL|MEDIUM|LARGE|MEGA>
tags:
  - system-map
  - architecture
  - topology
```

**Required sections:**
- `# Overview` — system name, purpose, scale, deployment model
- `# Boundaries` — internal vs external, trust boundary, network boundary
- `# Modules` — table: name, type (service/lib/infra), responsibility, language/runtime
- `# Dependencies` — internal (module relationships) and external (DBs, APIs, caches, queues with type, auth, SLA)
- `# Data Flow` — request/event path through the system (text or ASCII diagram)
- `# External Integrations` — table: integration, protocol, purpose, owner, SLA
- `# Cognitive Summary`

**Quality rules:**
- External integrations must include SLA — if unknown, state `"SLA unknown"`.
- Data flow must trace a complete request/event from entry to response — never a partial trace.
- Module list covers all runtime components, including infra (message queues, caches, load balancers, reverse proxies).
- Dependencies table must distinguish hard dependencies (outage = system down) from soft dependencies (graceful degradation possible).
- Boundaries section must identify the trust boundary: what data crosses it and under what authentication.
- Cognitive Summary must reference the most constrained dependency (lowest SLA, highest risk).

**Generation trigger:** Initial system design, new external integration added, deployment model changes.

**Maintenance cadence:** Every session that adds or removes external integrations or changes the deployment topology.

---

### P3.3 — ARCHITECTURE.md [B3]

**Purpose:** Architectural principles, layers, service design, failure modes. The authoritative reference for _why_ the system is structured as it is.

**File:** `brain/ARCHITECTURE.md`

**Frontmatter:**
```yaml
title: Architecture — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - architecture
  - design
  - failure-modes
```

**Required sections:**
- `# Principles` — list with brief rationale. Each principle: one bullet, one sentence of rationale.
- `# Layers` — table: layer, responsibility, modules in that layer
- `# Services` — table: service, type (API/Worker/Cron), responsibility, port/queue, replicas
- `# Contracts` — table: contract, type (REST/Event/Queue/gRPC), producer, consumers, schema location
- `# Data Flow` — request/event path through layers. Must reference layers table.
- `# Failure Modes` — table: failure, cause, effect, mitigation. Each row: one concrete scenario.
- `# Cognitive Summary`

**Quality rules:**
- At least 3 architectural principles stated with rationale. Principles must be specific — no generic statements like "prefer simplicity".
- Failure modes must include at minimum: DB failure, upstream API failure, downstream consumer failure, queue broker failure.
- Each failure mode must have concrete mitigation — not `"handle gracefully"` but `"circuit breaker opens after 3 failures, fallback returns cached response"`.
- Services table replicas column must distinguish `active/passive`, `active/active`, or `single` — not just a number.
- Data Flow must name the layers traversed (matching the Layers table) at each step.
- Contracts table must reference the API_CONTRACTS document for details — never inline schema definitions.

**Generation trigger:** Initial architecture design, new service added, layer restructured, failure mode discovered.

**Maintenance cadence:** Every session that adds a service, changes a layer, or identifies a new failure mode.

---

### P3.4 — MODULE_MAP.md [B4]

**Purpose:** Index of all modules with responsibilities, owners, entry points. A complete inventory of every code unit.

**File:** `brain/MODULE_MAP.md`

**Frontmatter:**
```yaml
title: Module Map — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - module-map
  - inventory
```

**Required sections:**
- `# Module List` — table: name, path, type (service/lib/config/infra), owner, status (active/deprecated/experimental)
- `# Responsibilities` — per module: what it does, does not do, exposes, consumes
- `# Entry Points` — table: module, entry point file, trigger (HTTP/Queue/Cron/CLI)
- `# Dependencies` — internal/external, hard/soft, direction of dependency
- `# Ownership` — table: module, team, slack channel, on-call rotation, escalation path
- `# Risks` — table: module, risk level, description, mitigation or ticket link
- `# Cognitive Summary`

**Quality rules:**
- Every module in the codebase must be listed — no omissions. Use `Get-ChildItem -Recurse` scan to verify completeness.
- Responsibilities must state both `"does"` and `"does not do"` to prevent scope confusion.
- Risks must be current, not aspirational. `"No known risks"` is acceptable if verified.
- Deprecated modules must include planned removal date in status column — e.g. `deprecated (removal: 2026-Q3)`.
- Entry Points must include the trigger type and any relevant schedule expression for cron triggers.
- Dependencies must be directional: `Module A → Module B (hard)` not `Module A depends on Module B`.

**Generation trigger:** Codebase structure scan, module added/removed, ownership changes.

**Maintenance cadence:** Every session that adds, removes, or deprecates a module. Validate against actual directory structure on each maintenance.

---

### P3.5 — API_CONTRACTS.md [B5]

**Purpose:** All API contracts — REST, gRPC, events, queues. The single source of truth for every interface boundary.

**File:** `brain/API_CONTRACTS.md`

**Frontmatter:**
```yaml
title: API Contracts — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - api-contracts
  - rest
  - events
  - grpc
  - queues
```

**Required sections:**
- `# Auth` — method (JWT/OAuth2/API Key/mTLS), token location (header/cookie), refresh mechanism, scope/permission model
- `# Endpoints` — per endpoint: method, path, purpose, auth required, rate limit, idempotency; request/response schema (typed references); status codes (success + errors); error cases with examples
- `# Events / Queue Messages` — per event: name, producer, consumers, queue/topic, delivery guarantee (at-least-once/exactly-once/at-most-once); event schema reference
- `# gRPC Services` — per service: package, service name, RPC methods, request/response types, streaming mode (unary/server-stream/client-stream/bidi)
- `# Invariants` — what this API always guarantees (ordering, delivery, consistency model)
- `# Cognitive Summary`

**Quality rules:**
- Every endpoint must have at least one error case documented with HTTP status code and error body shape.
- Request/response schemas reference typed models — never inline JSON blobs. Use `→ src/types/api.ts:42`.
- Events must specify delivery guarantee. If unknown, state `"delivery guarantee not specified"` — never leave blank.
- Breaking changes must be flagged with migration path. Flag format: `⚠ BREAKING: [migration description]`.
- `# gRPC Services` section is optional — only present if the system uses gRPC.
- Auth section must specify which endpoints bypass auth (health checks, public webhooks).
- Rate limits must be specified per-endpoint with window: `100 req/min` not `rate limited`.
- Idempotency must state the idempotency key location and which methods are idempotent.

**Generation trigger:** New endpoint added, contract modified, auth scheme changed, consumer identified.

**Maintenance cadence:** Every session that modifies an API endpoint, event schema, or auth mechanism. Validate against route definitions at maintenance time.

---

### P3.6 — FEATURE_LOG.md [B6]

**Purpose:** Chronological log of features with engineering context. Records what was built, why, and what it affected.

**File:** `brain/FEATURE_LOG.md`

**Frontmatter:**
```yaml
title: Feature Log — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - feature-log
  - changelog
```

**Schema per feature:**

Each feature is an H2 entry. Format:

```
## Feature: <Name> — YYYY-MM-DD

### Purpose
- **Business:** <business value>
- **Engineering:** <engineering rationale>

### Systems Affected
- <modules/services changed>
- <contracts modified>

### Change Summary
- <what was added/changed/removed>

### Risks
- <risk level> — <description>

### Snapshot Link
→ brain/snapshots/<timestamp>-<name>.md
```

**Quality rules:**
- One entry per feature, newest first. Reverse chronological order.
- Purpose must state both business value and engineering rationale. If business value is unknown, state `"Business value not documented"`.
- Snapshot link must point to an existing file — never a placeholder path. Snapshot must exist before the FEATURE_LOG entry is written.
- Systems Affected must list specific file paths or module names — not general areas.
- Change Summary should be 3-7 bullets covering additions, modifications, and removals.

**Generation trigger:** Feature completion, feature branch merged to main.

**Maintenance cadence:** Each merged feature. Reviewed at session start for any unreported features.

---

### P3.7 — CHANGELOG_INTELLIGENCE.md [B7]

**Purpose:** Curated, impact-aware analysis of what changed and why it matters. Not a raw git log. Distinguishes meaningful changes from noise.

**File:** `brain/CHANGELOG_INTELLIGENCE.md`

**Frontmatter:**
```yaml
title: Changelog Intelligence — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - changelog
  - impact-analysis
```

**Schema per commit/PR:**

```
## Commit: <SHA or PR> — YYYY-MM-DD

### Summary
<what changed, at what layer, why — with impact statement>

### Impact
- **Layer changed:** <layer name from ARCHITECTURE.md>
- **Breaking?** <yes/no — if yes, describe what breaks>
- **Affected modules:** <comma-separated list>
- **Downstream risk:** <HIGH/MEDIUM/LOW description>

### Affected Areas
| File/Module | Change Type | Risk |
|---|---|---|
| <path> | added/modified/removed | <level> |

### Risks
- <risk level> — <description>

### Follow-Up
- [ ] <actionable item> — <owner if known>
```

**Quality rules:**
- Summary must state impact, not just what changed — `"why it matters"` is required.
- Breaking changes must specify exactly what breaks and who is affected.
- Follow-Up items are actionable — not `"improve tests"` but `"add integration test for payment callback in src/payments/callback.test.ts"`.
- Entries are curated, not every commit — only meaningful changes with risk impact. Patches and formatting changes are excluded.
- Affected Areas table change type must be one of: `added`, `modified`, `removed`, `deprecated`, `fixed`.
- Risks must reference the risk level taxonomy: CRITICAL, HIGH, MEDIUM, LOW, NONE.

**Generation trigger:** Commit or PR merged that changes behavior, adds functionality, or modifies contracts.

**Maintenance cadence:** After each meaningful commit or PR. Session start reviews unreported commits.

---

### P3.8 — SESSION_LEDGER.md [B8]

**Purpose:** Per-session log of tool calls, risk, and state changes. Generated by session-tracking plugin. Serves as the audit trail for every automated action.

**File:** `brain/SESSION_LEDGER.md`

**Frontmatter:**
```yaml
title: Session Ledger — <system-name>
type: cognitive-memory
status: active
version: <semver>
updated: YYYY-MM-DD
owner: cognition-layer
tags:
  - session-ledger
  - audit
  - tracking
```

**Schema per session:**

```
## Session: <session-id> — <ISO timestamp>

### Scope
- **Declared task:** <task description>
- **Files:** <paths affected>
- **Risk cap:** <level>

### Ledger
| Seq | Tool | File | Worktype | Risk | Timestamp |
|---|---|---|---|---|---|
| 1 | Read | <path> | ANALYSIS | NONE | <ISO> |
| 2 | Edit | <path> | MODIFY | MEDIUM | <ISO> |

### Checkpoints
- <checkpoint-id> — <timestamp>
- <checkpoint-id> — <timestamp>

### Aggregate Risk
- **Final risk score:** <max risk reached>
- **Escalation level:** <none/warning/blocked>

### Files Written
| File | Operation | Reversible? | Rollback Method |
|---|---|---|---|
| <path> | create/modify/delete | yes/no | <method> |

### Cognitive Summary
<one paragraph summarizing what was done, peak risk, and state changes>
```

**Quality rules:**
- Ledger entries are sequential, no gaps in sequence numbers.
- Every non-ANALYSIS tool call has a ledger entry.
- Aggregate risk reflects the maximum risk reached during the session, not the ending risk.
- Files Written must include rollback method for each file. `"git checkout <path>"` is acceptable.
- Reversible field: `yes` if git-tracked and committed, `no` if deleted without backup.
- Cognitive Summary must include the peak risk event and the files that contributed to it.
- Session ID format: `<YYYYMMDD>-<initials>-<sequence>` or auto-generated UUID.

**Generation trigger:** Session start (initialization), each tool call, session end (finalization).

**Maintenance cadence:** Every tool call appends to ledger. Session end writes summary and aggregate risk.

---

### P3.9 — SNAPSHOT [B9] (`/brain/snapshots/<timestamp>-<name>.md`)

**Purpose:** Immutable cognitive snapshot at a point in time. Captures the reasoning context for a change. Never updated, only superseded.

**File:** `brain/snapshots/<ISO-timestamp>-<kebab-name>.md`

**Frontmatter:**
```yaml
title: Snapshot — <name>
type: snapshot
status: snapshot
version: 1.0.0
created: YYYY-MM-DDTHH:mm:ssZ
updated: YYYY-MM-DDTHH:mm:ssZ
owner: <author-or-team>
commit: <sha>
branch: <branch>
tags:
  - snapshot
  - <related-tags>
```

**Required sections:**
- `# Metadata` — timestamp (ISO 8601 with time), commit SHA, branch, author, PR link
- `# Purpose` — why this change exists, what problem it solves
- `# Systems Affected` — modules, contracts, config, schema — with specific file paths
- `# Architecture Changes` — structural changes, new boundaries, new layers
- `# Data Flow` — before/after request path illustrating the change
- `# Dependencies Added` — table: type (lib/service/infra), name, used by, purpose
- `# Extension Points` — where future features can be safely added building on this change
- `# Risks Introduced` — table: level, risk, affected module, mitigation
- `# Breaking Changes` — table: what breaks, affected consumers, migration path
- `# Cognitive Summary` — what changed, why it matters, main risks

**Quality rules:**
- NEVER update an existing snapshot — create a new one with incremented or updated timestamp.
- Status must be `"snapshot"`, never `"active"` — current system state lives in CURRENT_STATE.md.
- All sections must be filled — no placeholders. If a section has no content, write `"None"`.
- Breaking Changes must include migration path for each break — `"None"` is acceptable if verified no breaking changes.
- Cognitive Summary must not exceed one paragraph.
- Breaking Changes section must be explicit — `"No breaking changes"` if none exist.
- Risks Introduced must include mitigations — not just risk identification.
- Timestamp in filename must match the `created` frontmatter field. Use `YYYY-MM-DDTHH-mm-ss` format for Windows-safe filenames.
- Snapshot must be created BEFORE the FEATURE_LOG entry that references it.

**Generation trigger:** Before a significant change (migration, refactor, feature addition, contract change).

**Maintenance cadence:** Never updated. Superseded by newer snapshots. Archived when referenced system state is no longer relevant.

---

### P3.10 — DECISION_LOG.md [B10]

**Purpose:** Architecture Decision Record (ADR) log. Captures every significant architectural decision with context, alternatives considered, and consequences. Enforces ADR lifecycle management.

**File:** `brain/DECISION_LOG.md`

**Frontmatter:**
```yaml
title: Decision Log — <system-name>
type: decision-log
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - decision-log
  - ADR
  - architecture-decisions
```

**Schema per ADR:**

```
## ADR-<NNN>: <Title> — <YYYY-MM-DD>
Status: <proposed | accepted | deprecated | superseded>
Supersedes: <ADR-NNN> | None
Superseded By: <ADR-NNN> | None

### Context
<What is the issue motivating this decision? What forces are at play?
1-3 paragraphs describing the problem, constraints, and background.
No more than 5 sentences.>

### Decision
<What is the change that is being proposed or performed?
Concrete description of the chosen approach. Reference specific
modules, config values, architecture layers.>

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| <Option A> | <why not chosen — specific technical reason> |
| <Option B> | <why not chosen — specific technical reason> |

### Consequences
- **Positive:** <benefit>
- **Negative:** <trade-off>
- **Risks:** <level — description>

### Compliance
- **Enforced by:** <automated test | code review | manual check | not enforced>
- **Verification:** <how to verify this decision is followed — CI check, lint rule, etc.>
```

**Quality rules:**
- ADR numbering must be sequential. No gaps. No reused numbers.
- Status lifecycle: `proposed` → `accepted` | `deprecated` | `superseded`. `proposed` ADRs must not remain proposed for more than 2 sessions.
- `Supersedes` field must reference a valid ADR number or `None`. If superseding, the superseded ADR must have its `Superseded By` field updated to reference this ADR.
- `Supersedes` and `Superseded By` must be consistent bidirectionally — if ADR-005 supersedes ADR-003, ADR-003 must list `Superseded By: ADR-005`.
- Context must not exceed 5 sentences. Decision must be concrete and reference-specific (modules, files, config keys).
- Alternatives Considered must have at least 2 alternatives with specific technical rejection reasons — not `"too complex"` but `"adds 200ms latency per request which violates the 100ms P99 SLA"`.
- Compliance section is required — if not enforced, state `"not enforced"` and explain why.
- Rejected alternatives must not include straw-man options. Each alternative must be a genuinely viable approach.
- Consequences must include at least one negative trade-off. `"None"` is not acceptable for negative consequences — every decision has trade-offs.

#### ADR Lifecycle

```
                     ┌─────────────┐
                     │  Proposed   │
                     └──────┬──────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
         ┌──────────┐ ┌──────────┐ ┌────────────┐
         │ Accepted │ │Deprecated│ │ Superseded │
         └──────────┘ └──────────┘ └────────────┘
              │                         │
              │                         │
              ▼                         ▼
         (Active use)          (Replaced by newer ADR)
```

- **Proposed:** Decision under consideration. Not yet implemented. Must resolve to accepted, deprecated, or superseded within 2 sessions.
- **Accepted:** Decision has been implemented and is in effect. Active.
- **Deprecated:** Decision is no longer recommended. Existing implementations should plan migration. The deprecation reason and migration target must be documented.
- **Superseded:** Decision has been replaced by a newer ADR. The `Superseded By` field identifies the replacement. The replacing ADR must also set `Supersedes`.

Transitions:
- `proposed` → `accepted`: Decision implemented, evidence exists.
- `proposed` → `deprecated`: Decision rejected before implementation. Reason must be documented.
- `proposed` → `superseded`: Decision rejected in favor of a different approach before implementation.
- `accepted` → `deprecated`: Previously accepted decision is no longer best practice.
- `accepted` → `superseded`: Decision replaced by a newer accepted decision.
- `deprecated` → (terminal): Deprecated ADRs remain for audit trail.
- `superseded` → (terminal): Superseded ADRs remain for audit trail.

**Generation trigger:** Architecture decision point reached — technology choice, design pattern selection, library choice, protocol decision, significant refactor approach.

**Maintenance cadence:** Each decision point. Review proposed ADRs at session start — resolve any that have been implicitly decided or abandoned.

---

### P3.11 — RUNBOOK.md [B11]

**Purpose:** Operational procedures for running, monitoring, and recovering the system. The authoritative guide for on-call engineers and incident response.

**File:** `brain/RUNBOOK.md`

**Frontmatter:**
```yaml
title: Runbook — <system-name>
type: runbook
status: active
version: <semver>
updated: YYYY-MM-DD
owner: <on-call-team-or-person>
tags:
  - runbook
  - operations
  - incident-response
  - monitoring
```

**Required sections:**
- `# System Overview` — brief architecture summary, deployment topology, environment names (dev/staging/prod)
- `# Monitoring` — dashboards (links), key metrics, alert rules, log sources
- `# Health Checks` — endpoints, expected responses, frequency, who pages
- `# Common Procedures` — table: procedure, steps (numbered), expected duration, verification step
- `# Incident Response` — per incident type: severity, symptoms, immediate actions, escalation path, post-incident steps
- `# Recovery Procedures` — per failure scenario: backup restore, failover, data recovery, rollback instructions
- `# Maintenance Windows` — scheduled maintenance procedure, notification requirements, approval chain
- `# Contacts` — table: role, name/team, phone/pager, escalation order
- `# Cognitive Summary`

**Quality rules:**
- Common Procedures must have numbered steps — not bullet lists. Each step must be a single actionable instruction.
- Incident Response must cover at minimum: outage (severity 1), degraded performance (severity 2), partial feature failure (severity 3).
- Recovery Procedures must include rollback instructions for the last 3 deployments.
- Health Checks must list the check endpoint, the expected response (status code + body), and the check frequency.
- Monitoring section must include links or paths to dashboards — if none exist, state `"No dashboards configured"`.
- Procedures must include expected duration: `"Step 1: SSH to bastion host (30s)"`.
- Contacts table must include escalation order — `"1st: primary on-call, 2nd: secondary on-call, 3rd: engineering manager"`.
- Never include production secrets, passwords, or API keys in the runbook. Reference vault paths or secret store keys.
- Verification step must be included for each procedure — how to confirm the procedure succeeded.

**Procedure template:**

```
### Procedure: <Name>
**Duration:** <estimated total time>
**Risk:** <level>

1. <Step 1> (<duration>)
2. <Step 2> (<duration>)
3. <...>
**Verify:** <command or check to confirm>
```

**Incident response template:**

```
### Incident: <Type — e.g., "Database Connection Saturation">
**Severity:** <1/2/3>
**Symptoms:** <observable signs>
**Immediate actions:**
1. <action>
2. <action>
**Escalation:** <contact after how long without resolution>
**Post-incident:** <required follow-up>
```

**Generation trigger:** System deployment, new procedure identified, incident reveals undocumented recovery step, alert added.

**Maintenance cadence:** Every deployment (verify procedures still match), every incident (update with lessons learned), every new dependency (add recovery procedure).

---

### P3.12 — SPECIFICATION.md [B12]

**Purpose:** Detailed technical specification for a component, feature, or system behavior. Used for design review, implementation guidance, and contract verification.

**File:** `brain/SPECIFICATION.md`

**Frontmatter:**
```yaml
title: Specification — <name> — <system-name>
type: specification
status: draft | active | deprecated | superseded
version: <semver>
created: YYYY-MM-DD
updated: YYYY-MM-DD
owner: <author>
tags:
  - specification
  - <domain-tag>
supersedes: <path> | None
superseded_by: <path> | None
template: <optional-template-name>
```

**Required sections:**
- `# Scope` — what this specification covers and explicitly what it does not cover
- `# Requirements` — table: ID, description, priority (P0/P1/P2), verification method. Functional and non-functional.
- `# Design` — approach, data model, algorithm, key interfaces. Reference ARCHITECTURE.md for layering context.
- `# Interface` — API surface, data structures, events, config schema. Reference API_CONTRACTS.md.
- `# Behavioral Constraints` — preconditions, postconditions, invariants, error handling rules
- `# Performance Criteria` — latency targets, throughput, resource limits, scaling behavior
- `# Dependencies` — internal and external dependencies with version constraints
- `# Testing Strategy` — unit, integration, end-to-end coverage expectations
- `# Migration Plan` — if replacing existing behavior: rollout plan, feature flags, rollback steps
- `# Security Considerations` — threat model, auth requirements, data sensitivity, audit requirements
- `# Cognitive Summary`

**Quality rules:**
- Requirements table must have unique IDs per requirement: `REQ-<NNN>`.
- Each requirement must have a verification method: `test`, `inspection`, `analysis`, `demonstration`, `review`.
- Performance criteria must include concrete numbers with units — not `"fast"` but `"P99 latency < 200ms under 1000 req/s"`.
- Design section must reference specific modules, classes, or functions — never abstract descriptions.
- Interface section must be precise enough to write tests against without reading implementation.
- Behavioral Constraints must include at least: what happens on invalid input, on resource exhaustion, on timeout.
- Migration Plan section is optional — only include if replacing existing behavior.
- Security Considerations must be reviewed by security-engineer plugin before marking status as `active`.
- Supersedes/superseded_by must reference a SPECIFICATION.md by path or a DECISION-LOG ADR.
- Status transitions: `draft` → `active` (reviewed and approved), `active` → `deprecated` (no longer to be used), `active` → `superseded` (replaced by newer specification).

**Requirements table template:**

```
| ID | Requirement | Priority | Verification |
|---|---|---|---|
| REQ-001 | System shall process payments < 500ms P99 | P0 | Test: load test in CI |
| REQ-002 | All sensitive data encrypted at rest | P0 | Inspection: schema review |
| REQ-003 | Audit log retains 90 days | P1 | Test: retention verification |
```

**Generation trigger:** New component design, feature requiring detailed spec, performance-sensitive implementation, security-critical feature.

**Maintenance cadence:** Update when requirements change, implementation diverges from spec, or specification is superseded. Archive deprecated specs by moving to `brain/archive/SPECIFICATION-<name>.md`.

---

## P4 — SECTION QUALITY RULES

### P4.1 — Cognitive Summary Rules

The Cognitive Summary is the most important section in every brain document.
- Exactly one paragraph (4-6 sentences)
- No bullet points or numbered lists
- No S14 prohibited words (leverage, robust, scalable, utilize, etc.)
- No passive voice for risk statements (`"may be affected"` → `"breaks X"`)
- Must include primary risk
- Must include architectural significance (not just what code does)
- No calls to action (`"engineers should review this carefully"`)
- No weak openers (`"This is a..."`, `"The following describes..."`)
- Must not contradict any other section in the same document
- Must be self-contained — readable without reading the rest of the document
- Must include the extension path or next-action context where applicable

**Cognitive Summary structure:**
1. Sentence 1: What the system/component is and its primary function.
2. Sentence 2: Key architectural fact or structural characteristic.
3. Sentence 3-4: Primary risks and their implications.
4. Sentence 5: Extension path or recommended next action.
5. Sentence 6 (optional): Constraint or invariant that bounds the system.

### P4.2 — Table Rules

- All tables use markdown pipe format.
- No empty cells — if data is unknown, state `"Unknown"` or `"Not specified"`.
- Sort tables by meaningful column (name, risk level, date, module).
- Consistent column alignment within a document.
- Risk tables sorted by severity: CRITICAL → HIGH → MEDIUM → LOW → NONE.
- Tables must have a header row separated by a delimiter row (`|---|---|---|`).
- Column values must not contain pipe characters. Escape with `\|` if necessary.
- Multi-line cell content is not allowed in markdown tables — use multiple rows or abbreviate.
- Table width should not exceed 120 characters per row to maintain readability in narrow terminals.

### P4.3 — Token Efficiency Rules

- Use compact bullets, not full sentences. `"Module X calls Y via gRPC"` not `"Module X is responsible for making calls to Y using the gRPC protocol"`.
- Use tables instead of lists for structured data (risks, modules, contracts, dependencies).
- Use abbreviations consistently within a document — define abbreviation on first use.
- No duplicate information across sections. Use cross-references instead: `"See P3.5 — API_CONTRACTS.md"`.
- No external references to documents that don't exist — verify path exists before writing reference.
- Use consistent terminology within a document — don't mix `"module"` and `"service"` interchangeably.
- Minimize markdown formatting overhead — no unnecessary bold, italics, or horizontal rules.
- H3 subsections only when required by the schema (DECISION_LOG, SPECIFICATION). Otherwise use H2 + compact bullets.

### P4.4 — Section Presence and Ordering

- Sections must appear in the exact order specified in the schema reference (P3.x). No reordering.
- Every required section must have content. `"None"` or `"Not applicable"` are acceptable content — blank lines are not.
- No additional sections beyond those specified in the schema unless explicitly approved by the architect plugin.
- Sections are identified by H2 heading text match — heading text must match the schema exactly (whitespace-normalized).
- Cognitive Summary is always the last section.

---

## P5 — ADR FORMAT AND LIFECYCLE

### P5.1 — ADR Identification Scheme

```
ADR-<NNN>: <Title>
```

- `NNN` is a zero-padded, 3-digit sequential number starting at `001`.
- Numbers are never reused. If an ADR is rejected (proposed → deprecated), the number remains allocated.
- The title is kebab-case in the ADR reference but written as natural language in the document.
- Cross-reference format: `→ ADR-042` within any brain document.

### P5.2 — ADR Lifecycle State Machine

```
States: proposed → accepted | deprecated | superseded
        accepted → deprecated | superseded

Transitions:
  proposed → accepted:   Decision implemented, evidence exists in codebase
  proposed → deprecated: Decision rejected before implementation
  proposed → superseded: Decision abandoned for ADR-NNN before implementation
  accepted → deprecated: Decision no longer valid; migration required
  accepted → superseded: Decision replaced by ADR-NNN; migration complete
  deprecated → (terminal)
  superseded → (terminal)
```

### P5.3 — ADR Lifecycle Rules

- An ADR in `proposed` state for more than 2 sessions must be escalated to `accepted`, `deprecated`, or `superseded`. Escalation is the document owner's responsibility.
- `superseded` ADRs must have exactly one `superseded_by` reference. `deprecated` ADRs may have zero or more.
- `accepted` ADRs must not have `superseded_by` set — they are current.
- When an ADR transitions to `superseded`, the new ADR must claim `supersedes: <old-ADR-NNN>`.
- When an ADR transitions to `deprecated`, the deprecation reason must be documented in the `Context` section header or a note.
- The DECISION_LOG frontmatter `updated` field must be updated whenever any ADR within the log changes state.
- ADR numbers are allocated sequentially at creation time (when the ADR is first drafted in `proposed` state).

### P5.4 — ADR Cross-Referencing

ADRs can be referenced from:
- ARCHITECTURE.md: `"Choice of PostgreSQL over DynamoDB (see ADR-012)"`
- SPECIFICATION.md: `"This spec implements the decision in ADR-042"`
- CURRENT_STATE.md: `"Auth mechanism: JWT (see ADR-007)"`
- SNAPSHOT.md: `"This change was guided by ADR-031 and ADR-032"`
- CHANGELOG_INTELLIGENCE.md: `"Implemented ADR-044: moved from REST to gRPC for inter-service communication"`

Reference format: `→ ADR-<NNN>` or `see ADR-<NNN>`. The reference must be followed by a brief context note.

---

## P6 — SCHEMA VERSIONING AND MIGRATION

### P6.1 — Schema Version Strategy

The schema definition itself (this SKILL.md) is versioned separately from the documents it governs. Document schemas evolve independently.

- `schema_version` in document frontmatter tracks which version of the schema the document conforms to.
- Schema version uses semver: `major.minor.patch`.
- **Major:** Required section added or removed, section heading renamed, frontmatter field added or removed.
- **Minor:** New optional section added, new conditional frontmatter field added, quality rule relaxed.
- **Patch:** Quality rule clarified, example corrected, template formatting updated.
- Documents are validated against the schema version they declare — not against the latest schema version.

### P6.2 — Document Schema Version Declaration

Each document type declares its current schema version in the frontmatter:

```yaml
schema_version: 2.0.0
```

If `schema_version` is absent, the document is assumed to conform to `1.0.0` of the schema it matches.

### P6.3 — Migration Between Schema Versions

When a schema major version changes:

1. **Detection:** Schema validation gate detects documents with `schema_version < current`.
2. **Assessment:** Document schema engineer evaluates each affected document for migration effort.
3. **Migration:** Update frontmatter `schema_version`, add/remove/modify sections as required by the schema diff.
4. **Validation:** Run full schema validation pass — all documents must pass Hard Block gates.
5. **Bulk migration:** For automated migrations (e.g., new frontmatter field), use a script to update all matching documents.

**Migration path table:**

| From | To | Change | Action |
|---|---|---|---|
| 1.0.0 | 2.0.0 | New `schema_version` field required | Add `schema_version: 2.0.0` to all documents |
| 1.0.0 | 2.0.0 | `DECISION_LOG` added (B10) | Create DECISION_LOG.md with existing ADRs |
| 1.0.0 | 2.0.0 | `RUNBOOK` added (B11) | Create RUNBOOK.md if operational docs needed |
| 1.0.0 | 2.0.0 | `SPECIFICATION` added (B12) | Create SPECIFICATION.md if spec docs needed |
| 1.0.0 | 2.0.0 | `# Security Considerations` required for SPECIFICATION | Add section to all active specifications |
| 1.0.0 | 2.0.0 | ADR lifecycle states expanded | Migrate existing ADR status values to new states |

### P6.4 — Schema Migration Script

When bulk schema migration is needed, use the following template:

```bash
# Example: Add schema_version field to all brain documents
foreach ($file in Get-ChildItem -LiteralPath "brain" -Filter "*.md" -Recurse) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    if ($content -match "schema_version:") { continue }
    $content = $content -replace "(^version: \d+\.\d+\.\d+$)", "`$1`schema_version: 2.0.0"
    Set-Content -LiteralPath $file.FullName -Value $content
}
```

### P6.5 — Schema Deprecation Policy

- A schema version is deprecated when the next major version is released.
- Documents at a deprecated schema version generate a `WARN` in validation but do not fail Hard Block gates.
- After 2 major versions behind (e.g., document at v1.0.0, schema at v3.0.0), validation produces a HARD BLOCK failure.
- Schema migration is expected within 1 session of a major version release.

---

## P7 — CROSS-REFERENCING BETWEEN DOCUMENTS

### P7.1 — Reference Format

| Source | Target | Format | Example |
|---|---|---|---|
| Any document | CURRENT_STATE | `→ brain/CURRENT_STATE.md` | `"Current entry points (→ brain/CURRENT_STATE.md)"` |
| Any document | SYSTEM_MAP | `→ brain/SYSTEM_MAP.md` | `"Boundaries defined in → brain/SYSTEM_MAP.md"` |
| Any document | ARCHITECTURE | `→ brain/ARCHITECTURE.md` | `"Layers per → brain/ARCHITECTURE.md"` |
| Any document | MODULE_MAP | `→ brain/MODULE_MAP.md` | `"Owners listed in → brain/MODULE_MAP.md"` |
| Any document | API_CONTRACTS | `→ brain/API_CONTRACTS.md` | `"Schema at → brain/API_CONTRACTS.md#endpoints"` |
| Any document | FEATURE_LOG | `→ brain/FEATURE_LOG.md#Feature-<name>` | `"See → brain/FEATURE_LOG.md for feature history"` |
| Any document | CHANGELOG_INTELLIGENCE | `→ brain/CHANGELOG_INTELLIGENCE.md` | `"Recent changes in → brain/CHANGELOG_INTELLIGENCE.md"` |
| Any document | SESSION_LEDGER | `→ brain/SESSION_LEDGER.md#Session-<id>` | `"File was modified (→ brain/SESSION_LEDGER.md)"` |
| Any document | SNAPSHOT | `→ brain/snapshots/<file>.md` | `"Snapshot at → brain/snapshots/2026-05-24T09-14-22-slack-timeout-fix.md"` |
| Any document | DECISION_LOG | `→ ADR-<NNN>` | `"JWT chosen over session tokens (→ ADR-007)"` |
| Any document | RUNBOOK | `→ brain/RUNBOOK.md#<procedure>` | `"Incident response (→ brain/RUNBOOK.md#Incident-DB-Connection-Saturation)"` |
| Any document | SPECIFICATION | `→ brain/SPECIFICATION.md` | `"Detailed spec at → brain/SPECIFICATION.md"` |

### P7.2 — Cross-Reference Rules

- All cross-references must use the exact format above. No custom formats.
- Cross-references to specific sections use hash fragments: `→ brain/ARCHITECTURE.md#Layers`.
- Cross-references to ADRs use the `ADR-<NNN>` identifier, not a file path.
- Cross-references must be verified to point to existing documents or identifiers. Broken references fail validation.
- Circular references are permitted but must be meaningful — document A references B, B references A only if both contain distinct information.
- Cross-references should add context: `"Decision to use PostgreSQL (→ ADR-012) was driven by query complexity requirements"` — the reference is not a substitute for explanation.
- ADRs within DECISION_LOG can reference other ADRs within the same document using the same `ADR-<NNN>` format.

### P7.3 — Cross-Reference Verification

During validation:
1. Extract all cross-references using regex: `→\s+(brain/[\w./-]+\.md|ADR-\d{3})`.
2. For file references: verify file exists at the specified path.
3. For hash fragments: verify the target section heading exists in the target file.
4. For ADR references: verify the ADR number exists in DECISION_LOG.md.
5. Any unreachable reference produces a HARD BLOCK failure.

---

## P8 — OUTPUT FORMAT PATTERNS

### P8.1 — Full Document Generation Output

When generating a new brain document, the output follows this format:

```
<frontmatter>
# <Title>

## Section 1
<content>

## Section 2
<content>
...
```

**Generation confirmation output:**

```
DOCUMENT GENERATED: <path>
TYPE: <B1-B12>
SECTIONS: <count> — <all present>
FRONTMATTER: <fields count>/<required> — <PASS>
COGNITIVE SUMMARY: <sentences> sentences, risk included — <PASS>
QUALITY: <PASS|WARN>
```

### P8.2 — Document Update Output

When updating an existing document, the output shows the diff:

```
DOCUMENT UPDATED: <path>
VERSION: <old> → <new>
CHANGES:
  + <added section or field>
  ~ <modified section or field>
  - <removed section or field>
VERSION INCREMENT: <reason>
  - <reason 1>
  - <reason 2>
```

### P8.3 — Validation Output

```
DOCUMENT: <path>
SCHEMA: <B1-B12>
SCHEMA VERSION: <declared> (latest: <latest>)
REQUIRED SECTIONS: <count>
MISSING: <list> | PRESENT: <all>
QUALITY: <PASS|WARN|FAIL>
  Frontmatter: <fields> | <STATUS>
  Cognitive Summary: <length>/1 para | <PASS|WARN>
  Placeholders: <count> | <STATUS>
  Tables: <count> | <STATUS>
  Cross-references: <valid>/<total> | <STATUS>
  S14 words: <count> | <STATUS>
```

**Validation result codes:**
- `PASS`: All quality gates pass. Document is schema-compliant.
- `WARN`: Tier 2 gates fail but Tier 1 passes. Document is usable but has quality issues.
- `FAIL`: One or more Tier 1 gates fail. Document must be corrected.

### P8.4 — Batch Validation Output

```
SCHEMA VALIDATION — <timestamp>
────────────────────────────────
<path> — B1 — v2.0.0 — PASS
<path> — B2 — v2.0.0 — PASS
<path> — B3 — v1.0.0 — WARN (schema outdated: v2.0.0 available)
<path> — B10 — v1.0.0 — FAIL (missing: Required sections)

SUMMARY:
  PASS: <count>
  WARN: <count>
  FAIL: <count>
  TOTAL: <count>
```

### P8.5 — Snapshot Generation Output

```
SNAPSHOT GENERATED: brain/snapshots/<timestamp>-<name>.md
PRECEDING STATE: brain/CURRENT_STATE.md (updated → version <new>)
FEATURE LOG ENTRY: brain/FEATURE_LOG.md#Feature-<name> (created/updated)
SNAPSHOT STATUS: snapshot (immutable — never update)
RELATED ADR: → ADR-<NNN> (if applicable)
```

---

## P9 — DOCUMENT GENERATION TRIGGERS AND MAINTENANCE CADENCE

### P9.1 — Generation Triggers

| Document | Trigger | Action |
|---|---|---|
| CURRENT_STATE | Initial project scan | Generate all 7 sections from codebase analysis |
| CURRENT_STATE | Module added/removed | Update Major Modules, Entry Points, Risks |
| CURRENT_STATE | Contract modified | Update Important Contracts, Risks |
| CURRENT_STATE | Architecture change | Update Active Architecture, Invariants |
| SYSTEM_MAP | New external integration | Add integration, update Data Flow, add SLA row |
| SYSTEM_MAP | Deployment model changes | Rewrite Overview, Boundaries, Data Flow |
| ARCHITECTURE | New service deployed | Add service, update layers, assess failure modes |
| ARCHITECTURE | Failure mode discovered | Add row to Failure Modes table |
| MODULE_MAP | Codebase structure scan | Regenerate Module List from directory structure |
| MODULE_MAP | Module ownership change | Update Ownership table, Responsibilities |
| API_CONTRACTS | New endpoint added | Add endpoint with request/response schema, error cases |
| API_CONTRACTS | Auth scheme changed | Update Auth section, all endpoint auth fields |
| FEATURE_LOG | Feature merged to main | Create entry, reference snapshot |
| CHANGELOG_INTELLIGENCE | Meaningful commit/PR | Create entry with impact analysis |
| CHANGELOG_INTELLIGENCE | Breaking change detected | Flag with migration path |
| SESSION_LEDGER | Session start | Initialize session entry |
| SESSION_LEDGER | Tool call executed | Append ledger row |
| SESSION_LEDGER | Session end | Write aggregate risk, Cognitive Summary |
| SNAPSHOT | Before significant change | Capture all 10 sections, link to CURRENT_STATE |
| SNAPSHOT | Migration execution | Record before/after state |
| DECISION_LOG | Architecture decision made | Draft ADR in proposed state |
| DECISION_LOG | ADR status change | Transition ADR to appropriate state |
| RUNBOOK | System deployed | Create runbook with procedures |
| RUNBOOK | Incident occurs | Add/update incident response procedures |
| RUNBOOK | New dependency added | Add recovery procedures |
| SPECIFICATION | Component design starts | Draft specification in draft state |
| SPECIFICATION | Implementation diverges | Update specification or mark as superseded |

### P9.2 — Maintenance Cadence

| Cadence | Documents | Action |
|---|---|---|
| Every session | CURRENT_STATE, MODULE_MAP | Verify accuracy against codebase. Update version. |
| Every session | SESSION_LEDGER | Append rows during session. Write summary at end. |
| Every session | DECISION_LOG | Review proposed ADRs. Resolve stale proposals. |
| Every session | SNAPSHOT (pre-change) | Create before making significant changes. |
| Every session | ARCHITECTURE (if changed) | Update if services, layers, or failure modes changed. |
| Every session | CHANGELOG_INTELLIGENCE | Add entry for each meaningful change. |
| Per feature | FEATURE_LOG | Add entry when feature is complete. |
| Per feature | SPECIFICATION | Draft before implementation if feature is complex. |
| Per deployment | RUNBOOK | Verify procedures are current. Add rollback steps. |
| Per incident | RUNBOOK | Add/update incident response section. |
| Per external integration | SYSTEM_MAP, API_CONTRACTS | Add integration details, contracts, SLA. |
| Per decision | DECISION_LOG | Draft ADR. Resolve within 2 sessions. |
| Monthly (or per audit) | All documents | Full schema validation pass. Identify drift. |
| Quarterly | All documents | Review for archiving. Move inactive snapshots to archive. |

### P9.3 — Session Start Checklist

At every session start, the following documents should be reviewed:

1. `CURRENT_STATE.md` — is it current? Update if modules, contracts, or risks changed since last session.
2. `MODULE_MAP.md` — scan for new or removed directories.
3. `DECISION_LOG.md` — resolve any ADRs still in `proposed` state.
4. `RUNBOOK.md` — is there a pending procedure update from a recent incident?
5. `ARCHITECTURE.md` — did the architecture change?
6. `CHANGELOG_INTELLIGENCE.md` — are there unreported commits since last session?

### P9.4 — Session End Checklist

At every session end, verify:

1. `SESSION_LEDGER.md` — final entry written with aggregate risk and Cognitive Summary.
2. `CURRENT_STATE.md` — version incremented if changes were made.
3. `SNAPSHOT.md` — created before changes if applicable.
4. `FEATURE_LOG.md` — updated if a feature was completed.
5. `CHANGELOG_INTELLIGENCE.md` — updated if meaningful changes were made.
6. `DECISION_LOG.md` — any new ADRs drafted or transitioned.
7. Cross-references verified — no broken links introduced.

---

## P10 — QUALITY GATES

### P10.1 — Tier 1 — Hard Block

These gates must all pass. Any failure blocks the document from being accepted.

- [ ] Frontmatter present with all required fields (P2.2.1)
- [ ] No placeholder content ([TBD], [TODO], [FIXME], `???`)
- [ ] All required sections present per document schema (P3.x)
- [ ] Cognitive Summary: one paragraph, includes primary risk
- [ ] No S14 prohibited words anywhere in document
- [ ] No invented or assumed context — every statement verifiable against codebase
- [ ] Snapshot is never updated — new snapshot created with new timestamp
- [ ] All cross-references point to existing documents or identifiers
- [ ] Document type matches declared type in frontmatter
- [ ] Frontmatter dates valid — created ≤ updated, neither in future

### P10.2 — Tier 2 — Standard

These gates should pass. Warnings are generated for failures but documents are usable.

- [ ] Tables have no empty cells — unknown values use `"Unknown"` or `"Not specified"`
- [ ] Cognitive Summary includes extension path
- [ ] Breaking changes include migration path
- [ ] Date formats consistent (ISO 8601 — YYYY-MM-DD)
- [ ] Risks sorted by severity (CRITICAL → HIGH → MEDIUM → LOW → NONE)
- [ ] No duplicate information across sections
- [ ] External references point to existing files
- [ ] ADR lifecycle states valid and consistent
- [ ] Tables sorted by meaningful column
- [ ] Abbreviations defined on first use
- [ ] Section order matches schema exactly
- [ ] No empty sections — each section has substantive content
- [ ] SNAPSHOT status is `"snapshot"` not `"active"`
- [ ] SNAPSHOT filename timestamp matches frontmatter `created` field

### P10.3 — Tier 3 — Excellence

These gates are aspirational. Failure does not generate warnings but is tracked for improvement.

- [ ] Cognitive Summary includes specific risk mitigation reference
- [ ] Every risk has an owner or linked ticket
- [ ] All code references include line numbers
- [ ] ADR has at least 2 genuine alternatives considered
- [ ] SPECIFICATION requirements all have verification methods
- [ ] RUNBOOK procedures include expected durations
- [ ] DECISION_LOG Compliance section has automated enforcement where feasible
- [ ] SNAPSHOT Data Flow includes before/after ASCII diagram
- [ ] ARCHITECTURE Failure Modes each reference a RUNBOOK procedure

### P10.4 — Self-Audit Template

```
Frontmatter complete?                    → yes | no
  title: <value>
  type: <value>
  status: <value>
  created: <value>
  updated: <value>
  version: <value>
  owner: <value>
No placeholders?                         → yes | no
All required sections present?           → yes | no
  Missing: <list>
Cognitive Summary valid?                 → yes | no
  Paragraphs: <count> (must be 1)
  Risk included: yes | no
  S14 words: <count> (must be 0)
  Contradictions: yes | no
No invented context?                     → yes | no
Cross-references valid?                  → yes | no
  Broken: <list>
Tables complete (no empty cells)?        → yes | no
Risks sorted by severity?                → yes | no
Version appropriate for change?          → yes | no
Schema version current?                  → yes | no
```

---

## P11 — DOCUMENT ANTI-PATTERNS

| Anti-Pattern | Why It Fails | Correct |
|---|---|---|
| Placeholder content ([TBD], [TODO], [FIXME]) | Not verifiable, incomplete | State `"Unknown"` or fill with verified data |
| Prose padding | Tokens wasted, key info diluted | Compact bullets and tables |
| Missing Cognitive Summary | No architectural overview | Write one paragraph with primary risk |
| Summary contradicts body | Reader can't trust document | Summary must agree with all sections |
| Invented module names | Fabrication per Domain 1 | Only list modules shown in codebase |
| Orphan snapshot (no CURRENT_STATE) | Snapshot has no context | Always update CURRENT_STATE first |
| Overwriting snapshot | Loses history | Create new snapshot with new timestamp |
| Inconsistent date formats | Hard to parse automatically | Always YYYY-MM-DD (ISO 8601) |
| Missing frontmatter | Fails automated validation | Always include: title, type, status, created, updated, version, owner |
| Async risk notation | `"May be affected"` for known breaks | Use direct statements: `"Removing X breaks Y"` |
| Empty sections | Incomplete document | Either fill or remove the section |
| Outdated risks | Risks from 6 months ago still listed | Review and update risks each session |
| ADR without alternatives | Not a real decision — no trade-off analysis | Include at least 2 genuine alternatives with rejection reasons |
| ADR stuck in proposed | Decision not made for 3+ sessions | Resolve: accept, deprecate, or supersede |
| Broken cross-references | Dead links reduce trust | Verify all → references point to existing docs |
| Spec without verification | Requirement can't be tested | Add verification method to every requirement |
| Runbook without durations | Can't estimate incident response time | Add expected duration to each procedure step |
| Feature log without snapshot link | No immutable record of pre-change state | Create snapshot before writing feature log entry |
| Duplicate information across docs | Drift when one copy is updated | Cross-reference instead of duplicating |
| Schema version not updated | Can't detect outdated documents | Increment version when content changes meaningfully |
| Invention in place of `"Unknown"` | Fabricates false knowledge | Write `"Unknown"` — honesty is required |
| Mixing modules and services | Terminology confusion creates ambiguity | Use consistent terminology per document type |
| Section order differs from schema | Automated validators fail sections check | Match section order exactly to schema |
| ADR lifecycle inconsistency | Supersedes/superseded_by mismatch | Verify bidirectional ADR references |

---

## P12 — EXAMPLES

### Example 1: Generate CURRENT_STATE.md on first scan

Read all modules, detect entry points, identify contracts, assess risks. Write all 7 required sections.

```
Cognitive Summary:
taskflow-api is a Node.js modular monolith serving task and project management via REST,
with async side effects (email, webhooks) handled by BullMQ workers. The main risk
surfaces are: the JWT secret startup gap (silent crash on misconfigured deploy), the
synchronous Slack call in the integrations module (user-facing timeout risk), and the
absent dead-letter queue in notifications (silent email loss). The DB schema is tightly
coupled — the tasks and users tables are referenced across four modules, making
schema changes system-wide events. Extension is safest by adding new queue processors
or new route modules that follow the established pattern. The JWT payload shape is the
most fragile contract in the system — 12 guards consume it directly.
```

### Example 2: Update CHANGELOG_INTELLIGENCE after a FIX

Record the fix commit, what layer changed (payment service), whether it was breaking (no), affected modules (2: payment API, webhook handler), risks (MEDIUM — webhook retry logic changed, verify idempotency), follow-up (add integration test for webhook duplicate detection).

```
## Commit: a1b2c3d — 2026-05-24

### Summary
Fixed payment webhook retry logic in the webhook handler — retries were
not respecting idempotency keys, causing duplicate payments under retry.
Layer: payment-service.

### Impact
- **Layer changed:** Payment Service
- **Breaking?** No — payload shape unchanged
- **Affected modules:** payment-api, webhook-handler
- **Downstream risk:** MEDIUM — webhook retry path changed

### Affected Areas
| File/Module | Change Type | Risk |
|---|---|---|
| src/webhooks/payment.handler.ts | modified | MEDIUM |
| src/payments/idempotency.ts | modified | LOW |

### Risks
- MEDIUM — Retry idempotency change may affect webhook duplicate detection

### Follow-Up
- [ ] Add integration test for webhook duplicate detection with retry
```

### Example 3: Create snapshot for DB migration

Fill all 10 sections. Metadata includes commit SHA. Systems affected: user service, migration 042.

```
## Metadata
- **Timestamp:** 2026-05-24T14:30:00Z
- **Commit:** e5f6g7h
- **Branch:** feature/org-id-migration
- **Author:** jane.doe
- **PR:** https://github.com/org/repo/pull/234

## Purpose
Add org_id column to users table for multi-tenant data isolation.
Required for enterprise tier deployment.

## Systems Affected
- `src/users/` — user service (model, repository, controller)
- `src/infra/` — migration 042 (new migration script)
- `src/auth/` — org-scoped token claims

## Architecture Changes
- New column `org_id` on `users` table (nullable, foreign key to `organizations`)
- Dual-write pattern during migration: old code writes to both old and new schema

## Data Flow
Before: `POST /users` → INSERT into users (name, email)
After:  `POST /users` → INSERT into users (name, email, org_id)

## Dependencies Added
None — schema change only, no new services or libraries.

## Extension Points
- org-scoped API keys
- tenant-level rate limiting
- per-org data retention policies

## Risks Introduced
| Level | Risk | Affected Module | Mitigation |
|---|---|---|---|
| CRITICAL | Rollback requires reverting code + migration | users | Feature-flag controlled; dual-write during cutover |
| HIGH | Orphan rows if org_id FK constraint fails | users | Validate org_id exists before insert |
| MEDIUM | Performance impact on users table index | users | Add index concurrently, monitor query plans |

## Breaking Changes
None — additive change only. org_id is nullable for backward compatibility.

## Cognitive Summary
Add org_id to users table with dual-write migration path. Risk is CRITICAL during cutover window — rollback requires coordinated code revert and migration rollback. Extension path enables tenant isolation for enterprise tier. No breaking changes: existing rows get NULL org_id and continue functioning.
```

### Example 4: ADR — Technology Choice

```
## ADR-007: JWT over Session Tokens — 2026-04-15
Status: accepted
Supersedes: None
Superseded By: None

### Context
The system needs stateless authentication to support horizontal
scaling of API servers without a shared session store. Session
tokens would require Redis as a centralized session store,
adding latency and a single point of failure.

### Decision
Use JWT (RS256) for API authentication. Tokens contain user ID,
role, and org_id in the payload. Access token TTL: 15 minutes.
Refresh token TTL: 7 days. Tokens are issued by the auth service
and verified by all services via public key.

### Alternatives Considered
| Alternative | Reason Rejected |
|---|---|
| Session tokens (opaque) | Requires centralized Redis — adds failure point and 2-5ms lookup latency per request |
| API Key per service | No user-level auth granularity — can't support per-user permissions |

### Consequences
- **Positive:** Stateless auth — servers scale horizontally without session affinity
- **Negative:** Token revocation requires an allowlist or short TTL
- **Risks:** MEDIUM — revoked users remain authorized until token expires

### Compliance
- **Enforced by:** Code review — new services must use auth middleware with JWT verification
- **Verification:** CI pipeline checks that auth middleware is applied to all non-public routes
```

### Example 5: Runbook Procedure

```
### Procedure: Database Connection Pool Saturation
**Duration:** 15 minutes
**Risk:** CRITICAL

1. SSH to bastion host — `ssh bastion-1.internal` (30s)
2. Connect to PostgreSQL — `psql -h $DB_HOST -d $DB_NAME` (10s)
3. Check active connections — `SELECT count(*) FROM pg_stat_activity WHERE state = 'active';` (5s)
4. Identify blocking queries — `SELECT pid, query, state, age(now(), query_start) FROM pg_stat_activity WHERE wait_event IS NOT NULL;` (10s)
5. Terminate runaway query — `SELECT pg_terminate_backend(<pid>);` (5s)
6. Restart connection pool — `kubectl rollout restart deployment/api-gateway` (2min)
7. Verify — check `GET /health` returns 200 and active connections < threshold (30s)

**Verify:** Run step 3 — active connections should return to baseline. Confirm `GET /health` passes.
```

### Example 6: Specification Requirements Table

```
| ID | Requirement | Priority | Verification |
|---|---|---|---|
| REQ-001 | Payment processing completes within 500ms P99 | P0 | Test: load test in CI at 1000 req/s |
| REQ-002 | All PII fields encrypted at rest (AES-256) | P0 | Inspection: schema + migration review |
| REQ-003 | Audit log retains 90 days with daily rotation | P1 | Test: retention cron job verification |
| REQ-004 | Webhook delivery retries up to 3 times with exponential backoff | P1 | Test: integration test with simulated failure |
| REQ-005 | API rate limit: 1000 req/min per API key | P1 | Test: rate limiter unit test |
| REQ-006 | Users can export their data in JSON format within 5 minutes of request | P2 | Test: E2E export flow |
```

---

## P13 — FRONTMATTER FIELD DEFINITIONS (COMPLETE REFERENCE)

### P13.1 — Field Type Catalog

| Field | Type | Allowed Values | Description |
|---|---|---|---|
| title | string | Any text | Human-readable document name. Format: `<Descriptor> — <System>` |
| type | enum | `cognitive-memory`, `reference`, `snapshot`, `decision-log`, `runbook`, `specification` | Document category. Determines schema rules. |
| status | enum | `active`, `archived`, `draft`, `proposed`, `deprecated`, `superseded`, `snapshot` | Document lifecycle state |
| created | date | YYYY-MM-DD | ISO 8601 date of first creation. Immutable after creation. |
| updated | date | YYYY-MM-DD | ISO 8601 date of last modification. Updated on each content change. |
| version | semver | `major.minor.patch` | Document content version. Increment on meaningful changes. |
| owner | string | Team, person, or `"unowned"` | Responsible party. Cannot be empty. |
| tags | list[string] | Lowercase, hyphen-delimited | Classification tags for discovery and filtering |
| branch | string | Git branch name | Current branch at time of document update |
| commit | string | Git SHA | Current commit at time of document update |
| repo | string | `org/repo` or URL | Repository identifier for multi-repo setups |
| scale | enum | `SMALL`, `MEDIUM`, `LARGE`, `MEGA` | Project scale classification per project-scales plugin |
| supersedes | string | Document path or ADR-NNN | Reference to document replaced by this one |
| superseded_by | string | Document path or ADR-NNN | Reference to document that replaces this one |
| related | list[string] | Document paths or ADR-NNN | Related documents for cross-reference |
| template | string | Template name | Name of template used to scaffold the document |
| expires | date | YYYY-MM-DD | Date after which document should be reviewed or regenerated |
| schema_version | semver | `major.minor.patch` | Schema version this document conforms to |

### P13.2 — Field Validation Rules

**title:**
- Must not be empty.
- Must be unique within the repository (no two brain documents with the same title).
- Colon in title is allowed only after a document type prefix: `"Current State — my-api"`.
- Must not contain markdown formatting characters.

**type:**
- Must match exactly one of the enum values. No aliases.
- `cognitive-memory` for B1-B8 documents.
- `snapshot` for B9 documents.
- `decision-log` for B10 documents.
- `runbook` for B11 documents.
- `specification` for B12 documents.
- `reference` for non-brain reference documents.

**status:**
| Document Type | Allowed Status Values |
|---|---|
| cognitive-memory | `active`, `archived`, `draft` |
| snapshot | `snapshot` only |
| decision-log | `active`, `archived` (document level); ADR entries: `proposed`, `accepted`, `deprecated`, `superseded` |
| runbook | `active`, `archived`, `draft` |
| specification | `draft`, `active`, `deprecated`, `superseded` |
| reference | `active`, `archived` |

**version:**
- Must match regex: `^\d+\.\d+\.\d+$`.
- Starting version is always `1.0.0`.
- Major increment: structural change (section added/removed, schema_version change).
- Minor increment: content added or modified, no structural change.
- Patch increment: typos, formatting, metadata updates.
- Version must never decrease. If reverting content, increment version forward.

**created:**
- Must be a valid ISO 8601 date (YYYY-MM-DD).
- Must not be in the future (allow 1-day tolerance for timezone).
- Must never change after initial creation. Use `updated` for subsequent changes.

**updated:**
- Must be a valid ISO 8601 date (YYYY-MM-DD).
- Must not be before `created`.
- Must not be in the future (allow 1-day tolerance for timezone).
- Must be updated whenever document content changes.

**owner:**
- Must not be empty. Use `"unowned"` if owner is not known — never leave blank or omit.
- Should be a team name or individual identifier. Format: `team-name` or `person-name`.
- Must match the ownership conventions used in MODULE_MAP.md.

**tags:**
- List format: each tag is a separate `- tag-name` entry.
- Tags must be lowercase with hyphens for multi-word: `api-contracts`, `decision-log`.
- No spaces in tag values. No special characters except hyphens.
- Tag values must be documented in the project's tag taxonomy if one exists.

**supersedes / superseded_by:**
- Must reference an existing document path relative to repo root or an ADR number.
- Bidirectional consistency required: if A supersedes B, B must reference A in superseded_by.
- Format: `brain/DECISION_LOG.md#ADR-042` for ADRs or `brain/SPECIFICATION.md` for documents.
- Deletion of a superseded document requires updating all references that point to it.

**schema_version:**
- Introduced in schema v2.0.0. Documents at v1.0.0 may omit this field (assumed 1.0.0).
- New documents must include schema_version set to the current schema version.
- Must be updated when migrating to a new schema major version.

---

## P14 — DOCUMENT RETENTION AND ARCHIVAL

### P14.1 — Retention Policy

| Document Type | Active Retention | Archive After |
|---|---|---|
| CURRENT_STATE | Always active — one per repo | Never archived |
| SYSTEM_MAP | Always active — one per repo | Never archived |
| ARCHITECTURE | Always active — one per repo | Never archived |
| MODULE_MAP | Always active — one per repo | Never archived |
| API_CONTRACTS | Always active — one per repo | Never archived |
| FEATURE_LOG | Always active — one per repo | Never archived |
| CHANGELOG_INTELLIGENCE | Always active — one per repo | Never archived |
| SESSION_LEDGER | Active — one per repo | Archived after 30 days or 100 sessions |
| SNAPSHOT | Active | Archived when superseded by 3+ newer snapshots |
| DECISION_LOG | Always active — one per repo | Never archived (ADRs may be deprecated/superseded in place) |
| RUNBOOK | Always active — one per repo | Never archived |
| SPECIFICATION | Active while component exists | Archived when component is removed or replaced |

### P14.2 — Archive Procedure

1. Move document to `brain/archive/<original-path>` preserving directory structure.
2. Update frontmatter `status` to `archived`.
3. Update any cross-references in active documents to reflect the archive location.
4. Add archive metadata: `archived: YYYY-MM-DD`, `archived_by: <owner>`.
5. Create a note in FEATURE_LOG.md if the archived document represents a significant loss of documentation.

### P14.3 — Archive Directory Structure

```
brain/
  archive/
    snapshots/
      2026-01-01T00-00-00-old-migration.md
      2026-02-15T10-30-00-feature-x.md
    SPECIFICATION-old-component.md
    SESSION_LEDGER-2026-Q1.md
```

---

**Synarc S14 language rules, S15 reference files, S16 negative prompt rules, S17 zero-tolerance violations apply. All brain files must follow these schemas without deviation. Schema version 2.0.0 — introduced DECISION_LOG (B10), RUNBOOK (B11), SPECIFICATION (B12), ADR lifecycle, cross-referencing, frontmatter field definitions, and generation triggers.**
