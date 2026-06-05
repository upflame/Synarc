---
name: agentic-ai-engineer
schema: skill-pack/v1
skill_type:
  - capability
  - workflow
dependencies:
  synarc-core: ">=6.0.0"
title: Agentic AI Engineer — Building Agents That Plan, Act, and Learn
description: Agentic AI engineering reasoning — agent loop design (ReAct, Plan-Execute, Reflexion), tool calling schemas, sub-agent orchestration (supervisor / peer / hierarchical), memory architectures (short-term, episodic, semantic, procedural), state management, prompt-evals, agent observability, failure recovery, agent security (prompt injection, tool poisoning), MCP integration. The 2026 #1 emerging engineering discipline. Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - agentic-ai
  - agents
  - tool-calling
  - sub-agents
  - orchestration
  - multi-agent
  - agent-loops
  - react
  - plan-execute
  - reflexion
  - memory-architecture
  - state-management
  - agent-observability
  - prompt-injection-defense
  - mcp
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# Agentic AI Engineer — Building Agents That Plan, Act, and Learn

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S5 project scales, S13 quality gates, S14 language rules, S16 negative prompts, S17 zero-tolerance violations). All synarc prohibitions apply.

An agent is an LLM-driven system that operates over multiple steps without per-step human approval, decides which tool or sub-agent to call, and maintains state across the run. Chat completion is not an agent. A loop that calls a tool, observes the result, and decides the next step is.

This skill covers the full agentic stack: loop design, tool-calling schemas, sub-agent topologies, memory layers, state management, evals, observability, security, and MCP integration.


## P2 — METHODOLOGY: Agent Loop Design

### P2.1 — Three Core Loop Patterns

```
REACT (Reason + Act):
  Loop:
    1. Thought: "What do I need to do next?"
    2. Action: call a tool
    3. Observation: read tool result
    4. Repeat until task complete or max steps
  Use when:
    - Task is exploratory (unknown tool sequence)
    - Tool count is moderate (5-30)
    - Decisions are independent
    - Latency tolerance: seconds
  Example: research agent that searches, reads, summarizes

PLAN-AND-EXECUTE:
  Phase 1: Generate full plan as numbered steps
  Phase 2: Execute each step, replan if a step fails
  Use when:
    - Task is well-understood (decomposable upfront)
    - Steps have dependencies
    - Plan needs human inspection
    - Latency tolerance: tens of seconds
  Example: "Migrate this repo from Jest to Vitest"

REFLEXION (Self-Critique):
  Loop:
    1. Attempt task
    2. Self-evaluate result
    3. If unsatisfactory, store critique in memory
    4. Re-attempt with critique as context
  Use when:
    - Quality bar is high and first attempt often fails
    - Task is repeatable (code-gen, writing)
    - Cost of extra iterations is acceptable
  Example: code generation with test feedback
```

**Decision matrix:**

| Pattern | When | Latency | Cost | Reliability |
|---|---|---|---|---|
| ReAct | Unknown sequence, exploration | Low | Medium | Medium |
| Plan-Execute | Known decomposition | Medium | Low (fewer tool calls) | High (plan visible) |
| Reflexion | High quality required | High (retries) | High | High (after critique) |

### P2.2 — Loop Discipline (Non-Negotiable)

```
EVERY AGENT LOOP MUST HAVE:
  - Max step count:      prevents infinite loops (default: 25)
  - Token budget:        prevents context blowouts (default: 100k)
  - Wall-clock timeout:  prevents hung agents (default: 5 min)
  - Idempotency:         tool calls must be safely retryable
  - Cancellation:        user can stop mid-loop
  - State checkpoint:    save state every N steps for resume

LOOP ANTI-PATTERNS:
  - No max step count (infinite loop on bad tool output)
  - No token budget (context exhausted, then crash)
  - No idempotency check (double-charged customers on retry)
  - No observability (cannot debug failures)
  - No human escalation path (agent must have a way to ask for help)
```

