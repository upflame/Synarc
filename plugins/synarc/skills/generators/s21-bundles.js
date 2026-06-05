module.exports = {
  generateS21(w) {
    w('## S21 — PLUGIN SUBSYSTEM BUNDLES');
    w('');
    w('Synarc core bundles 40 plugin subsystems as reference files. Each subsystem corresponds to a child plugin in the Synarc ecosystem. The bundling means installing synarc@upflame-marketplace activates all 40 domain-specific reasoning engines in a single command.');
    w('');
    w('### Child Plugin Inheritance Chain');
    w('');
    w('Every child plugin declares parent: synarc in its frontmatter. This means all S-sections from core are inherited. Child plugins define P-sections (domain-specific content) that extend the core framework. The inheritance is hierarchical: core → domain → sub-domain.');
    w('');
    w('### Plugin Subsystem Reference Loading');
    w('');
    w('Domain-specific reference files are loaded contextually — not every reference file loads on every interaction. The loading is driven by classification: if the WorkType is FEATURE in backend-engineer, load references/backend-engineer.md. If the interaction is SECURITY analysis, load references/security-patterns.md. This contextual loading keeps the active context lean.');
    w('');
    w('### The 40 Plugin Subsystems');
    w('');
    w('**Engineering & Architecture (12):** backend-engineer, frontend-engineer, fullstack-engineer, ui-engineer, ux-engineer, architect, api-designer, database-architect, data-engineer, mobile-engineer, ml-engineer, chaos-engineer.');
    w('');
    w('**Operations & Infra (8):** devops-engineer, infrastructure-engineer, platform-engineer, sre-engineer, observability-engineer, performance-thinker, finops-engineer, coding-agent.');
    w('');
    w('**Security & Compliance (3):** security-engineer, privacy-engineer, ethics-engineer.');
    w('');
    w('**Leadership & Strategy (5):** cto, staff-engineer, engineering-manager, product-engineer, decision-engineer.');
    w('');
    w('**Analysis & Problem-Solving (5):** debug-engineer, risk-analyst, foundational-reasoning, problem-solver, incident-commander.');
    w('');
    w('**Core Platform (7):** cognition-layer, change-intelligence, schemas, project-scales, negative-prompts, testing-strategy, coding-agent.');
    w('');
    w('### Plugin Loading Order');
    w('');
    w('When multiple plugins match the current interaction, load in this order: synarc core first (S-sections), then the primary domain plugin (P-sections), then secondary domain plugins (cross-domain reference). Each plugin adds approximately 200-500 tokens of domain-specific content.');
    w('');
    w('Reference files for all subsystems are in references/ directory at plugins/synarc/skills/references/. Each reference file follows the same YAML frontmatter format with title, type, status, version, updated date, owner, and tags.');
    w('');
  }
};
