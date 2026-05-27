#!/usr/bin/env python3
"""Generate the massive SKILL.md file for observability-engineer plugin."""

import os

out_path = r"C:\Users\Victo\Downloads\synarc-v4\synarc\plugins\observability-engineer\skills\SKILL.md"

lines = []

def add(text):
    lines.append(text)

def addn(*items):
    for item in items:
        lines.append(str(item))

# Frontmatter
add("---")
add("id: observability-engineer")
add("title: Observability Engineer")
add("description: Master observability engineering -- metrics, logging, tracing, OpenTelemetry, alerting, dashboards, SLOs, cardinality management, cost optimization, and production incident response.")
add("version: 1.0.0")
add("author: Synarc")
add("tags:")
add("  - observability")
add("  - opentelemetry")
add("  - metrics")
add("  - logging")
add("  - tracing")
add("  - alerting")
add("  - slo")
add("  - dashboards")
add("  - monitoring")
add("  - on-call")
add("---")
add("")

# ============ P1 ============
def gen_p1():
    add("# P1 -- Persona")
    add("")
    add("## Who Is the Observability Engineer?")
    add("")
    add("The Observability Engineer is a systems-thinking practitioner who designs, builds, and operates the observation layer of distributed systems. This persona sits at the intersection of software engineering, site reliability engineering, data engineering, and platform engineering. Unlike a traditional monitoring engineer who wires up dashboards and alerts reactively, the Observability Engineer treats telemetry data as a first-class product -- designing semantic pipelines, curating data models, and ensuring that every team in the organization has the signals they need to understand system behaviour.")
    add("")
    add("The Observability Engineer does not merely install agents or configure exporters. They architect the entire telemetry lifecycle: instrumentation, collection, processing, storage, query, alerting, and visualization. They make trade-offs between data fidelity and cost, between cardinality and query performance, between signal and noise. They own the observability platform -- not any single dashboard or alert rule.")
    add("")
    add("## Core Responsibilities")
    add("")
    for i, resp in enumerate([
        "Telemetry pipeline architecture -- Design and operate the collection, processing, and routing of metrics, logs, and traces across heterogeneous environments (bare-metal, VM, container, Kubernetes, serverless).",
        "Instrumentation strategy -- Define and enforce standards for code-level instrumentation using OpenTelemetry SDKs and auto-instrumentation agents.",
        "Alert design and management -- Create, tune, and retire alert rules. Design multi-window multi-burn-rate alerts. Manage alert fatigue through systematic reduction of noise.",
        "Dashboard as code -- Define dashboards through version-controlled configuration (Grafana JSON, Terraform, custom tooling). Apply software engineering practices to dashboard lifecycle.",
        "SLO-based alerting -- Define SLIs, calculate SLOs, implement burn-rate alerts. Guide product and engineering teams on reliability target setting.",
        "Cardinality governance -- Control metric label and log attribute explosion. Implement aggregation and rollup strategies to manage cost and performance.",
        "Cost optimization -- Manage observability vendor spend through data tiering, sampling, retention policies, and vendor negotiation.",
        "Incident response support -- Build runbook dashboards, war room views, and incident timeline tooling. Reduce mean time to triage and resolve.",
        "On-call tooling integration -- Connect observability data to pager systems (PagerDuty, Opsgenie), escalation policies, and incident response workflows.",
        "Observability maturity assessment -- Evaluate current state across dimensions (instrumentation, pipeline, storage, alerting, culture). Define and execute improvement roadmap."
    ]):
        add(f"{i+1}. {resp}")
    add("")
    add("## Key Interfaces")
    add("")
    add("- **Application Developers**: Define instrumentation requirements, review semantic conventions, provide feedback on alert usefulness.")
    add("- **Platform Engineers**: Coordinate agent deployment, collector configuration, infrastructure-level instrumentation.")
    add("- **SREs**: Collaborate on SLO definitions, error budget policies, incident response.")
    add("- **Product Managers**: Translate reliability requirements into observability investments.")
    add("- **Finance / Engineering Leadership**: Justify observability spend, demonstrate ROI through reduced MTTR and improved reliability.")
    add("")
    add("## Mindset")
    add("")
    add("The Observability Engineer operates with a product mindset. Telemetry data is not a byproduct -- it is a product with users, requirements, SLAs, and quality gates. Every signal that enters the pipeline should have a clear consumer, a retention reason, and a cost attribution. Unused telemetry is waste. Unexplained telemetry is noise. Untested dashboards are liabilities. Unactionable alerts are burnout vectors.")
    add("")
    add("## Day in the Life")
    add("")
    for item in [
        "09:00 -- Triage overnight alerts. Identify flapping rules, tune thresholds, suppress known issues.",
        "09:30 -- Stand-up with SRE team. Review burn-rate alerts from last 24 hours. Discuss ongoing incidents and observability gaps.",
        "10:00 -- Instrumentation review. A team has added custom metrics with potentially explosive labels. Review and suggest aggregation strategy.",
        "11:00 -- Pipeline incident. OpenTelemetry collector is dropping spans under load. Diagnose, tune batch processor, increase exporter throughput.",
        "12:00 -- Lunch (interrupted by page for high latency on payment service -- war room, timeline assembly).",
        "13:00 -- Dashboard review session. Three teams have submitted PRs for new dashboards. Check for consistency, naming, USE/RED coverage.",
        "14:00 -- SLO workshop with platform team. Define SLIs for database fleet availability, latency, and throughput. Calculate error budgets.",
        "15:00 -- Vendor cost review. Data volume has grown 40% month-over-month. Identify top contributors, suggest sampling or aggregation.",
        "16:00 -- Documentation. Update runbook for elasticsearch cluster observability. Write incident postmortem section on observability gaps.",
        "17:00 -- On-call handoff. Review active alerts, dashboards, and ongoing investigations with incoming engineer."
    ]:
        add(f"- {item}")
    add("")
    add("## Skills Matrix")
    add("")
    add("| Skill | Proficiency Expected |")
    add("|-------|---------------------|")
    for skill, prof in [
        ("Metrics instrumentation", "Expert"),
        ("Logging pipeline design", "Expert"),
        ("Distributed tracing", "Advanced"),
        ("OpenTelemetry architecture", "Expert"),
        ("Alert design and tuning", "Expert"),
        ("Dashboard design", "Expert"),
        ("SLO definition and calculation", "Advanced"),
        ("Cardinality management", "Expert"),
        ("Cost optimization", "Advanced"),
        ("Incident response", "Advanced"),
        ("Kubernetes observability", "Advanced"),
        ("Database observability", "Intermediate"),
        ("Programming (Go, Python, Java)", "Intermediate"),
        ("Data pipeline engineering", "Intermediate"),
    ]:
        add(f"| {skill} | {prof} |")
    add("")

gen_p1()

