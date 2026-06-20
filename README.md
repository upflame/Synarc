# Synarc â€” Engineering Intelligence Runtime

[![Version](https://img.shields.io/badge/version-6.5.0-blue)](https://github.com/upflame-labs/synarc/releases)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)
[![Runtime](https://img.shields.io/badge/runtime-cross--platform-purple)](https://github.com/upflame-labs/synarc)
[![Build](https://img.shields.io/badge/build-passing-success)](https://github.com/upflame-labs/synarc/actions)

Structured change classification, risk assessment, intent verification, and audit trails for AI coding agents. Works with Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and Cline.

## Before / After

Without Synarc, your agent goes straight to edits:

```
> add a new API endpoint for /billing/usage

Sure â€” I'll add a route handler, update the OpenAPI spec, and add a test.
[edits 6 files, no plan, no risk check, no verification]
```

With Synarc, the same request opens an Intent Contract first:

```
> add a new API endpoint for /billing/usage

WorkType : FEATURE
Risk     : HIGH (billing domain â€” hard floor)
Scale    : SMALL
Scope    : [src/api/billing/usage.ts, src/api/billing/usage.test.ts, openapi.yaml]
Promises :
  - [x] Idempotent on duplicate POSTs
  - [x] Backward-compatible response shape
  - [x] Audit log entry per call
Verify   : scope-check, contract-check, test-run

Proceed? [Y/n] y

[edits 3 files, runs tests, reports verification verdict]
```

Same intent. Different discipline. The agent proposes a contract, you accept, it executes, it verifies.

## Install

```bash
git clone https://github.com/upflame-labs/synarc.git
cd <your-project>
node synarc-universal/scripts/install.js
```

The installer detects your editor markers (`.cursor/`, `.claude/`, `.github/`, etc.) and writes the right file for each. If nothing is detected, it asks which editors to install for.

**Or via npx once published:**

```bash
npx synarc-universal
```

### Quick install for specific editors

Copy-paste the block for the editor(s) you use. Each block assumes you've cloned the repo and want Synarc installed for a single editor in your current project.

#### Claude Code

```bash
# 1. Clone (if you haven't)
git clone https://github.com/upflame-labs/synarc.git
cd synarc

# 2. Copy the plugin manifest into your project
node synarc-universal/scripts/install.js add claude-code

# 3. Trust the plugin in Claude Code
claude plugin trust synarc
claude plugin enable synarc
```

Or use the native marketplace (faster, no clone):

```bash
claude plugin marketplace add upflame-labs/synarc
claude plugin install synarc
```

#### Codex CLI

```bash
# 1. Clone into the project you want Synarc in
git clone https://github.com/upflame-labs/synarc.git
cd <your-project>

# 2. Drop the AGENTS.md at your project root
node synarc-universal/scripts/install.js add codex

# 3. Start a Codex session - it will auto-discover AGENTS.md
codex
```

Global install (every project on this machine):

```bash
git clone https://github.com/upflame-labs/synarc.git ~/synarc
node ~/synarc/synarc-universal/scripts/install.js add codex --global
```

#### OpenCode

```bash
# 1. Clone into the project you want Synarc in
git clone https://github.com/upflame-labs/synarc.git
cd <your-project>

# 2. Drop the AGENTS.md at your project root
node synarc-universal/scripts/install.js add opencode

# 3. Start an OpenCode session - it will auto-discover AGENTS.md
opencode
```

Global install (every project on this machine):

```bash
git clone https://github.com/upflame-labs/synarc.git ~/synarc
node ~/synarc/synarc-universal/scripts/install.js add opencode --global
```

### Choose your scenario

| Your situation | Command | What happens |
|---|---|---|
| Brand new project, no editor configured | `node install.js` | Interactive picker asks which editors to install |
| Already have one editor, want to add Synarc | `node install.js add <editor>` | Installs Synarc for that editor, leaves the rest alone |
| Project with multiple editors | `node install.js add <editor>` | Installs the missing editor only |
| Want everything everywhere | `node install.js --target all` | Installs Synarc for all 8 supported editors |
| Remove Synarc from one editor | `node install.js remove <editor>` | Deletes only that editor's config file |
| Migrate from v5 plugin files | `node install.js migrate-v5` | Backs up v5 files, installs v6.5.0 |
| Just check the install | `node install.js verify` | Reports PASS/FAIL per editor |
| Read the lock file | `node install.js status` | Prints installed editors, no writes |
| Full diagnostics | `node install.js doctor` | verify + Node version + git version |

`<editor>` is one of: `claude-code`, `codex`, `opencode`, `cursor`, `windsurf`, `copilot`, `gemini-cli`, `cline`.

## Scenarios

### 1. Fresh project (no editor markers)

You have a new repo and haven't set up an editor-specific config yet. The installer doesn't know which editor to target, so it asks.

**Run:**

```bash
node synarc-universal/scripts/install.js
```

**What happens:**

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
> 1,4

Installing for: Claude Code
  [+] ./.claude-plugin/plugin.json
Installing for: Cursor
  [+] ./.cursor/rules/synarc-core.mdc
  [+] synarc.lock.json written (2 targets)
```

**What gets written:** `.claude-plugin/plugin.json` + `.cursor/rules/synarc-core.mdc` + `synarc.lock.json`.

### 2. Already have one editor

You're using Codex CLI in a project. You want to add Cursor too. The installer detects the existing `AGENTS.md` and prompts to add another.

**Run:**

```bash
node synarc-universal/scripts/install.js add cursor
```

**What happens:**

```
Synarc Universal v6.5.0 - Add Editor
Target: /your/project
Adding: Cursor

Installing for: Cursor
  [+] ./.cursor/rules/synarc-core.mdc
  [+] synarc.lock.json updated (2 editors)
```

**What gets written:** `.cursor/rules/synarc-core.mdc`. `AGENTS.md` and the lock file are left alone.

### 3. Multi-editor project

You're running Claude Code and Cursor side by side. The installer sees both markers and supports both.

**Run:**

```bash
node synarc-universal/scripts/install.js verify
```

**What happens:**

```
Synarc Universal v6.5.0 - Verification
Target: /your/project

  [+] PASS  Claude Code          .claude-plugin/plugin.json (1317 bytes)
  [+] PASS  Cursor               .cursor/rules/synarc-core.mdc (1429 bytes)

Verification: 2 pass, 0 fail of 8 editors.
```

To add a third editor:

```bash
node synarc-universal/scripts/install.js add windsurf
```

### 4. Removing an editor

You stopped using Cursor, want to clean up the rule file. The installer removes only that file and updates the lock file.

**Run:**

```bash
node synarc-universal/scripts/install.js remove cursor
```

**What happens:**

```
Synarc Universal v6.5.0 - Remove Editor
Target: /your/project
  [+] removed .cursor/rules/synarc-core.mdc
  [+] updated synarc.lock.json (1 editors left)
```

**What gets written:** nothing. The lock file is updated (or removed if no editors left). All other editor configs are untouched.

### 5. Migrating from v5 plugin

You have a v5 plugin layout (`plugins/synarc/`, `.cursorrules`, `.clinerules`). The installer backs up the v5 files, removes them, and installs v6.5.0.

**Run:**

```bash
node synarc-universal/scripts/install.js migrate-v5
```

**What happens:**

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

Installing for: Claude Code
  [+] ./.claude-plugin/plugin.json
  [+] synarc.lock.json written (1 targets)
```

**What gets written:** `.synarc-v5-backup-<timestamp>/` (backup of v5 files) + new editor config + lock file.

### 6. CI / scripted install (no prompts)

In CI or when scripting, you don't want the interactive picker. Use `--yes` (or `-y`) to skip prompts and use smart defaults.

**Run:**

```bash
node synarc-universal/scripts/install.js --yes
```

**What happens:**

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

## Verify

Run the per-editor check at any time:

```bash
node synarc-universal/scripts/install.js verify
```

Expected output on a full install:

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

Exit code `0` on full pass, `1` if anything is missing.

## Reference

### Features

| Capability | Description |
|------------|-------------|
| Intent Contracts | Propose â†’ Accept â†’ Execute â†’ Verify â†’ Fulfill lifecycle for every change |
| Change Classification | 12 WorkTypes across 7 dimensions with deterministic risk floors |
| Verification Engine | Post-execution diff analysis against contract promises |
| Audit Trail | Immutable records per contract lifecycle, rollback-to-intent |
| Session Continuity | Persistent session ledger across context resets |
| Cognition Mesh | Multi-role team collaboration with shared working memory |
| 56 Skills | Domain coverage: engineering, AI-era, product, design, quality, security, data, ML, leadership, industry verticals |
| 8 Active Runtimes | Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, Copilot, Gemini CLI, Cline (Roo Code shut down 2026-05-15) |

### Architecture

The runtime is a 7-step pipeline:

```
Classify â†’ Inject â†’ Execute â†’ Log â†’ Aggregate â†’ Checkpoint â†’ Emit
```

Deterministic and runtime-agnostic â€” same pipeline across all 8 supported editors.

**Cache architecture** (5 tiers):

| Tier | Contents | Scope |
|------|----------|-------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Session |
| 1 | Core reasoning (synarc-core, cognition-layer, schemas) | Session (~60 KB) |
| 2 | Active domain skill (one of 56) | Task (~10 KB each) |
| 3 | Skill references | Lazy-loaded |
| 4 | Dynamic context (project files, tool outputs) | Never cached |

**Scale adaptation** (auto-detected, zero config):

| Scale | Threshold | Tracking |
|-------|-----------|----------|
| NANO | Single file, single purpose | WorkType + risk only |
| MICRO | 2-10 files | CURRENT_STATE.md |
| SMALL | <5k LOC, 1-5 modules | Full brain directory |
| MEDIUM | 5k-50k LOC, team | Full ledger |
| LARGE | 50k-500k LOC, multi-service | Service-boundary tracking |
| ENTERPRISE | >500k LOC, regulated | Compliance audit trail |

### Project structure

```
synarc-universal/
|-- AGENTS.md                    # Activation entry point
|-- manifest.yaml                # Universal manifest (56 skills)
|-- package.json                 # npm package manifest
|-- scripts/
|   |-- install.js               # Scenario-based installer (--target, verify, add, remove, status, doctor, migrate-v5)
|   `-- install.ps1              # PowerShell delegate
|-- skills/                      # 56 domain skills
|   |-- synarc-core/             # Core runtime (always active)
|   |-- architect/               # System design & trade-off analysis
|   |-- backend-engineer/        # Service architecture & API design
|   |-- security-engineer/       # Threat modeling & defense
|   |-- debug-engineer/          # Systematic debugging
|   `-- ...                      # 51 additional domain skills
|-- shared/
|   |-- schemas/                 # JSON Schema definitions
|   |-- workflows/               # Canonical workflow definitions
|   |-- guardrails/              # Constitutional safety rules
|   |-- standards/               # Naming conventions, frontmatter spec
|   |-- runtime-adapters/        # Per-runtime compilation rules
|   |-- prompts/                 # Fallback prompt tiers
|   `-- checklists/              # Review checklists
|-- docs/                        # Documentation
`-- security/                    # OWASP mapping, adversarial scenarios
```

### Available commands

```bash
node install.js                       # Interactive picker (auto-detects scenario)
node install.js fresh --target X      # Fresh install, optional target
node install.js add <editor>          # Add an editor to existing project
node install.js remove <editor>       # Remove an editor
node install.js verify                # Per-editor check
node install.js status                # Read lock file, no writes
node install.js doctor                # verify + Node/git diagnostics
node install.js migrate-v5            # v5 plugin migration
node install.js --target all          # Install for every editor
node install.js --global              # Install to user home
node install.js --yes                 # Skip prompts (CI / scripts)
node install.js --help                # Full flag reference
```

### Documentation

| Doc | Purpose |
|-----|---------|
| [Installation](synarc-universal/docs/installation.md) | One-command install + per-editor deep dive + scenarios |
| [Architecture](synarc-universal/docs/architecture.md) | Universal agent skill architecture, 7-layer design |
| [Usage](synarc-universal/docs/usage.md) | Skill activation, writing new skills, fallback tiers |
| [Compatibility](synarc-universal/docs/compatibility.md) | Capability Ã— runtime matrix |
| [Migration](synarc-universal/docs/migration-guide.md) | Migrating from v5 (per-editor plugins) to v6.5.0 |
| [Enterprise Deployment](synarc-universal/docs/enterprise-deployment.md) | Org-scale install, CI/CD, compliance |

### Security & compliance

| Guard | Status |
|-------|--------|
| Sandboxed execution | Enabled |
| No network access | Verified |
| No filesystem write outside project | Enforced |
| Deterministic activation | Validated |
| Safe fallbacks on protocol error | Configured |
| Hash-verified integrity (SHA-256) | Active |
| Tamper protection | Enabled |

**Risk hard floors:**

| Domain | Minimum Risk | Reasoning |
|--------|-------------|----------|
| Auth, billing, payments, security | HIGH | Revenue, access, or trust impact |
| Schema change (remove/rename) | CRITICAL | Data integrity + migration complexity |
| Environment variable rename | CRITICAL | All deployments affected |
| Public API response change | HIGH | All consumers must adapt |
| Network / IAM config | CRITICAL | Security boundary change |
| INCIDENT response | CRITICAL | Production emergency |

**Regulatory mappings:** EU AI Act, SOC2, HIPAA â€” export templates included.

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues, feature requests, and pull requests. This project follows [Semantic Versioning](https://semver.org/) and maintains a [CHANGELOG](CHANGELOG.md).

### License

MIT â€” see [LICENSE](LICENSE). Built by [UpFlame Labs](https://github.com/upflame-labs).