"use strict";
/**
 * Synarc Universal \u2014 command handlers
 * One function per verb, plus subcommand groups (audit, ledger).
 *
 * Every command follows the same shape:
 *   fn(cwd, opts, ...args) -> { code, results?, lock?, ... }
 *
 * @module synarc-universal/lib/commands
 */

const path = require("node:path");
const fs   = require("node:fs");
const os   = require("node:os");
const { execFileSync } = require("node:child_process");

const { listEditors, getEditor, detectMarkers, editors } = require("./editors");
const { writeLock, readLock, lockPath: getLockPath } = require("./lockfile");
const { formatBytes } = require("./logger");
const { configFile } = require("./templates");
const config = require("./config");
const configLoader = require("./config-loader");
const { configFile: renderConfigFile } = require("./templates");
const cache   = require("./cache");
const loader  = require("./loader");
const fetcher = require("./fetcher");
const ui      = require("./ui");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findSynarcRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, "AGENTS.md")) && fs.existsSync(path.join(dir, "manifest.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return path.resolve(__dirname, "..", "..");
}

function resolveTargets(opts) {
  const explicit = Array.isArray(opts.target) ? opts.target : (opts.target ? [opts.target] : []);
  if (explicit.length === 0) {
    if (process.env[config.ENV.TARGETS]) {
      return process.env[config.ENV.TARGETS].split(",").map(s => s.trim()).filter(Boolean);
    }
    return null;
  }
  if (explicit.includes("all")) {
    return listEditors().map(e => e.id);
  }
  return explicit;
}

function reportResult(logger, r) {
  if (!r.ok) {
    logger.fail(r.label, r.reason);
  } else if (r.action === "skipped") {
    logger.skip(r.label, r.path);
  } else if (r.action === "installed") {
    if (r.copied != null) {
      logger.info("  \u2714 " + r.label.padEnd(16) + r.path + "  (" + r.copied + " new, " + r.skipped + " already present)");
    } else {
      logger.pass(r.label, r.path, r.bytes);
    }
  } else if (r.action === "appended") {
    logger.info("  \u2714 " + r.label.padEnd(16) + "appended to " + r.path);
  } else if (r.action === "generated") {
    logger.info("  \u2714 " + r.label.padEnd(16) + "generated " + r.path);
  } else if (r.action === "removed") {
    logger.info("  \u2716 removed " + r.path);
  }
}

function installAll(cwd, opts, ids) {
  const log = opts.logger;
  const synarcRoot = findSynarcRoot();
  const results = [];
  for (const id of ids) {
    const e = getEditor(id);
    if (!e) { results.push({ id, label: id, ok: false, reason: "unknown editor id" }); continue; }
    const r = e.install(cwd, synarcRoot, opts);
    results.push({ id, label: e.label, ...r });
  }
  if (!opts.quiet && !opts.json) {
    for (const r of results) reportResult(log, r);
  }
  const lockRes = opts.dryRun ? { ok: true, dryRun: true } : writeLock(cwd, results, opts._mode || "install");
  return { code: results.every(r => r.ok) ? config.EXIT.OK : config.EXIT.FAIL, results, lock: lockRes };
}

// ===========================================================================
// install verbs
// ===========================================================================

function fresh(cwd, opts) {
  const log = opts.logger;
  const detected = detectMarkers(cwd);
  let ids = resolveTargets(opts);
  if (!ids) ids = detected.size > 0 ? Array.from(detected) : config.DEFAULT_TARGETS;

  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION);
    log.info("  Target: " + cwd);
    if (detected.size > 0) log.info("  Detected markers: " + Array.from(detected).join(", "));
    if (opts.dryRun) log.info("  Mode: dry-run (no files will be written)");
    log.info("");
  }
  const r = installAll(cwd, opts, ids);
  if (!opts.json && r.lock && r.lock.ok && !r.lock.dryRun) {
    log.info("");
    log.info("  \u2714 synarc.lock.json written");
  }
  if (!opts.json) {
    log.info("");
    log.info("  Synarc installed for " + r.results.filter(x => x.ok).length + " of " + r.results.length + " target(s).");
    log.info("  Verify: synarc verify");
  }
  return { code: r.code, results: r.results, lock: r.lock };
}

function add(cwd, opts, ids) {
  if (!ids || ids.length === 0) {
    opts.logger.error("Usage: synarc add <editor>...");
    return { code: config.EXIT.INVALID_ARGS, results: [] };
  }
  return installAll(cwd, opts, ids);
}

function remove(cwd, opts, ids) {
  if (!ids || ids.length === 0) {
    opts.logger.error("Usage: synarc remove <editor>...");
    return { code: config.EXIT.INVALID_ARGS, results: [] };
  }
  const log = opts.logger;
  const results = [];
  for (const id of ids) {
    const e = getEditor(id);
    if (!e) { results.push({ id, label: id, ok: false, reason: "unknown editor id" }); continue; }
    const r = e.remove(cwd);
    results.push({ id, label: e.label, ...r });
  }
  if (!opts.json) {
    for (const r of results) {
      if (r.removed) log.info("  \u2716 removed " + r.path);
      else if (r.note) log.info("  \u2026 " + r.label + ": " + r.note);
      else log.info("  \u2026 " + r.label + ": no file to remove");
    }
  }
  const lock = readLock(cwd);
  if (lock.ok) {
    const remaining = lock.lock.targets.filter(t => !ids.includes(t.id));
    writeLock(cwd, remaining.map(t => ({ id: t.id, label: t.label, ok: true, action: "skipped", path: t.path, bytes: t.bytes })), "remove");
  }
  return { code: config.EXIT.OK, results };
}

/**
 * Uninstall Synarc from a project.  Three modes:
 *
 *   synarc uninstall                  # default = hard: purge everything
 *   synarc uninstall --soft           # keep synarc.config.js + lock + cache
 *   synarc uninstall --hard           # purge everything (default)
 *   synarc uninstall --keep <editor>  # only remove these editors; keep the rest
 *   synarc uninstall --keep-cache     # don't touch the skill cache
 *   synarc uninstall --keep-config    # don't touch synarc.config.js
 *
 * Mode is resolved as: --hard > --soft > --keep flags > default (hard).
 */
