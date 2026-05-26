---
title: Testing Strategy & Patterns
type: reference
status: active
version: 4.0.0
updated: 2027-05-25
owner: synarc-core
tags:
  - testing
  - quality
  - coverage
  - test-patterns
  - automation
---

# Testing Strategy & Patterns

## Purpose
I define testing expectations, patterns, and risk-based coverage requirements for every change type and project scale. Tests validate correctness, catch regressions, and encode system behavior as executable documentation.

## Scope
Test pyramid design, per-change-type test requirements, test double strategy, flaky test remediation, contract testing, property-based testing, performance testing, test data management, CI/CD test integration. Does not cover framework-specific test setup (covered in coding-agent.md per-framework rules).

## Inputs
Change classification (WorkType, risk, scale), module criticality, existing test coverage, failure history.

## Output
Test requirements per change, coverage targets, test type selection, risk-based test priority, flaky test remediation plan.

## Schema
Numbered sections covering the test strategy lifecycle from classification through reporting.

## Notes
Test requirements scale with risk — a LOW-risk ANALYSIS change needs less verification than a HIGH-risk CONTRACT change. These rules are additive to any project-specific test conventions.

---

## 1. Test Pyramid by Change Risk

| Change Risk | Required Test Types | Coverage Target | Max Execution Time |
|---|---|---|---|
| CRITICAL | Contract + Integration + Unit + E2E (critical path only) | 95% changed code | 30 min full suite |
| HIGH | Integration + Unit + Contract (if API changes) | 90% changed code | 15 min full suite |
| MEDIUM | Unit + Integration (for I/O modules) | 80% changed code | 5 min full suite |
| LOW | Unit tests for new logic only | 60% changed code | 2 min full suite |
| INFO | None required | No minimum | N/A |

## 2. Test Type Selection Guide

For each change, I select the minimum viable test types:

| Test Type | Catches | Cost | When Required |
|---|---|---|---|
| Unit | Logic errors, edge cases, null/error paths | Low — millisecond execution | Every change with new or modified logic |
| Integration | Contract mismatches, I/O errors, config issues | Medium — seconds per test | Any change touching I/O boundaries (DB, API, file system, network) |
| Contract | Consumer-side breakage, schema drift, API incompatibility | Medium — needs consumer contract | Any change to public API, schema, or event format |
| E2E | Cross-service coordination failures, deployment order bugs | High — minutes per scenario | CRITICAL risk changes, INCIDENT fixes, cross-service changes |
| Property-based | Edge cases the developer didn't think of | Medium — many iterations | Complex data transformations, parsers, validation logic |
| Snapshot | Accidental UI/API output changes | Low — visual diff | UI components, API response formats, generated output |
| Performance | Regression in latency or throughput | High — needs isolated environment | Any change in hot path, database query, or caching layer |
| Security | Auth bypass, injection, data exposure | High — needs security tooling | Auth, payments, PII, secrets, RBAC changes |

## 3. Test Double Strategy

| Double | Use Case | Risk of Overuse |
|---|---|---|
| Fake (lightweight implementation) | In-memory DB, fake HTTP server | Tests pass but production fails on real implementation details |
| Stub (returns fixed values) | External service response, config values | Tests become brittle when responses change |
| Mock (verifies interactions) | Logging, analytics, event emission | Tests couple to implementation — refactoring breaks mocks |
| Spy (captures calls) | Auditing, notification verification | Same coupling risk as mocks |
| Dummy (placeholder) | Filling required constructor params | Hides real dependencies — test object may not reflect production |

**Mocking rules:**
- Mock at the boundary of your system, not deep inside it
- Prefer fakes for databases and message queues (Testcontainers > in-memory > mock)
- One mock per test — multiple mocks indicate a test that knows too much
- Never mock what you don't own — wrap external APIs in an adapter and mock the adapter

## 4. Test Requirements by WorkType

### FEATURE
- Unit tests for all new functions and components
- Integration tests for all new data access and external API calls
- E2E test for the primary user flow (if MEDIUM+ scale)
- Coverage: every new branch executed at least once

### FIX
- Test that reproduces the exact failure path (fails before fix, passes after)
- Regression test in the same test suite to prevent recurrence
- Contract test if the fix changes public behavior
- If test is impossible (race condition, external system): documented explanation + monitoring

### REFACTOR
- No new tests required if behavior is identical
- Existing tests must all pass with no changes
- If any test changes: re-classify as FEATURE or FIX, not REFACTOR

### SCHEMA
- Migration test: runs migration against a copy of production data and verifies data integrity
- Up/down test: applying and rolling back a migration leaves no schema artifacts
- Seed data test (for NOT NULL columns with defaults)
- Contract test for all consumers of the changed data

### CONTRACT
- Consumer-driven contract test for each consumer of the changed API
- Provider verification test against all consumer contracts
- Backward compatibility test (binary compat for gRPC, wire compat for REST, schema compat for events)

### CONFIG
- Startup validation test: system starts with the new config
- Smoke test: critical path works with the new config
- Rollback test: reverting config returns system to prior behavior

### INFRA
- Idempotency test: applying the same change twice produces the same state
- Drift detection test: infrastructure matches declared state after apply
- Rollback test: destroying and re-creating works cleanly

### INCIDENT
- Reproduction test (same conditions as production failure)
- Verification test (fix applied, failure no longer reproducible)
- Monitoring assertion (alert triggers on the failure signal)

## 5. Test Data Management

### Data Sources (ranked by reliability)

