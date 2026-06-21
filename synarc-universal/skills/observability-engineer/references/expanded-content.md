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


---
# Additional expanded content from P1-P15 expansions
---


---

## EXPANDED OBSERVABILITY CONTENT

This section contains expanded observability content (persona deep dives, detailed patterns, code examples, references).

Reference file: \
eferences/expanded-content.md\ (157 KB, 1854 lines)

