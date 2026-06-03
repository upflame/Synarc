---
title: Compatibility Matrix — Synarc Universal Skill Pack
description: Full capability × runtime matrix detailing which features are supported across all 9 AI coding agents, including 4-tier prompt-cache, intent-based activation, fallback tiers, brain persistence, file ops, command execution, guardrails, session tracking, change classification, risk assessment, quality gates, and error intelligence. Validated for v6.0.0.
version: 6.0.0
schema: skill-pack/v1
---

# Compatibility Matrix — Synarc Universal Skill Pack (v6.0.0)

## Capability × Runtime Matrix

| Capability | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline | RooCode |
|---|---|---|---|---|---|---|---|---|---|
| **YAML frontmatter** (v6 fields) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **`intent_triggers` array** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **`cache_tier` declaration** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Tier 1 — Native** (capability tier) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Tier 2 — External** (capability tier) | No | No | No | Yes | Yes | No | No | Yes | Yes |
| **Tier 3 — Manual** (capability tier) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Tier 4 — Human** (capability tier) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Brain persistence** | No | Yes | No | No | Yes | No | No | Yes | Yes |
| **File operations** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Command execution** | Yes | Yes | No | Yes | Yes | No | Yes | Yes | Yes |
| **Guardrails** | No | Partial | No | Partial | Yes | No | No | Partial | Partial |
| **Session tracking** | Partial | Yes | Partial | Partial | Yes | Partial | Partial | Yes | Yes |
| **Change classification** | Via prompt | Via prompt | Via rules | Via prompt | Via prompt | Via rules | Via rules | Via rules | Via rules |
| **Risk assessment** | Via prompt | Via prompt | Via rules | Via prompt | Via prompt | Via rules | Via rules | Via rules | Via rules |
| **Quality gates** | Partial | Yes | Partial | Partial | Yes | Partial | Partial | Yes | Yes |
| **Error intelligence** | Partial | Yes | Partial | Yes | Yes | No | Partial | Yes | Yes |

## Legend

| Symbol | Meaning |
|--------|---------|
| **Yes** | Fully supported with native or adapted flow |
| **Partial** | Supported with limitations or fallback to higher tier |
| **No** | Not supported natively; may be unavailable or degraded |
| **Via prompt** | Implemented through AGENTS.md / SKILL.md instructions |

## Feature Descriptions

### YAML Frontmatter (v6.0.0 contract)

Powers skill metadata parsing — `name`, `description` (3rd-person, 40-1024 chars), `version` (6.0.0), `priority`, `intent_triggers` (array, ≥ 2 elements), `cache_tier` (core / domain / reference / context / dynamic), `allowed_tools`. All 9 agents read the full v6 frontmatter; the v5 partial-subset limitation in Codex and Copilot is resolved in v6.

### Intent Activation

Skills activate when user intent matches at least one phrase in the `intent_triggers` array. All 9 agents support this — no agent requires explicit slash commands or manual skill selection. The `intent_triggers` array is the new activation contract; the v5 prose `WHEN/THEN` blocks are removed.

### Cache Tiers (v6.0.0)

| Tier | What | Cached for | Runtime support |
|------|------|------------|-----------------|
| 0 | Pack header (AGENTS.md, manifest.yaml) | Always-on, every session | All 9 agents |
| 1 | Core reasoning (~60 KB total: synarc-core, negative-prompts, cognition-layer, schemas, change-intelligence, coding-agent) | Always-on, per session | All 9 agents |
| 2 | Active domain skill (~10 KB; one of 40) | Per task, swapped when intent shifts | All 9 agents |
| 3 | Skill references (`skills/<id>/references/*.md`) | Lazy, on first reference | All 9 agents |
| 4 | Dynamic context (project files, tool outputs) | Never cached | All 9 agents |

### Fallback Tiers (1–4)

| Tier | Description | Available On |
|------|-------------|-------------|
| 1 — Native Execution | Agent performs capability built-in | All agents |
| 2 — External Integration | External tools, APIs, MCP servers | Gemini CLI, Claude Code, Cline, RooCode |
| 3 — Manual Workflow | Step-by-step instructions | All agents |
| 4 — Human-Assisted | Structured output for human review | All agents |

