# Session Tracking Reference

See `skills/synarc-core/SKILL.md` Section S8 for complete session tracking protocols.

## Key Components

- **Session Ledger**: Immutable append-only log of all changes
- **CHANGE_LEDGER.md**: Persistent session history in brain directory
- **Checkpoints**: State snapshots at significant milestones
- **Handoff Protocol**: Agent-to-agent transfer format

## Ledger Entry Format

```
[timestamp] WORKTYPE | RISK | SCOPE | REVERSIBILITY
  -> file1 (+N, -M)
  -> file2 (+N, -M)
  -> Aggregate risk: LEVEL (reason)
```
