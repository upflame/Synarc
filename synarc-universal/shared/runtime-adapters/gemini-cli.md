---
runtime: gemini-cli
version: ">=1.0.0"
priority: 1
---

# Gemini CLI Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Reads via AGENTS.md |
| Intent activation | Yes | Via AGENTS.md intent patterns |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | Yes | Google AI APIs available |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | No | Session-only (very large context) |
| File operations | Yes | Full access (1M token context) |
| Command execution | Yes | CLI commands supported |
| Guardrails | Partial | Can add constraints |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO agentsmd-section:
  RESULT = "## <name>\n\n"
  RESULT += "<description>\n\n"
  RESULT += "### Activation\n"
  triggers = PARSE activation.triggers
  FOR trigger IN triggers:
    RESULT += "- <trigger.intent>\n"
  RESULT += "\n### Instructions\n"
  RESULT += "..."
  RETURN RESULT
```

### Section Filtering

- INCLUDE: All sections (1M context can handle it)
- SKIP: Other runtime-specific sections
- ADAPT: Can be verbose due to massive context window

### Output Format

- ASCII box drawing (Gemini terminal prefers ASCII)
- Can output full content due to 1M token context
- No brain persistence — relies on conversation

## Capability Mapping

| Universal Capability | Gemini CLI Equivalent |
|--------------------|---------------------|
| File read | Native file reading |
| File write | Native file writing |
| Command exec | CLI tool |
| Search | Native search |
| Classification | Via AGENTS.md instructions |
| Risk assessment | Via AGENTS.md instructions |
| Session tracking | Conversation-only (1M token window) |
