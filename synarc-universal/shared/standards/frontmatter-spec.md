---
title: Frontmatter Specification v1
description: Universal frontmatter format for SKILL.md files
version: 1.0.0
schema: skill-pack/v1
---

# Frontmatter Specification v1

## Format

All SKILL.md files MUST begin with YAML frontmatter between `---` delimiters.

```yaml
---
name: skill-name
description: >
  When this skill activates.
version: 1.0.0
schema: skill-pack/v1
---
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Lowercase hyphenated identifier (`^[a-z0-9]+(-[a-z0-9]+)*$`) |
| `description` | string | When and how this skill activates (10-1000 chars) |
| `version` | string | Semantic version (`MAJOR.MINOR.PATCH`) |
| `schema` | string | Must be `skill-pack/v1` |

## Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string or array | — | Skill categorization |
| `tags` | array | — | Search/filter tags |
| `compatible_agents` | array | — | Supported agents |
| `author` | string | — | Skill author |
| `skill_type` | array | — | `workflow`, `capability`, `preference` |
| `priority` | string | `normal` | `low`, `normal`, `high`, `critical` |
| `dependencies` | map | `{}` | Skill dependencies with version constraints |
| `activation` | object | — | Activation configuration |

## Banned Fields

These MUST NOT appear:

- `activation: contextual` — use `skill_type` instead
- `activation: automatic` — use `skill_type` instead
- `cache:` — platform-specific
- `parent:` — use `dependencies:` instead
- `compatibility:` — use `compatible_agents:` instead
- `minimumVersion:` — use `dependencies:` instead

## Examples

### Minimal

```yaml
---
name: my-skill
description: >
  Activates when user requests code review.
version: 1.0.0
schema: skill-pack/v1
---
```

### Full

```yaml
---
name: security-engineer
description: >
  Activates when user reports a security vulnerability,
  asks for threat modeling, or requests security review.
  Performs vulnerability assessment, mitigation planning,
  and compliance checking.
version: 2.0.0
schema: skill-pack/v1
category:
  - architecture
  - security
tags:
  - security
  - threat-modeling
  - vulnerabilities
  - compliance
compatible_agents:
  - codex
  - opencode
  - cursor
  - claude-code
  - gemini-cli
author: Universal Skill Pack
skill_type:
  - capability
priority: high
dependencies:
  synarc-core: ">=5.0.0"
---
```
