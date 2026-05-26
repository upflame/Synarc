---
title: Platform Migration & Integration Patterns — Practical Reference
type: reference
status: active
version: 4.0.0
updated: 2027-05-25
owner: synarc-core
tags:
  - platform
  - migration
  - integration
  - cloud
  - infrastructure
  - devops
  - universal
---

# Platform Migration & Integration Patterns

## Purpose
I provide real-world patterns for moving systems between platforms and evolving infrastructure — distilled from production incidents.

## Scope
Cloud provider, CI/CD, container, API gateway, database, secrets, monitoring, and event bus migrations. Does not cover application-level refactoring.

## Inputs
Current platform architecture, target platform requirements, dependency graph, compliance requirements.

## Output
Migration plan with risk assessment, rollback strategy, and adapter patterns.

## Schema
Numbered migration pattern sections (1-19) followed by adapter pattern sections (20-29).

## Notes
Every pattern includes the failure mode when you skip the hard parts.

---

## 1. Cloud Provider Migration — The "Lift and Shift" Trap

### Real Problem

Company acquired a startup with 200 microservices on AWS. Decision: move to GCP to consolidate billing. Executive order: "lift and shift, 3 months." Reality: 14 months, 3 major outages, 40% cost overrun. The "lift and shift" of one service that used SQS → Pub/Sub caused a 6-hour production outage because Pub/Sub delivery semantics differ in subtle ways (at-least-once vs exactly-once guarantees, ack deadlines, message ordering).

### Migration Strategies Ranked by Pain

| Strategy | Description | Success Rate | Timeline | Cost Delta | Failure Mode |
|----------|-------------|--------------|----------|------------|--------------|
| Lift & Shift (Rehost) | Move VMs/images as-is | 20% (services), 70% (VMs) | 1-3 months | +10-30% (unoptimized) | Networking, IAM, managed services mismatch |
| Lift & Optimize (Replatform) | Move to managed equivalents | 50% | 3-9 months | +0-10% | Semantic gaps in managed services |
| Refactor (Re-architect) | Rewrite to native services | 80% | 6-24 months | -20-40% (long-term) | Timeline blowout, scope creep |
| Retain + Bridge | Keep some on source, bridge via VPN/peering | 60% | 1-6 months | +10-20% (dual-run) | Latency, data transfer costs, operational fragmentation |
| Retire | Decommission unused services | 95% | 1 week | -100% | Requires actually knowing what runs in production |

### Service-by-Service Migration Decision Matrix

| Service Characteristic | Lift & Shift | Replatform | Refactor | Keep |
|---|---|---|---|---|
| Stateless, single-purpose API | ✅ Fastest path | 🟡 If managed DB exists | ❌ Overkill | — |
| Stateful (DB + app in same VM) | 🟡 Works but anti-pattern | ✅ Managed DB + stateless app | ✅ Best long-term | — |
| Heavy AWS managed service usage | ❌ Will break | 🟡 Find equivalent, test thoroughly | ✅ If equiv doesn't exist | ✅ Keep on AWS |
| Low traffic, stable | ✅ Acceptable | 🟡 Only if easy | ❌ No ROI | ✅ Leave it |
| High traffic, latency-sensitive | ❌ Network differences matter | 🟡 If same region | ✅ Can optimize | 🟡 Co-location analysis needed |
| No owner, no tests | ❌ Migration will uncover unknown behavior | ❌ Same risk | 🔴 Rewriting unknown code = disaster | ✅ Keep until decommissioned |

### The Managed Service Semantic Gap — Most Common Failures

| AWS Service | GCP Equivalent | Azure Equivalent | Semantic Gap | Real Outage Cause |
|-------------|---------------|------------------|-------------|-------------------|
| SQS (Standard) | Pub/Sub (push) | Service Bus Queue | SQS/Service Bus: pull-based, client controls polling. Pub/Sub: push to subscriber, different ack model. Service Bus: AMQP + session support adds complexity | Messages delivered twice after ack deadline, no built-in DLQ per subscription |
| SQS (FIFO) | Pub/Sub (ordered) | Service Bus Session | FIFO guarantees message order + exactly-once. Pub/Sub ordered delivery is best-effort unless grouping key used. Service Bus sessions provide FIFO + stateful processing | Order-dependent processing failed silently |
| SNS | Pub/Sub (topics) | Event Grid | SNS: fan-out to SQS/Lambda/HTTP. Pub/Sub: push to endpoints, different retry policy. Event Grid: event domains, filtering, retry schedule differ from SNS | Retry storms on transient failures |
| DynamoDB | Firestore / Bigtable | Cosmos DB | DynamoDB: consistent single-digit-ms at any scale. Firestore: strong consistency limited. Bigtable: no transactions across rows. Cosmos DB: 5 consistency levels, RU model different from DynamoDB provisioning | Application assumed DynamoDB-style transactions across all consistency models |
| RDS (Aurora) | Cloud SQL | Azure SQL / Database for PostgreSQL | Aurora: storage-compute separation, faster failover. Cloud SQL: different replication lag. Azure SQL: vCore vs DTU models, elastic pools vs Aurora Serverless | Read replicas served stale data under load |
| S3 | Cloud Storage | Blob Storage | S3/Blob: strong consistency (since 2020/2024). Cloud Storage: eventually consistent for some operations. Blob tiers (hot/cool/archive) differ from S3 storage classes | Listed objects not found immediately after write |
| Kinesis | Pub/Sub (pull) + Dataflow | Event Hubs | Kinesis: shard-based retention, replay at shard level. Pub/Sub: subscription-based, different seek model. Event Hubs: consumer groups, checkpoint stores, Capture feature | Consumer couldn't replay from correct offset |
| Lambda | Cloud Functions | Azure Functions | Lambda: 15 min timeout, 10GB ephemeral. Cloud Functions: 9 min. Azure Functions: 10 min (Consumption), 60 min (Premium), Flex Consumption for custom SKUs | Timeout on batch processing workloads |
| ElastiCache (Redis) | Memorystore (Redis) | Azure Cache for Redis | Mostly compatible across all three, but: module support, authentication protocol, tier offerings differ | Redis modules (RediSearch, RedisJSON) not available on all tiers |

### Migration Order — Dependency Graph Approach

Don't migrate by service alphabetically. Migrate by dependency depth.

Phase 0: Networking & Auth (layer 0 — everything depends on this)
  VPN/Interconnect → DNS → IAM roles → Certificate management
  → Failure here blocks everything else

Phase 1: Data Layer (layer 1 — services depend on this)
  Database replicas → Cache → Object storage
  → Test with read replicas first, promote later

Phase 2: Foundational Services (layer 2)
  Service mesh / discovery → Secrets management → Monitoring
  → Every service depends on these being in place

Phase 3: Stateless Services (layer 3 — easiest)
  Internal APIs → Worker processes → Batch jobs
  → Canary one service first, validate for 1 week

Phase 4: Stateful Services (layer 4 — riskiest)
  Queue consumers → Event processors → Stateful APIs
  → Dual-write + compare before cutover

Phase 5: External-facing (layer 5)
  API Gateways → Load balancers → DNS cutover
  → Traffic shift 1% → 10% → 50% → 100% over 2 weeks

### The Dual-Write Pattern (Most Critical Migration Pattern)

When migrating stateful services between platforms, dual-write + comparison catches every semantic gap before users do.

┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Client  │────>│  Proxy/Mux   │────>│  Old Svc │──> Old DB
│ Request  │     │ (routes both)│     └──────────┘
└──────────┘     │              │     ┌──────────┐
                 │              │────>│  New Svc │──> New DB
                 └──────────────┘     └──────────┘
                          │
                          └──> Comparison Worker
                               (async, compare responses)

| Phase | Write Path | Read Path | Comparison | Duration |
|-------|-----------|-----------|------------|----------|
| 1. Shadow | Both (async), old is source of truth | Old only | Offline diff of DB state | 1-2 weeks |
| 2. Mirror | Both (sync), old is source of truth | Old only | Real-time response comparison | 1-2 weeks |
| 3. Canary | Both (sync), new serves % of traffic | New for canary users | Continuous monitoring | 1-2 weeks |
| 4. Cutover | New only (old in read-only) | New only | Periodic validation | 1 month |
| 5. Cleanup | New only | New only | Remove old infra | — |

**Failure modes of dual-write:**
- Comparison generates too many false positives → ignore signals → miss real inconsistencies
- Write to new fails → do you fail the original request? (Answer: no — async fail, alert, retry)
- Backfill of existing data from old to new misses edge cases → silent data loss

---

## 2. CI/CD Platform Migration

### Real Problem

Moving from Jenkins (500 pipelines) to GitHub Actions. The migration was planned by listing each Jenkins job and creating an equivalent Actions workflow. After 3 months, 80% of pipelines had been migrated but builds were consistently 2x slower and 4 of the top 10 pipelines broke weekly. Root cause: Jenkins used shared build nodes with warm caches; Actions uses ephemeral runners. Nobody cached dependencies. The Jenkins pipeline that ran "once a month" had been silently failing for 8 months because the trigger was configured differently.

### CI/CD Platform Comparison — What Actually Matters

| Dimension | Jenkins | GitHub Actions | GitLab CI | CircleCI | Buildkite |
|-----------|---------|---------------|-----------|----------|-----------|
| Hosting | Self/managed | Cloud | Cloud/managed | Cloud | Hybrid (your agents) |
| Cache persistence | Shared workspace | Artifact cache (ephemeral) | Cache (project-level) | Cache (project-level) | Agent workspace |
| Pipeline-as-code | Jenkinsfile | YAML workflows | YAML pipelines | YAML config | YAML pipelines |
| Plugin ecosystem | 1800+ plugins | 200+ actions | Built-in + CI/CD | Orbs | Plugin system |
| Matrix builds | Poor (plugin) | `strategy.matrix` | `parallel:matrix` | `parallelism` | Plugin |
| Secret management | Credentials plugin | Secrets (org/repo) | Variables | Contexts | Environment hooks |
| Self-hosted runners | Native | Groups + labels | Runners | Compute credits | BYO agents |
| Local testing | Jenkinsfile Runner | act (3rd party) | gitlab-runner exec | CircleCI CLI | buildkite-agent |
| Observability | Plugins + logs | Built-in | Built-in | Insights | Buildkite Analytics |

### Migration Pattern — Pipeline by Pipeline

Classification: For each pipeline, determine strategy:
┌─────────────────────────────────────────────────────────────┐
│ SIMPLE: Build → Test → Deploy (linear, <50 lines)           │
│ Action: Rewrite from scratch. Takes 1-2 hours.              │
│                                                             │
│ COMPLEX: Conditional stages, parallel branches, manual gates │
│ Action: Rewrite with same logic, but optimize structure.     │
│ Takes 1-2 days per pipeline.                                │
│                                                             │
│ MONOLITHIC: Multi-job DAG, shared artifacts, complex triggers│
│ Action: Break into separate workflows + shared actions.      │
│ Takes 2-5 days.                                             │
│                                                             │
│ UNUSED: No runs in 6+ months                                │
│ Action: Archive. Don't migrate. Remove after 3 months.       │
└─────────────────────────────────────────────────────────────┘

### The Cache Problem — Ephemeral Runner Speed

Jenkins with shared slaves: `npm install` runs once, cache persists for days. GitHub Actions: fresh VM every run. Without caching, a 10-minute install becomes 10 minutes every build.

| Strategy | Cache Key | Restore Time | Miss Rate | When to Use |
|----------|-----------|-------------|-----------|-------------|
| Lockfile hash | `${{ hashFiles('package-lock.json') }}` | <1s (exact match) | Only on dep change | Node, Python, Go |
| OS + lockfile | `${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}` | <1s | OS image changes | Multi-OS matrix |
| Prefix + lockfile | `${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}` + restore-keys | ~5s (prefix fallback) | Partial cache restore | Frequent dep changes |
| Warming (proactive) | Pre-build cache in nightly cron | 0s (always warm) | Never | Production deployments |

**Real-world cache miss incident:** A team cached by `package.json` content hash (not lockfile). Lockfile was committed with different resolution. Cache hit returned wrong dependency versions. Silent production bug that took 2 weeks to find. Fix: always cache on lockfile content.

### Pipeline Migration Checklist

Pre-Migration:
  [ ] Inventory all pipelines (including manual/cron/triggers)
  [ ] Document which pipelines are ACTUALLY used (check last 6 months of runs)
  [ ] Record average build time per pipeline (baseline for regression detection)
  [ ] Map all secrets used (names, locations, rotation schedule)
  [ ] Identify pipelines with manual approval gates
  [ ] List all plugins with their versions and configurations
  [ ] Document all webhooks and integrations (Slack, Jira, artifact repos)

Migration:
  [ ] Create shared actions/commands first (DRY across workflows)
  [ ] Migrate pipelines in dependency order (libs before apps)
  [ ] Parallel-run old + new for 1 week before disabling old
  [ ] Compare build times (alert if >20% slower)
  [ ] Test all failure paths (not just success)
  [ ] Verify artifact publishing (to the right registry/repo)
  [ ] Test all triggers (push, PR, schedule, manual, webhook)
  [ ] Verify secret decryption works in new environment

Post-Migration:
  [ ] Monitor build failure rate for 2 weeks
  [ ] Monitor average build time trend
  [ ] Verify all notifications are working
  [ ] Archive old pipeline config (don't delete — reference for 6 months)
  [ ] Update runbooks referencing old pipeline URLs
  [ ] Train team on new platform (especially debugging failed builds)

---

## 3. Container Platform Migration — Docker Compose to Kubernetes

### Real Problem

Startup ran 5 services with Docker Compose in production for 18 months. It "worked fine." Then they got Series A funding, hired a "Kubernetes expert", and spent 2 months migrating to EKS. The migration caused 3 production outages in the first week:
1. Compose used `depends_on` for startup ordering — K8s has no equivalent without init containers
2. Compose services discovered each other by service name (Docker DNS) — K8s DNS has different resolution behavior
3. Compose volumes were bind mounts — K8s volumes default to emptyDir which lost data on pod restart

### Migration Pattern — Strangler Fig for Containers

Phase 1: Containerize (if not already)
  Already on Compose? You're here. Skip to Phase 2.

Phase 2: Extract Configuration
  Move from docker-compose.yml to structured config:
  ┌─────────────┬────────────────────┬─────────────────────┐
  │ Concern     │ Docker Compose     │ Kubernetes          │
  ├─────────────┼────────────────────┼─────────────────────┤
  │ Image       │ build/image        │ image in Deployment │
  │ Port        │ ports: "3000:3000" │ service + ingress   │
  │ Env         │ environment:       │ ConfigMap + Secret  │
  │ Volume      │ volumes:           │ PersistentVolume    │
  │ Network     │ networks:          │ Service (ClusterIP) │
  │ Health      │ healthcheck:       │ liveness + readiness│
  │ Resource    │ deploy.resources   │ resources.limits    │
  │ Scaling     │ deploy.replicas    │ replicas: + HPA     │
  │ Restart     │ restart: always    │ restartPolicy (pod) │
  └─────────────┴────────────────────┴─────────────────────┘

Phase 3: Run Parallel (Compose + K8s for 2-4 weeks)
  - Route internal traffic to both (dual-write with comparison)
  - External traffic stays on Compose until K8s proves stable
  - Focus on: health checks, startup sequences, persistent data

Phase 4: Migrate Service by Service
  - Start with stateless services (web frontends, APIs)
  - Move to stateful services last (databases, queues)
  - Each service: 1 week of parallel validation

Phase 5: Decommission Compose
  - Keep Compose config for 3 months as reference
  - Document all the implicit behaviors Compose handled

### Compose → K8s Translation — The Critical Gaps

| Docker Compose Feature | Kubernetes Equivalent | Gap | Mitigation |
|---|---|---|---|
| `depends_on` | Init containers + `initContainers` | Init containers don't wait for service readiness | Write init container that polls the dependency's `/health` endpoint |
| `links` | Service DNS (ClusterIP) | Different hostname patterns | Use same service names as Compose or config env vars |
| `volumes` (bind mount) | hostPath + PV/PVC | hostPath only works on same node. PV requires provisioning | For dev: hostPath. For prod: PVC with storage class |
| `volumes` (named) | PVC | Compose creates volume automatically. K8s requires PVC definition | Pre-create PVCs with helm or kustomize |
| `networks` (default DNS) | kube-dns / CoreDNS | Compose: `<service>:<port>`. K8s: `<service>.<namespace>.svc.cluster.local:<port>` | Set `namespace` DNS policy or use short names |
| `restart: always` | restartPolicy: Always (Pod) | K8s: pod restart count resets on node reboot. Compose doesn't | Add liveness probe + Deployment (auto-restarts pods) |
| `healthcheck` | liveness + readiness probe | Compose: no distinction. K8s: liveness = restart, readiness = traffic | Use startup probe for slow-starting containers |
| `env_file` | `envFrom` + ConfigMap | Env file can have comments, ConfigMap values can't | Strip comments before creating ConfigMap |
| `extra_hosts` | `hostAliases` | Same | Works |
| container_name | pod name + container name | K8s pod names are random | Use `metadata.name` for Deployment |
| `logging` driver | Container log driver | K8s expects stdout/stderr, not syslog | Configure applications to log to stdout |
| One-file config | Multiple YAML files per resource | Complexity explosion | Use Helm or Kustomize |

### Kubernetes Startup Order — The Missing Feature

Compose's `depends_on` is a lie (it doesn't wait for readiness), but K8s doesn't even have the lie. You must implement startup ordering yourself.

Pattern: Init Container + Readiness Probe + Pod Disruption Budget

Service A (API) waits for Service B (DB) and Service C (Cache).

apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-a
spec:
  replicas: 3
  template:
    spec:
      initContainers:
      - name: wait-for-db
        image: busybox
        command: ['sh', '-c', 'until nc -z service-b 5432; do echo waiting for db; sleep 2; done']
      - name: wait-for-cache
        image: busybox
        command: ['sh', '-c', 'until nc -z service-c 6379; do echo waiting for cache; sleep 2; done']
      containers:
      - name: service-a
        image: service-a:latest
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 15
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: service-a-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: service-a

### Storage Migration — The Persistent Volume Trap

Compose volumes are trivial. K8s volumes have 20+ configuration options and 10 ways to get it wrong.

| Volume Type | Use Case | Data Persistence | Backup Required | Gotcha |
|-------------|----------|-----------------|-----------------|--------|
| emptyDir | Temp files, scratch | Lost on pod restart | No | Files disappear when pod moves to another node |
| hostPath | Node-level logs, daemon sets | Persistent on node | Yes | Pod must run on specific node (nodeSelector) |
| PersistentVolumeClaim | Databases, file storage | Persistent across pods | Yes | Must be created before pods. Reclaim policy matters |
| ConfigMap (volume mount) | Config files | Updated on ConfigMap change (eventually) | No | SubPath mounts don't auto-update |
| Secret (volume mount) | Certificates, tokens | Updated on Secret change (eventually) | No | Same subPath limitation |
| CSI (EBS, EFS, etc.) | Cloud block/file storage | Persistent | Provided by cloud | Provisioning, snapshots, resize are CSI driver specific |
| ephemeral (1.23+) | High-speed local storage | Lost on pod eviction | No | Faster than emptyDir (backed by local SSD) |

**Real incident:** Team used hostPath for a PostgreSQL database in K8s. Node failed. Pod rescheduled to another node. Data lost. Database binary was in the container but data was on the dead node. No backup because "K8s handles persistence." It doesn't. Always use PVC for stateful workloads.

---

## 4. API Gateway Migration

### Real Problem

Migrating from Kong to AWS API Gateway. Kong handled rate limiting, auth, and routing for 50 microservices. The migration team assumed "it's just routing — API Gateway does the same thing." They discovered in production that Kong's rate limiting was per-service-instance (distributed counters via Redis) while API Gateway rate limiting was per-api-key per-region. Under global traffic patterns, some users got 429s while others had 10x the limit. 3 weeks of urgent fixes to align rate limiting behavior.

### API Gateway Feature Comparison

| Feature | Kong | AWS API Gateway | Ambassador | Envoy | Nginx + Lua |
|---------|------|-----------------|------------|-------|-------------|
| Routing | Host + Path + Method | Resource + Method | Host + Path | Host + Path + Header | Host + Path |
| Rate limiting | Plugin (Redis/cluster-aware) | Per-key + Per-region | RateLimit filter | Envoy filter | limit_req module |
| Auth plugins | 40+ (OIDC, JWT, OAuth2, etc.) | Cognito, Lambda authorizer | OIDC, JWT, OAuth2, Basic | External auth filter | Custom Lua |
| Caching | Plugin (Redis/memory) | API Gateway cache | Redis (external) | External cache cluster | proxy_cache |
| Transformation | Plugin (request/response transformer) | VTL + mapping templates | Request/Response transformation | Lua filter | body_filter_by_lua |
| Canary routing | Plugin (weighted) | Canary release | Traffic splitting | Weighted routing | split_clients |
| WebSocket | Plugin | HTTP/2 + WSS (limited) | Via Envoy | Native Envoy | nginx-ws module |
| Custom plugins | Lua/Go/Python | Lambda | WASM/Go | WASM/Lua | Lua |
| Cost model | Self-hosted (infra) | Per-request + per-hour | Self-hosted | Self-hosted | Self-hosted |

### Migration Pattern — Gateway Sandwich

                    ┌─────────────┐
                    │   Old GW    │───> Backend A
User ──> DNS ──>    │   (Kong)    │───> Backend B
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │   New GW    │───> Backend C
                    │ (API GW)    │───> Backend D
                    └─────────────┘

Phase 1: Route overlap — both gateways active, routes split by DNS
Phase 2: New GW handles all NEW routes, old GW handles legacy
Phase 3: Route-by-route migration, compare responses
Phase 4: Old GW decommissioned

This avoids the "big bang" cutover where you discover feature gaps.

### Rate Limiting Semantics — The Most Common Migration Failure

| Platform | Scope | Default Window | Burst Handling | Distributed? | What Breaks |
|----------|-------|---------------|----------------|--------------|-------------|
| Kong | Per-instance (or Redis cluster) | 1-60s (configurable) | Instant burst up to limit | ✅ With Redis | Migrating to cloud: different aggregation |
| AWS API Gateway | Per-client per-region | 1s (fixed) | Overloaded = 429 immediately | ✅ (regional) | Global clients get more capacity than local |
| Cloudflare | Per-IP per-edge | 60s (fixed) | Rate smoothing | ✅ (global edge) | Behind CDN: user IPs get aggregated |
| Nginx | Per-worker | Sliding window, configurable | Depends on limit_req_ burst | ❌ Per-machine | Behind load balancer: aggregated IP seen multiple times |
| Custom (Redis) | Global | Configurable | Configurable | ✅ Redis cluster | Redis becomes SPOF |

**The fix:** Before migrating, audit all rate limiting configurations. Create a compatibility matrix of "how rate limiting currently works" vs "how it works on the target." Test with production traffic patterns, not synthetic benchmarks.

---

## 5. Database Platform Migration

### Real Problem

Migrating from MongoDB to PostgreSQL for a SaaS platform with 500GB of data. The team used a schema migration tool that mapped MongoDB collections to PostgreSQL tables. It worked in dev. In production, the migration took 47 hours instead of the planned 4 hours because:
1. MongoDB indexes were created after data insertion; PostgreSQL indexes were created during migration
2. MongoDB's schema-on-read meant some documents had fields that didn't exist in the target schema
3. The migration tool didn't handle MongoDB's array sub-documents — they became JSON columns
4. App queries that used MongoDB's `$unwind` became complex SQL CTEs

