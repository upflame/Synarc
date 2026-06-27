---
title: Architecture Overview — Synarc Universal Skill Pack
description: Complete architecture documentation for Synarc Universal v6.6.4 (56 skills, Cognition Mesh, 8 active runtimes). Universal agent skill architecture, 7-layer design, compiler pattern, fallback tiers, dependency resolution, security model, directory structure.
version: 6.6.4
schema: skill-pack/v1
---

# Architecture Overview — Synarc Universal Skill Pack (v6.6.4)

## On this page

- [Universal Agent Skill Architecture](#universal-agent-skill-architecture)
- [7-Layer Design](#7-layer-design)
- [Compiler Pattern](#compiler-pattern)
- [Fallback Tier System](#fallback-tier-system)
- [Dependency Resolution Model](#dependency-resolution-model)
- [Security Model — Constitutional Guardrails](#security-model--constitutional-guardrails)
- [Directory Structure Reference](#directory-structure-reference)
- [v6.6.4 Subsystems](#v660-subsystems)

## Universal Agent Skill Architecture

The Synarc Universal Skill Pack defines a **write-once, deploy-anywhere** architecture for AI coding agent skills. A single SKILL.md authored in the universal format can be deployed to any of 8 active runtimes without modification (Roo Code shut down 2026-05-15; migrate to Cline).

```text
+-----------------------------------------------------------+
|                   Universal SKILL.md                       |
|  (Vendor-neutral, model-agnostic, tool-agnostic format)   |
+-----------------------------------------------------------+
                |
                v
+-----------------------------------------------------------+
|                    Compiler Pipeline                        |
|  (Transforms SKILL.md -> runtime-native formats)          |
+-----------------------------------------------------------+
    |       |       |       |       |       |       |       |
    v       v       v       v       v       v       v       v
  Codex  OpenCode Cursor  Gemini  Claude  Copilot Windsurf Cline
  CLI             IDE     CLI     Code            IDE     IDE
```

The architecture has three invariants:

1. **One source of truth** — SKILL.md is the canonical definition. Runtime adapters are generated, not authored.
2. **Fallback-first design** — Every capability defines 4 tiers. No single runtime capability gap breaks a workflow.
3. **Deterministic compilation** — Same SKILL.md + same runtime adapter = same agent behavior. No runtime-specific branching in source.

---

## 7-Layer Design

The pack is organized into 7 layers, each with a distinct responsibility.

```text
Layer 1: Schema       - JSON Schema definitions for all data structures
Layer 2: Authoring    - SKILL.md format specification and standards
Layer 3: Validation   - Conformance checking and integrity verification
Layer 4: Resolution   - Dependency resolution and version management
Layer 5: Compilation  - SKILL.md -> runtime-native format transformation
Layer 6: Testing      - Capability testing and cross-runtime verification
Layer 7: Distribution - Pack manifest, CI/CD, enterprise deployment, npm
```

### Layer 1 — Schema

Defines the formal data structures used across the pack. All schemas live in `shared/schemas/`. See [schemas.md](./schemas.md) for the full reference.

- `skill-manifest.schema.json` — SKILL.md frontmatter schema
- `intent-contract.schema.json` — formal agent commitments
- `intent-template.schema.json` — per-WorkType contract templates
- `verification-result.schema.json` — post-execution verdict
- `audit-record.schema.json` — hash-chained audit trail
- `risk-assessment.schema.json` — 6-level risk ladder
- `ledger-entry.schema.json` — session tracking ledger
- `brain-document.schema.json` — brain/ directory format
- `guardrails.schema.json` — constitutional safety rules

### Layer 2 — Authoring

Defines how skills are authored.

- `SCHEMA.md` — Full specification for the SKILL.md universal format
- `shared/standards/frontmatter-spec.md` — Frontmatter field definitions
- `shared/standards/naming-conventions.md` — Skill naming conventions

### Layer 3 — Validation

Ensures skills conform to the schema.

- Conformance levels: L1 (Basic) → L2 (Standard) → L3 (Strict) → L4 (Enterprise)
- L1 checks: Required fields present, no banned fields
- L2 checks: L1 + schema valid, references resolve, tiers complete
- L3 checks: L2 + no vendor lock-in, security scanned
- L4 checks: L3 + OWASP mapped, signed manifest

### Layer 4 — Resolution

Manages dependencies between skills.

- `manifest.yaml` — Pack manifest with all skills, versions, and dependency constraints
- Dependencies use semver constraints: `>=5.0.0`, `^5.0.0`, `~5.0.0`
- Dependency graph is validated at compile time
- Circular dependencies are detected and rejected

### Layer 5 — Compilation

The compiler pipeline transforms universal SKILL.md files into runtime-native formats.

```text
Input:  SKILL.md (universal format)
        + runtime adapter (shared/runtime-adapters/<agent>.md)
        + skill.yaml (machine-readable metadata)
        + guardrails.yaml (optional safety rules)

Output: Runtime-native format
        - AGENTS.md section (Codex, OpenCode, Gemini CLI, Copilot)
        - .mdc rule file (Cursor)
        - .windsurfrules section (Windsurf)
        - .clinerules file (Cline)
        - .roorules file (RooCode - reference only; Roo Code shut down 2026-05-15)
        - Native SKILL.md (Claude Code)

Steps:
  1. Parse frontmatter - extract name, description, version, activation triggers
  2. Apply runtime adapter - transform sections per adapter rules
  3. Filter sections - include/exclude based on runtime capabilities
  4. Transform output format - adapt box drawing, paths, persistence model
  5. Emit compiled result - runtime-native file or section
```

### Layer 6 — Testing

Verifies skills work correctly across runtimes.

- Capability tests per runtime adapter
- Cross-runtime behavior consistency checks
- Fallback tier verification
- Guardrail enforcement testing

### Layer 7 — Distribution

Manages pack distribution at scale. v6.6.4 adds **npm as a first-class distribution channel**.

- `manifest.yaml` — signed pack manifest with integrity hashes
- npm package `synarc-universal` — versioned, provenance-signed, with `synarc` CLI bin
- `synarc.lock.json` per project — exact install state
- CI/CD pipeline integration for automated compilation
- Enterprise deployment with version pinning
- Multi-team distribution via npm registry or internal mirror

---

## Compiler Pattern

The compiler uses SKILL.md as an **intermediate representation (IR)**. The universal format is not deployed directly — it is compiled to runtime-native formats.

```pseudocode
FUNCTION Compile(skill_path, runtime_adapter):
  skill = ParseSKILLMD(skill_path)
  metadata = ParseYAML(skill_path/skill.yaml)
  adapter = LoadAdapter(runtime_adapter)

  # 1. Parse frontmatter to extract activation model
  frontmatter = ExtractFrontmatter(skill)

  # 2. Apply adapter transformation rules
  compiled_sections = []
  FOR section IN skill.sections:
    IF adapter.ShouldInclude(section):
      transformed = adapter.Transform(section)
      compiled_sections.append(transformed)

  # 3. Generate runtime-native output
  output = adapter.FormatOutput(frontmatter, compiled_sections)
  RETURN output
```

The compiler is **deterministic** — the same input always produces the same output. There is no runtime state in compilation.

---

## Fallback Tier System

Every capability defines a 4-tier fallback chain. This is the core reliability mechanism.

| Tier | Name | Token Cost | Reliability | Availability |
|------|------|-----------|-------------|--------------|
| 1 | Native Execution | Lowest | Highest | Agent has built-in support |
| 2 | External Integration | Medium | High | Agent supports MCP/external APIs |
| 3 | Manual Workflow | Higher | Medium | Agent can output text instructions |
| 4 | Human-Assisted | Highest | Variable | Always available |

**Fallback resolution:**

```pseudocode
FUNCTION ExecuteCapability(capability, context):
  IF capability.Tier1.IsAvailable(context):
    RETURN capability.Tier1.Execute(context)
  ELSE IF capability.Tier2.IsAvailable(context):
    RETURN capability.Tier2.Execute(context)
  ELSE IF capability.Tier3.IsAvailable(context):
    RETURN capability.Tier3.Execute(context)
  ELSE:
    RETURN capability.Tier4.Execute(context)
```

---

## Dependency Resolution Model

Skills declare their dependencies in `skill.yaml`:

```yaml
dependencies:
  synarc-core: ">=5.0.0"
  change-intelligence: ">=2.0.0"
  backend-engineer: ">=2.0.0"
```

The `manifest.yaml` is the resolved view. At install time, the pack ships with all dependencies satisfied (it is a self-contained bundle). The `synarc.lock.json` records the exact installed version per project.

---

## Security Model — Constitutional Guardrails

The security model rests on **constitutional guardrails** — a set of 30+ non-negotiable rules that every agent must respect. Full rule list: [advanced/guardrails.md](./advanced/guardrails.md).

### Layers of Defense

```text
Layer 1: Constitutional Rules (shared/guardrails/constitutional-rules.yaml)
         - 30+ zero-tolerance rules
         - Non-bypassable via prompt
         - Mapped to OWASP LLM Top 10

Layer 2: Per-Skill Guardrails (skills/<skill>/guardrails.yaml)
         - Domain-specific extensions
         - Can ADD restrictions, never remove

Layer 3: Intent Contracts (intent-contract.schema.json)
         - Pre-execution scope commitment
         - risk_cap enforced at runtime
         - hard_floors_applied audit trail

Layer 4: Verification Engine (verification-result.schema.json)
         - Post-execution promise check
         - scope diff, risk delta, composite verdict

Layer 5: Audit Trail (audit-record.schema.json)
         - Hash-chained, append-only
         - Compliance exports (EU AI Act, SOC2, HIPAA, ISO 27001)
```

### Guardrail Types

| Type | Action | Example |
|---|---|---|
| `refuse` | Block the action | Never invent file paths (`fab-001`) |
| `redact` | Strip the sensitive data | Redact PII in audit records (`pii-001`) |
| `warn` | Allow with confirmation | Process untrusted input with sanitization (`prompt-003`) |
| `require_approval` | Pause and ask | Default to `risk_cap: CRITICAL` (`default-001`) |

### Source Files

- `shared/guardrails/constitutional-rules.yaml` — the canonical rule set
- `skills/<skill>/guardrails.yaml` — per-skill extensions
- `security/OWASP-LLM-mapping.md` — threat model and OWASP mapping

### Key Security Principles

- **Fail closed** — if a guardrail cannot be evaluated, the action is blocked
- **Non-bypassable** — a "ignore previous rules" instruction is itself a guardrail violation
- **Auditable** — every guardrail trigger creates an audit record
- **Domain-aware** — guardrails can be scoped to WorkType, agent, or risk level
- **OWASP-mapped** — every rule references the OWASP LLM Top 10 category it mitigates

---

## Directory Structure Reference

```text
synarc-universal/
├── AGENTS.md                    # Activation entry point
├── CHANGELOG.md                 # v6.x release history
├── CONTRIBUTING.md              # Contribution guide
├── LICENSE                      # MIT
├── README.md                    # Quick overview
├── SECURITY.md                  # Security policy
├── manifest.yaml                # Declarative skill catalog (56 entries)
├── package.json                 # npm package manifest
├── SCHEMA.md                    # SKILL.md format spec v1
├── skills/                      # 56 domain skills
│   └── <skill>/
│       ├── SKILL.md             # Main skill definition
│       ├── skill.yaml           # Machine-readable metadata
│       ├── guardrails.yaml      # Constitutional safety rules
│       ├── CHANGELOG.md         # Version history
│       ├── references/          # Optional reference documents
│       ├── templates/           # Optional templates
│       └── examples/            # Optional usage examples
├── shared/
│   ├── schemas/                 # 9 JSON Schemas
│   ├── workflows/               # Canonical workflow definitions
│   ├── guardrails/              # Constitutional safety rules
│   ├── standards/               # Naming, frontmatter, style
│   ├── runtime-adapters/        # Per-runtime compilation rules
│   ├── prompts/                 # Fallback prompt tiers
│   └── checklists/              # Code review, deploy, incident, pre-commit
├── security/                    # OWASP LLM mapping, adversarial scenarios
├── scripts/
│   ├── install.js               # Per-editor installer (CLI bin)
│   ├── install.ps1              # PowerShell delegate
│   └── lib/                     # CLI internals
├── docs/                        # Documentation
│   ├── README.md                # Landing page
│   ├── cli-reference.md         # CLI reference
│   ├── installation.md          # This file (install guide)
│   ├── architecture.md          # This file
│   ├── usage.md                 # Usage guide
│   ├── compatibility.md         # Compatibility matrix
│   ├── migration-guide.md       # v5 -> v6.6.4
│   ├── enterprise-deployment.md # Enterprise deployment
│   ├── schemas.md               # JSON Schemas reference
│   └── advanced/                # Deep dives
└── .github/
    └── workflows/               # CI/CD
        ├── validate-skills.yml
        └── publish.yml
```

---

## v6.6.4 Subsystems

Beyond the core architecture, v6.6.4 ships these major subsystems (each documented in [advanced/](./advanced/)):

| Subsystem | Doc | What it does |
|---|---|---|
| **Cognition Mesh** | [mesh.md](./advanced/mesh.md) | Multi-role collaboration runtime |
| **Intent Contracts** | [intent-contracts.md](./advanced/intent-contracts.md) | Pre-execution formal commitments |
| **Verification Engine** | [verification.md](./advanced/verification.md) | Post-execution promise verdict |
| **Audit Trail** | [audit.md](./advanced/audit.md) | Hash-chained, compliance-exported |
| **Brain** | [brain.md](./advanced/brain.md) | Lightweight state store |
| **Session Tracking** | [session-tracking.md](./advanced/session-tracking.md) | Append-only ledger |
| **WorkTypes** | [work-types.md](./advanced/work-types.md) | 12 WorkTypes, 7 dimensions |
| **Risk Assessment** | [risk-assessment.md](./advanced/risk-assessment.md) | 6-level risk ladder |
| **Guardrails** | [guardrails.md](./advanced/guardrails.md) | 30+ zero-tolerance rules |
| **Performance** | [performance.md](./advanced/performance.md) | Token budget and cache boundaries |

---

## See also

- [README](./README.md) — landing page
- [CLI Reference](./cli-reference.md) — every command and flag
- [Schemas](./schemas.md) — every JSON Schema
- [Compatibility](./compatibility.md) — runtime capability matrix
