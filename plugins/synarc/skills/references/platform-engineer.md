---
title: "Platform Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - platform-engineering
  - developer-experience
  - idp
  - developer-portal
  - golden-paths
  - backstage
  - self-service
  - platform-as-product
  - dora-metrics
  - service-catalog
---

# Purpose

Build and maintain the internal developer platform (IDP) that multiplies organizational velocity — every capability is leverage for dozens of developers. Ship capabilities, not features. Make the right thing the easy thing.

# Scope

IDP architecture, developer portals (Backstage), golden paths/paved roads, DX measurement (DORA, SPACE), self-service infrastructure, platform adoption as product, platform operations, build-vs-buy decisions. Prerequisites: synarc-core, devops-engineer.

# Inputs

Developer pain points, onboarding friction data, deployment frequency metrics, cognitive load indicators, team topologies, organizational maturity level.

# Output

IDP architecture, developer portal configuration, golden path templates, self-service APIs, DX dashboards, platform roadmap, adoption metrics.

## 1. IDP Architecture

The IDP is not any single tool — it is the integration layer connecting infrastructure provisioning, CI/CD, service catalog, security controls, observability, secrets, cost tracking, and documentation. Exposed through developer portal, CLI, API, IDE plugins, ChatOps, and Git workflows.

### Core Components

**Developer Portal** (Backstage, Port, Cortex): software catalog, software templates, TechDocs, scorecards, plugins. **Platform Orchestrator**: workflow engine managing request lifecycle — validation, coordination, monitoring, failure handling. **Integration Layer**: compute (K8s/serverless), networking (mesh/ingress/DNS/TLS), storage (DB/cache/object), CI/CD (build/registry/deploy), observability (metrics/logs/traces), secrets (Vault/cloud SM), identity (SSO/RBAC/OIDC).

## 2. Backstage Deep Dive

Plugin-based architecture (React frontend + backend plugins + PostgreSQL + optional Elasticsearch). Entity model: `apiVersion` / `kind` (Component/API/Resource/System/Group/User/Template/Location) / `metadata` / `spec` / `relations`.

Catalog ingestion: YAML files (`catalog-info.yaml`), API-based, provider-based (GitHub/GitLab auto-discovery). Software Templates: form → scaffolder → repo creation → CI/CD trigger → catalog entry. TechDocs: mkdocs-based, per-service, versioned alongside code. Scorecards: defined standards evaluated per service (owner, pipeline, coverage, on-call, security, SLOs, cost tags).

### Alternative Portals

Port (faster time-to-value, visual configuration), Cortex (scorecard-focused), OpsLevel (maturity rubrics, DORA metrics collection).

## 3. Golden Paths / Paved Roads

### Definition

A well-defined, well-documented, well-supported workflow for common development tasks. Opinionated, default-safe, measured, evolving, documented, supported, automated.

### Anatomy

[1] Discovery (how to find), [2] Decision (when to use), [3] Execution (scaffolding → config → deploy), [4] Validation (scorecards, compliance), [5] Maintenance, [6] Feedback loop.

### Examples

**Create microservice**: template scaffolds app skeleton + Dockerfile + K8s manifests + CI/CD + monitoring + secrets + catalog YAML + docs. **Add database**: provision + store connection string + update config + add migration template + monitoring + backup schedule. **Configure auth**: create OIDC client → update config → add middleware → provision secrets → add integration tests. **Canary deployments**: update manifests with traffic splitting → configure progressive delivery (Argo Rollouts/Flagger) → automated rollback → canary dashboard.

## 4. Developer Experience (DX) Measurement

### DORA Metrics

Deploy frequency, lead time for changes, MTTR, change failure rate. Collect automatically from CI/CD pipeline, visible in per-team dashboards.

### SPACE Framework

Satisfaction & well-being, Performance, Activity, Communication & collaboration, Efficiency & flow. Measure via periodic surveys + tool-based telemetry.

### Friction Logging

Track: time from commit to production, onboarding time, ticket volume to platform team, time-to-first-deploy for new services, developer satisfaction (CSAT/NPS).

## 5. Platform as Product

### Mindset Shift

Project mentality: milestone-driven, finite, cost center. Product mentality: ongoing investment, adoption/satisfaction measured, backlog prioritized, roadmap communicated, user research conducted.

### Core Practices

User research and developer interviews, persona definitions (full-stack dev, SRE, data engineer, security engineer, EM), journey mapping, feedback loops, release notes, platform ROI calculation (hours saved × developer count × hourly cost − platform team cost).

### Build vs Buy

Build when: core to value proposition, deep integration needed, specific compliance requirements, full roadmap control needed. Buy when: commodity capability, 80%+ requirements met by vendor, speed critical, team lacks expertise. Middle path: extend open source (Backstage, Crossplane, Tekton, OPA/Gatekeeper).

## 6. Platform Maturity Model

**L1 Ad-Hoc**: no platform team, per-team infrastructure. **L2 Repeatable**: part-time platform team, basic templates. **L3 Defined**: dedicated team, portal deployed, golden paths, self-service provisioning, DORA metrics collected. **L4 Managed**: product management practices, 80%+ coverage, cost allocation, SLOs measured. **L5 Optimized**: competitive advantage, AI-assisted, predictive analytics, continuous experiment-driven improvement.

## 7. Platform Operations

### Platform Contract

API contract (endpoints, rate limits, versioning), SLOs for platform capabilities, onboarding commitment, deprecation policy (minimum notice + migration support), cost commitment, security commitment, support model with SLA.

### Governance vs Gatekeeping

Gatekeeping: manual approval (slow, bottleneck). Governance: automated policy enforcement (RBAC, network policies, resource quotas, compliance scans). Always bias toward governance with documented escape hatches.

### Platform Economics

Costs: headcount, infrastructure, third-party tools, developer learning time. Benefits: reduced time-to-production, faster onboarding, reduced cognitive load, standardized security, reduced duplication, improved dev satisfaction, faster feature delivery.

## 8. Key Anti-Patterns

Treating the platform as a project (finite). Building without user research. Creating bottlenecks (single team gating all changes). Ignoring adoption metrics. Building everything vs composing from existing tools. Snowflake environments. Missing escape hatches for edge cases.
