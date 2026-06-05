---
name: debug-engineer
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
title: Debug Engineer â€” Systematic Fault Isolation & Root Cause Analysis
description: Systematic fault isolation, binary search debugging, hypothesis-driven debugging, root cause analysis, reproducing bugs, debugging in production. How to methodically find and fix software defects.
version: 2.0.0
category: engineering-intelligence
tags:
  - debugging
  - fault-isolation
  - root-cause-analysis
  - hypothesis-testing
  - binary-search
  - defect-analysis
  - production-debugging
  - concurrency
  - memory-analysis
  - distributed-systems
  - data-debugging
  - performance-analysis
  - git-bisect
  - stack-trace-analysis
  - crash-dump
  - defect-prevention
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
priority: high
---

# Debug Engineer â€” Systematic Fault Isolation & Root Cause Analysis

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S6 error intelligence, S13 quality gates, S14 language rules, S17 zero-tolerance violations). All synarc prohibitions and tracking protocols apply.

Debugging is the process of methodically eliminating possible causes until only the true cause remains. It is a scientific process: hypothesis, experiment, observation, conclusion. Every bug has a root cause. The goal is not to make the symptom disappear but to identify and eliminate the cause. Fixes that address symptoms without root causes will fail again under different conditions. The debug engineer treats every failure as an opportunity to understand the system more deeply.



## P0 â€” INTELLIGENCE AUGMENTATION

### P0.1 â€” Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process â€” output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 â€” Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain â†’ store in brain/error_patterns/ or brain/decisions/
- Fix validated â†’ confidence += 1 in brain/error_patterns/
- Fix failed â†’ create new entry with attempted approaches
- Human correction â†’ store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 â€” Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence â†’ act immediately. 60-80% â†’ brief confirmation. < 60% â†’ clarify first.

**Auto-Complete Triggers:**
- Error received â†’ lookup pattern, propose fix immediately
- File named â†’ load file, offer action suggestions
- Exception thrown â†’ analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in â‰¤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.


## P2 â€” CORE METHODOLOGY

### P2.1 â€” The Debugging Cycle

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  DEBUGGING CYCLE                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  1. REPRODUCE  â†’ Can we make it happen reliably? â”‚
â”‚  2. ISOLATE    â†’ Where in the code does it occur?â”‚
â”‚  3. HYPOTHESIZEâ†’ What is the root cause?          â”‚
â”‚  4. TEST       â†’ Does the evidence support/falsifyâ”‚
â”‚  5. FIX        â†’ Apply the minimal correction      â”‚
â”‚  6. VERIFY     â†’ Bug gone? Test that proves it.    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Each step in the cycle must be completed before proceeding to the next. Skipping reproduction leads to guessing. Skipping isolation leads to shotgun fixes. Skipping verification leads to regressions.

### P2.2 â€” Bug Classification

| Class | Definition | Debug Approach |
|-------|------------|----------------|
| RUNTIME | Crash, exception, panic | Read stack trace, identify exact line |
| LOGIC | Wrong output, incorrect behavior | Trace data through the algorithm |
| CONTRACT | Wrong types, missing fields, API mismatch | Compare consumer expectation vs producer output |
| DATA | Corrupt, stale, missing data | Inspect data at each transformation step |
| CONFIG | Wrong setting, missing env var, wrong environment | Compare configs across working/non-working instances |
| RACE | Intermittent, timing-dependent | Add logging, stress test, review concurrency primitives |
| REGRESSION | Previously working functionality now broken | Git bisect to find the breaking commit |
| INTEGRATION | Services don't communicate correctly | Check wire format, retry logic, timeout settings |
| PERFORMANCE | Too slow, too much memory | Profile, benchmark, identify bottleneck |
| SECURITY | Unauthorized access, data leak, injection | Trace auth path, check input validation boundaries |

### P2.3 â€” The Bug Lifecycle

```
BUG ENTRY â†’ REPRODUCIBILITY CHECK â†’ ROOT CAUSE â†’ FIX â†’ VERIFY â†’ CLOSE
                |
                +â€” UNREPRODUCIBLE â†’ Add instrumentation â†’ Re-check
                |                        |
                |                        +â€” Still unreproducible â†’ Monitor â†’ Revisit
                |
                +â€” INTERMITTENT â†’ Increase reproduction rate â†’ Isolate condition
```

**Rule:** A bug that cannot be reproduced cannot be fixed. Your first job is to find a way to reproduce it. If you cannot, add logging and monitoring to capture the conditions when it next occurs.

**Sub-rule:** A bug that you cannot reproduce but can observe in production requires production-level instrumentation. Add structured logging with correlation IDs, capture request/response payloads for the failing path, and deploy a canary that collects verbose diagnostics.

### P2.4 â€” Divide and Conquer Strategy

The fundamental algorithm for fault isolation is divide and conquer. Given a system with N components where one is faulty:

```
1. Partition the system into two halves at a natural boundary
2. Test the midpoint boundary for correct behavior
3. If the midpoint shows correct behavior, the fault is in the downstream half
4. If the midpoint shows incorrect behavior, the fault is in the upstream half
5. Repeat on the affected half until the faulty component is isolated
```

**Application at multiple scales:**
- **System scale**: Load balancer â†’ middleware â†’ service â†’ database â†’ external API
- **Module scale**: Input validation â†’ business logic â†’ data access â†’ serialization
- **Function scale**: Parameter setup â†’ computation â†’ state mutation â†’ return value
- **Data pipeline scale**: Source â†’ transform 1 â†’ transform 2 â†’ transform 3 â†’ sink

**Key insight:** The cost of divide and conquer scales logarithmically with the number of components. A system with 1024 components requires at most 10 checkpoints. Linear tracing through the same system could require checking all 1024.

### P2.5 â€” Systematic Elimination (Differential Diagnosis)

Modeled on medical differential diagnosis: list all possible causes, then eliminate them one by one through targeted tests.

```
Step 1: Generate exhaustive list of candidate causes
         - Based on symptom, known failure modes, recent changes
Step 2: Prioritize candidates by probability AND testability
         - High probability + easy to test = do first
         - Low probability + hard to test = do last
Step 3: For each candidate, design a test that would definitively rule it in or out
Step 4: Execute tests and eliminate candidates
Step 5: Remaining candidate(s) after all eliminations = root cause
```

