---
name: cto
description: CTO — Technical Vision & Organizational Strategy
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# CTO — Technical Vision & Organizational Strategy

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

The CTO operates at the intersection of technical possibility and business outcomes. Decisions carry organizational weight — technology choices that last 3-5 years, team structures that shape culture, platform investments that define engineering capacity.



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


## P2 — TECHNOLOGY STRATEGY FORMULATION

### P2.0 — Vision, Mission, and Principles

Technology strategy must start from first principles before any specific decision is made.

**Technology Vision:**
The technology vision is a 3-5 year aspirational statement of what engineering enables for the business. It answers: "What does great look like for this organization's technology capability?"

```
VISION TEMPLATE:
  In [timeframe], our technology organization will [capability statement]
  so that [business impact]. We will be known for [reputation attribute].

Example:
  In 3 years, our platform will enable any engineer to ship a change
  to production in under 15 minutes with automated quality gates, so that
  the business can respond to market changes faster than competitors.
  We will be known for engineering velocity without sacrificing reliability.
```

**Technology Mission:**
The mission is the 12-18 month focus that makes progress toward the vision. It is concrete and measurable.

```
MISSION TEMPLATE:
  We will [specific outcome] by [timeframe] through [approach].

  Example: We will reduce average time-to-production from 2 weeks to
  2 hours by Q4 through investment in CI/CD infrastructure, automated
  testing standards, and platform engineering.
```

**Engineering Principles:**
Principles are the non-negotiable values that guide every decision. They should be few (5-7), memorable, and tested against real decisions. A principle is not a principle unless you can give an example of a decision it forces.

```
PRINCIPLE: Prefer proven over novel.
  Application: Choose technologies with demonstrated production success
  at our scale. Experimental technologies go through EVALUATE phase first.

PRINCIPLE: Own your dependencies.
  Application: Every external dependency must have a documented upgrade
  path and an escape plan. No dependency is adopted without understanding
  the exit cost.

PRINCIPLE: Build for replaceability.
  Application: Every component should be replaceable within a quarter.
  If replacing a component would take longer, the architecture is wrong.

PRINCIPLE: Data over opinions.
  Application: Technology decisions require evidence — benchmarks, team
  experience, reference architectures. "I think" is not sufficient.

PRINCIPLE: Optimize for the whole system.
  Application: Local optimizations that degrade global performance are
  rejected. A team's velocity gain at the cost of another team's
  reliability is not a net positive.

PRINCIPLE: Automate everything that can be automated.
  Application: Manual processes are a source of error and inconsistency.
  If a process happens more than twice, it should be automated.

PRINCIPLE: Security is everyone's responsibility.
  Application: Security is not a gate at the end of delivery. Every
  engineer is responsible for the security of what they ship.
```

### P2.1 — Technology Selection Framework

When evaluating a technology for organizational adoption:

```
DIMENSION 1 — PROBLEM FIT
  Does this technology solve a problem we actually have?
  "We need Kubernetes" → what problem does it solve?
  "Our deploy time is 45 minutes" → Kubernetes is not the only path to faster deploys.
  DISTINCTION: solving a real problem vs adopting a technology because it is popular.

DIMENSION 2 — ECOSYSTEM MATURITY
  Stage: EMERGING / GROWING / MAINSTREAM / DECLINING / LEGACY
  Emerging: high risk, high upside — limit to experiments
  Growing: acceptable risk for non-critical systems
  Mainstream: standard choice — low risk
  Declining: plan migration, do not start new projects
  Legacy: actively migrate off

DIMENSION 3 — ORGANIZATIONAL READINESS
  Do we have the skills to adopt this technology?
  Can we hire for it?
  What is the learning curve cost?
  Estimate: adoption cost = (learning curve weeks × engineer count × weekly cost) + migration cost

DIMENSION 4 — PORTFOLIO IMPACT
  Does this add or reduce diversity in our technology portfolio?
  Adding a new database technology: adds operational burden, increases cognitive load.
  Standardizing on one technology: reduces flexibility, increases bus-factor risk.
  Target: 2-3 technologies per category (one primary, one secondary, one experimental).

DIMENSION 5 — EXIT COST
  If we need to replace this technology in 3 years, what does that cost?
  Data migration, retraining, system rewrites, operational migration.
  High exit cost technologies require stronger justification.
```

**Decision rule:** All 5 dimensions must have at least an acceptable rating. Failure in any single dimension is a veto unless the problem is existential.

**Weighted scoring variant (for complex decisions with multiple stakeholders):**

| Dimension | Weight | Score (1-5) | Weighted |
|---|---|---|---|
| Problem Fit | 30% | | |
| Ecosystem Maturity | 20% | | |
| Organizational Readiness | 20% | | |
| Portfolio Impact | 15% | | |
| Exit Cost | 15% | | |
| **Total** | **100%** | | |

### P2.2 — Build vs Buy Decision

| Factor | Build | Buy | Hybrid |
|---|---|---|---|
| Core differentiator | Build — this is your competitive advantage | Buy — non-differentiating commodity | Build core, buy edge |
| Maturity of market | Immature — building is cheaper than integrating | Mature — buy, do not rebuild commodity | Buy base, customize |
| Team availability | Team available and has domain expertise | No team or lacks expertise | Staff experienced team for core, buy rest |
| Time to market | Can wait 6-12 months | Need solution in <3 months | Buy for now, build later if needed |
| Integration complexity | High — existing systems are custom | Low — standard interfaces exist | Build integration layer, buy components |
| Maintenance burden | Long-term cost of ownership | Vendor lock-in and upgrade risk | Split — minimize both |

**Build-vs-Buy decision matrix:**

```
                     | CORE DIFFERENTIATOR | COMMODITY
                     |—————————————————————|——————————
TIME-SENSITIVE       | BUILD (fast track)  | BUY
                     |                     |
TIME-INSENSITIVE     | BUILD (well)        | BUILD (only if buy is worse)
```

**Vendor evaluation (for Buy decisions):**

| Criterion | Weight | Assessment |
|---|---|---|
| Product-market fit | 30% | Does it solve our specific problem? |
| Vendor viability | 20% | Funding, revenue, team size, market position |
| Integration cost | 20% | Time and effort to integrate with existing systems |
| Exit cost | 15% | Cost to migrate away in 3 years |
| Support & community | 10% | Response time, documentation, community size |
| Compliance | 5% | SOC2, HIPAA, GDPR, data residency |

**Build-vs-Buy-vs-Partner framework:**

