---
name: decision-engineer
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
title: Decision Engineer â€” Structured Decision Frameworks & Trade-off Analysis
description: Structured decision frameworks, trade-off analysis, decision trees, weighted scoring, cost-benefit reasoning, cost of delay (CD3/WSJF), decision under uncertainty, coupling analysis, reversible/irreversible classification, opportunity cost, group decision-making (RAPID/DACI), ADR documentation, pre/post-mortem techniques. How to make and document technical decisions with clarity and justification.
version: 2.0.0
category: engineering-intelligence
tags:
  - decision-making
  - trade-off-analysis
  - decision-trees
  - weighted-scoring
  - cost-benefit
  - cost-of-delay
  - wsjf
  - opportunity-cost
  - decision-coupling
  - reversibility
  - expected-value
  - minimax-regret
  - group-decision-making
  - adr
  - structured-reasoning
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
priority: high
---

# Decision Engineer â€” Structured Decision Frameworks & Trade-off Analysis

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S13 quality gates, S14 language rules, S17 zero-tolerance violations). All synarc prohibitions and tracking protocols apply.

Decisions are the atomic unit of engineering progress. Every line of code, every architecture choice, every library dependency, every config change is the residue of a decision. Most engineering debt is not bad code â€” it is the accumulation of implicit, undocumented decisions that nobody remembers making.

This framework provides a complete system for making, documenting, and reviewing engineering decisions. It covers the full lifecycle: **framing** the decision correctly, **analyzing** alternatives with the right tools, **deciding** with appropriate rigor, **documenting** for future engineers, and **reviewing** when context changes.

Four principles govern this framework:

1. **Rigor matches reversibility.** Analysis depth is proportional to the cost of being wrong. HOURS-reversible decisions get minutes; IRREVERSIBLE decisions get days.
2. **Explicit over implicit.** A documented mediocre decision beats an undocumented perfect one because it can be revisited. An implicit decision is invisible and therefore unreviewable.
3. **Alternatives define quality.** The quality of a decision is bounded by the quality of the best alternative you considered. Three thoughtfully generated alternatives beat a hundred casually listed ones.
4. **Process over outcome.** Judge decisions by their reasoning, not their results. A good decision can produce a bad outcome due to luck. A bad decision can succeed due to the same. Evaluate the process; track outcomes to improve calibration.



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


## P2 â€” CORE FRAMEWORKS

### P2.1 â€” The Decision Triad

All structured decisions follow a three-phase cycle:

```
FRAME   â†’ Structure: alternatives Ã— criteria Ã— weights
ANALYZE â†’ Score, quantify uncertainty, identify trade-offs, run sensitivity
DECIDE  â†’ Select, document, plan for reversal if conditions change
```

The triad is iterative. If analysis reveals the frame is wrong (missing alternatives, wrong criteria), return to FRAME. If new information arrives, return to ANALYZE.

#### P2.1.1 â€” Decision Framing Patterns

| Pattern | When to Use | Frame Structure |
|---------|-------------|-----------------|
| GO/NO-GO | Binary go/no-go with clear threshold | Single alternative vs "don't do it" |
| SELECT | Choose one from many | Multiple alternatives, winner-take-all |
| PRIORITIZE | Rank order for sequential execution | All ranked, top N executed |
| ALLOCATE | Distribute limited resources | Budget/capacity split across options |
| DEFER | Delay decision, keep options open | Decision tree with "wait" as an alternative |
| CONDITIONAL | Decide now, but with triggers | "If X happens, do Y; otherwise Z" |

#### P2.1.2 â€” Frame Quality Checklist

Before leaving the FRAME phase, verify:

- [ ] The decision question is specific and unambiguous
- [ ] At least 3 alternatives exist (including "do nothing" and one creative option)
- [ ] "Do nothing" is the honest default, not a straw man
- [ ] Each alternative is mutually exclusive from others
- [ ] Exclusion criteria are explicit: "Not in scope: X, Y, Z"
- [ ] All relevant stakeholders are identified
- [ ] The decision class is determined (P2.2)
- [ ] The timebox for the decision is set (proportional to reversibility)
- [ ] What would count as a "good outcome" is defined


### P2.3 â€” Decision Types by Uncertainty

| Type | Uncertainty | Method | Example |
|------|-------------|--------|---------|
| Certain | Known outcomes, known probabilities | Direct comparison | Which hosting plan at 1000 req/s? |
| Risky | Known outcomes, unknown probabilities | Expected value, decision trees | Should we rewrite the frontend? |
| Ambiguous | Unknown outcomes, unknown probabilities | Scenario planning, maximin/maximax | Which cloud provider for a new region? |
| Preferential | Outcomes depend on stakeholder values | Weighted scoring, MAUT | Which feature set for Q3? |


