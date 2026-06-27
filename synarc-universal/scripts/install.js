#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal CLI - v6.6.1
 * Bin: `synarc` / `npx synarc`
 *
 * Backwards compatible with v6.5.0 verb set. Adds:
 *   init, info, upgrade, uninstall, audit (verify|export|rollback),
 *   ledger (tail|query|show), hooks, synarc.config.js loader.
 *
 * @module synarc
 */

const fs   = require("node:fs");
const path = require("node:path");

const lib           = require("./lib");
const commands      = lib._internal.commands;
const config        = lib._internal.config;
const { makeLogger } = require("./lib/logger");
const { listEditors, detectMarkers } = require("./lib/editors");
const ui            = require("./lib/ui");

// ----------------------------------------------------------------------------
// Argv parsing
// ----------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { _positional: [], target: [], flags: {} };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target" || a === "-t") { out.target.push(argv[++i]); continue; }
    if (a.startsWith("--target="))      { out.target.push(a.slice("--target=".length)); continue; }
    if (a === "--all")                  { out.target.push("all"); continue; }
    if (a === "--keep")                 { if (!out.flags.keep) out.flags.keep = []; out.flags.keep.push(argv[++i]); continue; }
    if (a === "--global" || a === "-g") { out.flags.global = true; continue; }
    if (a === "--yes" || a === "-y" || a === "--no-interaction") { out.flags.yes = true; continue; }
    if (a === "--dry-run" || a === "-n") { out.flags.dryRun = true; continue; }
    if (a === "--json")                 { out.flags.json = true; continue; }
    if (a === "--verbose" || a === "-v"){ out.flags.verbose = true; continue; }
    if (a === "--quiet" || a === "-q")  { out.flags.quiet = true; continue; }
    if (a === "--no-color")             { process.env.NO_COLOR = "1"; continue; }
    if (a === "--skip-postinstall")     { out.flags.skipPostinstall = true; continue; }
    if (a === "--postinstall")          { out.flags.postinstall = true; continue; }
    if (a === "--help" || a === "-h")   { out.flags.help = true; continue; }
    if (a === "--version" || a === "-V"){ out.flags.version = true; continue; }
    if (a === "--force")                { out.flags.force = true; continue; }
    if (a === "--soft")                { out.flags.soft = true; continue; }
    if (a === "--hard")                { out.flags.hard = true; continue; }
    if (a === "--keep-cache")         { out.flags.keepCache = true; continue; }
    if (a === "--keep-config")        { out.flags.keepConfig = true; continue; }
    if (a === "--no-prefetch")         { out.flags.noPrefetch = true; continue; }
    if (a === "--no-install")          { out.flags.noInstall = true; continue; }
    if (a === "--full")                { out.flags.full = true; continue; }
    if (a === "--auto")                { out.flags.auto = true; continue; }
    if (a === "--message")             { out.flags.message = argv[++i]; continue; }
    if (a === "--ref")                   { out.flags.ref = argv[++i]; continue; }
    if (a.startsWith("--ref="))          { out.flags.ref = a.slice("--ref=".length); continue; }
    if (a.startsWith("--"))             { out.flags[a.slice(2)] = true; continue; }
    out._positional.push(a);
  }
  return out;
}

const argv = parseArgs(process.argv);

// ----------------------------------------------------------------------------
// Flags
// ----------------------------------------------------------------------------

function printVersion() {
  console.log("synarc " + config.PACK_VERSION + " (" + config.PACK_NAME + ")");
}

