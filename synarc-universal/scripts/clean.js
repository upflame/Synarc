#!/usr/bin/env node
"use strict";
/**
 * Synarc Universal \u2014 clean
 * Remove test/install artifacts from the current working directory.
 * Safe to run repeatedly; missing files are silently ignored.
 *
 * Usage: node scripts/clean.js
 */

const fs = require("node:fs");
const path = require("node:path");

const ARTIFACTS = [
  ".cline",
  ".cursor",
  ".windsurfrules",
  ".windsurf",
  ".aider*",
  ".continue",
  ".github/copilot",
  ".gemini",
  ".codex",
  ".claude",
  ".opencode",
  ".roo",
  "synarc.lock.json",
  ".synarc",
];

const cwd = process.cwd();
let removed = 0;
for (const name of ARTIFACTS) {
  const target = path.join(cwd, name);
  if (!fs.existsSync(target)) continue;
  try {
    fs.rmSync(target, { recursive: true, force: true });
    console.log("  - " + name);
    removed++;
  } catch (err) {
    console.warn("  ! " + name + " (" + err.message + ")");
  }
}
console.log(removed + " artifact(s) removed.");
