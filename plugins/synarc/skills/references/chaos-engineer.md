---
title: "Chaos Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - chaos-engineer
  - resilience
  - failure-injection
  - game-days
  - steady-state
  - hypothesis-testing
  - blast-radius
---

# Purpose

Proactively discover weaknesses in distributed systems through controlled experimentation. Design experiments that probe system behavior under failure conditions, discover weaknesses before customer-facing incidents, and build organizational resilience through hypothesis-driven testing.

# Scope

Experiment design methodology, GameDay planning and execution, failure injection techniques (infrastructure, application, database, network), resilience testing patterns, observability for experiments, chaos engineering in CI/CD, container/K8s chaos, cloud-specific chaos, post-experiment analysis. Inherits synarc core.

# Inputs

System architecture, incident history, steady-state metrics, capacity model, dependency graph, recent deployment patterns, on-call feedback.

# Output

Experiment hypotheses, steady-state baselines, experiment runbooks, GameDay scenarios, remediation action items, resilience maturity assessments.

## 1. Principles of Chaos Engineering

**Principle 1 — Define Steady State**: Measure normal behavior through observable outputs (latency, throughput, error rates) with known baselines and acceptable ranges.

**Principle 2 — Experiment in Production**: Production is where real traffic, data, and behavior patterns exist. Safety constraints: small blast radius, progressive intensity, automated rollback, human approval gates for high risk, low-traffic windows.

**Principle 3 — Minimize Blast Radius**: Single-instance before multi-instance, low-traffic shards first, feature flags for isolation, time-bound with hard TTLs, circuit breakers to limit cascading.

**Principle 4 — Automate Continuously**: Manual → semi-automated → fully automated with safety gates → continuous in CI/CD → proactive based on deploy risk.

## 2. Experiment Lifecycle

[1] **Identify Hypothesis**: from incidents/near-misses, architecture reviews, known dependencies, deploy data, on-call observations, capacity concerns. Hypothesis template: "When [failure], the system will [behavior] within [timeframe] with [measurable outcomes] limited to [blast radius]."

[2] **Define Steady State**: user-facing metrics (p50/p95/p99 latency, error rate, throughput), infrastructure metrics (CPU, memory, disk I/O, network), dependency metrics (DB latency, cache hit ratio, queue depth), business metrics (checkout rate, cart abandonment). Baseline: minimum 24h, recommended 7d.

[3] **Design Experiment**: YAML config with failure type, target, parameters, duration, blast radius restrictions, rollback criteria (auto-rollback with metric thresholds), notification channels, schedule window.

[4] **Safety Review**: Tier 1 (self-review), Tier 2 (peer review), Tier 3 (SRE + IC review, dry run mandatory), Tier 4 (VP approval, business impact assessment).

[5-6] **Implement & Execute**: Pre-execution checklist: steady state ok, time window, approvals, rollback verified, stakeholders notified. Monitoring loop: check metrics vs rollback criteria every 5s.

[7] **Analyze Results**: Compare experiment data vs baseline. Compute deviation percentage, statistical significance (p < 0.05). Accept or reject hypothesis.

[8-10] **Document, Track Remediation, Share**: Experiment report with timeline, findings, remediations. Tracking schema: each finding has priority, owner, deadline, verification experiment. Knowledge sharing: newsletter, brown bags, searchable catalog, Slack digests.

## 3. GameDay Planning

### GameDay vs Chaos Experiment

Chaos experiment: specific hypothesis, 1-2 engineers, minutes-hours, technical finding. GameDay: end-to-end incident simulation, full IR team, 1-4 hours, process improvement.

### Phase 1 — Design (2-4 weeks before)

Scenario criteria: realistic (based on actual incidents), challenging, educational, achievable, measurable. Sources: production incidents, upcoming changes, new deployments, compliance requirements.

### Phase 2 — Preparation (1-2 weeks)

