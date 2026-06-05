---
title: SKILL.md Universal Format Specification v1
description: Formal specification for the open SKILL.md agent skill format
version: 1.0.0
status: draft
author: Universal Skill Pack
schema: skill-pack/v1
---

# SKILL.md Universal Format Specification v1

## 1. Introduction

### 1.1 Purpose

This specification defines the **SKILL.md** format — a universal, markdown-based agent skill format compatible with Codex, OpenCode, Cursor, Gemini CLI, Claude Code, GitHub Copilot, Windsurf, Cline, RooCode, and all future SKILL.md-compliant coding agents.

### 1.2 Design Goals

| Goal | Description |
|------|-------------|
| Vendor-neutral | No platform-specific constructs |
| Model-agnostic | No LLM-specific assumptions |
| Tool-agnostic | No hardcoded tool dependencies |
| Fallback-first | Every capability has 4-tier fallback |
| Deterministic | Same input → same behavior |
| Self-contained | No external dependencies for basic operation |
| Cache-friendly | Section boundaries enable prefix caching |
| Validatable | Formal schema enables automated checks |

### 1.3 Conformance

A SKILL.md file conforms to this specification if it satisfies all requirements in sections 2-7. Conformance is determined by **formal validation** against the JSON Schema defined in `shared/schemas/skill-manifest.schema.json`.

---

## 2. File Structure

### 2.1 Directory Layout

```
skill-directory/
├── SKILL.md              # REQUIRED: Main skill definition
├── skill.yaml            # RECOMMENDED: Machine-readable metadata
├── guardrails.yaml       # RECOMMENDED: Constitutional safety rules
├── CHANGELOG.md          # RECOMMENDED: Version history
├── references/           # OPTIONAL: Reference documents
├── templates/            # OPTIONAL: Templates
├── assets/               # OPTIONAL: Icons, diagrams
└── examples/             # OPTIONAL: Usage examples
```

### 2.2 File Encoding

- **Format**: UTF-8 encoded Markdown (CommonMark compliant)
- **Line endings**: LF (Unix) or CRLF (Windows)
- **Max line length**: 120 characters (recommended)
- **Indentation**: 2 spaces per level

### 2.3 File Size Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Max SKILL.md size | 1 MB | Agent context window constraints |
| Max section size | 50 KB | Cache boundary optimization |
| Max reference file | 200 KB | Load-on-demand efficiency |
| Recommended frontmatter | < 10 KB | Fast parsing |

---

## 3. Frontmatter Specification

### 3.1 Required Fields

```yaml
---
name: skill-name               # Lowercase hyphenated identifier
description: >                 # When this skill activates
  Exact conditions for activation.
  Define scope, limitations, expected inputs,
  expected outputs and activation signals.
version: 1.0.0                 # Semantic version (MAJOR.MINOR.PATCH)
schema: skill-pack/v1          # Schema version (fixed)
---
```

### 3.2 Optional Fields

```yaml
category:                      # Skill categorization
  - architecture
  - development
  - security
  - devops
  - data
  - mobile
  - ml
  - leadership
  - engineering-intelligence

tags:                          # Search/filter tags
  - audit
  - security
  - review

compatible_agents:             # Known compatible agents
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code

author: Universal Skill Pack   # Author or maintainer

skill_type:                    # Type classification
  - workflow                   # Step-by-step process
  - capability                 # Reusable capability
  - preference                 # Behavioral preference

priority: normal               # Activation priority (low/normal/high/critical)

estimate: 200 paragraphs       # Estimated skill size

dependencies:                  # Skill dependencies (version 5+)
  synarc-core: ">=5.0.0"
```

### 3.3 Banned Fields

The following fields from legacy platforms MUST NOT appear in frontmatter:

| Field | Reason |
|-------|--------|
| `activation: contextual` | Platform-specific |
| `activation: automatic` | Replaced by `skill_type` and intent-based |
| `cache:` | Platform-specific optimization |
| `parent:` | Replaced by `dependencies:` |
| `estimate:` | Replaced by contract in skill.yaml |
| `compatibility:` | Replaced by `compatible_agents:` |
| `minimumVersion:` | Replaced by `dependencies:` |

