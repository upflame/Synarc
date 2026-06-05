---
title: Migration Guide — v4 (Claude Plugin) to v5 (Universal)
description: Migration guide for transitioning from Synarc v4 Claude plugin to v5 universal skill pack
version: 1.0.0
schema: skill-pack/v1
---

# Migration Guide — v4 (Claude Plugin) to v5 (Universal)

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
1. Restore original `.claude-plugin/` directories
2. Revert frontmatter changes
3. The original v4 structure remains in `plugins/` directory

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
