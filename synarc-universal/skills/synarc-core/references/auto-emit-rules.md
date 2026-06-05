# Auto-Emit Rules

Auto-emit is the structured output the agent appends to its primary answer when certain conditions are met. Auto-emit is additive — it never replaces the primary answer.

## The 4 auto-emit triggers

| Trigger | When | What to emit |
|---------|------|--------------|
| SCHEMA | A migration, model change, or database schema mutation | Schema diff + migration path + consumers |
| CONTRACT | A public API, GraphQL schema, gRPC proto, or protocol change | Contract diff + migration window + consumer list |
| INCIDENT | Risk reaches HIGH, an error pattern emerges, or production is impacted | Risk banner + checkpoint reference + mitigation status |
| SESSION | End of session or scope change | Session summary + ledger digest + open items |

## Priority order

When multiple triggers fire simultaneously, prioritize:

1. INCIDENT (always first)
2. CONTRACT
3. SCHEMA
4. SESSION

INCIDENT overrides everything; the user needs the risk context before the rest.

## Budget

Auto-emit must be ≤ 20 lines. If the content exceeds 20 lines:

- Truncate to the first 20 lines.
- Append: `[Full content: <file path or session reference>]`
- Save the full content to `brain/auto-emit/<ISO-timestamp>.md`.

The 20-line cap is a hard limit. Exceeding it pollutes the primary answer.

## Format

Each auto-emit block is a fenced code block with a tag:

```text
[AUTO-EMIT: <TRIGGER>]
<content>
[/AUTO-EMIT]
```

The tag lets the runtime parse auto-emit separately from the primary answer.

## Schema trigger

When a SQL migration, ORM model, or database schema changes:

```text
[AUTO-EMIT: SCHEMA]
Migration: <path>
Change: <one-line description>
Risk: <HIGH|CRITICAL>
Reversible: <YES|NO|PARTIAL>
Down migration: <path or "missing — flag this">
Affected tables: <list>
Consumers: <code paths that read/write these tables, or "unknown">
[/AUTO-EMIT]
```

## Contract trigger

When a public API, GraphQL schema, gRPC proto, or inter-service protocol changes:

```text
[AUTO-EMIT: CONTRACT]
Surface: <API|GraphQL|gRPC|protocol>
Files: <list>
Change: <one-line description>
Risk: <HIGH|CRITICAL>
Deprecation window: <duration or "none">
Consumers: <count, with names if known>
Migration plan: <one-line or "missing — flag this">
[/AUTO-EMIT]
```

## Incident trigger

When risk escalates to HIGH+, when an error pattern is recognized, or when production is impacted:

```text
[AUTO-EMIT: INCIDENT]
Level: <HIGH|CRITICAL>
Trigger: <one-line description>
Checkpoint: <path or "not yet written">
Mitigation: <status — pending|in-progress|complete>
Affected scope: <users, services, regions>
Escalation: <who has been notified>
[/AUTO-EMIT]
```

## Session trigger

At end of session, or when the scope changes materially:

```text
[AUTO-EMIT: SESSION]
Duration: <start to end>
WorkType: <primary name>
Risk: <peak>
Mutations: <count>
Files touched: <count>
Contracts touched: <count or "none">
Open items: <list or "none">
Next session: <recommended focus or "n/a">
[/AUTO-EMIT]
```

## When NOT to auto-emit

- Read-only operations (ANALYSIS WorkType) — emit nothing.
- Successful LOW-risk changes that are part of an in-flight task — fold into the next SESSION emit.
- Repeated triggers of the same event — dedupe; emit once per scope change, not once per file.
- Trivial formatting changes (whitespace, comments) — emit nothing.

## Runtime adaptation

Some runtimes (chat web interfaces) cannot render fenced code blocks in their natural position. In that case:

- Emit the auto-emit as a code block at the end of the response.
- Prefix the block with a one-line summary: `Note: <one-line>`.

Some runtimes (IDE) can render side panels. Use the panel if available; fall back to inline otherwise.

## Gotchas

- Auto-emit is not optional when the trigger fires. Silently skipping a trigger is a protocol violation.
- Auto-emit does not include the primary answer's content. The primary answer is the answer; the auto-emit is the metadata about the answer.
- Auto-emit is in English, in the same language as the user's request.
- The 20-line cap is measured in rendered lines, not source lines. Code blocks with 5 source lines may render to 1 line.
- If a trigger fires and the agent is mid-thought, finish the thought, then append the auto-emit at the natural pause. Do not interrupt the answer.
