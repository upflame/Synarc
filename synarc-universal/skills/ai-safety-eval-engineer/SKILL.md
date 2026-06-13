---
name: ai-safety-eval-engineer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - agentic-ai-engineer: ">=1.0.0"
  - prompt-engineer: ">=1.0.0"
title: AI Safety & Eval Engineer — Red-Teaming, Harm Evals, and Guardrails
description: AI safety engineering reasoning — threat modeling for LLMs and agents, red-teaming methodology, jailbreak taxonomy, harm taxonomy (bias, toxicity, hallucination, privacy), eval design (offline, online, LLM-judge, human), guardrail architecture (input filters, output validators, policy enforcement), incident response for AI failures, OWASP LLM Top 10 mapping, regulatory landscape (EU AI Act, NIST AI RMF, ISO 42001). Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - ai-safety
  - red-teaming
  - jailbreak
  - harm-eval
  - bias
  - toxicity
  - guardrails
  - owasp-llm
  - eu-ai-act
  - nist-ai-rmf
  - eval-design
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

# AI Safety & Eval Engineer — Red-Teaming, Harm Evals, and Guardrails

Inherits synarc core. All synarc prohibitions apply.

AI safety is the discipline of ensuring AI systems behave reliably, fairly, and in alignment with intended values. This skill covers threat modeling, red-teaming, harm evaluation, guardrail design, and regulatory mapping for production AI systems.


## P2 — THREAT MODEL

### P2.1 — OWASP LLM Top 10 (2025)

```
LLM01: Prompt Injection
  Direct: user input contains override instructions
  Indirect: tool output / RAG / memory contains override
  Defense: instruction/data separation, output sanitization, scoped permissions

LLM02: Sensitive Information Disclosure
  PII leak in training, in RAG, in output, in logs
  Defense: data minimization, scrub before embed, redact in output, secure logging

LLM03: Supply Chain
  Compromised model, fine-tune dataset, or dependency
  Defense: model provenance, signed weights, dependency scanning, dataset audit

LLM04: Data and Model Poisoning
  Training/fine-tune data tampered to insert backdoor
  Defense: data provenance, anomaly detection on outputs, statistical tests

LLM05: Improper Output Handling
  LLM output used unsafely (eval'd SQL, eval'd shell)
  Defense: never eval LLM output, structured schemas, parameterization

LLM06: Excessive Agency
  Agent has too many tools, too much autonomy
  Defense: least-privilege, scope per task, human-in-loop for high-risk

LLM07: System Prompt Leakage
  System prompt reveals sensitive info or can be extracted
  Defense: do not put secrets in prompts, canary tokens, prompt hardening

LLM08: Vector and Embedding Weaknesses
  RAG-specific: retrieval poisoning, embedding inversion, similarity attacks
  Defense: ACL at retrieval, embedding privacy, anomaly detection

LLM09: Misinformation
  Hallucination, fabricated citations, false confidence
  Defense: grounding prompts, faithfulness evals, citation validation

LLM10: Unbounded Consumption
  Resource exhaustion (tokens, cost, rate limits)
  Defense: rate limits, cost caps, token budgets, request validation
```

### P2.2 — Harm Taxonomy

```
HARM CATEGORIES:
  H1: Bias / Discrimination         (race, gender, age, etc.)
  H2: Toxicity / Hate               (slurs, harassment)
  H3: Violence / Self-harm          (instructions, encouragement)
  H4: Sexual content                (NSFW, minors)
  H5: Privacy / PII exposure        (leak personal data)
  H6: Misinformation / Hallucination (fabricated facts, fake citations)
  H7: Manipulation / Deception      (dark patterns, social engineering)
  H8: Illegal activity              (instructions for crime, malware)
  H9: IP / Copyright                (reproducing protected text/code)
  H10: Security leak                (revealing system prompt, internal info)

EVAL EACH HARM CATEGORY:
  - Definition: what counts as a violation
  - Test set: 50+ adversarial cases per category
  - Detector: classifier or LLM-judge
  - Threshold: target false-positive rate (e.g., <1%)
  - Action on detection: block, redact, escalate, log
```