### P2.5 â€” Reversible vs Irreversible Protocol

```
DECISION ENCOUNTERED
        â”‚
        â–¼
REVERSIBILITY TEST (P2.4)
        â”‚
    â”Œâ”€â”€â”€â”´â”€â”€â”€â”
    â”‚       â”‚
 REVERSIBLE  IRREVERSIBLE
    â”‚       â”‚
    â–¼       â–¼
Low rigor,     High rigor,
fast,          slow,
delegate,      document,
default to     multiple
action         alternatives
    â”‚       â”‚
    â””â”€â”€â”€â”¬â”€â”€â”€â”˜
        â”‚
        â–¼
  DECISION MADE
  AND RECORDED
```

Jeff Bezos' rule: "Most decisions should be made with about 70% of the information you wish you had. If you wait for 90%, you'll be slow."


### P2.7 â€” Opportunity Cost Analysis

Every decision excludes alternatives. The value of the best foregone alternative is the opportunity cost.

```
Opportunity cost = Value of best option NOT chosen

For any decision:
  1. List all options considered
  2. Score each using weighted matrix
  3. Opportunity cost = score of the best option not chosen
  4. If opportunity cost > 80% of chosen option's score â†’ decision is tight, document why
```

**What opportunity cost does NOT mean:**
- "We should do everything" â€” that ignores real constraints
- "We chose wrong" â€” close trade-offs are normal, not errors
- "We need more analysis" â€” tight decisions benefit from tiebreaker rules, not more data

**When to use:** After every decision, document the opportunity cost. This creates a record for when circumstances change and that alternative becomes viable.


### P2.9 â€” Cost-Benefit Reasoning

Engineering decisions have multi-dimensional costs and benefits. Capture all five dimensions:

| Dimension | Cost | Benefit |
|-----------|------|---------|
| EFFORT | Implementation hours, learning curve | Hours saved per month, automation |
| RISK | Migration cost if wrong, uncertainty | Option value of new capability, risk reduction |
| VALUE | Feature delay, opportunity cost | Revenue, user satisfaction, business outcome |
| TIME | Calendar time to delivery | Time saved, faster feedback loops |
| OPPORTUNITY | What we cannot do instead | Future options kept open |

**Conversion rule:** Non-monetary costs and benefits must be convertible to a common unit (hours, risk points, utility score) or left as qualitative constraints that can veto a decision.

**Cost-benefit decision rule:** Select the option with the highest net benefit (total benefits âˆ’ total costs) when all dimensions are converted to the same unit. If conversion is not possible, use a weighted matrix with qualitative dimensions clearly marked.


### P2.11 â€” Expected Value Calculation

#### P2.11.1 â€” Expected Monetary Value (EMV)

```
EMV = Î£(Probability_i Ã— Value_i) for each outcome path

Decision rule: Choose the path with the highest EMV.
```

**Simple EMV example:**
```
Build feature in-house:
  - 70% success: value = $200K
  - 30% failure: value = -$50K
  EMV = (0.7 Ã— 200K) + (0.3 Ã— -50K) = $125K

Buy solution:
  - 90% success: value = $150K
  - 10% failure: value = -$20K
  EMV = (0.9 Ã— 150K) + (0.1 Ã— -20K) = $133K

Decision: Buy (higher EMV)
```

#### P2.11.2 â€” Decision Trees with Probabilities

```
Decision tree structure:
  Root: The decision
  Branches: Alternatives
  Chance nodes: Uncertain outcomes (circle)
  Leaf nodes: Final values (rectangle)

Roll-back calculation:
  For each chance node: EMV = Î£(P Ã— V) for all branches
  For each decision node: choose max EMV among branches
```

**Decision tree rules:**
- Probabilities at each chance node sum to 1.0
- All leaf values use the same unit (standardize to time, cost, or utility score)
- Sensitivity: vary each probability Â±20% â€” if optimal choice changes, the decision is sensitive to that assumption


### P3.2 â€” Expected Value with Cost of Delay

Combine EMV with CoD for prioritization:

```
Adjusted EMV = EMV âˆ’ CoD(delay)

Where CoD(delay) = Value per week Ã— Weeks delayed
```

**Example: Two feature candidates**

