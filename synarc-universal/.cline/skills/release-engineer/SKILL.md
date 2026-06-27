---
name: release-engineer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - sre-engineer: ">=2.0.0"
  - devops-engineer: ">=2.0.0"
  - security-engineer: ">=2.0.0"
title: Release Engineer — CI/CD, Deployment Strategies, Versioning, Release Trains
description: Release engineering reasoning — CI/CD pipeline design, deployment strategies (blue/green, canary, rolling, feature flags), versioning schemes (semver, calver), release trains, artifact management, container registries, GitOps, progressive delivery, rollback procedures, change management, deployment windows, on-call coordination, deployment automation, infrastructure as code for deployments. Distinct from devops-engineer (broader culture/platform) and sre-engineer (reliability) — this is the discipline of getting code to production safely and repeatably. Inherits synarc core.
version: 1.0.0
category: quality
tags:
  - release-engineering
  - cicd
  - deployment
  - blue-green
  - canary
  - rolling
  - feature-flags
  - versioning
  - semver
  - calver
  - gitops
  - progressive-delivery
  - rollback
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# Release Engineer — CI/CD, Deployment Strategies, Versioning, Release Trains

Inherits synarc core. All synarc prohibitions apply.

devops-engineer builds the platform. sre-engineer keeps it running. release-engineer ships code safely: pipelines, deployment strategies, versioning, rollback, change management.

## P2 — VERSIONING

### P2.1 — SemVer

```
SEMVER 2.0.0:
  MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
  e.g., 2.7.3, 2.7.3-rc.1, 2.7.3+build.456

RULES:
  MAJOR:  incompatible API changes
  MINOR:  new functionality, backward compatible
  PATCH:  bug fixes, backward compatible
  PRERELEASE: alpha, beta, rc (unstable)
  BUILD: build metadata (ignored in precedence)

PRECEDENCE (lowest to highest):
  1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2
  < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0

GOOD FOR:  libraries, APIs, anything with a public contract.
BAD FOR:   apps with no public API contract (use calver).
```

### P2.2 — CalVer

```
CALVER:
  YYYY.MM.PATCH        e.g., 2026.06.0
  YYYY.MM.DD           e.g., 2026.06.05
  YY.MM.PATCH          e.g., 26.6.0
  YYYY.MINOR.MICRO     e.g., 2026.6.5

GOOD FOR:  apps, internal tools, anything without external API contract
ADVANTAGE:  obvious from version, easy to communicate, decouples from features

WHEN:  use calver when you don't need to promise API stability
       use semver when consumers depend on stability
```

### P2.3 — Choosing a Scheme

```
LIBRARY / SDK / API    →  semver (consumers depend on it)
APP / SERVICE          →  calver (no public contract)
CLI TOOL               →  semver (commands are public)
DATA / ML MODEL        →  date-based (model card with date)
INFRASTRUCTURE         →  semver OR git hash
DOCS                   →  date-based
```

## P3 — CI/CD PIPELINE

### P3.1 — Pipeline Stages

```
PIPELINE:
  1. TRIGGER       push, PR, tag, schedule, webhook
  2. SETUP         checkout, install, cache restore
  3. STATIC        lint, format, type check, secret scan
  4. UNIT          unit tests
  5. BUILD         compile, package, image
  6. INTEGRATION   integration tests (with deps)
  7. SECURITY      SAST, SCA, IaC scan, image scan
  8. PUBLISH       push to registry
  9. DEPLOY        to staging
  10. ACCEPTANCE   smoke, e2e, contract
  11. DEPLOY PROD  with strategy (canary, blue/green)
  12. VERIFY       SLO check, smoke in prod
  13. NOTIFY       slack, email, ticket update

GATING:
  Each stage gates the next.
  Failed stage = no later stages.
  Speed up the first 4: fast feedback.
```

### P3.2 — Pipeline Best Practices

