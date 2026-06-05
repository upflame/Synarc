---
title: Skill Style Specification v6
description: Writing rules for SKILL.md files in Synarc Universal — 8-block template, 12 writing tricks, cache boundaries, token budgets.
version: 6.0.0
schema: skill-pack/v1
---

# Skill Style Specification v6

This document is normative. Every SKILL.md in the pack must conform. The rules here are what `scripts/validate-skills.ps1` enforces.

## 1. Size budgets (hard fail at the upper bound, warn at the lower)

| Limit | Hard fail | Warn |
|---|---|---|
| SKILL.md body | > 1 000 lines | > 500 lines |
| SKILL.md bytes | > 50 KB | > 30 KB |
| Estimated tokens (4 chars/token) | > 12 000 | > 6 000 |
| `description:` length | < 40 or > 1 024 chars | < 80 chars |
| `intent_triggers:` items | < 2 | < 4 |
| Per skill, `references/*.md` files | any < 1 KB | any < 2 KB |

Above 30 KB or 500 lines, the skill must be split: keep the 8-block skeleton in `SKILL.md`, move dense material into `references/`.

## 2. The 8-block template (mandatory section order)

Every SKILL.md uses these blocks, in this order. The first three are the cache anchor and must be byte-stable for the version.

### 2.1 Frontmatter (YAML, 6-9 lines)

```yaml
---
name: kebab-case-skill-name
description: <3rd person, what + when, ≤ 1024 chars, 2-5 trigger nouns/verbs>
version: 6.0.0
priority: critical | high | normal
intent_triggers: [verb-phrase, noun-phrase, file-type, ...]
cache_tier: core | domain | episodic
allowed_tools: [tool-name, ...]    # optional, only if the skill needs explicit allow-listing
---
```

Rules:
- `name` matches parent directory exactly. Lowercase letters, digits, hyphens. No underscores. No capitals. No reserved words: `anthropic`, `claude`, `gpt`, `gemini`.
- `description` is the routing layer. It decides whether the skill fires. Written in third person. Includes both what the skill does and when it triggers. No "I", "we", "you" at the start. No filler like "helps with" or "assists in".
- `intent_triggers` is a flat array of 2-5 lowercase-hyphenated strings. The runtime uses these for keyword matching before falling back to semantic match on `description`.
- `cache_tier` tells the runtime how aggressively to cache the file: `core` (always cached for session), `domain` (cached on first activation), `episodic` (per-turn).

### 2.2 Block 1 — Persona (2 lines, cache-stable)

```markdown
# Skill Name

You are <name>, <one-line role>. You operate in <scope>.

You <one hard "never" sentence — what you refuse or always do>.
```

Rules:
- Two lines. Third person. No "I am". No mission statement. No "passionate about" filler.
- The second sentence is the load-bearing prohibition. It should be the single most important thing the agent must not violate.

### 2.3 Block 2 — When to activate (≤ 5 bullets)

```markdown
## When to activate

Activate when the user's request matches any of these signals:
- <verb phrase> (e.g., "review this pull request", "the API is returning 500")
- <noun phrase> (e.g., "OAuth token", "connection pool")
- <file type or path pattern> (e.g., "*.sql migration", "in src/auth/*")
```

Rules:
- 3-5 bullets, each one a concrete user phrasings or file pattern.
- The phrasing is what a real user would actually type. Not "review my code" but "the password reset endpoint returns 500 intermittently".

### 2.4 Block 3 — Workflow (numbered steps, with decision tree)

```markdown
## Workflow

1. <first step — verb the user understands>
2. <second step>
3. If <condition>, <branch A>; otherwise, <branch B>
4. <next step>
```

Rules:
- Numbered list, not bullet list. Agents follow numbered sequences more reliably.
- Each step is a single action the agent can complete with one or two tool calls.
- Decision branches use the `If X, A; otherwise, B` form. No "consider whether to".
- 5-9 steps. If you need more, the skill is too broad — split it.

### 2.5 Block 4 — Decision rules (table only if it compresses ≥ 3×)

```markdown
## Decision rules

| Condition | Action | Why |
|---|---|---|
| <observable signal> | <single verb + object> | <one-line reason> |
```

Rules:
- Use a table only when the rule has ≥ 3 rows AND prose would be longer.
- Cells are short noun phrases, not full sentences. Move full reasoning to prose above the table.
- No more than 8 rows. If you have more, push them into `references/decision-rules.md`.

