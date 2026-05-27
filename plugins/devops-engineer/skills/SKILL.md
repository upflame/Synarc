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

---

## P2: Philosophy

### The CALMS Framework

CALMS is the foundational framework for assessing and guiding DevOps adoption across an organization. Each dimension represents a critical capability.

#### Culture

Culture is the most important and most difficult dimension. DevOps culture is characterized by:

- **Psychological safety** — Team members feel safe to take risks, admit mistakes, and ask questions without fear of blame.
- **Collaboration** — Dev, Ops, QA, and Security work as a single team with shared goals and shared responsibility.
- **Trust** — Teams are empowered to make decisions and deploy to production without excessive approval processes.
- **Experimentation** — Failure is treated as a learning opportunity, not a career-limiting event. Blameless postmortems are standard practice.
- **Continuous improvement** — Kaizen mindset. Small, incremental improvements are made constantly rather than large, infrequent transformations.

Culture manifests in CI/CD through:
- Developers can deploy their own code without handoffs to a separate operations team
- Pipeline failures are visible to everyone and fixed by the team that caused them
- Post-incident reviews focus on system improvements, not individual blame
- Teams celebrate deployment velocity, not just uptime

#### Automation

Automation is the elimination of manual, repetitive, and error-prone work in the delivery process. Key areas include:

- **Build automation** — Every commit triggers an automated build. No manual compilation.
- **Test automation** — Unit, integration, contract, and end-to-end tests run automatically.
- **Deployment automation** — Every deployment is performed by the pipeline, not by engineers SSHing into servers.
- **Environment provisioning** — Environments are created and destroyed automatically.
- **Configuration management** — Configuration changes are automated, not performed manually.
- **Security scanning** — SAST, DAST, SCA, and container scanning are automated gates in the pipeline.
- **Compliance validation** — Policy as code automates compliance checks.

The goal is to automate everything except decisions that require human judgment (and even those should be informed by automated data).

#### Lean

Lean principles from manufacturing applied to software delivery:

- **Eliminate waste** — Identify and remove activities that do not add value: waiting for approvals, manual testing, handoffs between teams, rework from defects, partially done work, task switching.
- **Amplify learning** — Short feedback loops enable rapid learning. Deploy frequently to learn from real user behavior.
- **Decide as late as possible** — Keep options open. Use feature flags to defer deployment decisions. Make irreversible decisions as late as possible.
- **Deliver as fast as possible** — Cycle time is the ultimate metric. Everything should be optimized for speed of delivery.
- **Empower the team** — Those closest to the work should make decisions about how the work is done.
- **Build integrity in** — Quality is built in, not inspected at the end. Automated gates prevent defects from progressing.
- **See the whole** — Optimize the entire value stream, not individual silos.

Lean in CI/CD:
- Minimize queue time between pipeline stages
- Parallelize independent work
- Reduce batch sizes (smaller PRs, more frequent deployments)
- Visualize the pipeline (Kanban boards, pipeline dashboards)
- Limit work in progress (WIP limits on deployments)

#### Measurement

What gets measured gets improved. DevOps measurement focuses on:

- **DORA metrics** — Deployment frequency, lead time for changes, mean time to recover, change failure rate.
- **Flow metrics** — Cycle time, throughput, WIP, queue depth.
- **Quality metrics** — Defect escape rate, test coverage, flaky test rate, mean time to detect.
- **Performance metrics** — Build time, deploy time, pipeline duration, resource utilization.
- **Business metrics** — Feature adoption, revenue per deploy, customer satisfaction.

Measurement should be:
- **Automated** — Metrics are collected and reported automatically, not manually.
- **Visible** — Dashboards make metrics accessible to everyone.
- **Actionable** — Metrics drive improvements, not just reporting.
- **Trended** — Look at direction and rate of change, not just absolute values.

#### Sharing

Knowledge and responsibility must be shared across the organization:

- **Shared ownership** — Dev and Ops share responsibility for the entire lifecycle.
- **Cross-functional teams** — Teams contain all the skills needed to design, build, deploy, and operate their services.
- **Documentation** — Runbooks, architecture decisions, and operational knowledge are documented and accessible.
- **Mentoring** — Experienced team members mentor others in DevOps practices.
- **Communities of practice** — DevOps champions across teams share patterns and learnings.
- **Open source** — Internal tooling is shared internally as inner source. External tools are contributed back to the community.

Sharing in CI/CD:
- Pipeline templates are shared across teams
- Deployment runbooks are accessible to all developers
- Postmortems are shared broadly
- Metrics and dashboards are visible organization-wide

### The Three Ways

Gene Kim's \\"The Phoenix Project\\" introduced the Three Ways as the philosophical underpinnings of DevOps.

#### First Way: Flow / Systems Thinking

**Principle:** Optimize the flow of work from development through operations to the customer.

**Practices:**
- Make work visible (Kanban boards, value stream mapping)
- Reduce batch sizes (smaller commits, more frequent deployments)
- Limit WIP (focus on finishing, not just starting)
- Eliminate bottlenecks (find and address constraints in the pipeline)
- Reduce handoffs (cross-functional teams, shared responsibility)
- Automate repetitive work (build, test, deployment automation)
- Standardize tooling (consistent CI/CD platform across teams)