function printHelp() {
  const help = [
    "",
    "  " + ui.logo(),
    "",
    "  " + require("picocolors").bold("Synarc Universal v" + config.PACK_VERSION) + " \u2014 The Cognition Mesh for AI-assisted engineering",
    "",
    "  Usage:",
    "    synarc [verb] [args] [flags]",
    "    synarc [flags]                  # install for auto-detected editors",
    "",
    "  Getting started:",
    "    synarc init                     # scaffold synarc.config.js",
    "    synarc fresh                    # install for detected editors",
    "    synarc verify                   # check the install",
    "    synarc doctor                   # environment diagnostics",
    "    synarc info                     # project + pack status",
    "",
    "  Install verbs:",
    "    fresh [target...]               Fresh install into a project",
    "    refresh [--target ...]          Re-run install for current lock (idempotent)",
    "    add <editor>...                 Add an editor to an existing install",
    "    remove <editor>...              Remove an editor from a project",
    "    uninstall [--soft|--hard]       Remove editors + lock; --soft keeps cache+config",
    "    uninstall --keep <editor>       Remove all editors except the named ones",
    "    auto <message>                  Smart WorkType classification + on-demand install",
    "    upgrade                         Upgrade with migration",
    "    migrate-v5                      Convert legacy v5 plugin files",
    "",
    "  Verify & inspect:",
    "    verify                          Check that the install is intact",
    "    status                          Read the lock file (no writes)",
    "    doctor                          Environment diagnostics",
    "    info                            Pretty project + pack status card",
    "    list [editors|skills]           List editors or skills",
    "",
    "  Subsystems:",
    "    global install                  Install synarc as a user-global tool (~/.synarc/)",
    "    global uninstall                Remove the global install",
    "    global status                   Show the global install state",
    "    cache status                    Show the content-addressable skill cache",
    "    cache path                      Print the cache directory path",
    "    cache verify                    Verify and repair cache entries (SHA-256)",
    "    cache clear --yes               Remove the cache",
    "    cache prefetch [ids...]         Download skills from GitHub into the cache",
    "    skill list [cached|available]   List the 56 skills (with cache status)",
    "    skill get <id> [id...]          Print SKILL.md content to stdout",
    "    skill show <id>                 Show a skill summary",
    "    skill install <id> [--full]     Copy a SKILL.md to .synarc/skills/ in this project",
    "    audit verify                    Verify the audit chain",
    "    audit export --format <f>       Export compliance report",
    "    audit rollback <contract-id>    Rollback to an intent contract",
    "    ledger tail                     Tail the session ledger",
    "    ledger query [flags]            Query the ledger",
    "    ledger show <id>                Show one ledger entry",
    "",
    "  Flags:",
    "    --target <id>                   Repeatable. Use 'all' for every editor.",
    "    --global                        Install to home dir (use synarc global install for true global)",
    "    --yes, -y                       Skip confirmation prompts",
    "    --dry-run, -n                   Plan, but do not write",
    "    --json                          Machine-readable JSON on stdout",
    "    --verbose, -v                   Show every file path and decision",
    "    --quiet, -q                     Suppress non-error output",
    "    --no-color                      Disable ANSI colors",
    "    --force                         Overwrite existing files",
    "    --ref <ref>                      Git ref for cache/skill prefetch (overrides SYNARC_GH_REF)",
    "    --soft, --hard, --keep-cache, --keep-config   Uninstall modes (see synarc uninstall --help)",
    "    --help, -h                      Show this help",
    "    --version, -V                   Show version",
    "",
    "  Examples:",
    "    " + require("picocolors").cyan("synarc") + "                              # interactive picker",
    "    " + require("picocolors").cyan("synarc init") + "                         # scaffold config",
    "    " + require("picocolors").cyan("synarc fresh --target all --yes") + "    # install for every editor",
    "    " + require("picocolors").cyan("synarc add cursor windsurf") + "         # extend an install",
    "    " + require("picocolors").cyan("synarc verify --json") + "               # CI-friendly verification",
    "    " + require("picocolors").cyan("synarc doctor") + "                       # environment diagnostics",
    "    " + require("picocolors").cyan("synarc info") + "                         # pretty status card",
    "",
    "  Programmatic:",
    "    const synarc = require('" + (config.PACK_NAME || "synarc") + "');",
    "    await synarc.install({ targets: ['cursor'] });",
    "    await synarc.verify();",
    "    synarc.hooks.on('afterInstall', async (ctx) => { /* ... */ });",
    "",
    "  Docs: " + require("picocolors").underline("https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs"),
    "",
  ];
  console.log(help.join("\n"));
}

