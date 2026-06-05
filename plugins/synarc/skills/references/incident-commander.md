---
title: "Incident Commander — Crisis Reasoning & Incident Response"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - incident-response
  - crisis-management
  - severity-classification
  - containment
  - blameless-postmortem
  - escalation
  - war-room
  - runbooks
---

# Purpose

Coordinate incident response under pressure. The IC's job is not to fix the problem personally but to coordinate the response, maintain clear thinking, and ensure organizational learning.

# Scope

Incident command sequence, severity classification, blast radius assessment, crisis reasoning (OODA loop), command structure roles, communication trees, containment strategies, timeline logs, blameless postmortems, war room practices, on-call best practices, runbook development, incident metrics.

# Inputs

Alerts, monitoring data, user reports, system health metrics, deployment history, on-call roster, runbooks.

# Output

Severity classification, incident timeline, containment actions, resolution verification, postmortem with action items, process improvements.

# Notes

Inherits synarc core. COMPACT token mode by default.

## 1. The Incident Command Sequence [P2.1]

```
DETECT → TRIAGE → CONTAIN → ERADICATE → RECOVER → REVIEW → POSTMORTEM → CLOSE
```

**Step 1 — DETECT**: Verify alert is real. Gather: what, where, when, who reported, which signal triggered.

**Step 2 — TRIAGE**: Classify severity. Assess blast radius. Declare incident if SEV-2+. Assign IC.

**Step 3 — CONTAIN**: Stop the bleeding. Roll back, feature flag off, divert traffic. Preserve evidence. Top priority while blast radius is expanding.

**Step 4 — ERADICATE**: Remove root cause. Apply permanent fix. Verify fix addresses cause, not symptom.

**Step 5 — RECOVER**: Restore full service. Verify health. Monitor 30-60 min. Confirm metrics return to baseline.

**Step 6 — REVIEW**: Initial review while fresh. Identify what worked/didn't. Prepare for postmortem.

**Step 7 — POSTMORTEM**: Blameless within 48 hours. Timeline, root cause, contributing factors, action items.

**Step 8 — CLOSE**: Update status page. Log all actions. File action item tickets. Update runbooks.

## 2. Severity Classification [P2.2]

| Severity | Definition | Response | Communication |
|----------|-----------|----------|---------------|
| SEV-1 | Complete outage, data loss, security breach, revenue impact | Immediate (<5 min) | Executive + all-hands |
| SEV-2 | Partial outage, major feature broken, >5% users degraded | <15 min | Eng management |
| SEV-3 | Minor feature broken, single/small cohort | <4 hours | Team lead |
| SEV-4 | Question, bug report, non-urgent | <24 hours | Backlog |

**Rule**: When in doubt, classify higher. Can downgrade later. Upgrading mid-incident erodes trust.

**Auto SEV-1 triggers**: Data corruption, scope = entire-platform, public visible, revenue impact ≥ significant.

## 3. Blast Radius Assessment [P2.3]

``` 
USER IMPACT: none | single | few | many | most | all
DATA IMPACT: none | inconsistent | corrupted | lost
DURATION: seconds | minutes | hours | days
SCOPE: single-service | multi-service | entire-platform | customer-facing
```

**Expansion velocity**: Slow (hours) → Moderate (10-30 min) → Fast (2-5 min) → Immediate (<1 min). Faster velocity = more aggressive containment.

## 4. Crisis Reasoning: OODA Loop [P2.4]

```
OBSERVE → ORIENT → DECIDE → ACT (loop repeats)
```

**Observe**: Raw data from monitoring, alerts, reports — neutral, no interpretation yet.

**Orient**: Interpret against mental model of system. Most critical step — experience + training + system knowledge = situational awareness.

**Decide**: Choose course of action with clear rationale and explicit success criteria.

**Act**: Execute. Log every action with timestamp. Loop back and observe results.

## 5. Command Structure Roles [P2.5]

```
                     INCIDENT COMMANDER
                           |
             ┌─────────────┼─────────────┬──────────────┐
             │             │             │              │
          SCRIBE         SMEs        COMMS LEAD    EXEC LIAISON
```

**IC**: Overall responsibility. Does NOT investigate/fix. Makes escalation and resource decisions.

**Scribe**: Maintains real-time timeline log. Records every action/observation/decision.

**SMEs**: Investigate technical issue. Report to IC. Propose containment/resolution.

**Comms Lead**: Internal/external updates. Status page. Shields IC from communication overhead.

**Exec Liaison**: Single contact for exec leadership. Translates technical to business impact.

## 6. Communication Trees [P2.6]

```
INCIDENT DECLARED → COMMANDER ASSIGNED
  ├── SCRIBE: "Start timeline log. Incident ID: [ID]. Severity: [SEV]."
  ├── SMEs: "Investigate [area]. Report back every 15 minutes."
  ├── COMMS LEAD: "Prepare internal/external updates."
  ├── ENGINEERING MANAGER: "SEV-[N]. Blast radius: [X]."
  ├── SUPPORT: "Prepare for customer inquiries."
  └── STATUS PAGE: "Investigating [symptom]. Next update in 30 min."
```

