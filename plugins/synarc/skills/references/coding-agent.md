---
title: "Coding Agent"
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - coding-agent
  - autonomous
  - execution-model
  - tool-use
  - cognition-layer
---

# Purpose

Execution model for autonomous coding agents under cognition-layer supervision — per-tool-call classification, scope enforcement, risk aggregation, safe execution.

# Scope

Single-turn and autonomous agent execution, tool call classification, scope boundaries, checkpoint protocol, handoff protocol, error recovery. Does not cover prompt templates or deployment infrastructure.

# Inputs

User request, repository state, change taxonomy, project scale, tool call results.

# Output

Classified tool calls, enforced scope boundaries, risk-aggregated change summaries, agent handoff blocks.

# Notes

All sections reference SKILL.md anchors [S0-S21]. Cross-references use `->` notation.

## 1. Coding Agent Execution Model

Every agent tool call goes through: Classify -> Inject -> Execute -> Log -> Checkpoint.

### What "always-on" means

The cognition layer classifies and tracks every interaction. In single-turn mode: one classification, one response. In autonomous mode: classification per tool call, scope tracked across the session, checkpoint at risk thresholds.

Classification happens BEFORE the tool executes — the AI never acts without knowing the WorkType and risk.

## 2. Tool Call Classification [CA-S2]

Every agent action maps to a WorkType:

| Tool Call | WorkType | Risk | Notes |
|---|---|---|---|
| Read file | ANALYSIS | MICRO | Always safe |
| Write new file | FEATURE | MEDIUM | Check for overwrite |
| Edit existing file | FIX or REFACTOR | MEDIUM | Confirm no contract break |
| Delete file | INFRA | HIGH | Check imports across repo |
| Create directory | INFRA | MICRO | Low risk |
| Execute command (read-only) | ANALYSIS | MICRO | git log, grep, etc |
| Execute command (mutating) | INFRA | HIGH | npm install, migrate, etc |
| Search/Glob | ANALYSIS | MICRO | Read-only |
| API call (read) | ANALYSIS | MICRO | External data fetch |
| API call (write) | FEATURE | MEDIUM | Check idempotency |

Multiple tool calls in a task are tracked as a session chain. Cumulative risk = max(individual) + 1 per contract break beyond the first.

## 3. Scope Boundary Enforcement

### Scope declaration

At task start, declare scope internally:

```yaml
declared_scope:
  task: "[what I'm doing]"
  files: ["file1", "file2"]
  modules: ["module-a"]
  risk_cap: MEDIUM
  contract_changes_allowed: false
```

### Out-of-scope detection

Per tool call, if the call touches a file/module outside `declared_scope`:
- MICRO risk: log and continue
- MEDIUM+: pause, report scope expansion, require confirmation

### Cascading scope expansion

If a change in file A requires a change in file B which requires a change in file C, this is cascading scope. When detected, the agent must checkpoint current state before proceeding.

## 4. Agent Checkpoint Protocol

For tasks exceeding 5 tool calls or HIGH+ aggregate risk:

1. Serialize session state (ledger, scope, files written)
2. Write checkpoint to brain directory
3. Log checkpoint ID in session ledger
4. Continue execution

On resume: load checkpoint, verify scope still valid, continue from last unexecuted call.

## 5. Agent-Specific Risk Aggregation

Each tool call contributes to cumulative session risk. The aggregate is:

```
aggregate_risk = max(
  max(call_risk),
  sum(call_risk) / 3,   # diminishing returns on many low-risk calls
  base_risk + contract_breaks * 2
)
```

If aggregate crosses MEDIUM, enforce checkpoint. If it crosses HIGH, require human confirmation before next write/delete.

## 6. File Write Safety Protocol

Every file write follows:

1. Pre-write check: read existing file content, verify it's what was expected
2. Write: apply the change
3. Post-write check: verify file is parseable, no syntax errors
4. Ledger: log file path, operation, timestamp

For destructive operations (delete, overwrite without read): require explicit confirmation from scope declaration.

## 7. Multi-File Coordination

When a task requires changes to multiple files:

1. Read all affected files first (batch reads)
2. Determine write order (dependents last)
3. Execute writes in order
4. After all writes: run project-level validation (compile, lint, test)

Risk is based on number of files affected:
- 1-2 files: MICRO
- 3-5 files: SMALL
- 6+ files: MEDIUM
- Escalate one level if contracts change

## 8. Command Execution Safety

Safe commands (execute without review): grep, find, git log, git diff, ls, cat, head, tail, echo, pwd, which, npm ls

Unsafe commands (require confirmation): npm install, pip install, git push, git merge, rm, mv, kill, docker, kubectl, terraform, migration commands

For unsafe commands: log the exact command, get confirmation, execute, log result.

## 9. Error Recovery Protocol

When the agent encounters an error mid-task:

1. Stop current tool call
2. Classify error (transient vs permanent)
3. If transient: retry with backoff (max 3 attempts)
4. If permanent: log error, checkpoint, report to human
5. For partial success: log which steps succeeded, which failed, resume from last success

Transient errors: network timeout, rate limit, API 503, file lock
Permanent errors: syntax error, type error, missing dependency, auth failure

## 10. Language Rules

| Language | Type Rules | Key Patterns |
|---|---|---|
| TypeScript/JS | Explicit return types on public functions | Prefer `interface` over `type` for object shapes |
| Python | pyright/mypy strict mode | Type annotate all function params and returns |
| Go | Accept interfaces, return structs | `io.Reader`/`io.Writer` for I/O boundaries |
| SQL | Every migration must be reversible | Add columns as nullable first, backfill, then NOT NULL |
| Shell | `set -euo pipefail` | Quote all variable expansions |

