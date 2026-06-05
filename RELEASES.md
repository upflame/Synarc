# Synarc Release Lines

Synarc currently has **two parallel v6 release lines** because the v6 design space
forked in June 2026. Both are production-quality, both are maintained, and both
ship from this repository. Pick the one that matches your priorities.

## The two lines

### `v6.0.0` — Cache Rewrite (origin/main)

- **Branch:** `main`
- **Tag:** [`v6.0.0`](https://github.com/upflame/Synarc/releases/tag/v6.0.0)
- **Commit:** `5a083eb` — *feat: Synarc v6.0.0 — 4-tier prompt-caching + 38x token reduction*
- **Author date:** 2026-06-04

**Design focus:** performance and contract minimalism.

- 4-tier prompt-caching architecture (core / domain / reference / context)
- 8-block SKILL.md template, `intent_triggers` + `cache_tier` frontmatter
- **40 skills**, **38× token reduction** (15,670 KB → 412.9 KB)
- Strict size caps (max 13.7 KB per SKILL.md)
- 40/40 validator pass
- No 16-skill P0 cohort, no mesh runtime, no AGENTS.md standard

**Best for:** production deployments where token cost dominates,
strict size governance, and minimal-viable skills matter more than role breadth.

---

### `v6.1.0` — Cognition Mesh (release/v6.1.0-cognition-mesh)

- **Branch:** [`release/v6.1.0-cognition-mesh`](https://github.com/upflame/Synarc/tree/release/v6.1.0-cognition-mesh)
- **Tag:** [`v6.1.0-cognition-mesh`](https://github.com/upflame/Synarc/releases/tag/v6.1.0-cognition-mesh)
- **Commit:** `7872a6d` — *release: v6.0.0 — Cognition Mesh*
- **Author date:** 2026-06-05

**Design focus:** multi-role team collaboration and ecosystem coverage.

- **Cognition Mesh runtime** — `MeshCoordinator`, `MeshWorkingMemory`, `MeshProtocol` (handoff / parallel / debate / specialist-pool), `MeshManifest`
- **56 skills** (40 v5 + 16 v6 P0 cohort: 8 AI-Era, 4 Product/Design, 4 Quality)
- **`synarc-universal/`** portable skill pack with manifest, schemas, guardrails, and 9 runtime adapters
- **AGENTS.md cross-tool standard** (Linux Foundation Agentic AI Foundation, 2026)
- **9-agent install guide** (Claude Code / Codex / OpenCode / Cursor / Windsurf / Copilot / Gemini / Cline / Roo Code migration)
- Structured ledger queries (Markdown default, SQLite in v6.1.0-beta, remote in v6.2.0)
- 56/56 validator pass

**Best for:** engineering teams who want role-based collaboration, broader
skill coverage (AI-era, product, design, quality), and cross-tool portability
via the AGENTS.md standard.

---

## Decision matrix

| If you need… | Choose |
|--------------|--------|
| Lowest token cost, fastest cold-start | `v6.0.0` |
| Strict size governance per skill | `v6.0.0` |
| Multi-role team / mesh collaboration | `v6.1.0` |
| AI-era skills (RAG, agents, MLOps, safety) | `v6.1.0` |
| Product / design / quality roles | `v6.1.0` |
| AGENTS.md cross-tool standard | `v6.1.0` |
| Structured ledger queries (JSON-style) | `v6.1.0` |
| 9-agent install coverage incl. Cline post-Roo | `v6.1.0` |
| Minimal viable skill set (40 skills) | `v6.0.0` |
| Smallest repo footprint | `v6.0.0` |

## How the lines interact

The two lines are **not merge candidates**. They were designed against
incompatible contracts:

- `v6.0.0` uses `skill_type` and `cache_tier` in frontmatter; `v6.1.0` uses
  `skill_type` and `compatible_agents` (and rejects `cache_tier`).
- `v6.0.0` has 40 skills; `v6.1.0` adds 16 new skills with different
  activation patterns.
- `v6.0.0` has no `synarc-universal/` pack; `v6.1.0` is built around it.
- `v6.1.0` SKILL.md files reference the Cognition Mesh runtime; `v6.0.0`
  SKILL.md files do not.

A future `v7.0.0` is planned to unify both lines (see the roadmap in
[CHANGELOG.md](CHANGELOG.md)), but for now they evolve independently.

## Installing

### Cache Rewrite (v6.0.0)
```bash
/plugin marketplace add upflame/Synarc
/plugin install synarc@upflame-marketplace    # tag v6.0.0
```
…or use the `main` branch in your checkout.

### Cognition Mesh (v6.1.0)
```bash
/plugin marketplace add upflame/Synarc
# Switch to the cognition mesh tag
git checkout v6.1.0-cognition-mesh
/plugin install synarc@upflame-marketplace
```
…or use the `release/v6.1.0-cognition-mesh` branch.

For all 9 agents (Codex, OpenCode, Cursor, Windsurf, Copilot, Gemini CLI,
Cline, Claude Web/API, plus Claude Code), see
[`synarc-universal/docs/installation.md`](synarc-universal/docs/installation.md).

## Reporting issues

Please open issues against the correct branch:

- `v6.0.0` issues → against `main`
- `v6.1.0` issues → against `release/v6.1.0-cognition-mesh`

## License

Both lines are MIT. See [LICENSE](LICENSE).
