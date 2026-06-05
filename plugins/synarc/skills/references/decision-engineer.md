---
title: "Decision Engineer — Structured Decision Frameworks & Trade-off Analysis"
type: reference
status: active
version: 2.0.0
updated: 2027-05-28
owner: synarc-core
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
  - group-decision-making
  - adr
---

# Purpose

Complete system for making, documenting, and reviewing engineering decisions — framing, analyzing alternatives, deciding with appropriate rigor, documenting for future engineers, and reviewing when context changes. Decisions are the atomic unit of engineering progress.

# Scope

Decision triad (Frame → Analyze → Decide), decision classification by reversibility/certainty/coupling, cost of delay (CoD, CD3/WSJF), weighted decision matrices, expected value (EMV), decision trees, opportunity cost, minimax regret, sensitivity analysis, coupling maps, consequence scanning, trade-off surfaces, pre/post-mortem, group decision-making (RAPID/DACI), ADR documentation. Inherits synarc core.

# Inputs

Decision question, alternatives, criteria and stakeholder priorities, probability estimates, time/cost data, organizational context, existing ADRs.

# Output

Classified and documented decisions with rationale, weighted scoring matrices, decision trees with EMV, coupling maps, sensitivity analyses, pre/post-mortem reports, ADRs, decision log entries.

# Key Frameworks

## P1. Decision Triad [P2.1]

All structured decisions follow: **FRAME** (alternatives × criteria × weights) → **ANALYZE** (score, quantify uncertainty, sensitivity) → **DECIDE** (select, document, plan reversal). Iterative — if analysis reveals wrong frame, return to FRAME.

**Framing patterns:** GO/NO-GO, SELECT (choose one), PRIORITIZE (rank order), ALLOCATE (distribute resources), DEFER (keep options open), CONDITIONAL (if X then Y).

**Frame quality checklist:** Specific question, ≥3 alternatives (including "do nothing" and one creative), mutually exclusive, exclusion criteria explicit, all stakeholders identified, decision class determined, timebox set proportional to reversibility.

## P2. Decision Classification Matrix [P2.2]

Classify on five dimensions BEFORE any analysis:

| Dimension | Categories |
|---|---|
| REVERSIBILITY | HOURS · DAYS · WEEKS · IRREVERSIBLE |
| CERTAINTY | KNOWN · PROBABILISTIC · AMBIGUOUS |
| COUPLING | NONE · WEAK · STRONG · CHAINED |
| SCOPE | INDIVIDUAL · TEAM · MULTI-TEAM · ORG |
| TIME HORIZON | TACTICAL (days) · OPERATIONAL (weeks) · STRATEGIC (quarters) · FOUNDATIONAL (years) |

**Core rule:** Apply IRREVERSIBLE rigor to irreversible decisions. Apply HOURS speed to HOURS decisions.

| Classification | Max Time | Reviewers | Documentation |
|---|---|---|---|
| HOURS | 10 min | None | One-line log |
| DAYS | 1 day | Team lead | Paragraph ADR |
| WEEKS | 1 week | Team + architect | Standard ADR |
| IRREVERSIBLE | 2 weeks | All + stakeholders | Full ADR |
| CHAINED IRREVERSIBLE | 3 weeks | All affected teams | Full ADR + simulation |

## P3. Cost of Delay (CoD) & WSJF [P2.6]

CoD = Value per unit time × Delay duration. WSJF = CoD / Job duration. Rank by WSJF to maximize value per unit time.

**CoD profiles:** URGENT (exponential decay — regulatory deadline), STANDARD (linear), FIXED-DATE (value only on/after date), LEARNING (information value), OPTION (keeping choices open).

## P4. Weighted Decision Matrix [P2.8]

| Criterion | Weight | Alt A Score | Alt A Wtd | Alt B Score | Alt B Wtd |
|---|---|---|---|---|---|
| Performance | 30% | 8 | 2.4 | 6 | 1.8 |

