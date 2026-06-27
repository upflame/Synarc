"use strict";
/**
 * Synarc Universal — editor registry
 * 8 active AI coding agents. Each defines:
 *   - id, label, description
 *   - install(targetDir) -> { ok, action, path, bytes, ... }
 *   - verify(targetDir)  -> { ok, path, bytes, minBytes }
 *   - detect(targetDir)  -> boolean
 *   - remove(targetDir)  -> { ok, path, removed }
 *
 * Backwards compatible with the v6.5.0 install.js surface.
 * @module synarc-universal/lib/editors
 */

const fs = require("fs");
const path = require("path");

function findSource(synarcRoot, ...relPaths) {
  for (const rel of relPaths) {
    const inside  = path.join(synarcRoot, rel);
    if (fs.existsSync(inside)) return inside;
    const outside = path.join(synarcRoot, "..", rel);
    if (fs.existsSync(outside)) return outside;
  }
  return null;
}

function safeStat(p) {
  try { return fs.statSync(p); } catch { return null; }
}

function safeReadFile(p) {
  try { return fs.readFileSync(p, "utf-8"); } catch { return null; }
}

function safeRemove(p) {
  try {
    const st = fs.statSync(p);
    if (st.isDirectory()) fs.rmSync(p, { recursive: true, force: true });
    else fs.unlinkSync(p);
    return true;
  } catch { return false; }
}

function safeWriteFile(p, content) {
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content, "utf-8");
    return true;
  } catch { return false; }
}

function safeCopyFile(src, dst) {
  try {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    return true;
  } catch { return false; }
}

function safeCopyDir(src, dst) {
  try {
    fs.mkdirSync(dst, { recursive: true });
    fs.cpSync(src, dst, { recursive: true });
    return { ok: true, copied: 1 };
  } catch { return { ok: false }; }
}

function bytesOf(p) {
  const st = safeStat(p);
  return st ? st.size : 0;
}

// ============================================================================
// Per-editor install/verify/detect/remove
// ============================================================================

