"use strict";
/**
 * Synarc Universal — logger
 * Colored output (picocolors) with --json mode.
 * Honors NO_COLOR, FORCE_COLOR, and TTY detection.
 * @module synarc-universal/lib/logger
 */

const pc = require("picocolors");

function wantsColor() {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== "0") return true;
  return Boolean(process.stdout.isTTY);
}

function makeLogger(opts = {}) {
  const json = Boolean(opts.json);
  const quiet = Boolean(opts.quiet);
  const verbose = Boolean(opts.verbose);
  const color = !json && wantsColor();

  const c = color ? pc : new Proxy({}, { get: () => (s) => String(s ?? "") });

  // Buffer JSON output until the end so we can produce one document
  const jsonBuffer = [];

  function emit(level, payload) {
    if (json) {
      jsonBuffer.push({ level, ...payload });
      return;
    }
    if (quiet && level !== "error") return;
    if (level === "info" && !verbose) {
      console.log(payload.line);
    } else if (level === "info") {
      console.log(payload.line);
    } else if (level === "warn") {
      console.warn(c.yellow(payload.line));
    } else if (level === "error") {
      console.error(c.red(payload.line));
    } else if (level === "success") {
      console.log(c.green(payload.line));
    } else if (level === "dim") {
      console.log(c.dim(payload.line));
    } else {
      console.log(payload.line);
    }
  }

  return {
    isJson: () => json,
    isQuiet: () => quiet,
    isVerbose: () => verbose,
    info:    (line, extra) => emit("info",    { line, ...(extra || {}) }),
    success: (line, extra) => emit("success", { line, ...(extra || {}) }),
    warn:    (line, extra) => emit("warn",    { line, ...(extra || {}) }),
    error:   (line, extra) => emit("error",   { line, ...(extra || {}) }),
    dim:     (line, extra) => emit("dim",     { line, ...(extra || {}) }),
    pass:    (label, path, bytes) => emit("info", { line: c.green("  \u2714 ") + label.padEnd(16) + path + (bytes ? c.dim("  (" + formatBytes(bytes) + ")") : "") }),
    skip:    (label, path)        => emit("info", { line: c.yellow("  \u2026 ") + label.padEnd(16) + path + c.dim("  (already present)") }),
    fail:    (label, reason)      => emit("error",{ line: c.red("  \u2716 ") + label + (reason ? c.dim("  - " + reason) : "") }),
    header:  (line)               => emit("info", { line: c.bold(c.cyan("\n  " + line)) }),
    bullet:  (line)               => emit("info", { line: c.cyan("  \u2022 ") + line }),
    /**
     * Flush any buffered JSON events. Returns the array (or [] in non-JSON mode).
     */
    flush: () => {
      if (!json) return [];
      return jsonBuffer.splice(0, jsonBuffer.length);
    },
  };
}

function formatBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(1) + " MB";
}

module.exports = { makeLogger, formatBytes, wantsColor };
