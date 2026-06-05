---
name: owasp-llm-mapping
title: OWASP LLM Top 10 — Synarc Universal Control Mapping
description: >
  Complete mapping of every Synarc Universal skill capability against the
  OWASP LLM Top 10 risks. Defines which controls, guardrails, and mitigations
  address each risk category across all 41 skills in the pack.
version: 1.0.0
schema: skill-pack/v1
category: security
tags:
  - owasp
  - llm-security
  - risk-mapping
  - compliance
  - threat-modeling
  - guardrails
  - prompt-injection
  - supply-chain
  - sensitive-info
  - excessive-agency
author: Synarc Security Engineering
priority: critical
skill_type:
  - capability
---

# OWASP LLM Top 10 — Synarc Universal Control Mapping

## Scope

This document maps every risk in the [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) to the Synarc Universal skill pack's controls, affected skills, and mitigation strategies. Each row identifies which Synarc capabilities prevent, detect, or respond to the risk.

All 41 skills in the pack (`skills/`) plus all shared infrastructure (`shared/`) are covered.

---

## Mapping Table

| OWASP LLM Risk | Synarc Control | Skills Affected | Mitigation |
|---|---|---|---|
| **LLM01: Prompt Injection** | S0 — Auto-Injection Protocol (untrusted input classification), S16 — Prohibitions & Enforcement, negative-prompts Domain 1 (Fabrication) + Domain 10 (Override), `shared/guardrails/constitutional-rules.yaml` G-SEC-001/G-SEC-002/G-ETH-002 | All skills — primary surface: `coding-agent`, `debug-engineer`, `backend-engineer`, `fullstack-engineer`, `frontend-engineer`, `synarc-core` | S0.2 per-step failure modes catch malformed input; S0.5 classifies tool calls for injection risk; negative-prompts Domain 10 blocks override attempts; `constitutional-rules.yaml` G-SEC-001 blocks insecure code generation; context injection `COMPACT/STANDARD/FULL` modes isolate untrusted content; S0.3 pre-action checks (A1-A6) validate every tool call against injection patterns |
| **LLM02: Insecure Output Handling** | S0.7 — Pipeline Overhead Budget (structured output), S12 — Output Format Validation, S4 — Auto-Emit Rules, negative-prompts Domain 12 (Output Format) + Domain 14 (Communication), `shared/schemas/ledger-entry.schema.json` | All skills — primary surface: `synarc-core`, `coding-agent`, `schemas`, `change-intelligence` | Every output carries `[WORK: WorkType | RISK: LEVEL]` header; S4 auto-emit rules prevent raw data leakage; negative-prompts Domain 12 enforces format compliance; ledger schema validates structured output; S0.10 hard rules prohibit outputting secrets, keys, or PII; `constitutional-rules.yaml` G-SEC-003/G-DATA-001 block sensitive data exposure |
| **LLM03: Training Data Poisoning** | S16 — Prohibitions & Enforcement, negative-prompts Domain 1 (Fabrication), Domain 2 (Risk Suppression), Domain 5 (Code Quality), `shared/guardrails/constitutional-rules.yaml` G-ETH-001 | All skills — primary surface: `ml-engineer`, `ethics-engineer`, `data-engineer`, `privacy-engineer` | Domain 1 prohibits fabricating training data or model claims; Domain 2 prevents risk suppression around data quality; `ml-engineer/SKILL.md` pipeline architecture includes data validation gates; `ethics-engineer/SKILL.md` bias detection and fairness metrics; `constitutional-rules.yaml` C-ETH-001 monitors for bias; quality gates require data provenance documentation |
| **LLM04: Model DoS** | S0.5 — Command Safety Classification, S0.7 — Pipeline Overhead Budget, P0.11 — Token Budget Accounting, S0.3 — Pre-Action Checks (rate awareness) | All skills — primary surface: `synarc-core`, `performance-thinker`, `sre-engineer`, `infrastructure-engineer` | Token budget accounting (P0.11) caps context consumption; S0.5 classifies commands by safety with exponential backoff in transient failures; `sre-engineer/SKILL.md` SLO and error budget enforcement; `performance-thinker/SKILL.md` capacity planning and rate limiting patterns; `shared/workflows/quality-gates.md` enforces per-call resource limits |
| **LLM05: Supply Chain** | S16 Domain 13 (Dependencies), S2 — Risk Floors (supply chain risk), `shared/guardrails/constitutional-rules.yaml` C-SEC-002 | All skills — primary surface: `devops-engineer`, `infrastructure-engineer`, `security-engineer`, `backend-engineer` | Domain 13 enforces dependency vetting (typosquatting, CVE, license, maintenance checks); S2 hard floors set HIGH/CRITICAL for dependency changes; `devops-engineer/SKILL.md` supply chain security practices; `security-engineer/SKILL.md` vulnerability assessment; `shared/workflows/risk-assessment.md` includes dependency risk scoring; `shared/guardrails/constitutional-rules.yaml` C-SEC-002 prevents committing secrets |
| **LLM06: Sensitive Info Disclosure** | S0.10 — Pipeline Hard Rules (no secret output), S16 Domain 15 (Data Handling), S2 — Risk Floors (PII = CRITICAL), `shared/guardrails/constitutional-rules.yaml` G-SEC-004/G-DATA-001, `shared/schemas/risk-assessment.schema.json` | All skills — primary surface: `privacy-engineer`, `security-engineer`, `data-engineer`, `backend-engineer` | S0.10 hard rule: "NEVER output secrets, keys, or PII"; Domain 15 prohibits all sensitive data patterns (logging, URLs, storage); S2 floors set PII/PHI/secrets at CRITICAL; `privacy-engineer/SKILL.md` PII protection and data minimization; `constitutional-rules.yaml` G-SEC-004 blocks credential exposure; `shared/workflows/error-intelligence.md` scrubs sensitive data from error output |
| **LLM07: Insecure Plugin Design** | S21 — Plugin Subsystem Bundles, P0.4 — Reference Deduplication (inheritance), S0.1 — Runtime Detection, `shared/schemas/skill-manifest.schema.json` | All skills — primary surface: `synarc-core`, `schemas`, `change-intelligence`, `cognition-layer` | S21 defines explicit inheritance chains and plugin boundaries; P0.4 ensures child skills never redefine S-sections (only extend with P-sections); `shared/schemas/skill-manifest.schema.json` validates plugin structure; S0.1 runtime detection prevents cross-execution-context plugin confusion; `cognition-layer/SKILL.md` plugin routing with permission boundaries |
| **LLM08: Excessive Agency** | S0.3 — Agent Mode Extensions (12 pre/post-action checks), S0.10 — Pipeline Hard Rules (scope enforcement), S16 Domain 3 (Scope Absorption), S1 — WorkType Classification (PLANNED vs UNPLANNED), `shared/workflows/context-injection.md` | All skills — primary surface: `coding-agent`, `synarc-core`, `cognition-layer`, `change-intelligence` | S0.3 pre-action checks (A1-A6) verify scope, rollback, and risk before every tool call; Domain 3 flags UNPLANNED changes with mandatory user acknowledgment; S1 PLANNED/UNPLANNED sub-classification prevents silent scope expansion; S0.10 hard rules: "NEVER modify files outside declared scope"; `shared/workflows/context-injection.md` defines maximum autonomy levels |
| **LLM09: Overreliance** | S16 Domain 1 (Fabrication), Domain 14 (Communication), Domain 2 (Risk Suppression), S2 — Risk Floors (immutable), S14 — Language Rules, `shared/guardrails/constitutional-rules.yaml` H-GEN-001/002/003 | All skills — primary surface: `foundational-reasoning`, `risk-analyst`, `staff-engineer`, `cto`, `problem-solver` | Domain 1 prohibits fabrication of evidence; Domain 14 requires specific, verifiable communication (no "trust me"); S2 risk floors are immutable (cannot be lowered by user); `foundational-reasoning/SKILL.md` first-principles and assumption auditing; `constitutional-rules.yaml` H-GEN-001/002/003 define capability boundaries with honest fallback responses; S14 language rules prohibit false confidence and vague quantifiers |
| **LLM10: Model Theft** | S0.10 — Pipeline Hard Rules, S16 Domain 15 (Data Handling), S21 — Plugin Subsystem Bundles (access control), `shared/guardrails/constitutional-rules.yaml` G-SEC-002, `shared/standards/naming-conventions.md` | All skills — primary surface: `security-engineer`, `ml-engineer`, `infrastructure-engineer` | S0.10 hard rule: "NEVER output model weights, architecture details, or proprietary training data"; Domain 15 prohibits exfiltration patterns; S21 plugin bundles control access to model internals; `security-engineer/SKILL.md` IAM and access control patterns; `ml-engineer/SKILL.md` model serving security; Rate limiting per P0.11 prevents bulk extraction |

