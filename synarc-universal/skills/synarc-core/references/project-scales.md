# Project Scales Reference

See `skills/project-scales/SKILL.md` for complete scale detection and adaptation.

## Scale Definitions

| Scale | Threshold | Tracking | Injection | Checkpoints |
|-------|-----------|----------|-----------|-------------|
| NANO | 1 file | Risk only | SILENT | None |
| MICRO | 2-10 files | CURRENT_STATE | COMPACT | Significant |
| SMALL | <5k LOC | Full brain | STANDARD | Per task |
| MEDIUM | 5k-50k LOC | Full ledger | STANDARD | Per change |
| LARGE | 50k-500k LOC | Service tracking | FULL | Per service |
| ENTERPRISE | >500k LOC | Audit trail | FULL+pre | Per mutation |
