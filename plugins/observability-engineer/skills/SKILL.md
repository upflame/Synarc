---
id: synarc-observability-engineer
name: Observability Engineer
version: 1.0.0
description: Comprehensive observability engineering skill covering metrics, logs, traces, OpenTelemetry, alerting, dashboards, SLOs, cardinality management, cost optimization, and system-specific observability patterns.
author: Synarc
tags:
  - observability
  - opentelemetry
  - metrics
  - logging
  - tracing
  - alerting
  - dashboards
  - slo
  - prometheus
  - grafana
  - elk
  - datadog
  - honeycomb
prerequisites:
  - basic-monitoring
  - linux-fundamentals
  - networking-basics
levels:
  - practitioner
  - senior
  - principal


## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Error received → lookup pattern, propose fix immediately
- File named → load file, offer action suggestions
- Exception thrown → analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in ≤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

---

# Observability Engineering

## P1 — Persona: The Observability Engineer

### 1.1 Role Definition

The Observability Engineer is a specialized infrastructure reliability practitioner responsible for designing, implementing, and maintaining the systems that provide deep visibility into production software behavior. Unlike traditional monitoring roles that focus on checking whether something is up or down, the Observability Engineer builds systems that answer unknown-unknown questions about complex distributed systems.

### 1.2 Core Responsibilities

Design and operate observability pipelines that collect, process, store, and analyze telemetry data (metrics, logs, traces) from hundreds to thousands of services. Define instrumentation standards and ensure consistent adoption across engineering organizations. Build alerting systems that surface actionable signals while minimizing noise. Design dashboards that enable rapid debugging and capacity planning. Manage the cost and cardinality of observability data. Partner with SRE, platform engineering, and product development teams to embed observability into the software development lifecycle.

### 1.3 Key Skills

Deep understanding of distributed systems architecture and failure modes. Proficiency with observability platforms including Prometheus, Grafana, OpenTelemetry, Elasticsearch, Loki, Tempo, Datadog, Honeycomb, and New Relic. Strong programming skills in Go, Python, or Java for building instrumentation libraries and operators. Statistical literacy for understanding distributions, percentiles, and burn rates. Systems thinking for designing holistic observability strategies. Communication skills for driving organizational change around instrumentation culture.

### 1.4 Daily Activities

Review alert fatigue metrics and tune alert thresholds. Design and review new metric definitions for upcoming features. Debug production incidents by correlating metrics, logs, and traces. Write and review OpenTelemetry instrumentation code. Analyze cardinality explosion incidents and implement remediation. Consult with service teams on dashboard design. Evaluate new observability tools and vendors. Automate observability configuration through code (observability as code). Participate in incident response as the observability subject matter expert.

### 1.5 Senior vs Principal Observability Engineer

A Senior Observability Engineer implements and operates observability solutions effectively within their domain, designs dashboards for their team's services, and tunes alerts for known failure modes. A Principal Observability Engineer defines organizational standards for instrumentation, designs the multi-cluster observability architecture, builds internal tools and abstractions, drives vendor selection and cost optimization at scale, and mentors the broader engineering organization on observability best practices.

### 1.6 Mindset Shifts from Traditional Monitoring

Traditional monitoring asks "is the service up?" Observability asks "what is the service doing?" Traditional monitoring relies on known failure modes and static thresholds. Observability empowers exploration of unknown failure modes through high-cardinality data and ad-hoc querying. Traditional monitoring uses dashboards as static views. Observability uses dashboards as starting points for debugging journeys. Traditional monitoring measures resource utilization. Observability measures user experience and business impact. Traditional monitoring is owned by operations teams. Observability is a shared responsibility across all engineering teams.

### 1.7 Observability Maturity Model

Level 1 — Black Box Monitoring: Services have basic up/down checks and CPU/memory alerts. Dashboards show only infrastructure metrics. Logs are collected but rarely queried. Tracing does not exist. Alert toil is high. Level 2 — Basic Instrumentation: Services export HTTP request rates, error rates, and latency metrics. Structured logging is adopted. Trace sampling begins. Basic SLOs are defined for critical services. Dashboards follow USE and RED methodologies. Level 3 — Standardized Observability: Organization-wide instrumentation standards exist. OpenTelemetry is adopted as the unified instrumentation framework. All services export consistent RED metrics. Distributed tracing is enabled with head-based sampling. Logs are correlated with traces. Cardinality management practices are in place. Level 4 — Proactive Observability: Automated SLO-based alerting with multi-window multi-burn-rate alerts. Dashboards are dynamically generated from service catalogs. Observability data drives automated remediation. Cost optimization is ongoing. High-cardinality querying is a first-class capability. Level 5 — Predictive Observability: Anomaly detection and ML-based alerting reduce manual threshold tuning. Observability data feeds capacity planning and cost forecasting. Root cause analysis is semi-automated. Observability as code is fully adopted with CI/CD validation of instrumentation quality.

### 1.8 The Observability Engineer in Incidents

During incident response, the Observability Engineer is not fixing the bug — they are enabling others to find the bug faster. They build and maintain the "observability bridge" that connects raw telemetry to actionable insights. They ensure that during an incident, engineers can navigate from a high-level dashboard alert down to the specific trace and log lines that reveal root cause. They ask: "If this service fails at 3 AM, will the on-call engineer have the data they need to diagnose the issue in under five minutes?"

### 1.9 Organizational Influence

The Observability Engineer must be a teacher and advocate. They create instrumentation guides and run workshops. They establish review gates for new services that require RED metrics, structured logging, and basic tracing before production traffic is accepted. They build internal tools that make good observability practices easy and default. They measure success not by uptime, but by mean-time-to-acknowledge (MTTA), mean-time-to-resolve (MTTR), and developer satisfaction with observability tooling.

### 1.10 Key Metrics for Observability Itself

Observability of observability — the Observability Engineer must monitor their own systems. Key metrics include: telemetry ingestion rate (samples/second), end-to-end telemetry latency (time from instrumentation to queryable), cardinality per metric, storage cost per service, alert precision and recall, dashboard usage frequency, query performance percentiles, and observability pipeline error rates. Degradation in any of these metrics directly impacts the organization's ability to operate production systems.

### 1.11 The Three Pillars Philosophy

The three pillars — metrics, logs, and traces — are not independent silos. They are complementary lenses into system behavior. Metrics tell you something is wrong. Logs tell you what is wrong. Traces tell you where it is wrong. The Observability Engineer's primary job is to make these three lenses work together seamlessly. Every metric spike should be investigable through correlated logs and traces. Every trace should link to relevant logs. Every log entry should carry trace context. This correlation is the essence of observability.

### 1.12 High-Cardinality Observability

Modern observability, as popularized by Honeycomb, embraces high-cardinality data — user IDs, request IDs, shard IDs, feature flags, A/B test variants, and any other dimension that helps slice and dice telemetry. The Observability Engineer designs instrumentation that captures rich dimensional data, not just aggregate counters. They build systems that allow ad-hoc grouping, filtering, and aggregation without pre-defined dashboards. This shifts the debugging workflow from "I need to predict what might go wrong and build a dashboard for it" to "I need to explore what is happening right now by any dimension that seems relevant."

### 1.13 Telemetry Pipeline Ownership

The Observability Engineer owns the telemetry pipeline end-to-end: from instrumentation in application code, through the OpenTelemetry Collector or agent, to the backend storage and query layer, to dashboards and alerts. They ensure the pipeline is resilient (telemetry should not crash applications), scalable (handle peak traffic without backpressure), and cost-effective (drop or sample low-value data before it reaches expensive storage).

### 1.14 Collaboration with SRE

While SRE focuses on service reliability objectives, error budgets, and incident management, the Observability Engineer builds the instrumentation and tooling that makes SRE work possible. The SRE defines SLOs; the Observability Engineer builds the burn-rate alerts and SLO dashboards. The SRE runs the incident; the Observability Engineer ensures the right data is available. The SRE enforces error budget policy; the Observability Engineer provides the accurate data on which that policy is based.

### 1.15 The Observability Engineer as Platform Builder

Rather than configuring observability one service at a time, the Observability Engineer builds platforms and abstractions. They create service meshes that auto-instrument traffic. They build agent operators that deploy and configure collectors across Kubernetes clusters. They write libraries that export consistent metrics from common frameworks. They design dashboards that auto-populate from service registry metadata. They create CI/CD gates that validate instrumentation coverage before deployment. This platform approach is the only way to achieve observability at scale.

### 1.16 Career Growth Path

Junior monitoring roles to Mid-level observability engineer (owns instrumentation for 5-10 services) to Senior observability engineer (designs org-wide standards, owns the pipeline) to Principal observability engineer (drives strategy, builds platforms, influences vendor ecosystem) to Distinguished engineer (shapes the industry through open-source contributions and thought leadership). Each level involves increasing scope of influence, from individual services to the entire engineering organization to the broader industry.

### 1.17 The Observability Engineer's Toolbox

Core tools: Prometheus (metrics collection and alerting), Grafana (dashboards and visualization), OpenTelemetry (instrumentation framework), Elasticsearch/Loki (log storage and query), Jaeger/Tempo (trace storage and query), Alertmanager (alert routing and deduplication). Optional tools based on scale and budget: Datadog (SaaS all-in-one), Honeycomb (high-cardinality tracing), New Relic (full-stack SaaS), Splunk (enterprise logging), M3/VictoriaMetrics/Cortex/Thanos (metrics at scale), Grafana Cloud (managed observability). Supporting tools: Kubernetes, service meshes (Istio, Linkerd), Kafka (telemetry transport), Terraform/Pulumi (infrastructure as code), CI/CD systems (instrumentation validation).

### 1.18 Technical Depth Areas

The Observability Engineer must develop deep expertise in: time-series database internals (compression, downsampling, retention), distributed systems concepts (consistency, partitioning, failure modes), sampling theory (head-based, tail-based, probabilistic), statistical concepts (percentiles, histograms, distributions, burn rate), networking (protocols, latency, packet loss), storage systems (query patterns, I/O patterns, caching), and container orchestration (Kubernetes, service discovery, auto-scaling).

### 1.19 Communication Patterns

The Observability Engineer translates between technical and business domains. They explain to engineering leadership why investing in instrumentation reduces MTTR. They explain to product teams what customer experience metrics matter. They explain to security teams how observability data can support audit and compliance requirements. They write documentation and run training sessions. They create RFCs for new observability initiatives. They present post-incident analyses that highlight observability gaps and improvement opportunities.

### 1.20 On-Call Expectations

The Observability Engineer may serve as secondary on-call for observability platform issues, but their primary value is not during incidents — it is in the proactive work that makes incidents less painful. They build the systems that allow other engineers to successfully be on-call. Their goal is to make observability so reliable and intuitive that engineers can diagnose production issues without needing an observability expert on the call. This is the ultimate measure of success: the observability system is self-service, and the expert is unnecessary for routine debugging.

### 1.21 Ethical Considerations

Observability data is powerful but dangerous. The Observability Engineer must advocate for privacy by design: never log PII, credit card numbers, passwords, or personal health information. Implement data redaction and masking in the pipeline. Enforce retention policies aligned with compliance requirements (GDPR, SOC2, HIPAA). Design access controls that allow debugging access without exposing sensitive data. Build audit trails for telemetry access. Remember that the same traces and logs that help debug production issues can also be used to surveil individual users or employees. Draw clear ethical boundaries.

### 1.22 The Observability Manifesto

Instrument everything, but deliberately. Prefer standard semantics (RED, USE) over custom metrics. Correlate pillars through trace context. Make data explorable, not just dashboarded. Tune for signal, not volume. Automate instrumentation; never manually instrument each service. Validate observability in CI/CD. Treat observability as a product: understand your users (developers), measure their satisfaction, and continuously improve. Share ownership of observability with all engineering teams — do not be a bottleneck. Recognize that perfect observability is impossible; prioritize pragmatically based on business value and risk.

### 1.23 Bibliography and Influences

This skill synthesizes ideas from: Google SRE books, the Honeycomb observability philosophy (Charity Majors, Liz Fong-Jones), the RED method (Tom Wilkie), the USE method (Brendan Gregg), The Art of Monitoring (James Turnbull), O'Reilly's Distributed Systems Observability, the OpenTelemetry specification, Prometheus documentation, Grafana Labs best practices, the Site Reliability Engineering community, and years of production experience across hundreds of services.

### 1.24 Persona Summary

The Observability Engineer is equal parts architect, platform engineer, data engineer, and educator. They build the nervous system of the engineering organization — the data pipelines and tooling that let every engineer understand what their code is doing in production. They operate at the intersection of infrastructure, data, and developer experience. They succeed when the engineers they support can quickly and independently answer any question about their systems' behavior in production.

### 1.25 Quick Reference: Questions the Observability Engineer Answers

What is the request rate, error rate, and latency for every service? What are the dependencies between services? What was the exact state of every service during the incident window? Is the observability pipeline itself healthy? Are we collecting too much data (cost) or too little (blind spots)? Are alerts precise (few false positives) and sensitive (few false negatives)? Are dashboards useful (used during incidents) or decorative (never looked at)? Are SLO burn rates accurate and timely? Can we debug a single failing request across its entire lifecycle? Are teams following instrumentation standards consistently?

### 1.26 Observability Engineer vs Monitoring Engineer

A Monitoring Engineer configures monitoring tools according to vendor documentation and known best practices. They set up CPU alerts, disk space checks, and basic HTTP health checks. They respond to pages and escalate. An Observability Engineer designs observability strategy, builds custom instrumentation, manages telemetry pipelines at scale, drives adoption of standards, controls costs, and enables developer self-service. Monitoring is a subset of observability; the Observability Engineer must be expert in monitoring but go far beyond it.

### 1.27 Observability Engineer vs SRE

SRE focuses on reliability through error budgets, toil reduction, and automation. Observability Engineering focuses on the data and tooling that enable reliability work. SREs are the primary users of observability systems; Observability Engineers are the builders of those systems. In small organizations, one person may fill both roles. In large organizations, these are distinct disciplines that collaborate closely.

### 1.28 Observability Engineer vs Data Engineer

Data Engineers build pipelines for business analytics and reporting. Observability Engineers build pipelines for operational telemetry. The skills overlap (streaming data, storage, querying), but the requirements differ: observability pipelines must handle higher cardinality, lower latency, and more variable data schemas. Observability data is immediately valuable during incidents; business analytics data supports longer-term decision making. The Observability Engineer should leverage data engineering patterns (Kafka, stream processing) but must prioritize operational requirements over analytical completeness.

### 1.29 Persona Mindset: First Principles

When faced with a new system to make observable, the Observability Engineer asks: What are the user-facing behaviors of this system? What internal state changes are interesting? What failure modes are possible? What data would I need to debug a failure in 10 minutes? What data would I need to debug a failure in 10 seconds? How can I instrument this system without changing its behavior? How can I expose this data in a way that is consistent with other systems? How can I ensure this instrumentation is maintained as the system evolves?

### 1.30 Closing: The Observability Engineer's Motto

"Make the invisible visible. Make the visible understandable. Make the understandable actionable."


## P2 — Philosophy

### 2.1 Why Philosophy Matters

Observability philosophy provides the conceptual framework that guides every technical decision. Without philosophy, observability implementations degenerate into collections of random dashboards, noisy alerts, and unmanageable telemetry volume. Philosophy answers: What should we instrument? How should we store it? Who should see it? When is it good enough? Why are we collecting this data at all? The Observability Engineer must articulate and defend their philosophical approach.

### 2.2 Philosophical Foundation: The Three Pillars

Metrics are numeric aggregations over time. They answer "what is happening?" Metrics are cheap to store, fast to query, and support powerful aggregation and alerting. Their weakness is limited dimensionality — a metric is an aggregate, and aggregates hide details. Logs are discrete events with rich structure. They answer "what exactly happened?" Logs are more expensive than metrics but support detailed forensic analysis. Their weakness is volume — at scale, storing and querying every log event becomes prohibitively expensive. Traces represent end-to-end request lifecycles across distributed services. They answer "where did time go and what failed?" Traces connect the story across service boundaries. Their weakness is cardinality and sampling — the full trace data is too voluminous to capture for every request.

### 2.3 Beyond Three Pillars: Events

Some practitioners argue for a fourth pillar: events. Events are high-cardinality, structured records that combine aspects of logs and traces. Honeycomb's approach is event-based: every event carries arbitrary dimensions, and the backend is optimized for slicing and dicing events by any dimension. In this philosophy, metrics are pre-computed aggregations of events, logs are a subset of events (without trace context), and traces are a subset of events (linked by trace ID). The unifying event model is philosophically clean but requires backend support for high-cardinality ingestion and querying.

### 2.4 Dimensional vs Hierarchical Observability

Hierarchical observability (traditional) organizes telemetry into fixed hierarchies: host to service to endpoint. Dimensions are limited and pre-defined. Dashboards must predict every slicing need. Dimensional observability (modern) allows any telemetry point to carry arbitrary key-value dimensions. You instrument once with rich context and slice later as needed. Dimensional observability is philosophically superior for debugging because it does not require predicting what dimensions will be important during an incident. However, dimensional observability requires backend support for high-cardinality indexing and imposes higher storage costs.

### 2.5 Instrumentation Philosophy: Code vs Platform

Code instrumentation embeds telemetry collection in application code using SDKs and manual instrumentation. It provides rich, semantically meaningful data because developers understand the business logic. Platform instrumentation (service mesh, eBPF, agent-based) captures telemetry without application changes. It provides comprehensive coverage with zero developer effort but limited semantic richness. The correct philosophical approach is both: use platform instrumentation for coverage (every service gets basic RED metrics), and code instrumentation for depth (critical paths get custom dimensions, business metrics, and detailed tracing).

### 2.6 Debugging Philosophy: Known vs Unknown Unknowns

Traditional monitoring is optimized for known unknowns — you know what might go wrong (high CPU, disk full) and you monitor for it. Observability is optimized for unknown unknowns — you cannot predict what will cause the next outage, so you collect rich data that can be queried in arbitrary ways after the fact. This philosophical difference drives different architectural decisions: traditional monitoring pre-aggregates and alerts; observability stores rich data and enables exploration.

### 2.7 The Debugging Workflow

When an alert fires, the debugging workflow is: 1) Confirm the alert is real (avoid false positives). 2) Scope the blast radius: which services, which users, which regions? 3) Correlate: what changed? (deploy, config change, traffic shift). 4) Dive: from high-level metric to specific trace to relevant log line. 5) Identify root cause. 6) Verify fix. Each step requires different data and different tools. The observability system must support smooth transitions between steps without context-switching overhead.

### 2.8 Observability as a Product

Treat the observability system as a product for developers. Define user personas (on-call engineer, developer debugging a feature, platform engineer capacity planning). Understand their workflows and pain points. Measure adoption, satisfaction, and effectiveness. Prioritize features based on developer impact. Invest in documentation, onboarding, and support. This philosophy prevents observability from becoming a neglected utility or a bottleneck.

### 2.9 Observability as Code

Define dashboards, alerts, recording rules, and SLOs in version-controlled configuration files. Apply them through CI/CD pipelines. Validate changes with automated tests (syntax checks, dry runs, integration tests). This philosophy brings software engineering rigor to observability configuration: code review, version history, rollback, testing. It prevents the "snowflake" problem where dashboards and alerts are manually configured and cannot be reproduced.

### 2.10 Cost-Conscious Observability

Observability data grows exponentially with service count and cardinality. Storage costs can dominate infrastructure budgets. The philosophical approach: collect everything at the edge, aggregate aggressively before storage, sample intelligently, retain raw data short-term and summaries long-term, delete data that has no demonstrated value. Every telemetry dimension must justify its existence. Every log line that is never queried is waste. This philosophy must be balanced against the debugging value of rich data.

### 2.11 The Signal vs Noise Tradeoff

Every telemetry collection decision is a tradeoff between signal (useful, actionable data) and noise (data that consumes resources but provides no value). Noise includes: overly verbose debug logs, metrics that are never queried or alerted on, traces of health check endpoints, duplicate telemetry from redundant instrumentation. The philosophical principle: instrument with intent. Every metric, log, and trace should answer a specific question or support a specific debugging scenario. If it does not have a clear consumer, do not collect it.

### 2.12 Privacy and Security Philosophy

Observability data contains sensitive information. Logs may contain user data, API keys, or business logic details. Traces reveal service topology and data flow patterns. The philosophical approach: minimize sensitive data at the source (instrumentation libraries redact or hash sensitive fields), filter and scrub in the pipeline (collector processors), enforce access controls at the storage layer, audit access, and retain data only as long as required for operational needs. Privacy is not optional — it is a core requirement.

### 2.13 Consistent Semantics Philosophy

All services should export telemetry with consistent naming conventions, label schemas, and metric types. Standard semantics include: RED (Rate, Errors, Duration) for request-based services, USE (Utilization, Saturation, Errors) for resources, and Application KPI metrics for business-critical paths. Consistent semantics enable: cross-service dashboards, correlation during incidents, automated SLO computation, and shared alert templates. Without consistent semantics, every service is an island, and debugging cross-service issues becomes impossible.

### 2.14 Open Standards Philosophy

Prefer open standards (OpenTelemetry, Prometheus exposition format, OpenMetrics, OpenTracing) over vendor-specific protocols. Open standards prevent vendor lock-in, enable tool interoperability, and leverage community knowledge. The philosophical principle: instrument once with open standards, choose the best backend for each workload, and retain the flexibility to switch backends without re-instrumenting. OpenTelemetry is the embodiment of this philosophy — a single, vendor-neutral instrumentation framework.

### 2.15 Telemetry Pipeline as an Internal Product

The telemetry pipeline — from application instrumentation to backend storage — is itself an internal product. It must be: reliable (data is not lost), performant (data is available within seconds), scalable (handles peak traffic), observable (the pipeline itself emits telemetry), and cost-effective. The pipeline should have SLAs: data loss rate under 0.1%, data latency under 30 seconds, uptime over 99.9%. Pipeline failures should page the observability team just like application failures page application teams.

### 2.16 Everything Fails Philosophy

Instrumentation itself can fail: collectors crash, backends overload, network partitions occur, SDK bugs corrupt data, sampling drops critical traces, metric names collide. The philosophical approach: assume failure at every stage. Build redundancy, graceful degradation, and circuit breakers into the pipeline. Never let telemetry collection crash the application (fail-close is better than fail-open for instrumentation). Verify telemetry delivery end-to-end. Monitor the monitors.

### 2.17 Observability Drives Culture

The existence of good observability changes how teams operate. When engineers can see the real-time impact of their code in production, they deploy with more confidence, debug faster, and build more resilient systems. When teams have good dashboards, they have better conversations about capacity, performance, and reliability. When teams have accurate SLO data, they make better prioritization decisions. Observability is not just a technical system — it is a cultural enabler that shapes how the organization thinks about production.

### 2.18 Testing Observability

Observability systems must be tested. Test that metrics are emitted with correct names and labels. Test that log messages are structured correctly. Test that trace context propagates across service boundaries. Test that dashboards render correctly. Test that alerts fire when conditions are met and do not fire when conditions are not met. Test that SLO burn rates are computed accurately. Test the telemetry pipeline under load. Testing observability requires dedicated test infrastructure (test applications, synthetic traffic generators, alert testing tools).

### 2.19 Minimal Viable Observability

Start with minimal viable observability and expand based on demonstrated need. The minimum: every service exports RED metrics (request rate, error rate, latency distribution). Every service writes structured logs with request IDs. Critical services have basic distributed tracing. All services have at least one dashboard showing RED metrics over time. Critical services have SLO-based burn rate alerts. From this baseline, add instrumentation based on incidents: every time an incident is hard to debug, that is a signal to add more instrumentation. This pragmatic approach avoids over-instrumentation while ensuring continuous improvement.

### 2.20 The Curse of the Dashboard

Dashboards are seductive — they provide immediate visual gratification and the feeling of control. But dashboards have a dark side: they are static representations that go stale quickly, they encourage passive monitoring rather than active exploration, they reinforce known failure modes while hiding unknown ones, and they consume engineering time to build and maintain. The philosophical approach: dashboards are starting points, not destinations. Build dashboards for specific use cases (capacity review, on-call overview, service health), but teach engineers to use ad-hoc querying and exploration tools for debugging.

### 2.21 The Sampling Paradox

Sampling is necessary for trace storage at scale, but sampling destroys the ability to debug rare events. If you sample 1% of traces, you will miss 99% of failures that affect individual users. The philosophical resolution: use intelligent sampling strategies that preserve interesting traces (errors, high latency, rare paths), and maintain the ability to temporarily increase sampling for specific services during debugging. Accept that raw, unsampled trace data is too expensive to store indefinitely, and plan sampling strategies accordingly.

### 2.22 Alert Fatigue: The Silent Killer

Alert fatigue is the numbing of response to alerts due to excessive false positives. It is the single most destructive force in observability because it undermines trust in the entire system. The philosophical principle: every alert must justify its existence by a demonstrated track record of catching real, actionable issues. If an alert has not fired a useful page in the last 30 days, delete it. If an alert fires more than once a week on average, tune it. If an alert requires a manual check before action (is this real?), fix it. Alert fatigue is not acceptable — it is a systemic failure.

### 2.23 Trace-Driven Development

Instrumentation should be designed and tested before, or concurrent with, the code that generates interesting behavior. This is trace-driven development: write the traces you want to see (service boundaries, key operations, error paths), then implement the instrumentation alongside the application code. This ensures that observability is not an afterthought but a first-class concern. It also reduces the risk of launching systems without adequate debugging capabilities.

### 2.24 Holistic Observability

Do not treat metrics, logs, and traces as separate systems with separate UIs and separate query languages. The philosophical ideal is a single pane of glass where you can navigate from a high-level metric to the specific trace to the relevant logs without leaving the tool or re-entering query parameters. This integration is the hardest part of observability engineering because it requires tight coupling between what are often three separate backend systems. Tools like Grafana (with Tempo and Loki integration) or Honeycomb (unified events) approach this ideal.

### 2.25 Observability for Whom?

Different stakeholders need different views. Developers need fine-grained, high-cardinality data for debugging their specific service. On-call engineers need aggregated views that span services and show health status. Engineering managers need trend views that show reliability improvements over time. Executives need business-level views (revenue impact, customer satisfaction, team velocity). A complete observability philosophy serves all these stakeholders with appropriate interfaces and access controls, from the most detailed trace to the most summarized executive KPI.

### 2.26 The End of Monitoring as We Know It

Traditional monitoring was designed for static infrastructure with predictable failure modes. Modern observability was designed for dynamic, distributed, ephemeral infrastructure where failure modes are constantly evolving. The philosophical shift is from "is it up?" to "what is it doing?" — from checking conditions to asking questions. This shift requires new tools (high-cardinality databases), new practices (exploratory debugging), and new cultural norms (shared ownership of instrumentation). Organizations that miss this shift will find their monitoring increasingly inadequate as their systems become more complex.

### 2.27 Instrumentation as Documentation

Well-instrumented code is self-documenting. The metrics and traces exported by a service describe its behaviors, dependencies, and performance characteristics. A new team member can understand a service's role and behavior by exploring its telemetry. This philosophical approach elevates instrumentation from an operational concern to a software quality practice. Instrumentation should be treated with the same care as documentation — reviewed, tested, and kept current as the code evolves.

### 2.28 Observability Debt

Observability debt is the accumulated gap between the observability your systems need and the observability they have. It grows when teams ship features without instrumentation, when instrumentation is not maintained as code changes, when dashboards go stale, when alerts are not tuned, and when SLOs are not updated. Observability debt must be tracked, prioritized, and paid down just like technical debt. Each incident that was hard to debug because of poor observability is a data point for where debt exists.

### 2.29 The Golden Signal Problem

Google SRE popularized the four golden signals: latency, traffic, errors, and saturation. These are high-level indicators of service health. The philosophical insight: golden signals tell you something is wrong, but they do not tell you what is wrong. They are the entry point for debugging, not the conclusion. Golden signals must be supported by richer instrumentation (detailed traces, structured logs, high-cardinality metrics) that enable root cause analysis. Never stop at golden signals — they are the beginning, not the end.

### 2.30 Observability and Chaos Engineering

Chaos engineering intentionally injects failures to test system resilience. Observability provides the measurement capability that makes chaos engineering meaningful. Without good observability, chaos experiments cannot measure their impact, and the results of experiments cannot be properly debugged. The philosophical synergy: chaos engineering generates faults, observability measures the impact. Together, they build confidence in system reliability. Every chaos experiment should be designed with specific observability instrumentation to measure its effects.

### 2.31 The Principle of Least Privilege for Telemetry

Collect the minimum data required to achieve observability goals. Do not collect data just in case. Each additional metric, log field, or trace dimension has a cost: storage, processing, query latency, complexity. The principle of least privilege for telemetry: collect only what is needed, retain only as long as needed, and secure it so only authorized consumers can access it.

### 2.32 Metrics Are Summaries, Not Truth

A counter increment of 1 at 10:00:00 UTC means at least one event occurred at that timestamp. It does not mean exactly one event occurred at that precise time, because counters may be batched, retried, or resampled. A histogram shows a distribution of values, but the choice of buckets determines what you can and cannot see. Metrics are summaries — useful, powerful summaries — but they are not ground truth. Logs and traces are closer to ground truth but are more expensive. Choose the right tool for each question.

### 2.33 Philosophical Summary

Observability philosophy is not academic abstraction — it is the practical framework that guides every decision from "what SDK should we use?" to "how long should we retain this data?" to "should we page someone about this?" The Observability Engineer who understands philosophy builds systems that are coherent, maintainable, and effective. The Engineer who treats observability as a collection of vendor tools and dashboard templates builds systems that are fragile, expensive, and ultimately unhelpful during the moments that matter most.

### 2.34 Quick Reference: Philosophical Questions

Should we instrument this in code or with a service mesh? — Both, for different purposes. Should we sample traces? — Yes, but preserve interesting ones. How many labels should this metric have? — As few as needed, as many as necessary. Should we store all logs? — No, aggregate or sample low-value logs. How long should we retain raw data? — Long enough to cover the longest debugging window (typically 7-30 days). Should we use vendor A or B? — Use open standards first, choose vendors for specific needs. Should we build or buy? — Build differentiation, buy commodity.

### 2.35 The Future of Observability Philosophy

The industry is moving toward: unified telemetry (not three pillars but one event model), eBPF-based instrumentation (zero-code observability), AI-assisted debugging (anomaly detection, root cause suggestion), and open standards (OpenTelemetry as the universal instrumentation layer). The Observability Engineer must stay current with these trends while maintaining pragmatic focus on what works today. The philosophy remains constant: provide engineers with the data they need to understand and debug their systems, regardless of the specific tools used.


## P3 — Metrics

### 3.1 Introduction to Metrics

Metrics are numeric measurements collected over time. They are the backbone of monitoring and alerting because they are cheap to collect, efficient to store, fast to query, and naturally support aggregation and threshold-based alerting. A metric is typically a time series — a sequence of (timestamp, value) pairs identified by a metric name and a set of labels (dimensions).

### 3.2 Metric Types

The four core metric types defined by OpenMetrics and Prometheus exposition format: Counter, Gauge, Histogram, and Summary. Each type has distinct semantics and appropriate use cases.

### 3.3 Counters

A Counter is a monotonically increasing value that only ever increases (or resets to zero on process restart). Counters measure cumulative counts: requests served, errors occurred, bytes processed, tasks completed. Counters support rate calculation (requests per second) by computing the difference between two counter values divided by the time interval. Use counters for anything that counts events. Never use a counter for values that can decrease (memory usage, queue depth, temperature). The rate of a counter is usually more useful than its absolute value.

### 3.4 Counter Implementation Details

Counters must be monotonically increasing. If your application restarts, the counter resets to zero, and the monitoring system must handle resets gracefully (Prometheus does this automatically via rate()). Counters should be flushed periodically (every scrape interval). Counters initialized to zero are valid — if a counter exists but has never been incremented, it means zero events have occurred. Counter increments should be atomic to prevent lost updates in concurrent code. Batch increment operations where possible to reduce overhead.

### 3.5 Counter Use Cases

Request count (http_requests_total), error count (http_errors_total), bytes served (http_response_size_bytes_total), task completions (jobs_completed_total), cache hits/misses (cache_hits_total, cache_misses_total), database queries (db_queries_total), messages produced/consumed (messages_produced_total), login attempts (login_attempts_total), payment transactions (payments_total). Each counter should carry relevant labels: method, endpoint, status_code, error_type, and so on.

### 3.6 Counter vs Rate

rate(http_requests_total[5m]) computes the average per-second request rate over the last 5 minutes. irate(http_requests_total[5m]) computes the instantaneous rate based on the last two data points. Rate smooths out spikes; irate is more sensitive. Use rate for alerting (which benefits from smoothing) and irate for dashboards (which benefit from responsiveness). Always use rate() or irate() when querying counters — the raw counter value is rarely useful without a time dimension.

### 3.7 Gauges

A Gauge is a value that can go up or down arbitrarily. Gauges measure instantaneous values: memory usage, CPU temperature, queue depth, number of active connections, goroutine count, disk space, fan speed. Gauges snapshot the current state at each collection interval. Do not compute rate() on a gauge — it produces meaningless results. Instead, use gauge for values that represent a level or state.

### 3.8 Gauge Use Cases

Memory usage (process_memory_bytes), CPU utilization (process_cpu_percent), active connections (connections_active), queue depth (queue_depth), goroutine count (go_goroutines), disk usage (disk_used_bytes, disk_free_bytes), pool sizes (connection_pool_size), temperature (server_temperature_celsius), battery level (battery_percent), concurrent requests (http_requests_in_flight). For queue depths and pool sizes, gauges enable saturation monitoring — how full is the resource?

### 3.9 Gauge Aggregation

When aggregating gauges across instances, the appropriate aggregation depends on the question: max (peak value across instances), min (lowest value), avg (typical value), or sum (total value across all instances). For utilization metrics, avg or max is typically correct. For capacity planning, max is useful (what is the peak load?). For cost calculations, sum is appropriate (total resource usage across all instances). Document the expected aggregation for each gauge to avoid confusion.

### 3.10 Histograms

A Histogram samples observations (usually request latencies or response sizes) and counts them in configurable buckets. Histograms also provide an optional count of observations and sum of all observed values. Histograms enable computation of percentiles (p50, p95, p99, p999) and distribution analysis. The quality of percentile estimation depends on bucket configuration. Histograms are more expensive than counters and gauges because they maintain multiple time series (one per bucket plus count plus sum).

### 3.11 Histogram Bucket Configuration

Bucket boundaries must be configured to capture the distribution of values you care about. For HTTP request latency in milliseconds: buckets might be [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]. The lowest bucket should be below the typical value; the highest bucket should be above the maximum expected value. Buckets are cumulative by convention — a request that takes 300ms falls into buckets 1, 5, 10, 25, 50, 100, 250, 500. This allows computing the count of requests in any bucket range by subtraction.

### 3.12 Histogram Bucket Guidelines

Use more buckets at the low end (where precision matters for SLIs) and fewer at the high end (where order-of-magnitude is sufficient). Aim for 10-15 buckets per histogram. Default buckets from Prometheus client libraries: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10] seconds — suitable for many server-side applications. Customize buckets for your specific workload. If p99 latency is 200ms and p999 latency is 2s, ensure you have buckets at 100ms, 250ms, 500ms, 1s, and 2.5s for good p99 and p999 estimation.

### 3.13 Histogram Percentile Computation

histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) computes the 99th percentile request duration over the last 5 minutes. The function interpolates within the bucket containing the quantile. histogram_quantile works on the rate of bucket counters over a time range. Always use rate() on histogram buckets before computing quantiles. Multiple quantiles can be computed from the same histogram: p50, p90, p95, p99, p999 all from one instrument.

### 3.14 Histogram Limitations

Percentile accuracy depends on bucket granularity. Wide buckets produce coarse estimations. The upper and lower bounds of the histogram limit what percentiles can be meaningfully computed — if p999 falls in the last bucket, you only know it is greater than the last bucket boundary. Histograms cannot be accurately merged across instances because the underlying distribution is lost. For exact percentiles, use summaries with tradeoffs.

### 3.15 Summaries

