"use strict";
/**
 * Synarc Universal \u2014 SDK entry point
 * @module synarc
 *
 * ## Quick start
 *
 * ```js
 * // Programmatic install
 * const synarc = require("synarc");
 * const r = await synarc.install({ targets: ["cursor"] });
 *
 * // Programmatic verify
 * const v = await synarc.verify({ targets: ["cursor"] });
 *
 * // Programmatic doctor
 * const d = await synarc.doctor();
 *
 * // List skills / editors
 * const editors = synarc.list.editors();
 * const skills  = synarc.list.skills();
 *
 * // React to events via hooks
 * synarc.hooks.on("afterInstall", async (ctx) => {
 *   console.log("Installed:", ctx.results);
 * });
 *
 * // Auto-discover project config
 * const { config, path } = synarc.config.load();
 * ```
 *
 * ## CLI
 *
 * ```bash
 * synarc init                # scaffold synarc.config.js
 * synarc fresh               # install Synarc for detected editors
 * synarc verify              # check the install
 * synarc doctor              # environment diagnostics
 * synarc list                # browse skills and editors
 * synarc info                # show project + pack status
 * synarc add cursor          # extend an install
 * synarc remove cursor       # shrink an install
 * synarc uninstall           # clean removal
 * synarc upgrade             # upgrade with migration
 * synarc audit verify        # verify the audit chain
 * synarc audit export        # export compliance report
 * synarc ledger tail         # tail the session ledger
 * ```
 */

const path = require("node:path");
const fs   = require("node:fs");

// Internal modules
const commands      = require("./commands");
const { listEditors, getEditor, detectMarkers, editors } = require("./editors");
const { writeLock, readLock, lockPath } = require("./lockfile");
const { makeLogger } = require("./logger");
const configModule  = require("./config");
const configLoader  = require("./config-loader");
const { globalBus, HookBus, EVENTS } = require("./events");
const { logo, version: getVersion, welcome, statusCard, table, progressBar } = require("./ui");
const { configFile: configFile, INTRO_TEXT } = require("./templates");
const cache   = require("./cache");
const fetcher = require("./fetcher");
const loader  = require("./loader");

// ---------------------------------------------------------------------------
// Opts normalizer
// ---------------------------------------------------------------------------

function toOpts(opts) {
  return {
    target:  opts.targets  || opts.target,
    global:  Boolean(opts.global),
    yes:     Boolean(opts.yes || opts.nonInteractive),
    dryRun:  Boolean(opts.dryRun),
    json:    Boolean(opts.json),
    verbose: Boolean(opts.verbose),
    quiet:   Boolean(opts.quiet),
    logger:  makeLogger({
      json: opts.json, quiet: opts.quiet, verbose: opts.verbose,
    }),
    _mode: opts._mode || "install",
  };
}

function normalizeTargets(targets) {
  if (!targets) return null;
  if (targets === "all") return listEditors().map(e => e.id);
  if (typeof targets === "string") return [targets];
  return targets;
}

// ---------------------------------------------------------------------------
// Core SDK verbs
// ---------------------------------------------------------------------------

async function install(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts({ ...opts, targets: normalizeTargets(opts.targets), _mode: "install" });
  if (o.target && o.target.includes("all")) o.target = listEditors().map(e => e.id);
  if (o.target && !Array.isArray(o.target)) o.target = [o.target];
  await globalBus.emit("beforeInstall", { cwd, opts: o });
  const result = await commands.fresh(cwd, o);
  await globalBus.emit("afterInstall", { cwd, opts: o, result });
  return result;
}

async function verify(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts({ ...opts, targets: normalizeTargets(opts.targets) });
  await globalBus.emit("beforeVerify", { cwd, opts: o });
  const result = await commands.verify(cwd, o);
  await globalBus.emit("afterVerify", { cwd, opts: o, result });
  return result;
}

async function detect(cwd = process.cwd()) {
  return Array.from(detectMarkers(cwd));
}

async function doctor(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  await globalBus.emit("beforeDoctor", { cwd, opts: o });
  const result = await commands.doctor(cwd, o);
  await globalBus.emit("afterDoctor", { cwd, opts: o, result });
  return result;
}

async function status(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.status(cwd, o);
}

async function add(targets, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.add(cwd, o, Array.isArray(targets) ? targets : [targets]);
}

async function remove(targets, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.remove(cwd, o, Array.isArray(targets) ? targets : [targets]);
}

async function migrateV5(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.migrateV5(cwd, o);
}

async function uninstall(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.uninstall(cwd, o);
}

async function upgrade(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.upgrade(cwd, o);
}

async function info(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.info(cwd, o);
}

async function init(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const o = toOpts(opts);
  return commands.init(cwd, o);
}

// ---------------------------------------------------------------------------
// Subcommand groups
// ---------------------------------------------------------------------------

const audit = {
  async verify(opts = {}) { return commands.audit.verify(opts.cwd || process.cwd(), toOpts(opts)); },
  async export(opts = {}) { return commands.audit.export(opts.cwd || process.cwd(), toOpts(opts), opts); },
  async rollback(opts = {}) { return commands.audit.rollback(opts.cwd || process.cwd(), toOpts(opts), opts.contractId); },
};

const ledger = {
  async tail(opts = {})  { return commands.ledger.tail(opts.cwd || process.cwd(), toOpts(opts), opts); },
  async query(opts = {}) { return commands.ledger.query(opts.cwd || process.cwd(), toOpts(opts), opts); },
  async show(opts = {})  { return commands.ledger.show(opts.cwd || process.cwd(), toOpts(opts), opts.id); },
};

const list = {
  editors: () => listEditors(),
  skills:  () => {
    const r = commands.list(process.cwd(), {}, "skills");
    return r.skills;
  },
};

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

const PACK_VERSION = configModule.PACK_VERSION;
const PACK_NAME    = configModule.PACK_NAME;
const SCHEMA       = configModule.SCHEMA;

module.exports = {
  // Core SDK
  install,
  verify,
  detect,
  doctor,
  status,
  add,
  remove,
  migrateV5,
  uninstall,
  upgrade,
  info,
  init,

  // Subcommand groups
  audit,
  ledger,
  list,

  // Hooks
  hooks: {
    on:    (event, handler) => globalBus.on(event, handler),
    off:   (event, handler) => globalBus.off(event, handler),
    bus:   globalBus,
    EVENTS,
  },

  // Config
  config: {
    load:         (cwd) => configLoader.loadConfig(cwd),
    find:         (cwd) => configLoader.findConfig(cwd),
    validate:     (config) => configLoader.validateConfig(config),
    defaults:     configLoader.DEFAULTS,
    render:       configFile,
  },

  // Lock file
  lock: { read: readLock, write: writeLock, path: lockPath },

  // UI helpers (for advanced consumers building their own CLI)
  ui: { logo, version: getVersion, welcome, statusCard, table, progressBar },

  // Re-exports
  PACK_VERSION,
  PACK_NAME,
  SCHEMA,
  editors: listEditors,
  getEditor,

  // Intro text
  intro: INTRO_TEXT,

  // Lean npm: lazy-load skills from GitHub (v6.7+)
  cache,
  fetcher,
  loader,

  // For tests / advanced use
  _internal: { commands, config: configModule, HookBus, cache, fetcher, loader },
};
