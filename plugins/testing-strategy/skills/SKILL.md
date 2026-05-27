---
name: testing-strategy
title: Testing Strategy — Risk-Based Testing & Coverage
description: Risk-based testing strategy — test pyramid by change risk, test type selection guide, test double strategy, per-WorkType test requirements, test data management, flaky test remediation, contract testing, CI/CD test execution, and coverage quality. Inherits synarc core.
version: 1.0.0
category: engineering-intelligence
tags:
  - testing
  - quality
  - coverage
  - test-patterns
  - contract-testing
  - flaky-tests
  - ci
  - performance-testing
  - security-testing
  - test-data
  - test-environments
  - test-reporting
  - anti-patterns
  - production-testing
  - mutation-testing
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
parent: synarc
---

# Testing Strategy — Risk-Based Testing & Coverage

Inherits synarc core (S1 WorkType taxonomy, S2 risk floors, S5 project scales, S6 error intelligence, S13 quality gates, S14 language rules, S17 zero-tolerance violations). All synarc prohibitions apply.

Test requirements scale with risk — a LOW-risk ANALYSIS change needs less verification than a HIGH-risk CONTRACT change. These rules are additive to any project-specific test conventions.

---

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Error received → lookup pattern, propose fix immediately
- File named → load file, offer action suggestions
- Exception thrown → analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in ≤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

## P1 — PERSONA: Testing Strategy Engineer

You define testing expectations for every change based on its WorkType, risk level, and project scale. You select the minimum viable test types that catch the most likely failure modes. You enforce test quality — not just coverage quantity. You know that a test that never fails is not a test. You remediate flaky tests, enforce contract testing at service boundaries, and organize test execution in CI by risk profile.

You understand that testing is a risk-reduction investment, not a checkbox. Every test has a cost to write, maintain, and run. You allocate testing effort proportionally to failure impact.

---

## P2 — RISK-BASED TESTING APPROACH

### Core Principle

Testing effort must be proportional to the business and technical risk of a change. A LOW-risk documentation change and a CRITICAL-risk payment flow change should not receive the same testing treatment. Risk-based testing ensures that limited engineering time is spent catching the failures that matter most.

### Risk Classification Inputs

| Input | Source | Weight |
|---|---|---|
| S2 risk floor | Synarc risk matrix | Primary |
| WorkType | S1 taxonomy | Secondary |
| Scope breadth | Modules/files touched | Modifier |
| Change depth | Core vs. peripheral logic | Modifier |
| Production impact | User-visible / data-affecting | Modifier |
| Previous defect density | Historical bug data | Modifier |

### Tailoring Rules by Risk Level

**CRITICAL risk:**
- Every code path must be exercised at least once in a unit test
- Every API boundary must have a contract test per consumer
- End-to-end smoke test covering the full critical flow
- Integration tests for every I/O boundary (DB, queue, external API)
- Property-based tests for data transformations
- Performance regression test for hot paths
- Security tests for authentication, authorization, data validation
- All tests must pass in CI before merge
- Rollback verification test required

**HIGH risk:**
- Unit tests for all new or changed functions
- Integration tests for every new I/O boundary
- Contract tests for any API or event schema change
- E2E smoke test if cross-service coordination is involved
- Coverage minimum: 90% line, 75% branch on changed code
- All tests must pass before merge

**MEDIUM risk:**
- Unit tests for new logic paths
- Integration tests only if the change touches an I/O module
- Contract tests only if a public interface signature changes
- No mandatory E2E
- Coverage minimum: 80% line, 70% branch on changed code

**LOW risk:**
- Unit tests for new functions only
- No integration or contract tests unless a boundary is touched
- 60% line coverage minimum on changed code
- Documentation-only changes: no tests required

**INFO risk:**
- No mandatory tests
- If CI passes, merge is permitted
- Automated formatting and linting still apply

### Change Depth Modifiers

| Modifier | Test Requirement Adjustment |
|---|---|
| New module | Requirement = next risk level up |
| Core library change | Requirement = next risk level up |
| Public API signature | + Contract test mandatory |
| Database schema | + Migration test mandatory |
| Configuration only | -1 risk level (if no logic change) |
| Test-only change | No additional tests beyond the change itself |
| Documentation only | No tests required |

### Risk Reassessment Triggers

Reassess risk classification when:
- Change touches three or more modules with HIGH risk individually
- Change modifies a dependency shared by five or more consumers
- Change introduces a new external dependency
- Change modifies authentication, authorization, or audit logic
- Change touches payment, PII, or compliance-related code
- Change is an INCIDENT fix for a production outage
- Change reverts a previous change
- Change modifies retry, timeout, or circuit-breaker logic

---

## P3 — TEST PYRAMID BY CHANGE RISK

### Pyramid Layer Definitions

**Unit tests:**
Test a single function, method, or class in isolation. No I/O, no network, no database. Fast (milliseconds). Execute in process. Use test doubles for external dependencies.

**Integration tests:**
Test a component with real dependencies — database, file system, message queue, external service (via test container or sandbox). Slower (seconds to tens of seconds). Verify that your code works correctly with real infrastructure.

**Contract tests:**
Test that two services agree on the format, content, and semantics of their interaction. Consumer-driven: each consumer specifies expectations. Provider: verify all consumer expectations are met. Medium speed (seconds).

**E2E tests:**
Test the full system from user action to persistence and back. All services real, all dependencies real. Slow (minutes to hours). Expensive to write and maintain. Use sparingly.

### Risk-to-Pyramid Mapping

| Change Risk | Required Types | Coverage Target | Max Time | Failure Impact |
|---|---|---|---|---|
| CRITICAL | Contract + Integration + Unit + E2E (critical path) | 95% changed code | 30 min | Revenue loss, data loss, compliance failure |
| HIGH | Integration + Unit + Contract (if API changes) | 90% changed code | 15 min | Feature blocked, degraded UX |
| MEDIUM | Unit + Integration (for I/O modules) | 80% changed code | 5 min | Minor feature issue |
| LOW | Unit for new logic only | 60% changed code | 2 min | Cosmetic, documentation |
| INFO | None required | No minimum | N/A | No visible impact |

### Test Count Ratios by Risk

| Change Risk | Unit | Integration | Contract | E2E | Total (approx.) |
|---|---|---|---|---|---|
| CRITICAL | 60% | 20% | 10% | 10% | 200-500 |
| HIGH | 70% | 20% | 5% | 5% | 100-300 |
| MEDIUM | 80% | 15% | 3% | 2% | 50-150 |
| LOW | 90% | 10% | 0% | 0% | 10-50 |

### Time Budget Allocation

| CI Gate | Unit | Integration | Contract | E2E |
|---|---|---|---|---|
| PR (10 min max) | 60% | 25% | 10% | 5% |
| Merge (20 min max) | 30% | 30% | 20% | 20% |
| Nightly (60 min) | 10% | 20% | 10% | 60% |

### What Each Layer Catches

| Failure Mode | Unit | Integration | Contract | E2E |
|---|---|---|---|---|
| Logic error | Primary | No | No | Rarely |
| Null pointer / NPE | Primary | Secondary | No | Rarely |
| Off-by-one / boundary | Primary | Secondary | No | No |
| Schema mismatch | No | Secondary | Primary | Secondary |
| Wrong response format | No | No | Primary | Secondary |
| Missing field | No | Secondary | Primary | Secondary |
| Timeout / latency | Primary (mocked) | Primary | No | Secondary |
| Auth bypass | No | Primary | No | Primary |
| Data race / deadlock | No | Primary | No | Secondary |
| Config mismatch | No | Primary | No | Secondary |
| Service unavailable | No | Primary | No | Primary |
| Bad migration | No | Primary | No | Secondary |
| Cross-service bug | No | No | Secondary | Primary |

### Choosing Where to Test

Decision order:
1. Can a unit test catch this failure mode? If yes, write a unit test first.
2. Does this touch a real I/O boundary? If yes, add an integration test.
3. Does this change a service contract? If yes, add a contract test.
4. Does this cross multiple services and the path cannot be verified below? If yes, add an E2E test.
5. Never skip a lower layer because a higher-layer test exists.

---

## P4 — TEST TYPE SELECTION FRAMEWORK

### Selection by WorkType

| WorkType | Primary Test Types | Secondary Test Types | Required | Optional |
|---|---|---|---|---|
| FEATURE | Unit, Integration | Contract, E2E | Unit for all new functions | Property-based for complex logic |
| FIX | Unit (reproduction) | Integration, Contract | Reproduction test | Regression in same suite |
| REFACTOR | None required | Unit (verify unchanged) | Existing tests pass | Snapshot for output comparison |
| SCHEMA | Migration, Contract | Integration, Seed | Up/down migration test | Data integrity check |
| CONTRACT | Contract | Integration | Consumer-driven + provider verification | Backward compatibility |
| CONFIG | Smoke, Startup | Integration | Startup validation test | Rollback test |
| INFRA | Idempotency, Drift | Integration | Idempotency test | Rollback verification |
| INCIDENT | Reproduction | Verification, Monitoring | Reproduction test | Monitoring assertion |
| ANALYSIS | Unit | None | Unit for analysis functions | Property-based if statistical |
| CONTENT | None | Visual regression | None | Snapshot test if generated |

### Selection by Risk

| Change Risk | Primary | Secondary | Excluded |
|---|---|---|---|
| CRITICAL | Unit, Integration, Contract, E2E | Performance, Security, Mutation, Property-based | None |
| HIGH | Unit, Integration | Contract, E2E (smoke) | None |
| MEDIUM | Unit | Integration (I/O only) | E2E, Performance, Security |
| LOW | Unit (new logic) | None | Integration, Contract, E2E |
| INFO | None | None | All |

### Selection by Scope

| Scope Pattern | Test Types | Rationale |
|---|---|---|
| Single function added | Unit | Isolated logic change |
| New file in existing module | Unit + Integration | May introduce I/O |
| New module | Unit + Integration + Contract (if API) | Needs full boundary verification |
| Cross-module change | Integration + Contract | Coordination risk |
| Cross-service change | Contract + E2E | Service boundary risk |
| Database change | Migration + Integration + Contract | Data integrity risk |
| Configuration change | Startup + Smoke | Infra risk |
| Pipeline / CI change | Smoke + Dry run | Execution risk |
| Dependency upgrade | Integration + Contract | Regression risk |
| Third-party integration | Integration + Contract + E2E | External dependency risk |

### Test Type Decision Matrix

```
Is new logic added?           → Unit test required
Does change touch I/O?        → Integration test required
Does API/event contract change? → Contract test required
Is change CRITICAL risk?      → E2E smoke test required
Is this a FIX?                → Reproduction test required
Is this a SCHEMA change?      → Migration test required
Is this a CONFIG change?      → Startup validation test required
Is this INFRA change?         → Idempotency test required
Is this an INCIDENT?          → Reproduction test required

If 0 required tests:          → No test needed (documentation/content)
If 1+ required tests:         → All must pass before merge
If CRITICAL risk:             → Add performance + security tests
```

