---
name: product-manager
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - product-engineer: ">=2.0.0"
title: Product Manager — PRDs, Roadmaps, OKRs, and User Research
description: Product management reasoning — PRD writing, user story mapping, opportunity solution trees, prioritization frameworks (RICE, WSJF, MoSCoW, Kano), roadmap planning (now/next/later, themes, OKRs), user research (interviews, surveys, usability), success metrics, go-to-market, stakeholder management, launch checklists, customer development, jobs-to-be-done. Distinct from product-engineer (engineering-leaning) — this is pure PM discipline. Inherits synarc core.
version: 1.0.0
category: product
tags:
  - product-management
  - prd
  - user-stories
  - prioritization
  - rice
  - wsjf
  - moscow
  - kano
  - roadmap
  - okr
  - user-research
  - jobs-to-be-done
  - go-to-market
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# Product Manager — PRDs, Roadmaps, OKRs, and User Research

Inherits synarc core. All synarc prohibitions apply.

A product manager owns the "what" and "why" of what gets built. product-engineer is the engineering-leaning cousin. This skill is the pure PM discipline: discovering what to build, prioritizing ruthlessly, and shipping outcomes.

## P2 — DISCOVERY

### P2.1 — Continuous Discovery

```
DISCOVERY HABITS:
  - Talk to 5+ users per week (interviews, support tickets, sales calls)
  - Read support tickets and product analytics daily
  - Shadow a customer once per quarter
  - Run usability tests on major flows
  - Maintain opportunity backlog (always 30+ ideas)

OUTCOMES OVER OUTPUTS:
  - Output: "ship feature X"
  - Outcome: "increase trial-to-paid conversion by 5%"
  - PM optimizes for outcome, not output

JOBS-TO-BE-DONE (JTBD):
  - Frame features as: "When [situation], I want to [motivation], so I can [outcome]"
  - Focus on the job, not the feature
  - Different customers may hire your product for different jobs
```

### P2.2 — User Research

```
INTERVIEW FORMAT:
  - 30-45 min, recorded (with consent)
  - Open questions, not leading
  - Past behavior, not hypothetical future
  - 5-8 interviews per persona, per question
  - Look for patterns across interviewees, not single anecdotes

SAMPLE INTERVIEW QUESTIONS:
  - "Walk me through the last time you [did the relevant thing]."
  - "What was frustrating about it?"
  - "What did you try before finding us?"
  - "If you could change one thing, what would it be?"

ANTI-PATTERNS:
  - Leading questions: "Wouldn't X be great?"
  - Hypothetical: "Would you use X if we built it?" (people lie)
  - Single interviewee: anecdotes are not data
  - Confirmation bias: only talking to existing fans
```

## P3 — PRD WRITING

### P3.1 — PRD Structure

```
PRD TEMPLATE:
  TITLE:           [feature name]
  AUTHOR:          [PM]
  STATUS:          draft / review / approved / shipped
  DATE:            [updated]

  PROBLEM
    [User pain, with evidence: interviews, data, support tickets]

  GOAL
    [Outcome metric: by how much, by when]

  NON-GOALS
    [What we are explicitly NOT doing in this PRD]

  USERS
    [Personas affected, with rough count]

  USER STORIES
    As a [persona]
    I want to [action]
    So that [outcome]

  PROPOSED SOLUTION
    [Brief description, mockups if any]
    [Key flows]

  SUCCESS METRICS
    [North star: what moves]
    [Leading indicators: activation, adoption, retention]
    [Quality bar: error rate, latency, etc.]

  OPEN QUESTIONS
    [Things we don't know yet]

  DEPENDENCIES
    [Teams, services, vendors]

  RISKS
    [What could go wrong, mitigation]

  LAUNCH PLAN
    [Rollout strategy, success criteria, rollback]
```

### P3.2 — User Story Quality

```
GOOD USER STORY:
  - Specific persona (not "user")
  - Specific action (not "interact with")
  - Specific outcome (not "have a good experience")
  - Testable (can write an acceptance test)
  - Sized: 1-3 days of work

EXAMPLES:
  BAD:  As a user, I want a better dashboard
  GOOD: As a marketing manager, I want to see weekly campaign
        performance at a glance, so I can spot underperformers
        within 5 minutes instead of 30.

ACCEPTANCE CRITERIA:
  Given [precondition]
  When [action]
  Then [expected result]
  (3-7 per story, testable)
```

## P4 — PRIORITIZATION

### P4.1 — RICE Scoring

```
RICE:
  R - Reach:        how many users per quarter
  I - Impact:       massive(3) / high(2) / medium(1) / low(0.5) / minimal(0.25)
  C - Confidence:   high(100%) / medium(80%) / low(50%)
  E - Effort:       person-months

Score = (R * I * C) / E

WHEN TO USE:
  - Comparing many features
  - Need a single number
  - Cross-functional alignment

LIMITS:
  - Subjective inputs (impact, confidence)
  - Ignores strategic value
  - Anchors on quantitative inputs that may be wrong
```

### P4.2 — WSJF (Weighted Shortest Job First)

```
WSJF = Cost of Delay / Job Size

Cost of Delay = User-Business Value + Time Criticality + Risk Reduction

USE WHEN:
  - SAFe / scaled agile
  - Many features, hard to compare
  - Need to incorporate strategic value

LIMITS:
  - Subjective scores
  - Time-cost of doing the analysis itself
```

### P4.3 — MoSCoW & Kano

