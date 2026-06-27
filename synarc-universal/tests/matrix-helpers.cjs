/**
 * Synarc Universal \u2014 matrix test helpers
 *
 * Pure helpers, no side effects, no test-framework dependency.
 * Exported for use by tests/matrix.test.js and by future test files.
 *
 * Responsibilities:
 *   - Discover verbs, editors, flags from the actual source so the matrix
 *     stays in sync with the package surface.
 *   - Build the per-verb / per-editor / per-flag applicability tables.
 *   - Provide a tiny shape-assertion helper for the per-verb JSON output.
 *   - Provide SDK-direct invocation helpers that mirror install.js.
 */
"use strict";

const path = require("node:path");
const fs   = require("node:fs");

const ROOT = path.resolve(__dirname, "..");
const lib  = require(path.join(ROOT, "scripts", "lib"));
const commands = require(path.join(ROOT, "scripts", "lib", "commands"));

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

function discoverEditors() {
  // Source of truth: scripts/lib/editors.js exports the editor registry.
  return lib.list.editors().map((e) => ({
    id:    e.id,
    label: e.label,
  }));
}

function discoverVerbs() {
  // Source of truth: scripts/install.js. We pull the verb names from the
  // dispatch table rather than re-deriving them, so the matrix updates
  // automatically when install.js grows a verb.
  const src = fs.readFileSync(path.join(ROOT, "scripts", "install.js"), "utf8");
  const verbs = new Set();
  const re = /if \(verb === "([a-z0-9-]+)"\)/g;
  let m;
  while ((m = re.exec(src)) != null) verbs.add(m[1]);
  return [...verbs];
}

function discoverFlags() {
  // Source of truth: install.js. Every --long flag that is referenced in
  // argv.flags.<name> parsing.
  const src = fs.readFileSync(path.join(ROOT, "scripts", "install.js"), "utf8");
  const flags = new Set();
  const re = /--([a-z][a-z0-9-]+)/g;
  let m;
  while ((m = re.exec(src)) != null) flags.add(m[1]);
  return [...flags];
}

function discoverSkills() {
  // Source of truth: skills/<id>/ directories. Each one must have a SKILL.md.
  const skillsDir = path.join(ROOT, "skills");
  return fs.readdirSync(skillsDir)
    .filter((d) => fs.statSync(path.join(skillsDir, d)).isDirectory())
    .filter((d) => fs.existsSync(path.join(skillsDir, d, "SKILL.md")))
    .map((d) => d);
}

// ---------------------------------------------------------------------------
// Applicability tables
// ---------------------------------------------------------------------------

// Verbs that take a target list. Others either take a single argument, no
// arguments, or read from the environment.
const VERBS_WITH_TARGETS = new Set([
  "fresh", "add", "remove", "verify",
]);

// Verbs that mutate the project. "Read-only" verbs can be run on any tmp dir
// and will not leave artifacts that would interfere with the next case.
const VERBS_MUTATING = new Set([
  "fresh", "add", "remove", "uninstall", "init", "upgrade", "migrate-v5",
  "refresh", "auto",
]);

// Verbs whose --json output is guaranteed to be parseable JSON in a known
// shape. We assert shape for these to catch regressions.
const VERBS_WITH_JSON_SHAPE = new Set([
  "list", "verify", "doctor", "status", "info", "audit", "ledger",
]);

function applicableEditorsFor(verb) {
  // Most verbs accept any editor; some only make sense with editor-shaped
  // arguments.
  switch (verb) {
    case "list":       return [];                 // "list editors" / "list skills"
    case "audit":      return [];                 // "audit verify" / "audit export"
    case "ledger":     return [];                 // "ledger tail" / "ledger query" / "ledger show"
    case "global":     return [];                 // "global status"
    case "cache":      return [];                 // "cache status"
    case "skill":      return [];                 // "skill list" / "skill get" / "skill install" / "skill prefetch"
    case "init":       return [];                 // no editor argument
    case "info":       return [];                 // no editor argument
    case "status":     return [];                 // no editor argument
    case "doctor":     return [];                 // no editor argument
    case "upgrade":    return [];                 // no editor argument
    case "migrate-v5": return [];                 // no editor argument
    case "uninstall":  return [];                 // removes all
    case "verify":     return null;               // null = "any"
    case "refresh":    return null;
    case "auto":       return null;
    case "fresh":      return null;               // accepts --target / --target all / auto-detect
    case "add":        return null;
    case "remove":     return null;
    case "fresh-install": return null;
    case "fresh":      return null;
    default:           return [];
  }
}

// ---------------------------------------------------------------------------
// Shape assertions
// ---------------------------------------------------------------------------