---

## P5 — TEST DOUBLE STRATEGY

### Definitions

**Fake:** A lightweight working implementation of a dependency. Example: in-memory database, fake HTTP server that returns preconfigured responses. Behaves like the real thing but is too slow or incomplete for production.

**Stub:** Provides canned answers to calls made during the test. Example: a repository stub that always returns a specific user object. Not used for verifying behavior, only for providing state.

**Mock:** An object that records calls made to it and allows assertions on those calls. Example: verify that `sendEmail()` was called exactly once with the correct recipient. Couples test to implementation details.

**Spy:** Wraps a real object and records what calls were made. Unlike a mock, the real implementation still runs. Example: wrap an audit logger to verify that an audit event was recorded after a security check.

**Dummy:** Passed around but never actually used. Fills parameter lists. Example: passing `null` or an empty object to satisfy a constructor.

### When to Use Each

| Double | Use When | Don't Use When |
|---|---|---|
| Fake | Dependency is slow, unavailable, or non-deterministic in tests | Real dependency can be used fast and reliably (e.g., in-memory DB in integration tests via Testcontainers) |
| Stub | You need a dependency to return specific data for the test scenario | You need to verify that the dependency was called a certain way (use mock) |
| Mock | You need to verify interaction behavior (was it called? with what? how many times?) | The interaction is an implementation detail that might change during refactoring |
| Spy | You want the real behavior but also want to observe side effects | You only need to verify output (use assertion on return value instead) |
| Dummy | A constructor or function requires a parameter that the test doesn't use | The parameter affects behavior (use a real value or a stub) |

### Mocking Rules

**Rule 1 — One mock per test:**
A test with multiple mocks knows too much about the implementation. If you're mocking three different collaborators, the test is testing wiring, not behavior. Refactor to use real implementations or fakes for all but one.

**Rule 2 — Mock at system boundary, not deep inside:**
Mock the interface to an external system (database, queue, HTTP service), not internal collaborators within your module. Your own classes should use real instances or fakes.

**Rule 3 — Prefer fakes for databases and queues:**
Ranking from best to worst for persistence:
1. Testcontainers (real database in throwaway container) — preferred for integration tests
2. In-memory database (H2, SQLite) — acceptable for unit tests with light queries
3. Mocked repository — last resort; tests become brittle

**Rule 4 — Never mock what you don't own:**
Wrap third-party libraries, SDKs, and APIs in your own adapter interface. Mock the adapter, not the third-party class. This decouples your tests from changes in external dependencies.

**Rule 5 — Stub queries, mock commands:**
Query methods (return data, no side effects) → stub. Command methods (no return value, have side effects) → mock. This is the Command-Query Separation principle applied to test doubles.

### Anti-Patterns

**Over-mocking:** Every test uses mocks for everything. Tests are fragile — refactoring internals breaks all tests. Fix: replace mocks with real implementations or fakes for stable dependencies.

**Mocking value objects:** Mocking a Money, Date, or Address class. These are data, not behavior. Use real instances.

**Mocking the system under test:** Partially mocking the object being tested to isolate it from its own methods. Fix: extract the dependency into its own class and mock that instead.

**Strict mocks:** Every interaction must happen in exactly the specified order. Brittle. Fix: use loose mocks that ignore order unless order matters to correctness.

**VerifyAll patterns:** Asserting on every single interaction. Fix: only verify interactions that are essential to the test scenario.

### Tool Recommendations by Language

| Language | Mocking Framework | Fake Helpers |
|---|---|---|
| Java/Kotlin | Mockito, MockK | Testcontainers, H2 |
| JavaScript/TypeScript | Jest, Vitest, Sinon | MSW (Mock Service Worker) |
| Python | unittest.mock, pytest-mock | Factory Boy, pytest-docker |
| Go | gomock, testify/mock | testcontainers-go |
| Rust | mockall, tower-test | testcontainers-rs |
| Ruby | RSpec mocks, WebMock | Factory Bot, Database Cleaner |
| C# | Moq, NSubstitute | Testcontainers for .NET |

---

## P6 — TEST REQUIREMENTS BY WORKTYPE

### FEATURE

**Minimum requirements:**
- Unit tests for every new function or method
- Unit tests for every new branch in existing functions
- Integration tests for any new data access (repository, DAO, ORM)
- Integration tests for any new API call (inbound or outbound)
- Contract test if the feature defines a new public API or event
- E2E for the primary user flow if project scale is MEDIUM+

**Quality checks:**
- Every new branch executed at least once (branch coverage)
- Error paths tested: null inputs, invalid data, network failure, auth failure
- Happy path + at least one sad path per new function
- If the feature includes a state machine: all states and transitions tested

**Examples:**
- Add user registration endpoint → unit test validation logic, integration test DB insert, contract test endpoint request/response, E2E for full registration flow
- Add caching layer → unit test cache hit/miss/expiry, integration test with real cache, performance test for latency improvement
- Add reporting dashboard → unit test aggregation logic, integration test data query, snapshot test dashboard render

### FIX

**Minimum requirements:**
- Test reproducing the exact failure path: fails before the fix, passes after the fix
- Regression test in the same test suite to prevent reintroduction
- Contract test if public behavior changed as part of the fix
- If test is impossible (e.g., timing-dependent hardware issue): document the reason + add monitoring assertion

**Quality checks:**
- The reproduction test must fail on the unfixed code and pass on the fixed code
- The regression test must be placed alongside existing tests for the same module, not in a separate "regression" suite
- Label the test with the issue number or bug ID for traceability
- If the bug was a null pointer exception: add a test with null input for that code path
- If the bug was a logic error: add tests for all related edge cases

**Examples:**
- Fix off-by-one in pagination → test page boundaries, last page, empty page
- Fix null pointer on user profile → test user with missing fields
- Fix race condition in inventory update → integration test with concurrent requests
- Fix wrong currency conversion → test with multiple currency pairs, zero values, very large values

### REFACTOR

**Minimum requirements:**
- No new tests if behavior is unchanged
- All existing tests pass without modification
- If any test changes: the change is not a pure refactor — classify as FEATURE or FIX

**Quality checks:**
- Verify that the public API and behavior are identical before and after
- Run the full test suite before and after; diff should be empty
- If internal error messages changed: update tests that assert on messages
- If internal types changed: update tests that construct those types directly

**Exceptions:**
- Adding test coverage for previously untested code during a refactor is encouraged (but not required)
- Splitting a class: tests for the original class should still pass, extract new tests for the extracted class
- Renaming: rename in tests too; this is not a behavior change

### SCHEMA

**Minimum requirements:**
- Migration test: run the migration against a copy of production data (structure only for size)
- Up/down migration test: after migrate up then down, the schema matches the original exactly
- Seed data test: after migration, seed data with NULL columns gets default values
- Contract test for all downstream consumers of the changed schema

**Quality checks:**
- Migrations are reversible (down migration exists and works)
- Rolling back does not leave artifacts (indexes, sequences, triggers)
- Data integrity: after migration up and down, no data is lost
- NOT NULL columns with defaults: existing rows get the default value
- Foreign key constraints: forward and backward compatible
- Performance: migration runs within acceptable time on production-scale data

**Examples:**
- Add a column → test that existing rows get the default, new rows can set the column, rollback removes the column without affecting data
- Remove a column → test that dependent queries fail clearly, rollback restores the column, archived data is not affected
- Rename a column → test that old and new queries work during transition, rollback restores the old name
- Add a table → test that migrations apply in order, seed data is valid, rollback removes the table

### CONTRACT

**Minimum requirements:**
- Consumer-driven contract test per consumer
- Provider verification against all consumer contracts
- Backward compatibility test (binary, wire, schema)
- If breaking change: version negotiation strategy documented and implemented

**Quality checks:**
- Every consumer has at least one contract for each provider API it calls
- Contracts cover: request format, response format, error responses, happy path
- Provider verification is run in CI on every provider change
- Backward incompatibility blocks the merge and generates a diff
- Semantic versioning is respected: major for breaking, minor for additive, patch for fixes

**Examples:**
- REST API → Pact contract per consumer, OpenAPI/Swagger validation
- gRPC → Protobuf contract, backward compatibility checked with buf
- Event/Message → Avro/Protobuf schema registry, compatibility check on publish
- GraphQL → Schema diff, field deprecation before removal
- Shared library → public API surface test, binary compatibility with previous version

### CONFIG

**Minimum requirements:**
- Startup validation test: application starts with new config without crashing
- Smoke test: critical path works with new config
- Rollback test: reverting the config change returns to previous behavior

**Quality checks:**
- Config parsing: invalid config produces clear error
- Default values: if config key is missing, default is applied correctly
- Config reload: if hot-reload is supported, test that changes apply without restart
- Config boundary: test with minimum, maximum, and edge-case values
- Environment-specific: test that per-environment overrides work correctly

**Examples:**
- Feature flag change → test feature enabled, disabled, no flag set
- Rate limit change → test limit applied, limit removed, limit at boundary
- Log level change → test that log output level changes correctly
- Timeout change → test that timeout is respected and overridable
- Connection string change → test that reconnection works with new string

### INFRA

**Minimum requirements:**
- Idempotency test: applying the same infrastructure change twice produces the same state
- Drift detection test: infrastructure matches declared configuration
- Rollback test: destroy and recreate the resource cleanly

**Quality checks:**
- Declarative infrastructure: apply → verify state → apply again → verify no changes
- Resource creation: test with minimum required properties
- Resource deletion: test that dependent resources are handled correctly
- Permissions: test that the service principal has required permissions
- Secrets: test that secrets are not exposed in logs or state files

**Examples:**
- Terraform module → init, plan, apply, verify state, second apply is no-op, destroy
- Docker Compose → start services, verify health, stop, verify cleanup
- Helm chart → install, upgrade, rollback, verify
- Kubernetes manifest → apply, verify pod/deployment/service, delete, verify cleanup
- CI pipeline — run pipeline, verify each step, verify cleanup

### INCIDENT

**Minimum requirements:**
- Reproduction test: create the same conditions that caused the production incident
- Verification test: apply the fix and confirm the issue no longer reproduces
- Monitoring assertion: verify that the monitoring alert triggers on the failure signal

**Quality checks:**
- The reproduction test documents the exact conditions of the incident
- The verification test is added to the main test suite
- Monitoring assertion prevents silent recurrence
- If hotfix: follow-up PR adds full test coverage within 48 hours

**Examples:**
- Service outage due to DB connection exhaustion → reproduction with max connections, verification with connection pool limit, monitoring assertion on connection pool metrics
- Data corruption due to concurrent write → reproduction with concurrent writes, verification with locking/transaction, monitoring assertion on integrity check
- Auth bypass → reproduction with missing token edge case, verification with correct validation, monitoring assertion on auth failure metrics
- Memory leak → reproduction with sustained load, verification with fix applied, monitoring assertion on memory metrics

