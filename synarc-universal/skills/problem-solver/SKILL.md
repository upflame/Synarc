---
name: problem-solver
description: Problem Solver + Design Thinker — Integrated Engineering Problem-Solving & Human-Centered Design
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Problem Solver + Design Thinker — Integrated Engineering Problem-Solving & Human-Centered Design

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

All synarc prohibitions and tracking protocols apply.

This integrated methodology merges structured engineering problem-solving with human-centered design thinking. Every engineering task — adding a feature, fixing a bug, optimizing a query, designing a schema, building a user experience — is a problem to be solved for people. The technical half ensures rigor, completeness, and verifiability. The design half ensures the solution addresses real human needs, not assumed requirements.



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


## P2 — CORE METHODOLOGY

### P2.1 — The Integrated Problem-Solving Cycle

The complete cycle merges the engineering problem-solving loop with the design thinking dual diamond:

```
                  ┌──────────────────────────────────────────────────────┐
                  │              INTEGRATED PROBLEM-SOLVING CYCLE         │
                  ├──────────────────────────────────────────────────────┤
                  │  1. EMPATHIZE  → Understand users and context        │
                  │  2. DEFINE     → Frame the problem precisely         │
                  │  3. ANALYZE    → Find root causes and constraints    │
                  │  4. IDEATE     → Generate diverse solutions          │
                  │  5. PROTOTYPE  → Make solutions tangible             │
                  │  6. EVALUATE   → Select the best solution            │
                  │  7. IMPLEMENT  → Execute the selected solution       │
                  │  8. TEST       → Verify with real users and data     │
                  └──────────────────────────────────────────────────────┘
```

**Phase mapping between the two traditions:**

| Phase | Engineering Problem-Solving | Design Thinking | Combined Purpose |
|-------|---------------------------|-----------------|------------------|
| 1 | (implicit context) | EMPATHIZE | Understand users, stakeholders, system context |
| 2 | DEFINE | DEFINE | Frame the problem with precision and human grounding |
| 3 | ANALYZE | (synthesis within define) | Root cause analysis, constraint discovery |
| 4 | GENERATE | IDEATE | Divergent solution generation |
| 5 | (plan within implement) | PROTOTYPE | Make solutions tangible and testable |
| 6 | EVALUATE | (selection within ideate) | Multi-criteria solution selection |
| 7 | IMPLEMENT | DELIVER | Execute the solution in the real system |
| 8 | VERIFY | TEST | Confirm effectiveness with evidence |

**When to emphasize which tradition:**

| Problem Nature | Primary Emphasis | Secondary Emphasis |
|----------------|-----------------|-------------------|
| Bug / system failure | Engineering cycle (DEFINE-ANALYZE-GENERATE-EVALUATE-IMPLEMENT-VERIFY) | Empathize to understand user impact |
| New feature / product | Design thinking (EMPATHIZE-DEFINE-IDEATE-PROTOTYPE-TEST) | Analyze for technical constraints |
| Performance regression | Engineering cycle with data-driven analysis | Prototype to test fixes cheaply |
| UX / workflow issue | Design thinking with journey mapping | Evaluate with structured criteria |
| Infrastructure change | Engineering cycle with systemic analysis | Empathize with operator/dev experience |
| Strategic / ambiguous | Design thinking first, then engineering cycle | Full integration |

### P2.2 — The Dual Diamond Structure

Every problem-solving engagement flows through two diamonds — problem space and solution space — each with a diverge and converge phase:

```
PROBLEM SPACE                         SOLUTION SPACE
  DIVERGE              CONVERGE         DIVERGE              CONVERGE
(DISCOVER)            (DEFINE)         (DEVELOP)            (DELIVER)
    │                    │               │                    │
    ▼                    ▼               ▼                    ▼
 Gather              Frame           Generate             Select &
 data,        →      problem    →    many         →       ship
 observe,             sharply         ideas               solution
 empathize
    │                    │               │                    │
    ▼                    ▼               ▼                    ▼
  What is?           What matters?    What if?           What works?
```

**Diamond 1 — Problem Space:**
- DIVERGE (Discover): Gather maximum input — user interviews, system metrics, stakeholder concerns, historical data, competitive analysis
- CONVERGE (Define): Synthesize into a precise problem definition — POV statement, problem statement, bounded scope, success criteria

**Diamond 2 — Solution Space:**
- DIVERGE (Develop): Generate maximum options — brainstorming, SCAMPER, Triz, analogical thinking, inversion
- CONVERGE (Deliver): Select and refine — multi-criteria evaluation, prototyping, testing, implementation

**Critical rule:** Never skip a phase. Diverging when you should converge leads to analysis paralysis. Converging when you should diverge leads to premature commitment to weak solutions.

### P2.3 — Problem Framing Grammar

Before any analysis or solution generation, frame every problem using this structure:

```
USER / STAKEHOLDER:  [who experiences this? whose problem is it?]
CURRENT STATE:       [what is happening now? what data supports this?]
DESIRED STATE:       [what should be happening? how will we recognize it?]
GAP:                 [what separates current from desired state?]
CONSTRAINTS:         [what limits the solution space — time, budget, tech, policy?]
SUCCESS CRITERIA:    [how will we measure that the problem is solved?]
```

**If the framing does not change when you add new observations, the frame is too broad. Narrow until it becomes actionable and falsifiable.**

**Example — bad framing:**
```
USER: Users
CURRENT: The app is slow
DESIRED: The app should be fast
```

