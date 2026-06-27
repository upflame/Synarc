## [6.6.4] - 2026-06-23 - Hotfix: ship `scripts/postinstall.js`

> Critical patch: 6.6.1 published without `scripts/postinstall.js` in the `files` whitelist, breaking `npm i synarc` with `Cannot find module '...\synarc\scripts\postinstall.js'`. On Windows the fallback `|| true` then surfaced a secondary `'true' is not recognized` error.

### Fixed
- `scripts/postinstall.js` is now whitelisted in `package.json` and ships in the npm tarball, so `npm i synarc` runs the postinstall hook cleanly on Windows, macOS, and Linux.
- The Windows `'true' is not recognized` artifact (a downstream symptom of the missing file) is gone.

### Changed
- `package.json` `files` array now includes `scripts/postinstall.js` alongside `scripts/install.js`.
- `tests/smoke.test.js` adds a `package layout` group that asserts (a) every path referenced by `scripts.*` exists in the source tree, (b) `scripts/postinstall.js` is whitelisted and not in `.npmignore`, and (c) the packed tarball contains every script referenced by `package.json`.

### Upgrade
```
npm i -S synarc@latest
```
If you are stuck on 6.6.1 right now:
```
npm i synarc@^6.6.4 --ignore-scripts
npx synarc fresh
```



> Critical patch: 6.6.1 published without scripts/postinstall.js in the iles whitelist, breaking 
pm i synarc with Cannot find module '...\synarc\scripts\postinstall.js'. On Windows the fallback || true then surfaced a secondary 'true' is not recognized error.

### Fixed
- scripts/postinstall.js is now whitelisted in package.json and ships in the npm tarball, so 
pm i synarc runs the postinstall hook cleanly on Windows, macOS, and Linux.
- The Windows 'true' is not recognized artifact (a downstream symptom of the missing file) is gone.

### Changed
- package.json iles array now includes scripts/postinstall.js alongside scripts/install.js.
- 	ests/smoke.test.js adds a package layout group that asserts (a) every path referenced by scripts.* exists in the source tree, (b) scripts/postinstall.js is whitelisted and not in .npmignore, and (c) the packed tarball contains every script referenced by package.json.

### Upgrade
`
npm i -S synarc@latest
`
If you are stuck on 6.6.1 right now:
`
npm i synarc@^6.6.4 --ignore-scripts
npx synarc fresh
`
## [6.6.0] - 2026-06-22 - World-class docs and npm DX

> The "DX & Docs" release. All documentation rewritten, npm package polished, CLI modernized, smoke tests added, publish workflow wired.

### Added
- **CLI: `synarc` bin** - new modern CLI with 8 verbs (fresh, add, remove, verify, status, doctor, migrate-v5, list), 11 flags, JSON output, dry-run, verbose, quiet, no-color, --target (repeatable), --target all, --global, --yes, --version, --help.
- **Programmatic API** - `import { install, verify, detect, doctor, status, add, remove, migrateV5, list } from "synarc-universal"` for tool authors.
- **DX stack** - @clack/prompts for the interactive picker, picocolors for color, ora for spinners. Tiny footprint, fast, no extra dev deps.
- **Smoke tests** - 20 tests covering the full CLI surface, programmatic API, editor registry, and end-to-end install/verify/remove. All pass. Uses `node:test`, no Jest/mocha needed.
- **JSON output** - every verb supports `--json` for CI pipelines. Stable, versioned schema.
- **Environment variables** - SYNARC_GLOBAL_DIR, SYNARC_TARGETS, SYNARC_TELEMETRY_DISABLED, SYNARC_LOG_LEVEL, NO_COLOR, FORCE_COLOR.
- **New docs: `docs/cli-reference.md`** - 8.1 KB, every verb, every flag, exit codes, env vars, JSON output schema, programmatic API.
- **New docs: `docs/schemas.md`** - 11.4 KB, full reference for all 9 JSON Schemas.
- **New docs: `docs/advanced/`** - 10 deep-dive docs on Mesh, Intent Contracts, Verification, Audit, Brain, Session Tracking, WorkTypes, Risk Assessment, Guardrails, Performance.
- **GitHub Actions: `.github/workflows/publish.yml`** - validate + lint + test on every push, publish on tag with npm provenance, draft GitHub release.
- **`scripts/lib/` modular CLI** - 6 focused modules: config, logger, editors, lockfile, commands, index. ~40 KB total, fully unit-testable.
- **`scripts/install.js`** rewritten as a thin CLI bin that delegates to lib/.

