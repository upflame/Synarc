---
title: Frontmatter Specification v6
description: Universal frontmatter format for SKILL.md files in Synarc Universal 6.x. Adds intent_triggers, cache_tier, and 3rd-person description rules.
version: 6.0.0
schema: skill-pack/v1
---

# Frontmatter Specification v6

All SKILL.md files MUST begin with YAML frontmatter between `---` delimiters. The frontmatter is the only part of the skill that is always loaded into the runtime system prompt. It is the routing layer and must be precise.

## Format

```yaml
---
name: skill-name
description: <one-line, 3rd person, 40-1024 chars>
version: 6.0.0
priority: normal
intent_triggers: [phrase-1, phrase-2, phrase-3]
cache_tier: domain
---
```

## Required fields

| Field | Type | Constraint | Purpose |
|---|---|---|---|
| `name` | string | `^[a-z0-9]+(-[a-z0-9]+)*$` | Must equal parent directory. Routing identifier. |
| `description` | string | 40-1024 chars, 3rd person | What the skill does and when to use it. Used for skill selection. |
| `version` | string | semver `MAJOR.MINOR.PATCH` | Skill version. Bump MAJOR on breaking skill-id change. |
| `priority` | string | one of `low \| normal \| high \| critical` | Activation priority. Determines which skills lose their description first when the system budget overflows. |
| `intent_triggers` | array of string | ≥ 2 items, lowercase-hyphenated | Keyword triggers for fast routing. Matched before semantic match on description. |
| `cache_tier` | string | one of `core \| domain \| episodic` | Caching hint to the runtime. `core` always cached; `domain` cached on first load; `episodic` rebuilt per turn. |

## Optional fields

| Field | Type | Default | Description |
|---|---|---|---|
| `category` | string or array | — | One of `engineering-intelligence`, `architecture`, `development`, `security`, `devops`, `data`, `mobile`, `ml`, `leadership`. |
| `tags` | array of string | — | Search/filter tags, lowercase-hyphenated. |
| `compatible_agents` | array | full set | Subset of `codex, opencode, cursor, gemini-cli, claude-code, copilot, windsurf, cline, roo-code`. |
| `author` | string | "Universal Skill Pack" | Skill author or maintainer. |
| `dependencies` | map | `{}` | Skill dependencies with semver constraints. |
| `allowed_tools` | array | — | Tools the skill requires. Omit unless explicit allow-listing is needed. |

## Description rules (the routing layer)

The `description` field is the most important line in the skill. It decides whether the skill fires. Follow these rules:

1. **Third person.** Never start with "I", "we", "you", "helps with", "assists in". Start with the verb describing what the skill does, or the noun describing what it produces.

   Good: "Classifies every change into 12 WorkTypes and 5 risk levels. Loads on any engineering interaction."
   Bad: "I help you classify your code changes."

2. **What + When.** State both what the skill does and the signals that trigger it. Include the specific nouns and verbs a user would type.

   Good: "Designs REST, GraphQL, and gRPC API contracts. Triggers on: endpoint, route, schema, OpenAPI, pagination, status code."
   Bad: "API design assistant."

3. **Concrete triggers.** Include 2-4 file types, command names, error patterns, or user phrasings. These get keyword-matched before semantic embedding.

4. **Banned starts.** The validator rejects descriptions starting with: `I `, `We `, `You `, `Helps `, `Assists `, `This `, `A `, `An ` (when followed by a vague noun).

5. **Length.** 80-200 chars is typical. Under 40 is too vague. Over 1 024 gets truncated and may drop the most important keywords.

## intent_triggers rules

The runtime matches `intent_triggers` first as keyword substrings against the user's request. Order matters: earlier items match first.

```yaml
intent_triggers:
  - bug
  - error
  - exception
  - stack trace
  - 500
  - not working
```

Each trigger should be a string a user actually types. Not jargon. Not library names. Plain phrases.

- ≥ 2 items required (validator fails below 2)
- Lowercase letters, digits, hyphens only
- No regex, no glob — literal substring match
- 2-5 items is typical; more than 7 dilutes the signal

## cache_tier rules

| Value | Caching behavior | When to use |
|---|---|---|
| `core` | Always loaded, always cached for session | `synarc-core`, `negative-prompts`, the runtime anchor |
| `domain` | Loaded on first intent match, cached for session | All domain skills (default) |
| `episodic` | Reloaded per turn | Skills that need fresh content (none in 6.x by default) |

## Banned fields (removed in 6.x)

The following fields from 5.x MUST NOT appear:

| Field | Reason |
|---|---|
| `activation: contextual` | Replaced by `intent_triggers` + `description` |
| `activation: automatic` | Replaced by `priority: critical` or `always-on` semantics in `intent_triggers` |
| `cache:` | Replaced by `cache_tier` + runtime auto-detection |
| `parent:` | Replaced by `dependencies` |
| `estimate:` | Replaced by validator-measured size in `dist/skill-metrics.json` |
| `compatibility:` | Replaced by `compatible_agents` |
| `minimumVersion:` | Replaced by `dependencies` |
| `skill_type:` | Replaced by frontmatter position + the 8-block template |

The validator (L1 conformance) fails any skill that includes a banned field.

## Examples

### Minimal

```yaml
---
name: my-skill
description: Reviews pull requests for correctness, security, and convention violations. Triggers on: pull request, PR, review, diff.
version: 6.0.0
priority: normal
intent_triggers: [pull request, PR review, review, diff]
cache_tier: domain
---
```

### Full

```yaml
---
name: security-engineer
description: Threat-models, audits, and hardens systems against injection, broken auth, and data exposure. Loads on security review, vulnerability fix, or compliance check requests.
version: 6.0.0
priority: high
intent_triggers: [security, vulnerability, CVE, threat model, audit, OWASP, exploit, hardening]
cache_tier: domain
category: security
tags: [security, threat-modeling, vulnerabilities, compliance, owasp]
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
author: Universal Skill Pack
dependencies:
  synarc-core: ">=6.0.0"
  negative-prompts: ">=6.0.0"
---
```

## Migration from 5.x

| 5.x field | 6.x replacement |
|---|---|
| `description: >` (block scalar) | `description: "..."` (single line, double-quoted) — block scalars produce different token sequences across runtimes |
| `skill_type: [capability, workflow]` | Removed; the 8-block template replaces it |
| `priority: normal` | Unchanged |
| `activation: { type: intent-based, triggers: [...] }` | Split into top-level `intent_triggers: [...]` + `description: "..."` |
| `compatible_agents: [codex, opencode, ...]` | Unchanged |

The validator auto-migrates block-scalar descriptions at validation time, but the rewrite pass converts them.
