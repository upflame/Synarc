---
title: Synarc v3 Deployment Guide
type: deployment
status: active
version: 3.0.0
updated: 2026-05-24
owner: synarc-engine
tags:
  - deployment
  - integration
  - teams
  - workflow
  - ci-cd
---

# Synarc v3 — Deployment Guide

How to wire Synarc into real repos, team workflows, and CI/CD pipelines.

---

## 1. Deployment Models

### Model A: AI Session Only (zero setup)
Synarc runs in every AI conversation. No files, no repo changes needed.
The brain lives in the conversation context.

**Best for:** NANO, MICRO, early SMALL projects, exploratory work.

**How:** Just start using it. Synarc auto-activates.

---

### Model B: Brain Directory in Repo (recommended for SMALL+)
Brain files are committed to the repository. Loaded at the start of every
AI session. Persistent across sessions, team members, and tools.

**Best for:** SMALL to ENTERPRISE projects with any team size.

**Setup:**
```bash
mkdir -p brain/snapshots
touch brain/CURRENT_STATE.md
touch brain/CHANGE_LEDGER.md
echo "# Synarc Brain\nSee: https://github.com/your-org/synarc" > brain/README.md
git add brain/
git commit -m "synarc: init brain directory"
```

**Session startup pattern:**
```
Loading synarc context:
[paste brain/CURRENT_STATE.md]

Today's work: [describe task]
```

---

### Model C: Brain + CI Integration (recommended for MEDIUM+)
Brain files are auto-updated via CI on merge. Snapshots are auto-generated
per PR. The brain is always current without manual updates.

**Best for:** MEDIUM to ENTERPRISE. Any team doing regular releases.

**CI workflow (GitHub Actions example):**
```yaml
# .github/workflows/synarc-brain.yml
name: Synarc Brain Update

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  synarc-update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # full history for diff analysis

      - name: Generate Synarc snapshot
        run: |
          # Call your AI tool with Synarc SKILL.md loaded
          # Pass the diff: git diff HEAD~1..HEAD
          # Output: brain/snapshots/$(date -u +%Y%m%dT%H%M%S)-pr-${{ github.event.number }}.md
          echo "Synarc snapshot generation step"

      - name: Update CHANGE_LEDGER.md
        run: |
          # Append ledger entry from this merge
          echo "Ledger update step"

      - name: Commit brain updates
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "synarc: auto-update brain [skip ci]"
          file_pattern: brain/**
```

---

### Model D: Pre-commit Hook (LARGE+ quality gate)
Synarc runs as a pre-commit hook. Breaking changes and CRITICAL risk
changes are flagged before the commit is allowed.

**Best for:** LARGE, ENTERPRISE, any team where regressions are costly.

**`.git/hooks/pre-commit` (conceptual):**
```bash
#!/bin/bash
# Synarc pre-commit gate

CHANGED_FILES=$(git diff --cached --name-only)

# Check for schema changes
if echo "$CHANGED_FILES" | grep -q "migrations/"; then
  echo "⚠ SYNARC: Schema migration detected."
  echo "  Run: synarc analyze-migration <file>"
  echo "  Confirm deployment order before committing."
  # exit 1  # Uncomment to hard-block; leave commented for advisory only
fi

# Check for contract changes
if echo "$CHANGED_FILES" | grep -qE "openapi|proto|contracts"; then
  echo "⚠ SYNARC: Contract file changed."
  echo "  Verify: all consumers updated. Breaking change analysis required."
fi

# Always pass — Synarc is advisory unless you uncomment exit 1
exit 0
```

---

## 2. Team Workflow Integration

### PR Description Template

Add to `.github/pull_request_template.md`:

```markdown
## Synarc Intelligence

**Work type:** FEATURE:PLANNED | FIX:BUG | SCHEMA:* | CONTRACT:* | ...
**Risk level:** CRITICAL | HIGH | MEDIUM | LOW
**Breaking:** yes/no

### Changed
- [ file/module ]

### Impact
- [ what is affected ]

### Breaking changes
- [ what breaks, migration path ]

### Tests
- [ test coverage for this change ]

### Snapshot
→ brain/snapshots/YYYY-MM-DDTHH-mm-ss-<name>.md
```

---

### Code Review Checklist

Add to review process:

```
Synarc Review Gate:
[ ] WorkType correctly classified
[ ] Risk level justified
[ ] Breaking changes declared with migration path
[ ] Deployment order stated (for SCHEMA/CONTRACT/CONFIG)
[ ] Tests cover the change
[ ] No unplanned scope unexplained
[ ] Brain snapshot updated (for significant changes)
```

---

### Incident Response Runbook

Add to incident response documentation:

```
On any production incident:
1. Open AI session with Synarc SKILL.md loaded
2. First message: "INCIDENT: [description]. Started [time]. Error: [paste]"
3. Synarc switches to CRITICAL mode automatically
4. Follow triage phases from analysis-patterns.md S9
5. After resolution: generate incident snapshot
6. Commit snapshot + update INCIDENT_LOG.md
```

