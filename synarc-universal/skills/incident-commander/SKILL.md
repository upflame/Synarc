---
name: incident-commander
description: Incident Commander — Crisis Reasoning & Incident Response Methodology
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Incident Commander — Crisis Reasoning & Incident Response Methodology

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

Incidents are inevitable. How you respond determines whether a minor issue becomes a crisis or a crisis becomes a learning opportunity. The incident commander's job is not to fix the problem personally but to coordinate the response, maintain clear thinking under pressure, and ensure the organization learns from every incident.



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


## P2 — METHODOLOGY: Incident Response Sequence

### P2.1 — The Incident Command Sequence

Every incident follows this sequence. Do not skip steps.

```
  ┌────────────────────────────────────────────────────────────────────────────┐
  │  1        2        3        4        5        6        7        8         │
  │ DETECT → TRIAGE → CONTAIN → ERADICATE → RECOVER → REVIEW → POSTMORTEM → CLOSE│
  └────────────────────────────────────────────────────────────────────────────┘
```

**Step 1 — DETECT:** Alert fires. Verify it is real. Gather initial data: what, where, when, who reported it, which metric or signal triggered.

**Step 2 — TRIAGE:** Classify severity formally. Assess blast radius across users, data, duration, scope, public visibility. Declare incident if SEV-2+. Assign IC.

**Step 3 — CONTAIN:** Stop the bleeding. Roll back, feature flag off, divert traffic. Preserve evidence. Top priority while blast radius is expanding.

**Step 4 — ERADICATE:** Remove the root cause. Apply the permanent fix. Clean up side effects. Verify the fix addresses the cause, not just the symptom.

**Step 5 — RECOVER:** Restore full service. Verify health across all dimensions. Monitor for 30-60 minutes. Confirm metrics return to baseline.

**Step 6 — REVIEW:** Initial review while details are fresh. Identify what worked and what did not. Prepare data for the formal postmortem.

**Step 7 — POSTMORTEM:** Schedule blameless postmortem within 48 hours. Capture timeline, root cause, contributing factors, action items.

**Step 8 — CLOSE:** Update status page. Log all actions. File action item tickets. Update runbooks.

### P2.2 — Severity Classification

#### P2.2.1 — Severity Definitions

| Severity | Definition | Response Time | Communication | SLA Impact |
|---|---|---|---|---|
| SEV-1 | Complete service outage, data loss, security breach, revenue impact | Immediate (<5 min) | Executive + all-hands | SLA breach certain |
| SEV-2 | Partial outage, major feature broken, degraded for many users (5%+) | <15 min | Engineering management | Potential SLA breach |
| SEV-3 | Minor feature broken, single user or small cohort, cosmetic issue | <4 hours | Team lead | No SLA impact |
| SEV-4 | Question, bug report, non-urgent, internal tooling issue | <24 hours | Team backlog | No SLA impact |

#### P2.2.2 — Declaration Rules

- When in doubt, classify higher. Can downgrade later. Upgrading mid-incident erodes trust.
- SEV-1 and SEV-2 require an incident commander. SEV-3 and SEV-4 are handled by on-call.
- SEV-1 requires a postmortem. SEV-2 requires a postmortem if duration > 1 hour or systemic risk.
- SEV-3 incidents may get a lightweight incident report if they reveal interesting failure modes.

#### P2.2.3 — Severity Classification Decision Tree

```
Is the service completely unavailable for all users?                     → SEV-1
Is data being corrupted or lost?                                         → SEV-1
Is there a security breach or credential exposure?                       → SEV-1
Is revenue being impacted? Are we losing >1% of revenue?                 → SEV-1
Are >5% of users impacted?                                               → SEV-2
Is a major feature broken?                                               → SEV-2
Is a minor feature broken or cosmetic?                                   → SEV-3
Otherwise                                                                → SEV-4
```

#### P2.2.4 — Severity Upgrade Signals

```
Is blast radius expanding despite containment?                           → Upgrade one level
Are we approaching SLA breach window?                                    → Upgrade to SEV-2+
Has incident duration exceeded 2 hours?                                  → Consider upgrade
Has executive attention been requested?                                  → Upgrade to SEV-1
Has a second service/team become involved?                               → Consider upgrade
Has customer-facing communication become necessary?                      → Upgrade to SEV-2+
```

#### P2.2.5 — Severity by Service Tier

| Tier | Examples | SEV-1 Trigger | SEV-2 Trigger |
|---|---|---|---|
| Critical | Payments, auth, core API | Any outage >1 min | Degraded >5% |
| Important | Search, recommendations | Any outage >5 min | Degraded >10% |
| Supporting | Admin panel, reporting | Outage >30 min | Degraded >20% |
| Experimental | Beta features | Any data loss | >100 users affected |

### P2.3 — Blast Radius Assessment

