# Session Tracking (synarc-core)

The session ledger is the immutable record of every mutation. It enables resume, postmortem, and learning.

## The brain/ directory

```text
brain/
├── CURRENT_STATE.md
├── MODULE_MAP.md
├── API_CONTRACTS.md
├── known-issues.md
├── ledger/
│   └── <YYYY-MM-DD>.mdl         # append-only, one file per day
├── checkpoints/
│   └── <ISO-timestamp>.md       # one per risk escalation
├── errors/
│   └── <YYYY-MM-DD>/<slug>.md   # one file per error
├── postmortems/
│   └── <slug>.md
└── resolved/
    └── <YYYY>/<slug>.md
```

## Ledger entry format

```text
[LEDGER <ISO-8601>]
WorkType: <name>
Risk: <level>
Files: <list>
Contracts: <list or "none">
Breaking: <YES|NO>
Rollback: <one-line>
```

Append-only. Never edit a past entry. Reverts get a new entry.

## Checkpoint format (HIGH+ risk)

```markdown
# Checkpoint <ISO-timestamp>

## State
- Last step: <S0 step>
- Files: <list>
- Aggregate risk: <level>

## Rollback
- Last clean commit: <SHA>
- Pending: <list>
```

## Resume protocol

1. Detect interruption.
2. Read latest checkpoint; if none, read latest ledger.
3. Verify file integrity for touched files.
4. Re-emit last Context Block.
5. Resume from last completed step.

For full schema details and the brain/ layout, see `session-tracking.md` in the synarc-core references set. (This file is a stub for cross-skill reference.)
