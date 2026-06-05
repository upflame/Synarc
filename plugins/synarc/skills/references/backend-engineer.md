---
title: "Backend Engineer — Service Architecture & Data Consistency"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - backend
  - service-architecture
  - api-design
  - database-modeling
  - concurrency
  - data-consistency
  - caching
  - resilience
  - event-driven
---

# Purpose

Structured reasoning framework for backend engineering — service architecture patterns, API design (REST/GraphQL/gRPC), database modeling, concurrency, caching, error handling, resilience, and event-driven architecture. Every decision involves trade-offs between consistency, availability, latency, and durability.

# Scope

Trade-off driven design, service architecture selection, API protocol selection, database modeling, state management, concurrency patterns, caching strategies, data consistency, background jobs, resilience patterns, observability. Does not cover deployment infrastructure or frontend concerns.

# Inputs

System requirements (scale, latency, durability, team size), request flow analysis, data access patterns, failure mode requirements.

# Output

Architecture decisions with trade-off documentation, API contracts, data models, caching strategy, concurrency model, error handling patterns.

# Notes

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S5 project scales, S13 quality gates). Always ask: what happens when this fails? Under load? When two requests arrive simultaneously? When a dependency is slow? When a node dies? If you cannot answer all five, the design is incomplete. Think in layers: transport, contract, state, operational. Use DECISION blocks with OPTIONS, CONSTRAINTS, FITNESS FUNCTION, RATIONALE, REVERSIBILITY.

## 1. Decision Framework

Every backend decision follows: DECISION (what needs decided) → CONTEXT (system constraints: scale, team size, latency, ops maturity) → OPTIONS (with pros/cons) → CONSTRAINTS (hard/soft) → FITNESS FUNCTION (weighted criteria) → DECISION → RATIONALE → REVERSIBILITY.

Decision reversibility classification:

| Reversibility | Examples | Action |
|---|---|---|
| REVERSIBLE | Library choice, endpoint structure, cache TTL, index selection | Treat as implementation detail |
| MODERATELY REVERSIBLE | Message format, task queue, API version strategy | Treat as 2-week investment |
| HARD TO REVERSE | Database technology, consistency model, service boundaries, sharding | Architecture decision record |

## 2. Service Architecture Selection

| Architecture | Team Size | Domain Complexity | Key Characteristics |
|---|---|---|---|
| Monolith | < 10 | Moderate | Atomic deploys, single log stream, transactional across modules, all-or-nothing scaling |
| Modular Monolith | 10-30 | Medium-High | Bounded contexts, in-process interface calls, compile-time enforcement, extractable to services |
| Microservices | 30+ | High | Each owns data, bounded context per service, independent deploy, replaceable |
| Serverless/FaaS | Any | Variable | Cold start 100ms-5s, 15min timeout, external state, stateless handlers |

Microservices service boundary rules: [1] A service owns its data — no direct DB access from other services. [2] Service boundary follows business domain, not technical function. [3] Independently deployable without coordination. [4] Service should be replaceable — the interface is the contract. [5] If two services are always deployed together, they should be one service.

Microservices pitfalls: premature decomposition, distributed monolith (sync call chains), data consistency across boundaries, operational complexity (monitoring/debugging N services), network overhead.

Communication patterns: Synchronous (REST/gRPC) — caller depends on callee availability, use for queries and commands needing immediate confirmation. Asynchronous (events/messaging) — loose coupling, broker buffers, use for workflows and data propagation. Hybrid — command sync + async event for propagation, query via cached (eventual) or direct call (strong).

Serverless limitations: cold start, execution timeout, memory/CPU limits (3GB), connection pooling challenging (new context per invocation), debugging harder.

## 3. API Protocol Selection

