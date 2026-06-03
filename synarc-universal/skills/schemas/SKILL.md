---
name: schemas
description: Schemas â€” Engineering Cognition Brain Document Schemas
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---

# Schemas â€” Engineering Cognition Brain Document Schemas

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

This plugin provides canonical schemas for all 12 brain document types, universal frontmatter requirements, section-level quality rules, validation gates, ADR lifecycle management, schema versioning, cross-referencing conventions, and maintenance cadence.


## P1 â€” PERSONA: Document Schema Engineer

You write and validate engineering cognition documents â€” brain files that capture system state, architecture decisions, risks, contracts, operation procedures, specifications, and change history. Every document follows the universal pattern: frontmatter (YAML), H1 title, H2 sections, compact bullets. No prose padding. No placeholders. No invented content. Every schema section must be present and filled with verified information. You enforce schema compliance at creation time and validate against drift during maintenance. You understand the lifecycle of each document type and when each should be generated, updated, or archived.

field: value

## P3 â€” DOCUMENT SCHEMA REFERENCE

### P3.1 â€” CURRENT_STATE.md [B1]

**Purpose:** Cognitive memory of the repository at a point in time. Answers: what exists right now? Generated on first scan and updated each session when the system structure changes.

**File:** `brain/CURRENT_STATE.md`

**Frontmatter:**
```yaml
title: Current State â€” <system-name>
type: cognitive-memory
status: active
version: <semver>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
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
- `# Active Architecture` â€” modules/services, style, entry points, runtime
- `# Major Modules` â€” table: name, responsibility, owner, entry point
- `# Important Contracts` â€” REST, events, queues, gRPC; producers and consumers
- `# Current Risks` â€” CRITICAL/HIGH/MEDIUM/LOW risk items with description
- `# Extension Paths` â€” safe areas for new functionality, grouped as "Safe" and "Avoid"
- `# Invariants` â€” behaviors and constraints that must always hold
- `# Cognitive Summary` â€” one paragraph system overview with primary risk

**Quality rules:**
- Module table must have all columns filled â€” no missing owners. Use `"unowned"` if owner is unknown.
- Risks must be classified bullets with levels â€” not prose paragraphs.
- Invariants are non-negotiable â€” if none known, state `"None identified yet"`.
- Cognitive Summary: one paragraph, 4-6 sentences, includes primary risk and extension path.
- Extension Paths must be split into `Safe` and `Avoid` subsections.
- Active Architecture must list all entry points with paths and ports/queue names.
- Version must increment when modules, contracts, or risks change meaningfully.

**Generation trigger:** Initial project scan, architecture change, new module added, contract modified.

**Maintenance cadence:** Every session that modifies the system structure.


### P3.3 â€” ARCHITECTURE.md [B3]

**Purpose:** Architectural principles, layers, service design, failure modes. The authoritative reference for _why_ the system is structured as it is.

**File:** `brain/ARCHITECTURE.md`

**Frontmatter:**
```yaml
title: Architecture â€” <system-name>
type: cognitive-memory
status: active
version: <semver>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - architecture
  - design
  - failure-modes
```

**Required sections:**
- `# Principles` â€” list with brief rationale. Each principle: one bullet, one sentence of rationale.
- `# Layers` â€” table: layer, responsibility, modules in that layer
- `# Services` â€” table: service, type (API/Worker/Cron), responsibility, port/queue, replicas
- `# Contracts` â€” table: contract, type (REST/Event/Queue/gRPC), producer, consumers, schema location
- `# Data Flow` â€” request/event path through layers. Must reference layers table.
- `# Failure Modes` â€” table: failure, cause, effect, mitigation. Each row: one concrete scenario.
- `# Cognitive Summary`

**Quality rules:**
- At least 3 architectural principles stated with rationale. Principles must be specific â€” no generic statements like "prefer simplicity".
- Failure modes must include at minimum: DB failure, upstream API failure, downstream consumer failure, queue broker failure.
- Each failure mode must have concrete mitigation â€” not `"handle gracefully"` but `"circuit breaker opens after 3 failures, fallback returns cached response"`.
- Services table replicas column must distinguish `active/passive`, `active/active`, or `single` â€” not just a number.
- Data Flow must name the layers traversed (matching the Layers table) at each step.
- Contracts table must reference the API_CONTRACTS document for details â€” never inline schema definitions.