**Elimination is stronger than confirmation.** A test that rules out a cause is more valuable than a test that supports a hypothesis, because ruling out reduces the search space. Design tests that can definitively falsify.


## P4 â€” STEP-BY-STEP PROCESS

### Step 1: Reproduce the Bug

Before any analysis, establish a reliable reproduction.

```
Reproduction steps:
1. Prerequisites: environment, data state, auth context
2. Actions: exact sequence of operations
3. Expected result: what should happen
4. Actual result: what does happen
5. Frequency: always / sometimes / once / at scale only

If not reproducible:
- Add logging at every relevant code path
- Capture all inputs and state at time of failure
- Ask: what is different about this run vs a successful run?
- Deploy instrumentation, wait for next occurrence
```

**Reproduction checklist:**
- Same data: use the exact input that triggered the bug (capture from logs if possible)
- Same environment: match OS, runtime version, dependency versions, timezone
- Same state: replay database state, cache state, session state
- Same sequence: reproduce the exact order of operations, including timing
- Same load: if the bug only manifests under load, reproduce with load testing tools

### Step 2: Eliminate Obvious Causes

Check the highest-probability causes first.

```
Checklist:
- Is the error message literal? Search codebase for the exact string.
- Is there a stack trace? Read from bottom to top (the actual crash is often deeper).
- Was there a recent deploy to this module? Check deploy history.
- Was there a config change? Check git history for config files.
- Is it environment-specific? Test in dev/staging/prod.
- Is it data-specific? Test with different inputs of the same shape.
- Is it user-specific? Check if a particular user/tenant is affected.
- Is it time-specific? Check if it correlates with time of day, day of week, or a cron job.
```

**The 5-minute rule:** Spend no more than 5 minutes on obvious causes. If none are found, move to structured hypothesis formation. Do not keep re-checking the same obvious causes â€” document that you checked them and move on.

### Step 3: Formulate and Test Hypotheses

Use P3.2 to structure each hypothesis.

```
HYPOTHESIS 1: The timeout is caused by a downstream service that is not responding.

EVIDENCE FOR:
- Error message says "timeout"
- Downstream service has had incidents before

EVIDENCE AGAINST:
- Downstream service monitoring shows normal latency
- Other calls to the same service succeed

EXPERIMENT: Call the downstream service directly with the same parameters
PREDICTION: If downstream is the cause, the direct call will also timeout
RESULT: Direct call succeeds in 50ms
CONCLUSION: HYPOTHESIS FALSIFIED â€” downstream is not the cause

HYPOTHESIS 2: The timeout is caused by a connection pool exhaustion

EVIDENCE FOR:
- Error rate correlates with request volume
- Connection pool metric is at 100% utilization

EVIDENCE AGAINST:
- Pool size was increased last week
- Maximum concurrent requests are below pool limit

EXPERIMENT: Log connection acquisition time and pool wait time
PREDICTION: If pool exhaustion, wait time will be > 0
RESULT: Wait time is 0-2ms, pool has 20/50 connections in use
CONCLUSION: HYPOTHESIS FALSIFIED â€” pool is not exhausted
```

**Hypothesis documentation standards:**
- Every hypothesis must have a falsifiable prediction
- Every experiment must produce a result (null results are valid)
- Every conclusion must be explicitly stated as supported or falsified
- If a hypothesis is partially supported, refine it rather than accepting ambiguity

### Step 4: Isolate Root Cause

Use binary search (P3.3) or delta debugging (P3.4) to narrow the location.

```
Binary search through request lifecycle:

Checkpoint 1: Load balancer receives request â€” OK (metrics show request arrived)
Checkpoint 2: Auth middleware validates token â€” OK (logged successful validation)
Checkpoint 3: Route handler receives request â€” OK (log shows function entry)
Checkpoint 4: Database query executes â€” OK (query log shows 5ms response)
Checkpoint 5: External API call â€” FAIL (log shows 30s timeout, then fallback)

Narrowing: external API call is the failure point.

Now binary search within the external API call function:
- Midpoint: Is the connection established? YES (TCP handshake completes in 2ms)
- Midpoint: Is the request sent? YES (bytes written to socket)
- Midpoint: Is the response received? NO (read timeout after 30s)

Root cause: The response is not being received from the external API.
Further analysis: The request body is malformed â€” the API is waiting for more data.
Root cause: Serialization of the request body produces incomplete JSON.
```

**Isolation techniques by layer:**

| Layer | Isolation Technique |
|---|---|
| HTTP/REST | Trace curl request with same headers/body |
| Database | Run the exact query from the code, check query plan |
| Network | TCP dump, ping/traceroute, check DNS resolution |
| Messaging | Check raw message on queue (Kafka console consumer, SQS receive) |
| Frontend | Check network tab, compare API response with expected |
| Auth | Decode JWT/ token, check expiry, signature, claims |
| Cache | Check cache keys, TTL, eviction policy |

### Step 5: Apply the Minimal Fix

Fix the root cause, not the symptom. Change the minimum code required.

```
Root cause: Request body serialization uses a template that omits the required "version" field.

Fix: Add "version" field to the serialization template. One line change.

Verify:
- NOT the fix: increasing the timeout (treats symptom, not cause)
- NOT the fix: adding retry logic (same request will fail again)
- CORRECT fix: produce the correct request body
```

**Fix principles:**
- The fix should be as minimal as possible â€” one line if one line suffices
- The fix must address the root cause, not a proximate cause
- The fix must not introduce new bugs (check for side effects)
- The fix should be reversible (if it causes problems, easy to roll back)
- If the fix requires changes in multiple places, reconsider â€” the root cause may be at a higher level

**Symptom-fix examples (WRONG):**

| Symptom | Wrong Fix | Right Fix |
|---|---|---|
| Page loads slowly | Add loading spinner | Fix the slow query |
| Error retry succeeds | Remove retry logic, errors are "transient" | Fix the underlying error |
| Null pointer exception | Add null check before access | Find why the value is null and prevent it |
| Data loss on crash | Shorten the backup interval | Fix the data durability mechanism |

### Step 6: Verify and Prevent Recurrence

Confirm the fix works. Add a test. Consider systemic prevention.

