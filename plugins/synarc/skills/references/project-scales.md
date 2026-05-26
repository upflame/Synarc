---
title: Project Scales
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - scales
  - universal
  - adaptive
  - cognition-layer
---

# Purpose

Adapt cognition layer depth, outputs, and tracking to every project size — from a single script to a multi-repo enterprise platform.

# Scope

All project scales (NANO, MICRO, SMALL, MEDIUM, LARGE, ENTERPRISE) with detection signals, brain outputs, injection levels, and behavioral adaptations.

# Inputs

File count, directory structure, dependency graph, service count, team size signals.

# Output

Scale classification, brain output requirements, injection level, agent behavior settings.

# Notes

Scale auto-detects from context. Scale can change — transition when signals fire. When uncertain, bias toward lower scale.

# Scale Definitions

## NANO — Single File or Script

**Profile:** One file, one purpose, no framework, no team.

**Cognition behavior:**
- WorkType always classified
- Inline footer suppressed for LOW/INFO risk
- Brain output: none (no /brain/ dir)
- Docs generated: none unless asked
- Snapshot: only for INCIDENT or CRITICAL
- Ledger: internal only, not persisted
- Injection: SILENT only

## MICRO — Small Project, Clear Scope

**Profile:** 2-10 files, one clear purpose, no team coordination.

**Cognition behavior:**
- WorkType + risk always classified
- Inline footer: shown for MEDIUM+ risk
- Brain output: CURRENT_STATE.md on first full scan
- Docs: CURRENT_STATE.md only; others on request
- Snapshot: on significant FEATURE or FIX
- Ledger: track, emit on request
- Injection: SILENT always; COMPACT for external tools

## SMALL — Solo or Pair Project, Real Product

**Profile:** <5k LOC, 1-5 modules, single developer or small team.

**Cognition behavior:**
- Full WorkType + risk + PLANNED/UNPLANNED
- Inline footer: always shown
- Brain output: CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md
- Docs: generate on first scan; update on significant changes
- Snapshot: per feature, per significant fix
- Ledger: track + persist to CHANGELOG_INTELLIGENCE.md
- Analysis log: full protocol on every FIX
- Injection: SILENT always; STANDARD at session start

## MEDIUM — Team Product, Multiple Modules

**Profile:** 5k-50k LOC, 3-10 modules, team of 2-10.

**Cognition behavior:**
- Full classification on every interaction
- Inline footer: always
- Brain output: full brain directory (all 7 files + snapshots)
- Snapshot: per PR or per significant session
- Session state: fully tracked + persisted
- Deployment sequence: always for SCHEMA/CONTRACT/CONFIG
- Analysis log: full protocol + recurrence detection
- Injection: STANDARD at session start; COMPACT for external tools

## LARGE — Multi-Service or Monorepo

**Profile:** 50k-500k LOC, multiple services/packages, multiple teams.

**Cognition behavior:**
- Full classification + cross-service impact always
- Brain output: MEDIUM brain + ARCHITECTURE.md, INCIDENT_SNAPSHOT.md
- Snapshot: per feature, per incident, per architectural change
- Cross-service contract tracking: active
- Deployment sequence: always for SCHEMA/CONTRACT/CONFIG/INFRA
- Injection: FULL at session start; COMPACT for tools

## ENTERPRISE — Org-Wide, Regulated, Multi-Repo

**Profile:** >500k LOC, multi-repo/org, regulated industry.

**Cognition behavior:**
- Everything in LARGE, plus:
- Compliance risk flags (HIPAA/SOC2/GDPR when detectable)
- Always check: does this change touch regulated data?
- Audit trail: every SCHEMA/CONTRACT/CONFIG/INFRA explicitly logged
- Breaking change gate: never approve CRITICAL+IRREVERSIBLE without migration plan
- Injection: FULL always
- Snapshots: mandatory per PR
- Extra risk flags auto-injected: `[PII]`, `[PHI]`, `[PAYMENT]`, `[AUTH_CRITICAL]`, `[AUDIT_REQUIRED]`

# Universal Rules (All Scales)

1. WorkType always classified — no exception
2. Risk always assessed — no exception
3. Breaking changes always named — no exception
4. UNPLANNED changes always flagged — no exception
5. Invented context always prohibited — no exception
6. Cognitive summary always dense — no exception
7. INCIDENT always overrides — all INCIDENT work is CRITICAL

