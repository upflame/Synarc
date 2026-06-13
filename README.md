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

## Quick Start

### Prerequisites

Any AI coding runtime: Claude Code, Codex CLI, Cursor, Windsurf, OpenCode, Gemini CLI, Copilot, or Cline.

### Installation by Runtime

| Runtime | Method |
|---------|--------|
| **Claude Code** | `claude plugin marketplace add upflame/Synarc` then `claude plugin install synarc` |
| **Codex CLI** | Copy `synarc-universal/AGENTS.md` to repo root |
| **OpenCode** | Copy `synarc-universal/AGENTS.md` to repo root or `~/.config/opencode/AGENTS.md` |
| **Cursor** | Copy `.cursor/rules/synarc-core.mdc` to `.cursor/rules/` |
| **Windsurf** | Copy `shared/runtime-adapters/windsurf.md` to `.windsurfrules` |
| **Gemini CLI** | Copy `synarc-universal/AGENTS.md` to `GEMINI.md` in repo root |
| **Copilot** | Append `shared/runtime-adapters/copilot.md` to `.github/copilot-instructions.md` |
| **Cline** | Copy `synarc-universal/skills/*` to `.cline/skills/` |

### Verify Installation

```
> what did we change?
── Session Ledger ──
[14:00] FEATURE | auth/router.ts (+12, -3) | MEDIUM | IN_SCOPE
[14:05] FIX    | auth/middleware.ts (+5, -0) | LOW | IN_SCOPE
Aggregate: MEDIUM (stable)
─────────────────────
```

### Available Commands

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
