# Fallback Prompts

This directory contains prompt templates for the 4-tier fallback system.

## Fallback Chain

When a capability is not available at the current tier, the system falls back to the next tier:

```
Tier 1 (Native) → Tier 2 (External) → Tier 3 (Manual) → Tier 4 (Human-Assisted)
```

## Files

| File | Tier | Description |
|------|------|-------------|
| `tier1-native.md` | 1 | Templates for native agent execution |
| `tier2-external.md` | 2 | Templates for external tool integration |
| `tier3-manual.md` | 3 | Step-by-step manual instructions |
| `tier4-human.md` | 4 | Structured output for human review |

## Usage

Each skill's capabilities section specifies which tier to use when the primary tier is unavailable. The fallback prompts provide consistent templates across all skills.

## Customization

Skills may override these templates with skill-specific fallback instructions. See individual skill `SKILL.md` files for skill-specific fallback chains.