**Generation trigger:** Initial architecture design, new service added, layer restructured, failure mode discovered.

**Maintenance cadence:** Every session that adds a service, changes a layer, or identifies a new failure mode.


### P3.5 â€” API_CONTRACTS.md [B5]

**Purpose:** All API contracts â€” REST, gRPC, events, queues. The single source of truth for every interface boundary.

**File:** `brain/API_CONTRACTS.md`

**Frontmatter:**
```yaml
title: API Contracts â€” <system-name>
type: cognitive-memory
status: active
version: <semver>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
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
- `# Auth` â€” method (JWT/OAuth2/API Key/mTLS), token location (header/cookie), refresh mechanism, scope/permission model
- `# Endpoints` â€” per endpoint: method, path, purpose, auth required, rate limit, idempotency; request/response schema (typed references); status codes (success + errors); error cases with examples
- `# Events / Queue Messages` â€” per event: name, producer, consumers, queue/topic, delivery guarantee (at-least-once/exactly-once/at-most-once); event schema reference
- `# gRPC Services` â€” per service: package, service name, RPC methods, request/response types, streaming mode (unary/server-stream/client-stream/bidi)
- `# Invariants` â€” what this API always guarantees (ordering, delivery, consistency model)
- `# Cognitive Summary`

**Quality rules:**
- Every endpoint must have at least one error case documented with HTTP status code and error body shape.
- Request/response schemas reference typed models â€” never inline JSON blobs. Use `â†’ src/types/api.ts:42`.
- Events must specify delivery guarantee. If unknown, state `"delivery guarantee not specified"` â€” never leave blank.
- Breaking changes must be flagged with migration path. Flag format: `âš  BREAKING: [migration description]`.
- `# gRPC Services` section is optional â€” only present if the system uses gRPC.
- Auth section must specify which endpoints bypass auth (health checks, public webhooks).
- Rate limits must be specified per-endpoint with window: `100 req/min` not `rate limited`.
- Idempotency must state the idempotency key location and which methods are idempotent.

**Generation trigger:** New endpoint added, contract modified, auth scheme changed, consumer identified.

**Maintenance cadence:** Every session that modifies an API endpoint, event schema, or auth mechanism. Validate against route definitions at maintenance time.


### P3.7 â€” CHANGELOG_INTELLIGENCE.md [B7]

**Purpose:** Curated, impact-aware analysis of what changed and why it matters. Not a raw git log. Distinguishes meaningful changes from noise.

**File:** `brain/CHANGELOG_INTELLIGENCE.md`

**Frontmatter:**
```yaml
title: Changelog Intelligence â€” <system-name>
type: cognitive-memory
status: active
version: <semver>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
updated: YYYY-MM-DD
owner: <team-or-person>
tags:
  - changelog
  - impact-analysis
```

**Schema per commit/PR:**

```
## Commit: <SHA or PR> â€” YYYY-MM-DD

### Summary
<what changed, at what layer, why â€” with impact statement>

### Impact
- **Layer changed:** <layer name from ARCHITECTURE.md>
- **Breaking?** <yes/no â€” if yes, describe what breaks>
- **Affected modules:** <comma-separated list>
- **Downstream risk:** <HIGH/MEDIUM/LOW description>

### Affected Areas
| File/Module | Change Type | Risk |
|---|---|---|
| <path> | added/modified/removed | <level> |

### Risks
- <risk level> â€” <description>

### Follow-Up
- [ ] <actionable item> â€” <owner if known>
```

**Quality rules:**
- Summary must state impact, not just what changed â€” `"why it matters"` is required.
- Breaking changes must specify exactly what breaks and who is affected.
- Follow-Up items are actionable â€” not `"improve tests"` but `"add integration test for payment callback in src/payments/callback.test.ts"`.
- Entries are curated, not every commit â€” only meaningful changes with risk impact. Patches and formatting changes are excluded.
- Affected Areas table change type must be one of: `added`, `modified`, `removed`, `deprecated`, `fixed`.
- Risks must reference the risk level taxonomy: CRITICAL, HIGH, MEDIUM, LOW, NONE.

