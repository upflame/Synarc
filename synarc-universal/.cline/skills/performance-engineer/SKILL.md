---
name: performance-engineer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - sre-engineer: ">=2.0.0"
  - backend-engineer: ">=2.0.0"
title: Performance Engineer — Profiling, Load Testing, Observability, Optimization
description: Performance engineering reasoning — profiling, load testing, stress testing, capacity planning, latency analysis, throughput optimization, memory leak detection, GC tuning, database query optimization, network optimization, CDN strategy, caching layers, observability (RED, USE, golden signals), APM tools, performance budgets, regression detection, performance testing in CI. Distinct from sre-engineer (reliability in production) and backend-engineer (correctness) — this is making systems fast and keeping them fast. Inherits synarc core.
version: 1.0.0
category: quality
tags:
  - performance
  - profiling
  - load-testing
  - stress-testing
  - capacity-planning
  - latency
  - throughput
  - caching
  - apm
  - observability
  - performance-budget
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

# Performance Engineer — Profiling, Load Testing, Observability, Optimization

Inherits synarc core. All synarc prohibitions apply.

backend-engineer makes code correct. sre-engineer keeps it running. performance-engineer makes it fast and keeps it fast: profile, measure, optimize, prevent regression.

## P2 — PERFORMANCE FUNDAMENTALS

### P2.1 — Latency vs Throughput vs Cost

```
LATENCY:    time per request (p50, p95, p99, p99.9)
THROUGHPUT: requests per second (or work per second)
COST:       $ per work unit

TYPICAL GOALS:
  p50: < 50ms
  p95: < 200ms
  p99: < 500ms
  p99.9: < 2s
  throughput: X req/s at p99 < Y ms

TRIANGLE:  improving one often hurts another
  - lower latency → more resources → higher cost
  - higher throughput → contention → higher latency
  - lower cost → smaller instances → higher latency

PICK A PRIMARY OBJECTIVE; OPTIMIZE FOR IT.
```

### P2.2 — The Performance Hierarchy

```
LEVEL 0:  WORK CORRECTLY        ← required
LEVEL 1:  ARCHITECTURE          ← choice of design (sync vs async, monolith vs distributed)
LEVEL 2:  DATA STRUCTURES        ← algorithmic complexity
LEVEL 3:  I/O                    ← disk, network, db (usually the bottleneck)
LEVEL 4:  CACHE                 ← reduce I/O
LEVEL 5:  CONCURRENCY           ← parallelism
LEVEL 6:  MICRO-OPTIMIZATIONS   ← last 1%, almost never the answer

RULE: WORK FROM LEVEL 1 DOWN, NOT FROM LEVEL 6 UP.
DON'T MICRO-OPTIMIZE A WRONG ARCHITECTURE.
```

## P3 — PROFILING

### P3.1 — What Profiling Tells You

```
PROFILER OUTPUTS:
  - Where time is spent (CPU sampling)
  - Memory allocations
  - Lock contention
  - GC pauses
  - I/O wait
  - Flame graphs (visual)

RULES:
  - Profile production-like workload (not synthetic)
  - Profile under load (single request is misleading)
  - Profile with realistic data sizes
  - Disable profiler overhead when measuring
  - Profile both CPU-bound and I/O-bound paths
  - "We should forget about small efficiencies, say about 97% of the time.
    Premature optimization is the root of all evil." — Knuth
    (the other 3%: profile first)
```

### P3.2 — Tools by Language

```
JAVASCRIPT:    Chrome DevTools, clinic.js, 0x, v8 prof
JAVA:          async-profiler, JFR, YourKit
GO:            pprof (built-in), trace
PYTHON:        cProfile, py-spy, scalene
RUST:          cargo flamegraph, perf
.NET:          dotTrace, PerfView
DATABASE:      EXPLAIN ANALYZE, pg_stat_statements, slow query log
NETWORK:       Wireshark, tcpdump, mtr
OS:            iostat, vmstat, perf, dtrace
APM:           DataDog APM, New Relic, Honeycomb, OpenTelemetry + Tempo/Jaeger
```

## P4 — LOAD AND STRESS TESTING

### P4.1 — Load Test Types

