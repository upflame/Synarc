---
runtime: codex
version: ">=1.0.0"
priority: 1
---

# Codex CLI Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Reads only `name`, `description`, `version` |
| Intent activation | Yes | Via AGENTS.md intent patterns |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | No | No external integration support |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | No | Via AGENTS.md only |
| File operations | Yes | Full read/write access |
| Command execution | Yes | CLI commands supported |
| Guardrails | No | Not natively supported |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO agentsmd-section:
  RESULT = "# <name>\n\n"
  RESULT += "<description>\n\n"
  RESULT += "## When to Activate\n"
  triggers = PARSE activation.triggers FROM skill.yaml
  FOR trigger IN triggers:
    RESULT += "- When user asks about: <trigger.intent>\n"
  RESULT += "\n## Capabilities\n"
  RESULT += "..."
  RETURN RESULT
```

### Section Filtering

- INCLUDE: Purpose, Activation Conditions, Capabilities, Validation, Failure Handling
- SKIP: Platform-specific sections, Runtime-specific instructions
- SKIP: Sections referencing file system paths not supported by Codex

### Output Format

- ASCII-only box drawing (no Unicode ─│┌┐└┘)
- Plain markdown links (no relative path references to brain directory)
- Session state embedded in AGENTS.md as session block

## Capability Mapping

| Universal Capability | Codex Equivalent |
|--------------------|-----------------|
| File read | `Read` tool |
| File write | `Write` tool |
| Command exec | `Bash` tool |
| Search | `Grep` + `Glob` tools |
| Classification | Manual via prompt instructions |
| Risk assessment | Manual via prompt instructions |
| Session tracking | Via AGENTS.md appended sections |
