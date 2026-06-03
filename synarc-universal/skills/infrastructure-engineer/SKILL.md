---
name: infrastructure-engineer
description: Infrastructure Engineer â€” Platform Design, Migration & Operational Excellence
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---

# Infrastructure Engineer â€” Platform Design, Migration & Operational Excellence

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

Infrastructure engineering designs, operates, and evolves the platform that software runs on. Every decision affects reliability, cost, team velocity, and the ability to migrate or adapt when requirements change.


## P2 â€” CORE METHODOLOGY

### P2.1 â€” Platform Design Reasoning

Every platform architecture begins with boundary definition â€” where one environment, account, or failure domain ends and another begins.

```
ACCOUNT/TENANT STRUCTURE:
  Production: isolated from non-production â€” separate AWS account, GCP project, Azure subscription
  Staging: mirrors production configuration â€” same IaC, different variable values
  Development: shared, relaxed boundaries, cost-optimized, can use ephemeral environments
  Management/Security: centralized logging, monitoring, security tooling, audit artifacts
  Sandbox: individual developer experimentation, no production data, periodic cleanup

REGION/AVAILABILITY ZONE STRATEGY:
  Multi-AZ for high availability (minimum 3 AZs in production)
  Multi-region for disaster recovery (active-passive or active-active)
  Region selection: user proximity, regulatory requirements, service availability, cost
  AZ-aware service placement: spread across AZs, anti-affinity for critical pairs
```

**Design for failure â€” component level:**
```
For every component, answer:
  [1] What happens when this component fails?
  [2] How long until the failure is detected? (detection latency)
  [3] How long until the system recovers automatically? (MTTR auto)
  [4] How long until the system recovers with human intervention? (MTTR manual)
  [5] What data is lost? (RPO â€” Recovery Point Objective)
  [6] How long is the service unavailable? (RTO â€” Recovery Time Objective)
  [7] What is the blast radius â€” which other services are affected?
  [8] Is there a downstream dependency that makes this component single-point-of-failure?
  [9] Can this component be migrated independently or does it block other migrations?
```

**Hybrid and multi-cloud topology decisions:**
```
SINGLE-CLOUD (default): lowest complexity, deepest service integration, best for <500 services
MULTI-CLOUD (active-passive): primary cloud runs production, secondary runs DR with minimal compute
MULTI-CLOUD (active-active): both clouds serve production traffic â€” requires consistent networking, IAM, observability
HYBRID (on-prem + cloud): VPN/Direct Connect for private network extension, consistent IaC across environments
ON-PREMISE ONLY: bare metal or hypervisor, manual capacity management, no elastic scaling
```

**Decision rule:** Use single-cloud unless you have a specific regulatory, commercial, or latency requirement for multi-cloud. The operational complexity of multi-cloud is 3-5x single-cloud. Multi-cloud is a risk diversification strategy, not a cost optimization strategy.

### P2.2 â€” Networking Topology & Segmentation

Network topology determines traffic flow, latency, security boundaries, and migration complexity.

```
VPC/VIRTUAL NETWORK DESIGN:
  CIDR allocation: non-overlapping across all connected networks (on-prem, cloud, partners)
  /16 for production VPC, /20 for staging, /22 for development per region
  Reserve /24 per AZ for future expansion â€” never use full VPC CIDR from day one

SUBNET SEGMENTATION:
  Public subnets: load balancers, NAT gateways, bastion hosts, ingress controllers
  Private subnets: application servers, API runtimes, workers â€” no direct internet access
  Data subnets: databases, caches, message brokers â€” restricted to application tier only
  Management subnets: CI/CD runners, admin access, jump boxes â€” VPN/SSO gated
  Each subnet maps to a single AZ â€” never span subnets across AZs

CONNECTIVITY:
  Intra-region: VPC peering or Transit Gateway with route tables
  Cross-region: VPC peering (same account) or Transit Gateway + VPN/Gateway endpoints
  Cross-cloud: VPN (IPsec) or direct interconnect (AWS Direct Connect, GCP Interconnect, Azure ExpressRoute)
  On-premises: dedicated circuit or VPN with BGP, propagate routes via Cloud Router / Direct Connect VIFs

INGRESS PATTERNS:
  CDN (CloudFront/Cloudflare/Cloud CDN) â€” edge termination, DDoS protection, SSL termination
  WAF â€” SQL injection, XSS, rate limiting, bot detection
  Load balancer (ALB/GLB/HAProxy) â€” SSL termination, health checks, traffic distribution
  Service mesh ingress gateway â€” mTLS, traffic splitting, authN/authZ at mesh boundary
  API Gateway (Kong/AWS Gateway) â€” centralized entry, auth, rate limiting for external APIs

EGRESS PATTERNS:
  NAT Gateway (one per AZ for HA) â€” outbound from private subnets
  Proxy (Squid/HAProxy) â€” content filtering, audit logging, egress control
  VPC Endpoints (PrivateLink) â€” AWS/GCP service access without NAT
  Egress-only internet gateway (IPv6) â€” outbound-only for IPv6 workloads

DNS ARCHITECTURE:
  Internal: {service}.{environment}.{region}.internal â€” TTL 5-60s, weighted, health-check-filtered
  External: CDN with multi-origin failover, DNSSEC, CNAME flattening, alias records for root domains
  Private hosted zones: split-view DNS (internal resolution different from external)
  Service discovery: K8s CoreDNS for mesh-internal, Consul for hybrid, Cloud Map for AWS-native

LOAD BALANCING TIERS:
  L4 (NLB/HAProxy): TCP/UDP, extreme throughput, static IP, proxy protocol â€” for game servers, VoIP
  L7 (ALB/GLB): HTTP/HTTPS, path-based routing, host-based routing, weighted targets â€” for web APIs
  L7 (mesh sidecar): service-to-service load balancing with circuit breaking â€” for internal traffic
  Global (DNS-based): latency-based routing, geolocation routing, weighted routing â€” for multi-region
```

**Load balancing decision matrix:**
```
| Requirement                          | NLB/HAProxy | ALB/GLB | Mesh Sidecar | DNS GSLB |
|--------------------------------------|-------------|---------|--------------|----------|
| Static IP / whitelist-friendly       | YES         | NO      | NO           | YES      |
| Path-based routing                   | NO          | YES     | YES          | NO       |
| mTLS between services                | NO          | NO      | YES          | NO       |
| Session persistence (sticky)         | YES         | YES     | NO           | NO       |
| Cross-region traffic distribution    | NO          | NO      | NO           | YES      |
| Circuit breaking / retry budget      | NO          | NO      | YES          | NO       |
| WebSocket / gRPC streaming           | YES         | YES     | YES          | NO       |
```

