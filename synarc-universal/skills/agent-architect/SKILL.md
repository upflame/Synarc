---
name: agent-architect
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - agentic-ai-engineer: ">=1.0.0"
title: Agent Architect — Multi-Agent Topologies, MCP, and A2A Protocols
description: Agent architecture reasoning — multi-agent topology design (supervisor, peer, hierarchical, marketplace, swarm), MCP server design and registry, agent-to-agent (A2A) protocol design, capability discovery, tool registry patterns, agent identity and trust, agent observability at the system level, cost/latency budgeting across the agent graph, failure cascade analysis. The architect-level discipline for agentic systems. Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - agent-architecture
  - multi-agent
  - mcp
  - a2a
  - agent-protocol
  - capability-discovery
  - agent-registry
  - agent-trust
  - agent-observability
  - cost-budgeting
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

# Agent Architect — Multi-Agent Topologies, MCP, and A2A Protocols

Inherits synarc core. All synarc prohibitions apply.

An agent architect designs the topology, communication, and discovery layer for multi-agent systems. Where an agentic-ai-engineer designs a single agent, an agent-architect designs the system of agents: who calls whom, how they find each other, what they can do, how trust is established, and how the whole graph is observed and budgeted.


## P2 — TOPOLOGY SELECTION

### P2.1 — Five Core Topologies

```
SINGLE (no topology):
  One agent does everything. Use for: prototypes, narrow tasks, low QPS.

SUPERVISOR (star):
  Supervisor delegates to N workers. Workers do not talk.
  Use for: clean task decomposition, central control of cost/retries.
  Example: LangGraph supervisor, OpenAI Swarm.

PEER (mesh):
  Agents communicate directly. No central coordinator.
  Use for: debate, consensus, multi-expert review.
  Example: AutoGen group chat.

HIERARCHICAL (tree):
  Top planner → mid coordinators → leaf workers.
  Use for: complex multi-stage workflows, mixed-model stages.
  Example: MetaGPT.

MARKETPLACE (auction):
  Agents bid for tasks. Coordinator picks best bid.
  Use for: heterogeneous capabilities, dynamic work allocation.
  Example: AI agent marketplaces.

SWARM (broadcast):
  Many small agents, each doing a piece in parallel, results aggregated.
  Use for: parallelizable exploration, ensemble reasoning.
  Example: OpenAI Swarm patterns.
```

### P2.2 — Topology Decision Matrix

| Topology | Coordination | Cost | Reliability | Best for |
|---|---|---|---|---|
| Single | None | Low | High (one failure point) | Narrow tasks, prototype |
| Supervisor | Central | Medium | Medium (SPOF) | Decomposable workflows |
| Peer | Distributed | High | Medium (consensus) | Multi-expert review |
| Hierarchical | Layered | High | High (per-stage failure) | Complex multi-stage |
| Marketplace | Auction | Variable | Variable (depends on bidders) | Heterogeneous capabilities |
| Swarm | Broadcast | High (parallel) | High (redundancy) | Parallel exploration |

### P2.3 — When NOT to Add a Topology

```
DO NOT ADD A TOPOLOGY JUST BECAUSE YOU CAN.
Multi-agent adds:
  - Cost (N model calls per task)
  - Latency (coordination overhead)
  - Failure modes (what if supervisor crashes?)
  - Debugging surface (N trajectories to trace)

SINGLE AGENT IS CORRECT WHEN:
  - One prompt + one model handles the task
  - Context flows naturally across steps
  - No specialization needed
  - You cannot articulate why N>1 helps

RULE OF THUMB: 1 agent that does it well > 5 agents that coordinate poorly.
```


## P3 — CAPABILITY DISCOVERY

### P3.1 — How Agents Find Tools and Other Agents

```
DISCOVERY MECHANISMS:
  STATIC REGISTRY:
    - Pre-declared list of tools / agents
    - Loaded at agent startup
    - Pros: predictable, fast
    - Cons: no dynamic discovery

  MCP REGISTRY:
    - MCP servers register their tools at startup
    - Agent queries the registry for available tools
    - Pros: standard, dynamic, tool vendor-agnostic
    - Cons: MCP overhead, registry availability

  A2A PROTOCOL:
    - Agent publishes a "card" with its capabilities
    - Other agents query and call via A2A
    - Pros: decentralized, scalable
    - Cons: trust verification needed

  AGENT MARKETPLACE:
    - Public registry of agents with verified capabilities
    - Agents bid or are matched to tasks
    - Pros: largest capability surface
    - Cons: trust, cost, latency
```

