---
title: Synarc v6.0.0 Vision — Cognition Mesh
type: vision-document
status: active
version: 6.0.0
updated: 2026-06-05
owner: synarc-product
tags:
  - vision
  - v6
  - cognition-mesh
  - product-strategy
  - roadmap
---

# Synarc v6.0.0 — Cognition Mesh (Vision)

---

## Mission

Turn solo AI coding assistance into coordinated AI engineering teams.
v5 made agents safe. v6 makes them social.

---

## The Bet

The 2026 enterprise engineering stack will be staffed by AI agents acting in
specialized roles, not by single general-purpose assistants. The market signal is
clear: 8 new agentic-AI job titles emerged in 2026 (Agentic AI Engineer, AI Agent
Architect, AI Trainer, AI Safety & Eval Engineer, AI PM, MLOps Engineer, Prompt
Engineer, RAG Engineer). 60% of new enterprise projects contain an agentic
component. 57% of teams have agents in production today.

Synarc v5 ships 40 role skills. v5 has a coverage gap relative to this new
market: no RAG, no agentic orchestration, no prompt engineering, no AI safety,
no pure PM, no industry verticals, no multi-role team simulation.

**v6 fills the gap.**

---

## North Star Metric

**Average skills activated per turn in a Synarc session: 2.8**

v5 baseline: 1.0. A single user prompt currently activates one skill. v6 turns
activate 2–5 skills simultaneously, simulating a cross-functional team.

---

## Three Strategic Pillars

### Pillar 1 — From Solo Skill to Role Team

| v5 | v6 |
|---|---|
| One skill activates per turn | 2–5 roles collaborate per turn with explicit handoffs |
| User picks a role manually | Roles auto-compose based on intent + risk |
| Roles operate in isolation | Roles share a working memory within a turn |
| Skills emit outputs to user | Roles emit opinions to each other, mesh synthesizes |

Ship pre-bundled team presets: `team: ship-a-feature`, `team: harden-prod`,
`team: review-pr`, `team: build-ai-feature`.

### Pillar 2 — From Static Ledger to Living Memory

| v5 | v6 |
|---|---|
| Append-only markdown | Versioned, semantically-indexed brain |
| `what did we change?` returns last session | `find prior decisions about X` retrieves across sessions |
| Snapshots grow unbounded | Auto-archive + compress snapshots > N months |
| Brain is opaque to the user | Brain has an inspectable, queryable surface |

### Pillar 3 — From Skills Library to Platform

| v5 | v6 |
|---|---|
| SKILL.md files only | Skills + first-party MCP servers + templates + signed packs |
| Free MIT, single tier | Free MIT tier + paid infrastructure tier (MCP, signed packs) |
| 9 runtimes | 12 runtimes (add: Zed, Continue.dev, Cody) |
| Zero telemetry | Opt-in anonymous telemetry to self-hostable collector |

---

## Role Coverage Strategy

v5 ships 40 roles. v6 ships 67 (27 new in v6.0.0 GA).

### 27 New Roles in v6.0.0

#### AI-Era (8)
1. **agentic-ai-engineer** — build agent loops, tool-calling, sub-agent orchestration
2. **prompt-engineer** — system/agent prompts, prompt-evals, prompt-versioning
3. **rag-engineer** — embeddings, vector stores, retrieval, reranking
4. **ai-safety-eval-engineer** — red-teaming, jailbreak detection, harm evals
5. **agent-architect** — multi-agent topology, MCP integration, A2A protocols
6. **ai-product-manager** — PM for AI products, evals as specs, AI UX
7. **mlops-engineer** — distinct from ml-engineer: model serving, GPU infra, cost
8. **data-scientist** — distinct from data-engineer: stats, ab-tests, causal

#### Product / Design (4)
9. **product-manager** — distinct from product-engineer: PRDs, roadmaps, OKRs
10. **product-designer** — interaction patterns, flows, design critique
11. **content-designer** — microcopy, error messages, UX writing
12. **design-systems-engineer** — tokens, component libraries, theming