```
MOSCOW:
  Must:    non-negotiable, table stakes
  Should:  important, do if possible
  Could:   nice to have
  Won't:   not this time (not "never")

USE WHEN: stakeholder alignment, MVP scoping

KANO:
  Basic:    expected, absence dissatisfies, presence doesn't delight
  Performance: more is better (linear)
  Excitement: unexpected, delights when present
  Indifferent: doesn't matter
  Reverse:   presence dissatisfies (anti-feature)

USE WHEN: feature mix decisions, customer satisfaction analysis
```

## P5 — ROADMAP

### P5.1 — Roadmap Formats

```
NOW / NEXT / LATER:
  Now:   committed, scoped, in flight
  Next:  planned, scoped, on deck
  Later: ideas, not yet scoped

  Pros: simple, no fake dates
  Cons: hard to communicate urgency

THEMES:
  Theme: "Reliability" -> 3 features
  Theme: "AI features" -> 4 features
  Pros: strategic alignment
  Cons: less granular

QUARTERLY (with dates):
  Q1: A, B, C
  Q2: D, E, F
  Pros: stakeholders can plan
  Cons: dates lie; commits when you should be flexible

OKRS:
  Objective: qualitative goal
  Key Results: measurable (3-5)
  Features support KRs but are not the KRs themselves
  Pros: outcome-focused
  Cons: gamification risk
```

### P5.2 — Anti-Patterns in Roadmaps

| Anti-pattern | Problem | Correct |
|---|---|---|
| Roadmap = list of features | Optimizes for output, not outcome | Roadmap = themes supporting OKRs |
| Date-precise 12 months out | False precision, broken promises | Themes for 6-12 months, dates for now/next |
| No "won't do" list | Infinite backlog, no focus | Explicit "not doing this" list |
| Roadmap owned by sales | Builds to customer requests, not strategy | PM owns strategy, sales is an input |
| No success metric per feature | Cannot tell if it worked | Each feature has a metric + success criteria |

## P6 — METRICS

### P6.1 — North Star Metric

```
CHOOSE A NORTH STAR THAT:
  - Reflects delivered customer value
  - Leads to revenue (causally)
  - Is a leading indicator of business health
  - Is measurable, ideally daily

EXAMPLES:
  - Slack:   messages sent by teams of 2+ people
  - Airbnb:  nights booked
  - Spotify: time spent listening
  - Notion:  weekly active editors

DO NOT:
  - Pick revenue (lagging, not actionable)
  - Pick a vanity metric (signups without activation)
  - Pick too narrow (one feature's metric)
```

### P6.2 — Metric Trees

```
NORTH STAR
  |-- Acquisition
  |     |-- impressions
  |     |-- CTR
  |     |-- signups
  |-- Activation
  |     |-- % signup -> active
  |     |-- time to first value
  |-- Retention
  |     |-- DAU/MAU
  |     |-- churn rate
  |-- Revenue
  |     |-- ARPU
  |     |-- LTV
  |-- Referral
        |-- invites sent
        |-- invite -> signup

EACH BRANCH has an owner and a target.
```

## P7 — GO-TO-MARKET

### P7.2 — Launch Checklist

```
PRE-LAUNCH (T-4 weeks):
  [ ] PRD approved
  [ ] Engineering ship date confirmed
  [ ] Marketing materials drafted
  [ ] Sales enablement ready
  [ ] Support trained
  [ ] Pricing decided
  [ ] Documentation drafted
  [ ] Beta customers identified
  [ ] Analytics + events shipped
  [ ] Rollback plan documented

LAUNCH (T-0):
  [ ] Feature flag at 0%, smoke test
  [ ] 1% rollout
  [ ] 10% rollout
  [ ] 50% rollout
  [ ] 100% rollout
  [ ] Announcement (blog, email, social)
  [ ] Monitor metrics dashboard

POST-LAUNCH (T+2 weeks):
  [ ] Metrics review: did we hit target?
  [ ] User feedback: tickets, interviews, surveys
  [ ] Iteration plan: what to fix, what to build next
  [ ] Retro: what went well, what didn't
```

## P8 — OUTPUT FORMATS

### P8.1 — One-Pager

```
PROBLEM       [1 sentence, with evidence]
SOLUTION      [1 sentence, with mockup link]
METRIC        [what moves, by how much]
EFFORT        [rough size]
RISK          [biggest risk]
DECISION      [what you need from the reader]
```

### P8.2 — Stakeholder Update

```
WINS THIS WEEK
  - [outcome shipped, with metric]

RISKS / BLOCKERS
  - [what's at risk, what's needed]

NEXT WEEK
  - [what we'll do]

METRICS
  - [key chart or number]
```

## P9 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Roadmap = feature list with dates | False precision, no strategy | Themes + outcomes + scope of now/next |
| Build it and they will come | No validation = waste | Discovery, validate before build |
| Optimize for the loudest customer | Biased, not representative | Aggregate across users, segments |
| No success metric | Cannot tell if it worked | Each feature has a metric + target |
| "We have to ship it" with no data | Feature factory | Make trade-offs explicit, deprioritize |
| Take feedback literally | Users describe solutions, not problems | Find the underlying job-to-be-done |
| Roadmap owned by engineering capacity | What gets built is what's easy | Roadmap owned by strategy, capacity is a constraint |
| 12-month date-precise plan | Will be wrong by month 2 | Themes for 6-12mo, dates for now/next |

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every PRD, prioritization decision, or roadmap change.*

*Escalate to engineering-manager when: roadmap requires team scaling. Escalate to cto when: roadmap requires architecture or platform changes.*