| Feature | EMV | Duration | CoD/week | CoD (4wk delay) | Adjusted EMV |
|---------|-----|----------|----------|-----------------|--------------|
| Auth rewrite | $120K | 6 weeks | $15K/wk | $60K | $60K |
| Search upgrade | $80K | 2 weeks | $5K/wk | $20K | $60K |

Both have same adjusted EMV at 4-week delay. Tiebreaker: search upgrade delivers value faster (2 weeks vs 6 weeks), reducing execution risk.


### P3.4 â€” Consequence Scanning

For each option, scan three time horizons. This prevents short-term thinking from locking in long-term problems.

| Horizon | Question | Method |
|---------|----------|--------|
| SHORT (1 week) | What immediately breaks? | Rollback test, deployment plan |
| MEDIUM (1 quarter) | What must we maintain? | Maintenance cost estimate, team load |
| LONG (1 year+) | What future options close? | Coupling analysis, platform lock-in |

**Consequence scanning template:**

```
Option: [name]
  Short: [day 1-7 impacts]
  Medium: [week 1-12 impacts]
  Long: [quarter 1-4 impacts]
  Future options kept open: [list]
  Future options closed: [list, with justification]
```

**Rule:** If a decision closes more future options than it keeps open, it must have proportionally higher short-medium value.

---

### P3.5 â€” Trade-Off Surface Mapping

Visualize decisions as trade-off surfaces where you cannot simultaneously optimize for all dimensions.

```
High â”¤â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
     â•‘     OPTION A          â•‘
     â•‘  (fast, less quality) â•‘
Spd  â•‘                      â•‘
     â•‘        OPTION B       â•‘
     â•‘   (balanced)          â•‘
Low  â•‘              OPTION C â•‘
     â•‘     (quality, slow)   â•‘
     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
       Low              High
              QUALITY
```

#### P3.5.1 â€” Reading the Surface

- The curve represents the **feasible region** â€” you cannot be above and to the right
- Options on the curve are **Pareto-optimal** â€” you cannot improve one dimension without worsening another
- Options inside the curve are sub-optimal â€” a better option exists on the curve
- Anyone claiming no trade-off exists either hasn't understood the problem or is deceiving

#### P3.5.2 â€” Common Engineering Trade-Off Surfaces

| Trade-Off | Dimension 1 | Dimension 2 | Typical Shape |
|-----------|-------------|-------------|---------------|
| Speed vs quality | Development speed | Code quality / test coverage | Convex |
| Cost vs performance | Infrastructure cost | Latency / throughput | Concave |
| Flexibility vs simplicity | Extensibility | Ease of use / learning curve | Convex |
| Speed vs safety | Deploy frequency | Incident rate / stability | Convex |
| Build vs buy | Time to value | Customizability | Step function |

---

### P3.6 â€” Pre-Mortem Technique

Before finalizing a decision, assume it failed completely and work backward:

```
Assume it is 12 months from now. The decision failed catastrophically.

List all reasons. For each reason:
  1. Was this risk identified before the decision?
  2. What mitigation was in place?
  3. What signal would have warned us earlier?
  4. Is this failure scenario plausible AND unmitigated?

If any failure scenario is both plausible and unmitigated: REVISIT.
```

**Pre-mortem facilitation:**
- Do this BEFORE the decision is announced (not after)
- Each stakeholder writes failure reasons independently (avoid groupthink)
- Group and categorize reasons, then assess likelihood and mitigation for each
- Red-team the top 3 risks by asking: "What would make this risk materialize?"


### P3.7 â€” Post-Mortem Technique

After a decision has played out (success or failure), conduct a post-mortem to improve future decisions.

```
DECISION POST-MORTEM TEMPLATE

Decision: [what was decided]
Date made: [date]
Outcome: [success / partial / failure]

1. INTENT VS OUTCOME
   - What did we expect to happen?
   - What actually happened?
   - What was the gap?

2. PROCESS EVALUATION
   - Was the decision frame correct? (right alternatives, right criteria)
   - Were our probability estimates accurate? (calibration check)
   - Did we have the right data? What data was missing?
   - What assumptions proved wrong?

3. BIAS CHECK
   - Did optimism bias inflate benefits?
   - Did we overweight recent information? (recency bias)
   - Did we protect a prior commitment? (escalation of commitment)
   - Did we anchor on the first alternative?

4. KEY LEARNING
   - What would we do differently?
   - What signal should we watch for similar decisions?
   - What should be added to the decision checklist?
```

**Calibration rule:** Track your probability estimates over time. If you assign 70% confidence to outcomes that happen only 50% of the time, you are overconfident. Adjust your estimation process.