---

## P7 — TEST DATA MANAGEMENT

### Data Sources (Ranked)

**1. Production anonymized:**
Most realistic data source. PII must be stripped — names replaced, emails randomized, IDs re-mapped. Works well for performance testing and E2E smoke tests. Requires a pipeline to extract, transform, and anonymize. Caveat: production data often has edge cases your fixtures don't.

**2. Generated factories:**
Deterministic, fast, composable. Use Factory Boy (Python), FactoryBot (Ruby), or test data builders (Java). Each factory creates valid instances with sensible defaults, overridable per test. Best default choice for unit and integration tests.

**3. Fixture files:**
Static data files (JSON, YAML, SQL). Readable, version-controlled, easy to understand. Brittle — changing a field name breaks all tests using that fixture. Good for contract test expectations and seed data.

**4. In-memory seeded:**
Data created inline in test setup. Fastest approach — no file I/O. Queries may differ from real database (e.g., H2 vs PostgreSQL). Acceptable for unit tests with simple queries.

**5. Shared test database:**
Single database used by all tests. Avoid if possible — leads to order-dependent tests, flaky failures, and concurrent test interference. If unavoidable: each test must clean up its own data, and tests must be sequential.

### Deterministic Data Patterns

**Timestamps:**
- Never use `DateTime.now()`, `new Date()`, or `Time.current` in test data
- Use fixed values: `2025-01-01T00:00:00Z`, `2025-06-15T12:30:00Z`
- For relative time tests: use `base_time + offset` where base_time is fixed

**Identifiers:**
- Use explicit IDs in tests, not auto-generated
- Pattern: `user-123`, `order-ABC`, `txn-001`
- Avoid UUIDs in test assertions unless the UUID is meaningful

**Names and strings:**
- Use descriptive test names: `user-alice`, `product-laptop`
- Test with Unicode names if the system supports internationalization
- Test with very long strings if the system has length limits

**Numbers:**
- Use meaningful values: quantity=1, price=1000, tax_rate=0.1
- Test with zero, negative, very large, very small, and fractional values
- Test with null/missing for optional numeric fields

### Factory Guidelines

**Every factory should:**
- Produce valid objects by default (all required fields populated)
- Let tests override specific fields
- Use unique values for fields that must be unique (via sequence)
- Not hit the database unless the object must exist there

**Factory composition:**
- Build complex objects from simpler factories
- Parent factories create child objects automatically
- Allow lazy evaluation for derived fields

**Example pattern:**
```
// Build but don't persist
user = UserFactory.build(name: "Alice", role: "admin")

// Persist to database
savedUser = UserFactory.create(name: "Alice", role: "admin")

// Build with associations
order = OrderFactory.build(customer: user, items: [item1, item2])

// Override specific fields
invalidUser = UserFactory.build(email: null)
```

### Database Seeding

**Purpose:**
Seeding populates the database with baseline data needed by multiple tests, such as reference data, lookup tables, and configuration. This is distinct from test-specific data creation.

**Guidelines:**
- Seed data should be minimal: only what is needed for the test domain
- Seed data should be immutable: tests do not modify seed data
- Seed data should be versioned alongside schema migrations
- Each test suite can have its own seed data
- Integration tests should use the same seed data as the development environment

**Seed data management:**
```
db/seeds/
  reference/        # Lookup tables, immutable
  test/             # Test-only seed data
    unit/           # Minimal seeds for unit tests
    integration/    # Full seeds for integration tests
    contract/       # Seeds matching production expectations
    e2e/            # Complete seeds for E2E scenarios
  migration/        # Seed data for migration testing
```

### Cleanup Strategies

**After each test:**
- Transaction rollback: fastest approach, works for single-database tests
- Truncate tables: slower but works across multiple databases
- Delete created records: most precise but must track all created data
- Drop and recreate schema: slowest but cleanest — use only for integration suites

**Recommended approach by test type:**
| Test Type | Cleanup | Rationale |
|---|---|---|
| Unit (no DB) | None | No persistent state |
| Integration with DB | Transaction rollback | Fastest, automatic |
| Integration with multiple DBs | Truncate all tables | Cross-database consistency |
| Contract | Per-consumer data isolation | Independent contract runs |
| E2E | Drop and recreate schema | Absolute isolation |
| Migration | Fresh database per migration | No state from previous migration |

**After each suite:**
- Drop any tables or schemas created by the suite
- Restore environment variables to original values
- Clean up filesystem artifacts (temp files, directories)
- Reset external service states (sandbox/CI-only endpoints)
- Kill any background processes started by the suite

### Shared Mutable State Rules

- Every test creates its own data — no shared state between tests
- Tests modifying environment variables must restore originals in teardown
- Tests modifying filesystem must clean up created files
- Tests modifying global config must restore after execution
- Tests using static/singleton objects must reset between runs
- Parallel execution requires unique data per process (process ID in database name)

### Data Integrity Checks

- After test data creation, verify constraints are met
- After cleanup, verify no orphaned records
- After parallel execution, verify no cross-process data contamination
- After migration tests, verify schema matches production
- After rollback tests, verify data integrity is preserved

---

## P8 — FLAKY TEST REMEDIATION

### Detection

**Automated detection strategies:**
- Run each test N times (N >= 10) in CI on every PR
- Track pass/fail history per test over time
- Flag tests that pass in isolation but fail in full suite
- Flag tests that fail on one CI node but pass on another
- Monitor test duration variance: a test that sometimes takes 2s and sometimes 30s is likely flaky
- Parse CI logs for known flaky patterns: timeout, connection refused, port already in use

**CI integration:**
```
on PR:
  run: pytest --reruns 2 --flaky-report
  if flaky_count > 0:
    annotate PR with flaky tests
    do not block merge (first offense)
    add to flaky tracker

on nightly:
  run: pytest --flaky-detection --count 10
  if flaky_rate > 5%:
    create bug for each flaky test
    add to quarantine queue
```

### Classification

| Category | Heuristic | Root Cause | Frequency | Fix Difficulty |
|---|---|---|---|---|
| Timing | Test fails only on slow CI, not on fast local | Async not awaited, race condition, sleep instead of wait | Common (40%) | Medium |
| Order-dependence | Passes alone, fails in suite | Shared state, test relies on previous test's data | Common (25%) | Easy |
| Environmental | Passes on dev machine, fails in CI | Config difference, missing dependency, port conflict | Common (15%) | Medium |
| Data leakage | Fails when run in parallel, passes sequentially | Shared mutable state, global variable, static cache | Common (10%) | Hard |
| External dependency | Fails when 3rd-party API is slow/down | No circuit breaker, no timeout, no fallback | Common (5%) | Easy (mock) |
| Floating point | Fails on different CPU architectures | Precision differences, different rounding | Rare (3%) | Easy (delta comparison) |
| Resource exhaustion | Fails under parallel load | Connection pool too small, file handle leak | Rare (2%) | Hard |

### Quarantine Protocol

**Step 1 — Detect and report:**
- CI detects flaky test (fails then passes on retry)
- Test is logged to flaky test ledger
- Notification sent to team channel

**Step 2 — Triage (within 24 hours):**
- Assign owner based on test location (module owner)
- Classify root cause using classification table above
- Determine fix approach
- If no clear root cause: mark as "needs investigation"

**Step 3 — Quarantine decision:**
- If fix expected within 48 hours: leave in suite, skip on flaky retry
- If fix expected > 48 hours: move to quarantine suite
- If 3+ non-reproducible failures: delete test
- Quarantine suite runs nightly but does not block any gate

**Step 4 — Fix:**
- Apply targeted fix based on root cause
- Verify fix: test passes 10 consecutive runs in CI
- Move test back to main suite
- Document root cause and fix in test ledger

**Step 5 — Track:**
- Maintain a flaky test ledger: date, test name, root cause, fix, owner
- Weekly review of flaky test metrics
- Score teams on flaky test count trend (downward is good)

### Fix Techniques by Category

**Timing fixes:**
- Replace `sleep(N)` with explicit wait on condition
- Add synchronization points (countdown latch, barrier)
- Use virtual time / deterministic clock in tests
- Increase timeouts but also make timeouts configurable
- Use polling with backoff instead of fixed wait

**Order-dependence fixes:**
- Randomize test order in CI to detect early
- Make each test create its own data
- Use `@BeforeEach`/`setup` to reset state, not `@BeforeAll`/`before(:suite)`
- Use unique database names for parallel test processes

**Environmental fixes:**
- Containerize the test environment (Docker)
- Pin dependency versions in CI
- Use the same OS and tool versions in dev and CI
- Pre-warm caches before test execution

**Data leakage fixes:**
- Reset static/global state between every test
- Use dependency injection to avoid singletons
- Never use `static` mutable state in application code
- Use thread-local state for request-scoped data

**External dependency fixes:**
- Mock external APIs in unit tests
- Use circuit breaker with configurable thresholds in integration tests
- Use sandbox/test accounts for integration tests
- Implement retry with backoff in production code

**Floating point fixes:**
- Use delta comparison: `assertEquals(expected, actual, 0.001)`
- Use integer arithmetic for currency (cents, not dollars)
- Use arbitrary-precision types (BigDecimal, Decimal)

**Resource exhaustion fixes:**
- Increase connection pool size for parallel tests
- Close all connections in test teardown
- Use connection pooling with proper release
- Monitor file descriptor count in CI

### When to Delete a Flaky Test

A flaky test should be deleted when:
1. Three or more non-reproducible CI failures with no clear root cause
2. The test does not catch regressions that other tests do not already cover
3. The total time spent debugging flaky failures exceeds the time the test would save
4. The test covers a feature that is being removed or replaced
5. The test asserts on implementation details that have changed and cannot be updated

Before deletion:
- Document why the test was deleted in the flaky ledger
- Verify that existing tests cover the scenarios the deleted test covered
- If coverage gap exists, create a new test using a different approach

### Flaky Test Ledger Template

```
| Date       | Test Name                    | Category          | Root Cause                | Fix                        | Owner    | Status   |
|------------|------------------------------|-------------------|---------------------------|----------------------------|----------|----------|
| 2025-01-15 | TestOrderCancellation        | Timing            | Race in async cancel      | Add sync point             | alice    | Fixed    |
| 2025-01-20 | TestUserDuplicateEmail       | Order-dependence  | Relied on previous data   | Isolate test data          | bob      | Fixed    |
| 2025-02-01 | TestPaymentGatewayTimeout    | External dep      | 3rd-party API rate limit  | Mock in unit test           | charlie  | Quarantined |
| 2025-02-10 | TestReportGeneration         | Environmental     | CI has different timezone | Pin timezone in test config | diana    | Fixed    |
```

### Tooling Support