### P2.3 â€” Deployment Strategies

Every deployment is a risk event. The strategy determines how much risk you accept in exchange for speed.

```
STRATEGY SELECTION MATRIX:
| Strategy      | Risk Level | Duration  | Cost  | Rollback Time | Use Case                          |
|---------------|------------|-----------|-------|---------------|-----------------------------------|
| Rolling       | MEDIUM     | Minutes   | LOW   | Minutes       | Stateless, low-risk, fast deploy  |
| Blue-green    | LOW        | Minutes   | HIGH  | Seconds       | Stateful, compliance, full verify |
| Canary        | LOW        | Hours     | HIGH  | Minutes       | High-traffic, risk-sensitive      |
| Feature flag  | LOW        | Instant   | LOW   | Instant       | User segment, instant rollback    |
| A/B testing   | LOW        | Days      | HIGH  | Minutes       | Business metric comparison        |
| Shadow        | VERY LOW   | Weeks     | VERY HIGH | Seconds    | Validate new system in production |
```

**Rolling update:**
```
Default for stateless services. Update instances in batches.
Batch size: 25% for large deployments (>10 instances), 33% for medium (3-10), 50% for small (<3)
Wait between batches: health check passes (3 consecutive), metrics stable (1 min), no error spike
Rollback trigger: error rate > +1% or p99 latency > 2x baseline for 2 consecutive batches
```

**Blue-green:**
```
Two identical environments (blue = current, green = new).
Full environment validation before traffic switch.
Switch: DNS update, load balancer target group swap, or router config change.
Rollback: switch back to blue â€” instant, full recovery.
Cost: 2x infrastructure during deployment â€” acceptable for critical services.
Database: requires backward-compatible schema (expand-migrate-contract) or dual-write.
```

**Canary:**
```
Gradual traffic shift through the service mesh or load balancer.
Phases: 1% â†’ 5% â†’ 25% â†’ 50% â†’ 100%
Each phase: minimum 10 minutes, no error budget burn, business metrics verified.
Auto-promote if all checks pass; auto-rollback if check fails.
Canary analysis: compare error rate (statistical significance), latency distribution, business KPIs.
```

**Feature flags:**
```
Decouple deployment from release. Code is deployed dark, activated by flag.
Flag types: release toggle, experiment toggle, ops toggle, permission toggle.
Flag management: centralized (LaunchDarkly/Flagsmith) with SDK caching.
Flag lifecycle: create â†’ release â†’ verify â†’ remove stale flag code (within 2 sprints).
Risk: flag debt (500 flags never removed) â€” schedule regular flag cleanup.
```

**Every pipeline:**
```
build + test â†’ staging deploy + verify â†’ production deploy â†’ post-deploy monitoring (15 min)
â†’ auto-rollback trigger (error rate > +1% or p99 > 2x baseline for 2+ consecutive checks)
â†’ rollback procedure tested < 2 min (documented, practiced, automated where possible)

ZERO-DOWNTIME: backward-compatible DB migrations (expand-migrate-contract),
drain queues before switching consumers, blue-green for stateful, dependency-ordered deployment
```

### P2.4 â€” Infrastructure as Code

Infrastructure as Code is the foundation of reproducible, auditable, and migratable infrastructure.

```
PRINCIPLES:
  Declarative desired state â€” what, not how
  Remote state with locking (S3/GCS/Azure Storage + DynamoDB/Consul/Blob lease)
  State encrypted at rest and in transit â€” never store state locally
  Never edit state manually â€” state is a contract, not a configuration file
  Modular with pinned provider/module versions â€” no floating tags
  Environment parameterization via workspaces, variable files, or terragrunt
  Secrets via secrets manager â€” never in state files (use partial state or data sources)

TOOL SELECTION:
| Tool              | Language      | State Mgmt | Multi-cloud | Best For                         |
|-------------------|---------------|------------|-------------|----------------------------------|
| Terraform         | HCL           | Native     | Yes         | General purpose, multi-cloud     |
| OpenTofu          | HCL           | Native     | Yes         | Terraform fork, no license fees  |
| Pulumi            | TS/Python/Go  | Native     | Yes         | Code-first teams, complex logic  |
| CloudFormation    | YAML/JSON/CDK | Native     | AWS only    | AWS-native, CDK for high-level   |
| CDK               | TS/Python/Java| CFn stack  | AWS only    | AWS with programming language    |
| Ansible           | YAML          | None       | Yes         | Configuration management, not infra|
| Crossplane        | K8s CRDs      | K8s etcd   | Yes         | K8s-native infra management      |

MODULE DESIGN:
  Inputs: required (resource naming, environment, VPC/subnet IDs) + optional with sensible defaults
  Outputs: service URLs, security group IDs, IAM role ARNs, log group names, DNS names
  Dependencies: explicit depends_on for ordering, data sources for existing resources
  Versioning: semver â€” major breaking changes, minor additive, patch bug fixes
  Testing: plan validation (tfsec/checkov/trivy), static analysis, integration (Terratest), policy-as-code

TERRAFORM/TOFU MODULE INTERFACE PATTERN:
  ```
  MODULE:       [name]
  SOURCE:       [registry URL, pinned version tag]

  INPUTS:
    name:               string â€” resource name prefix
    environment:        string â€” dev/staging/prod
    vpc_id:             string â€” VPC ID for resource placement
    subnet_ids:         list(string) â€” subnet IDs for multi-AZ
    instance_count:     number â€” default: 2, min/max for auto-scaling
    instance_type:      string â€” default: t3.medium
    tags:               map(string) â€” cost allocation and ownership

  OUTPUTS:
    service_url:        string â€” DNS endpoint
    security_group_id:  string â€” SG ID for dependent resources
    iam_role_arn:       string â€” IAM role ARN for app permissions
    log_group:          string â€” CloudWatch log group name

  DEPENDENCIES:
    - network: provides vpc_id, subnet_ids
    - database: provides connection string (optional, data source based on tags)
    - secrets: provides secret ARNs (optional, data source based on name)
  ```

POLICY AS CODE:
  OPA (Open Policy Agent): Rego rules for compliance, cost, security â€” evaluated in CI/CD
  Sentinel: HashiCorp-native policy framework for Terraform Cloud/Enterprise
  AWS Config Rules / Azure Policy / GCP Org Policies: cloud-native compliance enforcement
  Checkov / tfsec / Trivy: static analysis for misconfiguration, hardcoded secrets, compliance violations

STATE STRATEGIES:
  Single state file: simple, but large blast radius and slow operations â€” for <100 resources
  Split by environment: each environment has its own state â€” isolation, parallel operations
  Split by service/component: each component has its own state â€” max isolation, complex orchestration
  Terragrunt: keep code DRY, generate state config per environment from templates
```