### Migration Pattern — Schema Mapping Decision Tree

For each MongoDB collection:
┌─────────────────────────────────────────────────┐
│ Does the collection have a fixed schema?        │
│   YES → Map to PostgreSQL table with typed cols │
│   NO  → Is the variability bounded (<20% diff)? │
│       YES → PostgreSQL table + JSONB column     │
│       NO  → Keep in MongoDB, replicate to Pg    │
│             for relational queries               │
└─────────────────────────────────────────────────┘

For each field:
┌─────────────────────────────────────────────────┐
│ Is the field scalar? → Native PostgreSQL type   │
│ Is the field an array? → JSONB or join table    │
│   (depends: always read together? → JSONB       │
│    needs individual access? → join table)       │
│ Is the field a sub-document? → JSONB            │
│   (depends: always read together? → JSONB       │
│    needs relational queries? → separate table)  │
│ Is the field a reference? → Foreign key         │
└─────────────────────────────────────────────────┘

### Data Migration — Zero-Downtime Strategy

Phase 1: Schema Creation (no data yet)
  - Create target schema (all tables, indexes, constraints)
  - Test schema with synthetic data
  - This is fast and reversible

Phase 2: Historical Data Migration (offline)
  - Export MongoDB collections, transform, import to PostgreSQL
  - Validate: row count, checksum, random sampling
  - Time this: if > 4 hours, split into batches

Phase 3: Dual-Write (application writes to both)
  - Modify application to write to both databases
  - Old DB is source of truth
  - New DB has constraints disabled (catch-up mode)
  - Comparison worker validates consistency

Phase 4: Enable Constraints on New DB
  - Run data validation again
  - Enable foreign keys, unique constraints
  - Fix any constraint violations (there will be some)

Phase 5: Catch-Up Replication
  - Run both databases in parallel
  - Monitor query performance on new DB
  - Profile slow queries and add indexes

Phase 6: Read Traffic Gradual Cutover
  - 10% reads → new DB → verify → 50% → etc.
  - Monitor: query latency, error rate, cache hit ratio

Phase 7: Write Traffic Cutover
  - Switch writes to new DB
  - Keep old DB in read-only for 2 weeks
  - Verify all queries work

Phase 8: Decommission
  - Archive old DB
  - Keep snapshot for compliance (data retention policy)

### Database Migration — Types Comparison

| Migration Type | Downtime Required | Risk Level | Data Loss Possible? | Best For |
|---------------|-------------------|------------|-------------------|----------|
| Offline (full dump/restore) | Hours-days | Low | No (full copy) | Small DBs, maintenance windows OK |
| Logical replication (pglogical, debezium) | Minutes | Medium | Yes (replication lag) | Zero-downtime required |
| ETL tool (AWS DMS, Stitch) | Minutes-hours | Medium-High | Yes (transform errors) | DB migration with schema changes |
| Dual-write application | Zero | High (code changes) | No (old DB is truth) | Mission-critical systems |
| Blue-green DB (promote replica) | Minutes | Medium | No (same data, different engine) | Same engine upgrade |
| Shadow table + rename | Seconds | High (rename is atomic but risky) | No | Schema changes within same DB |

---

## 6. Monolith to Microservices — Platform Extraction

### Real Problem

5-year-old Rails monolith. 500K lines of Ruby. 40 engineers. Team decided to "extract the billing module as a microservice." 3 months of extraction work, 2 weeks of integration testing, then the first production deployment of the billing service failed because:
1. The monolith used ActiveRecord shared transactions — billing code expected rollback to roll back the entire request
2. The monolith shared database connection pool — billing service created its own pool, connection limits exceeded
3. Session data was shared in Redis with a session key format that the new service couldn't decode

### Extraction Pattern — Service-by-Service

For each potential service extraction:

Step 1: Find the Boundary
  - Look for clear seams in the codebase
  - Database tables that are accessed by a subset of code
  - Classes that have a single reason to change (SRP check)
  - Modules with their own data, own logic, separate lifecycle

Step 2: Identify All Dependencies
  Tables accessed: [list every table the module reads/writes]
  Shared models: [ActiveRecord models used by this + other code]
  Shared helpers: [utility functions, formatters, validators]
  Auth patterns: [how does the module check permissions?]
  Session data: [what session data does the module read?]

Step 3: Choose Extraction Depth
  ┌──────────────────────────────────────────────────────────┐
  │ SHALLOW: Shared library (same codebase, separate module) │
  │   +: Fast, low risk, no network calls                   │
  │  -: Still coupled, same deploy cycle                    │
  │                                                         │
  │ MEDIUM: Separate process, shared database                │
  │   +: Independent deploy, decoupled lifecycle             │
  │  -: DB coupling limits independence, shared schema       │
  │                                                         │
  │ DEEP: Separate service, separate database, API calls     │
  │   +: Fully independent, independent scaling              │
  │  -: Latency, data consistency, operational complexity    │
  └──────────────────────────────────────────────────────────┘

Step 4: Parallel Run
  - Keep old code running alongside new service
  - Route selected traffic to new service
  - Compare responses (offline, async)
  - Find all discrepancies before full cutover

Step 5: Data Separation
  - If going DEEP, split database tables
  - Export old data, import to new service's DB
  - Backfill: run dual-writes for data created during migration
  - Validate: checksum comparison of critical data

Step 6: Cutover
  - Route all traffic to new service
  - Keep old code deployed but inactive (quick rollback)
  - Monitor for 2 weeks before cleanup

Step 7: Clean Monolith
  - Remove extracted code from monolith
  - Remove extracted database tables from monolith schema
  - This step is often skipped. Don't skip it — dead code rots.

### The Shared Database Problem — 3 Approaches

| Approach | Description | Consistency | Performance | Complexity |
|----------|-------------|-------------|-------------|------------|
| Same DB, separate schemas | Both services access same DB instance, separate schemas/namespaces | Strong (same transaction) | Best (no network) | Low |
| DB per service, sync replication | Each service has own DB, replication keeps them in sync | Strong (sync replication) | Medium (replication overhead) | High |
| DB per service, eventual consistency | Each service has own DB, events sync data | Eventual | Best (no sync overhead) | Medium |

**Real-world rule:** If you can't separate the database, you haven't actually extracted the service. A shared database means you have a distributed monolith. You get all the complexity of microservices with none of the benefits.

### The Transaction Problem

Monolith transactions span service boundaries. Microservices can't.

Monolith:
  def create_order
    Order.transaction do
      order = Order.create!(params)
      Invoice.create!(order: order, amount: order.total)
      Inventory.decrement!(order.product_id, order.quantity)
      send_confirmation_email(order)  # This can fail after DB changes
    end
  end
  # → Atomic. If email fails, everything rolls back.

Microservice:
  POST /orders  ──> Order Service ──> DB: orders.created
                        │
                        ├──> Event: OrderCreated
                        │       │
                        │       ├──> Invoice Service ──> Invoice.created
                        │       ├──> Inventory Service ──> Inventory.updated
                        │       └──> Email Service ──> Email.sent
                        │
                        └──> Result: What happens if email fails after invoice?
                              → Invoice is created but email is not
                              → Need compensation (Saga pattern)

| Pattern | How It Works | Failure Mode | Complexity |
|---------|-------------|--------------|------------|
| Saga (choreography) | Each service emits events, next service reacts on its own transaction | Partial failure: some sagas complete, some don't. Need compensating events | Medium |
| Saga (orchestration) | Central orchestrator calls each service, manages compensation | Orchestrator is a single point of failure. Message loss = inconsistent state | High |
| Outbox pattern | Service writes event to "outbox" table in the SAME DB transaction. Separately, a relay publishes to the queue | Relay crashes: events delayed but not lost | Medium |
| 2PC (XA) | Distributed transaction coordinator | Blocking protocol, coordinator crash = stuck transactions, poor performance | Very High (avoid) |

---

## 7. Secrets & Configuration Platform Migration

### Real Problem

