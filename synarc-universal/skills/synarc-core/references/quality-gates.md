# Quality Gates

Per-WorkType zero-tolerance enforcement. Each WorkType has a set of "must pass" checks. If any check fails, the work is not done.

## Universal gates (apply to every WorkType)

- [ ] The classification was emitted before the work started.
- [ ] The risk level was stated on every action.
- [ ] A ledger entry was written for every mutation.
- [ ] The rollback path is known and stated.
- [ ] The user's declared scope was not silently expanded.

## Per-WorkType gates

### ANALYSIS

- [ ] The answer addresses the user's actual question, not a rephrased version.
- [ ] If the analysis discovered a bug, the suggested WorkType was emitted, not the fix.
- [ ] All file references include file:line.
- [ ] No speculative claims without data backing them.

### DOCS

- [ ] No factual claims that contradict the code.
- [ ] All examples are runnable (or marked as illustrative).
- [ ] Spelling and grammar are clean.
- [ ] Links resolve (no `404` placeholders).
- [ ] No copy-paste of README content into deeper files.

### REFACTOR

- [ ] No behavior change. Before/after tests pass identically.
- [ ] No new lint warnings.
- [ ] No new lint disables.
- [ ] Public API unchanged (or CONTRACT WorkType flagged).
- [ ] Diff is reviewable in < 10 minutes.

### TEST

- [ ] Each test has one assertion focus (or a tightly coupled set).
- [ ] Test name describes the behavior, not the implementation.
- [ ] Test does not depend on order with other tests.
- [ ] Test cleans up after itself (no shared state leak).
- [ ] Test runs in < 1 second (unit) or < 30 seconds (integration).

### FIX

- [ ] Root cause stated as `file:line — cause` with evidence.
- [ ] Regression test added that fails before the fix and passes after.
- [ ] The fix is minimal (smallest change that fixes the issue).
- [ ] The fix does not introduce new lint warnings.
- [ ] The fix does not silently change the contract.

### CONFIG

- [ ] The previous value is documented in the commit message.
- [ ] A rollback path is specified.
- [ ] The change is applied to all relevant environments.
- [ ] No secrets are committed.
- [ ] The config schema is validated (no typos in keys).

### INFRA

- [ ] The change is in version control.
- [ ] The change is applied via IaC (not manual `kubectl` or `aws` calls).
- [ ] A dry-run was performed and the output reviewed.
- [ ] A rollback procedure is documented and tested.
- [ ] The change is staged (dev → staging → prod), not all-at-once.

### FEATURE

- [ ] Feature flag exists and is off by default.
- [ ] The flag has a kill switch (toggleable in < 30 seconds).
- [ ] The feature has unit, integration, and e2e tests.
- [ ] The feature is documented (user-facing docs + API docs).
- [ ] The feature is monitored (metric, alert, log).

### CONTRACT

- [ ] Migration plan exists and is documented.
- [ ] All consumers are notified (issue, email, deprecation header).
- [ ] Deprecation window is set (typically ≥ 6 months).
- [ ] Versioning strategy is applied (URL, header, or schema).
- [ ] Backward compatibility is maintained within the deprecation window.

### SECURITY

- [ ] Threat model is updated.
- [ ] Penetration test or SAST scan is run.
- [ ] The fix does not regress other security controls.
- [ ] Audit log captures the change.
- [ ] Disclosure is coordinated (CVE, advisory, customer notice if needed).

### PERF

- [ ] Baseline benchmark is captured before the change.
- [ ] The change is measured under the same load as baseline.
- [ ] No regression on other metrics (memory, error rate, CPU).
- [ ] The change is profiled, not assumed.
- [ ] Results are documented with the change.

### INCIDENT

- [ ] Mitigation is in place before root-cause work begins.
- [ ] Customer impact is bounded and communicated.
- [ ] Incident commander is assigned.
- [ ] Status updates are emitted at fixed intervals.
- [ ] Postmortem is scheduled within 5 business days.

## Test pyramid (per scale)

| Scale | Unit | Integration | E2E | Contract | Chaos |
|-------|------|-------------|-----|----------|-------|
| TINY | Required | Optional | No | No | No |
| SMALL | Required | Required | Optional | No | No |
| MEDIUM | Required | Required | Required | Optional | No |
| LARGE | Required | Required | Required | Required | Optional |
| ENTERPRISE | Required | Required | Required | Required | Required |

## Coverage floors (per WorkType)

| WorkType | Coverage floor |
|----------|----------------|
| FIX | The fixed function must have a regression test (no global coverage requirement) |
| FEATURE | New code must have ≥ 80% line coverage |
| REFACTOR | No coverage drop |
| CONTRACT | New code ≥ 80%, modified consumers re-tested |
| SECURITY | Threat-modeled code paths must have explicit tests |
| PERF | The hot path must be covered (no global floor) |

## Gotchas

- "Tests pass" is not a quality gate if the tests do not test the right thing.
- "Coverage is 80%" is not a quality gate if the 20% is the security-critical branch.
- The gates are the floor, not the ceiling. Exceeding them is fine; not meeting them is a fail.
- If a gate cannot be met, document why and propose an alternative. Silently skipping a gate is a protocol violation.
- Quality gates are the agent's commitment, not the user's request. The user did not ask for tests; the agent commits to them as part of doing the work right.