### P2.5 â€” Capacity Planning Methodology

Capacity planning prevents predictable failures. It is not about predicting the future â€” it is about knowing when you will hit limits and having a plan before you get there.

```
FIVE-STEP METHODOLOGY:

[1] BASELINE:
  Collect peak utilization for each resource over 30-90 day window
  Metrics: CPU, memory, disk (used % and growth rate GB/month), network throughput in/out,
    connections (active + idle), RPS (total + per endpoint), API rate limit headroom
  Percentiles: P50 (typical), P95 (peak), P99 (spike) for each metric

[2] FORECAST:
  Organic growth trend: linear regression on 90-day utilization data
  Known events: product launches, marketing campaigns, seasonal peaks, compliance deadlines
  Worst-case buffer: 3x projected growth for capacity reservations, 1.5x for auto-scaling
  Formula: capacity_needed(T) = current_peak Ã— (1 + organic_growth)^T + known_events(T) + buffer

[3] TARGET UTILIZATION THRESHOLDS:
  CPU:        < 70% P95 â€” leaves headroom for traffic spikes and instance failover
  Memory:     < 75% P95 â€” GC pressure and OOM risk above 80%
  Disk:       < 80% used â€” provisioning time for storage expansion before full
  Network:    < 50% of instance/gateway throughput limit
  Connections:< 80% of max_connections or connection pool limit
  RPS:        < 60% of tested throughput capacity

[4] SCALING STRATEGY:
  Horizontal (stateless): auto-scaling with warm pool, cooldown between scale events
    Metric-based: CPU > 70% for 5 min â†’ scale out, CPU < 30% for 15 min â†’ scale in
    Request-based: RPS per instance > threshold â†’ scale out
    Schedule-based: known peak times â†’ pre-scale before event
  Vertical (stateful): database and cache instance sizing, memory-bound workloads
    RDS/Aurora: scale up during maintenance window, read replicas for read-heavy
    ElastiCache: scale up for memory pressure, cluster mode for sharding
  Predictive: ML-based scaling (AWS Auto Scaling Predictive, GCP Autoscaler Predictive)
    Analyzes historical patterns, scales ahead of demand â€” good for diurnal/seasonal patterns

[5] COST OPTIMIZATION:
  Baseline commitment: reserved instances / savings plans (30-60% discount) for stable load
  Variable load: on-demand + spot instances for burst, batch, and fault-tolerant workloads
  Right-sizing: match instance family to workload profile (compute-optimized, memory-optimized, etc.)
  Lifecycle: dev/test environments on schedule (shut down nights/weekends), use preemptible instances
```

**Capacity planning report format:**
```
SERVICE:      [name]
PERIOD:       [reporting period]

CURRENT PEAK UTILIZATION:
  CPU:        [%] â€” P50/P95/P99 â€” trend â†‘/â†’/â†“ â€” instance type [type]
  Memory:     [%] â€” P50/P95/P99 â€” trend
  Disk:       [% used, growth GB/month] â€” trend
  Network:    [throughput in/out Gbps] â€” trend
  Requests:   [RPS P50/P95/P99] â€” trend

GROWTH RATE:  [% month-over-month, % year-over-year]

FORECAST (12 months):
  Month   | CPU   | Memory | Disk  | RPS     | Connections
  Current | 50%   | 60%    | 45%   | 5000    | 200
  +3mo    | 55%   | 65%    | 50%   | 5600    | 220
  +6mo    | 60%   | 70%    | 55%   | 6300    | 245
  +12mo   | 70%   | 80%    | 65%   | 7900    | 290

RECOMMENDATIONS:
  [Action] â€” [timeline] â€” [cost impact] â€” [risk if deferred]
```

### P2.6 â€” Disaster Recovery Planning

Disaster recovery is not a document â€” it is a practiced capability. Every recovery procedure must be tested at the frequency the RTO requires.

```
RECOVERY TIERS:

TIER 1 CRITICAL (RTO < 1h, RPO < 5min):
  Active-active multi-region â€” both regions serve traffic
    Load balanced via DNS (latency-based or weighted) or global load balancer
    Database: synchronous cross-region replication or application-level dual-write
    Failover: automatic via health checks + DNS TTL 5s, tested monthly
  Active-passive with warm standby â€” passive region has running (scaled-down) infra
    Database: cross-region read replicas, promote on failover
    Failover: semi-automated with runbook, tested quarterly
    Warm standby cost: 30-50% of active region's compute + data replication

TIER 2 HIGH (RTO < 4h, RPO < 1h):
  Active-passive warm standby â€” passive region has infrastructure but no compute running
    IaC applied in passive region, databases replicating continuously
    On failover: scale up compute, update DNS, verify health
    Test semi-annually â€” full failover drill including data validation

TIER 3 STANDARD (RTO < 24h, RPO < 24h):
  Backups only â€” IaC-based restore in target region
    Daily snapshots of databases, filesystem backups, S3 versioning
    On disaster: provision infrastructure from IaC, restore from latest backup
    Test annually â€” full restore drill in isolated environment

BACKUP STRATEGY:
  Database: daily snapshots + WAL archival (PITR â€” Point-In-Time Recovery)
  Object storage: S3 versioning + cross-region replication (CRR)
  Configuration: IaC repository is the backup, CI/CD artifacts backed up
  Secrets: secrets manager with cross-region replication where supported
  Retention: daily 30d, weekly 12mo, monthly 7yr (adjust for compliance requirements)

FAILOVER PATTERNS:
  DNS-based failover: Route53 health checks â†’ failover record, TTL as low as possible (5s)
  Load balancer failover: secondary target group in DR region, health check activation
  Database failover: promote read replica to primary, update connection strings
  Cache failover: Redis Cluster auto-failover, ElastiCache multi-AZ with automatic failover
  Queue failover: SQS is regional â€” use replicated queues or drain and reprocess

CHAOS ENGINEERING:
  Purpose: validate DR procedures by introducing real failures in controlled environments
  Principles: steady-state hypothesis, blast radius limit, automated experiment, abort conditions
  Experiments: AZ failure, instance termination, network latency injection, certificate expiry,
    DNS resolution failure, dependency degradation, region unavailability
  Tooling: AWS Fault Injection Simulator, Gremlin, Chaos Mesh, Litmus
  Cadence: one experiment per week in staging, one per month in production (during low traffic)
```