| Protocol | Use Case | Key Characteristics |
|---|---|---|
| REST | CRUD, broad client compatibility | Resource-oriented, cacheable at HTTP level, standard error format |
| GraphQL | Flexible clients, complex data graphs | One endpoint, client-specified shape, DataLoader for N+1 |
| gRPC | Internal service-to-service | Protobuf, low-latency, streaming, contract-first |

REST versioning strategies: URI path (/api/v1/orders) — explicit, easy to route, most common. Header (Accept: application/vnd.company.v1+json) — cleaner URI. Query param — easy to forget, not recommended. No version (back compat only) — internal APIs only.

REST standard error response:
```json
{ "error": { "code": "INSUFFICIENT_INVENTORY", "message": "Product X has only 3 units available, 5 requested", "details": { "productId": "prod-123", "available": 3, "requested": 5 }, "requestId": "req-abc-123", "timestamp": "2026-05-26T10:30:00Z" } }
```

REST pagination: keyset/cursor preferred over offset — stable under writes. Response: { data: [...], pagination: { nextCursor: "def456", hasMore: true } }.

GraphQL design rules: [1] DataLoader for N+1. [2] Mutation input object types, not flat arguments. [3] Error unions or partial errors, not null bubbling. [4] Query complexity rate limiting. [5] Depth limiting (max 5-7). [6] Query cost analysis. [7] Persisted queries for production.

gRPC protobuf rules: [1] Never reuse field numbers — use reserved. [2] Fields 1-15 = 1 byte overhead — use for frequently populated. [3] 16-2047 = 2 bytes. [4] Never change wire format. [5] Enum wrappers for optional enums. [6] google.protobuf.Timestamp for dates. [7] google.protobuf.Decimal for money — never float.

gRPC resilience: all calls need deadline/timeout, retry policy, circuit breaker. Deadline propagation through metadata.

Contract-first workflow: define contract (OpenAPI/GraphQL schema/proto) → review with consumers → generate stubs → implement against contract → contract tests verify. Contract is the source of truth.

## 4. Database Design & Modeling

| Database Type | Use When | Avoid When |
|---|---|---|
| Relational (PostgreSQL) | Relationships, ACID, complex queries | Schema-less blobs, extreme write throughput |
| Document (MongoDB/DynamoDB) | Self-contained aggregates, flexible schema, high write | Complex joins, strong multi-doc consistency |
| Key-Value (Redis) | Simple get/set, <5ms latency, 100K+ ops/s | Complex queries, data durability (except etcd) |
| Graph (Neo4j) | Highly connected data, variable relationship depth | Simple CRUD, high-write workloads |
| Time-Series (InfluxDB/TimescaleDB) | Append-only with timestamps, time-range aggregations | Frequent updates, complex joins |
| NewSQL (CockroachDB) | SQL + ACID + horizontal scaling, multi-region | Single-region (<100GB = PostgreSQL overkill) |

Relational normalization: 1NF (atomic columns, no arrays/JSON unless justified), 2NF (no partial dependencies on composite keys), 3NF (no transitive dependencies). Denormalize only when query performance requires it.

Access pattern mapping: "Get user by email" → UNIQUE index on email, partial WHERE status='active'. "List orders by customer, sorted by date" → composite index (customer_id, created_at DESC), keyset pagination. "Aggregate sales by category" → materialized view. "Full-text search" → GIN index on tsvector (PostgreSQL) or Elasticsearch. "Hierarchical data" → adjacency list + recursive CTE, materialized path, nested sets (read-heavy), or closure table.

Index types: B-tree (general purpose, equality + range), Hash (equality only, UUID lookups), GiST/GIN (full-text, jsonb), Partial (WHERE condition — smaller, faster writes), Covering (includes all columns — index-only scans). Composite index column order: most selective first, equality then range.

Index maintenance: monitor unused (idx_scan = 0), monitor bloat (n_dead_tup / n_live_tup > 0.2), DROP unused, REINDEX bloated, periodic VACUUM ANALYZE.