### P3.9 â€” Sensitivity Analysis

Test how fragile your decision is to changes in assumptions.

#### P3.9.1 â€” Weight Sensitivity

Vary each criterion weight Â±X% and check if the optimal choice changes.

```
Original weights:
  Ecosystem: 20% â†’ React 7.65, Vue 6.75

Test:
  Ecosystem at 10%: React 7.50, Vue 6.65 (React still wins)
  Ecosystem at 30%: React 7.80, Vue 6.85 (React still wins)
  Productivity at 35%: React 7.55, Vue 6.95 (React still wins)
  
Conclusion: Decision is NOT sensitive to weight assumptions â€” robust.
```

**If optimal choice flips:** The decision is fragile. Document the crossover point. "If ecosystem weight exceeds 45%, Vue wins."

#### P3.9.2 â€” Score Sensitivity

Vary individual scores and check flip points:

```
What would Vue need to score on hiring to tie?
  Current: React 7.65, Vue 6.75
  Vue hiring score would need: Vue 7.65 -> requires (7.65-6.00)/0.10 = 16.5 on hiring
  Impossible (max 10). Decision is robust.
```

#### P3.9.3 â€” Probability Sensitivity (for decision trees)

Vary each probability Â±20%:

```
Base case:
  Extract now EMV = $200K
  Wait EMV = $140K
  Decision: Extract now

Sensitivity: 
  Extract success rate 60% â†’ 50%: Extract EMV = $150K, Wait wins
  Extract success rate 60% â†’ 70%: Extract EMV = $260K

Crossover: When extract success rate drops below 55%, Wait becomes optimal.
```

#### P3.9.4 â€” Threshold Analysis

For each key variable, find the threshold where the decision flips:

```
THRESHOLD TABLE

Variable                | Current value | Flip threshold | Margin
------------------------|---------------|----------------|-------
Extract cost (hours)    | 600           | 820            | +37%
Team size (developers)  | 4             | 2.5            | -38%
Migration timeline (mo) | 3             | 5.2            | +73%
```

**Margin interpretation:**
- Margin > 50%: decision is very robust to this variable
- Margin 20-50%: moderately robust
- Margin < 20%: fragile â€” monitor this variable closely


### P4.2 â€” Decision Log

The decision log captures low-ceremony decisions (HOURS, DAYS class) that don't warrant a full ADR. It serves as a searchable record of why things are the way they are.

For tracking all decisions (especially HOURS and DAYS class):

```
# Decision Log â€” [Team/Project Name]

## [YYYY-MM-DD]

| ID | Decision | Class | Chosen | Reversal Condition | Outcome (update later) |
|----|----------|-------|--------|--------------------|------------------------|
| D001 | Use Redis for session cache | HOURS | Redis | Latency > 10ms | âœ… Success (2ms P99) |
| D002 | Upgrade to Node 20 | DAYS | Yes | CI breaks > 24h | âœ… Success |
| D003 | Adopt GraphQL for API | WEEKS | No, stay REST | - | - |
```

**Decision log format:**
```
## Decision Log â€” [Team/Project Name]

### [YYYY-MM-DD]

| ID | Decision | Class | Chosen Option | Reversal Condition | Outcome |
|----|----------|-------|---------------|--------------------|---------|
| D042 | Redis for sessions | HOURS | Redis | P99 > 10ms | âœ… 2ms P99 |
| D043 | Node 20 upgrade | DAYS | Yes | CI broken > 24h | â³ in progress |
| D044 | GraphQL adoption | WEEKS | No, REST | - | âŒ decision made |
```

**Decision log rules:**
- Append-only. Never delete entries.
- Update outcomes when the decision plays out (âœ… success, âŒ failure, â³ pending, ðŸ”„ revisited)
- Link to ADR number for WEEKS+ decisions (e.g., "See ADR-042")
- Review quarterly: which decisions were wrong? What patterns emerge?
- HOURS decisions: one line per decision or per decision cluster
- DAYS decisions: one line with brief rationale
- WEEKS+ decisions: linked ADR, not duplicated in log

**Quarterly decision log review:**
```
Review date: 2026-01-15
Period: 2025-Q4
Total decisions logged: 47 (HOURS: 32, DAYS: 10, WEEKS: 4, IRREVERSIBLE: 1)

Outcomes:
  âœ… Success: 38 (81%)
  âŒ Failure: 5 (11%)
  â³ Pending: 4 (8%)

Failure patterns identified:
  1. Underestimating migration complexity (3 of 5 failures) â†’ ACTION: add
     complexity estimate to DAYS+ decision template
  2. Decisions made without stakeholder input (2 of 5 failures) â†’ ACTION:
     check stakeholder list for DAYS+ decisions

Highlights:
  - D029 (GraphQL adoption, rejected): proven correct â€” team velocity
    increased without GraphQL overhead
  - D031 (CI pipeline switch): failure due to unreviewed migration plan.
    Post-mortem conducted, learnings applied.
```


