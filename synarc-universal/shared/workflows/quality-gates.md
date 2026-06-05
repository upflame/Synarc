---
workflow: quality-gates
version: 1.0.0
description: Universal quality gates — per-WorkType verification requirements, zero-tolerance violations, pre-write checks
---

# Quality Gates Workflow

## Purpose

Enforce quality standards on every engineering change. Gates are deterministic — same input always produces same gate results. Zero-tolerance violations halt execution.

## Trigger Conditions

WHEN:
- change is classified (see change-classification workflow)
- before any file modification
- after any file modification
- before deployment

THEN:
Activate quality gates workflow

## Required Inputs

- Change classification (WorkType + sub-type)
- Files to be modified (pre-write) or modified (post-write)
- Project context (language, framework, test runner)

## Workflow

### Step 1: Pre-Write Checks

Before any file modification:

```
A1: Classify this specific tool call
A2: Does this touch a contract, schema, auth, or shared module?
    If yes: emit inline warning
A3: Is this within declared task scope?
    If no: flag UNPLANNED
A4: Does this action have a rollback path?
    If no + risk HIGH+: state the gap
A5: Is this destructive (delete, overwrite, migration)?
    Read current state first
A6: Will this push aggregate risk above threshold?
    If yes: checkpoint before proceeding
```

### Step 2: Per-WorkType Gate Requirements

| WorkType | Required Gates |
|----------|----------------|
| FEATURE | Unit tests, contract tests, type check, lint |
| FIX | Test for the fixed behavior, regression test |
| REFACTOR | Same tests pass before and after, no new warnings |
| SCHEMA | Migration rollback, data integrity validation |
| CONTRACT | Contract tests, consumer verification |
| CONFIG | Dry-run validation, rollback plan |
| INFRA | Plan output review, state lock check |
| INCIDENT | Root cause analysis, monitoring gap review |
| EXPERIMENT | Expiry date, cleanup plan |
| DOCS | Technical accuracy review |
| PLAN | Stakeholder review, ADR format |
| ANALYSIS | None (no code changes) |

### Step 3: Post-Write Verification

After file modification:

```
A7:  Record in session ledger
A8:  Update session state (files_touched, contracts_touched, risk)
A9:  Check auto-emit rules
A10: Breaking change introduced? STOP and surface
A11: Verify file integrity (parseable, no syntax errors)
A12: Test files exist? Run tests for changed module
```

### Step 4: Zero-Tolerance Violations

These halt execution immediately:

- No execution before classification completes
- No invented context or hallucinated information
- No missing tests on FIX changes
- No unabsorbed unplanned scope
- No production changes without rollback path
- No CRITICAL risk without full reassessment
- No breaking change without consumer notification

### Step 5: Gate Results Output

```
Gate: NAME | Result: PASS/FAIL | Details: ...
```

All gates must PASS before proceeding. Any FAIL results in a block.

## Validation

- All pre-write checks pass before execution
- All per-WorkType gates pass after execution
- Zero-tolerance violations halt at detection
- Gate results are deterministic

## Failure Handling

- Gate FAIL → stop execution, surface failure reason, offer resolution path
- Gate unavailable (test runner not found) → warn, skip gate, note in ledger
- Gate timeout → fail for that gate, proceed with available results

## Quality Checklist

- [ ] Pre-write checks executed
- [ ] Per-WorkType gates identified
- [ ] Post-write verification completed
- [ ] Zero-tolerance violations checked
- [ ] Gate results recorded in ledger

## Security Checklist

- [ ] Gate results do not reveal vulnerabilities
- [ ] Gate failures require explicit user acknowledgment

## Performance Checklist

- [ ] Pre-write checks < 20 tokens overhead
- [ ] Post-write verification < 30 tokens overhead
