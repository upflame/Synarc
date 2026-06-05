# Migrating from Synarc v5 to v6

**Source version:** 5.0.0
**Target version:** 6.0.0
**Last updated:** 2026-06-05

v6.0.0 is an **additive** major release. Every v5 manifest, every v5 skill, every v5 script continues to work. This guide covers what is new, what changed, and how to opt into the new features.


## TL;DR

```diff
- v5.0.0: 41 skills, single-skill activation, Markdown ledger
+ v6.0.0: 57 skills, +mesh activation, Markdown + structured ledger

  Manifest schema:  skill-pack/v1   (unchanged)
  Activation:       intent-based   (unchanged)
  Compatible agents: 9 (unchanged)
  Pack format:      same 4-file structure per skill (unchanged)
```

**You probably do not need to do anything to upgrade.** Pull the new version, restart your agent, and v5 behavior is preserved by default. The new features are opt-in.


## Compatibility Matrix

| v5 surface | v6 status | Action required |
|---|---|---|
| Manifest schema | unchanged | none |
| Skill format | unchanged | none |
| 41 v5 skills | all still present, versions preserved | none |
| Single-skill activation | preserved as default | none |
| Markdown ledger | preserved as default backend | none |
| Activation triggers | preserved + new mesh triggers | none |
| Compatible agents | 9 (same) | none |
| Risk ladder | unchanged | none |
| Quality gates | unchanged | none |
| Negative prompts | unchanged | none |
| Compile-for-runtime.ps1 | unchanged | none |

| v6 new surface | Status | How to opt in |
|---|---|---|
| 16 new P0 skills | shipped, intent-activated | just ask for the topic |
| Cognition Mesh | shipped (alpha), opt-in | `/mesh` or config flag |
| Structured ledger queries | shipped, opt-in | `ledger.query(...)` MCP tool |
| synarc-mcp server | planned v6.0.0-beta | install when available |
| Working memory | shipped (alpha), opt-in | enabled by mesh |
| P1/P2 skills | planned v6.1.0 / v6.2.0 | not yet available |


## Step-by-step Upgrade

### 1. Pull the new version

```bash
# Whatever your normal update flow is, e.g.:
cd synarc
git pull origin v6.0.0
```

Or, if installing fresh:

```bash
# For Cursor / Claude / etc. — re-add the pack
# Pack path is the same
```

### 2. Validate the install

The pack is valid v5 *and* v6. Both manifests are present. Validate:

```bash
# If you use the universal pack
synarc validate ./synarc-universal

# Or run the compile script
./synarc-universal/scripts/compile-for-runtime.ps1
```

Expected: success, no errors. The manifest declares both v5 and v6 skill entries.

### 3. Restart your agent

Restart the agent / IDE so it re-reads the manifest. v6 activation is automatic but the manifest is read on startup.

### 4. (Optional) Enable the mesh

Add to your agent config (Cursor `~/.cursor/config.json`, Claude Desktop `claude_desktop_config.json`, etc.):

```json
{
  "synarc": {
    "version": "6.0.0",
    "mesh": {
      "enabled": true,
      "auto_activate": false
    }
  }
}
```

`auto_activate: false` is the default — the mesh only runs when you ask. Set to `true` to let it auto-trigger on multi-intent tasks.

### 5. (Optional) Try the new skills

Ask for something the new skills cover:

```
"Design a RAG pipeline for our docs site"           → rag-engineer
"Help me write a system prompt for support bot"     → prompt-engineer
"Build a checkout flow"                              → /mesh (9 roles)
"Write a Playwright test for the login page"        → sdet-engineer
"Generate a VPAT for our web app"                    → accessibility-engineer
```


## What is New

### 1 — 16 new skills

| Category | Skills |
|---|---|
| AI-Era (8) | agentic-ai-engineer, prompt-engineer, rag-engineer, ai-safety-eval-engineer, agent-architect, ai-product-manager, mlops-engineer, data-scientist |
| Product (1) | product-manager |
| Design (3) | product-designer, content-designer, design-systems-engineer |
| Quality (4) | sdet-engineer, performance-engineer, release-engineer, accessibility-engineer |

Each is a full skill with SKILL.md, skill.yaml, guardrails.yaml, and CHANGELOG.md. They inherit `synarc-core` and follow the v5 conventions exactly.

### 2 — Cognition Mesh

A new activation pattern where multiple skills collaborate on a single task. Activated by:

- `/mesh` command
- "use a team" / "collaborate" in the task
- 3+ distinct intent signals with confidence >= 0.7
- Configuration: `synarc.mesh.enabled: true`

See `docs/ARCHITECTURE.md` for the full design.

### 3 — Structured Ledger Queries

The v5 Markdown ledger is preserved. v6 adds a structured query layer:

```
ledger.query(type="decision", tags=["release"], since="2026-06-01")
```

The default backend is still Markdown (so v5 tools work). The query layer is opt-in and reads from the same file.

### 4 — Optional MCP Server

Planned for v6.0.0-beta. Will expose the mesh and the ledger to MCP-aware agents.


## What Did NOT Change

- **Manifest schema** is `skill-pack/v1` (unchanged)
- **Skill format** is the same 4-file structure (unchanged)
- **All 41 v5 skills** are present, with their v5 versions
- **Activation triggers** still work as before
- **Risk ladder** is identical
- **Quality gates** are unchanged
- **Negative prompts** are unchanged
- **Compile scripts** work without changes
- **Compatible agents** are the same 9
- **Default behavior** is still single-skill activation


## Deprecations

**None.** v5 surfaces continue to work. There is nothing in v5 to migrate away from.

(We considered renaming `performance-thinker` to `performance-engineer`, but kept `performance-thinker` for backward compatibility. Both are shipped in v6.)


## Common Questions

### Do I have to switch to v6?

No. v5 manifests and v5 skills are still valid in v6. You can stay on v5 patterns indefinitely.

### Will v6 slow my agent down?

The v6 default is the same as v5: single-skill activation. No new code runs unless you opt in. The mesh adds overhead only when activated.

### Can I disable specific new skills?

Yes. The manifest supports `disabled: true` per skill:

```yaml
- id: agentic-ai-engineer
  disabled: true
```

### Can I disable the mesh entirely?

Yes. Don't enable it in config. The mesh is opt-in.

### Is v5.0.0 still supported?

Yes, for security fixes. v5.0.1 and v5.0.2 (planned) will be patch releases. New features go to v6.x.

### How do I report an issue with a new skill?

File an issue in the repo with the skill ID and a reproducible example. The guardrails are strict by design, so feedback on false-positive refusals is especially welcome.


## Rollback

If you must roll back to v5:

```bash
git checkout v5.0.0
```

Or pin the version in your install:

```
# In your pack reference
"version": "5.0.0"
```

v5 will continue to be installable indefinitely.


## See also

- `docs/ARCHITECTURE.md` — full v6 architecture
- `brain/V6_VISION.md` — the v6 vision
- `manifest.yaml` — the v6 manifest
- `CHANGELOG.md` — version-by-version release notes
- `brain/CHANGE_LEDGER.md` — chronological decision log