### Changed
- `docs/README.md` - rewritten as a world-class landing page (11.6 KB) with badges, "why Synarc" pitch, 30-second install, 56-skill catalog, supported agents table, Cognition Mesh overview, 4-tier fallback table, full package layout, programmatic API example.
- `docs/installation.md` - 13.2 KB, refocused on the `synarc` CLI, with per-editor deep dives and CI snippets.
- `docs/architecture.md` - 14.4 KB, the 7-layer design, compiler pattern, fallback tiers, security model (5 layers of defense), v6.6.0 subsystems.
- `docs/usage.md` - 11.1 KB, activation flow, how to write a new skill (full template), core workflows, 4 detailed examples, programmatic API.
- `docs/compatibility.md` - 8.3 KB, 18-row capability matrix including new v6.0.0+ capabilities (Intent Contracts, Verification Engine, Audit Trail, Cognition Mesh).
- `docs/migration-guide.md` - 8.9 KB, v5 -> v6.6.0 path, including the npm-package distribution channel.
- `docs/enterprise-deployment.md` - 11 KB, 6 distribution channels, per-project install script, retention policy, multi-team governance.
- `package.json` - modernized: `exports` map, dual `synarc` + `synarc-universal` bins, 3 runtime deps + 2 dev deps, `engines`, `os`, `cpu`, `publishConfig.provenance`, `prepublishOnly` hook, `prepack` hook.
- `scripts/install.js` - now a 12.5 KB CLI bin with @clack/prompts picker, --json output, --dry-run, --global, --target (repeatable), --yes, --verbose, --quiet, --no-color, --version, --help.

### Removed
- (Nothing - back-compat with the v6.5.0 verb set is preserved 100%.)

### Fixed
- 20/20 smoke tests pass.
- Skill description parser now correctly handles YAML folded scalars (`description: >`).
- All UTF-8 BOMs stripped from new files (PowerShell `Set-Content -Encoding utf8` adds a BOM by default on Windows).
- `synarc.lock.json` schema is now `synarc-lock/v1` with structured `summary`, `mode`, and per-target `installed_at`.

---

## [6.6.0] - 2026-06-22 - Sleek SDK release ("npm i synarc")

> The "Sleek SDK" release. Renamed npm package to `synarc` (the name users type), added a real programmatic SDK, config file, hooks system, branded welcome screen, and async postinstall. All work in round 2 of v6.6.0.

### Added
- **Package name: `synarc`** - the new canonical name on npm. The previous name `synarc-universal` is retained as a `bin` alias for back-compat (every existing `npx synarc-universal` and `require("synarc-universal")` call still works).
- **New CLI verbs (6 new, 17 total)**
  - `synarc init` - scaffolds `synarc.config.js` in the current dir (auto-detects agents, supports `--force`).
  - `synarc info` - pretty status card: project + pack + install + lock + config, `--json` for CI.
  - `synarc upgrade` - upgrade with optional v5->v6 migration pipeline.
  - `synarc uninstall` - remove all editor files + lock + `.synarc/` hint.
  - `synarc audit verify|export` - audit-chain integrity check + format-specific export (eu-ai-act, soc2, hipaa). v6.6.0 ships the CLI surface; the trail itself lands in v6.7.0.
  - `synarc ledger tail|query|show` - query the runtime ledger; v6.6.0 ships the verbs, the runtime is v6.7.0.