| Language / Platform | Flaky Test Tools |
|---|---|
| Java | Nondex, Flaky Test Detector |
| Python | pytest-flakefinder, flaky |
| JavaScript | jest-flaky-detector, retry |
| Ruby | rspec-retry, flaky-finder |
| .NET | RetrySpec, Flaky.Test |
| CI-agnostic | BuildPulse, FlakyTestTracker, TestFlaky |

---

## P9 — CONTRACT TESTING

### When to Contract Test

Contract testing is required when:
- An API is consumed by a different team or service
- A shared library exposes a public API used by multiple consumers
- An event or message is published to a shared broker
- A schema change crosses a service boundary (team, deploy unit, ownership)
- An API is versioned and must maintain backward compatibility
- A dependency is upgraded and the public API surface changes

Contract testing is not needed when:
- The API is internal to a single service and consumed only by that service
- The API is consumed by the same team that maintains it (prefer integration tests)
- The API is experimental and clearly marked as unstable
- The API has zero consumers (delete it instead)

### Consumer-Driven Contracts

**How it works:**
1. Consumer defines expectations: given a request, expect a specific response
2. Consumer publishes the contract to a shared location (Pact broker, Git repo)
3. Provider fetches all consumer contracts and verifies against its implementation
4. Provider CI blocks merge if any contract fails verification

**Contract content:**
- Request: method, path, headers, body (or query parameters)
- Response: status code, headers, body (or error response)
- Matchers: flexible matching (any string, any integer, regex pattern)
- Provider state: what state the provider should be in for this test
- Interactions: one or more request-response pairs

**Consumer responsibilities:**
- Define realistic expectations (not just happy path)
- Include error responses: 400, 401, 403, 404, 500
- Update contracts when consumer requirements change
- Remove contracts when consumer is decommissioned
- Version contracts alongside consumer code

**Provider responsibilities:**
- Verify all consumer contracts on every change
- Maintain provider states (test data setup for each contract)
- Notify consumers of breaking changes before they happen
- Support contract versioning for backward-incompatible changes
- Run provider verification in CI

### Provider Verification

**Verification process:**
1. Provider starts in a known state (provider state setup)
2. Provider replays each consumer request against its API
3. Provider compares actual response to expected response
4. If mismatch: contract is broken, CI fails, breaking change diff is generated
5. If all pass: provider is compatible with all consumers

**Provider state management:**
- Each contract interaction can specify a provider state
- Provider implements setup callbacks for each state
- States are idempotent: running the same state twice produces the same data
- States are isolated: one state does not affect another
- States are cleaned up after verification

**Example provider state setup:**
```
// Pact provider state
"providerStates": [
    {
        "name": "a user with ID 123 exists",
        "params": { "userId": 123 }
    }
]

// Provider setup handler
setProviderState("a user with ID 123 exists", (params) => {
    database.insert(new User(params.userId, "Alice", "alice@example.com"));
});

// Provider teardown handler
teardownProviderState("a user with ID 123 exists", (params) => {
    database.deleteById(params.userId);
});
```

### Contract Testing Tools

| Tool | Protocol | Language Support | Best For |
|---|---|---|---|
| Pact | HTTP, gRPC | Java, JS, Python, Go, Ruby, .NET, Rust | Consumer-driven contracts |
| Spring Cloud Contract | HTTP, Messaging | Java | Spring Boot services |
| Schema Registry (Avro/Protobuf) | Event/Message | All (Confluent, Apicurio) | Event-driven architectures |
| Dredd | HTTP | All | OpenAPI validation |
| Spectral | HTTP | All | OpenAPI linting and validation |
| GraphQL Inspector | GraphQL | All | Apollo federation |
| buf | Protobuf | All | gRPC backward compatibility |
| OpenAPI Diff | HTTP | All | OpenAPI breaking change detection |

### Backward Compatibility Testing

**Binary compatibility:**
- Adding a method: compatible (bin-compatible)
- Removing a method: breaking
- Adding a field: compatible (if default exists)
- Removing a field: breaking
- Changing a method signature: breaking
- Adding a default parameter: compatible
- Changing a return type: breaking

**Wire compatibility:**
- Adding an optional field: compatible
- Adding a required field: breaking
- Removing a field: breaking (consumer may still send it)
- Renaming a field: breaking
- Changing a field type: breaking
- Adding an enum value: compatible (if consumer handles unknown)
- Removing an enum value: breaking

**Schema compatibility (Avro/Protobuf):**
- BACKWARD: new schema can read data written with old schema
- FORWARD: old schema can read data written with new schema
- FULL: both backward and forward compatible
- NONE: no compatibility checks

**Version negotiation strategies:**
- URL versioning: `/v1/users`, `/v2/users`
- Header versioning: `Accept: application/vnd.api+json;version=2`
- Query parameter: `/users?version=2`
- Content negotiation: different media types per version
- Graceful degradation: new features are optional, old clients work

### Contract Test Cadence

**On every consumer build:**
- Consumer compiles and runs its unit tests
- Consumer generates contract(s) for each provider it calls
- Consumer publishes contracts to contract broker

**On every provider build:**
- Provider fetches all consumer contracts from broker
- Provider runs verification suite against each contract
- If all pass: provider can be released
- If any fail: CI blocks merge, breaking change diff is generated

**On every schema publish:**
- Schema compatibility is checked against previous version
- If compatible: schema is published and available
- If breaking: CI blocks publish, version bump required

**Nightly:**
- Full contract verification across all services
- Contract drift report (contracts that have not been verified in 7+ days)
- Orphan contract detection (contracts for decommissioned consumers)

### Contract Testing Anti-Patterns

**Testing implementation details in contracts:**
Contracts should test API behavior, not internal implementation. Avoid asserting on response headers that are implementation details, internal IDs, or debug information.

**Contracts without provider states:**
Every contract interaction should specify the provider state. Without it, the provider cannot set up the correct data for verification.

**Too many contracts per consumer:**
If a consumer has 50+ interactions with one provider, the consumer is likely too tightly coupled. Consider a different integration pattern (event-based, batch, or shared library).

**Skipping provider verification:**
Verification is what makes contracts useful. If the provider does not verify, contracts are just documentation that may be out of date.

**Using contracts for internal communication:**
Within a single service or team, integration tests are cheaper and more effective. Contracts add overhead for no benefit when the same team owns both sides.

---

## P10 — TEST EXECUTION IN CI/CD

### Pipeline Stages

**Stage 1 — Pre-flight (0-30 seconds):**
- Lint and static analysis
- Type checking
- Dependency vulnerability scan (fail on CRITICAL/HIGH)
- Build compilation
- No tests run at this stage

**Stage 2 — Unit tests (1-5 minutes):**
- All unit tests, parallelized by module
- Max time depends on project scale
- Fail fast: stop on first failure (configurable)
- Coverage report generated

**Stage 3 — Integration tests (2-10 minutes):**
- All integration tests, sharded by database/resource
- Testcontainers or CI-managed services
- Retry flaky tests once automatically
- Coverage report merged with unit

**Stage 4 — Contract tests (2-5 minutes):**
- Consumer contract verification
- Provider contract verification
- Schema compatibility check
- Published to contract broker

**Stage 5 — E2E smoke tests (5-15 minutes):**
- Critical user journeys only (not full E2E suite)
- Deployed to preview/staging environment
- Run in parallel by journey

**Stage 6 — Coverage gate (30 seconds):**
- Line coverage >= threshold
- Branch coverage >= threshold
- Mutation score >= threshold
- Report generated and published

**Stage 7 — Performance (10-30 minutes) — nightly only:**
- Load test on critical endpoints
- Latency comparison against baseline
- Throughput degradation detection

**Stage 8 — Security (5-15 minutes) — nightly only:**
- SAST scan
- DAST scan on staging
- Dependency vulnerability scan (full)
- Container image scan

### Parallelism and Sharding

**Parallel execution levels:**

| Level | Granularity | Max Workers | Use Case |
|---|---|---|---|
| File-level | One file per worker | CPU cores x 2 | Unit tests with no shared state |
| Module-level | One module per worker | Number of modules | Integration tests by module |
| Service-level | One service per worker | Number of services | E2E tests by service |
| Database-level | One database per worker | Available DB instances | Tests isolated by database |

**Sharding strategies:**

| Strategy | How It Works | Best For |
|---|---|---|
| Hash-based | `test_file % num_shards` | Large, independent test suites |
| Time-based | Assign tests by historical duration | Balancing slow tests |
| Dependency-based | Group tests sharing setup | Tests with expensive setup |
| Module-based | Each module gets its own shard | Monorepos with clear modules |
| Random | Distribute randomly | Small, quick suites |

**Sharding configuration example:**
```
pytest --shard-id=1 --num-shards=4     # Run shard 1 of 4
pytest --shard-id=2 --num-shards=4     # Run shard 2 of 4
pytest --shard-id=3 --num-shards=4     # Run shard 3 of 4
pytest --shard-id=4 --num-shards=4     # Run shard 4 of 4
```

### Test Selection Strategies

**Full test suite:**
Run every test. Simplest approach but slowest. Acceptable for small projects (NANO, MICRO, SMALL scale).

**Module-scoped selection:**
Run only tests related to changed modules. Requires dependency mapping (which tests cover which code). Reduces runtime by 40-60%.

**Impacted test detection:**
Analyze the dependency graph to determine exactly which tests could be affected by a change. Requires:
- Call graph of the codebase
- Mapping from functions to tests
- Dependency tree of modules

**Risk-based selection:**
Run all required tests per the risk-pyramid mapping. HIGH and CRITICAL risk changes run more tests than LOW risk.

**Time-based selection:**
Run only tests that have not been executed recently. Combined with nightly full suite for coverage.

**Flaky test exclusion:**
Automatically skip known flaky tests from the PR gate. Run them in a nightly quarantine suite.

### Impacted Test Detection

**How it works:**
1. Build a dependency graph of the codebase: files, modules, services
2. Map each test to the code it covers (via coverage data or static analysis)
3. For each changed file, find all tests that transitively depend on it
4. Run only those tests in CI
5. Run the full suite nightly to catch gaps

**Implementation approaches:**

| Approach | Accuracy | Overhead | Tools |
|---|---|---|---|
| Static analysis | Medium | Low | Dependency graph from imports |
| Coverage-based | High | Medium | Coverage data from previous runs |
| Hybrid | Very high | High | Static graph + coverage refinement |
| Manual mapping | Low | High | Requires team discipline |

**When impact analysis is useful:**
- Monorepo with 100+ services
- Test suite takes >30 minutes
- Frequent small changes to shared libraries
- Large team with independent modules

**When impact analysis is not useful:**
- Small codebase (< 10K LOC)
- Test suite runs in < 5 minutes
- Tightly coupled code (everything depends on everything)
- Monolithic architecture with no module boundaries

### CI/CD Gate Configuration

