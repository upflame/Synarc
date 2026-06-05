# Changelog

All notable changes to Synarc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.0] — 2026-06-05 — Cognition Mesh

> **Note:** This release is published on the `release/v6.1.0-cognition-mesh` branch
> and tagged `v6.1.0-cognition-mesh`. It is an **alternate release line** alongside
> the cache-rewrite v6.0.0 on `main` (commit `5a083eb`, tag `v6.0.0`). See
> [RELEASES.md](RELEASES.md) for the full picture.

### Added

**Cognition Mesh runtime** — multi-role collaboration engine in `synarc-core`:
- MeshCoordinator: classifies tasks, selects roles, drives state
- MeshWorkingMemory: shared scratchpad, scoped to mesh session
- MeshProtocol: handoff-chain (default), parallel-deliberate, debate-arbitrate, specialist-pool
- MeshManifest: declarative mesh declarations
- Triggers: `/mesh` command, "use a team" intent, 3+ intent signals, config opt-in

**Structured ledger queries** — queryable layer over the v5 Markdown ledger:
- `ledger.query(type, tags, since, ...)` JSON-style queries
- Default backend: Markdown (v5-compatible)
- SQLite backend planned for v6.1.0
- Remote (team) backend planned for v6.2.0

**MCP integration** (planned v6.0.0-beta):
- `synarc-mcp` server exposing mesh, ledger, and skill tools
- Compatible with Claude Desktop, Cursor, Windsurf, Continue

**16 new skills** (P0 — shipped in v6.0.0):

*AI-Era (8):*
- `agentic-ai-engineer` — agent loops, tool use, ReAct, planning, memory, multi-agent orchestration, MCP
- `prompt-engineer` — system prompts, few-shot, CoT, structured output, prompt patterns, evaluation
- `rag-engineer` — chunking, embeddings, vector DBs, hybrid search, re-ranking, GraphRAG, evaluation
- `ai-safety-eval-engineer` — red teaming, jailbreaks, adversarial prompts, eval harnesses, EU AI Act
- `agent-architect` — tool design, agent topologies, orchestration patterns, agent SDKs
- `ai-product-manager` — model selection, cost-quality-latency tradeoffs, evals-as-product
- `mlops-engineer` — feature stores, model registries, training pipelines, drift, LLMOps
- `data-scientist` — EDA, hypothesis testing, causal inference, feature engineering, experiment analysis

*Product (1):*
- `product-manager` — discovery, opportunity sizing, PRDs, prioritization (RICE/ICE/Kano), North Star metric

*Design (3):*
- `product-designer` — interaction design, wireframing, prototyping, design critique, usability testing
- `content-designer` — UX writing, microcopy, voice/tone, error messages, empty states, localization
- `design-systems-engineer` — tokens, primitives, components, Figma libraries, code-gen, governance

*Quality (4):*
- `sdet-engineer` — test automation frameworks, page object model, contract testing (Pact), E2E at scale
- `performance-engineer` — profiling, load/stress/soak testing, capacity planning, Web Vitals
- `release-engineer` — CI/CD pipelines, deployment strategies (canary, blue/green, rolling, shadow), feature flags
- `accessibility-engineer` — WCAG 2.2, ARIA patterns, keyboard navigation, screen reader, VPAT, ADA/EAA

**Documentation:**
- `brain/V6_VISION.md` — the v6 vision (why, what, when)
- `docs/ARCHITECTURE.md` — full v6 architecture (how)
- `docs/MIGRATION_v5_to_v6.md` — v5→v6 upgrade guide

**Brain updates:**
- `brain/CHANGE_LEDGER.md` — added v6 plan session (2026-06-05)

### Changed

- Pack version: 5.0.0 → 6.0.0
- Pack name: "Synarc Universal — Engineering Intelligence Runtime" → "Synarc Universal — Cognition Mesh (Engineering Intelligence Runtime)"
- Pack description: expanded to mention multi-role collaboration, MCP, living memory
- Categories: added `ai-era`, `product`, `design`, `quality`
- Tags: added `cognition-mesh`, `multi-role-teams`, `ai-era`, `mcp`, `agent-orchestration`
- Compatible agents: still 9 (unchanged)
- Schema: `skill-pack/v1` (unchanged)
- All 41 v5 skills preserved at v5 versions

### Deprecated

**None.** Every v5 surface continues to work. There is nothing in v5 to migrate away from.

### Removed

**None.**

