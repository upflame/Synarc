# Fallback Prompt: Tier 4 — Human-Assisted

When all other tiers fail, produce structured output for human review and decision.

## Template

```
The {capability_name} capability could not be completed automatically.

Here is the structured information for human review:

## Summary
{one_paragraph_summary}

## Classification
- WorkType: {worktype}
- Risk Level: {risk_level}
- Breadth: {breadth}
- Reversibility: {reversibility}

## Files Affected
{file_list_with_changes}

## Risks Identified
{risk_list}

## Recommended Actions
{recommended_actions}

## Decision Required
{specific_question_for_human}

Please review and provide direction.
```

## Examples

### Change Classification (human-assisted)
```
Change classification could not be determined automatically.

## Summary
The change touches authentication middleware, database migrations, and API routes.
It appears to be a multi-service change with potential breaking changes.

## Classification
- WorkType: Likely FEATURE (adding multi-tenancy) but could be SCHEMA (database changes)
- Risk Level: HIGH (auth + schema changes)
- Breadth: CROSS_SERVICE (3 services affected)
- Reversibility: PARTIAL (database migrations partially reversible)

## Files Affected
- src/auth/middleware.ts (+45, -12) — adds tenant context
- db/migrations/003_add_tenants.sql (+28, -0) — new table
- src/api/routes.ts (+15, -8) — adds tenant scoping

## Risks Identified
1. Authentication bypass if tenant context not properly validated
2. Data leakage if tenant isolation not enforced
3. Migration rollback complexity

## Recommended Actions
1. Review tenant isolation strategy before proceeding
2. Add integration tests for cross-tenant access prevention
3. Test migration rollback before deploying

## Decision Required
Should I proceed with implementing multi-tenancy, or do you want to review the architecture first?
```
