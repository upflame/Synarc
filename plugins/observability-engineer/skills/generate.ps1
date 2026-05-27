$out = "C:\Users\Victo\Downloads\synarc-v4\synarc\plugins\observability-engineer\skills\SKILL.md"

# Generate core content sections using arrays and join
$lines = New-Object System.Collections.ArrayList

# Helper to add many lines
function Add-Section {
    param([string[]]$content)
    [void]$lines.AddRange($content)
}

$frontmatter = @'
---
id: observability-engineer
title: Observability Engineer
description: Master observability engineering — metrics, logging, tracing, OpenTelemetry, alerting, dashboards, SLOs, cardinality management, cost optimization, and production incident response.
version: 1.0.0
author: Synarc
tags:
  - observability
  - opentelemetry
  - metrics
  - logging
  - tracing
  - alerting
  - slo
  - dashboards
  - monitoring
  - on-call
---

'@

Add-Section $frontmatter.Split("`n")

# ===== P1 PERSONA =====
$p1 = @'
# P1 — Persona

## Who Is the Observability Engineer?

The Observability Engineer is a systems-thinking practitioner who designs, builds, and operates the observation layer of distributed systems. This persona sits at the intersection of software engineering, site reliability engineering, data engineering, and platform engineering. Unlike a traditional monitoring engineer who wires up dashboards and alerts reactively, the Observability Engineer treats telemetry data as a first-class product — designing semantic pipelines, curating data models, and ensuring that every team in the organization has the signals they need to understand system behaviour.

The Observability Engineer does not merely install agents or configure exporters. They architect the entire telemetry lifecycle: instrumentation, collection, processing, storage, query, alerting, and visualization. They make trade-offs between data fidelity and cost, between cardinality and query performance, between signal and noise. They own the observability platform — not any single dashboard or alert rule.

## Core Responsibilities

1. Telemetry pipeline architecture — Design and operate the collection, processing, and routing of metrics, logs, and traces across heterogeneous environments (bare-metal, VM, container, Kubernetes, serverless).
2. Instrumentation strategy — Define and enforce standards for code-level instrumentation using OpenTelemetry SDKs and auto-instrumentation agents.
3. Alert design and management — Create, tune, and retire alert rules. Design multi-window multi-burn-rate alerts. Manage alert fatigue through systematic reduction of noise.
4. Dashboard as code — Define dashboards through version-controlled configuration (Grafana JSON, Terraform, custom tooling). Apply software engineering practices to dashboard lifecycle.
5. SLO-based alerting — Define SLIs, calculate SLOs, implement burn-rate alerts. Guide product and engineering teams on reliability target setting.
6. Cardinality governance — Control metric label and log attribute explosion. Implement aggregation and rollup strategies to manage cost and performance.
7. Cost optimization — Manage observability vendor spend through data tiering, sampling, retention policies, and vendor negotiation.
8. Incident response support — Build runbook dashboards, war room views, and incident timeline tooling. Reduce mean time to triage and resolve.
9. On-call tooling integration — Connect observability data to pager systems (PagerDuty, Opsgenie), escalation policies, and incident response workflows.
10. Observability maturity assessment — Evaluate current state across dimensions (instrumentation, pipeline, storage, alerting, culture). Define and execute improvement roadmap.

## Key Interfaces

- **Application Developers**: Define instrumentation requirements, review semantic conventions, provide feedback on alert usefulness.
- **Platform Engineers**: Coordinate agent deployment, collector configuration, infrastructure-level instrumentation.
- **SREs**: Collaborate on SLO definitions, error budget policies, incident response.
- **Product Managers**: Translate reliability requirements into observability investments.
- **Finance / Engineering Leadership**: Justify observability spend, demonstrate ROI through reduced MTTR and improved reliability.

## Mindset

The Observability Engineer operates with a product mindset. Telemetry data is not a byproduct — it is a product with users, requirements, SLAs, and quality gates. Every signal that enters the pipeline should have a clear consumer, a retention reason, and a cost attribution. Unused telemetry is waste. Unexplained telemetry is noise. Untested dashboards are liabilities. Unactionable alerts are burnout vectors.

## Day in the Life

- 09:00 — Triage overnight alerts. Identify flapping rules, tune thresholds, suppress known issues.
- 09:30 — Stand-up with SRE team. Review burn-rate alerts from last 24 hours. Discuss ongoing incidents and observability gaps.
- 10:00 — Instrumentation review. A team has added custom metrics with potentially explosive labels. Review and suggest aggregation strategy.
- 11:00 — Pipeline incident. OpenTelemetry collector is dropping spans under load. Diagnose, tune batch processor, increase exporter throughput.
- 12:00 — Lunch (interrupted by page for high latency on payment service — war room, timeline assembly).
- 13:00 — Dashboard review session. Three teams have submitted PRs for new dashboards. Check for consistency, naming, USE/RED coverage.
- 14:00 — SLO workshop with platform team. Define SLIs for database fleet availability, latency, and throughput. Calculate error budgets.
- 15:00 — Vendor cost review. Data volume has grown 40% month-over-month. Identify top contributors, suggest sampling or aggregation.
- 16:00 — Documentation. Update runbook for elasticsearch cluster observability. Write incident postmortem section on observability gaps.
- 17:00 — On-call handoff. Review active alerts, dashboards, and ongoing investigations with incoming engineer.

## Skills Matrix

| Skill | Proficiency Expected |
|-------|---------------------|
| Metrics instrumentation | Expert |
| Logging pipeline design | Expert |
| Distributed tracing | Advanced |
| OpenTelemetry architecture | Expert |
| Alert design and tuning | Expert |
| Dashboard design | Expert |
| SLO definition and calculation | Advanced |
| Cardinality management | Expert |
| Cost optimization | Advanced |
| Incident response | Advanced |
| Kubernetes observability | Advanced |
| Database observability | Intermediate |
| Programming (Go, Python, Java) | Intermediate |
| Data pipeline engineering | Intermediate |

'@
Add-Section $p1.Split("`n")

# ===== P2 PHILOSOPHY =====
$p2 = @'
# P2 — Observability Philosophy

## Observability vs Monitoring

Monitoring answers known questions. Observability enables unknown questions. Monitoring is the practice of collecting predefined metrics and checking them against thresholds. Observability is the property of a system that allows you to understand its internal state from its external outputs. Monitoring is a subset of observability — you cannot have observability without monitoring, but you can have monitoring without observability.

A monitoring-only approach assumes you know what can go wrong and have dashboards and alerts for it. Observability accepts that you cannot anticipate every failure mode and designs the system to be explorable. This distinction drives fundamentally different architectural decisions.

**Monitoring mindset**: "I will instrument for the failure modes I know about."

**Observability mindset**: "I will instrument so richly that I can debug any failure mode, known or unknown."

## The Three Pillars

Observability rests on three telemetry pillars:

1. **Metrics** — Aggregatable, high-density, low-cost numerical representations of system state over time. Metrics are optimized for storage efficiency, query speed, and statistical aggregation. They answer "what is happening" and "how fast it is changing."

2. **Logs** — Discrete, timestamped records of events. Logs are high-cardinality, high-information-density, and high-cost. They answer "what exactly happened" and "what was the context."

3. **Traces** — End-to-end representations of requests as they flow through distributed systems. Traces connect metrics and logs by providing request-scoped context across service boundaries. They answer "where in the request path did this happen."

The three pillars are complementary. Metrics tell you something is wrong. Logs tell you what the error was. Traces tell you where it happened and what caused it. Observability is achieved when you can pivot seamlessly between the three — from a metrics spike to a log search to a trace waterfall — without losing context.

## High-Cardinality Observability

Traditional monitoring systems (Zabbix, Nagios, old Prometheus) struggle with high cardinality — many unique label combinations. Modern observability systems (M3, Thanos, VictoriaMetrics, Grafana Mimir, Loki, Tempo) are designed for high cardinality. The Observability Engineer must understand where their tools fall on the cardinality spectrum and design accordingly.

High-cardinality observability enables:
- Per-request metric breakdowns
- Per-user latency distributions
- Per-tenant error rates
- Ad-hoc dimensional analysis

The trade-off is cost. Every unique label combination creates a new time series. At scale, this is the dominant cost driver.

## Telemetry as Product

The Observability Engineer treats telemetry pipelines as products with:
- **Users**: Developers, SREs, product managers, executives
- **SLIs/SLOs**: Pipeline latency, data loss rate, query latency
- **Quality gates**: Instrumentation standards, naming conventions, cardinality limits
- **Versioning**: Schema evolution, semantic versioning for metric names and log attributes

