---
title: "Synarc v4 — Quickstart for Coding Agents"
type: onboarding
status: active
version: 4.0.0
updated: 2026-05-25
owner: synarc-engine
tags:
  - quickstart
  - onboarding
  - coding-agent
  - production-ready
---

# Synarc v4 — Quickstart for Coding Agents

Synarc is always-on in every coding agent session.
Zero configuration. Zero exceptions. This guide explains what happens
automatically and what commands you can issue explicitly.

---

## What Synarc does automatically on every interaction

| What happens                          | When                              |
|---------------------------------------|-----------------------------------|
| Classifies the WorkType               | Before every response             |
| Assesses and sets risk level          | Before every response             |
| Flags PLANNED vs UNPLANNED            | On every change                   |
| Flags breaking changes                | Immediately when detected         |
| Flags unplanned scope expansion       | Immediately with ⚠                |
| Appends inline footer                 | On every engineering response     |
| Records ledger entry                  | After every non-ANALYSIS response |
| Runs Error Intelligence (6 steps)     | On every FIX worktype             |
| Checks auto-emit rules                | After every response              |
| Runs pre/post tool-call checks        | In agent loops, per tool call     |
| Emits checkpoint                      | After 5 tool calls or HIGH risk   |
| Emits agent handoff block             | At end of every agent task        |

You do not need to ask for any of these. They run by default.

---

## What the inline footer means

Every engineering response ends with:

```
─── SYNARC ──────────────────────────────────────────────
CHANGED : [files or modules affected]
IMPACT  : [downstream effects]
BREAKING: yes — [what breaks and migration path] | no
RISK    : [CRITICAL|HIGH|MEDIUM|LOW|INFO] — [one-line reason]
NEXT    : [recommended next action or "none"]
─────────────────────────────────────────────────────────
```

Footer is suppressed automatically on:
- ANALYSIS or DOCS worktype
- NANO/MICRO scale + INFO/LOW risk
- User explicitly requests display suppression (tracking still runs)

---

## Session commands — ask these at any time

| Command                           | Response                                          |
|-----------------------------------|---------------------------------------------------|
| `what did we change?`             | Full session ledger                               |
| `summarize this session`          | One-paragraph cognitive session summary           |
| `is this safe to deploy?`         | Risk delta + explicit YES / NO + reasons          |
| `what tests are missing?`         | All unfilled test gaps from this session          |
| `what's still open?`             | All follow-up items from ledger                   |
| `generate a snapshot`             | Full /brain/snapshots/ entry                      |
| `write the change ledger`         | CHANGE_LEDGER.md entry ready to commit            |
| `show synarc context`             | Display current context block                     |
| `what broke?`                     | All breaking: true entries in session             |
| `create CURRENT_STATE.md`         | Living architecture snapshot                      |
| `create MODULE_MAP.md`            | Module index from session context                 |
| `create API_CONTRACTS.md`         | All contracts from session context                |
| `full handoff`                    | Agent handoff block + all brain update tasks      |
| `what is the risk?`               | Current session aggregate risk + all risks        |
| `did anything go unplanned?`      | All ⚠ UNPLANNED entries from session              |

---

## First session — how to give Synarc context

The more context you provide at session start, the better the cognition.

### Option A: Paste a brain file (best)
```
Here is our CURRENT_STATE.md:
[paste /brain/CURRENT_STATE.md]

Today's task: [describe what you want to do]
```

### Option B: Describe the project (good)
```
Project: Node.js 20 REST API with Express + PostgreSQL + Redis
Scale: MEDIUM — team of 4, ~15k LOC, 6 modules
Modules: auth, users, tasks, projects, notifications, infra
Today's task: [describe what you want to do]
```

### Option C: Paste code + task (minimum)
```
[paste relevant file(s)]
Task: [what you want to do with this code]
```

### Option D: Just describe the task (Synarc infers)
```
I need to add multi-tenancy to our SaaS platform.
We use Django + PostgreSQL. Currently no tenant isolation.
```
Synarc infers: FEATURE:PLANNED | LARGE scale | HIGH risk (schema + auth change).

---

## Risk levels — what they mean and what to do

| Level    | What it means                                 | Agent action                     |
|----------|-----------------------------------------------|----------------------------------|
| CRITICAL | Data loss / auth bypass / production outage   | STOP. Surface. Wait for decision.|
| HIGH     | Contract broken / migration needed / security | Surface before proceeding        |
| MEDIUM   | Performance / subtle change / test gap        | Note and continue                |
| LOW      | Style / naming / minor inconsistency          | Track silently                   |
| INFO     | Observation, no action needed                 | Internal only                    |

