---
title: Installation Guide — Synarc Universal Skill Pack
description: One-command install + per-editor deep dive for Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and Cline. v6.6.4.
version: 6.6.4
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

# Synarc Universal — Installation Guide (v6.6.4)

Synarc v6.6.4 ships **56 skills** plus the engineering intelligence runtime. The pack supports **8 active AI coding agents**. Every install path is verified end-to-end by `synarc verify`.

> **Looking for the CLI flags and exit codes?** See the full [CLI reference](./cli-reference.md).

---

## On this page

- [TL;DR — One command for any project](#tldr-one-command-for-any-project)
- [Scenarios](#scenarios)
- [What you get](#what-you-get)
- [Editor compatibility matrix](#editor-compatibility-matrix)
- [Per-editor deep dive](#per-editor-deep-dive)
- [Roo Code → Cline (Migration)](#roo-code--cline-migration)
- [Verification reference](#verification-reference)
- [Post-Installation Checklist](#post-installation-checklist)
- [Troubleshooting](#troubleshooting)
- [Managing Multiple Projects](#managing-multiple-projects)
- [Per-Skill Plugin Install (Claude Code)](#per-skill-plugin-install-claude-code)

---

## TL;DR — One command for any project

```bash
npm i -g synarc
synarc fresh --yes

# Verify
synarc verify
```

The installer **auto-detects** your editor markers (`.cursor/`, `.claude/`, `.github/`, etc.) and installs the right file for each one. If nothing is detected, it installs the AGENTS.md fallback (Codex / OpenCode).

To force every editor in one shot:

```bash
synarc --target all
```

To install for a specific editor:

```bash
synarc fresh --target cursor
synarc add windsurf copilot
```

To verify the install:

```bash
synarc verify
```

Expected output:

```text
  ✔ Claude Code   .claude-plugin/plugin.json        1.3 KB
  ✔ Codex CLI     AGENTS.md                         10  KB
  ✔ OpenCode      AGENTS.md                         10  KB
  ✔ Cursor        .cursor/rules/synarc-core.mdc     1.4 KB
  ✔ Windsurf      .windsurfrules                    1.8 KB
  ✔ GitHub Copilot .github/copilot-instructions.md  1.8 KB
  ✔ Gemini CLI    GEMINI.md                         12  KB
  ✔ Cline         .cline/skills/*/SKILL.md          56 skills

  ✔ synarc.lock.json written
  ✔ 8/8 editors verified
```

---

## Scenarios

The installer is **scenario-based** — it auto-detects your project state and offers the right action. You can also invoke any scenario directly with a verb.

### Available sub-commands

| Sub-command | Purpose |
|---|---|
| `synarc` | Interactive picker (default) |
| `synarc fresh` | Fresh-project install |
| `synarc add <editor>` | Add an editor to a project with Synarc |
| `synarc remove <editor>` | Remove an editor from a project |
| `synarc verify` | Per-editor check |
| `synarc status` | Read `synarc.lock.json`; no writes |
| `synarc doctor` | verify + Node/git diagnostics |
| `synarc migrate-v5` | Detect & migrate v5 plugin files |
| `synarc list` | List every available skill and editor |

Flags `--target <id>` (repeatable), `--target all`, `--yes`, `--global`, `--dry-run`, `--json`, `--verbose`, `--quiet` work with any sub-command. Full reference: [CLI docs](./cli-reference.md).

### Scenario 1: Fresh project

```bash
synarc fresh --target all --yes
```

Installs every editor in one shot, non-interactively.

### Scenario 2: Add an editor

```bash
synarc add cursor windsurf
```

Writes only the missing editor files; never overwrites.

### Scenario 3: Multi-editor project

```bash
synarc --target cursor --target claude-code --target cline --yes
```

Mix and match with repeatable `--target` flags.

### Scenario 4: Remove an editor

```bash
synarc remove cursor
```

Deletes the editor-specific file and updates the lock file.

### Scenario 5: Migrate from v5

```bash
synarc migrate-v5
```

Detects old v5 plugin files and converts them. See the full [migration guide](./migration-guide.md).

### Scenario 6: CI / scripted install

```bash
synarc fresh --target all --yes --json
synarc verify --json
```

`--json` makes output machine-readable. Exit code 0 on full pass.

---

## What you get

After install, your project has:

- **Per-editor config** — the file each agent reads (`.cursor/rules/synarc-core.mdc`, etc.)
- **`synarc.lock.json`** — records the install (version, targets, file paths, byte counts)
- **`brain/` directory** (for Claude Code, OpenCode, Cline) — created on first session
- **Reference to the universal pack** — your project is wired into the shared `synarc-universal/` source

The universal pack itself is **read-only** at runtime. It is the source of truth; your project only writes the per-editor file.

---

## Editor compatibility matrix

| Editor | Transport | File written | Min size |
|---|---|---|---|
| Claude Code | Native plugin | `.claude-plugin/plugin.json` | 500 B |
| Codex CLI | AGENTS.md | `AGENTS.md` | 500 B |
| OpenCode | AGENTS.md | `AGENTS.md` (or `~/.config/opencode/AGENTS.md` global) | 500 B |
| Cursor | `.mdc` rules | `.cursor/rules/synarc-core.mdc` | 200 B |
| Windsurf | `.windsurfrules` | `.windsurfrules` | 200 B |
| GitHub Copilot | copilot-instructions | `.github/copilot-instructions.md` (appended) | 200 B |
| Gemini CLI | GEMINI.md (generated) | `GEMINI.md` | 500 B |
| Cline | SKILL.md per skill | `.cline/skills/<skill>/SKILL.md` | per-skill files present |

Full capability matrix: [compatibility.md](./compatibility.md).

---

## Per-editor deep dive

### 1. Claude Code (Recommended)

**File written:** `.claude-plugin/plugin.json`

Synarc ships as a native plugin manifest. Claude Code loads the entire `synarc-universal/` pack as reference material and activates skills on intent.

```bash
# Single-line install
synarc fresh --target claude-code
```

**Per-skill install** (granular routing without the full pack):

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

### 2. Codex CLI

**File written:** `AGENTS.md`

Codex reads `AGENTS.md` at the project root for skill activation. The installer copies the canonical `synarc-universal/AGENTS.md` to your project root.

```bash
synarc fresh --target codex
```

### 3. OpenCode

**File written:** `AGENTS.md` (project) or `~/.config/opencode/AGENTS.md` (with `--global`)

OpenCode reads `AGENTS.md` from either the project root or the global config. Use `--global` to install once for all your projects.

```bash
# Project install
synarc fresh --target opencode

# Global install (writes to your home directory)
synarc fresh --target opencode --global
```

### 4. Cursor

**File written:** `.cursor/rules/synarc-core.mdc`

Cursor uses `.mdc` rule files with YAML frontmatter. The installer writes a rule with `description`, `globs`, and `alwaysApply: true` so Cursor activates Synarc for every file.

```bash
synarc fresh --target cursor
```

### 5. Windsurf

**File written:** `.windsurfrules`

Windsurf reads a single markdown rule file at the project root. The installer writes the canonical Synarc rule.

```bash
synarc fresh --target windsurf
```

### 6. GitHub Copilot

**File written:** `.github/copilot-instructions.md` (appended)

Copilot reads repository-wide instructions. The installer **appends** Synarc to the existing file (or creates it if missing) so you do not lose your custom instructions.

```bash
synarc fresh --target copilot
```

### 7. Gemini CLI

**File written:** `GEMINI.md` (generated)

Gemini CLI reads `GEMINI.md` at the project root. The installer generates a fresh file combining the canonical `AGENTS.md` with the Gemini CLI runtime adapter.

```bash
synarc fresh --target gemini-cli
```

### 8. Cline

**File written:** `.cline/skills/<skill>/SKILL.md` (all 56)

Cline reads SKILL.md files from `.cline/skills/`. The installer copies the full 56-skill pack.

```bash
synarc fresh --target cline
```

---

## Roo Code → Cline (Migration)

**Roo Code shut down on May 15, 2026.** Its user base migrated to Cline. The SKILL.md format is identical, so the migration is a one-step rename.

### If you previously had `.roo/skills/`:

```bash
mv .roo/skills .cline/skills
```

### If you are installing fresh:

```bash
synarc fresh --target cline
```

No additional configuration needed. Cline loads SKILL.md files from `.cline/skills/` on startup.

### Cognition Mesh Activation (v6)

Once installed, the mesh activates when:

- The user intent matches 3+ activation patterns across distinct skills
- The user explicitly invokes `/mesh`
- The runtime detects a known composite task

No additional setup is required beyond the per-editor install above.

---

## Verification reference

Run `synarc verify` at any time. The output reports each editor with its expected file, size, and pass/fail status.

**Editor → file mapping** (what `--verify` checks):

| Editor | File | Min size |
|---|---|---|
| Claude Code | `.claude-plugin/plugin.json` | 500 B |
| Codex CLI | `AGENTS.md` | 500 B |
| OpenCode | `AGENTS.md` (or `~/.config/opencode/AGENTS.md` global) | 500 B |
| Cursor | `.cursor/rules/synarc-core.mdc` | 200 B |
| Windsurf | `.windsurfrules` | 200 B |
| GitHub Copilot | `.github/copilot-instructions.md` | 200 B |
| Gemini CLI | `GEMINI.md` | 500 B |
| Cline | `.cline/skills/<skill>/SKILL.md` (all 56) | per-skill files present |

**Exit code** — `0` on full pass, `1` if any editor file is missing or too small.

---

## Post-Installation Checklist

| Check | Expected |
|---|---|
| Skill pack files present | `synarc-universal/skills/`, `shared/`, `AGENTS.md`, `manifest.yaml` |
| Editor-specific config in place | Run `synarc verify` — all 8 editors should show PASS |
| Intent activation works | Skill activates when matching intent is detected |
| Fallback tiers functional | All 4 tiers degrade gracefully |
| Brain persistence (editor-dependent) | `brain/` directory created on first session (Claude Code, OpenCode, Cline) |
| Mesh activation works | `/mesh` slash command or 3+ intent phrase activates multi-role collaboration |
| Lock file | `synarc.lock.json` at project root records the install |

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Skill not activating | File not in expected location | `synarc verify` will show which file is missing |
| Missing capabilities | Wrong file format for the editor | Re-run with `synarc add <editor>` |
| Classification not appearing | Editor cannot find the rule | Check the editor's expected location in the per-editor section above |
| Agent not recognizing intents | Intent patterns differ from skill | Check `activation.triggers` in `synarc-universal/skills/<skill>/skill.yaml` |
| Mesh not triggering | No multi-intent phrase used | Try `/mesh` explicitly or use a 3+ intent prompt |
| "Source not found" error | Synarc package not installed or corrupted | Run `npm i -g synarc` to reinstall |
| Roo Code still referenced | Roo Code shut down 2026-05-15 | Migrate to Cline (`.roo/skills/` → `.cline/skills/`) |
| Want to re-install cleanly | Want a fresh install for one editor | `synarc remove <editor>` then `synarc fresh --target <editor>` |
| `npm i synarc` fails with `Cannot find module '...\synarc\scripts\postinstall.js'` | The installed version (6.6.1) was published without the postinstall script in its tarball. | Upgrade: `npm i -S synarc@latest`. For the 6.6.1 workaround: `npm i synarc@^6.6.4 --ignore-scripts && npx synarc fresh`. |
| Windows: `'true' is not recognized as an internal or external command` after `npm i synarc` | Downstream symptom of the same missing-file bug. | Same as the row above. |
| Want to install the npm package without auto-wiring editors (CI, monorepo, pre-commit) | The postinstall hook auto-detects editor markers and runs `synarc fresh` for them. | `SYNARC_SKIP_POSTINSTALL=1 npm i synarc` or `npm i synarc --ignore-scripts`. |

For more advanced diagnostics, run `synarc doctor` — it checks Node version, git availability, file permissions, pack integrity, and editor marker consistency.

---

## Managing Multiple Projects

Synarc is installed globally, so it works across all your projects:

```bash
npm i -g synarc
```

Then in each project directory:

```bash
cd my-project
synarc fresh --yes
```

---

## See also

- [CLI Reference](./cli-reference.md) — every verb, flag, exit code
- [Architecture](./architecture.md) — the 7-layer design
- [Compatibility](./compatibility.md) — capability matrix
- [Migration](./migration-guide.md) — v5 → v6.6.4
- [Enterprise Deployment](./enterprise-deployment.md) — org-scale
