<!--
Thanks for opening a pull request on Synarc!
Please fill in the sections below so reviewers can act fast.
-->

## Summary

<!-- 1-3 sentences. What does this PR do and why? -->

## Related Issue

<!-- Link the issue this PR fixes or relates to (e.g., "Closes #123" or "Refs #456"). Use "N/A" if there isn't one. -->

## Type of Change

<!-- Check all that apply. -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds capability)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Skill content (under `synarc-universal/skills/`)
- [ ] Runtime adapter (under `synarc-universal/shared/runtime-adapters/`)
- [ ] Schema change (under `synarc-universal/shared/schemas/`)
- [ ] Installer (under `synarc-universal/scripts/`)

## Test Plan

<!-- How did you verify this works? Paste the output of `node synarc-universal/scripts/install.js --verify` if you touched the installer or any skill. -->

```
$ node synarc-universal/scripts/install.js --verify
... paste output here ...
```

## Checklist

- [ ] I ran `npm run lint` in `synarc-universal/` and got 0 errors
- [ ] I ran `npm test` in `synarc-universal/` and got 0 errors
- [ ] I added or updated the relevant docs in `synarc-universal/docs/`
- [ ] My changes do not introduce vendor lock-in (no editor-specific code outside `shared/runtime-adapters/`)
- [ ] If I added a new skill, it has the 8-block template structure, `name`, `description`, `version`, `schema`, and `dependencies` in frontmatter
- [ ] If I bumped a version, I updated `CHANGELOG.md` and `synarc-universal/AGENTS.md`