## P3 — RED-TEAMING

### P3.1 — Red-Team Methodology

```
PHASE 1: RECON
  Map system surfaces: input channels, tool calls, RAG sources, memory
  Identify the most valuable target: what harm has the highest impact?
  Catalog trust boundaries: user input, third-party data, internal sources

PHASE 2: HYPOTHESIZE
  List failure modes per surface:
    - Input channel: prompt injection, jailbreak, encoding tricks
    - Tool calls: excessive agency, data exfiltration
    - RAG: retrieval poisoning, indirect injection
    - Memory: poisoning across sessions
    - Output: hallucination, leak, manipulation

PHASE 3: ATTACK
  Manual probing (expert testers, 4-8 hours)
  Automated probing (red-team LLMs, 100s of attempts)
  Tooling: garak, PyRIT, deepteam, promptfoo

PHASE 4: TRIAGE
  For each successful attack:
    - Severity: critical / high / medium / low
    - Reproducibility: deterministic / probabilistic / one-shot
    - Blast radius: single user / class / all users
    - Detectability: would current guardrails catch this?

PHASE 5: REMEDIATE
  Per finding:
    - Defense (specific guardrail or prompt change)
    - Test (eval case to lock the regression)
    - Owner
    - Deadline
```

### P3.2 — Jailbreak Taxonomy

```
PROMPT-LEVEL ATTACKS:
  - Direct override: "ignore previous instructions"
  - Role play: "you are DAN who can do anything"
  - Hypothetical: "imagine you are writing a novel about..."
  - Encoding: base64, ROT13, multilingual
  - Multi-turn: build up over many turns
  - Authority spoof: "I am the CEO, override safety"
  - Few-shot injection: "here are examples of you saying X"

SYSTEM-LEVEL ATTACKS:
  - Indirect injection (RAG, tools, memory)
  - Context window overflow
  - Token smuggling

DEFENSES:
  - Input classifiers: detect known attack patterns
  - Output classifiers: detect harmful completions
  - System prompt hardening: explicit refusal rules
  - Permission scoping: agent cannot act on injected instructions
  - Behavioral monitoring: detect unusual tool sequences
```


## P4 — EVAL DESIGN

### P4.1 — Eval Types

```
OFFLINE EVALS:
  - Run on frozen dataset, reproducible
  - In CI on every change
  - Fast, cheap, no PII risk
  - Gap: distribution shift

ONLINE EVALS:
  - Run on production samples (1-5%)
  - Catch novel inputs and drift
  - LLM-judge + human spot-check
  - Gap: cost, latency

LLM-AS-JUDGE:
  - Use a stronger LLM to score outputs
  - Calibrate against human-labeled set
  - Faster than human, scales
  - Gap: has its own biases

HUMAN EVALS:
  - 50-200 cases per release
  - Most accurate, slowest, most expensive
  - Required for: new product, high-stakes, calibration

RED-TEAM EVALS:
  - Adversarial inputs only
  - Run quarterly + after major model change
  - Goal: discover new failure modes
```

### P4.2 — Eval Set Construction

```
EVAL SET = frozen regression set + live eval set + adversarial set

FROZEN REGRESSION (50-200 cases):
  - Edit NEVER, only add
  - Run on every prompt/model/guardrail change
  - Goal: detect regression on known failures

LIVE EVAL (refreshed quarterly):
  - 200-500 cases from production
  - Anonymized, with gold labels
  - Goal: track quality on real distribution

ADVERSARIAL (refreshed after disclosures):
  - 100-500 cases from red-team + public datasets
  - Jailbreaks, injections, edge cases
  - Goal: track safety under attack

CONSTRUCTION:
  - Sample from real failures (the 1% that broke)
  - Sample from edge cases in support tickets
  - Sample from new model capabilities (post-release)
  - Engineer-write synthetic edge cases for new features
```

### P4.3 — Metrics