1. **Production anonymized** — Most realistic, but PII/PHI must be stripped, and data volume may be impractical
2. **Generated factories** — Deterministic, fast, composable. Use Factory Boy (Python), FactoryBot (Rails), or test data builders (TypeScript/Jest)
3. **Fixture files (JSON, YAML)** — Readable, easy to review, but brittle — changes with schema
4. **In-memory seeded** — Fastest for unit tests, but queries behave differently than real databases
5. **Shared test database** — Avoid if possible. Tests become order-dependent and flaky

### Test Data Isolation Rules

- Every test creates its own data — no shared state between tests
- Clean up after each test (transaction rollback, truncation, or teardown)
- Tests that modify shared state (file system, environment variables) must restore original state
- Parallel test execution requires unique data per process or thread
- Timestamps in test data use fixed values (e.g., `2025-01-01T00:00:00Z`), not `DateTime.now()`

## 6. Flaky Test Remediation

### Flaky Test Categories

| Category | Root Cause | Fix |
|---|---|---|
| Timing | Async operation not awaited, race condition | Use explicit waits, not sleep(); add synchronization point |
| Order-dependence | Test relies on state from another test | Isolate test data; randomize test order and run in CI |
| Environmental | Test passes locally, fails in CI | Dockerize test environment; CI and local use same configuration |
| Data leakage | Shared mutable state between tests | Reset state in setup; use fresh objects per test |
| External dependency | Third-party API is rate-limiting or down | Mock external APIs in unit tests; use circuit breaker in integration tests |
| Floating point | Numeric precision differences between platforms | Use delta comparison (`assertEqual(a, b, delta=0.001)`) |

### Remediation Protocol

1. CLASSIFY — Determine the flake category
2. ISOLATE — Can it be reproduced in isolation? If not, add logging around the failure point
3. FIX — Apply the remediation for the identified category
4. VERIFY — Run 10 times in CI; 0 failures = fixed
5. TRACK — Record in session ledger: flaky test path + root cause + fix applied

### When to Delete a Flaky Test

- FLAKE: three or more non-reproducible failures in CI
- VALUE: the test does not catch regressions that unit/integration tests also cover
- COST: debugging the flake takes longer than the test saves
- Alternative: demote the test to a manual run (nightly, not PR gate)

## 7. Coverage Quality (Not Just Quantity)

| Coverage Metric | What It Misses | Complement With |
|---|---|---|
| Line coverage | Branches not executed, missing assertions | Branch coverage + mutation testing |
| Branch coverage | Data-dependent paths, concurrency states | Property-based testing + error injection |
| Function coverage | Integration points, external contracts | Contract testing + integration tests |
| Mutation testing | Tests that assert nothing meaningful (pass/false-pass) | Code review of test assertions |

Minimum effective coverage: 80% line + 70% branch for MEDIUM+ modules, integrated with PR gate.

## 8. Test Organization by Scale

| Scale | Test Directory Structure | CI Test Step | Max Suite Time |
|---|---|---|---|
| NANO/MICRO | `tests/` in project root | `npm test` or `pytest` | 30 seconds |
| SMALL | `src/**/*.test.*` colocated | Unit → Integration sequentially | 2 minutes |
| MEDIUM | `tests/unit/`, `tests/integration/`, `tests/contract/` | Parallel by type | 10 minutes |
| LARGE | Per-service test directories | Service-level matrix + nightly full suite | 30 minutes (PR), 4 hours (nightly) |
| ENTERPRISE | Per-service + shared test infrastructure | CI orchestration with test impact analysis | 1 hour (PR), overnight (full) |

## 9. Contract Testing Guide

### When to Contract Test

- Any API consumed by a different team or service
- Any shared library with a public API surface
- Any event or message published to a shared broker
- Any schema change that crosses a service boundary

### Implementation Patterns

| Pattern | Tooling | Use Case |
|---|---|---|
| Consumer-driven contracts | Pact, Spring Cloud Contract | Service-to-service HTTP/gRPC with independent deploy cycles |
| Schema registry | Schema Registry (Avro/Protobuf), JSON Schema Store | Event-driven architectures with schema evolution |
| OpenAPI spec validation | Dredd, Spectral, Stoplight | REST APIs with documented OpenAPI specs |
| GraphQL schema check | GraphQL-inspector | Apollo federation or any GraphQL gateway |

### Contract Test Cadence

- Consumer contracts: verified on every consumer build (catches breakage early)
- Provider verification: verified on every provider build (prevents deploying broken API)
- Schema registry compatibility: checked on every producer publish (backward/forward compat)
- Breaking contract: automatically blocks the CI pipeline and generates a diff report

## 10. Test Execution in CI

### PR Gate (Fast — blocks merge)

1. Lint + type check (2 min)
2. Unit tests (3 min)
3. Integration tests (5 min)
4. Contract tests for changed services (5 min)
5. Coverage check against threshold (30 sec)

### Merge Queue (Medium — runs on merge group)

1. Full unit + integration suite (10 min)
2. E2E smoke tests (5 min)
3. Performance regression check (5 min)
4. Security scan (5 min)

### Nightly (Deep — runs once per day)

1. Full e2e suite (30 min)
2. Load test (15 min)
3. Mutation test (20 min)
4. Dependency vulnerability scan (5 min)
5. Contract test with all consumers (15 min)

### Test Failure Response

| Gate | Failure | Response |
|---|---|---|
| PR gate | Unit/Integration fails | Block merge — author must fix |
| PR gate | Coverage below threshold | Block merge — add tests or update threshold with written justification |
| Merge queue | Performance regression | Block merge — author must optimize or document accepted regression |
| Nightly | E2E fails | File bug — no merge block unless same test failed in last 3 nights |
| Nightly | Vulnerability found | Severity-based: CRITICAL/HIGH blocks next deploy, MEDIUM/LOW filed as issue |
