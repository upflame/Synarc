---
title: Enterprise Deployment Guide — Synarc Universal Skill Pack
description: Enterprise-scale deployment guide covering org-wide installation, skill version management, dependency resolution for large skill packs, CI/CD integration, compliance and audit considerations, and multi-team skill distribution. Validated for v6.0.0.
version: 6.0.0
schema: skill-pack/v1
---

# Enterprise Deployment Guide — Synarc Universal Skill Pack (v6.0.0)

## What's new in v6.0.0

- **No compile step** — the v5 compile-for-runtime matrix is removed. Same SKILL.md ships to all 9 runtimes.
- **Cache tier as the new dependency model** — `cache_tier: core` declares a pre-warm dependency on a skill. The v5 `dependencies: { synarc-core: ">=5.0.0" }` field is removed.
- **Single source of truth** — `scripts/sync-v6.ps1` regenerates `manifest.yaml`, `skill.yaml`, and `marketplace.json` from SKILL.md frontmatter. The v5 manual `generate-manifest.ps1` is deprecated.
- **Stronger contract enforcement** — `scripts/validate-skills.ps1` runs 15+ checks (frontmatter shape, banned fields, banned names, mojibake, 8-block template, size caps, reference resolution).
- **38× token reduction** — total pack 15.67 MB → 412.9 KB. Each SKILL.md is 8-14 KB; the pack fits in a single cache miss.

---

## Org-Scale Installation

### Centralized Pack Repository

For organizations with multiple teams and projects, maintain a centralized skill pack repository:

```
org-internal/
└── synarc-universal/
    ├── AGENTS.md
    ├── manifest.yaml
    ├── skills/         (40 SKILL.md files, 8-14 KB each)
    ├── shared/         (standards, schemas, workflows, runtime-adapters)
    ├── docs/           (installation, architecture, usage, migration)
    └── scripts/        (sync-v6, validate-skills, measure-skills, check-vendor-lockin, check-refs)
```

### Distribution Methods

| Method | Use Case | Complexity |
|--------|----------|-----------|
| Git submodule | Projects that need a pinned version | Low |
| Git subtree | Projects that need to modify skills | Medium |
| Package manager (internal) | Automated CI/CD integration | High |
| Shared network drive | Air-gapped environments | Low |
| Container image | Ephemeral CI/CD environments | Medium |

### Git Submodule Setup

```bash
git submodule add https://github.com/org/synarc-universal.git .synarc/
git submodule update --init --recursive
ln -s .synarc/AGENTS.md AGENTS.md
```

### Automated Deployment Script

```bash
#!/bin/bash
# deploy-synarc.sh — Deploy Synarc to a project repository

SKILL_PACK_URL=${1:-"https://github.com/org/synarc-universal.git"}
TARGET_DIR=${2:-".synarc"}

# Clone or update the skill pack
if [ -d "$TARGET_DIR" ]; then
  cd "$TARGET_DIR" && git pull && cd ..
else
  git clone "$SKILL_PACK_URL" "$TARGET_DIR"
fi

# Symlink AGENTS.md for compatible agents
ln -sf "$TARGET_DIR/AGENTS.md" AGENTS.md

# Copy Cursor rules if applicable
if [ -d ".cursor" ]; then
  mkdir -p .cursor/rules
  cp "$TARGET_DIR/shared/runtime-adapters/cursor.md" .cursor/rules/synarc-adapter.md 2>/dev/null || true
fi

# Copy Windsurf rules if applicable
if [ ! -f ".windsurfrules" ]; then
  cp "$TARGET_DIR/shared/runtime-adapters/windsurf.md" .windsurfrules 2>/dev/null || true
fi

echo "Synarc Universal deployed to $TARGET_DIR"
```

---

## Skill Version Management

### Semantic Versioning

All skills follow semver (MAJOR.MINOR.PATCH):

| Component | Breaking Change |
|-----------|----------------|
| MAJOR | `intent_triggers` changed in a way that alters activation, `cache_tier` changed, capability removed, 8-block template restructured, frontmatter contract changed |
| MINOR | New `intent_triggers` phrase added, new reference, improved descriptions, additional `allowed_tools` entry |
| PATCH | Typo fix, example fix, gotcha clarification, broken reference fix |

### Version Pinning

In `manifest.yaml`, pin pack versions for production:

```yaml
pack:
  id: synarc-universal
  version: 6.0.0  # Pinned — do not auto-update
```

