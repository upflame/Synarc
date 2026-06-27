# Synarc — Engineering Intelligence Runtime

![Synarc Banner](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790150/synarc-banner_lytvq5.png)

[![Version](https://img.shields.io/badge/version-6.6.4-blue)](https://github.com/upflame-labs/synarc/releases)
[![Stage](https://img.shields.io/badge/stage-production-success)](https://github.com/upflame-labs/synarc)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)
[![Runtime](https://img.shields.io/badge/runtime-cross--platform-purple)](https://github.com/upflame-labs/synarc)
[![Build](https://img.shields.io/badge/build-passing-success)](https://github.com/upflame-labs/synarc/actions)
[![Vendor Lock-In](https://img.shields.io/badge/vendor--lockin-0%25-brightgreen)](https://github.com/upflame-labs/synarc)
[![Reference Integrity](https://img.shields.io/badge/references-0%20broken-success)](https://github.com/upflame-labs/synarc)
[![Package Size](https://img.shields.io/badge/npm-3.4%20MB-blue)](https://www.npmjs.com/package/synarc-universal)

Engineering intelligence runtime for AI coding agents. Structured change classification, risk assessment, intent contracts, and audit trails — packaged as a portable skill bundle that works with Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and Cline.

---

## Key Features

- **Intent Contracts** — every change opens with a formal commitment (scope, promises, risk cap) and closes with a post-execution verification. No silent edits.
- **8 active runtimes, one install** — `npm i -g synarc` writes the right file format for each editor. No rewrites when you switch tools.
- **56 specialized skills** — engineering, AI-era, product, design, quality, security, data, ML, leadership, and industry verticals. Loaded by intent, not by file.
- **Cognition Mesh** — multi-role team collaboration: /mesh triggers a coordinator that picks roles, shares working memory, and orchestrates the conversation between them.
- **Zero executables, zero network** — the pack is pure Markdown + YAML. Audit trails are local files. No data leaves your machine.

## Before / After

Without Synarc, your agent goes straight to edits:

```
> add a new API endpoint for /billing/usage

Sure — I'll add a route handler, update the OpenAPI spec, and add a test.
[edits 6 files, no plan, no risk check, no verification]
```

With Synarc, the same request opens an Intent Contract first:

```
> add a new API endpoint for /billing/usage

WorkType : FEATURE
Risk     : HIGH (billing domain — hard floor)
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

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Prerequisites

Any AI coding runtime: Claude Code, Codex CLI, OpenCode, Cursor, Windsurf, GitHub Copilot, Gemini CLI, or Cline. Node.js 18+ is required.

### Install

```bash
npm i -g synarc
```

That's it. The installer auto-detects your editor markers (`.cursor/`, `.claude/`, `.github/`, etc.) and writes the right file for each one. If nothing is detected, it asks which editors to install for.

### Choose your scenario

| Your situation | Command | What happens |
|---|---|---|
| Brand new project, no editor configured | `synarc` | Interactive picker asks which editors to install |
| Already have one editor, want to add Synarc | `synarc add <editor>` | Installs Synarc for that editor, leaves the rest alone |
| Project with multiple editors | `synarc add <editor>` | Installs the missing editor only |
| Want everything everywhere | `synarc --target all` | Installs Synarc for all 8 supported editors |
| Remove Synarc from one editor | `synarc remove <editor>` | Deletes only that editor's config file |
| Migrate from v5 plugin files | `synarc migrate-v5` | Backs up v5 files, installs v6.6.4 |
| Just check the install | `synarc verify` | Reports PASS/FAIL per editor |
| Read the lock file | `synarc status` | Prints installed editors, no writes |
| Full diagnostics | `synarc doctor` | verify + Node version + git version |

`<editor>` is one of: claude-code, codex, opencode, cursor, windsurf, copilot, gemini-cli, cline.

### Verify

```bash
synarc verify
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

Exit code 0 on full pass, 1 if anything is missing.

Start a new session in any editor and ask an engineering question. The Synarc classification headers (WorkType, Risk, Scale) should appear in the response.

---

## Usage

Once installed, Synarc activates by intent. You can also issue these session commands at any time:

| Command | What Synarc returns |
|---------|---------------------|
| what did we change? | Full session ledger (file, delta, risk, scope status) |
| summarize this session | Cognitive summary of the work, decisions, and open questions |
| is this safe to deploy? | Risk delta + explicit YES/NO with reasoning |
| what tests are missing? | All unfilled test gaps for the current WorkType |
| `full handoff` | Agent handoff block + brain updates for the next session |

For multi-role collaboration, use /mesh (or any phrase like `"as a team"`, `"have someone review this"`, or a 3+ intent signal in one request). The Cognition Mesh coordinator picks roles, defines shared working memory, and orchestrates the conversation between them.

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [Installation Guide](synarc-universal/docs/installation.md) | One-command install + per-editor deep dive + 6 scenarios |
| [Architecture](synarc-universal/docs/architecture.md) | Universal agent skill architecture, 7-layer design |
| [Usage](synarc-universal/docs/usage.md) | Skill activation, writing new skills, fallback tier usage |
| [Compatibility](synarc-universal/docs/compatibility.md) | Capability – runtime matrix for the 8 active editors |
| [Migration](synarc-universal/docs/migration-guide.md) | Migrating from v5 (per-editor plugins) to v6.6.4 (universal) |
| [Enterprise Deployment](synarc-universal/docs/enterprise-deployment.md) | Org-scale install, CI/CD, compliance, multi-team distribution |
| [Security](synarc-universal/security/OWASP-LLM-mapping.md) | OWASP LLM mapping, prompt-injection matrix, capability boundaries |
| [CHANGELOG](CHANGELOG.md) | Release history |

---

## Architecture

Synarc runs a 7-step pipeline on every interaction:

```
Classify — Inject — Execute — Log — Aggregate — Checkpoint — Emit
```

The pipeline is deterministic and runtime-agnostic — the same pipeline operates identically across all 8 supported editors.

**Cache architecture** (5 tiers, lazy-loaded):

| Tier | Contents | Scope |
|------|----------|-------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Session |
| 1 | Core reasoning (synarc-core, cognition-layer, schemas) | Session (~60 KB) |
| 2 | Active domain skill (one of 56) | Task (~10 KB each) |
| 3 | Skill references | Lazy-loaded |
| 4 | Dynamic context (project files, tool outputs) | Never cached |

**Scale adaptation** (auto-detected, zero configuration):

| Scale | Threshold | Tracking |
|-------|-----------|----------|
| NANO | Single file, single purpose | WorkType + risk only |
| MICRO | 2–10 files | CURRENT_STATE.md |
| SMALL | <5k LOC, 1–5 modules | Full brain directory |
| MEDIUM | 5k–50k LOC, team | Full ledger |
| LARGE | 50k–500k LOC, multi-service | Service-boundary tracking |
| ENTERPRISE | >500k LOC, regulated | Compliance audit trail |

---

## Development

| Command | What it does |
|---------|--------------|
| `npm run sync` | Sync v6 source tree into the universal pack |
| `npm run validate` | Validate all 56 skills (frontmatter, links, size caps) |
| `npm run test-fallbacks` | Test all 4 fallback tiers |
| `npm run measure` | Measure skill sizes against the cache budget |
| `npm run lint` | Vendor-lockin check + reference integrity check |
| `npm test` | `validate` + `test-fallbacks` |
| `npm run build` | sync + `validate` |
| `npm run precommit` | lint + `test` |

All scripts run from inside `synarc-universal/`. PowerShell 5.1+ is required.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Classification headers not appearing in agent responses | Editor can't find the rule / AGENTS.md | Run `synarc verify` — the FAIL row tells you which file is missing or too small |
| Mesh not triggering | No multi-intent phrase, no /mesh command | Try /mesh explicitly, or write a 3+ intent prompt (e.g., `"build a checkout flow"` matches PM, designer, frontend, backend, accessibility, performance, SDET, release, security) |
| "Source not found" error | Synarc package not installed or corrupted | Run `npm i -g synarc` to reinstall |
| Want a clean re-install for one editor | Stale config or version drift | Delete the editor's file (e.g. `rm` `.windsurfrules`) and run `synarc add <editor>` again |
| `synarc` opens an interactive picker in CI | Stdin is a TTY in the CI runner | Add `--yes` (or `-y`) to skip prompts and use the AGENTS.md fallback |

For the full failure-mode matrix, see [Installation Guide — Troubleshooting](synarc-universal/docs/installation.md#troubleshooting).

---

## Security

| Guard | Status |
|-------|--------|
| Sandboxed execution | Enabled |
| No network access | Verified |
| No filesystem write outside project | Enforced |
| Deterministic activation | Validated |
| Safe fallbacks on protocol error | Configured |
| Hash-verified integrity (SHA-256) | Active (every skill in `.claude-plugin/marketplace.json`) |
| Tamper protection | Enabled |

**Risk hard floors** (no agent may classify a change below this risk, regardless of declared intent):

| Domain | Minimum Risk | Reasoning |
|--------|-------------|----------|
| Auth, billing, payments, security | HIGH | Revenue, access, or trust impact |
| Schema change (remove/rename) | CRITICAL | Data integrity + migration complexity |

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the dev loop, code layout, and how to add a new skill to the pack.

## License

MIT — UpFlame Labs.