```
USER IMPACT:    none | single | few (<5%) | many (5-20%) | most (>20%) | all
DATA IMPACT:    none | inconsistent | corrupted | lost
DURATION:       seconds | minutes | hours | days
SCOPE:          single-service | multi-service | entire-platform | customer-facing
PUBLIC VISIBLE: no | yes — users see errors | yes — media/customers notified
REVENUE IMPACT: none | minimal (<1%) | significant (1-10%) | critical (>10%)

Automatic SEV-1 if: data impact >= corrupted, scope >= entire-platform,
public visible = yes, or revenue impact >= significant.
```

#### P2.3.1 — Blast Radius Expansion Monitoring

**Expansion indicators:** Error rate increasing minute-over-minute, additional services degrading, new user segments affected, latency creeping up, dependent services failing, queue depths growing.

**Containment trigger:** If any indicator shows growth for 3+ consecutive minutes, escalate containment priority above all else.

**Expansion velocity:**
- Slow: expands over hours (gradual memory leak)
- Moderate: expands over 10-30 minutes (connection pool exhaustion)
- Fast: expands over 2-5 minutes (cascading cache failure)
- Immediate: expands in under 1 minute (credential leak, config push)

Faster expansion velocity requires more aggressive containment. A cascading failure at immediate velocity may require full platform restart even if it causes brief total outage — controlled stop > uncontrolled crash.

### P2.4 — Crisis Reasoning Under Pressure

#### P2.4.1 — The OODA Loop

The OODA loop (Observe-Orient-Decide-Act) is the foundational framework for decision-making under pressure.

```
OBSERVE → ORIENT → DECIDE → ACT (loop repeats)
```

**Observe:** Collect raw data from monitoring, alerts, user reports, team members. What is happening right now? Observation is neutral — no interpretation yet.

**Orient:** Interpret observations against your mental model of the system. What does this data mean? Which services are affected? Orientation is the most critical step — experience, training, and system knowledge combine to form situational awareness.

**Decide:** Choose a course of action. Every decision should have a clear rationale and explicit success criteria.

**Act:** Execute the decision. Log every action with a timestamp.

**Loop back:** After acting, observe results. Did it work? Is blast radius shrinking? If not, re-orient and decide again.

#### P2.4.2 — OODA Loop in Practice

```
Situation: Alert fires for p99 latency > 2000ms

OBSERVE:
  p99 latency: 3200ms; Error rate: 12%; CPU: 95%; Recent deploy: 8 min ago

ORIENT:
  Likely cause: code regression in new deploy (connection leak, slow query)
  Blast radius: ~30% of users; Severity: SEV-2 trending toward SEV-1

DECIDE:
  Containment: roll back deploy. Success: latency < 1000ms within 5 min.
  Backup: if rollback fails, escalate to SEV-1, pull platform team.

ACT:
  Initiate rollback (v2.14.3 → v2.14.2). Notify SMEs. Log timestamp.

OBSERVE:
  3 min post-rollback: latency 1400ms, error rate 4%
  5 min post-rollback: latency 600ms, error rate 0.5%

ORIENT:
  Containment successful. Root cause confirmed: regression in v2.14.3.

DECIDE:
  Continue monitoring 15 min. Assign SME to identify specific change.
```

#### P2.4.3 — Cognitive Biases in Incident Response

**Anchoring:** Fixating on the first information received. Mitigation: list at least three possible causes before investigating any one.

**Confirmation bias:** Seeking evidence supporting your hypothesis while ignoring contradictory data. Mitigation: actively ask "what would disprove my current theory?"

**Premature closure:** Stopping investigation once a plausible explanation is found. Mitigation: require that the proposed root cause explains ALL observed symptoms.

**Sunk cost:** Continuing an unproductive investigation path because time was already invested. Mitigation: set a 15-minute timebox per investigation path.

**Groupthink:** Team converging on a single theory without evaluation. Mitigation: ask each SME for independent assessment before sharing opinions.

**Authority bias:** Deferring to the most senior person's opinion even when incorrect. Mitigation: actively solicit input from all team members, not just senior voices.

#### P2.4.4 — Decision Quality Framework

| Decision Type | Time Available | Approach | Example |
|---|---|---|---|
| Immediate | Seconds | Single-person, predetermined | Roll back deploy |
| Urgent | Minutes | Small-group consult | Escalate severity |
| Pressured | 10-30 min | IC leads discussion | Containment strategy |
| Deliberate | 30+ min | Full team input | Postmortem action items |

Every significant decision should be recorded with: what was decided, what information was available, who decided, alternatives considered, and the outcome.

#### P2.4.5 — Stress Management

**During incidents:** Breathe deliberately, stay hydrated, take 2-minute breaks, speak slowly, delegate aggressively, stick to your role, use the framework to reduce cognitive load.

**After incidents:** Debrief immediately, step away from the screen, get sleep before writing the postmortem, talk to someone about the incident.

#### P2.4.6 — Situational Awareness Maintenance

