---
title: "Engineering Manager — People Leadership & Technical Decision-Making"
type: reference
status: active
version: 1.0.0
updated: 2027-05-28
owner: synarc-core
tags:
  - engineering-manager
  - people-leadership
  - career-development
  - project-planning
  - stakeholder-management
  - incident-leadership
  - hiring
  - engineering-culture
  - team-building
  - performance-management
  - organizational-design
---

# Purpose

Reasoning framework for engineering management — balancing people leadership with technical decision-making, career development, project planning, hiring, incident leadership, team scaling, performance management, and organizational design.

# Scope

Technical decisions with people impact, project planning and estimation, career coaching, hiring evaluation, incident leadership, team scaling methodology, performance management, organizational design, technical decision facilitation. Inherits synarc core (WorkType taxonomy, risk floors, quality gates).

# Inputs

Team composition and skills, project backlog and roadmap, business priorities, individual career goals, incident data, hiring pipeline, org structure and headcount plan.

# Output

Team plans and sprint commitments, 1:1 coaching and growth plans, hiring decisions and interview feedback, incident response coordination, performance evaluations, org design proposals, facilitated technical decisions.

# Key Frameworks

## P1. Technical Decisions with People Impact [P2.1]

Every technical decision has a people dimension. Before deciding:

| Factor | Question |
|---|---|
| Team capacity | Does the team have time and energy? |
| Skill match | Does the team have required skills? |
| Growth opportunity | Does this help someone grow? |
| Morale impact | Will this demotivate anyone? |
| On-call burden | Does this increase toil? |
| Knowledge distribution | Does this concentrate knowledge? |

**Decision velocity guide:** Low risk/reversible → 1 day, individual engineer. Medium risk/reversible → 1 week, tech lead + EM input. High risk/reversible → 2 weeks, EM + principal. High risk/irreversible → 1 month, leadership team.

## P2. Project Planning & Estimation [P2.2]

**Estimation approach:** Break work into pieces <3 days. Each piece gets optimistic/likely/pessimistic estimate. Aggregate: (O + 4L + P) / 6. Buffer: 20% known unknowns, 50% unknown unknowns.

**When late:** Do NOT add people (Brook's Law). DO reduce scope. DO extend timeline. DO communicate early.

**Roadmapping:** Now (current quarter, sprint-level) → Next (next quarter, themes/epics) → Future (2-4 quarters, bets) → Vision (12+ months, strategic direction).

## P3. Career Development Coaching [P2.3]

**Level focus:** Junior (L3/L4) → teach task breakdown and testing. Mid (L5) → challenge with stretch assignments. Senior (L6) → enable design delegation. Staff (L7+) → connect to org-wide problems.

**1:1 growth conversation structure:**
- WHAT: energized/drained you? What to learn next?
- SO WHAT: How does this align with career goals? What's the gap?
- NOW WHAT: One action in 2 weeks, support needed, check-in date.

**Sponsorship vs mentorship:** Mentorship = advice. Sponsorship = advocate when not in room (stretch assignments, promotions, visibility, defending work).

## P4. Hiring Decision Reasoning [P2.4]

**Structured scoring:** 1=Strong No, 2=No (substantial concerns), 3=Yes (minor concerns), 4=Strong Yes (raises the bar).

**Decision rules:** Any 1 from any interviewer → NO. All 3+ → YES. Mix of 2s/3s → discuss. If split cannot reach consensus → default to NO (hiring mistakes compound).

**Golden rule:** Hire people better than current team average in at least one dimension.

## P5. Incident Leadership [P2.5]

Manager's role during incident is NOT to debug. It is to:

- COORDINATE: Who is on call? Incident commander appointed?
- COMMUNICATE: Internal status every N minutes, external one-liner for stakeholders
- DECIDE: Rollback vs fix forward? Escalate? Notify users?
- PROTECT: Ensure team takes breaks, push back on premature RCA, document in real time

**Post-incident (within 5 days):** Blameless postmortem with action items, owners, and deadlines.

## P6. Team Scaling [P2.6]

**Stages:** Founding (1-5, generalists) → Seed (5-10, emerging specialization) → Growth (10-20, clear roles) → Scaling (20-50, multiple teams) → Scaled (50+, full org).

**Manager ratio:** IC:EM = 6:1 to 8:1 (never exceed 10:1). EM:Director = 4:1 to 6:1.

**Split triggers:** >10 engineers, >3 unrelated systems, standup >10 people, cross-team decisions >1 week, tech lead overload.

## P7. Performance Management [P2.7]

**SBI Feedback Model:** SITUATION (when/where) → BEHAVIOR (specific observation) → IMPACT (effect). Then ask for perspective, discuss, agree on path.

**PIP framework:** Only after 3+ clear feedback attempts. Structure: current gap (measurable) → expectation → support provided → timeline (30-60 days) → checkpoints → consequences.

**Common problems & interventions:** Missing deadlines → coach estimation. Low quality → pair programming. Disengaged → diagnose burnout. Defensive → build safety, model receiving feedback.

## P8. Organizational Design [P2.8]

**Team topologies:** Stream-aligned (complete value stream), Enabling (help others build capabilities), Complicated-subsystem (deep expertise), Platform (internal services).

**Conway's Law applied:** Loosely-coupled teams → loosely-coupled systems. Reverse Conway: design team structure to produce desired architecture.

**Communication structures:** Mesh (fast, small teams), Hub-and-spoke (new managers), Hierarchical (large orgs), Federated (remote, async), Matrix (cross-functional).

**Anti-patterns:** Hero org (2-3 dependencies), Siloed teams, Matrix chaos (3+ managers per person), Reorg fatigue (quarterly changes), Over-optimization, Under-management (12+ reports).

## P9. Technical Decision Facilitation [P2.9]

Manager does not make the technical decision — ensures it is made correctly. Lead architecture discussions: define decision, identify participants (≤8), gather context, set timebox, let most junior speak first, generate options before converging, evaluate against explicit criteria, document and communicate.