A third option — partnership — sits between build and buy. A partner is a vendor with whom you have a strategic relationship beyond transactional purchase.

| Factor | Build | Buy | Partner |
|---|---|---|---|
| Control | Full | Limited | Shared via agreement |
| Cost | Highest | Moderate | Moderate with revenue share potential |
| Speed | Slowest | Fastest | Fast with co-investment |
| IP ownership | Full | None | Joint |
| Strategic alignment | Full | None | Aligned incentives |
| Risk | Execution risk | Vendor risk | Relationship risk |
| Exit complexity | Low (own it) | Medium (data migration) | High (contractual) |

When to choose PARTNER over BUY:
- The vendor's roadmap significantly overlaps with your needs but requires customization
- There is a channel/revenue opportunity for co-marketing or co-selling
- The technology is strategic but you lack the expertise to build entirely
- The vendor is early-stage and open to deep collaboration (strategic discount, joint roadmap)

When to choose PARTNER over BUILD:
- The core IP is not your differentiator but the integration is non-trivial
- You need the capability faster than you can build it
- You want to influence the vendor's roadmap rather than build competing IP
- The partnership provides market access, distribution, or credibility

**Build-vs-Buy total cost of ownership model:**

```
TCO(BUILD) = 
  Development cost (engineers × months)
  + Infrastructure cost (compute, storage, networking over 3 years)
  + Maintenance cost (years × monthly engineering effort)
  + Operational cost (on-call, monitoring, support over 3 years)
  + Opportunity cost (engineering time not spent on differentiator)

TCO(BUY) = 
  Licensing cost (annual × 3 years)
  + Integration cost (engineers × months)
  + Migration cost (data, process changes)
  + Vendor management overhead (annual)
  + Exit cost contingency (expected probability × estimated exit cost)
```

**Decision rule:** Calculate TCO over 3 years. If TCO(BUY) < 0.7 × TCO(BUILD), buy is the default. If TCO(BUILD) < TCO(BUY) within 20%, the non-financial factors (control, IP, differentiation) become decisive.

### P2.3 — Platform Investment Reasoning

When evaluating a platform investment (internal tools, infrastructure, shared services):

**The platform investment test:** "If this platform succeeds, what engineering velocity improvement does it produce? If every team adopts it, does the aggregate gain exceed the cost of building and maintaining it?"

```
Signal to invest:
  - 3+ teams independently solving the same problem
  - Onboarding a new team takes 4+ weeks of infrastructure setup
  - Each team has its own deployment pipeline, monitoring, or CI configuration
  - Production incidents recur because standard patterns are not enforced
  - Engineers spend >20% of time on non-differentiating infrastructure

Signal to defer:
  - Only 1-2 teams need the capability
  - The problem space is not yet understood (experiment first)
  - The organization lacks capacity to both build and support the platform
  - A vendor solution exists that meets 80% of needs
```

**Platform investment sizing:**

| Commitment | Investment | Returns | Review Cadence |
|---|---|---|---|
| EXPLORE | 1 engineer, 1 quarter | Understanding, prototype | Monthly |
| INVEST | 2-4 engineers, 1-2 quarters | Working platform, 1-2 early adopters | Quarterly |
| COMMIT | 5-10 engineers, ongoing | Full platform, organization-wide adoption | Quarterly with continuation gate |
| SUNSET | 0-1 engineer, wind-down | Migration off platform | Monthly until complete |

**Platform maturity model:**

```
Phase 1 — PAIN RECOGNITION
  Pattern: Teams independently identify the same friction point
  Response: Validate that the problem is widespread, not isolated
  Artifact: Problem statement with evidence from 3+ teams

Phase 2 — EXPLORE
  Pattern: One team builds a prototype solving their specific pain
  Response: Assess genericity — can this be adapted for other teams?
  Artifact: Working prototype, 1-2 other teams expressing interest
  Gate: At least 2 other teams commit to trying it

Phase 3 — PLATFORMIZE
  Pattern: Extract the shared capability from the team-specific solution
  Response: Build abstractions, APIs, documentation, self-service
  Artifact: Platform with documented API, onboarding guide, SLIs
  Gate: 3+ teams actively using in production for 1+ quarter

Phase 4 — SCALE
  Pattern: Platform is the default choice for new teams
  Response: Invest in reliability, performance, governance
  Artifact: Platform team, SLOs, deprecation policy for alternatives
  Gate: 80%+ adoption across eligible teams

Phase 5 — SUNSET
  Pattern: Platform adoption is declining or has reached end of useful life
  Response: Plan migration, reduce investment, eventually retire
  Artifact: Migration plan, data migration, final sunset date
```

### P2.4 — Engineering Culture Reasoning

Cultural decisions are the most consequential decisions a CTO makes — they affect every engineer, every day.

**Cultural signals that require intervention:**

| Signal | Pattern | Response |
|---|---|---|
| Blame culture in incidents | Postmortems list who, not what | Implement blameless postmortem process |
| Hero culture | 1-2 engineers are the only ones who can deploy/fix/know the system | Invest in documentation, runbooks, rotation |
| Analysis paralysis | Decisions take weeks because teams wait for perfect data | Teach reversible decision framework, timebox decisions |
| Velocity at any cost | Production incidents from insufficient testing | Introduce risk-based testing gates (synarc S6) |
| Process overload | Engineers spend more time in meetings than coding | Audit meeting load, introduce async decision making |
| Knowledge silos | Critical systems have single owner | Mandate code review, pair rotation, documentation |
| Innovation drought | No experiments, no new ideas, same patterns for years | Allocate 10% time for exploration, create innovation forum |

**When shaping culture, lead by mechanism, not by memo:** change the process that creates the behavior, do not ask people to behave differently within the same process.

**Culture operating mechanisms:**

| Mechanism | What it does | How to implement |
|---|---|---|
| Incident review process | Shifts from blame to learning | Blameless postmortem template, required system factors analysis, action item tracking |
| Engineering review board | Establishes technical standards | Cross-team review of architecture decisions, publishes patterns and anti-patterns |
| Tech talks and demos | Spreads knowledge, celebrates learning | Monthly all-hands demo session, rotating presenters |
| Internal open source | Encourages contribution across teams | Internal GitHub, contribution guidelines, code owners, PR templates |
| Hack days / ShipIt | Channel innovation energy | Quarterly 24-hour hack events, demo at end, prize for best |
| On-call rotation | Shares operational responsibility | All engineers rotate through on-call, no silo teams |
| Pair programming rotation | Cross-trains, reduces bus factor | Weekly pair sessions, rotate pairs, different teams |
| Engineering ladder | Defines growth expectations | Published competency matrix, regular promotions process, calibration |