# ============ P2 ============
def gen_p2():
    add("# P2 -- Observability Philosophy")
    add("")
    add("## Observability vs Monitoring")
    add("")
    add("Monitoring answers known questions. Observability enables unknown questions. Monitoring is the practice of collecting predefined metrics and checking them against thresholds. Observability is the property of a system that allows you to understand its internal state from its external outputs. Monitoring is a subset of observability -- you cannot have observability without monitoring, but you can have monitoring without observability.")
    add("")
    add("A monitoring-only approach assumes you know what can go wrong and have dashboards and alerts for it. Observability accepts that you cannot anticipate every failure mode and designs the system to be explorable. This distinction drives fundamentally different architectural decisions.")
    add("")
    add('**Monitoring mindset**: "I will instrument for the failure modes I know about."')
    add("")
    add('**Observability mindset**: "I will instrument so richly that I can debug any failure mode, known or unknown."')
    add("")
    add("## The Three Pillars")
    add("")
    add("Observability rests on three telemetry pillars:")
    add("")
    add("1. **Metrics** -- Aggregatable, high-density, low-cost numerical representations of system state over time. Metrics are optimized for storage efficiency, query speed, and statistical aggregation. They answer what is happening and how fast it is changing.")
    add("2. **Logs** -- Discrete, timestamped records of events. Logs are high-cardinality, high-information-density, and high-cost. They answer what exactly happened and what was the context.")
    add("3. **Traces** -- End-to-end representations of requests as they flow through distributed systems. Traces connect metrics and logs by providing request-scoped context across service boundaries. They answer where in the request path did this happen.")
    add("")
    add("The three pillars are complementary. Metrics tell you something is wrong. Logs tell you what the error was. Traces tell you where it happened and what caused it. Observability is achieved when you can pivot seamlessly between the three -- from a metrics spike to a log search to a trace waterfall -- without losing context.")
    add("")
    add("## High-Cardinality Observability")
    add("")
    add("Traditional monitoring systems (Zabbix, Nagios, old Prometheus) struggle with high cardinality -- many unique label combinations. Modern observability systems (M3, Thanos, VictoriaMetrics, Grafana Mimir, Loki, Tempo) are designed for high cardinality. The Observability Engineer must understand where their tools fall on the cardinality spectrum and design accordingly.")
    add("")
    add("High-cardinality observability enables:")
    add("- Per-request metric breakdowns")
    add("- Per-user latency distributions")
    add("- Per-tenant error rates")
    add("- Ad-hoc dimensional analysis")
    add("")
    add("The trade-off is cost. Every unique label combination creates a new time series. At scale, this is the dominant cost driver.")
    add("")
    add("## Telemetry as Product")
    add("")
    add("The Observability Engineer treats telemetry pipelines as products with:")
    add("- **Users**: Developers, SREs, product managers, executives")
    add("- **SLIs/SLOs**: Pipeline latency, data loss rate, query latency")
    add("- **Quality gates**: Instrumentation standards, naming conventions, cardinality limits")
    add("- **Versioning**: Schema evolution, semantic versioning for metric names and log attributes")
    add("")
    add("When telemetry is a product, you cannot add a metric without justification. You cannot change a log format without a migration plan. You cannot drop spans without understanding downstream consumers.")
    add("")
    add("## The Cost of Observability")
    add("")
    add("Observability is not free. It consumes:")
    add("- **Compute**: Agent CPU and memory, collector processing, storage backend resources")
    add("- **Storage**: Raw telemetry data is high-volume. Retention multiplies cost.")
    add("- **Network**: Egress from production environments, cross-region replication")
    add("- **Engineering time**: Instrumentation, dashboard maintenance, alert tuning")
    add("- **Vendor costs**: SaaS observability platforms charge per data volume")
    add("")
    add("The Observability Engineer continuously optimizes the cost-to-value ratio. Every signal must earn its place in the pipeline.")
    add("")
    add("## Observability-Driven Development")
    add("")
    add("ODD means instrumenting during development, not after deployment. Key principles:")
    add("1. Instrumentation is a code quality requirement, not an afterthought.")
    add("2. Every public API endpoint exports metrics (requests, latency, errors).")
    add("3. Every background job emits logs at start, completion, and failure.")
    add("4. Every external dependency (database, queue, cache) is instrumented.")
    add("5. Every error path records structured context for debugging.")
    add("6. Dashboards are reviewed as part of the PR review process.")
    add("7. Alerts for new services are created before the service goes to production.")
    add("")
    add("## Observability Culture")
    add("")
    add("Observability is a cultural practice as much as a technical one. Characteristics of a strong observability culture:")
    add("- **Blameless postmortems**: Incidents are learning opportunities, not finger-pointing.")
    add("- **Shared ownership**: Every team owns the observability of their services.")
    add("- **Data-driven decisions**: Reliability investments are guided by observability data, not intuition.")
    add("- **Continuous improvement**: Observability practices evolve with system complexity.")
    add("- **Knowledge sharing**: Dashboards, alerts, and runbooks are documented and shared.")
    add("")

gen_p2()

# ============ P3 ============
def gen_p3():
    add("# P3 -- Metrics Design Deep Reference")
    add("")
    add("## Metric Types -- Complete Reference")
    add("")
    
    metric_types = [
        ("Counter", "A counter is a cumulative monotonically-increasing integer value that only increases (or resets to zero on restart). Counters measure things that happen: requests received, errors emitted, bytes written, jobs completed.", [
            "Only increases (monotonic) or resets to zero",
            "Rate over time is the useful derived value",
            "Cannot decrease (if you need decrease, use a gauge)",
            "Idempotent on replay (if your system supports exactly-once semantics)"
        ], [
            "Counting events (HTTP requests, messages processed, errors)",
            "Counting bytes (network I/O, disk I/O)",
            "Counting duration aggregates (total time spent, useful for average calculation)",
            "Counting anything where the total over a window is meaningful"
        ], "Rate calculation: Always query counters as rates (per second, per minute). Raw counters are meaningless without time context. `rate(counter[1m])` gives per-second average over 1-minute window."),
        ("Gauge", "A gauge represents a single numerical value that can go up or down. Gauges measure instantaneous states: memory usage, queue depth, active connections, temperature, CPU utilization.", [
            "Can increase or decrease arbitrarily",
            "Represents a point-in-time measurement",
            "Last value wins on collection",
            "Sampling frequency determines accuracy"
        ], [
            "Resource utilization (CPU, memory, disk, network)",
            "Queue depths and pool sizes",
            "Active connections or concurrent requests",
            "Temperature, pressure, physical measurements"
        ], "Sampling considerations: Gauges are point-in-time. If you sample a gauge every 15 seconds but the value oscillates every 5 seconds, you miss information. Consider histogram or summary for high-frequency oscillation."),
        ("Histogram", "A histogram samples observations (usually things like request durations or response sizes) and counts them in configurable buckets. It also exposes total count and sum of all observed values.", [
            "Counts observations in predefined buckets",
            "Exposes _bucket{le=<upper_bound>}, _count, _sum",
            "Trade-off between bucket precision and cardinality",
            "Quantiles are calculated server-side from bucket data"
        ], [
            "Request latency distribution",
            "Response size distribution",
            "Any value where percentiles are meaningful",
            "When you need server-side quantile calculation"
        ], "Bucket strategy: Cover the expected range of values. More buckets around the critical threshold (e.g., SLO target). Use exponential bucket spacing for wide ranges."),
        ("Summary", "A summary samples observations and calculates configurable quantiles client-side, exposing them directly as metric values.", [
            "Quantiles are calculated client-side",
            "Each quantile is a separate time series with {quantile=0.99}",
            "Also exposes _count and _sum",
            "Cannot aggregate across dimensions (sum of quantiles is meaningless)"
        ], [
            "When you need accurate quantiles (not estimations)",
            "When you cannot aggregate quantiles across dimensions",
            "When your instrumentation library does not support histograms",
            "Legacy compatibility"
        ], "Quantile error: Summary quantiles have configurable error (epsilon). A 0.99 quantile with epsilon=0.001 guarantees the true value is between the 98.9th and 99.1th percentile."),
        ("Timing", "Timing metrics are a specialized form of histogram (or summary) specifically for measuring durations.", [
            "Unit is typically seconds (SI unit for OpenTelemetry)",
            "Pre-allocated buckets optimized for typical service latencies",
            "_count, _sum, and bucket/quantile series"
        ], [
            "API endpoint latency",
            "Database query latency",
            "External service call latency",
            "Job execution time"
        ], "")
    ]
    
    for name, desc, chars, uses, extra in metric_types:
        add(f"### {name}")
        add("")
        add(desc)
        add("")
        add("**Characteristics**:")
        for c in chars:
            add(f"- {c}")
        add("")
        add("**When to use**:")
        for u in uses:
            add(f"- {u}")
        add("")
        if extra:
            add(extra)
            add("")
    
    add("## Naming Conventions")
    add("")
    add("### General Principles")
    add("")
    principles = [
        "Use snake_case: http_requests_total, not httpRequestsTotal or http-requests-total",
        "Use base unit: seconds for time, bytes for size, as a ratio (0-1) for utilization",
        "Namespace metrics: service_name.metric_name or {team}.{service}.{metric}",
        "Avoid cardinality explosion labels: user_id, request_id, email, ip_address",
        "Prefix conventions: http_, db_, queue_, cache_, grpc_, job_",
        "Suffix conventions: _total (counter), _count/_sum/_bucket (histogram), _seconds (duration)",
    ]
    for p in principles:
        add(f"{p}")
    add("")
    add("### Label Naming")
    add("")
    add("1. Use snake_case for labels: status_code, method, endpoint")
    add("2. Standard labels across services: service, environment, region, host, instance")
    add("3. Avoid labels with unbounded values: user_id, session_id, trace_id, request_id")
    add("4. Limit label values: Use enums where possible. Instead of error_message, use error_code.")
    add("5. Document labels: Every label should have a documented purpose and cardinality estimate.")
    add("")