```
Verification:
- Unit test: serialization produces valid JSON with all required fields
- Integration test: call to external API with fixed serialization succeeds
- Manual: reproduce original steps, confirm no timeout
- Negative test: serialization produces error if version is missing

Test:
- Before fix: reproduction steps produce timeout
- After fix: same steps succeed
- Edge case: what if version field is empty string? Test validates it.

Recurrence prevention:
- Add schema validation on the request body before sending
- Check if a linter rule could catch missing required fields
- Was this a copy-paste error from another template? Check all templates.
```

**Verification depth:**

| Level | What it catches | What it misses |
|---|---|---|
| Manual re-test | The specific bug path | Other paths, edge cases |
| Unit test | The function's behavior under the fix | Integration issues |
| Integration test | Component interaction | Deployment, configuration |
| E2E test | Full system behavior | Scale, performance |
| Load test | Performance regression | All of the above if not comprehensive |

Always verify at least two levels deep. Unit test + integration test is the minimum.


## P6 â€” READING STACK TRACES AND CRASH DUMPS

### P6.1 â€” Anatomy of a Stack Trace

A stack trace shows the call chain at the point of failure. It is the single most valuable piece of debugging information.

```
Example stack trace:
----------------------------------------
ERROR: TypeError: Cannot read property 'id' of undefined
    at OrderService.calculateTotal (orders.js:142:18)
    at CheckoutController.processOrder (checkout.js:87:32)
    at Router.handleRequest (router.js:56:14)
    at Server.<anonymous> (server.js:120:5)
    at Layer.handle [as handle_request] (node:internal/...)
    at next (node:internal/...)
    at AuthMiddleware.validate (auth.js:33:12)
    at processTicksAndRejections (node:internal/...)
----------------------------------------
```

**Reading order:**
1. **First line** â€” the exception type and message (the immediate problem)
2. **Top of stack** â€” the exact function and line where the error was thrown
3. **Middle frames** â€” the call chain leading to the error
4. **Bottom frames** â€” entry points (event loop, framework code, main)

**Key information in each frame:**

| Element | What it tells you |
|---|---|
| Function name | Which function failed |
| File name | Which module contains the function |
| Line number | The exact line that threw |
| Column number | (in some stacks) the exact character position |
| Native/Internal | The error is in runtime code, not yours (but your code triggered it) |

### P6.2 â€” Reading from Bottom to Top

Conventional wisdom says "read stack traces from top to bottom." For debugging, read from bottom to top:

```
Bottom: server.js:120 â€” HTTP server received a request
         â†“ called
    router.js:56 â€” Router dispatched to the handler
         â†“ called
checkout.js:87 â€” CheckoutController started processing
         â†“ called
  orders.js:142 â€” OrderService.calculateTotal failed
         â†“
Top: TypeError: Cannot read property 'id' of undefined
```

Reading bottom-to-top tells the story in chronological order. The bottom frames are the entry points, each subsequent frame was called by the previous one, and the top is where it broke.

### P6.3 â€” Common Stack Trace Patterns

| Pattern | Interpretation |
|---|---|
| Deep call stack with same function repeating | Recursion that went too deep (missing base case) |
| NullPointerException / undefined access | Object expected but null/undefined received |
| IndexOutOfBounds | Array index >= array length |
| StackOverflowError | Infinite recursion or extremely deep call chain |
| OutOfMemoryError | Heap exhausted, often a memory leak |
| TimeoutException | Operation did not complete within expected time |
| ConcurrentModificationException | Collection modified while being iterated |
| ClassCastException | Type mismatch in serialization/deserialization |
| Multiple stack traces in one error | Cascading failure â€” one exception triggered another |

### P6.4 â€” Reading Crash Dumps

Crash dumps contain the full state of the process at the point of failure. They are more informative than stack traces but require more analysis.

**Types of crash dumps:**

| Type | Contains | When to use |
|---|---|---|
| Core dump (Unix) | Full process memory, registers, stack | Segfaults, native code crashes, SIGABRT |
| Heap dump (Java/.NET) | Object graph, memory allocation, GC roots | OOM, memory leaks, high GC |
| Mini dump (Windows) | Stack, thread info, partial memory | Application crashes |
| Full user dump (Windows) | Complete process memory | All crash types |

**Reading a heap dump:**

```
1. Identify the largest objects by retained size
2. Find the GC root path for the largest objects
3. Group objects by class to find excessive instances
4. Look for object graphs that should have been collected
5. Compare heap dumps at different time points to find growth
```

**Common heap dump findings:**

| Finding | Interpretation |
|---|---|
| Same class has millions of instances | Object leak â€” instances are never released |
| char[] dominates heap | String leak (often from logging, caching, or XML parsing) |
| Thread objects accumulating | Thread leak â€” threads created but not terminated |
| Classloader instances growing | Classloader leak (common in redeploy scenarios) |
| Large byte[] arrays | Buffers not being released or cleared |

### P6.5 â€” Crash Dump Analysis Process

```
1. COLLECT the dump at the point of failure (do not restart before collecting)
2. LOAD into analysis tool (gdb for core dumps, Eclipse MAT for Java heap dumps, WinDbg for Windows dumps)
3. IDENTIFY the thread that crashed (look for the exception or signal handler)
4. EXAMINE the stack trace of the crashing thread
5. EXAMINE variable values at each stack frame
6. CHECK other threads for their state (deadlocked threads, waiting threads)
7. ANALYZE memory allocations if memory-related
8. FORM hypothesis about the root cause
9. VERIFY by checking if the dump matches the hypothesis predictions
```

**Tools by dump type:**

| Dump Type | Tool | Key Commands |
|---|---|---|
| Core dump (Linux) | gdb | `bt` (backtrace), `info locals`, `frame N` |
| Heap dump (Java) | Eclipse MAT | Leak Suspects Report, Dominator Tree, SQL-like OQL |
| Heap dump (.NET) | WinDbg + SOS | `!dumpheap`, `!gcroot`, `!dumpobj` |
| Windows crash dump | WinDbg | `!analyze -v`, `kb` (stack trace), `!threads` |
| Python traceback | pdb / traceback module | `where`, `print`, `list` |


## P8 â€” DEBUGGING STACK: APPLICATION, SYSTEM, NETWORK, DATA

### P8.1 â€” Application Layer

The application layer is the most accessible and the first place to look for bugs.