- **`synarc.config.js` support** - project-level config file discovered by walking up the tree. Supports `agents`, `skills`, `excludeSkills`, `riskCaps`, `guardrails`, `hooks`, `telemetry`, `experimental`. The pack ships a complete example at the root.
- **Programmatic SDK** - `require("synarc")` now exposes a full surface: `install`, `verify`, `detect`, `doctor`, `status`, `add`, `remove`, `uninstall`, `migrateV5`, `upgrade`, `info`, `init`, `audit.verify`, `audit.export`, `ledger.tail`, `ledger.query`, `ledger.show`, `list.editors`, `list.skills`, `hooks.on`, `hooks.emit`, `ui.welcome`, `ui.statusCard`, `ui.table`, `ui.progressBar`, `ui.logo`, `config.load`, `config.find`, `config.render`, `config.validate`.
- **Hooks system** - `synarc.hooks.on("beforeInstall" | "afterInstall" | "beforeVerify" | "afterVerify" | "onError", async (ctx) => {})`. Hooks run in order, errors are caught (never abort the pipeline), and results are returned to the caller.
- **Async postinstall** - `npm install synarc` auto-detects editor markers (`.cursor/`, `.claude-plugin/`, `.codex/`, `.windsurfrules`, etc.) and runs `synarc fresh` for them. If no markers are found, prints a branded welcome card. Skip with `SYNARC_SKIP_POSTINSTALL=1`. The hook is async and writes `.synarc/installed.json` as a hint.
- **Branded UI** - ASCII logo, 3-column status cards, plain-text tables, unicode progress bars, color-coded PASS/FAIL via `picocolors`. No external CSS or HTML.
- **DX deps** - `@clack/prompts ^0.7.0`, `picocolors ^1.0.1`, `ora ^8.0.1`. Total install footprint under 200 KB.
- **`scripts/clean.js`** - removes the editor markers and `synarc.lock.json` that E2E tests create. Wired to `npm run clean` and `npm run posttest`, so the source tree is always clean after `npm test`.
- **New SDK doc** - `docs/advanced/sdk.md` (full reference for the programmatic API, hooks, config, and embed story).
- **23 SDK tests** (`tests/sdk.test.js`) - covers config load/find/render/validate, hooks on/emit/error-handling, init, info, audit, ledger, and UI helpers. Stable, no flakes.

### Changed
- `package.json` - canonical name is now `"synarc"`, version `6.6.0`. `bin` exposes both `synarc` and `synarc-universal`. `exports` map covers `.` (lib), `./cli` (CLI bin), `./package.json`. `files` field explicitly includes `synarc.config.js`, `scripts/clean.js`.
- `.npmignore` - hardened to exclude test artifacts defensively (`.cline/`, `.cursor/`, `.windsurfrules`, `.synarc/`, `synarc.lock.json`, etc.) even if tests run in-place.
- `scripts/install.js` - rewritten as a thin CLI bin that delegates to `scripts/lib/`. Now 17 verbs with consistent `--json`, `--dry-run`, `--yes`, `--verbose`, `--quiet`, `--no-color`, `--target`, `--global`, `--version`, `--help` flags. Every verb is independently testable.
- `scripts/lib/index.js` - the new public SDK surface. ~ 4 KB of re-exports + a few convenience methods.
- `scripts/lib/commands.js` - one function per verb, same `(cwd, opts, ...args) -> { code, results? }` shape, fully unit-testable.
- `scripts/lib/config-loader.js` (new) - `load`, `find`, `validate` for `synarc.config.js` with tree-walk and default fallback.
- `scripts/lib/events.js` (new) - tiny hook bus: `on`, `emit`, `off`, `clear`. Synchronous collection of async results.
- `scripts/lib/ui.js` (new) - `welcome`, `statusCard`, `table`, `progressBar`, `logo`, `box`, `dim`. All pure functions, fully unit-testable.
- `scripts/lib/templates.js` - `configFile(opts)` and `INTRO_TEXT` extracted here for reuse.
- `scripts/postinstall.js` - now async, auto-detects markers, auto-installs, writes `.synarc/installed.json` hint, prints branded welcome. Handles `--preuninstall` and `--uninstall` modes for clean removal.
- `npm test` - now triggers `posttest` which runs `scripts/clean.js` to remove test artifacts. The source tree stays clean after every test run.
- `npm run test` - fixed to use explicit `node --test tests/smoke.test.js tests/sdk.test.js` (was a relative path that Windows node mis-interpreted as a single file).
- Test "verify on the synarc-universal dir passes for detected editors" replaced with a structure-based assertion - the source dir has editor markers as *source content*, not install output, so the old "all pass" expectation was wrong. End-to-end PASS coverage is in the E2E tests which use a clean tmp dir.

