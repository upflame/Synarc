---
title: Compatibility Matrix — Synarc Universal Skill Pack (v6.5.0, 8 active runtimes)
description: Full capability × runtime matrix for Synarc Universal v6.5.0, detailing which features are supported across all 8 active AI coding agents (Roo Code shut down 2026-05-15; migrate to Cline): frontmatter, intent activation, fallback tiers, brain persistence, file ops, command execution, guardrails, session tracking, change classification, risk assessment, quality gates, and error intelligence.
version: 6.5.0
schema: skill-pack/v1
---

# Compatibility Matrix — Synarc Universal Skill Pack

## On this page

- [Capability × Runtime Matrix](#capability-runtime-matrix)
- [Legend](#legend)
- [Feature Descriptions](#feature-descriptions)
  - [YAML Frontmatter](#yaml-frontmatter)
  - [Intent Activation](#intent-activation)
  - [Fallback Tiers (1–4)](#fallback-tiers-1-4)
  - [Brain Persistence](#brain-persistence)
  - [File Operations](#file-operations)
  - [Command Execution](#command-execution)
  - [Guardrails](#guardrails)
  - [Session Tracking](#session-tracking)
  - [Change Classification](#change-classification)
  - [Risk Assessment](#risk-assessment)
  - [Quality Gates](#quality-gates)
  - [Error Intelligence](#error-intelligence)
- [Graceful Degradation](#graceful-degradation)
- [Dependency Resolution Support](#dependency-resolution-support)
- [Transport Layer Support](#transport-layer-support)

## Capability × Runtime Matrix

|  Capability | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline  |
|---|---|---|---|---|---|---|---|
|  **YAML frontmatter** | Partial | Yes | Yes | Yes | Yes | Partial | Yes | Yes  |
|  **Intent activation** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes  |
|  **Tier 1 — Native** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes  |
|  **Tier 2 — External** | No | No | No | Yes | Yes | No | No | Yes  |
|  **Tier 3 — Manual** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes  |
|  **Tier 4 — Human** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes  |
|  **Brain persistence** | No | Yes | No | No | Yes | No | No | Yes  |
|  **File operations** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes  |
|  **Command execution** | Yes | Yes | No | Yes | Yes | No | Yes | Yes  |
|  **Guardrails** | No | Partial | No | Partial | Yes | No | No | Partial  |
|  **Session tracking** | Partial | Yes | Partial | Partial | Yes | Partial | Partial | Yes  |
|  **Change classification** | Via prompt | Via prompt | Via rules | Via prompt | Via prompt | Via rules | Via rules | Via rules  |
|  **Risk assessment** | Via prompt | Via prompt | Via rules | Via prompt | Via prompt | Via rules | Via rules | Via rules  |
|  **Quality gates** | Partial | Yes | Partial | Partial | Yes | Partial | Partial | Yes  |
|  **Error intelligence** | Partial | Yes | Partial | Yes | Yes | No | Partial | Yes  |

## Legend

| Symbol | Meaning |
|--------|---------|
| **Yes** | Fully supported with native or adapted flow |
| **Partial** | Supported with limitations or fallback to higher tier |
| **No** | Not supported natively; may be unavailable or degraded |
| **Via prompt** | Implemented through AGENTS.md / SKILL.md instructions |

## Feature Descriptions

### YAML Frontmatter

Powers skill metadata parsing — name, description, version, activation triggers, dependencies. Codex and Copilot read only a subset of frontmatter fields. All other agents read full frontmatter.

### Intent Activation

Skills activate when user intent matches patterns defined in AGENTS.md or the agent's rules system. All 8 active agents support this — no agent requires explicit slash commands or manual skill selection.

### Fallback Tiers (1–4)

| Tier | Description | Available On |
|------|-------------|-------------|
| 1 — Native Execution | Agent performs capability built-in | All agents |
| 2 — External Integration | External tools, APIs, MCP servers | Gemini CLI, Claude Code, Cline |
| 3 — Manual Workflow | Step-by-step instructions | All agents |
| 4 — Human-Assisted | Structured output for human review | All agents |

Tier 2 is the most limited capability — only Claude Code, Gemini CLI, Cline, and Cline support external tool/API integration. All other agents fall through to Tier 3 or 4.

### Brain Persistence

Persistent memory across sessions via a `brain/` directory. OpenCode, Claude Code, Cline, and Cline support full brain persistence with file-based session state, ledger, and checkpoints. Codex uses AGENTS.md itself as a persistence mechanism. Cursor, Gemini CLI, Copilot, and Windsurf keep state in conversation only.

### File Operations

All agents can read and write files, though the mechanism differs — CLI agents use dedicated file tools, IDE agents use native editor integrations.

### Command Execution

Codex, OpenCode, Gemini CLI, Claude Code, Windsurf, Cline, and Cline support running shell commands. Cursor and Copilot do not expose a command execution interface.

### Guardrails

Constitutional safety rules that block or warn on prohibited patterns. Only Claude Code has native guardrail support. OpenCode, Gemini CLI, Cline, and Cline support partial guardrails via prompt constraints. Codex, Cursor, Copilot, and Windsurf do not natively support refusal-based guardrails.

### Session Tracking

OpenCode, Claude Code, Cline, and Cline support persistent session tracking with immutable ledgers. Codex, Cursor, Gemini CLI, Copilot, and Windsurf support session-scoped tracking only (lost when session ends).

### Change Classification

All agents support change classification, but the delivery mechanism differs. CLI agents (Codex, OpenCode, Gemini CLI, Claude Code) use prompt-injected instructions. IDE agents (Cursor, Copilot, Windsurf, Cline) embed classification rules in their rules files.

### Risk Assessment

Same pattern as change classification — universal capability delivered through agent-appropriate mechanism.

### Quality Gates

OpenCode, Claude Code, Cline, and Cline support full quality gate enforcement with pre-write and post-write verification. Other agents support partial gates limited to what the agent's architecture permits.

### Error Intelligence

Claude Code, Gemini CLI, OpenCode, Cline, and Cline support the full 6-step error intelligence protocol (classify, locate, assess, apply, verify, track). Other agents have limited or no error intelligence support.

## Graceful Degradation

When a capability is not available on the current agent, the system falls back through the 4-tier chain:

```
Tier 1 (native) → Tier 2 (external) → Tier 3 (manual) → Tier 4 (human)
```

If no fallback exists, a capability notification is emitted: "Capability X is not available on this agent." The system continues with reduced functionality — no single missing capability halts operation.

## Dependency Resolution Support

|  Feature | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline  |
| --------- | ------- | ---------- | -------- | -------- | -------- | --------- | ---------- | ------- |
|  Version constraints | No | No | No | No | No | No | No | No  |
|  Dependency graph | No | No | No | No | No | No | No | No  |
|  Skill manifest | Yes | Yes | No | Yes | Yes | No | No | No  |

Dependency resolution is primarily a pack-level concern — the `manifest.yaml` file defines all dependencies and version constraints. Individual agents do not enforce these constraints; they are validated during pack compilation and CI.

## Transport Layer Support

|  Transport | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline  |
| ----------- | ------- | ---------- | -------- | -------- | -------- | --------- | ---------- | ------- |
|  AGENTS.md | Yes | Yes | No | Yes | Yes | Yes | No | No  |
|  SKILL.md | No | Yes | No | No | Yes | No | No | No  |
|  .mdc rules | No | No | Yes | No | No | No | No | No  |
|  .windsurfrules | No | No | No | No | No | No | Yes | No  |
|  .clinerules | No | No | No | No | No | No | No | Yes  |
|  copilot-instructions.md | No | No | No | No | No | Yes | No | No  |

## See also

- [Installation Guide](installation.md)
- [Architecture Overview](architecture.md)
- [Migration Guide](migration-guide.md)