A Summary is similar to a histogram but computes quantiles on the client side (in the application) rather than the server side (in the query engine). Summaries expose pre-computed quantiles (p50, p90, p99) directly as metric values. This avoids the bucket configuration problem but has significant limitations: quantiles cannot be aggregated across instances (the summary's quantiles are local to each process), and different summary implementations use different algorithms (no standard precision).

### 3.16 Histogram vs Summary

Use histograms when you need aggregatable quantiles across multiple instances (the standard case). Use summaries when you cannot configure buckets in advance because the value range is unknown, or when you need exact quantiles rather than estimations. In practice, histograms are preferred in the vast majority of cases. Summaries are legacy from before histograms were widely supported.

### 3.17 Metric Naming Conventions

Follow Prometheus naming conventions: metric names use snake_case, include the unit (if applicable), and use suffixes to indicate type: _total for counters, _bytes for byte measurements, _seconds for time measurements, _count for observation counts in histograms, _sum for sum of observed values in histograms, _bucket for histogram bucket counters, _info for information metrics (constant metadata).

### 3.18 Metric Name Structure

Use namespaced names: namespace_subsystem_name_unit. Examples: kafka_topic_partition_count (namespace: kafka, subsystem: topic, name: partition, no unit). python_gc_objects_collected_total (namespace: python, subsystem: gc, name: objects_collected, unit: total for counter). http_requests_duration_seconds (namespace: http, subsystem: requests, name: duration, unit: seconds). Consistent naming enables automation: alert templates, dashboard generation, SLO computation.

### 3.19 Label Conventions

Labels add dimensionality to metrics. Use labels for dimensions you will query, aggregate, or alert on. Common labels: service, method, endpoint, status_code, version, deployment_environment, region, host, error_type. Label values should be bounded — unbounded label values (user_id, request_id, trace_id) explode cardinality. Keep the set of labels on a metric stable over time — adding labels changes the metric's identity and breaks alerts and dashboards.

### 3.20 Label Best Practices

Include the minimum set of labels needed for your queries. Each label multiplies cardinality. Prefer legal values (status_code, method) over arbitrary values (user_id). Use enumerated values where possible (response_kind: success or error or redirect). Document label schemas per metric. Use the same label names across metrics for consistency (always service, never app_name or application). Do not put variable values like timestamps, random IDs, or process IDs in labels.

### 3.21 Target Labels vs Metric Labels

Target labels are attached to the scraped target (the Prometheus scrape config applies them). They identify the source of the metrics: instance, job, datacenter, cluster. Metric labels are attached to individual metrics by instrumentation. The line between them is blurry and configuration-dependent. A rule of thumb: target labels describe where the metric came from; metric labels describe what the metric is about. Target labels are added by the collector; metric labels are added by the instrumenting code.

### 3.22 Exemplars

Exemplars associate a metric with a specific trace. They answer: "for this histogram bucket, here is a real trace that fell into this bucket." Exemplars bridge metrics and traces: from a latency spike in a histogram, you can jump to a specific trace that experienced that latency. Exemplars are a powerful debugging feature but increase storage cost (each exemplar stores trace_id and span_id). Configure exemplar sampling: store one exemplar per scraped metric per time series.

### 3.23 Exemplar Configuration

Exemplars must be enabled at both the instrumentation layer (client library must attach exemplars) and the storage layer (backend must store and serve exemplars). Prometheus, Grafana, and most OTel backends support exemplars. The scrape interval affects exemplar density — longer intervals gather more exemplars per series. Configure exemplars specifically: only attach exemplars to latency histograms (where they are most useful), not to counters or gauges (where they add noise).

### 3.24 Metric Expiration and Staleness

Metrics that stop being emitted become stale. Prometheus marks a time series as stale after a configurable time (default 5 minutes). Stale series are hidden from queries after 5 minutes and cleaned up after 5 days. This automatic cleanup prevents accumulation of dead series from ephemeral instances. When designing instrumentation, ensure metrics are continuously emitted (not just on change) to avoid false staleness.

### 3.25 Recording Rules

Recording rules pre-compute frequently used or expensive-to-compute expressions. They run on the Prometheus server (or compatible system) and store results as new time series. Use recording rules for: rate of counters (pre-compute common rates), aggregations across services (total error rate across all frontends), percentile computations (pre-compute p99 latency), and SLO burn rate calculations. Recording rules reduce query load and make dashboards faster.

### 3.26 Recording Rule Example

Rule: record: "job:http_requests:rate5m", expr: "rate(http_requests_total[5m])". This pre-computes the average request rate over 5 minutes for every unique set of labels. Dashboard queries then reference the recording rule instead of computing rate on the fly. Recording rules should have a naming convention indicating their source and aggregation: level:metric:operation.

### 3.27 Recording Rule Best Practices

Name recording rules clearly: level:metric:operation (e.g., instance:http_requests:rate5m, service:http_requests:sum_rate5m). Document the expression and purpose. Avoid creating recording rules for expressions that are rarely queried (the storage cost outweighs the query speed benefit). Review recording rules periodically and remove unused ones. Be aware of evaluation interval: recording rules evaluate on a schedule (default 1 minute), so there is always slight staleness compared to direct queries.

### 3.28 Aggregation in Metrics

Aggregation collapses time series by removing labels. sum(http_requests_total) removes all labels and sums all series. sum by (service) (http_requests_total) removes all labels except service and sums within each service value. sum by (service, status_code) (http_requests_total) keeps two labels. Aggregation reduces cardinality for cross-cutting views but loses detail. Choose aggregation levels based on the question: "total system load" needs no labels; "load per service" needs service; "load per service per endpoint" needs service and endpoint.

### 3.29 Topk and Bottomk

topk(5, rate(http_requests_total[5m])) returns the 5 time series with the highest request rate. bottomk(5, ...) returns the lowest. These functions are useful for finding hotspots and outliers. Combine with aggregation: topk(10, sum by (service) (rate(http_requests_total[5m]))) finds the top 10 services by request rate. Topk queries can be expensive on high-cardinality metrics — use recording rules if queried frequently.

### 3.30 Rate vs Increase

rate(http_requests_total[5m]) returns per-second average. increase(http_requests_total[5m]) returns the total increase over 5 minutes. Choose rate for most purposes (it is unit-aware and consistent across scrape intervals). Choose increase when you need to know "how many requests happened in the last 5 minutes" for business reporting. increase is just rate multiplied by time_range.

### 3.31 Delta vs Rate

delta(cpu_temp_celsius[5m]) returns the change in a gauge over 5 minutes. Use delta for gauges where the change over time is meaningful (temperature increase rate, memory leak detection). Do not use delta on counters — use rate() instead. Delta on a counter gives meaningless results because counter values are monotonically increasing.

### 3.32 Predict Linear

predict_linear(disk_free_bytes[1h], 86400) predicts the value of a gauge in 86400 seconds (24 hours) based on linear regression over the last hour. Useful for capacity forecasting: "when will we run out of disk space?" Used in predictive alerts: "disk will fill up in 24 hours at current rate." Linear extrapolation is simplistic — actual usage patterns may differ — but it is a useful heuristic. Combine with holt_winters for seasonal data.

### 3.33 Holt Winters

holtwinters(requests_per_second[7d], 0.1, 0.2, 0.3) applies Holt-Winters seasonal smoothing to predict future values based on historical patterns with daily seasonality. Useful for traffic patterns with strong daily/weekly cycles. More accurate than predict_linear for seasonal data. Requires at least two full seasons of historical data to initialize. Not available in all backends.

### 3.34 Rate of Change (Deriv)

deriv(disk_usage_bytes[1h]) returns the per-second derivative of a gauge (rate of change). Similar to delta divided by time. Useful for detecting trends: "the disk is filling up at 1 MB/minute." Deriv works on gauges; rate() works on counters. Use deriv for early warning systems that detect acceleration of resource consumption.

### 3.35 Absent and Absent Over Time

absent(metric_name) returns 1 if the metric has no data at the current time, and nothing otherwise. Useful for "no data" alerts: if a service stops emitting metrics, alert. absent_over_time(metric_name[5m]) returns 1 if no data was received in the last 5 minutes. Better than absent() for alerting because it handles the scrape schedule: absent() triggers on each evaluation where the metric is not currently present, which creates flapping for scraped metrics.

### 3.36 Metric Collection Mechanisms

Pull model: Prometheus scrapes targets at configured intervals. Targets expose metrics via HTTP endpoints (/metrics). Pull model simplifies target discovery (service discovery identifies what to scrape) and reduces configuration. Push model: applications push metrics to a gateway (Prometheus Pushgateway, Graphite, statsd). Push model is necessary for batch jobs that terminate before they can be scraped, and for fire-and-forget workloads. Prefer pull for long-running services; use push only when pull is infeasible.

### 3.37 Scrape Configuration

scrape_interval (how often Prometheus scrapes), scrape_timeout (max time for a scrape to complete), metrics_path (usually /metrics), scheme (http or https), and service discovery configuration (kubernetes_sd_configs, consul_sd_configs, ec2_sd_configs, file_sd_configs). Relabeling configs allow modification of labels before ingestion: target labels (double-underscore-meta labels from service discovery) can be mapped to final labels. Honor labels to control label collision behavior.

### 3.38 Relabeling

Relabeling transforms labels during scraping. Common uses: drop specific targets (drop health check endpoints), rename labels (map double-underscore-meta_kubernetes_pod_label_app to service), add labels (add environment label based on cluster), drop labels (remove instance label to reduce cardinality). Relabeling is powerful but complex — relabeling mistakes can silently drop all metrics from a target. Test relabeling rules thoroughly.

### 3.39 Relabeling Actions

replace: replace label value using regex (most common). keep: only keep targets matching regex. drop: drop targets matching regex. hashmod: hash label value and take modulo (used for sharding). labelmap: map labels matching regex to new names. labeldrop: drop labels matching regex. labelkeep: keep only labels matching regex. Each action supports source_labels, separator, regex, target_label, and replacement.

### 3.40 Multiplexing and Federation

Federation allows Prometheus servers to scrape selected time series from other Prometheus servers. Use federation for hierarchical setups: global Prometheus scrapes aggregated data from regional Prometheus servers. Federation is not a scalability solution — each Prometheus has limits on series count and scrape load. Use federation carefully and consider Thanos or Cortex for multi-cluster aggregation.

### 3.41 Service Discovery

Prometheus supports multiple service discovery mechanisms. Kubernetes SD: discovers pods, services, endpoints, nodes, ingresses based on label selectors and annotations. Consul SD: discovers services registered with Consul. EC2 SD: discovers EC2 instances by region, tags, filters. File SD: watches a JSON/YAML file for target changes (useful for custom integrations). Azure, GCP, DigitalOcean, OpenStack SD also available. Choose service discovery based on your infrastructure platform.

### 3.42 Kubernetes Service Discovery

Prometheus-operator and kube-prometheus-stack automate monitoring setup on Kubernetes. Annotation-based discovery: pods with prometheus.io/scrape: "true" annotation are automatically discovered. Pod annotations also specify port (prometheus.io/port) and path (prometheus.io/path). This approach requires minimal configuration per service. For advanced setups, use PodMonitor and ServiceMonitor CRDs from the prometheus-operator.

### 3.43 PodMonitor and ServiceMonitor

PodMonitor selects pods by label selector and configures scrape parameters (interval, port, path, relabelings). ServiceMonitor selects services rather than pods. Both are Kubernetes custom resources managed by the prometheus-operator. Advantages: declarative configuration, gitops-friendly, automatic scrape target generation. Use ServiceMonitor for services proxied through a Service; use PodMonitor for direct pod scraping (e.g., sidecar-based exporters).

### 3.44 Probes

Blackbox exporter probes external endpoints from the Prometheus server's perspective. Use for: external URL health checks, HTTPS certificate expiry monitoring, ICMP ping monitoring, TCP port checks, DNS resolution checks. Blackbox exporter is configured with probe modules, each defining the probe type, ports, expected response, and TLS settings. Probes are scraped by Prometheus with special parameters: module, target.

### 3.45 Blackbox Exporter Configuration

Modules define probe types: http_2xx (HTTP check expecting 200), tcp_connect (TCP connectivity check), icmp (ICMP echo check), dns (DNS resolution check), grpc (gRPC health check). Each module configures timeout, body matching, header validation, TLS configuration, IP protocol (ip4, ip6, prefer_ip4). Use HTTP module for most external service checks. Use TCP for simple port availability. Use ICMP for network reachability.

### 3.46 Blackbox Exporter in Practice

Scrape blackbox exporter with target parameter: http://blackbox-exporter:9115/probe?target=example.com and module=http_2xx. The blackbox exporter probes the target and returns metrics. Use probe_success\{target=\"example.com\"\} for up/down. Use probe_duration_seconds for latency. Use probe_http_status_code for response code. Alert on probe_success == 0. Use a separate blackbox exporter per region or availability zone to detect regional issues.

### 3.47 Application-Level Exporters

Many applications have Prometheus exporters: node_exporter (system metrics), cadvisor (container metrics), kube-state-metrics (Kubernetes object metrics), postgres_exporter (PostgreSQL), mysql_exporter (MySQL), redis_exporter (Redis), elasticsearch_exporter (Elasticsearch), kafka_exporter (Kafka), nginx_exporter (Nginx), haproxy_exporter (HAProxy). These exporters translate application-specific metrics into Prometheus format. They should be deployed alongside the applications they monitor.

### 3.48 Custom Exporters

Build custom exporters for applications that do not have existing exporter support. Typically in Go or Python, exposing /metrics endpoint. Structure: collect application metrics (via API, log parsing, database queries), format as Prometheus metrics (counter, gauge, histogram), expose via HTTP. Prometheus client libraries handle metrics registry, exposition format, and HTTP server. Write test suites for custom exporters to validate metric output.

### 3.49 Metrics Stability and Versioning

Prometheus recommends a breaking change policy for metrics: metric names and label names should be stable across releases. Renaming a metric or adding/removing labels breaks dashboards, alerts, and recording rules. Use metric name suffixes (_v2, _beta) for breaking changes. Maintain backward compatibility during deprecation periods. Document metrics in a METRICS.md file or use _info metrics for metadata.

### 3.50 Info Metrics

_info metrics provide metadata about a target or service. They are gauges with constant value 1, carrying descriptive labels. Example: build_info\{branch=\"main\", revision=\"abc123\", version=\"1.2.3\", goversion=\"go1.21\"\} 1. Info metrics enable queries like: sum by (version) (build_info) to see which versions of a service are running. Use info metrics for any metadata that should be queryable but is not a measurement.

### 3.51 Metrics Collection for Batch Jobs

Batch jobs (cron jobs, data processing tasks) do not run long enough to be scraped. Use Prometheus Pushgateway: the batch job pushes metrics to the Pushgateway, which exposes them for scraping. The Pushgateway aggregates by job name and instance. Monitor Pushgateway carefully — it becomes a single point of failure and can accumulate stale metrics from dead jobs. Clean up stale Pushgateway entries using time-based retention or job-side deletion.

### 3.52 Pushgateway Risks

The Pushgateway never expires metrics — if a job stops pushing, the last push lives forever. This causes false "service healthy" signals. Mitigations: use time-based metric expiration in Pushgateway (--metric.timetolife), or configure Prometheus to check absent_over_time on push-based metrics. Prefer job-specific Pushgateway instances over shared instances (reduces blast radius).

### 3.53 Collector-Level Aggregation

Metrics can be aggregated at the collector level (e.g., OpenTelemetry Collector, Prometheus Agent, statsd). Collector-level aggregation reduces cardinality and volume before sending to the backend. This is useful when the backend has cardinality-based pricing or limited storage. Collector-level aggregation trades query flexibility for cost. Use when cost is a primary concern and you can define aggregation rules in advance.

### 3.54 Downsampling and Rollups

Raw metrics are stored at full resolution (scrape interval). After a retention period, raw data is downsampled to lower resolution. Prometheus stores raw data for the time specified in --storage.tsdb.retention.time (default 15d) and compacts older blocks. Downsampling retains the ability to query historical data at reduced precision. Configure retention based on debugging needs: 30 days raw for recent debugging, 1 year downsampled for trend analysis, indefinite for SLO compliance reporting.

### 3.55 Metrics Cost Management

Cost of metrics = number of time series multiplied by storage per series multiplied by retention. Each unique combination of metric name and label values creates a time series. A histogram with 15 buckets creates 17 time series (15 buckets + count + sum). Multiply by number of instances. A service with 100 instances, 20 endpoints, 3 methods, 5 status codes, and 15-bucket latency histogram creates 100 times 20 times 3 times 5 times 17 = 510,000 time series. Control cardinality aggressively.

### 3.56 Metrics Lifecycle

Define to Instrument to Validate to Deploy to Monitor to Retire. Each metric should have a defined owner, purpose, and expected lifespan. Metrics without owners accumulate and cost money. Retirement: when a metric is no longer useful, remove instrumentation from code and let the series expire (do not keep emitting dead metrics). Use annotation gauges (_info metrics) to document metric ownership and purpose.

### 3.57 Metrics Debugging

When a metric looks wrong: check if the metric is being emitted (access the /metrics endpoint directly), check label values (unexpected labels create unexpected series), check the client library version (bugs in older versions), check for conflicts (two libraries registering the same metric name), check scrape configuration (is the target being scraped?), check relabeling rules (are labels being dropped or modified?).

### 3.58 Exemplars in Practice

Exemplars connect metrics to traces. Configure exemplars: in Prometheus client (attach trace_id, span_id to histogram observations), in Prometheus scrape config (exemplar_storage_enabled: true), in storage (--storage.tsdb.exemplar.max-series, --storage.tsdb.exemplar.max-label). Grafana can use exemplars to show related traces in the Explore view. Exemplars are most valuable for latency histograms: "this p99 spike is caused by the slow trace shown here."

### 3.59 Metrics in CI/CD

Validate metric output in CI: spin up application, scrape /metrics, parse metric output, assert expected metrics exist with expected types and labels. This catches instrumentation bugs before deployment. Use promtool for Prometheus configuration validation: promtool check config, promtool test rules. Automate recording rule and alert rule testing with promtool's unit test framework.

### 3.60 Promtool for Metrics

promtool check config /path/to/prometheus.yml validates configuration syntax. promtool check rules /path/to/rules.yml validates rule syntax. promtool test rules /path/to/test.yml runs unit tests against alert and recording rules. promtool tsdb analyze /path/to/tsdb analyzes TSDB contents (series cardinality, label cardinality). promtool tsdb list /path/to/tsdb lists blocks. These tools should be part of the CI pipeline for observability configuration.

### 3.61 Metric Label Hygiene

Underscores in label values are safe. Hyphens are allowed but may require escaping in some query languages. Spaces must be quoted. CamelCase is non-standard. Use lowercase snake_case for label values. Avoid label values that contain quote characters, newlines, or non-printable characters. Be consistent: if you use error_type, always use error_type, never errorType or ErrorType across your entire organization.

### 3.62 Common Metric Mistakes

Using a gauge to count events (should be counter). Using a counter for instantaneous value (should be gauge). Including unbounded labels (user ID, email, session ID). Not documenting metric semantics. Adding labels that are constant across all values. Using histograms with default buckets when the value range is very different from defaults. Using summary when histogram is appropriate. Not initializing counters to zero (missing series when no events have occurred).

### 3.63 Advanced: Cumulative vs Delta Histograms

Prometheus histograms are cumulative: each bucket counts all observations less than or equal to the bucket boundary. Delta histograms (used in OTel) count observations within each bucket range (non-cumulative). The difference matters for backend handling. Cumulative histograms are easier to reason about for humans but require the backend to calculate delta on ingestion for efficient storage. Most backends handle both.

### 3.64 Advanced: Exponential Histograms

OpenTelemetry introduces exponential histograms, which use exponential bucket scaling instead of fixed boundaries. Exponential histograms provide high precision at low values and decreasing precision at high values, which is ideal for latency distributions. They also require far fewer buckets to cover a wide dynamic range. Support for exponential histograms is growing; prefer them when your backend supports it.

### 3.65 Metrics Key Concepts Summary

Counters for cumulative counts. Gauges for instantaneous values. Histograms for distributions. Recording rules for pre-computation. Labels for dimensionality. Aggregation for cross-cutting views. Rate for counter queries. Quantiles from histograms. Exemplars for metrics-trace correlation. This is the metric knowledge every Observability Engineer must have.

### 3.66 Metrics and Distributed Systems

In distributed systems, metrics must account for: multiple instances of the same service (aggregate across instances), multiple regions (aggregate across regions), rolling deployments (two versions running simultaneously), auto-scaling (instance count varies), and sharded services (each shard is an instance). Aggregation functions (sum, avg, max, min) must be chosen carefully based on the question being asked.

### 3.67 Metrics Conclusion

Metrics are the most mature and standardized of the three pillars. They are essential for monitoring, alerting, and dashboards. The Observability Engineer must master metric types, naming, labeling, collection, and querying. But metrics alone are insufficient — they tell you something is wrong but not why. Logs and traces fill that gap.


## P4 — Logging

### 4.1 Introduction to Logging

Logging is the oldest and most universal form of telemetry. Every application logs. But not all logging is equal. Structured, correlated, sampling-aware logging is an observability superpower. Unstructured, verbose, context-free logging is noise that costs money and obscures signal. The Observability Engineer transforms logging from a liability into an asset.

### 4.2 Structured Logging

Structured logs are machine-parseable records with consistent field schemas. JSON is the standard format. A structured log entry looks like: a JSON object with timestamp, level, message, service name, trace ID, span ID, and relevant attributes. Structured logs enable filtering, aggregation, and analysis that are impossible with free-text logs.

### 4.3 Structured Logging Schema

Standardize on a required field set across all services: timestamp (RFC3339), level (debug, info, warn, error, fatal), message (human-readable description), service (service name), environment (production, staging, development), trace_id (trace context), span_id (span context). Optional fields as needed: user_id, request_id, method, path, status_code, duration_ms, error_type, error_message, version, host, region. Enforce the schema through shared logging libraries.

### 4.4 Log Levels

Debug: detailed diagnostic information during development. Should be disabled in production (high volume, low value). Info: normal operational messages (request started, request completed, user logged in). Warn: unexpected but non-error conditions (rate limit approaching, deprecated API called, slow query). Error: error conditions that may require investigation (database connection failed, external service returned 500, validation error). Fatal: unrecoverable errors that cause process termination (should trigger immediate alert). Log level should be configurable at runtime without restart.

### 4.5 Log Level Configuration

Use environment variables or configuration files to set the default log level per service. Allow per-module or per-package level overrides. Support dynamic log level changes via signal handling (SIGUSR1 to toggle debug) or runtime API (HTTP endpoint to set level). This allows temporarily increasing verbosity during debugging without restarting the service.

### 4.6 Log Sampling

At high traffic volumes, logging every request is prohibitively expensive. Log sampling reduces volume while retaining representative coverage. Strategies: rate-based sampling (log every Nth request), dynamic sampling (increase sampling when errors occur), structured sampling (sample by request attributes). The goal is to capture enough data for debugging while controlling cost.

### 4.7 Log Sampling Strategies

Sampling at the application: before writing the log, decide whether to keep it. Sampling at the collector: aggregate logs in the collector and decide which to forward. Sampling at the storage: write all logs but only index a subset (expensive — storage is the biggest cost). Best practice: sample at the application with dynamic rates based on error status. Keep all errors (critical for debugging), sample info at 10%, sample debug at 0%.

### 4.8 Dynamic Log Sampling

When request rate is normal: log errors at 100%, info at 10%. When error rate spikes above threshold: increase info sampling to 100% for affected service (capture context around failures). When error rate returns to normal: revert to baseline sampling. Dynamic sampling adapts to system state, capturing more data when it is most valuable (during incidents) and less when it is not (steady state).

### 4.9 Log Aggregation

Log aggregation collects logs from multiple sources into a centralized store with indexing and search capabilities. Common solutions: Elasticsearch + Kibana (ELK stack), Loki + Grafana, Splunk, Datadog Logs, AWS CloudWatch Logs, Google Cloud Logging. The aggregator should support full-text search, field filtering, timestamp-based queries, and aggregation (count, sum, avg over log fields).

### 4.10 Log Ingestion Pipeline

Application to stdout/stderr (container logs) to log shipper (Filebeat, Fluentd, Fluent Bit, Promtail, OTel Collector) to buffer (Kafka, Redis) to log aggregator (Elasticsearch, Loki) to search UI (Kibana, Grafana). Each stage adds latency and complexity. Minimize stages where possible. Fluent Bit or OTel Collector as a lightweight sidecar performs most common log collection, parsing, and forwarding tasks.

### 4.11 Log Shipper Configuration

Fluent Bit configuration: input (tail files, forward from Docker/containerd), parser (regex to extract structured fields from log lines, or pass-through for JSON), filter (add Kubernetes metadata: namespace, pod name, container name, labels), output (forward to Elasticsearch, Loki, or Kafka). Keep configuration simple — complex parsing in the shipper is fragile and hard to debug.

### 4.12 Log Parsing

If logs are structured JSON, no parsing is needed — the log aggregator automatically indexes fields. If logs are unstructured (legacy), use parsers to extract fields: grok patterns for logstash, regex parsers for Fluent Bit, or pipeline processors in Elasticsearch. Prefer structured logging at the source — it is more reliable and efficient than parsing unstructured logs downstream.

### 4.13 Log Enrichment

Enrich logs with metadata at collection time: Kubernetes labels, pod name, namespace, service name, cluster name, cloud provider metadata, region, availability zone. This metadata is critical for filtering and grouping logs during debugging. The enrichment should happen at the shipper or collector level, not in application code (it is an infrastructure concern).

### 4.14 Log Correlation with Traces

Every log entry should carry trace_id and span_id when a trace is active. This enables the debugging workflow: find a slow trace, look at logs from that trace, and understand what happened at each span. Correlation requires: trace context propagation through the service, logging library integration with the trace SDK to auto-inject trace context into log fields, and backend support for searching logs by trace_id.

### 4.15 Log Correlation Implementation

In OTel Python SDK, the logging integration automatically adds trace context to log records. In Go, use a structured logger that reads trace context from context.Context and adds it to log entries. In Java, the SLF4J MDC pattern with OTel agent auto-instruments. In Node.js, use pino or winston with OTel context propagation. The implementation is language-specific but the principle is universal: trace context must flow through log entries.

### 4.16 Log Storage and Retention

Define retention tiers: hot storage (7-30 days, fast query, expensive), warm storage (30-90 days, slower query, cheaper), cold storage (90-365 days, archival, slow query, cheapest). Retention policy should be based on compliance requirements and debugging needs. Most production issues are debugged within the first few days; logs older than 30 days are rarely accessed.

### 4.17 Log Volume Management

Log volume grows linearly with request rate. A service handling 10,000 requests/second can generate terabytes of logs per day if each request generates multiple log entries. Control volume: set maximum log entry size (e.g., 4KB per entry), limit repeated log messages (rate limiting within the application), aggregate high-frequency events (log count rather than each event), and sample at the source.

### 4.18 Log Rate Limiting

Application-level rate limiting: within each logging interval, only log the first N occurrences of a given message, then log "suppressed X similar messages." This prevents log flooding during error cascades. Rate limiting should be per-logger, per-level, and configurable. Most logging libraries support rate limiting natively or through middleware.

### 4.19 Structured Logging in Practice

Use a structured logging library for your language: logrus or zap (Go), structlog or python-json-logger (Python), logback with JSON encoder (Java), pino or winston with JSON (Node.js). Configure the library to output JSON to stdout. Do not use print or console.log — they produce unstructured output. Ensure the logging library initializes before the application starts.

### 4.20 Logging Errors Appropriately

Log errors with full context: the error message, stack trace (only for unhandled errors), the operation that failed, the inputs to that operation, the correlation ID, and any relevant state. Do not log passwords, API keys, PII, or sensitive data. Do not log the same error at multiple levels (both warn and error). Do not log errors in exception handlers that re-throw (the top-level handler should log it once).

### 4.21 Logging in Async Code

Async code presents logging challenges: the execution context can change between await points, and correlation IDs must be propagated manually. Use async-aware logging libraries that propagate context through async local storage. In Python, this means using contextvars with structlog. In Node.js, AsyncLocalStorage with pino. In Java, ThreadLocal with Reactor Context. Test that context propagation works correctly in async code.

### 4.22 Logging for Security

Security-relevant events must be logged regardless of sampling or rate limiting: authentication failures, authorization denials, input validation failures, rate limit breaches, privilege escalation, API key usage, admin actions. These logs are critical for security incident response and compliance audits. They must be stored in tamper-evident storage with extended retention.

### 4.23 Log Analysis

Analyze logs to extract insights: error rates by service, endpoint, and error type; slow request patterns; user behavior trends; deployment impact (did error rate increase after the last deploy?); capacity planning (log volume trends). Use log analytics tools (ELK, Grafana Explore with Loki, Datadog Log Explorer) with aggregation queries: count by error_type, top 5 slowest endpoints, error rate time series.

### 4.24 Log Query Patterns

Common log queries: "all errors in the last 5 minutes from auth-service", "count of 500 errors by endpoint", "requests by user_id during incident window", "all logs with trace_id X", "logs from the 5 minutes before the alert fired", "top 10 slowest requests and their traces". These queries require structured fields, full-text search, and time range filtering. Dashboard these queries if they are used frequently.

### 4.25 Log Anomaly Detection

Use log analysis tools to detect anomalies: sudden increase in error rate, new error messages not seen before, change in log volume distribution, repeated identical error messages (suggesting a retry storm), or absence of expected log messages (suggesting a code path is not being executed). Anomaly detection on logs is less mature than on metrics but is valuable for catching issues that are not captured by metric alerts.

### 4.26 Log Patterns and Fingerprinting

Group similar log messages using pattern detection: replace variable parts of log messages with wildcards to create log patterns. "Connection to database X failed" becomes "Connection to database * failed". Count occurrences of each pattern over time. Pattern detection reduces thousands of individual log entries into manageable categories. Most log aggregation tools (Elasticsearch, Loki, Datadog) support automatic pattern detection.

### 4.27 Log as a Debugging Tool

When debugging with logs: set time range to the incident window. Filter to affected service(s). Filter by error level. Group by error message or error_type. Look for clusters (many identical errors suggest a systemic issue). Look for temporal correlation (errors cluster around a deploy or traffic spike). Drill into individual log entries for context. Note trace_id and follow it through dependent services.

### 4.28 Logging Metrics

Log entries themselves should be counted as metrics: log_entries_total by level, service, and the top-level error type (if applicable). This provides a metric-level view of logging volume and error rates. Alert on log_error_rate exceeding a threshold. Use metrics for logging health, not logs for logging health (meta-observability).

### 4.29 Audit Logging

Distinguish between operational logging and audit logging. Audit logs record security-relevant events with strict requirements: they must be immutable, cryptographically signed, stored separately from operational logs, retained longer, and accessible only by authorized personnel. Audit logs are often required for SOC2, HIPAA, PCI-DSS, and other compliance frameworks. They are not sampled, not rate-limited, and never deleted until the retention period expires.

### 4.30 Logging Anti-Patterns

Logging sensitive data (passwords, tokens, PII). Logging in tight loops (hot paths). Logging at the wrong level (using error for expected conditions). Logging without context (log "error occurred" without what and where). Using concatenation instead of structured fields. Logging too much in libraries (library code should log minimally, letting the application decide). Relying on logs for high-frequency metrics (use metrics instead).

### 4.31 Logging Best Practices Summary

Always structured JSON. Include trace context. Log at the appropriate level. Sample aggressively at info/debug. Keep errors unsampled. Rate-limit redundant messages. Never log secrets. Enrich with infrastructure context at collection time. Store with appropriate retention. Search and analyze with aggregation tools. Correlate with traces. Use log patterns and anomaly detection. Test logging configuration.

### 4.32 Logging in Container Environments

In containers, logs go to stdout and stderr. The container runtime captures these streams and stores them (Docker json-file, containerd). A log shipper (Fluent Bit running as DaemonSet) reads from the container runtime's log storage and forwards to the aggregator. The shipper adds Kubernetes metadata (pod name, namespace, container name, labels). Avoid writing logs to files inside containers (they are lost on container restart and bypass the container runtime).

### 4.33 Logging in Serverless

Serverless (Lambda, Cloud Functions) has short-lived execution environments that complicate log collection. Log output to stdout/stderr is captured by the cloud provider (CloudWatch Logs, Google Cloud Logging). Forward these logs to your central aggregator using subscription filters or log export mechanisms. Serverless logs must include correlation ID for request-level debugging (trace context is often unavailable in pure serverless).

### 4.34 Logging in Batch Jobs

Batch jobs produce large volumes of logs in a short time. Use same structured logging as services. Ensure logs are flushed before job termination (missing final log entries is a common issue). Push logs to aggregator via the shipper or directly via HTTP API. Batch job logs should include job ID, batch ID, and step information for correlation.

### 4.35 Logging Cost Optimization

Logging costs can dominate observability budgets. Control costs: set per-service log volume budgets, enforce log limits, sample verbose services, use shorter retention for debug logs, use log aggregation for low-value logs (count, do not store), compress logs at rest, and choose cost-effective storage (Loki with object storage for logs is cheaper than Elasticsearch with SSD).

### 4.36 Logging Conclusion

Structured, correlated, and cost-managed logging is essential for observability. Logs provide the forensic detail that metrics and traces cannot. The Observability Engineer standardizes log schemas, enforces structured logging, implements sampling and rate limiting, correlates logs with traces, manages storage costs, and builds tools for log analysis. Done right, logs are a powerful debugging tool. Done wrong, they are an expensive source of noise.


## P5 — Tracing

### 5.1 Introduction to Distributed Tracing

Distributed tracing tracks the lifecycle of a request as it traverses multiple services in a distributed system. Each request is assigned a unique trace_id that propagates across service boundaries via context propagation. Within each service, spans represent units of work (database queries, external API calls, internal processing). Spans have parent-child relationships forming a trace tree. Tracing answers: "Where is time spent? Which service is failing? What is the dependency graph? Which requests are slow?"

### 5.2 Core Tracing Concepts

Trace: the complete lifecycle of a request across all services. Trace ID: globally unique identifier for the trace. Span: a named, timed operation within a trace. Span ID: unique identifier for the span. Parent Span ID: links a span to its parent. Span Context: trace ID, span ID, and propagation metadata carried across service boundaries. Attributes: key-value pairs describing the span (HTTP method, status code, database statement). Events: timestamped annotations within a span (log messages, error markers).

### 5.3 Trace Structure

A trace is a tree of spans. The root span represents the entry point (the initial request). Child spans represent operations within that request (database queries, downstream service calls). The trace tree shows the structural relationships: which service calls which, in what order, and how long each operation takes. The trace tree is the fundamental debugging tool for understanding distributed system behavior.

### 5.4 Context Propagation

Context propagation carries the trace context across service boundaries. It uses: HTTP headers (traceparent, tracestate per W3C Trace Context), gRPC metadata, message queue headers (Kafka headers, RabbitMQ message properties). Propagation must happen at every service boundary: incoming request, extract context, create child span, inject context into outgoing requests. Failure to propagate context breaks the trace tree.

### 5.5 W3C Trace Context

traceparent header: version-trace_id-span_id-trace_flags. Example: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01. version (00), trace_id (16 hex bytes), span_id (8 hex bytes), trace_flags (01 = sampled). tracestate header: vendor-specific tracing data. W3C Trace Context is the standard for cross-service trace propagation. All OTel-compliant instrumentation and all modern tracing backends support it.

### 5.6 Span Attributes

Span attributes provide context about the span's operation. Standard attribute names follow the OTel semantic conventions: http.method, http.url, http.status_code, http.request_content_length, db.system, db.statement, db.operation, db.connection_string, messaging.system, messaging.destination, messaging.message_id, net.peer.name, net.peer.port. Attributes should be set at span creation (for known attributes) and during span execution (for attributes only known later). Keep attribute count manageable (under 10 per span is a good target).

### 5.7 Span Events

Span events are structured log messages within a span. Use for: capturing error details, recording state changes, logging inputs/outputs of important operations. Span events carry a timestamp and attributes. They are different from application logs: they are specific to the span's operation and are stored as part of the trace data, not the log system. Span events are less expensive than full application logs but provide less detail.

### 5.8 Span Status

Span status indicates the outcome of the operation: Unset (default — no status set), Ok (operation completed successfully), Error (operation encountered an error). Set span status to Error when the operation fails, and attach an error event with the error details. Span status is used by tracing backends to filter error traces. Set status explicitly — do not rely on default.

### 5.9 Sampling in Tracing

Tracing produces massive amounts of data — at high request rates, storing every trace is prohibitively expensive. Sampling selects a subset of traces for storage. The challenge: sampling should preserve the traces most likely to be useful for debugging (errors, slow requests, rare edge cases) while minimizing storage cost.

### 5.10 Head-Based Sampling

Decision to sample is made at the root of the trace (entry point), before any child spans are created. The sampling decision is propagated to all downstream services via trace_flags. Simple, consistent, easy to implement. Limitations: the decision is made with limited information — you might sample a normal request and discard an error request. Standard approach for most tracing systems.

### 5.11 Tail-Based Sampling

Decision to sample is made after the trace is complete, based on analysis of all spans in the trace. A sampling decision agent collects all spans for a trace ID and evaluates whether to keep the trace. Criteria: keep any trace with an error span, keep any trace with latency above threshold, keep a representative sample of healthy traces. Tail-based sampling preserves more interesting traces but requires a centralized decision point and introduces buffering latency.

### 5.12 Probabilistic Sampling

Each trace is kept with a fixed probability (e.g., 1%). Simple to implement, predictable storage cost. The weakness: rare events are rarely sampled — a 1-in-1000 error that happens 5 times per day will be captured only once every 20 days on average. Use probabilistic sampling for high-volume, low-value traces. Combine with tail-based sampling that preserves errors regardless of probability.

### 5.13 Rate-Limiting Sampling

Limit the number of traces stored per second (e.g., store 10 traces/second). Once the limit is reached, remaining traces are dropped. This provides predictable storage costs. The challenge: during high-traffic periods, trace storage becomes a competition — slowest traces may be dropped because they complete after the limit is reached. Best for environments with stable traffic patterns.

### 5.14 Consistent Sampling

Consistent sampling ensures that when a trace is sampled, all its spans are sampled. This is critical for trace completeness. Head-based sampling provides consistency naturally (the decision propagates downstream). Tail-based sampling requires a mechanism to ensure all spans of a sampled trace are retained while the decision is pending. Consistent sampling is a requirement, not an option.

### 5.15 Adaptive Sampling

Adaptive sampling adjusts the sampling rate based on current traffic and error conditions. When error rate is normal, sample at 1%. When error rate spikes, increase sampling to 100% for affected services. When error rate spikes but overall traffic is low, sample at 100% (per-traces-per-second limit may not be reached). Adaptive sampling balances cost and debugging value dynamically.

### 5.16 Trace Storage

Traces are stored in specialized backends: Jaeger (open source, self-hosted), Tempo (Grafana, open source, object storage-backed), Zipkin (legacy, open source), Honeycomb (SaaS, high-cardinality), Datadog APM (SaaS), New Relic (SaaS). Storage considerations: retention duration, storage cost per trace, query performance, cardinality support, and integration with dashboards and alerts.

### 5.17 Trace Querying

Query traces by: trace ID (exact lookup), service name (all traces from a service), operation name (all traces for an endpoint), tags (all traces with http.status_code=500), time range, duration range, and custom attributes. Advanced queries: "error traces where database query duration > 1s", "traces from service A calling service B in the last hour", "p99 latency trend over 7 days". Backend query performance varies significantly — test before choosing.

### 5.18 Trace Analysis: Service Map

The service map is derived from tracing data: it shows services as nodes and dependencies as edges. Edge labels show request rate and error rate. The service map is auto-generated from tracing data (no configuration needed). It answers: "What services does my service depend on? What depends on my service? Which services are downstream of a failing service?" The service map is a critical incident response tool.

### 5.19 Trace Analysis: Bottleneck Identification

Find the span with the highest duration in the critical path of the trace. The critical path is the longest chain of sequential spans. The span on the critical path with the highest duration is the bottleneck. Trace analysis tools automatically highlight the critical path. The bottleneck may be: a database query (slowed by missing index), an external API call (slowed by network or upstream), or CPU-intensive processing (slow business logic).

### 5.20 Trace Analysis: Error Traces

Analyze error traces to understand: what service returns the error, what is the error type, what is the error message, what is the state of the request at the point of error, what are the input parameters that caused the error, and are there common patterns across error traces? Error trace analysis reveals bugs that are not apparent from metrics or logs alone.

### 5.21 Trace Analysis: Root Cause Analysis

Use tracing for RCA: start with the trace that failed, follow the trace tree from root to leaf, examine each span's attributes and events, identify the first span in the chain that shows the error or anomaly, determine the service and operation responsible, examine the inputs and state at that point, and correlate with logs from that span. Tracing provides the "following" that connects symptoms to causes.

### 5.22 Trace Context in Logs

As discussed in logging: every log line should include trace_id and span_id. This enables transitioning from log analysis to trace analysis: you see an error log with trace_id X, then query the trace to see the full context of the request across all services. Implement this by integrating the logging SDK with the tracing SDK (OTel provides this integration out of the box).

### 5.23 Trace Analysis: Dependency Graph

The dependency graph shows which services communicate with which other services, including communication protocols (HTTP, gRPC, message queue), and request rates. Use the dependency graph to: verify that the actual architecture matches the documented architecture, find unexpected dependencies (sneaky service-to-service calls), identify critical paths for reliability engineering, and plan capacity.

### 5.24 Trace Analysis: Latency Distribution

For each operation (span name), compute the latency distribution: p50, p95, p99, p999. Identify operations with high latency variance (unstable performance indicates problems). Compare distributions across versions (did latency increase after the last deploy?). Compare distributions across regions (is one region slower?). Distribution analysis requires histogram-style trace storage.

### 5.25 Trace Analysis: Concurrency

Traces show how many concurrent requests a service handles at any time. High concurrency with high latency suggests a concurrency bottleneck (the service cannot keep up with the request rate and queuing occurs). Tracing concurrency analysis helps identify scaling bottlenecks and validate concurrency optimization efforts.

### 5.26 Tracing in Microservices

In microservice architectures, tracing is essential because a single user request touches dozens of services. Without tracing, you cannot understand the full impact of a change or diagnose a cross-service issue. Tracing should be a first-class requirement for all services, gated by the CI/CD pipeline: a service cannot be deployed to production without showing trace context propagation.

### 5.27 Tracing with Message Queues

Message queues break synchronous trace propagation because the producer and consumer are decoupled in time. For tracing through async message processing: propagate trace context in message headers, create a producer span (message send), create a consumer span (message receive), link producer and consumer spans through the trace ID. The trace becomes asynchronous: a fork-join pattern where the producer does not wait for the consumer.

### 5.28 Tracing with Batch Processing

Batch processing creates many spans for individual items within a batch. Represent: a root span for the batch operation, child spans for each item processed, and additional child spans for sub-operations within each item. This creates very wide traces. Use span linking instead of parent-child for large batches: link from batch span to item spans to reduce data volume while preserving traceability.

### 5.29 Tracing with Serverless

Serverless functions are inherently traced by the cloud provider (AWS X-Ray traces Lambda invocations). You can add custom sub-segments to capture function-internal operations. Propagate trace context from the triggering event (API Gateway request, SQS message, EventBridge event) into the function. Serverless tracing typically has lower overhead than tracing in long-running services because the function lifecycle is managed by the provider.

### 5.30 Trace Data Volume Estimation

Estimate trace storage: trace_size multiplied by traces_per_second multiplied by retention_seconds. A typical trace with 10 spans, each with 5 attributes and 1 event, is approximately 2KB. At 1,000 requests/second with 100% sampling: 2KB times 1000 times 86400 times 30 = approximately 5.2 TB/month. At 1% sampling: approximately 52 GB/month. This estimation drives storage budgeting and sampling decisions. Always include buffer for growth.

### 5.31 Tracing Cost Optimization

Trace storage costs are driven by span count, span size, and retention. Optimize: sample aggressively (start at 1%), remove unnecessary attributes (drop attributes that are never queried), reduce span count (combine sequential operations into single spans), shorten retention for raw traces (7 days raw, 30 days aggregated), use backend compression, and choose object storage-based backends (Tempo, Grafana Cloud) over SSD-based backends.

### 5.32 Tracing Maturity Model

Level 1: No tracing. Debugging cross-service issues is manual and painful. Level 2: Basic tracing. A single service has instrumentation but context does not propagate across services. Traces are available through direct trace ID lookup. Level 3: End-to-end tracing. All services propagate context. Traces cover the full request lifecycle. Sampling is configured but static. Level 4: Intelligent tracing. Tail-based sampling preserves interesting traces. Trace data is correlated with logs and metrics. Proactive trace analysis identifies bottlenecks. Level 5: Autonomous tracing. Traces feed automated anomaly detection. Trace-based SLOs exist. Sampling adjusts dynamically.

### 5.33 Tracing Conclusion

Distributed tracing is the most powerful debugging tool for distributed systems, but it is also the most complex and expensive to implement. Success requires: organization-wide adoption of context propagation, appropriate sampling strategy, robust storage, and a culture of trace-driven debugging. The Observability Engineer drives tracing adoption, manages sampling, and ensures trace data is actionable.


## P6 — OpenTelemetry (OTel)

### 6.1 Introduction to OpenTelemetry

OpenTelemetry is an open-source observability framework for generating, collecting, and exporting telemetry data (metrics, logs, traces). It is the second-most active project in the CNCF after Kubernetes. OTel provides: vendor-neutral APIs and SDKs for instrumentation, a Collector for telemetry processing and export, and semantic conventions for consistent naming. OTel is the industry standard for observability instrumentation.

### 6.2 OTel Architecture

OTel has two main components: OTel SDKs (client libraries for each language, used by applications to emit telemetry) and OTel Collector (standalone service that receives, processes, and exports telemetry). The architecture is: Application plus OTel SDK to OTel Collector to Backend. The SDK handles instrumentation in application code. The Collector handles data routing, processing, and export. This separation allows collectors to be managed independently of applications.

### 6.3 OTel API vs SDK

OTel API: interfaces and types that instrumentation libraries depend on. The API defines how to create spans, record metrics, and log structured events. OTel SDK: implementation of the API that provides the actual functionality. Instrumentation libraries depend only on the API, not the SDK. This allows different SDKs to be swapped in without changing instrumentation code. In practice, most developers use the SDK directly, but the API/SDK split is important for library authors.

### 6.4 OTel SDKs

Officially supported languages: Java, Go, Python, JavaScript (Node.js and browser), .NET, Ruby, PHP, C++, Erlang/Elixir, Rust (community), Swift (iOS). Each SDK provides: TracerProvider (creates tracers), MeterProvider (creates meters), LoggerProvider (creates loggers), context propagation, and exporter integration. SDKs are mature for Java, Go, Python, and .NET. Other languages have varying levels of completeness.

### 6.5 OTel Instrumentation

Auto-instrumentation: uses bytecode manipulation (Java), monkey patching (Python), or middleware injection (Node.js) to automatically capture telemetry from popular frameworks and libraries without code changes. Manual instrumentation: explicit API calls in application code to create custom spans, record metrics, and add attributes. Recommended approach: auto-instrumentation for coverage, manual instrumentation for depth.

### 6.6 OTel Auto-Instrumentation

Java: OTel Java Agent (-javaagent:opentelemetry-javaagent.jar) auto-instruments popular frameworks (Spring Boot, JAX-RS, JDBC, gRPC, Kafka, Tomcat, and more). Python: distro auto-instrumentation packages (opentelemetry-distro, opentelemetry-instrumentation). Node.js: @opentelemetry/auto-instrumentations-node. .NET: OpenTelemetry.AutoInstrumentation NuGet package. Auto-instrumentation provides standard RED metrics and distributed traces without application code changes.

### 6.7 OTel Manual Instrumentation

Manual instrumentation provides richer, domain-specific telemetry. In Go: tracer := otel.Tracer("my-service"); ctx, span := tracer.Start(ctx, "processOrder"); defer span.End(). In Python: with tracer.start_as_current_span("processOrder") as span:. Manual instrumentation captures business logic spans (processOrder, validatePayment, shipItem) that auto-instrumentation cannot.

### 6.8 OTel Semantic Conventions

Semantic conventions define standard attribute names, metric names, and span names for common operations. Examples: HTTP attributes (http.method, http.url, http.status_code, http.request_content_length), Database attributes (db.system, db.statement, db.operation, db.connection_string), Messaging attributes (messaging.system, messaging.destination, messaging.message_id), and general attributes (service.name, service.version, deployment.environment). Following conventions ensures cross-service consistency.

### 6.9 OTel Resource

Resources describe the entity producing telemetry: service name, service version, host name, container ID, cloud provider, cloud region, deployment environment. Resources are attached to all telemetry from a process. Configure resources via environment variables (OTEL_RESOURCE_ATTRIBUTES, OTEL_SERVICE_NAME) or programmatically. Resources are used by the backend to identify and group telemetry by source.

### 6.10 OTel Collector

The OTel Collector is a vendor-agnostic service for receiving, processing, and exporting telemetry data. It runs as: agent (sidecar or DaemonSet on each node, collecting telemetry from local processes) or standalone gateway (independent service aggregating telemetry from multiple agents). The Collector receives data via OTLP (OTel Protocol), processes it (batch, filter, transform, sample, redact), and exports to one or more backends.

### 6.11 OTel Collector Architecture

Pipelines in the Collector: receivers to processors to exporters. Receivers accept telemetry data (OTLP receiver, Prometheus receiver, Jaeger receiver, Zipkin receiver, filelog receiver). Processors transform data (batch processor, memory limiter, attributes processor, filter processor, sampling processor, redaction processor). Exporters send data to backends (OTLP exporter, Prometheus exporter, Jaeger exporter, Datadog exporter, AWS exporter, logging exporter).

### 6.12 OTel Collector Configuration

Configuration is YAML-based: receivers define what to collect, processors define how to process, exporters define where to send, and service.pipelines wire them together. Example: receivers include otlp with gRPC endpoint. Processors include batch and memory limiter. Exporters include otlp to backend. Service.pipelines wire traces, metrics, and logs pipelines connecting receivers through processors to exporters.

### 6.13 OTel Collector Receivers

otlp receiver: receives telemetry via gRPC or HTTP (OTLP format). prometheus receiver: scrapes Prometheus targets. filelog receiver: tails log files and parses them (alternative to Fluent Bit). hostmetrics receiver: collects host-level metrics (CPU, memory, disk, network). kubeletstats receiver: collects Kubernetes node and pod metrics from kubelet. jaeger receiver: receives Jaeger-formatted traces. zipkin receiver: receives Zipkin-formatted traces. kafka receiver: reads telemetry from Kafka topics.

### 6.14 OTel Collector Processors

batch: batches telemetry data for efficient export (reduces network calls). memory_limiter: prevents OOM by dropping data when memory exceeds limit. attributes: adds, modifies, or deletes attributes on spans, metrics, and logs. filter: drops telemetry matching filter conditions (by attribute value, by metric name, by severity). sampling: implements trace sampling (probabilistic, tail-based). redaction: removes sensitive data from telemetry (credit cards, PII). k8sattributes: adds Kubernetes metadata (pod name, namespace, node) to telemetry.

### 6.15 OTel Collector Exporters

otlp exporter: exports in OTLP format to any OTLP-compatible backend (most common). prometheus exporter: exposes metrics in Prometheus format via HTTP endpoint. prometheusremotewrite exporter: exports metrics to Prometheus-compatible remote write endpoints (Cortex, Thanos, Mimir, VictoriaMetrics). logging exporter: prints telemetry to console (useful for debugging). file exporter: writes telemetry to files. kafka exporter: exports to Kafka topics.

### 6.16 OTel Collector Extensions

Extensions provide additional capabilities: health_check (HTTP health check endpoint), pprof (Go profiling endpoint), zpages (debug endpoint), memory_ballast (reduces GC pressure), and OAuth2 client (for authentication). Extensions are configured under service.extensions and are not part of data pipelines. Use health_check for load balancer health probes. Use memory_ballast for collectors handling large data volumes.

### 6.17 OTel Protocol (OTLP)

OTLP is the native protocol for OTel telemetry data. It uses Protobuf serialization over gRPC or HTTP/1.1. OTLP supports all signal types: traces, metrics, and logs in a single protocol. OTLP is designed for efficient, reliable telemetry transport. Use OTLP for SDK-to-Collector communication and Collector-to-Collector communication. OTLP is the recommended protocol for all OTel-based deployments.

### 6.18 OTel Context Propagation

OTel implements W3C Trace Context by default: traceparent and tracestate HTTP headers. It also supports legacy propagation formats (B3, Jaeger, Zipkin) for interoperability during migration. Configure propagation via environment variables: OTEL_PROPAGATORS=tracecontext,baggage. Use W3C Trace Context as the default and only use legacy formats when required for compatibility.

### 6.19 OTel Baggage

Baggage is context propagation for arbitrary key-value pairs, not just trace IDs. Baggage propagates across service boundaries via the baggage HTTP header. Use baggage for: passing user IDs, feature flags, A/B test variants, and request attributes through the trace. Baggage values become available as attributes in downstream services. Use baggage sparingly — each baggage entry is propagated in every request and adds overhead.

### 6.20 OTel SDK Configuration

Environment variables configure OTel SDKs without code changes: OTEL_SERVICE_NAME (sets service.name resource attribute), OTEL_RESOURCE_ATTRIBUTES (additional resource attributes), OTEL_TRACES_SAMPLER (sampler type: always_on, always_off, traceidratio, parentbased_*), OTEL_TRACES_SAMPLER_ARG (sampler argument), OTEL_EXPORTER_OTLP_ENDPOINT (OTLP receiver endpoint), OTEL_EXPORTER_OTLP_HEADERS (custom headers for exporter), OTEL_LOG_LEVEL (SDK log level). Prefer environment variable configuration over programmatic configuration.

### 6.21 OTel Best Practices

Set OTEL_SERVICE_NAME on every service. Use auto-instrumentation for standard libraries. Add manual instrumentation for business-critical paths. Use consistent naming (follow semantic conventions). Configure sampling appropriately for each service. Always set span status (Unset/Ok/Error). Add relevant attributes to spans. Configure the batch processor for efficient export. Set memory limits to prevent collector OOM.

### 6.22 OTel Migration

Migrating from legacy instrumentation (Prometheus client, OpenTracing, OpenCensus): OTel provides bridge support for backward compatibility. Replace OpenTracing API calls with OTel API. Replace Prometheus client metrics with OTel metrics (or use the Prometheus bridge). Run OTel Collector to receive data in legacy formats (Jaeger, Zipkin, Prometheus) and export in OTLP. Plan a phased migration.

### 6.23 OTel in CI/CD

Validate OTel instrumentation in CI: build the service with OTel SDK, run integration tests that generate telemetry, collect the telemetry via OTLP receiver in test, assert that expected spans and metrics are present with correct attributes. Use OTel Collector in test mode (export to file or logging exporter) to capture telemetry for validation. Fail CI if instrumentation coverage is below threshold.

### 6.24 OTel Limitations

OTel is still evolving (especially logs and metrics maturity). SDK APIs change across versions. Some semantic conventions are still experimental. Auto-instrumentation coverage varies by language. Performance overhead of SDK can be significant at high throughput. Batch processor and appropriate sampling mitigate overhead. Test OTel SDK performance for your specific workload.

### 6.25 OTel and the Future

OTel is becoming the universal instrumentation layer. Future developments: eBPF-based auto-instrumentation (no code changes at all), profiling integration (continuous profiling alongside traces), AI-assisted instrumentation recommendations, and OpenTelemetry becoming the default for all cloud providers. The Observability Engineer should invest in OTel knowledge as it is the long-term standard.

### 6.26 OTel Conclusion

OpenTelemetry is the foundation of modern observability. The Observability Engineer must understand: SDK instrumentation (auto and manual), Collector configuration (receivers, processors, exporters), OTLP protocol, semantic conventions, context propagation, and deployment patterns (agent, gateway). Invest in OTel skills — they are future-proof and transferable across vendors.


## P7 — Observability Architecture

### 7.1 Introduction to Observability Architecture

Observability architecture defines how telemetry data flows from instrumented applications to storage and querying backends. The architecture must handle: scale (thousands of services, petabytes of data per day), reliability (no data loss during failures), cost (optimal storage and compute), and flexibility (multi-backend, multi-vendor). The architecture is the foundation on which all observability capabilities are built.

### 7.2 Reference Architecture: Three-Tier

Application to Agent/Collector (edge) to Collector Gateway (aggregation) to Backend (storage and query). The Agent runs on each node (Kubernetes DaemonSet, VM sidecar) and collects telemetry from local processes. The Collector Gateway aggregates from multiple agents, applies global policies (sampling, redaction, routing), and exports to the backend. The Backend stores and serves telemetry data.

### 7.3 Edge Tier: Agents

Agents run close to the applications. Responsibilities: receive telemetry from local applications (via OTLP), apply local processing (batching, basic sampling, rate limiting), and forward to the collector gateway. Agent deployment: Kubernetes DaemonSet (one agent per node, collects from all pods on that node), VM sidecar (one agent per VM), or embedded in application. The agent should be lightweight, low-resource, and never crash the application.

### 7.4 Aggregation Tier: Collector Gateways

Collector gateways aggregate telemetry from multiple agents. Responsibilities: apply global sampling policies (tail-based sampling), redact sensitive data, enrich with global metadata (cluster name, data center), route telemetry to appropriate backends (metrics to Prometheus, traces to Tempo, logs to Loki), and handle backpressure from backends. The gateway can be scaled horizontally behind a load balancer.

### 7.5 Backend Tier: Storage and Query

Backends store telemetry data and expose query interfaces. Metrics backends: Prometheus (self-hosted), Thanos/Cortex/Mimir (scalable Prometheus), VictoriaMetrics (drop-in Prometheus alternative), SaaS (Datadog, Grafana Cloud, New Relic). Traces backends: Tempo, Jaeger, Honeycomb. Logs backends: Elasticsearch, Loki, Splunk. The backend should be highly available, durable, query-performant, and cost-controlled.

### 7.6 Pull vs Push Architecture

Pull architecture: scraper (Prometheus) requests data from targets at regular intervals. Pull is simple, but requires targets to be reachable and does not work for batch jobs. Push architecture: applications push data to a collector (OTLP, statsd, Pushgateway). Push works for all workload types but requires collector endpoint management. Recommended: use pull for metrics from long-running services, use push for traces and logs (they are naturally event-driven).

### 7.7 Telemetry Pipeline Reliability

Reliability patterns: buffering (collectors buffer data when backends are unavailable), retries (exponential backoff with jitter), circuit breaking (stop sending to a failing backend), graceful degradation (drop low-priority data before high-priority), and dead-letter queues (store failed exports for later analysis). Never let telemetry delivery failures crash the application. Fail-close: if the collector is unreachable, drop data rather than block the application.

### 7.8 Telemetry Pipeline Monitoring

Monitor the pipeline itself: agent health (resource usage, error rates, queue depth), gateway health (throughput, latency, error rates), backend health (ingestion rate, query latency, storage utilization), end-to-end latency (time from instrumentation to queryable), and data loss rate (percentage of telemetry dropped). Alert on pipeline degradation. The observability pipeline must be more reliable than the systems it monitors.

### 7.9 Multi-Cluster Architecture

For organizations with multiple Kubernetes clusters: each cluster has its own set of agents and a cluster-local gateway. A global gateway aggregates telemetry from all clusters. Thanos or Cortex provides global metric querying across clusters. For traces, Tempo enterprise or Grafana Cloud aggregates cross-cluster traces. For logs, Loki supports cross-cluster querying via querier federation.

### 7.10 Multi-Region Architecture

For multi-region deployments: each region has independent agent, gateway, and backend stacks. Telemetry stays within the region for performance and compliance. Global dashboards query regional backends via federation or cross-region query proxies. Alerting is per-region (a region failure should not trigger alerts in other regions). Global SLO dashboards aggregate regional data.

### 7.11 Hybrid Architecture

For organizations spanning cloud and on-premises: deploy agents and gateways in each environment. Use a forwarding collector in on-premises to send telemetry to cloud backends (or vice versa). Consider network latency, bandwidth, and security (VPN or private link). On-premises backends (Prometheus, Elasticsearch) may be cost-effective for high-volume data that does not need cloud analytics.

### 7.12 High-Availability Architecture

Backends must be highly available: redundant instances, automatic failover, data replication (if supported), and disaster recovery. Prometheus: run multiple instances scraping the same targets, or use Thanos with HA bucket storage. Elasticsearch: configure clusters with replication and cross-zone availability. SaaS backends handle HA for you. The telemetry pipeline should also be HA.

### 7.13 Backend Selection Criteria

Select backends based on: scale (data volume per day), cardinality (unique time series), query patterns (ad-hoc exploration vs fixed dashboards), integration requirements (Grafana, existing tools), budget (storage cost, licensing cost), compliance (data residency, retention requirements), and operational maturity (SaaS vs self-managed). No single backend is best for all signals.

### 7.14 Observability as Code

Define all observability configuration in code: recording rules, alert rules, scrape configs, dashboards (Grafana JSON), SLO definitions, notification policies, and collector configuration. Store in version control. Apply via CI/CD. Validate with automated tests. This approach provides reproducibility, reviewability, audit trail, and disaster recovery.

### 7.15 Observability as Code Tools

Terraform/Pulumi: manage Grafana Cloud configuration. Grafctl: CLI for Grafana Cloud configuration management. Jsonnet/Grizzly: generate Grafana dashboards programmatically. Promtool: validate rule files. OpenTelemetry Operator: manage collector configuration on Kubernetes. Custom tooling: CI/CD scripts that apply configuration from Git repositories.

### 7.16 Service Catalog Integration

A service catalog (Backstage, ServiceNow, custom) maps services to their metadata: owner, team, criticality, dependencies, and on-call rotation. The observability architecture should integrate with the service catalog: auto-generate dashboards from catalog data, route alerts based on catalog owner information, and apply different retention/sampling policies based on criticality.

### 7.17 Observability Architecture for Startups

Startups with fewer than 10 services: use SaaS (Grafana Cloud, Datadog, Honeycomb). No self-managed infrastructure. Use auto-instrumentation (OTel agents) for quick setup. Single dashboard per service. Basic SLOs. Minimal sampling (cost is low at small scale). The priority is getting observability working quickly, not optimizing architecture.

### 7.18 Observability Architecture for Scale (100-plus services)

Scale architecture: self-managed OTel Collector agents on each node, gateway layer for global policies, and backend combination (Prometheus plus Thanos for metrics, Tempo for traces, Loki for logs). Use service discovery-based scrape configuration. Enforce instrumentation standards through CI/CD. Implement cost management. Dedicated observability team manages architecture.

### 7.19 Observability Architecture for Enterprise (1000-plus services)

Enterprise architecture: multi-region, multi-cluster, hybrid (cloud plus on-premises). Multiple backends for different use cases (SaaS for critical services, self-managed for cost-sensitive bulk data). Advanced sampling (tail-based, adaptive). Automated instrumentation (eBPF, service mesh). Observability data lake (store raw telemetry in cheap object storage for ad-hoc analysis). Dedicated observability platform team.

### 7.20 Networking and Security

Telemetry data must be secured in transit and at rest. Use TLS for all telemetry transport. Use mutual TLS (mTLS) for collector-to-collector and collector-to-backend communication. Use network policies to restrict telemetry traffic. Implement authentication for telemetry ingestion (API keys, OAuth2, client certificates). Audit data access.

### 7.21 Data Residency and Sovereignty

Some data must stay within specific geographic boundaries (GDPR in EU, data sovereignty laws). Design architecture to keep telemetry data in the required region. Use region-local backends. Do not forward telemetry across region boundaries for compliant data. Tag telemetry with region information for policy enforcement.

### 7.22 Scalability Limits

Each architecture component has limits: Prometheus single instance: approximately 1-2 million active series, approximately 50,000 samples/second ingestion. Collector single instance: memory-bound (keep under 1GB), CPU-bound for complex processing. Elasticsearch: cluster size bounded by shard count and node count. Know your limits and plan scaling before hitting them.

### 7.23 Observability Pipeline Cost Components

Cost = compute (agents, collectors, query engines) + storage (hot, warm, cold) + network (inter-region transfer) + licensing (SaaS, commercial backends). Compute cost dominates at small scale. Storage and network dominate at large scale. Optimize: choose efficient formats (OTLP compressed), use object storage (cheaper than block storage), reduce inter-region data transfer.

### 7.24 Architecture Decision Records

Document architecture decisions: why a specific backend was chosen, why a specific sampling rate was selected, why a collector is configured in a particular way. Use Architecture Decision Records (ADRs) stored alongside the observability as code configuration. ADRs provide context for future engineers and prevent repeating the same decision-making process.

### 7.25 Architecture Testing

Test the architecture: load testing (can the pipeline handle peak traffic?), failure testing (what happens when a gateway crashes? when a backend is unreachable?), latency testing (how long from instrumentation to queryable?), and cost testing (does the architecture stay within budget?). Use chaos engineering for failure testing. Use synthetic load generators for load testing.

### 7.26 Architecture Evolution

Observability architecture evolves with organizational needs. Start simple (SaaS for everything). Add self-managed components when cost or control is needed. Add custom processing when specific requirements emerge. Add automation (observability as code) when manual configuration becomes a bottleneck. Add dedicated teams when observability scope exceeds one team's capacity.

### 7.27 Architecture Conclusion

Observability architecture must balance scale, reliability, cost, and flexibility. There is no one-size-fits-all architecture — the right design depends on organizational scale, regulatory requirements, budget, and team capability. The Observability Engineer designs architecture that meets current needs while leaving room for growth.


## P8 — Alerting

### 8.1 Introduction to Alerting

Alerting is the most visible output of an observability system. It is also the most likely to be broken. Bad alerts cause fatigue, missed incidents, and distrust. Good alerts are precise, actionable, and trustworthy. The goal of alerting is not to minimize alerts — it is to maximize the signal-to-noise ratio such that every alert demands and deserves human attention.

### 8.2 Alerting Philosophy

An alert should represent a real problem that requires human judgment to resolve. If the response is automated (restart the pod, scale up), automate it — do not page a human. If the response is always "that is normal, ignore it," the alert is noise — fix or delete it. Every alert should answer: what is wrong, why should I care, what should I do about it, and where do I look for more information?

### 8.3 Alert Severity Levels

Critical/P0: service down, data loss, security breach. Immediate human response required (pages on-call). Warning/P1: degraded performance, approaching capacity, increased error rate. Response within minutes during business hours. Info/P2: informational notification: deploy completed, backup succeeded. No page, shown in dashboard. Each organization defines its own severity levels, but the principles are: critical requires immediate action, warning requires timely action, info requires no action.

### 8.4 Alert Conditions

An alert condition is a boolean expression evaluated periodically. When true, the alert fires. When false, the alert resolves. Simple conditions: metric greater than threshold (CPU greater than 90%), metric less than threshold (disk space less than 10%), absent(metric) (no data received). Complex conditions: rate of change greater than threshold (disk filling up), predicted crossing (disk will fill in 24 hours), burn rate greater than threshold.

### 8.5 Alert Threshold Configuration

Static thresholds: fixed value determined by experience or capacity planning (CPU greater than 80%, latency greater than 500ms). Static thresholds are simple but require manual tuning as systems change. Dynamic thresholds: computed from historical data (anomaly detection, standard deviation from baseline). Dynamic thresholds adapt to changing conditions but require more sophisticated infrastructure. Use static thresholds for well-understood resources; prefer SLO-based alerting for complex systems.

### 8.6 Alert Conditions: For and Duration

The for parameter requires the condition to be true for a duration before firing. for: 5m means the condition must be true for 5 consecutive minutes. This prevents flapping alerts (an alert that fires on a momentary spike then resolves immediately). Set for based on the alert's urgency: critical alerts may have for: 1m, warning alerts for: 10m. Too short a for causes noise; too long delays response.

### 8.7 Alert Notification Routing

Route alerts to the right team based on: service ownership (which team owns the failing service), severity level (critical pages on-call, warning sends to chat), time of day (critical pages 24x7, warning pages only during business hours), and alert type (infrastructure alerts go to platform team, application alerts go to service team). Use Alertmanager's routing tree for Prometheus, or notification policies in Grafana Cloud.

### 8.8 Alert Fatigue Prevention

Alert fatigue destroys trust. Prevention strategies: set appropriate thresholds (not too sensitive), use for duration (prevent flapping), tune based on alert history (adjust thresholds monthly), implement alert deduplication (group related alerts), implement alert silencing (suppress known issues), limit alert volume (maximum alerts per time window per service), and delete noisy alerts. Every alert that fires without requiring action is a trust-eroding event.

### 8.9 Alert Quality Metrics

Measure alert quality: precision (fraction of alerts that represent real problems), recall (fraction of real problems caught by alerts), time-to-fire (how quickly the alert detects the problem), false positive rate, false negative rate, alert volume per service per day, mean-time-to-acknowledge (MTTA) for critical alerts, and mean-time-to-resolve (MTTR) for alerted incidents. Use these metrics to continuously improve alert quality. A good alert system has precision greater than 95% and recall greater than 90%.

### 8.10 Alert Content

An alert notification must contain sufficient information for the on-call engineer to respond without context switching: alert name and description, current value and threshold, link to dashboard, link to runbook, service and team identification, severity, timestamp, and any relevant labels (region, pod, endpoint). A well-formatted alert notification allows the on-call engineer to understand the situation and start investigating immediately.

### 8.11 Runbooks

Every alert must have a runbook. The runbook answers: what does this alert mean, what are the common causes, what are the steps to diagnose, what are the steps to mitigate, and who to escalate to. Runbooks live in a wiki, a dedicated runbook system, or are linked from the alert notification. Runbooks must be kept current (outdated runbooks are worse than none). Test runbooks periodically through disaster recovery drills.

### 8.12 Alert Lifecycle

Alert created (threshold configured) to Alert fires (condition met) to Notification sent to Acknowledged (on-call confirms receipt) to Investigation to Mitigation to Resolved (condition clears). Monitor the alert lifecycle: time-to-acknowledge, time-to-mitigate, time-to-resolve. Long times indicate problems: obscure alerts without runbooks, insufficient information in notifications, or alert fatigue causing delayed response.

### 8.13 Prometheus Alerting Rules

Alerting rules in Prometheus: groups of alert definitions with name, expression, for duration, labels (added to alert), and annotations (added to notification). Example: alert: HighErrorRate, expr: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05, for: 5m, labels: {severity: critical, team: platform}, annotations: {summary: "Error rate above threshold", dashboard: "https://grafana.example.com/d/abc", runbook: "https://wiki.example.com/high-error-rate"}.

### 8.14 Alerting Labels vs Metric Labels

Alerting labels are added by the alert rule. They override metric labels. Use alerting labels to set: severity (critical, warning, info), team (which team to route to), and routing metadata. Do not duplicate metric labels as alerting labels. Use annotations (not labels) for human-readable information (summary, description, dashboard URL, runbook URL). Annotations do not affect deduplication or routing.

### 8.15 Alertmanager Configuration

Alertmanager receives alert notifications from Prometheus and handles: grouping (group similar alerts to reduce notification volume), inhibition (suppress low-severity alerts when high-severity alerts are active), silencing (suppress alerts matching configured matchers), and routing (send alerts to appropriate receivers based on labels). Receivers: email, Slack/PagerDuty/OpsGenie webhook, pushover, custom webhook.

### 8.16 Alertmanager Grouping

Group alerts by common labels to reduce notification spam. Group by alertname and severity: when HighErrorRate fires on 10 pods, send one notification instead of 10. Grouping interval: how long to wait before sending the first notification (allows more alerts to be grouped). Repeat interval: how often to resend if the alert is still firing. Configure grouping based on the alert semantics.

### 8.17 Alertmanager Inhibition

Inhibition suppresses low-severity alerts when a high-severity alert exists. For example, if a node is down (critical), suppress all pod-level alerts on that node (there is no point alerting on individual pods when the node is unreachable). Inhibition conditions: target matcher alerts must match source matcher. Use inhibition to reduce noise during cascading failures. Test inhibition rules carefully — incorrect inhibition can hide real problems.

### 8.18 Alertmanager Silencing

Silencing suppresses matching alerts for a specified duration. Use for: planned maintenance (silence alerts for a service being upgraded), known issues (silence alerts for a known bug until fix is deployed), and noise reduction (silence a noisy alert while the team tunes it). Silences should have an owner and a reason. Expired silences should be cleaned up automatically.

### 8.19 Multi-Window Multi-Burn-Rate Alerts

This is the gold standard for SLO-based alerting. For non-SLO alerts, the principle still applies: use multiple time windows with different thresholds to balance sensitivity and noise. A short-window, low-threshold alert catches problems quickly but may have false positives. A long-window, high-threshold alert is more reliable but slower. Combining both gives fast detection with confirmation.

### 8.20 Alerting for Batch Jobs

Batch jobs present unique alerting challenges. Solutions: alert on job failure (increase of failed_jobs_total), alert on job duration (job_duration_seconds greater than expected_max), alert on data freshness (time since last successful run greater than threshold), and combine with heartbeats (a metric that is incremented every successful run; absent_over_time triggers if no heartbeat is received). Use Pushgateway for batch job metrics and alert on absent_over_time.

### 8.21 Alerting for Data Pipelines

Data pipeline alerting: alert on record loss (input count vs output count discrepancy), alert on pipeline lag (records_in - records_out greater than threshold), alert on processing errors (error_count greater than 0), alert on staleness (no output produced in the last X minutes), and alert on schema violations. Data pipeline alerts often require custom metrics that capture data quality.

### 8.22 Alerting on Logs

Log-based alerting: count of ERROR level logs in the last 5 minutes exceeding a threshold. Use Loki's logql: sum(count_over_time({service="myservice"} |= "ERROR" [5m])) greater than 10. Log-based alerts catch errors that do not have explicit metric instrumentation. They are slower and more expensive than metric alerts because they require log querying.

### 8.23 Alerting on Traces

Trace-based alerting: count of traces with error span status in the last 5 minutes exceeding a threshold. Use Tempo's TraceQL or vendor-specific query languages. Trace-based alerts are the most powerful because they capture the full request context (error type, which service, which user). However, trace-based alerting is immature compared to metric-based alerting. Most organizations rely on metrics for alerting and use traces for post-alert debugging.

### 8.24 Alert Testing

Test alerts in a staging environment before deploying to production. Use synthetic traffic generators to trigger alerts and verify they fire correctly. Test: alert expression evaluates correctly, annotations render correctly, notification is sent to the right channel, acknowledgment works, and resolution notification is sent. Use promtool to unit test alerting rules against sample data. Automated alert testing in CI/CD prevents broken alert deployments.

### 8.25 Alert Maintenance

Alerts require ongoing maintenance. Review alert quality monthly: which alerts fired, which were actionable, which were noise. Tune thresholds based on historical data. Remove alerts that have not fired in 90 days (they either never trigger or are dead code). Add alerts for new failure modes discovered during incidents. Rotate alert ownership to prevent knowledge silos.

### 8.26 Alerting Anti-Patterns

Alerting on every HTTP 500 (one customer's error should not page unless it indicates a systemic issue). Alerting on resource utilization without context (CPU at 80% may be fine for one service and critical for another). Unactionable alerts (alerts that cannot be acted upon because the root cause is elsewhere). Duplicate alerts (multiple alert rules that fire on the same condition). Missing runbooks or stale runbooks. Alerts that fire and auto-resolve without human action.

### 8.27 Alerting Best Practices

Four principles: relevance (every alert should represent a real problem that requires human action), reliability (alerts should fire when they should and not fire when they should not), resolution-path (every alert should have a clear path to resolution, documented in a runbook), and rate (alert volume should be manageable — a single on-call engineer should not receive more than 2-3 alerts per day). Measure against these principles and fix deviations.

### 8.28 Conclusion: Alerting Maturity

Level 1: Random alerts with static thresholds, high noise, ignored by engineers. Level 2: Documented alerts with runbooks, basic grouping, moderate noise. Level 3: SLO-based burn rate alerts, tuned thresholds, low noise, high trust. Level 4: Automated response for common alerts (auto-remediation), alerts feed incident management system. Level 5: Predictive alerts (alert before symptom occurs), machine learning reduces false positives, alert system learns from outcomes.


## P9 — Dashboards

### 9.1 Introduction to Dashboards

Dashboards are visual representations of telemetry data designed to answer specific questions at a glance. A good dashboard enables rapid understanding of system state. A bad dashboard is cluttered, confusing, and ignored. Dashboard design is a skill that combines data visualization principles, domain knowledge, and understanding of the audience's needs.

### 9.2 Dashboard Purpose

Dashboards serve different purposes: Operational dashboard (for on-call engineers, shows current health), Debugging dashboard (for incident response, shows detailed telemetry), Capacity dashboard (for planning, shows resource trends), Business dashboard (for management, shows KPIs and SLOs), and Team dashboard (for development teams, shows deploy impact and service health). Each purpose requires different data, layout, and update frequency.

### 9.3 Dashboard Audiences

On-call engineer: needs at-a-glance health status, RED metrics per service, high-level dependency map. Use big numbers for SLO status, sparklines for trends. Developer debugging: needs detailed metrics per endpoint, correlated logs and traces. Use tables, detailed graphs, and trace links. Management: needs trend views, SLO compliance over time, cost trends. Use bar charts and summary numbers. Know your audience and design accordingly.

### 9.4 The USE Method Dashboard

USE = Utilization, Saturation, Errors. For every resource (CPU, memory, disk, network): Utilization (percentage busy), Saturation (queue depth or pressure), Errors (error count or rate). USE dashboards are for infrastructure-level monitoring: node_exporter metrics, container resource usage, disk I/O, network throughput. USE is the starting point for any infrastructure dashboard.

### 9.5 The RED Method Dashboard

RED = Rate, Errors, Duration. For every service: Request Rate (requests/second), Error Rate (errors/second or error ratio), Duration (latency distribution: p50, p95, p99). RED dashboards are for service-level monitoring. Every service should have a RED dashboard. RED is the foundation of service observability. Add service-specific metrics beyond RED as needed.

### 9.6 Dashboard Layout Principles

Left-to-right, top-to-bottom: most important information at the top left (the user's starting point). Use consistent layout across dashboards for the same audience. Group related metrics together (RED metrics together, resource metrics together). Use appropriate panel types: time series graphs for trends, gauges for current values, tables for detailed data, heatmaps for distributions, stat panels for SLO compliance.

### 9.7 Dashboard Color Coding

Use consistent colors: green for healthy, yellow for warning, red for critical. Use the same color for the same metric across dashboards. Avoid using color for decoration — it should convey meaning. Consider colorblind accessibility: use patterns or labels alongside colors. Grafana's thresholds feature enables automatic color coding based on value ranges.

### 9.8 Dashboard Best Practices

Use Grafana variables (template variables) for dashboard reusability: service selector, environment selector, time range selector. Use template variables instead of hard-coded label values. Minimize the number of panels (too many panels = cognitive overload). Aim for 8-12 panels for operational dashboards. Use shared crosshair and tooltips for correlated analysis. Annotate dashboards with text panels for context.

### 9.9 Grafana Dashboard Design

Create dashboard folders by team or domain. Use dashboard tags for discoverability. Set auto-refresh appropriate to the dashboard purpose (30s for operational, 5m for capacity). Set time range defaults (last 6 hours for operational, last 7 days for capacity). Use dashboard links for navigation between related dashboards. Export dashboard JSON and version control it.

### 9.10 Grafana Variables

Variables allow dashboard interactivity: service (), environment (), region (), time range (built-in). Define variables from data sources: query variables (SELECT label_values(metric, label)), interval variables, custom variables (dropdown of fixed values). Use variables in panel queries: rate(http_requests_total{service=~""}[5m]). Variables make one dashboard reusable across many services.

### 9.11 Grafana Annotations

Annotations mark events on time series graphs: deployments, configuration changes, scaling events, and incident start/end times. Use annotations to correlate telemetry changes with operational events. Automate annotations by writing to Grafana annotation API from CI/CD pipelines. Manual annotations during incidents are also valuable. Annotations turn "what changed?" from a question into an answer.

### 9.12 Grafana Alerting

Grafana has built-in alerting (Grafana Alerting) that can alert on any data from any data source. Advantages over Prometheus alerting: supports all data sources (not just Prometheus), has a unified alerting UI, supports alert rule testing. Disadvantages: alert rules are not version-controlled as easily as Prometheus rule files. Use Grafana alerting for dashboards that need embedded alerting.

### 9.13 Dashboard as a Starting Point

Dashboards are entry points for debugging, not the final destination. Every panel should be clickable, leading to deeper investigation. Link panels to: detailed dashboards, log queries showing relevant logs, trace views showing relevant traces, and runbooks. In Grafana, use data links on panels to create drill-down paths. The dashboard starts the investigation; links continue it.

### 9.14 Dashboard Anti-Patterns

Too many panels (information overload). Inconsistent label naming (same service called different things across panels). Hard-coded label values (requires dashboard editing to change service). Missing time range controls (user cannot look at a different time window). No annotations (cannot correlate with events). No drill-down links (stuck at high level). Unused dashboards (created then abandoned).

### 9.15 Dashboard Maintenance

Dashboards require maintenance. Review dashboards quarterly: remove unused dashboards, update stale metrics (did metric names change?), update threshold coloring, verify data sources still work. Automate dashboard generation from service catalogs to reduce manual maintenance. Archive dashboards for decommissioned services. Dashboard maintenance is part of observability debt management.

### 9.16 Dashboard Conclusion

Dashboards are the public face of observability. Well-designed dashboards enable rapid understanding and effective debugging. Poorly designed dashboards waste time and erode trust. The Observability Engineer applies design principles (USE, RED, audience-aware layout, consistent color coding, drill-down links) and maintains dashboards as the systems they monitor evolve.


## P10 — SLO-Based Alerting

### 10.1 Introduction to SLOs

Service Level Objectives (SLOs) are target values for service reliability, expressed as a percentage of good events over a time window. SLOs connect observability to business impact. They answer: "Is this service reliable enough for its users?" SLO-based alerting alerts not on symptoms (high latency) but on risk (will we miss our reliability target?). This shifts alerting from "something is wrong" to "something will soon be wrong enough to matter."

### 10.2 SLI, SLO, SLA Definitions

Service Level Indicator (SLI): a metric that measures a specific aspect of reliability. Examples: request latency, error rate, availability. Service Level Objective (SLO): a target value for an SLI over a time window. Example: "99.9% of requests complete in under 500ms over a 30-day rolling window." Service Level Agreement (SLA): a contractual commitment to meet an SLO, with consequences for failure.

### 10.3 SLI Types

Latency SLIs: proportion of requests faster than a threshold (e.g., under 200ms). Availability SLIs: proportion of requests that succeed (e.g., HTTP status under 500). Freshness SLIs: age of data (e.g., time since last successful data update). Correctness SLIs: proportion of responses with correct results. Durability SLIs: proportion of stored data that is not lost. Each SLI measures a different aspect of reliability.

### 10.4 SLI Implementation

Good events divided by total events. For latency: count of requests with duration less than threshold divided by total requests. For availability: count of non-error requests divided by total requests. Implement SLIs as metric recording rules: sli:latency:good = rate(http_requests_duration_seconds_bucket{le="0.5"}[5m]), sli:latency:total = rate(http_requests_duration_seconds_count[5m]). SLIs are pre-computed for efficient SLO evaluation.

### 10.5 SLO Time Windows

Rolling window SLO: measured over a sliding time window (e.g., last 30 days). Calendar window SLO: measured over a fixed calendar period (e.g., this month). Rolling windows are more common because they represent the current reliability state. Calendar windows are used for compliance reporting. Choose the window based on business requirements and debugging needs.

### 10.6 Error Budget

Error budget = 1 minus SLO target. For a 99.9% SLO, the error budget is 0.1% of good events. Error budget is the amount of unreliability allowed in the time window. When error budget is exhausted, the service is unreliable by SLO definition, and action must be taken (freeze deployments, prioritize reliability work). Error budget tracking makes reliability a quantifiable, manageable resource.

### 10.7 Burn Rate

Burn rate = how fast error budget is being consumed divided by how fast it is budgeted to be consumed. A burn rate of 1 means error budget is consumed exactly at the budgeted rate (will exactly hit the SLO at window end). A burn rate of 10 means error budget will be exhausted 10 times faster than budgeted. Burn rate is the key metric for SLO-based alerting.

### 10.8 Multi-Window Multi-Burn-Rate Alerts

The standard approach for SLO-based alerting. Uses multiple burn rate thresholds and time windows: short window (5-30 minutes) with high burn rate (10-20x) for fast detection of severe problems, medium window (1-6 hours) with moderate burn rate (3-10x) for detection of moderate problems, long window (6-24 hours) with low burn rate (1-3x) for detection of chronic problems.

### 10.9 Alert Configuration for MWMBR

Example: 99.9% SLO over 30 days. Burn rate 10 (short window): alert if burn rate greater than 10 for 5 minutes (high burn rate indicates SLO will be exhausted in approximately 3 days). Burn rate 2 (long window): alert if burn rate greater than 2 for 1 hour (low burn rate indicates SLO will be exhausted in approximately 15 days). Burn rate 1 (chronic): alert if burn rate greater than 1 for 24 hours.

### 10.10 MWMBR Alert Expression

For a 99.9% SLO with 30-day window: metric: slo_error_budget_burn_rate = (1 minus sli_good_ratio) divided by (1 minus slo_target). Alert rules: alert: BurnRateHigh with burn rate greater than 10 for 5m, alert: BurnRateModerate with burn rate greater than 3 for 1h, alert: BurnRateChronic with burn rate greater than 1 for 24h. Each burn rate threshold requires its own for duration.

### 10.11 SLO Dashboard

An SLO dashboard shows: current SLO compliance (percentage with remaining error budget), burn rate over time, error budget remaining (count and percentage), and predicted SLO compliance at current burn rate. Use a stat panel for current compliance (big number), a time series for burn rate, a gauge for error budget remaining, and a time series for predicted compliance.

### 10.12 SLO Implementation in Prometheus

Recording rules: slo:error_budget:rate5m = rate(sli:error:total[5m]) / rate(sli:total:total[5m]) minus (1 minus slo_target) which calculates the burn rate. Store the error budget metric itself: slo:error_budget:remaining = 1 minus (slo:error_budget:consumed)[offset 30d] divided by slo_target_window_budget. This requires careful offset handling.

### 10.13 SLO Implementation with OTel

Use OTel metrics to define SLIs: create a counter for good events and a counter for total events. Use OTel views to aggregate these into the SLO ratio. Export to Prometheus or backend that supports recording rules for burn rate computation. OTel's metric API supports delta and cumulative counters needed for SLO computation.

### 10.14 SLO for Latency

Latency SLO: good event is a request with duration below threshold (e.g., 200ms for p99, 500ms for p95). Use histogram buckets to count good events: http_requests_duration_seconds_bucket{le="0.2"} for 200ms threshold. The ratio of good bucket count to total count gives the latency SLI. Choose the threshold based on user expectations.

### 10.15 SLO for Availability

Availability SLO: good event is a request that does not result in a server error (HTTP status less than 500). Use counter labels: http_requests_total{status_code=~"2..|3..|4.."} for good, http_requests_total for total. Some organizations treat 4xx as good (client errors are not service failures), others treat them as neutral (exclude from SLO computation).

### 10.16 SLO for Freshness

Freshness SLO for data pipelines and batch jobs: good event is data updated within the expected interval. Example: "data is less than 1 hour old." Implement using a gauge that records the timestamp of the last successful update (data_freshness_timestamp_seconds). Alert when (time() minus data_freshness_timestamp_seconds) exceeds the freshness threshold.

### 10.17 SLO for Throughput

Throughput SLO: good event is processing at least N items per time window. Example: "process at least 10,000 messages per minute." Implement using counter rate. Alert when rate drops below threshold. Throughput SLOs are important for batch processing and stream processing systems.

### 10.18 Error Budget Policy

When error budget is exhausted: freeze all non-critical deployments, prioritize reliability improvements over feature work, conduct a blameless postmortem, and potentially roll back recent changes. Error budget policy should be defined in advance and enforced through automated gates (CI/CD pipeline rejects deployments when error budget is exhausted for critical services).

### 10.19 SLO Ownership

Each SLO should have an owner (a team or individual responsible for meeting the SLO). The owner monitors the SLO dashboard, responds to burn rate alerts, and drives reliability improvements. SLO ownership prevents the "everyone's SLO is no one's SLO" problem. Document SLO ownership in the service catalog.

### 10.20 SLO Review and Adjustment

Review SLO targets periodically: are they still appropriate for user expectations? Are they too aggressive (causing unnecessary caution)? Are they too lenient (allowing poor reliability)? Adjust SLO targets based on user feedback, business requirements, and historical performance. Document the rationale for SLO target choices.

### 10.21 SLO Conclusion

SLO-based alerting is the most mature approach to reliability alerting. It connects technical metrics to business impact, provides clear prioritization signals, and enables error budget policies. The Observability Engineer implements SLO instrumentation, burn rate alerting, SLO dashboards, and error budget tracking.


## P11 — Cardinality and Cost Management

### 11.1 Introduction to Cardinality

Cardinality is the number of unique combinations of metric name and label values in a time-series database. High cardinality is the single biggest cost driver and performance killer in observability systems. Managing cardinality is a core responsibility of the Observability Engineer.

### 11.2 What Causes High Cardinality

Unbounded label values: user IDs, request IDs, email addresses, session tokens, IP addresses, or any label whose values are effectively infinite. High-label count: metrics with 10+ labels multiply cardinality. Label permutations: every unique combination of label values creates a new time series. Histograms with many buckets multiply cardinality further. Inefficient instrumentation: creating metrics per-request or per-user instead of aggregated.

### 11.3 Cardinality Blowup Example

A metric http_requests_total with labels {service, method, endpoint, status_code, user_id}. If there are 10 services, 4 methods, 50 endpoints, 5 status codes, and 1,000,000 users: cardinality would be 10 times 4 times 50 times 5 times 1,000,000 = 10 billion time series. This would crash any time-series database. The fix: remove user_id from labels. User_id belongs in traces and logs, not metric labels.

### 11.4 Cardinality in Traces

Trace cardinality: every unique combination of span name, service name, and attribute values. Span attributes like user_id, session_id, order_id create high cardinality. Tracing backends (Honeycomb, Tempo) are designed for high cardinality — they index attributes but store them differently from metrics. Even so, unbounded attribute growth increases storage and query costs.

### 11.5 Cardinality in Logs

Log cardinality: every unique log message pattern creates a log stream or index entry. Logs with template parameters (e.g., "User X logged in") create high cardinality because X is different for every log entry. Log aggregation tools handle this by extracting parameters into fields and indexing patterns separately. But excessive unique fields increase index size.

### 11.6 Cardinality Detection

Use promtool to analyze TSDB cardinality: promtool tsdb analyze /path/to/tsdb. Shows top 10 series by label value cardinality. Use Prometheus API: /api/v1/status/tsdb. Use Grafana Explore with cardinality queries. Set up cardinality alerts: when series count per metric exceeds threshold, alert. Monitor cardinality trends over time.

### 11.7 Cardinality Remediation

When cardinality is too high: identify the offending metric and label. Determine if the label is unbounded (user_id, request_id). Remove the unbounded label from the metric (move to trace or log attributes). If the label is bounded but high-value, verify cardinality against budget. Use relabeling to drop high-cardinality labels at scrape time. Use aggregation to reduce cardinality before storage.

### 11.8 Cardinality Budget

Define a per-metric cardinality budget: "this metric should not exceed 1,000 time series." Define a per-service cardinality budget: "this service should not emit more than 10,000 time series." Define a total cardinality budget for the organization. Monitor cardinality against budgets. When a metric or service exceeds budget, the owning team must remediate or justify the increase.

### 11.9 Cost Components of Observability

Costs include: metric storage (per time series per month), metric query compute (per query, especially expensive aggregation queries), trace storage (per span per month), log storage (per GB per month), log indexing (per GB indexed), network egress (inter-region, inter-cloud), and compute for collectors and agents. Each cost component requires different optimization strategies.

### 11.10 Metric Storage Cost Calculation

Calculate metric storage cost: number of time series multiplied by storage cost per series per month. Example: 500,000 time series at .10 per series per month = ,000/month. A histogram adds 17 series (15 buckets plus count plus sum). Multiply by number of instances and endpoints. Storage cost is linear in series count. Reduce series count to reduce cost.

### 11.11 Trace Storage Cost Calculation

Calculate trace storage cost: spans per second multiplied by span size multiplied by retention. Example: 10,000 spans/second at 1KB per span for 30 days = 10,000 times 1024 times 86400 times 30 = approximately 26 TB. At .02/GB/month for object storage = approximately /month. At .10/GB/month for indexed storage = approximately ,600/month. Sampling reduces these numbers dramatically.

### 11.12 Log Storage Cost Calculation

Calculate log storage cost: logs per second multiplied by log size multiplied by retention. Example: 100,000 logs/second at 1KB per log for 30 days = 100,000 times 1024 times 86400 times 30 = approximately 258 TB. At .05/GB/month = approximately ,900/month. Log volume is the biggest cost driver for most organizations.

### 11.13 Cost Optimization Strategies

Sampling: reduce trace and log volume by keeping only representative data. Aggregation: pre-compute aggregates and discard raw data after short retention. Retention tiering: hot storage for 7 days, warm for 30, cold for 365. Cardinality reduction: remove unbounded labels, reduce label count. Compression: enable compression in backends and collectors. Object storage: use S3/GCS for long-term storage instead of SSD.

### 11.14 Sampling for Cost

Probabilistic sampling: keep 1% of traces, reduce trace storage cost by 99%. The trade-off: you may miss rare events. Tail-based sampling: keep all error traces, sample healthy traces. This preserves debugging value while reducing cost. For logs, sample info/debug aggressively, keep all errors and security events. Configure sampling at the collector level for centralized control.

### 11.15 Aggregation for Cost

Pre-aggregate metrics at the collector or gateway: compute sum/avg/max by service, drop per-instance labels. Store only aggregated metrics long-term. Raw per-instance data is retained for 7 days for debugging, aggregated data is retained for 1 year for capacity planning. Aggregation trades query flexibility for cost.

### 11.16 Retention Tiers

Data lifecycle: raw telemetry (7-30 days), downsampled/aggregated (30-365 days), cold storage (1-7 years). Each tier has different storage costs. Hot: SSD, fast query, expensive. Warm: HDD or object storage, slower query, moderate cost. Cold: object storage, very slow query, cheapest. Configure retention tiers based on debugging needs and compliance requirements.

### 11.17 Vendor Cost Management

SaaS observability costs grow with data volume. Manage vendor costs by: negotiating volume discounts for committed data volume, using pre-aggregation to reduce volume, sampling to reduce volume before it reaches the vendor, using open-source backends for cost-insensitive workloads (bulk logging), and capping per-service data volume through quotas.

### 11.18 Cost Visibility and Chargeback

Make observability costs visible to service teams. Implement chargeback: each team sees the cost of their telemetry data. Cost visibility drives cost-conscious behavior: teams will optimize instrumentation when they see the dollar impact. Use tags/labels to attribute costs to teams. Publish cost dashboards showing cost per service, cost per signal type, and cost trends.

### 11.19 Cardinality and Cost Conclusion

Cardinality and cost management are continuous activities, not one-time projects. The Observability Engineer monitors cardinality, enforces budgets, implements sampling and aggregation, manages retention tiers, and provides cost visibility to service teams. Cost management must be balanced against debugging value — reducing cost should not eliminate the data needed to debug incidents.


## P12 — System-Specific Observability

### 12.1 Introduction to System-Specific Observability

Different systems require different observability approaches. A database has different failure modes than a message queue, which has different failure modes than a Kubernetes cluster. The Observability Engineer must understand the specific failure modes of each system and design instrumentation accordingly. This section covers observability for common infrastructure components.

### 12.2 Database Observability: PostgreSQL

Key metrics: query rate (queries per second by type: SELECT, INSERT, UPDATE, DELETE), query latency (p50/p95/p99), connection count (active, idle, waiting), connection utilization (connections used / max_connections), replication lag (in bytes and seconds), cache hit ratio (buffers hit / buffers read), transaction rate (commits and rollbacks per second), dead tuple count (vacuum pressure), lock waiting (number of queries waiting on locks), and disk I/O (read/write throughput and IOPS).

### 12.3 Database Observability: PostgreSQL Queries

Track slow queries through pg_stat_statements: query latency, rows returned, blocks hit, blocks read, and frequency. Identify queries with high total execution time (optimization candidates) and queries with high latency variance (unstable performance). Export pg_stat_statements as Prometheus metrics using postgres_exporter. Alert on: connection saturation (connections greater than 80% of max), replication lag greater than threshold, and long-running queries.

### 12.4 Database Observability: MySQL

MySQL metrics: connections (active, threads_connected, threads_running), query throughput (Queries, Questions, Com_select, Com_insert, etc.), InnoDB metrics (buffer pool hit ratio, row lock waits, log file size), replication status (Seconds_Behind_Master, Slave_IO_Running, Slave_SQL_Running), and table metrics (rows, data size, index size). Use mysqld_exporter to export metrics. Alert on replication lag, connection saturation, and InnoDB deadlocks.

### 12.5 Database Observability: Redis

Redis metrics: hit ratio (keyspace_hits / (keyspace_hits + keyspace_misses)), memory usage (used_memory / maxmemory), eviction rate (evicted_keys per second), command rate (total_commands_processed per second), connected clients, replication status (master_link_status), latency (Redis SLOWLOG), and persistence status (last save time, AOF rewrite status). Use redis_exporter. Alert on memory approaching maxmemory (risk of eviction), replication link failure, and persistent reconnection.

### 12.6 Database Observability: MongoDB

MongoDB metrics: operation counters (inserts, queries, updates, deletes, getmore, commands per second), query latency (by operation type), connection count, memory usage (resident, virtual, mapped), page faults, replication lag (optime difference between primary and secondary), and assertion rates (msg, warning, regular, user, rollovers). Use mongodb_exporter. Alert on high page faults (insufficient RAM working set), replication lag, and assertion warnings.

### 12.7 Database Observability: Elasticsearch

Elasticsearch metrics: cluster health (green/yellow/red), node status (heap usage, disk usage, CPU), index metrics (document count, index rate, search rate, segment count), search latency (query time, fetch time), indexing latency, merge metrics (merge rate, merge time), thread pool metrics (search, index, bulk queue sizes and rejections), and garbage collection metrics (GC count, GC time, promotion pressure). Use elasticsearch_exporter.

### 12.8 Message Queue Observability: Kafka

Kafka metrics: broker metrics (request rate, request time, network IO, disk utilization), topic metrics (message in rate, message out rate, total messages), partition metrics (leader count, in-sync replica count, under-replicated partitions, offline partitions), consumer group lag (difference between log end offset and consumer offset), and producer metrics (request rate, error rate, compression ratio).

### 12.9 Message Queue Observability: Kafka Consumer Lag

Consumer lag is the most important Kafka metric. Lag = offset of latest message minus offset of last committed message. High lag means consumers are falling behind. Use kafka_exporter or JMX exporter to export consumer group metrics. Alert on lag exceeding thresholds (indicates consumer bottleneck). Create dashboards showing lag by consumer group and partition.

### 12.10 Message Queue Observability: RabbitMQ

RabbitMQ metrics: queue metrics (depth, messages ready, messages unacknowledged, consumers), node metrics (file descriptors, sockets, memory, disk free), connection metrics (connections, channels), publish rate and consume rate, delivery rate, and acknowledgement rate. Use rabbitmq_exporter. Alert on queue depth growing (consumers falling behind), disk free below threshold (flow control activated), and memory high watermark reached.

### 12.11 Kubernetes Observability: Cluster Level

Cluster-level metrics: node health (Ready status, conditions: MemoryPressure, DiskPressure, PIDPressure), pod health (pending pods, crash-looping pods, pods in CrashLoopBackOff, ImagePullBackOff), resource utilization (total and allocatable CPU and memory across cluster), and API server metrics (request rate, latency, error rate, etcd latency).

### 12.12 Kubernetes Observability: Pod Level

Pod-level metrics: container CPU usage (as percentage of request and limit), container memory usage (as percentage of request and limit), network I/O (bytes in/out per second by pod), volume metrics (disk usage for persistent volumes), and restart count. Use metrics-server for resource metrics, kube-state-metrics for object state, and cadvisor for container metrics.

### 12.13 Kubernetes Observability: Node Level

Node-level metrics: node_exporter metrics (CPU, memory, disk, network, load), Kubelet metrics (pod count, operation latency), container runtime metrics (container start latency, image pull latency), and eviction pressure (memory.available, nodefs.available, imagefs.available). Alert on node pressure conditions, Kubelet health, and node resource exhaustion.

### 12.14 Kubernetes Observability: Networking

Network observability on Kubernetes: pod-to-pod latency, service-to-service latency, DNS resolution latency and errors, CNI plugin metrics, and service mesh metrics (Istio or Linkerd RED metrics per service). Use eBPF-based tools (Cilium, Pixie) for network-level observability without sidecars. Alert on DNS errors, connection failures, and high latency between services.

### 12.15 Kubernetes Observability: Events

Kubernetes events capture important state changes: pod scheduling failures, node conditions, volume mount failures, config map errors, and resource quota violations. Events are often overlooked but are invaluable for debugging. Use event_exporter or kube-eventer to export events as metrics or logs. Create dashboards for Kubernetes events by type and severity.

### 12.16 Kubernetes Observability: etcd

etcd is the storage backend for Kubernetes: cluster health (leader changes, proposal failures), latency metrics (backend commit latency, disk write latency, proposal apply latency), database size (in MB), and client request rate and error rate. etcd issues can cause cluster-wide instability. Alert on leader changes, proposal failures, and database size growing near quota.

### 12.17 Load Balancer Observability

Load balancer metrics: request rate, error rate (5xx responses), latency distribution, active connections, connection rate, and SSL handshake rate. For cloud LBs (ALB, NLB, GCLB), these metrics are provided by the cloud provider. Alert on error rate spikes, latency degradation, and connection saturation.

### 12.18 CDN Observability

CDN metrics: cache hit ratio (percentage of requests served from cache), origin latency (time to fetch from origin when cache miss), error rate (origin errors, CDN edge errors), bandwidth (egress in Gbps), and status code distribution (2xx, 3xx, 4xx, 5xx). Low cache hit ratio indicates cache configuration problems. High origin latency indicates origin server issues.

### 12.19 Database Observability: Connection Pooling

Connection pool metrics for applications using connection pools (HikariCP, pgBouncer, etc.): active connections, idle connections, pending connections (waiting for a connection), max pool size, connection acquire time (how long to get a connection from pool), and connection timeout rate. Alert on connection starvation (pending connections growing, timeout rate increasing).

### 12.20 TLS/SSL Certificate Observability

Certificate metrics: days until expiration, certificate validity status (valid, expired, not yet valid), and renewal status. Use blackbox_exporter with http_2xx module to check certificate expiry. Use dedicated certificate exporters (ssl_exporter, cert_exporter). Alert on certificates expiring in less than 14 days.

### 12.21 DNS Observability

DNS metrics: resolution latency, resolution success rate, record TTL, and query rate. Use blackbox_exporter dns module to probe external DNS. Use CoreDNS metrics (if using CoreDNS in Kubernetes): request rate, error rate, latency, and cache hit ratio. DNS issues can cause cascading failures across distributed systems.

### 12.22 System-Specific Conclusion

Each system has unique failure modes and requires specific metrics, dashboards, and alerts. The Observability Engineer builds this knowledge for every system in their portfolio. Start with the standard RED/USE framework and add system-specific metrics as failure modes are discovered. Document system-specific instrumentation in runbooks and dashboards.


## P13 — Worked Examples

### 13.1 Example: Setting Up RED Metrics for an HTTP Service

Problem: You have a new Go HTTP service that needs RED metrics (Rate, Errors, Duration). Approach: Use the Prometheus Go client library to create counters for requests and errors, and a histogram for latency. Steps: 1) Import Prometheus client library. 2) Define metrics: http_requests_total with labels method, endpoint, status_code. http_errors_total with labels method, endpoint, error_type. http_request_duration_seconds with labels method, endpoint, using default buckets. 3) Instrument HTTP handler: increment request counter on entry, record duration on exit, increment error counter on error responses. 4) Expose /metrics endpoint via HTTP. 5) Configure Prometheus scrape config for the service. 6) Create Grafana dashboard with RED panels. 7) Create recording rules for pre-computed rates. Result: Service has standard RED metrics that can be aggregated across instances and used in cross-service dashboards.