## P4 â€” MIGRATION PATTERNS

### P4.1 â€” Universal Migration Methodology

Every platform migration follows the same fundamental pattern. The methodology is independent of what is being migrated.

```
MIGRATION ORDER (by dependency depth, never alphabetical or by service name):
| Phase | Layer               | Risk      | Duration  | Rollback Complexity |
|-------|---------------------|-----------|-----------|---------------------|
| 0     | Networking & Auth   | CRITICAL  | 1-4 weeks | HIGH â€” blocks all others |
| 1     | Data Layer          | HIGH      | 2-8 weeks | VERY HIGH â€” data integrity |
| 2     | Foundational Svc   | HIGH      | 2-4 weeks | MEDIUM â€” all services depend |
| 3     | Stateless Services | MEDIUM    | 4-12 weeks| LOW â€” easiest to migrate |
| 4     | Stateful Services  | HIGH      | 4-8 weeks | HIGH â€” dual-write needed |
| 5     | External-Facing    | CRITICAL  | 2-4 weeks | HIGH â€” user-facing |

DUAL-WRITE PATTERN (most critical migration technique):
| Phase  | Write Path                   | Read Path         | Comparison                    | Duration |
|--------|------------------------------|-------------------|-------------------------------|----------|
| 1. Shadow | Both (async), old is truth | Old only          | Offline diff of DB state      | 1-2 weeks|
| 2. Mirror | Both (sync), old is truth | Old only          | Real-time response comparison | 1-2 weeks|
| 3. Canary | Both (sync), new serves %| New for canary    | Continuous monitoring         | 1-2 weeks|
| 4. Cutover| New only (old read-only) | New only          | Periodic validation           | 1 month  |
| 5. Cleanup| New only                   | New only          | Remove old infra              | â€”        |

Dual-write failure modes:
  False positives drown real signals â€” tune comparison to ignore non-meaningful differences
  Write to new fails â†’ do NOT fail original request â€” async fail, alert, retry
  Backfill misses edge cases â†’ silent data loss â€” use checksum or row-count validation
  Schema drift between old and new â†’ comparison becomes unreliable â€” validate schema first

STRANGLER FIG PATTERN:
  Route-by-route migration, keeping both systems active until new system proves stable
  [1] Both gateways active, routes split by DNS or routing rule
  [2] New handles all NEW routes, old handles legacy
  [3] Route-by-route migration, comparing responses (response comparison proxy)
  [4] Old decommissioned when all routes migrated and stable for 2+ weeks

MIGRATION RISK ASSESSMENT:
| Factor                            | Risk Multiplier |
|-----------------------------------|-----------------|
| Managed service semantic gap      | +2 levels       |
| No dual-write or parallel run     | +2 levels       |
| Big-bang cutover (no strangler fig)| +2 levels      |
| Unknown implicit behaviors        | +2 levels       |
| No rollback plan                  | +3 levels       |
| Untested failure paths            | +2 levels       |
| No knowledge transfer             | +1 level        |

Every migration phase must be reversible. If you cannot rollback a phase, you are not ready to execute it.

CREATE THE DEPENDENCY GRAPH BEFORE ANY MIGRATION:
  List every service, data store, queue, cache, and external dependency
  Document which services depend on which (inbound and outbound)
  Identify migration groups: services that must move together (circular dependencies)
  Define checkpoint: state after each phase that can be maintained for 1+ weeks
```

### P4.2 â€” Cloud Provider Migration

Migrating between cloud providers is the highest-risk infrastructure migration. The key insight: managed services are never semantically equivalent â€” test every feature with production traffic patterns.

```
STRATEGY SELECTION:
| Strategy               | Success Rate | Timeline    | Cost Delta          | Best For                       |
|------------------------|--------------|-------------|---------------------|--------------------------------|
| Lift & Shift (Rehost)  | 20% services | 1-3 months  | +10-30%             | Quick wins, low complexity     |
| Lift & Optimize        | 50%          | 3-9 months  | +0-10%              | Managed equivalents available  |
| Refactor (Re-architect)| 80%          | 6-24 months | -20-40% long-term   | Heavy managed service usage    |
| Retain + Bridge        | 60%          | 1-6 months  | +10-20% dual-run    | Cannot-move services           |
| Retire (decommission)  | 95%          | 1 week      | -100%               | Unused or low-value services   |

MANAGED SERVICE SEMANTIC GAPS â€” MOST COMMON FAILURE MODES:

AWS â†’ GCP:
  SQS (pull) â†’ Pub/Sub (push) â€” different ack model, messages delivered twice after ack deadline
  SQS FIFO â†’ Pub/Sub ordered â€” FIFO guarantees message order + exactly-once; ordered delivery is best-effort without grouping key
  DynamoDB â†’ Firestore/Bigtable â€” DynamoDB consistent single-digit-ms at any scale; Firestore strong consistency limited to 1 document write/second
  S3 â†’ Cloud Storage â€” S3 strong consistency (since 2020); Cloud Storage eventually consistent for some metadata operations
  Lambda (15min) â†’ Cloud Functions (9min) â€” timeout on batch processing workloads causes silent failures
  Kinesis â†’ Pub/Sub pull + Dataflow â€” different seek model for replay, reprocessing semantics differ

AWS â†’ Azure:
  S3 â†’ Blob Storage â€” S3 prefix-based partitioning; Azure Blob has different partition scheme (flat namespace for hot tier)
  Lambda â†’ Azure Functions â€” different scaling model, consumption plan vs premium plan, cold start differences
  DynamoDB â†’ Cosmos DB â€” DynamoDB's consistent secondary indexes vs Cosmos DB's indexing policy
  CloudWatch â†’ Azure Monitor â€” completely different metric and log query language â€” costly migration
  IAM â†’ Azure RBAC â€” IAM is resource-based, RBAC is role-based with different inheritance model

GCP â†’ AWS:
  BigQuery â†’ Redshift â€” different SQL dialects, partitioning, clustering, and pricing models
  Cloud Run â†’ ECS Fargate â€” different request handling model, concurrency model, scale-to-zero behavior
  Cloud Spanner â†’ Aurora Global Database â€” different consistency models and replication behavior

SERVICE-LEVEL MIGRATION DECISION:
| Characteristic                      | Best Strategy               |
|-------------------------------------|------------------------------|
| Stateless, single-purpose API       | Lift & Shift (fastest)       |
| Stateful (DB + app same VM)         | Managed DB + stateless app â†’ Replatform |
| Heavy managed service usage         | Find equivalent and test thoroughly, or Refactor |
| Low traffic, stable                 | Leave or Lift & Shift        |
| High traffic, latency-sensitive     | Co-location analysis needed  |
| No owner, no tests                  | Keep until decommissioned â€” rewrite = disaster |

MIGRATION PHASES:
  Phase 1: Set up networking, VPN/DirectConnect between clouds, dual observability
  Phase 2: Replicate data â€” cross-cloud DB replicas, S3 replication, queue mirroring
  Phase 3: Migrate stateless services â€” one service at a time, traffic splitting via DNS or mesh
  Phase 4: Migrate stateful services â€” dual-write for event-driven, blue-green for DB
  Phase 5: Cutover external traffic â€” DNS TTL reduction 48h before, monitor, rollback window of 24h
  Phase 6: Decommission old cloud â€” keep read-only access for 30 days for data validation
```

