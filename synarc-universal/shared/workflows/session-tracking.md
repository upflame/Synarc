---
workflow: session-tracking
version: 1.0.0
description: Universal session tracking workflow — immutable ledger, checkpoint protocol, cross-session persistence
---

# Session Tracking Workflow

## Purpose

Maintain a persistent, immutable record of all engineering changes across sessions. Enables session continuity, risk aggregation, handoff between agents, and audit trail.

## Trigger Conditions

WHEN:
- any file modification occurs
- session starts or resumes
- session is interrupted
- user requests handoff
- user asks for session summary

THEN:
Activate session tracking workflow

## Required Inputs

- Session identifier
- Change classification (from change-classification workflow)
- Risk assessment (from risk-assessment workflow)
- Files changed
- Contracts affected

## Workflow

### Step 1: Session Initialization

On session start, load or initialize session state:

```yaml
session_id: <uuid>
start_time: <iso-timestamp>
scale: <detected-scale>
files_touched: []
contracts_touched: []
risk_trend: []
aggregate_risk: INFO
```

### Step 2: Ledger Entry Creation

On every change, create an immutable ledger entry:

```yaml
timestamp: <iso-timestamp>
work_type: <WorkType:SUB_TYPE>
risk: <level>
score: <0-5>
scope_alignment: <IN_SCOPE|UNPLANNED>
files:
  - path: <file-path>
    change_type: <ADD|MODIFY|DELETE>
    additions: <n>
    deletions: <n>
contracts_affected: [<contract-names>]
breaking_change: <true|false>
```

### Step 3: Aggregate Risk Update

After each entry, update aggregate risk:

```pseudocode
trend = LAST 5 entries
IF trend is escalating (3+ consecutive increases):
  aggregate_risk = MAX(aggregate_risk + 1, 5)
IF trend is de-escalating (3+ consecutive decreases):
  aggregate_risk = MAX(aggregate_risk - 1, 0)
IF trend is stable:
  aggregate_risk = MAX(last_entry.risk)
```

### Step 4: Checkpoint Protocol

When aggregate risk crosses HIGH:

1. Write checkpoint with full session state
2. Generate rollback plan for all changes
3. Surface to user: "Aggregate risk at CRITICAL — checkpoint created"
4. Continue with reduced autonomy (Tier 3 or 4 only)

### Step 5: Session Continuity

On session resume after interruption:

1. Load last checkpoint
2. Verify file integrity (all files still parseable)
3. Re-classify remaining work
4. Resume from last unexecuted step
5. Note in ledger: "Session resumed from checkpoint"

### Step 6: Handoff Protocol

When agent handoff is requested:

1. Compress session state to compact block
2. Include: session ID, aggregate risk, files touched, contracts affected, open risks
3. Output in structured format for next agent to consume
4. Mark session as "handed off" in ledger

## Ledger Format

```
TIMESTAMP | WorkType:SUB_TYPE | Risk:LEVEL | Scope:ALIGNMENT | Breaking:BOOL
  → file (+additions, -deletions)
  → contract: [affected]
  → Aggregate risk: LEVEL (trend: escalating/stable/de-escalating)
```

## Validation

- Every change has an immutable ledger entry
- Aggregate risk is deterministically computed
- Checkpoints are created at risk boundaries
- Handoff blocks contain all required fields

## Failure Handling

- Ledger write fails → store in memory, queue for retry, emit as code block at session end
- Checkpoint write fails → continue with in-memory state, alert user
- Session interrupted without checkpoint → re-initialize, verify files, flag missing checkpoint

## Quality Checklist

- [ ] Session initialized with ID and timestamp
- [ ] Ledger entry created for every change
- [ ] Aggregate risk updated after each entry
- [ ] Checkpoints created at risk boundaries
- [ ] Handoff protocol available on request
- [ ] Session continuity verified on resume

## Security Checklist

- [ ] Ledger does not contain secrets or PII
- [ ] Checkpoint data is scoped to engineering changes only
- [ ] Handoff blocks exclude sensitive information

## Performance Checklist

- [ ] Ledger entry creation < 10 tokens
- [ ] Checkpoint data < 100 tokens
- [ ] Handoff block < 300 tokens
