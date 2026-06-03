---
title: Architecture Overview — Synarc Universal Skill Pack
description: Complete architecture documentation covering the universal agent skill architecture, 4-tier prompt-caching design, 8-block template, intent-based activation, fallback tier system, and full directory structure reference.
version: 6.0.0
schema: skill-pack/v1
---

# Architecture Overview — Synarc Universal Skill Pack

## Universal Agent Skill Architecture

The Synarc Universal Skill Pack defines a **write-once, deploy-anywhere** architecture for AI coding agent skills. A single SKILL.md authored in the universal format can be deployed to any of 9 supported runtimes without modification.

```
+-----------------------------------------------------------+
|                   Universal SKILL.md                        |
|  (Vendor-neutral, model-agnostic, tool-agnostic format)    |
+-----------------------------------------------------------+
                |
                v
+-----------------------------------------------------------+
|                    Compiler Pipeline                        |
|  (Transforms SKILL.md → runtime-native formats)            |
+-----------------------------------------------------------+
    |       |       |       |       |       |       |       |
    v       v       v       v       v       v       v       v
  Codex  OpenCode Cursor  Gemini  Claude  Copilot Windsurf Cline
  CLI             IDE     CLI     Code            IDE     RooCode
```

The architecture has three invariants:

1. **One source of truth** — SKILL.md is the canonical definition. Runtime adapters are generated, not authored.
2. **Fallback-first design** — Every capability defines 4 tiers. No single runtime capability gap breaks a workflow.
3. **Deterministic compilation** — Same SKILL.md + same runtime adapter = same agent behavior. No runtime-specific branching in source.

---

## 7-Layer Design

The pack is organized into 7 layers, each with a distinct responsibility. v6.0.0 removes the compilation layer (Layer 5) because the same SKILL.md is now native to all runtimes.

```
Layer 1: Schema       — JSON Schema definitions for all data structures
Layer 2: Authoring    — 8-block template, frontmatter spec, style spec
Layer 3: Cache        — 4-tier prompt-caching architecture (Tier 0-4)
Layer 4: Validation   — v6 contract enforcement, vendor lock-in, refs
Layer 5: Distribution — Pack manifest, CI/CD, enterprise deployment
Layer 6: Testing      — Capability testing, fallback verification
Layer 7: Security     — Constitutional guardrails, OWASP, refusal rules
```

### Layer 1 — Schema

Defines the formal data structures used across the pack.

- `shared/schemas/skill-manifest.schema.json` — SKILL.md frontmatter schema (v2 with `intent_triggers` and `cache_tier`)
- `shared/schemas/guardrails.schema.json` — Constitutional guardrail rules
- `shared/schemas/ledger-entry.schema.json` — Session tracking ledger
- `shared/schemas/risk-assessment.schema.json` — Risk assessment output
- `shared/schemas/brain-document.schema.json` — Brain document format

### Layer 2 — Authoring

Defines how skills are authored. v6.0.0 introduces the 8-block template.

- `SCHEMA.md` — Full specification for the SKILL.md universal format
- `shared/standards/frontmatter-spec.md` — Frontmatter field definitions
- `shared/standards/style-spec.md` — 12 writing tricks, banned vocabulary, conformance check
- `shared/standards/naming-conventions.md` — Skill naming conventions

### Layer 3 — Cache (new in v6)

The 4-tier prompt-caching architecture. Every skill declares its `cache_tier` in frontmatter.

| Tier | What | Cached for | When loaded |
|------|------|------------|-------------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Always | Session start |
| 1 | Core reasoning (synarc-core, negative-prompts, cognition-layer, schemas) | Always-on | Session start |
| 2 | Active domain skill (debug-engineer, architect, security-engineer, etc.) | Per task | On intent match |
| 3 | Skill references (`skills/<id>/references/*.md`) | Lazy | On first reference |
| 4 | Dynamic context (project files, tool outputs) | Never | Per turn |

Anti-cache rules: Tiers 0-2 must not contain timestamps, session IDs, user data, or tool-result echoes. Dynamic content goes to Tier 4.

### Layer 4 — Validation

Ensures skills conform to the v6 contract.

- Required fields: name, description, version, priority, intent_triggers, cache_tier
- Description: 40-1024 chars, 3rd-person, no banned starters
- intent_triggers: array with ≥ 2 elements
- cache_tier: one of core | domain | reference | context | dynamic
- priority: one of critical | high | normal | low
- No v5 deprecated fields: skill_type, activation, cache, parent, compatibility, minimumVersion
- No vendor-locked name tokens: anthropic, claude, gpt, gemini
- No mojibake in body
- Mandatory 8-block template sections: ## Output format, ## Gotchas, ## References
- Size cap: SKILL.md ≤ 50 KB (hard), ≤ 30 KB (warn)