```
1. FAST FEEDBACK      most checks under 5 min
2. DETERMINISTIC       same input → same output
3. CACHED              restore deps, build cache
4. PARALLEL            run independent checks in parallel
5. IDEMPOTENT          re-running a stage produces same result
6. ARTIFACT-PROMOTED    build once, promote through envs
7. INFRA AS CODE       pipeline is versioned
8. SECRETS EXTERNAL    never in pipeline files
9. SCAN EVERYTHING     SBOM, SAST, secrets, IaC
10. SMALL CHANGES      easy to revert, easy to review

ANTI-PATTERNS:
  - "Snowflake" servers with custom state
  - Long pipelines (>20 min for fast feedback)
  - "Works on my machine"
  - Skipping stages "just this once"
  - Manual deployment steps
```

### P3.3 — Tools

```
CI SERVERS:        GitHub Actions, GitLab CI, CircleCI, Buildkite, Jenkins
PIPELINE-AS-CODE:  Tekton, Argo Workflows, Dagger
ORCHESTRATION:     Spinnaker, Argo CD (GitOps)
ARTIFACTS:         GitHub Packages, GitLab Registry, Artifactory, Nexus
IMAGES:            Docker Hub, ECR, GCR, ACR, GHCR, Quay
SIGNING:           Sigstore cosign, Notary v2
SBOM:              SPDX, CycloneDX
POLICY:            OPA, Conftest, Kyverno
```

## P4 — DEPLOYMENT STRATEGIES

### P4.1 — Recreate (Big Bang)

```
STOP old version.
START new version.

PROS:    simple, clean state
CONS:    downtime, no rollback during deploy
USE:     dev/test, low-traffic, or when stateful migration is impossible
```

### P4.2 — Rolling

```
REPLACE instances one at a time (or N at a time).
Old and new coexist.

PROS:    no downtime, simple
CONS:    mixed versions during deploy, rollback is slow
USE:     stateless services
```

### P4.3 — Blue/Green

```
DEPLOY new (green) alongside old (blue).
TEST green.
SWITCH traffic (router / load balancer).
KEEP blue for fast rollback.

PROS:    instant rollback, no mixed versions
CONS:    2x resources, database migration is tricky
USE:     critical services, schema changes
```

### P4.4 — Canary

```
DEPLOY new to small % of traffic (1-5%).
WATCH metrics (errors, latency, business).
GRADUALLY shift traffic: 1% → 10% → 50% → 100%.
AUTO-ROLLBACK on SLO violation.

PROS:    safest, real traffic validates
CONS:    complex, need good observability
USE:     high-stakes services, ML models, risky changes
```

### P4.5 — A/B Testing

```
ROUTE different versions to different USER SEGMENTS.
MEASURE business metric (conversion, retention).

PROS:    product experiments
CONS:    statistical rigor required, slower decisions
USE:     feature validation, product experiments
```

### P4.6 — Shadow

```
MIRROR production traffic to new version.
NEW version processes but does NOT return response.
COMPARE outputs.

PROS:    zero risk to users
CONS:    double the load, comparison is tricky
USE:     ML model deployment, refactor validation
```

### P4.7 — Strategy Selection

```
CHOOSE BY RISK:
  LOW RISK:    rolling, recreate (dev)
  MEDIUM:      blue/green
  HIGH:        canary with auto-rollback
  CRITICAL:    canary + shadow + manual approval

CHOOSE BY NEED:
  SPEED:       recreate, blue/green
  SAFETY:      canary, shadow
  EXPERIMENT:  A/B
  COST:        rolling
```

## P5 — FEATURE FLAGS

### P5.1 — Why Feature Flags

```
DECOUPLE deploy from release.
- Deploy code with feature OFF
- Enable for internal users
- Enable for % of users
- Enable for paying users
- Roll out / roll back instantly
- Test in production

USE FOR:
  - Gradual rollouts
  - A/B tests
  - Beta programs
  - Kill switches
  - Per-tenant config
  - Ops toggles
```

### P5.2 — Flag Categories

```
RELEASE:     short-lived, controls rollout of new feature
              clean up after full rollout
              tag: ROLLOUT

EXPERIMENT:  A/B test, tracked with experiment ID
              drives product decision
              tag: EXPERIMENT

OPS:         on/off for ops reasons (maintenance, kill switch)
              long-lived
              tag: OPS

PERMISSION:  beta program, premium features
              based on user attributes
              tag: PERMISSION
```

### P5.3 — Flag Best Practices