**Anti-patterns:**
- Large, infrequent deployments with many changes
- Separate Dev and Ops teams with a wall between them
- Manual handoffs and approval processes that create wait states
- Snowflake environments that are different from production
- Long-lived feature branches that diverge from mainline

**Value stream mapping for CI/CD:**
1. Map the current delivery process from idea to production
2. Identify every step, queue, handoff, and delay
3. Measure the time spent in each step vs. waiting between steps
4. Identify the constraint (the slowest step or biggest bottleneck)
5. Design the target state that eliminates waste and optimizes flow
6. Implement improvements and measure the impact

#### Second Way: Feedback

**Principle:** Amplify feedback loops to enable fast, continuous learning and improvement.

**Practices:**
- **Immediate feedback** — Developers get test results within minutes, not hours.
- **Production visibility** — Developers can see how their changes behave in production.
- **Monitoring and alerting** — Detect problems before users do.
- **Blameless postmortems** — Learn from failures without fear.
- **Feature flag telemetry** — Measure the impact of new features in real time.
- **A/B testing** — Compare old and new behavior to validate changes.
- **Security feedback** — Vulnerability scans provide immediate feedback to developers.
- **Deployment notifications** — Teams are notified of successful and failed deployments.

**Feedback loop categories:**

| Loop | Timing | Purpose |
|---|---|---|
| Commit → Test results | Minutes | Code correctness |
| PR → Review feedback | Hours | Code quality |
| Deploy → Monitoring | Minutes | Production behavior |
| Feature flag → Analytics | Real-time | Business impact |
| Incident → Postmortem | Days | Organizational learning |
| Release → User feedback | Weeks | Product direction |

**Shortening feedback loops:**
- Reduce test execution time (parallelize, optimize slow tests)
- Provide faster compute for builds and tests
- Implement incremental builds and test selection
- Use real-time monitoring and alerting
- Provide self-service access to production data and logs
- Automate rollback to reduce time to recover

#### Third Way: Continuous Learning / Experimentation

**Principle:** Create a culture of continuous experimentation and learning.

**Practices:**
- **Blameless postmortems** — Focus on systems, not people. Action items improve the system.
- **Chaos engineering** — Intentionally inject failures to test resilience.
- **Game days** — Practice incident response in controlled conditions.
- **Innovation time** — Allocate time for experimentation and learning.
- **Communities of practice** — Share knowledge across teams.
- **Conference attendance** — Learn from the broader industry.
- **Internal tech talks** — Share knowledge within the organization.
- **Readmes and runbooks** — Document operational knowledge.
- **Post-incident reviews** — Each incident is an opportunity to learn and improve.

**Learning culture indicators:**
- Teams run game days and chaos experiments
- Postmortems result in actionable system improvements
- Engineers spend time on learning and experimentation
- New tools and practices are evaluated and adopted
- Mistakes are shared and learned from, not hidden

**Experimentation in CI/CD:**
- Pipeline experiments can be run in parallel with production pipelines
- Feature flags enable gradual rollout and rollback
- Canary deployments provide real-world validation
- A/B testing infrastructure enables product experiments
- Pipeline performance metrics drive continuous improvement
### DevOps Culture in Practice

#### Blameless Postmortems

Structure:
1. **Timeline** — What happened, when, and who was involved
2. **Impact** — What was the user or business impact
3. **Detection** — How was the incident detected? Could it have been detected faster?
4. **Root cause** — What were the contributing factors? (Not just the surface cause)
5. **Resolution** — How was the incident resolved? Could it have been resolved faster?
6. **Action items** — System improvements that prevent recurrence or reduce impact
7. **Follow-up** — Track action items to completion

Key rules:
- No blame, shame, or punishment
- Assume good intent from everyone involved
- Focus on the system, not the individual
- Action items must be specific, measurable, and assigned
- Share postmortems broadly for organizational learning

#### Psychological Safety

Creating psychological safety in the CI/CD context:
- Pipeline failures are not blamed on individuals
- Developers are empowered to roll back their own changes
- Anyone can propose improvements to the pipeline
- Experimentation is encouraged even when it fails
- Errors are viewed as learning opportunities
- Junior engineers are mentored, not criticized

#### DevOps Topologies

According to Matthew Skelton and Manuel Pais (Team Topologies):

| Topology | Description | When to Use |
|---|---|---|
| Dev and Ops Collaboration | Dev and Ops collaborate closely | Small teams, early DevOps adoption |
| Shared Ops | Ops team provides platform and guidance | Medium organizations |
| DevOps-as-a-Service | Central DevOps team builds platform for product teams | Large organizations with many teams |
| SRE Team | Dedicated SRE team focuses on reliability | High-reliability requirements |
| Platform Team | Builds internal developer platform | Organizations with significant platform needs |
| Cloud Enablement Team | Helps teams adopt cloud practices | Cloud migration phase |

The DevOps Engineer role typically belongs to a **DevOps-as-a-Service** or **Platform Team** that provides the delivery infrastructure while enabling product teams to own their deployments.

#### Conway's Law

\\"Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations.\\"