if (argv.flags.version) { printVersion(); process.exit(0); }
if (argv.flags.help)    { printHelp();    process.exit(0); }

// ----------------------------------------------------------------------------
// Logger
// ----------------------------------------------------------------------------

const logger = makeLogger({
  json:    argv.flags.json,
  quiet:   argv.flags.quiet,
  verbose: argv.flags.verbose,
});

// ----------------------------------------------------------------------------
// Target resolution
// ----------------------------------------------------------------------------

function resolveTargets() {
  if (argv.target.length === 0) return null;
  if (argv.target.includes("all")) return listEditors().map(e => e.id);
  return argv.target.slice();
}

function toOpts() {
  return {
    target:  resolveTargets() || [],
    global:  Boolean(argv.flags.global),
    yes:     Boolean(argv.flags.yes),
    force:   Boolean(argv.flags.force),
    dryRun:  Boolean(argv.flags.dryRun),
    json:    Boolean(argv.flags.json),
    verbose: Boolean(argv.flags.verbose),
    quiet:   Boolean(argv.flags.quiet),
    ref:         argv.flags.ref || null,
    soft:        Boolean(argv.flags.soft),
    hard:        Boolean(argv.flags.hard),
    keepCache:   Boolean(argv.flags.keepCache),
      keepCache:   Boolean(argv.flags.keepCache),
      keepConfig:  Boolean(argv.flags.keepConfig),
      keep:        (argv.flags.keep && argv.flags.keep.length) ? argv.flags.keep.slice() : [],
    noPrefetch:  Boolean(argv.flags.noPrefetch),
    noInstall:   Boolean(argv.flags.noInstall),
    full:        Boolean(argv.flags.full),
    auto:        Boolean(argv.flags.auto),
    message:     argv.flags.message || null,
    logger,
  };
}

// ----------------------------------------------------------------------------
// Postinstall (called by npm postinstall hook)
// ----------------------------------------------------------------------------

function runPostinstall(cwd) {
  if (argv.flags.postinstall) {
    // Quiet postinstall: detect, install if markers present, write welcome hint.
    const log = logger;
    const detected = detectMarkers(cwd);
    if (detected.size > 0) {
      // Auto-install for detected editors, non-interactively
      try {
        const r = commands.fresh(cwd, { ...toOpts(), yes: true, target: Array.from(detected), _mode: "postinstall" });
        if (r.lock && r.lock.ok) {
          log.info("synarc: " + r.results.filter(x => x.ok).length + "/" + r.results.length + " editors wired automatically");
        }
      } catch { /* best-effort */ }
    } else {
      // No markers \u2014 write a hint file so we know postinstall ran
      try {
        const hintDir = path.join(cwd, ".synarc");
        fs.mkdirSync(hintDir, { recursive: true });
        fs.writeFileSync(
          path.join(hintDir, "installed.json"),
          JSON.stringify({ installed_at: new Date().toISOString(), version: config.PACK_VERSION, next: "Run `npx synarc fresh` to wire editors." }, null, 2) + "\n",
          "utf-8"
        );
      } catch { /* best-effort */ }
    }
    return { code: 0, results: [] };
  }
  if (argv.flags.skipPostinstall) return { code: 0, results: [] };
  return null;
}

// ----------------------------------------------------------------------------
// Interactive picker
// ----------------------------------------------------------------------------