const editors = {

  // 1. Claude Code
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    description: "Native plugin manifest for Claude Code",
    detect: (cwd) => safeStat(path.join(cwd, ".claude-plugin")) != null || safeStat(path.join(cwd, ".claude")) != null,
    file: (cwd) => path.join(cwd, ".claude-plugin", "plugin.json"),
    minBytes: 500,
    install: (cwd, synarcRoot, opts) => {
      const src = findSource(synarcRoot, ".claude-plugin/plugin.json");
      if (!src) return { ok: false, reason: "source .claude-plugin/plugin.json not found" };
      const target = path.join(cwd, ".claude-plugin", "plugin.json");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target) };
      const ok = safeCopyFile(src, target);
      return { ok, action: ok ? "installed" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, ".claude-plugin", "plugin.json");
      const b = bytesOf(p);
      return { ok: b >= 500, path: p, bytes: b, minBytes: 500 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, ".claude-plugin", "plugin.json");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 2. Codex CLI
  codex: {
    id: "codex",
    label: "Codex CLI",
    description: "Intent-based activation via AGENTS.md",
    detect: (cwd) => safeStat(path.join(cwd, "AGENTS.md")) != null,
    file: (cwd) => path.join(cwd, "AGENTS.md"),
    minBytes: 500,
    install: (cwd, synarcRoot, opts) => {
      const src = path.join(synarcRoot, "AGENTS.md");
      if (!safeStat(src)) return { ok: false, reason: "source AGENTS.md not found" };
      const target = path.join(cwd, "AGENTS.md");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target) };
      const ok = safeCopyFile(src, target);
      return { ok, action: ok ? "installed" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, "AGENTS.md");
      const b = bytesOf(p);
      return { ok: b >= 500, path: p, bytes: b, minBytes: 500 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, "AGENTS.md");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 3. OpenCode
  opencode: {
    id: "opencode",
    label: "OpenCode",
    description: "Intent-based activation via AGENTS.md (project or global)",
    detect: (cwd) => safeStat(path.join(cwd, "AGENTS.md")) != null || safeStat(path.join(cwd, ".opencode")) != null,
    file: (cwd) => path.join(cwd, "AGENTS.md"),
    minBytes: 500,
    install: (cwd, synarcRoot, opts) => {
      const src = path.join(synarcRoot, "AGENTS.md");
      if (!safeStat(src)) return { ok: false, reason: "source AGENTS.md not found" };
      // For --global, write to ~/.config/opencode/AGENTS.md
      const isGlobal = Boolean(opts && opts.global);
      const target = isGlobal
        ? path.join(getGlobalDir(), ".config", "opencode", "AGENTS.md")
        : path.join(cwd, "AGENTS.md");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target), global: isGlobal };
      const ok = safeCopyFile(src, target);
      return { ok, action: ok ? "installed" : "failed", path: target, bytes: bytesOf(target), global: isGlobal };
    },
    verify: (cwd) => {
      const p = path.join(cwd, "AGENTS.md");
      const b = bytesOf(p);
      const globalPath = path.join(getGlobalDir(), ".config", "opencode", "AGENTS.md");
      const gb = bytesOf(globalPath);
      if (b >= 500) return { ok: true, path: p, bytes: b, minBytes: 500 };
      if (gb >= 500) return { ok: true, path: globalPath, bytes: gb, minBytes: 500, global: true };
      return { ok: false, path: p, bytes: b, minBytes: 500 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, "AGENTS.md");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 4. Cursor
  cursor: {
    id: "cursor",
    label: "Cursor",
    description: ".mdc rule file with YAML frontmatter",
    detect: (cwd) => safeStat(path.join(cwd, ".cursor")) != null,
    file: (cwd) => path.join(cwd, ".cursor", "rules", "synarc-core.mdc"),
    minBytes: 200,
    install: (cwd, synarcRoot, opts) => {
      const src = findSource(synarcRoot, ".cursor/rules/synarc-core.mdc");
      if (!src) return { ok: false, reason: "source .cursor/rules/synarc-core.mdc not found" };
      const target = path.join(cwd, ".cursor", "rules", "synarc-core.mdc");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target) };
      const ok = safeCopyFile(src, target);
      return { ok, action: ok ? "installed" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, ".cursor", "rules", "synarc-core.mdc");
      const b = bytesOf(p);
      return { ok: b >= 200, path: p, bytes: b, minBytes: 200 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, ".cursor", "rules", "synarc-core.mdc");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 5. Windsurf
  windsurf: {
    id: "windsurf",
    label: "Windsurf",
    description: "Plain markdown .windsurfrules file",
    detect: (cwd) => safeStat(path.join(cwd, ".windsurfrules")) != null,
    file: (cwd) => path.join(cwd, ".windsurfrules"),
    minBytes: 200,
    install: (cwd, synarcRoot, opts) => {
      const src = path.join(synarcRoot, "shared", "runtime-adapters", "windsurf.md");
      if (!safeStat(src)) return { ok: false, reason: "source synarc-universal/shared/runtime-adapters/windsurf.md not found" };
      const target = path.join(cwd, ".windsurfrules");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target) };
      const content = safeReadFile(src);
      const ok = content != null && safeWriteFile(target, content);
      return { ok, action: ok ? "installed" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, ".windsurfrules");
      const b = bytesOf(p);
      return { ok: b >= 200, path: p, bytes: b, minBytes: 200 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, ".windsurfrules");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 6. GitHub Copilot
  copilot: {
    id: "copilot",
    label: "GitHub Copilot",
    description: "Appends to .github/copilot-instructions.md (preserves user content)",
    detect: (cwd) => safeStat(path.join(cwd, ".github")) != null,
    file: (cwd) => path.join(cwd, ".github", "copilot-instructions.md"),
    minBytes: 200,
    install: (cwd, synarcRoot, opts) => {
      const src = path.join(synarcRoot, "shared", "runtime-adapters", "copilot.md");
      if (!safeStat(src)) return { ok: false, reason: "source synarc-universal/shared/runtime-adapters/copilot.md not found" };
      const target = path.join(cwd, ".github", "copilot-instructions.md");
      const content = safeReadFile(src);
      if (content == null) return { ok: false, reason: "could not read source" };
      const ok = safeWriteFile(target, "\n" + content);
      return { ok, action: ok ? "appended" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, ".github", "copilot-instructions.md");
      const b = bytesOf(p);
      return { ok: b >= 200, path: p, bytes: b, minBytes: 200 };
    },
    remove: (cwd) => {
      // Removing the whole file would lose user content; we just no-op and warn.
      return { ok: true, path: path.join(cwd, ".github", "copilot-instructions.md"), removed: false, note: "Copilot file is appended, not removed" };
    },
  },

  // 7. Gemini CLI
  "gemini-cli": {
    id: "gemini-cli",
    label: "Gemini CLI",
    description: "Generates GEMINI.md from AGENTS.md + gemini-cli adapter",
    detect: (cwd) => safeStat(path.join(cwd, "GEMINI.md")) != null,
    file: (cwd) => path.join(cwd, "GEMINI.md"),
    minBytes: 500,
    install: (cwd, synarcRoot, opts) => {
      const target = path.join(cwd, "GEMINI.md");
      if (safeStat(target)) return { ok: true, action: "skipped", path: target, bytes: bytesOf(target) };
      const agentsSrc = path.join(synarcRoot, "AGENTS.md");
      if (!safeStat(agentsSrc)) return { ok: false, reason: "source AGENTS.md not found" };
      const adapterSrc = path.join(synarcRoot, "shared", "runtime-adapters", "gemini-cli.md");
      const agents = safeReadFile(agentsSrc) || "";
      const adapter = safeReadFile(adapterSrc);
      const adapterBlock = adapter ? "\n\n<!-- Runtime adapter ---\n" + adapter + "\n--->\n" : "";
      const version = require("./config").PACK_VERSION;
      const header = "<!-- Generated by Synarc Universal v" + version + " on " + new Date().toISOString() + " -->\n";
      const ok = safeWriteFile(target, header + agents + adapterBlock);
      return { ok, action: ok ? "generated" : "failed", path: target, bytes: bytesOf(target) };
    },
    verify: (cwd) => {
      const p = path.join(cwd, "GEMINI.md");
      const b = bytesOf(p);
      return { ok: b >= 500, path: p, bytes: b, minBytes: 500 };
    },
    remove: (cwd) => {
      const p = path.join(cwd, "GEMINI.md");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },

  // 8. Cline
  cline: {
    id: "cline",
    label: "Cline",
    description: "Copies all 56 skills into .cline/skills/<skill>/SKILL.md",
    detect: (cwd) => safeStat(path.join(cwd, ".cline")) != null,
    file: (cwd) => path.join(cwd, ".cline", "skills"),
    minBytes: 0, // per-skill files checked separately
    install: (cwd, synarcRoot, opts) => {
      const src = path.join(synarcRoot, "skills");
      if (!safeStat(src)) return { ok: false, reason: "source synarc-universal/skills not found" };
      const targetDir = path.join(cwd, ".cline", "skills");
      fs.mkdirSync(targetDir, { recursive: true });
      let copied = 0, skipped = 0;
      for (const skill of fs.readdirSync(src)) {
        const fromDir = path.join(src, skill);
        if (!safeStat(fromDir) || !safeStat(fromDir).isDirectory()) continue;
        const toDir = path.join(targetDir, skill);
        if (safeStat(toDir)) { skipped++; continue; }
        safeCopyDir(fromDir, toDir);
        copied++;
      }
      return { ok: true, action: copied > 0 ? "installed" : "skipped", path: targetDir, copied, skipped };
    },
    verify: (cwd, synarcRoot) => {
      const targetDir = path.join(cwd, ".cline", "skills");
      const st = safeStat(targetDir);
      if (!st || !st.isDirectory()) return { ok: false, path: targetDir, bytes: 0, minBytes: 0, missing: "directory" };
      const expected = synarcRoot ? safeReadDir(synarcRoot + "/skills") : null;
      const actual = safeReadDir(targetDir);
      const total = (expected && expected.length) || (actual && actual.length) || 0;
      const missing = expected ? expected.filter(s => !actual.includes(s)) : [];
      return { ok: missing.length === 0 && total > 0, path: targetDir, bytes: 0, minBytes: 0, skills: total, missing };
    },
    remove: (cwd) => {
      const p = path.join(cwd, ".cline", "skills");
      const removed = safeRemove(p);
      return { ok: removed, path: p, removed };
    },
  },
};

function safeReadDir(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

function getGlobalDir() {
  return process.env.SYNARC_GLOBAL_DIR
      || process.env.USERPROFILE
      || process.env.HOME
      || process.env.HOMEPATH
      || process.cwd();
}

function listEditors() {
  return Object.values(editors).map(e => ({
    id: e.id, label: e.label, description: e.description,
  }));
}

function getEditor(id) {
  return editors[id] || null;
}

function detectMarkers(cwd) {
  const found = new Set();
  for (const [id, editor] of Object.entries(editors)) {
    try {
      if (editor.detect(cwd)) found.add(id);
    } catch { /* ignore */ }
  }
  return found;
}

module.exports = {
  editors,
  listEditors,
  getEditor,
  detectMarkers,
  getGlobalDir,
  bytesOf,
};
