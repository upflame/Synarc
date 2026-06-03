# Debug Protocol — Persistent Error Memory

This is the full 6-step error intelligence protocol. The body of `SKILL.md` invokes it; this document is the load-on-demand detail.

## Step 1 — Capture

When an error appears, capture:

- Exact error string, byte-for-byte. Do not paraphrase.
- Stack trace or log line, in full.
- Input that triggered it.
- Expected behavior vs actual behavior.
- Time of occurrence, environment (dev/staging/prod), commit SHA.
- User-visible impact: how many requests, how many users, what data.

Save the capture to `brain/errors/<YYYY-MM-DD>/<slug>.md`. The slug is a short kebab-case identifier (`null-pointer-on-checkout`, `timeout-on-search`). One file per error, not per session.

## Step 2 — Cluster

Group new errors against existing `brain/errors/` entries. Two errors are the same cluster when they share:

- The same root file and line, OR
- The same external dependency and error class, OR
- The same user-visible symptom and trigger condition.

Cluster naming uses the file:line of the root cause once known, or the symptom slug while unknown. Renaming a cluster is a major event — preserve the old name as an alias.

## Step 3 — Score

Each cluster gets a priority score:

| Score | Meaning | SLA |
|---|---|---|
| P0 | Production down or data loss | Page on-call, fix in ≤ 4 hours |
| P1 | Major feature broken | Fix in ≤ 24 hours |
| P2 | Minor feature broken or workaround exists | Fix in ≤ 1 week |
| P3 | Cosmetic, edge case, or low-traffic | Backlog |

Score combines blast radius (how many users/requests affected) and severity (data loss > degraded UX > slow > wrong output). The score is not the bug's emotional weight.

## Step 4 — Hypothesize

For each P0/P1 cluster, write 3+ hypotheses. Use `references/hypothesis-template.md`. Hypotheses are cheap; the wrong fix is expensive.

## Step 5 — Verify

Run the smallest experiment that distinguishes the top two hypotheses. If you cannot run it, write the experiment as a script. Save the result to the cluster's file under `## Verification log`. Each entry is dated.

## Step 6 — Persist

After resolution:

- Mark the cluster file as `STATUS: RESOLVED` with the resolution date.
- Record the root cause, the fix, and the regression test in the file.
- Move the file from `brain/errors/` to `brain/resolved/<YYYY>/<slug>.md` (or keep in place with a status flag — pick one and be consistent).
- Add a one-line entry to `brain/known-issues.md` if the resolution is non-obvious.

The persistent error memory means the next agent — or the same agent in a new session — sees the full history, not just the latest symptom.

## Anti-patterns

- Re-classifying an error as "different" because the trace line moved. The cluster is the root cause, not the trace.
- Deleting a cluster file when the symptom stops. Stopped symptoms are not root causes.
- Aggregating P3s into P2 to make the queue look healthier. P3 stays P3.
- "Won't fix" without a written reason. Every non-fix needs a why.

## The 7-question triage

When a new error appears, answer in this order. Stop at the first yes:

1. Is production on fire? → P0, mitigation first.
2. Is data corrupted or lost? → P0, halt writes.
3. Is a security boundary broken? → P0, treat as incident.
4. Is a primary user flow broken for > 10% of users? → P1.
5. Is the same error repeating > 100× per hour? → P1.
6. Is the error in a non-critical path or has a workaround? → P2.
7. Is it a one-off or a known minor issue? → P3.