### 13.2 Example: Kubernetes Pod Stuck in CrashLoopBackOff

Situation: A pod is crash-looping and you need to debug why. Approach: 1) Check kube-state-metrics for pod status changes over time. 2) Check container restart count metric (kube_pod_container_status_restarts_total). 3) Access logs from the crashed container (kubectl logs pod-name --previous). 4) Check events for the pod (kubectl describe pod). 5) Correlate with resource metrics: was the pod OOMKilled (container_last_seen, container_memory_working_set_bytes)? Was it terminated with error code 137 (OOM) or error code 139 (segfault)? 6) Check the config map and secrets the pod depends on. 7) Trace the deployment change that introduced the crash. Dashboard: Create a deployment health dashboard showing restart count, memory usage, CPU usage, and error logs per deployment.

### 13.3 Example: Diagnosing High Latency via Tracing

Situation: Users report slow response times for a checkout endpoint. Approach: 1) Open the RED dashboard for the checkout service. Confirm latency is elevated (p95, p99 above baseline). 2) Check if latency increased after a recent deploy (use annotations). 3) Open trace explorer, filter by checkout service, sort by duration descending. 4) Inspect the slowest trace: identify the critical path span. 5) Is the bottleneck a database query? Check db.statement attribute for the slow query. 6) Is the bottleneck an external API call? Check http.url attribute. 7) Correlate with logs from the slow span: look for error messages or warnings. 8) Check downstream service metrics. Resolution: The slow trace reveals a missing database index causing a full table scan. Add index, verify latency returns to baseline.