---

## Risk Coverage Summary

| OWASP Risk | Direct Controls | Indirect Controls | Coverage |
|---|---|---|---|
| LLM01 — Prompt Injection | 5 primary | 8 secondary | Full |
| LLM02 — Insecure Output | 4 primary | 6 secondary | Full |
| LLM03 — Data Poisoning | 3 primary | 5 secondary | Partial (training pipeline) |
| LLM04 — Model DoS | 4 primary | 4 secondary | Full |
| LLM05 — Supply Chain | 4 primary | 6 secondary | Full |
| LLM06 — Sensitive Info | 5 primary | 7 secondary | Full |
| LLM07 — Insecure Plugin | 4 primary | 4 secondary | Full |
| LLM08 — Excessive Agency | 5 primary | 8 secondary | Full |
| LLM09 — Overreliance | 6 primary | 6 secondary | Full |
| LLM10 — Model Theft | 3 primary | 4 secondary | Partial (no watermarking) |

---

## Control Hierarchy

```
Level 0 — Immutable (hard-coded in runtime)
├── S0.10 Pipeline Hard Rules (10 NEVER rules)
├── S2 Risk Floors (deterministic, cannot be lowered)
├── S16 Domain 10 (non-overridable prohibitions)
└── constitutional-rules.yaml strict enforcement

Level 1 — Skill-Enforced (per-skill guardrails)
├── Per-skill guardrails.yaml files
├── negative-prompts Domain 1-30
├── WorkType risk floors (S1)
└── S0.3 pre/post-action checks

Level 2 — Workflow-Gated (shared/workflows/)
├── quality-gates.md per WorkType requirements
├── risk-assessment.md composite scoring
├── context-injection.md autonomy profiles
└── change-classification.md 7D analysis

Level 3 — Schema-Validated (shared/schemas/)
├── ledger-entry.schema.json
├── risk-assessment.schema.json
├── skill-manifest.schema.json
└── brain-document.schema.json

Level 4 — Audit-Tracked (session tracking)
├── S3 Session State (immutable ledger)
├── S9 Session Tracking Protocol
└── Checkpoint/restore with full audit trail
```