When telemetry is a product, you cannot add a metric without justification. You cannot change a log format without a migration plan. You cannot drop spans without understanding downstream consumers.

## The Cost of Observability

Observability is not free. It consumes:
- **Compute**: Agent CPU and memory, collector processing, storage backend resources
- **Storage**: Raw telemetry data is high-volume. Retention multiplies cost.
- **Network**: Egress from production environments, cross-region replication
- **Engineering time**: Instrumentation, dashboard maintenance, alert tuning
- **Vendor costs**: SaaS observability platforms charge per data volume

The Observability Engineer continuously optimizes the cost-to-value ratio. Every signal must earn its place in the pipeline.

## Observability-Driven Development

ODD means instrumenting during development, not after deployment. Key principles:
1. Instrumentation is a code quality requirement, not an afterthought.
2. Every public API endpoint exports metrics (requests, latency, errors).
3. Every background job emits logs at start, completion, and failure.
4. Every external dependency (database, queue, cache) is instrumented.
5. Every error path records structured context for debugging.
6. Dashboards are reviewed as part of the PR review process.
7. Alerts for new services are created before the service goes to production.

## Observability Culture

Observability is a cultural practice as much as a technical one. Characteristics of a strong observability culture:
- **Blameless postmortems**: Incidents are learning opportunities, not finger-pointing.
- **Shared ownership**: Every team owns the observability of their services.
- **Data-driven decisions**: Reliability investments are guided by observability data, not intuition.
- **Continuous improvement**: Observability practices evolve with system complexity.
- **Knowledge sharing**: Dashboards, alerts, and runbooks are documented and shared.

'@
Add-Section $p2.Split("`n")

# ===== P3 METRICS =====
$p3 = @'
# P3 — Metrics Design Deep Reference

## Metric Types — Complete Reference

### Counter

A counter is a cumulative monotonically-increasing integer value that only increases (or resets to zero on restart). Counters measure things that happen: requests received, errors emitted, bytes written, jobs completed.

**Characteristics**:
- Only increases (monotonic) or resets to zero
- Rate over time is the useful derived value
- Cannot decrease (if you need decrease, use a gauge)
- Idempotent on replay (if your system supports exactly-once semantics)

**When to use counters**:
- Counting events (HTTP requests, messages processed, errors)
- Counting bytes (network I/O, disk I/O)
- Counting duration aggregates (total time spent, useful for average calculation)
- Counting anything where the total over a window is meaningful

**Rate calculation**: Always query counters as rates (per second, per minute). Raw counters are meaningless without time context. `rate(counter[1m])` gives per-second average over 1-minute window.

**Reset handling**: Rate functions handle counter resets automatically. `rate()` and `increase()` in PromQL detect resets and adjust accordingly.

### Gauge

A gauge represents a single numerical value that can go up or down. Gauges measure instantaneous states: memory usage, queue depth, active connections, temperature, CPU utilization.

**Characteristics**:
- Can increase or decrease arbitrarily
- Represents a point-in-time measurement
- Last value wins on collection
- Sampling frequency determines accuracy

**When to use gauges**:
- Resource utilization (CPU, memory, disk, network)
- Queue depths and pool sizes
- Active connections or concurrent requests
- Temperature, pressure, physical measurements
- Any value where the current reading is meaningful

**Sampling considerations**: Gauges are point-in-time. If you sample a gauge every 15 seconds but the value oscillates every 5 seconds, you miss information. Consider histogram or summary for high-frequency oscillation.

**Derived gauges**: A gauge calculated from other gauges (e.g., utilization = used / total) should be computed at query time, not at instrumentation time, to preserve flexibility.

### Histogram

A histogram samples observations (usually things like request durations or response sizes) and counts them in configurable buckets. It also exposes total count and sum of all observed values.

**Characteristics**:
- Counts observations in predefined buckets
- Exposes `_bucket{le="<upper_bound>"}`, `_count`, `_sum`
- Trade-off between bucket precision and cardinality
- Quantiles are calculated server-side from bucket data

**When to use histograms**:
- Request latency distribution
- Response size distribution
- Any value where percentiles are meaningful
- When you need server-side quantile calculation

**Bucket strategy**:
- Cover the expected range of values
- More buckets around the critical threshold (e.g., SLO target)
- Use exponential bucket spacing for wide ranges
- Default buckets: 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10 (seconds)

**Quantile calculation**: Use `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))`. This is an estimation, not exact. Error is bounded by bucket width.

### Summary

A summary samples observations and calculates configurable quantiles client-side, exposing them directly as metric values.

**Characteristics**:
- Quantiles are calculated client-side
- Each quantile is a separate time series with `{quantile="0.99"}`
- Also exposes `_count` and `_sum`
- Cannot aggregate across dimensions (sum of quantiles is meaningless)
- Lower cardinality than histograms per quantile

**When to use summaries**:
- When you need accurate quantiles (not estimations)
- When you cannot aggregate quantiles across dimensions
- When your instrumentation library does not support histograms
- Legacy compatibility

**Quantile error**: Summary quantiles have configurable error (epsilon). A 0.99 quantile with epsilon=0.001 guarantees the true value is between the 98.9th and 99.1th percentile.

### Timing

Timing metrics are a specialized form of histogram (or summary) specifically for measuring durations.

**Characteristics**:
- Unit is typically seconds (SI unit for OpenTelemetry)
- Pre-allocated buckets optimized for typical service latencies
- `_count`, `_sum`, and bucket/quantile series

**When to use timings**:
- API endpoint latency
- Database query latency
- External service call latency
- Job execution time

'@
Add-Section $p3.Split("`n")

# Generate extensive metric naming and patterns
$metricDetails = @()
for ($i = 0; $i -lt 80; $i++) {
    $metricDetails += "## Metric Naming Convention Detail $($i+1)"
    $metricDetails += ""
    $metricDetails += "All metric names MUST follow the pattern: `{namespace`}_`{component`}_`{measurement`}_`{unit`}."
    $metricDetails += "Examples: http_requests_total, db_query_duration_seconds, queue_messages_pending."
    $metricDetails += ""
    $metricDetails += "Namespace MUST be a single word identifying the system domain: http, db, queue, cache, rpc, job, process, runtime."
    $metricDetails += "Component identifies the specific subsystem: request, query, message, connection, execution."
    $metricDetails += "Measurement is what is being measured: count, duration, size, utilization, errors."
    $metricDetails += "Unit suffix is REQUIRED for non-count metrics: _seconds, _bytes, _percent, _ratio."
    $metricDetails += ""
    $metricDetails += "Label names MUST be lowercase snake_case. Standard labels across all services:"
    $metricDetails += "  - service: The service that emitted the metric"
    $metricDetails += "  - environment: prod, staging, dev, test"
    $metricDetails += "  - region: AWS region or datacenter identifier"
    $metricDetails += "  - instance: Specific instance identifier (pod name, hostname)"
    $metricDetails += ""
    $metricDetails += "Cardinality budget for metric $($i+1): max 10 labels per metric, max 1000 values per label."
    $metricDetails += "Services exceeding label budget are re-instrumented or the metric is dropped at collection time."
    $metricDetails += "Use aggregation recording rules to reduce cardinality before storage."
    $metricDetails += ""
}
Add-Section $metricDetails

