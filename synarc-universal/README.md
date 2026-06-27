# Synarc — Engineering Intelligence Runtime

<div align="center">

![Synarc Banner](https://res.cloudinary.com/dufzctlaj/image/upload/v1779790150/synarc-banner_lytvq5.png)

**Intelligence that engineers trust.**

Wire your AI agent to the discipline it should have shipped with.

[![npm version](https://img.shields.io/npm/v/synarc.svg?style=flat-square&color=CB3837)](https://www.npmjs.com/package/synarc)
[![Downloads](https://img.shields.io/npm/dm/synarc.svg?style=flat-square&color=4c1)](https://www.npmjs.com/package/synarc)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/upflame/Synarc/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![Build](https://img.shields.io/badge/build-passing-success?style=flat-square)](https://github.com/upflame/Synarc/actions)
[![Vendor Lock-In](https://img.shields.io/badge/vendor--lockin-0%25-brightgreen?style=flat-square)](https://github.com/upflame/Synarc)

```bash
npm i -g synarc
```

**56 skills · 8 editors · Intent Contracts · Verification Engine · Zero network · 1 install**

[Documentation](https://github.com/upflame/Synarc/tree/main/synarc-universal/docs) · [CLI Reference](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/cli-reference.md) · [Changelog](https://github.com/upflame/Synarc/blob/main/synarc-universal/CHANGELOG.md) · [Report Bug](https://github.com/upflame/Synarc/issues)

</div>

---

## The Problem

Your AI agent writes code. Good code, even. But it doesn't **plan**, doesn't **classify risk**, doesn't **verify its own work**, and doesn't **produce an audit trail**. Every edit is a silent commit with no contract, no scope check, and no post-execution verdict.

Synarc fixes that. One install gives every major AI coding runtime a structured reasoning layer — Intent Contracts, risk classification, verification verdicts, and a 56-skill knowledge base — without shipping a single executable or making a single network call.

---

## Before / After

<table>
<tr><th>❌ Without Synarc</th><th>✅ With Synarc</th></tr>
<tr>
<td>

```
> add a new API endpoint for /billing/usage

Sure — I'll add a route handler, update the
OpenAPI spec, and add a test.
[edits 6 files, no plan, no risk check,
 no verification]
```

</td>
<td>

```
> add a new API endpoint for /billing/usage

WorkType : FEATURE
Risk     : HIGH (billing — hard floor)
Scale    : SMALL
Scope    : [usage.ts, usage.test.ts, openapi.yaml]
Promises :
  ✓ Idempotent on duplicate POSTs
  ✓ Backward-compatible response shape
  ✓ Audit log entry per call
Verify   : scope-check, contract-check, test-run

Proceed? [Y/n] y

[edits 3 files, runs tests, verdict: PASS]
```

</td>
</tr>
</table>

Same intent. Different discipline. The agent proposes a contract, you accept, it executes, it verifies.

---

## Quick Start

### 1. Install globally

```bash
npm i -g synarc
```

### 2. Initialize in your project

```bash
cd my-project
synarc fresh --yes
```

### 3. Verify the install

```bash
synarc verify
```

```
  [+] PASS  Claude Code          .claude-plugin/plugin.json
  [+] PASS  Codex CLI            AGENTS.md
  [+] PASS  Cursor               .cursor/rules/synarc-core.mdc
  [+] PASS  Windsurf             .windsurfrules
  [+] PASS  GitHub Copilot       .github/copilot-instructions.md
  [+] PASS  Gemini CLI           GEMINI.md
  [+] PASS  Cline                .cline/skills/<skill>/SKILL.md

  Verification: 7 pass, 0 fail.
```

### 4. Start coding

Open any supported editor and ask an engineering question. Synarc classification headers (`WorkType`, `Risk`, `Scale`) appear automatically.

---

## What You Get

### 🔒 Intent Contracts

Every change opens with a formal commitment — scope, promises, risk cap — and closes with a post-execution verification verdict. No silent edits. No untracked scope creep.

### 🧠 Cognition Mesh

Multi-role team collaboration. Use `/mesh` (or any natural phrase like _"as a team"_, _"have someone review this"_) and the coordinator picks roles, shares working memory, and orchestrates the conversation between specialists.

### ⚡ 56 Specialized Skills

Engineering, AI-era, product, design, quality, security, data, ML, leadership, and industry verticals. The tarball ships `synarc-core` offline; the remaining 55 skills prefetch on first use into a content-addressable cache.

### 🎯 Smart `auto` Mode

```bash
synarc auto "refactor the auth module"
```

The CLI classifies the work, picks the right 4–9 skills, prefetches them, and installs for the detected editors. Toggle off with `synarc.config.js` → `auto: false`.

### 🛡️ 7-Step Pipeline

Every interaction runs through a deterministic, runtime-agnostic pipeline:

```
Classify → Inject → Execute → Log → Aggregate → Checkpoint → Emit
```

The same pipeline operates identically across all 8 supported editors.

### 📦 Offline-Friendly

The files written to your project are pure Markdown + YAML. Once the cache is warm, no network is needed. Audit trails are local files. **Your code never leaves your machine.**

---

## Supported Editors

| ID | Editor | Config file installed |
| :--- | :--- | :--- |
| `claude-code` | Claude Code | `.claude-plugin/plugin.json` |
| `codex` | Codex CLI | `AGENTS.md` at project root |
| `opencode` | OpenCode | `AGENTS.md` at project root |
| `cursor` | Cursor | `.cursor/rules/synarc-core.mdc` |
| `windsurf` | Windsurf | `.windsurfrules` |
| `copilot` | GitHub Copilot | `.github/copilot-instructions.md` |
| `gemini-cli` | Gemini CLI | `GEMINI.md` |
| `cline` | Cline | `.cline/skills/` (directory of skills) |

---

## CLI Reference

### Core Commands

| Command | Description |
| :--- | :--- |
| `synarc` | Interactive picker → installs for detected editors |
| `synarc fresh --yes` | Install for every editor detected (non-interactive) |
| `synarc add <editor>` | Install for a specific editor only |
| `synarc remove <editor>` | Remove config for a specific editor |
| `synarc refresh` | Re-apply from lock file (idempotent) |

### Diagnostics

| Command | Description |
| :--- | :--- |
| `synarc verify` | Check install integrity (CI-friendly with `--json`) |
| `synarc doctor` | Node + git + integrity diagnostics |
| `synarc status` | Print installed editors from lock file, no writes |

### Skill Management

| Command | Description |
| :--- | :--- |
| `synarc auto "<task>"` | Classify task → prefetch skills → install |
| `synarc skill install <name>` | Copy a skill into `.synarc/skills/` |
| `synarc global install` | Install as user-global tool (`~/.synarc/bin/synarc`) |

### Lifecycle

| Command | Description |
| :--- | :--- |
| `synarc uninstall --soft` | Remove editor configs, keep lock/cache/config |
| `synarc uninstall --keep cursor` | Partial removal: keep cursor, remove the rest |
| `synarc migrate-v5` | Back up v5 files → install v6.6.x |

> Run `synarc --help` for the full surface (~16 flags, 8 subcommand groups, JSON output on every verb).

---

## Programmatic API (SDK)

```js
const synarc = require("synarc");

// Install for specific editors
const result = await synarc.install({ targets: ["cursor", "claude-code"] });

// Verify an install (CI-friendly)
const verdict = await synarc.verify();
// → { pass: 7, fail: 0, editors: [...] }

// List supported editors and skills
const editors = synarc.list.editors();   // → ["claude-code", "codex", ...]
const skills  = synarc.list.skills();    // → ["synarc-core", "api-design", ...]

// React to install events
synarc.hooks.on("afterInstall", async (ctx) => {
  console.log(`Installed ${ctx.results.length} editor(s)`);
});

// Health check
const diag = await synarc.doctor();
// → { node: "22.5.0", git: "2.45.2", integrity: "PASS" }
```

See the [SDK documentation](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/advanced/sdk.md) for the full TypeScript API.

---

## CI / CD Integration

Add Synarc verification to your pipeline to catch config drift:

```yaml
# GitHub Actions
- name: Verify Synarc install
  run: |
    npm i -g synarc
    synarc verify --json
```

```yaml
# GitLab CI
verify-synarc:
  script:
    - npm i -g synarc
    - synarc verify --json --strict
  allow_failure: false
```

Exit code `0` on full pass, `1` if anything is missing.

---

## Architecture at a Glance

### 5-Tier Cache (lazy-loaded)

| Tier | Contents | Scope |
| :---: | :--- | :--- |
| **0** | Pack header (`AGENTS.md`, `manifest.yaml`) | Session |
| **1** | Core reasoning (`synarc-core`, cognition-layer, schemas) | Session (~60 KB) |
| **2** | Active domain skill (1 of 56) | Task (~10 KB each) |
| **3** | Skill references | Lazy-loaded |
| **4** | Dynamic context (project files, tool outputs) | Never cached |

### Scale Adaptation (auto-detected)

| Scale | Threshold | Tracking Level |
| :--- | :--- | :--- |
| `NANO` | Single file, single purpose | WorkType + risk only |
| `MICRO` | 2–10 files | `CURRENT_STATE.md` |
| `SMALL` | < 5k LOC, 1–5 modules | Full brain directory |
| `MEDIUM` | 5k–50k LOC, team | Full ledger |
| `LARGE` | 50k–500k LOC, multi-service | Service-boundary tracking |
| `ENTERPRISE` | > 500k LOC, regulated | Compliance audit trail |

---

## Security Posture

| Guard | Status |
| :--- | :--- |
| Sandboxed execution | ✅ Enabled |
| No network access | ✅ Verified |
| No filesystem write outside project | ✅ Enforced |
| Deterministic activation | ✅ Validated |
| Safe fallbacks on protocol error | ✅ Configured |
| SHA-256 hash-verified integrity | ✅ Active |
| Tamper protection | ✅ Enabled |

**Risk hard floors** — no agent may classify a change below this risk, regardless of declared intent:

| Domain | Minimum Risk |
| :--- | :--- |
| Auth, billing, payments, security | `HIGH` |
| Schema change (remove/rename) | `CRITICAL` |

See the full [OWASP LLM mapping](https://github.com/upflame/Synarc/blob/main/synarc-universal/security/OWASP-LLM-mapping.md) and [Security policy](https://github.com/upflame/Synarc/blob/main/synarc-universal/SECURITY.md).

---

## Why a Pack, Not a Daemon?

Synarc is **content your AI agent reads**, not code your AI agent runs. The pack is a tree of Markdown + YAML installed into the right config locations for each editor.

| Trait | What it means |
| :--- | :--- |
| **Auditable** | Every file is plain text, committed to your repo |
| **No version drift** | Lock file pins what's installed; `synarc refresh` re-applies it |
| **No background process** | Nothing to start, stop, monitor, or update out-of-band |
| **Offline-friendly** | `synarc-core` ships in the tarball; 55 skills cache once, then work offline |
| **Zero vendor lock-in** | Switch editors freely — Synarc adapts its output format |

---

## Documentation

| Resource | Description |
| :--- | :--- |
| [CLI Reference](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/cli-reference.md) | Every verb, flag, exit code, and JSON schema |
| [Architecture](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/architecture.md) | 7-layer design, compiler pattern, security model |
| [Installation Guide](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/installation.md) | Per-editor deep dives, CI snippets, retention policy |
| [Usage Guide](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/usage.md) | Writing new skills, Intent Contract template, examples |
| [Compatibility Matrix](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/compatibility.md) | 18-row table of editor capabilities |
| [Migration Guide](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/migration-guide.md) | v5 → v6.6.x upgrade path |
| [SDK Docs](https://github.com/upflame/Synarc/blob/main/synarc-universal/docs/advanced/sdk.md) | Programmatic API, TypeScript types, hooks |
| [CHANGELOG](https://github.com/upflame/Synarc/blob/main/synarc-universal/CHANGELOG.md) | Release notes per version |
| [Security Policy](https://github.com/upflame/Synarc/blob/main/synarc-universal/SECURITY.md) | How to report vulnerabilities |

---

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| Classification headers not appearing | Run `synarc verify` — the FAIL row shows which file is missing |
| Mesh not triggering | Use `/mesh` explicitly, or write a 3+ intent prompt |
| "Source not found" error | Run `npm i -g synarc` to reinstall the package |
| Want a clean re-install for one editor | `synarc remove <editor>` then `synarc add <editor>` |
| Interactive picker fires in CI | Add `--yes` (or `-y`) to skip prompts |

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](https://github.com/upflame/Synarc/blob/main/CONTRIBUTING.md) for the dev loop, code layout, and how to add a new skill to the pack.

## License

MIT — [UpFlame Labs](https://upflame.in)

---

<div align="center">

**56 skills · 8 editors · 1 install**

Wire your AI agent to the discipline it should have shipped with.

[Get Started](#quick-start) · [Documentation](https://github.com/upflame/Synarc/tree/main/synarc-universal/docs) · [GitHub](https://github.com/upflame/Synarc)

</div>
