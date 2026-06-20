---
title: Installation Guide — Synarc Universal Skill Pack
description: One-command install + per-editor deep dive for Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and Cline.
version: 6.5.0
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
---

# Synarc Universal — Installation Guide (v6.5.0)

Synarc v6.5.0 ships **56 skills** plus the Cognition Mesh runtime. The pack supports **8 active AI coding agents**. Every install path is verified end-to-end by `node install.js --verify`.

---

## TL;DR — One command for any project

From inside the project you want to add Synarc to:

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js
```

The installer auto-detects your editor markers (`.cursor/`, `.claude/`, `.github/`, etc.) and installs the right file for each one. If nothing is detected, it installs the AGENTS.md fallback (Codex / OpenCode). To force every editor in one shot:

```bash
node synarc-universal/scripts/install.js --target all
```

To install for a specific editor:

```bash
node synarc-universal/scripts/install.js --target cursor
node synarc-universal/scripts/install.js --target windsurf --target copilot
```

To verify the install is correct:

```bash
node synarc-universal/scripts/install.js --verify
```

Expected output:

```
  [+] PASS  Claude Code          .claude-plugin/plugin.json (1317 bytes)
  [+] PASS  Codex CLI            AGENTS.md (10174 bytes)
  [+] PASS  OpenCode             AGENTS.md (project) or ~/.config/opencode/AGENTS.md (global) (10174 bytes)
  [+] PASS  Cursor               .cursor/rules/synarc-core.mdc (1429 bytes)
  [+] PASS  Windsurf             .windsurfrules (1784 bytes)
  [+] PASS  GitHub Copilot       .github/copilot-instructions.md (1823 bytes)
  [+] PASS  Gemini CLI           GEMINI.md (12170 bytes)
  [+] PASS  Cline                .cline/skills/<skill>/SKILL.md (56 skills)

Verification: 8 pass, 0 fail of 8 editors.
```

---

## What you get

- **56 skills** — `synarc-universal/skills/` covers engineering, AI-era, product, design, quality, security, data, ML, leadership, and industry verticals.
- **Cognition Mesh** — multi-role collaboration in `synarc-core`.
- **Intent Contracts** — formal agent commitments, per-WorkType templates, post-execution verification, audit trail, rollback-to-intent.
- **Editor-native formats** — each editor gets the file format it actually reads (`.mdc`, `.windsurfrules`, `GEMINI.md`, etc.), not just a copy of the AGENTS.md.

No package manager, runtime, or build step is required. The pack is pure Markdown + YAML.

---

## Editor compatibility matrix

| Editor | What Synarc writes | Where it lives | Compatibility | Brain persistence |
|---|---|---|---|---|
| **Claude Code** | `.claude-plugin/plugin.json` | project root | Full (hooks + brain + MCP) | Yes |
| **Codex CLI** | `AGENTS.md` | project root | Full file read/write | No (AGENTS.md only) |
| **OpenCode** | `AGENTS.md` (or `~/.config/opencode/AGENTS.md` for global) | project root | Full file read/write + brain | Yes |
| **Cursor** | `.cursor/rules/synarc-core.mdc` | project root | Full IDE file access | No (session-only) |
| **Windsurf** | `.windsurfrules` | project root | Full Cascade agent | No (session-only) |
| **GitHub Copilot** | `.github/copilot-instructions.md` (appended) | project root | IDE file access | No |
| **Gemini CLI** | `GEMINI.md` | project root | 1M-token context, full access | No (session-only) |
| **Cline** | `.cline/skills/<skill>/SKILL.md` (all 56) | project root | Full read/write + terminal | Yes |
| _Roo Code_ | _shut down 2026-05-15_ | _migrate to Cline_ | — | — |

---

## Per-editor deep dive

### 1. Claude Code (Recommended)

Claude Code has a native plugin marketplace. This is the fastest path.

**Option A — Plugin marketplace (preferred)**

```bash
claude plugin marketplace add upflame-labs/synarc
claude plugin install synarc
```

The `synarc` plugin bundles all 56 skills as reference files. One install activates everything.

**Option B — Local clone + auto-install**

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js --target claude-code
```

The installer writes `.claude-plugin/plugin.json` in the project root. The plugin's `entrypoint` points to `synarc-universal/AGENTS.md`, so Claude Code loads the full pack on session start.

**Option C — Global skills directory (per-skill)**

```bash
# bash
cp -r synarc-universal/skills/ ~/.claude/skills/synarc-universal/

# PowerShell
Copy-Item synarc-universal/skills/ ~/.claude/skills/synarc-universal/ -Recurse
```

**What gets written** — `.claude-plugin/plugin.json` (1.3 KB). Brain directory (`brain/`) is auto-created on first session.

**Verify** — `claude plugin list` shows `synarc`. Trigger a classification prompt — the headers `WorkType`, `Risk`, `Scale` should appear in Claude's response.

---