**Example — good framing:**
```
USER: API consumers (mobile app, web frontend)
CURRENT: GET /users endpoint returns in 3.0s P95 at 100 concurrent requests
DESIRED: <500ms P95 at the same concurrency level
GAP: 2.5s excess latency in the database query layer
CONSTRAINTS: Client timeout is 2s, zero-downtime deploy required, must not change API contract
SUCCESS: P95 latency <500ms sustained for 24 hours post-deploy, no increase in error rate
```

### P2.4 — Point of View (POV) Statement

A POV statement anchors the problem in human terms. It ensures the problem is framed around needs, not solutions.

**POV formula:**
```
[USER] needs [NEED] because [INSIGHT],
which surprises us because [OBSERVATION CONTRADICTING ASSUMPTION].
```

**Components:**

| Component | Description | Example |
|-----------|-------------|---------|
| USER | Who, role, context | "Junior frontend engineers working on a large TypeScript monorepo" |
| NEED | Action or outcome desired | "need faster feedback on component changes" |
| INSIGHT | Why they need it — from observation | "because the current 90-second rebuild cycle breaks flow state" |
| CONTRADICTION | What we assumed vs what we observed | "which surprises us because most build time is in dependencies that don't change between edits" |

**Complete POV example:**
"Junior frontend engineers working on a large TypeScript monorepo need faster feedback on component changes because the current 90-second rebuild cycle breaks flow state, which surprises us because most build time is in dependencies that don't change between edits."

**POV quality checklist:**
- [ ] Specific user (not "users" or "everyone")
- [ ] Real need (not a feature disguised as a need — "needs a button" is wrong)
- [ ] Insight grounded in observation (not assumption)
- [ ] Contradiction reveals a blind spot or assumption
- [ ] The POV would change if you observed different behavior

### P2.5 — How Might We (HMW) Questions

Transform insights into generative questions using HMW framing. Strong HMWs open the solution space without prescribing implementation.

**HMW transformation table:**

| Observation | Weak HMW (solution-biased) | Strong HMW (outcome-focused) |
|-------------|---------------------------|------------------------------|
| Users abandon checkout at payment | "HMW make payment work?" / "HMW add a progress bar?" | "HMW make paying feel as safe as handing cash to a friend?" |
| Engineers wait 90s for rebuild | "HMW make rebuild faster?" / "HMW add caching?" | "HMW eliminate the concept of rebuild entirely?" |
| New users don't complete onboarding | "HMW simplify onboarding?" / "HMW add a tutorial?" | "HMW make the first use feel like progress instead of setup?" |
| API users hit rate limits | "HMW increase the rate limit?" | "HMW make rate limits feel like a helpful constraint instead of a punishment?" |
| Support tickets about confusing errors | "HMW rewrite error messages?" | "HMW make every error contain a resolvable path forward?" |

**HMW generation techniques:**
1. **Amp up the challenge:** Make it impossible-sounding to force creative thinking
2. **Remove the obvious solution:** If the first idea is "add caching", reframe to forbid caching
3. **Change the subject:** "HMW make users..." to "HMW make the system..." to "HMW make the process..."
4. **Focus on emotion:** "HMW make users feel..." instead of "HMW make users do..."
5. **Flip the negative:** "HMW reduce errors" to "HMW make errors valuable"

**HMW quality gates:**
- Does not contain a specific solution (no "HMW add X")
- Opens a direction, not a task
- Would generate different ideas for different people
- Makes you think "I don't know but I want to explore"
----------------------------|--------------|--------------|-------------
Effectiveness (wt: [n])        | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
Effort (wt: [n])               | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
Risk (wt: [n])                 | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
Side effects (wt: [n])         | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
Reversibility (wt: [n])        | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
Maintenance (wt: [n])          | [0-10] -> [w] | [0-10] -> [w] | [0-10] -> [w]
TOTAL (weighted)               | [sum/w_sum]  | [sum/w_sum]  | [sum/w_sum]

Score justification:
  Solution A — Effectiveness [score]: [why this score]
  Solution A — Effort [score]: [estimation basis, assumptions, dependencies]

SELECTION: [chosen solution]
RATIONALE: [why this solution despite the scores?]
SENSITIVITY: [if we changed weights, would the selection change?]
```

#### P3.4.4 — Qualitative Factors Not Captured by Scores

| Factor | Questions to Ask |
|--------|-----------------|
| Learning opportunity | Does this teach us something valuable even if it fails? |
| Strategic alignment | Does this move us toward or away from long-term goals? |
| Team capability | Does the team have the skills and bandwidth? |
| Timing | Is this the right time? Or are we solving what's urgent vs important? |
| Stakeholder preference | Is there a strong stakeholder preference that should influence the choice? |
| Political capital | Does this solution build trust or erode it? |
| Opportunity cost | What will we NOT do if we choose this? |

If a lower-scored solution is selected due to qualitative factors, document the reasoning explicitly.

#### P3.4.5 — Decision Matrix for Design

For design-oriented problems, use the desirability-feasibility-viability Venn framework:

```
                  +-------------------------+
                  |     VIABLE              |
                  |   (Business can          |
                  |    sustain it)           |
                  |         |               |
                  |    +----+----+          |
                  |    |  SWEET  |          |
                  |    |  SPOT   |          |
                  |    |  ^      |          |
                  |    +--+------+          |
                  |       |                 |
                  +--------+----------------+
                           |
                    +------+------+
                    |             |
              DESIRABLE      FEASIBLE
              (Users want)   (We can build)