Migrating from environment-variable-based secrets (12-factor app style) to HashiCorp Vault. The migration plan was: "load secrets from Vault at startup instead of env vars." First production deploy: service failed to start because Vault was unreachable (network policy in new K8s namespace didn't allow egress to Vault). Second attempt: Vault was reachable but the service's Vault token was expired. Third attempt: Vault returned the secret but the format was different (Vault returned base64-encoded, app expected raw).

### Secrets Platform Comparison

| Platform | Store | Rotation | Audit | Access Control | Encryption at Rest | Client Library |
|----------|-------|----------|-------|---------------|-------------------|----------------|
| Env vars (no platform) | Process memory | Manual deploy | No | No | No | Built-in |
| .env files | Filesystem | Manual | No | File permissions | Optional | dotenv |
| AWS Secrets Manager | AWS | Automatic (scheduled) | CloudTrail | IAM | Yes | AWS SDK |
| AWS Parameter Store | AWS | Automatic (with Secrets Manager) | CloudTrail | IAM | Yes (with KMS) | AWS SDK |
| GCP Secret Manager | GCP | Automatic (scheduled) | Audit Logs | IAM | Yes | GCP SDK |
| Azure Key Vault | Azure | Automatic (scheduled) | Azure Monitor | Entra ID | Yes | Azure SDK |
| HashiCorp Vault | Self-hosted | Automatic (lease-based) | Audit backend | Policies | Yes | Vault agent + SDK |
| Kubernetes Secrets | etcd | Manual | K8s audit | RBAC | Optional (encryption at rest config) | K8s API |
| SOPS | Encrypted files in git | Manual (decrypt at deploy) | Git log | GPG/KMS keys | Yes | sops CLI |
| 1Password CLI (connect) | 1Password | Manual | 1Password audit | 1Password groups | Yes | op CLI |

### Migration Pattern — Double-Read + Compare

Phase 1: Audit
  - Find ALL secrets across all environments (dev, staging, prod, DR)
  - Sources: env vars, .env files, CI/CD variables, config files, hardcoded strings
  - Use grep for: password=, secret=, key=, token=, apikey=
  - Result: inventory of every secret with its location, owner, and last rotation date

Phase 2: Classify
  ┌─────────────────────────────────────────────────────────┐
  │ SECRET  → API keys, tokens, passwords, certificates    │
  │ CONFIG  → URLs, ports, feature flags, tuning params    │
  │ PUBLIC  → Client IDs, non-sensitive config             │
  │                                                         │
  │ SECRET + STATIC (rarely change) → Secrets Manager       │
  │ SECRET + ROTATED (leases, short-lived) → Vault          │
  │ CONFIG + ENV-SPECIFIC → ConfigMap / Parameter Store     │
  │ CONFIG + SHARED → ConfigMap (same across envs)          │
  │ PUBLIC → Config file in repo                            │
  └─────────────────────────────────────────────────────────┘

Phase 3: Migration (one secret at a time, never all at once)
  - Add new secret source (Vault/Secrets Manager)
  - Keep old source (env vars) as fallback
  - Service reads from new source, falls back to old
  - Log which source was used (alert on fallback)
  - After 1 week with no fallback: remove old source

Phase 4: Rotation Enablement
  - Configure automatic rotation for short-lived secrets
  - Verify: service handles rotation without restart
  - Test: old secret expires, new secret works
  - Test: secret revoked, service degrades gracefully (doesn't crash)

### The Service Mesh Migration

### Real Problem

Company adopted Istio service mesh. All services were re-deployed with Envoy sidecars injected. Immediately:
1. All HTTP delays increased by 5-15ms (Envoy sidecar added to request path)
2. gRPC streaming connections dropped after 1 hour (default Envoy idle timeout)
3. Services that made direct database connections worked (sidecar only intercepts port 80/443)
4. Debugging became harder: "which sidecar is failing" was the new normal question

### Service Mesh Feature Comparison

| Feature | Istio | Linkerd | Consul Connect | Cilium | No Mesh |
|---------|-------|---------|---------------|--------|---------|
| mTLS | ✅ Auto | ✅ Auto | ✅ Configurable | ✅ Transparent | Manual (cert management) |
| Traffic split | ✅ VirtualService | ✅ TrafficSplit | ✅ ServiceResolver | ✅ CiliumNetworkPolicy | Load balancer config |
| Circuit breaking | ✅ DestinationRule | ✅ (via retry budget) | ✅ ServiceResolver | ✅ (via Cilium) | Application code |
| Observability | ✅ Prometheus + Grafana | ✅ Linkerd-viz | ✅ Built-in + Prometheus | ✅ Hubble | Manual instrumentation |
| Latency overhead | 5-15ms | 0.5-2ms | 1-5ms | <0.5ms | 0ms |
| Complexity | Very High | Low | Medium | Low-Medium | None |
| Resource consumption | High (Envoy) | Low (Rust) | Medium (sidecar) | Very Low (eBPF) | None |

### When NOT to Use a Service Mesh

| Scenario | Why Mesh Doesn't Help | Alternative |
|----------|----------------------|-------------|
| <20 services | Operational cost > benefit | mTLS via cert-manager, observability via OpenTelemetry SDK |
| All services in same language | Use language-specific mTLS + observability library | Library-based approach (less overhead, simpler) |
| Synchronous-only workloads | Mesh adds latency with little benefit | Application-level circuit breakers (Hystrix, resilience4j) |
| Startup (rapid iteration) | Mesh debugging complexity slows development | Add mesh after product-market fit |
| Single-region, single-DC | Traffic management features not needed | Basic load balancer |

### Migration Pattern — Per-Namespace Rollout

Don't enable mesh globally. Do it one namespace at a time.

Week 1: infra-namespace (monitoring, ingress)
  - Enable sidecar injection for monitoring stack
  - Verify metrics work with and without mesh
  - Set up dashboards for mesh health

Week 2: staging-namespace
  - Inject sidecars into staging services
  - Run full integration test suite
  - Compare: response times, error rates, resource usage

Week 3: Canary production (1 service, 10% traffic)
  - Deploy one production service with sidecar
  - Route 10% of traffic to injected pods
  - Monitor for 1 week: latency, errors, memory

Week 4: Per-service production rollout
  - One service per day
  - Verify: mTLS between services (not just ingress)
  - Set up: traffic splitting, circuit breakers for this service

Week 5: Full mesh
  - All services have sidecars
  - Enable: mTLS, circuit breakers, retry budgets
  - Optimize: remove application-level retry (mesh handles it now)

---

## 8. CI/CD Tool Migration (Advanced)

### Real Problem

A platform team migrated from Travis CI (SaaS) to self-hosted Jenkins for "more control." 6 months later, they migrated to GitHub Actions because nobody wanted to maintain Jenkins. 3 months after that, they evaluated CircleCI. Each migration cost 2-3 engineering-months and broke builds for 1-2 weeks. The real cost: trust in the CI/CD system eroded. Engineers started merging without waiting for green builds.

### Build Platform Selection — Decision Framework

┌─ Do you have a dedicated DevOps team?
│   YES → Self-hosted (Jenkins, Buildkite, self-hosted GH Actions)
│   NO  → Cloud (GitHub Actions, GitLab CI, CircleCI)
│
├─ What's your team's tolerance for build latency?
│   LOW → Cloud (elastic runners, no queue wait)
│   MEDIUM → Self-hosted (provision enough capacity)
│   HIGH → Shared Jenkins slaves (queue-based)
│
├─ Do you need to build on specific hardware (GPU, ARM)?
│   YES → Self-hosted or Buildkite (BYO agents)
│   NO  → Cloud runners work
│
├─ Is your build cache critical for speed?
│   YES → Self-hosted (persistent workspaces)
│   NO  → Cloud (ephemeral + artifact cache)
│
└─ What's your compliance/audit requirement?
    HIGH → Self-hosted (logs stay in your network)
    LOW  → Any platform

### Multi-Platform CI Strategy

Some teams end up running multiple CI platforms. This is usually a mistake, but sometimes necessary (different teams chose different tools, acquisition, migration in progress).

If you MUST run multi-platform CI:

Strategy 1: Unified Status Reporting
  - All platforms report to a single status check system
  - GitHub commit status API or similar
  - PR merge requires ALL checks to pass (regardless of platform)

Strategy 2: Platform per Concern
  ┌──────────────┬─────────────────────────────────────────┐
  │ GitHub Actions│ PR checks, lint, unit tests (fast)     │
  ├──────────────┼─────────────────────────────────────────┤
  │ Jenkins      │ Integration tests, E2E (slow, needs infra)│
  ├──────────────┼─────────────────────────────────────────┤
  │ Buildkite    │ Multi-platform builds (Linux, macOS, Win)│
  └──────────────┴─────────────────────────────────────────┘

Strategy 3: Reduce to One
  - Choose one platform as primary
  - Migrate all pipelines to it
  - Archive old platform configs
  - This is almost always the right answer

---

## 9. Monitoring & Observability Platform Migration

### Real Problem

Team migrated from Datadog to Grafana + Prometheus + Loki to reduce costs. The data migration was successful. The problem: nobody knew how to write PromQL. All the Datadog dashboards that took months to build had no equivalents. Engineers couldn't debug production issues for 3 weeks. The cost savings ($4K/month) were dwarfed by the engineering time lost ($30K+ in salary).

### Observability Platform Comparison

| Feature | Datadog | Grafana Cloud | Honeycomb | New Relic | OpenTelemetry + Self-Hosted |
|---------|---------|--------------|-----------|-----------|------------------------------|
| Setup time | Hours | Hours | Days | Days | Weeks |
| Query language | Datadog DSL | PromQL + LogQL | Honeycomb DSL | NRQL | PromQL + LogQL |
| Learning curve | Low | Medium (PromQL) | Low-Medium | Medium | High |
| Cost | $$$$ (per-host + ingest) | $$ (per-series + log ingest) | $$$ (per-event) | $$$$ (per-HRU) | $ (storage + compute) |
| Alerting | Customizable | Customizable (Ruler) | Customizable (Boomerang) | Customizable | Alertmanager (complex) |
| Logs mgmt | Log Management | Loki | Dataset-based | Logs | Loki / Elasticsearch |
| Trace support | APM (agent) | Tempo | ✅ Native | APM (agent) | Jaeger / Tempo |
| SLO tracking | ✅ | ✅ (Prometheus + Grafana) | ✅ | ✅ | Manual |
| Correlation | ✅ Great | ✅ (Grafana Explore) | ✅ Great | ✅ | Manual |
| Incident mgmt | ✅ (PagerDuty integration) | ✅ (OnCall) | ✅ | ✅ (Intelligent) | Manual tooling |

### Migration Pattern — Parallel Run + Knowledge Transfer

Phase 1: Knowledge Transfer (before touching production)
  - Identify all active alerts in old system (not inactive)
  - For each alert: what triggered it, what was the response, what was the resolution?
  - Create "PromQL equivalents" documentation:
    Old: avg:system.cpu.user{*} by {host} > 90
    New: avg(rate(node_cpu_seconds_total{mode="user"}[5m])) by (instance) > 0.9
  - Train engineers on new query language with real incidents
  - Create a query translation guide (Datadog DSL → PromQL / LogQL)

Phase 2: Dual Ingestion
  - Configure services to send telemetry to BOTH old and new platforms
  - Run parallel for 2-4 weeks
  - Compare: metric values (should be identical, validate)
  - Compare: alert triggers (should fire at the same time)

Phase 3: Dashboard Migration
  - For each dashboard: rebuild in new platform
  - Don't try to replicate exactly — improve while migrating
  - Validate: alert threshold equivalence
  - Validate: chart axis and granularity equivalence

Phase 4: Alert Migration
  - Migrate alerts one at a time, starting with lowest severity
  - For each alert:
    1. Create alert in new platform (but keep old one active)
    2. Verify alert triggers on test data
    3. Disable old alert, keep new one
    4. Monitor for 1 week: did the new alert fire when expected?
  - Keep P1/P2 alerts on old platform longest (don't risk missing critical alerts)

Phase 5: Decommission (only after 4+ weeks of parallel)
  - Stop sending to old platform
  - Export historical data if needed (retention requirements)
  - Archive dashboards as screenshots (reference for rebuilding)
  - Delete old platform agents/configs
  - Run a "no observability" drill: can engineers debug with the new platform?

---

## 10. Integration Platform Migration — Event Bus / Message Queue

### Real Problem

Company running RabbitMQ for 8 years (500+ queues, 50 services). Decision: migrate to Kafka for "better replay, better scaling." The migration team assumed Kafka topics = RabbitMQ queues. After 3 months of migration:
1. RabbitMQ's per-queue ordering became Kafka's per-partition ordering — but the app relied on global ordering
2. RabbitMQ's at-least-once delivery with auto-ack became Kafka's at-least-once with manual commit — consumers processed duplicate messages
3. RabbitMQ exchanges with routing keys became Kafka topics with consumer groups — one misconfigured consumer group caused 15 services to miss events for 2 hours

### RabbitMQ vs Kafka — Semantic Differences That Will Burn You

| Feature | RabbitMQ | Kafka | What Breaks |
|---------|----------|-------|-------------|
| Message model | Queue-based (push/pull) | Log-based (pull) | Consumers must poll, not receive push |
| Ordering | Per-queue (FIFO, single consumer) | Per-partition (not global topic) | Global ordering assumptions break |
| Message retention | Until consumed (ack) | Configurable (time/size) | Messages stay in topic even after consumption |
| Consumer groups | Not native (competing consumers via queue) | Native (consumer groups) | Rebalancing logic is different |
| Routing | Exchanges + binding keys | Topics + partition keys | Topic routing → partition routing |
| Delivery semantics | At-least-once (auto/manual ack) | At-least-once (manual offset commit) | Duplicate handling must be explicit |
| Throughput | ~50K/s | ~1M/s (per partition) | Throughput scales differently |
| Latency | ~100μs (low latency) | ~5ms (batching) | Latency-sensitive apps break |
| Dead letter | DLX (dead letter exchange) | DLT (dead letter topic) | DLX auto-routes after N retries; DLT needs explicit handling |

### Migration Pattern — Bridge Pattern

                  ┌─────────────┐
                  │  Producer   │
                  └──────┬──────┘
                         │
              ┌──────────┴──────────┐
              │                     │
     ┌────────┴────────┐   ┌────────┴────────┐
     │  RabbitMQ Queue │   │   Kafka Topic   │
     │ (existing)      │   │ (new)           │
     └────────┬────────┘   └────────┬────────┘
              │                     │
              └──────────┬──────────┘
                         │
              ┌──────────┴──────────┐
              │    Bridge Worker    │
              │ (reads from RMQ,    │
              │  writes to Kafka,   │
              │  or vice versa)     │
              └──────────┬──────────┘
                         │
              ┌──────────┴──────────┐
              │     Consumer(s)     │
              │ (new consumer reads │
              │  from Kafka only)   │
              └─────────────────────┘

Phase 1: Dual-Publish
  - Producer publishes to BOTH old (RMQ) and new (Kafka)
  - Consumers still read from old (RMQ)
  - Bridge worker validates: message in RMQ == message in Kafka?
  - Duration: 1-2 weeks

Phase 2: Consumer Migration
  - New consumer reads from Kafka
  - Old consumer still runs (backup)
  - Compare: same messages processed? Same order? Same results?
  - Duration: 2-4 weeks (migrate one consumer at a time)

Phase 3: Old Consumer Shutdown
  - Remove RMQ consumer
  - RMQ queue still receives messages (DLQ if not consumed)
  - Duration: 1 week monitoring

Phase 4: Producer Cutover
  - Stop publishing to RMQ (or keep bridge from RMQ to Kafka for legacy)
  - Validate: all messages reach all consumers
  - Decommission RMQ infrastructure

### The Partition Problem — Kafka Ordering vs RabbitMQ Ordering

RabbitMQ queue with one consumer: messages arrive in published order.
Kafka topic with 3 partitions and 3 consumers: ordering is per-partition, not global.

Solution: Design partition keys carefully.

┌─────────────────────────────────────────────────────────┐
│ If global ordering is required: 1 partition (1 consumer)│
│   Cost: throughput limited to single partition capacity │
│                                                         │
│ If per-entity ordering is sufficient: partition by key  │
│   Example: partition by user_id, order by order_id      │
│   → All messages for user_123 go to same partition      │
│   → Ordering guaranteed per user, not globally          │
│                                                         │
│ If no ordering required: partition by round-robin       │
│   Cost: no ordering guarantee, max throughput            │
└─────────────────────────────────────────────────────────┘

---

## 11. Infrastructure as Code Platform Migration

### Real Problem

Team decided to migrate from Terraform to Pulumi for "better programming language support." The migration was planned as "rewrite all modules in TypeScript." After 6 months, only 30% of modules were migrated. The remaining 70% were too complex or had state dependencies that the team couldn't figure out. They eventually ran Terraform and Pulumi side-by-side for 18 months.

### IaC Platform Comparison

| Feature | Terraform | Pulumi | AWS CDK | Crossplane |
|---------|-----------|--------|---------|------------|
| Language | HCL (DSL) | TypeScript, Python, Go, C#, Java | TypeScript, Python, Java, C#, Go | YAML (Kubernetes-style) |
| State management | Remote backends (S3, etc.) | Service-managed or self-managed | CloudFormation | No state (K8s-native) |
| Module ecosystem | Registry (2000+ modules) | Registry (growing) | Construct Hub | Provider packages |
| Plan output | `terraform plan` (rich diff) | `pulumi preview` (rich diff) | `cdk diff` (CFN diff) | `kubectl diff` |
| Testing | terratest (third-party) | Built-in (unit, integration, policy-as-code) | CDK assertions | Conftest, OPA |
| Multi-cloud | ✅ (400+ providers) | ✅ (100+ providers) | 🟡 (AWS-first, some third-party) | ✅ (K8s-native, some providers) |
| Learning curve | Medium (HCL) | Medium-High (needs programming language) | Medium (CDK patterns) | High (K8s + crossplane concepts) |
| Drift detection | `terraform plan` | `pulumi refresh` | Drift detection (CFN) | Built-in (K8s reconciliation) |

### Migration Pattern — Module-by-Module with Bridge

Phase 1: Classification
  For each Terraform module:
  ┌─────────────────────────────────────────────────────────┐
  │ MODULE TYPE: infrastructure (VPC, subnets, S3 buckets)  │
  │   OR resource (EC2, RDS, ALB)?                          │
  │                                                         │
  │ Infra module: keep in Terraform (wrap as output)        │
  │   → New Pulumi code imports Terraform outputs as stack  │
  │     references                                          │
  │                                                         │
  │ Resource module: migrate to Pulumi                      │
  │   → Create Pulumi component for same resource           │
  │   → Import existing state (pulumi import)               │
  └─────────────────────────────────────────────────────────┘

Phase 2: State Migration
  - Export Terraform state: terraform state pull > state.json
  - Import into Pulumi: pulumi import <resource> <id>
  - Validate: pulumi preview shows no changes
  - If preview shows changes: something was missed in the migration
  - NEVER run pulumi up if preview shows changes on a migrated resource

Phase 3: Parallel Execution
  - Some resources managed by Terraform, some by Pulumi
  - Bridge: Terraform outputs = Pulumi stack references
  - Example: VPC created by Terraform, Pulumi imports VPC ID
  - No resource managed by both (state conflict risk)

Phase 4: Complete Migration
  - When all modules migrated: terraform destroy on old modules
  - Terraform state is cleaned up
  - All infrastructure now managed by Pulumi
  - Archive Terraform code but keep for reference

### The State File Problem

Terraform state contains:
  - Resource metadata (ARNs, IDs, attributes)
  - Dependencies (which resources depend on which)
  - Last-applied configuration

Why it fails:
  - State file corruption (rare but catastrophic)
  - State locking conflicts (multiple engineers running plan/apply)
  - State drift (infrastructure changed outside Terraform)
  - Partial state (state was imported incorrectly)

Best practices:
  - Remote state with locking (S3 + DynamoDB)
  - State file is NOT infrastructure — it's a snapshot
  - Treat state as mutable metadata, not source of truth
  - Source of truth = code in version control
  - If state is lost: import all resources or recreate

For migration:
  - Keep old state file as backup
  - Import into new platform state
  - Compare: old state resource count == new state resource count?
  - Random sample: pick 5 resources, verify attributes match

---

## 12. Cross-Cloud Platform Strategy (Multi-Cloud)

### Real Problem

Fortune 500 company adopted "multi-cloud" strategy. Every team could choose AWS, GCP, or Azure. After 2 years: 340 services on AWS, 120 on GCP, 80 on Azure. Operational costs: 35% premium over single-cloud (cross-cloud data transfer, duplicate tooling, 3x the certifications). The "vendor lock-in" concern that motivated multi-cloud never materialized — but the operational complexity did.

### Multi-Cloud Decision Matrix

| Use Case | Single Cloud | Multi-Cloud (2 clouds) | Multi-Cloud (3+ clouds) | Recommendation |
|----------|-------------|----------------------|------------------------|----------------|
| Cost | Best (volume discounts) | 20-40% premium | 40-60% premium | Single cloud unless forced |
| Latency | Best (data center density) | Second-best cloud has more latency | Third best is worse | Single cloud + edge CDN |
| Compliance | One set of certifications | Region-specific clouds | N certifications per cloud | 2 clouds max (if needed for compliance) |
| Vendor lock-in | High | Medium | Low | Unlikely to be as bad as feared |
| Talent | One platform to learn | Two platforms | N platforms | Single cloud (talent scarcity) |
| Resilience | Region-specific failure | Cloud-wide failure = migrate traffic | Multi-cloud = multi-failure modes | Multi-region > multi-cloud |
| Service availability | All native services | Subset on weaker cloud | Limited on 3rd choice | Primary + backup on #1 cloud |

### When Multi-Cloud Actually Makes Sense

| Scenario | Strategy | Example |
|----------|----------|---------|
| Compliance requires data residency | Use the cloud with data centers in that geography | AWS Singapore + GCP Indonesia (if GCP has local DC) |
| Acquisition integration | Keep acquired company's cloud, bridge networks | Acquirer on AWS, acquired on GCP |
| Avoid single-vendor dependency | Keep 10-20% of non-critical workload on second cloud | 80% AWS, 20% GCP (static content, less critical) |
| Best-of-breed services | Use each cloud's unique strengths | AWS for Lambda, GCP for BigQuery, Azure for Active Directory |
| Disaster recovery (cloud-level) | Run DR on different cloud | Primary: AWS us-east-1, DR: GCP us-central1 |

### Multi-Cloud Migration — The Hub-and-Spoke Network

Never connect clouds directly (unless via dedicated interconnect).

                    ┌─────────────────┐
                    │                 │
                    │   HUB (Colo /   │
                    │    Equinix /    │
                    │    Megaport)    │
                    │                 │
                    └──┬──────┬──────┘
                       │      │
              ┌────────┘      └────────┐
              │                        │
     ┌────────┴────────┐     ┌────────┴────────┐
     │  AWS (us-east)  │     │  GCP (us-west)  │
     │                 │     │                 │
     │  Direct Connect │     │  Dedicated      │
     │  1 Gbps         │     │  Interconnect   │
     └─────────────────┘     └─────────────────┘

| Network Option | Latency (inter-cloud) | Cost/GB | Setup Time | Reliability |
|---------------|----------------------|---------|------------|-------------|
| Public internet | 10-50ms | $0 (data transfer out) | Immediate | Unreliable (best-effort) |
| VPN | 10-50ms + overhead | $0 (but VPN endpoint cost) | 1-2 days | Medium (depends on ISP) |
| Direct peering (Equinix, Megaport) | 2-5ms | $0.02-0.05/GB | 2-4 weeks | High (SLA-backed) |
| Cloud router / Private interconnect | 1-3ms | $0.04-0.08/GB | 2-8 weeks | Very High (SLA-backed) |

---

## 13. Legacy Platform Migration — Mainframe to Cloud

### Real Problem

Insurance company migrating COBOL mainframe to AWS. The mainframe processed 10M policies/day with batch jobs that ran for 6 hours each night. The re-host (emulating mainframe on x86) worked for transaction processing but the batch jobs that completed in 6 hours on mainframe took 34 hours on AWS. The mainframe's I/O subsystem was faster than AWS EBS.

### Migration Strategies for Mainframe

| Strategy | Description | Success Rate | Timeline | Cost | Risk |
|----------|-------------|--------------|----------|------|------|
| Re-host (emulate) | Run mainframe OS on x86 (LzLabs, TmaxSoft) | 60% | 6-12 months | Medium | Performance mismatch |
| Re-platform (refactor COBOL to Java) | Automated COBOL-to-Java conversion | 40% | 12-24 months | High | Generated code is unmaintainable |
| Re-architect (rewrite) | Build new system from scratch | 70% (if done right) | 24-48 months | Very High | Better long-term outcome |
| Retain + API facade | Put API on top of mainframe, add new services around it | 80% | 3-6 months | Low | Mainframe stays, technical debt remains |
| Retire | Decommission mainframe processing | 95% (if data exists elsewhere) | 1-3 months | Negative cost | Requires another data source |

### The Batch Processing Problem

Mainframe batch optimization is fundamentally different from cloud batch.

Mainframe batch optimization:
  - Sequential disk I/O (VSAM) — optimized for large sequential reads
  - One job reads N files, processes, writes N+1 files
  - Job scheduling: complex dependency chains
  - I/O subsystem: dedicated, no contention

Cloud batch optimization:
  - Distributed processing (Spark, MapReduce) — optimized for parallel
  - Many small workers process partitions in parallel
  - Storage: EBS/gp3 (network-attached, not dedicated)
  - Resource contention: noisy neighbors in multi-tenant cloud

The gap:
  Mainframe processes 10M records sequentially in 6 hours.
  Cloud equivalent processing 10M records sequentially takes 34 hours.
  Solution: rewrite as distributed batch (Spark) → 10M records in 2 hours.
  But: this requires a full rewrite of every batch job.

### API Facade Strategy (Most Common Success Pattern)

                   ┌─────────────┐
                   │ New Micro-  │
                   │ services    │
                   └──────┬──────┘
                          │
                   ┌──────┴──────┐
                   │  API Gateway│
                   └──────┬──────┘
                          │
              ┌───────────┴───────────┐
              │                       │
     ┌────────┴────────┐    ┌────────┴────────┐
     │  API Facade     │    │  Mainframe      │
     │  (translates    │    │  (CM01, IMS,    │
     │  REST ↔ CICS)   │    │  DB2, VSAM)     │
     └─────────────────┘    └─────────────────┘

The API facade:
  - Exposes REST endpoints that map to mainframe transactions
  - Handles: session management (3270), data format conversion (EBCDIC → ASCII)
  - Provides: retry, circuit breaking, timeout (mainframe doesn't have these)
  - Adds: monitoring, logging, tracing (mainframe has none of these)

This pattern lets you:
  - Build new services without mainframe knowledge
  - Incrementally migrate functionality off mainframe
  - Decommission mainframe transactions one at a time
  - Keep the mainframe running until everything is migrated

---

## 14. Prompt Engineering for Platform Migration (ML Perspective)

### Real Problem

Senior engineer with 20 years experience but 0 years ML experience. Given a prompt: "Write a Terraform module for migrating 500 services from AWS to GCP." The LLM generated a module that didn't account for the semantic gaps between SQS and Pub/Sub. The engineer trusted the output because it "compiled" (no syntax errors). It deployed successfully. Messages were lost.

### How LLMs Fail on Platform Migration

| Failure Mode | Why | Mitigation |
|-------------|-----|------------|
| **Semantic hallucination** | LLM assumes service equivalences that don't exist | Never assume "SQS == Pub/Sub." Always validate semantics before syntax. |
| **Version blindness** | LLM uses latest API version, not your platform's version | Pin versions in prompts: "using AWS provider 4.0, not 5.0" |
| **Scale blindness** | LLM generates config for 10 services, not 500 | Include scale in prompt: "500 services, 10K requests/second" |
| **Cost blindness** | LLM generates most expensive resource configuration | Add budget constraints: "budget is $50K/month for this migration" |
| **Missing failure modes** | LLM generates happy-path-only code | Explicitly ask: "what failure modes should this handle?" |
| **Security assumptions** | LLM uses default security (open access) | Add: "follow least privilege, encrypt everything" |

### Prompt Template for Platform Migration Tasks

Context:
  Platform SOURCE: [AWS, Azure, GCP, on-prem, etc.]
  Platform TARGET: [new platform]
  MIGRATION TYPE: [lift-and-shift, re-platform, refactor]
  SERVICE COUNT: [N services]
  DATA VOLUME: [N GB/TB]
  BUDGET: [time + cost constraints]
  TEAM SIZE: [N engineers]
  CRITICAL TIMELINE: [when must this be done]
  KEY CONSTRAINT: [compliance, latency, cost, etc.]

Problem:
  [Describe the specific migration scenario]

Requirements:
  1. [Specific requirement 1 - e.g., "zero downtime"]
  2. [Specific requirement 2 - e.g., "must work with existing CI/CD"]
  3. [Failure mode to handle - e.g., "handle secret rotation during migration"]

Output Format:
  1. RISK ANALYSIS: [top 3 risks specific to this scenario]
  2. MIGRATION PLAN: [step by step, order matters]
  3. ROLLBACK PLAN: [what to do if step X fails]
  4. VALIDATION: [how to verify each step worked]
  5. TIMELINE: [realistic timeline with 50% buffer]

### Using LLMs as Platform Migration Assistants

DON'T: "Write the Terraform for this migration."
  → LLM generates confident-looking code that misses details

DO: "List all the semantic differences between [platform A's] [service X]
     and [platform B's] [service Y] that would affect a migration."
  → LLM generates risks you didn't think of
  → Then: use each risk as a separate prompt for mitigation strategy

DON'T: "Convert this Jenkinsfile to a GitHub Actions workflow."
  → LLM converts syntax but misses runtime differences (caching, agents, secrets)

DO: "Here's a Jenkinsfile. Before converting it, list all the implicit
     runtime assumptions in this Jenkinsfile that won't exist in
     GitHub Actions. Then convert it."
  → LLM surfaces: shared workspace, cache persistence, agent labels, plugin dependencies

DON'T: "Migrate this service to the new platform."
  → LLM generates a plan but misses the specific constraints of your service

DO: "Here are the specific characteristics of our service:
     - [specific: handles 10K req/s peak]
     - [specific: uses Redis for rate limiting]
     - [specific: stores files on NFS]
     - [specific: depends on internal DNS]
     Given these, what breaks if we move to [platform]?"
  → LLM generates a risk list specific to your architecture

---

## 15. Platform Migration — Organizational Patterns

### Real Problem (The Human Side)

A bank tried to migrate from a legacy mainframe to AWS. The technology was the easy part. The organizational resistance killed the project:
1. Mainframe COBOL engineers feared layoffs → slowed knowledge transfer
2. Operations team feared new tooling → resisted cloud training
3. Middle managers feared losing control → blocked migration decisions
4. Compliance team had no cloud experience → demanded impossible controls

### Organizational Anti-Patterns in Platform Migration

| Anti-Pattern | Signal | Root Cause | Fix |
|-------------|--------|------------|-----|
 | Boiling the ocean | "We'll migrate everything at once" | Underestimating complexity, overconfidence | Start with one service, learn, then scale |
| The middle manager blockade | Every decision needs "more analysis" | Fear of obsolescence, loss of control | Give managers a role in the new platform (migration leads) |
| The compliance trap | "Cloud can't meet our compliance needs" | Compliance team hasn't seen cloud compliance certs | Have cloud provider auditors talk directly to compliance team |
| The "just rehost" fallacy | "We'll lift and shift, optimize later" | Time pressure, cost pressure | Show cost of NOT optimizing (rehost is 20-30% more expensive) |
| The "we need a hero" pattern | One person knows everything about the old platform | Knowledge hoarding (intentional or not) | Pair senior engineer with 2 juniors for knowledge transfer |
| The ghost migration | "We migrated!" but nobody uses the new platform | No incentives to adopt | Cut over old platform (don't let teams stay on old) |
| The infinite parallel | "We'll run both platforms for safety" | Fear of migration failure, no trust in new platform | Set a hard deadline for old platform decommission |

### Migration Team Structure

Executive Sponsor: VP/Director who resolves cross-team blockers
  └── Migration Lead: Full-time, accountable for timeline + outcomes
       ├── Technical Lead: Architecture decisions, code quality, migration patterns
       ├── Platform Engineers: Build and maintain target platform
       ├── Migration Engineers (2-4): Migrate services, write migration code
       ├── Testing Lead: Test strategy, comparison validation, performance testing
       └── Knowledge Transfer Lead: Documentation, training, runbooks

Advisory:
  ├── Security Engineer: Platform security, IAM, compliance validation
  ├── SRE/Ops: Monitoring, alerting, runbooks on target platform
  └── Finance: Cost tracking, budget management, optimization

### Knowledge Transfer — The Critical Path

Phase 1: Discovery (2-4 weeks before migration starts)
  - Interview senior engineers about the old platform
  - Document: what breaks, what's fragile, what nobody knows
  - Record: 5-minute screen captures of operations (deploy, debug, rollback)
  - Find: undocumented configurations, "it works but we don't know why"

Phase 2: Cross-Training (during migration)
  - Juniors learn migration patterns by doing (pair with senior)
  - Seniors learn target platform by building reference architectures
  - Documentation: runbooks for every operational task on new platform
  - Every incident becomes a learning opportunity (blameless postmortem)

Phase 3: Ownership Transition (post-migration)
  - Senior engineers hand off runbooks to operations team
  - Operations team runs the new platform for 2 weeks with senior backup
  - Knowledge gaps: identified and filled during this transition
  - Old platform knowledge is archived, not lost (reference documentation)

---

## 16. Platform Migration — Risk Assessment Framework

### Migration Risk Scoring

For every migration decision, score:

| Risk Factor | 1 (Low) | 2 (Medium) | 3 (High) | 4 (Critical) |
|-------------|---------|------------|----------|--------------|
| Service criticality | Internal tool | Revenue-generating | Customer-facing | Regulated/financial |
| Data sensitivity | Public data | Internal data | PII/PHI | Payment/auth data |
| Complexity | Single endpoint | Multiple endpoints | Stateful + data | Orquestrated multi-step |
| Dependencies | None | 1-2 services | 3-5 services | 5+ services |
| Team familiarity | Built it | Used it | Maintained | Never seen it |
| Rollback complexity | Instant (DNS switch) | Config change | Data migration | Impossible |
| Testing confidence | Unit tests + integration tests | Integration tests only | Manual testing only | No tests |

**Score interpretation:**
- **7-14:** Low risk — can migrate quickly, minimal validation needed
- **15-21:** Medium risk — standard migration pattern, 2 weeks parallel
- **22-28:** High risk — phased migration, 4+ weeks parallel, senior engineer required
- **29+:** Critical risk — halt, get executive sign-off, full SRE engagement

### Migration Go/No-Go Checklist

BEFORE EVERY MIGRATION STEP, CONFIRM:

GO ✅
  [ ] Rollback plan documented AND tested
  [ ] All stakeholders notified of maintenance window
  [ ] Monitoring dashboards show baseline metrics
  [ ] Runbook for this specific migration step exists
  [ ] Engineer who will press the button understands the step
  [ ] Communication channel open (Slack, Zoom, phone bridge)
  [ ] Alerting configured for failure detection
  [ ] Known-good backup taken within last hour
  [ ] Traffic can be shifted back to old platform within 5 minutes
  [ ] Team has eaten, slept, and isn't operating under panic

NO-GO ❌
  [ ] Rollback plan not tested
  [ ] Stakeholders not notified
  [ ] Baseline metrics not captured
  [ ] Runbook doesn't exist for this step
  [ ] Engineer unsure about the step
  [ ] No communication channel
  [ ] No alerting
  [ ] No backup
  [ ] Cannot rollback in 5 minutes
  [ ] Team is tired, hungry, or stressed

---

## Appendix — Migration Commandments

1. NEVER assume service equivalence between platforms.
   AWS SQS is not GCP Pub/Sub. Kong rate limiting is not AWS API Gateway rate limiting.
   Test semantics BEFORE testing syntax.

2. NEVER migrate more than one dependent service at a time.
   Migration A fails → you roll back one service.
   Migration A + B fail → you have no idea what broke what.

3. ALWAYS dual-run before cutover.
   If you can't dual-run, you don't understand the migration impact.
   If you can't dual-run and can't accept the risk, don't migrate.

4. ALWAYS have a tested rollback before starting.
   "We'll just revert the config" is not a rollback plan.
   Test rollback in production-like environment.

5. The migration isn't done until the old platform is decommissioned.
   Parallel operation = double cost, double cognitive load.
   Decommission within 30 days of cutover.

6. Document WHY, not just WHAT.
   "We changed the timeout because Pub/Sub has different ack semantics."
   Future engineers need to know the reasoning, not just the config.

7. Cost comparison before migration ≠ cost comparison after.
   Cloud bills are always higher than projected. Add 30% buffer.
   Migration always costs more than estimated. Add 50% buffer.
   Timeline always takes longer. Add 100% buffer.

8. The migration WILL uncover unknown unknowns.
   Plan for it: add 2 weeks of "unknown discovery" time.
   When you find the unknown, don't panic — that's why the buffer exists.

9. If you can't test it in staging, you can't run it in production.
   This is not negotiable. Period.

10. The best migration is the one nobody notices.
    If users saw downtime, if developers saw errors, if SRE saw pages —
    the migration had a problem. Silent migration = successful migration.

---


---

## 17. Cloud Cost Optimization During Migration

### Real Problem

A startup migrated from Heroku to AWS to "save money." Heroku cost was $8K/month. After 3 months on AWS, the bill was $14K/month. They forgot: Heroku includes managed Postgres, Redis, and load balancers in the dyno cost. AWS charges separately for RDS, ElastiCache, and ALB. The "cheaper" cloud was 75% more expensive.

### Total Cost of Ownership (TCO) — Real Comparison

| Cost Category | Heroku (source) | AWS (target) | Cloud A | Cloud B |
|---------------|-----------------|-------------|---------|---------|
| Compute (1GB RAM) | $50/mo (1x dyno) | $8/mo (t3.micro) + $15/mo ALB share | $35/mo (Fargate) | $40/mo (Cloud Run) |
| Managed DB (1GB) | $50/mo (Heroku Postgres) | $25/mo (RDS t3.micro) | $30/mo (Cloud SQL) | $15/mo (RDS equivalent) |
| Managed Redis (1GB) | $30/mo (Heroku Redis) | $20/mo (ElastiCache t3.micro) | $25/mo (Memorystore) | $25/mo (Cache for Redis) |
| Load balancer | Included | $25/mo (ALB) | $20/mo (Global LB) | $20/mo (Azure LB) |
| Data transfer (100GB) | Included (Heroku internal) | $10/mo (AWS inter-AZ) | $15/mo (GCP inter-region) | $12/mo (Azure inter-region) |
| Managed services markup | Included in dyno | Separate charges for each | Separate charges | Separate charges |
| Ops cost (team time) | ~2 hrs/week | ~8 hrs/week | ~6 hrs/week | ~6 hrs/week |
| **Total est. (1 app)** | **~$130/mo** | **~$100/mo** | **~$125/mo** | **~$115/mo** |

### Hidden Costs That Destroy Migration Budget

| Hidden Cost | Why It Happens | Magnitude | Avoidance |
|-------------|---------------|-----------|-----------|
| Data transfer out | Moving data cross-cloud during migration | $0.05-0.12/GB | Transfer during off-peak, use dedicated interconnect |
| Double-infrastructure | Running old + new platform in parallel | 2x compute cost | Aggressive decommission timeline (max 30 days) |
| Re-provisioning | "We'll just deploy fresh" -> extra storage, IPs, snapshots | 10-20% of total | Clean up unused resources weekly |
| Learning curve inefficiency | Engineers take 2-3x longer on new platform | 2-3x labor cost | Training before migration, not during |
| Credential rollover | Every rotated secret requires coordination | 5-10 hours/rotation | Use secrets manager with automatic rotation |
| Compliance re-cert | SOC2/HIPAA re-audit for new infrastructure | $20-80K | Use same compliance framework (don't re-certify from scratch) |
| License re-purchase | SQL Server, Oracle licenses don't transfer | $10-100K+ | Use cloud-native DB (Aurora, Cloud SQL, etc.) |
| Monitoring re-build | All dashboards, alerts, runbooks need re-creation | 2-4 weeks engineer time | Export configs, don't start from scratch |

### Cost Estimation Template for Migration

Service: [service name]
Current monthly cost: $X
Target monthly cost (estimated): $Y
Migration cost (one-time): $Z
Payback period: Z / (X - Y) months

Tier 1 — must estimate:
  Compute: [$ per instance] x [instances] = $A
  Database: [$ per instance] x [instances] = $B
  Storage: [$ per GB] x [GB] + [$ per IOPS] x [IOPS] = $C
  Data transfer: [$ per GB] x [GB expected] = $D
  Load balancer / API Gateway: [$ per hour/resource] = $E

Tier 2 — often forgotten:
  Monitoring: [$ per host/metric/log] = $F
  Secrets management: [$ per secret] x [secrets] + [$ per rotation] = $G
  DNS / CDN: [$ per zone/month] + [$ per GB CDN] = $H
  Container registry / artifact storage: [$ per GB stored] + [$ per GB transferred] = $I
  VPC / Networking: [$ per NAT gateway] + [$ per VPN] = $J
  Backup / Snapshot: [$ per GB backed up] x [retention days] = $K

Tier 3 — support costs:
  Support plan: [$ per month] = $L
  Training: [$ per engineer] x [N engineers] = $M
  Professional services / consultancy: [$ per hour] x [hours] = $N
  Migration tool licenses: [$ per month/tool] = $O

Total monthly target: A + B + C + D + E + F + G + H + I + J + K + L
Total one-time cost: M + N + O

### Migration Budget Tracker Template

| Week | Phase | Actual Spend | Budget | Over/Under | What Changed |
|------|-------|-------------|--------|------------|-------------|
| 1 | Discovery | $0 | $0 | — | — |
| 2 | Networking | $342 | $500 | -$158 | VPC peering cheaper than expected |
| 3 | Database | $12,450 | $8,000 | +$4,450 | RDS provisioned IOPS needed, not gp3 |
| 4 | Services | $24,100 | $20,000 | +$4,100 | Extra ALBs needed for blue-green deployments |
| 5 | Decommission | $0 | $0 | — | — |
| **Total** | **—** | **$36,892** | **$28,500** | **+$8,392** | **29% over budget** |

---

## 18. Security Compliance During Platform Migration

### Real Problem

Healthcare startup migrating from on-prem to AWS. HIPAA compliance required BAA (Business Associate Agreement) with AWS. The migration team spent 3 months building infrastructure, then discovered:
1. The VPC didn't have encryption in transit for all traffic (required by HIPAA)
2. CloudTrail was enabled but logs weren't encrypted at rest
3. RDS was encrypted but the automated snapshots weren't
4. The EC2 AMIs contained PII data (from test data)

### Compliance Requirements by Platform

| Compliance | Migration Risk | Common Gap | Remediation Time | Cost Impact |
|-----------|---------------|-------------|-----------------|-------------|
| SOC2 | Medium | Logging gaps, access controls | 2-4 weeks | $20-50K (audit) |
| HIPAA | High | Encryption, BAA, audit trails | 4-8 weeks | $30-80K (audit + infra) |
| PCI-DSS | Critical | Network segmentation, encryption, logging | 8-16 weeks | $50-200K (audit + QSA) |
| GDPR | Medium | Data residency, deletion capabilities | 2-4 weeks | $10-30K (legal + engineering) |
| FedRAMP | Very High | Everything: encryption, access, audit | 6-18 months | $500K-2M (audit + compliance engineering) |

### Compliance Migration Checklist

Pre-Migration:
  [ ] Does the TARGET platform have the required compliance certifications?
       (Check: AWS Artifact, GCP Compliance Reports, Azure Trust Center)
  [ ] Have you signed the required agreements?
       (BAA for HIPAA, DPA for GDPR, etc.)
  [ ] Does your target architecture meet compliance requirements?
       (Encryption at rest and in transit? Access logging? Network segmentation?)
  [ ] Have you mapped data classification to the target platform?
       (Which data goes where? Which encryption keys for which data?)

During Migration:
  [ ] Verify encryption at rest on ALL data stores (not just defaults)
  [ ] Verify encryption in transit between ALL services (mTLS or VPN)
  [ ] Enable audit logging on ALL target services (CloudTrail, VPC Flow Logs)
  [ ] Configure access logging with retention (1 year minimum for most standards)
  [ ] Test: can you delete a user's data within the SLA? (GDPR right to erasure)
  [ ] Test: can you restore from backup? (disaster recovery test)

Post-Migration:
  [ ] Run a compliance scan (AWS Config, GCP Security Command Center, Defender for Cloud)
  [ ] Validate: no data is in the wrong region (data residency requirements)
  [ ] Review: IAM policies follow least privilege (not overly permissive)
  [ ] Review: encryption keys are rotated per policy
  [ ] Schedule: penetration test on the new infrastructure
  [ ] Update: compliance documentation (architecture, data flow, controls)

---

## 19. Disaster Recovery During Platform Migration

### Real Problem

A fintech company migrating from on-prem to Azure planned a 6-month migration. At month 4, their on-prem data center had a cooling failure. Critical services were down for 8 hours. The migration was 60% complete — some traffic was on Azure, some on-prem. During the outage, the Azure-only services worked. The hybrid services partially worked (some data was on-prem, some on Azure). The on-prem-only services were down.

### DR Strategy During Migration

The period during migration is the most vulnerable time for your system. You're running hybrid infrastructure with partial connectivity, and neither side has complete data.

┌─────────────────────────────────────────────────────────┐
│ Migration Phase         │ DR Strategy                    │
├─────────────────────────┼────────────────────────────────┤
│ Planning (pre-migration)│ Old platform DR (unchanged)     │
│ Phase 1 (network setup) │ Old platform DR + new platform │
│                         │ network backup                  │
│ Phase 2 (data replica)  │ Cross-platform replication     │
│                         │ Old DR + new DR testing        │
│ Phase 3 (service cut)   │ Dual-platform DR (most complex)│
│ Phase 4 (full migration)│ New platform DR only           │
│ Phase 5 (decommission)  │ New platform DR (verify)       │
└─────────────────────────────────────────────────────────┘

### Cross-Platform DR Testing

| DR Scenario | Old Platform | New Platform | Test During Migration |
|-------------|-------------|-------------|----------------------|
| Single service failure | Auto-restart on old infra | Auto-restart on new infra | Monthly |
| AZ/zone failure | Old platform DR plan | New platform DR plan (needs validation) | Monthly |
| Region failure | Old platform multi-region | New platform doesn't have multi-region yet | Alert if new platform affected |
| Data corruption | Restore from backup (old) | Restore from backup (new) | Weekly (test restore) |
| Total platform failure | Not applicable (both may fail) | Failover to old platform (incomplete) | Emergency runbook: manual restore |

### Migration-Specific DR Recovery Time

Critical data must be recoverable during migration.
Define recovery time objective (RTO) and recovery point objective (RPO) for the migration period:

Normal: RTO 1 hour, RPO 15 minutes
Migration: RTO 4 hours, RPO 1 hour
  (Acceptable degradation during transition)

If you can't meet the degraded RTO/RPO: don't start the migration until you can.

---

## Appendix: Platform Migration Runbook Template

# Platform Migration Runbook: [Migration Name]

## Overview
- **Source platform:** [source]
- **Target platform:** [target]
- **Migration lead:** [name]
- **Migration window:** [date/time, include timezone]
- **Expected duration:** [hours]
- **Rollback time:** [how long to rollback]

## Pre-Migration Checklist
- [ ] All dependencies migrated first
- [ ] Target infrastructure provisioned and validated
- [ ] Data replicated and verified (checksum comparison)
- [ ] Monitoring configured on target
- [ ] Alerts configured on target
- [ ] Rollback plan documented
- [ ] Rollback plan tested (within last 24 hours)
- [ ] Stakeholders notified
- [ ] Communication channel established
- [ ] Backup taken (within last 1 hour)

## Step-by-Step

### Step 1: [step name]
**Command/Run:** [exact command to execute]
**Validation:** [how to verify success]
**Expected output:** [what successful output looks like]
**Failure mode:** [what to do if this step fails]
**Rollback command:** [exact command to reverse]

### Step 2: [step name]
...

## Rollback Procedure

### How to abort migration
1. [step to initiate rollback]
2. [step to verify rollback]
3. [how to notify stakeholders]

### How to resume after abort
1. [what to check before restarting]
2. [which step to restart from]

## Post-Migration Validation

### Immediate (within 5 minutes of cutover)
- [ ] Service health check passes
- [ ] HTTP 200 on all endpoints
- [ ] No 5xx errors in logs
- [ ] Latency within 20% of baseline
- [ ] Error rate within 0.1% of baseline

### Extended (within 1 hour of cutover)
- [ ] All 20 critical user flows tested
- [ ] Database queries within normal latency
- [ ] Cache hit ratio within normal range
- [ ] No P1/P2 alerts
- [ ] All dependent services responding

### Long-term (within 1 week of cutover)
- [ ] Cost within 10% of estimate
- [ ] No recurring alerts
- [ ] Team trained on new platform operations
- [ ] Old platform decommissioned or read-only
- [ ] Documentation updated

---

## Index
| # | Section | Focus |
|---|---------|-------|
| 1 | Cloud Provider Migration | Lift/shift, replatform, semantic gaps, dual-write |
| 2 | CI/CD Platform Migration | Platform comparison, pipeline migration, caching |
| 3 | Container Platform Migration | Compose to K8s, storage, startup order |
| 4 | API Gateway Migration | Feature gaps, rate limiting semantics |
| 5 | Database Platform Migration | NoSQL to SQL, zero-downtime, migration types |
| 6 | Monolith to Microservices | Extraction, shared DB, transactions |
| 7 | Secrets & Config Migration | Platform comparison, double-read |
| 8 | Service Mesh Migration | Istio/Linkerd comparison, when NOT to use |
| 9 | CI/CD Tool Migration | Selection framework, multi-platform strategy |
| 10 | Observability Platform Migration | Feature comparison, query language transfer |
| 11 | Event Bus Migration | RabbitMQ to Kafka, bridge pattern, partitions |
| 12 | IaC Platform Migration | Terraform to Pulumi, state migration |
| 13 | Cross-Cloud Strategy | Multi-cloud decision matrix, network hub |
| 14 | Mainframe to Cloud | Batch processing, API facade, batch rewrite |
| 15 | Prompt Engineering for Migration | LLM failure modes, prompt templates |
| 16 | Organizational Patterns | Anti-patterns, team structure, knowledge transfer |
| 17 | Risk Assessment Framework | Migration risk scoring, go/no-go checklist |
| 18 | Cloud Cost Optimization | TCO comparison, hidden costs, budget template |
| 19 | Security Compliance | SOC2/HIPAA/PCI-DSS migration checklist |
| 20 | Disaster Recovery | DR during migration, cross-platform DR testing |
| 21 | Real-World War Stories | 7 anonymized migration incidents with lessons |
| 22 | Migration Runbook Template | Reusable runbook for any platform migration |
| 23 | Cloud Provider Adapters (Deep Dive) | AWS, GCP, Azure adapter patterns, cross-cloud, migration |
| 24 | Database Adapter Patterns | Relational, NoSQL, Search, Time-series |
| 25 | API Adapter Patterns | REST, gRPC, GraphQL, SOAP, Webhook |
| 26 | Message Queue / Event Stream Adapters | Kafka, RabbitMQ, SQS/SNS, Redis, Pulsar |
| 27 | Authentication/Authorization Adapter Patterns | OAuth2, OIDC, SAML, API Key, mTLS |
| 28 | Monitoring / Observability Adapters | Metrics, Logging, Tracing, APM |
| 29 | Real-World Adapter Failure Stories | 12 adapter failure incidents with lessons |
| 30 | Adapter Testing Patterns | Mocking, integration, contract, chaos, performance |
| 31 | Adapter Security Patterns | Credential rotation, TLS, sanitization, rate limiting, audit |


## 23. Cloud Provider Adapters (Deep Dive)

### 23.1 AWS Adapter Patterns

#### EC2 Adapter

class EC2Adapter:
    def __init__(self, session, region="us-east-1"):
        self.ec2 = session.client("ec2", region_name=region)

    def describe_instances(self, filters=None):
        params = {}
        if filters:
            params["Filters"] = filters
        instances = []
        paginator = self.ec2.get_paginator("describe_instances")
        for page in paginator.paginate(**params):
            for reservation in page["Reservations"]:
                instances.extend(reservation["Instances"])
        return instances

    def create_instance(self, image_id, instance_type, subnet_id, security_groups, user_data=None, tags=None):
        import base64
        params = {"ImageId": image_id, "InstanceType": instance_type, "SubnetId": subnet_id, "SecurityGroupIds": security_groups, "MinCount": 1, "MaxCount": 1}
        if user_data:
            params["UserData"] = base64.b64encode(user_data.encode()).decode()
        if tags:
            params["TagSpecifications"] = [{"ResourceType": "instance", "Tags": [{"Key": k, "Value": v} for k, v in tags.items()]}]
        response = self.ec2.run_instances(**params)
        instance_id = response["Instances"][0]["InstanceId"]
        waiter = self.ec2.get_waiter("instance_running")
        waiter.wait(InstanceIds=[instance_id])
        return instance_id

    def terminate_instance(self, instance_id):
        self.ec2.terminate_instances(InstanceIds=[instance_id])
        waiter = self.ec2.get_waiter("instance_terminated")
        waiter.wait(InstanceIds=[instance_id])

| EC2 Pattern | Implementation | Error Handling | Retry Strategy |
|-------------|---------------|----------------|----------------|
| Instance lifecycle | Create, Wait, Configure, Run | InstanceLimitExceeded | Exponential backoff, max 5 |
| Volume attachment | VolumeId + InstanceId + Device | VolumeInUse | Retry after 5s, max 3 |
| Security group rules | AuthorizeSecurityGroupIngress/Egress | InvalidPermission.Duplicate | No retry (idempotent) |
| AMI management | create_image, wait, register | InvalidAMIName.Duplicate | Check existence first |
| Spot instances | request_spot_instances | SpotInstanceInterruption | Maintain via ASG |
| Reserved instances | DescribeReservedInstances | InvalidParameterValue | Use Price List API |

#### Lambda Adapter

class LambdaAdapter:
    def __init__(self, session):
        self.lambda_client = session.client("lambda")

    def create_function(self, name, runtime, handler, role_name, code, memory=128, timeout=30, env_vars=None, layers=None, vpc_config=None):
        import time
        role_arn = self._get_or_create_role(role_name)
        params = {"FunctionName": name, "Runtime": runtime, "Handler": handler, "Role": role_arn, "Code": {"ZipFile": code} if isinstance(code, bytes) else {"S3Bucket": code["bucket"], "S3Key": code["key"]}, "MemorySize": memory, "Timeout": timeout}
        if env_vars:
            params["Environment"] = {"Variables": env_vars}
        if layers:
            params["Layers"] = layers
        if vpc_config:
            params["VpcConfig"] = vpc_config
        for attempt in range(3):
            try:
                return self.lambda_client.create_function(**params)
            except self.lambda_client.exceptions.InvalidParameterValueException as e:
                if "role" in str(e).lower():
                    time.sleep(10 * (attempt + 1))
                    continue
                raise
            except self.lambda_client.exceptions.ResourceConflictException:
                return self.update_function_code(name, code)
        raise RuntimeError(f"Failed to create function {name}")

    def invoke(self, name, payload, invocation_type="RequestResponse", qualifier=None):
        import json, time
        params = {"FunctionName": name, "InvocationType": invocation_type, "Payload": json.dumps(payload) if isinstance(payload, dict) else payload}
        if qualifier:
            params["Qualifier"] = qualifier
        response = self.lambda_client.invoke(**params)
        if response["StatusCode"] == 200:
            return json.loads(response["Payload"].read())
        elif response["StatusCode"] == 429:
            time.sleep(0.5)
            return self.invoke(name, payload, invocation_type, qualifier)
        if response.get("FunctionError"):
            raise LambdaFunctionError(f"Function error: {response['Payload'].read()}")
        return response

| Lambda Pattern | Issue | Solution |
|----------------|-------|----------|
| Cold start | 200ms-5s latency | Provisioned concurrency, SnapStart |
| Concurrent limit | 1000 per region (default) | Request increase, SQS throttling |
| Package size | 50MB zipped, 250MB unzipped | Lambda layers, container images |
| Timeout | Max 15 minutes | Step Functions for long-running |
| VPC Lambda | Cold start +5s | VPC endpoints, provisioned concurrency |
| Event mapping | Batch errors | bisect_on_function_error |
| Idempotency | Duplicate events | Idempotency key in DynamoDB + TTL |

#### S3 Adapter

class S3Adapter:
    def __init__(self, session):
        self.s3 = session.client("s3")

    def create_bucket(self, name, region="us-east-1", versioning=False, encryption=None):
        import time
        params = {"Bucket": name}
        if region != "us-east-1":
            params["CreateBucketConfiguration"] = {"LocationConstraint": region}
        try:
            self.s3.create_bucket(**params)
        except self.s3.exceptions.BucketAlreadyExists:
            raise BucketNameConflict(f"Bucket {name} already exists")
        except self.s3.exceptions.BucketAlreadyOwnedByYou:
            pass
        if versioning:
            self.s3.put_bucket_versioning(Bucket=name, VersioningConfiguration={"Status": "Enabled"})
        if encryption:
            self.s3.put_bucket_encryption(Bucket=name, ServerSideEncryptionConfiguration={"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": encryption}}]})
        return name

    def upload_file(self, bucket, key, data, content_type=None, metadata=None, storage_class="STANDARD"):
        import time
        params = {"Bucket": bucket, "Key": key, "Body": data if isinstance(data, bytes) else data.encode(), "StorageClass": storage_class}
        if content_type:
            params["ContentType"] = content_type
        if metadata:
            params["Metadata"] = metadata
        for attempt in range(3):
            try:
                self.s3.put_object(**params)
                return key
            except (self.s3.exceptions.NoSuchBucket, self.s3.exceptions.ClientError) as e:
                if attempt < 2 and "NoSuchBucket" in str(e):
                    time.sleep(1)
                    continue
                raise

    def download_file(self, bucket, key, version_id=None):
        params = {"Bucket": bucket, "Key": key}
        if version_id:
            params["VersionId"] = version_id
        return self.s3.get_object(**params)["Body"].read()

    def list_objects(self, bucket, prefix="", delimiter="", max_keys=1000):
        objects = []
        paginator = self.s3.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket, Prefix=prefix, Delimiter=delimiter, PaginationConfig={"MaxItems": max_keys}):
            objects.extend(page.get("Contents", []))
        return objects

| S3 Pattern | Best Practice | Anti-Pattern |
|------------|--------------|--------------|
| Naming | Lowercase, hyphens allowed | CamelCase (case-insensitivity) |
| Consistency | Read-after-write for PUT | Expecting after DELETE |
| Versioning | Enable on all buckets | No versioning = no recovery |
| Lifecycle | Auto-transition to IA/Glacier | All data in STANDARD |
| Encryption | SSE-S3 or SSE-KMS | Unencrypted objects |
| Access control | IAM + bucket policies | Legacy ACLs |
| Performance | Prefixes for parallel throughput | Single prefix (3,500 PUT/s) |
| Multipart | Use for files >100MB | Single PUT for 5GB |
| Pre-signed URLs | Time-limited access | Sharing credentials |
| Events | S3 Events to SQS/SNS/Lambda | Polling S3 for changes |

#### RDS Adapter

class RDSAdapter:
    def __init__(self, session):
        self.rds = session.client("rds")

    def create_instance(self, identifier, engine, instance_class, storage_gb, master_username, master_password, vpc_sg_ids, subnet_group, multi_az=False, storage_encrypted=True, backup_retention=7):
        params = {"DBInstanceIdentifier": identifier, "Engine": engine, "DBInstanceClass": instance_class, "AllocatedStorage": storage_gb, "MasterUsername": master_username, "MasterUserPassword": master_password, "VpcSecurityGroupIds": vpc_sg_ids, "DBSubnetGroupName": subnet_group, "MultiAZ": multi_az, "StorageEncrypted": storage_encrypted, "BackupRetentionPeriod": backup_retention, "DeletionProtection": True, "AutoMinorVersionUpgrade": True}
        self.rds.create_db_instance(**params)
        waiter = self.rds.get_waiter("db_instance_available")
        waiter.wait(DBInstanceIdentifier=identifier)

    def create_read_replica(self, source, replica, region=None, instance_class=None):
        params = {"DBInstanceIdentifier": replica, "SourceDBInstanceIdentifier": source}
        if region: params["SourceRegion"] = region
        if instance_class: params["DBInstanceClass"] = instance_class
        return self.rds.create_db_instance_read_replica(**params)

    def take_snapshot(self, identifier, snapshot_name):
        self.rds.create_db_snapshot(DBInstanceIdentifier=identifier, DBSnapshotIdentifier=snapshot_name)
        waiter = self.rds.get_waiter("db_snapshot_completed")
        waiter.wait(DBSnapshotIdentifier=snapshot_name)

| RDS Pattern | Strategy | Notes |
|-------------|----------|-------|
| Engine upgrade | Snapshot, restore, test | Test all queries on new version |
| Scale up (vertical) | Modify instance, reboot | ~1-5 min downtime |
| Scale out (read) | Read replica, app config | Aurora: up to 15 replicas |
| Cross-region replication | Cross-region read replica | RPO ~1s (MySQL), ~5s (PG) |
| Backup to S3 | Export snapshot to S3 | Cross-account restore |
| IAM auth | IAM DB auth instead of passwords | Token valid 15 min |

#### DynamoDB Adapter

class DynamoDBAdapter:
    def __init__(self, session):
        self.dynamodb = session.client("dynamodb")

    def put_item(self, table_name, item, condition_expression=None):
        import time
        params = {"TableName": table_name, "Item": {k: self._to_dynamo_type(v) for k, v in item.items()}}
        if condition_expression: params["ConditionExpression"] = condition_expression
        for attempt in range(3):
            try:
                return self.dynamodb.put_item(**params)
            except self.dynamodb.exceptions.ConditionalCheckFailedException: raise
            except self.dynamodb.exceptions.ProvisionedThroughputExceededException:
                time.sleep((2 ** attempt) * 0.1)

    def query(self, table_name, key_condition, expr_attr_values=None, index_name=None, limit=None):
        params = {"TableName": table_name, "KeyConditionExpression": key_condition, "ScanIndexForward": True}
        if expr_attr_values: params["ExpressionAttributeValues"] = {k: self._to_dynamo_type(v) for k, v in expr_attr_values.items()}
        if index_name: params["IndexName"] = index_name
        if limit: params["Limit"] = limit
        items = []
        last_key = None
        while True:
            if last_key: params["ExclusiveStartKey"] = last_key
            response = self.dynamodb.query(**params)
            items.extend(response.get("Items", []))
            if "LastEvaluatedKey" not in response or (limit and len(items) >= limit): break
            last_key = response["LastEvaluatedKey"]
        return items[:limit] if limit else items

    def _to_dynamo_type(self, value):
        if isinstance(value, str): return {"S": value}
        elif isinstance(value, (int, float)): return {"N": str(value)}
        elif isinstance(value, bool): return {"BOOL": value}
        elif isinstance(value, bytes): return {"B": value}
        elif isinstance(value, list): return {"L": [self._to_dynamo_type(v) for v in value]}
        elif isinstance(value, dict): return {"M": {k: self._to_dynamo_type(v) for k, v in value.items()}}
        elif value is None: return {"NULL": True}
        elif isinstance(value, set):
            if all(isinstance(v, str) for v in value): return {"SS": list(value)}
        return {"S": str(value)}

    def batch_write(self, table_name, items, chunk_size=25):
        import time
        unprocessed = list(items)
        while unprocessed:
            chunk = unprocessed[:chunk_size]
            unprocessed = unprocessed[chunk_size:]
            request_items = {table_name: [{"PutRequest": {"Item": {k: self._to_dynamo_type(v) for k, v in item.items()}}} for item in chunk]}
            response = self.dynamodb.batch_write_item(RequestItems=request_items)
            if "UnprocessedItems" in response and response["UnprocessedItems"].get(table_name):
                unprocessed.extend(response["UnprocessedItems"][table_name])
                time.sleep(0.5)

| DynamoDB Pattern | Description | Pitfall |
|------------------|-------------|---------|
| Single-table design | One table, multiple entity types | Over-normalization, N+1 |
| GSIs | Alternate access patterns | 20 GSIs limit, eventual consistency |
| LSIs | Sort key alternatives | Must be at creation, 5 per table |
| TTL | Auto-delete expired items (free) | Deletion can take up to 48h |
| DAX | In-memory cache (microsecond) | Costly for write-heavy |
| Transactions | ACID across up to 25 items | 2x cost, 4MB limit |
| Streams | CDC via Kinesis-like streams | 24-hour retention |
| Autoscaling | Target utilization | Lags traffic spikes |

#### SQS Adapter

class SQSAdapter:
    def __init__(self, session):
        self.sqs = session.client("sqs")
        import json

    def create_queue(self, name, fifo=False, visibility_timeout=30, delay_seconds=0, max_receive_count=None, dlq_arn=None):
        import json
        attrs = {"VisibilityTimeout": str(visibility_timeout), "DelaySeconds": str(delay_seconds), "MessageRetentionPeriod": "345600", "ReceiveMessageWaitTimeSeconds": "20"}
        if fifo:
            attrs["FifoQueue"] = "true"
            attrs["ContentBasedDeduplication"] = "true"
            if dlq_arn:
                attrs["RedrivePolicy"] = json.dumps({"deadLetterTargetArn": dlq_arn, "maxReceiveCount": str(max_receive_count or 5)})
        return self.sqs.create_queue(QueueName=name, Attributes=attrs)["QueueUrl"]

    def send_message(self, queue_url, message_body, message_group_id=None):
        import json, hashlib
        params = {"QueueUrl": queue_url, "MessageBody": json.dumps(message_body) if isinstance(message_body, dict) else message_body}
        if message_group_id:
            params["MessageGroupId"] = message_group_id
            params["MessageDeduplicationId"] = hashlib.sha256(json.dumps(message_body, sort_keys=True).encode()).hexdigest()
        return self.sqs.send_message(**params)["MessageId"]

    def receive_messages(self, queue_url, max_messages=10, wait_time=20):
        params = {"QueueUrl": queue_url, "MaxNumberOfMessages": min(max_messages, 10), "WaitTimeSeconds": wait_time}
        return self.sqs.receive_message(**params).get("Messages", [])

    def delete_message(self, queue_url, receipt_handle):
        return self.sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=receipt_handle)

| SQS Pattern | Standard Queue | FIFO Queue |
|-------------|---------------|------------|
| Throughput | Unlimited (best-effort) | 300/s (no batch), 3000/s (batch) |
| Exactly-once | At-least-once (duplicates) | Exactly-once (dedup ID) |
| Ordering | Best-effort | Strict FIFO (within group) |
| Message group | Not supported | Required |
| Max message | 256KB | 256KB |
| Retention | 1 min to 14 days | 1 min to 14 days |

#### SNS Adapter

class SNSAdapter:
    def __init__(self, session):
        self.sns = session.client("sns")

    def create_topic(self, name, fifo=False, display_name=None):
        attrs = {}
        if fifo:
            name += ".fifo"
            attrs["FifoTopic"] = "true"
            attrs["ContentBasedDeduplication"] = "true"
        response = self.sns.create_topic(Name=name, Attributes=attrs)
        topic_arn = response["TopicArn"]
        if display_name:
            self.sns.set_topic_attributes(TopicArn=topic_arn, AttributeName="DisplayName", AttributeValue=display_name)
        return topic_arn

    def subscribe(self, topic_arn, protocol, endpoint, filter_policy=None, raw_message=False):
        import json
        response = self.sns.subscribe(TopicArn=topic_arn, Protocol=protocol, Endpoint=endpoint)
        sub_arn = response["SubscriptionArn"]
        if filter_policy: self.sns.set_subscription_attributes(SubscriptionArn=sub_arn, AttributeName="FilterPolicy", AttributeValue=json.dumps(filter_policy))
        if raw_message: self.sns.set_subscription_attributes(SubscriptionArn=sub_arn, AttributeName="RawMessageDelivery", AttributeValue="true")
        return sub_arn

    def publish(self, topic_arn, message, subject=None):
        import json
        params = {"TopicArn": topic_arn, "Message": json.dumps(message) if isinstance(message, dict) else message}
        if subject: params["Subject"] = subject
        return self.sns.publish(**params)["MessageId"]

| SNS Pattern | Protocol | Use Case |
|-------------|----------|----------|
| SQS subscription | sqs | Fan-out to workers |
| Lambda subscription | lambda | Trigger function |
| HTTP/HTTPS | http/https | Webhook delivery |
| Email subscription | email | Admin alerts (low volume) |
| SMS subscription | sms | Critical alerts |
| Platform app | application | Push notifications |
| Filter policy | All | Route by attributes |

#### API Gateway Adapter

class APIGatewayAdapter:
    def __init__(self, session):
        self.apigw = session.client("apigatewayv2")

    def create_http_api(self, name, cors=True):
        params = {"Name": name, "ProtocolType": "HTTP"}
        if cors:
            params["CorsConfiguration"] = {"AllowOrigins": ["*"], "AllowMethods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], "AllowHeaders": ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"]}
        response = self.apigw.create_api(**params)
        return response["ApiId"], response["ApiEndpoint"]

    def create_route(self, api_id, route_key, target_arn):
        integration_id = self._create_integration(api_id, target_arn)
        return self.apigw.create_route(ApiId=api_id, RouteKey=route_key, Target=f"integrations/{integration_id}")

    def _create_integration(self, api_id, target_arn):
        response = self.apigw.create_integration(ApiId=api_id, IntegrationType="AWS_PROXY", IntegrationUri=target_arn, PayloadFormatVersion="2.0")
        return response["IntegrationId"]

| API Gateway Pattern | REST API (v1) | HTTP API (v2) | WebSocket API |
|---------------------|---------------|---------------|---------------|
| Pricing | $3.50/million | $1.00/million | $1.00/m + connection min |
| Latency | ~50ms overhead | ~10ms overhead | ~50ms overhead |
| Features | API keys, usage plans, WAF | JWT authorizer, CORS | $connect/$disconnect |
| Integration | Lambda, HTTP, AWS, mock | Lambda, HTTP, AWS | Lambda only |
| Custom domain | Supported | Supported | Supported |
| Max timeout | 29 seconds | 29 seconds | 10 seconds per msg |

#### CloudFront Adapter

class CloudFrontAdapter:
    def __init__(self, session):
        self.cf = session.client("cloudfront")

    def create_distribution(self, origin_domain, origin_id, aliases=None, price_class="PriceClass_100", default_ttl=86400):
        import time
        config = {"CallerReference": str(time.time()), "Origins": {"Quantity": 1, "Items": [{"Id": origin_id, "DomainName": origin_domain, "CustomOriginConfig": {"HTTPPort": 80, "HTTPSPort": 443, "OriginProtocolPolicy": "https-only", "OriginSslProtocols": {"Quantity": 1, "Items": ["TLSv1.2"]}}}]}, "DefaultCacheBehavior": {"TargetOriginId": origin_id, "ViewerProtocolPolicy": "redirect-to-https", "AllowedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]}}, "DefaultTTL": default_ttl, "ForwardedValues": {"QueryString": False, "Cookies": {"Forward": "none"}}}, "Enabled": True, "PriceClass": price_class}
        if aliases: config["Aliases"] = {"Quantity": len(aliases), "Items": aliases}
        response = self.cf.create_distribution(DistributionConfig=config)
        return response["Distribution"]["Id"], response["Distribution"]["DomainName"]

    def invalidate_cache(self, distribution_id, paths=["/*"]):
        import time
        return self.cf.create_invalidation(DistributionId=distribution_id, InvalidationBatch={"Paths": {"Quantity": len(paths), "Items": paths}, "CallerReference": str(time.time())})

| CloudFront Pattern | Use Case | Optimization |
|--------------------|----------|-------------|
| Price class | PriceClass_100 (US/EU) | Lower cost for regional |
| TTL tuning | 1 year (static), 0s (API) | Cache-Control overrides |
| Lambda@Edge | Auth, rewrite, A/B testing | 5ms compute, 128MB |
| Origin failover | Primary + secondary | Route to S3 if ALB fails |
| Signed URLs | Private content | CloudFront key pairs |
| WAF | DDoS protection, IP blocking | ~$6/month + $0.60/M req |

---

### 23.2 GCP Adapter Patterns

#### Compute Engine Adapter

class ComputeEngineAdapter:
    def __init__(self, credentials, project, zone="us-central1-a"):
        from googleapiclient.discovery import build
        self.compute = build("compute", "v1", credentials=credentials)
        self.project = project
        self.zone = zone

    def create_instance(self, name, machine_type, image_project, image_family, network="default", tags=None, startup_script=None, disk_size_gb=10):
        import time
        image = self.compute.images().getFromFamily(project=image_project, family=image_family).execute()
        source = image["selfLink"]
        config = {"name": name, "machineType": f"zones/{self.zone}/machineTypes/{machine_type}", "disks": [{"boot": True, "autoDelete": True, "initializeParams": {"sourceImage": source, "diskSizeGb": disk_size_gb}}], "networkInterfaces": [{"network": f"global/networks/{network}", "accessConfigs": [{"type": "ONE_TO_ONE_NAT", "name": "External NAT"}]}]}
        if tags: config["tags"] = {"items": tags}
        if startup_script: config["metadata"] = {"items": [{"key": "startup-script", "value": startup_script}]}
        operation = self.compute.instances().insert(project=self.project, zone=self.zone, body=config).execute()
        self._wait(operation)

    def _wait(self, operation):
        import time
        while True:
            result = self.compute.zoneOperations().get(project=self.project, zone=self.zone, operation=operation["name"]).execute()
            if result["status"] == "DONE":
                if "error" in result: raise RuntimeError(f"Failed: {result['error']}")
                return
            time.sleep(1)

| Compute Engine Pattern | Implementation | GCP-Specific |
|------------------------|---------------|--------------|
| Instance templates | Create template, MIG | Immutable (must create new) |
| Managed instance groups | Auto-healing, auto-scaling | updatePolicy for canary |
| Sole-tenant nodes | Dedicated hardware | Per-core licensing |
| Shielded VMs | Secure boot, vTPM, integrity | Compliance workloads |
| Preemptible VMs | 80% discount, max 24h | No SLA, no live migration |
| Confidential VMs | Memory encryption (AMD SEV) | Compliance workloads |

#### Cloud Functions Adapter

class CloudFunctionsAdapter:
    def __init__(self, credentials, project, region="us-central1"):
        from googleapiclient.discovery import build
        self.functions = build("cloudfunctions", "v2", credentials=credentials)
        self.project = project
        self.region = region

    def deploy(self, name, source_bucket, source_object, entry_point, runtime="python312", memory="256Mi", timeout=60, min_instances=0, max_instances=100, env_vars=None):
        import time
        parent = f"projects/{self.project}/locations/{self.region}"
        fid = f"{parent}/functions/{name}"
        build_config = {"runtime": runtime, "entryPoint": entry_point, "source": {"storageSource": {"bucket": source_bucket, "object": source_object}}}
        svc_config = {"maxInstanceCount": max_instances, "minInstanceCount": min_instances, "timeoutSeconds": timeout, "availableMemory": memory}
        if env_vars: svc_config["environmentVariables"] = env_vars
        try:
            self.functions.projects().locations().functions().patch(name=fid, body={"buildConfig": build_config, "serviceConfig": svc_config}).execute()
        except HttpError as e:
            if e.resp.status == 404:
                self.functions.projects().locations().functions().create(parent=parent, functionId=name, body={"name": fid, "buildConfig": build_config, "serviceConfig": svc_config}).execute()
        while True:
            s = self.functions.projects().locations().functions().get(name=fid).execute()
            if s["state"] == "ACTIVE": return s["serviceConfig"]["uri"]
            time.sleep(5)

| Cloud Functions Pattern | 1st Gen | 2nd Gen (Cloud Run) |
|------------------------|---------|---------------------|
| Runtime | Node, Python, Go, Java, .NET, Ruby, PHP | All + any OCI container |
| Max timeout | 9 min (HTTP), 10 min (event) | 60 minutes |
| Min/max instances | 1/3000 | 0/3000+ |
| Concurrency | 1 request at a time | Up to 1000 |
| VPC access | Serverless VPC Connector | Direct VPC or connector |
| CPU allocation | Only during request | Always-on option (extra $) |
| Cold start | ~100ms (Python) to ~1s (Java) | Similar (Cloud Run) |

#### Cloud Storage Adapter

class CloudStorageAdapter:
    def __init__(self, credentials, project):
        from googleapiclient.discovery import build
        self.storage = build("storage", "v1", credentials=credentials)
        self.project = project

    def create_bucket(self, name, location="US", storage_class="STANDARD", uniform_access=True, versioning=False):
        body = {"name": name, "location": location, "storageClass": storage_class, "iamConfiguration": {"uniformBucketLevelAccess": {"enabled": uniform_access}}}
        if versioning: body["versioning"] = {"enabled": True}
        return self.storage.buckets().insert(project=self.project, body=body).execute()

    def upload(self, bucket, name, data, content_type=None):
        from googleapiclient.http import MediaIoBaseUpload
        import io
        media = MediaIoBaseUpload(io.BytesIO(data if isinstance(data, bytes) else data.encode()), mimetype=content_type or "application/octet-stream", resumable=True)
        return self.storage.objects().insert(bucket=bucket, name=name, media_body=media).execute()

    def download(self, bucket, name):
        return self.storage.objects().get_media(bucket=bucket, object=name).execute()

    def list_objects(self, bucket, prefix=""):
        objects = []
        pt = None
        while True:
            params = {"bucket": bucket, "prefix": prefix}
            if pt: params["pageToken"] = pt
            resp = self.storage.objects().list(**params).execute()
            objects.extend(resp.get("items", []))
            pt = resp.get("nextPageToken")
            if not pt: break
        return objects

| Cloud Storage Pattern | GCP Feature | S3 Equivalent |
|-----------------------|-------------|---------------|
| Storage classes | Standard, Nearline, Coldline, Archive | Standard, IA, Glacier |
| Lifecycle | Age + conditions | S3 Lifecycle policies |
| IAM conditions | Conditional access | Bucket policies w/ conditions |
| Object holds | Prevent deletion/overwrite | S3 Object Lock |
| Pub/Sub notifications | Object finalize/delete | S3 Event Notifications |
| Signed URLs | v2 and v4 signing | Pre-signed URLs |
| Requester pays | Bucket owner saved | Requester Pays buckets |

#### Cloud SQL Adapter

class CloudSQLAdapter:
    def __init__(self, credentials, project):
        from googleapiclient.discovery import build
        self.sqladmin = build("sqladmin", "v1beta4", credentials=credentials)
        self.project = project

    def create_instance(self, name, database_version="POSTGRES_15", tier="db-custom-1-3840", region="us-central1", storage_gb=100, backup_start_time="03:00", deletion_protection=True):
        import time
        body = {"name": name, "databaseVersion": database_version, "settings": {"tier": tier, "region": region, "dataDiskSizeGb": storage_gb, "dataDiskType": "PD_SSD", "backupConfiguration": {"enabled": True, "startTime": backup_start_time, "pointInTimeRecoveryEnabled": True}, "deletionProtectionEnabled": deletion_protection}}
        op = self.sqladmin.instances().insert(project=self.project, body=body).execute()
        while True:
            r = self.sqladmin.operations().get(project=self.project, operation=op["name"]).execute()
            if r["status"] == "DONE":
                if r.get("error"): raise RuntimeError(f"Failed: {r['error']}")
                return
            time.sleep(2)

    def export(self, instance, bucket, path, database=None):
        body = {"exportContext": {"fileType": "SQL", "uri": f"gs://{bucket}/{path}", "databases": [database] if database else None}}
        op = self.sqladmin.instances().export(project=self.project, instance=instance, body=body).execute()

    def import_data(self, instance, bucket, path, database=None):
        body = {"importContext": {"fileType": "SQL", "uri": f"gs://{bucket}/{path}", "database": database}}
        op = self.sqladmin.instances().import_(project=self.project, instance=instance, body=body).execute()
    

### 23.3 Azure Adapter Patterns

#### Azure VM Adapter

from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

class AzureVMAdapter:
    def __init__(self, subscription_id, resource_group):
        self.credential = DefaultAzureCredential()
        self.compute = ComputeManagementClient(self.credential, subscription_id)
        self.resource_group = resource_group

    def list_vms(self):
        vms = []
        for vm in self.compute.virtual_machines.list(self.resource_group):
            vms.append({"name": vm.name, "location": vm.location, "provisioning_state": vm.provisioning_state, "vm_size": vm.hardware_profile.vm_size})
        return vms

    def start_vm(self, name):
        return self.compute.virtual_machines.begin_start(self.resource_group, name)

    def stop_vm(self, name, deallocate=True):
        return self.compute.virtual_machines.begin_deallocate(self.resource_group, name)

    def get_instance_view(self, name):
        return self.compute.virtual_machines.instance_view(self.resource_group, name)

#### Functions Adapter

from azure.identity import DefaultAzureCredential
from azure.mgmt.web import WebSiteManagementClient

class AzureFunctionsAdapter:
    def __init__(self, subscription_id, resource_group):
        self.credential = DefaultAzureCredential()
        self.web = WebSiteManagementClient(self.credential, subscription_id)
        self.resource_group = resource_group

    def list_functions(self, app_name):
        return self.web.web_apps.list_functions(self.resource_group, app_name)

    def get_function_keys(self, app_name, function_name):
        return self.web.web_apps.list_function_keys(self.resource_group, app_name, function_name)

    def sync_function_triggers(self, app_name):
        return self.web.web_apps.sync_function_triggers(self.resource_group, app_name)

#### Blob Storage Adapter

from azure.storage.blob import BlobServiceClient

class BlobStorageAdapter:
    def __init__(self, connection_string):
        self.client = BlobServiceClient.from_connection_string(connection_string)

    def list_containers(self):
        return [c.name for c in self.client.list_containers()]

    def upload_blob(self, container, blob_name, data, overwrite=False):
        container_client = self.client.get_container_client(container)
        return container_client.upload_blob(name=blob_name, data=data, overwrite=overwrite)

    def download_blob(self, container, blob_name):
        container_client = self.client.get_container_client(container)
        return container_client.download_blob(blob_name).readall()

    def set_tier(self, container, blob_name, tier):
        blob_client = self.client.get_blob_client(container=container, blob=blob_name)
        return blob_client.set_standard_blob_tier(tier)

#### Azure SQL Adapter

from azure.identity import DefaultAzureCredential
from azure.mgmt.sql import SqlManagementClient

class AzureSQLAdapter:
    def __init__(self, subscription_id, resource_group):
        self.credential = DefaultAzureCredential()
        self.sql = SqlManagementClient(self.credential, subscription_id)
        self.resource_group = resource_group

    def list_databases(self, server):
        return list(self.sql.databases.list_by_server(self.resource_group, server))

    def get_replication_links(self, server, database):
        return list(self.sql.replication_links.list_by_database(self.resource_group, server, database))

    def failover(self, server, database):
        return self.sql.databases.begin_failover(self.resource_group, server, database)

#### Cosmos DB Adapter

from azure.cosmos import CosmosClient

class CosmosDBAdapter:
    def __init__(self, url, key):
        self.client = CosmosClient(url, credential=key)

    def list_databases(self):
        return [db.id for db in self.client.list_databases()]

    def query_items(self, database, container, query, partition_key=None, max_items=100):
        db = self.client.get_database_client(database)
        container_client = db.get_container_client(container)
        items = container_client.query_items(query=query, partition_key=partition_key, max_item_count=max_items)
        return list(items)

    def upsert_item(self, database, container, item):
        db = self.client.get_database_client(database)
        container_client = db.get_container_client(container)
        return container_client.upsert_item(item)

#### Service Bus Adapter

from azure.servicebus import ServiceBusClient, ServiceBusMessage

class ServiceBusAdapter:
    def __init__(self, connection_string):
        self.client = ServiceBusClient.from_connection_string(connection_string)

    def send_message(self, queue_name, message_body, session_id=None):
        sender = self.client.get_queue_sender(queue_name)
        msg = ServiceBusMessage(message_body, session_id=session_id)
        sender.send_messages(msg)

    def receive_messages(self, queue_name, max_messages=10, max_wait_time=5):
        receiver = self.client.get_queue_receiver(queue_name, max_wait_time=max_wait_time)
        messages = receiver.receive_messages(max_message_count=max_messages)
        return messages

    def send_to_topic(self, topic_name, message_body):
        sender = self.client.get_topic_sender(topic_name)
        sender.send_messages(ServiceBusMessage(message_body))

#### API Management Adapter

from azure.identity import DefaultAzureCredential
from azure.mgmt.apimanagement import ApiManagementClient

class APIManagementAdapter:
    def __init__(self, subscription_id, resource_group, service_name):
        self.credential = DefaultAzureCredential()
        self.apim = ApiManagementClient(self.credential, subscription_id)
        self.resource_group = resource_group
        self.service_name = service_name

    def list_apis(self):
        return list(self.apim.api.list_by_service(self.resource_group, self.service_name))

    def get_policy(self, api_id):
        return self.apim.api_policy.get(self.resource_group, self.service_name, api_id, "policy")

    def create_api(self, api_id, display_name, path, protocols, service_url=None):
        params = {"displayName": display_name, "path": path, "protocols": protocols, "serviceUrl": service_url}
        return self.apim.api.create_or_update(self.resource_group, self.service_name, api_id, params)

#### Front Door / CDN Adapter

from azure.mgmt.frontdoor import FrontDoorManagementClient

class FrontDoorAdapter:
    def __init__(self, subscription_id, resource_group):
        self.credential = DefaultAzureCredential()
        self.frontdoor = FrontDoorManagementClient(self.credential, subscription_id)
        self.resource_group = resource_group

    def list_frontdoors(self):
        return list(self.frontdoor.front_doors.list_by_resource_group(self.resource_group))

    def list_endpoints(self, profile_name):
        return list(self.frontdoor.endpoints.list_by_profile(self.resource_group, profile_name))

    def purge_endpoint_content(self, endpoint_name, profile_name, content_paths):
        return self.frontdoor.endpoints.begin_purge_content(self.resource_group, profile_name, endpoint_name, {"contentPaths": content_paths})


## 24. Database Adapter Patterns

### 24.1 PostgreSQL Adapter

import psycopg2.pool

class PostgreSQLAdapter:
    def __init__(self, dsn, min_conn=2, max_conn=10, max_retries=3, retry_delay=1, timeout_ms=30000):
        self.pool = psycopg2.pool.ThreadedConnectionPool(min_conn, max_conn, dsn)
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.timeout_ms = timeout_ms

    def execute(self, query, params=None):
        import time
        for attempt in range(self.max_retries):
            conn = None
            try:
                conn = self.pool.getconn()
                with conn.cursor() as cur:
                    cur.execute(f"SET statement_timeout = {self.timeout_ms}")
                    cur.execute(query, params)
                    conn.commit()
                    return cur.fetchall() if cur.description else None
            except Exception as e:
                if conn: conn.rollback()
                if self._retryable(e) and attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (2 ** attempt))
                    continue
                raise
            finally:
                if conn: self.pool.putconn(conn)

    def _retryable(self, err):
        s = str(err).lower()
        return any(p in s for p in ["deadlock", "serialization", "connection refused", "connection already closed"])

    def batch(self, query, params_list, page_size=1000):
        import psycopg2.extras
        conn = self.pool.getconn()
        try:
            with conn.cursor() as cur:
                psycopg2.extras.execute_batch(cur, query, params_list, page_size)
            conn.commit()
        except:
            conn.rollback()
            raise
        finally:
            self.pool.putconn(conn)

    def health(self):
        try:
            self.execute("SELECT 1")
            return {"status": "healthy"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    def close(self):
        self.pool.closeall()

| PostgreSQL Pattern | Implementation | Notes |
|--------------------|---------------|-------|
| Connection pooling | psycopg2.pool or PgBouncer | Pool size = max_conn * 0.8 |
| Statement timeout | SET statement_timeout = N | Prevents runaway queries |
| Lock timeout | SET lock_timeout = N | Prevents deadlock blocking |
| Retry logic | Exponential backoff | Only retry serialization errors |
| Batch inserts | COPY is 5-10x faster than INSERT | Use for bulk loads |
| Vacuum | autovacuum, never disable | Manual only for emergencies |
| Partitioning | Declarative (PG 10+) | Improves query performance |

### 24.2 MySQL Adapter

from dbutils.pooled_db import PooledDB
import pymysql

class MySQLAdapter:
    def __init__(self, host, port, user, password, database, pool_size=5, charset="utf8mb4"):
        self.pool = PooledDB(creator=pymysql, maxconnections=pool_size, host=host, port=port, user=user, password=password, database=database, charset=charset, autocommit=False)
        self.max_retries = 3

    def query(self, sql, params=None):
        import time
        for attempt in range(self.max_retries):
            conn = self.pool.connection()
            try:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    return cur.fetchall()
            except Exception as e:
                if self._deadlock(e) and attempt < self.max_retries - 1:
                    time.sleep(0.5 * (attempt + 1))
                    continue
                raise
            finally:
                conn.close()

    def execute(self, sql, params=None):
        conn = self.pool.connection()
        try:
            with conn.cursor() as cur:
                affected = cur.execute(sql, params)
            conn.commit()
            return affected
        except:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _deadlock(self, err):
        return hasattr(err, "args") and any("1213" in str(a) for a in err.args)

    def bulk_insert(self, table, columns, rows, chunk=100):
        conn = self.pool.connection()
        try:
            with conn.cursor() as cur:
                ph = ", ".join(["%s"] * len(columns))
                cols = ", ".join(columns)
                sql = f"INSERT INTO {table} ({cols}) VALUES ({ph})"
                for i in range(0, len(rows), chunk):
                    cur.executemany(sql, rows[i:i+chunk])
            conn.commit()
            return len(rows)
        except:
            conn.rollback()
            raise
        finally:
            conn.close()

| MySQL Pattern | Feature | Pitfall |
|---------------|---------|---------|
| Character set | utf8mb4 (not utf8) | utf8 = only 3 bytes, emoji break |
| Transaction isolation | REPEATABLE READ vs READ COMMITTED | Gap locks cause deadlocks |
| Replication lag | Seconds_Behind_Master | Read-after-write consistency |
| Max packet | Default 4MB | Connection reset on large inserts |

### 24.3 MongoDB Adapter

from pymongo import MongoClient

class MongoDBAdapter:
    def __init__(self, conn_string, database, pool_size=100, retry=True):
        self.client = MongoClient(conn_string, maxPoolSize=pool_size, retryWrites=retry, retryReads=retry)
        self.db = self.client[database]
        self.max_retries = 3

    def insert_one(self, collection, doc):
        import time
        for attempt in range(self.max_retries):
            try:
                return self.db[collection].insert_one(doc).inserted_id
            except Exception as e:
                if hasattr(e, "code") and e.code == 11000:
                    raise
                if attempt < self.max_retries - 1:
                    time.sleep(0.5 * (attempt + 1))
                    continue
                raise

    def insert_many(self, collection, docs, ordered=False):
        return self.db[collection].insert_many(docs, ordered=ordered).inserted_ids

    def find(self, collection, query=None, projection=None, sort=None, limit=0):
        cursor = self.db[collection].find(filter=query or {}, projection=projection, sort=sort, limit=limit)
        return list(cursor)

    def find_one(self, collection, query, projection=None):
        return self.db[collection].find_one(filter=query, projection=projection)

    def aggregate(self, collection, pipeline):
        return list(self.db[collection].aggregate(pipeline))

    def update_one(self, collection, query, update, upsert=False):
        r = self.db[collection].update_one(query, update, upsert=upsert)
        return {"matched": r.matched_count, "modified": r.modified_count, "upserted": r.upserted_id}

    def delete_one(self, collection, query):
        return self.db[collection].delete_one(query).deleted_count

    def create_index(self, collection, keys, unique=False, ttl=None):
        kwargs = {"keys": keys, "background": True, "unique": unique}
        if ttl: kwargs["expireAfterSeconds"] = ttl
        return self.db[collection].create_index(**kwargs)

    def watch(self, collection, pipeline=None):
        return self.db[collection].watch(pipeline=pipeline)

| MongoDB Pattern | Implementation | Warning |
|-----------------|---------------|---------|
| Read concern | local, majority, linearizable | linearizable is expensive |
| Write concern | w:1, w:majority, j:true | Safest = w:majority + j:true |
| Read preference | primary, secondary, nearest | secondary may be stale |
| TTL indexes | Auto-delete after seconds | Up to 48h for deletion |
| Change streams | Real-time via oplog | Requires replica set |
| Document size | Max 16MB | Use GridFS for larger |
| Sharding | Range or hash key | Bad key = performance disaster |

### 24.4 Redis Adapter

import redis

class RedisAdapter:
    def __init__(self, host="localhost", port=6379, password=None, db=0, pool_size=50):
        self.pool = redis.ConnectionPool(host=host, port=port, password=password, db=db, max_connections=pool_size, decode_responses=True)
        self.client = redis.Redis(connection_pool=self.pool)

    def get(self, key):
        return self.client.get(key)

    def set(self, key, value, ttl=None, nx=False):
        return self.client.set(key, value, ex=ttl, nx=nx)

    def delete(self, *keys):
        return self.client.delete(*keys)

    def exists(self, key):
        return self.client.exists(key) > 0

    def expire(self, key, ttl):
        return self.client.expire(key, ttl)

    def incr(self, key, amount=1):
        return self.client.incr(key, amount)

    def pipeline(self, transaction=True):
        return self.client.pipeline(transaction=transaction)

    def publish(self, channel, message):
        return self.client.publish(channel, message)

    def subscribe(self, channel):
        ps = self.client.pubsub()
        ps.subscribe(channel)
        return ps

    def cache_aside(self, key, fetch_fn, ttl=300):
        cached = self.get(key)
        if cached is not None: return cached
        value = fetch_fn()
        if value is not None: self.set(key, value, ttl=ttl)
        return value

    def rate_limit(self, key, max_req, window):
        import time
        now = time.time()
        pipe = self.client.pipeline()
        pipe.zadd(key, {str(now): now})
        pipe.zremrangebyscore(key, 0, now - window)
        pipe.zcard(key)
        pipe.expire(key, window)
        _, _, count, _ = pipe.execute()
        return count <= max_req

    def close(self):
        self.client.close()

| Redis Pattern | Data Structure | Use Case | Warning |
|---------------|---------------|----------|---------|
| Strings | Simple KV | Cache, counters | 512MB max per value |
| Lists | Ordered collection | Queues, buffer | Trim to avoid growth |
| Sets | Unique strings | Tags, dedup | Large sets for ops |
| Sorted sets | Ordered by score | Leaderboards, rate limiting | 64-bit float score |
| Hashes | Field-value | Object cache | Flat structure only |
| Streams | Append-only log | Event sourcing | Consumer groups |

---

## 25. API Adapter Patterns

### 25.1 REST API Adapter

import requests

class RESTAdapter:
    def __init__(self, base_url, api_key=None, timeout=30, max_retries=3, rate_limit=None):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json", "Accept": "application/json"})
        if api_key: self.session.headers["Authorization"] = f"Bearer {api_key}"
        self.timeout = timeout
        self.max_retries = max_retries
        self.rate_limit = rate_limit
        self._last_req = 0

    def _respect_rate(self):
        import time
        if self.rate_limit:
            elapsed = time.time() - self._last_req
            min_int = 1.0 / self.rate_limit
            if elapsed < min_int: time.sleep(min_int - elapsed)
            self._last_req = time.time()

    def _request(self, method, path, **kwargs):
        import time
        url = f"{self.base_url}{path}"
        self._respect_rate()
        for attempt in range(self.max_retries):
            try:
                resp = self.session.request(method, url, timeout=self.timeout, **kwargs)
                if resp.status_code == 429:
                    time.sleep(int(resp.headers.get("Retry-After", 1)))
                    continue
                resp.raise_for_status()
                return resp.json() if resp.content else None
            except requests.exceptions.ConnectionError:
                if attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt); continue
                raise
            except requests.exceptions.Timeout:
                if attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt); continue
                raise
            except requests.exceptions.HTTPError as e:
                if resp.status_code in (502, 503, 504) and attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt); continue
                raise

    def get(self, path, params=None): return self._request("GET", path, params=params)
    def post(self, path, json=None): return self._request("POST", path, json=json)
    def put(self, path, json=None): return self._request("PUT", path, json=json)
    def delete(self, path): return self._request("DELETE", path)

    def paginate(self, path, page_param="page", size_param="per_page", size=100, max_pages=None):
        page = 1; results = []
        while True:
            data = self.get(path, params={page_param: page, size_param: size})
            if not data: break
            items = data if isinstance(data, list) else data.get("data", data.get("items", []))
            results.extend(items)
            if len(items) < size: break
            if max_pages and page >= max_pages: break
            page += 1
        return results

