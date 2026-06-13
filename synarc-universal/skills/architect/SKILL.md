---
name: architect
description: Architect — System Design & Trade-off Analysis
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Architect — System Design & Trade-off Analysis

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

Architecture is the set of decisions that are expensive to change. The architect's job is to make those decisions consciously, document the reasoning, create systems that remain adaptable as requirements evolve, and govern the architecture across teams. Every architecture is a set of trade-offs — the architect makes those trade-offs visible so the organization can make informed decisions.


## P2 — CORE METHODOLOGY

### P2.1 — Architecture Decision Record (ADR) Methodology

#### P2.1.1 — Purpose and Scope

An Architecture Decision Record captures a decision that is expensive to change. It answers three questions: what was decided, why was this choice made over alternatives, and what trade-offs were accepted? ADRs are immutable once accepted — corrections are made by superseding with a new ADR, never by editing an existing one.

#### P2.1.2 — When to Write an ADR

- Choosing a technology with multi-year impact (database, language, framework, cloud provider)
- Defining a system boundary (service split, module boundary, bounded context)
- Changing a contract that affects multiple consumers
- Adopting a pattern that affects engineering approach (event-driven, CQRS, microservices, hex architecture)
- Reversing or superseding a previous ADR
- Making a HARD-TO-REVERSE or IRREVERSIBLE decision
- Defining data architecture (database selection, consistency model, sync vs async replication)

#### P2.1.3 — When NOT to Write an ADR

- Library choice (REVERSIBLE-HOURS) — let teams decide
- Implementation patterns within a module — let teams decide
- Configuration decisions — document in config, not ADR
- Tooling decisions within a team's domain (REVERSIBLE-DAYS)

#### P2.1.4 — ADR Lifecycle

```
PROPOSED → ACCEPTED → DEPRECATED → SUPERSEDED
                 ↓
            REJECTED

PROPOSED:  Decision is under review, not yet adopted
ACCEPTED:  Decision has been adopted and is active
DEPRECATED: Decision is no longer recommended, but still in effect
SUPERSEDED: Replaced by a newer ADR (ADR-N referenced)
REJECTED:  Decision was evaluated and not adopted
```

#### P2.1.5 — ADR Numbering and Organization

- Number sequentially: ADR-001, ADR-002, etc.
- Store alongside code (e.g., `docs/adr/ADR-001-title.md`)
- Include status in filename for quick scanning
- Maintain an index file (`docs/adr/README.md` or `INDEX.md`) listing all ADRs with status
- Superseded ADRs remain in the repository — never delete them

#### P2.1.6 — ADR Review Criteria

Before accepting an ADR, verify:
1. Context clearly describes the problem, not a prescribed solution
2. At least 3 alternatives were genuinely evaluated
3. Trade-offs are explicit — what we gain, what we lose, and under what conditions the opposite choice would be correct
4. Consequences include positive, negative, and neutral outcomes
5. At least one fitness function is defined to validate the decision over time
6. Irreversibility class is stated
7. The decision does not contradict active ADRs (or explicitly supersedes them)

### P2.2 — Irreversibility Classification

Before any architecture or technology decision, classify its irreversibility. This determines the level of review, documentation, and sign-off required.

| Class | Reversal Cost | Examples | Required Action |
|-------|--------------|----------|-----------------|
| REVERSIBLE-HOURS | Undo within hours, cost < 1 engineer-day | Library choice, file structure, API naming | Do not intervene — let team decide |
| REVERSIBLE-DAYS | Undo within days, cost < 1 engineer-week | CI/CD pipeline, test framework, logging strategy, read replicas | Awareness only — review if asked |
| REVERSIBLE-WEEKS | Undo within weeks, cost < 1 engineer-month | Module boundaries, internal API design, caching layer, library standardization | Lightweight review — team decision |
| HARD-TO-REVERSE | Reversal takes months or significant migration | Database technology, service decomposition, language/framework, event platform, cloud provider | Required review — architect signs off, ADR required |
| IRREVERSIBLE | Cannot undo without full rewrite or data loss | Data model with external commitments, platform API for customers, compliance architecture, data storage schema with regulatory lock-in | Required escalation — architect + CTO sign-off, ADR required |

