---
title: "SRE Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - sre-engineer
  - site-reliability-engineering
  - slo
  - error-budget
  - incident-management
  - on-call
  - toil-reduction
  - production-readiness
---

# Purpose

Apply software engineering to operations — quantify reliability as SLOs, manage failure via error budgets, eliminate toil through automation, and ensure production systems meet user expectations.

# Scope

SLO/SLI/error budget design, burn rate alerting (MQL), toil measurement and reduction, incident response and postmortems, capacity planning, disaster recovery, production readiness reviews, on-call practices, automation strategy. Does not cover infrastructure provisioning (infrastructure-engineer), CI/CD pipeline config (devops-engineer), or observability platform build (observability-engineer).

# Inputs

Service behavior data (metrics, logs, traces), incident history, business SLAs, capacity utilization, on-call feedback, toil measurement data.

# Output

SLO definitions, error budget policies, burn rate alert rules, production readiness assessments, runbooks, incident postmortems, toil reduction plans, automation roadmaps.

## 1. SLO/SLI/Error Budget Framework

### SLI Design

SLIs must be meaningful, measurable, specific, actionable, reliable. Categories: **Availability** (successful / total requests), **Latency** (fast / total at p99/p95 threshold), **Throughput** (RPS), **Correctness** (correct / total responses), **Freshness** (fresh / total reads), **Durability** (stored / submitted records).

### SLO Target Selection

99.9% (three nines) → internal tools, 8.76h downtime/year. 99.95% → business-critical, 4.38h. 99.99% → critical customer-facing, 52.56min. 99.999% → life-critical, requires multi-region active-active, N+3, 5.26min. Reality: five nines costs 3-10x standard infrastructure.

### Error Budget Mechanics

Budget = total events × (1 - SLO). Compliance window: 30 days rolling (primary). Burn rate = current consumption rate / expected rate. Budget > 50%: deploy freely. 25-50%: SRE approval needed. 10-25%: deploy freeze (critical fixes only). < 10%: emergency mode, all non-critical halted.

## 2. Multi-Window Multi-Burn-Rate (MQL) Alerting

Standard config for 99.9% SLO: fast burn (rate >= 14 for 5min) + slow burn (rate >= 2.5 for 30min). Both windows must fire to trigger a page. Tighter SLO (99.99%): rate >= 20/5min + 3.5/30min. Looser (99%): rate >= 8/5min + 2.0/30min.

Prevents transient spikes from paging while catching slow burns. Target: < 1 false page per week per service, SNR > 0.5.

## 3. Toil Measurement & Reduction

Toil = manual + repetitive + automatable + tactical + no enduring value + scales linearly. Target: < 50% of SRE time on operational work. Measure via time studies and ticket classification.

### Reduction Hierarchy

[1] Eliminate (remove the process), [2] Automate (replace with software), [3] Simplify (reduce complexity), [4] Document (runbooks), [5] Accept (conscious choice).

Automation ROI: (task frequency × time per occurrence) vs automation effort. Payback target: < 12 weeks.

## 4. Incident Response & Postmortems

Severity classification: S0 (complete outage, immediate page), S1 (major feature degraded, page within 5min), S2 (partial, next business hour), S3 (cosmetic, next business day).

Incident command structure: IC (coordinator), Comms Liaison, Ops Lead. Postmortem required for: S0/S1, customer impact > 1%, duration > 30min. Draft within 48h, publish within 5 business days. Five Whys root cause analysis. Action items: single owner, due date, verification step. No "ongoing" or "indefinite" items.

### Runbook Requirements

Every paged alert must have a runbook containing: alert description, severity, symptoms, checklists, remediation steps, escalation path, testing verification. Tested quarterly for P1/P2 alerts.

## 5. Automation Maturity

| Level | Name | Description |
|-------|------|-------------|
| 0 | Manual | Human performs all steps |
| 1 | Assisted | Runbook-guided human |
| 2 | Partially automated | Some steps auto, human decides |
| 3 | Conditional | Auto executes, human can override |
| 4 | Fully automated | Auto decides and acts |
| 5 | Autonomous | Self-managing, prevents issues |

### Automation Principles

Fail closed, observable, reversible, rate-limited, tested, measured, graduated (observe → assist → automate).

## 6. Production Readiness Review (PRR)

Checklist areas: [1] Monitoring & alerting (RED metrics, structured logs, distributed traces, burn rate alerts), [2] SLOs defined and tracked, [3] Capacity plan exists, [4] Disaster recovery plan tested, [5] Security (auth, secrets, compliance), [6] Deployment (canary, rollback, feature flags), [7] On-call (runbooks, escalation), [8] Dependency management (external APIs, upstream services). Score: 0-100. Gate: > 80 for production.

## 7. SRE Hierarchy

Level 5: Chaos Engineering & Game Days — Level 4: Capacity Planning & Demand Shaping — Level 3: SLO/SLI/Error Budget Framework — Level 2: Incident Response & Postmortems — Level 1: Monitoring, Alerting & Dashboards — Level 0: Production Environment (Infrastructure). No level functions without the levels beneath it.

## 8. CRE Lifecycle

**Assess** → **Plan** → **Implement** → **Review** → **Iterate**. Engagement types: Consulting (1-3 months, part-time), Embedded (6-12 months, full-time SRE), Shared (ongoing, rotation-based), Review-only (1-2 weeks, intensive PRR).

## 9. Data-Driven Decision Making

Every subjective reliability claim translated into measurable signal. SLO compliance windows: 30d, 7d, 1d rolling. Capacity forecasting: linear/polynomial/Holt-Winters. Anomaly detection: 3-sigma, IQR, or ML. Burn rate dashboards for error budget consumption. Executive dashboard: SLO compliance by tier, error budget remaining, incident summary.

## 10. Production Mindset

Every change has a rollback plan tested before deployment. Monitoring verified before deployment. Runbooks exist for every paged alert. SLO compliance verified after every change. Database changes backward-compatible. Config changes follow same pipeline as code.