### 13.4 Example: Setting Up SLO-Based Burn Rate Alerting

Situation: You need to set up SLO-based alerting for a critical payment service with target 99.95% availability over 30 days. Approach: 1) Define SLI: count of HTTP 5xx responses divided by total requests. 2) Create Prometheus recording rules for good and total events. 3) Compute burn rate: (1 - (good/total)) / (1 - 0.9995). 4) Configure three alert rules: burn rate greater than 10 for 5 minutes, burn rate greater than 3 for 1 hour, burn rate greater than 1 for 24 hours. 5) Create SLO dashboard showing current compliance, remaining error budget, and burn rate. 6) Configure Alertmanager routing: burn rate >10 alerts page on-call immediately, burn rate >3 sends to team chat during business hours, burn rate >1 sends to team dashboard. 7) Test alerts with synthetic traffic generating 5xx errors at known rates. 8) Document runbook for each alert. Result: Team is alerted before SLO is violated, with sufficient time to investigate and remediate.

### 13.5 Example: Log Analysis for Incident Debugging

Situation: An alert fires for high error rate on the payment service at 2 AM. Approach: 1) Open log explorer (Loki/Grafana), set time range to last 1 hour. 2) Query: {service="payment"} |= "error". 3) Group by error_type, count. 4) Identify the most common error: "connection refused to database replica". 5) Look for temporal correlation: errors started at 1:58 AM. 6) Check deployment annotations: a new database configuration was rolled out at 1:55 AM. 7) Check logs from the database service: "configuration reload initiated", "replication connection failed". 8) The new config has wrong replica endpoint. 9) Open trace for one of the failed requests: trace shows connection attempt, failure, retry, failure, circuit break. 10) Resolution: roll back database configuration. Dashboard: Create a correlation dashboard showing error logs, deployment annotations, and trace samples on a shared timeline.

### 13.6 Example: Cardinality Explosion Remediation

Situation: Observability costs doubled in a month. Investigation reveals a metric with exploding cardinality. Approach: 1) Run promtool tsdb analyze to find the top series by cardinality. 2) Identify http_request_duration_seconds has 2 million series (expected: 10,000). 3) Examine label values: labels include request_id (unbounded). 4) Find the instrumentation code: the histogram is created with request_id as a label. 5) Remove request_id from metric labels (it belongs in trace attributes). 6) Use relabeling in Prometheus config to drop request_id label at scrape time as immediate fix. 7) Redeploy service with fixed instrumentation. 8) Wait for stale series to expire (5 days). 9) Verify cardinality returns to expected level and costs decrease. Prevention: Add cardinality checks in CI/CD pipeline — fail builds that introduce unbounded labels.

### 13.7 Example: Multi-Cluster Observability Architecture

Situation: Organization has 5 Kubernetes clusters across 3 regions (US-East, US-West, EU). Approach: 1) Deploy OTel Collector as DaemonSet in each cluster (agents). 2) Deploy cluster-local OTel Collector gateway in each cluster (aggregation, sampling, cluster metadata enrichment). 3) Deploy Prometheus (with Thanos sidecar) in each cluster for metrics. 4) Deploy Loki in each cluster for logs. 5) Deploy Tempo in each cluster for traces. 6) Configure a global Thanos querier that queries all clusters. 7) Configure global Grafana with data sources for each cluster's Prometheus/Loki/Tempo. 8) Create global dashboards with cross-cluster queries. 9) Configure per-cluster alerting (region failures should not trigger cross-region alerts). 10) Implement data residency: EU telemetry stays in EU backends. Result: Unified observability across all clusters with regional isolation and global querying.

### 13.8 Example: Service Mesh Observability with Istio

Situation: You have an Istio service mesh and need to leverage it for observability. Approach: 1) Istio proxies (Envoy) automatically export RED metrics for all service-to-service traffic: istio_requests_total (rate, latency, error rate by source/destination). 2) Istio provides per-request tracing with Envoy generating trace spans. 3) Configure Istio for 1% trace sampling (default). 4) Create dashboards using Istio metrics: service dependency graph, service health by RED, and latency heatmap. 5) Use Istio telemetry API for custom metrics: request properties, header values. 6) Alert on Istio errors: istio_requests_total with response_code=5xx. 7) Correlate Istio traces with application traces. Benefits: Zero-code RED metrics for all mesh traffic, automatic trace context propagation, and service dependency discovery.

### 13.9 Example: Database Query Performance Investigation

Situation: The checkout endpoint is slow. Traces show a database query taking 2 seconds. Approach: 1) Identify the slow query from trace attributes (db.statement). 2) Check database metrics: query latency p95 for this query pattern. 3) Check database locks: number of waiting queries, lock duration. 4) Check database connections: active connections, connection pool utilization. 5) Check database CPU and I/O: high utilization suggests resource contention. 6) Run EXPLAIN ANALYZE on the slow query in production (carefully, using read replica). 7) Identify the issue: sequential scan on a large table (missing index). 8) Create index on the filtered column. 9) Verify query latency drops to under 10ms. 10) Add database query dashboard showing slow queries, lock waits, and index usage. Dashboards: Database overview dashboard (connections, queries, latency), and per-query dashboard (execution plan, latency over time, row estimates vs actual).

### 13.10 Example: Logging Migration from Unstructured to Structured

Situation: Legacy service logs in unstructured text. Need to migrate to structured JSON. Approach: 1) Add structured logging library to the service (e.g., zap for Go). 2) Define required schema: timestamp, level, message, service, trace_id, span_id. 3) Migrate all existing log statements: replace fmt.Printf and log.Printf with structured log calls. 4) Add trace context propagation: integrate logging library with OTel SDK. 5) Remove unstructured log output (keep both during transition period). 6) Deploy: both structured and unstructured logs during transition. 7) Validate: confirm structured logs are searchable in log aggregator. 8) Remove unstructured log output after validation. 9) Update log aggregator parsers: skip parsing for structured logs (pass-through). 10) Document the schema for other teams. Benefits: Improved searchability, field-based filtering, trace correlation, and cost-effective log management.

### 13.11 Example: Setting Up Blackbox Monitoring for External Dependencies

Situation: Your service depends on external APIs (payment gateway, shipping provider). Need to monitor their availability. Approach: 1) Deploy blackbox_exporter. 2) Configure probe module: http_2xx with timeout 10s. 3) Configure Prometheus scrape: module=[http_2xx], target=[payment-gateway.com/api/health]. 4) Create metrics: probe_success (1 if healthy), probe_duration_seconds, probe_http_status_code. 5) Create dashboard showing external dependency health. 6) Create alerts: probe_success == 0 for 2 minutes. 7) Add synthetic transactions: periodic end-to-end test that uses the external API and reports success/failure. 8) Document runbook: what to do when payment gateway is down (switch to fallback provider, alert vendor, communicate to users). 9) Track external dependency SLOs: compare actual availability against vendor SLA.

### 13.12 Example: Cost Optimization at Scale

Situation: Observability costs are /month and growing. Need to reduce by 30%. Approach: 1) Audit cost by signal type: metrics , traces , logs . 2) Logs are the biggest cost driver. 3) Implement log sampling: keep 100% errors, 10% info, 0% debug. Reduces log volume by 70%. 4) Reduce log retention: hot 7 days (from 30), cold 90 days (from 365). 5) Implement trace sampling: 1% for healthy services, 100% for critical services with tail-based sampling preserving errors. 6) Remove unused metrics: audit all metrics, remove those not queried in last 90 days (20% reduction). 7) Aggregate metrics at collector: remove per-instance labels for long-term storage. 8) Negotiate vendor contract: commit to lower volume for lower per-unit price. 9) Implement cost dashboards: show cost per team, per service. 10) Set quotas: each team limited to their current volume plus 20%. 11) Result: costs reduced to /month (35% reduction) without eliminating valuable debugging data.

### 13.13 Example: Incident Response with Observability

Situation: Production incident: users report errors when checking out. Approach: 1) Check SLO dashboard: compliance dropped to 97% (below 99.95% target), burn rate at 30. 2) Check RED dashboard for checkout service: error rate at 15% (normal is under 1%). 3) Open trace explorer for checkout service, filter by error status, last 15 minutes. 4) Inspect recent error traces: all fail at the "validateAddress" span with error "address validation service timeout". 5) Check address validation service dashboard: latency at 10s (normal 50ms), error rate at 80%. 6) Check address validation service logs: "connection pool exhausted - all 50 connections in use". 7) Check address validation service traces: connections are held by long-running requests from another service. 8) Identify the cause: a deploy to the search service changed its address validation calls to not release connections. 9) Roll back search service deploy. 10) Monitor recovery: error rate drops, SLO compliance recovering. 11) Document incident: root cause, detection time, mitigation time, and observability gaps.

### 13.14 Example: Building an Observability as Code Pipeline

Situation: Need to manage dashboards, alerts, and recording rules through GitOps. Approach: 1) Create Git repository for observability configuration. 2) Structure: /dashboards/, /alerts/, /rules/, /slo/. 3) Write Grafana dashboards as JSON (exported and committed). 4) Write Prometheus rules as YAML files. 5) Use Jsonnet for dashboard generation (parameterized by service name). 6) Write Terraform configurations for Grafana Cloud resources (dashboards, alert rules, notification policies, data sources). 7) Set up CI/CD pipeline: on PR merge, run Terraform apply and promtool validation. 8) Use promtool test rules to validate alert expressions against sample data. 9) Deploy through staging environment first (dry run with no notifications). 10) Validate: metrics appear, dashboards render, alerts evaluate without firing. 11) Promote to production. Benefits: Reproducible configuration, code review for changes, rollback capability, and audit trail.

### 13.15 Example: Setting up OTel Collector Pipeline

Situation: Need to collect telemetry from 50 services and export to multiple backends. Approach: 1) Deploy OTel Collector agent as DaemonSet (one per node). 2) Configure OTLP receiver on port 4317. 3) Configure batch processor (timeout 5s, send_batch_size 10000). 4) Configure memory_limiter processor (limit 512MB). 5) Configure attributes processor: add cluster name, datacenter. 6) Configure k8sattributes processor: add pod name, namespace, node name. 7) Configure tail-based sampling processor: keep 100% of error traces, 5% of healthy traces. 8) Configure OTLP exporter to gateway: gateway:4317. 9) Deploy OTel Collector gateway (3 replicas behind load balancer). 10) Gateway configuration: receive from agents, apply global redaction processor (remove credit card numbers from log attributes), apply filter processor (drop health check traces), export metrics to Prometheus (prometheusremotewrite), export traces to Tempo (OTLP), export logs to Loki (OTLP). 11) Monitor collector metrics (otelcol_process_*, otelcol_exporter_*). Result: Unified telemetry pipeline with appropriate processing at each tier.

### 13.16 Example: Kubernetes Events to Alerting

Situation: Need to alert on Kubernetes events (pod evictions, node pressure, scheduler failures). Approach: 1) Deploy kube-state-metrics to expose event metrics (or use event_exporter). 2) Key metrics: kube_event_rate{type="Warning"}, kube_pod_status_reason{reason="Evicted"}, kube_node_status_condition{condition="MemoryPressure", status="true"}. 3) Create Prometheus alerting rules: alert on Warning events for critical namespaces exceeding 5 per minute, evicted pods, and node pressure conditions. 4) Create dashboard showing Kubernetes events by type, source, and time. 5) Route alerts to platform engineering team. 6) Create runbooks for each event type. Result: Proactive detection of Kubernetes-level issues before they cause application failures.

### 13.17 Conclusion: Worked Examples

These examples demonstrate the practical application of observability principles to real-world situations. The Observability Engineer should maintain a personal library of patterns and examples that can be adapted to specific situations. Every incident is an opportunity to improve observability — document what worked and what was missing.


## P14 — Anti-Patterns

### 14.1 Introduction to Anti-Patterns

Anti-patterns are common but counterproductive practices in observability. Recognizing and avoiding anti-patterns is as important as applying best practices. This section catalogs the most damaging observability anti-patterns and provides guidance on how to avoid them.

### 14.2 Anti-Pattern: Dashboard Overload

Creating dashboards with dozens of panels that show every available metric. Result: engineers cannot find the information they need during incidents, so they ignore the dashboard entirely. Fix: design purposeful dashboards with 8-12 panels. Group metrics by relevance. Remove panels that have never been used in incident response. Use drill-down links instead of cramming everything into one dashboard.

### 14.3 Anti-Pattern: Alert Fatigue

Creating alerts for every possible failure mode, resulting in hundreds of alerts per day. Result: on-call engineers ignore alerts, real problems are missed, trust in the alerting system is destroyed. Fix: every alert must justify its existence. Alert only on actionable conditions. Tune thresholds continuously. Remove noisy alerts. Use SLO-based alerting instead of threshold-based alerting.

### 14.4 Anti-Pattern: Metrics Without Labels

Exporting metrics with few or no labels, making it impossible to slice by service, endpoint, or status code. Result: metrics are useless for debugging — you know something is wrong but not where. Fix: add relevant labels (service, method, endpoint, status_code). Follow RED methodology. Use labels for dimensions you will query or alert on.

### 14.5 Anti-Pattern: Unbounded Labels

Adding user IDs, request IDs, email addresses, or other unbounded values as metric labels. Result: cardinality explosion, backend performance degradation, and costs skyrocketing. Fix: never put unbounded values in metric labels. Use trace attributes or log fields for high-cardinality data. Use relabeling to drop unbounded labels if they are inadvertently added.

### 14.6 Anti-Pattern: Golden Dashboard Obsession

