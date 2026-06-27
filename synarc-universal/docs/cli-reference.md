---
title: CLI Reference — Synarc Universal
description: Complete reference for the `synarc` / `npx synarc-universal` CLI: every verb, every flag, every exit code, JSON output, env vars, examples.
version: 6.6.4
schema: skill-pack/v1
---

# Synarc Universal — CLI Reference (v6.6.4)

> The `synarc` command is published as the `synarc-universal` npm package. After `npm i -g synarc-universal` you get `synarc` on your `$PATH`. With `npx` you can run any verb without installing.

---

## Synopsis

```text
synarc [verb] [flags]
synarc [flags]
```

When no verb is given, `synarc` runs the **interactive picker** (auto-detects editor markers, then asks).

---

## Global flags

| Flag | Short | Description |
|---|---|---|
| `--target <id>` | `-t` | Repeatable. Restrict install to specific editor(s). Use `all` for every supported editor. |
| `--global` | `-g` | Install to the home directory instead of the current working directory (writes `~/.config/opencode/AGENTS.md` for OpenCode, etc.). |
| `--yes` | `-y` | Skip all confirmation prompts. Useful in CI. |
| `--dry-run` | `-n` | Print the plan, do not write any files. Exit code 0 on a valid plan, 1 on a bad one. |
| `--json` | | Emit machine-readable JSON on stdout (logs go to stderr). Ideal for CI pipelines. |
| `--verbose` | `-v` | Show every file path, byte count, and decision in the output. |
| `--quiet` | `-q` | Suppress non-error output. Exit code is the only signal. |
| `--no-color` | | Disable ANSI colors (also honors `NO_COLOR=1`). |
| `--no-interaction` | | Fail if a prompt is required (equivalent to old `--yes` for the interactive picker). |
| `--help` | `-h` | Show the help screen. |
| `--version` | `-V` | Print the installed Synarc version. |

---

## Verbs

`synarc` ships with eight verbs. Each maps to a real-world scenario.

### `fresh` — install into a clean project

```text
synarc fresh [--target <id>...] [--global] [--yes] [--dry-run]
```

- **Scenario:** Brand-new project, no editor config exists yet.
- **Default targets:** auto-detected markers, else `codex,opencode`.
- **Effect:** writes the per-editor file for every resolved target.
- **Lock file:** created at `<cwd>/synarc.lock.json` (or `~/synarc.lock.json` with `--global`).

### `add <editor>...` — extend an existing Synarc install

```text
synarc add cursor windsurf
```

- **Scenario:** Your project already has Synarc installed for one editor and you are adding another.
- **Effect:** writes only the missing editor files; never overwrites.
- **Lock file:** updated in-place with the new targets appended.

### `remove <editor>...` — remove an editor from the install

```text
synarc remove cursor roo-code
```

- **Scenario:** Switching from Cursor to Windsurf, or dropping an unused editor.
- **Effect:** deletes the editor-specific file (`.cursor/rules/synarc-core.mdc`, etc.) and updates the lock file.
- **Note:** Does not delete skills from the universal `synarc-universal/` pack — only the per-project pointer.

### `verify` — check the install is intact

```text
synarc verify [--target <id>...] [--json]
```

- **Scenario:** Post-install sanity check, CI gate, debugging.
- **Effect:** for each target, checks the expected file exists, is the right size, and contains valid YAML/Markdown.
- **Exit codes:**
  - `0` — all targets pass
  - `1` — one or more targets fail
  - `2` — pack not found (corrupted install)
- **CI snippet:**

  ```yaml
  - name: Verify Synarc install
    run: npx synarc-universal@latest verify --json
  ```

### `status` — read the lock file, no writes

```text
synarc status [--json]
```

- **Effect:** prints the contents of `synarc.lock.json` (or reports no lock file).
- **Use case:** idempotency checks, dashboards, debugging.

### `doctor` — verify + environment diagnostics

```text
synarc doctor [--json]
```

Checks Node.js version, git availability, file permissions, network reachability, pack integrity hash, and editor marker consistency. Returns a structured report.

| Check | Pass criteria |
|---|---|
| Node.js | `>= 18.0.0` |
| Git | `git` on PATH |
| Permissions | can read `synarc-universal/`, can write `<cwd>` |
| Pack integrity | `manifest.yaml` SHA-256 matches `package.json` `synarc.integrity` |
| Editor markers | consistent with lock file |

Exit code `0` if all pass, `1` if any fail.

### `migrate-v5` — convert legacy v5 plugin files to v6.6.4

```text
synarc migrate-v5 [--yes] [--dry-run]
```

Detects old v5 plugin files (`plugins/<editor>/`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `.roorules`, etc.) and converts them. With `--yes` runs non-interactively. With `--dry-run` only reports what would be moved.

See the full [migration guide](./migration-guide.md) for the v5 → v6.6.4 path.

### `list` — print every available skill and editor

```text
synarc list skills   # all 56 skills with descriptions
synarc list editors  # all 8 supported AI coding agents
synarc list targets  # alias for `list editors`
```

Supports `--json` for pipeline use.

---

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Success |
| `1` | Generic failure (verify failed, install blocked, missing source) |
| `2` | Pack not found or corrupted |
| `3` | Invalid flag / argument |
| `4` | Network or registry error (only relevant for `synarc install-self`) |
| `5` | Permission denied |
| `64`–`78` | Reserved for BSD sysexits.h conventions (`EX_USAGE=64`, `EX_DATAERR=65`, etc.) |

---

## Environment variables

