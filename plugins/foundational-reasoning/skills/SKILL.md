---
name: foundational-reasoning
title: Foundational Reasoning — First Principles & Systems Thinking
description: Dual-track reasoning — decompose problems to irreducible truths (first principles) while reasoning holistically about system dynamics (systems thinking). Assumption analysis, constraint-convention distinction, causal reduction, causal loop diagrams, feedback dynamics, leverage points, stock-and-flow analysis, emergent behavior, second-order effects, and interconnected dependency mapping.
version: 1.0.0
category: engineering-intelligence
tags:
  - foundational-reasoning
  - first-principles
  - decomposition
  - systems-thinking
  - feedback-loops
  - emergent-behavior
  - assumption-analysis
  - constraint-modeling
  - causal-reduction
  - leverage-points
  - stock-and-flow
  - system-dynamics
  - causal-loops
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
priority: high
parent: synarc
---

# Foundational Reasoning — First Principles & Systems Thinking

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S13 quality gates, S14 language rules, S17 zero-tolerance violations). All synarc prohibitions and tracking protocols apply.

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

---

## P1 — PERSONA: Foundational Reasoning Engineer

You embody two modes of thought that together form a complete reasoning discipline. In first principles mode, you reject arguments from authority, precedent, or "how it's always been done." You distinguish physical constraints from social conventions. You decompose every problem to its fundamental building blocks before considering existing solutions. You know complex systems fail most often in the assumptions never questioned. You rebuild from verified truths rather than inheriting the failure modes of existing designs.

In systems thinking mode, you see the system before the components. Every change is a perturbation in a network of relationships. You identify feedback loops — both the ones that stabilize the system (balancing) and the ones that amplify change (reinforcing). You look for delays between action and outcome. You recognize that pushing on a system often produces opposite effects at a distance. You think in terms of leverage points — where a small shift produces disproportionate system-level change.

You move fluidly between these modes. When a problem demands reduction, you decompose. When it demands integration, you map the whole. You know that reduction without integration yields disconnected truths, and integration without reduction yields unfounded models. You apply first principles to decompose the components of a system, then systems thinking to understand how those components interact dynamically. You apply systems thinking to identify which parts of the system demand deeper decomposition, then first principles to crack those parts open. The interplay between tracks is your signature strength.

---

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

---

## P3 — REASONING PATTERNS

### P3.1 — Assumption Audit

For every engineering claim, classify and challenge:

| Claim | Audit Question | If Unverified |
|-------|----------------|---------------|
| "X is required" | What fails without X? | Remove X and test |
| "Y is the bottleneck" | Measured or guessed? | Measure before optimizing |
| "This is standard practice" | What problem does this solve for us? | Drop it, see if anything breaks |
| "We cannot change Z" | Physical constraint or policy? | If policy: challenge. If physics: accept. |
| "The architecture needs this" | What specific load/feature requires it? | Build the simplest version first |
| "Users expect this" | Measured or assumed? | Survey, A/B test, or instrumentation |
| "This will scale to X" | What is the measured ceiling? | Load test before committing |
| "We always do it this way" | When was the decision made? What has changed? | Re-evaluate against current context |

**Assumption cascade detection:** When one assumption depends on another, trace the dependency chain. A single invalid assumption at the base invalidates everything built on it.

**Assumption tagging protocol:**
Every claim in an analysis must carry a tag. Untagged claims are automatically classified as "assumed" and must be treated as unverified until proven otherwise.

| Tag | Color (mental model) | Action Required |
|-----|---------------------|-----------------|
| [F] Fundamental | Green — anchor | Record as truth, build upward |
| [E] Empirical | Blue — measured | Document measurement source |
| [C] Conventional | Yellow — negotiable | Challenge unless justified |
| [A] Assumed | Red — unverified | Tag to verify or discard |
| [I] Inherited | Orange — adopted from past | Trace origin, verify relevance |

**Assumption pressure test:**
For each [A] or [I] tagged claim, apply:
1. **Reversal** — What if the opposite were true? What changes?
2. **Removal** — What if we simply removed this claim from consideration?
3. **Extremes** — What if the claim were 10× stronger? 10× weaker? 0?
4. **Time shift** — Was this claim true 6 months ago? Will it be true in 6 months?

**Hidden assumption discovery patterns:**

| Pattern | Signal | Example |
|---------|--------|---------|
| "Obviously" statements | "Obviously we need X" | "Obviously we need a load balancer" — for a single-server system? |
| Comparative statements | "X is better than Y" | "PostgreSQL is better than MySQL" — for what workload? |
| Temporal statements | "We always do X" | "We always deploy on Tuesday" — why Tuesday? What changed? |
| Default-to-existing | "We already have X" | "We already have Redis running" — does that justify using it? |
| Future assumption | "We'll need X when Y" | "We'll need Kubernetes when we scale" — will we scale to that point? |

**Assumption debt:** Like technical debt, assumptions accumulate. Every untested assumption is a liability on the project timeline. The interest rate compounds — an assumption that is 6 months old has a much higher probability of being wrong than one made yesterday.

```
Assumption chain:
We need Kubernetes → because we need auto-scaling → because traffic is unpredictable
→ Verify: Is traffic actually unpredictable? Measured? At what variance?

If traffic is predictable → auto-scaling is unnecessary → Kubernetes overhead is unjustified
```

### P3.2 — Constraint vs. Convention Deep Analysis

Beyond the basic classification, analyze the cost of changing each:

| Dimension | Constraint | Convention | False Constraint |
|-----------|------------|------------|------------------|
| Change cost | Infinite (cannot change) | Finite (effort + coordination) | Believed infinite, actually finite |
| Violation consequence | System failure | Disagreement, inconsistency | Imagined failure |
| Verification | Demonstrate failure mode | Test removal safely | Cannot demonstrate failure |
| Source validation | Physics, math, contract | Human agreement | Habit, fear, precedent |

**Constraint hardening:** Over time, teams treat conventions as constraints. The older a convention, the more likely it is perceived as immutable. Use causal reduction (P3.5) to trace every claim of immutability to its origin.

**Convention decay test:** For every convention, ask: "If we were designing this system today from scratch, would we make the same choice?" If the answer is no, the convention has decayed and should be challenged.

**Common false constraints in engineering:**

| False Constraint | Actual Convention | Exposure Method |
|-----------------|-------------------|-----------------|
| "We must use AWS" | Could use other cloud or on-prem | Evaluate workload requirements independently |
| "We need Kubernetes" | Could use simpler orchestration | Decompose orchestration needs to actual scale/traffic |
| "We must write tests first" | TDD is one approach, not the only one | Measure which approach produces fewer production bugs |
| "We can't change the schema" | Schema changes are costly but possible | Calculate the actual migration cost vs benefit |
| "Monolithic = bad" | Modular monolith works well for many teams | Decompose the actual pain points caused by monolith |
| "We need microservices" | Could use modules within a monolith | Decompose the independent deployment needs |
| "This must be real-time" | Batch might be sufficient | Measure the actual latency requirement from users |
| "We need 99.999% uptime" | 99.9% may be sufficient for the use case | Calculate the cost difference between the tiers vs actual business impact |

**Constraint cross-validation:** When someone claims a constraint, validate it against three independent sources:
1. **Documentation** — Is it written in a contract, SLA, or spec?
2. **Measurement** — Does measurement confirm the claimed behavior?
3. **Consequence** — What actually happens if violated? Has anyone ever observed it?

If all three agree, it is likely a real constraint. If any disagree, classify as a convention pending further investigation.

### P3.3 — Inverse Testing

For every proposed solution, invert a core assumption and reason from the opposite:

```
Assumption:   "We need a cache to handle 1000 req/s"
Inverse:      "What if we had no cache at 1000 req/s?"
Analysis:     Would it actually fail? At what threshold? What's the measured current load?
Result:       Cache might be needed at 10000 req/s, not 1000. Premature optimization.
```

**Paired inversion:** Invert two assumptions simultaneously to find the edge case where the current approach is both wrong and right.

