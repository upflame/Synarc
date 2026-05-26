---
title: Session Tracking + Change Ledger
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - session
  - tracking
  - ledger
  - continuity
  - cognition-layer
---

# Purpose

Maintain session state across every interaction — persisting change context, risks, and decisions so the next interaction picks up where the last left off.

# Scope

Session state schema, ledger entry schema, CHANGE_LOG.md schema, session commands, continuity patterns, recovery patterns.

# Inputs

Tool call history, change taxonomy classifications, file diffs, user intent, project scale.

# Output

Persistent session state, change ledger entries, brain document updates, session recovery data.

# Notes

At session end: update CURRENT_STATE.md, write ledger entry, archive snapshot. Ledger appends, never overwrites.

# Session ID Generation

Session IDs use the format `<YYYYMMDD>-<random-4char>`:
- `20270525-a3f2` — session started 2027-05-25
- Random suffix prevents collision across parallel sessions
- Generated at session start, immutable for the session lifetime

# Session State Schema (internal)

Maintained in memory during a session:

```yaml
session:
  id: "20270525-a3f2"
  started: "2027-05-25T10:30:00Z"
  task: "<declared task>"
  worktype: <FEATURE|FIX|REFACTOR|...>
  risk: <INFO|LOW|MEDIUM|HIGH|CRITICAL>
  scope:
    files: ["src/file1.ts", "src/file2.ts"]
    modules: ["module-a"]
    risk_cap: MEDIUM
  ledger:
    - seq: 1
      tool: read_file
      file: "src/file1.ts"
      worktype: ANALYSIS
      risk: MICRO
      timestamp: "2027-05-25T10:30:00Z"
    - seq: 2
      tool: edit_file
      file: "src/file1.ts"
      worktype: FIX
      risk: MEDIUM
      timestamp: "2027-05-25T10:30:05Z"
  aggregate_risk: <INFO|LOW|MEDIUM|HIGH|CRITICAL>
  contract_breaks: 0
  checkpoint_id: "ckpt-003"
  files_written: ["src/file1.ts"]
```

# Ledger Entry Schema

Every tool call produces one ledger entry:

```yaml
- seq: <integer>
  tool: <read_file|write_file|edit_file|delete_file|execute_command|search|api_call>
  file: "<file path>"
  worktype: <WorkType>
  risk: <Risk>
  duration_ms: <integer>
  error: "<error message or null>"
  checkpoint_id: "<checkpoint ID or null>"
  timestamp: "<ISO8601>"
```

Ledger is append-only. Each entry is immutable after creation. Risk field uses the call's individual risk before aggregation.

# CHANGE_LOG.md Interaction Model

CHANGE_LOG.md is the persistent append-only log at `/brain/CHANGE_LOG.md`.

- **Per session:** one entry appended at session end
- **Per checkpoint:** an entry is also appended (partial state, marked `[CHECKPOINT]`)
- **Recovery:** on crash/interruption, scan for last non-checkpoint entry or the last checkpoint entry
- **Format:** entries are chronological, newest last. Each entry is self-contained (no cross-entry dependencies)

# CHANGE_LOG.md Schema

One entry per session (or checkpoint):

```markdown
# Change: <session-id> — YYYY-MM-DD

## Summary
[One sentence: what was done, what worktype, what risk]

## Scope
- Task: [declared task]
- Files: [list of files changed]
- Modules: [list of modules touched]

## Ledger
| Seq | Tool | File | WorkType | Risk |
|-----|------|------|----------|------|
| 1 | read_file | src/file1.ts | ANALYSIS | INFO |
| 2 | edit_file | src/file1.ts | FIX | MEDIUM |

## Aggregate Risk
[Final risk score]

## Checkpoints
[Checkpoint IDs, if any]

## Rollback
- Files written: [list]
- Rollback command: [git revert or restore command]
```

# ANALYSIS_LOG.md Schema (per error analysis)

```markdown
# Analysis: <error-description> — YYYY-MM-DD

## Location
<service, module, file, line range>

## Root Cause
<one paragraph: technical root cause>

## Impact
<what broke, how many users, revenue if known>

## Fix Applied
<what was changed to resolve>

## Test Coverage
<what test was added or existing test that should have caught it>

## Follow-Up
- [ ] action items

## Recurrence Flag
<YES / NO — should we alert if this pattern repeats>
```