### P4.3 â€” CI/CD Platform Migration

CI/CD migration is deceptively difficult because pipelines contain implicit knowledge. The pipeline that "just works" has accumulated months of edge case handling.

```
PIPELINE CLASSIFICATION:
| Type                      | Action                                          | Effort   |
|---------------------------|-------------------------------------------------|----------|
| SIMPLE (linear, <50 lines)| Rewrite from scratch                            | 1-2 hours|
| COMPLEX (conditional, parallel, gates) | Rewrite with same logic, optimize structure | 1-2 days |
| MONOLITHIC (multi-job DAG, shared artifacts) | Break into separate workflows + shared actions | 2-5 days |
| UNUSED (no runs in 6+ months) | Archive â€” do not migrate                  | 1 hour   |

THE CACHE PROBLEM:
  Jenkins with shared slaves: npm install runs once, cache persists across builds
  GitHub Actions / GitLab CI: fresh VM every run â€” without caching, 10-min install becomes 10-min every build
  Fix: always cache on lockfile hash (package-lock.json, go.sum, requirements.txt), never on package.json
  Docker layer caching: cache registry or inline cache for multi-stage builds
  Gradle/Maven cache: ~/.gradle or ~/.m2 on ephemeral runners â€” cache per branch

PLATFORM-SPECIFIC GAPS:
| Gap                    | Jenkins (old)            | GitHub Actions (new)   | Mitigation                        |
|------------------------|--------------------------|------------------------|-----------------------------------|
| Shared workspace       | Persistent slave workspace| Ephemeral runner       | Artifact upload/download between jobs |
| Plugin ecosystem       | 1800+ plugins             | 200+ actions           | Replace with composite actions or scripts |
| Matrix builds          | Poor (metaprogramming)    | strategy.matrix        | Use matrix for known combinations  |
| Secrets                | Credentials plugin        | Encrypted secrets      | Migrate secrets, verify decryption |
| Pipeline parameters    | Build with parameters     | workflow_dispatch inputs| Redesign parameter UX             |

MIGRATION CHECKLIST:
  PRE:
    Inventory all pipelines â€” include inactive, untriggered, and scheduled pipelines
    Document actual usage (last 6 months of runs) â€” what triggers actually fire
    Record baseline build times per pipeline for comparison
    Map all secrets used by each pipeline
    Identify manual gates and approval steps â€” cannot be automated, must be configured in new platform
    List all plugins/actions with versions â€” find equivalents or plan replacements
  MIGRATION (per pipeline, in dependency order):
    Create shared actions/modules first â€” matrix builds, deployment, notifications, rollback
    Migrate one pipeline at a time â€” start with simplest, least critical
    Parallel-run old + new for 1 week (manual trigger comparison)
    Compare build times: new should not be >20% slower than old
    Test all failure paths: what happens when a step fails? Are notifications sent?
    Verify all triggers: push, PR, schedule, webhook, manual â€” each in isolation
    Verify secret decryption in each pipeline â€” common failure point
  POST:
    Monitor build failure rate for 2 weeks â€” compare to pre-migration baseline
    Verify all notifications are reaching correct channels
    Archive old CI configuration (do not delete for 6 months)
    Update deployment and incident runbooks
    Train team: new pipeline format, debugging, approval flows

GITOPS MIGRATION PATTERN:
  If migrating to GitOps (ArgoCD/Flux), add a transition period:
  [1] Old CI deploys directly to environment
  [2] New CI pushes manifest changes to Git repository
  [3] ArgoCD/Flux reconciles cluster state from Git
  [4] Parallel-run: old CI deploys to staging, GitOps deploys to canary
  [5] Cutover: disable old CI direct deployment, GitOps manages all environments
```

### P4.4 â€” Container Platform Migration (Compose â†’ K8s)

Migrating from Docker Compose to Kubernetes is one of the most common container platform migrations. The key insight: Compose features do not map one-to-one to K8s.

