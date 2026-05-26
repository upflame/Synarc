---
title: Injection Protocol
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - injection
  - prompt-engineering
  - auto-inject
  - ai-context
  - cognition-layer
---

# Purpose

Inject structured context into every AI engineering interaction — what to inject, when, how much, and in what format.

# Scope

All injection levels, formats, timings, and priority rules. Does not cover user-facing prompt templates.

# Inputs

Current repository state, change taxonomy, project scale, session history, user intent.

# Output

Structured context injected at the right level with correct priority and format.

# Notes

Inject only relevant context. Runs per interaction (or per tool call for COMPACT level).

# Injection Levels

| Level | Lines | Trigger |
|---|---|---|
| STANDARD | ~30 | Session start, new task, after checkpoint resume |
| COMPACT | ~6 | Every tool call in an active session (agent mode) |
| SILENT | 0 | Trivial read-only tool call (grep, ls, cat); classification still runs silently |

## STANDARD Injection (~30 lines)

```
WorkType: [FEATURE|FIX|REFACTOR|SCHEMA|CONTRACT|CONFIG|INFRA|INCIDENT|EXPERIMENT|DOCS|ANALYSIS|PLAN]
Risk: [INFO|LOW|MEDIUM|HIGH|CRITICAL]
Scale: [MICRO|SMALL|MEDIUM|LARGE|ENTERPRISE]
Task: [one-line description]
Scope: [files/modules this task should touch]
Recent ledger: [last 3-5 entries]
Risk sum: [aggregate risk]
Contracts affected: [none / list]
Brain files loaded: [CURRENT_STATE.md, MODULE_MAP.md, ...]
```

## COMPACT Injection (~6 lines)

```
WT:[WorkType] R:[Risk] #[calls] S:[Scale]
Task: [truncated to 60 chars]
Files: [truncated to 80 chars]
ΔRisk: [+0] #no change from last call
```

## SILENT Injection (0 lines)

Classification still runs. Ledger still appends. No context injected.

# Injection Priority When Context Window Is Constrained

If total context is near capacity, inject in this priority order:

1. WorkType + Risk (2 lines) — always, even in SILENT
2. Task + Scope (2 lines)
3. Scale (1 line)
4. Recent ledger entries (last 1-3, newest first)
5. Aggregate risk + contract break count
6. Most relevant brain file snippet
7. File list and module boundaries

Stop injecting when context budget is exhausted. Drop from bottom up.

# Context Window Management Strategies

## Rolling Context Window

As session progresses, old content rolls out:
- After 5 tool calls: keep scope + last 3 ledger entries
- After 10 tool calls: keep scope + last 5 ledger entries (compressed)
- After 20 tool calls: keep scope + summary (risk, files written) + most recent entry only

## Hierarchical Injection

| Level | Always Present |
|---|---|
| 0 (always) | 2 lines: repo, scale, stack, arch, current worktype, risk |
| 1 (session) | Task, scope, checkpoint state, contract breaks |
| 2 (detail) | Recent ledger, brain snippets, file structure |

Level 0-1 always injected. Level 2 only when context allows.

## Token Budget (from coding-agent.md)

| Operation | Tokens |
|---|---|
| Read file (<100 lines) | ~500 |
| Read file (>500 lines) | ~3,000 |
| Write small change | ~1,000 |
| Write new file | ~3,000 |
| Run command | ~500-5,000 |
| Error analysis | ~1,000-3,000 |
| Checkpoint | ~500-1,000 |
| Handoff | ~500-1,500 |

Total session budget: ~30,000 tokens. Initial injection: ~2,000. Per tool call: ~200. Track actual consumption. If exceeded, drop Level 2 items first.

Optimization: read only what you need (grep/line-range), batch related reads, summarize tool history instead of replaying.

# Injection Patterns

## Pattern 1: Parallel Injection

When loading brain context, inject in parallel:
- INJECT: CURRENT_STATE.md cognitive summary (3 lines)
- INJECT: MODULE_MAP.md relevant module (2 lines)
- INJECT: API_CONTRACTS.md relevant contract (2 lines)
Total: 7 lines vs 30+ lines if injected serially.

## Pattern 2: Compression by Abstraction

Instead of injecting full content, inject abstracted summaries:
- "Module: payment-service. Handles Stripe/PayPal processing. Risk: HIGH. Key contract: processPayment(orderId)."
- 3 lines instead of 30 lines of code.

## Pattern 3: Differential Injection

Instead of injecting full context every time, inject only the DIFFERENCE from the previous call:
- "Same scope. Files changed since last call: src/retry.ts (modified). Risk unchanged at MEDIUM."
- 2 lines instead of 8+.

# What Should NEVER Be Injected

- Database connection strings
- API keys or tokens
- PII (customer names, emails, SSNs)
- Internal IP addresses or hostnames (use service names)
- Full file contents (inject summaries, not raw code)
- Session tokens or authentication headers
- Private keys or certificates

# Safe Injection Practices

- Inject module names (not file paths with credentials)
- Inject contract names (not authentication tokens)
- Inject risk levels (not access control rules)
- Inject architecture summaries (not network topology)
- For secrets: use placeholder references ("DB_PASSWORD from secrets manager")

# Injection Validation Checklist

```yaml
before_session:
  - "Brain files exist and are up to date"
  - "Scale detected correctly"
  - "Relevant brain files identified"
per_tool_call:
  - "WorkType + Risk injected"
  - "Scope still valid (no unnoticed scope creep)"
  - "Context budget not exceeded"
after_session:
  - "Ledger complete"
  - "CHANGE_LOG.md updated"
  - "Checkpoints valid"
```