```
SMOKE:           1 user, verify it works
LOAD:            expected production load, verify SLAs
STRESS:          2-3x expected load, find breaking point
SPIKE:           sudden burst, test autoscaling
SOAK:            expected load for hours/days, find leaks
CHAOS:           inject failures, verify resilience
SCALABILITY:     find the scaling bottleneck
```

### P4.2 — Load Test Design

```
TOOLS:
  k6:         JS scripts, modern, good for CI
  Gatling:    Scala/Kotlin, great for HTTP
  Locust:     Python, good for HTTP
  Artillery:  JS, simple
  Vegeta:     Go, simple HTTP
  JMeter:     legacy, comprehensive, ugly

KEY METRICS:
  - Throughput at saturation
  - p50, p95, p99, p99.9 latency
  - Error rate
  - Resource utilization (CPU, memory, network, DB)
  - Saturation point: where latency explodes or errors spike

RULES:
  - Test in prod-like environment
  - Use real data volumes
  - Warm up (JIT, caches)
  - Run long enough to find leaks (1+ hours)
  - Isolate test network from real traffic
  - Run from multiple regions
  - Verify by running twice (consistency)

SCRIPT STRUCTURE:
  export const options = {
    stages: [
      { duration: '2m', target: 100 },   // ramp up
      { duration: '5m', target: 100 },   // hold
      { duration: '2m', target: 200 },   // ramp
      { duration: '5m', target: 200 },   // hold
      { duration: '2m', target: 0 },     // ramp down
    ],
  };
```

## P5 — CAPACITY PLANNING

### P5.1 — Capacity Model

```
DRIVING QUESTION:
  "At X rps, with Y p99 latency, what infrastructure do I need?"

INPUTS:
  - Request rate (current + forecast)
  - Request mix (read vs write, heavy vs light)
  - Data size (current + growth)
  - Latency budget
  - Availability target
  - Cost ceiling

MODELS:
  LITTLE'S LAW:     L = λ × W
    (concurrency = arrival rate × wait time)

  UNIVERSAL SCALABILITY LAW:  C(N) = N / (1 + α(N-1) + βN(N-1))
    (accounts for contention α and coherency β)

  AMDAHL'S LAW:     speedup = 1 / ((1-p) + p/N)
    (p = parallel fraction, N = parallel workers)

USE:
  - LITTLE for queueing
  - USL for system scaling (eventually hits coherency wall)
  - AMDAHL for parallelizing code
```

### P5.2 — Capacity Planning Process

```
1. FORECAST demand
   - DAU/MAU growth
   - Peak vs average
   - Seasonal / event spikes
   - Per-tenant growth (B2B)

2. ESTABLISH current baseline
   - Current rps, p99, error rate
   - Resource utilization
   - Headroom (how much can we grow?)

3. PROJECT growth
   - Linear? exponential? step?
   - Account for launches, marketing pushes
   - Worst case: black-Friday-level spike

4. PLAN
   - Headroom target: 50% spare capacity at peak
   - Lead time for new capacity (cloud = minutes, hardware = months)
   - Test the plan: chaos, load tests, game days

5. REVISIT QUARTERLY
   - Capacity plans stale in <90 days
```

## P6 — OBSERVABILITY

### P6.1 — Three Pillars (and Beyond)

```
METRICS:        numeric, aggregated, good for dashboards, alerting
LOGS:           events, searchable, good for debugging
TRACES:         request flow across services, good for latency
(4th) PROFILES: continuous profiling, find what metrics can't
(5th) EVENTS:   deployments, incidents, releases, business events

OPEN STANDARDS:
  Metrics:     OpenMetrics / Prometheus
  Logs:        OpenTelemetry / Fluentd
  Traces:      OpenTelemetry / Jaeger / Tempo
  Events:      arbitrary

USE THE SAME CORRELATION ID ACROSS ALL OF THEM.
```

### P6.2 — Golden Signals / RED / USE

```
GOOGLE'S GOLDEN SIGNALS (per service):
  - Latency
  - Traffic
  - Errors
  - Saturation

RED (per request):
  - Rate
  - Errors
  - Duration

USE (per resource):
  - Utilization   (% busy)
  - Saturation    (queue depth)
  - Errors        (error events)

EACH TELLS YOU SOMETHING DIFFERENT:
  Golden:    "is the service healthy?"
  RED:       "are users happy?"
  USE:       "is the resource healthy?"
```