Write the timeline log. Summarize current state every 15 minutes. Question assumptions aloud. Ask "what changed?" Draw a system diagram for multi-service incidents. Track who is working on what.

**Signs of degraded awareness:** Team members working at cross-purposes, repeated questions, contradictory statements, surprise at shared information, fixation on one theory.

**Recovery:** Pause all investigation for 2 minutes, read the timeline aloud, have each SME summarize their understanding, identify what is known/unknown/assumed.

### P2.5 — Command Structure Roles

#### P2.5.1 — The Incident Command System

```
                    INCIDENT COMMANDER
                          │
            ┌─────────────┼─────────────┬──────────────┐
            │             │             │              │
         SCRIBE         SMEs        COMMS LEAD    EXEC LIAISON
        (logging)   (investigation) (updates)   (exec comms)
```

#### P2.5.2 — Role Definitions

**Incident Commander:** Overall responsibility. Does not investigate or fix. Makes escalation and resource decisions. Ensures process is followed. Authorizes containment and resolution actions.

**Scribe:** Maintains real-time timeline log. Records every action, observation, decision with timestamp. Tracks who is working on what. Manages incident document. Ideal training role for apprentice ICs.

**Subject Matter Experts (SMEs):** Investigate the technical issue. Report findings to the IC (not to each other — IC coordinates). Propose and execute containment and resolution actions.

**Communications Lead:** Drafts and sends internal updates. Updates public status page. Coordinates with support. Manages stakeholder questions. Frees IC from communication overhead.

**Executive Liaison:** Single point of contact for executive leadership. Provides high-level status. Shields IC from executive interruptions. Translates technical details to business impact.

#### P2.5.3 — Role Assignments by Severity

| Role | SEV-1 | SEV-2 | SEV-3 |
|---|---|---|---|
| Incident Commander | Dedicated IC | On-call lead | On-call engineer |
| Scribe | Dedicated | IC/scribe combined | Not needed |
| SMEs | Multiple | 1-3 | On-call engineer |
| Comms Lead | Dedicated | EM may fill | Not needed |
| Exec Liaison | EM/Director | Optional | Not needed |
| War Room | Physical/virtual room | Virtual channel | Slack thread |

#### P2.5.4 — Role Switching Protocol

1. New IC announced by name in incident channel
2. New IC reads timeline log, gets verbal summary from outgoing IC
3. Outgoing IC stays available 15 minutes for questions
4. All stakeholders notified of handoff
5. Timeline updated with handoff timestamp

Escalating IC duties is not failure — it is responsible leadership.

### P2.6 — Communication Trees

#### P2.6.1 — Primary Communication Tree

```
INCIDENT DECLARED → COMMANDER ASSIGNED
  ├── SCRIBE: "Start timeline log. Incident ID: [ID]. Severity: [SEV]."
  ├── SMEs: "Severity: [SEV]. Here is what we know. Investigate [area].
  │         Report back every 15 minutes."
  ├── COMMS LEAD: "SEV-[N]. Blast radius: [X]. Prepare internal/external
  │               updates using standard template."
  ├── ENGINEERING MANAGER: "SEV-[N]. Blast radius: [X]. Containment in
  │                        progress. Next update in 30 min."
  ├── EXEC LIAISON: "SEV-[N]. Blast radius: [X]. Status: [Y]. Next in 30."
  ├── SUPPORT: "Incident declared. Prepare for customer inquiries.
  │            Template: [link]. Route queries to comms lead."
  └── STATUS PAGE: "Investigating [symptom]. Next update in 30 min."
```

#### P2.6.2 — Escalation Path

| Level | Trigger | Action |
|---|---|---|
| L1 — Technical | SME expertise exceeded | Engage secondary SMEs or platform team |
| L2 — Resource | Need more engineers | EM authorizes pulling from other projects |
| L3 — Severity | Incident should be upgraded | EM concurs, new protocols activated |
| L4 — Executive | Cross-org coordination needed | Director/VP activated as exec liaison |
| L5 — Crisis | Company-wide crisis | C-level involved, PR, legal |

#### P2.6.3 — Notification Timing Matrix

| Role | SEV-1 | SEV-2 |
|---|---|---|
| IC | Immediate | Immediate |
| SMEs | Immediate | 5 min |
| Engineering Manager | 5 min | 10 min |
| Director/VP | 10 min | 30 min |
| CTO/CIO | 15 min | Brief |
| Customer Support | 10 min | 15 min |
| Status Page | 10 min | 15 min |
| Legal/PR | If security/data loss | No |

#### P2.6.4 — Communication Templates

**Initial declaration:**
```
INCIDENT DECLARED — INC-[YYYYMMDD]-[NNN]
TIME: [UTC]  SEVERITY: SEV-[N]  STATUS: INVESTIGATING
SERVICE: [affected]  IMPACT: [user impact]
COMMANDER: [name]  SMEs: [names]
NEXT UPDATE: [time]
```

