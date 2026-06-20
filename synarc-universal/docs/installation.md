---
title: Installation Guide â€” Synarc Universal Skill Pack
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

# Synarc Universal â€” Installation Guide (v6.5.0)

Synarc v6.5.0 ships **56 skills** plus the Cognition Mesh runtime. The pack supports **8 active AI coding agents**. Every install path is verified end-to-end by `node install.js --verify`.

---

## TL;DR â€” One command for any project

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

## Scenarios

The installer is **scenario-based** — it auto-detects your project state and offers the right action. You can also invoke any scenario directly with a verb sub-command.

### Available sub-commands

| Sub-command | Purpose |
|-------------|---------|
| `node install.js` | Interactive picker (default) |
| `node install.js fresh` | Fresh-project install |
| `node install.js add <editor>` | Add an editor to a project with Synarc |
| `node install.js remove <editor>` | Remove an editor from a project |
| `node install.js verify` | Per-editor check (alias for `--verify`) |
| `node install.js status` | Read `synarc.lock.json`; no writes |
| `node install.js doctor` | verify + Node/git diagnostics |
| `node install.js migrate-v5` | Detect & migrate v5 plugin files |

Flags `--target <id>` (repeatable), `--target all`, `--yes`, `--global`, `--dry-run`, `--json` work with any sub-command.

### Scenario 1: Fresh project

**When to use this** — Brand new project, no editor-specific config exists yet (no `.cursor/`, `.claude-plugin/`, `AGENTS.md`, etc.).

**What happens:** The installer detects no markers, classifies the scenario as `fresh`, and shows a numbered picker. You choose one or more editors (e.g. `1,4` for Claude Code + Cursor, or `a` for all). The installer then writes the right config file for each.

**Command:**

```bash
node synarc-universal/scripts/install.js
```

**Expected output:**

```
Synarc Universal v6.5.0 - Installer
Target: /your/project  (Node 22.12.0)

No editor markers found.
Scenario: Fresh project

Which editor(s) do you want to install Synarc for?
  1) Claude Code (claude-code)
  2) Codex CLI (codex)
  3) OpenCode (opencode)
  4) Cursor (cursor)
  5) Windsurf (windsurf)
  6) GitHub Copilot (copilot)
  7) Gemini CLI (gemini-cli)
  8) Cline (cline)
  a) All editors
Enter one number, or comma-separated list (e.g. 1,3).
```

**What gets written:**

| Editor | Path | Format |
|--------|------|--------|
| Claude Code | `.claude-plugin/plugin.json` | Native plugin manifest |
| Codex CLI / OpenCode | `AGENTS.md` | Intent-based activation |
| Cursor | `.cursor/rules/synarc-core.mdc` | YAML frontmatter |
| Windsurf | `.windsurfrules` | Plain markdown rule |
| Copilot | `.github/copilot-instructions.md` (appended) | Markdown instructions |
| Gemini CLI | `GEMINI.md` (generated) | AGENTS.md + adapter |
| Cline | `.cline/skills/<skill>/SKILL.md` (all 56) | Per-skill SKILL.md |

Plus: `synarc.lock.json` recording the install.

### Scenario 2: Add an editor to existing project

**When to use this** — Synarc is already installed for one editor; you want to add another without touching what's there.

**What happens:** The installer detects the existing marker, reads the lock file, and prompts to add the missing editor.

**Command:**

```bash
node synarc-universal/scripts/install.js add <editor-id>
```

**Expected output:**

```
Synarc Universal v6.5.0 - Add Editor
Target: /your/project
Adding: Cursor

Installing for: Cursor
  [+] ./.cursor/rules/synarc-core.mdc
  [+] synarc.lock.json updated (2 editors)
```

**What gets written:** Only the new editor's file (e.g. `.cursor/rules/synarc-core.mdc`). All existing editor configs and the lock file are merged, not replaced.

### Scenario 3: Multi-editor project

**When to use this** — Your project has 2+ editors configured. The installer detects them all and verifies each.

**Command:**

```bash
node synarc-universal/scripts/install.js verify
```

**Expected output:**

```
Synarc Universal v6.5.0 - Verification
Target: /your/project

  [+] PASS  Claude Code          .claude-plugin/plugin.json (1317 bytes)
  [+] PASS  Cursor               .cursor/rules/synarc-core.mdc (1429 bytes)

Verification: 2 pass, 0 fail of 8 editors.
```

To add a third editor to the same project, use the `add` sub-command from Scenario 2.

### Scenario 4: Remove an editor

**When to use this** — You stopped using one editor and want to clean up its Synarc config.

**Command:**