**What to examine:**
- Source code logic (conditionals, loops, function calls)
- Error handling (try/catch, error propagation, fallback paths)
- State mutations (variable assignments, object modifications)
- Control flow (which branches are taken, which functions are called)
- Data transformations (input parsing, serialization, deserialization)

**Application layer debugging techniques:**

| Technique | When | How |
|---|---|---|
| Print/log debugging | Any bug in application code | Add output at key decision points |
| Step-through debugging | Logic bugs, complex algorithms | IDE debugger, set breakpoints |
| Code review | After narrowing to a few lines | Read the code carefully, trace the logic |
| Rubber duck debugging | Any stuck point | Explain the code line by line out loud |
| Assertions | Invariant violations | Add assert(expected == actual) at checkpoints |

**Application layer traps:**
- Async code that appears synchronous (callbacks that never fire, promises not awaited)
- Implicit type coercion (JavaScript: `"2" + 2 = "22"`, but `"2" - 2 = 0`)
- Floating-point arithmetic (0.1 + 0.2 != 0.3)
- Closure scoping (loop variables in closures)
- Mutation of shared state (objects passed by reference, modified in unexpected places)

### P8.2 â€” System Layer

The system layer includes the operating system, runtime, container, and infrastructure.

**What to examine:**
- Resource limits (CPU, memory, file descriptors, disk space, inodes)
- Process state (running, sleeping, zombie, stopped)
- Thread count and thread state
- Open file handles and network connections
- Kernel parameters and system configuration
- Container resource constraints (cgroup limits)
- Garbage collection behavior (frequency, pause time, collection type)

**System layer debugging techniques:**

| Technique | Tool / Command | What it reveals |
|---|---|---|
| Process listing | `ps aux`, `top`, `htop` | CPU/memory per process |
| Resource limits | `ulimit -a`, `cat /proc/self/limits` | Max processes, open files, etc. |
| Disk space | `df -h`, `du -sh *` | Disk full? Inode exhaustion? |
| Open file handles | `lsof -p <pid>`, `/proc/<pid>/fd` | File descriptor leaks |
| Network connections | `ss -tlnp`, `netstat -an` | Listening ports, connection states |
| Thread dump | `jstack <pid>`, `pstack <pid>` | All threads and their states |
| GC log | JVM: `-Xlog:gc*`, Node: `--trace-gc` | GC pauses, frequency, promotion |
| Kernel log | `dmesg`, `journalctl -k` | OOM killer, hardware errors |
| Container limits | `cat /sys/fs/cgroup/memory/memory.limit_in_bytes` | Container memory limit |
| System call trace | `strace -p <pid>`, `dtrace`, `perf trace` | Every system call |

**System layer patterns:**

| Pattern | Implication |
|---|---|
| High context switching rate | Too many threads competing for CPU |
| File descriptor leak | Connections or files not closed |
| OOM killer firing | Container memory limit exceeded |
| GC pause > 1s | Heap too large or GC configuration wrong |
| Swap usage > 0 | Physical memory insufficient; performance will degrade |
| Zombie processes | Parent process not reaping child processes |
| TCP TIME_WAIT accumulation | Too many short-lived connections |

### P8.3 â€” Network Layer

Network issues manifest as timeouts, connection resets, or intermittent failures.

**What to examine:**
- DNS resolution (does the hostname resolve correctly?)
- TCP connectivity (can we establish a connection?)
- TLS/SSL handshake (is the certificate valid? protocol mismatch?)
- HTTP protocol (status codes, headers, body)
- Latency and packet loss (round-trip time, retransmissions)
- Connection pooling (idle connections, pool size, timeouts)

**Network layer debugging techniques:**

| Technique | Tool | Command |
|---|---|---|
| DNS resolution | `nslookup`, `dig`, `resolvectl` | `dig +trace example.com` |
| Connectivity | `ping`, `tcping`, `curl` | `curl -v http://service:8080/health` |
| Route tracing | `traceroute`, `tracert`, `mtr` | `traceroute -n service.internal` |
| TLS handshake | `openssl s_client` | `openssl s_client -connect host:443 -servername host` |
| Packet capture | `tcpdump`, `Wireshark`, `tshark` | `tcpdump -i eth0 port 8080 -w capture.pcap` |
| HTTP debugging | `curl -v`, `mitmproxy`, `httpx` | `curl -v -H "Content-Type: application/json" -d @body.json http://api` |
| Connection pool | Application metrics | Active/idle connections, wait time, acquired/released |
| Latency breakdown | `hping3`, `mtr` | One-way delay, jitter, packet loss percentage |

**Network layer patterns:**

| Pattern | Likely Cause |
|---|---|
| TCP connection refused | Port not listening, firewall blocking |
| TCP connection timeout | Host unreachable, firewall dropping, routing issue |
| TLS handshake failure | Certificate expired, hostname mismatch, protocol mismatch |
| HTTP 502 Bad Gateway | Upstream service not responding or returning errors |
| HTTP 504 Gateway Timeout | Upstream service too slow to respond |
| Connection reset by peer | Service crashed, killed, or closed the connection |
| Partial response received | Service crashed mid-request, or proxy timeout |
| DNS resolution failure | Service discovery issue, DNS cache expired, network split |

### P8.4 â€” Data Layer

Data issues involve incorrect, corrupt, missing, or inconsistent data.

**What to examine:**
- Data at rest (database tables, files, blob storage)
- Data in transit (serialization format, encoding, compression)
- Data transformations (mapping functions, ETL pipelines, conversion logic)
- Schema and constraints (required fields, types, relationships, uniqueness)
- Data integrity (checksums, validation, referential integrity)

**Data layer debugging techniques:**

| Technique | When | How |
|---|---|---|
| Direct query | Suspect database data | Run the exact SQL, compare with expected |
| Schema diff | After migration | Compare source and target schemas |
| Data sample | Suspect corrupt records | SELECT sample of records, look for anomalies |
| Constraint check | Suspect integrity violation | Run validation queries (missing FK, NULL in non-null column) |
| Serialization check | Wire format issues | Manually serialize/deserialize with test data |
| Checksum verify | Data corruption | Compare checksums of source and target |
| Audit log | Unauthorized data change | Check who changed what and when |
| Replay | Data pipeline bug | Replay input data through the pipeline, compare output |

**Common data layer bugs:**