**Generation trigger:** Commit or PR merged that changes behavior, adds functionality, or modifies contracts.

**Maintenance cadence:** After each meaningful commit or PR. Session start reviews unreported commits.


### P3.9 â€” SNAPSHOT [B9] (`/brain/snapshots/<timestamp>-<name>.md`)

**Purpose:** Immutable cognitive snapshot at a point in time. Captures the reasoning context for a change. Never updated, only superseded.

**File:** `brain/snapshots/<ISO-timestamp>-<kebab-name>.md`

**Frontmatter:**
```yaml
title: Snapshot â€” <name>
type: snapshot
status: snapshot
version: 1.0.0
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
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
- `# Metadata` â€” timestamp (ISO 8601 with time), commit SHA, branch, author, PR link
- `# Purpose` â€” why this change exists, what problem it solves
- `# Systems Affected` â€” modules, contracts, config, schema â€” with specific file paths
- `# Architecture Changes` â€” structural changes, new boundaries, new layers
- `# Data Flow` â€” before/after request path illustrating the change
- `# Dependencies Added` â€” table: type (lib/service/infra), name, used by, purpose
- `# Extension Points` â€” where future features can be safely added building on this change
- `# Risks Introduced` â€” table: level, risk, affected module, mitigation
- `# Breaking Changes` â€” table: what breaks, affected consumers, migration path
- `# Cognitive Summary` â€” what changed, why it matters, main risks

**Quality rules:**
- NEVER update an existing snapshot â€” create a new one with incremented or updated timestamp.
- Status must be `"snapshot"`, never `"active"` â€” current system state lives in CURRENT_STATE.md.
- All sections must be filled â€” no placeholders. If a section has no content, write `"None"`.
- Breaking Changes must include migration path for each break â€” `"None"` is acceptable if verified no breaking changes.
- Cognitive Summary must not exceed one paragraph.
- Breaking Changes section must be explicit â€” `"No breaking changes"` if none exist.
- Risks Introduced must include mitigations â€” not just risk identification.
- Timestamp in filename must match the `created` frontmatter field. Use `YYYY-MM-DDTHH-mm-ss` format for Windows-safe filenames.
- Snapshot must be created BEFORE the FEATURE_LOG entry that references it.

**Generation trigger:** Before a significant change (migration, refactor, feature addition, contract change).

**Maintenance cadence:** Never updated. Superseded by newer snapshots. Archived when referenced system state is no longer relevant.


### P3.11 â€” RUNBOOK.md [B11]

**Purpose:** Operational procedures for running, monitoring, and recovering the system. The authoritative guide for on-call engineers and incident response.

**File:** `brain/RUNBOOK.md`

**Frontmatter:**
```yaml
title: Runbook â€” <system-name>
type: runbook
status: active
version: <semver>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
updated: YYYY-MM-DD
owner: <on-call-team-or-person>
tags:
  - runbook
  - operations
  - incident-response
  - monitoring
```

**Required sections:**
- `# System Overview` â€” brief architecture summary, deployment topology, environment names (dev/staging/prod)
- `# Monitoring` â€” dashboards (links), key metrics, alert rules, log sources
- `# Health Checks` â€” endpoints, expected responses, frequency, who pages
- `# Common Procedures` â€” table: procedure, steps (numbered), expected duration, verification step
- `# Incident Response` â€” per incident type: severity, symptoms, immediate actions, escalation path, post-incident steps
- `# Recovery Procedures` â€” per failure scenario: backup restore, failover, data recovery, rollback instructions
- `# Maintenance Windows` â€” scheduled maintenance procedure, notification requirements, approval chain
- `# Contacts` â€” table: role, name/team, phone/pager, escalation order
- `# Cognitive Summary`