```bash
node synarc-universal/scripts/install.js remove <editor-id>
```

**Expected output:**

```
Synarc Universal v6.5.0 - Remove Editor
Target: /your/project
  [+] removed .cursor/rules/synarc-core.mdc
  [+] updated synarc.lock.json (1 editors left)
```

**What gets written:** Nothing. The editor's config file is removed; the lock file is updated (or removed entirely if no editors left). All other editor configs are untouched.

### Scenario 5: Migrate from v5 plugin files

**When to use this** — You have v5 plugin files (`plugins/synarc/`, `.cursorrules`, `.clinerules`) and want to upgrade to v6.5.0 in place.

**What happens:** The installer backs up the v5 files to `.synarc-v5-backup-<timestamp>/`, removes them, and runs a fresh install for the current editor set.

**Command:**

```bash
node synarc-universal/scripts/install.js migrate-v5
```

**Expected output:**

```
Synarc Universal v6.5.0 - v5 Migration
Target: /your/project
v5 files found: plugins/synarc/, .cursorrules, .clinerules

  [+] backed up plugins/synarc/
  [+] backed up .cursorrules
  [+] backed up .clinerules
  [+] moved .cursorrules to backup
  [+] moved .clinerules to backup
  [+] removed plugins/synarc/
Running fresh install for current editor set...
```

**What gets written:** `.synarc-v5-backup-<timestamp>/` directory (the v5 files) + new editor config + lock file. Original v5 files in the project root are gone.

### Scenario 6: CI / scripted install (no prompts)

**When to use this** — Running in CI, a Docker build, or a shell script. You don't want the interactive picker; you want deterministic, non-blocking output.

**Command:**

```bash
node synarc-universal/scripts/install.js --yes
```

**Expected output:**

```
Synarc Universal v6.5.0 - Fresh Install
Target: /your/project

Installing for: Codex CLI
  [+] ./AGENTS.md
Installing for: OpenCode
  [~] ./AGENTS.md (already present)
  [+] synarc.lock.json written (2 targets)
```

`--yes` defaults to Codex + OpenCode (the AGENTS.md fallback pair). For specific editors in CI:

```bash
node synarc-universal/scripts/install.js --target cursor --target windsurf --yes
```

**Flags for non-interactive use:** `--yes` / `-y` (skip prompts), `--quiet` / `-q` (minimal output), `--json` (machine-readable), `--dry-run` (show what would happen, write nothing).

### Scenario classification logic

The installer classifies your project into one of these scenarios on every run:

| Detected state | Scenario | Action |
|---|---|---|
| No markers, no lock file | `fresh` | Picker: which editor(s)? |
| Lock file, 0 markers | `fresh` | Picker: which editor(s)? |
| Lock file, 1 marker, missing editors | `add` | Picker: which editor to add? |
| Lock file, 2+ markers | `multi` | Confirm re-install? |
| Lock file, all editors present | `upgrade` | Confirm re-install / upgrade? |
| `plugins/synarc/`, `.cursorrules`, or `.clinerules` | `migrate-v5` | Back up v5 + install v6.5.0 |

You can override classification by using the verb sub-commands directly (`fresh`, `add`, `remove`, `migrate-v5`).

---
## What you get

- **56 skills** â€” `synarc-universal/skills/` covers engineering, AI-era, product, design, quality, security, data, ML, leadership, and industry verticals.
- **Cognition Mesh** â€” multi-role collaboration in `synarc-core`.
- **Intent Contracts** â€” formal agent commitments, per-WorkType templates, post-execution verification, audit trail, rollback-to-intent.
- **Editor-native formats** â€” each editor gets the file format it actually reads (`.mdc`, `.windsurfrules`, `GEMINI.md`, etc.), not just a copy of the AGENTS.md.

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
| _Roo Code_ | _shut down 2026-05-15_ | _migrate to Cline_ | â€” | â€” |

---

## Per-editor deep dive

### 1. Claude Code (Recommended)

Claude Code has a native plugin marketplace. This is the fastest path.

**Option A â€” Plugin marketplace (preferred)**

```bash
claude plugin marketplace add upflame-labs/synarc
claude plugin install synarc
```

The `synarc` plugin bundles all 56 skills as reference files. One install activates everything.

**Option B â€” Local clone + auto-install**

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js --target claude-code
```

The installer writes `.claude-plugin/plugin.json` in the project root. The plugin's `entrypoint` points to `synarc-universal/AGENTS.md`, so Claude Code loads the full pack on session start.

**Option C â€” Global skills directory (per-skill)**

```bash
# bash
cp -r synarc-universal/skills/ ~/.claude/skills/synarc-universal/

