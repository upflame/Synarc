---
title: SDK Reference
description: Programmatic API for Synarc. Install hooks, config loading, audit, ledger, info, custom CLIs.
version: 6.6.4
schema: skill-pack/v1
---

# SDK Reference (v6.6.4)

> Synarc ships as a full Node.js SDK. Drop it into your own CLI, IDE plugin, or agent framework. The same code that powers the `synarc` CLI is exported as a programmatic API.

---

## Install

```bash
npm install synarc
```

## Import

```js
// CommonJS
const synarc = require("synarc");

// ES modules
import synarc from "synarc";
```

The package's `main` entry is `scripts/lib/index.js` and it ships a TypeScript-style `index.d.ts` declaration.

---

## Quick start

```js
const synarc = require("synarc");

// 1. Install for two editors
const r = await synarc.install({ targets: ["cursor", "claude-code"] });
console.log("Installed:", r.results.filter(x => x.ok).length, "of", r.results.length);

// 2. Verify
const v = await synarc.verify({ targets: ["cursor"] });
if (!v.ok) process.exit(1);

// 3. Run the doctor
const d = await synarc.doctor();
if (d.checks.some(c => !c.ok)) console.warn("Some checks failed");

// 4. React to events
synarc.hooks.on("afterInstall", async (ctx) => {
  console.log("afterInstall fired for", ctx.cwd);
});
```

---

## API surface

### Core

| Function | Description |
|---|---|
| `install({ targets, cwd, dryRun, yes, global })` | Install for one or more editors |
| `verify({ targets, cwd })` | Check the install is intact |
| `remove(targets, { cwd })` | Remove one or more editors |
| `uninstall({ cwd, yes })` | Remove everything Synarc wrote |
| `detect(cwd)` | Return array of editor ids detected in `cwd` |
| `doctor({ cwd })` | Run environment diagnostics |
| `status({ cwd })` | Read the lock file (no writes) |
| `info({ cwd })` | Pretty project + pack status card |
| `init({ cwd, yes, force })` | Scaffold `synarc.config.js` |
| `upgrade({ cwd })` | Show changelog + run migration |
| `migrateV5({ cwd, dryRun })` | Convert legacy v5 plugin files |
| `add(targets, { cwd })` | Add editors to an existing install |

### Subcommand groups

```js
// Audit
await synarc.audit.verify({ cwd });
await synarc.audit.export({ cwd, format: "eu-ai-act" });
await synarc.audit.rollback({ cwd, contractId: "..." });

// Ledger
await synarc.ledger.tail({ cwd, since: "7d", minRisk: "HIGH" });
await synarc.ledger.query({ cwd, args: ["--since", "30d"] });
await synarc.ledger.show({ cwd, id: "..." });
```

### Discovery

```js
// List
const editors = synarc.list.editors();   // 8 editors
const skills  = synarc.list.skills();    // 56 skills

// Config
const { config, path, isDefault } = synarc.config.load(cwd);
const tpl = synarc.config.render({ agents: ["cursor"] });

// Lock
const { lock, path } = synarc.lock.read(cwd);
synarc.lock.write(cwd, results, "fresh");
```

### Hooks

The SDK ships an event bus. Register handlers, fire events, await results.

```js
synarc.hooks.on("beforeInstall", async (ctx) => { /* ... */ });
synarc.hooks.on("afterInstall",  async (ctx) => { /* ... */ });
synarc.hooks.on("beforeVerify",  async (ctx) => { /* ... */ });
synarc.hooks.on("afterVerify",   async (ctx) => { /* ... */ });
synarc.hooks.on("beforeRemove",  async (ctx) => { /* ... */ });
synarc.hooks.on("afterRemove",   async (ctx) => { /* ... */ });
synarc.hooks.on("beforeDoctor",  async (ctx) => { /* ... */ });
synarc.hooks.on("afterDoctor",   async (ctx) => { /* ... */ });
synarc.hooks.on("onError",       async ({ event, payload, error }) => { /* ... */ });
```

Hooks are async, awaited in registration order. A hook that throws does **not** abort the pipeline; the error is emitted on `onError` and the next hook still runs.

```js
const off = synarc.hooks.on("afterInstall", async (ctx) => { /* ... */ });
// ...
off();  // unsubscribe
```

### UI helpers

Build your own CLI on top of the SDK:

```js
const { logo, welcome, statusCard, table, progressBar, box } = synarc.ui;

console.log(logo());
console.log(welcome({ targets: ["Cursor", "Claude Code"] }));
console.log(statusCard("Project", [["Node", "v22"], ["Git", "git 2.43"]]));
console.log(progressBar(5, 10));
```

---

## `synarc.config.js`

Scaffold a project config with `synarc.init({ cwd, yes: true })`. The file is auto-discovered by walking up the tree from the cwd.

```js
// synarc.config.js
module.exports = {
  version: ">=6.0.0",
  agents: ["claude-code", "codex", "opencode"],
  skills: null,                  // null = all 56
  excludeSkills: [],
  riskCaps: { INCIDENT: "CRITICAL" },
  guardrails: [],
  hooks: {
    beforeInstall: async (ctx) => { /* ... */ },
    afterInstall:  async (ctx) => { /* ... */ },
  },
  telemetry: false,
  experimental: {},
};
```

Use it from your code:

```js
const { config, path } = synarc.config.load(cwd);
if (config.agents) {
  await synarc.install({ targets: config.agents, cwd });
}
```

---

## Return shapes

All SDK functions return plain objects with stable keys. The shape is JSON-serializable.

```ts
type Result = {
  code: number;            // exit code (0 = ok)
  results?: EditorResult[]; // for install/verify
  lock?: LockFile | null;   // for status/install
  checks?: CheckResult[];   // for doctor
  editors?: Editor[];      // for list
  skills?: Skill[];        // for list
};

type EditorResult = {
  id: string;
  label: string;
  ok: boolean;
  action?: "installed" | "skipped" | "appended" | "generated" | "removed";
  path: string;
  bytes?: number;
  copied?: number;
  skipped?: number;
  reason?: string;
  note?: string;
};
```

---

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Generic failure (verify failed, install blocked) |
| 2 | Pack not found / corrupted |
| 3 | Invalid argument |
| 4 | Network error |
| 5 | Permission denied |

---

## Building your own CLI

```js
#!/usr/bin/env node
const synarc = require("synarc");

const cwd = process.cwd();
const r = await synarc.install({ targets: ["cursor"], cwd, yes: true });
console.log(synarc.ui.welcome({ targets: r.results.filter(x => x.ok).map(x => x.label) }));
process.exit(r.code);
```

```js
// With hooks for analytics
synarc.hooks.on("afterInstall", async (ctx) => {
  await fetch("https://my-analytics.example.com/install", {
    method: "POST",
    body: JSON.stringify({ cwd: ctx.cwd, count: ctx.result.results.length }),
  });
});
```

---

## See also

- [CLI reference](../cli-reference.md) — every command, every flag
- [Architecture](../architecture.md) — the 7-layer design
- [Schemas](../schemas.md) — the formal data contracts
- [Config file](../installation.md#synarcconfigjs) — the project config