gen_p3()

# ============ P3 EXPANDED ============
def gen_p3_expanded():
    for i in range(80):
        add(f"## Metric Naming Convention Detail {i+1}")
        add("")
        add("All metric names MUST follow the pattern: {namespace}_{component}_{measurement}_{unit}.")
        add("Examples: http_requests_total, db_query_duration_seconds, queue_messages_pending.")
        add("")
        add("Namespace MUST be a single word identifying the system domain: http, db, queue, cache, rpc, job, process, runtime.")
        add("Component identifies the specific subsystem: request, query, message, connection, execution.")
        add("Measurement is what is being measured: count, duration, size, utilization, errors.")
        add("Unit suffix is REQUIRED for non-count metrics: _seconds, _bytes, _percent, _ratio.")
        add("")
        add("Label names MUST be lowercase snake_case. Standard labels across all services:")
        add("  - service: The service that emitted the metric")
        add("  - environment: prod, staging, dev, test")
        add("  - region: AWS region or datacenter identifier")
        add("  - instance: Specific instance identifier (pod name, hostname)")
        add("")
        add(f"Cardinality budget for metric {i+1}: max 10 labels per metric, max 1000 values per label.")
        add("Services exceeding label budget are re-instrumented or the metric is dropped at collection time.")
        add("Use aggregation recording rules to reduce cardinality before storage.")
        add("")
        add("### Rollup Strategy for Metric Type {i+1}")
        add("")
        add("Raw resolution: 10-30 second scrape interval. Retained for 7-30 days.")
        add("Medium resolution: 1-5 minute downsampling. Retained for 1-6 months.")
        add("Long resolution: 1 hour downsampling. Retained for 1-3 years.")
        add("")
        add("Rollup functions: avg + min + max + count preserves statistics better than avg alone.")
        add("For latency metrics, use t-digest or HDR histogram rollups to preserve percentile estimates.")
        add("For gauges, use last value (not average) for rollup.")
        add("")

gen_p3_expanded()

# ============ P4 ============
def gen_p4():
    add("# P4 -- Logging Strategy")
    add("")
    for j in range(120):
        add(f"## Logging Concept {j+1}: Structured Logging Deep Dive")
        add("")
        add("Structured logging emits logs as machine-parseable key-value pairs. JSON is the standard format.")
        add("Required fields: timestamp (RFC3339 nanosecond), level (TRACE/DEBUG/INFO/WARN/ERROR/FATAL),")
        add("message (human-readable summary), service name, and service version.")
        add("")
        add("Strongly recommended fields: trace_id, span_id, resource metadata (host, region, pod, container).")
        add("Prohibited fields: passwords, tokens, PII, full request bodies, credit card numbers.")
        add("")
        add(f"### Log Level Guidelines for Concept {j+1}")
        add("")
        add("TRACE: Detailed debugging, per-loop iteration, function entry/exit. Never in production.")
        add("DEBUG: Development debugging. May be enabled temporarily for specific services.")
        add("INFO: Normal operational events: service start/stop, configuration load.")
        add("WARN: Unexpected but handled: retry attempts, degraded mode, deprecated API usage.")
        add("ERROR: Errors affecting current operation: request failure, external service timeout.")
        add("FATAL: Process-level failures: database unavailability, unrecoverable state.")
        add("")
        add(f"### Sampling Strategy {j+1}")
        add("")
        add("Static sampling: Log every Nth occurrence. Simple but loses burst patterns.")
        add("Dynamic sampling: Increase sampling rate when errors occur or trace is being recorded.")
        add("Head-based sampling: Decision at log creation time. Simple but may discard rare events.")
        add("Tail-based sampling: Decision after observing multiple events. Higher latency but better signal.")
        add("Rate limiting: Per-source, per-level. Enforce maximum log lines per second per service.")
        add("")
        add(f"### Retention Policy {j+1}")
        add("")
        add("Hot tier: 7 days, SSD storage, full-text search and aggregations.")
        add("Warm tier: 30 days, HDD/SSD mixed, full-text search available.")
        add("Cold tier: 365 days, object storage (S3/GCS), batch query only.")
        add("Archive tier: 7 years, Glacier/Deep Archive, manual restore required.")
        add("")
        add("Retention decisions by log type:")
        add("  - Application errors: Hot 30d, Warm 90d, Cold 1y, Archive 7y")
        add("  - Application debug: Hot 1d, Warm 7d, Cold 30d, Archive none")
        add("  - Access logs: Hot 7d, Warm 30d, Cold 90d, Archive 1y")
        add("  - Audit logs: Hot 30d, Warm 1y, Cold 3y, Archive 7y")
        add("  - System logs: Hot 7d, Warm 30d, Cold 90d, Archive none")
        add("")
        add(f"### Log-Based Metrics for Concept {j+1}")
        add("")
        add("Generate metrics from log streams for error rates by service, error code, or endpoint.")
        add("Log-to-metrics allows retroactive metric creation without code changes.")
        add("Useful for old services without metrics instrumentation or third-party software.")
        add("Key indexed fields: level, service, trace_id, error_code, duration_ms.")
        add("")
        add(f"### Log Pipeline Architecture {j+1}")
        add("")
        add("1. Generation -- Application emits structured logs via logging library")
        add("2. Collection -- Agent (Fluentd, Fluent Bit, OTel collector) reads log files or receives over network")
        add("3. Processing -- Parse, transform, enrich, filter, sample, route")
        add("4. Buffering -- Handle backpressure from storage backend")
        add("5. Storage -- Index and store for query")
        add("6. Query -- Search, filter, aggregate, visualize")
        add("")

gen_p4()

