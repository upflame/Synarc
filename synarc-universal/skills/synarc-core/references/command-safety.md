# Command Safety Classification

Every command is classified into one of three tiers before execution. The classification determines the review depth and approval required.

## Tier 1 — Safe (execute without review)

Read-only or pure-observation commands. No side effects, no mutation, no external state change.

```text
grep, find, git log, git diff, git status, git show, git blame
ls, cat, head, tail, echo, pwd, which, type
npm ls, pip list, go list, cargo tree, dotnet --list-sdks
tsc --noEmit, ruff check, eslint, prettier --check
jest --listTests, pytest --collect-only, cargo check
mix compile --no-deps-check, go vet
curl -I, curl -X GET
ps, top, htop, free, df, du, uptime, uname
man, help, info
```

## Tier 2 — Unsafe (confirm before execution)

Mutating commands with bounded blast radius. Reversible in most cases. State the action and the rollback before executing.

```text
npm install, npm uninstall, npm update
pip install, pip uninstall
go mod tidy, go get
bundle install, gem install
git add, git commit, git merge, git rebase, git stash
git reset (soft/mixed)
rm <file>, mv <file>, cp <file>
mkdir, rmdir (empty dir)
docker build, docker tag
docker compose up (dev), docker compose down
kubectl apply (staging), kubectl get, kubectl describe
terraform plan, terraform validate
chmod, chown (single file)
psql -c "<read-only query>"
git checkout -b <branch>, git switch -c <branch>
```

For each Tier 2 command, emit before execution:

```text
[ACTION]
Command: <full command>
Risk: <MEDIUM|HIGH>
Blast radius: <what could be affected>
Rollback: <one-line command to undo>
Proceed? <yes|no>
```

## Tier 3 — Dangerous (full assessment + rollback plan + explicit approval)

Destructive, irreversible, or production-impacting commands. Require:

- Written risk assessment
- Tested rollback procedure
- Explicit user approval
- Recorded change ticket (in production)

```text
DROP TABLE, DROP DATABASE, DROP SCHEMA
DELETE FROM <table> (without WHERE)
TRUNCATE <table>
UPDATE <table> SET <column> (without WHERE)
ALTER TABLE ... DROP COLUMN
ALTER TABLE ... DROP CONSTRAINT
terraform destroy, terraform apply (prod)
kubectl delete namespace, kubectl delete cluster
kubectl delete <resource> (prod)
rm -rf, rm -r <dir>
git push --force, git push --force-with-lease
git reset --hard
git clean -fdx
REINDEX CONCURRENTLY (in prod)
VACUUM FULL
pg_dump with --clean
docker system prune -a
docker volume prune
certbot delete --cert-name <name>
cloud deployment commands (aws deploy, gcloud run deploy, az webapp deploy)
production database migrations
secrets rotation
permission bulk changes (chmod -R, chown -R)
```

For each Tier 3 command, emit:

```text
[ACTION — DANGEROUS]
Command: <full command>
Risk: <CRITICAL>
Blast radius: <what is at risk, including non-obvious side effects>
Reversible: <YES|NO|PARTIAL — explain>
Rollback: <concrete steps to restore prior state>
Time to stable: <estimate>
Notification: <who needs to know>
Change ticket: <ticket ID or "TBD">
Proceed? <yes|no>
```

Wait for explicit "yes, do it" before proceeding. A response of "looks good" or "go ahead" without the literal "yes" is not sufficient.

## Classification rules

When in doubt, classify higher.

- If a command has both a read-only and a mutating form, classify based on the actual invocation.
- A pipeline that starts safe but ends unsafe is unsafe overall.
- Commands that depend on environment variables are classified by the worst-case interpretation of those variables.
- Shell aliases and functions are classified by what they actually do, not what they appear to do.

## Bypass protocol (production emergencies only)

In a Tier 3 INCIDENT, the user can issue a bypass:

```text
BYPASS <reason>
```

The bypass is logged to the ledger with reason, time, and author. The command still requires explicit confirmation, but the user can skip the "recorded change ticket" requirement.

Bypasses are not a normal path. They are audited. If a user issues more than 2 bypasses in a week, the workflow is wrong.

## Gotchas

- `rm -rf` is always Tier 3. There is no safe variant.
- `git push` is Tier 2 to feature branches, Tier 3 to main/master/production.
- `docker run` is Tier 2; `docker run --rm` is Tier 2; `docker run -v /etc:/host/etc` is Tier 3.
- `kubectl apply -f` is Tier 2 for staging, Tier 3 for production. The file content is not classified; the target is.
- `npm install` of a new package is Tier 2; `npm install --force` is Tier 3.
- Any command with `sudo` is at least Tier 2; with `sudo rm` or `sudo chmod -R`, Tier 3.
- `curl` with a POST/PUT/DELETE is Tier 2; with `--data` and a non-idempotent verb, Tier 2 with confirmation.
- Backgrounded commands (`&`, `nohup`) inherit the classification of the foreground command. They also need a kill plan.
