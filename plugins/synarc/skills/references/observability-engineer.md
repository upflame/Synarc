---
title: "Observability Engineer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - observability-engineer
  - opentelemetry
  - metrics
  - logging
  - tracing
  - alerting
  - dashboards
  - prometheus
  - grafana
  - cardinality-management
---

# Purpose

Design, implement, and maintain the systems that provide deep visibility into production software behavior. Build the nervous system of the engineering organization — data pipelines and tooling that let every engineer understand what their code is doing in production.

# Scope

Metrics instrumentation (Prometheus/OpenMetrics), structured logging, distributed tracing (OpenTelemetry), dashboard design (Grafana), alerting architecture (Alertmanager/MQL), SLO-based alerting, cardinality management, cost optimization of telemetry pipeline, observability as code, telemetry pipeline architecture. Does not cover SLO/SLI framework design (SRE-engineer) or on-call incident management (SRE-engineer).

# Inputs

Application architecture, traffic patterns, deployment frequency, existing monitoring gaps, incident debugging data, cost data per telemetry source.

# Output

Instrumentation standards, telemetry pipeline configs, dashboards, alert rules, SLI measurement definitions, cardinality governance, cost-optimized telemetry storage.

## 1. The Three Pillars

**Metrics** (what is happening): numeric aggregations, cheap to store, fast to query, support alerting. Limited dimensionality. **Logs** (what exactly happened): discrete structured events, rich detail, expensive at scale. **Traces** (where did time go / what failed): end-to-end request lifecycles across services, high cardinality, requires sampling.

Correlation is essential: every metric spike should be investigable through correlated logs and traces. Every log entry carries trace context.

## 2. Instrumentation Philosophy

### Code vs Platform

Both. Platform instrumentation (service mesh, eBPF, agents) for coverage — every service gets RED metrics. Code instrumentation for depth — critical paths get custom dimensions, business metrics, detailed tracing.

### Dimensional vs Hierarchical

Dimensional observability (modern): each telemetry point carries arbitrary key-value dimensions. Instrument once with rich context, slice later. Requires high-cardinality backend support.

### Open Standards

Prefer OpenTelemetry, Prometheus exposition format, OpenMetrics over vendor-specific protocols. Instrument once with open standards, choose best backend per workload.

## 3. Metrics

### Metric Types

**Counter**: monotonically increasing (requests_total, errors_total). Use `rate()` for per-second rate. **Gauge**: up and down (memory_bytes, queue_depth). **Histogram**: sampled observations in configurable buckets. Compute percentiles with `histogram_quantile()`. **Summary**: client-side pre-computed quantiles (not aggregatable across instances).

### Naming Conventions

Snake case, include unit suffix: `_total` (counter), `_bytes`, `_seconds`, `_count`/`_sum`/`_bucket` (histogram). Namespaced: `namespace_subsystem_name_unit`.

### Label Best Practices

Bounded label values — never user_id, request_id, trace_id as labels (cardinality explosion). Stable label set over time. Common: service, method, endpoint, status_code, version, environment, region.

### Histogram Bucket Configuration

10-15 buckets. More at low end (precision for SLIs), fewer at high end. Default Prometheus buckets for latency: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10] seconds.

## 4. Logging

Structured JSON — every entry machine-parsable. Required fields: `@timestamp`, `level`, `service.name`, `trace.id`, `message`, `error.stack` (if error). Levels: DEBUG, INFO, WARN, ERROR, FATAL.

NEVER log: passwords, tokens, API keys, PII, payment card data, session tokens. Retention: 30 days hot (indexed), 1 year warm (object store), 7 years cold (archive). Collection via fluentbit/vector/OTel Collector → Loki/ELK/CloudWatch.

## 5. Distributed Tracing

OpenTelemetry standard. Every request gets `trace_id` in headers (W3C Trace Context). Span per service call with: service.name, operation, duration, status.code, parent.span_id.

### Sampling Strategies

**Head-based**: consistent rate (e.g., 5% of traffic) — simple, but misses rare errors. **Tail-based**: 100% of errors + slow traces, sampled success traces — better for debugging, higher cost. Accept that unsampled raw traces cannot be stored indefinitely. Preserve interesting traces (errors, high latency, rare paths).

## 6. Telemetry Pipeline Architecture

**Agent** (on-node): fluentbit/OTel Collector, buffers and forwards, never blocks application. **Gateway** (cluster): receives from agents, enriches, filters, routes. **Backend**: Prometheus (metrics), Grafana Loki (logs), Tempo/Jaeger (traces), or cloud managed (Datadog, Grafana Cloud, Honeycomb).

Pipeline SLA: data loss < 0.1%, latency < 30s, uptime > 99.9%. Monitor the monitors — pipeline itself emits telemetry.

## 7. Alerting

### Alert Fatigue Prevention

Every alert must justify existence. If not actionable in 30 days, delete. If fires > 1/week, tune. If requires manual check before action, fix. Target SNR > 0.5.

### Burn Rate Alerting (MQL)

Fast burn (rate >= 14 for 5min) + slow burn (rate >= 2.5 for 30min). Both must fire to page. Single window alerts are noisy.

### Alert Routing

Route by severity, service, environment. PagerDuty for P0/P1, Slack for P2, ticket for P3. Every alert must have a runbook.

## 8. Dashboards

**Service dashboard** (per-service): RED metrics, deployment markers, dependency health, P99 latency. **Infrastructure dashboard** (per-cluster): node health, pod lifecycle, resource utilization. **Business dashboard**: revenue, users, conversion, correlated with deployments.

Principle: answer questions within 5 seconds. Top row = health (green/yellow/red), middle = detailed metrics, bottom = logs and traces.

Dashboards are starting points, not destinations. Teach engineers ad-hoc querying for debugging.

## 9. Observability Maturity

**L1**: up/down checks, CPU/memory alerts, no tracing. **L2**: HTTP RED metrics, structured logs, basic tracing. **L3**: OpenTelemetry org-wide, consistent RED, traces with head sampling, cardinality management. **L4**: automated MQL alerts, dynamic dashboards, data-driven remediation. **L5**: ML-based anomaly detection, semi-automated RCA, observability as code with CI/CD validation.

## 10. Cardinality Management

Unbounded label values are the #1 cause of observability cost explosions. Rules: every label must have bounded values (< 1000 distinct values), validate label cardinality in CI/CD, aggregate high-cardinality dimensions at the edge, drop before expensive storage.

Collect everything at edge, aggregate aggressively before storage, sample intelligently, retain raw short-term + summaries long-term. Every telemetry dimension must justify its cost.

## 11. RED / USE / Golden Signals

**RED** (Rate, Errors, Duration) for every service. **USE** (Utilization, Saturation, Errors) for every resource. **Golden Signals** (Latency, Traffic, Errors, Saturation) for distributed system health. These are entry points for debugging, not conclusions — supported by rich instrumentation for root cause analysis.

Every new service must emit RED metrics, structured logs, and a `/health` endpoint. Every external dependency must be instrumented (latency, error rate, throughput). Every deployment creates an observability checkpoint (before/after metrics comparison).