async function interactivePicker(cwd) {
  let clack;
  try { clack = require("@clack/prompts"); }
  catch {
    logger.error("@clack/prompts is not installed. Run `npm install` in synarc-universal/.");
    process.exit(config.EXIT.FAIL);
  }
  const detected = detectMarkers(cwd);
  const editors = listEditors();

  clack.intro(ui.logo() + " \u2014 v" + config.PACK_VERSION);
  const action = await clack.select({
    message: "What do you want to do?",
    options: [
      { value: "fresh",      label: "Fresh install",         hint: "Install Synarc into this project" },
      { value: "add",        label: "Add an editor",         hint: "Extend an existing install" },
      { value: "remove",     label: "Remove an editor",      hint: "Drop a previously installed editor" },
      { value: "uninstall",  label: "Uninstall all",         hint: "Remove every editor and the lock file" },
      { value: "init",       label: "Init synarc.config.js", hint: "Scaffold a project config" },
      { value: "verify",     label: "Verify install",        hint: "Check the install is intact" },
      { value: "doctor",     label: "Doctor",                hint: "Environment diagnostics" },
      { value: "info",       label: "Info",                  hint: "Pretty project + pack status card" },
      { value: "migrate-v5", label: "Migrate from v5",       hint: "Convert legacy v5 plugin files" },
      { value: "list",       label: "List skills / editors", hint: "Browse the catalog" },
      { value: "cache",      label: "Cache",                 hint: "Show / verify / clear the content cache" },
      { value: "skill",      label: "Skills",                hint: "List, get, install, or prefetch skills" },
      { value: "refresh",    label: "Refresh",               hint: "Re-run install for current lock (idempotent)" },
      { value: "auto",       label: "Auto (smart)",          hint: "Classify task + install matching skills" },
      { value: "global",     label: "Global",                hint: "Install synarc as a user-global tool" },
      { value: "upgrade",    label: "Upgrade",               hint: "Show changelog and run migration" },
      { value: "exit",       label: "Exit" },
    ],
  });
  if (clack.isCancel(action) || action === "exit") {
    clack.outro("Cancelled.");
    process.exit(0);
  }

  if (action === "cache") return { verb: "cache", args: ["status"] };
  if (action === "skill") return { verb: "skill", args: ["list"] };
  if (action === "refresh") return { verb: "refresh", args: [] };
  if (action === "global") return { verb: "global", args: ["status"] };
  if (action === "auto") return { verb: "auto", args: [] };
  if (action === "list") {
    const kind = await clack.select({
      message: "List what?",
      options: [
        { value: "editors", label: "Editors", hint: "8 supported AI coding agents" },
        { value: "skills",  label: "Skills",  hint: "56 domain skills" },
      ],
    });
    if (clack.isCancel(kind)) { clack.outro("Cancelled."); process.exit(0); }
    return { verb: "list", args: [kind] };
  }

  if (action === "init")        return { verb: "init",        args: [] };
  if (action === "info")        return { verb: "info",        args: [] };
  if (action === "upgrade")     return { verb: "upgrade",     args: [] };
  if (action === "verify")      return { verb: "verify",      args: [] };
  if (action === "doctor")      return { verb: "doctor",      args: [] };
  if (action === "migrate-v5")  return { verb: "migrate-v5",  args: [] };
  if (action === "uninstall")   return { verb: "uninstall",   args: [] };

  // fresh, add, remove
  if (detected.size > 0) {
    logger.info("Detected markers: " + Array.from(detected).join(", "));
  }
  const ids = await clack.multiselect({
    message: "Which editors? (space to toggle, enter to confirm)",
    options: editors.map(e => ({
      value: e.id,
      label: e.label,
      hint:  e.description + (detected.has(e.id) ? "  (detected)" : ""),
    })),
    initialValues: detected.size > 0 ? Array.from(detected) : ["codex", "opencode"],
  });
  if (clack.isCancel(ids)) { clack.outro("Cancelled."); process.exit(0); }
  return { verb: action, args: Array.isArray(ids) ? ids : [] };
}

// ----------------------------------------------------------------------------
// Dispatch
// ----------------------------------------------------------------------------

