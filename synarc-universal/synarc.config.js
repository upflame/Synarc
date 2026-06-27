// synarc.config.js
// Project-level Synarc configuration.
// Docs: https://github.com/upflame-labs/synarc/tree/main/synarc-universal/docs

/** @type {import("synarc").SynarcConfig} */
module.exports = {
  // Which Synarc version this config targets.
  // version: ">=6.0.0",

  // Which AI coding agents to install Synarc for.
  // null = auto-detect from project markers.
  agents: ["claude-code","codex","opencode"],

  // Which skills to enable. null = all 56.
  // skills: null,

  // Disable specific skills.
  excludeSkills: [],

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
