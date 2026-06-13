---
workflow: verification-engine
version: 1.0.0
description: Post-execution verification protocol — compare actual outcomes against committed Intent Contract
---

# Verification Engine Workflow

## Purpose

After execution completes, verify every promise made in the Intent Contract. Compare actual changes against committed scope, verify each promise against its declared method, assess actual risk vs contract risk cap, and produce a deterministic verdict.

## Trigger Conditions

WHEN:
- execution completes (all promised mutations applied)
- contract amendment supersedes an existing contract
- user explicitly requests verification
- session ends with pending fulfillment

THEN:
Activate Verification Engine workflow

## Required Inputs

- Active Intent Contract (from S1.5)
- Session ledger entries (from S3)
- Current file state (post-execution)

## Workflow

### Step 1: Scope Verification

Compare committed scope against actual changes:

| Check | Method | Pass | Fail |
|-------|--------|------|------|
| Files in scope were changed | Diff inspection | All scope files changed (or valid reason not to) | Scope files missed |
| Files out of scope were NOT changed | Diff inspection | No out-of-scope changes | Out-of-scope files found |
| Contract boundaries respected | Diff inspection | No contract/schema/destructive violations | Boundaries crossed |

**Scope verdicts:**
- **PASS**: All changes within committed scope. No unintended files.
- **WARN**: Minor scope expansion (1-2 files, LOW risk). Flag UNPLANNED.
- **BREACH**: Significant scope violations (3+ files, HIGH+ risk, or boundary crossed). Requires user review.

### Step 2: Promise Verification

For each promise in the contract, execute the declared verification method:

```
Promise 1: Add rate limiting to login endpoint → verify: test_passes on test/rate-limit.test.ts
  → EXECUTE: npm test -- test/rate-limit.test.ts
  → RESULT: exit 0 (PASS)
  → STATUS: kept
```

| Method | Execution | Pass Signal |
|--------|-----------|-------------|
| test_exists | Check file existence | File found on disk |
| test_passes | Run test file/suite | Exit code 0 |
| type_check | Run type checker on changed files | No new type errors |
| lint_pass | Run linter on changed files | No new lint violations |
| compiles | Build the project | Build succeeds |
| diff_inspection | Review diff against scope | No scope violations |
| contract_test | Run contract test suite | All contract tests pass |
| migration_test | Run migration up + down | Both succeed, schema reverse matches |
| rollback_test | Execute rollback command | Clean rollback |
| manual_review | Flag for human | N/A (always passes automated gate) |

### Step 3: Risk Verification

Compare actual risk from execution against contract risk cap:

| Condition | Verdict |
|-----------|---------|
| Actual risk < contract risk cap | DE_ESCALATED — PASS |
| Actual risk = contract risk cap | NONE — PASS |
| Actual risk > contract risk cap | ESCALATED — BREACH |

When risk is ESCALATED:
1. Document what caused the escalation (scope creep, unplanned complexity, cascading changes)
2. Surface to user: "Risk exceeded contract cap: MEDIUM → HIGH. Reason: [details]."
3. Require user acknowledgment before continuing

### Step 4: Composite Verdict

| Scope | Promises | Risk | Overall | Action |
|-------|----------|------|---------|--------|
| PASS | All kept | NONE | **PASS** | Proceed. Close contract as fulfilled. |
| PASS | All kept | DE_ESCALATED | **PASS** | Proceed. Note reduced risk in ledger. |
| WARN | All kept | NONE | **WARN** | Proceed with note. Flag scope expansion. |
| WARN | Any broken | ANY | **BREACH** | Pause. User review required. |
| BREACH | ANY | ANY | **BREACH** | Stop. Full review. Possible rollback. |
| ANY | ANY | ESCALATED | **BREACH** | Pause. Risk cap exceeded. |
| ANY | Major broken | ANY | **FAIL** | Rollback recommended. |

### Step 5: Emit Verification Report

```
VERIFICATION: CTR-XXXXXXXX
  SCOPE: PASS (3/3 files in scope, 0 out of scope)
  PROMISES: 4/4 kept
  RISK: MEDIUM (cap: MEDIUM, delta: NONE)
  VERDICT: PASS
  RECOMMENDATION: Proceed with fulfillment
```

### Step 6: Handle Verdicts

**PASS**: Close contract as fulfilled. Archive verification result. Update session state.

**WARN**: Close contract as fulfilled. Log warning in session ledger. Flag for user review.

**BREACH**: Do NOT close contract. Surface breach report to user. Options:
- User acknowledges breach → amend contract, continue
- User rejects breach → invoke rollback-to-intent
- User overrides → log override, continue with escalated risk

**FAIL**: Do NOT close contract. Invoke rollback-to-intent immediately. Schedule post-mortem.

## Validation

- Every promise has a verification result
- Scope verification covers all committed files
- Risk verification produces a deterministic delta
- Composite verdict follows the decision matrix

## Failure Handling

- Test file missing → verify: test_exists fails → broken promise
- Test runner not available → fall back to manual_review
- Type checker not installed → skip with note, mark as skipped
- File deleted during execution → verify: file existence → scope breach

## Quality Checklist

- [ ] Scope verified against contract
- [ ] Every promise verified by method
- [ ] Risk delta computed
- [ ] Composite verdict determined
- [ ] Report emitted
- [ ] Breach protocol followed if needed

## Security Checklist

- [ ] Verification results cannot be tampered with after recording
- [ ] Rollback recommendation follows deterministic rules
- [ ] User override of BREACH is logged as governance event