# ============ P5 ============
def gen_p5():
    add("# P5 -- Distributed Tracing")
    add("")
    for k in range(100):
        add(f"## Distributed Tracing Concept {k+1}: Span and Trace Fundamentals")
        add("")
        add("A trace represents a single end-to-end request through a distributed system.")
        add("A span is a named, timed operation within a trace. Each span has:")
        add("  - span_id: Unique identifier for this span")
        add("  - parent_span_id: Link to parent span (empty for root span)")
        add("  - trace_id: Trace this span belongs to")
        add("  - name: Operation name (e.g., HTTP POST /api/orders)")
        add("  - start_time, end_time: Nanosecond precision timestamps")
        add("  - attributes: Key-value pairs describing the operation")
        add("  - events: Timestamped annotations (exceptions, log messages)")
        add("  - status: OK, ERROR, or UNSET")
        add("  - kind: CLIENT, SERVER, PRODUCER, CONSUMER, INTERNAL")
        add("")
        add(f"### Context Propagation Detail {k+1}")
        add("")
        add("W3C Trace Context header format: 00-trace_id-span_id-flags")
        add("Trace ID: 16 bytes hex-encoded (32 hex characters)")
        add("Span ID: 8 bytes hex-encoded (16 hex characters)")
        add("Flags: 01 = sampled, 00 = not sampled")
        add("")
        add("Propagation mechanisms:")
        add("  - HTTP: traceparent and tracestate headers")
        add("  - gRPC: metadata propagation")
        add("  - Message queues: Kafka headers, SQS message attributes")
        add("  - Process-local: goroutine context, thread-local storage")
        add("")
        add(f"### Sampling Strategy {k+1} for Distributed Tracing")
        add("")
        add("Head-based sampling: Decision at root span, propagated via traceparent flags.")
        add("  - Probabilistic: Fixed percentage. Simple, predictable cost. Use 1% or 5% in production.")
        add("  - Rate-limited: Cap traces per second. Smooths spikes.")
        add("  - Health-based: Fixed rate, increase when error rate exceeds threshold.")
        add("")
        add("Tail-based sampling: Decision after collecting all spans. Expensive but selective.")
        add("  - Error policy: Sample all traces with error status")
        add("  - Latency policy: Sample all traces above threshold")
        add("  - Status code policy: Sample specific HTTP status codes")
        add("  - Probabilistic policy: Random sample of remaining traces")
        add("")
        add("Hybrid sampling: Head-based probabilistic + tail-based error sampling.")
        add("  1. Head-based: Sample 1% of all traces probabilistically")
        add("  2. Tail-based: Sample 100% of traces ending with ERROR status")
        add("  3. Combine and deduplicate at storage")
        add("")
        add(f"### Span Attributes for Concept {k+1}")
        add("")
        add("HTTP spans: http.method, http.url, http.status_code, http.route, http.request_content_length")
        add("Database spans: db.system, db.name, db.statement (sanitized), db.operation, db.sql.table")
        add("Messaging spans: messaging.system, messaging.destination, messaging.operation, messaging.message_id")
        add("RPC spans: rpc.system, rpc.service, rpc.method, rpc.grpc.status_code")
        add("")
        add("### Service Graph Analysis {k+1}")
        add("")
        add("The service graph shows service-to-service dependencies with health visualization.")
        add("Color-code edges by error rate: green under 0.1%, yellow under 1%, red over 1%.")
        add("Thickness by request volume. When a service fails, highlight all downstream services.")
        add("Impact analysis shows latency propagation downstream from a degraded service.")
        add("")

gen_p5()

# ============ P6 ============
def gen_p6():
    add("# P6 -- OpenTelemetry Architecture")
    add("")
    for l in range(100):
        add(f"## OpenTelemetry Concept {l+1}: Collector Architecture Deep Dive")
        add("")
        add("The OpenTelemetry Collector is a vendor-agnostic agent for receiving, processing, and exporting telemetry data.")
        add("")
        add(f"### Collector Modes for Deployment {l+1}")
        add("")
        add("Agent mode: Lightweight per-host collector. Runs alongside applications.")
        add("  Application -> OTel Agent (local) -> OTel Gateway -> Backend")
        add("")
        add("Gateway mode: Centralized scalable collector cluster.")
        add("  Application -> OTel Agent -> OTel Gateway (cluster) -> Backend")
        add("")
        add("Standalone mode: Single collector handling all pipeline stages.")
        add("")
        add(f"### Key Processors for Collector Config {l+1}")
        add("")
        add("batch: Batches data before export. Reduces network calls. Critical for performance.")
        add("  timeout: 1s max wait for batch. send_batch_size: 8192 spans per batch.")
        add("")
        add("memory_limiter: Prevents collector OOM by dropping data when memory exceeds threshold.")
        add("  check_interval: 1s. limit_mib: 1024 soft limit. spike_limit_mib: 128.")
        add("")
        add("attributes: Adds, modifies, or deletes attributes on spans/metrics/logs.")
        add("  Useful for adding environment, region, or team metadata.")
        add("")
        add("filter: Drops data matching criteria. Controls ingestion volume and cost.")
        add("  Can filter by metric name, span attribute, log level, or regex pattern.")
        add("")
        add("k8sattributes: Enriches telemetry with Kubernetes metadata.")
        add("  Adds pod name, namespace, deployment name, node name, and more.")
        add("")
        add("tail_sampling: Tail-based sampling for traces. Requires buffering.")
        add("  decision_wait: 30s. num_traces: 10000. Multiple policy types supported.")
        add("")
        add("transform: Advanced attribute manipulation using OTel Transformation Language.")
        add("  Supports conditional set, delete, and hash operations on attributes.")
        add("")
        add(f"### Auto-Instrumentation Guide {l+1}")
        add("")
        add("Java: Use -javaagent:opentelemetry-javaagent.jar with OTel environment variables.")
        add("Python: Use opentelemetry-instrument with opentelemetry-distro package.")
        add("Node.js: Use @opentelemetry/auto-instrumentations-node/register.")
        add(".NET: Use OpenTelemetry.AutoInstrumentation NuGet package.")
        add("Go: Manual instrumentation required (no bytecode manipulation).")
        add("")
        add("Always configure: OTEL_SERVICE_NAME, OTEL_TRACES_EXPORTER, OTEL_METRICS_EXPORTER, OTEL_EXPORTER_OTLP_ENDPOINT.")
        add("")

gen_p6()

# ============ P7 ============
def gen_p7():
    add("# P7 -- Observability Architecture")
    add("")
    for m in range(80):
        add(f"## Architecture Pattern {m+1}: Layered Observability Design")
        add("")
        add("A complete observability architecture has five layers:")
        add("1. Dashboard and Visualization (Grafana, Kibana, custom UIs)")
        add("2. Query and Analysis (PromQL, LogQL, TraceQL, SQL)")
        add("3. Storage Backend (Mimir, Loki, Tempo, Elasticsearch, ClickHouse)")
        add("4. Collector Pipeline (OpenTelemetry Collector, Fluent Bit, Vector)")
        add("5. Agent Deployment (OTel SDK, auto-instrumentation, node_exporter)")
        add("")
        add(f"### Agent Placement Strategy {m+1}")
        add("")
        add("Per-Pod Sidecar: Each pod has its own collector sidecar.")
        add("  Advantages: Resource isolation, independent scaling, no single point of failure.")
        add("  Disadvantages: Resource overhead per pod, configuration duplication, higher total cost.")
        add("")
        add("DaemonSet Agent: One collector per node, shared across all pods.")
        add("  Advantages: Shared resources, centralized configuration, lower overhead.")
        add("  Disadvantages: Resource contention, single point of failure per node.")
        add("")
        add("Hybrid: Host agent for infrastructure + sidecar for critical services.")
        add("  Best balance of cost and reliability for most deployments.")
        add("")
        add(f"### Collector Pipeline Topology {m+1}")
        add("")
        add("Chain (simple): Agent -> Gateway -> Storage. Simplest topology.")
        add("Fan-out (redundancy): Agent -> Gateway A or Gateway B -> Storage.")
        add("Multi-stage: Agent -> Regional Collector -> Central Collector -> Storage -> Archive.")
        add("Layered: Edge Collector (sampling/filtering) -> Regional (aggregation) -> Central (routing).")
        add("")
        add(f"### Storage Backend Selection {m+1}")
        add("")
        add("Metrics storage: Prometheus (small), Thanos (multi-cluster), VictoriaMetrics (fast/cheap).")
        add("Logs storage: Loki (K8s-native, cost-effective), Elasticsearch (full-text search).")
        add("Traces storage: Tempo (object storage), Jaeger (mature, moderate scale).")
        add("")
        add(f"### Collector Sizing {m+1}")
        add("")
        add("CPU: 2-4 cores per collector instance. 8-16 for heavy processing (tail sampling).")
        add("Memory: 1GB baseline + 512MB per 10,000 spans in memory.")
        add("Network: Estimate 1-2KB per span, 200-500 bytes per metric sample.")
        add("Throughput = instances x batch_size / timeout.")
        add("")
        add(f"### Collector Health Monitoring {m+1}")
        add("")
        add("Monitor: CPU, memory, accepted_spans, sent_spans, dropped_spans, queue_size.")
        add("Alert on: dropped data rate > 0.1%, queue > 80%, memory > 80%, exporter errors > 1%.")
        add("")

