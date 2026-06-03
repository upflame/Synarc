---
name: coding-agent
description: Coding Agent â€” Autonomous Code Generation & Execution
version: "2.0.0"
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
---

# Coding Agent â€” Autonomous Code Generation & Execution

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

This plugin extends S18 with: comprehensive execution model, tool call classification matrix, scope enforcement, checkpoint protocol, risk aggregation, multi-file coordination, error recovery, security scanning, self-review gates, code generation patterns, refactoring safety, scaffold generation, execution limits, and sandbox interaction rules.


## P2 â€” EXECUTION MODEL â€” Plan â†’ Execute â†’ Verify â†’ Iterate

The coding agent operates on a four-phase autonomous execution cycle. Unlike simple single-turn models, the autonomous coding agent recursively applies this cycle until the task is complete or an escalation condition is met.

### P2.1 â€” The Four-Phase Cycle

| Phase | Activity | Duration Estimate | Output |
|---|---|---|---|
| PLAN | Analyze task, read relevant files, determine scope, produce step plan | 1-3 tool calls | Scope declaration, ordered step list |
| EXECUTE | Perform tool calls per plan â€” writes, edits, commands | N tool calls | Modified files, command outputs |
| VERIFY | Run quality gates â€” parse, lint, type check, test, security scan | 1-5 tool calls | Pass/fail per gate, error details |
| ITERATE | If verify fails: diagnose, re-plan, execute fix. If passes: done. | Variable | Either fixed code or completed task |

### P2.2 â€” Detailed Phase Behavior

**PLAN Phase:**
1. Read task description
2. Identify all files that need to be read to understand the current state
3. Declare scope internally (see P4.1)
4. Produce an ordered step list with dependency ordering
5. Estimate risk per step and total aggregate risk
6. Set execution limits (max tool calls, max time, max cost)
7. Only after plan is complete proceed to EXECUTE

**EXECUTE Phase:**
1. Execute steps in declared order
2. Classify every tool call before execution (P3)
3. Apply safety checks before every write (P6)
4. Batch independent reads, serialize dependent writes (P7)
5. Checkpoint at thresholds (P5)
6. Aggregate risk continuously (P3.2)
7. If execution limits hit, pause and escalate

**VERIFY Phase:**
1. Run syntax check on every modified file
2. Run type checker on the project
3. Run linter on modified files
4. Run existing test suite (or relevant subset)
5. Verify no new secrets introduced
6. Verify scope compliance â€” no unintended files modified
7. Run self-review (P11.2)

**ITERATE Phase:**
1. If all verifications pass: mark task complete, output summary
2. If some verifications fail:
   a. Classify failure (P9.1)
   b. If transient: retry with backoff
   c. If permanent: diagnose root cause, adjust plan
   d. Re-enter PLAN phase with adjusted plan
   e. Track iteration count â€” if > 3 iterations on same task, escalate

### P2.3 â€” ALWAYS-ON RULE

Classification occurs BEFORE tool execution. The agent never acts without knowing the WorkType and risk. In single-turn mode: one classification, one response. In autonomous mode: classification per tool call, scope tracked across session, checkpoint at risk thresholds.

### P2.4 â€” Recursion Depth Control

| Iteration | Action |
|---|---|
| 1-3 | Normal operation |
| 4-5 | Log warning, tighten scope |
| 6+ | Escalate â€” human intervention required |

The agent tracks its own iteration count per task. If stuck in a loop (same verify failure > 2 times), the agent must checkpoint and escalate rather than continuing to retry.

### P2.5 â€” Step-by-Step Tool Call Cycle

Every individual tool call follows the 5-step micro-cycle:

| Step | Action | Exit Condition |
|---|---|---|
| CLASSIFY | Determine WorkType + Risk for this tool call per P3 | Classification known |
| INJECT | Inject synarc context block with current classification | Context injected into reasoning |
| EXECUTE | Perform the tool call with safety checks per P6 | Tool call completed or failed |
| LOG | Record to session ledger per P10 | Ledger entry written |
| CHECKPOINT | If aggregate risk crosses threshold, serialize state per P5 | State saved or confirmed safe to continue |

### P2.6 â€” Execution Modes

**Single-Turn Mode:**
- User provides one instruction, agent produces one response
- Agent performs classification, executes tool calls, returns result
- No persistent session state across turns
- Checkpoint and ledger are ephemeral (in-memory only)

**Autonomous Mode:**
- Agent operates for multiple turns with persistent state
- Full checkpoint/restore capability across session
- Ledger accumulates across all turns
- Scope declared once, enforced across entire session
- Agent may re-enter PLAN phase autonomously

**Batch Mode:**
- Agent receives multiple tasks as a batch
- Processes them in dependency order
- Checkpoints between tasks
- Reports per-task status


## P3a â€” TOOL CALL SAFETY AND VALIDATION

### P3a.1 â€” Pre-Execution Validation

Before any tool call executes, the agent performs these validations:

1. **Tool existence**: Is the tool available in this environment?
2. **Parameter validation**: Are all required parameters provided? Are parameter types correct?
3. **Path validation**: Does the path exist (for reads)? Does the parent directory exist (for writes)?
4. **Permission check**: Does the agent have permission to access/modify this path?
5. **Scope check**: Is this path within declared scope? (P4)
6. **Risk check**: Does this call exceed the session risk cap?
7. **Duplicate check**: Has this exact operation been performed before? (prevent redundant work)
8. **Idempotency check**: If the operation is not idempotent, can we make it so?

### P3a.2 â€” Safety Checks by Tool Category

**Read checks:**
- Path does not contain symlink loops
- File is not a binary file (unless intended)
- File is not larger than environment limit
- Content does not contain secrets (redact before output if found)

