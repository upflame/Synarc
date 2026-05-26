---
title: Synarc Cognition Layer
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - cognition-layer
  - reference
  - onboarding
  - architecture
  - always-on
---

# Purpose

Structured reasoning system that makes AI coding tools context-aware, risk-aware, and consistent. Classifies every change, tracks session state, injects relevant context into every interaction.

# Scope

The cognition layer itself: its concepts, file map, data flow, and lifecycle. Not a tutorial or general engineering reference.

# Architecture Overview

The cognition layer has five subsystems that operate on every AI tool interaction:

## S1: Change Classification (change-taxonomy.md)

Classifies every change by WorkType, Risk, Breadth, and Reversibility. Drives checkpoint frequency, injection detail, review requirements, rollback strategy.

## S2: Session Tracking (session-tracking.md)

In-memory ledger per session: task + scope, per-tool-call entries, cumulative risk aggregation, checkpoints for interruption recovery.

## S3: Context Injection (injection-protocol.md)

Injects context at four levels: FULL (~80 lines, session start), STANDARD (~30, per task), COMPACT (~6, routine tool call), SILENT (0, classification only).

## S4: Agent Execution Rules (coding-agent.md)

Per-tool-call classification, scope enforcement, checkpoint protocol, file write safety, error recovery, multi-file coordination.

## S5: Scale Adaptation (project-scales.md)

Adapts tracking depth, injection level, checkpoint frequency, and brain output requirements to project size (NANO through ENTERPRISE).

# Per-Tool-Call Flow

Classify (S1) → Inject (S3) → Execute (S4) → Log (S2) → Aggregate risk (S1) → Checkpoint (S4). Runs on every tool call.

# File Map

Every reference file serves a specific role in the cognition layer:

| File | Role | Always Loaded? |
|---|---|---|
| SKILL.md | Entry point — workflow selection, cross-references | Yes |
| change-taxonomy.md | Change classification system | Yes |
| session-tracking.md | Session ledger and state | Yes |
| injection-protocol.md | Context injection rules | Yes |
| coding-agent.md | Agent execution rules | When agent is active |
| project-scales.md | Scale-adaptive behavior | After scale detection |
| schemas.md | Document schemas for brain files | When writing brain files |
| analysis-patterns.md | Diff analysis patterns | When analyzing multi-service diffs |
| testing-strategy.md | Test requirements per WorkType | When generating tests |
| security-patterns.md | Security threat modeling | When security review needed |
| negative-prompts.md | Anti-patterns and prohibitions | When generating code |

# Lifecycle

- **Session start:** Load core files (SKILL.md + change-taxonomy.md + session-tracking.md + injection-protocol.md), detect scale → load project-scales.md, declare scope, begin ledger.
- **Per task:** Classify → Inject → Execute → Log → Checkpoint.
- **Session end:** Write CHANGELOG_INTELLIGENCE.md, summarize ledger, emit S11 footer.

# Cross-References to SKILL.md

| SKILL.md Anchor | File(s) |
|---|---|
| S1 (WorkType Classification) | change-taxonomy.md |
| S2 (Context Block / Scale / Risk Floors) | project-scales.md, security-patterns.md |
| S5 (Universal Project Handling) | project-scales.md |
| S6 (Error Intelligence) | testing-strategy.md |
| S8 (Prompt Injection) | injection-protocol.md |
| S9 (Session State) | session-tracking.md |
| S10 (Output Selector) | schemas.md, cognition-layer.md, analysis-patterns.md |
| S15 (Reference Files) | this file map |
| SCODEX | platform-adapters.md |
| SIDE | platform-adapters.md |