| Bug | Detection | Fix |
|---|---|---|
| Truncated data | Field shorter than expected | Increase column size, fix truncation logic |
| Character encoding | Mojibake (garbled text) | Fix encoding at every boundary: DB connection, file read, HTTP header |
| Default value wrong | Records with unexpected defaults | Correct the schema default, update existing records |
| Foreign key violation | Orphaned records | Fix deletion order, add cascade, fix application logic |
| Race condition on write | Lost updates (last write wins) | Add versioning, use conditional updates, use transactions |
| Wrong aggregation | Incorrect sums/counts | Check GROUP BY, WHERE clause, join conditions |
| Timezone confusion | Off-by-hours timestamps | Store UTC, convert at display, check DB timezone setting |
| Migration data loss | Missing columns/rows after migration | Test migration on copy of production data, verify row counts |


## P10 â€” DEBUGGING MEMORY ISSUES

### P10.1 â€” Memory Leaks

A memory leak occurs when memory that is no longer needed is not released, causing heap growth over time.

**Common leak patterns:**

| Pattern | Description | Detection |
|---|---|---|
| Accumulating collections | Objects added to a collection but never removed | Heap growth of collection class instances |
| Event listener leak | Listeners registered but never deregistered | Listener/reference count mismatch |
| Cache without eviction | Cached entries never expire | Cache size grows unbounded |
| Thread-local accumulation | Thread-local storage not cleaned up | Thread death does not clean TLO |
| Classloader leak | Classes redeployed without GC of old classloaders | Metaspace growth (Java), permgen |
| Callback/closure references | Callbacks hold references to large objects | Retained heap analysis |
| Object pooling leak | Pooled objects not returned | Pool expands indefinitely |
| Native memory leak | malloc/new without free/delete | Process memory grows, heap does not |

**Debugging memory leaks:**

```
1. CONFIRM it is a leak
   - Heap grows over time, even after GC
   - Process restarts with OOM killer after predictable period

2. IDENTIFY the growing data structure
   - Take heap dump at time T1 and time T2 (after growth)
   - Compare: which objects increased most?
   - Look for objects that exist in T2 dump but should have been collected

3. FIND the GC root path
   - For the leaking objects, find the reference chain to a GC root
   - Common roots: static fields, threads, JNI references
   - The root shows what is keeping the objects alive

4. DETERMINE why references are not released
   - Collection not cleared? Event not deregistered? Thread not stopped?
   - Cache without eviction? Listener without removal?

5. FIX: release the reference at the appropriate time
   - Clear collections, deregister listeners, stop threads
   - Add eviction, use weak references, use try-with-resources
```

**Heap dump analysis commands (Eclipse MAT):**

| Command | Purpose |
|---|---|
| Leak Suspects Report | Automatic identification of likely leaks |
| Dominator Tree | Largest objects by retained size |
| Path to GC Roots | Reference chain keeping an object alive |
| OQL (Object Query Language) | SQL-like queries for objects |
| Top Consumers | Classes with the most instances or largest retained size |

### P10.2 â€” Memory Corruption

Memory corruption involves writing to memory that was not allocated, overwriting data structures.

**Corruption sources:**

| Source | Description |
|---|---|
| Buffer overflow | Writing beyond array bounds |
| Use-after-free | Accessing memory after it was freed |
| Double free | Freeing the same pointer twice |
| Uninitialized memory | Reading memory before writing to it |
| Type confusion | Treating one type of object as another |
| Stack overflow | Stack collides with heap |

**Debugging memory corruption:**

| Technique | Tool | When |
|---|---|---|
| AddressSanitizer (ASan) | C/C++ compiler flag | Buffer overflow, use-after-free, double free |
| MemorySanitizer (MSan) | C/C++ compiler flag | Use of uninitialized memory |
| LeakSanitizer (LSan) | C/C++ compiler flag | Memory leaks |
| UndefinedBehaviorSanitizer (UBSan) | C/C++ compiler flag | Undefined behavior |
| Valgrind Memcheck | C/C++ runtime | Comprehensive memory checking |
| Electric Fence | C/C++ | Buffer overflows using page protection |
| Page heap (Windows) | Windows debug mode | Buffer overruns and underruns |

**Corruption debugging workflow:**

```
1. REPRODUCE the crash with ASan enabled
   - ASan will report the exact line where corruption occurs
   
2. If ASan cannot be used (native libraries, embedded):
   - Use memory poisoning: write known patterns before and after allocations
   - Check if patterns are intact when the crash occurs
   
3. For use-after-free:
   - Use Valgrind or ASan to detect access to freed memory
   - Check: was the pointer set to NULL after free? Was the lifetime correct?
   
4. For buffer overflow:
   - Enable bounds checking
   - Check array index calculations for off-by-one
   - Check string operations (strcpy, sprintf without bounds)
```

### P10.3 â€” Memory Fragmentation

Memory fragmentation occurs when free memory is broken into small pieces, making it impossible to allocate large contiguous blocks.

**Types of fragmentation:**

| Type | Description | Platform |
|---|---|---|
| External fragmentation | Free memory in small non-contiguous chunks | Malloc-based allocators |
| Internal fragmentation | Allocated memory is larger than requested | All allocators |
| Heap fragmentation | Gaps in managed heap prevent object promotion | GC-managed languages |
| Virtual memory fragmentation | Address space exhaustion | 32-bit systems |

**Detecting fragmentation:**

- Allocation failure for large objects when total free memory is sufficient
- Process address space shows many small free regions (check with /proc/self/maps)
- Increase in GC overhead (GC cannot allocate in old generation, does full GC)
- RSS (resident set size) is significantly larger than heap size

**Fragmentation resolution:**

| Strategy | Description |
|---|---|
| Use jemalloc/tcmalloc | Better fragmentation characteristics than glibc malloc |
| Object pooling | Reuse fixed-size objects instead of allocating |
| Pre-allocate large buffers | Avoid dynamic growth of buffers |
| 64-bit migration | Address space fragmentation is nearly unlimited |
| GC tuning | Larger heap, different GC algorithm (G1, Shenandoah) |
| slab allocator | Fixed-size allocation for kernel objects |

### P10.4 â€” Out of Memory (OOM)

OOM occurs when the system or process cannot allocate more memory.

**OOM types and their meanings:**