In v6.0.0 skills declare their pre-warm requirements via `cache_tier`, not via a `dependencies` map:

```yaml
# skills/backend-engineer/skill.yaml
id: backend-engineer
version: 6.0.0
priority: high
cache_tier: domain
intent_triggers:
  - backend service
  - REST API
  - service layer
  - business logic
allowed_tools: [Read, Write, Edit, Grep, Glob, Bash]
```

A `cache_tier: domain` skill implicitly depends on every `cache_tier: core` skill being pre-warm in the session. The validator and sync script enforce this.

### Release Channels

| Channel | Update Frequency | Stability | Use Case |
|---------|-----------------|-----------|----------|
| Stable | Monthly | High | Production deployments |
| Release Candidate | Bi-weekly | Medium | Pre-production validation |
| Nightly | Daily | Low | Development and testing |

### Changelog Requirements

Every skill MUST maintain a `CHANGELOG.md`:

```markdown
# Changelog — backend-engineer

## [2.0.0] — 2026-06-02

### Added
- New activation trigger for GraphQL API design
- Tier 2 external integration for schema validation

### Changed
- Risk floor for public API changes escalated from HIGH to CRITICAL

### Fixed
- Activation false positive on database-related queries
```

---

## Dependency Resolution for Large Skill Packs

### Resolution Algorithm

For organizations maintaining custom skill packs with many interdependent skills:

1. **Graph construction**: Build full dependency graph from all `skill.yaml` files
2. **Cycle detection**: Detect and reject circular dependencies
3. **Version resolution**: Match each dependency against available versions using semver
4. **Conflict detection**: Detect skills required at incompatible versions
5. **Tree production**: Output resolved dependency tree for deployment

### Common Resolutions

| Scenario | Resolution |
|----------|-----------|
| A depends on B v1, C depends on B v2 | Conflict — cannot deploy both |
| A depends on B ^1.0, C depends on B ~1.2 | Compatible — resolve to B 1.2.x |
| A depends on B >=1.0, no version specified | Use latest available B |
| Circular dependency A ↔ B | Reject — break cycle by removing one dependency |

### Enterprise Lock File

For regulated environments, maintain a lock file that pins all transitive dependencies. The v6.0.0 lock file uses `cache_tier` as the dependency declaration:

```yaml
# synarc.lock.yaml
lock_version: 2
generated: "2026-06-04T00:00:00Z"
pack_version: 6.0.0
pack_hash: sha256:2f4b9a675cb2baa60ee3c7662c1369315f2eef4888bb459d3e581c2be7d6e5f5
skills:
  - id: synarc-core
    version: 6.0.0
    cache_tier: core
    hash: sha256:a1b2c3d4...
  - id: negative-prompts
    version: 6.0.0
    cache_tier: core
    hash: sha256:...
  - id: backend-engineer
    version: 6.0.0
    cache_tier: domain
    pre_warm: [synarc-core, negative-prompts, cognition-layer, schemas]
    hash: sha256:e5f6g7h8...
```

The lock file is validated before deployment. Any hash mismatch, version conflict, or `cache_tier` regression blocks deployment.

---

## CI/CD Integration

### Pre-Commit Validation

Add a pre-commit hook to validate skill pack integrity:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: synarc-validate
        name: Synarc Skill Validation
        entry: scripts/validate-skills.sh
        language: script
        files: ^synarc-universal/skills/.*\.(md|yaml)$
```

### CI Pipeline Stages (v6.0.0)

The v5 compile-matrix job is removed — v6.0.0 ships the same SKILL.md to all 9 runtimes with no compile step.

```yaml
# .github/workflows/synarc-ci.yml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: L1 — Basic Validation (v6 frontmatter contract)
        run: |
          pwsh synarc-universal/scripts/validate-skills.ps1

      - name: L2 — Standard Validation (size, refs, tiers)
        run: |
          pwsh synarc-universal/scripts/measure-skills.ps1
          pwsh synarc-universal/scripts/check-refs.ps1

      - name: L3 — Strict Validation (vendor-lock, security)
        run: |
          pwsh synarc-universal/scripts/check-vendor-lockin.ps1

      - name: L4 — Enterprise Validation (sync, manifest signature, OWASP)
        run: |
          pwsh synarc-universal/scripts/sync-v6.ps1
          verify-manifest-signature synarc-universal/manifest.yaml
          owasp-map synarc-universal/skills/**/guardrails.yaml

  test:
    needs: validate
    steps:
      - name: Test fallback tiers
        run: |
          pwsh synarc-universal/scripts/test-fallbacks.ps1