Scripts:
- `scripts/validate-skills.ps1` — v6 contract validator
- `scripts/check-vendor-lockin.ps1` — vendor-lock scan
- `scripts/check-refs.ps1` — markdown link resolution
- `scripts/measure-skills.ps1` — size, token, and cache-tier measurement

### Layer 5 — Distribution

Manages pack distribution at scale. v6.0.0 removes the compile step.

- `manifest.yaml` — signed pack manifest with integrity hashes, generated by `scripts/sync-v6.ps1`
- `.claude-plugin/marketplace.json` — marketplace catalog
- `package.json` — npm scripts: `sync`, `validate`, `measure`, `lint`, `test`
- SHA-256 integrity hash per skill + combined pack hash

### Layer 6 — Testing

Verifies skills work correctly across runtimes.

- `scripts/test-fallbacks.ps1` — capability testing per runtime
- Cross-runtime behavior consistency checks
- Fallback tier verification
- Guardrail enforcement testing

### Layer 7 — Security

Manages constitutional guardrails, OWASP mapping, refusal rules.

- `shared/guardrails/constitutional-rules.yaml` — Universal rules for all skills
- `skills/<skill>/guardrails.yaml` — Skill-specific overrides
- `skills/synarc-core/guardrails.yaml` — Core runtime rules
- `skills/negative-prompts/SKILL.md` — 14 ban categories (S1-S14) with refusal rules

---

## Compiler Pattern (removed in v6)

In v5.x, the compiler transformed SKILL.md into runtime-native formats. In v6.0.0, this layer is removed: the same SKILL.md is read natively by every runtime. There is no compile step, no adapter, and no transformation.

The 4-tier cache architecture replaces the compile step as the runtime optimization. Agents pre-warm the cache for Tiers 0-2 (header, core, active skill) and amortize the cost across many turns. The cache is content-addressed; identical content is shared across runtimes.

The activation flow is the same on every runtime:

```pseudocode
FUNCTION Activate(user_intent):
  FOR skill IN all_skills:
    FOR trigger IN skill.intent_triggers:
      IF user_intent matches trigger:
        LOAD skill.SKILL.md INTO TIER-2 CACHE
        RETURN skill

  # Fallback: Tier 1 (synarc-core) is always loaded
  RETURN synarc-core
```

The activation is deterministic — the same input always produces the same skill selection. The only runtime state is the cache; the activation logic is identical across Codex, OpenCode, Cursor, Gemini CLI, Claude Code, Copilot, Windsurf, Cline, and RooCode.

---

## Fallback Tier System

Every capability defines a 4-tier fallback chain. This is the core reliability mechanism.

| Tier | Name | Token Cost | Reliability | Availability |
|------|------|-----------|-------------|-------------|
| 1 | Native Execution | Lowest | Highest | Agent has built-in support |
| 2 | External Integration | Medium | High | Agent supports MCP/external APIs |
| 3 | Manual Workflow | Higher | Medium | Agent can output text instructions |
| 4 | Human-Assisted | Highest | Variable | Always available |

**Fallback resolution:**
```pseudocode
FUNCTION ExecuteCapability(capability, context):
  IF capability.Tier1.IsAvailable(context):
    RETURN capability.Tier1.Execute(context)
  ELSE IF capability.Tier2.IsAvailable(context):
    RETURN capability.Tier2.Execute(context)
  ELSE IF capability.Tier3.IsAvailable(context):
    RETURN capability.Tier3.Execute(context)
  ELSE:
    RETURN capability.Tier4.Execute(context)
```

Tier availability is determined by runtime detection (S0.1 in synarc-core). Each runtime adapter defines which tiers are available for each capability.

**Example — Change Classification:**
- Tier 1: Agent classifies natively via built-in prompt patterns
- Tier 2: Agent calls external classification API
- Tier 3: Agent follows manual WorkType taxonomy from SKILL.md
- Tier 4: Agent produces structured output for human classification

---

## Dependency Resolution Model (removed in v6)

v5.x had a `dependencies:` block per skill (`synarc-core: ">=5.0.0"`). v6.0.0 removes this block. The relationship between skills is now declared by the `cache_tier` field:

- `cache_tier: core` skills are loaded for every engineering task (synarc-core, negative-prompts, cognition-layer, schemas). They form the "always-on" foundation.
- `cache_tier: domain` skills are loaded per task on intent match. They depend implicitly on Tier 1 being loaded first.
- `cache_tier: reference` and `cache_tier: context` are lazy tiers for per-skill references and per-task context.

The dependency is a runtime cache contract, not a manifest declaration. A domain skill assumes Tier 1 is loaded; it does not declare it as a dependency.

**Anti-cache rules for Tier 1 skills:**

