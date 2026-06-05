---
runtime: windsurf
version: ">=1.0.0"
priority: 1
---

# Windsurf IDE Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Via .windsurfrules |
| Intent activation | Yes | Via .windsurfrules |
| Tier 1 (native) | Yes | Full Cascade agent |
| Tier 2 (external) | No | No external integration |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | No | Session-only |
| File operations | Yes | Full IDE file access |
| Command execution | Yes | Via Cascade terminal |
| Guardrails | No | Not natively supported |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO windsurfrules:
  RESULT = "# <name>\n\n"
  RESULT += "<description (first 300 chars)>\n\n"
  RESULT += "## Triggers\n"
  triggers = PARSE activation.triggers
  FOR trigger IN triggers:
    RESULT += "- <trigger.intent>\n"
  RESULT += "\n## Behavior\n"
  RESULT += "..."
  RETURN RESULT
```

### Section Filtering

- INCLUDE: Capabilities (compact), Security Checklist, Quality Checklist
- SKIP: Command execution sections (limited in Windsurf)
- SKIP: Large reference files
- SKIP: Other runtime-specific sections

### Output Format

- Unicode box drawing
- Compact sections
- No brain persistence

## Capability Mapping

| Universal Capability | Windsurf Equivalent |
|--------------------|-------------------|
| File read | Native file reading |
| File write | Cascade inline editing |
| Command exec | Cascade terminal |
| Search | Native search |
| Classification | Via .windsurfrules |
| Risk assessment | Via .windsurfrules |
| Session tracking | Conversation-only |