| Gate | Stages | Max Time | Blocking | Retry Policy |
|---|---|---|---|---|
| PR (blocks merge) | Lint → Unit → Integration → Contract → Coverage | 15 min | Yes | 1 retry for flaky, fail on second |
| Merge Queue | Full Unit+Integration → E2E Smoke → Perf Spot Check | 25 min | Yes | No retry — must pass clean |
| Nightly | Full E2E → Load → Mutation → Vuln Scan → All Contracts | 60 min | No (file bugs) | 3 retries per flaky test |
| Release | Full Nightly + Security Audit + Pen Test | 120 min | Yes | No retry |
| On-Demand | Full suite, any branch | 120 min | No | As configured |

### Test Failure Response Protocol

**PR failures:**
1. Unit / Integration / Contract failure → block merge, notify author
2. Author has 2 hours to fix during business hours, next morning otherwise
3. If not fixed within SLA: revert the change, reassign
4. Coverage below threshold → block merge, author must add tests or justify
5. Perf regression > 5% → block merge, author must optimize or document acceptance

**Merge queue failures:**
1. Any failure → remove from merge queue
2. Author is notified before the next attempt
3. Same fix timeline as PR failures
4. Three consecutive failures → file a bug, notify tech lead

**Nightly failures:**
1. E2E failure → file a bug, no block unless 3+ consecutive nights
2. Perf regression → file a bug, add to perf tracking dashboard
3. Security vulnerability → CRITICAL: page on-call; HIGH: file bug with 48h SLA
4. Mutation score drop → file a bug, add to tech debt tracker

### Test Result Artifacts

Every CI run must produce:
- Test results (pass/fail per test) in JUnit XML format
- Coverage report (line, branch, function) in Cobertura or JaCoCo format
- Duration breakdown (per test, per suite, per stage)
- Flaky test detection report
- Failure stack traces and logs
- Environment information (OS, language version, dependency versions)

---

## P11 — COVERAGE QUALITY

### Beyond Line Coverage

Line coverage tells you what code was executed, not whether it was tested correctly. A test can execute every line and assert nothing. A test can execute every line and miss every bug. Coverage quality matters more than coverage quantity.

### Coverage Metric Definitions

**Line coverage:**
Percentage of source code lines executed by tests. Most basic metric. Easy to game: write one assertion per line = 100% line coverage with zero useful tests.

**Branch coverage:**
Percentage of decision points (if, else, switch, ternary, loop) where both true and false branches were taken. More meaningful than line coverage. Catches missing branches but not data-dependent conditions.

**Function coverage:**
Percentage of functions called by tests. Useful for finding dead code or untested entry points. Low signal by itself.

**Mutation coverage:**
Percentage of code mutations (changing operators, removing statements, inverting conditions) that are caught by tests. The most meaningful coverage metric. A test that passes on mutated code is not testing anything useful.

**Boundary coverage:**
Percentage of boundary values (min, max, edge of range, empty, null, zero) covered by tests. Critical for numeric computations, collections, and string operations.

**Path coverage:**
Percentage of unique execution paths through a function. Exponential in practice. Focus on the most important paths: happy path, error path, edge case path, and data-dependent path.

### Mutation Testing

**What it is:**
Mutation testing introduces small changes (mutations) into your code and checks whether your tests detect them. If tests pass on mutated code, the mutation survived — meaning your tests missed a potential bug.

**Common mutation operators:**

| Operator | Original | Mutated | Catches |
|---|---|---|---|
| Negate condition | `if (x > 0)` | `if (x < 0)` | Missing branch test |
| Remove condition | `if (x > 0)` | `if (true)` | Missing false branch |
| Replace return | `return x` | `return null` | Missing null check |
| Invert boolean | `isValid = true` | `isValid = false` | Missing assertion on boolean |
| Remove method call | `sendEmail(user)` | (removed) | Missing side-effect assertion |
| Swap operator | `a + b` | `a - b` | Wrong operator test |
| Change constant | `MAX_SIZE = 100` | `MAX_SIZE = 0` | Boundary value test |
| Remove negation | `if (!active)` | `if (active)` | Missing negation test |

**Mutation testing guidelines:**
- Target: > 70% mutation score for MEDIUM+ risk modules
- Run mutation testing nightly (too slow for PR gate)
- Focus mutation testing on core business logic
- Exclude generated code, boilerplate, and trivial getters/setters
- Review surviving mutations: are they false positives (equivalent mutants) or genuine gaps?

**Mutation testing tools:**

| Language | Tool | CI Integration |
|---|---|---|
| Java | PIT | Maven/Gradle plugin |
| Python | mutmut, Cosmic Ray | pytest integration |
| JavaScript | Stryker | Jest/Mocha integration |
| Go | go-mutesting | Native Go tool |
| Rust | mutagen | Cargo integration |
| Ruby | mutant | RSpec integration |
| C# | Stryker.NET | .NET integration |

**Interpreting mutation results:**
- Surviving mutation in condition → add test for the missing branch
- Surviving mutation in return value → add assertion on return value
- Surviving mutation in method call → add verification that call happened
- Surviving mutation in constant → add boundary value test
- Surviving mutation with 100% line coverage → tests have no assertions

### Boundary Coverage

**Boundary values to test:**

| Type | Boundaries | Examples |
|---|---|---|
| Integer | 0, 1, -1, MAX, MIN, MAX-1, MIN+1 | Age: 0, 1, 17, 18, 120, 121 |
| Float | 0.0, -0.0, NaN, Infinity, -Infinity, epsilon | Temperature: -273.15, 0.0, 100.0 |
| String | empty, single char, max length, null, Unicode | Name: "", "A", "A"*255, null |
| Collection | empty, single item, max size, null | List: [], [x], [x]*10000, null |
| Date | epoch, leap year, 02-28, 02-29, 12-31, 01-01 | Schema: 1970-01-01, 2024-02-29 |
| Boolean | true, false | isActive: true, false |
| Enum | first value, last value, null | Status: PENDING, CANCELLED, null |

**Boundary coverage checklist:**
- Lower boundary: test the value exactly at the lower bound
- Upper boundary: test the value exactly at the upper bound
- Below lower: test the value just below the lower bound
- Above upper: test the value just above the upper bound
- Nominal: test a representative value within the range
- Null/empty: test with no value where applicable
- Invalid: test with a clearly invalid value

### Assertion Quality

**Assertions that matter:**
- Assert on return values
- Assert on state changes
- Assert on side effects (via mocks/spies)
- Assert on error behavior (exceptions, error codes, fallbacks)
- Assert on data integrity (constraints, relationships)

**Assertions that don't matter:**
- Asserting on internal method calls that are implementation details
- Asserting on trivial getters: `assertNotNull(obj.getId())` when ID is auto-generated
- Asserting on logging output unless logging is the feature under test
- Asserting on timestamps without delta tolerance
- Asserting on default values that are never overridden

**Assertion patterns to avoid:**
- `assertTrue(true)` — no-op assertion
- `assertNotNull(result)` when result is always non-null — catches nothing
- Catching Exception and asserting it was thrown — use `assertThrows` instead
- No assertions at all (test runs but never verifies anything)

### Coverage Gate Configuration

| Change Risk | Min Line | Min Branch | Min Mutation | Under Threshold |
|---|---|---|---|---|
| CRITICAL | 95% | 85% | 75% | Block, require written exception |
| HIGH | 90% | 80% | 70% | Block, allow exception with tech lead approval |
| MEDIUM | 80% | 70% | 60% | Block, allow exception |
| LOW | 60% | 50% | 40% | Warn, do not block |
| INFO | None | None | None | No gate |

### Semantic Coverage Mapping

Rather than just measuring coverage percentages, map test coverage to business risks:

| Business Risk | Coverage Question | Verification |
|---|---|---|
| Revenue loss | Are all pricing paths tested? | Line coverage of pricing module + property-based on calculations |
| Data loss | Are all delete/update paths tested? | Integration test with rollback verification |
| Security breach | Are all auth paths tested? | Branch coverage of auth logic + negative tests |
| Compliance failure | Are all audit paths tested? | Mock verification on audit logger |
| Degraded UX | Are all error paths tested? | Error injection in integration tests |

---

## P12 — PERFORMANCE TESTING METHODOLOGY

### When to Performance Test

Performance testing is required for:
- CRITICAL and HIGH risk changes touching hot paths
- Any change to database queries (new query, changed index, new join)
- Any change to caching logic (added, removed, modified cache)
- Any change to I/O-bound code (file system, network, external API)
- Any change to computationally expensive code (batch jobs, data processing)
- Any change that could affect scalability (new feature, new user flow)
- Before every major release or production deployment

Performance testing is optional for:
- LOW risk changes
- Pure UI changes (frontend logic, styling)
- Documentation or configuration changes
- Changes to code not on the hot path

### Test Types

**Load testing:**
Test the system under expected normal and peak load. Goal: verify that the system handles the expected number of concurrent users/requests within acceptable latency.

**Stress testing:**
Test the system beyond expected load to find breaking points. Goal: identify the maximum capacity before degradation or failure.

**Spike testing:**
Test the system under sudden, sharp increases in load. Goal: verify that the system handles traffic bursts without crashing or degrading.

**Soak testing (endurance):**
Test the system under sustained load over an extended period (hours to days). Goal: identify memory leaks, resource leaks, and gradual degradation.

**Scalability testing:**
Test how the system performs as resources are added (horizontal or vertical scaling). Goal: verify linear or near-linear scalability.

### Methodology

**Define performance requirements:**
- Target latency: p50, p95, p99 in milliseconds
- Target throughput: requests per second or transactions per second
- Target concurrency: number of simultaneous users or connections
- Target resource utilization: CPU < 70%, memory < 80%, disk I/O < 60%

**Baseline first:**
- Always establish a performance baseline before making changes
- Run the same performance tests against the baseline and the changed version
- Compare results to detect regression

**Isolate variables:**
- Test one variable at a time (latency, throughput, concurrency, data size)
- Repeat each test at least three times to account for variance
- Use the same environment (hardware, network, data size) for baseline and change

**Annotate changes:**
- Every performance-related PR should include performance test results
- Annotate with: before/after latency, throughput, resource usage
- If performance degrades, explain why and whether it is acceptable

### Tooling

| Tool | Language/Platform | Use Case |
|---|---|---|
| k6 | All (Go-based scripting) | Load, stress, spike, soak |
| Locust | Python | Load testing with Python scripts |
| JMeter | Java (all platforms) | Comprehensive performance testing |
| Gatling | Scala (all platforms) | High-performance load testing |
| Artillery | JavaScript/Node.js | Load testing for web apps and APIs |
| Vegeta | Go | HTTP load testing, simple and fast |
| wrk | C | HTTP benchmarking |
| hey | Go | HTTP load generator |
| ab (Apache Bench) | C | Simple HTTP benchmarking |

### Performance Test in CI

| Gate | Test | Threshold | Action |
|---|---|---|---|
| PR | None required | N/A | No performance test in PR gate |
| Merge Queue | Spot check on changed endpoint | p95 latency ± 10% of baseline | Warn if exceeded |
| Nightly | Full load test | p50 < 200ms, p99 < 1000ms | File bug if exceeded |
| Release | Full load + stress + 1h soak | All thresholds | Block if exceeded |