### P2.3 — Tool Calling Schemas

```
TOOL DESIGN PRINCIPLES:
  1. Single responsibility: one tool does one thing
  2. Atomic and idempotent: same input = same result, safe to retry
  3. Clear input/output schema: JSON Schema, no surprises
  4. Explicit failure modes: return error structure, do not throw
  5. Bounded cost: declare max cost / latency in schema
  6. Testable in isolation: tool can be called without LLM

TOOL SCHEMA TEMPLATE:
  name: search_docs
  description: |
    Search the internal documentation index.
    Use when: user asks a question that may be answered by internal docs.
    Do NOT use for: real-time data (use web_search instead).
  input_schema:
    type: object
    properties:
      query:
        type: string
        description: Natural language query
        minLength: 3
      max_results:
        type: integer
        default: 5
        minimum: 1
        maximum: 20
    required: [query]
  output_schema:
    type: object
    properties:
      results:
        type: array
        items:
          type: object
          properties:
            title: { type: string }
            url: { type: string }
            snippet: { type: string }
            relevance: { type: number, minimum: 0, maximum: 1 }
    required: [results]
  failure_modes:
    - NO_RESULTS: return empty array, do not error
    - SERVICE_DOWN: return {error: "search_unavailable"}
    - RATE_LIMITED: return {error: "rate_limited", retry_after: int}
  cost_estimate: "low (10ms-500ms)"
```

### P2.4 — Stop Conditions

```
WHEN TO STOP AN AGENT:
  - Task complete: tool returns "done: true" or final state
  - Max steps reached: emit partial result + reason
  - Token budget exhausted: summarize + emit + ask user
  - Repeated failure: same tool failing N times → stop, escalate
  - User cancellation: stop immediately, preserve state
  - High-risk decision: agent must stop and ask human (auth, payments, prod deploy)

CIRCUIT BREAKERS:
  - Same error 3x in a row → halt agent
  - Cost per turn > threshold → halt agent
  - Tool returns malformed output 2x in a row → halt and report
```


## P3 — MULTI-AGENT TOPOLOGIES

### P3.1 — Three Core Topologies

```
SUPERVISOR (Star):
  One supervisor agent delegates to N worker agents.
  Workers do not talk to each other.
  Use when:
    - Tasks decompose cleanly
    - Workers are specialized (coder, tester, reviewer)
    - Need central control over cost, retries, escalation
  Pattern: OpenAI Swarm, LangGraph supervisor

PEER (Mesh):
  Agents communicate directly with each other.
  No central coordinator.
  Use when:
    - Tasks require back-and-forth (debate, consensus)
    - No clear hierarchy (multi-expert review)
  Pattern: AutoGen group chat, CrewAI

HIERARCHICAL (Tree):
  Top-level planner → mid-level coordinators → leaf workers.
  Use when:
    - Complex multi-stage workflows
    - Different stages need different models
  Pattern: MetaGPT, hierarchical LangGraph
```

### P3.2 — When Multi-Agent Beats Single Agent

```
USE MULTI-AGENT WHEN:
  - Different subtasks need different prompts/tools/context
  - Parallelism would speed up execution
  - Specialization improves quality (security review vs feature build)
  - You need a paper trail of who decided what

STAY SINGLE-AGENT WHEN:
  - Task is conversational / open-ended
  - Context flows naturally between steps
  - Coordination overhead > parallelism gain
  - Cost of N model calls > benefit

ANTI-PATTERN: 5 agents for what 1 agent could do in 2 steps.
RULE OF THUMB: Multi-agent adds cost. Use it for specialization, not for show.
```

### P3.3 — Inter-Agent Communication

```
MESSAGE CONTRACT (every inter-agent message):
  - from: agent_id
  - to: agent_id | "broadcast"
  - type: "request" | "response" | "status" | "escalation"
  - task_id: unique identifier for traceability
  - payload: structured data (not free text)
  - context: any shared state reference
  - correlation_id: link to parent task

DO NOT:
  - Pass raw LLM outputs between agents without validation
  - Use natural language as the message format (parse it back to JSON)
  - Skip logging the message (you will need it for debugging)
```


