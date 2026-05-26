---
title: Synarc v3 — Live Examples
type: reference
status: active
version: 4.0.0
updated: 2026-05-25
owner: synarc-engine
tags:
  - examples
  - demo
  - real-world
---

# Synarc v3 — Live Examples

Three real engineering scenarios showing exactly what Synarc auto-produces.

---

## Example 1: Unplanned Bug Fix (FIX:UNPLANNED, HIGH risk)

**User says:**
> "Getting a TypeError: Cannot read properties of undefined (reading 'id') in
> the auth middleware. Here's the error: `req.user.id` on line 42 of `src/auth/middleware.ts`"

**Synarc internal context block (SILENT):**
```
━━ SYNARC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 repo    : unknown (inferred: auth service)
 scale   : SMALL (inferred from context)
 arch    : unknown
 stack   : Node.js + TypeScript (inferred)
 work    : FIX:UNPLANNED
 risk    : HIGH (crash in auth path)
 session : 20260524-a3f2
 changed : []
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Synarc response:**

```
[WORK: FIX:UNPLANNED | RISK: HIGH]

Error class: RUNTIME — null/undefined access in auth middleware.

Root cause: `req.user` is undefined when the middleware runs before a route
that doesn't require auth, or when the JWT verification silently failed
without populating `req.user`. `req.user.id` then throws.

Fix:

// src/auth/middleware.ts — line 40-45
// BEFORE:
const userId = req.user.id;

// AFTER:
if (!req.user) {
  return res.status(401).json({ error: 'UNAUTHORIZED', code: 'NO_USER_CONTEXT' });
}
const userId = req.user.id;

─── SYNARC ──────────────────────────────────────────────
CHANGED : src/auth/middleware.ts
IMPACT  : All routes using this middleware — currently safe after fix
BREAKING: No — same contract, adds guard
RISK    : HIGH — this was a crash in the auth path; verify no routes
          bypass middleware silently (check router setup)
NEXT    : Add test: "should return 401 when req.user is undefined"
          Check: is JWT verification swallowing errors silently?
─────────────────────────────────────────────────────────
```

**Ledger entry generated (internal):**
```yaml
- id: 1
  timestamp: 2026-05-24T11:23:00Z
  work_type: FIX:UNPLANNED
  description: "Fixed null access on req.user.id in auth middleware"
  files: ["src/auth/middleware.ts"]
  risk: HIGH
  breaking: false
  error_class: RUNTIME
  error_resolved: true
```

---

## Example 2: Planned Feature with Schema Change (FEATURE:PLANNED + SCHEMA:DB_ADD)

**User says:**
> "I want to add multi-tenancy to the app. Each user should belong to a tenant.
> Plan it out and let's start."

**Synarc response:**

```
[WORK: FEATURE:PLANNED | RISK: HIGH]

Feature captured: Multi-tenancy — user-to-tenant relationship.

Implementation plan (grounded in inferred repo structure):

1. SCHEMA — Add `tenants` table + `tenant_id` to `users`
   Migration: tenants.sql → users_add_tenant.sql
   Risk: users.tenant_id is NOT NULL — migration requires default or
   backfill before constraint. Deploy order: migration first.

2. MODEL — Update User model to include tenantId
   File: src/users/model.ts (inferred)
   Impact: all code reading User shape — check all consumers

3. AUTH — JWT must include tenantId in payload
   File: src/auth/token.ts (inferred)
   ⚠ CONTRACT CHANGE — all consumers of req.user must be updated
   This is system-wide breaking if JWT shape changes mid-deploy.

4. SERVICE LAYER — Add tenant scoping to all DB queries
   Every query must now filter by tenantId — easy to miss one.
   Risk: data leak across tenants if any query omits filter.

5. CONFIG — Add TENANT_ISOLATION_MODE env var (strict|permissive)
   Allows rollout without hard cutover.

Start with step 1? I'll produce the migration SQL.