NoSQL modeling: model by access pattern, not normalization. Duplicate data for query efficiency. Composite sort keys for time-series. One-to-many: embed (<100, rarely updated) or reference (>100, updated independently). Many-to-many: two-way references or junction collection. Aggregation: pre-aggregated counters (sharded for write contention), materialized (staleness), real-time stream (ops complexity).

## 5. State Management

State ownership principles: [1] Every piece of state has exactly one source of truth (SOT). [2] SOT is always a durable store (database), never memory or cache. [3] Caches are derived state — rebuildable from SOT. [4] If two services need the same state, one owns it; others request it. [5] Cross-service state sharing happens through events, not shared databases.

| Category | Description | Example |
|---|---|---|
| Owned | Service creates/updates/deletes, stored in own DB | User profiles, orders |
| Referenced | Cached from another service, may be stale | Product catalog in order service |
| Transient | Exists only during request processing | Correlation ID, auth claims |
| Computed | Derived from owned/referenced state | Materialized views, search indexes |

Session/token state: Server-side sessions (Redis persistent — fast, TTL, shared across instances) vs Stateless JWT (short-lived access 15min + long-lived refresh 7 days). JWT security: always set exp, iat, nbf, iss, aud. Asymmetric signing (RS256/ES256) for multi-service. Never include PII. Revocation: token blocklist (Redis), short TTL, refresh rotation.

## 6. Caching Architecture

| Layer | Latency | Capacity | Scope | Use Cases |
|---|---|---|---|---|
| L1 — App memory | <1ms | Process heap (GB) | Single instance | Config, reference data |
| L2 — Distributed (Redis) | 1-5ms | Cluster (GB-TB) | All instances | Session, API response, rate limiter |
| L3 — CDN edge | <50ms | Unlimited | Global | Static assets, GET responses |

Cache strategies:
- **Cache-aside (lazy loading):** READ: check cache → miss → read DB → write cache → return. WRITE: write DB → invalidate cache. Use for read-heavy. Risk: cache stampede → mutex on miss.
- **Read-through:** cache library auto-loads from DB. Simpler client, less control.
- **Write-through:** write to cache and DB synchronously. Consistent, higher write latency. Use for read-after-write consistency critical.
- **Write-behind (write-back):** write to cache → async DB write. Low write latency, data loss risk. Non-critical data only.
- **Refresh-ahead:** cache proactively refreshes before expiry. Predictable latency, risk of wasted refreshes.

Invalidation: TTL-based (simplest, stale within window). Event-driven (near-immediate, needs event infra). Write-through (strongest consistency, highest latency). Pattern-based (bulk invalidate matching pattern — Redis SCAN/DEL may be slow for large sets).

Stampede prevention: Mutex (first acquires lock, others wait), Early recomputation (proactive refresh), Stale-while-revalidate (serve stale, refresh background), Jitter (random TTL variance).

## 7. Concurrency & Async Processing

| Model | Languages | Unit | Sync | Best For |
|---|---|---|---|---|
| Thread-based | Go goroutines | ~4KB | Mutexes, channels, atomics | CPU-bound, I/O with goroutine runtime |
| Async/event-loop | Node.js, Python asyncio | ~few KB | No shared state (single thread) | I/O-bound, high connection counts |
| Actor | Erlang, Akka, Orleans | ~300B | Message passing, no shared state | Distributed state, fault-tolerant |
| Virtual threads | Java Loom, Kotlin | ~few KB | Same as thread-based | Thread-per-request, high throughput |

CPUBound work in async runtime: offload to worker threads/processes — blocks event loop otherwise.

Race condition patterns and solutions:
- **Check-then-act:** atomic SQL (UPDATE inventory SET count = count - 1 WHERE count > 0) or Redis DECR with check.
- **Read-modify-write:** optimistic locking (version column, low contention <5%) or pessimistic (SELECT FOR UPDATE, high contention).
- **Lost update:** last-writer-wins (acceptable for some), merge, conflict detection, CRDTs.
- **Non-repeatable read:** REPEATABLE READ isolation or snapshot isolation.
- **Phantom read:** SERIALIZABLE isolation or predicate locking.

