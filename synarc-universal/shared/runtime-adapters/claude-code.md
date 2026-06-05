---
runtime: claude-code
version: ">=1.0.0"
priority: 1
---

# Claude Code Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Full coverage |
| Intent activation | Yes | Via SKILL.md configuration |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | Yes | Via MCP or external tool calls |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | Yes | Full brain directory + hooks |
| File operations | Yes | Full read/write access |
| Command execution | Yes | CLI commands supported |
| Guardrails | Yes | Full constitutional support |

## Compilation Rules

### Frontmatter Transformation

```pseudocode
TRANSFORM frontmatter TO native-skillmd:
  KEEP as-is — native SKILL.md format
  REMOVE: schema field (Claude may not recognize it)
  REMOVE: compatible_agents field (not needed in native format)
  ADD: activation, priority, cache if applicable
  RETURN
```

### Section Filtering

- INCLUDE: All sections
- SKIP: Other runtime-specific sections
- ADAPT: Can use longest form, Claude has largest context

### Output Format

- Unicode box drawing
- Full brain directory persistence at `brain/`
- Hooks for session lifecycle
- Ledger entries append to `brain/CHANGE_LEDGER.md`

## Capability Mapping

| Universal Capability | Claude Code Equivalent |
|--------------------|----------------------|
| File read | `Read` tool |
| File write | `Write` / `Edit` tools |
| Command exec | `Bash` tool |
| Search | `Grep` + `Glob` tools |
| Classification | Via SKILL.md instructions |
| Risk assessment | Via SKILL.md instructions |
| Session tracking | `brain/` directory + hooks |
