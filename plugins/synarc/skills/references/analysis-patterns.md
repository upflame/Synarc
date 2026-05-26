---
title: Diff Analysis Patterns
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - analysis
  - diff
  - review
  - cognition-layer
---

# Purpose

Analyze code diffs for risk, contract impact, cross-boundary effects, and classification. Used when reviewing multi-file or multi-service changes.

# Diff Dimensions

Every diff is analyzed along these axes:

| Dimension | Classification | Risk Signal |
|---|---|---|
| Scope | Single-file / Multi-file / Cross-module / Cross-service | More files = higher review cost |
| Depth | Surface / Shallow / Structural / Deep | Deeper = higher risk |
| Direction | Additive / Modifying / Deleting | Deleting = highest risk |
| Contract Impact | None / Internal / Exported / Schema | Schema = critical |
| Test Coverage | Covered / Partial / Uncovered / Unknown | Uncovered = escalate |

# Cross-Boundary Impact Detection

When a diff touches one module, check all adjacent modules:

1. Import graph — Does this change affect an exported symbol?
2. Interface contract — Does this change a type, signature, or interface?
3. Data shape — Does this change a serialized format, DB schema, or API payload?
4. Event contract — Does this change an event name, payload, or routing key?
5. Config surface — Does this change an env var, CLI flag, or config key?

# Classification by Diff Pattern

| Diff Pattern | Classification | Action |
|---|---|---|
| New file, no imports | ANALYSIS / LOW | Confirm purpose |
| New file, imports in module | FEATURE / MEDIUM | Review integration points |
| Modified body, same signature | FIX or REFACTOR / MEDIUM | Check callers for behavioral change |
| Modified signature | CONTRACT / HIGH | Update all callers, check binary compat |
| Deleted function, no replacement | CONTRACT / CRITICAL | Verify no callers remain |
| Changed import path | REFACTOR / MEDIUM | Verify new path resolves |
| Changed type definition | CONTRACT / HIGH | Check all usages |
| Deleted file | INFRA / HIGH | Check imports across repo |
| Changed config/default | CONFIG / MEDIUM | Verify all environments |
| Schema/API doc change | SCHEMA / HIGH | Verify docs match implementation |
| Test-only change | ANALYSIS / LOW | Verify test actually passes |

# Multi-File Diff Risk Scoring

For diffs spanning 3+ files, compute a composite score:

- Weight: each file gets 1-3 based on module criticality (auth=3, data=3, UI=1)
- Contracts: each contract break adds 2
- Depth: structural diff (depth 2+) doubles score for that file
- Coverage: unchanged test files subtract credibility

Threshold: score >= 8 = BLOCK, 4-7 = WARN, < 4 = PASS

# Safe-to-Merge Statement

```
SAFE TO MERGE: yes/no/conditional
- Primary risk: [level] — [one-line description]
- Contract breaks: [count] — [list]
- Uncovered code: [files changed without test changes]
- Cross-service impact: [services affected or none]
- Recommended review: [single / pair / team]
```

# Worked Example

Diff: `src/payment/processor.ts` modified (add circuit breaker), `src/payment/client.ts` new file, `src/payment/types.ts` modified (add timeout field).

1. Scope: Multi-file (CROSS_MODULE breadth)
2. Depth: Shallow for client.ts (new), Structural for processor.ts (logic restructure)
3. Direction: Additive + Modifying
4. Contract Impact: types.ts field addition = CONTRACT (exported type)
5. Test Coverage: No test files changed → UNCOVERED
6. Risk score: processor.ts=2 (payment=HIGH), client.ts=1 (new), types.ts=3 (contract break). Score = (2+1+3) + 2(contract) = 8 → BLOCK until tests added

Safe-to-merge: no — uncovered code in payment module at HIGH risk.

# Integration with Diff Tools

Parse unified diff format: file path, hunks with line ranges, added/removed/context lines. Classify each hunk independently, then aggregate to per-file and per-change risk scores.