Notifications, calendar blocks, environment ready, dashboards configured, communication channels created, simulation scripts tested, rollback verified, observers briefed.

### Phase 3 — Execution

Timeline: T-30min briefing → T+0 start → T+15/30/60/90 check-ins → T+2h end → debrief → retro → action items. Facilitator: timekeeper, injector, observer, note-taker, safety guardian. Participants respond as real incident, use actual tools, no preparation.

### Phase 4 — Retrospective

What went well, what could improve, action items (single owner, deadline), metrics (time to detect/respond/resolve, escalations used, participant satisfaction).

### Scenario Catalog

Cascading failure (memory leak → OOM → LB shift → downstream timeouts), silent dependency (API format change without notice), certificate expiry (multiple certs simultaneous), data corruption (index corruption), region failover, misconfigured deployment (10x resource limits → cost explosion).

## 4. Failure Injection Techniques

### Infrastructure

**EC2 termination**: test ASG replacement, connection draining, LB health checks. **K8s pod deletion**: test PDBs, replica management, graceful shutdown. **Node failure**: cordon/drain, pod rescheduling, cluster autoscaling. **Disk failure**: I/O errors, latency, full disk scenarios. **AZ failure**: terminate/isolate single AZ resources, verify multi-AZ failover.

### Network

Latency injection (tc/netem), packet loss, partition via security group revocation, DNS failure. Target end-to-end: latency, errors, circuit breaker behavior.

### Application

Resource exhaustion (CPU/memory/file descriptors), process kill, dependency degradation (slow/down external APIs), panics, deadlocks.

### Database

Connection pool exhaustion, query latency injection, replication lag, failover testing, table/index corruption, backup restore validation.

## 5. Resilience Testing Patterns

### Circuit Breaker Validation

Inject failures to upstream service. Verify: circuit opens after N failures, requests fail fast (not hang), circuit half-opens after timeout, retries succeed after recovery.

### Retry & Backoff Testing

Verify exponential backoff, jitter, retry budgets, no retry storm. Retry storm detection: downstream request rate spikes during upstream failure.

### Bulkhead / Pool Testing

Thread pool exhaustion, connection pool saturation. Verify: one pool exhausting does not starve another. Degradation is contained.

### Timeout Testing

Client-side timeouts vs server-side timeouts. Verify: short timeouts cause graceful degradation, no cascading timeout chains.

## 6. Observability for Experiments

Every experiment must have dedicated dashboards showing: steady-state vs experiment metrics side-by-side, rollback criteria thresholds, timeline annotations, alert status. Experiment telemetry: which pods/services affected, duration, blast radius, metric deviations.

Post-experiment analysis: timeline of events (when failure injected, when system degraded, when rollback triggered, when steady state restored), metric deviation charts, statistical significance of changes.

## 7. Maturity Model

**L1 Ad-Hoc**: manual experiments, no repeatability. **L2 Repeatable**: documented experiments, basic tooling. **L3 Defined**: structured lifecycle, automated tooling, safety reviews. **L4 Managed**: CI/CD integration, automated experiments, trend analysis, maturity metrics. **L5 Optimized**: continuous proactive experimentation, predictive resilience, experiment-driven capacity planning, organizational learning culture.

## 8. Anti-Patterns

Experiments without hypothesis (activity ≠ progress). No rollback plan. Blast radius too large. Running during peak traffic. Not sharing findings. Treating findings as failures vs learning opportunities. Only testing in staging. No blameless culture. Skipping steady-state definition. Ignoring remediation tracking.

## 9. Tooling

Orchestration: LitmusChaos, Chaos Mesh, Gremlin, AWS FIS, Azure Chaos Studio. Observability: Prometheus, Grafana, Datadog, Honeycomb, OpenTelemetry. Infrastructure: Kubernetes, Terraform, Helm, Crossplane. CI/CD: GitHub Actions, GitLab CI, Argo Workflows.
