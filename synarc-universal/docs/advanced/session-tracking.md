---
title: Session Tracking and the Ledger
description: How Synarc maintains an immutable ledger across sessions. Append-only, git-anchored, and queryable.
version: 6.6.4
schema: skill-pack/v1
---

# Session Tracking and the Ledger

> Every mutation in Synarc produces a ledger entry. The ledger is **append-only**, **git-anchored**, and **queryable** via the CLI.

---

## Why a separate ledger?

`git log` is the ultimate record of file changes. But it is not searchable by **intent type, risk level, or contract ID**. The Synarc ledger adds the **semantic layer** on top of `git`.

```text
git log                          Synarc ledger
─────────────                    ─────────────
commit abc123                    ledger entry
"fix typo"                        contract: 9b1deb4d
  src/auth.ts | 2 +-              work_type: FIX
                                  risk: LOW
                                  scope: in_scope
                                  files: src/auth.ts (+2, -1)
                                  contracts_affected: [AuthAPI.login]
                                  session: s_2026-06-22_001
```

The ledger row makes the commit **queryable by intent and risk** — which is the whole point.

---

## Entry shape

Every ledger entry matches [`ledger-entry.schema.json`](../../shared/schemas/ledger-entry.schema.json):

```yaml
entry_id: 7c9e6679-7425-40de-944b-e07fc1f90ae7
timestamp: 2026-06-22T10:00:00Z
work_type: FIX
risk_level: LOW
scope: in_scope
breaking_change: false
files_touched:
  - path: src/auth.ts
    additions: 2
    deletions: 1
contracts_affected:
  - AuthAPI.login
aggregate_risk:
  current: LOW
  trend: stable
session_id: s_2026-06-22_001
```

---

## Where it lives

| Agent | Storage |
|---|---|
| Claude Code | `brain/LEDGER.md` (project root) |
| OpenCode | `brain/LEDGER.md` (project root) |
| Cline | `brain/LEDGER.md` (project root) |
| Codex CLI | In-memory; flushed to `AGENTS.md` on session end |
| Cursor | In-memory only |
| Windsurf | In-memory only |
| GitHub Copilot | In-memory only |
| Gemini CLI | `GEMINI.md` (generated, includes a section) |

The canonical store is `brain/LEDGER.md`. The other locations are derived projections.

---

## Queries

The CLI ships with a query interface:

```bash
# Last 10 entries
synarc ledger tail

# All entries in the last 7 days at HIGH+ risk
synarc ledger query --since 7d --min-risk HIGH

# All breaking changes
synarc ledger query --breaking

# Entries that touched a specific file
synarc ledger query --path src/auth.ts

# Entries from a specific contract
synarc ledger query --contract 9b1deb4d

# JSON output for piping
synarc ledger query --since 30d --min-risk MEDIUM --json | jq
```

---

## Aggregate risk

The ledger maintains a running `aggregate_risk` value. The risk engine uses the last N entries to compute a trend:

- `stable` — last 5 entries within ±1 level
- `rising` — last 3 entries trending up
- `falling` — last 3 entries trending down

When `aggregate_risk` crosses `HIGH`, a **checkpoint** is created. The user can run `synarc checkpoint list` to see them.

---

## See also

- [The Brain](./brain.md) — where the ledger is persisted
- [Audit Trail](./audit.md) — the higher-level compliance record