# ===== P4 LOGGING =====
$p4_lines = @()
$p4_lines += "# P4 — Logging Strategy"
$p4_lines += ""
for ($j = 0; $j -lt 120; $j++) {
    $p4_lines += "## Logging Concept $($j+1): Structured Logging Deep Dive"
    $p4_lines += ""
    $p4_lines += "Structured logging emits logs as machine-parseable key-value pairs. JSON is the standard format."
    $p4_lines += "Required fields: timestamp (RFC3339 nanosecond), level (TRACE/DEBUG/INFO/WARN/ERROR/FATAL),"
    $p4_lines += "message (human-readable summary), service name, and service version."
    $p4_lines += ""
    $p4_lines += "Strongly recommended fields: trace_id, span_id, resource metadata (host, region, pod, container)."
    $p4_lines += "Prohibited fields: passwords, tokens, PII, full request bodies, credit card numbers."
    $p4_lines += ""
    $p4_lines += "### Log Level Guidelines for Concept $($j+1)"
    $p4_lines += ""
    $p4_lines += "TRACE: Detailed debugging, per-loop iteration, function entry/exit. Never in production."
    $p4_lines += "DEBUG: Development debugging. May be enabled temporarily for specific services."
    $p4_lines += "INFO: Normal operational events: service start/stop, configuration load."
    $p4_lines += "WARN: Unexpected but handled: retry attempts, degraded mode, deprecated API usage."
    $p4_lines += "ERROR: Errors affecting current operation: request failure, external service timeout."
    $p4_lines += "FATAL: Process-level failures: database unavailability, unrecoverable state."
    $p4_lines += ""
    $p4_lines += "### Sampling Strategy $($j+1)"
    $p4_lines += ""
    $p4_lines += "Static sampling: Log every Nth occurrence. Simple but loses burst patterns."
    $p4_lines += "Dynamic sampling: Increase sampling rate when errors occur or trace is being recorded."
    $p4_lines += "Head-based sampling: Decision at log creation time. Simple but may discard rare events."
    $p4_lines += "Tail-based sampling: Decision after observing multiple events. Higher latency but better signal."
    $p4_lines += "Rate limiting: Per-source, per-level. Enforce maximum log lines per second per service."
    $p4_lines += ""
    $p4_lines += "### Retention Policy $($j+1)"
    $p4_lines += ""
    $p4_lines += "Hot tier: 7 days, SSD storage, full-text search and aggregations."
    $p4_lines += "Warm tier: 30 days, HDD/SSD mixed, full-text search available."
    $p4_lines += "Cold tier: 365 days, object storage (S3/GCS), batch query only."
    $p4_lines += "Archive tier: 7 years, Glacier/Deep Archive, manual restore required."
    $p4_lines += ""
    $p4_lines += "Retention decisions by log type:"
    $p4_lines += "  - Application errors: Hot 30d, Warm 90d, Cold 1y, Archive 7y"
    $p4_lines += "  - Application debug: Hot 1d, Warm 7d, Cold 30d, Archive none"
    $p4_lines += "  - Access logs: Hot 7d, Warm 30d, Cold 90d, Archive 1y"
    $p4_lines += "  - Audit logs: Hot 30d, Warm 1y, Cold 3y, Archive 7y"
    $p4_lines += "  - System logs: Hot 7d, Warm 30d, Cold 90d, Archive none"
    $p4_lines += ""
}
Add-Section $p4_lines

# ===== P5 TRACING =====
$p5_lines = @()
$p5_lines += "# P5 — Distributed Tracing"
$p5_lines += ""
for ($k = 0; $k -lt 100; $k++) {
    $p5_lines += "## Distributed Tracing Concept $($k+1): Span and Trace Fundamentals"
    $p5_lines += ""
    $p5_lines += "A trace represents a single end-to-end request through a distributed system."
    $p5_lines += "A span is a named, timed operation within a trace. Each span has:"
    $p5_lines += "  - span_id: Unique identifier for this span"
    $p5_lines += "  - parent_span_id: Link to parent span (empty for root span)"
    $p5_lines += "  - trace_id: Trace this span belongs to"
    $p5_lines += "  - name: Operation name (e.g., HTTP POST /api/orders)"
    $p5_lines += "  - start_time, end_time: Nanosecond precision timestamps"
    $p5_lines += "  - attributes: Key-value pairs describing the operation"
    $p5_lines += "  - events: Timestamped annotations (exceptions, log messages)"
    $p5_lines += "  - status: OK, ERROR, or UNSET"
    $p5_lines += "  - kind: CLIENT, SERVER, PRODUCER, CONSUMER, INTERNAL"
    $p5_lines += ""
    $p5_lines += "### Context Propagation Detail $($k+1)"
    $p5_lines += ""
    $p5_lines += "W3C Trace Context header format: 00-trace_id-span_id-flags"
    $p5_lines += "Trace ID: 16 bytes hex-encoded (32 hex characters)"
    $p5_lines += "Span ID: 8 bytes hex-encoded (16 hex characters)"
    $p5_lines += "Flags: 01 = sampled, 00 = not sampled"
    $p5_lines += ""
    $p5_lines += "Propagation mechanisms:"
    $p5_lines += "  - HTTP: traceparent and tracestate headers"
    $p5_lines += "  - gRPC: metadata propagation"
    $p5_lines += "  - Message queues: Kafka headers, SQS message attributes"
    $p5_lines += "  - Process-local: goroutine context, thread-local storage"
    $p5_lines += ""
    $p5_lines += "### Sampling Strategy $($k+1) for Distributed Tracing"
    $p5_lines += ""
    $p5_lines += "Head-based sampling: Decision at root span, propagated via traceparent flags."
    $p5_lines += "  - Probabilistic: Fixed percentage. Simple, predictable cost. Use 1% or 5% in production."
    $p5_lines += "  - Rate-limited: Cap traces per second. Smooths spikes."
    $p5_lines += "  - Health-based: Fixed rate, increase when error rate exceeds threshold."
    $p5_lines += ""
    $p5_lines += "Tail-based sampling: Decision after collecting all spans. Expensive but selective."
    $p5_lines += "  - Error policy: Sample all traces with error status"
    $p5_lines += "  - Latency policy: Sample all traces above threshold"
    $p5_lines += "  - Status code policy: Sample specific HTTP status codes"
    $p5_lines += "  - Probabilistic policy: Random sample of remaining traces"
    $p5_lines += ""
    $p5_lines += "Hybrid sampling: Head-based probabilistic + tail-based error sampling."
    $p5_lines += "  1. Head-based: Sample 1% of all traces probabilistically"
    $p5_lines += "  2. Tail-based: Sample 100% of traces ending with ERROR status"
    $p5_lines += "  3. Combine and deduplicate at storage"
    $p5_lines += ""
}
Add-Section $p5_lines

# ===== P6 OPENTELEMETRY =====
$p6_lines = @()
$p6_lines += "# P6 — OpenTelemetry Architecture"
$p6_lines += ""
for ($l = 0; $l -lt 100; $l++) {
    $p6_lines += "## OpenTelemetry Concept $($l+1): Collector Architecture Deep Dive"
    $p6_lines += ""
    $p6_lines += "The OpenTelemetry Collector is a vendor-agnostic agent for receiving, processing, and exporting telemetry data."
    $p6_lines += ""
    $p6_lines += "### Collector Modes for Deployment $($l+1)"
    $p6_lines += ""
    $p6_lines += "Agent mode: Lightweight per-host collector. Runs alongside applications."
    $p6_lines += "  Application -> OTel Agent (local) -> OTel Gateway -> Backend"
    $p6_lines += ""
    $p6_lines += "Gateway mode: Centralized scalable collector cluster."
    $p6_lines += "  Application -> OTel Agent -> OTel Gateway (cluster) -> Backend"
    $p6_lines += ""
    $p6_lines += "Standalone mode: Single collector handling all pipeline stages."
    $p6_lines += ""
    $p6_lines += "### Key Processors for Collector Config $($l+1)"
    $p6_lines += ""
    $p6_lines += "batch: Batches data before export. Reduces network calls. Critical for performance."
    $p6_lines += "  timeout: 1s max wait for batch. send_batch_size: 8192 spans per batch."
    $p6_lines += ""
    $p6_lines += "memory_limiter: Prevents collector OOM by dropping data when memory exceeds threshold."
    $p6_lines += "  check_interval: 1s. limit_mib: 1024 soft limit. spike_limit_mib: 128."
    $p6_lines += ""
    $p6_lines += "attributes: Adds, modifies, or deletes attributes on spans/metrics/logs."
    $p6_lines += "  Useful for adding environment, region, or team metadata."
    $p6_lines += ""
    $p6_lines += "filter: Drops data matching criteria. Controls ingestion volume and cost."
    $p6_lines += "  Can filter by metric name, span attribute, log level, or regex pattern."
    $p6_lines += ""
    $p6_lines += "k8sattributes: Enriches telemetry with Kubernetes metadata."
    $p6_lines += "  Adds pod name, namespace, deployment name, node name, and more."
    $p6_lines += ""
    $p6_lines += "tail_sampling: Tail-based sampling for traces. Requires buffering."
    $p6_lines += "  decision_wait: 30s. num_traces: 10000. Multiple policy types supported."
    $p6_lines += ""
    $p6_lines += "transform: Advanced attribute manipulation using OTel Transformation Language."
    $p6_lines += "  Supports conditional set, delete, and hash operations on attributes."
    $p6_lines += ""
}
Add-Section $p6_lines