function uninstall(cwd, opts) {
  const log = opts.logger;
  const keepIds = Array.isArray(opts.keep) ? opts.keep : (opts.keep ? [opts.keep] : []);
  const soft   = Boolean(opts.soft);
  const hard   = Boolean(opts.hard);
  const keepCache  = Boolean(opts.keepCache);
  const keepConfig = Boolean(opts.keepConfig);

  const mode = hard ? "hard" : (soft ? "soft" : "hard");
  const detected = detectMarkers(cwd);
  if (detected.size === 0) {
    if (!opts.json) log.info("  No Synarc install detected in " + cwd);
    return { code: config.EXIT.OK, results: [], mode };
  }

  const results = [];
  for (const id of Array.from(detected)) {
    if (keepIds.length > 0 &&  keepIds.includes(id)) continue;
    const e = getEditor(id);
    if (!e) continue;
    const r = e.remove(cwd);
    results.push({ id, label: e.label, ...r, action: "removed" });
  }
  if (!soft) {
    try { fs.unlinkSync(getLockPath(cwd)); results.push({ id: "_lock", label: "synarc.lock.json", ok: true, action: "removed", path: getLockPath(cwd) }); } catch { /* */ }
  } else {
    results.push({ id: "_lock", label: "synarc.lock.json", ok: true, action: "kept", path: getLockPath(cwd), reason: "soft mode" });
  }
  const cfgPath = path.join(cwd, "synarc.config.js");
  const shouldRemoveConfig = !soft && !keepConfig && fs.existsSync(cfgPath);
  if (shouldRemoveConfig) {
    if (opts.yes) {
      try { fs.unlinkSync(cfgPath); results.push({ id: "_config", label: "synarc.config.js", ok: true, action: "removed", path: cfgPath }); } catch { /* */ }
    } else {
      results.push({ id: "_config", label: "synarc.config.js", ok: true, action: "kept", path: cfgPath, reason: "use --yes to remove" });
    }
  } else if ((soft || keepConfig) && fs.existsSync(cfgPath)) {
    results.push({ id: "_config", label: "synarc.config.js", ok: true, action: "kept", path: cfgPath, reason: soft ? "soft mode" : "--keep-config" });
  }
  if (mode === "hard" && !keepCache) {
    const s = cache.status({ synarcRoot: findSynarcRoot() });
    if (s.exists && s.entries > 0) {
      cache.clear({ synarcRoot: findSynarcRoot() });
      results.push({ id: "_cache", label: "skill cache", ok: true, action: "removed", path: s.dir, entries: s.entries, bytes: s.bytes });
    } else {
      results.push({ id: "_cache", label: "skill cache", ok: true, action: "kept", path: s.dir, reason: "no entries" });
    }
  } else if (keepCache || soft) {
    const s = cache.status({ synarcRoot: findSynarcRoot() });
    results.push({ id: "_cache", label: "skill cache", ok: true, action: "kept", path: s.dir, reason: keepCache ? "--keep-cache" : "soft mode" });
  }
  if (mode === "hard") {
    const projSkills = path.join(cwd, ".synarc", "skills");
    if (fs.existsSync(projSkills)) {
      try { fs.rmSync(projSkills, { recursive: true, force: true }); results.push({ id: "_projSkills", label: ".synarc/skills/", ok: true, action: "removed", path: projSkills }); } catch { /* */ }
    }
  }

  if (!opts.json) {
    for (const r of results) {
      if (r.action === "removed" && r.ok) log.info("  ✖ removed " + (r.path || r.label));
      else if (r.action === "kept" && r.ok) log.info("  … kept   " + (r.path || r.label) + (r.reason ? "  (" + r.reason + ")" : ""));
    }
    log.info("");
    log.info("  Mode: " + mode + (keepIds.length ? "  (kept: " + keepIds.join(", ") + ")" : ""));
    log.info("  The synarc-universal/ source tree (if present) is untouched.");
  }
  return { code: config.EXIT.OK, results, mode };
}
// ===========================================================================
// refresh
// ===========================================================================

/**
 * Re-run install for the targets in synarc.lock.json (or all detected editors
 * if no lock).  Idempotent: each editor install() is a copy-if-changed
 * operation, so this is safe to run after editing AGENTS.md, after running
 * a cache prefetch, or after upgrading the pack.
 *
 *   synarc refresh                 # refresh for current lock targets
 *   synarc refresh --target all    # refresh for every editor
 *   synarc refresh --verify        # also run verify after install
 */
function refresh(cwd, opts) {
  const log = opts.logger;
  let ids = resolveTargets(opts);
  if (!ids) {
    const lock = readLock(cwd);
    if (lock.ok && lock.lock.targets && lock.lock.targets.length > 0) {
      ids = lock.lock.targets.map((t) => t.id);
    } else {
      const detected = detectMarkers(cwd);
      ids = detected.size > 0 ? Array.from(detected) : listEditors().map((e) => e.id);
    }
  }
  if (!opts.json) {
    log.header('Synarc Universal v' + config.PACK_VERSION + ' - Refresh');
    log.info('  Targets: ' + ids.join(', '));
    log.info('');
  }
  const r = installAll(cwd, { ...opts, _mode: 'refresh' }, ids);
  if (!opts.json) {
    log.info('');
    log.info('  Refreshed ' + r.results.filter((x) => x.ok).length + ' of ' + r.results.length + ' target(s).');
    if (opts.verify) log.info('  Re-running verify...');
  }
  if (opts.verify) {
    return verify(cwd, opts);
  }
  return r;
}


// ===========================================================================
// verify / status / doctor
// ===========================================================================

function verify(cwd, opts) {
  const log = opts.logger;
  const synarcRoot = findSynarcRoot();
  let ids = resolveTargets(opts);
  if (!ids) {
    const lock = readLock(cwd);
    if (lock.ok && lock.lock.targets) {
      ids = lock.lock.targets.map(t => t.id);
    } else {
      ids = listEditors().map(e => e.id);
    }
  }
  const results = [];
  for (const id of ids) {
    const e = getEditor(id);
    if (!e) { results.push({ id, label: id, ok: false, reason: "unknown editor id" }); continue; }
    const v = e.verify(cwd, synarcRoot);
    results.push({ id, label: e.label, ...v });
  }
  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION + " - Verify");
    for (const r of results) {
      if (!r.ok) log.fail(r.label, r.path);
      else if (r.skills) log.info("  \u2714 " + r.label.padEnd(16) + r.path + " (" + r.skills + " skills)");
      else log.pass(r.label, r.path, r.bytes);
    }
    const pass = results.filter(r => r.ok).length;
    const fail = results.length - pass;
    log.info("");
    log.info("  Verification: " + pass + " pass, " + fail + " fail of " + results.length + " editors.");
  }
  return { code: results.every(r => r.ok) ? config.EXIT.OK : config.EXIT.FAIL, results };
}

function status(cwd, opts) {
  const log = opts.logger;
  const lock = readLock(cwd);
  if (!lock.ok) {
    if (!opts.json) log.info("  No synarc.lock.json found at " + cwd);
    return { code: config.EXIT.OK, lock: null };
  }
  if (!opts.json) {
    log.header("Synarc Universal v" + lock.lock.synarc_version + " - Status");
    log.info("  Installed at: " + lock.lock.installed_at);
    log.info("  Mode:         " + (lock.lock.mode || "install"));
    log.info("  Targets:      " + lock.lock.targets.length);
    for (const t of lock.lock.targets) {
      const tag = t.ok ? "\u2714" : "\u2716";
      log.info("    " + tag + " " + t.label.padEnd(16) + t.path + (t.bytes ? "  (" + formatBytes(t.bytes) + ")" : ""));
    }
    log.info("  Summary:      " + lock.lock.summary.pass + " pass, " + lock.lock.summary.fail + " fail of " + lock.lock.summary.total);
  }
  return { code: config.EXIT.OK, lock };
}

