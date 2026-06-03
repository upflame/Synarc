---
name: testing-strategy
description: Testing Strategy â€” Risk-Based Testing & Coverage
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---

# Testing Strategy â€” Risk-Based Testing & Coverage

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

Test requirements scale with risk â€” a LOW-risk ANALYSIS change needs less verification than a HIGH-risk CONTRACT change. These rules are additive to any project-specific test conventions.


## P2 â€” RISK-BASED TESTING APPROACH

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


## P4 â€” TEST TYPE SELECTION FRAMEWORK

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
Is new logic added?           â†’ Unit test required
Does change touch I/O?        â†’ Integration test required
Does API/event contract change? â†’ Contract test required
Is change CRITICAL risk?      â†’ E2E smoke test required
Is this a FIX?                â†’ Reproduction test required
Is this a SCHEMA change?      â†’ Migration test required
Is this a CONFIG change?      â†’ Startup validation test required
Is this INFRA change?         â†’ Idempotency test required
Is this an INCIDENT?          â†’ Reproduction test required

If 0 required tests:          â†’ No test needed (documentation/content)
If 1+ required tests:         â†’ All must pass before merge
If CRITICAL risk:             â†’ Add performance + security tests
```


## P6 â€” TEST REQUIREMENTS BY WORKTYPE

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
- Add user registration endpoint â†’ unit test validation logic, integration test DB insert, contract test endpoint request/response, E2E for full registration flow
- Add caching layer â†’ unit test cache hit/miss/expiry, integration test with real cache, performance test for latency improvement
- Add reporting dashboard â†’ unit test aggregation logic, integration test data query, snapshot test dashboard render

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
- Fix off-by-one in pagination â†’ test page boundaries, last page, empty page
- Fix null pointer on user profile â†’ test user with missing fields
- Fix race condition in inventory update â†’ integration test with concurrent requests
- Fix wrong currency conversion â†’ test with multiple currency pairs, zero values, very large values

### REFACTOR

**Minimum requirements:**
- No new tests if behavior is unchanged
- All existing tests pass without modification
- If any test changes: the change is not a pure refactor â€” classify as FEATURE or FIX

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
- Add a column â†’ test that existing rows get the default, new rows can set the column, rollback removes the column without affecting data
- Remove a column â†’ test that dependent queries fail clearly, rollback restores the column, archived data is not affected
- Rename a column â†’ test that old and new queries work during transition, rollback restores the old name
- Add a table â†’ test that migrations apply in order, seed data is valid, rollback removes the table

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
- REST API â†’ Pact contract per consumer, OpenAPI/Swagger validation
- gRPC â†’ Protobuf contract, backward compatibility checked with buf
- Event/Message â†’ Avro/Protobuf schema registry, compatibility check on publish
- GraphQL â†’ Schema diff, field deprecation before removal
- Shared library â†’ public API surface test, binary compatibility with previous version

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
- Feature flag change â†’ test feature enabled, disabled, no flag set
- Rate limit change â†’ test limit applied, limit removed, limit at boundary
- Log level change â†’ test that log output level changes correctly
- Timeout change â†’ test that timeout is respected and overridable
- Connection string change â†’ test that reconnection works with new string

### INFRA

**Minimum requirements:**
- Idempotency test: applying the same infrastructure change twice produces the same state
- Drift detection test: infrastructure matches declared configuration
- Rollback test: destroy and recreate the resource cleanly

**Quality checks:**
- Declarative infrastructure: apply â†’ verify state â†’ apply again â†’ verify no changes
- Resource creation: test with minimum required properties
- Resource deletion: test that dependent resources are handled correctly
- Permissions: test that the service principal has required permissions
- Secrets: test that secrets are not exposed in logs or state files

**Examples:**
- Terraform module â†’ init, plan, apply, verify state, second apply is no-op, destroy
- Docker Compose â†’ start services, verify health, stop, verify cleanup
- Helm chart â†’ install, upgrade, rollback, verify
- Kubernetes manifest â†’ apply, verify pod/deployment/service, delete, verify cleanup
- CI pipeline â€” run pipeline, verify each step, verify cleanup

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
- Service outage due to DB connection exhaustion â†’ reproduction with max connections, verification with connection pool limit, monitoring assertion on connection pool metrics
- Data corruption due to concurrent write â†’ reproduction with concurrent writes, verification with locking/transaction, monitoring assertion on integrity check
- Auth bypass â†’ reproduction with missing token edge case, verification with correct validation, monitoring assertion on auth failure metrics
- Memory leak â†’ reproduction with sustained load, verification with fix applied, monitoring assertion on memory metrics


## P8 â€” FLAKY TEST REMEDIATION

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

**Step 1 â€” Detect and report:**
- CI detects flaky test (fails then passes on retry)
- Test is logged to flaky test ledger
- Notification sent to team channel

**Step 2 â€” Triage (within 24 hours):**
- Assign owner based on test location (module owner)
- Classify root cause using classification table above
- Determine fix approach
- If no clear root cause: mark as "needs investigation"

**Step 3 â€” Quarantine decision:**
- If fix expected within 48 hours: leave in suite, skip on flaky retry
- If fix expected > 48 hours: move to quarantine suite
- If 3+ non-reproducible failures: delete test
- Quarantine suite runs nightly but does not block any gate

**Step 4 â€” Fix:**
- Apply targeted fix based on root cause
- Verify fix: test passes 10 consecutive runs in CI
- Move test back to main suite
- Document root cause and fix in test ledger

**Step 5 â€” Track:**
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


## P10 â€” TEST EXECUTION IN CI/CD

### Pipeline Stages

**Stage 1 â€” Pre-flight (0-30 seconds):**
- Lint and static analysis
- Type checking
- Dependency vulnerability scan (fail on CRITICAL/HIGH)
- Build compilation
- No tests run at this stage

**Stage 2 â€” Unit tests (1-5 minutes):**
- All unit tests, parallelized by module
- Max time depends on project scale
- Fail fast: stop on first failure (configurable)
- Coverage report generated

**Stage 3 â€” Integration tests (2-10 minutes):**
- All integration tests, sharded by database/resource
- Testcontainers or CI-managed services
- Retry flaky tests once automatically
- Coverage report merged with unit

**Stage 4 â€” Contract tests (2-5 minutes):**
- Consumer contract verification
- Provider contract verification
- Schema compatibility check
- Published to contract broker

**Stage 5 â€” E2E smoke tests (5-15 minutes):**
- Critical user journeys only (not full E2E suite)
- Deployed to preview/staging environment
- Run in parallel by journey

**Stage 6 â€” Coverage gate (30 seconds):**
- Line coverage >= threshold
- Branch coverage >= threshold
- Mutation score >= threshold
- Report generated and published

**Stage 7 â€” Performance (10-30 minutes) â€” nightly only:**
- Load test on critical endpoints
- Latency comparison against baseline
- Throughput degradation detection

**Stage 8 â€” Security (5-15 minutes) â€” nightly only:**
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
| PR (blocks merge) | Lint â†’ Unit â†’ Integration â†’ Contract â†’ Coverage | 15 min | Yes | 1 retry for flaky, fail on second |
| Merge Queue | Full Unit+Integration â†’ E2E Smoke â†’ Perf Spot Check | 25 min | Yes | No retry â€” must pass clean |
| Nightly | Full E2E â†’ Load â†’ Mutation â†’ Vuln Scan â†’ All Contracts | 60 min | No (file bugs) | 3 retries per flaky test |
| Release | Full Nightly + Security Audit + Pen Test | 120 min | Yes | No retry |
| On-Demand | Full suite, any branch | 120 min | No | As configured |

### Test Failure Response Protocol

**PR failures:**
1. Unit / Integration / Contract failure â†’ block merge, notify author
2. Author has 2 hours to fix during business hours, next morning otherwise
3. If not fixed within SLA: revert the change, reassign
4. Coverage below threshold â†’ block merge, author must add tests or justify
5. Perf regression > 5% â†’ block merge, author must optimize or document acceptance

**Merge queue failures:**
1. Any failure â†’ remove from merge queue
2. Author is notified before the next attempt
3. Same fix timeline as PR failures
4. Three consecutive failures â†’ file a bug, notify tech lead

**Nightly failures:**
1. E2E failure â†’ file a bug, no block unless 3+ consecutive nights
2. Perf regression â†’ file a bug, add to perf tracking dashboard
3. Security vulnerability â†’ CRITICAL: page on-call; HIGH: file bug with 48h SLA
4. Mutation score drop â†’ file a bug, add to tech debt tracker

### Test Result Artifacts

Every CI run must produce:
- Test results (pass/fail per test) in JUnit XML format
- Coverage report (line, branch, function) in Cobertura or JaCoCo format
- Duration breakdown (per test, per suite, per stage)
- Flaky test detection report
- Failure stack traces and logs
- Environment information (OS, language version, dependency versions)


## P12 â€” PERFORMANCE TESTING METHODOLOGY

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
| Merge Queue | Spot check on changed endpoint | p95 latency Â± 10% of baseline | Warn if exceeded |
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


## P14 â€” TESTING IN PRODUCTION

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
- Test the critical user journey: login â†’ search â†’ action â†’ logout
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


## P16 â€” TEST REPORTING AND METRICS

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


## P18 â€” TEST ORGANIZATION BY SCALE

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
| `unit` | Unit test â€” no I/O, fast | PR gate |
| `integration` | Integration test â€” uses real I/O | PR gate |
| `contract` | Contract test â€” service boundary | PR gate |
| `e2e` | End-to-end test â€” full system | Merge queue, nightly |
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


## P20 â€” TOOL REFERENCE

### Testing Frameworks by Language

| Language | Unit | Integration | Contract | E2E |
|---|---|---|---|---|
| Java | JUnit 5, TestNG | Testcontainers, SpringBootTest | Pact, Spring Cloud Contract | Selenium, Playwright |
| Kotlin | kotlin.test, Spek | Testcontainers | Pact | Selenium, Playwright |
| JavaScript/TypeScript | Jest, Vitest, Mocha | Supertest, Testcontainers | Pact, MSW | Playwright, Cypress |
| Python | pytest, unittest | pytest-docker, Testcontainers | Pact | Playwright, Selenium |
| Go | testing, testify | testcontainers-go | Pact | Playwright, Selenium |
| Rust | #[test], proptest | testcontainers-rs | Pact | â€” |
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


**Synarc S2 risk floors, S6 error intelligence, S13 quality gates, S17 zero-tolerance violations apply. Test requirements scale with risk â€” never skip tests for HIGH+ changes.**