### P6.3 — Alerting on Performance

```
WHAT TO ALERT:
  - p99 latency > budget
  - Error rate > threshold
  - Saturation > 80%
  - Apdex below target

WHAT NOT TO ALERT:
  - Single anomaly in a noisy metric (use SLOs)
  - Memory at 60% (just an info signal)
  - Average latency (hides tail)

RULES:
  - Alert on SLO burn rate, not raw metrics
  - Use multi-window, multi-burn-rate (Google SRE)
  - Pages: actionable, urgent
  - Tickets: non-urgent, track
  - Dashboards: in-depth, no alerts
```

## P7 — OPTIMIZATION PATTERNS

### P7.1 — Caching

```
LAYERS:
  CLIENT:         HTTP cache headers, service worker
  CDN:            edge cache, static assets, edge compute
  REVERSE PROXY:  Varnish, nginx, Cloudflare Cache
  APPLICATION:    in-memory (Caffeine, LRU), Redis
  DATABASE:       query cache, buffer pool
  RESULT:         computed once, reused

PATTERNS:
  CACHE-ASIDE:    read from cache, miss → load → populate
  READ-THROUGH:   cache sits in front of DB, transparent
  WRITE-THROUGH:  write to cache + DB on every write
  WRITE-BEHIND:   write to cache, async to DB
  REFRESH-AHEAD:  refresh cache before expiry

PITFALLS:
  - Stale data:    TTL too long, or invalidation bugs
  - Cache stampede: thundering herd on miss
  - Cold start:    warm-up time
  - Memory pressure: unbounded cache growth
```

### P7.2 — Database Performance

```
COMMON WINNERS:
  - Add the right index (use EXPLAIN)
  - Avoid N+1 queries (eager load)
  - Pagination (cursor, not offset)
  - Connection pooling
  - Read replicas for reads
  - Denormalize for hot paths
  - Materialize aggregations
  - Async write batching

QUERY ANALYSIS:
  - EXPLAIN ANALYZE:    shows actual plan + cost + time
  - Slow query log:     find the worst offenders
  - pg_stat_statements: aggregated stats

INDEXING RULES:
  - Index WHERE, JOIN, ORDER BY
  - Composite index:    column order matters
  - Partial index:      where condition
  - Covering index:     include all selected columns
  - Don't over-index:   writes get slower
```

### P7.3 — Network and Protocol

```
HTTP/1.1:        serial, 6 connections, head-of-line
HTTP/2:          multiplexed, header compression, server push (deprecated)
HTTP/3:          QUIC, no head-of-line, 0-RTT
gRPC:            HTTP/2 + protobuf, streaming, low overhead
WebSockets:      bidirectional, persistent
GraphQL:         one round trip, client-specified shape

PAY ATTENTION TO:
  - TLS handshake cost (use session resumption, 0-RTT)
  - DNS lookup (preconnect, dns-prefetch)
  - TCP slow start (large initial window helps)
  - Compression (Brotli for text, off for binary)
  - Connection pooling (don't open per request)
```

## P8 — PERFORMANCE BUDGETS

### P8.1 — What Is a Budget

```
A BUDGET IS A LIMIT YOU ENFORCE.

EXAMPLES:
  - JS bundle: 200 KB compressed
  - CSS:        50 KB compressed
  - LCP:        < 2.5s on 3G
  - INP:        < 200ms
  - TTI:        < 3.5s on mid-range mobile
  - API p95:    < 200ms
  - Memory:     < 100 MB on low-end Android

EACH BUDGET:
  - Has an owner
  - Is measured in CI
  - Fails the build on violation
  - Has a process for raising
```

### P8.2 — Web Vitals (Core)

```
LCP (Largest Contentful Paint):
  - < 2.5s good
  - 2.5-4.0s needs improvement
  - > 4.0s poor
  - WHAT: largest visible content element

INP (Interaction to Next Paint):
  - < 200ms good
  - 200-500ms needs improvement
  - > 500ms poor
  - WHAT: latency of user interaction to visible response

CLS (Cumulative Layout Shift):
  - < 0.1 good
  - 0.1-0.25 needs improvement
  - > 0.25 poor
  - WHAT: visual stability, layout shift

TTFB, FCP, FID, TBT, TTI:    secondary metrics
```

