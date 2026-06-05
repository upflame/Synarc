---
runtime: copilot
version: ">=1.0.0"
priority: 1
---

# GitHub Copilot Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Partial | Reads limited metadata |
| Intent activation | Yes | Via .github/copilot-instructions.md |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | No | No external integration |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | No | No persistent storage |
| File operations | Yes | IDE file access only |
| Command execution | No | Limited terminal integration |
| Guardrails | No | Not supported |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO copilot-instructions:
  RESULT = "## <name>\n\n"
  RESULT += "When asked about: "
  triggers = PARSE activation.triggers
  RESULT += JOIN(triggers.intent, ", ")
  RESULT += "\n"
  RESULT += "Then: <description (first 500 chars)>\n"
  RETURN RESULT
```

### Section Filtering

- INCLUDE: Purpose, capabilities (compact), quality checklist
- SKIP: Command execution sections
- SKIP: Large tables, detailed taxonomies
- SKIP: Brain persistence instructions
- ADAPT: Keep compact — Copilot context is shared with IDE

### Output Format

- ASCII output
- Compact sections
- No brain directory references

## Capability Mapping

| Universal Capability | Copilot Equivalent |
|--------------------|-------------------|
| File read | Native IDE reading |
| File write | Inline completion / chat editing |
| Command exec | Not available |
| Search | IDE search |
| Classification | Via instructions.md |
| Risk assessment | Via instructions.md |
| Session tracking | Not available |