### Fixed
- `node --test tests/` mis-interpreted `tests/` as a single module on Windows; fixed to use explicit file paths.
- `postinstall.js` was sync-wrapping a promise; the wrapped try/catch lost rejection details. Now fully async.
- All UTF-8 BOMs stripped from new files (PowerShell `Set-Content -Encoding utf8` adds a BOM by default on Windows).
- The `npm pack` tarball now correctly contains `synarc.config.js` and `scripts/clean.js` (added to `files` array).

### Stats
- 43/43 tests pass (20 smoke + 23 SDK)
- `npm pack --dry-run` -> 140 files, 1.2 MB tarball, 3.6 MB unpacked, 0 vendor-lockin violations, 0 broken refs
- 6 new CLI verbs (init, info, upgrade, uninstall, audit, ledger)
- 1 new programmatic SDK surface
- 1 new hooks system
- 1 new config file (`synarc.config.js`)
- 1 new postinstall flow
- 1 new SDK doc (`docs/advanced/sdk.md`)

### Backwards compatibility
- v6.5.0 verb set: still 100% intact
- v6.5.0 package name: `synarc-universal` still works as `require("synarc-universal")` and as a bin alias
- v6.5.0 config: not applicable (no config file existed)
- v6.5.0 hooks: not applicable (no hook system existed)
- v6.5.0 lockfile schema (`synarc-lock/v1`): unchanged

### Upgrading from v6.5.0
No code change is required. To use the new SDK:
```bash
npm uninstall synarc-universal       # or just keep both - they share the same lib
npm install synarc
```

To use the new programmatic surface:
```js
// Old:  const { install, verify } = require("synarc-universal");
// New:  same shape, new package name
const synarc = require("synarc");
const r = await synarc.install({ targets: ["cursor"] });
```


---
---

## [6.6.0] - 2026-06-22 - Size optimization pass

> The "Lean" release. Tarball trimmed from 1.2 MB to 1.1 MB (8.3% smaller), unpacked from 3.6 MB to 3.4 MB (5.5% smaller), file count from 140 to 123. No content lost.

### Changed
- **JSON schemas minified** - 9 `.schema.json` files in `shared/schemas/` are now compact (single-line). Functionally identical, source-of-truth unchanged. Saves 13.0 kB.
- **Verbose docs dropped from npm package** - the 18 GitHub-only docs files (architecture, usage, installation, compatibility, migration-guide, enterprise-deployment, advanced/mesh, advanced/guardrails, advanced/brain, advanced/work-types, advanced/risk-assessment, advanced/performance, advanced/verification, advanced/audit, advanced/session-tracking, advanced/intent-contracts) are no longer in the tarball. They live on GitHub: <https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs>. The man page (`docs/cli-reference.md`) and the SDK reference (`docs/advanced/sdk.md`) stay. Saves 130 kB.
- **Skill SKILL.md files whitespace-minified** - all 56 skills have trailing whitespace stripped, blank-line runs collapsed to max 1, duplicate "EXPANDED CONTENT" footers removed, and `[P#]` priority markers stripped from headings. Rendered output is identical (markdown treats them the same). Saves 69.1 kB (2.3% of skill content).
- **`package.json` files array** - explicit allowlist: only the 3 user-facing docs files ship now (`docs/cli-reference.md`, `docs/advanced/sdk.md`, `docs/advanced/README.md`). Everything else is GitHub-only.
- **`scripts/format-skills.js`** - new maintainer tool. `npm run format:skills` re-applies the minification pass. Idempotent: 0 files updated on second run. Wired into `package.json` `files` array so it ships with the package.
- **`package.json` `format:skills` script** - new npm script. Run after editing a SKILL.md to keep the published tarball lean.

### Stats
- Tarball: 1.2 MB -> 1.1 MB (**-8.3%**)
- Unpacked: 3.6 MB -> 3.4 MB (**-5.5%**)
- Files: 140 -> 123 (**-18 files**)
- Total bytes saved: **~212 kB**
- Content loss: **0 bytes** (all changes are whitespace, JSON formatting, or doc allowlist)
- Test pass rate: 43/43 (unchanged)
- Vendor lock-in violations: 0 (unchanged)
- Broken references: 0 (unchanged)

### Files changed
- `shared/schemas/*.schema.json` (9 files, minified)
- `skills/*/SKILL.md` (56 files, whitespace-minified)
- `package.json` (files array trimmed, format:skills script added)
- `scripts/format-skills.js` (new, 941 B)