| REST Pattern | Implementation | Failure Mode |
|-------------|---------------|-------------|
| Retry with backoff | Exponential (2^attempt) | All retries fail |
| Rate limiting | Token bucket or sliding window | 429 Too Many Requests |
| Pagination | Page-based, cursor-based | Infinite loop on empty page |
| Idempotency | Idempotency-Key header | Retry-safe POST/PATCH |
| Timeout | Connect + read timeout | Socket hang |
| Circuit breaker | Track failure rate, open circuit | Prevents cascade |

| HTTP Status | Meaning | Retry? | Circuit? |
|-------------|---------|--------|----------|
| 200 OK | Success | No | No |
| 201 Created | Success (POST) | No | No |
| 400 Bad Request | Client error | No | No |
| 401 Unauthorized | Auth error | No (refresh token) | No |
| 429 Too Many Requests | Rate limited | Yes (Retry-After) | Track |
| 500 Internal Server Error | Server error | Yes (2-3x) | Yes |
| 502 Bad Gateway | Upstream error | Yes | Yes |
| 503 Service Unavailable | Overloaded | Yes | Yes |
| 504 Gateway Timeout | Upstream timeout | Yes | Yes |

### 25.2 gRPC API Adapter

import grpc

class gRPCAdapter:
    def __init__(self, target, credentials=None, max_msg=4*1024*1024, keepalive_ms=10000, timeout=30):
        opts = [
            ("grpc.max_send_message_length", max_msg),
            ("grpc.max_receive_message_length", max_msg),
            ("grpc.keepalive_time_ms", keepalive_ms),
            ("grpc.keepalive_timeout_ms", 5000),
        ]
        self.channel = grpc.secure_channel(target, credentials, options=opts) if credentials else grpc.insecure_channel(target, options=opts)
        self.timeout = timeout

    def unary(self, stub_class, method, request):
        return getattr(stub_class(self.channel), method)(request, timeout=self.timeout)

    def server_stream(self, stub_class, method, request):
        return list(getattr(stub_class(self.channel), method)(request, timeout=self.timeout))

    def close(self): self.channel.close()

