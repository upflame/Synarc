"use strict";
/**
 * Synarc Universal — smoke test
 * Validates the CLI surface, the programmatic API, and the editor registry.
 * Uses node:test (no external dependencies).
 */

const test   = require("node:test");
const assert = require("node:assert/strict");
const fs     = require("node:fs");
const path   = require("node:path");
const os     = require("node:os");
const { spawnSync } = require("node:child_process");

const ROOT      = path.resolve(__dirname, "..");
const lib       = require(path.join(ROOT, "scripts", "lib"));
const cli       = path.join(ROOT, "scripts", "install.js");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runCli(args, opts = {}) {
  const { spawnSync } = require("node:child_process");
  // Allow non-zero exits so we can inspect JSON output (e.g., doctor in source tree)
  const r = spawnSync("node", [cli, ...args], {
    cwd: opts.cwd || ROOT,
    env: { ...process.env, NO_COLOR: "1", ...(opts.env || {}) },
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return r.stdout || "";
}

function mkTmp(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix || "synarc-test-"));
}

function rmTmp(p) {
  try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* */ }
}

// ---------------------------------------------------------------------------
// Sanity: package layout
// ---------------------------------------------------------------------------

test("package.json exists and is valid", () => {
  const pkg = require(path.join(ROOT, "package.json"));
  assert.equal(pkg.name, "synarc");
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.bin.synarc, "scripts/install.js");
  assert.equal(pkg.bin["synarc-universal"], "scripts/install.js");
  assert.equal(pkg.type, "commonjs");
  assert.deepEqual(pkg.exports["."].require, "./scripts/lib/index.js");
  assert.equal(pkg.engines.node, ">=18.0.0");
});