### 3.4 Frontmatter Grammar (EBNF)

```ebnf
frontmatter      = "---", newline, { metadata-line }, "---", newline;
metadata-line    = key, ":", value, newline;
key              = letter, { letter | "-" | "_" };
value            = scalar | list | nested-map;
scalar           = string | number | boolean;
string           = ? any UTF-8 text ? ;
number           = digit, { digit }, [ ".", digit, { digit } ];
boolean          = "true" | "false" | "yes" | "no";
list             = newline, { indentation, "-", scalar, newline };
nested-map       = newline, { indentation, key, ":", scalar, newline };
```

---

## 4. Body Specification

### 4.1 Section Structure

```markdown
# Skill Title

## Purpose

What the skill solves.

## Activation Conditions

WHEN:
- condition 1
- condition 2

THEN:
Activate this skill

## Required Inputs

- input 1
- input 2

## Capabilities

### Capability: Capability Name

#### Tier 1 — Native Execution

#### Tier 2 — External Integration

#### Tier 3 — Manual Workflow

#### Tier 4 — Human-Assisted

## Validation

Success criteria.

## Failure Handling

Edge cases and recovery.

## Output Format

Required output structure.

## Quality Checklist

Verification steps.

## Security Checklist

Risk analysis.

## Performance Checklist

Optimization review.
```

### 4.2 Section Types

#### Mandatory Sections

Every SKILL.md MUST contain:

| Section | Description |
|---------|-------------|
| `# Title` | Skill name and one-line description |
| `## Purpose` | What problem this skill solves |
| `## Activation Conditions` | When this skill activates (WHEN/THEN format) |
| `## Capabilities` | One or more capability blocks, each with 4 tiers |

#### Optional Sections

| Section | Description |
|---------|-------------|
| `## Required Inputs` | Expected input information |
| `## Validation` | Success criteria |
| `## Failure Handling` | Edge cases and recovery |
| `## Output Format` | Required output structure |
| `## Quality Checklist` | Verification steps |
| `## Security Checklist` | Risk analysis |
| `## Performance Checklist` | Optimization review |

### 4.3 Capability Block Specification

Each capability block MUST have 4 tiers:

```markdown
### Capability: <name>

#### Tier 1 — Native Execution

[Agent-native workflow — use when agent has the capability built-in]

#### Tier 2 — External Integration

[If Tier 1 unavailable: use external tools, APIs, or services]

#### Tier 3 — Manual Workflow

[If Tier 2 unavailable: provide step-by-step manual instructions]

#### Tier 4 — Human-Assisted

[If all above unavailable: structured output for human review]
```

### 4.4 Intent-Based Activation

```markdown
## Activation Conditions

WHEN:
- user requests debugging
- user reports runtime error
- user asks for root cause analysis
- user requests production investigation

THEN:
Activate Debug Skill
```

Activation conditions use intent-based matching. No platform-specific commands allowed (no `/run`, `/debug`, `/code-review`).

---

## 5. Fallback System

### 5.1 Tier Definitions

| Tier | Name | Description | Token Cost | Reliability |
|------|------|-------------|------------|-------------|
| 1 | Native Execution | Agent performs capability natively | Lowest | Highest |
| 2 | External Integration | Use external tools/APIs | Medium | High |
| 3 | Manual Workflow | Step-by-step manual instructions | Higher | Medium |
| 4 | Human-Assisted | Structured output for human review | Highest | Variable |

### 5.2 Fallback Rules

```pseudocode
FUNCTION Execute-Capability(capability, context):
  IF capability.Tier1.IsAvailable(context):
    RETURN capability.Tier1.Execute(context)
  ELSE IF capability.Tier2.IsAvailable(context):
    RETURN capability.Tier2.Execute(context)
  ELSE IF capability.Tier3.IsAvailable(context):
    RETURN capability.Tier3.Execute(context)
  ELSE:
    RETURN capability.Tier4.Execute(context)
```

