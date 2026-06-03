---
runtime: roo-code
version: ">=1.0.0"
priority: 1
---

# RooCode Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Via .roorules |
| Intent activation | Yes | Via .roorules/* |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | Yes | Via MCP |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | Yes | Via .roorules architecture |
| File operations | Yes | Full read/write |
| Command execution | Yes | CLI commands |
| Guardrails | Partial | Can add constraints |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO roorules-section:
  RESULT = "# <name>\n\n"
  RESULT += "<description>\n\n"
  RESULT += "## When to Activate\n"
  triggers = PARSE activation.triggers
  FOR trigger IN triggers:
    RESULT += "- When user asks about: <trigger.intent>\n"
  RESULT += "\n## Available Capabilities\n"
  RESULT += "..."
  RETURN RESULT
```

### Section Filtering

- INCLUDE: Purpose, Activation Conditions, Capabilities, Validation, Failure Handling
- SKIP: Platform-specific sections for other runtimes
- ADAPT: Replace Claude Code references with "this agent"

### Output Format

- Full markdown with relative paths
- Each skill as a separate `.md` file in `.roorules/`
- Brain directory at `brain/` in project root

## Capability Mapping

| Universal Capability | RooCode Equivalent |
|--------------------|------------------|
| File read | `Read` tool |
| File write | `Write` / `Edit` tools |
| Command exec | `Bash` tool |
| Search | `Grep` + `Glob` tools |
| Classification | Via .roorules instructions |
| Risk assessment | Via .roorules instructions |
| Session tracking | Via .roorules persistence |
