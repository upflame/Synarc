"use strict";
/**
 * Synarc Universal — runtime config
 * Single source of truth for paths, version, and editor registry.
 * @module synarc-universal/lib/config
 */

const PACK_VERSION = "6.6.4";
const PACK_NAME    = "synarc-universal";
const SCHEMA       = "skill-pack/v1";

module.exports = {
  PACK_VERSION,
  PACK_NAME,
  SCHEMA,
  // Markers used to auto-detect which editor a project uses
  MARKERS: {
    codex:       ["AGENTS.md", ".codex"],
    opencode:    ["AGENTS.md", ".opencode"],
    cursor:      [".cursor"],
    windsurf:    [".windsurfrules"],
    copilot:     [".github"],
    "claude-code": [".claude-plugin", ".claude"],
    "gemini-cli":  ["GEMINI.md"],
    cline:       [".cline"],
  },
  // Default install targets when nothing is detected
  DEFAULT_TARGETS: ["codex", "opencode"],
  // Environment variables we honor
  ENV: {
    GLOBAL_DIR:       "SYNARC_GLOBAL_DIR",
    TARGETS:          "SYNARC_TARGETS",
    TELEMETRY:        "SYNARC_TELEMETRY_DISABLED",
    LOG_LEVEL:        "SYNARC_LOG_LEVEL",
    NO_COLOR:         "NO_COLOR",
    FORCE_COLOR:      "FORCE_COLOR",
  },
  EXIT: {
    OK: 0,
    FAIL: 1,
    PACK_NOT_FOUND: 2,
    INVALID_ARGS: 3,
    NETWORK: 4,
    PERMISSION: 5,
  },
};
