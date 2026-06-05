# Code Review Checklist

Use this checklist during code review for all changes.

## Correctness

- [ ] Code does what the commit message / PR description claims
- [ ] Edge cases handled (empty input, null, overflow, boundary)
- [ ] Error handling is complete and appropriate
- [ ] No unintended side effects on other modules

## Architecture

- [ ] Changes respect existing architectural boundaries
- [ ] No new cross-service dependencies without justification
- [ ] Separation of concerns maintained
- [ ] Interfaces are minimal and well-defined

## Security

- [ ] Input validation on all external inputs
- [ ] No hardcoded secrets or credentials
- [ ] Authentication/authorization checked where needed
- [ ] No SQL injection, XSS, or other injection vectors
- [ ] Sensitive data handled per data classification policy

## Performance

- [ ] No N+1 query patterns
- [ ] Database queries use appropriate indexes
- [ ] No unnecessary memory allocations in hot paths
- [ ] Caching considered where appropriate
- [ ] No blocking operations in async contexts

## Testing

- [ ] Tests cover the happy path
- [ ] Tests cover error paths
- [ ] Tests cover edge cases
- [ ] No test interdependencies
- [ ] Test names clearly describe the scenario

## Maintainability

- [ ] Code is readable without extensive comments
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] No magic numbers or unexplained constants
- [ ] Dead code removed

## Risk Assessment

- [ ] WorkType classified correctly
- [ ] Risk level justified
- [ ] Breaking changes identified
- [ ] Rollback plan exists for high-risk changes
- [ ] Deployment order considered (schema before code, etc.)
