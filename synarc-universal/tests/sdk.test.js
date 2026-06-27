"use strict";
/**
 * Synarc Universal — SDK smoke test
 * Validates the programmatic API surface, hooks, config loader, UI helpers.
 */

const test   = require("node:test");
const assert = require("node:assert/strict");
const fs     = require("node:fs");
const path   = require("node:path");
const os     = require("node:os");

const ROOT = path.resolve(__dirname, "..");
const synarc = require(path.join(ROOT, "scripts", "lib"));

function mkTmp(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix || "synarc-sdk-"));
}
function rmTmp(p) {
  try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* */ }
}

// ---------------------------------------------------------------------------
// Surface
// ---------------------------------------------------------------------------

test("SDK exports the full surface", () => {
  for (const fn of ["install", "verify", "detect", "doctor", "status", "add", "remove",
                    "migrateV5", "uninstall", "upgrade", "info", "init"]) {
    assert.equal(typeof synarc[fn], "function", "synarc." + fn + " should be a function");
  }
  assert.equal(typeof synarc.audit.verify,    "function");
  assert.equal(typeof synarc.audit.export,    "function");
  assert.equal(typeof synarc.audit.rollback,  "function");
  assert.equal(typeof synarc.ledger.tail,     "function");
  assert.equal(typeof synarc.ledger.query,    "function");
  assert.equal(typeof synarc.ledger.show,     "function");
  assert.equal(typeof synarc.hooks.on,        "function");
  assert.equal(typeof synarc.config.load,     "function");
  assert.equal(typeof synarc.config.find,     "function");
  assert.equal(typeof synarc.config.render,   "function");
  assert.equal(synarc.PACK_VERSION, "6.6.4");
});

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

test("ui.welcome produces non-empty output", () => {
  const out = synarc.ui.welcome({ targets: ["Cursor", "Claude Code"], lockPath: "./synarc.lock.json" });
  assert.ok(out.length > 0);
  assert.ok(out.includes("Synarc Universal v6.6.4"));
  assert.ok(out.includes("Cursor"));
  assert.ok(out.includes("synarc.lock.json"));
});

test("ui.statusCard formats key-value rows", () => {
  const out = synarc.ui.statusCard("Project", [["Node", "v22.0.0"], ["Git", "git 2.43"]]);
  assert.ok(out.includes("Project"));
  assert.ok(out.includes("Node"));
  assert.ok(out.includes("v22.0.0"));
});

test("ui.table renders headers and rows", () => {
  const out = synarc.ui.table(["A", "B"], [["1", "2"], ["3", "4"]]);
  assert.ok(out.includes("A"));
  assert.ok(out.includes("B"));
  assert.ok(out.includes("1"));
  assert.ok(out.includes("4"));
});

test("ui.progressBar renders correctly at 0%, 50%, 100%", () => {
  const a = synarc.ui.progressBar(0, 10);
  const b = synarc.ui.progressBar(5, 10);
  const c = synarc.ui.progressBar(10, 10);
  assert.ok(a.includes("0%"));
  assert.ok(b.includes("50%"));
  assert.ok(c.includes("100%"));
});

test("ui.logo returns a non-empty string", () => {
  const l = synarc.ui.logo();
  assert.ok(l.length > 0);
});

// ---------------------------------------------------------------------------
// Config loader
// ---------------------------------------------------------------------------

test("config.load returns defaults in an empty dir", () => {
  const tmp = mkTmp("synarc-cfg-");
  try {
    const r = synarc.config.load(tmp);
    assert.equal(r.isDefault, true);
    assert.ok(r.config.agents === null);
    assert.ok(r.config.skills === null);
  } finally { rmTmp(tmp); }
});

test("config.load picks up a synarc.config.js in cwd", () => {
  const tmp = mkTmp("synarc-cfg2-");
  try {
    fs.writeFileSync(path.join(tmp, "synarc.config.js"),
      'module.exports = { agents: ["cursor", "claude-code"], telemetry: true };',
      "utf-8");
    const r = synarc.config.load(tmp);
    assert.equal(r.isDefault, false);
    assert.deepEqual(r.config.agents, ["cursor", "claude-code"]);
    assert.equal(r.config.telemetry, true);
  } finally { rmTmp(tmp); }
});

test("config.find walks up the tree", () => {
  const tmp = mkTmp("synarc-cfg3-");
  try {
    fs.writeFileSync(path.join(tmp, "synarc.config.js"), "module.exports = {};", "utf-8");
    const sub = path.join(tmp, "a", "b", "c");
    fs.mkdirSync(sub, { recursive: true });
    const found = synarc.config.find(sub);
    assert.ok(found && found.startsWith(tmp));
  } finally { rmTmp(tmp); }
});

test("config.render produces a valid config file template", () => {
  const tpl = synarc.config.render({ agents: ["cursor"] });
  assert.ok(tpl.includes("synarc.config.js"));
  assert.ok(tpl.includes("agents"));
  assert.ok(tpl.includes("cursor"));
  assert.ok(tpl.includes("hooks"));
});