### P4.4 â€” Decision Review Cadence

Decisions degrade as context changes. Regular review ensures decisions remain valid.

| Decision Class | Review Trigger | Review Method | Effort |
|----------------|---------------|---------------|--------|
| HOURS | Never individually | Aggregate in quarterly log review | 30 min/quarter |
| DAYS | When reversal condition triggers | Single Slack message or async | 15 min |
| WEEKS | Quarterly or when context changes | Lightweight ADR review | 1 hour |
| IRREVERSIBLE | 6 months post-decision | Formal post-mortem (P3.7) | 2 hours |
| CHAINED IRREVERSIBLE | 3, 6, 12 months | Post-mortem at each milestone | 3 hours each |

#### P4.4.1 â€” Review Triggers

A decision should be revisited if any of these occur:

```
CONTEXT CHANGE TRIGGERS:
  - New technology that changes the trade-off landscape
  - Team size or composition changed significantly
  - Business priorities shifted (new market, new regulation)
  - Performance or cost data contradicts assumptions
  - A key dependency changed (deprecation, acquisition, price change)

DECAY TRIGGERS:
  - Decision was timeboxed and the timebox expired
  - Reversal condition was triggered
  - New information invalidates a key assumption
  - The decision's opportunity cost has changed

CALENDAR TRIGGERS:
  - Quarterly: batch review of WEEKS-class decisions
  - Bi-annual: IRREVERSIBLE decision post-mortems
  - Annual: full decision log audit + ADR health check
```

#### P4.4.2 â€” Decision Triage During Review

When reviewing an existing decision:

```
1. Is the original context still valid?
   YES â†’ Decision stands. No action needed.
   NO â†’ Continue.

2. Is the decision still reversible?
   YES â†’ Schedule revisit (proportional to reversibility).
   NO â†’ Decision is now IRREVERSIBLE. Post-mortem mandatory.

3. Would the same decision be made today?
   YES â†’ Document that the review occurred. Update context.
   NO â†’ Create new ADR superseding the old one. Plan migration.
```

#### P4.4.3 â€” Decision Expiration

Some decisions should have explicit expiration dates:

| Decision Type | Expiration | Example |
|---------------|------------|---------|
| Temporary workaround | Date on ticket | "Use raw SQL until ORM migration, expires 2026-03-01" |
| Experimental feature | Date or metric | "Feature flag X, expires 2026-06-01 or at 10K users" |
| Time-bound constraint | Date | "Defer SSO until post-MVP, revisit at 2026-Q3 planning" |
| Vendor evaluation | Date or milestone | "Use free tier until 10K MAU, then evaluate" |

**Managing expired decisions:**
- Decision log entries with expiry dates should be tagged `expires: YYYY-MM-DD`
- Before expiry, schedule a review (add to sprint planning as a task)
- If the decision is no longer relevant, mark it superseded
- If it should continue, extend with justification


### E2: Monorepo vs Polyrepo Decision

**Framing:**
```
Decision: Monorepo, polyrepo, or hybrid for the platform team?
Alternatives:
  A. Monorepo
  B. Polyrepo
  C. Hybrid (shared packages monorepo + independent app repos)
```

**Classification:** IRREVERSIBLE (migration cost after 6+ months). COUPLING: STRONG (affects CI, code sharing, workflows, deploy pipeline).

**Weighted matrix:**

| Dimension | Wt | Mono | Poly | Hybrid |
|-----------|----|------|------|--------|
| Developer experience | 9 | 8 | 5 | 7 |
| CI speed | 7 | 3 | 9 | 6 |
| Code sharing | 8 | 9 | 3 | 7 |
| Team autonomy | 8 | 4 | 9 | 7 |
| Tooling simplicity | 6 | 7 | 5 | 4 |
| **Weighted total** | | **198** | **201** | **192** |

**Tiebreaker:** Total within 10%. Polyrepo leads by 3 points â€” equivalent.

**Tiebreaker rule:** Reversibility. Hybrid can go either direction (merge into monorepo or split further). Since this is an IRREVERSIBLE class decision, pick the option that preserves future flexibility.