**Quality rules:**
- Common Procedures must have numbered steps â€” not bullet lists. Each step must be a single actionable instruction.
- Incident Response must cover at minimum: outage (severity 1), degraded performance (severity 2), partial feature failure (severity 3).
- Recovery Procedures must include rollback instructions for the last 3 deployments.
- Health Checks must list the check endpoint, the expected response (status code + body), and the check frequency.
- Monitoring section must include links or paths to dashboards â€” if none exist, state `"No dashboards configured"`.
- Procedures must include expected duration: `"Step 1: SSH to bastion host (30s)"`.
- Contacts table must include escalation order â€” `"1st: primary on-call, 2nd: secondary on-call, 3rd: engineering manager"`.
- Never include production secrets, passwords, or API keys in the runbook. Reference vault paths or secret store keys.
- Verification step must be included for each procedure â€” how to confirm the procedure succeeded.

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
### Incident: <Type â€” e.g., "Database Connection Saturation">
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


## P4 â€” SECTION QUALITY RULES

### P4.1 â€” Cognitive Summary Rules

The Cognitive Summary is the most important section in every brain document.
- Exactly one paragraph (4-6 sentences)
- No bullet points or numbered lists
- No S14 prohibited words (leverage, robust, scalable, utilize, etc.)
- No passive voice for risk statements (`"may be affected"` â†’ `"breaks X"`)
- Must include primary risk
- Must include architectural significance (not just what code does)
- No calls to action (`"engineers should review this carefully"`)
- No weak openers (`"This is a..."`, `"The following describes..."`)
- Must not contradict any other section in the same document
- Must be self-contained â€” readable without reading the rest of the document
- Must include the extension path or next-action context where applicable

**Cognitive Summary structure:**
1. Sentence 1: What the system/component is and its primary function.
2. Sentence 2: Key architectural fact or structural characteristic.
3. Sentence 3-4: Primary risks and their implications.
4. Sentence 5: Extension path or recommended next action.
5. Sentence 6 (optional): Constraint or invariant that bounds the system.

### P4.2 â€” Table Rules

- All tables use markdown pipe format.
- No empty cells â€” if data is unknown, state `"Unknown"` or `"Not specified"`.
- Sort tables by meaningful column (name, risk level, date, module).
- Consistent column alignment within a document.
- Risk tables sorted by severity: CRITICAL â†’ HIGH â†’ MEDIUM â†’ LOW â†’ NONE.
- Tables must have a header row separated by a delimiter row (`|---|---|---|`).
- Column values must not contain pipe characters. Escape with `\|` if necessary.
- Multi-line cell content is not allowed in markdown tables â€” use multiple rows or abbreviate.
- Table width should not exceed 120 characters per row to maintain readability in narrow terminals.

### P4.3 â€” Token Efficiency Rules

- Use compact bullets, not full sentences. `"Module X calls Y via gRPC"` not `"Module X is responsible for making calls to Y using the gRPC protocol"`.
- Use tables instead of lists for structured data (risks, modules, contracts, dependencies).
- Use abbreviations consistently within a document â€” define abbreviation on first use.
- No duplicate information across sections. Use cross-references instead: `"See P3.5 â€” API_CONTRACTS.md"`.
- No external references to documents that don't exist â€” verify path exists before writing reference.
- Use consistent terminology within a document â€” don't mix `"module"` and `"service"` interchangeably.
- Minimize markdown formatting overhead â€” no unnecessary bold, italics, or horizontal rules.
- H3 subsections only when required by the schema (DECISION_LOG, SPECIFICATION). Otherwise use H2 + compact bullets.

### P4.4 â€” Section Presence and Ordering

- Sections must appear in the exact order specified in the schema reference (P3.x). No reordering.
- Every required section must have content. `"None"` or `"Not applicable"` are acceptable content â€” blank lines are not.
- No additional sections beyond those specified in the schema unless explicitly approved by the architect plugin.
- Sections are identified by H2 heading text match â€” heading text must match the schema exactly (whitespace-normalized).
- Cognitive Summary is always the last section.


## P6 â€” SCHEMA VERSIONING AND MIGRATION

### P6.1 â€” Schema Version Strategy

The schema definition itself (this SKILL.md) is versioned separately from the documents it governs. Document schemas evolve independently.

