---
title: Synarc Universal — Autonomous Engineering Intelligence Runtime
description: Universal agent skill pack for engineering cognition — change classification, risk assessment, context injection, session tracking, quality gates. Compatible with all major AI coding agents.
version: 5.0.0
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

# Synarc Universal — Engineering Intelligence Runtime

This AGENTS.md file activates the Synarc skill pack. All 40 domain skills are available as universal SKILL.md files in the `skills/` directory.

## How Skills Activate

When you encounter a task that matches a skill's activation conditions, the corresponding skill loads automatically. Activation uses intent-based matching — not platform-specific commands.

| Your Intent | Skill Activated |
|-------------|----------------|
| Debug, fix error, root cause analysis | `skills/debug-engineer/SKILL.md` |
| Architecture design, system review | `skills/architect/SKILL.md` |
| Security audit, vulnerability fix | `skills/security-engineer/SKILL.md` |
| Backend development, API design | `skills/backend-engineer/SKILL.md` |
| Frontend, UI, component architecture | `skills/frontend-engineer/SKILL.md` |
| Database design, query optimization | `skills/database-architect/SKILL.md` |
| Infrastructure, deployment, CI/CD | `skills/infrastructure-engineer/SKILL.md` |
| Testing strategy, test generation | `skills/testing-strategy/SKILL.md` |
| Change analysis, risk assessment | `skills/change-intelligence/SKILL.md` |
| Session tracking, context continuity | `skills/synarc-core/SKILL.md` |
| Any engineering task | `skills/synarc-core/SKILL.md` (always active) |

## Core Capabilities

All skills share these capabilities via `skills/synarc-core/SKILL.md`:

- **Change Classification**: 12 WorkTypes, 7 dimensions, deterministic risk floors
- **Risk Assessment**: 6-level risk ladder with hard floors per domain
- **Context Injection**: COMPACT/STANDARD/FULL injection levels
- **Session Tracking**: Immutable ledger across sessions
- **Quality Gates**: Zero-tolerance enforcement per work type
- **Error Intelligence**: 6-step protocol with persistent error memory

## Fallback System

Every capability supports a 4-tier fallback chain:

1. **Tier 1 — Native Execution**: Agent performs the capability natively
2. **Tier 2 — External Integration**: If Tier 1 unavailable, use external tools/APIs
3. **Tier 3 — Manual Workflow**: If Tier 2 unavailable, follow step-by-step manual instructions
4. **Tier 4 — Human-Assisted**: If all else fails, produce structured output for human review

## Quick Start

```
Context: Node.js 20 REST API with Express + PostgreSQL
Task: Add user authentication
Scale: MEDIUM — team of 4, ~15k LOC, 6 modules
```

The skill pack auto-detects project scale, activates relevant domain skills, and provides classified, risk-aware engineering output.

## Skill Directory Index

```
skills/
├── synarc-core/           Core runtime (always active)
├── backend-engineer/      Backend architecture & API design
├── frontend-engineer/     Frontend & component architecture
├── ui-engineer/           UI implementation & CSS
├── ux-engineer/           UX design & research
├── fullstack-engineer/    End-to-end feature delivery
├── data-engineer/         Data pipeline & ETL
├── mobile-engineer/       Mobile app architecture
├── ml-engineer/           ML pipeline & MLOps
├── infrastructure-engineer/  Platform & networking
├── devops-engineer/       CI/CD & deployment
├── sre-engineer/          SLOs, error budgets, reliability
├── observability-engineer/   Metrics, tracing, logging
├── platform-engineer/     Internal developer platforms
├── security-engineer/     Threat modeling & defense
├── privacy-engineer/      Data privacy & compliance
├── ethics-engineer/       AI ethics & fairness
├── architect/             Systems architecture
├── api-designer/          REST/GraphQL/gRPC design
├── database-architect/    Data modeling & indexing
├── chaos-engineer/        Failure injection & resilience
├── staff-engineer/        Technical leadership
├── cto/                   Technology strategy
├── engineering-manager/   Team & delivery management
├── product-engineer/      Product-minded engineering
├── finops-engineer/       Cloud cost optimization
├── performance-thinker/   Latency & throughput
├── incident-commander/    Incident response & ICS
├── debug-engineer/        Systematic debugging
├── decision-engineer/     Decision frameworks & ADRs
├── risk-analyst/          Risk analysis & mitigation
├── foundational-reasoning/  First principles & systems thinking
├── problem-solver/        Structured problem solving
├── cognition-layer/       Reasoning architecture & context
├── change-intelligence/   Change taxonomy & impact
├── coding-agent/          Code generation & execution
├── negative-prompts/      Prohibition enforcement
├── project-scales/        Scale detection & adaptation
├── schemas/               Brain document schemas
└── testing-strategy/      Risk-based testing
```

## Reference

- `shared/workflows/` — Canonical workflow definitions
- `shared/guardrails/` — Constitutional safety rules
- `shared/schemas/` — JSON Schema for all data structures
- `shared/standards/` — Naming conventions, frontmatter spec
- `shared/runtime-adapters/` — Per-runtime compilation rules
- `docs/` — Installation, compatibility, architecture
- `security/` — OWASP mapping, adversarial scenarios