- No timestamps, no session IDs, no user data
- No tool result echoes (the tool results live in Tier 4)
- No environment-specific values

This is what makes the cache work: Tier 1 content is identical across all sessions, all users, all tasks.

---

## Security Model — Constitutional Guardrails

The security model is based on **constitutional guardrails** — deterministic rules that cannot be bypassed by user instruction.

### Layers of Defense

```
Layer 1: Refusal Rules        — Block prohibited actions
Layer 2: Safety Constraints   — Enforce secure patterns
Layer 3: Honesty Rules        — Capability boundaries
Layer 4: Escalation Policy    — Auto-escalate on critical events
```

### Guardrail Types

| Type | Severity | Behavior |
|------|----------|----------|
| Refusal | block | Halt execution, emit refusal response |
| Constraint | strict | Enforce pattern, do not violate |
| Constraint | recommended | Warn on violation, allow with note |
| Honesty | informational | Declare capability boundary |

### Source Files

- `shared/guardrails/constitutional-rules.yaml` — Universal rules for all skills
- `skills/<skill>/guardrails.yaml` — Skill-specific overrides
- `skills/synarc-core/guardrails.yaml` — Core runtime rules

### Key Security Principles

1. **Deterministic enforcement** — Same input always produces same guardrail decision
2. **No override by user instruction** — User cannot lower guardrail severity
3. **Defense in depth** — Multiple overlapping guardrails for critical domains
4. **Auditable** — All guardrail violations are logged in the session ledger
5. **OWASP mapped** — Refusal rules reference OWASP LLM categories

---

## Directory Structure Reference

```
synarc-universal/
├── AGENTS.md                          # Universal activation file (v6.0.0 with cache tiers)
├── manifest.yaml                      # Pack manifest with integrity hashes (auto-generated)
├── SCHEMA.md                          # SKILL.md universal format specification
├── package.json                       # npm scripts: sync, validate, measure, lint, test
│
├── docs/                              # Documentation
│   ├── installation.md                # Per-agent installation guide
│   ├── compatibility.md               # Capability × runtime matrix
│   ├── architecture.md                # This file — architecture overview
│   ├── usage.md                       # Usage guide & examples
│   ├── enterprise-deployment.md       # Enterprise-scale deployment guide
│   └── migration-guide.md             # v4→v5 and v5→v6 migration
│
├── skills/                            # All 40 domain skills (8-14 KB each)
│   ├── synarc-core/                   # Tier 1, critical — core runtime
│   │   ├── SKILL.md                   # 9 KB, 8-block template
│   │   ├── skill.yaml                 # v6 manifest
│   │   ├── guardrails.yaml            # Core safety rules
│   │   ├── CHANGELOG.md               # Version history
│   │   └── references/                # 10 reference files (Tier 3)
│   │
│   ├── [40 skill directories, each with SKILL.md, skill.yaml, guardrails.yaml, CHANGELOG.md]
│   │
│
├── shared/
│   ├── workflows/                     # Canonical workflow definitions (referenced by skills)
│   │   ├── change-classification.md
│   │   ├── risk-assessment.md
│   │   ├── session-tracking.md
│   │   ├── quality-gates.md
│   │   ├── error-intelligence.md
│   │   └── context-injection.md
│   │
│   ├── guardrails/
│   │   └── constitutional-rules.yaml  # Universal safety rules
│   │
│   ├── schemas/                       # JSON Schema definitions
│   │   ├── skill-manifest.schema.json # v2 with intent_triggers + cache_tier
│   │   ├── guardrails.schema.json
│   │   ├── ledger-entry.schema.json
│   │   ├── risk-assessment.schema.json
│   │   └── brain-document.schema.json
│   │
│   ├── standards/
│   │   ├── frontmatter-spec.md        # v6 frontmatter contract
│   │   ├── style-spec.md              # 12 writing tricks, banned vocabulary
│   │   └── naming-conventions.md
│   │
│   └── runtime-adapters/              # Per-runtime notes (advisory; no compile step)
│       ├── codex.md
│       ├── opencode.md
│       ├── cursor.md
│       ├── gemini-cli.md
│       ├── claude-code.md
│       ├── copilot.md
│       ├── windsurf.md
│       ├── cline.md
│       └── roo-code.md
│
└── scripts/
    ├── sync-v6.ps1                    # Regenerate manifest, skill.yaml, marketplace.json
    ├── validate-skills.ps1            # v6 contract validator
    ├── measure-skills.ps1             # Size, token, cache-tier measurement
    ├── check-vendor-lockin.ps1        # Vendor lock-in scanner
    ├── check-refs.ps1                 # Markdown reference resolver
    ├── test-fallbacks.ps1             # Capability tier tests
    └── generate-manifest.ps1          # Legacy; use sync-v6.ps1
```