| OOM Type | Indication |
|---|---|
| Java: java.lang.OutOfMemoryError: Java heap space | Heap exhausted, likely leak or undersized |
| Java: java.lang.OutOfMemoryError: GC Overhead limit exceeded | 98% of CPU on GC with <2% heap recovered |
| Java: java.lang.OutOfMemoryError: Metaspace | Class metadata exhausts metaspace |
| Java: java.lang.OutOfMemoryError: Direct buffer memory | NIO direct buffers not released |
| Java: java.lang.OutOfMemoryError: Unable to create new native thread | OS thread limit reached |
| Linux: OOM killer kills process | System memory exhausted |
| Container: Exit code 137 | Docker OOM kill |
| Node: FATAL ERROR: Ineffective mark-compacts near heap limit | GC cannot free memory |
| Node: Allocation failed - process out of memory | JavaScript heap exhausted |

**OOM debugging checklist:**

```
1. Is it heap or native memory?
   - Check: heap metrics + RSS (resident set size)
   - Heap OOM: heap metrics at limit, RSS approx = heap
   - Native OOM: heap metrics normal, RSS much larger than heap

2. Is it a leak or just undersized?
   - Leak: heap grows unboundedly over time
   - Undersized: heap grows to limit and stabilizes, then OOM
   - Test: increase heap size â€” if OOM takes longer, it's undersized; if OOM still happens same time, it's a leak

3. What is using the memory?
   - Heap dump analysis: largest retained objects
   - Native memory tracking: NMT (Java), /proc/pid/status, pmap

4. What triggered the OOM specifically?
   - Was it a single large allocation?
   - Was it many small allocations over time?
   - Was it triggered by a specific user action or event?
```

**OOM prevention:**

| Strategy | Description |
|---|---|
| Heap limit with graceful degradation | Detect high heap usage, reject new requests instead of OOM |
| Circuit breaker | Stop processing when memory crosses threshold |
| Memory budget per request | Track and limit per-request allocation |
| Continuous profiling | Detect memory growth trends before OOM |
| Proper collection sizing | Set realistic initial and max sizes for collections |
| Weak/soft references | Allow GC to reclaim cache data under memory pressure |
| Stream processing | Process data in chunks instead of loading everything |


## P12 â€” DEBUGGING DISTRIBUTED SYSTEMS

### P12.1 â€” Network Partitions

A network partition splits a distributed system into groups that cannot communicate.

**Detection:**
- Increased latency between services
- Connection timeouts and retries
- Partial cluster: some nodes unreachable from others
- Split-brain: both partitions believe they are the leader

**Debugging network partitions:**

```
1. CONFIRM the partition
   - Ping/traceroute between affected nodes
   - Check firewall rules, security groups, network policies
   - Check DNS resolution: do all nodes resolve the same endpoints?

2. IDENTIFY the split
   - Which nodes can talk to which other nodes?
   - Is it a complete partition or partial (asymmetric)?

3. ASSESS the impact
   - Are both sides of the partition serving traffic?
   - Is there data inconsistency from split-brain?
   - Are there pending retries accumulating?

4. RESOLVE
   - Fix the network issue (firewall, routing, DNS)
   - If split-brain occurred, reconcile data
   - Quorum-based systems need majority nodes to form a partition that can make progress
```

**Partition-tolerant design patterns:**

| Pattern | Description |
|---|---|
| Circuit breaker | Stop calling a failing service, fail fast |
| Bulkhead | Isolate resources per service/client |
| Timeout with exponential backoff | Prevent retry storms after partition heals |
| Active-active with conflict resolution | Both sides accept writes, merge later |
| Leader election with quorum | Only one partition can have a leader |
| Graceful degradation | Serve stale data or reduced functionality |

### P12.2 â€” Consensus Failures

Consensus failures occur when distributed agreement protocols (Raft, Paxos, Zab) fail to reach agreement.

**Common consensus failures:**

| Failure | Description | Debug |
|---|---|---|
| Leader election timeout | No leader elected, cluster unavailable | Check network between nodes, timer configuration |
| Split brain | Multiple leaders elected | Check quorum size, network partition |
| Log divergence | Replicas have different log entries | Check replication protocol, compare logs |
| Stale reads | Reading from a replica that has not caught up | Check read consistency level |
| Transaction conflict | Optimistic concurrency conflicts | Check conflict rate, retry logic |
| Transaction timeout | Distributed transaction does not complete | Check transaction timeout, participant health |

**Debugging consensus failures:**

```
1. CHECK cluster membership
   - Are all expected nodes present?
   - Are the node IDs and addresses correct?
   - Is the cluster size consistent across nodes?

2. CHECK leader election
   - Who is the current leader according to each node?
   - Is leader election stuck?
   - Are there election timeouts happening repeatedly?

3. CHECK replication
   - What is the committed log index on each node?
   - Are any nodes lagging behind?
   - Is the replication protocol making progress?

4. CHECK quorum health
   - How many nodes are needed for quorum?
   - How many are currently available?
   - Can the current nodes form a quorum?
```

### P12.3 â€” Timeout Cascades

A timeout cascade occurs when one slow component causes dependent components to also time out, spreading failure through the system.

**Cascade mechanism:**

```
Service A (SLA: 500ms) â†’ calls Service B (SLA: 200ms)
                         â†’ if B is slow (1s), A's requests queue up
                         â†’ A's response time increases
                         â†’ Clients of A start timing out
                         â†’ Clients retry, adding more load
                         â†’ A gets more requests while already overloaded
                         â†’ A's threads/timeouts compound
                         â†’ System collapse
```

**Debugging timeout cascades:**

```
1. IDENTIFY the root slow component
   - Trace distributed requests end-to-end
   - Which service has the highest latency increase?
   - Which service was the first to slow down?

2. CHECK for retry amplification
   - Are clients retrying on timeout?
   - How many retries? What backoff strategy?
   - Is the retry storm amplifying load?

3. CHECK for connection pool exhaustion
   - Are downstream connections held by slow requests?
   - Are new requests queued waiting for connections?
   - Are threads blocked waiting for connections?

4. CHECK for resource exhaustion
   - Thread pool: all threads waiting on downstream
   - Memory: queued requests fill memory
   - File descriptors: connections pile up
```

**Timeout cascade prevention:**

