---
title: Installation Guide — Synarc Universal Skill Pack
description: Per-agent installation instructions for all 9 supported AI coding agents — Codex CLI, OpenCode, Cursor, Gemini CLI, Claude Code, GitHub Copilot, Windsurf, Cline, and RooCode.
version: 1.0.0
schema: skill-pack/v1
---

# Installation Guide — Synarc Universal Skill Pack

## Overview

The Synarc Universal skill pack can be installed on any of the 9 supported AI coding agents. Each agent has a different mechanism for loading skills. This guide covers all methods.

The skill pack ships as a portable directory. All installation methods involve copying or referencing the relevant files into locations your agent reads.

## Shared Prerequisites

1. Clone or download the skill pack to your project workspace
2. The pack root contains `AGENTS.md`, `manifest.yaml`, `skills/`, `shared/`, and `docs/`
3. No package manager, runtime, or build step is required — the pack is pure Markdown + YAML

---

## Codex CLI

Codex CLI reads `AGENTS.md` from the repository root.

**Steps:**

1. Copy `synarc-universal/AGENTS.md` to your project root:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
2. Ensure the `skills/` directory is accessible (same repo or submodule)
3. Codex will auto-detect `AGENTS.md` and load all skill references on session start

**Verification:** On your next Codex session, you should see Synarc classification headers in the output.

---

## OpenCode

OpenCode reads `AGENTS.md` from the repository root.

**Steps:**

1. Copy `synarc-universal/AGENTS.md` to your project root:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
2. The `skills/` directory must be present in the same project tree
3. OpenCode loads AGENTS.md on startup and activates skills by intent matching

**Verification:** Run a task that matches a skill intent — the skill's behavior should activate automatically.

---

## Cursor

Cursor reads rules from `.cursor/rules/*.mdc` files.

**Steps:**

1. Create `.cursor/rules/` in your project root if it does not exist
2. Copy `AGENTS.md` to your project root for basic activation:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
3. For full `.mdc` rule files, run the compile script:
   ```
   pwsh synarc-universal/scripts/compile-for-runtime.ps1 -Runtime cursor -OutputDir .cursor/rules/
   ```
   Or manually create `.cursor/rules/synarc.mdc` with the skill content from `skills/synarc-core/SKILL.md`

**Verification:** In Cursor Chat or Inline mode, trigger a skill intent — the agent should apply the skill's rules.

---

## Gemini CLI

Gemini CLI references skills via `AGENTS.md` in the project root.

**Steps:**

1. Copy `synarc-universal/AGENTS.md` to your project root:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
2. Gemini CLI reads AGENTS.md on startup. With a 1M-token context window, the full skill pack fits comfortably
3. No additional configuration is needed

**Verification:** Start a Gemini CLI session — skill intents will be recognized and matched.

---

## Claude Code

Claude Code supports two installation methods.

### Method A: Install via `/sk:` Command

Run this in a Claude Code session:
```
/sk: <path-to-synarc-universal>
```
Claude Code will load the skill pack for the current session.

### Method B: Copy to Global Skills Directory

To make the skill pack available globally across all projects:
```
cp -r synarc-universal/skills/ ~/.claude/skills/synarc-universal/
```
This makes all 40 skills available in every Claude Code project.

**Verification:** Start a Claude Code session and trigger a skill intent — Synarc classifications and risk assessment should appear.

---

## GitHub Copilot

Copilot reads instructions from `.github/copilot-instructions.md`.

**Steps:**

1. Create `.github/` directory in your project root if it does not exist
2. Append or merge the relevant sections from `synarc-universal/AGENTS.md` into `.github/copilot-instructions.md`
3. The runtime adapter in `shared/runtime-adapters/copilot.md` defines which sections are compatible

**Verification:** In Copilot Chat, ask a question matching a skill intent — the behavior should reflect the skill's instructions.

---

## Windsurf

Windsurf reads rules from `.windsurfrules` in the project root.

**Steps:**

1. Create `.windsurfrules` in your project root
2. Copy `AGENTS.md` to your project root for basic activation:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
3. For full `.windsurfrules` format, run the compile script:
   ```
   pwsh synarc-universal/scripts/compile-for-runtime.ps1 -Runtime windsurf -OutputFile .windsurfrules
   ```
   Or manually create `.windsurfrules` with the skill content from `skills/synarc-core/SKILL.md`

**Verification:** Start a Cascade session — Synarc behaviors should be active.

---

## Cline

Cline reads rules from `.clinerules/` directory.

**Steps:**

1. Create `.clinerules/` in your project root
2. Copy skills from `synarc-universal/skills/` into `.clinerules/`:
   ```
   cp -r synarc-universal/skills/* .clinerules/
   ```
3. Cline loads rules from `.clinerules/` on startup

**Verification:** Ask a domain-specific engineering question — Cline should activate the corresponding skill.

---

## RooCode

RooCode reads rules from `.roorules/` directory.

**Steps:**

1. Create `.roorules/` in your project root
2. Copy skills from `synarc-universal/skills/` into `.roorules/`:
   ```
   cp -r synarc-universal/skills/* .roorules/
   ```
3. RooCode loads rules from `.roorules/` on startup

**Verification:** Start a RooCode session — domain-specific skills should activate based on intent.

---

## Post-Installation Checklist

| Check | Expected |
|-------|----------|
| Skill pack files present | `skills/`, `shared/`, `AGENTS.md`, `manifest.yaml` |
| Agent-specific config copied | Per-agent installation method above |
| Intent activation works | Skill activates when matching intent is detected |
| Fallback tiers functional | All 4 tiers degrade gracefully |
| Brain persistence (if supported) | `brain/` directory created on first session |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Skill not activating | AGENTS.md not in expected location | Verify copy path for your agent |
| Missing capabilities | Runtime adapter not applied | Check `shared/runtime-adapters/<agent>.md` |
| Classification not appearing | Skill pack not loaded | Run installation step again |
| Agent not recognizing intents | Intent patterns differ | Check `activation.triggers` in skill.yaml |

## Managing Multiple Projects

For multi-project setups, use a git submodule:
```
git submodule add <repo-url> synarc-universal
```
Then symlink or copy `AGENTS.md` to each project root as needed.
