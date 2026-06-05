---
name: sdet-engineer
schema: skill-pack/v1
skill_type:
  - capability
  - workflow
dependencies:
  - synarc-core: ">=6.0.0"
  - testing-strategy: ">=2.0.0"
  - backend-engineer: ">=2.0.0"
title: SDET Engineer — Test Automation, Contract Testing, E2E Infrastructure
description: SDET engineering reasoning — test automation framework design, page object model, screen play pattern, contract testing (Pact, consumer-driven), end-to-end testing at scale (Playwright, Cypress, Selenium), visual regression testing, cross-browser and cross-device testing, flaky test remediation, test data management, parallel test execution, CI/CD test orchestration, headless test infrastructure, test observability. Distinct from testing-strategy (what to test) — this is how to build the test infrastructure. Inherits synarc core.
version: 1.0.0
category: quality
tags:
  - sdet
  - test-automation
  - e2e-testing
  - contract-testing
  - pact
  - playwright
  - cypress
  - page-object-model
  - visual-regression
  - flaky-tests
  - test-infrastructure
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# SDET Engineer — Test Automation, Contract Testing, E2E Infrastructure

Inherits synarc core. All synarc prohibitions apply.

testing-strategy decides what to test. sdet-engineer builds the machinery to test it at scale: frameworks, fixtures, contract tests, visual regression, flaky test remediation, CI orchestration.


## P2 — TEST AUTOMATION FRAMEWORK

### P2.1 — Framework Selection

```
UI TESTS:
  Playwright:        best in 2026, cross-browser, fast, good DX
  Cypress:           great DX, limited cross-browser, JS-only
  Selenium:          legacy, slow, but every language supported
  WebdriverIO:       Selenium wrapper, modern
  Puppeteer:         Chrome-only, headless, good for scraping

API TESTS:
  REST:               Supertest (Node), pytest + requests, RestAssured
  GraphQL:            graphql-request, Apollo testing utilities
  gRPC:               grpcurl, ghz (load)

CONTRACT TESTS:
  Pact:               consumer-driven, language-agnostic
  Specmatic:          spec-driven, OpenAPI
  Spring Cloud Contract: JVM-specific

MOBILE:
  Appium:             cross-platform
  XCUITest:           iOS native
  Espresso:           Android native
  Maestro:            YAML-based, mobile-first

DECISION FACTORS:
  - Stack: matches your codebase
  - Cross-browser: yes for B2C, maybe not for B2B internal
  - Speed: parallel + headless is 10x faster
  - Reliability: handles async, retries, network failures
  - DX: good errors, traces, screenshots
```

### P2.2 — Test Architecture Patterns

```
PAGE OBJECT MODEL (POM):
  One class per page, methods for actions
  Pros: reusable, maintainable
  Cons: verbosity, can become bloated

  class LoginPage {
    async login(email, password) { ... }
  }

SCREENPLAY PATTERN:
  Actors, tasks, abilities
  Pros: more scalable, BDD-friendly
  Cons: more boilerplate

FLUENT API:
  Page.action().assert()
  Pros: readable
  Cons: custom DSL to maintain

RECOMMENDATION FOR 2026:
  Playwright + page object model + fixtures for test data
  Or Playwright + component testing for component-first apps
```

### P2.3 — Test Data Management

```
STRATEGIES:
  FACTORY:           function that creates a valid entity
  FIXTURE:           pre-canned data loaded before test
  BUILDER:           fluent builder, default valid + override
  FAKER:             generate realistic data
  SNAPSHOT:          recorded real data, scrubbed of PII
  API-BASED:         create via API in setup, faster than UI

RULES:
  - Each test creates its own data (no shared state)
  - Cleanup after test (DB transaction rollback, or delete)
  - No PII in fixtures (use faker or scrub)
  - Test data is deterministic where possible (no random failures)
  - Use factories over hardcoded JSON

EXAMPLE:
  const user = await UserFactory.create({ email: 'test@example.com' });
  await loginPage.login(user.email, 'password123');
  // automatic cleanup after test
```


## P3 — CONTRACT TESTING

### P3.1 — Why Contract Testing