**Reversibility test:** "If we choose option A and it turns out wrong, what is the cost to switch to option B? Who pays that cost? How long does it take?"

**Reversibility documentation rule:** For every HARD-TO-REVERSE and IRREVERSIBLE decision, document the rollback plan or migration path before implementation begins.

### P2.3 — Trade-off Analysis & Quality Attributes

#### P2.3.1 — Trade-off Dimensions

Every architecture decision optimizes for a subset of quality attributes at the expense of others. These are the primary trade-off dimensions:

```
COST           vs  CAPABILITY       → "We spend less but lose feature X"
SPEED          vs  QUALITY          → "We ship faster but accept more incidents"
SIMPLICITY     vs  FLEXIBILITY      → "Easy now, harder to change later"
CONSISTENCY    vs  AVAILABILITY     → "Strong consistency reduces read availability"
PERFORMANCE    vs  MAINTAINABILITY  → "Faster with manual optimization, harder to maintain"
COUPLING       vs  AUTONOMY         → "Tight coupling simplifies, loose coupling empowers"
LATENCY        vs  THROUGHPUT       → "Optimize for one at expense of the other"
DURABILITY     vs  SPEED            → "Synchronous writes are slower but safer"
VENDOR         vs  BUILD            → "Buy faster but less control; build slower but full control"
TIME-TO-MARKET vs  CORRECTNESS      → "Ship early with lower confidence, or wait for rigor"
```

#### P2.3.2 — Quality Attribute Taxonomy

| Quality Attribute | Definition | Typical Fitness Function | Common Conflict |
|------------------|-----------|-------------------------|-----------------|
| Availability | System uptime and ability to serve requests | p99 uptime > 99.9% measured over 30-day rolling window | Conflicts with consistency (CAP theorem) |
| Consistency | Data correctness across replicas and after failures | Zero detected data anomalies in audit | Conflicts with availability and latency |
| Durability | Data persistence guarantees after write acknowledgement | Zero data loss in documented failure scenarios | Conflicts with write latency |
| Latency | Response time for requests | p99 < 200ms under 2x peak load | Conflicts with durability and consistency guarantees |
| Throughput | Requests processed per time unit | Sustains 3x peak load without degradation | Conflicts with latency optimization |
| Scalability | Ability to handle growth without re-architecture | Linear throughput scaling with added capacity | Conflicts with simplicity and operational cost |
| Maintainability | Ease of making changes safely | Change lead time < 1 day, change failure rate < 5% | Conflicts with performance optimization |
| Deployability | Speed and safety of releasing changes | Deployment frequency > 1/week, independent deploys | Conflicts with strict consistency guarantees |
| Operability | Ease of running, monitoring, and recovering | MTTR < 1 hour for common failure modes | Conflicts with architectural complexity |
| Testability | Ease of verifying correctness at all levels | Test coverage > 80%, build time < 10 min | Conflicts with integration complexity |
| Security | Resistance to unauthorized access and attacks | Zero critical/high vulnerabilities in production | Conflicts with usability and performance |
| Cost | Total cost of ownership (infra, people, operations) | Within budget, predictable month-over-month | Conflicts with every other attribute |

#### P2.3.3 — Trade-off Visibility Rule

For every architecture decision, state:
1. What we gain
2. What we lose
3. Under what conditions would the opposite choice have been correct

If you cannot answer #3, you have not fully analyzed the trade-off.

#### P2.3.4 — Trade-off Analysis Method

```
STEP 1: Identify the decision and list all viable alternatives (minimum 3)
STEP 2: Identify the quality attributes that matter for this decision (top 3-5)
STEP 3: Score each alternative against each quality attribute (--, -, 0, +, ++)
STEP 4: Identify the top 2 alternatives, state the primary trade-off between them
STEP 5: Determine the condition under which the second-best alternative becomes the best
STEP 6: Document the decision, the trade-off, and the condition
```

### P2.4 — Technology Selection Methodology

#### P2.4.1 — Selection Process

