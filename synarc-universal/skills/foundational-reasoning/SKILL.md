---
name: foundational-reasoning
description: Foundational Reasoning — First Principles & Systems Thinking
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Foundational Reasoning — First Principles & Systems Thinking

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

All synarc prohibitions and tracking protocols apply.

Foundational reasoning operates on two complementary tracks. The first principles track decomposes problems to elemental truths — things known to be true independent of convention, precedent, or existing solutions. From these truths you reconstruct the solution. The systems thinking track models the behavior of interconnected components as a whole, identifying feedback loops, delays, stocks and flows, and emergent properties. Together they form a complete reasoning system: decompose to fundamentals, then understand how those fundamentals interact as a dynamic system.



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


## P2 — CORE METHODOLOGY: Two Tracks

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FOUNDATIONAL REASONING                          │
├──────────────────────────────────┬──────────────────────────────────┤
│   TRACK A: FIRST PRINCIPLES      │   TRACK B: SYSTEMS THINKING       │
│                                  │                                  │
│   1. DECOMPOSE                   │   1. MAP                          │
│      Break problem to            │      Identify elements,           │
│      irreducible truths          │      connections, boundaries      │
│                                  │                                  │
│   2. ANALYZE                     │   2. MODEL                        │
│      Identify assumptions        │      Determine feedback           │
│      vs facts, constraints       │      structures, delays,          │
│      vs conventions              │      stocks and flows             │
│                                  │                                  │
│   3. RECOMPOSE                   │   3. LEVERAGE                     │
│      Rebuild solution            │      Find intervention            │
│      from truths up              │      points, predict effects      │
├──────────────────────────────────┴──────────────────────────────────┤
│   TRACK C: SYNTHESIS                                                 │
│   Decompose components with FP → Model interactions with ST          │
│   Identify leverage with ST → Decompose leverage with FP             │
│   Map system with ST → Verify fundamentals with FP                   │
└─────────────────────────────────────────────────────────────────────┘
```

### P2.1 — Track A: First Principles Process

#### Step A1: State the Problem Without Solution Reference

Write the problem in one sentence without referencing any existing solution or implementation.

```
WRONG: "We need to migrate from Express to Fastify because Express is slow"
RIGHT: "Request handling at 500 req/s produces 2000ms P99 latency"
```

The problem statement must be falsifiable and measurable. If it cannot be tested, it is not sufficiently decomposed.

#### Step A2: Decompose to Irreducible Elements

List every component of the problem as separate atomic facts. Each fact must be independently verifiable. Decompose until every component is:

- **Atomic** — cannot be split further without losing meaning
- **Provable** — you can demonstrate its truth independently
- **Unambiguous** — one interpretation, no hidden dependencies

Stop decomposing when:
- The component is a primitive of the domain (byte, packet, row, idempotent operation)
- The component is defined by physics or mathematics (latency of light in fiber, max throughput of a TCP connection)
- Decomposing further adds no actionable insight

```
Problem: High request latency at 500 req/s

Elements:
- Client sends HTTP request
- Server receives on TCP socket
- Router matches path to handler
- Handler reads from DB (one query)
- Handler serializes JSON response
- Server sends TCP response
- Latency measurement: 2000ms total

Irreducible truths:
- HTTP is text-based, each request requires parsing
- TCP requires handshake + teardown (unless keep-alive)
- DB query round-trip: ~50ms local, ~5ms in-process
- JSON serialization time: ~0.5ms for 1KB payload
- Node.js event loop processes one callback per tick
```

#### Step A3: Classify Each Element by Knowledge Type

| Type | Definition | Example |
|------|------------|---------|
| Fundamental | True by definition, physics, or logic | A database transaction must be atomic, consistent, isolated, durable by definition |
| Empirical | True by measurement or observation | Current query takes 200ms at P99 |
| Conventional | True by human agreement or prior choice | REST over GraphQL, 2-space indent, camelCase |
| Assumed | Believed true without verification | "The database is the bottleneck" — not measured |
| Inherited | Adopted from existing design | "We use microservices because the last team set them up" |

Tag every claim in the analysis. Untagged claims are assumed — and must be treated as unverified.

#### Step A4: Separate Constraints from Conventions

Annotate each element as constraint (C) or convention (V):

```
- TCP handshake     : C (network protocol requirement)
- HTTP parsing      : C (HTTP spec requirement)
- Keep-alive        : V (we disabled it — enable it)
- DB query          : C (data must come from disk)
- ORM overhead      : V (we use an ORM — raw query faster)
- JSON response     : V (could use binary or compressed)
- Event loop        : C (Node.js execution model)
```

| Property | Constraint | Convention |
|----------|------------|------------|
| Source | Physics, math, security, business legal | Team preference, industry trend, historical choice |
| Changeable | No (or at extreme cost) | Yes (with agreement) |
| Violation cost | System failure, data loss, security breach | Style inconsistency, migration effort |
| Examples | TCP ACK delay, CAP theorem, disk IOPS, atomicity | Indentation style, REST vs gRPC, folder structure |

**Rule:** If you cannot name the concrete failure that would result from violating it, it is a convention — not a constraint.

**Constraint verification protocol:**
1. State the constraint as a claim: "X is required for Y to function"
2. Identify the failure mode: "If X is removed, Z breaks"
3. Verify the failure mode actually occurs (test it, don't assume it)
4. If the failure mode does NOT occur, X is a convention — challenge it

**Convention relaxation ladder (in order of increasing confidence):**
1. **Suspend** — Try removing the convention temporarily. Does anything break?
2. **Replace** — Substitute with an alternative. Same outcome? Convention confirmed.
3. **Abstract** — Generalize the convention to a principle. Apply only where principle applies.
4. **Eliminate** — Remove entirely if no value is demonstrated after steps 1-3.

**Constraint/convention spectrum:**
```
Physical law ──── Contractual ──── Security ──── Business policy ──── Team standard ──── Personal preference
  (immutable)     (costly to       (costly to     (can be changed    (can be changed    (easiest to change)
                   change)          change)        with approval)     by consensus)
