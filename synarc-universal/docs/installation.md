---
title: Installation Guide — Synarc Universal Skill Pack
description: Per-agent installation instructions for all 9 supported AI coding agents — Codex CLI, OpenCode, Cursor, Gemini CLI, Claude Code, GitHub Copilot, Windsurf, Cline, and RooCode. Covers the v6.0.0 4-tier prompt-caching architecture and intent-based activation.
version: 6.0.0
schema: skill-pack/v1
---

# Installation Guide — Synarc Universal Skill Pack (v6.0.0)

## Overview

The Synarc Universal skill pack can be installed on any of the 9 supported AI coding agents. Each agent has a different mechanism for loading skills. This guide covers all methods.

The skill pack ships as a portable directory. All installation methods involve copying or referencing the relevant files into locations your agent reads. **v6.0.0 ships the same SKILL.md files to all runtimes — no compile step is required.**

## Shared Prerequisites

1. Clone or download the skill pack to your project workspace
2. The pack root contains `AGENTS.md`, `manifest.yaml`, `skills/`, `shared/`, and `docs/`
3. No package manager, runtime, or build step is required — the pack is pure Markdown + YAML
4. Total pack is 412.9 KB across 40 SKILL.md files; each SKILL.md is 8-14 KB and fits in a single cache miss

## v6.0.0 Cache Architecture (Read This First)

Every agent should pre-warm the cache in this order to minimize per-turn cost:

| Tier | What | Cached for |
|------|------|------------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Always-on, every session |
| 1 | Core reasoning (synarc-core, negative-prompts, cognition-layer, schemas, change-intelligence, coding-agent) | Always-on, per session (~60 KB total) |
| 2 | Active domain skill (one of 40) | Per task, swapped when intent shifts (~10 KB) |
| 3 | Skill references (`skills/<id>/references/*.md`) | Lazy, on first reference |
| 4 | Dynamic context (project files, tool outputs) | Never cached |

**Anti-cache rules for Tiers 0-2:** no timestamps, no session IDs, no user data, no tool-result echoes. Dynamic content lives in Tier 4.

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

Cursor reads rules from `.cursor/rules/*.mdc` files. **In v6.0.0 the SKILL.md files are read directly — no compile step is required.**

**Steps:**

1. Create `.cursor/rules/` in your project root if it does not exist
2. Copy `AGENTS.md` to your project root for basic activation:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
3. For full `.mdc` rule files, copy the SKILL.md content directly into `.cursor/rules/synarc.mdc`:
   ```
   cp synarc-universal/skills/synarc-core/SKILL.md .cursor/rules/synarc.mdc
   ```
   The `intent_triggers` array in the frontmatter becomes the activation contract.

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

Windsurf reads rules from `.windsurfrules` in the project root. **In v6.0.0 the SKILL.md files are read directly — no compile step is required.**

**Steps:**

1. Create `.windsurfrules` in your project root
2. Copy `AGENTS.md` to your project root for basic activation:
   ```
   cp synarc-universal/AGENTS.md ./AGENTS.md
   ```
3. For full `.windsurfrules` format, copy the SKILL.md content directly:
   ```
   cp synarc-universal/skills/synarc-core/SKILL.md .windsurfrules
   ```
   The `intent_triggers` array in the frontmatter becomes the activation contract.

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
| Intent activation works | Skill activates when `intent_triggers` match user request |
| Cache tiers pre-warm | Tiers 0-1 (~60 KB) loaded on session start |
| Fallback tiers functional | All 4 fallback tiers degrade gracefully |
| Brain persistence (if supported) | `brain/` directory created on first session |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Skill not activating | AGENTS.md not in expected location | Verify copy path for your agent |
| Missing capabilities | Runtime adapter not applied | Check `shared/runtime-adapters/<agent>.md` |
| Classification not appearing | Skill pack not loaded | Run installation step again |
| Agent not recognizing intents | `intent_triggers` array differs from agent's matcher | Check `intent_triggers` in skill.yaml frontmatter |
| Cache misses every turn | Timestamps or session IDs leaked into Tier 0-2 | Check `cache_tier: core` skills for dynamic content |

## Managing Multiple Projects

For multi-project setups, use a git submodule:
```
git submodule add <repo-url> synarc-universal
```
Then symlink or copy `AGENTS.md` to each project root as needed.