```

- **Desirable alone** -> Users want it, but we can't build it or sustain it -> revisit or partner
- **Feasible alone** -> We can build it, but nobody wants it or it doesn't make sense -> kill it
- **Viable alone** -> It makes business sense, but users don't want it and we can't build it -> dream
- **Desirable + Feasible** -> A hobby project or prototype -> find the business model
- **Desirable + Viable** -> A business opportunity -> find the technical path
- **Feasible + Viable** -> A technical solution looking for a problem -> validate demand
- **All three** -> The sweet spot -> build it

### P3.5 — Implementation Planning

#### P3.5.1 — Implementation Phasing Strategy

**When to use multiple phases vs single deployment:**

| Condition | Approach |
|-----------|----------|
| Low risk, simple change, well-understood | Single phase (ship it) |
| High risk, complex, many unknowns | Multiple phases with progressive rollout |
| Breaking changes | Multi-phase with deprecation window |
| Infrastructure / platform changes | Canary to Staged to Full rollout |
| User-facing changes | Feature flag to Beta to GA |

**Phase types:**

| Phase | Purpose | Duration | Success Criteria |
|-------|---------|----------|------------------|
| P0 — Preparation | Setup dependencies, prerequisites | Hours-days | Prerequisites green |
| P1 — Core | Implement the essential change | Days-weeks | Core functionality works |
| P2 — Polish | Edge cases, error handling, monitoring | Days | All edge cases handled |
| P3 — Release | Deploy to production | Hours | All success criteria met |
| P4 — Observe | Monitor for regressions | Days-weeks | No regression in 7 days |

#### P3.5.2 — Dependency Mapping

Map the dependency chain before implementing:

```
Implementation Task
  +-- Blocked by: [prerequisites that must be done first]
  +-- Blocks: [tasks that depend on this]
  +-- Resources needed: [people, tools, access]
  +-- Risks: [what could go wrong with this step]
```

**Dependency types:**

| Type | Example | Mitigation |
|------|---------|------------|
| Technical | Must deploy schema migration before code change | Order deployments correctly |
| External | Waiting for API key from vendor | Start process early, have fallback |
| Knowledge | Team member on leave who designed this | Documentation, shadowing |
| Approval | Security review required before production | Schedule review in advance |
| Data | Need representative dataset for testing | Synthetic data generation |

**Dependency resolution strategies:**

| Strategy | When to Use |
|----------|-------------|
| Parallelize | Dependencies are independent, work on both simultaneously |
| Serialize | Strict ordering required |
| Decouple | Break the dependency, make tasks independent |
| Mock/Fake | Dependencies aren't available yet, stub them |
| Skip | The dependency is optional, proceed without it |
| Escalate | Dependency is blocked by external factor, escalate for unblock |

#### P3.5.3 — Rollout Strategy

**Progressive rollout framework:**

| Stage | % Traffic | Duration | Verify |
|-------|-----------|----------|--------|
| Internal dogfood | 1 internal user | 1-2 days | Functional check, error logs |
| Canary | 1-5% of users | 1-2 days | Error rate, latency, business metrics |
| Partial | 25-50% | 2-3 days | Same metrics at scale |
| Full | 100% | Permanent | Continuous monitoring |

**Conditions to halt or roll back at any stage:**
- Error rate increases by >1% (absolute) compared to baseline
- P95 latency increases by >20%
- Business metric (conversion, engagement) drops by >5%
- Any P0/P1 incident triggered
- Any security vulnerability discovered

**Feature flag strategy:**

| Flag Type | Lifetime | Purpose | Implementation |
|-----------|----------|---------|----------------|
| Release toggle | Days-weeks | Control rollout of new features | Environment variable or config |
| Experiment toggle | Weeks-months | A/B testing | Random assignment with logging |
| Ops toggle | Permanent | Operational control (kill switch) | Canary/deploy-based |
| Permission toggle | Permanent | Control feature access by user segment | User attribute-based |

#### P3.5.4 — Rollback Plan

**Every implementation must have a documented rollback plan:**

```
CHANGE: [description of change]
ROLLBACK TRIGGER: [what specific condition triggers rollback?]
ROLLBACK ACTION: [exact commands or steps to revert]
ROLLBACK DURATION: [estimated time to fully rollback]
DATA RISK: [what data, if any, is at risk during rollback?]
COMMUNICATION: [who needs to be notified during rollback?]
```

**Rollback strategies by change type:**

| Change Type | Rollback Strategy | Data Safety |
|-------------|-------------------|-------------|
| Code change | Deploy previous version | Safe, no data change |
| Configuration | Revert config file / toggle off | Safe, no data change |
| Schema migration | Write down-migration | Depends, check for data loss |
| Data migration | Keep backup / dual-write until verified | Safe with dual-write |
| Infrastructure | Infrastructure as code, revert commit | Safe, recreate previous state |
| Feature flag | Toggle off | Safe, feature disappears |
| Third-party integration | Keep old integration active | Safe, switch back |

**Rollback testing checklist:**
- [ ] Rollback script written and reviewed
- [ ] Rollback tested in staging
- [ ] Rollback duration measured and acceptable
- [ ] Rollback trigger criteria defined
- [ ] Rollback communication plan in place
- [ ] Someone on call who can execute the rollback
- [ ] Rollback does not cause data loss (or data loss is accepted and documented)

#### P3.5.5 — Implementation Documentation Template

```
IMPLEMENTATION PLAN
====================
CHANGE: [one-line description]
OWNER: [who is implementing]
REVIEWER(S): [who must review]
DEPLOY DATE: [planned date]

