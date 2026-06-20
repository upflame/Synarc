---
title: Architecture Overview — Synarc Universal Skill Pack
description: Complete architecture documentation for Synarc Universal v6.5.0 (56 skills, Cognition Mesh, 8 active runtimes). Covers the universal agent skill architecture, 7-layer design, compiler pattern, fallback tier system, dependency resolution, security model, and full directory structure reference.
version: 6.5.0
schema: skill-pack/v1
---

# Architecture Overview — Synarc Universal Skill Pack

## Universal Agent Skill Architecture

The Synarc Universal Skill Pack defines a **write-once, deploy-anywhere** architecture for AI coding agent skills. A single SKILL.md authored in the universal format can be deployed to any of 8 active runtimes without modification (Roo Code shut down 2026-05-15; migrate to Cline).

```
+-----------------------------------------------------------+
|                   Universal SKILL.md                        |
|  (Vendor-neutral, model-agnostic, tool-agnostic format)    |
+-----------------------------------------------------------+
                |
                v
+-----------------------------------------------------------+
|                    Compiler Pipeline                        |
|  (Transforms SKILL.md → runtime-native formats)            |
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

```
Layer 1: Schema       — JSON Schema definitions for all data structures
Layer 2: Authoring    — SKILL.md format specification & standards
Layer 3: Validation   — Conformance checking & integrity verification
Layer 4: Resolution   — Dependency resolution & version management
Layer 5: Compilation  — SKILL.md → runtime-native format transformation
Layer 6: Testing      — Capability testing & cross-runtime verification
Layer 7: Distribution — Pack manifest, CI/CD, enterprise deployment
```

### Layer 1 — Schema

Defines the formal data structures used across the pack.

- `shared/schemas/skill-manifest.schema.json` — SKILL.md frontmatter schema
- `shared/schemas/guardrails.schema.json` — Constitutional guardrail rules
- `shared/schemas/ledger-entry.schema.json` — Session tracking ledger
- `shared/schemas/risk-assessment.schema.json` — Risk assessment output
- `shared/schemas/brain-document.schema.json` — Brain document format

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

```
Input:  SKILL.md (universal format)
        + runtime adapter (shared/runtime-adapters/<agent>.md)
        + skill.yaml (machine-readable metadata)
        + guardrails.yaml (optional safety rules)

Output: Runtime-native format
        — AGENTS.md section (Codex, OpenCode, Gemini CLI, Copilot)
        — .mdc rule file (Cursor)
        — .windsurfrules section (Windsurf)
        — .clinerules file (Cline)
        — .roorules file (RooCode - reference only; Roo Code shut down 2026-05-15)
        — Native SKILL.md (Claude Code)

Steps:
  1. Parse frontmatter — extract name, description, version, activation triggers
  2. Apply runtime adapter — transform sections per adapter rules
  3. Filter sections — include/exclude based on runtime capabilities
  4. Transform output format — adapt box drawing, paths, persistence model
  5. Emit compiled result — runtime-native file or section
```

### Layer 6 — Testing

Verifies skills work correctly across runtimes.

- Capability tests per runtime adapter
- Cross-runtime behavior consistency checks
- Fallback tier verification
- Guardrail enforcement testing

### Layer 7 — Distribution

Manages pack distribution at scale.

- `manifest.yaml` — signed pack manifest with integrity hashes
- CI/CD pipeline integration for automated compilation
- Enterprise deployment with version pinning
- Multi-team distribution via package registries

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

The compiler is deterministic — the same input always produces the same output. There is no runtime state in compilation.

---

## Fallback Tier System

Every capability defines a 4-tier fallback chain. This is the core reliability mechanism.

| Tier | Name | Token Cost | Reliability | Availability |
|------|------|-----------|-------------|-------------|
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

Tier availability is determined by runtime detection (S0.1 in synarc-core). Each runtime adapter defines which tiers are available for each capability.

**Example — Change Classification:**
- Tier 1: Agent classifies natively via built-in prompt patterns
- Tier 2: Agent calls external classification API
- Tier 3: Agent follows manual WorkType taxonomy from SKILL.md
- Tier 4: Agent produces structured output for human classification

---

## Dependency Resolution Model

Skills declare dependencies in their `skill.yaml`:

```yaml
dependencies:
  synarc-core: ">=5.0.0"
