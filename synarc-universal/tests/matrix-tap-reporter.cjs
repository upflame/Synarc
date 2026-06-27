"use strict";
/**
 * Synarc Universal \u2014 custom TAP reporter for the matrix suite.
 *
 * Mirrors the default TAP output of `node --test` (so the result is still
 * valid TAP) and adds a per-process summary plus a machine-readable
 * `test-results/matrix.json` file for CI.
 *
 * Usage:
 *   node --test --test-reporter=./tests/matrix-tap-reporter.cjs tests/matrix.test.js
 *
 * Compatible with Node 22+ reporter signature: `async function * (source)`.
 */

const fs   = require("node:fs");
const path = require("node:path");

const startedAt = Date.now();
let n = 0;
const records = [];

async function * reporter(source) {
  yield "TAP version 13\n";
  for await (const ev of source) {
    if (ev.type === "test:pass") {
      n++;
      yield "ok " + n + " - " + ev.data.name + "\n";
      records.push({ id: n, name: ev.data.name, status: "pass" });
    } else if (ev.type === "test:fail") {
      n++;
      const errs = (ev.data.details && ev.data.details.errors) || [];
      const detail = errs.map((e) => e.message || String(e)).join(" | ");
      yield "not ok " + n + " - " + ev.data.name + "\n";
      if (detail) {
        yield "  ---\n";
        yield "  message: " + detail + "\n";
        yield "  ...\n";
      }
      records.push({ id: n, name: ev.data.name, status: "fail", detail });
    }
  }
  const dur = ((Date.now() - startedAt) / 1000).toFixed(2);
  const pass = records.filter((r) => r.status === "pass").length;
  const fail = records.filter((r) => r.status === "fail").length;
  yield "1.." + n + "\n";
  yield "# MATRIX SUMMARY: " + pass + " / " + n + " passed in " + dur + "s\n";
  if (fail > 0) {
    yield "# Top failures:\n";
    const top = records.filter((r) => r.status === "fail").slice(0, 10);
    for (const r of top) {
      yield "#   " + r.id + " " + r.name + " :: " + r.detail + "\n";
    }
  }
  // Write machine-readable results.
  try {
    const outDir = path.join(__dirname, "..", "test-results");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "matrix.json"), JSON.stringify({
      startedAt: new Date(startedAt).toISOString(),
      duration_s: Number(dur),
      total: n,
      pass, fail,
      cases: records,
    }, null, 2) + "\n", "utf8");
  } catch (err) { yield "# (could not write test-results/matrix.json: " + err.message + ")\n"; }
}

module.exports = reporter;