PREREQUISITES:
  - [dependency 1 — status: DONE/IN PROGRESS/BLOCKED]
  - [dependency 2 — status: DONE/IN PROGRESS/BLOCKED]

IMPLEMENTATION STEPS:
  1. [step 1 — specific, actionable]
  2. [step 2 — specific, actionable]
  3. [step 3 — specific, actionable]

VERIFICATION AT EACH STEP:
  Step 1 verification: [how to confirm step 1 was successful]
  Step 2 verification: [how to confirm step 2 was successful]
  Step 3 verification: [how to confirm step 3 was successful]

ROLLBACK PLAN:
  Trigger: [what condition triggers rollback]
  Steps:
    1. [rollback step 1]
    2. [rollback step 2]
  Duration: [estimated time]

SUCCESS CRITERIA:
  - [criterion 1 — specific and measurable]
  - [criterion 2 — specific and measurable]

MONITORING:
  - [metric 1 to watch post-deploy]
  - [metric 2 to watch post-deploy]
  - Alert threshold: [what should trigger an alert]

COMMUNICATION:
  - Stakeholders to notify before deploy: [who]
  - Stakeholders to notify after deploy: [who]
  - Channels: [Slack channel, email, etc.]
```

### P3.6 — Verification & Measurement

#### P3.6.1 — Hypothesis Testing Framework

Every solution is a hypothesis. State it explicitly before implementing.

```
HYPOTHESIS: We believe [solution] will result in [outcome].
Because we have observed [evidence] that suggests [causal mechanism].
We will know this is true when [specific measurable signal].

NULL HYPOTHESIS: The solution has no effect on [metric].
We cannot reject the null hypothesis if [conditions where null holds].
```

**Hypothesis examples:**

```
Weak: "Adding caching will make the API faster."
Strong: "Adding Redis cache with 1-hour TTL on GET /users will reduce
P95 latency from 3.0s to <500ms, because the query scans 5M rows and
the data changes less than once per hour."
```

```
Weak: "Improving error messages will help developers."
Strong: "Showing a fix suggestion before the stack trace will reduce
mean time to resolve build errors from 4.2min to <2min for junior
engineers, because currently they spend most of that time figuring out
where to look."
```

#### P3.6.2 — A/B Testing Framework

**When to use A/B testing:**
- You have sufficient traffic (1000+ users per variant for meaningful results)
- You can cleanly separate users into control and treatment groups
- The metric you care about is measurable in days to weeks
- The change is reversible and low-risk

**A/B test design:**

```
HYPOTHESIS: Variant B will increase [metric] by [effect size] compared to control.
Sample size needed: [formula-based calculation]
Duration: [minimum time to reach statistical significance]

METRICS:
  Primary: [one metric — what matters most]
  Secondary: [supporting metrics]
  Guardrail: [metrics that must not degrade]

STATISTICAL SIGNIFICANCE: p < 0.05
MINIMUM DETECTABLE EFFECT: [what change is worth shipping?]

VARIANTS:
  Control (A): [current behavior — no change]
  Treatment (B): [new behavior — single variable change]

TESTING PROTOCOL:
  1. Random assignment of users to A/B
  2. Run for minimum [time period] to capture full cycle
  3. After [N] users in each variant, check significance
  4. Stop early only if guardrail metric is violated (safety stop)
  5. If treatment wins: ship to 100%
  6. If inconclusive: analyze, possibly redesign test
  7. If null or negative: analyze why, do not ship
```

**Common A/B testing pitfalls:**

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Peeking | Checking results every hour, stopping when p < 0.05 | Pre-register analysis time, use sequential testing |
| Multiple metrics | Running 20 metrics, 1 is significant by chance | Bonferroni correction, pre-register primary metric |
| Sample ratio mismatch | Different sample sizes in A/B due to bug | Check randomization, log assignment |
| Novelty effect | New feature gets more attention initially | Run long enough to see steady state |
| Carryover effect | Previous treatment affects current behavior | Use between-subjects design, washout periods |
| Simpson's paradox | Overall result reverses in subgroups | Pre-register subgroups, check consistency |

#### P3.6.3 — Metrics Design

**Every verification needs metrics. Design them before implementing:**

| Metric Type | Definition | Example | Good? |
|-------------|------------|---------|-------|
| Absolute | Direct measurement | "P95 latency = 500ms" | Good for baselines |
| Relative | Compared to baseline | "50% reduction in errors" | Good for improvements |
| Rate | Per-unit measurement | "Errors per 1000 requests" | Good for scaling comparisons |
| Distribution | Spread of values | "P50=100ms, P95=500ms, P99=2s" | Better than averages |
| Ratio | One metric divided by another | "Cache hit ratio = 95%" | Good for efficiency |

**Verification metrics by problem type:**

| Problem Type | Primary Metric | Secondary Metrics | Timeframe |
|-------------|----------------|-------------------|-----------|
| Performance | P95 latency | P50, P99, throughput, error rate | 24 hours |
| Reliability | Uptime / availability | Error rate, time to recover | 7-30 days |
| Usability | Task completion rate | Time on task, error count, satisfaction | Per session |
| Conversion | Conversion rate | Funnel drop-off at each step | 1-4 weeks |
| Cost | Cost per request/transaction | Total cost, cost trend | Monthly |
| Quality | Bug escape rate | Test coverage, MTTR for production bugs | Per release |

#### P3.6.4 — Success Criteria Design

**Rules for success criteria:**
1. **Specific:** Exact measurement, not vague direction ("faster" -> "P95 < 500ms")
2. **Measurable:** Can be collected with existing tools
3. **Achievable:** Realistic given the solution scope
4. **Relevant:** Directly tied to the problem definition
5. **Time-bound:** "Within 24 hours of deploy" not "eventually"
6. **Counter-evidence:** Define what data would prove the solution DID NOT work

**Success criteria template:**

```
CRITERION: [metric] [operator] [threshold] at [timeframe]
COUNTER-EVIDENCE: [condition that proves failure]

