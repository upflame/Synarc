---
runtime: cursor
version: ">=0.45.0"
priority: 1
---

# Cursor IDE Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Via .mdc format |
| Intent activation | Yes | Via .cursor/rules/*.mdc |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | No | No external integration |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | No | Session-only persistence |
| File operations | Yes | Full IDE file access |
| Command execution | No | No terminal commands in agent mode |
| Guardrails | No | Not natively supported |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO mdc-rule:
  RESULT = "---\n"
  RESULT += "description: <description (first 200 chars)>\n"
  RESULT += "globs: *.{ts,tsx,js,jsx,py,go,java,rs,json,yaml,yml,md}\n"
  RESULT += "---\n\n"
  RESULT += "# <name>\n\n"
  RESULT += "When the user asks about:\n"
  triggers = PARSE activation.triggers
  FOR trigger IN triggers:
    RESULT += "- <trigger.intent>\n"
  RESULT += "\nThen apply the following rules:\n\n"
  RESULT += "..."
  RETURN RESULT
```

### Section Filtering

- INCLUDE: Capabilities, Quality Checklist, Security Checklist
- SKIP: Command execution sections (not supported in Cursor agent mode)
- SKIP: Large reference tables > 50 rows
- SKIP: Runtime-specific sections for non-Cursor runtimes
- ADAPT: Use compact format, trim verbose examples

### Output Format

- Unicode box drawing
- Compact sections (Cursor context is shared with editor)
- No brain directory persistence
- Session state kept in conversation only

## Capability Mapping

| Universal Capability | Cursor Equivalent |
|--------------------|------------------|
| File read | Native file reading |
| File write | Composer / Cmd+K edits |
| Command exec | Not available |
| Search | Native search |
| Classification | Via .mdc rule instructions |
| Risk assessment | Via .mdc rule instructions |
| Session tracking | Conversation-only |
