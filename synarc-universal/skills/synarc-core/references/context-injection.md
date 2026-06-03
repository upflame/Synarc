# Context Injection

The Synarc Context Block is the formatted context the agent carries into execution. There are 4 injection levels. The level is selected at SCAN time, based on the current task's risk and the project's scale.

## The 4 levels

| Level | Lines | When | What |
|-------|-------|------|------|
| SILENT | 0 | Pure read-only analysis | Nothing emitted; classification only in internal state |
| COMPACT | 4 | Per-tool-call execution | Scale, WorkType, Risk, Scope |
| STANDARD | 12 | Session start, scope change | Above + contracts affected, files in scope, recent errors |
| FULL | 40+ | LARGE/ENTERPRISE, cross-boundary work | Above + call graph, test coverage, recent sessions, dependency map |

## COMPACT (4 lines)

```text
[SYNARC v6.0.0]
Scale: MEDIUM
WorkType: FEATURE
Risk: MEDIUM
Scope: src/api/users/
```

Use COMPACT for every tool call in autonomous mode. The block travels with the call so the agent's reasoning is grounded in the current classification.

## STANDARD (12 lines)

```text
[SYNARC v6.0.0]
Scale: MEDIUM
WorkType: FEATURE
Risk: MEDIUM
Scope: src/api/users/
Contracts: src/api/users/openapi.yaml, src/db/users/schema.sql
Files in scope: src/api/users/router.ts, src/api/users/handler.ts, src/api/users/service.ts
Recent errors: ERR-USR-042 (resolved 2026-05-28), ERR-USR-043 (open)
Open diffs: feature/oauth-refresh
Tests: src/api/users/__tests__/service.test.ts (87% coverage)
```

Emit STANDARD at the start of every session and whenever the scope changes (e.g., user expands the task to include related modules).

## FULL (40+ lines)

```text
[SYNARC v6.0.0]
Scale: LARGE
WorkType: FEATURE
Risk: HIGH
Scope: src/api/users/ (cross-cutting: auth + billing + notifications)

Contracts:
  - src/api/users/openapi.yaml (12 endpoints, 4 breaking in this change)
  - src/db/users/schema.sql (3 tables, 1 migration needed)
  - proto/user/v1/user.proto (5 RPCs)

Files in scope:
  - src/api/users/router.ts (entry)
  - src/api/users/handler.ts (request validation)
  - src/api/users/service.ts (business logic)
  - src/api/users/repository.ts (data access)
  - src/auth/oauth.ts (shared with auth)
  - src/billing/usage.ts (shared with billing)

Call graph (incoming):
  - src/web/handlers/account.ts → src/api/users/service.ts
  - src/api/admin/users.ts → src/api/users/service.ts
  - src/api/users/handler.ts → src/api/users/service.ts

Call graph (outgoing):
  - src/api/users/service.ts → src/auth/oauth.ts
  - src/api/users/service.ts → src/billing/usage.ts
  - src/api/users/service.ts → src/notifications/email.ts

Test coverage:
  - src/api/users/__tests__/service.test.ts: 87%
  - src/api/users/__tests__/handler.test.ts: 72%
  - src/api/users/__tests__/repository.test.ts: 64%
  - e2e: cypress/e2e/users.cy.ts: 12 scenarios

Recent sessions:
  - 2026-06-03: debug-engineer — fixed ERR-USR-043 (race in token refresh)
  - 2026-06-02: security-engineer — added input validation to handler.ts
  - 2026-06-01: refactor — extracted service.ts from handler.ts

Open diffs:
  - feature/oauth-refresh (3 commits ahead of main)
  - feature/usage-meters (1 commit ahead of main)

Dependency map:
  - src/api/users depends on: src/auth (stable), src/billing (changing), src/notifications (stable)
  - src/billing/usage is the highest-risk dependency
```

Emit FULL when the project is LARGE/ENTERPRISE, or when the work crosses a service/module boundary.

## SILENT (0 lines)

For pure read-only analysis (ANALYSIS WorkType, INFO risk), do not emit a Context Block. The classification is held in internal state. The user does not need to see "WorkType: ANALYSIS | Risk: INFO" on every search.

If the analysis escalates to a fix, emit the full block at the moment of escalation.

## When to escalate levels

| Trigger | Escalate to |
|---------|-------------|
| Scale is LARGE or ENTERPRISE | FULL (at session start) |
| Cross-boundary change (touches > 1 module) | FULL |
| Aggregate risk reaches HIGH | FULL |
| User explicitly asks for context | FULL |
| User pastes an error trace | STANDARD + hand off to debug-engineer |
| Default per-tool-call | COMPACT |
| Read-only search, no mutation | SILENT |

## When to drop levels

If context budget is exhausted (rare in v6, but possible on small context windows), drop from FULL → STANDARD → COMPACT → SILENT. Never drop below the level required for the current risk. CRITICAL risk always gets FULL.

## Gotchas

- Never emit FULL on every interaction. The token cost compounds. Reserve FULL for genuinely cross-cutting work.
- Never emit SILENT when there is a mutation. SILENT is for read-only.
- The Context Block is the agent's grounding. If you cannot see it in the output, the agent is operating without grounding — a leading cause of wrong fixes.
- Do not put tool results in the Context Block. Tool results are Tier 4 (dynamic). The Block is Tier 1 (stable).
- The Block is not a substitute for thinking. The classification is computed, not asserted. If the Block says "WorkType: FEATURE" but the user's request was a bug report, fix the classification.