Spending weeks perfecting the "ultimate" dashboard that never gets used. Result: wasted time, and the dashboard is outdated by the time it is finished. Fix: build minimal viable dashboards quickly. Iterate based on actual incident use. A dashboard that is 80% complete and used daily is better than a perfect dashboard that is never finished.

### 14.7 Anti-Pattern: Monitoring Everything

Collecting every possible metric, storing all logs, and sampling all traces at 100%. Result: costs spiral out of control, and the signal-to-noise ratio is terrible. Fix: practice cost-conscious observability. Instrument with intent. Ask "what question will this data answer?" before adding instrumentation. Sample aggressively. Delete data that has no demonstrated value.

### 14.8 Anti-Pattern: Three Separate Silos

Running metrics, logs, and traces as completely separate systems with different UIs, different query languages, and no correlation. Result: debugging requires context-switching between three tools, and cross-correlation is manual and slow. Fix: integrate the three pillars through trace IDs (every log has trace_id, metrics have exemplars). Use tools that support unified querying (Grafana with Prometheus, Loki, Tempo).

### 14.9 Anti-Pattern: Manual Instrumentation

Manually instrumenting every service with custom metric names, label schemas, and sampling strategies. Result: inconsistent instrumentation, services that are not instrumented at all (forgotten), and high maintenance burden. Fix: use auto-instrumentation (OTel) for standard coverage. Use shared instrumentation libraries (Prometheus client, OTel SDK) with standardized naming. Use platform instrumentation (service mesh, eBPF) for universal coverage.

### 14.10 Anti-Pattern: No Sampling

Storing every trace and every log because "we might need it." Result: storage costs dominate the observability budget, and query performance degrades. Fix: implement sampling. Start with 1% for traces, 10% for info logs. Use tail-based sampling to preserve interesting traces. Increase sampling only when there is a demonstrated need.

### 14.11 Anti-Pattern: Black Box Monitoring

Relying entirely on infrastructure metrics (CPU, memory, disk) without application-level instrumentation. Result: you know the server is unhealthy but not which service is failing or why. Fix: implement RED metrics at the service level. Instrument request rate, error rate, and latency for every service. Complement with USE metrics for infrastructure.

### 14.12 Anti-Pattern: Perfectionism

Waiting for perfect instrumentation before enabling observability for a service. Result: services run in production with no observability for months. Fix: start with auto-instrumentation (OTel agent) for immediate RED metrics and traces. Add manual instrumentation incrementally based on debugging needs. Minimal observability is infinitely better than no observability.

### 14.13 Anti-Pattern: No Alert Testing

Creating alert rules and deploying them to production without testing. Result: alerts may never fire (silent failures), may fire on every evaluation (noise), or may have incorrect routing (wrong team paged). Fix: test alert rules in staging with synthetic data. Use promtool to validate rule syntax. Use integration tests that trigger alerts and verify notification delivery.

### 14.14 Anti-Pattern: No Observability of Observability

Not monitoring the observability pipeline itself. Result: telemetry silently stops flowing, alerts do not fire, and the observability system becomes a blind spot. Fix: monitor agent health, collector health, backend health, and end-to-end telemetry latency. Alert on pipeline degradation. The observability system must be at least as observable as the systems it monitors.

### 14.15 Anti-Pattern: Vendor Lock-In

Using vendor-specific instrumentation SDKs and protocols that cannot be changed without re-instrumenting all services. Result: difficult and expensive to switch vendors, vendors capture pricing power. Fix: use open standards (OpenTelemetry, Prometheus format, OTLP). Instrument with vendor-neutral APIs. Choose vendors based on their support for open standards.

### 14.16 Anti-Pattern: No Context in Alerts

Alert notifications that just say "high CPU" with no link to dashboard, no runbook, and no information about which service is affected. Result: on-call engineer spends 10 minutes figuring out what is wrong before they can start investigating. Fix: include full context in alert notifications: current value, threshold, link to dashboard, link to runbook, service name, severity, and team.

### 14.17 Anti-Pattern: Static Thresholds

Using the same static thresholds for all services, all the time. CPU alert at 80% for every service, regardless of workload characteristics. Result: some services always alert (annoying), others never alert (silent failures). Fix: use different thresholds per service based on normal baselines. Use SLO-based alerts for service-level metrics. Use dynamic thresholds or predictive alerts where possible.

### 14.18 Anti-Pattern: Snowflake Dashboards

Every team builds dashboards with different naming conventions, different label schemas, and different visual styles. Result: cross-team debugging is painful, and organizational dashboards cannot aggregate data. Fix: establish organization-wide dashboard standards. Provide dashboard templates. Use service catalogs to auto-generate dashboards with consistent structure.

### 14.19 Anti-Pattern: Ignoring Observability Debt

Delaying instrumentation improvements, not updating dashboards, not tuning alerts, and accumulating technical debt in the observability system. Result: observability quality degrades over time, and the system becomes less useful. Fix: track observability debt alongside technical debt. Allocate a percentage of each sprint to observability improvements. Treat observability as a first-class engineering concern.

### 14.20 Anti-Pattern: Centralizing Everything

One team (observability team) owns all dashboards, all alerts, all instrumentation. Result: the team becomes a bottleneck, services lack service-specific observability, and developers are not empowered. Fix: provide self-service observability tools and platforms. Let service teams own their dashboards, alerts, and instrumentation within the organization's standards. The observability team builds the platform; service teams build on it.

### 14.21 Anti-Pattern: Confirmation Bias Dashboards

Building dashboards that only show metrics that confirm the current understanding of the system, ignoring metrics that might reveal unknown issues. Result: cognitive blind spots — the dashboard reinforces existing assumptions and hides emerging problems. Fix: include high-cardinality, explorable data sources alongside pre-built dashboards. Encourage ad-hoc querying. Use RED metrics as a baseline but provide access to raw telemetry for unexpected questions.

### 14.22 Anti-Pattern: Metrics as Logs

Using metrics (counters with unbounded labels) to record individual events, essentially using the metrics system as a logging system. Result: cardinality explosion, high cost, and poor query performance. Fix: use metrics for aggregation (counts over time), use logs for individual events, and use traces for request lifecycles. Choose the right tool for each purpose.

### 14.23 Anti-Pattern: Logs as Metrics

Parsing log files in the log aggregation system to extract metrics that should be exported as Prometheus metrics. Result: fragile parsing logic, expensive log queries for data that is better served by a numeric metric, and delayed metric availability. Fix: export metrics directly from the application using Prometheus client or OTel SDK. Use logs for diagnostic detail, not for metrics extraction.

### 14.24 Anti-Pattern: Slow Dashboards

Building dashboards with queries that take 30 seconds to load. Result: engineers stop using the dashboard during incidents (they cannot wait 30 seconds for answers). Fix: use recording rules to pre-compute expensive queries. Reduce panel count. Optimize Prometheus queries (avoid unbounded range selectors). Use appropriate step intervals. Consider backend scalability.

### 14.25 Anti-Pattern: Over-Aggregation

Aggregating all time series into a single number (e.g., total requests across all services) and losing all dimensionality. Result: you know the total load but cannot identify which service is causing problems. Fix: maintain meaningful labels that support slicing. Aggregate to the level needed for the question, but keep enough detail for debugging.

### 14.26 Anti-Pattern: The Unmaintained Runbook

Writing a runbook for an alert and never reviewing or updating it. Result: the runbook describes a system configuration that no longer exists, or suggests debugging steps that no longer apply. Fix: treat runbooks as living documents. Review them quarterly. Update them when systems change. Test runbooks during disaster recovery drills.

### 14.27 Anti-Pattern: Fire-and-Forget Observability

Setting up observability for a new service and never revisiting it. Result: as the service evolves, its instrumentation becomes outdated and less useful. New failure modes are not captured. Fix: treat observability as an ongoing activity. Review instrumentation during each major release. Add instrumentation for new features. Update dashboards when service architecture changes. Monitor observability effectiveness.

### 14.28 Anti-Pattern: No Business Metrics

Only monitoring technical health metrics (CPU, latency, error rate) without business metrics (conversion rate, revenue per request, user engagement). Result: technical issues are visible, but their business impact is unknown. Fix: instrument business-critical metrics alongside technical metrics. Track user-facing outcomes: successful purchases, signups, content views. Correlate business metrics with technical metrics to understand business impact of technical issues.

### 14.29 Anti-Pattern: The Single Pane of Glass Fallacy

Believing that one dashboard should show everything from infrastructure to application to business metrics. Result: a cluttered, unusable dashboard that shows everything and communicates nothing. Fix: use multiple dashboards for different audiences and purposes. Link between them. Do not try to solve all visibility needs with a single view.

### 14.30 Conclusion: Anti-Patterns

Anti-patterns are seductive because they often appear to solve immediate problems. Dashboard overload seems safer than missing information. Collecting everything seems better than missing data. But these short-term solutions create long-term problems: cost, noise, and distrust. The Observability Engineer must recognize anti-patterns and advocate for sustainable practices.


## P15 — Quality Gates

### 15.1 Introduction to Quality Gates

Quality gates are automated checks that validate observability quality before services are deployed to production. They ensure that every service meets minimum observability standards, prevent instrumentation regressions, and maintain organizational consistency. Quality gates shift observability left — from production debugging to pre-deployment validation.

### 15.2 Quality Gate: Metrics Coverage

Every service must export RED metrics (request rate, error rate, latency) before it can receive production traffic. Gate: CI/CD pipeline checks the /metrics endpoint of the service (in staging), validates that expected metrics exist with correct names and label schemas. Fail the deployment if RED metrics are missing. Verify: http_requests_total exists with labels service, method, endpoint, status_code. http_request_duration_seconds exists with labels service, method, endpoint. error ratio can be computed from these metrics.

### 15.3 Quality Gate: Structured Logging

All logs must be structured JSON with consistent schema. Gate: CI/CD pipeline captures a sample of log output from the service, validates that it is valid JSON with required fields (timestamp, level, message, service). Fail the deployment if logs are unstructured or missing required fields. Verify that log level defaults to info or higher (debug logging should not be on by default in production-configured build).

### 15.4 Quality Gate: Trace Context Propagation

Service must propagate trace context and create spans for key operations. Gate: integration test generates a request to the service with a synthetic trace parent header, then verifies that the service's outgoing requests carry the trace context. Verify that spans are created for HTTP handlers, database calls, and external API calls. Fail if context is dropped at any service boundary.

### 15.5 Quality Gate: Cardinality Validation

Service metrics must not introduce unbounded labels. Gate: analyze the service's /metrics output (in staging), check for label values that appear to be unbounded (UUID-like strings, timestamps, increasing sequences). Check cardinality of each label on each metric. Fail if any metric has a label with more than 100 unique values (or appropriate threshold). Use promtool or custom scripts for this analysis.

### 15.6 Quality Gate: SLO Definition

Critical services must have defined SLOs with burn rate alerts. Gate: CI/CD checks that a corresponding SLO definition exists in the observability as code repository for the service. Verify: SLO target is specified, SLIs are defined (latency, availability), burn rate alerts are configured, and the SLO dashboard exists. Fail deployment for critical services without SLO definitions.

### 15.7 Quality Gate: Dashboard Existence

Each service must have at least one dashboard. Gate: CI/CD checks the dashboard repository for a dashboard matching the service name. Verify: dashboard includes RED panels, links to related dashboards, and a text panel with service owner and on-call information. Fail if no dashboard exists or if dashboard has not been updated in the last 90 days.

### 15.8 Quality Gate: Alert Rules

Tag-alert rules must have associated runbooks. Gate: CI/CD scans Prometheus alert files and checks that every alert rule has a runbook annotation with a valid URL. Verify: runbook URL is reachable, runbook content exists and is not a template/stub. Fail if any alert has no runbook or if the runbook URL is unreachable.

### 15.9 Quality Gate: No Sensitive Data in Telemetry

Telemetry must not contain secrets, PII, or sensitive data. Gate: CI/CD scans the service code for logging statements that include variables named password, secret, token, key, cert, credit, ssn, or similar. Scans /metrics output for sensitive label values. Uses pattern matching to detect credit card numbers, email addresses, and API keys in log fields. Fail deployment if sensitive data is detected.

### 15.10 Quality Gate: Instrumentation Coverage

Minimum instrumentation coverage for critical code paths. Gate: integration tests exercise each major feature path and verify that spans and metrics are created. Use OTel test utilities to capture emitted telemetry and assert expected data. Fail if untested instrumentation means coverage below threshold (e.g., less than 80% of HTTP handlers produce metrics).

### 15.11 Quality Gate Performance: Overhead

Telemetry collection must not introduce excessive overhead. Gate: run performance tests with and without instrumentation, measure the difference in latency and throughput. Verify: latency overhead is less than 5%, throughput overhead is less than 5%, no excessive memory allocations from instrumentation. Fail if overhead exceeds thresholds.

### 15.12 Quality Gate: Observability as Code Validation

All observability configuration must be valid. Gate: run promtool check rules on alert and recording rule files. Run dry-run Terraform plan on dashboard configurations. Validate Grafana JSON dashboard format. Fail if syntax errors, invalid expressions, or configuration errors are found.

### 15.13 Quality Gate: Sampling Configuration

Trace and log sampling must be configured appropriately. Gate: check that the service or collector has sampling configured (not always_on for traces, not 100% for info logs). Verify: environment-specific sampling (higher in production, lower in staging), appropriate strategy (head-based for simple, tail-based for critical). Fail if sampling is not configured or is set to 100% without justification.

### 15.14 Quality Gate: Metric Expiry

Old, unused metrics must be retired. Gate: compare the service's current /metrics output against a baseline (last three months). Flag newly added metrics that are suspicious (no corresponding dashboard or alert). Flag removed metrics that were depended on by dashboards or alerts. Require review and approval for metric changes.

### 15.15 Quality Gate Implementation

Integrate quality gates into the CI/CD pipeline: pre-commit hooks for fast checks (linting, schema validation), CI stage for slow checks (integration tests, performance tests), and deployment gate for final validation (staging health checks). Implement quality gates as automated checks that block deployment on failure. Provide clear error messages: which gate failed, why, and how to fix it.

### 15.16 Quality Gate Evolution

Quality gates are not static. Review and update gates quarterly: are they catching real issues? Are there false positives causing frustration? Are there observability problems that quality gates are not catching? Add new gates based on incident learnings. Remove gates that no longer provide value. Calibrate thresholds based on organizational experience.

### 15.17 Quality Gate Ownership

Quality gates should be owned by the observability team, but maintained collaboratively with platform engineering (who integrates them into CI/CD) and service teams (who provide feedback on gate effectiveness). Gate failures should notify the service team with actionable remediation guidance.

### 15.18 Conclusion: Quality Gates

Quality gates automate the enforcement of observability standards. They catch instrumentation problems before they reach production, prevent regression, and ensure consistency across the organization. The Observability Engineer designs, implements, and maintains quality gates as a core part of the development workflow. Quality gates are the mechanism that transforms observability from a manual practice into an automated, enforced standard.

## Final Thoughts

Observability Engineering is a rapidly evolving discipline. The tools change (new backends, new protocols, new standards), but the principles remain constant: instrument deliberately, correlate everything, manage costs, design for debugging, and enable every engineer to understand their systems. The Observability Engineer who masters the material in this guide will be well-equipped to build observability systems that serve their organizations through incidents, growth, and change.

This skill document synthesizes thousands of person-years of production observability experience into a structured guide. It is meant to be studied, referenced during incident response, consulted during architecture reviews, and revisited as the field evolves. The best observability engineers never stop learning — every incident, every new service, and every tool change is an opportunity to improve.

"The observability system is never finished. It is always evolving, always improving, and always serving the engineers who rely on it to understand their systems in production."


## P1 Expansion — Deeper Persona Content

### 1.31 The Observability Engineer's Daily Workflow in Detail

A typical day begins with the observability health dashboard: checking pipeline latency, ingestion rates, and alert status. Then reviewing overnight alerts that fired but did not page (warning level) — are they noise or signal? Then a design review for a new service's instrumentation plan. Then debugging a production issue where the database latency increased but no deploy happened — tracing reveals a slow query pattern that emerged due to data growth. Then writing a new recording rule to pre-compute SLO burn rates for a new service. Then a presentation to engineering leadership on observability cost trends and optimization recommendations. Then updating the instrumentation guide for a new framework version. Then reviewing PRs that add metrics to existing services — ensuring they follow naming conventions and do not introduce cardinality issues. Then on-call handoff: reviewing active alerts, known issues, and ongoing investigations.

### 1.32 Building an Observability Culture

Culture change is the hardest part of observability engineering. Engineers naturally resist adding instrumentation because it feels like overhead. The Observability Engineer changes this by: making instrumentation easy (libraries, auto-instrumentation, templates), making instrumentation visible (dashboards show which services are well-instrumented), making instrumentation rewarding (praise teams that add good instrumentation in incident postmortems), and making missing instrumentation painful (incidents that are hard to debug because of poor instrumentation are learning opportunities). Culture change takes months to years — be patient and persistent.

### 1.33 The Observability Engineer as Incident Commander

During major incidents, the Observability Engineer may serve as the observability subject matter expert on the incident call. Responsibilities: confirm observability data is reliable and not itself the source of the problem, query traces and logs to narrow down the affected area, correlate metrics across services to understand blast radius, provide real-time dashboards for the incident command team, and document observability gaps for post-incident improvement. The Observability Engineer does not fix the bug — they enable others to fix it faster.

### 1.34 Observability Platform Reliability

The observability platform must be more reliable than the systems it monitors. Design for: redundancy (multiple collector instances), graceful degradation (drop data rather than crash), capacity headroom (2x peak traffic), and disaster recovery (backup and restore procedure documented and tested). The observability platform should have its own SLOs: ingestion latency under 10 seconds, query latency under 5 seconds for common queries, uptime over 99.9%, and data loss under 0.1%. Violating these SLOs should page the observability team.

### 1.35 Building vs Buying Observability

Build when: you need custom instrumentation that no vendor supports, you have unique scale requirements that vendors cannot meet, you have strict data residency requirements, or you need to control costs for high-volume telemetry. Buy when: you have fewer than 50 services, you have standard requirements (RED metrics, structured logging, basic tracing), you lack operational capacity to self-manage, or you want to focus engineering time on product features. Most organizations use a hybrid approach: SaaS for critical services (where reliability matters most), self-managed for cost-sensitive bulk data.

### 1.36 Vendor Selection Criteria

When evaluating observability vendors: open standards support (OTel, PromQL), data residency options, cost per unit of telemetry (per series, per GB, per span), query performance and query language capabilities, dashboard and alerting features, integration with existing tools (Grafana, PagerDuty, Slack), API and automation capabilities (observability as code support), compliance certifications (SOC2, HIPAA, GDPR), and support quality. Always request a proof of concept with your actual data before committing.

### 1.37 The Observability Engineer's Learning Path

Month 1-3: Learn Prometheus fundamentals (metric types, PromQL, recording rules, alerting). Set up a personal Grafana dashboard. Instrument a simple application with RED metrics. Month 3-6: Learn OpenTelemetry (SDK instrumentation, Collector configuration, OTLP). Implement distributed tracing for a multi-service application. Set up structured logging. Month 6-12: Design and build an observability pipeline for your organization. Implement SLO-based alerting. Manage cardinality and cost. Month 12-24: Drive organizational adoption of observability standards. Build observability as code pipeline. Mentor other engineers. Contribute to open-source observability projects.

## P2 Expansion — Deeper Philosophical Content

### 2.36 The Observer Effect in Observability

Instrumenting a system changes the system. Adding tracing adds latency (typically under 1ms per span). Adding metrics creates goroutines and memory allocations. Adding logging increases I/O. The observability system must account for its own overhead. Never add instrumentation that materially affects user-facing performance. Test instrumentation overhead in load testing. Use sampling strategically to reduce overhead. The observer effect is unavoidable but manageable.

### 2.37 The Fallacy of the Single Source of Truth

There is no single source of truth in observability. Metrics from different sources may disagree (Prometheus vs Datadog vs CloudWatch). Counters may have slight differences due to timing, batching, or sampling. This is acceptable — observability is about understanding behavior, not accounting. Acknowledge and document expected discrepancies. Do not spend engineering time making different systems produce identical numbers — spend it on understanding what the numbers mean.

### 2.38 Instrumentation as Contracts

Metrics, logs, and traces are contracts between service teams and consumers (on-call engineers, dashboards, alerts). Breaking a contract (renaming a metric, removing a label, changing log format) breaks downstream consumers. Treat instrumentation changes with the same care as API changes: deprecate before removing, communicate changes in advance, provide migration paths, and use versioned metrics (_v2) for breaking changes.

### 2.39 The Principle of Surprise

An observability system should surface surprises. If a metric is always flat (no variation), it is not providing information — either the system is perfectly stable (unlikely) or the instrumentation is wrong. Seek out time series with unusual patterns (sudden changes, periodic spikes, outliers) — they reveal interesting behavior. Encourage engineers to explore surprising patterns they notice in dashboards.

### 2.40 Observability and Blameless Culture

Good observability supports blameless postmortems by providing objective data about what happened. Without observability, postmortems rely on memory and speculation — which leads to blame. With observability, postmortems use telemetry data to understand system behavior, leading to learning and improvement. The Observability Engineer directly contributes to a blameless culture by ensuring the data needed for objective analysis is available.

### 2.41 The Tension Between Privacy and Observability

Deep observability requires detailed data about requests, including user IDs, session information, and behavior patterns. Privacy regulations (GDPR, CCPA) restrict what data can be collected and retained. The tension is inherent and must be managed: collect what you need, anonymize where possible, retain only as long as needed, and provide mechanisms for data deletion on request. Document your data collection and retention policies. Review them regularly.

### 2.42 Observability for Compliance

Observability data supports compliance requirements: audit logs for SOC2, access logs for HIPAA, transaction monitoring for PCI-DSS, and data retention for GDPR. The Observability Engineer must understand compliance requirements and design pipelines that satisfy them. This often means: separate audit log pipelines with longer retention, cryptographic signing of audit logs, access controls on telemetry data, and data deletion capabilities. Compliance is not optional.

### 2.43 The Economics of Observability

Observability has diminishing returns. The first 80% of instrumentation provides 95% of the debugging value. The last 20% provides the remaining 5% at exponentially higher cost. Make explicit decisions about where you are on this curve. Spend observability budget on the services that matter most (revenue-critical, user-facing, frequently failing). Accept that some low-value services will have minimal instrumentation. Perfection in observability is the enemy of good.

### 2.44 The Observability Tax

Every service pays an "observability tax" — the engineering time to add instrumentation, the compute resources for telemetry collection, and the storage cost for telemetry data. This tax should be proportional to the service's criticality. A critical payment service should pay a higher tax (more instrumentation, higher sampling, longer retention) than an internal reporting service. Make the tax explicit and visible so teams can optimize it.

### 2.45 Telemetry Data Ownership

Who owns telemetry data? The service team owns the instrumentation and the quality of the data. The observability team owns the pipeline and storage. The security team has read access for security investigations. The compliance team has retention and deletion requirements. Data ownership must be clear to avoid gaps: unowned data is not maintained, not secured, and not cleaned up.

### 2.46 The Importance of Negative Signals

Most observability focuses on positive signals (metrics that are present, traces that are captured). Negative signals — data that should exist but does not — are equally important. A metric that stops being emitted. A batch job that does not run. A service that stops producing logs. Negative signals require careful handling: use absent() and absent_over_time() in Prometheus, set up heartbeat alerts for batch jobs, and monitor for unexpected silence from services.

### 2.47 Instrumentation and Testing

Good instrumentation makes testing easier. When you can observe the behavior of your system through telemetry, you can write integration tests that verify observable behavior: "run the test, confirm the metric increases by 1, confirm the trace has a span with expected attributes." This is more reliable than testing internal implementation details. Instrumentation-focused testing aligns testing with what users and operators actually care about.


## P3 Expansion — Detailed Metrics Content

### 3.68 PromQL Query Patterns for RED Metrics

Request rate: sum(rate(http_requests_total[5m])) by (service). Error rate: sum(rate(http_requests_total{status_code=~'5..'}[5m])) by (service). Error ratio: sum(rate(http_requests_total{status_code=~'5..'}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service). Latency p50: histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)). Latency p99: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)). Saturation: avg(http_requests_in_flight) by (service) / max(http_max_concurrent_requests) by (service). Error budget remaining: 1 - (sum(increase(sli:error:total[30d])) by (service) / (sum(increase(sli:total:total[30d])) by (service) * (1 - slo_target))).

### 3.69 PromQL for Capacity Planning

CPU utilization: avg(rate(node_cpu_seconds_total{mode!='idle'}[5m])) by (instance). Memory utilization: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100. Disk utilization: (node_filesystem_size_bytes{mountpoint='/'} - node_filesystem_free_bytes{mountpoint='/'}) / node_filesystem_size_bytes{mountpoint='/'} * 100. Network saturation: rate(node_network_receive_bytes_total[5m]) / node_network_speed_bytes * 100. Disk I/O saturation: rate(node_disk_io_time_seconds_total[5m]) * 100. Predictive disk full: predict_linear(node_filesystem_free_bytes{mountpoint='/'}[6h], 3600 * 24 * 7) < 0.

### 3.70 PromQL for Dependency Monitoring

Service dependency error rate: sum(rate(http_requests_total{status_code=~'5..', service='myservice'}[5m])) by (dependency). Dependency latency impact: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{dependency='payments', service='myservice'}[5m])) by (le)). Dependency availability: (1 - sum(rate(http_requests_total{status_code=~'5..', dependency='payments'}[5m])) / sum(rate(http_requests_total{dependency='payments'}[5m]))) * 100.

### 3.71 PromQL for Saturation Monitoring

CPU saturation: avg(rate(node_cpu_seconds_total{mode='steal'}[5m])) by (instance) — CPU steal time indicates hypervisor CPU saturation. Memory saturation: node_vmstat_pswpin — page-in rate indicates memory pressure. Network saturation: rate(node_network_drop_total[5m]) by (device) — dropped packets indicate network saturation. Disk saturation: rate(node_disk_io_time_weighted_seconds_total[5m]) by (device) — weighted I/O time indicates disk saturation.

### 3.72 PromQL for Deployment Monitoring

Deployment impact: rate(http_requests_total{version='new'}[5m]) / rate(http_requests_total{version='old'}[5m]) — traffic shift between versions. Error rate by version: sum(rate(http_requests_total{status_code=~'5..'}[5m])) by (version). Latency by version: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, version)). Canary analysis: (sum(rate(http_requests_total{version='canary', status_code=~'5..'}[5m])) / sum(rate(http_requests_total{version='canary'}[5m]))) > (sum(rate(http_requests_total{version='baseline', status_code=~'5..'}[5m])) / sum(rate(http_requests_total{version='baseline'}[5m]))) * 1.5.

### 3.73 PromQL for Anomaly Detection

Z-score: (avg_over_time(metric[1h]) - avg_over_time(metric[7d])) / stddev_over_time(metric[7d]). Alert on abs(z-score) > 3. Rate of change: deriv(metric[1h]). Alert on rate of change exceeding threshold percentage. Seasonal comparison: metric / avg_over_time(metric[7d] offset 1w) — compare current to same time last week. Alert on deviation > 20%.

### 3.74 Metric Aggregation Strategies

Sum: use when values are additive across dimensions (total requests, total errors). Average: use for utilization metrics across instances (average CPU across all instances). Max: use for worst-case analysis (p99 latency across instances — take the max of individual service p99s). Min: use for best-case analysis (minimum free disk space across instances). Quantile: use for distribution analysis (latency percentiles). Rate: use for counter-based metrics (requests per second).

### 3.75 Metric Label Design Patterns

Standard label set for HTTP service: service, method (GET, POST, PUT, DELETE), endpoint (/api/users, /api/orders), status_code (200, 404, 500), error_type (timeout, rejected, not_found). Standard label set for database: service, db_system (postgresql, mysql), db_operation (select, insert, update, delete), db_table, error_type. Standard label set for cache: service, cache_system (redis, memcached), cache_operation (get, set, delete), cache_hit (true, false). Standard label set for queue: service, queue_system (kafka, rabbitmq), queue_name, queue_operation (publish, consume), error_type.

### 3.76 Metric Configuration for Different Workloads

Web service: RED metrics (request rate, error rate, latency p50/p95/p99), concurrency gauge, and business metrics (active users, orders, revenue). Batch job: job duration, records processed, records with errors, records skipped, and job status (success, failure, partial success). Stream processor: events in, events out, processing lag, processing time per event, and errors per event type. Database: query rate, query latency, connection count, cache hit ratio, transaction rate, replication lag, and lock wait time.

### 3.77 Histogram Optimization Techniques

Use native histograms (Prometheus v2.40+) for better compression and accuracy. Use exponential histograms (OTel) for wide dynamic range with fewer buckets. Set bucket boundaries based on your SLO: if your SLO is 200ms, ensure you have a bucket at exactly 200ms. Avoid more than 20 buckets per histogram. Consider using separate histograms for different request types (read vs write, small vs large payloads). Use recording rules to pre-compute percentiles from frequently queried histograms.

### 3.78 Metrics for Business KPIs

Revenue metrics: revenue_total (counter with labels service, product, currency), revenue_per_request (histogram), revenue_loss_total (counter for failed transactions). User metrics: active_users (gauge), signups_total (counter), churn_rate (gauge or derived metric). Engagement metrics: sessions_total (counter), session_duration_seconds (histogram), page_views_total (counter). Quality metrics: returned_orders_total (counter), support_tickets_total (counter by category), refund_amount_total (counter). Business metrics should be in the same observability system as technical metrics for correlation.

### 3.79 Multi-Dimensional Rollups

Roll up metrics at the collector: per-instance metrics (30 days) -> per-service aggregates (365 days) -> per-organization totals (indefinite). At each level, remove granularity (drop instance label, drop endpoint label) but retain summary statistics (count, sum, avg, min, max, p50, p95, p99). This provides long-term trend capability without storing all original data. Implement rollups using recording rules or collector processors.

### 3.80 Metrics Troubleshooting Checklist

Step 1: Can you access the /metrics endpoint directly? (curl localhost:8080/metrics). Step 2: Is Prometheus scraping the target? (Check Target status in Prometheus UI). Step 3: Is the metric present in Prometheus? (Query the metric name with no labels). Step 4: Are the label values what you expect? (Use curl to check label values directly). Step 5: Is there a relabeling rule dropping the metric? (Check Prometheus scrape config). Step 6: Is the metric type correct? (Counter should only increase, Gauge should fluctuate). Step 7: Is there a recording rule or alerting rule referencing the wrong metric name? (Check rules YAML). Step 8: Is the Prometheus version compatible with the client library? (Check compatibility matrix).

## P4 Expansion — Detailed Logging Content

### 4.37 LogQL Query Patterns

Error rate: sum(rate({service='myservice'} |= 'error' [5m])) / sum(rate({service='myservice'}[5m])) * 100. Top error types: topk(10, sum by (error_type) (count_over_time({service='myservice'} |= 'error' [1h]))). Slow requests: {service='myservice'} | logfmt | duration > 1.0. Trace-specific logs: {service='myservice'} | logfmt | trace_id = 'abc123'. Logs around deployment: {service='myservice'} | logfmt | __timestamp__ > before_deploy_time and __timestamp__ < after_deploy_time. Error count by service: sum by (service) (count_over_time({service=~'.+'} |= 'error' [5m])).

### 4.38 Structured Logging Schema Design

Standard fields: timestamp (RFC3339Nano), level (enum: debug, info, warn, error, fatal), message (human-readable string, not null), logger (source code location: package/module), service (service name matching metrics service label), environment (production, staging, development). Context fields: trace_id (W3C trace ID), span_id (OTel span ID), request_id (application-level request ID). HTTP fields: http_method, http_path, http_status_code, http_user_agent, http_referer, http_request_id. Performance fields: duration_ms (request or operation duration), cpu_time_ms, memory_bytes. Business fields: user_id (hashed), account_id (hashed), feature_flag, ab_test_variant. Error fields: error_type (machine-readable error class), error_message (human-readable), stack_trace (multiline, truncated to 4KB).

### 4.39 Logging Framework Configuration Examples

Go (zap): logger, _ := zap.NewProduction() — outputs JSON with standard fields. Python (structlog): structlog.configure(processors=[structlog.processors.JSONRenderer()]) — outputs JSON. Java (Logback with Logstash encoder): net.logstash.logback.encoder.LogstashEncoder — outputs JSON. Node.js (pino): const logger = pino() — outputs JSON by default. Ruby (Ougai): logger = Ougai::Logger.create_logger(STDOUT) — outputs JSON with trace context.

### 4.40 Log Aggregation Architecture Patterns

Direct to backend: Application -> Log Shipper -> Backend (Elasticsearch, Loki). Simple, low latency, but no buffering. Buffered: Application -> Log Shipper -> Kafka -> Log Processor -> Backend. Handles traffic spikes, provides replay capability. Multi-backend: Application -> Log Shipper -> Kafka -> Log Processor -> Backend A (hot, fast, expensive) + Backend B (cold, slow, cheap). Routes hot and cold logs to different storage. Enriched: Application -> Log Shipper -> Enrichment Processor (adds metadata, geo-IP, user-agent parsing) -> Backend. Removes enrichment burden from application.

### 4.41 Log Sampling at Scale

Service handles 100,000 requests/second, each request generates 10 log lines (1M logs/second). Storage cost: 1M logs * 1KB * 86400 * 30 = 2.6 PB/month at approximately /month. With structured sampling: keep 100% errors (1% of traffic = 1K req/s * 10 logs = 10K logs/s), keep 10% info (99% of traffic = 99K req/s * 10 logs * 10% = 99K logs/s), total = 109K logs/s. Storage cost at 10%: approximately /month. Sampling reduces cost by 90% while preserving all error data.

### 4.42 Log Shipper Performance Tuning

Fluent Bit: configure mem_buf_limit to prevent OOM (recommended: 100MB). Use tail input with multiline parser for stack traces. Use kubernetes filter for metadata. Set Retry_Limit to false (retry forever). Monitor output errors and retry counts. Loki Promtail: configure positions file to track read progress. Use pipeline stages for JSON parsing. Set max_backlog_per_tape to prevent unbounded growth. Filebeat: configure registry file for read progress. Use json.keys_under_root: true for structured logs. Set close_inactive to 5m to avoid tailing idle files.

### 4.43 Log-Based Alerting with Loki

Alert rule in Loki: alert: HighErrorRate, expr: sum(rate({service='myservice'} |= 'error' [5m])) / sum(rate({service='myservice'}[5m])) > 0.05, for: 5m. This alerts when 5% of log entries contain 'error'. More specific: sum(rate({service='myservice'} | logfmt | level='error' [5m])) / sum(rate({service='myservice'}[5m])) > 0.01. Each service may have different log error rate thresholds. Monitor log error rate alerts for false positives — some errors are expected (validation errors, rate limiting).

### 4.44 Log Retention Strategy

Hot storage (SSD): 7 days retention. Used for active debugging. Fast queries, high cost. Warm storage (HDD or object storage): 30 days retention. Used for less frequent investigation. Moderate speed, moderate cost. Cold storage (compressed object storage): 365 days retention. Used for compliance and trend analysis. Slow queries, low cost. Archive (compressed, encrypted object storage): 7 years retention. Used for legal and compliance. Very slow (restore from archive). Configure per-service retention policies based on criticality.

### 4.45 Log Cost Optimization Techniques