─── SYNARC ──────────────────────────────────────────────
CHANGED : (none yet — planning phase)
IMPACT  : auth, users, all DB queries, JWT contract — SYSTEM-WIDE
BREAKING: Yes — JWT payload change breaks all active sessions
RISK    : HIGH — data isolation failure = critical security risk
NEXT    : Write migration → update model → update auth → scope queries
          Add integration test: tenant A cannot see tenant B data
─────────────────────────────────────────────────────────
```

---

## Example 3: Production Incident (INCIDENT:OUTAGE)

**User says:**
> "Payments are down. Stripe webhook is returning 500. Started 15 minutes ago."

**Synarc response:**

```
[WORK: INCIDENT:OUTAGE | RISK: CRITICAL]

⚠ INCIDENT ACTIVE — Stripe webhook returning 500.

Immediate triage:

1. CHECK: What changed in the last 2 hours?
   → Any deployment? Schema migration? Config change? Dependency update?

2. CHECK: Is the 500 from your code or Stripe?
   → Check logs for stack trace. If your code: find the throw.
   → If Stripe: check Stripe status page + webhook signature validation.

3. MOST LIKELY CAUSES (ranked):
   a. Webhook signature secret rotated — STRIPE_WEBHOOK_SECRET mismatch
   b. Payload schema mismatch — Stripe changed event format, your parser broke
   c. DB write failing inside webhook handler — DB connection issue
   d. Missing env var after deployment — handler crashes on startup

4. IMMEDIATE MITIGATION:
   → If signature issue: re-sync secret from Stripe dashboard
   → If DB issue: check DB health + connection pool exhaustion
   → If schema: add try-catch + log full payload to isolate

─── SYNARC ──────────────────────────────────────────────
CHANGED : unknown — identify what changed 2h ago immediately
IMPACT  : All payment processing — revenue at risk
BREAKING: Unknown until root cause confirmed
RISK    : CRITICAL — production outage, financial impact
NEXT    : Share logs + recent deployment history
          I will produce incident snapshot once root cause is confirmed.
─────────────────────────────────────────────────────────
```

**Auto-emit: Incident snapshot skeleton (generated immediately):**

```markdown
---
title: "Snapshot: Stripe Webhook Outage 2026-05-24"
type: snapshot
status: archived
timestamp: 2026-05-24T11:45:00Z
commit: pending
branch: unknown
---

# Snapshot: Stripe Webhook Outage 2026-05-24

## Metadata
- Timestamp: 2026-05-24T11:45:00Z | Commit: TBD | Author: on-call

## Purpose
Production incident — Stripe webhook returning 500. Payment processing down.

## Systems Affected
- billing/stripe-webhook handler (confirmed)
- payment processing pipeline (downstream)
- [TBD once root cause confirmed]

## Architecture Changes
None (incident — no intentional change)

## Data Flow
Before: [normal webhook flow — TBD from codebase]
After: Handler returning 500 — webhook processing halted

## Dependencies Added
None

## Extension Points
[Post-resolution: add webhook idempotency, dead-letter handling]

## Risks Introduced
- [CRITICAL] Payment processing halted — financial + user impact
- [HIGH] Failed webhooks not replayed — potential missed events

## Breaking Changes
None intentional — incident, not a feature.

## Cognitive Summary
[To be completed after root cause is identified and resolved.]
```

---

## Example 4: Session Summary (user asks "what did we do?")

**After a session with 4 changes, user asks:**
> "Summarize what we did this session."

**Synarc response:**

```
Session: 20260524-a3f2 | 2026-05-24 | FIX:UNPLANNED → FEATURE:PLANNED

Changes this session:

| # | Type              | Description                          | Risk   | Breaking |
|---|-------------------|--------------------------------------|--------|----------|
| 1 | FIX:UNPLANNED     | Fixed null access in auth middleware  | HIGH   | No       |
| 2 | FEATURE:PLANNED   | Designed multi-tenancy implementation | HIGH   | Yes*     |
| 3 | SCHEMA:DB_ADD     | Migration: tenants table + user FK    | HIGH   | No**     |
| 4 | CONTRACT:RESPONSE | Updated User model to include tenant  | HIGH   | Yes***   |

