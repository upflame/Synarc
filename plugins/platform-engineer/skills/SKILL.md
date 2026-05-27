---
id: platform-engineer-skill
name: Platform Engineer
version: 1.0.0
description: Comprehensive platform engineering skill covering IDP architecture, developer portals, golden paths, DX measurement, self-service infrastructure, platform adoption, and platform operations.
author: Synarc
tags:
  - platform-engineering
  - developer-experience
  - idp
  - developer-portal
  - golden-paths
  - paved-roads
  - platform-as-product
  - dora-metrics
  - space-framework
  - service-catalog
  - backstage
  - self-service
  - platform-api
  - product-thinking
  - developer-productivity
  - platform-maturity
  - cost-allocation
  - platform-security
  - template-scaffolding
  - inner-loop
  - outer-loop
  - platform-teams
  - build-vs-buy
prerequisites:
  - synarc-core
  - devops-engineer
min-line-count: 10000
max-line-count: 15000
---

# Platform Engineering SKILL

## Table of Contents

1.  [P1: Persona — The Platform Engineer](#p1-persona--the-platform-engineer)
2.  [P2: Philosophy — Platform Engineering Foundations](#p2-philosophy--platform-engineering-foundations)
3.  [P3: IDP Architecture — Internal Developer Platform](#p3-idp-architecture--internal-developer-platform)
4.  [P4: Golden Paths — Paved Roads Methodology](#p4-golden-paths--paved-roads-methodology)
5.  [P5: Developer Experience — DX Measurement & Improvement](#p5-developer-experience--dx-measurement--improvement)
6.  [P6: Self-Service — Infrastructure & Service Automation](#p6-self-service--infrastructure--service-automation)
7.  [P7: Platform Adoption — Product Thinking & Community](#p7-platform-adoption--product-thinking--community)
8.  [P8: Platform Operations — Reliability, Cost & Security](#p8-platform-operations--reliability-cost--security)
9.  [P9: Worked Examples — 12+ Deep-Dive Scenarios](#p9-worked-examples--12-deep-dive-scenarios)
10. [P10: Anti-Patterns — What NOT To Do](#p10-anti-patterns--what-not-to-do)
11. [P11: Quality Gates — Checks & Balances](#p11-quality-gates--checks--balances)

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

# P1: Persona — The Platform Engineer

---

## 1.1 Role Definition

The Platform Engineer is a multiplier. Every line of code, every terraform module, every Backstage plugin, every golden path template, every API endpoint they build is designed to be leveraged by dozens or hundreds of application developers across multiple product teams. The Platform Engineer does not ship application features. They ship capabilities. They ship leverage.

The Platform Engineer sits at the intersection of product thinking, systems engineering, developer experience, and operational excellence. They are not simply an infrastructure engineer who writes YAML. They are a product engineer whose customers are developers. They understand that developer experience is user experience, that friction is a bug, and that every manual step a developer must take is a tax on organizational velocity.

A Platform Engineer must think about abstraction without leakage. They must build interfaces so good that developers never need to think about what lies beneath. They must provide escape hatches for the 10% of cases that cannot follow the golden path, while simultaneously making the golden path so obviously superior that no rational developer would choose the escape hatch.

## 1.2 Core Responsibilities

1. Platform Strategy & Vision — Define the platform roadmap aligned with organizational goals. Make build-vs-buy decisions. Evangelize platform engineering across the organization.

2. Developer Portal Design & Maintenance — Own the developer portal (Backstage, Port, or custom). Maintain the software catalog, software templates, scorecards, tech documentation, and API gateway.

3. Golden Path Definition & Evolution — Define, document, and evolve paved roads for common developer workflows. Maintain reference architectures. Ensure default choices are safe, compliant, and performant.

4. Developer Experience Measurement — Implement DORA metrics collection, SPACE framework surveys, friction logging, and developer productivity dashboards. Use data to drive platform improvements.

5. Self-Service Infrastructure — Build and maintain self-service infrastructure provisioning, service scaffolding, CI/CD generation, secret management, and access management.

6. Platform API Design — Design and maintain platform APIs that abstract underlying infrastructure complexity. Manage API versioning, deprecation, and SDK generation.

7. Platform Adoption & Community — Treat developers as users. Conduct user research. Build feedback loops. Write documentation. Run office hours. Grow platform adoption through product thinking.

8. Service Catalog Ownership — Maintain the service catalog entity model. Own ownership, lifecycle, metadata, compliance, and relationship mapping.

9. Template & Scaffolding Development — Build and maintain cookiecutters, generators, and scaffolding automation for new services, libraries, and infrastructure components.

10. Platform Reliability — Define and monitor platform SLOs. Ensure multi-tenancy isolation. Maintain platform stability. Own the shared responsibility model between platform and application teams.

11. Cost Allocation & Transparency — Implement metering, chargeback/showback models, and cost transparency dashboards for platform usage.

12. Platform Security — Implement RBAC, multi-tenancy isolation, secrets management, compliance gates, audit trails, and policy as code for the platform layer.

## 1.3 The Platform Engineering Mindset

Product over project. The platform is never done. It is a living product that requires ongoing investment, maintenance, and iteration. Platform Engineers ship features, fix bugs, prioritize a backlog, and measure user satisfaction just like any product team.

Default to self-service. If a developer needs to open a ticket, the platform has failed. Every capability should be accessible through the developer portal, CLI, or API without human intervention.

Abstraction with escape hatches. The platform should abstract complexity, not choice. Developers should not need to understand Kubernetes to deploy a service. But when they need to configure a specific sidecar or tune a performance parameter, the platform should provide a safe, documented path to do so.

Bias for platform over process. If you need a five-page wiki and a three-person approval chain to deploy a service, you have a process problem disguised as a governance problem. The right solution is platform guardrails -- automated policy enforcement, not manual review.

Measurement before improvement. You cannot improve what you do not measure. Platform teams must instrument everything -- time to provision, time to deploy, time to onboard, developer satisfaction scores, platform uptime, platform adoption rates.

Opinionated but extensible. The platform must make default choices that are correct for 90% of use cases. It must also provide well-documented extension points for the 10% that need something different.

## 1.4 Day in the Life

A Platform Engineer day typically includes:

- Reviewing platform adoption metrics and developer satisfaction survey results
- Triaging platform support requests from developer teams
- Pairing with a product team to understand a new workflow need and designing a golden path
- Writing a new software template for a Backstage plugin deployment
- Reviewing a pull request on a terraform module used by 40 service teams
- Conducting user research interviews with developers to understand friction points
- Updating platform documentation based on developer feedback
- Improving DORA metrics collection pipeline
- Designing a new platform API endpoint for service provisioning
- Participating in platform team standup and product team sync
- Writing runbooks for platform incidents
- Evaluating a third-party tool for the platform ecosystem

## 1.5 Skills & Competencies

Engineering Skills:
- Infrastructure as Code (Terraform, Pulumi, Crossplane, CDK)
- Kubernetes ecosystem (containers, orchestration, service mesh, operators)
- Backstage plugin development and customization
- API design and development (REST, gRPC, GraphQL)
- CI/CD systems (GitHub Actions, GitLab CI, ArgoCD, Tekton)
- Programming languages (TypeScript, Go, Python)
- Database and messaging systems
- Observability stack (Prometheus, Grafana, Loki, Tempo, OpenTelemetry)

Product Skills:
- User research and developer interviews
- Product roadmap management
- Prioritization frameworks (RICE, MoSCoW, opportunity scoring)
- Adoption metrics and analytics
- Developer experience measurement
- Documentation and technical writing

Soft Skills:
- Technical communication and evangelism
- Cross-team collaboration
- Mentoring and knowledge sharing
- Change management
- Stakeholder management
- Community building

## 1.6 Platform Engineer vs Adjacent Roles

| Dimension | Platform Engineer | DevOps Engineer | SRE | Architect |
|-----------|------------------|-----------------|-----|-----------|
| Primary Customer | Application Developers | The Organization | Operations | Leadership |
| Output | Capabilities, leverage | Pipelines, automation | Reliability, uptime | Decisions, standards |
| Focus | Developer Experience | Delivery Pipeline | Production Operations | System Design |
| Time Horizon | Quarter-to-Year | Week-to-Quarter | Minute-to-Day | Year-to-Decade |
| Success Metric | Developer Productivity | Deployment Frequency | SLO Attainment | Technical Debt Reduction |
| Product Thinking | Essential | Secondary | Secondary | Secondary |
| Portal/Catalog | Owns | Consumes | Consumes | Consumes |

## 1.7 The Platform Promise

The platform team job is to make the right thing the easy thing.

This is the core promise of platform engineering. When a developer needs to create a new service, deploy to production, configure a database connection, add authentication, set up monitoring, manage secrets, or any of the hundreds of tasks in the modern software delivery lifecycle, the platform should provide a path that is:
1. Discoverable -- The developer knows where to go and what to do
2. Safe -- Following the path produces a compliant, secure, observable result
3. Fast -- The path minimizes time-to-value for the developer
4. Documented -- The path has clear, up-to-date documentation
5. Measured -- The path usage and outcomes are tracked
6. Evolving -- The path improves over time based on feedback and data

## 1.8 When You Need a Platform Engineer

Your organization likely needs platform engineering when:
- Developer onboarding takes weeks instead of days
- Each team has a unique deployment pipeline
- Infrastructure knowledge is concentrated in a few individuals
- Security and compliance audits require disproportionate effort
- Developers complain about operations work distracting from feature delivery
- Cross-team collaboration is hindered by tooling fragmentation
- Production incidents are hard to debug due to inconsistent observability
- The same infrastructure problems are solved repeatedly by different teams
- Platform tooling is treated as a cost center rather than a product

## 1.9 Platform Engineering Maturity Levels for the Individual

Level 1: Platform Consumer -- Understands the platform from the developer perspective. Can scaffold a service, deploy through the golden path, use the developer portal, and contribute minor fixes to platform tooling.

Level 2: Platform Contributor -- Can build and maintain specific platform components. Writes terraform modules, Backstage plugins, software templates. Understands the platform architecture and can troubleshoot common issues.

Level 3: Platform Owner -- Owns one or more platform domains. Makes design decisions, manages stakeholders, drives adoption, measures success. Can build new golden paths from scratch. Mentors Level 1 and Level 2 engineers.

Level 4: Platform Strategist -- Defines platform vision and strategy. Makes build-vs-buy decisions. Influences organizational structure to enable platform success. Evangelizes platform engineering externally. Defines the platform maturity model for the organization.

---

# P2: Philosophy -- Platform Engineering Foundations

---

## 2.1 What Is Platform Engineering?

Platform engineering is the discipline of designing, building, and maintaining internal developer platforms (IDPs) that provide self-service capabilities, golden paths, and paved roads for software delivery teams. It applies product management principles to the internal development experience, treating developers as customers and the platform as a product.

Platform engineering emerged as a response to the cognitive load problem in modern software development. As organizations adopted cloud, containers, microservices, and DevOps practices, the cognitive burden on developers exploded. Each team became responsible not just for writing code but for Kubernetes manifests, terraform configurations, CI/CD pipelines, monitoring dashboards, alerting rules, secret management, service meshes, and more.

The platform engineering response is: abstract that complexity. Provide a curated, opinionated, and well-supported set of tools and services that handle the common infrastructure concerns so developers can focus on business logic.

## 2.2 The Cognitive Load Argument

The fundamental argument for platform engineering rests on cognitive load theory. Every developer has a finite capacity for information processing. Every tool, framework, and process they need to understand consumes bandwidth that could otherwise go toward solving business problems.

Cognitive load in software delivery can be categorized as:

Intrinsic Cognitive Load -- The inherent complexity of the problem being solved. A developer building a real-time payments system must understand transactional semantics, idempotency, reconciliation, and regulatory compliance. This load cannot be reduced without reducing the complexity of the problem.

Extraneous Cognitive Load -- The unnecessary complexity imposed by tools, processes, and environment. A developer who needs to understand Kubernetes RBAC, Terraform state management, ArgoCD sync strategies, Vault policies, and Prometheus relabeling before they can deploy a service is experiencing extraneous cognitive load. This load can and should be reduced by the platform.

Germane Cognitive Load -- The productive mental effort of learning patterns that accelerate future work. A developer learning the golden path for service deployment is investing in germane cognitive load -- once learned, the pattern applies to all future deployments.

Platform engineering targets extraneous cognitive load. Every abstraction, every golden path, every self-service capability is designed to reduce the number of things a developer needs to think about to deliver value.

## 2.3 Platform as Product

The most important mental model shift in platform engineering is viewing the platform as a product rather than a project.

Project Mentality:
- The platform has a start date and an end date
- Success is measured by delivery milestones
- The team moves on to the next project after launch
- Developers are expected to adapt to the platform
- Documentation is a delivery artifact
- The platform is a cost center

Product Mentality:
- The platform has ongoing investment and iteration
- Success is measured by adoption, satisfaction, and business outcomes
- The team continuously improves the platform based on feedback
- The platform adapts to developer needs
- Documentation is a living resource
- The platform is a value center that multiplies organizational velocity

Product thinking for platforms means:
- User research -- Regularly talk to developers to understand their pain points
- Personas -- Define developer personas with different needs and workflows
- Journey mapping -- Map the developer journey from onboarding to production
- Metrics -- Measure adoption, satisfaction, time-to-value, friction
- Backlog -- Maintain a prioritized backlog of platform features and improvements
- Roadmap -- Communicate the platform vision and upcoming changes
- Feedback loops -- Make it easy for developers to request features and report issues
- Release notes -- Productize platform changes with clear communication

## 2.4 The Platform Engineering Trinity: People, Process, Technology

Platform engineering is not just about technology choices. It requires alignment across three dimensions:

People:
- Platform team structure and composition
- Skills development and training
- Career paths for platform engineers
- Community management and developer relations
- Stakeholder management and executive sponsorship

Process:
- Product management practices for the platform
- Feedback collection and prioritization
- Release management and change control
- Incident management for platform components
- Onboarding and offboarding workflows
- Cost allocation and chargeback models

Technology:
- Developer portal and service catalog
- Infrastructure provisioning and management
- CI/CD pipeline generation
- Observability and monitoring
- Secrets and access management
- API gateway and platform APIs
- Template and scaffolding systems

## 2.5 Platform Team Topologies

Team Topologies, by Matthew Skelton and Manuel Pais, provides the foundational model for platform team organization. The key concepts relevant to platform engineering:

Enabling Teams -- Help other teams acquire capabilities. An enabling platform team might pair with a product team to help them adopt a new golden path, or run workshops on platform usage.

Complicated Subsystem Teams -- Own a subsystem that requires specialized expertise. A platform security team that manages secrets infrastructure is a complicated subsystem team.

Stream-Aligned Teams -- Aligned to a single value stream. A platform team might be organized as a stream-aligned team for the developer value stream.

Platform Teams -- A specific type of enabling team that builds and maintains the internal developer platform. The platform team purpose is to reduce the cognitive load of other teams by providing self-service capabilities.

Platform Team Interaction Modes:
- Collaboration -- Platform team works closely with application teams for discovery and design
- X-as-a-Service -- Platform team provides services that application teams consume through APIs and portals
- Facilitating -- Platform team helps application teams learn and adopt platform capabilities

## 2.6 Team Topologies for Platform Teams

The Platform Team as an Enabling Team -- The platform team focuses on capability-building across the organization. They build platform components and also actively help teams adopt them through pairing, workshops, and documentation. This works well for organizations new to platform engineering.

The Platform Team as a Stream-Aligned Team -- The platform team is organized around the developer experience value stream. They own the developer portal, golden paths, and self-service capabilities end-to-end. This works well for organizations where the platform is mature and has clear ownership.

The Platform Team as a Complicated Subsystem Team -- The platform team owns specific complicated subsystems (e.g., the service mesh, the secrets infrastructure, the CI/CD orchestrator). Other teams interact with these subsystems through APIs rather than owning them directly. This works well for complex technical domains that require deep specialization.

The Guild Model -- In addition to a dedicated platform team, organizations often benefit from a platform guild -- a cross-functional community of practice that includes developers from application teams. The guild shares knowledge, collects feedback, advocates for platform improvements, and helps govern platform evolution.

## 2.7 Platform as a Product: Key Concepts

User Personas:
- The Full-Stack Developer -- Wants to write code, deploy, and iterate quickly
- The SRE/Operations Engineer -- Needs production access, observability tooling, runbooks
- The Data Engineer -- Needs specialized infrastructure for data processing, storage, and ML
- The Platform Engineer -- Uses the platform to build the platform
- The Security Engineer -- Reviews platform compliance, needs audit logs and policy enforcement
- The Engineering Manager -- Cares about team productivity, onboarding time, dev satisfaction

Jobs to Be Done:
- When I need to create a new service, I want to scaffold it from a template so I do not miss any compliance requirements
- When I need to deploy a change, I want it to go through automated validation so I have confidence it will not break production
- When I need to debug a production issue, I want to access logs and metrics without switching between five different tools
- When I need to understand my service dependencies, I want to see them in a visual catalog so I can assess impact

## 2.8 The Platform Contract

Every platform component makes implicit or explicit promises to its users. The platform contract defines these promises:

API Contract -- The platform API behavior, including endpoints, request/response formats, error handling, rate limits, and versioning policy.

Service Level Objectives -- The platform performance and availability guarantees for each capability.

Onboarding Commitment -- What a developer can expect when adopting a platform capability, including documentation, support, and expected time to proficiency.

Deprecation Policy -- How platform teams communicate and execute deprecation of platform capabilities, including minimum notice periods and migration support.

Cost Commitment -- What a team can expect to pay for platform usage, expressed as cost per unit of consumption.

Security Commitment -- What security controls the platform provides and what the consuming team is responsible for.

Support Model -- How developers get help with platform issues, including response time SLAs, escalation paths, and self-service support resources.

## 2.9 Platform Coherence

A coherent platform has internal consistency. Components work together seamlessly. Data flows between systems. The mental model a developer builds for one platform capability is applicable to others.

Signs of Platform Incoherence:
- Different authentication mechanisms for different platform components
- Logging into the cloud provider console for some operations and using the portal for others
- Inconsistent naming conventions across platform tools
- Different deployment processes for different types of services
- Multiple tools that do the same thing without clear guidance on which to use
- Documentation is scattered across wikis, READMEs, and portals

Building Platform Coherence:
- Define and enforce naming conventions across all platform components
- Implement single sign-on for all platform tools
- Establish consistency reviews for new platform features
- Create a platform design system with reusable UI components
- Document the mental model of how platform components relate

## 2.10 Platform Governance vs Gatekeeping

A common tension in platform engineering is governance versus gatekeeping:

Gatekeeping -- Controlling access by requiring manual approval. Example: Only platform engineers can create Kubernetes namespaces. The request goes through a ticket system, takes three days, and often leaves the developer wondering about the delay.

Governance -- Controlling outcomes through automated policy enforcement. Example: Any developer can create a namespace, but the platform automatically applies network policies, resource quotas, label enforcement, and compliance scans. The policy is encoded in the platform, not in a human approval process.

Platform engineering biases toward governance over gatekeeping. The principle is that the platform should enforce constraints automatically through technology rather than manually through process.

However, governance without escape hatches is tyranny. The platform must provide documented, audited mechanisms for teams to request exceptions when their needs genuinely diverge from the golden path.

## 2.11 The Platform Platform

Platform teams benefit from platform engineering too. The platform platform includes:
- Internal CI/CD pipelines for platform component delivery
- Testing frameworks for platform components
- Observability for platform usage and health
- Documentation generators and documentation as code
- Version management for platform components
- Feature flags for gradual platform capability rollout
- Incident management for platform-level incidents

## 2.12 Strangler Fig for Platform Migration

When migrating from legacy infrastructure to a platform-managed model, the strangler fig pattern applies:
1. Identify a developer workflow that is currently manual and painful
2. Build a platform capability that provides a better path for this workflow
3. Make the new path discoverable and attractive
4. Support both the old and new paths during migration
5. Gradually sunset the old path as adoption of the new path grows
6. Celebrate each workflow migration as a platform milestone

## 2.13 Platform Economics

Platform engineering requires investment. Understanding the economics helps make the case:

Costs:
- Platform team headcount (salaries, recruiting, training)
- Infrastructure for platform components (portal, CI/CD runners, artifact storage)
- Third-party tooling and SaaS subscriptions
- Developer time learning and using the platform
- Migration costs from legacy to platform-managed

Benefits:
- Reduced time-to-production for new services
- Reduced developer onboarding time
- Reduced cognitive load on developers
- Standardized security and compliance posture
- Reduced duplication of infrastructure tooling across teams
- Improved developer satisfaction and retention
- Faster feature delivery through standardized CI/CD
- Reduced production incidents through standardized observability

Platform ROI Calculation:
A simplified ROI model:
- Calculate average developer hourly cost (fully loaded)
- Estimate hours saved per developer per week through platform automation
- Multiply by number of developers to get total organizational hours saved
- Compare with platform team cost

For example: 100 developers x 5 hours saved per week x 50 weeks x $100/hour = $2.5M/year saved. A platform team of 6 costing $1.2M/year gives $1.3M/year net benefit.

## 2.14 Build vs Buy Decision Framework

One of the most critical platform engineering decisions is whether to build or buy platform components.

| Factor | Favor Build | Favor Buy |
|--------|-------------|-----------|
| Differentiation | Core to competitive advantage | Commodity capability |
| Integration | Deep integration required | Standard integration suffices |
| Speed | Need it now, can build fast | Available immediately off-the-shelf |
| Expertise | Strong internal expertise | Weak internal expertise |
| Maintenance | Willing to maintain long-term | Prefer vendor to manage |
| Customization | Highly specific requirements | Requirements align to standard features |
| Scale | Very large or specific scale | Standard enterprise scale |
| Vendor Risk | Low tolerance for vendor dependency | Acceptable vendor dependency |

Build When:
- The capability is core to your platform value proposition
- You need deep integration with existing systems that no vendor supports
- You have specific security, compliance, or regulatory requirements
- You want full control over the feature roadmap
- The open-source ecosystem provides a solid foundation you can extend

Buy When:
- The capability is a commodity (most organizations need it, little differentiation)
- A vendor offers a solution that meets 80% of requirements
- Speed to market is critical and building would delay platform launch
- Your team lacks the expertise to build the capability well
- The scope of maintenance and ongoing development exceeds your capacity

The Middle Path: Extend Open Source:
- Developer portal: Extend Backstage
- Service catalog: Extend Backstage catalog
- IaC orchestration: Extend Crossplane or Terraform Operator
- CI/CD: Extend Tekton, ArgoCD, GitHub Actions
- Security policies: Extend OPA/Gatekeeper
- Observability: Extend Prometheus/Grafana

## 2.15 Platform Maturity Model

The platform maturity model helps organizations assess where they are and where they need to go:

Level 1: Ad-Hoc
- No dedicated platform team
- Infrastructure is managed per-team or per-project
- No developer portal or service catalog
- Deployments are manual or use team-specific scripts
- Security reviews are manual and point-in-time
- No standardization across teams
- Developer onboarding takes weeks

Level 2: Repeatable
- A dedicated (often part-time) platform team exists
- Some standardized templates for common infrastructure
- Basic CI/CD pipelines defined
- Documentation exists but is fragmented
- Some teams use common tooling, others do not
- Developer onboarding takes days to a week
- Platform work is reactive and ticket-driven

Level 3: Defined
- Dedicated full-time platform team
- Developer portal is deployed with basic service catalog
- Golden paths defined for common workflows
- Self-service infrastructure provisioning for most common scenarios
- Standardized CI/CD with automated quality gates
- DORA metrics are collected and visible
- Developer onboarding takes 1-2 days
- Regular developer surveys and feedback collection

Level 4: Managed
- Platform team uses product management practices
- Developer portal is fully adopted with deep integrations
- Golden paths cover 80%+ of developer workflows
- Self-service covers infrastructure, pipelines, secrets, access
- Platform cost allocation is implemented
- DORA metrics drive continuous improvement
- Developer satisfaction is measured and trending upward
- Platform SLOs are defined and monitored
- Platform roadmap is published and communicated

Level 5: Optimized
- Platform is a competitive advantage for the organization
- AI-assisted platform interactions
- Predictive analytics for developer productivity
- Continuous experiment-driven platform improvement
- Automated compliance and policy enforcement
- Self-service extends to the full software lifecycle
- Platform provides proactive recommendations

---

# P3: IDP Architecture -- Internal Developer Platform

---

## 3.1 What Is an Internal Developer Platform?

An Internal Developer Platform (IDP) is a cohesive set of tools, services, and automation that application teams use to build, deploy, and operate software without needing to understand or interact with the underlying infrastructure. The IDP is the sum of the platform capabilities, exposed through a consistent interface.

The IDP is not any single tool. It is the integration layer that connects:
- Infrastructure provisioning (compute, storage, networking)
- CI/CD pipelines (build, test, deploy)
- Service catalog and discovery
- Security and compliance controls
- Observability and monitoring
- Secrets and configuration management
- Developer documentation
- Cost tracking and allocation

The IDP presents these capabilities through multiple channels:
- A developer portal (Backstage, Port, custom)
- CLI tools (backstage-cli, custom platform CLI)
- API endpoints (REST, gRPC)
- IDE plugins and extensions
- ChatOps interfaces (Slack, Teams bots)
- Git-based workflows (GitOps, PR-driven)

## 3.2 IDP Core Components

### 3.2.1 Developer Portal

The developer portal is the front door to the platform. It provides:
- Software Catalog -- A centralized inventory of all services, resources, teams, and their relationships
- Software Templates -- Self-service scaffolding for new services, components, and infrastructure
- TechDocs -- Integrated technical documentation with a consistent template and discovery
- Scorecards -- Automated evaluation of services against platform standards
- API Surface -- Both visual and API-based access to platform capabilities
- Plugins -- Extensible plugin system for custom capabilities

Leading solutions: Backstage (open-source), Port, Cortex, Atlassian Compass, OpsLevel

### 3.2.2 Platform Orchestrator

The orchestrator manages the lifecycle of developer requests. It:
- Receives requests from the portal, CLI, API, or Git
- Validates request parameters and policies
- Coordinates multiple infrastructure and integration systems
- Monitors request progress and reports status
- Handles failures, retries, and rollbacks

The orchestrator is the brain of the IDP. It is typically implemented as a workflow engine or event-driven system.

### 3.2.3 Integration Layer

The integration layer connects the orchestrator to backend systems:
- Compute -- Kubernetes clusters, serverless platforms, container runtimes
- Networking -- Service mesh (Istio, Linkerd), ingress controllers, DNS, TLS
- Storage -- Database provisioning, object storage, cache systems
- CI/CD -- Build systems, artifact registries, deployment pipelines
- Observability -- Metrics, logs, traces, alerting, dashboards
- Secrets -- Vault, cloud secret managers, encryption key management
- Identity -- SSO, RBAC, service accounts, OIDC providers

## 3.3 Developer Portal Deep Dive: Backstage

Backstage is an open platform for building developer portals, originally created by Spotify and now a CNCF project. It is the most widely adopted developer portal framework.

### 3.3.1 Backstage Architecture

Backstage follows a plugin-based architecture:

Frontend Layer:
- Core UI framework built on React and Material UI
- Plugin system that allows independent frontend extensions
- App-wide features: search, notifications, settings, user management

Backend Layer:
- Plugin backend services that serve frontend plugins
- Catalog backend for entity management
- Scaffolder backend for template execution
- TechDocs backend for documentation building and serving
- Authentication and authorization backend

Data Layer:
- PostgreSQL database for catalog and plugin data
- Optional: Elasticsearch for search indexing
- File storage for TechDocs artifacts

### 3.3.2 Backstage Catalog Entity Model

Backstage uses a YAML-based entity model. Each entity has:
- apiVersion -- The version of the entity specification
- kind -- The entity type (Component, API, Resource, System, Group, User, Template, Location)
- metadata -- name, namespace, title, description, labels, annotations, tags, links
- spec -- Type-specific specification fields
- relations -- Relationships with other entities

Entity Kinds:

Component -- A software component (service, library, website, CLI tool). Subtypes: service, library, website, documentation, cli, other.

API -- An API exposed by a component. Can be defined in OpenAPI, GraphQL, gRPC, or other formats.

Resource -- Infrastructure resources consumed by components: databases, queues, storage buckets, caches, topics, ML models.

System -- A collection of components, APIs, and resources that work together to provide a capability.

Group -- An organizational entity (team, squad, chapter, guild).

User -- A person who interacts with the platform.

Template -- A software template used for scaffolding new entities.

Location -- A way to group entities together, typically pointing to a directory or file.

### 3.3.3 Catalog Ingestion

Entities can be ingested into Backstage through multiple methods:
- File-based ingestion -- YAML files stored in repositories (catalog-info.yaml)
- API-based ingestion -- Custom processors that push entities through the catalog API
- Provider-based ingestion -- Built-in or custom entity providers that poll external systems
- GitHub/GitLab integration -- Automatic discovery of repositories as components

### 3.3.4 Backstage Software Templates

Templates enable self-service scaffolding:
1. Developer selects a template from the Backstage UI
2. Template collects parameters through a step-by-step form
3. Scaffolder action executes: fetches template files, runs transformations, creates repository
4. Optionally triggers CI/CD pipeline to deploy the scaffolded service
5. Resulting service appears in the software catalog with ownership metadata

### 3.3.5 Backstage TechDocs

TechDocs provides documentation-as-code within Backstage:
- Write documentation in Markdown alongside your source code
- TechDocs plugin renders documentation with a consistent look and feel
- mkdocs-based build process generates static documentation
- Documentation is per-service and versioned alongside the code
- Search across all documentation is built-in

### 3.3.6 Backstage Scorecards

Scorecards evaluate services against defined standards. Example scorecard criteria:
- Has a defined owner in the catalog
- Has a production-ready CI/CD pipeline
- Has at least 80% test coverage
- Has documented on-call rotation
- Has security scanning configured
- Has SLOs defined and monitored
- Has cost tags applied
- Has documentation linked
- Has at least one on-call responder

Scorecards can be used to:
- Onboard new services to platform standards
- Drive compliance and governance
- Identify services needing attention
- Provide a single health score for each service

## 3.4 IDP Integration Patterns

### 3.4.1 GitOps Integration

The IDP integrates with GitOps tools (ArgoCD, Flux) through:
- Template generates Kubernetes manifests as part of scaffolding
- Developer portal shows deployment status by querying ArgoCD API
- Template can configure GitOps repository structure
- Scorecards can evaluate GitOps configuration compliance

### 3.4.2 CI/CD Integration

The IDP integrates with CI/CD systems through:
- Templates generate CI/CD pipeline configuration
- Portal shows pipeline status and history for each service
- Pipeline success/failure updates service catalog metadata
- Pipeline steps collect DORA metrics
- Security scanning results flow back into scorecards

### 3.4.3 Observability Integration

The IDP integrates with observability systems through:
- Portal shows service health metrics and SLO attainment
- Portal links to the appropriate dashboard for each service
- Template configures monitoring, alerting, and logging
- Service catalog stores ownership for on-call routing

### 3.4.4 Secrets Management Integration

The IDP integrates with secrets management through:
- Template requests secret provisioning as part of scaffolding
- Portal shows which secrets are configured for each service
- Platform API manages secret rotation policies
- Access to secrets is governed by RBAC through the portal
- Audit logging for secret access

### 3.4.5 Cost Management Integration

The IDP integrates with cost management through:
- Portal shows cost attribution for each service
- Template tags resources for cost allocation
- Platform enforces budget limits and sends alerts
- Cost dashboards are per-team in the portal
- Chargeback/showback data flows through the service catalog

## 3.5 IDP as a Platform for Integrations

The IDP should be designed with integration in mind:
- Plugin architecture -- The portal should support custom plugins for new capabilities
- API-first -- Every platform capability should have a well-defined API
- Event-driven -- Platform events should be published to an event bus
- Webhook support -- External systems should be able to react to platform events
- Extensible data model -- The service catalog should support custom entity types and metadata

## 3.6 IDP Deployment Topologies

Single-Cluster, Single-Tenant -- One IDP instance for the entire organization. Suitable for organizations with fewer than 500 developers, single cluster or cloud account, early-stage platform maturity.

Multi-Cluster, Single-Tenant -- One IDP instance managing multiple Kubernetes clusters. Suitable for organizations with dev/staging/prod cluster separation, multi-region deployments, compliance-driven environment isolation.

Multi-Tenant IDP -- Multiple IDP instances for different business units, compliance zones, or geographic regions. Suitable for large enterprises with distinct business divisions, regulated industries, organizations with 1000+ developers.

## 3.7 Backstage Setup and Configuration

### 3.7.1 Deployment Options

- App deployment -- Self-hosted Backstage application in your infrastructure
- Managed Backstage -- Services that host Backstage for you (Roadie, KintoHub)
- Backstage as a Service -- Commercial Backstage offerings

### 3.7.2 Plugin Management

Plugins extend Backstage with new capabilities:
```bash
# Install a plugin
yarn add --cwd packages/app @backstage/plugin-jenkins
```

### 3.7.3 Custom Plugin Development

A custom Backstage plugin follows this structure:
```
plugins/my-plugin/
  src/
    components/
      MyPluginPage.tsx
      MyPluginCard.tsx
      MyPluginTable.tsx
    api/
      MyPluginApi.ts
      MyPluginClient.ts
    routes.ts
    plugin.ts
    index.ts
    setupTests.ts
  package.json
  README.md
```

## 3.8 Alternative Developer Portals

### 3.8.1 Port

Port is a developer portal platform with a focus on:
- Visual data modeling
- Self-service actions
- Scorecards
- Integrations with common tools
- Low-code setup

Port is appropriate when you want faster time-to-value than Backstage, have less platform engineering capacity, or prefer visual configuration over code.

### 3.8.2 Cortex

Cortex focuses on service quality and reliability:
- Service Catalog with rich metadata
- Deep scorecard engine
- Service maturity tracking
- Incident response integration
- Resource management

Cortex is appropriate when service quality scorecards are your primary concern.

### 3.8.3 OpsLevel

OpsLevel focuses on service maturity and team health:
- Automated service discovery
- Customizable maturity rubrics
- Team ownership tracking
- DORA metrics collection

## 3.9 IDP as a Platform for AI/ML Workflows

Modern IDPs must support ML/AI workflows alongside traditional software delivery:

ML-Specific Platform Needs:
- ML environment provisioning (GPU nodes, TPUs, specialized hardware)
- Experiment tracking and model registry integration
- Feature store provisioning
- Model serving infrastructure
- Data pipeline orchestration
- ML artifact storage
- Model monitoring and observability

Platform Extensions for ML:
- Backstage entity types for ML models, datasets, experiments
- Templates for ML service scaffolding
- Integration with MLflow, Kubeflow
- Scorecards for ML model governance
- Resource quotas for GPU/TPU allocation

## 3.10 IDP Security Architecture

### 3.10.1 Authentication

The IDP should integrate with the organization identity provider:
- Single sign-on via OIDC/OAuth2
- Service-to-service authentication via service accounts
- API authentication via API keys or JWT tokens
- Git-based authentication via SSH or GitHub App tokens

### 3.10.2 Authorization

Platform authorization follows RBAC patterns:
- Admin -- Full platform access, configuration, user management
- Platform Engineer -- Create/modify templates, scorecards, integrations
- Team Admin -- Manage team members, service ownership
- Developer -- Use self-service capabilities, view own services
- Viewer -- Read-only access to catalog and dashboards

### 3.10.3 Multi-Tenancy

Multi-tenancy in the IDP means:
- Teams see only their services, resources, and data
- Cross-team collaboration is opt-in and visible
- Resource allocation and cost tracking are per-team
- Platform configuration changes are isolated and tested

## 3.11 IDP Observability

The platform team must observe the platform itself:
- Platform Uptime -- Is the portal accessible?
- Platform Performance -- How fast do templates execute?
- Platform Usage -- How many developers use the platform?
- Platform Errors -- What fails? Why? How often?
- Platform SLOs -- Is the platform meeting its objectives?

## 3.12 IDP Sizing and Scalability

| Developer Count | Backstage Nodes | CPU | Memory | Database |
|-----------------|-----------------|-----|--------|----------|
| Less than 100 | 1 | 2 cores | 4GB | Small PostgreSQL |
| 100-500 | 2-3 | 4 cores | 8GB | Medium PostgreSQL |
| 500-1000 | 3-5 | 8 cores | 16GB | Large PostgreSQL |
| 1000+ | 5+ with HA | 8+ cores | 32GB+ | Clustered PostgreSQL |

Performance Considerations:
- Catalog size -- Performance degrades with very large catalogs (10,000+ entities)
- Scaffolder execution -- Heavy workflows can block the scaffolder
- Search -- Deploy dedicated search infrastructure for large catalogs
- TechDocs builds -- CPU-intensive, use a dedicated build service

---

# P4: Golden Paths -- Paved Roads Methodology

---

## 4.1 What Is a Golden Path?

A golden path (also called a paved road) is a well-defined, well-documented, well-supported workflow for accomplishing a common development task. It is the recommended way to do something, with opinionated defaults that produce safe, compliant, and observable outcomes.

Golden paths are not the only way to do things. They are the best way for the common case. Teams can deviate from the golden path when they have specific requirements, but deviation has a cost -- the team takes on the cognitive load that the platform would otherwise absorb.

## 4.2 Golden Path Characteristics

Opinionated -- Golden paths make choices for developers. Which language? Which framework? Which CI/CD configuration? Which monitoring template? These decisions are made by the platform team based on organizational standards and best practices.

Default-Safe -- Following the golden path produces a system that is secure by default. TLS everywhere, proper RBAC, encrypted secrets, compliance-ready logging, and appropriate network policies are all baked in.

Measured -- Golden path usage and outcomes are tracked. The platform team knows how many services were created through the path, how long it took, how often it failed, and how satisfied developers were.

Evolving -- Golden paths are not static. They improve over time as new tools become available, new patterns emerge, and feedback from developers reveals pain points.

Documented -- Golden paths have comprehensive, up-to-date documentation.

Supported -- Golden paths have a support model. If something breaks on the golden path, the platform team fixes it.

Automated -- Golden paths minimize manual steps. From scaffolding to deployment, automation handles the heavy lifting.

## 4.3 Golden Path Anatomy

A complete golden path consists of:

1. Discovery -- How developers find out about this path
2. Decision -- How developers choose this path (clear description, use cases, when to use, when not to use)
3. Execution -- The actual steps to follow (scaffolding, configuration, deployment)
4. Validation -- How to verify the path was followed correctly (scorecards, compliance checks)
5. Maintenance -- How the path is maintained and updated over time
6. Feedback -- How developers provide feedback on the path

## 4.4 Golden Path Examples

### 4.4.1 Create and Deploy a New Microservice

Discovery: Developer portal template catalog, search for microservice
Decision: List of options (Node.js, Go, Python; with or without database; REST or gRPC)
Execution:
1. Developer fills in template form (name, owner, language, database type)
2. Template scaffolds repository structure with:
   - Application skeleton with health check endpoint
   - Dockerfile and .dockerignore
   - Kubernetes manifests (deployment, service, HPA, PDB)
   - CI/CD pipeline (build, test, lint, scan, deploy)
   - Monitoring configuration (alerts, dashboard, logging)
   - Secrets template with Vault integration
   - Service catalog YAML
   - Documentation template
3. Repository is created in the organization GitHub/GitLab
4. CI/CD pipeline triggers automatically
5. Service is deployed to development environment
6. Service appears in the software catalog

### 4.4.2 Add a Database to an Existing Service

Discovery: Developer portal action, search for add database
Decision: Select database type (PostgreSQL, MySQL, Redis, DynamoDB), size, environment
Execution:
1. Developer selects service and database type
2. Platform provisions the database instance
3. Connection string is stored in the secrets manager
4. Service configuration is updated with connection details
5. Migration scripts template is added to the service repository
6. Database monitoring dashboard is created
7. Backup schedule is configured

### 4.4.3 Configure Authentication for a Service

Execution:
1. Developer selects service and authentication type
2. Platform creates OIDC client or service account
3. Platform updates service configuration with auth endpoints
4. Platform adds authentication middleware template to the service
5. Platform provisions any required secrets
6. Integration tests for authentication are added to the pipeline

### 4.4.4 Set Up Canary Deployments

Execution:
1. Developer selects service and strategy
2. Platform updates Kubernetes manifests with traffic splitting
3. Platform configures progressive delivery (Argo Rollouts, Flagger)
4. Platform sets up automated rollback based on metrics
5. Dashboard for canary metrics is created

## 4.5 Paved Roads Methodology

The paved roads methodology extends golden paths to cover the entire software delivery lifecycle:

Phase 1: Discovery and Learning
- Developer onboarding path
- Technology adoption path (new framework, new tool)
- Platform capability discovery path

Phase 2: Development
- Service creation path
- Local development environment path
- Code quality and testing path
- Dependency management path

Phase 3: Delivery
- CI/CD pipeline path
- Artifact management path
- Release management path

Phase 4: Operations
- Deployment path (per environment)
- Observability setup path
- Incident response path
- Backup and recovery path

Phase 5: Maintenance
- Dependency update path
- Migration path (service migration, framework upgrade)
- Decommissioning path

Phase 6: Governance
- Security review path
- Compliance attestation path
- Cost review path
- Architecture review path

## 4.6 Path Design Principles

1. Start with the friction point. Every golden path should solve a real problem that developers are experiencing.

2. Design for the 80%. Optimize the path for the most common use case. Edge cases can be handled through escape hatches.

3. Measure before and after. Establish baseline metrics before releasing the golden path. Measure after to quantify improvement.

4. Make it discoverable. A golden path that nobody knows about is useless.

5. Make it delightful. The golden path should be faster, easier, and more reliable than the alternative.

6. Provide feedback. Developers should know where they are in the path, what happening, and what to do next.

7. Support multiple skill levels. Junior developers need more guidance. Senior developers need efficiency and customization.

## 4.7 Path Evolution

Golden paths follow a lifecycle:

V1 -- Initial Path:
- Basic scaffolding with opinionated defaults
- Manual validation (or no validation yet)
- Limited documentation
- Beta release to early adopters

V2 -- Refined Path:
- Improved scaffolding based on early adopter feedback
- Automated validation (scorecards)
- Comprehensive documentation
- General availability announcement

V3 -- Optimized Path:
- Performance optimizations
- Additional options and configurations
- Advanced documentation (troubleshooting, FAQs)
- Full adoption support

V4 -- Maturing Path:
- Self-healing capabilities
- Proactive recommendations
- AI-assisted guidance
- Deep integration with all platform components

Path Retirement:
- Announce deprecation with minimum 6-month notice
- Provide migration path to replacement path
- Track remaining users and offer personalized migration support

## 4.8 Path Measurement

Each golden path should be measured on:

Adoption Metrics:
- Number of services created through the path
- Percentage of eligible teams using the path
- Growth rate of path usage over time
- Path satisfaction score

Efficiency Metrics:
- Time to complete the path
- Error rate during path execution
- Number of manual interventions required
- Time to onboard new team members using the path

Outcome Metrics:
- Services created through the path have fewer production incidents
- Services created through the path deploy more frequently
- Services created through the path have better DORA metrics

## 4.9 Path Documentation Template

Each golden path should have a standardized documentation page with:
- Title and status (GA, beta, deprecated)
- Overview description
- Prerequisites
- What you get (list of what the path creates and configures)
- Step-by-step guide
- Configuration options (table of parameters)
- After scaffolding (what happens next)
- Customizing your service
- Troubleshooting
- FAQ
- Feedback (how to provide feedback)

## 4.10 Path Catalog

As the number of golden paths grows, a path catalog becomes essential. Features:
- Search and filter by technology, use case, team
- Status indicators (GA, beta, alpha, deprecated)
- Owner information and contact
- Usage statistics and satisfaction scores
- Related paths and dependencies
- Documentation links
- Quick-start links

## 4.11 Escape Hatches

Golden paths cannot cover every case. When developers need to deviate, the platform should provide:

1. Custom Template -- Allow teams to fork the standard template and customize it. The team takes on maintenance responsibility.

2. Infrastructure Abstraction -- Provide low-level APIs that allow teams to provision infrastructure directly when the golden path does not meet their needs.

3. Exception Process -- A documented process for requesting exceptions. Tracked, time-limited, and reviewed periodically.

4. Community Templates -- Allow teams to share custom templates through a community catalog (not officially supported).

5. Direct Cloud Access -- For truly exceptional cases, provide direct access to cloud console or CLI with justification and approval.

Escape Hatch Governance:
- All escape hatch usage should be tracked and reported
- Teams using escape hatches should be periodically reviewed
- Common escape patterns should be analyzed for potential path improvements
- Excessive escape hatch usage indicates a gap in the golden path

## 4.12 Golden Path for Platform Components

Platform teams should also have golden paths for building platform components:
- Template for new Backstage plugin
- Template for new terraform module
- Template for new platform API service
- Template for new platform integration
- Template for new platform documentation
- Template for new scorecard criteria

---

# P5: Developer Experience -- DX Measurement & Improvement

---

## 5.1 What Is Developer Experience?

Developer Experience (DX) is the sum of all interactions a developer has with tools, systems, processes, and people throughout the software delivery lifecycle. Great DX means developers can stay in flow, accomplish tasks efficiently, and feel satisfied with their work environment. Poor DX means friction, context switching, cognitive overload, and frustration.

DX is to developers what UX is to end users. Just as great UX makes software products delightful to use, great DX makes the software development process delightful for developers.

## 5.2 The Cost of Poor Developer Experience

Poor DX has measurable organizational costs:

Context Switching: Every time a developer switches from writing code to checking deployment status, debugging a pipeline, or looking up documentation, they lose context. Research suggests it takes 15-25 minutes to regain deep focus after a context switch.

Friction: Every manual step in the development process represents friction. Friction slows delivery, reduces quality, and frustrates developers.

Cognitive Load: When developers need to understand Kubernetes, Terraform, CI/CD, monitoring, and security tooling, they have less cognitive capacity available for solving business problems.

Developer Turnover: Poor tooling and frustrating development processes are consistently cited as reasons developers leave organizations. Replacing a developer costs 1.5-2x their annual salary.

Velocity Reduction: A team that deploys once per quarter because deployment is painful is delivering value at a fraction of the rate of a team that deploys multiple times per day.

## 5.3 DX Measurement Frameworks

### 5.3.1 DORA Metrics

The DevOps Research and Assessment (DORA) team at Google identified four key metrics that predict organizational performance:

Deployment Frequency -- How often an organization successfully deploys to production.
- Elite: Multiple deploys per day
- High: Multiple deploys per week
- Medium: Multiple deploys per month
- Low: Multiple deploys per year

Lead Time for Changes -- The amount of time between a code change being committed and it being deployed to production.
- Elite: Less than one day
- High: Between one day and one week
- Medium: Between one week and one month
- Low: Between one month and six months

Change Failure Rate -- The percentage of deployments that result in a degraded service and require remediation.
- Elite: Less than 5%
- High: Between 5% and 10%
- Medium: Between 10% and 15%
- Low: Greater than 15%

Time to Restore Service -- The amount of time between a service degradation or outage and its restoration.
- Elite: Less than one hour
- High: Less than one day
- Medium: Less than one week
- Low: Greater than one week

Platform Implementation for DORA:

Deployment Frequency:
- Count production deployments per service per day/week/month
- Track via CI/CD pipeline events or deployment API
- Aggregate across all services for organizational metric

Lead Time for Changes:
- Measure from commit timestamp to production deployment timestamp
- Requires integration between Git provider and deployment system
- Track median, 85th percentile, and 95th percentile

Change Failure Rate:
- Count failed deployments divided by total deployments
- Define failure as incident, rollback, or hotfix within X hours of deployment
- Track via incident management tooling integration

Time to Restore Service:
- Measure from incident detection time to resolution time
- Track via incident management tooling

### 5.3.2 SPACE Framework

The SPACE framework (by Nicole Forsgren, et al.) provides a more comprehensive view of developer productivity:

S -- Satisfaction and Well-being
How fulfilled and happy developers are with their work, tools, teams, and environment.
- Metrics: Survey scores, turnover rates, burnout indicators
- Platform contribution: Developer satisfaction surveys, friction logging

P -- Performance
The outcomes achieved through development work.
- Metrics: Code quality, service reliability, feature delivery, customer impact
- Platform contribution: Scorecards, quality gates, incident rate tracking

A -- Activity
The volume of work completed or actions performed.
- Metrics: Pull requests created, commits, code reviews completed
- Platform contribution: Developer portal dashboards, activity tracking

C -- Communication and Collaboration
How effectively developers interact with others.
- Metrics: Code review response time, documentation quality, cross-team coordination
- Platform contribution: Service catalog ownership visibility, team discovery

E -- Efficiency and Flow
How easily and consistently developers can make progress.
- Metrics: Time-to-onboard, time-to-deploy, context switch frequency
- Platform contribution: Golden path measurement, time-to-production tracking

### 5.3.3 DevEx Framework

The Developer Experience Framework (by Eben Freeman, et al.) identifies three dimensions:

Flow State -- The ability to maintain deep focus on development work without interruption.
- Factors: Build times, environment setup time, tool responsiveness, context switches
- Platform interventions: Fast CI/CD, consistent environments, integrated tools

Cognitive Load -- The mental effort required to work with tools and systems.
- Factors: Tool complexity, documentation quality, abstraction quality
- Platform interventions: Abstraction layers, golden paths, clear documentation

Feedback Loops -- The speed and quality of feedback developers receive.
- Factors: Build feedback time, test execution time, deployment feedback time
- Platform interventions: Fast CI/CD, local dev parity, observability integration

### 5.3.4 The DX Core 4

A simpler, action-focused framework:

1. Clarity -- Can developers figure out how to do what they need to do?
2. Speed -- How fast can they do it?
3. Effort -- How hard is it to do?
4. Quality -- How good is the result?

## 5.4 Friction Logging

Friction logging is the practice of systematically capturing pain points in the development workflow.

### 5.4.1 Types of Friction

Discovery Friction -- Difficulty finding information, tools, or capabilities.
- Cannot find the right documentation
- Unclear which template to use
- Searching across multiple tools for information

Execution Friction -- Difficulty completing a task.
- Slow build times
- Complex multi-step processes
- Unreliable automation
- Missing permissions

Feedback Friction -- Difficulty understanding the outcome of an action.
- Unclear error messages
- Slow feedback loops
- No visibility into pipeline progress

Environment Friction -- Difficulty working with development environments.
- Environment parity issues
- Time-consuming local setup
- Inconsistent configurations

### 5.4.2 Implementation Approaches

Passive Friction Detection:
- Track time spent on platform tasks (from API logs)
- Monitor error rates and retry attempts
- Track support ticket trends

Active Friction Collection:
- Was this helpful feedback buttons
- Post-action satisfaction surveys
- Periodic developer sentiment surveys

Qualitative Friction Collection:
- Regular developer interviews
- Observational studies
- Feedback sessions and retrospectives
- Platform community forums

### 5.4.3 Friction Score

A composite friction score can be calculated:
Friction Score = (Avg Time to Complete Tasks x Error Rate x Support Ticket Volume) / Task Volume

Weighted by severity:
- Showstopper: Task cannot be completed
- Major: Task takes significantly longer than expected
- Minor: Task has slight friction but is still completable
- Papercut: Small annoyance, accumulates over time

## 5.5 Developer Productivity Dashboards

### 5.5.1 Platform Team Dashboard

Metrics the platform team monitors:
- Platform uptime and availability
- Platform API response times
- Golden path adoption rates
- Golden path completion rates
- Developer satisfaction scores (trending)
- Friction score (trending)
- DORA metrics (organizational level)
- Number of support tickets and resolution time
- Platform feature velocity
- Platform cost per developer

### 5.5.2 Team-Level Dashboard

Metrics each team sees:
- Team DORA metrics
- Service catalog completeness score
- Scorecard compliance score
- Cost allocated to team services
- Platform usage by team

### 5.5.3 Executive Dashboard

Metrics for leadership:
- Platform ROI
- Organizational DORA metrics
- Developer satisfaction trends
- Onboarding time trends
- Platform adoption rate
- Cost savings from standardization

## 5.6 Continuous DX Improvement Cycle

Phase 1: Measure
- Collect quantitative metrics (DORA, SPACE surveys, friction data)
- Collect qualitative feedback (interviews, support tickets)
- Establish baseline for each metric

Phase 2: Analyze
- Identify the biggest friction points and opportunities
- Prioritize based on frequency and severity
- Correlate friction points with platform gaps

Phase 3: Improve
- Design platform improvements targeting specific friction points
- Build and test in collaboration with affected teams
- Release improvements with clear communication

Phase 4: Verify
- Measure the same metrics after improvement
- Did friction decrease? Did satisfaction increase?
- Adjust approach based on results

Phase 5: Repeat
- Set regular review cadence (monthly metrics review, quarterly deep dive)
- Update goals based on progress
- Communicate improvements and celebrate wins

## 5.7 Inner Loop vs Outer Loop

### 5.7.1 Inner Loop

The inner loop is the local development experience. It includes everything a developer does on their local machine:
- Writing code
- Running unit tests
- Running the application locally
- Debugging
- Running linting and formatting
- Local database and service dependencies

Platform Support for Inner Loop:
- Tilt, Skaffold, or DevSpace for local Kubernetes development
- Docker Compose for local service dependencies
- Local build caching and warm containers
- IDE plugins and extensions
- Code generators
- Local secrets management
- Environment parity with production

Inner Loop Optimization Goals:
- Time from code change to seeing result: less than 5 seconds
- Time to set up local environment from scratch: less than 30 minutes
- Time to run full test suite locally: less than 10 minutes
- Hot reload support for all languages

### 5.7.2 Outer Loop

The outer loop is everything beyond local development:
- Code review and collaboration
- CI/CD pipeline execution
- Integration testing
- Staging and production deployment
- Monitoring and observability
- Incident detection and response

Platform Support for Outer Loop:
- Automated CI/CD pipeline generation
- Preview environments (per-PR, per-branch)
- Automated deployment approvals and gating
- Observability stack integration
- Incident management integration
- Automated rollback capabilities

Outer Loop Optimization Goals:
- Time from PR creation to merge: less than 4 hours
- Time from merge to production: less than 1 hour
- Pipeline feedback time: less than 10 minutes
- Time to identify and resolve production issues: less than 30 minutes

### 5.7.3 Inner/Outer Loop Integration

The two loops must work together:
- Local development tools should use the same configuration as CI/CD
- Secrets in local dev should match production (different values, same structure)
- CI/CD should validate that changes work before they affect other developers

## 5.8 Developer Surveys

### 5.8.1 Survey Design Principles

- Keep it short -- 5-10 minutes maximum
- Keep it regular -- Quarterly is minimum for tracking trends
- Keep it anonymous -- Developers must feel safe providing honest feedback
- Keep it actionable -- Every question should connect to something the platform can change
- Keep it consistent -- Use the same questions over time to track trends

### 5.8.2 Sample Survey Structure

Section 1: Overall Satisfaction (3 questions)
- Overall, how satisfied are you with the developer platform? (1-5 scale)
- How much does the platform help you be productive? (1-5 scale)
- Would you recommend the platform to other engineers? (1-5 scale)

Section 2: Specific Capabilities (5-8 questions)
- Rate specific platform capabilities
- How easy is it to deploy a new service? (1-5 scale)
- How easy is it to provision infrastructure? (1-5 scale)
- How easy is it to find documentation? (1-5 scale)

Section 3: Friction Points (2-3 open-ended)
- What is the most frustrating part of your development workflow?
- What one thing could the platform team change to make you more productive?
- What tool or capability would you add to the platform?

Section 4: DORA Self-Assessment (4 questions)
- Approximately how often does your team deploy to production?
- Approximately how long from code committed to production?

Section 5: SPACE Assessment (5-10 questions)
- Questions mapped to each SPACE dimension

Section 6: Open Feedback (1 question)
- Anything else you would like to share?

### 5.8.3 Survey Analysis

- Track satisfaction scores over time (quarterly trends)
- Segment by team, tenure, role, technology stack
- Identify top 3 friction points each quarter
- Correlate satisfaction scores with objective metrics
- Share top findings and planned actions with the organization

## 5.9 Measuring Platform Impact on DX

The ultimate test of platform engineering is whether it improves developer experience.

Direct Platform Impact:
- Time saved per developer per week
- Reduction in infrastructure-related support tickets
- Increase in self-service actions
- Reduction in environment-related incidents

Indirect Platform Impact:
- Improvement in DORA metrics
- Improvement in developer satisfaction scores
- Reduction in developer onboarding time
- Reduction in time-to-production for new services

Platform Efficiency Metrics:
- Platform team size relative to developer count (target: 1:30 to 1:100)
- Platform cost per developer
- Platform feature velocity
- Platform uptime and reliability

---

# P6: Self-Service -- Infrastructure & Service Automation

---

## 6.1 The Self-Service Imperative

Self-service transforms the platform from a collection of documentation and APIs into a system where developers can independently accomplish tasks that previously required platform team intervention.

The goal is to eliminate the ticket -- any request that requires a human to receive, process, and fulfill it. Tickets are the enemy of flow. Every ticket creates a dependency, a delay, and a context switch for both the requester and the fulfiller.

## 6.2 Self-Service Maturity Model

Level 1: Documentation-Only Self-Service
- Developers know what they need to do but must do it manually
- Documentation tells them the steps
- No automation, high friction, error-prone

Level 2: Partial Automation
- Some steps are automated (scripts, CI/CD jobs)
- Developers still need to know which scripts to run
- Prone to drift and inconsistency

Level 3: Guided Automation
- Developer portal provides a form or wizard
- Platform handles the automation
- Clear success confirmation
- Low friction, high consistency

Level 4: Proactive Automation
- Platform anticipates developer needs
- Automated recommendations
- Platform handles routine maintenance automatically

Level 5: Autonomous
- Platform handles most operational concerns without developer input
- Self-healing infrastructure
- Automated optimization
- Developer focuses exclusively on business logic

## 6.3 Environment Provisioning

### 6.3.1 Environment Types

Development Environment: For individual developer work and testing.
- Per-developer namespace in shared cluster
- Docker Compose on developer machine (inner loop)
- Ephemeral environments (per-branch, per-PR)

Staging Environment: For integration testing before production.
- Dedicated namespace or cluster
- Production-like configuration (smaller scale)
- Integration tests run against staging

Production Environment: For serving production traffic.
- Multi-availability zone deployment
- Auto-scaling and self-healing
- Full observability and alerting
- Strict access controls

### 6.3.2 Environment Provisioning Flow

1. Developer requests environment through portal
2. Platform validates request (budget, permissions, resources)
3. Platform provisions infrastructure (IaC execution)
4. Platform configures the environment (DNS, TLS, monitoring)
5. Platform generates credentials and stores in secrets manager
6. Platform updates service catalog with environment metadata
7. Platform sends notification to developer
8. Developer accesses environment through configured endpoints

### 6.3.3 Ephemeral Environments

Ephemeral environments are short-lived, on-demand environments created for a specific purpose (typically per pull request).

Benefits:
- Isolated testing for each PR
- No environment conflicts
- Reduced staging environment cost
- Earlier feedback on integration issues

Platform Considerations:
- Resource limits to prevent runaway costs
- Time-based auto-removal (destroy after 24-48 hours)
- Warm pools for faster provisioning
- Database seeding with appropriate test data

## 6.4 Service Scaffolding

### 6.4.1 Scaffolding Components

Application Code:
- Entry point and health check endpoint
- Basic middleware (logging, error handling, tracing)
- Configuration management
- Database initialization

Build Configuration:
- Dockerfile (multi-stage, optimized)
- .dockerignore
- Makefile or task runner configuration
- Dependency management files

CI/CD Configuration:
- Pipeline definition (GitHub Actions, GitLab CI)
- Quality gates (linting, testing, security scanning)
- Deployment stages (dev, staging, production)

Kubernetes Manifests:
- Deployment (with resource requests/limits, probes, HPA)
- Service (with proper port configuration)
- Ingress or Gateway API (with TLS)
- PDB (PodDisruptionBudget)
- NetworkPolicy
- ServiceAccount and RBAC

Observability Configuration:
- Prometheus metrics endpoint
- Logging configuration (structured JSON logging)
- Distributed tracing configuration (OpenTelemetry)
- Predefined Grafana dashboard
- Alerting rules

Documentation:
- README with service overview, quick start, development guide
- API documentation (OpenAPI specification)
- Runbook template
- On-call documentation

Service Catalog:
- catalog-info.yaml with metadata, ownership, and dependencies

Secrets:
- Secret specification (which secrets are needed)
- Vault policy template
- Local secrets example (.env.example)

### 6.4.2 Scaffolding Technology Choices

Cookiecutter: Python-based project templating. Good for simple file generation.

Copier: Python-based project templating with more features (idempotent, task-based).

Backstage Scaffolder: Backstage built-in templating with pipeline and catalog integrations.

Yeoman: Node.js-based scaffolding with generator ecosystem.

plop: Lightweight Node.js-based scaffolding for adding individual files.

Custom CLI: Build your own scaffolding CLI with custom logic and workflows.

Template Repository Copies: Copy from a template repository. Simplest approach.

### 6.4.3 Scaffolding Best Practices

1. Keep templates simple. Generate structure, not implementation.

2. Test templates. Template changes can break generations. CI/CD should test template outputs.

3. Version templates. Template updates should be versioned.

4. Template minimalism. Generate what needed now, not what might be needed later.

5. Consistent structure. All services should have a consistent directory structure.

6. Golden path defaults. Scaffold should produce production-ready defaults.

7. Upgradable templates. Consider tools that support template evolution.

8. Template composition. Complex templates should compose simpler ones.

## 6.5 CI/CD Generation

### 6.5.1 Pipeline Generation Approaches

1. Static Pipeline Templates -- Predefined CI/CD configuration files for each golden path.

2. Dynamic Pipeline Generation -- CI/CD configuration is generated based on template parameters.

3. Reusable Pipeline Components -- CI/CD uses reusable workflow components.

4. Remote Pipeline Definitions -- Pipeline behavior is defined on the CI/CD server.

### 6.5.2 Pipeline Stages

Stage 1: Build
- Compile/transpile code
- Install dependencies
- Build artifacts

Stage 2: Quality
- Lint code (ESLint, golangci-lint, pylint)
- Format check (Prettier, gofmt, black)
- Type checking (TypeScript, mypy)
- Dependency scanning (Dependabot, Snyk, Trivy)
- Secret scanning (truffleHog, git-secrets)

Stage 3: Test
- Unit tests
- Integration tests
- Contract tests
- Security tests (SAST, DAST)

Stage 4: Package
- Build Docker image
- Scan container image (Trivy, Clair, Anchore)
- Sign container image
- Push to artifact registry
- Publish SBOM

Stage 5: Deploy (Dev)
- Deploy to development environment
- Smoke tests
- Integration tests

Stage 6: Deploy (Staging)
- Deploy to staging environment
- End-to-end tests
- Performance tests

Stage 7: Deploy (Production)
- Progressive delivery (canary, blue-green)
- Automated rollback based on metrics
- Post-deployment verification
- Monitoring watch period

## 6.6 Secret Management

### 6.6.1 Secret Management Principles

Principle 1: Secrets are never in code. No API keys, passwords, certificates in source code repositories.

Principle 2: Secrets are dynamically provisioned. Generated by the platform and injected into the environment.

Principle 3: Secrets have least privilege. Each secret provides access only to what is necessary.

Principle 4: Secrets are rotated automatically. Platform handles rotation according to policy.

Principle 5: Secret access is audited. Every secret access logged with alerts for anomalous patterns.

### 6.6.2 Secret Provisioning Flow

1. Developer requests a secret through the portal
2. Platform validates the request
3. Platform generates the secret
4. Platform stores the secret in the secrets manager
5. Platform injects the secret into the service environment
6. Platform stores a reference (not the value) in the service catalog
7. Platform configures secret rotation schedule
8. Platform logs the secret creation and access

### 6.6.3 Secrets Manager Integration

The platform should support multiple secrets backends:
- HashiCorp Vault (dynamic secrets, PKI, transit encryption)
- Cloud provider secret managers (AWS, GCP, Azure)
- Kubernetes Secrets (with encryption at rest)
- SOPS (for GitOps -- encrypted secrets in repositories)

## 6.7 Access Management

### 6.7.1 Platform Access Patterns

Human Access:
- Developer access to portal (SSO via OIDC)
- Developer access to cloud console (role-based, time-boxed)
- Developer access to production (break-glass, approved, audited)
- Platform team access to platform infrastructure

Machine Access:
- CI/CD access to deploy (service accounts)
- Service-to-service access (mTLS, OIDC)
- Monitoring access to scrape metrics
- Secrets access from running services

### 6.7.2 Self-Service Access Management

Teams should manage their own access through the platform:
- Add team member (requires team admin approval)
- Grant repository access
- Grant environment access (read-only or read-write)
- Grant secrets access
- Request temporary access (time-boxed elevated access)
- Review access (who has access to team resources)

### 6.7.3 Just-in-Time Access

Just-in-time (JIT) access provides temporary elevated access:
- Developer requests elevated access with justification and duration
- Platform validates request against policy
- Access is granted for the specified duration
- Access is automatically revoked when duration expires
- All actions during elevated access are logged

## 6.8 Self-Service for Platform Teams

Platform teams should also practice what they preach:
- New Backstage plugin -- Template to scaffold a new plugin
- New terraform module -- Template to scaffold with testing structure
- New platform API -- Template to scaffold a new platform API service
- New integration -- Template to scaffold a new platform integration
- New scorecard -- Template to define new scorecard criteria
- New golden path documentation -- Template for golden path docs

---

# P7: Platform Adoption -- Product Thinking & Community

---

## 7.1 Platform Adoption is Not Automatic

Building a great platform does not guarantee adoption. Developers are busy, have established workflows, and are often skeptical of new platform initiatives. Platform adoption requires the same product thinking, user research, and marketing effort that commercial products invest in.

The platform team must treat adoption as a first-class concern. Every platform feature should consider:
- How will developers discover this feature?
- How will developers learn to use this feature?
- How will developers be motivated to try this feature?
- How will developers get help with this feature?
- How will we know if developers are using this feature?

## 7.2 Product Thinking for Platforms

1. Know your users. Maintain developer personas. Conduct user research regularly.

2. Define your MVP. Launch with less, learn faster, iterate.

3. Build a roadmap. Communicate where the platform is going and why.

4. Measure adoption. Track who is using which capabilities.

5. Prioritize based on impact. Use RICE, WSJF, or similar frameworks.

6. Ship iteratively. Every release should be communicated through release notes.

7. Close the feedback loop. When developers give feedback, acknowledge it and communicate action taken.

## 7.3 Developer Personas

### 7.3.1 The Pragmatic Developer

Most common persona. Mid-level to senior developer. Focused on delivering features. Willing to adopt platform if it saves time. Values consistency. Uses portal for self-service, reads documentation, files support tickets when stuck.

### 7.3.2 The Skeptic

Senior developer with established workflows. Slow to adopt. Needs evidence of platform value. May actively resist if platform is seen as limiting. Won over by reliability, measurable improvement, and respecting their autonomy.

### 7.3.3 The Early Adopter

Technically curious, often senior or staff engineer. Eager to try new features. Provides detailed feedback. Heavy portal and API usage. Active in platform community. Leverage as platform champions.

### 7.3.4 The Junior Developer

Early-career developer. Needs clear guidance, guardrails, and safety. Eager to follow recommended paths. Heavy documentation consumption. Golden paths should be extra clear. Good error messages are critical.

### 7.3.5 The Manager

Engineering manager or director. Needs data showing platform adoption improves team velocity. Cost justification. Minimal disruption to team workflows. Provide team-level metrics and involve in roadmap discussions.

## 7.4 User Research for Platform Teams

### 7.4.1 Research Methods

Surveys: Quantitative data at scale. Best for measuring satisfaction and identifying trends.

Interviews: Qualitative depth. Best for understanding context, pain points, and needs.

Observation: Watch developers use the platform. Best for identifying friction not articulated.

Diary Studies: Developers log platform interactions over time. Best for understanding workflows.

Analytics: Quantitative usage data. Best for understanding what being used, by whom.

Support Ticket Analysis: Qualitative trends. Best for identifying recurring issues.

Feedback Buttons: Was this helpful throughout the portal. Best for continuous lightweight feedback.

### 7.4.2 Interview Guide Questions

- Walk me through your typical day. What tools do you use?
- Tell me about the last time you needed to deploy a change.
- What is the most frustrating part of your development workflow?
- If you could change one thing about our dev environment, what would it be?
- How do you decide which tools and services to use for a new project?
- Tell me about a time when our platform helped you be more productive.
- Tell me about a time when our platform got in your way.
- How do you learn about new tools or capabilities?
- Who do you go to for help when stuck?

### 7.4.3 Prioritizing Research Findings

Impact Matrix:
- Y-axis: Frequency (how many developers experience this)
- X-axis: Severity (how painful is it)
- Quadrants: Quick wins, strategic investments, incremental improvements, low priority

RICE Framework:
- Reach: How many developers are affected?
- Impact: How much does this improve DX?
- Confidence: How confident in estimates?
- Effort: How much work is required?

## 7.5 Adoption Metrics

### 7.5.1 Adoption Funnel

Awareness -> Consideration -> Trial -> Adoption -> Advocacy

Awareness: Developer knows the capability exists.
- Metric: Portal page views, documentation reads

Consideration: Developer is evaluating the capability.
- Metric: Template clicks, documentation time spent

Trial: Developer uses the capability for the first time.
- Metric: First-time template execution, first-time API call

Adoption: Developer regularly uses the capability.
- Metric: Repeat usage, active users per week/month

Advocacy: Developer actively recommends the capability.
- Metric: Mentions in communication, community participation

### 7.5.2 Key Adoption Metrics

Overall Platform Adoption:
- Percentage of developers using portal at least once per week
- Portal DAU/MAU
- Portal session duration and pages per session

Template Adoption:
- Number of services created through templates vs manual
- Template completion rate (started vs completed)
- Average time to complete a template
- Template satisfaction score

Golden Path Adoption:
- Percentage of eligible services using each golden path
- Percentage of deployments following golden path
- Golden path usage growth rate

## 7.6 Feedback Loops

### 7.6.1 Closed Feedback Loops

Every feedback channel should be a closed loop:
1. Developer provides feedback
2. Platform team acknowledges receipt
3. Platform team analyzes and prioritizes
4. Platform team communicates next steps
5. Platform team implements change (if prioritized)
6. Platform team communicates the change
7. Platform team thanks the original feedback provider

### 7.6.2 Feedback Channels

In-Portal:
- Was this helpful buttons
- Post-action surveys
- Feature request form
- Bug report form

Community:
- Slack/Discord #platform channel
- Platform office hours (weekly or bi-weekly)
- Monthly platform demos
- Platform community forum

Structured:
- Quarterly developer satisfaction surveys
- Quarterly platform review
- Platform roadmap feedback sessions

Passive:
- Support ticket analysis
- Platform usage analytics
- Search logs (what are developers searching for?)
- Error logs (where do developers get stuck?)

## 7.7 Community Building

### 7.7.1 Platform Champions Program

- Recruit champions from each product team
- Give champions early access to new features
- Train champions on platform capabilities
- Champions advocate within their teams
- Champions provide feedback to platform team
- Champions help train new team members

### 7.7.2 Platform Community Activities

Weekly Office Hours: Drop-in sessions for platform questions, demos, feedback.

Monthly Platform Demos: Showcase new capabilities, share metrics and success stories.

Quarterly Platform Review: Review metrics with team representatives, discuss roadmap.

Platform Feedback Forum: Async feedback collection, feature requests with upvoting.

### 7.7.3 Developer Relations for Internal Platforms

- Create platform onboarding materials (videos, tutorials, workshops)
- Write internal platform blog posts
- Create platform demo videos
- Run platform workshops during onboarding
- Recognize and celebrate platform champions

## 7.8 Communication Strategy

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| Portal notifications | Feature announcements, maintenance | As needed |
| Portal changelog | List of platform changes | Per release |
| Slack/Discord | Quick questions, real-time updates | Daily |
| Office hours | Direct interaction | Weekly |
| Team sync meetings | In-depth discussions | Per request |
| Internal blog | Deep dives, philosophy | Monthly |

## 7.9 Platform Branding

Internal platforms benefit from consistent branding:
- Platform name and logo
- Consistent naming conventions for components
- Consistent visual design in the developer portal
- Consistent terminology across documentation
- Platform tagline or mission statement

Branding makes the platform feel like a cohesive product, reduces confusion, and builds identity.

## 7.10 Measuring Platform Health

Feature Health:
- Adoption rate per feature
- Satisfaction score per feature
- Error rate per feature
- Support ticket volume per feature

Community Health:
- Number of active platform champions
- Community channel engagement
- Office hours attendance
- Survey response rate
- Platform NPS

Evolution Health:
- Features shipped per quarter
- Time from feature request to availability
- Backlog size and age
- Deprecated features retired per quarter

---

# P8: Platform Operations -- Reliability, Cost & Security

---

## 8.1 Platform Reliability

### 8.1.1 Platform SLOs

The platform itself must be reliable. Platform reliability is experienced by all developers.

Developer Portal Availability:
- Target: 99.9% uptime during business hours
- Measured by: Synthetic monitoring from developer locations

Golden Path Execution Reliability:
- Target: 99.5% success rate for scaffolded service creation
- Measured by: Template execution completion rate

Platform API Availability:
- Target: 99.95% uptime
- Measured by: API endpoint health checks

CI/CD Pipeline Generation:
- Target: 99.9% success rate for generated pipeline execution

Secrets Access:
- Target: 99.99% availability for secret reads

### 8.1.2 Multi-Tenancy Isolation

Resource Isolation:
- Each team has dedicated resource quotas
- Noisy neighbor protection (resource limits, priority classes)
- Rate limiting per team for platform API calls

Data Isolation:
- Each team sees only their services in the catalog
- Each team manages only their secrets
- Each team accesses only their environments

Failure Isolation:
- A team service failure should not affect others
- Platform components should have per-tenant failure domains
- Cascading failures should be contained

Performance Isolation:
- Platform components should have per-tenant performance guarantees
- One team heavy usage should not slow down others
- Platform API should have per-team rate limits

### 8.1.3 Platform Stability

Change Management:
- Platform changes follow their own CI/CD pipeline
- Platform changes have automated testing
- Platform changes have staged rollouts
- Platform changes have rollback plans
- Platform changes are communicated in advance

Platform Incident Management:
- Platform incidents follow standard incident management
- Platform incidents have severity levels
- Platform incidents are communicated through platform channels
- Platform incidents are reviewed in postmortems
- Incident learnings feed into platform improvements

Platform Capacity Planning:
- Monitor platform resource utilization trends
- Plan capacity for developer growth
- Load test the platform before major releases
- Auto-scale platform components where possible

### 8.1.4 Shared Responsibility Model

| Responsibility | Platform Team | Application Team |
|----------------|---------------|------------------|
| Infrastructure availability | Owns | -- |
| Platform API availability | Owns | -- |
| Application code correctness | -- | Owns |
| Application deployment | Enables | Owns |
| Application monitoring | Provides tools | Configures alerts |
| Incident detection | Platform-level | Application-level |
| Incident response | Platform incidents | Application incidents |
| Capacity planning | Platform capacity | Application capacity |
| Cost optimization | Platform efficiency | Resource efficiency |
| Security | Platform-level controls | Application-level security |
| Compliance | Platform framework | Application compliance |

## 8.2 Cost Allocation

### 8.2.1 Why Cost Allocation Matters

Without cost allocation, platform costs are a shared, invisible expense leading to:
- No incentive for teams to optimize resource usage
- Inability to measure platform ROI per team
- Tragedy of the commons
- Difficulty justifying platform investment

### 8.2.2 Cost Allocation Models

Showback: Costs calculated and reported but not charged. Transparency drives better behavior.

Chargeback: Costs calculated and charged to teams. Stronger incentive for optimization, more complex.

Retrospective Showback: Costs calculated and reported after the fact. Provides visibility without overhead.

Pre-Allocation: Budgets allocated upfront. Teams manage their platform budget.

Metered Chargeback: Costs calculated per unit of consumption. Granular visibility, complex metering.

### 8.2.3 Cost Allocation Categories

Infrastructure Costs:
- Compute (CPU, memory per workload)
- Storage (database, object storage, volumes)
- Network (data transfer, load balancing)
- Cloud services (managed databases, queues, caches)

Platform Costs:
- Developer portal hosting
- CI/CD runner costs
- Secrets management infrastructure
- Observability infrastructure
- Platform team overhead (allocated across teams)

Tooling Costs:
- Third-party tool subscriptions
- License costs
- SaaS platform costs

### 8.2.4 Tagging Strategy

Required Tags:
- synarc.io/team: payment-team
- synarc.io/service: payment-service
- synarc.io/environment: production
- synarc.io/cost-center: eng-platform
- synarc.io/created-by: platform-scaffolder

Optional Tags:
- synarc.io/project: project-x
- synarc.io/business-unit: payments
- synarc.io/compliance-zone: pci
- synarc.io/expiration: 2026-12-31

### 8.2.5 Cost Dashboards

Per-team cost dashboards should show:
- Total infrastructure cost (trended by month)
- Cost by environment (dev, staging, production)
- Cost by resource type (compute, storage, network)
- Cost per service
- Cost trends (month over month, quarter over quarter)
- Cost anomalies
- Cost optimization recommendations

### 8.2.6 Platform Unit Economics

Cost per Developer: Total platform cost / Number of developers. Should decrease as the platform scales.

Cost per Deployment: Total platform cost / Number of deployments. More deployments per dollar means the platform is enabling more delivery.

Cost per Environment: Total environment costs / Number of environments. Helps evaluate ephemeral environment cost-effectiveness.

Savings per Developer: Estimated hours saved per developer x developer cost. Compare against platform cost per developer for ROI.

## 8.3 Platform Security

### 8.3.1 RBAC Architecture

Platform Roles:
| Role | Scope | Capabilities |
|------|-------|--------------|
| Platform Admin | Global | Manage platform config, integrations, users |
| Platform Engineer | Global | Create/modify templates, scorecards, paths |
| Team Admin | Team | Manage team membership, service ownership |
| Developer | Team | Use self-service, view team services |
| Viewer | Global | Read-only access to catalog and dashboards |
| Security Auditor | Global | View audit logs, compliance reports |

### 8.3.2 Multi-Tenancy Security

Tenant Isolation:
- Teams cannot see other teams services, secrets, or configs
- Team boundaries enforced at API and UI level
- Cross-team collaboration must be explicitly authorized
- Platform admin actions are audited

Security Boundaries:
- Portal: Auth, session management, CSRF protection
- API layer: API key validation, rate limiting, request validation
- Service layer: mTLS, service-to-service auth
- Data layer: Encryption at rest and in transit
- Infrastructure: Network policies, VPC isolation

### 8.3.3 Secrets Management Security

Policies:
- Secrets are never logged (scanning on all logs)
- Secrets are never displayed in the portal UI
- Secrets are injected at runtime, not stored in config
- Secrets access is time-boxed and audited
- Secrets are rotated according to schedule

### 8.3.4 Compliance Gates

Pre-Deployment Gates:
- Vulnerability scan results (no critical vulnerabilities)
- Dependency license compliance
- Secret scanning (no secrets in code)
- SAST scan passed
- Container image signature verified
- SBOM generated and published

Runtime Gates:
- Resource usage within approved limits
- Network traffic matches declared policies
- Data classification labels applied
- Encryption standards met
- Audit logging enabled

Periodic Gates:
- Quarterly access review complete
- Dependency vulnerabilities remediated within SLA
- Secrets rotated within policy
- Documentation up to date

### 8.3.5 Audit Trails

Audit Events:
- User authentication and authorization decisions
- Portal actions (template execution, catalog changes)
- API calls (who, what, when, from where)
- Secret access and management actions
- Infrastructure provisioning and changes
- Configuration changes
- RBAC changes
- Compliance gate results

Audit Log Requirements:
- Tamper-proof
- Immutable storage
- Accessible for compliance reviews
- Retained per compliance requirements
- Searchable and filterable

### 8.3.6 Policy as Code

Policy as Code encodes platform policies as executable rules.

Security Policies:
- Container vulnerability thresholds
- Allowed base images
- Network policy requirements
- Encryption requirements
- Auth requirements

Compliance Policies:
- Required labels and annotations
- Data classification requirements
- Audit logging requirements
- Backup and retention requirements

Operational Policies:
- Resource limits and requests
- Replica minimums for production
- Health check requirements
- Deployment strategy requirements

Cost Policies:
- Instance size limits
- Budget enforcement
- Resource tag requirements
- Auto-shutdown policies

## 8.4 Documentation and Onboarding

### 8.4.1 Platform Documentation Taxonomy

Getting Started:
- Platform overview (what is the platform, what does it provide)
- Quick start (first steps, create and deploy a service)
- Developer onboarding guide

Golden Paths:
- Each golden path has its own documentation page
- Step-by-step guides for common workflows
- Video walkthroughs

Reference:
- Platform API reference
- CLI reference
- Configuration reference
- Template reference

Guides:
- Platform architecture overview
- Security model
- Cost allocation model
- Support model

Operations:
- Platform runbooks
- Incident response procedures
- Backup and recovery procedures

FAQ:
- Common questions and answers
- Troubleshooting guides
- Known issues and workarounds

### 8.4.2 Documentation Standards

- All documentation is version-controlled alongside platform code
- Documentation reviewed as part of feature development
- Documentation has consistent structure and voice
- Documentation is searchable from the developer portal
- Documentation is periodically reviewed for accuracy
- Documentation includes examples and use cases

### 8.4.3 Onboarding Program

Day 1: Access and Orientation
- Grant access to developer portal and source control
- Provide platform overview document
- Set up local development environment
- Join platform community channels

Days 2-3: First Service
- Walk through Create and Deploy a Service golden path
- Scaffold a service, run locally, deploy to dev
- View the service in the software catalog

Week 1: Platform Capabilities
- Explore the developer portal
- Learn about golden paths relevant to team
- Understand service catalog and ownership
- Learn support model

Week 2: Team Integration
- Pair with team member on a real task
- Deploy a change to staging
- Attend platform office hours
- Complete platform capabilities survey

Ongoing: Deepening
- Learn advanced platform capabilities
- Contribute to platform documentation
- Attend platform community events

### 8.4.4 Onboarding Metrics

- Time from start to first successful deployment
- Time from start to first pull request
- Developer satisfaction with onboarding (survey at week 2)
- Number of support questions during onboarding
- Platform capabilities used during first month

---

# P9: Worked Examples -- 12+ Deep-Dive Scenarios

---

## Worked Example 1: Designing a Golden Path for Microservice Creation

Scenario: The platform team has identified through surveys and interviews that creating a new microservice is one of the most painful and time-consuming developer workflows. Developers typically spend 3-5 days manually setting up repositories, pipelines, Kubernetes manifests, and observability for each new service.

Step 1: Research and Requirements Gathering

Conduct interviews with 8-10 developers who have created microservices in the last quarter. Identify common patterns:
- 90% of services are Node.js or Go
- 70% need PostgreSQL
- 40% need Redis caching
- 30% need message queues (Kafka, RabbitMQ)
- 100% need CI/CD pipelines
- 100% need Kubernetes deployment manifests
- 85% need monitoring and alerting
- 75% need API documentation

Step 2: Define the Golden Path Scope

Start with the most common combination: Node.js REST API with PostgreSQL. Plan to expand to Go and add Redis/caching in V2.

Step 3: Template Development

Create a Backstage software template with parameters for service name, owner, description, database size, cache requirement, and production replicas. The template scaffolds:
- Application skeleton with health check endpoint, middleware, database client, config
- Kubernetes manifests (deployment, service, HPA, PDB, NetworkPolicy)
- CI/CD pipeline (build, test, lint, scan, deploy)
- Monitoring configuration (ServiceMonitor, PrometheusRule, Grafana dashboard)
- Documentation (README, API docs, runbook)
- Service catalog YAML
- Secrets specification

Step 4: Internal Beta

Release the template to a pilot team (2-3 teams). Monitor execution for errors and performance. Collect feedback. Iterate based on feedback.

Step 5: Measurement

Before golden path: Average time to create microservice = 3.5 days
After golden path: Average time to create microservice = 45 minutes

Track ongoing:
- Template usage rate (services created per week)
- Template completion rate (% started vs completed)
- Post-creation satisfaction score
- Post-creation service quality (do scaffolded services have fewer incidents?)

Step 6: V2 Expansion

Based on usage data and feedback, expand to:
- Go language support
- Redis caching option (already planned)
- Kafka message queue option
- Ephemeral environment for scaffolded services

---

## Worked Example 2: Implementing DORA Metrics Collection

Scenario: The organization wants to track DORA metrics across all teams. Currently, each team tracks metrics differently (if at all). The platform team needs to implement a centralized, automated DORA metrics collection system.

Step 1: Define Metric Sources

Deployment Frequency:
- Source: CI/CD pipeline executions
- Data: For each pipeline run that deploys to production, record timestamp, service name, team
- Collection: Webhook from CI/CD system to platform metrics service

Lead Time for Changes:
- Source: Git provider + CI/CD deployment events
- Data: Time between commit timestamp (on main branch) and deployment timestamp (to production)
- Collection: Poll git provider for commits, correlate with deployment events

Change Failure Rate:
- Source: Incident management system + deployment events
- Data: Count of deployments that resulted in an incident within 24 hours
- Collection: API integration with PagerDuty/Opsgenie, correlate deployment events with incident creation

Time to Restore Service:
- Source: Incident management system
- Data: Time between incident creation and incident resolution
- Collection: API integration with incident management tooling

Step 2: Architecture

Event Collector receives webhooks from Git, CI/CD, and incident systems. Processor aggregates and correlates events. Database stores metrics. API serves metrics to dashboard. Backstage plugin displays DORA dashboard.

Step 3: Implementation

GitHub webhook receiver captures push events to main branch. CI/CD pipeline sends deployment events. Processor calculates lead time by correlating commit timestamps with deployment timestamps. Backstage plugin queries the DORA metrics API and displays team-level and organizational dashboards.

Step 4: Dashboard Design

Team Dashboard:
- Deployment frequency (daily/weekly/monthly view)
- Lead time (median, p85, p95 with trend)
- Change failure rate (percentage with trend)
- Time to restore (median with trend)
- Comparison against DORA benchmarks (elite, high, medium, low)

Organizational Dashboard:
- Aggregate metrics across all teams
- Team comparison view
- Trend charts (quarter over quarter)
- DORA classification distribution

Step 5: Adoption and Iteration

Release the dashboard to teams. Collect feedback on usefulness. Add drill-down capability to see individual service metrics. Integrate with team communication tools for automated metric reporting.

---

## Worked Example 3: Building a Developer Portal from Scratch

Scenario: A mid-size organization (200 developers) has no developer portal. Services are tracked in a spreadsheet. Documentation is scattered across wikis. Onboarding takes 2-3 weeks.

Step 1: Choose the Platform

Evaluate Backstage vs Port vs custom solution. Decision: Backstage (open-source, extensible, strong community, CNCF project). Trade-off: requires more engineering effort than Port but offers more customization.

Step 2: Infrastructure Setup

Deploy Backstage on Kubernetes with:
- PostgreSQL database (managed, HA)
- GitHub authentication provider
- Ingress with TLS termination
- CI/CD pipeline for Backstage itself

Step 3: Catalog Population

Start with automated ingestion:
- GitHub integration to discover repositories as components
- Define catalog-info.yaml template for all services
- Manual enrichment for critical services (add descriptions, owners, dependencies)
- Establish ownership conventions (each service must have a team owner)

Step 4: First Template

Build a software template for creating Node.js microservices (as described in Worked Example 1). This demonstrates immediate value to developers.

Step 5: TechDocs Migration

Migrate documentation from wikis to TechDocs:
- Define mkdocs template for all services
- Provide migration guide for teams
- Run migration workshops

Step 6: Initial Scorecards

Define three initial scorecard criteria:
- Service has a defined owner
- Service has documentation in TechDocs
- Service has CI/CD pipeline configured

Step 7: Launch and Onboard

Announce the portal at an all-hands meeting. Run onboarding sessions for all teams. Set up office hours for the first month. Collect feedback.

---

## Worked Example 4: Platform Cost Allocation Implementation

Scenario: The organization cloud bill is growing 20% quarter over quarter. Leadership wants visibility into which teams are driving costs. The platform team needs to implement cost allocation.

Step 1: Tagging Strategy

Define mandatory tags for all cloud resources:
- team (the owning team name)
- service (the service name)
- environment (dev, staging, production)
- provisioned-by (platform, manual, etc.)

Step 2: Tag Enforcement

Implement tag enforcement in the platform:
- All platform-provisioned resources are automatically tagged
- Add tag validation to infrastructure pipelines
- Block untagged resource creation where possible
- Report untagged resources weekly

Step 3: Cost Data Pipeline

Export cloud billing data to a cost analytics database. Join with service catalog data (team ownership, environment). Create cost allocation views.

Step 4: Showback Dashboard

Create per-team cost dashboards in the developer portal:
- Total cost by environment
- Cost by resource type
- Cost trends (month over month)
- Cost per service
- Comparison against team budget (if applicable)

Step 5: Communication

Roll out showback data to teams. Provide guidance on cost optimization. Celebrate teams that optimize. Use cost data to identify optimization opportunities at the platform level.

---

## Worked Example 5: Self-Service Environment Provisioning

Scenario: Developers need to request environments through a ticket system. Provisioning takes 2-5 days. The platform team wants to reduce this to minutes.

Step 1: Environment Types

Standardize on three environment types:
- Development: Shared cluster, per-team namespace, auto-scaling disabled
- Staging: Dedicated namespace, production-like config, smaller scale
- Production: Dedicated cluster, HA, strict access controls

Step 2: Infrastructure as Code

Build Terraform modules for each environment type. Modules handle:
- Kubernetes namespace or cluster provisioning
- Network policies and security groups
- Service mesh configuration
- Monitoring and logging setup
- DNS and TLS configuration

Step 3: Portal Integration

Create Backstage actions for environment provisioning:
- Developer selects service and environment type
- Platform validates budget and permissions
- Terraform executes to provision the environment
- Environment is registered in the service catalog
- Developer receives connection details

Step 4: Ephemeral Environments

Add ephemeral environment support:
- Per-PR environment creation
- Automatic cleanup after PR merge
- Resource limits to control cost
- Warm pools for faster provisioning

Step 5: Measurement

Track:
- Time to provision environment (target: under 10 minutes)
- Provisioning success rate (target: 99%)
- Environment utilization (are environments being used?)
- Ephemeral environment usage (are teams adopting them?)

---

## Worked Example 6: Platform API Design for Service Provisioning

Scenario: The platform team needs to expose service provisioning capabilities through a well-defined API so that CI/CD systems, CLI tools, and other automation can interact with the platform programmatically.

Step 1: API Design Principles

- API-first design (design API before implementation)
- RESTful with consistent resource naming
- Versioned from day one (v1)
- Pagination, filtering, and sorting on list endpoints
- Standard error format
- API authentication via API keys or OAuth2
- Rate limiting per client

Step 2: Resource Model

```
/services
  GET /services -- List services (filtered by team, environment, status)
  POST /services -- Create a new service
  GET /services/:id -- Get service details
  PATCH /services/:id -- Update service configuration
  DELETE /services/:id -- Decommission a service

/services/:id/deployments
  GET /services/:id/deployments -- List deployments
  POST /services/:id/deployments -- Trigger a deployment

/services/:id/environments
  GET /services/:id/environments -- List environments
  POST /services/:id/environments -- Provision a new environment

/services/:id/secrets
  GET /services/:id/secrets -- List secret references
  POST /services/:id/secrets -- Request a new secret
```

Step 3: API Implementation

Implement the API service as a Backstage backend plugin or standalone service. Use OpenAPI specification for documentation. Generate server stubs and client SDKs from the spec.

Step 4: SDK Generation

Generate TypeScript and Python client SDKs from the OpenAPI spec. Publish SDKs to internal package registries. Maintain SDKs as the API evolves.

Step 5: Versioning Strategy

- API version is part of the URL path (/api/v1/services)
- Breaking changes require a new API version
- Old API versions are supported for a minimum of 6 months after deprecation
- Deprecation is communicated through response headers (Sunset header)
- Migration guide is provided for each breaking change

---

## Worked Example 7: Developer Satisfaction Survey Implementation

Scenario: The platform team needs to implement a quarterly developer satisfaction survey to track DX improvements and identify pain points.

Step 1: Survey Design

Design a survey with 15-20 questions covering:
- Overall platform satisfaction (1-5 scale)
- Specific capability ratings (catalog, templates, CI/CD, docs)
- Open-ended friction questions
- DORA self-assessment
- SPACE framework questions

Step 2: Survey Platform

Integrate a survey tool (SurveyMonkey, Typeform, or custom) with the developer portal. Trigger survey completion reminders through portal notifications and Slack.

Step 3: Survey Distribution

Send the survey to all developers quarterly. Aim for 60%+ response rate through:
- Clear communication about purpose and impact
- Anonymous responses
- Estimated completion time (5-7 minutes)
- Follow-up reminders at 1 week and 2 weeks

Step 4: Analysis and Reporting

After each survey:
- Calculate overall satisfaction score and trend
- Segment by team, tenure, role
- Identify top 3 friction points
- Correlate satisfaction with DORA metrics
- Create a survey results summary
- Share findings with the organization

Step 5: Action Planning

For each survey:
- Select 2-3 actionable improvements
- Assign owners and timelines
- Track progress on the platform roadmap
- Communicate progress at the next survey
- Show developers how their feedback drove change

---

## Worked Example 8: Platform Adoption Campaign

Scenario: The platform team has built a developer portal with templates and golden paths, but adoption is low. Only 30% of teams are using the platform regularly.

Step 1: Diagnosis

Analyze adoption data to understand why:
- Which teams are not using the platform?
- What capabilities are they missing?
- What are the common objections?
- Conduct interviews with non-adopting teams

Step 2: Targeted Improvements

Based on diagnosis:
- Add the most requested missing capability (e.g., database provisioning)
- Improve documentation for confused teams
- Reduce friction for onboarding path
- Add support for a popular technology stack not yet covered

Step 3: Champion Program

Recruit platform champions from each major team:
- Identify enthusiastic users
- Provide early access to new features
- Give them a direct line to the platform team
- Have them advocate within their teams

Step 4: Office Hours and Training

Launch weekly office hours:
- Drop-in support for platform questions
- Demo new features
- Pairing sessions for complex use cases

Create training materials:
- Video walkthroughs of golden paths
- Written tutorials and guides
- Workshop format for team onboarding

Step 5: Metrics and Iteration

Track adoption metrics weekly:
- Portal DAU/MAU
- Template execution count
- New teams adopting the platform
- Satisfaction score trends

Goal: Increase adoption from 30% to 70% within 6 months.

---

## Worked Example 9: Golden Path Migration for an Existing Team

Scenario: A product team wants to migrate an existing service to follow the platform golden path. The service was created before the platform existed and has custom infrastructure.

Step 1: Assessment

Review the existing service:
- Application structure (does it match golden path conventions?)
- CI/CD pipeline (can it be migrated to standardized pipelines?)
- Infrastructure (Kubernetes manifests, terraform, monitoring)
- Documentation (is it current?)
- Dependencies (databases, caches, queues)

Step 2: Migration Plan

Create a migration plan:
- Phase 1: Standardize application structure (directory layout, health checks, metrics)
- Phase 2: Migrate CI/CD to platform-standard pipeline
- Phase 3: Adopt platform-managed infrastructure (if beneficial)
- Phase 4: Add service catalog entry and documentation
- Phase 5: Validate golden path compliance (scorecards)

Step 3: Execution

Work with the team through each phase:
- Pair on application restructuring
- Update CI/CD configuration
- Migrate infrastructure incrementally
- Register service in catalog
- Add TechDocs documentation

Step 4: Validation

Run scorecards to validate golden path compliance. Compare before/after metrics:
- Deployment frequency
- Lead time
- Change failure rate
- Incident count

Step 5: Retrospective

Document lessons learned from the migration. Update golden path based on migration experience. Share migration story with other teams.

---

## Worked Example 10: Building a Platform CLI Tool

Scenario: Developers want a CLI tool for platform interactions so they can script and automate their workflows.

Step 1: Define Scope

Platform CLI should support:
- Login (SSO-based authentication)
- Service scaffolding (trigger templates)
- Environment management (list, create, delete)
- Deployment management (trigger, view status)
- Secret management (request, list, rotate)
- Catalog search and view
- Cost query and reporting

Step 2: Architecture

CLI built with:
- Programming language: Go or TypeScript (cross-platform single binary)
- Authentication: OIDC device flow (login through browser)
- API interaction: REST API calls to platform backend
- Configuration: ~/.platform/config.yaml
- Caching: Local cache for catalog data

Step 3: Implementation

```bash
# Authentication
platform login
platform logout
platform whoami

# Service management
platform service create --template nodejs-service --name my-service
platform service list
platform service info my-service

# Environment management
platform env list --service my-service
platform env create --service my-service --type staging
platform env delete --service my-service --env staging

# Deployment management
platform deploy --service my-service --env production
platform deployment list --service my-service

# Secret management
platform secret list --service my-service
platform secret request --service my-service --name db-password

# Catalog
platform catalog search --query payment
platform catalog view payment-service

# Cost
platform cost --team my-team --month 2026-04
platform cost --service my-service
```

Step 4: Distribution

Package CLI as:
- Homebrew formula for macOS
- npm package for Node.js users
- GitHub releases with auto-update
- Docker image for CI/CD environments

Step 5: Documentation and Support

Write CLI documentation covering:
- Installation and setup
- Command reference
- Configuration guide
- Examples and use cases
- Troubleshooting

---

## Worked Example 11: Scorecard Implementation for Service Quality

Scenario: The platform team wants to implement scorecards to enforce service quality standards across the organization.

Step 1: Define Scorecard Criteria

Start with 8 scorecard criteria:
1. Has a defined owner (team in catalog-info.yaml)
2. Has CI/CD pipeline configured
3. Has TechDocs documentation published
4. Has at least 80% unit test coverage
5. Has security scanning configured
6. Has SLOs defined and monitored
7. Has on-call rotation configured
8. Has cost tags applied

Step 2: Scoring Model

Each criterion is scored pass/fail. Overall score is percentage of passing criteria. Score tiers:
- Platinum: 100% (all criteria pass)
- Gold: 87.5% (7 of 8 pass)
- Silver: 75% (6 of 8 pass)
- Bronze: 62.5% (5 of 8 pass)
- Below standards: less than 62.5%

Step 3: Automated Checks

Implement automated checks for each criterion:
1. Owner check: Query catalog for service ownership metadata
2. CI/CD check: Query CI/CD system for pipeline configuration
3. Documentation check: Query TechDocs for published docs
4. Test coverage check: Query CI/CD test results
5. Security scan check: Query security scanning tool for recent results
6. SLO check: Query monitoring system for SLO configuration
7. On-call check: Query on-call system for rotation configuration
8. Cost tags check: Query cloud provider for tag compliance

Step 4: Portal Display

Display scorecards in the developer portal:
- Service detail page shows scorecard status
- Team dashboard shows aggregate scores
- Scorecard trends over time
- Drill-down for each criterion (why did it fail? how to fix?)

Step 5: Adoption and Enforcement

Phase 1 (Informational): Display scores but no enforcement. Allow teams to understand their scores and improve.
Phase 2 (Recommended): Encourage teams to improve scores. Provide guidance and support.
Phase 3 (Required): Block deployments for services below minimum score threshold (with exception process).

---

## Worked Example 12: Platform Incident Response

Scenario: The developer portal is experiencing intermittent outages during peak usage hours. The platform team needs to investigate, fix, and prevent recurrence.

Step 1: Incident Detection

Monitoring alerts show:
- Portal API response times exceeding 5 seconds (baseline: 200ms)
- 502 errors for 2% of requests
- Catalog search queries timing out

Step 2: Investigation

Check:
- CPU and memory usage on Backstage pods (high CPU, nearing limits)
- Database query performance (slow catalog queries)
- Recent deployments or changes (new plugin deployed yesterday)
- Traffic patterns (usage has grown 40% in the last month)

Root cause: The catalog has grown to 15,000 entities and catalog queries are no longer efficient. A new plugin introduced an N+1 query pattern.

Step 3: Immediate Fix

- Scale up Backstage pods from 2 to 4 replicas (mitigates symptoms)
- Add database query timeouts to prevent cascading failures
- Rate-limit catalog search queries

Step 4: Long-Term Fix

- Add database indexes for common catalog queries
- Implement catalog query caching (Redis)
- Refactor the plugin to fix N+1 queries
- Implement pagination for catalog list endpoints
- Plan for search infrastructure (Elasticsearch)

Step 5: Prevention

- Add performance regression tests to CI/CD pipeline
- Implement capacity planning for platform components
- Add catalog size monitoring with growth projections
- Establish performance budgets for plugins
- Add synthetic monitoring that simulates developer workflows

Step 6: Postmortem

Document incident timeline, root cause, fix, and prevention measures. Share with the organization. Update platform runbooks.

---

## Worked Example 13: Build vs Buy Evaluation for Developer Portal

Scenario: The platform team is evaluating whether to build a developer portal from scratch, extend Backstage, or buy a commercial solution (Port).

Step 1: Requirements Definition

Must-have:
- Software catalog with custom entity types
- Software templates with form parameters
- TechDocs integration
- Search across all entities and docs
- SSO integration with existing identity provider
- RBAC for multi-team support
- API for programmatic access

Nice-to-have:
- Scorecards engine
- Custom plugins for internal tools
- Built-in CI/CD visibility
- Cost tracking dashboards

Step 2: Evaluation Matrix

| Requirement | Build Custom | Backstage Extend | Port (Buy) |
|-------------|-------------|------------------|------------|
| Time to MVP | 6-9 months | 2-3 months | 2-4 weeks |
| Engineering effort | Very High | Medium | Low |
| Customization | Full | High | Medium |
| Maintenance burden | Very High | Medium | Low |
| Integration effort | Very High | Medium | Low |
| Total cost | Very High | Medium | Medium |
| Vendor lock-in | None | Low (open-source) | Medium |

Step 3: Decision

Decision: Extend Backstage.

Rationale:
- Meets all must-have requirements
- Open-source prevents vendor lock-in
- Strong community and CNCF backing
- Medium engineering effort is acceptable given platform team size
- Customization options allow deep integration with internal tools
- Faster time-to-MVP than building custom

Step 4: Implementation Plan

Month 1: Deploy Backstage with catalog and GitHub integration
Month 2: Build first software template for Node.js microservices
Month 3: Implement TechDocs and migrate initial documentation
Month 4: Develop scorecards with three initial criteria
Month 5: Build custom plugins for internal tools
Month 6: Launch to all teams with onboarding program

---

## Worked Example 14: Platform Team Staffing and Funding Model

Scenario: The organization wants to establish a dedicated platform team. They need to determine staffing size, skill mix, and funding model.

Step 1: Staffing Calculation

Use the platform team ratio model:
- Current organization: 200 developers
- Target ratio: 1 platform engineer per 40 developers
- Recommended platform team size: 5 engineers

Initial team composition:
- 1 Platform Lead/Architect (Staff-level, product thinking)
- 2 Platform Engineers (Senior, full-stack, infrastructure)
- 1 Backstage Specialist (TypeScript, React, plugin development)
- 1 DevOps/CI/CD Specialist (pipelines, automation, tools)

Step 2: Funding Model

Recommended: Showback model with transparent cost reporting.
- Platform team cost is calculated and reported to teams
- No actual budget transfer in the first year
- Teams see their platform usage cost
- Platform team uses this data to optimize

Year 1: Central funding (platform cost is organizational overhead)
Year 2: Showback implementation (teams see their platform costs)
Year 3: Evaluate chargeback (if showback drives desired behavior, consider chargeback)

Step 3: Skill Development

Invest in platform team skill development:
- Backstage training and certification
- Kubernetes and cloud certifications
- Product management training for platform engineers
- Developer experience workshops
- Conference attendance (PlatformCon, KubeCon, DevOpsDays)

Step 4: Reporting Structure

Platform team reports to:
- Director of Engineering or VP of Engineering
- Not part of a specific product team (maintains neutrality)
- Clear separation from SRE team (different focus)
- Close collaboration with DevOps and Security teams

---

## Worked Example 15: Multi-Tenant IDP for Large Enterprise

Scenario: A large enterprise with 3,000 developers across 5 business units needs an IDP that supports multi-tenancy while maintaining consistency.

Step 1: Tenant Model

Define tenant boundaries:
- Business unit = tenant
- Each tenant has its own portal instance (or namespace)
- Shared: SSO, base platform components, CI/CD runners
- Isolated: Catalog data, templates, scorecards, configurations

Step 2: Shared vs Isolated

Shared across all tenants:
- Identity provider (SSO for all developers)
- Base Backstage infrastructure
- CI/CD runner pool
- Artifact registry
- Secrets management infrastructure

Isolated per tenant:
- Portal instance (dedicated Backstage deployment)
- Catalog data (tenant sees only their services)
- Templates and golden paths (tenant-specific or tenant-customized)
- Scorecards and compliance rules
- Cost tracking and budgets

Step 3: Federation

Implement federation between tenants:
- Cross-tenant service discovery (with explicit opt-in)
- Shared golden path templates (published to all tenants)
- Global scorecard criteria (base level for all tenants)
- Tenant-level customization on top of base

Step 4: Governance

Define governance model:
- Platform team manages global configuration
- Each tenant has a platform liaison
- Tenant-customized templates must meet base criteria
- Annual review of tenant platform configuration
- Security and compliance audits per tenant

---

## Worked Example 16: Inner Loop Optimization

Scenario: Developers report that local development is slow and inconsistent. Different teams use different tools for running services locally. Setup time for a new developer is 2+ days.

Step 1: Assessment

Survey developers about their inner loop experience:
- Average local setup time: 2-3 days
- Common tools: Docker Compose, minikube, kind, tilt, manual
- Pain points: inconsistent service dependencies, slow rebuilds, no hot reload
- Environment parity issues: what works locally often fails in CI/CD

Step 2: Standardized Inner Loop Tool

Choose and standardize on a local development tool:
- Evaluation: Tilt, Skaffold, DevSpace, Garden
- Decision: Tilt (great developer experience, live reload, consistent with CI/CD)
- Alternative for simpler cases: Docker Compose

Step 3: Tiltfile Generation

Generate Tiltfiles as part of service scaffolding:
- Backend service Tiltfile with hot reload
- Database and dependency configuration
- Environment variable injection
- Local secrets management
- Integration with local Kubernetes (kind, minikube)

Step 4: Local Dev Environment Template

Create a standardized Local Dev Environment:
- Single command to start all dependencies
- Hot reload for all services
- Local debugging support
- Consistent with CI/CD environment
- Fast rebuild times (caching, warm containers)

Step 5: Measurement

Track inner loop metrics:
- Time from code change to seeing result (target: < 5 seconds)
- Time to run full test suite locally (target: < 10 minutes)
- Time to set up local environment from scratch (target: < 30 minutes)
- Developer satisfaction with local dev experience (survey)

---

## Worked Example 17: Secrets Management Implementation

Scenario: The platform team needs to implement centralized secrets management. Currently, secrets are stored in environment files, CI/CD variables, and spread across multiple locations.

Step 1: Requirements

- All secrets stored in a centralized secrets manager
- Dynamic secret generation where possible
- Automated secret rotation
- Access auditing and logging
- Integration with all platform services
- Developer-friendly interface (no direct Vault CLI needed)

Step 2: Tool Selection

Evaluation: HashiCorp Vault vs AWS Secrets Manager vs Azure Key Vault vs GCP Secret Manager
Decision: HashiCorp Vault (dynamic secrets, PKI, multi-cloud, open-source)

Step 3: Integration

Integrate Vault with:
- Backstage (portal interface for secret management)
- CI/CD pipelines (secret injection during deployments)
- Kubernetes (sidecar injector for pods)
- Terraform (Vault provider for secret provisioning)

Step 4: Secret Types

Implement support for:
- Static secrets (API keys, passwords)
- Dynamic secrets (database credentials, cloud provider credentials)
- PKI certificates (TLS certificates for internal services)
- Encryption keys (transit encryption)

Step 5: Developer Workflow

Developer requests a secret through the portal:
1. Select service and secret type
2. Platform validates request
3. Secret is generated/stored in Vault
4. Secret is injected into the service environment
5. Secret reference (not value) appears in the portal
6. Rotation schedule is configured automatically

Step 6: Rotation

Implement automatic rotation:
- Database passwords: rotate every 90 days
- API keys: rotate every 30 days
- TLS certificates: rotate before expiry (automated renewal)
- Service account keys: rotate every 180 days

Rotation process:
1. New secret is generated
2. Application is notified of rotation
3. Application picks up new secret without restart
4. Old secret is revoked after verification

---

## Worked Example 18: Platform Documentation Portal

Scenario: Platform documentation exists but is scattered across wikis, README files, and shared drives. Developers have trouble finding the information they need.

Step 1: Documentation Audit

Audit existing documentation:
- What documentation exists?
- Where is it stored?
- When was it last updated?
- Who owns it?
- What is missing?

Findings: 15 wiki pages, 30 README files, 10 Google Docs. Most outdated. No consistent structure. Hard to search.

Step 2: Documentation Platform

Use Backstage TechDocs as the single documentation source:
- All documentation in Markdown
- Stored alongside the code (docs-as-code)
- Versioned with the platform
- Searchable from the developer portal
- Consistent look and feel

Step 3: Documentation Structure

Define documentation structure:
- Getting Started (onboarding, quick start)
- Golden Paths (step-by-step guides)
- Platform Components (catalog, templates, CI/CD, secrets)
- API Reference (platform APIs, SDKs)
- Operations (runbooks, incident response)
- FAQ (troubleshooting, common issues)

Step 4: Migration

Migrate existing documentation:
- Assign owners for each documentation section
- Convert wiki pages to Markdown
- Review and update content
- Add to the platform repository
- Set up TechDocs build pipeline
- Remove old documentation sources (or redirect)

Step 5: Documentation Standards

Define and enforce standards:
- All new features must include documentation
- Documentation is reviewed as part of code review
- Documentation has a consistent template
- Documentation is updated when features change
- Documentation freshness is part of scorecards

Step 6: Measurement

Track documentation metrics:
- Documentation completeness score (percentage of services with docs)
- Documentation freshness (last updated date)
- Search effectiveness (can developers find what they need?)
- Developer satisfaction with documentation (survey)

---

# P10: Anti-Patterns -- What NOT To Do

---

## 10.1 The Big Bang Platform Launch

Anti-Pattern: Spending 12-18 months building the perfect platform before showing it to anyone. The platform team works in isolation, making assumptions about what developers need.

Why It Fails: By the time the platform launches, developer needs have changed. The platform team has built things nobody wants. Developers have no investment in the platform and no incentive to change their workflows.

Solution: Launch early with minimal capabilities. Get feedback from real developers. Iterate based on actual usage. Treat the platform as a product, not a project.

## 10.2 The Platform That Does Everything

Anti-Pattern: Trying to build a platform that covers every possible use case, technology stack, and workflow. The platform becomes bloated, complex, and hard to maintain.

Why It Fails: Platform features for edge cases add complexity for everyone. Developers struggle to find the right path. The platform team is spread too thin to maintain everything.

Solution: Start with the 80% use case. Build golden paths for the most common workflows. Provide escape hatches for edge cases. Add coverage based on demand, not speculation.

## 10.3 Build Everything In-House

Anti-Pattern: Rejecting all commercial solutions in favor of building everything internally. The platform team builds a CI/CD system, a secret manager, a monitoring system, and a deployment tool from scratch.

Why It Fails: Building infrastructure tools is hard. Commercial and open-source alternatives are battle-tested. The platform team spends all their time maintaining custom tools instead of building platform value.

Solution: Use the build-vs-buy framework. Build only what differentiates your platform. Buy or extend open-source for commodity capabilities. Focus platform engineering effort on integration and abstraction.

## 10.4 The Golden Path Is a Straitjacket

Anti-Pattern: Forcing all teams to follow the golden path with no exceptions. Developers feel constrained and resent the platform. Teams with legitimate different requirements are blocked.

Why It Fails: Not every service fits the same mold. Data pipelines, ML services, event processors, and legacy applications have different requirements. Rigid enforcement drives developers away from the platform.

Solution: Design golden paths for the common case. Provide well-documented escape hatches. Allow teams to deviate with justification. Track deviations and use them to evolve the paths.

## 10.5 Platform Without Product Management

Anti-Pattern: Building platform features based on what the platform team thinks is important rather than what developers actually need. No user research. No feedback loops. No roadmap communication.

Why It Fails: The platform becomes a collection of features that nobody asked for. Developers feel like the platform team doesn't understand their needs. Adoption stalls.

Solution: Assign product management responsibilities to the platform team. Conduct regular user research. Maintain a prioritized backlog based on developer needs. Communicate the roadmap. Close the feedback loop.

## 10.6 Metrics Without Context

Anti-Pattern: Collecting DORA metrics and platform usage data but not connecting them to actionable improvements. Data is collected for reporting rather than learning.

Why It Fails: Metrics become a vanity exercise. Numbers go up and down without understanding why. No connection between platform changes and metric changes.

Solution: Establish a clear hypothesis for each metric improvement. Measure before and after platform changes. Correlate metrics with user feedback. Use metrics to drive decisions, not just reports.

## 10.7 The Ticket-Driven Platform

Anti-Pattern: Many platform interactions still require a ticket. Developer requests go through a ticketing system, sit in a queue, and are processed manually by the platform team.

Why It Fails: Tickets are slow and manual. Developers wait days for simple requests. The platform team spends all their time processing tickets instead of building automation.

Solution: Default to self-service. Every common request should be automatable through the platform. If a request requires human intervention, that is a platform gap. Build automation for the most common tickets first.

## 10.8 Platform as a Cost Center

Anti-Pattern: The platform team is treated as a cost center. They are not asked about ROI. They are not expected to measure their impact. They are funded based on budget requests rather than value delivered.

Why It Fails: Without ROI visibility, the platform team cannot prove their value. Budget cuts are arbitrary. The platform cannot invest in improvements that would save developer time.

Solution: Track platform ROI. Measure developer time saved. Report platform impact to leadership. Frame the platform as a value center that multiplies organizational velocity. Use showback/chargeback for cost transparency.

## 10.9 Ignoring the Inner Loop

Anti-Pattern: The platform focuses exclusively on CI/CD and production operations while ignoring the local development experience. Developers love the deployment pipeline but dread local setup.

Why It Fails: The inner loop is where developers spend most of their time. A poor inner loop means developers are unproductive in the first hours of every day. Local friction compounds across the team.

Solution: Invest in inner loop tooling. Standardize local development environments. Provide Tilt/Docker Compose configurations. Ensure environment parity. Measure and optimize inner loop metrics.

## 10.10 One-Size-Fits-All Onboarding

Anti-Pattern: A single onboarding process for all developers regardless of their role, experience, or technology stack. Junior developers are overwhelmed. Senior developers are bored.

Why It Fails: Different developers have different needs. A data engineer onboarding is different from a frontend developer. An experienced hire needs different information than a new graduate.

Solution: Create role-specific onboarding paths. Allow developers to skip sections they already know. Provide self-paced onboarding with clear milestones. Gather feedback and iterate on the onboarding experience.

## 10.11 Platform Team as a Bottleneck

Anti-Pattern: The platform team is the only team that can provision infrastructure, create namespaces, configure CI/CD, or approve deployments. Every request goes through the platform team.

Why It Fails: The platform team becomes a bottleneck. Developer velocity is limited by platform team capacity. The platform team has no time for improvement work because they are too busy processing requests.

Solution: Build self-service capabilities so developers can provision their own infrastructure. Use policy automation instead of manual approvals. Reserve platform team time for improvement work.

## 10.12 Neglecting Documentation

Anti-Pattern: Platform features are built but not documented. Documentation is an afterthought. Developers are expected to figure it out or ask the platform team directly.

Why It Fails: Undocumented features are unused features. Developers cannot adopt what they don't understand. The platform team is interrupted constantly with questions that should be answered in docs.

Solution: Treat documentation as a first-class platform feature. Docs-as-code with the platform repository. Documentation is reviewed as part of feature development. Documentation freshness is a scorecard criterion.

## 10.13 The Silver Bullet Platform

Anti-Pattern: Expecting the platform to solve all organizational problems. The platform is seen as a silver bullet that will fix broken processes, poor engineering practices, and organizational dysfunction.

Why It Fails: Platforms amplify existing practices. They do not fix broken processes. A bad process automated is still a bad process -- it just fails faster. The platform cannot fix organizational issues.

Solution: Address process and organizational issues separately from platform building. Use the platform to reinforce good practices, not to fix bad ones. Set realistic expectations about what the platform can achieve.

## 10.14 Platform Perfectionism

Anti-Pattern: Delaying platform releases because features are not perfect. Platform components are over-engineered. The platform team is afraid to ship incomplete features.

Why It Fails: Perfection delays value delivery. Developers don't get to use the platform. By the time the perfect platform launches, requirements have changed. Over-engineering wastes effort.

Solution: Ship early and iterate. Release platform features as beta or experimental. Gather feedback and improve. Accept that the platform will never be perfect and that is OK.

## 10.15 Ignoring Platform Community

Anti-Pattern: Building the platform in isolation without engaging the developer community. No office hours, no community channels, no champions program, no feedback mechanisms.

Why It Fails: Developers feel no connection to the platform. The platform team doesn't understand developer needs. Adoption suffers because there is no community driving it.

Solution: Build a platform community. Recruit champions. Hold office hours. Create community channels. Celebrate platform wins publicly. Make developers feel like partners in the platform journey.

## 10.16 Platform Team as Compliance Police

Anti-Pattern: The platform team is primarily responsible for enforcing compliance and security policies. Platform capabilities are about gatekeeping rather than enabling.

Why It Fails: Developers see the platform as an obstacle rather than an enabler. The platform team is viewed as the compliance police. Trust between the platform team and developers erodes.

Solution: Automate compliance enforcement (policy as code) so the platform is invisible. Make the developer experience the primary focus. Compliance should be a side effect of following the golden path, not a separate concern.

## 10.17 Over-Abstraction

Anti-Pattern: Abstracting too much of the underlying infrastructure. Developers have no visibility into what is happening or how to debug issues. They need to understand the abstraction layers to diagnose problems.

Why It Fails: When something breaks, developers cannot debug it because they don't understand what is underneath. A transparent understanding of the underlying system is important for effective debugging.

Solution: Abstract configuration, not debugging. Provide clear error messages that point to the underlying issue. Make the abstraction layers transparent when debugging. Provide escape hatches for advanced users.

## 10.18 Platform for the Sake of Platform

Anti-Pattern: Building a platform because it seems like the right thing to do, not because there is a demonstrated need. Platform initiative driven by hype rather than organizational pain.

Why It Fails: The platform solves problems nobody has. No adoption because there is no need. Platform team disbands when they cannot demonstrate value.

Solution: Start with the problems. What are the biggest friction points for developers? What slows down delivery? Build platform capabilities that address specific, measured pain points. Justify every platform feature by the problem it solves.

---

# P11: Quality Gates -- Checks & Balances

---

## 11.1 Platform Mission Statement

The platform engineering SKILL provides comprehensive guidance for building, operating, and evolving internal developer platforms. It covers the full spectrum from person to technology. It is designed to be practical, actionable, and grounded in real-world experience.

## 11.2 Content Quality Gates

Every section of this SKILL has been reviewed against these quality criteria:

Accuracy: All technical claims are verified against current best practices in platform engineering. References to tools, frameworks, and methodologies reflect their actual capabilities and recommended usage patterns.

Completeness: The SKILL covers all topics listed in the requirements. Each topic is addressed with sufficient depth to be immediately actionable. No major aspect of platform engineering is omitted.

Actionability: Every section provides concrete guidance that a platform engineer can apply. Principles are accompanied by practices. Concepts are accompanied by examples. The SKILL avoids purely theoretical discussions.

Consistency: Terminology is consistent throughout the document. Conflicting advice is eliminated. The SKILL presents a coherent philosophy of platform engineering.

Practicality: The SKILL acknowledges real-world constraints. It addresses organizational challenges, adoption hurdles, and team dynamics alongside technical considerations.

## 11.3 Structural Quality Gates

Completeness: All 11 parts are present and developed to appropriate depth. The progression follows a logical flow from person to philosophy to architecture to practice.

Balance: Each part receives appropriate coverage length relative to its importance and complexity. No part is disproportionately short or long compared to its subject matter.

Cross-Referencing: Related concepts are cross-referenced across sections. The SKILL builds on earlier sections in later sections.

Readability: The SKILL is written clearly and accessibly. Technical concepts are explained without unnecessary jargon. Code examples are included where they add clarity.

## 11.4 Topical Quality Gates

P1 (Persona) covers:
- Role definition and mindset
- Core responsibilities (12 areas)
- Day in the life scenario
- Skills and competencies
- Role comparison table
- Maturity levels for individuals
- When to hire platform engineers

P2 (Philosophy) covers:
- Platform engineering definition and rationale
- Cognitive load argument
- Platform as product concept
- People, process, technology trinity
- Team topologies and models
- Platform contract
- Coherence and consistency
- Governance vs gatekeeping
- Build vs buy framework
- Platform economics and ROI
- Maturity model (5 levels)
- Strangler fig pattern

P3 (IDP Architecture) covers:
- IDP definition and components
- Developer portal (Backstage deep dive)
- Catalog entity model
- Templates and scaffolding
- TechDocs and scorecards
- Integration patterns (GitOps, CI/CD, observability, secrets, cost)
- Alternative portals (Port, Cortex, OpsLevel)
- AI/ML workflow support
- Security architecture
- Sizing and scalability

P4 (Golden Paths) covers:
- Golden path definition and characteristics
- Path anatomy (discovery, decision, execution, validation, maintenance, feedback)
- Concrete examples (microservice, database, auth, canary)
- Paved roads methodology (6 phases)
- Design principles
- Path evolution (V1 through V4)
- Measurement framework
- Path catalog
- Escape hatches
- Platform component golden paths

P5 (Developer Experience) covers:
- DX definition and cost of poor DX
- DORA metrics (implementation detail)
- SPACE framework
- DevEx Framework (flow state, cognitive load, feedback loops)
- DX Core 4
- Friction logging (types, implementation, scoring)
- Developer productivity dashboards
- Continuous DX improvement cycle
- Inner loop and outer loop
- Developer survey design and analysis
- Measuring platform impact on DX

P6 (Self-Service) covers:
- Self-service imperative
- Maturity model (5 levels)
- Environment provisioning (types, flow, ephemeral)
- Service scaffolding (components, technology choices, best practices)
- CI/CD generation (approaches, pipeline stages)
- Secret management (principles, provisioning, integration)
- Access management (patterns, self-service, JIT)
- Platform self-service

P7 (Platform Adoption) covers:
- Adoption challenges
- Product thinking framework
- Developer personas (5 types)
- User research methods and interview guides
- Adoption funnel and metrics
- Feedback loops (closed loop, channels)
- Community building (champions, activities, dev rel)
- Communication strategy
- Platform branding
- Measuring platform health

P8 (Platform Operations) covers:
- Platform reliability (SLOs, multi-tenancy, stability, shared responsibility)
- Cost allocation (models, categories, tagging, dashboards, unit economics)
- Platform security (RBAC, multi-tenancy, secrets, compliance gates, audit trails, policy as code)
- Documentation and onboarding (taxonomy, standards, program, metrics)

P9 (Worked Examples) covers:
1. Golden path for microservice creation
2. DORA metrics collection implementation
3. Building a developer portal from scratch
4. Platform cost allocation
5. Self-service environment provisioning
6. Platform API design
7. Developer satisfaction survey
8. Platform adoption campaign
9. Golden path migration for existing team
10. Platform CLI tool
11. Scorecard implementation
12. Platform incident response
13. Build vs buy evaluation
14. Platform team staffing and funding
15. Multi-tenant IDP for large enterprise
16. Inner loop optimization
17. Secrets management implementation
18. Platform documentation portal

P10 (Anti-Patterns) covers:
- Big bang launch
- Platform that does everything
- Build everything in-house
- Golden path as straitjacket
- Platform without product management
- Metrics without context
- Ticket-driven platform
- Platform as cost center
- Ignoring inner loop
- One-size-fits-all onboarding
- Platform team as bottleneck
- Neglecting documentation
- Silver bullet platform
- Platform perfectionism
- Ignoring platform community
- Platform team as compliance police
- Over-abstraction
- Platform for sake of platform

P11 (Quality Gates) covers:
- Mission statement
- Content quality gates (accuracy, completeness, actionability, consistency, practicality)
- Structural quality gates (completeness, balance, cross-referencing, readability)
- Topical quality gates for each part
- Usage notes and target audience
- Version and maintenance information

## 11.5 Usage Notes

This SKILL is designed for:
- Platform engineers building and maintaining internal developer platforms
- Platform team leads defining platform strategy and direction
- Engineering managers establishing platform teams
- Architects evaluating platform engineering approaches
- DevOps and SRE engineers transitioning to platform engineering roles

This SKILL does not cover:
- Infrastructure building (infrastructure-engineer)
- SRE operations (sre-engineer)
- CI/CD pipeline details (devops-engineer)
- Architecture decisions (architect)
- Security engineering (security-engineer)

## 11.6 Version and Maintenance

Current version: 1.0.0
Last updated: 2026-05-27
Maintained by: Synarc Platform Engineering Guild

This SKILL is maintained as a living document. Updates are made when:
- New platform engineering practices emerge
- Tools and technologies referenced in the SKILL evolve
- Feedback from platform engineers indicates gaps or inaccuracies
- The platform engineering community develops new insights

Contributions to this SKILL should follow the quality gates defined in this section.

---

# End of SKILL
