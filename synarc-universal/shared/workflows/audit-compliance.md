---
workflow: audit-compliance
version: 1.0.0
description: Immutable audit trail, compliance export, rollback-to-intent protocol, and regulatory reporting
---

# Audit & Compliance Workflow

## Purpose

Maintain an immutable, exportable audit trail for every intent→execution→verification cycle. Support compliance frameworks (EU AI Act, SOC2, HIPAA, GDPR) with structured records. Provide deterministic rollback-to-intent protocol for breached or failed contracts.

## Trigger Conditions

WHEN:
- contract is fulfilled (PASS/WARN)
- contract breaches (BREACH/FAIL)
- user requests audit export
- session ends
- compliance review is scheduled

THEN:
Activate Audit & Compliance workflow

## Workflow

### Step 1: Create Audit Record

For every contract lifecycle, create an immutable audit record:

```
AUDIT: AUD-XXXXXXXXXX
  CONTRACT: CTR-XXXXXXXX
  SESSION: 20270525-a3f2
  WORK TYPE: FEATURE:PLANNED
  INTENT: "Add rate limiting to login endpoint"
  SCOPE DECLARED: src/auth/router.ts, src/auth/middleware.ts
  SCOPE ACTUAL: src/auth/router.ts, src/auth/middleware.ts
  SCOPE VIOLATIONS: none
  PROMISES: 4/4 kept
  RISK CAP: MEDIUM
  RISK ACTUAL: MEDIUM
  VERDICT: PASS
  TIMELINE:
    Classified: 2026-05-26T14:00:00Z
    Contracted: 2026-05-26T14:00:05Z
    Executed:   2026-05-26T14:03:00Z
    Verified:   2026-05-26T14:03:10Z
  COMPLIANCE: EU_AI_ACT, SOC2
```

Audit records are append-only. Corrections add a new record referencing the previous one.

### Step 2: Record Governance Events

Track all governance-relevant events during the contract lifecycle:

| Event Type | When | Required Fields |
|------------|------|-----------------|
| CONTRACT_AMENDED | Contract superseded mid-session | Old contract ID, new contract ID, reason |
| SCOPE_VIOLATION | File changed outside scope | File, violation type, severity |
| RISK_BREACH | Actual risk exceeded cap | Cap, actual, delta explanation |
| USER_OVERRIDE | User overrode a BREACH verdict | Override reason, escalated risk level |
| ROLLBACK | Rollback-to-intent invoked | Contract ID, rollback method, success/fail |
| VERDICT_ISSUED | Verification completed | Verdict, composite scores |

### Step 3: Rollback-to-Intent Protocol

When a contract receives a FAIL verdict (or BREACH with user decision to rollback):

1. **Identify rollback targets**: All files changed under the contract, in reverse chronological order
2. **Restore to pre-contract state**: Use git checkout or rollback commands
3. **Verify restoration**: Confirm files match pre-contract state (git diff is empty)
4. **Record rollback**: Create audit entry for the rollback
5. **Close contract**: Mark contract status as `cancelled`, verdict as `FAIL`
6. **Notify user**: "Rollback complete: [N] files restored to pre-contract state"

For partial rollbacks (some changes should be preserved):
1. Identify which files to keep and which to roll back
2. Roll back only out-of-scope or problematic files
3. Create a new contract for the kept changes with adjusted scope
4. Record the selective rollback in the audit trail

### Step 4: Compliance Export

Generate a compliance report for a session, contract, or time range:

**EU AI Act compliance export (high-risk AI system requirements):**
```
COMPLIANCE EXPORT: EU AI ACT
  PERIOD: 2026-05-01 to 2026-05-31
  TOTAL CONTRACTS: 47
  PASS: 41
  WARN: 4
  BREACH: 2
  FAIL: 0
  
  RISK DISTRIBUTION:
    INFO:    5  (11%)
    LOW:     8  (17%)
    MEDIUM: 18  (38%)
    HIGH:   12  (26%)
    CRITICAL: 4  (8%)
  
  SCOPE VIOLATIONS: 3 (6.4% of contracts)
  RISK BREACHES: 2 (4.3% of contracts)
  USER OVERRIDES: 1 (2.1% of contracts)
  ROLLBACKS: 0
  
  COMPLIANT: YES (all thresholds met)
```

**SOC2 / HIPAA export:**
```
COMPLIANCE EXPORT: SOC2
  CHANGE TRACEABILITY: 100% (47/47 contracts have audit records)
  SCOPE ENFORCEMENT: 93.6% (44/47 no scope violations)
  RISK GOVERNANCE: 95.7% (45/47 within risk cap)
  IMMUTABLE AUDIT: ENABLED
  VERDICT: COMPLIANT
```

### Step 5: Archive

Audit records are retained according to compliance requirements:

| Framework | Retention | Format |
|-----------|-----------|--------|
| EU AI Act | 5 years | JSON export |
| SOC2 | 2 years | JSON + PDF |
| HIPAA | 6 years | Encrypted JSON |
| GDPR | 3 years | JSON + deletion proof |

Archived records are immutable. Deletion is only permitted at end of retention period with documented approval.

## Validation

- Every contract lifecycle has an audit record
- Governance events are recorded with timestamps
- Rollback commands are tested before execution
- Compliance exports include all required fields
- Retention periods are respected

## Failure Handling

- Audit write fails → queue for retry, surface warning
- Rollback fails → document partial state, escalate to manual recovery
- Compliance export missing data → flag gaps, export partial with warnings

## Quality Checklist

- [ ] Audit record created for contract
- [ ] Governance events recorded
- [ ] Rollback procedure documented (if applicable)
- [ ] Compliance export generated (if requested)
- [ ] Records archived according to retention policy

## Security Checklist

- [ ] Audit records are append-only
- [ ] Rollback cannot be reversed (no rollback-of-rollback)
- [ ] Compliance exports exclude secrets and PII
- [ ] Deletion requires documented approval
- [ ] Audit trail covers the full intent→execution→verification chain