Compress logs at the shipper: enable gzip compression for log transport. Use structured logging with selectable fields: don't log fields that are never queried. Implement log sampling at source: sample info/debug logs, keep all errors. Use log aggregation (count per pattern) instead of storing every occurrence of common log messages. Use pre-aggregation processors: count similar log events and produce a metric instead of storing each event. Reduce log entry size: keep messages under 512 bytes, don't include redundant context (service name in every log when it's already in metadata).


## P5 Expansion — Detailed Tracing Content

### 5.34 OTel Span Attributes in Detail

HTTP server spans: http.method (string), http.url (string), http.target (string), http.host (string), http.scheme (string), http.status_code (int), http.request_content_length (int), http.response_content_length (int), http.route (string), net.host.name (string), net.host.port (int), net.sock.peer.addr (string). HTTP client spans: http.method, http.url, http.status_code, http.request_content_length, http.response_content_length, net.peer.name, net.peer.port, net.sock.peer.addr.

Database spans: db.system (string: postgresql, mysql, redis, mongodb, elasticsearch), db.connection_string (string, redacted), db.user (string), db.name (string, database name), db.statement (string, SQL query — may be truncated or obfuscated), db.operation (string: SELECT, INSERT, UPDATE, DELETE), db.sql.table (string), db.instance (string, instance ID).

Messaging spans: messaging.system (string: kafka, rabbitmq, sqs, sns), messaging.destination (string, topic/queue name), messaging.destination_kind (string: topic, queue), messaging.message_id (string), messaging.conversation_id (string), messaging.payload_size (int).

RPC spans: rpc.system (string: grpc, thrift), rpc.service (string), rpc.method (string), rpc.grpc.status_code (int).

### 5.35 Trace Sampling Configuration in OTel

Environment variable sampling: OTEL_TRACES_SAMPLER=traceidratio, OTEL_TRACES_SAMPLER_ARG=0.01 (1% sampling). Parent-based sampling: parentbased_traceidratio (respects parent's sampling decision, but applies own ratio if no parent). Rate limiting sampler: custom sampler that limits to N traces per second. Tail-based sampling (OTel Collector): set up sampling processor with policies: keep all traces with status=Error, keep all traces with duration > 1s, keep 10% of remaining traces. This provides optimal balance of cost and debugging value.

### 5.36 Trace Context Propagation in Different Protocols

HTTP: W3C Trace Context headers (traceparent, tracestate). gRPC: use gRPC metadata with keys traceparent and tracestate (OTel handles this automatically). Message queues: Kafka headers (traceparent, tracestate as headers). RabbitMQ: message properties (headers). AWS SQS: message attributes. Redis: not natively supported — requires custom propagation through Redis command arguments. GraphQL: extensions in the request payload. WebSocket: custom headers during handshake.

### 5.37 Tracing for Database Performance

Use db.statement span attribute to capture the SQL query (with parameters obfuscated for security — never log actual parameter values). Set db.operation attribute to the SQL operation type. Create one span per database call with accurate timing. Analyze traces to find: N+1 queries (many identical queries in a loop), slow queries (latency above threshold), connection pool exhaustion (long queue time before query execution), and retry storms (same query executed multiple times due to timeout).

### 5.38 Tracing for External API Dependencies

Use http.method and http.url attributes to identify external API calls. Set span status based on HTTP response code. Add attributes for API version and endpoint. Monitor external dependency health through trace data: error rate by dependency, latency by dependency, and dependency availability. Use traces to identify external API degradation before it causes user-facing issues. Create SLOs for critical external dependencies.

### 5.39 Tracing for Cache Performance

Use cache hit/miss attributes: cache.hit (boolean) and cache.key (string, hashed). Create spans for cache get, set, and delete operations. Analyze cache efficiency through traces: what percentage of requests hit the cache? Which cache keys are frequently missed? What is the cache latency? High cache hit ratio with low latency indicates effective caching. Low cache hit ratio or high cache latency suggests cache configuration issues.

### 5.40 Trace Query Patterns with TraceQL

Find all traces with errors: {status=error}. Find slow payment traces: {service='payment' && duration > 1s}. Find traces by user: {attributes.user_id = '123'}. Find traces involving specific dependency: {service='orders' && .http.url = 'https://api.payments.com/*'}. Find traces slower than p99: {duration > percentile(duration, 0.99) over last 1h}. Find error cascade: {status=error} && { next.duration > 1s } (error in one service causing timeout in downstream service).

### 5.41 Trace Storage Backend Selection

Jaeger: self-hosted, works with Elasticsearch or Cassandra, good for moderate scale (under 1M spans/second). Tempo: self-hosted, object storage-backed (S3, GCS, Azure), excellent for large scale (millions of spans/second), integrates with Grafana. Honeycomb: SaaS, high-cardinality, event-based, excellent for explorative debugging, expensive at scale. Datadog APM: SaaS, integrated with Datadog platform, good for Datadog customers, expensive at high volume. Grafana Cloud: hosted Tempo, integrates with Grafana, good for Grafana users.

### 5.42 Trace Data Lifecycle

Raw traces: short retention (7-30 days). Used for detailed debugging. Sampled. Warmer storage. Service metrics from traces: derived metrics from trace data (request rate, error rate, latency by service, operation, and attributes). Long retention (90-365 days). Lower cardinality. Cost per span vs cost per derived metric: derived metrics are much cheaper. Trace-level SLOs: SLO compliance calculated from trace data. Long retention for compliance reporting. Aggregated trace statistics: latency distributions by service, operation, and attributes. Long retention for capacity planning.

### 5.43 No Trace Left Behind: Handling Untraced Requests

Some requests will not have traces: health checks, pre-flight requests, requests from services not yet instrumented, and requests where sampling dropped the trace. Monitor the untraced request rate: if a significant percentage of traffic is untraced, there is an instrumentation gap. Use untraced request detection: compare request counts from metrics with trace counts. If metrics show 1000 requests but traces show only 50 spans, most requests are not being traced — investigate.

### 5.44 Advanced Trace Analysis: Service Dependency Health

Use trace data to compute dependency health metrics: request rate from service A to service B, error rate of service B as observed by service A, latency of service B as observed by service A, and availability of service B (how often service A's calls to B succeed). These metrics are more accurate than service B's own metrics because they represent the actual user experience of service A calling service B. Include these in dashboards for each service.

## P6 Expansion — Detailed OTel Content

### 6.27 OTel SDK Initialization Patterns

Go: use otel.SetTracerProvider(sdktrace.NewTracerProvider()) and otel.SetMeterProvider(sdkmetric.NewMeterProvider()) at application startup. Configure resource with service.name and service.version. Set up OTLP exporter: exporter, _ := otlptracegrpc.New(ctx, otlptracegrpc.WithEndpoint('otel-collector:4317')). Register span processor: batchSpanProcessor := sdktrace.NewBatchSpanProcessor(exporter).

Python: configure using opentelemetry-distro: otel_distro.configure_otlp_grpc(endpoint='otel-collector:4317'). Or manually: tracer_provider = TracerProvider(resource=Resource.create({'service.name': 'myservice'})), processor = BatchSpanProcessor(OTLPSpanExporter(endpoint='otel-collector:4317')), tracer_provider.add_span_processor(processor).

Java: use OTel Java agent (-javaagent:opentelemetry-javaagent.jar) for auto-instrumentation. Configure with environment variables: OTEL_SERVICE_NAME, OTEL_EXPORTER_OTLP_ENDPOINT. For manual instrumentation, use GlobalOpenTelemetry.getTracer('my-instrumentation').

### 6.28 OTel Collector Deployment Patterns

Per-node agent (DaemonSet): one collector pod per Kubernetes node. Collects telemetry from all pods on the node. Low latency, low resource usage. Best for: metrics and logs collection where proximity to data source is important.

Standalone gateway (Deployment): separate collector service. Aggregates telemetry from multiple agents or directly from applications. Applies global policies (sampling, redaction, enrichment). Best for: cross-cluster aggregation, global sampling decisions, multi-backend routing.

Sidecar collector: one collector container per pod. Tightly coupled with application. Best for: specialized processing per application, environments where DaemonSet is not possible.

Hybrid: agents on each node for initial collection, gateways for aggregation and routing. Most flexible and scalable. Recommended for production deployments.

### 6.29 OTel Collector Pipeline Configuration Examples

Full pipeline: receivers: {otlp: {protocols: {grpc: {endpoint: 0.0.0.0:4317}, http: {endpoint: 0.0.0.0:4318}}}}, processors: {memory_limiter: {check_interval: 5s, limit_mib: 512}, batch: {timeout: 5s, send_batch_size: 10000}, attributes: {actions: [{key: 'environment', value: 'production', action: 'upsert'}]}, k8sattributes: {auth_type: 'serviceAccount'}, filter: {metrics: {include: {match_type: regexp, metric_names: ['http_requests_total', 'http_request_duration_seconds']}}}}, exporters: {otlp: {endpoint: 'backend:4317', tls: {insecure: false}}, logging: {loglevel: debug}}, service: {pipelines: {traces: {receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlp]}, metrics: {receivers: [otlp], processors: [memory_limiter, attributes, batch], exporters: [otlp]}, logs: {receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlp]}}}.

### 6.30 OTel Semantic Convention Compliance

Use the OTel semantic conventions registry (opentelemetry.io/docs/specs/semconv/) to look up standard attribute names. For HTTP spans: use http.request.method, http.response.status_code, url.full, server.address, server.port (OTel v1.21+). For database: db.system, db.namespace, db.query.text (sanitized), db.operation.name. For messaging: messaging.system, messaging.destination.name, messaging.message.id, messaging.operation.type. Following conventions ensures your telemetry is compatible with standard dashboards, alerts, and analysis tools.

### 6.31 OTel Context Propagation Debugging

Common issues: trace_id is different between services (propagation is broken). Span tree is incomplete (some services do not create child spans). Traces are missing entirely (sampling drops them or collector drops them). Debug with: OTEL_LOG_LEVEL=debug on the SDK to see context propagation decisions. Use the OTel Collector's logging exporter to inspect telemetry as it passes through. Verify HTTP headers: curl -v http://service/endpoint and check for traceparent header in response. Verify injection: check that outgoing requests from the service include traceparent header.

### 6.32 OTel Performance Overhead Measurement

Each span creation costs: memory allocation for span object, attribute storage, context propagation overhead (HTTP header injection/extraction), exporter serialization, and network transmission. Typical overhead: 0.1-1ms per span (depends on attribute count). At 1000 spans/second per instance, overhead is 100-1000ms of CPU time per second. Use batch span processor to reduce exporter overhead. Use sampling to reduce span count. Test with production-like load before enabling tracing on critical services.

### 6.33 OTel Bridge and Migration Patterns

OpenTracing to OTel: use the OpenTracing bridge (io.opentracing.contrib:opentracing-otel) to forward OpenTracing API calls to OTel SDK. Replace imports gradually: ot-tracer -> otel-span. Remove bridge once all code is migrated.

OpenCensus to OTel: use the OpenCensus bridge. Replace OpenCensus views and measures with OTel instruments. Metrics API differs significantly — requires hands-on migration.

Prometheus client to OTel: OTel provides Prometheus exporter and Prometheus bridge. Use OTel Metrics SDK with Prometheus exporter for new instrumentation. Keep existing Prometheus clients alongside during migration.


## P7 Expansion — Detailed Architecture Content

### 7.28 Prometheus at Scale Architecture

Single Prometheus handles up to 2 million active series. Beyond that: use Thanos for horizontal scalability. Thanos sidecar runs alongside each Prometheus, ships blocks to object storage. Thanos querier provides global view across all Prometheus instances. Thanos compactor handles downsampling and retention. Cortex/Mimir provides multi-tenant Prometheus with horizontal scalability. VictoriaMetrics is a drop-in Prometheus replacement with better compression and performance at scale.

### 7.29 Elasticsearch at Scale Architecture

Single cluster handles up to 50 nodes. Beyond that: use cross-cluster search for federation. Use index lifecycle management (ILM) for automatic data tiering: hot (SSD, 7 days), warm (HDD, 30 days), cold (object storage, 90 days), frozen (queryable object storage, 365 days). Use rollup jobs to create hourly/daily aggregations aligned with long-term storage. Use shard sizing: 50GB per shard max, approximately 20 shards per node.

### 7.30 Loki at Scale Architecture

Loki is designed for cost-effective log storage: uses object storage as primary storage, indexes only metadata (labels), not log content. Architecture: distributor (receives logs, validates, distributes to ingesters), ingester (buffers and flushes to object storage), querier (queries object storage and ingesters), compactor (compacts and retains). Loki scales by adding more ingesters and queriers. Use index gateway for caching index data.

### 7.31 Kafka in the Observability Pipeline

Kafka serves as a buffer and decoupling layer in the telemetry pipeline. Use cases: buffer between log shippers and log backends (absorbs traffic spikes), buffer between collectors and multiple backends (one write to Kafka, multiple consumers for different backends), replay capability (re-process recent telemetry if backend had issues). Kafka configuration for telemetry: relatively small retention (12-24 hours), high throughput (telemetry is high volume), and topic per signal type (metrics, logs, traces).

### 7.32 Observability Pipeline Capacity Planning

Plan for 2x current peak telemetry volume. Monitor: samples/second for metrics, spans/second for traces, log entries/second for logs, and bytes/second for all signals. Growth factors: new services added, traffic growth, new instrumentation, and increased sampling for debugging. Budget: 50% of capacity for growth. When approaching 70% utilization, plan capacity expansion. Use auto-scaling for collectors and gateways where possible.

### 7.33 Grafana Architecture for Scale

Grafana deployment: single instance for small teams (under 50 users), HA deployment with shared database for larger teams. Use Grafana's built-in provisioning for dashboards and data sources via YAML. Use Grafana's alerting engine for cross-data-source alerts. For query caching: use Grafana's query caching plugin or a Redis cache between Grafana and data sources. Use Grafana's reporting for scheduled dashboard snapshots. Use Grafana's API for dashboard management automation.

### 7.34 Observability Data Lake Architecture

For organizations that need to retain raw telemetry indefinitely: stream all telemetry to a data lake (S3, GCS, Azure Data Lake) in addition to the operational backend. Use Parquet format for efficient storage and query. Use query engines (Presto, Athena, Spark) for ad-hoc analysis on historical data. Store in partitioned layout: signal_type/year/month/day/hour/. Data lake enables: long-term trend analysis, ML model training on telemetry data, compliance audits, and vendor-independent data retention.

### 7.35 Service Mesh Observability Architecture

Service mesh (Istio, Linkerd) provides automatic telemetry for all mesh traffic: RED metrics per service pair, distributed traces for mesh spans, service dependency graph, and mTLS status. Architecture: sidecar proxies generate telemetry, Prometheus scrapes proxy metrics, tracing backends receive proxy spans. Service mesh telemetry complements application telemetry — it captures network-level behavior while application telemetry captures business logic.

### 7.36 eBPF-Based Observability Architecture

eBPF enables observability without any code changes: kernel-level tracing of system calls, network packets, and file operations. Tools: Cilium (network observability and security), Pixie (Kubernetes observability, no instrumentation needed), Falco (security monitoring), and Hubble (network flow visibility). eBPF is ideal for: detecting unknown unknowns, providing observability for unmodified applications, deep kernel-level debugging. Limitations: eBPF cannot see application-level semantics (no business metrics, no request IDs).

## P8 Expansion — Detailed Alerting Content

### 8.29 Prometheus Alert Rule Examples

Alert: HighCPUUsage. expr: (100 - (avg by (instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)) > 80. for: 10m. labels: {severity: warning, team: platform}. annotations: {summary: 'CPU usage is {{ | humanizePercentage}} on {{.instance}}', description: 'CPU usage has been above 80% for more than 10 minutes on instance {{.instance}}', dashboard: 'https://grafana.example.com/d/infra', runbook: 'https://wiki.example.com/high-cpu'}.

Alert: HighMemoryUsage. expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90. for: 15m. labels: {severity: warning, team: platform}. annotations: {summary: 'Memory usage is {{ | humanizePercentage}} on {{.instance}}'}.

Alert: InstanceDown. expr: up == 0. for: 5m. labels: {severity: critical, team: platform}. annotations: {summary: 'Instance {{.instance}} is down', description: 'Instance {{.instance}} has been unreachable for more than 5 minutes'}.

### 8.30 Alertmanager Receiver Configuration

Receivers: slack: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXX' (Slack webhook), pagerduty: routing_key: 'YOUR_PAGERDUTY_KEY' (PagerDuty integration), email: to: 'oncall@example.com', from: 'alertmanager@example.com', smarthost: 'smtp.example.com:587', webhook: url: 'https://webhook.example.com/alerts' (custom webhook for incident management system).

### 8.31 Alertmanager Routing Tree

route: receiver: 'default', routes: - match: {severity: critical}, receiver: 'pagerduty-critical', repeat_interval: 1h. - match: {severity: warning}, receiver: 'slack-warnings', repeat_interval: 12h. - match: {team: 'platform'}, receiver: 'slack-platform', repeat_interval: 6h. - match_re: {service: 'payment|checkout'}, receiver: 'pagerduty-payments', repeat_interval: 30m. Grouping: group_by: ['alertname', 'severity', 'service'], group_wait: 30s, group_interval: 5m.

### 8.32 Alert Notification Templates

Prometheus alert annotations can use Go templates: summary: '{{.service}}: {{ | humanizePercentage}} error rate', description: 'Error rate for {{.service}} ({{.endpoint}}) is {{ | humanizePercentage}} on {{.instance}} at {{.region}}. Response required within 15 minutes.', dashboard: 'https://grafana.example.com/d/{{.service}}', runbook: 'https://wiki.example.com/alerts/{{.alertname}}'.

### 8.33 Synthetic Monitoring Alerting

Synthetic transactions: periodic (every 5 minutes) end-to-end test that exercises critical user journeys. Measure: synthetic check success (1 if all steps succeed), synthetic check duration (total test time), and synthetic check step duration (per step). Alert on: synthetic check failure for 2 consecutive checks, synthetic check duration exceeding threshold (indicates performance degradation), and synthetic check step failure (specific step failing indicates which system component). Synthetic monitoring catches issues before real users are affected.


## P9 Expansion — Detailed Dashboard Content

### 9.17 Grafana Dashboard JSON Structure

Top-level fields: dashboard (contains all dashboard data), title (dashboard name, e.g., 'Service RED Metrics'), uid (unique identifier for linking), tags (['service', 'red', 'production']), timezone ('browser'), editable (true), refresh ('30s'), time (from: 'now-6h', to: 'now'), panels (array of panel objects), templating (variable definitions), annotations (annotation definitions). Each panel: type ('timeseries', 'stat', 'gauge', 'table', 'heatmap', 'logs'), title, datasource (reference to configured data source), targets (array of query objects), fieldConfig (unit, thresholds, color scheme), gridPos (h, w, x, y for panel positioning).

### 9.18 Panel Type Selection Guide

Time series: use for metrics over time (request rate, latency, CPU usage). Best for trend analysis and correlation. Stat: use for single current value (SLO compliance, active users). Best for at-a-glance status. Gauge: use for utilization metrics (CPU %, disk %). Best for thresholds and warnings. Table: use for detailed data (top 10 slowest endpoints, error count by type). Best for drill-down and sorting. Heatmap: use for latency distribution over time. Best for identifying latency patterns and outliers. Logs: use for log entries. Best for correlating logs with metrics on shared timeline.

### 9.19 Dashboard Data Links

Configure data links on panels to enable drill-down: link to service dashboard (use template variables to pass service name), link to trace explorer (pass trace_id from exemplar), link to log explorer (pass service name and time range), link to runbook (static URL). Data links transform a dashboard from a static view into a navigation hub for debugging.

### 9.20 Grafana Provisioning with YAML

apiVersion: 1. providers: - name: 'default', orgId: 1, folder: 'Services', type: 'file', disableDeletion: false, editable: true, options: {path: '/var/lib/grafana/dashboards'}. Dashboard files are JSON files in the configured path. Use git to version control dashboard files. Use CI/CD to copy dashboard files to the provisioning path. This enables observability as code for dashboards.

### 9.21 Dashboard Naming Conventions

Service dashboards: 'Service: myservice (RED)' for RED metrics, 'Service: myservice (Details)' for detailed per-endpoint metrics, 'Service: myservice (Database)' for database-specific metrics. Infrastructure dashboards: 'Infra: Kubernetes Cluster', 'Infra: Node {{node}}', 'Infra: PostgreSQL Overview'. Business dashboards: 'Business: Revenue Overview', 'Business: User Engagement', 'Business: SLO Compliance'. Cross-cutting dashboards: 'SRE: Error Budgets', 'Platform: Cost Optimization', 'Security: Audit Logs'.

### 9.22 Grafana Alert Integration

Configure alert rules within Grafana: create alert rule from a panel's query, set condition (e.g., query result > threshold), set evaluation behavior (pending period, evaluation interval), set notification message and channel. Grafana alerts can use labels and annotations like Prometheus alerts. Use Grafana alerts for: cross-data-source conditions (metric from Prometheus and log count from Loki), ML-based anomaly detection (Grafana ML plugin), and complex conditions that are easier to express in Grafana than PromQL.

## P10 Expansion — Detailed SLO Content

### 10.22 SLO Calculation with Prometheus

Step 1: Define SLI metrics. Availability: good_events_total = rate(http_requests_total{status_code!~'5..'}[5m]), total_events_total = rate(http_requests_total[5m]). Latency: good_events_total = rate(http_request_duration_seconds_bucket{le='0.5'}[5m]), total_events_total = rate(http_request_duration_seconds_count[5m]).

Step 2: Compute SLI ratio. sli:availability:ratio5m = good_events_total / total_events_total. Use recording rules for efficiency.

Step 3: Compute error budget consumption over window. error_budget_consumed = 1 - avg_over_time(sli:availability:ratio5m[30d]). error_budget_total = 1 - slo_target. error_budget_remaining = 1 - (error_budget_consumed / error_budget_total). Alert on error_budget_remaining < 0 (budget exhausted).

Step 4: Compute burn rate. burn_rate = (1 - sli:availability:ratio5m) / (1 - slo_target). A burn rate of 1 consumes error budget at exactly the budgeted rate.

### 10.23 SLO Multi-Window Multi-Burn-Rate Implementation

Define burn rate thresholds for 99.9% SLO: Page: burn_rate > 10 for 5m (error budget consumed 10x faster than budgeted). Warning: burn_rate > 3 for 1h. Alert: burn_rate > 1 for 24h. Implement via Prometheus recording rules: burn_rate_5m = (1 - avg_over_time(sli:ratio[5m])) / (1 - 0.999). Then alert: expr: burn_rate_5m > 10, for: 5m. This catches: high burn rate immediately (critical incident), moderate burn rate within the hour (degradation), low chronic burn rate within 24 hours (slowly accumulating errors).

### 10.24 SLO for Different Service Types

CRUD API: latency SLO (p99 < 500ms), availability SLO (99.9% success). Batch job: freshness SLO (data processed within 1 hour of arrival), completion SLO (99.9% jobs complete successfully). Stream processor: latency SLO (processing time < 100ms per event), throughput SLO (minimum 10K events/second). Database: availability SLO (99.99% queryable), durability SLO (no data loss). Cache: hit ratio SLO (> 90% cache hit rate), latency SLO (p99 < 5ms).

### 10.25 Error Budget Policy Enforcement

Automated enforcement: CI/CD pipeline checks error budget before deploying to production. If error budget is exhausted (remaining < 0), block deployment. If error budget is low (remaining < 20%), require manager approval. If error budget is healthy (remaining > 50%), allow auto-deployment. This creates a direct feedback loop: reliability problems block feature releases, incentivizing teams to maintain reliability.

### 10.26 SLO Reporting and Visualization

Weekly SLO report: compliance percentage per service, error budget remaining, and trend (improving, stable, declining). Monthly SLO review: which services met their SLOs, which did not, and why. SLO dashboard: big number for current compliance, sparkline for trend, burn rate alert status, and predicted compliance at current burn rate. SLO reporting should be automated and distributed to service owners.

## P11 Expansion — Detailed Cost Content

### 11.20 Prometheus TSDB Storage Calculation

Each time series: approximately 2KB overhead plus 2 bytes per sample. 10 million samples per series per day (15s scrape interval). 1 million active series with 15s scrape: 1M * (2KB + 2B * 5760 samples/day) = 1M * 13.5KB = 13.5GB/day. 30 days retention: 405GB. With compression (Prometheus uses Gorilla compression, approximately 1.3 bytes per sample): 1M * (2KB + 1.3B * 5760) = 1M * 9.5KB = 9.5GB/day. 30 days: 285GB. Add 20% overhead for WAL and index: 342GB. This estimate helps budget disk space.

### 11.21 Log Storage Calculation

Each log entry: approximately 1KB (typical structured JSON log). 100M logs/day = 100GB/day raw. With gzip compression (approximately 10:1 for JSON): 10GB/day. 30 days retention: 300GB compressed. With replication (3x for Elasticsearch): 900GB total storage. At .10/GB/month for block storage: /month for compressed storage. At .02/GB/month for object storage (Loki): /month. The choice of backend significantly affects cost.

### 11.22 Cost Attribution by Team

Tag all telemetry with team label. Use Prometheus label _team (added via relabeling) or OTel resource attribute team. Query cost by team: sum by (team) (count({__name__=~'.+'})). Charge back: allocate storage cost proportional to each team's metrics, logs, and traces. Publish cost dashboard: cost per team per month, cost per service per month, cost per signal type per month, and cost trend (month over month). When teams see their observability costs, they optimize.

### 11.23 Sampling Strategy Decision Tree

Is the service critical to revenue? -> Yes: use tail-based sampling with 100% error preservation, 10% healthy traces. -> No: use head-based probabilistic sampling at 1%. Does the service handle sensitive data? -> Yes: apply redaction processor before sampling to ensure no sensitive data in sampled traces. -> No: standard sampling applies. Is the service high-volume (> 100K requests/second)? -> Yes: use rate-limiting sampler (max 100 traces/second). -> No: use probabilistic sampling for simplicity. Is debugging a common activity for this service? -> Yes: higher sampling rate (10-25%). -> No: lower sampling rate (0.1-1%).

### 11.24 Cost Optimization Checklist

Month 1: Audit all metrics — remove unused ones (20-30% reduction). Set up cardinality alerts. Month 2: Implement trace sampling — start at 1% for all services, increase for critical services with tail-based sampling. Month 3: Implement log sampling — keep 100% errors, 10% info, 0% debug. Month 4: Review retention policies — reduce hot storage retention, implement tiered retention. Month 5: Negotiate vendor contracts — commit to volume discounts, consider self-managed backends. Month 6: Implement cost visibility — publish cost dashboards, enable chargeback. Ongoing: Monitor cost trends, review quarterly.


## P12 Expansion — Detailed System-Specific Content

### 12.23 Nginx Observability

Nginx metrics (via nginx_exporter or stub_status): active connections (active, reading, writing, waiting), request rate (accepts, handled, requests per second), connection rate, and upstream metrics (response time, response status, header size, request size). Key dashboards: connections over time, request rate and latency, upstream health (by upstream server group). Alert on: upstream failure (5xx from upstream), connection spike (more connections than expected), and request rate drop (possible routing issue).

### 12.24 HAProxy Observability

HAProxy metrics (via haproxy_exporter): frontend metrics (request rate, session rate, bytes in/out, denied requests, error requests), backend metrics (session rate, queue depth, response time, error rate, retry rate), and server metrics (status, session count, response time, health check status). Alert on: backend server down, queue depth growing (backend cannot keep up), high error rate, and high retry rate.

### 12.25 Cassandra Observability

Cassandra metrics (via cassandra_exporter or JMX): read latency, write latency, read rate, write rate, compaction (pending tasks, completed tasks, bytes compacted), gossip (heartbeat state, node status), hinted handoff (hints count, delivery rate), cache hit ratio (key cache, row cache), and thread pool metrics (request stage, mutation stage, and read stage queue depths). Alert on: compaction pileup (pending tasks growing), cache hit ratio drop, and gossip node status changes (node not responding).

### 12.26 Consul Observability

Consul metrics: cluster health (server status, raft leadership, peer count), service health (service registrations, health check status by service), KV store (operation rate, latency), and gossip (node status, member count). Key dashboard: Consul cluster health (server count, leader, raft commits, term changes). Alert on: raft leader changes (frequent leader elections indicate cluster instability), server loss (server count below expected), and service health check failures (critical services deregistering).

### 12.27 Vault Observability

Vault metrics: request rate (by operation: read, write, list, delete), latency (by operation), error rate (by error type), active secrets (number of secret leases), token count (active tokens, TTL distribution), and storage backend metrics (storage latency, storage errors). Alert on: authentication failures (possible brute force or misconfigured auth), storage backend errors (Vault cannot persist data), and high latency (Vault performance degradation affects all services).

### 12.28 Terraform and Infrastructure as Code Observability

Observability for Terraform: plan duration (how long to generate a plan), apply duration (how long to apply changes), resource count per plan, error rate (failed applies, plan errors), drift detection (resources changed outside of Terraform), and state file size (indicates complexity). Monitor Terraform runs to detect: slow-downs (infrastructure growing), errors (configuration issues), and drift (unauthorized changes). Use Terraform Cloud metrics or custom instrumentation.

### 12.29 CI/CD Pipeline Observability

Pipeline metrics: pipeline duration (total, per stage), success rate (pass/fail per pipeline), stage duration (build, test, deploy stages), queuing time (time before runner picks up job), and resource utilization (runner CPU/memory during builds). Alert on: pipeline failures, stage duration exceeding threshold (performance regression), and queue time growing (runner capacity insufficient). Dashboards: pipeline health overview (pass rate, duration trend), and per-pipeline detail (duration breakdown, error log).

### 12.30 Container Runtime Observability

Container runtime metrics (cadvisor, container metrics from kubelet): container CPU usage (as percentage of limit), container memory usage (working set, RSS, cache, swap), container network I/O (bytes, packets, errors, drops), container disk I/O (read/write bytes, operations), container OOM kills (count), and container restarts (count). Key dashboards: container resource usage vs limits (is the container throttled?), and container health (restarts, OOM kills, resource exhaustion). Alert on: OOM kills (container killed due to memory limit), CPU throttling (container exceeding CPU limit), and excessive restarts.

### 12.31 Observability for Observability: Meta-Observability

Monitor the observability system itself: Prometheus (scrape failures, staleness, TSDB health), Alertmanager (alert delivery failures, inhibited alerts, silenced alerts), Grafana (dashboard load errors, data source connectivity, query latency), OTel Collector (processor errors, exporter failures, memory usage, queue length), Elasticsearch (cluster health, shard allocation, JVM heap usage, GC pressure), Loki (ingester errors, querier latency, object store errors). Meta-observability ensures the observability system stays operational. Without it, the team is blind to observability outages.

### 12.32 Capacity Planning Using Observability Data

Use historical telemetry data to predict future capacity needs. Key metrics for capacity planning (by service): request rate trend (requests/second over 90 days), latency trend (p99 over 90 days), error rate trend, resource usage trend (CPU, memory, disk, network), and data volume trend (metrics series count, log volume, trace volume). Techniques: linear regression against historical data, seasonal decomposition (daily/weekly patterns), and correlation with business metrics (revenue, users). Plan capacity for 6-12 months ahead based on trends.

## P13 Expansion — More Worked Examples

### 13.18 Example: Diagnosing a Memory Leak with Metrics

Situation: A service's memory usage increases over time and is periodically OOM-killed. Approach: 1) Graph process_memory_bytes (or container_memory_working_set_bytes) over 48 hours. 2) Identify the pattern: linear growth until OOM threshold, then drop (restart). 3) Add labels to the gauge: memory by heap, stack, RSS. 4) Use go_memstats_alloc_bytes (for Go) or equivalent to see heap allocation. 5) Check goroutine count (go_goroutines): is there a goroutine leak? 6) Check open file descriptors (process_open_fds): is there a file descriptor leak? 7) Add object allocation rate metrics (go_memstats_mallocs_total). 8) Correlate memory growth with request rate: does memory grow faster under higher load? 9) If heap grows but goroutine count is stable, suspect memory in long-lived objects. 10) Use pprof or equivalent to capture heap profile. 11) Identify the object type consuming the most memory. 12) Fix the leak, verify memory plateau. Result: Memory usage stabilizes at expected level. Metrics dashboard now acts as early warning for future leaks.

### 13.19 Example: Kafka Consumer Lag Investigation

Situation: Kafka consumer group falling behind causing 5-minute processing delay. Approach: 1) Check kafka_consumer_lag metric for the consumer group. 2) Identify which partition has highest lag. 3) Check consumer group metrics: kafka_consumer_group_members, kafka_consumer_group_offset, kafka_consumer_group_lag. 4) Check producer metrics: kafka_topic_partition_current_offset (latest offset). 5) Is the producer producing faster than the consumer can consume? Check message in rate vs message out rate. 6) Is the consumer processing time increasing? Check consumer processing_time_seconds metric. 7) Is the consumer instance count too low? Check consumer instance count vs optimal (lag/processing_time/max_concurrency). 8) Is there a slow consumer instance? Check per-instance processing time. 9) Is the consumer instance repeatedly rebalancing? Check consumer group rebalance rate. 10) Fix: add more consumer instances, optimize processing logic, or increase partition count. Result: Consumer lag reduced to acceptable level. Dashboard shows lag by partition and processing time by instance.

### 13.20 Example: Certificate Expiry Emergency

Situation: Alert fires: TLS certificate for api.example.com expires in 3 days. Approach: 1) Check certificate expiry metric: probe_ssl_earliest_cert_expiry from blackbox_exporter. 2) Confirm the exact expiry date and time. 3) Check which load balancer or ingress serves the certificate. 4) Verify certificate renewal process: is it auto-renewed (Let's Encrypt) or manual? 5) If auto-renewed: check cert-manager logs for renewal failures. 6) If manual: start certificate renewal process immediately. 7) After renewal: verify new certificate via probe_ssl_earliest_cert_expiry. 8) Update runbook: add steps for manual renewal and create alert for 14-day expiry warning. 9) Set up cert-manager for auto-renewal if not already configured. 10) Monitor certificate lifecycle: days until expiry for all critical certificates. Result: Certificate renewed before expiry. Dashboard now shows certificate health for all services.

### 13.21 Example: Database Connection Pool Exhaustion

Situation: Service returns 503 errors during peak traffic. Investigation reveals database connection pool exhaustion. Approach: 1) Check connection pool metrics: db_connections_active, db_connections_idle, db_connections_max, db_connections_pending (waiting). 2) Graph: active connections approaching max during peak hours. 3) Check request rate vs latency correlation: as active connections approach max, latency increases (requests queue). 4) Check query duration: individual queries executing longer than usual? 5) Check if a recent deploy changed connection pool configuration. 6) Check if a recent data change caused query slow-down (missing index issue). 7) Immediate fix: increase max pool size (hotfix). 8) Long-term fix: optimize slow queries, add connection pooling middleware (pgBouncer), or adjust pool sizing based on concurrency. 9) Add alert: db_connections_active / db_connections_max > 0.8 for 5 minutes. 10) Add dashboard: connection pool utilization, connection wait time, query latency correlation. Result: Pool exhaustion prevented. Alerting catches future incidents before they affect users.

### 13.22 Example: gRPC Service Observability

Situation: A new gRPC service needs full observability. Approach: 1) Enable gRPC interceptor for metrics: grpc_server_handling_seconds (histogram of gRPC call durations), grpc_server_handled_total (counter by grpc_method, grpc_code). 2) Enable gRPC interceptor for tracing: creates spans for each gRPC call with attributes grpc.method, grpc.status_code, grpc.request_size, grpc.response_size. 3) Enable structured logging in the gRPC service: log each request/response with correlation ID. 4) Create RED dashboard for gRPC: rate by method (grpc_server_handled_total rate), error rate by code (grpc_server_handled_total with code != OK), latency by method (grpc_server_handling_seconds histogram_quantile). 5) Create SLO: 99.9% of gRPC calls complete in under 100ms. 6) Alert on: high error rate (Unavailable, Internal, DeadlineExceeded), high latency (p99 > 100ms), and high rate of DeadlineExceeded (indicates client-side timeout). Result: gRPC service has standard RED metrics, distributed traces, and SLO-based alerts.

### 13.23 Example: Multi-Service Saga Transaction Observability

Situation: A saga transaction spans 5 services (Order, Payment, Inventory, Shipping, Notification). Need end-to-end observability. Approach: 1) Ensure all 5 services propagate trace context. 2) Create a saga orchestration span in the orchestrator service. 3) Each saga step gets a child span: 'saga.order.step.create_order', 'saga.payment.step.charge', etc. 4) Set saga attributes: saga.id, saga.step.name, saga.step.status (started, completed, compensated, failed). 5) On saga step failure, set span status to Error and add event with error details and compensation action. 6) Create dashboard: saga health (success rate, duration, step breakdown), and sagas in flight (active sagas, longest running). 7) Alert on: saga failure rate > 1% (compensation was triggered), saga duration > threshold (stuck saga), and compensation rate > threshold (systematic failure requiring compensation). 8) Create trace query for debugging: filter traces by saga.id or saga.step.status=error. Result: Full visibility into saga transaction health, step-by-step debugging, and compensation monitoring.

### 13.24 Example: DNS Resolution Issue Debugging

Situation: Services intermittently fail to connect to external APIs with 'no such host' errors. Approach: 1) Check DNS metrics: coredns_dns_requests_total and coredns_dns_responses_total from CoreDNS (if using in-cluster DNS). 2) Check DNS query latency: histogram_quantile for CoreDNS response duration. 3) Check DNS error rate: coredns_dns_responses_total with rcode != NOERROR. 4) Check external DNS probes: probe_dns_lookup_time_seconds from blackbox_exporter for external domains. 5) Check kube-dns pod health: restart count, resource usage. 6) Check nodelocaldns metrics (if using node-local DNS cache). 7) Check application DNS cache settings: are they caching DNS responses too long? 8) Check if the issue is service-specific (one service has incorrect DNS config) or cluster-wide (DNS infrastructure issue). 9) Fix: update DNS cache TTL, add DNS retry logic to application, or scale CoreDNS. 10) Create dashboard: DNS query rate, error rate, latency by domain. Alert on: DNS error rate > 1%, DNS latency > 1s, and CoreDNS pod restarts. Result: DNS issue identified and resolved. Proactive monitoring in place.

### 13.25 Example: Incident Postmortem Driven Observability Improvement

Situation: Post-incident review reveals observability gaps. Approach: 1) Document what was missing during the incident: no dashboard for the affected service, no alert for the failure condition, traces did not span all services, logs were not correlated. 2) Prioritize fixes: add RED dashboard for the service (immediate), create alert for the failure condition (next sprint), add trace instrumentation for the missing service (next sprint), correlate logs with traces (backlog). 3) Implement fixes. 4) Test fixes: simulate the failure condition, confirm alert fires, confirm traces cover full path, confirm logs are correlated. 5) Update runbooks with the new dashboards and alerts. 6) Review observability checklist: after every major incident, review observability coverage and add missing instrumentation. 7) Track observability debt: maintain a backlog of observability improvements. Result: Each incident improves observability coverage. Over time, the system becomes more observable and incidents become easier to debug.


## P14 Expansion — Additional Anti-Patterns

### 14.31 Anti-Pattern: The Dashboard That Never Loads

Building a dashboard with queries that scan millions of time series and take 60 seconds to load. Engineers learn to not open the dashboard. Fix: use recording rules for expensive queries. Set appropriate time range limits. Use dashboard-level caching. Drive query performance metrics: dashboard load time should be under 5 seconds. Consider splitting the dashboard into multiple focused views.

### 14.32 Anti-Pattern: The Pager Happy Team

A culture where paging is the default response to any anomaly, no matter how minor. Results: chronic alert fatigue, high turnover of on-call engineers, and missed critical alerts. Fix: define clear paging criteria: page only for confirmed user-impacting issues. Use warning-level alerts for everything else. Measure and reduce page count. Celebrate low page volumes.

### 14.33 Anti-Pattern: The CloudWatch Dependency

Relying exclusively on cloud provider monitoring (AWS CloudWatch, Azure Monitor, GCP Cloud Monitoring) and not implementing application-level instrumentation. Cloud provider metrics are infrastructure-level (CPU, network, disk). They do not capture application behavior (request rate, error rate by endpoint, business metrics). Fix: implement OTel instrumentation for application-level telemetry. Use cloud provider metrics for infrastructure context, not application debugging.

### 14.34 Anti-Pattern: The Unused Dashboard

Creating dashboards because "it might be useful someday" that are never actually used. Result: dashboard clutter, wasted creation time, and dashboard discovery becomes harder. Fix: only create dashboards for known use cases. Track dashboard usage (Grafana usage insights plugin). Archive dashboards that have not been viewed in 90 days. Require a specific use case before creating a new dashboard.

### 14.35 Anti-Pattern: The Copy-Paste Dashboard

Copying an existing dashboard and changing the data source (or metric names, or label values) without understanding the underlying queries. Result: dashboards that show incorrect data or no data, and the copy's origin is unknown. Fix: use template variables to make dashboards reusable. If a dashboard needs customization for a specific service, create it programmatically (Jsonnet, Grizzly) with the service-specific parameters.

### 14.36 Anti-Pattern: The Five-Alarm Fire Dashboard

Designing the dashboard around every possible failure mode simultaneously, resulting in a screen of red alerts that provide no actionable information. Result: the dashboard adds to the chaos during an incident rather than reducing it. Fix: use different dashboards for different severity levels. The triage dashboard shows only critical status (big numbers, green/red). The investigation dashboard shows detailed metrics for the specific area under investigation.

### 14.37 Anti-Pattern: The Metric Hoarder

Collecting every metric "just in case" without knowing what questions they answer. Result: storage costs are high, the signal-to-noise ratio is terrible, and important metrics are lost in the noise. Fix: every metric should have a documented consumer (a dashboard, an alert, an SLO, or a debugging workflow). If a metric has no consumer for 90 days, remove it. Be ruthless.

### 14.38 Anti-Pattern: The Sampling Fiasco

Sampling traces at 1% across all services without preserving errors. Result: error traces are almost never captured, making error debugging nearly impossible. Fix: implement tail-based sampling that preserves 100% of error traces. If tail-based sampling is not available, increase sampling rate for error spans. Test sampling effectiveness by comparing error counts from metrics vs error counts from traces.

### 14.39 Anti-Pattern: The YAML from Hell

Observability configuration files that are thousands of lines long, with no structure, no comments, and no version history. Any change breaks something. Fix: break configuration into modular files (per-service, per-team, per-dashboard). Use linting and validation in CI/CD. Add comments explaining non-obvious configuration decisions. Use infrastructure as code (Terraform, Pulumi) for declarative management.