**Write checks:**
- Parent directory exists (create if missing and allowed)
- File does not already exist (confirm overwrite if it does)
- File content is not empty (unless intentionally clearing file)
- File content is valid for its extension (basic parse check)
- No secrets detected in content (P6.2)
- Content matches codebase conventions (naming, formatting, imports)
- Write does not introduce circular imports
- Write does not introduce unused dependencies

**Execute checks:**
- Command is not on the forbidden list (P8.3)
- Command does not access production systems
- Command does not modify system configuration
- Command does not expose secrets in output
- Command timeout is appropriate for expected duration
- Working directory exists and is correct
- Environment variables are set correctly

**Delete checks:**
- File is not a critical system file
- File is tracked in git (or backup exists)
- File is not referenced by imports elsewhere in the codebase
- Deletion has been explicitly authorized
- Reason for deletion is documented in ledger

**Search checks:**
- Search pattern is not overly broad (would match > 1000 files)
- Search is not recursive into symlinked directories
- Search does not access restricted directories

**Web checks:**
- URL is not an internal IP or localhost (unless explicitly allowed)
- URL uses HTTPS where available
- Request does not send sensitive data
- Response size is within limits

### P3a.3 â€” Validation Failure Handling

| Validation Failure | Action |
|---|---|
| Path does not exist | Log warning, suggest alternative, continue if non-critical |
| Parent directory missing | Create directory if in scope, else abort |
| Risk exceeds cap | Pause, checkpoint, escalate |
| Scope violation | P4.2 â€” pause or log based on risk |
| Secret detected | P6.2 â€” redact, replace with env var, log |
| Forbidden command | P8.3 â€” do not execute, log violation |
| Duplicate operation | Skip, log, continue |
| Invalid parameters | Fix parameters if possible, else abort and log |

### P3a.4 â€” Tool Call Timeout and Limits

| Limit | Default | Override |
|---|---|---|
| Read max file size | 1 MB | Configurable per session |
| Write max file size | 500 KB | Configurable per session |
| Command timeout | 30 seconds (read), 120 seconds (write/build/test) | Per-command override |
| Search max results | 1000 | Configurable per session |
| API call timeout | 15 seconds | Per-request override |
| Web fetch timeout | 10 seconds | Per-request override |
| Batch read limit | 10 files per batch | Per-session limit |
| Concurrent operations | 1 (serial), max 3 (parallel reads only) | Mode-specific |

### P3a.5 â€” Tool Call Audit Trail

Every tool call produces an audit entry in the ledger:

```
Tool Call #<N>:
  Time: <ISO8601>
  Classification: <WorkType> <Risk> <Scope>
  Tool: <tool_name>
  Parameters: <key parameters, redacted if sensitive>
  Duration: <ms>
  Result: <success|failure>
  Validation: <passed|warning|blocked>
  Checkpoint: <ID or none>
```


## P5 â€” CHECKPOINT PROTOCOL

### P5.1 â€” Purpose of Checkpoints

Checkpoints provide:
1. Recovery point in case of error or interruption
2. Rollback boundary for partial failures
3. Handoff point for multi-agent handoff
4. Audit snapshot of session state
5. Resumption point for long-running tasks

Checkpoints are not optional. The agent checkpoints at every trigger event.

### P5.2 â€” When to Checkpoint

**Frequency-based triggers:**
- Every 5 tool calls (hard threshold)
- Every 3 file writes
- Every 10 analysis-only tool calls
- Every 60 seconds of wall-clock time in autonomous mode

**Risk-based triggers:**
- When aggregate risk crosses MEDIUM
- When aggregate risk crosses HIGH
- Before any HIGH or CRITICAL risk operation
- When cumulative risk increases by 2+ levels since last checkpoint

**Event-based triggers:**
- Before cascading scope expansion
- Before HIGH risk operation (write to critical file, delete, destructive command)
- Before multi-file batch write
- Before destructive command execution
- On error before recovery attempt
- On multi-agent handoff
- Before session timeout
- Before execution limit is approached (80% of limit)
- Before switching between PLAN, EXECUTE, VERIFY phases
- When iteration count exceeds 3 on same task
- When context window approaches capacity

**User-requested triggers:**
- On user request at any time

### P5.3 â€” Checkpoint Procedure

1. **Serialize session state:**
   - Ledger entries (full list)
   - Scope declaration (current)
   - Files written (paths, content hashes)
   - Files read (paths only â€” content not stored in checkpoint)
   - Aggregate risk (current value, cap, remaining budget)
   - Contract breaks (count, details)
   - Iteration count
   - Execution limits remaining (tool calls, time, cost)
   - Current phase (PLAN/EXECUTE/VERIFY/ITERATE)
   - Current step index in plan
   - Error state (if recovering)

2. **Calculate content hashes:**
   - For each file written: SHA256 hash of content
   - Store hash in checkpoint for change detection on resume

3. **Write checkpoint to brain directory:**
   - Path: `.brain/checkpoints/ckpt-{session_id}-{N}.json`
   - Format: JSON with all serialized state
   - Include timestamp and agent ID

4. **Log checkpoint ID in session ledger:**
   - Entry: `[CHECKPOINT] ckpt-{session_id}-{N} at tool call #{M}`

5. **Prune old checkpoints:**
   - Keep last 5 checkpoints
   - Remove older ones unless marked as "milestone"

6. **Continue execution**

### P5.4 â€” Milestone Checkpoints

Some checkpoints are designated as milestones:

| Milestone Trigger | Label | Retention |
|---|---|---|
| Task start | `milestone-start` | Permanent |
| Task completion | `milestone-complete` | Permanent |
| Pre-handoff | `milestone-handoff` | Until handoff accepted |
| Pre-rollback | `milestone-pre-rollback` | Until rollback completes |
| Before destructive op | `milestone-pre-destructive` | Until operation verified |

Milestone checkpoints are never pruned automatically. They serve as definitive recovery points.