**Status update:**
```
STATUS UPDATE [N] — TIME: [UTC]
STATUS: [INVESTIGATING | CONTAINING | RESOLVING | MONITORING | RESOLVED]
IMPACT: [updated user impact]  ACTIONS: [what was done]
NEXT: [next steps]  CONTAINED? [yes/no]
NEXT UPDATE: [time]
```

**Incident resolved:**
```
INCIDENT RESOLVED — TIME: [UTC]  DURATION: [total]
SEVERITY: SEV-[N]  RESOLUTION: [what fixed it]
VERIFIED: [how]  MONITORING: [period]
POSTMORTEM: [scheduled date/time]
```

**Status page update:**
```
[Time] — We are investigating reports of [symptom]. Next update in 30 min.
[Time] — Cause identified, working on fix. Users may still experience [impact].
[Time] — Fix applied, monitoring results.
[Time] — Issue resolved. Full report within 48 hours.
```

#### P2.6.5 — Communication Principles

**Do:** Be honest, be timely ("no new information" is valid), be structured, be targeted, be brief.

**Do not:** Blame individuals, share unverified info, disclose vulnerabilities, speculate about data exposure, promise resolution times, use vague language.


## P4 — CONTAINMENT STRATEGIES DEEP DIVE

### P4.1 — Containment Decision Framework

```
CONTAINMENT SPEED: How quickly can we stop damage? (seconds / minutes / tens of minutes)
CONTAINMENT COMPLETENESS: Full stop or slow down?
SIDE EFFECTS: Data loss, user-visible degradation, complexity?
REVERSIBILITY: Easily reversible or permanent?
INVESTIGATION IMPACT: Preserves or destroys evidence?

Choose the best combination of speed, completeness, low side effects,
reversibility, and evidence preservation.
```

### P4.2 — Strategy Selection Matrix

| Situation | Best Strategy | Second Option | Avoid |
|---|---|---|---|
| Recent deploy broke something | Rollback | Feature flag | Code fix in place |
| New feature causing errors | Feature flag OFF | Rollback | Code fix in place |
| Single region degrading | Traffic shifting | Scale out | Restart |
| Traffic spike | Rate limiting | Scale out | Restart |
| Dependency failing | Circuit breaker | Traffic shifting | Rate limiting |
| Memory leak | Restart | Scale out | Rollback |
| Data corruption | Kill switch | Quarantine | Rollback |
| Security breach | Kill switch | Quarantine | Traffic shifting |
| Cascading failure | Kill switch | Circuit breaker | Rate limiting |

### P4.3 — Containment Action Plan Template

```
CONTAINMENT ACTION #[N]
STRATEGY: [rollback | feature flag | traffic shift | rate limit | etc.]
TARGET: [what is being contained]
INITIATED: [timestamp] BY: [name]
SUCCESS CRITERIA: [how will we know it worked?]
ROLLBACK PLAN: [how to undo this if needed]
OUTCOME: [success | partial | failed]
NOTES: [observations]
```

### P4.4 — Containment Failure Modes

**Rollback failures:** Database migrations cannot roll back cleanly, dependencies changed, rollback script broken, automated rollback disables monitoring.

**Feature flag failures:** Flag not toggled in production, toggle requires restart, feature was never flagged, flag controls too much, toggle introduces race condition.

**Traffic shifting failures:** Target cannot handle load, target has different config, data replication lag, DNS TTLs too long, load balancer config stale.

**Rate limiting failures:** Limits too high (no effect), limits too low (blocking legitimate users), implementation has performance impact, distributed traffic bypasses per-IP limits.


## P6 — ON-CALL BEST PRACTICES

### P6.1 — Schedule Design

| Model | Description | Pros | Cons |
|---|---|---|---|
| 24/7 primary | Single person, 1 week | Clear ownership | Fatigue, burnout |
| Follow-the-sun | Regional teams cover business hours | Fresh engineers, sleep-friendly | Handoff overhead |
| Primary + secondary | Main + backup | Buffer for complex incidents | Secondary underutilized |
| Tiered escalation | App→platform→infra | Right person gets alert | Complex setup |

**Recommendation:** Primary + secondary, weekly rotations, minimum 4 people per rotation so no one is on call more than 1 week in 4.

**Parameters:** Rotation 7 days, handoff at 10 AM local, 30-minute handoff duration, same rotation covers weekdays and weekends. Track on-call hours per person per quarter. Equal distribution of holiday coverage.

### P6.2 — Escalation Policies

#### P6.2.1 — Escalation Tiers

| Tier | Role | Response |
|---|---|---|
| 1 | Primary On-Call | SEV-3/4, responds in 5 min (business) / 15 min (after-hours) |
| 2 | Secondary On-Call | Supports SEV-2+, acts as IC, responds in 10 min |
| 3 | Subject Matter Experts | Called by IC for specific issues, 15 min |
| 4 | Engineering Management | Notified for SEV-1, provides resources |
| 5 | Full Incident Response Team | War room activation |