function run() {
  const cwd = argv.flags.global
    ? (process.env.SYNARC_GLOBAL_DIR || process.env.USERPROFILE || process.env.HOME || process.cwd())
    : process.cwd();

  // postinstall: hint + auto-install
  const pi = runPostinstall(cwd);
  if (pi) return pi;

  const verb = argv._positional[0];
  const rest = argv._positional.slice(1);

  // First-arg verbs
  if (verb === "fresh")      return commands.fresh(cwd, { ...toOpts(), _mode: "fresh" });
  if (verb === "refresh")    return commands.refresh(cwd, toOpts());
  if (verb === "auto")       return commands.auto(cwd, toOpts(), rest);
  if (verb === "add")        return commands.add(cwd, toOpts(), rest);
  if (verb === "remove")     return commands.remove(cwd, toOpts(), rest);
  if (verb === "uninstall")  return commands.uninstall(cwd, toOpts());
  if (verb === "verify")     return commands.verify(cwd, toOpts());
  if (verb === "status")     return commands.status(cwd, toOpts());
  if (verb === "doctor")     return commands.doctor(cwd, toOpts());
  if (verb === "info")       return commands.info(cwd, toOpts());
  if (verb === "init")       return commands.init(cwd, toOpts());
  if (verb === "upgrade")    return commands.upgrade(cwd, toOpts());
  if (verb === "migrate-v5") return commands.migrateV5(cwd, toOpts());
  if (verb === "list")       return commands.list(cwd, toOpts(), rest[0] || "editors");

  // Subcommand groups
  if (verb === "audit") {
    const sub = rest[0] || "verify";
    if (sub === "verify")  return commands.audit.verify(cwd, toOpts());
    if (sub === "export")  return commands.audit.export(cwd, toOpts(), { format: rest[1] || "json" });
    if (sub === "rollback")return commands.audit.rollback(cwd, toOpts(), rest[1]);
    return { code: config.EXIT.INVALID_ARGS };
  }
  if (verb === "ledger") {
    const sub = rest[0] || "tail";
    if (sub === "tail")  return commands.ledger.tail(cwd, toOpts(), {});
    if (sub === "query") return commands.ledger.query(cwd, toOpts(), { args: rest.slice(1) });
    if (sub === "show")  return commands.ledger.show(cwd, toOpts(), rest[1]);
    return { code: config.EXIT.INVALID_ARGS };
  }

  // Cache + skill subcommand groups (v6.7+ lean install)
  if (verb === "global") {
    const sub = rest[0] || "status";
    if (sub === "install")   return commands.global.install(cwd, toOpts());
    if (sub === "uninstall") return commands.global.uninstall(cwd, toOpts());
    if (sub === "status")    return commands.global.status(cwd, toOpts());
    if (sub === "path")      return commands.global.path(cwd, toOpts());
    return { code: config.EXIT.INVALID_ARGS };
  }
  if (verb === "cache") {
    const sub = rest[0] || "status";
    if (sub === "status")   return commands.cache.status(cwd, toOpts());
    if (sub === "path")     return commands.cache.path(cwd, toOpts());
    if (sub === "verify")   return commands.cache.verify(cwd, toOpts());
    if (sub === "clear")    return commands.cache.clear(cwd, toOpts());
    if (sub === "prefetch") return commands.cache.prefetch(cwd, toOpts(), rest.slice(1));
    return { code: config.EXIT.INVALID_ARGS };
  }
  if (verb === "skill") {
    const sub = rest[0] || "list";
    if (sub === "list")      return commands.skill.list(cwd, toOpts(), rest[1]);
    if (sub === "get")       return commands.skill.get(cwd, toOpts(), rest.slice(1));
    if (sub === "show")      return commands.skill.show(cwd, toOpts(), rest[1]);
    if (sub === "prefetch")  return commands.skill.prefetch(cwd, toOpts(), rest.slice(1));
    if (sub === "install")   return commands.skill.install(cwd, toOpts(), rest.slice(1));
    if (sub === "uninstall") return commands.skill.uninstall(cwd, toOpts(), rest.slice(1));
    return { code: config.EXIT.INVALID_ARGS };
  }
  // --verify alias
  if (argv.flags.verify) return commands.verify(cwd, toOpts());

  // --target all -> install for every supported editor
  if (argv.target.includes("all")) return commands.fresh(cwd, { ...toOpts(), target: listEditors().map(e => e.id), _mode: "all" });

  // --target <id>... without verb -> install for those
  if (argv.target.length > 0) return commands.fresh(cwd, { ...toOpts(), _mode: "targeted" });

  // Auto-detect markers -> install
  const detected = detectMarkers(cwd);
  if (detected.size > 0) return commands.fresh(cwd, { ...toOpts(), _mode: "auto" });

  // No markers, no flags: --yes / non-TTY -> AGENTS.md fallback; otherwise interactive picker
  if (!process.stdin.isTTY || argv.flags.yes) {
    return commands.fresh(cwd, { ...toOpts(), _mode: "default" });
  }

  // Interactive picker
  return Promise.resolve().then(async () => {
    const pick = await interactivePicker(cwd);
    argv._positional = [pick.verb, ...pick.args];
    return run();
  });
}