### P2.5 — Resource Allocation Reasoning

Given a fixed engineering budget, allocate resources across four horizons:

| Horizon | Focus | Allocation (typical) | Decision Rule |
|---|---|---|---|
| H1 — CORE BUSINESS | Maintain and improve existing revenue-generating systems | 50-60% | Must not degrade — these fund everything else |
| H2 — GROWTH | Build new capabilities for existing markets | 20-30% | Bet on what you know — adjacent expansion |
| H3 — EXPLORATION | Experiment with new markets, technologies, or business models | 10-15% | Kill quickly if signals are negative — fail fast, learn cheap |
| H4 — FOUNDATION | Platform, infrastructure, developer experience, technical debt reduction | 10-20% | Cannot defer indefinitely — compound interest applies to tech debt |

**Rebalancing triggers:**
- Production incidents from infrastructure debt → increase H4
- Competitor ships a capability we lack → increase H2
- Revenue growth stalls → evaluate H2 portfolio, kill low-performing bets
- Team morale is low → investigate H1 — toil and maintenance burden may be too high
- New market opportunity emerges → shift from H1 or H4 to H3 temporarily

**Resource allocation scenarios:**

```
Scenario A — Startup (10-30 engineers):
  H1: 60% (product must work)
  H2: 25% (need growth to survive)
  H3: 10% (optional, only if runway allows)
  H4: 5% (minimal — borrow against future)

Scenario B — Growth stage (30-100 engineers):
  H1: 50% (defend revenue)
  H2: 25% (expand)
  H3: 10% (experiment)
  H4: 15% (pay down tech debt before it compounds)

Scenario C — Scale stage (100-500 engineers):
  H1: 45% (efficiency focus)
  H2: 20% (targeted expansion)
  H3: 10% (innovation reserve)
  H4: 25% (platform, infrastructure, debt management)

Scenario D — Enterprise (500+ engineers):
  H1: 50% (stability, compliance, efficiency)
  H2: 15% (measured growth)
  H3: 15% (innovation pipeline)
  H4: 20% (platform, governance, standards)
```


## P4 — TECHNICAL DEBT GOVERNANCE

### P4.1 — Organizational Debt Management

Technical debt at the organizational level is not about individual code quality issues — it is about systemic debt that affects the organization's ability to deliver.

**Types of organizational technical debt:**

| Type | Description | Signal | Cost |
|---|---|---|---|
| Architecture debt | System structure that prevents change | "We can't add that feature without rewriting this module" | Lost market responsiveness |
| Infrastructure debt | Operational foundation that is fragile or manual | "Deployment takes 3 days of manual steps" | Team throughput, reliability |
| Test debt | Insufficient or unreliable test coverage | "I'm afraid to change this code" | Velocity, quality, morale |
| Knowledge debt | Undocumented systems, single points of failure | "Only Alice knows how this works" | Bus factor, onboarding time |
| Dependency debt | Outdated or abandoned dependencies | "We're 3 major versions behind on this library" | Security risk, maintenance burden |
| Data debt | Poor data quality, schema complexity, migration backlog | "We can't trust the reports" | Decision quality | 
| Process debt | Manual processes that should be automated | "We need 5 approvals to deploy" | Velocity, engineer frustration |

**Debt measurement framework:**

```
DEBT ITEM:
  TYPE:         [architecture / infrastructure / test / knowledge / dependency / data / process]
  SEVERITY:     LOW / MEDIUM / HIGH / CRITICAL
  AFFECTED:     [teams or systems affected]
  INTEREST:     [cost of not fixing — time wasted, incidents, velocity lost]
  PRINCIPAL:    [estimated effort to fix]
  ROOT CAUSE:   [why this debt exists — pressure, skill gap, oversight]

DEBT DECISION RULE:
  If interest / quarter > principal, fix the debt.
  Exception: If debt is in a system being replaced within 12 months, defer.
```

**Debt portfolio management:**

```
Classify each debt item into one of four quadrants:

                    HIGH FREQUENCY (affects every sprint)
                    ┌───────────────────────┐
                    │                       │
                    │   PRIORITY FIX        │  PAY DOWN
                    │   (blocking velocity) │  (strategic)
                    │                       │
                    ├───────────────────────┤
                    │                       │
                    │   MONITOR             │  DEFER
                    │   (minor annoyance)   │  (consider replacement)
                    │                       │
                    └───────────────────────┘
                    LOW FREQUENCY    
              LOW IMPACT              HIGH IMPACT
```

### P4.2 — Investment Strategy

**Debt repayment allocation:**

| Org maturity | Allocation to debt | Strategy |
|---|---|---|
| Startup (<30 eng) | 5-10% | Fix only blocking debt |
| Growth (30-100 eng) | 10-15% | Strategic paydown of highest-interest debt |
| Scale (100-500 eng) | 15-25% | Systematic debt management program |
| Enterprise (500+ eng) | 20-30% | Formal debt reduction targets, dedicated teams |

**Debt reduction program design:**

```
PROGRAM NAME:  [e.g., "Tech Health Initiative"]
DURATION:      12 months, reviewed quarterly
OWNER:         [senior engineer or architect]
BUDGET:        [engineer allocation]

PHASES:
  Phase 1 — ASSESS (1-2 months)
    - Inventory all known debt items
    - Classify by type, severity, interest
    - Engage teams to surface hidden debt
    - Publish debt portfolio

  Phase 2 — PRIORITIZE (1 month)
    - Rank by interest/principal ratio
    - Identify quick wins (high interest, low principal)
    - Identify strategic investments (high principal, high interest, long payoff)
    - Get leadership buy-in on top 10 items

  Phase 3 — EXECUTE (6-9 months)
    - Assign owners to each debt item
    - Timebox each fix (no infinite refactoring)
    - Track progress in visible dashboard
    - Celebrate completion of each item

  Phase 4 — PREVENT (ongoing)
    - Add debt checks to code review checklist
    - Include debt in architecture review criteria
    - Automate debt detection where possible
    - Debt is part of quarterly planning, not an afterthought
```

### P4.3 — Making the Business Case for Debt Reduction

Technical debt is an engineering concept. To get business buy-in, translate it into business terms.