* JWT payload will change — coordinate consumer updates
** Non-breaking only if backfill runs before NOT NULL constraint
*** All code reading User shape must update

Risks introduced: 3 HIGH
Risks resolved: 1 (auth crash fixed)
Peak risk: HIGH

Open items:
- [ ] JWT contract change — coordinate with all consumers
- [ ] Tenant query scoping — every DB query must be audited
- [ ] Test: tenant isolation (tenant A cannot see tenant B data)
- [ ] Test: req.user undefined guard in auth middleware

Safe to deploy: NO — tenant migration + JWT change require coordinated deploy.
Recommended order: migration → model → auth → query scoping → consumers.
```

---

## Example 5: Coding Agent — Multi-File Scaffold (FEATURE:PLANNED)

**Task given to coding agent:**
> "Scaffold a password reset module for the existing Node.js auth service.
> Needs: request endpoint, token generation, email queue, token validation endpoint."

**Synarc agent — task start (internal, not shown to user):**
```
━━ SYNARC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 repo    : taskflow-api
 scale   : MEDIUM
 arch    : modular monolith
 stack   : Node.js 20 + TypeScript
 work    : FEATURE:PLANNED
 risk    : MEDIUM (escalates if auth contract changes)
 session : 20260525-b7d3
 changed : []
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

declared_scope:
  task: scaffold password reset module
  files_expected:
    - src/auth/password-reset.service.ts
    - src/auth/password-reset.router.ts
    - src/workers/password-reset.processor.ts
    - src/auth/__tests__/password-reset.test.ts
  contracts_expected: [POST /auth/reset-request, POST /auth/reset-confirm]
  worktypes_expected: [FEATURE, SCHEMA]
```

**Agent execution (shown to user):**

```
[WORK: FEATURE:PLANNED | RISK: MEDIUM]

Scaffolding password reset module. Writing 4 files in dependency order.

─── PRE-WRITE: src/auth/password-reset.service.ts ──
scope: in | risk: MEDIUM | contract: none yet | rollback: revert file
Writing service layer first — no DB schema changes needed (using existing
tokens table with type='reset' discriminator).

[writes password-reset.service.ts]

─── PRE-WRITE: migrations/0013_add_reset_token_type.sql ──────────────
⚠ UNPLANNED SCOPE EXPANSION DETECTED
Declared scope: no migrations expected (tokens table assumed to exist)
Discovered: tokens table has no type column — discriminator requires migration
Additional risk: HIGH — SCHEMA:UNPLANNED, deployment order required
Recommendation: proceed with migration or redesign to avoid schema change?
Proceeding with migration (adding nullable column — non-breaking additive).
──────────────────────────────────────────────────────────────────────

[writes migration]
[writes router]
[writes processor]
[writes tests]

─── SYNARC AGENT HANDOFF ─────────────────────────────────────────────
Task      : scaffold password reset module
Status    : complete (with 1 unplanned scope expansion)

Files written:
  src/auth/password-reset.service.ts      FEATURE:PLANNED   MEDIUM  no
  src/auth/password-reset.router.ts       CONTRACT:ROUTE_ADD MEDIUM  no
  src/workers/password-reset.processor.ts FEATURE:PLANNED   LOW     no
  src/auth/__tests__/password-reset.test.ts FEATURE         LOW     no
  migrations/0013_add_reset_token_type.sql SCHEMA:UNPLANNED HIGH    no*

*Non-breaking: additive nullable column with default null

Contracts changed:
  POST /auth/reset-request  → new — update API_CONTRACTS.md
  POST /auth/reset-confirm  → new — update API_CONTRACTS.md

Tests written:
  password-reset.test.ts: happy path + expired token + invalid token + used token

Open items:
  [ ] Add POST /auth/reset-request and POST /auth/reset-confirm to API_CONTRACTS.md
  [ ] Rate limit POST /auth/reset-request (currently unlimited — brute force risk)