```
PHASE 1 — DISCOVERY
  - Define the problem in outcome terms (not solution terms)
  - Identify constraints: budget, timeline, team skills, compliance, interoperability
  - List candidate technologies (aim for 3-5)
  - Classify decision irreversibility

PHASE 2 — EVALUATION
  - Score candidates against weighted criteria:
    | Criterion | Weight | Rationale |
    |-----------|--------|----------|
    | Problem fit | 30% | Does it solve the stated problem? |
    | Operational maturity | 20% | Production readiness, community, support |
    | Team capability | 15% | Existing skills, learning curve, hiring market |
    | Ecosystem compatibility | 15% | Integration with existing stack |
    | Cost | 10% | License, infrastructure, operational cost |
    | Vendor risk | 10% | Lock-in, roadmap, financial health, OSS community health |
  - Run a proof of concept for top 2 candidates (timebox: 1-2 weeks)
  - Document evidence from POC: does not need to be comprehensive, but must validate key claims

PHASE 3 — DECISION
  - Write ADR with evaluated alternatives and evidence
  - Include migration plan and rollback strategy
  - Define fitness functions to validate over time
```

#### P2.4.2 — Build vs Buy Decision Matrix

| Factor | Build | Buy | Tiebreaker |
|--------|-------|-----|------------|
| Core differentiator | Build — owning the IP creates advantage | Buy — commoditized capability | If it's your secret sauce, build |
| Time to market | 6-18 months typical | Days to weeks | If speed is critical, buy |
| Team size | Requires dedicated team | Minimal team | If team is small, buy |
| Customization need | Full control | Vendor's roadmap | If customization is critical, build |
| Maintenance burden | Full ownership | Vendor manages | If team is stretched, buy |
| Integration complexity | Full control over API | Vendor's API | If existing stack is complex, build |
| Cost profile | High initial, variable ongoing | Subscription, predictable | If budget is constrained, buy initially |
| Vendor risk | None | Lock-in, EOL, acquisition | If risk tolerance is low, build |

**Decision rule:** If 6+ factors point in one direction, that is the clear choice. Otherwise, run a 2-week POC of the buy option and a 2-week spike of the build option, then reconvene.

#### P2.4.3 — Open Source Evaluation Criteria

| Criterion | What to Check | Red Flag |
|-----------|--------------|----------|
| Community health | Commit frequency, contributor diversity, response time to issues | Single-company dominated, abandoned > 6 months |
| License | OSI-approved license, relicense risk, patent grants | SSPL, BUSL, or custom license with restrictions |
| Security posture | CVE history, security policy, disclosure process | Known critical CVEs unpatched > 30 days |
| Roadmap alignment | Recent releases, planned features, breaking changes | Major breaking changes without migration guides |
| Dependency footprint | Direct and transitive dependencies, supply chain risk | Bundled dependencies, excessive transitive count |
| Compatibility | Works with existing stack, supported platforms | Requires significant infrastructure changes |
| Maintenance reliability | Release cadence, LTS policy, backport policy | Irregular releases, no LTS, no backports |

#### P2.4.4 — Vendor Assessment Criteria

| Criterion | Questions to Answer | Risk Signal |
|-----------|-------------------|-------------|
| Financial stability | Years in business, funding, revenue, profitability | Series A/B startup for critical infrastructure |
| Support quality | SLA, response times, escalation path, support team expertise | Support outsourced, no named account team |
| Exit complexity | Data export, migration tools, contract termination terms | No documented migration path |
| Compliance certifications | SOC2, HIPAA, PCI, FedRAMP, GDPR readiness | Certifications not independently audited |
| API stability | Breaking change policy, deprecation notices, versioning strategy | Breaking changes without notice |
| Pricing model | Predictability, scaling cost, hidden costs (egress, API calls) | Pricing page requires sales call |
| Roadmap alignment | Product direction matches your needs | Roadmap conflicts with requirements |

### P2.5 — Architecture Governance

#### P2.5.1 — Governance Scope

Architecture governance ensures that system designs align with organizational standards, quality attributes are protected, and technical risk is managed. Governance is not about controlling every decision — it is about setting guardrails so teams can move fast safely.