### 2.6 Block 5 — Output format (concrete template)

```markdown
## Output format

When <user asks X>, emit exactly:

​```text
<3-10 line example of expected output, with real placeholder shapes>
​```
```

Rules:
- Always a code block, never prose description of a format.
- The example shows placeholders like `<RISK>`, `<file>`, `<reason>`, not real data.
- If the skill has multiple output shapes, show 2-3 short templates, each 3-6 lines.
- No "use this format" prose — only the template.

### 2.7 Block 6 — Gotchas (≤ 8 imperative bullets)

```markdown
## Gotchas

- If <condition>, then <action>. <one-line reason>.
- Never <prohibition>. <one-line reason>.
- Always <requirement>. <one-line reason>.
```

Rules:
- Imperative mood. "Never", "Always", "If X, then Y". No "you should", "you could", "consider".
- Each gotcha catches something the agent gets wrong repeatedly on real tasks.
- 5-8 bullets. More than 8 means the skill is not yet focused enough.

### 2.8 Block 7 — References (one level deep, with purpose)

```markdown
## References

- `references/commands.txt` — flat-text command catalog, loaded on demand
- `references/error-codes.md` — error code lookup with remediation
- `references/checklist.md` — pre-commit / pre-deploy verification
```

Rules:
- One level deep only. `SKILL.md` → `references/X.md`. Never `references/X/Y.md`.
- Each reference is named for what it contains, not for what it is. `auth-errors.md`, not `file2.md`.
- Any reference file < 1 KB must be filled or deleted — the validator fails.
- For dense lookups (commands, error codes, alert rules), use `.txt` flat text, not `.md`. This cuts token cost 65-70%.

### 2.9 Block 8 — Changelog (last 3 versions)

```markdown
## Changelog

- **6.0.0** — Rewrote from 5.x. Body 2.2 MB → 30 KB. 12 writing tricks applied.
- **5.1.0** — Added ...
- **5.0.0** — Initial universal release.
```

Rules:
- 3 most recent versions only. Older history goes in `CHANGELOG.md` next to the file.
- Newest first. One line per version with a concrete delta.

## 3. The 12 writing tricks

### Trick 1 — Persona in 2 lines, 3rd person

The opening must name the agent, role, and scope in two lines. No mission statements.

### Trick 2 — "Think HOLISTICALLY and COMPREHENSIVELY BEFORE..."

Before any multi-step action, force a scan: existing patterns, callers, test files, state. Then state scope.

### Trick 3 — "Before calling each tool, first explain why"

Name the file, the operation, the risk, and the rollback path. Wait for confirmation if risk is HIGH+.

### Trick 4 — "NEVER refer to tool names when speaking to the USER"

Address the task, not the tools. "I will check the order total", not "I will run the read_file tool".

### Trick 5 — Direct imperative, never hedging

Replace "you should" / "you could" / "you might want to" with "Run", "Read", "Apply", "Refuse".

### Trick 6 — Gotchas section with concrete near-misses

The single highest-ROI block. Captures the things the agent gets wrong repeatedly.

### Trick 7 — Flat-text references for dense catalogs

`.txt` (not `.md`) for command lists, error codes, alert catalogs. No Markdown syntax in references.

### Trick 8 — Concrete templates, not format prose

A 4-line code block of expected output beats 200 words describing the format.

### Trick 9 — 3rd-person description with concrete triggers

"Extracts text and tables from PDF files" is findable. "Helps with documents" is invisible.

### Trick 10 — One stable prefix, one dynamic tail

Frontmatter + persona + activation are byte-stable for the version. Dynamic state lives in the conversation, never in the skill.

### Trick 11 — "Start your response with..."

Force the model to begin with a one-line classification: `WORKTYPE | RISK | SCOPE`. No preamble.

### Trick 12 — Tool etiquette rules

Never mention tool names. Name the file and operation before each call. Classify errors before retry. Never retry permanent errors.

## 4. Language rules (banned vocabulary)

The following words are banned in all SKILL.md bodies (prohibitions come from `negative-prompts/SKILL.md` Domain 14).