---

## 3. Loading Brain Files Efficiently

### Priority order for context loading (most important first)

```
1. brain/CURRENT_STATE.md         ← always load — 1 file, max context value
2. brain/MODULE_MAP.md            ← load when navigating unfamiliar code
3. brain/API_CONTRACTS.md         ← load when touching an API
4. brain/CHANGE_LEDGER.md         ← load when doing incremental work
   (last 3 sessions only — trim older entries)
5. brain/ERROR_INTELLIGENCE.md    ← load when fixing bugs
   (last 5 errors only)
6. brain/snapshots/<most-recent>  ← load when continuing a feature
```

**Compact load pattern (paste at session start):**
```
[SYNARC BRAIN LOAD]
--- CURRENT_STATE.md ---
[paste Cognitive Summary section only — 1 paragraph]

--- ACTIVE RISKS ---
[paste Current Risks section — 3-5 bullets]

--- LIVE CONTRACTS ---
[paste Important Contracts section — 3-5 bullets]

--- LAST 3 LEDGER ENTRIES ---
[paste last 3 from CHANGE_LEDGER.md]
---
Today: [your task]
```

This gives Synarc full context in under 30 lines.

---

## 4. Brain File Maintenance

### Update cadence

| File                      | Update when                                         |
|---------------------------|-----------------------------------------------------|
| `CURRENT_STATE.md`        | Architecture changes, new modules, new major risks  |
| `MODULE_MAP.md`           | Module added, removed, or ownership changes         |
| `API_CONTRACTS.md`        | Any contract change (route, event, schema)          |
| `SYSTEM_MAP.md`           | New service, new integration, boundary changes      |
| `CHANGE_LEDGER.md`        | End of every session (append only)                  |
| `ERROR_INTELLIGENCE.md`   | After every bug fix (append only)                   |
| `FEATURE_LOG.md`          | After every feature ships                           |
| `INCIDENT_LOG.md`         | After every production incident                     |
| `snapshots/`              | Per feature, per incident, per major change         |

### Staleness detection

If a brain file has `status: stale` in frontmatter, regenerate it:
```
This brain/CURRENT_STATE.md is marked stale.
Here is the current repo: [paste structure or recent diffs]
Regenerate it.
```

### Archiving old snapshots

Snapshots never get updated — they are immutable archives.
If the `/brain/snapshots/` directory grows large (>50 files), archive:
```bash
mkdir -p brain/snapshots/archive/2025
mv brain/snapshots/2025-*.md brain/snapshots/archive/2025/
git commit -m "synarc: archive 2025 snapshots"
```

---

## 5. Multi-Repo / Platform Setup

For LARGE / ENTERPRISE with multiple repos:

```
/platform-brain/
├── PLATFORM_STATE.md          ← Top-level platform architecture
├── SERVICE_REGISTRY.md        ← All services across all repos
├── PLATFORM_CONTRACTS.md      ← Cross-repo contracts and APIs
├── INCIDENT_LOG.md            ← Platform-wide incidents
└── repos/
    ├── auth-service/          ← Per-repo brain (symlink or copy)
    ├── billing-service/
    └── api-gateway/
```

Each repo maintains its own `/brain/` directory.
The platform-level brain aggregates cross-repo contracts and incidents.

---

## 6. Synarc + Claude Code Integration

When using Claude Code with Synarc:

**In `CLAUDE.md` at repo root:**
```markdown
# Synarc Context

This repo uses Synarc v3 for engineering cognition.

## Always load at session start:
- brain/CURRENT_STATE.md
- brain/MODULE_MAP.md (if navigating modules)

## Synarc behavior:
- Classify every change with WorkType before executing
- Flag UNPLANNED scope expansion with ⚠
- Produce inline Synarc footer on every engineering change
- Update CHANGE_LEDGER.md at session end
- Generate snapshot on significant changes

## Active risks (from brain/CURRENT_STATE.md):
[paste current risks here — keep updated]
```

---

## 7. Upgrade Path from v2

If you have a v2 Synarc skill deployed:

```
v2 → v3 migration:
1. Replace SKILL.md with v3 version
2. Add references/change-taxonomy.md (new)
3. Add references/injection-protocol.md (new)
4. Add references/session-tracking.md (new)
5. Add references/project-scales.md (new)
6. Update references/analysis-patterns.md (v3 version)
7. Update references/cognition-layer.md (v3 version)
8. Update references/schemas.md (add schemas S10-13)
9. Create brain/ directory if not exists
10. Existing brain files: add version: 3.0.0 to frontmatter

Breaking changes from v2:
- WorkType classification is now mandatory (was optional)
- PLANNED/UNPLANNED flag is new — mark existing features as PLANNED
- Inline footer format slightly changed (NEXT field added)
- Scale field is new in SILENT context block
```