### P3.2 — Agent Card (A2A Standard)

```
AGENT CARD:
  id:               "data-analyst-v3"
  name:             "Data Analyst"
  description:      "Analyzes tabular data, runs queries, produces reports"
  version:          "3.1.0"
  provider:         "internal"
  capabilities:
    - "sql-query"
    - "statistical-analysis"
    - "chart-generation"
  input_schemas:    { per capability }
  output_schemas:   { per capability }
  cost_estimate:    "low (10-50 LLM calls per task)"
  latency_estimate: "5-30s per task"
  auth:             "oauth2 / api-key / mTLS"
  sla:              "99% within 30s"
  trust_signals:
    - "verified_provider: true"
    - "code_signed: true"
    - "audit_log: https://..."
    - "data_handling: no-pii"
```

## P4 — MCP SERVER DESIGN

### P4.1 — When to Build an MCP Server

```
BUILD AN MCP SERVER WHEN:
  - The tool will be used by multiple agents
  - The tool changes frequently
  - You want ecosystem reach (third-party agents can use it)
  - You want runtime discovery, not hardcoded tools

DO NOT BUILD AN MCP SERVER WHEN:
  - Single agent, single tool
  - Latency budget < 10ms
  - Tool requires deep in-process state
  - You're prototyping
```

### P4.2 — MCP Server Best Practices

```
EXPOSE:
  - Each tool: name, description, input/output JSON Schema
  - Versioning: tool schema version, breaking change detection
  - Health check endpoint
  - Capability discovery: list_tools, describe_capability
  - Per-call cost and latency estimates

DO NOT EXPOSE:
  - Tools that mutate without undo (unless explicitly requested)
  - Tools that cost real money without confirmation
  - Tools that read PII without scope
  - Tools that escalate privilege

CONTRACT:
  - Idempotent where possible
  - Structured errors (not exceptions)
  - Document cost and latency per tool
  - Support cancellation and timeout
  - Per-tool ACL and rate limits
```

### P4.3 — MCP Server Anti-Patterns

| Anti-Pattern | Problem | Correct |
|---|---|---|
| No schema versioning | Silent breaking changes | Version every tool, declare in schema |
| Tools that throw exceptions | Caller cannot handle gracefully | Return structured error, never throw |
| Tools without idempotency | Double-effects on retry | Idempotency key support, dedup table |
| No ACL on tool | Over-privileged calls | Per-tool ACL, per-caller scope |
| Latency undeclared | Cannot budget | Declare p50/p95 in tool description |
| No cancellation | Hung calls block agents | Support cancellation token |
| Unbounded tool list | Agent overwhelmed | Group tools, role-based filtering |


## P5 — AGENT-TO-AGENT (A2A) PROTOCOL

### P5.1 — A2A Message Contract

```
EVERY A2A MESSAGE HAS:
  message_id:    unique identifier
  correlation_id: parent message if reply
  from:          sender agent_id
  to:            receiver agent_id | "broadcast"
  type:          "request" | "response" | "status" | "escalation"
  task_id:       unique task identifier (groups messages)
  payload:       structured data (JSON)
  timestamp:     ISO8601
  auth:          signature, token, or mTLS proof
  ttl:           how long the message is valid

DO NOT:
  - Pass raw LLM output between agents without validation
  - Use natural language as the message format
  - Skip logging (you will need it for debugging)
  - Skip auth (agents must prove identity and scope)
```

### P5.2 — Trust & Auth

```
AGENT TRUST CHAIN:
  - Agent identity: signed certificate or token
  - Capability: signed card published by provider
  - Per-call scope: limited to declared task
  - Audit trail: every call logged with payload

DEFENSES:
  - Verify agent identity before accepting task
  - Verify capability card is signed by trusted provider
  - Re-validate per-call scope (no implicit trust)
  - Rate limit per agent_id
  - Detect anomalous behavior (sudden cost spike, new tool sequence)

REVOCATION:
  - Maintain a revocation list (CRL-style)
  - Check on every call
  - Cache with TTL to avoid latency
```


## P6 — AGENT GRAPH OBSERVABILITY

### P6.1 — What to Trace

