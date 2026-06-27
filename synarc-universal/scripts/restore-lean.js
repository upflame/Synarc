#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal - lean restore
 * Reverses scripts/strip-lean.js by moving everything in .stripped/ back
 * to its original location.  Idempotent: re-running on a clean tree is a
 * no-op.
 *
 * Usage:
 *   node scripts/restore-lean.js [--dry-run] [--yes]
 */

const fs   = require("node:fs");
const path = require("node:path");

const ROOT         = path.resolve(__dirname, "..");
const STRIPPED_DIR = path.join(ROOT, ".stripped");

const ARGV = process.argv.slice(2);
const FLAGS = { dryRun: false, yes: false, help: false };
for (const a of ARGV) {
  if (a === "--dry-run" || a === "-n") FLAGS.dryRun = true;
  else if (a === "--yes" || a === "-y") FLAGS.yes = true;
  else if (a === "--help" || a === "-h") FLAGS.help = true;
}

if (FLAGS.help) {
  console.log("Usage: node scripts/restore-lean.js [--dry-run] [--yes]");
  process.exit(0);
}

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

function discover() {
  if (!exists(STRIPPED_DIR)) return [];
  // Top-level entries only; each will be moved whole.
  const out = [];
  for (const it of fs.readdirSync(STRIPPED_DIR, { withFileTypes: true })) {
    const full = path.join(STRIPPED_DIR, it.name);
    out.push({ src: full, dest: path.join(ROOT, it.name) });
  }
  return out;
}

function main() {
  if (!exists(STRIPPED_DIR)) {
    console.log("restore-lean: .stripped/ does not exist; nothing to restore.");
    process.exit(0);
  }
  const items = discover();
  if (items.length === 0) {
    console.log("restore-lean: .stripped/ is empty.");
    process.exit(0);
  }
  console.log("restore-lean: " + items.length + " entr" + (items.length === 1 ? "y" : "ies") + " to move back");
  // Show top-level groups
  const topGroups = new Set();
  for (const it of items) topGroups.add(path.relative(STRIPPED_DIR, it.src).split(path.sep)[0]);
  for (const g of topGroups) console.log("  - " + g);
  if (FLAGS.dryRun) {
    console.log("\nDry-run: no files moved.");
    process.exit(0);
  }
  if (!FLAGS.yes) {
    console.log("\nRe-run with --yes to confirm.");
    process.exit(2);
  }
  let moved = 0, merged = 0, replaced = 0;
  for (const it of items) {
    if (exists(it.dest)) {
      // If the destination is a directory, merge entries in (only put back things
      // that aren\'t already there).  If it\'s a file, replace it.
      let destStat;
      try { destStat = fs.statSync(it.dest); } catch { destStat = null; }
      if (destStat && destStat.isDirectory()) {
        // Merge: move each child of it.src into it.dest if it.dest doesn\'t have it.
        const srcItems = fs.readdirSync(it.src);
        for (const child of srcItems) {
          const childSrc = path.join(it.src, child);
          const childDest = path.join(it.dest, child);
          if (exists(childDest)) continue;
          fs.renameSync(childSrc, childDest);
          moved++;
        }
        merged++;
        // Remove the source directory recursively (some children may have been
        // merged in and some may still be there; rmdirSync is enough because
        // the merge moved everything into it.dest).
        try { fs.rmSync(it.src, { recursive: true, force: true }); } catch { /* best-effort */ }
        continue;
      } else {
        // Replace
        try {
          fs.rmSync(it.dest, { recursive: true, force: true });
          replaced++;
        } catch (e) {
          console.warn("  ! could not remove " + it.dest + ": " + e.message);
          continue;
        }
      }
    }
    fs.mkdirSync(path.dirname(it.dest), { recursive: true });
    fs.renameSync(it.src, it.dest);
    moved++;
  }
  // Try to clean up empty .stripped/ tree (only directories)
  function cleanupEmpty(d) {
    if (!exists(d)) return;
    let stat;
    try { stat = fs.statSync(d); } catch { return; }
    if (!stat.isDirectory()) return;
    const items = fs.readdirSync(d);
    if (items.length === 0) {
      fs.rmdirSync(d);
      return;
    }
    for (const it of items) cleanupEmpty(path.join(d, it));
    if (exists(d) && fs.readdirSync(d).length === 0) fs.rmdirSync(d);
  }
  cleanupEmpty(STRIPPED_DIR);
  console.log("\nrestore-lean: moved " + moved + " entries back" + (merged > 0 ? " (" + merged + " merged)" : "") + (replaced > 0 ? " (" + replaced + " replaced)" : ""));
}

main();