| gRPC Pattern | Feature | Consideration |
|-------------|---------|---------------|
| Unary | Request-Response | Standard RPC |
| Server streaming | Stream of responses | Real-time, watch patterns |
| Client streaming | Stream of requests | Batch, aggregation |
| Bidirectional | Stream both ways | Chat, collab |
| Deadlines | Max time per RPC | Prevents hung connections |
| Interceptors | Auth, logging, metrics | Like HTTP middleware |
| Load balancing | Client-side or proxy (Envoy) | gRPC uses HTTP/2 |

### 25.3 GraphQL API Adapter

class GraphQLAdapter:
    def __init__(self, endpoint, api_key=None, timeout=30):
        import requests
        self.endpoint = endpoint
        self.session = requests.Session()
        self.session.headers["Content-Type"] = "application/json"
        if api_key: self.session.headers["Authorization"] = f"Bearer {api_key}"
        self.timeout = timeout

    def query(self, query, variables=None):
        body = {"query": query}
        if variables: body["variables"] = variables
        resp = self.session.post(self.endpoint, json=body, timeout=self.timeout)
        resp.raise_for_status()
        result = resp.json()
        if "errors" in result: raise GraphQLError(f"GraphQL errors: {result['errors']}")
        return result["data"]

    def mutate(self, mutation, variables=None):
        return self.query(mutation, variables)

    def introspect(self):
        q = "{ __schema { types { name kind fields { name type { name kind } } } } }"
        return self.query(q)

