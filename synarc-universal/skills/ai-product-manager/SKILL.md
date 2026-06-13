---
name: ai-product-manager
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - product-engineer: ">=2.0.0"
  - prompt-engineer: ">=1.0.0"
title: AI Product Manager — Evals as Specs, Model Tradeoffs, AI UX
description: AI product management reasoning — evals as product specifications, model selection (capability vs cost vs latency), AI UX patterns (streaming, citations, confidence display, regeneration, undo), model upgrade strategy, AI feature prioritization, AI product metrics (task completion, override rate, hallucination rate), responsible AI principles, prompt product management, AI pricing strategy. The PM discipline for AI products. Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - ai-product
  - ai-pm
  - evals-as-specs
  - model-selection
  - ai-ux
  - ai-metrics
  - model-upgrade
  - responsible-ai
  - ai-pricing
  - prompt-product
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

# AI Product Manager — Evals as Specs, Model Tradeoffs, AI UX

Inherits synarc core. All synarc prohibitions apply.

PM for AI products is a distinct discipline. Evals replace acceptance criteria. Model selection replaces vendor selection. AI UX patterns (streaming, citations, regeneration) replace traditional UI patterns. This skill covers the full AI product lifecycle: opportunity sizing, eval design, model tradeoffs, UX, metrics, pricing, and responsible AI.


## P2 — EVALS AS SPECS

### P2.1 — Why Evals Replace Acceptance Criteria

```
TRADITIONAL ACCEPTANCE CRITERIA:
  Given X, when Y, then Z
  Deterministic, testable, binary pass/fail

AI EVAL SETS:
  Given 100 representative inputs, what % produce acceptable outputs?
  Probabilistic, scored, threshold-gated
  Frozen regression set, like a unit test for a model

PM ROLE: Define what "acceptable" means before build.
  - Set quality bar: e.g., "85% of queries answer correctly with citations"
  - Define unacceptable: e.g., "0% hallucination on policy questions"
  - Convert to frozen eval set, owned by PM, run on every release
```

### P2.2 — Eval Set as PRD

```
EVAL SET PRD:
  - Use case:        "Customer support tier-1 deflection"
  - Quality bar:     >= 80% deflection rate, >= 95% accuracy
  - Eval cases:      200 real support tickets (anonymized)
  - Gold answers:    human-written, reviewed by support lead
  - Adversarial:     50 cases with jailbreaks, off-topic, hostile
  - Frozen since:    2026-01-15
  - Refresh policy:  quarterly
  - Owner:           @alice (PM), @bob (eng)
  - Pass criterion:  >= 80% on frozen set, no regression on adversarial
  - Block release if: regression > 5% on any metric
```

## P3 — MODEL SELECTION

### P3.1 — Three-Way Tradeoff

```
EVERY MODEL HAS:
  - Capability:  what tasks it can do well
  - Cost:        $ per million tokens (input/output)
  - Latency:     time to first token, total time

TRADEOFF CURVE:
  Highest capability → usually highest cost, highest latency
  Cheapest → usually least capable
  Fastest → usually least capable

SELECT BY USE CASE:
  HIGH-STAKES, LOW-VOLUME:    pick highest capability
                              (legal, medical, financial)
  HIGH-VOLUME, LOW-STAKES:    pick cheapest that meets quality bar
                              (chatbot, classification)
  LATENCY-CRITICAL:           pick fastest that meets quality bar
                              (autocomplete, voice)
  MIXED:                      use a router (cheap model first,
                              fall back to expensive)
```

### P3.2 — Model Router Pattern

```
ROUTER LOGIC:
  - Cheap model handles: simple queries, classification, short answers
  - Expensive model handles: complex reasoning, long context, ambiguity
  - Heuristic: query length, complexity, intent, user tier

EXAMPLE:
  Query: "What is 2+2?"           -> cheap model
  Query: "Compare Q3 and Q4..."   -> expensive model
  Query: "Translate to French"    -> cheap model
  Query: "Summarize this 50k..."  -> expensive model

COST IMPACT:
  A good router can reduce cost 50-80% while maintaining quality.
  Eval the router: % correct routing, cost per task, quality on each path.
```

## P4 — AI UX PATTERNS

### P4.1 — Streaming and Progress

```
STREAMING:
  - Stream tokens to UI as they generate
  - Show "thinking" or progress for tool calls
  - Display latency budget (e.g., "5s remaining")
  - Allow cancel mid-stream

PROGRESSIVE DISCLOSURE:
  - Show short answer first
  - Expand for detail on click
  - Citations collapsed by default

SKELETONS:
  - Show structure (header, bullets) before content
  - Reduces perceived latency
  - Avoids layout shift
```

