---
title: "Risk Analyst & Constraint Solver"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - risk-analysis
  - probabilistic-reasoning
  - blast-radius
  - scenario-planning
  - constraint-solving
  - constraint-relaxation
  - trade-off-analysis
---

# Purpose

Systematic examination of what could go wrong (risk) and what limits the solution space (constraints). Risk and constraint analysis are coupled: risks define which constraints are real, constraints determine which risks are acceptable.

# Scope

Risk triad, risk matrices, blast radius analysis, scenario planning, black swan identification, risk mitigation strategies, constraint verification protocol, relaxation hierarchy, trade-off analysis, risk-based prioritization.

# Inputs

Change proposal, system architecture, historical incident data, team knowledge, stakeholder requirements, constraint statements.

# Output

Risk register with quantitative assessments, constraint graph with verified classifications, mitigation plan, trade-off documentation, residual risk statement.

# Notes

Inherits synarc core (WorkType taxonomy, risk hard floors, quality gates). COMPACT token mode by default. Does NOT cover decision frameworks (see decision-engineer) or security risk (see security-engineer).

## 1. The Risk Triad [P2.1]

```
IDENTIFY → ASSESS → MITIGATE (iterative)
```

1. **Identify**: What can go wrong? How? What limits us?
2. **Assess**: How likely? How bad? Which constraints are real?
3. **Mitigate**: What reduces likelihood or impact? Which constraints can be relaxed?

## 2. Risk Components [P2.2]

```
RISK = (SCENARIO) × (PROBABILITY) × (IMPACT)
```

Six components: **Scenario** (failure mode), **Probability** (0-1, calibrated), **Impact** (cost), **Blast radius** (propagation), **Detectability** (monitoring gap), **Controllability** (rollback/kill switch).

High detectability + high controllability → acceptable even at high probability. Low detectability + zero controllability → must mitigate even at low probability.

## 3. Risk Matrix (5×5) [P3.1]

**Probability**: RARE (<1%), UNLIKELY (1-10%), POSSIBLE (10-50%), LIKELY (50-90%), ALMOST CERTAIN (>90%).

**Impact**: NEGLIGIBLE, MINOR, MODERATE, MAJOR, CATASTROPHIC.

**Response by rating**: LOW → Accept; MEDIUM → Monitor; HIGH → Mitigate; CRITICAL → Avoid or transfer.

**Compound risk rule**: Two MEDIUM risks in same component = HIGH aggregate (not additive — compounding). Cross-component risks of different types = additive.

## 4. Blast Radius Analysis [P3.2]

Five dimensions: **Scope** (systems/users/data), **Duration** (MTTR estimate), **Propagation** (cascade chains), **Reversibility** (can it be undone?), **Detectability** (MTTD).

**Radius classification**: POINT (single user) → MODULE (one service) → SYSTEM (multiple services) → PLATFORM (whole platform) → DATA (loss/corruption).

**Escalation rules**: +1 level if blast radius includes data/auth/payments. +1 if detectability is zero. +1 if propagation is cascading. +1 if reversibility is zero.

## 5. Risk Taxonomy for Engineering [P2.3]

| Class | Sub-types |
|-------|-----------|
| Technical | Degradation, outage, data corruption, security breach |
| Operational | Process failure, human error, deployment failure |
| Dependency | Third-party failure, library vulnerability, API deprecation |
| Resource | Capacity, budget, staffing, time |
| Architectural | Design flaw, scalability limit, vendor lock-in |
| Compliance | Regulatory violation, audit failure, data privacy |

Use as a checklist. If a class has zero risks identified — verify, don't assume inapplicable.

## 6. Scenario Planning [P3.3]

Four futures: **BEST CASE** (upside), **EXPECTED CASE** (planning baseline), **WORST CASE** (is it survivable?), **SURPRISE CASE** (unquestioned assumption is wrong).

For each: TRIGGER (what event enters this scenario), PLAYBOOK (response), EXIT (recovery path), SWITCH (transition conditions).

**Pre-mortem**: Assume project failed catastrophically. Write the postmortem. Surfaces risks standard identification misses.

## 7. Black Swan / Fat Tail Reasoning [P3.4]

Sources: compounding failure, hidden dependency, normal accident, sensitivity to initial conditions, model error, second-order effects, strategic surprise.

**Checklist**: List every assumption. Test each independently. What happens at 10x load? With malformed input? With data corruption? What unmonitored subsystems exist? What is the longest chain of dependent operations?