```
PER CALL:
  - caller, callee, task_id, correlation_id
  - input (truncated), output (truncated)
  - latency, token cost, error
  - tool calls within the agent
  - model used (name, version)

PER TASK (multi-call):
  - Full graph: who called whom
  - Total cost, total latency
  - Critical path
  - Failed edges and recovery

CROSS-SYSTEM:
  - All tasks over time
  - Cost per task type
  - Failure rate per agent
  - Latency p50/p95/p99 per task
  - Token cost per agent (catching runaway agents)
```

### P6.2 — Debugging Multi-Agent Failures

```
STEP 1: Identify the failing agent
  Trace task_id, find the first agent that returned an error or
  produced a bad output that propagated.

STEP 2: Replay the trajectory
  Replay the full message graph in order. Look for:
  - Bad message routing (wrong agent called)
  - Bad message content (garbled payload)
  - Cascade failure (one agent's error broke the next)

STEP 3: Classify
  - Topology: wrong agent for the job
  - Routing: logic chose wrong path
  - Communication: message lost or malformed
  - Capability: agent lacks the tool
  - Cost/latency: budget hit, partial result

STEP 4: Fix at the right level
  - Topology: redesign the graph
  - Routing: fix the supervisor's decision logic
  - Communication: add validation, retry, dead-letter
  - Capability: extend the agent's tools
  - Budget: increase the budget or reduce scope
```


## P7 — COST & LATENCY BUDGETING

### P7.1 — Per-Agent Budgets

```
EVERY AGENT IN THE GRAPH MUST DECLARE:
  - cost_per_call:   estimated $
  - latency_p50:     estimated seconds
  - latency_p95:     estimated seconds
  - max_concurrency: parallel calls supported
  - rate_limit:      calls per minute

TOTAL TASK BUDGET:
  - Sum of all agents in the critical path
  - Add coordination overhead (estimate 10-30%)
  - Reserve 20% for retries

EXAMPLE:
  Task: "Analyze Q3 revenue and write report"
  Path: planner → data-retriever → analyst → writer
  Costs:   $0.01  +  $0.05        +  $0.20   +  $0.15 = $0.41
  + overhead 30% = $0.53
  + retry 20%  = $0.64
  Budget:    $1.00
  Result:    within budget

CIRCUIT BREAKERS:
  - Per-agent cost cap (alert + stop)
  - Per-task cost cap (alert + abort)
  - Per-task latency cap (alert + abort)
  - Per-agent error rate threshold (alert + fallback)
```


## P8 — OUTPUT FORMATS

### P8.1 — Agent Architecture Document

```
SYSTEM:         [name]
USE CASE:       [what user need it serves]
TOPOLOGY:       [supervisor / peer / hierarchical / etc.]
AGENTS:         [list with one-line purpose each]
COMMUNICATION:  [A2A / MCP / custom]
DISCOVERY:      [static / MCP / A2A / marketplace]
BUDGET:         [$/task, ms/task]
OBSERVABILITY:  [trace: yes, log: yes, eval: yes]
FAILURE MODES:  [SPOF: ..., cascade: ..., recovery: ...]
SECURITY:       [auth model, scope per call, audit log]
```

### P8.2 — Agent Capability Card

```
id:               [agent-id]
name:             [display name]
version:          [semver]
description:      [1-2 sentences]
capabilities:     [list of capability names]
input_schemas:    [per capability]
output_schemas:   [per capability]
cost_estimate:    [low / medium / high + dollar range]
latency_estimate: [p50, p95]
auth:             [method]
sla:              [availability, response time]
trust_signals:    [provider verified, code signed, audit log]
```

## P9 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Multi-agent for what 1 agent does | Coordination overhead, no benefit | Single agent unless specialization helps |
| No topology rationale | Random N-agent system, hard to debug | Document why each agent exists |
| No A2A auth | Trust boundary violation | Verify identity + scope per call |
| No cost budget | Runaway cost in production | Per-task and per-agent budgets, circuit breakers |
| No observability | Cannot debug, cannot measure | Trace every call, every task, every cost |
| No failure recovery | Cascade failures | Per-edge retry, dead-letter, fallback agent |
| Tools without schema versioning | Silent breaking changes | Version every tool, declare in schema |
| Marketplace without trust signals | Malicious agents in production | Verified providers, signed cards, revocation list |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every topology change, capability card update, or A2A protocol change.*

*Escalate to security-engineer when: agents cross trust boundaries, handle PII, or take high-risk actions. Escalate to ai-safety-eval-engineer when: agents are user-facing at scale.*