### 14.40 Anti-Pattern: The Consultant Trap

Hiring external consultants to set up the entire observability system, then having no internal team that understands how it works or how to maintain it. Fix: always pair consultants with internal engineers. Ensure knowledge transfer is part of the engagement. Document architecture decisions. Have internal engineers own the configuration from day one. Observability is not a one-time setup — it requires ongoing maintenance.

### 14.41 Anti-Pattern: The Tool of the Month

Switching observability tools every quarter based on the latest blog post or conference talk. Result: no team gains deep expertise in any tool, instrumentation is constantly rewritten, and organizational knowledge is lost. Fix: choose tools based on organizational needs, not hype. Commit to a tool for at least 18 months. Evaluate new tools through structured proofs of concept. Standardize on a core toolset.

### 14.42 Anti-Pattern: The Zero-Alert Policy

A team mandate of "zero alerts per day" leads to alert thresholds so high that real problems never trigger. Result: silent failures, users impacted before anyone notices. Fix: focus on alert precision (no false positives) rather than alert volume. A well-calibrated alert system may fire a few times per day, and each alert should represent a real, actionable problem. Zero alerts usually means zero signal.

### 14.43 Anti-Pattern: The Saturday Night Dashboard

Building dashboards and alerts during a weekend outage and never revisiting them. The dashboard is specific to the outage and is irrelevant afterward. Result: stale dashboards that confuse rather than inform. Fix: after creating a dashboard during an incident, review it within a week. Update it to be generally useful, not just incident-specific. Document the dashboard's purpose.

### 14.44 Anti-Pattern: The Department of No

The observability team becomes a bottleneck by requiring manual approval for every metric, every dashboard, and every alert. Result: teams bypass the observability team and implement shadow observability (their own prometheus, their own dashboards) leading to fragmented, unmanaged instrumentation. Fix: provide self-service platforms with guardrails, not manual gates. Automate quality validation. Empower teams to instrument within organizational standards.

## P15 Expansion — Detailed Quality Gates

### 15.19 Quality Gate Implementation: Prometheus Rule Testing

Use promtool to test alerting and recording rules. Create test files: rule_files: ['alerts.yaml'], evaluation_interval: 1m, tests: - interval: 1m, input_series: - series: 'http_requests_total{service="test", status_code="200"}', values: '100+10x10', - series: 'http_requests_total{service="test", status_code="500"}', values: '0+1x10', alert_rule_test: - alertname: HighErrorRate, eval_time: 10m, exp_alerts: - exp_labels: {severity: critical, service: test}, exp_annotations: {summary: 'Error rate is 9.09% above 5% threshold'}. Run: promtool test rules test.yaml. Fail CI if any test fails.

### 15.20 Quality Gate Implementation: Dashboard JSON Validation

Validate dashboard JSON before deployment: check required fields (title, panels, datasource references), validate template variables (no invalid queries), check panel queries are parseable (connect to datasource and dry-run the query), check for broken links (referenced datasources exist), check for excessive panel count (warn if > 20 panels), check for expensive queries (warn if query range is unbounded). Implement as a custom CI step using Grafana API or dashboard validator tool.

### 15.21 Quality Gate Implementation: Instrumentation Coverage Check

Deploy the service in a staging environment. Run a set of integration tests that exercise all major code paths. After tests complete, query the staging Prometheus for expected metrics: count(http_requests_total{service='new-service', endpoint='/api/users'}) (should be > 0), count(http_requests_total{service='new-service', endpoint='/api/orders'}) (should be > 0), count(http_request_duration_seconds_count{service='new-service'}) (should be > 0). Fail if any expected metric is missing. Use a configuration file that lists expected metrics per service.

### 15.22 Quality Gate Implementation: Cardinality Budget Check

In CI: deploy service to staging, scrape its /metrics endpoint, count unique time series (metric_name + label combinations). Compare against budget: if cardinality > 10,000 for the service, fail. If a single metric has more than 1,000 unique label combinations, fail. If any label value appears to be unbounded (matches UUID, email, or timestamp pattern), warn. This gate catches cardinality issues before they hit production.

### 15.23 Quality Gate Implementation: SLO Definition Validation

Check SLO definitions in the observability as code repository: every critical service must have an SLO definition file (slo.yaml). Validate: slo definition has service.name, slo.target (between 0 and 1), sli.type (availability or latency), sli.threshold (for latency SLIs), burn_rate_alerts are defined (at least two levels), and error_budget_policy is defined (what happens when budget is exhausted). Fail if any critical service is missing these.

### 15.24 Quality Gate Implementation: Alert Rule Linting

Check alert rules for common issues: missing runbook annotation, missing summary annotation, empty for duration (should be at least 30s), expression references nonexistent metric, expression uses == 0 or == 1 on gauge (should use absent_over_time for "no data" alerts), expression uses rate on a gauge, label values follow naming conventions (snake_case, no spaces), and alert name follows naming convention (PascalCase or snake_case consistently). Use a custom linter or promtool with additional rules.

### 15.25 Quality Gate Implementation: Sensitive Data Scanning

Use regex patterns to scan logs and metric labels for sensitive data: credit card numbers (regex for major card types), email addresses (username@domain), API keys (patterns for known providers: sk_live_, AKIA, etc.), social security numbers, phone numbers, and access tokens. Run scan on: application source code (logging statements), integration test output (captured logs), and /metrics output (label values). Fail if sensitive data is detected. Implement auto-redaction for common patterns.


## Reference: Complete Code Examples

### Example A: Go HTTP Service with Prometheus Metrics

package main

import (
    "net/http"
    "strconv"
    "time"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{Name: "http_requests_total", Help: "Total number of HTTP requests"},
        []string{"method", "endpoint", "status_code"},
    )
    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{Name: "http_request_duration_seconds", Help: "HTTP request latency", Buckets: prometheus.DefBuckets},
        []string{"method", "endpoint"},
    )
    httpRequestsInFlight = promauto.NewGauge(
        prometheus.GaugeOpts{Name: "http_requests_in_flight", Help: "Current number of HTTP requests in flight"},
    )
)

func instrumentedHandler(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        httpRequestsInFlight.Inc()
        defer httpRequestsInFlight.Dec()
        start := time.Now()
        sw := statusWriter{ResponseWriter: w, statusCode: http.StatusOK}
        next.ServeHTTP(&sw, r)
        duration := time.Since(start).Seconds()
        httpRequestsTotal.With(prometheus.Labels{
            "method": r.Method, "endpoint": r.URL.Path, "status_code": strconv.Itoa(sw.statusCode),
        }).Inc()
        httpRequestDuration.With(prometheus.Labels{
            "method": r.Method, "endpoint": r.URL.Path,
        }).Observe(duration)
    }
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/api/users", instrumentedHandler(usersHandler))
    http.HandleFunc("/api/orders", instrumentedHandler(ordersHandler))
    http.ListenAndServe(":8080", nil)
}

### Example B: Go HTTP Service with OTel Tracing

package main

import (
    "context"
    "net/http"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/trace"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

func initTracer() (*sdktrace.TracerProvider, error) {
    exporter, err := otlptracegrpc.New(context.Background(), otlptracegrpc.WithEndpoint("otel-collector:4317"), otlptracegrpc.WithInsecure())
    if err != nil { return nil, err }
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter),
        sdktrace.WithResource(resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceName("my-service"),
            semconv.ServiceVersion("1.0.0"),
        )),
    )
    otel.SetTracerProvider(tp)
    return tp, nil
}

func tracingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    tracer := otel.Tracer("my-service")
    return func(w http.ResponseWriter, r *http.Request) {
        ctx := r.Context()
        spanName := r.Method + " " + r.URL.Path
        ctx, span := tracer.Start(ctx, spanName, trace.WithAttributes(
            semconv.HTTPMethod(r.Method),
            semconv.HTTPURL(r.URL.String()),
            semconv.HTTPTarget(r.URL.Path),
            semconv.HTTPHost(r.Host),
        ))
        defer span.End()
        r = r.WithContext(ctx)
        next.ServeHTTP(w, r)
        span.SetAttributes(semconv.HTTPStatusCode(r.Response.StatusCode))
        if r.Response.StatusCode >= 500 {
            span.SetStatus(sdktrace.StatusError, "server error")
        }
    }
}

func main() {
    tp, _ := initTracer()
    defer tp.Shutdown(context.Background())
    http.HandleFunc("/api/users", tracingMiddleware(usersHandler))
    http.ListenAndServe(":8080", nil)
}

### Example C: Python Service with OTel Auto and Manual Instrumentation

from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
import flask

app = flask.Flask(__name__)

resource = Resource.create({SERVICE_NAME: "my-python-service", SERVICE_VERSION: "1.0.0"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="otel-collector:4317", insecure=True))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

@app.route("/api/orders/<order_id>")
def get_order(order_id):
    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("get_order") as span:
        span.set_attribute("order.id", order_id)
        import requests
        resp = requests.get(f"http://payment-service/api/charges/{order_id}")
        if resp.status_code >= 400:
            span.set_status(trace.Status(trace.StatusCode.ERROR, "payment failed"))
        return {"order_id": order_id, "payment": resp.json()}

if __name__ == "__main__":
    app.run(port=8080)

### Example D: Python Structured Logging with structlog and OTel

import structlog
import logging
from opentelemetry import trace
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter

logger = structlog.get_logger()

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.stdlib.ExtraAdder(),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

@app.route("/api/users")
def get_users():
    current_span = trace.get_current_span()
    trace_id = format(current_span.get_span_context().trace_id, "032x")
    logger.info("fetching users", trace_id=trace_id, endpoint="/api/users")
    try:
        users = db.query("SELECT * FROM users").fetchall()
        logger.info("users fetched", trace_id=trace_id, count=len(users))
        return {"users": users}
    except Exception as e:
        logger.error("failed to fetch users", trace_id=trace_id, error=str(e), exc_info=True)
        return {"error": str(e)}, 500

### Example E: Java Spring Boot with OTel Auto-Instrumentation

// No code changes needed for auto-instrumentation.
// Run with: java -javaagent:opentelemetry-javaagent.jar -jar my-app.jar
// Configure: OTEL_SERVICE_NAME=my-java-service
//            OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
//            OTEL_TRACES_SAMPLER=traceidratio
//            OTEL_TRACES_SAMPLER_ARG=0.01

// For manual instrumentation, add tracer:
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.OpenTelemetry;

@Service
public class OrderService {
    private final Tracer tracer = GlobalOpenTelemetry.getTracer("order-service");

    public Order createOrder(OrderRequest request) {
        Span span = tracer.spanBuilder("createOrder").startSpan();
        try (var scope = span.makeCurrent()) {
            span.setAttribute("order.value", request.getValue());
            span.setAttribute("order.items", request.getItemCount());
            Order order = orderRepository.save(request.toOrder());
            span.setAttribute("order.id", order.getId());
            return order;
        } catch (Exception e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, "Failed to create order");
            throw e;
        } finally {
            span.end();
        }
    }
}

### Example F: Node.js Express with OTel Instrumentation

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'my-node-service',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
});

const exporter = new OTLPTraceExporter({ url: 'http://otel-collector:4317' });
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

registerInstrumentations({
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

const express = require('express');
const app = express();
app.get('/api/users', (req, res) => {
    const tracer = require('@opentelemetry/api').trace.getTracer('my-node-service');
    const span = tracer.startSpan('getUsers');
    span.setAttribute('endpoint', '/api/users');
    // business logic here
    span.end();
    res.json({ users: [] });
});
app.listen(8080);

### Example G: OTel Collector Configuration - Agents

receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
  hostmetrics:
    scrapers: { cpu: {}, memory: {}, disk: {}, network: {}, load: {} }
  kubeletstats:
    collection_interval: 30s
    auth_type: serviceAccount

processors:
  memory_limiter:
    check_interval: 5s
    limit_mib: 512
    spike_limit_mib: 128
  batch:
    timeout: 5s
    send_batch_size: 10000
  k8sattributes:
    auth_type: serviceAccount
    passthrough: false
    extract:
      metadata: [k8s.namespace.name, k8s.pod.name, k8s.node.name, k8s.pod.uid, k8s.deployment.name]
      labels: [app.kubernetes.io/name, app.kubernetes.io/version, app.kubernetes.io/component]
  attributes:
    actions:
      - key: environment
        value: production
        action: upsert
      - key: datacenter
        value: us-east-1
        action: upsert
  filter:
    traces:
      span:
        - not (IsMatch(attributes["http.target"], "^/healthz"))  # Drop health check spans
    logs:
      log_record:
        - 'attributes["http.target"] == "/healthz"'  # Drop health check logs
  transform:
    trace:
      - context: span
        statements:
          - set(status.code, 1) where attributes["http.status_code"] != nil and attributes["http.status_code"] >= 500

exporters:
  otlp:
    endpoint: otel-gateway:4317
    tls: { insecure: true }
    sending_queue: { enabled: true, num_consumers: 10, queue_size: 5000 }
    retry_on_failure: { enabled: true, initial_interval: 5s, max_interval: 30s, max_elapsed_time: 300s }

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, k8sattributes, attributes, filter, batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, k8sattributes, attributes, batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, k8sattributes, attributes, filter, batch]
      exporters: [otlp]

### Example H: OTel Collector Configuration - Gateway

receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }

processors:
  memory_limiter:
    check_interval: 5s
    limit_mib: 1024
  batch:
    timeout: 10s
    send_batch_size: 50000
  attributes:
    actions:
      - key: global_environment
        value: production
        action: upsert
  probabilistic_sampler:
    hash_seed: 12345
    sampling_percentage: 10.0  # Downsample to 10% at the gateway level
  filter:
    metrics:
      metric:
        - 'name == "otelcol_process_runtime_total_alloc_bytes"'  # Drop internal collector metrics from export
  redaction:
    allow_all_keys: false
    allowed_keys:
      - http.method
      - http.status_code
      - http.target
      - db.system
      - db.operation
      - service.name
      - environment
    blocked_keys:
      - password
      - secret
      - token
      - authorization

exporters:
  prometheusremotewrite:
    endpoint: http://mimir:9009/api/v1/push
    resource_to_telemetry_conversion:
      enabled: true
  otlp/tempo:
    endpoint: tempo:4317
    tls: { insecure: true }
  loki:
    endpoint: http://loki:3100/loki/api/v1/push
    tenant: production
    tls: { insecure: true }

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, probabilistic_sampler, batch]
      exporters: [otlp/tempo, logging]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch, filter]
      exporters: [prometheusremotewrite]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, redaction, batch]
      exporters: [loki]


## Reference: Metrics and Dimensions Quick Reference

### Metric Type Reference Table

| Type | Semantics | Use For | Rate Function | Aggregation | Storage Cost |
|------|-----------|---------|--------------|-------------|-------------|
| Counter | Monotonically increasing | Request count, error count, bytes served | rate(), irate(), increase() | sum (additive) | 1 series + 1 sample per scrape |
| Gauge | Goes up and down | Memory, CPU, queue depth, connections | None (use delta() for change) | avg, max, min, sum | 1 series + 1 sample per scrape |
| Histogram | Distribution of values | Latency, response size, request size | rate() on bucket series | histogram_quantile() | (buckets + 2) series per scrape |
| Summary | Pre-computed quantiles | Latency (when histogram not possible) | rate() on quantiles | Cannot aggregate | (quantiles + 2) series |

### Prometheus Query Functions Quick Reference

| Function | Purpose | Example | Notes |
|----------|---------|---------|-------|
| rate() | Per-second average rate of counter | rate(http_requests_total[5m]) | Use for counters, handles resets |
| irate() | Instantaneous rate (last 2 points) | irate(http_requests_total[5m]) | More responsive, noisier |
| increase() | Total increase over time range | increase(http_requests_total[1h]) | rate() * time_range |
| delta() | Change in gauge over time | delta(memory_usage[1h]) | For gauges only |
| deriv() | Per-second derivative of gauge | deriv(disk_usage[1h]) | Rate of change for gauges |
| histogram_quantile() | Quantile from histogram | histogram_quantile(0.99, rate(...)[5m]) | Always use rate() on buckets |
| predict_linear() | Linear prediction | predict_linear(disk_free[1h], 86400) | Uses linear regression |
| absent() | 1 if metric has no data | absent(metric) | Useful for no-data alerts |
| absent_over_time() | 1 if no data in range | absent_over_time(metric[5m]) | Better than absent for scraping |
| topk() | Top k series by value | topk(5, rate(...)[5m]) | Finds hotspots |
| bottomk() | Bottom k series by value | bottomk(5, rate(...)[5m]) | Finds outliers |
| holtwinters() | Seasonal prediction | holtwinters(metric[7d], 0.1, 0.2, 0.3) | Requires seasonal data |
| label_replace() | Modify label values | label_replace(metric, "new", "", "old", "(.*)") | Regex-based label transformation |
| count() | Count time series | count(metric) | Useful for cardinality monitoring |
| avg() | Average across series | avg by (service) (metric) | Common aggregation |
| sum() | Sum across series | sum by (service) (metric) | For additive metrics |
| max() | Maximum across series | max by (service) (metric) | For worst-case analysis |
| min() | Minimum across series | min by (service) (metric) | For best-case analysis |
| quantile_over_time() | Quantile from range vector | quantile_over_time(0.99, metric[1h]) | Aggregation within a single series |

### OTel Semantic Convention Attribute Reference

| Area | Attribute | Type | Example |
|------|-----------|------|---------|
| HTTP | http.request.method | string | GET, POST, DELETE |
| HTTP | http.response.status_code | int | 200, 404, 500 |
| HTTP | url.full | string | https://api.example.com/users?id=123 |
| HTTP | server.address | string | api.example.com |
| HTTP | client.address | string | 10.0.0.1 |
| DB | db.system | string | postgresql, mysql, redis |
| DB | db.namespace | string | my_database |
| DB | db.query.text | string | SELECT * FROM users WHERE id = ? |
| DB | db.operation.name | string | SELECT, INSERT, UPDATE, DELETE |
| DB | db.collection.name | string | users (MongoDB collection) |
| Messaging | messaging.system | string | kafka, rabbitmq, sqs |
| Messaging | messaging.destination.name | string | orders-topic, payment-queue |
| Messaging | messaging.operation.type | string | publish, receive, process |
| Messaging | messaging.message.id | string | msg_123456 |
| RPC | rpc.system | string | grpc, thrift |
| RPC | rpc.service | string | PaymentService |
| RPC | rpc.method | string | ChargeCard |
| RPC | rpc.grpc.status_code | int | 0 (OK), 2 (Unknown), 14 (Unavailable) |
| General | service.name | string | my-service |
| General | service.version | string | 1.2.3 |
| General | deployment.environment | string | production, staging, development |
| General | telemetry.sdk.name | string | opentelemetry |
| General | cloud.provider | string | aws, gcp, azure |
| General | cloud.region | string | us-east-1, europe-west1 |
| General | host.name | string | ip-10-0-0-1.ec2.internal |
| General | k8s.namespace.name | string | production |
| General | k8s.pod.name | string | my-service-abc123 |
| General | k8s.deployment.name | string | my-service |
| General | container.id | string | abc123def456 |

### Log Level Usage Guide

| Level | When to Use | Notification | Sampling | Example Messages |
|-------|-------------|-------------|----------|-----------------|
| DEBUG | Detailed diagnostic info during development | Never in production | 0% in production | "SQL query: SELECT * FROM users", "Loop iteration 42" |
| INFO | Normal operational milestones | No (dashboard only) | 10-100% | "Request started", "Request completed", "User logged in" |
| WARN | Unexpected but non-error conditions | Alert if rate > threshold | 100% | "Rate limit approaching", "Deprecated API called", "Slow query (500ms)" |
| ERROR | Error conditions needing investigation | Alert if rate > threshold | 100% | "Database connection failed", "External service returned 500" |
| FATAL | Unrecoverable error, process will exit | Immediate page | 100% | "Unable to bind to port 8080", "Configuration failed to load" |

### Prometheus Bucket Configuration Reference

| Use Case | Buckets (seconds) | Notes |
|----------|-------------------|-------|
| API latency (typical) | 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10 | Default Prometheus buckets |
| API latency (fast) | 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1 | For sub-millisecond services |
| API latency (slow) | 0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10, 30, 60, 120 | For data processing services |
| Response size (bytes) | 100, 1000, 10000, 100000, 1000000, 10000000, 100000000 | For response body sizes |
| Request size (bytes) | 100, 1000, 10000, 100000, 1000000, 10000000 | For request body sizes |
| Query duration (DB) | 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 60 | For database query latency |
| Cache latency | 0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1 | For cache lookup latency |

### SLO Target Guide by Service Criticality

| Service Type | Example | SLO Target | Error Budget/Window | Burn Rate Alert Thresholds |
|-------------|---------|------------|--------------------|---------------------------|
| User-facing critical | Payment, Checkout, Auth | 99.99% | 0.01%/30 days = 4.3 min | >20 for 5m, >5 for 30m, >2 for 6h |
| User-facing standard | Product search, User profile | 99.9% | 0.1%/30 days = 43 min | >10 for 5m, >3 for 1h, >1.5 for 6h |
| Internal critical | Order processing, Inventory sync | 99.5% | 0.5%/30 days = 3.6 hours | >6 for 10m, >2 for 1h, >1 for 12h |
| Internal standard | Reporting, Analytics | 99% | 1%/30 days = 7.2 hours | >3 for 15m, >1.5 for 2h |
| Batch processing | ETL jobs, Data export | 99% (completion) | 1%/30 days = 7.2 hours | Freshness: > threshold for 1h |
| Development | Staging, Dev environments | None | N/A | No pages, only dashboards |

### Alert Severity Definition Reference

| Severity | Label | Page? | Response Time | Channels | Use Case |
|----------|-------|-------|--------------|----------|----------|
| Critical | critical | Yes, 24x7 | 5 minutes | PagerDuty + Slack | Service down, data loss, security breach |
| Warning | warning | Business hours only | 30 minutes | Slack | Degraded performance, capacity warning |
| Info | info | No | Dashboard only | Dashboard annotation | Deploy completed, backup success |
| Ticket | ticket | No | Next business day | Ticket system | Certificate expires in 30 days, disk usage trend |

## Reference: Kubernetes Prometheus Rule Files

### Full kube-prometheus-stack Rules Reference

groups:
  - name: kubernetes-nodes
    rules:
      - alert: NodeMemoryPressure
        expr: kube_node_status_condition{condition="MemoryPressure", status="true"} == 1
        for: 5m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Node {{.node}} is under memory pressure"}
      - alert: NodeDiskPressure
        expr: kube_node_status_condition{condition="DiskPressure", status="true"} == 1
        for: 5m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Node {{.node}} is under disk pressure"}
      - alert: NodePIDPressure
        expr: kube_node_status_condition{condition="PIDPressure", status="true"} == 1
        for: 5m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Node {{.node}} is under PID pressure"}
      - alert: NodeNotReady
        expr: kube_node_status_condition{condition="Ready", status="true"} == 0
        for: 10m
        labels: {severity: critical, team: platform}
        annotations: {summary: "Node {{.node}} is not ready"}

  - name: kubernetes-pods
    rules:
      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) * 60 * 5 > 0
        for: 10m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Pod {{.pod}} is crash looping"}
      - alert: PodPending
        expr: kube_pod_status_phase{phase="Pending"} == 1
        for: 30m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Pod {{.pod}} has been pending for 30 minutes"}
      - alert: PodOOMKilled
        expr: kube_pod_container_status_last_terminated_reason{reason="OOMKilled"} == 1
        for: 0m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Pod {{.pod}} was OOM killed"}
      - alert: PodFailed
        expr: kube_pod_status_phase{phase="Failed"} == 1
        for: 5m
        labels: {severity: warning, team: platform}
        annotations: {summary: "Pod {{.pod}} is in Failed state"}

  - name: kubernetes-volumes
    rules:
      - alert: PersistentVolumeUsageCritical
        expr: (kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes) * 100 > 90
        for: 5m
        labels: {severity: critical, team: platform}
        annotations: {summary: "PersistentVolume {{.persistentvolumeclaim}} usage is at {{ | humanizePercentage}}"}
      - alert: PersistentVolumeUsageWarning
        expr: (kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes) * 100 > 80
        for: 5m
        labels: {severity: warning, team: platform}
        annotations: {summary: "PersistentVolume {{.persistentvolumeclaim}} usage is at {{ | humanizePercentage}}"}

### Service RED Metrics Recording Rules

groups:
  - name: service-red-metrics
    rules:
      - record: service:http_requests:rate5m
        expr: sum by (service) (rate(http_requests_total[5m]))
      - record: service:http_errors:rate5m
        expr: sum by (service) (rate(http_requests_total{status_code=~"5.."}[5m]))
      - record: service:http_error_ratio:rate5m
        expr: (sum by (service) (rate(http_requests_total{status_code=~"5.."}[5m])) / sum by (service) (rate(http_requests_total[5m]))) or vector(0)
      - record: service:http_request_duration_seconds:p99
        expr: histogram_quantile(0.99, sum by (service, le) (rate(http_request_duration_seconds_bucket[5m])))
      - record: service:http_request_duration_seconds:p95
        expr: histogram_quantile(0.95, sum by (service, le) (rate(http_request_duration_seconds_bucket[5m])))
      - record: service:http_request_duration_seconds:p50
        expr: histogram_quantile(0.50, sum by (service, le) (rate(http_request_duration_seconds_bucket[5m])))
      - record: service:http_requests_in_flight:avg
        expr: avg by (service) (http_requests_in_flight)
      - record: service:http_requests_in_flight:max
        expr: max by (service) (http_requests_in_flight)

### SLO Burn Rate Alerting Rules

groups:
  - name: slo-burn-rate
    rules:
      - alert: SLOBurnRateHigh
        expr: |
          (1 - (sum by (service) (rate(sli:good:total[5m])) / sum by (service) (rate(sli:total:total[5m])))) / (1 - 0.999) > 10
        for: 5m
        labels: {severity: critical, team: sre}
        annotations:
          summary: "SLO burn rate is {{ | humanize}}x for {{.service}}"
          description: "Error budget is being consumed {{ | humanize}}x faster than budgeted for {{.service}}. SLO will be exhausted in less than 3 days."
      - alert: SLOBurnRateModerate
        expr: |
          (1 - (sum by (service) (rate(sli:good:total[30m])) / sum by (service) (rate(sli:total:total[30m])))) / (1 - 0.999) > 3
        for: 1h
        labels: {severity: warning, team: sre}
        annotations:
          summary: "SLO burn rate is {{ | humanize}}x for {{.service}}"
          description: "Error budget is being consumed {{ | humanize}}x faster than budgeted for {{.service}}."
      - alert: SLOBurnRateLow
        expr: |
          (1 - (sum by (service) (rate(sli:good:total[1h])) / sum by (service) (rate(sli:total:total[1h])))) / (1 - 0.999) > 1
        for: 24h
        labels: {severity: warning, team: sre}
        annotations:
          summary: "SLO burn rate is {{ | humanize}}x for {{.service}}"
          description: "Error budget is being consumed at the budgeted rate. SLO will be exactly met at window end."


## Reference: Incident Response Playbooks

### Playbook 1: High Error Rate

Symptom: Alert fires for high error rate (HTTP 5xx > threshold). Steps: 1) Acknowledge the alert. 2) Open the RED dashboard for the affected service. 3) Determine scope: is the error rate elevated for all endpoints or specific ones? Use topk(10, sum by (endpoint) (rate(http_requests_total{status_code=~'5..', service='affected-service'}[5m]))) to find worst endpoints. 4) Is the error rate elevated for a specific status code? (503 vs 500 vs 502 vs 504). 5) Open trace explorer, filter by affected service and error status, look at recent error traces. 6) Check span status: which operation fails? (database call? external API? internal logic?). 7) Check logs from affected traces: what is the error message? 8) Check if a deployment happened just before the error rate increased (check annotations). 9) If deployment: rollback. 10) If no deployment: check upstream dependencies (database, external APIs, message queues). 11) If upstream dependency: check its dashboards for issues. 12) If database: check query latency, connection pool, locks. 13) If external API: check dependency health dashboard. 14) Implement mitigation: rollback, scale up, switch to fallback. 15) Document findings in postmortem.

### Playbook 2: High Latency

Symptom: Alert fires for p99 latency exceeding threshold. Steps: 1) Acknowledge alert. 2) Open RED dashboard, check latency over last hour. Is the increase sudden (deploy/config change) or gradual (data growth, traffic increase)? 3) Check latency by endpoint: which endpoints are slow? 4) Open trace explorer, filter by slow endpoint, sort by duration descending. 5) Inspect the slowest trace: which span is the bottleneck? 6) Database bottleneck: check db.statement attribute, query execution plan, index usage, table size. 7) External API bottleneck: check http.url attribute, dependency latency. 8) Internal processing bottleneck: examine span attributes for input size, processing complexity. 9) CPU bottleneck: check container CPU usage during the incident window. 10) Concurrency bottleneck: check in-flight requests vs CPU usage — high in-flight with low CPU suggests queuing/blocking. 11) Memory bottleneck: check GC pressure, heap usage. 12) Implement mitigation: scale horizontally, add database index, reduce external API timeout, implement caching. 13) Monitor recovery: check latency trend after mitigation. 14) Root cause analysis: what changed to cause the latency increase?

### Playbook 3: Service Down

Symptom: Alert fires for service unavailability (up=0, or 100% error rate). Steps: 1) Acknowledge alert (critical). 2) Check if the service is running: check pod status, node status, deployment status. 3) Check service logs: last log entries before failure. 4) Check service resource usage: were resources exhausted (OOM, CPU throttled)? 5) Check upstream dependencies: are all databases, queues, and external APIs available? 6) Check recent changes: deploy, config change, scaling event. 7) Check cluster health: any nodes down? Network issues? 8) Check for cascading failures: other services also down? 9) Immediate mitigation: restart service, rollback deploy, scale up, increase resources. 10) If mitigation fails: escalate to on-call engineer with more context. 11) If database issue: check database dashboard, restart database if needed. 12) If network issue: check network dashboard, contact infrastructure team. 13) After recovery: verify service health, check error budget impact, monitor for 30 minutes before handing off. 14) Document incident timeline and root cause.

### Playbook 4: SLO Burn Rate Alert

Symptom: Alert fires for SLO burn rate exceeding threshold. Steps: 1) Open SLO dashboard for the affected service. 2) Check current SLO compliance and remaining error budget. 3) Determine burn rate: how fast is error budget being consumed? 4) Check what is causing the errors: high error rate, high latency, or both? 5) Follow the High Error Rate or High Latency playbook as appropriate. 6) If errors are within normal range but burn rate is elevated (chronic slow consumption): investigate for a small but persistent error source. 7) Use trace analysis to find the error source: filter traces with error status, look for common patterns. 8) Mitigate the error source. 9) Once error rate normalizes, monitor SLO compliance recovery. 10) Calculate how long until error budget is restored (at current burn rate). 11) If error budget is exhausted: initiate error budget policy (deployment freeze, reliability work). 12) Document the incident and update SLO target if needed.

### Playbook 5: Database Degradation

Symptom: Database alerts firing (high latency, connection saturation, replication lag). Steps: 1) Open database dashboard. 2) Check query latency: overall p50/p95/p99. 3) Check connection count: active vs max. 4) Check replication lag (if replica). 5) Check locks: number of waiting queries, lock duration. 6) Check slow queries: pg_stat_statements for PostgreSQL, slow_query_log for MySQL. 7) Identify the slow query pattern. 8) Check if a new query pattern emerged (new feature deploy). 9) Check data volume growth: did a table grow significantly? 10) Check index usage: are indexes being used? Are any missing indexes suggested? 11) Immediate mitigation: terminate blocking queries, add index (if safe), scale database (read replica, larger instance). 12) If connection pool exhaustion: increase pool size, reduce connection idle timeout. 13) Long-term fix: query optimization, database maintenance (VACUUM, ANALYZE), connection pooling middleware, caching layer. 14) Monitor after fix: query latency, connection count, lock status.

### Playbook 6: Kafka Consumer Lag

Symptom: Alert fires for Kafka consumer lag exceeding threshold. Steps: 1) Check Kafka dashboard: consumer lag by consumer group and partition. 2) Is the lag increasing (consumer falling behind) or steady (consumer processing at max rate)? 3) Check consumer processing time metric. 4) Check consumer instance count vs partition count. 5) Check for slow consumer instances: is one instance lagging more than others? 6) Check for rebalancing: are consumers frequently rebalancing? 7) Check producer rate: is the producer sending messages faster than normal? 8) Immediate mitigation: add more consumer instances, increase consumer throughput (batch size, concurrency). 9) If specific partition: check if a slow consumer instance is assigned that partition. 10) If rebalancing: check consumer group stability (session timeout, heartbeat interval). 11) Long-term fix: increase partition count, optimize consumer processing, add auto-scaling for consumers. 12) Monitor after fix: lag should trend toward 0.

### Playbook 7: Certificate Expiry

Symptom: Alert fires for certificate expiring soon. Steps: 1) Check certificate expiry metric: probe_ssl_earliest_cert_expiry from blackbox_exporter. 2) Confirm the certificate name, issuer, and expiry date. 3) Determine renewal method: auto-renewal (cert-manager) or manual. 4) If cert-manager: check cert-manager logs for renewal errors. 5) If manual: start renewal process immediately. 6) After renewal: verify the new certificate is served correctly (probe_ssl_earliest_cert_expiry should show new expiry). 7) Update certificate inventory. 8) Check other certificates: run a full scan of all endpoints for expiring certificates. 9) Improve monitoring: set up alerts at 30 days, 14 days, 7 days, and 3 days before expiry. 10) Document the renewal process and update runbook.

### Playbook 8: DNS Resolution Failure

Symptom: Services cannot resolve hostnames, connections fail with 'no such host'. Steps: 1) Check DNS dashboard: CoreDNS metrics, query rate, error rate, latency. 2) Check CoreDNS pod health: restarts, resource usage. 3) Test DNS resolution from within cluster: kubectl run dns-test --image=busybox -- nslookup example.com. 4) Check DNS configuration: configmap for CoreDNS (Corefile). 5) Check upstream DNS servers: are they reachable and responding? 6) Check network policies: are DNS requests being blocked? 7) Check for DNS cache issues: nodelocaldns (node-local DNS cache) health. 8) Check application DNS configuration: are there custom DNS resolvers configured? 9) Immediate mitigation: restart CoreDNS pods, check upstream DNS provider status. 10) Long-term fix: configure DNS fallback, increase CoreDNS replicas, implement node-local DNS caching. 11) Monitor DNS health: error rate, latency, and query success rate should return to normal.

## Reference: Observability Pipeline Monitoring Checklist

Monitor these metrics for observability pipeline health:

Agent-level (OTel Collector, Fluent Bit): cpu_usage_percent, memory_usage_bytes (should be under 512MB), queue_length (should not grow unbounded), exporter_send_failed_spans/metrics/logs (should be 0), processor_dropped_spans/metrics/logs (should be 0), uptime_seconds (recently restarted?).

Gateway-level: request_rate (spans/second, metrics/second, logs/second), request_duration_seconds (processing time per batch), memory_usage_bytes (should be under 2GB), goroutine_count (should be stable), exporter_send_failed (should be 0), and backlog size (data buffered for export).

Backend-level (Prometheus, Thanos): tsdb_head_series (active series count), tsdb_head_samples_appended_total (ingestion rate), tsdb_compactions_total (compaction health), prometheus_tsdb_storage_blocks_bytes (disk usage), prometheus_target_interval_length_seconds (scrape duration vs interval), prometheus_rule_evaluation_duration_seconds (rule evaluation time).

Backend-level (Elasticsearch): elasticsearch_cluster_health_status (green=1, yellow=0, red=-1), elasticsearch_indices_indexing_index_time_seconds (indexing latency), elasticsearch_breakers_tripped (circuit breakers triggered), elasticsearch_jvm_gc_collection_seconds (GC pressure), and elasticsearch_filesystem_data_free_bytes (disk space).

Alertmanager-level: alertmanager_alerts (active alert count), alertmanager_notifications_total (sent count), alertmanager_notifications_failed_total (failed count, should be 0), alertmanager_notifications_failed_rate (failure rate, alert if > 0%).

## Reference: Dashboard Template Specifications

### Service RED Dashboard Template

Purpose: At-a-glance health for a single service. Panels: row 1 (top status row): SLO compliance (stat panel, big number, green/yellow/red), request rate (sparkline), error rate (sparkline), latency p99 (sparkline). Row 2 (RED row): request rate (time series, by endpoint), error rate (time series, by endpoint), error ratio (time series, by endpoint). Row 3 (latency row): latency p50/p95/p99 (time series, by endpoint), latency heatmap (heatmap panel). Row 4 (concurrency): in-flight requests (time series), queue depth (time series), upstream latency (time series). Row 5 (resources): CPU usage (time series), memory usage (time series), goroutines/threads (time series), GC duration (time series). Row 6 (dependencies): dependency health (table, status column), dependency latency (time series), dependency error rate (time series). Variables: service (query variable from label_values(http_requests_total, service)), environment (custom variable: production, staging), time range (built-in).

### Infrastructure USE Dashboard Template

Purpose: Resource health for infrastructure components. Panels: Row 1 (CPU): utilization (time series, per core), saturation (load average), errors (if available). Row 2 (Memory): utilization (used/available), saturation (swap usage, page faults), errors (ECC errors). Row 3 (Disk): utilization (used/free per mountpoint), saturation (I/O queue depth, I/O wait time), errors (disk errors, device errors). Row 4 (Network): utilization (bytes in/out, % bandwidth), saturation (drop rate, error rate), errors (interface errors, packet loss). Variables: instance (label_values(node_uname_info, instance)).

### SLO Dashboard Template

Purpose: SLO compliance monitoring. Panels: Row 1: current SLO compliance (stat panel, 99.9% or similar), error budget remaining (stat panel, X of Y, with gauge), burn rate (stat panel, current burn rate). Row 2: SLO compliance over time (time series, with SLO target line), error budget consumption over time (time series, shows budget being consumed). Row 3: good vs bad events (stacked time series), burn rate over time (time series, with threshold lines for alert levels). Row 4: predicted compliance at current burn rate (time series, extends into future), SLO report (table: service, SLO target, current compliance, budget remaining, burn rate). Variables: service (query variable), slo_target (custom variable, default 99.9), window (custom variable: 7d, 14d, 30d).

## Reference: Prometheus Alert Rules by Category

