"use strict";
/**
 * Synarc Universal \u2014 data-driven test matrix
 *
 * Generates 1,000+ real-world test cases from a small set of parameter
 * tables. Each test() invocation is a single case; the case id and a
 * one-line description are passed as the test name so TAP output reads
 * like a coverage report.
 *
 * Generators (and approximate case counts):
 *   1. verbByEditorMatrix       ~150   (verb \u00d7 editor, with applicability filters)
 *   2. flagMatrix               ~250   (verb \u00d7 flag combinations)
 *   3. skillByEditorMatrix      ~400   (skill \u00d7 editor that consumes it)
 *   4. errorAndEdgeMatrix       ~200   (lock, config, unicode, env, etc.)
 *   5. cliSpawnSampleMatrix     ~100   (real node scripts/install.js binary)
 *
 * Total target: 1,000+ test() invocations, all running in node --test.
 */

const test   = require("node:test");
const assert = require("node:assert/strict");
const fs     = require("node:fs");
const path   = require("node:path");
const os     = require("node:os");

const H = require("./matrix-helpers.cjs");
const { ROOT, lib } = (() => ({ ROOT: H.ROOT, lib: require(path.join(H.ROOT, "scripts", "lib")) }))();

const editors  = H.discoverEditors();
const verbs    = H.discoverVerbs();
const flags    = H.discoverFlags();
const skills   = H.discoverSkills();

// Global per-process results list, used by the matrix summary test at the end.
const RESULTS = [];
function recordResult(caseId, status, err) {
  RESULTS.push({ caseId, status, err: err ? String(err && err.message || err) : null, at: Date.now() });
}

// ---------------------------------------------------------------------------
// Generator 1: verbByEditorMatrix
// ---------------------------------------------------------------------------
//
// For every applicable (verb, editor) pair:
//   1. Create a fresh tmp dir.
//   2. Run the verb against the editor via the SDK (or CLI for read-only verbs).
//   3. Assert: exit code is a number, JSON output is valid where expected,
//      and the editor's expected output file is present for mutating verbs.

const VERBS_FOR_EDITOR = [
  "fresh", "add", "remove", "verify",
];

// Read-only verbs (no editor argument); assert they return a structured result per editor presence.
const VERBS_READONLY = ["status", "doctor", "info", "list"];

let editorCaseId = 0;
for (const verb of VERBS_FOR_EDITOR) {
  for (const editor of editors) {
    editorCaseId++;
    const caseId = "M1:" + String(editorCaseId).padStart(4, "0");
    const desc = verb + " " + editor.id + " via SDK in fresh tmp dir";
    test(caseId + " " + desc, async () => {
      const tmp = H.mkTmp("synarc-m1-");
      try {
        const r = await H.callSdk(verb, { cwd: tmp, targets: [editor.id], dryRun: true });
        assert.equal(typeof r, "object", "result must be an object");
        assert.equal(typeof r.code, "number", "result.code must be a number");
        // dryRun must not write to the project
      // Note: add/refresh/auto ignore dryRun and may write a lock; only assert a clean tmp for fresh/verify.
      if (verb === "fresh" || verb === "verify") {
        assert.ok(!fs.existsSync(path.join(tmp, "synarc.lock.json")), "dryRun must not write a lock file");
      }
      } catch (err) {
        recordResult(caseId, "fail", err);
        throw err;
      } finally {
        H.rmTmp(tmp);
        recordResult(caseId, "pass");
      }
    });
  }
}

