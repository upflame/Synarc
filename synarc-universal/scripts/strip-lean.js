#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal - lean strip
 * Prepares the source tree for `npm publish` by moving non-shipped
 * directories to a sibling `.stripped/` location.  Result: a publishable
 * tree that matches the `files` whitelist in package.json.
 *
 * Shipped (kept in place):
 *   - scripts/install.js, scripts/lib/, scripts/clean.js, scripts/format-skills.js
 *   - skills/_index.json, skills/synarc-core/   (only synarc-core in tarball)
 *   - shared/runtime-adapters/, shared/schemas/, shared/guardrails/
 *   - .claude-plugin/, .cursor/rules/synarc-core.mdc, AGENTS.md, GEMINI.md
 *   - manifest.yaml, package.json, README.md, CHANGELOG.md, LICENSE, SECURITY.md
 *
 * Stripped (moved to .stripped/):
 *   - skills/<id>/ for every id except `synarc-core`
 *   - skills/synarc-core/expanded/, skills/synarc-core/references/
 *   - shared/standards/, shared/workflows/, shared/checklists/, shared/prompts/
 *   - shared/security/, shared/templates/  (not in the lean tarball)
 *   - docs/ (full documentation tree, not shipped)
 *   - tests/, .github/, .claude-plugin/.github/, .claude-plugin/agents/
 *   - scripts/check-*.ps1, scripts/sync-v6.ps1, scripts/test-fallbacks.ps1,
 *     scripts/measure-skills.ps1, scripts/validate-skills.ps1, scripts/install.ps1
 *   - .vscode/, .idea/, *.swp, *.bak
 *
 * Idempotent: re-running is a no-op.  Reversible: `node scripts/restore-lean.js`.
 *
 * Usage:
 *   node scripts/strip-lean.js [--dry-run] [--yes]
 *
 * Flags:
 *   --dry-run    Print what would be moved, but do nothing.
 *   --yes        Skip the confirmation prompt.
 */

const fs   = require("node:fs");
const path = require("node:path");

const ROOT          = path.resolve(__dirname, "..");
const STRIPPED_DIR  = path.join(ROOT, ".stripped");

const ARGV = process.argv.slice(2);
const FLAGS = { dryRun: false, yes: false, help: false };
for (const a of ARGV) {
  if (a === "--dry-run" || a === "-n") FLAGS.dryRun = true;
  else if (a === "--yes" || a === "-y") FLAGS.yes = true;
  else if (a === "--help" || a === "-h") FLAGS.help = true;
}

if (FLAGS.help) {
  console.log("Usage: node scripts/strip-lean.js [--dry-run] [--yes]");
  process.exit(0);
}

const SKIP = new Set([".git", "node_modules", ".cache", "package-lock.json", ".stripped"]);
const KEEP_SKILLS = new Set(["synarc-core", "_index.json"]);

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function bytes(p) { try { return fs.statSync(p).size; } catch { return 0; } }
function fmtBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " kB";
  return (n / (1024 * 1024)).toFixed(2) + " MB";
}

