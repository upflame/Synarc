---
runtime: opencode
version: ">=1.0.0"
priority: 1
---

# OpenCode Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Full coverage |
| Intent activation | Yes | Via AGENTS.md intent patterns |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | No | No external integration support |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | Yes | Full brain directory |
| File operations | Yes | Full read/write access |
| Command execution | Yes | PowerShell/bash support |
| Guardrails | Partial | Can add constraints |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO agentsmd-section:
  RESULT = "# <name>\n\n---\n\n"
  RESULT += "<description>\n\n"
  RESULT += "## When to Activate\n"
  triggers = PARSE activation.triggers
  FOR trigger IN triggers:
    RESULT += "- When user asks about: <trigger.intent>\n"
  RESULT += "\n## Available Capabilities\n"
  RESULT += "..."
  RESULT += "\n---\n"
  RESULT += "\n## Reference Files\n"
  RESULT += "- `skills/<skill-id>/SKILL.md`\n"
  RETURN RESULT
```

### Section Filtering

- INCLUDE: All sections
- SKIP: Platform-specific sections for other runtimes
- ADAPT: Replace Claude Code references with "this agent"

### Output Format

- Unicode box drawing (─ │ ┌ ┐ └ ┘ )
- Full markdown with relative paths
- Brain directory at `brain/` in project root
- Session state in brain directory files

## Capability Mapping

| Universal Capability | OpenCode Equivalent |
|--------------------|-------------------|
| File read | `Read` tool |
| File write | `Write` / `Edit` tools |
| Command exec | `Bash` tool |
| Search | `Grep` + `Glob` tools |
| Classification | Via AGENTS.md instructions |
| Risk assessment | Via AGENTS.md instructions |
| Session tracking | `brain/` directory persistence |
| Skill reference | `skills/` directory index |