#### P6.2.2 — Escalation Timers

```
Primary does not acknowledge:
  2 min → Alert secondary
  5 min → Alert primary's manager
  10 min → Alert all on-call
  15 min → Page entire engineering team

Primary acknowledges but no progress:
  15 min → Alert secondary for assistance
  30 min → Alert primary's manager
  60 min → Initiate incident command if not active
```

### P6.3 — On-Call Handoff Protocol

**Outgoing prepares (30 min before):** Review active alerts/incidents, document ongoing investigations, list known issues, identify scheduled changes, update handoff document.

**Handoff meeting (15-30 min overlap):** Outgoing reads current state, incoming asks questions, discuss tricky issues, share context, review complex runbooks.

**Handoff document:**
```
ON-CALL HANDOFF — [DATE]
OUTGOING: [name]  INCOMING: [name]  PERIOD: [start→end]
ACTIVE INCIDENTS: [ID, status, next action]
ONGOING INVESTIGATIONS: [issue, state, next step]
KNOWN ISSUES: [issue, workaround, ticket]
SCHEDULED CHANGES: [date/time, description, risk]
ALERT PATTERNS: [alert, frequency, action]
ADVICE: [top tip for incoming]
```

**Emergency handoff:** Contact secondary immediately. Secondary assumes primary. Manager arranges coverage extension. No penalties for emergency handoffs.

### P6.4 — Burnout Prevention

**Individual signs:** Dread of on-call phone, anxiety, sleep difficulty, compulsive checking, declining work quality, cynicism.

**Team signs:** High turnover, missed acknowledgments, unwillingness to cover, complaints about system, incomplete postmortem actions.

**Structural prevention:** Limit on-call to 1 week in 4 minimum (1 in 6 preferred). Cap at 7 consecutive days. Provide 24-48h recovery after on-call weeks. Comp days or extra pay. No-questions-asked swap policy. No on-call during vacation or major personal events.

**Technical prevention:** Tune alerts ruthlessly. Silence low-urgency alerts during sleep hours. Automate common responses. Provide clear runbooks. Create daytime follow-up queue for non-urgent issues.

**Cultural prevention:** Shared responsibility, not burden. Rotate undesirable shifts equitably. Celebrate on-call successes. Managers carry on-call shifts too. On-call experience valued in performance reviews.


## P8 — POST-INCIDENT COMMUNICATION

### P8.1 — Internal Communication

**Immediate summary (1 hour post-incident):**
```
POST-INCIDENT SUMMARY — INC-[YYYYMMDD]-[NNN]
SEVERITY: SEV-[N]  DURATION: [time]
SUMMARY: [what happened, impact, resolution]
POSTMORTEM: Scheduled [date/time]
```

**Postmortem distribution (7 days for SEV-1, 14 for SEV-2):**
```
POSTMORTEM — INC-[ID]
[Full postmortem]
KEY TAKEAWAYS:
  Root cause: [1 sentence]  Why: [1-2 sentences]
  What we're doing: [key actions]  What we learned: [1-2 sentences]
```

**All-hands (SEV-1 with significant impact):**
Subject: Incident Report: [title]
What happened → Why it happened → How resolved → Prevention actions.

### P8.2 — External Communication

**Status page resolution:**
```
[Service] — Resolved
[Date] — Issue affecting [service] resolved. All systems normal.
Full report within 48 hours.
Duration: [start→end]  Affected: [services]  Impact: [description]
```

**Customer-facing postmortem (for significant incidents):**
Summary → Timeline (plain language) → What went wrong → Prevention actions.

**Media/PR (for high-profile incidents):**
Do not speculate. Do not blame. Be transparent. Show action. Timeliness matters. Single designated spokesperson.

### P8.3 — Communication Best Practices

**Do:** Communicate early, acknowledge uncertainty, use clear language, provide regular updates, admit mistakes, focus on user impact, end with clear resolution.

**Do not:** Wait for all answers, present guesses as facts, use jargon, go silent, cover up, use vague language.


## P10 — INCIDENT RETROSPECTIVES AND PROCESS IMPROVEMENT

### P10.1 — Beyond Individual Postmortems

Retrospectives examine patterns across multiple incidents. Hold them quarterly, after large incidents, or when incident volume spikes.

### P10.2 — Retrospective Structure

```
RETROSPECTIVE — [PERIOD]
INCIDENTS: Total [N]  SEV-1 [N]  SEV-2 [N]  SEV-3 [N]
MTTD: [time] (trend)  MTTR: [time] (trend)  MTBF: [time] (trend)
TOP CAUSES: 1. [cause — N] 2. [cause — N] 3. [cause — N]
WHAT WENT WELL: [examples]
WHAT NEEDS IMPROVEMENT: [process/tooling/knowledge gaps]
ACTION ITEMS: [actions with owners and dates]
NEXT PERIOD GOALS: [e.g., reduce SEV-1 MTTR by 20%]
```

