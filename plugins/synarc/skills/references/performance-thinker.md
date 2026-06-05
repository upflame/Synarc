---
title: Performance Thinker
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc
tags:
  - performance
  - latency-analysis
  - throughput-optimization
  - capacity-planning
  - profiling
  - bottleneck-identification
  - caching-strategies
  - performance-budgeting
  - load-testing
  - database-performance
---

# Purpose

Analyze and optimize system performance through latency decomposition, bottleneck identification, capacity planning, and performance budgeting — ensuring predictable, efficient systems that meet latency and throughput targets under all load conditions.

# Scope

Performance investigation methodology, latency decomposition, bottleneck identification, queueing theory, caching strategies, performance budgets, load testing, database performance (query optimization, connection pooling, sharding), profiling (CPU, memory, I/O, network), throughput optimization patterns, anti-patterns. Inherits synarc core WorkType taxonomy and risk floors.

# Inputs

System architecture, latency/throughput metrics, profiling data, trace spans, resource utilization, load test results, performance budgets.

# Outputs

Identified bottlenecks, performance improvement plans, optimized code/configurations, updated performance budgets, capacity plans, monitoring dashboards.

---

## 1. Performance Investigation Loop

```
MEASURE → IDENTIFY → HYPOTHESIZE → TEST → VERIFY → DOCUMENT → ITERATE
```

**MEASURE**: Collect baseline (latency, throughput, resource utilization). Without baseline, no improvement can be measured.

**IDENTIFY**: Find the bottleneck — the component with highest time cost or utilization on the critical path.

**HYPOTHESIZE**: Specific hypothesis about cause. Example: "The database query is slow because it does a sequential scan on a 10M-row table."

**TEST**: Apply one change, measure again. If bottleneck shifts, you found it.

**VERIFY**: Confirm fix works under expected load, not just idle.

**DOCUMENT**: Record finding, fix, and measurable improvement.

## 2. Bottleneck Identification

| Symptom | Likely Bottleneck | First Check |
|---|---|---|
| High CPU, low IO | CPU-bound (computation, contention) | Profile hot methods, lock contention |
| Low CPU, high IO | IO-bound (disk, network, DB) | Connection pool, query speed, network latency |
| Increasing latency with concurrency | Contention (locks, queues, pools) | Thread pool, connection pool, lock profiling |
| Latency spikes at regular intervals | GC pause, cron, cache expiry | GC logs, cron schedule, cache TTL |
| Throughput flatlines at a threshold | Queue saturation | Queue depth, backpressure, circuit breakers |
| Memory growing over time | Memory leak, cache growth | Heap dump, cache size, eviction policy |

Universal rule: Fixing one bottleneck reveals another. This is normal.

## 3. Latency Decomposition

```
TOTAL LATENCY = Processing + IO + Queueing + Contention
```

Budget every critical journey across components. If any component exceeds budget by 30%+, investigate. Fix the largest excess first.

**The four golden signals**: Latency (p50/p95/p99/p999), Traffic (req/s), Errors (rate), Saturation (queue depth, utilization).

Measurement principles: measure at every layer, measure in percentiles (never averages), measure under load, measure in production, measure continuously.

## 4. Core Performance Laws

### Universal Scalability Law
```
Throughput(N) = N × Throughput(1) / (1 + σ(N-1) + κ(N-1)N)
```
σ = contention coefficient (lock contention, pool exhaustion); κ = coherence coefficient (cache coherence, distributed consensus)

### Amdahl's Law
```
Speedup = 1 / ((1 - P) + P/N)
```
If 5% is serial, max speedup is 20x no matter how many cores. Reduce serial portion before parallelizing.

### Little's Law
```
L = λ × W  (Concurrency = Throughput × Latency)
```
Connection pool sizing: `Pool = MaxThroughput × ConnectionHoldTime / (1 - SafetyMargin)`

### Queueing Theory (M/M/1)
```
Utilization ρ = λ/μ
Avg queue length = ρ²/(1-ρ)
Avg wait time = ρ/(μ-λ)
```
**80% utilization rule**: At 80%, wait time is 4× service time. At 95%, it's 19×. Never run single-threaded resources above 80%. Multi-server pools can go to 85-90%.