Implications for CI/CD:
- If your pipeline mirrors your organizational silos, it will have the same handoffs and delays
- Cross-functional teams produce better, faster pipelines
- The pipeline should be owned by the teams that use it, not by a separate operations group
- Shared services (artifact registry, secret management) should have clear ownership
- Communication patterns between teams are reflected in pipeline interfaces and contracts

#### Inverse Conway Maneuver

Restructure teams to produce the desired system architecture:
- Want microservices? Create teams that own individual services end-to-end
- Want fast deployments? Eliminate the separation between Dev and Ops
- Want self-service? Create a platform team that treats developers as customers
- Want security integrated? Embed security engineers in delivery teams

### DevOps Transformation

#### Maturity Model

| Level | Characteristics |
|---|---|
| **Level 0 — Initial** | Manual builds and deployments. No CI/CD. Long release cycles (months). No automation. No metrics. |
| **Level 1 — Repeatable** | Basic CI pipeline. Automated builds and unit tests. Manual deployments. Some documentation. |
| **Level 2 — Defined** | Standardized CI/CD pipeline. Automated deployments to non-production. Release branches. Basic metrics. |
| **Level 3 — Managed** | Continuous delivery. Automated deployments to production. Feature flags. Canary deployments. DORA metrics tracked. |
| **Level 4 — Optimizing** | Self-service platform. Teams deploy independently. Fully automated with security gates. Culture of experimentation. |
| **Level 5 — Transformative** | DevOps is embedded in how the organization works. Continuous improvement is automatic. Industry-leading DORA metrics. |

#### Transformation Anti-patterns

- **DevOps team as a silo** — Creating a DevOps team that does operations for everyone recreates the silo problem.
- **Tool-first transformation** — Buying tools without changing culture and processes. Tools enable, but culture transforms.
- **Big bang transformation** — Trying to change everything at once. Start small, prove value, expand.
- **DevOps as a title** — Renaming sysadmins to DevOps engineers without changing how they work.
- **Ignoring security** — Fast deployments that bypass security controls create risk. Shift left, don\\'t skip security.
- **Metrics as weapon** — Using DORA metrics to punish teams instead of enabling improvement.
- **Copy-paste culture** — Adopting practices from other organizations without understanding the context.
- **Automation without standardization** — Automating chaotic processes just makes chaos faster.

#### Starting a DevOps Transformation

1. **Assess current state** — Value stream mapping, maturity assessment, pain point identification
2. **Identify value stream** — Pick one team and one service to pilot the transformation
3. **Set goals** — Define measurable targets (e.g., deploy frequency from monthly to weekly)
4. **Implement CI** — Automated builds, unit tests, and linting on every commit
5. **Implement CD** — Automated deployment to non-production, then production
6. **Add feedback** — Monitoring, alerting, metrics dashboards
7. **Scale** — Expand to more teams with shared patterns and templates
8. **Optimize** — Measure, learn, improve continuously

---

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

---
## P4: Version Control Strategy

### Branching Strategies Compared

#### Trunk-Based Development

**Concept:** All developers work on a single branch (trunk/main/master). Short-lived feature branches (less than one day) are optional. Releases are created from the trunk.

**Characteristics:**
- Main branch is always deployable
- Feature branches last hours, not days
- Feature flags control incomplete features
- Continuous integration merges to main multiple times per day
- Release branches only for LTS or hotfix scenarios

**Advantages:**
- Simplest branching model
- Fastest feedback loops
- Enables continuous delivery
- Less merge conflict complexity
- No long-lived branches to diverge
- Feature flags provide fine-grained control

**Disadvantages:**
- Requires feature flag infrastructure
- Requires disciplined team culture
- Harder to manage multiple parallel releases
- Teams must handle integration continuously

**Implementation:**
- Feature: branch from main, merge to main within 1 day
- Fix: branch from main, merge to main, cherry-pick to release
- Release: tag from main
- No develop, staging, or release branches by default

#### GitHub Flow

**Concept:** Simplified branching model where feature branches are created from main, reviewed via PR, and merged back to main. Main is always deployable.

**Characteristics:**
- Main branch is the source of truth
- Feature branches for all changes
- Pull requests for code review
- Deploy from main after merge
- Releases are tags on main

**Advantages:**
- Simple, easy to understand
- GitHub-native workflow
- PR-based collaboration
- Continuous deployment friendly

**Disadvantages:**
- No separation between staging and production branches
- Can be challenging for release coordination
- Not ideal for complex release schedules

**Implementation:**
- Feature: branch from main, PR to main
- Fix: branch from main, PR to main
- Release: tag on main

#### Git Flow

**Concept:** Multiple permanent branches for different purposes: master, develop, feature, release, hotfix.

