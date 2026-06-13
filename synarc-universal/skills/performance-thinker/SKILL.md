---
name: performance-thinker
description: Performance Thinker — Latency Analysis & Throughput Optimization
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Performance Thinker — Latency Analysis & Throughput Optimization

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

Performance is not about speed. It is about predictability, efficiency, and capacity. A performant system is one that meets its latency and throughput targets under expected and peak load, degrades gracefully under overload, and provides visibility into its behavior at all times.



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


## P2 — METHODOLOGY: Performance Analysis Sequence

### P2.1 — The Performance Investigation Loop

```
MEASURE → IDENTIFY → HYPOTHESIZE → TEST → VERIFY → DOCUMENT
   │                                                     │
   └─────────────────── ITERATE ──────────────────────────┘
```

**MEASURE:** Collect baseline metrics (latency, throughput, resource utilization). Without baseline, you cannot measure improvement.

**IDENTIFY:** Find the bottleneck. Use profiling, tracing, and observability data. The bottleneck is the component with the highest time cost or utilization.

**HYPOTHESIZE:** Form a specific hypothesis about the cause. "The database query is slow because it's doing a sequential scan on a 10M-row table."

**TEST:** Make one change. Measure again. If the bottleneck shifts, you found it. If not, continue.

**VERIFY:** Confirm the fix works under expected load, not just idle.

**DOCUMENT:** Record the finding, the fix, and the measurable improvement.

### P2.2 — Bottleneck Identification Rules

| Symptom | Likely Bottleneck | First Check |
|---|---|---|
| High CPU, low IO | CPU-bound — computation, algorithm, contention | Profiling hot methods, lock contention |
| Low CPU, high IO | IO-bound — disk, network, database | Connection pool, query speed, network latency |
| Increasing latency with concurrency | Contention — locks, queues, connection pool | Thread pool, connection pool, lock profiling |
| Latency spikes at regular intervals | GC pause, cron job, cache expiry | GC logs, cron schedule, cache TTL |
| Throughput flatlines at a threshold | Queue saturation — system is at capacity | Queue depth, backpressure, circuit breakers |
| Memory growing over time | Memory leak — object retention, cache growth | Heap dump, cache size, eviction policy |

**Universal rule:** The bottleneck is always the component with the highest utilization on the critical path. When you fix one bottleneck, another emerges. This is normal — performance optimization is a game of whack-a-mole.

### P2.3 — Latency Decomposition

Break every request into its component latencies:

```
TOTAL LATENCY = Processing + IO + Queueing + Contention

  Processing:  CPU time executing logic
  IO:          Time waiting for disk, network, or services
  Queueing:    Time waiting for a resource (thread, connection, lock)
  Contention:  Time wasted due to concurrent access conflicts
```

**Latency budget (example):**

| Component | Budget (p99) | Actual (p99) | Status |
|---|---|---|---|
| Auth middleware | 10ms | 8ms | ✓ |
| Input validation | 5ms | 4ms | ✓ |
| Business logic | 30ms | 45ms | ✗ EXCEEDED |
| Database query | 40ms | 120ms | ✗ EXCEEDED |
| Response serialization | 5ms | 3ms | ✓ |
| Network (RTT) | 10ms | 10ms | ✓ |
| **Total** | **100ms** | **190ms** | **✗ EXCEEDED** |

The latency budget makes visible which component is the problem. In this case, the database query is 3x over budget. Fix that first.

### P2.4 — Tracing Methodology

Distributed tracing is the primary tool for latency decomposition across service boundaries. Every request that crosses a service boundary must carry a trace context.

**Trace context propagation:**

```
Request → Service A (span: search)
            │
            ├──→ Service B (span: auth)
            │     └──→ Database (span: query)
            │
            └──→ Service C (span: inventory)
                  └──→ Cache (span: get)
```

**Key trace metrics per span:**

| Metric | What It Measures | Action Signal |
|---|---|---|
| Duration | Total span time | High → span is slow |
| Self time | Duration minus child spans | High → this service is the problem |
| Wait time | Time between request send and first byte | High → queueing upstream |
| Error count | Number of failures in span | Non-zero → reliability issue |
| Span count | Number of child spans | High → chatty call pattern |

**Trace sampling strategies:**

| Strategy | Sampling Rate | Use Case |
|---|---|---|
| Head-based | 1-5% of all requests | General observability |
| Tail-based | 100% of slow requests | Debugging latency outliers |
| Probabilistic | Fixed % (e.g. 1%) | Low-overhead continuous tracing |
| Adaptive | Dynamic rate based on system load | Production with traffic spikes |

**Rule:** Always trace the first byte and last byte of every I/O operation. Without timing the I/O boundary, you cannot distinguish network latency from processing time.

### P2.5 — Flame Graph Methodology

Flame graphs visualize where CPU time is spent. The x-axis is stack frequency (not time), the y-axis is stack depth.

**When to use flame graphs:**

| Situation | Graph Type | What to Look For |
|---|---|---|
| CPU is high, throughput is low | CPU flame graph | Wide towers = hot methods. Plateaus = loops |
| Application is waiting on I/O | Off-CPU flame graph | Colored by I/O wait reason (disk, network, lock) |
| Memory allocation is high | Allocation flame graph | Hot allocation sites, object types |
| Context switching is high | Cycle flame graph | System call frequency |

**Reading a flame graph:**

- **Wide towers** at the top = hot methods. These are where CPU time goes.
- **Tall, narrow towers** = deep call stacks. May indicate over-engineered abstractions.
- **Plateaus** (wide flat tops) = loops or iteration-dominant algorithms.
- **Color coding** (if used): red = kernel, yellow = user, green = I/O, blue = lock.

**Flame graph workflow:**

```
1. Capture profile for W seconds (use perf, DTrace, or async-profiler)
2. Generate SVG flame graph (use Brendan Gregg's FlameGraph tools)
3. Identify the widest tower at the top of the graph
4. Examine that code path for inefficiency
5. Apply fix, re-profile, compare flame graphs
```

**Comparison flame graphs:** Overlay two profiles (before/after). Red = increased time, blue = decreased time. Instantly shows whether a fix worked.