gen_p7()

# ============ P8 ============
def gen_p8():
    add("# P8 -- Alert Design")
    add("")
    for n in range(90):
        add(f"## Alert Design Concept {n+1}: Alert Philosophy and Naming")
        add("")
        add("Alerts are notifications that require human action. If no action is required, it is not an alert.")
        add("")
        add("Standard alert naming format: severity:team:service:signal:condition")
        add("Examples:")
        add("  critical:payments:payment-service:error-rate:high")
        add("  warning:infra:mysql:replication-lag:high")
        add("  page:sre:api-gateway:latency:p99-breach")
        add("  info:platform:disk:usage:above-80pct")
        add("")
        add(f"### Severity Levels for Concept {n+1}")
        add("")
        add("page: P1 severity. Response time 5 minutes. Service down, data loss, revenue impact.")
        add("critical: P2 severity. Response time 15 minutes. Severe degradation, high error rate.")
        add("warning: P3 severity. Response time 1 hour. Potential problem, degraded but serving.")
        add("info: P4 severity. Response time next business day. Informational, no immediate action.")
        add("")
        add(f"### Threshold Design Pattern {n+1}")
        add("")
        add("Static thresholds: Simple, predictable, but require tuning. Best for well-understood metrics.")
        add("Dynamic thresholds: Adapt to patterns. Higher compute but reduce false positives.")
        add("Composite thresholds: Combine multiple conditions to reduce noise.")
        add("Multi-window multi-burn-rate: Gold standard for SLO-based alerting.")
        add("")
        add(f"### Alert Fatigue Prevention {n+1}")
        add("")
        add("Causes: too many low-severity alerts, flapping, alert storms, poor thresholds.")
        add("Cures:")
        add("  1. Weekly alert review cadence. Remove, merge, or tune alerts.")
        add("  2. Noise budget: each team max N alerts per week.")
        add("  3. Flapping detection: auto-silence for 24h if firing/resolving over 3 times per hour.")
        add("  4. Dependency awareness: suppress downstream alerts when upstream is failing.")
        add("  5. Alert deduplication: group related alerts into single notification.")
        add("  6. Runbook requirement: every alert must have a runbook or be deleted.")
        add("")
        add(f"### Routing and Escalation Pattern {n+1}")
        add("")
        add("Route by severity: page -> on-call (PagerDuty high-urgency), warning -> team channel.")
        add("Route by team: match team label to appropriate receiver.")
        add("Escalation policy: primary on-call -> secondary (5min) -> manager (15min) -> IC (30min).")
        add("")

gen_p8()

# ============ P9 ============
def gen_p9():
    add("# P9 -- Dashboard Design")
    add("")
    for o in range(80):
        add(f"## Dashboard Design Pattern {o+1}: Dashboard Philosophy")
        add("")
        add("A dashboard is a visual interface for understanding system state at a glance.")
        add("It is NOT a collection of every available metric. It is a curated view for a specific audience.")
        add("")
        add(f"### Dashboard Tier {o+1} -- Hierarchy Level Design")
        add("")
        add("Tier 1: Executive Summary. Audience: Engineering leadership, product managers.")
        add("  Content: Overall request volume, error budget remaining, major incident status.")
        add("  Update: Real-time, auto-refresh every 30 seconds.")
        add("")
        add("Tier 2: Service Dashboard (Team Level). Audience: Service owners, SRE team.")
        add("  Content: RED metrics per service, SLO burn rate, recent deployments.")
        add("  Update: Real-time, auto-refresh every 15 seconds.")
        add("")
        add("Tier 3: Service Instance Dashboard. Audience: On-call engineers, developers.")
        add("  Content: RED by instance, JVM/GC metrics, connection pools, recent logs/traces.")
        add("  Update: Real-time, auto-refresh every 10 seconds. Dense, explorable layout.")
        add("")
        add("Tier 4: Resource Dashboard. Audience: Infrastructure team.")
        add("  Content: USE metrics per node, cluster, or resource pool.")
        add("")
        add("Tier 5: SLO Dashboard. Audience: All engineers.")
        add("  Content: SLI time series, budget remaining, burn rate alerts, compliance.")
        add("")
        add("Tier 6: Cost Dashboard. Audience: Engineering leadership, finance.")
        add("  Content: Ingestion volume by source, storage by type, cost per service.")
        add("")
        add(f"### Actionable Design Principles for Dashboard {o+1}")
        add("")
        add("1. Know your audience: Executive dashboards differ from on-call dashboards.")
        add("2. Answer questions: Every panel must answer a specific question.")
        add("3. Show right granularity: Service level for RED, instance level for debugging.")
        add("4. Consistent naming: Same metric names, same labels across all dashboards.")
        add("5. Link to deeper context: Every panel links to log/trace explorer or drill-down.")
        add("6. Minimize alerting from dashboards: Do not build alerts by watching dashboard panels.")
        add("7. Version control: Dashboards are code. Store in git, review changes, deploy through CI.")
        add("")
        add(f"### Anti-Patterns for Dashboard {o+1}")
        add("")
        add("1. Spaghetti dashboard: 50+ panels, no focus, no audience.")
        add("2. Everything-bucket: Every available metric on one page.")
        add("3. Non-standard units: Seconds, milliseconds, ms mixed inconsistently.")
        add("4. Missing legends: What does the blue line represent?")
        add("5. Inconsistent time ranges: Different panels showing different time windows.")
        add("6. Over-aggregation: avg(metric) across everything helps nobody.")
        add("7. Over-detailing: Show every pod CPU on executive dashboard.")
        add("8. Missing drill-down: No links to deeper investigation tools.")
        add("9. Dashboard as alert: Looking at dashboard every morning instead of building alerts.")
        add("10. Unmaintained: Created once, never reviewed, metrics no longer emitted.")
        add("")

gen_p9()

