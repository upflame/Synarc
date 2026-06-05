# Error Intelligence Protocol

6-step protocol with persistent error memory. The body of `SKILL.md` invokes the protocol; this document is the full specification.

## The 6 steps

### 1. Capture

When an error appears, capture the load-bearing facts:

- Exact error string, byte-for-byte.
- Stack trace or log line, in full.
- Input that triggered it.
- Expected vs actual behavior.
- Time, environment, commit SHA.
- User-visible impact (requests, users, data).

Save to `brain/errors/<YYYY-MM-DD>/<slug>.md`. One file per error, not per session. The slug is a kebab-case identifier of the symptom.

### 2. Cluster

Group new errors against existing `brain/errors/` entries. Two errors are the same cluster when they share the same root file:line, or the same external dependency + error class, or the same user-visible symptom + trigger.

Cluster naming uses the root cause file:line once known, or the symptom slug while unknown. Renaming a cluster is a major event — preserve the old name as an alias.

### 3. Score

Each cluster gets a priority:

| Score | SLA |
|-------|-----|
| P0 | Page on-call, fix in ≤ 4 hours |
| P1 | Fix in ≤ 24 hours |
| P2 | Fix in ≤ 1 week |
| P3 | Backlog |

Score combines blast radius (how many users/requests) and severity (data loss > degraded UX > slow > wrong). The score is not the bug's emotional weight.

### 4. Hypothesize

For P0/P1 clusters, write 3+ hypotheses. Use `debug-engineer/references/hypothesis-template.md`. Each candidate has a mechanism, evidence for, evidence against, and a discriminating test.

### 5. Verify

Run the smallest experiment that distinguishes the top two hypotheses. Save the result under `## Verification log` in the cluster file with a date.

### 6. Persist

After resolution:

- Mark cluster file as `STATUS: RESOLVED` with the resolution date.
- Record root cause, fix, and regression test.
- Move to `brain/resolved/<YYYY>/<slug>.md` (or keep in place with a status flag).
- Add a one-line entry to `brain/known-issues.md` if non-obvious.

## The 7-question triage

When a new error appears, answer in this order. Stop at the first yes:

1. Is production on fire? → P0, mitigation first.
2. Is data corrupted or lost? → P0, halt writes.
3. Is a security boundary broken? → P0, treat as incident.
4. Is a primary user flow broken for > 10% of users? → P1.
5. Is the same error repeating > 100× per hour? → P1.
6. Is the error in a non-critical path or has a workaround? → P2.
7. Is it a one-off or a known minor issue? → P3.

## Transient vs permanent errors

Classify every tool error before retrying:

**Transient** — retry with exponential backoff (3 attempts, 1s/2s/4s):
- Network timeouts
- Rate limit (HTTP 429)
- Service unavailable (HTTP 503)
- Connection reset
- Disk full (might clear)
- Lock acquisition timeout

**Permanent** — stop, log, surface to user:
- Syntax error in code
- Type error
- Authentication failure (HTTP 401)
- Authorization failure (HTTP 403)
- Not found (HTTP 404)
- Validation error (HTTP 400)
- Permission denied (file system)
- Disk not found

Never retry permanent errors. The retry will fail the same way.

## Anti-patterns

- Re-classifying an error as "different" because the trace line moved. The cluster is the root cause, not the trace.
- Deleting a cluster file when the symptom stops. Stopped symptoms are not root causes.
- Aggregating P3s into P2 to make the queue look healthier. P3 stays P3.
- "Won't fix" without a written reason. Every non-fix needs a why.
- Capturing only the error message, not the trigger conditions. The message alone is not enough to reproduce.

## Cluster file format

```markdown
# Error Cluster: <slug>

Status: <OPEN|RESOLVED|MITIGATED|WONTFIX>
Priority: <P0|P1|P2|P3>
First seen: <ISO-8601>
Last seen: <ISO-8601>
Resolved: <ISO-8601 or "—">
Score trend: <count over time>

## Symptom
<one-line user-visible description>

## Trigger conditions
- <condition 1>
- <condition 2>

## Capture
<exact error string and stack trace>

## Hypotheses
- H1: <candidate>
- H2: <candidate>
- H3: <candidate>

## Verification log
- <date>: <experiment> → <result>

## Root cause
<file:line> — <one-line cause>

## Fix
<one-line fix description>

## Regression test
<test that catches this class>

## Aliases
- <old slug 1>
- <old slug 2>
```

## When to hand off

Hand off to `debug-engineer` when:

- The error is in production and requires systematic debugging.
- The error is intermittent and needs statistical evidence.
- The error is in a security-sensitive path and needs threat-aware analysis.
- The error recurs and the root cause is not yet identified.

The `synarc-core` protocol captures and clusters; `debug-engineer` does the actual hypothesis testing and root cause analysis.