```

### Validation Conformance Levels

| Level | Script | Checks | Gate |
|-------|--------|--------|------|
| L1 — Basic | `validate-skills.ps1` | v6 frontmatter contract, required fields, banned v5 fields, 8-block template sections, size caps | PR gate |
| L2 — Standard | `measure-skills.ps1`, `check-refs.ps1` | Per-skill size, tier distribution, percentiles, cap enforcement, markdown reference resolution | CI gate |
| L3 — Strict | `check-vendor-lockin.ps1` | Banned name tokens (anthropic/claude/gpt*/gemini), banned body patterns, v5 deprecated fields | Release gate |
| L4 — Enterprise | `sync-v6.ps1`, manifest signature, OWASP map | Single-source-of-truth regeneration, manifest hash, OWASP LLM category mapping | Production gate |

---

## Compliance and Audit Considerations

### Audit Trail

Every skill change creates an immutable audit trail:

- `CHANGELOG.md` for each skill documents all changes
- `manifest.yaml` integrity hash detects tampering
- Session ledger records all engineering decisions
- Guardrail violations are logged per session

### Regulatory Compliance

| Regulation | Synarc Mapping |
|-----------|---------------|
| SOC 2 | Immutable session ledger, change tracking |
| GDPR | Privacy engineer skill, PII hard floors |
| PCI-DSS | Payment domain hard floors (CRITICAL minimum) |
| HIPAA | PHI domain hard floors, privacy guardrails |
| SOX | Immutable audit trail, version pinning |
| ISO 27001 | Security guardrails, OWASP mapping |

### Compliance Checklist

- [ ] All skills have versioned CHANGELOG.md
- [ ] manifest.yaml has integrity hash
- [ ] Production deployments use locked versions only
- [ ] Guardrails mapped to OWASP LLM categories
- [ ] Session ledger is immutable and auditable
- [ ] Hard floors cannot be bypassed by user instruction
- [ ] Risk escalation is deterministic and logged
- [ ] All skill modifications go through code review

### Retention Policy

| Artifact | Retention | Format |
|----------|-----------|--------|
| Session ledger | 90 days | YAML in brain/ |
| Risk assessments | 1 year | Structured output |
| Guardrail violations | 2 years | Logged in ledger |
| Deployment manifests | 3 years | Signed YAML |
| Audit logs | 5 years | Immutable store |

---

## Multi-Team Skill Distribution

### Team-Specific Skill Sets

Each team maintains a list of required skills in their project config:

```yaml
# team-skills.yaml
team: payments
required_skills:
  - synarc-core
  - backend-engineer
  - security-engineer
  - database-architect
  - testing-strategy
optional_skills:
  - performance-thinker
  - chaos-engineer
```

### Skill Namespacing

For organizations with custom skills, use namespaced skill IDs:

```yaml
# skills/acme-payments/skill.yaml
id: acme-payments
namespace: acme
version: 1.0.0
```

### Centralized Manifest for Orgs

Large organizations should maintain a root manifest that aggregates team-level manifests:

```yaml
# org-manifest.yaml
organization: acme-corp
version: 1.0.0
team_manifests:
  - team: platform
    manifest: teams/platform/manifest.yaml
  - team: payments
    manifest: teams/payments/manifest.yaml
  - team: data
    manifest: teams/data/manifest.yaml
shared_skills:
  - shared/security-baseline/
  - shared/compliance-controls/
```

### Governance Workflow

```
Team creates skill → Team validates (L1+L2) → Team PR to org repo
  → Org validates (L3+L4) → Org signs manifest → Org deploys
  → All team projects get updated via lock file + CI
```

### Conflict Resolution

When two teams depend on incompatible skill versions:

1. Org-level resolver detects conflict during CI
2. Teams are notified with conflict details
3. Resolver proposes compatible version range
4. Teams approve or negotiate version change
5. Lock file updated with resolved versions
6. All team deployments blocked until resolution

### Air-Gapped Deployment

For environments without internet access:

1. Download skill pack tarball on connected system
2. Verify integrity hash matches signed manifest
3. Transfer tarball to air-gapped system
4. Extract to shared network location
5. Each project references the shared location via config
6. CI runs validation against local copy
