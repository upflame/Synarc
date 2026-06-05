---
title: Installation Guide — Synarc Universal Skill Pack
description: Per-agent installation instructions for all 9 supported AI coding agents — Codex CLI, OpenCode, Cursor, Gemini CLI, Claude Code, GitHub Copilot, Windsurf, Cline, and Roo Code. Covers the v6.0.0 Cognition Mesh runtime.
version: 6.0.0
schema: skill-pack/v1
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# Installation Guide — Synarc Universal Skill Pack (v6.0.0)

## Overview

Synarc v6.0.0 ships **56 skills** (40 carried from v5 + 16 new in the v6 P0 cohort) and the **Cognition Mesh** runtime. Eleven additional skills are planned for v6.1.0 and v6.2.0 (67 total target).

The pack supports **9 AI coding agents**. Each agent reads Synarc from a different location or via a different command:

| Agent | Reads |
|-------|-------|
| Claude Code | `CLAUDE.md` + native SKILL.md (via plugin marketplace) |
| Codex CLI | `AGENTS.md` from repo root |
| OpenCode | `AGENTS.md` (project) or `~/.config/opencode/AGENTS.md` (global) |
| Cursor | `.cursor/rules/*.mdc` with YAML frontmatter |
| Windsurf | `.windsurfrules` from repo root |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Gemini CLI | `GEMINI.md` from repo root |
| Cline | SKILL.md from `.cline/skills/` (project) or `~/.cline/skills/` (global) |
| Roo Code | **Shut down 2026-05-15** — migrate to Cline |

The skill pack ships as a portable directory. No package manager, runtime, or build step is required — the pack is pure Markdown + YAML.

## Shared Prerequisites

1. Clone or download the skill pack:

   ```bash
   git clone https://github.com/upflame/Synarc.git
   cd Synarc
   ```

2. The pack root contains `AGENTS.md`, `manifest.yaml`, `skills/`, `shared/`, and `docs/`.
3. No build step, no network calls, no telemetry. All cognition is local.

---

## Claude Code (Recommended)

Claude Code ships a native plugin marketplace. This is the fastest install path.

### Method A — Plugin Marketplace (preferred)

In a Claude Code session:

```
/plugin marketplace add upflame/Synarc
/plugin install synarc@upflame-marketplace
```

The `synarc` core plugin bundles all 56 role subsystems as reference files. One install activates everything. To install a specific role plugin for granular routing:

```
/plugin install backend-engineer@upflame-marketplace
/plugin install security-engineer@upflame-marketplace
```

### Method B — Local Clone

```
git clone https://github.com/upflame/Synarc.git
/plugin marketplace add ./Synarc
/plugin install synarc@synarc-marketplace
```

### Method C — Global Skills Directory (per-skill)

```
cp -r synarc-universal/skills/ ~/.claude/skills/synarc-universal/
```

Claude Code auto-detects `/brain/` or `.claude/`. Full brain directory, hooks, and session continuity are enabled out of the box.

**Verification:** Trigger a classification prompt — the headers `WorkType`, `Risk`, `Scale` should appear.

---

## Codex CLI

Codex reads `AGENTS.md` from the repository root.

```bash
cp synarc-universal/AGENTS.md ./AGENTS.md
# Keep synarc-universal/ reachable from the project tree (same repo or submodule)
```

Codex loads `AGENTS.md` on every session start and applies intent-based activation.

**Verification:** On your next Codex session, Synarc classification headers should appear in the output.

---

## OpenCode

OpenCode (1.14.33+) reads `AGENTS.md` from the repository root, or from `~/.config/opencode/AGENTS.md` for a global install.

```bash
# Project-level
cp synarc-universal/AGENTS.md ./AGENTS.md

# Global (applies to every project on this machine)
mkdir -p ~/.config/opencode
cp synarc-universal/AGENTS.md ~/.config/opencode/AGENTS.md
```

The `skills/` directory must be present in the same project tree. OpenCode supports MCP servers, custom slash commands, and intent-based skill activation.

**Verification:** Run a task that matches a skill intent — the skill's behavior should activate automatically.

---

## Cursor

Cursor deprecated `.cursorrules` in 2025. The current format is **`.cursor/rules/*.mdc`** with YAML frontmatter.

1. Create the rules directory:

   ```bash
   mkdir -p .cursor/rules
   ```

2. Copy the rule files:

   ```bash
   cp synarc-universal/runtime-adapters/cursor/*.mdc .cursor/rules/
   ```

   > **Note:** If your checkout has the runtime adapters under `synarc-universal/shared/runtime-adapters/`, use that path instead.

3. Each `.mdc` file declares `description`, `globs`, and `alwaysApply` for automatic activation.

Cursor supports four activation modes:

| Mode | Behavior |
|------|----------|
| Always Attached | Loaded for every conversation |
| Auto Attached | Loaded when glob pattern matches the current file |
| File Match | Activated per-file-type |
| Manual | Invoked on demand via `@rule-name` |

**Verification:** In Cursor Chat or Inline mode, trigger a skill intent — the agent should apply the rule.

---

## Windsurf

Windsurf reads `.windsurfrules` from the repository root (Cascade agent, VS Code-based).

1. Create the rules file:

   ```bash
   cp synarc-universal/shared/runtime-adapters/windsurf.md .windsurfrules
   ```

2. Or paste the adapter content directly into `.windsurfrules`.

