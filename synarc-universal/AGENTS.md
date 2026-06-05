---
title: Synarc Universal — Cognition Mesh (Autonomous Engineering Intelligence Runtime)
description: Universal agent skill pack for engineering cognition — change classification, risk assessment, context injection, session tracking, quality gates, multi-role team collaboration, first-party MCP. Compatible with all major AI coding agents.
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

# Synarc Universal — Cognition Mesh (Engineering Intelligence Runtime)

This AGENTS.md file activates the Synarc skill pack. **56 domain skills** are shipped in v6.0.0 (40 carried over from v5 + 16 new in the v6 P0 cohort), with 11 more planned for v6.1.0 and v6.2.0 (67 total target). The pack now ships the **Cognition Mesh**: instead of activating one skill at a time, multiple roles can collaborate on a task, with shared context, mesh triggers, and coordinated output.

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

## v6.0.0 New Skills (16 — Cognition Mesh)

### AI-Era (8)

| Your Intent | Skill Activated |
|-------------|----------------|
| Build, debug, or design AI agents / agentic systems | `skills/agentic-ai-engineer/SKILL.md` |
| Design prompts, system prompts, few-shot, CoT, structured output | `skills/prompt-engineer/SKILL.md` |
| Retrieval-augmented generation, chunking, embeddings, vector DB | `skills/rag-engineer/SKILL.md` |
| AI safety, red teaming, jailbreaks, EU AI Act, evals | `skills/ai-safety-eval-engineer/SKILL.md` |
| Design multi-agent systems, tool schemas, agent topology | `skills/agent-architect/SKILL.md` |
| Ship an AI product, model selection, evals-as-product | `skills/ai-product-manager/SKILL.md` |
| MLOps / LLMOps, feature stores, model registry, drift | `skills/mlops-engineer/SKILL.md` |
| Data science, EDA, causal inference, experimentation | `skills/data-scientist/SKILL.md` |

### Product & Design (4)

| Your Intent | Skill Activated |
|-------------|----------------|
| Product discovery, prioritization, PRD, North Star | `skills/product-manager/SKILL.md` |
| Interaction design, wireframes, prototypes, usability | `skills/product-designer/SKILL.md` |
| UX writing, microcopy, voice/tone, empty states | `skills/content-designer/SKILL.md` |
| Design systems, tokens, components, Figma library | `skills/design-systems-engineer/SKILL.md` |

### Quality & Reliability (4)

| Your Intent | Skill Activated |
|-------------|----------------|
| Test automation, Playwright, Pact, flaky test remediation | `skills/sdet-engineer/SKILL.md` |
| Profiling, load testing, capacity planning, Web Vitals | `skills/performance-engineer/SKILL.md` |
| CI/CD, canary, blue/green, feature flags, rollback | `skills/release-engineer/SKILL.md` |
| WCAG 2.2, ARIA, screen reader, VPAT, ADA/EAA | `skills/accessibility-engineer/SKILL.md` |

## Cognition Mesh

In v6.0.0, multiple skills can activate together. The synarc-core skill acts as the **mesh coordinator**: it detects task intent, selects the right roles, defines a shared working memory, and orchestrates the conversation between them.

Example mesh for "build a checkout flow":

```
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

## Reference

- `shared/workflows/` — Canonical workflow definitions
- `shared/guardrails/` — Constitutional safety rules
- `shared/schemas/` — JSON Schema for all data structures
- `shared/standards/` — Naming conventions, frontmatter spec
- `shared/runtime-adapters/` — Per-runtime compilation rules
- `docs/` — Installation, compatibility, architecture
- `security/` — OWASP mapping, adversarial scenarios
