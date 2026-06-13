---
workflow: intent-contracts
version: 1.0.0
description: Intent Contract lifecycle — propose, accept, execute, verify, fulfill
---

# Intent Contract Workflow

## Purpose

Formalize the agent's commitment before executing any change. An Intent Contract captures what will be done, what risk is accepted, which files are in scope (and out), and how each promise will be verified. Post-execution, the contract is checked against reality — did the agent keep its promises?

## Trigger Conditions

WHEN:
- a change is classified (always runs after S1 classification)
- scope expands mid-task
- risk level changes
- user requests a contract review

THEN:
Activate Intent Contract workflow

## Required Inputs

- Change classification (WorkType + sub-type)
- Declared scope (files, modules)
- Risk assessment (level, domain floors)
- Session ID

## Workflow

### Step 1: Propose Contract

Before the first mutation, propose an Intent Contract. Emit the proposal in compact format:

```
CONTRACT: CTR-A3B2C1D8
  TYPE: FEATURE:PLANNED
  SCOPE: src/auth/router.ts, src/auth/middleware.ts
  MODULES: auth
  RISK CAP: MEDIUM
  PROMISES:
    1. Add rate limiting to login endpoint → verify: test_passes on test/rate-limit.test.ts
    2. Add JWT refresh token support → verify: test_passes on test/jwt-refresh.test.ts
    3. No schema changes → verify: diff_inspection
  STATUS: proposed
```

### Step 2: Accept Contract (Automatic)

If risk ≤ user expectation and scope is clear, auto-accept. If risk cap is exceeded or scope is ambiguous, surface for confirmation.

Auto-accept criteria:
- Risk cap ≤ MEDIUM
- All promises have a verification method
- No UNPLANNED scope detected
- No domain hard floors exceeded

When auto-accepted:
```
CONTRACT ACCEPTED: CTR-A3B2C1D8
  STATUS: active
```

When confirmation needed:
```
CONTRACT REQUIRES CONFIRMATION: CTR-A3B2C1D8
  Reason: [risk cap HIGH / scope ambiguous / UNPLANNED scope]
  Accept? (yes/no/modify)
```

### Step 3: Execute Within Contract

All execution must stay within the contract scope:

- Every tool call is checked against `scope.files` and `scope.modules`
- If a change touches a file not in scope → flag as UNPLANNED
- If UNPLANNED scope accumulates → pause, propose contract amendment (new contract with `supersedes`)
- If risk exceeds `risk_cap` → pause, escalate
- If `destructive_ops_allowed` is false and destructive op is needed → pause, require new contract

### Step 4: Verify Promises

After execution completes, verify every promise:

| Promise Type | Verification Method | Pass Criteria |
|---|---|---|
| test_exists | Check file exists | File found |
| test_passes | Run the test | Exit code 0 |
| type_check | Run type checker | No new errors |
| lint_pass | Run linter on changed files | No new violations |
| compiles | Build the project | Build succeeds |
| diff_inspection | Review diff against committed scope | No scope violations |
| contract_test | Run contract tests | All passing |
| migration_test | Run migration up/down | Both succeed, schema matches |
| rollback_test | Execute rollback | Rollback succeeds cleanly |
| manual_review | Flag for human review | N/A |

### Step 5: Fulfill Contract

Emit the fulfillment report:

```
FULFILLMENT: CTR-A3B2C1D8
  FILES CHANGED: src/auth/router.ts, src/auth/middleware.ts
  FILES UNINTENDED: none
  PROMISES KEPT: 3/3
  PROMISES BROKEN: 0
  ACTUAL RISK: MEDIUM
  RISK DELTA: NONE
  VERDICT: PASS
  SUMMARY: Rate limiting and JWT refresh implemented within scope. All tests pass.
```

### Contract States

```
proposed → accepted → active → fulfilled
                              → breached
         → cancelled
active → superseded (when amended mid-task)
breached → (requires user review, possible rollback)
```

### Contract Amendment

When scope, risk, or promises change mid-execution:

1. Note current contract as `superseded`
2. Create new contract with `supersedes` pointing to old contract ID
3. The new contract inherits completed promises from the old contract
4. Only unfulfilled promises carry forward

## Validation

- Every mutation has an active contract
- All promises have verification results
- Unintended files are flagged
- Risk deltas are surfaced
- Breached contracts require user review

## Failure Handling

- Scope violation → flag UNPLANNED, amend or pause
- Risk exceeded → pause, escalate, re-contract
- Promise broken → document in fulfillment, flag verdict as WARN or BREACH
- Verification fails → retry once, then document as broken

## Quality Checklist

- [ ] Contract proposed before first mutation
- [ ] Risk cap not exceeded
- [ ] All promises verified
- [ ] No unintended files
- [ ] Fulfillment report emitted

## Security Checklist

- [ ] Contract scope cannot be bypassed by user instruction
- [ ] Destructive ops require explicit opt-in
- [ ] Risk cap is a hard boundary — never exceeded without new contract
- [ ] Breached contracts are immutable (append-only ledger)

## Performance Checklist

- [ ] Contract proposal < 20 tokens
- [ ] Contract fulfillment < 30 tokens
- [ ] Verification runs in existing test infrastructure