```

Every step rightward on this spectrum means the thing is more negotiable. Map each constraint to its true position.

#### Step A5: Challenge Every Convention

For each convention, ask: "What happens if we change or remove this?"

```
- Keep-alive disabled → enable: eliminates TCP handshake per request
- ORM → raw query: saves 10-15ms per request in query building
- JSON → MessagePack: saves ~0.2ms serialization
- Node.js → Go: not a convention change — is it worth the rewrite cost?
```

Challenge inherited conventions first — they carry the highest probability of being obsolete.

#### Step A6: Rebuild from First Principles

Propose solutions based only on the constraints, incorporating only conventions that survive Step A5.

```
Rebuilt solution:
1. Enable HTTP keep-alive (zero cost, removes ~20ms per connection)
2. Replace ORM query with raw parameterized query (1 hour change)
3. Add response compression for large payloads
4. Keep Node.js — rewrite cost exceeds benefit at current scale
Expected improvement: 2000ms → ~200ms P99
```

#### Step A7: Verify Against Measured Reality

Check each proposed change against measured data. Invalid changes are those contradicted by measurement.

```
- Keep-alive: confirmed disabled in nginx config → enable
- ORM profiling: 15ms per query confirmed → raw query saves 15ms
- Compression: payloads are 1KB, compression adds CPU → skip
- Check: does 200ms P99 matter for this system? SLA is 500ms → yes, worth doing
```

### P2.2 — Track B: Systems Thinking Process

#### Step B1: Define the System Boundary

State what is inside, what is outside, and the interactions at the boundary.

```
System: E-commerce checkout service
Inside: Cart service, payment service, inventory service, order service
Outside: Users, payment gateways, shipping carriers, fraud detection
Boundary interactions:
- Users → Cart (add/remove items)
- Cart → Payment (total amount)
- Payment → Gateway (charge request)
- Gateway → Payment (confirmation/decline)
- Payment → Inventory (reserve items)
- Inventory → Order (fulfillment trigger)
- Order → Carrier (shipping request)
```

Boundary errors are the most common failure in systems analysis. A boundary that excludes a critical feedback loop will produce misleading conclusions.

#### Step B2: Map Variables and Causal Links

List all dynamic variables and draw causal connections with polarity:

| Polarity | Meaning | Notation |
|----------|---------|----------|
| S (Same) | A increases → B increases; A decreases → B decreases | A --S→ B |
| O (Opposite) | A increases → B decreases; A decreases → B increases | A --O→ B |

```
Variables:
- Cart item count, total price, payment attempts, inventory levels, order queue
- Payment success rate, gateway response time, inventory reservation timeout

Causal links:
- Cart item count ↑ → total price ↑ → abandonment rate ↑ (O)
- Payment attempts ↑ → gateway timeout ↑ → retries ↑ → payment attempts ↑ (R)
- Inventory reserved ↑ → available inventory ↓ → oversell risk ↑ → backorder rate ↑ (R)
- Order queue depth ↑ → fulfillment delay ↑ → customer complaints ↑ (R)
- Fraud flags ↑ → manual review delay ↑ → order acceptance delay ↑ → abandonment ↑ (B)
```

#### Step B3: Identify Feedback Loops

Label each closed cycle as Reinforcing (R) or Balancing (B).

| Loop Type | Behavior | Graph Shape | Engineering Signal |
|-----------|----------|-------------|--------------------|
| Reinforcing (R) | Amplifies change — growth or collapse | Exponential | User growth → more content → more users |
| Balancing (B) | Counteracts change — stability or oscillation | S-curve or damped wave | Load increases → latency rises → users leave → load drops |
| R with delay | Overshoot and collapse | Boom-bust | Hire aggressively → productivity drops → reorg |
| B with delay | Oscillation | Sustained wave | Deploy → bug → rollback → deploy cautiously → repeat |

```
R1 (PAYMENT DEATH SPIRAL):
Payment attempts ↑ → gateway timeout probability ↑ → timeout → retry → payment attempts ↑
Break: Add circuit breaker on gateway timeouts + exponential backoff

B1 (CART ABANDONMENT STABILIZATION):
Cart item count ↑ → total price ↑ → abandonment rate ↑ → cart item count ↓

R2 (OVERSELL CASCADE):
Inventory reserved ↑ → available inventory ↓ → oversell → backorder → more inventory reserved
Break: Add optimistic concurrency on inventory reservation + reservation timeout