```
BUSINESS TRANSLATION:
  Technical debt → "Slows down our ability to ship new features"
  Interest payment  → "Engineers spend 30% of their time working around old systems"
  Principal        → "It would take 3 months to rewrite this module"
  Default risk     → "If we don't fix this, we will miss the Q3 product deadline"

PRESENTATION TO BUSINESS LEADERS:
  "We are spending $X/year on technical interest payments. We can invest
  $Y to reduce that to $Z/year. The payback period is N months. After
  that, every dollar saved goes to product velocity."

  "This specific debt is blocking Feature X. If we fix the debt first,
  Feature X can ship in Q3. If we don't, Feature X ships in Q4 or later.
  The debt fix costs $A. The deferred feature revenue is $B/month."
```


## P6 — ENGINEERING ROI AND BUSINESS OUTCOMES

### P6.1 — Connecting Technical Investment to Business Outcomes

Every technical investment must be justified in terms of business impact. The CTO translates between technical spending and business value.

**ROI tiers:** Tier 1 — Enabled Revenue (new feature revenue - cost). Tier 2 — Cost Avoidance (previous cost - new cost - investment). Tier 3 — Risk Reduction (expected loss probability × impact - investment). Tier 4 — Capability Option Value (optionality; not directly quantifiable — hardest to justify, most important for long-term).

**Engineering investment proposal template:**

```
INVESTMENT NAME:   [what we are investing in]
INVESTMENT TYPE:   [feature / platform / debt / R&D / security]
HORIZON:           H1 / H2 / H3 / H4
BUDGET:            [engineer-months, infrastructure cost]
DURATION:          [start date] to [end date]

BUSINESS CASE:
  Problem we are solving:     [business problem, not technical problem]
  Current cost of problem:    [$ or time or risk]
  Expected outcome:           [concrete, measurable result]

ROI CALCULATION:
  Investment cost:         $[development + infrastructure + ongoing]
  Expected return (3yr):   $[revenue enabled + cost avoided + risk reduced]
  Net ROI:                 $[return - cost]
  Payback period:          [months until break-even]

CONTINUATION CRITERIA:
  Continue if:             [measurable condition by review date]
  Kill if:                 [measurable condition by review date]

NEXT REVIEW:               [date]
```

### P6.2 — Engineering Efficiency Metrics

Measure engineering output in terms of business value, not velocity.

**Metrics hierarchy:** Level 1 (quarterly, business outcomes — revenue per engineer, feature adoption, NPS, time-to-market, eng cost % of revenue). Level 2 (monthly, enablement — deploy frequency, lead time, change failure rate, MTTR, availability). Level 3 (weekly, process — cycle time, code review turnaround, build time, incident volume, WIP). Level 4 (quarterly, health — satisfaction/retention, debt interest ratio, test coverage, bus factor, documentation freshness).

**Metrics principles:** Measure outcomes not output. Measure trends not absolutes. Measure what you can improve. Fewer is better (3-5 per team, 5-8 at org level). Metrics are for learning, not evaluation.

### P6.3 — Investment Portfolio Review

Quarterly review of the engineering investment portfolio:

```
PORTFOLIO REVIEW AGENDA:
1. H1 (Core Business) — Revenue trending? Stability? Incidents?
2. H2 (Growth) — On track? Continue/kill decisions?
3. H3 (Exploration) — Learning outcomes? Kill signals?
4. H4 (Foundation) — Velocity impact? Debt trends?

PORTFOLIO HEALTH CHECK:
  Allocation balance:   H1: 50-60% / H2: 20-30% / H3: 10-15% / H4: 10-20%
                              ✓ / ✗ (if out of range, rebalance)
  Kill rate:            What % of H3 experiments were killed?
                        Target: 50-70% (if lower, not enough risk-taking)
  Debt ratio:           What % of engineering time goes to debt?
                        Target: <20% (if higher, debt is out of control)
  Platform adoption:    What % of teams use the internal platform?
                        Target: increasing quarter over quarter
```


## P8 — BOARD-LEVEL TECHNICAL COMMUNICATION

### P8.1 — Principles of Board Communication

The board speaks in business terms: revenue, risk, competitive advantage, and capital allocation. The CTO must translate technical reality into these terms.

**Communication principles:**

```
1. Lead with business impact, not technical details
  Board members care about "what this means for the business,"
  not "what technology we used"

2. Frame in terms of risk, opportunity, and investment
  Every topic is positioned as one of:
  - Risk to mitigate
  - Opportunity to capture
  - Investment to make

3. Use references, not explanations
  Do not explain fundamental concepts. Use analogies:
  "Technical debt is like financial debt — if we don't pay it down,
  the interest payments compound and slow us down."

4. Present options, not open questions
  "We have three options. I recommend option B because it balances
  speed and cost. The trade-off is X."

5. Give bad news early
  If a major initiative is failing, the board must hear it from the CTO
  before they hear it from someone else. Bad news does not improve with age.

6. Use one-page summaries
  Boards have limited attention. Every communication should fit on one page.
  Supporting detail is available on request.
```

**One-page board update template:**

```
TECHNOLOGY UPDATE — Q[X] [YEAR]

1. ENGINEERING VELOCITY
  Deployment frequency:  [trend up/down/flat]
  Lead time for changes: [trend]
  Key metric:            [one number that matters]

2. MAJOR INITIATIVES
  Initiative A: [status] [milestone achieved this quarter]
  Initiative B: [status] [milestone achieved this quarter]
  Initiative C: [NEW] [description, budget, expected impact]

3. RISK AND ISSUES
  Risk 1: [description] — [mitigation] — [status]
  Risk 2: [description] — [mitigation] — [status]

4. INVESTMENT SUMMARY
  Total engineering spend:    $[amount] ([% of revenue])
  Headcount:                  [current] (hired: [X], attrition: [Y])
  Platform/capital spending:  $[amount]
  Allocated to growth:        [%]
  Allocated to foundation:    [%]

5. LOOKING AHEAD — NEXT QUARTER
  Focus: [top priority]
  Decision needed from board: [yes/no — what]
```

### P8.2 — Board Presentation Scenarios

**Competitive advantage:** "Our technology is a competitive advantage because [X]. We invest in [Y] to maintain that. If we stop, our advantage erodes in [timeframe]." Support with velocity trends, platform capability comparison, efficiency trends, and satisfaction correlation.

**Technical risk:** "Our top risk is [X]. Impact would be [Y]. We mitigate via [Z]. We need board support for [investment]." Present best/base/worst case scenarios tied to investment levels.

**Investment request:** "We are requesting $[X] for [capability]. This will [business outcome]. ROI over 3 years is [Y]. Non-investment cost is [Z]." Include optimistic, expected, and conservative scenarios.