**Governed areas:**
- Technology selection and standardization (approved languages, frameworks, infrastructure)
- System boundaries and service decomposition
- Data architecture and storage technology
- API design standards and versioning strategy
- Cross-cutting concerns (observability, security, compliance)
- Deprecation and retirement of systems

**Not governed (delegated to teams):**
- Implementation patterns within a service
- Library choices (within approved technology family)
- Internal API design within a bounded context
- Local configuration decisions

#### P2.5.2 — Governance Mechanisms

**Standards:**
- Technology radar: APPROVED (fully supported), TRIAL (use with caution, timeboxed), ASSESS (investigating), HOLD (do not adopt)
- Architecture principles: high-level rules (e.g., "Every service owns its data", "No shared databases across bounded contexts")
- Design standards: API naming conventions, error format, logging structure, documentation requirements

**Guardrails:**
- Automated fitness functions in CI/CD pipeline
- Architecture review triggers (events that require review before proceeding)
- Approval gates for HARD-TO-REVERSE and IRREVERSIBLE decisions
- Timeboxed exceptions with automatic expiry and renewal process

**Review mechanisms:**
- Architecture review board: meets weekly/biweekly, reviews proposals at scale
- Lightweight review: architect reviews ADR asynchronously within 2 business days
- Full review: architecture review board meeting, proponent presents, board decides
- Post-mortem review: after significant incidents, architecture implications reviewed

#### P2.5.3 — Architecture Review Board

```
MEMBERSHIP:
  - Architect (chair)
  - Principal engineer (voting member)
  - Engineering manager for affected teams (voting member)
  - Domain experts as needed (advisory)

SCOPE:
  - Reviews all HARD-TO-REVERSE and IRREVERSIBLE decisions
  - Reviews decisions with cross-team blast radius
  - Establishes and maintains technology radar
  - Resolves architecture disputes between teams
  - Sets and enforces architecture standards

MEETING CADENCE:
  - Cadence depends on volume of proposals (weekly for high-velocity orgs, biweekly otherwise)
  - Asynchronous review between meetings via ADR comments
  - Decisions documented in meeting notes and linked to ADRs

DECISION RULES:
  - Simple majority for REVERSIBLE-WEEKS decisions
  - Consensus sought, architect decides for HARD-TO-REVERSE
  - Architect + CTO for IRREVERSIBLE
  - Abstention recorded — chair decides if no majority
```

#### P2.5.4 — Exception Management

When a team needs to deviate from a standard:
1. Team submits exception request with rationale and duration
2. Architect reviews: is the exception justified? Is the duration reasonable?
3. If approved: exception documented, tracked, and auto-expires
4. If rejected: team follows standard or re-submits with stronger evidence
5. At expiry: team either aligns with standard or requests renewal

Exception criteria: (a) Standard does not fit the specific use case, (b) Migrating to standard would cause unreasonable delay, (c) Team has plan to align within the exception period.


## P4 — OUTPUT FORMATS

### P4.1 — Architecture Decision Record (Standard)

```
TITLE:        [N]: [decision title]
STATUS:       PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED
DATE:         [YYYY-MM-DD]
AUTHOR:       [name]
IRREVERSIBILITY: REVERSIBLE-HOURS | REVERSIBLE-DAYS | REVERSIBLE-WEEKS | HARD-TO-REVERSE | IRREVERSIBLE

CONTEXT:
[2-3 paragraphs — what problem or opportunity prompted this decision, what constraints exist]

DECISION:
[one clear sentence — the choice]

RATIONALE:
[evidence-based reasoning — data, benchmarks, references to supporting materials, why this option over alternatives]

CONSEQUENCES:
  POSITIVE:
  - [benefit 1]
  - [benefit 2]
  NEGATIVE:
  - [trade-off 1 accepted]
  - [trade-off 2 accepted]
  NEUTRAL:
  - [change that must happen as a result]

ALTERNATIVES:
  [Option A]: [why rejected — specific, evidence-based]
  [Option B]: [why rejected — specific, evidence-based]
  [Option C]: [why rejected — specific, evidence-based]

FITNESS FUNCTIONS:
  [N]: [metric] — [target] — [enforcement mechanism]

SUPERSEDES: [ADR-N if applicable]
SUPERSEDED BY: [ADR-N if applicable]
FAILURE MODE: [what happens if this decision is wrong, rollback plan]
```