B2 (LOAD SHEDDING):
Order queue depth ↑ → fulfillment delay ↑ → new orders ↓ → order queue depth ↓
```

#### Step B4: Analyze Stocks and Flows

For every pool of resources in the system:

```
Stock = integral of (inflow - outflow) over time + initial stock

Identify:
- What accumulates? (bugs, tech debt, queue depth, confidence, knowledge)
- What is the inflow rate? (new bug rate, debt introduction rate)
- What is the outflow rate? (bug fix rate, refactor rate)
- What delays exist in the flows? (bug reporting delay, deployment delay)
```

**Rule:** Stocks can only change through flows. Flows have rates. Rates are determined by system structure. To change a stock, you must change the flow rates or the structure that determines them.

| Primitive | Definition | Engineering Example |
|-----------|------------|---------------------|
| Element | A component of the system | Service, database, queue, load balancer |
| Connection | Relationship between elements | API call, event stream, DB read/write |
| Boundary | What is inside vs. outside the system | Service mesh boundary, team ownership |
| Environment | What the system interacts with outside its boundary | Users, third-party APIs, regulatory bodies |
| Stock | Accumulated quantity | Queue depth, connection pool, cache entries |
| Flow | Rate of change to a stock | Requests/second, writes/second, evictions/second |
| Delay | Time between action and effect | CI pipeline time, cache TTL, replication lag |
| Feedback loop | Closed chain of cause and effect | Circuit breaker open → retries stop → circuit closes |

#### Step B5: Identify Leverage Points

Rank possible interventions by leverage point (1 = least effective, 11 = most effective):

| # | Leverage Point | Description | Engineering Example |
|---|---|---|---|
| 1 | Parameters | Numbers like rates, sizes, timeouts | Adjusting max connection pool size |
| 2 | Buffer sizes | Size of stabilizing stocks | Doubling cache capacity |
| 3 | Stock-and-flow structures | Physical layout and connections | Moving from monolith to microservices |
| 4 | Delays | Time between action and response | Reducing CI pipeline from 30min to 5min |
| 5 | Balancing feedback loops | Strength of corrective mechanisms | Adding circuit breakers, retry policies |
| 6 | Reinforcing feedback loops | Strength of growth mechanisms | Viral loops, network effects |
| 7 | Information flows | Who knows what, when | Adding real-time monitoring dashboards |
| 8 | Rules | Incentives, punishments, constraints | Changing deployment approval process |
| 9 | Goals | The purpose of the system | Shifting from feature velocity to reliability |
| 10 | Paradigm | The mindset out of which the system arises | Moving from "move fast and break things" to "sustainable engineering" |
| 11 | Transcending paradigms | Ability to choose any paradigm | Recognizing no single architecture pattern is universally correct |

**Rule:** Most engineering effort targets leverage points 1–3. The highest-leverage changes target points 7–11 but are hardest to execute.

```
LP 1: Adjust gateway timeout from 30s to 5s (reduces retry pile-up)
LP 5: Add circuit breaker for payment gateway (stops R1 loop)
LP 7: Real-time inventory visibility in cart (reduces oversell, informs user)
LP 8: Change fulfillment SLA from best-effort to guaranteed (changes queue behavior)
LP 9: Shift team goal from "order volume" to "successful order rate" (paradigm-level change)
```

#### Step B6: Predict Second-Order Effects

For every intervention, trace effects through at least three orders:

```
First order:   What directly changes?
Second order:  What does that change affect in neighboring elements?
Third order:   What feedback loops activate?
Delayed:       What appears after the delay period?
Counterintuitive: What moves in the opposite direction from intended?
```

```
Intervention: Add circuit breaker for payment gateway
1st order: Payment attempts stop when gateway is degraded
2nd order: Cart abandonment rate drops (users don't see timeout errors)
2nd order: Payment success rate improves (only healthy gateways used)
3rd order: Inventory reservation timeouts decrease (reservations released faster)
3rd order: Fraud detection system gets fewer false positives (less pressure to review)
Delayed: Engineering team investigates gateway degradation patterns (data-driven reliability work)
```

### P2.3 — Track C: Synthesis — When to Use Each Track

| Situation | Primary Track | Secondary Track | Rationale |
|-----------|--------------|-----------------|-----------|
| Unknown root cause of failure | First Principles | Systems Thinking | Decompose to find elemental failure, then model systemic effects |
| Degrading system behavior | Systems Thinking | First Principles | Map feedback loops first, then decompose critical components |
| Technology choice decision | First Principles | Systems Thinking | Decompose requirements to fundamentals, then model ecosystem effects |
| Architecture evaluation | Systems Thinking | First Principles | Map system dynamics, then decompose assumptions about each component |
| Performance optimization | First Principles | Systems Thinking | Decompose latency budget, then model systemic load effects |
| Organizational or process issue | Systems Thinking | First Principles | Map feedback loops and delays, then decompose root assumptions |
| New feature design | First Principles | Systems Thinking | Decompose user needs, then model system integration effects |
| Incident postmortem | Both (alternating) | — | Decompose the sequence of events, map the feedback loops that enabled it |

**Synthesis pattern — decompose then integrate:**
1. Decompose the problem using first principles (Track A) — get irreducible truths
2. Map the system using systems thinking (Track B) — get the interaction structure
3. Cross-reference: Do the irreducible truths from step 1 change the system model from step 2? Do the system dynamics from step 2 reveal hidden assumptions from step 1?
4. Apply leverage analysis to the decomposed truths — which truth, if changed, would have the highest system-level impact?
5. Verify: Run the proposed changes through inverse testing (first principles) and second-order effects tracing (systems thinking)


## P4 — WORKED EXAMPLES

### E1: API Response Time Optimization

**Problem:** "API takes 3 seconds to return user profiles."

**Track A — First Principles Decomposition:**

Decompose the latency into irreducible elements:

- HTTP request reaches load balancer (2ms)
- Load balancer routes to server (1ms)
- JWT validation middleware (5ms)
- Rate limit check (1ms)
- Route handler called (0ms)
- User query: SELECT from users table (50ms)
- Posts subquery: SELECT posts WHERE user_id (800ms — missing index)
- Serialize response (3ms)
- Total: ~862ms on server. Remaining ~2s is network latency.

**Truth:** 800ms of the server time is a sequential scan due to missing index. 2s is cross-continental latency.

**Constraint vs Convention analysis:**

| Element | Type | Classification | Verification |
|---------|------|---------------|--------------|
| Cross-continental latency | C | Physical constraint (speed of light) | Cannot move server |
| DB scan of posts table | C | Must read data from disk | Need the data |
| Missing index on posts.user_id | V | Convention — index was not created | Add the index |
| JWT validation | C | Security constraint | Cannot skip |
| JSON serialization | V | Could use binary or streaming | Low cost, low benefit |

**Inverse test:** "What if we removed the posts query entirely?" → Profile page shows user info only, posts load separately. If acceptable, eliminates 800ms entirely. Otherwise, index fix solves it.

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: API server, database, CDN
- Outside: Client browsers, DNS, internet backbone, third-party auth provider
- Boundary interactions: HTTP request/response, DNS resolution

**Feedback loops:**

```
Loop R1 (TIMEOUT CASCADE):
Latency ↑ → client retries → load ↑ → latency ↑ → more retries
Mitigation: Already mitigated by client timeout at 5s

Loop B1 (LOAD ADAPTATION):
Latency ↑ → user frustration → user leaves → load ↓ → latency ↓
Note: This is negative — the system is losing users
```

**Leverage point analysis:**

| Intervention | LP | Impact | Effort |
|-------------|-----|--------|--------|
| Add index on posts.user_id | 1 (parameter) | Removes 800ms | 1 hour |
| Add CDN edge caching | 2 (buffer) | Removes ~2s for cache hits | 1 week |
| Move server closer to users | 3 (structure) | Removes 2s | Months/org change |
| Add cache invalidation webhook | 5 (balancing) | Ensures cache freshness | 2 days |
| Reduce JWT validation scope | 1 (parameter) | Marginal gain | 1 day |

**Second-order effects of adding CDN caching:**

```
1st: Cache hits serve in ~50ms
2nd: Cache misses still take 3s — inconsistency frustrates users
2nd: Cache invalidation complexity increases
3rd: Stale profile data causes user complaints
Delayed: Team adds invalidation webhook → complexity shifts to invalidation logic
Mitigation: Add TTL-based invalidation + webhook-based purge
```

**Causal reduction of the missing index:**

```
Property: posts.user_id is not indexed
Original reason: "Schema was created before posts query was part of profile"
Current context: Posts query IS part of profile, at 800ms
Conclusion: Simply add the index. No deeper structural issue.
```

**Rebuilt solution:**
1. Add index on posts.user_id (800ms → 5ms for that query, total server time ~70ms)
2. Add CDN edge caching for profile responses (eliminates 2s network latency for cache hits)
3. Set cache TTL to 60s with webhook-based invalidation

**Expected result:** 3000ms → ~70ms (server) / ~50ms (CDN cache hit)


### E3: Microservice Cascade Failure

**Context:** Service A calls Service B calls Service C. Service C has a slow query (5s instead of 50ms).

**System map:**
- A → B (HTTP, 100 req/s, 200ms timeout)
- B → C (HTTP, 100 req/s, 2s timeout)
- C → database (50ms normal, 5s degraded)

**Track A — First Principles Decomposition:**

**Irreducible truths:**
- A depends on B's response within 200ms
- B depends on C's response within 2s
- C's database query takes 5s (degraded) or 50ms (normal)
- HTTP connections are a finite resource per process
- Each retry creates a new HTTP connection and request
- B's connection pool is limited to 50 connections

**Constraint vs Convention analysis:**

| Element | Type | Classification |
|---------|------|---------------|
| A→B timeout at 200ms | V | Team chose this value |
| B→C timeout at 2s | V | Team chose this value |
| B retries 3 times | V | Team chose this retry count |
| Connection pool at 50 | V | Configuration choice |
| C query takes 5s degraded | C | Database performance (but query can be optimized) |
| HTTP as transport | V | Could use gRPC or async messaging |

**Track B — Systems Thinking Analysis:**

**Causal loop diagram:**

```
A → B → C → DB
B→C timeout at 2s, C takes 5s → every B→C call times out
B retries 3× → 300 req/s to C → C gets slower

Loop R1 (RETRY CASCADE):
Retries → more load on C → C gets slower → more timeouts → more retries
  Break: Reduce retry count to 0 or 1. Add exponential backoff.

Loop R2 (CONNECTION EXHAUSTION):
B has 50 connections → 50 connections held waiting for C
→ B cannot serve A → A retries → 300 req/s to B → B connection pool exhausted
  Break: Reduce B→C timeout. Add circuit breaker.

Loop B1 (BACKPRESSURE):
A retries → B overloaded → A's timeout expires → A gets errors → A stops sending
→ B recovers → A resumes
  Note: This is reactive — system is already degraded.
```

**Feedback loop analysis with delays:**

```
Loop R1 delay: Each retry adds 2s (the timeout). After 3 retries, 6s have passed.
  During 6s, the connection pool is fully occupied. No other requests can be served.

Delay analysis:
- R1 period: 2s per retry × 3 = 6s before connection release
- During 6s with 50 connections: each connection handles 1 request per 6s = ~8 req/s throughput
- At 100 req/s incoming: queue builds at 92 req/s → queue grows without bound
```

**Leverage analysis:**

| Intervention | LP | Effect | Effort |
|-------------|-----|--------|--------|
| Reduce B→C timeout to 500ms | 1 (parameter) | Fails fast, doesn't accumulate | Config change |
| Reduce retry count to 1 | 1 (parameter) | Halves the retry load | Config change |
| Circuit breaker B→C | 5 (balancing) | Stops cascade entirely | 1-2 days dev |
| Latency monitoring on B→C | 7 (information) | Detect degradation early | 1 day |
| Add timeout to DB query | 1 (parameter) | Prevents 5s query from running | Query change |

**Second-order effects of circuit breaker:**

```
1st: Circuit breaker opens → B returns errors to A
2nd: A shows "service unavailable" to users → support calls increase
2nd: B remains healthy for other clients (no connection pool exhaustion)
3rd: Ops team investigates C → C query gets indexed → circuit closes
3rd: User-facing errors are limited to the circuit open window (~30s)
Delayed: Engineering adds circuit breaker to all inter-service calls
Counterintuitive: Adding circuit breaker initially increases errors (explicit failures vs silent timeouts),
  but total system availability improves because failures are fast and contained.
```

**Rebuilt solution:**
1. Add circuit breaker to B→C (opens after 5 failures, half-open after 30s)
2. Reduce B→C timeout to 500ms (fails fast)
3. Reduce retry count from 3 to 1
4. Add latency monitoring on B→C with paging at 2× baseline
5. Optimize C's query (add index, reduce from 5s to 50ms)

**Result:** Circuit breaker at B→C prevents the cascade. B remains healthy for other clients. C gets fixed without affecting the rest of the system.


### E5: Team Productivity Decline

**Context:** Team velocity has dropped 40% over 6 months. No single change explains it.

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: Development team, codebase, CI/CD pipeline, issue tracker
- Outside: Management, stakeholders, users, market conditions
- Boundary interactions: Sprint goals, feature requests, bug reports, deploy artifacts

**Variables:**
- Story points delivered (flow), bugs found (flow), bug fix rate (flow)
- Test coverage (stock), technical debt (stock), team knowledge (stock)
- Onboarding time (delay), code review time (delay), deploy time (delay)

**Feedback loops:**

```
Loop R1 (DEBT SPIRAL):
More bugs → more bug fixes → less feature work → more corners cut → more bugs
Break: Automated quality gates preventing regression

Loop R2 (REFACTORING NEGLECT):
Less refactoring → more technical debt → slower feature delivery → more pressure to skip refactoring
Break: Dedicated refactoring time (20% rule) protected from feature pressure

Loop B1 (TEST QUALITY):
Test coverage ↑ → fewer regression bugs → more time for features → more tests written
Strengthen: Add test coverage as a quality gate

Loop B2 (DEADLINE PRESSURE):
Deadlines approach → skip code review → more bugs → lower quality → slower later
Break: Make code review mandatory regardless of deadline
```

**Archetype match:** "Drift to low performance" — standards erode slowly as short-term pressure trumps long-term quality.

**Stock and flow analysis:**

```
Stock: Technical debt (estimated hours to fix known issues)
Inflow: Debt introduction rate (hours of shortcuts per sprint)
Outflow: Refactor rate (hours of intentional refactoring per sprint)
Current state: Inflow (40 hrs/sprint) >> Outflow (5 hrs/sprint) → debt growing at 35 hrs/sprint
Delay: Impact of debt on velocity takes 3-4 sprints to materialize

Stock: Team knowledge
Inflow: Learning rate (tech talks, pair programming, documentation)
Outflow: Forgetting rate (turnover, context switching, poor documentation)
Current state: Recent turnover (2 of 8 members) → outflow increased → knowledge stock declining
```

**Leverage analysis:**

| Intervention | LP | Impact | Delay to Result |
|-------------|-----|--------|-----------------|
| Automated quality gates | 5 (balancing) | Blocks R1 (debt spiral) | 1 sprint to implement |
| 20% refactoring time | 8 (rule) | Increases outflow on debt | 2-3 sprints to see velocity improvement |
| Code health dashboard | 7 (information) | Makes debt visible | Immediate awareness |
| Shift goal from velocity to quality | 9 (paradigm) | Changes what gets optimized | 1-2 quarters for full effect |
| Reduce WIP limit | 8 (rule) | Decreases context switching | 1 sprint |
| Pair programming on complex features | 1 (parameter) | Increases knowledge transfer | 2-3 sprints |

**Track A — First Principles Decomposition:**

**Causal reduction of the productivity drop:**

```
Property: "Team velocity dropped 40%"
Causal trace:
→ More bugs reaching production → hotfixes consume sprint capacity
→ Why? Code review quality declined → reviews take longer → reviewers approve without deep review
→ Why? Reviewers have less time → sprint commitments increased
→ Why? Management set higher story point targets based on previous velocity

Root cause: The system was optimized for velocity, not quality. The measurement loop
(velocity → targets → pressure → shortcuts → bugs → lower velocity) is a classic
"fixes that fail" archetype driven by measuring the wrong thing.
```

**Minimum Actionable Truths:**

```
MAT-1: "Code review quality declined"
  Verify: Compare review comments per PR from 6 months ago vs now. Measurable.

MAT-2: "Bug rate increased"
  Verify: Compare production bug count per sprint from 6 months ago vs now. Measurable.

MAT-3: "Sprint commitments increased"
  Verify: Compare planned vs actual story points. Measurable.
```

**Second-order effects of quality-focused intervention:**

```
1st: Feature velocity drops further (initially) as team invests in quality
2nd: Management concern about slower delivery
2nd: Bug rate drops after 4-6 weeks
3rd: Velocity recovers as less time is spent on hotfixes
3rd: Team morale improves (fewer firefights, more predictable work)
Delayed: Code review quality improves as reviewers have more time per PR
Counterintuitive: Slowing down to focus on quality initially reduces velocity further,
  making the intervention appear to fail before it succeeds. The delay between
  quality investment and velocity return is 4-6 weeks. Without understanding this
  delay, the intervention is abandoned prematurely.
```

**Rebuilt approach:**
1. Add automated quality gates (test coverage floor, lint, type checking) — LP 5, blocks R1
2. Implement 20% refactoring time policy — LP 8, increases debt outflow
3. Change sprint goal from "story points" to "quality metrics + delivered value" — LP 9, paradigm shift
4. Reduce WIP limit from 3 to 2 items per developer — LP 1, reduces context switching
5. Add code health dashboard — LP 7, makes invisible problems visible


### E7: REST vs gRPC Decision

**Problem:** "Should we use REST or gRPC for our new microservice?"

**Track A — First Principles Decomposition:**

**Irreducible truths:**
- Service A calls Service B to get user data
- Request: user_id (integer, 8 bytes)
- Response: user name, email, avatar URL (~300 bytes)
- Call frequency: 1000 req/s average, 5000 peak
- Latency requirement: < 50ms P99
- HTTP/1.1 is text-based; HTTP/2 is binary and multiplexed
- gRPC uses protocol buffers (binary, schema-enforced)
- Both can run on TCP
- gRPC requires code generation from .proto files
- REST is human-readable and debuggable with curl

**Constraint vs Convention analysis:**

| Element | Type | Classification |
|---------|------|---------------|
| 5000 req/s peak | C | Traffic requirement |
| 50ms P99 latency | C | SLA requirement |
| 8-byte request, 300-byte response | C | Data volume requirement |
| HTTP transport | V | Convention — could use TCP directly |
| Schema enforcement | V | Convention — both can have schemas |
| Code generation | V | Convention — gRPC requires it, REST optional |
| Human readability | V | Convention — useful for debugging |

**Inverse test:** "What if latency requirement was < 1ms instead of 50ms?"

```
gRPC's advantages (binary, header compression, streaming) become significant
at sub-millisecond latencies where HTTP/1.1 overhead dominates.
At 50ms requirement: HTTP overhead is ~1-5ms, which is 2-10% of budget.
At 1ms requirement: HTTP overhead is 100-500% of budget.
Conclusion: At current requirements, REST is sufficient. gRPC only materializes at lower latency targets.
```

**Minimum Actionable Truths:**

```
MAT-1: "Latency requirement is 50ms P99"
  → If requirement were tighter, REST might not suffice

MAT-2: "Payload is 300 bytes"
  → If payload were 10MB, binary encoding would matter more

MAT-3: "Call pattern is request-response"
  → If streaming were needed, gRPC's native streaming would be advantageous

MAT-4: "Team knows HTTP/1.1 and REST"
  → If team already knows protobuf, gRPC cost drops
```

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: Service A, Service B, HTTP infrastructure, load balancer
- Outside: Developers debugging, code generators, CI/CD pipeline, monitoring
- Boundary interactions: API calls, log entries, debugging sessions

**Feedback loops:**

```
Loop R1 (COMPLEXITY SPIRAL WITH gRPC):
gRPC adopted → proto files need versioning → proto changes require coordination
→ service updates require proto regeneration → build complexity increases
→ more CI pipeline for proto generation → longer feedback loops → more pressure to skip proto updates
→ contract drift → runtime errors → debugging harder (binary, not human-readable)

Loop B1 (TESTING EASE WITH REST):
REST used → HTTP calls debuggable with curl → integration tests easy to write
→ test coverage increases → confidence grows → more APIs built with REST
→ consistency across services → monitoring and alerting standard
```

**Stock and flow:**

```
Stock: Team familiarity with chosen protocol
Inflow: Learning rate (builds over time with usage)
Outflow: Forgetting rate (context switching between protocols)
If gRPC is chosen: initial learning investment, slower feature delivery for 2-3 months
If REST is chosen: immediate productivity, no learning curve

Stock: API surface complexity
Inflow: New endpoints added per sprint
Outflow: Deprecated endpoints removed
gRPC adds: proto generation, versioning, backward compatibility enforcement
REST adds: documentation maintenance, manual contract checking
```

**Leverage analysis:**

| Intervention | LP | Rationale |
|-------------|-----|-----------|
| REST with HTTP/2 | 1 (parameter) | Enables multiplexing, header compression, no protocol change |
| REST with OpenAPI schema | 5 (balancing) | Schema enforcement without protobuf complexity |
| gRPC for specific high-throughput paths | 3 (structure) | Hybrid — use gRPC only where it matters |
| Team skill investment in protobuf | 8 (rule) | If long-term gRPC is strategic, invest in learning |

**Second-order effects:**

```
REST choice:
1st: Faster initial development
2nd: Human-readable debugging reduces debug time
2nd: OpenAPI provides machine-readable contract
3rd: Lower build complexity, faster CI
3rd: Standard tooling (Postman, curl, Swagger) works immediately
Delayed: Potential performance limits at much higher scale (but not at current scale)

gRPC choice:
1st: Slower initial development (proto setup, code gen)
2nd: Smaller payloads, faster serialization
2nd: Compile-time contract checking
3rd: Build pipeline complexity increases
3rd: Debugging is harder (binary, need special tools)
Delayed: Team becomes proficient in protobuf → gRPC becomes easier over time
```

**Rebuilt assessment:**
- REST with HTTP/2 + compression: request ~150 bytes, response ~350 bytes
- gRPC: request ~12 bytes, response ~320 bytes (header compression)
- Wire savings: negligible at 300-byte payloads
- HTTP/2 multiplexing benefit: same for both
- Build complexity: REST wins (no proto compilation)
- Debugging: REST wins (curl, browser, standard tools)
- Schema enforcement: both support it (OpenAPI vs protobuf)

**Decision:** REST with HTTP/2 + OpenAPI schema. gRPC benefit materializes at sub-millisecond latency requirements or streaming use cases. Re-evaluate if requirements change.


## P5 — ANTI-PATTERNS

### First Principles Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Reasoning from analogy | "Twitter uses X so we should too" | Decompose their problem and yours — they differ in at least one dimension |
| Mystifying precedent | "This is how it's always been" is not an argument | Challenge every inherited decision — find the original justification |
| False constraint | Treating convention as constraint | Verify: would the system fail if this changed? If no, it's a convention |
| Infinite decomposition | Breaking down past the point of action | Stop when components are domain primitives or physics-defined |
| Selective decomposition | Applying first principles to others' work but not your own | Audit your own assumptions first |
| Analysis paralysis | Decomposing without rebuilding | Recomposition is the goal — set a timebox for decomposition |
| Authority dependence | "The architect said so" as truth | Architect opinions are hypotheses — test them |
| Gold-plating truths | Proving things that don't matter for the decision | Only decompose what changes the outcome (P3.4 — MAT) |
| Skipping problem definition | Jumping to solution without stating the problem in its own terms | Write the problem sentence without referencing any solution |
| Cherry-picking facts | Decomposing only what supports your preferred solution | Decompose the entire problem, including parts that threaten your assumptions |
| Physics denial | Treating a physical limit as negotiable | If it violates a constraint, it will fail — find a different approach |
| Cost blindness | Rebuilding from scratch for marginal benefit | Rebuild cost must be justified against the truth gap in the current solution |
| Knowledge-type confusion | Treating assumed knowledge as fundamental | Tag every claim. Untagged = assumed. Verify before building. |
| Decomposition theater | Going through the motions without changing any assumptions | If decomposition produces the same solution as the original approach, you didn't decompose enough |
| Truth hoarding | Collecting truths but never recomposing into a solution | Set a hard time limit on decomposition. Recompose by the deadline. |

### Systems Thinking Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Component thinking | Optimizing a part without understanding the whole | Map the system first, then find the leverage point |
| Ignoring delays | Expecting immediate results from system changes | Model delays explicitly — account for time lags |
| Single-loop solution | Breaking one feedback loop without checking others | All loops affect each other — trace second-order effects |
| Fixing symptoms | Treating the output variable instead of the flow structure | Change the flow rates or the structure, not the stock value |
| Blaming individuals | "The team is slow" — ignoring system structure | "What feedback loops cause the team to be slow?" |
| Overconfidence in linearity | Assuming a small change produces a small effect | In systems, small changes at leverage points produce large effects |
| Boundary confusion | Solving a problem whose cause is outside the system boundary | Expand the boundary until the root cause is inside |
| Static analysis | Treating a snapshot as the system | Systems change over time — model the dynamics |
| Optimizing the irrelevant | Tuning parameters on the wrong structure | Start with structure and feedback loops before parameters |
| Action bias | Doing something because waiting is uncomfortable | Sometimes the best intervention is removing a bad feedback loop |
| Spherical cow modeling | Over-simplifying until the model is useless | Include enough variables to capture the dominant feedback loops |
| Loop blindness | Focusing on individual events instead of the feedback structures that produced them | Every event is the output of a feedback loop — trace the loop, not the event |
| Polarity neglect | Drawing causal links without verifying the direction of influence | Test every S/O link: does A↑ actually cause B↑? Measure. |
| Stock-flow confusion | Treating a flow as a stock or vice versa | Apply the stock test (accumulates?) and flow test (has a rate?) |
| Map-territory error | Treating the causal loop diagram as reality | The model is a simplification. Test its predictions against real system behavior. |

### Synthesis Anti-Patterns (Unique to Combined Approach)

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Track isolation | Using only first principles OR only systems thinking | Both tracks are required. Decompose THEN integrate. Or map THEN decompose. |
| Decomposition without integration | Having a list of truths but no system model | After decomposition, map causal relationships between the truths |
| Modeling without decomposition | Having a feedback map built on unverified assumptions | Audit every variable in the CLD through first principles |
| Premature recomposition | Rebuilding the solution before understanding system dynamics | Run the decomposed solution through second-order effects tracing |
| Depth mismatch | Decomposing some parts too deeply while others stay at surface level | Use leverage point analysis to prioritize decomposition depth |
| Circular justification | Using system dynamics to justify an assumption that should be decomposed | "This loop exists because X" — decompose X. Don't assume it. |
| Over-indexing on leverage points | Chasing high-leverage interventions without understanding the fundamentals | A high-leverage change built on a false assumption will fail hard |
| False precision | Modeling feedback loops with numbers derived from assumed data | Use empirical data for rates, not guesses. Mark assumed values explicitly. |
| Track switching at wrong time | Decomposing when you should be integrating, or vice versa | If you have a list of disconnected facts → integrate (ST). If you have a model with unverified assumptions → decompose (FP). |
| Starving the other track | Spending 90% of time on one track | Allocate time to both tracks. The synthesis is where value emerges. |
| Solution anchoring | Decomposing or modeling to justify a pre-existing decision | State the decision after analysis, not before. |
| Analysis without action | Completing both tracks without a concrete intervention recommendation | Every foundational reasoning session must produce a specific, implementable change. |


## P7 — DEPLOYMENT NOTES

### Track Interaction Summary

```
┌──────────────┐         ┌──────────────┐
│ FIRST        │         │ SYSTEMS      │
│ PRINCIPLES   │◄───────►│ THINKER      │
│              │         │              │
│ Decompose    │         │ Map System   │
│ Analyze      │         │ Model Loops  │
│ Recompose    │         │ Find Leverage│
└──────┬───────┘         └──────┬───────┘
       │                        │
       └──────────┬─────────────┘
                  │
         ┌────────▼────────┐
         │   SYNTHESIS     │
         │                 │
         │ Decompose to    │
         │ irreducible     │
         │ truths, then    │
         │ model their     │
         │ interactions,   │
         │ find leverage   │
         │ at the system   │
         │ level.          │
         └─────────────────┘
```

### When to Trigger This Plugin

| Trigger | Primary Mode | Expected Output |
|---------|-------------|-----------------|
| Problem has unknown root cause | First Principles | Decomposed truth table |
| System behavior is degrading | Systems Thinking | CLD + leverage points |
| Technology choice is contested | First Principles | Constraint vs Convention analysis |
| Architecture needs evaluation | Both (alternating) | Decomposed system model with interventions |
| Performance needs optimization | First Principles | Decomposed latency budget |
| Process or team dynamics issue | Systems Thinking | Feedback loop map of team behavior |
| New feature with complex interactions | Both (parallel) | Decomposed requirements + system integration map |
| Incident postmortem | Both (alternating) | Truth table of events + loop map of failure mode |

### Common Mistakes

| Mistake | Track | Prevention |
|---------|-------|------------|
| Decomposing too far | FP | Stop at domain primitive or physics-defined limit |
| Not going far enough | FP | If a component still has hidden dependencies, decompose further |
| Missing a feedback loop | ST | Every causal chain must close. Open chains are not feedback loops. |
| Assuming polarity without verification | ST | Test each S/O link: does A↑ actually cause B↑? Measure. |
| Modeling without delays | ST | If there is a time lag, mark it explicitly. Unmarked delays cause incorrect predictions. |
| Forgetting the other track | Both | After finishing one track, switch to the other. The insight is in the synthesis. |

---

*Synarc S1 WorkType classification, S2 risk floors (CRITICAL for data/auth/payment — incorrect loop modeling or missed assumptions can cause CRITICAL outages), S13 quality gates, S14 language rules, S17 zero-tolerance violations apply. Ledger entry for every foundational reasoning analysis session.*