**Verification:** Start a Cascade session — Synarc behaviors should be active.

---

## GitHub Copilot

Copilot reads repository-wide rules from `.github/copilot-instructions.md`. Path-specific rules use `.github/instructions/*.md` with glob filters.

1. Create the directory if it does not exist:

   ```bash
   mkdir -p .github
   ```

2. Append the Synarc sections:

   ```bash
   cat synarc-universal/shared/runtime-adapters/copilot.md >> .github/copilot-instructions.md
   ```

**Verification:** In Copilot Chat, ask a question matching a skill intent — the behavior should reflect Synarc instructions.

---

## Gemini CLI

Gemini CLI uses `GEMINI.md` from the repository root (its own convention, separate from `AGENTS.md`).

```bash
cp synarc-universal/AGENTS.md ./GEMINI.md
```

Gemini CLI has a 1M-token context window, so the full 56-skill pack fits comfortably. No MCP server is required.

**Verification:** Start a Gemini CLI session — skill intents will be recognized and matched.

---

## Cline

Cline reads SKILL.md files natively from `.cline/skills/` (project) or `~/.cline/skills/` (personal global).

### Project-level install

```bash
mkdir -p .cline/skills
cp -r synarc-universal/skills/* .cline/skills/
```

### Personal global install (applies to every project on this machine)

```bash
mkdir -p ~/.cline/skills
cp -r synarc-universal/skills/* ~/.cline/skills/
```

**Verification:** Ask a domain-specific engineering question — Cline should activate the corresponding skill.

---

## Roo Code → Cline (Migration)

**Roo Code shut down on May 15, 2026.** Its user base migrated to **Cline** (the successor). The SKILL.md format is identical, so the migration is a one-step rename.

### If you previously had `.roo/skills/`:

```bash
mv .roo/skills .cline/skills
```

### If you are installing fresh:

```bash
mkdir -p .cline/skills
cp -r synarc-universal/skills/* .cline/skills/
```

No additional configuration is needed. Cline loads SKILL.md files from `.cline/skills/` on startup.

**Verification:** Start a Cline session — domain-specific skills should activate based on intent.

---

## Cognition Mesh Activation (v6)

Once Synarc is installed, the **Cognition Mesh** activates automatically on:

- The `/mesh` or `/team` slash command
- Intent phrasing such as "as a team", "have someone review this", "collaborate on this"
- 3+ distinct intent signals in one request (e.g., "build a checkout flow" matches PM, designer, frontend, backend, accessibility, performance, SDET, release, security)

`synarc-core` is the mesh coordinator. It detects task intent, selects the right roles, defines shared working memory, and orchestrates the conversation between them.

No additional setup is required beyond the per-agent install above.

---

## Post-Installation Checklist

| Check | Expected |
|-------|----------|
| Skill pack files present | `skills/`, `shared/`, `AGENTS.md`, `manifest.yaml` |
| Agent-specific config in place | Per-agent install method above |
| Intent activation works | Skill activates when matching intent is detected |
| Fallback tiers functional | All 4 tiers degrade gracefully |
| Brain persistence (if supported) | `brain/` directory created on first session |
| Mesh activation works | `/mesh` slash command routes through coordinator |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Skill not activating | File not in expected location | Verify the copy path matches your agent's section above |
| Missing capabilities | Runtime adapter not applied | Check `shared/runtime-adapters/<agent>.md` |
| Classification not appearing | Skill pack not loaded | Re-run the per-agent install step |
| Agent not recognizing intents | Intent patterns differ | Check `activation.triggers` in the relevant `skill.yaml` |
| Mesh not triggering | No multi-intent phrase used | Try `/mesh` explicitly or use a 3+ intent prompt |
| Roo Code still referenced | Roo Code shut down 2026-05-15 | Migrate to Cline (`.roo/skills/` → `.cline/skills/`) |

## Managing Multiple Projects

For multi-project setups, use a git submodule:

```bash
git submodule add https://github.com/upflame/Synarc.git synarc-universal
```

Then copy or symlink the per-agent entry-point file (`AGENTS.md`, `GEMINI.md`, `.windsurfrules`, etc.) into each project root as needed.

## Per-Skill Plugin Install (Claude Code)

For Claude Code users who want granular routing of a single role without the full pack:

```
/plugin install backend-engineer@upflame-marketplace
/plugin install frontend-engineer@upflame-marketplace
/plugin install security-engineer@upflame-marketplace
/plugin install sre-engineer@upflame-marketplace
/plugin install ml-engineer@upflame-marketplace
/plugin install mobile-engineer@upflame-marketplace
/plugin install devops-engineer@upflame-marketplace
/plugin install agentic-ai-engineer@upflame-marketplace
/plugin install rag-engineer@upflame-marketplace
/plugin install prompt-engineer@upflame-marketplace
/plugin install ai-safety-eval-engineer@upflame-marketplace
/plugin install product-manager@upflame-marketplace
/plugin install product-designer@upflame-marketplace
/plugin install content-designer@upflame-marketplace
/plugin install design-systems-engineer@upflame-marketplace
/plugin install sdet-engineer@upflame-marketplace
/plugin install performance-engineer@upflame-marketplace
/plugin install release-engineer@upflame-marketplace
/plugin install accessibility-engineer@upflame-marketplace
```

The full `synarc@upflame-marketplace` install is recommended for most users — it bundles all roles as reference files with no extra install commands.