**Decision:** Hybrid â€” shared packages monorepo + independent app repos. This is WEEKS-reversible in practice (can merge or split later).

**Trade-off accepted:** Losing pure polyrepo autonomy (score 201) for reversibility. Acceptable because the 9-point gap is within the tiebreaker threshold.

**Opportunity cost:** Polyrepo's team autonomy score (201). Revisit at 50+ engineers.

**Consequence scan:**
- Monorepo: short â€” CI refactoring. Medium â€” CI speed degradation (invest in build caching). Long â€” team coordination tax grows with org size.
- Polyrepo: short â€” code-sharing tools needed. Medium â€” API versioning discipline. Long â€” cross-cutting changes expensive.
- Hybrid: short â€” shared package boundaries defined (2 weeks). Medium â€” versioning shared packages. Long â€” natural migration path to either pure model.

**Decision coupling:** This affects CI system, deploy pipeline, code review process, package management, and developer onboarding. All downstream decisions inherit the repo structure constraint.
--------------------+-------+---------+-----------+-----------+----------+-----
Micro-frontend infra   | 8     | 9       | 6         | 23        | 4 wks    | 5.75
Component extraction   | 6     | 5       | 4         | 15        | 8 wks    | 1.88
Routing migration      | 5     | 7       | 3         | 15        | 3 wks    | 5.00
```

Infrastructure first (highest WSJF), then routing, then component extraction.


### E5: Cloud Provider with Minimax Regret

**Framing:**
```
Decision: AWS, GCP, or Azure for data-intensive service?
Alternatives:
  A. AWS (existing relationship, broadest service catalog)
  B. GCP (BigQuery, dataflow, AI/ML strengths)
  C. Azure (enterprise reach, compliance)
```

**Classification:** IRREVERSIBLE (data gravity makes migration expensive after 1+ year). COUPLING: CHAINED (affects data pipeline, ML infra, billing, team hiring).

**Payoff matrix (scores 1-10, 10=best):**

| Scenario | AWS | GCP | Azure |
|----------|-----|-----|-------|
| Data processing grows fast | 6 | 9 | 5 |
| Cost optimization critical | 7 | 6 | 5 |
| Compliance audit needed | 8 | 7 | 9 |
| Team continuity | 9 | 4 | 3 |
| Multi-cloud future | 5 | 6 | 6 |

**Regret matrix:**

| Scenario | AWS regret | GCP regret | Azure regret |
|----------|------------|------------|--------------|
| Data processing grows fast | 3 | 0 | 4 |
| Cost optimization critical | 0 | 1 | 2 |
| Compliance audit | 1 | 2 | 0 |
| Team continuity | 0 | 5 | 6 |
| Multi-cloud future | 1 | 0 | 0 |

**Maximum regret:** AWS=3, GCP=5, Azure=6

**Decision (minimax):** AWS. Minimizes worst-case regret at 3. GCP has higher upside in data processing but regret risk of 5 if team continuity is needed.

**Maximax (optimistic):** GCP wins (best-case 9). Maximin (pessimistic): AWS wins (worst-case 5 vs GCP 4 vs Azure 3).

**Trade-off accepted:** Losing 3 points in data processing scenario to avoid 5-point regret in team continuity.

**Consequence scan (AWS):**
- Short: migration from current infra (4 weeks), team training
- Medium: cost optimization required (reserved instances, right-sizing)
- Long: data gravity increases switching cost. Future options kept open: broadest service catalog. Future options closed: BigQuery-native analytics.

**Decision coupling map:**
```
AWS decision â”€â”€constrainsâ”€â”€â–º Data pipeline (S3, Kinesis)
                  â””â”€â”€constrainsâ”€â”€â–º ML infra (SageMaker)
                  â””â”€â”€constrainsâ”€â”€â–º Monitoring (CloudWatch)
                  â””â”€â”€constrainsâ”€â”€â–º Team hiring (AWS experience)
```


### E7: Feature Prioritization with WSJF + Group Decision-Making

**Framing:**
```
Decision: Which features to prioritize for Q3?
Alternatives: 6 feature candidates, capacity for 3

Stakeholders:
  - Product Manager (D in DACI)
  - Engineering Lead (Driver)
  - Sales, Support, Security (Contributors)