| Variable | Effect |
|---|---|
| `NO_COLOR=1` | Disable ANSI colors (honored by `--no-color` and respected by default). |
| `FORCE_COLOR=1` | Force colors even on non-TTY. |
| `SYNARC_TARGETS` | Default targets (comma-separated) when `--target` is not passed. |
| `SYNARC_GLOBAL_DIR` | Override the home directory used with `--global`. Defaults to `$USERPROFILE` / `$HOME`. |
| `SYNARC_TELEMETRY_DISABLED=1` | Opt out of anonymous usage telemetry. |
| `SYNARC_LOG_LEVEL` | `silent` \| `error` \| `warn` \| `info` \| `debug`. Defaults to `info`. |
| `SYNARC_REGISTRY` | Override the npm registry used for self-update / lookup. |

---

## JSON output

Every verb supports `--json`. The shape is stable and versioned.

```jsonc
// synarc verify --json
{
  "synarc_version": "6.6.4",
  "node_version": "v22.12.0",
  "ok": true,
  "targets": [
    { "id": "claude-code", "label": "Claude Code", "ok": true,  "path": ".claude-plugin/plugin.json", "bytes": 1317 },
    { "id": "cursor",      "label": "Cursor",       "ok": true,  "path": ".cursor/rules/synarc-core.mdc", "bytes": 1429 },
    { "id": "windsurf",    "label": "Windsurf",     "ok": true,  "path": ".windsurfrules", "bytes": 1784 }
  ],
  "summary": { "pass": 3, "fail": 0, "total": 3 }
}
```

```jsonc
// synarc doctor --json
{
  "synarc_version": "6.6.4",
  "ok": false,
  "checks": [
    { "name": "node-version",    "ok": true,  "detail": "v22.12.0" },
    { "name": "git-available",   "ok": true,  "detail": "git 2.43.0" },
    { "name": "pack-integrity",  "ok": false, "detail": "manifest hash mismatch" }
  ]
}
```

---

## Examples

### New project, install for everything

```bash
synarc --target all --yes
```

### New project, only Cursor

```bash
synarc fresh --target cursor --yes
```

### Add Windsurf to a project that already uses Cursor

```bash
synarc add windsurf
```

### Dry-run a migration (see what would change)

```bash
synarc migrate-v5 --dry-run
```

### CI: install + verify

```bash
npx synarc-universal@latest fresh --target all --yes
npx synarc-universal@latest verify --json
```

### Audit the install

```bash
synarc doctor
```

### Programmatic API (Node 18+)

```js
import { install, verify, detect, doctor, list } from "synarc-universal";

const detected = await detect(process.cwd());
console.log("Detected editors:", detected);

const result = await install({
  targets: ["cursor", "claude-code"],
  cwd: process.cwd(),
  dryRun: false,
  yes: true,
});

const v = await verify({ targets: ["cursor", "claude-code"] });
if (!v.ok) process.exit(1);
```

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| `npm i synarc` fails with `Cannot find module '...\synarc\scripts\postinstall.js'` | The version you installed (6.6.1) published without the postinstall script in its tarball. | Upgrade: `npm i -S synarc@latest`. If you must stay on 6.6.1, install with hooks skipped and then run the CLI manually: `npm i synarc@^6.6.4 --ignore-scripts && npx synarc fresh`. |
| Windows: `'true' is not recognized as an internal or external command` after `npm i synarc` | Downstream symptom of the same missing-file bug. | Same fix as above; once the postinstall script ships, the `|| true` fallback is no longer reached. |
| Want to install without auto-wiring editors (CI, monorepo, pre-commit) | The postinstall hook auto-detects editor markers and runs `synarc fresh` for them. | Set `SYNARC_SKIP_POSTINSTALL=1` in the environment, or pass `--ignore-scripts` to npm. |

---


## Testing

Synarc ships with a **1,000+ test matrix** that exercises the public CLI surface
and the SDK against the actual editor registry, lockfile, and postinstall hook.

### Quick start

```
npm run test:smoke       # 23 smoke tests (CLI + SDK happy paths)
npm run test:sdk         # 24 SDK unit tests
npm run test:matrix      # 1,000+ data-driven test cases (TAP + JSON)
npm run test:coverage    # c8 coverage with 85/80/85 thresholds
npm test                 # smoke + sdk + matrix (default)
```

### Matrix output

`npm run test:matrix` produces:

- TAP output to stdout (one line per case: `ok 1 - M1:0001 fresh claude-code via SDK`)
- A `test-results/matrix.json` machine-readable report (one record per case)
- A `MATRIX SUMMARY: N / M passed in Y.YYs` line at the end

The matrix is generated by parameterizing the public contract:

| Group | Generator | Cases |
|---|---|---|
| M1 | verbByEditorMatrix | `verb x editor` SDK-direct invocation |
| M1b | readonly verbs per editor | `status/doctor/info/list` x editor |
| M2 | flagMatrix | `verb x flag` SDK-direct invocation |
| M3 | skillByEditorMatrix | `skill x editor` shape assertions |
| M4 | errorAndEdgeMatrix | unicode, read-only, corrupt lock, env, etc. |
| M5 | cliSpawnSampleMatrix | real `node scripts/install.js` binary |
| M6 | cliCrossProductMatrix | `verb x flag` CLI spawns |
| M7 | skillShapeMatrix | per-skill shape and quality assertions |
| Total | | **1,000+** |

### Adding cases

Append to the appropriate generator in `synarc-universal/tests/matrix.test.js`
or `tests/matrix-skills.test.js`. The matrix discovers verbs, editors, and skills
from the source so adding a new editor or verb automatically extends the matrix.

## See also

- [Installation Guide](./installation.md) — per-editor deep dive
- [Architecture](./architecture.md) — how the CLI fits the 7-layer model
- [Migration Guide](./migration-guide.md) — v5 → v6.6.4
- [Enterprise Deployment](./enterprise-deployment.md) — CI/CD, governance