### P4.2 — Architecture Decision Record (Lightweight)

For lower-severity decisions (REVERSIBLE-WEEKS) that still benefit from documentation:

```
TITLE:        [N]: [decision title]
STATUS:       ACCEPTED
DATE:         [YYYY-MM-DD]
AUTHOR:       [name]

CONTEXT:      [1-2 sentences]
DECISION:     [one sentence]
RATIONALE:    [1-2 sentences]
TRADE-OFF:    [what we gain vs what we lose]
```

### P4.3 — RFC / Technical Proposal Template

```
TITLE:        [N]: [descriptive title]
STATUS:       DRAFT | REVIEW | APPROVED | REJECTED | IMPLEMENTED
AUTHOR:       [name]
DATE:         [YYYY-MM-DD]
IRREVERSIBILITY: [class]

## 1. PROBLEM STATEMENT
[What problem are we solving, for whom, and why does it matter? — outcome terms, not solution terms]

## 2. SCOPE
IN SCOPE:
  - [item]
OUT OF SCOPE:
  - [item]

## 3. ALTERNATIVES
### Option A: [name]
  Description: [2-3 sentences]
  Evidence: [data, benchmarks, references]
  Cost: [engineering | migration | operational | opportunity]
  Pros: [list]
  Cons: [list]

### Option B: [name]
  [same structure]

### Option C: [name]
  [same structure — minimum 3]

## 4. RECOMMENDATION
[Chosen option with rationale]

## 5. TRADE-OFFS
GAIN:     [what we get]
LOSE:     [what we accept]
CONDITION: [when opposite choice would be correct]

## 6. FAILURE MODE
FALLBACK: [rollback plan]
SIGNALS:  [indicators the decision was wrong]

## 7. IMPLEMENTATION
PHASE 1 — [timebox, deliverables]
PHASE 2 — [timebox, deliverables]

## 8. STAKEHOLDERS
AFFECTED TEAMS: [list]
REVIEWERS:      [list]
DECISION BY:    [who makes the final call]
```

### P4.4 — Architecture Governance Audit

```
AUDIT:         [system, domain, or proposal name]
DATE:          [YYYY-MM-DD]
AUDITOR:       [name]

STANDARDS EVALUATED:
  [N]: [standard name] — [version/date]

FINDINGS:
  [PASS|FAIL|WARN] [N]: [finding description]
  [PASS|FAIL|WARN] [N]: [finding description]

BLOCKERS (must resolve before next review):
  [N]: [description] — owner: [name] — deadline: [date]

OBSERVATIONS (non-blocking):
  [N]: [description]

RISK ASSESSMENT:
  OVERALL: [LOW | MEDIUM | HIGH | CRITICAL]
  KEY RISKS:
    - [risk description] — [score] — [mitigation]

FITNESS FUNCTION STATUS:
  [N]: [name] — [PASS | FAIL | NOT MEASURED]

RECOMMENDATIONS:
  [P1] [description] — [owner] — [deadline]
  [P2] [description] — [owner] — [deadline]

NEXT AUDIT: [YYYY-MM-DD]
```

### P4.5 — Trade-off Matrix

```
DECISION:     [decision title]
DATE:         [YYYY-MM-DD]
AUTHOR:       [name]

┌──────────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│   DIMENSION              │   OPTION A           │   OPTION B           │   OPTION C           │
├──────────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│   Problem fit            │   [score + reason]   │   [score + reason]   │   [score + reason]   │
│   Operational maturity   │   [score + reason]   │   [score + reason]   │   [score + reason]   │
│   Team capability        │   [score + reason]   │   [score + reason]   │   [score + reason]   │
│   Ecosystem fit          │   [score + reason]   │   [score + reason]   │   [score + reason]   │
│   Cost (12mo)            │   [estimate]         │   [estimate]         │   [estimate]         │
│   Vendor risk            │   [score + reason]   │   [score + reason]   │   [score + reason]   │
│   Exit cost              │   [estimate]         │   [estimate]         │   [estimate]         │
└──────────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘

RECOMMENDATION: [option]
RATIONALE:      [why this option]
CONDITION:      [what must be true for this to remain the right choice]
```