#### Quality / Reliability (4)
13. **sdet-engineer** — distinct from testing-strategy: test automation, contract tests
14. **performance-engineer** — distinct from performance-thinker: load, profile, flame
15. **release-engineer** — feature flags, canary, rollback orchestration
16. **accessibility-engineer** — distinct from UX: WCAG, ARIA, a11y

#### Security (3) — v6.0.0-beta
17. **appsec-engineer** — SAST/DAST, secure code review, threat modeling per-PR
18. **secops-engineer** — SIEM, detection rules, alert tuning
19. **compliance-engineer** — SOC 2, ISO 27001, HIPAA, GDPR-as-code

#### Business / GTM (3) — v6.0.0-beta
20. **solutions-architect** — pre-sales, customer architecture, RFPs
21. **developer-advocate** — DevRel content, demos, samples
22. **technical-writer** — API docs, runbooks, READMEs, changelogs

#### Industry Verticals (5) — v6.0.0 GA
23. **fintech-engineer** — payments, PCI, KYC, money flow
24. **healthtech-engineer** — HIPAA, FHIR, HL7, EHR
25. **edtech-engineer** — LMS, SCORM, learner data
26. **gamedev-engineer** — Unity, Unreal, game loop
27. **web3-engineer** — Solidity, smart contracts, EVM

---

## Roadmap

| Phase | Window | Theme | Skill Count |
|---|---|---|---|
| v5.0.0 | (shipped) | Universal pack | 40 |
| v6.0.0-alpha | Q3 2026 | More brains, same skeleton | 56 (16 new) |
| v6.0.0-beta | Q4 2026 | The mesh | 62 (6 new) |
| v6.0.0 GA | Q1 2027 | A platform, not a library | 67 (5 new) |

---

## Pricing & Packaging

| Tier | Free (Community) | Pro | Enterprise |
|---|---|---|---|
| Price | $0 | $19/dev/mo | Custom |
| All 67 skills | Yes | Yes | Yes |
| Role teams | 1 preset | All presets | All + custom |
| MCP servers | No | Yes | Yes |
| Signed manifests | No | Yes | Yes + SLSA |
| Telemetry | No | Opt-in | Required for SLA |
| Support | Community | 48h SLA | 4h SLA + dedicated PM |

The Pro tier monetizes **infrastructure** (MCP, signed packs, telemetry),
not **content** (skills remain MIT). This preserves community trust.

---

## Success Metrics

| Metric | v5 | v6 GA Target |
|---|---|---|
| Total skills | 40 | 67 |
| Avg skills per turn | 1.0 | 2.8 |
| Cross-session retrieval hit rate | N/A | >40% |
| Compatible runtimes | 9 | 12 |
| Marketplace stars | current | 3x |
| Paid tier conversion | 0% | 2% of active installs |
| Enterprise NPS | N/A | >40 |
| Activation latency | ~50ms | <75ms (mesh overhead) |

---

## Anti-Goals (What v6 Will NOT Do)

- v6 will not introduce breaking changes to v5 manifest format
- v6 will not require network calls (telemetry is opt-in)
- v6 will not lock content behind Pro (skills stay MIT)
- v6 will not sacrifice the "always-on, fast" promise (latency budget enforced)
- v6 will not bloat individual skills (each role must pass the v5 quality bar)

---

## Open Questions (Resolved Defaults)

| Question | Default for v6.0.0 |
|---|---|
| Paid tier? | Yes — Pro, infrastructure-only |
| Ship all 27 roles in one release? | No — phase 16 / 6 / 5 |
| Mesh in v6.0.0-alpha? | No — design only; runtime in v6.0.0-beta |
| Verticals? | Ship fintech + healthtech in GA; gamedev, edtech, web3 deferred to v6.1 |
| Brand change? | No — keep "Synarc" with "Cognition Mesh" subtitle |

---

*Owner: synarc-product. Status: active. Last updated 2026-06-05.*