**Cadence**: SEV-1: internal every 15 min, management every 30 min, public every 30-60 min. SEV-2: internal every 30 min.

**Notification timing**: SMEs immediate (SEV-1) / 5 min (SEV-2). Engineering Manager 5/10 min. Director/VP 10/30 min. CTO/CIO 15 min (SEV-1).

## 7. Containment Strategies [P3.3]

| Strategy | Speed | Risk | Best For |
|----------|-------|------|----------|
| Rollback | 2-10 min | May lose recent data | Deploy-induced incidents |
| Feature Flag | 1-5 min | Only if flagged | New feature issues |
| Traffic Shifting | 1-10 min | May overload target | Regional issues |
| Rate Limiting | 1-5 min | Partial degradation | Cascade risks |
| Circuit Breaker | Immediate | Degrades dependency | Dependency failures |
| Kill Switch | Immediate | Broad impact, last resort | Active harm |
| Restart | 2-10 min | Short downtime | Memory leaks, hung processes |
| Failover | 5-30 min | Complex, data sync | Region-level failures |

**Containment-first rule**: If blast radius expanding, always contain first. **Resolution-first exception**: Fix known and under 5 min AND blast radius not expanding.

## 8. IC Decision Tree [P3.4]

```
Blast radius expanding?
  YES → Can we contain?
          YES → CONTAIN NOW
          NO → Escalate SEV-1, request more resources
  NO → Cause known?
          YES → Fix in <5 min? → APPLY FIX or CONTAIN first
          NO → Delegate to SME, set 15-min check-in
Service restored?
  YES → Monitor 15 min, metrics normal? → Close
  NO → Continue coordination
```

## 9. Timeline Log [P3.5]

Every entry with timestamp. Entry types: `METRIC`, `ACTION`, `DECISION`, `OBSERVATION`, `COMMUNICATION`, `STATUS`, `HANDOFF`. No judgment or blame. Raw data for postmortem.

## 10. Blameless Postmortem Structure [P3.6]

Template sections: Title, Date, Severity, Duration, Commander, SMEs, Executive Summary, Timeline, Impact, Root Cause, Contributing Factors, Detection, Response (went well/went wrong/improve), Action Items (owner, due date), Prevention.

**Blameless rule**: Every finding is a system finding. No action item targets a person's behavior.

**Action item quality**: Specific, measurable, assigned, dated, tracked, systemic (prevents a class of incidents).

**Postmortem scoring** (target 12/14): Root cause specificity, timeline completeness, action item quality, contributing factors, detection analysis, prevention, blamelessness.

## 11. Incident Metrics [P7]

| Metric | Target | How to Improve |
|--------|--------|---------------|
| MTTD (Mean Time to Detect) | Minutes for critical | Better monitoring, synthetic checks, anomaly detection |
| MTTR (Mean Time to Resolve) | SEV-1 <30 min, SEV-2 <2h | Runbooks, practice, automation |
| MTTC (Mean Time to Contain) | SEV-1 <5 min, SEV-2 <15 min | Rollback automation, feature flags |
| MTBF (Mean Time Between Failures) | Higher is better | Quality testing, meaningful action items, resilience |

## 12. On-Call Best Practices [P6]

**Schedule**: Primary + secondary, weekly rotations, minimum 4 people per rotation. Handoff at 10 AM, 30-min overlap.

**Burnout prevention**: Limit to 1 week in 4 minimum (1 in 6 preferred). 24-48h recovery after on-call. Tune alerts ruthlessly. Automate common responses.

## 13. Runbook Template [P9]

1. VERIFY the alert (dashboards, metrics)
2. ASSESS impact (blast radius, user/data impact)
3. CONTAINMENT steps (numbered, with rollback)
4. INVESTIGATION steps (where to look, common causes)
5. RESOLUTION steps (specific fix, verification)
6. VERIFICATION (how to confirm resolved, monitoring period)
7. ESCALATION (when, who, how)
8. COMMON FAILURE MODES

## 14. War Room Best Practices [P3.7]

**Setup**: Large screen, whiteboard, stable internet. Virtual: dedicated video, low-latency audio, recording only if announced.

**Rules**: Essential personnel only. One conversation at a time. IC controls. Remote participants priority. No side conversations during updates. No blame.

**Channels**: `#incident-[id]` (coordination), `#incident-[id]-updates` (read-only), `#incident-[id]-investigation` (debugging), `#incident-[id]-log` (timeline).

## 15. Incident Response Maturity Model [P10.4]

Level 0 (Ad hoc) → 1 (Reactive) → 2 (Defined) → 3 (Measured) → 4 (Proactive) → 5 (Resilient). Target: Level 3 for most orgs, 4-5 for critical infrastructure.
