---
title: Usage Guide — Synarc Universal Skill Pack
description: Comprehensive usage guide covering skill activation via intent_triggers, writing new skills with the 8-block template, the 4-tier cache architecture, fallback tier usage, and common workflow examples.
version: 6.0.0
schema: skill-pack/v1
---

# Usage Guide — Synarc Universal Skill Pack (v6.0.0)

## What's new in 6.0.0

- **Intent-based activation via `intent_triggers`** — every skill declares ≥ 2 concrete trigger phrases. Match on user intent, not platform-specific commands.
- **4-tier prompt-caching architecture** — every skill declares a `cache_tier` so agents can pre-wam the cache.
- **8-block template** — replaces the v5 12-section structure. Mandatory sections: frontmatter, persona, activation, workflow, decision rules, output format, gotchas, references, changelog.
- **35-38× token reduction** — total pack ~413 KB, each SKILL.md 8-14 KB. Fits in a single cache miss.

---

## How Skills Activate

Skills use **intent-based activation**. When you describe a task, the agent matches your intent against the `intent_triggers` array declared in each SKILL.md frontmatter. No slash commands, no manual selection.

### Activation Flow

```
Your intent (e.g., "Add user authentication")
  → Agent detects intent pattern
  → Matches against skill activation conditions
  → Loads matching SKILL.md(s)
  → Classification & risk assessment run
  → Skill behavior is applied
```

### Intent-to-Skill Mapping

| Your Intent | Skill Activated |
|-------------|----------------|
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

### Activation Precision

- **Always-on**: `synarc-core` and `negative-prompts` are loaded on every session
- **Intent-based**: Domain skills activate only when matching intent is detected
- **Priority**: Critical skills (core, negative-prompts) load before normal-priority skills
- **Composite**: Multiple skills can be active simultaneously for cross-domain tasks

---

## How to Write a New Skill

### 1. Create the skill directory

```
mkdir -p skills/my-domain-skill/
```

### 2. Write SKILL.md (v6 8-block template)

```markdown
---
name: my-domain-skill
description: Handles intent-matching for my specific domain with concrete triggers.
version: 6.0.0
priority: normal
intent_triggers: [domain, skill, capability, intent, ...]
cache_tier: domain
---

# my-domain-skill

You are my-domain-skill, a ... (one sentence persona, 2 lines max).

You never [prohibited action] without [prerequisite]. [One sentence about why.]

Think HOLISTICALLY and COMPREHENSIVELY before any work. Survey [scopes]. State [key things] on one line before [action].

Before calling each tool, first explain why: [reason template].

NEVER refer to tool names when speaking to the user.

## When to activate

This skill activates implicitly when the user describes work matching the triggers. [One paragraph.]

## Workflow

1. [Step one with concrete output]
2. [Step two with concrete output]
3. ...

## Decision rules

[3-5 specific rules in prose or a small table]

## Output format

[Structured output schema: what to emit, in what shape]

## Gotchas

- [Edge case 1]
- [Edge case 2]
- ...

## References

- `shared/standards/<file>.md` — [purpose]

## Changelog

- 6.0.0 — Initial v6 release.
```

### 3. Create skill.yaml (auto-generated)

Run `npm run sync` to auto-generate `skill.yaml` from the SKILL.md frontmatter. The sync script reads SKILL.md as the single source of truth and produces:

- `skills/<id>/skill.yaml` — v6 manifest with `intent_triggers` and `cache_tier`
- `manifest.yaml` — pack manifest with all skills
- `.claude-plugin/marketplace.json` — marketplace catalog

### 4. Validate

Run `npm run validate` to check the v6 contract:

- Required frontmatter fields
- 3rd-person description, 40-1024 chars
- intent_triggers array with ≥ 2 elements
- cache_tier enum
- No v5 deprecated fields
- No vendor-locked name tokens
- Mandatory 8-block template sections
- Size cap (50 KB hard, 30 KB warn)
- Markdown reference resolution

---

## How to Reference Shared Workflows

Shared workflows live in `shared/workflows/`. Skills reference them by relative path.

### From a SKILL.md

```markdown
See [change-classification workflow](../../shared/workflows/change-classification.md) for the full WorkType taxonomy.
```

### Reference Resolution

- Relative paths resolve from the SKILL.md file's directory
- The `shared/` prefix resolves from the skill pack root
- Broken references are detected by L2 validation

### Available Shared Workflows