```
PROBLEM:
  - Service A (consumer) expects response shape X
  - Service B (provider) changes to shape Y
  - A breaks in production
  - E2E tests catch this, but E2E is slow + flaky

CONTRACT TESTING:
  - Consumer defines expected contract (shape, status, fields)
  - Provider verifies it can satisfy the contract
  - No integration needed
  - Fast, reliable, language-agnostic

WORKFLOW:
  1. Consumer writes: "I expect GET /users/123 to return {id, email, name}"
  2. Provider runs: "Can I satisfy this expectation?"
  3. CI: both run on every change
  4. Provider can't ship if it breaks a contract
```

### P3.2 — Pact (Consumer-Driven)

```
CONSUMER (e.g., web frontend):
  describe('User API', () => {
    it('returns user by id', async () => {
      await provider.addInteraction({
        state: 'user 123 exists',
        uponReceiving: 'a request for user 123',
        withRequest: { method: 'GET', path: '/users/123' },
        willRespondWith: {
          status: 200,
          body: { id: 123, email: 'a@b.com', name: 'Alice' }
        }
      });
      const user = await userClient.get(123);
      expect(user.name).toBe('Alice');
    });
  });

PROVIDER (e.g., users service):
  Verifies all consumer contracts still work.
  Runs in CI: "all consumer contracts pass" or fail.

WHERE TO STORE CONTRACTS:
  - Pact Broker: dedicated service for sharing
  - Git: simpler, one repo per consumer-provider pair
```

## P4 — END-TO-END TESTING AT SCALE

### P4.1 — Scaling E2E

```
PROBLEMS AT SCALE:
  - 100s of tests, 30+ min suite
  - Flaky, environment-dependent
  - Slow feedback loop
  - Hard to debug failures

STRATEGIES:
  PARALLELIZE:           run tests in parallel across N workers
  SHARD:                 split suite by feature/team
  SELECTIVE:             run only tests affected by PR
  INCREMENTAL:           fast smoke for every PR, full suite nightly
  CONTAINERIZED:         each test in a fresh container

  TRADE-OFF:
    speed vs. cost
    isolation vs. realism
    coverage vs. maintenance
```

### P4.2 — Flaky Test Remediation

```
COMMON CAUSES:
  - Race conditions:        test depends on timing
  - Network:                test depends on external service
  - State:                  test depends on previous test
  - Animations:             clicks before animation completes
  - Selectors:              CSS selectors change
  - Time:                   test depends on current time

REMEDIATION:
  - AUTO-RETRY:              1-2 retries with backoff
  - WAIT-FOR:                explicit waits for state
  - STABLE SELECTORS:        data-testid, role, label (not CSS class)
  - MOCK EXTERNAL:           don't depend on real services
  - ISOLATE STATE:           each test creates + cleans up
  - DETERMINISTIC TIME:      inject clock
  - TRACK FLAKINESS:         which tests fail > 1% of runs

QUARANTINE:
  - Quarantine flaky tests
  - Track in dashboard
  - Fix within 1 sprint or delete
  - Do not let the suite rot
```

## P5 — VISUAL REGRESSION TESTING

### P5.1 — Visual Diff

```
CONCEPT:
  - Take screenshot of UI
  - Compare to baseline
  - Diff pixels
  - Block on unintended changes

TOOLS:
  - Chromatic (Storybook-native, paid)
  - Percy (paid)
  - Loki (OSS, Storybook)
  - Playwright screenshot (manual)
  - BackstopJS (OSS)

RULES:
  - Baseline: a known-good snapshot
  - Threshold: how much diff is acceptable (0.1% for icons, 1% for full page)
  - Review every diff: intent or regression?
  - Update baseline only on approved changes
  - Test at multiple breakpoints, themes, viewports
```

### P5.2 — When Visual Tests Catch What Unit Tests Miss

```
VISUAL TESTS CATCH:
  - CSS regressions: a style change broke another component
  - Layout shifts: new component affects existing layout
  - Font / icon changes
  - Browser-rendering differences
  - Theme bugs (dark mode broken in one place)
  - Responsive breakpoints broken

VISUAL TESTS DO NOT CATCH:
  - Logic bugs
  - Performance regressions
  - Accessibility issues (use axe-core instead)
  - Real interaction flows

USE BOTH: unit + integration + e2e + visual + a11y
```

## P6 — CI/CD TEST ORCHESTRATION

