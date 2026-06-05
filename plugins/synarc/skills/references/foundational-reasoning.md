---
title: "Foundational Reasoning — First Principles & Systems Thinking"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - first-principles
  - decomposition
  - systems-thinking
  - feedback-loops
  - emergent-behavior
  - assumption-analysis
  - leverage-points
  - causal-reduction
---

# Purpose

Dual-track reasoning: decompose problems to irreducible truths (first principles) while reasoning holistically about system dynamics (systems thinking). Rebuild from verified truths rather than inheriting failure modes of existing designs.

# Scope

First principles process (decompose → analyze → recompose), systems thinking process (map → model → leverage), assumption audit, inverse testing, causal reduction, causal loop diagrams, stock-and-flow analysis, feedback loop archetypes.

# Inputs

Problem statement, system description, current architecture, measured data, team assumptions.

# Output

Decomposed irreducible truths, constraint/convention classification, causal loop diagrams, leverage points, verified solution from fundamental principles.

# Notes

Inherits synarc core. COMPACT token mode by default.

## 1. Dual-Track Architecture [P2]

```
TRACK A: FIRST PRINCIPLES          TRACK B: SYSTEMS THINKING
  1. DECOMPOSE                       1. MAP
     Break to irreducible truths        Identify elements, connections
  2. ANALYZE                         2. MODEL
     Separate assumptions from facts    Determine feedback structures
  3. RECOMPOSE                       3. LEVERAGE
     Rebuild from truths up             Find intervention points

TRACK C: SYNTHESIS
  Decompose components with FP → Model interactions with ST
  Identify leverage with ST → Decompose leverage with FP
```

## 2. Track A: First Principles Process [P2.1]

**Step A1 — State the problem without solution reference**: Write in one sentence, no existing solution mentioned. Must be falsifiable and measurable.

**Step A2 — Decompose to irreducible elements**: Each element must be atomic (cannot split further), provable (demonstrable independently), unambiguous (one interpretation). Stop when: domain primitive, defined by physics/math, or decomposing adds no insight.

**Step A3 — Classify by knowledge type**: Fundamental (true by definition/physics), Empirical (measured), Conventional (human agreement), Assumed (believed unverified), Inherited (adopted from past). Untagged = assumed = unverified.

**Step A4 — Separate constraints from conventions**:

| Property | Constraint | Convention |
|----------|------------|------------|
| Source | Physics, math, security, legal | Preference, history |
| Changeable | No (or extreme cost) | Yes (with agreement) |
| Violation cost | System failure, data loss | Style inconsistency |

**Rule**: If you cannot name the concrete failure from violating it, it is a convention, not a constraint.

**Convention relaxation ladder**: Suspend (try removing) → Replace (substitute) → Abstract (generalize to principle) → Eliminate (remove if no value).

**Step A5 — Challenge every convention**: What happens if we change or remove this? Challenge inherited conventions first.

**Step A6 — Rebuild from first principles**: Solutions based only on constraints + surviving conventions.

**Step A7 — Verify against measured reality**: Check each proposed change against data. Invalid changes are contradicted by measurement.

## 3. Track B: Systems Thinking Process [P2.2]

**Step B1 — Define the system boundary**: What is inside, what is outside, interactions at the boundary. Boundary errors are the most common failure in systems analysis.

**Step B2 — Map variables and causal links**: S (Same: A↑→B↑) and O (Opposite: A↑→B↓) polarity. Every link must have polarity.

**Step B3 — Identify feedback loops**: **Reinforcing (R)** — amplifies change (exponential). **Balancing (B)** — counteracts change (stability/oscillation). Count O links: even = R, odd = B.

**Step B4 — Analyze stocks and flows**: `Stock = integral of (inflow - outflow) over time + initial stock`. Stocks change only through flows. To change a stock, change flow rates or the structure determining them.

**Step B5 — Identify leverage points** (ranked 1=least to 11=most effective):