test("required directories exist", () => {
  for (const d of ["skills", "shared", "scripts", "docs", "security"]) {
    assert.ok(fs.existsSync(path.join(ROOT, d)), `missing: ${d}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(ROOT, "manifest.yaml")));
});

test("skills/ contains 50+ skill directories", () => {
  const skills = fs.readdirSync(path.join(ROOT, "skills"))
    .filter(d => fs.statSync(path.join(ROOT, "skills", d)).isDirectory());
  assert.ok(skills.length >= 50, `expected >= 50 skills, got ${skills.length}`);
});

// ---------------------------------------------------------------------------
// Package layout (regression guard for 6.6.1 -> 6.6.4 postinstall bug)
// ---------------------------------------------------------------------------

test("every path referenced by package.json scripts.* exists in the source tree", () => {
  const pkg = require(path.join(ROOT, "package.json"));
  const scripts = pkg.scripts || {};
  for (const [name, cmd] of Object.entries(scripts)) {
    const m = /^\s*node\s+([^\s|;&]+)/.exec(cmd || "");
    if (!m) continue;
    const rel = m[1].replace(/^\.\//, "");
    // Skip non-path tokens: node flags (-x, --x), positional arg lists, or strings that don't look like a project-relative JS path.
    if (rel.startsWith("-")) continue;
    if (!/\.(js|cjs|mjs)$/.test(rel)) continue;
    const abs = path.join(ROOT, rel);
    assert.ok(fs.existsSync(abs), `scripts.${name} references missing file: ${rel}`);
  }
});

test("scripts/postinstall.js is whitelisted in package.json and not in .npmignore", () => {
  const pkg = require(path.join(ROOT, "package.json"));
  assert.ok(
    Array.isArray(pkg.files) && pkg.files.includes("scripts/postinstall.js"),
    "scripts/postinstall.js must be in package.json files whitelist (regression: 6.6.1 omitted it)"
  );
  if (fs.existsSync(path.join(ROOT, ".npmignore"))) {
    const npmignore = fs.readFileSync(path.join(ROOT, ".npmignore"), "utf8");
    const lines = npmignore.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    assert.ok(
      !lines.includes("scripts/postinstall.js"),
      "scripts/postinstall.js must not be listed in .npmignore"
    );
  }
});

test("every file in package.json files whitelist exists in the source tree", () => {
  const pkg = require(path.join(ROOT, "package.json"));
  const whitelist = pkg.files || [];
  assert.ok(Array.isArray(whitelist) && whitelist.length > 0, "package.json must have a non-empty files whitelist");
  for (const rel of whitelist) {
    // Skip negation patterns (e.g., "!docs/README.md")
    if (rel.startsWith("!")) continue;
    // Skip patterns ending with / (directory references)
    if (rel.endsWith("/")) {
      const abs = path.join(ROOT, rel);
      assert.ok(fs.existsSync(abs), `files whitelist references missing directory: ${rel}`);
      continue;
    }
    const abs = path.join(ROOT, rel);
    assert.ok(fs.existsSync(abs), `files whitelist references missing file: ${rel}`);
  }
  // Specifically check that scripts referenced by package.json scripts exist
  // (regression guard for 6.6.1 where scripts/postinstall.js was missing from the whitelist)
  assert.ok(
    whitelist.includes("scripts/install.js"),
    "scripts/install.js must be in package.json files whitelist"
  );
  assert.ok(
    whitelist.includes("scripts/postinstall.js"),
    "scripts/postinstall.js must be in package.json files whitelist (regression: 6.6.1 omitted it)"
  );
});

// ---------------------------------------------------------------------------
// Programmatic API
// ---------------------------------------------------------------------------

test("lib exports the full surface", () => {
  for (const fn of ["install", "verify", "detect", "doctor", "status", "add", "remove", "migrateV5"]) {
    assert.equal(typeof lib[fn], "function", `lib.${fn} should be a function`);
  }
  assert.ok(["object","function"].includes(typeof lib.list), "lib.list should be object or function");
  assert.equal(typeof lib.list.editors, "function");
  assert.equal(typeof lib.list.skills,  "function");
  assert.equal(lib.PACK_VERSION, "6.6.4");
});

test("list.editors returns 8 editors", () => {
  const editors = lib.list.editors();
  assert.equal(editors.length, 8);
  const ids = editors.map(e => e.id);
  for (const required of ["claude-code", "codex", "opencode", "cursor", "windsurf", "copilot", "gemini-cli", "cline"]) {
    assert.ok(ids.includes(required), `missing editor: ${required}`);
  }
});

test("list.skills returns >= 50 skills", () => {
  const skills = lib.list.skills();
  assert.ok(skills.length >= 50, `expected >= 50 skills, got ${skills.length}`);
  for (const s of skills.slice(0, 5)) {
    assert.ok(s.id,         "skill must have id");
    assert.ok(s.description, "skill must have description");
  }
});

test("detect returns an array of detected editor ids", async () => {
  const detected = await lib.detect(ROOT);
  assert.ok(Array.isArray(detected));
  assert.ok(detected.includes("codex"));
});

test("verify on the synarc-universal dir returns a result for each detected editor", async () => {
  // The source dir itself has editor markers (.claude-plugin/, .github/, AGENTS.md, etc.)
  // that are *source content* not install output, so we cannot assert that every detected
  // editor passes verify. Instead we assert: (a) the call succeeds, (b) at least one editor
  // is detected, (c) every result is a well-formed object. End-to-end PASS coverage lives in
  // the E2E tests below which run in a clean tmp dir.
  const r = await lib.verify({ cwd: ROOT });
  assert.ok(r);
  assert.ok(Array.isArray(r.results));
  assert.ok(r.results.length >= 1, "expected at least one detected editor");
  for (const res of r.results) {
    assert.equal(typeof res.id, "string");
    assert.equal(typeof res.ok, "boolean");
    assert.equal(typeof res.label, "string");
  }
});

test("doctor reports node + git + integrity", async () => {
  const r = await lib.doctor({ cwd: ROOT });
  // Source-tree runs may not have a lock file; only assert the checks that matter for the source.
  const failing = r.checks.filter(c => !c.ok && c.name !== "lock-file");
  assert.equal(failing.length, 0, "unexpected doctor failures: " + JSON.stringify(failing));
  const names = r.checks.map(c => c.name);
  for (const required of ["node-version", "git-available", "pack-readable", "pack-integrity"]) {
    assert.ok(names.includes(required), `doctor missing: ${required}`);
  }
});

// ---------------------------------------------------------------------------
// CLI: every verb works
// ---------------------------------------------------------------------------

test("CLI: --version", () => {
  const out = runCli(["--version"]);
  assert.match(out, /^synarc \d+\.\d+\.\d+/);
});

test("CLI: --help", () => {
  const out = runCli(["--help"]);
  assert.match(out, /Synarc Universal v/);
  assert.match(out, /Getting started:/);
  assert.match(out, /Install verbs:/);
  assert.match(out, /Verify & inspect:/);
  assert.match(out, /Subsystems:/);
  assert.match(out, /Flags:/);
});

test("CLI: list editors --json", () => {
  const out = runCli(["list", "editors", "--json"]);
  const j = JSON.parse(out);
  assert.equal(j.code, 0);
  assert.equal(j.editors.length, 8);
});

test("CLI: list skills --json", () => {
  const out = runCli(["list", "skills", "--json"]);
  const j = JSON.parse(out);
  assert.equal(j.code, 0);
  assert.ok(j.skills.length >= 50);
});

test("CLI: verify --json (no lock file = uses auto-detect)", () => {
  const out = runCli(["verify", "--json"]);
  const j = JSON.parse(out);
  assert.equal(typeof j.code, "number");
  assert.ok(Array.isArray(j.results));
});

test("CLI: doctor --json", () => {
  const out = runCli(["doctor", "--json"]);
  const j = JSON.parse(out);
  assert.equal(typeof j.code, "number");
  assert.ok(Array.isArray(j.checks));
  // Source-tree runs may not have a lock file; only the lock-file check is allowed to fail
  const failing = j.checks.filter(c => !c.ok && c.name !== "lock-file");
  assert.equal(failing.length, 0, "unexpected doctor failures: " + JSON.stringify(failing));
});

test("CLI: status --json", () => {
  const out = runCli(["status", "--json"]);
  const j = JSON.parse(out);
  assert.equal(j.code, 0);
});

test("CLI: fresh --target all --yes --dry-run --json", () => {
  const out = runCli(["fresh", "--target", "all", "--yes", "--dry-run", "--json"]);
  const j = JSON.parse(out);
  assert.equal(j.code, 0);
  assert.equal(j.results.length, 8);
});

// ---------------------------------------------------------------------------
// End-to-end: fresh + verify in a tmp dir
// ---------------------------------------------------------------------------

test("E2E: fresh --target cursor in a tmp dir writes the file and passes verify", () => {
  const tmp = mkTmp("synarc-e2e-");
  try {
    runCli(["fresh", "--target", "cursor", "--yes"], { cwd: tmp });
    const target = path.join(tmp, ".cursor", "rules", "synarc-core.mdc");
    assert.ok(fs.existsSync(target), "cursor rule file should exist after fresh");
    const r = runCli(["verify", "--target", "cursor", "--json"], { cwd: tmp });
    const j = JSON.parse(r);
    assert.equal(j.code, 0);
    assert.ok(j.results[0].ok);
  } finally {
    rmTmp(tmp);
  }
});

test("E2E: fresh --target cline copies the skills", () => {
  const tmp = mkTmp("synarc-e2e-cline-");
  try {
    runCli(["fresh", "--target", "cline", "--yes"], { cwd: tmp });
    const skillsDir = path.join(tmp, ".cline", "skills");
    assert.ok(fs.existsSync(skillsDir), "cline skills dir should exist");
    const skills = fs.readdirSync(skillsDir);
    assert.ok(skills.length >= 50, `expected >= 50 cline skills, got ${skills.length}`);
  } finally {
    rmTmp(tmp);
  }
});

test("E2E: remove deletes the cursor file", () => {
  const tmp = mkTmp("synarc-e2e-rm-");
  try {
    runCli(["fresh", "--target", "cursor", "--yes"], { cwd: tmp });
    const target = path.join(tmp, ".cursor", "rules", "synarc-core.mdc");
    assert.ok(fs.existsSync(target));
    runCli(["remove", "cursor"], { cwd: tmp });
    assert.ok(!fs.existsSync(target), "cursor file should be removed");
  } finally {
    rmTmp(tmp);
  }
});