# Scale-to-Depth Matrix

| Feature | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| WorkType classification | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Risk assessment | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Inline footer | opt | ✓ | ✓ | ✓ | ✓ | ✓ |
| CURRENT_STATE.md | — | req | ✓ | ✓ | ✓ | ✓ |
| MODULE_MAP.md | — | — | ✓ | ✓ | ✓ | ✓ |
| API_CONTRACTS.md | — | — | ✓ | ✓ | ✓ | ✓ |
| SYSTEM_MAP.md | — | — | — | ✓ | ✓ | ✓ |
| ARCHITECTURE.md | — | — | — | opt | ✓ | ✓ |
| FEATURE_LOG.md | — | — | opt | ✓ | ✓ | ✓ |
| CHANGELOG_INTELLIGENCE.md | — | — | ✓ | ✓ | ✓ | ✓ |
| ANALYSIS_LOG.md | — | — | ✓ | ✓ | ✓ | ✓ |
| INCIDENT_SNAPSHOT.md | — | — | — | opt | ✓ | ✓ |
| Deployment sequence | — | — | opt | ✓ | ✓ | ✓ |
| Cross-service impact | — | — | — | ✓ | ✓ | ✓ |
| Compliance flags | — | — | — | — | opt | ✓ |
| Brain snapshots | opt | opt | ✓ | ✓ | ✓ | ✓ |
| Session state persistence | — | — | ✓ | ✓ | ✓ | ✓ |

Legend: ✓ = always, opt = when relevant, — = not needed, req = on first scan

# Agent Behavior Per Scale

| Behavior | NANO | MICRO | SMALL | MEDIUM | LARGE | ENTERPRISE |
|---|---|---|---|---|---|---|
| Tool call tracking | writes only | writes + mutations | full | full + contract | full + cross-svc | full + audit |
| Checkpoint | none | 3+ writes | 5 calls or HIGH | 5 calls/HIGH/schema | 3 calls on HIGH+ | every action on CRITICAL |
| Scope enforcement | file | file+dir | module | strict module | service boundaries | strict + compliance |
| Pre-write check | always | always | always + contract | full protocol | full + compliance | full + audit |
| Injection | SILENT | SILENT | STANDARD | STANDARD | FULL | FULL |
| Handoff | comment | compact | full block | full + brain update | full + deploy plan | full + compliance |

# Scale Detection

When uncertain: bias toward the lower scale.

## Signals

| Signal | Weight | Points Toward |
|---|---|---|
| File count: 1 | 3 | NANO |
| File count: 2-10 | 3 | MICRO |
| File count: 11-100 | 3 | SMALL |
| File count: 101-1000 | 3 | MEDIUM |
| File count: 1001-10000 | 3 | LARGE |
| File count: 10001+ | 3 | ENTERPRISE |
| Module count: 1 | 4 | NANO |
| Module count: 2-5 | 4 | SMALL |
| Module count: 6-15 | 4 | MEDIUM |
| Module count: 16-50 | 4 | LARGE |
| Module count: 51+ | 4 | ENTERPRISE |
| package.json present | 3 | SMALL+ |
| nx.json/turborepo.json | 3 | LARGE |
| k8s/ directory | 3 | LARGE+ |
| services/ directory | 3 | MEDIUM+ |
| "monorepo" detected | 3 | LARGE |
| "enterprise"/"platform" | 3 | ENTERPRISE |
| Compliance keyword (HIPAA/SOC2/PCI/GDPR/SOX/regulated/audit) | 5 | ENTERPRISE (overrides all) |

Algorithm: collect all signals, weight each, highest weighted score wins. If tie: prefer lower scale. Override: any compliance signal → ENTERPRISE.

# Scale Transition Patterns

When to re-evaluate scale:

| Trigger | Transition | Action |
|---|---|---|
| New file count crosses threshold (e.g., 10 → 11 files) | MICRO → SMALL | Generate CURRENT_STATE.md on next scan |
| Second service directory created | SMALL → MEDIUM | Generate full brain directory |
| Monorepo tool discovered (nx.json detected) | MEDIUM → LARGE | Enable cross-service contract tracking |
| Compliance keyword first detected (e.g., "SOC2" in a ticket) | any → ENTERPRISE | Enable audit trail + compliance flags |

Transitions are one-way for the session. Re-evaluate on session start.