// List the targets to strip.  Each entry is { src, label }.
function discover() {
  const out = [];

  // skills: keep synarc-core, _index.json; move the rest
  const skillsDir = path.join(ROOT, "skills");
  if (exists(skillsDir)) {
    for (const e of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!e.isDirectory() && !e.isFile()) continue;
      if (KEEP_SKILLS.has(e.name)) continue;
      out.push({ src: path.join(skillsDir, e.name), label: "skills/" + e.name });
    }
  }

  // synarc-core: move large sub-dirs that are not shipped
  const coreDir = path.join(skillsDir, "synarc-core");
  for (const sub of ["expanded", "references", "examples", "assets"]) {
    const p = path.join(coreDir, sub);
    if (exists(p)) out.push({ src: p, label: "skills/synarc-core/" + sub });
  }

  // shared: keep runtime-adapters, schemas, guardrails; move the rest
  const sharedDir = path.join(ROOT, "shared");
  if (exists(sharedDir)) {
    const KEEP_SHARED = new Set(["runtime-adapters", "schemas", "guardrails"]);
    for (const e of fs.readdirSync(sharedDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (KEEP_SHARED.has(e.name)) continue;
      out.push({ src: path.join(sharedDir, e.name), label: "shared/" + e.name });
    }
  }

  // scripts: keep install.js, lib/, clean.js, format-skills.js, postinstall.js, strip-lean.js, restore-lean.js
  const scriptsDir = path.join(ROOT, "scripts");
  if (exists(scriptsDir)) {
    const KEEP_SCRIPTS = new Set([
      "install.js", "postinstall.js", "clean.js", "format-skills.js",
      "strip-lean.js", "restore-lean.js", "lib",
    ]);
    for (const e of fs.readdirSync(scriptsDir, { withFileTypes: true })) {
      if (KEEP_SCRIPTS.has(e.name)) continue;
      // Skip anything already in .stripped/ via a previous run
      if (e.name.startsWith(".")) continue;
      const p = path.join(scriptsDir, e.name);
      out.push({ src: p, label: "scripts/" + e.name });
    }
  }

  // docs: move the whole tree
  const docsDir = path.join(ROOT, "docs");
  if (exists(docsDir)) out.push({ src: docsDir, label: "docs" });

  // tests
  const testsDir = path.join(ROOT, "tests");
  if (exists(testsDir)) out.push({ src: testsDir, label: "tests" });

  // .github (workflows + issue templates)
  const ghDir = path.join(ROOT, ".github");
  if (exists(ghDir)) out.push({ src: ghDir, label: ".github" });

  // .claude-plugin subdirs that aren't shipped
  const cpDir = path.join(ROOT, ".claude-plugin");
  if (exists(cpDir)) {
    for (const e of fs.readdirSync(cpDir, { withFileTypes: true })) {
      if (e.name === "plugin.json" || e.name === "marketplace.json") continue;
      out.push({ src: path.join(cpDir, e.name), label: ".claude-plugin/" + e.name });
    }
  }

  // security/ (full tree, large)
  const secDir = path.join(ROOT, "security");
  if (exists(secDir)) out.push({ src: secDir, label: "security" });

  return out;
}

function moveEntry({ src, label }) {
  if (!exists(src)) return { skipped: true };
  const rel = path.relative(ROOT, src);
  const dest = path.join(STRIPPED_DIR, rel);
  const totalBytes = (function walk(p) {
    let s = 0;
    let items;
    try { items = fs.readdirSync(p, { withFileTypes: true }); } catch { return 0; }
    for (const it of items) {
      const full = path.join(p, it.name);
      if (it.isDirectory()) s += walk(full);
      else s += bytes(full);
    }
    return s;
  })(src);
  if (FLAGS.dryRun) {
    return { moved: false, dest, bytes: totalBytes };
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  return { moved: true, dest, bytes: totalBytes };
}

function main() {
  const targets = discover();
  if (targets.length === 0) {
    console.log("strip-lean: nothing to strip (tree is already lean or .stripped/ contains the rest)");
    process.exit(0);
  }
  // Compute total size
  let totalBytes = 0;
  for (const t of targets) {
    if (!exists(t.src)) continue;
    let s = 0;
    (function walk(p) {
      let items;
      try { items = fs.readdirSync(p, { withFileTypes: true }); } catch { return; }
      for (const it of items) {
        const full = path.join(p, it.name);
        if (it.isDirectory()) walk(full);
        else s += bytes(full);
      }
    })(t.src);
    totalBytes += s;
  }

  console.log("strip-lean: planning to move " + targets.length + " entr" + (targets.length === 1 ? "y" : "ies") + " (" + fmtBytes(totalBytes) + ") to .stripped/");
  for (const t of targets) {
    console.log("  - " + t.label);
  }
  if (FLAGS.dryRun) {
    console.log("\nDry-run: no files moved.");
    process.exit(0);
  }
  if (!FLAGS.yes) {
    console.log("\nRe-run with --yes to confirm.");
    process.exit(2);
  }
  let moved = 0, totalMoved = 0;
  for (const t of targets) {
    const r = moveEntry(t);
    if (r.moved) {
      moved++;
      totalMoved += r.bytes;
    }
  }
  console.log("\nstrip-lean: moved " + moved + " entries, freed " + fmtBytes(totalMoved));
  console.log("  restore with: node scripts/restore-lean.js");
}

main();