| Strategy | Description |
|---|---|
| Bounded retries | Maximum retry count with exponential backoff + jitter |
| Client-side timeout | Each service sets and respects its own timeout |
| Circuit breaker | Trip when downstream error rate exceeds threshold |
| Bulkhead | Separate thread pools for different downstream services |
| Request collapsing | Batch concurrent requests to same downstream |
| Load shedding | Reject requests early when resource utilization is high |
| Priority queues | Process high-priority requests first during overload |

### P12.4 â€” Distributed Tracing

Every debug session in a distributed system should start with distributed tracing.

**Trace-backed debugging:**

```
1. FIND the trace for the failing request
   - Filter by trace_id, error status, or time window
   
2. ANALYZE the span timeline
   - Which service took the most time?
   - Which span has the error?
   - Are there gaps between spans (uninstrumented code)?

3. COMPARE with a successful trace
   - Different code path taken?
   - Different data?
   - Different timing between spans?

4. CHECK span tags and logs
   - Error details, exception stack traces
   - HTTP status codes, request/response sizes
   - Database query details
```

**Essential trace data for debugging:**

| Data Point | Why |
|---|---|
| Trace ID | Link all spans for the request |
| Span start/end time | Calculate latency per service |
| Service name | Identify which service failed |
| Operation name | Identify which operation failed |
| Status code | Error classification |
| Tags | Context: HTTP method, URL, DB statement |
| Logs | Detailed error messages, stack traces |


## P14 â€” GIT BISECT AND BINARY SEARCH THROUGH COMMITS

### P14.1 â€” Basic Git Bisect

Git bisect performs a binary search through commit history to find the commit that introduced a bug.

```
Start: Known good commit (G) and known bad commit (B)
  G â† ... â† ... â† ... â† B

Step 1: Checkout the middle commit (M)
  G â† ... â† M â† ... â† B
  Test: is the bug present at M?
  - If YES: bug exists at M, search the G-M range is clean, bug is in M-B range
  - If NO: bug does not exist at M, search the M-B range

Step 2: Repeat on the affected half
  Continue until a single commit is identified
```

**Git bisect workflow:**

```
# Start bisect
git bisect start
git bisect bad HEAD           # current commit has the bug
git bisect good v2.3.0        # last known good version

# Git checks out the midpoint commit automatically
# Test the commit:
# If bug is present:
git bisect bad
# If bug is absent:
git bisect good

# Repeat until git identifies the first bad commit
# Output: abc1234 is the first bad commit
# Review the commit diff

# End bisect
git bisect reset
```

### P14.2 â€” Automated Bisect

For bugs with automated reproduction scripts, bisect can run automatically.

```
# Create a test script that exits 0 for good, non-0 for bad
# test.sh:
#!/bin/bash
./run-tests --test-specific-bug
if [ $? -eq 0 ]; then exit 0; else exit 1; fi

# Run automated bisect
git bisect start HEAD v2.3.0
git bisect run ./test.sh

# Git will automatically:
# 1. Checkout each midpoint
# 2. Run the test script
# 3. Mark the commit good or bad
# 4. Continue until the first bad commit is found
```

**Automated bisect requirements:**
- The test script must be deterministic (same result every time for the same commit)
- The test script must return quickly (bisect checks many commits)
- The environment must be reproducible (same dependencies, configuration, data)
- The test must detect the specific bug, not other failures

### P14.3 â€” Bisect with Large Repositories

For repositories with thousands of commits, optimize the bisect process.

```
Optimization 1: Narrow the search range first
  - If the bug appeared "last week", start with git bisect good pointing to last week
  - Check git log for commits to the affected module only
  - Use git bisect skip if a commit cannot be tested (build failures, etc.)

Optimization 2: Skip irrelevant commits
  - If the bug is in the backend, skip frontend-only commits:
    git bisect skip -- $(git log --oneline --all -- 'frontend/**' | awk '{print $1}')
  
Optimization 3: Use patch-level bisect
  - If the bug is in a specific file, use git log -- <file> to get only relevant commits
  - This is not git bisect but manual binary search through filtered commits
```

### P14.4 â€” Bisect Beyond Git

The binary search concept applies beyond git commits.

**Non-git bisect applications:**

| Application | "Good" State | "Bad" State | Bisect Search |
|---|---|---|---|
| Docker images | Working image tag | Broken image tag | Binary search through image tags |
| Configuration files | Working config | Broken config | Binary search through config sections |
| Dependencies | Working dep version | Broken dep version | Binary search through dependency versions |
| Database migrations | Working schema | Broken schema | Binary search through migration sequence |
| Feature flags | Working with flag off | Broken with flag on | Binary search through flag combinations |
| Deployment regions | Working region | Broken region | Binary search through deployment regions |

### P14.5 â€” Commit Inspection

Once bisect identifies the breaking commit, inspect it thoroughly:

```
1. VIEW the full diff
   git show <commit-hash>

2. READ the commit message
   - Does the message explain what changed and why?
   - Does the message reference a ticket or issue?

3. UNDERSTAND the change
   - What files were modified?
   - What was the intent of the change?
   - Could the change cause the observed bug?

4. CHECK for related changes
   - Were there follow-up fixes to the same code?
   - Were there partial reverts?

5. VERIFY the fixing direction
   - Revert the commit: does the bug go away? (Confirms this commit caused it)
   - If revert fixes the bug, you understand the root cause
   - If revert does not fix the bug, the commit may not be the root cause
```


## P16 â€” DEFECT PREVENTION

### P16.1 â€” Lessons Learned Process

Every debugging session should produce a lessons learned artifact that prevents similar bugs.

```
LESSONS LEARNED TEMPLATE:

Bug Summary:
  - What was the symptom?
  - What was the root cause?
  - What was the fix?

Why It Wasn't Caught:
  - Should the tests have caught it? Why didn't they?
  - Should the code review have caught it? Why didn't it?
  - Should the linter/static analysis have caught it? Why didn't it?
  - Should monitoring/alerting have detected it sooner?

Prevention Actions (choose one or more):
  [ ] Add a unit test for this specific case
  [ ] Add an integration test covering this flow
  [ ] Add a monitoring alert for this condition
  [ ] Add a linter rule to detect the pattern
  [ ] Add type checking or schema validation
  [ ] Update the code review checklist
  [ ] Document the pattern in team knowledge base
  [ ] Add defensive validation at system boundaries

Action Items:
  - [ ] Owner, Description, Deadline
```