### P4.6 — System Design Assessment

```
SYSTEM:        [name]
SCALE:         [synarc scale class]
ARCHITECTURE:  [style — monolith/modular/hexagonal/microservices/event-driven/hybrid]

COUPLING ANALYSIS:
  Shared schema / DB:      [HIGH|MEDIUM|LOW] — [note]
  Sync calls:              [HIGH|MEDIUM|LOW] — [note]
  Event contracts:         [HIGH|MEDIUM|LOW] — [note]
  Shared libraries:        [HIGH|MEDIUM|LOW] — [note]
  Deploy coupling:         [HIGH|MEDIUM|LOW] — [note]
  Organizational coupling: [HIGH|MEDIUM|LOW] — [note]

COHESION SCORE:            [HIGH|MEDIUM|LOW] — [assessment against checklist P3.2.2]
CHANGE COST:               [files touched per typical change]
DEPLOYMENT INDEPENDENCE:   [% of deployments that affect only one service]

QUALITY ATTRIBUTE PROFILE:
  Availability:            [target] — [current]
  Consistency:             [model] — [fitness function result]
  Latency:                 [p99 target] — [p99 current]
  Durability:              [guarantee] — [verification method]

FITNESS FUNCTION STATUS:
  [N] [name]:              PASS | FAIL | NOT MEASURED — [details]

RISK REGISTER:
  [N] [risk]:              [score] — [mitigation] — [owner]

RECOMMENDATIONS:
  [P1] [action] — [owner] — [deadline]
  [P2] [action] — [owner] — [deadline]
```

### P4.7 — Technical Decision Record

When the architect makes a binding decision:

```
DECISION:      [title]
STATUS:        APPROVED | REJECTED | DEFERRED
IRREVERSIBILITY: [class from P2.2]
DATE:          [YYYY-MM-DD]

CONTEXT:       [2-3 sentences — what prompted this decision]

OPTIONS:
  A: [option name] — [1-line summary]
  B: [option name] — [1-line summary]
  C: [option name] — [1-line summary]

DECISION:      [chosen option]
RATIONALE:     [2-3 sentences — evidence-based reasoning]

CONSEQUENCES:
  GAIN:    [specific benefit]
  LOSE:    [specific trade-off accepted]
  MONITOR: [signals that the decision was wrong]

GROUPS AFFECTED: [teams or services impacted]

ESCALATION PATH:
  If wrong: [concrete rollback or migration plan]
  Escalate to CTO if: [conditions that require CTO involvement]
```

### P4.8 — Proposal Rejection

```
PROPOSAL:      [title]
REJECTED AT:   GATE [N] — [gate reason]
EVIDENCE:      [what the proposal is missing or fails on]
BAR TO PASS:   [exact condition for approval]
NEXT:          [what to do — revise scope, gather data, escalate]
```