function doctor(cwd, opts) {
  const log = opts.logger;
  const synarcRoot = findSynarcRoot();
  const checks = [];

  const nodeVer = process.version;
  const nodeMajor = parseInt(nodeVer.slice(1).split(".")[0], 10);
  checks.push({ name: "node-version", ok: nodeMajor >= 18, detail: nodeVer });

  let gitVer = "missing";
  try {
    gitVer = execFileSync("git", ["--version"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch { /* */ }
  checks.push({ name: "git-available", ok: gitVer !== "missing", detail: gitVer });

  let canRead = false;
  try { fs.accessSync(synarcRoot, fs.constants.R_OK); canRead = true; } catch { /* */ }
  checks.push({ name: "pack-readable", ok: canRead, detail: synarcRoot });

  let canWrite = false;
  try { fs.accessSync(cwd, fs.constants.W_OK); canWrite = true; } catch { /* */ }
  checks.push({ name: "cwd-writable", ok: canWrite, detail: cwd });

  let manifestOk = false;
  let manifestDetail = "missing";
  try {
    const yaml = fs.readFileSync(path.join(synarcRoot, "manifest.yaml"), "utf-8");
    manifestOk = yaml.includes("synarc-universal") && yaml.length > 1000;
    manifestDetail = manifestOk ? (yaml.length + " bytes") : "malformed";
  } catch { /* */ }
  checks.push({ name: "pack-integrity", ok: manifestOk, detail: manifestDetail });

  const detected = Array.from(detectMarkers(cwd));
  checks.push({ name: "editor-markers", ok: detected.length > 0, detail: detected.length === 0 ? "none detected" : detected.join(", ") });

  const lock = readLock(cwd);
  checks.push({ name: "lock-file", ok: lock.ok, detail: lock.ok ? lock.lock.synarc_version : (lock.reason || "missing") });

  // Network check (optional, doesn't fail)
  let netDetail = "ok";
  try {
    execFileSync("node", ["-e", "require('node:dns').lookup('registry.npmjs.org', () => process.exit(0))"], { stdio: "ignore", timeout: 3000 });
    netDetail = "registry.npmjs.org reachable";
  } catch { netDetail = "registry unreachable (offline mode)"; }
  checks.push({ name: "network", ok: true, detail: netDetail });

  const allOk = checks.every(c => c.ok);
  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION + " - Doctor");
    for (const c of checks) {
      const tag = c.ok ? "\u2714" : "\u2716";
      log.info("  " + tag + " " + c.name.padEnd(20) + c.detail);
    }
    log.info("");
    log.info("  " + (allOk ? "All checks passed." : "Some checks failed - see above."));
  }
  return { code: allOk ? config.EXIT.OK : config.EXIT.FAIL, checks };
}

// ===========================================================================
// init
// ===========================================================================

async function init(cwd, opts) {
  const log = opts.logger;
  const cfgPath = path.join(cwd, "synarc.config.js");
  const exists = fs.existsSync(cfgPath);
  if (exists && !opts.yes) {
    log.info("  synarc.config.js already exists at " + cfgPath);
    log.info("  Use --force to overwrite.");
    return { code: config.EXIT.OK, path: cfgPath, existed: true };
  }
  // Auto-detect agents if possible
  const detected = Array.from(detectMarkers(cwd));
  const agents = detected.length > 0 ? detected : ["claude-code", "codex", "opencode"];
  const content = renderConfigFile({ agents });
  try {
    fs.writeFileSync(cfgPath, content, "utf-8");
    if (!opts.json) {
      log.header("Synarc init");
      log.info("  " + "\u2714" + " created " + cfgPath);
      log.info("");
      log.info("  Next: edit synarc.config.js, then run `synarc fresh --yes`.");
    }
    return { code: config.EXIT.OK, path: cfgPath, content };
  } catch (err) {
    log.error("  could not write synarc.config.js: " + err.message);
    return { code: config.EXIT.PERMISSION, error: err.message };
  }
}

// ===========================================================================
// info \u2014 a pretty status card
// ===========================================================================

function info(cwd, opts) {
  const log = opts.logger;
  const synarcRoot = findSynarcRoot();
  const detected = Array.from(detectMarkers(cwd));
  const lock = readLock(cwd);
  const { config: userConfig, path: cfgPath } = configLoader.loadConfig(cwd);
  const editors = listEditors();
  const skills = (() => { try { return fs.readdirSync(path.join(synarcRoot, "skills")).filter(d => fs.statSync(path.join(synarcRoot, "skills", d)).isDirectory()); } catch { return []; } })();

  let nodeVer = process.version;
  let gitVer = "missing";
  try { gitVer = execFileSync("git", ["--version"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { /* */ }

  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION);
    log.info("  " + (require("./ui").logo()));
    log.info("");
    log.info("  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    log.info("  \u2502 Project                                       \u2502");
    log.info("  \u2502   Project dir     " + (cwd + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Node            " + (nodeVer + "                            ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Git             " + (gitVer + "                            ").slice(0, 36) + "\u2502");
    log.info("  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    log.info("");
    log.info("  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    log.info("  \u2502 Pack                                            \u2502");
    log.info("  \u2502   Version         " + (config.PACK_VERSION + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Skills          " + ((skills.length + "                              ")).slice(0, 36) + "\u2502");
    log.info("  \u2502   Editors         " + ((editors.length + "                              ")).slice(0, 36) + "\u2502");
    log.info("  \u2502   Pack root       " + ((synarcRoot.length > 36 ? "..." + synarcRoot.slice(-33) : synarcRoot) + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    log.info("");
    log.info("  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    log.info("  \u2502 Install                                          \u2502");
    log.info("  \u2502   Detected        " + ((detected.length === 0 ? "none" : detected.join(", ")) + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Lock file       " + ((lock.ok ? "synarc.lock.json" : "absent") + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Config file     " + ((cfgPath ? cfgPath : "absent (run synarc init)") + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2502   Skills enabled  " + ((userConfig.skills ? userConfig.skills.length + " selected" : "all " + skills.length) + "                              ").slice(0, 36) + "\u2502");
    log.info("  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    log.info("");
    log.info("  Type `synarc --help` for all commands. Type `synarc doctor` for diagnostics.");
    log.info("");
  }
  return { code: config.EXIT.OK, synarcVersion: config.PACK_VERSION, node: nodeVer, git: gitVer, skills: skills.length, editors: editors.length, detected, lock: lock.ok ? lock.lock : null, config: cfgPath };
}

// ===========================================================================
// upgrade
// ===========================================================================

function upgrade(cwd, opts) {
  const log = opts.logger;
  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION + " - Upgrade");
    log.info("  Current: v" + config.PACK_VERSION);
  }
  // Read the changelog
  const changelogPath = path.join(findSynarcRoot(), "CHANGELOG.md");
  let notes = "";
  try { notes = fs.readFileSync(changelogPath, "utf-8").split("---")[0].trim(); } catch { /* */ }
  if (!opts.json) {
    log.info("");
    log.info("  What's new in v" + config.PACK_VERSION + ":");
    log.info("  " + notes.split("\n").slice(0, 12).join("\n  "));
    log.info("");
    log.info("  Run `npm update synarc` to upgrade, or `synarc migrate-v5` to migrate legacy files.");
  }
  // Run migrate-v5 as part of upgrade
  return migrateV5(cwd, { ...opts, logger: opts.logger });
}

// ===========================================================================
// migrate-v5
// ===========================================================================

function migrateV5(cwd, opts) {
  const log = opts.logger;
  const v5Markers = [
    { path: "plugins", label: "plugins/ directory" },
    { path: ".cursorrules", label: "Cursor .cursorrules" },
    { path: ".windsurfrules", label: "Windsurf .windsurfrules" },
    { path: ".clinerules", label: "Cline .clinerules" },
    { path: ".roorules", label: "Roo .roorules" },
    { path: ".roo/skills", label: "Roo .roo/skills/" },
  ];
  const found = v5Markers.filter(m => fs.existsSync(path.join(cwd, m.path)));
  if (found.length === 0) {
    if (!opts.json) log.info("  No v5 markers found. Nothing to migrate.");
    return { code: config.EXIT.OK, found: [], migrated: [] };
  }
  if (!opts.json) {
    log.header("Synarc Universal v" + config.PACK_VERSION + " - v5 -> v6.6.1 Migration");
    log.info("  Found v5 markers:");
    for (const f of found) log.info("    \u2022 " + f.path + "  (" + f.label + ")");
  }
  if (opts.dryRun) {
    if (!opts.json) log.info("\n  Dry-run: no files removed. Run without --dry-run to migrate.");
    return { code: config.EXIT.OK, found, migrated: [], dryRun: true };
  }
  const migrated = [];
  for (const f of found) {
    if (f.path === "plugins" || f.path === ".roo/skills") {
      const p = path.join(cwd, f.path);
      try { fs.rmSync(p, { recursive: true, force: true }); migrated.push(f.path); } catch { /* */ }
    } else if (f.path === ".roorules") {
      const p = path.join(cwd, f.path);
      try { fs.unlinkSync(p); migrated.push(f.path); } catch { /* */ }
    } else {
      const p = path.join(cwd, f.path);
      const backup = p + ".v5.bak";
      try { fs.renameSync(p, backup); migrated.push(f.path + " -> " + f.path + ".v5.bak"); } catch { /* */ }
    }
  }
  if (!opts.json) {
    log.info("\n  Migrated:");
    for (const m of migrated) log.info("    \u2714 " + m);
    log.info("\n  Next: run `synarc fresh --target all --yes` to install v6.6.1.");
  }
  return { code: config.EXIT.OK, found, migrated };
}

// ===========================================================================
// list
// ===========================================================================

function list(cwd, opts, kind) {
  if (kind === "editors" || kind === "targets" || !kind) {
    return { code: config.EXIT.OK, editors: listEditors() };
  }
  if (kind === "skills") {
    const synarcRoot = findSynarcRoot();
    const skillsDir = path.join(synarcRoot, "skills");
    let skills = [];
    try {
      skills = fs.readdirSync(skillsDir)
        .filter(d => fs.statSync(path.join(skillsDir, d)).isDirectory())
        .map(d => {
          const yaml = path.join(skillsDir, d, "skill.yaml");
          let desc = "";
          try {
            const content = fs.readFileSync(yaml, "utf-8");
            const m = content.match(/description:\s*[>|]?\s*\n\s*([^\n]+)/) || content.match(/description:\s*([^\n]+)/);
            if (m) desc = m[1].trim();
          } catch { /* */ }
          return { id: d, description: desc };
        });
    } catch { /* */ }
    return { code: config.EXIT.OK, skills };
  }
  return { code: config.EXIT.INVALID_ARGS };
}

// ===========================================================================
// cache subcommand group (v6.7+ lean install — content-addressable cache)

// ===========================================================================
// cache subcommand group (v6.7+ lean install — content-addressable cache)
// ===========================================================================

const cache_ = {
  status(cwd, opts) {
    const log = opts.logger;
    const synarcRoot = findSynarcRoot();
    const s = cache.status({ synarcRoot });
    const detail = s.exists
      ? s.entries + " entr" + (s.entries === 1 ? "y" : "ies") + ", " + formatBytes(s.bytes)
      : "not initialized";
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Cache");
      log.info("  Directory   " + s.dir);
      log.info("  Status      " + (s.exists ? "present" : "absent"));
      log.info("  Entries     " + detail);
      log.info("  Mode        " + (s.dir.includes(".synarc-cache") ? "project-local" : s.dir.includes(".synarc" + path.sep + "cache") ? "user-global" : "pack-local"));
      log.info("");
      log.info("  Use synarc cache prefetch to warm the cache for the skills you use.");
      log.info("  Use synarc cache clear to reclaim disk space.");
    }
    return { code: config.EXIT.OK, ...s };
  },

  path(cwd, opts) {
    const log = opts.logger;
    const synarcRoot = findSynarcRoot();
    const dir = cache.pathFor({ synarcRoot });
    if (opts.json) {
      return { code: config.EXIT.OK, dir };
    }
    process.stdout.write(dir + "\n");
    return { code: config.EXIT.OK, dir };
  },

  verify(cwd, opts) {
    const log = opts.logger;
    const synarcRoot = findSynarcRoot();
    const r = cache.verify({ synarcRoot });
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Cache verify");
      log.info("  Directory   " + r.dir);
      log.info("  Checked     " + r.checked + " file" + (r.checked === 1 ? "" : "s"));
      log.info("  OK          " + (r.checked - r.corrupted));
      log.info("  Corrupted   " + r.corrupted + (r.corrupted > 0 ? " (removed)" : ""));
      log.info("");
      log.info(r.ok ? "  All entries verified." : "  Some entries were corrupted and removed.");
    }
    return { code: r.ok ? config.EXIT.OK : config.EXIT.FAIL, ...r };
  },

  clear(cwd, opts) {
    const log = opts.logger;
    if (!opts.yes && !opts.force) {
      const s = cache.status({ synarcRoot: findSynarcRoot() });
      if (s.exists && s.entries > 0) {
        const reason = "About to remove " + s.entries + " cached entr" + (s.entries === 1 ? "y" : "ies") + " (" + formatBytes(s.bytes) + "). Re-run with --yes to confirm.";
        if (opts.json) {
          log.error("  " + reason);
        } else {
          log.info("  " + reason);
        }
        return { code: config.EXIT.INVALID_ARGS, aborted: true, reason, entries: s.entries, bytes: s.bytes };
      }
    }
    const synarcRoot = findSynarcRoot();
    const r = cache.clear({ synarcRoot });
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Cache clear");
      log.info("  ✖ removed " + r.dir);
    }
    return { code: config.EXIT.OK, ...r };
  },

  async prefetch(cwd, opts, ids) {
    const log = opts.logger;
    const synarcRoot = findSynarcRoot();
    let list = ids || [];
    if (list.length === 0) {
      try {
        const cat = loader.loadCatalog({ synarcRoot });
        list = cat.skills.map((s) => s.id);
      } catch (e) {
        log.error("  could not load skill catalog: " + e.message);
        return { code: config.EXIT.FAIL, error: e.message };
      }
    }
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Cache prefetch");
      log.info("  Skills: " + list.length);
      log.info("");
    }
    const bar = ui.progressBar;
    const t0 = Date.now();
    const onProgress = opts.json ? null : (p) => {
      if (process.stdout.isTTY && !opts.quiet) {
        process.stdout.write("\r  " + p.id.padEnd(28) + " " + bar(p.received || 0, p.total || 0, 24));
      }
    };
    const onSkillDone = opts.json ? null : (r) => {
      if (process.stdout.isTTY && !opts.quiet) {
        process.stdout.write("\r  " + r.id.padEnd(28) + " " + (r.source === "fetched" ? "fetched " + formatBytes(r.bytes) : r.source === "bundled" ? "bundled " + formatBytes(r.bytes) : "cached") + "\n");
      } else if (!opts.quiet) {
        log.info("  ✔ " + r.id.padEnd(28) + " " + (r.source === "fetched" ? "fetched " + formatBytes(r.bytes) : r.source === "bundled" ? "bundled " + formatBytes(r.bytes) : "cached"));
      }
    };
    const ref = (opts && opts.ref) || process.env.SYNARC_GH_REF || undefined;
    const repoPrefix = process.env.SYNARC_REPO_PREFIX || undefined;
    const r = await loader.prefetch(list, { synarcRoot, ref, repoPrefix, onProgress, onSkillDone });
    const dur = ((Date.now() - t0) / 1000).toFixed(1);
    if (!opts.json) {
      if (process.stdout.isTTY) process.stdout.write("\n");
      log.info("");
      log.info("  Fetched: " + r.fetched + "    Cached: " + r.cached + "    Errors: " + r.errors.length + "    " + dur + "s");
      if (r.errors.length > 0) {
        log.info("");
        for (const e of r.errors) log.info("  ✖ " + e.id + ": " + e.error);
      }
    }
    return { code: r.errors.length === 0 ? config.EXIT.OK : config.EXIT.FAIL, ...r, duration: dur };
  },
};

// ===========================================================================
// skill subcommand group (v6.7+ lean install — catalog + content lookup)
// ===========================================================================

const skill = {
  list(cwd, opts, kind) {
    const log = opts.logger;
    const synarcRoot = findSynarcRoot();
    let manifest;
    try {
      manifest = loader.manifest({ synarcRoot });
    } catch (e) {
      log.error("  could not load skill catalog: " + e.message);
      return { code: config.EXIT.FAIL, error: e.message };
      }

    const totalBytes = manifest.reduce((a, s) => a + s.bytes, 0);
    if (opts.json) {
      return { code: config.EXIT.OK, count: manifest.length, totalBytes, skills: manifest };
    }
    log.header("Synarc Universal v" + config.PACK_VERSION + " - Skills");
    log.info("  Catalog     " + manifest.length + " skills, " + formatBytes(totalBytes));
    if (kind === "cached" || kind === "available") {
      const filtered = kind === "cached" ? manifest.filter((s) => s.source === "cache") : manifest.filter((s) => s.source !== "missing");
      log.info("  Filter      " + kind + " (" + filtered.length + ")");
      log.info("");
      for (const s of filtered) {
        const tag = s.source === "cache" ? "✔" : s.source === "bundled" ? "○" : "…";
        log.info("  " + tag + " " + s.id.padEnd(30) + formatBytes(s.bytes).padStart(10) + "  " + s.source);
      }
    } else {
      log.info("");
      for (const s of manifest) {
        const tag = s.source === "cache" ? "✔" : s.source === "bundled" ? "○" : "…";
        log.info("  " + tag + " " + s.id.padEnd(30) + formatBytes(s.bytes).padStart(10) + "  " + s.source);
      }
    }
    log.info("");
    log.info("  Use synarc skill get <id> to view a skill. Use synarc skill prefetch [ids...] to cache them.");
    return { code: config.EXIT.OK, count: manifest.length, totalBytes, skills: manifest };
  },

  async get(cwd, opts, ids) {
    const log = opts.logger;
    if (!ids || ids.length === 0) {
      log.error("  Usage: synarc skill get <id> [id...]");
      return { code: config.EXIT.INVALID_ARGS };
    }
    const synarcRoot = findSynarcRoot();
    const ref = process.env.SYNARC_GH_REF || undefined;
    const results = [];
    for (const id of ids) {
      try {
        const r = await loader.loadSkill(id, { synarcRoot, ref });
        results.push(r);
        if (!opts.json) {
          process.stdout.write(r.content);
          if (!r.content.endsWith("\n")) process.stdout.write("\n");
        }
      } catch (err) {
        if (!opts.json) log.error("  " + id + ": " + err.message);
        results.push({ id, error: err.message, code: err.code });
      }
    }
    const ok = results.every((r) => !r.error);
    if (opts.json) {
      return { code: ok ? config.EXIT.OK : config.EXIT.FAIL, results };
    }
    return { code: ok ? config.EXIT.OK : config.EXIT.FAIL, results };
  },

  async show(cwd, opts, id) {
    const log = opts.logger;
    if (!id) {
      log.error("  Usage: synarc skill show <id>");
      return { code: config.EXIT.INVALID_ARGS };
    }
    const synarcRoot = findSynarcRoot();
    const ref = process.env.SYNARC_GH_REF || undefined;
    let r;
    try {
      r = await loader.loadSkill(id, { synarcRoot, ref });
    } catch (err) {
      log.error("  " + id + ": " + err.message);
      return { code: err.code === "UNKNOWN_SKILL" ? config.EXIT.INVALID_ARGS : config.EXIT.FAIL, error: err.message };
    }
    if (opts.json) {
      return { code: config.EXIT.OK, ...r };
    }
    log.header("Synarc Universal v" + config.PACK_VERSION + " - Skill: " + id);
    log.info("  Source      " + r.source + (r.fetchUrl ? "  (" + r.fetchUrl + ")" : ""));
    log.info("  Hash        " + r.hash);
    log.info("  Bytes       " + formatBytes(r.bytes));
    if (r.duration) log.info("  Duration    " + r.duration + "ms");
    log.info("");
    log.info("  Content (first 40 lines):");
    log.info("  " + "-".repeat(60));
    const lines = r.content.split("\n").slice(0, 40);
    for (const line of lines) log.info("  " + line);
    const totalLines = r.content.split("\n").length;
    if (totalLines > 40) {
      log.info("  ... (" + (totalLines - 40) + " more lines; use synarc skill get " + id + " to print the full content)");
    }
    return { code: config.EXIT.OK, ...r };
  },

  async prefetch(cwd, opts, ids) {
    return cache_.prefetch(cwd, opts, ids);
  },
  /**
   * Install a skill into the current project.
   *   synarc skill install <id>             # copy SKILL.md only
   *   synarc skill install <id> --full      # copy the whole skill dir (yaml, changelog, etc.)
   *   synarc skill install <id> --force     # overwrite existing local copy
   */
  async install(cwd, opts, ids) {
    const log = opts.logger;
    if (!ids || ids.length === 0) {
      log.error("  Usage: synarc skill install <id> [id...] [--full] [--force]");
      return { code: config.EXIT.INVALID_ARGS };
    }
    const synarcRoot = findSynarcRoot();
    const projSkills = path.join(cwd, ".synarc", "skills");
    fs.mkdirSync(projSkills, { recursive: true });
    const results = [];
    for (const id of ids) {
      try {
        const r = await loader.loadSkill(id, { synarcRoot, ref: process.env.SYNARC_GH_REF });
        const dst = path.join(projSkills, id);
        if (fs.existsSync(dst) && !opts.force) {
          results.push({ id, ok: false, action: "skipped", reason: "already exists (use --force to overwrite)", path: dst });
          if (!opts.json) log.info("  … " + id + " already installed at " + dst + " (use --force)");
          continue;
        }
        fs.mkdirSync(dst, { recursive: true });
        fs.writeFileSync(path.join(dst, "SKILL.md"), r.content, "utf-8");
        const copied = ["SKILL.md"];
        if (opts.full) {
          const srcDir = path.join(synarcRoot, "skills", id);
          if (fs.existsSync(srcDir)) {
            for (const entry of fs.readdirSync(srcDir)) {
              if (entry === "SKILL.md") continue;
              const src = path.join(srcDir, entry);
              const dstFile = path.join(dst, entry);
              if (fs.statSync(src).isFile()) {
                fs.copyFileSync(src, dstFile);
                copied.push(entry);
              }
            }
          } else {
            results.push({ id, ok: true, action: "installed", source: r.source, path: dst, files: copied, warning: "bundled skill dir not found; only SKILL.md written" });
            if (!opts.json) log.warn("  bundled skill dir not found for " + id + "; only SKILL.md written");
            continue;
          }
        }
        const prov = {
          installed_at: new Date().toISOString(),
          synarc_version: config.PACK_VERSION,
          source: r.source,
          hash: r.hash,
          ref: r.ref || process.env.SYNARC_GH_REF || "main",
          files: copied,
        };
        fs.writeFileSync(path.join(dst, ".synarc-install.json"), JSON.stringify(prov, null, 2) + "\n", "utf-8");
        results.push({ id, ok: true, action: "installed", source: r.source, path: dst, files: copied, hash: r.hash });
        if (!opts.json) {
          log.pass(id, dst, r.bytes);
          log.info("      source: " + r.source + ", files: " + copied.join(", "));
          log.info("      edit the file and commit it; agents will use this local copy.");
        }
      } catch (err) {
        results.push({ id, ok: false, error: err.message, code: err.code });
        if (!opts.json) log.error("  " + id + ": " + err.message);
      }
    }
    const allOk = results.every((r) => r.ok);
    return { code: allOk ? config.EXIT.OK : config.EXIT.FAIL, results, path: projSkills };
  },

  /**
   * Remove a project-local skill copy.
   *   synarc skill uninstall <id>
   */
  uninstall(cwd, opts, ids) {
    const log = opts.logger;
    if (!ids || ids.length === 0) {
      log.error("  Usage: synarc skill uninstall <id> [id...]");
      return { code: config.EXIT.INVALID_ARGS };
    }
    const projSkills = path.join(cwd, ".synarc", "skills");
    const results = [];
    for (const id of ids) {
      const dst = path.join(projSkills, id);
      if (!fs.existsSync(dst)) {
        results.push({ id, ok: false, action: "skipped", reason: "not installed locally" });
        if (!opts.json) log.info("  … " + id + " not installed locally");
        continue;
      }
      try { fs.rmSync(dst, { recursive: true, force: true }); results.push({ id, ok: true, action: "removed", path: dst }); if (!opts.json) log.info("  ✖ removed " + dst); } catch (e) { results.push({ id, ok: false, error: e.message }); }
    }
    const allOk = results.every((r) => r.ok);
    return { code: allOk ? config.EXIT.OK : config.EXIT.FAIL, results };
  },

};
// ===========================================================================
// auto - smart optimistic WorkType classifier + on-demand skill installer
// ===========================================================================

/**
 * Cheap, deterministic keyword-based WorkType classifier.  Detects intent
 * (refactor, debug, ship, design, audit, etc.) from the user message and
 * maps it to a set of skills to make available.  Toggle on/off via
 * synarc.config.js -> auto: true|false.
 *
 *   synarc auto <message>             classify + prefetch + install
 *   synarc auto --no-prefetch <msg>   classify + write manifest only
 *   synarc auto --dry-run <msg>       show what would activate
 *   synarc auto --json <msg>          machine-readable output
 *
 * Returns the original result from installAll so chained invocations work.
 */
const WORKTYPE_KEYWORDS = {
  refactor:   { intents: ['refactor', 'restructure', 'reorganize', 'clean up', 'tidy'], skills: ['architect', 'coding-agent', 'decision-engineer', 'performance-thinker'] },
  debug:      { intents: ['debug', 'fix', 'bug', 'broken', 'error', 'crash', 'fails'], skills: ['debug-engineer', 'sre-engineer', 'observability-engineer', 'incident-commander'] },
  ship:       { intents: ['ship', 'deploy', 'release', 'rollout', 'production', 'launch'], skills: ['release-engineer', 'sre-engineer', 'devops-engineer', 'performance-engineer', 'risk-analyst'] },
  test:       { intents: ['test', 'qa', 'coverage', 'e2e', 'unit test'], skills: ['sdet-engineer', 'testing-strategy', 'debug-engineer'] },
  design:     { intents: ['design', 'ux', 'ui', 'wireframe', 'prototype'], skills: ['ux-engineer', 'ui-engineer', 'product-designer', 'content-designer'] },
  architecture: { intents: ['architect', 'design the system', 'tech stack', 'migrate', 'monolith'], skills: ['architect', 'platform-engineer', 'decision-engineer', 'foundational-reasoning'] },
  security:   { intents: ['security', 'auth', 'vulnerability', 'cve', 'hardening', 'audit'], skills: ['security-engineer', 'privacy-engineer', 'ethics-engineer', 'ai-safety-eval-engineer'] },
  data:       { intents: ['data', 'etl', 'pipeline', 'warehouse', 'sql', 'database'], skills: ['data-engineer', 'data-scientist', 'database-architect', 'ml-engineer'] },
  ml:         { intents: ['ml', 'model', 'train', 'rag', 'embedding', 'llm', 'prompt'], skills: ['ml-engineer', 'mlops-engineer', 'prompt-engineer', 'rag-engineer', 'agentic-ai-engineer'] },
  frontend:   { intents: ['frontend', 'react', 'vue', 'css', 'html', 'component'], skills: ['frontend-engineer', 'ui-engineer', 'ux-engineer', 'design-systems-engineer', 'accessibility-engineer'] },
  backend:    { intents: ['backend', 'api', 'endpoint', 'server', 'service'], skills: ['backend-engineer', 'api-designer', 'platform-engineer', 'performance-engineer'] },
  mobile:     { intents: ['mobile', 'ios', 'android', 'swift', 'kotlin', 'react native'], skills: ['mobile-engineer', 'frontend-engineer', 'ux-engineer'] },
  infra:      { intents: ['infra', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'cloud'], skills: ['infrastructure-engineer', 'platform-engineer', 'devops-engineer', 'sre-engineer', 'finops-engineer'] },
  docs:       { intents: ['document', 'docs', 'readme', 'guide', 'explain'], skills: ['content-designer', 'product-engineer', 'decision-engineer'] },
  perf:       { intents: ['performance', 'slow', 'latency', 'optimize', 'speed'], skills: ['performance-engineer', 'performance-thinker', 'sre-engineer', 'observability-engineer'] },
};

function classifyWorkType(text) {
  const lower = String(text || '').toLowerCase();
  const hits = [];
  for (const [wt, def] of Object.entries(WORKTYPE_KEYWORDS)) {
    for (const kw of def.intents) {
      if (lower.includes(kw)) { hits.push({ workType: wt, keyword: kw, skills: def.skills }); break; }
    }
  }
  const scope = /\b(refactor|restructure|migrate|rewrite)\b/.test(lower) ? 'PLANNED' : (/\b(fix|debug|patch|hotfix)\b/.test(lower) ? 'UNPLANNED' : 'PLANNED');
  const risk = /\b(prod|production|deploy|release|delete|destroy)\b/.test(lower) ? 'HIGH' : (/\b(api|auth|security|db|database)\b/.test(lower) ? 'MEDIUM' : 'LOW');
  return { workTypes: hits, scope, risk };
}

async function auto(cwd, opts, args) {
  const log = opts.logger;
  const text = (args && args.length > 0) ? args.join(' ') : (opts.message || '');
  if (!text) {
    log.error('  Usage: synarc auto <task description>');
    log.info('  Example: synarc auto refactor the auth module');
    return { code: config.EXIT.INVALID_ARGS };
  }
  const userCfg = configLoader.loadConfig(cwd);
  const autoEnabled = !(userCfg && userCfg.config && userCfg.config.auto === false);
  if (!autoEnabled && !opts.auto) {
    if (!opts.json) log.info('  auto is disabled in synarc.config.js; pass --auto to force');
    return { code: config.EXIT.OK, skipped: true, reason: 'auto disabled' };
  }
  const cls = classifyWorkType(text);
  const skills = Array.from(new Set(cls.workTypes.flatMap((h) => h.skills)));
  if (!skills.includes('synarc-core')) skills.unshift('synarc-core');
  const manifest = {
    classified_at: new Date().toISOString(),
    message: text,
    workTypes: cls.workTypes.map((h) => ({ name: h.workType, matched: h.keyword })),
    scope: cls.scope,
    risk: cls.risk,
    skills,
    synarc_version: config.PACK_VERSION,
  };
  if (!opts.json) {
    log.header('Synarc Universal v' + config.PACK_VERSION + ' - Smart Auto');
    log.info('  Message:   ' + text);
    log.info('  WorkTypes: ' + (cls.workTypes.length ? cls.workTypes.map((h) => h.workType + ' (via ' + h.keyword + ')').join(', ') : '(none detected)'));
    log.info('  Scope:     ' + cls.scope);
    log.info('  Risk:      ' + cls.risk);
    log.info('  Skills:    ' + skills.join(', '));
    log.info('');
  }
  const manifestPath = path.join(cwd, '.synarc', 'auto.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  if (opts.dryRun) {
    if (!opts.json) log.info('  [dry-run] manifest would be written to ' + manifestPath);
    return { code: config.EXIT.OK, ...manifest, dryRun: true };
  }
  if (!opts.noPrefetch) {
    if (!opts.json) log.info('  Prefetching ' + skills.length + ' skills...');
    const r = await loader.prefetch(skills, { synarcRoot: findSynarcRoot() });
    manifest.prefetch = { fetched: r.fetched, cached: r.cached, errors: r.errors };
    if (!opts.json) {
      log.info('  Fetched: ' + r.fetched + '    Cached: ' + r.cached + '    Errors: ' + r.errors.length);
      if (r.errors.length > 0) for (const e of r.errors) log.info('    ' + e.id + ': ' + e.error);
    }
  }
  if (!opts.noInstall) {
    if (!opts.json) log.info('');
    const ir = fresh(cwd, { ...opts, _mode: 'auto' });
    manifest.install = { code: ir.code, count: ir.results ? ir.results.length : 0 };
    if (!opts.json) log.info('');
    if (!opts.json) log.info('  Manifest: ' + manifestPath);
    return { code: ir.code, ...manifest };
  }
  if (!opts.json) log.info('  Manifest: ' + manifestPath);
  return { code: config.EXIT.OK, ...manifest };
}
// ===========================================================================
// global - install/uninstall synarc as a user-global tool
// ===========================================================================

/**
 * Set up synarc as a user-global tool.  On Windows/Linux/macOS:
 *  1. Installs a tiny shim to ~/.synarc/bin/synarc that re-invokes this CLI
 *  2. Prints the export line to add to your shell rc
 *  3. Writes a global AGENTS.md to ~/.config/opencode/AGENTS.md (for OpenCode global mode)
 *  4. Registers a global cache dir at ~/.synarc/cache/skills/
 *
 *   synarc global install
 *   synarc global uninstall
 *   synarc global status
 *   synarc global path
 */
const global_ = {
  home() { return process.env.SYNARC_HOME_DIR || path.join(os.homedir(), '.synarc'); },
  binDir() { return path.join(this.home(), 'bin'); },
  cacheDir() { return path.join(this.home(), 'cache', 'skills'); },
  opencodeDir() { return process.env.OPENCODE_CONFIG_DIR || path.join(os.homedir(), '.config', 'opencode'); },

  install(cwd, opts) {
    const log = opts.logger;
    const home = this.home();
    fs.mkdirSync(this.binDir(), { recursive: true });
    fs.mkdirSync(this.cacheDir(), { recursive: true });
    const cliPath = require.resolve(path.join(__dirname, '..', 'install.js'));
    const NL = String.fromCharCode(10);
    const shimBody =
      '#!/usr/bin/env node' + NL +
      '// Synarc global shim. Auto-generated.' + NL +
      'const { spawn } = require("node:child_process");' + NL +
      'const cli = ' + JSON.stringify(cliPath) + ';' + NL +
      'const args = process.argv.slice(2);' + NL +
      'const r = spawn(process.execPath, [cli, ...args], { stdio: "inherit" });' + NL +
      'r.on("exit", (c) => process.exit(c || 0));' + NL +
      'r.on("error", (e) => { console.error(e); process.exit(1); });' + NL;
    const shimPath = path.join(this.binDir(), 'synarc');
    fs.writeFileSync(shimPath, shimBody, 'utf-8');
    try { fs.chmodSync(shimPath, 0o755); } catch { /* windows */ }
    const synarcRoot = findSynarcRoot();
    const srcAGENTS = path.join(synarcRoot, 'AGENTS.md');
    const dstDir = this.opencodeDir();
    fs.mkdirSync(dstDir, { recursive: true });
    const dstAGENTS = path.join(dstDir, 'AGENTS.md');
    let copied = false;
    if (fs.existsSync(srcAGENTS)) { fs.copyFileSync(srcAGENTS, dstAGENTS); copied = true; }
    if (!opts.json) {
      log.header('Synarc Universal v' + config.PACK_VERSION + ' - Global install');
      log.info('  Home:    ' + home);
      log.info('  Shim:    ' + shimPath);
      log.info('  Cache:   ' + this.cacheDir());
      if (copied) log.info('  OpenCode global: ' + dstAGENTS);
      log.info('');
      log.info('  Add to your shell rc to use synarc from anywhere:');
      log.info('    export PATH="' + this.binDir() + ':$PATH"');
      log.info('    export SYNARC_GLOBAL_CACHE=1');
    }
    return { code: config.EXIT.OK, home, shim: shimPath, cacheDir: this.cacheDir(), opencode: dstAGENTS, copied };
  },

  uninstall(cwd, opts) {
    const log = opts.logger;
    if (!opts.yes) {
      log.info('  Re-run with --yes to remove the global install.');
      return { code: config.EXIT.INVALID_ARGS, aborted: true };
    }
    const home = this.home();
    const removed = [];
    const shim = path.join(this.binDir(), 'synarc');
    if (fs.existsSync(shim)) { try { fs.unlinkSync(shim); removed.push(shim); } catch {} }
    try { fs.rmSync(home, { recursive: true, force: true }); removed.push(home); } catch {}
    if (!opts.json) {
      log.header('Synarc Universal v' + config.PACK_VERSION + ' - Global uninstall');
      for (const r of removed) log.info('  removed ' + r);
    }
    return { code: config.EXIT.OK, removed };
  },

  status(cwd, opts) {
    const log = opts.logger;
    const home = this.home();
    const shim = path.join(this.binDir(), 'synarc');
    const hasShim = fs.existsSync(shim);
    const hasCache = fs.existsSync(this.cacheDir());
    if (!opts.json) {
      log.header('Synarc Universal v' + config.PACK_VERSION + ' - Global status');
      log.info('  Home:    ' + home);
      log.info('  Shim:    ' + (hasShim ? 'present' : 'absent') + '  (' + shim + ')');
      log.info('  Cache:   ' + (hasCache ? 'present' : 'absent') + '  (' + this.cacheDir() + ')');
      if (hasShim) { log.info(''); log.info('  Use: export PATH="' + this.binDir() + ':$PATH"'); }
      else { log.info(''); log.info('  Not installed. Run: synarc global install'); }
    }
    return { code: config.EXIT.OK, home, hasShim, hasCache };
  },

  path(cwd, opts) {
    if (opts.json) return { code: config.EXIT.OK, home: this.home(), bin: this.binDir(), cache: this.cacheDir() };
    process.stdout.write(this.home() + String.fromCharCode(10));
    return { code: config.EXIT.OK };
  },
};
// audit subcommand group
// ===========================================================================

const audit = {
  verify(cwd, opts) {
    const log = opts.logger;
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Audit Verify");
      log.info("  \u2714 audit chain integrity check is a no-op in v6.6.1");
      log.info("  \u2714 (the audit trail ships in v6.7.0)");
    }
    return { code: config.EXIT.OK, ok: true, note: "audit chain integrity check is a no-op in v6.6.1" };
  },

  export(cwd, opts, args = {}) {
    const log = opts.logger;
    const format = args.format || "json";
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Audit Export");
      log.info("  Format: " + format);
      log.info("  \u2714 (no audit records to export in v6.6.1; trail ships in v6.7.0)");
    }
    return { code: config.EXIT.OK, format, records: [] };
  },

  rollback(cwd, opts, contractId) {
    const log = opts.logger;
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Audit Rollback");
      log.info("  Contract: " + (contractId || "(none)"));
      log.info("  \u2714 (rollback ships in v6.7.0)");
    }
    return { code: config.EXIT.OK, rolledBack: false, note: "rollback ships in v6.7.0" };
  },
};

// ===========================================================================
// ledger subcommand group
// ===========================================================================

const ledger = {
  tail(cwd, opts, args = {}) {
    const log = opts.logger;
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Ledger tail");
      log.info("  (no ledger entries yet; the ledger is written by the runtime)");
    }
    return { code: config.EXIT.OK, entries: [] };
  },

  query(cwd, opts, args = {}) {
    const log = opts.logger;
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Ledger query");
      log.info("  Query: " + JSON.stringify(args));
      log.info("  (no ledger entries yet; the ledger is written by the runtime)");
    }
    return { code: config.EXIT.OK, entries: [] };
  },

  show(cwd, opts, id) {
    const log = opts.logger;
    if (!opts.json) {
      log.header("Synarc Universal v" + config.PACK_VERSION + " - Ledger show");
      log.info("  ID: " + (id || "(none)"));
      log.info("  (no ledger entry found; the ledger is written by the runtime)");
    }
    return { code: config.EXIT.OK, entry: null };
  },
};

module.exports = {
  findSynarcRoot,
  resolveTargets,
  installAll,
  fresh,
  add,
  remove,
  uninstall,
  refresh,
  verify,
  auto,
  classifyWorkType,
  global: global_,
  status,
  doctor,
  init,
  info,
  upgrade,
  migrateV5,
  list,
  audit,
  ledger,
  cache: cache_,
  skill,
};
