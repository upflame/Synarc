"use strict";
/**
 * Synarc Universal — templates
 * String templates for config files, lock files, etc.
 * @module synarc-universal/lib/templates
 */

function configFile(opts = {}) {
  const agents = opts.agents || ["claude-code", "codex", "opencode"];
  const skills = opts.skills;
  const excludeSkills = opts.excludeSkills || [];
  return `// synarc.config.js
// Project-level Synarc configuration.
// Docs: https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs

/** @type {import("synarc").SynarcConfig} */
module.exports = {
  // Which Synarc version this config targets.
  // version: ">=6.0.0",

  // Which AI coding agents to install Synarc for.
  // null = auto-detect from project markers.
  agents: ${JSON.stringify(agents)},

  // Which skills to enable. null = all 56.
  // skills: null,
${skills ? "  // skills: " + JSON.stringify(skills) + ",\n" : ""}
  // Disable specific skills.
  excludeSkills: ${JSON.stringify(excludeSkills)},

  // Per-WorkType risk caps.
  // riskCaps: {
  //   INCIDENT: "CRITICAL",
  //   FEATURE:  "MEDIUM",
  // },

  // Custom guardrails.
  // guardrails: [],

  // SDK hooks (async functions).
  // hooks: {
  //   beforeInstall: async (ctx) => { /* ... */ },
  //   afterInstall:  async (ctx) => { /* ... */ },
  //   beforeVerify:  async (ctx) => { /* ... */ },
  //   afterVerify:   async (ctx) => { /* ... */ },
  //   onError:       async ({ event, error }) => { /* ... */ },
  // },

  // Telemetry (off by default; would be a no-op anyway).
  telemetry: false,

  // Experimental flags.
  // experimental: { mesh: true, intentContracts: true },
};
`;
}

const INTRO_TEXT = [
  "  Welcome to Synarc \u2014 the Cognition Mesh for AI-assisted engineering.",
  "",
  "  Synarc turns any of 8 AI coding agents into a disciplined engineering",
  "  teammate: change classification, risk assessment, intent contracts,",
  "  verification engine, audit trail, multi-role mesh.",
  "",
  "  Quick start:",
  "    synarc fresh --target all --yes    # install for every editor",
  "    synarc fresh --target cursor --yes # install for one editor",
  "    synarc doctor                      # environment diagnostics",
  "",
].join("\n");

module.exports = { configFile, INTRO_TEXT };