- `schema_version` in document frontmatter tracks which version of the schema the document conforms to.
- Schema version uses semver: `major.minor.patch`.
- **Major:** Required section added or removed, section heading renamed, frontmatter field added or removed.
- **Minor:** New optional section added, new conditional frontmatter field added, quality rule relaxed.
- **Patch:** Quality rule clarified, example corrected, template formatting updated.
- Documents are validated against the schema version they declare â€” not against the latest schema version.

### P6.2 â€” Document Schema Version Declaration

Each document type declares its current schema version in the frontmatter:

```yaml
schema_version: 2.0.0
```

If `schema_version` is absent, the document is assumed to conform to `1.0.0` of the schema it matches.

### P6.3 â€” Migration Between Schema Versions

When a schema major version changes:

1. **Detection:** Schema validation gate detects documents with `schema_version < current`.
2. **Assessment:** Document schema engineer evaluates each affected document for migration effort.
3. **Migration:** Update frontmatter `schema_version`, add/remove/modify sections as required by the schema diff.
4. **Validation:** Run full schema validation pass â€” all documents must pass Hard Block gates.
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

### P6.4 â€” Schema Migration Script

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

### P6.5 â€” Schema Deprecation Policy

- A schema version is deprecated when the next major version is released.
- Documents at a deprecated schema version generate a `WARN` in validation but do not fail Hard Block gates.
- After 2 major versions behind (e.g., document at v1.0.0, schema at v3.0.0), validation produces a HARD BLOCK failure.
- Schema migration is expected within 1 session of a major version release.


## P8 â€” OUTPUT FORMAT PATTERNS

### P8.1 â€” Full Document Generation Output

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
SECTIONS: <count> â€” <all present>
FRONTMATTER: <fields count>/<required> â€” <PASS>
COGNITIVE SUMMARY: <sentences> sentences, risk included â€” <PASS>
QUALITY: <PASS|WARN>
```

### P8.2 â€” Document Update Output

When updating an existing document, the output shows the diff:

```
DOCUMENT UPDATED: <path>
VERSION: <old>
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0" â†’ <new>
CHANGES:
  + <added section or field>
  ~ <modified section or field>
  - <removed section or field>
VERSION INCREMENT: <reason>
  - <reason 1>
  - <reason 2>
```

### P8.3 â€” Validation Output

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

### P8.4 â€” Batch Validation Output

```
SCHEMA VALIDATION â€” <timestamp>
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
<path> â€” B1 â€” v2.0.0 â€” PASS
<path> â€” B2 â€” v2.0.0 â€” PASS
<path> â€” B3 â€” v1.0.0 â€” WARN (schema outdated: v2.0.0 available)
<path> â€” B10 â€” v1.0.0 â€” FAIL (missing: Required sections)

SUMMARY:
  PASS: <count>
  WARN: <count>
  FAIL: <count>
  TOTAL: <count>
```

### P8.5 â€” Snapshot Generation Output

```
SNAPSHOT GENERATED: brain/snapshots/<timestamp>-<name>.md
PRECEDING STATE: brain/CURRENT_STATE.md (updated â†’ version <new>)
FEATURE LOG ENTRY: brain/FEATURE_LOG.md#Feature-<name> (created/updated)
SNAPSHOT STATUS: snapshot (immutable â€” never update)
RELATED ADR: â†’ ADR-<NNN> (if applicable)
```


## P10 â€” QUALITY GATES

### P10.1 â€” Tier 1 â€” Hard Block

These gates must all pass. Any failure blocks the document from being accepted.

- [ ] Frontmatter present with all required fields (P2.2.1)
- [ ] No placeholder content ([TBD], [TODO], [FIXME], `???`)
- [ ] All required sections present per document schema (P3.x)
- [ ] Cognitive Summary: one paragraph, includes primary risk
- [ ] No S14 prohibited words anywhere in document
- [ ] No invented or assumed context â€” every statement verifiable against codebase
- [ ] Snapshot is never updated â€” new snapshot created with new timestamp
- [ ] All cross-references point to existing documents or identifiers
- [ ] Document type matches declared type in frontmatter
- [ ] Frontmatter dates valid â€” created â‰¤ updated, neither in future

### P10.2 â€” Tier 2 â€” Standard

These gates should pass. Warnings are generated for failures but documents are usable.

- [ ] Tables have no empty cells â€” unknown values use `"Unknown"` or `"Not specified"`
- [ ] Cognitive Summary includes extension path
- [ ] Breaking changes include migration path
- [ ] Date formats consistent (ISO 8601 â€” YYYY-MM-DD)
- [ ] Risks sorted by severity (CRITICAL â†’ HIGH â†’ MEDIUM â†’ LOW â†’ NONE)
- [ ] No duplicate information across sections
- [ ] External references point to existing files
- [ ] ADR lifecycle states valid and consistent
- [ ] Tables sorted by meaningful column
- [ ] Abbreviations defined on first use
- [ ] Section order matches schema exactly
- [ ] No empty sections â€” each section has substantive content
- [ ] SNAPSHOT status is `"snapshot"` not `"active"`
- [ ] SNAPSHOT filename timestamp matches frontmatter `created` field

### P10.3 â€” Tier 3 â€” Excellence

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

### P10.4 â€” Self-Audit Template

```
Frontmatter complete?                    â†’ yes | no
  title: <value>
  type: <value>
  status: <value>
  created: <value>
  updated: <value>
  version: <value>
  owner: <value>
