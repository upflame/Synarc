---
title: "Problem Solver + Design Thinker"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - problem-solving
  - root-cause-analysis
  - solution-design
  - design-thinking
  - prototyping
  - divergent-thinking
  - convergent-thinking
  - user-research
---

# Purpose

Integrated methodology merging structured engineering problem-solving with human-centered design thinking. Every engineering task is a problem to be solved for people — the technical half ensures rigor, the design half ensures the solution addresses real human needs.

# Scope

Integrated problem-solving cycle, dual diamond structure, problem framing grammar, POV statements, HMW questions, RCA toolkit (5 Whys, Fishbone, FTA, Change Analysis, Kepner-Tregoe, Barrier Analysis), solution generation (brainstorming, SCAMPER, Triz, Inversion), multi-criteria evaluation, implementation planning.

# Inputs

Problem description, user research data, system metrics, stakeholder concerns, historical failure data.

# Output

Problem framing, root cause analysis, generated and evaluated solutions, implementation plan, verification results.

# Notes

Inherits synarc core. COMPACT token mode by default.

## 1. Integrated Problem-Solving Cycle [P2.1]

```
EMPATHIZE → DEFINE → ANALYZE → IDEATE → PROTOTYPE → EVALUATE → IMPLEMENT → TEST
```

| Phase | Engineering | Design Thinking | Combined |
|-------|------------|-----------------|----------|
| 1 | (implicit) | EMPATHIZE | Understand users, context |
| 2 | DEFINE | DEFINE | Frame precisely |
| 3 | ANALYZE | (synthesis) | RCA, constraint discovery |
| 4 | GENERATE | IDEATE | Divergent generation |
| 5 | (plan) | PROTOTYPE | Tangible, testable |
| 6 | EVALUATE | (selection) | Multi-criteria selection |
| 7 | IMPLEMENT | DELIVER | Execute |
| 8 | VERIFY | TEST | Confirm with evidence |

## 2. Dual Diamond Structure [P2.2]

**Problem Space**: DIVERGE (Discover — gather data, observe, empathize) → CONVERGE (Define — frame problem, bound scope, success criteria).

**Solution Space**: DIVERGE (Develop — generate options via brainstorming, SCAMPER, Triz) → CONVERGE (Deliver — select via multi-criteria eval, prototype, test).

**Critical rule**: Never skip a phase. Diverging when you should converge → analysis paralysis. Converging when you should diverge → premature commitment to weak solutions.

## 3. Problem Framing Grammar [P2.3]

Before any analysis, frame using:
```
USER/STAKEHOLDER: [who experiences this?]
CURRENT STATE: [what is happening? data?]
DESIRED STATE: [what should happen? how recognized?]
GAP: [what separates current from desired?]
CONSTRAINTS: [time, budget, tech, policy limits]
SUCCESS CRITERIA: [measurable solved state]
```

**Rule**: If framing does not change when adding observations, the frame is too broad. Narrow until actionable and falsifiable.

## 4. Point of View (POV) Statement [P2.4]

```
[USER] needs [NEED] because [INSIGHT],
which surprises us because [OBSERVATION CONTRADICTING ASSUMPTION].
```

**Quality**: Specific user, real need (not a feature), insight grounded in observation, contradiction reveals blind spot.

## 5. How Might We (HMW) Questions [P2.5]

Transform insights into generative questions. Strong HMW = outcome-focused, no specific solution, opens direction.

**Generation techniques**: Amp up the challenge, remove the obvious solution, change the subject, focus on emotion, flip the negative.

## 6. Problem Classification System [P3.1]

Five dimensions:
- **Scope**: NARROW (known inputs/outputs) → MODERATE → BROAD → STRATEGIC
- **Clarity**: KNOWN → SUSPECTED → MYSTERY → COMPLEX
- **Stability**: FROZEN → DRIFTING → OSCILLATING → SUDDEN
- **Scale**: SINGLE-POINT → MULTI-POINT → SYSTEMIC → CHAIN
- **Recurrence**: FIRST-TIME → REPEATING → CONTINUOUS → PREDICTABLE