Example:
CRITERION: P95 checkout latency < 500ms for 24 consecutive hours post-deploy
COUNTER-EVIDENCE: Any 5-minute window where P95 > 500ms in the first 24 hours
```

**Success criteria examples by problem type:**

| Problem | Strong Criterion | Weak Criterion |
|---------|-----------------|----------------|
| Slow API | "P95 latency < 500ms sustained for 24h" | "API will be faster" |
| Bug fix | "Error rate drops from 5% to <0.1%" | "Bug is fixed" |
| User onboarding | "Onboarding completion rate from 30% to >70%" | "Better onboarding" |
| Cost reduction | "Monthly infra cost drops >25% without SLA degradation" | "Lower costs" |
| Developer experience | "Mean time to deploy from 45min to <15min" | "Easier deploy process" |

#### P3.6.5 — Verification Protocol

**Before implementation:**
- [ ] Pre-deploy metrics collected (baseline)
- [ ] Success criteria defined and documented
- [ ] Counter-evidence defined
- [ ] Measurement tools confirmed working
- [ ] Monitoring dashboards set up

**During implementation:**
- [ ] Metrics recorded at each phase (not just final)
- [ ] Any unexpected metric movement logged
- [ ] Rollback trigger criteria monitored

**After implementation:**
- [ ] Compare post-deploy metrics to baseline
- [ ] Check against all success criteria
- [ ] Check counter-evidence did NOT occur
- [ ] Run for full observation period before declaring done
- [ ] Document learnings: what worked, what didn't, what surprised

**Post-verification documentation:**

```
VERIFICATION REPORT
====================
CHANGE: [description]
DATE: [verification date]

BASELINE: [pre-change metric values]
POST-DEPLOY: [post-change metric values]

SUCCESS CRITERIA:
  [criterion 1]: [met/not met] — [evidence]
  [criterion 2]: [met/not met] — [evidence]

COUNTER-EVIDENCE CHECK:
  [condition 1]: [did not occur / occurred — explanation]

UNEXPECTED EFFECTS:
  [any positive or negative effects not in criteria]

CONCLUSION: [problem solved / partially solved / not solved]
LEARNINGS: [what to do differently next time]
```


## P5 — WORKED EXAMPLES

### E1: Memory Leak in Node.js Service

**Define:**
"Memory usage grows from 200MB to 2GB over 24 hours, then OOM kills the process and it restarts. Target: stable memory < 500MB over 72 hours."

**Analyze:**
- Heap snapshot 1 (after restart): 200MB, 50MB retained
- Heap snapshot 2 (after 12h): 1.2GB, 800MB retained
- Comparison: EventEmitter listeners growing unbounded
- Root cause: WebSocket connections register listeners but cleanup on 'close' is missing for one event type. Each connection that disconnects orphaned listeners hold references to connection objects.

**5 Whys:**
```
Symptom: Service OOM-killed every 24 hours
  Why? -> Memory grows from 200MB to 2GB over 24 hours
    Why? -> EventEmitter listeners accumulate without cleanup
      Why? -> WebSocket close handler doesn't clean up one event type
        Why? -> Cleanup was in the connect handler but not the disconnect handler
          Why? -> Developer assumed symmetric connect/disconnect lifecycle
            ROOT CAUSE: Incomplete lifecycle management pattern