## P6 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Architecture by buzzword | Adopting patterns (microservices, event-driven, CQRS) without understanding trade-offs | State what you gain and what you lose for every pattern. The pattern is not the goal — the outcome is. |
| Big Design Up Front | Specifying everything before building — changes invalidate the design | Evolutionary architecture — design for current requirements, fitness functions for future, defer decisions until you have more information. |
| Golden hammer | Using the same pattern for every problem | Match pattern to problem — different architectural styles solve different problems. A microservices fanatic will see every problem as needing a new service. |
| Irreversible decisions without ADRs | Knowledge lost, trade-offs forgotten, future teams cannot understand why choices were made | Write ADR for any decision that is expensive to change — the cost of documentation is trivial compared to the cost of not knowing why a decision was made. |
| Ignoring deployment architecture | System design without deployment, monitoring, operations — the architecture works on paper but fails in production | Architecture includes operational concerns — deploy, monitor, debug, recover. A service that cannot be operated independently is not independently deployable. |
| Over-abstracting for "flexibility" | Building abstractions for changes that never come — YAGNI violation at architectural scale | Abstract when a second real use case emerges, not before. The most flexible system is the one that has been built and validated. |
| Distributed monolith | Services split but highly coupled — worst of both worlds: microservices complexity with monolith coupling | Check deployment independence regularly. Can each service deploy without deploying others? If not, you have a distributed monolith. |
| Architecture astronautics | Debating theoretical designs without building and validating — analysis paralysis | Build a thin vertical slice, validate assumptions, then generalize. The architecture should emerge from validated learning, not from whiteboard discussions. |
| Ignoring organizational structure | Conway's law — system mirrors communication structure. Designing architecture that fights the organization creates failure | Design architecture that fits team structure, or change both together. The architecture must work for the people building it. |
| No fitness functions | Cannot tell if architecture is degrading — decisions made without feedback loops | Automate at least one fitness function per significant architecture decision. If you cannot measure it, you cannot manage it. |
| Prescribing instead of explaining | Engineer implements without understanding the reasoning, repeats mistakes | Show your reasoning path, not just the conclusion. "Here is how I evaluated this" vs "Use option A." |
| Approving every proposal | Dilutes architect authority, skips rigor, lets bad decisions through | Apply review gates — reject at first failure. Not every proposal is ready. Not every proposal is good. |
| Treating all decisions as critical | Consumes architect time on low-impact choices, creates bottlenecks | Classify irreversibility first. REVERSIBLE-HOURS and REVERSIBLE-DAYS decisions should not consume architect time. |
| Saying no without a path forward | Demoralizes teams, creates escalation cycles, erodes trust | Always provide bar to pass and next step. "No, and here is how to get to yes" builds trust. "No" without a path burns it. |
| Delegating IRREVERSIBLE decisions | Organizational risk without oversight — a mistake that cannot be undone | Principal architect + CTO sign-off required for IRREVERSIBLE decisions. If it cannot be undone, more than one person should decide. |
| Making decisions by consensus | Slow decision making, lowest-common-denominator outcomes, no clear ownership | Architect makes the call after hearing all views. Consensus is slow and produces the weakest possible answer. Clarity > consensus. |
| Reviewing for style not substance | Focus on formatting over reasoning correctness — pretty documents with bad logic | Review for gates, evidence, and trade-offs, not grammar or formatting. A messy ADR with solid reasoning is better than a polished ADR with flawed logic. |
| "We have always done it this way" | Blocks innovation without analysis, assumes past decisions are still valid | Evaluate on current evidence, not historical habit. The right decision last year may be wrong today. Revisit decisions when context changes. |
| Premature decomposition | Splitting a system before understanding boundaries — creates services that change together | Wait until you understand the bounded contexts. It is easier to split a monolith than to merge distributed services. |
| Shared database across services | Tightest possible coupling — schema changes affect all consumers, single point of failure | Each service owns its data. Communicate through APIs or events, not shared databases. The database is an implementation detail, not an integration contract. |
| Versionless APIs | No versioning contract — breaking changes break consumers without warning | Explicit versioning from day 1. Even if no external consumers exist, versioning creates a contract that enables evolution without breaking trust. |

---

## P7 — QUALITY GATES

### Tier 1 — Hard Block

- [ ] ADR includes context, decision, rationale, consequences, and alternatives (for significant decisions)
- [ ] Trade-off analysis states what we gain, what we lose, and when the opposite choice would be correct
- [ ] Service boundary decisions include coupling + cohesion analysis
- [ ] Fitness functions defined for every significant architecture decision
- [ ] Irreversibility classified before any decision review
- [ ] All 6 RFC evaluation gates checked for reviewed proposals
- [ ] HARD-TO-REVERSE and IRREVERSIBLE decisions have written decision record
- [ ] Cross-team disagreement framed and disagreement point isolated
- [ ] Rejection includes specific gate, evidence, bar to pass, and next step
- [ ] No prohibited S14 words in any output

### Tier 2 — Standard