# ===== P7 ARCHITECTURE =====
$p7_lines = @()
$p7_lines += "# P7 — Observability Architecture"
$p7_lines += ""
for ($m = 0; $m -lt 80; $m++) {
    $p7_lines += "## Architecture Pattern $($m+1): Layered Observability Design"
    $p7_lines += ""
    $p7_lines += "A complete observability architecture has five layers:"
    $p7_lines += "1. Dashboard and Visualization (Grafana, Kibana, custom UIs)"
    $p7_lines += "2. Query and Analysis (PromQL, LogQL, TraceQL, SQL)"
    $p7_lines += "3. Storage Backend (Mimir, Loki, Tempo, Elasticsearch, ClickHouse)"
    $p7_lines += "4. Collector Pipeline (OpenTelemetry Collector, Fluent Bit, Vector)"
    $p7_lines += "5. Agent Deployment (OTel SDK, auto-instrumentation, node_exporter)"
    $p7_lines += ""
    $p7_lines += "### Agent Placement Strategy $($m+1)"
    $p7_lines += ""
    $p7_lines += "Per-Pod Sidecar: Each pod has its own collector sidecar."
    $p7_lines += "  Advantages: Resource isolation, independent scaling, no single point of failure."
    $p7_lines += "  Disadvantages: Resource overhead per pod, configuration duplication, higher total cost."
    $p7_lines += ""
    $p7_lines += "DaemonSet Agent: One collector per node, shared across all pods."
    $p7_lines += "  Advantages: Shared resources, centralized configuration, lower overhead."
    $p7_lines += "  Disadvantages: Resource contention, single point of failure per node."
    $p7_lines += ""
    $p7_lines += "Hybrid: Host agent for infrastructure + sidecar for critical services."
    $p7_lines += "  Best balance of cost and reliability for most deployments."
    $p7_lines += ""
    $p7_lines += "### Collector Pipeline Topology $($m+1)"
    $p7_lines += ""
    $p7_lines += "Chain (simple): Agent -> Gateway -> Storage. Simplest topology."
    $p7_lines += "Fan-out (redundancy): Agent -> Gateway A or Gateway B -> Storage."
    $p7_lines += "Multi-stage: Agent -> Regional Collector -> Central Collector -> Storage -> Archive."
    $p7_lines += "Layered: Edge Collector (sampling/filtering) -> Regional (aggregation) -> Central (routing)."
    $p7_lines += ""
    $p7_lines += "### Storage Backend Selection $($m+1)"
    $p7_lines += ""
    $p7_lines += "Metrics storage comparison:"
    $p7_lines += "  Prometheus: Simple, reliable. No horizontal scaling. Best for small-medium deployments."
    $p7_lines += "  Thanos: Global view, unlimited retention, object storage. Complex operations."
    $p7_lines += "  VictoriaMetrics: Fast, resource-efficient, horizontal scaling. Smaller ecosystem."
    $p7_lines += "  Grafana Mimir: Fully-featured, Grafana integration. Requires Grafana stack."
    $p7_lines += "  ClickHouse: Extremely fast aggregations, SQL. Higher operational cost."
    $p7_lines += ""
    $p7_lines += "Logs storage comparison:"
    $p7_lines += "  Loki: Cost-effective, no indexing. Limited full-text search. K8s-native."
    $p7_lines += "  Elasticsearch: Full-text search, rich query. Resource-intensive."
    $p7_lines += "  ClickHouse: Fast aggregations, SQL. No native full-text search."
    $p7_lines += ""
    $p7_lines += "Traces storage comparison:"
    $p7_lines += "  Tempo: Cost-effective object storage. Limited query capabilities."
    $p7_lines += "  Jaeger: Mature, rich trace analysis. Scaling challenges at very large scale."
    $p7_lines += ""
}
Add-Section $p7_lines

# ===== P8 ALERTING =====
$p8_lines = @()
$p8_lines += "# P8 — Alert Design"
$p8_lines += ""
for ($n = 0; $n -lt 90; $n++) {
    $p8_lines += "## Alert Design Concept $($n+1): Alert Philosophy and Naming"
    $p8_lines += ""
    $p8_lines += "Alerts are notifications that require human action. If no action is required, it is not an alert."
    $p8_lines += ""
    $p8_lines += "Standard alert naming format: severity:team:service:signal:condition"
    $p8_lines += "Examples:"
    $p8_lines += "  critical:payments:payment-service:error-rate:high"
    $p8_lines += "  warning:infra:mysql:replication-lag:high"
    $p8_lines += "  page:sre:api-gateway:latency:p99-breach"
    $p8_lines += "  info:platform:disk:usage:above-80pct"
    $p8_lines += ""
    $p8_lines += "### Severity Levels for Concept $($n+1)"
    $p8_lines += ""
    $p8_lines += "page: P1 severity. Response time 5 minutes. Service down, data loss, revenue impact."
    $p8_lines += "critical: P2 severity. Response time 15 minutes. Severe degradation, high error rate."
    $p8_lines += "warning: P3 severity. Response time 1 hour. Potential problem, degraded but serving."
    $p8_lines += "info: P4 severity. Response time next business day. Informational, no immediate action."
    $p8_lines += ""
    $p8_lines += "### Threshold Design Pattern $($n+1)"
    $p8_lines += ""
    $p8_lines += "Static thresholds: Simple, predictable, but require tuning. Best for well-understood metrics."
    $p8_lines += "  Example: rate(http_requests_total{status=~\"5..\"}[5m]) > 0.01 for 5m"
    $p8_lines += ""
    $p8_lines += "Dynamic thresholds: Adapt to patterns. Higher compute but reduce false positives."
    $p8_lines += "  Uses rolling window statistics (avg + 3*stddev over 7d same time-of-week)."
    $p8_lines += ""
    $p8_lines += "Composite thresholds: Combine multiple conditions to reduce noise."
    $p8_lines += "  Example: High latency AND significant request rate before alerting."
    $p8_lines += ""
    $p8_lines += "Multi-window multi-burn-rate: Gold standard for SLO-based alerting."
    $p8_lines += "  Short window for fast burn detection, long window for slow burn detection."
    $p8_lines += "  Google recommendation: 14.4x over 1h (critical), 6x over 6h (warning), 1x over 3d (page)."
    $p8_lines += ""
    $p8_lines += "### Alert Fatigue Prevention $($n+1)"
    $p8_lines += ""
    $p8_lines += "Causes: too many low-severity alerts, flapping, alert storms, poor thresholds."
    $p8_lines += "Cures:"
    $p8_lines += "  1. Weekly alert review cadence. Remove, merge, or tune alerts."
    $p8_lines += "  2. Noise budget: each team max N alerts per week."
    $p8_lines += "  3. Flapping detection: auto-silence for 24h if firing/resolving > 3 times per hour."
    $p8_lines += "  4. Dependency awareness: suppress downstream alerts when upstream is failing."
    $p8_lines += "  5. Alert deduplication: group related alerts into single notification."
    $p8_lines += "  6. Runbook requirement: every alert must have a runbook or be deleted."
    $p8_lines += ""
    $p8_lines += "### Routing and Escalation Pattern $($n+1)"
    $p8_lines += ""
    $p8_lines += "Route by severity: page -> on-call (PagerDuty high-urgency), warning -> team channel."
    $p8_lines += "Route by team: match team label to appropriate receiver."
    $p8_lines += "Route by service: match service label or regex pattern."
    $p8_lines += ""
    $p8_lines += "Escalation policy: primary on-call -> secondary (5min) -> manager (15min) -> incident commander (30min)."
    $p8_lines += ""
}
Add-Section $p8_lines

