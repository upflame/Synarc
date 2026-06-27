---
title: Usage Guide — Synarc Universal Skill Pack
description: Comprehensive usage guide for Synarc Universal v6.6.4 (56 skills, 8 active runtimes, Cognition Mesh, Intent Contracts). Skill activation, writing new skills, referencing shared workflows, fallback tier usage, runtime compilation, and example workflows.
version: 6.6.4
schema: skill-pack/v1
---

# Usage Guide — Synarc Universal Skill Pack (v6.6.4)

## Installation

Install Synarc into your project with one command:

```bash
npm i -g synarc
```

The installer auto-detects your editor markers and writes the right per-editor file. To install for every supported editor in one shot:

```bash
synarc --target all
```

Verify the install:

```bash
synarc verify
```

See [Installation Guide](./installation.md) for the full per-editor deep dive, and the [Migration Guide](./migration-guide.md) if you are upgrading from v5.

---

## How Skills Activate

Skills use **intent-based activation**. When you describe a task, the agent matches your intent against activation conditions defined in each SKILL.md. No slash commands, no manual selection.

### Activation Flow

```text
Your intent (e.g., "Add user authentication")
  -> Agent detects intent pattern
  -> Matches against skill activation conditions
  -> Loads matching SKILL.md(s)
  -> Classification and risk assessment run
  -> Skill behavior is applied
```

### Activation Precision

- **Always-on**: `synarc-core` and `negative-prompts` are loaded on every session
- **Intent-based**: Domain skills activate only when matching intent is detected
- **Priority**: Critical skills (core, negative-prompts) load before normal-priority skills
- **Composite**: Multiple skills can be active simultaneously for cross-domain tasks
- **Mesh**: 3+ matching intents trigger the [Cognition Mesh](./advanced/mesh.md)

### Intent-to-Skill Mapping (selected)

| Your intent | Skill activated |
|---|---|
| Debug, fix error, root cause analysis | `skills/debug-engineer/SKILL.md` |
| Architecture design, system review | `skills/architect/SKILL.md` |
| Security audit, vulnerability fix | `skills/security-engineer/SKILL.md` |
| Backend development, API design | `skills/backend-engineer/SKILL.md` |
| Frontend, UI, component architecture | `skills/frontend-engineer/SKILL.md` |
| Database design, query optimization | `skills/database-architect/SKILL.md` |
| Infrastructure, deployment, CI/CD | `skills/infrastructure-engineer/SKILL.md` |
| Testing strategy, test generation | `skills/testing-strategy/SKILL.md` |
| Change analysis, risk assessment | `skills/change-intelligence/SKILL.md` |
| Session tracking, context continuity | `skills/synarc-core/SKILL.md` |
| Any engineering task | `skills/synarc-core/SKILL.md` (always active) |