```
1. NAME WELL         "new-checkout-flow", not "flag-1"
2. OWNER             every flag has an owner
3. EXPIRATION        release flags have TTL (90 days max)
4. AUDIT             who changed it, when
5. SERVER-SIDE EVAL  client-side flags are easy to bypass
6. DEFAULT OFF       new flags start off
7. REMOVE FLAG       don't ship dead flags in codebase
8. FLAG IN OBSERVABILITY
                     log flag state per request for debugging
9. CLEANUP PROCESS   schedule cleanup in PR
10. DARK LAUNCHES    enable for internal users first
```

## P6 — RELEASE TRAINS

### P6.1 — What Is a Train

```
FIXED SCHEDULE:   release on a known cadence (weekly, biweekly, monthly)
SEMI-TRAIN:       milestone-based but with a soft date
FEATURE FREEZE:   code complete by date, polish and ship

ADVANTAGES:
  - Predictable for users
  - Coherent releases (a feature is ready when train leaves)
  - Reduces "just one more thing" scope creep
  - Clear go/no-go decisions
```

### P6.2 — Train Cadence

```
WEEKLY:         SaaS, fast iteration, low blast radius
BIWEEKLY:       most common, balances agility and stability
MONTHLY:        enterprise, complex, more users
QUARTERLY:      major versions, big features

FACTORS:
  - Change volume
  - Risk tolerance
  - Customer expectations
  - Team size
  - QA capacity
```

### P6.3 — Release Process

```
T-N DAYS:     code complete, freeze
T-N DAYS-1:   release candidate tagged
T-1 DAY:      soak, smoke, canary
T-0:          release
T+1 DAY:      retrospective, cleanup

ARTIFACTS:
  - Release notes (user-facing)
  - Changelog (technical)
  - Runbook (ops)
  - Rollback plan
  - On-call schedule updated

OWNERS:
  - Release captain
  - Engineering lead
  - Product owner
  - SRE on call
```

## P7 — ROLLBACK

### P7.1 — Rollback Strategies

```
FORWARD FIX:     deploy a fix instead of rolling back
                 (preferred if you know the cause)

VERSION ROLLBACK: revert to previous artifact
                 (blue/green: instant)

TRAFFIC ROLLBACK: route 100% to old version
                 (canary: instant)

FEATURE FLAG:    disable new feature
                 (instant, surgical)

DATA ROLLBACK:   restore database backup
                 (expensive, last resort)
                 (avoid by making schema changes backward compatible)
```

### P7.2 — Rollback Readiness

```
ALWAYS BE READY:
  - Previous version kept for N days
  - Migration is reversible (or forward-compatible)
  - Rollback is tested in staging
  - Rollback is automated where possible
  - Rollback is one command (or one click)
  - On-call knows how to rollback
  - Communication template ready

BACKWARD-COMPATIBLE MIGRATIONS:
  - 2-step: add new column, write to both
  - 2-step: read from new, write to both
  - 2-step: stop writing to old
  - 2-step: drop old column
  - No schema change requires coordinated deploy + migration
```

## P8 — CHANGE MANAGEMENT

### P8.1 — Change Categories

```
STANDARD:      low risk, pre-approved, automated
               (e.g., routine deploys, dependency updates)
NORMAL:        medium risk, requires review and approval
               (e.g., schema changes, new dependencies)
EMERGENCY:     high risk, requires hotfix process
               (e.g., security patch, prod-down)
               post-incident review required

CHANGE ADVISORY BOARD (CAB):
  - Reviews normal/emergency changes
  - Schedule: weekly for normal, ad-hoc for emergency
  - Members: eng lead, SRE, security, product
```

### P8.2 — Deployment Windows

```
USE WINDOWS WHEN:
  - Customer-facing changes need coordination
  - On-call coverage is poor outside hours
  - Third-party dependencies have windows

DO NOT USE WINDOWS WHEN:
  - Continuous delivery is possible
  - Canary catches problems
  - "Hero culture" of weekend deploys

IF YOU MUST HAVE WINDOWS:
  - Use them for "high-risk" only
  - Low-risk deploys go anytime
  - Document the window
  - Rotate weekend/holiday on-call
```

## P9 — GITOPS

### P9.1 — GitOps Principles