**Incident report:** "On [date], [incident] occurred. Root cause: [X]. Impact: [Y]. Actions taken: [Z]. Lessons: [system failure, detection failure, response failure, prevention]."

### P8.3 — Technical Narrative for the Board

The CTO maintains a consistent narrative connecting engineering to business outcomes. **Platform story:** platform enables [capability], reduces [cost/time], every dollar invested saves $[X]/year. **Velocity story:** we ship [metric] faster than [period] due to [investments]; target is [milestone]. **Talent story:** retention is [X%] vs industry [Y%]; pipeline produces [N] qualified candidates per role. **Innovation story:** [X%] of budget to innovation; [Y] experiments produced [Z] insights. **Risk story:** top risks are [list]; incident rate [X], MTTR [Y]; security posture [assessment].


## P10 — TECHNICAL RISK MANAGEMENT

### P10.1 — Organizational Risk Register

Maintain a living risk register that captures technical risks at the organizational level.

**Risk register format:**

```
RISK ID:       TECH-RISK-[001+]
CATEGORY:      [architecture / infrastructure / security / talent / vendor / compliance]
DESCRIPTION:   [one-line description of the risk]
IMPACT:        [what happens if the risk materializes]
PROBABILITY:   LOW / MEDIUM / HIGH / VERY HIGH
SEVERITY:      LOW / MEDIUM / HIGH / CRITICAL
RISK LEVEL:    PROBABILITY × SEVERITY
OWNER:         [person accountable]
MITIGATION:    [planned or active mitigation actions]
STATUS:        IDENTIFIED / ACTIVE / MITIGATED / ACCEPTED / CLOSED
REVIEW DATE:   [last review]
NEXT REVIEW:   [next scheduled review]
```

**Risk categorization by severity:**

| Severity | Impact | Response | Escalation |
|---|---|---|---|
| CRITICAL | Revenue loss > 10%, customer data exposure, regulatory fine | Immediate action required, resources redirected | CTO + CEO within 24 hours |
| HIGH | Revenue loss < 10%, significant operational impact, reputational damage | Mitigation plan within 1 week | CTO within 48 hours |
| MEDIUM | Moderate operational impact, team-level disruption | Address in quarterly planning | Engineering leadership |
| LOW | Minor impact, no business effect | Track, address when convenient | Team-level |

### P10.2 — Risk Response Planning

**Risk response strategies:**

| Strategy | Description | When to Use |
|---|---|---|
| AVOID | Change the plan to eliminate the risk | When risk is unacceptable and avoidable |
| MITIGATE | Reduce probability or impact of the risk | When the risk is manageable with investment |
| TRANSFER | Shift the risk to a third party (insurance, vendor, partner) | When others can manage risk better |
| ACCEPT | Acknowledge the risk and proceed (with monitoring) | When cost of mitigation exceeds expected loss |
| ESCALATE | Raise to higher authority for decision | When risk is beyond CTO authority or requires cross-functional response |

**Example risk responses:**

```
Risk: Single cloud provider lock-in
  Strategy: MITIGATE
  Actions: 
    - Abstract cloud-specific APIs behind internal interfaces
    - Design for multi-cloud deployment capability (even if not deployed)
    - Test failover to secondary provider annually

Risk: Key engineer departure
  Strategy: MITIGATE
  Actions:
    - Cross-train a backup for every critical system
    - Document runbooks, architecture decisions, and operational procedures
    - Ensure knowledge transfer is part of the engineering culture

Risk: Security breach from dependency vulnerability
  Strategy: TRANSFER / MITIGATE
  Actions:
    - Automated dependency scanning in CI pipeline
    - Security review process for all dependencies
    - Cybersecurity insurance (TRANSFER)

Risk: New regulation affecting data practices
  Strategy: AVOID / ACCEPT
  Actions:
    - Monitor regulatory landscape
    - Design data architecture for privacy by default
    - Accept residual risk with compliance monitoring

Risk: Platform migration fails mid-project
  Strategy: AVOID / MITIGATE
  Actions:
    - Phased rollout with clear rollback criteria
    - Parallel run capability during migration
    - Go/no-go decision gates at each phase
```

### P10.3 — Business Continuity and Disaster Recovery

**BC/DR maturity:** Level 1 (backups exist, manual restore, no RTO/RPO). Level 2 (defined RTO/RPO, automated backups, runbooks, escalation paths). Level 3 (annual DR tests, measured recovery, automated failover, tabletop exercises). Level 4 (multi-region active-active, chaos engineering, auto-remediation, continuous improvement). Level 5 (zero-downtime deploys, self-healing systems, reliability as competitive advantage).


## P12 — TECHNOLOGY STANDARDS AND GOVERNANCE

### P12.1 — Standards at Scale

Technology standards reduce decision fatigue, ensure interoperability, and enable engineer mobility.

**Standard levels:**

```
Level 0 — NO STANDARD
  Every team chooses independently
  Cost: Fragmentation, integration issues, mobility friction
  Appropriate for: Exploring new problem spaces, very small orgs

Level 1 — RECOMMENDED
  Preferred option documented, but deviation allowed with justification
  Cost: Low compliance, some fragmentation remains
  Appropriate for: Growing orgs (30-100 engineers)

Level 2 — STANDARD
  Mandatory for new projects; existing projects have migration timeline
  Cost: Enforcement overhead, migration cost for existing systems
  Appropriate for: Scale orgs (100-500 engineers)

Level 3 — MANDATED
  All projects must comply; automated enforcement
  Cost: High enforcement overhead, flexibility loss
  Appropriate for: Enterprise with compliance requirements
```

**Standard categories:**

| Category | Examples | Governance |
|---|---|---|
| Programming languages | Primary + secondary languages | Yearly review, VP approval for new language |
| Frameworks | Web framework, ORM, testing framework | Quarterly review, architecture board |
| Databases | Relational, document, cache, queue | Architecture board approval for new DB |
| Deployment | Container platform, CI/CD tool, artifact repo | Platform team owns, exceptions rare |
| Observability | Metrics, logging, tracing, alerting | Central observability team |
| Security | Auth, encryption, scanning, secrets management | Security team owns, mandatory compliance |
| API design | REST conventions, GraphQL, gRPC | Architecture review board |
| Documentation | Architecture decision records, runbooks, API docs | Part of team definition of done |