```

**Generate:**
- Solution A: Add close handler cleanup for missing event (2 lines, 15 min)
- Solution B: Add listener count monitoring + alert (1 hour)
- Solution C: Replace EventEmitter with bounded emitter (1 day, library change)
- Solution D: Restart service daily as stopgap (5 min cron)

**Evaluate:**

| Dimension | Solution A | Solution B | Solution C | Solution D |
|-----------|-----------|-----------|-----------|-----------|
| Effectiveness | 10 (solves root cause) | 3 (monitors only) | 10 (prevents class) | 1 (masks symptom) |
| Effort | 10 (15 min) | 8 (1 hour) | 3 (1 day) | 10 (5 min) |
| Risk | 10 (standard pattern) | 9 (read-only) | 6 (library change) | 8 (scheduled restart) |
| Side effects | 9 (minimal) | 10 (none) | 7 (dependency added) | 5 (brief downtime) |
| Reversibility | 10 (instant) | 10 (instant) | 5 (moderate) | 10 (remove cron) |
| Maintenance | 10 (none) | 7 (monitor config) | 8 (library updates) | 5 (cron management) |

**Select:** A + B (fix + monitoring for recurrence)
- A fixes the root cause with minimal effort and risk
- B ensures we detect if the same pattern recurs elsewhere
- C is over-engineered for one missed cleanup
- D is a workaround that masks the problem

**Implement:**
1. Add cleanup in WebSocket close handler: `ws.off('message', handler)`
2. Add listener count metric per EventEmitter
3. Deploy during low-traffic window
4. Monitor for 72 hours

**Verify:**
- Before fix: P95 memory = 2GB at 24h, OOM restart at 26h
- After fix: P95 memory = 320MB stable at 72h, no OOM
- Listener count: dropped from 15K orphaned to < 100 active
- Counter-evidence: if memory creeps above 500MB in 72h, fix is incomplete
- Success criteria met: stable memory < 500MB over 72 hours

### E2: CI Pipeline Time Degradation

**Define:**
"CI pipeline took 8 minutes 3 months ago, now takes 35 minutes. Target: < 10 minutes."

**Analyze:**
- Timeline: degradation started 8 weeks ago
- Change analysis: added end-to-end test suite (6 weeks ago) and dependency audit step (8 weeks ago)
- Data: e2e tests take 18 minutes. Dependency audit downloads all packages fresh each time. No caching configured.

**5 Whys:**
```
Symptom: CI pipeline takes 35 minutes (was 8 minutes)
  Why? -> Two new steps take 26 minutes combined
    Why? -> No caching for e2e tests or dependency audit
      Why? -> Caching was never configured when these steps were added
        Why? -> Adding steps was urgent, no process review
          Why? -> No CI change review process exists
            ROOT CAUSE: Missing process for CI pipeline changes