| GraphQL Pattern | Feature | Pitfall |
|----------------|---------|---------|
| Queries | Read data | Over-fetching |
| Mutations | Write data | Under-fetching (N+1) |
| Variables | Parameterized | Always use, never string interpolation |
| Fragments | Reusable selections | Reduces duplication |
| Batching | DataLoader pattern | Batches N+1 into single queries |

### 25.4 SOAP API Adapter

from zeep import Client

class SOAPAdapter:
    def __init__(self, wsdl_url, timeout=30, max_retries=3):
        self.client = Client(wsdl_url, timeout=timeout)
        self.max_retries = max_retries

    def call(self, operation, *args, **kwargs):
        import time
        for attempt in range(self.max_retries):
            try:
                return getattr(self.client.service, operation)(*args, **kwargs)
            except Exception as e:
                if "HTTP connection" in str(e) and attempt < self.max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                raise SOAPError(f"SOAP call {operation} failed: {e}")

    def get_operations(self):
        return list(self.client.service._operations.keys())

    def get_types(self):
        return self.client.wsdl.types.types

| SOAP Pattern | Feature | Modern Equivalent |
|-------------|---------|-------------------|
| WSDL | Service contract | OpenAPI / GraphQL Schema |
| XSD | XML schema types | JSON Schema |
| SOAP envelope | XML wrapper | JSON body |
| WS-Security | XML security headers | OAuth2 / mTLS |

### 25.5 Webhook Adapter

