# Synarc v6 — Cognition Mesh Architecture

**Version:** 6.0.0
**Status:** Released (alpha)
**Last updated:** 2026-06-05

This document describes the architecture of Synarc v6.0.0. It is the companion to the v6 vision (`brain/V6_VISION.md`) and explains *how* the Cognition Mesh works, *what* the runtime does, and *how* skills interact.

> Audience: contributors extending Synarc, integrators wiring it into their toolchain, and reviewers evaluating the design.


## 1 — Design Goals

v5.0.0 shipped a deterministic engineering-intelligence runtime: a single skill at a time, no shared state, no tool integration. That worked. v6 broadens the model to match how real engineering teams collaborate.

| Goal | What it means |
|---|---|
| **Team over solo** | A task is no longer answered by one skill. Several roles activate at once and produce a coordinated output. |
| **Living memory over static ledger** | The session ledger becomes a queryable, structured, append-only memory that downstream skills can read and write. |
| **Platform over library** | First-party MCP servers expose the mesh to external tools (IDEs, browsers, CLIs). The pack becomes an integration target, not a doc set. |
| **Additive over breaking** | Every v5 capability still works the same way. v6 is a superset, never a breaking change. |
| **Local-first over cloud-first** | Everything runs in the agent's process. No external service is required. MCP servers are optional. |


## 2 — Layered Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  L4  Tool Surfaces  —  IDE, CLI, browser, MCP, HTTP            │
├────────────────────────────────────────────────────────────────┤
│  L3  Cognition Mesh  —  multi-role coordination, shared state  │
├────────────────────────────────────────────────────────────────┤
│  L2  Skills           —  57 domain skills, intent-activated    │
├────────────────────────────────────────────────────────────────┤
│  L1  synarc-core      —  classification, risk, session ledger  │
├────────────────────────────────────────────────────────────────┤
│  L0  Universal Format —  SKILL.md, skill.yaml, guardrails.yaml │
└────────────────────────────────────────────────────────────────┘
```

### 2.1 — L0 — Universal Format (unchanged from v5)

Every skill is a directory with four files:

```
skills/<skill-id>/
  SKILL.md          full reasoning body, ~500–600 lines
  skill.yaml        machine-readable metadata
  guardrails.yaml   refusal + safety + honesty rules
  CHANGELOG.md      version history
```

The schema is `skill-pack/v1` and is shared with v5 — no changes. L0 is frozen.

### 2.2 — L1 — synarc-core (always-on)

`synarc-core` is the only always-on skill. It owns:

- **Classification**: 12 WorkTypes, 7 dimensions, deterministic risk floor per WorkType × domain
- **Risk ladder**: 6 levels, hard floors, blast-radius estimation
- **Context injection**: COMPACT / STANDARD / FULL depth levels
- **Session ledger**: append-only hash-chained log, queryable
- **Quality gates**: zero-tolerance enforcement per work type
- **Mesh coordination** (new in v6): selects the right roles, sets up the working memory, drives the conversation

In v6, synarc-core gained the `mesh` capability. It is the conductor of the Cognition Mesh.

### 2.3 — L2 — Skills (57 in v6.0.0)

57 skills, organized in 13 categories:

- **engineering-intelligence** (24) — core reasoning: backend, frontend, security, SRE, data, ML, mobile, devops, observability, platform, privacy, ethics, debug, decision, risk, foundational reasoning, problem solving, change intelligence, cognition layer, coding agent, negative prompts, project scales, schemas, testing strategy
- **architecture** (4) — architect, api-designer, database-architect, chaos-engineer
- **leadership** (5) — staff-engineer, cto, engineering-manager, product-engineer, finops-engineer
- **ai-era** (8) — agentic-ai-engineer, prompt-engineer, rag-engineer, ai-safety-eval-engineer, agent-architect, ai-product-manager, mlops-engineer, data-scientist
- **product** (1) — product-manager
- **design** (3) — product-designer, content-designer, design-systems-engineer
- **quality** (4) — sdet-engineer, performance-engineer, release-engineer, accessibility-engineer
- **incident / debugging / risk** (3) — incident-commander, debug-engineer, risk-analyst
- **performance** (1) — performance-thinker (separate from performance-engineer; covers latency-only thinking pattern)
- **ml / data** (already counted) — ml-engineer, data-engineer

(Counts may not sum to 57 because some skills were renamed or recategorized in v6; the manifest is the source of truth.)

### 2.4 — L3 — Cognition Mesh (new in v6)

The mesh is **not** a single skill. It is a runtime pattern in `synarc-core` that activates when a task matches multiple intents.

**Mesh trigger conditions:**

1. Task contains 3+ distinct intent signals
2. Task mentions "team" / "collaborate" / "review together" / "handoff" / "spec" / "RFC"
3. Task explicitly invokes `/mesh` or `/team`
4. Default: when the user enables it via `synarc.mesh.enabled: true` in agent config

**Mesh components:**

- **MeshCoordinator** (in synarc-core): selects roles, sets depth, drives state
- **MeshWorkingMemory**: shared scratchpad, scoped to the mesh session
- **MeshProtocol**: defines how roles pass control and merge output
- **MeshManifest**: declarative description of which roles participate

Example mesh declaration:

```yaml
mesh:
  id: checkout-flow-design
  trigger: "build a checkout flow"
  roles:
    - product-manager
    - product-designer
    - frontend-engineer
    - backend-engineer
    - accessibility-engineer
    - performance-engineer
    - sdet-engineer
    - release-engineer
    - security-engineer
  working_memory: ephemeral
  protocol: handoff-chain
  output: unified-spec