| File | Purpose |
|------|---------|
| `shared/workflows/change-classification.md` | 12 WorkTypes, sub-types, ambiguity resolution |
| `shared/workflows/risk-assessment.md` | 6-level risk ladder, domain hard floors, composite scoring |
| `shared/workflows/session-tracking.md` | Immutable ledger, checkpoint protocol, handoff |
| `shared/workflows/quality-gates.md` | Per-WorkType verification, zero-tolerance violations |
| `shared/workflows/error-intelligence.md` | 6-step error protocol, persistent error memory |
| `shared/workflows/context-injection.md` | COMPACT/STANDARD/FULL injection levels |

---

## How Fallback Tiers Work

Every capability defines a 4-tier fallback chain. The agent automatically selects the highest available tier.

### Tier Selection at Runtime

```
Tier 1 — Native Execution (always preferred)
  ↓ (if unavailable)
Tier 2 — External Integration (via MCP, APIs)
  ↓ (if unavailable)
Tier 3 — Manual Workflow (text-based instructions)
  ↓ (if unavailable)
Tier 4 — Human-Assisted (structured output for review)
```

### Example: File Operations

| Tier | Behavior | Available On |
|------|----------|-------------|
| 1 | Agent uses built-in Read/Write tools | All agents |
| 2 | Agent uses external file service API | Claude Code, Gemini CLI, Cline, RooCode |
| 3 | Agent outputs file contents for manual copy | All agents |
| 4 | Agent describes changes for human implementation | All agents |

### Example: Risk Assessment

| Tier | Behavior | Available On |
|------|----------|-------------|
| 1 | Agent computes risk natively via prompt rules | All agents |
| 2 | Agent calls external risk scoring API | Claude Code, Gemini CLI, Cline, RooCode |
| 3 | Agent follows manual risk matrix from SKILL.md | All agents |
| 4 | Agent formats risk data for human evaluation | All agents |

---

## How the 4-Tier Cache Architecture Works

v6.0.0 introduces the 4-tier prompt-caching architecture. Every skill declares its `cache_tier` in frontmatter, so agents can pre-warm the cache and reduce per-turn cost.

### Tier breakdown

| Tier | What | Cached for | When loaded |
|------|------|------------|-------------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Always (every session) | Session start |
| 1 | Core reasoning (synarc-core, negative-prompts, cognition-layer, schemas) | Always-on | Session start |
| 2 | Active domain skill (debug-engineer, architect, etc.) | Per task | On intent match |
| 3 | Skill references (`skills/<id>/references/*.md`) | Lazy | On first reference |
| 4 | Dynamic context (project files, tool outputs) | Never | Per turn |

### Activation across all 9 runtimes (no compile step)

| Agent | Tier 0 location | Tier 1 location | Tier 2 location |
|-------|-----------------|-----------------|-----------------|
| Codex CLI | `AGENTS.md` (root) | `synarc-universal/skills/synarc-core/SKILL.md` | `synarc-universal/skills/<id>/SKILL.md` |
| OpenCode | `AGENTS.md` (root) | same | same |
| Cursor | `.cursor/rules/*.mdc` | `.cursor/rules/synarc-core.mdc` | `.cursor/rules/<id>.mdc` |
| Gemini CLI | `AGENTS.md` (root) | same | same |
| Claude Code | `SKILL.md` (root) | `synarc-universal/skills/synarc-core/SKILL.md` | `synarc-universal/skills/<id>/SKILL.md` |
| Copilot | `.github/copilot-instructions.md` | included | included |
| Windsurf | `.windsurfrules` | included | included |
| Cline | `.clinerules/` | included | included |
| RooCode | `.roorules/` | included | included |

### Why no compile step?

The 4-tier cache replaces the v5.x compile step. Agents read the same SKILL.md natively and use cache invalidation rules to determine when to reload. This is the same pattern that Anthropic's prompt caching uses internally; we expose it via the `cache_tier` field so any agent can implement it.

---

## Common Workflows

### Change Classification

Classifies every engineering interaction before execution.

**When it runs:** Every interaction that modifies code or configuration.

**Steps:**
1. Determine primary WorkType (FEATURE, FIX, REFACTOR, SCHEMA, CONTRACT, CONFIG, INFRA, EXPERIMENT, DOCS, ANALYSIS, PLAN, INCIDENT)
2. Determine Planned vs Unplanned sub-classification
3. Apply sub-type classification (e.g., FIX:BUG, FIX:SECURITY)
4. Assign classification confidence (CERTAIN, LIKELY, UNCERTAIN, CONTRADICTED)
5. Record in session ledger

**Example output:**
```
FEATURE:PLANNED | Risk: MEDIUM | Scope: IN_SCOPE | Confidence: CERTAIN
```

### Risk Assessment

Assesses risk of every change using deterministic hard floors.

**When it runs:** After classification, before execution.