### P4.2 — Citations and Trust

```
CITATIONS:
  - Every factual claim cites a source
  - Citations are clickable, show the source
  - Source label: "from your docs" vs "from the web" — different trust
  - Hover preview of the cited chunk
  - "I don't know" rather than fabricated answer

CONFIDENCE:
  - When model is uncertain, say so
  - "I'm 80% confident in this answer"
  - Suggest verification for high-stakes decisions
  - Provide a path to escalate to a human

UNDO AND REGENERATE:
  - Every AI action should be undoable
  - "Regenerate" for new attempt
  - Show diff between attempts
  - Allow user to provide feedback ("this is wrong because...")
```

### P4.3 — Failure UX

```
WHEN THE AI FAILS:
  - Apologize briefly, do not over-apologize
  - Explain what went wrong in user terms
  - Offer next steps: retry, rephrase, escalate, or human handoff
  - Learn from the failure: capture feedback, retrain, improve

WHEN THE AI IS UNCERTAIN:
  - Show confidence
  - Provide options ("here are 3 possible answers")
  - Allow user to pick or correct

WHEN THE USER IS WRONG:
  - Do not just agree (sycophancy)
  - Politely correct with reasoning
  - Provide source or evidence
  - Let user override
```

## P5 — AI PRODUCT METRICS

### P5.1 — North Star & Inputs

```
NORTH STAR (AI-specific examples):
  - Chatbot:    successful conversations per user per week
  - Search:     queries leading to a click within 30s
  - Code:       code suggestions accepted and kept after 7 days
  - Support:    tickets deflected that didn't return within 7 days

INPUTS (leading indicators):
  - Activation rate (% of users who try AI feature in week 1)
  - Engagement rate (queries per active user)
  - Retention (weekly active users, 4-week and 8-week)
  - Task completion rate
  - Override rate (how often user changes AI output)
  - Hallucination rate (from sampled evals)
  - Latency p50/p95
  - Cost per query
```

### P5.2 — Quality Metrics

```
EVAL-DRIVEN METRICS (run on sampled production):
  - Accuracy:        % correct on sampled outputs
  - Faithfulness:    % claims supported by retrieved context
  - Citation rate:   % of claims with valid citations
  - Refusal rate:    % refused (legitimate + illegitimate)
  - Format conformance: % matching expected schema
  - Hallucination:   % unsupported claims

USER-FEEDBACK METRICS:
  - Thumbs up/down per response
  - Regenerate rate (proxy for dissatisfaction)
  - Override rate (proxy for "AI was wrong")
  - NPS for AI feature

BUSINESS METRICS:
  - Cost per task
  - Revenue per task
  - Time saved (estimated via A/B)
  - Support deflection rate
  - Conversion rate (AI-assisted vs not)
```

### P5.3 — Reading Metrics Together

```
METRIC PATTERNS:
  HIGH USAGE + HIGH OVERRIDE:        AI is wrong or unhelpful, users retrying
  HIGH USAGE + HIGH THUMBS UP:      healthy, expanding
  HIGH HALLUCINATION + HIGH USAGE:  quality crisis, ship gate
  LOW COST + LOW QUALITY:           cost optimization won
  HIGH COST + HIGH QUALITY:         acceptable, monitor
  HIGH COST + LOW QUALITY:          urgent: switch model or fix

DASHBOARDS:
  - Daily: usage, cost, latency
  - Weekly: quality metrics on sampled production
  - Per-release: frozen eval set results
  - Monthly: business metrics, A/B results
```

## P6 — MODEL UPGRADES

### P6.1 — Upgrade Strategy

```
UPGRADE TYPES:
  - Same model, new version (e.g., model-v4 → model-v4.1)
  - Different model, same capability tier (e.g., model-v4 → model-sonnet)
  - Different model, different capability tier (capability jump)

UPGRADE PROCESS:
  1. Read release notes, identify behavioral changes
  2. Re-run frozen eval set on candidate model
  3. Run A/B on production traffic (10% canary)
  4. Compare: quality, cost, latency, user feedback
  5. Promote if: quality >= baseline, cost acceptable, no regression
  6. Roll back if: regression detected, no auto-promote

WHEN TO UPGRADE:
  - Significant capability gain for same cost
  - Cost reduction for same quality
  - Critical bug fixed
  - Compliance / safety improvement

WHEN NOT TO UPGRADE:
  - Marginal gain, high migration cost
  - New model has regressions on your eval set
  - Cost increase without proportional value
```

