---
title: The Cognition Mesh
description: Deep dive on the multi-role collaboration runtime that turns 56 skills into a coordinated engineering team.
version: 6.6.4
schema: skill-pack/v1
---

# The Cognition Mesh

> The biggest change in Synarc v6: instead of activating one skill at a time, multiple roles collaborate on a single task with shared context, mesh triggers, and coordinated output.

---

## The problem

Single-skill activation works for narrow tasks. But real engineering is multi-disciplinary. A "build a checkout flow" request needs product, design, frontend, backend, security, accessibility, performance, testing, and release — at minimum. If you activate them one at a time, each one re-derives context, and the outputs contradict each other.

## The mesh model

The Cognition Mesh treats the skill pack as a **team**, not a menu. The `synarc-core` runtime is the **coordinator**:

```text
                     User intent
                          │
                          ▼
                synarc-core (coordinator)
                  │  │  │  │  │  │  │  │
                  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
                 R1  R2  R3  R4  R5  R6  R7  R8
              (selected roles, in priority order)
                          │
                          ▼
              Shared working memory (context)
                          │
                          ▼
              Coordinated output (one document)
```

### Roles vs skills

A **skill** is a body of knowledge. A **role** is a skill selected to participate in a mesh. Multiple roles can be the same skill, but typically each role is unique per mesh. The coordinator maps intent → roles.

### Mesh triggers

The mesh activates when:

1. The user intent matches **3+ activation patterns** across distinct skills, OR
2. The user explicitly invokes a `/mesh` command, OR
3. The `synarc-core` runtime detects a known composite task (e.g., "implement X with tests" → at minimum `backend-engineer` + `sdet-engineer`).

### Shared working memory

When the mesh activates, `synarc-core` allocates a **shared context block** that all roles can read. Each role writes its contribution to a named section of the block. The coordinator merges the contributions into a single coherent document.

```text
┌─────────────────────────────────────────────────┐
│ Shared working memory (one context block)        │
├─────────────────────────────────────────────────┤
│ § Intent        : "build a checkout flow"       │
│ § Scope         : src/checkout/, tests/checkout/ │
│ § Constraints   : WCAG 2.2 AA, LCP < 2.0s       │
│ § Hard floors   : payment=CRITICAL, auth=CRIT    │
│ § Risk cap      : HIGH                          │
├─────────────────────────────────────────────────┤
│ § product-manager       → opportunity framing   │
│ § product-designer      → interaction, a11y     │
│ § backend-engineer      → API, idempotency      │
│ § accessibility-engineer→ WCAG, keyboard, SR    │
│ § performance-engineer  → budget, CDN, preload  │
│ § sdet-engineer         → E2E, contract tests   │
│ § release-engineer      → canary, flag rollout  │
│ § security-engineer     → threat model, fraud   │
└─────────────────────────────────────────────────┘
```

### Role handoffs

Roles do not talk to each other directly. They write to the shared context, and the coordinator sequences the conversation:

1. **Frame** — `product-manager`, `product-designer` (opportunity, UX intent)
2. **Architect** — `architect`, `backend-engineer` (data model, API)
3. **Build** — `frontend-engineer`, `backend-engineer`, `database-architect`
4. **Guard** — `security-engineer`, `accessibility-engineer`, `performance-engineer`
5. **Verify** — `sdet-engineer`, `testing-strategy`
6. **Ship** — `release-engineer`, `sre-engineer`, `devops-engineer`

Each phase may add roles, retire roles, or request a checkpoint. The final output is the merged document, not 8 separate outputs.

---

## Mesh configuration

A mesh is configured by the **user intent** plus optional environment hints. The coordinator uses the `manifest.yaml` priority field plus the intent match score to pick roles.

You can also force roles:

```text
User: /mesh --roles=backend-engineer,sdet-engineer,security-engineer
       Implement password reset with rate limiting and tests.
```

Or force a coordination style:

| Style | Best for | Behavior |
|---|---|---|
| `parallel` | Independent aspects | All roles run, merge at end |
| `sequential` | Handoffs required | Phase-ordered, checkpoints between |
| `critique` | Design review | First role drafts, others critique |
| `consensus` | Multi-stakeholder | Roles vote, coordinator resolves ties |

Default: `sequential` for non-trivial tasks, `parallel` for small meshes (<3 roles).

---

## See also

- [Usage Guide](../usage.md) — how skills activate normally
- [Intent Contracts](./intent-contracts.md) — what each role commits to
- [Verification](./verification.md) — how the mesh output is checked