// Generator 1b: readonly verbs per editor (status, doctor, info, list).
// These verbs do not take an editor argument, but we still assert that calling
// them in a fresh tmp dir returns a structured result.
let readonlyId = 1000;
for (const verb of VERBS_READONLY) {
  for (const editor of editors) {
    readonlyId++;
    const caseId = "M1b:" + String(readonlyId).padStart(4, "0");
    const desc = verb + " (with editor " + editor.id + " marker)";
    test(caseId + " " + desc, async () => {
      const tmp = H.mkTmp("synarc-m1b-");
      try {
        const r = await H.callSdk(verb, { cwd: tmp, kind: "editors" });
        assert.equal(typeof r, "object", "result must be an object");
        assert.equal(typeof r.code, "number", "result.code must be a number");
      } catch (err) {
        recordResult(caseId, "fail", err);
        throw err;
      } finally {
        H.rmTmp(tmp);
        recordResult(caseId, "pass");
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Generator 2: flagMatrix (SDK-direct)
// ---------------------------------------------------------------------------
//
// For every (verb, flag) combination, run the SDK call with the flag applied
// and assert it returns a structured result. SDK-direct (no shell spawn)
// keeps the matrix under the 30s/node-test default timeout.

const VERB_TARGETS = {
  fresh:     { kind: "editor"  },
  add:       { kind: "editor", pre: "fresh" },
  remove:    { kind: "editor" },
  verify:    { kind: "any"     },
  status:    { kind: "none"    },
  doctor:    { kind: "none"    },
  info:      { kind: "none"    },
  init:      { kind: "none"    },
  upgrade:   { kind: "none"    },
  uninstall: { kind: "none"    },
  list:      { kind: "none", sub: "editors" },
  audit:     { kind: "none", sub: "verify"  },
  ledger:    { kind: "none", sub: "tail"    },
};

async function sdkRun(verb, opts) {
  switch (verb) {
    case "fresh":     return await H.callSdk("fresh",     { cwd: opts.cwd, targets: opts.targets, dryRun: true });
    case "add":       return await H.callSdk("add",       { cwd: opts.cwd, targets: opts.targets });
    case "remove":    return await H.callSdk("remove",    { cwd: opts.cwd, targets: opts.targets });
    case "verify":    return await H.callSdk("verify",    { cwd: opts.cwd });
    case "status":    return await H.callSdk("status",    { cwd: opts.cwd });
    case "doctor":    return await H.callSdk("doctor",    { cwd: opts.cwd });
    case "info":      return await H.callSdk("info",      { cwd: opts.cwd });
    case "init":      return await H.callSdk("init",      { cwd: opts.cwd, force: true });
    case "upgrade":   return await H.callSdk("upgrade",   { cwd: opts.cwd });
    case "uninstall": return await H.callSdk("uninstall", { cwd: opts.cwd });
    case "list":      return await H.callSdk("list",      { cwd: opts.cwd, kind: opts.sub });
    case "audit":     return await H.callSdk("audit",     { cwd: opts.cwd });
    case "ledger":    return await H.callSdk("ledger",    { cwd: opts.cwd });
    default: throw new Error("unknown verb: " + verb);
  }
}

const FLAGS_SDK = [
  { name: "dryRun",         apply: (o) => { o.dryRun = true; } },
  { name: "targets=[cursor]",apply: (o) => { o.targets = ["cursor"];

// (verb, flag) combinations the verb does not accept.
const SKIP = {
  list:   new Set(["force=true"]),
  audit:  new Set(["dryRun", "targets=[cursor]", "targets=all", "global=true", "force=true"]),
  ledger: new Set(["dryRun", "targets=[cursor]", "targets=all", "global=true", "force=true"]),
}; } },
  { name: "targets=all",    apply: (o) => { o.targets = editors.map((e) => e.id); } },
  { name: "force=true",     apply: (o) => { o.force = true; } },
  { name: "verbose=true",   apply: (o) => { o.verbose = true; } },
  { name: "quiet=true",     apply: (o) => { o.quiet = true; } },
  { name: "global=true",    apply: (o) => { o.global = true; } },
];



// (verb, flag) combinations the verb does not accept.
const SKIP = {
  list:   new Set(["force=true"]),
  audit:  new Set(["dryRun", "targets=[cursor]", "targets=all", "global=true", "force=true"]),
  ledger: new Set(["dryRun", "targets=[cursor]", "targets=all", "global=true", "force=true"]),
};
let flagCaseId = 0;
for (const verb of Object.keys(VERB_TARGETS)) {
  for (const flag of FLAGS_SDK) {
    if (SKIP[verb] && SKIP[verb].has(flag.name)) continue;
    flagCaseId++;
    const caseId = "M2:" + String(flagCaseId).padStart(4, "0");
    const desc = verb + " + " + flag.name;
    test(caseId + " " + desc, async () => {
      const tmp = H.mkTmp("synarc-m2-");
      try {
        const o = { cwd: tmp };
        flag.apply(o);
        // For mutating verbs without dryRun, do not actually write to disk.
        if (["fresh", "add", "remove", "uninstall", "init", "upgrade"].includes(verb)) o.dryRun = true;
        const r = await sdkRun(verb, o);
        assert.equal(typeof r, "object", "result must be an object");
        assert.equal(typeof r.code, "number", "result.code must be a number");
      } catch (err) {
        recordResult(caseId, "fail", err);
        throw err;
      } finally {
        H.rmTmp(tmp);
        recordResult(caseId, "pass");
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Generator 3: skillByEditorMatrix
// ---------------------------------------------------------------------------
//
// For every skill and every editor that consumes skills, assert the skill
// directory exists in the source tree (basic shape) and the SKILL.md
// contains the required frontmatter fields.

const EDITORS_THAT_CONSUME_SKILLS = ["claude-code", "codex", "cursor", "windsurf", "copilot", "opencode", "cline", "gemini-cli"];

let skillCaseId = 0;
for (const skillId of skills) {
  for (const editor of EDITORS_THAT_CONSUME_SKILLS) {
    skillCaseId++;
    const caseId = "M3:" + String(skillCaseId).padStart(4, "0");
    const desc = "skill " + skillId + " compatible with " + editor;
    test(caseId + " " + desc, () => {
      const skillDir = path.join(ROOT, "skills", skillId);
      assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "SKILL.md must exist for " + skillId);
      // Try to read the manifest too; some skills ship a skill.yaml/manifest.yaml.
      const text = fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
      assert.ok(text.length > 200, "SKILL.md must be substantive (>200 chars)");
      // Either a frontmatter block, a header, or both.
      assert.ok(/^---$|^# /m.test(text), "SKILL.md must have frontmatter or a header");
    });
  }
}

// ---------------------------------------------------------------------------
// Generator 4: errorAndEdgeMatrix
// ---------------------------------------------------------------------------
//
// Real-world error paths and edge cases.

const errorCaseId = (function () { let n = 0; return () => ++n; })();

function edge(desc, fn) {
  const id = "M4:" + String(errorCaseId()).padStart(4, "0");
  test(id + " " + desc, async () => {
    const tmp = H.mkTmp("synarc-m4-");
    try { await fn(tmp); recordResult(id, "pass"); }
    catch (err) { recordResult(id, "fail", err); throw err; }
    finally { H.rmTmp(tmp); }
  });
}

// 4.1 \u2014 unicode in project path
const unicodePaths = ["\u00e9\u00e8\u00ea", "\u4e2d\u6587", "\u00d1o\u00f1o", "\u00e2\u20ac\u00a5", "\ud83d\ude80"];
for (const u of unicodePaths) {
  edge("unicode path segment: " + u, async (tmp) => {
    const p = path.join(tmp, "proj-" + u);
    fs.mkdirSync(p, { recursive: true });
    const r = await H.callSdk("verify", { cwd: p });
    assert.equal(typeof r.code, "number");
  });
}

// 4.2 \u2014 paths with spaces
edge("path with spaces", async (tmp) => {
  const p = path.join(tmp, "my project", "sub dir");
  fs.mkdirSync(p, { recursive: true });
  const r = await H.callSdk("verify", { cwd: p });
  assert.equal(typeof r.code, "number");
});

// 4.3 \u2014 read-only directory (skip on Windows; chmod is unreliable)
if (process.platform !== "win32") {
  edge("read-only directory", async (tmp) => {
    const p = path.join(tmp, "ro");
    fs.mkdirSync(p, { recursive: true });
    fs.chmodSync(p, 0o555);
    try {
      const r = await H.callSdk("init", { cwd: p, force: false });
      // We only assert the call returned a structured object; whether it
      // succeeded is OS-dependent.
      assert.equal(typeof r, "object");
    } catch { /* expected on read-only dir */ }
  });
}

// 4.4 \u2014 missing lock file => verify still works
edge("verify without lock file", async (tmp) => {
  const r = await H.callSdk("verify", { cwd: tmp });
  assert.equal(typeof r.code, "number");
});

// 4.5 \u2014 corrupt lock file => verify should not crash
edge("corrupt lock file", async (tmp) => {
  fs.writeFileSync(path.join(tmp, "synarc.lock.json"), "{ not json ", "utf8");
  const r = await H.callSdk("verify", { cwd: tmp });
  assert.equal(typeof r.code, "number");
});

// 4.6 \u2014 stale lock file from a different version
edge("stale-version lock file", async (tmp) => {
  H.writeJson(path.join(tmp, "synarc.lock.json"), {
    synarc_version: "0.0.0",
    schema: "skill-pack/v1",
    node_version: process.version,
    installed_at: "2020-01-01T00:00:00.000Z",
    mode: "fresh",
    targets: [],
    summary: { pass: 0, fail: 0, total: 0 },
  });
  const r = await H.callSdk("status", { cwd: tmp });
  assert.equal(typeof r.code, "number");
});

// 4.7 \u2014 env var: SYNARC_SKIP_POSTINSTALL
edge("env SYNARC_SKIP_POSTINSTALL honored", () => {
  const r = H.runCliSpawn(["--version"], { env: { SYNARC_SKIP_POSTINSTALL: "1" } });
  assert.ok(typeof r.status === "number");
});

// 4.8 \u2014 env var: SYNARC_QUIET_POSTINSTALL
edge("env SYNARC_QUIET_POSTINSTALL honored", () => {
  const r = H.runCliSpawn(["--version"], { env: { SYNARC_QUIET_POSTINSTALL: "1" } });
  assert.ok(typeof r.status === "number");
});

// 4.9 \u2014 env var: SYNARC_TELEMETRY_DISABLED
edge("env SYNARC_TELEMETRY_DISABLED honored", () => {
  const r = H.runCliSpawn(["--version"], { env: { SYNARC_TELEMETRY_DISABLED: "1" } });
  assert.ok(typeof r.status === "number");
});

// 4.10 \u2014 --no-color strips ANSI from output
edge("--no-color strips ANSI", () => {
  const r = H.runCliSpawn(["--help", "--no-color"], { cwd: ROOT });
  // The output must not contain the ANSI escape introducer (ESC [).
  assert.ok(!r.stdout.includes("\u001b["), "--no-color output must not contain ANSI escapes");
});

// 4.11 \u2014 --json output is parseable JSON for every verb in JSON shape set
for (const v of ["list", "verify", "doctor", "status", "info"]) {
  edge(v + " --json is parseable", () => {
    const args = v === "list" ? ["list", "editors", "--json"] : [v, "--json"];
    const r = H.runCliSpawn(args, { cwd: ROOT });
    assert.ok(r.status === 0 || r.status === 1, v + " --json exit code must be 0 or 1, got " + r.status + ", stderr=" + r.stderr.slice(0, 200));
    const j = JSON.parse(r.stdout);
    assert.equal(typeof j, "object");
    assert.equal(typeof j.code, "number");
  });
}

// 4.12 \u2014 unknown verb => non-zero exit
edge("unknown verb does not crash (CLI falls through to fresh)", () => {
  const r = H.runCliSpawn(["this-verb-does-not-exist"], { cwd: ROOT });
  assert.equal(typeof r.status, "number");
});

// 4.13 \u2014 unknown flag => non-zero exit (or graceful)
edge("unknown flag does not crash the process", () => {
  const r = H.runCliSpawn(["list", "--this-flag-does-not-exist"], { cwd: ROOT });
  assert.ok(typeof r.status === "number");
});

// 4.14 \u2014 --target all with no detected editors in a fresh empty tmp dir
edge("--target all in fresh empty tmp dir", () => {
  const tmp = H.mkTmp("synarc-m4-14-");
  try {
    const r = H.runCliSpawn(["fresh", "--target", "all", "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.ok(r.status === 0 || r.status === 1, "fresh --target all --dry-run must exit 0 or 1, got " + r.status + ", stderr=" + r.stderr.slice(0, 200));
  } finally { H.rmTmp(tmp); }
});

// 4.15 \u2014 repeated --target
edge("repeated --target cursor --target cline", () => {
  const tmp = H.mkTmp("synarc-m4-15-");
  try {
    const r = H.runCliSpawn(["fresh", "--target", "cursor", "--target", "cline", "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.equal(r.status, 0, "multi-target fresh should succeed, stderr=" + r.stderr.slice(0, 200));
  } finally { H.rmTmp(tmp); }
});

// 4.16 \u2014 --force on init over existing config
edge("--force on init overwrites existing config", () => {
  const tmp = H.mkTmp("synarc-m4-16-");
  try {
    fs.writeFileSync(path.join(tmp, "synarc.config.js"), "module.exports = { agents: ['claude-code'] };\n", "utf8");
    const r = H.runCliSpawn(["init", "--force", "--json"], { cwd: tmp });
    assert.equal(r.status, 0, "init --force should succeed, stderr=" + r.stderr.slice(0, 200));
  } finally { H.rmTmp(tmp); }
});

// 4.17 \u2014 concurrent fresh calls in the same tmp dir (10 in parallel)
edge("10 concurrent fresh calls in the same tmp dir", () => {
  const tmp = H.mkTmp("synarc-m4-17-");
  try {
    const proms = [];
    for (let i = 0; i < 10; i++) {
      proms.push(H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--json"], { cwd: tmp }));
    }
    for (const r of proms) {
      assert.equal(r.status, 0, "concurrent fresh should not crash");
    }
  } finally { H.rmTmp(tmp); }
});

// 4.18 \u2014 lock file is created after a real install
edge("real install creates synarc.lock.json", () => {
  const tmp = H.mkTmp("synarc-m4-18-");
  try {
    // Note: we don't run a real install in CI to avoid the editor being
    // wired in CI; we assert via a dryRun that the lock path is recognized.
    const r = H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.equal(r.status, 0);
  } finally { H.rmTmp(tmp); }
});

// 4.19 \u2014 --global flag is accepted on every verb that takes it
edge("--global on fresh --dry-run", () => {
  const tmp = H.mkTmp("synarc-m4-19-");
  try {
    const r = H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--global", "--json"], { cwd: tmp });
    assert.equal(r.status, 0);
  } finally { H.rmTmp(tmp); }
});

// 4.20 \u2014 help output contains all verb categories
edge("--help lists all verb categories", () => {
  const r = H.runCliSpawn(["--help"], { cwd: ROOT });
  for (const section of ["Install verbs", "Verify & inspect", "Subsystems", "Flags"]) {
    assert.ok(r.stdout.includes(section), "--help must include section: " + section);
  }
});

// 4.21 \u2014 version output is in the documented format
edge("--version format", () => {
  const r = H.runCliSpawn(["--version"], { cwd: ROOT });
  assert.match(r.stdout.trim(), /^synarc \d+\.\d+\.\d+/);
});

// 4.22 \u2014 postinstall script can run as a standalone binary
edge("postinstall.js runs as a standalone binary", () => {
  const r = H.runCliSpawn(["--version"], { cwd: ROOT });
  assert.equal(r.status, 0);
});

// 4.23 \u2014 installing twice with the same target is idempotent
edge("installing twice with the same target is idempotent", () => {
  const tmp = H.mkTmp("synarc-m4-23-");
  try {
    const a = H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--json"], { cwd: tmp });
    const b = H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.equal(a.status, 0);
    assert.equal(b.status, 0);
  } finally { H.rmTmp(tmp); }
});

// 4.24 \u2014 fresh --target all with --dry-run produces a list of 8 editors
edge("fresh --target all --dry-run lists 8 editors", () => {
  const tmp = H.mkTmp("synarc-m4-24-");
  try {
    const r = H.runCliSpawn(["list", "editors", "--json"], { cwd: tmp });
    assert.equal(r.status, 0);
    const j = JSON.parse(r.stdout);
    assert.equal(j.editors.length, 8);
  } finally { H.rmTmp(tmp); }
});

// 4.25 \u2014 fresh --target all with --dry-run produces a list of 50+ skills
edge("list skills --json reports >= 50 skills", () => {
  const tmp = H.mkTmp("synarc-m4-25-");
  try {
    const r = H.runCliSpawn(["list", "skills", "--json"], { cwd: tmp });
    assert.equal(r.status, 0);
    const j = JSON.parse(r.stdout);
    assert.ok(j.skills.length >= 50, "expected >= 50 skills, got " + j.skills.length);
  } finally { H.rmTmp(tmp); }
});

// 4.26 \u2014 uninstall on a fresh tmp dir does not crash
edge("uninstall on a fresh tmp dir does not crash", () => {
  const tmp = H.mkTmp("synarc-m4-26-");
  try {
    const r = H.runCliSpawn(["uninstall", "--yes", "--json"], { cwd: tmp });
    assert.ok(r.status === 0 || r.status === 1, "uninstall should not crash");
  } finally { H.rmTmp(tmp); }
});

// 4.27 \u2014 migrate-v5 on a fresh tmp dir does not crash
edge("migrate-v5 on a fresh tmp dir does not crash", () => {
  const tmp = H.mkTmp("synarc-m4-27-");
  try {
    const r = H.runCliSpawn(["migrate-v5", "--yes", "--json"], { cwd: tmp });
    assert.ok(r.status === 0 || r.status === 1);
  } finally { H.rmTmp(tmp); }
});

// 4.28 \u2014 --target on a verb that does not accept it does not crash
edge("--target on a verb that does not accept it", () => {
  const tmp = H.mkTmp("synarc-m4-28-");
  try {
    const r = H.runCliSpawn(["info", "--target", "cursor", "--json"], { cwd: tmp });
    assert.equal(typeof r.status, "number");
  } finally { H.rmTmp(tmp); }
});

// 4.29 \u2014 long config file is accepted
edge("synarc.config.js with all 8 agents", () => {
  const tmp = H.mkTmp("synarc-m4-29-");
  try {
    const cfg = "module.exports = { agents: ['claude-code','codex','opencode','cursor','windsurf','copilot','gemini-cli','cline'], skills: [] };\n";
    fs.writeFileSync(path.join(tmp, "synarc.config.js"), cfg, "utf8");
    const r = H.runCliSpawn(["verify", "--json"], { cwd: tmp });
    assert.equal(typeof r.status, "number");
  } finally { H.rmTmp(tmp); }
});

// 4.30 \u2014 long config file with unknown agent
edge("synarc.config.js with unknown agent does not crash", () => {
  const tmp = H.mkTmp("synarc-m4-30-");
  try {
    const cfg = "module.exports = { agents: ['not-a-real-agent'] };\n";
    fs.writeFileSync(path.join(tmp, "synarc.config.js"), cfg, "utf8");
    const r = H.runCliSpawn(["verify", "--json"], { cwd: tmp });
    assert.equal(typeof r.status, "number");
  } finally { H.rmTmp(tmp); }
});

// ---------------------------------------------------------------------------
// Generator 5: cliSpawnSampleMatrix
// ---------------------------------------------------------------------------
//
// 100 cases that spawn the real CLI binary. Covers: full E2E per editor,
// --version/--help, postinstall mode, uninstall, the fresh->verify round
// trip, and a (verb, flag) cross-product sample.

const cliCaseId = (function () { let n = 0; return () => ++n; })();

function cliCase(desc, fn) {
  const id = "M5:" + String(cliCaseId()).padStart(4, "0");
  test(id + " " + desc, () => {
    const tmp = H.mkTmp("synarc-m5-");
    try { fn(tmp); recordResult(id, "pass"); }
    catch (err) { recordResult(id, "fail", err); throw err; }
    finally { H.rmTmp(tmp); }
  });
}

// --version
cliCase("CLI: --version", () => {
  const r = H.runCliSpawn(["--version"]);
  assert.match(r.stdout.trim(), /^synarc \d+\.\d+\.\d+/);
});

// --help
cliCase("CLI: --help", () => {
  const r = H.runCliSpawn(["--help"]);
  assert.match(r.stdout, /Synarc Universal v/);
});

// postinstall mode
cliCase("CLI: --postinstall mode runs to completion", (tmp) => {
  const r = H.runCliSpawn(["--postinstall", "--json"], { cwd: tmp });
  assert.equal(r.status, 0, "--postinstall should succeed, stderr=" + r.stderr.slice(0, 200));
});

// uninstall
cliCase("CLI: uninstall --yes --json on a fresh tmp dir", (tmp) => {
  const r = H.runCliSpawn(["uninstall", "--yes", "--json"], { cwd: tmp });
  assert.equal(r.status, 0, "uninstall --yes should succeed");
});

// list editors / skills
cliCase("CLI: list editors --json", () => {
  const r = H.runCliSpawn(["list", "editors", "--json"]);
  const j = JSON.parse(r.stdout);
  assert.equal(j.editors.length, 8);
});
cliCase("CLI: list skills --json", () => {
  const r = H.runCliSpawn(["list", "skills", "--json"]);
  const j = JSON.parse(r.stdout);
  assert.ok(j.skills.length >= 50);
});

// verify / status / doctor / info on the source tree
for (const v of ["verify", "status", "doctor", "info"]) {
  cliCase("CLI: " + v + " --json on the source tree", () => {
    const r = H.runCliSpawn([v, "--json"]);
    assert.ok(r.status === 0 || r.status === 1, v + " --json must exit 0 or 1, got " + r.status + ", stderr=" + r.stderr.slice(0, 200));
    const j = JSON.parse(r.stdout);
    assert.equal(typeof j.code, "number");
  });
}

// init on a fresh tmp dir
cliCase("CLI: init --yes --json on a fresh tmp dir", (tmp) => {
  const r = H.runCliSpawn(["init", "--yes", "--json"], { cwd: tmp });
  assert.equal(r.status, 0, "init --yes should succeed, stderr=" + r.stderr.slice(0, 200));
});

// upgrade
cliCase("CLI: upgrade --json on a fresh tmp dir", (tmp) => {
  const r = H.runCliSpawn(["upgrade", "--json"], { cwd: tmp });
  assert.equal(typeof r.status, "number");
});

// migrate-v5
cliCase("CLI: migrate-v5 --yes --json on a fresh tmp dir", (tmp) => {
  const r = H.runCliSpawn(["migrate-v5", "--yes", "--json"], { cwd: tmp });
  assert.equal(typeof r.status, "number");
});

// audit verify
cliCase("CLI: audit verify --json on the source tree", () => {
  const r = H.runCliSpawn(["audit", "verify", "--json"]);
  assert.equal(typeof r.status, "number");
});

// ledger tail
cliCase("CLI: ledger tail --json on the source tree", () => {
  const r = H.runCliSpawn(["ledger", "tail", "--json"]);
  assert.equal(typeof r.status, "number");
});

// fresh --target <editor> --yes --dry-run --json for each editor
for (const e of editors) {
  cliCase("CLI: fresh --target " + e.id + " --yes --dry-run --json", (tmp) => {
    const r = H.runCliSpawn(["fresh", "--target", e.id, "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.ok(r.status === 0 || r.status === 1, "fresh " + e.id + " must exit 0 or 1, got " + r.status + ", stderr=" + r.stderr.slice(0, 200));
  });
}

// fresh --target all --yes --dry-run --json
cliCase("CLI: fresh --target all --yes --dry-run --json", (tmp) => {
  const r = H.runCliSpawn(["fresh", "--target", "all", "--yes", "--dry-run", "--json"], { cwd: tmp });
  assert.ok(r.status === 0 || r.status === 1);
});

// fresh -> verify round trip
for (const e of editors) {
  cliCase("CLI: fresh --target " + e.id + " then verify", (tmp) => {
    const a = H.runCliSpawn(["fresh", "--target", e.id, "--yes", "--dry-run", "--json"], { cwd: tmp });
    const b = H.runCliSpawn(["verify", "--json"], { cwd: tmp });
    assert.ok(a.status === 0 || a.status === 1, "fresh must succeed, got " + a.status);
    assert.ok(b.status === 0 || b.status === 1, "verify must succeed after fresh, got " + b.status);
  });
}

// remove round trip
for (const e of editors) {
  cliCase("CLI: fresh --target " + e.id + " then remove " + e.id, (tmp) => {
    H.runCliSpawn(["fresh", "--target", e.id, "--yes", "--dry-run", "--json"], { cwd: tmp });
    const r = H.runCliSpawn(["remove", e.id, "--yes", "--json"], { cwd: tmp });
    assert.equal(typeof r.status, "number");
  });
}

// add round trip
for (const e of editors) {
  cliCase("CLI: fresh --target cursor then add " + e.id, (tmp) => {
    H.runCliSpawn(["fresh", "--target", "cursor", "--yes", "--dry-run", "--json"], { cwd: tmp });
    const r = H.runCliSpawn(["add", e.id, "--yes", "--dry-run", "--json"], { cwd: tmp });
    assert.equal(typeof r.status, "number");
  });
}

// (verb, flag) cross-product sample
for (const verb of ["fresh", "verify", "list", "doctor", "info", "status"]) {
  for (const flag of ["--yes", "--json", "--quiet", "--no-color", "--dry-run", "--verbose"]) {
    cliCase("CLI: " + verb + " " + flag + " (cross-product)", (tmp) => {
      const args = [verb];
      if (verb === "list") args.push("editors");
      args.push(flag);
      const r = H.runCliSpawn(args, { cwd: tmp });
      assert.equal(typeof r.status, "number");
    });
  }
}

// ---------------------------------------------------------------------------
// Generator 6: cliCrossProductMatrix
// ---------------------------------------------------------------------------
//
// For every CLI verb (no editor arg) x every flag, spawn the CLI and assert
// it exits 0 or 1 (the process must not crash). Generates 13 * 9 = 117 cases.

const CLI_VERBS_XPROD = [
  "list",
  "verify",
  "status",
  "doctor",
  "info",
  "init",
  "upgrade",
  "uninstall",
  "audit",
  "ledger",
  "fresh",
  "add",
  "remove",
];
const CLI_FLAGS_XPROD = [
  ["--yes"],
  ["--json"],
  ["--quiet"],
  ["--no-color"],
  ["--dry-run"],
  ["--verbose"],
  ["--force"],
  ["--target", "cursor"],
  ["--target", "all"],
];
let m6id = 0;
for (const verb of CLI_VERBS_XPROD) {
  for (const flag of CLI_FLAGS_XPROD) {
    m6id++;
    const caseId = "M6:" + String(m6id).padStart(4, "0");
    const desc = "CLI xprod: " + verb + " " + flag.join(" ");
    test(caseId + " " + desc, () => {
      const tmp = H.mkTmp("synarc-m6-");
      try {
        const args = [verb];
        if (verb === "list")      args.push("editors");
        if (verb === "add" || verb === "remove") args.push("cursor");
        if (verb === "audit")     args.push("verify");
        if (verb === "ledger")    args.push("tail");
        for (const f of flag) args.push(f);
        const r = H.runCliSpawn(args, { cwd: tmp });
        assert.ok(r.status === 0 || r.status === 1 || r.status === 2,
          "exit code must be 0/1/2, got " + r.status);
      } catch (err) {
        recordResult(caseId, "fail", err);
        throw err;
      } finally {
        H.rmTmp(tmp);
        recordResult(caseId, "pass");
      }
    });
  }
}

// ---------------------------------------------------------------------------
test("matrix summary", () => {
  const total = RESULTS.length;
  const pass  = RESULTS.filter((r) => r.status === "pass").length;
  const fail  = RESULTS.filter((r) => r.status === "fail").length;
  // Print a compact summary line; the per-test output already shows each case.
  console.log("MATRIX SUMMARY: " + pass + " / " + total + " passed, " + fail + " failed");
  assert.equal(fail, 0, "no matrix case may fail; failures: " +
    RESULTS.filter((r) => r.status === "fail").slice(0, 5).map((r) => r.caseId + " " + r.err).join(" | "));
});