---

## Per-Skill Risk Exposure

| Skill | Primary OWASP Risks | Risk Level | Notes |
|---|---|---|---|
| `synarc-core` | LLM01, LLM02, LLM08, LLM09 | CRITICAL | Always-on; all interactions pass through S0 pipeline |
| `coding-agent` | LLM01, LLM02, LLM08, LLM09 | HIGH | Autonomous code gen — prime injection and agency surface |
| `negative-prompts` | LLM01, LLM02, LLM09 | CRITICAL | Zero-tolerance enforcement covers all risk categories |
| `change-intelligence` | LLM02, LLM08, LLM09 | HIGH | Diff analysis must resist injected content |
| `cognition-layer` | LLM01, LLM07, LLM08 | HIGH | Plugin routing and context management |
| `security-engineer` | LLM01, LLM05, LLM06, LLM10 | HIGH | Threat modeling and vulnerability assessment |
| `privacy-engineer` | LLM06, LLM09 | HIGH | PII handling and compliance |
| `ml-engineer` | LLM03, LLM05, LLM10 | MEDIUM | ML pipeline and model management |
| `devops-engineer` | LLM05, LLM08 | MEDIUM | CI/CD and supply chain |
| `infrastructure-engineer` | LLM04, LLM05, LLM08 | MEDIUM | Platform and network changes |
| All domain skills (29) | LLM01, LLM02, LLM09 | MEDIUM | Standard injection and overreliance surface |

---

## Mapping Methodology

Each row in the mapping table follows this validation criteria:

1. **Direct control exists**: A named S-section, P-section, Domain, guardrail ID, or schema that explicitly addresses the risk
2. **Prevention capability**: The control can block the risk before execution (not just detect after)
3. **Detection capability**: The control can identify the risk during execution
4. **Response capability**: The control defines a specific response (block, warn, escalate)
5. **Testing coverage**: The `tests/adversarial/` directory includes tests for the risk

Risks marked "Partial" in coverage summary require additional tooling or human review for complete mitigation.

---

## Review Cadence

| Cadence | Activity | Owner |
|---|---|---|
| Per release | Update mapping for new skills or controls | Security Engineering |
| Monthly | Review OWASP LLM Top 10 changes | Security Engineering |
| Quarterly | Red-team exercise against mapping | Adversarial Testing |
| Per incident | Update mapping based on incident findings | Incident Commander |