Lock ordering: [1] Always acquire locks in same order across all code paths. [2] If you need lock A and B, always lock A then B. [3] Document lock ordering. Violating order causes hard-to-reproduce deadlocks.

Message queue selection:

| Queue | Model | Use Case | Limitations |
|---|---|---|---|
| Kafka | Distributed log, ordered per partition | Event streaming, audit, replay, 100K msg/s | Not for <10ms latency, simple task queues |
| RabbitMQ | Exchange/binding routing | Complex routing, delayed, RPC | No replay, long-term retention |
| SQS | Managed queue, at-least-once | Simple queuing, AWS ecosystem | Ordered (FIFO: 300 msg/s), best effort |
| Redis Streams | In-memory log, consumer groups | Simple stream, moderate throughput | Not durability-critical, large backlog |

Message design: { id (UUID), type (OrderCreated), source (orders-service), timestamp, correlationId, data (payload), version (schema) }. Keep under 256KB, ideally under 10KB. Large payloads → object store (S3) with reference.

Consumer patterns: At-least-once + idempotent handler = exactly-once semantics. At-most-once for non-critical. Exactly-once: transactional outbox + idempotent consumer + deduplication.

Consumer failure modes: Processing fail → retry (exponential backoff). Repeated fail → dead-letter queue (alert on depth). Poison pill → skip/DLQ after N failures. Slow consumer → increase partitions + consumer count.

Backpressure: consumer slower than producer → [1] scale consumers, [2] rate-limit producer (circuit breaker if queue depth > threshold), [3] shed load (prioritize, drop non-critical), [4] bounded queue (reject when full).

Background job processors: Sidekiq/Celery/Bull (Redis-backed, retries/scheduling/concurrency — web app background jobs, not long-running >1hr). Temporal/Cadence (durable workflows, multi-step, compensation logic). AWS Step Functions (managed orchestration, human approval).

Job patterns: Idempotent execution (check completion before execute, use job ID as dedup). Retry: immediate 2-3 transient → exponential backoff + jitter → max 10-25 → DLQ distinct for transient vs permanent. Concurrency: unique (one instance per args), throttled (max N concurrent), prioritized. Monitoring: queue depth, p50/p95/p99 processing time, failure rate, DLQ depth.

## 8. Data Consistency & Transaction Patterns

Distributed transactions: 2PC (coordinator overhead, blocking — avoid in distributed systems). Saga pattern — compensating actions per step, no coordinator lock, eventual consistency. Outbox pattern — write event to outbox table in same DB transaction → separate process publishes — guarantees exactly-once delivery.

## 9. Error Handling & Resilience

Error classification:
| Type | Examples | Action |
|---|---|---|
| Transient | Network timeout, rate limit, 503, file lock | Retry with backoff, max 3 |
| Permanent | Syntax error, auth failure, missing dependency | Fail immediately, log, report |

Resilience patterns: Circuit breaker — closed (normal) → open (errors exceed threshold, fail fast for N seconds) → half-open (probe, test recovery) → closed. Bulkhead — isolate failure domains per dependency (separate thread pools/connection pools). Timeout — 30s handlers, 5s sub-requests, 60s gateway → 504. Retry with exponential backoff + jitter (base × 2^attempt + jitter).

## 10. Observability

Logging: structured JSON — { timestamp, level, service, traceId, message, duration_ms, error }. WARN for retries, ERROR for unrecoverable. Never log PII/secrets.

Metrics: RED method (Rate, Errors, Duration) per endpoint. USE method (Utilization, Saturation, Errors) per resource.

Distributed tracing: correlation ID propagated via HTTP headers and message metadata. Trace ID per request flow. Health checks: liveness (process alive) separate from readiness (can serve traffic).