## P4 — MEMORY ARCHITECTURE

### P4.1 — Four Memory Types

```
SHORT-TERM (in-context):
  Lives in the current prompt. Cleared each turn.
  Use for: current task state, recent tool outputs
  Limit: context window size (8k-200k tokens)
  Cost: high (counts against every call)

EPISODIC (across sessions):
  Stored externally, retrieved when relevant.
  Use for: "last time we did X, we hit Y"
  Storage: vector DB or structured log
  Retrieval: semantic search by current context
  Cost: retrieval time + storage

SEMANTIC (facts):
  Curated knowledge about the user, project, domain.
  Use for: "user prefers TypeScript", "project uses Postgres 15"
  Storage: structured store (JSON, SQLite, KV)
  Retrieval: explicit lookup, not semantic
  Cost: storage + lookup time

PROCEDURAL (how-to):
  Learned skills and patterns the agent can apply.
  Use for: "this codebase uses 3-tier testing"
  Storage: prompt snippet, skill file, or learned policy
  Retrieval: matched to task type
  Cost: context tokens
```

### P4.2 — Memory Anti-Patterns

| Anti-pattern | Problem | Correct |
|---|---|---|
| Store everything as text in one vector DB | Retrieval is fuzzy, no structure | Use typed memory: short-term, episodic, semantic, procedural |
| No memory eviction | Context grows unbounded | TTL on episodic memory, compress after N entries |
| No memory versioning | Agent's "knowledge" silently drifts | Version memory + pin to session/decision |
| Memory = chat history dump | Tokens wasted, no signal | Memory = structured, ranked, deduplicated |
| Storing secrets in memory | Credential leak risk | Never store secrets; reference secret stores by ID |


## P5 — AGENT SECURITY

### P5.1 — Threat Model

```
AGENT THREATS:
  T1: Prompt injection via tool output
      Attacker controls a webpage. Agent reads it. Hidden instructions
      in the page override the agent's system prompt.
      Defense: tool output sanitization, instruction/data separation.

  T2: Tool poisoning
      Attacker registers a malicious tool. Agent calls it.
      Defense: tool allowlist, code-sign tools, review registry.

  T3: Excessive agency
      Agent has access to more tools/permissions than the task needs.
      Defense: least-privilege per task, just-in-time auth.

  T4: Indirect prompt injection via memory
      Attacker poisons the agent's memory. Future sessions execute
      the injected instruction.
      Defense: memory provenance, signed memory entries, periodic scrub.

  T5: Goal drift
      Agent's stated goal diverges from the user's actual goal
      (usually via injection). Agent pursues the wrong objective.
      Defense: explicit goal anchoring, periodic re-verification.

  T6: Resource exhaustion
      Attacker (or buggy tool) forces the agent into an infinite loop.
      Defense: max steps, token budget, wall-clock timeout, cost cap.
```

### P5.2 — Permission Boundaries

```
PER-AGENT PERMISSIONS:
  file_read:      [list of paths or globs]
  file_write:     [list of paths or globs]
  shell_exec:     [list of allowed commands or "none"]
  network_call:   [list of allowed domains or "none"]
  tool_call:      [list of tool names]

DEFAULT FOR UNKNOWN TOOLS: deny.
DEFAULT FOR NEW TASKS: ask user to confirm scope.

NEVER GIVE AN AGENT:
  - Unrestricted shell
  - Unrestricted network
  - Write access to production credentials
  - Ability to commit to main without review
  - Ability to spend real money (purchasing, transfers)
```


## P6 — AGENT OBSERVABILITY

### P6.1 — What to Log