```
1. DECLARE desired state in Git
2. VERSIONED: Git is the source of truth
3. APPLIED automatically by operators (Argo CD, Flux)
4. PULLED (agent-based), not pushed
5. AUDITED by Git history
6. ROLLED BACK via Git revert

ADVANTAGES:
  - Same workflow for app and infra
  - Easy to review
  - Easy to rollback
  - Reproducible
  - Self-service for developers

TOOLS:
  - Argo CD (CNCF)
  - Flux (CNCF)
  - Jenkins X
  - Spinnaker
```

### P9.2 — Progressive Delivery with GitOps

```
GITOPS + FLAGGED CANARY:
  1. PR merges code with flag off
  2. Argo CD deploys new version (flag off, no traffic)
  3. Tests pass
  4. Manually (or auto) enable flag for 1%
  5. Watch metrics
  6. Increase: 1 → 10 → 50 → 100
  7. Once at 100% for a week, remove flag

  Decouples deploy from release.
  GitOps for state, flags for traffic.
```

## P10 — OUTPUT FORMATS

### P10.1 — Release Plan

```
RELEASE:                [version or name]
TARGET DATE:            [date]
DEPLOYMENT WINDOW:      [start, end, time zone]
RISK LEVEL:             [low / medium / high]
DEPLOYMENT STRATEGY:    [rolling / blue-green / canary]

SCOPE:
  - [feature/fix 1]
  - [feature/fix 2]

PREREQUISITES:
  - [ ] All tests pass
  - [ ] Security scans clean
  - [ ] DB migration tested
  - [ ] Rollback plan documented
  - [ ] Runbook updated
  - [ ] On-call confirmed
  - [ ] Stakeholders notified

DEPLOYMENT STEPS:
  1. [Step 1: e.g., deploy to canary at 1%]
  2. [Step 2: e.g., monitor for 30 min]
  3. [Step 3: e.g., increase to 10%]
  ...

VERIFICATION:
  - [ ] Health check green
  - [ ] Error rate normal
  - [ ] p99 latency normal
  - [ ] Business metrics normal

ROLLBACK TRIGGER:
  - [error rate > X%, latency > Y ms, SLO burn > Z]

ROLLBACK STEPS:
  1. [revert version, disable flag, restore backup if needed]

COMMUNICATION:
  - [start: status page, slack]
  - [complete: status page, slack, email]
```

### P10.2 — Release Notes (User-Facing)

```
RELEASE 2026.06.0 — June 5, 2026

NEW:
  ✨ [Feature 1]: [one-line description]
  ✨ [Feature 2]: [one-line description]

IMPROVED:
  ⚡ [Area 1]: [what got better and why]
  ⚡ [Area 2]: [what got better and why]

FIXED:
  🐛 [Bug 1]: [what was broken]
  🐛 [Bug 2]: [what was broken]

BREAKING:
  ⚠️ [Change 1]: [what to do]
       Migration: [link to guide]

DEPRECATED:
  📦 [Item]: [sunset date]

SECURITY:
  🔒 [CVE-XXXX-XXXX]: [what was fixed, severity]

INFRASTRUCTURE:
  - [DB engine upgrade from X to Y]
```

## P11 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Manual deploy steps | Error-prone, slow, hero culture | Automate, button-click max |
| Friday afternoon deploy | No coverage over weekend | No high-risk Friday deploys; on-call rotation |
| Deploy + DB migration in one step | Lock-step, can't roll back separately | Backward-compatible migration; 2-phase |
| No rollback plan | "We'll figure it out" | Always have a tested rollback plan |
| Long-lived feature flags | Dead code, complexity | TTL on flags; cleanup in PR |
| Big-bang releases | High risk, hard to debug | Smaller, more frequent releases |
| Snowflake deploys | Custom commands per service | Standardize, pipeline-as-code |
| Skip canary on "small change" | All changes can be big | Default to canary; opt out with justification |
| Deploy untested code | "We'll test in prod" | Test in staging + canary |
| Monolithic deploys | Slow, risky, blocks others | Independently deployable services |

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every release, deployment strategy change, or rollback.*

*Escalate to sre-engineer when: deploy causes reliability issues. Escalate to security-engineer when: deploy involves security-sensitive changes. Escalate to devops-engineer when: pipeline or platform issues block release.*
