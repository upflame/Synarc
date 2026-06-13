# Contributing to Synarc

Thank you for your interest in contributing. This document outlines the guidelines for contributing to the Synarc Engineering Intelligence Runtime.

## Code of Conduct

All contributors must adhere to the [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## How to Contribute

### Reporting Issues

- Search existing issues before filing a new one
- Provide a clear description of the problem
- Include steps to reproduce, expected behavior, and actual behavior
- Specify your runtime (Claude Code, Codex CLI, Cursor, etc.)
- Include relevant version information

### Feature Requests

- Describe the problem you're trying to solve, not just a proposed solution
- Explain how the feature fits within Synarc's architecture
- Provide examples of how you would use the feature

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feature/your-feature`)
3. Make your changes following the project conventions
4. Run the lint checks (`npm run lint` in `synarc-universal/`)
5. Ensure vendor lock-in checks pass (56/56)
6. Ensure no reference links are broken
7. Commit with a descriptive message
8. Push to your fork and submit a PR

## Development Setup

```bash
git clone https://github.com/upflame-labs/synarc.git
cd synarc
npm install  # if applicable
```

### Lint Commands

```bash
cd synarc-universal
npm run lint          # vendor lock-in + reference checks
npm run validate      # validate skill structure
npm run test-fallbacks  # test fallback chains
```

## Conventions

### Skill Development

- Each skill must declare `name`, `description`, `version`, `schema`, and `dependencies` in frontmatter
- Skill files must not contain runtime-specific vendor references
- All skills must pass vendor lock-in validation
- Follow the 8-block template structure
- Reference files should be placed in `references/` within the skill directory

### Schema Changes

- JSON Schema files live in `shared/schemas/`
- Changes must be backward-compatible or versioned
- Add corresponding workflow documentation in `shared/workflows/`

## Release Process

This project follows [Semantic Versioning](https://semver.org/). Releases are tagged and published to npm and the Claude Code marketplace.