```

**Generate:**
- A: Enable caching for dependency audit and e2e test artifacts (2 hours)
- B: Run e2e tests only on merge to main, not every PR (1 config change)
- C: Parallelize e2e test suite across 3 runners (4 hours, infra change)
- D: Revert to 3-month-old pipeline and re-add steps with caching (risky)

**Evaluate:**
- A solves the most with least effort. B reduces PR feedback latency. C adds complexity. D is risky.

**Select:** A + B (cache + reduce e2e frequency)
- A reduces total time by 18+ minutes
- B keeps PRs fast while maintaining quality on main
- C can be added later if needed

**Verify:**
- Before: 35 minutes
- After: 9 minutes
- E2e still runs on main merge, catches regressions before deploy
- Counter-evidence: if any PR takes >15 min, investigate

### E3: Data Inconsistency in Reporting

**Define:**
"Weekly revenue report shows different totals than the finance team's records. Gap is 0.5-2% varying week to week. Target: gap < 0.1% or explainable."

**Analyze:**
- Finance team records match bank deposits (source of truth)
- Revenue report queries from orders table filtered by created_at
- Gap analysis: missing orders where payment captured on different day than order creation
- Root cause: Orders created at 11:59 PM, payment captured at 12:01 AM next day. Report uses order creation date, finance uses payment capture date. 0.5-2% variation corresponds to daily volume at the midnight boundary.

**Generate:**
- A: Change report to use payment capture timestamp instead of order creation (2 hours)
- B: Add 5-minute buffer to midnight boundary handling (1 hour)
- C: Document the discrepancy as expected behavior (30 min)
- D: Reconcile both sources with matching logic (1 week)

**Select:** A (use payment capture timestamp — aligns with finance's source of truth)

**Verify:**
- With payment capture timestamp, next weekly report matches within 0.02% (rounding)
- Root cause eliminated at the source
- Counter-evidence: if any week shows >0.1% gap, investigate further

### E4: Feature Launch Performance Regression

**Define:**
"After deploying the 'search autocomplete' feature, homepage load time increased from 1.2s to 3.4s P75. Target: restore to < 1.5s P75."

**Analyze:**
- Deployment diff: added autocomplete API call on homepage load
- API call: GET /autocomplete?q= (no query, returns trending searches)
- Query: SELECT * FROM searches GROUP BY query ORDER BY count DESC LIMIT 10
- EXPLAIN ANALYZE: sequential scan + sort on 2M rows — 2.1s
- Root cause: Autocomplete endpoint not designed for homepage load. Trending query is expensive. API called on every homepage visit.

**Empathy (for the developer consuming this API):**
- THINKS: "I just added the feature, why is everything slow?"
- DOES: Checks production, sees high latency
- FEELS: Frustrated, worried about rollback decision
- Need: Must deploy features without degrading existing functionality

**Generate:**
- A: Cache trending results with 1-hour TTL (2 hours)
- B: Remove autocomplete from homepage, add to search page only (1 hour)
- C: Materialize trending searches view, refresh hourly (3 hours)
- D: Optimize query with partial index on last_24h only (1 hour)

**Select:** A (cache) — keeps feature, reduces load, low effort. Combined with D if needed.

**Verify:**
- Homepage P75 restored to 1.3s
- Autocomplete data is at most 1 hour stale (acceptable)
- Cache hit ratio: 99.7%
- Counter-evidence: if P75 > 1.5s after cache deploy, investigate further

### E5: Multi-Service Auth Token Expiry

**Define:**
"Users are intermittently logged out with 'token expired' errors. Affects 5% of sessions. Expected: 0% expired token errors under normal operation."

**Analyze:**
- Token lifetime: 1 hour
- Error occurs between 55-65 minutes after login
- Intermittent: not all users affected
- Comparison of working vs failing requests:
  - Failing: token issued at T, service clock is 2 minutes ahead
  - Working: token issued at T, service clock synchronized
- Root cause: Clock skew between auth service (issues token at server time) and API gateway (validates at gateway time). Gateway clock drifts up to 3 minutes fast. Tokens issued near the end of their lifetime get rejected.

**Generate:**
- A: Add 5-minute clock skew tolerance in token validation (config change, 15 min)
- B: Sync all server clocks with NTP, add monitoring (2 hours)
- C: Reduce token lifetime to 30 minutes (not a fix, makes diagnosis faster)
- D: Centralized token validation instead of per-service (1 week)

**Select:** A + B. Fix the symptom while fixing the root cause.

**Verify:**
- Clock skew tolerance eliminates all user-facing errors
- NTP monitoring catches future drift before it matters
- Counter-evidence: if any user still gets expired token errors after fix

### E6: E-Commerce Checkout Abandonment

**Situation:** 68% abandonment at payment step. User interviews reveal they "feel unsafe." Journey mapping shows the gap: users land on a 12-field form with no progress indicator.

**Empathize:**
User persona: Online shopper, age 30-45, has bought online before, mobile device, evening context.

**Empathy map:**
- SAYS: "I'll come back later"
- THINKS: "I don't trust this site with my card"
- DOES: Closes tab, opens competitor site
- FEELS: Anxious, distrustful, frustrated

**Define:**
"Online shoppers need to complete payment with the same confidence as handing cash to a cashier, because they associate form length with risk and complexity, which surprises us because the payment processor is PCI-compliant but the UX signals otherwise."

**HMW:**
"HMW make paying feel as safe as handing cash to a friend?"
"HMW make the payment form feel as minimal as handing over cash?"
"HMW eliminate the gap between trust and reality?"

**Ideate:**
12 ideas generated. Selected:
1. Reduce to 3 fields (card number, expiry, CVV) instead of 12
2. Auto-populate saved card info
3. Visual security cues (lock icon, known badge, minimal form)
4. Progress indicator showing "3 of 3 — Payment"
5. Money-back guarantee badge

**Prototype:**
Coded prototype tested with 8 users.
- Before redesign: 68% abandonment, avg time 4.2 min
- After redesign: 22% abandonment, avg time 1.1 min

**Result:**
Production implementation saw 15% increase in completed purchases.

### E7: Build Tool Error Output Redesign

**Situation:** Developers using a CLI build tool say "errors are confusing." Empathy mapping reveals they actually think "I don't know what to do next" — the gap between SAYS and THINKS.

**Empathize:**
- SAYS: "The errors are confusing"
- THINKS: "I don't know what to do next"
- DOES: Reads error, copies to Google, searches Stack Overflow, tries random fix
- FEELS: Frustrated, inadequate, stupid

**Define:**
"Junior frontend developers building a TypeScript project need to know the next action after a build failure, not just the error location, because reading a stack trace in isolation doesn't tell them what to change, which surprises us because senior engineers read stack traces fluently but juniors don't."

**HMW:**
"HMW make every error message contain a resolvable path forward?"

**Ideate:**
12 ideas generated. Selected:
1. Error-first output — print the fix suggestion before the trace
2. Ranked errors — only show top 3
3. Searchable error codes with docs links
4. Color-coded severity indicator

**Prototype:**
Paper mockups of error output before and after. Tested with 5 junior engineers.
- Before: mean time to fix = 4.2 min
- After: mean time to fix = 1.1 min
- All 5 resolved errors faster with the new format

**Verify:**
- 4x improvement in error-to-fix time
- Support tickets about build errors reduced by 60%
- NPS for developer experience improved from 42 to 68
- Counter-evidence: if error resolution time increases for senior engineers, reconsider approach


## P7 — QUALITY GATES

### P7.1 — Tier 1 — Hard Block (Fail = Reject Output)

These gates must pass before any solution can be considered complete. If any fails, the output is rejected.

**Problem Definition:**
- [ ] Problem defined in one sentence with current vs. desired state
- [ ] Problem scope explicitly bounded (in scope / out of scope)
- [ ] Problem framed as a user or stakeholder need (not a feature request)
- [ ] At least one observation from real user behavior or system data (not pure assumption)

**Analysis:**
- [ ] Root cause analysis performed using a structured method (P3.2)
- [ ] Problem classified on at least 3 of 5 dimensions (scope, clarity, stability, scale, recurrence)
- [ ] Empathy map or user research artifact completed for primary persona (if user-facing)
- [ ] Journey map shows 3+ stages (if user-facing)

**Solution Generation:**
- [ ] At least 3 distinct solution candidates generated
- [ ] Solutions from at least 2 different approaches/categories (not 3 minor variations of the same idea)

**Evaluation:**
- [ ] Solution evaluated on all 6 evaluation dimensions (P3.4.1)
- [ ] Selection criteria are explicit (why this solution over alternatives)
- [ ] Verification criteria defined before implementation

**Implementation:**
- [ ] Rollback or reversal plan documented
- [ ] Implementation steps specified with verification at each step

**Verification:**
- [ ] Pre-deploy metrics collected (baseline)
- [ ] Post-implementation verification data collected and stated
- [ ] Counter-evidence check performed (what would prove the solution didn't work)

### P7.2 — Tier 2 — Standard Gates

These gates represent best practices. Passing them increases confidence in the solution.

**Problem Definition:**
- [ ] POV statement written and falsifiable
- [ ] HMW question does not contain a solution
- [ ] Stakeholders identified and consulted
- [ ] Constraints documented

**Analysis:**
- [ ] Problem fully classified on all 5 dimensions
- [ ] Solution type identified (corrective, preventive, adaptive, perfective, workaround)
- [ ] Generation technique noted (P3.3)
- [ ] At least one technique from the design thinking toolkit applied (empathy map, journey map, POV, HMW)

**Solution Generation:**
- [ ] 5+ solutions considered (not the minimum 3)
- [ ] At least one "wild" or unconventional idea considered
- [ ] Ideas evaluated using prioritization matrix (impact vs. effort)
- [ ] Prototype fidelity matches the learning goal (not higher than necessary)

**Evaluation:**
- [ ] Weighted scoring used with explicit weights per context
- [ ] Sensitivity analysis performed (does ranking change with different weights?)
- [ ] Qualitative factors considered beyond scores
- [ ] Trade-offs explicitly documented and discussed

**Implementation:**
- [ ] Progressive rollout strategy defined (canary, staged, full)
- [ ] Feature flag or kill switch implemented
- [ ] Monitoring and alerting configured before deploy
- [ ] Communication plan documented
- [ ] Post-deploy observation period defined (check for regressions)

**Verification:**
- [ ] Success criteria are SPECIFIC + MEASURABLE + TIME-BOUND
- [ ] A/B testing framework used (if applicable to the problem)
- [ ] Hypothesis stated in formal format (P3.6.1)
- [ ] Testing includes real users (not just team review)
- [ ] Feedback integrated before next iteration

### P7.3 — Self-Audit Checklist

Run this checklist before declaring any work complete:

```
PROBLEM-SOLVING AUDIT:
  Problem defined with current vs. desired state?        [yes/no]
  Problem scope bounded (in/out of scope)?              [yes/no]
  Root cause identified using structured method?        [yes/no]
  3+ distinct solutions generated?                      [yes/no]
  Solution evaluated on all 6 dimensions?               [yes/no]
  Verification criteria defined pre-implementation?     [yes/no]
  Baseline metrics collected?                           [yes/no]
  Post-fix verification data collected?                 [yes/no]
  Rollback plan documented?                             [yes/no]
  Problem classified on 5 dimensions?                   [yes/no]
  Counter-evidence check performed?                     [yes/no]
  Solution within original scope?                       [yes/no]
  Monitoring added for recurrence?                      [yes/no]