```

The resolution algorithm:

1. Build full dependency graph from `manifest.yaml`
2. Check for circular dependencies — reject if found
3. Resolve version constraints using semver matching
4. Detect conflicts — same skill required at incompatible versions
5. Produce resolved dependency tree

**Constraint syntax:**

| Constraint | Meaning |
|-----------|---------|
| `>=5.0.0` | Minimum version 5.0.0 |
| `^5.0.0` | Compatible with 5.x (any 5.y.z) |
| `~5.0.0` | Approximately 5.0.0 (any 5.0.z) |
| `>=5.0.0, <6.0.0` | Range between versions |

All 41 skills in the pack depend on `synarc-core >=5.0.0`. There are no cross-skill dependencies between domain skills — they depend only on the core runtime.

---

## Security Model — Constitutional Guardrails

The security model is based on **constitutional guardrails** — deterministic rules that cannot be bypassed by user instruction.

### Layers of Defense

```
Layer 1: Refusal Rules        — Block prohibited actions
Layer 2: Safety Constraints   — Enforce secure patterns
Layer 3: Honesty Rules        — Capability boundaries
Layer 4: Escalation Policy    — Auto-escalate on critical events
```

### Guardrail Types

| Type | Severity | Behavior |
|------|----------|----------|
| Refusal | block | Halt execution, emit refusal response |
| Constraint | strict | Enforce pattern, do not violate |
| Constraint | recommended | Warn on violation, allow with note |
| Honesty | informational | Declare capability boundary |

### Source Files

- `shared/guardrails/constitutional-rules.yaml` — Universal rules for all skills
- `skills/<skill>/guardrails.yaml` — Skill-specific overrides
- `skills/synarc-core/guardrails.yaml` — Core runtime rules

### Key Security Principles

1. **Deterministic enforcement** — Same input always produces same guardrail decision
2. **No override by user instruction** — User cannot lower guardrail severity
3. **Defense in depth** — Multiple overlapping guardrails for critical domains
4. **Auditable** — All guardrail violations are logged in the session ledger
5. **OWASP mapped** — Refusal rules reference OWASP LLM categories

---

## Directory Structure Reference

```
synarc-universal/
├── AGENTS.md                          # Universal activation file for all agents
├── manifest.yaml                      # Pack manifest with integrity hashes
├── SCHEMA.md                          # SKILL.md universal format specification
│
├── docs/                              # Documentation
│   ├── installation.md                # Per-agent installation guide
│   ├── compatibility.md               # Capability × runtime matrix
│   ├── architecture.md                # This file — architecture overview
│   ├── usage.md                       # Usage guide & examples
│   └── enterprise-deployment.md       # Enterprise-scale deployment guide
│
├── skills/                            # All 41 domain skills
│   ├── synarc-core/                   # Core runtime (always active)
│   │   ├── SKILL.md                   # Main skill definition (21 sections)
│   │   ├── skill.yaml                 # Machine metadata
│   │   ├── guardrails.yaml            # Core safety rules
│   │   └── CHANGELOG.md              # Version history
│   │
│   ├── cognition-layer/               # Reasoning architecture
│   ├── change-intelligence/           # Change taxonomy & impact
│   ├── coding-agent/                  # Code generation & execution
│   ├── negative-prompts/              # Prohibition enforcement
│   ├── project-scales/                # Scale detection & adaptation
│   ├── schemas/                       # Brain document schemas
│   ├── testing-strategy/              # Risk-based testing
│   ├── backend-engineer/              # Backend architecture
│   ├── frontend-engineer/             # Frontend architecture
│   ├── ui-engineer/                   # UI implementation
│   ├── ux-engineer/                   # UX design & research
│   ├── fullstack-engineer/            # End-to-end feature delivery
│   ├── data-engineer/                 # Data pipeline & ETL
│   ├── mobile-engineer/               # Mobile app architecture
│   ├── ml-engineer/                   # ML pipeline & MLOps
│   ├── infrastructure-engineer/       # Platform & networking
│   ├── devops-engineer/               # CI/CD & deployment
│   ├── sre-engineer/                  # SLOs, error budgets
│   ├── observability-engineer/        # Metrics, tracing, logging
│   ├── platform-engineer/             # Internal developer platforms
│   ├── security-engineer/             # Threat modeling & defense
│   ├── privacy-engineer/              # Data privacy & compliance
│   ├── ethics-engineer/               # AI ethics & fairness
│   ├── architect/                     # Systems architecture
│   ├── api-designer/                  # REST/GraphQL/gRPC design
│   ├── database-architect/            # Data modeling & indexing
│   ├── chaos-engineer/                # Failure injection & resilience
│   ├── staff-engineer/                # Technical leadership
│   ├── cto/                           # Technology strategy
│   ├── engineering-manager/           # Team & delivery management
│   ├── product-engineer/              # Product-minded engineering
│   ├── finops-engineer/               # Cloud cost optimization
│   ├── performance-thinker/           # Latency & throughput
│   ├── incident-commander/            # Incident response & ICS
│   ├── debug-engineer/                # Systematic debugging
│   ├── decision-engineer/             # Decision frameworks & ADRs
│   ├── risk-analyst/                  # Risk analysis & mitigation
│   ├── foundational-reasoning/        # First principles & systems thinking
│   ├── problem-solver/                # Structured problem solving
│   └── [16 additional domain skills]  # Full list in manifest.yaml
│
├── shared/
│   ├── workflows/                     # Canonical workflow definitions
│   │   ├── change-classification.md   # 12 WorkType taxonomy
│   │   ├── risk-assessment.md         # 6-level risk ladder
│   │   ├── session-tracking.md        # Immutable ledger protocol
│   │   ├── quality-gates.md           # Per-WorkType verification
│   │   ├── error-intelligence.md      # 6-step error protocol
│   │   └── context-injection.md       # COMPACT/STANDARD/FULL injection
│   │
│   ├── guardrails/
│   │   └── constitutional-rules.yaml  # Universal safety rules (all skills)
│   │
│   ├── schemas/                       # JSON Schema definitions
│   │   ├── skill-manifest.schema.json # SKILL.md frontmatter schema
│   │   ├── guardrails.schema.json     # Guardrail rule schema
│   │   ├── ledger-entry.schema.json   # Session ledger schema
│   │   ├── risk-assessment.schema.json# Risk output schema
│   │   └── brain-document.schema.json # Brain doc schema
│   │
│   ├── standards/
│   │   ├── frontmatter-spec.md        # Frontmatter field specification
│   │   └── naming-conventions.md      # Skill naming conventions
│   │
│   └── runtime-adapters/              # Per-agent compilation rules
│       ├── codex.md                   # Codex CLI adapter
│       ├── opencode.md                # OpenCode adapter
│       ├── cursor.md                  # Cursor IDE adapter
│       ├── gemini-cli.md              # Gemini CLI adapter
│       ├── claude-code.md             # Claude Code adapter
│       ├── copilot.md                 # GitHub Copilot adapter
│       ├── windsurf.md                # Windsurf IDE adapter
│       ├── cline.md                   # Cline adapter
│       └── roo-code.md               # RooCode adapter (reference only; Roo Code shut down 2026-05-15)
│
└── scripts/
    └── convert-child-plugins.ps1      # Legacy plugin conversion utility
```