```

**RAPID assignment:**
| Role | Person |
|------|--------|
| Recommend | Engineering Lead |
| Input | Sales, Support, Security |
| Agree | Product Manager |
| Decide | Head of Product |
| Perform | Engineering Team |

**WSJF matrix:**

| Feature | Business Value (1-10) | Time Criticality (1-10) | Risk Reduction (1-10) | Total CoD | Duration (wks) | WSJF |
|---------|----------------------|------------------------|----------------------|-----------|----------------|------|
| Payment integration | 9 | 8 | 3 | 20 | 3 | 6.67 |
| Admin dashboard | 5 | 3 | 4 | 12 | 4 | 3.00 |
| API rate limiting | 7 | 6 | 9 | 22 | 2 | 11.00 |
| Export to CSV | 3 | 2 | 1 | 6 | 1 | 6.00 |
| SSO/SAML login | 8 | 4 | 8 | 20 | 5 | 4.00 |
| Audit logging | 6 | 2 | 10 | 18 | 4 | 4.50 |

**WSJF ranking:** 1. API rate limiting (11.00), 2. Payment integration (6.67), 3. Export to CSV (6.00), 4. Audit logging (4.50), 5. SSO/SAML (4.00), 6. Admin dashboard (3.00)

**Consensus check (consent â€” no objections model):**
- Engineering Lead presents WSJF ranking
- Each contributor states concerns:
  - Sales: "Payment integration is urgent â€” client committed"
  - Support: "Audit logging reduces our ticket volume"
  - Security: "Rate limiting is non-negotiable â€” current limits are unsafe"

**Devil's advocate (Security Lead):**
- "WSJF ranking ignores dependencies â€” rate limiting blocks payment integration? No, they are independent."
- "Export CSV has low value â€” should it be at 6.67? Yes, because it's 1 week for immediate user value."
- Counter: rank is correct.

**Decision (Head of Product):**
```
Q3 features (by WSJF):
  1. API rate limiting â€” highest WSJF, security says non-negotiable
  2. Payment integration â€” highest business value, sales committed
  3. Export CSV â€” 1-week delivery, fast value, low risk

Deferred (with CoD tracking):
  4. SSO/SAML â€” WSJF 4.00, revisit Q4 when contract renewals depend on it
  5. Audit logging â€” WSJF 4.50, revisit if compliance audit scheduled
  6. Admin dashboard â€” WSJF 3.00, lowest priority

Rationale: WSJF maximizes value per unit time. Deferred items logged with CoD for prioritization in Q4 planning.
```

**Opportunity cost:** Audit logging (score 4.50). Acceptable because no compliance audit is scheduled in Q3.


## P7 â€” QUALITY GATES

Quality gates ensure decision quality is consistent regardless of who makes the decision. Apply gates based on decision class. Failure at any Tier 1 gate = reject and redo.

### Tier 1 â€” Hard Block (fail = reject output)

| # | Gate | Rationale |
|---|------|-----------|
| 1 | Decision framed as a question with at least 2 alternatives | Without framing, the decision is unfocused |
| 2 | "Do nothing" alternative included and scored | Without this, you bias toward action |
| 3 | Decision classified by reversibility (P2.4) | Without classification, you cannot calibrate rigor |
| 4 | All criteria declared with weights locked before scoring | Without locked weights, confirmation bias creeps in |
| 5 | Each alternative scored 1-10 on every criterion | Without full scoring, comparisons are incomplete |
| 6 | Sensitivity analysis performed (at least 2 key variables) | Without sensitivity, you don't know if the decision is fragile |
| 7 | Pre-mortem completed for chosen alternative | Without pre-mortem, failure scenarios are invisible |
| 8 | Reversible decisions made within speed guideline (P2.4) | Without speed discipline, analysis cost exceeds decision value |

**Tier 1 failure response:** Stop. Reframe or reanalyze. Do not proceed until all gates pass.

### Tier 2 â€” Standard

| # | Gate | Why It Matters |
|---|------|----------------|
| 1 | Uncertainty type identified | Determines the right analytical method |
| 2 | Trade-offs explicitly stated between top alternatives | Prevents hidden trade-offs from surprising later |
| 3 | Cost of delay calculated or N/A with reason | Forces explicit time-value consideration |
| 4 | Opportunity cost of chosen option documented | Makes foregone alternatives visible |
| 5 | Decision coupling map considered | Prevents downstream surprises |
| 6 | Consequence scan at 3 time horizons | Prevents short-term optimization creating long-term problems |
| 7 | Tiebreaker rule stated for close (within 10%) scores | Avoids analysis paralysis on equivalent options |
| 8 | Conditions that would invalidate decision documented | Enables timely revisiting when context changes |
| 9 | Group decision-making framework identified (RAPID/DACI) | Clarifies who decides and how |
| 10 | Devil's advocate consulted for IRREVERSIBLE decisions | Injects dissenting perspective |
| 11 | Decision recorded as ADR or log entry | Creates permanent artifact |
| 12 | Next action step documented | Ensures decision leads to action |

**Tier 2 failure response:** Gap analysis. Fix missing items. If multiple gaps exist, consider returning to Tier 1 review.

### Tier 3 â€” Excellence

| # | Gate | Value Add |
|---|------|-----------|
| 1 | Decision tree drawn for risky/uncertain decisions | Makes uncertainty explicit, enables EMV calculation |
| 2 | WSJF calculated if competing work items | Maximizes value per unit time |
| 3 | Multi-stage decision tree with option value | Captures value of delaying or phasing |
| 4 | Threshold analysis (flip points documented) | Identifies which variables to monitor post-decision |
| 5 | Calibration check: probability estimates vs actual frequencies | Improves estimation accuracy over time |
| 6 | Post-mortem scheduled for applicable decision class | Creates learning feedback loop |
| 7 | Decision log entry with reversal conditions and expiry | Makes decisions trackable and reviewable |
| 8 | Expected value ranges (best/worst/expected) for each alternative | Validates that the decision works across outcomes |
| 9 | Maximin / maximax / minimax checked for ambiguous decisions | Tests the decision under different risk attitudes |
| 10 | Risk score (Likelihood Ã— Impact) for top 3 pre-mortem risks | Quantifies residual risk of the chosen option |

**Tier 3 failure response:** Nice-to-have for lower classes. Mandatory for IRREVERSIBLE. Document why any Tier 3 gate was skipped.

### Self-Audit

Run this before outputting any decision analysis:

```
                 GATE                                STATUS