```
CRITICAL GAPS:
| Compose Feature     | K8s Equivalent           | Gap                                                       |
|---------------------|--------------------------|-----------------------------------------------------------|
| depends_on          | Init containers          | Init containers do not wait for service readiness â€” write init container that polls /health |
| links               | Service DNS              | Different hostname patterns (service.namespace.svc.cluster.local) |
| volumes (bind mount)| hostPath + PVC           | hostPath only works on same node â€” use PVC for multi-node |
| networks (default)  | kube-dns / CoreDNS       | Different DNS resolution behavior, search domain differences |
| restart: always     | restartPolicy: Always    | Pod restart count resets on node reboot â€” use StatefulSet for persistent identity |
| healthcheck         | liveness + readiness     | No healthcheck distinction in Compose â€” readiness = ready for traffic, liveness = restart |
| env_file            | envFrom + ConfigMap      | Env files support comments (#), ConfigMap values cannot contain # |
| container_name      | Pod name (via metadata)  | Pod names include random suffix â€” use metadata.name + statefulset.tv|
| ports               | Service (ClusterIP + LB) | Compose exposes directly; K8s requires Service resource    |
| deploy.resources    | resource requests/limits | Different format, QoS classes                               |
| deploy.replicas     | replicas in Deployment   | Compose replicas on single host; K8s distributes across nodes |

STARTUP ORDER PATTERN:
  K8s has no built-in depends_on â€” implement via init containers + readiness probes:
  Init container: poll dependency health endpoint with retry and timeout
    ```
    spec:
      initContainers:
      - name: wait-for-db
        image: busybox
        command: ['sh', '-c', 'until nc -z mydb:5432; do echo waiting for db; sleep 2; done;']
    ```
  Readiness probe: report ready only when application can serve traffic (has established DB connection, cache connection)
  PodDisruptionBudget: ensure minimum availability during rolling updates and node drains

VOLUME MIGRATION TRAPS:
| Type        | Persistence      | Gotcha                                                   |
|-------------|------------------|----------------------------------------------------------|
| emptyDir    | Lost on pod restart | Files disappear when pod moves to another node         |
| hostPath    | Persistent on node  | Pod must run on specific node â€” use nodeSelector       |
| PVC         | Persistent       | Must be created before pods â€” reclaim policy matters    |
| ConfigMap   | Updated eventually | SubPath mounts do not auto-update on ConfigMap change |
| CSI (EBS)   | Persistent       | Provisioning and snapshots are CSI driver specific      |

MIGRATION PHASES:
  [1] Containerize (if not already) â€” all services must have Dockerfiles
  [2] Extract configuration from Compose files to structured format (Helm/Kustomize manifests)
  [3] Run parallel: Compose + K8s for 2-4 weeks â€” compare behavior, logs, metrics
  [4] Migrate service-by-service: stateless first, stateful last
  [5] Decommission Compose â€” keep configuration files for 3 months reference

NETWORKING GOTCHAS:
  Compose containers communicate over bridge network with service name DNS resolution
  K8s pods communicate over cluster network with service DNS resolution
  Differences: search domains, DNS policy (ClusterFirst vs Default), pod-network vs service-network
  Headless services: use when application needs direct pod IPs (for clustering protocols)
  External access: Ingress or LoadBalancer Service â€” not direct port exposure

CONFIGURATION MIGRATION:
  Compose env_file â†’ ConfigMap (non-sensitive) + Secret (sensitive)
  Compose environment section â†’ ConfigMap/Secret with envFrom
  Compose context/build â†’ container registry + imagePullSecrets
  Compose secrets â†’ K8s Secrets (sops-encrypted in Git or external secrets operator)
```

### P4.5 â€” Database Migration

Database migrations carry the highest data integrity risk. The zero-downtime pattern requires dual-write capability in the application.

```
STRATEGY SELECTION:
| Type                    | Downtime   | Risk      | Best For                               |
|-------------------------|------------|-----------|----------------------------------------|
| Offline dump/restore    | Hours-days | Low       | Small DBs, maintenance windows OK      |
| Logical replication     | Minutes    | Medium    | Zero-downtime required, same engine    |
| ETL tool                | Min-hours  | Med-High  | Migration with schema changes          |
| Dual-write application  | Zero       | High      | Mission-critical, cannot afford downtime|
| Blue-green DB promote   | Minutes    | Medium    | Same engine upgrade (e.g., PG 14â†’15)   |

ZERO-DOWNTIME MIGRATION PHASES:
  [1] Schema creation on new DB â€” no data yet, fast and reversible
  [2] Historical data migration â€” export, transform, import; validate with row count + column checksum
  [3] Dual-write â€” application writes to both; old DB is source of truth; comparison worker validates
  [4] Enable constraints on new DB â€” foreign keys, unique constraints; fix violations (there will be some)
  [5] Catch-up replication â€” run both in parallel; profile query performance on new system
  [6] Read traffic cutover â€” 10% â†’ 50% â†’ 100% of read queries; monitor latency and error rate
  [7] Write traffic cutover â€” switch writes to new DB; keep old in read-only for 2 weeks
  [8] Decommission â€” archive old DB connection string for 30 days, keep snapshot for compliance

MONGO â†’ POSTGRESQL DECISION TREE:
  Fixed schema â†’ PostgreSQL table with typed columns
  Variable schema (<20% rows differ) â†’ PostgreSQL table + JSONB column
  Variable schema (>20% differ) â†’ Keep in MongoDB, replicate subset for relational queries
  Array fields â†’ JSONB (if always read together) or join table (if individual access needed)
  Sub-documents â†’ JSONB (if always read together) or separate table (if relational queries)
  References â†’ Foreign keys with indexes on FK columns
  Embedded documents â†’ JOIN or related table depending on query patterns

DATABASE ENGINE UPGRADE (same provider):
  Blue-green: promote read replica from old engine version to new
    [1] Create read replica with new engine version from current primary
    [2] Promote read replica to primary after replication confirms no lag
    [3] Update application connection strings
    [4] Keep old primary as read replica for 1 week rollback window
  In-place: direct engine version upgrade
    Downtime: 5-30 minutes depending on DB size
    Risk: breaking SQL changes between major versions
    Required: test upgrade on staging with production data subset first

DATABASE MIGRATION ROLLBACK:
  Pre-migration: full backup of old DB (pg_dump, mysqldump, or snapshot)
  During cutover: keep old DB in read-only â€” application can read from old if new has issues
  Rollback decision: < 1 hour after write cutover â†’ switch writes back to old, re-point reads
  Rollback decision: > 1 hour â†’ too much data divergence â€” treat as failed migration, reconcile data
```

### P4.6 â€” Secrets & Configuration Migration

Secrets migration follows a "one secret at a time" pattern with fallback to the old source. This minimizes blast radius if the new secrets platform has issues.