For the full 56-skill mapping, see the [README](./README.md#-the-56-skills).

---

## How to Write a New Skill

### 1. Create the skill directory

```bash
mkdir -p skills/my-domain-skill/
```

### 2. Write `SKILL.md`

```markdown
---
name: my-domain-skill
title: My Domain Skill
description: Handles intent-matching for my specific domain
version: 6.6.4
schema: skill-pack/v1
category:
  - development
tags:
  - my-domain
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
priority: normal
dependencies:
  synarc-core: ">=6.0.0"
---

# My Domain Skill

## Purpose

What this skill solves — one paragraph.

## Activation Conditions

WHEN:
- user requests domain-specific work
- user mentions domain keywords

THEN:
Activate My Domain Skill

## Required Inputs

- Input context needed for this skill to function

## Capabilities

### Capability: My Capability

#### Tier 1 — Native Execution

[Agent-native workflow]

#### Tier 2 — External Integration

[If Tier 1 unavailable: external tools/APIs]

#### Tier 3 — Manual Workflow

[If Tier 2 unavailable: step-by-step instructions]

#### Tier 4 — Human-Assisted

[If all above unavailable: structured output for human review]

## Validation

Success criteria for this skill.

## Failure Handling

Edge cases and recovery procedures.

## Quality Checklist

- [ ] Check 1
- [ ] Check 2

## Security Checklist

- [ ] Security check 1
```

### 3. Create `skill.yaml`

```yaml
id: my-domain-skill
version: 6.6.4
schema: skill-pack/v1
description: Handles intent-matching for my specific domain
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
activation:
  type: intent-based
dependencies:
  synarc-core: ">=6.0.0"
```

### 4. Create `guardrails.yaml`

```yaml
guardrails:
  - id: my-skill-001
    category: scope_absorption
    severity: warn
    match:
      intent_pattern: "do something unrelated"
    action: warn
    message: "This skill is scoped to my-domain tasks."
    references: []
```

### 5. Create `CHANGELOG.md`

```markdown
# Changelog

## [1.0.0] - 2026-06-22

### Added
- Initial release
```

### 6. Register in `manifest.yaml`

Add the skill entry to `manifest.yaml`:

```yaml
- id: my-domain-skill
  path: skills/my-domain-skill/SKILL.md
  version: 6.6.4
  description: Handles intent-matching for my specific domain
  category: development
  tags: [my-domain]
  activation: intent-based
  priority: normal
  skill_type: [workflow, capability]
  dependencies:
    synarc-core: ">=6.0.0"
```

### 7. Validate

```bash
cd synarc-universal
npm run validate
```

The validator parses every `SKILL.md`, checks required fields, banned fields, `compatible_agents`, capability tier structure, reference link resolution, and existence of companion files.

---

## Core Workflows

Synarc ships canonical workflow definitions in `shared/workflows/`. Each is a deterministic procedure an agent can run. The major workflows:

### Change Classification

Classifies every change into one of 12 WorkTypes (FEATURE, FIX, REFACTOR, INCIDENT, ANALYSIS, DOCS, CONFIG, TEST, INFRA, DATA, MIGRATION, EXPERIMENT) with 7 dimension scores. See [advanced/work-types.md](./advanced/work-types.md).

### Risk Assessment

Produces a 6-level risk (INFO, LOW, MEDIUM, HIGH, CRITICAL, BLAST) using base risk + hard floors + dimension modifiers + session aggregate. See [advanced/risk-assessment.md](./advanced/risk-assessment.md).

### Intent Contracts

Agents commit to scope + promises + risk cap before execution. See [advanced/intent-contracts.md](./advanced/intent-contracts.md).

### Verification Engine

Post-execution promise check, scope diff, risk delta, composite verdict. See [advanced/verification.md](./advanced/verification.md).

### Audit & Compliance

Hash-chained audit trail with EU AI Act, SOC2, HIPAA, ISO 27001 export. See [advanced/audit.md](./advanced/audit.md).

### Context Injection

3 injection levels (COMPACT, STANDARD, FULL) tuned for prompt-cache friendliness. See [advanced/performance.md](./advanced/performance.md).

### Session Tracking

Append-only ledger of every mutation, with `synarc ledger query` for structured queries. See [advanced/session-tracking.md](./advanced/session-tracking.md).

### Quality Gates

Zero-tolerance enforcement per work type, no bypass via prompt. See [advanced/guardrails.md](./advanced/guardrails.md).

### Error Intelligence

Systematic 6-step error resolution protocol (classify, locate, assess, apply, verify, track).

---

## Examples

### Example 1: Full Feature Implementation

```text
Context: Node.js 20 REST API with Express + PostgreSQL
Task: Add user authentication
Scale: MEDIUM — team of 4, ~15k LOC, 6 modules
```

**What happens:**

1. `backend-engineer` activates for API design
2. `security-engineer` activates for auth implementation
3. `database-architect` activates for user schema design
4. 3+ skill matches -> [Cognition Mesh](./advanced/mesh.md) activates
5. Change classified as `FEATURE:PLANNED`, `MEDIUM` risk
6. Hard floor applied: auth domain -> `CRITICAL` minimum
7. Intent Contract created with auth-scoped promises
8. Quality gates require unit tests, contract tests, type check, lint
9. Session ledger tracks all file modifications
10. Verification Engine emits `pass` verdict post-execution

### Example 2: Production Incident Response

```text
Context: Production outage — payment API returning 500s
Task: Investigate and fix
Scale: LARGE — 8 teams, ~500k LOC, 40+ services
```

**What happens:**

1. `incident-commander` activates with ICS framework
2. `debug-engineer` activates for systematic root cause analysis
3. `sre-engineer` activates for SLO impact assessment
4. Change classified as `INCIDENT`, `CRITICAL` risk
5. Hard floor applied: payment domain -> `CRITICAL`
6. Error intelligence runs 6-step protocol
7. Intent Contract created with `risk_cap: CRITICAL`
8. Quality gates require RCA, monitoring gap review
9. Session checkpoint created at every risk boundary
10. Verification Engine emits verdict; if `partial`, follow-up contract created
11. Audit record appended to the chain

### Example 3: Cross-Boundary Refactoring

```text
Context: Extract shared auth logic into a common module
Task: Refactor auth middleware used by 5 services
Scale: MEDIUM — 2 teams, ~80k LOC, 3 services affected
```

**What happens:**

1. `architect` activates for system decomposition
2. `refactor` WorkType assigned with `HIGH` risk (public API)
3. Hard floor: auth domain -> `CRITICAL`
4. `UNPLANNED` sub-checks run if scope expands
5. Quality gates verify: same tests pass before and after
6. Contract impact assessed for all 5 consuming services
7. Session ledger tracks cross-service changes
8. Risk escalation on multi-file breadth modifier
9. Verification Engine diffs actual files touched vs `in_scope` list

### Example 4: Quick Documentation Update

```text
Context: Update README with new API endpoint documentation
Task: Document the /api/v2/users endpoint
Scale: SMALL — solo project, ~5k LOC
```

**What happens:**

1. Minimal classification (`DOCS`, `LOW` risk)
2. No quality gates triggered (`DOCS` has no mandatory gates)
3. No hard floors (documentation is not a protected domain)
4. No ledger tracking needed (`ANALYSIS` and `DOCS` have light tracking)
5. Session overhead: ~45ms + ~130 tokens
6. No Intent Contract required (risk below `MEDIUM`)

---

## Programmatic API

For tool authors embedding Synarc into their own CLI/IDE/agent framework:

```js
import {
  install, verify, detect, doctor, list, ledger
} from "synarc-universal";

const detected = await detect(process.cwd());
console.log("Detected editors:", detected);

const result = await install({
  targets: ["cursor", "claude-code"],
  cwd: process.cwd(),
  dryRun: false,
  yes: true,
});

const v = await verify({ targets: ["cursor", "claude-code"] });
if (!v.ok) process.exit(1);

const recent = await ledger.query({ since: "7d", minRisk: "HIGH" });
console.log("High-risk changes:", recent);
```

See the [CLI reference](./cli-reference.md) for the full surface and the [Schemas reference](./schemas.md) for the formal data contracts.

---

## See also

- [README](./README.md) — landing page
- [CLI Reference](./cli-reference.md) — every command and flag
- [Installation Guide](./installation.md) — per-editor deep dive
- [Architecture](./architecture.md) — 7-layer design
- [Compatibility](./compatibility.md) — runtime capability matrix
- [Schemas](./schemas.md) — JSON Schemas reference
- [Advanced Topics](./advanced/) — deep dives on each subsystem