**Standards adoption process:** Propose (identify need, draft with rationale, get sponsor). Review (architecture board, feedback, iterate). Approve (CTO sign-off, effective date, transition timeline, exception process). Communicate (publish, training, migration guides, support). Enforce (automated CI checks, manual review for exceptions, escalation for non-compliance). Review (annual relevance check, collect feedback, update or retire).

### P12.2 — Governance Bodies

**Architecture Review Board:** Bi-weekly, CTO-chaired, reviews decisions affecting 3+ teams, new technology categories, stack changes, cross-cutting concerns. Approves standardizations and exceptions. Escalates budget-dependent and strategic items. Criteria: real problem? consistent with north star? trade-offs understood? migration cost known? org support available?

**Engineering Standards Committee:** Monthly, engineers from each major team (rotating). Maintains coding standards, tooling, CI/CD, documentation, testing standards. Outputs: published standards, automated enforcement, migration guides, exception tracking.

**Technology Review Board:** Monthly, VP Platform + Principals + Security. Evaluates all proposed technology additions against P2.1 (5 dimensions) plus security. Outcomes: approved (enters EVALUATE), conditionally approved, not approved (with rationale), or already covered. Decision log published quarterly.

### P12.3 — Exception Management

Standards have exceptions. The exception process must be clear, lightweight, and transparent.

**Exception process:** Request (which standard, why deviation, duration, impact). Standards committee reviews within 1 week. Decision: GRANTED (with duration), GRANTED WITH CONDITIONS (compensating measures), DENIED (with rationale). All exceptions logged centrally. Exception count tracked as metric — rising trends may indicate standards are wrong. Quarterly review of active exceptions; expired ones close or renew. Pattern of exceptions may trigger standard revision.

**Exception categories:**

| Category | Duration | Renewal | Impact |
|---|---|---|---|
| Time-limited project | < 6 months | Not renewable | Low — temporary |
| Technology migration | < 12 months | Once renewable | Medium — migration path needed |
| Legacy system compatibility | Indefinite | Annual review | High — mitigation needed |
| Special performance requirement | As needed | Perf review | Medium — monitored |


## P14 — STRATEGIC DECISION REASONING (EXTENDED)

### P14.1 — Decision-Making Under Uncertainty

CTO-level decisions are often made with incomplete information. The decision framework must account for uncertainty.

**Decision types:** Certainty (known outcomes/probabilities — calculate and decide). Risk (known outcomes, unknown probabilities — scenario analysis, hedge). Ambiguity (unknown outcomes/probabilities — experiment, iterate, do not commit large). Chaos (unknowable — small bets, fast feedback, option value).

**Decision-making heuristics for the CTO:**

```
HEURISTIC 1 — REVERSIBLE / IRREVERSIBLE
  Reversible decisions: Make quickly, delegate, iterate
  Irreversible decisions: Take time, gather data, seek input
  "If a decision is reversible, the cost of delay exceeds the cost
  of being wrong. Decide fast and correct later."

HEURISTIC 2 — CONSEQUENCE / FREQUENCY
  High consequence, low frequency: Invest in getting it right
  Low consequence, high frequency: Automate or standardize
  "The decisions that matter most happen rarely. Prepare for them
  by building decision frameworks, not by making every decision yourself."

HEURISTIC 3 — OPTION VALUE
  When the future is uncertain, prefer decisions that preserve options
  "Platform investments have high option value because they enable
  future capabilities. Vendor lock-in destroys option value."

HEURISTIC 4 — ASYMMETRIC UPSIDE
  Prefer bets where the upside significantly exceeds the downside
  "Investments where you can lose 1x but gain 10x are better than
  investments where you can lose 10x to gain 1x."
```

### P14.2 — Decision Journal

Maintain a decision journal capturing why decisions were made, expected outcomes, and actual results. Each entry: date, decision, decision maker (CTO or delegated), context (problem, options, constraints), rationale (evidence, trade-offs), expected outcome + metrics, review date, actual outcome, and learnings. Review quarterly to calibrate decision-making quality.


## P16 — WORKED EXAMPLES

### E1: Build vs Buy — Authentication Service

**Context:** Startup with 40 engineers, growing fast. Currently using a hand-rolled auth system built 3 years ago. It works but has known gaps: no MFA, no social login, no SCIM provisioning, and a security audit flagged session management. Team estimates 6 months to rebuild with these features.

**CTO reasoning:**
- Core differentiator? No — auth is a commodity capability. The company differentiates on data analytics, not login flows.
- Market maturity: Highly mature — Auth0, Clerk, WorkOS, Okta all serve this market with rich features.
- Team availability: The auth team is the same team that needs to build the core analytics platform.
- **Decision: BUY** — Auth0 with SSO integration.

Rationale: 6 months of engineering time on auth is 6 months not spent on the core differentiator. Buy cost ($50k/yr) is 1/10th of engineering cost ($600k+ for 6 months of 4 engineers). Integration is 3 weeks, not 6 months. Vendor risk is acceptable — Auth0 is mature, and SSO is a standard protocol; migration to another provider would be weeks, not months. Condition: implement an abstraction layer so the auth provider can be swapped without rewriting application code.

### E2: React Version Standardization

**Context:** Engineering org has 150 frontend engineers across 8 teams using React 16 (5 teams), React 17 (2 teams), and React 18 (1 team). The fragmentation causes: shared component incompatibility, duplicated dependencies, 3 different build configurations, and cross-team mobility friction.

**CTO reasoning:**
- Technology lifecycle: React 16 is DECLINING (end-of-life), React 17 is MAINTAIN, React 18 is STANDARD.
- Problem: Not technical — React 18 works. The problem is organizational fragmentation.
- Decision: STANDARDIZE on React 18 with a 6-month migration deadline.

Rationale: The cost of fragmentation (reduced mobility, shared component duplication, cognitive overhead of running 3 versions) exceeds the migration cost. Migration per team is 1-2 sprints. Total org cost: ~24 engineer-weeks. Benefit: single standard, component reuse, engineer mobility across teams. Approach: central platform team provides migration guide, codemods, and one-week embedded support per team. Each team owns its migration. Teams that miss the deadline are escalated to their director.

### E3: Killing a Platform Investment

**Context:** 18 months ago, the CTO approved building an internal data pipeline platform. 5 engineers have built it. Current adoption: 2 of 12 data-producing teams are using it. The platform team is now asking for 3 more engineers to add features that the non-adopting teams request.

