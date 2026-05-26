---
title: Current State — taskflow-api
type: cognitive-memory
status: active
version: 3.0.0
updated: 2026-05-24
owner: platform-team
repo: taskflow-api
branch: main
commit: d4a1f83
scale: MEDIUM
tags:
  - current-state
  - cognition
  - medium-scale
---

# Current State — taskflow-api

---

## Active Architecture
- **Style:** Modular monolith + async workers
- **Runtime:** Node.js 20.11 + TypeScript 5.4
- **Framework:** Express 4.19 (HTTP) + BullMQ 5 (queue)
- **DB:** PostgreSQL 15.3 (primary) + Redis 7.2 (cache + queue backend)
- **Entry points:**
  - HTTP API: `src/server.ts` → `:3001`
  - Worker: `src/workers/index.ts` → BullMQ processors
  - Cron: `src/cron/index.ts` → scheduled jobs
- **Deploy:** Docker Compose (local), Fly.io (production), single region

## Major Modules

| Module           | Responsibility                           | Owner     | Entry Point                     |
|------------------|------------------------------------------|-----------|---------------------------------|
| `auth`           | JWT issue/verify/refresh, session mgmt   | platform  | `src/auth/router.ts`            |
| `users`          | User CRUD, profile, preferences          | core      | `src/users/router.ts`           |
| `tasks`          | Task CRUD, assignment, status workflow   | core      | `src/tasks/router.ts`           |
| `projects`       | Project CRUD, membership, permissions    | core      | `src/projects/router.ts`        |
| `notifications`  | Email + in-app via queue                 | platform  | `src/workers/notifications.ts`  |
| `integrations`   | GitHub, Slack webhook receivers          | integr.   | `src/integrations/router.ts`    |
| `infra`          | DB pool, Redis client, logger, config    | platform  | `src/infra/index.ts`            |

## Important Contracts
- `POST /auth/token` — issues `{accessToken, refreshToken, user: {id, email, role}}`; all services depend on this shape
- `POST /auth/refresh` — refresh flow; access TTL: 15m, refresh TTL: 7d
- `TaskStatusChanged` event → queue `tasks.events`; consumed by notifications + integrations workers
- `UserInvited` event → queue `notifications.email`; consumed by notifications worker
- DB: `tasks` table → `users` table via `assigned_to_id` FK; `tasks` → `projects` via `project_id` FK

## Current Risks
- `[HIGH]` JWT secret read from `process.env.JWT_SECRET` with no existence check at startup — silent crash possible
- `[HIGH]` `integrations` module calls Slack API synchronously inside request handler — Slack timeout (5s) = user-visible 504
- `[MEDIUM]` notifications worker has no dead-letter queue — failed emails are silently dropped; no retry
- `[MEDIUM]` DB connection pool is global (shared across all modules) — one module consuming all connections blocks others
- `[MEDIUM]` No rate limiting on `POST /auth/token` — credential stuffing risk
- `[LOW]` `projects` module has no unit tests — only integration tests; refactor risk is high

## Extension Paths
- **Safe:** Add new task status values — `tasks/status.enum.ts` is the single source of truth
- **Safe:** Add new BullMQ processors — worker infra is decoupled; add a processor, register in `src/workers/index.ts`
- **Safe:** Add new project permission roles — `projects/permissions.ts` is config-driven
- **Safe:** Add new integration webhooks — `integrations/router.ts` is additive-friendly
- **Avoid:** Changing JWT payload shape — `req.user` is read directly in 12 route guards without abstraction
- **Avoid:** Modifying `tasks` or `users` DB schema without coordinated migration — both are referenced across 4 modules
- **Avoid:** Adding synchronous external API calls to request handlers — use the queue pattern instead

## Invariants
- All DB writes go through `src/infra/db.ts` — no raw `pg` calls in route handlers
- Auth middleware runs on every route except `GET /health` and `POST /auth/token`
- All queue jobs must be idempotent — BullMQ replays on failure; non-idempotent jobs cause duplicate side effects
- All timestamps stored in UTC; all API responses include timestamps in ISO8601 format
- `project_id` is always required on task creation — orphaned tasks are not allowed

## Cognitive Summary
taskflow-api is a Node.js modular monolith serving task and project management via REST,
with async side effects (email, webhooks) handled by BullMQ workers. The main risk
surfaces are: the JWT secret startup gap (silent crash on misconfigured deploy), the
synchronous Slack call in the integrations module (user-facing timeout risk), and the
absent dead-letter queue in notifications (silent email loss). The DB schema is tightly
coupled — the `tasks` and `users` tables are referenced across four modules, making
schema changes system-wide events. Extension is safest by adding new queue processors
or new route modules that follow the established pattern. The JWT payload shape is the
most fragile contract in the system — 12 guards consume it directly.
