# Changelog

All notable changes to the Synarc skill pack are documented here. The pack follows [Semantic Versioning](https://semver.org/).

## [6.0.0] - 2026-06-04 — The Cached Edition

### Breaking changes

- **Frontmatter contract** — `intent_triggers` (array, ≥ 2 elements) and `cache_tier` (enum) are now required. `priority` is required.
- **Removed v5.x fields** — `skill_type`, `activation`, `cache`, `parent`, `compatibility`, `minimumVersion` are no longer valid. The validator fails on these.
- **8-block template** — replaces the v5 12-section structure. Mandatory sections: `## Output format`, `## Gotchas`, `## References`.
- **Vendor-locked names banned** — skill names containing `anthropic`, `claude`, `gpt*`, `gemini` fail the validator.
- **Description voice** — 3rd-person, 40-1024 chars, no banned starters (`I `, `We `, `You `, `Help `, `Assists `, `This skill `, `A/An skill/tool/assistant`).
- **No compile step** — the v5 compile step is removed. The same SKILL.md is read natively by all 9 runtimes.

### Added

- **4-tier prompt-caching architecture** — every skill declares its `cache_tier` (core, domain, reference, context, dynamic). Agents pre-warm the cache once and amortize the cost.
- **`intent_triggers` frontmatter field** — array of concrete trigger phrases; the new activation contract.
- **`cache_tier` frontmatter field** — enum that determines which cache tier the skill occupies.
- **`allowed_tools` frontmatter field** — optional array of generic tool verbs (Read, Write, Edit, Grep, Glob, Bash).
- **`scripts/sync-v6.ps1`** — single source-of-truth generator. Reads SKILL.md frontmatter, writes `skill.yaml`, `manifest.yaml`, and `marketplace.json`. Eliminates drift between SKILL.md and the manifest.
- **`scripts/validate-skills.ps1`** — v6 contract validator with 15+ checks: required fields, banned fields, mojibake, vendor-locked names, 8-block template sections, size caps, reference resolution.
- **`scripts/measure-skills.ps1`** — size, token, and cache-tier measurement. Reports distribution, percentiles, and the v5.x → v6.0.0 reduction.
- **`scripts/check-vendor-lockin.ps1`** — vendor lock-in scanner (banned name tokens, banned body patterns, v5 deprecated fields).
- **`scripts/check-refs.ps1`** — markdown reference link resolver.
- **`shared/standards/style-spec.md`** — 12 writing tricks, banned vocabulary, conformance check.
- **`shared/schemas/skill-manifest.schema.json` v2** — `intent_triggers`, `cache_tier`, `allowed_tools`, banned name/description patterns.

### Performance

- **38× token reduction** — total pack 15,670 KB → 412.9 KB. Each SKILL.md 8-14 KB. Fits in a single cache miss.
- **Largest skill 209× smaller** — sre-engineer 2,870 KB → 8.5 KB; architect 2,850 KB → 9.4 KB; security-engineer 2,670 KB → 10.2 KB; backend-engineer 2,360 KB → 10.6 KB.
- **0 hard-cap violations** — all 40 SKILL.md files under 50 KB.
- **0 warn-cap violations** — all 40 SKILL.md files under 30 KB.
- **100% v6 contract pass** — all 40 SKILL.md files pass the validator (38 clean, 2 with intentional warnings for negative-prompts and engineering-manager citing banned phrases as examples).

### Migration

See [docs/migration-guide.md](synarc-universal/docs/migration-guide.md) for the v4 → v5 → v6 migration path.

Quick migration checklist:
- [ ] Update frontmatter: add `priority`, `intent_triggers`, `cache_tier`; remove `skill_type`, `activation`, `dependencies`
- [ ] Apply the 8-block template: frontmatter + persona + activation + workflow + decision rules + output format + gotchas + references + changelog
- [ ] Apply the 12 writing tricks (see `shared/standards/style-spec.md`)
- [ ] Run `npm run validate` — all 40 skills must pass
- [ ] Run `npm run measure` — confirm size caps
- [ ] Run `npm run sync` — regenerate manifest, skill.yaml, marketplace.json
- [ ] Run `npm run check-vendor-lockin` and `npm run check-refs` — 0 violations
- [ ] Bump version to 6.0.0 in package.json and AGENTS.md

### Skills rewritten (40 of 40)

| Tier | Count | Total KB | Avg KB |
|------|-------|----------|--------|
| core | 6 | 60.7 | 10.1 |
| domain | 34 | 352.2 | 10.4 |
| **Total** | **40** | **412.9** | **10.3** |

Tier 1 (core, critical): `synarc-core`, `negative-prompts`, `cognition-layer`, `schemas`, `change-intelligence`, `coding-agent`.

---

## [5.0.0] - 2026-04-12 — Universal Format

### Added

- Initial universal SKILL.md format
- `compatible_agents` list (9 runtimes)
- `intent-based` activation in prose
- `manifest.yaml` with SHA-256 integrity hashes
- `.claude-plugin/marketplace.json`
- `scripts/validate-skills.ps1`, `scripts/generate-manifest.ps1`, `scripts/test-fallbacks.ps1`

### Notes

- 15.67 MB total pack size (some skills 60+ MB)
- 12-section template
- Compile step for runtime-native formats

---

## [4.x] - Claude Plugin Format (legacy)

Claude-only format with `.claude-plugin/` directories, `parent: synarc` inheritance, `activation: contextual|automatic` blocks. See [docs/migration-guide.md](synarc-universal/docs/migration-guide.md) for migration to v5/v6.