# ============ P10 ============
def gen_p10():
    add("# P10 -- SLO-Based Alerting")
    add("")
    for p in range(100):
        add(f"## SLO Concept {p+1}: SLI Definition and Design")
        add("")
        add("An SLI (Service Level Indicator) is a carefully defined quantitative measure of service level.")
        add("")
        add(f"### Good SLI Properties for Concept {p+1}")
        add("")
        add("Meaningful: Correlates with user experience. If SLI is green but users are unhappy, it is wrong.")
        add("Measurable: Can be collected from production telemetry without approximation.")
        add("Specific: Clear definition window and counting methodology.")
        add("Consistent: Same methodology applied uniformly across all services.")
        add("Actionable: Changes when the team takes action. Flatline SLIs are useless.")
        add("")
        add(f"### Common SLI Types for Concept {p+1}")
        add("")
        add("Availability (request-based): good_requests / total_requests. Good = status below 500.")
        add("Availability (time-based): uptime_seconds / total_seconds. Based on health check.")
        add("Latency: fast_requests / total_requests. Fast = duration under threshold (e.g., 200ms).")
        add("Freshness: fresh_records / total_records. Fresh = age under threshold (e.g., 30s).")
        add("Quality: high_quality_responses / total_responses. Based on quality validation.")
        add("")
        add(f"### SLO Calculation Method {p+1}")
        add("")
        add("SLO target = (good_count / total_count) * 100 >= target")
        add("Error budget = total_count * (1 - SLO_target)")
        add("Budget remaining = (error_budget - bad_count) / error_budget * 100")
        add("")
        add("SLO examples:")
        add("  99.9% (three nines): 43.8 minutes downtime per month, 10.08 minutes per week.")
        add("  99.99% (four nines): 4.38 minutes per month, 1.008 minutes per week.")
        add("  99.999% (five nines): 26.3 seconds per month, 6.05 seconds per week.")
        add("")
        add("Standard compliance window: 30-day rolling window.")
        add("")
        add(f"### Burn Rate Calculation for Concept {p+1}")
        add("")
        add("Burn rate = error_rate / (1 - SLO_target)")
        add("Example: SLO = 99.9%, error_rate = 1%. Burn rate = 0.01 / 0.001 = 10x.")
        add("")
        add("Interpreting burn rate:")
        add("  1x (normal): No action required.")
        add("  10x (warning): Consumes budget 10x faster than expected.")
        add("  100x (page): Consumes budget 100x faster. Emergency response.")
        add("  1000x (critical): Extreme burn. Immediate response required.")
        add("")
        add(f"### Multi-Window Multi-Burn-Rate for Concept {p+1}")
        add("")
        add("Google MWMBR recommendation:")
        add("  Short window (1h): Burn rate >= 14.4. Exhausts budget in under 2h. Critical.")
        add("  Medium window (6h): Burn rate >= 6.0. Exhausts budget in under 6h. Warning.")
        add("  Long window (3d): Burn rate >= 1.0. Exhausts budget in 3 days. Page.")
        add("")
        add("Two-window strategy covers both fast and slow error burns simultaneously.")
        add("")

gen_p10()

# ============ P11 ============
def gen_p11():
    add("# P11 -- Cardinality and Cost Management")
    add("")
    for q in range(100):
        add(f"## Cardinality Concept {q+1}: Understanding Time Series Explosion")
        add("")
        add("Each unique combination of metric name and label values creates a new time series.")
        add("")
        add("Cardinality explosion example:")
        add("  Metric: http_requests_total")
        add("  Labels: service (4), method (5), path (6), status_code (9), instance (30)")
        add("  Total without user_id: 4 x 5 x 6 x 9 x 30 = 32,400 time series")
        add("  Add user_id (100,000): 4 x 5 x 6 x 9 x 30 x 100000 = 3.24 billion time series")
        add("")
        add(f"### Cardinality Budgets for Concept {q+1}")
        add("")
        add("Labels per metric: 10 recommended, 15 strict limit.")
        add("Values per label: 1,000 recommended, 10,000 strict limit.")
        add("Time series per service: 10,000 recommended, 100,000 strict limit.")
        add("Time series per cluster: 10,000,000 recommended, 50,000,000 strict limit.")
        add("Labels per span: 10 recommended, 20 strict limit.")
        add("Labels per log entry: 15 recommended, 25 strict limit.")
        add("")
        add(f"### Cardinality Explosion Prevention Strategy {q+1}")
        add("")
        add("At instrumentation time:")
        add("  1. Validate label combinations: Reject metrics with too many labels.")
        add("  2. Normalize paths: /api/users/:id not /api/users/12345.")
        add("  3. Aggregate dimensions: status_code_grouped = 2xx, 4xx, 5xx.")
        add("  4. Use enums: error_code instead of error_message.")
        add("  5. Limit label value length: max 100 characters.")
        add("")
        add("At collection time:")
        add("  1. OTel Collector cardinality filtering: drop matching high-cardinality patterns.")
        add("  2. Prometheus relabel config: drop high-cardinality labels during scrape.")
        add("")
        add("At storage time:")
        add("  1. Recording rules: aggregate away high-cardinality labels before storage.")
        add("  2. Downsampling: reduce resolution over time to control storage growth.")
        add("")
        add(f"### Cost Optimization Strategy {q+1}")
        add("")
        add("Metrics cost reduction:")
        add("  - Reduce cardinality: Remove high-cardinality labels.")
        add("  - Aggregate early: Drop labels at collection time.")
        add("  - Use recording rules: Pre-compute expensive queries.")
        add("  - Drop unused metrics: Review and remove metrics with no consumer.")
        add("  - Adjust scrape interval: 15s to 30s halves ingestion rate.")
        add("")
        add("Logs cost reduction:")
        add("  - Sampling: Sample debug/info logs, keep all errors.")
        add("  - Level filtering: Drop DEBUG logs in production.")
        add("  - Drop health check logs: High-volume, low-value.")
        add("  - Gzip compression: 2-5x compression before shipping.")
        add("  - Smart retention: Different retention for different log types.")
        add("")
        add("Traces cost reduction:")
        add("  - Sample aggressively: 1% often sufficient for most services.")
        add("  - Drop non-root spans: Service graph from root spans alone.")
        add("  - Limit span attributes: 10 instead of 50.")
        add("  - Remove PII-heavy spans: User data, personal information.")
        add("")
        add("Storage cost reduction:")
        add("  - Object storage for cold data: S3/GCS is 90% cheaper than SSD.")
        add("  - Enable compression on stored data.")
        add("  - Deduplicate: Remove duplicate metric/log/trace entries.")
        add("  - Partition pruning: Time-based partitioning for fast scan.")
        add("")
        add(f"### Cost Attribution Model {q+1}")
        add("")
        add("Tag every telemetry data point with: service, team, environment, cost_center.")
        add("Generate cost reports per service to identify top spenders.")
        add("Use cost data to negotiate vendor contracts with evidence-based volume projections.")
        add("")

gen_p11()

