# Synarc - Cognition Mesh (Autonomous Engineering Intelligence Runtime)

![Synarc Banner](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790150/synarc-banner_lytvq5.png)


[![Version](https://img.shields.io/badge/version-6.0.0-blue)](https://github.com/upflame-labs/synarc/releases)
[![Stage](https://img.shields.io/badge/stage-production-success)](https://github.com/upflame-labs/synarc)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)
[![Runtime](https://img.shields.io/badge/runtime-Claude_Code%20%7C%20Codex%20%7C%20Cursor%20%7C%20Windsurf%20%7C%20MCP-purple)](https://github.com/upflame-labs/synarc)
[![Category](https://img.shields.io/badge/category-AI_Coding_Skill_Runtime-black)](https://github.com/upflame-labs/synarc)
[![Roles](https://img.shields.io/badge/roles-67_specialized_skills-6C5CE7)](https://github.com/upflame-labs/synarc/tree/main/synarc-universal/skills)
[![Context Engine](https://img.shields.io/badge/context-persistent_memory-blueviolet)](https://github.com/upflame-labs/synarc)
[![Cognition Mesh](https://img.shields.io/badge/cognition-multi_role_teams-success)](https://github.com/upflame-labs/synarc)
[![Security](https://img.shields.io/badge/OWASP-Agentic_Top_10_Covered-brightgreen)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
[![Specs](https://img.shields.io/badge/specifications-15_reference_modules-orange)](https://github.com/upflame-labs/synarc/tree/main/plugins/synarc/skills/references)
[![Integrity](https://img.shields.io/badge/integrity-SHA256_Verified-success)](https://github.com/upflame-labs/synarc)
[![Marketplace](https://img.shields.io/badge/marketplace-upflame/synarc-red)](https://github.com/upflame-labs/synarc)

Build fast with AI, but ship with engineering discipline. Synarc transforms raw vibe coding into context-governed agentic execution by preserving architectural memory, enforcing repository awareness, and maintaining decision continuity across sessions. **v6 introduces the Cognition Mesh: specialized AI engineer roles that collaborate as a team.**

> [!IMPORTANT]
> Production - always-on, zero-configuration engineering cognition runtime. v6 is additive to v5 — no breaking changes for v5 manifest consumers.

Change classification, risk tracking, context injection, multi-role team collaboration, and session continuity for AI coding environments. One SKILL.md, any runtime. 67 specialized roles, one mesh.

---

## v6.0.0 — 4-tier prompt-caching + 38× token reduction

**What's new in 6.0.0:**

- **4-tier prompt-caching architecture** — every skill declares a `cache_tier` (core / domain / reference / context / dynamic). Agents pre-warm the cache once and amortize the cost across many turns.
- **Intent-based activation via `intent_triggers`** — every skill declares ≥ 2 concrete trigger phrases. Match on user intent, not platform-specific commands.
- **8-block template** — replaces the v5 12-section structure. Mandatory sections: frontmatter, persona, activation, workflow, decision rules, output format, gotchas, references, changelog.
- **38× token reduction** — total pack is now 413 KB (down from 15.67 MB in v5.x). Each SKILL.md is 8-14 KB; the pack fits in a single cache miss.
- **Universal runtime, no compile step** — same files work in Codex, OpenCode, Cursor, Gemini CLI, Claude Code, Copilot, Windsurf, Cline, RooCode. No platform-specific fields, no compile step.
- **Vendor-neutral naming** — no `anthropic`, `claude`, `gpt*`, `gemini` in skill names, descriptions, or content. Banned at validator level.

**The 4-tier cache architecture:**

```
Tier 0: Pack header (AGENTS.md, manifest.yaml)           - cached for the session
Tier 1: Core reasoning (synarc-core, negative-prompts,    - cached for the session
        cognition-layer, schemas)                          (~60 KB)
Tier 2: Active domain skill (debug-engineer, architect,   - cached for the task
        security-engineer, etc.)                           (one of 40, ~10 KB each)
Tier 3: Skill references (skills/<id>/references/*.md)    - lazy-loaded on first ref
Tier 4: Dynamic context (project files, tool outputs)     - never cached
```

Anti-cache rules for Tiers 0-2: no timestamps, no session IDs, no user data, no tool-result echoes. Dynamic content lives in Tier 4.

**The token math:**

| Metric | v5.x | v6.0.0 | Change |
|--------|------|--------|--------|
| Total pack size | 15,670 KB (15.67 MB) | 412.9 KB | **38× smaller** |
| Largest SKILL.md | 2,870 KB (sre-engineer) | 13.7 KB (negative-prompts) | 209× smaller |
| SKILL.md size cap | unbounded | 50 KB hard / 30 KB warn | enforced |
| Per-skill intent match | "WHEN/THEN" prose | `intent_triggers: [...]` array | machine-parseable |
| Runtime support | 9 (with compile step) | 9 (no compile step) | same coverage |

See [CHANGELOG.md](CHANGELOG.md) for the full v6.0.0 release notes.

---

---

## The Problem

Your AI coding agent reads files, edits code, runs commands, and ships changes to production. Every interaction creates change, and in vibe coding workflows those changes compound faster than context can keep up. Five rapid edits become fifty hidden assumptions spread across your codebase. Architectural intent fades, reasoning fragments across prompts, and what feels like velocity quietly turns into system drift.

When something breaks, the problem is rarely the final change itself. The real failure is losing the chain of reasoning behind it. Engineering teams are left trying to reconstruct what changed, why the agent made that decision, and which contracts, integrations, or architectural guarantees were silently violated along the way.

This is the core failure of vibe coding. AI coding agents optimize for generation speed, but production systems depend on context continuity. Without persistent context, every session risks architectural drift, repeated regressions, duplicate implementations, and unstable deployments.

The faster AI writes code, the more dangerous context loss becomes. That is the gap Synarc solves.

When something breaks, every engineering team needs answers to three critical questions:

**1. What changed?** An agent that edited `auth/router.ts`, `src/middleware.ts`, and `db/migrations/` might have touched authentication, request handling, and the database schema. Did it intend to? Was the scope declared?

**2. Is this change safe?** A three-line diff in `payment/processor.ts` changes circuit breaker logic. Lines of code do not correlate with risk. Every change needs a risk assessment - not by effort, by impact.

**3. What happens when I close this session?** The agent holds your project's current state in its context window. When the session ends, that state is gone. The next session starts from zero. Every decision, every risk, every architectural assumption - lost.

![The Problem](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790150/synarc-02_jracl6.png)

Prompt-level safety ("please track what you change") is not a control surface. It is a polite request to a stochastic system. OWASP LLM01:2025 states this explicitly: deterministic controls must exist outside the prompt.

Synarc does not ask agents to behave. It interposes deterministic classification, logging, and risk assessment at every tool call - before the model's intent reaches the wire. Changes the cognition layer flags as UNPLANNED or CRITICAL are surfaced before they execute.

---

## Architecture

![Architecture](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790149/synarc-03_jfssp5.png)

Every layer runs on every tool call. Classify → Inject → Execute → Log → Aggregate → Checkpoint → Emit. ~50-100ms overhead. Prevents misclassifications, scope violations, and unrecoverable changes. The architecture is **runtime-agnostic** - the same 7-step pipeline executes identically across Claude Code, Codex CLI, Cursor, Windsurf, and any other AI coding tool.

---

## Change Classification Flow

![Classification Flow](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790149/synarc-04_t1lbcu.png)

12 WorkTypes. 7 classification dimensions. Deterministic risk floors. Every change classified before the first byte is written.

---

## Quick Start

**Prerequisites:** Any AI coding runtime (Claude Code, Codex CLI, Cursor, Windsurf).

Synarc activates automatically. Zero configuration.

```text
User: "Review this diff and tell me if it's safe to deploy"

Synarc automatically:
✓ Maps impacted services
✓ Detects contract violations
✓ Scores deployment risk
✓ Flags rollback hazards
✓ Produces mitigation strategy
```

### Session start - provide context

```text
Project: Node.js 20 REST API with Express + PostgreSQL + Redis
Scale: MEDIUM - team of 4, ~15k LOC, 6 modules
Modules: auth, users, tasks, projects, notifications, infra
Today's task: [describe what you want to do]
```

### Commands

| Command | Response |
|---------|----------|
| `what did we change?` | Full session ledger |
| `summarize this session` | Cognitive summary |
| `is this safe to deploy?` | Risk delta + explicit YES/NO |
| `what tests are missing?` | All unfilled test gaps |
| `generate a snapshot` | `/brain/snapshots/` entry |
| `full handoff` | Agent handoff block + brain updates |
| `run quality gates` | All gates PASS/FAIL report |

### CLI interaction

```text
> Classify: ANALYSIS | Risk: INFO | Scale: auto
✓ Pre-write check: PASS | Scope: in-bounds | Risk: MEDIUM

> what did we change?
── Session Ledger ──
[14:00] FEATURE | auth/router.ts (+12, -3) | MEDIUM | IN_SCOPE
[14:05] FIX    | auth/middleware.ts (+5, -0) | LOW | IN_SCOPE
Aggregate: MEDIUM (stable)
─────────────────────
```

Full walkthrough: [docs/QUICKSTART.md](docs/QUICKSTART.md)

---

## Installation

Synarc v6.0.0 ships **56 skills** (40 carried from v5 + 16 new in the v6 P0 cohort) and the **Cognition Mesh** runtime for 9 AI coding agents. Choose your agent below; the Claude Code plugin marketplace is the fastest path, all other agents use a single drop-in file.

> [!TIP]
> **AGENTS.md is the cross-tool standard** (governed by the Linux Foundation's Agentic AI Foundation, 2026). Codex CLI, OpenCode, and most modern agents read it from the repo root. Claude Code uses `CLAUDE.md` natively, Gemini CLI uses `GEMINI.md`.

### 1. Claude Code (Recommended)

```bash
/plugin marketplace add upflame/Synarc
/plugin install synarc@upflame-marketplace
```

The `synarc` core plugin bundles all 56 role subsystems as reference files. One install activates everything — no per-skill commands needed. Verify with a classification prompt; the headers `WorkType`, `Risk`, `Scale` should appear automatically.

**Optional — install specific role plugins for granular routing:**

```bash
/plugin install backend-engineer@upflame-marketplace
/plugin install security-engineer@upflame-marketplace
/plugin install agentic-ai-engineer@upflame-marketplace
```

**Local clone alternative:**

```bash
git clone https://github.com/upflame/Synarc.git
/plugin marketplace add ./Synarc
/plugin install synarc@synarc-marketplace
```

Claude Code auto-detects `/brain/` or `.claude/`. Full brain directory, hooks, and session continuity are enabled out of the box.

### 2. Codex CLI

```bash
cp synarc-universal/AGENTS.md ./AGENTS.md
# Keep synarc-universal/ in the repo (or as a submodule)
```

Codex reads `AGENTS.md` from the repository root on every session. The `skills/` directory must be reachable from the same project tree.

### 3. OpenCode

```bash
# Project-level
cp synarc-universal/AGENTS.md ./AGENTS.md

# Or global (applies to every project on this machine)
mkdir -p ~/.config/opencode
cp synarc-universal/AGENTS.md ~/.config/opencode/AGENTS.md
```

OpenCode 1.14.33+ reads `AGENTS.md` from the repo root (project) or `~/.config/opencode/AGENTS.md` (global). It supports MCP servers, custom slash commands, and intent-based skill activation.

### 4. Cursor

Cursor deprecated `.cursorrules` in 2025. The current format is **`.cursor/rules/*.mdc`** with YAML frontmatter.

```bash
mkdir -p .cursor/rules
cp synarc-universal/runtime-adapters/cursor/*.mdc .cursor/rules/
```

Each `.mdc` file declares `description`, `globs`, and `alwaysApply` for automatic activation. Cursor supports four activation modes: **Always Attached**, **Auto Attached** (glob match), **File Match**, and **Manual**.

### 5. Windsurf

Windsurf reads `.windsurfrules` from the repo root (Cascade agent, VS Code-based).

```bash
cp synarc-universal/shared/runtime-adapters/windsurf.md .windsurfrules
```

### 6. GitHub Copilot

```bash
mkdir -p .github
# Append Synarc sections
cat synarc-universal/shared/runtime-adapters/copilot.md >> .github/copilot-instructions.md
```

Copilot reads repository-wide rules from `.github/copilot-instructions.md`. Path-specific rules use `.github/instructions/*.md` with glob filters.

### 7. Gemini CLI

Gemini CLI uses `GEMINI.md` (its own convention, separate from `AGENTS.md`).

```bash
cp synarc-universal/AGENTS.md ./GEMINI.md
```

With a 1M-token context window, the full 56-skill pack fits comfortably. No MCP server is required.

### 8. Cline

Cline reads SKILL.md files natively from `.cline/skills/` (project) or `~/.cline/skills/` (personal global).

```bash
# Project-level
mkdir -p .cline/skills
cp -r synarc-universal/skills/* .cline/skills/

# Personal global
mkdir -p ~/.cline/skills
cp -r synarc-universal/skills/* ~/.cline/skills/
```

### 9. Roo Code → Cline (Migration)

**Roo Code shut down on May 15, 2026.** Its user base migrated to **Cline** (the successor). The SKILL.md format is identical.

```bash
# If you previously had .roo/skills/, just rename it
mv .roo/skills .cline/skills

# Otherwise, install Cline from scratch
mkdir -p .cline/skills
cp -r synarc-universal/skills/* .cline/skills/
```

### 10. Claude Web / Claude API

Claude Web has no filesystem access. Paste the contents of `plugins/synarc/skills/SKILL.md` into **Project Knowledge**, then start a conversation. For the Claude API, pass the SKILL.md content via the `system` parameter, or use a structured `tool_use` block with `skill_id: "synarc"`.

---

### Mesh Activation (v6)

Once installed, the **Cognition Mesh** activates automatically on:

- The `/mesh` or `/team` slash command
- Intent phrasing such as "as a team", "have someone review this", "collaborate on this"
- 3+ distinct intent signals in one request (e.g., "build a checkout flow" matches PM, designer, frontend, backend, accessibility, performance, SDET, release, security)

No additional setup. `synarc-core` is the mesh coordinator.

---

### Quick Reference

| Agent | File / Command | Location |
|-------|---------------|----------|
| Claude Code | `/plugin install synarc@upflame-marketplace` | Plugin marketplace |
| Codex CLI | `AGENTS.md` | Repo root |
| OpenCode | `AGENTS.md` | Repo root or `~/.config/opencode/AGENTS.md` |
| Cursor | `.mdc` rules with frontmatter | `.cursor/rules/` |
| Windsurf | `.windsurfrules` | Repo root |
| Copilot | `copilot-instructions.md` | `.github/` |
| Gemini CLI | `GEMINI.md` | Repo root |
| Cline | `SKILL.md` files | `.cline/skills/` or `~/.cline/skills/` |
| Roo Code | Migrate to Cline | `.cline/skills/` |
| Claude Web/API | Paste / `system` param | Project knowledge or API system field |

Full per-agent reference with verification steps and troubleshooting: [synarc-universal/docs/installation.md](synarc-universal/docs/installation.md).

### How activation works (v6.0.0)

Activation is **intent-based** — no slash commands, no manual skill selection. The agent reads the `intent_triggers` array in each skill's frontmatter and loads the matching skill when a trigger phrase matches the user's request.

```
User says: "Help me debug this 500 error from the auth middleware"
  → matches intent_triggers: ["debug", "error", "root cause"]
  → loads debug-engineer (cache_tier: domain)
  → pre-warm: synarc-core, cognition-layer, schemas already in Tier 1 cache
```

### Cache pre-warm (recommended)

To minimize per-turn cost, pre-warm the cache once at session start by loading the Tier 1 core skills (~60 KB total) into the system context:

```yaml
Tier 1 (always-on, ~60 KB):  synarc-core, negative-prompts, cognition-layer, schemas, change-intelligence, coding-agent
Tier 2 (per task, ~10 KB):   debug-engineer | architect | backend-engineer | ... (one of 40)
```

Anti-cache rules for Tiers 0-2: no timestamps, no session IDs, no user data, no tool-result echoes. Dynamic content lives in Tier 4 (never cached).

### Multi-project setup

```bash
git submodule add https://github.com/upflame-labs/synarc.git synarc-universal
ln -s synarc-universal/AGENTS.md AGENTS.md
```

Full guide: [docs/installation.md](synarc-universal/docs/installation.md)

---

## Runtime Support

![Runtime Support](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790149/synarc-05_myqoew.png)


| Runtime | Persistence | Detection Signal | Injection Level | Brain Dir |
|---------|-------------|-----------------|-----------------|-----------|
| Claude Code | Full brain directory + hooks | `/brain/` or `.claude/` exists | STANDARD + COMPACT per tool | Yes |
| Claude Web | Conversation state blocks | Filesystem inaccessible; chat-only | COMPACT per interaction | No |
| Codex CLI | AGENTS.md protocol | `AGENTS.md` in repo root | STANDARD at session start | Via AGENTS.md |
| OpenCode | Full brain directory | `AGENTS.md` in repo root | STANDARD + COMPACT per tool | Yes |
| Cursor IDE | IDE rules protocol | `.cursor/rules` detected | COMPACT per file write | Limited |
| Windsurf IDE | IDE rules protocol | `.windsurfrules` detected | COMPACT per file write | Limited |
| Gemini CLI | AGENTS.md protocol | `AGENTS.md` in repo root | STANDARD at session start | Via AGENTS.md |
| GitHub Copilot | Instructions file | `.github/copilot-instructions.md` | COMPACT per session | Limited |
| Claude API | Structured JSON | API call with `skill_id` | STANDARD via `context` field | Via API |

---

## Error Intelligence Protocol

![Error Intelligence Protocol](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790148/synarc-06_ojy443.png)


6-step protocol on every FIX: **Classify → Locate → Assess → Apply → Verify → Track**. Every error becomes a permanent entry in `/brain/ERROR_INTELLIGENCE.md` - past errors inform future fix strategies.

---

## Session Lifecycle

![Session Lifecycle](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790148/synarc-07_tfpnnq.png)

Sessions persist across interruptions. Ledger survives context resets. Handoff protocol enables seamless agent-to-agent transfer.

---

## Risk Aggregation Model

![Risk Aggregation Model](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790148/synarc-08_kgvohw.png)


| Component | Rule |
|-----------|------|
| Base Risk | Derived from WorkType (FEATURE=MEDIUM, FIX=LOW, SCHEMA=HIGH, INCIDENT=CRITICAL) |
| Breadth Multiplier | SINGLE_FILE = 0, MULTI_FILE = +1 level, CROSS_SERVICE = +2, CROSS_BOUNDARY = +2 |
| Reversibility Floor | REVERTIBLE = no change, PARTIAL = min LOW, IRREVERSIBLE = min MEDIUM |
| Scope Violation Penalty | UNPLANNED = +1 level, SCOPE_CREEP = +2 levels |
| Domain Hard Floor | Auth/payments = min HIGH, Schema changes = min CRITICAL |
| Cumulative Trend | Last 5 entries weighted; escalating = warning, stable = OK, de-escalating = recovery |

---

## Scale Adaptation

| Scale | Threshold | Tracking Depth | Injection | Checkpoints | Brain Files |
|-------|-----------|----------------|-----------|-------------|-------------|
| NANO | 1 file, 1 purpose | WorkType + risk only | SILENT | None | None |
| MICRO | 2-10 files | CURRENT_STATE.md | COMPACT | On significant changes | CURRENT_STATE.md |
| SMALL | <5k LOC, 1-5 modules | Full brain directory | STANDARD | Per task | All brain files |
| MEDIUM | 5k-50k LOC, team | Full ledger | STANDARD | Per change set | All + CHANGE_LOG.md |
| LARGE | 50k-500k LOC, multi-service | Service-boundary tracking | FULL | Per service boundary | All + service maps |
| ENTERPRISE | >500k LOC, regulated | Compliance audit trail | FULL + pre-write | Per mutation | All + audit log |

Auto-detected. Zero configuration. Transitions are seamless - Synarc scales up as your project grows without changing a single line of configuration.

---

## Quality Gates

![Quality Gates](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790792/ChatGPT_Image_May_26_2026_03_49_30_PM_ron4rw.png)

Every interaction passes through these gates before execution.

Zero-tolerance: no execution before classification, no invented context, no missing tests on fixes, no unabsorbed unplanned scope.

---

## Agent Handoff Protocol

![Agent Handoff Protocol](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790148/synarc-09_oragks.png)

---

## Capabilities

### Change Classification

Every interaction classified along 7 dimensions:

| Dimension | Values | Purpose |
|-----------|--------|---------|
| WorkType | FEATURE · FIX · REFACTOR · SCHEMA · CONTRACT · CONFIG · INFRA · INCIDENT · EXPERIMENT · DOCS · ANALYSIS · PLAN | What kind of work |
| Risk Level | CRITICAL · HIGH · MEDIUM · LOW · INFO | Safety assessment |
| Breadth | SINGLE_FILE · MULTI_FILE · CROSS_SERVICE · CROSS_BOUNDARY | Impact radius |
| Reversibility | REVERTIBLE · PARTIAL · IRREVERSIBLE | Rollback difficulty |
| Scope Alignment | IN_SCOPE · PLANNED · UNPLANNED · SCOPE_CREEP | Intent match |
| Urgency | NORMAL · HIGH · BLOCKING · EMERGENCY | Timeline pressure |
| Confidence | CERTAIN · LIKELY · UNCERTAIN · CONTRADICTED | Certainty of classification |

### Context Injection

| Level | Contents | Token Cost | When Used |
|-------|----------|------------|-----------|
| COMPACT | Scale + risk + session ID | ~50 tokens | Every tool call |
| STANDARD | + Scope boundary + recent ledger + active constraints | ~200 tokens | Session start, scope changes |
| FULL | + Architecture context + service map + all open risks | ~500 tokens | Large projects, cross-boundary changes |

### Session Ledger

Every interaction produces an immutable ledger entry:

```text
[2026-05-26 14:00:00] FEATURE | MEDIUM | IN_SCOPE | REVERTIBLE
  → src/auth/router.ts (+12, -3)
  → src/auth/middleware.ts (+5, -0)
  → Aggregate risk: MEDIUM (escalated from LOW)
```

`/brain/CHANGE_LEDGER.md` persists across sessions. `CHANGE_LOG.md` compresses for context efficiency. Checkpoints enable rollback to any prior state.

### Language Rules (S14)

Prohibited across all output:

| Category | Examples |
|----------|----------|
| False precision | "We'll improve iteratively" · "Continuously enhance" |
| Vacuous hedging | "Should" · "Could" · "Might" · "Perhaps" · "Potentially" |
| Manager-speak | "Leverage" · "Holistic" · "Robust" · "Granular" · "Actionable" |
| Padding | "Firstly" · "In conclusion" · "It is worth noting" · "Please note" |
| Euphemisms | "Edge cases" for bugs · "Technical debt" for bad code |
| Unknown framing | "I don't have access" instead of stating actual capability |

Engineer-to-engineer: direct, precise, no filler.

---

## Cognition Mesh (v6)

v6 ships the **Cognition Mesh**: instead of activating a single skill, multiple roles collaborate on a single task with shared working memory, role handoffs, and a unified deliverable.

### When the Mesh Activates

- You type `/mesh` or `/team`
- You ask for "a team" / "collaborate" / "have someone review this"
- 3+ distinct intent signals are detected (e.g., "build a checkout flow" matches PM, designer, frontend, backend, accessibility, performance, SDET, release, security)

### Example Mesh

```text
User: "/mesh build a checkout flow"

synarc-core (coordinator)
├── product-manager         opportunity, success metrics
├── product-designer        interaction, wireframe
├── frontend-engineer       component architecture
├── backend-engineer        API, data model
├── accessibility-engineer  WCAG, keyboard, screen reader
├── performance-engineer    LCP/INP budget, CDN
├── sdet-engineer           E2E suite, contract test
├── release-engineer        feature flag rollout, canary
└── security-engineer       threat model, fraud
```

Each role produces its output, writes to the mesh working memory, and hands off to the next. The coordinator merges into a single, structured response.

### Mesh Output

The mesh returns JSON-serializable output you can pipe to tools, CI, or other agents:

```json
{
  "mesh_id": "checkout-flow-design",
  "participants": ["product-manager", "product-designer", ...],
  "per_role_output": [...],
  "conflicts": [],
  "unified": "<merged response>"
}
```

### v6.0.0 New Skills (16)

| Category | Skills |
|----------|--------|
| AI-Era (8) | agentic-ai-engineer, prompt-engineer, rag-engineer, ai-safety-eval-engineer, agent-architect, ai-product-manager, mlops-engineer, data-scientist |
| Product (1) | product-manager |
| Design (3) | product-designer, content-designer, design-systems-engineer |
| Quality (4) | sdet-engineer, performance-engineer, release-engineer, accessibility-engineer |

Each is a full skill with SKILL.md, skill.yaml, guardrails.yaml, and CHANGELOG.md. They inherit `synarc-core` and follow the v5 conventions exactly.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design and [docs/MIGRATION_v5_to_v6.md](docs/MIGRATION_v5_to_v6.md) for upgrade notes.

---

## Adoption Readiness

| Criterion | Status |
|-----------|--------|
| Any project size | NANO to ENTERPRISE - auto-scale |
| Any runtime | Claude Code · Codex · Cursor · Windsurf · Claude API · Generic |
| Zero dependencies | Pure reference files + markdown |
| No build step | Drop in and run |
| No telemetry | Zero network calls |
| Deterministic | Same input → same classification |
| Audit trail | Immutable ledger + snapshots |
| Team portable | Commit /brain/ to repo |
| CI/CD ready | Works in headless/automation environments |
| Compliance ready | OWASP mapped, audit trail, risk floors |

---

## Security & Compliance

| Guard | Status |
|-------|--------|
| Sandboxed execution | Enabled |
| No network access | Verified |
| No filesystem write outside `/brain/` | Enforced |
| Deterministic activation | Validated |
| Safe fallbacks on protocol error | Configured |
| Rollback-safe protocol | Verified |
| Hash-verified integrity (SHA-256) | Active |
| Tamper protection | Enabled |
| Immutable skill routing | Active |

**Risk hard floors** - cannot be lowered:

| Domain | Minimum Risk | Reasoning |
|--------|-------------|----------|
| Auth, billing, payments, security | HIGH | Revenue, access, or trust impact |
| Schema change (remove/rename) | CRITICAL | Data integrity + migration complexity |
| Environment variable rename | CRITICAL | All deployments affected |
| Public API response change | HIGH | All consumers must adapt |
| Network / IAM config | CRITICAL | Security boundary change |
| INCIDENT response | CRITICAL | Production emergency |

**Compliance:** OWASP LLM01-LLM10 risk categories mapped with deterministic controls. Risk escalation ladder with 6 levels (0→5):
- **Level 0**: Normal workflow - all gates pass, risk stable
- **Level 1**: Escalating - 2+ MEDIUM in a row
- **Level 2**: Warning - HIGH unplanned scope
- **Level 3**: Alert - CRITICAL detected
- **Level 4**: Intervention - CRITICAL + UNPLANNED
- **Level 5**: Full stop - CRITICAL + INCIDENT + external notification

Classification across SDLC: Pre-dev → Development → Review → Pre-deploy → Post-deploy → Post-mortem.

---

## What Users Say

> "Synarc is the first system that makes me trust what my AI coding agent is doing. The risk aggregation caught a scope violation before it reached production." - CTO, fintech startup

> "We deployed Synarc across 4 teams using Claude Code. The handoff protocol alone saved us 3 hours per context switch." - Platform Engineer, e-commerce platform

> "The scale adaptation is what sold us. NANO for scripts, ENTERPRISE for our payment pipeline - same SKILL.md, zero config changes." - Lead Architect, SaaS company

> "I didn't realize how much context I was losing between sessions until I had Synarc's ledger. It's like having a senior engineer's memory." - Staff Engineer, enterprise SaaS

---

## Documentation

| Category | Links |
|----------|-------|
| Getting Started | [Quick Start](docs/QUICKSTART.md) · [Deployment Guide](docs/DEPLOYMENT.md) · [Architecture (v6)](docs/ARCHITECTURE.md) · [v5→v6 Migration](docs/MIGRATION_v5_to_v6.md) |
| Specifications | [change-taxonomy.md](plugins/synarc/skills/references/change-taxonomy.md) · [injection-protocol.md](plugins/synarc/skills/references/injection-protocol.md) · [session-tracking.md](plugins/synarc/skills/references/session-tracking.md) · [coding-agent.md](plugins/synarc/skills/references/coding-agent.md) · [project-scales.md](plugins/synarc/skills/references/project-scales.md) · [analysis-patterns.md](plugins/synarc/skills/references/analysis-patterns.md) · [testing-strategy.md](plugins/synarc/skills/references/testing-strategy.md) · [security-patterns.md](plugins/synarc/skills/references/security-patterns.md) |
| Architecture | [cognition-layer.md](plugins/synarc/skills/references/cognition-layer.md) · [schemas.md](plugins/synarc/skills/references/schemas.md) · [platform-adapters.md](plugins/synarc/skills/references/platform-adapters.md) |
| Reference | [SKILL.md](plugins/synarc/skills/SKILL.md) (entry point) · [negative-prompts.md](plugins/synarc/skills/references/negative-prompts.md) |
| Vision | [v6 Vision](brain/V6_VISION.md) |
| Integrity | [integrity.json](.claude-plugin/integrity.json) (SHA-256 verified) |

---

## Important Notes

Synarc classifies every change, tracks every mutation, and enforces quality gates. It does not modify your code without classification. It does not bypass security controls. It does not require network access. All cognition is local to the runtime session.

If you use Synarc with third-party AI coding tools or services, review what data is shared with those services. Synarc itself makes no external network calls.

---

## License

MIT - see [LICENSE](LICENSE).

Built by [UpFlame](https://github.com/upflame).