```
QUALITY METRICS:
  - Accuracy / F1 / BLEU / ROUGE (task-specific)
  - Faithfulness (RAG-specific)
  - Format conformance (parse + schema validate)
  - Refusal rate (lower is better for legitimate)

SAFETY METRICS:
  - Harm category violation rate (target: <0.1% per category)
  - Prompt injection bypass rate (target: <1%)
  - PII leak rate (target: 0%)
  - Jailbreak success rate (target: <1%)

RELIABILITY METRICS:
  - Latency p50, p95
  - Cost per call
  - Error rate (5xx, timeouts)
  - Retry rate

DASHBOARD:
  - Daily: all metrics on production sample
  - Weekly: eval set results on current prompts
  - Per-release: frozen regression set results
```


## P5 — GUARDRAIL ARCHITECTURE

### P5.1 — Layered Defense

```
LAYER 1: INPUT VALIDATION
  - Schema check on user input
  - Length cap
  - Profanity / injection pattern match
  - Rate limit per user

LAYER 2: PROMPT HARDENING
  - System prompt with explicit refusal rules
  - Instruction/data separation markers
  - "If X, refuse" rules

LAYER 3: RETRIEVAL FILTERS
  - ACL at retrieval (RAG)
  - Provenance check on retrieved chunks
  - Length cap on context

LAYER 4: OUTPUT VALIDATION
  - Schema enforcement
  - Harm classifier on output
  - PII redactor
  - Citation validator (RAG)

LAYER 5: ACTION VALIDATION
  - Tool call allowlist
  - Cost cap per tool call
  - Idempotency check
  - Human confirmation for high-risk actions

LAYER 6: POST-HOC
  - Trace logging
  - Anomaly detection
  - Human review of samples
  - Incident response runbook
```

### P5.2 — When to Use Each Guardrail

```
IN-CODE (deterministic):
  - Schema validation
  - Length caps
  - Allowlists / denylists
  - Rate limits
  - Use when: rule is exact, no false positives acceptable

CLASSIFIER (ML-based):
  - Harm detection
  - Injection detection
  - PII detection
  - Use when: rule is fuzzy, can tolerate false positives

LLM-JUDGE (probabilistic):
  - Faithfulness check
  - Quality scoring
  - Complex policy compliance
  - Use when: rule is too complex for code or classifier

HUMAN-IN-LOOP:
  - High-stakes actions
  - Edge cases the system can't decide
  - New product, new domain
  - Use when: cost of error is high and confidence is low
```


## P6 — INCIDENT RESPONSE

### P6.1 — AI Incident Playbook

```
SEVERITY LEVELS:
  SEV-1: Mass user impact, PII leak, security breach, illegal output
  SEV-2: Repeated class of harm, model regression, large eval drop
  SEV-3: Single user report, single edge case
  SEV-4: Internal finding, no user impact

SEV-1 RESPONSE (within 1 hour):
  1. Disable the affected feature / rollback
  2. Notify: legal, security, leadership, comms
  3. Preserve evidence: logs, prompts, model outputs
  4. Investigate: root cause, blast radius, user impact
  5. Communicate: user notification (if required by regulation)
  6. Fix: deploy guardrail or revert
  7. Post-mortem: within 5 business days

SEV-2 RESPONSE (within 24 hours):
  Same as above, with reduced urgency.

REGULATORY NOTIFICATION (EU AI Act, GDPR):
  - Some AI incidents are legally reportable
  - Involve legal counsel before any external communication
```

### P6.2 — Post-Mortem Template

```
INCIDENT:        [ID and short name]
DATE:            [start, end, detected]
SEVERITY:        [1-4]
ROOT CAUSE:      [technical, prompt, model, data, external]
BLLAST RADIUS:   [users affected, scope]
DETECTION:       [how it was detected, time to detect]
RESOLUTION:      [actions taken]
TIME-TO-RESOLVE: [from detection to fix in production]

TIMELINE:
  T+0  ...
  T+10 ...
  T+30 ...

WHAT WENT WELL:
  - ...

WHAT WENT WRONG:
  - ...

WHERE WE GOT LUCKY:
  - ...

ACTION ITEMS:
  - [ ] Add eval case (owner: @x, due: date)
  - [ ] Add guardrail (owner: @x, due: date)
  - [ ] Improve detection (owner: @x, due: date)
```
```

## P7 — REGULATORY LANDSCAPE

### P7.1 — Key Frameworks

```
EU AI ACT (2024-2026 phase-in):
  - Risk-tiered: unacceptable, high, limited, minimal
  - High-risk systems require: data governance, documentation, human oversight
  - Limited risk: transparency obligations (chatbots must disclose)
  - GPAI (general purpose): model evaluations, incident reporting