Tier 2 is the most limited capability — only Claude Code, Gemini CLI, Cline, and RooCode support external tool/API integration. All other agents fall through to Tier 3 or 4.

### Brain Persistence

Persistent memory across sessions via a `brain/` directory. OpenCode, Claude Code, Cline, and RooCode support full brain persistence with file-based session state, ledger, and checkpoints. Codex uses AGENTS.md itself as a persistence mechanism. Cursor, Gemini CLI, Copilot, and Windsurf keep state in conversation only.

### File Operations

All agents can read and write files, though the mechanism differs — CLI agents use dedicated file tools, IDE agents use native editor integrations.

### Command Execution

Codex, OpenCode, Gemini CLI, Claude Code, Windsurf, Cline, and RooCode support running shell commands. Cursor and Copilot do not expose a command execution interface.

### Guardrails

Constitutional safety rules that block or warn on prohibited patterns. Only Claude Code has native guardrail support. OpenCode, Gemini CLI, Cline, and RooCode support partial guardrails via prompt constraints. Codex, Cursor, Copilot, and Windsurf do not natively support refusal-based guardrails.

### Session Tracking

OpenCode, Claude Code, Cline, and RooCode support persistent session tracking with immutable ledgers. Codex, Cursor, Gemini CLI, Copilot, and Windsurf support session-scoped tracking only (lost when session ends).

### Change Classification

All agents support change classification, but the delivery mechanism differs. CLI agents (Codex, OpenCode, Gemini CLI, Claude Code) use prompt-injected instructions. IDE agents (Cursor, Copilot, Windsurf, Cline, RooCode) embed classification rules in their rules files.

### Risk Assessment

Same pattern as change classification — universal capability delivered through agent-appropriate mechanism.

### Quality Gates

OpenCode, Claude Code, Cline, and RooCode support full quality gate enforcement with pre-write and post-write verification. Other agents support partial gates limited to what the agent's architecture permits.

### Error Intelligence

Claude Code, Gemini CLI, OpenCode, Cline, and RooCode support the full 6-step error intelligence protocol (classify, locate, assess, apply, verify, track). Other agents have limited or no error intelligence support.

## Graceful Degradation

When a capability is not available on the current agent, the system falls back through the 4-tier chain:

```
Tier 1 (native) → Tier 2 (external) → Tier 3 (manual) → Tier 4 (human)
```

If no fallback exists, a capability notification is emitted: "Capability X is not available on this agent." The system continues with reduced functionality — no single missing capability halts operation.

## Dependency Resolution Support

| Feature | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline | RooCode |
|---------|-------|----------|--------|--------|--------|---------|----------|-------|---------|
| `priority` declaration | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `cache_tier` declaration | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `intent_triggers` array | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Skill manifest | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

**v6.0.0 removed the v5.x `dependencies` and `compatibility` fields.** The `cache_tier` declaration now describes the runtime relationship between skills: a skill with `cache_tier: core` is the pre-warm dependency for any `cache_tier: domain` skill that needs it. This is enforced at validator level (`scripts/validate-skills.ps1`) and at sync level (`scripts/sync-v6.ps1`); individual runtimes do not enforce version constraints, but the pack is validated during CI.

## Transport Layer Support

| Transport | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline | RooCode |
|-----------|-------|----------|--------|--------|--------|---------|----------|-------|---------|
| AGENTS.md | Yes | Yes | No | Yes | Yes | Yes | No | No | No |
| SKILL.md | No | Yes | No | No | Yes | No | No | No | No |
| .mdc rules | No | No | Yes | No | No | No | No | No | No |
| .windsurfrules | No | No | No | No | No | No | Yes | No | No |
| .clinerules | No | No | No | No | No | No | No | Yes | Yes |
| .roorules | No | No | No | No | No | No | No | Yes | Yes |
| copilot-instructions.md | No | No | No | No | No | Yes | No | No | No |