### 2. Codex CLI

Codex reads `AGENTS.md` from the repository root.

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js --target codex
```

This copies `synarc-universal/AGENTS.md` to `./AGENTS.md` in the project root. Keep `synarc-universal/` reachable from the project tree (same repo or submodule) so the skill references resolve.

**What gets written** — `AGENTS.md` (~10 KB). Codex loads it on every session start.

**Verify** — Start a Codex session and ask: "What is the WorkType for adding a new API endpoint?" Synarc classification headers should appear.

---

### 3. OpenCode

OpenCode (1.14.33+) reads `AGENTS.md` from the repository root, or from `~/.config/opencode/AGENTS.md` for a global install.

```bash
# Project-level
node synarc-universal/scripts/install.js --target opencode

# Global (every project on this machine)
node synarc-universal/scripts/install.js --target opencode --global
```

The `skills/` directory must be present in the same project tree for skill references to resolve.

**What gets written** — `AGENTS.md` (~10 KB) at project root, or `~/.config/opencode/AGENTS.md` with `--global`.

**Verify** — Run a task that matches a skill intent (e.g., "review this PR for security issues"). The corresponding skill's behavior activates automatically.

---

### 4. Cursor

Cursor deprecated `.cursorrules` in 2025. The current format is **`.cursor/rules/*.mdc`** with YAML frontmatter.

```bash
node synarc-universal/scripts/install.js --target cursor
```

The installer creates `.cursor/rules/synarc-core.mdc` from the bundled source at `synarc-universal/.cursor/rules/synarc-core.mdc`. The rule declares `description`, `globs`, and `alwaysApply: true` for automatic activation.

Cursor activation modes:

| Mode | Behavior |
|---|---|
| Always Attached | Loaded for every conversation |
| Auto Attached | Loaded when glob pattern matches the current file |
| File Match | Activated per-file-type |
| Manual | Invoked on demand via `@rule-name` |

The bundled rule uses `alwaysApply: true` so Synarc is on for every conversation.

**What gets written** — `.cursor/rules/synarc-core.mdc` (1.4 KB).

**Verify** — In Cursor Chat or Inline mode, trigger a skill intent. The agent should apply the rule and show classification headers.

---

### 5. Windsurf

Windsurf reads `.windsurfrules` from the repository root (Cascade agent, VS Code-based).

```bash
node synarc-universal/scripts/install.js --target windsurf
```

The installer writes the compiled Windsurf rule (sourced from `synarc-universal/shared/runtime-adapters/windsurf.md`) to `.windsurfrules` in the project root.

**What gets written** — `.windsurfrules` (1.8 KB).

**Verify** — Start a Cascade session. Synarc behaviors should be active — ask about a change and the agent should classify it.

---

### 6. GitHub Copilot

Copilot reads `.github/copilot-instructions.md` from the repository root.

```bash
node synarc-universal/scripts/install.js --target copilot
```

The installer **appends** the compiled Copilot adapter (sourced from `synarc-universal/shared/runtime-adapters/copilot.md`) to `.github/copilot-instructions.md`. If the file already exists, your existing instructions are preserved and Synarc content is added after a separator.

**What gets written** — `.github/copilot-instructions.md` (appended, ~1.8 KB added).

**Verify** — In a Copilot Chat session, ask about a code change. Synarc classification should appear in the response.

---

### 7. Gemini CLI

Gemini CLI reads `GEMINI.md` from the repository root. Gemini has a 1M-token context window, so the full 56-skill pack fits comfortably.

```bash
node synarc-universal/scripts/install.js --target gemini-cli
```

The installer **generates** `GEMINI.md` from the `AGENTS.md` template plus the Gemini CLI runtime adapter, with a timestamp header.

**What gets written** — `GEMINI.md` (~12 KB, generated, includes runtime adapter).

**Verify** — Start a Gemini CLI session. Skill intents are recognized and matched automatically.

---

### 8. Cline

Cline reads `SKILL.md` files natively from `.cline/skills/` (project) or `~/.cline/skills/` (personal global).

```bash
# Project-level
node synarc-universal/scripts/install.js --target cline

# Personal global (every project on this machine)
node synarc-universal/scripts/install.js --target cline --global
```

The installer copies all 56 skill directories from `synarc-universal/skills/` into `.cline/skills/`. Re-runs are idempotent — existing skills are not overwritten.

**What gets written** — `.cline/skills/<skill>/SKILL.md` for all 56 skills (1.8 MB total).

**Verify** — Ask a domain-specific engineering question. Cline should activate the corresponding skill.

---

## Roo Code → Cline (Migration)

**Roo Code shut down on May 15, 2026.** Its user base migrated to Cline. The SKILL.md format is identical, so the migration is a one-step rename.

### If you previously had `.roo/skills/`:

```bash
mv .roo/skills .cline/skills
```

### If you are installing fresh:

```bash
node synarc-universal/scripts/install.js --target cline
```

---

### Cognition Mesh Activation (v6)

Once Synarc is installed, the **Cognition Mesh** activates automatically on:

- The `/mesh` or `/team` slash command (in editors that support it)
- Intent phrasing such as "as a team", "have someone review this", "collaborate on this"
- 3+ distinct intent signals in one request (e.g., "build a checkout flow" matches PM, designer, frontend, backend, accessibility, performance, SDET, release, security)

`synarc-core` is the mesh coordinator. It detects task intent, selects the right roles, defines shared working memory, and orchestrates the conversation between them.

No additional setup is required beyond the per-editor install above.

---

## Verification reference

Run `node synarc-universal/scripts/install.js --verify` at any time. The output reports each editor with its expected file, size, and pass/fail status.

**Editor → file mapping** (what `--verify` checks):

| Editor | File | Min size |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json` | 500 bytes |
| Codex CLI | `AGENTS.md` | 500 bytes |
| OpenCode | `AGENTS.md` (or `~/.config/opencode/AGENTS.md` global) | 500 bytes |
| Cursor | `.cursor/rules/synarc-core.mdc` | 200 bytes |
| Windsurf | `.windsurfrules` | 200 bytes |
| GitHub Copilot | `.github/copilot-instructions.md` | 200 bytes |
| Gemini CLI | `GEMINI.md` | 500 bytes |
| Cline | `.cline/skills/<skill>/SKILL.md` (all 56) | per-skill files present |

**Exit code** — `0` on full pass, `1` if any editor's file is missing or too small.

---

## Post-Installation Checklist

| Check | Expected |
|---|---|
| Skill pack files present | `synarc-universal/skills/`, `shared/`, `AGENTS.md`, `manifest.yaml` |
| Editor-specific config in place | Run `node install.js --verify` — all 8 editors should show PASS |
| Intent activation works | Skill activates when matching intent is detected |
| Fallback tiers functional | All 4 tiers degrade gracefully |
| Brain persistence (editor-dependent) | `brain/` directory created on first session (Claude Code, OpenCode, Cline) |
| Mesh activation works | `/mesh` slash command or 3+ intent phrase activates multi-role collaboration |
| Lock file | `synarc.lock.json` at project root records the install |

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Skill not activating | File not in expected location | `node install.js --verify` will show which file is missing |
| Missing capabilities | Wrong file format for the editor | Re-run with the correct `--target <editor-id>` |
| Classification not appearing | Editor can't find the rule | Check the editor's expected location in the per-editor section above |
| Agent not recognizing intents | Intent patterns differ from skill | Check `activation.triggers` in `synarc-universal/skills/<skill>/skill.yaml` |
| Mesh not triggering | No multi-intent phrase used | Try `/mesh` explicitly or use a 3+ intent prompt |
| "Source not found" error | The install script can't locate a source file | Verify you cloned the full repo (not a partial checkout) and `synarc-universal/` is intact |
| Roo Code still referenced | Roo Code shut down 2026-05-15 | Migrate to Cline (`.roo/skills/` → `.cline/skills/`) |
| Want to re-install cleanly | Want a fresh install for one editor | Delete the old file (e.g., `rm .windsurfrules`) and re-run `node install.js --target windsurf` |

---

## Managing Multiple Projects

For multi-project setups, use a git submodule:

```bash
git submodule add https://github.com/upflame-labs/synarc.git synarc-universal
```

Then copy or symlink the per-editor entry-point file (`AGENTS.md`, `GEMINI.md`, `.windsurfrules`, etc.) into each project root as needed, or run the installer in each project.

---

## Per-Skill Plugin Install (Claude Code)

For Claude Code users who want granular routing of a single role without the full pack:

```bash
claude plugin install backend-engineer@upflame-marketplace
claude plugin install frontend-engineer@upflame-marketplace
claude plugin install security-engineer@upflame-marketplace
claude plugin install sre-engineer@upflame-marketplace
claude plugin install ml-engineer@upflame-marketplace
claude plugin install mobile-engineer@upflame-marketplace
claude plugin install devops-engineer@upflame-marketplace
claude plugin install agentic-ai-engineer@upflame-marketplace
claude plugin install rag-engineer@upflame-marketplace
claude plugin install prompt-engineer@upflame-marketplace
claude plugin install ai-safety-eval-engineer@upflame-marketplace
claude plugin install product-manager@upflame-marketplace
claude plugin install product-designer@upflame-marketplace
claude plugin install content-designer@upflame-marketplace
claude plugin install design-systems-engineer@upflame-marketplace
claude plugin install sdet-engineer@upflame-marketplace
claude plugin install performance-engineer@upflame-marketplace
claude plugin install release-engineer@upflame-marketplace
claude plugin install accessibility-engineer@upflame-marketplace
```

The full `synarc@upflame-marketplace` install is recommended for most users — it bundles all roles as reference files with no extra install commands.