**In agent mode:**
- CRITICAL → always stop and surface before next tool call
- HIGH → surface at next natural checkpoint
- MEDIUM / LOW → record in ledger; surface at session end

---

## WorkType codes — reference

| Code             | What it means                                              |
|------------------|------------------------------------------------------------|
| `FEATURE:P`      | Planned new feature — intent declared before implementation|
| `FEATURE:UP`     | Unplanned feature — scope expanded beyond declared task    |
| `FIX:BUG`        | Logic error in existing behavior                           |
| `FIX:CRASH`      | Runtime crash — null ref, type error, unhandled exception  |
| `FIX:SECURITY`   | Auth bypass, injection, data exposure                      |
| `FIX:DATA`       | Data corruption or loss                                    |
| `FIX:REGRESSION` | Was working, broke by recent change                        |
| `REFACTOR:*`     | Code restructuring — behavior must stay identical          |
| `SCHEMA:DB_ADD`  | New DB column or table — additive                          |
| `SCHEMA:DB_REMOVE`| DB column removed — CRITICAL                             |
| `SCHEMA:DB_RENAME`| DB column renamed — CRITICAL                             |
| `CONTRACT:*`     | API route, export, or type signature change                |
| `CONFIG:*`       | Env vars, flags, secrets, pipeline config                  |
| `INFRA:*`        | Docker, K8s, Terraform, CI/CD                              |
| `INCIDENT`       | Production emergency — always CRITICAL — overrides all     |
| `ANALYSIS`       | Read-only understanding — no tracking required             |
| `PLAN`           | Pre-implementation planning — no code written yet          |

---

## Coding agent — production scenarios

### "Write a feature from scratch"
```
I want to add [feature]. Here's what it should do: [description].
```
Synarc → FEATURE:PLANNED | captures intent | produces implementation plan |
tracks every file written | checks contract changes | emits tests | handoff block

### "Fix a bug"
```
Getting [error]. Here's the stack trace: [paste] / Here's the code: [paste]
```
Synarc → FIX worktype | Error Intelligence 6 steps | root cause before fix |
test requirement enforced | ledger entry | recurrence check

### "Review this code / PR"
```
Review this code / diff for issues: [paste]
```
Synarc → ANALYSIS | layer-by-layer review | BLOCK/CHANGE/COMMENT/APPROVE format |
risk classified | breaking changes identified | test gaps listed

### "Refactor this module"
```
Refactor [module/file] to [goal]. Current code: [paste]
```
Synarc → REFACTOR | states current behavior first | confirms target identical |
flags any behavior drift as UNPLANNED | tracks all renamed exports

### "Production is down"
```
INCIDENT: [what is broken]. Error: [paste]. Started: [time].
```
Synarc → INCIDENT mode | CRITICAL immediately | incident triage protocol |
do not produce any other output until stabilisation plan is stated

### "Scaffold a new project"
```
Scaffold a [type] project using [stack]. It needs to: [requirements].
```
Synarc → FEATURE:PLANNED | minimum viable structure | .env.example always |
README always | error handling from day one | CURRENT_STATE.md generated

---

## Brain files — commit these to your repo

Generated files to commit after any session:

```bash
git add brain/
git commit -m "synarc: update brain — [session summary]"
```

Minimum brain for each scale:

| Scale      | Files to commit                                       |
|------------|-------------------------------------------------------|
| NANO       | None (optional CURRENT_STATE.md)                      |
| MICRO      | brain/CURRENT_STATE.md                                |
| SMALL      | brain/CURRENT_STATE.md, MODULE_MAP.md, API_CONTRACTS.md|
| MEDIUM     | All 8 brain files + snapshots/                        |
| LARGE+     | All 12 brain files + snapshots/ + SERVICE_REGISTRY.md |

---

## Claude Code integration

Add to your repo's `CLAUDE.md`:

```markdown
## Synarc

This repo uses Synarc v4 for engineering cognition.

Load at session start:
- /brain/CURRENT_STATE.md (always)
- /brain/MODULE_MAP.md (when navigating modules)
- /brain/API_CONTRACTS.md (when touching APIs)
- /brain/CHANGE_LEDGER.md — last 3 sessions (when resuming work)

Synarc rules:
- Classify every change before executing
- Flag all unplanned scope with ⚠
- Produce inline Synarc footer on all engineering responses
- Update CHANGE_LEDGER.md at session end
- Generate snapshot on every significant feature or fix
- Run pre/post checks on every file write

Active risks (keep this updated from /brain/CURRENT_STATE.md):
[paste current risks here]
```