### P2.6 — Measurement Methodology

**The four golden signals of measurement:**

| Signal | What It Measures | How to Measure |
|---|---|---|
| Latency | Time to serve a request | Histogram of response times |
| Traffic | Demand on the system | Requests per second, active users |
| Errors | Rate of failed requests | HTTP 5xx, exceptions, timeouts |
| Saturation | How "full" the system is | Queue depth, utilization % |

**Measurement principles:**

1. **Measure at every layer:** Application → Framework → OS → Hardware. A performance problem can live at any layer.
2. **Measure in percentiles, not averages:** Average latency hides the 5% of users who have a bad experience. Track p50, p95, p99, p99.9.
3. **Measure under load:** Idle performance is easy. Load performance reveals bottlenecks.
4. **Measure in production:** Staging environments cannot perfectly replicate production traffic patterns, data volume, or hardware.
5. **Measure continuously:** Performance regressions are silent. Without continuous measurement, they ship to production.

**The coordinated omission problem:** If you stop measuring during slow periods (because the system can't accept more requests), you will underestimate tail latency. Always measure at the client or load generator side to capture true latency including queuing.


## P4 — WORKED EXAMPLES

### E1: Search API Latency Degradation

**Situation:** Search API p99 latency increased from 200ms to 1800ms over 4 weeks. No code changes. Traffic increased 2x.

**Investigation:** Profiling shows 85% of time in database query. Query is `SELECT * FROM products WHERE text_search MATCH ? ORDER BY relevance LIMIT 20`. No index on the text_search column.

**Root cause:** Full-text scan on 5M-row table. Was fast at 2M rows, degraded at 5M. Maintainers never added an index because it worked in staging (100k rows).

**Fix:** Add GIN index on text_search column. Build time: 15 minutes on prod (concurrent, no downtime). Post-index: p99 latency 80ms.

**Lesson:** Always test queries at production data volume in staging. Use query analysis to identify missing indexes before they become problems.

### E2: Payment Service Throughput Limit

**Situation:** Payment service handles 500 transactions/second. Business needs 2000 txn/s for holiday peak. Load test shows flatline at 580 txn/s with p99 latency going from 100ms to 4000ms.

**Bottleneck identification:** CPU at 30%, memory at 40%, but database CPU at 95%. Database connection pool at 50/50 — exhausted.

**Analysis:** Each payment transaction acquires a DB connection for the full duration (avg 400ms). With 50 connections, max theoretical throughput = 50 / 0.4 = 125 txn/s. But observed is 580 txn/s — wait, that doesn't match. Re-check: connection duration is 100ms (not 400ms). 50 / 0.1 = 500 txn/s. Close to observed 580. Bottleneck confirmed: DB connection pool.

**Fix:** Increase connection pool to 150. But database CPU is already at 95%. More connections would increase context switching, not throughput.

**Real fix:** (1) Add read replicas for read-heavy operations. (2) Batch writes — 10 transactions per DB round trip. (3) Reduce connection hold time by moving non-DB work out of the connection scope.

**Result:** After batching (10x) and read replicas: 2200 txn/s at p99 150ms. Database CPU at 70%.

### E3: Memory Leak in Image Processing Pipeline

**Situation:** Image processing service restarts every 6 hours due to OOM. Memory grows at 200MB/hour. Heap dump shows 80% of memory held by `BufferedImage` objects.

**Profiling:** Each image processed creates a `BufferedImage` that is never released. Code uses `ImageIO.read()` and processes the image, but the reference is held in a processing context that is never cleared. Because images are processed asynchronously, the processing context accumulates until memory exhausts.

**Fix:** (1) Add explicit `image.flush()` after processing completes. (2) Use processing context cleanup in a `finally` block. (3) Add memory monitoring alert for heap growth rate > 50MB/hour.

**Verification:** After fix, memory stabilizes at 256MB baseline. No restart needed in 72 hours of testing.

### E4: Cache Stampede on Product Page

**Situation:** Product page p99 latency spikes from 200ms to 5000ms every 5 minutes. Coincides with cache TTL expiry (300 seconds).

**Analysis:** Cache-aside pattern. All 50 product page instances cache product data with 300-second TTL. At TTL expiry, all 50 instances miss simultaneously and query the database. Database CPU spikes to 100%, queuing all requests.

**Fix:** Staggered TTL — add 5% jitter to TTL so not all instances expire at once. Alternative: refresh-ahead — preemptively refresh cache before expiry.

**Result:** With jittered TTL: p99 stays at 220ms. Database CPU at 40% at peak. No stampede.

### E5: Chatty API Design

**Situation:** Mobile app loads 15 separate API calls on startup. Total page load: 8 seconds on 3G. Per-call latency is fine (<200ms), but 15 round trips at 300ms RTT each = 4.5 seconds of network latency alone.

**Analysis:** API was designed for desktop use with persistent connections. Mobile has higher latency and connection setup overhead. Each call is independent but always called together on startup.

**Fix:** (1) Create a `GET /api/v2/startup` batch endpoint that returns all 15 resources in one response. (2) Add HTTP/2 multiplexing. (3) Add client-side caching with `Cache-Control` headers so repeat visits skip network.

**Result:** 8 seconds → 1.2 seconds on 3G. 1 round trip instead of 15.

### E6: Lock Contention Under Concurrent Writes

**Situation:** Real-time analytics service processes 2000 events/second with 4 cores. Expected throughput at 1ms/event: 4000/s. Actual: 2000/s.

**Analysis:** Thread dump shows all 4 threads contending on a single lock. USL confirms: throughput(4) = 4×1000/(1+0.5(4-1)) = 1600. Close to observed 2000.

**Fix:** Replace global lock with AtomicLong. Result: 3800 events/s. CPU rises from 50% to 95%.


## P6 — QUALITY GATES

**Tier 1 — Hard Gates (fail = reject output):**
- [ ] Baseline measurement taken before any optimization
- [ ] Bottleneck identified with profiling evidence
- [ ] Single change applied between measurements (no compound optimizations)
- [ ] Performance target stated before change (not retroactive)
- [ ] Verification under expected load (not idle)
- [ ] Latency budget defined for critical paths
- [ ] Trade-off documented (speed vs memory vs complexity)

**Tier 2 — Standard Gates:**
- [ ] p50, p95, p99, p999 all tracked (not just average)
- [ ] Resource utilization measured (CPU, memory, IO, network)
- [ ] Load test at production data volume
- [ ] Cache hit rate measured before and after
- [ ] Degradation behavior documented (what happens beyond capacity)
- [ ] Monitoring alert added for regression detection
- [ ] Performance budget updated to reflect change

**Self-audit (run before output):**
```
Baseline measured?              yes
Bottleneck profiled?            yes
Single change tested?           yes
Target stated?                  yes
Verified under load?            yes
Budget defined?                 yes
Trade-off stated?               yes
```

## P7 — PERFORMANCE PATTERN CATALOG

### P7.1 — Common Bottleneck Patterns

| Pattern | Signature | Diagnosis | Fix |
|---|---|---|---|
| N+1 query | Latency proportional to data size | Count queries per request | Batch query, eager loading |
| Missing index | Sequential scan on large table | EXPLAIN ANALYZE shows Seq Scan | Add appropriate index |
| Contention | Latency increases with concurrency | Thread dump shows blocked threads | Reduce lock scope, use lock-free structures |
| Memory churn | High GC frequency, CPU in GC | GC logs show frequent young gen collections | Reduce allocation rate, use object pooling |
| Thundering herd | Latency spikes at regular intervals | Correlation with cache TTL | Jitter TTL, use refresh-ahead |
| Synchronous cascading | Latency = sum of all downstream latencies | Trace shows sequential calls | Parallelize independent calls, use timeout |
| Head-of-line blocking | One slow request blocks others | Queue depth grows, one request dominates | Separate fast/slow paths, use separate thread pools |
| Connection pool exhaustion | Requests waiting for connection | Pool metrics show 100% utilization | Increase pool, reduce connection hold time |
| Chatty protocol | Many round trips for single logical operation | Network trace shows small sequential calls | Batch requests, use streaming |
| Busy spin | High CPU with low throughput | Thread dump shows threads constantly running | Add backpressure, sleep, use waiting primitives |

### P7.2 — Profiling Methodology

**CPU Profiling:**

| Tool | Language/Platform | Capture Method | Overhead |
|---|---|---|---|
| perf / Linux perf_events | Any (native) | Hardware counters, sampling | <2% |
| async-profiler | JVM (Java, Kotlin, Scala) | AsyncGetCallTrace + perf | <2% |
| DTrace / bpftrace | Any (native) | Dynamic tracing | <1% |
| pprof | Go | Sampling at configurable rate | <5% |
| rbspy | Ruby | Sampling | <5% |
| py-spy | Python | Sampling, no code changes | <5% |
| VTune | Intel CPUs | Hardware event-based sampling | <5% |
| Instruments | Apple/macOS | Sampling, DTrace | <5% |
| perf report | Any (post-processing) | Aggregate sampled stacks | N/A |

**CPU profiling workflow:**

```
1. Capture profile during the performance problem (not idle)
    perf record -F 99 -a -g -- sleep 30
    # or
    async-profiler -d 30 -o flamegraph -f profile.svg <pid>

2. Generate flame graph
    perf script | stackcollapse-perf.pl | flamegraph.pl > cpu.svg

3. Identify the widest towers (hot methods)
    Look for: tight loops, string operations, serialization, locks

4. Examine source code for each hot method
    Question: "Why is this method consuming X% of CPU?"

5. Form hypothesis about the improvement
    Example: "Cache the result of getUserPermissions() — called 5000x/s"

6. Apply fix, re-profile, compare flame graphs
```

**CPU profiling frequency selection:**

| Frequency | Resolution | Overhead | Use Case |
|---|---|---|---|
| 49 Hz | Low | <0.5% | Continuous profiling in production |
| 99 Hz | Medium | <1% | Standard profiling |
| 997 Hz | High | <3% | Short-duration debugging |
| 9973 Hz | Very high | <10% | Kernel-level investigation |

**Profiling in production (safe methods):**

| Method | Safety | Use Case |
|---|---|---|
| AsyncGetCallTrace (async-profiler) | Safe (signal-based, no safepoint bias) | JVM production profiling |
| eBPF-based (bpftrace, BCC) | Safe (kernel-verified) | Linux kernel profiling |
| Continuous profiling with 1% sample | Safe (low overhead) | Always-on CPU profiling |
| Heap dump with OOM | Safe (triggered on OOM) | Memory leak investigation |
| Flight Recorder (JFR) | Safe (low overhead, always-on) | JDK 11+ continuous monitoring |

**Dangerous profiling methods (avoid in production):**

| Method | Risk | Alternative |
|---|---|---|
| `kill -3` (SIGQUIT) thread dump | Blocked threads pause | async-profiler |
| Stack sampling with SIGSTOP | Service disruption | Signal-based sampling |
| Full GC before heap dump | GC pause | Use OOM heap dumps |
| Debugger attach (JPDA) | Service block on breakpoint | Use logging or tracing |

**Memory Profiling:**

| Tool | What It Captures | Overhead |
|---|---|---|
| Heap dump analyzer (Eclipse MAT, jhat) | All objects, references, GC roots | High (snapshot) |
| JProfiler / YourKit | Live allocation, object count | Medium (sampling) |
| async-profiler (alloc) | Allocation stack traces | Low (sampling) |
| pprof (Go) | Heap allocation, in-use objects | Low (sampling) |
| Valgrind / Massif | Heap and stack memory | High (full instrumentation) |
| heaptrack (Linux) | Allocation traces, temporal | Medium |
| jemalloc heap profiling | C/C++ native allocations | Low (sampling) |
| Windows ETW | Native and managed allocations | Medium |

**Memory profiling workflow:**

```
1. Establish memory baseline
    - Current heap size
    - Object count by type
    - GC frequency and pause time

2. Identify the problem
    - Is heap growing over time? → Memory leak
    - Is GC frequency too high? → Object churn
    - Is heap too large? → Cache or data structure issue

3. Memory leak investigation:
    a. Take heap dump #1
    b. Let application run for 5 minutes
    c. Take heap dump #2
    d. Compare: which objects grew?
    e. Trace retention path: "Who holds a reference to this?"
    f. Fix: clear reference, use WeakReference, or reduce scope

4. Object churn investigation:
    a. Profile allocation rate by method
    b. Identify top allocation sites
    c. Fix: object pooling, primitive collections, lazy allocation
```

**GC analysis metrics:**

| Metric | What It Means | Action Threshold |
|---|---|---|
| Young GC frequency | Allocation rate | > 10/sec | 
| Young GC pause | Time per minor collection | > 100ms |
| Full GC frequency | Old gen filling up | > 1/hour |
| Full GC pause | Time per major collection | > 1s |
| Promotion rate | Objects moving to old gen | Increasing → potential leak |
| Heap after GC | Live data size | Growing → memory leak |
| Allocation rate | Bytes allocated per second | > 1GB/s → churn problem |

**I/O Profiling:**

| Tool | What It Measures | Key Output |
|---|---|---|
| iostat | Per-device IOPS, throughput, wait time | %iowait, await, svctm |
| iotop | Per-process IO | Read/write bytes per process |
| strace / dtrace | System call tracing | read()/write() count and duration |
| lsof | Open file descriptors | Count, types, processes |
| File system profiling (xfs_io, blktrace) | Block-level IO | Queue depth, latency distribution |
| Windows PerfMon / Process Monitor | File I/O operations | Operation count, bytes, duration |

**I/O profiling workflow:**

```
1. Check system-level IO:
    iostat -x 1
    Look for: %iowait > 20%, await > 10ms, queue depth > 1

2. Identify the process:
    iotop -oP

3. Identify the files and operations:
    strace -c -p <pid>        # syscall count
    strace -e trace=read,write -p <pid>  # IO operations
    
4. Analyze IO patterns:
    - Random IO (high iops, low throughput) → indexing, database
    - Sequential IO (high throughput, low iops) → logging, streaming
    - Metadata operations (stat, open, close) → file system overhead
```

**Network Profiling:**

| Tool | What It Measures | Key Output |
|---|---|---|
| tcpdump / Wireshark | Full packet capture | Packet content, timing, retransmits |
| netstat / ss | Connection state | Connection count, state, queue depth |
| nstat / ethtool | Network interface stats | Packet drops, errors, collisions |
| iperf3 | Throughput measurement | Bandwidth, jitter, loss |
| curl -w | HTTP timing | DNS, TCP, TLS, TTFB, transfer speed |
| Chrome DevTools | Web request timing | Resource waterfall, blocking, downloading |
| HTTP archive (HAR) | Full HTTP trace | Every request's timing, headers, size |

**Network profiling workflow:**

```
1. Check interface level:
    netstat -s           # protocol statistics
    ethtool -S eth0      # driver-level counters
    
2. Check connection level:
    ss -s                # summary by state
    ss -tlnp             # listening sockets
    netstat -an | wc -l  # total connection count
    
3. Check application level:
    tcpdump -i eth0 -s 0 -w capture.pcap
    # Analyze in Wireshark for:
    #   - Retransmit rate (>0.1% is bad)
    #   - Round trip time (high = network latency)
    #   - Window scaling (small window = bottleneck)
    #   - TCP handshake timing (high = connection overhead)
```

### P7.3 — Performance Pattern Selection Guide

| Symptom | Most Likely Pattern | Initial Action |
|---|---|---|
| High latency, low throughput, low CPU | IO bottleneck | Check disk IOPS, network bandwidth, queue depth |
| High latency, low throughput, high CPU | CPU bottleneck | Profile hot methods, check for busy-waiting |
| Latency grows with concurrency | Contention bottleneck | Thread dump, check locks and connection pools |
| Latency spikes periodically | Thundering herd or GC | Correlate with cache TTL, check GC logs |
| Throughput flatlines at a limit | Queue saturation | Check backpressure, max connections, thread pool |
| Memory grows over time | Memory leak | Heap dump, check object retention |
| One slow request blocks others | Head-of-line blocking | Separate fast/slow paths, use independent thread pools |
| First request is slow, others fast | Cold start / cache warming | Implement connection pooling, pre-warming |
| Degradation after deploy | Code regression | Profile the new code path, compare with previous |
| Degradation over months | Data growth / fragmentation | Check query performance growth, index fragmentation |

### P7.4 — Performance Optimization Decision Tree

```
Is the system meeting performance targets?
  YES → Stop. Do not optimize.
  NO  → Is there a measurable baseline?
          NO  → Measure first. Without baseline, "improvement" is guesswork.
          YES → Is the bottleneck identified?
                  NO  → Profile. Find the hottest part of the critical path.
                  YES → Is there a known fix for this bottleneck?
                          YES → Apply fix, measure, confirm improvement.
                          NO  → Research fix. Check: caching, algorithm change,
                                resource scaling, architecture change.
                                  → Fix not found? Accept the constraint.
                                  → Fix found? Apply, measure, confirm.

After fix: Is the bottleneck resolved (shifted elsewhere or target met)?
  YES → Document. Update performance budget.
  NO  → Identify next bottleneck. Loop.
```

### P7.5 — Capacity Planning Heuristics

| Resource | Planning Rule | Warning Sign |
|---|---|---|
| CPU | Keep average < 80%, peak < 90% | Run queue > 2× cores |
| Memory | Keep heap usage < 70% of max | GC frequency > 1/min |
| Disk | Keep IOPS usage < 70% of provisioned | Queue depth > 1 |
| Network | Keep bandwidth < 60% of link capacity | Retransmit rate > 0.1% |
| Database | Keep connections < 80% of max | Connection wait time > 10ms |
| Cache | Keep hit rate > 80% | Eviction rate > 1% of total |

### P7.6 — Throughput Optimization Patterns

**Pattern: Concurrency Scaling**

| Problem | Solution | When to Use |
|---|---|---|
| Single-threaded bottleneck | Add threads/goroutines | Workload is parallelizable |
| Too many threads (oversubscription) | Thread pool with bounded size | CPU-bound workload |
| Too few threads (undersubscription) | Increase thread pool | I/O-bound workload |
| Thread contention | Reduce lock granularity | Shared state access |

**Thread pool sizing formulas:**

```
CPU-bound threads = Number of cores + 1

I/O-bound threads = Number of cores × (1 + Wait time / Service time)

Example: 8 cores, 100ms I/O wait, 10ms CPU
  I/O threads = 8 × (1 + 100/10) = 8 × 11 = 88 threads
```

**Pattern: Connection Pooling**

| Parameter | Effect of Increasing | Effect of Decreasing |
|---|---|---|
| Pool max size | Higher throughput ceiling, more DB connections | Less resource usage, queueing under load |
| Pool min size | Faster startup, pre-warmed connections | Slower first requests |
| Connection timeout | More tolerance for slow connections | Faster failure detection |
| Idle timeout | More frequent reconnects | Stale connections linger |
| Max lifetime | Prevents connection leak accumulation | More frequent reconnects |

**Connection pool sizing (from Little's law):**

```
Pool size = Max throughput × Connection hold time

Example: Need 2000 req/s, each holds connection for 50ms
  Pool size = 2000 × 0.05 = 100 connections

Validation: 100 connections at 50ms hold = 100 / 0.05 = 2000 req/s max
```

**Pattern: Request Batching**

| Batch Style | Mechanism | Latency Impact | Throughput Impact |
|---|---|---|---|
| Size-based | Collect N items, then process | Adds up to batch wait | N× throughput |
| Time-based | Process every T ms | Adds T ms max latency | Smooth, predictable |
| Size + time (hybrid) | Process when N items OR T ms elapses | Min(T, batch time) | Best of both |
| Adaptive | Adjust batch size based on load | Controlled | Optimal |

**Batching rules:**
- Batch size should be tuned, not arbitrary. Start with 10-100 and measure.
- Time-based batching caps latency increase at T. Set T to <10% of latency budget.
- For databases, batch writes to reduce round trips. 10 writes in one trip is 10x faster than 10 trips.
- For message queues, batch publishes to increase producer throughput.

**Pattern: Parallelism**

| Parallelism Type | Use Case | Benefit | Risk |
|---|---|---|---|
| Task parallelism | Independent operations | Reduced wall-clock time | Thread overhead |
| Data parallelism | Same operation on many items | Throughput proportional to threads | Shared state |
| Pipeline parallelism | Sequential stages with buffers | Each stage runs concurrently | Pipeline bubble |
| Map-reduce | Partitioned computation | Scales horizontally | Data shuffle cost |

**Parallelism decision tree:**

```
Are the operations independent (no shared state)?
  YES → Parallelize with bounded thread pool
  NO  → Can state be partitioned?
          YES → Partitioned parallelism (shard by key)
          NO  → Can state access be optimized (read-only, atomic)?
                  YES → Use lock-free structures, parallelize
                  NO  → Single-threaded is safer. Optimize the serial path.
```

**Pattern: Compression**

| Data Type | Algorithm | Compression Ratio | Speed | Use Case |
|---|---|---|---|---|
| Text/JSON | gzip | 3-5x | Fast | API responses, static assets |
| Binary | zstd | 2-4x | Very fast | Database, binary protocols |
| Images | WebP | 30% smaller than JPEG | Medium | Web images |
| Video | H.264/H.265 | 50-200x | Hardware-dependent | Video streaming |
| Logs | zstd | 5-10x | Very fast | Log shipping |
| Strings | LZ4 | 2-3x | Extremely fast | In-memory compression |

**Compression trade-off:**
- Compression saves network bandwidth and storage at the cost of CPU.
- At low bandwidth (< 10 Mbps), always compress.
- At high bandwidth (> 1 Gbps), compression may not be worth it for ephemeral data.
- Use fast compression (LZ4, zstd) over high-compression (gzip -9, xz) for real-time systems.


## P9 — NETWORK PERFORMANCE

### P9.1 — Content Delivery Network (CDN)

**When to use a CDN:**

```
Static assets (images, CSS, JS, fonts): ALWAYS use CDN
API responses: If cacheable and globally distributed users
Streaming video/audio: Mandatory
Downloads (binaries, PDFs): Recommended for large files
```

**CDN cache behavior:**

| Header | Effect | Recommendation |
|---|---|---|
| Cache-Control: max-age=3600 | Cache for 1 hour | Static assets: 1 year | 
| Cache-Control: no-cache | Revalidate with origin | API responses with ETag |
| Cache-Control: private | Don't cache in shared CDN | User-specific data |
| Cache-Control: s-maxage=60 | CDN caches for 60s, browser doesn't | API responses |
| ETag | Validate cache freshness | Dynamic content |
| Last-Modified | Validate by timestamp | Static assets |

**CDN caching strategy:**

```
Content type → Cache duration → Invalidation strategy
─────────────────────────────────────────────────────
Static JS/CSS      1 year       Versioned URLs (cache-bust)
Images            30 days       File hash in URL
API responses      60 seconds   Sub-second purge API
HTML pages         5 minutes    Instant purge on publish
User data          Never         Private, no-cache
```

### P9.2 — Protocol Optimization

**HTTP/1.1 limitations:**

| Limitation | Problem | Solution |
|---|---|---|
| Head-of-line blocking | One slow request blocks queue | HTTP/2 multiplexing, multiple connections |
| No multiplexing | 6 connections per domain limit | HTTP/2, HTTP/3 |
| Verbose headers | ~800 bytes per request per header | HPACK compression (HTTP/2), QPACK (HTTP/3) |
| No server push | Client discovers resources late | HTTP/2 server push (rare), preload hints |

**HTTP/2 benefits:**

```
Single connection → Multiplexed streams
Header compression (HPACK) → 90% header size reduction
Server push → Proactive resource delivery
Stream priority → Critical resources first

Measured improvement:
  - 1 HTTP/2 connection vs 6 HTTP/1.1 connections
  - 15-50% faster page loads
  - Reduced TLS handshake overhead (1 vs 6)
```

**HTTP/3 (QUIC) benefits:**

```
- 0-RTT handshake (no round trips for repeat connections)
- Connection migration (survives network changes)
- Built-in encryption (no separate TLS layer)
- No head-of-line blocking at transport layer
- Faster than TCP in packet loss scenarios

Measured improvement:
  - Handshake: 1 RTT vs 3 RTT (HTTP/2 over TCP/TLS)
  - 10-30% faster on lossy connections (mobile)
  - 0-RTT for repeat visitors
```

**Protocol selection guide:**

| Scenario | Best Protocol |
|---|---|
| All clients support HTTP/2 | HTTP/2 |
| Mobile users, lossy networks | HTTP/3 (QUIC) |
| Legacy clients, enterprise | HTTP/1.1 (fallback) |
| Internal microservices | HTTP/2 (gRPC) |
| Real-time, streaming | HTTP/3 or WebSocket |
| IoT, constrained devices | MQTT or CoAP |

### P9.3 — Compression

**HTTP compression:**

| Content Type | Compression | Typical Ratio |
|---|---|---|
| JSON API responses | gzip (level 3-6) | 5-10x |
| HTML | brotli (quality 4-6) | 4-8x |
| CSS | brotli | 5-10x |
| JavaScript | brotli | 4-8x |
| Already compressed (JPEG, PNG, MP4) | None | 1x (no benefit) |

**Compression configuration:**

| Parameter | Recommendation | Rationale |
|---|---|---|
| Static assets | Pre-compressed with brotli (level 11) | One-time CPU, maximum compression |
| Dynamic API | gzip (level 3) or brotli (level 4) | Low CPU, good compression |
| Server-sent events | No compression | Streaming, not batch |
| WebSocket | Per-message deflate | If payloads > 1KB |

**gzip level trade-off:**

```
Level 1: Fastest compression, lowest ratio
Level 6: Good balance (default)
Level 9: Best ratio, 3x CPU of level 6

Rule: For dynamic content, use level 3-4. For static pre-compressed, use max.
```

### P9.4 — TLS/SSL Performance

**TLS handshake cost:**

```
TCP → TLS 1.3 → Application data
  RTTs: 2 (1 for TCP + 1 for TLS 1.3)
  TLS 1.2: 3 RTTs (1 TCP + 2 TLS)

At 100ms RTT:
  TLS 1.3 handshake: +100ms
  TLS 1.2 handshake: +200ms

With connection reuse (session resumption):
  TLS 1.3 0-RTT: 0 additional RTTs (data sent with first packet)
```

**TLS optimization:**

| Technique | Benefit | Implementation |
|---|---|---|
| TLS 1.3 | 1 fewer RTT vs 1.2 | Server + client support required |
| Session resumption | 0-RTT for repeat connections | Session tickets, session IDs |
| OCSP stapling | No client-side certificate revocation check | Server fetches OCSP response |
| False Start | Send data before handshake completes | TLS 1.2+ with supported ciphers |
| Connection reuse | Avoid handshake entirely | HTTP keep-alive, connection pooling |
| Certificate chain optimization | Smaller handshake | Remove intermediate CAs from chain |

**TLS cipher selection:**

| Cipher | Security | Performance | Recommendation |
|---|---|---|---|
| TLS_AES_128_GCM_SHA256 | Strong | Fast (AES-NI) | Preferred (TLS 1.3 default) |
| TLS_AES_256_GCM_SHA384 | Strong | Slightly slower | Overkill for most |
| TLS_CHACHA20_POLY1305 | Strong | Fast (mobile, no AES-NI) | Good for mobile |
| ECDHE_RSA_WITH_AES_128_GCM | Strong | Medium | TLS 1.2 fallback |

### P9.5 — TCP Performance

**TCP optimization parameters:**

| Parameter | Effect | Recommendation |
|---|---|---|
| TCP window size | Maximum data in flight | Auto-tuned, or set to BDP |
| Initial congestion window (IW) | Startup throughput | IW10 (10 segments) |
| Nagle's algorithm | Batch small packets | Disable for latency-sensitive apps |
| TCP Fast Open | Data in SYN packet | Enable (TFO) |
| Selective ACK (SACK) | Better loss recovery | Enable |
| Keep-alive interval | Connection health check | 30-60 seconds |

**Bandwidth-Delay Product (BDP):**

```
BDP = Bandwidth × RTT

Example: 1 Gbps link, 50ms RTT
  BDP = 1,000,000,000 bps × 0.05s = 50,000,000 bits = ~6 MB

TCP window must be at least 6 MB to saturate the link.
Default window on many systems: 64 KB → only 1% utilization.
```

**TCP optimization checklist:**

- [ ] TCP window scaling enabled (RFC 1323)
- [ ] Initial congestion window >= 10 segments
- [ ] TCP Fast Open enabled
- [ ] Nagle disabled for latency-sensitive apps
- [ ] SACK enabled
- [ ] Keep-alive with reasonable intervals
- [ ] No unnecessary firewalls or proxies


## P11 — ASYNC PROCESSING AND BACKGROUND JOBS

### P11.1 — Async vs Sync Decision

```
Request arrives → Is response time < budget?
  YES → Handle synchronously. Simple, predictable.
  NO  → Can the work be deferred?
          YES → Offload to async processing.
          NO  → Optimize sync path or accept the latency.

When to use async:
  - Email sending, notification delivery
  - Report generation, exports
  - Image/video processing
  - Batch data sync with external systems
  - Webhook delivery with retry
  - Any operation that exceeds the latency budget
```

### P11.2 — Job Queue Architecture

**Queue model:**

```
Producer → Queue → Consumer(s)
                   Wait for work
                   Process → Success → Done
                   Process → Retry → Re-queue
                   Process → Dead letter → Alert
```

**Queue characteristics:**

| Parameter | Effect | Recommendation |
|---|---|---|
| Queue depth limit | Backpressure, memory bound | Set to 10x peak expected depth |
| Retry count | Recovery from transient failures | 3-5 retries |
| Retry backoff | Don't retry immediately | Exponential (1s, 4s, 15s, 60s, 300s) |
| Max processing time | Detect stuck jobs | 2x expected max processing time |
| Dead letter queue | Capture permanently failed jobs | Yes, always |
| Queue visibility timeout | Prevent duplicate processing | 3x expected processing time |
| Concurrency per consumer | Parallel processing limit | CPU-bound: cores + 1, IO-bound: higher |

**Job failure handling:**

```
Job fails → Retry (exponential backoff)
  3 retries → Dead letter queue
  Dead letter → Alert + manual investigation

Causes of permanent failure:
  - Invalid input data (will always fail)
  - Missing dependencies (service down permanently)
  - Corrupted state (needs manual fix)

Transient failures (should retry):
  - Database deadlock (retry succeeds)
  - Network timeout (retry succeeds)
  - Rate limit (backoff and retry)
  - Service temporarily unavailable
```

### P11.3 — Consumer Concurrency

**Consumer scaling:**

```
Throughput per consumer = 1 / Average processing time

Total throughput = Concurrency × Throughput per consumer

Example: Job takes 500ms to process
  Throughput per consumer = 2 jobs/sec
  With 10 concurrent consumers = 20 jobs/sec
  Need 100 jobs/sec → 50 consumers
```

**Consumer pooling:**

| Strategy | How It Works | Use Case |
|---|---|---|
| Fixed pool | N consumers always running | Predictable load |
| Dynamic pool | Scale consumers based on queue depth | Variable load |
| Sharded consumers | Each consumer responsible for a partition | Ordered processing |
| Single consumer | One at a time, in order | Strict ordering required |

**Backpressure in async systems:**

```
Producer → Queue → Consumer

When queue grows beyond threshold:
  1. Slow down producer (flow control)
  2. Scale up consumers (if possible)
  3. Reject new requests (circuit breaker)
  4. Drop old requests (timeout-based eviction)
```

**Queue depth alerting:**

```
Alert if:
  - Queue depth > 10,000 (or 10x normal)
  - Oldest job age > 5 minutes
  - Dead letter queue has any items
  - Consumer count = 0 (no workers running)

Investigation:
  - Are consumers alive? (process check)
  - Are consumers processing? (throughput check)
  - Is the queue filling faster than consumers drain?
  - Is the downstream service accepting work?
```

### P11.4 — Batch Processing

**Batch vs stream:**

| Characteristic | Batch (Cron) | Stream (Queue) |
|---|---|---|
| Latency | Minutes to hours | Milliseconds to seconds |
| Throughput per worker | Very high | Moderate |
| Operational complexity | Low (cron job) | Medium (queue management) |
| Error handling | Retry entire batch | Retry individual items |
| Ordering | Not guaranteed | Per-partition ordering |

**Batch processing patterns:**

| Pattern | Description | Use Case |
|---|---|---|
| Chunked processing | Process in fixed-size batches | ETL, data migration |
| Sliding window | Process overlapping time windows | Real-time analytics |
| Micro-batch | Small batches (seconds of data) | Near-real-time stream processing |
| Bulkhead batch | Partition batch by shard | Large datasets, parallel processing |

**Batch size optimization:**

```
Batch processing time = Setup overhead + N × Per-item time + Commit overhead

Optimal batch size = √(2 × Setup overhead × Throughput / Per-item time)

Rule: 10-1000 items per batch is a good starting point.
Measure throughput vs batch size curve to find the sweet spot.
```

### P11.5 — Idempotency for Async Jobs

**Why idempotency matters:**

```
Job queue guarantees are often "at least once."
A job may be processed >1 time (crash, timeout, retry).
If processing is not idempotent, duplicate side effects occur:

  - Charge user twice
  - Send duplicate email
  - Insert duplicate row
  - Process same transaction twice
```

**Idempotency strategies:**

| Strategy | Mechanism | Example |
|---|---|---|
| Idempotency key | Generate unique key per request | `POST /payments` with `Idempotency-Key` header |
| Dedup table | Record processed job IDs in DB | `INSERT ... ON CONFLICT DO NOTHING` |
| Optimistic locking | Version check before update | `UPDATE ... WHERE version = X` |
| State machine | Process only if state allows | "Pending" → "Processing" → "Completed" |
| Conditional update | Only apply if not already applied | `UPDATE ... WHERE status = 'pending'` |


## P13 — OBSERVABILITY FOR PERFORMANCE

### P13.1 — The Three Pillars

| Pillar | What | How | Signal |
|---|---|---|---|
| Metrics | Numeric aggregation over time | Counters, gauges, histograms | "What is happening?" |
| Traces | Request flow across services | Spans with timing | "Where is it happening?" |
| Logs | Event records | Structured text entries | "Why is it happening?" |

**Metrics-first, traces for investigation, logs for debugging.**

### P13.2 — What to Measure

**RED metrics (microservices):** Rate (req/s by endpoint), Errors (rate by endpoint/code), Duration (p50/p95/p99/p99.9 by endpoint).

**USE metrics (resources):** Utilization (% busy), Saturation (queue depth), Errors (count/rate) for CPU, memory, disk, network.

**Four golden signals (Google SRE):** Latency (histogram), Traffic (req/s, active users), Errors (rate), Saturation (queue depth, utilization).

**Application-level metrics:** HTTP (rate, latency, errors, size), Database (query latency, count, connections, locks), Cache (hit/miss/eviction rate, memory), Queue (depth, processing time, age, retries), External calls (latency, error rate, timeouts), JVM/GC (GC freq, pause time, heap, allocation rate), Business (conversion rate, order completion).

### P13.3 — Distributed Tracing

**Mandatory fields:** trace_id, span_id, parent_span_id, service, operation, start_time, duration, status, tags (endpoint, method, status_code, user_id, error_detail).

**Span categories:** HTTP server, HTTP client, Database query, Cache operation, Queue produce/consume, Function.

**Granularity rule:** One span per service boundary, database call, and external dependency. 10-30 spans per request. Too coarse (entire request) hides location. Too fine (every method) adds noise and overhead.

### P13.4 — Service Level Indicators (SLIs)

| SLI | Measurement | Target |
|---|---|---|
| Latency p50/p95/p99/p99.9 | Histogram | Per-budget |
| Throughput | Counter | > peak demand |
| Error rate | Counter | < 0.1% |

**SLO tiers:** Critical (99.99%, <100ms p99), Standard (99.9%, <500ms), Best effort (99%, <2s), Batch (N/A, <1 hour).

### P13.5 — Performance Alerting

**Strategies:** Static threshold (simple, doesn't adapt), Dynamic baseline (adapts to traffic), Rate of change (detects sudden shifts), Budget-based (SLO-aligned, complex), Anomaly detection (finds unknowns, false positives).

**Severity:** p99 exceeds SLO <2x = Warning (24h), 2-5x = Critical (1h), >5x = Incident (page). Error rate >1% = Warning, >5% = Critical, >10% = Incident.

### P13.6 — Performance Regression Detection

**CI/CD detection:** Baseline current perf → Run against candidate → Compare distributions. If p99 degraded >10% flag, >20% block. Use Mann-Whitney U test for statistical significance (p < 0.05 = regression).

**False positive reduction:** Multiple runs (3+, median), minimum 1000 samples, discard warmup period, filter GC outliers, compare against 7-day rolling average, A/A testing to establish noise floor.


## P15 — COST-PERFORMANCE TRADE-OFFS

### P15.1 — The Cost-Performance Curve

```
Performance (latency, throughput)
        │
        │              ●———● (diminishing returns)
        │         ●———●
        │    ●———●
        ●———●
        │
        └────────────────────── Cost ($)

Zone 1: Low cost, large gains (low-hanging fruit)
  - Missing indexes
  - N+1 queries
  - Insufficient caching
  - Connection pool tuning

Zone 2: Medium cost, medium gains
  - Read replicas
  - CDN integration
  - Load balancing
  - Horizontal scaling

Zone 3: High cost, small gains
  - Custom hardware
  - Rewriting in faster language
  - Microservices decomposition
  - Global anycast networking
```

**Cost-performance optimization order:**

```
1. Free optimizations (developer time only)
   - Fix N+1 queries, missing indexes, wrong cache strategy
   - Tune connection pool sizes, thread pool sizes
   - Add missing TTL jitter, fix inefficient queries
   - Compress responses, add client-side caching

2. Low-cost infrastructure changes
   - Add CDN (pay per GB)
   - Increase cache sizes, add Redis
   - Upgrade to SSD/PCIe storage
   - Enable HTTP/2, connection pooling
   - Increase autoscaling limits

3. Medium-cost changes
   - Add read replicas
   - Horizontal scaling (more instances)
   - Load balancer upgrades
   - Database vertical scaling
   - Implement circuit breakers, bulkheads

4. High-cost changes
   - Rewrite critical services
   - Geographic replication (multi-region)
   - Custom hardware / dedicated instances
   - Database sharding
   - Custom protocol implementation
```

### P15.2 — When to Stop Optimizing

**The "good enough" criteria:**
1. p99 latency is within budget
2. Throughput meets peak demand + 30% buffer
3. No resource consistently exceeds 80% utilization
4. Error rate is below target
5. Degradation behavior is graceful (no cascading failures)

If all five are true: STOP. Further optimization has negative ROI.

**Optimization ROI checklist:** If users won't notice, stop. If business metrics won't improve, stop. If engineering cost exceeds benefit, stop. If risk or complexity outweighs gain, stop.

### P15.3 — Right-Sizing

**Right-sizing signals:** CPU avg < 40% → downsize, > 80% → upsize. Memory < 50% → reduce, > 80% → increase. Disk IOPS < 40% → downgrade, > 80% → upgrade. Network bandwidth < 30% → downgrade, > 60% → upgrade.

### P15.4 — Cost-Efficient Caching

**Cache cost-benefit:** Benefit = (Hit rate × Read volume × DB query cost) - Cache cost. Example: 10M reads/day × $0.001/query at 90% hit rate saves $9K - $500 cache cost = $8.5K/month. Don't cache when cache cost exceeds DB query savings.

**Cache eviction cost trade-off:** LRU (medium memory, low CPU) for general. LFU (high memory, medium CPU) for skewed access. ARC (high memory, high CPU) for mixed workloads. TTL-only (dependent on TTL, very low CPU) for time-bounded data.

### P15.5 — Scaling Cost Analysis

**Vertical vs horizontal:** Vertical scales linearly with cost but hits hardware limits. Horizontal scales near-linearly but adds complexity (load balancers, distributed state, coordination). Example: 10 m5.large ($700) = 20 vCPU/80GB vs 1 m5.4xlarge ($560) = 16 vCPU/64GB. Horizontal is often cheaper per unit capacity.

**When horizontal is required:** When single-instance throughput cannot meet demand. Example: need 10,000 req/s, single m5.xlarge handles 1,000 req/s, max m5.16xlarge handles ~8,000 — must go horizontal.

### P15.6 — Cloud Cost-Performance Decisions

| Decision | High Performance | Low Cost | Trade-off |
|---|---|---|---|
| Instance type | Compute-optimized (C5) | General purpose (M5) | C5: 2x CPU perf, 20% more cost |
| SSD vs HDD | Provisioned IOPS (io2) | Throughput optimized (st1) | io2: 10x IOPS, 3x cost |
| Reserved vs On-demand | On-demand (elastic) | Reserved (1yr, 60% off) | Reserved: no flexibility |
| Multi-AZ vs Single-AZ | Multi-AZ (HA) | Single-AZ | 2x cost for auto-failover |
| Spot vs On-demand | On-demand (reliable) | Spot (up to 90% off) | Spot: interruptible |

**Cost optimization levers:** Rightsize instances (20-40% savings, no perf impact), Spot for batch (60-90%, weaker reliability), Reserved instances (40-60%, no perf impact), Compress data (30-70% storage, slight CPU increase), Archive old data (50-90% storage cost).

### P15.7 — Performance Tiers by Cost

| Tier | Latency Target | Cost Factor | Use Case |
|---|---|---|---|
| Premium | p99 < 100ms | 5-10x baseline | Payments, critical APIs |
| Standard | p99 < 500ms | 1x (baseline) | Primary web app |
| Economy | p99 < 2s | 0.3-0.5x baseline | Analytics, reports |
| Best-effort | No guarantee | 0.1-0.2x baseline | Background jobs, ETL |

---

*Synarc session tracking (S3), auto-emit rules (S4), zero-tolerance violations (S17) apply. Ledger entry for every performance analysis engagement.*
