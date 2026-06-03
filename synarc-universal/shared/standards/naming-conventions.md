---
title: Naming Conventions v1
description: Universal naming conventions for skills, files, and identifiers
version: 1.0.0
schema: skill-pack/v1
---

# Naming Conventions v1

## Skill Identifiers

- Use lowercase with hyphens: `backend-engineer`, `change-intelligence`
- NO underscores, NO camelCase
- Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`

## Files

- SKILL.md: Always uppercase `SKILL.md`
- skill.yaml: Always lowercase `skill.yaml`
- guardrails.yaml: Always lowercase `guardrails.yaml`
- CHANGELOG.md: Always uppercase `CHANGELOG.md`
- Schema files: `kebab-case.schema.json`
- Documentation: `kebab-case.md`

## Directories

- Skill directories: kebab-case matching skill ID
- `shared/` subdirectories: plural nouns (workflows, schemas, guardrails)
- All lowercase, no spaces

## Tags

- Lowercase with hyphens: `change-intelligence`, `risk-management`
- Single concept per tag
- Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`

## Categories

- Lowercase with hyphens
- One of: `architecture`, `development`, `security`, `devops`, `data`, `mobile`, `ml`, `leadership`, `engineering-intelligence`

## Version Tags

- Git tags: `vMAJOR.MINOR.PATCH` (e.g., `v5.0.0`)
- Release branches: `release/vMAJOR.MINOR`

## Guardrail IDs

- Format: `G-DOMAIN-NNN`
- Examples: `G-SEC-001`, `G-ETH-001`, `G-QUAL-001`
- Domain codes: SEC (security), ETH (ethics), QUAL (quality), PERF (performance), DATA (data), ARCH (architecture)