| Category | Banned |
|---|---|
| False precision | "iteratively", "continuously enhance", "progressively" (used as filler) |
| Vacuous hedging | "should", "could", "might", "perhaps", "potentially" (use "must", "will", "does") |
| Manager-speak | "leverage", "holistic", "robust", "granular", "actionable", "comprehensive" (use specific terms) |
| Padding | "firstly", "in conclusion", "it is worth noting", "please note" (delete) |
| Euphemisms | "edge case" (use "bug" or "boundary condition"), "tech debt" (use "poor implementation") |
| Passive voice | "the column was dropped" (use "DROP COLUMN executed") |
| Self-deprecation | "this might be a dumb question but" (delete the apology) |
| Time padding | "at this time", "at this point", "currently" (delete) |
| Vague quantifiers | "some", "several", "many" (use exact numbers) |

Exceptions: domain-specific terms where the word has precise meaning (e.g., "leverage" in financial engineering, "comprehensive" in test coverage). When in doubt, replace.

## 5. Cache architecture (prompt-caching friendly)

Skills participate in a 4-tier cache. The order is fixed; the runtime reads from top to bottom.

```
[Tier 0 — runtime header]   AGENTS.md + manifest.yaml + intent_triggers index
                            ~300 tokens, always loaded, always cached

[Tier 1 — synarc-core]      skills/synarc-core/SKILL.md
                            ~6 000 tokens, loaded on first task, cached for session

[Tier 2 — active skill]     skills/<active>/SKILL.md
                            ~3-5 KB, loaded on intent match, cached after first load

[Tier 3 — on-demand refs]   skills/<active>/references/*
                            ~500-2 000 tokens each, loaded only when workflow step requires

[Tier 4 — task context]     User request, open files, current ledger
                            Variable, never cached
```

Rules:
- Tiers 0-2 are byte-stable for the version. The runtime never rewrites them.
- Tiers 0-2 must contain no timestamps, no session IDs, no user-specific data, no tool results.
- All dynamic state lives in Tier 4 (conversation) or in `brain/` (filesystem, runtime-managed).
- The body of `synarc-core` is the only file that all skills share. Other skills must not duplicate its S-sections.

## 6. Universal compatibility

Synarc skills must work on Claude Code, Codex CLI, OpenCode, Cursor, Gemini CLI, GitHub Copilot, Windsurf, Cline, and RooCode. The 8-block template + cache architecture is designed for that.

Forbidden patterns:
- `cache_control:` blocks (Claude-specific)
- `<system-reminder>` tags (Claude-specific)
- `@anthropic-ai/sdk` imports
- `/commands/...` paths (Claude-specific)
- `<!-- runtime: claude -->` HTML comments
- Vendor-specific tool names: `read_file`, `write_file`, `apply_patch`, `MultiEdit`, `run_in_terminal`, `code_search`. Use generic verbs: "Read", "Write", "Edit", "Execute", "Search", "Inspect".

## 7. Migration from 5.x

5.x SKILL.md files have a 4-line identical boilerplate header ("Universalized from Claude plugin..."). 6.x removes that — the activation table in `AGENTS.md` covers it.

5.x files have a `references/` directory with placeholder stubs. 6.x requires every `references/*.md` to be ≥ 1 KB of real content, or deleted.

5.x files use YAML block scalars (`description: >`) for multi-line descriptions. 6.x allows this but recommends single-line `description: "..."` for cache-stability — the block scalar form makes the description text span multiple lines after YAML parse, which can produce different token sequences across runtimes.

## 8. Conformance check (used by `scripts/validate-skills.ps1`)

The validator checks, in order:

1. Frontmatter parses as YAML.
2. `name` matches parent directory.
3. `description` length in [40, 1024], no banned-word starts ("I ", "We ", "Helps", "Assists").
4. `intent_triggers` exists, length ≥ 2.
5. `priority` is one of `low | normal | high | critical`.
6. Body line count ≤ 1 000.
7. Body byte count ≤ 50 000.
8. No UTF-8 mojibake sequences (`â€`, `â†'`, `ðŸ`, `âš`).
9. No `references/*.md` < 1 000 bytes.
10. No nested references (`references/X/Y.md` is forbidden).
11. No banned vocabulary in body (warning, not fail).
12. `## Gotchas` section exists.
13. `## Output format` section exists for skills that emit output.
14. No "Universalized from Claude plugin..." boilerplate.
15. No combinatorial pattern (`When building a \w+ module for \w+ audiences in \w+, the \w+ pattern`).

Failing any of items 1-10 is a hard fail. Failing 11-15 is a warning.