## P7 — AI PRICING

### P7.1 — Pricing Models

```
PER-SEAT:
  - $X/user/month
  - Simple, predictable for buyer
  - Risk: heavy users cost more, light users pay too much
  - Best for: AI assistant, productivity tools

PER-QUERY / PER-TOKEN:
  - $Y per 1k tokens
  - Aligned with cost
  - Risk: unpredictable for buyer
  - Best for: API, B2B integration

PER-OUTCOME:
  - $Z per successful task
  - Aligned with value
  - Risk: defining "success"
  - Best for: high-value tasks (lead enrichment, code migration)

PER-FEATURE:
  - AI feature included in tier
  - Predictable, easy to bundle
  - Risk: overage, fair use
  - Best for: SaaS with AI add-ons
```

### P7.2 — Pricing Decisions

```
QUESTIONS:
  - What is the cost per task?
  - What is the value per task to the user?
  - What is the willingness to pay?
  - What does the competitive landscape charge?
  - How does price scale with usage?

PRICING RECOMMENDATION:
  - Price at 10-30% of value created
  - If cost > price, redesign (cheaper model, smaller context)
  - Offer a free tier with limits
  - Charge for scale, not for access
```

## P8 — RESPONSIBLE AI PRINCIPLES

```
P1: TRANSPARENCY
  Users know they are talking to an AI.
  Disclose AI in UI, in legal terms, in marketing.

P2: FAIRNESS
  Evaluate for bias across demographics.
  Test on diverse inputs, not just average case.
  Have a process to handle bias findings.

P3: PRIVACY
  Don't train on user data without consent.
  Allow users to delete their data.
  Disclose data handling.

P4: SAFETY
  Refuse harmful requests.
  Have guardrails, not just policies.
  Incident response plan in place.

P5: ACCOUNTABILITY
  A human is accountable for the AI's actions.
  Audit trail exists.
  User can appeal, escalate, get human review.

P6: RELIABILITY
  Eval set in CI.
  Performance monitoring in production.
  Incident response for regressions.
```

## P9 — OUTPUT FORMATS

### P9.1 — AI Feature PRD

```
FEATURE:         [name]
PROBLEM:         [user pain, with evidence]
USERS:           [persona]
SUCCESS METRIC:  [north star + quality bar]
EVAL SET:        [frozen set, pass criterion]
MODEL:           [selected model + rationale, fallback]
UX:              [streaming, citations, undo, failure modes]
COST:            [per task, per user, monthly estimate]
LATENCY:         [p50, p95 budget]
SAFETY:          [harm categories, guardrails, eval]
COMPLIANCE:      [EU AI Act risk tier, NIST AI RMF mapping]
PRICING:         [model, break-even]
LAUNCH:          [canary %, promotion criteria, rollback plan]
```

### P9.2 — Model Selection Memo

```
USE CASE:        [task, scale, latency]
OPTIONS:         [model A, model B, model C]
EVAL:            [frozen set, A: 92%, B: 89%, C: 78%]
COST:            [A: $X/1k tok, B: $Y/1k tok, C: $Z/1k tok]
LATENCY:         [A: 800ms, B: 400ms, C: 200ms]
RECOMMENDATION:  [model, why]
ROUTER RULE:     [if X, use cheap; if Y, use expensive]
RISK:            [regression on upgrade, cost spike, edge cases]
```

## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Ship AI feature without eval set | No quality bar, no regression detection | Frozen eval set, owned by PM, run on every release |
| Treat model like a vendor with deterministic behavior | It's probabilistic, behavior shifts | Continuous eval, version pinning, A/B on upgrade |
| "Just use model-v4" | Often wrong: cost/latency overkill for simple tasks | Match model to use case, use router for mixed |
| Hide AI behind the scenes | Trust violation, regulatory risk | Disclose AI in UI, terms, marketing |
| No override path | User cannot correct AI mistakes | Every AI action must be undoable, regenerable, or escalate-able |
| Optimize one metric to death | Other metrics degrade | Watch a balanced dashboard, segment by user type |
| Skip red-team / adversarial eval | Ship blind to attacks | Adversarial cases in every release eval |
| Price per token without thinking about value | Unpredictable for buyer, low margin | Price on outcome or tier, with usage limits |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every model change, eval set update, or pricing change.*

*Escalate to ai-safety-eval-engineer when: feature is user-facing, handles PII, or in regulated domain. Escalate to engineering-manager when: AI feature requires team scaling.*