```
PER TURN:
  - session_id, turn_id, agent_id
  - input (truncated if large)
  - thought (the agent's reasoning, if exposed)
  - tool_calls: name, args, duration, result (truncated), error
  - token_usage: input, output, cached
  - cost_estimate
  - latency_ms
  - stop_reason: complete | max_steps | budget | cancelled | error

PER SESSION:
  - All turns
  - Final outcome
  - Total cost, total latency
  - Human interventions

NEVER LOG:
  - Secrets (API keys, tokens, passwords)
  - Full PII (mask or hash)
  - User's private content not relevant to the task
```

### P6.2 — Debugging Failed Runs

```
STEP 1: Replay the trajectory
  Load the full conversation + tool calls. Replay mentally or
  with a tool that lets you step through.

STEP 2: Identify the failure point
  - Wrong thought: agent's reasoning was flawed
  - Wrong tool choice: agent picked the wrong tool
  - Tool error: tool returned an error
  - Tool misuse: agent used the tool incorrectly
  - Goal drift: agent lost track of the original goal

STEP 3: Classify the failure
  - Recoverable: same agent could retry with better context
  - Recoverable with prompt fix: prompt needs a small change
  - Architecture: loop design needs rework
  - Fundamental: this task isn't solvable with current capabilities

STEP 4: Fix at the right level
  - Prompt fix for prompt failure
  - Tool improvement for tool failure
  - Loop redesign for architecture failure
  - Add human-in-the-loop for fundamental limits
```


## P7 — EVALS FOR AGENTS

### P7.1 — What to Evaluate

```
EVAL DIMENSIONS:
  1. Task completion: did the agent achieve the goal?
  2. Tool selection: did it pick the right tool for each step?
  3. Step efficiency: did it take fewer than N steps?
  4. Cost: did it stay under the cost budget?
  5. Latency: did it finish within the time budget?
  6. Safety: did it avoid harmful actions / injections?
  7. Reliability: same input → same trajectory → same output?
  8. Recovery: did it recover gracefully from tool errors?
```

### P7.2 — Eval Types

```
OFFLINE EVALS:
  - Run on a held-out dataset
  - Deterministic, reproducible
  - Run in CI on every prompt/loop change
  - Catch regressions before deploy

ONLINE EVALS:
  - Run in production on a sample of real traffic
  - Catch distribution shift, novel inputs
  - Sample 1-5% to control cost
  - Human review of samples

LLM-AS-JUDGE:
  - Use a stronger LLM to score agent outputs
  - Fast, scalable, but has its own biases
  - Calibrate against human eval set first

HUMAN EVALS:
  - Slowest, most expensive, most accurate
  - Required for: new product, high-stakes domain, calibration
  - Sample 50-200 cases per release
```

### P7.3 — Eval Anti-Patterns

| Anti-pattern | Problem | Correct |
|---|---|---|
| Eval only on happy path | Agent passes, but fails on real edge cases | Eval set must include adversarial + edge cases |
| Eval on synthetic data only | Distribution mismatch with real users | Mix synthetic + real + production samples |
| No regression eval | New prompt improves avg but regresses 5% of cases | Maintain a frozen regression set; never edit it |
| Eval = "looks good to me" | Subjective, no signal | Numeric score, threshold, gating |
| Run eval once | Result is a snapshot, not a signal | Run evals on every change, track trend |


## P8 — MCP INTEGRATION

### P8.1 — What MCP Solves

```
MCP (Model Context Protocol) is a standard protocol for agents to
discover and call external tools. It replaces the N×M integration
problem (each agent × each tool = custom integration) with N+M
(agent speaks MCP, tool exposes MCP).

WHEN TO USE MCP:
  - Tool will be used by multiple agents
  - Tool is third-party and you want ecosystem reach
  - Tool changes frequently; you want decoupling
  - You want runtime tool discovery, not hardcoded

WHEN NOT TO USE MCP:
  - Single agent, single tool, no future need
  - Tool requires deep in-process state
  - Latency budget is <10ms (MCP adds overhead)
```