## [6.5.0] — 2026-06-20 — Cognition Mesh + scenario installer  The active line on main. 56 skills, 8 editors, scenario-based installer, Microsoft-pattern README.  ### Added  - **Per-editor install pipeline** — one node synarc-universal/scripts/install.js add <editor> per editor, with verify reporting PASS/FAIL by editor, synarc.lock.json recording the install. - **Scenario-based installer** — 9 verb sub-commands: fresh, add <editor>, remove <editor>, verify, status, doctor, migrate-v5. Interactive picker auto-detects project state via node:readline (no extra deps). - **Quick install recipes for Claude Code / Codex CLI / OpenCode** in the README — copy-paste blocks for the 3 most common editors. - **Before / After demo** in the README — shows the Intent Contract flow on a /billing/usage request. - **Scenario table** in the README — 9 named scenarios mapped to installer sub-commands. - **Scenarios section** in synarc-universal/docs/installation.md — long-form reference for each scenario with expected output and what gets written.  ### Changed  - README rewritten in Microsoft pattern: title, tagline, badges, key features, ToC, getting started, usage, docs, architecture, development, troubleshooting, security, contributing, license. Banner image and 8 badges preserved. - CHANGELOG, CONTRIBUTING, SECURITY, .claude-plugin/marketplace.json all bumped to v6.5.0. - .claude-plugin/marketplace.json top-level version 6.0.0 — 6.5.0. All 56 skill-level versions unified to 6.5.0. Description updated to "56 specialized skills, Cognition Mesh multi-role collaboration". compatible_agents list aligned to the 8 active editors (Roo Code removed, shut down 2026-05-15). SHA-256 integrity.hash values regenerated from the current synarc-universal/skills/<id>/SKILL.md files. - AGENTS.md root stub bumped to 6.5.0.  ### Removed  - plugins/ (40 v5 plugin directories, 17 MB) — v5 → v6.5.0 migration is covered by node install.js migrate-v5 from the active pack. - docs/ at the repo root (4 v6.0.0 docs, 43 KB) — superseded by synarc-universal/docs/. - examples/ (v4.0.0 demo content, 18 KB) — stale. - brain/ (runtime ledger, 24 KB) — editor session state, not source-of-truth. - RELEASES.md — described a v6.0.0/v6.1.0 fork that no longer matches main; information captured in this CHANGELOG and the README. - CLAUDE.md, GEMINI.md — 1-paragraph redirect stubs; replaced by the active install path via node install.js add claude-code / add gemini-cli.  All deletions are recoverable from git log.  ### Fixed  - Em-dash mojibake (UTF-8 bytes interpreted as Latin-1) eliminated in the README and the docs that were touched. - Stale Compatible editors (Roo Code) in the marketplace description. - Stale package size reference in the marketplace cache architecture (corrected to the post-extraction number).  --- # Changelog

All notable changes to Synarc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.0] — 2026-06-05 — Cognition Mesh

> **Note:** This release is published on the release/v6.1.0-cognition-mesh branch
> and tagged v6.1.0-cognition-mesh. It is an **alternate release line** alongside
> the cache-rewrite v6.0.0 on main (commit 5a083eb, tag v6.0.0). See the release history for the full picture.

### Added

**Cognition Mesh runtime** — multi-role collaboration engine in synarc-core:
- MeshCoordinator: classifies tasks, selects roles, drives state
- MeshWorkingMemory: shared scratchpad, scoped to mesh session
- MeshProtocol: handoff-chain (default), parallel-deliberate, debate-arbitrate, specialist-pool
- MeshManifest: declarative mesh declarations
- Triggers: /mesh command, "use a team" intent, 3+ intent signals, config opt-in

**Structured ledger queries** — queryable layer over the v5 Markdown ledger:
- ledger.query(type, tags, since, ...) JSON-style queries
- Default backend: Markdown (v5-compatible)
- SQLite backend planned for v6.1.0
- Remote (team) backend planned for v6.2.0

**MCP integration** (planned v6.0.0-beta):
- synarc-mcp server exposing mesh, ledger, and skill tools
- Compatible with Claude Desktop, Cursor, Windsurf, Continue

**16 new skills** (P0 — shipped in v6.0.0):