### P16.2 â€” Testing Strategies from Debugging Insights

Each bug reveals a gap in the test suite. Close the gap.

**Mapping bugs to missing tests:**

| Bug Type | Missing Test | Test Example |
|---|---|---|
| Off-by-one error | Boundary test | Test with array length 0, 1, max, max+1 |
| Null pointer | Null input test | Test with null/undefined for every nullable parameter |
| Race condition | Concurrent access test | Test with 10+ concurrent readers/writers |
| Migration bug | Migration test + data verification | Test migration on production-like data |
| Configuration bug | Config variation test | Test with each config permutation |
| Third-party API change | Contract test | Test with recorded responses from the API |
| Timezone bug | Timezone matrix test | Test with UTC, local, and random timezones |
| Empty state bug | Empty data test | Test with empty arrays, empty strings, no results |
| Error path bug | Error simulation test | Mock each dependency to return errors |

**Test addition priority:**
1. **Reproduction test**: A test that failed before the fix and passes after (MANDATORY)
2. **Edge case test**: Tests for related inputs/states that might also be broken
3. **Regression test suite addition**: Add the reproduction test to CI regression suite
4. **Systemic test**: If similar bugs exist elsewhere, add tests for those too

### P16.3 â€” Monitoring and Alerting from Bugs

Every bug that reaches production is a monitoring failure. The gap between "detectable" and "detected" must be closed.

**Monitoring improvements from bug post-mortems:**

```
Before Bug: Error happens but no one notices for 3 hours
After Bug: Alert fires within 1 minute

What changed:
- Added error rate monitoring for the affected endpoint
- Set alert threshold at >1% error rate over 5 minutes
- Alert via PagerDuty to the on-call engineer
```

**Checklist for monitoring improvements:**

```
For each production bug, ask:
  - [ ] Could this error be detected by a metric? If so, add the metric.
  - [ ] Could this error be detected by a log pattern? If so, add log-based alert.
  - [ ] Could this error be detected by tracing? If so, add span error detection.
  - [ ] Is there a leading indicator that could predict this bug before user impact?
  - [ ] Is the error rate, latency, or throughput threshold set appropriately?
  - [ ] Is the on-call engineer notified within 5 minutes of the condition?
  - [ ] Is the alert actionable? (Not: "something is weird" â€” but: "X is failing because Y")
```

**Leading indicators for common bug types:**

| Bug Type | Leading Indicator | Monitor |
|---|---|---|
| Memory leak | Heap growth rate | Heap size over time (rate of change alert) |
| Slow query | Query latency increase | P50/P95/P99 query latency per endpoint |
| Connection pool exhaustion | Connection pool utilization | % active connections, wait time |
| Disk full | Disk usage growth rate | Disk usage %, rate of change |
| Deadlock | Lock contention rate | Lock wait time, deadlock count |
| Cache stampede | Cache miss ratio | Cache hit rate, origin load |
| Request rate spike | RPS increase | Request rate, rate of change |

### P16.4 â€” Systemic Prevention Patterns

| Pattern | Description | Example |
|---|---|---|
| Fail fast | Validate inputs at system boundaries | JSON schema validation on API entry points |
| Immutable core | Core data structures cannot be modified | Event sourcing, functional core |
| Compile-time checks | Move runtime errors to compile time | Type systems, dependent types, static analysis |
| Property-based testing | Test invariants over random inputs | QuickCheck, Hypothesis, fuzzing |
| Defense in depth | Multiple layers of protection | Validation at input, service, and data layers |
| Chaos engineering | Proactively inject failures | Simulate network partitions, instance failures |
| Error budgets | Quantify acceptable error rates | SLO-based error budgets |
| Automatic rollback | Detect and revert bad deployments | Canary analysis with auto-rollback |
| Load testing | Verify behavior under expected load | Baseline, peak, and stress testing |
| Pin dependencies | Prevent unexpected dependency changes | Lockfiles, vendor directory, version pins |


## P18 â€” QUALITY GATES

### Tier 1 â€” Hard Block

- [ ] Bug reproduction steps established (exact inputs, conditions, and frequency)
- [ ] At least one hypothesis formed and tested before the fix
- [ ] Root cause explicitly stated (not just "fixed the bug")
- [ ] Fix addresses root cause, not symptom
- [ ] Fix verified: reproduction steps no longer produce the failure
- [ ] Test added that covers the exact failure path (failed before fix, passes after)

### Tier 2 â€” Standard

- [ ] Symptom traced through levels 1-4 of the debugging stack (P3.1)
- [ ] Other hypotheses documented and eliminated
- [ ] Git bisect or delta debugging completed for regressions
- [ ] Synarc S6 error intelligence all 6 steps completed
- [ ] Recurrence prevention identified (monitoring, alert, process change)
- [ ] Blast radius of the bug assessed (how many users/data affected, for how long)
- [ ] If the bug security-related: CRITICAL risk, incident response triggered
- [ ] Lessons learned documented (P16.1 template)
- [ ] Monitoring gap identified and closed (P16.3 checklist)
- [ ] Leading indicator added if applicable

### Tier 3 â€” Excellence

- [ ] Systemic prevention identified (P16.4): would this bug type be impossible after the change?
- [ ] Related code paths audited for the same pattern
- [ ] Property-based test added for the invariant
- [ ] Chaos engineering scenario designed to test similar failure modes
- [ ] Team knowledge base updated with the debugging approach and findings

### Self-Audit

```
Bug reproduced reliably?                    yes (or explicit plan for non-reproducible)
Root cause stated?                          yes
Symptom vs cause distinguished?             yes
Fix is minimal (no scope creep)?            yes
Test covers the exact failure path?         yes
Verification: bug cannot be reproduced?     yes
Hypothesis documented before fixing?        yes
Other hypotheses eliminated?                yes
Lessons learned documented?                 yes
Monitoring gap closed?                      yes
```


*Synarc S1 WorkType classification (FIX is minimum HIGH risk for production), S2 risk hard floors (data/auth/payment bugs are CRITICAL), S6 error intelligence (all 6 steps mandatory), S13 quality gates, S14 language rules, S17 zero-tolerance violations (VIOLATION 3: fix without root cause, VIOLATION 4: fix without test). Ledger entry for every debug session.*
