# Injection Protocol Reference

See `skills/synarc-core/SKILL.md` Section S7 for complete context injection protocols.

## Injection Levels

| Level | Contents | Token Cost | When Used |
|-------|----------|------------|-----------|
| COMPACT | Scale + risk + session ID | ~50 tokens | Every tool call |
| STANDARD | + Scope boundary + recent ledger | ~200 tokens | Session start |
| FULL | + Architecture + service map | ~500 tokens | Large projects |

## Auto-Injection Rules

- COMPACT: Always, on every tool call
- STANDARD: Session start, scope changes, after CRITICAL events
- FULL: Cross-boundary changes, LARGE+ scale projects