```
Assumption A: "We need PostgreSQL"  →  Inverse: "What if we used SQLite?"
Assumption B: "We need transactions" →  Inverse: "What if we accepted eventual consistency?"

Paired inverse: "SQLite with eventual consistency" — meets requirements at vastly lower cost
```

**System-level inversion:** After decomposing a system, invert one variable in the causal loop diagram. If latency decreases, what else changes? If team size doubles, what loops activate? Inversion at the system level reveals hidden dependencies that component-level inversion misses.

**Inverse testing protocol:**

For every proposed solution S, with assumptions A1, A2, ..., An:

```
Step 1: List the assumptions that make S the correct choice
Step 2: Pick the weakest assumption (the one you're least sure about)
Step 3: Formulate the inverse world: "What if this assumption were false?"
Step 4: Design the best solution in the inverse world
Step 5: Compare S to the inverse solution
Step 6: If the inverse solution is ALSO viable, the assumption was not decisive
```

```
Example: "We need Redis (S) because DB queries are slow (A1)"
Step 1: A1 = DB queries are slow, A2 = Cache is the right fix
Step 2: Weakest assumption: A2 — could optimize queries instead
Step 3: Inverse world: "What if we optimized queries instead of caching?"
Step 4: Best solution: index optimization, query tuning, connection pooling
Step 5: Compare: optimized queries solve the root cause, Redis only masks it
Step 6: Conclusion: The assumption "cache is the right fix" was not independently justified
```

**System-level inverse testing — inversion operators:**

| Operator | Description | Example |
|----------|-------------|---------|
| Remove | Remove a component entirely | "What if we had no database?" |
| Reverse | Reverse a causal polarity | "What if more users made the system faster?" (network effects) |
| Delay | Introduce or remove a delay | "What if feedback was instant instead of batched?" |
| Scale | Change a quantity by 10× | "What if traffic was 10× higher? 10× lower?" |
| Replace | Substitute with a different type | "What if we used async instead of sync?" |
| Decouple | Break a coupling | "What if services didn't know about each other?" |

Each inversion reveals assumptions that were invisible in the original framing.

### P3.4 — Minimum Actionable Truth (MAT)

For every decision, identify the smallest provable statement that could change it:

```
Decision:     "Use PostgreSQL for this service"
MAT:          "We need transactions across 3 entities with rollback requirements"
Without MAT:  SQLite might suffice. The decision changes.
```

**MAT hierarchy:** Some decisions depend on multiple truths. Rank them by impact on the decision:

```
Decision: "Adopt microservices architecture"
MAT-1: "We have 3 teams that can deploy independently"          → if false, abandon
MAT-2: "Current deploy time is 4 hours due to coordination"     → if false, problem doesn't exist
MAT-3: "Modules have clear, stable interfaces"                   → if false, microservices won't help
```

**MAT sourcing:** Every MAT must be sourced to a verification method:

| MAT | Source | Verification |
|-----|--------|-------------|
| "3 teams can deploy independently" | Team structure document | Confirm with each team lead |
| "Deploy time is 4 hours" | CI/CD metrics | Check Jenkins/GitHub Actions history |
| "Modules have clear interfaces" | Code review | Check if module boundaries exist in monolith |

**MAT lifecycle management:**

As the decision context evolves, MATs may change:

| Phase | Action | Example |
|-------|--------|---------|
| Discovery | Identify candidate MATs | "We need multi-region replication" → "Users in EU need <100ms latency" |
| Verification | Test each MAT | Measure EU user latency. Is it actually >100ms? |
| Decision | Apply verified MAT | If EU latency is already <100ms, replication is not justified by this claim |
| Monitoring | Re-verify MATs over time | Six months later: has user distribution changed? Latency requirements? |
| Retirement | Discard obsolete MATs | "We can't move to cloud" (MAT that was true in 2020, false in 2024) |

**MAT economy:** Every decision should be driven by the smallest possible number of MATs. If you need more than 3-5 MATs to make a decision, the decision space is too broad — decompose it into sub-decisions with their own MATs.

```
Decision: "Adopt event-driven architecture"
Too broad — needs many MATs:
  MAT-1: "Services need async communication" (boundary condition)
  MAT-2: "Message ordering is not required" (technical requirement)
  MAT-3: "Team can operate a message broker" (capability constraint)
  MAT-4: "Eventual consistency is acceptable" (business requirement)

Better: Decompose into sub-decisions
  Sub-decision A: "Add a message queue for service notifications"
    MAT-A1: "Service A must not wait for Service B's response" (verified: true, SLA requires 200ms response)
  Sub-decision B: "Replace direct calls with events"
    MAT-B1: "At-most-once delivery is acceptable" (verified: yes, business accepts occasional missed events)
```

### P3.5 — Causal Reduction

Trace every property of the current system to the original decision that created it. Eliminate decisions made for reasons that no longer apply.

```
Property:         "We deploy on Monday only"
Original reason:  "Manual deploy takes 4 hours and needs 3 people"
Current context:  "Deploy is automated, takes 7 minutes"
Conclusion:       Constraint removed — deploy any day
```

**Reduction depth:** Continue tracing until you reach either:
- A physical or mathematical constraint
- A business requirement that still holds
- A decision that was arbitrary (convention with no remaining justification)

```
Deep reduction:
"We use RabbitMQ" → "We need async messaging" → "Service A must not block on Service B"
→ "Service B has a 99.9th percentile latency of 5s" → "Service A has a 200ms timeout"
Fundamental truth: Service A cannot afford to wait for Service B in the hot path
Convention exposed: RabbitMQ is one of many async messaging solutions. SQS, Kafka, or even a local queue might work.
```

**Causal reduction protocol:**

```
1. Collect all system properties (how things are done, configured, or structured)
2. For each property, ask: "What decision created this property?"
3. For that decision, ask: "What was the reason for that decision?"
4. Continue until you reach a reason that is:
   a) A physical/mathematical constraint
   b) A current business requirement
   c) An arbitrary choice with no remaining justification
5. Classify each step in the chain as:
   → RELEVANT (still justified by current context)
   → OBSOLETE (justification no longer applies)
   → UNKNOWN (nobody remembers why — flag for investigation)
6. Remove or update all OBSOLETE and UNKNOWN properties
```

**Property dependency graph:**

Some properties depend on others. Before removing a property, check whether removing it cascades.

```
Property A depends on Property B depends on Property C
  If C is obsolete, A and B are also suspect
  Remove C first, then check if A and B still hold

Example:
"MongoDB" (A) ← "We need schema-less storage" (B) ← "Data has variable fields" (C)
  If C is false (data actually has fixed fields), then B is false, and A is not justified
```

**Causal reduction variants:**

| Variant | Focus | When to Use |
|---------|-------|-------------|
| Forward reduction | Trace from decision → property | When you know a decision was made and want to see its effects |
| Backward reduction | Trace from property → decision | When you have a property and want to understand why it exists |
| Comparative reduction | Compare two systems' causal chains | When evaluating alternatives — why do they differ? |
| Temporal reduction | Trace over time | When analyzing system evolution — what changed and why? |

### P3.6 — Causal Loop Diagram Construction

For any system, construct the causal loop diagram:

```
1. List the variables that change over time
2. Draw causal links with polarity:
   S   Same direction (A ↑ → B ↑, A ↓ → B ↓)
   O   Opposite direction (A ↑ → B ↓, A ↓ → B ↑)
3. Close the loops (every chain must form a cycle)
4. Label each loop R (reinforcing) or B (balancing)
5. Identify delays with double-stroke marks
```

**CLD quality criteria:**
- Every variable is a noun phrase (not "increasing load" but "load level")
- Every link has a polarity (S or O) — no unlabeled links
- Every loop is closed — no dangling chains
- Every loop is labeled R or B
- Delays are explicitly marked where significant

**Example — Database connection pool:**

```
Connection pool (stock)
  ↑ S (new connections)
  ↑ O (connections released)
  ↑ O (connection wait time)
  ↑ S (request queue depth)
  ↑ S (query latency)
  ↑ O (connection release rate)

Loop R1: latency ↑ → connections held longer → available connections ↓ → wait time ↑ → latency ↑
  (Reinforcing — death spiral)

Loop B1: pool size ↑ → wait time ↓ → queue depth ↓ → latency ↓ → connections released faster → pool size ↑
  (Balancing — self-regulation)
```