### P10.3 — Process Improvement Areas

**Detection:** Are we detecting fast enough? Are there undetected incident types? Are false positives wasting time?

**Response:** Is severity classification accurate? Is escalation correct? Are runbooks available? Is communication cadence right?

**Containment:** Are containment actions fast enough? Do rollbacks work reliably? Are feature flags available?

**Postmortem:** Happening within 48h? Action items completed? Truly blameless? Organization learning?

**Tooling:** Is incident management platform effective? Monitoring and alerting adequate? Collaboration tooling working?

### P10.4 — Incident Response Maturity Model

| Level | Name | Characteristics |
|---|---|---|
| 0 | Ad hoc | No formal process, no postmortems |
| 1 | Reactive | Basic alerting, on-call rotation, postmortems without tracked actions |
| 2 | Defined | Command structure, runbooks, postmortems with action items |
| 3 | Measured | All metrics tracked, SLOs defined, trends analyzed, retrospectives |
| 4 | Proactive | Chaos engineering, game days, predictive alerting, automated containment |
| 5 | Resilient | Self-healing systems, incident response is cultural |

Target: Level 3 for most organizations. Level 4-5 for critical infrastructure.

### P10.5 — Key Improvement Metrics

| Metric | How to Improve |
|---|---|
| Postmortem completion rate | Automate reminders, schedule at incident closure |
| Action item completion rate | Track in sprint planning, assign owners |
| Runbook coverage | Create proactively, not reactively |
| Runbook accuracy | Test in drills, update after incidents |
| IC training pipeline | Regular training, shadowing program |
| Tabletop frequency | Schedule quarterly, track completion |
| Alert noise | Tune thresholds, silence non-actionable alerts |


## P12 — WORKED EXAMPLES

### E1: Database Connection Pool Exhaustion

**Detection:** p99 latency 4200ms (threshold: 800ms). Error rate: 23% 502s.

**Triage:** Blast radius: all API requests touching user service. 23% of users affected. Severity: SEV-2.

**Containment:** SME reports DB pool maxed (100/100). Blast radius growing (23%→31% in 3 min). Rollback at 14:27. Connections dropped to 45/100. Latency returned to 200ms.

**Root cause:** Deploy added a connection leak — new code opened connections without closing them.

**Postmortem:** (1) Connection pool monitoring alert. (2) Connection leak detection in CI. (3) Runbook for "DB connection pool exhaustion." (4) Connection count metric on deploy dashboard.

### E2: Deployment Breaking Payment Processing

**Detection:** 47 customer calls in 5 min. "Card declined" errors. payment_failure_rate at 38%.

**Triage:** All card payments (60% of revenue). Public visible. Severity: SEV-1.

**Containment:** Payment service deploy at 08:52. Feature flag disabled. Time to contain: 4 min.

**Root cause:** New validation logic incorrectly rejected valid cards.

**Postmortem:** (1) Canary testing for payment changes. (2) Payment SME review required. (3) Feature flag mandatory for payment logic. (4) Runbook for "payment failure surge."

### E3: Cascading Cache Failure

**Detection:** Cache hit ratio dropped from 92% to 15%. Origin servers at 500% CPU.

**Triage:** All read requests hitting origin. Most users see 5s+ load times. Severity: SEV-1.

**Containment:** Restart cache cluster (3 min). Redirect read traffic to DB replicas during repopulation.

**Timeline:**
```
16:45  Cache hit ratio 15%
16:46  SEV-1 declared. Commander: Carol. SME: Dave.
16:47  Dave: cache node 3 crashed. Others overloaded.
16:48  Cache cluster restart initiated.
16:50  Read traffic redirected to DB replicas.
16:51  Cache cluster back up. Populating.
16:58  Cache hit ratio 70%, climbing. 17:05 → 92%. Normal.
17:20  Incident closed.
```

**Postmortem:** (1) Cache node health monitoring. (2) Automatic cache failover. (3) Reduce cache TTLs. (4) Origin CPU alert with lower threshold.

### E4: Data Corruption from Schema Migration

**Detection:** Manual report: user_orders has null values in critical fields. 12,000 affected rows.

**Triage:** Data for 8,200 users corrupted. Severity: SEV-1.

**Containment:** Disable writes to user_orders. Restore from backup (45 min). Data loss: 3 minutes of writes.

**Root cause:** Migration had `ALTER COLUMN DROP NOT NULL` without backfill. New code expected non-null values.

**Postmortem:** (1) All migrations need rollback scripts. (2) Column changes require staging validation on real data. (3) Migration dry-run mode. (4) Data integrity checks after every migration.

### E5: Certificate Expiry Causing TLS Handshake Failures

**Detection:** TLS handshake failure rate 67%. All connections failing.

**Triage:** 100% of traffic failing TLS verification. Severity: SEV-1.

