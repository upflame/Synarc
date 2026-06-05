---
title: "Architect — System Design & Trade-off Analysis"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - architect
  - system-design
  - architecture-decisions
  - adr
  - trade-off-analysis
  - quality-attributes
  - system-decomposition
  - evolutionary-architecture
  - fitness-functions
  - coupling-cohesion
  - technical-debt
  - technology-selection
  - rfc-proposals
  - architecture-governance
  - irreversibility
---

# Purpose

Execution model for architecture decisions, system decomposition, trade-off analysis, technology selection, architecture governance, and evolutionary architecture under the synarc cognition layer. Every architecture decision is evaluated for irreversibility, blast radius, and fitness-function validation.

# Scope

ADR lifecycle and review, irreversibility classification, trade-off analysis across quality attributes, system decomposition strategies (DDD, hexagonal, microservices, modular monolith, event-driven), integration pattern selection, RFC/technical proposal evaluation, coupling/cohesion analysis, evolutionary architecture with fitness functions, technical debt management, technology selection (build vs buy, OSS evaluation, vendor assessment), architecture governance (review board, exception management). Does not cover deployment infrastructure or platform-specific coding.

# Inputs

Change classification, quality attribute requirements, business constraints, team topology, existing ADRs, technology radar, fitness function results.

# Output

Classified architecture decisions with documented trade-offs, ADRs, decomposed system boundaries, selected integration patterns, RFC review outcomes, technical debt remediation plans, fitness function definitions.

---

## 1. Irreversibility Classification [P2.2]

Every architecture decision is classified before action:

| Class | Reversal Cost | Required Action |
|-------|--------------|-----------------|
| REVERSIBLE-HOURS | <1 engineer-day | Do not intervene |
| REVERSIBLE-DAYS | <1 engineer-week | Awareness only |
| REVERSIBLE-WEEKS | <1 engineer-month | Lightweight review |
| HARD-TO-REVERSE | Months/migration | Architect signs off, ADR required |
| IRREVERSIBLE | Full rewrite/data loss | Architect + CTO sign-off, ADR required |

**Reversibility test:** "If we choose A and it's wrong, what is the cost to switch to B?"

## 2. ADR Methodology [P2.1.1-P2.1.6]

ADRs capture decisions expensive to change. Lifecycle: PROPOSED → ACCEPTED → DEPRECATED → SUPERSEDED (or REJECTED). Immutable once accepted — corrections are superseding ADRs, never edits.

**When to write:** database/lang/framework choice, system boundary definition, cross-consumer contracts, pattern adoption, reversing prior ADRs, HARD-TO-REVERSE/IRREVERSIBLE decisions.

**Review criteria:** problem context without prescribed solution, ≥3 alternatives genuinely evaluated, explicit trade-offs (gain/lose/condition), positive/negative/neutral consequences, ≥1 fitness function, irreversibility class stated.

## 3. Trade-off Analysis & Quality Attributes [P2.3]

Every decision optimizes for a subset of quality attributes at the expense of others. Primary trade-off dimensions: COST vs CAPABILITY, SPEED vs QUALITY, SIMPLICITY vs FLEXIBILITY, CONSISTENCY vs AVAILABILITY, VENDOR vs BUILD.

**Trade-off Method:**
1. List all viable alternatives (min 3)
2. Identify top 3-5 quality attributes
3. Score each alternative (--, -, 0, +, ++)
4. State primary trade-off between top 2
5. Document condition where the opposite choice is correct

**Trade-off visibility rule:** For every decision, state: what we gain, what we lose, and under what conditions the opposite choice would have been correct.

## 4. System Decomposition Strategies [P3.1]

| Style | Best For | Avoid When |
|-------|----------|------------|
| Layered | Simple CRUD, early stages | Complex domain logic |
| Hexagonal (Ports & Adapters) | Complex domain, high testability | Simple CRUD |
| Event-driven | Cross-service workflows, audit | Strong consistency needs |
| Microservices | Large team, independent deploy | Small team, early-stage |
| Modular monolith | Small-medium team, unknown splits | Different scaling needs per module |

**Strangler Fig:** Extract one bounded context at a time, maintain backward compatibility, never refactor during extraction.

## 5. Coupling & Cohesion Analysis [P3.2]

| Coupling Type | Severity | Signal |
|---------------|----------|--------|
| Shared schema/database | HIGH | Services share tables |
| Synchronous call | MEDIUM | A calls B in request path |
| Event contract | MEDIUM | Pub/sub schema coordination |
| Shared code/library | MEDIUM | Version coordination |
| Semantic coupling | HIGH | Implicit data meaning sharing |

**Cohesion checklist (need ≥4 "yes"):** single responsibility, one change reason, data locality, same change frequency, independent deployment, failure isolation, team boundary.

## 6. Integration Pattern Selection [P3.3]

Both services need data simultaneously? → synchronous (REST/gRPC). No → async (queue/event). Caller needs immediate confirmation? → sync with ack. Event or state? → publish event vs expose API. Multiple consumers need different views? → CQRS. Crosses org boundaries? → REST/GraphQL with published contract.

## 7. Technology Selection [P2.4]

**Build vs Buy:** If 6+ factors point one direction, clear choice; otherwise 2-week POC.

| Factor | Build | Buy |
|--------|-------|-----|
| Core differentiator | Own IP advantage | Commoditized |
| Time to market | 6-18 months | Days to weeks |
| Cost profile | High initial, variable | Subscription, predictable |

**OSS evaluation:** community health, OSI-approved license, CVE history, dependency footprint, release cadence/LTS policy.

## 8. RFC Evaluation Gates [P3.4.2]

GATE 1 — Problem stated in outcomes (not solutions)
GATE 2 — Scope bounded to actual problem
GATE 3 — ≥3 alternatives with explicit trade-offs
GATE 4 — Evidence for claimed benefits
GATE 5 — All cost dimensions stated
GATE 6 — Failure mode with concrete fallback

## 9. Evolutionary Architecture & Fitness Functions [P3.5]

Every significant architecture decision includes ≥1 automated fitness function. Categories: structural (no circular deps), performance (p99 < 200ms), security (no secrets in code), operational (health endpoint), scalability (connection pool < 80%), cost efficiency.

**Fitness function template:** FUNCTION name, MEASURES what, THRESHOLD pass/fail, ENFORCED AT build/deploy/runtime, FREQUENCY, REMEDIATION, LINKED ADR.

## 10. Technical Debt Management [P3.6]

**Quadrant:** Intentional-Reckless (informed debt), Intentional-Prudent (strategic), Unintentional-Reckless (blind), Unintentional-Prudent (accreted).

**Severity:** CRITICAL (production incidents, remediate current sprint), HIGH (blocks 3+ features, remediate within quarter), MEDIUM (slows velocity, plan within 2 quarters), LOW (track, remediate opportunistically).

## 11. Architecture Governance [P2.5]

**Governed:** technology selection, system boundaries, data architecture, API design standards, cross-cutting concerns.
**Not governed:** implementation patterns within a service, library choices within approved families.

**Technology radar:** APPROVED, TRIAL (timeboxed), ASSESS (investigating), HOLD (do not adopt).

**Exception management:** request with rationale + duration, architect reviews, auto-expires, renewal required.
