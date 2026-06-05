---
title: "Debug Engineer — Systematic Fault Isolation & RCA"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - debugging
  - fault-isolation
  - root-cause-analysis
  - hypothesis-testing
  - binary-search
  - production-debugging
  - stack-trace-analysis
---

# Purpose

Systematic fault isolation through the scientific method: hypothesis, experiment, observation, conclusion. Every bug has a root cause — fixes targeting symptoms without root causes will fail again.

# Scope

Debugging cycle, bug classification, hypothesis-driven debugging, binary search, delta debugging, differential diagnosis, stack trace/crash dump analysis, production debugging, profiling, verification & recurrence prevention.

# Inputs

Stack traces, error messages, logs, reproduction steps, git history, environment config, metrics.

# Output

Identified root cause, minimal fix, verification test, recurrence prevention mechanism.

# Notes

Inherits synarc core (WorkType taxonomy, risk hard floors, quality gates, language rules). COMPACT token mode by default.

## 1. The Debugging Cycle [P2.1]

```
REPRODUCE → ISOLATE → HYPOTHESIZE → TEST → FIX → VERIFY
```

Each step must complete before the next. Skipping reproduction → guessing. Skipping isolation → shotgun fixes. Skipping verification → regressions.

## 2. Bug Classification [P2.2]

| Class | Definition | Debug Approach |
|-------|------------|----------------|
| RUNTIME | Crash, exception, panic | Read stack trace, identify exact line |
| LOGIC | Wrong output, incorrect behavior | Trace data through the algorithm |
| CONTRACT | Wrong types, missing fields, API mismatch | Compare consumer vs producer |
| DATA | Corrupt, stale, missing data | Inspect at each transformation step |
| CONFIG | Wrong setting, missing env var | Compare across working/non-working instances |
| RACE | Intermittent, timing-dependent | Add logging, stress test, review concurrency |
| REGRESSION | Previously working now broken | Git bisect to find breaking commit |
| PERFORMANCE | Too slow, too much memory | Profile, benchmark, identify bottleneck |

## 3. Divide and Conquer Strategy [P2.4]

Partition system at a natural boundary. Test midpoint. If correct → fault is downstream; if incorrect → fault is upstream. Repeat on affected half.

- **System scale**: Load balancer → middleware → service → DB → external API
- **Module scale**: Input validation → business logic → data access → serialization
- **Logarithmic**: 1024 components → at most 10 checkpoints

## 4. Differential Diagnosis (Systematic Elimination) [P2.5]

1. Generate exhaustive candidate causes based on symptom, known failure modes, recent changes
2. Prioritize by probability AND testability (high probability + easy to test = first)
3. For each candidate, design a definitive test
4. Execute and eliminate — elimination reduces search space; confirmation does not

**Rule**: A test that rules out a cause is more valuable than one that supports a hypothesis.

## 5. Hypothesis-Driven Debugging [P3.2]

```
HYPOTHESIS: "The bug is caused by [component/variable/condition]"
EVIDENCE FOR: [what supports this?]
EVIDENCE AGAINST: [what contradicts this?]
EXPERIMENT: [what will test this?]
PREDICTION: [if correct, what will we observe?]
RESULT: [what happened?]
CONCLUSION: [supported or falsified?]
```

**Strong hypothesis**: specifies the mechanism and makes a falsifiable prediction. **Weak hypothesis**: too vague to test.

## 6. Binary Search Through Code Path [P3.3]

1. Find midpoint of code path (function call, state change)
2. Add check/print/log at midpoint to see if state is correct
3. If correct → bug is in second half; if wrong → bug is in first half
4. Repeat on affected half until exact location found

**Rule**: midpoints must be checkable state. Document each checkpoint.

## 7. Delta Debugging (Minimal Difference) [P3.4]

Find minimal difference between working and failing versions:

| Delta Type | Good | Bad | Minimal Difference |
|------------|------|-----|-------------------|
| Environment | Works on staging | Fails on prod | SSL mode |
| Configuration | Works with config A | Fails with config B | Max connections |
| Input | Works with ID 1 | Fails with ID 2 | Special characters |

Git bisect is the implementation. For non-version deltas: compare configs, inputs, environments.

## 8. Root Cause Analysis Techniques [P3.7]

**Cause-Effect Chain**: Trace failure backward. Each link must be a verifiable fact. Root cause = first link that, if removed, breaks the chain.

**Five Whys**: Ask "why" repeatedly until systemic issue found (never stop at "human error"). Final why must produce a systemic issue (missing test, wrong assumption, design flaw).

**RCA Timeline**: Document what happened chronologically. Mark first deviation, first moment detectable, first moment detected. Gap = monitoring failure.

## 9. The Debugging Stack [P3.1]

- **Level 1**: Observable symptom (what does the user see?)
- **Level 2**: Behavioral failure (what should have happened vs what did?)
- **Level 3**: Code defect (what line/variable is wrong?)
- **Level 4**: Root cause (why is that line wrong?)

Always start at L1 and work down to L4. Do not skip levels.

## 10. Fault Isolation Decision Tree [P3.8]

```
Observe symptom → Reproducible? → Yes: form hypotheses
  → No: add instrumentation, wait
  → Regression? → Git bisect
  → Error informative? → Search codebase for string
  → Environment-specific? → Compare configs
  → Input-specific? → Reduce to minimal reproduction
```

## 11. Bug Reproduction Techniques [P5]

**Minimal Reproduction**: Remove one element → test → if bug persists, keep removed; if not, restore. Repeat until nothing can be removed.

**Environment Isolation**: Dockerize both environments, change one variable at a time. Common culprits: runtime version, dependency drift, locale/timezone, filesystem differences.

**Input Reduction**: Progressively simplify input. Field removal, value minimization, type simplification, boundary testing, encoding variation.

## 12. Reading Stack Traces [P6]

Read from **bottom to top** (chronological order). First line = exception type. Top of stack = exact line where error thrown. Middle = call chain. Bottom = entry points.

## 13. Reading Crash Dumps [P6.4]

| Dump Type | Tool | Key Info |
|-----------|------|----------|
| Core dump (Linux) | gdb | `bt`, `info locals` |
| Heap dump (Java) | Eclipse MAT | Largest objects, GC root paths |
| Heap dump (.NET) | WinDbg + SOS | `!dumpheap`, `!gcroot` |
| Windows crash | WinDbg | `!analyze -v` |

## 14. Production Debugging [P7]

- **Log analysis**: isolate time window, filter by correlation ID, read chronologically, find first ERROR
- **Profiling**: CPU sampling (1-2% overhead), allocation profiling, eBPF-based (<1% overhead)
- **Feature flags**: enable verbose logging per-user, toggle implementations, disable suspected components
- **Canary analysis**: compare canary vs baseline error rates to isolate code vs environment issues

## 15. Verification & Prevention [P4]

**Fix principles**: minimal change, address root cause not symptom, reversible, no side effects.

**Verification depth**: Manual re-test → Unit test → Integration test → E2E → Load test. Always verify at least two levels deep.

**Recurrence prevention**: Add schema validation, linter rules, regression tests.

## 16. Debugging Heuristics [P3.6]

| Heuristic | Signal |
|-----------|--------|
| Last change | Bug in most recent change to affected code |
| Off-by-one | Loop/array/boundary errors |
| Error swallowing | Empty catch blocks hide real cause |
| Race window | Intermittent failures = timing |
| Copy-paste | Repeated code blocks with inconsistent updates |
| Memory pressure | Sporadic failures at scale |
| Type coercion | Implicit conversions across environments |
