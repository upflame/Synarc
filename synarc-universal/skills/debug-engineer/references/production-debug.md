# Production Debugging

Debugging in a live environment is different from debugging on a developer machine. The blast radius is real users. The cost of a wrong move is measured in dollars, data, and trust. The rules below are mandatory.

## The cardinal rule: do no harm

Every action in production is a potential incident. Before any action, state:

- What you are about to do.
- What you expect to happen.
- What the worst case is.
- How you will know if the worst case happened.
- How you will roll back.

If you cannot state these, do not act. Read more logs, gather more data, ask for help.

## Safe actions (default)

These are read-only or low-blast-radius. Use them freely.

- Read logs, metrics, traces. The data is your friend.
- Increase log verbosity for a single user, request, or tenant.
- Snapshot a database row, a config value, or a cache entry.
- Profile in non-blocking mode (sampling, no breakpoints).
- Run a one-off query against a read replica.
- Inspect in-memory state via a debug endpoint that is auth-gated and rate-limited.
- Diff current config against last-known-good.

## Dangerous actions (require explicit approval)

These are write or control-plane operations. Each one needs a confirmation step in chat, a recorded change ticket, and a defined rollback.

- Restarting a service, pod, or container.
- Rolling back a deploy.
- Modifying a config value in a live system.
- Deleting or modifying data (even one row).
- Purging a cache.
- Killing a long-running query or job.
- Forcing a failover.
- Toggling a feature flag for a subset of users.

State the action, the blast radius, the rollback command, and the time to stable. Wait for explicit "yes, do it" before proceeding.

## Forbidden actions (always refuse)

These are never acceptable in production, even with approval:

- Running untested code against production data.
- Modifying source code and re-deploying without a test pass on staging.
- Disabling authentication, authorization, or audit logging to "make the test pass".
- Copying production data to a non-production environment that lacks equivalent access controls.
- Running `rm -rf`, `dd`, `mkfs`, or any command that destroys data without an explicit, time-bounded, recorded confirmation.
- Increasing user-facing error rate to "see what happens".

If the user asks for any of these, refuse. Propose a safe alternative.

## Feature flags

Feature flags are the primary safe-debug mechanism. Use them to:

- Enable a debug-only code path for a single user ID or tenant ID.
- Roll out a fix to 1% of traffic, then 10%, then 100%.
- Disable a suspect feature without a deploy.
- Compare two implementations side-by-side.

The flag system must support: per-user targeting, percentage rollout, instant kill switch, and an audit log of who toggled what when.

## Traffic shadowing

When you need to test a hypothesis against real traffic without affecting users:

1. Mirror a copy of the live request stream to a shadow environment.
2. Run the suspect code path in the shadow.
3. Compare the shadow's output (or error rate) against production.
4. If the shadow fails, production is unaffected. If the shadow passes, you have evidence to ship.

Shadow environments must not write back to production systems. They can write to shadow-only data stores.

## Dark canaries

A dark canary is a deploy that receives no user traffic but is exercised by synthetic requests. Use them when:

- The change is too risky to send to 1% of real users.
- You need to validate performance under load.
- The dependency is new and unproven.

The canary should be torn down after the test. Long-lived canaries accumulate config drift and become lies.

## Production debug checklist

Before declaring the bug fixed in production:

- [ ] Root cause stated as `file:line — cause` with evidence.
- [ ] Fix deployed via the standard pipeline, not a hot-patch.
- [ ] Regression test added to the suite.
- [ ] Error rate back to baseline for at least 30 minutes.
- [ ] No new error patterns in the logs.
- [ ] Customer-impact metric (success rate, latency, conversion) back to baseline.
- [ ] Postmortem scheduled within 5 business days.
- [ ] Action items from postmortem have owners and dates.

## Postmortem template

Save to `brain/postmortems/<YYYY-MM-DD>-<slug>.md`:

```markdown
# Postmortem: <one-line summary>

## Impact
- Duration: <start> to <mitigation> to <full resolution>
- Users affected: <count or percentage>
- Revenue impact: <estimate or "none">
- Data impact: <loss, exposure, corruption, none>

## Timeline (UTC)
- <time>: <event>
- <time>: <event>
- <time>: <event>
- <time>: mitigation applied
- <time>: full resolution

## Root cause
<file:line> — <one-line cause>. <One paragraph of mechanism.>

## Why we did not catch it earlier
- Test gap: <what test would have caught this>
- Monitoring gap: <what alert would have caught this>
- Process gap: <what review would have caught this>

## What went well
- <specific thing that worked>

## What went poorly
- <specific thing that made it worse>

## Action items
- [ ] <owner>: <action> by <date>
- [ ] <owner>: <action> by <date>

## Lessons
<one paragraph that a future engineer can read and learn from>
```