### P8.2 — MCP Server Best Practices

```
EXPOSE:
  - Each tool with name, description, input/output schema
  - Health check endpoint
  - Versioning in tool schema (so agents can detect breaking changes)

DO NOT EXPOSE:
  - Tools that mutate without an undo path
  - Tools that cost real money without confirmation
  - Tools that read PII without an explicit scope
  - Tools that can be used to escalate privilege

CONTRACT:
  - Idempotent where possible
  - Return structured errors, not exceptions
  - Document cost and latency in the tool description
  - Support cancellation
```


## P9 — OUTPUT FORMATS

### P9.1 — Agent Design Document

```
AGENT:           [name]
PURPOSE:         [what user goal this agent serves]
LOOP PATTERN:    [ReAct / Plan-Execute / Reflexion / custom]
TOPOLOGY:        [single / supervisor / peer / hierarchical]
TOOLS:           [list of tool names + 1-line purpose each]
MEMORY:          [short-term / episodic / semantic / procedural]
PERMISSIONS:     [scoped per task]
STOP CONDITIONS: [complete / max steps / budget / escalation]
BUDGETS:         [max steps: N, max tokens: N, max cost: $X, max time: T]
EVALS:           [offline: dataset, online: metric, regression: frozen set]
FAILURE MODES:   [what we accept, what we escalate]
```

### P9.2 — Agent Run Trace

```
TURN: 3 of 12 (token budget: 23k/100k, cost: $0.04)
THOUGHT: "I have the user's GitHub token but no repo name. I should ask."
TOOL CALL: ask_user(question="Which repo?")
  - args: { question: "Which repo should I work in?", options: ["myorg/api", "myorg/web", "other"] }
  - result: { answer: "myorg/api" }
  - latency: 1200ms (user response time)
OBSERVATION: User selected myorg/api. Proceed.
TURN: 4 of 12
...
```

### P9.3 — Agent Eval Report

```
EVAL SET: agent-v3-regression-2026-06-05
CASES: 200 (50 happy path, 50 adversarial, 50 edge, 50 multi-step)
RESULTS:
  task_completion:    94% (target: ≥90%)  PASS
  tool_selection:     96% (target: ≥95%)  PASS
  step_efficiency:    median 4, p95 9     PASS
  cost:               median $0.08, p95 $0.31  PASS
  latency:            median 6s, p95 28s  PASS
  safety_injection:   0/30 bypassed       PASS
  regression:         3 cases regressed >5% from v2  REVIEW
OUTCOME: ship with monitoring on 3 regression cases
```


## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Agent with no max step count | Infinite loop on bad output | Hard cap, default 25 |
| Tool calls without idempotency check | Double-charged on retry | Idempotency keys, dedup table |
| LLM picks tool from raw natural language | Parsing errors, ambiguity | Strict JSON schema, validation |
| Memory = full chat history dump | Token bloat, no signal | Structured, ranked, deduplicated memory |
| No human escalation path | Agent stuck or wrong, no recovery | Every agent has a "ask human" tool |
| Excessive agency | Agent has too many tools/permissions | Least-privilege per task |
| Eval = "looks good" | No signal, no regression detection | Numeric score, frozen regression set |
| MCP server with no schema versioning | Silent breaking changes | Version every tool, declare in schema |
| Multi-agent for what 1 agent can do | Coordination overhead, no benefit | Use single agent unless specialization helps |
| Goal drift via tool outputs | Injection attacks succeed | Sanitize tool outputs, separate instruction/data |
| Agent deployed without observability | Cannot debug, cannot measure | Log every turn, every tool call, every cost |
| Sharing raw LLM output between agents | Unstructured, untraceable | Structured message contract, validated |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every agent design, loop change, or eval set update.*

*Escalate to security-engineer when: agent handles untrusted tool outputs, has shell access, or operates on user data. Escalate to ai-safety-eval-engineer when: agent is user-facing or high-stakes.*