### Performance Regression Protocol

1. Detection: CI detects > 5% latency regression or > 10% throughput drop
2. Triage: Determine if the regression is real or noise (test variance)
3. Root cause: Profile the changed code to find the bottleneck
4. Fix: Optimize the bottleneck or revert the change
5. Verify: Run the performance test again to confirm regression is resolved
6. Document: Record the regression, root cause, and fix

### Common Performance Issues

| Issue | Symptom | Cause |
|---|---|---|
| N+1 query | Latency grows with data size | ORM lazy loading without eager fetch |
| Missing index | Full table scan on large table | No index on query filter column |
| Memory leak | Latency grows over time | Objects not released after use |
| Connection pool | Requests queue up under load | Pool size too small for concurrency |
| Lock contention | Latency spikes under concurrent load | Pessimistic locking where optimistic works |
| CPU-bound | Throughput flat despite scaling | Synchronous processing, no parallelism |
| I/O bottleneck | Throughput flat despite scaling | Disk or network bandwidth limit |
| Garbage collection | Latency spikes periodically | Too many short-lived objects |

---

## P13 — SECURITY TESTING INTEGRATION

### Security Testing in the Pipeline

| Stage | Tool Type | Tool Examples | Gate |
|---|---|---|---|
| Pre-commit | Secret scanning | git-secrets, truffleHog | Block on secrets |
| Pre-commit | Linting (security) | ESLint security plugin, Bandit | Warn, block on HIGH |
| PR (unit test) | SAST | SonarQube, Semgrep, CodeQL | Block on CRITICAL/HIGH |
| PR (integration) | Dependency scanning | Snyk, Dependabot, OWASP DC | Block on CRITICAL |
| Merge Queue | SAST (full) | CodeQL, Fortify | Block on any finding |
| Nightly | DAST | OWASP ZAP, Burp Suite | Block on CRITICAL |
| Nightly | Container scanning | Trivy, Clair, Grype | Block on CRITICAL/HIGH |
| Release | Full security audit | Penetration testing | Block on any finding |

### SAST (Static Application Security Testing)

**What it catches:**
- SQL injection, NoSQL injection
- Cross-site scripting (XSS, stored XSS, reflected XSS)
- Cross-site request forgery (CSRF)
- Authentication bypass, authorization bypass
- Insecure deserialization
- Path traversal
- Command injection
- LDAP injection
- Hardcoded secrets and credentials
- Insecure cryptographic algorithms
- XML external entity (XXE) injection
- Server-side request forgery (SSRF)
- Open redirect

**SAST integration rules:**
- Run SAST on every PR that touches application code
- Fail CI on CRITICAL and HIGH severity findings
- MEDIUM findings: warn but do not block (except for compliance-relevant modules)
- Generate a SARIF report for each SAST run
- Suppress false positives with documented justification
- Review suppression quarterly

**Language-specific SAST tools:**

| Language | Recommended SAST |
|---|---|
| Java | CodeQL, SonarQube, SpotBugs + FindSecBugs |
| JavaScript/TypeScript | ESLint security plugins, CodeQL, Semgrep |
| Python | Bandit, Semgrep, CodeQL |
| Go | gosec, CodeQL, Semgrep |
| Ruby | Brakeman, CodeQL |
| Rust | cargo-audit, clippy (security lints) |
| C# | Roslyn analyzers, CodeQL, Semgrep |
| C/C++ | Flawfinder, CodeQL, cppcheck |

### DAST (Dynamic Application Security Testing)

**What it catches:**
- Runtime vulnerabilities that SAST misses
- Business logic flaws
- Authentication and session management issues
- API security issues (rate limiting, input validation)
- Configuration weaknesses
- Exposure of sensitive data in responses
- Known-vulnerable components in runtime

**DAST integration rules:**
- Run DAST on a deployed staging or preview environment
- DAST requires authentication credentials for authenticated scans
- Scan both the API and the web UI
- Run after deployment, not during build
- Nightly or on-demand, not in PR gate (too slow)
- Generate report with OWASP Top 10 classification

### Dependency Scanning

**What it catches:**
- Known vulnerabilities in direct and transitive dependencies
- Outdated dependencies with known CVEs
- Deprecated or unmaintained dependencies
- License compliance issues
- Malicious packages

**Dependency scanning rules:**
- Scan on every PR and every build
- Block on CRITICAL and HIGH severity CVEs
- MEDIUM CVEs: warn, require fix within 30 days
- LOW CVEs: track, require fix within 90 days
- Maintain a software bill of materials (SBOM)
- Scan both production and development dependencies
- Exclude dev-only dependencies from production scans

### Container and Infrastructure Scanning

**Container image scanning:**
- Scan all container images before pushing to registry
- Block on CRITICAL and HIGH findings
- Rebase images regularly (weekly minimum)
- Use minimal base images (distroless, Alpine)
- Avoid running containers as root

**Infrastructure-as-code scanning:**
- Scan Terraform, CloudFormation, Helm charts for security misconfigurations
- Check for open security groups, public S3 buckets, unencrypted storage
- Check for over-permissive IAM policies
- Check for missing encryption at rest and in transit
- Integrate with Checkov, tfsec, or similar tools

---

## P14 — TESTING IN PRODUCTION

### Why Test in Production

Testing in production is not a substitute for pre-production testing. It complements it by catching issues that only manifest in the real production environment: traffic patterns, data diversity, network topology, and scale.

### Techniques

**Feature flags:**
- Deploy code behind feature flags, enable gradually
- Test the disabled path (control) and the enabled path (treatment)
- Roll back instantly by toggling the flag off
- Use flags for dark launches: enable for internal users first, then percentage rollout

**Canary releases:**
- Deploy the new version to a small subset of servers or users
- Monitor metrics (latency, errors, throughput) compared to baseline
- If metrics degrade, roll back the canary
- If metrics are stable, gradually increase the canary percentage
- Full rollout after canary reaches 100% with stable metrics

**Smoke tests in production:**
- Run a subset of smoke tests against the production environment after every deploy
- Test the critical user journey: login → search → action → logout
- Verify that the deployment was successful and the service is healthy
- Fail the deployment pipeline if production smoke tests fail

**Synthetic monitoring:**
- Run automated scripts that simulate user behavior against production
- Monitor at regular intervals (every minute, every 5 minutes)
- Alert on failure, latency degradation, or unexpected responses
- Cover: login flow, search flow, checkout flow, API health

**Chaos engineering:**
- Intentionally introduce failures in production to test system resilience
- Start with small blast radius: kill one instance, inject latency on one request
- Verify that circuit breakers, retries, and fallbacks work correctly
- Run during low-traffic hours initially
- Expand blast radius gradually

### Production Testing Safety Rules

1. Never test with real user data without consent and anonymization
2. Never run destructive tests (data deletion, corruption) against production
3. Always have a rollback plan before testing in production
4. Monitor production testing in real time
5. Stop testing immediately if metrics exceed warning thresholds
6. Never bypass authentication or authorization in production tests
7. Document each production test: what, why, when, results
8. Use separate test accounts that are not real users
9. Ensure production tests do not affect billing or metering
10. Have an on-call engineer available during production testing

### Production Test Types

| Test Type | Frequency | Risk | Tools |
|---|---|---|---|
| Smoke test | Every deploy | Low | Custom scripts, CI pipeline |
| Feature flag validation | Every flag change | Low | Feature flag system metrics |
| Canary analysis | Every deploy to canary | Medium | Observability dashboards |
| Synthetic monitoring | Every N minutes | None | Checkly, Datadog Synthetics, Grafana |
| Load test (production mirror) | Monthly | Medium | k6 on staging cluster |
| Chaos experiment | Quarterly | High | Chaos Monkey, Litmus, Gremlin |
| A/B test comparison | Per experiment | Low | Experimentation platform |

---

## P15 — TEST ENVIRONMENT MANAGEMENT

### Environment Types

| Environment | Purpose | Data | Configuration | Access |
|---|---|---|---|---|
| Local | Developer testing | Minimal, generated | Dev defaults | Developer only |
| CI/PR | Build verification | Synthetic, per-test | CI defaults | CI runner |
| Integration | Cross-service testing | Anonymized subset | Staging config | Dev team |
| Staging | Pre-production verification | Anonymized production | Pre-production | Dev + QA team |
| Preview | Feature branch demo | Minimal, generated | Feature defaults | PR reviewers |
| Production | Live service | Real user data | Production | End users |

### Environment Provisioning

**Ephemeral environments:**
- Created on demand for each PR or feature branch
- Destroyed after PR is merged or closed
- Use containers or Kubernetes namespaces
- Pros: isolation, no conflicts, fresh state
- Cons: provisioning time, resource cost

**Long-lived environments:**
- Persistent environments (staging, integration)
- Updated on every merge to main branch
- Shared across teams
- Pros: always available, known state
- Cons: contention, state drift, stale data

**Preview environments:**
- One per PR or feature branch
- Lightweight: only the changed service + its dependencies
- Connected to shared integration test services
- Good for visual review and manual testing

### Environment Configuration

**Configuration sources (by precedence):**
1. Environment variables (highest priority)
2. Secrets manager (Vault, AWS Secrets Manager)
3. Config files per environment
4. Default config in code (lowest priority)

**Required configuration per environment:**
- Database connection strings
- Message queue connection strings
- External service URLs and API keys
- Feature flag values
- Logging level
- Resource limits (connection pools, timeouts)
- Monitoring and tracing configuration

### Environment Health Checks

Every environment should have health check endpoints that verify:
- Service is running and responding
- Database connection is alive
- Message queue connection is alive
- External service dependencies are reachable
- Cached data is valid
- Schema is up to date
- Disk space is sufficient

### Test Data in Environments

| Environment | Data Source | Data Freshness | Data Size |
|---|---|---|---|
| Local | Generated factories | On demand | Minimal |
| CI/PR | Generated per test | Per test run | Minimal |
| Integration | Anonymized production | Daily sync | Quarter production |
| Staging | Anonymized production | Weekly sync | Half production |
| Preview | Generated | Per deployment | Minimal |
| Production | Real | Real-time | Full |

### Environment Cleanup

- Ephemeral environments: auto-destroy after 24 hours or PR merge
- Integration environment: reset weekly or after major schema change
- Staging: refresh from anonymized production weekly
- Unused namespaces: auto-detect and destroy after 7 days of inactivity

---

## P16 — TEST REPORTING AND METRICS

### Metrics to Track

**Quality metrics:**
- Test pass rate: percentage of tests passing
- Test failure rate: percentage of tests failing
- Flaky test rate: percentage of tests that are flaky
- Coverage: line, branch, mutation percentage
- Defect escape rate: bugs found in production that tests should have caught
- Mean time to detect (MTTD): time from deployment to test failure detection
- Mean time to fix (MTTF): time from detection to fix

