---
title: Migration Guide — v4 (Claude Plugin) → v5 (Universal) → v6 (Cached)
description: Migration guide for transitioning from Synarc v4 Claude plugin to v5 universal skill pack to v6 cached architecture
version: 6.0.0
schema: skill-pack/v1
---

# Migration Guide — v4 → v5 → v6

## Overview

Synarc has gone through three major versions:

- **v4** — Claude plugin format (`.claude-plugin/`, `parent: synarc`, `activation: contextual`)
- **v5** — Universal skill pack (SKILL.md + skill.yaml + guardrails.yaml, intent-based activation)
- **v6** — Cached universal pack (4-tier prompt-caching architecture, 8-block template, 35-38× token reduction)

## v5 → v6 migration (current)

### What changed

| Aspect | v5 | v6 |
|--------|----|----|
| Frontmatter required | name, description, version, skill_type | name, description, version, **priority**, **intent_triggers**, **cache_tier** |
| Activation | `activation: always-on\|intent-based` block | `intent_triggers: [...]` array (≥ 2 elements) |
| Cache tier | (none) | `cache_tier: core\|domain\|reference\|context\|dynamic` |
| Dependencies | `dependencies: { synarc-core: ">=5.0.0" }` block | (removed; cache_tier declares the relationship) |
| Skill size | 1-15 MB each (some 60+ MB) | 8-14 KB each (35-38× reduction) |
| Template | 12-section structure | 8-block template (frontmatter + persona + activation + workflow + decision-rules + output-format + gotchas + references + changelog) |
| Compile step | Yes (SKILL.md → runtime-native) | None (same SKILL.md runs on all 9 runtimes) |
| Total pack size | 15.67 MB | 412.9 KB |

### Step 1: Update frontmatter

**Before (v5):**

```yaml
---
name: backend-engineer
description: Backend engineering
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---
```

**After (v6):**

```yaml
---
name: backend-engineer
description: Designs backend systems with concrete triggers. Triggers on: backend, API, service, controller, repository, ...
version: 6.0.0
priority: high
intent_triggers: [backend, API, service, controller, repository, ...]
cache_tier: domain
---
```

### Step 2: Remove v5-only fields

Remove `skill_type`, `activation`, `cache`, `parent`, `compatibility`, `minimumVersion`. The validator (`scripts/validate-skills.ps1`) will fail if any of these remain.

### Step 3: Apply the 8-block template

Replace the v5 12-section structure with the 8-block template:

1. **Frontmatter** (name, description, version, priority, intent_triggers, cache_tier)
2. **Persona** (2 lines: who you are, what you never do)
3. **Activation** (when this skill activates; cache tier info)
4. **Workflow** (numbered steps with concrete outputs)
5. **Decision rules** (3-5 specific rules)
6. **Output format** (structured output schema)
7. **Gotchas** (edge cases, anti-patterns)
8. **References** (links to `shared/standards/...` or `references/...`)
9. **Changelog** (version history)

### Step 4: Apply the 12 writing tricks

The 12 tricks from `shared/standards/style-spec.md`:

1. Persona in 2 lines (3rd-person, never use "I", "We", "You")
2. "Think HOLISTICALLY and COMPREHENSIVELY before..." anchor sentence
3. "Before each tool, first explain why..." discipline
4. "NEVER refer to tool names when speaking to the user"
5. Direct imperative ("Survey the call graph", not "you should survey the call graph")
6. "Gotchas" section with edge cases
7. Flat-text refs (no nested links, no link chains)
8. Concrete templates (code blocks, structured output)
9. 3rd-person descriptions with concrete triggers
10. Stable cache prefix (frontmatter first, persona second, then body)
11. "Start with classification line on one line before X"
12. Tool etiquette (explain why before each tool call)

### Step 5: Validate

```powershell
npm run validate
npm run measure
npm run check-vendor-lockin
npm run check-refs
```

