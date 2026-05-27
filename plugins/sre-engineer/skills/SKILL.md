---
parent: synarc
title: SRE Engineer
subtitle: Site Reliability Engineering — Production-Grade Reliability, Systems Thinking, and Operational Excellence
nav_order: 5
has_children: true
permalink: /skills/sre-engineer/
maturity: live
---

# SKILL: SRE Engineer

**Domain:** Site Reliability Engineering  
**Persona:** SRE Engineer  
**Parent Skill:** synarc  
**Skill Level:** 300–400 (Advanced to Distinguished)  
**Last Updated:** 2026-05-27  
**Status:** Live

---

## Table of Contents

1. [P1: Persona & Mindset](#p1-persona--mindset)
2. [P2: Core Methodology](#p2-core-methodology)
3. [P3: SRE Frameworks](#p3-sre-frameworks)
4. [P4: Reliability Patterns](#p4-reliability-patterns)
5. [P5: Error Budget & SLO Design](#p5-error-budget--slo-design)
6. [P6: Production Readiness](#p6-production-readiness)
7. [P7: On-Call & Incident Management](#p7-on-call--incident-management)
8. [P8: Worked Examples (12+)](#p8-worked-examples-12)
9. [P9: Anti-Patterns](#p9-anti-patterns)
10. [P10: Quality Gates & Assessment](#p10-quality-gates--assessment)



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

# P1: Persona & Mindset

## P1.1 The SRE Identity

An SRE Engineer sits at the intersection of software engineering and operations. The core identity is defined by a zero-tolerance policy toward manual toil, a compulsion to quantify everything in terms of service level objectives, and an unshakable belief that reliability is achieved through engineering, not heroics.

The primary metric of an SRE's effectiveness is not uptime percentage but the ratio of engineering effort spent on reliability improvement versus reactive operations. Google's published target is 50% of SRE time on engineering work (feature development, automation, capacity planning, chaos engineering) and no more than 50% on operational overhead. Any team exceeding 50% toil must reduce it before accepting new operational responsibilities.

An SRE's daily reality: reading SLI burn rates, tuning alert thresholds, designing chaos experiments, validating capacity models, conducting postmortems, writing automation code, and performing production readiness reviews of adjacent services. The SRE is the production conscience of the organization.

The SRE Engineer persona is characterized by these core competencies:
1. **Quantitative reasoning** — ability to model reliability mathematically using SLOs, error budgets, and statistical process control
2. **Systems thinking** — understanding distributed system behavior, emergent properties, cascading failures, and feedback loops
3. **Software engineering** — writing production-grade automation, tooling, and instrumentation code
4. **Operational maturity** — incident response discipline, postmortem rigor, and toil reduction instinct
5. **Communication** — translating technical reliability concepts into business risk language for executives
6. **Risk management** — making evidence-based tradeoffs between reliability and velocity

The SRE Engineer does not: manage infrastructure provisioning, configure CI/CD pipelines, write application business logic, perform security audits, or act as the incident commander (IC) during incidents. These roles belong to other personas in the synarc taxonomy.

## P1.2 Reliability Is a Feature

Reliability is a product feature with measurable business value. It competes with other features for engineering investment. The SRE frames reliability decisions in terms of customer impact and revenue exposure, not technical purity.

The formula for reliability as a feature:
- Each SLO violation represents a discrete customer impact event
- SLO violations can be correlated with business metrics: revenue, retention, support tickets, brand sentiment
- A 0.1% increase in error rate at checkout correlates to  in abandoned cart revenue loss
- A 500ms increase in p99 latency on the search API correlates to Y% decrease in user engagement

The SRE must be able to articulate: "If we want 99.99% availability instead of 99.9%, the marginal cost is  in engineering investment, and the marginal benefit is  in avoided revenue loss. The error budget difference is 52.56 minutes per year vs 8.76 hours per year. For our traffic volume of 10M requests/day, that is 10,000 additional failed requests we accept under the 99.9% SLO."

The business case for SRE investment follows a J-curve: early investment in reliability infrastructure (monitoring, automation, capacity) increases operational capacity, reduces incident frequency, and increases release velocity. The payoff occurs when error budget burn is sustainable and engineering time shifts from firefighting to feature development.

## P1.3 Risk Acceptance Over Perfection

Zero-downtime is not a goal. The SRE defines reliability targets as explicit risk acceptance. The error budget is the quantified expression of acceptable failure.

The principle: you cannot achieve 100% reliability at any scale, and attempting to do so results in infinite cost curves and zero feature velocity. The SRE negotiates the error budget with product stakeholders:

- Product wants 99.999% (five nines) — that allows 5.26 minutes of downtime per year
- Engineering reality: five nines requires multi-region active-active, N+3 redundancy, fault injection testing in production, and 24/7 on-call with 1-minute response SLA
- Cost: 3x infrastructure, 2x engineering overhead, 40% reduction in feature velocity
- Negotiated outcome: 99.95% (three and a half nines) — allows 4.38 hours downtime per year — is acceptable with single-region active-passive, N+1 redundancy, and standard on-call

The error budget is the common language for this negotiation. Product stakeholders approve budgets of acceptable failure. Engineering spends those budgets on feature velocity.

Risk acceptance requires:
- Documented risk tolerance per service tier (Tier 0: critical infrastructure, Tier 1: customer-facing, Tier 2: internal tools, Tier 3: experimental)
- Defined SLO targets per tier with explicit business justification
- Error budget consumption as a release gate (cannot release if budget is exhausted)
- Quarterly SLO review with product and executive stakeholders
- Annual risk posture review and target adjustment

## P1.4 Toil Elimination as a First Principle

Toil is defined as operational work that is manual, repetitive, automatable, tactical, devoid of enduring value, and scales linearly with service growth. Toil is the enemy of SRE.

Toil characteristics from Google SRE:
1. **Manual** — requires human intervention, no automation
2. **Repetitive** — performed frequently, same steps each time
3. **Automatable** — could be replaced by a script or tool
4. **Tactical** — reactive, interrupt-driven, not strategic
5. **Devoid of enduring value** — service runs the same after it is done
6. **Scales linearly with service growth** — doubling the service doubles the toil

Toil classification by time cost:
| Category | Hours/Week | Severity | Action Required |
|----------|------------|----------|-----------------|
| Acceptable | <5 | Low | Monitor quarterly |
| Concerning | 5-15 | Medium | Create reduction plan |
| Critical | 15-25 | High | Freeze new operational responsibilities |
| Unacceptable | >25 | Severe | Immediate executive escalation |

The toil budget: no more than 50% of SRE time on operational work (toil + incident response + on-call). Measured quarterly through time tracking or ticket classification.

Toil reduction hierarchy (from most to least impactful):
1. **Eliminate** — remove the toil-inducing process entirely
2. **Automate** — replace human steps with software
3. **Simplify** — reduce complexity of the process
4. **Document** — provide runbooks so anyone can do it
5. **Accept** — consciously accept necessary toil with known cost

Toil measurement in practice:
- Tag every ops ticket with a toil score (1-5)
- Time study every quarter: sample 2 weeks of on-call activity
- Automation coverage ratio: (automated tasks)/(automated + manual tasks)
- Ticket volume trend per service per month
- Mean time to resolve (MTTR) for automated vs manual tasks

## P1.5 Blameless Culture & Postmortem Discipline

A blameless culture is the non-negotiable foundation of SRE practice. Without it, incident analysis becomes witch hunt, systemic issues remain hidden, and reliability plateaus.

Blameless does not mean consequence-free. It means the investigation focuses on systemic causes, not individual actions. When a person makes a mistake, the question is: "What in the system allowed that mistake to cause an incident?" not "Who do we fire?"

Postmortem requirements:
- Conducted for: all Severity 0 and Severity 1 incidents, any incident with customer impact > 1% of user base, any incident with duration > 30 minutes, any incident with revenue impact > 
- Timeline: draft within 48 hours, review with team within 72 hours, publish within 5 business days
- Required sections: incident summary, timeline (UTC), detection, impact assessment, root cause (5 Whys), contributory factors, action items (with owners and deadlines), what went well, what went wrong, lessons learned
- Action items: each must have a single owner, a due date, and a verification step. No "indefinitely" or "ongoing" action items.
- Postmortem review: team reads postmortem in a meeting. Action items are entered into tracking system with weekly review.

The five whys methodology:
1. Why did the service go down? → Deployment introduced a nil pointer dereference
2. Why did the deployment go out? → CI passed tests but test suite did not cover this code path
3. Why did the test suite not cover this path? → No integration test for upstream dependency change
4. Why was there no integration test? → Team velocity pressure skipped integration test requirement
5. Why was velocity prioritized over testing? → No error budget policy in place to gate releases

Action items from these five whys: (1) add integration test for nil response, (2) implement release gating with error budget check, (3) add canary analysis to deployment pipeline.

Blameless culture indicators:
- Postmortems use passive voice about people, active voice about systems
- Action items target processes, not training or be more careful
- Incident participants volunteer to write postmortems
- Postmortem action item closure rate > 80%
- No postmortem has ever been used in a performance review

## P1.6 Production Mindset

Production mindset means treating production as the most important environment and designing all systems, processes, and behaviors around production reliability.

Production mindset behaviors:
- Changes are rolled out progressively (canary → staging → prod — never directly to prod)
- Every change has a rollback plan tested before deployment
- Monitoring and alerting are verified before any deployment
- Dashboards are validated against synthetic traffic before relying on them
- Runbooks exist for every paged alert
- SLO compliance is verified after every change
- Capacity is monitored during every rollout
- Feature flags are used for all non-trivial changes
- Configuration changes follow the same pipeline as code changes
- Database schema changes are backward compatible (no breaking changes)

Production readiness check (daily):
- Are all services within SLO? Check dashboards
- Is error budget burn rate normal? Check burn rate alerts
- Are there any ongoing incidents? Check incident tracker
- Are there any pending production changes? Check deployment pipeline
- Is capacity adequate for forecasted load? Check capacity model
- Are all postmortem action items on track? Check tracking system

Production mindset in development:
- Developers run their own services (or share on-call)
- All developers understand SLOs for their services
- Production access is gated on completing production training
- Canary analysis is part of the development workflow
- Performance testing is part of the definition of done
- Monitoring instrumentation is added with every feature

## P1.7 Data-Driven Decision Making

SRE decisions are based on quantitative data, not opinions. Every subjective reliability claim must be translated into a measurable signal.

Data-driven reliability decisions:
| Decision | Data Required | Source |
|----------|---------------|--------|
| Change SLO target | Historical SLO compliance, error budget consumption, business impact analysis | Monitoring system, product analytics |
| Add redundancy | Utilization trends, saturation signals, failure mode analysis | Capacity monitoring, incident data |
| Automate process | Toil measurement, frequency, complexity score | Time tracking, ticket analysis |
| Chaos experiment | Steady-state SLO compliance, resistance metrics | Monitoring, previous incidents |
| Release frequency | Error budget consumption per release, rollback rate | Deployment pipeline, SLO tracker |

Statistical rigor in SRE:
- SLO compliance windows: 30-day rolling, 7-day rolling, 1-day rolling
- Burn rate measurement: 1 hour, 6 hours, 24 hours, 5 days, 30 days
- Alert thresholds: statistical significance at p < 0.05
- Capacity forecasting: linear regression, polynomial, or Holt-Winters
- Anomaly detection: 3-sigma, IQR, or machine learning models
- A/B test for reliability changes: holdout groups, significance testing

The SRE Engineer maintains a library of dashboards:
- Executive dashboard: SLO compliance by service tier, error budget remaining, incident summary
- Engineering dashboard: burn rates, alert status, deployment health, capacity utilization
- On-call dashboard: current pages, open incidents, runbook links, handoff notes
- Capacity dashboard: resource utilization trends, forecasting, saturation signals
- Toil dashboard: toil hours per team, automation coverage, ticket volume trends

---

# P2: Core Methodology

## P2.1 The SRE Hierarchy

The SRE hierarchy of needs, from foundational to aspirational:

`
Level 5: Chaos Engineering & Game Days
Level 4: Capacity Planning & Demand Shaping
Level 3: SLO/SLI/Error Budget Framework
Level 2: Incident Response & Postmortems
Level 1: Monitoring, Alerting & Dashboards
Level 0: The Production Environment (Infrastructure)
`

**Level 0 — The Production Environment:** The foundation. Without a reliable production environment, nothing above it functions. This level covers infrastructure provisioning, configuration management, and deployment automation. Owned by the Infrastructure Engineer persona. The SRE validates that Level 0 meets reliability requirements but does not build it.

**Level 1 — Monitoring, Alerting & Dashboards:** You cannot manage what you cannot measure. This level includes instrumentation, metrics collection, log aggregation, distributed tracing, dashboard creation, and alert configuration. The SRE ensures meaningful signals reach the right people at the right time with appropriate severity.

**Level 2 — Incident Response & Postmortems:** When things break, the response must be disciplined. This level covers severity classification, escalation procedures, incident command, communication templates, and postmortem analysis. The SRE designs the incident management system and participates as subject matter expert.

**Level 3 — SLO/SLI/Error Budget Framework:** The core of SRE practice. Define what matters (SLIs), set targets (SLOs), and track acceptable failure (error budgets). This level enables data-driven reliability decisions and provides the vocabulary for reliability conversations with product stakeholders.

**Level 4 — Capacity Planning & Demand Shaping:** Proactive reliability. Model demand, forecast growth, design for capacity, and implement demand-shaping mechanisms like rate limiting and auto-scaling. The SRE ensures the service has enough resources to meet its SLOs under projected load.

**Level 5 — Chaos Engineering & Game Days:** The final frontier. Deliberately inject failures to verify system behavior, validate SLOs under stress, and uncover unknown failure modes. The SRE designs and executes experiments that increase confidence in system reliability.

No level functions without the levels beneath it. A team cannot implement SLOs without monitoring. A team cannot do capacity planning without SLOs defining acceptable performance. A team cannot do chaos engineering without capacity planning ensuring baseline stability.

## P2.2 Service Level Terminology

**SLI (Service Level Indicator):** A quantitative measure of some aspect of the service. Examples: request latency (p95, p99), error rate, throughput, availability (fraction of successful requests), durability (fraction of records preserved), correctness (fraction of correct responses), freshness (age of data served).

**SLO (Service Level Objective):** A target value or range for an SLI. Examples: p99 latency < 500ms, availability >= 99.9%, error rate < 0.1%. SLOs must be achievable, measurable, and meaningful.

**SLA (Service Level Agreement):** A contractual commitment to meet specified SLOs, with consequences (typically financial) for violation. External SLAs are critical commercial instruments. Internal SLAs are operational commitments between teams.

**Error Budget:** The amount of failure a service can tolerate within an SLO compliance window. Calculated as (1 - SLO) over the window. For a 99.9% SLO over 30 days, the error budget is 0.1% of total possible successful events, or 43.2 minutes of downtime.

**Compliance Window:** The time period over which SLO compliance is measured. Common windows: 30 days rolling, 28 days (4 weeks), calendar month, quarter.

**Burn Rate:** The rate at which the error budget is being consumed. A burn rate of 1.0 means the budget will last exactly the compliance window. A burn rate of 2.0 means the budget will be exhausted in half the window at the current rate.

**Remaining Budget:** The fraction of the error budget that remains unspent. (Error budget - consumed budget) / Error budget. Expressed as a percentage.

**Budget Consumption:** The amount of error budget consumed in a given period. Measured in bad events, bad requests, or downtime seconds against the total allowed.

**MQL (Multi-Window Multi-Burn-Rate):** An alerting approach using multiple time windows and burn rate thresholds to detect SLO violations with statistical significance while minimizing false positives.

**Alert Fatigue:** A state where on-call engineers receive so many irrelevant or low-priority alerts that they miss or ignore critical ones. Measured by the ratio of actionable pages to total pages.

**Signal-to-Noise Ratio (SNR):** The ratio of actionable alerts to non-actionable alerts. A healthy SNR is > 0.5 (at least one actionable alert for every two non-actionable). Target SNR: > 1.0.

**MTTD (Mean Time to Detect):** The average time from incident start to detection. Includes monitoring latency, page delivery, and human response.

**MTTR (Mean Time to Resolve):** The average time from incident detection to mitigation. Includes diagnosis, decision-making, and action execution.

**MTBF (Mean Time Between Failures):** The average time between service failures. Useful for hardware reliability but less applicable to distributed services.

**Toil:** Operational work that is manual, repetitive, automatable, tactical, and devoid of enduring value.

## P2.3 SLI Design & Specification

SLIs are the building blocks of SRE. An SLI must be:
- **Meaningful:** directly correlates with user experience
- **Measurable:** instrumentable in production without significant overhead
- **Specific:** clearly defined numerator and denominator
- **Actionable:** degraded SLI triggers a specific response
- **Reliable:** measurement itself is reliable and verifiable

SLI categories:

**Availability SLI:**
- Definition: fraction of well-formed requests that complete successfully
- Numerator: count of successful responses (HTTP 2xx, 3xx)
- Denominator: count of all well-formed requests
- Formula: successful / (successful + failed)
- Measurement: request-level instrumentation, load balancer logs, synthetic probes
- Windows: 1 minute, 5 minutes, 1 hour aggregation

**Latency SLI:**
- Definition: fraction of requests served faster than threshold
- Numerator: count of requests with duration < threshold
- Denominator: count of all well-formed requests
- Formula: fast / (fast + slow)
- Measurement: server-side timing, client-side RUM, load balancer metrics
- Thresholds: p50 (median), p95, p99, p999
- Windows: 1 minute, 5 minutes, 1 hour

**Throughput SLI:**
- Definition: requests per second (RPS) or transactions per second (TPS)
- Formula: count of requests / time window
- Measurement: request counting, database query counting, message queue length
- Windows: 1 minute, 5 minutes, 1 hour

**Correctness SLI:**
- Definition: fraction of responses that are correct
- Numerator: count of correct responses
- Denominator: count of all responses
- Formula: correct / total
- Measurement: data validation, consistency checks, integrity verification
- Windows: varies by service (minutes to hours)

**Freshness SLI:**
- Definition: fraction of data reads that return data fresher than threshold
- Numerator: count of reads with staleness < threshold
- Denominator: count of all reads
- Formula: fresh / total
- Measurement: write timestamp tracking, read timestamp comparison
- Windows: 1 minute, 5 minutes, 1 hour

**Durability SLI:**
- Definition: fraction of records that are not lost
- Numerator: count of records confirmed stored
- Denominator: count of records submitted for storage
- Formula: durably stored / submitted
- Measurement: acknowledgment tracking, periodic reconciliation
- Windows: long (hours to days)

SLI specification template:
`
SLI Name: [name]
Service: [service name]
Category: [Availability|Latency|Throughput|Correctness|Freshness|Durability]
Definition: [clear description of what is measured]
Numerator: [exact specification of good event]
Denominator: [exact specification of total events]
Measurement Method: [how it is instrumented and collected]
Aggregation: [time window, statistical method]
Threshold: [for latency, freshness — the acceptable boundary]
Rationale: [why this SLI matters to users]
`

## P2.4 SLO Targeting & Compliance Windows

SLO targets translate SLIs into commitments. The target selection process:

**Target selection guidelines:**
- 99.9% (three nines): acceptable for internal tools and non-critical services, allows 8.76 hours downtime/year
- 99.95% (three and a half nines): standard for most business-critical services, allows 4.38 hours downtime/year
- 99.99% (four nines): appropriate for critical customer-facing services, allows 52.56 minutes downtime/year
- 99.999% (five nines): reserved for life-critical or revenue-critical infrastructure, allows 5.26 minutes downtime/year

**Reality check:** Five nines requires:
- Multi-region active-active deployment
- Automated failover with < 30 second detection and < 60 second recovery
- N+3 redundancy across all layers
- No single points of failure
- Fault injection testing on every release candidate
- 24/7 on-call with 1-minute acknowledgment SLA
- Redundant network paths, power, and cooling
- Annual DR testing with pass/fail criteria
- Budget: 3-10x standard infrastructure and engineering cost

**Compliance windows:**
| Window | Purpose | Recommended For |
|--------|---------|-----------------|
| 24 hours rolling | Daily operations, short-term monitoring | All services |
| 7 days rolling | Weekly engineering review | Tier 2, Tier 3 |
| 30 days rolling | Primary compliance window | All services |
| 90 days rolling | Quarterly business review | Tier 0, Tier 1 |
| Calendar month | External SLA reporting | Services with SLAs |

**Compliance calculation:**
- Good events / total events over the window
- For availability: uptime seconds / total seconds
- For latency: fast requests / total requests
- For error budget: (1 - actual) / (1 - target) or equivalent in events

**SLO example:**
- SLI: p99 latency of the checkout API
- SLO target: 99.9% of requests complete in < 2 seconds at p99
- Compliance window: 30 days rolling
- Compliance target: >= 99.9% (must be at or above target over the window)
- Error budget: 0.1% of total requests = up to X requests can be slow
- Budget consumption tracking: daily, weekly, monthly burn rate dashboards

## P2.5 Error Budget Mechanics

Error budget is the amount of failure a service can experience before violating its SLO. It converts technical reliability into a business-manageable metric.

**Error budget calculation:**
- SLO target: 99.9% availability over 30 days
- Total seconds in 30 days: 2,592,000
- Allowed downtime: 2,592,000 * (1 - 0.999) = 2,592 seconds = 43.2 minutes
- For request-based: total requests in 30 days * (1 - SLO target) = allowed bad events

**Error budget consumption tracking:**
- Real-time consumption: (bad events / total events) * window
- Remaining budget: (allowed bad events - consumed bad events) / allowed bad events
- Burn rate: current consumption rate / expected consumption rate
- Budget depletion: if burn rate > 1.0, budget will exhaust before window end

**Error budget spending:**
- Incidents consume error budget (downtime, errors, latency spikes)
- Deployments that degrade SLIs consume error budget
- Maintenance windows consume error budget (unless explicitly excluded)
- Known issues consume error budget until fixed

**Error budget policy:**
| Budget Remaining | Action |
|-----------------|--------|
| > 50% | Business as usual, can deploy freely |
| 25% - 50% | Deployments require SRE team lead approval |
| 10% - 25% | Deployments frozen; only critical fixes and rollbacks |
| < 10% | Emergency mode: incident response to reduce burn rate; all non-critical work halted |
| Exhausted (0%) | SLO violation declared; formal postmortem required; executive notification |

**Error budget adjustments:**
- SLO target changes adjust the budget at next window boundary
- Planned maintenance windows can be excluded from budget if documented and approved
- Client-side issues beyond service control can be excluded (with evidence)
- Budget is not refilled early — the compliance window determines the budget

**Multi-service budget composition:**
- Service A (99.9%): budget = 43.2 min/month
- Service B (99.95%): budget = 21.6 min/month
- System SLO (composite): weakest link or weighted combination
- Composite budget calculation depends on service topology and dependencies

## P2.6 Burn Rate Alerting Architecture

Burn rate alerting alerts when error budget is being consumed too quickly. It provides early warning before SLO violation occurs.

**Burn rate fundamentals:**
- Burn rate = error rate / (1 - SLO target)
- Burn rate of 1.0 exactly depletes budget over the compliance window
- Burn rate of 2.0 depletes budget in half the window
- Burn rate of 10 depletes budget in 1/10 of the window

**Alerting thresholds:**
| Burn Rate | Duration | Budget Consumed | Alert Severity | Response |
|-----------|----------|-----------------|----------------|----------|
| >= 2 | 1 hour | 0.28% | Warning | Investigate during business hours |
| >= 5 | 30 minutes | 0.35% | Warning | Investigate within 1 hour |
| >= 10 | 10 minutes | 0.23% | Page | On-call responds within 5 minutes |
| >= 20 | 5 minutes | 0.23% | Page | On-call responds immediately |

**Burn rate window sizing:**
- Short windows (5-10 minutes): detect fast burn rates quickly
- Long windows (1-6 hours): detect slow burn that would exhaust budget over time
- Multi-window approach: require both short and long windows to fire
- Window selection: short = 1-5% of compliance window, long = 5-20% of compliance window

**Burn rate alert conditions:**
`
Alert condition: burn_rate >= threshold for duration
- threshold: the burn rate multiplier that triggers alarm
- duration: how long the rate must persist before alerting
- window: the time window over which burn rate is calculated
`

**Alert fatigue prevention with burn rates:**
- Single window alerts are noisy — use multi-window approach
- Only page when budget consumption rate threatens SLO within the compliance window
- Burn rate must be sustained for minimum duration (avoid transient spikes)
- Cooldown period after alert fires (minimum 30 minutes between identical alerts)
- Separate warning (email/chat) from paging (phone/SMS)

## P2.7 Multi-Window Multi-Burn-Rate Alerting

MQL (Multi-Window Multi-Burn-Rate) alerting combines two windows with two burn rate thresholds to achieve high sensitivity with low false positive rate.

**MQL architecture:**
- Window 1 (short): high burn rate threshold, short duration (e.g., burn rate >= 14 for 5 minutes)
- Window 2 (long): moderate burn rate threshold, longer duration (e.g., burn rate >= 2.5 for 30 minutes)
- Alert fires when BOTH windows are in alarm simultaneously
- This prevents: (a) transient spikes from paging, (b) slow burn from escaping detection

**Standard MQL configuration:**
`
# Fast burn detection (page)
alert: HighBurnRate
condition: burn_rate >= 14 for 5m
severity: critical (page)

# Slow burn detection (page)
alert: MediumBurnRate
condition: burn_rate >= 2.5 for 30m
severity: critical (page)

# Composite alert (requires both)
alert: MQL_BurnRatePage
condition: HighBurnRate AND MediumBurnRate
severity: page
`

**Tuning MQL parameters:**
- Start with standard values: burn_rate 14/5min + 2.5/30min for 99.9% SLO
- For tighter SLOs (99.99%): use burn_rate 20/5min + 3.5/30min
- For looser SLOs (99%): use burn_rate 8/5min + 2.0/30min
- Adjust based on observed false positive rate (target: < 1 false page per week per service)
- Monitor SNR weekly and adjust thresholds to maintain SNR > 0.5

**Math behind MQL burn rates:**
- For 99.9% SLO, the budget exhaustion times for different burn rates:
  - Burn rate 1.0: exhausts in 30 days (compliance window)
  - Burn rate 2.0: exhausts in 15 days
  - Burn rate 10.0: exhausts in 3 days
  - Burn rate 14.0: exhausts in ~2.1 days (51.4 hours)
  - Burn rate 20.0: exhausts in ~1.5 days (36 hours)
- A burn rate of 14 for 5 minutes consumes 14 * 5 / (30 * 24 * 60) = 0.016% of budget
- A burn rate of 2.5 for 30 minutes consumes 2.5 * 30 / (30 * 24 * 60) = 0.173% of budget
- Combined: threshold before both fire is when burn rate exceeds 2.5 for 30 minutes AND 14 for 5 minutes

**Implementation pseudocode:**
`
def check_mql(slo_target, metrics):
    long_window = timedelta(minutes=30)
    short_window = timedelta(minutes=5)

    long_burn = calculate_burn_rate(metrics, long_window, slo_target)
    short_burn = calculate_burn_rate(metrics, short_window, slo_target)

    long_alarm = long_burn >= 2.5
    short_alarm = short_burn >= 14.0

    if long_alarm and short_alarm:
        return "PAGE"
    elif long_alarm or short_alarm:
        return "WARNING"
    else:
        return "OK"
`

## P2.8 Toil Measurement & Reduction

Toil is the operational tax on reliability. Every hour of toil is an hour not spent on improving the service.

**Toil measurement framework:**
1. Classify all operational tasks into categories
2. Time-sample on-call activity for 2-week periods quarterly
3. Tag every ticket/incident with toil classification
4. Compute toil ratio: toil hours / total engineering hours
5. Track trend over time

**Toil classification matrix:**
| Task | Manual? | Repetitive? | Automatable? | Tactical? | Enduring Value? | Toil Score |
|------|---------|-------------|--------------|-----------|-----------------|------------|
| Restart crashed service | Yes | Yes | Yes | Yes | No | 5/5 |
| Respond to false alert | Yes | Yes | Yes | Yes | No | 5/5 |
| Add disk space | Yes | Yes | Yes | Yes | No | 5/5 |
| Deploy hotfix | Yes | Yes | Yes | Yes | Some | 4/5 |
| Debug latency issue | Yes | No | No | Some | Yes | 2/5 |
| Write automation script | Yes | No | No | No | Yes | 0/5 |
| Design chaos experiment | No | No | No | No | Yes | 0/5 |

**Toil reduction process:**
1. **Measure current toil** — 2-week time study, ticket classification
2. **Identify top toil sources** — Pareto analysis (80% of toil comes from 20% of tasks)
3. **Prioritize automation** — each toil source gets: frequency x duration x complexity score
4. **Estimate automation effort** — hours to automate vs hours saved per month
5. **Build automation** — follow automation hierarchy (eliminate > automate > simplify > document)
6. **Measure impact** — post-automation toil reduction, savings validation
7. **Celebrate** — share results, update toil dashboard

**Toil reduction targets:**
| Quarter | Toil Ratio Target | Operational Capacity Freed |
|---------|------------------|--------------------------|
| Q1 | < 40% | Baseline |
| Q2 | < 35% | +5% |
| Q3 | < 30% | +5% |
| Q4 | < 25% | +5% |
| Next year | < 20% | +5% |

**Automation ROI calculation:**
- Task frequency: 10 times/week
- Time per occurrence: 30 minutes
- Weekly toil: 5 hours
- Automation effort: 40 hours
- Payback period: 8 weeks (40 / 5)
- First-year savings: 5 hours/week * 48 weeks = 240 hours
- Automation cost: 40 hours
- Net savings: 200 hours in year one

## P2.9 Automation Strategy & Maturity Model

Automation in SRE follows a maturity model from manual to fully autonomous.

**Automation Maturity Levels:**
| Level | Name | Description | Triggers |
|-------|------|-------------|----------|
| 0 | Manual | All steps performed by human | Human decides when to act |
| 1 | Assisted | Human performs steps with documented runbook | Human decides, runbook guides |
| 2 | Partially automated | Some steps automated, human required for decisions | Human triggers automation |
| 3 | Conditional automation | Automation executes, human can override | Automation decides, human confirms |
| 4 | Fully automated | Automation executes independently | Automation decides and acts |
| 5 | Autonomous | System self-manages, automation handles all scenarios | Automation prevents issues |

**Automation target levels by domain:**
| Domain | Current Level | Target Level | Timeline |
|--------|--------------|--------------|----------|
| Deployment | L2 | L4 | 3 months |
| Incident detection | L1 | L3 | 2 months |
| Incident remediation | L0 | L2 | 6 months |
| Capacity scaling | L1 | L4 | 4 months |
| Health checking | L2 | L4 | 1 month |
| Backup/restore | L2 | L4 | 2 months |
| Certificate rotation | L0 | L4 | 1 month |
| Log rotation | L1 | L4 | 2 weeks |

**Automation hierarchy (priority order):**
1. **Eliminate** — Remove the need for the task entirely
   - Example: eliminate the need to rotate logs by using a log shipper
   - Example: eliminate the need to patch by using immutable infrastructure
2. **Prevent** — Prevent the condition that requires action
   - Example: auto-scale prevents capacity alerts
   - Example: circuit breakers prevent cascading failures
3. **Self-heal** — Automate the remediation
   - Example: auto-restart crashed processes
   - Example: auto-expand disk volumes
4. **Self-diagnose** — Automate the diagnosis
   - Example: automated log analysis
   - Example: automated canary analysis
5. **Self-alert** — Automate the notification
   - Example: fully instrumented alerts with runbook links
   - Example: pre-parsed alert data with context

**Automation design principles:**
1. Fail closed — if automation fails, default to safe state
2. Observable — automation actions are logged and monitored
3. Reversible — automation actions can be undone
4. Rate-limited — automation actions have rate limits and safety bounds
5. Tested — automation is tested in non-production before enabling
6. Measured — automation effectiveness is tracked with metrics
7. Graduated — automation is introduced in stages (observe → assist → automate)

## P2.10 SLO Tracking & Reporting

SLO tracking is the periodic evaluation of service performance against defined targets. Reporting ensures stakeholders understand reliability posture.

**SLO tracking cadence:**
| Frequency | Audience | Content |
|-----------|----------|---------|
| Real-time | On-call, SRE team | Burn rate alerts, dashboard |
| Daily | SRE team | Yesterday's SLO compliance, current burn rate |
| Weekly | Engineering team | SLO compliance by service, top incidents, toil metrics |
| Monthly | Product/Eng leadership | Error budget report, trend analysis, risk assessment |
| Quarterly | Executive | SLO attainment, SLA impact, SRE engagement progress |
| Annual | Company-wide | Reliability achievements, lessons learned, strategy |

**SLO report template (monthly):**
`
Service: [name]
SLO period: [date range]
SLO target: [value]
Compliance: [actual %]
Error budget consumed: [%]
Burn rate average: [value]
Burn rate peaks: [value, value, value]
Incidents affecting SLO: [count]
Top causes: [list]
Action items: [list with status]
Risk assessment: [Green/Yellow/Red]
Executive summary: [1-2 sentences]
`

**SLO dashboard requirements:**
- Current compliance vs target (gauge or sparkline)
- Time-series compliance trend (daily, weekly, monthly)
- Error budget remaining (percentage and absolute)
- Burn rate (current, 1h, 6h, 24h, 5d, 30d)
- Alert status (number of breaching alerts)
- Incident overlay (annotate SLO dips with incident markers)
- Service tree (parent-child SLO relationships)
- Multi-service composite SLO

**SLO tracking alerts:**
- SLO compliance < target (SLO violation alert) — page
- Error budget remaining < 50% — warning
- Error budget remaining < 25% — page
- Burn rate > 10 for 5 minutes — page
- Burn rate > 2.5 for 30 minutes — page
- No data for SLI for 5 minutes — warning
- SLI measurement gap (detection failure) — page

---

# P3: SRE Frameworks

## P3.1 USE Method (Utilization, Saturation, Errors)

The USE method is a performance analysis methodology for every resource in a system. It provides a systematic approach to identifying bottlenecks and saturation points.

**USE Method Definition:**
- **Utilization:** The average time that a resource was busy servicing work
  - Measurement: percentage of time resource is busy
  - Metric: CPU utilization, disk utilization, memory utilization
  - Threshold: warning at 70%, critical at 90%, saturation risk at 95%
- **Saturation:** The degree to which the resource has extra work queued (cannot service it)
  - Measurement: queue length, time spent waiting
  - Metric: CPU run queue length, disk I/O queue, network interface queue drops
  - Threshold: any sustained non-zero queue is concerning
- **Errors:** The count of error events
  - Measurement: count of errors per time interval
  - Metric: disk I/O errors, network errors, memory ECC errors
  - Threshold: any errors require investigation

**USE Method Application by Resource:**

**CPU:**
- Utilization: % CPU busy (user + system + iowait). Warn at 70%, alert at 90%.
- Saturation: run queue length / load average — sustained value > (vCPU count * 2) is saturation.
- Errors: machine check exceptions, CPU thermal throttling events. Any non-zero is critical.

**Memory:**
- Utilization: % of physical memory used minus cache/buffer. Warn at 80%, alert at 95%.
- Saturation: swap usage, OOM kills, page fault rate increase. Any swap is saturation (for most services).
- Errors: ECC memory errors, OOM killer events. Any non-zero is critical.

**Disk (Storage):**
- Utilization: % of time disk was busy (device utilization). Warn at 60%, alert at 80%, critical at 90%.
- Saturation: I/O wait time > 5ms (SSD) or > 50ms (HDD). Queue depth sustained > 1 per device.
- Errors: I/O errors, SMART errors, system log disk errors. Any non-zero is critical.

**Network:**
- Utilization: % of bandwidth consumed (interface bits/sec / capacity). Warn at 50%, alert at 70%.
- Saturation: interface drops, retransmits, backpressure. Any sustained drops indicate saturation.
- Errors: interface errors, CRC errors, collisions. Any non-zero is critical.

**System-level USE checklist:**
`
[ ] CPU utilization < 90% (p99 over 5 minutes)
[ ] CPU run queue < 2x vCPUs (p99 over 5 minutes)
[ ] Memory usage < 80% (excluding cache/buffer)
[ ] No swap in use
[ ] Disk utilization < 80% (p99 over 5 minutes)
[ ] Disk I/O wait < 5ms SSD / 50ms HDD (p99 over 5 minutes)
[ ] Disk queue depth < 2 (p99)
[ ] Network bandwidth < 70% of capacity
[ ] No network interface errors or drops
[ ] No OOM killer events in last 7 days
[ ] No disk I/O errors in last 30 days
[ ] No kernel panic or crash dumps
`

**USE-derived dashboards:**
- Per-host: CPU utilization, memory utilization, disk utilization, network utilization
- Per-service: request rate, error rate, latency, resource consumption per request
- Cluster-level: average/max/p99 of per-resource utilization across nodes
- Trending: resource utilization week-over-week, month-over-month

## P3.2 RED Method (Rate, Errors, Duration)

The RED method focuses on service-level (not resource-level) metrics. It answers: "Is my service working?"

**RED Method Definition:**
- **Rate:** The number of requests per second (throughput)
  - Measurement: requests/second
  - Monitoring: total rate, per-status-code rate
  - Anomaly: significant drop (possible outage) or spike (possible attack)
- **Errors:** The number of requests that fail
  - Measurement: failed requests / total requests (error ratio)
  - Monitoring: HTTP 5xx ratio, application error codes, timeout errors
  - Anomaly: error rate > baseline by 2x or > 1% absolute
- **Duration:** The time taken to process requests (latency)
  - Measurement: distribution of response times (p50, p95, p99, p99.9)
  - Monitoring: p95 and p99 latency
  - Anomaly: latency > SLO threshold for more than 5 minutes

**RED Method Application:**

**RED for HTTP Services:**
| Metric | Measurement | Warning | Critical |
|--------|-------------|---------|----------|
| Rate | Requests/sec | 50% drop or 300% spike | 80% drop or 500% spike |
| Errors | 5xx ratio | > 1% for 5 min | > 5% for 2 min |
| Duration | p95 latency | > 80% of SLO for 10 min | > SLO for 5 min |
| Duration | p99 latency | > 50% of SLO for 10 min | > SLO for 2 min |

**RED for Message Queues:**
| Metric | Measurement | Warning | Critical |
|--------|-------------|---------|----------|
| Rate | Messages/sec (produced, consumed) | 50% drop | 90% drop |
| Errors | Failed messages, dead letter count | > 0.1% | > 1% |
| Duration | Consumer processing time | > 80% of target | > target |
| Queue depth | Pending messages | > 1000 for 10 min | > 10000 for 5 min |

**RED for Databases:**
| Metric | Measurement | Warning | Critical |
|--------|-------------|---------|----------|
| Rate | Queries/sec | 50% drop or 200% spike | 80% drop or 400% spike |
| Errors | Query errors, connection errors | > 0.1% | > 1% |
| Duration | Query latency (p95) | > 100ms | > 500ms |
| Duration | Connection pool wait time | > 10ms | > 100ms |

**RED for Caches:**
| Metric | Measurement | Warning | Critical |
|--------|-------------|---------|----------|
| Rate | Requests/sec | 50% drop or 300% spike | 80% drop |
| Errors | Cache miss routing errors | > 0 | > 10/min |
| Duration | Lookup latency | > 10ms | > 50ms |
| Rate | Hit ratio | < 80% | < 60% |

## P3.3 Golden Signals

The four golden signals are the foundational metrics for monitoring distributed systems, originally defined by Google SRE. They are: latency, traffic, errors, and saturation.

**Signal 1: Latency**
- The time it takes to service a request
- Distinguish between: successful request latency vs failed request latency
- Failed requests can be fast (fail-fast) — this masks real problems
- Measure: p50, p95, p99, p99.9 across all requests (including failed)
- Measure: only success latency (separate from failure latency)
- Alert on: p99 exceeding SLO threshold for 5% of the compliance window

**Signal 2: Traffic**
- The volume of demand on the system
- HTTP services: requests per second
- Databases: queries per second, write operations per second
- Message queues: message production/consumption rate
- Storage: I/O operations per second, throughput in MB/s
- Alert on: traffic exceeding 80% of provisioned capacity

**Signal 3: Errors**
- The rate of requests that fail
- Explicit: HTTP 5xx errors
- Implicit: HTTP 2xx but wrong content (e.g., no results when there should be)
- Policy: HTTP 429 (rate limiting) = error if rate limits are exceeded
- System-level: kernel errors, file descriptor exhaustion, connection pool exhaustion
- Alert on: error rate > 1% (or SLO-specified threshold) for 5 minutes

**Signal 4: Saturation**
- The degree to which the service is full
- CPU saturation: run queue depth
- Memory saturation: swap usage, OOM events
- I/O saturation: I/O queue depth, I/O wait time
- Network saturation: interface drops, bandwidth utilization
- Thread pool saturation: pool utilization, queue depth for rejected tasks
- Connection pool saturation: pool utilization, wait time
- Alert on: saturation reaching 80% of capacity (90% for critical systems)

## P3.4 Four Golden Signals Deep Dive

This section provides deeper implementation guidance for the four golden signals in production systems.

**Implementation details for each golden signal:**

**Latency implementation:**
- Instrument at the entry point (load balancer, API gateway) and each service boundary
- Use histogram metrics (Prometheus: request_duration_seconds_bucket)
- Bucket boundaries: 1ms, 5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 1000ms, 2500ms, 5000ms, 10000ms, 30000ms
- Export: p50, p95, p99, p99.9 server-side
- Export: p50, p95, p99, p99.9 client-side (RUM)
- Alert condition: p99 > SLO threshold for > 5 minutes
- Alert condition: p95 > (SLO threshold * 0.8) for > 15 minutes

**Traffic implementation:**
- Count all incoming requests at load balancer level
- Count requests per-service, per-endpoint, per-method
- Count requests per-customer, per-tenant if applicable
- Track request rate (rolling 1-minute average, 5-minute average)
- Track request volume (total per hour, per day)
- Alert condition: traffic < 50% of expected baseline (possible outage)
- Alert condition: traffic > 200% of expected baseline (possible incident or attack)

**Errors implementation:**
- HTTP 5xx: server errors (internal, bad gateway, service unavailable, gateway timeout)
- HTTP 4xx: client errors (only track 429, 401, 403 specifically)
- Application errors: errors returned in response body with 200 status
- Panics/crashes: process crash events, panic logs
- Error ratio: errors / total requests per time window (1 min, 5 min)
- Alert condition: error ratio > 0.01 (1%) for 5 minutes
- Alert condition: error ratio > 0.001 (0.1%) for 30 minutes

**Saturation implementation:**
- For each resource, define capacity and current utilization
- CPU: (user + system + iowait) / total, measure run queue
- Memory: used / total (excluding cache), track OOM events
- Disk I/O: iowait time, I/O queue depth, device utilization
- Network: bytes in/out / interface capacity, drop counts
- Thread pool: active threads / max threads, task queue depth
- Connection pool: active connections / max connections, wait queue
- GC: GC pause time, GC frequency, heap pressure
- Alert condition: saturation > 80% for sustained 10 minutes
- Alert condition: saturation > 95% for sustained 2 minutes

## P3.5 Google CRE Lifecycle

The Customer Reliability Engineering (CRE) lifecycle is a framework for engaging with customers on reliability. Adapted for internal service engagement:

**CRE Lifecycle phases:**

**Phase 1 — Assess:**
- Evaluate current service reliability posture
- Inventory existing SLOs, monitoring, alerting, and incident management
- Identify gaps against production readiness criteria
- Score service maturity (see P6 Service Maturity Model)
- Produce: assessment report, gap analysis, recommendations

**Phase 2 — Plan:**
- Define target reliability posture with stakeholder input
- Set SLO targets and error budget policy
- Design monitoring and alerting improvements
- Plan toil reduction initiatives
- Create implementation roadmap with milestones
- Produce: SRE engagement plan, roadmap, SLO charter

**Phase 3 — Implement:**
- Instrument SLIs, configure SLO tracking
- Set up burn rate alerting
- Establish incident management processes
- Build automation for top toil sources
- Implement chaos engineering experiments
- Produce: SLO dashboards, alert rules, automation code

**Phase 4 — Review:**
- Monthly SLO compliance review
- Error budget consumption trending
- Incident postmortem analysis
- Toil reduction progress measurement
- Automation ROI calculation
- Produce: monthly SRE report, quarterly business review

**Phase 5 — Iterate:**
- Adjust SLO targets based on business needs
- Tune alert thresholds based on SNR analysis
- Expand automation scope
- Deepen chaos engineering coverage
- Scale SRE practices to adjacent services
- Produce: revised SLOs, updated alert rules, expanded automation

**Engagement types:**
| Engagement | Duration | Intensity | Suitable For |
|-----------|----------|-----------|--------------|
| Consulting | 1-3 months | Part-time, weekly check-ins | Services needing targeted guidance |
| Embedded | 6-12 months | Full-time SRE in service team | Critical services needing transformation |
| Shared | Ongoing | Rotation-based SRE support | Multiple teams sharing SRE resources |
| Review-only | 1-2 weeks | Intensive PRR, non-continuous | Services needing one-time assessment |

## P3.6 SRE Engagement Model

The SRE engagement model defines how SRE teams interact with product/development teams. The choice of model dramatically impacts effectiveness.

**Model A: Centralized SRE (Shared Services)**
- SRE team is a separate organizational unit
- SREs support multiple product teams
- + Consistent standards across all services
- + Specialized reliability expertise
- - Can become bottleneck for reliability decisions
- - SREs may lack deep service knowledge
- - Product teams may not develop reliability skills
- Best for: early-stage SRE adoption, smaller organizations (< 5 SREs)

**Model B: Embedded SRE**
- SREs are assigned to specific product teams (or part of them)
- SRE participates in product team rituals
- + Deep service knowledge
- + Strong relationships with developers
- + Reliability built into development process
- - Inconsistent standards across teams
- - SREs can be absorbed into product work (not SRE work)
- - Scaling requires hiring + training more SREs
- Best for: mature SRE organizations, critical services

**Model C: Mixed (Consulting + Embedded)**
- Some SREs embedded, some centralized
- Centralized SRE provides standards, tooling, training
- Embedded SRE drives implementation in teams
- + Best of both models
- + Scalable with training program
- - Complex organizational design
- - Requires strong communication between central and embedded teams
- Best for: large organizations with multiple teams

**Model D: SRE Consulting (Pure)**
- SRE team provides consulting engagements to product teams
- Product team remains responsible for operations
- + Maximum leverage per SRE
- + Product teams develop reliability skills
- - Can be superficial if engagement is too short
- - Product teams need time to implement recommendations
- Best for: scaled organizations with mature product teams

**SRE-to-Dev ratio:**
| Organization Type | SRE:Dev Ratio | Notes |
|------------------|---------------|-------|
| Early SRE adoption | 1:20 → 1:10 | SRE provides foundations |
| Growing SRE practice | 1:10 → 1:6 | SRE embedded in critical teams |
| Mature SRE practice | 1:6 → 1:4 | SRE embedded in most teams |
| Full SRE culture | 1:4 → 1:3 | Everything runs on SRE principles |

**Staffing considerations:**
- Minimum SRE team size for 24/7 on-call: 5 (to cover weekdays + weekends with backup)
- Ideal SRE team size: 6-10 (covers on-call, project work, incident response)
- Each SRE should spend no more than 1 week of on-call per month (25% cap)
- On-call rotation: 1 week primary, 1 week secondary, 2 weeks off for 6-8 person teams
- New SREs need 3-6 months ramp-up before solo on-call

## P3.7 Service Maturity Model

The service maturity model assesses how well a service applies SRE principles. It provides a framework for tracking improvement over time.

**Service Maturity Levels:**

| Level | Name | Characteristics | SLO | Monitoring | Incident Response | Automation |
|-------|------|----------------|-----|------------|-------------------|------------|
| 0 | Ad Hoc | Reactive, no standards | None | None | Hero-based | None |
| 1 | Foundational | Basic monitoring, informal processes | SLOs defined but not tracked | Basic health checks | Escalation list exists | Some scripts |
| 2 | Defined | SLOs tracked, alerting configured, on-call formalized | SLOs tracked monthly | Per-service dashboards | Severity classification | Some automation |
| 3 | Measured | Error budgets active, alert fatigue managed, capacity planning | SLOs tracked weekly, error budgets | Full golden signals | Formal incident management | Automated operations |
| 4 | Optimized | Chaos engineering, self-healing, continuous improvement | Multi-window burn rate alerts | Anomaly detection | Postmortem culture drives action | Self-healing automation |
| 5 | Autonomous | Self-managing reliability, predictive operations | Auto-adjusting SLOs | ML-driven | Prevention-focused | Fully autonomous |

**Maturity assessment criteria (1-5 scale for each):**

1. **SLI definition:** (1) none → (3) latency + error rate defined → (5) comprehensive SLIs with business alignment
2. **SLO targeting:** (1) none → (3) single SLO per service → (5) multi-tier SLOs with stakeholder agreement
3. **Error budget usage:** (1) none → (3) budgets tracked → (5) budgets used for release gating
4. **Monitoring coverage:** (1) none → (3) golden signals → (5) comprehensive + anomaly detection
5. **Alerting quality:** (1) no alerts → (3) actionable alerts with runbooks → (5) multi-window burn rate
6. **Incident management:** (1) no process → (3) severity taxonomy + escalation → (5) IC framework + postmortems
7. **Capacity planning:** (1) none → (3) reactive → (5) proactive forecasting
8. **Automation:** (1) none → (3) > 50% of tasks automated → (5) self-healing
9. **Toil ratio:** (1) > 50% toil → (3) 25-50% → (5) < 20% toil
10. **Culture:** (1) blame culture → (3) blameless → (5) learning organization

**Maturity scorecard:**
| Level | Total Score (out of 50) | Classification |
|-------|------------------------|----------------|
| 0 | 10-15 | Ad Hoc — needs immediate SRE engagement |
| 1 | 16-25 | Foundational — basic hygiene in place |
| 2 | 26-35 | Defined — formal processes, measurable |
| 3 | 36-40 | Measured — quantitative management |
| 4 | 41-45 | Optimized — continuous improvement |
| 5 | 46-50 | Autonomous — reliability managed by system |

**Improvement roadmap for each level:**
- 0 → 1: Implement basic monitoring, define on-call rotation, create incident response document
- 1 → 2: Define SLOs, build dashboards, formalize alerting, create postmortem process
- 2 → 3: Implement error budgets, establish capacity planning, reduce toil to < 50%
- 3 → 4: Multi-window burn rate alerts, chaos engineering program, auto-remediation for top toil
- 4 → 5: Predictive capacity, auto-adjusting SLOs, self-healing infrastructure

## P3.8 Incident Severity Taxonomy

A standardized severity taxonomy ensures consistent incident classification and response.

**Severity levels:**

**SEV0 — Critical (Complete outage or data loss):**
- Definition: Complete service unavailability for all users, or confirmed data loss/corruption
- Impact: All users cannot use the service; revenue critically impacted; data integrity compromised
- Response: Immediate page to primary and secondary on-call; incident commander activated; executive notification within 15 minutes
- Target resolution: < 1 hour (mitigation), < 4 hours (full resolution)
- Postmortem: Required within 48 hours
- Examples: Checkout API completely down, database corruption, major security breach

**SEV1 — Major (Significant degradation):**
- Definition: Service partially unavailable, or severely degraded performance for a significant subset of users
- Impact: > 20% of users affected; significant feature degradation; data access issues for many users
- Response: Page to primary on-call; incident commander activated if needed; team lead notification within 30 minutes
- Target resolution: < 4 hours (mitigation), < 24 hours (full resolution)
- Postmortem: Required within 72 hours
- Examples: Search results unavailable, payment processing delayed > 30 minutes, login failures for > 20% of users

**SEV2 — Moderate (Degradation for subset):**
- Definition: Service degraded for some users, or a minor feature is unavailable
- Impact: 5-20% of users affected; non-critical feature unavailable; performance degradation but service usable
- Response: Page to primary on-call during business hours; ticket created; team notified within 1 hour
- Target resolution: < 8 hours (business hours), < 24 hours (calendar)
- Postmortem: Required if > 1% of users affected or duration > 4 hours
- Examples: Admin dashboard slow, report generation delayed, image upload failing for 10% of users

**SEV3 — Minor (Limited impact):**
- Definition: Minor issue affecting few users or non-critical functionality
- Impact: < 5% of users affected; cosmetic issues; non-functional features that do not block core workflow
- Response: Ticket created; investigated during normal business hours
- Target resolution: < 1 week
- Postmortem: Optional, bug tracking entry sufficient

**SEV4 — Low (Question or non-urgent):**
- Definition: Question, documentation issue, or minor feature request
- Impact: No user-facing impact; internal process issue
- Response: Ticket created; tacked in normal backlog
- Target resolution: < 1 month
- Postmortem: Not required

**Severity classification matrix:**
| Criteria | SEV0 | SEV1 | SEV2 | SEV3 |
|----------|------|------|------|------|
| User impact (%) | 100% | > 20% | 5-20% | < 5% |
| Revenue impact | > /hr | -/hr | -/hr | < /hr |
| Data integrity | Data loss | Data corruption risk | Read-only degraded | No data issues |
| Regulatory | Regulatory breach likely | Reporting required | Self-reporting | No impact |
| Duration sustained | > 5 min | > 15 min | > 1 hour | N/A |

**Severity escalation:**
- SEV3 → SEV2: user impact exceeds 5% or issue lasts > 4 hours
- SEV2 → SEV1: user impact exceeds 20% or revenue impact > /hr
- SEV1 → SEV0: complete outage or confirmed data loss
- Severity can be downgraded if mitigation resolves critical impact

## P3.9 Postmortem Process

The postmortem process ensures every significant incident results in learning and improvement.

**When to write a postmortem:**
- All SEV0 and SEV1 incidents
- SEV2 incidents with > 1% user impact or > 4 hours duration
- Any incident that required rollback or data recovery
- Any incident with revenue impact > 
- Any incident that revealed a systemic issue
- Any incident requested by engineering leadership

**Postmortem timeline:**
| Milestone | Deadline | Owner |
|-----------|----------|-------|
| Incident resolved | T+0 | Incident Commander |
| Draft postmortem started | T+24h | Postmortem author |
| Draft complete | T+48h | Postmortem author |
| Peer review | T+72h | SRE team lead |
| All action items assigned | T+96h | Engineering manager |
| Postmortem published | T+120h | SRE team lead |
| Action items tracked | Weekly | Postmortem owner |

**Postmortem structure:**

`
# Postmortem: [Incident Title]

## Metadata
- Incident ID: INC-YYYY-MM-DD-NNN
- Date: YYYY-MM-DD
- Duration: HH:MM (start UTC) → HH:MM (end UTC)
- Severity: SEV[0-3] (initial → final)
- Services affected: [service1, service2, ...]
- Detection method: [alert, customer report, monitoring]
- Reported by: [name]
- Author: [name]

## Summary
[2-3 sentences describing what happened and the impact]

## Impact
- Users affected: [count or percentage]
- Revenue impact: [$ amount]
- Data loss: [yes/no — if yes, extent]
- Downstream services affected: [list]
- Customer-facing impact description

## Timeline (All times in UTC)
[Chronological log of events]
- T-7d: Change X deployed
- T-1h: Latency began to increase (alert not configured)
- T-0: Trigger current incident
- T+5m: Alert fired, on-call engaged
- T+12m: Severity declared (SEV1)
- T+15m: Incident Commander assigned
- T+35m: Root cause identified (nil pointer on line 342)
- T+42m: Rollback initiated
- T+52m: Rollback completed, service restored
- T+60m: Verified all SLOs back to compliance
- T+75m: Incident declared resolved

## Root Cause
[Description of the underlying cause using 5 Whys]
1. Why did the service fail? → nil pointer dereference in handleRequest()
2. Why was nil pointer introduced? → change in response parsing function
3. Was this change tested? → unit tests existed but did not cover null response
4. Why was test coverage insufficient? → no integration test with upstream service
5. Why was there no integration test? → integration testing framework missing for this service

## Contributory Factors
- Monitoring gap: latency increase was not alertable before incident
- Testing gap: no integration test for upstream null response
- Deployment gap: no canary analysis to detect performance degradation

## What Went Well
- Responder switched on and engaged within 5 minutes
- Rollback worked as designed (completed in 10 minutes)
- Communication was clear and regular on incident channel

## What Went Wrong
- Alert for latency did not exist prior to incident
- On-call had to manually identify the failing upstream service
- Incident channel was not created until 10 minutes in

## Lessons Learned
- Latency SLO violations should be alerted earlier
- Integration tests need coverage for upstream null responses
- Rollback test should be part of release checklist

## Action Items
| # | Action | Owner | Due Date | Verification |
|---|--------|-------|----------|--------------|
| 1 | Add integration test for null upstream response | [name] | YYYY-MM-DD | CI passes with new test |
| 2 | Implement latency SLO alert (p99 > 500ms for 5min) | [name] | YYYY-MM-DD | Alert configured and tested |
| 3 | Add canary analysis step to deployment pipeline | [name] | YYYY-MM-DD | Deployment pipeline includes canary |
| 4 | Create incident channel auto-creation in IR process | [name] | YYYY-MM-DD | Channel created automatically |
| 5 | Train team on latency signal monitoring | [name] | YYYY-MM-DD | Training completed, quiz results |

## Supporting Evidence
- Link to dashboard snapshots
- Link to log excerpts
- Link to deployment record
- Link to alert history
- Link to metrics charts
`

**Postmortem quality criteria:**
- Action items have specific, measurable owners and due dates
- At least one action item per contributory factor
- No action items saying be more careful or improve communication
- Timeline includes system-centric events, not people-centric
- Root cause reaches systemic level (not blaming individual)
- Postmortem is published and visible to all engineering
- Action items are tracked in issue tracker with weekly review

**Postmortem action item closure:**
- Action items are created as individual tickets in tracking system
- Weekly review of all action items from last 90 days
- Action items past due: escalate to engineering manager
- Action items > 30 days overdue: escalate to director
- Action items > 90 days overdue: require executive justification
- Target: > 80% of action items closed within 30 days of due date

## P3.10 Chaos Engineering Maturity

Chaos engineering is the discipline of experimenting on a system to build confidence in its capability to withstand turbulent conditions in production.

**Chaos Engineering Principles:**

1. **Build a hypothesis around steady-state behavior**
   - Define what normal looks like using metrics (SLO compliance, latency, error rate)
   - The hypothesis: When we inject [failure], the system will [expected behavior]

2. **Vary real-world events**
   - Inject failures that occur in production: network latency, packet loss, instance failure, resource exhaustion
   - Use production traffic patterns as the baseline

3. **Run experiments in production**
   - Production is where real traffic, real data, and real complexity exist
   - Start with small blast radius; expand as confidence grows
   - Use feature flags, traffic shadowing, or isolation to contain blast radius

4. **Automate experiments to run continuously**
   - Manual experiments are toil; automate with tools like Chaos Mesh, Gremlin, or Litmus
   - Run experiments in CI/CD pipeline for every release candidate
   - Scheduled experiments run continuously (e.g., kill one instance per hour during business hours)

5. **Minimize blast radius**
   - Start with: 1 instance → 1 pod → 1 availability zone → 1 region
   - Never impact all users simultaneously
   - Have automatic rollback for experiment that degrades SLO beyond margin
   - Experiments must have abort conditions: halt experiment if error budget consumption exceeds X%

**Chaos Engineering Maturity Model:**

| Level | Name | Characteristics | Experiments | Blast Radius | Frequency |
|-------|------|----------------|-------------|--------------|-----------|
| 0 | None | No chaos engineering | 0 | N/A | Never |
| 1 | Manual | Ad-hoc experiments | Manual, pre-announced | One instance | Monthly |
| 2 | Scheduled | Regular automated experiments | Some automated, planned | One AZ | Weekly |
| 3 | Continuous | Automated experiment pipeline | Fully automated, in CI/CD | One AZ | Per release + scheduled |
| 4 | Advanced | Experiment-driven optimization | Automated + composable failures | Cross-AZ, limited region | Continuous |
| 5 | Autonomous | Self-healing driven by experiments | Self-tuning resilience | Multi-region scenarios | Continuous + on-demand |

**Chaos experiment template:**

`
## Experiment: [Name]

### Hypothesis
[The system will maintain SLO compliance when [failure] occurs]

### Steady State
- p99 latency < 500ms
- Error rate < 0.1%
- Throughput > 1000 req/s

### Experiment Design
- Type: [network latency | instance kill | resource exhaustion | ...]
- Target: [service, instance, AZ]
- Blast radius: [1 pod, 10% of instances, 1 AZ]
- Duration: [5 minutes]
- Parameters: [delay=200ms, packet loss=0.1%]

### Expected Outcome
- SLO metrics stay within steady state
- Service degrades gracefully (requests routed to healthy instances)

### Abort Conditions
- Error rate > 5%
- p99 latency > 2s
- Any customer-reported issue
- Error budget consumption > 1% in 5 minutes

### Rollback Plan
- Stop experiment immediately
- Verify service health returns to normal within 2 minutes

### Results
- Steady state maintained? [Yes/No/Partial]
- Observations: [description]
- Action items: [improvements needed]
`

**Chaos experiment types:**

| Experiment | Description | Target | Frequency |
|------------|-------------|--------|-----------|
| Instance kill | Terminate random instance | Containers, VMs | Continuous (hourly) |
| Network latency | Add latency to network traffic | Service-to-service | Per release |
| Packet loss | Drop network packets | Inter-service communication | Per release |
| DNS failure | Block DNS resolution | DNS-dependent services | Monthly |
| Certificate expiration | Simulate expired TLS cert | TLS-terminated services | Monthly |
| Resource exhaustion | Fill disk / memory / CPU | All instances | Quarterly |
| Regional failure | Block traffic to region | Multi-region services | Quarterly |
| Upstream dependency failure | Make upstream return 5xx | Integration points | Per release |
| Database failover | Trigger DB primary failover | Stateful services | Quarterly |

**Chaos engineering metrics:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Experiments executed/week | > 10 | Automation report |
| Blast radius (% of instances) | < 10% | Experiment config |
| SLO violations from experiments | < 1/month | SLO dashboard |
| System improvements from experiments | > 2/quarter | Action item tracking |
| MTTR improvement (experiment-informed) | > 20% | Incident tracking |

## P3.11 Disaster Recovery Maturity

Disaster recovery (DR) ensures service continuity when catastrophic events occur: region failure, data center loss, or large-scale infrastructure failure.

**DR terminology:**
- **RTO (Recovery Time Objective):** Maximum acceptable time to restore service after disaster
- **RPO (Recovery Point Objective):** Maximum acceptable data loss (measured in time)
- **Recovery SLA:** Time to restore service per disaster type
- **Failover:** Switching traffic from primary to secondary site
- **Failback:** Returning traffic to primary site after recovery

**DR strategy tiers:**

| Tier | Name | RTO | RPO | Description | Cost Multiplier |
|------|------|-----|-----|-------------|-----------------|
| 0 | No DR | Unlimited | Unlimited | No disaster recovery | 1x |
| 1 | Backup & Restore | Hours to days | Hours to days | Data backed up, restored manually | 1.2x |
| 2 | Pilot Light | Minutes to hours | Minutes | Minimal secondary infrastructure, scale on failover | 1.5x |
| 3 | Warm Standby | Minutes | Minutes | Scaled-down secondary, sync replicas | 2x |
| 4 | Multi-site Active-Active | Sub-minute | Near-zero | Both sites active, synchronous replication | 3-5x |
| 5 | Multi-region Autonomous | Automatic | Near-zero | Self-healing global deployment | 5-10x |

**RTO/RPO by service tier:**

| Service Tier | Target RTO | Target RPO | Strategy | Testing Frequency |
|-------------|------------|------------|----------|-------------------|
| Tier 0 (Critical) | < 15 minutes | < 1 minute | Active-Active | Monthly |
| Tier 1 (Customer-facing) | < 1 hour | < 5 minutes | Warm Standby | Quarterly |
| Tier 2 (Internal tools) | < 4 hours | < 1 hour | Pilot Light | Semi-annually |
| Tier 3 (Experimental) | < 24 hours | < 24 hours | Backup & Restore | Annually |

**DR testing checklist:**
`
[ ] DR plan documented and stored outside primary region
[ ] RTO and RPO targets defined and approved
[ ] Failover procedure documented with runbook
[ ] Failback procedure documented with runbook
[ ] Contact list for DR activation distributed to all stakeholders
[ ] Secondary region provisioned and verified
[ ] Data replication verified (synchronous or asynchronous)
[ ] DNS failover configured and tested
[ ] Load balancer configuration for DR region
[ ] Monitoring and alerting functioning in DR region
[ ] Capacity allocated for DR region (may be scaled down)
[ ] Security controls verified in DR region
[ ] Compliance requirements met in DR region
[ ] DR test scheduled and announced with stakeholders
[ ] DR test results documented with action items
[ ] All action items from previous DR test are closed
`

**DR test types:**

| Test Type | Description | Complexity | Frequency |
|-----------|-------------|------------|-----------|
| Document review | Read through DR plan with team | Low | Quarterly |
| Tabletop exercise | Walk through scenario verbally | Low | Quarterly |
| Component test | Test individual DR component | Medium | Monthly |
| Partial failover | Failover non-critical subsystem | Medium | Semi-annually |
| Full failover | Complete failover of service | High | Annually |
| Chaos DR | Failover without advance notice | High | Annually |

**DR test success criteria:**
- RTO achieved: yes/no, actual RTO measured
- RPO achieved: yes/no, actual data loss measured
- Data integrity verified: yes/no
- DNS propagation completed: time measured
- All monitoring functional in DR region: yes/no
- All downstream services reconnected: yes/no
- All security controls verified: yes/no
- Failback completed successfully: yes/no
- Action items from test created in tracking system: yes/no

---

# P4: Reliability Patterns

## P4.1 Circuit Breaker Pattern

The circuit breaker prevents cascading failures by stopping calls to a failing dependency. It is one of the most important reliability patterns for distributed systems.

**Circuit Breaker States:**

| State | Behavior | Transition |
|-------|----------|------------|
| CLOSED | Requests pass through normally | Opens when failure threshold exceeded |
| OPEN | Requests fail immediately (fast-fail) | Half-opens after timeout period |
| HALF_OPEN | Limited requests allowed to test recovery | Closes on success, Opens on failure |

**Circuit Breaker Configuration:**

`
# Standard configuration
failure_threshold: 5         # Number of failures to transition to OPEN
success_threshold: 2         # Number of successes to transition back to CLOSED
timeout: 30s                 # Time to wait before HALF_OPEN (sleep window)
half_open_max_requests: 3    # Max requests in HALF_OPEN state
exceptions: [                # Which failures count toward threshold
    TimeoutException,
    ConnectionException,
    ServiceUnavailableException,
    InternalServerErrorException
]
cooldown: 60s               # Minimum time between state transitions
recording:                   # Metric tracking
    - failure_count
    - success_count
    - state_changes
    - request_count
    - rejection_count
`

**Circuit Breaker Configuration by Dependency Type:**

| Dependency Type | failure_threshold | timeout | half_open_max_requests | Rationale |
|----------------|-------------------|---------|----------------------|-----------|
| Cache (Redis) | 3 | 15s | 5 | Fast failure detection, quick recovery |
| Database (RDS) | 5 | 30s | 3 | Transient failures common, be patient |
| External API (3rd party) | 10 | 60s | 2 | External APIs have variable reliability |
| Internal service (RPC) | 5 | 10s | 5 | Need fast fail-fast for cascade prevention |
| Message queue | 3 | 20s | 2 | Critical path, fail fast |
| Batch processing | 20 | 120s | 1 | Batch jobs are more resilient, retry more |

**Circuit Breaker Implementation Guidelines:**

1. **Track failures per dependency** — not per call. Count unique failures to the dependency endpoint.
2. **Include timeout in failure count** — timeouts are failures for circuit breaker purposes.
3. **Exclude client-cancelled requests** — do not count client cancellations as failures.
4. **Use sliding window for failure counting** — count failures in last N seconds, not total.
5. **Log all circuit breaker state transitions** — critical for debugging.
6. **Metrics: expose for each circuit** — state, failure_rate, request_count, rejection_count.
7. **Alert on circuit OPEN state** — if circuit stays open > 5 minutes, page.
8. **Alert on circuit state flapping** — if transitions > 5 in 10 minutes, page.
9. **Circuit should be per-instance** — each service instance has its own breaker state (or use distributed circuit breaker with shared state).
10. **Default timeout is 30 seconds** — adjust per dependency based on historical recovery time.

**Circuit breaker usage patterns:**
- Always use with fallback: return cached data, default value, or empty response
- Combine with timeout pattern (timeout < circuit breaker timeout)
- Use with bulkhead pattern to isolate thread pools per dependency
- Monitoring: circuit breakers in OPEN state should be visible on dashboard
- Testing: verify circuit breaker behavior in integration tests

## P4.2 Bulkhead Pattern

The bulkhead pattern isolates failures by partitioning resources. Named after ship bulkheads that prevent flooding from spreading across compartments.

**Bulkhead Types:**

1. **Thread Pool Bulkhead:** Each dependency gets its own thread pool
   - Thread pool A (Cache): 10 threads, queue: 100
   - Thread pool B (Database): 20 threads, queue: 200
   - Thread pool C (External API): 5 threads, queue: 50
   - Default thread pool (all others): 10 threads, queue: 100
   - Effect: Database slowdown does not consume threads needed for cache requests

2. **Semaphore Bulkhead:** Limits concurrent calls per dependency (no queue)
   - Semaphore A (Cache): 10 concurrent calls
   - Semaphore B (Database): 20 concurrent calls
   - Effect: Simpler, no queuing — immediate rejection when limit reached

**Bulkhead Configuration:**

`
# Thread Pool Bulkhead
bulkhead:
  type: THREAD_POOL
  pools:
    - name: cache
      max_thread_pool_size: 10
      max_queue_size: 100
      keep_alive: 60s
    - name: database
      max_thread_pool_size: 20
      max_queue_size: 200
      keep_alive: 30s
    - name: external_api
      max_thread_pool_size: 5
      max_queue_size: 50
      keep_alive: 60s
    - name: default
      max_thread_pool_size: 10
      max_queue_size: 100
      keep_alive: 60s

# Semaphore Bulkhead
bulkhead:
  type: SEMAPHORE
  semaphores:
    - name: cache
      max_concurrent: 10
    - name: database
      max_concurrent: 20
    - name: external_api
      max_concurrent: 5
    - name: default
      max_concurrent: 10
`

**Bulkhead Sizing Formula:**

`
thread_pool_size = (max_expected_requests_per_second * p99_latency_seconds) + buffer

# Example: 100 req/s, p99 latency 200ms (0.2s)
# thread_pool_size = (100 * 0.2) + 5 = 25

queue_size = thread_pool_size * 10

# Semaphore: max_concurrent = max_expected_requests_per_second * p99_latency_seconds
# semaphore = 100 * 0.2 = 20
`

**Bulkhead monitoring:**
- Thread pool active count, queue depth, rejected count
- Active threads / max threads (utilization)
- Queue depth / queue capacity (saturation)
- Rejection rate (errors)
- Alert on: queue depth > 80% capacity for 5 minutes
- Alert on: rejection rate > 0 for 1 minute
- Alert on: active threads > 90% max for 10 minutes

**Bulkhead + Circuit Breaker Integration:**

| State | Bulkhead Behavior | Circuit Breaker Behavior |
|-------|-------------------|-------------------------|
| Normal | Requests use thread pool | Closed |
| Transient issue | Queue builds but requests accepted | Closed |
| Persistent issue | Queue full, requests rejected | Open (requests blocked) |
| Recovery | Queue drains, requests accepted slowly | Half-Open → Closed |

**Best practices:**
- Size bulkheads empirically: measure actual concurrency, do not guess
- Monitor and adjust: review bulkhead sizing quarterly
- Test bulkhead behavior: load test with dependency failure
- Document bulkhead limits: share with dependent teams
- Use per-endpoint bulkheads for critical endpoints
- Never use shared thread pool for all dependencies (defeats purpose)

## P4.3 Retry with Backoff

Retry with backoff handles transient failures without overwhelming the system. The key is to retry with increasing delays and random jitter.

**Retry Strategies:**

1. **Fixed Backoff:** Retry at fixed intervals
   - Delay: 100ms, retry: 3 times
   - Problem: thundering herd (all clients retry at same time)

2. **Incremental Backoff:** Increasing intervals
   - Delays: 100ms, 200ms, 400ms
   - Better than fixed but still synchronized

3. **Exponential Backoff:** Multiply delay by factor each attempt
   - Delays: 100ms, 200ms, 400ms, 800ms, 1600ms
   - Base: 100ms, factor: 2, max: 10s

4. **Exponential Backoff with Jitter:** Add randomness to avoid synchronization
   - Full jitter: random(0, min(cap, base * 2^attempt))
   - Equal jitter: (cap/2) + random(0, cap/2) where cap = min(cap, base * 2^attempt)
   - Decorrelated jitter: min(cap, random(base, previous_delay * 3))

**Recommended Retry Configuration:**

`
retry:
  max_attempts: 3            # Including initial attempt
  base_delay: 100ms          # Initial delay before first retry
  max_delay: 10s             # Cap on individual delay
  strategy: exponential_with_jitter
  jitter_type: full          # full | equal | decorrelated
  factor: 2                  # Backoff multiplier
  retry_on: [                # Status codes to retry on
    429,                     # Rate limited (add retry-after header handling)
    502,                     # Bad gateway
    503,                     # Service unavailable
    504,                     # Gateway timeout
    408                      # Request timeout
  ]
  do_not_retry_on: [         # Status codes not to retry
    400, 401, 403, 404, 405, 409, 422  # Client errors (wont succeed on retry)
  ]
  max_duration: 30s          # Maximum total time for all retries
  circuit_breaker_aware: true # Stop retrying if circuit is open
`

**Retry Budgeting:**
- A retry budget limits total retry volume to prevent overload
- Budget: X% of original request capacity can be used for retries
- Example: 10% retry budget means if you have 1000 req/s, max retries = 100 req/s worth
- When budget is exceeded, new retries are rejected (fail fast)

`
retry_budget:
  budget_percent: 10         # 10% of original request volume
  decay_interval: 60s        # Budget replenishes over 60 seconds
  min_retry_threshold: 10    # Minimum retries before budget is enforced
`

**Retry Considerations:**

| Concern | Solution |
|---------|----------|
| Thundering herd | Full jitter randomization |
| Amplification of failure | Limited retries (max 3-5), retry budget |
| Request duplication | Idempotency keys on requests |
| Escalating database load | Exponential backoff to spread load |
| Cascade failure | Circuit breaker stops retry when upstream is unhealthy |
| Cost amplification | Cost-aware retry: expensive operations retry less |
| Stale retries | Time-to-live on request context: do not retry expired requests |

**Retry idempotency:**
- Only retry idempotent requests (GET, PUT, DELETE — not POST without idempotency key)
- Use idempotency keys for all mutating operations
- Key generation: client_id + operation_id + timestamp (UUIDv1 recommended)
- Key storage: expire after 24 hours
- Key validation: reject duplicate key within expiration window

## P4.4 Timeout & Deadline Propagation

Timeouts prevent resource exhaustion by bounding how long operations can take. Deadline propagation carries timeout context across service boundaries.

**Timeout Configuration:**

`
# Per-dependency timeouts
timeouts:
  cache_read: 50ms           # Cache must be fast — do not wait long
  cache_write: 100ms
  database_query: 500ms      # Standard OLTP query
  database_write: 1s
  internal_rpc: 2s           # Service-to-service
  external_api: 5s           # Third-party API
  background_job: 30s         # Batch processing

# Per-endpoint timeouts
endpoints:
  /api/checkout:
    read_timeout: 5s
    write_timeout: 10s
    idle_timeout: 30s
  /api/health:
    read_timeout: 2s
    write_timeout: 2s
`

**Timeout Calculation:**

`
# Start with user-facing SLO and work backwards
user_facing_slo_p99: 2000ms   # 2 seconds total

# Break down into service-level timeouts (with buffer)
api_gateway:       200ms       # 10% of budget
auth_service:      200ms       # 10%
business_logic:    500ms       # 25%
database_query:    500ms       # 25% (with retry)
external_api:    200ms        # 10% (with fallback)
buffer_time:      400ms        # 20% for variability

total_with_buffer: 2000ms     # = SLO
`

**Timeout patterns:**

1. **Client-side timeout:** The caller sets a maximum wait time for a response
   - Connection timeout: time to establish TCP connection
   - Read timeout: time to read response after connection
   - Write timeout: time to send request body
   - Total timeout: maximum total time for complete request

2. **Server-side timeout:** The server limits processing time per request
   - Request timeout: max time to receive request body
   - Processing timeout: max time to process request
   - Response timeout: max time to send response
   - Total timeout: max time from request start to response complete

3. **Deadline propagation:** Carry remaining timeout across service calls
   - Include deadline in request context (gRPC: time-to-live in metadata)
   - Each service subtracts its processing time from deadline
   - Propagate remaining deadline to downstream calls
   - If deadline is exceeded, immediately return error (do not process)

**Deadline Propagation Implementation:**

`
# gRPC context propagation
context.WithDeadline(parent, deadline)  // Create context with deadline
deadline, _ := ctx.Deadline()           // Extract deadline from context
remaining := deadline.Sub(time.Now())   // Calculate remaining time

# When calling downstream service
downstream_timeout = remaining * 0.8    // Use 80% of remaining time
downstream_deadline = time.Now().Add(downstream_timeout)
`

**Timeout anti-patterns:**
- Timeout set too long (exhausts resources waiting for dead dependency)
- Timeout set too short (fails healthy requests, causes thrashing)
- No timeout at all (infinite wait → resource leak → outage)
- Not propagating deadline (each service uses own timeout, total exceeds SLO)
- Hard-coded timeouts (not adjustable without deployment)
- Ignoring DNS timeout (DNS failure hangs for 30+ seconds by default)

**Timeout best practices:**
- All network operations must have timeouts (DNS, TCP, TLS, HTTP, DB, cache)
- Timeouts should be configurable via environment variables or config files
- Monitor timeout error rates separately (timeout metric tag)
- Alert on high timeout rates (indicates dependencies are slow or unreachable)
- Review timeouts quarterly against SLO attainment data
- Test timeout behavior in integration tests
- Implement timeout hierarchies: each layer timeout < parent layer timeout

## P4.5 Rate Limiting & Throttling

Rate limiting protects services from overload by controlling request volume. Throttling is the enforcement mechanism.

**Rate Limiting Algorithms:**

| Algorithm | Description | Pros | Cons | Best For |
|-----------|-------------|------|------|----------|
| Token Bucket | Tokens added at fixed rate, consumed per request | Burst-friendly, simple | Memory per bucket | General purpose |
| Leaky Bucket | Requests processed at fixed rate, excess queued | Smooth output | No burst support | Queue-based systems |
| Fixed Window | Count requests in fixed time window | Simple implementation | Traffic spikes at window boundary | Simple scenarios |
| Sliding Window Log | Log timestamps, count in sliding window | Accurate | Memory intensive for high traffic | Accuracy-critical |
| Sliding Window Counter | Approximate sliding window using counters | Good accuracy, low memory | Slightly approximate | Production systems |
| GCRA (Generic Cell Rate) | Track next allowed time per client | Efficient, accurate | Complex implementation | High-performance systems |

**Rate Limiting Configuration:**

`
rate_limit:
  # Global limits
  global:
    requests_per_second: 10000
    burst_size: 20000

  # Per-client limits
  per_client:
    standard:
      requests_per_second: 100
      burst_size: 200
    premium:
      requests_per_second: 500
      burst_size: 1000
    internal:
      requests_per_second: 1000
      burst_size: 2000

  # Per-endpoint limits
  per_endpoint:
    /api/checkout:
      requests_per_second: 500
      burst_size: 1000
    /api/auth:
      requests_per_second: 2000
      burst_size: 4000
    /api/health:
      requests_per_second: 10000
      burst_size: 20000

  # Backend rate limiting (against dependencies)
  backend_limits:
    database:
      max_queries_per_second: 5000
    external_api_a:
      max_requests_per_second: 100
    cache:
      max_operations_per_second: 20000
`

**Rate Limiting Response:**
- HTTP 429 Too Many Requests
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After
- Body: JSON with limit, remaining, reset timestamp
- For internal calls: return fast-fail error with retry-after hint

**Rate Limiting Strategy:**

| Client Type | Algorithm | Window | Limit | Action |
|-------------|-----------|--------|-------|--------|
| Authenticated user | Sliding Window | 1 minute | 1000 req/min | Reject with 429 |
| API key partner | Token Bucket | N/A | 100 req/s, burst 200 | Reject with 429 |
| Internal service | Token Bucket | N/A | 1000 req/s | Reject with 429 |
| Anonymous | Sliding Window | 1 minute | 100 req/min | Reject with 429 |
| Admin | Token Bucket | N/A | 10000 req/s | Log when exceeded |

**Server-side Rate Limiting Placement:**
| Layer | What | Advantages | Disadvantages |
|-------|------|------------|---------------|
| CDN | Edge rate limiting | Stops traffic at edge, lowest latency | Limited configuration |
| Load Balancer | IP-based rate limiting | Simple, no app modification | No user/API key awareness |
| API Gateway | Flexible per-route limits | Full configuration, auth-aware | Latency adds ~5ms |
| Application | Custom business logic limits | Maximum flexibility | Resource consumption per request |
| Database | Connection pooling limits | Protects data layer | Last line of defense |

## P4.6 Graceful Degradation

Graceful degradation ensures the system remains partially functional when components fail. It degrades functionality rather than failing completely.

**Degradation Strategies:**

| Strategy | Description | User Experience | Implementation |
|----------|-------------|-----------------|----------------|
| Disable non-critical features | Remove optional features | Core feature works, enhanced features disabled | Feature flags |
| Serve cached data | Return stale or cached data | Data may be slightly stale but service works | CDN, cache layer |
| Reduce data freshness | Accept older data | Search results 5 minutes old instead of real-time | TTL extension |
| Reduce data quality | Return lower-resolution or simplified data | Images: thumbnail → placeholder text | Quality tiers |
| Skip non-critical processing | Skip steps that are not essential | Checkout: skip recommendations, process payment | Circuit breakers |
| Queue for later processing | Accept request but process later | Order confirmed, will process shortly | Message queues |
| Return default values | Return reasonable defaults | Empty results instead of error | Fallback logic |
| Read-only mode | Disable writes, allow reads | Can view data but not update | Feature flag |
| Primary user priority | Prioritize primary users over free users | Paying users unaffected, free users degraded | Request prioritization |

**Degradation Implementation:**

`
degradation:
  # Cache fallback
  cache_fallback:
    enabled: true
    max_staleness: 5m          # Serve cache up to 5 minutes stale
    refresh_interval: 30s       # Attempt to refresh cache in background

  # Feature degradation
  feature_degradation:
    enabled: true
    degrade_levels:
      level1:                   # Minor degradation
        recommendation_engine: off
        search_precision: decreased
      level2:                   # Moderate degradation
        personalization: off
        caching: aggressive
      level3:                   # Severe degradation
        write_operations: disabled
        multimedia: off

  # Request prioritization
  request_prioritization:
    enabled: true
    tiers:
      - premium_users:
          weight: 10
          degradation: false     # Never degrade
      - standard_users:
          weight: 5
          degradation: level1    # Minor degradation on overload
      - anonymous:
          weight: 1
          degradation: level2    # Moderate degradation on overload
`

**Degradation Decision Logic:**

`
def calculate_degradation_level(current_load, capacity):
    utilization = current_load / capacity

    if utilization < 0.6:
        return 0   # No degradation
    elif utilization < 0.75:
        return 1   # Minor degradation (level1)
    elif utilization < 0.85:
        return 2   # Moderate degradation (level2)
    elif utilization < 0.95:
        return 3   # Severe degradation (level3)
    else:
        return 4   # Emergency (reject non-critical traffic)
`

**Graceful degradation testing:**
- Load test with dependency failure to verify degradation
- Chaos experiment: kill dependency, verify degraded path works
- Verify: degraded path itself does not become a failure point
- Test: return from degradation (does system recover properly?)
- Monitor: degradation events tracked, rate of degradation, duration

## P4.7 Health Check & Readiness Probes

Health checks determine if a service instance is alive and ready to serve traffic.

**Health Check Types:**

| Type | Description | Check | Frequency | Failure Action |
|------|-------------|-------|-----------|----------------|
| Liveness | Is process alive? | Process health, no deadlock | 10 seconds | Restart container |
| Readiness | Is it ready to serve traffic? | Dependencies available, not saturated | 5 seconds | Remove from load balancer |
| Startup | Has it finished initializing? | Init complete, warmup done | 2 seconds | Postpone liveness checks |
| Deep health | Full system health? | Internal state, queue depth, resource usage | 30 seconds | Alert, not for traffic control |

**Health Check Endpoints:**

`
# Standard health endpoint (liveness)
GET /healthz
Response 200: OK
Response 503: Service unhealthy

# Readiness endpoint
GET /readyz
Response 200: { "status": "ok" }
Response 503: {
    "status": "not ready",
    "checks": {
        "database": { "status": "up", "latency_ms": 5 },
        "cache": { "status": "up", "latency_ms": 2 },
        "queue_depth": { "status": "ok", "value": 50, "max": 1000 }
    }
}

# Startup endpoint
GET /startupz
Response 200: { "status": "ready", "warmup_progress": 1.0 }
Response 503: { "status": "starting", "warmup_progress": 0.75 }
`

**Health Check Implementation Guidelines:**
1. Liveness check should be lightweight (no dependency checks)
2. Readiness check should verify critical dependencies (DB, cache, upstream)
3. Readiness check should fail if resource utilization exceeds threshold
4. Startup check is separate from liveness to prevent startup restarts
5. Health endpoints should not require authentication (health probes are internal)
6. Health endpoints should not log at normal log level (high frequency)
7. Implement health endpoints before any other endpoint
8. Health check responses should include diagnostic information
9. Health check endpoints should have their own timeout (independent of service timeouts)
10. Health check failure should be logged with structured data

**Health Check Configuration (Kubernetes):**

`yaml
# Container-level health checks
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 3
  successThreshold: 1

readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
  successThreshold: 1

startupProbe:
  httpGet:
    path: /startupz
    port: 8080
  initialDelaySeconds: 3
  periodSeconds: 2
  timeoutSeconds: 3
  failureThreshold: 30
  successThreshold: 1
`

**Health monitoring metrics:**
| Metric | Source | Threshold | Alert |
|--------|--------|-----------|-------|
| Liveness failure count | Container runtime | > 0 | Restarting — page |
| Readiness failure rate | Load balancer | > 5% of instances ready | Page if > 20% failing |
| Health check latency | Application | p99 > 100ms | Warning |
| Health check error responses | Application | Any unexpected status | Page |
| Instance health distribution | Cluster manager | < 60% ready | Page |

## P4.8 Leader Election & Consensus

Leader election and consensus algorithms ensure consistency and coordination in distributed systems.

**Leader Election Algorithms:**

| Algorithm | Description | Consistency | Tolerance | Complexity |
|-----------|-------------|-------------|-----------|------------|
| Raft | Understandable consensus, leader-based | Strong | F < N/2 | Moderate |
| Paxos | General consensus, multi-phase | Strong | F < N/2 | High |
| Zab (ZooKeeper) | Leader-based primary-backup | Strong | F < N/2 | Moderate |
| Gossip | Epidemic communication | Eventually | F < N/2 | Low |
| SWIM | Scalable membership | Strong membership | F < N/2 | Moderate |

**Leader Election Configuration (with consensus):**

`
leader_election:
  algorithm: raft
  heartbeat_interval: 100ms    # How often leader sends heartbeat
  election_timeout: 500ms      # Time before initiating election
  election_timeout_range: 400ms-600ms  # Randomization avoids split vote
  cluster_size: 5              # Number of nodes (for tolerance of 2 failures)
  request_timeout: 3s          # Client request timeout
  snapshot_interval: 1000      # Log entries between snapshots
  log_retention: 10000         # Retain last 10000 log entries
`

**Consensus Requirements:**
- Minimum cluster size for fault tolerance: 3 (tolerates 1 failure)
- Recommended cluster size: 5 (tolerates 2 failures)
- Odd number of nodes always (prevents split-brain)
- Quorum = (N/2) + 1 (majority)
- Latency impact: each write requires quorum acknowledgment
- Network partition: if isolated from quorum, node cannot lead

**Leader Election Best Practices:**
- Use a proven implementation (etcd, ZooKeeper, Consul)
- Do not implement Raft or Paxos from scratch
- Leader election timeout should be > heartbeat interval * 2
- Monitor leader changes (frequent changes indicate instability)
- Leader election requires reliable clock synchronization (NTP)
- Test leader election during network partitions
- Application should be stateless regarding which node is leader
- Leader election state changes should be logged and alerted
- Ensure leader is the only one performing leader-specific duties
- Client should retry with backoff for leader election timeouts

**Application-level leader election (if not using consensus):**
`
# Simple leader election with distributed lock
leader:
  lock_backend: etcd
  lock_key: /service/checkout/leader
  ttl: 30s                    # Lock TTL — leader must refresh
  refresh_interval: 10s       # How often leader refreshes lock
  retry_interval: 5s          # How often non-leader retries lock
  election_timeout: 60s       # Max time to elect new leader

# Leader duties (application-specific)
leader_duties:
  - cron_job_scheduling
  - cache_warming
  - batch_processing
  - metric_aggregation
  - log_rotation_cleanup
`

## P4.9 Replication Strategies

Replication ensures data availability and durability by maintaining copies across multiple nodes.

**Replication Strategies:**

| Strategy | Description | Consistency | Latency | Durability | Example |
|----------|-------------|-------------|---------|------------|---------|
| Synchronous (Single-Leader) | Write to master + all replicas before ack | Strong | Write = slowest replica | Very high | PostgreSQL sync |
| Asynchronous (Single-Leader) | Master writes, replicas eventually | Eventually | Write = master only | Higher risk on master failure | PostgreSQL async |
| Multi-Leader | Multiple writable masters | Eventually (conflict resolution) | Varies | High | DynamoDB, Cassandra |
| Leaderless | All nodes accept writes | Quorum-based eventually | Varies | High | Cassandra (tunable) |
| Chain Replication | Write propagated along chain | Strong | Chain length dependent | High | Azure Storage |

**Replication Configuration:**

`
replication:
  strategy: single_leader_sync
  factor: 3                   # Number of replicas
  consistency_level: quorum   # quorum | all | one
  write_concern: majority     # Number of replicas that must ack write
  read_concern: majority      # Number of replicas that must respond to read
  heartbeats: true            # Track replica health
  catchup_timeout: 30s        # Time to allow replica to catch up
  repair_interval: 60s        # Periodic consistency check interval
`

**Replication Factor Selection:**

| Factor | Tolerated Failures | Storage Cost | Write Latency |
|--------|-------------------|--------------|---------------|
| 2 | 1 | 2x | 1x write (async) |
| 3 | 1 | 3x | 1x + network round trip (sync) |
| 3 | 2 (with N-1 stall) | 3x | 2x network round trips |
| 5 | 2 | 5x | 2x network round trips |

**Replication Lag Monitoring:**

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Replication lag | > 5 seconds | > 60 seconds | Investigate network or load |
| Replica health | 1 replica down | > 1 replica down | Restore replica |
| Conflict count | > 0 | > 100/hour | Investigate conflict source |
| Repair rows | > 1000 | > 10000 | Trigger repair |
| Consistency ratio | < 1 (any inconsistency) | < 0.9 | Trigger full consistency check |

**Replication Best Practices:**
- Factor: minimum 3 (tolerate 1 failure, still have redundancy during repair)
- Synchronous replication for critical data (financial, user accounts)
- Asynchronous replication for non-critical data (logs, analytics)
- Monitor replication lag with metrics and alerts
- Test replica recovery (can replicas rejoin successfully?)
- Test master failure (does failover work correctly?)
- Test network partition behavior (split-brain prevention)
- Use read-replicas for read scaling when eventual consistency is acceptable
- Ensure replication topology matches failure domain boundaries
- Cross-region replication: asynchronous only (synchronous latency is prohibitive)

## P4.10 Partition Tolerance & Handling

Network partitions are inevitable in distributed systems. Partition handling determines system behavior when communication between nodes fails.

**Partition Handling Strategies:**

| Strategy | Behavior During Partition | Consistency | Availability | Tradeoff |
|----------|--------------------------|-------------|--------------|----------|
| CP (Consistency over Partition) | Stop serving from minority side | Strong | Reduced | Some data unavailable |
| AP (Availability over Partition) | Serve from both sides | Eventually | Full | Conflicts, eventual consistency |
| PA/EL (Partition-Aware, Eventually) | Graceful degradation per partition | Eventually | Degraded per partition | Complexity |

**CP Implementation (e.g., Raft/Paxos):**
`
partition_behavior:
  type: cp
  majority_side:             # Side with quorum (> N/2 nodes)
    status: fully_available
    operations: all
  minority_side:             # Side without quorum
    status: read_only
    operations: reads_only (stale allowed) or no_operations

  # Configuration
  quorum_timeout: 5s          # Time to detect partition
  reconnection_threshold: 3   # Heartbeats missed before declaring partition
  read_during_partition: stale_allowed  # stale_allowed | reject
`

**AP Implementation (e.g., Cassandra/DynamoDB):**
`
partition_behavior:
  type: ap
  both_sides:
    status: fully_available
    operations: all
  conflict_resolution:
    method: last_write_wins    # LWW | CRDT | custom
    timestamp_source: hybrid_clock  # hybrid_clock | wall_clock
    vector_clock: true         # Track causality
    merge_strategy: crdt       # How to merge on reconnection
  healing:
    repair_on_reconnect: true
    repair_threads: 4
    read_repair: probability_0.1  # 10% probability
`

**Partition Detection:**
`
# Gossip-based failure detection
failure_detection:
  protocol: gossip
  gossip_interval: 1s          # How often to gossip
  suspicion_timeout: 5s        # Time before marking as suspected
  suspicion_multiplier: 3      # Multiplier for network latency
  phi_threshold: 8.0           # Accrual failure detection threshold

  # Detection thresholds
  detection_time: 15s           # Max time to detect failure
  false_positive_rate: 0.01    # Target false positive rate

  # Notification
  on_partition_detected:
    - log_partition_event
    - update_routing_table
    - trigger_leader_election_if_needed
    - alert_on_partition
`

**Partition Handling Best Practices:**
- Design for partition — assume they will happen
- Choose CP or AP based on business requirements, not technical preference
- Financial systems: CP (consistency is mandatory)
- Social media feeds: AP (availability matters more)
- Document partition behavior and test it with chaos engineering
- Monitor: partition count, duration, data divergence during partition
- Test: partition healing (does data converge after reconnection?)
- Test: application behavior during partition (does it degrade gracefully?)
- Test: partition for each component (not just database)
- Have automatic detection and alerting for partitions
- Runbook for partition handling (what does each team do?)

## P4.11 Idempotency & Saga Patterns

Idempotency ensures operations can be safely retried without unintended side effects. Saga patterns manage distributed transactions across services.

**Idempotency Implementation:**

`
idempotency:
  key_generation:
    source: client             # Client provides idempotency key
    format: uuid_v1            # UUID v1 (time-based, monotonic)
    header: Idempotency-Key    # HTTP header for idempotency key

  key_verification:
    storage: redis             # Store processed keys
    ttl: 24h                   # How long to remember keys
    max_keys_per_client: 1000  # Limit per client to prevent storage bloat

  response_caching:
    enabled: true              # Cache response for idempotent request
    cache_ttl: 24h             # Match key TTL
    storage: redis             # Store previous response

  retry_handling:
    duplicate_detection: true  # Detect and return cached response
    on_duplicate:
      action: return_cached_response  # Return original response
      headers:
      - X-Idempotent-Replayed: true   # Indicate replayed request
`

**Idempotent Request Flow:**
1. Client generates idempotency key (UUID v1)
2. Client sends request with Idempotency-Key header
3. Server checks if key has been processed:
   - If processed: return cached response (HTTP 200 with replay header)
   - If in progress: return HTTP 409 Conflict
   - If new: process request, cache response, return result
4. On network failure, client retries with same idempotency key
5. Server returns same result (no duplicate processing)

**Saga Pattern Types:**

| Type | Description | Pros | Cons |
|------|-------------|------|------|
| Choreography-based | Each service emits events, others react | Simple, no coordinator | Complex debugging, circular dependencies |
| Orchestration-based | Coordinator service manages saga steps | Centralized control, easier tracing | Single point of failure, coordinator complexity |

**Choreography Saga Example (Order Processing):**

`
Order Service:
  1. Create order (pending)
  2. Emit OrderCreated event

Payment Service:
  1. Listen for OrderCreated
  2. Process payment
  3. Emit PaymentProcessed or PaymentFailed
  4. If failed: emit OrderCompensation event

Inventory Service:
  1. Listen for PaymentProcessed
  2. Reserve inventory
  3. Emit InventoryReserved or InventoryFailed
  4. If failed: emit PaymentCompensation event

Compensation flow:
  PaymentFailed → OrderCompensation → Cancel order
  InventoryFailed → PaymentCompensation → Refund payment
`

**Orchestration Saga Example (with coordinator):**

`
Saga Coordinator:
  1. Create saga context with unique saga_id
  2. Call Order Service: createOrder()
  3. Call Payment Service: processPayment(orderId)
     - If fails: call Order.cancelOrder() (compensation)
  4. Call Inventory Service: reserveInventory(orderId)
     - If fails: call Payment.refundPayment() → Order.cancelOrder()
  5. Mark saga as COMPLETED
`

**Saga Configuration:**

`
saga:
  type: orchestration
  coordinator_service: saga-coordinator
  retry:
    max_retries: 3
    backoff: exponential_with_jitter
    base_delay: 100ms
    max_delay: 10s

  timeout:
    step_timeout: 30s          # Max time per saga step
    saga_timeout: 300s         # Max total saga duration

  persistence:
    backend: postgresql
    table: saga_log
    retention: 90d             # Keep saga logs for 90 days

  monitoring:
    success_metric: saga_completed_total
    failure_metric: saga_failed_total
    duration_metric: saga_duration_seconds

  alerts:
    - saga_step_failure_rate > 5% in 5 minutes
    - saga_duration > 90th percentile for 10 consecutive
    - saga_timeout_count > 0
`

**Best Practices:**
- All mutation operations should be idempotent
- Idempotency keys should be client-generated (UUID v1 recommended)
- Sagas should compensate for failures, not roll back (different from ACID)
- Compensating operations must be idempotent too
- Test saga failure at every step (what happens if step 2 of 5 fails?)
- Monitor saga health: success rate, duration, pending sagas
- Alert on: stuck sagas (timeout), high failure rate, slow steps
- Log every saga step with duration, status, and error details
- Implement saga recovery for coordinator failures

## P4.12 Async Processing & Queue-Based Load Leveling

Async processing decouples request receipt from request processing, providing resilience against traffic spikes.

**Queue-Based Load Leveling:**

| Pattern | Description | Use Case | Technology |
|---------|-------------|----------|------------|
| Work Queue | Tasks processed by workers | Background jobs, async processing | RabbitMQ, SQS, Kafka |
| Publish/Subscribe | Events broadcast to subscribers | Event-driven architecture | Kafka, Pub/Sub |
| Priority Queue | High priority tasks processed first | Customer-facing vs internal | RabbitMQ with priority |
| Dead Letter Queue | Failed messages stored for analysis | Error handling, retry management | SQS DLQ, RabbitMQ DLX |
| Delayed Queue | Messages delayed for future processing | Scheduled tasks, retry with delay | RabbitMQ delayed messages |

**Queue Configuration:**

`
queue:
  provider: rabbitmq
  name: orders.processing

  # Queue settings
  durable: true
  auto_delete: false
  exclusive: false

  # Message handling
  prefetch_count: 10           # Max unacknowledged messages per consumer
  ack_mode: manual             # manual | auto
  requeue_on_failure: true     # Requeue on processing failure

  # Retry
  retry:
    max_retries: 3
    delays: [5s, 30s, 120s]    # Delays between retries
    dead_letter_on_exhaustion: true  # Send to DLQ after max retries
    dead_letter_exchange: orders.processing.dlx

  # Scaling
  auto_scaling:                # Worker auto-scaling
    metric: queue_depth
    target_depth: 1000         # Target queue depth (triggers scaling)
    min_workers: 2
    max_workers: 20
    scale_up_interval: 30s
    scale_down_interval: 120s

  # Monitoring
  metrics:
    - queue_depth
    - messages_published_rate
    - messages_consumed_rate
    - processing_time_seconds (p50, p95, p99)
    - error_rate
    - dead_letter_count
    - consumer_count

  alerts:
    - queue_depth > 10000: page
    - queue_depth > 50000: critical page
    - dead_letter_count > 100/hour: page
    - processing_time_p99 > 10s: warning
    - error_rate > 5%: page
    - consumer_count == 0: critical page
`

**Load Leveling Configuration:**

`
load_leveling:
  enabled: true
  max_queue_depth: 10000        # Hard limit on queue depth
  rejection_threshold: 10000    # Reject new requests if queue exceeds
  burst_capacity: 5000          # Max requests accepted in 1 second

  # Throttling
  throttle:
    mode: token_bucket
    rate: 1000                   # Process 1000 messages/second max
    burst: 2000                  # Allow 2000 on burst

  # Backpressure
  backpressure:
    mode: dynamic                # dynamic | fixed
    target_processing_time: 500ms  # Target p99 processing latency
    algorithm: aimd              # Additive Increase, Multiplicative Decrease
    min_throttle: 100            # Minimum messages/second
    max_throttle: 5000           # Maximum messages/second
`

**Async Processing Best Practices:**
1. All async operations should have idempotency keys
2. Processing should be idempotent (same message processed twice = same result)
3. Use dead letter queues for failed messages after retries
4. Monitor queue depth as a saturation signal
5. Queue depth should trigger auto-scaling before it becomes critical
6. Implement backpressure: slow down publishing when queue is deep
7. Process messages in order when order matters (use single queue per partition)
8. Use message TTL to avoid processing stale messages
9. Log message processing duration, status, and failure details
10. Test: consumer failure, queue backup, DLQ processing

**Eventual Consistency with Async Processing:**

`
async_consistency:
  pattern: outbox             # Outbox pattern for reliable publishing
  outbox_table: event_outbox  # Database table for outbox events

  # Outbox polling
  poller:
    interval: 1s              # Poll outbox every 1 second
    batch_size: 100           # Publish 100 messages per poll
    max_publish_attempts: 5

  # Guarantee: at-least-once delivery
  delivery_guarantee: at_least_once
  deduplication_window: 5m   # Dedup within 5 minutes

  # Consistency check
  consistency_check:
    enabled: true
    interval: 1h              # Run consistency check hourly
    tolerance: 5m             # Max acceptable delay for message delivery
    alert_on_violation: true  # Alert if message not delivered within tolerance
`

---

# P5: Error Budget & SLO Design

## P5.1 Error Budget Policy Framework

The error budget policy defines how error budgets are calculated, tracked, and used for decision-making.

**Error Budget Policy Document:**

`
ERROR BUDGET POLICY

## 1. Purpose
This policy defines how error budgets are calculated, tracked, and used for decision-making across all services. Error budgets quantify acceptable failure and enable data-driven decisions about release velocity, feature investment, and reliability improvements.

## 2. Scope
This policy applies to all services with defined SLOs. Services without SLOs have no error budget and are not eligible for production traffic.

## 3. Error Budget Calculation
3.1. Budget Period: 30 days rolling window
3.2. Budget = (Total Events) * (1 - SLO Target)
3.3. Events: total eligible requests or time units (per SLI type)
3.4. Consumption: budget consumed = bad events / total events over window

## 4. Error Budget States
| Budget Remaining | State | Action |
|-----------------|-------|--------|
| > 50% | Healthy | Business as usual |
| 25% - 50% | Warning | Deployments require SRE approval |
| 10% - 25% | Critical | Deployments frozen; high-priority fixes only |
| < 10% | Emergency | All-hands on reliability; incident response |
| 0% (Exhausted) | Violation | SLO violation declared; executive notification |

## 5. Release Gating
5.1. Releases are gated on error budget state
5.2. State: Healthy → releases proceed normally
5.3. State: Warning → releases require documented justification and SRE lead approval
5.4. State: Critical or Emergency → releases blocked except for:
   - Rollbacks to a known-good version
   - Hotfixes for the cause of the budget consumption
   - Security patches (with security team approval)

## 6. Budget Exclusions
The following events do not consume error budget:
6.1. Planned maintenance with prior notification (at least 24 hours)
6.2. Known upstream dependency failures (documented and tracked)
6.3. Client-side issues (verified by client telemetry)
6.4. Deliberate chaos experiments (documented in experiment plan)

## 7. Budget Adjustments
7.1. SLO target changes take effect at next budget period boundary
7.2. Budget does not refill early — compliance window is fixed at 30 days
7.3. Budget is not transferable between services
7.4. Budget is not cumulative across periods

## 8. Governance
8.1. Monthly: Budget report to engineering leadership
8.2. Quarterly: SLO target review with product stakeholders
8.3. Annual: Policy review and update

## 9. Consequences of Violation
9.1. SLO violation triggers postmortem
9.2. Exhausted budget requires incident review
9.3. Repeated violations (> 4 per quarter) trigger executive review
9.4. Persistent violation (> 2 consecutive quarters) triggers service redesign evaluation

## 10. Exceptions
Exceptions to this policy require written approval from:
- SRE Director (for operational exceptions)
- VP of Engineering (for policy exceptions)
- Chief Technology Officer (for policy waivers)
`

**Error Budget Policy Implementation:**
| Component | Implementation | Owner |
|-----------|----------------|-------|
| Budget calculation | Automated pipeline (daily) | SRE team |
| Budget tracking | Dashboard (real-time) | SRE team |
| Release gating | CI/CD pipeline integration | DevProd team |
| Budget reporting | Monthly automated report | SRE team |
| Policy enforcement | Automated gates + manual review | Engineering managers |

## P5.2 SLO Design Workshop Process

The SLO design workshop is a facilitated session where product, engineering, and SRE stakeholders define service level objectives.

**Workshop Agenda (4 hours):**

`
## SLO Design Workshop

### Pre-Workshop (1-2 weeks before)
- Identify participants: Product Manager, Engineering Lead, SRE Lead, QA Lead, Ops Lead
- Distribute pre-reading: SRE workbook, existing metrics, user journey maps
- Review: current monitoring coverage, incident history, known pain points
- Prepare: user journey map, architecture diagram, traffic patterns

### Workshop Part 1: User Journey & Critical Paths (60 min)
1. Map the user journey end-to-end (30 min)
   - List all user-facing features
   - Identify critical user journeys (login, search, browse, checkout)
   - Mark dependencies for each journey
2. Identify what matters to users (30 min)
   - For each journey: what does good look like?
   - For each journey: what does broken look like?
   - Rate journeys by criticality (Tier 0, Tier 1, Tier 2, Tier 3)

### Workshop Part 2: SLI Definition (60 min)
1. Define candidate SLIs for each journey (30 min)
   - Availability: what constitutes success?
   - Latency: what response time is acceptable?
   - Throughput: what traffic level should be handled?
   - Correctness: what does a correct response look like?
2. Define measurement methodology (30 min)
   - How will each SLI be instrumented?
   - What data sources are available?
   - What is the measurement resolution (per-request, per-second)?
   - How will we aggregate (per-instance, per-service, per-API)?

### Workshop Part 3: SLO Target Setting (60 min)
1. Establish baseline metrics (20 min)
   - Historical performance data review
   - Current error rates, latency distributions
   - Current availability (if measured)
2. Set initial targets (40 min)
   - Propose target for each SLI
   - Validate against business requirements
   - Validate against technical feasibility
   - Discuss tradeoffs: tighter SLO = more investment
   - Document rationale for each target

### Workshop Part 4: Error Budget & Alerting (60 min)
1. Define error budget policy (30 min)
   - Budget window (30 days)
   - Budget allocation per service
   - Release gating thresholds
   - Exclusion criteria
2. Define alerting strategy (30 min)
   - Burn rate thresholds (fast and slow)
   - Alert severity per threshold
   - Notification channels (email, chat, page)
   - Escalation paths

### Post-Workshop (1-2 weeks)
- Publish SLO charter document
- Implement SLI instrumentation
- Configure SLO tracking dashboard
- Set up burn rate alerting
- Review at next sprint planning
`

**SLO Design Workshop Artifacts:**

| Artifact | Format | Owner | Timeline |
|----------|--------|-------|----------|
| User journey map | Diagram | Product Manager | Pre-workshop |
| SLI specification | Document | SRE Lead | Workshop |
| SLO targets | Table | Engineering Lead | Workshop |
| Error budget policy | Document | SRE Lead | Post-workshop |
| SLO charter | Document | SRE Lead | Post-workshop |
| Monitoring instrumentation | Code | Engineering Team | 2 weeks post-workshop |
| SLO dashboard | Dashboard | SRE Team | 2 weeks post-workshop |
| Burn rate alerts | Alert rules | SRE Team | 2 weeks post-workshop |

## P5.3 SLO Specification Templates

Standard templates for defining SLOs ensure consistency across services.

**SLO Specification Template:**

`yaml
slo_spec:
  # Metadata
  service: checkout-api
  version: 1.2
  created: 2026-01-15
  last_reviewed: 2026-04-15
  owner: checkout-team
  tier: 1

  # User Journeys
  user_journeys:
    - name: Complete Purchase
      criticality: tier_0
      description: User adds items to cart and completes checkout
      dependencies:
        - cart-service
        - payment-gateway
        - inventory-service
        - notification-service

  # SLIs
  slis:
    - name: checkout_availability
      type: availability
      definition: Fraction of checkout requests returning HTTP 2xx/3xx
      numerator: count of HTTP codes in [200, 201, 202, 204, 301, 302]
      denominator: count of all HTTP status codes except 429
      measurement:
        method: server_side_instrumentation
        source: application_middleware
        aggregation: 1m rolling average
        resolution: per_request
      exclusions:
        - 429 (rate limited requests)
        - Planned maintenance windows

    - name: checkout_latency_p99
      type: latency
      definition: Fraction of checkout requests within 2000ms at p99
      threshold_ms: 2000
      percentile: 99
      numerator: count of requests with duration_ms < 2000
      denominator: count of all checkout requests
      measurement:
        method: server_side_timing
        source: application_middleware
        aggregation: p99 over 5m window
        resolution: per_request

    - name: payment_success_rate
      type: correctness
      definition: Fraction of payment attempts completing successfully
      numerator: count of successful payment completions
      denominator: count of payment initiation attempts
      measurement:
        method: payment_gateway_callback
        source: payment_service_logs
        aggregation: 1h window
        resolution: per_transaction

  # SLO Targets
  slos:
    - name: checkout_availability_99_9
      sli_ref: checkout_availability
      target: 0.999
      compliance_window: 30d
      error_budget: 0.001 of total requests over 30 days

    - name: checkout_latency_p99_2000
      sli_ref: checkout_latency_p99
      target: 0.99
      compliance_window: 30d
      error_budget: 0.01 of requests can exceed 2000ms p99

    - name: payment_success_99_95
      sli_ref: payment_success_rate
      target: 0.9995
      compliance_window: 30d
      error_budget: 0.0005 of payment attempts can fail

  # Alerting Rules
  alerting:
    - name: checkout_availability_burn
      type: burn_rate
      short_window: 5m
      short_burn_rate: 14
      long_window: 30m
      long_burn_rate: 2.5
      severity: page

    - name: checkout_latency_burn
      type: burn_rate
      short_window: 5m
      short_burn_rate: 12
      long_window: 30m
      long_burn_rate: 2.0
      severity: page

    - name: budget_warning
      type: budget_remaining
      threshold: 0.25
      severity: warning
      channels: [email, chat]
`

**SLO Catalogue Entry:**

| Field | Value |
|-------|-------|
| Service | checkout-api |
| SLO Name | checkout_availability_99_9 |
| SLI | checkout_availability |
| Target | 99.9% |
| Window | 30 days rolling |
| Budget | 0.1% = 43.2 minutes |
| Owner | checkout-team |
| Review Date | 2026-07-15 |
| Stakeholders | Product, Engineering, SRE |
| Business Rationale | Core revenue-generating feature |

## P5.4 Multi-Service SLO Composition

When a user journey spans multiple services, the composite SLO must account for each dependency.

**Composition Models:**

**Model 1: Serial Dependency (A → B → C)**
- If A fails OR B fails OR C fails, the user-facing request fails
- Composite availability = A_avail * B_avail * C_avail
- For 99.9% SLO per service: 0.999 * 0.999 * 0.999 = 0.997 = 99.7% composite
- To achieve 99.9% composite: each service must be 99.97% (0.9997^3 ≈ 0.999)

**Model 2: Parallel Dependency (A calls B and C independently)**
- If B fails, A can still succeed (if B is non-critical)
- Composite = A_avail * min(B_avail_with_fallback, C_avail_with_fallback)
- With good fallback, composite can approach single-service levels

**Model 3: Fan-Out (A depends on B or C redundantly)**
- A succeeds if B OR C succeeds
- Composite = 1 - (1 - B_avail) * (1 - C_avail)
- For 99.9% B and 99.9% C: 1 - (0.001 * 0.001) = 99.9999%

**Composite SLO Calculation:**

`python
def calculate_composite_slo(services, topology):
    if topology == "serial":
        composite = 1.0
        for svc in services:
            composite *= svc.slo_target
        return composite

    elif topology == "parallel":
        composite = 1.0
        for svc in services:
            if svc.critical:
                composite *= svc.slo_target
        return composite

    elif topology == "redundant":
        failure_prob = 1.0
        for svc in services:
            failure_prob *= (1 - svc.slo_target)
        return 1 - failure_prob
`

**Composite SLO Budget Allocation:**

| Service | Individual SLO | Error Budget (30d) | Composite Contribution |
|---------|---------------|-------------------|----------------------|
| Frontend API | 99.95% | 21.6 min | 0.9995 |
| Auth Service | 99.99% | 4.32 min | 0.9999 |
| Cart Service | 99.95% | 21.6 min | 0.9995 |
| Payment Gateway | 99.99% | 4.32 min | 0.9999 |
| Inventory Service | 99.95% | 21.6 min | 0.9995 |
| Notification | 99.9% | 43.2 min | 0.999 |
| Composite (serial) | 99.74% | — | 0.9995^3 * 0.9999^2 * 0.999 = 0.9974 |

**Multi-Service SLA Budget Sharing:**
- External SLA: 99.9% for the entire checkout flow
- Internal budget allocation: split the 43.2 min/user-facing downtime across services
- Each service gets a budget slice: Frontend 10 min, Auth 5 min, Cart 10 min, Payment 5 min, Inventory 10 min, Notification 3.2 min
- Budget slices are independent; one service exhausting its slice does not affect others
- But the composite SLA is affected by any service's outage

## P5.5 Error Budget Tracking & Dashboards

Real-time tracking of error budgets is essential for operational decision-making.

**Error Budget Dashboard Requirements:**

**Service-Level Dashboard:**
`
┌─────────────────────────────────────────────┐
│  Service: checkout-api                       │
│  SLO: Availability 99.9% (30d rolling)      │
│  Window: 2026-05-01 → 2026-05-30            │
│                                              │
│  Current Compliance: 99.92%  ✓              │
│  Error Budget Remaining: 87%                 │
│  Error Budget Used: 13%                      │
│  Burn Rate (1h): 0.3  (6h: 0.4 24h: 0.5)   │
│                                              │
│  ┌─── Budget Remaining ───────────────────┐  │
│  │ ████████████████████████░░░░░░░░  87%  │  │
│  │ Warning: 25% │ Critical: 10%          │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  Budget Consumption Rate                      │
│  ┌─────────────────────────────────────────┐  │
│  │ ╱╲    ╱╲    ╱╲                         │  │
│  │╱  ╲  ╱  ╲  ╱  ╲    ╱╲                 │  │
│  │    ╲╱    ╲╱    ╲  ╱  ╲                │  │
│  │                 ╲╱    ╲                │  │
│  └─────────────────────────────────────────┘  │
│  Apr 27    May 4    May 11   May 18   May 25  │
└─────────────────────────────────────────────┘
`

**Burn Rate Dashboard:**
`
┌─────────────────────────────────────────────┐
│  Burn Rate Analysis                          │
│                                              │
│  Current: 0.3      (1h avg)     █░░░░░░░░░  │
│  6h avg:  0.4                   ██░░░░░░░░  │
│  24h avg: 0.5                   ██░░░░░░░░  │
│  5d avg:  0.6                   ███░░░░░░░  │
│  30d avg: 0.8                   ████░░░░░░  │
│                                              │
│  Alert thresholds:                           │
│  Burn ≥ 14 for 5m  ────  Page threshold      │
│  Burn ≥ 2.5 for 30m ──── Page threshold      │
│  Burn ≥ 2 for 1h   ────  Warning threshold   │
│                                              │
│  Last 24 hours:                              │
│  ┌─────────────────────────────────────────┐  │
│  │    ╱╲         ╱╲                       │  │
│  │   ╱  ╲       ╱  ╲                      │  │
│  │  ╱    ╲     ╱    ╲   ╱╲               │  │
│  │ ╱      ╲   ╱      ╲ ╱  ╲             │  │
│  │╱        ╲╲╱        ╲╱    ╲            │  │
│  └─────────────────────────────────────────┘  │
│  00:00   04:00   08:00   12:00   16:00   20:00│
└─────────────────────────────────────────────┘
`

**Multi-Service Budget Dashboard:**
`
┌─────────────────────────────────────────────┐
│  Service Health Overview                      │
│                                              │
│  Service          SLO     Budget   Status    │
│  ─────────────────────────────────────────     │
│  checkout-api     99.9%   87%      ✓ HEALTHY │
│  auth-service     99.99%  95%      ✓ HEALTHY │
│  cart-service     99.95%  72%      ✓ HEALTHY │
│  payment-gateway  99.99%  45%      ⚠ WARNING │
│  inventory-svc    99.95%  12%      🔴 CRIT  │
│  notification     99.9%   98%      ✓ HEALTHY │
│                                              │
│  Services in Warning/Critical: 2              │
│  Composite Checkout SLO: 99.74% → 99.71% ⚠   │
└─────────────────────────────────────────────┘
`

**Budget Tracking Metrics to Export:**
`
# Prometheus metrics
slo_budget_remaining{service="checkout-api", slo="availability_99_9"} 0.87
slo_budget_consumed{service="checkout-api", slo="availability_99_9"} 0.13
slo_compliance{service="checkout-api", slo="availability_99_9"} 0.9992
slo_burn_rate{service="checkout-api", slo="availability_99_9", window="1h"} 0.3
slo_burn_rate{service="checkout-api", slo="availability_99_9", window="6h"} 0.4
slo_burn_rate{service="checkout-api", slo="availability_99_9", window="24h"} 0.5
slo_state{service="checkout-api", slo="availability_99_9"} 0  # 0=healthy, 1=warning, 2=critical, 3=violated
slo_violation{service="checkout-api", slo="availability_99_9"} 0  # 0=no, 1=violated
`

## P5.6 SLO Alerting & Paging Policy

SLO alerts must have clear severity levels, notification channels, and escalation paths.

**Alert Severity Definitions:**

| Severity | Burn Rate | Duration | Budget Impact | Notification | Response Time |
|----------|-----------|----------|---------------|--------------|---------------|
| PAGE-CRITICAL | ≥ 14 | ≥ 5 min | ≥ 0.23% | Phone + SMS | < 5 min |
| PAGE-HIGH | ≥ 2.5 | ≥ 30 min | ≥ 0.17% | Phone + SMS | < 15 min |
| PAGE-MEDIUM | ≥ 2.0 | ≥ 1 hour | ≥ 0.28% | SMS + Chat | < 1 hour |
| WARNING | ≥ 1.0 | ≥ 4 hours | ≥ 0.55% | Chat + Email | Next business day |
| INFO | Compliance < target | Any | N/A | Dashboard | Next weekly review |

**Alert Fatigue Prevention:**
- Max pages per on-call per shift: enforce via throttle
- Alert cooldown: minimum 30 minutes between identical alerts
- Weekend quiet hours: only PAGE-CRITICAL and PAGE-HIGH page out
- Holiday mode: escalate all pages to secondary if primary is on PTO
- False positive review: weekly review of all pages, classify as true/false

**Alert SNR Targets:**
| Metric | Current | Target | Action if below target |
|--------|---------|--------|----------------------|
| Page SNR | 0.4 | > 0.5 | Review burn rate thresholds, add damping |
| Warning SNR | 0.3 | > 0.3 | Review warning thresholds |
| Info SNR | 0.2 | > 0.2 | Review SLI measurement methodology |
| False positive rate | 60% | < 50% | Tune burn rates, extend windows |
| Mean time to acknowledge | 2 min | < 5 min | Verify paging infrastructure |
| Mean time to resolve | 15 min | < 30 min | Improve runbooks, automate remediation |

**Paging Policy:**
`
PAGING POLICY

1. Only page for conditions that threaten SLO compliance within the current window
2. Never page for conditions that can wait until business hours
3. Every page must link to a runbook
4. Every page must include the current SLO compliance and budget remaining
5. Pages must be acknowledged within 5 minutes
6. Unacknowledged pages after 5 minutes escalate to secondary
7. Unacknowledged pages after 10 minutes escalate to team lead
8. Unacknowledged pages after 15 minutes escalate to engineering manager
`

**Alert Response SLAs:**
| Severity | Acknowledge | Triage | Mitigate | Resolve |
|----------|-------------|--------|----------|---------|
| PAGE-CRITICAL | 5 min | 15 min | 30 min | 1 hour |
| PAGE-HIGH | 10 min | 30 min | 1 hour | 4 hours |
| PAGE-MEDIUM | 30 min | 1 hour | 4 hours | 8 hours |
| WARNING | 4 hours | 8 hours | 24 hours | 1 week |

## P5.7 SLO Reporting to Stakeholders

SLO reports translate technical metrics into business-aligned narratives.

**Monthly SLO Report Template:**

`
## Monthly SLO Report: [Month] [Year]

### Executive Summary
[1 paragraph] Overall reliability posture across all services.
Key wins, key misses, top action items.

### Service-Level SLO Compliance
| Service | Tier | SLO Target | Actual | Budget Remaining | Trend |
|---------|------|------------|--------|-----------------|-------|
| [svc]   | T0   | 99.99%     | 99.99% | 87%             | → stable |
| [svc]   | T1   | 99.9%      | 99.85% | 42%             | ↓ declining |
| [svc]   | T2   | 99.9%      | 99.95% | 95%             | ↑ improving |

### Budget Watch List
| Service | Burn Rate (24h) | Budget Remaining | Risk |
|---------|-----------------|-----------------|------|
| [svc]   | 2.1             | 15%             | 🔴 Red |
| [svc]   | 1.4             | 35%             | 🟡 Yellow |

### Incident Summary
- SEV0 incidents: 0
- SEV1 incidents: 2
- SEV2 incidents: 5
- Mean time to detect: 3 min
- Mean time to resolve: 22 min
- Total error budget consumed by incidents: 8%

### Top Action Items
1. [SVC] Fix database connection pool exhaustion — due [date] — [owner]
2. [SVC] Implement cache fallback for checkout — due [date] — [owner]
3. [ALL] Review burn rate thresholds — due [date] — [owner]

### Key Metrics Trends
[Chart: SLO compliance trend over 12 months]
[Chart: Error budget consumption by category]
[Chart: MTTR trend over 12 months]
[Chart: Toil ratio trend]
`

**Quarterly Business Review:**
`
## Quarterly SLO Business Review: Q[1-4] [Year]

### Reliability vs Feature Velocity
- Releases this quarter: [count]
- Rollbacks: [count] ([rate]%)
- Incidents caused by releases: [count]
- Error budget consumed by release incidents: [%]

### SLO Attainment vs External SLA
- SLA target: 99.9%
- SLA attainment: [actual]%
- SLA credits issued: []
- SLA violations: [count]

### SRE Investment Impact
- SRE time spent: [hours]
  - Engineering work: [%]
  - Toil: [%]
  - Incident response: [%]
  - On-call: [%]
- Toil reduction: [%] vs previous quarter
- Automation ROI: [hours saved] vs [hours invested]
- Chaos experiments: [count]
- Postmortem action items: [total], [closed], [open]

### Next Quarter Priorities
1. [Priority 1 with target metric]
2. [Priority 2 with target metric]
3. [Priority 3 with target metric]
`

## P5.8 Release Gating with Error Budgets

Release gating uses error budget state to control deployment velocity.

**Release Gate Implementation:**

`yaml
# CI/CD Pipeline Configuration
stages:
  - test
  - build
  - release_gate:
      type: error_budget_check
      services:
        - checkout-api
        - cart-service
      conditions:
        - budget_remaining > 0.25: pass
        - budget_remaining 0.10-0.25: manual_approval
        - budget_remaining < 0.10: block
      on_block:
        action: halt_pipeline
        notification: page_sre_lead
        message: "Error budget exhausted for {service}. Release blocked."
      on_manual_approval:
        approvers:
          - sre-team-lead
          - engineering-manager
        justification_required: true
        max_approval_duration: 24h
`

**Release Gate Policies:**

| Budget State | Gate Behavior | Approval | Justification |
|-------------|---------------|----------|---------------|
| > 50% | Auto-pass | None | Not required |
| 25% - 50% | Auto-pass | None | Not required |
| 10% - 25% | Manual gate | SRE Lead | Required |
| < 10% | Blocked | VP Engineering | Required + incident plan |
| Exhausted (0%) | Blocked | CTO | Required + postmortem + SRE plan |

**Release Gate Exceptions:**
`
RELEASE EXCEPTIONS

Emergency fixes that bypass release gates:
1. Rollback to known-good version — always allowed
2. Hotfix for the specific cause of budget consumption — allowed with SRE lead approval
3. Security vulnerability fix — allowed with security team lead approval
4. Configuration change to restore SLO compliance — allowed with on-call approval

All exception releases must:
- Be documented in the release system with exception reason
- Trigger a post-release review within 24 hours
- Be included in monthly SLO report
- Count toward the team exception budget (max 3 exceptions per quarter)
`

**Error Budget Release Gate Metrics:**
| Metric | Target |
|--------|--------|
| Releases blocked by budget gates | < 10% of total releases |
| Exception releases | < 3 per team per quarter |
| Releases causing SLO degradation | < 5% of total releases |
| Time from gate block to resolution | < 2 hours |
| False positive blocks (budget recovered without action) | < 5% of blocks |

---

# P6: Production Readiness

## P6.1 Production Readiness Review Overview

A Production Readiness Review (PRR) is a systematic evaluation of a service against reliability criteria before it enters production or before major changes. The PRR ensures the service meets minimum reliability standards.

**PRR Triggers:**
- New service entering production for the first time
- Major architecture change (new dependency, new data store, new communication pattern)
- Service migration to new infrastructure
- Service tier change (e.g., Tier 2 → Tier 1)
- Post-incident remediation verification
- Annual PRR renewal (for Tier 0 and Tier 1 services)

**PRR Participants:**
- Service owner (engineering lead)
- SRE representative
- Operations representative
- Security representative (if applicable)
- Infrastructure representative (if applicable)
- QA representative (if applicable)

**PRR Timeline:**
| Phase | Duration | Activity |
|-------|----------|----------|
| Pre-review | 2 weeks | Service team completes self-assessment |
| Review meeting | 2 hours | Walk through checklist, identify gaps |
| Remediation | Varies | Close gaps identified in review |
| Verification | 1 week | SRE verifies all items are closed |
| Sign-off | — | SRE approves production readiness |

## P6.2 PRR Checklist

Complete PRR checklist organized by domain:

**Monitoring & Observability:**
`
[ ] SLIs defined and instrumented for all critical user journeys
[ ] Service exports metrics (RED method: Rate, Errors, Duration)
[ ] Service exports utilization metrics (CPU, memory, I/O, network)
[ ] All dependencies are monitored (DB, cache, queue, upstream services)
[ ] Health check endpoints exist: /healthz (liveness), /readyz (readiness)
[ ] Distributed tracing is configured for critical paths
[ ] Structured logging is implemented (JSON format, correlation IDs)
[ ] Log aggregation is configured (logs shipped to central system)
[ ] Metrics retention policy defined (raw: 30 days, aggregated: 1 year)
[ ] Synthetic monitoring (heartbeat check) configured
`

**Alerting:**
`
[ ] SLO-based alerts configured with burn rate thresholds
[ ] Alert severity classification defined (SEV0-SEV4)
[ ] Every alert has an associated runbook
[ ] Alert fatigue metrics tracked (SNR > 0.5)
[ ] Alert routing configured (primary, secondary, escalation)
[ ] Pager integration tested and verified
[ ] Chat/email notification channels configured
[ ] Escalation policy documented
[ ] No-alert time periods (weekend, holiday) configured
[ ] Alert on missing data (if metric stops reporting)
`

**Incident Management:**
`
[ ] Incident severity taxonomy documented
[ ] Incident response procedure documented
[ ] On-call rotation defined with at least 5 engineers
[ ] Incident commander role defined and trained
[ ] Communication templates created (status updates, postmortems)
[ ] Postmortem template created
[ ] Escalation contact list maintained
[ ] War room / incident channel auto-creation configured
`

**SLOs & Error Budgets:**
`
[ ] SLOs defined for availability, latency, and correctness
[ ] SLO targets documented with business rationale
[ ] Error budget policy defined
[ ] Error budget tracking dashboard created
[ ] Burn rate alerts configured
[ ] SLO compliance dashboard visible to team
[ ] Release gating with error budgets configured
[ ] SLO review cadence established (monthly with stakeholders)
`

**Capacity & Performance:**
`
[ ] Capacity model created (requests, storage, connections, throughput)
[ ] Auto-scaling configured (HPA, KEDA, or equivalent)
[ ] Load testing completed (peak load + 50% headroom)
[ ] Performance baselines established (p50, p95, p99 latency)
[ ] Resource limits configured (CPU, memory, disk, file descriptors)
[ ] Saturation thresholds defined and monitored
[ ] Rate limiting configured (global and per-client)
[ ] Degradation strategy documented
`

**Dependencies:**
`
[ ] All upstream dependencies documented
[ ] Circuit breakers configured for each dependency
[ ] Timeout configuration for each dependency
[ ] Retry with backoff configured
[ ] Fallback strategy for each critical dependency
[ ] Dependency failure tested (integration test)
[ ] Dependency version pinned (no auto-updates)
[ ] Deprecation plan for each dependency
`

**Deployment:**
`
[ ] Deployment pipeline automated (CI/CD)
[ ] Canary deployment strategy configured
[ ] Rollback procedure documented and tested
[ ] Feature flags for major changes
[ ] Database migration strategy (backward compatible)
[ ] Configuration management (not hard-coded)
[ ] Secret management (not in code, not in config files)
[ ] Deployment verification tests (smoke tests)
`

**Reliability:**
`
[ ] Graceful degradation implemented
[ ] Health checks configured (liveness, readiness, startup)
[ ] Graceful shutdown implemented (SIGTERM handling)
[ ] Idempotency implemented for mutation endpoints
[ ] Rate limiting configured
[ ] Data backup strategy documented
[ ] Disaster recovery plan documented
[ ] RTO/RPO targets defined
[ ] Single point of failure analysis completed
`

**Security:**
`
[ ] Authentication and authorization configured
[ ] TLS/SSL configured for all endpoints
[ ] Secrets stored securely (vault, KMS, etc.)
[ ] Dependency scanning configured (vulnerabilities)
[ ] Logs do not contain sensitive data (PII, secrets)
[ ] Rate limiting to prevent abuse
[ ] Input validation implemented
`

**Documentation:**
`
[ ] Runbooks for all alerts
[ ] Architecture diagram (current state)
[ ] On-call onboarding document
[ ] Incident response procedure
[ ] Disaster recovery procedure
[ ] Dependencies and contact information
[ ] Escalation paths
[ ] Known issues and workarounds
`

## P6.3 Launch Checklist

The launch checklist is a subset of PRR for quick verification before each production launch.

`
PRE-LAUNCH CHECKLIST

### Pre-Flight (24 hours before launch)
[ ] Code freeze in effect
[ ] Final code reviewed and approved
[ ] All tests passing (unit, integration, e2e)
[ ] Load testing completed with results
[ ] Capacity verified adequate for forecasted traffic
[ ] Dependencies verified as healthy
[ ] Feature flags verified
[ ] Rollback plan documented
[ ] Monitoring verified (dashboards show data)
[ ] Alerts verified (test alert fired and received)
[ ] Runbooks confirmed up to date
[ ] On-call team notified of launch
[ ] Stakeholders notified of launch timeline

### Launch Window (day of launch)
[ ] Launch go/no-go decision made with stakeholders
[ ] Canary deployed (1% traffic initially)
[ ] Canary observed for 15 minutes — no issues
[ ] Canary increased to 5% — observed for 30 minutes
[ ] Canary increased to 25% — observed for 1 hour
[ ] Canary increased to 50% — observed for 2 hours
[ ] Canary increased to 100% — observed for 4 hours
[ ] SLO compliance verified after full rollout

### Post-Launch (24 hours after)
[ ] Post-launch review meeting scheduled
[ ] SLO compliance reviewed (no degradation)
[ ] Error budget consumption normal
[ ] Capacity utilization within expected range
[ ] No incidents related to launch
[ ] Launch documentation updated
[ ] Lessons learned documented
[ ] Rollback procedure validated (even if not needed)
`

## P6.4 Service Maturity Model Framework

The service maturity model provides a structured path from reactive operations to proactive reliability management.

**Maturity Level Definitions (Detailed):**

**Level 0: Ad Hoc**
- No SLOs defined
- No monitoring or basic ping checks
- No on-call rotation (hero-based)
- No incident management process
- No capacity planning
- No automation
- Blame culture
- Reliability depends on specific individuals

**Level 1: Foundational**
- Basic SLOs defined but not formally tracked
- Basic monitoring (CPU, memory, disk)
- Informal on-call rotation
- Escalation list exists
- Some scripts for common tasks
- Postmortems happen informally
- Basic runbooks exist

**Level 2: Defined**
- SLOs tracked monthly with dashboards
- Per-service dashboards showing golden signals
- Formal on-call rotation with defined hours
- Severity classification for incidents
- Some automated tests in CI/CD
- Capacity reviewed quarterly
- Postmortems written for major incidents
- Runbooks exist for most alerts

**Level 3: Measured**
- Error budgets active and used for decisions
- Multi-window burn rate alerting
- Full golden signals with alert thresholds
- Formal incident management with IC framework
- Capacity planning with forecasting
- > 50% of operations automated
- Toil measured and tracked
- Blameless postmortem culture
- Release gating with error budgets

**Level 4: Optimized**
- Chaos engineering program in place
- Self-healing automation for common failures
- Anomaly detection on metrics
- Predictive capacity planning
- < 25% toil ratio
- Postmortem action items drive improvement
- Service reliability dashboards for all teams
- Automated canary analysis in deployment

**Level 5: Autonomous**
- Self-managing reliability (auto-adjusting SLO)
- ML-driven anomaly detection and prediction
- Fully autonomous operations
- Continuous chaos experimentation
- Self-healing infrastructure
- < 10% toil ratio
- Business-driven reliability optimization

**Maturity Assessment Process:**
1. Service team completes self-assessment questionnaire
2. SRE reviews self-assessment with evidence
3. Joint scoring session (service team + SRE)
4. Gap analysis against target level
5. Improvement plan with milestones
6. Quarterly reassessment

## P6.5 PRR Process & Gates

The PRR process defines clear stages and gates for production acceptance.

**PRR Stages:**

`
Stage 1: Self-Assessment (1-2 weeks)
  - Service team completes PRR checklist
  - Gathers evidence for each item
  - Identifies gaps and planned remediations
  - Produces: self-assessment document

  Gate: Self-assessment submitted to SRE

Stage 2: SRE Review (1 week)
  - SRE reviews self-assessment and evidence
  - Identifies additional gaps
  - Conducts spot checks (verify monitoring, alerts, runbooks)
  - Produces: PRR findings document

  Gate: Review meeting scheduled

Stage 3: Review Meeting (2 hours)
  - Walk through PRR findings
  - Discuss gaps and remediation plans
  - Assign owners and deadlines for each gap
  - Determine readiness decision:
    - PASS — no blockers, service is production-ready
    - CONDITIONAL PASS — minor gaps with remediation plan
    - FAIL — critical gaps, service cannot enter production
  - Produces: PRR meeting notes, action items

  Gate: All action items must have owners and deadlines

Stage 4: Remediation (varies)
  - Service team closes action items
  - SRE provides guidance as needed
  - Each action item verified by SRE upon completion
  - Produces: closure evidence for each item

  Gate: All items at required level closed

Stage 5: Final Sign-off
  - SRE verifies all action items are closed
  - SRE signs PRR approval
  - Service enters production (or promoted to next tier)
  - Produces: signed PRR approval document
`

**PRR Decisions:**
| Decision | Criteria | Next Steps |
|----------|----------|------------|
| PASS | All mandatory items complete, no critical gaps | Service enters production |
| CONDITIONAL PASS | Mandatory items complete, minor gaps with plan | Service enters production, gaps tracked |
| FAIL | Critical gaps exist that threaten reliability | Service cannot enter production, must reapply |

**PRR Scoring:**
| Category | Weight | Score (1-5) | Weighted |
|----------|--------|-------------|----------|
| Monitoring | 20% | 4 | 0.8 |
| Alerting | 15% | 3 | 0.45 |
| Incident Management | 15% | 4 | 0.6 |
| SLOs & Error Budgets | 20% | 3 | 0.6 |
| Capacity | 10% | 4 | 0.4 |
| Dependencies | 10% | 3 | 0.3 |
| Deployment | 10% | 4 | 0.4 |
| Total | 100% | — | 3.55/5.0 |

## P6.6 Pre-Launch Validation

Pre-launch validation ensures the service is ready before production traffic hits.

**Validation Types:**

**Smoke Tests:**
- Verify service starts and responds on health endpoint
- Verify /healthz returns 200
- Verify /readyz returns 200
- Verify dependencies respond (DB, cache, queue)
- Verify basic request/response cycle works
- Verify logging produces output
- Verify metrics are being exported

**Integration Tests:**
- Verify end-to-end user journey
- Verify dependency failure handling
- Verify circuit breaker behavior
- Verify rate limiting
- Verify authentication/authorization
- Verify idempotency
- Verify data consistency

**Load Tests:**
- Ramp-up test: gradually increase load to find breaking point
- Peak load test: sustain peak expected traffic for 30 minutes
- Burst test: sudden spike to 2x peak traffic
- Endurance test: sustained load for 2+ hours
- Stress test: push beyond expected limits to find breaking point
- Soak test: sustained load over extended period (hours)

**Chaos Tests:**
- Kill a single instance — verify traffic reroutes
- Add network latency — verify timeouts and retries
- Fail upstream dependency — verify circuit breaker opens
- Exhaust CPU — verify auto-scaling triggers
- Simulate region failure — verify DR plan

## P6.7 Capacity Readiness Review

Capacity readiness ensures the service has adequate resources for expected traffic.

**Capacity Review Checklist:**
`
[ ] Current capacity baseline established
[ ] Traffic growth forecast created (next 6 months, 12 months)
[ ] Resource utilization trends analyzed
[ ] Peak traffic scenarios identified (Black Friday, launches)
[ ] Scaling limits identified (max instances, max connections)
[ ] Auto-scaling configured with proper thresholds
[ ] Auto-scaling tested under load
[ ] Database capacity reviewed (connections, IOPS, storage)
[ ] Cache capacity reviewed (memory, connections)
[ ] Network capacity reviewed (bandwidth, connections)
[ ] Queue capacity reviewed (throughput, retention)
[ ] External dependency capacity confirmed
[ ] Cost projection for capacity growth
[ ] Saturation thresholds defined and monitored
`

**Capacity Forecasting Model:**
`
def forecast_capacity(current_usage, growth_rate, forecast_months):
    for month in range(forecast_months):
        projected = current_usage * (1 + growth_rate) ** month
        if projected > capacity_limit * 0.8:
            trigger: alert_capacity_planning
            required_capacity = projected * 1.2  # 20% headroom
            months_remaining = forecast_months - month
            print(f"Capacity alert: {months_remaining} months to saturation")

# Example:
# current_usage: 5000 req/s
# growth_rate: 5% monthly
# capacity_limit: 10000 req/s
# Result: saturation at month 15, alert at month 12
`

---

# P7: On-Call & Incident Management

## P7.1 On-Call Shift Design

On-call shifts must balance coverage with sustainability. Poorly designed rotations lead to burnout and turnover.

**Shift Models:**

| Model | Duration | Pros | Cons | Best For |
|-------|----------|------|------|----------|
| Primary/Secondary | 1 week | Clear ownership, continuity during week | Long shift, weekend fatigue | Teams of 5-7 |
| Follow-the-Sun | 8-12 hours | Daylight hours only, regional coverage | Requires global team | Global teams |
| Pooled | 24 hours | Short duration, high availability | Frequent handoffs | Large teams |
| Automated Escalation | Variable | Lowest toil, machine-driven | Requires mature alerting | Autonomous operations |

**Primary/Secondary Rotation Design:**
`
Rotation: 1 week primary, 1 week secondary, 2 weeks off
Team size: 6 (2 on-call at any time, 4 project time)

Primary responsibilities:
  - Respond to pages within SLA (5 min for critical)
  - Triage and mitigate incidents
  - Provide status updates on active incidents
  - Hand off to next primary at end of shift

Secondary responsibilities:
  - Backup responder if primary does not acknowledge
  - Handle non-urgent alerts (warnings)
  - Provide support for active incidents
  - Lead follow-up on incident action items

Off-week responsibilities:
  - No on-call duties
  - Focus on project work (automation, SLO design, capacity)
  - Attend postmortem reviews
`

**Shift Handoff Protocol:**
`
HANDOFF PROTOCOL

### At Start of Shift
1. Review current SLO compliance for all services
2. Review active incidents and their status
3. Review ongoing changes/deployments
4. Test alert delivery (page yourself)
5. Review runbooks for recently added alerts
6. Confirm secondary responder is available
7. Update on-call dashboard

### During Shift
1. Log all actions taken (what, why, result)
2. Track time spent on each incident
3. Document workarounds for known issues
4. Keep incident channel updated

### At End of Shift
1. Summarize shift activity: incidents, pages, changes
2. Document open incidents and next steps
3. Identify any patterns noticed during shift
4. Report toil hours for the week
5. Update handoff document for next person
6. Debrief with secondary on notable events
`

**On-Call Schedule:**
`
┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Week    │ Mon      │ Tue-Wed  │ Thu-Fri  │ Sat-Sun  │ Notes    │
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Week 1  │ Alice P  │ Alice P  │ Alice P  │ Alice P  │          │
│         │ Bob S    │ Bob S    │ Bob S    │ Bob S    │          │
│ Week 2  │ Bob P    │ Bob P    │ Bob P    │ Bob P    │          │
│         │ Carol S  │ Carol S  │ Carol S  │ Carol S  │          │
│ Week 3  │ Carol P  │ Carol P  │ Carol P  │ Carol P  │          │
│         │ Dave S   │ Dave S   │ Dave S   │ Dave S   │          │
│ Week 4  │ Dave P   │ Dave P   │ Dave P   │ Dave P   │          │
│         │ Eve S    │ Eve S    │ Eve S    │ Eve S    │          │
│ Week 5  │ Eve P    │ Eve P    │ Eve P    │ Eve P    │          │
│         │ Frank S  │ Frank S  │ Frank S  │ Frank S  │          │
│ Week 6  │ Frank P  │ Frank P  │ Frank P  │ Frank P  │          │
│         │ Alice S  │ Alice S  │ Alice S  │ Alice S  │          │
└─────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
P = Primary, S = Secondary
Ratio: 1 week on-call (primary or secondary) per 3 weeks
On-call load: 33% of time → acceptable (< 40%)
`

**On-Call Compensation:**
- Base pay includes reasonable on-call (up to 1 week/month)
- Additional compensation for peak periods (holidays, launches)
- Comp time for nights/weekend pages
- On-call burden tracked per engineer: no one exceeds 25% of shifts
- Shift swap allowed with 48-hour notice

## P7.2 Escalation Policies

Escalation policies ensure incidents are handled at the right level of authority.

**Escalation Levels:**

`
Level 0: On-call Engineer (Primary)
  Scope: Triage, diagnose, mitigate common incidents
  Authority: Access to service, monitoring, runbooks
  Escalates to: Secondary on-call

Level 1: On-call Engineer (Secondary)
  Scope: Support primary, handle complex incidents
  Authority: Same as primary + additional tooling access
  Escalates to: SRE Team Lead

Level 2: SRE Team Lead
  Scope: Coordinate multi-service incidents
  Authority: Cross-service decisions, resource allocation
  Escalates to: Engineering Manager

Level 3: Engineering Manager
  Scope: Organizational decisions, communication
  Authority: Freeze deployments, redirect teams
  Escalates to: Director of Engineering

Level 4: Director of Engineering
  Scope: Strategic decisions, executive communication
  Authority: Customer communication, SLA exception, budget decisions
  Escalates to: VP Engineering / CTO
`

**Escalation Triggers:**
| Condition | Escalate To |
|-----------|-------------|
| Primary does not acknowledge page within 5 min | Secondary |
| Incident not mitigated within 30 min | SRE Team Lead |
| Incident is multi-service | SRE Team Lead |
| Incident requires product decisions | Product Manager |
| Customer communication needed | Engineering Manager |
| Potential SLA violation | Engineering Manager |
| Revenue impact > /hr | Director of Engineering |
| Legal/regulatory impact | VP Engineering |
| Media/social media attention | CTO / PR |

**Escalation Timeouts:**
`
PAGE → Primary: 5 min to acknowledge
Primary → Secondary: 5 min after primary timeout
Secondary → Team Lead: 10 min after secondary timeout
Team Lead → Engineering Manager: 15 min after TL timeout
Engineering Manager → Director: 30 min after EM timeout
`

## P7.3 Incident Leadership

Incident leadership follows the Incident Command System (ICS) adapted for SRE.

**Incident Roles:**

| Role | Responsibility | Assigned By | 
|------|---------------|-------------|
| Incident Commander (IC) | Overall coordination, decisions, communication | First qualified responder |
| Operations Lead (OL) | Technical mitigation, diagnosis, repair | IC |
| Communications Lead (CL) | Status updates, stakeholder communication | IC |
| Scribe | Timeline recording, action item tracking | IC |
| Subject Matter Expert (SME) | Domain expertise for specific service | IC |

**Incident Commander Responsibilities:**
- Declare incident severity
- Assign roles (OL, CL, Scribe, SMEs)
- Make go/no-go decisions (rollback, scale up, fail over)
- Ensure communication cadence (every 30 min minimum)
- Track mitigation progress
- Decide when to declare resolution
- Ensure postmortem is initiated

**Incident Commander Selection:**
- Must have completed IC training
- Cannot be SME for the failing service (conflict of interest)
- Must be senior enough to make operational decisions
- Rotates per incident (same person should not IC every incident)
- IC can hand off to another qualified person after 2 hours

**Incident Command Steps:**
`
1. DECLARE: Set severity, announce in incident channel
2. ASSIGN: Assign roles (OL, CL, Scribe, SMEs)
3. TRIAGE: Understand impact, guide initial mitigation
4. COMMUNICATE: Status update every 30 min
5. COORDINATE: Track mitigation actions, avoid duplication
6. DECIDE: Make go/no-go decisions (rollback, failover)
7. DECLARE RESOLUTION: Confirm mitigation, verify SLOs
8. HANDOFF: Transfer to post-incident activities
`

## P7.4 Incident Communication

Clear communication during incidents reduces confusion and builds trust.

**Communication Cadence:**
`
Incident Start:
  - Incident channel created with auto-generated name
  - Initial update: severity, services affected, start time
  - Stakeholder notification based on severity

Every 30 minutes:
  - Status update in incident channel
  - What we know, what we are doing, what we need
  - ETA for next update

On Mitigation:
  - Announce mitigation in incident channel
  - Verify SLO compliance
  - Announce resolution

Post-Incident:
  - Summary in engineering-wide channel
  - Postmortem tracker created
  - Action item tracking initiated
`

**Status Update Template:**
`
## Incident Update #[N]

Incident ID: INC-YYYY-MM-DD-NNN
Severity: SEV[0-3]
Time: YYYY-MM-DD HH:MM UTC

### Current Status
[ Mitigating | Monitoring | Resolved ]

### Impact
- Services affected: [list]
- Users affected: [count or %]
- Duration so far: [HH:MM]

### What We Know
[Brief description of current understanding]

### What We Are Doing
1. [Action item 1 with owner]
2. [Action item 2 with owner]
3. [Action item 3 with owner]

### What We Need
[Resource requests, additional support needed]

### Next Update
[Time of next update or "Next update on mitigation"]
`

**Stakeholder Communication Levels:**
| Audience | Level of Detail | Channel | Frequency |
|----------|----------------|---------|-----------|
| Incident team | Full technical detail | Incident channel | Continuous |
| Engineering team | Technical summary | Engineering channel | Every 30 min |
| Product managers | Business impact | PM email/chat | Every 60 min |
| Executives | Business impact + ETA | Email/phone | On escalation only |
| Customers (if applicable) | Service status | Status page | Per policy |

## P7.5 Handoff Protocols

Structured handoffs ensure continuity when shifts change or incident command transfers.

**Shift Handoff Template:**
`
## SHIFT HANDOFF: [Name] → [Name]

Shift: YYYY-MM-DD HH:MM → YYYY-MM-DD HH:MM

### Active Incidents
| ID | Severity | Status | Summary | Owner |
|----|----------|--------|---------|-------|
| INC-001 | SEV2 | Monitoring | Latency spike resolved, monitoring | [name] |

### Recent Pages (last 24 hours)
| Time | Alert | Action Taken | Follow-up |
|------|-------|-------------|-----------|
| 03:15 | CPU high | Scaled up instances | None |
| 07:30 | Error rate | Rolled back deploy | Postmortem needed |

### Ongoing Changes
| Change | Status | Expected Completion | Rollback Ready? |
|--------|--------|-------------------|-----------------|
| DB migration | In progress (75%) | 2 hours | Yes |

### Known Issues
- [Issue 1] Dashboard shows incorrect cache hit ratio
- [Issue 2] Runbook for DB failover is outdated

### SLO Watch
- checkout-api: 99.92% (within budget)
- payment-gateway: 99.95% (warning at 45% budget)
- cart-service: 99.98% (healthy)

### Notes
- [Notable events, pattern observations, suggestions]
`

**Incident Commander Handoff:**
`
## IC HANDOFF: [Name] → [Name]

Current Severity: SEV1
Duration: 02:15

### Incident State
- Root cause identified? [Yes/No/In progress]
- Mitigation in progress? [Yes/No]
- Communication cadence established? [Yes/No]

### Open Decisions
1. [Decision needed, options, recommendation]

### Pending Actions
1. [Action, owner, status]

### Communication
- Last status update: [time]
- Next update due: [time]
- Stakeholders notified: [list]

### Notes
- [Any context, gotchas, personalities involved]
`

## P7.6 Burnout Prevention

On-call burnout is the #1 cause of SRE turnover. Prevention is a management responsibility.

**Burnout Risk Factors:**
- More than 1 week of on-call per month per engineer
- Page frequency > 5 pages per shift (incl. false positives)
- Mean time to resolve > 1 hour per page
- Toil ratio > 50%
- No off-duty period after incident response
- Insufficient team size for rotation
- Blame culture (postmortems used to assign blame)
- No learning from incidents (repeated same types of incidents)
- Inadequate runbooks (each page requires detective work)
- Insufficient automation (manual steps for common scenarios)

**Burnout Prevention Measures:**

`
1. On-call caps: maximum 1 week per month per engineer
2. Page load monitoring: track pages per shift, alert if > 5
3. Post-incident recovery: 24 hours no-pager after SEV0/SEV1
4. Time-off enforcement: on-call must have full time-off rotation
5. Toil reduction: dedicate 50% of sprint to automation
6. Runbook quality: every page must have a runbook (target: < 5 min to begin mitigation)
7. False positive reduction: weekly review, tune thresholds
8. Mental health support: on-call counseling benefit, manager check-ins
9. Rotation design: no consecutive on-call weeks
10. On-call training: 3-6 month ramp-up before solo on-call
`

**Burnout Monitoring:**
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Pages per shift per person | > 3 | > 5 | Reduce false positives, redistribute load |
| On-call ratio per person | > 30% | > 40% | Hire more SREs, reduce service portfolio |
| Toil ratio | > 50% | > 60% | Freeze new services, automation sprint |
| Time-to-mitigate | > 30 min avg | > 60 min avg | Improve runbooks, reduce system complexity |
| Post-incident recovery skip rate | > 20% | > 40% | Enforce recovery period, manager intervention |
| SRE turnover rate | > 15%/year | > 25%/year | Culture audit, compensation review |

**On-Call Satisfaction Survey (quarterly):**
`
1. I feel my on-call load is manageable (1-5)
2. I have enough time to recover after incidents (1-5)
3. The page volume is reasonable (1-5)
4. I have adequate runbooks and tools (1-5)
5. I feel supported by my team during incidents (1-5)
6. Post-incident follow-up leads to real improvements (1-5)
7. I am learning and growing in my SRE role (1-5)
8. I can balance on-call with project work (1-5)
Target score: > 4.0 in all categories
Action required: < 3.5 in any category
`

## P7.7 Postmortem Excellence

Beyond the basics, postmortem excellence means action items actually close and reliability improves.

**Postmortem Maturity:**
| Level | Characteristics | Action Item Closure Rate | Improvement |
|-------|----------------|------------------------|-------------|
| 0 | No postmortems | 0% | — |
| 1 | Postmortems written but not tracked | < 30% | Low |
| 2 | Postmortems tracked, some action items closed | 30-60% | Medium |
| 3 | Postmortems drive change, > 60% closure | 60-80% | High |
| 4 | Postmortems prevent recurrence, > 80% closure | 80-95% | Very high |
| 5 | Postmortems lead to systemic improvements | > 95% | Transformative |

**Action Item Closure Improvement:**
`
Root causes of low closure rates:
1. Action items are not specific enough
2. Action items have no single owner
3. Action items have no deadline
4. Action items require effort > available capacity
5. Action items are blocked by dependencies
6. Postmortem review is not scheduled
7. No accountability for closing items
8. Items are not tracked in team backlog

Improvements:
1. Use SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound
2. Each item has exactly one owner (not a team)
3. Each item has a date (not ongoing or indefinite)
4. Items are sized to fit in a sprint (< 1 week of effort)
5. Items are tracked in sprint backlog with weekly review
6. Postmortem review meeting includes action item review
7. Owner reports status at weekly standup
8. Quarterly postmortem effectiveness review
`

**Postmortem Action Item Quality:**
`
Good action item:
"Add integration test for null upstream response in handleRequest()
Owner: [name]
Due: YYYY-MM-DD
Verification: CI passes with new test case"

Bad action item:
"Improve testing"
Owner: team
Due: ongoing
Verification: none"
`

---
## P8.5 Example: Circuit Breaker Configuration for Payment Gateway

**Scenario:** The checkout service depends on an external payment gateway. Configure a circuit breaker to handle gateway failures.

**Dependency Analysis:**
```
Payment Gateway characteristics:
- p50 latency: 200ms
- p99 latency: 1500ms
- Historical availability: 99.5%
- Failure modes: timeout, 500, 503, connection refused
- Rate limit: 500 req/s
- Cost per request: $0.02 (so retries have cost)
```

**Circuit Breaker Configuration:**
```
circuit_breaker:
  name: payment_gateway
  type: sliding_window
  window_size: 60s
  failure_threshold: 5
  failure_rate_threshold: 0.5
  sleep_window: 30s
  half_open_max_requests: 3
  half_open_success_threshold: 2
  record_exceptions:
    - SocketTimeoutException
    - ConnectException
    - GatewayTimeoutException
    - ServiceUnavailableException
```

**Monitoring Dashboard:**
```
State: CLOSED
Failure Rate (60s): 2%
Request Volume: 450 req/s
Error Rate: 0.5%
P99 Latency: 800ms
State Changes (24h): 3
Total Open Duration (24h): 2m 14s
Avg Recovery Time: 45s
Fallback Usage: 0.1% of requests
```

## P8.6 Example: Capacity Planning Forecast for Launch

**Scenario:** A new product launch is expected to increase traffic by 5x on the checkout service. Forecast capacity requirements.

**Current Baseline:**
```
Current traffic: 10,000 req/s (checkout API)
Current instances: 20 (500 req/s per instance)
Current CPU: 45% average, 75% peak
Current memory: 60% average, 80% peak
Current database connections: 200 of 500 max
Current cache (Redis): 40% of 10GB
```

**Forecast Model:**
```
def forecast_capacity(current, launch_factor, safety_margin):
    baseline_req_per_sec = 10000
    baseline_instances = 20
    current_per_instance = baseline_req_per_sec / baseline_instances

    required_at_launch = baseline_req_per_sec * launch_factor
    estimated_instances = required_at_launch / current_per_instance
    safe_instances = estimated_instances * safety_margin

    expected_cpu_during_launch = 0.75 * launch_factor
    if expected_cpu_during_launch > 0.80:
        required_instances_cpu = baseline_instances * launch_factor * (expected_cpu_during_launch / 0.70)
        final_instances = max(safe_instances, required_instances_cpu)
    else:
        final_instances = safe_instances

    expected_db_conns = 200 * launch_factor
    db_upgrade_needed = expected_db_conns > 400

    expected_cache_usage = 4.0 * launch_factor
    cache_upgrade_needed = expected_cache_usage > 8.0

    return {
        "instances": int(final_instances),
        "db_conns_max": int(expected_db_conns * 1.5),
        "cache_gb": int(expected_cache_usage * 1.5)
    }
```

**Capacity Plan Output:**
```
| Resource | Current | Required | With Margin | Action |
|----------|---------|----------|-------------|--------|
| Instances | 20 | 100 | 150 | Provision |
| DB connections | 200 | 1000 | 1500 | Upgrade max |
| Cache (Redis) | 4 GB | 20 GB | 30 GB | Upgrade |
| Network | 1 Gbps | 5 Gbps | 7.5 Gbps | Upgrade |

Timeline:
- T-3w: Network upgrade, Redis upgrade
- T-2w: Instance provisioning, DB connection increase
- T-1w: Load test at 50K req/s, chaos test
- T-3d: Final capacity sign-off
```

## P8.7 Example: Postmortem Write-Up (Production Grade)

**Scenario:** A SEV1 incident occurred where the checkout service was unavailable for 34 minutes due to a database connection pool exhaustion. Write the postmortem.

```
# Postmortem: Checkout Service Database Connection Pool Exhaustion

## Metadata
- Incident ID: INC-2026-05-15-001
- Date: 2026-05-15
- Duration: 10:42 UTC → 11:16 UTC (34 minutes)
- Severity: SEV1 (initial) → SEV1 (final)
- Services affected: checkout-api, cart-service (downstream)
- Detection method: Burn rate alert (availability SLO)
- Reported by: Monitoring system
- Author: [Name]

## Summary
The checkout service became unavailable for 34 minutes when the database connection pool was exhausted during a traffic surge from a marketing campaign. The database connection pool max was set to 200, but the sustained traffic of 15,000 req/s exceeded the available connections. The service failed health checks and was removed from the load balancer.

## Impact
- Users affected: 100% of checkout users (34 minutes)
- Revenue impact: ~$85,000 (estimated at $150K/hr × 0.57 hr)
- Data loss: None (in-flight requests failed, no committed data lost)
- Downstream services affected: cart-service (degraded), notification (delayed)
- Failed requests: ~510,000 (15,000 req/s × 34 min × 60s/min)

## Timeline (All times UTC)
- T-30d: DB connection pool max set to 200 (during initial deployment)
- T-24h: Marketing campaign began, traffic increased from 10K to 12K req/s (no alert)
- T-6h: Traffic increased to 14K req/s (no alert configured)
- T-10:42: Database connections exhausted (pool reached 200)
- T-10:43: New connections failed, error rate spiked to 100%
- T-10:44: Burn rate alert fired (availability SLO: burn rate 20+)
- T-10:45: On-call acknowledged page
- T-10:48: On-call identified database connection errors in logs
- T-10:52: Incident Commander assigned (SEV1 declared)
- T-10:55: Root cause identified: connection pool exhaustion
- T-11:04: Database connection pool max increased to 500 (hot config change)
- T-11:06: Connections began recovering
- T-11:12: All connections established, service responding normally
- T-11:14: Health checks passing, load balancer restored traffic
- T-11:16: Verified all SLOs back to compliance, incident resolved

## Root Cause (5 Whys)
1. Why did checkout fail? → Database connection pool exhausted
2. Why was pool exhausted? → Connection pool max was 200 but traffic required 350+
3. Why was customer_max set to 200? → Initial sizing based on 10K req/s estimate
4. Why was pool not scaled with traffic? → No monitoring on connection pool saturation
5. Why was there no monitoring? → Connection pool metrics not included in golden signals

## Contributory Factors
- Monitoring gap: DB connection pool saturation not monitored or alerted
- Capacity planning gap: Connection pool sizing not reviewed post-deployment
- Testing gap: Load testing did not include connection pool limits
- Documentation gap: DB connection pool limits not documented in runbook
- Process gap: Connection pool limits not in PRR checklist

## What Went Well
- Burn rate alert fired within 1 minute of incident start
- On-call responded in 1 minute (within SLA)
- IC was assigned within 8 minutes
- Config change was well-documented and took 9 minutes to execute
- Communication was regular on incident channel (updates every 10 min)

## What Went Wrong
- No alert existed for DB connection pool saturation
- On-call spent 7 minutes diagnosing the problem (no runbook for this scenario)
- Database connection pool limit was not documented in service catalog
- Traffic increase from marketing campaign was not communicated to SRE
- Connection pool misconfiguration existed for 30 days

## Lessons Learned
- Database connection pool saturation must have monitoring and alerting
- Connection pool size must be reviewed as part of capacity planning
- Marketing campaign traffic increases must trigger SRE notification
- PRR checklist must include connection pool limits for stateful services
- Capacity load testing must verify connection pool adequacy

## Action Items
| # | Action | Owner | Due | Verification |
|---|--------|-------|-----|-------------|
| 1 | Add DB connection pool saturation alert (usage > 75% for 5 min) | [name] | 2026-05-22 | Alert configured and tested |
| 2 | Add connection pool metrics to service dashboard | [name] | 2026-05-18 | Dashboard updated |
| 3 | Implement auto-scaling for DB connection pool | [name] | 2026-06-15 | Tested in staging |
| 4 | Add connection pool limits to PRR checklist | [name] | 2026-05-22 | PRR checklist updated |
| 5 | Notify SRE of marketing campaigns 48h in advance | [name] | 2026-05-20 | Process documented |
| 6 | Load test to verify connection pool adequacy at 2x peak | [name] | 2026-06-01 | Test report approved |
| 7 | Create runbook for connection pool exhaustion | [name] | 2026-05-22 | Runbook peer reviewed |

## Supporting Evidence
- [Link to dashboard showing connection pool exhaustion]
- [Link to error rate spike chart]
- [Link to deployment record for connection pool config]
- [Link to marketing campaign announcement]
- [Link to load test results from initial deployment]
```

## P8.8 Example: SLO Compliance Dashboard Design

**Scenario:** Design a comprehensive SLO compliance dashboard for the checkout service.

**Dashboard Layout:**
```
Row 1: Overall Compliance (4 panels)
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ SLO Compliance (30d)  │ │ Error Budget Remaining│ │ Current Burn Rate    │ │ Incident Status       │
│ 99.92% ✓             │ │ 87% ████████░░        │ │ 0.3 (1h avg)         │ │ 0 active incidents    │
│ Target: 99.9%        │ │ Budget used: 13%       │ │ 0.4 (6h avg)         │ │ Last incident: 2d ago │
│                      │ │                      │ │ 0.5 (24h avg)        │ │                      │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘

Row 2: SLI Time Series (3 panels)
┌──────────────────────────────────┐ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ Availability (1h rolling)        │ │ Latency p99 (5m rolling)          │ │ Error Rate (1m rolling)          │
│ 99.95% ████████████████████████  │ │ 850ms ████████████████████████   │ │ 0.05% ████████████████████████   │
│ ╱╲    ╱╲    ╱╲                   │ │   ╱╲  ╱╲   ╱╲                    │ │    ╱╲     ╱╲                    │
│╱  ╲  ╱  ╲  ╱  ╲                 │ │ ╱╱  ╲╱  ╲╱  ╲                  │ │  ╱╱  ╲   ╱  ╲                  │
│    ╲╱    ╲╱    ╲╲               │ │╱        ╲                        │ │╱      ╲╱    ╲╱                 │
│ ─────────────────────────────    │ │ ─────────────────────────────    │ │ ─────────────────────────────    │
│ 05:00    06:00    07:00          │ │ 05:00    06:00    07:00          │ │ 05:00    06:00    07:00          │
└──────────────────────────────────┘ └──────────────────────────────────┘ └──────────────────────────────────┘

Row 3: Burn Rate Analysis (2 panels)
┌────────────────────────────────────────────────────┐ ┌────────────────────────────────────────────────────┐
│ Burn Rate Multi-window                              │ │ Budget Consumption by Category                      │
│ Rate: 1.0│2.0│3.0│4.0│...│14.0│                      │ ├───────────────────────────────────────────────────┤
│ 1h:   ████░░░░░░░ 0.4                                │ │ Incidents: 45%                                      │
│ 6h:   ████████░░░ 0.8                                │ │ Deployments: 15%                                   │
│ 24h:  ███████████ 1.1  ⚠                                │ │ Maintenance: 10%                                   │
│                                                      │ │ Known issues: 20%                                  │
│ Alert thresholds:                                    │ │ Other: 10%                                         │
│ Page: > 14 (5m), > 2.5 (30m)                         │ └────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘

Row 4: Multi-Service Composite (1 panel)
┌────────────────────────────────────────────────────────────────────────────┐
│ Composite Checkout SLO: 99.74% (Target: 99.9%)                            │
│ Service          SLO     Budget   Status    ╱╲ Chart                      │
│ checkout-api     99.9%   87%      ✓        │  ╱  ╲                        │
│ auth-service     99.99%  95%      ✓        │ ╱    ╲                       │
│ cart-service     99.95%  72%      ✓        │╱      ╲                      │
│ payment-gateway  99.99%  45%      ⚠        │        ╲                     │
│ inventory-svc    99.95%  12%      🔴       │         ╲                    │
│ notification     99.9%   98%      ✓        │──────────────────────────    │
│                                           │  ─── Current ─── Target       │
└────────────────────────────────────────────────────────────────────────────┘
```

**Dashboard Data Sources:**
```
Metrics source: Prometheus / Datadog / Grafana
SLI data: Application middleware (per-request metrics)
Burn rate: Calculated from SLI metrics using recording rules
Budget: Calculated from SLI metrics over 30d window
Incidents: PagerDuty / OpsGenie API integration
Deployments: CI/CD pipeline webhook
```

## P8.9 Example: Chaos Experiment Design

**Scenario:** Design a chaos engineering experiment to validate the circuit breaker behavior for the payment gateway dependency.

```
## Chaos Experiment: Payment Gateway Circuit Breaker Validation

### Hypothesis
When the payment gateway returns 503 errors for 30 seconds,
the circuit breaker will open within 5 failures, and the service
will degrade gracefully by returning cached payment tokens.
After the gateway recovers, the circuit breaker will close within
2 successful half-open requests, and full functionality will resume.

### Steady State
- Checkout success rate > 99.9%
- Checkout p99 latency < 2000ms
- Payment gateway circuit breaker state: CLOSED
- Payment gateway failure rate < 1%
- Cache hit ratio > 80%

### Experiment Design
- Type: Upstream dependency failure
- Target: Payment gateway (external API endpoint)
- Failure mode: HTTP 503 Service Unavailable
- Blast radius: 10% of checkout instances
- Duration: 30 seconds of failures, then 60 seconds recovery
- Traffic injection: Use production traffic (real users)

### Expected Outcome
First 5 requests (per instance): Fail with 503 → circuit breaker opens
Subsequent requests: Fallback to cached payment token
After recovery: Half-open allows 3 test requests
2 successful test requests → circuit closes
All subsequent requests: Normal flow resumes

### Metrics to Observe
- Circuit breaker state (CLOSED → OPEN → HALF_OPEN → CLOSED)
- Checkout error rate (should spike briefly, then recover)
- Fallback usage rate (should increase during experiment)
- Checkout latency (should stay within SLO during fallback)
- Cache hit ratio (should increase as fallback uses cache)
- Error budget consumption (should not exceed 0.1% during experiment)

### Abort Conditions
- Error rate > 5% for more than 2 minutes (should recover quickly)
- Checkout availability below 99% for any 1-minute window
- Any real customer payment failure (not simulation)
- Error budget consumption > 1% of monthly budget
- Circuit breaker fails to recover after 5 minutes

### Rollback Plan
1. Stop failure injection immediately
2. Verify gateway connectivity is restored
3. Monitor circuit breaker state → should close within 60s
4. Verify error rate returns to baseline
5. If circuit does not close: restart affected instances
6. If fallback is also failing: disable fallback, allow requests to fail through to show error page

### Pre-requisites
- [ ] Dashboard that shows circuit breaker state in real-time
- [ ] Alert on circuit breaker OPEN state > 5 minutes
- [ ] Cache population verified (payment tokens cached)
- [ ] Stakeholder notification sent (SRE, Product, Support)
- [ ] Rollback script tested
- [ ] Monitoring verified (all metrics visible)
- [ ] Change advisory board approved (if required)

### Results
- Steady state maintained? [ ]
- Circuit breaker opened as expected? [ ]
- Fallback worked for cached tokens? [ ]
- Recovery completed within expected time? [ ]
- Budget consumption within limits? [ ]
- Action items generated? [ ]
```

## P8.10 Example: Production Readiness Review Output

**Scenario:** A new search service is being launched. The PRR found several gaps. Document the output.

```
## Production Readiness Review: Search Service v1.0

### Service Information
- Service: search-api
- Tier: 1 (customer-facing)
- Owner: Search Team
- Dependencies: Elasticsearch cluster, User service (auth), Analytics service (logging)
- Expected traffic: 50,000 req/s peak

### Review Participants
- Search Team Lead: [Name]
- SRE Representative: [Name]
- Infrastructure Lead: [Name]
- QA Lead: [Name]
- Product Manager: [Name]

### Decision: CONDITIONAL PASS
Conditions (3 items must be resolved within 14 days):
1. Configure burn rate alerting for latency SLO
2. Implement circuit breaker for Elasticsearch client
3. Create DR runbook for Elasticsearch cluster failure

### Scorecard

| Category | Score (1-5) | Notes |
|----------|-------------|-------|
| Monitoring | 4 | All golden signals present, dashboards created |
| Alerting | 3 | Basic alerts configured, burn rate alerts MISSING |
| Incident Mgmt | 4 | Severity defined, runbooks created, on-call assigned |
| SLOs | 5 | SLOs defined with error budgets, dashboard live |
| Capacity | 4 | Load tested at 75K req/s, auto-scaling configured |
| Dependencies | 3 | Elasticsearch circuit breaker MISSING |
| Deployment | 4 | CI/CD pipeline, canary deployment, feature flags |
| Documentation | 3 | DR runbook MISSING, architecture diagram outdated |
| Testing | 4 | Unit, integration, load, chaos tests completed |
| Security | 5 | Auth, TLS, rate limiting, secrets management all verified |
| Total | 3.9/5.0 | CONDITIONAL PASS |

### Detailed Findings

PASS Items:
- [✓] Monitoring: RED metrics exported for all endpoints
- [✓] Alerting: Basic alerts (error rate, latency, CPU, memory)
- [✓] SLOs: Availability 99.95%, Latency p99 < 500ms, Error rate < 0.1%
- [✓] Error budget: Configured with 30d window, 87% remaining
- [✓] Deployment: Automated pipeline with canary stages
- [✓] Testing: Load test at 75K req/s (150% of expected peak)
- [✓] Capacity: Auto-scaling configured (HPA, 3-20 pods)
- [✓] Health checks: /healthz and /readyz configured
- [✓] Graceful shutdown: SIGTERM handling verified
- [✓] Rate limiting: Global (100K req/s) and per-user (1000 req/min)
- [✓] Auth: JWT validation on all endpoints
- [✓] TLS: HTTPS enforced, certificate auto-rotation
- [✓] Secrets: Vault integration, no secrets in code
- [✓] Postmortem: Template created, process documented

FAIL Items (require remediation):
- [✗] Burn rate alerting: Only simple threshold alerts exist
  - Risk: SLO violation could go undetected for hours
  - Remediation: Configure multi-window burn rate alerts (14/5min + 2.5/30min)
  - Deadline: 7 days

- [✗] Elasticsearch circuit breaker: No circuit breaker for ES client
  - Risk: Cascading failure if ES cluster is degraded
  - Remediation: Implement circuit breaker with 5-failure threshold, 30s timeout
  - Deadline: 14 days

- [✗] DR runbook: No runbook for Elasticsearch cluster failure
  - Risk: On-call has no guidance for ES failure scenario
  - Remediation: Write DR runbook with failover procedure
  - Deadline: 14 days

### Recommendations (Non-blocking)
- Consider adding distributed tracing for search request paths
- Evaluate Elasticsearch cross-cluster replication for DR
- Implement autocomplete cache for hot queries (target: 80% hit rate)
- Schedule weekly chaos experiment for ES failure starting month 2

### Sign-off
- Search Team Lead: [Signed]
- SRE Representative: [Signed] (conditional)
- Date: 2026-05-20
- Next Review: 2026-08-20 (quarterly)
```

## P8.11 Example: Disaster Recovery Plan & RTO Validation

**Scenario:** Design a DR plan for a Tier 1 e-commerce platform and validate RTO/RPO targets.

```
## Disaster Recovery Plan: E-Commerce Platform

### Service Tier Classification
| Service | Tier | RTO | RPO | DR Strategy |
|---------|------|-----|-----|-------------|
| Checkout API | 1 | < 1 hour | < 5 min | Warm standby |
| Product Catalog | 1 | < 1 hour | < 5 min | Warm standby |
| User Accounts | 1 | < 1 hour | < 1 min | Active-active |
| Search | 2 | < 4 hours | < 15 min | Pilot light |
| Analytics | 3 | < 24 hours | < 1 hour | Backup & restore |
| Admin Dashboard | 3 | < 24 hours | < 1 hour | Backup & restore |

### DR Architecture (Checkout API)

Primary Region: us-east-1
DR Region: us-west-2
DR Strategy: Warm standby (2 replicas pre-provisioned)

Components:
┌─────────────────────────────────────────────────────┐
│ Primary (us-east-1)           DR (us-west-2)         │
│ ┌──────────────┐             ┌──────────────┐        │
│ │ Route53      │────────────→│ Route53      │        │
│ │ (Active)     │             │ (Passive)    │        │
│ └──────┬───────┘             └──────┬───────┘        │
│        │                           │                │
│ ┌──────▼───────┐             ┌──────▼───────┐        │
│ │ ALB          │             │ ALB          │        │
│ └──────┬───────┘             └──────┬───────┘        │
│        │                           │                │
│ ┌──────▼───────┐             ┌──────▼───────┐        │
│ │ Checkout     │             │ Checkout     │        │
│ │ Service (x10)│             │ Service (x2) │        │
│ └──────┬───────┘             └──────┬───────┘        │
│        │                           │                │
│ ┌──────▼───────┐             ┌──────▼───────┐        │
│ │ RDS Primary  │────────────→│ RDS Replica  │────┐  │
│ │ (PostgreSQL) │  async repl │ (PostgreSQL) │    │  │
│ └──────────────┘             └──────────────┘    │  │
│ ┌──────────────┐             ┌──────────────┐    │  │
│ │ ElastiCache  │────────────→│ ElastiCache  │────┘  │
│ │ (Primary)    │  cross-reg  │ (Replica)    │       │
│ └──────────────┘             └──────────────┘       │
└─────────────────────────────────────────────────────┘

### Failover Procedure

Step 1: DETECT (0-2 min)
- Monitor: SLO compliance drops below 99% for 5 consecutive minutes
- Monitor: All instances in primary region unreachable for 2 minutes
- Alert: SEV0 page to on-call

Step 2: DECIDE (1-5 min)
- Incident Commander confirms primary region failure
- Decision: Failover to DR region
- Notification: Stakeholders notified (exec, product, support)

Step 3: SCALE UP (5-15 min)
- Increase DR checkout service from 2 to 10 instances
- Warm up caches (pre-warming script)
- Scale DR database if needed

Step 4: FAILOVER (5-10 min)
- Promote RDS replica to primary (if primary is truly lost)
- Update DNS (Route53) to point to DR region ALB
- Wait for DNS propagation (60s TTL → 60s propagation)
- Verify DR region health checks pass

Step 5: VERIFY (1-5 min)
- Verify SLO compliance in DR region
- Verify downstream services are connected
- Verify all monitoring is reporting from DR region
- Announce failover complete

Total RTO target: < 60 minutes

### Failback Procedure

Step 1: REPAIR (varies)
- Restore primary region infrastructure
- Synchronize data from DR to primary
- Verify data consistency

Step 2: PREPARE (30 min)
- Pre-warm primary region caches
- Scale primary region to normal level

Step 3: FAILBACK (10 min)
- Promote primary database back to primary
- Update DNS to point to primary region
- Verify health in primary region

Step 4: CLEANUP (1 hour)
- Scale down DR region to warm standby again
- Verify async replication is working from primary → DR
- Document failover/failback lessons learned

### DR Test Results (Last Test: 2026-04-15)

| Criterion | Target | Actual | Pass/Fail |
|-----------|--------|--------|-----------|
| RTO (checkout API) | < 60 min | 23 min | PASS |
| RPO (checkout API) | < 5 min | 2 min | PASS |
| DNS propagation | < 5 min | 90 sec | PASS |
| Data integrity | 100% | 100% | PASS |
| Monitoring in DR | Functional | Functional | PASS |
| Failback RTO | < 30 min | 18 min | PASS |
| Failback data loss | 0 | 0 | PASS |

### DR Test Action Items (from last test)
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Automate DNS failover (eliminate manual step) | [name] | 2026-06-01 | In progress |
| 2 | Improve cache pre-warming script | [name] | 2026-05-30 | Closed |
| 3 | Add DR region availability to dashboard | [name] | 2026-05-15 | Closed |
| 4 | Test DR failover during peak traffic | [name] | 2026-07-01 | Not started |
```

## P8.12 Example: On-Call Shift Handoff Document

**Scenario:** Complete a shift handoff document for the SRE on-call rotation.

```
## SHIFT HANDOFF

Shift: Alice Johnson → Bob Smith
Date: 2026-05-27
Time: 09:00 UTC → 09:00 UTC (7 days)

### SLO Watch Summary
| Service | SLO Target | Current Compliance | Budget Remaining | Status |
|---------|------------|-------------------|-----------------|--------|
| checkout-api | 99.9% | 99.92% | 87% | Healthy |
| auth-service | 99.99% | 99.99% | 95% | Healthy |
| cart-service | 99.95% | 99.93% | 62% | Healthy |
| payment-gateway | 99.99% | 99.98% | 42% | Warning |
| inventory-svc | 99.95% | 99.91% | 18% | Critical |
| notification | 99.9% | 99.97% | 96% | Healthy |

### Active Incidents
| ID | Sev | Summary | Status | Owner | Notes |
|----|-----|---------|--------|-------|-------|
| INC-027 | SEV2 | Inventory DB slow queries | Monitoring | Alice | SQL tuning in progress, no action needed unless error rate spikes |
| INC-028 | SEV3 | Payment gateway latency increase | Investigating | Alice | Intermittent p99 spikes to 2s, opened ticket with payment provider |

### Recent Pages (Last 7 Days)
| Day | Time | Alert | Action | Follow-up |
|-----|------|-------|--------|-----------|
| Mon | 14:30 | Cart service CPU high | Scaled up instances | None — auto-scaling slow, tuned HPA |
| Tue | 03:15 | Payment gateway error rate | Verified circuit breaker works | No action needed |
| Wed | 11:00 | Inventory DB connections high | Increased connection pool to 400 | Permanent fix scheduled for next sprint |
| Thu | 22:45 | Checkout latency spike | Identified bad deploy, rolled back | Postmortem completed (INC-026) |
| Fri | 08:30 | SSL certificate warning | Certificate renewed | Set up auto-renewal (task in progress) |
| Sat | 16:00 | None | — | Quiet day |
| Sun | 09:00 | None | — | Quiet day |

### Incidents Summary
Total pages: 6
Mean time to acknowledge: 2.3 min
Mean time to resolve: 18.5 min
Page SNR: 0.67 (4 actionable, 2 non-actionable)
False positive rate: 33%

### Ongoing Changes
| Change | Type | Status | Expected Completion | Rollback Plan |
|--------|------|--------|-------------------|---------------|
| Inventory DB migration v2.1 | Schema | Canary (5%) | 2026-05-28 | Rollback script tested |
| Payment gateway SDK upgrade | Dependency | Staging validation | 2026-06-01 | Feature flag toggle |
| SSL auto-renewal setup | Config | In progress | 2026-05-30 | Manual renewal still possible |

### Known Issues
1. Inventory dashboard shows stale data on cache panel (chart not refreshing)
   - Workaround: Refresh browser cache or use direct DB query dashboard
2. Runbook for payment gateway failover is outdated (references old dashboard URL)
   - Updated version in review: /docs/runbooks/payment-failover-v2.md
3. Alert for checkout p99 latency sometimes fires during deployments (known false positive)
   - Root cause: Deployments cause brief latency spike < 30s
   - Consider adding 30s grace period or silencing during deployment windows

### Toil Report (This Shift)
| Category | Hours | Notes |
|----------|-------|-------|
| Incident response | 8.5 | 6 pages, average 1.4 hr each |
| Alert investigation (non-actionable) | 3.0 | 2 false positives |
| Deployment support | 4.0 | 2 manual deployments needed support |
| User access requests | 1.5 | 3 access grant requests |
| Meeting attendance | 6.0 | Daily standups, postmortems |
| Total toil | 23.0 | Out of 40 hours = 57.5% |
| Target toil | < 50% | Exceeded — reduce false positives, automate deployments |

### Recommendations for Next Shift
1. Inventory DB migration at 25% should be ready for full rollout by Wednesday
   - Watch for slow queries after migration
2. Payment gateway SDK upgrade is in staging — test circuit breaker behavior
3. False positive rate is 33% — consider tuning checkout latency alert threshold
4. Inventory dashboard cache issue — ping [name] for fix deployment
5. SSL auto-renewal should complete this week — verify cert-manager status

### Handoff Verification
[✓] Active incidents reviewed
[✓] SLO watch reviewed
[✓] Pagers tested (Alice sent test page to Bob)
[✓] Runbacks for top 5 alerts reviewed
[✓] Escalation contacts reviewed
[✓] Handoff document shared in on-call channel
```

## P8.13 Example: Rate Limiting Strategy for APIs

**Scenario:** Design a comprehensive rate limiting strategy for a multi-tenant API service with different pricing tiers.

**Tier Definitions:**
```
| Tier | Monthly Fee | RPS Limit | Burst | Concurrent | Features |
|------|-------------|-----------|-------|------------|----------|
| Free | $0 | 10 req/s | 20 | 5 | Basic search, 1000 req/day |
| Basic | $99 | 100 req/s | 200 | 50 | Full search, no caching |
| Pro | $499 | 500 req/s | 1000 | 200 | Full search, caching, analytics |
| Enterprise | Custom | 5000 req/s | 10000 | 1000 | Everything, SLA guarantee |
| Internal | N/A | 10000 req/s | 20000 | 5000 | Unlimited internal services |
```

**Rate Limiting Configuration:**

```
# API Gateway Rate Limiting
rate_limit:
  algorithm: sliding_window_counter  # Good accuracy, low memory

  defaults:
    requests_per_second: 10
    burst_size: 20
    window_ms: 1000

  tiers:
    free:
      requests_per_second: 10
      burst_size: 20
      concurrent_requests: 5
      daily_limit: 1000
      daily_limit_window: 86400s  # 24 hours
      cost_per_request: 1

    basic:
      requests_per_second: 100
      burst_size: 200
      concurrent_requests: 50
      daily_limit: 100000
      cost_per_request: 1

    pro:
      requests_per_second: 500
      burst_size: 1000
      concurrent_requests: 200
      daily_limit: 5000000
      cost_per_request: 1

    enterprise:
      requests_per_second: 5000
      burst_size: 10000
      concurrent_requests: 1000
      daily_limit: unlimited
      cost_per_request: 1

    internal:
      requests_per_second: 10000
      burst_size: 20000
      concurrent_requests: 5000
      daily_limit: unlimited
      cost_per_request: 1

  per_endpoint:
    /api/v1/search:
      requests_per_second: 200  # Heavier query, lower limit
      cost: 5  # Each search = 5 cost units
    /api/v1/health:
      requests_per_second: 10000  # Health check should always work
      cost: 1
    /api/v1/auth:
      requests_per_second: 2000  # Burst-y, allow higher
      cost: 2

  headers:
    limit: X-RateLimit-Limit
    remaining: X-RateLimit-Remaining
    reset: X-RateLimit-Reset
    retry_after: Retry-After
    retry_after_format: seconds

  response:
    status_code: 429
    body:
      error: rate_limit_exceeded
      message: Too many requests. Retry after the specified time.
      retry_after_seconds: <calculated>
      limit: <configured limit>
      remaining: 0

  backend_limits:
    database:
      max_queries_per_second: 5000
      cost_per_query: 1
    elasticsearch:
      max_queries_per_second: 2000
      cost_per_query: 5
    cache:
      max_operations_per_second: 50000
```

**Rate Limiting Implementation:**

```
class RateLimiter:
    def __init__(self, backend="redis"):
        self.backend = RedisCluster() if backend == "redis" else MemoryStore()
        self.algorithm = SlidingWindowCounter()

    def check_rate_limit(self, api_key, request):
        tier = self.get_tier(api_key)
        limits = self.get_limits(tier, request.endpoint)

        # Calculate cost of this request
        cost = limits.per_endpoint_cost.get(request.endpoint, limits.default_cost)

        # Check concurrency limit
        concurrent = self.backend.get(f"concurrent:{api_key}:{request.endpoint}")
        if concurrent >= limits.concurrent_requests:
            return RateLimitResult(allowed=False, reason="concurrent_limit")

        # Check rate limit
        window_key = f"rate:{api_key}:{request.endpoint}:{current_window()}"
        current_count = self.backend.get(window_key) or 0
        if current_count + cost > limits.requests_per_second * limits.window_ms / 1000:
            return RateLimitResult(
                allowed=False,
                reason="rate_limit",
                retry_after=calculate_retry(current_count, limits.requests_per_second)
            )

        # Check daily limit (for free/basic tiers)
        if limits.daily_limit != "unlimited":
            daily_key = f"daily:{api_key}:{today()}"
            daily_count = self.backend.get(daily_key) or 0
            if daily_count + cost > limits.daily_limit:
                return RateLimitResult(allowed=False, reason="daily_limit")

        # Allow the request
        self.backend.incr(window_key, cost)
        self.backend.expire(window_key, limits.window_ms * 2)
        if limits.daily_limit != "unlimited":
            self.backend.incr(daily_key, cost)

        return RateLimitResult(
            allowed=True,
            remaining_second=limits.requests_per_second - (current_count + cost),
            remaining_daily=limits.daily_limit - (daily_count + cost) if limits.daily_limit != "unlimited" else -1
        )
```

**Monitoring and Alerting:**
```
Rate limiting metrics to export:
- Rate limit hits per tier (free, basic, pro, enterprise, internal)
- Rate limit hits per endpoint
- Rate limit hit rate per second
- Top 10 API keys hitting rate limits
- Rate limit header accuracy (validate remaining count matches actual)
- Concurrent request count per tier

Alerts:
- Rate limit hit rate > 10% of total requests → possible attack or misconfigured client
- Rate limit hit rate for internal tier > 0 → internal service misconfigured
- Rate limit response time > 5ms → rate limiter performance issue
- Rate limit storage (Redis) utilization > 80% → scale Redis
- Top API key hitting rate limit > 1000 times/hour → contact customer
```

## P8.14 Example: Canary Analysis Configuration

**Scenario:** Configure canary analysis for a deployment pipeline to automatically detect and roll back bad releases.

```
## Canary Analysis Configuration

Service: checkout-api
Deployment Strategy: Canary
Canary Stages: [1%, 5%, 25%, 50%, 100%]
Analysis Window: 30 minutes total
Analysis Tool: Kayenta / Argo Rollouts / Flagger

### Step Configuration

Stage 1: 1% Canary (5 minutes)
- Send 1% of traffic to new version
- Metric evaluation:
  - Error rate: new vs baseline (p < 0.05 significance)
  - Latency p99: new vs baseline (< 10% degradation)
  - CPU utilization: new vs baseline (< 20% increase)
  - Memory utilization: new vs baseline (< 20% increase)
- Pass conditions: All metrics within thresholds
- Fail conditions: Any metric exceeds threshold for 2 consecutive evaluations
- Automatic rollback if failed

Stage 2: 5% Canary (10 minutes)
- Send 5% of traffic to new version
- Same metric evaluation as Stage 1
- Additional checks:
  - Error budget consumption rate (should not exceed baseline by 2x)
  - Log error patterns (no new error types)
- Pass: All metrics stable
- Fail: Any degradation detected

Stage 3: 25% Canary (10 minutes)
- Send 25% of traffic to new version
- Full metric evaluation including:
  - Downstream service error rates
  - Dependency saturation signals
  - Business metrics (conversion rate, if available)
- Pass: All metrics stable, no downstream impact
- Fail: Any degradation in primary or downstream metrics

Stage 4: 50% Canary (5 minutes)
- Send 50% of traffic to new version
- Lightweight metric check (error rate, latency)
- Pass: Stable or improving
- Fail: Any degradation

Stage 5: 100% Rollout
- All traffic to new version
- Monitoring continues for 4 hours post-deployment
- Post-deployment SLO compliance verification

### Metric Configuration

```
canary:
  analysis:
    interval: 30s  # Evaluate metrics every 30 seconds
    max_failures: 3  # Max failed evaluations before rollback
    
  metrics:
    - name: error_rate
      query: sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))
      threshold: 
        increase: 1.5x  # Max 50% increase over baseline
        absolute: 0.02  # Max 2% absolute error rate
      significance: p < 0.05
    
    - name: latency_p99
      query: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))
      threshold:
        increase: 1.1x  # Max 10% increase over baseline
        absolute: 2000ms  # Max 2 seconds p99
      significance: p < 0.05
    
    - name: cpu_utilization
      query: avg(rate(container_cpu_usage_seconds_total[1m])) by (pod)
      threshold:
        increase: 1.2x  # Max 20% increase
      significance: p < 0.10  # Less strict for resource metrics
    
    - name: error_budget_burn
      query: slo_burn_rate{service="checkout-api", window="1h"}
      threshold:
        absolute: 2.0  # Burn rate should not exceed 2.0
      significance: p < 0.05
```

### Automated Rollback Trigger

```
rollback:
  triggers:
    - error_rate_threshold_exceeded
    - latency_p99_threshold_exceeded
    - error_budget_burn_rate_exceeded
    - downstream_service_error_increase > 2x
    - canary_analysis_failure (3 consecutive fails)
  
  action:
    - set_canary_weight: 0
    - route_traffic: baseline_version
    - notify: on-call, deployment channel
    - log: deployment_id, version, metrics_snapshot
    - create_jira_ticket: severity SEV2
  
  post_rollback:
    - verify_baseline_health: 5 min
    - compare_metrics_with_pre_deployment: confirm rollback healed
    - tag_build_as_failed: prevent redeployment
```

### Example Canary Run Output

```
=== Canary Analysis: Deployment v2.3.1 ===

Stage 1: 1% (00:00 → 05:00)
  Error rate: baseline=0.05%, canary=0.04% → PASS
  Latency p99: baseline=450ms, canary=430ms → PASS
  CPU: baseline=45%, canary=44% → PASS
  Memory: baseline=62%, canary=61% → PASS
  Result: ✓ PASS → Proceed to 5%

Stage 2: 5% (05:00 → 15:00)
  Error rate: baseline=0.05%, canary=0.08% → PASS (within 1.5x)
  Latency p99: baseline=450ms, canary=520ms → PASS (within 1.1x)
  Error budget burn: baseline=0.3, canary=0.5 → PASS
  Log errors: No new error types → PASS
  Result: ✓ PASS → Proceed to 25%

Stage 3: 25% (15:00 → 25:00)
  Error rate: baseline=0.05%, canary=0.12% → FAIL (exceeds 1.5x)
  Latency p99: baseline=450ms, canary=680ms → FAIL (exceeds 1.1x)
  Downstream errors: payment-gateway error rate 0.1% → PASS
  Evaluation: 2 of 4 → FAIL
  Consecutive failures: 1

Stage 3: 25% (retry, 25:00 → 25:30)
  Error rate: baseline=0.05%, canary=0.15% → FAIL
  Latency p99: baseline=450ms, canary=720ms → FAIL
  Consecutive failures: 2

Stage 3: 25% (retry, 25:30 → 26:00)
  Error rate: baseline=0.05%, canary=0.18% → FAIL
  Latency p99: baseline=450ms, canary=780ms → FAIL
  Consecutive failures: 3

=== ROLLBACK TRIGGERED ===
Canary v2.3.1 failed at 25% stage (3 consecutive failures)
Traffic reverted to baseline v2.3.0
On-call notified, JIRA INC-029 created

=== Post-Rollback Verification ===
Service health: OK (all SLOs within threshold)
Rollback duration: 45 seconds
Metrics returning to baseline: Error rate 0.05%, Latency 440ms
```

---

# P9: Anti-Patterns

## P9.1 The Four Nines Obsession

**Anti-pattern:** Chasing 99.99% or 99.999% availability for all services regardless of cost or business value.

**Symptoms:**
- All services targeted for 99.99%+ availability regardless of tier
- Engineering teams spend 60%+ of time on reliability for internal tools
- Feature velocity drops to near zero
- Infrastructure costs balloon (multi-region for everything)
- Alert fatigue from overly sensitive monitoring
- Burnout from impossible reliability targets

**Reality:**
- 99.9% (three nines) is 8.76 hours of downtime per year
- 99.99% (four nines) is 52.56 minutes of downtime per year
- 99.999% (five nines) is 5.26 minutes of downtime per year
- Each additional nine costs approximately 2-5x more in infrastructure and engineering

**Solution:**
- Tier services by business criticality (T0, T1, T2, T3)
- Set SLO targets proportional to business impact
- Internal tools can run at 99% or even 99.5% (43.2 hours downtime/year)
- Error budget should drive the conversation, not uptime obsession
- Conduct cost-benefit analysis for each SLO target decision

## P9.2 Alert Fatigue

**Anti-pattern:** Too many alerts, most of which are false positives, non-actionable, or duplicates.

**Symptoms:**
- On-call receives 10+ pages per shift
- Most pages are ignored or acknowledged without action
- Noise-to-signal ratio > 2:1 (more noise than signal)
- On-call disables alert channels to get sleep
- Critical alerts get lost in the noise
- On-call turnover is high

**Root Causes:**
- Thresholds set too tight (page on any deviation from zero errors)
- No burn rate alerting (simple threshold alerts for everything)
- No deduplication or aggregation
- No cooldown period between identical alerts
- Alerting on symptoms rather than causes
- Alerting on every individual instance failure

**Solution:**
- Implement multi-window burn rate alerting (replaces most threshold alerts)
- Every alert must have a runbook (no runbook = delete the alert)
- Target: < 5 pages per shift per person, < 50% false positive rate
- Weekly alert review: classify each alert as true/false, tune or delete
- Alert deduplication with minimum 30-minute cooldown
- Separate warning (email/chat) from paging (phone/SMS)
- Alert on error rate, not error count (normalizes for traffic)

## P9.3 Dashboard Blindness

**Anti-pattern:** Teams create dashboards that no one looks at, or dashboards are too complex to read quickly.

**Symptoms:**
- 50+ dashboards per team, most with 20+ panels
- Dashboard load time > 10 seconds
- No dashboard is the go-to for understanding service health
- Engineers open dashboards only during incidents
- Dashboards show every possible metric (data dump)
- No consistent dashboard structure across teams

**Solution:**
- Create a single dashboard per service with the golden signals
- Limit to 8-12 panels max per dashboard
- Use consistent layout: RED metrics at top, saturation below, dependences bottom
- Dashboard should answer: Is the service working? in < 5 seconds
- Delete dashboards with no viewers for 30 days
- Review dashboard usage quarterly
- Create persona-based dashboards (executive, engineering, on-call)

## P9.4 Hero Culture

**Anti-pattern:** Reliability depends on specific individuals who stay late, work weekends, and know all the secrets.

**Symptoms:**
- One person is the go-to for every production issue
- Only one person knows how the system works end-to-end
- Postmortems don't lead to system improvements (because the hero fixed it)
- Hero is celebrated for saving the day (reinforcing the behavior)
- Knowledge is not documented or shared
- Hero is burning out but afraid to stop

**Solution:**
- Shared on-call rotation with mandatory participation
- Pair every complex task with a knowledge transfer partner
- Runbook-driven operations (no undocumented tribal knowledge)
- Postmortems must identify systemic gaps, not blame or praise individuals
- Rotate incident commander role weekly
- No one should be indispensable to production operations
- Celebrate automation that prevents firefighting, not firefighting itself

## P9.5 SLO Without Error Budget

**Anti-pattern:** Defining SLO targets without implementing error budgets leads to cosmetic reliability.

**Symptoms:**
- SLOs exist but no one knows the current compliance
- SLOs are never reviewed or updated
- No release gating based on error budget
- SLO violations have no consequences
- SLOs are aspirational targets not operational commitments

**Solution:**
- Every SLO must have a corresponding error budget
- Error budget must be tracked in a visible dashboard
- Error budget state must drive release decisions
- Monthly SLO review with stakeholders
- SLO violations must trigger postmortem

## P9.6 One-Person SRE

**Anti-pattern:** A single SRE assigned to support 10+ services with no backup.

**Symptoms:**
- One person is always on call (24/7/365)
- No secondary responder
- No time for project work (100% toil)
- SRE is a bottleneck for all production decisions
- No knowledge transfer (single point of failure)

**Solution:**
- Minimum team size for on-call: 5 people
- No one should be on call more than 1 week in 4
- SRE-to-service ratio: max 3 services per SRE (for Tier 1+)
- Allocate minimum 50% time for engineering work
- Pair junior SREs with senior SREs for at least 3 months

## P9.7 Toil Glorification

**Anti-pattern:** Celebrating how busy people are with operational work, framing toil as heroism.

**Symptoms:**
- "Busy" is praised more than "automated"
- Manual work is celebrated in sprint reviews
- No time tracking for toil
- Automation projects are deprioritized
- Reactive work is seen as more valuable than proactive work

**Solution:**
- Track toil ratio as a key metric
- Celebrate automation that reduces toil
- Include toil reduction in performance reviews
- Allocate minimum 50% sprint capacity to engineering work
- Reward people who make themselves less busy through automation

## P9.8 Postmortem Without Action

**Anti-pattern:** Writing detailed postmortems but never closing action items.

**Symptoms:**
- Postmortem document is published but action items never start
- Action items are vague (improve testing, be more careful)
- Action items have no owner or deadline
- Same type of incident recurs because action items were not implemented
- Postmortem queue has 20+ unclosed items

**Solution:**
- SMART action items: specific, measurable, achievable, relevant, time-bound
- Every action item has exactly one owner and one due date
- Weekly action item review in team standup
- Postmortem quality metric: action item closure rate > 80% within 30 days
- Postmortem effectiveness metric: repeat incident rate

## P9.9 Boiling the Ocean Automation

**Anti-pattern:** Building massive automation platforms before understanding the toil.

**Symptoms:**
- 6-month automation project with no incremental wins
- Automation is more complex than the manual process
- Automation breaks and no one can fix it
- Automation covers 20% of use cases but handles 80% of edge cases
- Automation project is abandoned before completion

**Solution:**
- Follow Pareto principle: automate 20% of tasks that cause 80% of toil
- Incremental automation: each sprint, automate one task
- Simple automation first (scripts), complex later (platforms)
- Measure automation ROI before starting
- Automation must be simpler than the manual process
- Build automation with observability and maintainability

## P9.10 SLO Gaming

**Anti-pattern:** Manipulating SLIs or SLOs to make reliability look better than it is.

**Symptoms:**
- Excluding more failure from SLI than appropriate
- Moving SLO targets down to make compliance easier
- Extending compliance windows to dilute failures
- Redefining success criteria to exclude real failures
- Not counting certain types of errors (client errors, maintenance, etc.)
- Counting only server-side latency (excluding network or client)

**Solution:**
- SLO review process requires stakeholder approval for changes
- SLO exceptions must be documented and approved
- All exclusions must have clear rationale
- Quarterly SLO compliance audit
- External SLAs should reconcile with internal SLOs
- Measure and report all exclusions transparently

## P9.11 Change Fast, Break Fast

**Anti-pattern:** Prioritizing deployment velocity over reliability, leading to frequent incidents.

**Symptoms:**
- Multiple deployments per day to production
- Rollback rate > 10%
- Incidents caused by deployments > 30% of all incidents
- No canary deployments or gradual rollouts
- No feature flags for risk changes

**Solution:**
- Implement progressive delivery (canary, then gradual rollout)
- Error budget release gating (deploy only if budget permits)
- Feature flags for all significant changes
- Deployment freeze periods before major events
- Automated canary analysis with rollback
- Post-deployment monitoring for 4 hours
- Track deployment incident rate as a key metric

## P9.12 Ignoring the Long Tail

**Anti-pattern:** Only optimizing for median performance while ignoring p99/p999.

**Symptoms:**
- Dashboards show only average latency (p50)
- p99 latency is 10x p50 latency
- Users report slow experiences but dashboards look fine
- No alerting on p99 or p999 latency
- Capacity planning uses only average utilization
- Tail latency not addressed because it affects few requests

**Solution:**
- Always monitor and alert on p99 (and p999 for critical systems)
- Set SLO targets based on percentiles, not averages
- Capacity plan for peak (p99), not average (p50)
- Investigate tail latency sources (GC pauses, network contention, queue buildup)
- Implement latency SLOs at multiple percentiles (p95, p99)
- Load test for tail latency under various conditions

---

# P10: Quality Gates & Assessment

## P10.1 SRE Competency Assessment

The SRE competency assessment evaluates individual SRE skills across the required domains.

**Competency Levels:**
| Level | Description | Years Experience | Expected Role |
|-------|-------------|-----------------|---------------|
| 1 | Aware | < 1 year | Entry-level SRE |
| 2 | Practitioner | 1-3 years | SRE Engineer |
| 3 | Proficient | 3-5 years | Senior SRE Engineer |
| 4 | Expert | 5-8 years | Staff SRE Engineer |
| 5 | Distinguished | 8+ years | Principal SRE Engineer |

**Competency Areas:**

1. **SLO/SLI/Error Budget Design**
   - L1: Can define basic SLIs for a simple service
   - L2: Can design SLOs with stakeholder input
   - L3: Can lead SLO design workshop end-to-end
   - L4: Can design multi-service composite SLOs with budget allocation
   - L5: Can design organizational SLO strategy and policy

2. **Monitoring & Alerting**
   - L1: Can read existing dashboards and acknowledge alerts
   - L2: Can create dashboards and configure basic alerts
   - L3: Can design complete monitoring strategy with golden signals
   - L4: Can implement multi-window burn rate alerting and tune SNR
   - L5: Can design organizational monitoring standards and tools

3. **Incident Management**
   - L1: Can follow runbooks during incidents
   - L2: Can diagnose and mitigate common incidents
   - L3: Can act as Incident Commander
   - L4: Can design incident management processes and training
   - L5: Can lead organizational incident response strategy

4. **Capacity Planning**
   - L1: Can read capacity dashboards
   - L2: Can create basic capacity forecasts
   - L3: Can lead capacity review and planning
   - L4: Can design automated capacity management
   - L5: Can design organizational capacity strategy

5. **Automation**
   - L1: Can write basic scripts
   - L2: Can automate common tasks with runbooks
   - L3: Can design automation strategy for toil reduction
   - L4: Can build self-healing automation
   - L5: Can design autonomous operations strategy

6. **Chaos Engineering**
   - L1: Understands chaos engineering concepts
   - L2: Can execute existing chaos experiments
   - L3: Can design and lead chaos experiments
   - L4: Can build automated chaos experiment pipeline
   - L5: Can design organizational chaos strategy

7. **Reliability Patterns**
   - L1: Knows reliability patterns by name
   - L2: Can implement basic patterns (circuit breaker, retry, timeout)
   - L3: Can design reliability architecture for a service
   - L4: Can evaluate and improve reliability patterns across services
   - L5: Can research and introduce novel reliability patterns

## P10.2 Service Maturity Scorecard

The service maturity scorecard provides a repeatable assessment framework.

**Scorecard Template:**

```
Service: [name]
Tier: [0-3]
Date: [YYYY-MM-DD]
Assessor: [name]

### Scoring
Each criterion scored 1-5:
1 = Not started / No capability
2 = Basic / Informal
3 = Defined / Functional
4 = Measured / Optimized
5 = Autonomous / Self-managing

### Criteria

1. SLI Definition (Weight: 15%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to SLI documentation]
   Gap: [description of gap]

2. SLO Targeting (Weight: 15%)
   Score: [1-5]
   Current state: [SLO targets documented, tracked]
   Target state: [SLOs with error budgets, release gating]
   Evidence: [link to SLO dashboard]
   Gap: [budget not used for release decisions]

3. Error Budget Usage (Weight: 15%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to budget dashboard]
   Gap: [description]

4. Monitoring Coverage (Weight: 15%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to monitoring dashboard]
   Gap: [description]

5. Alerting Quality (Weight: 10%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to alert rules]
   Gap: [description]

6. Incident Management (Weight: 10%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to incident process]
   Gap: [description]

7. Capacity Planning (Weight: 10%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to capacity model]
   Gap: [description]

8. Automation (Weight: 5%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to automation code]
   Gap: [description]

9. Toil Ratio (Weight: 5%)
   Score: [1-5]
   Current state: [description]
   Target state: [description]
   Evidence: [link to toil dashboard]
   Gap: [description]

### Weighted Score
Total: [sum of weighted scores] / 5.0
Maturity Level: [0-5]

### Recommendations
1. [Highest priority improvement]
2. [Second priority improvement]
3. [Third priority improvement]

### Improvement Plan
| Action | Owner | Due | Effort | Impact |
|--------|-------|-----|--------|--------|
| [action] | [name] | [date] | [hours] | [score increase] |
```

## P10.3 SLO Health Check

The SLO health check evaluates whether SLOs are well-designed and effective.

**Health Check Questions:**

```
### SLO Definition Quality
[ ] Is every SLI clearly defined with numerator and denominator?
[ ] Is every SLI measured at the right aggregation level (per-request, per-minute)?
[ ] Are exclusions from SLI clearly documented?
[ ] Are SLO targets justified by business requirements?
[ ] Are SLO targets achievable based on historical data?
[ ] Is the compliance window appropriate (30 days for most services)?
[ ] Are error budgets calculated and tracked?

### SLO Coverage
[ ] Does every critical user journey have an SLO?
[ ] Are availability, latency, and correctness all covered?
[ ] Are dependency SLOs aligned with composite SLOs?
[ ] Are internal services with external dependencies covered?
[ ] Are SLOs defined for batch/async processing?

### SLO Operations
[ ] Are error budgets visible on a dashboard?
[ ] Are burn rate alerts configured for every SLO?
[ ] Is release gating based on error budget state?
[ ] Are SLO reviews conducted monthly with stakeholders?
[ ] Are SLO targets reviewed quarterly?
[ ] Are SLO violations investigated with postmortems?

### SLO Health Score
Each yes = 1 point, each no = 0 points
Score: [X] / 15
- 13-15: Healthy
- 10-12: Needs attention
- 7-9: Needs improvement
- < 7: Requires immediate action
```

## P10.4 On-Call Readiness Assessment

The on-call readiness assessment evaluates whether a team is prepared for production support.

```
## On-Call Readiness Assessment

### Team Structure
[ ] Minimum 5 engineers in rotation
[ ] Maximum 1 week on-call per 4 weeks per person
[ ] Primary and secondary responder model
[ ] Clear escalation path documented
[ ] On-call compensation or comp time policy
[ ] New members have 3+ month ramp-up before solo on-call

### Tooling
[ ] Paging system integrated with monitoring
[ ] Page acknowledgment within 5 minutes
[ ] Escalation configured (unacknowledged pages escalate)
[ ] On-call schedule visible and up to date
[ ] Handoff document template exists

### Runbooks
[ ] Every paged alert has a runbook
[ ] Runbooks are tested quarterly
[ ] Runbooks are version controlled
[ ] Runbook covers: symptoms, diagnosis, mitigation verification
[ ] Runbooks include escalation criteria

### Incident Management
[ ] Severity taxonomy defined
[ ] Incident commander role defined
[ ] Communication templates exist
[ ] Postmortem process defined
[ ] Action items tracked to closure

### Capacity
[ ] On-call load < 5 pages per shift per person
[ ] False positive rate < 50%
[ ] Mean time to acknowledge < 5 minutes
[ ] Mean time to resolve < 30 minutes
[ ] Toil ratio < 50% of on-call time

### Assessment Result
Pass / Conditional Pass / Fail
Gaps: [list]
Improvement plan: [list]
Next assessment: [date]
```

## P10.5 Incident Response Audit

The incident response audit evaluates the effectiveness of incident management.

```
## Incident Response Audit

Period: [date range]
Total incidents: [count]
Reviewed incidents: [count]

### Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| MTTD (Mean Time to Detect) | [value] | < 5 min | ✓/✗ |
| MTTA (Mean Time to Acknowledge) | [value] | < 5 min | ✓/✗ |
| MTTR (Mean Time to Resolve) | [value] | < 30 min | ✓/✗ |
| Postmortem completion rate | [%] | > 90% | ✓/✗ |
| Action item closure rate | [%] | > 80% | ✓/✗ |
| Incident recurrence rate | [%] | < 10% | ✓/✗ |

### Incident Classification
| Type | Count | Percentage |
|------|-------|------------|
| Deployment-related | [N] | [%] |
| Infrastructure-related | [N] | [%] |
| Dependency-related | [N] | [%] |
| Configuration-related | [N] | [%] |
| Capacity-related | [N] | [%] |
| Security-related | [N] | [%] |
| Other | [N] | [%] |

### Quality Assessment
Postmortem quality (sample of [N] postmortems):
- Action items specific and measurable: [%]
- Action items have owners and dates: [%]
- Root cause reaches systemic level: [%]
- Timeline includes system events: [%]
- Blameless language used: [%]

### Recommendations
1. [Top recommendation]
2. [Second recommendation]
3. [Third recommendation]
```

## P10.6 Automation Coverage Assessment

The automation coverage assessment evaluates how much operational work is automated.

```
## Automation Coverage Assessment

Service: [name]
Date: [YYYY-MM-DD]

### Automation Inventory

| Task Domain | Total Tasks | Automated | Manual | Automation % | Priority |
|-------------|-------------|-----------|--------|-------------|----------|
| Incident detection | [N] | [N] | [N] | [%] | High |
| Incident remediation | [N] | [N] | [N] | [%] | High |
| Deployment | [N] | [N] | [N] | [%] | High |
| Capacity scaling | [N] | [N] | [N] | [%] | Medium |
| Backup/restore | [N] | [N] | [N] | [%] | Medium |
| Certificate management | [N] | [N] | [N] | [%] | Medium |
| Log management | [N] | [N] | [N] | [%] | Low |
| User access | [N] | [N] | [N] | [%] | Low |
| Monitoring config | [N] | [N] | [N] | [%] | Low |
| Total | [N] | [N] | [N] | [%] | — |

### Automation Maturity by Domain
| Domain | Current Level | Target Level | Timeline |
|--------|--------------|--------------|----------|
| Incident detection | L2 | L4 | Q3 |
| Incident remediation | L1 | L3 | Q4 |
| Deployment | L3 | L5 | Q2 |
| Capacity scaling | L2 | L4 | Q3 |
| Backup/restore | L3 | L4 | Q2 |

### Automation ROI (Next Quarter)
| Project | Effort (hrs) | Savings (hrs/mo) | Payback (months) | Priority |
|---------|-------------|-----------------|------------------|----------|
| [project] | [effort] | [savings] | [payback] | [1-5] |

### Recommendations
1. Automate [task] — saves [X] hours/month with [Y] hours effort
2. Upgrade [automation] from L2 to L3 — saves [X] hours/month
3. Eliminate [process] — removes need for [N] manual tasks per week
```

---

# P11: Additional SRE Engineering Practices

## P11.1 SRE Tooling & Automation Library

**Service Level Dashboard Generator:**

def generate_dashboard(service_config):
    dashboard = {
        "title": f"{service_config.name} SRE Dashboard",
        "panels": [
            generate_slo_panel(service_config.slos),
            generate_burn_rate_panel(service_config.slos),
            generate_red_panel(service_config),
            generate_use_panel(service_config),
            generate_dependency_panel(service_config.dependencies)
        ]
    }
    return dashboard

**Burn Rate Alert Generator:**

BURN_RATE_CONFIGS = {
    0.999: {  # 99.9% SLO
        "fast_burn": {"rate": 14, "window": "5m", "severity": "page"},
        "slow_burn": {"rate": 2.5, "window": "30m", "severity": "page"},
        "budget_warning": {"remaining": 0.50, "severity": "warning"},
        "budget_critical": {"remaining": 0.25, "severity": "page"},
        "budget_emergency": {"remaining": 0.10, "severity": "critical_page"}
    },
    0.9995: {  # 99.95% SLO
        "fast_burn": {"rate": 16, "window": "5m", "severity": "page"},
        "slow_burn": {"rate": 3.0, "window": "30m", "severity": "page"},
        "budget_warning": {"remaining": 0.50, "severity": "warning"},
        "budget_critical": {"remaining": 0.25, "severity": "page"},
        "budget_emergency": {"remaining": 0.10, "severity": "critical_page"}
    },
    0.9999: {  # 99.99% SLO
        "fast_burn": {"rate": 20, "window": "5m", "severity": "page"},
        "slow_burn": {"rate": 3.5, "window": "30m", "severity": "page"},
        "budget_warning": {"remaining": 0.50, "severity": "warning"},
        "budget_critical": {"remaining": 0.25, "severity": "page"},
        "budget_emergency": {"remaining": 0.10, "severity": "critical_page"}
    }
}

## P11.2 SRE Runbook Template Library

**Standard Runbook Template:**

- Alert Name: [name]
- Service: [service name]
- Severity: [SEV0-SEV4]
- Runbook Version: [semver]
- Last Updated: [date]
- Owner: [team]

### Symptoms
- [Symptom 1: what users/customers experience]
- [Symptom 2: what monitoring shows]
- [Symptom 3: what logs show]

### Impact Assessment
- User impact: [description]
- Revenue impact: [estimated per minute]
- Data integrity risk: [none/low/medium/high]
- Downstream services affected: [list]

### Severity Classification
- Initial severity: [SEV1/SEV2/SEV3]
- Escalate to SEV0 if: [conditions]

### Pre-Requisites
- [Access required]
- [Tools needed]
- [Communication channel]

### Diagnosis Steps
Step 1: Initial Assessment (2 min)
1. Check dashboard
2. Identify failing component
3. Assess impact scope

Step 2: Deep Diagnosis (5 min)
1. Check specific metric
2. View recent changes/deployments
3. Check upstream/downstream dependencies
4. Examine logs for error patterns

Step 3: Root Cause Identification (10 min)
1. Decision tree: if condition A, cause is X
2. Decision tree: if condition B, cause is Y

### Mitigation Steps
Immediate Mitigation (5 min):
- [Mitigation 1: quick action]
- [Mitigation 2: if mitigation 1 fails]
- [Rollback: if deployment-related]

Short-term Mitigation (30 min):
- [Mitigation 3: temporary fix]
- [Mitigation 4: workaround]

### Verification
1. Verify error rate returns to baseline
2. Verify latency returns to baseline
3. Verify SLO compliance restored
4. Verify downstream services healthy

### Escalation Criteria
- Escalate to SEV0 if: [conditions]
- Escalate to secondary if: [conditions]
- Escalate to team lead if: [conditions]

### Contact Information
- On-call primary: [current]
- On-call secondary: [current]
- Service owner: [name/team]
- SRE team lead: [name]

### Post-Incident
1. Ensure postmortem is created
2. Update runbook with lessons learned
3. Create action items for any gaps found
4. Verify runbook accuracy with the team

### Related Resources
- [Link to service dashboard]
- [Link to architecture diagram]
- [Link to deployment pipeline]
- [Link to postmortem template]

## P11.3 SRE Metrics Export Standards

**Standard SRE Metrics to Export from Every Service:**

counter: http_requests_total{service, endpoint, method, status}
histogram: http_request_duration_seconds{service, endpoint, method}
counter: http_errors_total{service, endpoint, method, status, error_type}
gauge: cpu_utilization{service, instance}
gauge: memory_utilization{service, instance}
gauge: disk_utilization{service, instance, device}
gauge: disk_iowait{service, instance, device}
gauge: network_bandwidth_utilization{service, instance, interface}
gauge: cpu_run_queue_length{instance}
gauge: memory_swap_usage_bytes{instance}
gauge: disk_queue_depth{instance, device}
gauge: network_interface_drops_total{instance, interface}
gauge: slo_compliance{service, sli_name, window}
gauge: slo_budget_remaining{service, sli_name, window}
gauge: slo_burn_rate{service, sli_name, window}
gauge: circuit_breaker_state{service, dependency}
counter: circuit_breaker_failures_total{service, dependency}
counter: fallback_invocations_total{service, dependency, fallback_type}
gauge: health_check_status{service, check_type}
counter: toil_hours_total{team, category}
counter: automation_coverage_ratio{team, domain}

## P11.4 SRE Decision Trees

**Error Budget Decision Tree:**

Is error budget remaining > 50%?
  YES → Normal operations
  NO → Is budget remaining 25%-50%?
    YES → Reduce non-essential changes
    NO → Is budget remaining 10%-25%?
      YES → Halt non-critical deployments
      NO → Is budget remaining < 10%?
        YES → Emergency mode: halt all deployments, all hands on reliability, exec notification

**Incident Triage Decision Tree:**

Is the service completely unavailable?
  YES → SEV0
  NO → Are > 20% of users affected?
    YES → SEV1
    NO → Are 5-20% of users affected?
      YES → SEV2
      NO → Are < 5% of users affected?
        YES → SEV3

Is revenue being impacted?
  > $100K/hr → SEV0
  $10K-$100K/hr → SEV1
  $1K-$10K/hr → SEV2
  < $1K/hr → SEV3

Is data integrity compromised?
  Data loss confirmed → SEV0
  Data corruption risk → SEV1
  No data issues → SEV3

**Deployment Rollback Decision Tree:**

Has error rate increased by > 2x since deployment?
  YES → Rollback immediately, investigate
  NO → Has p99 latency increased by > 20%?
    YES → Rollback, investigate performance regression
    NO → Is error budget consumption rate > 2x normal?
      YES → Rollback, monitor after rollback
      NO → Is downstream service health degraded?
        YES → Rollback, check dependency compatibility
        NO → Continue monitoring, inform team

## P11.5 SRE Team Metrics & Reporting

**Weekly SRE Team Metrics:**

SLO compliance (all services): 99.91% (target > 99.9%)
Services in budget warning: 2 of 12 (target < 2)
Pages per shift (avg): 3.2 (target < 5)
False positive rate: 42% (target < 50%)
MTTA (acknowledge): 2.1 min (target < 5 min)
MTTR (resolve): 18.4 min (target < 30 min)
Toil ratio: 37% (target < 50%)
Automation coverage: 68% (target > 70%)
Postmortem action closure: 84% (target > 80%)
Incident recurrence rate: 8% (target < 10%)

**Monthly SRE Report to Engineering Leadership:**

Executive Summary:
- Platform reliability was 99.91% across all Tier 0-1 services
- Three SEV1 incidents occurred, all mitigated within SLA
- Toil ratio reduced to 37% (from 45% last quarter)
- 8 postmortem action items closed (84% closure rate)

Key Achievements:
- Canary analysis implemented for checkout service
- Multi-window burn rate alerting deployed for all Tier 1 services
- Automated certificate rotation implemented

Key Risks:
- inventory-svc at 18% error budget (critical) — DB migration in progress
- payment-gateway at 42% (warning) — upstream provider latency issues

Incident Summary:
- SEV0: 0 | SEV1: 3 | SEV2: 8 | SEV3: 15
- Avg SEV1 duration: 28 min | MTTR: 18.4 min

Top Toil Sources:
1. False alerts investigation (32% of toil)
2. Manual deployment support (22%)
3. Capacity management (18%)
4. Access requests (12%)

## P11.6 Capacity Planning Models

**Linear Growth Model:**

def linear_growth_model(current_usage, daily_growth_rate, days):
    results = []
    for day in range(days):
        rate_decimal = daily_growth_rate / 100.0
        future = current_usage * (1 + rate_decimal) ** day
        results.append({"day": day, "usage": future})
    return results

Example: 10,000 req/s current, 2% daily growth, 30 day forecast
Day 0: 10,000 req/s (50% of 20,000 capacity)
Day 22: 15,476 req/s (77% of capacity) — schedule capacity add
Day 30: 18,114 req/s (91% of capacity) — CRITICAL

**Holt-Winters Forecast Model:**

def holt_winters_forecast(data, periods, alpha=0.3, beta=0.1, gamma=0.1):
    n = len(data)
    season_length = 7  # Weekly seasonality
    level = data[0]
    trend = (data[-1] - data[0]) / n
    seasons = [data[i] / level for i in range(min(season_length, n))]
    forecast = []
    for i in range(periods):
        if i < n:
            actual = data[i]
            season_idx = i % season_length
            prev_level = level
            level = alpha * (actual / seasons[season_idx]) + (1 - alpha) * (level + trend)
            trend = beta * (level - prev_level) + (1 - beta) * trend
            seasons[season_idx] = gamma * (actual / level) + (1 - gamma) * seasons[season_idx]
            forecast.append(actual)
        else:
            season_idx = i % season_length
            predicted = (level + (i - n + 1) * trend) * seasons[season_idx]
            forecast.append(predicted)
    return forecast[n:]

**Utilization Threshold-Based Scaling:**

def determine_scaling(metrics, thresholds):
    actions = []
    for name, value in metrics.items():
        t = thresholds[name]
        if value > t["critical"]:
            actions.append(f"CRITICAL_SCALE_UP: {name} at {value:.1%}")
        elif value > t["warning"]:
            actions.append(f"WARNING_MONITOR: {name} at {value:.1%}")
        elif value < t["cooldown"]:
            actions.append(f"COOLDOWN_SCALE_DOWN: {name} at {value:.1%}")
    if any("CRITICAL" in a for a in actions):
        return "SCALE_UP"
    elif len(actions) >= 2 and all("COOLDOWN" in a for a in actions):
        return "SCALE_DOWN"
    return "MAINTAIN"

thresholds = {
    "cpu": {"critical": 0.80, "warning": 0.60, "cooldown": 0.30},
    "memory": {"critical": 0.85, "warning": 0.70, "cooldown": 0.40}
}

## P11.7 Progressive Delivery Configuration

**Canary Deployment Pipeline Configuration:**

phases:
  - name: build
    steps: [docker_build, unit_tests, integration_tests, security_scan]

  - name: staging
    steps: [deploy_staging, smoke_tests, load_tests]
    gates:
      error_rate < 0.1%, p99_latency < SLO * 0.8, all_tests_passed: true

  - name: canary_1pct
    steps: [deploy_to_canary, set_traffic_weight: 0.01, wait: 5m]
    analyze: error_rate, p99_latency, cpu_utilization
    gates: all_metrics_within_1.5x_baseline

  - name: canary_5pct
    steps: [set_traffic_weight: 0.05, wait: 10m]
    analyze: error_rate, p99_latency, error_budget_burn_rate
    gates: all_metrics_within_1.3x_baseline

  - name: canary_25pct
    steps: [set_traffic_weight: 0.25, wait: 15m]
    analyze: error_rate, p99_latency, downstream_error_rate, business_metrics
    gates: all_metrics_within_1.2x_baseline

  - name: production
    steps: [set_traffic_weight: 1.0, wait: 30m, verify_slo_compliance]
    gates: slo_compliance_within_target

  - name: post_deployment
    steps: [monitor: 4h, verify_slo_compliance, update_dashboards]

## P11.8 Incident Management Automation

**Automated Incident Response Pipeline:**

1. ALERT FIRES
   → Alert enriched with context (dashboard link, runbook link, metrics)
   → Page sent to primary on-call (phone + SMS)

2. INCIDENT CREATED (automatic)
   → Incident channel created in chat
   → Incident ticket created in tracking system
   → Initial incident summary posted with context

3. AUTO-REMEDIATION ATTEMPT (if configured)
   → Check if automated remediation exists for this alert type
   → If yes: execute remediation, verify, notify
   → If no: proceed to human escalation

4. INCIDENT COMMANDER ASSIGNED
   → First responder becomes IC
   → IC declared in incident channel

5. STATUS UPDATES
   → Every 30 minutes: automated prompt for status update
   → Stakeholders notified based on severity

6. MITIGATION DETECTED
   → Monitoring shows metrics returning to baseline
   → Automated check: is SLO compliance restored?
   → If yes: prompt IC to declare resolution

7. INCIDENT RESOLVED
   → IC confirms resolution
   → Incident channel archived
   → Postmortem ticket auto-created
   → Action items from automated analysis linked

8. POST-INCIDENT
   → Postmortem draft auto-generated from incident timeline
   → Action items assigned to service team
   → Runbook updated if remediation steps were novel

## P11.9 SRE On-Call Training Program

**Week 1: Fundamentals**

Day 1: SRE Principles and Culture
- Read: SRE chapters 1-4 (Google SRE book)
- Training: SLO/SLI/Error Budget concepts
- Quiz: SRE fundamentals (pass: 80%)

Day 2: Monitoring and Observability
- Training: RED method, USE method, Golden Signals
- Hands-on: Read existing dashboards

Day 3: Alerting and On-Call Tools
- Training: Paging system, on-call rotation, escalation
- Hands-on: Configure pager profile

Day 4: Incident Management Process
- Training: Severity classification, incident command system
- Simulation: Walk through an incident scenario

Day 5: Runbooks and Common Scenarios
- Hands-on: Follow runbook for top 5 alerts
- Assessment: Runbook execution drill

**Week 2: Service Architecture**

Day 1: Architecture Overview
- Training: Architecture diagrams, dependencies, data flow
- Hands-on: Trace a request through the system

Day 2: Database and Storage
- Training: Database topology, replication, backup/restore
- Hands-on: Read replica failover exercise

Day 3: Networking and Infrastructure
- Training: Load balancers, DNS, CDN, network topology
- Hands-on: DNS resolution debugging

Day 4: Dependencies and External Services
- Training: Third-party dependencies, circuit breakers
- Hands-on: Circuit breaker configuration review

Day 5: Deployment Pipeline
- Training: CI/CD pipeline, canary deployment, rollback
- Hands-on: Execute rollback in staging

**Week 3: Shadow On-Call**
- All pages: shadow joins, observes, asks questions
- Simple incidents: shadow handles with supervision
- Daily debrief: discuss incidents, decisions, lessons learned

**Week 4: Solo On-Call (Supervised)**
- Primary on-call with senior SRE as secondary
- After-action review for each page
- Final assessment: on-call readiness review

**On-Call Certification Checklist:**
[ ] Passed SRE fundamentals quiz (> 80%)
[ ] Can read and explain service dashboards
[ ] Has acknowledged and responded to a test page
[ ] Can classify incidents by severity
[ ] Has followed top 5 runbooks
[ ] Can trace a request through architecture
[ ] Has executed rollback in staging
[ ] Has shadowed on-call for minimum 1 week
[ ] Has handled 3+ incidents with supervision
[ ] Has completed shift handoff independently

## P11.10 SRE Engagement Lifecycle: Detailed Walkthrough

**Phase 1: Assessment (Week 1-2)**

Week 1: Discovery
- Stakeholder interviews (Product, Eng Lead, Ops)
- Architecture review
- Incident history analysis
- Current monitoring coverage audit
- Toil audit (2-week time study)

Week 2: Gap Analysis
- Score service maturity (0-5 for each dimension)
- Identify top 5 reliability risks
- Identify top 5 toil sources
- Produce: Assessment report with prioritized recommendations

Deliverables:
- Service maturity scorecard
- Gap analysis document
- Prioritized recommendation list

**Phase 2: Planning (Week 3-4)**

Week 3: SLO Design Workshop
- Facilitate SLO design workshop
- Define SLIs, SLO targets, error budget policy
- Document SLO charter with stakeholder sign-off

Week 4: Roadmap Creation
- Prioritize reliability improvements
- Design alerting strategy
- Plan toil reduction initiatives
- Create 3-month roadmap with milestones
- Define success metrics for engagement

Deliverables:
- SLO charter (signed by stakeholders)
- 3-month SRE engagement roadmap
- Error budget policy document

**Phase 3: Implementation (Month 2-4)**

Month 2: Foundation
- Instrument SLIs in production
- Configure SLO tracking dashboard
- Implement burn rate alerting
- Set up error budget tracking
- Create incident management process

Month 3: Reliability Patterns
- Implement circuit breakers for dependencies
- Configure retry with backoff policies
- Set up timeout hierarchies
- Implement rate limiting

Month 4: Automation & Testing
- Automate top 3 toil sources
- Implement canary analysis
- Conduct first chaos experiment
- Implement release gating with error budgets
- Create runbooks for all alerts

**Phase 4: Handoff & Sustainability (Month 5-6)**

Month 5: Knowledge Transfer
- Document all SRE practices for the service
- Train team on SRE principles and tools
- Transition alert ownership to service team
- Create on-call runbooks

Month 6: Graduation
- Final maturity assessment
- Compare scores with initial assessment
- Document remaining gaps for future work
- Establish quarterly review cadence

Deliverables:
- Complete SRE practice documentation
- Trained service team
- Self-service reliability dashboard

## P11.11 Composite SLO Calculation Examples

**Example 1: Serial Service Chain (Checkout)**

Service A (Frontend):   99.95% availability
Service B (Cart):       99.95% availability
Service C (Payment):    99.99% availability
Service D (Inventory):  99.95% availability

Composite (serial): 0.9995 * 0.9995 * 0.9999 * 0.9995 = 0.9984 = 99.84%

Error budget for composite:
- 1 - 0.9984 = 0.0016 = 0.16% allowed downtime
- Over 30 days: 2,592,000 * 0.0016 = 4,147 seconds = 69.1 minutes

If we need 99.9% composite availability:
- Each service must achieve: 0.999^(1/4) = 0.99975 = 99.975%
- Check: 0.99975^4 = 0.9990 = 99.9%

**Example 2: Parallel with Fallback (Search)**

Service A (Search Primary):       99.9% availability
Service B (Search Fallback):      99.0% availability
Service C (Analytics):            99.5% availability (non-critical)

Composite (parallel with fallback):
- Search works if A works OR (B works when A fails)
- Composite = 1 - (1 - 0.999) * (1 - 0.990) = 1 - 0.001 * 0.01 = 99.999%
- Adjusted for failover delay: ~99.99%

**Example 3: Fan-Out with Redundancy (Notification)**

Service A (Notification Manager): 99.9%
  → Service B (Email):             99.5%
  → Service C (SMS):               99.0%
  → Service D (Push):              99.5%

Composite (at least one channel delivers):
- All fail = 0.005 * 0.010 * 0.005 = 0.00000025
- At least one succeeds = 1 - 0.00000025 = 99.999975%

## P11.12 SRE Financial Modeling

**Cost of Reliability Calculation:**

def calculate_reliability_cost(
    current_avail, target_avail, monthly_revenue, infra_cost, eng_count
):
    # Current downtime
    total_seconds = 30 * 24 * 3600
    current_downtime = total_seconds * (1 - current_avail)
    target_downtime = total_seconds * (1 - target_avail)
    
    # Revenue impact
    rev_per_second = monthly_revenue / total_seconds
    revenue_savings = (current_downtime - target_downtime) * rev_per_second
    
    # Cost impact (each additional 9 costs ~2-3x more)
    nines_current = -round(math.log10(1 - current_avail))
    nines_target = -round(math.log10(1 - target_avail))
    extra_infra = infra_cost * (2 ** (nines_target - nines_current) - 1)
    extra_eng = eng_count * 20000  # $20K/month per engineer
    
    net = revenue_savings - (extra_infra + extra_eng)
    roi = net / (extra_infra + extra_eng) if (extra_infra + extra_eng) > 0 else float("inf")
    
    return {"net_benefit": net, "roi": roi}

Example: 99.9% → 99.99%, $10M/month revenue, $200K infra
Revenue savings: ~$4,860/month
Extra infra cost: ~$200K/month
Extra eng cost: ~$60K/month (3 engineers)
Net benefit: -$255K/month (not worth it for most services)

## P11.13 SRE Contract & SLA Templates

**Internal SRE Service Agreement Template:**

### SRE Commitments
1. Monitoring & Alerting
   - SLO-based monitoring configured
   - Burn rate alerting configured
   - On-call rotation covers 24/7 for SEV0/SEV1
   - Runbooks exist for all alerts

2. Incident Response
   - SEV0: response within 5 min, mitigation within 1 hour
   - SEV1: response within 15 min, mitigation within 4 hours
   - SEV2: response within 1 hour (business hours)
   - Postmortem within 48 hours for SEV0/SEV1

3. Capacity Planning
   - Quarterly capacity review
   - 6-month capacity forecast
   - Auto-scaling configured and tested

4. SLO Management
   - Monthly SLO compliance report
   - Quarterly SLO target review
   - Error budget tracked and reported

### Service Team Commitments
- Follow SRE guidelines for instrumentation
- Attend SLO design workshop
- Participate in on-call rotation
- Complete postmortems within SLA
- Implement reliability patterns as recommended
- Allocate capacity for reliability improvements

### Service Levels
| Metric | Target | Measurement | Reporting |
|--------|--------|-------------|-----------|
| SLO compliance | 99.9% | 30d rolling | Real-time dashboard |
| MTTR (SEV0/1) | < 30 min | Monthly average | Monthly report |
| Toil ratio | < 50% | Quarterly | Quarterly report |
| Alert SNR | > 0.5 | Weekly | Monthly report |

### Escalation
| Level | Contact | Response Time |
|-------|---------|---------------|
| SRE on-call | pager | < 5 min |
| SRE team lead | phone | < 30 min |
| Engineering manager | phone | < 1 hour |
| Director of Eng | phone/email | < 2 hours |

---

# P12: Advanced SRE Patterns & Configurations

## P12.1 Advanced Burn Rate Alert Configuration Examples

**Configuration for Different SLO Targets:**

The burn rate threshold and window selection depends on the SLO target. The goal is to detect budget exhaustion with enough time to respond before the SLO is violated.

For 99.9% SLO (30-day window, budget = 43.2 minutes):
- Budget consumed per minute of full outage: 1/43200 = 0.0023%
- Fast burn (14x): detects outage in ~3 minutes (3 * 14/43200 = 0.097% of budget)
- Slow burn (2.5x): detects outage in ~17 minutes (17 * 2.5/43200 = 0.098% of budget)
- Combined: alert fires when burn rate exceeds 2.5 for 30m AND 14 for 5m
- Budget consumed before alert: ~0.17% (enough time to act, not too sensitive)

For 99.99% SLO (30-day window, budget = 4.32 minutes):
- Budget consumed per minute of full outage: 1/4320 = 0.023%
- Fast burn (20x): detects outage in ~2 minutes (2 * 20/4320 = 0.093% of budget)
- Slow burn (3.5x): detects outage in ~12 minutes (12 * 3.5/4320 = 0.097% of budget)
- Tighter thresholds needed because budget is smaller
- Warning threshold at 50% remaining is critical for 99.99% SLO

For 99% SLO (30-day window, budget = 7.2 hours = 432 minutes):
- Budget consumed per minute of full outage: 1/25920 = 0.0039%
- Fast burn (8x): detects outage in ~5 minutes (5 * 8/25920 = 0.15% of budget)
- Slow burn (2.0x): detects outage in ~30 minutes (30 * 2/25920 = 0.23% of budget)
- Looser thresholds because budget is larger
- Can tolerate more false positives before they matter

**Burn Rate Budget Consumption Reference Table:**

| Burn Rate | Time to Exhaust (30d window) | Time to Exhaust (7d window) | Time to Exhaust (24h window) |
|-----------|------------------------------|----------------------------|------------------------------|
| 1.0 | 30.0 days | 7.0 days | 24.0 hours |
| 2.0 | 15.0 days | 3.5 days | 12.0 hours |
| 3.0 | 10.0 days | 2.3 days | 8.0 hours |
| 5.0 | 6.0 days | 1.4 days | 4.8 hours |
| 10.0 | 3.0 days | 16.8 hours | 2.4 hours |
| 14.0 | 2.1 days | 12.0 hours | 1.7 hours |
| 20.0 | 1.5 days | 8.4 hours | 1.2 hours |
| 50.0 | 14.4 hours | 3.4 hours | 28.8 minutes |
| 100.0 | 7.2 hours | 1.7 hours | 14.4 minutes |

**Burn Rate Budget Consumption Over Various Windows:**

| Burn Rate | 5 min window | 30 min window | 1h window | 6h window | 24h window |
|-----------|-------------|---------------|-----------|-----------|------------|
| 1.0 | 0.0012% | 0.0069% | 0.0139% | 0.083% | 0.33% |
| 2.0 | 0.0023% | 0.0139% | 0.0278% | 0.167% | 0.67% |
| 5.0 | 0.0058% | 0.0347% | 0.0694% | 0.417% | 1.67% |
| 10.0 | 0.0116% | 0.0694% | 0.1389% | 0.833% | 3.33% |
| 14.0 | 0.0162% | 0.0972% | 0.1944% | 1.167% | 4.67% |
| 20.0 | 0.0231% | 0.1389% | 0.2778% | 1.667% | 6.67% |
| 50.0 | 0.0579% | 0.3472% | 0.6944% | 4.167% | 16.67% |

## P12.2 SLO Compliance Calculation Methods

**Method 1: Sliding Window (recommended for most services)**

Compliance is calculated over a rolling window of fixed duration (e.g., 30 days).
- At any point, compliance = good events / total events over last 30 days
- Advantages: Always represents current state, no window boundary effects
- Disadvantages: Takes 30 days to fully reflect after a change

Implementation:
```
slo_compliance_30d = (
    sum(good_events[now-30d:now]) / sum(total_events[now-30d:now])
)
```

**Method 2: Calendar Month Alignment (recommended for SLA reporting)**

Compliance is calculated per calendar month.
- Month 1: compliance = good events / total events for the month
- At end of month, a new compliance value starts for the next month
- Advantages: Aligns with external SLA reporting, easy to understand
- Disadvantages: Window boundary effects (bad luck at end of month)

Implementation:
```
slo_compliance_month = (
    sum(good_events[month_start:month_end]) / sum(total_events[month_start:month_end])
)
```

**Method 3: Exponentially Weighted Moving Average (EWMA)**

Gives more weight to recent events, less to older events.
- Recent events matter more than events from 25 days ago
- Advantages: Quickly reflects improvements, smooths out noise
- Disadvantages: Harder to explain, less intuitive

Implementation:
```
alpha = 2 / (window_days + 1)  # Smoothing factor
slo_compliance_ewma = 0
for each event (oldest to newest):
    if event is good:
        slo_compliance_ewma = (1 - alpha) * slo_compliance_ewma + alpha
    else:
        slo_compliance_ewma = (1 - alpha) * slo_compliance_ewma
```

**Method Comparison:**

| Method | Sensitivity to Recent | Smoothness | Intuitiveness | Recommended For |
|--------|----------------------|------------|---------------|-----------------|
| Sliding Window (30d) | Low | Medium | Medium | Primary SLO tracking |
| Calendar Month | Low | Medium | High | SLA reporting |
| EWMA | High | High | Low | Internal dashboards |
| Daily Compliance | Very High | Low | High | Operations dashboard |
| Weekly Compliance | Medium | Medium | High | Engineering reviews |

## P12.3 Multi-Service Composite SLO Calculator

**Python Implementation:**

```python
def calculate_composite_slo(services, topology_type):
    """
    Calculate composite SLO for a set of services.
    
    Args:
        services: list of dicts with keys name, slo, critical (bool)
        topology_type: serial | parallel | redundant
    
    Returns:
        dict with composite_slo, effective_budget, individual_contributions
    """
    if topology_type == "serial":
        composite = 1.0
        contributions = {}
        for svc in services:
            composite *= svc["slo"]
            contributions[svc["name"]] = svc["slo"]
        return {
            "composite_slo": composite,
            "effective_unavailability": 1 - composite,
            "individual_contributions": contributions,
            "budget_seconds_30d": (1 - composite) * 2592000
        }
    
    elif topology_type == "parallel":
        composite = 1.0
        contributions = {}
        for svc in services:
            if svc.get("critical", True):
                composite *= svc["slo"]
                contributions[svc["name"]] = svc["slo"]
            else:
                # Non-critical parallel path improves composite
                failure_impact = (1 - svc["slo"]) * 0.1  # 10% impact
                composite *= (1 - failure_impact)
                contributions[svc["name"]] = 1 - failure_impact
        return {
            "composite_slo": composite,
            "effective_unavailability": 1 - composite,
            "individual_contributions": contributions,
            "budget_seconds_30d": (1 - composite) * 2592000
        }
    
    elif topology_type == "redundant":
        # At least one of the redundant services must succeed
        # Composite = 1 - product of (1 - slo_i) for redundant paths
        redundant_paths = [svc for svc in services if svc.get("redundant", False)]
        all_fail = 1.0
        for svc in redundant_paths:
            all_fail *= (1 - svc["slo"])
        
        # Other services are serial
        serial_services = [svc for svc in services if not svc.get("redundant", False)]
        serial_composite = 1.0
        for svc in serial_services:
            serial_composite *= svc["slo"]
        
        redundant_composite = 1 - all_fail
        composite = serial_composite * redundant_composite
        
        return {
            "composite_slo": composite,
            "serial_contribution": serial_composite,
            "redundant_contribution": redundant_composite,
            "effective_unavailability": 1 - composite,
            "budget_seconds_30d": (1 - composite) * 2592000
        }

# Example usage
checkout_services = [
    {"name": "frontend-api", "slo": 0.9995, "critical": True},
    {"name": "auth-service", "slo": 0.9999, "critical": True},
    {"name": "cart-service", "slo": 0.9995, "critical": True},
    {"name": "payment-gateway", "slo": 0.9999, "critical": True},
    {"name": "inventory-service", "slo": 0.9995, "critical": True},
    {"name": "notification", "slo": 0.999, "critical": False}
]

result = calculate_composite_slo(checkout_services, "serial")
print(f"Composite SLO: {result['composite_slo']:.4%}")
print(f"Monthly budget: {result['budget_seconds_30d']:.0f} seconds")

# Output:
# Composite SLO: 99.74%
# Monthly budget: 6723 seconds (112 minutes)
```

## P12.4 Error Budget Policy Enforcement Automation

**Automated Policy Enforcer Script:**

```python
#!/usr/bin/env python3
"""
Error Budget Policy Enforcer
Runs as a CI/CD gate to check error budget before deployments.
Also runs as a cron job to alert when budgets are critical.
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List

class ErrorBudgetEnforcer:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = json.load(f)
    
    def get_budget_state(self, service: str) -> Dict:
        """Query monitoring system for current error budget state."""
        # In production, this would call Prometheus/Datadog API
        # Example implementation:
        response = self._query_prometheus(
            f'slo_budget_remaining{{service="{service}", window="30d"}}'
        )
        budget_remaining = float(response[0]["value"])
        
        response = self._query_prometheus(
            f'slo_burn_rate{{service="{service}", window="1h"}}'
        )
        burn_rate_1h = float(response[0]["value"])
        
        return {
            "service": service,
            "budget_remaining": budget_remaining,
            "burn_rate_1h": burn_rate_1h,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _query_prometheus(self, query: str) -> List:
        """Execute Prometheus query and return results."""
        # In production: use requests library to call Prometheus API
        pass
    
    def evaluate_release_gate(self, service: str, min_budget: float = 0.25) -> Dict:
        """Evaluate whether a release can proceed."""
        state = self.get_budget_state(service)
        
        if state["budget_remaining"] >= 0.50:
            return {
                "decision": "PASS",
                "state": state,
                "reason": "Budget healthy",
                "action": "Release may proceed"
            }
        elif state["budget_remaining"] >= min_budget:
            return {
                "decision": "CONDITIONAL_PASS",
                "state": state,
                "reason": f"Budget at {state['budget_remaining']:.1%}",
                "action": "Manual approval required"
            }
        else:
            return {
                "decision": "BLOCK",
                "state": state,
                "reason": f"Budget critically low at {state['budget_remaining']:.1%}",
                "action": "Release blocked. Investigate budget consumption."
            }
    
    def send_alert(self, service: str, state: Dict):
        """Send alert for critical budget state."""
        # In production: use PagerDuty/OpsGenie API
        pass
    
    def run_cron_check(self):
        """Run periodic check for all services."""
        for service in self.config.get("services", []):
            state = self.get_budget_state(service["name"])
            thresholds = service.get("thresholds", {})
            
            critical_threshold = thresholds.get("critical", 0.25)
            emergency_threshold = thresholds.get("emergency", 0.10)
            
            if state["budget_remaining"] < emergency_threshold:
                self.send_alert(service["name"], state)
                print(f"EMERGENCY: {service['name']} budget at {state['budget_remaining']:.1%}")
            elif state["budget_remaining"] < critical_threshold:
                self.send_alert(service["name"], state)
                print(f"CRITICAL: {service['name']} budget at {state['budget_remaining']:.1%}")
            elif state["budget_remaining"] < 0.50:
                print(f"WARNING: {service['name']} budget at {state['budget_remaining']:.1%}")
    
    def generate_report(self) -> str:
        """Generate error budget status report."""
        report_lines = []
        report_lines.append("# Error Budget Status Report")
        report_lines.append(f"Generated: {datetime.utcnow().isoformat()}")
        report_lines.append("")
        report_lines.append("| Service | Budget Remaining | Burn Rate (1h) | Status |")
        report_lines.append("|---------|-----------------|-----------------|--------|")
        
        for service in self.config.get("services", []):
            state = self.get_budget_state(service["name"])
            status = "HEALTHY" if state["budget_remaining"] > 0.50 else \
                     "WARNING" if state["budget_remaining"] > 0.25 else \
                     "CRITICAL" if state["budget_remaining"] > 0.10 else \
                     "EMERGENCY"
            report_lines.append(
                f"| {service['name']} | {state['budget_remaining']:.1%} | "
                f"{state['burn_rate_1h']:.2f} | {status} |"
            )
        
        return "\n".join(report_lines)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Error Budget Policy Enforcer")
    parser.add_argument("--config", required=True, help="Path to config file")
    parser.add_argument("--service", help="Service to check")
    parser.add_argument("--min-budget", type=float, default=0.25, help="Minimum budget threshold")
    parser.add_argument("--check-release", action="store_true", help="Check release gate")
    parser.add_argument("--cron-check", action="store_true", help="Run periodic check")
    parser.add_argument("--generate-report", action="store_true", help="Generate status report")
    
    args = parser.parse_args()
    enforcer = ErrorBudgetEnforcer(args.config)
    
    if args.check_release:
        result = enforcer.evaluate_release_gate(args.service, args.min_budget)
        print(json.dumps(result, indent=2))
        sys.exit(0 if result["decision"] == "PASS" else 1)
    
    elif args.cron_check:
        enforcer.run_cron_check()
    
    elif args.generate_report:
        print(enforcer.generate_report())
```

**Example Configuration (error_budget_config.json):**

```json
{
    "services": [
        {
            "name": "checkout-api",
            "thresholds": {
                "warning": 0.50,
                "critical": 0.25,
                "emergency": 0.10
            },
            "slo_target": 0.999,
            "window_days": 30,
            "channels": ["pagerduty", "slack"],
            "owners": ["sre-team", "checkout-team"]
        },
        {
            "name": "payment-gateway",
            "thresholds": {
                "warning": 0.50,
                "critical": 0.25,
                "emergency": 0.10
            },
            "slo_target": 0.9999,
            "window_days": 30,
            "channels": ["pagerduty", "slack", "email"],
            "owners": ["sre-team", "payments-team"]
        }
    ],
    "global_settings": {
        "prometheus_url": "http://prometheus:9090",
        "alert_cooldown_minutes": 30,
        "max_alerts_per_hour": 3,
        "report_schedule": "0 */6 * * *"
    }
}
```

## P12.5 Self-Healing Automation Patterns

**Pattern 1: Auto-Restart on Crash**

Trigger: Process crash detected (liveness probe failure)
Action: Restart container/pod
Verification: Health check passes within 30 seconds
Escalation: If restart fails 3 times in 5 minutes → page on-call

```python
def auto_restart_handler(service_name, max_restarts=3, window_minutes=5):
    recent_restarts = get_recent_restarts(service_name, window_minutes)
    
    if len(recent_restarts) >= max_restarts:
        page_oncall(f"Auto-restart failed for {service_name}: "
                    f"{len(recent_restarts)} restarts in {window_minutes} minutes")
        return False
    
    restart_service(service_name)
    log_restart(service_name)
    
    if verify_health(service_name, timeout=30):
        return True
    else:
        page_oncall(f"Auto-restart initiated but {service_name} "
                    f"still unhealthy after 30 seconds")
        return False
```

**Pattern 2: Auto-Scale on Saturation**

Trigger: CPU > 80% for 5 minutes, or memory > 85% for 5 minutes
Action: Increase instance count by min(floor(current * 0.5), max_scale_up)
Verification: Utilization drops below 60% within 10 minutes
Cooldown: Wait 10 minutes before scaling again
Escalation: If utilization > 95% after scale-up → page on-call

```python
def auto_scale_handler(service_name, metrics):
    current_instances = get_instance_count(service_name)
    max_instances = get_max_instances(service_name)
    
    if current_instances >= max_instances:
        page_oncall(f"Cannot scale {service_name}: already at max {max_instances}")
        return False
    
    scale_up_by = max(1, int(current_instances * 0.5))
    new_count = min(current_instances + scale_up_by, max_instances)
    
    scale_service(service_name, new_count)
    log_scale_event(service_name, current_instances, new_count)
    
    # Verify
    time.sleep(120)  # Wait for new instances to warm up
    if get_cpu_utilization(service_name) < 0.60:
        return True
    else:
        if get_cpu_utilization(service_name) > 0.95:
            page_oncall(f"{service_name} CPU > 95% after auto-scale to {new_count}")
        return False
```

**Pattern 3: Auto-Rollback on Deployment Failure**

Trigger: Error rate > 2x baseline within 10 minutes of deployment
Action: Trigger rollback to previous version
Verification: Error rate returns to baseline within 5 minutes
Notification: Alert on-call + deployment channel

```python
def auto_rollback_handler(deployment_id, service_name, new_version):
    # Monitor metrics after deployment
    time.sleep(300)  # Initial observation period
    
    baseline_error_rate = get_baseline_error_rate(service_name)
    current_error_rate = get_error_rate(service_name)
    
    if current_error_rate > baseline_error_rate * 2:
        rollback_service(service_name)
        log_rollback(deployment_id, service_name, new_version)
        
        time.sleep(60)
        if get_error_rate(service_name) <= baseline_error_rate * 1.1:
            notify(f"Auto-rollback successful: {service_name} version {new_version}")
            return True
        else:
            page_oncall(f"Auto-rollback initiated but {service_name} "
                       f"error rate still elevated")
            return False
    
    return True
```

**Pattern 4: Auto-Certificate Renewal**

Trigger: TLS certificate expires in < 30 days
Action: Trigger certificate renewal via ACME/cert-manager
Verification: New certificate is valid and serving
Notification: Log renewal event

```python
def auto_cert_renewal_handler(domain):
    remaining_days = get_certificate_expiry_days(domain)
    
    if remaining_days <= 0:
        page_oncall(f"Certificate for {domain} has EXPIRED")
        return False
    
    if remaining_days <= 7:
        urgent = True
    elif remaining_days <= 30:
        urgent = False
    else:
        return True  # No action needed
    
    renew_certificate(domain)
    log_cert_renewal(domain)
    
    verification = verify_certificate(domain)
    if verification["valid"] and verification["days_to_expiry"] > remaining_days:
        if urgent:
            notify(f"Certificate renewed for {domain} ({remaining_days}d before expiry)")
        return True
    else:
        page_oncall(f"Certificate renewal FAILED for {domain}")
        return False
```

## P12.6 Chaos Engineering Experiment Library

**Experiment 1: Instance Failure**

```yaml
name: random-instance-kill
description: Kill a random instance to verify resilience
frequency: hourly
blast_radius: 1 instance per service per run
target: all Tier 1 services
steady_state:
  error_rate: < 0.1%
  p99_latency: < SLO_threshold
  budget_consumption_per_run: < 0.01%
abort_conditions:
  error_rate: > 1%
  p99_latency: > 2x SLO
  error_budget_consumed_per_run: > 0.1%
hypothesis: The service will continue to serve traffic within SLO when a single instance fails.
verification:
  - error_rate_stable: true
  - latency_within_SLO: true
  - remaining_instances_handle_load: true
  - circuit_breaker_not_open: true
rollback: Stop experiment, new instance will auto-start via replicaset
```

**Experiment 2: Network Latency Injection**

```yaml
name: inter-service-latency
description: Add 200ms latency between service A and service B
frequency: per_release
blast_radius: 10% of traffic between A and B
target: checkout-api → payment-gateway
parameters:
  latency_ms: 200
  jitter_ms: 50
  duration_seconds: 60
steady_state:
  checkout_error_rate: < 0.1%
  checkout_p99_latency: < 2000ms
  fallback_usage_rate: < 5%
abort_conditions:
  checkout_error_rate: > 5%
  payment_fallback_usage: > 50%
  checkout_p99_latency: > 5000ms
hypothesis: The circuit breaker will open after 5 failures, and the fallback (cached token) will serve requests within SLO.
verification:
  - circuit_breaker_opens: within 10 seconds
  - fallback_activates: within 10 seconds of open
  - checkout_success_rate: > 99.9% (using fallback)
  - circuit_breaker_closes: within 60 seconds of latency removed
```

**Experiment 3: Resource Exhaustion**

```yaml
name: cpu-stress-test
description: Stress CPU on one instance to test auto-scaling
frequency: weekly
blast_radius: 1 instance
target: checkout-api
parameters:
  cpu_target_percent: 90
  duration_seconds: 120
steady_state:
  auto_scaling_triggers: true
  remaining_instances: maintain SLO
  overall_error_rate: < 0.1%
abort_conditions:
  auto_scaling_does_not_trigger: within 5 minutes
  overall_p99_latency: > 2x SLO
  any_instance_OOM: true
hypothesis: Auto-scaling will add a new instance within 3 minutes of sustained high CPU.
verification:
  - auto_scaling_triggered: within 3 minutes
  - cpu_on_stressed_instance: > 80%
  - overall_error_rate: < 0.1%
  - new_instance_serving_traffic: within 5 minutes
```

**Experiment 4: Database Failover**

```yaml
name: database-primary-failover
description: Trigger database primary failover to test DR
frequency: quarterly
blast_radius: database primary (read-only during failover)
target: checkout-db-primary
steady_state_before:
  application_reads: working
  application_writes: working
  replication_lag: < 1 second
expected_behavior:
  writes_pause: 5-30 seconds during failover
  reads_continue: from read replicas
  writes_resume: after new primary promoted
  no_data_loss: confirmed
abort_conditions:
  failover_time: > 60 seconds
  data_inconsistency: detected
  writes_not_resuming: after 120 seconds
hypothesis: The database failover completes within 30 seconds with zero data loss. Application writes pause briefly but resume automatically.
verification:
  - failover_time: < 30 seconds
  - data_loss: 0 records
  - application_recovery: automatic within 60 seconds
  - no_corrupted_data: confirmed
```

**Chaos Experiment Runbook Template:**

```yaml
experiment:
  name: null
  id: null
  date: null
  owner: null
  approval: required / not_required
  
  hypothesis: null
  
  steady_state:
    error_rate: null
    latency_p99: null
    throughput: null
    budget_remaining: null
  
  design:
    type: instance_kill / latency_injection / resource_exhaustion / dependency_failure / db_failover / region_failure
    target: null
    parameters: {}
    blast_radius: null
    duration: null
  
  abort_conditions:
    error_rate: null
    latency: null
    budget_consumption: null
    user_impact: Any customer-reported issue
  
  rollback_plan:
    action: Stop experiment immediately
    verification: null
    max_recovery_time: null
  
  results:
    hypothesis_confirmed: true / false / partially
    steady_state_maintained: true / false
    unexpected_behaviors: []
    action_items: []
```

## P12.7 Production Readiness Review Detailed Checklist

**Complete PRR Evidence Requirements:**

Each checklist item must have supporting evidence. The following table specifies what evidence is acceptable for each category.

| Category | Item | Acceptable Evidence | Not Acceptable |
|----------|------|-------------------|----------------|
| Monitoring | RED metrics exported | Link to dashboard showing metrics | "Will add later" |
| Monitoring | Health check endpoints | API response from /healthz, /readyz | "They exist" |
| Monitoring | Distributed tracing | Screenshot of trace in Jaeger/DataDog | "We use tracing" |
| Alerting | Burn rate alerts | Link to alert rule configuration | "We have alerts" |
| Alerting | Runbooks exist | Links to runbook documents | "We know what to do" |
| SLOs | SLO targets defined | Link to SLO charter document | "They are documented" |
| SLOs | Error budget tracking | Link to SLO dashboard showing budget | "We track it" |
| Incident Mgmt | Severity taxonomy | Link to severity definitions document | "We know the levels" |
| Incident Mgmt | Postmortem template | Link to postmortem template | "We have one" |
| Capacity | Load test results | Link to load test report with metrics | "We load tested" |
| Capacity | Auto-scaling configured | Link to HPA/auto-scaling configuration | "It auto-scales" |
| Dependencies | Circuit breakers | Link to circuit breaker code/configuration | "We handle failures" |
| Dependencies | Timeouts configured | Link to timeout configuration file | "Defaults are fine" |
| Deployment | Rollback procedure | Link to rollback runbook | "We can rollback" |
| Deployment | Canary deployment | Link to canary pipeline configuration | "We do canary" |
| Reliability | Graceful degradation | Link to degradation implementation code | "We handle it" |
| Reliability | Rate limiting | Link to rate limit configuration | "We have limits" |
| Reliability | Data backup | Link to backup schedule and verification | "Backups run" |
| DR | RTO/RPO defined | Link to DR plan document | "We have DR" |
| DR | DR test results | Link to last DR test report | "DR works" |
| Documentation | Architecture diagram | Link to current architecture diagram | "Diagram exists" |
| Documentation | On-call runbooks | Link to runbook repository | "We have runbooks" |
| Security | TLS configured | SSL Labs test result or cert scan | "TLS is on" |
| Security | Secrets management | Link to vault/KMS configuration | "Secrets are secure" |

**PRR Scoring Rubric:**

| Score | Description | Evidence Required | Action |
|-------|-------------|-------------------|--------|
| 1 - Not started | No capability exists | No evidence | Critical gap, must create |
| 2 - Basic | Minimal capability, manual | Script exists, no automation | Needs improvement |
| 3 - Defined | Functional, documented | Documented process, some automation | Acceptable for Tier 2+ |
| 4 - Measured | Automated, monitored | Automated with metrics, dashboards | Target for Tier 1 |
| 5 - Optimized | Self-healing | Automatic remediation, no manual steps | Target for Tier 0 |

**PRR Minimum Score Requirements by Service Tier:**

| Category | Tier 0 | Tier 1 | Tier 2 | Tier 3 |
|----------|--------|--------|--------|--------|
| Monitoring | 4 | 3 | 3 | 2 |
| Alerting | 4 | 3 | 3 | 2 |
| Incident Mgmt | 4 | 3 | 3 | 2 |
| SLOs | 4 | 4 | 3 | 2 |
| Capacity | 4 | 3 | 3 | 2 |
| Dependencies | 4 | 3 | 3 | 2 |
| Deployment | 4 | 3 | 3 | 2 |
| Documentation | 4 | 3 | 3 | 2 |
| Security | 5 | 4 | 3 | 3 |
| DR | 4 | 3 | 2 | 1 |
| Total minimum | 4.1 | 3.2 | 2.9 | 2.0 |

## P12.8 Feature Flag Reliability Patterns

Feature flags provide runtime control over feature activation, enabling progressive rollouts, kill switches, and configuration changes without redeployment.

**Feature Flag Types:**

| Type | Description | Lifetime | Risk | Example |
|------|-------------|----------|------|---------|
| Release toggle | Controls feature rollout | Short (days-weeks) | Low | Enable new checkout flow for 1% of users |
| Experiment toggle | A/B test groups | Short (weeks) | Low | Test two recommendation algorithms |
| Ops toggle | Runtime configuration | Long (months-years) | Medium | Enable/disable debug logging |
| Permission toggle | Per-user feature access | Permanent | Low | Enable beta features for internal users |
| Kill switch | Emergency disable | Permanent | Low | Disable a feature that is causing errors |

**Feature Flag Configuration:**

```yaml
feature_flags:
  provider: launchdarkly / unleash / custom
  storage: redis_cluster
  
  flags:
    - name: new-checkout-flow
      type: release_toggle
      owners: [checkout-team]
      lifetime: 6_weeks
      targeting:
        - segment: internal_users
          enabled: true
        - segment: beta_users
          enabled: true
        - segment: all_users
          enabled: false
          rollout_percentage: 0
      rules:
        - condition: user.tier == "premium" AND random(0,100) < 5
          enabled: true
  
  kill_switches:
    - name: disable-payment-gateway-call
      description: Emergency kill switch for payment gateway
      monitored: true
      alert_on_activation: true
      auto_reset: false
      owners: [sre-oncall]
```

**Feature Flag Best Practices:**
- All flags must have owners and expiry dates
- Expired flags must be removed (prevent tech debt)
- Flag evaluation must be fast (sub-millisecond, cached)
- Flag changes must be logged with audit trail
- Kill switches must alert on-call when activated
- Test both flag states (on and off) in CI/CD
- Limit flag count per service (target < 20 active flags)
- Flag evaluation must not fail open to insecure state
- Use flag change notifications for ops toggles
- Monitor flag evaluation latency (should not increase p99)

**Feature Flag Reliability Metrics:**

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Flag evaluation latency (p99) | < 1ms | > 5ms | > 10ms |
| Flag evaluation errors | 0/min | > 1/min | > 10/min |
| Stale flags (past expiry) | 0 | > 5 | > 20 |
| Kill switch activations | 0/month | > 1/month | > 3/month |
| Flag count per service | < 20 | > 30 | > 50 |

## P12.9 Kubernetes Reliability Patterns for SRE

**Pod-Level Reliability:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-api
  namespace: production
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
      - name: checkout-api
        image: checkout-api:v2.3.1
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        startupProbe:
          httpGet:
            path: /startupz
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 2
          failureThreshold: 30
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 30 && /bin/graceful-shutdown"]
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: checkout-api
              topologyKey: kubernetes.io/hostname
```

**Pod Disruption Budgets:**

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: checkout-api-pdb
  namespace: production
spec:
  minAvailable: 8  # At least 8 pods must always be available
  selector:
    matchLabels:
      app: checkout-api
```

**Horizontal Pod Autoscaler:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 10
  maxReplicas: 50
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
      - type: Pods
        value: 4
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 25
        periodSeconds: 60
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

**Kubernetes SRE Best Practices:**
- Set resource requests and limits for all containers
- Use PodDisruptionBudgets for all production workloads
- Configure topology spread constraints for zone redundancy
- Use pod anti-affinity for multi-instance services
- Implement graceful shutdown with preStop hooks
- Set proper liveness, readiness, and startup probes
- Use HPA with conservative scale-up, slow scale-down
- Enable cluster autoscaler for node-level capacity
- Use network policies for pod-level segmentation
- Implement pod security standards (Pod Security Admission)
- Use priority classes for critical vs. best-effort workloads
- Monitor: pod restart rate, OOM kills, evictions, scheduling failures

**Kubernetes Reliability Metrics to Monitor:**

| Metric | Source | Warning | Critical |
|--------|--------|---------|----------|
| Pod restart rate (per service) | kube-state-metrics | > 1/min | > 5/min |
| Pending pods | kube-state-metrics | > 0 for 5min | > 5 |
| OOM kills | kubelet metrics | > 0 | > 3/min |
| Evictions | kube-state-metrics | > 0 | > 1 |
| Node readiness | kube-state-metrics | < 95% | < 90% |
| API server latency | apiserver metrics | > 1s p99 | > 5s p99 |
| Scheduling failures | scheduler metrics | > 0 | > 5 |
| HPA maxed out | custom metrics | > 80% of max | 100% of max |

## P12.10 Database Reliability Patterns for SRE

**Connection Pool Configuration:**

```yaml
database:
  provider: postgresql / mysql
  connection_pool:
    min_size: 10
    max_size: 100
    max_lifetime: 1800s       # 30 minutes max connection lifetime
    idle_timeout: 600s        # 10 minutes idle timeout
    connection_timeout: 5s    # 5 seconds to establish connection
    leak_detection_threshold: 600s  # Warn on connections held > 10 min
    queue_max_size: 50        # Max queued connection requests
    validation_query: SELECT 1  # Connection health check query
  
  retry:
    max_attempts: 3
    base_delay: 100ms
    max_delay: 5s
    retryable_errors:
      - 40001        # Serialization failure
      - 40P01        # Deadlock detected
      - 57P01        # Admin shutdown
      - 08P01        # Protocol violation
      - 08000        # Connection exception
      - 08003        # Connection does not exist
      - 08006        # Connection failure
    non_retryable_errors:
      - 23505        # Unique violation
      - 22000        # Data exception
      - 42XXX        # Syntax error
```

**Database Migration Strategy:**

```yaml
migration:
  strategy: expand_migrate_contract  # EMC pattern
  phases:
    expand:
      - Add new columns (nullable)
      - Add new tables
      - Create new indexes (concurrently)
      - Add new foreign keys (NOT VALID, then VALIDATE)
    migrate:
      - Backfill new columns (batch, throttled)
      - Dual-write to old and new columns
      - Run data validation between old and new
    contract:
      - Remove dual-write (write only to new)
      - Drop old columns
      - Drop old tables
      
  safety:
    max_downtime_per_migration: 0s  # Zero-downtime migration
    batch_size: 1000                # Rows per batch for backfill
    batch_delay: 100ms              # Delay between batches
    max_lag_threshold: 5s           # Max replication lag during migration
    rollback_script: always_required
    pre_migration_checks:
      - disk_space_available: > 10GB
      - replication_lag: < 5s
      - cpu_utilization: < 70%
      - connection_count: < 80% of max
    
    post_migration_checks:
      - schema_consistency: verified
      - data_integrity: verified
      - performance_degradation: < 10%
      - error_rate: < baseline * 1.1
```

**Database Backup & Recovery Strategy:**

| Service Tier | Backup Frequency | Retention | Recovery Method | RTO | RPO |
|-------------|-----------------|-----------|-----------------|-----|-----|
| Tier 0 | Continuous (WAL archiving) | 30 days + 1 year monthly | Point-in-time recovery | < 15 min | < 1 min |
| Tier 1 | Hourly full + WAL | 14 days + 6 months monthly | Point-in-time recovery | < 1 hour | < 5 min |
| Tier 2 | Daily full | 7 days + 3 months monthly | Full restore | < 4 hours | < 1 hour |
| Tier 3 | Weekly full | 30 days | Full restore | < 24 hours | < 24 hours |

**Database Reliability Monitors:**

| Monitor | Metric | Warning | Critical | Action |
|---------|--------|---------|----------|--------|
| Connection pool | Active / max | > 75% | > 90% | Scale up or investigate leaks |
| Replication lag | Seconds behind | > 10s | > 60s | Check network, load on primary |
| Query latency | p99 query time | > 100ms | > 500ms | Identify slow queries |
| Table bloat | % wasted space | > 20% | > 40% | Schedule VACUUM/REINDEX |
| Deadlocks | Count per minute | > 1/min | > 10/min | Investigate lock contention |
| Long-running queries | Duration | > 30s | > 5min | Kill or optimize query |
| Disk utilization | % used | > 75% | > 90% | Add storage or archive data |
| Cache hit ratio | Buffer cache | < 95% | < 90% | Increase shared buffers |
| Connection errors | Count | > 0 | > 10/min | Check network, auth |
| Replica health | Status | 1 replica down | > 1 down | Restore replicas |

## P12.11 Message Queue & Async Reliability Patterns

**Kafka Reliability Configuration:**

```yaml
kafka:
  cluster:
    replication_factor: 3
    min_insync_replicas: 2
  
  producer:
    acks: all                 # Wait for all in-sync replicas
    retries: 5
    enable_idempotence: true
    max_in_flight_requests_per_connection: 5
    compression: snappy
    linger_ms: 5
    batch_size: 16384
  
  consumer:
    group_id: checkout-consumer
    enable_auto_commit: false  # Manual offset management
    auto_offset_reset: earliest
    max_poll_records: 500
    max_poll_interval_ms: 300000
    session_timeout_ms: 45000
    heartbeat_interval_ms: 15000
  
  topics:
    - name: orders
      partitions: 12
      replication_factor: 3
      retention_ms: 604800000  # 7 days
      cleanup_policy: delete
      configs:
        min.insync.replicas: 2
        cleanup.policy: delete
        compression.type: producer
```

**Dead Letter Queue Strategy:**

```yaml
dead_letter_queue:
  max_retries: 3
  retry_delays: [5s, 30s, 120s]
  dlq_topic: orders.dlq
  
  dlq_consumer:
    auto_start: false         # Manual DLQ reprocessing
    alert_on_message: true
    max_reprocessing_attempts: 2
    reprocess_delay: 3600s    # 1 hour before reprocessing DLQ
  
  monitoring:
    dlq_message_count:
      warning: > 100/hour
      critical: > 1000/hour
    dlq_age_oldest:
      warning: > 1 hour
      critical: > 24 hours
    reprocessing_success_rate:
      warning: < 90%
      critical: < 70%
```

**Async Reliability Metrics:**

| Metric | Measurement | Target | Alert |
|--------|-------------|--------|-------|
| Message production rate | Messages/sec | Track baseline | 50% drop or 300% spike |
| Message consumption rate | Messages/sec | Match production | Lag increases |
| Consumer lag | Messages behind | < 1000 | > 10000 (page) |
| Processing time | p99 | < 500ms | > 2s (page) |
| Error rate | % failed | < 0.1% | > 1% (page) |
| DLQ rate | Messages/hour | < 10 | > 100 (page) |
| Consumer group health | Active consumers | All assigned | Any offline (page) |
| Rebalance frequency | Rebalances/hour | < 1 | > 5 (warning) |

## P12.12 SLO Tuning & Adjustment Framework

SLO tuning is the process of adjusting targets based on empirical data and business needs.

**When to Tune SLOs:**

| Trigger | Action | Approval | Frequency |
|---------|--------|----------|-----------|
| Consistent 30%+ budget remaining | Consider tightening SLO | SRE + Product | Quarterly |
| Consistent budget exhaustion before window end | Consider loosening SLO | SRE + Product | Monthly |
| New feature launch with different reliability needs | Adjust SLO for new feature | SRE + Product | As needed |
| Infrastructure change (new region, new DB) | Review and adjust SLOs | SRE + Eng | As needed |
| SLA change (new contract, new tier) | Align internal SLO to SLA | SRE + Legal | As needed |
| Consistent violation of SLO without improvement | Investigate root cause, adjust SLO or fix service | SRE + Eng | ASAP |

**SLO Tuning Process:**

```
1. GATHER DATA (1 week)
   - Collect 3-6 months of SLI data
   - Analyze historical compliance patterns
   - Identify seasonal patterns (peak vs off-peak)
   - Calculate actual achievable SLO based on historical data
   
2. ANALYZE TRADE OFFS (1 week)
   - Current SLO vs actual performance
   - Cost of achieving tighter SLO
   - Business impact of looser SLO
   - Competitor benchmarks (if available)
   
3. PROPOSE CHANGE (1 day)
   - Draft new SLO targets with rationale
   - Calculate new error budget
   - Estimate impact on release velocity
   - Identify required engineering investment
   
4. REVIEW WITH STAKEHOLDERS (1 meeting)
   - Present proposal to product, engineering, SRE
   - Discuss tradeoffs and implications
   - Get sign-off from stakeholders
   
5. IMPLEMENT (1 week)
   - Update SLO targets in monitoring system
   - Update error budget calculations
   - Update alert thresholds (burn rates)
   - Communicate change to all stakeholders
   - Update SLO charter document
   
6. MONITOR (1-2 quarters)
   - Track compliance to new targets
   - Measure error budget consumption
   - Identify any unintended consequences
   - Report back to stakeholders
```

**SLO Adjustment Safety Rules:**

- Never adjust SLO targets more than 0.1% per quarter (prevent gaming)
- Any SLO loosening must be approved by product stakeholder
- Any SLO tightening must be feasible based on historical data
- SLO changes take effect at next compliance window boundary
- SLO changes must be documented with business rationale
- SLO changes must be communicated to all dependent teams
- External SLAs and internal SLOs must remain aligned

## P12.13 Request Costing & Capacity Budgeting

Request costing assigns a cost value to each request type for capacity planning and throttling.

**Request Cost Matrix:**

| Endpoint | Method | Cost Units | Typical Count | Total Cost % |
|----------|--------|-----------|--------------|--------------|
| /api/v1/search | GET | 5 | 40% | 50% |
| /api/v1/checkout | POST | 10 | 5% | 12.5% |
| /api/v1/products | GET | 2 | 30% | 15% |
| /api/v1/auth | POST | 1 | 15% | 3.75% |
| /api/v1/health | GET | 0.1 | 10% | 0.25% |

**Capacity Budgeting Formula:**

```
capacity_budget = total_capacity_cost_units / time_window

per_instance_capacity = instance_cost_units_per_second * instance_count

each_request = sum(cost_of_each_microservice_call_in_chain)

total_budget_consumed = sum(request_costs) over time window

remaining_capacity = (instance_count * cost_capacity_per_instance) - total_cost_consumed

scale_when = remaining_capacity < total_cost_consumed * 0.2  # 20% headroom
```

**Cost-Based Rate Limiting:**

```yaml
cost_based_ratelimit:
  algorithm: token_bucket_with_cost
  total_capacity: 10000       # Total cost units per second
  per_client_capacity: 1000   # Max cost per client per second
  
  per_request_cost:
    cost_base: 1              # Base cost per request
    cost_multipliers:
      - heavy_query: * 5
      - includes_image: * 3
      - includes_personalization: * 2
      - real_time_data: * 4
  
  enforcement:
    mode: adaptive
    when capacity > 80%:
      action: degrade_non_critical (reduce cost by 50%)
    when capacity > 90%:
      action: reject_low_priority_requests
    when capacity > 95%:
      action: reject_all_non_essential
```

## P12.14 SRE Incident Analysis & Metrics Framework

**Incident Metrics Taxonomy:**

```
MTTD (Mean Time to Detect):
  = Average time from incident start to first alert firing
  Components: monitoring_interval + detection_window + page_delivery
  Target: < 5 minutes for SEV0/SEV1

MTTA (Mean Time to Acknowledge):
  = Average time from page to human acknowledgment
  Components: notification_delivery + human_response
  Target: < 5 minutes for SEV0, < 15 minutes for SEV1

MTTR (Mean Time to Resolve):
  = Average time from incident start to mitigation
  Components: detection + diagnosis + decision + execution + verification
  Target: < 30 minutes for SEV0, < 4 hours for SEV1

MTBF (Mean Time Between Failures):
  = Average time between incidents
  Components: total_uptime / number_of_incidents
  Target: Increasing trend (fewer failures)

MTBR (Mean Time Between Releases):
  = Average time between production deployments
  Components: total_time / number_of_releases
  Target: Decreasing trend (more frequent releases)

MTTR Breakdown (for optimization):
  Detection: 15% of MTTR on average
  Diagnosis: 30% of MTTR on average  
  Decision: 20% of MTTR on average
  Execution: 25% of MTTR on average
  Verification: 10% of MTTR on average
```

**Incident Classification Schema:**

```yaml
incident_classification:
  primary_dimension: type
    - deployment_related
    - infrastructure_related  
    - dependency_related
    - configuration_related
    - capacity_related
    - design_flaw
    - human_error
    - security_related
    - environmental
  
  secondary_dimension: severity
    - sev0: complete_outage_or_data_loss
    - sev1: significant_degradation
    - sev2: partial_degradation
    - sev3: minor_impact
  
  tertiary_dimension: root_cause_category
    - testing_gap
    - monitoring_gap
    - capacity_gap
    - process_gap
    - knowledge_gap
    - automation_gap
    - design_gap
  
  quaternary_dimension: contributing_factors
    - change_without_review
    - insufficient_canary
    - missing_runbook
    - alert_not_configured
    - timeout_too_short
    - circuit_breaker_missing
    - document_outdated
    - manual_step_missed
```

**Incident Trend Analysis Report (Quarterly):**

```
INCIDENT TRENDS Q1 2026

Total Incidents: 47 (vs 52 in Q4 2025, -9.6%)
SEV0: 1     SEV1: 6     SEV2: 18     SEV3: 22

MTTD: 3.2 min (target < 5 min) ✓
MTTA: 2.1 min (target < 5 min) ✓
MTTR: 22.4 min (target < 30 min) ✓

Top Causes:
1. Deployment-related: 15 (32%)  <-- Focus area
2. Capacity-related: 10 (21%)
3. Dependency-related: 8 (17%)
4. Configuration: 7 (15%)
5. Infrastructure: 5 (11%)
6. Other: 2 (4%)

Recurring Incidents (same root cause in last 12 months): 8
Recurrence Rate: 17% (target < 10%) ✗

Action Items from This Quarter:
- Total created: 52
- Closed within 30 days: 43 (83%)
- Overdue: 5 (10%)

Improvement Velocity:
- Toil reduction: -12% (47% → 35%)
- Automation coverage: +8% (62% → 70%)
- Alert SNR improvement: +0.15 (0.35 → 0.50)
```

## P12.15 SRE at Different Organizational Scales

**Startup SRE (1-50 engineers):**

| Challenge | Approach | Tradeoff |
|-----------|----------|----------|
| No dedicated SRE | DevOps model: everyone shares on-call | SRE skills spread thin |
| No SLOs | Focus on basic monitoring, define SLOs for top 2 services | Incomplete coverage |
| Manual operations | Accept toil, automate as you go | Higher toil ratio |
| Hero culture | Pair programming, document everything | Slower initially |
| Rapid change | Feature flags, CI/CD, simple canary | Rollbacks are common |

Recommended approach: Start with 1 SRE-minded engineer, implement SLOs for the top revenue-generating feature, use managed services to reduce operational burden.

**Growth Stage SRE (50-200 engineers):**

| Challenge | Approach | Tradeoff |
|-----------|----------|----------|
| First SRE team (3-5) | Centralized model, consulting to product teams | Bottleneck for reliability |
| SLO adoption growing | SLO design workshops for top 5 services | Inconsistent across teams |
| On-call burnout | Formal rotation (primary/secondary) | Need 5+ SREs minimum |
| Incident chaos | Severity taxonomy, postmortem process | Process overhead |
| Toil accumulating | Toil measurement, automation sprints | Takes time to reduce |

Recommended approach: Build a centralized SRE team, adopt error budgets for release gating, establish postmortem culture, implement MQL burn rate alerting.

**Enterprise SRE (200-1000+ engineers):**

| Challenge | Approach | Tradeoff |
|-----------|----------|----------|
| SRE team of 10-30 | Mixed model: embedded + central | Coordination overhead |
| Hundreds of services | Service tiers, prioritized SRE engagement | Some services have no SRE |
| Regulatory compliance | SRE practices must meet compliance standards | Process overhead |
| Multi-region, global | Follow-the-sun on-call, regional SRE teams | Communication complexity |
| Legacy systems | Wrapping, strangler fig, gradual migration | Inefficiency during transition |

Recommended approach: Tier all services, focus SRE on Tier 0-1, use consulting model for Tier 2-3, establish SRE Center of Excellence, adopt platform SRE model.

**Platform SRE Model:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLATFORM SRE MODEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Central SRE Platform Team                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ - Tooling & Automation (monitoring, alerting, CI/CD)     │    │
│  │ - SRE Standards & Best Practices                         │    │
│  │ - Training & Enablement                                  │    │
│  │ - SRE Advisory (consulting to product teams)             │    │
│  │ - On-Call Escalation (Level 2+)                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Service-Specific SRE (Embedded in Product Teams)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ SRE Team │ │ SRE Team │ │ SRE Team │ │ SRE Team │           │
│  │   A      │ │   B      │ │   C      │ │   D      │           │
│  │ Checkout │ │ Search   │ │ Auth     │ │ Payments │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  On-Call Structure                                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Level 0: Product team on-call (primary for their service)│    │
│  │ Level 1: Embedded SRE (secondary for their service)      │    │
│  │ Level 2: Platform SRE on-call (escalation for all)       │    │
│  │ Level 3: SRE management (executive escalation)           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

# P13: Game Day & Chaos Engineering Program Management

## P13.1 Game Day Program Design

Game Days are structured, planned exercises where teams practice incident response in a controlled environment. Unlike chaos engineering experiments which are automated and continuous, Game Days are manual, scheduled events focused on team readiness.

**Game Day Types:**

| Type | Duration | Participants | Focus | Frequency |
|------|----------|-------------|-------|-----------|
| Tabletop | 1-2 hours | On-call team | Process walkthrough | Monthly |
| Simulation | 2-4 hours | Full response team | Practice response | Quarterly |
| Full-scale | 4-8 hours | Multiple teams + stakeholders | End-to-end readiness | Bi-annually |
| Surprise | 1-4 hours | On-call team (unannounced) | Realistic readiness | Annually |
| Integration | 2-3 hours | Multiple service teams | Cross-team coordination | Quarterly |
| Vendor failover | 3-6 hours | SRE + Vendor | Vendor DR validation | Annually |

**Game Day Planning Template:**

```
GAME DAY: [Name]
Date: [YYYY-MM-DD]
Duration: [Hours]
Type: [Tabletop / Simulation / Full-scale]
Facilitator: [Name]
Participants: [List of teams/roles]

SCENARIO
Primary Scenario: [Description of the failure scenario]
Secondary Scenario: [Complication that occurs during primary]
Environment: [Production / Staging / Sandbox]

OBJECTIVES
1. [Objective 1 - measurable]
2. [Objective 2 - measurable]
3. [Objective 3 - measurable]

SCHEDULE
00:00 - 00:15: Briefing (scenario overview, roles, rules)
00:15 - 00:30: Scenario injection
00:30 - 01:30: Response phase (detection, triage, mitigation)
01:30 - 02:00: Recovery phase (verification, monitoring)
02:00 - 02:30: Debrief (what went well, what went wrong, lessons)
02:30 - 03:00: Action item creation

METRICS TO CAPTURE
- Time to detect: [target]
- Time to acknowledge: [target]
- Time to mitigate: [target]
- Communication cadence: [target]
- Runbook adherence: [target]
- Escalation correctness: [target]

INJECTION METHOD
- [ ] Manual: Facilitator announces scenario
- [ ] Automated: Chaos engineering tool injects failure
- [ ] Hybrid: Automated failure + manual complications

ABORT CONDITIONS
- Real incident occurs during Game Day → terminate immediately
- SLO violation risk → reduce blast radius
- Team distress → pause and debrief

POST-GAME DELIVERABLES
- Game Day report with metrics
- Action items (tracked in sprint)
- Runbook updates (if gaps found)
- Training needs identified
```

**Game Day Scenario Library:**

| Scenario | Description | Difficulty | Duration | Skills Tested |
|----------|-------------|------------|----------|---------------|
| Database primary failure | DB becomes unresponsive | Medium | 1-2 hours | Failover, read-replica |
| Cascading failure | One service failure cascades | Hard | 2-3 hours | Circuit breaker, bulkhead |
| Region outage | Entire region goes down | Hard | 3-4 hours | DR plan, DNS failover |
| Certificate expiry | TLS cert expires | Easy | 30-60 min | Monitoring, renewal process |
| Traffic spike | 10x unexpected traffic | Medium | 1-2 hours | Auto-scaling, rate limiting |
| Data corruption | Database data corrupted | Hard | 2-3 hours | Backup/restore, PITR |
| Multi-service outage | 3+ services fail simultaneously | Hard | 3-4 hours | Incident command, coordination |
| Deployment gone wrong | Bad deployment reaches production | Easy | 1 hour | Rollback, canary analysis |
| Third-party dependency fails | Critical upstream API down | Medium | 1-2 hours | Circuit breaker, fallback |
| Network partition | Internal network split | Hard | 2-3 hours | Partition tolerance, consistency |

**Game Day Scoring Rubric:**

| Criterion | 1 - Needs Improvement | 3 - Meets Expectations | 5 - Exemplary |
|-----------|----------------------|----------------------|---------------|
| Detection time | > 10 min | 3-5 min | < 2 min |
| Severity classification | Incorrect | Correct with delay | Immediately correct |
| Runbook usage | Not used | Used partially | Followed completely |
| Communication | Sporadic | Regular (every 30 min) | Continuous, clear |
| Escalation | Missed | Correct | Correct + proactive |
| Mitigation | > 1 hour | 15-30 min | < 10 min |
| Post-incident actions | No action items | Action items created | SMART action items tracked |

## P13.2 Chaos Engineering Program Maturity

**Program Maturity Path:**

```
Level 1: Ad-hoc (Month 1-2)
- Manual experiments
- Pre-announced, planned
- Single service, single failure mode
- Focus: Build team confidence

Level 2: Scheduled (Month 3-6)
- Automated experiments on schedule
- Multiple failure modes
- Pre-announced, run during business hours
- Focus: Find unknown failure modes

Level 3: Continuous (Month 6-12)
- Automated experiments in CI/CD
- Runs with every release
- Multiple services
- Focus: Validate every change

Level 4: Proactive (Month 12-18)
- Experiment-driven optimization
- Predictive chaos (inject what might fail)
- Cross-service, cross-region
- Focus: Prevent failures before they happen

Level 5: Autonomous (Month 18+)
- Self-healing driven by experiments
- Auto-generated experiments from incident data
- Automatic rollback of experiments that degrade SLOs
- Focus: Self-managing reliability
```

**Chaos Engineering Program Metrics:**

| Metric | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|--------|---------|---------|---------|---------|---------|
| Experiments/week | 1 | 5 | 20+ | 50+ | 100+ |
| Coverage (% of services) | 10% | 30% | 60% | 80% | 95%+ |
| Automated experiments | 0% | 30% | 80% | 95% | 100% |
| Blast radius (max) | 1 instance | 1 AZ | 1 AZ | Cross-AZ | Multi-region with abort |
| Action items from experiments | Monthly | Bi-weekly | Weekly | Per experiment | Continuous |
| SLO violations from experiments | Expected | < 1/month | < 1/quarter | 0 | 0 |

**Chaos Engineering Tool Selection Criteria:**

| Criterion | Priority | Chaos Mesh | Gremlin | Litmus | Custom |
|-----------|----------|------------|---------|--------|--------|
| Open source | High | Yes | No | Yes | N/A |
| Kubernetes native | High | Yes | Yes | Yes | Depends |
| Failure types | Medium | 10+ | 20+ | 15+ | Unlimited |
| Blast radius control | High | Yes | Yes | Yes | Yes |
| Steady-state validation | Medium | Yes | Yes | Yes | Custom |
| CI/CD integration | Medium | Yes | Yes | Yes | Custom |
| Cost | Medium | Free | Paid | Free | High dev cost |
| Community | Medium | Large | Medium | Large | None |

## P13.3 Blast Radius Management

Blast radius is the scope of impact a chaos experiment or Game Day can have on real users and systems.

**Blast Radius Levels:**

| Level | Scope | User Impact | When to Use | Abort Condition |
|-------|-------|-------------|-------------|-----------------|
| L1 | 1 pod/instance | None (others handle load) | Every hour | N/A (minimal impact) |
| L2 | 1 AZ / 1 service | Degraded performance possible | Per release | Error rate > 2x baseline |
| L3 | Multiple AZs / 1 region | Temporary, partial degradation | Monthly | Error budget > 1% consumed |
| L4 | Full region failover | Read-only or backup service | Quarterly | Customer-reported issues |
| L5 | Cross-region failover | Potential brief outage | Annually | SLO violation imminent |

**Blast Radius Safety Controls:**

```
SAFETY CONTROLS

Technical Controls:
1. Feature flags for experiment injection (can be disabled instantly)
2. Traffic shadowing (experiment on mirrored traffic, not real)
3. Instance isolation (dedicated experiment instances)
4. Automatic abort triggers (metric-based)
5. Circuit breakers on experiment infrastructure
6. Canary experiment instances (10% before 100%)

Process Controls:
1. Approvals required (level-dependent)
   - L1: No approval needed (automated)
   - L2: SRE team lead approval
   - L3: Engineering manager + SRE lead approval
   - L4: Director of Engineering approval
   - L5: VP Engineering + CTO approval
2. Blackout periods (no experiments during peak traffic)
3. Service blacklist (Tier 0 services excluded from certain experiments)
4. Time window restrictions (experiments only during business hours)
5. Notification requirements (affected teams informed in advance)

Monitoring Controls:
1. Real-time experiment dashboard
2. SLO compliance check during experiment
3. Error budget consumption tracking
4. User impact monitoring (support ticket spike)
5. Revenue impact tracking (if measurable)
```

---

# P14: SRE Organization Design & Operating Model

## P14.1 SRE Team Structures

**Centralized SRE Team:**

```
┌──────────────────────────────┐
│       VP of Engineering      │
└──────────────────────────────┘
              │
┌──────────────────────────────┐
│     Director of SRE          │
└──────────────────────────────┘
              │
┌────────────────────────────────────────────────────┐
│                 SRE Team (8-12)                     │
├─────────────┬─────────────┬─────────────┬──────────┤
│ Reliability │ Observability│ Incident    │ Platform │
│ Engineering │ Engineering  │ Management  │ SRE      │
│ (3-4)       │ (2-3)        │ (1-2)       │ (2-3)    │
└─────────────┴─────────────┴─────────────┴──────────┘
```

**Embedded SRE Model:**

```
┌─────────────────────────────────────────────────────┐
│                   Engineering VP                      │
├──────────┬──────────┬──────────┬──────────┬──────────┤
│ Team A   │ Team B   │ Team C   │ Team D   │ Platform │
│ (Product)│ (Product)│ (Product)│ (Product)│ (Infra)  │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ SRE (1)  │ SRE (1)  │ SRE (1)  │ SRE (1)  │ SRE (2)  │
│ Dev (8)  │ Dev (8)  │ Dev (6)  │ Dev (10) │ Infra (5)│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Federated SRE Model (Large Organizations):**

```
┌─────────────────────────────────────────────────────┐
│           SRE Center of Excellence (4-6)              │
│  Standards, Training, Advanced Troubleshooting        │
│  Cross-team coordination, Tooling                    │
└─────────────────────────────────────────────────────┘
              │
┌─────────────────────────────────────────────────────┐
│            Business Unit SRE Teams (4-8 each)        │
├───────────────┬───────────────┬──────────────────────┤
│ BU1 SRE Team  │ BU2 SRE Team  │ BU3 SRE Team         │
│ - Embedded     │ - Embedded     │ - Consulting model   │
│ - Checkout     │ - Search       │ - Internal tools    │
│ - Payments     │ - Recommend    │ - Admin systems     │
│ 4 SREs         │ 3 SREs         │ 2 SREs              │
└───────────────┴───────────────┴──────────────────────┘
```

## P14.2 SRE Role Definitions

**SRE Career Ladder:**

| Level | Title | Yrs Exp | Scope | Key Responsibilities |
|-------|-------|---------|-------|---------------------|
| L3 | SRE Engineer I | 0-2 | Single service | Monitoring, alerting, on-call, basic automation |
| L4 | SRE Engineer II | 2-4 | Multiple services | SLO design, capacity planning, incident command |
| L5 | Senior SRE | 4-7 | Team/domain | PRR, automation strategy, mentoring, chaos engineering |
| L6 | Staff SRE | 7-10 | Organization | SRE strategy, multi-team coordination, standards |
| L7 | Principal SRE | 10+ | Company-wide | SRE vision, culture change, industry influence |
| L8 | Distinguished SRE | 15+ | Industry | Thought leadership, novel reliability patterns |

**SRE Role Responsibilities Matrix:**

| Responsibility | L3 | L4 | L5 | L6 | L7+ |
|----------------|----|----|----|----|-----|
| On-call rotation | Primary | Primary | Secondary | Escalation | None |
| Incident response | Participant | IC | IC/Mentor | Process design | Strategy |
| SLO design | Attend | Lead | Review | Standards | Vision |
| Monitoring/alerting | Implement | Design | Review | Standards | Strategy |
| Automation | Scripts | Tools | Platform | Strategy | Vision |
| Capacity planning | Data gather | Forecast | Model | Process | Strategy |
| Chaos engineering | Execute | Design | Program lead | Strategy | Vision |
| PRR | Participate | Lead | Review | Process | Standards |
| Postmortems | Write | Review | Action tracking | Quality | Culture |
| Mentoring | — | Junior | Team | Multi-team | Organization |
| Cross-team coordination | — | — | Lead | Facilitate | Executive |

## P14.3 SRE Staffing & Hiring

**SRE-to-Dev Ratio by Organization Maturity:**

| Maturity | SRE:Dev Ratio | Configuration | Notes |
|----------|--------------|---------------|-------|
| Initial | 1:20 - 1:10 | Centralized SRE team | Focus on foundations |
| Developing | 1:10 - 1:6 | Mixed: central + embedded | Growing coverage |
| Established | 1:6 - 1:4 | Mostly embedded | Deep integration |
| Mature | 1:4 - 1:3 | Platform SRE model | Full coverage |
| Leading | 1:3 - 1:2 | Autonomous operations | Self-managing |

**Minimum SRE Team Size Calculator:**

```
def min_sre_team_size(on_call_frequency, backup_coverage, vacation_allowance):
    """
    Calculate minimum SRE team size for sustainable on-call.
    
    on_call_frequency: max weeks per year on primary (target: 12 = 1 week/month)
    backup_coverage: number of concurrent responders (primary + secondary)
    vacation_allowance: weeks per year per person
    """
    weeks_per_year = 52
    weeks_per_person = weeks_per_year - vacation_allowance
    max_shifts_per_person = weeks_per_person / on_call_frequency * backup_coverage
    
    # Need to cover all weeks with N concurrent shifts
    required = (weeks_per_year * backup_coverage) / max_shifts_per_person
    
    # Round up and add buffer
    return math.ceil(required) + 1

# Example: 1 week on-call per month (12/yr), primary+secondary (2), 4 weeks vacation
# min_sre_team_size(12, 2, 4) = math.ceil(104/80) + 1 = 3 => but needs 5 minimum for rotation

# Practical minimums:
# - 24/7 on-call with primary+secondary: minimum 5-6 people
# - Business hours only on-call: minimum 3-4 people
# - Follow-the-sun (global): minimum 3 people per region
```

**SRE Hiring Rubric:**

| Competency | Assessment Method | Minimum Pass Level |
|------------|------------------|-------------------|
| Systems thinking | Architecture design exercise | L3: Can identify single points of failure |
| Coding/automation | Take-home project or pair programming | L3: Can write production-quality automation |
| Incident management | Scenario-based interview | L4: Can lead incident response effectively |
| SLO/SLI design | Case study presentation | L4: Can design SLOs with tradeoff analysis |
| Capacity planning | Forecasting exercise | L3: Can create basic capacity model |
| Communication | Stakeholder presentation | L4: Can explain technical concepts to executives |
| Culture fit | Values alignment interview | L3: Blameless, learning-oriented, collaborative |

**SRE Interview Components:**

| Round | Duration | Focus | Who |
|-------|----------|-------|-----|
| Phone screen | 45 min | Background, SRE principles, motivation | SRE manager |
| Technical screen | 60 min | Coding, debugging, system design | Senior SRE |
| On-site Round 1 | 60 min | Systems design (distributed systems) | Staff SRE |
| On-site Round 2 | 60 min | Incident management simulation | SRE manager |
| On-site Round 3 | 60 min | Coding/programming (automation focus) | Senior engineer |
| On-site Round 4 | 45 min | Behavioral & cultural fit | Hiring manager |
| On-site Round 5 | 45 min | Presentation (pre-assigned topic) | Panel |

## P14.4 SRE vs DevOps

**SRE vs DevOps Comparison:**

| Dimension | SRE | DevOps |
|-----------|-----|--------|
| Origin | Google, 2003 | Industry, 2009 (Patrick Debois) |
| Core focus | Reliability, error budgets, SLIs | CI/CD, collaboration, culture |
| Primary metric | SLO compliance, error budget | Deployment frequency, lead time |
| Approach | Engineering solutions to ops problems | Cultural and process change |
| Key practices | SLOs, error budgets, toil reduction, chaos | CI/CD, IaC, monitoring, collaboration |
| Team structure | Specialized SRE team | DevOps teams (devs do ops) |
| Risk management | Quantified (error budgets) | Qualitative (collaboration) |
| Automation driver | Toil reduction | Velocity improvement |
| Target audience | Large-scale, critical services | All teams, all scales |
| On-call model | Dedicated rotation | Shared rotation (developers on-call) |
| Monitoring philosophy | SLI/SLO based, burn rates | Application metrics, dashboards |
| Change management | Gate with error budgets | Automate everything |

**When to Choose SRE vs DevOps:**

```
Choose SRE if:
- Your service is critical to business revenue (< $1M/hr)
- You operate at significant scale (> 10K req/s)
- You have 5+ engineers per service
- Your reliability requirements are quantified (SLA, SLO)
- You need explicit risk management

Choose DevOps if:
- Your team is < 10 engineers total
- Your service is internal or low-criticality
- You are still establishing development practices
- Your reliability requirements are informal
- You need to move fast without process overhead

Hybrid approach:
- Use DevOps principles for culture and collaboration
- Use SRE practices for reliability and risk management
- SRE is a specialization within DevOps culture
- DevOps enables velocity; SRE ensures velocity doesn't break things
```

---

# P15: Change Management Reliability

## P15.1 Progressive Delivery Framework

Progressive delivery is the practice of rolling out changes gradually with automated verification at each stage.

**Delivery Model Comparison:**

| Model | Risk Level | Time to Full Rollout | Rollback Complexity | User Impact if Bad |
|-------|-----------|---------------------|-------------------|-------------------|
| Big bang (all at once) | High | Instant | Hard (all users affected) | All users |
| Rolling update | Medium | Minutes | Medium | Some users |
| Canary (%-based) | Low | 15-60 min | Easy (0% canary) | Small subset |
| Regional rollout | Low | Hours | Medium | Regional subset |
| Feature flag + canary | Very Low | Hours-days | Very easy (toggle off) | Minimal |
| Dark launch (shadow traffic) | Minimal | Unlimited (shadow) | No user impact | None |

**Progressive Delivery Pipeline (Production Grade):**

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Build   │   │  Deploy  │   │  Canary  │   │  Canary  │   │  Canary  │
│  & Test  │──▶│ Staging  │──▶│   1%     │──▶│   5%     │──▶│   25%    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                              │
                                                  ┌──────────┐│
                                                  │  Canary  ││
                                                  │   100%   │◀┘
                                                  └──────────┘
                                                      │
                                                  ┌──────────┐
                                                  │ Monitor  │
                                                  │  4 hours │
                                                  └──────────┘
```

**Stage Gate Criteria:**

| Stage | Duration | Verification | Gate Decision | Rollback Action |
|-------|----------|-------------|---------------|-----------------|
| Build | — | Tests pass, security scan | Pass/Fail | Fix and rebuild |
| Staging | — | Smoke tests, integration tests | Pass/Fail | Fix and redeploy |
| Canary 1% | 5 min | Error rate < baseline * 1.5x, p99 < SLO | Approve/Reject | Set weight = 0 |
| Canary 5% | 10 min | Error rate, p99, CPU, memory all < 1.3x baseline | Approve/Reject | Set weight = 0 |
| Canary 25% | 15 min | All metrics + downstream + business metrics | Approve/Reject | Set weight = 0 |
| Canary 100% | 30 min | All metrics confirmed stable | Approve/Reject | Rollback deploy |
| Monitor | 4 hours | SLO compliance, no incidents | Sign-off | Rollback if issues |

## P15.2 Feature Flag Strategy for Reliability

**Feature Flag Lifecycle:**

```
CREATE → evaluate risk → document → implement → deploy (flag OFF)
  → test in staging (flag ON) → dry run in prod (flag ON for internal)
  → canary rollout (flag ON for X%) → full rollout (flag ON for 100%)
  → stabilize (flag ON, monitored) → cleanup (remove flag code)
  → DONE

Risk Assessment:
[ ] Code change risk (Low/Medium/High)
[ ] Data migration risk (None/Low/Medium/High)
[ ] Performance impact (None/Low/Medium/High)
[ ] Dependency change risk (None/Low/Medium/High)
[ ] Rollback complexity (Simple/Medium/Complex)

Gate Criteria for Flag Activation:
- Error budget remaining > 50%
- No active SEV0/SEV1 incidents
- All monitoring dashboards reporting
- Rollback procedure verified
- Stakeholders notified
```

**Production-Grade Feature Flag Configuration:**

```json
{
  "flags": [
    {
      "name": "new-checkout-flow",
      "state": "partial_rollout",
      "rollout_percentage": 5,
      "targeting_rules": [
        {"user_segment": "internal", "enabled": true},
        {"user_segment": "beta", "enabled": true},
        {"user_segment": "general", "rollout_percentage": 5}
      ],
      "kill_switch": {
        "enabled": true,
        "activation_metric": "checkout_error_rate > 0.5%",
        "auto_activate": true
      },
      "telemetry": {
        "evaluation_count_total": 0,
        "enabled_count": 0,
        "disabled_count": 0,
        "error_count": 0,
        "evaluation_latency_ms_p99": 0
      },
      "owners": ["checkout-team"],
      "created": "2026-05-01",
      "expires": "2026-06-15"
    }
  ]
}
```

**Feature Flag Reliability Testing Checklist:**

```
Pre-Deployment:
[ ] Flag evaluated correctly when OFF (most critical path)
[ ] Flag evaluated correctly when ON
[ ] Flag evaluation does not fail open
[ ] Flag evaluation latency < 1ms
[ ] Flag evaluation does not block request processing
[ ] Flag values can be toggled without restart
[ ] Flag caching works correctly (stale value is acceptable)
[ ] Flag change is audited (who changed, when, from what to what)

Post-Deployment:
[ ] Canary with flag OFF → verify baseline unchanged
[ ] Canary with flag ON for 1% → verify feature works
[ ] Canary with flag ON for 5% → verify no degradation
[ ] Kill switch test: toggle flag OFF → verify degradation removed
[ ] Kill switch test: toggle flag ON → verify feature restored
[ ] Performance: flag evaluation not increasing p99 latency
```

## P15.3 Canary Analysis & Automated Rollback

**Canary Analysis Methods:**

| Method | Description | Pros | Cons | Best For |
|--------|-------------|------|------|----------|
| Metric comparison | Compare canary vs baseline metrics | Simple, quantitative | Threshold tuning needed | Standard deployments |
| Statistical test | Mann-Whitney U test on metric distributions | Handles noise well | Complex, interpretation needed | High-traffic services |
| Machine learning | ML model detects anomaly in canary | Adaptive thresholds | Model training overhead | Complex metrics |
| Log analysis | Compare error patterns in logs | Rich signal | High volume, latency | Debugging deployment issues |
| Business metrics | Track conversion, revenue changes | Direct business signal | Data pipeline delay | Critical business flows |

**Canary Metric Comparison Algorithm:**

```python
def analyze_canary(baseline_metrics, canary_metrics, thresholds):
    """
    Compare canary metrics against baseline with statistical significance.
    
    Returns: {
        "decision": "pass" | "fail" | "inconclusive",
        "failures": [metric_name, ...],
        "details": {metric: {baseline, canary, diff, threshold, status}}
    }
    """
    failures = []
    details = {}
    
    for metric, config in thresholds.items():
        baseline_vals = baseline_metrics[metric]
        canary_vals = canary_metrics[metric]
        
        baseline_mean = np.mean(baseline_vals)
        canary_mean = np.mean(canary_vals)
        
        # Calculate relative difference
        if baseline_mean > 0:
            relative_diff = (canary_mean - baseline_mean) / baseline_mean
        else:
            relative_diff = float('inf') if canary_mean > 0 else 0
        
        # Statistical significance (Mann-Whitney U test)
        from scipy.stats import mannwhitneyu
        stat, p_value = mannwhitneyu(canary_vals, baseline_vals, alternative='two-sided')
        significant = p_value < config.get('significance_level', 0.05)
        
        # Decision
        threshold = config.get('relative_threshold', 0.1)  # Default 10%
        passed = not significant or relative_diff < threshold
        
        if not passed:
            failures.append(metric)
        
        details[metric] = {
            'baseline': float(baseline_mean),
            'canary': float(canary_mean),
            'relative_diff': float(relative_diff),
            'p_value': float(p_value),
            'statistically_significant': bool(significant),
            'threshold': threshold,
            'status': 'pass' if passed else 'fail'
        }
    
    decision = 'pass' if len(failures) == 0 else 'fail'
    return {'decision': decision, 'failures': failures, 'details': details}
```

**Automated Rollback Triggers:**

| Trigger | Detection | Action | Response Time |
|---------|-----------|--------|---------------|
| Error rate increase > 2x | Metric comparison | Rollback to previous version | < 2 min |
| p99 latency > SLO threshold | Metric comparison | Rollback to previous version | < 2 min |
| Error budget burn rate > 3x normal | Budget monitoring | Rollback to previous version | < 5 min |
| Downstream service errors increase | Dependency monitoring | Halt rollout, do not rollback yet | < 5 min |
| Business metric drop (conversion, revenue) | Business metrics pipeline | Rollback to previous version | < 15 min |
| New error type in logs | Log analysis | Halt rollout, investigate | < 10 min |
| Canary analysis failure | Statistical comparison | Rollback to previous version | < 5 min |

**Rollback Procedure:**

```
SIMPLE ROLLBACK (same deployment strategy):
1. Set canary weight to 0% → stops traffic to new version
2. Verify baseline version health (SLO compliance)
3. Notify on-call and deployment channel
4. Tag new version as FAILED in deployment system
5. Block new version from being redeployed

COMPLEX ROLLBACK (schema change, data migration):
1. Set canary weight to 0% → stops traffic to new version
2. Execute schema rollback script (reverse migration)
3. Execute data rollback (restore data if needed)
4. Verify baseline version health
5. Verify data integrity
6. Notify on-call and deployment channel
7. Schedule postmortem

EMERGENCY ROLLBACK (service outage):
1. Immediately execute rollback (automated)
2. Verify service health
3. Notify incident commander
4. Declare incident if SEV1+
5. Postmortem required
```

## P15.4 Deployment Freeze & Change Windows

**Deployment Freeze Policy:**

```yaml
deployment_freeze:
  regular_freezes:
    - name: holiday_freeze
      period: Dec 15 - Jan 5
      scope: all_production_services
      exceptions: security_patches, critical_hotfixes_with_cto_approval
    
    - name: black_friday_readiness
      period: Nov 1 - Nov 30
      scope: e_commerce_services
      exceptions: performance_improvements, capacity_increases
    
    - name: end_of_quarter
      period: Last 3 days of quarter
      scope: services_with_financial_reporting
      exceptions: none
  
  change_windows:
    - name: standard
      window: Mon-Thu 08:00-16:00 local
      allowed_changes: all
      approval: team_lead
    
    - name: extended
      window: Mon-Thu 16:00-20:00 local
      allowed_changes: low_risk_only
      approval: sre_lead
    
    - name: restricted
      window: Fri 08:00-12:00 local
      allowed_changes: emergency_fixes_only
      approval: engineering_manager
    
    - name: frozen
      window: Fri 12:00 - Mon 08:00
      allowed_changes: none
      exceptions: sev0_fix_with_cto_approval
```

**Change Approval Matrix:**

| Change Type | Risk Level | Approval | Window | Notification |
|-------------|-----------|----------|--------|-------------|
| Bug fix (no schema change) | Low | Team lead | Standard | Team chat |
| Bug fix (with schema change) | Medium | Team lead + SRE | Standard | Team chat + SRE channel |
| New feature (feature flagged) | Medium | Team lead + SRE | Standard | Team chat + SRE channel |
| New feature (no flag) | High | EM + SRE lead | Extended | Team chat + all-eng |
| Infrastructure change | High | SRE lead + Infra | Extended | All affected teams |
| Dependency upgrade | Medium | Team lead + SRE | Extended | Team chat + dependency owners |
| Configuration change | Low | Team lead | Standard | Team chat |
| Database migration | High | EM + SRE + DBA | Extended | All teams + on-call |
| Third-party API change | Medium | SRE lead | Standard | Team chat |
| Security patch | Varies | Security + SRE | Any | Security team |

---

# P16: SRE Domain-Specific Practices

## P16.1 SRE for Serverless

**Serverless Reliability Considerations:**

| Concern | Traditional | Serverless | SRE Adaptation |
|---------|-------------|------------|----------------|
| Cold starts | N/A | 100ms-5s latency | Include cold start in SLO measurement |
| Concurrency limits | Instance-based | Account/function limits | Monitor concurrency, throttle at API GW |
| Execution timeout | Configurable per service | Function max (usually 15 min) | Timeout monitoring, async pattern for long tasks |
| Observability | Full access | Platform-limited | Use distributed tracing, structured logging |
| Deployment | Container orchestration | Function update (immutable) | Gradual function version rollout |
| Scaling | Cluster auto-scaling | Instant (with limits) | Pre-warm concurrency for critical functions |
| State management | Local storage | Stateless (by design) | Externalize state to managed services |

**Serverless SLO Definitions:**

```yaml
serverless_slis:
  - name: invocation_success_rate
    definition: Fraction of function invocations completing without error
    numerator: invocations without error (excluding throttles)
    denominator: total invocations
    measurement: cloudwatch_logs / function_metrics
  
  - name: invocation_latency_p99
    definition: p99 duration of function invocations (including cold starts)
    numerator: invocations with duration < threshold
    denominator: total invocations
    threshold_ms: 5000  # Includes cold start allowance
    measurement: distributed_tracing
  
  - name: cold_start_rate
    definition: Fraction of invocations that are cold starts
    numerator: cold start invocations
    denominator: total invocations
    target: < 5%
    measurement: function_metrics (init duration)
  
  - name: throttled_invocations
    definition: Fraction of invocations that are throttled (rate exceeded)
    numerator: throttled invocations
    denominator: total invocations
    target: 0% (all throttles should be avoided)
    measurement: cloudwatch_metrics
```

**Serverless Reliability Patterns:**

- **Provisioned Concurrency:** Maintain pre-warmed execution environments for critical functions
- **Async Invocation with DLQ:** Use async invocation patterns with dead letter queues for reliability
- **Circuit Breaker at API Gateway:** Use API Gateway throttling and WAF to prevent overload
- **Idempotent Functions:** Design all functions to handle duplicate invocations safely
- **Graceful Degradation:** Serve stale data from cache when downstream is unavailable
- **Batch Processing:** Use Step Functions for long-running workflows with retry and error handling
- **Observability:** Implement structured JSON logging, distributed tracing (X-Ray), and custom metrics

## P16.2 SRE for Containers & Kubernetes

**Kubernetes SRE Domains:**

| Domain | Key Practices | Metrics |
|--------|--------------|---------|
| Cluster reliability | Multi-master, etcd backup, version upgrades | API server latency, etcd commit latency |
| Workload reliability | PodDisruptionBudgets, topology spread, HPA | Pod restart rate, scheduling failures |
| Network reliability | CNI configuration, network policies, service mesh | Packet loss, connection errors |
| Storage reliability | CSI drivers, persistent volume backup, statefulsets | PV provision errors, volume mount failures |
| Security reliability | Pod Security Admission, network policies, RBAC | Audit events, policy violations |
| Resource management | Requests/limits, resource quotas, limit ranges | OOM kills, CPU throttling, evictions |

**Kubernetes Cluster Reliability Checklist:**

```
Control Plane Reliability:
[ ] API server HA (3+ replicas)
[ ] etcd cluster (3+ members, backed up hourly)
[ ] Controller manager HA (leader election)
[ ] Scheduler HA (leader election)
[ ] Control plane monitoring (API latency, etcd fsync duration)
[ ] Control plane upgrade runbook
[ ] etcd disaster recovery procedure (tested quarterly)

Worker Node Reliability:
[ ] Node auto-repair (unhealthy nodes replaced automatically)
[ ] Pod disruption budgets for all production workloads
[ ] Priority classes for critical vs. best-effort workloads
[ ] Resource quotas per namespace
[ ] Limit ranges for resource consumption
[ ] Descheduler for pod balancing (optional)

Network Reliability:
[ ] CNI plugin with bandwidth management
[ ] Network policies for pod-to-pod segmentation
[ ] Service mesh (if applicable) with mTLS
[ ] Ingress controller HA
[ ] DNS (CoreDNS) HA
[ ] Node-to-node encryption (if required)

Storage Reliability:
[ ] CSI driver with snapshots
[ ] Persistent volume backup schedule
[ ] StorageClass with reclaim policy: Retain
[ ] Volume expansion support (if available)
[ ] StatefulSet with pod management policy: OrderedReady

Observability:
[ ] Metrics: kube-state-metrics, node-exporter, cAdvisor
[ ] Logging: fluentd/fluentbit → central logging
[ ] Tracing: OpenTelemetry collector
[ ] Alerting: kube-prometheus-stack or equivalent
[ ] Dashboard: Kubernetes dashboard + Grafana
```

## P16.3 SRE for Machine Learning Systems

**ML Pipeline Reliability:**

| Pipeline Stage | Failure Mode | Detection | Mitigation |
|----------------|-------------|-----------|------------|
| Data ingestion | Missing data, schema drift | Data quality checks | Default values, staleness alert |
| Feature engineering | Feature computation error | Feature validation | Feature store fallback |
| Model training | Training failure, convergence failure | Training metrics | Retry with different params |
| Model evaluation | Metric degradation | Evaluation metrics | Don't deploy, alert data scientist |
| Model deployment | Deployment failure | Canary analysis | Rollback to previous model |
| Model serving | Prediction latency, throughput | Serving metrics | Auto-scale, circuit breaker |
| Prediction monitoring | Prediction drift, data drift | Drift detection | Retrain, alert data scientist |

**ML System SLOs:**

```yaml
ml_slos:
  - name: prediction_latency_p99
    target: 200ms (online serving)
    window: 30d
    budget: 0.1% of predictions can exceed 200ms
    
  - name: prediction_availability
    target: 99.9% (online serving)
    window: 30d
    budget: 0.1% can fail
    
  - name: model_freshness
    target: model_age < 7 days (for models requiring freshness)
    window: 30d
    budget: 5% of days can have stale model
    
  - name: training_success_rate
    target: 95% of training jobs complete successfully
    window: 30d
    budget: 5% can fail
    
  - name: feature_latency_p99
    target: feature_computation < 50ms
    window: 30d
    budget: 1% can exceed 50ms
  
  - name: data_freshness
    target: training_data_age < 24h
    window: 30d
    budget: 10% of batches can use data older than 24h
```

**ML Reliability Monitoring:**

| Monitor | Measurement | Warning | Critical |
|---------|-------------|---------|----------|
| Prediction distribution shift | KS-test vs training distribution | p < 0.05 | p < 0.01 |
| Feature distribution shift | Feature correlation change | > 20% features shifted | > 50% features shifted |
| Model accuracy drop | Online evaluation metric | > 10% drop | > 20% drop |
| Data quality issues | Null rate, data type mismatch | > 1% null rate | > 5% null rate |
| Training convergence | Loss value at end of training | Not converged once | Not converged 3x in a row |
| Pipeline latency | End-to-end pipeline duration | > 2x baseline | > 5x baseline |
| Serving throughput | Predictions/second | < 50% expected | < 20% expected |

## P16.4 SRE for Legacy Systems

**Legacy System Reliability Challenges:**

| Challenge | Description | SRE Approach |
|-----------|-------------|--------------|
| No SLOs | Systems have no reliability targets | Start with monitoring only, define SLO after 3 months of data |
| Manual operations | Everything is done by hand | Script the most painful tasks first |
| No monitoring | No metrics, no dashboards | Add basic health monitoring (ping, port, log scrape) |
| Single points of failure | No redundancy | Document SPOFs, build redundancy for highest-risk items |
| No automated testing | Manual QA only | Add integration tests for critical paths |
| No CI/CD | Manual deployments | Start with simple deployment automation |
| Knowledge silos | Only one person knows how it works | Document, pair, cross-train |
| Non-standard infrastructure | Bare metal, custom OS | Standardize where possible, automate where not |

**Legacy System Wrapping Strategy:**

```
LEGACY WRAPPING PATTERN

Original: [Monolith Legacy Service]
                ↓
Wrapper: [API Gateway / Proxy Layer]
           ↓           ↓
[New Service A]   [Monolith Legacy Service]
(New features)    (Existing functionality, slowly decommissioned)

Benefits:
- New features built on modern stack
- Legacy service isolated behind wrapper
- Canary migration: move users from legacy to new gradually
- Monitoring and reliability patterns at wrapper layer
- No need to modify legacy code

SRE Actions:
1. Put API gateway / proxy in front of legacy service
2. Add monitoring at proxy level (rate, errors, duration)
3. Define SLOs for the proxy (service operates as black box)
4. Add circuit breaker at proxy for legacy service
5. Add rate limiting at proxy to protect legacy service
6. Gradually migrate functionality from legacy to new
```

**Legacy System Reliability Priorities (in order):**

1. Monitoring (know when it breaks)
2. Alerting (know before users do)
3. Backup/restore (can recover from data loss)
4. Documentation (how to fix common problems)
5. Runbooks (what to do when things break)
6. Basic automation (restart, health check)
7. Redundancy (eliminate single points of failure)
8. Capacity management (know when it will run out of resources)
9. Graceful degradation (what happens when it fails partially)
10. SLOs (quantified reliability targets)

---

# P17: SRE Metrics Encyclopedia & Dashboards

## P17.1 Comprehensive SRE Metric Definitions

**Infrastructure Metrics:**

| Metric | Type | Unit | Source | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| cpu_utilization | Gauge | Percent (0-100) | node-exporter | p99 over 5min | > 80% for 10min |
| memory_utilization | Gauge | Percent (0-100) | node-exporter | p99 over 5min | > 85% for 10min |
| disk_utilization | Gauge | Percent (0-100) | node-exporter | p99 over 5min | > 80% for 30min |
| disk_iowait | Gauge | Percent (0-100) | node-exporter | p99 over 5min | > 10% for 10min |
| network_bandwidth_utilization | Gauge | Percent (0-100) | node-exporter | max over 5min | > 70% for 10min |
| network_errors_total | Counter | Count | node-exporter | rate per min | > 0 for 5min |
| instance_count | Gauge | Count | kube-state-metrics | current | Any unexpected change |
| node_ready | Gauge | 0/1 | kube-state-metrics | min | Any node not ready |

**Application Metrics (RED Method):**

| Metric | Type | Unit | Labels | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| http_requests_total | Counter | Count | service, endpoint, method, status | rate per min | Baseline comparison |
| http_request_duration_seconds | Histogram | Seconds | service, endpoint, method | p50, p95, p99 | p99 > SLO for 5min |
| http_errors_total | Counter | Count | service, endpoint, error_type | rate per min | > 1% of total for 5min |
| active_requests | Gauge | Count | service | current | > 90% of max for 10min |
| request_queue_depth | Gauge | Count | service | p99 | > 1000 for 5min |
| panics_total | Counter | Count | service | rate per min | > 0 for 1min |

**Database Metrics:**

| Metric | Type | Unit | Source | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| db_connections_active | Gauge | Count | DB metrics | p99 | > 80% of max |
| db_query_latency_seconds | Histogram | Seconds | DB metrics | p99 | > 100ms for 10min |
| db_transactions_per_second | Gauge | Count | DB metrics | rate | 50% drop or 300% spike |
| db_replication_lag_seconds | Gauge | Seconds | DB metrics | max | > 5s warning, > 60s critical |
| db_disk_usage_bytes | Gauge | Bytes | DB metrics | current | > 80% of allocated |
| db_cache_hit_ratio | Gauge | Percent | DB metrics | avg over 1h | < 95% |
| db_deadlocks_total | Counter | Count | DB metrics | rate per min | > 0 |
| db_long_running_queries | Gauge | Count | DB metrics | current | > 5 for 5min |

**Cache Metrics:**

| Metric | Type | Unit | Source | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| cache_hit_ratio | Gauge | Percent | App metrics | avg over 5min | < 80% for 10min |
| cache_latency_seconds | Histogram | Seconds | App metrics | p99 | > 10ms for 5min |
| cache_connections | Gauge | Count | Cache metrics | current | > 80% of max |
| cache_memory_usage_bytes | Gauge | Bytes | Cache metrics | current | > 80% of max |
| cache_evictions_total | Counter | Count | Cache metrics | rate per min | > 0 |
| cache_miss_rate | Gauge | Percent | App metrics | rate per min | > 30% for 10min |

**Message Queue Metrics:**

| Metric | Type | Unit | Source | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| queue_depth | Gauge | Count | Queue metrics | current | > 10000 (page) |
| messages_published_total | Counter | Count | Queue metrics | rate per min | 50% drop |
| messages_consumed_total | Counter | Count | Queue metrics | rate per min | 50% drop |
| consumer_lag | Gauge | Count | Queue metrics | max | > 10000 (page) |
| processing_time_seconds | Histogram | Seconds | App metrics | p99 | > 2s for 10min |
| dead_letter_queue_depth | Gauge | Count | Queue metrics | current | > 100 (page) |
| consumer_group_health | Gauge | 0/1 | Queue metrics | min | Any unhealthy |

**SLO/SLI Metrics:**

| Metric | Type | Unit | Labels | Aggregation | Alert |
|--------|------|------|--------|-------------|-------|
| slo_compliance | Gauge | Percent (0-1) | service, sli, window | current | < target |
| slo_budget_remaining | Gauge | Percent (0-1) | service, sli, window | current | < 0.25 |
| slo_budget_consumed | Gauge | Percent (0-1) | service, sli, window | current | > 0.75 |
| slo_burn_rate | Gauge | Float | service, sli, window | current | > 2.0 for 1h |
| slo_state | Gauge | 0-3 | service, sli | current | > 0 |
| sli_good_events_total | Counter | Count | service, sli | rate per min | 0 for 5min |
| sli_bad_events_total | Counter | Count | service, sli | rate per min | Monitoring |
| sli_total_events_total | Counter | Count | service, sli | rate per min | 0 for 5min |

## P17.2 SRE Dashboard Design Patterns

**Single Service Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ ROW 1: SERVICE HEALTH (4 Single Stat Panels)                 │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ SLO          │ Error Budget │ Current      │ Active           │
│ Compliance   │ Remaining    │ Burn Rate    │ Incidents        │
│ 99.92%       │ 87%          │ 0.3 (1h)     │ 0                │
│ Target:99.9% │              │ 0.5 (6h)     │                  │
└──────────────┴──────────────┴──────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 2: RED METRICS (3 Time Series Panels)                    │
├──────────────────────┬──────────────────────┬────────────────┤
│ Rate (req/s)         │ Errors (%)           │ Duration (ms)  │
│ ╱╲    ╱╲             │    ╱╲                │ ╱╲     ╱╲      │
│╱  ╲  ╱  ╲           │  ╱  ╲  ╱╲           │╱  ╲  ╱  ╲     │
│    ╲╱    ╲           │ ╱    ╲╱  ╲          │    ╲╱    ╲     │
│ ─────────────→        │ ─────────────→       │ ─────────────→  │
└──────────────────────┴──────────────────────┴────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 3: RESOURCE SATURATION (USE Method - 4 Panels)           │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ CPU          │ Memory       │ Network      │ Disk             │
│ Utilization  │ Utilization  │ Utilization  │ I/O Wait        │
│ ████████ 45% │ ████████ 60% │ ████ 25%     │ ██ 2ms           │
└──────────────┴──────────────┴──────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 4: DEPENDENCIES (Circuit Breaker State)                  │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ DB: CLOSED   │ Cache:CLOSED │ Payment:OPEN │ Inventory:CLOSED │
│ 450 req/s    │ 2000 req/s   │ FALLBACK     │ 300 req/s        │
└──────────────┴──────────────┴──────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 5: RECENT EVENTS (Log Panel)                             │
├───────────────────────────────────────────────────────────────┤
│ [12:34] Deployment v2.3.1 started - 0% canary                 │
│ [12:35] Deployment v2.3.1 at 1% canary - metrics stable       │
│ [12:40] Deployment v2.3.1 at 5% canary - metrics stable       │
│ [12:45] Deployment v2.3.1 at 25% canary - monitoring          │
└───────────────────────────────────────────────────────────────┘
```

**Executive Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ ROW 1: PLATFORM HEALTH OVERVIEW                              │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Overall      │ Total        │ Active        │ MTTR (30d)      │
│ SLO: 99.91%  │ Incidents: 3 │ SEV0: 0       │ 18 min           │
│ Target:99.9% │ (this week)  │ SEV1: 1       │ Target: < 30 min │
└──────────────┴──────────────┴──────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 2: SERVICE HEALTH TABLE                                   │
├───────────────────────────────────────────────────────────────┤
│ Service        Tier    SLO     Budget   Burn    Status        │
│ checkout-api   T1      99.9%   87%      0.3     ✓ Healthy     │
│ payment-gate   T1      99.99%  42%      1.2     ⚠ Warning     │
│ auth-service   T0      99.99%  95%      0.1     ✓ Healthy     │
│ search-api     T1      99.95%  72%      0.5     ✓ Healthy     │
│ inventory-svc  T1      99.95%  18%      2.1     🔴 Critical   │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 3: TRENDS (12 months)                                    │
├──────────────────────┬──────────────────────┬────────────────┤
│ SLO Compliance Trend │ Incident Count       │ Toil Ratio     │
│     ╱╲    ╱╲        │      ╱╲    ╱╲        │   ╱╲    ╱╲     │
│   ╱  ╲  ╱  ╲       │    ╱  ╲  ╱  ╲       │ ╱  ╲  ╱  ╲    │
│  ╱    ╲╱    ╲      │   ╱    ╲╱    ╲      │╱    ╲╱    ╲   │
│ ──────────────────   │ ──────────────────   │ ─────────────────│
│  J F M A M J J A    │  J F M A M J J A     │  J F M A M J J A │
└──────────────────────┴──────────────────────┴────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 4: BUDGET & RELEASES                                     │
├──────────────────────────┬───────────────────────────────────┤
│ Error Budget Overview     │ Release Velocity                 │
│ (pie chart by category)   │ (bar chart weekly)               │
│ ┌────────────────────┐    │ ┌────────────────────┐          │
│ │ Incidents: 45%     │    │ │ ██ ██ ██ ██ ██    │          │
│ │ Deployments: 15%   │    │ │ ██ ██ ██ ██ ██    │          │
│ │ Known issues: 20%  │    │ │ ██ ██ ██ ██ ██    │          │
│ │ Maintenance: 10%   │    │ │ W1 W2 W3 W4 W5    │          │
│ └────────────────────┘    │ Rollback rate: 3%    │          │
└──────────────────────────┴───────────────────────────────────┘
```

**On-Call Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ ROW 1: ON-CALL STATUS                                        │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Primary: Bob │ Secondary:   │ Shift: May   │ Time on-call:    │
│              │ Alice        │ 27 - Jun 2   │ 2 days 4 hours   │
├──────────────┼──────────────┼──────────────┼──────────────────┤
│ Pages Today: │ Acknowledged:│ MTTA: 2.1min │ Next Handoff:    │
│ 3            │ 100%         │              │ Jun 2 09:00 UTC  │
└──────────────┴──────────────┴──────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 2: ACTIVE INCIDENTS                                       │
├───────────────────────────────────────────────────────────────┤
│ ID      Sev    Service     Duration  Status   Action          │
│ INC-027 SEV2   Inventory   4h 12m    Monitoring No action     │
│ INC-028 SEV3   Payment     1h 30m    Investigating In progress│
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 3: RECENT PAGES (Last 24h)                               │
├───────────────────────────────────────────────────────────────┤
│ Time    Alert               Action            Outcome         │
│ 08:15   CPU high checkout   Scaled up         Resolved        │
│ 11:30   Error rate payment  Circuit breaker   Monitoring      │
│ 14:45   Latency search      Verified not SLO  False positive  │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ROW 4: QUICK ACTIONS (Buttons)                               │
├───────────────────────────────────────────────────────────────┤
│ [⚠ Escalate]  [📋 Handoff]  [🏥 Page secondary]  [📞 IC]   │
└───────────────────────────────────────────────────────────────┘
```

## P17.3 SRE Monitoring Maturity

**Monitoring Maturity Model:**

| Level | Characteristics | Data Coverage | Alert Quality | Dashboard Quality | Automation |
|-------|----------------|---------------|--------------|------------------|------------|
| 0 | No monitoring | None | None | None | None |
| 1 | Basic health checks | CPU, memory, disk | Threshold-based, noisy | Single per service | None |
| 2 | Application metrics | RED metrics for main endpoints | Some burn rates | Per-service with golden signals | Basic |
| 3 | Comprehensive | Full golden signals, dependencies | MQL burn rates, good SNR | Persona-based dashboards | Auto-remediation for common |
| 4 | Proactive | Anomaly detection, predictive | Self-tuning alert thresholds | Dynamic, context-aware | Self-healing |
| 5 | Autonomous | ML-driven, automated root cause | Alert on business impact only | Auto-generated | Fully autonomous |

**Moving from Level 2 to Level 3:**

| Action | Effort | Impact | Timeline |
|--------|--------|--------|----------|
| Add dependency metrics | 1 week per service | High (see cascading failures) | 1 month |
| Implement MQL burn rate alerts | 2 weeks per SLO | High (reduce false positives) | 1 month |
| Add dashboard for each persona | 1 week per dashboard | Medium (better context) | 2 months |
| Create runbooks for all alerts | 2 weeks per 10 alerts | High (faster incident response) | 2 months |
| Monitor alert SNR weekly | 1 hour/week | High (continuous improvement) | Ongoing |
| Remove noisy alerts | 1 hour per alert | High (reduce fatigue) | Ongoing |
| Add synthetic monitoring | 2 weeks per service | Medium (catch issues before users) | 1 month |

---

# P18: SRE Reading List & References

## P18.1 Core SRE Books

**Required Reading:**

| Title | Author | Focus | Why It Matters |
|-------|--------|-------|---------------|
| Site Reliability Engineering | Niall Murphy et al. (Google) | Full SRE framework | The foundational SRE text — all concepts originate here |
| The Site Reliability Workbook | Betsy Beyer et al. (Google) | Practical SRE implementation | Implementation guidance for every SRE concept |
| Seeking SRE | David N. Blank-Edelman | SRE culture and organization | The people side of SRE — team design, culture, hiring |
| Implementing Service Level Objectives | Alex Hidalgo | SLO/SLI deep dive | The definitive guide to SLO design and error budgets |
| Chaos Engineering | Casey Rosenthal & Nora Jones | Chaos engineering principles | The authoritative text on chaos engineering |
| Database Reliability Engineering | Laine Campbell & Charity Majors | Database reliability | DRE practices for stateful services |
| The Art of Capacity Planning | John Allspaw | Capacity planning | Classic text on capacity management |
| Observability Engineering | Charity Majors et al. | Observability | Modern observability practices for reliability |
| Accelerate | Nicole Forsgren et al. | DevOps metrics | Research-backed DevOps performance metrics |
| The Phoenix Project | Gene Kim et al. | DevOps culture | Novel about DevOps transformation — cultural context |

**Advanced Reading:**

| Title | Author | Focus |
|-------|--------|-------|
| Designing Distributed Systems | Brendan Burns | Distributed systems patterns |
| Kubernetes in Production | Carson Anderson | Kubernetes operations |
| Distributed Systems Observability | Cindy Sridharan | Distributed tracing |
| Building Secure and Reliable Systems | Heather Adkins et al. (Google) | Security + reliability |
| The Manager's Path | Camille Fournier | Engineering management |
| An Introduction to General Systems Thinking | Gerald M. Weinberg | Systems thinking foundation |
| Normal Accidents | Charles Perrow | Complex system failures |
| The Field Guide to Understanding Human Error | Sidney Dekker | Human factors in incidents |

## P18.2 SRE Research Papers

| Paper | Authors | Key Insights |
|-------|---------|-------------|
| Google's SRE Practices | Google SRE Team | Origin of error budgets, SLOs, toil |
| In Search of an Understandable Consensus Algorithm (Raft) | Diego Ongaro & John Ousterhout | Raft consensus algorithm |
| Dynamo: Amazon's Highly Available Key-value Store | Amazon | Eventual consistency, quorum |
| The Google File System | Sanjay Ghemawat et al. | Distributed storage reliability |
| Bigtable: A Distributed Storage System for Structured Data | Google | Distributed data storage |
| Spanner: Google's Globally Distributed Database | Google | Global consistency, TrueTime |
| Practical Byzantine Fault Tolerance | Miguel Castro & Barbara Liskov | BFT consensus |
| Chord: A Scalable Peer-to-peer Lookup Protocol | MIT | Distributed hash tables |
| Paxos Made Simple | Leslie Lamport | Paxos consensus |
| SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol | Cornell | Failure detection |
| Time, Clocks, and the Ordering of Events in a Distributed System | Leslie Lamport | Logical clocks, happens-before |
| The Byzantine Generals Problem | Lamport, Shostak, Pease | Byzantine fault tolerance |
| Designing a Deployment Pipeline at Google | Google | CI/CD at scale |
| Large-Scale Cluster Management at Google with Borg | Google | Cluster management |
| Omega: Flexible, Scalable Schedulers for Large Compute Clusters | Google | Cluster scheduling |

## P18.3 SRE Conferences & Community

**Conferences:**
- SREcon (US, Europe, Asia Pacific) — the premier SRE conference
- USENIX LISA — operations and SRE topics
- KubeCon + CloudNativeCon — Kubernetes and cloud native
- ChaosConf — chaos engineering focused
- DevOpsDays — local community events
- Monitorama — monitoring and observability
- Strata Data — data reliability engineering
- Velocity — web performance and operations

**Community Resources:**
- SRE Weekly Newsletter — weekly SRE news and articles
- USENIX ;login: magazine — SRE and systems articles
- Google SRE Blog — official Google SRE content
- DevOps'ish Newsletter — DevOps and SRE news
- Incident Response and Postmortem Community — postmortem best practices
- Chaos Engineering Community Forum — chaos engineering discussions

## P18.4 SRE Certification Paths

| Certification | Provider | Focus | Prerequisites | Validity |
|---------------|----------|-------|---------------|----------|
| Google Cloud Professional Cloud DevOps Engineer | Google | SRE on GCP | GCP experience | 2 years |
| AWS Certified DevOps Engineer - Professional | Amazon | DevOps on AWS | AWS experience | 3 years |
| Certified Kubernetes Administrator (CKA) | CNCF | Kubernetes operations | K8s experience | 3 years |
| Certified Kubernetes Application Developer (CKAD) | CNCF | K8s application dev | K8s experience | 3 years |
| LPI DevOps Tools Engineer | Linux Foundation | DevOps tooling | General DevOps | 5 years |
| ISC2 CISSP | ISC2 | Security (for compliance) | 5 years security exp | 3 years |
| ITIL 4 Foundation | AXELOS | IT service management | None | None |

---

# P19: SRE Code of Practice & Ethics

## P19.1 SRE Professional Ethics

**Core Principles:**

1. **Accuracy in Measurement**
   - SLIs must reflect genuine user experience
   - SLOs must be set honestly, not to meet arbitrary targets
   - Error budget reporting must be transparent and auditable
   - Never game metrics to make reliability appear better than it is

2. **Blameless Investigation**
   - All incident analysis must focus on systemic causes
   - Never use postmortems to assign blame
   - Protect incident participants from retaliation
   - Advocate for systemic improvements over individual training

3. **Transparency**
   - SLO compliance data must be visible to all stakeholders
   - Incident timelines must be publicly documented
   - Postmortems must be published (with appropriate redaction)
   - Reliability tradeoffs must be communicated honestly

4. **Continuous Improvement**
   - Every incident is an opportunity to learn
   - Action items must be tracked to closure
   - Reliability practices must evolve with the system
   - Share learnings across the organization

5. **User Focus**
   - Reliability decisions must center on user impact
   - SLOs must reflect what users care about
   - Degradation must prioritize user experience
   - Communicate reliability status to users transparently

6. **Sustainability**
   - On-call rotations must be sustainable
   - Toil must be measured and reduced
   - SRE tools must be maintainable
   - Automation must not create new toil

## P19.2 Decision-Making Framework

**When Facing a Reliability Decision:**

```
1. What is the user impact?
   - How many users affected?
   - How severely affected?
   - What is the business impact?

2. What is the risk tradeoff?
   - What is the risk of acting?
   - What is the risk of not acting?
   - What is the error budget state?

3. Who needs to be involved?
   - Is this a standard operational decision?
   - Does this affect other teams?
   - Does this require executive input?

4. What does the data say?
   - Do we have historical data for this scenario?
   - What do the SLOs and error budgets indicate?
   - What is the capacity forecast telling us?

5. What is the reversible decision?
   - Can we undo this decision?
   - What is the rollback plan?
   - Is there a safer alternative?
```

---

# Appendix A: SRE Reference Tables

## A.1 SLO Target Reference

| SLO | Allowed Downtime (Year) | Allowed Downtime (Month) | Allowed Downtime (Week) | Allowed Downtime (Day) |
|-----|------------------------|-------------------------|------------------------|-----------------------|
| 90% (one nine) | 36.5 days | 3.0 days | 16.8 hours | 2.4 hours |
| 95% (one and a half) | 18.25 days | 1.5 days | 8.4 hours | 1.2 hours |
| 99% (two nines) | 3.65 days | 7.2 hours | 1.68 hours | 14.4 minutes |
| 99.5% (two and a half) | 1.83 days | 3.6 hours | 50.4 minutes | 7.2 minutes |
| 99.9% (three nines) | 8.76 hours | 43.2 minutes | 10.08 minutes | 1.44 minutes |
| 99.95% (three and a half) | 4.38 hours | 21.6 minutes | 5.04 minutes | 43.2 seconds |
| 99.99% (four nines) | 52.56 minutes | 4.32 minutes | 1.0 minutes | 8.64 seconds |
| 99.995% (four and a half) | 26.28 minutes | 2.16 minutes | 30.24 seconds | 4.32 seconds |
| 99.999% (five nines) | 5.26 minutes | 25.9 seconds | 6.05 seconds | 0.86 seconds |
| 99.9999% (six nines) | 31.5 seconds | 2.59 seconds | 0.6 seconds | 0.086 seconds |

## A.2 Burn Rate Reference

**Budget Exhaustion Time for Different Burn Rates (30-day window):**

| Burn Rate | Time to Exhaust 99.9% Budget | Time to Exhaust 99.99% Budget | Time to Exhaust 99.999% Budget |
|-----------|------------------------------|-------------------------------|-------------------------------|
| 1.0 | 30 days | 30 days | 30 days |
| 2.0 | 15 days | 15 days | 15 days |
| 3.0 | 10 days | 10 days | 10 days |
| 5.0 | 6 days | 6 days | 6 days |
| 10.0 | 3 days | 3 days | 3 days |
| 14.0 | 2.14 days (51.4h) | 2.14 days (51.4h) | 2.14 days (51.4h) |
| 20.0 | 1.5 days (36h) | 1.5 days (36h) | 1.5 days (36h) |
| 50.0 | 14.4 hours | 14.4 hours | 14.4 hours |
| 100.0 | 7.2 hours | 7.2 hours | 7.2 hours |

Note: Burn rate to exhaust time is independent of SLO target. The budget size differs, but the rate of exhaustion scales proportionally.

## A.3 Recommended Alert Thresholds by SLO Target

| SLO Target | Fast Burn Rate | Fast Window | Slow Burn Rate | Slow Window | Budget Warning | Budget Critical |
|------------|---------------|-------------|---------------|-------------|----------------|-----------------|
| 99.0% | 8 | 5 min | 2.0 | 30 min | 50% | 25% |
| 99.5% | 10 | 5 min | 2.0 | 30 min | 50% | 25% |
| 99.9% | 14 | 5 min | 2.5 | 30 min | 50% | 25% |
| 99.95% | 16 | 5 min | 3.0 | 30 min | 50% | 25% |
| 99.99% | 20 | 5 min | 3.5 | 30 min | 50% | 25% |
| 99.995% | 22 | 5 min | 4.0 | 30 min | 50% | 25% |
| 99.999% | 25 | 5 min | 5.0 | 30 min | 50% | 25% |

## A.4 Sev Classification Quick Reference

| Criteria | SEV0 | SEV1 | SEV2 | SEV3 |
|----------|------|------|------|------|
| User impact | 100% | > 20% | 5-20% | < 5% |
| Revenue impact | > $100K/hr | $10K-100K/hr | $1K-10K/hr | < $1K/hr |
| Data integrity | Data loss | Corruption risk | Read-only degraded | No issues |
| Response | Page all | Page primary | Page (business) | Ticket |
| Acknowledge | 5 min | 10 min | 30 min | 4 hr |
| Mitigate | 1 hr | 4 hr | 8 hr | 1 wk |
| Postmortem | 48 hr | 72 hr | Optional | No |

## A.5 Error Budget Size Reference (30-Day Window)

| SLO Target | Request-Based (per 10M req/day) | Time-Based (seconds) | Time-Based (minutes) |
|------------|--------------------------------|---------------------|---------------------|
| 99.0% | 3,000,000 requests/month | 2,592,000 | 43,200 |
| 99.5% | 1,500,000 requests/month | 1,296,000 | 21,600 |
| 99.9% | 300,000 requests/month | 259,200 | 4,320 |
| 99.95% | 150,000 requests/month | 129,600 | 2,160 |
| 99.99% | 30,000 requests/month | 25,920 | 432 |
| 99.995% | 15,000 requests/month | 12,960 | 216 |
| 99.999% | 3,000 requests/month | 2,592 | 43.2 |
| 99.9999% | 300 requests/month | 259.2 | 4.32 |

## A.6 Toil Classification Quick Reference

| Classification | Examples | Toil Score | Automation Priority |
|---------------|----------|------------|-------------------|
| High toil | Restart service, add disk, reset password | 5/5 | 1 (immediate) |
| Medium toil | Deploy hotfix, run manual backup, clear queue | 4/5 | 2 (short-term) |
| Low toil | Review dashboards, create report, audit logs | 3/5 | 3 (medium-term) |
| Engineering | Write automation, design SLOs, capacity planning | 0-1/5 | Not toil |
| Innovation | Chaos experiments, Game Days, research | 0/5 | Not toil |

## A.7 Capacity Planning Quick Reference

| Resource | Utilization Warning | Utilization Critical | Action Warning | Action Critical |
|----------|-------------------|--------------------|---------------|-----------------|
| CPU | > 70% | > 90% | Review scaling thresholds | Scale up immediately |
| Memory | > 75% | > 90% | Check for leaks, review limits | Scale up, restart instances |
| Disk | > 70% | > 90% | Plan cleanup or expansion | Expand or clean up urgently |
| Network | > 50% | > 80% | Review bandwidth needs | Upgrade capacity |
| DB connections | > 70% | > 90% | Review connection pool | Increase pool, check for leaks |
| Cache memory | > 75% | > 90% | Review cache TTLs | Add cache capacity |
| Queue depth | > 1000 | > 10000 | Review consumer throughput | Scale consumers |
| API rate limit | > 70% of limit | > 90% of limit | Review rate limit tiers | Increase limits, throttle clients |

## A.8 Automation ROI Reference

| Task | Frequency | Time (min) | Weekly Toil (hrs) | Automation Effort (hrs) | Payback (weeks) | Year 1 Savings (hrs) |
|------|-----------|-----------|-------------------|------------------------|-----------------|---------------------|
| Restart crashed service | 5/week | 15 | 1.25 | 4 | 3.2 | 61 |
| Add disk space | 3/week | 30 | 1.5 | 8 | 5.3 | 70 |
| Reset user password | 20/week | 5 | 1.67 | 2 | 1.2 | 84 |
| Deploy hotfix | 2/week | 60 | 2.0 | 20 | 10.0 | 76 |
| Clear queue | 1/week | 20 | 0.33 | 4 | 12.0 | 12 |
| Rotate certificates | 1/month | 60 | 0.25 | 8 | 32.0 | 4 |
| Backup verification | 1/day | 10 | 0.83 | 16 | 19.2 | 24 |
| Log rotation cleanup | 1/day | 5 | 0.42 | 4 | 9.6 | 16 |
| Access request | 10/week | 10 | 1.67 | 6 | 3.6 | 80 |
| Health check follow-up | 20/week | 5 | 1.67 | 3 | 1.8 | 84 |

---

# Appendix B: SRE Anti-Patterns Additional

## B.1 The Dashboard Zoo

**Anti-pattern:** Creating dozens of dashboards that no one maintains or uses.

**Symptoms:**
- 100+ dashboards for 10 services
- Most dashboards have 0 views in the last 30 days
- No standardized dashboard structure
- Dashboards are a data dump (every possible metric shown)
- Engineers create dashboards and never delete them

**Root Causes:**
- No dashboard standards or governance
- Everyone creates their own dashboards
- No dashboard review or cleanup process
- Dashboards created during incidents and never refined

**Solution:**
- Standard dashboard templates (executive, engineering, on-call)
- Dashboard governance: review quarterly, archive unused
- Maximum 8-12 panels per dashboard
- Each dashboard must answer a specific question
- No dashboard without a clear audience
- Use dashboard-as-code (Terraform, Grafana provisioning)

## B.2 The Runbook That Nobody Reads

**Anti-pattern:** Creating runbooks that are too long, too complex, or too outdated to be useful.

**Symptoms:**
- Runbooks are 20+ pages long
- Runbooks are not updated after incidents
- Engineers write their own runbooks from scratch
- Runbooks are buried in a wiki no one visits
- Runbooks describe the desired system, not the actual system

**Root Causes:**
- No runbook standards or templates
- Runbook authorship not assigned
- No review cycle for runbooks
- Runbooks are seen as documentation, not as operational tools

**Solution:**
- Runbooks must be concise (2 pages max per alert)
- Runbooks must be tested quarterly (walk through with a new team member)
- Runbooks must be owned by the service team
- Runbooks must be linked from alert notifications
- Runbooks must be version-controlled (Git)
- Runbook format: symptoms → diagnosis → mitigation → verification → escalation

## B.3 The Alert That Nobody Can Act On

**Anti-pattern:** Alerts that fire but provide no actionable information.

**Symptoms:**
- Alert says: "Something is wrong with service X"
- No runbook linked in alert
- No dashboard link in alert
- No severity classification in alert
- Alert has no recommended action
- Alert requires 15+ minutes of investigation to understand

**Root Causes:**
- Alerts created by monitoring tool defaults
- Alerts created during incidents (emergency alerts)
- No alert quality review process
- Alert creators not accountable for alert quality

**Solution:**
- Every alert must have: severity, runbook link, dashboard link, service name, environment
- Every alert must include current metric value and threshold
- Every alert must suggest first triage step
- Alert review every sprint: improve or delete
- New alerts require peer review before deployment

## B.4 The Capacity Surprise

**Anti-pattern:** Capacity runs out unexpectedly, causing performance degradation or outage.

**Symptoms:**
- Regular capacity-related incidents
- "We didn't expect this much traffic"
- Reactive capacity increases (always chasing)
- No capacity forecasting
- Capacity data not visible on dashboards

**Root Causes:**
- No capacity planning process
- No traffic growth monitoring
- No saturation alerting
- No understanding of traffic patterns and seasonality
- No load testing before launches

**Solution:**
- Implement capacity forecasting (linear regression at minimum)
- Monitor and alert on utilization trends (30-day, 90-day)
- Set utilization warnings at 70% of capacity
- Load test new features and campaigns
- Have a capacity buffer of 30% for unexpected growth
- Review capacity monthly for critical services

## B.5 The Postmortem That Collects Dust

**Anti-pattern:** Writing postmortems as a compliance exercise with no intention of implementing action items.

**Symptoms:**
- Same type of incident recurs every month
- Postmortem action items are never started
- Action items are vague ("improve monitoring")
- No action item tracking or accountability
- Postmortems are written only because policy requires it

**Root Causes:**
- No action item tracking system
- Action items not included in sprint planning
- No ownership or accountability for closure
- Postmortems seen as punishment
- Engineering capacity is too consumed by toil to implement improvements

**Solution:**
- Action items must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Each action item enters the team's sprint backlog
- Action items have single owners and deadlines
- Weekly action item review in standup
- Postmortem effectiveness metric: action item closure rate
- Dedicate 20% of sprint capacity to postmortem action items

---

# Appendix C: SRE Templates & Cheatsheets

## C.1 SLO Charter Template

```
# SLO Charter: [Service Name]

## Service Information
- Service: [name]
- Tier: [0-3]
- Owner: [team]
- Stakeholders: [list of teams/people]

## SLO Definitions

### SLI 1: [name]
- Category: [Availability/Latency/Correctness/Freshness/Durability]
- Definition: [clear description]
- Measurement: [how it is collected]
- Numerator: [what counts as good]
- Denominator: [what counts as total]
- Exclusions: [what is excluded and why]

### SLO Target 1
- SLI: [SLI name]
- Target: [%]
- Compliance Window: [30d rolling]
- Error Budget: [formula]
- Rationale: [why this target]

## Error Budget Policy
- Budget Period: 30 days rolling
- Release Gating: Budget > 25% for normal releases
- Budget Warning: < 50% → daily review
- Budget Critical: < 25% → freeze releases
- Budget Emergency: < 10% → all-hands reliability

## Stakeholder Approval
- Product: [name, date]
- Engineering: [name, date]
- SRE: [name, date]

## Review Cadence
- Monthly: SLO compliance review
- Quarterly: SLO target review
- Annual: Full SLO charter review
```

## C.2 On-Call Handoff Cheatsheet

```
┌─────────────────────────────────────────────────────────────┐
│                    ON-CALL HANDOFF CHEATSHEET                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  START OF SHIFT:                                             │
│  □ Review SLO compliance for all services                    │
│  □ Review active incidents                                   │
│  □ Review ongoing changes/deployments                        │
│  □ Test alert delivery                                       │
│  □ Review runbooks for top 5 alerts                          │
│  □ Confirm secondary is available                            │
│                                                              │
│  DURING SHIFT:                                               │
│  □ Log all actions (time, action, result)                    │
│  □ Track time per incident                                   │
│  □ Document workarounds                                      │
│  □ Keep incident channel updated                             │
│                                                              │
│  END OF SHIFT:                                               │
│  □ Summarize shift activity                                  │
│  □ Document open incidents                                   │
│  □ Identify patterns noticed                                 │
│  □ Report toil hours                                         │
│  □ Update handoff document                                   │
│  □ Debrief with next primary                                 │
│                                                              │
│  ESCALATION:                                                 │
│  □ Page not ack'd in 5 min → page secondary                  │
│  □ Incident > 30 min → page team lead                        │
│  □ Multi-service incident → page team lead                   │
│  □ Revenue impact > $100K/hr → page director                 │
│  □ Regulatory impact → page VP Eng                           │
└─────────────────────────────────────────────────────────────┘
```

## C.3 Incident Commander Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│              INCIDENT COMMANDER QUICK REFERENCE              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DECLARE                                                 │
│     - Set severity (SEV0-SEV3)                               │
│     - Announce in incident channel                           │
│     - Notify stakeholders (per severity)                     │
│                                                              │
│  2. ASSIGN ROLES                                            │
│     - Operations Lead: technical mitigation                  │
│     - Communications Lead: status updates                    │
│     - Scribe: timeline tracking                              │
│     - SMEs: domain expertise                                 │
│                                                              │
│  3. TRIAGE                                                  │
│     - What is the impact? (users, revenue, data)             │
│     - What is the severity?                                  │
│     - What is the initial mitigation?                        │
│                                                              │
│  4. COMMUNICATE                                             │
│     - Status update every 30 minutes (strict)                │
│     - What we know / what we are doing / what we need       │
│     - Next update time                                       │
│                                                              │
│  5. COORDINATE                                              │
│     - Track parallel workstreams                             │
│     - Avoid duplicate effort                                 │
│     - Make decisions (don't let analysis paralyze)           │
│                                                              │
│  6. DECIDE                                                  │
│     - Rollback? Scale up? Failover?                          │
│     - Document decision and rationale                        │
│                                                              │
│  7. RESOLVE                                                 │
│     - Confirm mitigation works                               │
│     - Verify SLO compliance                                  │
│     - Announce resolution                                    │
│     - Hand off to postmortem                                 │
└─────────────────────────────────────────────────────────────┘
```

## C.4 Error Budget Calculation Cheatsheet

```
ERROR BUDGET FORMULAS

For time-based SLO:
  Budget (time) = Window_Seconds * (1 - SLO_Target)
  
  Example: 99.9% SLO, 30-day window
  = 2,592,000 * 0.001 = 2,592 seconds = 43.2 minutes

For request-based SLO:
  Budget (requests) = Total_Requests * (1 - SLO_Target)
  
  Example: 99.9% SLO, 10M requests/day, 30-day window
  = 300,000,000 * 0.001 = 300,000 bad requests allowed

Burn Rate:
  Burn Rate = Error_Rate / (1 - SLO_Target)
  
  Example: SLO = 99.9%, current error rate = 0.5%
  Burn Rate = 0.005 / 0.001 = 5.0

Budget Remaining:
  Budget Remaining = (Budget - Consumed) / Budget
  
  Example: Budget = 43.2 min, consumed = 10 min
  Remaining = (43.2 - 10) / 43.2 = 77%

Time to Budget Exhaustion:
  Time_Left = Budget_Remaining / (Burn_Rate / Window_Seconds)
  
  Example: Budget remaining = 77% = 0.77
  Burn rate = 2.0, Window = 2,592,000 seconds
  Time left = 0.77 * 2,592,000 / 2.0 = 998,592 seconds = 11.6 days
```

## C.5 PRR Minimum Criteria by Tier

```
PRR MINIMUM CRITERIA BY SERVICE TIER

TIER 0 (Critical Infrastructure)
Must have:
  □ Multi-window burn rate alerting
  □ Full golden signals (latency, traffic, errors, saturation)
  □ Automatic rollback on canary failure
  □ RTO < 15 minutes, RPO < 1 minute
  □ Chaos engineering for top failure modes
  □ 24/7 on-call with primary/secondary
  □ Circuit breakers on all critical dependencies
  □ Graceful degradation for all non-critical features
  □ Postmortem for all SEV1+ incidents
  □ Action item closure rate > 80%

TIER 1 (Customer-Facing)
Must have:
  □ SLO-based alerting (burn rate configured)
  □ RED method monitoring
  □ Canary deployment with automated verification
  □ RTO < 1 hour, RPO < 5 minutes
  □ 24/7 on-call rotation
  □ Circuit breakers on top dependencies
  □ Postmortem for all SEV1+ incidents
  □ Error budget tracking dashboard

TIER 2 (Internal Tools)
Must have:
  □ Basic SLOs defined
  □ Health check endpoints
  □ Business hours on-call
  □ Documented runbooks
  □ Backup strategy defined
  □ Incident response process

TIER 3 (Experimental)
Must have:
  □ Health check endpoint
  □ Known escalation path
  □ Basic documentation
```

---

# Appendix D: SRE Configuration Snippets & Recipes

## D.1 Multi-Window Burn Rate Alert (Prometheus)

```yaml
groups:
  - name: slo_alerts
    rules:
      # Fast burn detection: high burn rate over short window
      - alert: HighBurnRate
        expr: |
          (
            1 - (
              sum(rate(http_requests_total{status=~"2.."}[5m]))
              / sum(rate(http_requests_total[5m]))
            )
          ) / 0.001 > 14
        for: 5m
        labels:
          severity: page
          service: checkout-api
        annotations:
          summary: "High burn rate detected for checkout-api"
          description: "Burn rate > 14x for 5 minutes. Current error rate: {{ $value }}x"

      # Slow burn detection: moderate burn rate over longer window
      - alert: MediumBurnRate
        expr: |
          (
            1 - (
              sum(rate(http_requests_total{status=~"2.."}[30m]))
              / sum(rate(http_requests_total[30m]))
            )
          ) / 0.001 > 2.5
        for: 30m
        labels:
          severity: page
          service: checkout-api
        annotations:
          summary: "Medium burn rate detected for checkout-api"
          description: "Burn rate > 2.5x for 30 minutes. Current burn rate: {{ $value }}x"

      # Budget remaining alerts
      - alert: BudgetWarning
        expr: |
          (
            sum(rate(http_requests_total{status!~"2.."}[30d]))
            / sum(rate(http_requests_total[30d]))
          ) < 0.0005
        labels:
          severity: warning
          service: checkout-api
        annotations:
          summary: "Error budget at 50% for checkout-api"
          description: "Error budget remaining is below 50%. Current compliance: {{ $value }}"

      - alert: BudgetCritical
        expr: |
          (
            sum(rate(http_requests_total{status!~"2.."}[30d]))
            / sum(rate(http_requests_total[30d]))
          ) < 0.00025
        labels:
          severity: page
          service: checkout-api
        annotations:
          summary: "Error budget critical for checkout-api"
          description: "Error budget remaining is below 25%. Current compliance: {{ $value }}"
```

## D.2 Error Budget Calculation Rule (Prometheus Recording)

```yaml
groups:
  - name: slo_recording_rules
    interval: 1m
    rules:
      # SLI: Availability (good requests / total requests)
      - record: sli:availability:rate_5m
        expr: |
          sum(rate(http_requests_total{status=~"2.."}[5m]))
          / sum(rate(http_requests_total[5m]))

      # SLI: Availability (over 30-day window)
      - record: sli:availability:rate_30d
        expr: |
          sum(rate(http_requests_total{status=~"2.."}[30d]))
          / sum(rate(http_requests_total[30d]))

      # Error budget consumed (over 30-day window)
      - record: slo:error_budget_consumed
        expr: |
          1 - (
            sum(rate(http_requests_total{status=~"2.."}[30d]))
            / sum(rate(http_requests_total[30d]))
          )

      # Error budget remaining (for 99.9% SLO)
      - record: slo:error_budget_remaining
        expr: |
          1 - (
            (1 - (sum(rate(http_requests_total{status=~"2.."}[30d])) / sum(rate(http_requests_total[30d]))))
            / 0.001
          )

      # Burn rate (1-hour window)
      - record: slo:burn_rate:1h
        expr: |
          (
            1 - (
              sum(rate(http_requests_total{status=~"2.."}[1h]))
              / sum(rate(http_requests_total[1h]))
            )
          ) / 0.001

      # Burn rate (6-hour window)
      - record: slo:burn_rate:6h
        expr: |
          (
            1 - (
              sum(rate(http_requests_total{status=~"2.."}[6h]))
              / sum(rate(http_requests_total[6h]))
            )
          ) / 0.001
```

## D.3 Circuit Breaker Implementation (Python)

```python
import time
import logging
from threading import Lock
from enum import Enum
from dataclasses import dataclass, field
from typing import Callable, Optional, List

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


@dataclass
class CircuitBreakerConfig:
    failure_threshold: int = 5
    success_threshold: int = 2
    timeout_seconds: float = 30.0
    half_open_max_requests: int = 3
    cooldown_seconds: float = 60.0
    monitored_exceptions: List[type] = field(default_factory=lambda: [
        ConnectionError, TimeoutError, OSError
    ])


class CircuitBreaker:
    """Production-grade circuit breaker implementation."""

    def __init__(
        self,
        name: str,
        config: Optional[CircuitBreakerConfig] = None,
    ):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self._state = CircuitState.CLOSED
        self._failure_count = 0
        self._success_count = 0
        self._half_open_requests = 0
        self._last_state_change = 0.0
        self._lock = Lock()

        # Metrics
        self.metrics = {
            "state": CircuitState.CLOSED.value,
            "failure_count": 0,
            "success_count": 0,
            "request_count": 0,
            "rejection_count": 0,
            "state_changes": 0,
        }

    def call(self, func: Callable, fallback: Optional[Callable] = None, *args, **kwargs):
        """Execute function with circuit breaker protection."""
        with self._lock:
            self._check_timeout()
            if self._state == CircuitState.OPEN:
                self.metrics["rejection_count"] += 1
                logger.warning(f"Circuit {self.name} is OPEN. Request rejected.")
                if fallback:
                    return fallback(*args, **kwargs)
                raise CircuitBreakerOpenError(f"Circuit {self.name} is open")

            if self._state == CircuitState.HALF_OPEN:
                if self._half_open_requests >= self.config.half_open_max_requests:
                    self.metrics["rejection_count"] += 1
                    if fallback:
                        return fallback(*args, **kwargs)
                    raise CircuitBreakerOpenError(f"Circuit {self.name} is half-open")
                self._half_open_requests += 1

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except tuple(self.config.monitored_exceptions) as e:
            self._on_failure()
            if fallback:
                return fallback(*args, **kwargs)
            raise

    def _on_success(self):
        with self._lock:
            self.metrics["success_count"] += 1
            self.metrics["request_count"] += 1
            if self._state == CircuitState.HALF_OPEN:
                self._success_count += 1
                if self._success_count >= self.config.success_threshold:
                    self._transition_to(CircuitState.CLOSED)
                    self._failure_count = 0
                    self._success_count = 0
                    self._half_open_requests = 0

    def _on_failure(self):
        with self._lock:
            self.metrics["failure_count"] += 1
            self.metrics["request_count"] += 1
            self._failure_count += 1

            if self._state == CircuitState.CLOSED:
                if self._failure_count >= self.config.failure_threshold:
                    self._transition_to(CircuitState.OPEN)
            elif self._state == CircuitState.HALF_OPEN:
                self._transition_to(CircuitState.OPEN)

    def _check_timeout(self):
        if self._state == CircuitState.OPEN:
            elapsed = time.time() - self._last_state_change
            if elapsed >= self.config.timeout_seconds:
                self._transition_to(CircuitState.HALF_OPEN)
                self._half_open_requests = 0
                self._success_count = 0

    def _transition_to(self, new_state: CircuitState):
        old_state = self._state
        self._state = new_state
        self._last_state_change = time.time()
        self.metrics["state"] = new_state.value
        self.metrics["state_changes"] += 1
        logger.info(
            f"Circuit {self.name} state: {old_state.value} → {new_state.value}"
        )

    def get_state(self) -> CircuitState:
        return self._state

    def get_metrics(self) -> dict:
        return {**self.metrics, "state": self._state.value}


class CircuitBreakerOpenError(Exception):
    pass


# Usage example
def make_payment(amount: float, currency: str) -> dict:
    # Simulated payment gateway call
    import random
    if random.random() < 0.1:  # 10% failure rate
        raise ConnectionError("Payment gateway timeout")
    return {"status": "success", "transaction_id": "txn_12345"}


def payment_fallback(amount: float, currency: str) -> dict:
    # Return cached payment token
    return {
        "status": "fallback",
        "transaction_id": "txn_fallback_12345",
        "note": "Payment queued for async processing"
    }


breaker = CircuitBreaker(
    name="payment_gateway",
    config=CircuitBreakerConfig(
        failure_threshold=5,
        success_threshold=2,
        timeout_seconds=30,
        half_open_max_requests=3
    )
)

for i in range(100):
    try:
        result = breaker.call(make_payment, payment_fallback, 100.0, "USD")
        print(f"Request {i}: {result}")
    except CircuitBreakerOpenError:
        print(f"Request {i}: Circuit is open, request rejected")
    time.sleep(0.1)

print(f"Final metrics: {breaker.get_metrics()}")
```

## D.4 Canary Analysis Engine (Python)

```python
"""
Canary analysis engine for automated deployment verification.
Compares canary metrics against baseline using statistical methods.
"""

import numpy as np
from scipy import stats
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class CanaryDecision(Enum):
    PASS = "pass"
    FAIL = "fail"
    INCONCLUSIVE = "inconclusive"


class RollbackTrigger(Enum):
    ERROR_RATE = "error_rate_exceeded"
    LATENCY = "latency_exceeded"
    BUDGET_BURN = "budget_burn_exceeded"
    DOWNSTREAM_ERRORS = "downstream_errors_increased"
    CONSECUTIVE_FAILURES = "consecutive_failures_exceeded"


@dataclass
class MetricThreshold:
    name: str
    relative_threshold: float  # Multiplier vs baseline (e.g., 1.5 = 50% increase)
    absolute_threshold: Optional[float] = None  # Absolute max value
    significance_level: float = 0.05
    min_sample_size: int = 30
    use_mann_whitney: bool = True


@dataclass
class CanaryConfig:
    stages: List[Dict] = field(default_factory=lambda: [
        {"weight": 0.01, "duration_seconds": 300, "name": "1%"},
        {"weight": 0.05, "duration_seconds": 600, "name": "5%"},
        {"weight": 0.25, "duration_seconds": 900, "name": "25%"},
        {"weight": 0.50, "duration_seconds": 300, "name": "50%"},
        {"weight": 1.00, "duration_seconds": 0, "name": "100%"},
    ])
    metrics: List[MetricThreshold] = field(default_factory=lambda: [
        MetricThreshold(name="error_rate", relative_threshold=1.5, absolute_threshold=0.02),
        MetricThreshold(name="latency_p99", relative_threshold=1.1, absolute_threshold=2.0),
        MetricThreshold(name="cpu_utilization", relative_threshold=1.2, significance_level=0.10),
        MetricThreshold(name="memory_utilization", relative_threshold=1.2, significance_level=0.10),
    ])
    max_consecutive_failures: int = 3
    evaluation_interval_seconds: int = 30
    min_observation_seconds: int = 120


class CanaryAnalyzer:
    """Analyzes canary metrics and makes rollout decisions."""

    def __init__(self, config: Optional[CanaryConfig] = None):
        self.config = config or CanaryConfig()
        self.failures: Dict[str, int] = {}
        self.current_stage = 0
        self.metrics_history: Dict[str, Dict] = {}

    def evaluate(
        self,
        baseline_metrics: Dict[str, List[float]],
        canary_metrics: Dict[str, List[float]],
    ) -> Tuple[CanaryDecision, List[str], Dict]:
        """
        Evaluate canary metrics against baseline.
        
        Returns:
            (decision, failure_reasons, details)
        """
        failures = []
        details = {}

        for threshold in self.config.metrics:
            if threshold.name not in baseline_metrics or threshold.name not in canary_metrics:
                continue

            baseline_vals = np.array(baseline_metrics[threshold.name])
            canary_vals = np.array(canary_metrics[threshold.name])

            if len(baseline_vals) < threshold.min_sample_size:
                logger.warning(
                    f"Insufficient baseline samples for {threshold.name}: "
                    f"{len(baseline_vals)} < {threshold.min_sample_size}"
                )
                continue

            if len(canary_vals) < threshold.min_sample_size:
                logger.warning(
                    f"Insufficient canary samples for {threshold.name}: "
                    f"{len(canary_vals)} < {threshold.min_sample_size}"
                )
                continue

            baseline_mean = np.mean(baseline_vals)
            canary_mean = np.mean(canary_vals)

            # Calculate relative difference
            if baseline_mean > 0:
                relative_diff = (canary_mean - baseline_mean) / abs(baseline_mean)
            else:
                relative_diff = float('inf') if canary_mean > 0 else 0.0

            # Statistical significance test
            if threshold.use_mann_whitney and len(baseline_vals) > 0 and len(canary_vals) > 0:
                try:
                    _, p_value = stats.mannwhitneyu(
                        canary_vals, baseline_vals, alternative='two-sided'
                    )
                except Exception as e:
                    logger.warning(f"Mann-Whitney test failed: {e}")
                    p_value = 1.0
            else:
                p_value = 1.0

            significant = p_value < threshold.significance_level

            # Check thresholds
            threshold_exceeded = relative_diff > threshold.relative_threshold
            absolute_exceeded = (
                threshold.absolute_threshold is not None
                and canary_mean > threshold.absolute_threshold
            )

            failed = significant and (threshold_exceeded or absolute_exceeded)

            if failed:
                failures.append(threshold.name)
                self.failures[threshold.name] = self.failures.get(threshold.name, 0) + 1
            else:
                self.failures[threshold.name] = 0

            details[threshold.name] = {
                "baseline_mean": float(baseline_mean),
                "canary_mean": float(canary_mean),
                "relative_diff": float(relative_diff),
                "p_value": float(p_value),
                "statistically_significant": bool(significant),
                "threshold_exceeded": bool(threshold_exceeded),
                "absolute_exceeded": bool(absolute_exceeded),
                "status": "pass" if not failed else "fail",
            }

        # Check consecutive failures
        max_consecutive = max(self.failures.values()) if self.failures else 0
        if max_consecutive >= self.config.max_consecutive_failures:
            decision = CanaryDecision.FAIL
        elif len(failures) == 0:
            decision = CanaryDecision.PASS
        else:
            decision = CanaryDecision.INCONCLUSIVE

        return decision, failures, details

    def get_stage_config(self) -> Dict:
        """Get current canary stage configuration."""
        if self.current_stage >= len(self.config.stages):
            return {"weight": 1.0, "duration": 0, "name": "100%"}
        return self.config.stages[self.current_stage]

    def advance_stage(self) -> bool:
        """Advance to next canary stage. Returns True if more stages remain."""
        self.current_stage += 1
        return self.current_stage < len(self.config.stages)

    def get_failure_summary(self) -> Dict[str, int]:
        """Get consecutive failure count per metric."""
        return dict(self.failures)


# Usage
analyzer = CanaryAnalyzer()
baseline = {"error_rate": [0.001] * 100, "latency_p99": [0.45] * 100}
canary = {"error_rate": [0.0015] * 60 + [0.01] * 40, "latency_p99": [0.48] * 100}
decision, failures, details = analyzer.evaluate(baseline, canary)
print(f"Decision: {decision.value}")
print(f"Failures: {failures}")
print(f"Details: {details}")
```

## D.5 Capacity Forecasting Model (Python)

```python
"""
Capacity forecasting models for SRE capacity planning.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class CapacityForecast:
    current_usage: float
    forecasted_usage: float
    capacity_limit: float
    utilization_pct: float
    saturation_date: Optional[datetime]
    days_until_saturation: Optional[int]
    recommended_capacity: float
    confidence_level: str


class CapacityModel:
    """Capacity forecasting using multiple models."""

    @staticmethod
    def linear_growth(
        historical_usage: List[float],
        capacity_limit: float,
        forecast_days: int = 365,
        growth_rate: Optional[float] = None,
    ) -> CapacityForecast:
        """
        Linear growth model based on historical trend or specified growth rate.
        """
        n = len(historical_usage)
        current_usage = historical_usage[-1]

        if growth_rate is None and n > 1:
            # Calculate from historical data
            x = np.arange(n)
            y = np.array(historical_usage)
            coeffs = np.polyfit(x, y, 1)
            growth_per_day = coeffs[0]
        elif growth_rate is not None:
            growth_per_day = current_usage * (growth_rate / 100.0)
        else:
            growth_per_day = 0

        forecasted_usage = current_usage + growth_per_day * forecast_days
        utilization = forecasted_usage / capacity_limit

        # Find saturation date
        if growth_per_day > 0:
            days_to_saturation = (capacity_limit * 0.9 - current_usage) / growth_per_day
            saturation_date = datetime.utcnow() + timedelta(days=days_to_saturation)
        else:
            days_to_saturation = None
            saturation_date = None

        recommended = forecasted_usage * 1.3  # 30% headroom

        return CapacityForecast(
            current_usage=current_usage,
            forecasted_usage=forecasted_usage,
            capacity_limit=capacity_limit,
            utilization_pct=utilization,
            saturation_date=saturation_date,
            days_until_saturation=int(days_to_saturation) if days_to_saturation else None,
            recommended_capacity=recommended,
            confidence_level="medium",
        )

    @staticmethod
    def exponential_growth(
        historical_usage: List[float],
        capacity_limit: float,
        forecast_days: int = 365,
    ) -> CapacityForecast:
        """
        Exponential growth model for viral growth scenarios.
        """
        n = len(historical_usage)
        current_usage = historical_usage[-1]

        if n > 1:
            x = np.arange(n)
            y = np.log(np.array(historical_usage) + 1)
            coeffs = np.polyfit(x, y, 1)
            growth_rate = coeffs[0]
        else:
            growth_rate = 0.01  # Default 1% daily

        forecasted_usage = current_usage * np.exp(growth_rate * forecast_days)
        utilization = forecasted_usage / capacity_limit

        if growth_rate > 0 and forecasted_usage > capacity_limit:
            days_to_saturation = np.log(capacity_limit * 0.9 / current_usage) / growth_rate
            saturation_date = datetime.utcnow() + timedelta(days=days_to_saturation)
        else:
            days_to_saturation = None
            saturation_date = None

        recommended = max(forecasted_usage * 1.5, capacity_limit * 1.2)

        return CapacityForecast(
            current_usage=current_usage,
            forecasted_usage=forecasted_usage,
            capacity_limit=capacity_limit,
            utilization_pct=utilization,
            saturation_date=saturation_date,
            days_until_saturation=int(days_to_saturation) if days_to_saturation else None,
            recommended_capacity=recommended,
            confidence_level="low",
        )

    @staticmethod
    def seasonal_model(
        hourly_usage: List[float],
        capacity_limit: float,
        forecast_days: int = 90,
    ) -> CapacityForecast:
        """
        Seasonal model with daily and weekly patterns.
        """
        current_usage = hourly_usage[-1]
        daily_peak = max(hourly_usage[-24:]) if len(hourly_usage) >= 24 else current_usage
        weekly_peak = max(hourly_usage[-168:]) if len(hourly_usage) >= 168 else daily_peak

        # Forecast using current weekly peak with growth
        growth_factor = 1.0
        if len(hourly_usage) >= 336:  # 2 weeks
            last_week_peak = max(hourly_usage[-168:])
            prev_week_peak = max(hourly_usage[-336:-168])
            if prev_week_peak > 0:
                growth_factor = last_week_peak / prev_week_peak

        forecasted_peak = weekly_peak * (growth_factor ** (forecast_days / 7))
        utilization = forecasted_peak / capacity_limit

        if growth_factor > 1 and forecasted_peak > capacity_limit:
            weeks_to_saturation = np.log(capacity_limit * 0.9 / weekly_peak) / np.log(growth_factor)
            days_to_saturation = weeks_to_saturation * 7
            saturation_date = datetime.utcnow() + timedelta(days=days_to_saturation)
        else:
            days_to_saturation = None
            saturation_date = None

        recommended = forecasted_peak * 1.3

        return CapacityForecast(
            current_usage=current_usage,
            forecasted_usage=forecasted_peak,
            capacity_limit=capacity_limit,
            utilization_pct=utilization,
            saturation_date=saturation_date,
            days_until_saturation=int(days_to_saturation) if days_to_saturation else None,
            recommended_capacity=recommended,
            confidence_level="high",
        )


# Usage example
model = CapacityModel()
historical = [100 + i * 2 + np.random.normal(0, 5) for i in range(90)]
forecast = model.linear_growth(historical, capacity_limit=500, forecast_days=180)
print(f"Current usage: {forecast.current_usage:.0f}")
print(f"Forecasted usage (180d): {forecast.forecasted_usage:.0f}")
print(f"Capacity limit: {forecast.capacity_limit}")
print(f"Projected utilization: {forecast.utilization_pct:.1%}")
print(f"Saturation date: {forecast.saturation_date}")
print(f"Recommended capacity: {forecast.recommended_capacity:.0f}")
```

## D.6 SRE Incident Response Automation Script

```python
#!/usr/bin/env python3
"""
Incident Response Automation
Auto-creates incident channels, tickets, and notification.
"""

import os
import sys
import json
import requests
from datetime import datetime
from typing import Optional, Dict


class IncidentResponder:
    """Automates incident response creation and notification."""

    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = json.load(f)

    def create_incident(
        self,
        alert_name: str,
        severity: str,
        service: str,
        summary: str,
        metrics_snapshot: Optional[Dict] = None,
    ) -> Dict:
        """Create incident and trigger response workflow."""
        incident_id = f"INC-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
        timestamp = datetime.utcnow().isoformat()

        incident = {
            "id": incident_id,
            "alert": alert_name,
            "severity": severity,
            "service": service,
            "summary": summary,
            "created_at": timestamp,
            "status": "open",
            "metrics": metrics_snapshot or {},
        }

        # Create incident channel (Slack)
        channel_name = f"incident-{incident_id.lower()}"
        self._create_channel(channel_name)

        # Notify on-call
        self._page_oncall(incident)

        # Create tracking ticket
        self._create_ticket(incident)

        # Post initial update
        self._post_update(channel_name, self._format_initial_update(incident))

        logger.info(f"Incident {incident_id} created for {service} ({severity})")
        return incident

    def _create_channel(self, channel_name: str):
        """Create incident communication channel."""
        if self.config.get("slack_token"):
            headers = {
                "Authorization": f"Bearer {self.config['slack_token']}",
                "Content-Type": "application/json",
            }
            data = {"name": channel_name, "is_private": True}
            try:
                resp = requests.post(
                    "https://slack.com/api/conversations.create",
                    headers=headers,
                    json=data,
                )
                resp.raise_for_status()
            except Exception as e:
                logger.error(f"Failed to create Slack channel: {e}")

    def _page_oncall(self, incident: Dict):
        """Page on-call engineer via PagerDuty/OpsGenie."""
        if self.config.get("pagerduty_routing_key"):
            headers = {
                "Content-Type": "application/json",
            }
            data = {
                "routing_key": self.config["pagerduty_routing_key"],
                "event_action": "trigger",
                "payload": {
                    "summary": f"[{incident['severity']}] {incident['service']}: {incident['summary']}",
                    "severity": incident["severity"].lower(),
                    "source": incident["service"],
                    "timestamp": incident["created_at"],
                    "custom_details": incident,
                },
            }
            try:
                resp = requests.post(
                    "https://events.pagerduty.com/v2/enqueue",
                    headers=headers,
                    json=data,
                )
                resp.raise_for_status()
            except Exception as e:
                logger.error(f"Failed to page on-call: {e}")

    def _create_ticket(self, incident: Dict):
        """Create tracking ticket in Jira/GitHub."""
        if self.config.get("jira_url"):
            headers = {
                "Authorization": f"Basic {self.config['jira_token']}",
                "Content-Type": "application/json",
            }
            data = {
                "fields": {
                    "project": {"key": self.config["jira_project"]},
                    "summary": f"[{incident['severity']}] {incident['service']}: {incident['summary']}",
                    "description": json.dumps(incident, indent=2),
                    "issuetype": {"name": "Incident"},
                    "priority": {"name": incident["severity"]},
                }
            }
            try:
                resp = requests.post(
                    f"{self.config['jira_url']}/rest/api/2/issue",
                    headers=headers,
                    json=data,
                )
                resp.raise_for_status()
            except Exception as e:
                logger.error(f"Failed to create Jira ticket: {e}")

    def _post_update(self, channel: str, message: str):
        """Post update to incident channel."""
        if self.config.get("slack_token"):
            headers = {
                "Authorization": f"Bearer {self.config['slack_token']}",
                "Content-Type": "application/json",
            }
            data = {"channel": channel, "text": message}
            try:
                resp = requests.post(
                    "https://slack.com/api/chat.postMessage",
                    headers=headers,
                    json=data,
                )
                resp.raise_for_status()
            except Exception as e:
                logger.error(f"Failed to post to Slack: {e}")

    def _format_initial_update(self, incident: Dict) -> str:
        """Format incident notification message."""
        return (
            f"🚨 *Incident {incident['id']}*\n"
            f"*Severity:* {incident['severity']}\n"
            f"*Service:* {incident['service']}\n"
            f"*Alert:* {incident['alert']}\n"
            f"*Summary:* {incident['summary']}\n"
            f"*Time:* {incident['created_at']}\n"
            f"\n*Next:* Triage and mitigate. Status updates every 30 min."
        )


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--alert", required=True)
    parser.add_argument("--severity", required=True)
    parser.add_argument("--service", required=True)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    responder = IncidentResponder(args.config)
    incident = responder.create_incident(
        alert_name=args.alert,
        severity=args.severity,
        service=args.service,
        summary=args.summary,
    )
    print(json.dumps(incident, indent=2))
```

## D.7 SRE Dashboard as Code Template (Grafana)

```json
{
  "dashboard": {
    "title": "SRE Dashboard - {{service}}",
    "tags": ["sre", "{{service}}"],
    "timezone": "utc",
    "panels": [
      {
        "title": "SLO Compliance (30d)",
        "type": "stat",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "sli:availability:rate_30d{service=\"{{service}}\"}",
            "format": "time_series"
          }
        ],
        "options": {
          "colorMode": "background",
          "graphMode": "sparkline",
          "reduceOptions": {
            "calcs": ["lastNotNull"]
          },
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {"color": "red", "value": null},
              {"color": "yellow", "value": 0.99},
              {"color": "green", "value": 0.999}
            ]
          }
        }
      },
      {
        "title": "Error Budget Remaining",
        "type": "gauge",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "slo:error_budget_remaining{service=\"{{service}}\"}",
            "format": "time_series"
          }
        ],
        "options": {
          "reduceOptions": {
            "calcs": ["lastNotNull"]
          },
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {"color": "red", "value": null},
              {"color": "yellow", "value": 0.25},
              {"color": "green", "value": 0.5}
            ]
          }
        }
      },
      {
        "title": "Request Rate",
        "type": "timeseries",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"{{service}}\"}[5m]))",
            "legendFormat": "Total"
          },
          {
            "expr": "sum(rate(http_requests_total{service=\"{{service}}\", status=~\"5..\"}[5m]))",
            "legendFormat": "Errors"
          }
        ],
        "options": {
          "legend": {"displayMode": "table", "placement": "bottom"}
        }
      },
      {
        "title": "Latency (p99)",
        "type": "timeseries",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\"{{service}}\"}[5m])) by (le))",
            "legendFormat": "p99"
          }
        ],
        "options": {
          "legend": {"displayMode": "table", "placement": "bottom"}
        }
      },
      {
        "title": "Burn Rate (1h)",
        "type": "timeseries",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "slo:burn_rate:1h{service=\"{{service}}\"}",
            "legendFormat": "Burn Rate 1h"
          }
        ],
        "options": {
          "legend": {"displayMode": "table", "placement": "bottom"}
        }
      }
    ],
    "schemaVersion": 30,
    "version": 1
  }
}
```

---

# Appendix E: SRE Glossary

| Term | Definition |
|------|------------|
| Availability | The proportion of time a service is accessible and functional |
| Backoff | Delaying retries to reduce load on a failing system |
| Blast Radius | The scope of impact of a failure or experiment |
| Blameless | Focusing on systemic causes rather than individual actions |
| Bulkhead | Isolating system components to prevent cascading failures |
| Burn Rate | The rate at which error budget is consumed |
| Canary | A small-scale deployment to test a change before full rollout |
| Capacity Planning | Forecasting resource needs to meet demand |
| Cascading Failure | A failure that propagates through a system |
| Chaos Engineering | Experimenting on systems to build confidence in reliability |
| Circuit Breaker | Stopping calls to a failing dependency to prevent cascading |
| Cold Start | Initial latency when a serverless function first runs |
| Compliance Window | The time period over which SLO compliance is measured |
| Consensus | Agreement among distributed nodes on a value or state |
| Dark Launch | Deploying code without making it visible to users |
| Deadline Propagation | Carrying timeout context across service boundaries |
| Degradation | Reduced functionality while maintaining core operations |
| Error Budget | The amount of acceptable failure within SLO compliance |
| Failover | Switching to a backup system when primary fails |
| Fallback | Alternative behavior when a dependency fails |
| Feature Flag | A runtime toggle for feature activation |
| Five Nines | 99.999% availability (5.26 minutes downtime/year) |
| Game Day | A planned exercise to practice incident response |
| Golden Signals | Latency, traffic, errors, saturation — the four key metrics |
| Graceful Degradation | Maintaining partial functionality during failure |
| Half-Open | Circuit breaker state allowing limited test requests |
| Health Check | An endpoint to determine if a service is functioning |
| Idempotency | An operation that produces the same result regardless of repetition |
| Incident Commander | The leader who coordinates response during an incident |
| Jitter | Random variation in retry timing to avoid thundering herd |
| Kill Switch | A mechanism to immediately disable a feature |
| Liveness Probe | A check to determine if a process is alive |
| Load Shedding | Dropping low-priority requests to protect the system |
| MTBF | Mean Time Between Failures |
| MTTD | Mean Time to Detect |
| MTTR | Mean Time to Resolve |
| Multi-Window | Using multiple time windows for burn rate detection |
| On-Call | A rotation of engineers responsible for responding to incidents |
| Postmortem | An analysis of an incident to identify improvements |
| PreStop Hook | Action taken before a container is terminated |
| Progressive Delivery | Gradually rolling out changes with verification |
| Quorum | The minimum number of nodes required for consensus |
| RPO | Recovery Point Objective — maximum acceptable data loss |
| RTO | Recovery Time Objective — maximum acceptable downtime |
| Readiness Probe | A check to determine if a service can handle traffic |
| Replication Lag | The delay between writing to primary and updating replicas |
| Retry Budget | Limiting retry volume to prevent overload |
| Rollback | Reverting to a previous version of a deployment |
| Runbook | Documented procedure for handling an alert or incident |
| Saturation | The degree to which a resource is fully utilized |
| Self-Healing | Automated recovery from common failure modes |
| Signal-to-Noise | The ratio of actionable alerts to non-actionable ones |
| SLA | Service Level Agreement — a contractual reliability commitment |
| SLI | Service Level Indicator — a quantitative measure of service quality |
| SLO | Service Level Objective — a target value for an SLI |
| Split Brain | A situation where nodes in a distributed system diverge |
| Startup Probe | A check to determine if a service has initialized |
| Tail Latency | High-percentile latency (p99, p999) |
| Thundering Herd | Simultaneous retry from multiple clients overwhelming a system |
| Tier | Service classification by criticality (Tier 0 = most critical) |
| Toil | Manual, repetitive, automatable operational work |
| Topology Spread | Distributing workloads across failure domains |
| USE Method | Utilization, Saturation, Errors — resource analysis methodology |

---

# Appendix F: SRE Quick Reference Cards

## F.1 SRE Decision Flow: Should I Deploy?

```
┌─────────────────────────────────────────────────────┐
│            SHOULD I DEPLOY?                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Is error budget remaining > 50%?                 │
│     YES → Deploy freely                              │
│     NO → Continue                                    │
│                                                      │
│  2. Is error budget remaining 25-50%?                │
│     YES → Need SRE approval, document justification  │
│     NO → Continue                                    │
│                                                      │
│  3. Is error budget remaining 10-25%?                │
│     YES → Only critical fixes and rollbacks          │
│     NO → Continue                                    │
│                                                      │
│  4. Is error budget remaining < 10%?                 │
│     YES → DO NOT DEPLOY (emergency mode)             │
│                                                      │
│  EXCEPTIONS:                                         │
│  - Rollback to known-good version: ALWAYS ALLOWED    │
│  - Hotfix for budget consumption cause: SRE APPROVAL │
│  - Security patch: SECURITY + SRE APPROVAL           │
│  - Configuration change to restore SLO: ON-CALL APPR│
└─────────────────────────────────────────────────────┘
```

## F.2 SRE Decision Flow: What Severity Is This?

```
┌─────────────────────────────────────────────────────┐
│          WHAT SEVERITY IS THIS INCIDENT?             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Is service completely unavailable for all users?    │
│  YES → SEV0                                          │
│  NO → Continue                                       │
│                                                      │
│  Is data loss confirmed?                             │
│  YES → SEV0                                          │
│  NO → Continue                                       │
│                                                      │
│  Is revenue impact > $100K/hr?                       │
│  YES → SEV0                                          │
│  NO → Continue                                       │
│                                                      │
│  Are > 20% of users affected?                        │
│  YES → SEV1                                          │
│  NO → Continue                                       │
│                                                      │
│  Is revenue impact $10K-$100K/hr?                    │
│  YES → SEV1                                          │
│  NO → Continue                                       │
│                                                      │
│  Are 5-20% of users affected?                        │
│  YES → SEV2                                          │
│  NO → SEV3 (minor impact)                            │
└─────────────────────────────────────────────────────┘
```

## F.3 SRE Decision Flow: Should I Rollback?

```
┌─────────────────────────────────────────────────────┐
│           SHOULD I ROLLBACK?                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Has error rate increased > 2x since deployment?     │
│  YES → ROLLBACK IMMEDIATELY                          │
│  NO → Continue                                       │
│                                                      │
│  Has p99 latency increased > 20%?                    │
│  YES → ROLLBACK (investigate performance regression) │
│  NO → Continue                                       │
│                                                      │
│  Is error budget burn rate > 2x normal?              │
│  YES → ROLLBACK (monitor after rollback)             │
│  NO → Continue                                       │
│                                                      │
│  Are downstream services degrading?                  │
│  YES → ROLLBACK (check dependency compatibility)     │
│  NO → Continue monitoring, inform team               │
│                                                      │
│  All checks passed? → Keep monitoring for 4 hours    │
└─────────────────────────────────────────────────────┘
```

## F.4 Burn Rate Alert Tuning Card

```
┌─────────────────────────────────────────────────────┐
│           BURN RATE ALERT TUNING                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Too many false positives?                           │
│  → Increase burn rate threshold                      │
│  → Extend minimum duration                           │
│  → Widen the short window                            │
│                                                      │
│  Missing real incidents?                             │
│  → Decrease burn rate threshold                      │
│  → Shorten minimum duration                          │
│  → Narrow the long window                            │
│                                                      │
│  Standard tuning parameters:                         │
│  SLO 99.9%:  fast=14/5min,  slow=2.5/30min          │
│  SLO 99.99%: fast=20/5min, slow=3.5/30min           │
│  SLO 99.5%:  fast=10/5min, slow=2.0/30min           │
│                                                      │
│  SNR target: > 0.5 (at least 1 actionable per 2)     │
│  False positive target: < 50% of all pages           │
│  Page target: < 5 pages per shift per person         │
└─────────────────────────────────────────────────────┘
```

## F.5 SRE Daily Checklist

```
┌─────────────────────────────────────────────────────┐
│              SRE DAILY CHECKLIST                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ☐ Check SLO compliance for critical services        │
│  ☐ Review error budget consumption                   │
│  ☐ Check burn rates (1h, 6h, 24h)                    │
│  ☐ Review active incidents                           │
│  ☐ Check pending deployments                         │
│  ☐ Verify capacity headroom                          │
│  ☐ Review postmortem action items                    │
│  ☐ Check on-call handoff notes                       │
│  ☐ Review alert SNR (false positive rate)            │
│  ☐ Check chaos experiment results (if applicable)    │
│                                                      │
│  Weekly:                                             │
│  ☐ SLO compliance trend (7-day)                      │
│  ☐ Toil ratio measurement                            │
│  ☐ Automation progress review                        │
│  ☐ Incident trend analysis                           │
│  ☐ Capacity forecast update                          │
│                                                      │
│  Monthly:                                            │
│  ☐ SLO report to stakeholders                        │
│  ☐ Error budget consumption report                   │
│  ☐ Postmortem action item closure review             │
│  ☐ Alert threshold review and tuning                 │
│  ☐ On-call load review                               │
│                                                      │
│  Quarterly:                                          │
│  ☐ SLO target review with product                    │
│  ☐ Capacity plan for next quarter                    │
│  ☐ Service maturity reassessment                     │
│  ☐ Chaos engineering program review                  │
│  ☐ DR test or tabletop exercise                      │
│  ☐ On-call satisfaction survey                       │
└─────────────────────────────────────────────────────┘
```

---

*End of SRE Engineer SKILL.md — This document defines the complete SRE Engineer persona within the synarc framework. All practices, patterns, and frameworks should be adapted to your organization's context, maturity level, and business requirements. Reliability is never finished — it is a continuous practice of measurement, improvement, and learning.*
