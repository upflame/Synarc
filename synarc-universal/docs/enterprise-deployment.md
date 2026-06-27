---
title: Enterprise Deployment Guide — Synarc Universal Skill Pack
description: Enterprise-scale deployment guide for Synarc Universal v6.6.4 covering org-wide installation via the per-editor CLI, skill version management, dependency resolution, CI/CD integration, compliance and audit, and multi-team skill distribution.
version: 6.6.4
schema: skill-pack/v1
---

# Enterprise Deployment Guide — Synarc Universal Skill Pack (v6.6.4)

## On this page

- [Org-Scale Installation](#org-scale-installation)
- [Skill Version Management](#skill-version-management)
- [Dependency Resolution for Large Skill Packs](#dependency-resolution-for-large-skill-packs)
- [CI/CD Integration](#cicd-integration)
- [Compliance and Audit Considerations](#compliance-and-audit-considerations)
- [Multi-Team Skill Distribution](#multi-team-skill-distribution)

## Org-Scale Installation

### Distribution channels (v6.6.4)

| Channel | Use case | Pros | Cons |
|---|---|---|---|
| **npm (`synarc-universal`)** | Public + private registries | Fast, version-pinned, provenance-signed, `npx`-friendly | Requires npm registry access |
| **Git submodule** | Projects that need a pinned version | Familiar, free | No provenance, no `--global` |
| **Git subtree** | Projects that need to modify skills | Full control | Merge complexity |
| **Internal npm mirror** | Regulated environments | Audit log, internal sign-off | Mirror maintenance |
| **Container image** | Ephemeral CI/CD | Reproducible, isolated | Image bloat |
| **Air-gapped tarball** | No internet | Offline-capable | Manual updates |

For most organizations, **npm with version pinning** is recommended.

### Centralized Pack Repository

For organizations with multiple teams and projects, maintain a centralized skill pack repository (or, for v6.6.4, a private npm registry):

```text
org-internal/
└── synarc-universal/        # mirror of github.com/upflame-labs/synarc
    ├── AGENTS.md
    ├── manifest.yaml
    ├── skills/
    ├── shared/
    └── docs/
```

Or publish to a private npm registry:

```bash
# In the synarc-universal repo
npm config set registry https://npm.internal.acme.com
npm publish --registry https://npm.internal.acme.com
```

### Per-project install script

```bash
#!/bin/bash
# deploy-synarc.sh — Deploy Synarc v6.6.4 to a project repository

set -euo pipefail
TARGET_DIR="${1:-$PWD}"

# Install Synarc globally (if not already installed)
npm i -g synarc

# Initialize in the target project
cd "$TARGET_DIR"
synarc fresh --target all --yes

# Verify
synarc verify

echo "Synarc Universal v6.6.4 deployed to $TARGET_DIR"
echo "Lock file: $TARGET_DIR/synarc.lock.json"
```

### Git submodule setup (legacy)

> **Note:** The git submodule approach is no longer recommended. Use `npm i -g synarc` instead.

```bash
git submodule add https://github.com/upflame-labs/synarc.git synarc-universal
git submodule update --init --recursive
synarc fresh --yes
```

---

## Skill Version Management

### Semantic Versioning

All skills follow semver (MAJOR.MINOR.PATCH):

| Component | Breaking Change |
|---|---|
| MAJOR | Activation triggers changed, capability removed, guardrails weakened, compatibility dropped |
| MINOR | New capability, new trigger, new reference, improved descriptions |
| PATCH | Typo fix, example fix, clarification |

### Version Pinning

In your project's `package.json`, pin the version:

```json
{
  "devDependencies": {
    "synarc-universal": "6.6.4"
  }
}
```

Or use a version range:

```json
{
  "devDependencies": {
    "synarc-universal": "^6.6.4"
  }
}
```

Skills declare their minimum dependency versions in `skill.yaml`:

```yaml
dependencies:
  synarc-core: ">=6.0.0"
```

### Release Channels

| Channel | Update frequency | Stability | Use case |
|---|---|---|---|
| Stable | Monthly | High | Production deployments |
| Release Candidate | Bi-weekly | Medium | Pre-production validation |
| Nightly | Daily | Low | Internal experimentation |

npm tags: `latest` (stable), `next` (RC), `nightly`.

### Changelog Requirements

Every skill ships with `CHANGELOG.md`. CI fails if a PR modifies a skill's behavior without a CHANGELOG entry.

---

## Dependency Resolution for Large Skill Packs

### Resolution Algorithm

```pseudocode
FUNCTION resolve(manifest, constraints):
  graph = build_graph(manifest)
  IF has_cycle(graph):
    THROW "Circular dependency detected"
  resolved = topological_sort(graph)
  FOR skill IN resolved:
    version = pick_version(skill, constraints[skill])
    IF version is None:
      THROW "No version satisfies constraints for " + skill
  RETURN resolved
```

### Enterprise Lock File

Every project gets a `synarc.lock.json` after install:

```json
{
  "synarc_version": "6.6.4",
  "node_version": "v22.12.0",
  "installed_at": "2026-06-22T10:00:00Z",
  "targets": [
    { "id": "claude-code", "path": ".claude-plugin/plugin.json", "bytes": 1317 },
    { "id": "cursor",      "path": ".cursor/rules/synarc-core.mdc", "bytes": 1429 }
  ],
  "summary": { "pass": 2, "fail": 0, "total": 2 }
}
```

The lock file is the **exact** install state. CI verifies it matches.

---

## CI/CD Integration

### Pre-Commit Validation

```yaml
# .github/workflows/synarc-precommit.yml
name: Synarc pre-commit
on: [pull_request]
jobs:
  precommit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install
      - run: npx synarc-universal@latest verify --json
      - run: npx synarc-universal@latest doctor --json
```

### CI Pipeline Stages

```yaml
# .github/workflows/synarc-ci.yml
name: Synarc CI
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install
      - run: npm run validate
      - run: npm run lint
      - run: npm run test

  verify:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx synarc-universal@latest fresh --target all --yes
      - run: npx synarc-universal@latest verify --json
```

### Validation Conformance Levels

| Level | Checks | Gate |
|---|---|---|
| L1 — Basic | Required fields, banned fields | PR gate |
| L2 — Standard | Schema, references, tiers | CI gate |
| L3 — Strict | Platform lock-in, security scan | Release gate |
| L4 — Enterprise | Manifest signature, OWASP | Production gate |

---

## Compliance and Audit Considerations

### Audit Trail

Every skill change creates an immutable audit trail:

- `CHANGELOG.md` for each skill documents all changes
- `manifest.yaml` integrity hash detects tampering
- Session ledger records all engineering decisions
- Guardrail violations are logged per session

The full audit chain is hash-chained (see [advanced/audit.md](./advanced/audit.md)).

### Regulatory Compliance

| Regulation | Synarc mapping |
|---|---|
| SOC 2 | Immutable session ledger, change tracking |
| GDPR | Privacy engineer skill, PII hard floors |
| PCI-DSS | Payment domain hard floors (CRITICAL minimum) |
| HIPAA | PHI domain hard floors, privacy guardrails |
| SOX | Immutable audit trail, version pinning |
| ISO 27001 | Security guardrails, OWASP mapping |
| EU AI Act | Risk classification, human oversight points, transparency artifacts |

Export the audit trail in the required format:

```bash
synarc audit export --format eu-ai-act --since 90d
synarc audit export --format soc2     --since 1y
synarc audit export --format hipaa    --since 6y
synarc audit export --format iso27001 --since 3y
```

### Compliance Checklist

- [ ] All skills have versioned `CHANGELOG.md`
- [ ] `manifest.yaml` has integrity hash
- [ ] Production deployments use locked versions only
- [ ] Guardrails mapped to OWASP LLM categories
- [ ] Session ledger is immutable and auditable
- [ ] Hard floors cannot be bypassed by user instruction
- [ ] Risk escalation is deterministic and logged
- [ ] All skill modifications go through code review
- [ ] Audit export tested in staging before production

### Retention Policy

| Artifact | Retention | Format |
|---|---|---|
| Session ledger | 90 days | YAML in `brain/` |
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
version: 6.6.4
```

### Centralized Manifest for Orgs

Large organizations should maintain a root manifest that aggregates team-level manifests:

```yaml
# org-manifest.yaml
organization: acme-corp
version: 6.6.4
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

```text
Team creates skill
  -> Team validates (L1+L2)
  -> Team PR to org repo
  -> Org validates (L3+L4)
  -> Org signs manifest
  -> Org publishes to private npm registry
  -> All team projects get updated via `npm update synarc-universal` + `synarc verify`
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
4. Extract to shared network location or publish to internal registry
5. Each project references the shared location via config
6. CI runs validation against local copy

```bash
# On connected system
npm pack synarc-universal
sha256sum synarc-universal-6.6.4.tgz > synarc-universal-6.6.4.tgz.sha256

# On air-gapped system
npm install ./synarc-universal-6.6.4.tgz
sha256sum -c synarc-universal-6.6.4.tgz.sha256
```

---

## See also

- [CLI Reference](./cli-reference.md) — every command and flag
- [Installation Guide](./installation.md) — per-editor deep dive
- [Architecture](./architecture.md) — 7-layer design
- [Compatibility Matrix](./compatibility.md) — capability x runtime
- [Schemas Reference](./schemas.md) — JSON Schemas
- [Advanced Topics](./advanced/) — audit, contracts, verification, guardrails