**Containment:** Certificate for *.example.com expired at 03:00 UTC. Deployed backup certificate from load balancer (5 min).

**Root cause:** No auto-renewal, no certificate expiry monitoring.

**Postmortem:** (1) Certificate expiry monitoring at 30, 14, 7 days, and 24 hours. (2) Auto-renewal for all TLS certs. (3) Automated cert validation test. (4) Certificate expiry dashboard.

### E6: Memory Leak After Deploy

**Detection:** 3/5 pods at >90% memory, climbing steadily.

**Triage:** When pods OOM, remaining 2 get 2.5x traffic and also OOM. ~15 min until full degradation. SEV-2 trending toward SEV-1.

**Containment:** Scale to 10 pods (buys 30 min). SME identifies: deploy added unbounded in-memory cache.

**Resolution:** Rollback deploy. Memory stabilized at 45%. Scale back to 5.

**Postmortem:** (1) Memory leak detection test. (2) Memory on deploy dashboard. (3) Memory profiling for new in-memory structures. (4) Auto-scaling based on memory.

### E7: Third-Party API Deprecation

**Detection:** Map tiles not loading. maps_api_error_rate at 40%.

**Triage:** 35% of users see broken maps. SEV-2 (major feature broken).

**Containment:** Feature flag OFF for maps (15 sec). Users see no maps but no errors.

**Root cause:** Third-party deprecated v2 API. v2 stopped working at 08:00.

**Postmortem:** (1) Monitor API version headers on third-party responses. (2) Subscribe to third-party changelogs. (3) Feature flag for all third-party integrations.

### E8: Configuration Drift Across Environments

**Detection:** Production deploy immediately causes 50% error rate.

**Triage:** 100% of production traffic failing. SEV-1.

**Containment:** Immediate rollback (3 min). Service restored.

**Root cause:** Staging had hardcoded staging dependency URL. Production deployed with same staging URL.

**Postmortem:** (1) Deploy-time configuration validation. (2) Environment-parameterized configuration. (3) Pre-deploy smoke test with production config in sandbox.

---

## P13 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Commander debugging | IC personally debugging | Stay at coordination level. Delegate. |
| Analysis paralysis | Discussing root cause during containment | Contain first. Analyze after. |
| Severity optimism | Declaring SEV-3 for what becomes SEV-1 | Declare higher, downgrade later. |
| Communication silence | 45+ min without update | Update every 15 min. "No news" is valid. |
| Blame in timeline | "Bob broke it" | Timeline is neutral — what happened, not who. |
| Premature closure | Resolving before monitoring period | Minimum 15-min monitoring window. |
| Heroic single-debugger | One person fixing everything | Pull in SMEs early. Delegate. |
| Fix without containment | Code fix while blast radius grows | Contain first. Then fix. |
| Status page neglect | Not updating because "working on fix" | Status page independent of fix progress. |
| One-person postmortem | IC alone writes it | SMEs contribute. Whole team reviews. |
| Missing rollback plan | Deploying without revert plan | State rollback plan before any deploy. |
| Action items without owners | No one assigned | Every item has a named owner and due date. |
| After-hours over-notification | Paging whole team for minor alerts | Tiered escalation. |
| Runbook neglect | Outdated runbooks | Quarterly review. Update after incidents. |
| Process rigidity | Following process even when harmful | Process serves the incident, not reverse. |
| War room overcrowding | Too many people | Enforce roles. Essential only. |
| Blame culture | Postmortems find individuals at fault | Rewrite every finding as system fix. |
| Metrics theater | Tracking without improving | Metrics must drive action. |
| IC burnout | Same person IC every time | Rotate ICs. Maintain trained roster. |
| Handoff failure | No handoff or rushed | Mandatory 15-min overlapping handoff. |

---

## P14 — QUALITY GATES

### P14.1 — Tier 1 — Hard Gates

- [X] Severity declared and documented
- [X] Blast radius assessed (user, data, duration, scope)
- [X] Timeline log created and maintained
- [X] Communication tree activated (SME, management, support, status page)
- [X] Containment action taken (not just investigation)
- [X] Containment effectiveness verified
- [X] Monitoring period completed (15+ min after resolution)
- [X] No blame in any documentation
- [X] Postmortem scheduled within 48 hours
- [X] Action items have owners and due dates

### P14.2 — Tier 2 — Standard Gates

- [X] Root cause identified (not just symptom)
- [X] Contributing factors listed
- [X] Runbook updated for this incident type
- [X] Alert thresholds reviewed
- [X] Detection time analyzed (introduction to detection)
- [X] Containment time analyzed (detection to containment)
- [X] Handoff documented
- [X] Decision log completed
- [X] Stakeholder communication completed
- [X] Incident cost estimated

### P14.3 — Tier 3 — Excellence Gates

- [X] Cross-team postmortem review conducted
- [X] Systemic prevention action identified
- [X] Similar risks in other services evaluated
- [X] Runbook shared with relevant teams
- [X] Drill scenario created from this incident
- [X] Monitoring improvements deployed before incident close
- [X] Customer-facing postmortem published (if public)