Decision framed with 2+ alternatives?               [  ]
Do nothing included and scored?                     [  ]
Reversibility classified (P2.4)?                    [  ]
Weights locked before scoring?                      [  ]
Sensitivity analysis varied 2+ variables?           [  ]
Pre-mortem completed for chosen option?             [  ]
Trade-offs stated between top options?              [  ]
CoD calculated or N/A justified?                    [  ]
Opportunity cost documented?                        [  ]
Consequence scan at 3 horizons done?                [  ]
Decision coupling considered?                       [  ]
Tiebreaker rule stated (if scores within 10%)?      [  ]
Decision recorded as artifact (ADR/log)?            [  ]
Reversal conditions documented?                     [  ]
Next action step defined?                           [  ]
```

### Gate Application by Decision Class

| Class | Gates Applied | Max Time |
|-------|---------------|----------|
| HOURS | Tier 2 gate 11 (log entry only) | 10 min |
| DAYS | Tier 1 (condensed: gates 1,3,5,6) + Tier 2 gate 11 | 1 day |
| WEEKS | Tier 1 (all) + Tier 2 (all) | 1 week |
| IRREVERSIBLE | Tier 1 (all) + Tier 2 (all) + Tier 3 (gates 1,4,6,8) | 2 weeks |
| CHAINED IRREVERSIBLE | Tier 1 (all) + Tier 2 (all) + Tier 3 (all) + sign-off | 3 weeks |

### Gate Escalation

If a Tier 1 gate cannot be satisfied:
```
1. Identify WHY the gate fails
   - Missing data? Lack of clarity? Too many options?
2. Is the gate truly applicable to this decision?
   - Some decisions genuinely have only 2 alternatives
   - Document why the gate is not applicable (N/A with reason)
3. Escalate to team lead if N/A reason is weak
4. If gate blocker is data: use best available estimate, label uncertainty

RULE: "We don't have the data" is NOT an excuse to skip a gate.
Use estimates, ranges, and sensitivity to compensate.
Reducing precision is acceptable; skipping analysis is not.
```

### Quality Metrics

Track these metrics over time to measure decision quality improvement:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Decision outcome success rate | >75% | Quarterly decision log review |
| Decision log completeness | 100% of WEEKS+ decisions recorded | Audit log vs number of WEEKS+ decisions |
| Post-mortem completion | 100% of IRREVERSIBLE decisions | Calendar check 6 months post-decision |
| Decision velocity | HOURS < 10min, DAYS < 1 day | Track time from framing to decision |
| Calibration score | Actual outcomes match stated probabilities | Track confidence vs accuracy |
| ADR freshness | <10% of ADRs deprecated without successor | Quarterly ADR review |

---

*Synarc S1 WorkType classification, S2 risk floors (decisions touching auth/data/payments are HIGH+), S13 quality gates, S14 language rules, S17 zero-tolerance violations apply. Ledger entry for every decision analysis engagement.*