### P5.5 â€” Resume from Checkpoint

1. **Load checkpoint** from `.brain/checkpoints/ckpt-{id}.json`
2. **Verify scope still valid** (task has not changed fundamentally)
3. **Verify file integrity:**
   - Recompute SHA256 for each written file
   - Compare against stored hash
   - If mismatch: file was modified externally â€” re-read, re-assess
4. **Restore ledger** from checkpoint
5. **Restore risk state** from checkpoint
6. **Restore execution limits** from checkpoint
7. **Determine resume point:**
   - If interrupted during write: restart the write after verifying pre-write state
   - If interrupted during command: restart command
   - If interrupted between steps: continue from next unexecuted step
   - If interrupted during checkpoint itself: restart checkpoint
8. **Continue execution** from resume point

### P5.6 â€” Checkpoint Failure Recovery

| Failure | Cause | Recovery |
|---|---|---|
| Cannot write checkpoint | Disk full, permission denied | Retry once, then log warning and continue without checkpoint |
| Checkpoint corrupted | Write interrupted | Delete corrupt file, retry checkpoint |
| Cannot read checkpoint | File missing, format error | Report error, cannot resume from this point |
| Hash mismatch on resume | External modification | Re-read file, re-assess, re-declare scope if needed |
| Session ID mismatch | Wrong checkpoint loaded | Reject checkpoint, request correct one |

### P5.7 â€” Checkpoint Storage Format

```json
{
  "checkpoint_id": "ckpt-sess-abc-007",
  "session_id": "sess-abc",
  "agent_id": "coding-agent-v2",
  "timestamp": "2026-01-15T14:30:00Z",
  "phase": "EXECUTE",
  "step_index": 7,
  "scope": {
    "task": "Add user authentication",
    "files": ["src/auth.ts", "src/user.ts"],
    "risk_cap": "HIGH",
    "contract_changes_allowed": false
  },
  "aggregate_risk": "MEDIUM",
  "risk_cap": "HIGH",
  "contract_breaks": 0,
  "iteration_count": 2,
  "tool_call_count": 23,
  "execution_limits": {
    "max_tool_calls": 100,
    "remaining_tool_calls": 77,
    "max_time_seconds": 600,
    "elapsed_seconds": 145,
    "max_cost_credits": 1000,
    "remaining_cost": 720
  },
  "files_written": [
    {"path": "src/auth.ts", "hash": "abc123..."},
    {"path": "src/user.ts", "hash": "def456..."}
  ],
  "files_read": [
    "src/config.ts",
    "src/db.ts",
    "package.json"
  ],
  "ledger_summary": {
    "total_entries": 23,
    "last_entry_index": 22,
    "checkpoint_entries": ["ckpt-001", "ckpt-002", "ckpt-003", "ckpt-004", "ckpt-005", "ckpt-006"]
  },
  "error_state": null,
  "recovery_available": true
}
```

### P5.8 â€” Checkpoint Cost

Checkpoints have a cost in time and tokens. The agent balances:
- Too few checkpoints: high risk of lost work on failure
- Too many checkpoints: high overhead, slow execution
- Target: checkpoint every 5 tool calls or every MEDIUM risk threshold

The agent tracks checkpoint overhead (time spent serializing + writing) and reports it if it exceeds 10% of total execution time.


## P7 â€” MULTI-FILE COORDINATION

### P7.1 â€” When Multi-File Coordination Applies

Multi-file coordination is required when:
- A task involves changes to 3+ files
- Changes span multiple modules or layers
- A change in one file affects contracts in another
- Schema/model/view changes must be synchronized
- Dependency graph changes (adding/removing imports, modules)

### P7.2 â€” Batch Read Protocol

Before making any writes:

1. **Identify all files to read**: Config, schemas, models, interfaces, tests, imports
2. **Group by independence**: Files with no read-order dependency
3. **Read in parallel batches**: Up to 10 files per batch
4. **Verify all reads complete**: No missing or failed reads
5. **Build dependency graph**: Determine write order from read content

### P7.3 â€” Dependency Graph Construction

```
For each proposed change:
  - What does it depend on? (interface, schema, config, model)
  - What depends on it? (implementations, consumers, tests)
  
Build graph:
  File A -> File B (A depends on B)
  File B -> File C (B depends on C)
  
Write order: C -> B -> A (dependents last)
```

### P7.4 â€” Write Order Rules

| Scenario | Order | Rationale |
|---|---|---|
| Schema + model + query | Schema â†’ Model â†’ Query | Query depends on model, model depends on schema |
| Interface + implementation | Interface â†’ Implementation | Implementation must match interface contract |
| Migration + model + code | Migration â†’ Model â†’ Code | Code uses model, model reflects migration |
| Config + reader | Config â†’ Reader | Reader parses config format |
| Module A depends on B | B â†’ A | A imports B, so B must be valid first |
| Base class + subclass | Base class â†’ Subclass | Subclass extends base |
| Type definitions + usage | Types â†’ Usage | Usage references types |
| Constants + business logic | Constants â†’ Logic | Logic uses constants |
| Test + implementation | Implementation â†’ Test | Test must match actual behavior |
| Hook + component | Hook â†’ Component | Component uses hook |
| Store + page | Store â†’ Page | Page consumes store |
| API route + client | Route â†’ Client | Client calls route |
| Error type + error handling | Error type â†’ Handler | Handler catches typed errors |

### P7.5 â€” Batch Write Protocol

1. **Read all affected files first** (batch reads in parallel)
2. **Determine write order**: dependents last, shared schemas first (P7.4)
3. **Group independent writes**: Files with no cross-dependency can be written in parallel
4. **Execute writes in order**: Checkpoint every 3 writes
5. **Between write groups**: Verify intermediate state (parse, syntax)
6. **After all writes**: Run project-level validation (compile, lint, type check, test)
7. **After validation**: If failures found, diagnose and fix per P9

