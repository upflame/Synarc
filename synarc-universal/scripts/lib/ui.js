"use strict";
/**
 * Synarc Universal — branded UI
 * ASCII logo, welcome screen, status cards, tables, progress bars.
 * Uses picocolors for color, @clack/prompts for primitives.
 *
 * @module synarc/lib/ui
 */

const pc = require("picocolors");

// Logo built from a 2D array of strings to avoid string-escape headaches.
// Each line is a separate element of the array.
const LOGO_LINES = [
  "   ____                  ",
  "  / __/__ _____  _____   ",
  " _\\ \\/ _ `/ _ \\/ __(_-<  ",
  "/___/\\_,_/_//_/_//_/___/  ",
];

const LOGO = LOGO_LINES.join("\n");
const LOGO_COMPACT = "synarc";

function logo() {
  if (typeof pc.isColorSupported === "function" && !pc.isColorSupported()) return LOGO_COMPACT;
  return pc.cyan(LOGO);
}

function version() {
  return require("./config").PACK_VERSION;
}

/**
 * The welcome screen. Called once at the end of a successful install.
 */
function welcome(opts = {}) {
  const { targets = [], configPath = null, lockPath = null } = opts;
  const v = version();
  const out = [];
  out.push("");
  out.push(pc.cyan(pc.bold("  ⚡ Synarc Universal v" + v)));
  out.push(pc.dim("  The Cognition Mesh for AI-assisted engineering"));
  out.push("");
  if (targets.length > 0) {
    out.push(pc.green("  ✔ " + targets.length + " editor" + (targets.length === 1 ? "" : "s") + " wired:"));
    for (const t of targets) {
      out.push("    " + pc.cyan("• ") + t);
    }
    out.push("");
  }
  out.push(pc.bold("  Next steps"));
  out.push("    " + pc.cyan("1.") + " Run " + pc.yellow("synarc verify") + "    to confirm the install");
  out.push("    " + pc.cyan("2.") + " Run " + pc.yellow("synarc doctor") + "    to check your environment");
  out.push("    " + pc.cyan("3.") + " Run " + pc.yellow("synarc list skills") + " to browse the 56 skills");
  out.push("    " + pc.cyan("4.") + " Open your editor and ask anything — Synarc is live");
  out.push("");
  out.push(pc.dim("  Docs:    ") + pc.underline("https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs"));
  out.push(pc.dim("  Discord: ") + pc.underline("https://discord.gg/synarc"));
  out.push(pc.dim("  Issues:  ") + pc.underline("https://github.com/upflame-labs/synarc/issues"));
  out.push("");
  if (configPath) out.push(pc.dim("  Config: " + configPath));
  if (lockPath)   out.push(pc.dim("  Lock:   " + lockPath));
  out.push("");
  return out.join("\n");
}

/**
 * A status card: key-value pairs in a tidy box.
 */
function statusCard(title, rows, opts = {}) {
  const maxKeyLen = Math.max(...rows.map(r => String(r[0]).length));
  const out = [];
  out.push("");
  out.push(pc.bold(pc.cyan("  " + title)));
  out.push(pc.dim("  " + "─".repeat(Math.max(20, title.length + 4))));
  for (const [k, v, hint] of rows) {
    const k2 = String(k).padEnd(maxKeyLen);
    let v2 = v;
    if (typeof v === "boolean") v2 = v ? pc.green("yes") : pc.yellow("no");
    else if (v == null)        v2 = pc.dim("—");
    out.push("  " + pc.dim(k2) + "  " + v2 + (hint ? "  " + pc.dim(hint) : ""));
  }
  out.push("");
  return out.join("\n");
}

/**
 * A small table.
 */
function table(headers, rows) {
  if (rows.length === 0) return "";
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] ?? "").length))
  );
  const out = [];
  const fmt = (cells) => cells.map((c, i) => String(c ?? "").padEnd(widths[i])).join("  ");
  out.push("  " + pc.bold(fmt(headers)));
  out.push("  " + pc.dim(widths.map(w => "─".repeat(w)).join("  ")));
  for (const r of rows) {
    out.push("  " + fmt(r));
  }
  return out.join("\n");
}

/**
 * A progress bar.
 */
function progressBar(done, total, width = 30) {
  if (total === 0) return pc.dim("[" + " ".repeat(width) + "]");
  const pct = Math.max(0, Math.min(1, done / total));
  const filled = Math.round(pct * width);
  const empty = width - filled;
  return "[" + pc.green("█".repeat(filled)) + pc.dim("░".repeat(empty)) + "] " + Math.round(pct * 100) + "%";
}

/**
 * A box around a string.
 */
function box(text, opts = {}) {
  const title = opts.title ? " " + opts.title + " " : "";
  const lines = text.split("\n");
  const w = Math.max(...lines.map(l => l.length), title.length + 4);
  const out = [];
  out.push(pc.cyan("  ┌─" + title + "─".repeat(Math.max(0, w - title.length)) + "┐"));
  for (const l of lines) {
    out.push(pc.cyan("  │ ") + l.padEnd(w) + pc.cyan(" │"));
  }
  out.push(pc.cyan("  └" + "─".repeat(w + 2) + "┘"));
  return out.join("\n");
}

module.exports = { logo, version, welcome, statusCard, table, progressBar, box };