# Session Commands

| Command | Purpose | Example |
|---|---|---|
| `session start` | Initialize session with scope | `session start task="Add retry logic" files="src/retry.ts" risk_cap=MEDIUM` |
| `session status` | Show current ledger + risk | `session status` |
| `session checkpoint` | Force checkpoint | `session checkpoint` |
| `session resume <id>` | Resume from checkpoint | `session resume ckpt-003` |
| `session rollback` | Undo all changes in session | `session rollback` |
| `session end` | Finalize, write CHANGE_LOG | `session end` |
| `session export` | Emit compressed context for handoff | `session export` |

# Session Continuity Patterns

## Pattern 1: Session Resume

When a session is interrupted and needs to resume:

1. Load last checkpoint state
2. Verify scope still valid (files not modified externally)
3. Re-run type check on written files (verify still compiles)
4. Continue from last unexecuted tool call
5. If context window constrained: load compressed format

## Pattern 2: Context Handoff

When transferring to another agent or person:

```
--- HANDOFF ---
Session: <id>
Task: <task description>
Completed: [file1.ts modified, file2.ts created]
Remaining: [file3.ts still needs changes]
Risk: MEDIUM
Checkpoint: ckpt-003
Contracts affected: api/v1/users.ts (GET response shape changed)
Next steps:
1. Edit file3.ts
2. Run tests
3. Update docs
--- END HANDOFF ---
```

## Pattern 3: Multi-Turn Continuity

For maintaining context across multiple AI turns within a single session:

Turn N: "Fix the timeout issue in payment service"
Turn N+1: "Now add retry logic for the same endpoint"
→ Detect implicit scope expansion. Checkpoint before proceeding.

# Cross-Session Dependency Tracking

When multiple sessions touch the same files or modules:

- Session A writes `src/service.ts` at 10:00
- Session B reads `src/service.ts` at 10:05 (unaware of Session A's changes)
- Detection: check file modification timestamps against last-write from any session
- Action: warn that file was modified by another session

# Recovery from Interruption

1. Detect crash/interruption (session state not finalized)
2. Load most recent checkpoint
3. Verify file state: do written files exist? compiles?
4. Report discrepancy: "Session recovered from checkpoint ckpt-003. 3 of 5 files written. 2 remaining."
5. Resume from last unexecuted tool call

# Session State Recovery

## Crash Recovery

1. Detect: session state file exists but no SESSION_END entry
2. Load: read persisted state from CHANGE_LOG.md
3. Verify: check all written files exist and are not empty
4. Report: "Recovered session <id>. Files written: [list]. Risk: MEDIUM. Resume or rollback?"
5. Action: resume (continue) or rollback (revert all files)

## Network/Connection Failure

1. Distinguish from crash: session state in memory was lost, but CHANGE_LOG.md has last checkpoint
2. Reconstruct: load last checkpoint from CHANGE_LOG.md
3. State: known-good state at checkpoint; all tool calls after checkpoint are lost
4. Action: inform user, resume from checkpoint

# Session State Persistence Formats

## In-Memory Format (during active session)

Full session object with all ledger entries, scope, risk, and file state. Used for fast access during a single session.

## Persisted Format (CHANGE_LOG.md entry)

Compressed version written to `/brain/CHANGE_LOG.md` at session end and at each checkpoint. Contains: session ID, task, scope, ledger summary, aggregate risk, files written, rollback info.

## Compressed Format (for context window efficiency)

Minimal version for AI context injection:

```yaml
id: "20270525-a3f2"
task: "Add retry to payment service"
files: ["src/payment/retry.ts", "src/payment/client.ts"]
risk: MEDIUM
checkpoint: "ckpt-003"
contracts: ["payment-service/processPayment (signature unchanged)"]
```

# Session Checkpoint Decision Tree

- Is this a HIGH+ risk operation? → Checkpoint before executing
- Is this the 5th+ tool call without a checkpoint? → Checkpoint now
- Is there a scope change (new files/modules)? → Checkpoint before expanding
- Is this a contract break? → Checkpoint before executing
- Otherwise: no checkpoint needed