**Characteristics:**
- master — Production releases
- develop — Integration branch for features
- feature/* — Feature development, branched from develop
- release/* — Release preparation, branched from develop, merged to master and develop
- hotfix/* — Emergency fixes, branched from master, merged to master and develop

**Advantages:**
- Clear separation of concerns
- Good for scheduled releases
- Supports multiple parallel versions
- Well-documented and understood

**Disadvantages:**
- Complex, many branches to manage
- Not suitable for continuous delivery
- Merge overhead (merging in both directions)
- Release branches create integration delays
- Can lead to long-lived feature branches

**Implementation:**
- Feature: branch from develop, PR to develop
- Release: branch from develop, merge to master + tag, merge back to develop
- Hotfix: branch from master, merge to master + tag, merge back to develop

#### GitLab Flow

**Concept:** Environment branches + feature branches. Main branch, pre-production branch, production branch.

**Characteristics:**
- main — Latest code
- pre-production — Staging validation
- production — Production releases
- Feature branches merge to main
- Main merges to pre-production
- Pre-production merges to production

**Advantages:**
- Environment-based flow
- Clear promotion path
- Good for regulated environments
- Supports release branches

**Disadvantages:**
- Merge propagation overhead
- Can be slow for emergency fixes
- Requires discipline to keep branches in sync

**Implementation:**
- Feature: branch from main, PR to main
- Promotion: main -> pre-production -> production
- Hotfix: branch from production, PR to production, cherry-pick back

### Monorepo vs. Multi-Repo

#### Monorepo

**Single repository containing multiple projects/services.**

**Advantages:**
- Shared code and tooling
- Atomic commits across projects
- Simplified dependency management
- Consistent versioning
- Easier refactoring across boundaries
- Single CI/CD configuration
- Code review and discovery is easier

**Disadvantages:**
- Repository size grows large
- CI/CD needs to detect affected projects
- More complex access control
- Requires specialized tooling (Bazel, Nx, Turborepo)
- Build times can be longer without optimization
- Single point of failure (one repo issue blocks everyone)

**Tooling:**
- Build systems: Bazel, Nx, Turborepo, Lage, Lerna
- CI optimization: nx affected, bazel query, build caching
- Code ownership: CODEOWNERS file
- Path-based CI triggers

**When to use monorepo:**
- Shared codebase with many interdependencies
- Organization with strong standardization
- Teams that coordinate frequently
- Early-stage startups with few teams

#### Multi-Repo

**Each project/service has its own repository.**

**Advantages:**
- Independent versioning and releases
- Simplified access control
- Smaller repository sizes
- Team autonomy
- Independent CI/CD pipelines
- No single point of failure

**Disadvantages:**
- Duplicated code and configuration
- Cross-repo changes are harder
- Inconsistent tooling and practices
- Harder to discover code
- Dependency management is more complex
- Integration testing across repos is difficult

**Tooling:**
- Package managers: npm, pip, maven, go modules
- Cross-repo CI: GitHub Actions workflow_call, pipeline triggers
- Version management: release-please, changesets, semantic-release
- API contracts: OpenAPI, protobuf, contract testing

**When to use multi-repo:**
- Independent services with clear boundaries
- Teams that operate autonomously
- External-facing libraries/SDKs
- Organizations with strong separation of concerns

#### Hybrid Approach

**Single repository for related projects, separate repositories for unrelated ones.**

**Best practices:**
- Co-locate tightly coupled services in a monorepo
- Separate loosely coupled services into their own repos
- Use a package registry for shared libraries
- Standardize CI/CD across all repos
- Use tooling to manage cross-repo changes (release-please)

### Branching Pattern Decisions

#### When to Branch

| Scenario | Branch? | Alternative |
|---|---|---|
| New feature (1-2 days) | Branch from main | Feature flag on main |
| New feature (1-2 weeks) | Branch from main with frequent merges | Decompose into smaller changes |
| Bug fix | Branch from main | Direct commit for urgent fixes |
| Experimental change | Branch from main | Separate fork/clone |
| Security fix | Branch from base, merge back | Coordinated release |
| Configuration change | Direct commit to main | PR for review |
| Documentation change | Direct commit to main | PR for review |

#### Branch Naming Conventions

Standardized naming improves automation and readability:

feature/TICKET-123-description
bugfix/TICKET-456-description
hotfix/TICKET-789-description
release/v1.2.3
chore/TICKET-012-description
experiment/ml-model-v2

#### Branch Protection Rules

Essential for maintaining main branch quality:

- Required status checks: build, test, lint, security scan
- Required pull request reviews: 1-2 depending on risk
- Dismiss stale reviews: true
- Require up-to-date branches: true
- Require signed commits: true (for compliance)
- Include administrators: true
- Restrictions on push: specific teams only
- Lock branch: for release branches after release

### Commit Practices

#### Conventional Commits

Structured commit messages that enable automated versioning and changelog generation:

<type>(<scope>): <description>

[optional body]
[optional footer(s)]

**Types:**
- feat: — New feature (MINOR version bump)
- fix: — Bug fix (PATCH version bump)
- docs: — Documentation changes
- style: — Code formatting, no logic change
- refactor: — Code refactoring
- perf: — Performance improvement
- test: — Adding or fixing tests
- build: — Build system changes
- ci: — CI/CD configuration changes
- chore: — Maintenance tasks
- revert: — Revert a previous commit

**Breaking changes:**
feat!: change API endpoint format
BREAKING CHANGE: The /api/v1/users endpoint now returns paginated results.

**Automated versioning with conventional commits:**
- fix -> PATCH version (1.0.0 -> 1.0.1)
- feat -> MINOR version (1.0.0 -> 1.1.0)
- Any with ! or BREAKING CHANGE -> MAJOR version (1.0.0 -> 2.0.0)

#### Commit Granularity

- Each commit should represent a single logical change
- \\"Atomic commits\\" — one change per commit
- Avoid \\"fix typo\\" or \\"WIP\\" commits in shared branches
- Squash merge for feature branches
- Rebase to maintain clean history

#### Commit Signing

- GPG or SSH signing for commit authenticity
- Required in regulated environments
- Verifiable chain of custody
- Tools: git commit -S, gpg, ssh-keygen

### Merge Strategies

| Strategy | Command | History | Best For |
|---|---|---|---|
| Merge commit | git merge --no-ff | Preserves branch structure | Feature branches, collaboration |
| Squash merge | git merge --squash | Single commit per feature | Clean history, simple projects |
| Rebase merge | git rebase then merge | Linear history | Individual work, small teams |

**Recommendations:**
- Use squash merge for feature branches (clean history, single atomic commit)
- Use merge commits for collaborative branches (preserves attribution)
- Avoid rebasing shared branches (causes history divergence)
- Enable \\"Require linear history\\" in branch protection for compliance

### Tagging Strategy

#### Semantic Versioning Tags

v1.2.3
v1.2.3-alpha.1
v1.2.3-beta.1
v1.2.3-rc.1

#### Tag Placement

- Tags on main for releases
- Tags on specific commits for hotfixes
- Annotated tags (git tag -a) for releases
- Lightweight tags for build markers

#### Tag Hygiene

- Delete stale tags
- Protect release tags from deletion
- Use CI to create and manage tags
- Verify tag authenticity (signed tags)

---

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

---

## P6: Artifact Management

### Container Registry

**Purpose:** Store and distribute container images.

**Tools:** Docker Hub, Amazon ECR, Google Artifact Registry, Azure Container Registry, GitHub Container Registry, GitLab Container Registry, Harbor, Quay, Nexus, Artifactory

**Key features:**
- Immutable tags for release artifacts
- Vulnerability scanning integration
- Image signing with cosign/notary
- Access control and authentication
- Geo-replication for distributed teams
- Retention policies for cleanup
- Proxy/cache for upstream registries
- Webhook notifications for image events

#### Registry Organization

registry.example.com/
  team-a/
    service-a:1.2.3
    service-a:latest
  team-b/
    service-b:1.0.0
    service-b:production
  shared/
    base-images/
      java17-base:1.0.0
    tool-images/
      ci-agent:2.1.0

#### Image Tagging Strategy

- **Release tags:** v1.2.3, 1.2.3, production-20240101
- **Build tags:** build-1234, sha-abc1234
- **Environment tags:** staging, production (moving tags)
- **Metadata tags:** linux-amd64, debug
- **Branch tags:** main, feature-x (for development)

#### Immutable Tags

- Release tags are immutable and never overwritten
- Environment tags (staging, production) are mutable but tracked
- Use OCI referrers for attestations and signatures

### Package Registry

**Purpose:** Store and distribute language-specific packages.

**Tools:** npm registry, PyPI, Maven Central, NuGet Gallery, Artifactory, Nexus, GitHub Packages, GitLab Package Registry, AWS CodeArtifact

**Package types:**
- npm packages (JavaScript/TypeScript)
- PyPI packages (Python)
- Maven artifacts (Java)
- NuGet packages (.NET)
- Ruby gems
- Go modules
- Debian/APT packages
- RPM packages
- Helm charts

#### Registry Organization

npm registry:
@myorg/
  service-a-client
  service-b-client
  shared-utils

PyPI:
myorg-service-a-client
myorg-service-b-client
myorg-shared-utils

#### Package Versioning

- Follow semantic versioning (semver)
- Pre-release versions for testing: 1.0.0-alpha.1, 1.0.0-beta.2
- Build metadata for reproducibility: 1.0.0+build.1234
- Deprecate and yank broken versions
- Retention policies for old versions

### Artifact Versioning

#### Versioning Schemes

**Semantic Versioning (SemVer):**
MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: incompatible API changes
- MINOR: backward-compatible functionality
- PATCH: backward-compatible bug fixes

**CalVer (Calendar Versioning):**
YYYY.MM.PATCH (e.g., 2024.01.1)
- Good for projects with regular releases
- Quickly identifies release age

**Git SHA-based:**
git-<sha> (e.g., git-a1b2c3d4)
- Fully reproducible
- No semantic meaning
- Not human-readable for releases

**Combined:**
v1.2.3+build.20240101.1234
- SemVer + build metadata
- Full traceability
- Most informative

#### Versioning in CI/CD

- Manual via release tool (release-please, semantic-release)
- Automated via conventional commits
- CI-based version detection (branch, tag, SHA)

### Artifact Promotion

#### Promotion Process

1. **Build** — Create artifact with unique version
2. **Publish** — Store in artifact registry with build tag
3. **Validate** — Run tests and scans on the artifact
4. **Promote** — Tag artifact for environment (staging, production)
5. **Verify** — Confirm artifact in target environment
6. **Retire** — Remove or deprecate old artifacts

#### Promotion Metadata

Each promotion should record:
- Who promoted (user or pipeline)
- When promoted (timestamp)
- From where (source environment)
- To where (target environment)
- Validation results (test results, approvals)
- Artifact digest (SHA256)

### Artifact Retention

#### Retention Policies

- **Development artifacts:** 7-30 days
- **Staging artifacts:** 30-90 days
- **Production artifacts:** 6-12 months or longer
- **Security-scanned artifacts:** Per compliance requirements
- **Latest N versions:** Keep last N versions regardless of age

#### Cleanup Automation

- Scheduled cleanup jobs
- Policy-based deletion (age, count, environment)
- Dry-run mode for validation
- Audit log for deletions
- Grace period before permanent deletion

### Artifact Signing

#### Signing Tools

- **cosign** — Container image signing (Sigstore)
- **gpg** — General-purpose signing
- **jarsigner** — Java JAR signing
- **npm** — Package signing (integrity hashes)
- **PyPI** — Package signing (GPG)
- **Notary** — Docker content trust

#### Signing Process

1. Generate signing key pair
2. Store private key securely (HSM, cloud KMS)
3. Sign artifact in CI pipeline
4. Store signature alongside artifact
5. Verify signature before deployment
6. Rotate keys periodically

#### Sigstore / cosign

- Keyless signing using OIDC
- Transparency log for signature verification
- No key management overhead
- Integrates with GitHub Actions, GitLab CI

### SBOM Generation

#### SBOM Formats

- **SPDX** — Software Package Data Exchange
- **CycloneDX** — OWASP CycloneDX
- **SWID** — Software Identification Tag

#### SBOM Generation

Tools: syft, trivy, cyclonedx-bom, spdx-sbom-generator

#### SBOM Storage

- Alongside artifact in registry (OCI referrers)
- In artifact metadata database
- In compliance evidence store
- Signed and timestamped

---

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

---

## P8: Deployment Automation

### Zero-Downtime Deployment

#### Principles

- No user-facing downtime during deployment
- New and old versions coexist during transition
- Users are not interrupted during the deployment
- Rollback is immediate if problems are detected
- Database schema changes are backward-compatible

#### Techniques

| Technique | Downtime | Complexity | Rollback | Cost |
|---|---|---|---|---|
| Rolling update | None | Low | Gradual | Low |
| Blue-green | None | Medium | Instant | Medium |
| Canary | None | High | Instant | High |
| A/B testing | None | High | Instant | Medium |
| Feature flags | None | Medium | Instant | Low |

### Blue-Green Deployment

#### Concept

Two identical environments (Blue and Green). At any time, one environment (Blue) serves production traffic. The new version is deployed to the inactive environment (Green). After validation, traffic is switched from Blue to Green. Blue becomes the new standby.

Before: Traffic -> Blue (v1.0), Green (v1.0) — idle
During: Traffic -> Blue (v1.0), Deploy v1.1 to Green, Run smoke tests on Green
Switch: Traffic -> Green (v1.1), Blue (v1.0) — standby
After: Traffic -> Green (v1.1), Blue (v1.0) — idle

#### Implementation

1. Deploy new version to inactive environment
2. Run health checks on inactive environment
3. Run smoke tests on inactive environment
4. Switch traffic load balancer from active to inactive
5. Monitor new environment for errors
6. Keep old environment running for rollback
7. After confirmation period, tear down old environment

**Benefits:**
- Instant switch (or near-instant)
- Easy rollback (switch back)
- Validate before user-facing
- No version mixing during deployment

**Drawbacks:**
- Double infrastructure cost during deployment
- Database schema compatibility required
- Stateful services need special handling
- Switch can cause connection reset. Handle this by draining connections gracefully before switch, using connection draining on load balancers (set timeout to 60 seconds), and implementing client-side retry logic with exponential backoff for connection reset errors.
- Requires duplicate environment capacity (2x resource cost)

**Database Schema Compatibility in Blue/Green:**

Blue/green deployment requires backward-compatible database migrations because both environments share the same database temporarily:

1. Add-only migrations: Add columns with NULL defaults or add tables. Never remove or rename in a single deploy.
2. Two-phase migrations: Phase 1 (backward-compatible) deploys with blue running. Phase 2 (dependent on new code) deploys with green running.
3. Expand-contract pattern: Expand (add new) -> Migrate data -> Contract (remove old).
4. Feature flags: Gate new schema usage behind flags so old code can still function.

**Rollback Protocol for Blue/Green:**

If post-deployment validation fails, the rollback procedure is:
1. Switch load balancer back to previous environment (blue)
2. Redeploy previous known-good version to inactive environment
3. Run smoke tests on inactive environment
4. Validate rollback succeeded before notifying stakeholders
5. Post-incident review within 24 hours

### 4.7 — Canary Releases

**Concept:** Gradually shift production traffic from old to new version. Start with 5% traffic on new version, monitor error rates, progressively increase to 100%.

**Traffic Shifting Stages:**

| Stage | Traffic % | New Version | Duration | Gate Criteria |
|-------|-----------|-------------|----------|---------------|
| 0 | 0% | - | Baseline | Collect 1-hour baseline metrics |
| 1 | 5% | v1.1 | 15-30 min | Error rate < baseline + 0.1%, p99 latency < baseline + 50ms |
| 2 | 20% | v1.1 | 30-60 min | Error rate < baseline + 0.05%, p99 latency < baseline + 30ms |
| 3 | 50% | v1.1 | 1-2 hours | Error rate < baseline, p99 latency < baseline + 20ms |
| 4 | 100% | v1.1 | - | Fully shifted, monitor for 24 hours |

**Canary Analysis Framework:**

Automated canary analysis checks these metrics in the canary stage vs baseline:
- Error rate (4xx, 5xx) — critical threshold: +0.1% triggers automatic rollback
- Latency (p50, p95, p99) — critical threshold: +50ms triggers investigation
- Throughput (requests/second) — ensure load is comparable between stages
- Business metrics (conversion, revenue per session) — if available
- Custom metrics (specific to the service being deployed)

**Canary Failure Response:**

When canary metrics breach thresholds:
1. Automatic rollback if critical threshold breached
2. Alert on-call engineer with canary failure context
3. Capture canary environment state for post-mortem
4. Do not proceed to next stage until root cause resolved
5. Document incident in deployment log

### 4.8 — Rolling Deployments

**Concept:** Gradually replace instances running old version with instances running new version. Zero downtime if health checks are properly configured. Cost-efficient (no duplicate infrastructure).

**Rolling Update Process:**

1. Set maxUnavailable and maxSurge on deployment strategy
2. Kubernetes rolling update: maxUnavailable=0, maxSurge=1 for zero-downtime
3. Each rolling step: terminate old instance, launch new instance, wait for health check
4. Continue until all instances are running new version
5. Validate with smoke tests between batches

**Rolling Deployment Configuration:**

```yaml
# Kubernetes RollingUpdate strategy
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0   # Zero downtime — no unavailable pods during update
    maxSurge: 1        # One extra pod during update — temporary cost increase
```

**Rollback for Rolling Deployments:**

Rolling deployment rollback is the same process in reverse — update to the previous version. Use revision history:
```bash
# Check rollout history
kubectl rollout history deployment/my-service

# Rollback to previous revision
kubectl rollout undo deployment/my-service

# Rollback to specific revision
kubectl rollout undo deployment/my-service --to-revision=2
```

### 4.9 — Feature Flag-Driven Deployments

**Concept:** Decouple deployment from release. Deploy code behind feature flags. Enable flags progressively. A/B testflags. Kill switches for instant rollback.

**Feature Flag Architecture:**

```
Code Commit -> Build -> Deploy (disabled) -> Enable Flag -> Traffic -> Full Rollout
                                    |
                                    v (flag off by default)
                              Users see old behavior
```

**Feature Flag Decision Framework:**

| Scenario | Approach |
|----------|----------|
| New feature with gradual rollout | Percentage rollout flag |
| Dark launch / silent feature | Internal flag, monitor before enabling |
| A/B testing two implementations | Experiment flag with multiple variants |
| Kill switch for emergency disable | Boolean flag with dashboard access |
| Operational control | Configurable threshold flag |
| User-specific features | User ID-based flag targeting |

**Feature Flag Management:**

- Use a dedicated feature flag service (LaunchDarkly, Split, Unleash, Flagsmith, or self-hosted OpenFeature)
- Centralize flag management — all flags visible in single dashboard
- Enforce naming conventions: `{environment}_{feature_name}_{variant}`
- Set default state to disabled in production
- Remove technical debt: archive flags after full rollout + 30-day observation period

**Feature Flag Operational Playbook:**

When enabling a feature flag:
1. Pre-enablement: Verify target environment matches expected state
2. Enable to 0% (sanity check — checks flag service connectivity)
3. Enable to 1% (internal users or test accounts)
4. Monitor for 15 minutes — error rates, latency, business metrics
5. Progressive enablement: 1% -> 10% -> 25% -> 50% -> 100%
6. Between each stage: 10-15 minutes monitoring
7. Full rollout: mark rollout complete, schedule flag retirement

When disabling a feature flag (kill switch):
1. Immediately disable flag to 0% or remove targeting
2. All traffic reverts to baseline behavior
3. Alert on-call: flag kill switch activated
4. Investigate root cause
5. Re-enable only after root cause resolved

### 4.10 — Deployment Verification Gates

**Pre-Deployment Gates:**

| Gate | Threshold | Blocking |
|------|-----------|----------|
| Unit test pass rate | ≥ 95% | Yes |
| Code coverage | ≥ 80% | No |
| Security scan | 0 critical/high CVEs | Yes |
| License scan | 0 disallowed licenses | Yes |
| Build artifacts | All artifacts signed | Yes |

**Post-Deployment Gates:**

| Gate | Threshold | Action if Failed |
|------|-----------|-----------------|
| Smoke tests | 100% pass | Auto-rollback |
| Health check endpoint | HTTP 200 within 60s | Alert, manual review |
| Error rate | < baseline + 0.5% | Alert, monitor |
| p99 latency | < baseline + 100ms | Alert, monitor |
| Canary analysis | Pass all metrics | Proceed |

---

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

---

## 6 — POST-DEPLOYMENT OPERATIONS

### 6.1 — Immediate Post-Deployment Monitoring

**0-15 Minutes Post-Deployment:**

Monitor these dashboards continuously:
- Error rate (5xx, 4xx) — should not increase
- Latency (p50, p95, p99) — should stay within SLO
- Throughput — should match pre-deployment levels
- Business metrics — conversion, signups, transactions
- Infrastructure metrics — CPU, memory, disk, network
- Application logs — watch for new error patterns

**Deployment Sign-Off Checklist:**

```
[ ] 15-minute monitoring window passed without critical alerts
[ ] Error rate within acceptable threshold (< baseline + threshold)
[ ] Latency within SLO (< SLO target)
[ ] Throughput at expected level (> baseline * 0.95)
[ ] No new error patterns in application logs
[ ] Business metrics within expected range
[ ] Smoke tests passed
[ ] Deployment documented in change management system
```

### 6.2 — Deployment Incident Response

**When Deployment Causes an Incident:**

1. **Initiate incident response** if user-facing impact detected
2. **Immediate rollback** — do not wait to diagnose when users are impacted
3. **Communicate** — update status page, notify stakeholders
4. **Investigate in parallel** with rollback
5. **Do not re-deploy** until root cause is understood

**Deployment Incident Severity Classification:**

| Severity | Impact | Response Time | Example |
|----------|--------|---------------|---------|
| SEV1 | Complete outage | Immediately (< 5 min) | Site down, all users impacted |
| SEV2 | Major degradation | < 15 min | Feature broken for subset of users |
| SEV3 | Minor degradation | < 1 hour | Non-critical feature impacted |
| SEV4 | Minimal impact | Next business day | Cosmetic issues, minor bugs |

### 6.3 — Deployment Post-Mortem

**Post-Mortem Triggers:**

- Any SEV1 or SEV2 deployment incident
- Rollback triggered within 24 hours of deployment
- User-reported bug affecting > 1% of users
- Performance regression > 20% affecting users

**Post-Mortem Template:**

```markdown
# Deployment Incident Post-Mortem

**Date:** YYYY-MM-DD
**Duration:** HH:MM to HH:MM (X hours Y minutes)
**Severity:** SEV[X]
**Deploy Version:** v[X.X.X]
**Rollback Required:** Yes/No

## Summary
One-paragraph description of what happened, the impact, and the resolution.

## Impact
- Users affected: [number/percentage]
- Revenue impact: [if applicable]
- Duration: [how long users were impacted]

## Root Cause
Detailed explanation of what caused the incident.

## Timeline
- HH:MM — Event 1
- HH:MM — Event 2
- HH:MM — Event 3
- HH:MM — Resolution

## Detection
How was the incident detected? (monitoring alert, user report, etc.)

## Response
How was the incident responded to? (rollback, hotfix, etc.)

## Action Items
- [AI-001] Short description — Owner — Due date
- [AI-002] Short description — Owner — Due date

## Lessons Learned
What went well? What did not go well? What would we do differently?

## Follow-up
Links to any follow-up tickets, PRs, or documentation updates.
```

---

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

---

## 8 — DEPLOYMENT METRICS AND REPORTING

### 8.1 — Deployment Metrics Framework

**Deployment Health Metrics:**

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Deployment frequency | Daily or more | Less than weekly |
| Lead time for changes | < 1 hour | > 1 day |
| Change failure rate | < 5% | > 15% |
| Mean time to recovery | < 1 hour | > 4 hours |
| Rollback rate | < 10% | > 25% |

**DORA Metrics (DevOps Research and Assessment):**

Track the four DORA metrics:
1. **Deployment Frequency:** How often code is deployed to production
2. **Lead Time for Changes:** Time from commit to production deployment
3. **Change Failure Rate:** Percentage of deployments causing failures
4. **Mean Time to Recovery:** Time to recover from a deployment failure

**Elite performers achieve:**
- Deploy multiple times per day
- Lead time < 1 hour
- Change failure rate < 5%
- MTTR < 1 hour

### 8.2 — Deployment Analytics

**Metrics to Track Per Deployment:**

- Deployment duration (start time to completion)
- Rollback count and rate
- Error rate before vs after deployment
- Latency before vs after deployment
- Throughput before vs after deployment
- Business metrics before vs after deployment
- Time spent on deployment activities ( DevOps metrics)

**Deployment Efficiency Funnel:**

```
Commits -> Builds -> Tests -> Staging Deploy -> Production Deploy
[100%]   [95%]    [90%]   [80%]              [75%]
                                                        |
                                          Drop-off points reduce efficiency
```

Use this funnel to identify bottleneck areas in the delivery pipeline.

### 8.3 — Continuous Improvement

**Deployment Review Process:**

Monthly deployment review:
1. Review all deployments from the past month
2. Identify failed deployments and root causes
3. Calculate DORA metrics for the month
4. Identify bottleneck areas in pipeline
5. Create action items for process improvements
6. Review and retire old deployment patterns
7. Update runbooks with lessons learned

---

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
