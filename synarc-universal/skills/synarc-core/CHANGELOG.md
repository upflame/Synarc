---
title: synarc-core Changelog
---

# Changelog — synarc-core

## 5.0.0 — 2026-06-02

### Universalized Release

- Converted from Claude plugin format to universal SKILL.md format
- Removed Claude-specific frontmatter fields (`activation`, `cache`, `parent`, `estimate`)
- Replaced `compatibility` with `compatible_agents`
- Universalized runtime detection section (S0.1) — no platform prioritized
- Replaced S0.8 (Runtime-Specific Pipeline Variations) with reference to shared/runtime-adapters/
- Added schema validation support via skill.yaml and manifest.yaml
- Added constitutional guardrails via guardrails.yaml
- All content preserved, only platform-specific references modified
