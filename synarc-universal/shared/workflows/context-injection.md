---
workflow: context-injection
version: 1.0.0
description: Universal context injection workflow — 4 injection levels, token budgeting, section load strategy
---

# Context Injection Workflow

## Purpose

Inject the right amount of context for each interaction. Balances context depth against token budget. Adapts to available runtime context window.

## Trigger Conditions

WHEN:
- session starts
- scope changes
- per-tool-call execution (compact)
- user requests analysis
- context budget changes

THEN:
Activate context injection workflow

## Required Inputs

- Session state (from session-tracking workflow)
- Current interaction type (analysis, code gen, architecture, incident)
- Available context budget
- Project scale

## Workflow

### Step 1: Determine Injection Level

| Level | Tokens | When Used |
|-------|--------|-----------|
| SILENT | 0 | Read-only analysis, no tracking needed |
| COMPACT | ~50 | Per-tool-call agent execution |
| STANDARD | ~200 | Session start, scope changes |
| FULL | ~500 | Large projects, cross-boundary changes |

### Step 2: Select Sections to Load

| Interaction Type | Sections to Load | Est. Tokens |
|-----------------|-----------------|-------------|
| Quick analysis | Classification, risk, language rules, quality | ~800 |
| Code generation | Classification, risk, execution rules, quality, testing | ~1200 |
| Architecture | Classification, risk, session state, domains | ~1400 |
| Full session | Classification, risk, execution, session, quality, testing, domains | ~4000 |
| Incident | Classification, risk, execution, session, domains | ~3500 |
| Handoff | Session state, execution, session | ~1500 |

### Step 3: Adapt to Budget

| Budget Remaining | Load Strategy |
|-----------------|---------------|
| > 60% | Full depth — load all relevant sections |
| 40-60% | Standard — load framework + 2-4 sections |
| 20-40% | Compact — load only classification, risk, current section |
| 10-20% | Minimal — classification only, skip all loading |
| < 10% | Emergency — output only, stop loading new content |

### Step 4: Inject Context Block

Format injection as:

```
[SYNARC] Scale: SCALE | Risk: LEVEL | Session: ID | Change: CLASSIFICATION
Scope: DECLARED_SCOPE
Active constraints: [constraint list]
Recent ledger: [last 3 entries]
```

### Step 5: Cache Management

Structure output for prefix caching:

- L0 (permanent): frontmatter + framework definition
- L1 (session): current classification + risk + scope
- L2 (turn): per-interaction context
- L3 (ephemeral): inline data — never cached

## Validation

- Injection level matches interaction type
- Token cost within budget
- All required context accessible in current interaction

## Failure Handling

- Context budget exhausted → drop lowest-priority content
- Runtime rejects format → re-encode for generic agent
- Critical context missing (no scope declared) → classify as ANALYSIS until scope is set

## Quality Checklist

- [ ] Injection level selected
- [ ] Sections loaded based on interaction type
- [ ] Token budget respected
- [ ] Context block injected before primary output
- [ ] Cache levels assigned

## Security Checklist

- [ ] Injected context does not contain secrets or PII
- [ ] Context block matches security classification level

## Performance Checklist

- [ ] SILENT: 0 tokens
- [ ] COMPACT: ~50 tokens
- [ ] STANDARD: ~200 tokens
- [ ] FULL: ~500 tokens
