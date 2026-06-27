"use strict";
/**
 * Synarc Universal — config loader
 * Discovers and loads `synarc.config.js` from the project root.
 * Falls back to defaults if no config is present.
 *
 * The config file is the recommended way to declare per-project settings:
 *   - which skills to enable
 *   - which agents to install for
 *   - per-WorkType risk caps
 *   - custom guardrails
 *   - hooks
 *
 * @module synarc-universal/lib/config-loader
 */

const fs   = require("node:fs");
const path = require("node:path");

const CONFIG_FILENAMES = [
  "synarc.config.js",
  "synarc.config.mjs",
  "synarc.config.cjs",
  ".synarcrc.js",
  ".synarcrc",
  ".synarcrc.json",
];

const DEFAULTS = Object.freeze({
  /** Synarc version this config targets (semver range). */
  version: ">=6.0.0",
  /** Which editors to install for. */
  agents: null, // null = auto-detect
  /** Which skills to enable (null = all). */
  skills: null, // null = all 56
  /** Disable specific skills by id. */
  excludeSkills: [],
  /** Risk caps per WorkType. */
  riskCaps: {},
  /** Custom guardrails. */
  guardrails: [],
  /** Hooks for SDK consumers. */
  hooks: {},
  /** Telemetry: opt in/out. */
  telemetry: false,
  /** Experimental flags. */
  experimental: {},
});

/**
 * Walk up the directory tree looking for a config file.
 * Stops at the first hit. Returns null if none found.
 */
function findConfig(startDir) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 8; i++) {
    for (const name of CONFIG_FILENAMES) {
      const p = path.join(dir, name);
      if (fs.existsSync(p)) return p;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Load a config file. Caches in module.exports.
 * Returns { path, config, defaults, isDefault }.
 */
function loadConfig(cwd = process.cwd(), opts = {}) {
  const skipDiscovery = Boolean(opts.skipDiscovery);
  if (skipDiscovery) {
    return { path: null, config: { ...DEFAULTS }, defaults: DEFAULTS, isDefault: true };
  }
  const configPath = findConfig(cwd);
  if (!configPath) {
    return { path: null, config: { ...DEFAULTS }, defaults: DEFAULTS, isDefault: true };
  }
  try {
    // Bust require cache for hot-reload support
    delete require.cache[require.resolve(configPath)];
    const mod = require(configPath);
    const userConfig = (mod && mod.default) || mod || {};
    const merged = mergeConfig(DEFAULTS, userConfig);
    return { path: configPath, config: merged, defaults: DEFAULTS, isDefault: false };
  } catch (err) {
    return { path: configPath, config: { ...DEFAULTS }, defaults: DEFAULTS, isDefault: true, error: err.message };
  }
}

function mergeConfig(base, override) {
  const out = { ...base };
  for (const [k, v] of Object.entries(override || {})) {
    if (v == null) continue;
    if (k === "hooks" || k === "guardrails" || k === "riskCaps" || k === "experimental") {
      out[k] = { ...(base[k] || {}), ...v };
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Validate a config object. Returns { ok, errors }.
 * Light validation — full validation runs against the JSON Schema separately.
 */
function validateConfig(config) {
  const errors = [];
  if (config.agents != null) {
    if (!Array.isArray(config.agents)) {
      errors.push("agents must be an array of editor ids");
    } else {
      const known = new Set(["claude-code", "codex", "opencode", "cursor", "windsurf", "copilot", "gemini-cli", "cline"]);
      for (const a of config.agents) {
        if (!known.has(a)) errors.push(`unknown agent: ${a}`);
      }
    }
  }
  if (config.skills != null && !Array.isArray(config.skills)) {
    errors.push("skills must be an array of skill ids");
  }
  if (config.excludeSkills != null && !Array.isArray(config.excludeSkills)) {
    errors.push("excludeSkills must be an array of skill ids");
  }
  if (config.riskCaps != null && typeof config.riskCaps !== "object") {
    errors.push("riskCaps must be an object");
  }
  if (config.hooks != null && typeof config.hooks !== "object") {
    errors.push("hooks must be an object");
  }
  return { ok: errors.length === 0, errors };
}

module.exports = { findConfig, loadConfig, validateConfig, mergeConfig, DEFAULTS, CONFIG_FILENAMES };