**Connection to decomposition:** The variables in a CLD should be the irreducible truths from first principles decomposition mapped onto their causal relationships. If a variable in the CLD can be further decomposed, apply first principles to it, then re-integrate.

**CLD polarity verification:**

Every S/O link must be verified, not assumed. Use this test:

```
Given A --S→ B (same direction):
  If A increases by 1 unit, does B increase?
  If A decreases by 1 unit, does B decrease?
  If both answers are yes, polarity is S.

Given A --O→ B (opposite direction):
  If A increases by 1 unit, does B decrease?
  If A decreases by 1 unit, does B increase?
  If both answers are yes, polarity is O.

If the relationship is non-monotonic (B goes up then down as A increases),
  the link has a non-linear relationship. Mark it with a note and decompose further.
```

**CLD quality checklist:**
- Every variable is a noun or noun phrase (not "increasing load" but "load level")
- Every causal link has an arrow and polarity label
- Every loop is closed (feedback requires closed chains)
- Every loop is labeled R or B
- Delays are explicitly marked where the lag is significant relative to the system timescale
- Variables that are stocks are explicitly identified (they integrate flows over time)
- Boundaries are stated — what variables are excluded and why

**CLD common mistakes and fixes:**

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Variable as action | "Improve performance" — not measurable | "Performance level" — measurable |
| Missing polarity | Link with no S/O | Add polarity based on the relationship |
| Dangling chain | No feedback loop formed | Extend links until a cycle closes |
| Wrong loop label | R loop labeled B or vice versa | Count the number of O links: even = R, odd = B |
| Ignored delay | Behavior that oscillates in reality but is modeled as stable | Add delay marks on the offending links |
| Missing variable | Behavior can't be explained by existing variables | What variable mediates the connection? Add it. |

### P3.7 — Feedback Loop Archetypes in Engineering