```

### 2.5 — L4 — Tool Surfaces (new in v6)

v6 ships the first-party MCP integration:

- `synarc-mcp` server (planned for v6.0.0-beta): exposes the mesh, the ledger, and a curated set of skill tools to MCP-aware agents (Claude Desktop, Cursor, etc.)
- HTTP webhook server: lets external CI / CD systems trigger the mesh for review / approval workflows
- VS Code extension (planned v6.1.0): inline mesh status, click-to-activate, diff view of mesh output

The MCP server is **optional**. The pack works without it.


## 3 — Cognition Mesh in Detail

### 3.1 — When the Mesh Activates

The MeshCoordinator runs three checks in order:

```
1. EXPLICIT INVOCATION
   - User typed /mesh, /team, or "use a team for this"
   - Triggered by user signal
   - Always honors

2. MULTI-INTENT DETECTION
   - Intent classifier returns >= 3 distinct intents
   - AND those intents are non-overlapping (no two roles for the same job)
   - Confidence >= 0.7
   - Triggered automatically

3. USER PREFERENCE
   - synarc.mesh.enabled = true in agent config
   - User has a history of mesh-style tasks
   - Triggered by configuration
```

If none of these fire, the runtime falls back to v5-style single-skill activation. v5 behavior is preserved.

### 3.2 — Mesh Lifecycle

```
INIT     →  classify task, select roles, init working memory
SPAWN    →  inject first role, set its scope and inputs
HANDOFF  →  role produces output, writes to working memory
          →  next role reads, extends, hands off
MERGE    →  coordinator merges all role outputs
REVIEW   →  optional human-in-the-loop checkpoint
DELIVER  →  final output to user / tool
PURGE    →  working memory released, ledger entry written
```

The protocol can be:

- **handoff-chain** — roles in sequence, each reads the previous output
- **parallel-deliberate** — roles work in parallel, merge at the end
- **debate-arbitrate** — roles may disagree, an arbiter resolves
- **specialist-pool** — generic role delegates to specialist

The default for v6.0.0 is **handoff-chain**. The others are planned for v6.1.0.

### 3.3 — Working Memory

A per-mesh scratchpad with three scopes:

- **read-only-input** — task statement, user constraints, project context (from synarc-core)
- **role-output** — append-only log of what each role produced
- **coordination-state** — current role, next role, merge status

Working memory is **ephemeral** by default and purged at mesh end. It can be persisted (`synarc.mesh.persist: true`) for later audit, which is the default in regulated environments.

### 3.4 — Mesh Output

The merge step produces a structured deliverable:

```yaml
mesh_output:
  id: <mesh-id>
  participants: [<role-list>]
  task: <original-task>
  per_role_output:
    - role: product-manager
      output: <structured>
    - role: product-designer
      output: <structured>
    - ...
  conflicts: [<list of disagreements and resolutions>]
  unified: <merged single response>
  audit: <ledger hash, timestamp, role-by-role timing>
