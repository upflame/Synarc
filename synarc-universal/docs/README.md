---
title: Synarc Universal v6.6.4 — Intelligence That Engineers Trust
description: World-class landing page for Synarc. 56 skills, 8 active AI coding agents, 4-tier fallback, Intent Contracts, Verification Engine, Audit & Compliance, Cognition Mesh. `npm i synarc` to install.
version: 6.6.4
schema: skill-pack/v1
---

<div align="center">

# ⚡ Synarc

### Intelligence That Engineers Trust

[![npm version](https://img.shields.io/npm/v/synarc.svg?cacheSeconds=300)](https://www.npmjs.com/package/synarc)
[![npm downloads](https://img.shields.io/npm/dm/synarc.svg)](https://www.npmjs.com/package/synarc)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-339933.svg)](https://nodejs.org)
[![Skills](https://img.shields.io/badge/skills-56-ff6b6b.svg)](#-the-56-skills)
[![Runtimes](https://img.shields.io/badge/runtimes-8%20active-9b59b6.svg)](#-supported-ai-coding-agents)
[![Schema v1](https://img.shields.io/badge/schema-skill--pack%2Fv1-2ecc71.svg)](./SCHEMA.md)
[![Zero config](https://img.shields.io/badge/install-zero%20config-1abc9c.svg)](#-30-second-install)

**Engineering intelligence runtime** — change classification, risk assessment, intent contracts, verification engine, audit & compliance, context injection, session tracking, quality gates, multi-role team collaboration, and the Cognition Mesh.

[Quick Start](#-30-second-install) · [CLI Reference](./cli-reference.md) · [Architecture](./architecture.md) · [Compatibility](./compatibility.md) · [SDK](./advanced/sdk.md)

</div>

---

## 🤔 Why Synarc?

Every AI coding agent — Codex, Cursor, Claude Code, Cline, Windsurf, Copilot, Gemini CLI, OpenCode — works in isolation. They forget. They drift. They hallucinate risk. They guess scope.

**Synarc turns any of them into a disciplined engineering teammate:**

| What you get | What it solves |
|---|---|
| **Change classification** | 12 WorkTypes × 7 dimensions, deterministic risk floors |
| **Intent Contracts** | Agents commit to scope + promises *before* they touch a file |
| **Verification Engine** | Post-execution promise checking, scope diff, risk delta |
| **Audit & Compliance** | Immutable trail, rollback-to-intent, EU AI Act / SOC2 / HIPAA export |
| **4-Tier Fallback** | Every capability degrades gracefully — never blocked |
| **Cognition Mesh** | 56 skills activate as a coordinated team, not one-at-a-time |
| **Session Continuity** | Pick up exactly where the last session left off |
| **Quality Gates** | Zero-tolerance enforcement per work type, no bypass via prompt |

---

## ⚡ 30-second install

```bash
npm i synarc
```

That's it. The postinstall hook auto-detects your editor markers (`.cursor/`, `.claude-plugin/`, `.github/`, `.windsurfrules`, …) and wires Synarc in. You'll see:

```text
synarc: 1 editor marker detected (cursor)
synarc: auto-installing for detected editors …

  ⚡ Synarc Universal v6.6.4
  Intelligence that engineers trust

  ✔ 1 editor wired:
    • Cursor

  Next steps
    1. Run synarc verify    to confirm the install
    2. Run synarc doctor    to check your environment
    3. Run synarc list skills to browse the 56 skills
    4. Open your editor and ask anything — Synarc is live

  Docs:    https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs
  Discord: https://discord.gg/synarc
  Issues:  https://github.com/upflame-labs/synarc/issues
```

> **No flags. No config. No prompts. Just `npm i synarc` and go.**

Want to install for every editor at once?

```bash
npx synarc fresh --target all --yes
```

Want to scaffold a `synarc.config.js` first?

```bash
npx synarc init
```

---

## 🎯 The 56 skills

Organized by domain, every skill ships with `SKILL.md`, `skill.yaml`, `guardrails.yaml`, and `CHANGELOG.md`.

### Core (always on)

`synarc-core` · `change-intelligence` · `coding-agent` · `negative-prompts` · `project-scales` · `schemas` · `cognition-layer` · `testing-strategy`

### Engineering

`architect` · `backend-engineer` · `frontend-engineer` · `ui-engineer` · `ux-engineer` · `fullstack-engineer` · `mobile-engineer` · `database-architect` · `infrastructure-engineer` · `devops-engineer` · `sre-engineer` · `data-engineer` · `ml-engineer` · `security-engineer` · `debug-engineer` · `performance-thinker` · `release-engineer` · `sdet-engineer`

### Leadership

`engineering-manager` · `product-engineer` · `staff-engineer` · `decision-engineer` · `risk-analyst` · `incident-commander`

### AI-Era (new in v6.0.0)

`agentic-ai-engineer` · `prompt-engineer` · `rag-engineer` · `ai-safety-eval-engineer` · `agent-architect` · `ai-product-manager` · `mlops-engineer` · `data-scientist`

### Product & Design (new in v6.0.0)

`product-manager` · `product-designer` · `content-designer` · `design-systems-engineer`

### Quality (new in v6.0.0)

`performance-engineer` · `accessibility-engineer` · `finops-engineer`

Browse them all:

```bash
npx synarc list skills
```

---

## 🤖 Supported AI coding agents

| Agent | Status | Transport | Install target |
|---|---|---|---|
| **Claude Code** | ✅ Active | Native plugin | `.claude-plugin/plugin.json` |
| **Codex CLI** | ✅ Active | AGENTS.md | `AGENTS.md` |
| **OpenCode** | ✅ Active | AGENTS.md | `AGENTS.md` (or `~/.config/opencode/AGENTS.md` with `--global`) |
| **Cursor** | ✅ Active | `.mdc` rules | `.cursor/rules/synarc-core.mdc` |
| **Windsurf** | ✅ Active | `.windsurfrules` | `.windsurfrules` |
| **GitHub Copilot** | ✅ Active | copilot-instructions | `.github/copilot-instructions.md` |
| **Gemini CLI** | ✅ Active | GEMINI.md (generated) | `GEMINI.md` |
| **Cline** | ✅ Active | SKILL.md per skill | `.cline/skills/<skill>/SKILL.md` |
| ~~Roo Code~~ | ⛔ Shut down 2026-05-15 | — | Migrate to Cline — see [migration guide](./migration-guide.md#roo-code--cline-migration) |

**8 active agents, 1 source of truth.** Full capability matrix: [compatibility.md](./compatibility.md).

---

## 🧠 Cognition Mesh

In v6, multiple skills activate together as a coordinated team. The `synarc-core` runtime is the **mesh coordinator** — it detects task intent, selects roles, defines shared working memory, and orchestrates handoffs.

Example mesh for "build a checkout flow":

```text
synarc-core (coordinator)
├── product-manager         (opportunity, success metrics)
├── product-designer        (interaction, wireframe)
├── frontend-engineer       (component architecture)
├── backend-engineer        (API, data model)
├── accessibility-engineer  (WCAG, keyboard, screen reader)
├── performance-engineer    (LCP/INP budget, CDN)
├── sdet-engineer           (E2E suite, contract test)
├── release-engineer        (feature flag rollout, canary)
└── security-engineer       (threat model, fraud)
```

You ask once. Nine specialists collaborate. The output is a single coherent engineering plan, not nine disjoint opinions.

---

## 🛡️ 4-tier fallback — the reliability contract

Every capability defines 4 tiers. If a runtime can't do Tier 1, it falls through — never blocks, never lies.

| Tier | Name | When |
|---|---|---|
| 1 | **Native Execution** | Agent performs the capability itself |
| 2 | **External Integration** | MCP servers, APIs, external tools |
| 3 | **Manual Workflow** | Step-by-step instructions the user runs |
| 4 | **Human-Assisted** | Structured output for human review |

The fallback chain is **declared in every SKILL.md** and verified by `synarc validate`.

---

## 🧰 The SDK

Synarc is also a **programmatic API**. Drop it into your own CLI, IDE plugin, or agent framework:

```js
import synarc from "synarc";

// Install for specific editors
const r = await synarc.install({ targets: ["cursor", "claude-code"] });

// Verify
const v = await synarc.verify({ targets: ["cursor"] });
if (!v.ok) process.exit(1);

// React to events
synarc.hooks.on("afterInstall", async (ctx) => {
  console.log("Installed", ctx.result.results.length, "editors");
});

synarc.hooks.on("onError", async ({ event, error }) => {
  console.error("Synarc error in", event, ":", error.message);
});
```

Full SDK reference: [advanced/sdk.md](./advanced/sdk.md).

---

## 📦 `synarc.config.js`

Scaffold a project-level config with `synarc init`. The config is auto-discovered by walking up the tree.

```js
// synarc.config.js
module.exports = {
  // Which AI coding agents to install Synarc for.
  // null = auto-detect from project markers.
  agents: ["claude-code", "codex", "opencode"],

  // Which skills to enable. null = all 56.
  // skills: ["backend-engineer", "frontend-engineer", "security-engineer"],

  // Per-WorkType risk caps.
  // riskCaps: { INCIDENT: "CRITICAL", FEATURE: "MEDIUM" },

  // Custom guardrails.
  // guardrails: [],

  // SDK hooks.
  // hooks: {
  //   beforeInstall: async (ctx) => {},
  //   afterVerify: async (ctx) => {},
  //   onError: async ({ event, error }) => {},
  // },

  // Telemetry (off by default; would be a no-op anyway).
  telemetry: false,
};
```

---

## 🧰 The CLI

```bash
# Getting started
synarc init                     # scaffold synarc.config.js
synarc fresh                    # install for detected editors
synarc verify                   # check the install
synarc doctor                   # environment diagnostics
synarc info                     # project + pack status card

# Install verbs
synarc fresh --target all       # install for every editor
synarc add cursor windsurf      # extend an install
synarc remove cursor            # shrink an install
synarc uninstall                # clean removal
synarc upgrade                  # upgrade with migration
synarc migrate-v5               # convert legacy v5 plugin files

# Lean install cache (v6.7+)
synarc cache status             # show the content-addressable skill cache
synarc cache path               # print the cache directory path
synarc cache verify             # verify and repair cache entries (SHA-256)
synarc cache clear --yes        # remove the cache
synarc cache prefetch           # download all 56 skills from GitHub into the cache
synarc skill list               # list all skills with their cache status
synarc skill get synarc-core    # print a SKILL.md to stdout
synarc skill show architect     # show a skill summary (first 40 lines)

# Subsystems
synarc audit verify             # verify the audit chain
synarc audit export --format eu-ai-act
synarc ledger tail              # tail the session ledger

# Programmatic
synarc list editors
synarc list skills
synarc status                   # read synarc.lock.json
```

Full reference: [cli-reference.md](./cli-reference.md).

---

## 📚 Documentation map

| Doc | What it's for | Read time |
|---|---|---|
| **[README.md](./README.md)** | This page — landing & overview | 4 min |
| **[cli-reference.md](./cli-reference.md)** | Every verb, every flag, exit codes, examples | 6 min |
| **[installation.md](./installation.md)** | One-command install + per-editor deep dive | 5 min |
| **[architecture.md](./architecture.md)** | 7-layer design, compiler pattern, fallback | 10 min |
| **[usage.md](./usage.md)** | Skill activation, writing new skills, workflows | 8 min |
| **[compatibility.md](./compatibility.md)** | Capability × runtime matrix | 4 min |
| **[migration-guide.md](./migration-guide.md)** | v5 → v6.6.4, Roo Code → Cline | 5 min |
| **[enterprise-deployment.md](./enterprise-deployment.md)** | Org-scale, CI/CD, compliance | 12 min |
| **[schemas.md](./schemas.md)** | All 9 JSON Schemas reference | 6 min |
| **[advanced/](./advanced/)** | Mesh, Contracts, Verification, Audit, Brain, **SDK** | 20 min |
| **[SCHEMA.md](../SCHEMA.md)** | SKILL.md format specification v1 | 8 min |

---

## 🤝 Contributing

We welcome PRs for new skills, schemas, runtime adapters, and bug fixes. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the workflow and `SCHEMA.md` for the format. All skills must validate L2 (Standard) before merge.

---

## 📜 License

MIT © [UpFlame Labs](https://upflame.in) — see [LICENSE](../../LICENSE).

---

<div align="center">

**[⭐ Star the repo](https://github.com/upflame-labs/synarc)** · **[📦 View on npm](https://www.npmjs.com/package/synarc)** · **[🐛 Report a bug](https://github.com/upflame-labs/synarc/issues)**

Made with care for every engineer who has ever been burned by an AI that forgot what they agreed on 5 messages ago.

</div>
