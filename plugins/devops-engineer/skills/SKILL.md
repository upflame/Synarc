---
name: devops-engineer
description: DevOps Engineer — Comprehensive Skill Reference
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---
# DevOps Engineer — Comprehensive Skill Reference

> **Role:** DevOps Engineer  
> **Domain:** CI/CD, Release Engineering, Infrastructure Automation, Developer Experience  
> **Scope:** Everything between code commit and production deployment — the inner loop of delivery

---

## Table of Contents

1. [Persona](#p1-persona)
2. [Philosophy](#p2-philosophy)
3. [CI/CD Architecture](#p3-cicd-architecture)
4. [Version Control Strategy](#p4-version-control-strategy)
5. [Build Systems](#p5-build-systems)
6. [Artifact Management](#p6-artifact-management)
7. [Release Management](#p7-release-management)
8. [Deployment Automation](#p8-deployment-automation)
9. [Environment Management](#p9-environment-management)
10. [GitOps](#p10-gitops)
11. [Configuration Management](#p11-configuration-management)
12. [Infrastructure as Code](#p12-infrastructure-as-code)
13. [Containerization](#p13-containerization)
14. [DevOps Metrics](#p14-devops-metrics)
15. [Pipeline Optimization](#p15-pipeline-optimization)
16. [Security in CI/CD](#p16-security-in-cicd)
17. [Database CI/CD](#p17-database-cicd)
18. [Mobile CI/CD](#p18-mobile-cicd)
19. [Compliance & Audit](#p19-compliance--audit)
20. [Worked Examples](#p20-worked-examples)
21. [Anti-Patterns](#p21-anti-patterns)
22. [Quality Gates](#p22-quality-gates)

---

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Error received → lookup pattern, propose fix immediately
- File named → load file, offer action suggestions
- Exception thrown → analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in ≤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

## P1: Persona

A DevOps Engineer is responsible for designing, implementing, and maintaining the continuous delivery pipeline. This role sits at the intersection of development, operations, quality assurance, and security. The DevOps Engineer enables developers to ship code faster, safer, and more reliably by building and operating the platform, tooling, and automation that underpins the software delivery lifecycle.

### Core Competencies

1. **CI/CD Pipeline Engineering** — Design and implement build, test, and deployment pipelines that are fast, reliable, and secure.
2. **Release Management** — Own the release process including versioning, changelogs, artifact promotion, and deployment coordination.
3. **Infrastructure Automation** — Apply infrastructure as code principles to manage environments, configuration, and deployment targets.
4. **Developer Experience** — Build self-service tooling that enables teams to ship independently without bottlenecks.
5. **Observability & Metrics** — Measure and optimize delivery performance using DORA metrics and other quantitative indicators.
6. **Security Integration** — Embed security controls throughout the pipeline without sacrificing developer velocity.

### Daily Activities

- Reviewing pipeline failures and implementing fixes for flaky tests or infrastructure issues
- Designing and implementing new deployment strategies (canary, blue-green, rolling)
- Managing artifact repositories, container registries, and package feeds
- Working with development teams to optimize build times and dependency caching
- Implementing GitOps workflows and managing configuration drift
- On-call rotation for pipeline reliability and deployment issues
- Auditing compliance controls and evidence collection for CI/CD processes
- Evaluating and integrating new tools into the delivery platform
- Mentoring developers on DevOps best practices and self-service workflows
- Capacity planning for build infrastructure and artifact storage

### Technology Stack

| Category | Tools |
|---|---|
| CI/CD | GitHub Actions, GitLab CI/CD, Jenkins, CircleCI, Buildkite, Tekton, Argo Workflows |
| GitOps | ArgoCD, Flux, Rancher Fleet, Sealed Secrets, External Secrets Operator |
| Containers | Docker, Podman, BuildKit, Kaniko, containerd |
| IaC | Terraform, Pulumi, AWS CDK, CloudFormation, OpenTofu |
| Config | Helm, Kustomize, jsonnet, cue, Dhall, ytt |
| Artifacts | Artifactory, Nexus, ECR, GCR, Docker Hub, GHCR, S3 |
| Security | Snyk, Trivy, SonarQube, OWASP ZAP, Sigstore, cosign, slsa-verifier |
| Monitoring | Datadog, Grafana, Prometheus, New Relic, Honeycomb |
| Languages | Go, Python, Bash, TypeScript, HCL, YAML |

### Mindset

The DevOps Engineer practices **systems thinking** — understanding that the delivery pipeline is a system with inputs, outputs, feedback loops, and emergent behaviors. Every change to the pipeline has second-order effects. The goal is not just automation but **optimizing the entire value stream** from commit to production, minimizing handoffs, reducing cycle time, and increasing the flow of value to users.


## P3: CI/CD Architecture

### Pipeline Design Patterns

#### 1. The Trivial Pipeline

Code Push -> Lint -> Build -> Unit Test -> Deploy

Used for: simple services, small teams, early-stage projects
Characteristics: single stage, no gates, direct to production

#### 2. The Stage-Gate Pipeline

Code Push -> Lint -> Build -> Unit Test -> Integration Test -> Security Scan -> Deploy to Staging -> E2E Test -> Approval Gate -> Deploy to Production

Used for: regulated environments, high-risk services
Characteristics: multiple stages with approval gates, separation of concerns, increasing confidence

#### 3. The Promotion Pipeline

Commit -> Build -> Test -> Publish Artifact -> [Promote to Staging] -> Deploy -> Validate -> [Promote to Production] -> Deploy -> Validate

Used for: artifact-based deployments, containerized services
Characteristics: single build creates immutable artifact, promoted through environments

#### 4. The Feature Flag Pipeline

Commit -> Build -> Test -> Deploy to All Environments -> Feature Flag Toggle -> Gradual Rollout -> Monitoring -> 100% Rollout

Used for: trunk-based development, continuous deployment
Characteristics: deployment and release are decoupled, features are released via flags

#### 5. The Monorepo Pipeline

Commit -> Affected Projects Detection -> Project A Build / Project B Build -> Project A Test / Project B Test -> Project A Deploy / Project B Deploy

Used for: monorepo, multiple services in one repository
Characteristics: dependency-aware, affected project detection, parallel builds

#### 6. The Matrix Pipeline

Commit -> Build Matrix (OS1, OS2, OS3, OS4) -> Test Matrix (T1, T2, T3, T4) -> Integration -> Publish Artifact

Used for: libraries, SDKs, cross-platform tools
Characteristics: test matrix across OS/versions/configurations, combinatorial testing

#### 7. The Streaming/Real-time Pipeline

Commit -> Build -> Image Scan -> Deploy to Canary -> Traffic Split (10% Canary / 90% Stable) -> Metrics Comparison -> Auto-rollback or Full

Used for: high-traffic services, data pipelines
Characteristics: traffic shifting, automated canary analysis, auto-rollback

### Stage Separation

#### Purpose of Stage Separation

Each stage in the pipeline serves a specific purpose and builds confidence:

| Stage | Purpose | Speed | Confidence |
|---|---|---|---|
| Lint | Code style and basic errors | Seconds | Low |
| Build | Compilation, dependency resolution | Minutes | Low |
| Unit Test | Component-level correctness | Minutes | Medium |
| Integration Test | Component interaction | Minutes | Medium |
| Security Scan | Vulnerability detection | Minutes | Medium |
| Deploy to Staging | Environment validation | Minutes | Medium |
| E2E Test | Full system validation | Minutes-Hours | High |
| Performance Test | Non-functional validation | Hours | High |
| Smoke Test | Basic functionality check | Minutes | Very High |
| Deploy to Production | User-facing deployment | Minutes | Very High |

#### Stage Gating Criteria

Each stage should have clear entry and exit criteria:

**Entry criteria:**
- Previous stage passed
- Required approvals obtained
- Required artifacts available
- Required environment available
- Required secrets available
- Pipeline not paused/halted

**Exit criteria:**
- All tests passed
- All scans passed with no critical/high findings
- Coverage thresholds met
- Performance thresholds met
- Compliance checks passed
- Artifacts published and signed

**Gate types:**

1. **Automatic gate** — Previous stage passes, next stage starts immediately
2. **Conditional gate** — Stage runs only for certain branches, files, or conditions
3. **Time gate** — Stage runs after a specified delay (e.g., soak time in staging)
4. **Approval gate** — Manual approval required before proceeding
5. **Signal gate** — External signal required (e.g., monitoring threshold, external system status)
6. **Composite gate** — Combination of multiple gate types

### Artifact Promotion

Artifact promotion is the process of promoting an artifact through environments with increasing levels of validation.

#### Promotion Model

Build Artifact (immutable, versioned) -> Promote to Dev -> Promote to Staging -> Promote to Production

Each promotion adds confidence:
- **Dev promotion** — \\"It builds and basic tests pass\\"
- **Staging promotion** — \\"It integrates correctly and meets quality standards\\"
- **Production promotion** — \\"It\\'s ready for users\\"

#### Promotion Strategies

**Manual promotion:**
- Developer or release manager triggers promotion
- Requires explicit action
- Good for: regulated environments, low-frequency releases

**Automatic promotion:**
- Pipeline automatically promotes after validation
- No human intervention required
- Good for: high-velocity teams, mature pipelines

**Conditional promotion:**
- Automatic up to a certain environment, manual for production
- Based on branch, tag, or artifact quality
- Good for: most organizations, balanced approach

**Promotion via immutable tags:**
- Artifact tags indicate environment provenance
- Example: myapp:v1.2.3-dev, myapp:v1.2.3-staging, myapp:v1.2.3-production
- Tags are moved, artifact content never changes

**Promotion via metadata:**
- Artifact metadata tracks promotion history
- Each promotion adds metadata entry
- Pipeline verifies promotion chain before deploying

### Environment Stages

#### Standard Environment Model

| Environment | Purpose | Configuration | Access | Stability |
|---|---|---|---|---|
| Dev | Development testing | Minimal, developer-controlled | Developer access | Unstable |
| CI/Test | Automated pipeline testing | Automated, clean state | Pipeline only | Unstable |
| QA/Staging | Quality assurance, integration testing | Production-like | QA team, limited dev | Moderate |
| Pre-Prod/Staging | Final validation before production | Production-identical | Release managers | Stable |
| Production | User-facing service | Production | Limited SRE/Dev | Maximum |

#### Environment Characteristics

**Dev environment:**
- Ephemeral or shared
- Developers deploy directly or via pipeline
- Fast feedback, lower reliability requirements
- May use local k8s clusters (kind, minikube)

**CI environment:**
- Ephemeral, created and destroyed per pipeline run
- Clean state for every run
- Identical configuration for every pipeline
- Short-lived (minutes to hours)

**Staging environment:**
- Long-lived or persistent
- Production-like in configuration, scale may be smaller
- Used for integration testing, manual QA, demos
- Should be as close to production as possible
- Regular data refresh from production (anonymized)

**Pre-Prod environment:**
- Exact production replica (same configuration, same deployment mechanism)
- Used for final validation and dry-run deployments
- May have production traffic mirrored (shadow traffic)
- Often used for performance and load testing

**Production environment:**
- Live customer-facing service
- Strict access controls
- Comprehensive monitoring and alerting
- Rollback capability
- Feature flags for gradual rollout

#### Env-as-Code

Environments defined as code in the repository:

apiVersion: delivery.devops/v1
kind: Environment
metadata:
  name: myapp-staging
  namespace: myapp
spec:
  type: staging
  cluster: eks-staging
  namespace: myapp-staging
  configSource:
    repo: myapp-config
    path: environments/staging/
  dataSource:
    type: snapshot
    source: prod
    anonymize: true
  autoDestroy: false
  ttl: 720h

Benefits: version controlled, auditable, reproducible, self-documenting

### Pipeline as Code

#### Principles

1. **Pipeline configuration lives in the repository** alongside the application code
2. **Pipelines are versioned** — changes to the pipeline are reviewed and tested like code
3. **Pipelines are composable** — shared steps are defined as templates or actions
4. **Pipelines are testable** — pipeline logic can be validated locally or in CI
5. **Pipelines are self-documenting** — the pipeline file is the source of truth

#### Pipeline-as-Code Languages

| Tool | Language | Strengths |
|---|---|---|
| GitHub Actions | YAML | GitHub-native, large marketplace, matrix support |
| GitLab CI/CD | YAML | CI/CD + registry + kubernetes integration |
| Jenkins Pipeline | Groovy DSL | Mature, extensive plugin ecosystem, scripted/declarative |
| Tekton | YAML | Kubernetes-native, cloud-native, extensible |
| Argo Workflows | YAML | Kubernetes-native, DAG-based, complex workflows |
| Buildkite | YAML Steps | Hybrid architecture, plugin ecosystem |
| CircleCI | YAML | Fast, caching, parallelism, orb marketplace |
| Concourse | YAML | Immutable, reproducible, resource-oriented |

#### Pipeline Templates

Shared pipeline logic should be extracted into templates.

### Pipeline Orchestration vs. Coordination

#### Orchestration

A central orchestrator controls pipeline execution. The orchestrator decides when each step runs and manages state.

**Pros:** Centralized control, easier to manage complex workflows, single source of truth
**Cons:** Single point of failure, can be a bottleneck, less flexible

**Tools:** Jenkins, Concourse, Tekton, Argo Workflows

#### Coordination

Each step is independent and coordinates via shared state (artifacts, events, data stores). No central controller.

**Pros:** More resilient, scalable, flexible, easier to parallelize
**Cons:** More complex to implement, harder to debug, requires shared state infrastructure

**Tools:** GitHub Actions (composite actions), Buildkite, event-driven pipelines

#### Hybrid Approach

Most mature pipelines use a hybrid approach:
- Central coordination for the high-level workflow
- Decentralized execution for individual steps
- Event-driven triggers for specific conditions

### Pipeline Execution Models

#### Sequential Execution

Steps run one after another. Simple but slow.

Best for: simple pipelines, dependent steps, shared resources

#### Parallel Execution

Independent steps run simultaneously.

Best for: matrix builds, multi-platform testing, fan-out/fan-in patterns

#### Fan-Out/Fan-In

Parallel execution that converges at a synchronization point.

Best for: monorepo, multi-service builds, independent component testing

#### DAG-Based Execution

Directed Acyclic Graph where steps can have complex dependency relationships.

Best for: complex workflows, conditional execution, gated promotions

#### Event-Driven Execution

Pipeline steps triggered by events rather than sequential orchestration.

Best for: microservices, decoupled pipelines, high-scale systems

### Pipeline Topologies

#### Centralized Pipeline

Single pipeline instance shared by all teams.

**Pros:** Standardized, easier to manage, consistent quality gates
**Cons:** Bottleneck, doesn\\'t fit all use cases, team dependency

#### Distributed Pipelines

Each team owns their own pipeline configuration.

**Pros:** Team autonomy, optimized for each service, no bottleneck
**Cons:** Inconsistent quality, duplication of effort, harder to enforce standards

#### Federated Pipeline

Shared core pipeline logic with team-specific extensions.

**Pros:** Standardized core, flexible extensions, balance of control and autonomy
**Cons:** Requires pipeline as a platform approach, more complex to implement

#### Pipeline as a Platform

A platform team provides pipeline building blocks that product teams compose.

**Pros:** Self-service, consistent quality, team autonomy
**Cons:** Requires platform engineering investment, governance overhead

### CI/CD for Different Architectures

#### Monolith

- Single pipeline for the entire application
- Longer build and test times
- Deployment is all-or-nothing
- Can benefit from modularization for pipeline optimization

#### Microservices

- Independent pipelines per service
- Integration testing across services
- Service mesh for traffic management during deployment
- API contract testing for service interfaces

#### Serverless

- Function-level deployments
- Infrastructure as code for function configuration
- Multiple functions may be deployed together or independently
- Cold start testing as part of pipeline

#### Containerized

- Container build per service
- Image scanning as part of pipeline
- Container registry for artifact management
- Kubernetes or similar orchestrator for deployment

#### Event-Driven/Streaming

- Schema evolution testing
- Consumer-driven contract testing
- Data pipeline validation
- Integration testing with event brokers


## P5: Build Systems

### Build System Selection

| Criteria | Bazel | Gradle | Maven | Webpack/Vite | Make | Nx |
|---|---|---|---|---|---|---|
| Language | Multi | JVM, Kotlin, Android | JVM | JS/TS | Universal | JS/TS |
| Incremental builds | Excellent | Good | Good | Good | Limited | Excellent |
| Remote caching | Excellent | Good | Limited | No | No | Excellent |
| Distributed builds | Excellent | Limited | Limited | No | No | Limited |
| Dependency management | Manual | Built-in (Gradle) | Built-in (Maven) | npm/yarn/pnpm | Manual | Built-in (Nx) |
| Learning curve | Steep | Moderate | Moderate | Moderate | Low | Moderate |

### Build Optimizations

#### Incremental Builds

Only rebuild files that have changed:

- **Bazel:** Content-addressable caching, only rebuilds targets with changed inputs
- **Gradle:** Build cache, input change tracking
- **Nx:** Computation caching, affected command detection
- **Webpack:** Module-level caching, persistent caching in memory and disk
- **esbuild/Vite:** Fast rebuilds with native bundling

#### Build Caching

**Local caching:**
- Cache on developer machines
- Cache on CI workers
- Shared cache across CI runs

**Remote caching:**
- Distributed cache across CI runs and developers
- Content-addressable
- Uses S3, GCS, or dedicated cache service

**Cache invalidation:**
- Source file changes
- Dependency changes
- Tool version changes
- Configuration changes

#### Parallel Builds

- Build independent modules in parallel
- Use multi-threaded compilation
- Fan-out for independent targets
- Cache intermediate artifacts

#### Build Avoidance

- Only build what changed (affected project detection)
- Use dependency graphs to minimize rebuilds
- Content-addressable storage for build artifacts

### Dependency Management

#### Dependency Resolution

- Lock files (package-lock.json, yarn.lock, pnpm-lock.yaml, requirements.txt, pom.xml.lock)
- Deterministic builds (reproducible dependency resolution)
- Version pinning (specific versions, not ranges)
- Vulnerability scanning (SCA tools)

#### Dependency Caching

- Cache downloaded packages in CI
- Use private package registries
- Layer caching in Docker builds
- Offline mode for deterministic builds

#### Dependency Updates

- Automated dependency update PRs (Dependabot, Renovate)
- Regular update cadence
- Breaking change detection
- Changelog-driven updates
### Optimized Docker Builds

#### Multi-stage Builds

Separate build environment from runtime:

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/index.js"]

#### Caching Strategy

- Copy dependency files first (layer caching)
- Install dependencies before copying source
- Use Docker BuildKit for improved caching
- Leverage --cache-from for remote cache
- Structure Dockerfile for maximum cache hits

#### BuildKit Features

- RUN --mount=type=cache for package manager cache
- RUN --mount=type=secret for build secrets
- COPY --link for faster copying
- Parallel builds for independent stages
- BUILDKIT_PROGRESS=plain for debugging

#### Image Size Optimization

- Use slim or alpine base images
- Multi-stage builds to exclude build dependencies
- Remove unnecessary files (docs, headers, static libs)
- Use distroless images where possible
- Layer squashing (with caution)
- Avoid installing unnecessary packages
- Use --no-install-recommends (apt) or equivalent

#### Base Image Selection

| Image | Size | Security | Performance |
|---|---|---|---|
| alpine | 5MB | Good (small surface) | Limited musl compatibility |
| slim | ~30MB | Good | Full glibc compatibility |
| distroless | ~20MB | Excellent (no shell) | Full glibc compatibility |
| scratch | 0MB | Excellent (empty) | Must provide everything |
| ubuntu | ~70MB | Good | Full compatibility |
| golang:alpine | ~300MB | Good | Go build and runtime |

#### Image Scanning

- Scan for vulnerabilities in CI pipeline: trivy image, grype, snyk container
- Block builds with critical vulnerabilities
- Regular scanning of running containers
- Base image update automation
- CVE database updates

### Build Time Optimization

| Technique | Impact | Effort |
|---|---|---|
| Incremental builds | High | Medium |
| Parallel execution | High | Low |
| Remote caching | High | Medium |
| Build avoidance | High | Low |
| Faster hardware | Medium | Low |
| Optimized dependencies | Medium | Medium |
| Lazy loading | Low | High |
| Tree shaking | Low | Medium |

### Build Tools Configuration

#### Node.js/TypeScript

{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsc --watch",
    "test": "jest --coverage",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}

#### Python

[project]
name = "my-service"
version = "1.0.0"
dependencies = [
    "fastapi>=0.100.0",
    "pydantic>=2.0.0",
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"

#### Java/Gradle

plugins {
    id 'java'
    id 'application'
    id 'jacoco'
    id 'com.github.johnrengelman.shadow' version '8.1.1'
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

dependencies {
    implementation 'com.google.guava:guava:32.1.1-jre'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}

test {
    useJUnitPlatform()
    finalizedBy jacocoTestReport
}

#### Go

// go.mod
module github.com/myorg/myservice

go 1.21

require (
    github.com/gorilla/mux v1.8.0
    github.com/prometheus/client_golang v1.16.0
)


## P7: Release Management

### Semantic Versioning (SemVer)

#### Specification Summary

Given a version number MAJOR.MINOR.PATCH:

1. **MAJOR** version for incompatible API changes
2. **MINOR** version for backward-compatible functionality
3. **PATCH** version for backward-compatible bug fixes
4. Pre-release versions: 1.0.0-alpha.1, 1.0.0-beta.1, 1.0.0-rc.1
5. Build metadata: 1.0.0+build.1234

#### SemVer in Practice

**When to increment MAJOR:**
- Breaking API changes
- Removal of deprecated features
- Major architectural changes
- Database schema changes that are not backward-compatible
- Changes to public interfaces

**When to increment MINOR:**
- New features that are backward-compatible
- Deprecation warnings for future breaking changes
- New public API additions
- New configuration options
- Feature flag introduction

**When to increment PATCH:**
- Bug fixes
- Security patches
- Performance improvements with no API change
- Documentation improvements
- Internal refactoring with no behavior change

#### Pre-release Versioning

1.0.0-alpha.1 -> First alpha
1.0.0-alpha.2 -> Second alpha
1.0.0-beta.1 -> First beta
1.0.0-rc.1 -> First release candidate
1.0.0 -> Final release
1.0.1-alpha.1 -> Next iteration

Precedence: 1.0.0-alpha < 1.0.0-beta < 1.0.0-rc < 1.0.0

### Automated Version Management

#### Tools

- **release-please** (Google) — GitHub Actions-native, conventional commits
- **semantic-release** — Fully automated, extensive plugin system
- **changesets** — Changeset-based, good for monorepos
- **standard-version** — npm version bump + changelog
- **bumpversion** — Generic version bump tool

### Changelog Generation

#### Conventional Changelog

Automatically generated from conventional commits:

# Changelog

## [1.2.0] - 2024-01-15

### Features
- Add user profile page (PR #123)
- Implement search functionality (PR #127)

### Bug Fixes
- Fix login redirect loop (PR #125)
- Resolve memory leak in data service (PR #128)

### Documentation
- Update API documentation for v2 endpoints (PR #126)

### Dependencies
- Update express from 4.18.0 to 4.19.0 (PR #124)

#### Changelog Structure

- **Header:** Version number and release date
- **Categories:** Features, Bug Fixes, Breaking Changes, Documentation, Dependencies, etc.
- **PR references:** Each entry links to the PR
- **Issue references:** Each entry may reference related issues
- **Contributor credits:** Acknowledgments where appropriate

### Release Branches

#### Release Branch Workflow

1. Create release branch from main at release candidate commit
2. Run final validation and testing
3. Fix any critical issues on the release branch
4. Cherry-pick fixes back to main
5. Tag the release on the release branch
6. Merge release branch to main (if needed)
7. Deploy from release branch or tag

#### Hotfix Branch Workflow

1. Branch from the tagged release commit
2. Apply the fix
3. Test the fix
4. Tag the hotfix release
5. Deploy the hotfix
6. Cherry-pick the fix to main
7. Delete the hotfix branch

### Release Notes

#### Release Note Content

- **Executive summary:** What is this release about?
- **New features:** What\\'s new for users?
- **Bug fixes:** What issues were resolved?
- **Breaking changes:** What do users need to do differently?
- **Deprecations:** What will change in future releases?
- **Known issues:** What hasn\\'t been fixed yet?
- **Installation/upgrade instructions:** How to deploy the release
- **Configuration changes:** What configuration has changed?
- **Dependency changes:** Notable dependency updates
- **Contributors:** Thank yous

#### Release Note Automation

- Generate from conventional commits
- Allow manual editing for important releases
- Include links to issues and PRs
- Include compatibility matrix
- Include rollback instructions

### Release Sign-off

#### Sign-off Process

1. **Code complete** — All features merged to release branch
2. **QA validation** — Testing team signs off
3. **Security sign-off** — Security scan complete, no critical findings
4. **Compliance sign-off** — Compliance checks passed
5. **Product sign-off** — Product owner approves release content
6. **Release manager sign-off** — Final approval to deploy
7. **Deployment window** — Scheduled deployment time
8. **Post-deployment verification** — Smoke tests passed
9. **Release complete** — Release is live

#### Sign-off Automation

- Pipeline approval gates for each sign-off
- Automated email/notification for pending approvals
- Escalation for stalled approvals
- Audit trail of sign-offs
- Delegated approval for routine releases

### Release Trains

#### Concept

A release train is a regular, scheduled release cadence where features that are ready get on board and features that aren\\'t wait for the next train.

**Principles:**
- Releases happen on schedule (e.g., every two weeks)
- Features that are ready board the train
- Features that aren\\'t ready wait for the next train
- Quality gates are non-negotiable
- The train departs on time regardless

**Benefits:**
- Predictable release cadence
- No last-minute scrambling
- Clear decision point for feature readiness
- Reduces release stress
- Enables planning across teams

#### Implementation

Release Train A: Every 2 weeks on Tuesday
- Tag creation: Monday
- Staging deployment: Monday COB
- QA testing: Tuesday
- Production deployment: Tuesday COB
- Release notification: Wednesday morning

Release Train B: Monthly on first Wednesday
- Feature freeze: Last Friday of previous month
- Tag creation: Monday
- Staging deployment: Monday
- QA testing: Tuesday
- Final approval: Wednesday morning
- Production deployment: Wednesday COB

### Release Automation Checklist

Pre-release:
  - Verify version number in source
  - Generate changelog from conventional commits
  - Create and validate release branch
  - Run full CI pipeline on release branch
  - Security scan release artifacts
  - Generate SBOM for release
  - Sign release artifacts
  - Tag release commit
  - Create release notes
  - Notify stakeholders of release candidate

Release:
  - Deploy to staging environment
  - Run smoke tests on staging
  - Run integration tests on staging
  - Run performance tests on staging
  - Manual QA sign-off (if required)
  - Security sign-off (if required)
  - Approval gate for production
  - Deploy to production (with rollout strategy)
  - Verify production deployment
  - Run production smoke tests
  - Monitor production metrics

Post-release:
  - Confirm release success
  - Update environment tags/labels
  - Archive release artifacts
  - Send release notification
  - Update tracking system (Jira, Linear)
  - Retrospective if needed
  - Plan next release


## 5 — RELEASE CANDIDATE MANAGEMENT

### 5.1 — Release Candidate Definition

A release candidate (RC) is a build that has passed all pre-release gates and is being evaluated for production release. RC lifecycle:

```
Build Generated -> Testing -> RC1 Created -> RC1 Testing -> RC2 Created -> ... -> RTM -> GA
                                                                              |
                                                                          Ready to Ship
                                                                           (no blocking
                                                                            critical issues)
```

**RC Criteria:**

A build becomes an RC when:
- All automated CI tests pass
- All pre-deployment gates pass
- Manual QA has been executed
- Security review has been passed
- Performance characterization is complete

**RTM (Release to Manufacturing):**

An RC becomes RTM when:
- All release-blocking bugs are resolved or waived
- All release criteria are satisfied
- Release sign-off obtained from all stakeholders

### 5.2 — Release Note Generation

**Automated Release Notes:**

Generate release notes from conventional commit messages:

```
feat: Add user authentication
^---^  ^---------------------^
type  subject

Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance
perf:     Performance improvement
ci:       CI/CD changes
```

**Release Note Sections:**

```markdown
## Release v2.4.0 — 2024-03-15

### Breaking Changes
- [BREAKING] `auth_service.identify()` now requires `request_id` parameter
  Migration: Add `request_id` to all calls, or use `auth_service.identify_legacy()`

### New Features
- User authentication with OAuth2 and SAML support
- Real-time webhook delivery with automatic retries
- Multi-region active-active deployment support

### Bug Fixes
- Fixed memory leak in connection pool for PostgreSQL driver (issue #1234)
- Fixed race condition in session refresh (issue #1235)

### Performance
- Reduced API p99 latency from 450ms to 120ms (73% improvement)
- Reduced memory footprint by 40% through connection pooling optimization

### Deprecations
- `legacy_auth_v1()` deprecated, scheduled removal in v3.0.0
  Use `auth_service.identify()` instead
```

### 5.3 — Release Scheduling

**Release Cadence Decision Framework:**

| Cadence | Description | When to Use |
|---------|-------------|-------------|
| Continuous Delivery | Deploy every merged commit | Mature teams, automated testing, low-risk changes |
| Weekly | Release every week on Tuesday/Thursday | Regular feature delivery |
| Bi-weekly | Release every two weeks | Sprint-based delivery |
| Monthly | Release on first Tuesday of month | Enterprise with lengthy QA cycles |
| Quarterly | Major releases only | Regulated industries, complex integration testing |

**Release Freeze Policy:**

Define freeze windows where no releases are deployed:
- Code freeze: No code changes except critical fixes
- Release freeze: No releases to production
- Configuration freeze: No config changes to production

Freeze windows are declared in advance (at least 2 weeks) and have explicit exceptions for critical/security patches.


## 7 — ADVANCED DEVOPS PATTERNS

### 7.1 — GitOps Deployment

**GitOps Concept:**

GitOps uses a Git repository as the single source of truth for both application code and infrastructure configuration. Deployment happens through a reconciliation loop that syncs the Git state with the cluster state.

```
Git Repository (desired state)
       |
       v (push webhook triggers)
GitOps Operator (ArgoCD, Flux)
       |
       v (reconciles state)
Kubernetes Cluster (actual state)
       |
       v (monitors and reports drift)
Dashboard / Git Status
```

**GitOps Benefits:**

- Audit trail: Every change to infrastructure is a commit
- Rollback: `git revert` to rollback infrastructure
- Consistency: Same deployment process for every environment
- Developer-friendly: Deploy without Kubernetes expertise
- Version control: Canary, blue-green, progressive delivery through Git branches

**GitOps Implementation:**

1. Store all Kubernetes manifests in a Git repository
2. Use Kustomize or Helm for environment-specific overrides
3. Connect GitOps operator (ArgoCD or Flux) to the repository
4. ArgoCD/Flux continuously monitors Git and reconciles cluster state
5. Promotion through environments: Feature branch -> Dev -> Staging -> Prod

### 7.2 — Progressive Delivery with Argo Rollouts

**Argo Rollouts CRD:**

Argo Rollouts extends Kubernetes with advanced deployment strategies:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: my-service
spec:
  replicas: 3
  strategy:
    canary:
      steps:
        - setWeight: 5      # 5% traffic to canary
        - pause: {}          # Manual approval gate
        - setWeight: 20     # 20% traffic
        - pause: {duration: 10}  # 10-minute automatic pause
        - setWeight: 50     # 50% traffic
        - analysis:
            templates:
              - templateName: success-rate
            args:
              - name: service-name
                value: my-service
        - setWeight: 100    # Full rollout
      canaryMetadata:
        labels:
          role: canary
      stableMetadata:
        labels:
          role: stable
```

**Automated Canary Analysis with Argo Rollouts:**

Define analysis templates that run during canary progression:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  args:
    - name: service-name
  metrics:
    - name: success-rate
      interval: 1m
      successCondition: result[0] >= 0.95
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus:9090
          query: |
            sum(rate(http_requests_total{service="{{args.service-name}}",status!~"5.."}[1m]))
            /
            sum(rate(http_requests_total{service="{{args.service-name}}"}[1m]))
```

### 7.3 — Supply Chain Security

**SBOM (Software Bill of Materials):**

Generate and sign SBOMs for every deployment artifact:

```bash
# Generate SBOM using Syft
syft packages dir:. -o json > sbom.json

# Sign SBOM using Cosign
cosign sign --yes sbom.json
```

**SLSA (Supply Chain Levels for Software Artifacts):**

Implement SLSA levels 1-3:
- SLSA Level 1: Provenance generated, easily available
- SLSA Level 2: Provenance signed by build service
- SLSA Level 3: Provenance sealed, build service hardened

**Cosign for Artifact Signing:**

```bash
# Sign a container image
cosign sign --yes my-registry/my-image:v1.0.0

# Verify an image
cosign verify my-registry/my-image:v1.0.0

# Sign OCI artifacts (SBOMs, signatures)
cosign attach sbom --sbom sbom.json my-registry/my-image:v1.0.0
```

**Trivy for Vulnerability Scanning:**

```bash
# Scan container image
trivy image my-registry/my-image:v1.0.0

# Scan running containers
trivy k8s cluster

# Scan infrastructure as code
trivy config --severity HIGH,CRITICAL ./infrastructure
```

### 7.4 — Deployment Security Best Practices

**Secrets Management in CI/CD:**

- Never store secrets in Git (even encrypted)
- Use secret management services: HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager
- Pass secrets to CI using environment variables or secrets injection
- Rotate secrets regularly (90-day rotation policy)
- Audit secret access in CI logs

**CI/CD Pipeline Security Checklist:**

```
[ ] No secrets in Git history (git-secrets or pre-commit hooks)
[ ] All container images scanned for vulnerabilities in CI
[ ] All container images signed after successful CI
[ ] All artifacts verified against SBOM before deployment
[ ] Deployment uses ephemeral credentials (no long-lived secrets)
[ ] CI/CD system logs are centralized and retained
[ ] Access to CI/CD follows least privilege principle
[ ] Two-person rule for production deployments (if required)
[ ] Deployment requires successful CI run (no manual overrides)
```


## 9 — APPENDIX: CHEAT SHEETS AND QUICK REFERENCES

### 9.1 — Deployment Strategy Quick Reference

| Strategy | Downtime | Cost | Rollback Speed | Risk |
|----------|----------|------|----------------|------|
| Blue/Green | Zero | 2x during deploy | Instant | Medium |
| Canary | Zero | Minimal extra | Fast (flag off) | Low |
| Rolling | Zero (with health checks) | Minimal | Medium (re-deploy) | Low |
| Recreate | Yes (downtime) | Minimal | Fast (re-deploy old) | High |
| Shadow | Zero | 2x during test | Instant | Very Low |

### 9.2 — Rollback Decision Tree

```
Deployment fails?
|
+-- YES -> Is it SEV1/SEV2 (user impact)?
|         |
|         +-- YES -> Immediate rollback
|         |
|         +-- NO -> Can you diagnose in 15 minutes?
|                   |
|                   +-- YES -> Fix and redeploy
|                   |
|                   +-- NO -> Rollback
|
+-- NO -> Monitor for 15 minutes
         |
         +-- Metrics degraded?
         |         |
         |         +-- YES -> Rollback
         |         |
         |         +-- NO -> Sign off deployment
         |
         +-- Metrics stable -> Sign off deployment
```

### 9.3 — Release Checklist (GitHub Actions Workflow Template)

```yaml
name: Release Checklist

on:
  pull_request:
    branches: [main]

jobs:
  pre-release-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Check conventional commits
        run: |
          commits=$(git log --pretty=format:"%s" main..HEAD)
          if ! echo "$commits" | grep -qE "^(feat|fix|perf|refactor):"; then
            echo "No feature/fix/perf/refactor commits found"
            exit 1
          fi

      - name: Verify changelog updated
        run: |
          if ! git diff --name-only | grep -q CHANGELOG.md; then
            echo "CHANGELOG.md not updated"
            exit 1
          fi

      - name: Run release validation
        run: ./scripts/release-validate.sh
```

---

## End of DevOps Engineer SKILL.md