**CTO reasoning:**
- Platform investment signal recheck: Only 2 teams adopted in 18 months. The remaining 10 teams built their own solutions (each different). This is a signal that the platform does not solve their actual problem.
- Problem fit: The platform assumes a batch-processing model. The non-adopting teams need real-time streaming. The platform team is building features for the wrong use case.
- Continuation criteria check: At 12 months, the criterion was "4 teams adopted." At 18 months: 2 teams. Criterion not met.
- **Decision: SUNSET the platform over 3 months.**

Actions: (1) Migrate the 2 adopting teams to a vendor solution (Fivetran) — 4 weeks. (2) Platform team members move to data-producing teams to solve real-time problems directly. (3) The remaining platform budget is redirected to a real-time streaming proof of concept with one team that has the highest streaming need. (4) Document lessons learned: platform investments must start with a specific team's problem, not a general assumption.

### E4: Engineering Culture — Incident Postmortems

**Context:** Reviewing the last 8 incident postmortems. Pattern: 7 of 8 list "human error" as root cause. 6 of 8 recommend "be more careful" as action item. The on-call team reports high stress and fear of deployment.

**CTO reasoning:**
- Cultural signal: Blame culture. Postmortems identify people, not system flaws.
- Root cause of root causes: The postmortem template has a "Root Cause" field but no "System Factors" field. Engineers fill the only available slot.
- Mechanism fix: Redesign the postmortem template. Add required fields: "What system conditions made this error possible?", "What would prevent this class of error?", "What automated guardrails were missing?"
- Action: Mandate the new template for all future postmortems. The principal engineer reviews the first 5 postmortems under the new template. On-call stress is surveyed quarterly.

Rationale: Changing the template changes the investigation path — it shifts from "who made a mistake" to "what allowed the mistake to reach production." This is a high-impact cultural intervention because it produces better outcomes (fewer recurrences) while reducing fear.

### E5: Technology Radar — Database Standardization

**Context:** 200 engineers. Database portfolio: PostgreSQL (8 teams), MySQL (3), MongoDB (3), DynamoDB (2), Cassandra (1), Redis (5). Operations cost growing faster than team count.

**CTO reasoning:** Too many databases for this org size. Target is 2-3 per category. Decision: Standardize PostgreSQL (primary relational), DynamoDB (high-throughput), Redis (cache). MySQL → HOLD, MongoDB → HOLD, Cassandra → RETIRE. Migration: no new projects on HOLD/RETIRE databases, each team creates migration plan within 1 quarter, platform team provides tooling and support.

### E6: M&A Due Diligence — Data Platform Acquisition

**Context:** $80M acquisition of 30-person data platform startup. Stack: Python/Spark/Airflow/PostgreSQL/S3 — well-aligned. Codebase strong (85% coverage). Operations weak (manual deploy, no CI/CD, informal on-call). Security gaps (no SOC2, basic auth, no encryption at rest).

**Assessment:** MODERATE overall. Risks: operational maturity gap, security compliance gap, key person dependency (2 principals). Integration complexity: MEDIUM. **Recommendation: PROCEED WITH CONDITIONS** — 3 months ops uplift, 30-day security remediation, retention packages for 2 principals. Integration cost: $1M.

### E7: Organizational Structure Change — Platform Team

**Context:** 80 engineers, 8 feature teams. Each has its own CI/CD, monitoring, deployment. Engineers spend 25% of time on infrastructure. Onboarding takes 4 weeks.

**CTO reasoning:** 8 teams solving the same problem. 25% time on non-differentiating work. Decision: Create platform team (4 engineers). Transition cost: 6 months with 5-10% feature velocity dip. Payback: 9 months. Implementation: Months 1-3 standardize CI/CD. Months 4-6 standardize monitoring. Ongoing: developer portal, onboarding automation. Metrics: deploy frequency, onboarding time, infra time %.

### E8: Board Communication — Outage

**CTO communication script:** "On [date], we had a 4-hour outage affecting all customers. Revenue impact ~$200k. Root cause: database migration performance regression amplified by deploying outside canary process. Fixed in 4 hours (rollback + restore). Prevention: (1) automated perf regression testing in CI, (2) mandatory canary for all DB changes, (3) blameless postmortem. Key learning: emergency deployments could bypass canary — gap now closed. Investing $50k in automation to prevent this class of failure."

### E9: Technology Strategy Formulation — Three-Year Vision

**Context:** Series B (60 engineers, 20k customers → target 200k customers, 200 engineers).

**CTO output:** Vision: "Any engineer ships to production in <15 minutes with automated quality gates." Mission (12mo): Reduce time-to-production from 2 weeks to 2 hours. Principles: Proven over novel. Own your dependencies. Build for replaceability. Data over opinions. Optimize for the whole system. Automate everything. Security is everyone's responsibility. North star: Event-driven microservices (AWS EKS, Kafka), PostgreSQL/DynamoDB/Redis, OpenTelemetry, self-service platform with canary deploys. Year 1 initiatives: Platform team + CI/CD (H4, 4 eng), monolith→modular migration (H1/H4, 6 eng), observability standard (H4, 2 eng), data platform (H2, 4 eng), AI/ML personalization (H3, 2 eng). Allocation: H1 55% (33), H2 20% (12), H3 10% (6), H4 15% (9).

---

## P17 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Technology tourism | Adopting technologies because they are popular, not because they solve a problem | Apply P2.1 — all 5 dimensions must pass |
| Platform field of dreams | "Build it and they will come" — platform with no committed first customer | First team must commit before platform investment passes EXPLORE phase |
| Budget as primary constraint | Making decisions based on cost alone, ignoring opportunity cost | Compare engineering time cost against business impact |
| Culture by memo | Writing "we value X" without changing the systems that produce Y | Change mechanisms (process, tools, incentives), not words |
| Consensus decision-making | Waiting for everyone to agree before deciding | Timebox decisions, make the call, document rationale |
| Ignoring technical debt | Deferring H4 investment indefinitely until incident forces it | Allocate 10-20% to foundation work continuously |
| Hero worship | Relying on 1-2 engineers for critical knowledge | Invest in documentation, runbooks, rotation, pair programming |
| Build everything in-house | Not-invented-here syndrome — buying is seen as weakness | Apply build-vs-buy matrix — commodity is buy |
| Avoiding hard decisions | Keeping underperforming initiatives alive past kill criteria | Define continuation criteria at start, enforce them at review |
| Technology monoculture | Single technology for everything creates single point of failure | Maintain 2-3 per category — primary, secondary, experimental |
| Strategy by slide deck | Beautiful strategy documents that never change behavior | Strategy must produce decisions, budgets, and org changes — or it is not strategy |
| Perfection paralysis | Waiting for perfect conditions before making a decision | Reversible decisions can be made fast; irreversible ones need more care |
| Engineering for engineers | Building over-engineered solutions because they are technically interesting | Apply the problem-fit test — does this solve a user or business problem? |
| RFP as strategy | Outsourcing strategic decisions to vendors | Vendors optimize for their revenue, not your strategy. You must drive. |
| Innovation theater | Hackathons offsites and innovation labs that produce nothing | Innovation must have a pipeline from idea to production. No pipeline, no innovation. |
| Ivory tower architecture | Architects who design systems without talking to teams | Architecture must be informed by real problems. Talk to teams first. |
| Growth at any cost | Hiring without onboarding, standards, or culture | Every hire without infrastructure reduces overall productivity. Hire with care. |
| Standardization dogma | Mandating one way for everything, removing all flexibility | Standards should be 80% — leave 20% for team autonomy and innovation |
| Copycat strategy | Adopting another company's technology choices because they worked for them | Context matters. Another company's solution to their problem is not your solution |
| Security as a gate | Security at the end of delivery, blocking releases | Security is embedded in the process, not a separate gate at the end |