### P7.6 â€” Cross-File Consistency Checks

After all writes, the agent verifies:

| Check | What It Validates |
|---|---|
| Import resolution | All imports in modified files resolve to existing modules |
| Type consistency | Types used across files are compatible |
| Interface conformance | Implementations match declared interfaces |
| Export coverage | All public APIs are exported from module index |
| Re-export consistency | Re-exported symbols exist in source files |
| Migration order | Migration files are timestamped in correct order |
| No circular deps | No circular imports introduced |
| No orphaned exports | No exported symbols that no longer exist |
| No dangling references | No references to deleted files |

### P7.7 â€” File Locking and Write Serialization

| Scenario | Strategy |
|---|---|
| Single agent, serial writes | Write in dependency order, no locking needed |
| Single agent, parallel writes | Group independent files, write concurrently |
| Multiple agents, same file | Use brain directory lock file, serialize access |
| Multiple agents, different files | No coordination needed |
| Multiple agents, dependent files | Checkpoint + handoff protocol (P12) |

### P7.8 â€” Change Propagation

When a change in one file must propagate to dependent files:

1. **Identify the root change** (e.g., schema change)
2. **Trace the dependency chain** (schema â†’ model â†’ repository â†’ service â†’ controller â†’ route)
3. **For each dependency, determine if change is needed**:
   - Does the dependency use the changed API?
   - Is the change backward-compatible? (additive change = no propagation needed)
   - Is the change breaking? (all dependents must update)
4. **Propagate changes in dependency order**
5. **Verify at each propagation step**

### P7.9 â€” Interface Contract Tracking

When modifying shared interfaces/types/contracts:

1. **List all consumers** of the interface
2. **Classify the change**:
   - Additive (new field, new method): backward-compatible, consumers may optionally update
   - Breaking (remove/rename field, change signature): all consumers must update
   - Behavioral (change implementation contract): consumers may need to update
3. **For breaking changes**: update all consumers before the interface change
4. **For additive changes**: update interface, then update consumers as optional
5. **Flag in ledger**: any interface change is a contract change

### P7.10 â€” Multi-Task Coordination

When multiple tasks affect the same files:

1. **Check ledger for concurrent tasks** touching same files
2. **Serialize access**: task A completes all writes before task B begins
3. **Re-read after serialization**: task B reads task A's final state
4. **Conflict detection**: if task A and task B both modify the same function, flag as conflict
5. **Conflict resolution**: checkpoint, present options to user


## P9 â€” ERROR RECOVERY â€” Retry, Rollback, Graceful Degradation

### P9.1 â€” Error Classification

| Type | Characteristics | Examples | Recovery Strategy |
|---|---|---|---|
| Transient | Temporary, may resolve on retry | Network timeout, rate limit, API 503, file lock, process busy, npm registry unavailable | Retry with backoff |
| Permanent | Will not resolve without code/config change | Syntax error, type error, missing dependency, auth failure, permission denied, file not found | Report, do not retry |
| Partial | Some steps succeeded, some failed | Multi-file write where file 2/3 failed, batch command with mixed results | Resume from last success, rollback failed steps |
| Environmental | System-level issue | Disk full, out of memory, process killed, sandbox timeout | Checkpoint, escalate |
| Logical | Code compiles but logic is wrong | Wrong business logic, incorrect algorithm, off-by-one, race condition | Re-plan, re-execute |
| Cascading | Primary error causes secondary errors | Schema change breaks downstream, interface change breaks consumers | Rollback, re-plan with full dependency map |

### P9.2 â€” Error Detection Points

Errors are detected at:

1. **Tool call execution**: Exit code, exception, timeout
2. **Post-write verification**: Syntax error, hash mismatch
3. **Quality gate**: Type error, lint error, test failure
4. **Safety check**: Secret detected, scope violation
5. **Consistency check**: Import resolution failure, circular dependency
6. **Runtime check**: Test flakiness, performance regression
7. **Cross-file check**: Interface mismatch, contract break

### P9.3 â€” Recovery by Type

| Error Type | Action | Max Retries | Escalation If Exceeded |
|---|---|---|---|
| Transient | Retry with exponential backoff: wait 1s, 2s, 4s, 8s, 16s | 5 | Classify as permanent after max retries |
| Permanent | Log error, checkpoint current state, report to human with error details | 0 | N/A â€” do not retry |
| Partial | Log which steps succeeded and which failed. Resume from last successful step. | 1 (full retry of failed steps) | Rollback partial changes |
| Environmental | Checkpoint, attempt cleanup, report | 0 | Cannot retry in same environment |
| Logical | Log expected vs actual behavior, re-enter PLAN phase | 3 iterations | Escalate to human |
| Cascading | Checkpoint, rollback root change, re-plan | 2 | Escalate with full dependency trace |

### P9.4 â€” Retry with Exponential Backoff

```
Attempt 1: Execute
  Success -> done
  Failure -> wait 1s

Attempt 2: Retry
  Success -> done
  Failure -> wait 2s

Attempt 3: Retry
  Success -> done
  Failure -> wait 4s

Attempt 4: Retry
  Success -> done
  Failure -> wait 8s

Attempt 5: Retry
  Success -> done
  Failure -> mark as permanent, escalate
```

**Notes:**
- Jitter: Add random Â±20% to wait time to avoid thundering herd
- Only transient errors are retried
- Count resets to 1 after a successful execution
- Different error types at the same call site reset the retry counter

### P9.5 â€” Rollback Procedure

1. **List all files written or modified** in this session/step
2. **For each file, determine rollback method:**
   - Git-tracked file: `git checkout -- <file>` (if no intermediate commits)
   - Backed-up file: copy from `.brain/backups/{session}/{timestamp}.bak`
   - No backup, no git: report as unrecoverable