### P6.1 — Test Stages

```
ON EVERY PR:
  - Lint + type check (1-2 min)
  - Unit tests (5-10 min)
  - Component tests (5 min)
  - Contract tests (5 min)
  - A11y tests (2 min)
  - Fast smoke E2E (10-15 min)
  - Visual regression on affected components (5 min)

ON MERGE TO MAIN:
  - Full E2E suite (30-60 min)
  - Cross-browser E2E (60+ min)
  - Performance tests
  - Security scans

NIGHTLY:
  - Full E2E on real staging
  - Load tests
  - Long-running tests (memory leaks, etc.)

GATING:
  - PR: must pass fast suite
  - Deploy to staging: must pass full suite
  - Deploy to prod: must pass smoke + canary
```

### P6.2 — Test Reporting

```
EVERY RUN REPORTS:
  - Total tests, pass/fail/skip
  - Per-test duration
  - Failure details: stack, screenshot, video, trace
  - Flaky test list (this run and historical)
  - Coverage delta

TOOLS:
  - Allure
  - ReportPortal
  - Datadog Test Optimization
  - Buildkite Test Analytics
  - GitHub Actions annotations

DASHBOARDS:
  - Pass rate over time
  - Flaky test leaderboard
  - Slowest tests
  - Coverage trend
  - Test execution cost
```

## P7 — HEADLESS TEST INFRASTRUCTURE

```
COMPONENTS:
  - Browsers:      Playwright bundles them, no setup
  - Devices:       Playwright device descriptors (iPhone, Pixel, etc.)
  - Network:       mock, intercept, throttle
  - Storage:       in-memory or ephemeral DB per test
  - Auth:          pre-authenticated context (Playwright storage state)

DOCKER:
  - Selenium grid in Docker
  - Playwright in Docker with all browsers
  - Test database in Docker
  - Network simulation (toxiproxy)

CLOUD:
  - BrowserStack
  - Sauce Labs
  - LambdaTest
  - Playwright Cloud (Microsoft)
  - Self-hosted: more cost, more control
```

## P8 — OUTPUT FORMATS

### P8.1 — Test Plan

```
FEATURE:         [name]
RISK:            [high/medium/low]
TEST PYRAMID:
  unit:          [count, what]
  integration:   [count, what]
  contract:      [count, what consumers/providers]
  e2e:           [count, key flows]

CRITICAL FLOWS (must always pass):
  - [flow 1]
  - [flow 2]

NON-CRITICAL (best effort):
  - [flow 3]

FLAKY TEST POLICY:
  - Auto-retry: [yes/no, max 2]
  - Quarantine: [yes/no, after 3 fails]
  - SLA:        [fix within 1 sprint]

CI GATING:
  - PR:        [fast suite must pass]
  - Staging:   [full suite must pass]
  - Prod:      [smoke + canary must pass]
```

### P8.2 — Flaky Test Report

```
TEST:                [name]
FLAKE RATE:          [X% over last 100 runs]
FIRST SEEN:          [date]
ROOT CAUSE:          [race / network / selector / state / time]
FIX:                 [specific change]
OWNER:               [engineer]
DUE:                 [date]
STATUS:              [investigating / fixing / quarantined / fixed]
```

## P9 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| E2E for everything | Slow, flaky, expensive | Test pyramid: many unit, fewer E2E |
| CSS selectors in tests | Break on every redesign | data-testid, role, label |
| Tests share state | Order-dependent, fragile | Each test creates + cleans up |
| No flake tracking | Suite rots | Track, quarantine, fix in 1 sprint |
| Visual tests only on critical pages | Miss regressions | Cover key components + flows |
| Mock everything | Tests pass but integration breaks | Mock externalities, keep internal real |
| Skip contract tests, rely on E2E | Slow feedback, hard to localize | Pact/Specmatic between services |
| Test in production code paths | Test code in prod bundle | Separate test build, test-only code paths |
| No test data strategy | Tests depend on shared fixtures | Factories, builders, per-test data |
| Quarantine indefinitely | Suite slowly dies | 1-sprint SLA to fix or delete |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every framework choice, contract test, or test infrastructure change.*

*Escalate to sre-engineer when: test infra has reliability issues. Escalate to security-engineer when: test data contains PII or secrets.*
