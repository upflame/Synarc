# Fallback Prompt: Tier 3 — Manual Workflow

When neither native nor external tools are available, provide step-by-step manual instructions.

## Template

```
The {capability_name} capability requires manual execution.

Follow these steps:
1. {step_1_with_specific_instructions}
2. {step_2_with_specific_instructions}
3. {step_3_with_specific_instructions}

Verification:
- {verification_criteria}

If manual execution is not feasible, produce structured output for human review (Tier 4).
```

## Examples

### Change Classification (manual)
```
Change classification requires manual analysis.

Follow these steps:
1. Read each changed file and determine:
   - Is this adding new functionality? → FEATURE
   - Is this fixing an error? → FIX
   - Is this restructuring without behavior change? → REFACTOR
   - Is this changing database schema? → SCHEMA
   - Is this changing API contract? → CONTRACT
   - Is this changing configuration? → CONFIG
   - Is this changing infrastructure? → INFRA

2. Assess risk based on:
   - Auth/payment/security files → HIGH minimum
   - Schema removal/rename → CRITICAL
   - Single file, low impact → LOW
   - Multiple services, breaking change → HIGH

3. Record classification in session ledger.

If analysis is not feasible, produce structured output for human review.
```

### Risk Assessment (manual)
```
Risk assessment requires manual analysis.

Follow these steps:
1. Count affected files and services
2. Check if any auth, payment, or security files are affected
3. Check if database schema is being modified
4. Check if API contracts are being changed
5. Determine reversibility (can this be reverted with git revert?)

Map to risk level:
- CRITICAL: Data loss, auth bypass, production outage
- HIGH: Contract broken, migration needed, security impact
- MEDIUM: Performance impact, subtle behavior change
- LOW: Style, naming, minor inconsistency
- INFO: Observation, no action needed
```