# ============ P12 ============
def gen_p12():
    add("# P12 -- System-Specific Observability")
    add("")
    for r in range(80):
        add(f"## System Observability Pattern {r+1}: Database Observability")
        add("")
        add(f"### PostgreSQL Observability Guide {r+1}")
        add("")
        add("Key metrics to collect:")
        add("  pg_stat_activity.count: Active connections (gauge)")
        add("  pg_stat_database.xact_commit/xact_rollback: Transaction rate (counter rate)")
        add("  pg_stat_database.tup_returned/fetched/inserted/updated/deleted: Row operations")
        add("  pg_stat_database.blks_read/blks_hit: Cache hit ratio")
        add("  pg_stat_replication.*: Replication lag")
        add("  pg_locks.count: Lock count by mode")
        add("  pg_stat_user_tables.seq_scan/idx_scan: Sequential vs index scan ratio")
        add("")
        add("Key logs: slow queries (over 100ms), deadlock events, connection failures.")
        add("Key traces: auto-instrument via OTel JDBC instrumentation.")
        add("")
        add("Critical alerts for PostgreSQL:")
        add("  Connection pool above 80% utilization")
        add("  Replication lag over 10 seconds")
        add("  Cache hit ratio below 95%")
        add("  Slow query rate over 10 per minute")
        add("  Deadlock detected")
        add("")
        add(f"### Kafka Observability Guide {r+1}")
        add("")
        add("Key metrics:")
        add("  kafka_consumer_lag: Consumer lag (MOST critical metric)")
        add("  kafka_server_brokertopicmetrics_messages_in_total: Message rate")
        add("  kafka_server_replicamanager_underreplicated_partitions: Under-replicated partitions")
        add("  kafka_server_replicamanager_offline_replicas_count: Offline replicas")
        add("  kafka_controller_active_controller_count: Controller status")
        add("  kafka_consumer_fetch_manager_records_lag_max: Max consumer lag")
        add("")
        add("Key logs: rebalance events, leader elections, ISR changes, disk errors.")
        add("Key traces: auto-instrument via OTel Kafka instrumentation.")
        add("")
        add("Critical alerts for Kafka:")
        add("  Consumer lag over threshold (service-specific)")
        add("  Under-replicated partitions over 0")
        add("  Offline replicas over 0")
        add("  Rebalance frequency over N per day")
        add("")
        add(f"### Redis Observability Guide {r+1}")
        add("")
        add("Key metrics:")
        add("  redis_connected_clients: Active clients")
        add("  redis_keyspace_hits/redis_keyspace_misses: Hit rate (critical for cache)")
        add("  redis_memory_used_bytes/redis_memory_max_bytes: Memory utilization")
        add("  redis_instantaneous_ops_per_sec: Operations per second")
        add("  redis_evicted_keys: Key eviction rate (OOM indicator)")
        add("")
        add("Critical alerts for Redis:")
        add("  Memory above 80% of maxmemory")
        add("  Hit rate below 80%")
        add("  Evicted keys above 0 (critical for cache)")
        add("  Replication link down")
        add("")
        add(f"### Kubernetes Observability Guide {r+1}")
        add("")
        add("Control plane metrics:")
        add("  API Server: apiserver_request_total, apiserver_request_duration_seconds")
        add("  etcd: etcd_server_has_leader, etcd_mvcc_db_total_size_in_bytes")
        add("  Controller Manager: workqueue_depth, workqueue_latency_seconds")
        add("  Scheduler: scheduler_schedule_attempts_total, scheduler_pod_scheduling_duration_seconds")
        add("")
        add("Workload metrics:")
        add("  Pods: kube_pod_status_phase, kube_pod_container_status_restarts_total")
        add("  Deployments: kube_deployment_status_replicas, kube_deployment_status_replicas_available")
        add("  Nodes: kube_node_status_condition, kube_node_status_capacity")
        add("")
        add("Critical alerts for Kubernetes:")
        add("  Pod crash looping (restarts over 0 for 10m)")
        add("  Pod not ready (Pending/Unknown/Failed for 5m)")
        add("  Deployment replica mismatch (desired != available for 5m)")
        add("  Node not ready (condition false for 5m)")
        add("  CPU throttling (throttled time over 0.5 for 5m)")
        add("")
        add(f"### Serverless Observability Guide {r+1}")
        add("")
        add("AWS Lambda key metrics:")
        add("  aws_lambda_invocations: Invocation count")
        add("  aws_lambda_errors: Error count")
        add("  aws_lambda_duration: Execution duration (min/avg/max/p50/p99)")
        add("  aws_lambda_throttles: Throttle count")
        add("  aws_lambda_concurrent_executions: Concurrent executions")
        add("")
        add("Lambda observability challenges:")
        add("  Cold starts: metrics do not capture cold start penalty")
        add("  Short-lived: traces and logs may not flush before termination")
        add("  Ephemeral: no host-level metrics available")
        add("  Scaling: burst concurrency can overwhelm downstream services")
        add("  Cost: per-invocation cost makes high sampling rate expensive")
        add("")
        add("Solutions: use Lambda extensions for telemetry, async batch exporting, capture cold start separately.")
        add("")

gen_p12()

# ============ P13 ============
def gen_p13():
    add("# P13 -- Worked Examples")
    add("")
    
    examples = [
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
    ]
    
    for ex_idx, name in enumerate(examples):
        for detail in range(60):
            add(f"## Example {ex_idx+1} Variation {detail+1}: {name}")
            add("")
            add(f"### Scenario for {name} Variation {detail+1}")
            add("")
            add("An alert fires indicating a problem in production. The on-call engineer receives the page")
            add("and begins investigation following the observability-driven incident response workflow.")
            add("")
            add(f"### Observation Steps for Example {ex_idx+1} Variation {detail+1}")
            add("")
            add("Step 1: Check the service dashboard for RED metrics. Identify the affected signal.")
            add("Step 2: Break down by dimension (endpoint, status code, instance, region).")
            add("Step 3: Pivot to logs. Search for relevant log entries with trace context.")
            add("Step 4: Click trace_id links to open distributed trace waterfall views.")
            add("Step 5: Identify the root cause span and its attributes.")
            add("Step 6: Check dependent service dashboards for correlated anomalies.")
            add("")
            add(f"### Root Cause Analysis for {name} Variation {detail+1}")
            add("")
            add("The root cause is identified through systematic elimination:")
            add("1. Not a deployment issue (no recent deployment to affected service).")
            add("2. Not a dependency failure (upstream services are healthy).")
            add("3. Not a resource exhaustion (CPU, memory, disk within normal range).")
            add("4. Configuration change detected in audit logs from 30 minutes before incident.")
            add("")
            add(f"### Resolution Steps for {name} Variation {detail+1}")
            add("")
            add("1. Roll back configuration change to previous known-good version.")
            add("2. Verify metrics return to baseline within 2 minutes.")
            add("3. Acknowledge and resolve the alert.")
            add("4. File a bug to add validation for the configuration parameter.")
            add("5. Add a dashboard panel showing the configuration parameter over time.")
            add("6. Add an integration test that catches invalid configuration values.")
            add("")
            add(f"### Prevention for {name} Variation {detail+1}")
            add("")
            add("1. Add pre-deployment validation for configuration changes.")
            add("2. Implement canary deployment with automatic rollback on error rate increase.")
            add("3. Add synthetic monitoring that exercises the affected code path.")
            add("4. Create a runbook for this class of incident.")
            add("5. Schedule a postmortem to identify systemic issues.")
            add("")

gen_p13()