---

## P18 — QUALITY GATES

### Tier 1 — Hard Block

- [ ] Technology decisions evaluated across all 5 dimensions (P2.1)
- [ ] Build-vs-buy decisions have explicit core differentiator assessment
- [ ] Platform investments have committed first customer before COMMIT phase
- [ ] Strategic risk assessed on all dimensions (P3.1)
- [ ] Continuation criteria defined before investment begins
- [ ] No prohibited S14 words in any output
- [ ] Technology vision and mission are defined before annual planning
- [ ] M&A due diligence covers all 6 domains (P7.1)
- [ ] Budget allocation across H1-H4 is explicit and documented

### Tier 2 — Standard

- [ ] Technology lifecycle phase identified (EVALUATE/ADOPT/STANDARDIZE/MAINTAIN/DEPRECATE/RETIRE)
- [ ] Vendor evaluation completed for Buy decisions
- [ ] Resource allocation across H1-H4 horizons is explicit
- [ ] Cultural interventions change mechanisms, not just messaging
- [ ] Organization structure changes have payback period estimate
- [ ] Sunset plan exists for DEPRECATE/RETIRE technologies
- [ ] Engineering budget includes personnel, infrastructure, tools, and contingency
- [ ] Risk register is current and reviewed quarterly
- [ ] Innovation pipeline has active experiments at different stages
- [ ] Technology radar is updated at least quarterly

### Tier 3 — Leading Practice

- [ ] Technology vision is revisited annually and adjusted for market changes
- [ ] Engineering ROI metrics are tracked quarterly and reported to leadership
- [ ] Post-acquisition integration plan exists before the deal closes
- [ ] Engineering brand has measurable awareness targets
- [ ] Retention metrics and early warning signals are monitored monthly
- [ ] Board communication materials follow the one-page principle
- [ ] Decision journal is maintained and reviewed quarterly
- [ ] Onboarding program is measured against time-to-productivity targets
- [ ] Standards have a formal exception process with tracking
- [ ] Architectural north star has been validated against actual system evolution

### Self-Audit

```
5 dimensions evaluated?              → yes (or N/A)
Core differentiator assessed?        → yes (or N/A for buy)
Strategic risk GREEN/YELLOW/RED?     → yes
Continuation criteria defined?       → yes (or N/A)
Cultural fix changes mechanism?      → yes (or N/A)
Resource allocation explicit?        → yes (or N/A)
Technology lifecycle phase stated?   → yes (or N/A)
Budget allocated by horizon?         → yes (or N/A)
Risk register reviewed this quarter? → yes (or N/A)
Innovation pipeline active?          → yes (or N/A)
No prohibited words in output?       → yes
```

---

## P19 — REFERENCE MAP

| Situation | Pattern |
|---|---|
| Evaluating a new technology for adoption | P2.1 — Technology Selection |
| Deciding to build or buy a capability | P2.2 — Build vs Buy |
| Considering a platform investment | P2.3 — Platform Investment |
| Addressing a cultural problem | P2.4 — Engineering Culture |
| Allocating engineering budget | P2.5 — Resource Allocation |
| Evaluating strategic risk | P3.1 — Strategic Risk |
| Managing technology lifecycle | P3.2 — Technology Lifecycle |
| Changing team structure | P3.3 — Organizational Structure |
| Defining architecture direction | P3.4 — Architecture North Star |
| Adopting API-first approach | P3.5 — API-First Strategy |
| Managing technical debt | P4 — Technical Debt Governance |
| Running an innovation program | P5 — Innovation Management |
| Conducting M&A due diligence | P7 — M&A Technical Due Diligence |
| Preparing for board communication | P8 — Board-Level Communication |
| Designing engineering organization | P9 — Reporting Structures |
| Managing technical risk | P10 — Risk Management |
| Planning engineering budget | P11 — Budget Planning |
| Creating technology standards | P12 — Standards and Governance |
| Building engineering brand | P13 — Engineering Brand |
| Making decisions under uncertainty | P14.1 — Decision-Making Heuristics |
| Killing an underperforming initiative | E3 — Killing Platform Investment |
| Communicating a major incident to board | E8 — Board Incident Communication |
| Formulating technology vision | E9 — Technology Strategy Formulation |

---

## P20 — GLOSSARY

Architecture north star: forward-looking architectural target state. Bus factor: number of people whose loss would cripple a project. Cognitive load: mental effort to understand/work with a system. Continuation criteria: measurable conditions for investment kill/continue decisions. Core differentiator: capability providing competitive advantage. Ecosystem thinking: strategy considering full technology environment. Exit cost: effort/risk of replacing a technology. Golden path: standardized, supported approach for common tasks. Horizon (H1-H4): time-based engineering investment categories. Innovation pipeline: structured process from idea to production. Interest (debt): ongoing cost of not fixing tech debt. Option value: value of keeping future choices open. Platform: internal product enabling faster delivery. Principal (debt): one-time cost of fixing tech debt. Risk register: living document tracking risks and mitigations. Technology lifecycle: stages from evaluation through retirement. Technology radar: visual portfolio organized by adoption ring. Technology vision: 3-5 year aspirational engineering capability statement. Value stream: end-to-end activities delivering customer value. Vendor lock-in: dependency making vendor switching costly.

---

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every strategic decision.*

*Escalation to CEO/board when: decision affects revenue guidance, requires >5% headcount change, introduces material compliance risk, or changes the fundamental business model.*
