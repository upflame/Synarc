#!/usr/bin/env node
// Synarc Universal Installer — npm bin entry point
// Detects the current editor/project and installs Synarc skill files.

const fs = require('fs');
const path = require('path');

const SYNARC_ROOT = path.resolve(__dirname, '..');

const PLATFORMS = {
  'claude-code': {
    detect: () => fs.existsSync(path.join(process.cwd(), '.claude')),
    install: () => installClaudeCode(),
    label: 'Claude Code'
  },
  'opencode': {
    detect: () => true, // fallback — AGENTS.md at root works for all
    install: () => installAgentsMd(),
    label: 'OpenCode / Codex CLI / general AGENTS.md'
  },
  'cursor': {
    detect: () => fs.existsSync(path.join(process.cwd(), '.cursor')),
    install: () => installCursor(),
    label: 'Cursor'
  },
  'windsurf': {
    detect: () => fs.existsSync(path.join(process.cwd(), '.windsurfrules')),
    install: () => installWindsurf(),
    label: 'Windsurf'
  },
  'copilot': {
    detect: () => fs.existsSync(path.join(process.cwd(), '.github')),
    install: () => installCopilot(),
    label: 'GitHub Copilot'
  },
  'gemini-cli': {
    detect: () => fs.existsSync(path.join(process.cwd(), 'GEMINI.md')),
    install: () => installGemini(),
    label: 'Gemini CLI'
  },
  'cline': {
    detect: () => fs.existsSync(path.join(process.cwd(), '.cline')),
    install: () => installCline(),
    label: 'Cline'
  }
};

function installClaudeCode() {
  const target = path.join(process.cwd(), '.claude-plugin', 'plugin.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(path.join(SYNARC_ROOT, '..', '.claude-plugin', 'plugin.json'), target);
  console.log('  ✓ .claude-plugin/plugin.json installed');
}

function installAgentsMd() {
  const target = path.join(process.cwd(), 'AGENTS.md');
  const src = path.join(SYNARC_ROOT, 'AGENTS.md');
  const skillsTarget = path.join(process.cwd(), 'skills');
  const skillsSrc = path.join(SYNARC_ROOT, 'skills');

  if (!fs.existsSync(target)) {
    fs.cpSync(src, target);
    console.log('  ✓ AGENTS.md installed');
  } else {
    console.log('  ∼ AGENTS.md already exists, skipping');
  }

  if (!fs.existsSync(skillsTarget)) {
    fs.cpSync(skillsSrc, skillsTarget, { recursive: true });
    console.log('  ✓ skills/ directory installed');
  } else {
    console.log('  ∼ skills/ already exists, skipping');
  }
}

function installCursor() {
  const targetDir = path.join(process.cwd(), '.cursor', 'rules');
  const src = path.join(SYNARC_ROOT, '..', '.cursor', 'rules', 'synarc-core.mdc');
  if (fs.existsSync(src)) {
    fs.mkdirSync(targetDir, { recursive: true });
    const target = path.join(targetDir, 'synarc-core.mdc');
    if (!fs.existsSync(target)) {
      fs.cpSync(src, target);
      console.log('  ✓ .cursor/rules/synarc-core.mdc installed');
    } else {
      console.log('  ∼ synarc-core.mdc already exists, skipping');
    }
  }
}

function installWindsurf() {
  const target = path.join(process.cwd(), '.windsurfrules');
  const src = path.join(SYNARC_ROOT, 'shared', 'runtime-adapters', 'windsurf.md');
  if (!fs.existsSync(target) && fs.existsSync(src)) {
    fs.cpSync(src, target);
    console.log('  ✓ .windsurfrules installed');
  }
}

function installCopilot() {
  const target = path.join(process.cwd(), '.github', 'copilot-instructions.md');
  const src = path.join(SYNARC_ROOT, 'shared', 'runtime-adapters', 'copilot.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(src)) {
    const content = fs.readFileSync(src, 'utf-8');
    fs.appendFileSync(target, '\n' + content);
    console.log('  ✓ Appended to .github/copilot-instructions.md');
  }
}

function installGemini() {
  const target = path.join(process.cwd(), 'GEMINI.md');
  const src = path.join(SYNARC_ROOT, '..', 'GEMINI.md');
  if (fs.existsSync(src) && !fs.existsSync(target)) {
    fs.cpSync(src, target);
    console.log('  ✓ GEMINI.md installed');
  }
}

function installCline() {
  const targetDir = path.join(process.cwd(), '.cline', 'skills');
  const src = path.join(SYNARC_ROOT, 'skills');
  fs.mkdirSync(targetDir, { recursive: true });
  for (const skill of fs.readdirSync(src)) {
    const skillPath = path.join(src, skill);
    if (fs.statSync(skillPath).isDirectory()) {
      const target = path.join(targetDir, skill);
      if (!fs.existsSync(target)) {
        fs.cpSync(skillPath, target, { recursive: true });
      }
    }
  }
  console.log('  ✓ .cline/skills/ installed/synced');
}

function main() {
  console.log('Synarc Universal v6.0.0 — Installer');
  console.log('');

  const cwd = process.cwd();
  console.log(`Target: ${cwd}`);
  console.log('');

  let detected = false;
  for (const [, platform] of Object.entries(PLATFORMS)) {
    try {
      if (platform.detect()) {
        console.log(`Detected: ${platform.label}`);
        platform.install();
        detected = true;
        console.log('');
      }
    } catch { /* skip if detection fails */ }
  }

  if (!detected) {
    console.log('No recognized editor config detected. Installing AGENTS.md + skills/ as fallback.');
    installAgentsMd();
  }

  console.log('Synarc installed. Start a new session and ask an engineering question.');
  console.log('Full docs: synarc-universal/docs/installation.md');
}

main();