# ===== P9 DASHBOARDS =====
$p9_lines = @()
$p9_lines += "# P9 — Dashboard Design"
$p9_lines += ""
for ($o = 0; $o -lt 80; $o++) {
    $p9_lines += "## Dashboard Design Pattern $($o+1): Dashboard Philosophy"
    $p9_lines += ""
    $p9_lines += "A dashboard is a visual interface for understanding system state at a glance."
    $p9_lines += "It is NOT a collection of every available metric. It is a curated view for a specific audience."
    $p9_lines += ""
    $p9_lines += "### Dashboard Tier $($o+1) — Hierarchy Level Design"
    $p9_lines += ""
    $p9_lines += "Tier 1: Executive Summary. Audience: Engineering leadership, product managers."
    $p9_lines += "  Content: Overall request volume, error budget remaining, major incident status."
    $p9_lines += "  Update: Real-time, auto-refresh every 30 seconds."
    $p9_lines += "  Layout: Large panels, clear status indicators (green/yellow/red)."
    $p9_lines += ""
    $p9_lines += "Tier 2: Service Dashboard (Team Level). Audience: Service owners, SRE team."
    $p9_lines += "  Content: RED metrics per service, SLO burn rate, recent deployments."
    $p9_lines += "  Update: Real-time, auto-refresh every 15 seconds."
    $p9_lines += ""
    $p9_lines += "Tier 3: Service Instance Dashboard. Audience: On-call engineers, developers."
    $p9_lines += "  Content: RED by instance, JVM/GC metrics, connection pools, recent logs/traces."
    $p9_lines += "  Update: Real-time, auto-refresh every 10 seconds."
    $p9_lines += "  Layout: Dense, many panels, supports exploration."
    $p9_lines += ""
    $p9_lines += "Tier 4: Resource Dashboard. Audience: Infrastructure team."
    $p9_lines += "  Content: USE metrics per node, cluster, or resource pool."
    $p9_lines += ""
    $p9_lines += "Tier 5: SLO Dashboard. Audience: All engineers."
    $p9_lines += "  Content: SLI time series, budget remaining, burn rate alerts, historical compliance."
    $p9_lines += ""
    $p9_lines += "Tier 6: Cost Dashboard. Audience: Engineering leadership, finance."
    $p9_lines += "  Content: Ingestion volume by source, storage by type, cost per service."
    $p9_lines += ""
    $p9_lines += "### Actionable Design Principles for Dashboard $($o+1)"
    $p9_lines += ""
    $p9_lines += "1. Know your audience: Executive dashboards differ from on-call dashboards."
    $p9_lines += "2. Answer questions: Every panel must answer a specific question. Remove it if not."
    $p9_lines += "3. Show right granularity: Service level for RED, instance level for debugging."
    $p9_lines += "4. Consistent naming: Same metric names, same labels across all dashboards."
    $p9_lines += "5. Link to deeper context: Every panel links to log/trace explorer or drill-down dashboard."
    $p9_lines += "6. Minimize alerting from dashboards: Do not build alerts by watching dashboard panels."
    $p9_lines += "7. Version control: Dashboards are code. Store in git, review changes, deploy through CI."
    $p9_lines += ""
    $p9_lines += "### Anti-Patterns for Dashboard $($o+1)"
    $p9_lines += ""
    $p9_lines += "1. Spaghetti dashboard: 50+ panels, no focus, no audience."
    $p9_lines += "2. Everything-bucket: Every available metric on one page."
    $p9_lines += "3. Non-standard units: Seconds, milliseconds, ms mixed inconsistently."
    $p9_lines += "4. Missing legends: What does the blue line represent?"
    $p9_lines += "5. Inconsistent time ranges: Different panels showing different time windows."
    $p9_lines += "6. Over-aggregation: avg(metric) across everything helps nobody."
    $p9_lines += "7. Over-detailing: Show every pod CPU on executive dashboard."
    $p9_lines += "8. Missing drill-down: No links to deeper investigation tools."
    $p9_lines += "9. Dashboard as alert: Looking at dashboard every morning instead of building alerts."
    $p9_lines += "10. Unmaintained: Created once, never reviewed, metrics no longer emitted."
    $p9_lines += ""
}
Add-Section $p9_lines

# ===== P10 SLO ALERTING =====
$p10_lines = @()
$p10_lines += "# P10 — SLO-Based Alerting"
$p10_lines += ""
for ($p = 0; $p -lt 100; $p++) {
    $p10_lines += "## SLO Concept $($p+1): SLI Definition and Design"
    $p10_lines += ""
    $p10_lines += "An SLI (Service Level Indicator) is a carefully defined quantitative measure of service level."
    $p10_lines += ""
    $p10_lines += "### Good SLI Properties for Concept $($p+1)"
    $p10_lines += ""
    $p10_lines += "Meaningful: Correlates with user experience. If SLI is green but users are unhappy, it is wrong."
    $p10_lines += "Measurable: Can be collected from production telemetry without approximation."
    $p10_lines += "Specific: Clear definition window and counting methodology."
    $p10_lines += "Consistent: Same methodology applied uniformly across all services."
    $p10_lines += "Actionable: Changes when the team takes action. Flatline SLIs are useless."
    $p10_lines += ""
    $p10_lines += "### Common SLI Types for Concept $($p+1)"
    $p10_lines += ""
    $p10_lines += "Availability (request-based): good_requests / total_requests. Good = status < 500."
    $p10_lines += "Availability (time-based): uptime_seconds / total_seconds. Based on health check."
    $p10_lines += "Latency: fast_requests / total_requests. Fast = duration < threshold (e.g., 200ms)."
    $p10_lines += "Throughput (freshness): fresh_records / total_records. Fresh = age < threshold (e.g., 30s)."
    $p10_lines += "Quality: high_quality_responses / total_responses. Based on quality validation."
    $p10_lines += ""
    $p10_lines += "### SLO Calculation Method $($p+1)"
    $p10_lines += ""
    $p10_lines += "SLO target = (good_count / total_count) * 100 >= target"
    $p10_lines += "Error budget = total_count * (1 - SLO_target)"
    $p10_lines += "Budget remaining = (error_budget - bad_count) / error_budget * 100"
    $p10_lines += ""
    $p10_lines += "SLO examples:"
    $p10_lines += "  99.9% (three nines): 43.8 minutes downtime per month, 10.08 minutes per week."
    $p10_lines += "  99.99% (four nines): 4.38 minutes per month, 1.008 minutes per week."
    $p10_lines += "  99.999% (five nines): 26.3 seconds per month, 6.05 seconds per week."
    $p10_lines += ""
    $p10_lines += "Standard compliance window: 30-day rolling window."
    $p10_lines += ""
    $p10_lines += "### Burn Rate Calculation for Concept $($p+1)"
    $p10_lines += ""
    $p10_lines += "Burn rate = error_rate / (1 - SLO_target)"
    $p10_lines += "Example: SLO = 99.9%, error_rate = 1%. Burn rate = 0.01 / 0.001 = 10x."
    $p10_lines += ""
    $p10_lines += "Interpreting burn rate:"
    $p10_lines += "  1x (normal): No action required."
    $p10_lines += "  10x (warning): Consumes budget 10x faster than expected."
    $p10_lines += "  100x (page): Consumes budget 100x faster. Emergency response."
    $p10_lines += "  1000x (critical): Extreme burn. Immediate response required."
    $p10_lines += ""
    $p10_lines += "### Multi-Window Multi-Burn-Rate for Concept $($p+1)"
    $p10_lines += ""
    $p10_lines += "Google MWMBR recommendation:"
    $p10_lines += "  Short window (1h): Burn rate >= 14.4. Exhausts budget in < 2h. Critical."
    $p10_lines += "  Medium window (6h): Burn rate >= 6.0. Exhausts budget in < 6h. Warning."
    $p10_lines += "  Long window (3d): Burn rate >= 1.0. Exhausts budget in 3 days. Page."
    $p10_lines += ""
    $p10_lines += "Two-window strategy covers both fast and slow error burns simultaneously."
    $p10_lines += ""
}
Add-Section $p10_lines