## 5. Caching Strategy

| Strategy | Hit Rate | Write Cost | Staleness | Use Case |
|---|---|---|---|---|
| Cache-aside | Medium | Low | Low | General-purpose, read-heavy |
| Write-through | High | Medium | None | Consistency-critical |
| Write-behind | Low | Low | High | Write-heavy, staleness acceptable |
| Refresh-ahead | Very High | Low | Low | Predictable access patterns |

Cache decision: Read rate > write rate by 10x → Cache-aside. Consistency critical → Write-through. Data expensive to compute → Long TTL, refresh-ahead.

### Cache Stampede Prevention
TTL jitter (±5-15%), refresh-ahead, mutex on miss, probabilistic early expiration, hot key replication. At scale (50+ servers), stampede probability >28% per cycle without mitigation.

### Multi-Level Cache
L1 (local memory, <1μs, hundreds MB) → L2 (distributed Redis, 1-5ms, GBs-TBs) → L3 (origin, 10-100ms+)

## 6. Performance Budget

Define for every critical user journey: allocate latency across components with 10% reserve. Enforce in CI/CD:
- Warning: exceeded by <10% → comment on PR
- Soft block: 10-30% → require justification
- Hard block: >30% → block merge

Budgets revised quarterly or after architecture changes.

## 7. Load Testing

Design: realistic workload mix (80% reads, 20% writes), production-scale data, ramp concurrency (1→200), duration (2min warmup → 10min test → 2min cooldown). Rule of 3: run each test 3 times. If results vary >20%, environment is unstable.

## 8. Database Performance

### Query Optimization Hierarchy
1. Is the query necessary? → Eliminate unused queries
2. Is it efficient? → Rewrite for better plan
3. Is the index correct? → Add/modify index
4. Is data volume right-sized? → Partition/archive
5. Is hardware sufficient? → Scale up or out

### Index Design
- Index for WHERE clause first (equality columns first, range columns second)
- High-cardinality columns make better index leaders
- Composite index: most selective column first
- Covering indexes: include all columns the query needs
- Don't over-index (each index slows writes)

### Connection Pooling
Size by Little's law: `Pool = PeakThroughput × HoldTime / (1 - SafetyMargin)`. Set connection timeout to latency budget max. Never hold connections during external I/O.

### Sharding Thresholds
Total data >5TB, or write throughput exceeds single node, or index rebuild > maintenance window. Use hash-based for even distribution. Consider alternatives first (read replicas, caching, vertical partitioning, better indexes, faster hardware).

## 9. Profiling Methodology

### CPU Profiling
99 Hz sample frequency (<1% overhead). Key tools: async-profiler (JVM), perf (Linux), pprof (Go), py-spy (Python). Read flame graphs: wide towers = hot methods, plateaus = loops. Use comparison flame graphs (red = increased, blue = decreased).

### Memory Profiling
Compare two heap dumps taken 5min apart. Growing objects = leak. High GC frequency (>10/sec) = object churn. Fix: clear references, use WeakReference, object pooling, primitive collections.

### I/O Profiling
iostat: %iowait >20% + await >10ms + queue depth >1 = IO problem. iotop to identify process. strace to identify files and operations.

### Network Profiling
tcpdump + Wireshark: retransmit rate >0.1% is bad, high RTT = network latency, small window = bottleneck.

## 10. Throughput Optimization Patterns

- **CPU-bound threads**: cores + 1
- **I/O-bound threads**: cores × (1 + Wait/Service)
- **Batching**: size-based, time-based, or hybrid. Time cap <10% of latency budget
- **Parallelism**: only for independent operations with no shared state
- **Compression**: gzip for text/JSON (3-5x), zstd for binary/logs (2-10x), LZ4 for in-memory (2-3x)

## 11. Anti-Patterns

Premature optimization, guessing the bottleneck, optimizing non-critical paths, caching without hit-rate analysis, no performance budget, testing on staging data (100 rows), single-user testing, ignoring tail latency (track p95/p99/p999), over-provisioning, no baseline, GC tuning first, thundering herd, ignoring coordinated omission (measure at client side), no regression testing, environment mismatch.