### Fixed

- `product-designer` guardrails.yaml YAML indentation (corrected in v6.0.0)
- 16 v6 P0 skills SKILL.md: `compatibility:` → `compatible_agents:` to match v5 convention enforced by `validate-skills.ps1`
- `validate-skills.ps1`: replaced deprecated `$MyInvocation.MyCommand.Path` with `$PSCommandPath` (script is now runnable on PowerShell 5.1)
- `validate-skills.ps1`: fixed link-resolution false positives on Python code blocks. Old regex `(?s)```.*?``` ` matched empty adjacent fence pairs in preference to real code blocks (PowerShell + .NET non-greedy behavior). Replaced with anchored pattern `(?ms)^```[^\r\n]*\r?\n.*?\r?\n^```\s*$` that only matches properly-opened code fences, plus inline-code strip. Eliminates 5 false-positive "broken reference link" warnings in `ml-engineer`
- 56/56 skills now pass validation with 0 warnings (40 v5 carried over + 16 v6 new)

### Security

- All 16 new skills ship with `guardrails.yaml` (refusal rules, safety constraints, honesty rules, escalation policy)
- The mesh inherits the union of all participating roles' guardrails
- No new external network calls; everything runs in-process

### Performance

- Mesh activation overhead budget: < 75ms p99
- Role handoff: < 25ms p99
- Working memory read/write: < 10ms p99
- 3-role mesh: < 1.2s total
- 9-role mesh: < 3.5s total

### Compatibility

| Surface | Status |
|---------|--------|
| v5.0.0 manifests | Valid in v6.0.0 |
| v5.0.0 skills | All still present |
| v5.0.0 scripts | Unchanged |
| v5.0.0 activation | Preserved as default |
| v5.0.0 risk ladder | Unchanged |
| v5.0.0 quality gates | Unchanged |
| v5.0.0 negative prompts | Unchanged |
| 9 compatible agents | Unchanged |

**Zero breaking changes.**

### Migration

See [`docs/MIGRATION_v5_to_v6.md`](docs/MIGRATION_v5_to_v6.md) for the full upgrade guide. TL;DR: pull the new version, restart your agent, opt into new features when ready.

### Known Issues

- Mesh runtime is alpha; expect rough edges
- 27 skills total are shipped or planned; 16 are P0 (shipped), 11 are P1/P2 (planned for v6.1.0 / v6.2.0)
- MCP server is planned for v6.0.0-beta, not yet shipped in v6.0.0
- Structured ledger queries read from Markdown; SQL backend is planned

### Contributors

v6.0.0 was planned and built in a single 2026-06-05 session. The Cognition Mesh design, the 16 P0 skills, the v6 architecture, the migration guide, and the v6 vision doc are all new in this release.

---

## [5.0.0] — 2026-05-26 — Engineering Intelligence Runtime

### Added

- 41 domain skills across 9 categories
- 7-step cognition pipeline: Classify → Inject → Execute → Log → Aggregate → Checkpoint → Emit
- 12 WorkTypes, 7 classification dimensions, 6-level risk ladder
- 6 project scales (NANO to ENTERPRISE) with auto-detection
- Session ledger, error intelligence protocol, agent handoff protocol
- Compiled-for-runtime scripts (PowerShell + Bash)
- Compatible with Claude Code, Codex CLI, Cursor, Windsurf, Claude API, and 4 more
- 9 runtimes supported
- 15 reference modules in `plugins/synarc/skills/references/`
- OWASP LLM01-LLM10 risk categories mapped

### Notes

- v5.0.0 was the first "stable" release. v5.0.1 and v5.0.2 (planned) are patch releases.
- v5.0.0 will continue to receive security fixes after v6.0.0.

---

## Roadmap

- **v6.1.0-beta** (TBD) — full mesh runtime, MCP server, SQLite ledger
- **v6.2.0** (TBD) — P1 skills (platform PM, growth PM, ux-researcher, technical-writer, devrel), VS Code extension
- **v6.3.0** (TBD) — P2 verticals (fintech, healthtech, edtech, govtech, gamedev), team mode (shared ledger)
- **v7.0.0** (research) — self-extending skills (a skill that observes another role and proposes its own update)

> Roadmap above applies to the **Cognition Mesh** release line (`release/v6.1.0-cognition-mesh`).
> The cache-rewrite line on `main` ships v6.0.0 → v6.0.x → v6.1.0 on its own track.
