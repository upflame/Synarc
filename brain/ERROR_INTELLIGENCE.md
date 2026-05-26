---
title: Error Intelligence — taskflow-api
type: error-log
status: active
version: 3.0.0
updated: 2026-05-24
owner: platform-team
repo: taskflow-api
tags:
  - errors
  - bugs
  - fixes
  - intelligence
  - patterns
---

# Error Intelligence — taskflow-api

Append-only. Updated after every FIX session by Synarc.
Used to detect fragile modules and recurring error patterns.

---

## Error: ERR-003 — 2026-05-24

**Class:** PERFORMANCE → FIX:UNPLANNED
**Session:** 20260524-a3f2
**Recurrence:** No (first occurrence of this pattern in this module)

### Location
- **File:** `src/integrations/router.ts` line 87
- **Module:** `integrations`
- **Layer:** logic (request handler)
- **Route:** `POST /tasks/:id/notify`

### Root Cause
Slack HTTP client called synchronously inside an Express request handler.
Slack's API averages 1.2s response time and spikes to 5s+ under load.
Express route blocked for the full duration of the Slack call, causing
HTTP 504 responses for users when Slack was slow.

### Impact
- **Scope:** MODULE (integrations route only)
- **Data loss:** No
- **Silent failure:** No (visible as 504 to users)
- **Users affected:** Any user triggering a Slack notification

### Fix Applied
Migrated Slack call from request handler to BullMQ async worker.
Handler now enqueues a job and returns `{queued: true}` in <1ms.

### Test Coverage
- **Existing test:** No (integration module had no unit tests)
- **Test written:** Yes
- **Test location:** `src/integrations/__tests__/slack-queue.test.ts`
- **Test covers:** job is enqueued with correct payload; handler returns 200 fast

### Follow-Up
- [ ] Add DLQ to `integrations.slack` queue
- [ ] Add same async migration to GitHub integration (same pattern suspected)

### Recurrence Flag
- **Previously seen:** No
- **Pattern:** N/A

---

## Error: ERR-002 — 2026-05-20

**Class:** LOGIC → FIX:BUG | PLANNED
**Session:** 20260520-c2d1
**Recurrence:** No

### Location
- **File:** `src/tasks/service.ts` line 134
- **Module:** `tasks`
- **Layer:** logic
- **Function:** `assignTask()`

### Root Cause
`assignTask()` checked user membership in `project` but used the wrong
membership table join — checked `project_members` instead of `project_users`.
These two tables have different role semantics. Users with viewer role
(in `project_users`) were incorrectly allowed to be assigned as task owners.

### Impact
- **Scope:** MODULE (tasks module only)
- **Data loss:** No
- **Silent failure:** Yes — no exception thrown; wrong data written
- **Users affected:** Any project with both viewers and assignable members

### Fix Applied
Corrected join in `assignTask()` to use `project_users` with `role IN ('member', 'admin')`.
Added explicit role check before assignment.

### Test Coverage
- **Existing test:** Partial (test existed but did not cover viewer role case)
- **Test written:** Yes
- **Test location:** `src/tasks/__tests__/service.test.ts` — added viewer role case
- **Test covers:** viewer cannot be assigned; member can; admin can

### Follow-Up
- [ ] Audit other functions in tasks/service.ts for same join error

### Recurrence Flag
- **Previously seen:** No
- **Pattern:** N/A

---

## Error: ERR-001 — 2026-05-15

**Class:** RUNTIME → FIX:CRASH | UNPLANNED
**Session:** 20260515-e9f3
**Recurrence:** No — but PATTERN DETECTED (see below)

### Location
- **File:** `src/auth/middleware.ts` line 42
- **Module:** `auth`
- **Layer:** contract (middleware)
- **Function:** auth guard middleware

### Root Cause
`req.user` was undefined when JWT verification failed silently. The
`verifyToken()` function caught the `JsonWebTokenError` and returned `null`
instead of throwing. The middleware then called `req.user.id` on the null
result without a guard — TypeError crash.

### Impact
- **Scope:** SYSTEM (auth middleware runs on all protected routes)
- **Data loss:** No
- **Silent failure:** No — crashed with 500 on any invalid/expired token
- **Users affected:** All users with expired tokens; all unauthenticated requests

### Fix Applied
Added null guard in middleware: `if (!req.user) return res.status(401).json(...)`.
Also fixed `verifyToken()` to throw instead of returning null on failure.

### Test Coverage
- **Existing test:** No
- **Test written:** Yes
- **Test location:** `src/auth/__tests__/middleware.test.ts`
- **Test covers:** expired token → 401 (not 500); missing token → 401; valid token → passes

### Follow-Up
- [x] Add null guard ← done
- [x] Fix verifyToken to throw ← done
- [ ] Audit: does any other module call verifyToken directly and expect null return?

### Recurrence Flag
- **Previously seen:** No
- **Pattern:** ⚠ FRAGILITY PATTERN DETECTED
  `verifyToken()` returning null instead of throwing is a swallowed-error pattern.
  Any future caller of this function could silently fail if they do not guard against null.
  Recommendation: add JSDoc `@throws` annotation + add lint rule disallowing null returns
  on auth functions.

---

## Pattern Summary

| Pattern                    | Occurrences | Affected Modules        | Status    |
|----------------------------|-------------|-------------------------|-----------|
| Sync external call in handler | 1 (ERR-003) | integrations          | Fixed     |
| Swallowed error / null return | 1 (ERR-001) | auth               | Fixed; fragility remains |
| Wrong table join           | 1 (ERR-002) | tasks                   | Fixed     |

No recurrences yet. Monitor: if ERR-001 pattern appears again in any module,
the swallowed-error anti-pattern is systemic.