function expectShape(obj, schema, label) {
  if (obj == null || typeof obj !== "object") {
    throw new Error(label + ": expected object, got " + typeof obj);
  }
  for (const [k, kind] of Object.entries(schema)) {
    const v = obj[k];
    if (v == null) throw new Error(label + ": missing key " + k);
    if (kind === "string" && typeof v !== "string") {
      throw new Error(label + ": key " + k + " expected string, got " + typeof v);
    }
    if (kind === "number" && typeof v !== "number") {
      throw new Error(label + ": key " + k + " expected number, got " + typeof v);
    }
    if (kind === "boolean" && typeof v !== "boolean") {
      throw new Error(label + ": key " + k + " expected boolean, got " + typeof v);
    }
    if (kind === "array" && !Array.isArray(v)) {
      throw new Error(label + ": key " + k + " expected array, got " + typeof v);
    }
    if (kind === "object" && (typeof v !== "object" || Array.isArray(v))) {
      throw new Error(label + ": key " + k + " expected object, got " + typeof v);
    }
  }
}

const VERB_SHAPES = {
  list:   { code: "number", editors: "array", skills: "array" },
  verify: { code: "number", results: "array" },
  doctor: { code: "number", checks: "array" },
  status: { code: "number" },
  info:   { code: "number" },
  audit:  { code: "number" },
  ledger: { code: "number" },
};

// ---------------------------------------------------------------------------
// SDK-direct invocation
// ---------------------------------------------------------------------------

/**
 * Invoke an SDK verb directly, mirroring the install.js dispatch.
 * Returns a normalized { code, ... } object.
 */
async function callSdk(verb, opts) {
  const cwd = opts.cwd;
  const targets = opts.targets;
  switch (verb) {
    case "fresh":      return await lib.install({ cwd, targets, dryRun: opts.dryRun, yes: true, json: true });
    case "refresh":    return await lib.refresh({ cwd, targets, dryRun: true, yes: true, json: true });
    case "auto":       return await lib.auto({ cwd, message: "matrix auto test", dryRun: true, yes: true, json: true });
    case "add":        return await lib.add(targets, { cwd, yes: true, json: true });
    case "remove":     return await lib.remove(targets, { cwd, yes: true, json: true });
    case "uninstall":  return await lib.uninstall({ cwd, yes: true, json: true });
    case "verify":     return await lib.verify({ cwd, targets, json: true });
    case "status":     return await lib.status({ cwd, json: true });
    case "doctor":     return await lib.doctor({ cwd, json: true });
    case "info":       return await lib.info({ cwd, json: true });
    case "init":       return await lib.init({ cwd, yes: true, force: !!opts.force, json: true });
    case "upgrade":    return await lib.upgrade({ cwd, yes: true, json: true });
    case "migrate-v5": return await lib.migrateV5({ cwd, yes: true, json: true });
    case "list":       return await commands.list(cwd, { json: true }, opts.kind || "editors");
    case "audit":
      return await lib.audit.verify({ cwd, json: true });
    case "ledger":
      return await lib.ledger.tail({ cwd, json: true });
    default:
      throw new Error("callSdk: unknown verb: " + verb);
  }
}

// ---------------------------------------------------------------------------
// CLI-spawn invocation
// ---------------------------------------------------------------------------

function runCliSpawn(args, opts = {}) {
  const cli = path.join(ROOT, "scripts", "install.js");
  const { spawnSync } = require("node:child_process");
  const r = spawnSync("node", [cli, ...args], {
    cwd: opts.cwd || ROOT,
    env: { ...process.env, NO_COLOR: "1", ...(opts.env || {}) },
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
    
  });
  return {
    status: r.status,
    stdout: r.stdout || "",
    stderr: r.stderr || "",
  };
}

// ---------------------------------------------------------------------------
// Tmp helpers
// ---------------------------------------------------------------------------

function mkTmp(prefix) {
  return fs.mkdtempSync(path.join(require("node:os").tmpdir(), prefix || "synarc-matrix-"));
}

function rmTmp(p) {
  try { fs.rmSync(p, { recursive: true, force: true }); } catch { /* */ }
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

module.exports = {
  ROOT,
  // Discovery
  discoverEditors,
  discoverVerbs,
  discoverFlags,
  discoverSkills,
  // Tables
  VERBS_WITH_TARGETS,
  VERBS_MUTATING,
  VERBS_WITH_JSON_SHAPE,
  VERB_SHAPES,
  applicableEditorsFor,
  // Assertions
  expectShape,
  // Invocation
  callSdk,
  runCliSpawn,
  // Tmp
  mkTmp,
  rmTmp,
  writeJson,
  readJson,
};