**Steps:**
1. Determine base risk from WorkType
2. Apply domain hard floors (auth=CRITICAL, payment=CRITICAL, etc.)
3. Apply dimension modifiers (file breadth, reversibility, scope alignment)
4. Compute composite risk
5. Check escalation level
6. Emit risk assessment

**Example output:**
```
Risk: HIGH | Domain: AUTH | Breadth: SINGLE_FILE | Reversibility: REVERTIBLE
Floor: CRITICAL | Composite: 4 | Escalation: WARNING
Rollback: Revert token validation change
```

### Session Tracking

Maintains an immutable ledger of all changes across sessions.

**When it runs:** On every file modification, session start/resume, and handoff.

**Steps:**
1. Initialize session with ID and timestamp
2. Create immutable ledger entry for every change
3. Update aggregate risk after each entry
4. Create checkpoint when risk crosses HIGH
5. Enable session continuity and handoff

**Example ledger entry:**
```
2026-06-02T10:30:00Z | FEATURE:PLANNED | Risk: MEDIUM | Scope: IN_SCOPE | Breaking: false
  → src/auth/login.ts (+45, -12)
  → contract: [AuthAPI.login]
  → Aggregate risk: MEDIUM (trend: stable)
```

### Quality Gates

Enforces quality standards on every engineering change.

**When it runs:** Before and after every file modification.

**Pre-write checks:**
- Classify the specific tool call
- Check for contract/schema/auth impact
- Verify within declared scope
- Confirm rollback path for HIGH+ risk
- Read current state before destructive operations
- Check aggregate risk threshold

**Post-write verification:**
- Record in session ledger
- Update session state
- Check auto-emit rules
- Stop on breaking changes
- Verify file integrity
- Run tests for affected module

### Error Intelligence

Systematically resolves errors using a 6-step protocol.

**When it runs:** On errors, exceptions, test failures, or crash reports.

**Steps:**
1. **Classify** — Type, category, reproducibility, scope, severity
2. **Locate** — Stack trace analysis, pattern matching, blame analysis, bisect
3. **Assess** — Determine fix strategy from error type
4. **Apply** — Read affected file, apply minimal fix, add regression test
5. **Verify** — Run reproduction case, existing tests, lint, type check
6. **Track** — Record in persistent error intelligence database

---

## Examples

### Example 1: Full Feature Implementation

```
Context: Node.js 20 REST API with Express + PostgreSQL
Task: Add user authentication
Scale: MEDIUM — team of 4, ~15k LOC, 6 modules
```

**What happens:**
1. `backend-engineer` activates for API design
2. `security-engineer` activates for auth implementation
3. `database-architect` activates for user schema design
4. Change classified as FEATURE:PLANNED, MEDIUM risk
5. Hard floor applied: auth domain → CRITICAL minimum
6. Quality gates require unit tests, contract tests, type check, lint
7. Session ledger tracks all file modifications
8. Error intelligence handles any issues during implementation

### Example 2: Production Incident Response

```
Context: Production outage — payment API returning 500s
Task: Investigate and fix
Scale: LARGE — 8 teams, ~500k LOC, 40+ services
```

**What happens:**
1. `incident-commander` activates with ICS framework
2. `debug-engineer` activates for systematic root cause analysis
3. `sre-engineer` activates for SLO impact assessment
4. Change classified as INCIDENT, CRITICAL risk
5. Hard floor applied: payment domain → CRITICAL
6. Error intelligence runs 6-step protocol
7. Quality gates require RCA, monitoring gap review
8. Session checkpoint created at every risk boundary
9. Handoff protocol enables team shift changes

### Example 3: Cross-Boundary Refactoring

```
Context: Extract shared auth logic into a common module
Task: Refactor auth middleware used by 5 services
Scale: MEDIUM — 2 teams, ~80k LOC, 3 services affected
```

**What happens:**
1. `architect` activates for system decomposition
2. `refactor` WorkType assigned with HIGH risk (public API)
3. Hard floor: auth domain → CRITICAL
4. UNPLANNED sub-checks run if scope expands
5. Quality gates verify: same tests pass before and after
6. Contract impact assessed for all 5 consuming services
7. Session ledger tracks cross-service changes
8. Risk escalation on multi-file breadth modifier

### Example 4: Quick Documentation Update

```
Context: Update README with new API endpoint documentation
Task: Document the /api/v2/users endpoint
Scale: SMALL — solo project, ~5k LOC
```

**What happens:**
1. Minimal classification (DOCS, LOW risk)
2. No quality gates triggered (DOCS has no mandatory gates)
3. No hard floors (documentation is not a protected domain)
4. No ledger tracking needed (ANALYSIS and DOCS have light tracking)
5. Session overhead: ~45ms + ~130 tokens