### 5.3 Capability Availability Test

```pseudocode
FUNCTION IsAvailable(tier, context):
  SWITCH tier:
    CASE "native":
      RETURN agent.HasNativeCapability(tier.required_tools)
    CASE "external":
      RETURN agent.SupportsToolCalls()
        AND tier.tool_specifications.Available()
    CASE "manual":
      RETURN context.IsInteractive()
    CASE "human-assisted":
      RETURN TRUE  // Always available as last resort
```

---

## 6. Reference Resolution

### 6.1 Internal References

References within a SKILL.md file use relative paths:

```markdown
See [references/taxonomy.md](references/taxonomy.md) for full taxonomy.
See [templates/decision-log.md](templates/decision-log.md) for ADR template.
```

### 6.2 Shared References

References to shared resources use the `shared/` prefix:

```markdown
See [shared/workflows/change-classification.md](../../../shared/workflows/change-classification.md)
```

### 6.3 Reference Resolution Rules

1. Relative paths are resolved from the SKILL.md file's directory
2. `shared/` prefix resolves from the skill pack root
3. Absolute paths are NOT allowed
4. External URLs are allowed but discouraged
5. Broken references MUST be detected by validation

---

## 7. Compatibility

### 7.1 Agent Feature Matrix

| Feature | Codex | OpenCode | Cursor | Gemini | Claude | Copilot | Windsurf | Cline | RooCode |
|---------|-------|----------|--------|--------|--------|---------|----------|-------|---------|
| YAML frontmatter | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Intent activation | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Tier 1 (native) | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Tier 2 (external) | N | N | N | Y | Y | N | N | Y | Y |
| Tier 3 (manual) | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Tier 4 (human) | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Brain persistence | N | Y | N | N | Y | N | N | Y | Y |
| File operations | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Command exec | Y | Y | N | Y | Y | N | Y | Y | Y |
| Guardrails | N | N | N | N | Y | N | N | N | N |

### 7.2 Graceful Degradation

When a feature is not available on the current agent:

1. Check the feature's Tier 2-4 fallback chain
2. If no fallback exists, emit a capability notification: "Capability X is not available on this agent"
3. Continue with reduced functionality

---

## 8. Validation

### 8.1 Conformance Levels

| Level | Requirements | Use Case |
|-------|-------------|----------|
| L1 — Basic | Required fields present, no banned fields | Quick check |
| L2 — Standard | L1 + schema valid, refs resolve, tiers complete | CI gate |
| L3 — Strict | L2 + no vendor lock-in, security scanned | Production |
| L4 — Enterprise | L3 + OWASP mapped, signed manifest | Regulated |

### 8.2 Validation Schema

See `shared/schemas/skill-manifest.schema.json` for the formal JSON Schema definition.

---

## 9. Versioning

### 9.1 Semantic Versioning for Skills

| Component | Breaking Change |
|-----------|----------------|
| MAJOR | Activation triggers changed, capability removed, guardrails weakened, compatibility dropped |
| MINOR | New capability, new trigger, new reference, improved descriptions |
| PATCH | Typo fix, example fix, clarification |

### 9.2 Dependency Constraints

```yaml
dependencies:
  synarc-core: ">=5.0.0"         # Minimum version
  synarc-core: "^5.0.0"          # Compatible with 5.x
  synarc-core: "~5.0.0"          # Approximately 5.0.0
  synarc-core: ">=5.0.0, <6.0.0" # Range
```

---

## 10. Integrity

### 10.1 Hash Verification

Every skill pack distribution includes SHA-256 hashes in the manifest:

```yaml
integrity:
  algorithm: sha256
  hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

### 10.2 Signature Verification (Optional)

For enterprise deployment, manifests MAY be GPG-signed:

```yaml
integrity:
  algorithm: sha256
  hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  signed: true
  signature: <base64-encoded-signature>
  signer: <key-id>
  timestamp: "2026-06-02T00:00:00Z"
```