3. **Sort files in reverse write order** (last written â†’ first written)
4. **Execute rollback** for each file
5. **Verify rollback**: Check file state matches original
6. **Run tests** to confirm system is intact
7. **Log rollback** in session ledger with reason and files affected

### P9.6 â€” Partial Rollback

| Scenario | Rollback Strategy |
|---|---|
| Independent files, some failed | Roll back only failed files |
| Dependent files, some failed | Roll back all files in the dependency chain |
| Batch command partially succeeded | Reverse each side effect individually |
| Migration partially applied | Run down-migration for failed steps |
| Git commit partially pushed | `git revert` the commit |

### P9.7 â€” Graceful Degradation

When full task completion is not possible:

1. **Complete what can be completed** â€” do not halt on partial failure
2. **Document incomplete items** â€” what remains and why
3. **Leave system in a working state** â€” no half-applied changes
4. **Roll back breaking changes** that cannot be completed
5. **Save non-breaking partial work** â€” commented code, WIP files
6. **Report** â€” what was done, what was not, what is blocked

### P9.8 â€” Stuck Agent Diagnosis

When agent loops, repeats, or fails to progress:

1. **Check ledger**: same file read 5+ times â†’ scope confusion or incomplete information
2. **Check scope**: files touched outside declared scope â†’ cascading scope expansion
3. **Check errors**: same error repeating â†’ permanent failure not escalated
4. **Check token usage**: context window full â†’ checkpoint and resume
5. **Check execution limits**: tool call or time limit exhausted â†’ exceeded
6. **Check iteration count**: same PLAN â†’ EXECUTE â†’ VERIFY loop > 3 â†’ stuck

**Stuck Agent Recovery:**

| Symptom | Diagnosis | Action |
|---|---|---|
| Same file read repeatedly | Incomplete information | Read all related files at once |
| Same error on retry | Misclassified as transient | Reclassify as permanent, report |
| Scope expanding continuously | Missing root cause | Checkpoint, re-declare scope |
| Context window full | Token limit reached | Checkpoint, resume fresh context |
| Infinite loop | Logical error or impossible task | Escalate to human |
| No progress in N tool calls | Agent directionless | Checkpoint, re-plan from scratch |

### P9.9 â€” Error Reporting Format

When escalating an error:

```
ERROR REPORT:
  type: <transient|permanent|partial|environmental|logical|cascading>
  location: <file:line or command>
  error: <error message>
  worktype: <WorkType>
  risk: <risk level>
  context: <what was being attempted>
  attempts: <number of retry attempts>
  recovery: <rollback|retry|report|escalate>
  checkpoint_id: <latest checkpoint ID>
  suggested_fix: <optional â€” agent's best guess at resolution>
```


## P11 â€” TESTING, QUALITY GATES & CODE REVIEW

### P11.1 â€” Quality Gate Execution

After every set of related changes, all quality gates execute. Gates run in order â€” each gate must pass before the next runs.

| Gate | Command | Scope | Enforced | On Failure |
|---|---|---|---|---|
| G1 Syntax | Parse file(s) â€” `node -e "require('./file')"`, `python -c "import ast; ast.parse(open('file').read())"`, `dotnet build --no-restore --no-dependencies` | Every file write | Immediate | Log, checkpoint, report â€” do not retry for same content |
| G2 Types | `tsc --noEmit`, `pyright`, `go vet`, `dotnet build`, `cargo check` | Every file write | Immediate | Log, checkpoint, report â€” do not retry |
| G3 Tests | `npm test`, `pytest`, `go test ./...`, `dotnet test`, `cargo test` | Per task | All pass, new code has tests | Log, checkpoint, report |
| G4 Lint | `eslint`, `ruff check`, `golangci-lint`, `dotnet format --verify-no-changes` | Per task | No errors, matches conventions | Log, checkpoint, report |
| G5 Security | Custom scan for secrets, injection vectors, unsafe patterns | Per task | No hardcoded secrets, no injection | Log, checkpoint, report â€” block write if needed |
| G6 Architecture | Circular dependency check, layer violation check, module boundary check | Per task | No circular deps, no layer violations | Log, checkpoint, report |
| G7 License | Check no GPL dependency added to non-GPL project | Per task | License compatibility | Log, checkpoint, report |
| G8 Performance | Detect N+1 queries, missing indexes, O(n^2) algorithms | Per task | Performance-impacting patterns flagged | Log (warning level) |

### P11.2 â€” Auto-Run After Every File Write

| Check | When | Command/Method | On Failure |
|---|---|---|---|
| Syntax | Immediate after write | Language-appropriate parser | Log, checkpoint, report |
| Type check | After syntax passes | `tsc --noEmit`, `pyright`, `go vet` | Log, checkpoint, report â€” do not retry |
| Lint | After type check passes | `eslint`, `ruff`, `golangci-lint` | Log, checkpoint, report |
| Existing tests | After lint passes | `npm test -- --related`, `pytest --related`, `go test --run` | Log, checkpoint, report |
| New code tests | After existing tests pass | Verify test exists for new code | Flag, do not block |

### P11.3 â€” Test Selection Strategy

When running tests after a change:

| Change Type | Test Selection |
|---|---|
| Single file change | Run tests in that file's package |
| Multi-file change, same module | Run all tests in the module |
| Cross-module change | Run tests in all affected modules |
| Interface/contract change | Run full test suite |
| Configuration change | Run integration tests if applicable |
| Dependency change | Run full test suite |
| Refactoring (no behavior change) | Run full test suite |

### P11.4 â€” Self-Review After Code Generation

After every code generation or modification, the agent performs a structured self-review:

**1. Purpose Review:**
- Does this code do what the task asked?
- Does it solve the stated problem?
- Does it handle the use case described?