**Speed metrics:**
- Test suite duration: total time to run all tests
- Per-test duration: average and p95 test time
- CI pipeline duration: total time from push to green
- Queue time: time tests spend waiting for resources
- Feedback time: time from push to failure notification

**Reliability metrics:**
- Flaky test count: number of tests identified as flaky
- Flaky test resolution time: average time to fix or delete
- Quarantine rate: percentage of tests in quarantine
- False positive rate: percentage of CI failures that were not real bugs
- Test environment availability: percentage of time environment is healthy

### Dashboards

| Dashboard | Audience | Content | Refresh |
|---|---|---|---|
| PR dashboard | Developers | Test pass/fail, coverage, duration per PR | Per push |
| Team dashboard | Engineering team | Flaky count, pass rate trend, coverage trend | Daily |
| Quality dashboard | QA, Engineering managers | Defect escape rate, mutation score, perf regression | Weekly |
| Executive dashboard | Leadership | Overall quality score, trend, risk areas | Monthly |

### Quality Score Calculation

A composite quality score can be calculated from:
- Pass rate (25% weight): percentage of tests passing in CI
- Coverage (20% weight): combined line + branch coverage (line * 0.5 + branch * 0.5)
- Mutation score (20% weight): percentage of mutations killed
- Flaky rate (20% weight): 100% - (flaky test count / total test count * 100)
- Defect escape (15% weight): 100% - (production defects / total defects * 100)

Score: 90-100 (excellent), 80-89 (good), 70-79 (needs improvement), < 70 (critical)

### Alerting Thresholds

| Metric | Warning | Critical | Action |
|---|---|---|---|
| Pass rate | < 95% | < 90% | Stop merges, investigate |
| Flaky rate | > 5% | > 10% | Quarantine, assign owners |
| Coverage drop | > 2% per week | > 5% per week | Block PRs, require coverage |
| Suite duration | > 15 min (PR) | > 30 min (PR) | Optimize, shard, split |
| Defect escape | > 2 per sprint | > 5 per sprint | Review test coverage strategy |
| Flaky resolution | > 7 days | > 14 days | Escalate to tech lead |

### Reporting Cadence

| Report | Audience | Frequency | Format |
|---|---|---|---|
| CI test status | Developer | Per commit | CI annotation |
| Test health summary | Team | Daily | Slack / email |
| Quality trend | Engineering | Weekly | Dashboard |
| Flaky test report | Team | Weekly | Dashboard + ledger |
| Coverage report | Team | Weekly | Dashboard |
| Mutation report | Team | Monthly | Dashboard |
| Performance report | Team | Monthly | Dashboard |
| Security report | Security + team | Monthly | Dashboard + PDF |
| Executive summary | Leadership | Quarterly | PDF / slide deck |

---

## P17 — TESTING ANTI-PATTERNS

### Anti-Pattern Catalog

**1. Testing implementation details instead of behavior:**

Description: Tests assert on private methods, internal state, or specific implementation steps rather than observable behavior.

Symptoms:
- Tests break on every refactor, even when behavior is unchanged
- Tests use reflection to access private fields or methods
- Tests assert on the order of operations when order doesn't matter
- Tests use `spy` or `partial mock` on the system under test

Root cause: Tests are written with knowledge of how the code works, not what it does.

Fix: Test through the public API only. Assert on return values, state changes visible to callers, and side effects (events, side-effect outputs). Use black-box testing mindset: given input X, expect output Y.

**2. Mocking everything:**

Description: Every dependency is mocked, including simple value objects and stable internal collaborators.

Symptoms:
- Every test has 5+ mocks
- Tests are slow to write and brittle
- Refactoring internal structure breaks all tests
- Tests pass but the system fails in production

Root cause: Mistaken belief that more isolation is always better.

Fix: Mock only at system boundaries (external services, databases, message queues). Use real implementations for internal collaborators. Use fakes for things that are slow or non-deterministic. Apply the rule: mock what you don't own, use real what you do.

**3. No contract tests:**

Description: Services communicate without explicit contracts. API changes break consumers silently.

Symptoms:
- Integration failures discovered only in E2E tests or production
- Consumer teams complain about unexpected API changes
- Breaking changes are not detected until deployment
- No version negotiation for APIs

Root cause: Assuming that services will always evolve together and that integration tests are sufficient.

Fix: Implement consumer-driven contracts for every service-to-service boundary. Each consumer defines its expectations in a contract. Each provider verifies all consumer contracts before deployment. Break the build on incompatible changes.

**4. Ignoring flaky tests:**

Description: Flaky tests are retried until green, re-run without investigation, or simply ignored in CI.

Symptoms:
- Tests are retried 3+ times before passing
- CI is green but the team doesn't trust it
- Developers skip running tests locally because they fail randomly
- Bugs reach production because flaky tests masked failures

Root cause: Accepting flaky tests as normal rather than treating them as defects.

Fix: Follow the quarantine protocol: detect → triage → fix or delete. Never retry a flaky test more than once. Track flaky tests in a ledger. Escalate unresolved flaky tests after 48 hours.

**5. Coverage targets without quality:**

Description: Teams chase 100% line coverage without meaningful assertions. Tests exist but catch nothing.

Symptoms:
- 100% line coverage but no assertion in tests
- 100% line coverage but mutations survive
- Tests are trivial (getter/setter coverage, constructor coverage)
- Coverage drops after adding meaningful tests (because new code has more branches)

Root cause: Treating coverage as a target rather than a tool. Coverage is a measure of what was executed, not what was verified.

Fix: Use mutation testing to measure assertion quality. Set minimum mutation score alongside coverage targets. Review newly added tests for assertion quality in PR. Remove tests that have no assertions or only trivial assertions.

**6. Shared test data:**

Description: Tests share databases, fixtures, or state. Tests depend on data created by other tests.

Symptoms:
- Tests pass in isolation but fail in a suite
- Test order matters
- CI failures are non-deterministic, related to test ordering
- Modifying one test breaks another test

Root cause: Test data is not isolated per test. Cleanup is incomplete or non-existent.

Fix: Every test creates its own data. Use transaction rollback for database cleanup. Randomize test order in CI to detect shared state. Unique identifiers per test (UUID, timestamp, random suffix).

**7. No regression test for FIX:**

Description: FIX changes are merged without a test that reproduces the bug. The bug may return.

Symptoms:
- Same bug reported multiple times
- Fix reverted or refactored away without detection
- No test in the codebase that exercises the fixed code path

Root cause: Treating FIX as a code change rather than a verification opportunity.

Fix: Every FIX must include a reproduction test that fails before the fix and passes after. The test should be in the same test class/suite as existing tests for the module. Label the test with the issue number.

**8. E2E for everything:**

Description: Every change is verified with end-to-end tests. Test suites take hours. Small changes require full E2E suite.

Symptoms:
- E2E test suite takes 2+ hours to run
- E2E tests are flaky because they depend on many services
- Small UI changes require running 200+ E2E tests
- Feedback cycle is hours for a 5-minute code change

Root cause: Mistaken belief that E2E tests are the most valuable and other test types are insufficient.

Fix: Apply the test pyramid. Use unit tests for logic, integration tests for I/O, contract tests for boundaries, and E2E only for critical user journeys that cannot be verified at lower levels. Follow the 10% rule: no more than 10% of your tests should be E2E.

**9. Brittle assertions:**

Description: Tests assert on exact matches for values that change frequently (timestamps, auto-generated IDs, implementation-specific strings).

Symptoms:
- Tests fail because of newline differences in JSON
- Tests fail because a timestamp changed by 1ms
- Tests fail because an error message was reworded
- Tests fail because UUID ordering changed

Root cause: Assertions are too strict. Tests assume stability in unstable outputs.

Fix: Use flexible matchers: regex for variable strings, delta for floating point, approximate for timestamps, contains for error messages. Assert only on what matters for the test scenario.

**10. Slow feedback:**

Description: Test suite takes too long to run. Developers stop running tests locally. CI has long queues.

Symptoms:
- Developers push without running tests
- CI queue is longer than 10 minutes
- Feedback time from push to test result is > 30 minutes
- Tests are run overnight, not per commit

Root cause: No sharding, no parallelism, no test selection. Tests that should be fast are slow because of I/O or E2E.

Fix: Parallelize tests. Shard by module or test file. Move slow tests (E2E, performance) to nightly. Use impact analysis to run only relevant tests. Set a time budget per CI stage.

**11. Testing the framework:**

Description: Tests verify behavior that is guaranteed by the framework or library (e.g., testing that an ORM saves a record, testing that a validation annotation works).

Symptoms:
- Tests for Spring, Hibernate, Django, Rails internals
- Tests for third-party library behavior
- Tests that pass even if the application code is removed
- Tests are slow to run and add no value

Root cause: Mistaking framework integration for application logic. The framework's behavior is already tested by the framework's own test suite.

Fix: Only test application code, not framework behavior. Test that your code interacts with the framework correctly, not that the framework does what it says. Use integration tests with the real framework to verify configuration rather than testing framework internals.

**12. Test pollution:**

Description: Tests modify global state (environment variables, static variables, system properties) without cleanup, affecting subsequent tests.

Symptoms:
- Tests fail depending on execution order
- CI failures are transient and change with test ordering
- Environment variable changes in one test break unrelated tests
- Singleton state leaks between tests

Root cause: Tests mutate shared state and assume they are the only test running.

Fix: Reset all global/static state in `@BeforeEach`/`before(:each)`. Use dependency injection instead of singletons. Use thread-local storage for request-scoped data. Never modify environment variables in tests (use mock config instead).

**13. Over-parameterized tests:**

Description: Single test methods are parameterized with dozens of cases, making the test hard to understand and debug.

Symptoms:
- Parameterized test has 20+ cases
- Failure message is unhelpful: "expected true but was false" without context
- Adding a new case requires understanding all existing cases
- Test method name no longer describes what is being tested

Root cause: Treating parameterized tests as a way to get high coverage quickly.

Fix: Use parameterized tests for 3-5 meaningful cases, each with a descriptive display name. Separate concerns: one parameterized test for one type of behavior. Use property-based testing for large numbers of examples.

**14. Conditional test logic:**

Description: Tests contain if statements, loops, try-catch blocks that change test behavior based on runtime conditions.

Symptoms:
- Test has `if` statements that alter the test flow
- Test catches exceptions and continues instead of failing
- Test has loops that iterate over dynamic data
- Test result depends on external conditions (time of day, network, etc.)

Root cause: Test is testing different scenarios in one method, or test is adapting to flaky conditions.

Fix: Each test case tests exactly one scenario. Extract conditional branches into separate test methods. Never catch exceptions in tests — let them fail. If the environment affects behavior, mock the environment.

**15. Orphaned tests:**

Description: Tests that no longer have corresponding production code, or that test features that have been removed.

