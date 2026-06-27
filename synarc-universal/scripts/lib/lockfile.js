"use strict";
/**
 * Synarc Universal — lock file
 * Records the exact install state of a project.
 * @module synarc-universal/lib/lockfile
 */

const fs = require("fs");
const path = require("path");

const LOCK_FILENAME = "synarc.lock.json";

function lockPath(cwd) {
  return path.join(cwd, LOCK_FILENAME);
}

function writeLock(cwd, results, mode) {
  const config = require("./config");
  const lock = {
    synarc_version: config.PACK_VERSION,
    schema:          config.SCHEMA,
    node_version:    process.version,
    installed_at:    new Date().toISOString(),
    mode,
    targets: results.map(r => ({
      id:    r.id,
      label: r.label,
      ok:    r.ok,
      action: r.action,
      path:  relative(cwd, r.path),
      bytes: r.bytes || 0,
      copied: r.copied,
      skipped: r.skipped,
      skills: r.skills,
      missing: r.missing,
      global: r.global,
      note:   r.note,
    })),
    summary: {
      pass:  results.filter(r => r.ok).length,
      fail:  results.filter(r => !r.ok).length,
      total: results.length,
    },
  };
  try {
    fs.writeFileSync(lockPath(cwd), JSON.stringify(lock, null, 2) + "\n", "utf-8");
    return { ok: true, path: lockPath(cwd), targets: lock.targets };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

function readLock(cwd) {
  try {
    const raw = fs.readFileSync(lockPath(cwd), "utf-8");
    return { ok: true, lock: JSON.parse(raw), path: lockPath(cwd) };
  } catch (err) {
    if (err.code === "ENOENT") return { ok: false, reason: "no lock file" };
    return { ok: false, reason: err.message };
  }
}

function relative(cwd, p) {
  if (!p) return p;
  const rel = path.relative(cwd, p);
  return rel.startsWith("..") ? p : rel;
}

module.exports = { LOCK_FILENAME, writeLock, readLock, lockPath };