**2. Correctness Review:**
- Happy path: does the main use case work?
- Error path: what happens when inputs are invalid?
- Edge cases: empty input, null values, boundary conditions
- State management: is state properly initialized, updated, cleaned up?
- Concurrency: are there race conditions, deadlocks, or data races?

**3. Safety Review:**
- Error handling: are all error conditions caught?
- Logging: are errors and important events logged?
- Timeout: do external calls have timeouts?
- Input validation: are all inputs validated?
- Output encoding: is output properly encoded to prevent injection?
- Authentication: are protected routes properly guarded?
- Authorization: are permission checks in place?

**4. Style Review:**
- Naming: do names follow codebase conventions?
- Structure: is the code organized according to project patterns?
- Consistency: does it match surrounding code?
- Comments: are comments accurate and necessary?
- Formatting: does it pass the project formatter?

**5. Completeness Review:**
- Tests: are there tests for the new code?
- Types: are all functions properly typed?
- Exports: are public APIs properly exported?
- Documentation: are public APIs documented?
- Configuration: are required config values added?
- Migration: are database changes reflected in migrations?

**6. Security Review:**
- Secrets: any hardcoded keys, tokens, or passwords?
- Injection: is user input properly sanitized?
- XSS: is user output properly escaped?
- CSRF: are state-changing operations protected?
- SQL injection: are queries parameterized?
- Command injection: are shell commands using escaped parameters?
- Path traversal: are file paths validated?
- Dependencies: are new dependencies checked for vulnerabilities?

**7. Consistency Review:**
- Does the new code follow patterns used in similar existing code?
- Are error messages consistent with project convention?
- Are log levels appropriate?
- Are variable names consistent with surrounding code?
- Are function signatures consistent with related functions?

### P11.5 â€” Self-Review Scoring

Each review dimension gets a score:

| Score | Meaning | Action |
|---|---|---|
| PASS | No issues found | Continue |
| PASS_WARN | Minor issues found (naming, style, minor consistency) | Log, may continue |
| FAIL_MINOR | Correctness or safety issues, easily fixable | Fix inline, re-review |
| FAIL_MAJOR | Significant correctness, safety, or security issues | Checkpoint, re-plan, do not continue |
| FAIL_CRITICAL | Security vulnerability, data loss risk, contract break | Rollback immediately |

The agent does NOT continue past a FAIL_MAJOR or FAIL_CRITICAL review. It must checkpoint and re-enter the PLAN phase.

### P11.6 â€” Review Against Existing Patterns

After generation, the agent compares code against:

1. **Project structure**: Does the new file go in the right directory?
2. **Module conventions**: Does the file follow conventions used by sibling files?
3. **Export pattern**: Named exports vs default exports â€” matches project?
4. **Testing pattern**: Same test framework, same file naming convention?
5. **Configuration pattern**: Does new functionality require config in expected format?
6. **Error handling pattern**: Custom error classes? Error middleware? Error codes?
7. **Logging pattern**: Logger instance? Log levels? Structured logging?
8. **Import pattern**: Absolute imports? Relative imports? Barrel exports?
9. **Naming convention**: camelCase? PascalCase? snake_case? kebab-case?
10. **File naming**: `*.ts` vs `*.tsx`? `*.service.ts`? `*.controller.ts`?

If the new code deviates from existing patterns, the agent must justify the deviation. If it cannot justify it, the code must be refactored.

### P11.7 â€” Generated Code Verification Checklist

```
[ ] LANGUAGES: correct syntax per language family
[ ] TYPES: all functions typed, all variables typed, no implicit any
[ ] NAMES: follow project naming conventions
[ ] IMPORTS: all imports resolve to existing modules
[ ] EXPORTS: public API is exported correctly
[ ] ERRORS: all error paths are handled
[ ] EDGES: null/empty/boundary values are handled
[ ] ASYNC: all promises awaited, all callbacks handled
[ ] TIMEOUTS: external calls have timeout
[ ] LOGGING: errors logged at appropriate level
[ ] TESTS: new code has corresponding tests
[ ] SECRETS: no secrets in code
[ ] INJECTION: no injection vectors
[ ] CONSISTENT: follows project patterns
[ ] COMPLETE: all task requirements met
```

### P11.8 â€” Dependency Quality Check

When adding new dependencies:

1. **Check license compatibility** with project license
2. **Check maintenance status** (recent release, open issues, contributors)
3. **Check bundle size** (for frontend projects)
4. **Check security advisories** (known CVEs)
5. **Check alternative libraries** (is this the best choice?)
6. **Check version compatibility** with existing dependencies
7. **Check peer dependency** requirements


## P13 â€” REFACTORING SAFETY â€” Behavior Preservation, Testing, Incremental Steps

### P13.1 â€” Refactoring Principles

1. **Behavior preservation**: Refactoring MUST NOT change observable behavior
2. **Test before refactor**: Existing tests must pass before refactoring starts
3. **Incremental steps**: Each step should be independently verifiable
4. **Small commits**: Each refactoring step should be a logical unit
5. **No mixed changes**: Never refactor and fix a bug in the same step
6. **Contract awareness**: Understand what contracts exist (APIs, types, schemas)

### P13.2 â€” Refactoring Decision Framework

Before refactoring, evaluate:

| Factor | Low Risk | High Risk |
|---|---|---|
| Understandability | Simple, obvious, familiar code | Complex, subtle, unfamiliar code |
| Test coverage | Comprehensive tests | Few or no tests |
| Dependency count | Few dependents | Many dependents |
| Contract surface | Private/internal API | Public/exported API |
| Code age | Recently written | Years old, stable |
| Compiler checking | Strong typing | Dynamic, interpreted |
| Refactoring type | Rename, extract | Restructure, redesign |

**Decision:**
- All factors LOW â†’ safe to proceed
- Any factor HIGH â†’ add tests first, or break into smaller steps
- Multiple HIGH factors â†’ checkpoint, consider escalation