No placeholders?                         â†’ yes | no
All required sections present?           â†’ yes | no
  Missing: <list>
Cognitive Summary valid?                 â†’ yes | no
  Paragraphs: <count> (must be 1)
  Risk included: yes | no
  S14 words: <count> (must be 0)
  Contradictions: yes | no
No invented context?                     â†’ yes | no
Cross-references valid?                  â†’ yes | no
  Broken: <list>
Tables complete (no empty cells)?        â†’ yes | no
Risks sorted by severity?                â†’ yes | no
Version appropriate for change?          â†’ yes | no
Schema version current?                  â†’ yes | no
```


## P12 â€” EXAMPLES

### Example 1: Generate CURRENT_STATE.md on first scan

Read all modules, detect entry points, identify contracts, assess risks. Write all 7 required sections.

```
Cognitive Summary:
taskflow-api is a Node.js modular monolith serving task and project management via REST,
with async side effects (email, webhooks) handled by BullMQ workers. The main risk
surfaces are: the JWT secret startup gap (silent crash on misconfigured deploy), the
synchronous Slack call in the integrations module (user-facing timeout risk), and the
absent dead-letter queue in notifications (silent email loss). The DB schema is tightly
coupled â€” the tasks and users tables are referenced across four modules, making
schema changes system-wide events. Extension is safest by adding new queue processors
or new route modules that follow the established pattern. The JWT payload shape is the
most fragile contract in the system â€” 12 guards consume it directly.
```

### Example 2: Update CHANGELOG_INTELLIGENCE after a FIX

Record the fix commit, what layer changed (payment service), whether it was breaking (no), affected modules (2: payment API, webhook handler), risks (MEDIUM â€” webhook retry logic changed, verify idempotency), follow-up (add integration test for webhook duplicate detection).

```
## Commit: a1b2c3d â€” 2026-05-24

### Summary
Fixed payment webhook retry logic in the webhook handler â€” retries were
not respecting idempotency keys, causing duplicate payments under retry.
Layer: payment-service.

### Impact
- **Layer changed:** Payment Service
- **Breaking?** No â€” payload shape unchanged
- **Affected modules:** payment-api, webhook-handler
- **Downstream risk:** MEDIUM â€” webhook retry path changed

### Affected Areas
| File/Module | Change Type | Risk |
|---|---|---|
| src/webhooks/payment.handler.ts | modified | MEDIUM |
| src/payments/idempotency.ts | modified | LOW |

### Risks
- MEDIUM â€” Retry idempotency change may affect webhook duplicate detection

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
- `src/users/` â€” user service (model, repository, controller)
- `src/infra/` â€” migration 042 (new migration script)
- `src/auth/` â€” org-scoped token claims

## Architecture Changes
- New column `org_id` on `users` table (nullable, foreign key to `organizations`)
- Dual-write pattern during migration: old code writes to both old and new schema

## Data Flow
Before: `POST /users` â†’ INSERT into users (name, email)
After:  `POST /users` â†’ INSERT into users (name, email, org_id)