### Infrastructure Alerts
groups:
  - name: infrastructure
    rules:
      - alert: HighCPUUsage
        expr: (100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)) > 80
        for: 10m
        labels: {severity: warning}
      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
        for: 15m
        labels: {severity: warning}
      - alert: DiskSpaceLow
        expr: (node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100 > 85
        for: 5m
        labels: {severity: warning}
      - alert: DiskSpaceCritical
        expr: (node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100 > 95
        for: 5m
        labels: {severity: critical}
      - alert: DiskWillFillIn24Hours
        expr: predict_linear(node_filesystem_free_bytes{mountpoint="/"}[6h], 86400) < 0
        for: 30m
        labels: {severity: warning}
      - alert: NetworkInterfaceDown
        expr: node_network_up{device!~"lo"} == 0
        for: 5m
        labels: {severity: critical}
      - alert: SystemClockSkew
        expr: abs(node_timex_offset_seconds) > 0.1
        for: 5m
        labels: {severity: warning}
      - alert: HighLoadAverage
        expr: node_load15 / count by (instance) (node_cpu_seconds_total{mode="idle"}) > 0.8
        for: 15m
        labels: {severity: warning}

### Application Alerts
groups:
  - name: applications
    rules:
      - alert: HighErrorRate
        expr: (sum by (service) (rate(http_requests_total{status_code=~"5.."}[5m])) / sum by (service) (rate(http_requests_total[5m]))) > 0.05
        for: 5m
        labels: {severity: critical}
      - alert: HighLatency
        expr: histogram_quantile(0.99, sum by (service, le) (rate(http_request_duration_seconds_bucket[5m]))) > 1
        for: 10m
        labels: {severity: warning}
      - alert: LowRequestRate
        expr: sum by (service) (rate(http_requests_total[5m])) < 10
        for: 15m
        labels: {severity: warning}
      - alert: HighRequestRateSpike
        expr: (sum by (service) (rate(http_requests_total[5m])) / avg by (service) (rate(http_requests_total[5m] offset 1d))) > 3
        for: 5m
        labels: {severity: warning}
      - alert: SlowConsumers
        expr: kafka_consumer_lag > 10000
        for: 15m
        labels: {severity: warning}


## Reference: Advanced PromQL Patterns

### Pattern 1: Comparison with Baseline

Compare current metric with same time last week (seasonal baseline): rate(http_requests_total[5m]) / avg by (service) (rate(http_requests_total[5m] offset 1w)) > 1.5. This detects traffic spikes compared to the same time last week (accounts for daily patterns). Use offset to shift the time range. Combine with avg_over_time for smoothing. Alert on ratio > 1.5 (50% increase) or < 0.5 (50% decrease). For daily patterns, offset 1d. For weekly patterns, offset 1w. For hourly patterns, offset 1h.

### Pattern 2: Rate of Error Increase

Detect sudden error rate increase: delta(rate(http_errors_total[5m])[10m:1m]) > 0.1. This measures whether the error rate is accelerating. A positive delta means errors are increasing faster than before. Useful for identifying cascading failures before they become critical. Combine with absolute error rate: alert if error rate > threshold AND error rate is increasing.

### Pattern 3: Multi-Condition Alerting

Combine multiple conditions with AND (,) or OR (or). Example: alert if error rate > 5% AND latency > 1s: (sum(rate(http_errors[5m])) / sum(rate(http_requests[5m])) > 0.05) and (histogram_quantile(0.99, sum(rate(http_duration_bucket[5m]))) > 1). This fires only when both conditions are true (more specific, fewer false positives). Use OR to catch either condition independently.

### Pattern 4: Percentage Change Alerting

Alert on percentage change: (current_value - previous_value) / previous_value * 100 > threshold. Example: (rate(http_requests_total[5m]) - rate(http_requests_total[5m] offset 10m)) / rate(http_requests_total[5m] offset 10m) * 100 > 50. This alerts on a 50% increase in request rate over the last 10 minutes. Percentage change is more meaningful than absolute change for metrics with varying baselines.

### Pattern 5: Availability Calculation

Service availability over time window: 1 - (sum(increase(http_errors_total[30d])) / sum(increase(http_requests_total[30d]))). This computes the availability over a 30-day rolling window. Use for SLO compliance calculation. For latency availability: 1 - (sum(increase(http_duration_bucket{le="0.5"}[30d])) / sum(increase(http_duration_count[30d]))). For compound availability (both latency and error): count of requests that are NOT errors AND are under latency threshold.

### Pattern 6: Capacity Forecasting

Predict when resources will be exhausted: predict_linear(disk_free_bytes[7d], 86400 * 365). This predicts free disk space in 365 days based on 7 days of data. Compare to 0 (exhaustion). Combine with seasonal prediction: holtwinters(disk_free_bytes[14d], 0.1, 0.5, 0.3) forecasts with daily and weekly seasonality. More accurate for storage patterns with weekly usage cycles.

### Pattern 7: Anomaly Score

Compute anomaly score using z-score: (avg_over_time(metric[1h]) - avg_over_time(metric[7d])) / stddev_over_time(metric[7d]). The z-score measures how many standard deviations the current value is from the historical mean. Alert on abs(z-score) > 3 (3 sigma event). Higher z-score = more anomalous. Adjust sigma threshold based on tolerance for false positives. Use z-score for metrics with stable patterns (CPU, memory, latency).

### Pattern 8: Health Score

Aggregate multiple metrics into a single health score: (1 - error_ratio) * 0.4 + (1 - (latency_ratio - 1)) * 0.3 + (1 - saturation_ratio) * 0.3. This computes a score between 0 and 1 (1 = fully healthy). Useful for executive dashboards. Customize weights based on what matters for each service. Combine with alerting: alert if health score < 0.8. The health score provides a single number to trend over time.

### Pattern 9: Dependency Tracking

Track how many instances of a dependency are failing: count by (dependency) (up{dependency="database"} == 0). This shows how many database instances are down. Combine with total: count by (dependency) (up{dependency="database"}). Compute failure ratio: failed / total * 100. Alert on failure ratio > threshold. Use for external dependency health monitoring.

### Pattern 10: Canary Analysis

Compare error rate between canary and baseline: (sum(rate(http_errors{version="canary"}[5m])) / sum(rate(http_requests{version="canary"}[5m]))) / (sum(rate(http_errors{version="baseline"}[5m])) / sum(rate(http_requests{version="baseline"}[5m]))). This computes the error ratio of canary divided by baseline. If ratio > 1.2 (canary 20% worse), rollback canary. If ratio < 1.0 (canary better), promote canary. Automate rollback/promotion based on this metric.

## Reference: OTel Collector Troubleshooting

### Collector Not Receiving Data

Check: Is the collector running? Check pod status. Is the receiver configured on the correct port? OTLP gRPC default: 4317, OTLP HTTP default: 4318. Is the port accessible from application pods? Check network policy. Is TLS configured correctly? Check certificate. Are the application SDKs configured with the correct endpoint? Check OTEL_EXPORTER_OTLP_ENDPOINT. Use the logging exporter to see if data arrives: add logging exporter to the pipeline temporarily. Check collector logs for errors: kubectl logs collector-pod.

### Collector Crashing or OOM

Check memory usage: otelcol_process_memory_rss. Set memory_limiter processor with appropriate limits. Check for memory leak: is memory usage growing over time? Check goroutine count: otelcol_process_runtime_total_goroutines (should be stable). Reduce batch size: send_batch_size in batch processor. Increase export interval: timeout in batch processor. Check if a specific exporter is causing issues: disable exporters one by one. Add memory_ballast extension to reduce Go GC pressure.

### Data Not Reaching Backend

Check exporter configuration: endpoint URL, authentication, TLS. Check exporter error metrics: otelcol_exporter_send_failed_requests. Check exporter queue: otelcol_exporter_queue_size (should not grow unbounded). Check network connectivity: can the collector reach the backend? Try curling the backend endpoint from the collector pod. Check backend authentication: API keys, tokens, certificates. Check backend capacity: is the backend ingesting data? Check backend logs. Check backend schema: some backends require specific metric types or attribute schemas.

### High Memory Usage

Reduce batch processor memory: memory_limiter processor limit_mib. Increase export frequency: reduce timeout in batch processor. Reduce buffer sizes: sending_queue queue_size. Reduce cardinality: filter processor dropping high-cardinality metrics. Reduce metric/histogram count: ensure metrics are useful. Use sampling processor to reduce trace and log volume. Upgrade collector to latest version (memory improvements in newer versions). Add memory_ballast extension.

### Context Propagation Broken

Check if trace context is present in incoming requests: use OTEL_LOG_LEVEL=debug to see context extraction. Check if context is being injected into outgoing requests: verify HTTP headers (traceparent, tracestate). Check if the propagation format matches: all services should use W3C Trace Context. Check for middleware ordering: tracing middleware should be the outermost middleware. Check for async code: context propagation in goroutines/coroutines requires explicit context passing. Check message queues: queue headers must propagate context.

## Reference: Observability Tool Integration Patterns

### Grafana + Prometheus + Loki + Tempo

The Grafana stack provides unified observability: Prometheus for metrics, Loki for logs, Tempo for traces. Integration points: Tempo receives trace data via OTLP, Prometheus scrapes metrics, Loki receives logs via OTLP or Promtail. Grafana connects to all three as data sources. Exemplars link Prometheus metrics to Tempo traces. Trace ID links Loki logs to Tempo traces. The Grafana Explore UI allows switching between metrics, logs, and traces with shared time range and label filters.

### Datadog Integrated Stack

Datadog provides all-in-one observability: metrics, logs, APM (traces), and infrastructure monitoring. Integration points: Datadog Agent collects metrics and traces, OTel Collector can forward to Datadog via Datadog exporter. Datadog logs are collected via Agent or forwarded from OTel Collector. Integration: traces automatically link to logs (trace_id in logs). Metrics from traces (APM metrics) provide RED metrics automatically. Dashboards can combine infrastructure metrics, APM metrics, and log analytics.

### Grafana + InfluxDB + Elasticsearch

Legacy stack still in use: InfluxDB for metrics, Elasticsearch for logs, Grafana for dashboards. Integration points: InfluxDB serves as metric backend, Elasticsearch serves as log backend, Grafana queries both. No native trace integration (traces would need a separate backend like Jaeger). Exemplars not supported (InfluxDB does not support exemplars). Cross-correlation requires custom dashboards with shared time range and manual trace_id linking.

### Honeycomb + Custom Metrics Backend

Honeycomb for high-cardinality events (traces + events), Prometheus for traditional metrics. Integration points: OTel SDK sends traces/events to Honeycomb via OTel exporter, Prometheus metrics sent separately to Prometheus backend. Honeycomb provides explorable debugging, Prometheus provides cost-effective metrics for dashboards and alerts. Cross-correlation requires engineers to switch between Honeycomb (debugging) and Grafana (dashboards/alerts).

## Reference: Observability Maturity Assessment

### Assessment Rubric

Category: Instrumentation. Level 0: No instrumentation. Level 1: Basic infrastructure metrics (CPU, memory, disk). Level 2: Service metrics for critical services (RED metrics). Level 3: All services have RED metrics. Level 4: Custom business metrics and high-cardinality instrumentation. Level 5: Full OTel instrumentation with semantic conventions, auto and manual.

Category: Logging. Level 0: No centralized logging. Level 1: Centralized logging with unstructured logs. Level 2: Structured logging for critical services. Level 3: All services use structured JSON logging. Level 4: Logs are correlated with traces (trace_id in logs), sampling in place. Level 5: Dynamic sampling, log analysis automation, anomaly detection.

Category: Tracing. Level 0: No tracing. Level 1: Tracing enabled for critical services (head-based sampling). Level 2: Tracing for all services, context propagation across services. Level 3: Tail-based sampling preserving errors, traces correlated with logs. Level 4: Trace-based dashboards, service maps, proactive bottleneck detection. Level 5: Trace-driven SLOs, automated root cause analysis.

Category: Alerting. Level 0: No alerts. Level 1: Basic threshold alerts (CPU, disk, memory). Level 2: Service-level alerts (error rate, latency). Level 3: SLO-based burn rate alerts for critical services. Level 4: Multi-window multi-burn-rate alerts, alert testing in CI/CD. Level 5: Predictive alerts, ML-based anomaly detection, auto-remediation.

Category: Dashboards. Level 0: No dashboards. Level 1: Basic infrastructure dashboards (CPU, memory). Level 2: RED dashboards for critical services. Level 3: RED dashboards for all services, USE dashboards for infrastructure. Level 4: Service catalog generates dashboards automatically, drill-down links to traces and logs. Level 5: Dynamic dashboards adapted to user role, SLO dashboards, cost dashboards.

Category: Observability as Code. Level 0: Manual configuration. Level 1: Some dashboards version controlled. Level 2: All dashboards and alerts version controlled. Level 3: Observability configuration in CI/CD pipeline with validation. Level 4: Fully automated observability provisioning from service catalog. Level 5: Self-service observability platform with automated quality gates.

## Reference: Prometheus Configuration Best Practices

### Scrape Configuration Template

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: production-us-east-1
    environment: production

scrape_configs:
  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: "$1:$2"
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

### Recording Rule Best Practices

groups:
  - name: red-metrics
    rules:
      - record: instance:http_requests:rate5m
        expr: rate(http_requests_total[5m])
      - record: instance:http_errors:rate5m
        expr: rate(http_requests_total{status_code=~"5.."}[5m])
      - record: service:http_requests:rate5m
        expr: sum by (service) (instance:http_requests:rate5m)
      - record: service:http_errors:rate5m
        expr: sum by (service) (instance:http_errors:rate5m)
      - record: service:http_error_ratio:rate5m
        expr: (service:http_errors:rate5m / service:http_requests:rate5m) or vector(0)

### Alert Rule Best Practices

groups:
  - name: service-alerts
    rules:
      - alert: ServiceHighErrorRate
        expr: |
          (sum by (service) (rate(http_requests_total{status_code=~"5.."}[5m]))
           /
          sum by (service) (rate(http_requests_total[5m]))) > 0.05
        for: 5m
        labels:
          severity: critical
          team: "{{ $labels.service_team }}"
        annotations:
          summary: "High error rate for {{ $labels.service }}"
          description: "Error rate for {{ $labels.service }} is {{ $value | humanizePercentage }}"
          dashboard: "https://grafana.example.com/d/service-red/{{ $labels.service }}"
          runbook: "https://wiki.example.com/runbooks/high-error-rate"

## Reference: Semantic Conventions for Common Scenarios

### HTTP Service Instrumentation

ALWAYS capture: http.request.method, http.response.status_code, url.full or url.path, server.address, server.port. RECOMMENDED: http.request.body.size, http.response.body.size, user_agent.original, network.protocol.version. Set span name: "{http.request.method} {url.path}" (e.g., "GET /api/users/{id}"). Set span status: Error if status_code >= 500, Ok if status_code < 500. Include exemplars on latency histogram with trace_id and span_id for 1% of requests.

### Database Client Instrumentation

ALWAYS capture: db.system, db.namespace (database name), db.query.text (sanitized - DO NOT log parameter values), db.operation.name, server.address. RECOMMENDED: db.query.summary (truncated query), db.response.returned_rows, db.response.size. Set span name: "{db.operation.name} {db.namespace}" (e.g., "SELECT orders"). Set span status: Error if query returns an error or exceeds query timeout. NEVER capture: actual parameter values in db.query.text - use parameterized query representation (e.g., "SELECT * FROM users WHERE id = ?" not "SELECT * FROM users WHERE id = 123").

### Message Queue Producer Instrumentation

ALWAYS capture: messaging.system, messaging.destination.name (topic or queue name), messaging.destination.kind (topic or queue), messaging.operation.type (publish). RECOMMENDED: messaging.message.id, messaging.message.body.size, messaging.message.conversation_id. Set span name: "{messaging.destination.name} publish" (e.g., "orders publish"). Create producer span before sending message. Inject trace context into message headers.

### Message Queue Consumer Instrumentation

ALWAYS capture: messaging.system, messaging.destination.name, messaging.operation.type (receive or process), messaging.message.id. RECOMMENDED: messaging.message.body.size, messaging.batch.message_count. Set span name: "{messaging.destination.name} {messaging.operation.type}" (e.g., "orders process"). Create consumer span when message is received. Link consumer span to producer span via trace context from message headers. Create separate span for processing (the actual work) vs receiving (polling the queue).

### gRPC Service Instrumentation

ALWAYS capture: rpc.system (grpc), rpc.service, rpc.method, rpc.grpc.status_code. RECOMMENDED: rpc.request.metadata, rpc.response.metadata, rpc.request.size, rpc.response.size. Set span name: "grpc.{rpc.service}/{rpc.method}" (e.g., "grpc.PaymentService/ChargeCard"). Set span status: Error if status_code != 0 (OK). gRPC interceptors in OTel automatically capture standard attributes.

## Reference: Prometheus Operator Configuration

### PodMonitor Example

apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: my-service-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-service
  podMetricsEndpoints:
    - port: metrics
      interval: 15s
      path: /metrics
      relabelings:
        - action: replace
          sourceLabels: [__meta_kubernetes_pod_label_app]
          targetLabel: service
        - action: replace
          sourceLabels: [__meta_kubernetes_pod_label_version]
          targetLabel: version
        - action: replace
          sourceLabels: [__meta_kubernetes_namespace]
          targetLabel: kubernetes_namespace
        - action: replace
          sourceLabels: [__meta_kubernetes_pod_name]
          targetLabel: kubernetes_pod_name

### ServiceMonitor Example

apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-service-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-service
  endpoints:
    - port: http-metrics
      interval: 15s
      path: /metrics
  namespaceSelector:
    matchNames:
      - production
  targetLabels:
    - app
    - version

### PrometheusRule Example

apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: my-service-rules
  namespace: monitoring
spec:
  groups:
    - name: my-service
      rules:
        - alert: MyServiceDown
          expr: up{service="my-service"} == 0
          for: 5m
          labels:
            severity: critical
            team: my-team
          annotations:
            summary: "My-Service is down"
            description: "My-Service has been unreachable for 5 minutes"

## Reference: Telemetry Pipeline Sizing Guide

### Collector Sizing

Small scale (< 100 pods): 2 CPU, 2GB RAM, 1 collector instance. Medium scale (100-1000 pods): 4 CPU, 4GB RAM, 2-3 collector instances behind load balancer. Large scale (1000-10000 pods): 8 CPU, 8GB RAM, 5-10 collector instances behind load balancer. Extra large (10000+ pods): 16 CPU, 16GB RAM, 10+ collector instances, shard by namespace or service.

### Prometheus Sizing

Small scale (< 500K series): 4 CPU, 16GB RAM, 500GB SSD. Medium scale (500K-2M series): 8 CPU, 32GB RAM, 2TB SSD. Large scale (2M-10M series): 16 CPU, 64GB RAM, 5TB SSD, consider Thanos or Mimir for horizontal scaling. Extra large (10M+ series): Use Thanos, Cortex, or Mimir for horizontal scaling. Multiple Prometheus instances + Thanos sidecar.

### Loki Sizing

Small scale (< 100GB/day): 2 CPU, 4GB RAM, single binary. Medium scale (100GB-1TB/day): 4 CPU, 16GB RAM, simple scalable deployment (read/write separation). Large scale (1TB-10TB/day): 8 CPU, 32GB RAM, microservices mode (distributor, ingester, querier). Extra large (10TB+/day): 16-32 CPU, 64GB+ RAM, microservices mode with querier auto-scaling.

### Tempo Sizing

Small scale (< 100 spans/sec): 2 CPU, 4GB RAM, single binary with local backend. Medium scale (100-1000 spans/sec): 4 CPU, 16GB RAM, simple scalable with S3 backend. Large scale (1000-10000 spans/sec): 8 CPU, 32GB RAM, microservices mode, S3 backend. Extra large (10000+ spans/sec): 16+ CPU, 64GB+ RAM, microservices mode with multiple ingesters.

## Reference: Common Error Codes and Their Meanings

### HTTP Status Codes for Observability

200: OK - Successful request. 201: Created - Resource created successfully. 204: No Content - Successful request with no response body. 301: Moved Permanently - Resource has moved. 304: Not Modified - Cached resource is valid. 400: Bad Request - Client error (validation). Count as error for 4xx monitoring? Typically no (client error, not service error). 401: Unauthorized - Authentication required. 403: Forbidden - Authorization denied. 404: Not Found - Resource does not exist. 405: Method Not Allowed - Invalid HTTP method. 408: Request Timeout - Client did not send request in time. 409: Conflict - Resource state conflict. 429: Too Many Requests - Rate limit exceeded. 500: Internal Server Error - Generic server error. Count as error for availability SLO. 502: Bad Gateway - Upstream server returned invalid response. 503: Service Unavailable - Service temporarily unavailable. Count as error for availability SLO. 504: Gateway Timeout - Upstream server timed out.

### gRPC Status Codes for Observability

0: OK - Successful. 1: CANCELLED - Operation cancelled. 2: UNKNOWN - Unknown error. 3: INVALID_ARGUMENT - Invalid argument. 4: DEADLINE_EXCEEDED - Deadline exceeded (important for latency monitoring). 5: NOT_FOUND - Resource not found. 6: ALREADY_EXISTS - Resource already exists. 7: PERMISSION_DENIED - Authorization denied. 8: RESOURCE_EXHAUSTED - Resource exhausted (rate limiting). 9: FAILED_PRECONDITION - Precondition failed. 10: ABORTED - Operation aborted. 11: OUT_OF_RANGE - Out of range. 12: UNIMPLEMENTED - Method not implemented. 13: INTERNAL - Internal error (count as error for SLO). 14: UNAVAILABLE - Service unavailable (count as error for SLO). 15: DATA_LOSS - Data loss. 16: UNAUTHENTICATED - Authentication required.

### Database Error Codes for Observability

PostgreSQL Class 40 (Transaction Rollback): serialization_failure, deadlock_detected - alert on deadlocks. PostgreSQL Class 53 (Insufficient Resources): disk_full, out_of_memory - immediate alert. PostgreSQL Class 08 (Connection Exception): connection_failure, connection_does_not_exist - alert on rate. MySQL Error 1213: Deadlock found (retryable). MySQL Error 1205: Lock wait timeout exceeded - alert, indicates lock contention. MongoDB Assertion: alert on rate of assertions. Redis: "OOM command not allowed when used memory > maxmemory" - immediate alert.

## Deep Dive: Prometheus Query Optimization

### Understanding Query Performance

Prometheus queries are evaluated against a time-series database stored on disk. Query performance depends on: number of time series scanned, time range requested, label matchers precision, aggregation complexity, and step interval. A query scanning 1M series over 7 days will be 1000x slower than scanning 1000 series over 1 hour. Always use precise label matchers to narrow the query scope. Use recording rules to pre-compute expensive aggregations. Use appropriate step intervals in Grafana (auto step based on time range).

### Label Matcher Types

Exact match: metric{label="value"} - fastest, uses index. Regex match: metric{label=~"value1|value2"} - slower, scans matching label values. Negative match: metric{label!="value"} - slower, excludes matching values. Negative regex: metric{label!~"pattern"} - slowest, scans all non-matching values. Prefer exact matches over regex where possible. Use multiple exact matchers instead of one regex with OR.

### Query Anatomy and Performance

Query: sum by (service) (rate(http_requests_total{status_code=~"5.."}[5m])). Step 1: Find all series matching http_requests_total{status_code=~"5.."} - requires scanning the index for series matching the name and label matcher. Step 2: Read samples for each matching series over the last 5 minutes - I/O bound, depends on series count. Step 3: Apply rate() function to each series - CPU bound for many series. Step 4: Aggregate by service label - sums values for each unique service value. Optimization: pre-compute rate via recording rule, use service label in matcher to reduce series count.

### Time Range and Step Interaction

Grafana auto-selects step interval based on time range: 6h = 30s step, 1d = 2m step, 7d = 15m step, 30d = 1h step, 1y = 6h step. The number of data points returned is time_range / step. Too few steps = low resolution. Too many steps = slow query (fetching many data points). Override step when auto-selected step is too coarse or too fine. Use $__interval in dashboard queries to respect the auto-selected step.

### Avoiding Slow Queries

Anti-pattern: querying metric{label=~".+"} (match all services) over 30 days. This scans ALL series for ALL time. Fix: pre-aggregate to service level via recording rules: sum by (service) (metric). Query the recording rule instead. Anti-pattern: topk(100, rate(metric[1h])) scans all series to find top 100. If metric has 1M series, this is slow. Fix: pre-compute topk via recording rule with fewer series or use approximate algorithms.

### Range Selector Optimization

The range selector [5m] determines how far back to look for samples. Longer ranges = more samples to read. For rate(), [5m] is typically sufficient. Use [1m] for fast-changing metrics, [30m] for slow-changing metrics. Range less than 2x scrape interval will have insufficient data for rate(). For increase(), the range should be at least 4x scrape interval for accuracy. For histogram_quantile(), use the same range as the rate() to ensure consistency.

### Subquery Performance

Subqueries (metric[5m:1m]) are expensive because they materialize intermediate results. Avoid subqueries in frequently-run queries. Prefer recording rules for computed values. Use subqueries only in alerting rules where evaluation frequency is lower. Example subquery: max_over_time(rate(http_requests_total[5m])[1h:1m]) - computes the max rate over 1 hour. This creates 60 intermediate rate values.

### Recording Rule Evaluation Impact

Recording rules increase Prometheus load because they are evaluated every evaluation_interval (default 15s). A recording rule that processes 100K series takes CPU and memory on every evaluation. Balance: create recording rules for queries that are executed frequently (dashboard auto-refresh, multiple dashboards). Avoid recording rules for queries that are rarely executed. Use recording rules with specific labels to reduce the number of output series.

## Deep Dive: Distributed Tracing Implementation Guide

### Step-by-Step OTel Tracing Adoption

Phase 1: Foundation. Deploy OTel Collector in each cluster. Install OTel SDK in critical services. Configure head-based sampling at 1%. Verify traces appear in the backend. Phase 2: Context Propagation. Ensure all services propagate W3C Trace Context. Add middleware for HTTP, gRPC, and message queue libraries. Verify trace spans connect across service boundaries. Phase 3: Manual Instrumentation. Add manual spans for business-critical operations. Add attributes that help debugging. Set span status correctly. Phase 4: Sampling Optimization. Implement tail-based sampling. Preserve 100% of error traces. Adjust sampling rates based on traffic and budget. Phase 5: Trace-Driven Development. Use traces to debug performance issues. Create dashboards from trace data. Alert on trace-based metrics. Phase 6: Automation. Automate trace analysis. Implement trace-based SLOs. Use trace data for capacity planning.

### W3C Trace Context Header Format

traceparent header: version (2 hex chars) - trace_id (32 hex chars) - span_id (16 hex chars) - trace_flags (2 hex chars). Example: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01. Version: 00 (current version). trace_id: globally unique 128-bit identifier. span_id: 64-bit identifier of the current span. trace_flags: 01 = sampled, 00 = not sampled. tracestate header: vendor-specific data, comma-separated pairs: vendor1=value1,vendor2=value2. Used to carry vendor-specific tracing data alongside the standard traceparent.

### Manual Span Creation Patterns

Pattern 1: Wrapper function. Create a function that wraps an operation with a span: func track(ctx context.Context, name string, attrs []attribute.KeyValue, fn func(context.Context) error) error. Uses: standardizes span creation, ensures spans are always ended, and handles error status automatically.

Pattern 2: Decorator/Middleware. Wrap HTTP handlers, gRPC interceptors, or message queue consumers with automatic span creation. Uses: consistent tracing for all requests, automatic error detection, and minimal code changes.

Pattern 3: Background task tracing. Create a root span for background tasks (cron jobs, queue consumers): tracer.Start(ctx, "processBatch"). Propagate the trace context through the task. Set span status based on task outcome. Uses: tracing for async processing, visibility into batch operations.

### Span Attribute Best Practices

Do include: operation-specific identifiers (order_id, payment_id, shipment_id), performance data (input size, processing time per step), and outcome data (result count, success/failure flag). Do NOT include: sensitive data (passwords, tokens, PII), large payloads (full request/response bodies), and high-cardinality unbounded values (full SQL parameter values). Keep attribute values under 4096 characters. Use OTel semantic conventions for standard attributes. Document custom attributes in the service instrumentation guide.

### Trace Context Propagation Testing

Test with curl: curl -H "traceparent: 00-<trace_id>-<span_id>-01" http://service/endpoint. Check response headers for traceparent. Test with tracing middleware: deploy two services that communicate, verify trace spans show the full request flow. Test with message queues: produce message with trace context, consume in another service, verify the trace spans connect. Test with error scenarios: trigger an error, verify the error trace is captured. Test the sampling: confirm sampling rate matches configuration.

## Deep Dive: SLO Implementation Patterns

### Pattern 1: Availability SLO with Sliding Window

Goal: 99.9% of requests succeed (HTTP status < 500) over a 30-day sliding window. Implementation: recording rule for good events: sli:good:total = sum(increase(http_requests_total{status_code!~"5.."}[5m])). Total events: sli:total:total = sum(increase(http_requests_total[5m])). Compute availability over window: sli:availability:30d = sum_over_time(sli:good:total[30d]) / sum_over_time(sli:total:total[30d]). Alert when availability < SLO target.

### Pattern 2: Latency SLO with Sliding Window

Goal: 99% of requests complete in under 500ms over a 7-day sliding window. Implementation: good events: sli:latency:good:5m = sum(increase(http_request_duration_seconds_bucket{le="0.5"}[5m])). Total events: sli:latency:total:5m = sum(increase(http_request_duration_seconds_count[5m])). Compute latency compliance: sli:latency:compliance:7d = sum_over_time(sli:latency:good:5m[7d]) / sum_over_time(sli:latency:total:5m[7d]). Alert when compliance < 0.99.

### Pattern 3: Multi-SLI SLO

Goal: Combined availability and latency SLO. Good event = request succeeds AND completes under latency threshold. Implementation: you cannot directly compute AND from separate counters because the intersection requires per-request tracking. Workaround 1: use tracing data to compute the AND (each trace has both status and duration). Workaround 2: compute each SLI separately and take the minimum (pessimistic approach). Workaround 3: instrument a single metric that captures the condition: http_requests_good_total{service="my-service"} incremented only when both conditions are met.

### Pattern 4: Freshness SLO for Data Pipelines

Goal: Data in the reporting table is never more than 1 hour old. Implementation: metric: data_freshness_seconds = time() - last_successful_ingestion_timestamp. Compute a boolean good event: data_freshness_is_good = data_freshness_seconds < 3600. Compute SLO compliance: avg_over_time(data_freshness_is_good[30d]). Alert on data_freshness_seconds > 3600 for 15 minutes. This captures both absolute freshness and SLO compliance.

### Pattern 5: Throughput SLO for Stream Processing

Goal: Process at least 10,000 events per minute. Implementation: metric: events_processed_total (counter). Compute rate: events_per_minute = rate(events_processed_total[1m]) * 60. Good event: events_per_minute >= 10000. This is not a standard SLI format (good/total) because we care about the minimum throughput, not a ratio. Alert on events_per_minute < 10000 for 5 minutes.

### Pattern 6: Error Budget-Based Deployment Gating

Implementation: expose error budget remaining as a metric: slo:error_budget:remaining = (1 - (sum_over_time(sli:bad:total[30d]) / slo:error_budget:total)). In CI/CD pipeline: query the error budget metric for the service being deployed. If error_budget_remaining < 0 (budget exhausted), block deployment and require SRE approval. If error_budget_remaining < 0.2 (less than 20% remaining), require team lead approval. If error_budget_remaining > 0.5, allow automatic deployment.

## Deep Dive: Cost Optimization Implementation

### Strategy 1: Metrics Cardinality Reduction

Step 1: Audit all metrics and their label cardinalities. Use promtool tsdb analyze or Thanos Bucket tool. Step 2: Identify metrics with > 1000 unique label combinations. Step 3: For each high-cardinality metric, determine if each label is necessary: Does any dashboard or alert use this label? Would removing it lose debugging capability? Step 4: Remove unnecessary labels from instrumentation. Step 5: For labels that are necessary but high cardinality (like endpoint), consider if the cardinality can be reduced (normalize URL parameters). Step 6: Implement relabeling rules to drop high-cardinality labels at scrape time as a safety net. Step 7: Set up cardinality alerts to notify when any metric exceeds 1000 series.

### Strategy 2: Trace Sampling Implementation

Step 1: Set up head-based sampling at 1% for all services (OTEL_TRACES_SAMPLER=traceidratio, OTEL_TRACES_SAMPLER_ARG=0.01). Step 2: Identify critical services that need higher sampling. Step 3: Implement tail-based sampling in OTel Collector for critical services: keep 100% error traces, keep 100% traces with duration > p99, keep 10% of remaining traces. Step 4: Calculate cost savings: original 100% traces = X spans/sec * 30 days * cost/span. After 1% sampling + tail-based: 1% of healthy + 100% of errors = approximately 2% of original volume. Cost reduction: approximately 98%. Step 5: Monitor sampling effectiveness: compare error counts from metrics (which are 100%) vs error counts from traces (which are sampled). If sampled error count is significantly lower than metric error count, sampling is dropping errors — adjust.

### Strategy 3: Log Volume Control

Step 1: Set log level to WARN or ERROR for production services. Only enable INFO for debugging specific issues. Step 2: Implement rate limiting: max 100 log entries per second per log level per service. Step 3: Implement sampling: log 100% of errors, 10% of info messages, 0% of debug messages. Step 4: Remove verbose log messages that provide no debugging value: "request started", "loop iteration". Step 5: Use log aggregation: count repeated log messages and emit a summary metric instead of logging each occurrence. Step 6: Set per-service log volume budgets. Alert when a service exceeds its budget.

### Strategy 4: Retention Tiering Implementation

Step 1: Define retention tiers: hot = 7 days (SSD, fast queries), warm = 30 days (HDD, slower queries), cold = 365 days (object storage, rare queries), archive = 7 years (glacier, compliance only). Step 2: Configure Prometheus retention: raw data 15 days, downsampled for 30 days using retention.size. Step 3: Configure Loki retention: hot 7 days (boltdb-shipper with in-memory cache), warm 30 days (object storage), cold 365 days (object storage with retention policy). Step 4: Configure Tempo retention: raw traces 7 days, derived metrics from traces 365 days. Step 5: Automate data archival: move data older than 30 days to cold storage using lifecycle policies.

## Deep Dive: Observability as Code Implementation

### Step-by-Step Implementation

Step 1: Create a Git repository for observability configuration. Structure: dashboards/, alerts/, rules/, slo/, collectors/, runbooks/. Step 2: Export existing Grafana dashboards as JSON and add to dashboards/. Step 3: Create Prometheus rule files (YAML) in rules/. Step 4: Use Jsonnet or Grizzly for parameterized dashboard generation: generate one dashboard per service from a template. Step 5: Use Terraform or Pulumi for Grafana Cloud resources: data sources, dashboards, alert rules, notification policies, folders. Step 6: Set up CI/CD pipeline: on PR creation, validate syntax (promtool, Grafana API), on PR merge, apply configuration. Step 7: Add testing: promtool test rules, Grafana dashboard snapshot comparison. Step 8: Add quality gates: validate all alerts have runbooks, validate all dashboards have descriptions, validate no unused metrics are referenced. Step 9: Document the workflow: how to add a dashboard, how to modify an alert, how to add a new service.

### Terraform Configuration Example

resource "grafana_folder" "service_dashboards" {
  title = "Services"
}

resource "grafana_data_source" "prometheus" {
  type = "prometheus"
  name = "Prometheus"
  url  = "http://prometheus:9090"
}

resource "grafana_dashboard" "service_red" {
  folder      = grafana_folder.service_dashboards.id
  config_json = file("dashboards/service-red.json")
}

resource "grafana_rule_group" "service_alerts" {
  name     = "service-alerts"
  org_id   = 1
  folder_name = "Services"
  rule {
    name           = "HighErrorRate"
    condition      = "C"
    for            = "5m"
    annotations = {
      summary = "High error rate for {{ $labels.service }}"
    }
    labels = {
      severity = "critical"
    }
    data {
      ref_id = "A"
      relative_time_range {
        from = 300
        to   = 0
      }
      datasource_uid = grafana_data_source.prometheus.uid
      model = jsonencode({
        expr = "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service) > 0.05"
      })
    }
  }
}

### Jsonnet Dashboard Generation

local grafana = import 'grafonnet/grafana.libsonnet';
local prometheus = grafana.prometheus;

local service = std.extVar('service');

grafana.dashboard.new(
  title='Service: ' + service + ' (RED)',
  tags=['service', 'red', service],
  time_from='now-6h',
  refresh='30s',
)
.addPanel(
  grafana.statPanel.new('SLO Compliance')
  .addTarget(prometheus.target('slo:compliance{service="' + service + '"}'))
  .withColorMode('background')
  .withUnit('percentunit')
  .withThresholds([{ value: 0.99, color: 'green' }, { value: 0.95, color: 'yellow' }, { value: 0, color: 'red' }])
)
.addPanel(
  grafana.timeSeriesPanel.new('Request Rate')
  .addTarget(prometheus.target('sum(rate(http_requests_total{service="' + service + '"}[5m])) by (endpoint)'))
  .withUnit('reqps')
)
.addPanel(
  grafana.timeSeriesPanel.new('Error Rate')
  .addTarget(prometheus.target('sum(rate(http_requests_total{service="' + service + '",status_code=~"5.."}[5m])) by (endpoint)'))
  .withUnit('reqps')
)
.addPanel(
  grafana.timeSeriesPanel.new('Latency p99')
  .addTarget(prometheus.target('histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="' + service + '"}[5m])) by (le))'))
  .withUnit('s')
);

## Deep Dive: Grafana Dashboard Testing

### Automated Dashboard Validation

Use Grafana API to validate dashboards: POST /api/dashboards/dry-run to validate JSON. Check response for errors. Validate panel queries: connect to actual data sources and test queries. Use Grafana screenshots for visual regression testing. Compare screenshots before and after changes. Use synthetic Grafana data sources for unit testing: replace real data sources with mock data sources that return known data. This allows testing dashboard rendering with controlled inputs.

### Dashboard Usage Analytics

Install Grafana Usage Insights plugin. Track: dashboard views (unique users per week), panel queries (which queries are most expensive), and dashboard load time. Use this data to: identify unused dashboards (archive after 90 days), identify expensive panels (optimize queries or remove), and identify most-used dashboards (invest in improvement). Publish usage statistics to teams so they can see which dashboards are providing value.

## Deep Dive: Alert Quality Improvement Process

### Step 1: Document All Alerts

Create a catalog of all alerts: name, expression, threshold, for duration, severity, service, team, runbook URL, create date, last firing date, last actionable date. Use the Alertmanager API to get recent alert history. This catalog is the foundation for alert quality improvement.

### Step 2: Classify Alerts

Classify each alert: Good: fired in the last 90 days and was actionable (led to investigation or incident). Noise: fires frequently but is never actionable. Dead: never fired or not fired in 90 days. Duplicate: another alert covers the same condition. Bad: fires when there is no real problem (false positive). Silent: should fire but does not (missing detection).

### Step 3: Remediation

Good alerts: keep, document, maintain runbook. Noise alerts: tune threshold, increase for duration, or delete. Dead alerts: delete (if not needed) or investigate (if needed but never triggers). Duplicate alerts: merge into one rule. Bad alerts: fix threshold or expression or delete. Silent alerts: fix expression or threshold.

### Step 4: Prevention

Prevent future alert quality issues: alert review in code review (every new alert must be reviewed by a second engineer), alert testing in staging (trigger the condition and verify the alert fires), and periodic audit (quarterly review of all alerts).