| # | Leverage | Engineering Example |
|---|----------|-------------------|
| 1 | Parameters | Adjusting max connection pool size |
| 2 | Buffer sizes | Doubling cache capacity |
| 3 | Stock-and-flow structures | Monolith → microservices |
| 4 | Delays | Reducing CI pipeline from 30min to 5min |
| 5 | Balancing feedback | Adding circuit breakers |
| 6 | Reinforcing feedback | Viral loops, network effects |
| 7 | Information flows | Real-time monitoring dashboards |
| 8 | Rules | Changing deployment approval process |
| 9 | Goals | Shifting from velocity to reliability |
| 10 | Paradigm | "Move fast" → "sustainable engineering" |
| 11 | Transcending paradigms | No single pattern is universally correct |

**Rule**: Most effort targets 1-3. Highest leverage targets 7-11 but hardest to execute.

**Step B6 — Predict second-order effects**: Trace through at least three orders and one delayed effect.

## 4. Track C: Synthesis — When to Use Which [P2.3]

| Situation | Primary | Secondary |
|-----------|---------|-----------|
| Unknown root cause | First Principles | Systems Thinking |
| Degrading behavior | Systems Thinking | First Principles |
| Technology choice | First Principles | Systems Thinking |
| Performance optimization | First Principles | Systems Thinking |
| New feature design | First Principles | Systems Thinking |
| Incident postmortem | Both (alternating) | — |

## 5. Assumption Audit [P3.1]

Tag every claim: [F] Fundamental, [E] Empirical, [C] Conventional, [A] Assumed, [I] Inherited.

**Assumption pressure test**: **Reversal** (what if opposite were true?), **Removal** (remove from consideration?), **Extremes** (10× stronger/weaker?), **Time shift** (true 6 months ago? will it be in 6 months?).

**Hidden assumption patterns**: "Obviously" statements, comparative statements ("X is better"), temporal ("we always do X"), default-to-existing ("we already have X"), future assumption ("we'll need X when Y").

**Assumption debt**: Every untested assumption is a liability. Interest compounds — 6-month-old assumptions are likelier wrong than yesterday's.

## 6. Inverse Testing [P3.3]

For every proposed solution, invert a core assumption and reason from the opposite. **Paired inversion**: invert two assumptions simultaneously.

**Inversion operators**: Remove component entirely, reverse causal polarity, introduce/remove delay, scale by 10×, replace with different type, decouple.

## 7. Minimum Actionable Truth (MAT) [P3.4]

Smallest provable statement that could change a decision. Every MAT sourced to a verification method. Max 3-5 MATs per decision; if more needed, decompose into sub-decisions.

## 8. Causal Reduction [P3.5]

Trace every property to the original decision that created it. Continue until: physical/math constraint, current business requirement, or arbitrary choice with no remaining justification. Remove/update OBSOLETE and UNKNOWN properties.

## 9. Causal Loop Diagram Construction [P3.6]

Variables as noun phrases. Every link has polarity (S/O). Every loop is closed and labeled R/B. Delays explicitly marked.

## 10. Feedback Loop Archetypes in Engineering [P3.7]

| Archetype | Engineering Example |
|-----------|-------------------|
| Fixes that fail | Adding servers for slow query |
| Shifting the burden | Cache masking slow query instead of fixing it |
| Tragedy of the commons | All services increasing pool size independently |
| Escalation | Two services both adding retries, doubling load |
| Success to the successful | Well-funded team gets more resources |
| Growth and underinvestment | User growth exceeds infra budget |
| Accidental adversaries | QA rejects more → devs rush → more bugs |
| Policy resistance | Reducing deploy window → devs cut corners |

## 11. Stock-and-Flow Dynamics [P3.8]

| Stock | Inflow | Outflow |
|-------|--------|---------|
| Queue depth | Enqueue rate | Dequeue rate |
| Technical debt | Debt introduction | Refactor rate |
| Team knowledge | Learning rate | Attrition rate |

## 12. Common False Constraints [P3.2]

"We must use AWS", "We need Kubernetes", "We can't change the schema", "This must be real-time", "We need 99.999% uptime". Most are conventions masquerading as constraints.

**Constraint cross-validation**: Validate against Documentation (written?), Measurement (measured?), Consequence (what actually happens if violated?). If all three agree → likely real. If any disagrees → convention.