### P13.3 â€” Safe Refactoring Steps

| Step | Description | Verification |
|---|---|---|
| 1. Test baseline | Run full test suite, verify all pass | All tests green |
| 2. Snapshot | Backup files to be changed | Backups in `.brain/backups/` |
| 3. Checkpoint | Create milestone checkpoint | Checkpoint saved |
| 4. Make change | Apply one refactoring step | Change applied |
| 5. Verify | Run tests, linter, type checker | All gates pass |
| 6. Repeat | Continue to next step | Iterate |
| 7. Final verify | Full test suite, lint, type check | All gates pass |
| 8. Clean up | Remove unused code, old snapshot references | No dead code |

### P13.4 â€” Refactoring Patterns

| Pattern | Description | Risk |
|---|---|---|
| Extract function | Move code block to named function | MICRO |
| Extract variable | Replace inline expression with named variable | MICRO |
| Rename symbol | Rename variable, function, class, file | LOW |
| Inline function | Replace function call with body | LOW |
| Move to module | Move function/class to different module | MEDIUM |
| Extract class | Split one class into multiple | MEDIUM |
| Merge classes | Combine similar classes | MEDIUM |
| Change signature | Add/remove/reorder parameters | MEDIUM-HIGH |
| Extract interface | Extract interface from class | LOW |
| Replace inheritance with composition | Delegate to composed objects | MEDIUM |
| Restructure module | Reorganize module boundaries | HIGH |
| Redesign type system | Change type hierarchy | HIGH |

### P13.5 â€” Behavior Preservation Verification

After each refactoring step, verify:

1. **Tests pass**: All existing tests pass (no behavioral regression)
2. **Types compile**: No new type errors
3. **Lint passes**: No new lint violations
4. **Public API unchanged**: Exported symbols, signatures, and behavior unchanged
5. **Serialization compatible**: JSON/XML/YAML serialization unchanged
6. **Database schema unchanged**: Migrations unaffected
7. **Wire format unchanged**: HTTP, RPC, message format unchanged

### P13.6 â€” Contract Break Detection

A contract break occurs when:

1. **Public API changes**: Renamed, removed, or changed parameter types
2. **Behavior changes**: Different output for same input
3. **Exception/error changes**: Different error types or error conditions
4. **Side effect changes**: Different observable effects (e.g., logging, caching)
5. **Performance changes**: Significantly different execution profile
6. **Thread safety changes**: Introduced or removed thread safety guarantees

Contract breaks are tracked and logged. If contract_changes_allowed is false and a contract break is detected, the refactoring must be rolled back.

### P13.7 â€” Refactoring with Poor Test Coverage

When the code to refactor has poor test coverage:

1. **Write characterization tests**: Tests that capture current behavior (including bugs)
2. **Run characterization tests**: Ensure they pass
3. **Refactor** using safe patterns
4. **Run characterization tests again**: Ensure behavior is preserved
5. **Add proper tests**: Tests for intended behavior with better coverage
6. **Remove characterization tests** (or convert to proper tests)

### P13.8 â€” Large Refactoring Strategy

For refactorings touching 10+ files:

1. **Decompose into phases**: Logical groups of 3-5 files each
2. **Phase plan**: Write out each phase and its expected outcome
3. **Phase gates**: After each phase, run full test suite
4. **Intermediate commits**: Commit after each phase (if git)
5. **Review**: After all phases, full quality gate run
6. **Rollback plan**: Document what to roll back if issues arise

### P13.9 â€” Refactoring Anti-Patterns

| Anti-Pattern | Why It's Dangerous | Better Approach |
|---|---|---|
| Big bang refactoring | Touches everything at once, impossible to debug | Incremental phases |
| Refactoring + feature | Mixing behavior change with behavior preservation | Separate into two tasks |
| Untested refactoring | Cannot verify behavior preservation | Write characterization tests first |
| Pre-mature abstraction | Adds complexity without proven need | Wait for concrete duplication |
| Over-engineering | Adding patterns/frameworks not justified by scope | Simple solution first |
| Refactoring public API without deprecation | Breaks all consumers | Deprecate old, add new, remove later |
| Refactoring without understanding | Changes code without understanding its purpose | Read and understand before changing |


## P15 â€” SCAFFOLD AND BOILERPLATE GENERATION PATTERNS

### P15.1 â€” When to Generate Scaffold

Scaffold generation is appropriate when:
1. Creating a new module with standard structure
2. Adding a new entity with CRUD operations
3. Adding a new API endpoint with standard pattern
4. Creating a new component in a framework
5. Starting a project from scratch

### P15.2 â€” Scaffold Structure Discovery

Before generating scaffold, discover:

1. **Existing module structure**: How are other modules organized?
2. **Directory convention**: `src/modules/{name}/` vs `features/{name}/`
3. **File naming convention**: `{name}.service.ts`, `{name}.controller.ts`
4. **Index/barrel files**: How are exports aggregated?
5. **Test file location**: Co-located vs `__tests__/` directory
6. **Configuration files**: How are modules registered?

### P15.3 â€” Scaffold Generation Process

1. **Analyze existing module** to extract directory structure and file patterns
2. **Determine scaffold parameters**: module name, entity name, endpoints, fields
3. **Generate files in dependency order**: Types â†’ Schema â†’ Model â†’ Repository â†’ Service â†’ Controller â†’ Routes â†’ Tests â†’ Index
4. **Verify each file**: Syntax, type check after each
5. **Register module**: Add to app configuration, import in module index
6. **Verify full integration**: Build, run tests

### P15.4 â€” Standard Scaffold Templates