## 7. RCA Method Selection Guide [P3.2.1]

| Method | Best For | Effort |
|--------|----------|--------|
| 5 Whys | Single failure, known starting point | 15-30 min |
| Fishbone (Ishikawa) | Multiple potential causes | 30-60 min |
| Fault Tree Analysis | Complex system, known failure mode | 1-4 hours |
| Change Analysis | Degradation after specific time | 30-60 min |
| Kepner-Tregoe | Unknown cause, many variables | 1-2 hours |
| Barrier Analysis | Safety/security failures | 30-60 min |
| Event Timeline | Sequential failures | 20-40 min |
| Causal Factor Charting | Complex, multi-factor | 2-4 hours |

## 8. Five Whys Process [P3.2.2]

Start with symptom, ask "Why?" repeatedly until systemic root cause. Each why based on evidence. Stop when root is fixable (not "human error" or "bad luck").

**Common errors**: Stopping at human error, circular reasoning, solution jumping, single branch tunnel vision, stopping too early (root cause still an event, not systemic).

## 9. Fishbone (Ishikawa) Diagram [P3.2.3]

Standard engineering categories: PEOPLE, PROCESS, TECHNOLOGY, DATA, ENVIRONMENT. Write problem at fish head. Brainstorm causes within categories. Add sub-causes. Circle most likely. Validate with data before acting.

## 10. Fault Tree Analysis (FTA) [P3.2.4]

**OR gate**: Any input causes output (probabilities add). **AND gate**: All inputs required (probabilities multiply).

**Minimal cut sets**: smallest combinations of basic events that cause the top event. Prioritize basic events by frequency, ease of detection, ease of mitigation.

## 11. Change Analysis [P3.2.5]

List ALL changes in timeframe — code, config, infra, data, dependencies, external, operations. For each: could it produce symptom? Is timing consistent? Is scope consistent?

## 12. Kepner-Tregoe (IS/IS NOT) [P3.2.6]

| Question | IS | IS NOT | Distinction |
|----------|----|--------|-------------|
| WHAT | Exact problem | Similar things fine | What's unique? |
| WHERE | Where it happens | Where it doesn't | What's different? |
| WHEN | When first occurred | When it worked | What changed? |
| EXTENT | How many affected | How many unaffected | What determines boundary? |

Distinctions point to root cause.

## 13. Barrier Analysis [P3.2.7]

For safety/security failures: identify hazard → target → existing barriers → was each in place? effective? bypassed? missing? → barrier failures → systemic root causes.

## 14. Solution Generation Toolkit [P3.3]

**Brainstorming**: Defer judgment, go for quantity (20+), encourage wild ideas, build on others.

**SCAMPER**: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse/Rearrange.

**Triz (40 principles)**: For technical contradictions — identify contradiction, look up in matrix, apply suggested principles. Key contradictions: Speed vs Accuracy, Performance vs Complexity, Data volume vs Response time.

**Inversion**: Define problem forward → solve opposite → invert solution → apply to original problem.

## 15. Multi-Criteria Evaluation [P3.4]

Weighted matrix with criteria: feasibility, impact, cost, time, risk, alignment. Score alternatives, compare to baseline, identify hybrid options.

## 16. PoC / Prototype Guidelines [P3.5]

Prototype the riskiest assumption first. Test before building. Time-box. MVP = minimum feature set that tests the core hypothesis. PoC validates technical feasibility in <1 day.

| Technique | Speed | Fidelity | Learning |
|-----------|-------|----------|----------|
| Concept sketch | Minutes | Low | Direction |
| Wireframe | Hours | Medium | Layout |
| Clickable prototype | Days | Medium-High | Flow |
| Code spike | Hours-Days | Low-Medium | Feasibility |
| Wizard of Oz | Hours | High (to user) | UX desirability |

## 17. Verification [P3.7]

Compare actual outcomes against success criteria. Use same metrics as problem framing. Verify at multiple levels. If verification fails → return to earlier phase.
