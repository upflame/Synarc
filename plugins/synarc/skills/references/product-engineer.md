---
title: "Product Engineer — Bridging Engineering Execution and Product Strategy"
type: reference
status: active
version: 3.0.0
updated: 2027-05-28
owner: synarc-core
tags:
  - product-engineering
  - product-strategy
  - feature-prioritization
  - build-vs-buy
  - technical-debt
  - experimentation
  - product-metrics
  - customer-development
  - mvp-methodology
  - product-analytics
  - rice-scoring
  - engineering-roi
---

# Purpose

Reasoning framework for engineers who bridge technical execution and product strategy — prioritization frameworks, build vs buy analysis, technical debt communication, customer development, experimentation, metrics, and product-aware technical leadership with shared ownership of outcomes.

# Scope

Engineering-product partnership model, shared ownership, technical empathy, prioritization frameworks (RICE, ICE, MoSCoW, Kano, WSJF, Value vs Effort), build vs buy vs partner analysis, technical debt quantification for business stakeholders, customer development and user interviews, experimentation and A/B testing, product metrics and analytics, MVP methodology, trade-off communication. Inherits synarc core.

# Inputs

Product requirements, business metrics, customer research, engineering estimates, market data, competitive analysis, analytics dashboards, sprint/roadmap context.

# Output

Prioritized feature recommendations with business rationale, build vs buy decisions with TCO, technical debt business cases, experiment designs with success criteria, product-aware technical specifications, trade-off communications to stakeholders.

# Key Frameworks

## P1. Prioritization Frameworks

### RICE [P3.2]
RICE Score = (Reach × Impact × Confidence) / Effort

| Component | Scale |
|---|---|
| Reach | Users affected per quarter (10 to 10,000+) |
| Impact | 0.25 (minimal) to 3 (massive) |
| Confidence | 20% (guessing) to 100% (strong data) |
| Effort | Person-weeks (design + dev + test + deploy + migration) |

### ICE [P3.3]
ICE Score = (Impact × Confidence × Ease) / 10. Faster but less rigorous. Use for growth experiments and quick wins.

### MoSCoW [P3.4]
Must Have (20-30%, critical) → Should Have (30-40%, important) → Could Have (20-30%, nice-to-have) → Won't Have (10-20%, excluded).

### Kano Model [P3.5]
Basic Needs (dissatisfiers) → Performance Features (satisfiers, linear) → Delighters (attractors). Invest in basics first. Today's delighter is tomorrow's basic expectation.

### WSJF [P3.8]
WSJF = Cost of Delay / Job Duration. Cost of Delay = Business Value + Time Criticality + Risk Reduction/Opportunity Enablement.

### Framework Selection Guide
| Context | Framework |
|---|---|
| Comparing major features | RICE or WSJF |
| Growth experiments | ICE |
| Scoping release | MoSCoW |
| Strategic categories | Kano Model |
| Quick prioritization | Value vs Effort |
| Maximizing economic value | WSJF |

## P2. Build vs Buy vs Partner [P4]

**Core question:** Is this capability core to competitive advantage (build) or context (buy)?

**Decision tree:** Core differentiator? YES → Build. NO → Mature solution exists? NO → Build/Partner. Meets 80%+ needs? YES → Buy. NO → Adapt process? YES → Buy. NO → Build/Partner.

**TCO over 3-5 years:** Build = Dev + Infra + Maintenance + Operations + Opportunity cost. Buy = Licensing + Integration + Migration + Vendor mgmt + Exit contingency. Risk adjustment: Build +20-30%, Buy +10-15%, Partner +15-25%.

## P3. Technical Debt as Product Conversation [P5.4]

**Translation framework:**
- "Code is messy" → "This module causes 40% of bugs, adds 2 weeks per feature"
- "Need to refactor" → "Investing 2 sprints restores velocity by 30%"
- "Technical debt" → "30% of engineering time spent working around old systems"

**5-step conversation:** Identify debt item → Quantify product impact → Estimate fix cost → Estimate ROI → Propose plan → Let product decide.

## P4. Customer Development [P6]

**Interview types:** Problem (before building), Solution (validate approach), Usability (test prototype).

**Interview structure:** Introduction (2-3 min) → Background (5-10 min) → Narrative exploration (15-20 min, "last time" technique) → Concept testing (10-15 min) → Wrap-up (2-3 min).

**Validation before building:** Observe and document → Assess frequency/severity → Estimate market size → Validate willingness to change → Assess existing solutions.

**MVP design:** Identify riskiest assumption → Define learning goal → Design smallest test → Define success criteria.

## P5. Experimentation & Metrics [P2.5-P2.6]

**Build-Measure-Learn loop:** BUILD smallest thing testing riskiest assumption → MEASURE instrument everything → LEARN did metric move? → Iterate pivot or persevere.

**Cost of Delay:** Three components — Revenue impact, Market impact, Learning impact. "What is the cost of delaying this by one week?"

## P6. Technical Decision-Making [P2.7]

**7-step framework:** What we know (facts) → What we believe (assumptions) → Cost of being wrong → Reversibility → What info makes it obvious → Cost to get that info → Decide.

**Type 1 (irreversible):** Primary data store, cloud provider, external API contract, core domain architecture. Require due diligence.
**Type 2 (reversible):** Frontend framework, code module structure, schema between similar options. Decide fast, correct later.

## P7. Technical Trade-off Communication [P5.2]

**Template:** Context → Option A (effort, pros in business terms, cons in business terms) → Option B → Recommendation with rationale.

**Key practice:** Never say "technically impossible." Explain cost, timeline, and trade-offs. Never dismiss without offering alternatives.

# Core Principles

- Start with the problem, not the solution
- Quantify before you qualify (express trade-offs in numbers)
- Build learning loops, not feature checklists
- Own the whole lifecycle (monitoring, metrics, iteration)
- Make the invisible visible (translate tech debt into business terms)
- Think in systems, not features
- Default to simple, then evolve
- Celebrate failed experiments that produced clear learning
