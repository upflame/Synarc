---
title: Synarc Universal — Autonomous Engineering Intelligence Runtime
description: Universal agent skill pack for engineering cognition — change classification, risk assessment, context injection, session tracking, quality gates. Compatible with all major AI coding agents.
version: 6.0.0
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
  - roo-code
activation: intent-based
---

# Synarc Universal — Engineering Intelligence Runtime (v6.0.0)

This AGENTS.md activates the Synarc skill pack. All 40 domain skills are available as universal SKILL.md files in the `skills/` directory.

## What's new in 6.0.0

- **4-tier prompt-caching architecture** — every skill declares its `cache_tier` (core / domain / reference / context / dynamic) so agents can pre-warm the cache and reduce per-turn cost.
- **Intent-based activation** — every skill declares `intent_triggers` (≥ 2 concrete trigger phrases). Match on user intent, not on platform-specific commands.
- **35× token reduction** — total pack is now ~450 KB (down from 15.67 MB). Each SKILL.md is 8–13 KB; the pack fits in a single cache miss.
- **Universal runtime support** — same files work in Codex, OpenCode, Cursor, Gemini CLI, Claude Code, Copilot, Windsurf, Cline, RooCode. No platform-specific fields.
- **Vendor-neutral naming** — no `anthropic`, `claude`, `gpt*`, `gemini` in skill names, descriptions, or content. Banned at validator level.

## Cache architecture (read this first)

| Tier | What | Cached for | Examples |
|------|------|------------|----------|
| 0 | Pack header (this file + manifest) | Always (every session) | `AGENTS.md`, `manifest.yaml` |
| 1 | Core reasoning | Always-on (per session) | `synarc-core`, `negative-prompts`, `cognition-layer`, `schemas` |
| 2 | Active domain skill | Per task (until task changes) | `debug-engineer`, `architect`, `security-engineer`, etc. |
| 3 | Skill references | Lazy (on first reference) | `skills/<id>/references/*.md` |
| 4 | Dynamic context | Never | Project files, tool outputs, error logs |

**Anti-cache rules (Tiers 0–2):** no timestamps, no session IDs, no user data, no tool-result echoes. Dynamic content goes to Tier 4.

## How skills activate

Activation is **intent-based** — match the user's intent against the skill's `intent_triggers`. A skill is loaded when at least one trigger phrase matches the user's request. No platform-specific commands.

| Your intent | Skill activated (cache tier) |
|-------------|------------------------------|
| Any engineering task (always) | `synarc-core` (Tier 1, critical) |
| Codify a prohibition, check banned vocabulary | `negative-prompts` (Tier 1, critical) |
| Reasoning architecture, prompt design | `cognition-layer` (Tier 1, critical) |
| Validate a brain document schema | `schemas` (Tier 1, critical) |
| Debug, fix error, root cause analysis | `debug-engineer` (Tier 2, high) |
| Architecture design, system review | `architect` (Tier 2, high) |
| Security audit, vulnerability fix | `security-engineer` (Tier 2, high) |
| Backend, API, service design | `backend-engineer`, `api-designer` (Tier 2) |
| Frontend, UI, components | `frontend-engineer`, `ui-engineer`, `ux-engineer` (Tier 2) |
| Database, data modeling | `database-architect`, `data-engineer` (Tier 2) |
| Infrastructure, deploy, CI/CD | `infrastructure-engineer`, `devops-engineer` (Tier 2) |
| Reliability, observability, incidents | `sre-engineer`, `observability-engineer`, `incident-commander` (Tier 2) |
| ML, AI systems | `ml-engineer` (Tier 2) |
| Mobile apps | `mobile-engineer` (Tier 2) |
| Cost optimization | `finops-engineer` (Tier 2) |
| Privacy, ethics, security | `privacy-engineer`, `ethics-engineer` (Tier 2) |
| Decision, risk, change | `decision-engineer`, `risk-analyst`, `change-intelligence` (Tier 2) |
| Team, tech leadership | `staff-engineer`, `cto`, `engineering-manager` (Tier 2) |

## Core capabilities (via `synarc-core`)

All skills share these capabilities via `skills/synarc-core/SKILL.md`:

- **Change Classification** — 12 WorkTypes, 7 dimensions, deterministic risk floors
- **Risk Assessment** — 6-level risk ladder with hard floors per domain
- **Context Injection** — COMPACT / STANDARD / FULL injection levels
- **Session Tracking** — Immutable ledger across sessions
- **Quality Gates** — Zero-tolerance enforcement per WorkType
- **Error Intelligence** — 6-step protocol with persistent error memory

