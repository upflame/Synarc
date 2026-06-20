# Synarc — Engineering Intelligence Runtime

![Synarc Banner](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790150/synarc-banner_lytvq5.png)

[![Version](https://img.shields.io/badge/version-6.5.0-blue)](https://github.com/upflame-labs/synarc/releases)
[![Stage](https://img.shields.io/badge/stage-production-success)](https://github.com/upflame-labs/synarc)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)
[![Runtime](https://img.shields.io/badge/runtime-cross--platform-purple)](https://github.com/upflame-labs/synarc)
[![Build](https://img.shields.io/badge/build-passing-success)](https://github.com/upflame-labs/synarc/actions)
[![Vendor Lock-In](https://img.shields.io/badge/vendor--lockin-0%25-brightgreen)](https://github.com/upflame-labs/synarc)
[![Reference Integrity](https://img.shields.io/badge/references-0%20broken-success)](https://github.com/upflame-labs/synarc)
[![Package Size](https://img.shields.io/badge/npm-3.4%20MB-blue)](https://www.npmjs.com/package/synarc-universal)

Synarc is an engineering intelligence runtime for AI-assisted software development. It provides structured change classification, risk assessment, intent verification, audit trails, and session continuity across all major AI coding agents. The runtime operates as a skill pack — no executables, no network calls, no external dependencies.

---

## Overview

AI coding agents execute changes rapidly, but without structured governance, each session risks context fragmentation, unplanned scope expansion, and undetected contract violations. Synarc addresses this by interposing a deterministic governance layer between developer intent and agent execution.

The runtime is organized as a multi-skill architecture:

- **Intent Contracts** — formal commitments before execution: scope boundary, explicit promises, risk cap, and post-execution verification
- **Change Classification** — 12 WorkTypes across 7 dimensions with deterministic risk floors
- **Verification Engine** — post-execution diff analysis against contract promises
- **Audit & Compliance** — immutable audit trail with rollback-to-intent and regulatory export (EU AI Act, SOC2, HIPAA)
- **Session Continuity** — persistent session ledger across context resets
- **Cognition Mesh** — multi-role team collaboration with shared working memory

---

## Features

| Capability | Description |
|------------|-------------|
| Intent Contracts | Propose → Accept → Execute → Verify → Fulfill lifecycle for every change |
| Intent Templates | 11 per-WorkType contract templates with default promises and scope rules |
| Verification Engine | Scope checking, promise verification, risk delta, composite verdict matrix |
| Audit Trail | Immutable records per contract lifecycle event, rollback-to-intent protocol |
| Change Classification | 12 WorkTypes, 7 dimensions, deterministic risk floors per domain |
| Risk Assessment | 6-level risk ladder with hard floors for auth, payments, schema changes |
| Context Injection | COMPACT (50 tokens), STANDARD (200 tokens), FULL (500 tokens) levels |
| Session Tracking | Immutable ledger persisting across sessions and context resets |
| Quality Gates | Zero-tolerance enforcement per WorkType |
| Error Intelligence | 6-step protocol with persistent error memory |
| Cognition Mesh | Multi-role collaboration — up to 9 specialized roles per task |

---

## Architecture

The runtime implements a 7-step pipeline executed on every interaction:

```
Classify → Inject → Execute → Log → Aggregate → Checkpoint → Emit
```

Each step is deterministic and runtime-agnostic — the same pipeline operates identically across Claude Code, Codex CLI, Cursor, Windsurf, OpenCode, Gemini CLI, Copilot, Cline, and any AGENTS.md-compatible runtime.

### Cache Architecture

| Tier | Contents | Scope |
|------|----------|-------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Session |
| 1 | Core reasoning (synarc-core, cognition-layer, schemas) | Session (~60 KB) |
| 2 | Active domain skill (one of 56) | Task (~10 KB each) |
| 3 | Skill references | Lazy-loaded |
| 4 | Dynamic context (project files, tool outputs) | Never cached |

### Scale Adaptation

| Scale | Threshold | Tracking Depth |
|-------|-----------|----------------|
| NANO | Single file, single purpose | WorkType + risk only |
| MICRO | 2-10 files | CURRENT_STATE.md |
| SMALL | <5k LOC, 1-5 modules | Full brain directory |
| MEDIUM | 5k-50k LOC, team | Full ledger |
| LARGE | 50k-500k LOC, multi-service | Service-boundary tracking |
| ENTERPRISE | >500k LOC, regulated | Compliance audit trail |

Auto-detected. Zero configuration.

---

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

---

## Quick Start

### Prerequisites

Any AI coding runtime: Claude Code, Codex CLI, Cursor, Windsurf, OpenCode, Gemini CLI, Copilot, or Cline.

### One command (recommended)

From inside the project you want to add Synarc to:

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
node synarc-universal/scripts/install.js
```

The installer auto-detects your editor markers (`.cursor/`, `.claude/`, `.github/`, etc.) and installs the right file for each one. If nothing is detected, it asks which editors to install for.

Or via npx once published:

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

# 3. Start a Codex session — it will auto-discover AGENTS.md
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

# 3. Start an OpenCode session — it will auto-discover AGENTS.md
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

### Verify Installation

Run the per-editor check to confirm every file landed where the editor expects it:

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

After install, start a new session in any editor and ask an engineering question. The Synarc classification headers (`WorkType`, `Risk`, `Scale`) should appear in the response.

See [Installation Guide](synarc-universal/docs/installation.md) for the full per-editor deep dive and the complete Scenarios reference.

---### Available Commands

| Command | Response |
|---------|----------|
| `what did we change?` | Full session ledger |
| `summarize this session` | Cognitive summary |
| `is this safe to deploy?` | Risk delta + explicit YES/NO |
| `what tests are missing?` | All unfilled test gaps |
| `generate a snapshot` | Brain snapshot entry |
| `full handoff` | Agent handoff block + brain updates |
| `run quality gates` | All gates PASS/FAIL report |

---

## Project Structure

```
synarc-universal/
├── AGENTS.md                    # Activation entry point
├── package.json                 # npm package manifest
├── manifest.yaml                # Universal manifest
├── scripts/
│   ├── install.js               # CLI installer
│   └── install.ps1              # PowerShell installer
├── skills/                      # 56 domain skills
│   ├── synarc-core/             # Core runtime (always active)
│   ├── architect/               # System design & trade-off analysis
│   ├── backend-engineer/        # Service architecture & API design
│   ├── security-engineer/       # Threat modeling & defense
│   ├── debug-engineer/          # Systematic debugging
│   └── ...                      # 51 additional domain skills
├── shared/
│   ├── schemas/                 # JSON Schema definitions
│   ├── workflows/               # Canonical workflow definitions
│   ├── guardrails/              # Constitutional safety rules
│   ├── standards/               # Naming conventions, frontmatter spec
│   ├── runtime-adapters/        # Per-runtime compilation rules
│   ├── prompts/                 # Fallback prompt tiers
│   └── checklists/              # Review checklists
├── docs/                        # Documentation
└── security/                    # OWASP mapping, adversarial scenarios
```

---

## Documentation

| Category | Links |
|----------|-------|
| Getting Started | [Installation](synarc-universal/docs/installation.md) · [Architecture](synarc-universal/docs/architecture.md) · [Usage](synarc-universal/docs/usage.md) · [Deployment](synarc-universal/docs/enterprise-deployment.md) · [Migration](synarc-universal/docs/migration-guide.md) |
| Workflows | [Change Classification](synarc-universal/shared/workflows/change-classification.md) · [Risk Assessment](synarc-universal/shared/workflows/risk-assessment.md) · [Context Injection](synarc-universal/shared/workflows/context-injection.md) · [Session Tracking](synarc-universal/shared/workflows/session-tracking.md) · [Quality Gates](synarc-universal/shared/workflows/quality-gates.md) · [Error Intelligence](synarc-universal/shared/workflows/error-intelligence.md) |
| Intent Contracts | [Contract Lifecycle](synarc-universal/shared/workflows/intent-contracts.md) · [Templates](synarc-universal/shared/workflows/intent-templates.md) · [Verification](synarc-universal/shared/workflows/verification-engine.md) · [Audit & Compliance](synarc-universal/shared/workflows/audit-compliance.md) |
| Schemas | [Intent Contract](synarc-universal/shared/schemas/intent-contract.schema.json) · [Intent Template](synarc-universal/shared/schemas/intent-template.schema.json) · [Verification Result](synarc-universal/shared/schemas/verification-result.schema.json) · [Audit Record](synarc-universal/shared/schemas/audit-record.schema.json) · [Ledger Entry](synarc-universal/shared/schemas/ledger-entry.schema.json) · [Risk Assessment](synarc-universal/shared/schemas/risk-assessment.schema.json) · [Guardrails](synarc-universal/shared/schemas/guardrails.schema.json) |

---

## Security & Compliance

| Guard | Status |
|-------|--------|
| Sandboxed execution | Enabled |
| No network access | Verified |
| No filesystem write outside /brain/ | Enforced |
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

**Regulatory mappings:** EU AI Act, SOC2, HIPAA — export templates included.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues, feature requests, and pull requests.

This project follows [Semantic Versioning](https://semver.org/) and maintains a [CHANGELOG](CHANGELOG.md).

---

## License

MIT — see [LICENSE](LICENSE).

Built by [UpFlame Labs](https://github.com/upflame-labs).