### P14.4 — Self-Audit

```
Severity declared?               yes
Blast radius assessed?           yes
Timeline maintained?             yes
Communication tree active?       yes
Containment applied?             yes
Containment verified?            yes
Monitoring completed?            yes
No blame in docs?                yes
Postmortem scheduled?            yes
Root cause identified?           yes
Action items assigned?           yes
Runbook updated?                 yes
```

### P14.5 — Incident Response Readiness Checklist (Quarterly)

**People:** 3+ qualified ICs, on-call coverage adequate, all team members trained, IC knowledge distributed.

**Process:** Incident response process documented, severity guidelines posted, communication tree up to date, escalation paths documented, postmortem process defined, tabletop exercise completed last quarter.

**Tooling:** Monitoring covers all critical metrics, alert thresholds tuned, runbooks for all critical alerts, incident management platform configured, status page operational, on-call schedule accurate.

**Runbooks:** P0 runbooks cover all critical services, P1 runbooks cover major incident types, runbooks reviewed within the last quarter, accessible in under 30 seconds.


## P16 — COMMAND STRUCTURE ROLES (REFERENCE)

### Role Card: Incident Commander

**Responsibility:** Coordinate response. Ensure right people work on right problems. All stakeholders informed.

**Active during:** SEV-1, SEV-2.

**Key decisions:** Severity classification, team composition, containment strategy, escalation timing, resolution approach, monitoring duration, incident closure.

**Script:**
```
"I am IC. Severity: SEV-[N]. Here is what we know: [symptoms].
[Scribe] start timeline. [SMEs] investigate [area], report in 15 min.
[Comms Lead] notify stakeholders, status: INVESTIGATING.
Next update in 15 min."
```

### Role Card: Scribe

**Responsibility:** Maintain real-time timeline log. Free IC from note-taking.

**Active during:** SEV-1, SEV-2.

**Checklist:** Every action/decision/communication timestamped. Containment actions with outcomes. SME assignments. Escalations. Handoffs. Monitoring start/end. Incident closure time.

### Role Card: Subject Matter Expert

**Responsibility:** Investigate technical issue, identify root cause, propose/execute fixes.

**Constraints:** Investigate what IC assigns. Report to IC, not other SMEs. Do not make decisions — propose to IC.

**Reporting format:**
```
AREA: [service] STATUS: [INVESTIGATING | FOUND | FIXED]
FINDINGS: [discovery] CONFIDENCE: [high/medium/low]
NEXT STEP: [what you'll do next] NEEDS HELP: [what you need]
```

### Role Card: Communications Lead

**Responsibility:** Manage all communication channels. Free IC.

**Active during:** SEV-1 (dedicated), SEV-2 (may be EM).

**Outputs:** Internal updates, status page, support talking points, FAQ.

### Role Card: Executive Liaison

**Responsibility:** Single point of contact for executives. Shield IC.

**Active during:** SEV-1.

**Constraints:** Do not interrupt IC. Get status from comms lead or channel. Do not promise resolution times. Translate technical to business impact.

---

## P17 — GLOSSARY

| Term | Definition |
|---|---|
| Blast radius | Scope and scale of an incident's impact |
| Blameless postmortem | Analysis focused on system failures, not individual mistakes |
| Burn rate | Rate error budget is consumed relative to SLO window |
| Containment | Actions to stop an incident from spreading |
| Error budget | Acceptable unreliability within an SLO window (100% - SLO target) |
| Escalation | Involving additional people/teams to handle an incident |
| Feature flag | Mechanism to enable/disable functionality without deploying |
| Handoff | Transfer of command or responsibilities between people |
| IC | Incident Commander — coordinates response, does not fix |
| Kill switch | Global disable of specific functionality |
| MTTD | Mean Time to Detect (introduction to detection) |
| MTTR | Mean Time to Resolve (detection to resolution) |
| MTBF | Mean Time Between Failures |
| MTTC | Mean Time to Contain (detection to containment) |
| OODA loop | Observe-Orient-Decide-Act framework |
| Postmortem | Written analysis to understand and prevent recurrence |
| Rollback | Revert to previous known-good version |
| Runbook | Documented procedure for a specific incident type |
| Scribe | Person documenting the incident timeline |
| SLA | Service Level Agreement — contractual commitment |
| SLI | Service Level Indicator — quantitative measure |
| SLO | Service Level Objective — target for an SLI |
| SME | Subject Matter Expert |
| Tabletop exercise | Discussion-based simulation of an incident scenario |
| Timeline log | Chronological record of events during an incident |
| Triage | Initial assessment to determine severity and response |
| War room | Physical/virtual space for incident coordination |

---

*Synarc session tracking (S3), auto-emit rules (S4), zero-tolerance violations (S17) apply. Ledger entry for every incident response engagement.*