## 11. Per-Framework Rules

| Framework | Key Patterns | Test Requirements | Risk Notes |
|---|---|---|---|
| Next.js | Server Components default, `'use client'` explicit, `loading.tsx` + `error.tsx` per route segment | RTL per component, e2e for critical paths | `loading.tsx` missing = blank page. Route handler changes are CONTRACT. |
| Django | Fat models, thin views, service layer in `services/`, `select_related` for all querysets | pytest-django, factory_boy, DRF APITestCase | Model change is SCHEMA. View change is CONTRACT. Migration order matters. |
| Spring Boot | Controller -> Service -> Repository layered, constructor injection, `@Transactional` on service layer | @WebMvcTest for controllers, @DataJpaTest for repos, @SpringBootTest for integration | @Transactional missing = data inconsistency. Public method signature change = CONTRACT. |
| Rails | Service objects in `app/services/`, query objects in `app/queries/`, `config/credentials.yml.enc` for secrets | RSpec request specs for contracts, model specs for validations | Migration rollback must be tested. credentials.yml.enc = CONFIG:SECRET. |
| FastAPI | Pydantic v2 models, dependency injection for auth/DB, `APIRouter` with versioned prefixes | httpx test client, pytest-asyncio for async endpoints | Pydantic model change = SCHEMA. Router prefix change = CONTRACT:ROUTE_CHANGE. |
| Express/NestJS | `express.Router()` for grouping, error-handling middleware last, NestJS `@Module()` with explicit imports/exports | supertest for e2e, Jest for unit, NestJS Test.createTestingModule | Middleware order change = behavioral. Module boundary change = CONTRACT. |

## 12. What to Log Per Tool Call

```json
{
  "timestamp": "2027-05-25T10:30:00Z",
  "tool": "write_file",
  "file": "src/service.ts",
  "worktype": "FIX",
  "risk": "MEDIUM",
  "duration_ms": 340,
  "checkpoint_id": "ckpt-003"
}
```

Log at INFO level. WARN for retries. ERROR for unrecoverable failures.

## 13. Debugging a Stuck Agent

When agent loops, repeats, or fails to progress:

1. Check ledger: same file read 5+ times? -> scope confusion
2. Check scope: files touched outside declared scope? -> cascading
3. Check errors: same error repeating? -> permanent failure not being escalated
4. Check token usage: context window full? -> checkpoint and resume

## 14. Multi-Agent Handoff Schema

```yaml
handoff:
  from_agent: "agent-id-001"
  to_agent: "agent-id-002"
  timestamp: "2027-05-25T10:30:00Z"
  context:
    task: "Add retry logic to payment service"
    completed: ["file1.ts"]
    remaining: ["file2.ts"]
    risk: "MEDIUM"
    checkpoint_id: "ckpt-003"
```

Conflict resolution: if two agents write to same file, last-writer-wins unless the write is within an active transaction. Write conflicts trigger a checkpoint + human review.

## 15. Testing Agent-Generated Code

For every file an agent writes, auto-run:

- Syntax check (parse the file)
- Type check (tsc, pyright, go vet)
- Lint (eslint, ruff, golangci-lint)
- Existing test pass (no regression)
- New tests exist for new code

If any gate fails: log the failure, checkpoint, and report. Do NOT retry automatically on type/lint errors — fix the root cause.

## 16. Secure File Write Protocol

Before writing, scan content for:
- API keys, passwords, tokens (regex match common patterns)
- Hardcoded connection strings
- Internal IP addresses or hostnames
- AWS/GCP/Azure account IDs

If detected: replace with env var reference or config import. Never commit secrets.

## 17. Self-Review Prompt

After writing code, agents check:
1. Purpose: does this code do what the task asked?
2. Correctness: happy path, error path, edge cases
3. Safety: error handling, logging, timeout handling
4. Style: naming, structure, consistent with codebase
5. Completeness: tests, documentation, config

## 18. Code Quality Gates

Gate 1: Syntax (immediate) — all files parse, imports resolve
Gate 2: Types (immediate) — no type errors
Gate 3: Tests (per task) — all pass, new code has new tests
Gate 4: Lint (per task) — no errors, matches conventions
Gate 5: Security (per task) — no hardcoded secrets, no injection vectors
Gate 6: Architecture (per task) — no circular deps, no layer violations

## 19. Decision Trees

### Tree 1: Start Task

1. Read task description
2. Declare scope (files, modules, risk cap)
3. Load relevant brain files
4. Classify WorkType + Risk
5. Begin ledger
6. Execute first tool call

### Tree 2: Before Every Tool Call

1. Classify this call (WorkType + Risk)
2. Verify within declared scope
3. If file write: read existing content first
4. If command: verify safe or get confirmation
5. If HIGH risk: checkpoint before executing
6. Execute
7. Log to ledger
8. Update aggregate risk

### Tree 3: Error Recovery

1. Classify error: transient or permanent?
2. If transient: retry (max 3, exponential backoff)
3. If permanent: log, checkpoint, report
4. If partial success: resume from last success
5. If unrecoverable: full rollback

## 20. Rollback Procedure

1. List all files written in this session
2. For each file: determine if rollback possible (git revert, backup, manual)
3. Execute rollback in reverse write order
4. Verify rollback: check file state, run tests
5. Log rollback in session ledger

Partial rollback: files that are independent can be rolled back individually. Files with cross-dependencies must be rolled back as a group.
