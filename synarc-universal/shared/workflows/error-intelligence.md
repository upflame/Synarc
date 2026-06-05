---
workflow: error-intelligence
version: 1.0.0
description: Universal error intelligence workflow — 6-step protocol, persistent error memory, pattern-based fix strategy
---

# Error Intelligence Workflow

## Purpose

Systematically resolve errors by classifying, locating, assessing, applying, verifying, and tracking. Every error becomes a permanent entry in error intelligence — past errors inform future fix strategies.

## Trigger Conditions

WHEN:
- user reports an error
- error output or stack trace is provided
- test failure occurs
- crash or exception encountered
- user asks for root cause analysis

THEN:
Activate error intelligence workflow

## Required Inputs

- Error message or stack trace
- File content where error occurred
- Context around error (recent changes, environment)
- Previous error intelligence (if available)

## Workflow

### Step 1: Classify

Classify the error along these dimensions:

| Dimension | Values |
|-----------|--------|
| Type | COMPILE, RUNTIME, LOGIC, DATA, CONFIG, DEPENDENCY, INFRA, ENV |
| Category | SYNTAX, TYPE, NULL, STATE, RACE, IO, NETWORK, RESOURCE, PERM, THIRD_PARTY |
| Reproducibility | ALWAYS, INTERMITTENT, ENVIRONMENTAL, ONE_OFF |
| Scope | LOCAL (single file), MODULE (2-5 files), SERVICE (6+), SYSTEM (cross-service) |
| Severity | COSMETIC, FUNCTIONAL, DATA_LOSS, SECURITY, OUTAGE |

### Step 2: Locate

Find the root cause using:

1. **Stack trace analysis**: Trace the call path to the source
2. **Error message pattern matching**: Match against known error patterns
3. **Blame analysis**: What changed recently (git log, session ledger)
4. **Bisect**: Binary search through changes if regression
5. **Input narrowing**: Reduce to minimal reproduction

### Step 3: Assess

Determine fix approach:

| Error Type | Fix Strategy | Priority |
|-----------|-------------|----------|
| Known pattern in error intelligence | Apply stored fix | HIGH |
| Simple bug (type, null check, off-by-one) | Direct fix | MEDIUM |
| Complex logic error | Hypothesis + test + fix cycle | MEDIUM |
| Race condition / concurrency | Requires deep analysis | HIGH |
| Third-party / dependency | Check version, config, or replace | HIGH |
| Data corruption | Data recovery first, then prevention | CRITICAL |
| Security vulnerability | Patch + advisory | CRITICAL |

### Step 4: Apply

Fix the error following the fix strategy:

1. Read affected file(s) before modification
2. Apply minimal fix (fix the root cause, not symptoms)
3. Add regression test that reproduces the error
4. Run existing tests to verify no regression

### Step 5: Verify

Confirm the fix works:

1. Run reproduction case — should pass now
2. Run existing tests for affected module(s)
3. If intermittent error: run 3x to verify stability
4. Run linting and type checking
5. If data-related: verify data integrity

### Step 6: Track

Record the error in error intelligence:

```yaml
error_id: <uuid>
timestamp: <iso-timestamp>
error_type: <type>
error_message: <message>
file: <file-path>
line: <line-number>
root_cause: <description>
fix_applied: <description>
tests_added: [<test-names>]
confidence: <0.0-1.0>
status: RESOLVED | WORKAROUND | UNRESOLVED
```

## Error Intelligence Database Format

```markdown
| Error ID | Type | File | Root Cause | Fix | Confidence | Status |
|----------|------|------|------------|-----|------------|--------|
| ERR-001 | RUNTIME:NULL | src/auth/login.ts | Missing null check on user lookup | Added optional chaining | 0.95 | RESOLVED |
```

## Validation

- Error is classified and located before fix
- Fix includes regression test
- Existing tests pass after fix
- Error is recorded in error intelligence

## Failure Handling

- Unreproducible error → document conditions, mark as INTERMITTENT
- Fix doesn't resolve error → rollback fix, document attempted approaches
- Error in production → apply hotfix first, then permanent fix
- No root cause found → document hypothesis, add monitoring

## Quality Checklist

- [ ] Error classified (type, category, reproducibility)
- [ ] Root cause located
- [ ] Fix strategy determined
- [ ] Fix applied with regression test
- [ ] Fix verified (error resolved, tests pass)
- [ ] Error tracked in intelligence database

## Security Checklist

- [ ] Error analysis does not expose sensitive data
- [ ] Fix does not introduce new vulnerabilities
- [ ] Security errors treated as CRITICAL

## Performance Checklist

- [ ] Error classification < 10 tokens
- [ ] Error intelligence entry < 50 tokens
- [ ] Known pattern match completes in < 20ms reasoning