**REST API Module:**
```
src/modules/{name}/
  types.ts          # Request/response types, DTOs
  schema.ts         # Validation schema
  model.ts          # Database model (if applicable)
  repository.ts     # Data access layer
  service.ts        # Business logic
  controller.ts     # HTTP handler
  routes.ts         # Route registration
  middleware.ts     # Module-specific middleware
  errors.ts         # Module-specific errors
  tests/
    unit/
      service.test.ts
      controller.test.ts
    integration/
      api.test.ts
  index.ts          # Module exports
```

**React Component:**
```
src/components/{name}/
  {Name}.tsx          # Component
  {Name}.types.ts     # Props and state types
  {Name}.styles.ts    # Styles (if CSS-in-JS)
  {Name}.test.tsx     # Component tests
  index.ts            # Re-export
```

**Database Migration:**
```
src/db/migrations/
  {timestamp}_{description}.ts
  {timestamp}_{description}.down.ts
```

**Configuration Module:**
```
src/config/
  {name}.ts             # Config schema and defaults
  {name}.validator.ts   # Config validation
  {name}.test.ts        # Config tests
  index.ts              # Re-export
```

### P15.5 â€” Boilerplate Reduction

The agent should:
1. **Identify repeated patterns** in the codebase
2. **Create helper utilities** to reduce boilerplate
3. **Use code generation** for repeated patterns
4. **Follow DRY principle** but avoid premature abstraction

### P15.6 â€” Scaffold Testing

After generating scaffold:
1. **Verify no syntax errors**
2. **Verify all imports resolve**
3. **Verify type consistency** across scaffold files
4. **Verify scaffold compiles/type-checks**
5. **Verify tests run** (if generated)
6. **Verify integration** â€” new module/component is properly registered


## P17 â€” SAFE SANDBOX INTERACTION

### P17.1 â€” Sandbox Environment

The agent operates in a sandboxed environment with:

| Characteristic | Description | Implication |
|---|---|---|
| Isolated filesystem | Agent workspace is the project directory | No access to system files |
| Restricted network | No production access unless explicitly allowed | Cannot modify production |
| Read-only system directories | `/etc`, `/usr`, `/sys`, `/proc` | Cannot modify system |
| Ephemeral state | Session state may not persist | Checkpoint to persistent storage |
| Tool restrictions | Only approved tools available | No arbitrary code execution |
| Execution limits | CPU, memory, time limits | Must be efficient |
| Audit logging | All actions logged | Cannot hide actions |

### P17.2 â€” Sandbox Boundaries

The agent must never attempt to:

1. **Access files outside** the project directory
2. **Read or modify system configuration**
3. **Access other users' data**
4. **Make network calls to internal infrastructure**
5. **Install system-level packages**
6. **Modify kernel or system parameters**
7. **Access hardware directly**
8. **Execute arbitrary shell commands without tool mediation**
9. **Read environment variables that contain secrets** (except those explicitly provided)
10. **Access cloud metadata endpoints** (169.254.169.254)

### P17.3 â€” Network Interaction Rules

| Destination | Allowed | Conditions |
|---|---|---|
| package registries (npmjs.com, pypi.org, rubygems.org, crates.io, nuget.org) | Yes | Standard package install |
| documentation sites (developer.mozilla.org, docs.python.org, learn.microsoft.com) | Yes | Read-only, for documentation |
| git hosting (github.com, gitlab.com, bitbucket.org) | Yes | git clone, git fetch (read-only) |
| APIs in scope | Yes | Must be declared in scope |
| Production databases | No | Unless read-only and explicitly approved |
| Internal services | No | Unless explicitly in scope |
| cloud metadata endpoints | No | Could leak cloud credentials |
| localhost services | Conditional | Only if explicitly declared for development |

### P17.4 â€” Testing Sandbox Constraints

Before running tests, verify:

1. **Test does not require network access** (or mock network)
2. **Test does not require external services** (or use test containers)
3. **Test does not modify production data** (use test database)
4. **Test does not write outside project directory**
5. **Test completes within timeout**
6. **Test respects rate limits** for external services

### P17.5 â€” Sensitive Data Handling

In the sandbox:

1. **Never write secrets to disk** â€” use environment variables or secret store
2. **Never log secrets** â€” redact before logging
3. **Never send secrets to external APIs** â€” unless the API is the intended destination
4. **Never display secrets in output** â€” redact or mask
5. **Never store secrets in checkpoint** â€” exclude from serialized state

### P17.6 â€” Sandbox Exit Strategy

When the agent determines the sandbox is compromised or misconfigured:

1. **Stop all execution** immediately
2. **Do not read or write any files**
3. **Log the issue** with details
4. **Escalate** â€” report the security concern
5. **Do not attempt** to self-correct

Indicators of compromise:
- Unexpected file contents or permissions
- Unexpected processes running
- Network connections to unknown destinations
- Modified system files
- Missing expected tools or files


## P19 â€” LEDGER INTEGRATION WITH RISK TRACKING

The ledger entries feed directly into risk aggregation:

```
On each tool call:
  1. Classify the call (WorkType, risk)
  2. Add entry to ledger
  3. Recompute aggregate risk
  4. If risk threshold crossed: checkpoint
  5. If risk cap exceeded: stop

Ledger entry for risk tracking:
  - risk value (MICRO=0 through CRITICAL=4)
  - scope status (IN/OUT/EXPANSION)
  - contract_break flag (true/false)
  - file_risk (UNCHANGED/MODIFIED_LOW/MODIFIED_MEDIUM/MODIFIED_HIGH/CREATED/DELETED)
```

The ledger serves as the single source of truth for risk state. Checkpoints serialize the ledger. Resume loads the ledger and recomputes risk. Handoffs pass the ledger.

---

**Synarc S3 session tracking, S4 auto-emit rules, S16 negative prompt rules, S17 zero-tolerance violations apply. Ledger entries for every tool call. Checkpoints at every risk threshold. Scope compliance for every operation. Self-review for every code generation. Error recovery for every failure. This document is the complete execution model for the autonomous coding agent.**