**Rules:** Weights sum to 100%. Scores 1-10. Lock weights before scoring. Evidence-based scores. If totals within 0.5 points (or 10% relative) → declare tie. Tiebreakers: (1) prefer more reversible, (2) strategic alignment, (3) leaves more options open.

## P5. Expected Value & Decision Trees [P2.11, P3.1]

EMV = Σ(Probability_i × Value_i). Choose path with highest EMV.

**Decision tree notation:** Decision node (□), Chance node (○), Terminal node (▣). Roll-back: EMV = Σ(P × V) per chance node, choose max EMV at each decision node. Sensitivity: vary probabilities ±20% — if optimal choice flips, decision is fragile.

**Multi-stage trees** capture option value — the ability to pivot limits downside while preserving upside.

## P6. Decision Under Uncertainty [P2.10]

| Scenario | Method | Decision Rule |
|---|---|---|
| Known probabilities | Expected value | Maximize EMV |
| Pessimistic (unknown) | Maximin | Maximize minimum outcome |
| Optimistic (unknown) | Maximax | Maximize maximum outcome |
| Regret-minimizing | Minimax regret | Minimize maximum regret |
| Deep uncertainty | Scenario planning | Test across multiple futures |

## P7. Decision Coupling Analysis [P3.3]

**Coupling types:** DIRECT, CHAINED (A→B→C), FAN-IN (many depend on A), FAN-OUT (A affects many), CYCLICAL (mutual), TEMPORAL (A before B), OPTIONAL (option value).

**Coupling map:** Identify ANCHOR nodes (many outgoing, irreversible) — getting these wrong cascades. BOTTLENECK nodes (many incoming). IRREVERSIBLE decisions anchor the graph — all downstream decisions inherit their constraints.

## P8. Consequence Scanning [P3.4]

For each option, scan three horizons: SHORT (1 week — what immediately breaks?), MEDIUM (1 quarter — what must we maintain?), LONG (1 year+ — what future options close?). If a decision closes more future options than it keeps open, it needs proportionally higher short-medium value.

## P9. Pre-Mortem & Post-Mortem [P3.6, P3.7]

**Pre-mortem:** Assume decision failed catastrophically 12 months from now. List all reasons. Silent generation (avoids groupthink) → share and cluster → assess likelihood × impact → mitigate or revisit.

**Post-mortem:** Intent vs outcome gap → Process evaluation (was frame correct? Probability calibration?) → Bias check (optimism, recency, escalation of commitment) → Key learnings for future decisions.

## P10. Group Decision-Making [P3.8]

**RAPID:** Recommend → **A**gree (domain veto) → **P**erform → **I**nput (no veto) → **D**ecide (final call). One person per role. A roles have domain-specific veto.

**DACI:** **D**river (drives process) → **A**pprover (final decision) → **C**ontributor (subject matter input) → **I**nformed (notified after). Exactly one Driver and one Approver.

**Devil's Advocate:** For any STRATEGIC or IRREVERSIBLE decision, assign one person to find fatal flaws in the recommended option. They present FIRST.

## P11. Sensitivity Analysis [P3.9]

Test fragility: vary weights ±X%, vary scores to find flip points, vary probabilities ±20%, compute threshold analysis (current value vs flip threshold with margin %). Margin >50% = very robust. <20% = fragile — monitor closely.

## P12. ADR Format [P4.1]

# ADR-NNN: Title
**Status:** Proposed | Accepted | Deprecated | Superseded
**Context:** Issue, constraints, background, alternatives considered, decision classification
**Decision:** What was chosen, why, what decision rule was used
**Consequences:** Trade-offs accepted, future options closed, opportunity cost
**Reversibility:** Classification, invalidating conditions, reversal plan, revisit signal
**Compliance:** Regulatory, security, or standards
**References:** Full analysis, related ADRs, decision log

# Core Principles

- Rigor matches reversibility (analysis depth proportional to cost of being wrong)
- Explicit over implicit (documented mediocre decision beats undocumented perfect one)
- Alternatives define quality (three thoughtful alternatives beat a hundred casual ones)
- Process over outcome (judge by reasoning, not results)
- 70% information rule: most decisions should be made with ~70% of desired information