All four scripts should pass with 0 violations.

### Step 6: Sync

```powershell
npm run sync
```

This regenerates `manifest.yaml`, `skill.yaml`, and `marketplace.json` from SKILL.md frontmatter (single source of truth).

---

## v4 → v5 migration (legacy)

## Overview

Synarc v5 is a **universal skill pack** compatible with 9+ AI coding agents. It replaces the Claude-only plugin format with the open SKILL.md standard.

## What Changed

| Aspect | v4 (Claude Plugin) | v5 (Universal) |
|--------|-------------------|----------------|
| Format | Claude plugin with `.claude-plugin/` | SKILL.md + skill.yaml + guardrails.yaml |
| Frontmatter | `activation: contextual`, `parent: synarc`, `cache:` | `skill_type: [capability]`, `dependencies:` |
| Activation | Claude-specific commands (`/plugin`, `/sk:`) | Intent-based activation (`WHEN: user asks about X`) |
| Dependencies | `parent: synarc` (inheritance) | `dependencies: synarc-core: ">=5.0.0"` |
| Runtime detection | Claude-first priority | Egalitarian — all runtimes equal |
| Fallbacks | Implicit | Explicit Tier 1-4 in every capability |
| Guardrails | Implicit (scattered) | Explicit `guardrails.yaml` per skill |
| Validation | None built-in | Schema validation + CI pipeline |
| Distribution | Claude marketplace | Universal `manifest.yaml` |

## Migration Steps

### Step 1: Remove .claude-plugin Directories

Delete all `.claude-plugin/` directories from the old structure.

### Step 2: Update Frontmatter

**Before (Claude):**
```yaml
---
name: backend-engineer
activation: contextual
parent: synarc
compatibility:
  - claude-code
---
```

**After (Universal):**
```yaml
---
name: backend-engineer
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
compatible_agents:
  - codex
  - opencode
  - cursor
  - claude-code
---
```

### Step 3: Replace Inheritance References

**Before:**
```
Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors...). All synarc prohibitions apply.
```

**After:**
```
Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.
```

### Step 4: Add Fallback Tiers

Every capability block must now include all 4 fallback tiers:
- Tier 1: Native agent execution
- Tier 2: External integration
- Tier 3: Manual workflow
- Tier 4: Human-assisted

### Step 5: Add skill.yaml and guardrails.yaml

Create `skill.yaml` with machine-readable metadata and `guardrails.yaml` with constitutional safety rules.

### Step 6: Update Compatibility Table

Replace `compatibility:` field with `compatible_agents:` listing all 9 supported agents.

## Runtime-Specific Migration

### Claude Code

The skill remains fully functional. Migration impact: minimal. Frontmatter fields are additive.

### Codex CLI / OpenCode

Copy `AGENTS.md` to repo root. Skills activate via intent matching.

### Cursor / Windsurf

Compile skills using `scripts/compile-for-runtime.ps1` to generate `.mdc` / `.windsurfrules` format.

### Gemini CLI

Reference via AGENTS.md. Skills load in 1M token context.

### Copilot

Add to `.github/copilot-instructions.md`. Compact format recommended.

## Rollback

If migration issues occur:
1. Restore original `.claude-plugin/` directories from git history
2. Revert frontmatter changes
3. The v4 structure was removed during v5 cleanup — restore from git if needed

## Verification

After migration:
- [ ] All `.claude-plugin/` directories removed from new pack
- [ ] No `activation: contextual|automatic` in any frontmatter
- [ ] No `parent:` or `cache:` fields in any frontmatter
- [ ] All `compatibility:` replaced with `compatible_agents:`
- [ ] All "Inherits synarc core" replaced with dependency references
- [ ] All `/plugin` and `/sk:` references removed
- [ ] skill.yaml exists for every skill
- [ ] guardrails.yaml exists for every skill
- [ ] manifest.yaml lists all skills
- [ ] Validate-skills.ps1 passes