Safe to deploy: NO
  Reason: migration must run BEFORE deploying application code
  Deploy order: migration → deploy app → verify /auth/reset-request returns 200

Brain update required:
  [ ] CURRENT_STATE.md — add password-reset to auth module capabilities
  [ ] CHANGE_LEDGER.md — 2 sessions recorded: FEATURE:PLANNED + SCHEMA:UNPLANNED
  [ ] API_CONTRACTS.md — add 2 new endpoints
──────────────────────────────────────────────────────────────────────
```

---

## Example 6: Coding Agent — Mid-Task CRITICAL Stop (INCIDENT)

**Task given:** Fix a slow query in the tasks module.
**Mid-task discovery:** The "fix" requires removing an index used by a different query.

**Agent response when discovering the conflict:**

```
[WORK: FIX:UNPLANNED → RISK ESCALATED TO CRITICAL]

⚠ CRITICAL RISK DETECTED — STOPPING BEFORE EXECUTING

Declared task: fix slow query in tasks.getByProject()
Discovery: The proposed index change (DROP INDEX idx_tasks_project_id) would
fix getByProject() but BREAK tasks.getByAssignee() which relies on the same index.

Impact:
  tasks.getByAssignee() → currently uses idx_tasks_project_id via partial scan
  After drop: full table scan on tasks (currently 2.3M rows in prod — timeout risk)
  Risk: CRITICAL — production query timeout on a hot path

I am NOT proceeding with the index drop.

─── SYNARC ──────────────────────────────────────────────
CHANGED : nothing (stopped before execution)
IMPACT  : tasks.getByAssignee() — full table scan risk on 2.3M rows
BREAKING: Yes — would degrade tasks.getByAssignee() to timeout under load
RISK    : CRITICAL — cannot drop index without covering getByAssignee()
NEXT    : Option A: Add composite index covering both queries, then drop old
          Option B: Rewrite getByAssignee() to use a different access path
          Option C: Accept the slow query and address with caching instead
─────────────────────────────────────────────────────────
```

---

## Example 7: Code Review — Agent as Reviewer

**PR diff given:** Changes to `src/auth/middleware.ts` and `src/users/router.ts`

**Agent review output:**

```
[WORK: ANALYSIS | RISK: HIGH — reviewing auth + user contract changes]

Code Review: PR #231 — "Add role-based access to user endpoints"

BLOCK src/auth/middleware.ts:47
  checkRole() returns undefined when role is not found instead of throwing.
  Line 47: return roles.includes(req.user.role) — if req.user is undefined,
  this throws TypeError rather than returning 401.
  Fix: guard req.user before accessing .role.

BLOCK src/users/router.ts:89
  GET /users/:id now returns the full user object including passwordHash.
  This is a data exposure bug — passwordHash must be excluded from responses.
  Fix: use a UserResponseDTO that explicitly excludes sensitive fields.

CHANGE src/users/router.ts:102
  Missing test for the 403 case when user requests another user's data.
  The permission check exists but has no test coverage.

COMMENT src/auth/middleware.ts:31
  checkRole() and checkPermission() share 80% of their logic.
  Consider merging into a single checkAccess(role?, permission?) function
  to reduce future divergence risk. Not blocking.

REVIEW SUMMARY
  Overall risk: HIGH (data exposure bug blocks merge)
  Breaking changes: 0
  Test coverage: gaps on 403 path — CHANGE required before merge
  Deployment order: not required
  Recommendation: BLOCK — resolve data exposure + req.user guard before merge

─── SYNARC ──────────────────────────────────────────────
CHANGED : (review only — no files modified)
IMPACT  : auth middleware + user read endpoints
BREAKING: no — but BLOCK on data exposure
RISK    : HIGH — passwordHash in response = data breach risk
NEXT    : Author to fix 2 BLOCK items; request re-review
─────────────────────────────────────────────────────────
```