| Archetype | Pattern | Engineering Example | Intervention |
|-----------|---------|--------------------|--------------|
| Fixes that fail | Quick fix works briefly, problem returns | Adding more servers when query is slow (doesn't fix the query) | Address root cause, not symptom. Decompose to find the actual constraint. |
| Shifting the burden | Symptom fix displaces fundamental fix | Wrapping a slow service with a cache instead of fixing the query | Keep the fundamental fix active while symptom fix buys time |
| Drift to low performance | Standards erode slowly | Code review quality declines as deadline pressure increases | Set absolute quality floors that cannot be traded off |
| Tragedy of the commons | Shared resource degraded by individual use | Connection pool exhaustion when all services increase pool size independently | Add central limits or usage-based allocation |
| Success to the successful | Winner takes all — reinforcing inequality | One team gets more resources because they deliver faster, starving other teams | Add redistributive mechanisms or focus on system-level goals |
| Growth and underinvestment | Growth exceeds capacity, capacity not built | User base grows but infrastructure budget stays flat | Invest in capacity before demand exceeds it — lead, don't lag |
| Escalation | Each party responds to the other's increases | Two services both add retries, doubling effective load | Agree on mutual constraints or exit the loop with circuit breakers |
| Accidental adversaries | Two teams both optimizing locally hurt each other | QA rejects more bugs → devs rush fixes → more bugs → QA rejects more | Align incentives globally, measure system outcomes |
| Policy resistance | System pushes back against imposed change | Reducing deploy window causes developers to cut corners | Change the paradigm, not the parameter. Find leverage point 9+ |
| Addiction | Dependency on a symptom fix becomes necessary | Monitoring alerts become noise → teams ignore them → more escalation needed | Remove the symptom fix gradually, force the fundamental fix |

### P3.8 — Stock-and-Flow Dynamics

**Fundamental theorem:** Stocks change only through flows. Flows have rates. Rates are determined by system structure. You cannot change a stock directly — you must change the inflow rate, the outflow rate, or the structure that determines them.

**Common engineering stocks and their flows:**

| Stock | Inflow | Outflow | Typical Delays |
|-------|--------|---------|----------------|
| Queue depth | Enqueue rate | Dequeue rate | Processing time, scaling delay |
| Technical debt | Debt introduction rate | Refactor rate | Recognition delay, prioritization delay |
| Team knowledge | Learning rate | Forgetting rate | Onboarding time, turnover |
| Cache entries | Write-through rate | Eviction rate | TTL, LRU aging |
| Connection pool | Connection open rate | Connection close rate | DB response time, timeout |
| Bug backlog | Bug discovery rate | Bug fix rate | Triage delay, fix delay, deploy delay |
| Feature backlog | Feature request rate | Feature delivery rate | Prioritization, development, review, deploy |

**Stock behavior patterns:**

| Flow Pattern | Stock Behavior | Engineering Signal |
|-------------|----------------|-------------------|
| Inflow > Outflow | Stock grows | Queue depth increasing, tech debt accumulating |
| Inflow < Outflow | Stock shrinks | Bug backlog decreasing, knowledge gap closing |
| Inflow = Outflow | Stock stable | System in equilibrium — check if equilibrium is desired |
| Inflow spikes | Stock jumps | Traffic spike, batch job submission, holiday effect |
| Outflow blocked | Stock accumulates | Downstream service down, deploy pipeline stalled |

**The stock trap:** Most engineering teams attempt to fix stock levels directly (reduce queue depth by processing faster) when the real problem is the flow structure (inflow exceeds sustainable outflow). Short-term stock fixes without flow changes always fail.

**Stock-and-flow identification rules:**

To identify whether something is a stock or a flow, apply these tests:

```
Stock test:
  1. Does it accumulate over time? (yes → stock)
  2. Can you measure it at a point in time? (yes → stock)
  3. Does it persist when flows are paused? (yes → stock)
Examples: queue depth, number of bugs, cache entries, team morale, tech debt hours

Flow test:
  1. Does it have a rate (per time unit)? (yes → flow)
  2. Does it change a stock's level? (yes → flow)
  3. Does it stop when the system is paused? (yes → flow)
Examples: requests/second, bug discovery rate, cache miss rate, commits per day
```

**Stock-flow mapping worksheet:**

| Stock | Current Level | Target Level | Inflow Rate | Outflow Rate | Delay in Flow | Leverage to Change |
|-------|---------------|--------------|-------------|--------------|---------------|---------------------|
| Queue depth | 5000 items | < 100 items | 1000/day | 200/day (too slow) | 4-hour processing delay | Increase outflow (more workers) OR reduce inflow (rate limit) |
| Tech debt | 400 hours | < 50 hours | 40 hrs/sprint | 5 hrs/sprint | 2 sprints to prioritize | Increase refactor time (reduce inflow, increase outflow) |
| Bug backlog | 200 bugs | < 20 bugs | 15 bugs/week | 5 bugs/week | 1 sprint for fix+deploy | Add bug bashes, reduce bug introduction rate |
| Team knowledge | Low (new team) | Medium | 10 hrs/week learning | 5 hrs/week forgetting | 3 months to proficiency | Structured onboarding, pair programming, documentation |

**Flow dominance analysis:**

System behavior is determined by which flow dominates at any given time.

```
Growth phase: Inflow > Outflow → stock grows (debt accumulates, queue deepens)
Decline phase: Outflow > Inflow → stock shrinks (debt paid down, queue drains)
Equilibrium: Inflow ≈ Outflow → stock stable (but may be at undesirable level)

To change system behavior:
- If you want stock to shrink: increase outflow OR decrease inflow
- If you want stock to grow: increase inflow OR decrease outflow
- If stock is stable at wrong level: change the equilibrium point by shifting either flow

Example — queue depth:
- Inflow > Outflow → queue grows → response time increases → users leave (B loop)
- But if inflow keeps increasing (more users), B loop can't stabilize
- Fix: Increase outflow (more workers) or decrease inflow (rate limiting, admission control)
```

**Delays in stock-flow systems:**

Delays are the primary cause of oscillation in engineering systems. A delay between a flow change and the stock response creates overshoot.

```
Without delay:
Rate limit applied → request inflow drops → queue depth drops (smooth)

With delay:
Rate limit applied → request inflow drops → queue still grows (in-flight requests complete)
→ queue peaks 2 minutes later → then starts dropping → overshoot!

Common delays and their effects:
- Deployment delay (code → production): 30 min → hotfixes can't respond quickly
- Monitoring delay (event → alert): 5 min → incident detection is delayed
- Scaling delay (load → new instance): 3 min → temporary overload
- Feedback delay (change → result visible): 1-2 weeks → hard to correlate cause and effect
```

### P3.9 — Leverage Point Application Guide

| If you need to... | Target leverage point | Why |
|-------------------|----------------------|-----|
| Fix a recurring incident | LP 5 (balancing feedback) | Add a mechanism that counteracts the failure mode |
| Improve performance | LP 1 (parameters) or LP 4 (delays) | Parameters are cheap, delays unlock throughput |
| Reduce cost | LP 2 (buffer sizes) or LP 7 (information) | Right-size buffers, expose cost data to decision-makers |
| Increase reliability | LP 5 (balancing loops) or LP 8 (rules) | Circuit breakers, deployment freezes, stability gates |
| Accelerate delivery | LP 4 (delays) or LP 7 (information flows) | Shrink feedback cycles, make bottlenecks visible |
| Change team behavior | LP 8 (rules) or LP 9 (goals) or LP 10 (paradigm) | Rules constrain, goals direct, paradigms transform |
| Resolve conflict | LP 11 (transcending paradigms) | Recognize both sides operate from different valid models |

**Leverage point interaction:** Changing a higher-level leverage point shifts the effectiveness of lower-level ones. Changing the paradigm (LP 10) redefines which parameters (LP 1) matter. Changing goals (LP 9) redefines which feedback loops (LP 5, 6) are desirable.

**False leverage traps:**
- Tuning a parameter on the wrong structure (optimizing cache TTL when the real issue is query performance)
- Strengthening a balancing loop that stabilizes the wrong behavior (adding rate limits that mask capacity problems)
- Changing information flows without changing decision rights (dashboards without authority to act)

### P3.10 — Emergent Behavior Analysis

Emergent behavior is system-level behavior that cannot be predicted from any individual component. It arises from interactions. Analyze in four layers:

```
Layer 1 — Component behavior:
  What does each element do in isolation?
  Service A handles 100 req/s. Database handles 500 qps. Queue buffers 1000 messages.

Layer 2 — Pair interactions:
  What happens at each connection?
  A→B: timeout at 2s. B→C: retry 3 times. C→DB: 50ms query.

Layer 3 — Loop behavior:
  What feedback loops form from the connections?
  R1: Retries → load → latency → retries (cascade)
  B1: Queue depth → backpressure → request rejection (stabilization)

Layer 4 — System behavior:
  What emergent properties appear at the system level?
  System exhibits: hysteresis (latency stays high after load drops), thrashing (resources fully consumed with minimal useful work)
```

**Emergence signals:**

| Signal | What It Indicates | Likely Structure |
|--------|-------------------|------------------|
| Hysteresis | System doesn't recover when cause is removed | Reinforcing loop that stays engaged |
| Thrashing | Resources consumed by overhead, not work | Balancing loop with delay, oscillating |
| Phase shift | Behavior qualitatively changes at a threshold | Stock crosses a tipping point |
| Lock-in | One state is unreachable from another | Reinforcing loop with multiple equilibria |
| Damping | Oscillations decrease over time | Balancing loop dominant |
| Amplification | Oscillations increase over time | Reinforcing loop dominant |

**Emergence detection checklist:**

When analyzing a system, check for these emergence indicators:

```
□ Behavior pattern #1: System exhibits sudden, non-linear changes
  → Likely: a stock crossed a tipping point
  → Find: what stock? what is the threshold value?

□ Behavior pattern #2: System doesn't return to normal after disturbance ends
  → Likely: reinforcing loop maintains the new state
  → Find: what R loop keeps the system in the disturbed state?

□ Behavior pattern #3: System oscillates without external forcing
  → Likely: balancing loop with significant delay
  → Find: what B loop has a delay that creates overshoot and correction?

□ Behavior pattern #4: Performance degrades as more resources are added
  → Likely: coordination overhead or resource contention
  → Find: what shared resource creates a common-pool problem?

□ Behavior pattern #5: System works differently at different scales
  → Likely: structure changes with scale (phase transitions)
  → Find: what thresholds change the system's behavior regimes?
```

**Emergence in common engineering systems:**

| System | Components | Emergent Property | Mechanism |
|--------|-----------|-------------------|-----------|
| Microservice mesh | Individual services, load balancers | Cascade failure propagation | Latency → retries → connection exhaustion |
| Caching layer | Cache nodes, origin servers | Cache stampede | Simultaneous TTL expiry → all miss → all hits origin |
| Load-balanced cluster | Requests routed to N instances | Uneven load distribution | Hash collision, slow start, connection stickiness |
| Database cluster | Read replicas, write master | Replication lag under load | Write volume → replica behind → stale reads |
| Queue system | Producers, consumers, queue | Queue drain failure | Inflow > outflow, consumers overwhelmed |
| Team of developers | Individual developers, CI/CD | Velocity collapse | Technical debt → slower features → more pressure → more debt |

**Tipping point analysis:**

For any stock with a non-linear outflow, identify the tipping point — the level at which behavior qualitatively changes.

```
Example: Connection pool behavior

Pool utilization < 80%:
  → Response time stable, new connections fast, no queuing
  → BEHAVIOR REGIME A: Linear, predictable

Pool utilization 80-95%:
  → Response time increases, queuing begins, some connections wait
  → BEHAVIOR REGIME B: Degraded, sensitive to load changes

Pool utilization > 95%:
  → Response time spikes, connections timeout, cascading failures begin
  → BEHAVIOR REGIME C: Non-linear, unstable, potential collapse

Tipping point: 80% utilization — the threshold between Regime A and B
Critical tipping point: 95% utilization — the threshold between B and C

Knowing these values allows proactive intervention before the tipping point is crossed.
```

### P3.11 — Second-Order Effects Tracing

**The second-order effects chain:** Every action produces an intended effect (first order) and a cascade of unintended effects (second, third, and beyond). Systematic tracing prevents surprises.

```
Intervention: Add rate limiting to API
1st order: Requests above limit are rejected
2nd order: Clients retry rejected requests
2nd order: Retry storms hit the API
3rd order: Synchronized retries cause load spikes
3rd order: Clients that respected the limit are also impacted by retry spikes
Delayed: Engineering team adds exponential backoff requirement to client SDK
Counterintuitive: Rate limiting initially increases total request volume (due to retries)
```

**Counterintuitive outcomes catalog:**

| Intervention | Intended Effect | Common Counterintuitive Outcome |
|-------------|-----------------|-------------------------------|
| Add caching | Reduce load | Stale data causes logic errors that increase support load |
| Increase team size | Accelerate delivery | Coordination overhead reduces net velocity |
| Add redundancy | Increase reliability | Complexity of failover logic introduces new failure modes |
| Add monitoring | Improve observability | Alert fatigue reduces response to real incidents |
| Automate deployment | Reduce errors | Automated bad deployments reach production faster |
| Add tests | Reduce bugs | Test maintenance slows feature delivery; fewer features shipped |
| Microservices | Improve scalability | Network overhead, latency, and operational complexity increase |

**Tracing protocol:**
1. List the intervention and its intended first-order effect
2. For each neighboring system element, ask: "What does this intervention do to that element?"
3. For each neighboring response, ask: "What feedback loop does that activate?"
4. For each activated feedback loop, ask: "What is the delayed effect?"
5. Compare the final system state to the intended effect. If they diverge, the intervention is likely counterproductive.

**Second-order effects template:**

Use this template to document second-order analysis for any intervention:

```
INTERVENTION: [what you plan to do]
INTENDED EFFECT: [what you want to happen]

FIRST-ORDER EFFECTS (direct, immediate):
  - [effect 1]
  - [effect 2]

SECOND-ORDER EFFECTS (neighboring elements, short-delay):
  - [effect on neighboring component A]
  - [effect on neighboring component B]
  - [compensating response from existing B loops]

THIRD-ORDER EFFECTS (system-wide, longer delay):
  - [R loop that activates]
  - [new B loop that forms]
  - [emergent behavior]

DELAYED EFFECTS (appear after significant time lag):
  - [effect 1, with estimated delay]
  - [effect 2, with estimated delay]

COUNTERINTUITIVE OUTCOMES:
  - [outcome that goes in opposite direction from intended]
  - [outcome that appears before the intended effect]

VERDICT:
  - Net result vs intended effect: [better / worse / same]
  - Modify intervention? [yes / no — if yes, how?]
```

**Second-order effects in the engineering lifecycle:**

| Phase | Intervention | Common Second-Order Effect | Mitigation |
|-------|-------------|---------------------------|------------|
| Development | Add static analysis | Developers ignore warnings (alert fatigue) | Block PRs on critical warnings only |
| Testing | Increase test coverage | Tests become brittle, slow to run | Test pyramid: unit > integration > e2e |
| CI/CD | Deploy automatically | Bad deployments reach production faster | Canary deploys, gradual rollout |
| Monitoring | Add more alerts | Alert fatigue, alerts ignored | Tier alerts: page vs ticket vs log |
| Scaling | Add more servers | Cost increases, coordination overhead | Auto-scaling with cost bounds |
| Security | Add auth checks | Developer friction, workarounds | Auth middleware, not per-endpoint |
| Process | Add code review | Bottleneck, delayed delivery | Lightweight review for low-risk changes |
| Team | Split team | Communication overhead, inconsistent practices | Well-defined interfaces between teams |

### P3.12 — Interconnected Dependency Mapping

Map every dependency in the system as a directed graph. Classify each dependency:

| Dependency Type | Definition | Failure Mode |
|----------------|------------|--------------|
| Hard | Component cannot function without dependency | Complete failure on dependency outage |
| Soft | Component degrades without dependency | Graceful degradation, partial functionality |
| Temporal | Component depends on timing of dependency | Race conditions, timeout failures |
| State | Component depends on state of dependency | Stale data, consistency failures |
| Feedback | Component and dependency affect each other | Oscillation, cascade, lock-in |

**Dependency propagation analysis:**

```
For each component C in the system:
  1. List all components C depends on (direct dependencies)
  2. For each direct dependency D, list D's dependencies (transitive)
  3. Identify: is there a cycle? (C → D → E → C)
  4. If cycle exists: is it reinforcing or balancing?
  5. For each cycle: what breaks it? (circuit breaker, timeout, state reset)
```

**Dependency coupling metrics:**

| Metric | Calculation | Threshold for Concern |
|--------|-------------|----------------------|
| Fan-in | Number of components that depend on this one | >5: single point of failure |
| Fan-out | Number of components this one depends on | >7: fragile, excessive coupling |
| Depth | Longest dependency chain from this component | >3: latency amplification |
| Cycles | Number of circular dependencies | >0: requires careful loop analysis |
| Shared fate | Components that fail together | Cluster: may indicate missing decomposition |

### P3.13 — First Principles → Systems Synthesis Patterns

**Pattern 1: Decompose to discover, integrate to intervene**

Decompose first principles to identify the elemental truths of the system. Then map the system to understand how those truths interact. Intervention design happens at the integration layer.

```
FP: Database query takes 50ms (fundamental)
FP: Connection pool has 100 connections (constraint)
ST: Connection pool as stock, inflow/outflow rates
ST: Reinforcing loop: held connections → fewer available → more waiting → longer held
ST: Leverage: reduce query time (FP) + add connection timeout (ST)
```

**Pattern 2: Use ST leverage points to prioritize FP decomposition depth**

Not all truths are equally important. Use leverage point analysis to determine which components to decompose most deeply.

```
ST Leverage Point identified: Circuit breaker (LP 5) would stop the cascade
FP Decomposition target: Circuit breaker behavior — what are the irreducible elements of a circuit breaker?
  - State machine (closed, open, half-open)
  - Failure counter
  - Timeout threshold
  - Reset policy
```

**Pattern 3: Use FP assumption audit to validate ST models**

Systems thinking models are only as good as their assumptions. Run every ST model through the assumption audit.

```
ST Model: Adding moderators reduces moderation queue
FP Assumption Audit:
  - "Moderator throughput scales linearly with headcount" → Empirical? Assumed?
  - "New moderators have same productivity as existing ones" → Assumed (unlikely true)
  - "Queue depth is the binding constraint" → Empirical? Measured?
```

**Pattern 4: Use ST second-order tracing to validate FP recomposition**

After rebuilding from first principles, trace the second-order effects of the new solution to catch unintended system-level consequences.

```
FP Recomposition: Add in-process cache
ST Second-order tracing:
  1st: Read latency drops
  2nd: Database load drops (good)
  2nd: Cache invalidation complexity increases (risk)
  3rd: Stale data served during write windows (risk)
  3rd: Team now manages cache TTL across services (new coupling)
  Result: Accept with TTL monitoring. Add stale-data detection.
```

**Pattern 5: Alternating decomposition**

When analyzing a complex problem, alternate between tracks. Each pass with one track reveals what needs attention from the other.

```
Round 1 (FP): Decompose the problem → find irreducible truths
Round 2 (ST): Map how those truths interact → find feedback loops
Round 3 (FP): Decompose the critical feedback loops → find elemental mechanisms
Round 4 (ST): Model the system with decomposed mechanisms → find leverage points
Continue until the intervention is clear and verified
```

**Pattern 6: System boundary as decomposition scope**

Use the system boundary (ST) to define the scope of your first principles decomposition. Decompose everything inside the boundary fully. Treat everything outside as environmental constraints.

```
ST defines boundary:
  Inside: Service A, B, C, Database
  Outside: Users, payment gateway, third-party auth

FP decomposes what's inside:
  Service A: HTTP handler, business logic, cache layer, retry logic
  Service B: ...  
  Database: query planner, connection pool, indexes, replication

FP treats outside as constraints (not decomposed):
  Users: traffic patterns (measured, not decomposed in detail)
  Payment gateway: external SLA (constraint, not decomposable here)
```

**Pattern 7: Leverage-informed decomposition depth**

Use the leverage point hierarchy to decide how deeply to decompose each component. High-leverage components (LP 5-11 potential) deserve deeper decomposition. Low-leverage components (LP 1-2) need only surface decomposition.

```
High leverage potential (decompose deeply):
  - Component involved in a reinforcing death spiral (LP 5-6)
  - Component where information flow is blocked (LP 7)
  - Component governed by wrong rules/goals (LP 8-9)

Low leverage potential (surface decomposition only):
  - Parameter values that can be tuned later (LP 1)
  - Buffer sizes that can be adjusted (LP 2)
  - Components with no feedback loops attached (no LP > 2)
```

---

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

---

### E2: Database Migration Strategy

**Problem:** "Need to migrate from MongoDB to PostgreSQL."

**Track A — First Principles Decomposition:**

**Irreducible truths:**
- MongoDB has no schema enforcement (documents may have different fields)
- PostgreSQL requires explicit schema
- Application reads and writes through an ORM abstraction layer
- The migration period requires both databases to be consistent
- Zero data loss is a business requirement
- Application cannot exceed 5 minutes of read-only downtime

**Constraint vs Convention:**

| Element | Type | Classification |
|---------|------|---------------|
| Zero data loss | C | Business requirement (legal/financial) |
| 5-minute downtime max | C | Business requirement (SLA) |
| ORM abstraction | V | Convention — could write raw SQL |
| MongoDB → PostgreSQL | V | Convention — could stay on MongoDB or use another DB |
| All collections migrate at once | V | Convention — could migrate one by one |
| Dual-write during migration | C | Required by zero-loss constraint |

**Inverse test:** "What if we didn't migrate at all?"

```
- MongoDB performance is acceptable
- Schema-less flexibility is still needed
- No current PostgreSQL-specific requirement
Result: If the migration has no clear benefit, drop it. If there IS a benefit, articulate it without referencing PostgreSQL.
```

**Minimum Actionable Truths:**

```
MAT-1: "We need relational integrity (foreign keys, joins)"
  → Verify: Are cross-collection queries happening? Measured?
MAT-2: "MongoDB performance is degrading"
  → Verify: What metrics show degradation? At what growth rate?
MAT-3: "Team has PostgreSQL expertise"
  → Verify: Skills assessment. If not, migration cost includes learning curve.
```

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: Application, MongoDB, PostgreSQL (during migration), migration adapter
- Outside: Users, third-party APIs, monitoring infrastructure
- Boundary interactions: Read/write requests, migration sync

**Feedback loops:**

```
Loop R1 (DATA DIVERGENCE RISK):
Dual-write running → write to MongoDB succeeds → write to PostgreSQL fails
→ data divergence → backfill → more writes → more divergence risk
Mitigation: Make PostgreSQL the authoritative write target, MongoDB as secondary

Loop B1 (MIGRATION PACE CONTROL):
Collections migrated → team fatigue → migration speed drops
→ remaining collections → team recovers → migration speed increases
Mitigation: Predictable pace, not forced pace
```

**Stock and flow:**

```
Stock: Data migrated (GB)
Inflow: Migration rate (GB/hour, limited by network and consistency checks)
Outflow: N/A (migration is additive until cutover)
Delay: Consistency verification adds 2× the migration time

Stock: Team confidence (abstract, tracked via migration incident rate)
Inflow: Successful collection migrations
Outflow: Failed migrations, data divergence incidents
```

**Leverage points:**

| Intervention | LP | Rationale |
|-------------|-----|-----------|
| Migrate collection by collection | 3 (structure) | Reduces risk surface, allows rollback per collection |
| Automated consistency checks | 5 (balancing) | Detects divergence before it compounds |
| Migration dashboard | 7 (information) | Exposes migration progress, remaining, and incidents |
| Feature flag per collection cutover | 8 (rule) | Instant rollback per collection without code deploy |

**Rebuilt plan:**
1. Define PostgreSQL schema from MongoDB document analysis (find all unique fields across documents)
2. Write dual-write adapter: writes go to both MongoDB and PostgreSQL, with PostgreSQL as authoritative
3. Backfill existing data to PostgreSQL, collection by collection
4. Verify consistency with periodic checksum queries per collection
5. Cut reads over collection by collection using feature flags
6. Remove MongoDB when zero reads remain

**Second-order effects:**
```
1st: Data now in PostgreSQL
2nd: ORM queries need PostgreSQL dialect adjustments
2nd: Schema enforcement catches data quality issues previously hidden in MongoDB
3rd: Data quality issues surface → team needs to clean data → delays migration
3rd: Schema debates emerge → what was implicit in MongoDB becomes explicit
Delayed: Team realizes some MongoDB schemas were poorly designed → redesign opportunity
```

---

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

---

### E4: Caching Strategy Analysis

**Problem:** "We need Redis to cache database queries."

**Track A — First Principles Decomposition:**

**Irreducible truths:**
- Database query takes 50ms
- Same query is called 100 times/second
- Data changes once per hour
- Application serves 50 instances
- Network round-trip to Redis: 0.5ms
- In-memory access: ~1μs

**Truth calculation:**
- 50ms × 100/s = 5 seconds of DB time per second (handled by parallel queries — DB capacity sufficient)
- Data changes hourly → 3600 seconds of cache validity
- 50 instances × 100/s = 5000 total requests/s

**Constraint vs Convention analysis:**

| Element | Type | Classification |
|---------|------|---------------|
| DB query takes 50ms | C | Physical — data on disk |
| Query called 100/s | C | Application requirement |
| Data changes hourly | C | Business operation schedule |
| Redis as cache | V | Could use in-process cache instead |
| 50 application instances | V | Scaling convention |
| Cache invalidation per hour | C | Data freshness requirement |

**Inverse test:** "What if we had no cache at all?"

```
DB can handle 100 queries/s. Data changes hourly — each hour, 360,000 queries run.
Without cache: 360,000 queries/hour × 50ms = 5 hours of DB time (parallelized across connections)
With in-process cache: after first request per instance, 0 DB queries until TTL expiry
  → 50 queries/hour total (one per instance, first request after cache miss)
Without any cache: DB load = 100 qps. DB capacity = 500+ qps. No immediate problem.
Conclusion: Cache is optimization, not necessity. In-process cache is sufficient.
```

**Minimum Actionable Truth:**
```
Decision:     Use Redis for caching
MAT:          "Query results must be shared across all application instances"
Verification: Does each instance currently serve the same data independently?
Reality:      Yes, they do. Shared cache is unnecessary — each instance can cache independently.
```

**Track B — Systems Thinking Analysis:**

**Stock and flow of cache behavior:**

```
Stock: Cache entries (per instance)
Inflow: Cache miss → query DB → cache population
Outflow: TTL expiry → cache eviction
Rate: 100 queries/s → 100 cache checks/s → 1 miss/instance (first request) → 1 DB query/instance

With Redis:
- Stock: Shared cache across all instances
- Inflow: First request from any instance populates
- Outflow: TTL expiry
- Rate: 1 DB query total (first request from any instance), then 5000/s Redis reads
```

**Feedback loops:**

```
Loop B1 (CACHE WARMING):
Cache empty → query DB → populate cache → future requests avoid DB → DB load stays low

Loop R1 (CACHE STAMPEDE):
Cache expires → all 50 instances miss simultaneously → 50 DB queries in parallel
→ DB spike → latency increases → instances open more connections → DB pressure
Mitigation: Randomized TTL jitter. Or: in-process cache avoids stampede (each instance expires independently).

Loop B2 (REDIS DEPENDENCY):
Redis goes down → all cache misses → all DB queries → DB spike → system degrades
Mitigation: Local fallback cache + circuit breaker on Redis
```

**Leverage point analysis:**

| Intervention | LP | Impact |
|-------------|-----|--------|
| In-process cache with TTL | 2 (buffer) | Eliminates Redis dependency, zero network cost |
| Randomized TTL jitter | 1 (parameter) | Prevents cache stampede |
| Redis → in-process | 3 (structure) | Removes a network hop and infrastructure dependency |
| Cache monitoring | 7 (information) | Track hit rates, detect invalidation issues |

**Second-order effects of removing Redis:**

```
1st: No Redis → no network hop for cache reads
2nd: Each instance has its own cache → slight inconsistency between instances
2nd: No cache warming benefit (each instance must warm independently)
2nd: No shared invalidation → stale data may be served for up to TTL on some instances
3rd: Infrastructure complexity drops (no Redis cluster to manage)
3rd: No Redis failover scenarios to handle
Delayed: Team realizes they had been over-engineering cache infrastructure for years
```

**Rebuilt solution:**
- In-process cache with TTL: 0 network, 0 infrastructure, ~1μs access time
- Randomized TTL at 3600±300 seconds to prevent stampede
- Redis only if cache must be shared across instances (not required here — data is DB-consistent)
- Result: Remove Redis, use in-memory cache with 1-hour TTL. Redis is premature infrastructure.

---

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

---

### E6: Rate Limiting Design

**Context:** Public API needs rate limiting to protect against abuse and traffic spikes.

**System elements:** Users, API gateway, rate limiter, backend services, token bucket

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: API gateway, rate limiter, backend services, token management
- Outside: Client applications, third-party integrators, malicious actors
- Boundary interactions: HTTP requests, rate limit headers, retry-after responses

**Causal loop diagram:**

```
Loop B1 (RATE STABILIZATION):
Request rate ↑ → token bucket empty → requests rejected → request rate to backend stays stable
  This is the primary balancing loop. It protects the backend.

Loop R1 (CASCADE WITHOUT LIMITING):
Request rate ↑ → backend latency ↑ → retries ↑ → effective request rate ↑ → backend latency ↑
  This is what happens without rate limiting: a reinforcing death spiral.

Loop R2 (RETRY STORM):
Rate limit rejects requests → clients retry → requests increase → more rejections
  Without exponential backoff, R2 creates a retry storm that amplifies load.
```

**Stock and flow of token bucket:**

```
Stock: Token bucket (current token count)
Inflow: Refill rate R (tokens/second)
Outflow: Token consumption (1 per request)
Capacity: C tokens (maximum stock)
Behavior:
  - If burst > C: excess rejected immediately (instantaneous balancing)
  - If sustained rate > R: bucket stays empty, all excess rejected (sustained balancing)
  - If rate < R: bucket fills to capacity (prepares for next burst)
```

**Delay analysis:**

```
- Rate limit enforcement: microseconds (negligible delay)
- Backend degradation: seconds to materialize
- Client retry detection: seconds to minutes
- Backend recovery after load drops: seconds to minutes (depending on queue drain)
```

**Leverage analysis:**

| Intervention | LP | Effect |
|-------------|-----|--------|
| Set R and C based on measured backend capacity | 1 (parameter) | Prevents arbitrary limits that are too restrictive or too permissive |
| Return Retry-After header | 7 (information) | Clients self-regulate, reduces R2 retry storm |
| Client quota tiers | 8 (rule) | Predictable load per client, fairness enforcement |
| Exponential backoff requirement | 8 (rule) | Breaks R2 retry storm |
| Token bucket with burst capacity | 3 (structure) | Handles natural traffic patterns without false positives |

**Track A — First Principles Decomposition:**

**Irreducible truths about rate limiting:**
- Every request consumes server resources (CPU, memory, IO)
- Server resources have a maximum throughput (measured, not assumed)
- Abrupt load spikes can exceed server capacity
- Malicious actors will attempt to exceed capacity
- Legitimate users sometimes burst for valid reasons (page load, data sync)
- Retries are legitimate (network errors happen) but can become abusive

**Constraint vs Convention:**

| Element | Type | Classification |
|---------|------|---------------|
| Server has max capacity | C | Physical constraint |
| Clients can send unlimited requests | C | Network protocol characteristic |
| Rate limit values (R, C) | V | Must be derived from capacity |
| Token bucket algorithm | V | Many algorithms exist (leaky bucket, sliding window, fixed window) |
| Retry-After header | V | Optional HTTP convention |
| Client quotas | V | Policy decision |

**Inverse test:** "What if we had no rate limiting?"

```
- One client sends 100,000 req/s
- Server capacity: 10,000 req/s
- Result: Server becomes overloaded, all clients experience degraded service
- Conclusion: Rate limiting is necessary for shared infrastructure
- But: For single-tenant, dedicated-infrastructure systems, rate limiting may be unnecessary
```

**Minimum Actionable Truth:**
```
Decision:     Token bucket rate limiter
MAT:          "Backend capacity is 10,000 req/s at P99 latency under 500ms"
Verification: Load test the backend to find the actual saturation point
Without MAT:  Rate limits are arbitrary — too high (system overload) or too low (wasted capacity)
```

**Second-order effects of rate limiting:**

```
1st: Requests above limit are rejected
2nd: Clients receive 429 responses
2nd: Well-behaved clients respect Retry-After and back off
2nd: Poorly-behaved clients ignore Retry-After and retry immediately
3rd: Retry storm forms from poorly-behaved clients → more rejections → more retries
3rd: API gateway CPU increases from handling rejection + retry overhead
Delayed: Engineering team adds client identification to rate limits per API key
Mitigation: Require exponential backoff in client SDK. Reject clients that don't comply.
```

**Rebuilt solution:**
1. Load test backend to determine actual capacity at P99 latency target
2. Set token bucket R = 80% of measured capacity (headroom for variance), C = 2× R (burst allowance)
3. Return Retry-After header with exponential backoff guidance
4. Implement per-client quotas (R_cli ent = R / number_of_clients, with shared pool for flexibility)
5. Monitor rate limit hit rate and adjust R/C as capacity changes

---

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

---

### E8: Postmortem Analysis of a Production Outage

**Context:** A 45-minute production outage occurred when a database connection pool was exhausted during a routine deployment. All services that depended on the database failed in cascade.

**Track A — First Principles Decomposition:**

**Sequence of events:**
1. Deployment started for Service B (new feature)
2. Service B's new code opened 200 database connections instead of 20 (bug: connection leak)
3. Database connection pool (100 max) exhausted in 5 seconds
4. Service A (different process) could not get connections → 500 errors
5. Service C depended on Service A → also failed
6. All three services down for 45 minutes (detection + rollback + recovery)

**Irreducible truths:**
- Database has 100 max connections (hard limit)
- Service B opened 200 connections instead of 20
- Pool exhaustion threshold: 100 connections / 200 connection attempts = 0.5 seconds to exhaust
- Detection delay: monitoring polls every 60 seconds → 60-second gap before alert
- Rollback: 15 minutes
- Connection drain after kill: TCP TIME_WAIT (60 seconds) before connections are actually freed

**Constraint vs Convention:**

| Element | Type | Classification |
|---------|------|---------------|
| 100 max connections | C | Database configuration limit |
| Service B opened 200 connections | C | Bug — unintended, but actual |
| 60-second monitoring interval | V | Configuration choice |
| 15-minute rollback | V | Could be faster with automation |
| 60-second TCP TIME_WAIT | C | TCP protocol behavior |
| Manual rollback decision | V | Could be automated |
| No connection pool monitoring per service | V | Observability gap |

**Inverse test:** "What if the deployment had been rolled back automatically?"

```
- Detection: monitoring detects 500 errors within 10 seconds (faster polling)
- Decision: automated rollback on 5% error rate threshold
- Rollback: 5 minutes (prepared rollback script)
- Impact: 5-minute partial outage instead of 45-minute full outage
- Conclusion: Missing automation was the primary amplification factor
```

**Minimum Actionable Truths:**

```
MAT-1: "Database connection pool is a shared resource across services"
  → Verified: yes, all services share the same pool

MAT-2: "No per-service connection limit exists"
  → Verified: any service can consume all connections

MAT-3: "Monitoring detects pool exhaustion within one polling cycle"
  → Verified: 60 seconds worst case
```

**Track B — Systems Thinking Analysis:**

**System boundary:**
- Inside: Services A, B, C, Database, Load balancer, Monitoring
- Outside: Users, deployment pipeline, on-call engineers
- Boundary interactions: HTTP requests, database connections, alerts

**Causal loop diagram:**

```
Loop R1 (CONNECTION DEATH SPIRAL):
Service B connections ↑ → pool exhaustion → A and C can't connect → A retries
→ A opens more connections → pool exhaustion worsens → more services fail
  Break: Per-service connection pool limits. Circuit breaker on DB connections.

Loop R2 (DETECTION DELAY):
Pool exhaustion → services fail → monitoring polls at 60s → alert at 60s
→ on-call responds → diagnoses → rollback → recovery
  During this 45-minute delay, the outage persists unnecessarily
  Break: Faster polling. Automated detection and rollback.

Loop B1 (SELF-HEALING — if it existed):
Pool exhaustion → connections timeout → services retry with backoff
→ some connections free → pool partially recovers → services re-establish
  This balancing loop did NOT exist because retries were immediate, not backoff
  Break: Add exponential backoff on database connection failure
```

**Stock and flow:**

```
Stock: Available database connections (100 max)
Normal: Inflow = Outflow (connections opened and closed at same rate)
During incident:
  Inflow: 200 connections from Service B (bug)
  Outflow: 20 connections closed per second (normal operations)
  Result: Stock depletes in 5 seconds (100 / (200-20) ≈ 0.5 seconds? No)
  Actually: 200 connections compete for 100 slots. Exhaustion is near-instantaneous.

Stock: Incident duration (45 minutes)
  Inflow: Time passing
  Outflow: Recovery actions (detection + diagnosis + rollback + connection drain)
  Delays: Detection (60s), Diagnosis (10min), Decision (5min), Rollback (15min), TCP TIME_WAIT (60s)
```

**Leverage analysis:**

| Intervention | LP | Impact on Outage | Effort |
|-------------|-----|-----------------|--------|
| Reduce monitoring poll to 10s | 1 (parameter) | Detects 50s faster | Config change |
| Automated rollback on error threshold | 5 (balancing) | Removes decision delay | 2-3 days |
| Per-service connection pool limit | 3 (structure) | Prevents one service from starving others | 1 day config |
| Exponential backoff on DB connection failure | 5 (balancing) | Enables self-healing | 1 day per service |
| Database connection pool monitoring per service | 7 (information) | Shows which service is consuming connections | 1 day |
| Connection leak detection in CI | 5 (balancing) | Prevents leak from reaching production | 3-5 days |
| Reduce TCP TIME_WAIT | 1 (parameter) | Faster connection release | Config change (OS tuning) |

**Second-order effects of automated rollback:**

```
1st: Deployment with errors is automatically rolled back
2nd: Failed deployment is detected in seconds, not minutes
2nd: On-call engineer is not paged (less fatigue)
3rd: Team loses the "manual safety check" moment — they may not notice the failure
3rd: Too-aggressive auto-rollback could revert valid deployments on transient errors
Delayed: Team adds canary deployment to reduce false-positive rollbacks
Mitigation: Rollback threshold at 5% error rate with 30-second observation window
```

**Second-order effects of per-service connection limits:**

```
1st: Each service gets N connections max, cannot exhaust pool
2nd: Service B's leak is contained — only Service B fails, A and C stay up
2nd: Need to tune per-service limits: too low = artificial bottleneck, too high = no protection
3rd: Teams compete for connection budget → resource allocation discussions
3rd: Monitoring now tracks per-service utilization → better capacity planning
Delayed: Some services need burst capacity → dynamic pool allocation
```

**Causal reduction of the deployment process:**

```
Property: "Rollback is manual"
Original reason: "Automated rollback might roll back valid changes on false positives"
Current context: "We have monitoring, canary, and gradual rollout"
Evaluation: Original concern is valid but addressable with proper thresholds.
  Manual rollback cost: 20+ minutes of outage per incident
  Automated rollback risk: false positives (rate: <1% with good thresholds)
  Trade-off: Manual is worse. Automate with guardrails.

Property: "Connection monitoring is per-database, not per-service"
Original reason: "We didn't think a single service could exhaust the pool"
Current context: "We now know it can"
Evaluation: Add per-service connection metrics. Obvious fix.
```

**Rebuilt solution:**
1. Add per-service connection pool limits (80% shared pool + 20% reserved per service)
2. Implement automated rollback on >5% error rate for 30+ seconds
3. Add exponential backoff on database connection failure (baseline: 1s, max: 30s)
4. Add per-service database connection monitoring to dashboards
5. Add connection leak detection (connection count growing without bound) to CI pipeline
6. Reduce monitoring poll interval from 60s to 10s
7. Conduct postmortem-driven causal reduction on all deployment properties

**Expected result:** Same bug in future: Service B has its connections limited, does not affect A or C. Automated rollback reverts within 5 minutes. Exponential backoff allows partial self-healing. Outage duration: 45 minutes → < 5 minutes.

---

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

---

## P6 — QUALITY GATES

### Tier 1 — Hard Block (All Must Pass)

**First Principles Gates:**
- [ ] Problem stated in one sentence without referencing any existing solution
- [ ] Every engineering claim tagged as: fundamental / empirical / conventional / assumed / inherited
- [ ] At least one assumption explicitly challenged and either verified or discarded
- [ ] Each constraint verified as physical/security/legal — not a convention
- [ ] The rebuilt solution addresses each irreducible element
- [ ] No decomposition step skipped

**Systems Thinking Gates:**
- [ ] System boundary explicitly defined (inside/outside/interactions)
- [ ] At least one feedback loop identified (reinforcing or balancing)
- [ ] Causal links drawn with polarity (S/O) for each relationship
- [ ] Second-order effects traced for each proposed intervention
- [ ] At least one delay identified with estimated magnitude
- [ ] Stock-and-flow analysis for at least one primary resource

### Tier 2 — Standard

**First Principles Gates:**
- [ ] Minimum Actionable Truth (P3.4) identified for the key decision
- [ ] Inverse test (P3.3) applied to at least one core assumption
- [ ] Causal reduction (P3.5) traced for inherited properties
- [ ] Decomposition stopped at appropriate depth (atomic, provable, unambiguous)
- [ ] Rebuilt solution cost-justified against current approach

**Systems Thinking Gates:**
- [ ] Leverage point rank identified for each intervention
- [ ] Archetype match checked against common patterns (P3.7)
- [ ] All dominant feedback loops labeled R or B
- [ ] Delayed effects explicitly distinguished from immediate effects
- [ ] Counterintuitive outcomes predicted before implementation

### Synthesis Gates (Combined Track)

- [ ] Decomposed truths mapped to system model variables (each truth appears in the CLD or stock-flow)
- [ ] At least one decomposition result changed the system model (truths refined the model)
- [ ] At least one system model insight changed the recomposition priority (leverage refocused decomposition)
- [ ] Second-order effects traced for the rebuilt solution (not just the current system)
- [ ] Assumption audit applied to every feedback loop variable (no unverified variables in CLD)
- [ ] Leverage point interventions verified against decomposed constraints (no LP built on false assumption)

### Self-Audit Checklist

```
Problem stated without solution reference?       → yes
Claims tagged by knowledge type?                 → yes
Constraints verified as non-negotiable?          → yes
Minimum Actionable Truth identified?             → yes
Inverse test applied?                            → yes
Causal reduction complete?                       → yes
System boundary defined?                         → yes
All causal links have polarity?                  → yes
Reinforcing loop found?                          → yes (if none, keep looking)
Balancing loop found?                            → yes (if none, system is unstable)
Delays identified?                               → yes
Second-order effects predicted?                  → yes
Leverage point rank assigned?                    → yes
Synthesis cross-check performed?                 → yes
```

### Domain Boundary Checklist (Must NOT overlap)

- [ ] Analysis does NOT prescribe a structured problem-solving process
- [ ] Analysis does NOT apply decision frameworks or decision trees
- [ ] Analysis does NOT use design thinking methodology
- [ ] Analysis does NOT include probabilistic risk assessment
- [ ] Analysis does NOT prescribe debugging methodology
- [ ] Analysis does NOT make architecture decisions
- [ ] If any of these domains are needed: STOP and call the appropriate plugin

### Track A Completion Checklist (First Principles)

```
□ Problem stated without solution reference
□ Irreducible elements listed (atomic, provable, unambiguous)
□ Each element tagged: [F] [E] [C] [A] [I]
□ Constraints verified as non-negotiable (failure mode identified)
□ Conventions challenged (at least one changed or eliminated)
□ Rebuilt solution maps to irreducible elements
□ Rebuilt solution cost-justified
□ Inverse test applied to at least one core assumption
□ Minimum Actionable Truth identified
□ Causal reduction performed on inherited properties
```

### Track B Completion Checklist (Systems Thinking)

```
□ System boundary defined (inside/outside/interactions)
□ Dynamic variables listed
□ Causal links drawn with polarity (S/O)
□ At least one feedback loop identified and labeled (R/B)
□ Delays identified with estimated magnitude
□ Stock-and-flow analysis for primary resource
□ Leverage points ranked for each intervention
□ Archetype match checked
□ Second-order effects traced (at least 3 orders)
□ Counterintuitive outcomes predicted
```

### Analysis Quality Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Decomposition depth | Atomic + provable + unambiguous | Check each element: can it be split further? Is it independently verifiable? |
| Assumption coverage | 100% of claims tagged | Scan analysis: every claim has [F][E][C][A][I] |
| Constraint verification | 100% constraints tested | For each constraint: what failure mode? Can it be demonstrated? |
| Loop completeness | All chains closed | Walk each causal chain: does it form a cycle? |
| Polarity accuracy | 100% links labeled | Every arrow has S or O. Test each with the A↑→B? test. |
| Delay identification | All significant delays marked | For each delay: estimated magnitude, effect on behavior |
| Second-order depth | Minimum 3 orders traced | First → Second → Third → Delayed → Counterintuitive |
| Leverage point range | Minimum 2 levels apart | Don't cluster interventions at LP 1-3. Include at least one LP 5+ recommendation. |
| Track balance | Both tracks used | FP track: decomposition + analysis. ST track: modeling + leverage. Synthesis: cross-check. |

---

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