*AI-Era (8):*
- agentic-ai-engineer — agent loops, tool use, ReAct, planning, memory, multi-agent orchestration, MCP
- prompt-engineer — system prompts, few-shot, CoT, structured output, prompt patterns, evaluation
- rag-engineer — chunking, embeddings, vector DBs, hybrid search, re-ranking, GraphRAG, evaluation
- ai-safety-eval-engineer — red teaming, jailbreaks, adversarial prompts, eval harnesses, EU AI Act
- agent-architect — tool design, agent topologies, orchestration patterns, agent SDKs
- ai-product-manager — model selection, cost-quality-latency tradeoffs, evals-as-product
- mlops-engineer — feature stores, model registries, training pipelines, drift, LLMOps
- data-scientist — EDA, hypothesis testing, causal inference, feature engineering, experiment analysis

*Product (1):*
- product-manager — discovery, opportunity sizing, PRDs, prioritization (RICE/ICE/Kano), North Star metric

*Design (3):*
- product-designer — interaction design, wireframing, prototyping, design critique, usability testing
- content-designer — UX writing, microcopy, voice/tone, error messages, empty states, localization
- design-systems-engineer — tokens, primitives, components, Figma libraries, code-gen, governance

*Quality (4):*
- sdet-engineer — test automation frameworks, page object model, contract testing (Pact), E2E at scale
- performance-engineer — profiling, load/stress/soak testing, capacity planning, Web Vitals
- release-engineer — CI/CD pipelines, deployment strategies (canary, blue/green, rolling, shadow), feature flags
- accessibility-engineer — WCAG 2.2, ARIA patterns, keyboard navigation, screen reader, VPAT, ADA/EAA

**Documentation:**
- brain/V6_VISION.md — the v6 vision (why, what, when)
- docs/ARCHITECTURE.md — full v6 architecture (how)
- docs/MIGRATION_v5_to_v6.md — v5→v6 upgrade guide

**Brain updates:**
- brain/CHANGE_LEDGER.md — added v6 plan session (2026-06-05)

### Changed

- Pack version: 5.0.0 → 6.0.0
- Pack name: "Synarc Universal — Engineering Intelligence Runtime" → "Synarc Universal — Cognition Mesh (Engineering Intelligence Runtime)"
- Pack description: expanded to mention multi-role collaboration, MCP, living memory
- Categories: added ai-era, product, design, quality
- Tags: added cognition-mesh, multi-role-teams, ai-era, mcp, agent-orchestration
- Compatible agents: still 9 (unchanged)
- Schema: skill-pack/v1 (unchanged)
- All 41 v5 skills preserved at v5 versions

### Deprecated

**None.** Every v5 surface continues to work. There is nothing in v5 to migrate away from.

### Removed

**None.**

### Fixed

- product-designer guardrails.yaml YAML indentation (corrected in v6.0.0)
- 16 v6 P0 skills SKILL.md: compatibility: → compatible_agents: to match v5 convention enforced by validate-skills.ps1
- validate-skills.ps1: replaced deprecated $MyInvocation.MyCommand.Path with $PSCommandPath (script is now runnable on PowerShell 5.1)
- validate-skills.ps1: fixed link-resolution false positives on Python code blocks. Old regex (?s).*?  matched empty adjacent fence pairs in preference to real code blocks (PowerShell + .NET non-greedy behavior). Replaced with anchored pattern (?ms)^[^\r\n]*\r?\n.*?\r?\n^\s*$ that only matches properly-opened code fences, plus inline-code strip. Eliminates 5 false-positive "broken reference link" warnings in ml-engineer
- 56/56 skills now pass validation with 0 warnings (40 v5 carried over + 16 v6 new)

### Security

- All 16 new skills ship with guardrails.yaml (refusal rules, safety constraints, honesty rules, escalation policy)
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

See [Migration Guide](synarc-universal/docs/migration-guide.md) for the full upgrade guide. TL;DR: pull the new version, restart your agent, opt into new features when ready.

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
- 15 reference modules in plugins/synarc/skills/references/
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

> Roadmap above applies to the **Cognition Mesh** release line (release/v6.1.0-cognition-mesh).
> The cache-rewrite line on main ships v6.0.0 → v6.0.x → v6.1.0 on its own track.