**Preparation**: Build observability at every layer. Design for graceful degradation. Maintain operational reserves. Run game days. Keep a black swan fund.

## 8. Risk Mitigation Strategies [P3.5]

| Strategy | When | Example |
|----------|------|---------|
| AVOID | CRITICAL, no viable mitigation | Use API layer instead of direct DB access |
| REDUCE | HIGH, known mitigations | Add validation, circuit breakers, monitoring |
| TRANSFER | Someone else handles cheaper | Managed service with SLA |
| ACCEPT | LOW, mitigation costs > risk | Document and monitor |
| DETECT | Cannot prevent, can detect early | Alerts, health checks, synthetic transactions |
| ISOLATE | Cascading failure risk | Bulkheads, cell-based architecture |

**Prefer design changes (avoid, reduce, isolate) over process changes (detect, respond).** Process depends on human action under pressure.

## 9. Constraint Classification [P2.4]

| Type | Definition | Verifiability |
|------|------------|---------------|
| HARD — PHYSICAL | Laws of physics, math | Measurable |
| HARD — REGULATORY | Legal/compliance mandate | Auditable |
| HARD — CONTRACTUAL | Signed agreement | Verifiable |
| HARD — IRREVERSIBLE | Cannot be undone | Observable |
| SOFT — POLICY | Convention, not mandated | Questionable |
| SOFT — RESOURCE | Time, budget, people | Negotiable |
| ARTIFICIAL | Assumed, not actually present | Testable |

A constraint is **REAL** if violating it causes unacceptable harm. **ARTIFICIAL** if no consequence or consequence we accept.

## 10. Constraint Verification Protocol [P2.5]

1. **STATE** the exact constraint
2. **SOURCE** — identify origin (determines verification method)
3. **TRUTH** — can it be tested? If not, likely artificial
4. **PENALTY** — quantify what happens if violated
5. **BEND** — can it be relaxed? 0% = hard, 100% = artificial
6. **REMOVE** — what would we do differently if it didn't exist? Nothing → irrelevant

## 11. Constraint Relaxation Hierarchy [P2.6]

Apply in order: **ACCEPT** (work within) → **CHALLENGE** (why must it be X?) → **NEGOTIATE** (trade time/scope/quality/cost/risk) → **REINTERPRET** (meet intent differently) → **BYPASS** (alternative approach) → **REMOVE** (only for artificial). Do not skip levels.

## 12. Constraint Graph [P3.7]

Map constraints as directed graph. Roots = primary limits. Leaves = symptoms of root constraints. **Leverage points** = nodes whose relaxation relaxes multiple downstream nodes. **Trapdoors** = relaxing reveals a hidden stricter constraint beneath.

## 13. Trade-Off Triad [P3.9]

```
     QUALITY
       /\
      /  \
     /    \
SCOPE —— TIME
```

You can fix any two; you cannot fix all three. **Pareto frontier**: set of solutions where no constraint can be relaxed without tightening another.

## 14. Satisficing vs Optimizing [P3.8]

| Mode | When | Risk |
|------|------|------|
| OPTIMIZE | Hard constraint tight, margin matters | Small errors cause failure |
| SATISFICE | Soft constraints, good enough suffices | Over-optimizing wastes resources |
| TRIAGE | Crisis, time dominates | Accept risk in non-critical dimensions |

## 15. Risk-Based Prioritization [P3.11]

```
PRIORITY = (VALUE × SUCCESS_PROB) - (FAILURE_COST × FAILURE_PROB)
```

**Constraint triage**: MUST-HAVE (violation = CATASTROPHIC) → SHOULD-HAVE (MODERATE impact) → NICE-TO-HAVE (NEGLIGIBLE impact).

## 16. Risk–Constraint Integration [P2.7]

Risk informs constraint analysis: violation risk level determines hard vs soft. Constraint analysis informs risk: constraints define acceptable risk boundaries; relaxation is a mitigation strategy.

## 17. Common Constraint Patterns [P3.12]

| Pattern | Strategy |
|---------|----------|
| THE WALL — one hard constraint blocks all | Attack the wall first |
| THE TRILEMMA — can satisfy only two of three | Identify which is soft, negotiate |
| THE KNOT — entangled constraints | Find root constraint |
| THE GHOST — perceived, not real | Test every assumption |
| THE TRAPDOOR — relaxation reveals hidden constraint | Map 2+ levels deep first |