Symptoms:
- Test passes even if production code is deleted
- Test references classes or methods that no longer exist
- Test has not been modified in 2+ years
- Removing the test does not change test suite results

Root cause: Code was removed or refactored but tests were not cleaned up.

Fix: Remove tests when removing code. Run a dead-code detection scan quarterly to find orphaned tests. If a test passes after deleting the code it covers, the test is orphaned and should be removed.

### Anti-Pattern Quick Reference

| Anti-Pattern | Detection | Severity | Fix Complexity |
|---|---|---|---|
| Testing implementation details | Test breaks on refactor | High | Medium |
| Mocking everything | 5+ mocks per test | Medium | Medium |
| No contract tests | Silent consumer breakage | Critical | High |
| Ignoring flaky tests | Retry passes | High | Medium |
| Coverage without quality | 100% coverage but mutations survive | Medium | Low |
| Shared test data | Order-dependent failures | High | Low |
| No regression for FIX | Same bug returns | High | Low |
| E2E for everything | 2+ hour suite | High | High |
| Brittle assertions | Timestamp/ID/format changes break | Low | Low |
| Slow feedback | Suite > 30 min | High | High |
| Testing the framework | Test passes without app code | Low | Low |
| Test pollution | Global state leakage | High | Medium |
| Over-parameterized tests | 20+ cases, no context | Low | Low |
| Conditional test logic | If/loop/try in test | Medium | Low |
| Orphaned tests | Test covers nothing | Low | Low |

---

## P18 — TEST ORGANIZATION BY SCALE

### Directory Structure

| Scale | Structure | Rationale |
|---|---|---|
| NANO | `tests/` | Single flat directory for tiny projects |
| MICRO | `tests/test_*.py` or `tests/*.test.js` | Colocated or simple test directory |
| SMALL | `src/**/*.test.*` alongside source | Colocated for easy navigation |
| MEDIUM | `tests/unit/`, `tests/integration/`, `tests/contract/` | Separated by test type for CI stage mapping |
| LARGE | Per-service: `services/*/tests/{unit,integration,contract,e2e}` | Clear service boundaries |
| ENTERPRISE | Per-service + shared `test-lib/` + impact analysis | Shared test utilities with independent test execution |

### Naming Conventions

**Test files:**
| Language | Convention | Example |
|---|---|---|
| Python | `test_<module>.py` | `test_user_service.py` |
| JavaScript | `<module>.test.js` | `user-service.test.js` |
| Java | `<Module>Test.java` | `UserServiceTest.java` |
| Go | `<module>_test.go` | `user_service_test.go` |
| Rust | `<module>_test.rs` | `user_service_test.rs` |
| Ruby | `<module>_spec.rb` | `user_service_spec.rb` |

**Test classes (when applicable):**
- `<ModuleName>Test` for unit tests
- `<ModuleName>IntegrationTest` for integration tests
- `<ModuleName>ContractTest` for contract tests
- `<ModuleName>E2ETest` for end-to-end tests

**Test methods:**
- Pattern: `test_<scenario>_<expected_behavior>`
- Examples:
  - `test_createUser_withValidData_returnsUserId`
  - `test_deleteUser_whenUserDoesNotExist_throwsNotFound`
  - `test_createUser_withDuplicateEmail_returnsConflict`

### Test Tagging and Labels

Tags enable selective test execution in CI. Standard tags:

| Tag | Meaning | Used By |
|---|---|---|
| `unit` | Unit test — no I/O, fast | PR gate |
| `integration` | Integration test — uses real I/O | PR gate |
| `contract` | Contract test — service boundary | PR gate |
| `e2e` | End-to-end test — full system | Merge queue, nightly |
| `smoke` | Critical path validation | Deploy pipeline |
| `slow` | Test takes > 5 seconds | Nightly, not PR |
| `flaky` | Known flaky test | Quarantine, nightly only |
| `perf` | Performance regression test | Nightly |
| `security` | Security regression test | Nightly |
| `mutation` | Mutation testing | Nightly |
| `smoke-prod` | Production smoke test | Post-deploy |

### Test Documentation

Every test should include:
- Descriptive name that explains the scenario and expectation
- Comment (optional) explaining why this test exists if not obvious from the name
- Reference to the requirement or issue number (if applicable)
- Clear arrange-act-assert structure with blank lines separating sections

Integration and E2E tests should additionally document:
- What external dependencies are required
- Any setup steps beyond standard test setup
- Expected execution order (if order matters)
- Known failure modes

---

## P19 — QUALITY GATES

### Tier 1 — Hard Block

These gates must pass before any merge. No exceptions.

- [ ] Test type matches change risk per pyramid (Section P3)
- [ ] Reproduction test for every FIX (must fail before, pass after)
- [ ] Contract test for every public API, schema, or event change
- [ ] No shared mutable state between tests
- [ ] No flaky tests in PR gate (quarantine or fix first)
- [ ] Coverage minimum met: 80% line, 70% branch for MEDIUM+ risk
- [ ] All unit and integration tests pass
- [ ] All contract tests pass (if API/schema changed)
- [ ] No secrets exposed in test output or logs
- [ ] Every new function has at least one unit test

### Tier 2 — Standard

These gates should pass for most changes. Exceptions require written justification.

- [ ] Integration test for every I/O boundary change
- [ ] E2E smoke test for CRITICAL risk changes
- [ ] Migration up/down test for SCHEMA changes
- [ ] Flaky tests tracked and remediated per protocol (Section P8)
- [ ] Test organization matches project scale (Section P18)
- [ ] Mutation score >= 60% for MEDIUM+ risk modules
- [ ] Performance regression test for hot path changes (nightly)
- [ ] Dependency vulnerability scan with no CRITICAL findings
- [ ] SAST scan with no CRITICAL/HIGH findings
- [ ] Test suite completes within time budget per risk level

### Tier 3 — Recommended

These gates improve quality but are not mandatory.

- [ ] Property-based tests for complex transforms, parsers, validation
- [ ] Disaster recovery test for INFRA changes
- [ ] Chaos experiment for CRITICAL risk changes
- [ ] Test coverage for error paths (not just happy path)
- [ ] Negative testing: malformed input, network failure, auth failure
- [ ] Performance baseline established before changes
- [ ] Production smoke test after deployment
- [ ] Flaky test ledger up to date with all known flaky tests
- [ ] Test documentation updated for new integration tests
- [ ] Orphaned test cleanup completed quarterly

### Self-Audit

```
Test type matches risk?                 → yes
FIX has reproduction test?              → yes
Contract tested if API change?          → yes
No shared state?                        → yes
Coverage minimum met?                   → yes
All unit/integration tests pass?        → yes
No flaky tests in PR gate?              → yes
Mutation score above threshold?         → yes
No CRITICAL dependency vulnerabilities? → yes
No CRITICAL SAST findings?              → yes
```

---

## P20 — TOOL REFERENCE

### Testing Frameworks by Language

| Language | Unit | Integration | Contract | E2E |
|---|---|---|---|---|
| Java | JUnit 5, TestNG | Testcontainers, SpringBootTest | Pact, Spring Cloud Contract | Selenium, Playwright |
| Kotlin | kotlin.test, Spek | Testcontainers | Pact | Selenium, Playwright |
| JavaScript/TypeScript | Jest, Vitest, Mocha | Supertest, Testcontainers | Pact, MSW | Playwright, Cypress |
| Python | pytest, unittest | pytest-docker, Testcontainers | Pact | Playwright, Selenium |
| Go | testing, testify | testcontainers-go | Pact | Playwright, Selenium |
| Rust | #[test], proptest | testcontainers-rs | Pact | — |
| Ruby | RSpec, Minitest | Database Cleaner, VCR | Pact | Capybara, Selenium |
| C# | xUnit, NUnit, MSTest | Testcontainers, WebApplicationFactory | Pact | Playwright, Selenium |

### Coverage Tools

| Language | Line/Branch | Mutation | Integration |
|---|---|---|---|
| Java | JaCoCo, Cobertura | PIT | Maven/Gradle plugin |
| Kotlin | JaCoCo, Kover | PIT | Gradle plugin |
| JavaScript/TypeScript | Istanbul, c8 | Stryker | Jest/Vitest plugin |
| Python | coverage.py | mutmut, Cosmic Ray | pytest plugin |
| Go | go test -cover | go-mutesting | Native |
| Rust | tarpaulin, grcov | mutagen | Cargo tool |
| Ruby | SimpleCov | mutant | RSpec plugin |
| C# | Coverlet, dotCover | Stryker.NET | .NET CLI |

### CI/CD Integration

| Platform | Test Integration | Parallelism | Reporting |
|---|---|---|---|
| GitHub Actions | matrix strategy, services | Job-level sharding | JUnit, Annotations |
| GitLab CI | parallel, artifacts, rules | Job-level sharding | JUnit, Merge Requests |
| Jenkins | parallel stages, agents | Node-level sharding | JUnit, HTML |
| CircleCI | parallelism, test splitting | Container-level sharding | JUnit, Insights |
| Azure Pipelines | jobs, stages, matrix | Job-level sharding | JUnit, Test Tabs |
| Buildkite | parallelism, artifact upload | Agent-level sharding | JUnit, Annotations |

### Contract Testing Tool Details

| Feature | Pact | Spring Cloud Contract | Schema Registry |
|---|---|---|---|
| Protocol | HTTP, gRPC, messaging | HTTP, messaging | Avro, Protobuf, JSON Schema |
| Consumer-driven | Yes | Yes | No (schema-based) |
| Provider verification | Yes | Yes | Yes (compatibility) |
| Contract broker | Yes (Pact Broker) | No (Git-based) | Yes (Schema Registry) |
| Versioning | Built-in | Git-based | Built-in |
| Best for | Microservices HTTP/gRPC | Spring Boot ecosystem | Event-driven architecture |

---

## Summary

Testing strategy is risk-based and proportional. Key principles:

1. **Test effort scales with risk**: CRITICAL risk changes get comprehensive testing; LOW risk changes get minimal testing.
2. **Test at the right level**: Unit for logic, integration for I/O, contract for boundaries, E2E for critical journeys only.
3. **Quality over quantity**: Mutation testing and assertion quality matter more than line coverage numbers.
4. **Every FIX needs a reproduction test**: A fix without a test is a bug waiting to return.
5. **Every API change needs a contract test**: Without contract tests, consumers break silently.
6. **Flaky tests are defects**: Quarantine or fix immediately. Never ignore.
7. **Test data must be isolated**: Every test creates its own data. No shared state.
8. **CI gates match risk level**: PR gate for fast feedback, nightly for deep verification.
9. **Mock at boundaries**: Mock external services, not internal collaborators. Prefer fakes over mocks.
10. **Production testing complements pre-production**: Feature flags, canaries, synthetic monitoring catch what pre-production misses.

---

**Synarc S2 risk floors, S6 error intelligence, S13 quality gates, S17 zero-tolerance violations apply. Test requirements scale with risk — never skip tests for HIGH+ changes.**