```
AUDIT PHASE:
  Find ALL secrets across all locations:
    Environment variables in CI/CD (GitHub Actions secrets, GitLab CI variables, Jenkins credentials)
    .env files in repositories (check git history for committed secrets)
    Configuration files (application.yml, config.js, database.yml)
    Hardcoded strings in source code (API keys, passwords, connection strings)
    Cloud provider parameter stores (SSM, Parameter Store, AppConfig)
    Runtime environment variables on servers (docker-compose.env, /etc/environment)
    Secrets managers (Vault, Secrets Manager, K8s Secrets, SOPS)

CLASSIFICATION:
  PUBLIC: no sensitivity, safe in repository â€” version, public hostname, feature flag names
  CONFIG-ENV-SPECIFIC: per-environment but not sensitive â€” DB hostname, queue names, service endpoints
    Store: cloud Parameter Store, ConfigMap, Consul KV â€” environment-specific hierarchy
  SECRET-STATIC: sensitive, rarely changes â€” API keys, TLS certs, shared secrets
    Store: Secrets Manager, Vault (KV), SOPS in Git with KMS â€” encrypted, access-controlled
  SECRET-ROTATED: sensitive, changes periodically â€” database passwords, service account keys
    Store: Vault (dynamic secrets), Secrets Manager (scheduled rotation), K8s External Secrets Operator

CONFIGURATION HIERARCHY:
  Cloud-agnostic pattern:
    Default config in code repository (base values for all environments)
    Environment-specific overrides in Parameter Store (prod values, different from staging)
    Secrets in Secrets Manager (never in code repository, never in config files)
  K8s pattern:
    ConfigMap for non-sensitive per-environment config
    Secret for sensitive values (sops-encrypted in Git, or External Secrets Operator â†’ Vault/Secrets Manager)
    Helm values per environment in separate file, sealed with sops if they contain secrets

MIGRATION PATTERN (one secret at a time):
  [1] Create new secret in target platform (Secrets Manager, Vault, K8s Secret)
  [2] Deploy application update: read from new source first, fall back to old source
  [3] Instrument: log which source was used (new or fallback) â€” metric with source tag
  [4] Alert on fallback: any fallback usage means migration is not complete or secret is wrong
  [5] After 1 week with zero fallback accesses: remove fallback code and old secret entry
  [6] Enable rotation: configure automatic or lease-based rotation
  [7] Verify: service handles rotation without restart (polling or watch mechanism)

ROTATION VERIFICATION:
  Test old secret expiry â†’ service degrades gracefully, does not crash or leak stack traces
  Test secret revocation â†’ service detects revocation and refreshes
  Test rotation during peak traffic â†’ no errors, no latency spikes
  Monitor: credential age metrics, rotation events, access denied errors
```

### P4.7 â€” Observability Platform Migration

Observability migration is as much a people problem as a technical one. Invest in knowledge transfer before touching production.

```
CRITICAL: KNOWLEDGE TRANSFER FIRST
  Identify all active alerts â€” what triggers them, what the correct response is
  Document what each alert signified â€” many alerts have become cargo-cult thresholds
  Create query language translation guide â€” PromQL â†’ Datadog â†’ Honeycomb â†’ CloudWatch Logs Insights
  Train engineers with real incident data â€” replay past incidents on new platform
  Run parallel observability for 2-4 weeks â€” compare metric values and alert triggers

PLATFORM COMPARISON:
| Feature       | Datadog         | Grafana Cloud       | Honeycomb           | Self-Hosted OTel    |
|---------------|-----------------|---------------------|---------------------|---------------------|
| Setup time    | Hours           | Hours               | Days                | Weeks               |
| Learning curve| Low             | Medium (PromQL)     | Low-Medium          | High                |
| Cost          | $$$$            | $$                  | $$$                 | $ (compute+storage) |
| Metrics       | Datadog Agent   | Prometheus + Mimir  | Honeycomb Metrics   | Prometheus + Mimir  |
| Logging       | Datadog Logs    | Loki                | â€”                   | Loki + fluentbit    |
| Tracing       | APM agent       | Tempo               | Native (OTel)       | Jaeger/Tempo        |
| Alerting      | Monitors        | Ruler + Grafana     | Boomerang           | Alertmanager        |
| Dashboards    | Datadog UI      | Grafana             | Query-based         | Grafana             |

MIGRATION PHASES:
  [1] Dual ingestion: send ALL telemetry to both platforms for 2-4 weeks
    Deploy agent/collector that forwards to both old and new backends
    Compare metric values: same interval, same aggregation â€” identify differences
    Compare alert triggers: does the same condition fire in both? Are thresholds equivalent?
  [2] Dashboard migration: rebuild each dashboard on new platform
    Improve while migrating â€” do not copy bad dashboards; redesign for clarity
    Validate: for same time range, do key panels show the same values (Â±5%)?
    Tag: original dashboard name, migrated date, owner â€” track migration progress
  [3] Alert migration: one severity tier at a time â€” lowest first (P3/P4 â†’ P2 â†’ P1/P0)
    Create alert in new platform, verify trigger, disable old alert, monitor 7 days
    Keep P1/P2 alerts on old platform the longest â€” last to migrate, first to preserve
  [4] Alert cleanup: 30% of alerts will not need migration (no one looks at them)
  [5] Decommission: after 4+ weeks of parallel run with zero issues

SELF-HOSTED OBSERVABILITY (Prometheus + Grafana + Loki + Tempo):
  Pros: full control, no per-metric cost, data sovereignty, air-gapped environments
  Cons: operational burden (upgrades, scaling, retention management), complex high-availability
  Scale thresholds:
    <1M series: single Prometheus + Grafana + Loki single binary
    1M-10M series: Thanos or Mimir for metrics, Loki microservices, Tempo for traces
    >10M series: dedicated team managing observability infrastructure
  Retention: Prometheus TSDB limits â€” use Thanos/Mimir for long-term storage (S3/GCS)
  Cost comparison (1M series, 100GB logs/day, 500 spans/sec):
    Self-hosted: ~$500-1500/month compute + storage
    Datadog: ~$15,000-25,000/month (Pro plan, 1 year commitment)
    Grafana Cloud: ~$3,000-8,000/month (depending on usage tiers)
```

### P4.8 â€” API Gateway Migration

API gateway migration is about behavioral equivalence, not feature parity. Rate limiting, caching, and authentication behaviors differ in subtle ways between gateways.

