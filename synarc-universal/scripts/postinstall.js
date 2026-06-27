#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal \u2014 postinstall / preuninstall hook
 * Called by npm after `npm install synarc`.
 *
 * Behavior:
 *  - Default: tiny welcome. If editor markers are detected, auto-install for those.
 *  - --uninstall: clean up hint + lock.
 *  - --preuninstall: print goodbye.
 *
 * The CLI can be invoked at any time with `npx synarc fresh` to actually wire editors.
 */

const fs   = require("node:fs");
const path = require("node:path");

const lib     = require("./lib");
const { detectMarkers } = require("./lib/editors");
const { makeLogger } = require("./lib/logger");
const config  = lib._internal.config;

const argv = process.argv.slice(2);
const isUninstall    = argv.includes("--uninstall")    || process.env.npm_lifecycle_event === "uninstall";
const isPreuninstall = argv.includes("--preuninstall") || process.env.npm_lifecycle_event === "preuninstall";
const isSkip         = argv.includes("--skip") || process.env.SYNARC_SKIP_POSTINSTALL === "1";

const log = makeLogger({ quiet: process.env.SYNARC_QUIET_POSTINSTALL === "1" });
const cwd = process.env.INIT_CWD || process.cwd();

function ensureHint() {
  const hintDir = path.join(cwd, ".synarc");
  const hintPath = path.join(hintDir, "installed.json");
  const hint = {
    installed_at: new Date().toISOString(),
    version: config.PACK_VERSION,
    next: "Run `npx synarc fresh` to wire editors, or `npx synarc init` to scaffold a config.",
    detected: Array.from(detectMarkers(cwd)),
  };
  try {
    fs.mkdirSync(hintDir, { recursive: true });
    fs.writeFileSync(hintPath, JSON.stringify(hint, null, 2) + "\n", "utf-8");
  } catch { /* best-effort */ }
}

function removeHint() {
  try { fs.unlinkSync(path.join(cwd, ".synarc", "installed.json")); } catch { /* */ }
  try { fs.rmSync(path.join(cwd, ".synarc"), { recursive: true, force: true }); } catch { /* */ }
  try { fs.unlinkSync(path.join(cwd, "synarc.lock.json")); } catch { /* */ }
}

if (isSkip) process.exit(0);

if (isPreuninstall) {
  log.info("synarc: preparing to uninstall \u2014 cleaning up hint file and lock");
  removeHint();
  process.exit(0);
}

if (isUninstall) {
  log.info("synarc: uninstalled cleanly. Thanks for using Synarc!");
  removeHint();
  process.exit(0);
}

// Default: postinstall. Run async, then exit.
(async function main() {
  try {
    const detected = detectMarkers(cwd);
    if (detected.size > 0) {
      log.info("synarc: " + detected.size + " editor marker" + (detected.size === 1 ? "" : "s") + " detected (" + Array.from(detected).join(", ") + ")");
      log.info("synarc: auto-installing for detected editors \u2026");
      try {
        const r = await lib.install({ targets: Array.from(detected), yes: true, cwd, _mode: "postinstall" });
        if (r && r.results) {
          const ok = r.results.filter(x => x.ok).length;
          log.info("synarc: " + ok + "/" + r.results.length + " editors wired automatically");
          for (const res of r.results) {
            if (res.ok) log.info("  \u2714 " + (res.label || res.id));
          }
        }
      } catch (err) {
        log.info("synarc: auto-install failed (" + err.message + "); hint written, run `npx synarc fresh` to retry");
      }
    } else {
      log.info("synarc v" + config.PACK_VERSION + " installed. No editor markers detected \u2014 hint written to .synarc/installed.json");
    }
    ensureHint();
    log.info("synarc: try `npx synarc --help` for all commands, or `npx synarc fresh` to install.");
  } catch (err) {
    // Never let postinstall break an install
    log.info("synarc postinstall: " + (err.message || "unknown error") + " (continuing)");
  }
  process.exit(0);
})();
