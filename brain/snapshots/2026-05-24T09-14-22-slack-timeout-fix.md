---
title: "Snapshot: Slack Sync Call → Queue Migration"
type: snapshot
status: archived
timestamp: 2026-05-24T09:14:22Z
commit: d4a1f83
branch: fix/slack-sync-timeout
author: dev-team
owner: platform-team
updated: 2026-05-24
version: 3.0.0
tags:
  - snapshot
  - archived
  - fix
  - integrations
  - performance
---

# Snapshot: Slack Sync Call → Queue Migration

## Metadata
- **Timestamp:** 2026-05-24T09:14:22Z
- **Commit SHA:** `d4a1f83`
- **Branch:** `fix/slack-sync-timeout`
- **Author:** dev-team
- **PR:** #214
- **WorkType:** `FIX:UNPLANNED` (discovered during performance review)

## Purpose
The `integrations` module was calling the Slack API synchronously inside
the POST /tasks/:id/notify route handler. Slack's API regularly takes 2–5s
under load, causing 504 errors for users. This snapshot records the migration
of that synchronous call to an async BullMQ job, eliminating the user-visible
timeout and making the handler return in <50ms.

## Systems Affected
- **Modules:** `integrations`, `infra/workers`
- **Contracts:** `POST /tasks/:id/notify` — response time SLA changed (50ms vs 5s)
- **Queue:** new queue `integrations.slack` added
- **Config:** no new env vars; uses existing `REDIS_URL`
- **Schema:** no DB changes

## Architecture Changes
- `integrations/slack-client.ts` → direct HTTP call removed from request path
- `workers/slack-processor.ts` → new BullMQ processor added
- `workers/index.ts` → new processor registered
- Slack calls now: POST handler → enqueue job → 200 response → worker picks up → Slack API call

## Data Flow

**Before:**
```
POST /tasks/:id/notify
  → integrations/router.ts
    → slackClient.sendMessage()   ← SYNC HTTP call to Slack (2–5s)
      → res.json({ ok: true })    ← blocks until Slack responds
```

**After:**
```
POST /tasks/:id/notify
  → integrations/router.ts
    → slackQueue.add('send-message', payload)   ← <1ms enqueue
      → res.json({ queued: true })              ← returns immediately

[async]
Worker: integrations.slack queue
  → slackProcessor
    → slackClient.sendMessage()   ← HTTP call now in worker context
    → success: job complete
    → failure: BullMQ retry (max 3, exponential backoff)
```

**Delta:** Request handler no longer blocks on Slack. Failure handling
moved from HTTP 504 to BullMQ retry logic. Response shape changed slightly.

## Dependencies Added

| Type    | Name / Identifier       | Used By           | Purpose                          |
|---------|-------------------------|-------------------|----------------------------------|
| Queue   | `integrations.slack`    | workers/index.ts  | Async Slack message delivery     |

No new npm packages — uses existing BullMQ + Redis infrastructure.

## Extension Points
- New Slack message types: add processor sub-type in `workers/slack-processor.ts`
- Other async integrations (GitHub, Linear, etc.): follow same queue pattern
- Retry policy: configurable per job type in processor config
- DLQ: `integrations.slack.failed` can be added for observability (not yet done)

## Risks Introduced

| Level  | Risk Description                                                  | Module          |
|--------|-------------------------------------------------------------------|-----------------|
| MEDIUM | Response shape changed: `{ok: true}` → `{queued: true}` — any   | integrations    |
|        | client checking `response.ok` instead of HTTP status may break   |                 |
| MEDIUM | No dead-letter queue on `integrations.slack` — failed Slack      | workers         |
|        | messages after 3 retries are silently dropped                     |                 |
| LOW    | Job payload not versioned — Slack API changes could corrupt queue | workers         |

## Breaking Changes
- **Breaking:** Partial — response body changed

| Breaking Change             | What Breaks                      | Migration Path                    |
|-----------------------------|----------------------------------|-----------------------------------|
| `{ok: true}` → `{queued: true}` | Any client reading `response.ok` | Clients should check HTTP 200, not body field |

No consumer of `POST /tasks/:id/notify` is known to read the response body (internal-only endpoint). Risk classified as LOW in practice.

## Cognitive Summary
This snapshot records the migration of the Slack API call from synchronous (in-request)
to asynchronous (BullMQ worker) in the integrations module. The root cause was a design
assumption — Slack is always fast — that does not hold under load. The fix follows the
existing BullMQ worker pattern already used by notifications, eliminating a HIGH risk
from the current state. Two residual MEDIUM risks remain: the response body change
(mitigated by the endpoint being internal-only) and the missing dead-letter queue on
the new Slack queue (all BullMQ workers in this codebase share this gap). The DLQ
gap should be resolved system-wide, not just for this queue.
