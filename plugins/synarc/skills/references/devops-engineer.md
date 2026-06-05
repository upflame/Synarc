---
title: "DevOps Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - devops-engineer
  - cicd
  - release-engineering
  - infrastructure-automation
  - developer-experience
  - gitops
  - containerization
---

# Purpose

Design, implement, and maintain the continuous delivery pipeline — the inner loop from code commit to production deployment. Enable developers to ship code faster, safer, and more reliably through automation.

# Scope

CI/CD architecture, version control strategy, build systems, artifact management, release management, deployment automation, environment management, GitOps, configuration management, IaC, containerization, pipeline optimization, security integration. Inherits synarc core.

# Inputs

Application code, repository structure, deployment targets, team topology, compliance requirements, DORA metric baselines, existing pipeline configuration.

# Output

Automated CI/CD pipelines, artifact promotion workflows, deployment strategies, GitOps configurations, environment definitions, pipeline quality gates.

## 1. CI/CD Architecture

### Pipeline Design Patterns

| Pattern | Use Case |
|---------|----------|
| Trivial | Simple services, small teams — push → lint → build → test → deploy |
| Stage-Gate | Regulated environments — lint → build → unit → integration → security → staging → approval → prod |
| Promotion | Artifact-based — build once, promote through environments |
| Feature Flag | Trunk-based CD — deploy dark, release via flags |
| Monorepo | Multi-service repo — affected-project detection, parallel builds |
| Streaming | High-traffic — canary → traffic split → metrics comparison → auto-rollback |

### Stage Separation

Each stage builds confidence: Lint (seconds) → Build (minutes) → Unit Test → Integration → Security Scan → Staging Deploy → E2E → Production Deploy.

Automatic gates progress immediately. Approval gates require manual sign-off. Time gates enforce soak periods. Composite gates combine multiple types.

## 2. Version Control Strategy

### Branching Strategies

| Strategy | Best For |
|----------|----------|
| Trunk-Based | CD, feature flags, single deployable branch |
| GitHub Flow | PR-based, main is always deployable |
| Git Flow | Scheduled releases, multiple parallel versions |
| GitLab Flow | Environment branches (main → pre-prod → prod) |

### Conventional Commits

`feat:` → MINOR, `fix:` → PATCH, `!` or `BREAKING CHANGE:` → MAJOR. Squash merge for feature branches. Atomic commits — one logical change per commit.

### Monorepo vs Multi-Repo

Monorepo: shared tooling, atomic cross-project commits, needs affected-project detection. Multi-repo: independent versioning, team autonomy, needs cross-repo CI coordination.

## 3. Build Systems & Optimization

### Build Optimization Matrix

| Technique | Impact | Effort |
|-----------|--------|--------|
| Incremental builds | High | Medium |
| Parallel execution | High | Low |
| Remote caching | High | Medium |
| Build avoidance | High | Low |
| Faster hardware | Medium | Low |

### Docker Multi-stage

Separate build from runtime. Layer caching: copy dependency files first, install before source. Use BuildKit (`--mount=type=cache`). Base image selection: alpine (5MB), distroless (~20MB, no shell), slim (~30MB).

## 4. Artifact Management

Immutable release tags. Sign images with cosign. Scan with Trivy/Snyk. Retention policies: latest N builds, date-based cleanup. Registry organization: `team/service/version`.

## 5. Release Management

### Semantic Versioning

`MAJOR.MINOR.PATCH` — automated from conventional commits. Pre-release tags: `-alpha.1`, `-beta.1`, `-rc.1`.

### Artifact Promotion

Build once, promote through environments. Dev promotion verifies builds and basic tests. Staging promotion adds integration and quality checks. Production promotion is the final gate.

## 6. Deployment Automation

### Strategy Selection

| Strategy | Risk | Rollback | Use Case |
|----------|------|----------|----------|
| Rolling | MEDIUM | Minutes | Stateless, fast deploy |
| Blue-green | LOW | Seconds | Stateful, compliance |
| Canary | LOW | Minutes | High-traffic, risk-sensitive |
| Feature flag | LOW | Instant | User segments |
| Shadow | VERY LOW | Seconds | Validate new system |

Zero-downtime: backward-compatible DB migrations (expand-migrate-contract), drain queues, dependency-ordered deployment.

### Rollback Protocol

[1] Trigger on: error rate > +1% or p99 > 2x baseline for 2+ consecutive checks. [2] Automated if canary/blue-green. [3] Documented runbook if manual. [4] Verify rollback within 2 minutes.

## 7. Environment Management

| Environment | Purpose | Config | Stability |
|-------------|---------|--------|-----------|
| Dev | Development testing | Minimal, developer-controlled | Unstable |
| CI | Automated pipeline | Clean state per run | Unstable |
| Staging | QA, integration | Production-like | Moderate |
| Pre-Prod | Final validation | Production-identical | Stable |
| Production | User-facing | Strict access, full monitoring | Maximum |

Environments as code: version-controlled, auditable, reproducible.

## 8. GitOps

Cluster state in Git, reconciled by operator (ArgoCD/Flux). Pull-based deployment. Rollback via Git revert. Approval: PR → plan review → merge → auto-apply.

## 9. DevOps Metrics (DORA)

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deployment frequency | Multiple/day | Once/day | Once/week | Once/month |
| Lead time for changes | <1 hour | <1 day | <1 week | >1 week |
| MTTR | <1 hour | <1 day | <1 day | >1 week |
| Change failure rate | <5% | <10% | <15% | >15% |

## 10. Security in CI/CD

Shift left: SAST, DAST, SCA, container scanning as pipeline gates. Block build on HIGH+ CVSS. Sign artifacts (cosign). SBOM generation per build. Secrets never in pipeline logs.

## 11. Pipeline as Code

Pipeline config lives in repo, versioned, reviewed like code. Composable via templates/actions. Testable locally. Self-documenting. Common tools: GitHub Actions, GitLab CI, Jenkins (Groovy DSL), Tekton, Buildkite.

## 12. CALMS Framework

**Culture**: psychological safety, collaboration, trust, experimentation. **Automation**: build, test, deploy, provision, configure — automate everything except human judgment. **Lean**: eliminate waste, amplify learning, decide late, deliver fast, empower teams. **Measurement**: DORA + flow + quality + performance metrics, automated and visible. **Sharing**: shared ownership, cross-functional teams, communities of practice.

## 13. The Three Ways

**First Way (Flow)**: optimize end-to-end work, reduce batch sizes, limit WIP, eliminate bottlenecks, reduce handoffs. **Second Way (Feedback)**: amplify feedback loops — commit → test (minutes), deploy → monitoring (minutes), incident → postmortem (days). **Third Way (Learning)**: blameless postmortems, chaos engineering, game days, continuous experimentation.