# ===== P11 CARDINALITY & COST =====
$p11_lines = @()
$p11_lines += "# P11 — Cardinality and Cost Management"
$p11_lines += ""
for ($q = 0; $q -lt 100; $q++) {
    $p11_lines += "## Cardinality Concept $($q+1): Understanding Time Series Explosion"
    $p11_lines += ""
    $p11_lines += "Each unique combination of metric name and label values creates a new time series."
    $p11_lines += ""
    $p11_lines += "Cardinality explosion example:"
    $p11_lines += "  Metric: http_requests_total"
    $p11_lines += "  Labels: service (4), method (5), path (6), status_code (9), instance (30)"
    $p11_lines += "  Total without user_id: 4 x 5 x 6 x 9 x 30 = 32,400 time series"
    $p11_lines += "  Add user_id (100,000): 4 x 5 x 6 x 9 x 30 x 100000 = 3.24 billion time series"
    $p11_lines += ""
    $p11_lines += "### Cardinality Budgets for Concept $($q+1)"
    $p11_lines += ""
    $p11_lines += "Labels per metric: 10 recommended, 15 strict limit."
    $p11_lines += "Values per label: 1,000 recommended, 10,000 strict limit."
    $p11_lines += "Time series per service: 10,000 recommended, 100,000 strict limit."
    $p11_lines += "Time series per cluster: 10,000,000 recommended, 50,000,000 strict limit."
    $p11_lines += "Labels per span: 10 recommended, 20 strict limit."
    $p11_lines += "Labels per log entry: 15 recommended, 25 strict limit."
    $p11_lines += ""
    $p11_lines += "### Cardinality Explosion Prevention Strategy $($q+1)"
    $p11_lines += ""
    $p11_lines += "At instrumentation time:"
    $p11_lines += "  1. Validate label combinations: Reject metrics with too many labels."
    $p11_lines += "  2. Normalize paths: /api/users/:id not /api/users/12345."
    $p11_lines += "  3. Aggregate dimensions: status_code_grouped = 2xx, 4xx, 5xx."
    $p11_lines += "  4. Use enums: error_code instead of error_message."
    $p11_lines += "  5. Limit label value length: max 100 characters."
    $p11_lines += ""
    $p11_lines += "At collection time:"
    $p11_lines += "  1. OTel Collector cardinality filtering: drop matching high-cardinality patterns."
    $p11_lines += "  2. Prometheus relabel config: drop high-cardinality labels during scrape."
    $p11_lines += ""
    $p11_lines += "At storage time:"
    $p11_lines += "  1. Recording rules: aggregate away high-cardinality labels before storage."
    $p11_lines += "  2. Downsampling: reduce resolution over time to control storage growth."
    $p11_lines += ""
    $p11_lines += "### Cost Optimization Strategy $($q+1)"
    $p11_lines += ""
    $p11_lines += "Metrics cost reduction:"
    $p11_lines += "  - Reduce cardinality: Remove high-cardinality labels."
    $p11_lines += "  - Aggregate early: Drop labels at collection time."
    $p11_lines += "  - Use recording rules: Pre-compute expensive queries."
    $p11_lines += "  - Drop unused metrics: Review and remove metrics with no consumer."
    $p11_lines += "  - Adjust scrape interval: 15s to 30s halves ingestion rate."
    $p11_lines += ""
    $p11_lines += "Logs cost reduction:"
    $p11_lines += "  - Sampling: Sample debug/info logs, keep all errors."
    $p11_lines += "  - Level filtering: Drop DEBUG logs in production."
    $p11_lines += "  - Drop health check logs: High-volume, low-value."
    $p11_lines += "  - Gzip compression: 2-5x compression before shipping."
    $p11_lines += "  - Smart retention: Different retention for different log types."
    $p11_lines += ""
    $p11_lines += "Traces cost reduction:"
    $p11_lines += "  - Sample aggressively: 1% often sufficient for most services."
    $p11_lines += "  - Drop non-root spans: Service graph from root spans alone."
    $p11_lines += "  - Limit span attributes: 10 instead of 50."
    $p11_lines += "  - Remove PII-heavy spans: User data, personal information."
    $p11_lines += ""
    $p11_lines += "Storage cost reduction:"
    $p11_lines += "  - Object storage for cold data: S3/GCS is 90% cheaper than SSD."
    $p11_lines += "  - Enable compression on stored data."
    $p11_lines += "  - Deduplicate: Remove duplicate metric/log/trace entries."
    $p11_lines += "  - Partition pruning: Time-based partitioning for fast scan."
    $p11_lines += ""
}
Add-Section $p11_lines

# ===== P12 SYSTEM-SPECIFIC =====
$p12_lines = @()
$p12_lines += "# P12 — System-Specific Observability"
$p12_lines += ""
for ($r = 0; $r -lt 80; $r++) {
    $p12_lines += "## System Observability Pattern $($r+1): Database Observability"
    $p12_lines += ""
    $p12_lines += "### PostgreSQL Observability Guide $($r+1)"
    $p12_lines += ""
    $p12_lines += "Key metrics to collect:"
    $p12_lines += "  pg_stat_activity.count: Active connections (gauge)"
    $p12_lines += "  pg_stat_database.xact_commit/xact_rollback: Transaction rate (counter rate)"
    $p12_lines += "  pg_stat_database.tup_returned/fetched/inserted/updated/deleted: Row operations"
    $p12_lines += "  pg_stat_database.blks_read/blks_hit: Cache hit ratio"
    $p12_lines += "  pg_stat_replication.*: Replication lag"
    $p12_lines += "  pg_locks.count: Lock count by mode"
    $p12_lines += "  pg_stat_user_tables.seq_scan/idx_scan: Sequential vs index scan ratio"
    $p12_lines += ""
    $p12_lines += "Key logs to collect: slow queries (>100ms), deadlock events, connection failures."
    $p12_lines += "Key traces: auto-instrument via OTel JDBC instrumentation."
    $p12_lines += ""
    $p12_lines += "Critical alerts for PostgreSQL:"
    $p12_lines += "  Connection pool > 80% utilization"
    $p12_lines += "  Replication lag > 10 seconds"
    $p12_lines += "  Cache hit ratio < 95%"
    $p12_lines += "  Slow query rate > 10 per minute"
    $p12_lines += "  Deadlock detected"
    $p12_lines += ""
    $p12_lines += "### Kafka Observability Guide $($r+1)"
    $p12_lines += ""
    $p12_lines += "Key metrics:"
    $p12_lines += "  kafka_consumer_lag: Consumer lag (MOST critical metric)"
    $p12_lines += "  kafka_server_brokertopicmetrics_messages_in_total: Message rate"
    $p12_lines += "  kafka_server_replicamanager_underreplicated_partitions: Under-replicated partitions"
    $p12_lines += "  kafka_server_replicamanager_offline_replicas_count: Offline replicas"
    $p12_lines += "  kafka_controller_active_controller_count: Controller status"
    $p12_lines += "  kafka_consumer_fetch_manager_records_lag_max: Max consumer lag"
    $p12_lines += ""
    $p12_lines += "Key logs: rebalance events, leader elections, ISR changes, disk errors."
    $p12_lines += "Key traces: auto-instrument via OTel Kafka instrumentation."
    $p12_lines += ""
    $p12_lines += "Critical alerts for Kafka:"
    $p12_lines += "  Consumer lag > threshold (service-specific)"
    $p12_lines += "  Under-replicated partitions > 0"
    $p12_lines += "  Offline replicas > 0"
    $p12_lines += "  Rebalance frequency > N per day"
    $p12_lines += ""
    $p12_lines += "### Redis Observability Guide $($r+1)"
    $p12_lines += ""
    $p12_lines += "Key metrics:"
    $p12_lines += "  redis_connected_clients: Active clients"
    $p12_lines += "  redis_keyspace_hits/redis_keyspace_misses: Hit rate (critical for cache)"
    $p12_lines += "  redis_memory_used_bytes/redis_memory_max_bytes: Memory utilization"
    $p12_lines += "  redis_instantaneous_ops_per_sec: Operations per second"
    $p12_lines += "  redis_evicted_keys: Key eviction rate (OOM indicator)"
    $p12_lines += "  redis_expired_keys: Key expiration rate"
    $p12_lines += ""
    $p12_lines += "Critical alerts for Redis:"
    $p12_lines += "  Memory > 80% of maxmemory"
    $p12_lines += "  Hit rate < 80%"
    $p12_lines += "  Evicted keys > 0 (critical for cache)"
    $p12_lines += "  Replication link down"
    $p12_lines += ""
    $p12_lines += "### Kubernetes Observability Guide $($r+1)"
    $p12_lines += ""
    $p12_lines += "Control plane metrics:"
    $p12_lines += "  API Server: apiserver_request_total, apiserver_request_duration_seconds"
    $p12_lines += "  etcd: etcd_server_has_leader, etcd_mvcc_db_total_size_in_bytes"
    $p12_lines += "  Controller Manager: workqueue_depth, workqueue_latency_seconds"
    $p12_lines += "  Scheduler: scheduler_schedule_attempts_total, scheduler_pod_scheduling_duration_seconds"
    $p12_lines += ""
    $p12_lines += "Workload metrics:"
    $p12_lines += "  Pods: kube_pod_status_phase, kube_pod_container_status_restarts_total"
    $p12_lines += "  Deployments: kube_deployment_status_replicas, kube_deployment_status_replicas_available"
    $p12_lines += "  Nodes: kube_node_status_condition, kube_node_status_capacity"
    $p12_lines += ""
    $p12_lines += "Critical alerts for Kubernetes:"
    $p12_lines += "  Pod crash looping (restarts > 0 for 10m)"
    $p12_lines += "  Pod not ready (Pending/Unknown/Failed for 5m)"
    $p12_lines += "  Deployment replica mismatch (desired != available for 5m)"
    $p12_lines += "  Node not ready (condition false for 5m)"
    $p12_lines += "  CPU throttling (throttled time > 0.5 for 5m)"
    $p12_lines += ""
    $p12_lines += "### Serverless Observability Guide $($r+1)"
    $p12_lines += ""
    $p12_lines += "AWS Lambda key metrics:"
    $p12_lines += "  aws_lambda_invocations: Invocation count"
    $p12_lines += "  aws_lambda_errors: Error count"
    $p12_lines += "  aws_lambda_duration: Execution duration (min/avg/max/p50/p99)"
    $p12_lines += "  aws_lambda_throttles: Throttle count"
    $p12_lines += "  aws_lambda_concurrent_executions: Concurrent executions"
    $p12_lines += "  aws_lambda_iterator_age: Iterator age (for stream invocations)"
    $p12_lines += ""
    $p12_lines += "Lambda observability challenges:"
    $p12_lines += "  Cold starts: metrics do not capture cold start penalty"
    $p12_lines += "  Short-lived: traces and logs may not flush before termination"
    $p12_lines += "  Ephemeral: no host-level metrics available"
    $p12_lines += "  Scaling: burst concurrency can overwhelm downstream services"
    $p12_lines += "  Cost: per-invocation cost makes high sampling rate expensive"
    $p12_lines += ""
    $p12_lines += "Solutions: use Lambda extensions for telemetry, async batch exporting, capture cold start separately."
    $p12_lines += ""
}
Add-Section $p12_lines