```

The output is JSON-serializable. This means downstream tools (IDEs, CI, MCP clients) can consume it programmatically.


## 4 — Session Ledger (Living Memory)

In v5, the ledger was a Markdown changelog in `brain/CHANGE_LEDGER.md`. In v6, it is a queryable, structured store.

### 4.1 — Ledger Schema (v6)

Each entry is a JSON record:

```json
{
  "id": "uuid",
  "ts": "2026-06-05T12:34:56Z",
  "session": "session-id",
  "type": "decision | risk | change | mesh | error | review",
  "actor": "user | skill-id | mesh-id",
  "summary": "human-readable one-liner",
  "details": { ... structured payload ... },
  "tags": ["checkout", "release", "v6"],
  "prev_hash": "sha256-of-previous-entry"
}
```

### 4.2 — Ledger Queries

Skills can ask the ledger:

```
ledger.query(
  type="decision",
  tags=["checkout", "release"],
  since="2026-06-01"
)
```

This is the basis for "living memory": a skill can ask "what decisions did we make about checkout?" instead of grepping brain documents.

### 4.3 — Ledger Backends

- **Markdown** (default, v5-compatible) — writes to `brain/CHANGE_LEDGER.md`
- **SQLite** (planned v6.1.0) — for power users, fast queries
- **Remote** (planned v6.2.0) — for team mode, central ledger

The v6.0.0 default is Markdown, fully backward-compatible with v5 consumers.


## 5 — MCP Integration (planned v6.0.0-beta)

### 5.1 — synarc-mcp Server

Exposes:

- `mesh.run(task, roles?)` — invoke a mesh, return the structured output
- `mesh.list()` — list available meshes (built-in + user-defined)
- `ledger.query(...)` — query the ledger
- `skill.activate(skill_id, context?)` — manually activate a skill
- `risk.assess(change)` — run the change-intelligence pipeline
- `review.assemble(change)` — run the change review mesh

### 5.2 — Configuration

```json
{
  "mcpServers": {
    "synarc": {
      "command": "synarc-mcp",
      "args": ["--pack", "synarc-universal", "--version", "6.0.0"]
    }
  }
}
```

### 5.3 — Compatible Agents

- Claude Desktop ✓
- Cursor ✓ (via MCP)
- Windsurf ✓ (via MCP)
- Continue ✓ (via MCP)
- Codex CLI (planned v6.1.0)


## 6 — Compatibility Matrix

| v5.0.0 | v6.0.0 | Notes |
|---|---|---|
| 41 skills | 57 skills | +16 P0, +11 P1/P2 planned |
| `skill-pack/v1` | `skill-pack/v1` | no schema change |
| 9 runtimes | 9 runtimes | + MCP surface |
| Single-skill activation | Single + mesh | additive |
| Markdown ledger | Markdown ledger (default) | + structured queries |
| No MCP | Optional MCP | opt-in |

**Zero breaking changes for v5 consumers.** Every v5 skill continues to work, every v5 manifest is valid, every v5 script runs.


## 7 — Performance Budget

The mesh adds a coordination overhead. Budgets:

- **Mesh activation overhead**: < 75ms p99
- **Role handoff**: < 25ms p99
- **Working memory read/write**: < 10ms p99
- **Mesh run for 3-role task**: < 1.2s total
- **Mesh run for 9-role task**: < 3.5s total

These budgets are enforced in CI via the performance-engineer skill's test suite.


## 8 — Security Posture

### 8.1 — Trust Boundaries

- The mesh is **in-process**. No role runs in a separate sandbox by default.
- Mesh output is written to the user-controlled workspace, not exfiltrated.
- Ledger is local by default; remote ledgers require explicit opt-in.
- MCP server, when installed, listens on `127.0.0.1:PORT` by default.

### 8.2 — Guardrails

Every skill ships a `guardrails.yaml` with:

- `refusal_rules` — explicit things the skill will not do
- `safety_constraints` — hard constraints
- `honesty_rules` — capability boundaries and fallbacks
- `escalation_policy` — when to escalate to human / other skills

The mesh **inherits the union** of all participating roles' guardrails. If any role refuses, the mesh halts and reports.

### 8.3 — Adversarial Robustness

The ai-safety-eval-engineer skill is part of the standard mesh for any task involving user input, LLM calls, or production data. It runs as a background reviewer, not a producer.


## 9 — Failure Modes and Recovery

| Failure | Detection | Recovery |
|---|---|---|
| Role hangs | watchdog timer | terminate role, log, continue with empty slot |
| Role conflicts | merge step finds disagreement | surface conflict to user, do not auto-resolve |
| Mesh cycle | role count grows without progress | cut at 20 roles, log |
| Ledger corruption | hash chain break | halt, request manual repair |
| MCP server crash | health check | fallback to in-process mesh |
| Working memory overflow | size guard | purge oldest role outputs, keep coordination-state |


## 10 — Future Work

- **v6.0.0-beta** — full mesh runtime, MCP server, SQLite ledger
- **v6.1.0** — P1 skills (platform PM, growth PM, ux-researcher, technical-writer, devrel), VS Code extension
- **v6.2.0** — P2 verticals (fintech, healthtech, edtech, govtech, gamedev), team mode (shared ledger)
- **v7.0.0** (research) — self-extending skills (a skill that observes another role and proposes its own update)


## 11 — Open Questions

- Should mesh output be cached across sessions? (planned: no by default, yes with `mesh.cache: true`)
- Should the mesh learn from past outputs? (planned: opt-in only, on-device fine-tune is out of scope)
- Should MCP server support streaming? (planned: yes, via Server-Sent Events)


## 12 — References

- `brain/V6_VISION.md` — the v6 vision, "why" and "what"
- `manifest.yaml` — the v6 manifest, source of truth for skills
- `AGENTS.md` — activation and quick start
- `brain/CHANGE_LEDGER.md` — chronological record of decisions
- `brain/CURRENT_STATE.md` — current focus and status
- `docs/MIGRATION_v5_to_v6.md` — migration guide
- `CHANGELOG.md` — release notes


*Synarc v6.0.0 — Cognition Mesh. Solo to team. Static to living. Library to platform.*