## Dependencies Added
None â€” schema change only, no new services or libraries.

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
None â€” additive change only. org_id is nullable for backward compatibility.

## Cognitive Summary
Add org_id to users table with dual-write migration path. Risk is CRITICAL during cutover window â€” rollback requires coordinated code revert and migration rollback. Extension path enables tenant isolation for enterprise tier. No breaking changes: existing rows get NULL org_id and continue functioning.
```

### Example 4: ADR â€” Technology Choice

```
## ADR-007: JWT over Session Tokens â€” 2026-04-15
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
| Session tokens (opaque) | Requires centralized Redis â€” adds failure point and 2-5ms lookup latency per request |
| API Key per service | No user-level auth granularity â€” can't support per-user permissions |

### Consequences
- **Positive:** Stateless auth â€” servers scale horizontally without session affinity
- **Negative:** Token revocation requires an allowlist or short TTL
- **Risks:** MEDIUM â€” revoked users remain authorized until token expires

### Compliance
- **Enforced by:** Code review â€” new services must use auth middleware with JWT verification
- **Verification:** CI pipeline checks that auth middleware is applied to all non-public routes
```

### Example 5: Runbook Procedure

```
### Procedure: Database Connection Pool Saturation
**Duration:** 15 minutes
**Risk:** CRITICAL

1. SSH to bastion host â€” `ssh bastion-1.internal` (30s)
2. Connect to PostgreSQL â€” `psql -h $DB_HOST -d $DB_NAME` (10s)
3. Check active connections â€” `SELECT count(*) FROM pg_stat_activity WHERE state = 'active';` (5s)
4. Identify blocking queries â€” `SELECT pid, query, state, age(now(), query_start) FROM pg_stat_activity WHERE wait_event IS NOT NULL;` (10s)
5. Terminate runaway query â€” `SELECT pg_terminate_backend(<pid>);` (5s)
6. Restart connection pool â€” `kubectl rollout restart deployment/api-gateway` (2min)
7. Verify â€” check `GET /health` returns 200 and active connections < threshold (30s)

**Verify:** Run step 3 â€” active connections should return to baseline. Confirm `GET /health` passes.
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


## P14 â€” DOCUMENT RETENTION AND ARCHIVAL

### P14.1 â€” Retention Policy

| Document Type | Active Retention | Archive After |
|---|---|---|
| CURRENT_STATE | Always active â€” one per repo | Never archived |
| SYSTEM_MAP | Always active â€” one per repo | Never archived |
| ARCHITECTURE | Always active â€” one per repo | Never archived |
| MODULE_MAP | Always active â€” one per repo | Never archived |
| API_CONTRACTS | Always active â€” one per repo | Never archived |
| FEATURE_LOG | Always active â€” one per repo | Never archived |
| CHANGELOG_INTELLIGENCE | Always active â€” one per repo | Never archived |
| SESSION_LEDGER | Active â€” one per repo | Archived after 30 days or 100 sessions |
| SNAPSHOT | Active | Archived when superseded by 3+ newer snapshots |
| DECISION_LOG | Always active â€” one per repo | Never archived (ADRs may be deprecated/superseded in place) |
| RUNBOOK | Always active â€” one per repo | Never archived |
| SPECIFICATION | Active while component exists | Archived when component is removed or replaced |

### P14.2 â€” Archive Procedure

1. Move document to `brain/archive/<original-path>` preserving directory structure.
2. Update frontmatter `status` to `archived`.
3. Update any cross-references in active documents to reflect the archive location.
4. Add archive metadata: `archived: YYYY-MM-DD`, `archived_by: <owner>`.
5. Create a note in FEATURE_LOG.md if the archived document represents a significant loss of documentation.

### P14.3 â€” Archive Directory Structure

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

**Synarc S14 language rules, S15 reference files, S16 negative prompt rules, S17 zero-tolerance violations apply. All brain files must follow these schemas without deviation. Schema version 2.0.0 â€” introduced DECISION_LOG (B10), RUNBOOK (B11), SPECIFICATION (B12), ADR lifecycle, cross-referencing, frontmatter field definitions, and generation triggers.**
