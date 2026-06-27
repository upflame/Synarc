#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal \u2014 skill loader.
 * Loads skill content from the local cache or from GitHub.
 * Source of truth = the catalog at `skills/_index.json` (ships in the npm package).
 *
 * @module synarc/loader
 */

const fs   = require("node:fs");
const path = require("node:path");
const cache    = require("./cache");
const fetcher  = require("./fetcher");
const { findSynarcRoot } = cache;

const BUNDLED_INDEX = "_index.json";
const BUNDLED_DIR   = "skills";
const REPO_PATH_PREFIX = process.env.SYNARC_REPO_PREFIX || "";
const DEFAULT_REF   = process.env.SYNARC_GH_REF || "main";

/**
 * Load the skill catalog.
 * @param {object} [opts]
 * @param {string} [opts.synarcRoot]
 * @returns {object} { ref, generated, skills: [{ id, hash, bytes, ref, path }] }
 */
function loadCatalog(opts = {}) {
  const root = opts.synarcRoot || findSynarcRoot();
  if (!root) {
    throw new Error("synarc root not found \u2014 cannot load skill catalog");
  }
  const indexPath = path.join(root, BUNDLED_DIR, BUNDLED_INDEX);
  if (!fs.existsSync(indexPath)) {
    throw new Error("skill catalog not found: " + indexPath);
  }
  const data = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  if (!data.skills || !Array.isArray(data.skills)) {
    throw new Error("skill catalog is malformed: missing 'skills' array");
  }
  return data;
}

/**
 * Resolve a single skill by id.
 * @param {string} id
 * @param {object} [opts]  { synarcRoot, ref, forceFetch, quiet, onProgress }
 * @returns {Promise<{ id, content, hash, source: "cache"|"bundled"|"fetched", bytes, duration? }>}
 */
async function loadSkill(id, opts = {}) {
  const catalog = loadCatalog(opts);
  const entry = catalog.skills.find((s) => s.id === id);
  if (!entry) {
    const e = new Error("unknown skill: " + id);
    e.code = "UNKNOWN_SKILL";
    throw e;
  }
  const ref = opts.ref || entry.ref || catalog.ref || DEFAULT_REF;

  // 1. Try cache
  if (!opts.forceFetch) {
    const hit = cache.read(entry.hash, { synarcRoot: opts.synarcRoot });
    if (hit) {
      return {
        id,
        content: hit.content,
        hash: hit.hash,
        bytes: hit.bytes,
        source: "cache",
        cachePath: hit.path,
      };
    }
  }

  // 2. Try the bundled source (for skills that ship in the npm package \u2014 just synarc-core)
  if (opts.synarcRoot) {
    const bundledPath = path.join(opts.synarcRoot, BUNDLED_DIR, id, "SKILL.md");
    if (fs.existsSync(bundledPath)) {
      const content = fs.readFileSync(bundledPath, "utf-8");
      const hash = cache.sha256(Buffer.from(content, "utf-8"));
      if (hash === entry.hash) {
        // Cache it for next time
        cache.write(content, { synarcRoot: opts.synarcRoot });
        return { id, content, hash, bytes: content.length, source: "bundled" };
      }
    }
  }

  // 3. Fetch from GitHub
  // Use the entry's own `path` from the catalog (which already encodes the full
  // repo-relative path, e.g. "synarc-universal/skills/foo/SKILL.md").  Fall back to
  // the legacy `skills/<id>/SKILL.md` layout if the catalog doesn\'t carry a path.
  const relPath = entry.path || `${BUNDLED_DIR}/${id}/SKILL.md`;
  const start = Date.now();
  const r = await fetcher.fetchWithRetry(relPath, {
    ref,
    onProgress: opts.onProgress,
  });
  // Verify content hash
  const hash = cache.sha256(Buffer.from(r.content, "utf-8"));
  if (hash !== entry.hash) {
    const e = new Error(
      `content hash mismatch for ${id}: expected ${entry.hash}, got ${hash} (ref=${ref})`
    );
    e.code = "HASH_MISMATCH";
    throw e;
  }
  // Cache it
  cache.write(r.content, { synarcRoot: opts.synarcRoot });
  return {
    id,
    content: r.content,
    hash,
    bytes: r.content.length,
    source: "fetched",
    fetchUrl: r.url,
    duration: r.duration,
  };
}

/**
 * Load multiple skills with progress reporting.
 * @param {string[]} ids
 * @param {object} [opts]  { synarcRoot, ref, forceFetch, onSkillDone, onProgress }
 * @returns {Promise<Array>}
 */
async function loadSkills(ids, opts = {}) {
  const out = [];
  for (const id of ids) {
    const skillOpts = {
      ...opts,
      onProgress: opts.onProgress ? (p) => opts.onProgress({ id, ...p }) : undefined,
    };
    const r = await loadSkill(id, skillOpts);
    out.push(r);
    if (opts.onSkillDone) opts.onSkillDone(r);
  }
  return out;
}

/**
 * Prefetch (warm the cache) for a list of skills.
 * @param {string[]} ids
 * @param {object} [opts]
 * @returns {Promise<{ fetched: number, cached: number, errors: Array }>}
 */
async function prefetch(ids, opts = {}) {
  let fetched = 0, cached = 0;
  const errors = [];
  for (const id of ids) {
    try {
      const r = await loadSkill(id, { ...opts, forceFetch: false });
      if (r.source === "fetched") fetched++;
      else cached++;
      if (opts.onSkillDone) opts.onSkillDone(r);
    } catch (err) {
      errors.push({ id, error: err.message, code: err.code });
      if (opts.onSkillDone) opts.onSkillDone({ id, error: err.message, code: err.code });
    }
  }
  return { fetched, cached, errors };
}

/**
 * Build a manifest of all skills in the catalog, with cache status.
 * @param {object} [opts]
 * @returns {Array<{ id, hash, bytes, source: "cache"|"bundled"|"missing" }>}
 */
function manifest(opts = {}) {
  const catalog = loadCatalog(opts);
  const out = [];
  for (const entry of catalog.skills) {
    const hit = cache.read(entry.hash, { synarcRoot: opts.synarcRoot });
    if (hit) {
      out.push({ ...entry, source: "cache", path: hit.path });
    } else {
      const bundledPath = opts.synarcRoot
        ? path.join(opts.synarcRoot, BUNDLED_DIR, entry.id, "SKILL.md")
        : null;
      if (bundledPath && fs.existsSync(bundledPath)) {
        out.push({ ...entry, source: "bundled", path: bundledPath });
      } else {
        out.push({ ...entry, source: "missing" });
      }
    }
  }
  return out;
}

module.exports = {
  loadCatalog,
  loadSkill,
  loadSkills,
  prefetch,
  manifest,
  BUNDLED_INDEX,
  BUNDLED_DIR,
  REPO_PATH_PREFIX,
  DEFAULT_REF,
};