class WebhookAdapter:
    def __init__(self, secret=None, max_retries=3, delays=[60, 300, 900]):
        self.secret = secret
        self.max_retries = max_retries
        self.delays = delays

    def send(self, url, payload, headers=None, idempotency_key=None):
        import requests, json, hashlib, time
        headers = headers or {}
        headers["Content-Type"] = "application/json"
        body = json.dumps(payload) if isinstance(payload, dict) else payload
        if self.secret:
            sig = hashlib.sha256(f"{self.secret}{body}".encode()).hexdigest()
            headers["X-Signature-256"] = sig
        if idempotency_key: headers["Idempotency-Key"] = idempotency_key
        for attempt in range(self.max_retries):
            try:
                resp = requests.post(url, data=body, headers=headers, timeout=30)
                if resp.status_code < 500: return {"status": resp.status_code, "body": resp.text}
                time.sleep(self.delays[attempt] if attempt < len(self.delays) else 900)
            except requests.exceptions.RequestException:
                if attempt < self.max_retries - 1:
                    time.sleep(self.delays[attempt] if attempt < len(self.delays) else 900)
                    continue
                raise WebhookDeliveryError(f"Failed after {self.max_retries} attempts")

    def verify(self, body, signature):
        import hashlib, hmac
        if not self.secret: return True
        expected = hmac.new(self.secret.encode(), body.encode() if isinstance(body, str) else body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

| Webhook Pattern | Delivery | Retry | Idempotency |
|----------------|----------|-------|-------------|
| At-most-once | Best effort | None | Not needed |
| At-least-once | Retry on failure | Exponential backoff | Idempotency key |
| Exactly-once | Retry + dedup | Retry with idempotency | Check before processing |

| Webhook Security | Mechanism | Notes |
|-----------------|-----------|-------|
| Payload signature | HMAC-SHA256 | Verify before processing |
| Secret rotation | Monthly rotation | Support multiple active secrets |
| IP allowlisting | Restrict to known IPs | Static IPs for sender |
| mTLS | Mutual TLS | Both sides verify |
| Timestamp check | Reject >5min old | Prevents replay |

---

## 26. Message Queue / Event Stream Adapters

### 26.1 Kafka Producer/Consumer

from confluent_kafka import Producer, Consumer
import json

class KafkaProducerAdapter:
    def __init__(self, servers, client_id=None, acks="all", compression="snappy", retries=5):
        conf = {"bootstrap.servers": servers, "acks": acks, "compression.type": compression, "retries": retries}
        if client_id: conf["client.id"] = client_id
        self.producer = Producer(conf)

    def produce(self, topic, key, value, headers=None):
        value_bytes = json.dumps(value).encode() if isinstance(value, dict) else (value.encode() if isinstance(value, str) else value)
        key_bytes = key.encode() if isinstance(key, str) else key
        self.producer.produce(topic, key=key_bytes, value=value_bytes, headers=headers, callback=self._delivery_report)
        self.producer.poll(0)

    def flush(self, timeout=None):
        remaining = self.producer.flush(timeout=timeout)
        if remaining > 0: raise KafkaFlushError(f"{remaining} messages undelivered")

    def _delivery_report(self, err, msg):
        if err: raise KafkaProduceError(f"Delivery failed: {err}")

    def close(self): self.producer.flush()


class KafkaConsumerAdapter:
    def __init__(self, servers, group_id, topics, offset="earliest", auto_commit=False):
        conf = {"bootstrap.servers": servers, "group.id": group_id, "auto.offset.reset": offset, "enable.auto.commit": auto_commit}
        self.consumer = Consumer(conf)
        self.consumer.subscribe(topics if isinstance(topics, list) else [topics])

    def poll(self, timeout=1.0):
        msg = self.consumer.poll(timeout=timeout)
        if msg is None: return None
        if msg.error(): raise KafkaError(f"Consumer error: {msg.error()}")
        return {"topic": msg.topic(), "partition": msg.partition(), "offset": msg.offset(), "key": msg.key().decode() if msg.key() else None, "value": json.loads(msg.value().decode()) if msg.value() else None, "timestamp": msg.timestamp()[1]}

    def commit(self, async=False): self.consumer.commit(async=async)
    def close(self): self.consumer.close()

| Kafka Pattern | Producer | Consumer |
|-------------|----------|----------|
| Exactly-once | idempotence=true + acks=all | isolation.level=read_committed |
| At-least-once | acks=all (default) | manual commit |
| At-most-once | acks=0 (fire-and-forget) | auto-commit before processing |
| Ordering | Same key = same partition | Single partition = ordered |

| Kafka Failure | Impact | Mitigation |
|-------------|--------|-----------|
| Leader election | ~10s unavailable | min.insync.replicas=2 |
| Disk full | Produce failures | Monitor, retention limits |
| Consumer lag | Processing delay | Lag monitoring, auto-scale |
| Rebalance storm | All stop | Cooperative rebalance |

### 26.2 RabbitMQ Adapter

import pika

class RabbitMQAdapter:
    def __init__(self, host="localhost", port=5672, vhost="/", user="guest", password="guest", heartbeat=60):
        creds = pika.PlainCredentials(user, password)
        params = pika.ConnectionParameters(host=host, port=port, virtual_host=vhost, credentials=creds, heartbeat=heartbeat)
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()

    def declare_exchange(self, name, type="direct", durable=True):
        self.channel.exchange_declare(exchange=name, exchange_type=type, durable=durable)

    def declare_queue(self, name, durable=True, dlx=None, dlx_rk=None, ttl=None):
        args = {}
        if dlx: args["x-dead-letter-exchange"] = dlx
        if dlx_rk: args["x-dead-letter-routing-key"] = dlx_rk
        if ttl: args["x-message-ttl"] = ttl
        self.channel.queue_declare(queue=name, durable=durable, arguments=args)

    def bind(self, queue, exchange, routing_key=""):
        self.channel.queue_bind(queue=queue, exchange=exchange, routing_key=routing_key)

    def publish(self, exchange, routing_key, body, delivery_mode=2):
        props = pika.BasicProperties(delivery_mode=delivery_mode)
        self.channel.basic_publish(exchange=exchange, routing_key=routing_key, body=body.encode() if isinstance(body, str) else body, properties=props)

    def consume(self, queue, callback, prefetch=1):
        self.channel.basic_qos(prefetch_count=prefetch)
        self.channel.basic_consume(queue=queue, on_message_callback=callback)
        self.channel.start_consuming()

    def ack(self, tag): self.channel.basic_ack(delivery_tag=tag)
    def nack(self, tag, requeue=False): self.channel.basic_nack(delivery_tag=tag, requeue=requeue)
    def close(self):
        if self.connection and self.connection.is_open: self.connection.close()

| RabbitMQ Pattern | Exchange Type | Routing |
|-----------------|---------------|---------|
| Direct | Direct | Exact routing key |
| Topic | Topic | Pattern (user.*, user.#) |
| Fanout | Fanout | All bound queues |
| Headers | Headers | Header attributes match |
| Dead letter | Any | Rejected/expired to DLX |
| Quorum queues | Any (HA) | Raft-based replication |

### 26.3 SQS/SNS Adapters

(See AWS Section 21.1 above for SQSAdapter and SNSAdapter classes.)

| SQS/SNS Pattern | Configuration | Notes |
|----------------|--------------|-------|
| Visibility timeout | 30s default, max 12h | Match to processing time |
| Dead letter queue | maxReceiveCount (3-5) | Separate DLQ per source |
| Fan-out | SNS to multiple SQS | One topic, N subscriptions |
| FIFO dedup | Content-based or explicit ID | Required for exactly-once |
| Long polling | WaitTimeSeconds=20 | Reduces empty responses |

### 26.4 Redis Pub/Sub

class RedisPubSubAdapter:
    def __init__(self, host="localhost", port=6379, password=None, db=0):
        import redis
        self.client = redis.Redis(host=host, port=port, password=password, db=db, decode_responses=True)

    def publish(self, channel, message):
        return self.client.publish(channel, message)

    def subscribe(self, channel):
        ps = self.client.pubsub()
        ps.subscribe(channel)
        return ps

    def psubscribe(self, pattern):
        ps = self.client.pubsub()
        ps.psubscribe(pattern)
        return ps

    def listen(self, pubsub):
        for msg in pubsub.listen():
            if msg["type"] == "message":
                yield {"channel": msg["channel"], "data": msg["data"]}

| Redis Pub/Sub | Feature | Limitation |
|--------------|---------|------------|
| Fire-and-forget | Fast, low overhead | No delivery guarantee |
| Pattern matching | PSUBSCRIBE user:* | Single Redis instance |
| Reliability | No persistence | Messages lost on restart |
| Scaling | Single-threaded | Not for high-throughput |

### 26.5 Pulsar Adapter

import pulsar

class PulsarAdapter:
    def __init__(self, service_url, token=None):
        self.client = pulsar.Client(service_url, authentication=pulsar.AuthenticationToken(token) if token else None)

    def create_producer(self, topic, schema="bytes", compression="lz4"):
        return self.client.create_producer(topic, schema=schema, compression_type=compression)

    def create_consumer(self, topic, subscription, sub_type="shared"):
        return self.client.subscribe(topic, subscription, consumer_type=getattr(pulsar.ConsumerType, sub_type.upper()))

    def send(self, producer, message):
        producer.send(message.encode() if isinstance(message, str) else message)

    def receive(self, consumer, timeout_ms=1000):
        msg = consumer.receive(timeout_millis=timeout_ms)
        if msg: consumer.acknowledge(msg)
        return msg.data().decode() if msg else None

    def close(self): self.client.close()

| Pulsar Pattern | Feature | Benefit |
|---------------|---------|---------|
| Multi-tenancy | Tenants + namespaces | Isolated by team/use-case |
| Geo-replication | Cross-region replication | Active-active multi-region |
| Partitioned topics | Auto-scaling partitions | Throughput scaling |
| Subscription types | Exclusive, Shared, Failover | Multiple consumer modes |
| Topic compaction | Retain latest by key | State reconstruction |

---

## 27. Authentication/Authorization Adapter Patterns

### 27.1 OAuth 2.0 Adapter

import requests, time, secrets

class OAuth2Adapter:
    def __init__(self, client_id, client_secret, token_url, auth_url=None, redirect_uri=None, scopes=None):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.auth_url = auth_url
        self.redirect_uri = redirect_uri
        self.scopes = scopes or ["openid", "profile"]
        self._token = None
        self._expiry = 0

    def auth_url(self, state=None, code_challenge=None):
        import urllib.parse
        params = {"response_type": "code", "client_id": self.client_id, "redirect_uri": self.redirect_uri, "scope": " ".join(self.scopes), "state": state or secrets.token_hex(16)}
        if code_challenge:
            params["code_challenge_method"] = "S256"
            params["code_challenge"] = code_challenge
        return f"{self.auth_url}?{urllib.parse.urlencode(params)}"

    def exchange_code(self, code, code_verifier=None):
        data = {"grant_type": "authorization_code", "code": code, "redirect_uri": self.redirect_uri, "client_id": self.client_id, "client_secret": self.client_secret}
        if code_verifier: data["code_verifier"] = code_verifier
        resp = requests.post(self.token_url, data=data, timeout=30)
        resp.raise_for_status()
        td = resp.json()
        self._token = td["access_token"]
        self._expiry = time.time() + td.get("expires_in", 3600)
        return td

    def client_credentials(self):
        data = {"grant_type": "client_credentials", "client_id": self.client_id, "client_secret": self.client_secret, "scope": " ".join(self.scopes)}
        resp = requests.post(self.token_url, data=data, timeout=30)
        resp.raise_for_status()
        td = resp.json()
        self._token = td["access_token"]
        self._expiry = time.time() + td.get("expires_in", 3600)
        return td

    def refresh_token(self, refresh_token):
        data = {"grant_type": "refresh_token", "refresh_token": refresh_token, "client_id": self.client_id, "client_secret": self.client_secret}
        resp = requests.post(self.token_url, data=data, timeout=30)
        resp.raise_for_status()
        td = resp.json()
        self._token = td["access_token"]
        self._expiry = time.time() + td.get("expires_in", 3600)
        return td

    def get_token(self):
        if not self._token or time.time() >= self._expiry - 60:
            raise TokenExpiredError("Token expired")
        return self._token

| OAuth2 Pattern | Grant Type | Use Case |
|---------------|-----------|----------|
| Authorization Code | Auth code + PKCE | Web apps, mobile (most secure) |
| Client Credentials | Client ID + Secret | Server-to-server |
| Resource Owner Password | Username + Password | Legacy only |
| Device Code | Device code + user_code | CLI, smart TVs, IoT |
| Refresh Token | Refresh token | Long-lived access |

| OAuth2 Security | Implementation | Risk Mitigated |
|----------------|---------------|---------------|
| PKCE | code_challenge + code_verifier | Auth code interception |
| State parameter | Random value validated on redirect | CSRF |
| Nonce | One-time use token | Replay attacks |
| Refresh token rotation | Old token invalidated | Stolen refresh tokens |

### 27.2 OpenID Connect Adapter

import jwt, requests, json

class OIDCAdapter:
    def __init__(self, client_id, client_secret, issuer_url, redirect_uri=None, scopes=None):
        self.client_id = client_id
        self.client_secret = client_secret
        self.issuer = issuer_url.rstrip("/")
        self.redirect_uri = redirect_uri
        self.scopes = scopes or ["openid", "profile", "email"]
        self._config = None
        self._jwks = None

    def discover(self):
        resp = requests.get(f"{self.issuer}/.well-known/openid-configuration", timeout=30)
        resp.raise_for_status()
        self._config = resp.json()
        return self._config

    def get_jwks(self):
        if not self._config: self.discover()
        resp = requests.get(self._config["jwks_uri"], timeout=30)
        resp.raise_for_status()
        self._jwks = resp.json()
        return self._jwks

    def verify_id_token(self, id_token):
        if not self._jwks: self.get_jwks()
        header = jwt.get_unverified_header(id_token)
        key = None
        for jwk in self._jwks["keys"]:
            if jwk["kid"] == header.get("kid"):
                key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
                break
        if not key: raise OIDCKeyError("No matching JWK found")
        return jwt.decode(id_token, key, algorithms=["RS256"], audience=self.client_id, issuer=self._config["issuer"])

    def get_userinfo(self, access_token):
        if not self._config: self.discover()
        resp = requests.get(self._config["userinfo_endpoint"], headers={"Authorization": f"Bearer {access_token}"}, timeout=30)
        resp.raise_for_status()
        return resp.json()

| OIDC Endpoint | Purpose |
|-------------|---------|
| /.well-known/openid-configuration | Auto-configure client |
| jwks_uri | Public keys for verification |
| authorization_endpoint | User authentication |
| token_endpoint | Token exchange |
| userinfo_endpoint | Get user claims |
| end_session_endpoint | Logout |

### 27.3 SAML Adapter

class SAMLAdapter:
    def __init__(self, entity_id, acs_url, idp_metadata_url=None, sp_key=None, sp_cert=None):
        self.entity_id = entity_id
        self.acs_url = acs_url
        self.idp_metadata_url = idp_metadata_url
        self.sp_key = sp_key
        self.sp_cert = sp_cert

    def create_auth_request(self):
        import time, base64, urllib.parse, zlib
        request = f'''<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
            xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
            ID="_{int(time.time())}" Version="2.0"
            IssueInstant="{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}"
            Destination="{self._idp_sso_url}"
            AssertionConsumerServiceURL="{self.acs_url}">
            <saml:Issuer>{self.entity_id}</saml:Issuer>
        </samlp:AuthnRequest>'''
        compressed = base64.b64encode(zlib.compress(request.encode())[2:-4]).decode()
        return f"{self._idp_sso_url}?SAMLRequest={urllib.parse.quote(compressed)}"

    def process_response(self, saml_response):
        import base64, xml.etree.ElementTree as ET
        decoded = base64.b64decode(saml_response)
        root = ET.fromstring(decoded)
        ns = {"saml2": "urn:oasis:names:tc:SAML:2.0:assertion"}
        assertion = root.find(".//saml2:Assertion", ns)
        if assertion is None: raise SAMLError("No assertion in response")
        attrs = {}
        for attr in assertion.findall(".//saml2:Attribute", ns):
            values = [v.text for v in attr.findall("saml2:AttributeValue", ns)]
            attrs[attr.attrib["Name"]] = values[0] if len(values) == 1 else values
        return {"attributes": attrs, "issuer": assertion.findtext("saml2:Issuer", namespaces=ns)}

| SAML Concept | Description |
|-------------|-------------|
| SP-initiated SSO | Service Provider sends AuthnRequest to IdP |
| IdP-initiated SSO | IdP sends unsolicited response to SP |
| Metadata exchange | XML document with endpoints and certificates |
| NameID | User identifier (email, persistent, transient) |
| Assertion | Signed user attributes with conditions |
| SLO (Single Logout) | Terminate session at both SP and IdP |

### 27.4 API Key Adapter

import secrets, hashlib, hmac, time

class APIKeyAdapter:
    def __init__(self, key_length=32, prefix="sk_"):
        self.key_length = key_length
        self.prefix = prefix

    def generate(self):
        raw = secrets.token_hex(self.key_length)
        key = f"{self.prefix}{raw}"
        return {"key": key, "hash": hashlib.sha256(key.encode()).hexdigest(), "prefix": self.prefix}

    def validate(self, key, stored_hash):
        return hmac.compare_digest(hashlib.sha256(key.encode()).hexdigest(), stored_hash)

    def rotate(self, user_id, rotate_fn):
        new = self.generate()
        old = rotate_fn(user_id, new["hash"])
        return {"new_key": new["key"], "grace_period_end": time.time() + 3600}

    def mask(self, key):
        if len(key) <= 10: return key[:4] + "****"
        return key[:6] + "*" * (len(key) - 10) + key[-4:]

| API Key Pattern | Security Level |
|----------------|---------------|
| Key format: prefix_random_hex | High |
| Storage: hash only | Critical |
| Rotation: grace period with dual keys | High |
| Permissions: scope-based | High |
| Expiration: TTL | High |

### 27.5 mTLS Adapter

import ssl

class mTLSAdapter:
    def __init__(self, cert_path=None, key_path=None, ca_path=None):
        self.ctx = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
        if ca_path: self.ctx.load_verify_locations(ca_path)
        if cert_path and key_path: self.ctx.load_cert_chain(cert_path, key_path)
        self.ctx.verify_mode = ssl.CERT_REQUIRED
        self.ctx.check_hostname = True

    def create_session(self):
        import requests
        session = requests.Session()
        session.verify = self.ctx
        return session

    def create_server_context(self, cert_path, key_path, ca_path=None):
        ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        ctx.load_cert_chain(cert_path, key_path)
        if ca_path:
            ctx.load_verify_locations(ca_path)
            ctx.verify_mode = ssl.CERT_REQUIRED
        return ctx

---

## 28. Monitoring / Observability Adapters

### 28.1 Prometheus Metrics Adapter

from prometheus_client import Counter, Histogram, Gauge, Summary, start_http_server, generate_latest

class PrometheusAdapter:
    def __init__(self, app_name, port=8000):
        self.app_name = app_name
        self.port = port
        self._counters = {}
        self._histograms = {}
        self._gauges = {}

    def start_server(self):
        start_http_server(self.port)

    def counter(self, name, desc, labels=None):
        if name not in self._counters:
            self._counters[name] = Counter(name, desc, label_names=labels or [])
        return self._counters[name]

    def inc(self, name, value=1, labels=None):
        c = self.counter(name, "")
        c.labels(**labels).inc(value) if labels else c.inc(value)

    def histogram(self, name, desc, buckets=None, labels=None):
        if name not in self._histograms:
            kwargs = {"name": name, "documentation": desc, "label_names": labels or []}
            if buckets: kwargs["buckets"] = buckets
            self._histograms[name] = Histogram(**kwargs)
        return self._histograms[name]

    def observe(self, name, value, labels=None):
        h = self.histogram(name, "")
        h.labels(**labels).observe(value) if labels else h.observe(value)

    def gauge(self, name, desc, labels=None):
        if name not in self._gauges:
            self._gauges[name] = Gauge(name, desc, label_names=labels or [])
        return self._gauges[name]

    def set_gauge(self, name, value, labels=None):
        g = self.gauge(name, "")
        g.labels(**labels).set(value) if labels else g.set(value)

    def time(self, name, labels=None):
        h = self.histogram(name, "")
        return h.labels(**labels).time() if labels else h.time()

    def metrics(self):
        return generate_latest()

| Metrics Pattern | Prometheus Type | Use Case |
|----------------|---------------|----------|
| Request count | Counter | Total requests (rate/sec) |
| Request duration | Histogram | Latency percentiles |
| In-flight requests | Gauge | Current concurrent |
| Error ratio | Counter + Counter | Error rate = errors/total |
| Queue depth | Gauge | Current queue size |
| Memory usage | Gauge | Process memory |
| Job duration | Summary | Batch job percentiles |

### 28.2 Structured Logging Adapter

import logging, json, traceback
from datetime import datetime

class StructuredLogger:
    def __init__(self, name, level="INFO"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, level.upper()))
        self._extra = {}
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(message)s"))
        self.logger.addHandler(handler)

    def _log(self, level, msg, **kw):
        record = {"level": level, "msg": msg, "logger": self.logger.name, "ts": datetime.utcnow().isoformat()}
        record.update(self._extra)
        record.update(kw)
        if "exc_info" in kw and kw["exc_info"]: record["exception"] = traceback.format_exc()
        self.logger.log(getattr(logging, level.upper()), json.dumps(record, default=str))

    def info(self, msg, **kw): self._log("info", msg, **kw)
    def warn(self, msg, **kw): self._log("warn", msg, **kw)
    def error(self, msg, **kw): self._log("error", msg, **kw)
    def debug(self, msg, **kw): self._log("debug", msg, **kw)

    def bind(self, **kw): self._extra.update(kw)
    def child(self, name): c = StructuredLogger(f"{self.logger.name}.{name}"); c._extra = self._extra.copy(); return c

| Logging Pattern | Format | Shipping | Storage |
|----------------|--------|----------|---------|
| Structured JSON | {"ts", "level", "msg", "service"} | Filebeat, Fluentd, Logstash | Elasticsearch, Loki |
| Plain text | [ts] LEVEL: msg | syslog, rsyslog | Log files |
| Multi-line | Stack traces as single event | Multiline codec | Same |
| Correlation | trace_id, span_id in every log | Auto-inject from context | Search by trace_id |

| Log Shipping | Agent | Pros |
|-------------|-------|------|
| Filebeat | Go-based | Low resource, binary protocol |
| Fluentd | Ruby, plugins | Wide plugin ecosystem |
| Fluent Bit | C-based | 1/10th the resource |
| Logstash | Java, filters | Rich transforms |
| Vector | Rust | Fast, multi-sink |

### 28.3 OpenTelemetry Tracing Adapter

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace.sampling import AlwaysOnSampler

class TracerAdapter:
    def __init__(self, service_name, endpoint=None, sampler="always_on"):
        provider = TracerProvider(sampler=AlwaysOnSampler())
        self.tracer = provider.get_tracer(service_name)
        self.provider = provider

    def start_span(self, name, attrs=None, parent=None):
        from opentelemetry import trace
        ctx = trace.set_span_in_context(parent) if parent else None
        span = self.tracer.start_span(name, context=ctx)
        if attrs: span.set_attributes(attrs)
        return span

    def current_span(self, name, attrs=None):
        return self.tracer.start_as_current_span(name, attributes=attrs or {})

    def add_event(self, span, name, attrs=None):
        span.add_event(name, attributes=attrs or {})

    def set_attr(self, span, key, value):
        span.set_attribute(key, value)

    def set_status(self, span, ok=True):
        from opentelemetry.trace import Status, StatusCode
        span.set_status(Status(StatusCode.OK if ok else StatusCode.ERROR))

    def inject(self, headers=None):
        from opentelemetry.propagate import inject
        headers = headers or {}
        inject(headers)
        return headers

    def extract(self, headers):
        from opentelemetry.propagate import extract
        return extract(headers)

| Tracing Pattern | Context Propagation | Implementation |
|----------------|-------------------|---------------|
| W3C Trace Context | traceparent, tracestate | OpenTelemetry default |
| B3 propagation | x-b3-traceid, x-b3-spanid | Zipkin compatible |
| Jaeger | uber-trace-id | Jaeger native |
| AWS X-Ray | x-amzn-trace-id | AWS services |
| Datadog | x-datadog-trace-id, x-datadog-parent-id | Datadog APM |

| Sampling Strategy | Description | Use Case |
|------------------|-------------|----------|
| Always on | Sample every trace | Dev/test, low-traffic |
| Head-based | Decision at root span | Standard production |
| Tail-based | Decision after trace completes | Error-focused |
| Rate limiting | N traces/sec | High-traffic |
| Probabilistic | Random % sampled | General purpose |

### 28.4 APM Adapter

class APMAdapter:
    def __init__(self, provider, service_name, env="production"):
        self.provider = provider
        self.service_name = service_name
        self.env = env

    def auto_instrument(self, libs=None):
        instruments = libs or ["flask", "django", "requests", "sqlalchemy", "redis"]
        if self.provider == "datadog":
            from ddtrace import patch_all; patch_all()
        elif self.provider == "newrelic":
            import newrelic.agent; newrelic.agent.initialize()
        elif self.provider == "opentelemetry":
            from opentelemetry.instrumentation.auto_instrumentation import auto_instrument
            auto_instrument()

    def trace_method(self, cls, method_name, span_name=None):
        original = getattr(cls, method_name)
        def traced(*args, **kwargs):
            with self.tracer.start_as_current_span(span_name or f"{cls.__name__}.{method_name}"):
                return original(*args, **kwargs)
        setattr(cls, method_name, traced)
        return cls

    def set_custom_metric(self, name, value, tags=None):
        if self.provider == "datadog":
            from ddtrace import tracer; tracer.set_tag(name, value)
        elif self.provider == "newrelic":
            import newrelic.agent; newrelic.agent.add_custom_parameter(name, value)

| APM Feature | Datadog | New Relic | Dynatrace |
|------------|---------|-----------|-----------|
| Auto-instrumentation | ddtrace.patch_all() | newrelic-agent | OneAgent |
| Code-level visibility | Profiling | CodeStream | PurePath |
| Distributed tracing | APM traces | Distributed tracing | PurePath |
| Service map | Auto-generated | Auto-discovered | Smartscape |
| Log correlation | trace_id injection | Log forwarding | RVA |

---

## 30. Adapter Testing Patterns

### 30.1 Mocking External Services

import unittest
from unittest.mock import Mock, patch, MagicMock

class TestAPIAdapter(unittest.TestCase):
    def setUp(self):
        self.adapter = RESTAdapter(base_url="https://api.example.com")
        self.adapter.session = MagicMock()

    def test_get_success(self):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"id": 1, "name": "test"}
        self.adapter.session.request.return_value = mock_response
        result = self.adapter.get("/users/1")
        self.assertEqual(result["id"], 1)

    def test_get_retry_on_500(self):
        from requests.exceptions import HTTPError
        mock_fail = MagicMock(status_code=500)
        mock_fail.raise_for_status.side_effect = HTTPError("500")
        mock_success = MagicMock(status_code=200)
        mock_success.json.return_value = {"id": 1}
        self.adapter.session.request.side_effect = [mock_fail, mock_success]
        result = self.adapter.get("/users/1")
        self.assertEqual(result["id"], 1)

    def test_get_exhausts_retries(self):
        from requests.exceptions import HTTPError
        mock_fail = MagicMock(status_code=503)
        mock_fail.raise_for_status.side_effect = HTTPError("503")
        self.adapter.session.request.return_value = mock_fail
        with self.assertRaises(HTTPError):
            self.adapter.get("/users/1")
        self.assertEqual(self.adapter.session.request.call_count, 3)

| Mocking Pattern | Tool | Purpose |
|----------------|------|---------|
| Mock objects | unittest.mock | Replace real objects with test doubles |
| Patch decorator | @patch("module.ClassName") | Temporarily replace imports |
| MagicMock | MagicMock() | Auto-create method stubs |
| side_effect | [a, b, c] | Sequence of return values or exceptions |
| spec_set | MagicMock(spec=RealClass) | Enforce interface contracts |

---

### 30.2 Integration Testing with Real Services

class TestDatabaseAdapterIntegration:
    def setup_method(self):
        self.adapter = PostgreSQLAdapter(dsn="postgresql://test:test@localhost:5432/testdb")
        self.adapter.execute("DROP TABLE IF EXISTS test_users")

    def teardown_method(self):
        self.adapter.execute("DROP TABLE IF EXISTS test_users")
        self.adapter.close()

    def test_create_table_and_insert(self):
        self.adapter.execute("CREATE TABLE test_users (id SERIAL PRIMARY KEY, name TEXT)")
        self.adapter.execute("INSERT INTO test_users (name) VALUES (%s)", ("Alice",))
        rows = self.adapter.execute("SELECT * FROM test_users")
        assert len(rows) == 1
        assert rows[0][1] == "Alice"

    def test_rollback_on_error(self):
        self.adapter.execute("CREATE TABLE test_users (id SERIAL PRIMARY KEY, name TEXT)")
        import pytest
        with pytest.raises(Exception):
            self.adapter.execute("INSERT INTO test_users (name) VALUES (%s)", (None,))
        rows = self.adapter.execute("SELECT COUNT(*) FROM test_users")
        assert rows[0][0] == 0