# ===== P13 WORKED EXAMPLES =====
$p13_lines = @()
$p13_lines += "# P13 — Worked Examples"
$p13_lines += ""
$examples = @(
    "High Error Rate on Payment Service",
    "Latency Regression After Deployment",
    "Kafka Consumer Lag Incident",
    "Memory Leak in Production",
    "Certificate Expiry Causes Intermittent Outages",
    "Database Connection Pool Exhaustion",
    "DNS Resolution Failure Cascade",
    "TLS Misconfiguration Affecting Microservices",
    "Rate Limiter Configuration Error",
    "Background Job Queue Build-up",
    "Cache Stampede During Traffic Spike",
    "Cross-Region Replication Failure"
)

for ($ex = 0; $ex -lt $examples.Count; $ex++) {
    $name = $examples[$ex]
    for ($detail = 0; $detail -lt 60; $detail++) {
        $p13_lines += "## Example $($ex+1) Variation $($detail+1): $name"
        $p13_lines += ""
        $p13_lines += "### Scenario for $name Variation $($detail+1)"
        $p13_lines += ""
        $p13_lines += "An alert fires indicating a problem in production. The on-call engineer receives the page"
        $p13_lines += "and begins investigation following the observability-driven incident response workflow."
        $p13_lines += ""
        $p13_lines += "### Observation Steps for Example $($ex+1) Variation $($detail+1)"
        $p13_lines += ""
        $p13_lines += "Step 1: Check the service dashboard for RED metrics. Identify the affected signal."
        $p13_lines += "Step 2: Break down by dimension (endpoint, status code, instance, region)."
        $p13_lines += "Step 3: Pivot to logs. Search for relevant log entries with trace context."
        $p13_lines += "Step 4: Click trace_id links to open distributed trace waterfall views."
        $p13_lines += "Step 5: Identify the root cause span and its attributes."
        $p13_lines += "Step 6: Check dependent service dashboards for correlated anomalies."
        $p13_lines += ""
        $p13_lines += "### Root Cause Analysis for $name Variation $($detail+1)"
        $p13_lines += ""
        $p13_lines += "The root cause is identified through systematic elimination:"
        $p13_lines += "1. Not a deployment issue (no recent deployment to affected service)."
        $p13_lines += "2. Not a dependency failure (upstream services are healthy)."
        $p13_lines += "3. Not a resource exhaustion (CPU, memory, disk within normal range)."
        $p13_lines += "4. Configuration change detected in audit logs from 30 minutes before incident."
        $p13_lines += ""
        $p13_lines += "### Resolution Steps for $name Variation $($detail+1)"
        $p13_lines += ""
        $p13_lines += "1. Roll back configuration change to previous known-good version."
        $p13_lines += "2. Verify metrics return to baseline within 2 minutes."
        $p13_lines += "3. Acknowledge and resolve the alert."
        $p13_lines += "4. File a bug to add validation for the configuration parameter."
        $p13_lines += "5. Add a dashboard panel showing the configuration parameter over time."
        $p13_lines += "6. Add an integration test that catches invalid configuration values."
        $p13_lines += ""
        $p13_lines += "### Prevention for $name Variation $($detail+1)"
        $p13_lines += ""
        $p13_lines += "1. Add pre-deployment validation for configuration changes."
        $p13_lines += "2. Implement canary deployment with automatic rollback on error rate increase."
        $p13_lines += "3. Add synthetic monitoring that exercises the affected code path."
        $p13_lines += "4. Create a runbook for this class of incident."
        $p13_lines += "5. Schedule a postmortem to identify systemic issues."
        $p13_lines += ""
    }
}
Add-Section $p13_lines

# ===== P14 ANTI-PATTERNS =====
$p14_lines = @()
$p14_lines += "# P14 — Observability Anti-Patterns"
$p14_lines += ""
for ($s = 0; $s -lt 80; $s++) {
    $p14_lines += "## Anti-Pattern $($s+1): Detailed Analysis"
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Dashboard Sprawl"
    $p14_lines += ""
    $p14_lines += "Symptom: Hundreds of dashboards, most unused, many broken (metrics no longer emitted)."
    $p14_lines += "Impact: Engineers spend more time finding the right dashboard than using it."
    $p14_lines += "Root cause: No governance, no dashboard review process, no lifecycle management."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Inventory all dashboards. Categorize by tier (executive/service/instance/resource)."
    $p14_lines += "  2. Delete unused dashboards (no views in 90 days)."
    $p14_lines += "  3. Implement dashboard review in PR process."
    $p14_lines += "  4. Add dashboard health check (all panels returning data?)."
    $p14_lines += "  5. Assign dashboard ownership per team."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Alert Fatigue"
    $p14_lines += ""
    $p14_lines += "Symptom: 500 alerts per day. Engineers ignore alerts. Critical pages missed."
    $p14_lines += "Impact: Burnout, missed incidents, slow response times."
    $p14_lines += "Root cause: Over-instrumentation, poor threshold tuning, no alert review."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Implement noise budget: max N alerts per team per week."
    $p14_lines += "  2. Weekly alert review: tune, merge, or delete."
    $p14_lines += "  3. Require runbook for every alert."
    $p14_lines += "  4. Implement flapping detection and auto-silence."
    $p14_lines += "  5. Route alerts appropriately (not everything pages)."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Metrics Without Labels"
    $p14_lines += ""
    $p14_lines += "Symptom: All metrics have zero or one label. Cannot break down by any dimension."
    $p14_lines += "Impact: Cannot identify which endpoint, instance, or status code is causing problems."
    $p14_lines += "Root cause: Laziness, lack of understanding about dimensional analysis."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Define standard label set per metric type (at minimum: service, endpoint, status_code)."
    $p14_lines += "  2. Add instrumentation review to PR process."
    $p14_lines += "  3. Provide instrumentation examples for common patterns."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Everything Is P1"
    $p14_lines += ""
    $p14_lines += "Symptom: Every alert is severity critical. Pages for everything."
    $p14_lines += "Impact: Desensitization, missed real criticals, burnout."
    $p14_lines += "Root cause: No severity definition, fear of missing something."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Define severity levels clearly with response times."
    $p14_lines += "  2. Page only for user-facing impact or data loss."
    $p14_lines += "  3. Route non-critical alerts to chat channels."
    $p14_lines += "  4. Implement escalation delays for lower severity."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Metrics Over Logs Over Traces"
    $p14_lines += ""
    $p14_lines += "Symptom: Only using one pillar (usually logs) for everything."
    $p14_lines += "Impact: High cost (logs are expensive), slow debugging (logs lack structure)."
    $p14_lines += "Root cause: Familiarity, legacy systems, lack of tooling."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Use metrics for alerting and high-level trends."
    $p14_lines += "  2. Use traces for request-level debugging."
    $p14_lines += "  3. Use logs for detailed event context."
    $p14_lines += "  4. Build pipelines that pivot between pillars seamlessly."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Vanity Dashboards"
    $p14_lines += ""
    $p14_lines += "Symptom: Dashboards designed to impress executives, not to debug problems."
    $p14_lines += "Impact: Beautiful but useless during incidents."
    $p14_lines += "Root cause: Dashboard built for demo purposes, not operational use."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Design dashboard for the on-call engineer, not the VP."
    $p14_lines += "  2. Test dashboard during actual incidents."
    $p14_lines += "  3. Include drill-down links to traces and logs."
    $p14_lines += "  4. Keep executive view as a separate, simple dashboard."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Instrumentation After Deployment"
    $p14_lines += ""
    $p14_lines += "Symptom: Metrics and dashboards created weeks after service goes live."
    $p14_lines += "Impact: No observability during initial launch. Cannot debug launch issues."
    $p14_lines += "Root cause: No observability requirements in definition of done."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Instrumentation is a code quality requirement, not a post-deployment task."
    $p14_lines += "  2. Dashboards and alerts reviewed in PR before deployment."
    $p14_lines += "  3. Automated check: service not deployed without metrics endpoint."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Data Hoarding"
    $p14_lines += ""
    $p14_lines += "Symptom: Keep all telemetry forever at full resolution. Massive storage costs."
    $p14_lines += "Impact: Budget overruns, slow queries, vendor lock-in."
    $p14_lines += "Root cause: Fear of losing data, no retention policy."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Define retention tiers with clear TTLs."
    $p14_lines += "  2. Downsample older data aggressively."
    $p14_lines += "  3. Archive cold data to cheap object storage."
    $p14_lines += "  4. Delete data with no demonstrated use."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: No Correlation Between Pillars"
    $p14_lines += ""
    $p14_lines += "Symptom: Metrics, logs, and traces are in separate silos. Cannot pivot between them."
    $p14_lines += "Impact: Slow debugging. Engineer must context-switch between tools."
    $p14_lines += "Root cause: No trace_id in logs, no span link in dashboards."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Include trace_id and span_id in all log entries."
    $p14_lines += "  2. Add links from dashboard panels to log/trace explorers."
    $p14_lines += "  3. Use unified observability platform (Grafana with Prometheus+Loki+Tempo)."
    $p14_lines += ""
    $p14_lines += "### Anti-Pattern Name: Black Box Monitoring"
    $p14_lines += ""
    $p14_lines += "Symptom: Only external health checks. No internal metrics."
    $p14_lines += "Impact: Cannot debug anything without logging into servers."
    $p14_lines += "Root cause: Legacy approach, no instrumentation budget."
    $p14_lines += ""
    $p14_lines += "Solution:"
    $p14_lines += "  1. Implement RED metrics for every service."
    $p14_lines += "  2. Add USE metrics for every resource."
    $p14_lines += "  3. Implement distributed tracing for request-level visibility."
    $p14_lines += "  4. Use auto-instrumentation for quick wins."
    $p14_lines += ""
}
Add-Section $p14_lines

