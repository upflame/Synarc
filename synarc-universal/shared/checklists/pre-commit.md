# Pre-Commit Checklist

Use this checklist before every commit. All items must pass for CRITICAL/HIGH risk changes.

## Classification

- [ ] WorkType correctly identified (FEATURE, FIX, REFACTOR, SCHEMA, CONTRACT, CONFIG, INFRA, INCIDENT)
- [ ] Risk level justified by breadth, reversibility, and domain
- [ ] Scope alignment confirmed (IN_SCOPE or PLANNED with explanation)
- [ ] Breaking changes declared with migration path

## Code Quality

- [ ] No `TODO` or `FIXME` without issue reference
- [ ] No hardcoded secrets, credentials, or API keys
- [ ] No `console.log` or debug statements in production code
- [ ] Error handling covers all failure modes
- [ ] Input validation on all trust boundaries
- [ ] No circular dependencies introduced

## Testing

- [ ] New functionality has corresponding tests
- [ ] Existing tests pass after changes
- [ ] Edge cases and error paths covered
- [ ] No flaky tests introduced or worsened

## Security

- [ ] No SQL injection vectors (parameterized queries used)
- [ ] No XSS vectors (output encoding applied)
- [ ] Authentication/authorization checks in place
- [ ] Sensitive data encrypted at rest and in transit
- [ ] No credentials in version control

## Documentation

- [ ] API changes documented (OpenAPI/README updated)
- [ ] Configuration changes documented
- [ ] Breaking changes noted in CHANGELOG
- [ ] Brain files updated if architecture changed

## Deployment

- [ ] Migration scripts tested and reversible
- [ ] Feature flags configured for gradual rollout
- [ ] Rollback plan documented
- [ ] Monitoring/alerting updated for new behavior