| Integration Pattern | Service | Notes |
|-------------------|---------|-------|
| Testcontainers | Docker containers per test | JUnit, pytest support |
| Test DB | Isolated DB per suite | Reset between runs |
| WireMock | HTTP mock server | Record/replay |
| LocalStack | AWS emulation | S3, DynamoDB, SQS, Lambda |
| Test Redis | In-memory Redis | redislite, fakeredis |
| Ephemeral Kafka | Kafka in Docker | Testcontainers |

---

### 30.3 Contract Testing

from pact import Consumer, Provider

class TestConsumerContract(unittest.TestCase):
    def setUp(self):
        self.pact = Consumer("UserServiceClient").has_pact_with(
            Provider("UserService"), host_name="localhost", port=1234)
        self.pact.start_service()
        self.adapter = RESTAdapter(base_url="http://localhost:1234")

    def tearDown(self):
        self.pact.stop_service()

    def test_get_user(self):
        expected = {"id": 1, "name": "Alice", "email": "alice@example.com"}
        (self.pact
            .given("user 1 exists")
            .upon_receiving("a request for user 1")
            .method("GET").path("/users/1")
            .will_respond_with(200, body=expected))
        with self.pact:
            result = self.adapter.get("/users/1")
        self.assertEqual(result, expected)

| Contract Testing Tool | Language | Approach |
|----------------------|----------|----------|
| Pact | Multi-language | Consumer-driven contracts |
| Spring Cloud Contract | JVM | Contract-first Groovy DSL |
| OpenAPI diff | All | Schema change detection |
| JSON Schema | All | Request/response validation |

---

### 30.4 Chaos Testing

class TestAdapterResilience:
    def test_circuit_breaker_opens(self):
        adapter = RESTAdapter(base_url="http://api", max_retries=1)
        circuit_breaker = CircuitBreaker(failure_threshold=5)
        failures = 0
        for i in range(10):
            try:
                adapter.get("/downstream")
            except Exception:
                failures += 1
            if failures >= 5:
                assert circuit_breaker.state == "open"
                break

    def test_reconnection(self):
        adapter = RabbitMQAdapter(host="rabbitmq")
        original = adapter.connection
        adapter.connection.close()
        result = adapter.publish("test_exchange", "test_key", "msg")
        assert result is True
        assert adapter.connection != original

| Chaos Pattern | Tool | Scenario |
|-------------|------|----------|
| Network latency | Toxiproxy | Add latency to API calls |
| Connection drops | Gremlin | Kill TCP connections |
| DNS failures | iptables | Block outbound DNS |
| Disk full | dd / fallocate | Fill disk |
| OOM | stress-ng | Trigger memory pressure |
| CPU throttle | cgroups | Simulate overload |

---

### 30.5 Performance Testing

import time, statistics
from concurrent.futures import ThreadPoolExecutor, as_completed

class AdapterPerformanceTest:
    def __init__(self, adapter, endpoint, request_fn):
        self.adapter = adapter
        self.endpoint = endpoint
        self.request_fn = request_fn

    def run_load_test(self, concurrency=10, total=100):
        latencies = []
        errors = 0
        def worker(_):
            start = time.time()
            try:
                self.request_fn(self.endpoint)
                return {"ok": True, "ms": (time.time() - start) * 1000}
            except Exception:
                return {"ok": False, "ms": None}
        with ThreadPoolExecutor(max_workers=concurrency) as exe:
            futures = [exe.submit(worker, i) for i in range(total)]
            for f in as_completed(futures):
                r = f.result()
                if r["ok"]:
                    latencies.append(r["ms"])
                else:
                    errors += 1
        latencies.sort()
        return {
            "total": total, "errors": errors,
            "mean_ms": statistics.mean(latencies) if latencies else 0,
            "p50_ms": statistics.median(latencies) if latencies else 0,
            "p95_ms": latencies[int(len(latencies)*0.95)] if latencies else 0,
            "p99_ms": latencies[int(len(latencies)*0.99)] if latencies else 0,
        }

| Performance Test | Metric | Target |
|-----------------|--------|--------|
| Throughput | Requests/sec | 2x expected peak |
| Latency P50 | Median | <100ms |
| Latency P95 | 95th percentile | <500ms |
| Latency P99 | 99th percentile | <1000ms |
| Error rate | % failed | <0.1% |
| Memory leak | Growth over time | <1MB/hour |

---

## 31. Adapter Security Patterns

### 31.1 Credential Rotation Strategies

class CredentialRotator:
    def __init__(self, secrets_manager, rotation_days=30, grace_hours=24):
        self.secrets_manager = secrets_manager
        self.rotation_period = rotation_days * 86400
        self.grace_period = grace_hours * 3600

    def rotate_api_key(self, service, gen_fn, validate_fn):
        old = self.secrets_manager.get_secret(f"{service}_api_key")
        new_data = gen_fn()
        self.secrets_manager.put_secret(f"{service}_api_key", new_data["api_key"])
        self.secrets_manager.put_secret(
            f"{service}_api_key_previous", old, ttl=self.grace_period)
        return {"service": service, "status": "rotated"}

    def rotate_db_password(self, db_name, conn_fn, test_fn):
        import secrets, string
        new_pw = "".join(secrets.choice(string.ascii_letters + string.digits)
                         for _ in range(32))
        new_conn = conn_fn().replace(":PASSWORD:", new_pw)
        if not test_fn(new_conn):
            raise RotationError(f"Cannot connect with new password for {db_name}")
        self.secrets_manager.put_secret(f"{db_name}_password", new_pw)
        old = conn_fn().split(":")[2].split("@")[0]
        self.secrets_manager.put_secret(
            f"{db_name}_password_previous", old, ttl=self.grace_period)
        return {"database": db_name, "status": "rotated"}

    def schedule_rotation(self, cron, rotate_fn):
        from apscheduler.schedulers.background import BackgroundScheduler
        sched = BackgroundScheduler()
        sched.add_job(rotate_fn, "cron", cron)
        sched.start()
        return {"status": "scheduled", "cron": cron}

| Rotation Strategy | Zero-Downtime | Complexity |
|------------------|--------------|-----------|
| Dual-key (active + previous) | Yes | Low |
| Blue-green credential sets | Yes | Medium |
| Just-in-time credentials | Yes | High |
| Scheduled rotation | Yes (grace period) | Low |
| Event-driven (breach) | No | Medium |

---

### 31.2 TLS/mTLS Configuration

class TLSAdapterConfig:
    def __init__(self, min_tls="TLSv1.2", ciphers=None, verify="required", ocsp=False):
        self.min_tls = min_tls
        self.ciphers = ciphers or [
            "TLS_AES_256_GCM_SHA384",
            "TLS_CHACHA20_POLY1305_SHA256",
        ]
        self.verify = verify
        self.ocsp = ocsp

    def create_ssl_context(self):
        import ssl
        versions = {
            "TLSv1.2": ssl.PROTOCOL_TLS_CLIENT,
            "TLSv1.3": ssl.PROTOCOL_TLS_CLIENT,
        }
        ctx = ssl.SSLContext(versions.get(self.min_tls, ssl.PROTOCOL_TLS_CLIENT))
        if self.verify == "required":
            ctx.verify_mode = ssl.CERT_REQUIRED
            ctx.check_hostname = True
        elif self.verify == "optional":
            ctx.verify_mode = ssl.CERT_OPTIONAL
        else:
            ctx.verify_mode = ssl.CERT_NONE
        return ctx

    def validate_endpoint(self, hostname, port=443):
        import socket, ssl
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return {
                    "hostname": hostname,
                    "tls_version": ssock.version(),
                    "cipher": ssock.cipher(),
                    "cert_expiry": cert["notAfter"],
                }

| TLS Pattern | Security | Performance Impact |
|------------|----------|-------------------|
| TLS 1.2 + ECDHE + AES-256-GCM | High | Low |
| TLS 1.3 + TLS_AES_256_GCM_SHA384 | Highest | Lowest |
| mTLS (mutual auth) | Highest | Medium |
| Certificate pinning | High | Low |
| OCSP stapling | High | Low |
| Session resumption | Medium | High gain |

---

### 31.3 Request/Response Sanitization

class SanitizationAdapter:
    def __init__(self):
        self.strip_fields = [
            "password", "secret", "token", "api_key",
            "credit_card", "ssn", "authorization",
        ]
        self.max_depth = 10
        self.max_string = 10000

    def sanitize(self, data, depth=0):
        if depth > self.max_depth:
            return "[max_depth]" if isinstance(data, (dict, list)) else data
        if isinstance(data, dict):
            return {
                k: "[REDACTED]" if any(s in k.lower() for s in self.strip_fields)
                else self.sanitize(v, depth + 1)
                for k, v in data.items()
            }
        elif isinstance(data, list):
            return [self.sanitize(i, depth + 1) for i in data]
        elif isinstance(data, str):
            return (data[:self.max_string] + "...[truncated]"
                    if len(data) > self.max_string else data)
        return data

    def sanitize_headers(self, headers):
        safe = {}
        for k, v in headers.items():
            if any(s in k.lower() for s in self.strip_fields):
                safe[k] = "[REDACTED]"
            else:
                safe[k] = str(v)[:1000]
        return safe

| Sanitization Pattern | Risk | Implementation |
|---------------------|------|---------------|
| Strip sensitive fields | Credential leak in logs | Key-based redaction |
| Truncate long strings | Log injection / DoS | max_string_length |
| Validate SQL params | SQL injection | Parameterized queries |
| Header sanitization | Credential leak in logs | Redact auth headers |
| Content-type validation | Injection attacks | Whitelist types |

---

### 31.4 Rate Limiting and Backpressure

class RateLimiter:
    def __init__(self, backend="memory", redis_client=None):
        self.backend = backend
        self.redis = redis_client
        self._store = {}

    def check(self, key, max_req, window_sec):
        import time
        now = time.time()
        if self.backend == "redis" and self.redis:
            pipe = self.redis.pipeline()
            pipe.zadd(key, {str(now): now})
            pipe.zremrangebyscore(key, 0, now - window_sec)
            pipe.zcard(key)
            pipe.expire(key, window_sec)
            _, _, count, _ = pipe.execute()
            return count <= max_req
        if key not in self._store:
            self._store[key] = []
        window = self._store[key]
        window[:] = [t for t in window if t > now - window_sec]
        window.append(now)
        return len(window) <= max_req

    def retry_after(self, key, window_sec):
        import time
        timestamps = self._store.get(key, [])
        if timestamps:
            return int(window_sec - (time.time() - timestamps[0])) + 1
        return 0


class BackpressureStrategy:
    @staticmethod
    def reject():
        return {"status": 429, "body": {"error": "Too Many Requests"}}

    @staticmethod
    def throttle(delay_sec):
        import time
        time.sleep(delay_sec)

    @staticmethod
    def queue(queue, request):
        try:
            queue.put(request, block=False)
            return None
        except queue.Full:
            return {"status": 503, "body": {"error": "Server busy"}}

    @staticmethod
    def degrade():
        return {"status": 200, "body": {"data": None, "cached": True}}

| Rate Limiting Algorithm | Memory | Accuracy |
|------------------------|--------|----------|
| Fixed window | Low | Medium (burst at boundary) |
| Sliding window log | Medium | High |
| Sliding window counter | Medium | High |
| Token bucket | Low | High |
| Leaky bucket | Low | High |
| GCRA (Generic Cell Rate) | Low | High |

---

### 31.5 Audit Logging for Adapter Calls

class AuditLogger:
    def __init__(self, storage="file", log_path="audit.log", db_adapter=None, retention_days=365):
        self.storage = storage
        self.log_path = log_path
        self.db = db_adapter
        self.retention = retention_days

    def log(self, adapter, operation, params, status, caller=None, ms=None, error=None):
        import json, time, uuid
        entry = {
            "id": str(uuid.uuid4()),
            "ts": time.time(),
            "adapter": adapter,
            "op": operation,
            "req": self._sanitize(params),
            "status": status,
            "caller": caller,
            "ms": ms,
            "error": str(error) if error else None,
        }
        if self.storage == "file":
            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "
")
        elif self.storage == "database" and self.db:
            self.db.execute(
                "INSERT INTO audit_log VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (entry["id"], entry["ts"], entry["adapter"], entry["op"],
                 json.dumps(entry["req"]), entry["status"], entry["caller"],
                 entry["ms"], entry["error"]))
        return entry

    def _sanitize(self, data):
        strip = ["password", "secret", "token", "key"]
        if isinstance(data, dict):
            return {
                k: "[REDACTED]" if any(s in k.lower() for s in strip)
                else self._sanitize(v)
                for k, v in data.items()
            }
        if isinstance(data, (list, tuple)):
            return [self._sanitize(i) for i in data]
        if isinstance(data, str) and len(data) > 500:
            return data[:500] + "..."
        return data

    def query(self, adapter=None, op=None, start=None, end=None, limit=100):
        import json
        if self.storage == "file":
            results = []
            with open(self.log_path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        e = json.loads(line.strip())
                        if adapter and e.get("adapter") != adapter: continue
                        if op and e.get("op") != op: continue
                        if start and e.get("ts", 0) < start: continue
                        if end and e.get("ts", 0) > end: continue
                        results.append(e)
                        if len(results) >= limit: break
                    except json.JSONDecodeError:
                        continue
            return results
        return []

    def cleanup(self):
        import time, os
        cutoff = time.time() - (self.retention * 86400)
        if self.storage == "file" and os.path.exists(self.log_path):
            with open(self.log_path, "r") as f:
                lines = f.readlines()
            with open(self.log_path, "w") as f:
                for line in lines:
                    try:
                        e = json.loads(line.strip())
                        if e.get("ts", 0) >= cutoff:
                            f.write(line)
                    except json.JSONDecodeError:
                        pass
        return {"deleted": True, "retention_days": self.retention}

| Audit Log Storage | Queryability | Retention |
|-------------------|-------------|-----------|
| Flat file (JSON lines) | Linear scan | File rotation |
| Database table | SQL | DELETE by age |
| Elasticsearch | Full-text search | ILM policy |
| CloudWatch Logs | Logs Insights | Expiry policy |
| Kafka topic | Stream processing | Topic retention |

---

## Appendix: Adapter Security Checklist

Adapter Security Checklist
==========================

Authentication:
  [ ] All adapter calls authenticated (OAuth2, API key, mTLS, or JWT)
  [ ] Tokens refreshed before expiry (not on 401)
  [ ] API keys hashed in storage, never plaintext
  [ ] Credentials rotated at least every 90 days
  [ ] No hardcoded credentials in code or config

TLS:
  [ ] All external adapter calls use TLS 1.2 or higher
  [ ] Certificate verification enabled
  [ ] mTLS for service-to-service communication
  [ ] Certificate expiry monitored (alert at 30 days)
  [ ] Revocation checking enabled (OCSP or CRL)

Data Sanitization:
  [ ] Sensitive fields redacted in logs
  [ ] Input size limits enforced
  [ ] Parameterized queries (no concatenation)
  [ ] JSON content-type validated on API calls
  [ ] SSRF protections in URL-based adapters

Rate Limiting:
  [ ] Outbound rate limiting per downstream API
  [ ] Retry with exponential backoff and jitter
  [ ] Circuit breaker for downstream calls
  [ ] Bulkhead pattern for different dependencies
  [ ] Request timeout configured (connect + read)

Audit:
  [ ] All adapter calls logged (who, what, when, result)
  [ ] Failed calls logged with error details
  [ ] Audit logs retained for compliance (1-7 years)
  [ ] Audit logs append-only (immutable)
  [ ] Security events alerting configured

Secrets Management:
  [ ] Secrets from secrets manager, not env vars
  [ ] Secrets rotated automatically
  [ ] No secrets in logs, errors, or stack traces
  [ ] No secrets in source control
  [ ] Secrets scoped to least privilege

---

## Index (Complete)

| # | Section | Focus |
|---|---------|-------|
| 1 | Cloud Provider Migration | Lift/shift, replatform, semantic gaps, dual-write |
| 2 | CI/CD Platform Migration | Platform comparison, pipeline migration, caching |
| 3 | Container Platform Migration | Compose to K8s, storage, startup order |
| 4 | API Gateway Migration | Feature gaps, rate limiting semantics |
| 5 | Database Platform Migration | NoSQL to SQL, zero-downtime, migration types |
| 6 | Monolith to Microservices | Extraction, shared DB, transactions |
| 7 | Secrets & Config Migration | Platform comparison, double-read |
| 8 | Service Mesh Migration | Istio/Linkerd comparison, when NOT to use |
| 9 | CI/CD Tool Migration | Selection framework, multi-platform strategy |
| 10 | Observability Platform Migration | Feature comparison, query language transfer |
| 11 | Event Bus Migration | RabbitMQ to Kafka, bridge pattern, partitions |
| 12 | IaC Platform Migration | Terraform to Pulumi, state migration |
| 13 | Cross-Cloud Strategy | Multi-cloud decision matrix, network hub |
| 14 | Mainframe to Cloud | Batch processing, API facade, batch rewrite |
| 15 | Prompt Engineering for Migration | LLM failure modes, prompt templates |
| 16 | Organizational Patterns | Anti-patterns, team structure, knowledge transfer |
| 17 | Risk Assessment Framework | Migration risk scoring, go/no-go checklist |
| 18 | Cloud Cost Optimization | TCO comparison, hidden costs, budget template |
| 19 | Security Compliance | SOC2/HIPAA/PCI-DSS migration checklist |
| 20 | Disaster Recovery | DR during migration, cross-platform DR testing |
| 21 | Real-World War Stories | 7 anonymized migration incidents with lessons |
| 22 | Migration Runbook Template | Reusable runbook for any platform migration |
| 23 | Cloud Provider Adapters (Deep Dive) | AWS, GCP, Azure patterns, cross-cloud, migration |
| 24 | Database Adapter Patterns | Relational, NoSQL, Search, Time-series |
| 25 | API Adapter Patterns | REST, gRPC, GraphQL, SOAP, Webhook |
| 26 | Message Queue / Event Stream | Kafka, RabbitMQ, SQS/SNS, Redis, Pulsar |
| 27 | Authentication/Authorization | OAuth2, OIDC, SAML, API Key, mTLS |
| 28 | Monitoring / Observability | Metrics, Logging, Tracing, APM |
| 29 | Real-World Adapter Failure Stories | 12 adapter failure incidents with lessons |
| 30 | Adapter Testing Patterns | Mocking, integration, contract, chaos, performance |
| 31 | Adapter Security Patterns | Credential rotation, TLS, sanitization, rate limiting, audit |
| 32 | Codex-Specific Adapter [SCODEX] | Codex tool call mapping, output format, skill paths |
| 33 | IDE-Specific Adapter [SIDE] | Cursor/Windsurf tool hooks, workspace detection, coordination |

---

## 32. Codex-Specific Adapter [SCODEX]

### Purpose
I adapt Synarc's cognition layer to Codex CLI and AGENTS.md-compatible runtimes — plain-ASCII protocol, AGENTS.md-based persistence, limited filesystem access.

### Tool Call Mapping

Codex tool calls differ from Claude Code. I map them to the same classification dimensions:

| Codex Tool | Synarc Classification | Notes |
|---|---|---|
| `Read` | ANALYSIS | Always start with READ to build context |
| `Edit` | FEATURE / FIX / REFACTOR | Classify by intent, not tool |
| `Write` | FEATURE / CONFIG | New file creation |
| `Bash` | INFRA / CONFIG / DEPLOY | Higher risk — state mutation |
| `Think` | PLAN / ANALYSIS | Internal reasoning, no tracking |
| `Search` | ANALYSIS | Context gathering |
| `WebFetch` | ANALYSIS / PLAN | External data gathering |
| `FileSearch` | ANALYSIS | Context scanning |

### Output Format (Plain-ASCII Fallback)

Codex environments may not support unicode box-drawing chars. I emit plain ASCII:

```
SYNARC: WORK: <WorkType:P|U> | RISK: <LEVEL>
CHANGED : <files>
IMPACT  : <affected modules>
BREAKING: yes/no [migration if yes]
RISK    : <LEVEL> — <reason>
NEXT    : <next action>
```

### Skill Installation Paths

Codex reads skills from these locations (in priority order):
- `.codex/skills/synarc/SKILL.md` — project-local, version-controlled
- `~/.codex/skills/synarc/SKILL.md` — user-global, shared across projects
- `.codex/skills/synarc/references/` — reference files (relative to SKILL.md)
- `./brain/` — brain directory relative to repo root (same as Claude Code)

### Codex-Specific Rules

- No unicode in output — use plain ASCII markers (`--- SYNARC CHECKPOINT ---` not box-drawing chars)
- No filesystem hooks — all state tracked in conversation or AGENTS.md
- Session state stored in AGENTS.md or in-memory only
- Ledger is conversation-only unless AGENTS.md is writable
- Tool call results interpreted individually (no batch context window)

---

## 33. IDE-Specific Adapter [SIDE]

### Purpose
I adapt Synarc's cognition layer to IDE environments (Cursor, Windsurf) where the interaction model is inline edits and chat panels rather than terminal-based tool calls.

### Workspace Detection

I detect IDE environment from these signals:

| Signal | Runtime |
|---|---|
| `.cursor/rules/` directory | Cursor |
| `cursor_rules` in project config | Cursor (legacy) |
| `.windsurfrules` file | Windsurf |
| `.vscode/` with Cursor extensions | Cursor (hybrid) |

Detection priority: `.cursor/rules/` > `.windsurfrules` > `cursor_rules` > `.vscode/`+Cursor.

### Workspace Context Sources

IDE provides additional SCAN context beyond file contents:
- Open tab list — current focus areas
- Cursor position — active insertion point
- Selected code range — explicit scope of next edit
- Project tree — module boundaries inferred from directory structure
- Git status — uncommitted changes visible in editor

### Tool Hook Mapping

IDE inline actions map to Synarc classification:

| IDE Action | Synarc Classification | Notes |
|---|---|---|
| Inline edit (selection → replace) | REFACTOR:UNPLANNED | Track changed symbol names |
| Multi-cursor edit | REFACTOR:UNPLANNED | Risk proportional to touchpoints |
| Chat prompt in IDE | Full S0 sequence | Treat as new interaction |
| Inline suggestion accept | MICRO FEATURE | Suppress footer, track internally |
| File create (from IDE) | FEATURE:PLANNED or UNPLANNED | Classify by context |
| Refactor rename | REFACTOR:PLANNED | Check contract impact |

### Multi-File Coordination Patterns

IDE edits are often single-file operations that have multi-file implications:

1. **Symbol rename** — Rename in one file; check all imports/exports across workspace
2. **Type change** — Change a type definition; find all consumers and flag type mismatches
3. **API extraction** — Extract function to new file; update all imports
4. **Interface modification** — Add/remove method; find all implementations
5. **File relocation** — Move file; update all imports, check for circular deps

For each multi-file coordination pattern, I classify the risk based on:
- Number of files affected (1-2 = MICRO, 3-5 = SMALL, 6+ = MEDIUM)
- Whether contracts change (if yes, escalate one risk level)
- Whether the change is visible in open tabs (visible = faster verification)

### IDE-Specific Suppression

- Inline suggestion mode: suppress footer entirely; tracking still runs
- Chat panel responses: use full S11 format with footer
- Multi-cursor edits: batch as single REFACTOR entry unless crossing module boundaries
- File saves: treat as POST-ACTION trigger for ledger update only


*End of document*