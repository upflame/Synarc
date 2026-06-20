---
title: Synarc Universal Documentation (v6.5.0)
description: Index of the Synarc Universal v6.5.0 documentation set. 56 skills, Cognition Mesh, 8 active runtimes.
version: 6.5.0
---

# Synarc Universal Documentation (v6.5.0)

This is the index of the Synarc Universal v6.5.0 documentation. The pack ships 56 skills, the Cognition Mesh multi-role runtime, and per-editor install support for 8 active AI coding agents (Roo Code shut down 2026-05-15).

## Quick start

The installer is **scenario-based** - it auto-detects your project state and offers the right action (fresh, add, remove, migrate-v5, verify, status, doctor). See the [Scenarios section in installation.md](installation.md#scenarios) for the full per-scenario walkthrough.

```bash
# Interactive picker (auto-detects scenario)
node synarc-universal/scripts/install.js

# Or run a specific scenario
node synarc-universal/scripts/install.js fresh --target cursor
node synarc-universal/scripts/install.js add windsurf
node synarc-universal/scripts/install.js remove cursor

# Install for every supported editor in one shot
node synarc-universal/scripts/install.js --target all

# Verify the install
node synarc-universal/scripts/install.js --verify
```

## Documentation map

| Doc | Purpose |
|-----|---------|
| [Installation](installation.md) | One-command install + per-editor deep dive for all 8 editors |
| [Architecture](architecture.md) | Universal agent skill architecture, 7-layer design, compiler pattern, fallback tiers |
| [Usage](usage.md) | Skill activation, writing new skills, fallback tier usage, runtime compilation |
| [Compatibility](compatibility.md) | Capability × runtime matrix for the 8 active editors |
| [Migration](migration-guide.md) | Migrating from v5 (per-editor plugins) to v6.5.0 (universal) |
| [Enterprise Deployment](enterprise-deployment.md) | Org-scale install, version pinning, CI/CD, compliance, multi-team distribution |

## Reference (in synarc-universal/shared/)

| Path | Purpose |
|------|---------|
| shared/schemas/ | JSON Schema definitions (intent contract, intent template, verification result, audit record, ledger entry, risk assessment, guardrails, brain document, skill manifest) |
| shared/workflows/ | Canonical workflow definitions (change classification, risk assessment, intent contracts, intent templates, verification engine, audit compliance, context injection, session tracking, quality gates, error intelligence) |
| shared/guardrails/ | Constitutional safety rules |
| shared/standards/ | Naming conventions, frontmatter spec, style spec |
| shared/runtime-adapters/ | Per-runtime compilation rules (claude-code, codex, opencode, cursor, windsurf, copilot, gemini-cli, cline, roo-code reference) |
| shared/prompts/ | Fallback prompt tiers (Tier 1 native, Tier 2 external, Tier 3 manual, Tier 4 human) |
| shared/checklists/ | Review checklists (code review, deployment, incident response, pre-commit) |
| security/ | OWASP LLM mapping, prompt injection matrix, capability boundaries, adversarial scenarios |

## Pack layout

`
synarc-universal/
+-- AGENTS.md                    # Activation entry point
+-- manifest.yaml                # Universal manifest (56 skills)
+-- package.json                 # npm package manifest
+-- SCHEMA.md                    # SKILL.md frontmatter spec
+-- scripts/
|   +-- install.js               # Per-editor installer (--target, --verify, --global, --target all)
|   +-- install.ps1              # PowerShell delegate
+-- docs/                        # This directory
+-- skills/                      # 56 domain skills
+-- shared/                      # Schemas, workflows, adapters, guardrails, standards
+-- security/                    # OWASP mapping, adversarial scenarios
+-- .cursor/                     # Cursor rule (shipped inside the pack)
`

## Per-editor install paths

The installer writes the right file for each editor at the project root:

| Editor | File written | Format |
|--------|--------------|--------|
| Claude Code | .claude-plugin/plugin.json | Native plugin manifest |
| Codex CLI | AGENTS.md | Intent-based activation |
| OpenCode | AGENTS.md (or ~/.config/opencode/AGENTS.md with --global) | Intent-based activation |
| Cursor | .cursor/rules/synarc-core.mdc | YAML frontmatter (description, globs, alwaysApply) |
| Windsurf | .windsurfrules | Plain markdown rule |
| GitHub Copilot | .github/copilot-instructions.md (appended) | Markdown instructions |
| Gemini CLI | GEMINI.md (generated) | AGENTS.md + gemini-cli adapter |
| Cline | .cline/skills/<skill>/SKILL.md (all 56) | SKILL.md per skill |
| Roo Code | shut down 2026-05-15 | migrate to Cline |

## Verification reference


ode install.js --verify reports one line per editor with PASS / FAIL and the file size:

`
  [+] PASS  Claude Code          .claude-plugin/plugin.json (1317 bytes)
  [+] PASS  Codex CLI            AGENTS.md (10174 bytes)
  [+] PASS  OpenCode             AGENTS.md (project) or ~/.config/opencode/AGENTS.md (global) (10174 bytes)
  [+] PASS  Cursor               .cursor/rules/synarc-core.mdc (1429 bytes)
  [+] PASS  Windsurf             .windsurfrules (1784 bytes)
  [+] PASS  GitHub Copilot       .github/copilot-instructions.md (1823 bytes)
  [+] PASS  Gemini CLI           GEMINI.md (12170 bytes)
  [+] PASS  Cline                .cline/skills/<skill>/SKILL.md (56 skills)

Verification: 8 pass, 0 fail of 8 editors.
`

Exit code 0 on full pass, 1 if any editor's file is missing or too small.

## License

MIT — see [LICENSE](../../LICENSE).