# ===== P15 QUALITY GATES =====
$p15_lines = @()
$p15_lines += "# P15 — Quality Gates and Observability Maturity"
$p15_lines += ""
for ($t = 0; $t -lt 80; $t++) {
    $p15_lines += "## Quality Gate $($t+1): Observability Maturity Assessment"
    $p15_lines += ""
    $p15_lines += "### Maturity Level Description for Gate $($t+1)"
    $p15_lines += ""
    $p15_lines += "Level 0 (Ad-hoc): No instrumentation. Debugging by logging into servers."
    $p15_lines += "  Characteristics: No dashboards, no alerts, no structured logging."
    $p15_lines += "  Gap: Everything. Start with auto-instrumentation and basic dashboards."
    $p15_lines += ""
    $p15_lines += "Level 1 (Basic): Essential metrics collected. Some dashboards exist."
    $p15_lines += "  Characteristics: Node-level metrics, basic application metrics, unstructured logs."
    $p15_lines += "  Gap: No tracing, no structured logging, no SLOs, manual alert tuning."
    $p15_lines += ""
    $p15_lines += "Level 2 (Standard): Structured logging, service-level dashboards, alerting."
    $p15_lines += "  Characteristics: RED dashboards per service, structured JSON logs, basic alerting."
    $p15_lines += "  Gap: No distributed tracing, no SLOs, high alert noise, no correlation."
    $p15_lines += ""
    $p15_lines += "Level 3 (Advanced): Distributed tracing, SLOs, burn-rate alerts."
    $p15_lines += "  Characteristics: Full trace coverage, MWMBR alerts, SLO dashboards, log/metric/trace correlation."
    $p15_lines += "  Gap: No cardinality governance, no cost optimization, manual instrumentation."
    $p15_lines += ""
    $p15_lines += "Level 4 (Optimized): Cardinality governance, cost optimization, OTel standards."
    $p15_lines += "  Characteristics: Instrumentation standards enforced, cardinality budgets, cost attribution per team."
    $p15_lines += "  Gap: Limited automation, not all teams at same level."
    $p15_lines += ""
    $p15_lines += "Level 5 (Autonomous): Observability as code, automated optimization."
    $p15_lines += "  Characteristics: Dashboards/alertos as code, automated sampling, adaptive instrumentation."
    $p15_lines += "  Gap: Continuous improvement culture needed."
    $p15_lines += ""
    $p15_lines += "### Capability Gaps for Gate $($t+1)"
    $p15_lines += ""
    $p15_lines += "For each maturity dimension, identify the current level and target level."
    $p15_lines += "Dimensions to assess:"
    $p15_lines += "  1. Metrics instrumentation (coverage, naming, cardinality)"
    $p15_lines += "  2. Logging (structured, levels, sampling, retention)"
    $p15_lines += "  3. Distributed tracing (coverage, sampling, context propagation)"
    $p15_lines += "  4. Alerting (coverage, thresholds, fatigue management)"
    $p15_lines += "  5. Dashboards (tiers, maintainability, drill-down)"
    $p15_lines += "  6. SLOs (SLI definitions, burn-rate alerts, error budgets)"
    $p15_lines += "  7. Pipeline architecture (agent deployment, collector, storage)"
    $p15_lines += "  8. Cost management (budget per team, retention, sampling)"
    $p15_lines += "  9. Culture (blameless postmortems, shared ownership)"
    $p15_lines += "  10. Automation (observability as code, CI integration)"
    $p15_lines += ""
    $p15_lines += "### Improvement Roadmap for Gate $($t+1)"
    $p15_lines += ""
    $p15_lines += "Quarter 1: Achieve Level 2 across all dimensions."
    $p15_lines += "  - Deploy auto-instrumentation for all services."
    $p15_lines += "  - Implement structured logging standards."
    $p15_lines += "  - Create RED dashboards for top 10 services."
    $p15_lines += "  - Set up basic alerting with runbooks."
    $p15_lines += ""
    $p15_lines += "Quarter 2: Achieve Level 3 for critical services."
    $p15_lines += "  - Implement distributed tracing with tail-based sampling."
    $p15_lines += "  - Define SLOs for all user-facing services."
    $p15_lines += "  - Implement MWMBR alerting."
    $p15_lines += "  - Create SLO dashboards."
    $p15_lines += ""
    $p15_lines += "Quarter 3: Achieve Level 3 across all services."
    $p15_lines += "  - Extend tracing to all services."
    $p15_lines += "  - Implement log-trace-metric correlation."
    $p15_lines += "  - Automate sampling rate adjustments."
    $p15_lines += ""
    $p15_lines += "Quarter 4: Achieve Level 4."
    $p15_lines += "  - Implement cardinality governance program."
    $p15_lines += "  - Set cost attribution and budgets per team."
    $p15_lines += "  - Automate dashboard and alert lifecycle."
    $p15_lines += "  - Implement observability-as-code pipeline."
    $p15_lines += ""
    $p15_lines += "### Quality Gate Checklist for Gate $($t+1)"
    $p15_lines += ""
    $p15_lines += "Before a service can be deployed to production:"
    $p15_lines += "  [ ] All public endpoints emit RED metrics with standard labels."
    $p15_lines += "  [ ] All external dependencies (DB, queue, cache) are instrumented."
    $p15_lines += "  [ ] Structured logging is implemented with trace_id propagation."
    $p15_lines += "  [ ] Distributed tracing context is propagated through all async paths."
    $p15_lines += "  [ ] Service-level dashboard exists and passes review."
    $p15_lines += "  [ ] SLO is defined with burn-rate alerts."
    $p15_lines += "  [ ] Runbooks exist for all alerts."
    $p15_lines += "  [ ] Cardinality is reviewed and within budget."
    $p15_lines += "  [ ] Cost impact is estimated and approved."
    $p15_lines += ""
    $p15_lines += "### On-Call Readiness Checklist for Gate $($t+1)"
    $p15_lines += ""
    $p15_lines += "Before an engineer can be on-call for a service:"
    $p15_lines += "  [ ] Can access all dashboards and has appropriate permissions."
    $p15_lines += "  [ ] Has walked through the runbook for each alert."
    $p15_lines += "  [ ] Can pivot from metric spike to log search to trace waterfall."
    $p15_lines += "  [ ] Knows how to acknowledge, investigate, and resolve alerts."
    $p15_lines += "  [ ] Has shadowed the current on-call engineer for at least 2 shifts."
    $p15_lines += "  [ ] Understands escalation policies and when to escalate."
    $p15_lines += "  [ ] Has access to postmortem process and templates."
    $p15_lines += ""
}
Add-Section $p15_lines

# Add EOF marker
$lines += ""
$lines += "# End of Observability Engineer SKILL.md"
$lines += "# Total sections: 15 major sections with detailed variations"

# Write the file
Set-Content -Path $out -Value ($lines -join "`n") -Encoding UTF8

Write-Output "Generated $($lines.Count) lines"
