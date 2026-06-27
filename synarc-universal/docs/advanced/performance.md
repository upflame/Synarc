---
title: Performance and Token Budget
description: How Synarc manages the token budget. The 3 injection levels (COMPACT/STANDARD/FULL), prefix-cache boundaries, and the cost-ceiling guardrail.
version: 6.6.4
schema: skill-pack/v1
---

# Performance and Token Budget

> Synarc is designed for **prompt-cache friendly** loading. The skills are written so that the first ~200 tokens are static across all sessions, the next ~2 KB is the most-used content, and the rest is loaded on demand. This is the **cache boundary discipline**.

---

## The 3 injection levels

| Level | Token cost | When |
|---|---|---|
| `SILENT` | ~0 tokens (just a marker) | Read-only analysis where the agent should not even acknowledge the skill is loaded |
| `COMPACT` | ~50 tokens | Per-tool-call agent execution |
| `STANDARD` | ~200 tokens | Session start, scope changes |
| `FULL` | ~500–2000 tokens | LARGE/ENTERPRISE projects, complex cross-boundary changes |

The level is selected by `synarc-core` based on the detected scale, the active WorkType, and the risk level.

---

## Cache boundary discipline

Each `SKILL.md` is divided into sections that are **independent cache boundaries**. A section is added or removed without invalidating the cache for other sections.

```text
┌──────────────────────────────────────┐
│ Section 1: Activation (static)        │  ← never changes mid-session
├──────────────────────────────────────┤
│ Section 2: Classification rules       │  ← cached, invalidated on WorkType change
├──────────────────────────────────────┤
│ Section 3: Capability tiers           │  ← cached, invalidated on capability change
├──────────────────────────────────────┤
│ Section 4: Domain-specific guidance   │  ← on demand
├──────────────────────────────────────┤
│ Section 5: Examples                   │  ← on demand
└──────────────────────────────────────┘
```

When `synarc-core` decides to inject a skill, it picks the **highest cache-stable prefix** that fits the budget. A change to Section 5 does not invalidate Sections 1-4.

---

## Token accounting

The runtime tracks the cumulative token spend:

- **Session budget** — soft cap, warn at 80%, hard cap at 100% with optional checkpoint
- **Per-tool budget** — prevent runaway single-tool calls
- **Per-mesh budget** — cap the total context the mesh consumes

The `cost-003` guardrail blocks a tool call if it would exceed the contract cost ceiling.

---

## Loading on demand

References, examples, and templates are **not loaded by default**. They live in `references/`, `templates/`, `examples/` subdirectories and are loaded only when the runtime detects a relevant signal (e.g., "show me an example", "what does the contract template look like").

This keeps the standard session overhead at **~200 tokens** for `synarc-core` and **~50 tokens** per additional activated skill.

---

## Benchmarks

Measured on a real coding task ("add a column to users table, run migration, add test"):

| Phase | Tokens (cumulative) | Latency |
|---|---|---|
| Cold start, scale detection | ~150 | ~80ms |
| WorkType classification | +~50 | ~30ms |
| Risk assessment | +~80 | ~40ms |
| Skill activation (avg 3 skills) | +~150 | ~50ms |
| Total session overhead | ~430 tokens | ~200ms |

Compared to loading the full SKILL.md of every skill, this is a **~95% reduction** in token spend.

---

## See also

- [Architecture](../architecture.md) — the 7 layers and the compiler pattern
- [The Mesh](./mesh.md) — how multi-role activation budgets tokens