- [ ] Decomposition plan includes migration strategy (strangler fig, parallel run, big bang)
- [ ] Integration pattern selection follows decision flow (P3.3.2)
- [ ] Technical debt is classified by quadrant and severity before remediation decision (P3.6)
- [ ] Existing circular dependencies documented as technical debt with owners and dates
- [ ] ADR status is current (not all PROPOSED — some are ACCEPTED or DEPRECATED)
- [ ] Operational concerns (deploy, monitor, debug, recover) addressed in design (not just code)
- [ ] Speed-quality calibration explicitly stated for the decision context
- [ ] Decision record includes what we gain, what we lose, and what we monitor
- [ ] Teams affected by decision have been informed with rationale
- [ ] Failure mode and fallback documented for non-trivial decisions
- [ ] Risk assessment performed (score ≥ 15 has explicit mitigation plan)
- [ ] API versioning strategy defined for any interface contract
- [ ] Exception approvals have documented rationale, owner, and expiry date
- [ ] Database selection includes evaluation of at least 3 candidates against defined criteria

### Tier 3 — Excellence

- [ ] Architecture risks are tracked over time — risk scores trend downward or stable
- [ ] Fitness functions are validated by chaos engineering or load testing at least quarterly
- [ ] Technical debt register is reviewed and updated monthly
- [ ] Architecture decisions are revisited when fitness functions reveal degraded conditions
- [ ] Cross-team architecture sync happens at least monthly
- [ ] Governance audit conducted quarterly for critical systems, bi-annually for standard systems

### Self-Audit

```
ADR written for significant decisions?               → yes (or N/A)
Trade-off states gain + loss + condition?             → yes (or N/A)
Coupling + cohesion analyzed?                         → yes (or N/A for local changes)
Fitness functions defined?                            → yes (or N/A)
Irreversibility classified?                           → yes (or N/A)
Migration strategy documented?                        → yes (or N/A)
Debt classified before remediation?                   → yes (or N/A)
RFC passed all 6 gates before approval?               → yes (or N/A)
Risk assessment performed for HARD-TO-REVERSE+?      → yes (or N/A)
API versioning defined for interface contracts?       → yes (or N/A)
No prohibited S14 words in output?                    → yes
```

---

## P8 — REFERENCE MAP

| Situation | Pattern |
|---|---|
| Making a significant technical choice | P2.1 — ADR Methodology |
| Determining how much review a decision needs | P2.2 — Irreversibility Classification |
| Comparing two approaches | P2.3 — Trade-off Analysis & Quality Attributes |
| Evaluating a technology or vendor | P2.4 — Technology Selection Methodology |
| Setting architecture standards | P2.5 — Architecture Governance |
| Deciding how to structure a system | P3.1 — System Decomposition Strategies |
| Deciding whether to split a service | P3.2 — Coupling/Cohesion Analysis |
| Choosing integration pattern | P3.3 — Integration Pattern Selection |
| Evaluating a team's technical proposal | P3.4 — RFC Evaluation (6 Gates) |
| Ensuring architecture stays healthy | P3.5 — Evolutionary Architecture & Fitness Functions |
| Deciding whether to fix technical debt | P3.6 — Technical Debt Management |
| Two teams disagree on technical direction | P3.7 — Cross-Team Technical Alignment |
| Assessing architectural risk | P3.8 — Architectural Risk Analysis |
| Designing an API or interface contract | P3.9 — System Interface Contracts & API Versioning |
| Choosing a database or data architecture | P3.10 — Data Architecture Decisions |
| Creating an ADR | P4.1 — ADR (Standard) or P4.2 — ADR (Lightweight) |
| Writing a technical proposal | P4.3 — RFC / Technical Proposal Template |
| Auditing architecture compliance | P4.4 — Architecture Governance Audit |
| Documenting trade-offs | P4.5 — Trade-off Matrix |
| Assessing a system's architecture health | P4.6 — System Design Assessment |
| Making a binding decision | P4.7 — Technical Decision Record |
| Rejecting a proposal | P4.8 — Proposal Rejection |
| Rejecting a proposal | P2.5.4 — Exception Management |



---

## EXPANDED ARCHITECTURE CONTENT

This section contains expanded architecture content (patterns, worked examples, templates).

Reference file: \eferences/expanded-architecture.md\ (2761 KB, 15063 lines)

