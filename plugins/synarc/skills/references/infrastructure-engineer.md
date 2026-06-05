---
title: "Infrastructure Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - infrastructure-engineer
  - platform-design
  - networking
  - deployment-strategies
  - capacity-planning
  - disaster-recovery
  - iac
  - kubernetes
  - service-mesh
  - migration
  - cost-optimization
  - secrets-management
---

# Purpose

Design, operate, and evolve the platform that software runs on — every decision affects reliability, cost, team velocity, and migratability. Design for failure, reproducibility, observability, self-healing, and safe migration.

# Scope

Platform design reasoning, networking topology, deployment strategies, capacity planning, disaster recovery, infrastructure as code, container orchestration (K8s), service mesh, CI/CD architecture, migration patterns, configuration & secrets management, cost optimization. Inherits synarc core.

# Inputs

Application architecture, traffic patterns, compliance requirements, growth projections, existing infrastructure topology, cost data.

# Output

Platform architecture designs, IaC modules, DR plans, capacity models, migration plans, cluster configurations, cost-optimized infrastructure.

## 1. Platform Design Reasoning

### Account/Network Structure

Production isolated (separate cloud account), staging mirrors production config, development shared and cost-optimized. Multi-AZ minimum 3 AZs in production. Multi-region for DR (active-passive or active-active).

### Design for Failure — Per Component

[1] What happens on failure? [2] Detection latency? [3] MTTR auto? [4] MTTR manual? [5] RPO? [6] RTO? [7] Blast radius? [8] Downstream SPOF? [9] Can it migrate independently?

Decision rule: single-cloud unless specific regulatory/commercial/latency need. Multi-cloud complexity is 3-5x single-cloud; it is risk diversification, not cost optimization.

## 2. Networking Topology

VPC CIDR: /16 for prod, /20 for staging, /22 for dev per region. Reserve /24 per AZ. Subnet segmentation: public (LBs, NAT, bastion), private (apps, workers), data (DBs, caches, brokers), management (CI/CD, admin).

Connectivity: intra-region via Transit Gateway, cross-region via peering/VPN, cross-cloud via IPsec/DX. Ingress: CDN → WAF → LB → mesh gateway → API Gateway.

DNS: internal `{service}.{env}.{region}.internal` (TTL 5-60s), external CDN multi-origin with DNSSEC.

## 3. Deployment Strategies

| Strategy | Risk | Rollback Time | Use Case |
|----------|------|---------------|----------|
| Rolling | MEDIUM | Minutes | Stateless |
| Blue-green | LOW | Seconds | Stateful, compliance |
| Canary | LOW | Minutes | High-traffic |
| Feature flag | LOW | Instant | User segments |
| Shadow | VERY LOW | Seconds | Validate new system |

Rolling: 25% batch (large), 33% (medium), 50% (small). Wait for health check. Rollback on error rate > +1% or p99 > 2x baseline.

Pipeline: build+test → staging deploy+verify → prod deploy → post-deploy monitoring (15min) → auto-rollback on degradation.

## 4. Infrastructure as Code

### Principles

Declarative desired state. Remote state with locking (S3/DynamoDB, GCS, Azure Storage + Blob lease). State encrypted. Never edit state manually. Modular with pinned versions. Environment parameterization. Secrets via secrets manager.

### Tool Selection

Terraform/OpenTofu (general multi-cloud), Pulumi (code-first), CDK (AWS-native), Ansible (config mgmt), Crossplane (K8s-native infra).

### Module Design

Required inputs: name, environment, VPC/subnet IDs. Outputs: service URLs, SG IDs, IAM role ARNs, DNS names. Semver versioning. Testing: plan validation (tfsec/checkov/trivy), static analysis, integration (Terratest), policy-as-code (OPA).

## 5. Capacity Planning

### Five-Step Methodology

[1] Baseline: collect P50/P95/P99 utilization over 30-90 days (CPU, memory, disk, network, connections, RPS). [2] Forecast: organic growth trend + known events + 3x buffer for reservations, 1.5x for auto-scaling. [3] Target thresholds: CPU < 70% P95, memory < 75%, disk < 80%, network < 50%, connections < 80%, RPS < 60%. [4] Scaling: horizontal (stateless, metric/schedule/predictive), vertical (stateful DB/cache), spot for batch/burst. [5] Cost optimization: reserved instances for baseline (30-60% discount), right-sizing, lifecycle scheduling.

## 6. Disaster Recovery

### Recovery Tiers

**Tier 1 CRITICAL** (RTO < 1h, RPO < 5min): active-active multi-region or warm standby. Failover tested monthly. **Tier 2 HIGH** (RTO < 4h, RPO < 1h): warm standby, IaC applied, DB replicating — test semi-annually. **Tier 3 STANDARD** (RTO < 24h, RPO < 24h): backups + IaC restore — test annually.

Backup: daily snapshots + WAL for PITR, S3 versioning + CRR, IaC repo is backup. Retention: daily 30d, weekly 12mo, monthly 7yr.

## 7. Container Orchestration (Kubernetes)

Managed control plane (EKS/AKS/GKE) for >95% of teams. Multi-AZ control plane (3 nodes across 3 AZs). Node architecture: managed node groups (default), Fargate (burst/batch), spot (50-70% cost reduction).

QoS: Guaranteed (requests == limits), Burstable (requests < limits, most common), BestEffort (no limits, OOM first). HPA for scaling, VPA for sizing recommendations. Cluster autoscaler for node elasticity.

Cluster patterns: single large (<100 services, strong governance), per-environment (dev/prod isolation), per-team (500+ engineers), per-workload (PCI/HIPAA separation).

## 8. Service Mesh Decisions

Use when: mTLS compliance, fine-grained traffic routing, >20 services, platform-level circuit breaking. Do NOT use when: <20 services, single-language stack, startup phase, simple topology.

| Feature | Istio | Linkerd | Cilium | Consul |
|---------|-------|---------|--------|--------|
| Latency | 5-15ms | 0.5-2ms | <0.5ms | 3-10ms |
| Complexity | Very High | Low | Low-Med | Medium |
| Data plane | Envoy | Rust proxy | eBPF | Envoy |

Rollout: per-namespace, never global — start with infra, then staging, then canary prod, per-service.

## 9. Observability Infrastructure

Three pillars: **Metrics** (USE for resources, RED for services), **Logs** (structured JSON, never log secrets/PII), **Traces** (OpenTelemetry, W3C Trace Context). Pipeline: agent (fluentbit/OTel Collector) → gateway → backend (Prometheus/Loki/Tempo or Datadog/Grafana Cloud).

Alerting: Alertmanager with routing by severity/service. Every alert must have a runbook. Burn rate alerting with MQL (multi-window multi-burn-rate). Dashboard principle: answers questions within 5 seconds.

## 10. Configuration & Secrets Management

Classification: PUBLIC (in repo), CONFIG-ENV (Parameter Store/ConfigMap), SECRET-STATIC (Secrets Manager/Vault), SECRET-ROTATED (Vault leases, auto-rotation).

Rotation pattern: create new version → update consumers → verify all on new → deprecate old → delete after 2x rotation period.

## 11. Cost Optimization Framework

[1] Visibility: tag everything, allocation per team/service, budgets at 80/90/100% alerting. [2] Right-sizing: match instance family to workload (general/compute/memory/GPU). [3] Commitment discounts: reserved instances/savings plans for stable load (30-60% off). [4] Storage tiering: gp3 for high IOPS, st1 for throughput, Glacier for archive. [5] Serverless trade-offs: Lambda cheap at low volume, expensive above ~1000 RPS sustained.
