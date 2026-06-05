---
runtime: cline
version: ">=1.0.0"
priority: 1
---

# Cline Runtime Adapter

## Compatibility

| Feature | Supported | Notes |
|---------|-----------|-------|
| YAML frontmatter | Yes | Via .clinerules |
| Intent activation | Yes | Via .clinerules/* |
| Tier 1 (native) | Yes | Full agent capability |
| Tier 2 (external) | Yes | Via MCP |
| Tier 3 (manual) | Yes | Text-based instructions |
| Tier 4 (human) | Yes | Structured output |
| Brain persistence | Yes | Via .clinerules architecture |
| File operations | Yes | Full read/write |
| Command execution | Yes | CLI commands |
| Guardrails | Partial | Can add constraints |

## Capability Mapping

| Universal Capability | Cline Equivalent |
|--------------------|----------------|
| File read | `Read` tool |
| File write | `Write` / `Edit` tools |
| Command exec | `Bash` tool |
| Search | `Grep` + `Glob` tools |
| Classification | Via .clinerules instructions |
| Risk assessment | Via .clinerules instructions |
| Session tracking | Via .clinerules persistence |