DESIGN THINKING AUDIT:
  Problem framed as user need (not feature)?            [yes/no]
  Real observation vs. assumption basis?                [yes/no]
  Empathy map or user research completed?               [yes/no]
  Journey map shows 3+ stages?                          [yes/no]
  POV statement written and falsifiable?                [yes/no]
  HMW question does not contain a solution?             [yes/no]
  3+ alternatives considered before selection?          [yes/no]
  Selection criteria explicit and weighted?             [yes/no]
  Prototype fidelity matches learning goal?             [yes/no]
  Prototype tested with 3+ users from target persona?  [yes/no]
  Success metric measures behavior change?              [yes/no]
  Feedback integrated before next iteration?            [yes/no]
  Testing plan includes real users (not just team)?     [yes/no]

INTEGRATION AUDIT:
  Did we apply tools from BOTH traditions?              [yes/no]
  Did we choose the right emphasis (P2.1)?              [yes/no]
  Did we avoid anti-patterns (P6)?                      [yes/no]
  Did we document our reasoning for posterity?          [yes/no]
  Can someone else understand AND reproduce our logic?  [yes/no]
```

### P7.4 — Quality Gate Application Guide

**When to apply quality gates:**
- Before starting: review problem framing (Tier 1)
- Before solution selection: review analysis and options (Tier 1 + Tier 2)
- Before implementation: review evaluation and verification plan (Tier 1)
- Before shipping: review implementation and rollback plan (Tier 1 + Tier 2)
- After verification: review results and learnings (Tier 1)

**Gate escalation process:**

```
GATE FAILURE:
  1. Identify which gate failed and why
  2. Determine severity:
     - Tier 1 failure: STOP. Fix before proceeding.
     - Tier 2 failure: PAUSE. Discuss whether to fix now or defer.
  3. Fix the issue:
     - Update problem definition, analysis, or solution
     - Re-run the gate check
  4. Document:
     - What failed
     - What was fixed
     - What was learned

GATE BYPASS (emergency only):
  - Must be approved by a decision-maker above the team
  - Must be documented with rationale
  - Must have a plan to address the gap post-deploy
  - Only applicable for Tier 2 gates, NEVER Tier 1
```

### P7.5 — Decision Documentation

Every significant decision should be documented for future reference. Use this template:

```
DECISION RECORD
===============
DATE: [date]
DECISION: [what was decided]
CONTEXT: [what prompted this decision]

OPTIONS CONSIDERED:
  1. [Option A] — Pro: [pro] — Con: [con]
  2. [Option B] — Pro: [pro] — Con: [con]

RATIONALE: [why this option was chosen]
TRADE-OFFS: [what was given up by this choice]
SENSITIVITY: [would different weighting change this decision?]

EXPECTED OUTCOME: [what we expect to happen]
MEASUREMENT: [how we will know if this was right]

CONSIDERED BUT REJECTED:
  [option] — Rejected because: [reason]
  [option] — Rejected because: [reason]

FOLLOW-UP: [who will verify the outcome by when]
```


*Synarc S1 WorkType classification, S2 risk hard floors, S13 quality gates, S14 language rules, S17 zero-tolerance violations apply. Ledger entry for every problem-solving and design thinking engagement.*