# PowerShell
Copy-Item synarc-universal/skills/ ~/.claude/skills/synarc-universal/ -Recurse
```

**What gets written** â€” `.claude-plugin/plugin.json` (1.3 KB). Brain directory (`brain/`) is auto-created on first session.

**Verify** â€” `claude plugin list` shows `synarc`. Trigger a classification prompt â€” the headers `WorkType`, `Risk`, `Scale` should appear in Claude's response.

---

### 2. Codex CLI

Codex reads `AGENTS.md` from the repository root.

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js --target codex
```

This copies `synarc-universal/AGENTS.md` to `./AGENTS.md` in the project root. Keep `synarc-universal/` reachable from the project tree (same repo or submodule) so the skill references resolve.

**What gets written** â€” `AGENTS.md` (~10 KB). Codex loads it on every session start.

**Verify** â€” Start a Codex session and ask: "What is the WorkType for adding a new API endpoint?" Synarc classification headers should appear.

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

**What gets written** â€” `AGENTS.md` (~10 KB) at project root, or `~/.config/opencode/AGENTS.md` with `--global`.

**Verify** â€” Run a task that matches a skill intent (e.g., "review this PR for security issues"). The corresponding skill's behavior activates automatically.

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

**What gets written** â€” `.cursor/rules/synarc-core.mdc` (1.4 KB).

**Verify** â€” In Cursor Chat or Inline mode, trigger a skill intent. The agent should apply the rule and show classification headers.

---

### 5. Windsurf

Windsurf reads `.windsurfrules` from the repository root (Cascade agent, VS Code-based).

```bash
node synarc-universal/scripts/install.js --target windsurf
```

The installer writes the compiled Windsurf rule (sourced from `synarc-universal/shared/runtime-adapters/windsurf.md`) to `.windsurfrules` in the project root.

**What gets written** â€” `.windsurfrules` (1.8 KB).

**Verify** â€” Start a Cascade session. Synarc behaviors should be active â€” ask about a change and the agent should classify it.

---

### 6. GitHub Copilot

Copilot reads `.github/copilot-instructions.md` from the repository root.

```bash
node synarc-universal/scripts/install.js --target copilot
```

The installer **appends** the compiled Copilot adapter (sourced from `synarc-universal/shared/runtime-adapters/copilot.md`) to `.github/copilot-instructions.md`. If the file already exists, your existing instructions are preserved and Synarc content is added after a separator.

**What gets written** â€” `.github/copilot-instructions.md` (appended, ~1.8 KB added).

**Verify** â€” In a Copilot Chat session, ask about a code change. Synarc classification should appear in the response.

---

### 7. Gemini CLI

Gemini CLI reads `GEMINI.md` from the repository root. Gemini has a 1M-token context window, so the full 56-skill pack fits comfortably.

```bash
node synarc-universal/scripts/install.js --target gemini-cli
```

The installer **generates** `GEMINI.md` from the `AGENTS.md` template plus the Gemini CLI runtime adapter, with a timestamp header.

**What gets written** â€” `GEMINI.md` (~12 KB, generated, includes runtime adapter).

**Verify** â€” Start a Gemini CLI session. Skill intents are recognized and matched automatically.

---

### 8. Cline

Cline reads `SKILL.md` files natively from `.cline/skills/` (project) or `~/.cline/skills/` (personal global).

```bash
# Project-level
node synarc-universal/scripts/install.js --target cline

# Personal global (every project on this machine)
node synarc-universal/scripts/install.js --target cline --global
```

The installer copies all 56 skill directories from `synarc-universal/skills/` into `.cline/skills/`. Re-runs are idempotent â€” existing skills are not overwritten.

**What gets written** â€” `.cline/skills/<skill>/SKILL.md` for all 56 skills (1.8 MB total).

**Verify** â€” Ask a domain-specific engineering question. Cline should activate the corresponding skill.

---

## Roo Code â†’ Cline (Migration)

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

**Editor â†’ file mapping** (what `--verify` checks):

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

**Exit code** â€” `0` on full pass, `1` if any editor's file is missing or too small.

---

## Post-Installation Checklist

| Check | Expected |
|---|---|
| Skill pack files present | `synarc-universal/skills/`, `shared/`, `AGENTS.md`, `manifest.yaml` |
| Editor-specific config in place | Run `node install.js --verify` â€” all 8 editors should show PASS |
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
| Roo Code still referenced | Roo Code shut down 2026-05-15 | Migrate to Cline (`.roo/skills/` â†’ `.cline/skills/`) |
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

The full `synarc@upflame-marketplace` install is recommended for most users â€” it bundles all roles as reference files with no extra install commands.