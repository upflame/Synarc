#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal \u2014 content-addressable skill cache.
 * Skills are SHA-256-keyed on disk, so the same content is never stored twice.
 *
 * Cache locations (in order of preference):
 *   1. <packRoot>/.cache/skills/<hash>/SKILL.md   \u2014 dev / source
 *   2. <cwd>/node_modules/.synarc-cache/skills/<hash>/SKILL.md   \u2014 project-local
 *   3. ~/.synarc/cache/skills/<hash>/SKILL.md    \u2014 user-global (SYNARC_GLOBAL_CACHE=1)
 *
 * @module synarc/cache
 */

const fs   = require("node:fs");
const path = require("node:path");
const os   = require("node:os");
const crypto = require("node:crypto");

const PACKAGE_NAME = "synarc";

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function defaultLocations() {
  const home = os.homedir();
  return {
    user:  path.join(home, ".synarc", "cache", "skills"),
    pack:  null, // resolved at runtime from findSynarcRoot()
    project: path.join(process.cwd(), "node_modules", ".synarc-cache", "skills"),
  };
}

function findSynarcRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, "skills", "_index.json"))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function migrateLegacyLayout(dir) {
  // v6.7 used <first2>/<rest62>/SKILL.md. v6.7.1+ uses flat <fullhash>/SKILL.md.
  // Move any legacy entries to the new layout. Best-effort, idempotent.
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const it of items) {
    if (!it.isDirectory() || it.name.length !== 2) continue;
    const shard = path.join(dir, it.name);
    let inner;
    try { inner = fs.readdirSync(shard, { withFileTypes: true }); } catch { continue; }
    for (const j of inner) {
      if (!j.isDirectory() || j.name.length !== 62) continue;
      const oldDir = path.join(shard, j.name);
      const newDir = path.join(dir, it.name + j.name);
      try {
        fs.mkdirSync(newDir, { recursive: true });
        for (const k of fs.readdirSync(oldDir)) {
          const srcFile = path.join(oldDir, k);
          const dstFile = path.join(newDir, k);
          if (!fs.existsSync(dstFile)) fs.renameSync(srcFile, dstFile);
        }
        fs.rmdirSync(oldDir);
      } catch { /* best-effort */ }
    }
    try { fs.rmdirSync(shard); } catch { /* may not be empty */ }
  }
}

function resolveCacheDir(opts = {}) {
  // 1. Explicit override
  if (opts.cacheDir) return opts.cacheDir;

  const forceGlobal = process.env.SYNARC_GLOBAL_CACHE === "1";
  const forceLocal  = process.env.SYNARC_LOCAL_CACHE  === "1";

  const synarcRoot = opts.synarcRoot || findSynarcRoot();
  const isInSource = synarcRoot && process.cwd().startsWith(synarcRoot);

  const locations = defaultLocations();

  // In source/dev: use the pack's .cache/ (so maintainers don't pollute the repo)
  if (isInSource && !forceGlobal && !forceLocal) {
    const d = path.join(synarcRoot, ".cache", "skills");
  migrateLegacyLayout(d);
  return d;
  }

  // User-global if requested
  if (forceGlobal) { migrateLegacyLayout(locations.user); return locations.user; }

  migrateLegacyLayout(locations.project);
  return locations.project;
}

function cachePath(cacheDir, hash) {
  if (!/^[0-9a-f]{64}$/i.test(hash)) throw new Error("invalid cache hash: " + hash);
  return path.join(cacheDir, hash, "SKILL.md");
}

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function read(hash, opts = {}) {
  const dir = resolveCacheDir(opts);
  const p = cachePath(dir, hash);
  if (!fs.existsSync(p)) return null;
  const buf = fs.readFileSync(p);
  // Verify content hash on every read
  if (sha256(buf) !== hash) {
    // Corrupted entry \u2014 remove and report miss
    try { fs.unlinkSync(p); } catch { /* */ }
    return null;
  }
  return { path: p, content: buf.toString("utf-8"), bytes: buf.length, hash };
}

function write(content, opts = {}) {
  const hash = sha256(Buffer.from(content, "utf-8"));
  const dir = resolveCacheDir(opts);
  const p = cachePath(dir, hash);
  if (fs.existsSync(p)) {
    return { path: p, hash, bytes: Buffer.byteLength(content, "utf-8"), cached: true };
  }
  ensureDir(p);
  fs.writeFileSync(p, content, "utf-8");
  return { path: p, hash, bytes: Buffer.byteLength(content, "utf-8"), cached: false };
}

function status(opts = {}) {
  const dir = resolveCacheDir(opts);
  if (!fs.existsSync(dir)) {
    return { dir, exists: false, entries: 0, bytes: 0 };
  }
  // Walk the 2-level directory
  let entries = 0, bytes = 0;
  const walk = (d) => {
    let items;
    try { items = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const it of items) {
      const full = path.join(d, it.name);
      if (it.isDirectory()) walk(full);
      else if (it.isFile()) {
        entries++;
        try { bytes += fs.statSync(full).size; } catch { /* */ }
      }
    }
  };
  walk(dir);
  return { dir, exists: true, entries, bytes };
}

function clear(opts = {}) {
  const dir = resolveCacheDir(opts);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return { dir, removed: true };
}

function verify(opts = {}) {
  const dir = resolveCacheDir(opts);
  if (!fs.existsSync(dir)) {
    return { dir, ok: true, checked: 0, corrupted: 0, missing: 0 };
  }
  let checked = 0, corrupted = 0, missing = 0;
  const walk = (d) => {
    let items;
    try { items = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const it of items) {
      const full = path.join(d, it.name);
      if (it.isDirectory()) walk(full);
      else if (it.isFile() && it.name === "SKILL.md") {
        checked++;
        const buf = fs.readFileSync(full);
        // Flat layout: parent dir name IS the full SHA-256 hash.
        const expected = path.basename(path.dirname(full)).toLowerCase();
        const actual = sha256(buf).toLowerCase();
        if (actual !== expected) {
          corrupted++;
          try { fs.unlinkSync(full); } catch { /* */ }
        }
      }
    }
  };
  walk(dir);
  return { dir, ok: corrupted === 0, checked, corrupted, missing };
}

function pathFor(opts = {}) {
  return resolveCacheDir(opts);
}

module.exports = {
  sha256,
  resolveCacheDir,
  cachePath,
  read,
  write,
  status,
  clear,
  verify,
  pathFor,
  defaultLocations,
  findSynarcRoot,
};