## P9 — REGRESSION DETECTION

### P9.1 — Performance Testing in CI

```
BENCHMARKS:
  - Code-level (micro-benchmarks)
  - API-level (request/response)
  - Browser-level (Lighthouse, WebPageTest)
  - Bundle-size (bundlesize, size-limit)
  - Memory (heap snapshots, allocation tracking)

WHERE TO RUN:
  - Every PR:        bundle size, smoke perf
  - Nightly:         full perf suite
  - Pre-release:     full suite + multiple regions

TRACK:
  - Median over time (regression detection)
  - Compare to previous release
  - Block PR on > 5% regression
  - Performance dashboard, trend over commits
```

### P9.2 — Continuous Profiling in Production

```
TOOLS:
  - Google Cloud Profiler
  - Datadog Continuous Profiler
  - Pyroscope
  - Parca
  - Polar Signals

WHAT YOU GET:
  - Flame graph of CPU time per function, per request
  - Memory allocation
  - Lock contention
  - Low overhead (<1%)
  - Can find bugs in production that can't be reproduced in test

COST:
  - Some vendor lock-in
  - Some setup complexity
  - WORTH IT for any service with scale
```

## P10 — OUTPUT FORMATS

### P10.1 — Performance Test Report

```
TEST:                   [name]
TYPE:                   [load | stress | spike | soak]
DATE:                   [date]
DURATION:               [duration]
TARGET:                 [service, env]

CONFIGURATION:
  RPS:                  [target, peak]
  USERS:                [concurrent]
  DATA:                 [size, mix]
  REGIONS:              [from, to]

RESULTS:
  THROUGHPUT:           [X rps at saturation]
  LATENCY p50/p95/p99:  [X / Y / Z ms]
  ERRORS:               [X%, types]
  RESOURCE PEAK:        [CPU X%, MEM Y GB, NET Z Mbps]

VERDICT:                [PASS / FAIL against SLA]

BOTTLENECK IDENTIFIED:
  - [bottleneck 1: where, why, fix]

RECOMMENDATIONS:
  - [short-term: 1 sprint]
  - [medium-term: 1 quarter]
  - [long-term: architectural]
```

### P10.2 — Capacity Plan

```
PLANNING PERIOD:        [Q3 2026]
SERVICE:                [name]
SLO:                   [p99 < X ms, availability > 99.9%]

CURRENT CAPACITY:
  Instances:            [N × type]
  Peak rps:             [X]
  Peak p99:             [X ms]
  Headroom:             [X%]

FORECAST:
  +X% DAU over period
  +Y events likely (Black Friday, launch)
  -Z% off-peak

REQUIRED:
  Peak:                 [X rps, Y instances]
  Steady state:         [X rps, Y instances]
  Worst case:           [X rps, Y instances]

HEADROOM TARGET:        [50%]
LEAD TIME TO SCALE:     [cloud: minutes / hardware: weeks]

COST:                   [$X/month]

MITIGATIONS:
  - Auto-scaling
  - Rate limits at known limit
  - Degradation plan
  - Pre-emptive capacity purchases for known events
```

## P11 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Optimize without measuring | Wasted effort, wrong fix | Profile first, find the bottleneck, then optimize |
| Micro-optimize critical path | Wrong level of work | Optimize architecture, data structures, I/O first |
| Cache everything | Stale data, invalidation bugs | Cache with clear TTL and invalidation strategy |
| Alert on average latency | Hides tail, miss real issues | p50, p95, p99, p99.9, Apdex |
| No performance budget | Regressions ship every release | Budget, measure in CI, block on violation |
| Single region load test | Misses geo issues | Multi-region for production-realistic results |
| Test in staging only | Staging isn't prod | Continuous profiling in prod |
| Optimize in isolation | You made the path fast, broke others | Trace-based optimization (system-wide) |
| Capacity plan once | Stale in 90 days | Revisit quarterly, ahead of launches |
| Use synthetic data for perf test | Miss real perf bugs | Prod-like data sizes, distribution |

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every perf test, optimization, or capacity decision.*

*Escalate to sre-engineer when: perf regression impacts reliability. Escalate to security-engineer when: perf test reveals data exposure. Escalate to finops-engineer when: capacity decision needs cost modeling.*