```
KEY DIFFERENCES BY PLATFORM:
| Feature         | Kong                 | AWS API Gateway    | Envoy              | Nginx               |
|-----------------|----------------------|--------------------|--------------------|---------------------|
| Rate limiting   | Plugin (Redis)       | Per-key per-region | Envoy filter       | limit_req module    |
| Auth plugins    | 40+ (OIDC, JWT, OAuth2) | Cognito, Lambda authorizer | External auth filter | Custom Lua    |
| Caching         | Plugin (Redis/memory)| API Gateway cache  | External cache     | proxy_cache         |
| Canary routing  | Plugin (weighted)    | Canary release     | Weighted routing   | split_clients       |
| Custom plugins  | Lua/Go/Python        | Lambda             | WASM/Lua           | Lua                 |

RATE LIMITING â€” MOST COMMON MIGRATION FAILURE:
| Platform       | Scope                    | Default Window | Distributed? |
|----------------|--------------------------|----------------|--------------|
| Kong           | Per-instance (or Redis)  | Configurable   | Yes with Redis |
| AWS API Gateway| Per-client per-region    | 1s fixed       | Regional       |
| Cloudflare     | Per-IP per-edge          | 60s fixed      | Global edge    |
| Nginx          | Per-worker               | Sliding window | No           |

Fix: Audit all rate limiting configs before migration. Create compatibility matrix of current vs target behavior. Test with production traffic patterns, not synthetic benchmarks.

HEADER AND PROTOCOL BEHAVIOR:
  Header forwarding: which headers are passed through, which are modified, which are stripped
  WebSocket upgrade: does the target gateway support WebSocket? Connection upgrade headers?
  gRPC: does the target support HTTP/2 and gRPC-Web? Content-type handling?
  CORS: preflight handling, allowed origins, allowed methods, exposed headers
  Request/response transformation: body size limits, encoding conversion, header injection

MIGRATION PATTERN:
  [1] Deploy new gateway in parallel with old â€” both receive traffic
  [2] Route subset of traffic (5% â†’ 25% â†’ 50% â†’ 100%) through new gateway
  [3] Compare: response status codes, latency, error rates between old and new
  [4] Enable same plugins/middleware on new gateway â€” verify behavior parity
  [5] Cutover: switch all traffic to new gateway, keep old as fallback with DNS change
  [6] Rollback window: 48 hours â€” DNS TTL pre-reduced to 60s before cutover
```


## P6 â€” ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Pets vs cattle but with pets | Manually patching, naming, and SSHing into individual instances â€” configuration drifts, state is fragile | Immutable infrastructure â€” replace, never repair. Every instance is disposable |
| Config drift | Manual SSH changes that are not in IaC â€” state diverges until the infrastructure architecture document is fiction | All changes through IaC â€” CI/CD for infrastructure, no console access for production |
| Single points of failure | One NAT gateway, one load balancer, one database in one AZ â€” a single failure takes down the service | Multi-AZ for all critical components, at least 2 of everything, anti-affinity placement |
| Snowflake environments | Staging and production differ â€” "works on staging but not in prod" because configuration values differ | IaC with parametrized modules â€” same configuration template, environment-specific values |
| No runbooks | Alerts fire but no one knows what to do â€” incident response is ad-hoc, MTTR is measured in hours not minutes | Every alert has a runbook, runbooks are tested quarterly, runbooks are part of deployment review |
| Over-provisioning | 8xlarge instances for a service that uses 5% CPU â€” paying 10x for idle capacity | Right-size based on 95th percentile metrics, auto-scaling for variable load, regular right-sizing reviews |
| Under-provisioning | Optimizing cost below reliability requirements â€” constant CPU pressure, OOM kills during traffic spikes | Cost-efficiency within reliability SLOs, not cost at any cost. Budget for reliability headroom |
| Manual failover testing | DR plan exists but has never been tested â€” will fail when needed because of undocumented assumptions | Automated failover testing quarterly, full DR drill annually, chaos experiments for critical failure modes |
| Secret sprawl | Same database password in 15 different config files, 3 CI/CD systems, and a wiki page â€” cannot rotate without missing one | Secrets manager with rotation and audit, applications fetch secrets at runtime from a single source |
| Infrastructure spreadsheet | Resource inventory in a shared spreadsheet â€” always out of date, never accurate | IaC state is the source of truth, tagging for inventory, automated resource discovery |
| Assume semantic equivalence | Migrating between platforms assuming identical behavior â€” production incidents from subtle differences | Test every feature with production traffic patterns, dual-write validation, behavioral comparison |
| Big-bang cutover | Everything moves at once â€” no fallback if new platform fails, rollback means full revert of entire migration | Strangler fig, route-by-route, one service at a time. Every phase must be individually reversible |
| Alphabetical migration | Migrating services in alphabetical order â€” ignores dependency graph, breaks things downstream | Migrate by dependency depth: data first, then services that depend on it, then external-facing |
| Skip dual-write | Migrating stateful services without dual-write â€” miss semantic gaps until users report data corruption | Always dual-write on stateful migrations, compare writes, validate consistency before cutover |
| Ignore cache in CI migration | Moving CI platforms without equivalent caching â€” builds 2-10x slower on ephemeral runners | Cache on lockfile hash (not branch name), warm runner pools, Docker layer caching |
| No knowledge transfer | Migrating observability platforms without training â€” team cannot read dashboards or investigate incidents | Train before migration, create query language translation guides, run parallel systems, replay incidents |
| Migrate unused services | Spending time and effort migrating services that nobody uses and nobody maintains | Audit actual usage first, archive unused, decommission before you migrate |
| Trust vendor docs | Migrating based on vendor documentation â€” docs describe ideal scenarios, not behavioral edge cases | Test with production traffic patterns, run parallel validation, probe edge cases |
| No rollback plan | Every migration phase must have a documented rollback â€” if you cannot rollback, you cannot execute | Document rollback per phase, test rollback procedures, define abort criteria before starting |
| Flag debt | 500 feature flags accumulated over 2 years â€” no one knows which flags are active, dead code everywhere | Schedule regular flag cleanup (every 2 sprints), remove stale flags, flag retirement is part of definition of done |
| Mesh for 5 services | Installing a full service mesh for 5 microservices â€” massive complexity for minimal benefit | Use cert-manager + language-native mTLS for <20 services. Mesh adds value at scale (20+) |
| Dashboard museum | 200 dashboards, 80% never viewed. Every dashboard created is a maintenance burden | Dashboard lifecycle: create â†’ validate â†’ promote â†’ archive. Archive any unviewed dashboard after 90 days |
| Gold-plated DR | Tier 1 DR (active-active, RTO<1h) for a service that can tolerate 24 hours of downtime | Match DR tier to business requirements. Not every service needs active-active multi-region |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every infrastructure component, deployment strategy, DR plan, and migration phase.*

*Escalate to architect when: cloud provider selection, multi-region architecture, network topology for org-wide systems, or infrastructure cost exceeding budget by > 20%.*