## Fallback system (4 tiers)

Every capability supports a 4-tier fallback chain:

1. **Tier 1 — Native execution** — agent performs the capability natively
2. **Tier 2 — External integration** — use external tools / APIs if Tier 1 unavailable
3. **Tier 3 — Manual workflow** — follow step-by-step manual instructions
4. **Tier 4 — Human-assisted** — produce structured output for human review

## Quick start

```
Context: Node.js 20 REST API with Express + PostgreSQL
Task: Add user authentication
Scale: MEDIUM — team of 4, ~15k LOC, 6 modules
```

The skill pack auto-detects project scale via `project-scales`, activates relevant domain skills via `intent_triggers`, and provides classified, risk-aware engineering output via `synarc-core`.

## v5 → v6 migration

| v5 (deprecated) | v6 (replacement) |
|-----------------|------------------|
| `activation: always-on` | `cache_tier: core` + `priority: critical` |
| `activation: intent-based` | `intent_triggers: [...]` (array, ≥ 2) |
| `skill_type: capability` | (removed; use `category` in skill.yaml) |
| `dependencies: { synarc-core: ">=5.0.0" }` | (removed; cache_tier declares the relationship) |
| `description: "FinOps Engineer"` | 3rd-person, 40–1024 chars, with concrete triggers |
| 12-section template | 8-block template (frontmatter + persona / activation / workflow / decision-rules / output-format / gotchas / references / changelog) |

## Skill directory index

```
skills/
├── synarc-core/             Tier 1, critical — core runtime
├── negative-prompts/        Tier 1, critical — prohibition enforcement
├── cognition-layer/         Tier 1, critical — reasoning architecture
├── schemas/                 Tier 1, critical — brain document schemas
├── backend-engineer/        Tier 2, development
├── frontend-engineer/       Tier 2, development
├── ui-engineer/             Tier 2, development — pixel-perfect
├── ux-engineer/             Tier 2, development — research-driven
├── fullstack-engineer/      Tier 2, development
├── data-engineer/           Tier 2, data
├── mobile-engineer/         Tier 2, mobile
├── ml-engineer/             Tier 2, ml
├── infrastructure-engineer/ Tier 2, devops
├── devops-engineer/         Tier 2, devops
├── sre-engineer/            Tier 2, devops
├── observability-engineer/  Tier 2, devops
├── platform-engineer/       Tier 2, devops
├── chaos-engineer/          Tier 2, devops
├── finops-engineer/         Tier 2, devops
├── security-engineer/       Tier 2, security
├── privacy-engineer/        Tier 2, security
├── ethics-engineer/         Tier 2, security
├── architect/               Tier 2, architecture
├── api-designer/            Tier 2, architecture
├── database-architect/      Tier 2, architecture
├── staff-engineer/          Tier 2, leadership
├── cto/                     Tier 2, leadership
├── engineering-manager/     Tier 2, leadership
├── product-engineer/        Tier 2, leadership
├── performance-thinker/     Tier 2, engineering-intelligence
├── incident-commander/      Tier 2, engineering-intelligence
├── debug-engineer/          Tier 2, engineering-intelligence
├── decision-engineer/       Tier 2, engineering-intelligence
├── risk-analyst/            Tier 2, engineering-intelligence
├── foundational-reasoning/  Tier 2, engineering-intelligence
├── problem-solver/          Tier 2, engineering-intelligence
├── change-intelligence/     Tier 2, engineering-intelligence
├── coding-agent/            Tier 2, engineering-intelligence
├── project-scales/          Tier 2, engineering-intelligence
└── testing-strategy/        Tier 2, engineering-intelligence
```

## Reference

- `shared/workflows/` — canonical workflow definitions
- `shared/guardrails/` — constitutional safety rules
- `shared/schemas/` — JSON Schema for all data structures
- `shared/standards/` — naming conventions, frontmatter spec, style spec
- `shared/runtime-adapters/` — per-runtime compilation rules
- `docs/` — installation, compatibility, architecture
- `security/` — OWASP mapping, adversarial scenarios
- `scripts/sync-v6.ps1` — regenerate manifest, skill.yaml, marketplace.json from SKILL.md
- `scripts/validate-skills.ps1` — v6 contract validator
- `scripts/measure-skills.ps1` — size, token, and cache-tier measurement