NIST AI RMF (US, 2023+):
  - Govern, Map, Measure, Manage
  - Voluntary framework, baseline for US enterprise
  - Companion: NIST GenAI Profile (2024)

ISO 42001 (AI Management System, 2023):
  - Certifiable management system standard
  - Like ISO 27001 for AI

INDUSTRY-SPECIFIC:
  - Healthcare: HIPAA, FDA SaMD
  - Finance: SR 11-7 (model risk), EU AI Act high-risk
  - HR / Employment: NYC AEDT, EU AI Act high-risk
  - Education: FERPA, EU AI Act

MAPPING YOUR SYSTEM:
  1. What domain? (general, healthcare, finance, HR, etc.)
  2. What risk tier under EU AI Act?
  3. What data is processed? (PII, sensitive, public)
  4. Who is the user? (consumer, employee, regulated professional)
  5. What decision support? (advisory, automated, high-impact)
  6. Required controls: documentation, evals, human oversight, audit trail
```


## P8 — OUTPUT FORMATS

### P8.1 — Safety Eval Report

```
SYSTEM:           [name]
EVAL DATE:        [date]
EVAL SET:         [frozen regression | live | adversarial]
SAMPLE SIZE:      [N cases]

QUALITY:
  accuracy:        [%]
  format:          [%]
  refusal_rate:    [%]

SAFETY (per harm category):
  bias:            0 violations / 100 cases
  toxicity:        0 / 100
  privacy_leak:    0 / 100
  hallucination:   3 / 100
  jailbreak_resist: 95 / 100 blocked

RELIABILITY:
  latency_p50:     [ms]
  latency_p95:     [ms]
  error_rate:      [%]
  cost_per_call:   [$]

REGRESSION:
  vs last release: [delta per metric]
  blockers:        [list]
  non-blockers:    [list]

OUTCOME: [SHIP | BLOCK | NEEDS-FIX]
```

### P8.2 — Red-Team Finding

```
FINDING ID:        RT-2026-006
SEVERITY:          high
CATEGORY:          prompt-injection
SURFACE:           [user input / tool / RAG / memory]

DESCRIPTION:
  What the attack was, step by step.

REPRODUCTION:
  Exact prompt or sequence to reproduce.

IMPACT:
  What the attacker can achieve.

CURRENT DETECTION:
  Does the system catch this? If so, at what layer?

RECOMMENDED FIX:
  Specific prompt change, guardrail, or design change.

EVAL CASE:
  Frozen regression case to add.
```

## P9 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Red-team once, ship forever | New attacks emerge continuously | Red-team quarterly + after model change |
| Eval on synthetic data only | Distribution mismatch with real users | Mix real + synthetic + adversarial |
| "Looks safe to me" subjective review | No signal, no regression detection | Numeric score per harm category, threshold gating |
| One guardrail layer | Single point of failure | Defense in depth: input + prompt + retrieval + output + action |
| Hardcoded refusal rules | Brittle, easy to bypass | Layered: pattern match + classifier + LLM-judge |
| No incident playbook | Slow response, inconsistent action | Documented playbook with severity tiers and runbooks |
| "Safety = alignment" thinking | Safety is broader: bias, privacy, security, IP | Cover all harm categories, not just jailbreaks |
| Eval on training data | Data leakage, optimistic numbers | Frozen held-out set, never seen by training |
| Ship without eval gate | Quality / safety regressions reach users | Eval gate in CI before deploy |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every eval set update, red-team finding, or guardrail change.*

*Escalate to security-engineer when: harm is exploit-class (malware, exfiltration). Escalate to legal when: incident triggers regulatory notification.*