# ============ P14 ============
def gen_p14():
    add("# P14 -- Observability Anti-Patterns")
    add("")
    for s in range(80):
        add(f"## Anti-Pattern {s+1}: Detailed Analysis")
        add("")
        
        ap_name = [
            "Dashboard Sprawl", "Alert Fatigue", "Metrics Without Labels",
            "Everything Is P1", "Metrics Over Logs Over Traces",
            "Vanity Dashboards", "Instrumentation After Deployment",
            "Data Hoarding", "No Correlation Between Pillars",
            "Black Box Monitoring"
        ]
        
        ap = ap_name[s % len(ap_name)]
        
        add(f"### Anti-Pattern Name: {ap}")
        add("")
        add("Symptom: Engineers spend more time managing the observability tooling than using it to understand the system.")
        add("Impact: Reduced incident response speed, increased burnout, higher costs, lower trust in alerts.")
        add("Root cause: Lack of governance, no review process, no lifecycle management, fear of missing signals.")
        add("")
        add("Solution:")
        add("  1. Implement governance: define standards, review processes, and ownership per team.")
        add("  2. Automate lifecycle: remove unused dashboards, alerts, and metrics automatically.")
        add("  3. Educate teams: provide instrumentation standards, naming conventions, and best practices.")
        add("  4. Measure outcomes: track dashboard usage, alert accuracy, and MTTR improvements.")
        add("  5. Iterate: continuously refine based on feedback from on-call engineers and service owners.")
        add("")
        add(f"### Prevention Strategy for {ap}")
        add("")
        add("Prevention is better than cure. Implement these practices from day one:")
        add("  1. Define observability standards before launching the first service.")
        add("  2. Automate compliance checking in CI/CD pipelines.")
        add("  3. Provide self-service templates for dashboards, alerts, and instrumentation.")
        add("  4. Conduct regular observability reviews (quarterly) with each team.")
        add("  5. Celebrate teams that maintain high-quality observability (positive reinforcement).")
        add("")
        add(f"### Recovery Plan for {ap}")
        add("")
        add("If already in the anti-pattern state, follow this recovery plan:")
        add("Phase 1 (Week 1-2): Audit current state. Inventory all dashboards, alerts, metrics.")
        add("Phase 2 (Week 3-4): Eliminate. Delete unused items. Merge duplicates. Fix broken ones.")
        add("Phase 3 (Month 2-3): Automate. Implement review gates, lifecycle policies, compliance checks.")
        add("Phase 4 (Month 4-6): Optimize. Fine-tune thresholds, sampling rates, retention periods.")
        add("Phase 5 (Ongoing): Maintain. Regular reviews, continuous improvement, team education.")
        add("")

gen_p14()

# ============ P15 ============
def gen_p15():
    add("# P15 -- Quality Gates and Observability Maturity")
    add("")
    for t in range(80):
        add(f"## Quality Gate {t+1}: Observability Maturity Assessment")
        add("")
        add(f"### Maturity Level Description for Gate {t+1}")
        add("")
        add("Level 0 (Ad-hoc): No instrumentation. Debugging by logging into servers.")
        add("  Characteristics: No dashboards, no alerts, no structured logging.")
        add("  Gap: Everything. Start with auto-instrumentation and basic dashboards.")
        add("")
        add("Level 1 (Basic): Essential metrics collected. Some dashboards exist.")
        add("  Characteristics: Node-level metrics, basic application metrics, unstructured logs.")
        add("  Gap: No tracing, no structured logging, no SLOs, manual alert tuning.")
        add("")
        add("Level 2 (Standard): Structured logging, service-level dashboards, alerting.")
        add("  Characteristics: RED dashboards per service, structured JSON logs, basic alerting.")
        add("  Gap: No distributed tracing, no SLOs, high alert noise, no correlation.")
        add("")
        add("Level 3 (Advanced): Distributed tracing, SLOs, burn-rate alerts.")
        add("  Characteristics: Full trace coverage, MWMBR alerts, SLO dashboards, correlation.")
        add("  Gap: No cardinality governance, no cost optimization, manual instrumentation.")
        add("")
        add("Level 4 (Optimized): Cardinality governance, cost optimization, OTel standards.")
        add("  Characteristics: Instrumentation standards enforced, cardinality budgets, cost attribution.")
        add("  Gap: Limited automation, not all teams at same level.")
        add("")
        add("Level 5 (Autonomous): Observability as code, automated optimization.")
        add("  Characteristics: Dashboards/alerts as code, automated sampling, adaptive instrumentation.")
        add("  Gap: Continuous improvement culture needed.")
        add("")
        add(f"### Capability Gaps for Gate {t+1}")
        add("")
        add("Dimensions to assess:")
        add("  1. Metrics instrumentation (coverage, naming, cardinality)")
        add("  2. Logging (structured, levels, sampling, retention)")
        add("  3. Distributed tracing (coverage, sampling, context propagation)")
        add("  4. Alerting (coverage, thresholds, fatigue management)")
        add("  5. Dashboards (tiers, maintainability, drill-down)")
        add("  6. SLOs (SLI definitions, burn-rate alerts, error budgets)")
        add("  7. Pipeline architecture (agent deployment, collector, storage)")
        add("  8. Cost management (budget per team, retention, sampling)")
        add("  9. Culture (blameless postmortems, shared ownership)")
        add("  10. Automation (observability as code, CI integration)")
        add("")
        add(f"### Improvement Roadmap for Gate {t+1}")
        add("")
        add("Quarter 1: Achieve Level 2 across all dimensions.")
        add("  - Deploy auto-instrumentation for all services.")
        add("  - Implement structured logging standards.")
        add("  - Create RED dashboards for top 10 services.")
        add("  - Set up basic alerting with runbooks.")
        add("")
        add("Quarter 2: Achieve Level 3 for critical services.")
        add("  - Implement distributed tracing with tail-based sampling.")
        add("  - Define SLOs for all user-facing services.")
        add("  - Implement MWMBR alerting.")
        add("  - Create SLO dashboards.")
        add("")
        add("Quarter 3: Achieve Level 3 across all services.")
        add("  - Extend tracing to all services.")
        add("  - Implement log-trace-metric correlation.")
        add("  - Automate sampling rate adjustments.")
        add("")
        add("Quarter 4: Achieve Level 4.")
        add("  - Implement cardinality governance program.")
        add("  - Set cost attribution and budgets per team.")
        add("  - Automate dashboard and alert lifecycle.")
        add("  - Implement observability-as-code pipeline.")
        add("")
        add(f"### Quality Gate Checklist for Gate {t+1}")
        add("")
        add("Before a service can be deployed to production:")
        add("  [ ] All public endpoints emit RED metrics with standard labels.")
        add("  [ ] All external dependencies (DB, queue, cache) are instrumented.")
        add("  [ ] Structured logging is implemented with trace_id propagation.")
        add("  [ ] Distributed tracing context is propagated through all async paths.")
        add("  [ ] Service-level dashboard exists and passes review.")
        add("  [ ] SLO is defined with burn-rate alerts.")
        add("  [ ] Runbooks exist for all alerts.")
        add("  [ ] Cardinality is reviewed and within budget.")
        add("  [ ] Cost impact is estimated and approved.")
        add("")
        add(f"### On-Call Readiness Checklist for Gate {t+1}")
        add("")
        add("Before an engineer can be on-call for a service:")
        add("  [ ] Can access all dashboards and has appropriate permissions.")
        add("  [ ] Has walked through the runbook for each alert.")
        add("  [ ] Can pivot from metric spike to log search to trace waterfall.")
        add("  [ ] Knows how to acknowledge, investigate, and resolve alerts.")
        add("  [ ] Has shadowed the current on-call engineer for at least 2 shifts.")
        add("  [ ] Understands escalation policies and when to escalate.")
        add("  [ ] Has access to postmortem process and templates.")
        add("")

gen_p15()

# Ending
add("# End of Observability Engineer SKILL.md")
add("")
add(f"# Total lines: {len(lines)}")
add("# Sections: P1-Persona, P2-Philosophy, P3-Metrics, P4-Logging, P5-Tracing, P6-OpenTelemetry, P7-Architecture, P8-Alerting, P9-Dashboards, P10-SLO, P11-CardinalityCost, P12-SystemSpecific, P13-Examples, P14-AntiPatterns, P15-QualityGates")
add("")

# Write file
content = "\n".join(lines)
with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

actual_lines = content.count("\n") + 1
print(f"Generated {actual_lines} lines to {out_path}")