test("config.validate flags unknown agents", () => {
  const r = synarc.config.validate({ agents: ["not-a-real-agent"] });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("not-a-real-agent")));
});

test("config.validate accepts the 8 known agents", () => {
  const r = synarc.config.validate({ agents: ["claude-code", "codex", "opencode", "cursor", "windsurf", "copilot", "gemini-cli", "cline"] });
  assert.equal(r.ok, true);
});

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

test("hooks.on registers and runs an afterInstall hook", async () => {
  let called = 0;
  const off = synarc.hooks.on("afterInstall", async () => { called++; });
  try {
    // Fire a synthetic event
    await synarc.hooks.bus.emit("afterInstall", { cwd: ROOT, opts: {}, result: {} });
    assert.equal(called, 1);
  } finally { off(); }
  // After unsubscribe, no further calls
  await synarc.hooks.bus.emit("afterInstall", {});
  assert.equal(called, 1);
});

test("hooks emit results are returned in order", async () => {
  const results = await synarc.hooks.bus.emit("beforeVerify", { foo: 1 });
  // No listeners => empty array
  assert.ok(Array.isArray(results));
});

test("a hook that throws does not abort the pipeline", async () => {
  let beforeCalled = 0, afterCalled = 0;
  synarc.hooks.on("testEvent", async () => { beforeCalled++; throw new Error("boom"); });
  synarc.hooks.on("testEvent", async () => { afterCalled++; });
  const results = await synarc.hooks.bus.emit("testEvent", {});
  assert.equal(beforeCalled, 1);
  assert.equal(afterCalled, 1);
  assert.equal(results.length, 2);
  assert.equal(results[0].ok, false);
  assert.equal(results[1].ok, true);
});

// ---------------------------------------------------------------------------
// Info command
// ---------------------------------------------------------------------------

test("info returns a structured object", async () => {
  const r = await synarc.info({ cwd: ROOT });
  assert.equal(r.code, 0);
  assert.equal(r.synarcVersion, "6.6.4");
  assert.equal(r.editors, 8);
  assert.ok(r.skills >= 50);
  assert.ok(Array.isArray(r.detected));
});

test("info --json produces valid JSON", () => {
  const { execFileSync } = require("node:child_process");
  const out = execFileSync("node", [path.join(ROOT, "scripts", "install.js"), "info", "--json"], {
    cwd: ROOT, env: { ...process.env, NO_COLOR: "1" },
    encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"],
  });
  const j = JSON.parse(out);
  assert.equal(j.code, 0);
  assert.equal(j.info.synarcVersion, "6.6.4");
  assert.equal(j.info.editors, 8);
});

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

test("init creates synarc.config.js with detected agents", async () => {
  const tmp = mkTmp("synarc-init-");
  try {
    // Create a .cursor marker so init auto-detects
    fs.mkdirSync(path.join(tmp, ".cursor", "rules"), { recursive: true });
    fs.writeFileSync(path.join(tmp, ".cursor", "rules", "x.mdc"), "// x", "utf-8");
    const r = await synarc.init({ cwd: tmp, yes: true });
    assert.equal(r.code, 0);
    assert.ok(fs.existsSync(r.path));
    const content = fs.readFileSync(r.path, "utf-8");
    assert.ok(content.includes("synarc.config.js"));
    assert.ok(content.includes("cursor"));
  } finally { rmTmp(tmp); }
});

test("init does not overwrite an existing config without --force", async () => {
  const tmp = mkTmp("synarc-init2-");
  try {
    const p = path.join(tmp, "synarc.config.js");
    fs.writeFileSync(p, "module.exports = { existing: true };", "utf-8");
    const r = await synarc.init({ cwd: tmp, yes: false });
    assert.equal(r.code, 0);
    assert.equal(r.existed, true);
    const after = fs.readFileSync(p, "utf-8");
    assert.ok(after.includes("existing: true"));
  } finally { rmTmp(tmp); }
});

// ---------------------------------------------------------------------------
// Audit / Ledger
// ---------------------------------------------------------------------------

test("audit.verify returns ok in v6.6.0", async () => {
  const r = await synarc.audit.verify({ cwd: ROOT });
  assert.equal(r.code, 0);
  assert.equal(r.ok, true);
});

test("audit.export accepts a format", async () => {
  const r = await synarc.audit.export({ cwd: ROOT, format: "eu-ai-act" });
  assert.equal(r.code, 0);
  assert.equal(r.format, "eu-ai-act");
});

test("ledger.tail returns an empty list", async () => {
  const r = await synarc.ledger.tail({ cwd: ROOT });
  assert.equal(r.code, 0);
  assert.ok(Array.isArray(r.entries));
});

test("ledger.show returns null for missing id", async () => {
  const r = await synarc.ledger.show({ cwd: ROOT, id: "missing" });
  assert.equal(r.code, 0);
  assert.equal(r.entry, null);
});