Promise.resolve()
  .then(run)
  .then(result => {
    if (!result) process.exit(0);
    // Show welcome screen for successful fresh install
    if (argv._positional[0] === "fresh" && result.code === 0 && !argv.flags.json && !argv.flags.quiet && !argv.flags.dryRun && result.results && result.results.length > 0) {
      const installed = result.results.filter(r => r.ok && (r.action === "installed" || r.action === "generated" || r.action === "appended" || r.copied > 0)).map(r => r.label || r.id);
      if (installed.length > 0) {
        console.log("");
        console.log(ui.welcome({ targets: installed, lockPath: result.lock && result.lock.path ? result.lock.path.replace(process.cwd(), ".") : null }));
      }
    }
    // JSON output
    if (argv.flags.json) {
      const out = {
        synarc_version: config.PACK_VERSION,
        node_version:   process.version,
        code:           result.code || 0,
        ...(result.results ? { results: result.results } : {}),
        ...(result.lock    ? { lock: result.lock }       : {}),
        ...(result.checks  ? { checks: result.checks }   : {}),
        ...(result.editors ? { editors: result.editors } : {}),
        ...(result.skills  ? { skills: result.skills }   : {}),
        ...(result.found   ? { found: result.found, migrated: result.migrated } : {}),
        ...(result.path    ? { path: result.path }       : {}),
        ...(result.detected ? { detected: result.detected } : {}),
        ...(result.entries ? { entries: result.entries } : {}),
        ...(result.synarcVersion ? { info: result }       : {}),
        // cache + skill verb outputs
        ...(result.dir      && result.exists !== undefined ? { dir: result.dir, exists: result.exists, entries: result.entries, bytes: result.bytes } : {}),
        ...(result.checked  !== undefined ? { checked: result.checked, corrupted: result.corrupted, ok: result.ok } : {}),
        ...(result.fetched  !== undefined ? { fetched: result.fetched, cached: result.cached, errors: result.errors, duration: result.duration } : {}),
        ...(result.skills   ? { skills: result.skills }   : {}),
        ...(result.count    !== undefined ? { count: result.count, totalBytes: result.totalBytes } : {}),
        ...(result.results  && Array.isArray(result.results) ? { results: result.results } : {}),
          ...(result.shim ? { shim: result.shim, home: result.home, cacheDir: result.cacheDir, opencode: result.opencode, copied: result.copied, removed: result.removed } : {}),
          ...(result.mode       ? { mode: result.mode } : {}),
          ...(result.workTypes  ? { workTypes: result.workTypes, scope: result.scope, risk: result.risk, message: result.message } : {}),
          ...(result.hasShim    !== undefined ? { hasShim: result.hasShim, hasCache: result.hasCache } : {}),
          ...(result.removed    ? { removed: result.removed } : {}),
          ...(result.skipped    ? { skipped: result.skipped, reason: result.reason } : {}),
                ...(result.aborted  ? { aborted: true, reason: result.reason, entries: result.entries, bytes: result.bytes } : {}),
      };
      console.log(JSON.stringify(out, null, 2));
    }
    process.exit(result.code || 0);
  })
  .catch(err => {
    if (argv.flags.json) {
      console.log(JSON.stringify({ error: err.message, code: config.EXIT.FAIL }));
    } else {
      logger.error("Error: " + err.message);
      if (argv.flags.verbose && err.stack) console.error(err.stack);
    }
    process.exit(config.EXIT.FAIL);
  });
