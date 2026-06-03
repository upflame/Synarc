# Binary Search Cookbook

When you do not know where the bug is, halve the search space. This is the single most powerful debugging technique.

## Git bisect

```bash
git bisect start
git bisect bad                    # current commit is broken
git bisect good <last-known-good-sha>
# Git checks out the midpoint. Test it. Then:
git bisect good   # or
git bisect bad
# Repeat until git bisect outputs: <sha> is the first bad commit
git bisect reset
```

Automate with a test script:

```bash
git bisect start HEAD <last-known-good-sha>
git bisect run npm test
```

`git bisect run` exits 0 (good) or non-zero (bad). If the test is flaky, add a retry loop around it. The bisect finds the first commit that fails the test, which is usually the one that introduced the bug.

## Log bisect

When you cannot change the code, bisect over log lines:

1. Pick a log line that is present when the bug occurs and absent when it does not. If you do not have one, instrument first.
2. Find the time of the first occurrence. Find the time of the last known good. The bug was introduced between.
3. Bisect over log events between those two times. Look for new error patterns, new config keys, new deploys, new feature flags.

## Dependency bisect

When the bug appeared after a dependency update:

```bash
npm ls <package>                  # current version
git log --oneline -- package-lock.json
# For each commit, check the locked version
# Bisect to find the version that introduced the bug
```

For runtime dependency skew, dump the resolved versions of all loaded modules and diff against the last good run.

## Data bisect

When the bug is data-dependent (only some inputs trigger it):

1. Take the failing input. Split it in half. Test each half.
2. The half that fails is the smaller search space. Recurse.
3. When the failing input is a single record, you have the smoking gun.

For SQL, bisect with row counts:

```sql
-- Run on a known-bad dataset
SELECT * FROM <table>
WHERE <id> BETWEEN (SELECT MIN(id) FROM <bad_subset>)
               AND (SELECT MIN(id) + (MAX(id) - MIN(id)) / 2 FROM <bad_subset>);
```

If the bug reproduces, the offending rows are in the first half. Repeat.

## Config bisect

When the bug appeared after a config change:

1. List the changed config keys (`git diff config/`, `kubectl diff`, `terraform plan`).
2. Revert one at a time. Test after each revert. The one that fixes the bug is the cause.
3. If reverting all of them does not fix it, the bug is not in config.

## Time bisect

When the bug is correlated with time of day, day of week, or business cycle:

1. Plot the failure rate over time. Look for patterns: hourly (cron), daily (cache TTL), weekly (deploy window), monthly (batch job).
2. Once you have a correlation, find what runs at that time.
3. Bisect the time-series data, not the code.

## Anti-patterns

- Bisecting without a reliable test. The bisect will give you the wrong answer.
- Skipping the "good" baseline. If the last-known-good is also broken, the bisect is poisoned.
- Bisecting by hand. `git bisect run` is faster and more accurate.
- Bisecting when the answer is in the diff. If you have 5 changed files, read them first.
