
### 7.12 Grafana Dashboard Design Patterns

### 7.12.1 Single Stat Panels

```json
{
  "title": "SLO Attainment",
  "type": "stat",
  "fieldConfig": {
    "defaults": {
      "color": {
        "mode": "thresholds"
      },
      "thresholds": {
        "steps": [
          { "color": "red", "value": null },
          { "color": "yellow", "value": 0.9 },
          { "color": "green", "value": 0.95 }
        ]
      },
      "unit": "percentunit"
    }
  },
  "targets": [
    {
      "expr": "sum(rate(http_requests_total{status_code!~\"5..\"}[30d])) / sum(rate(http_requests_total[30d]))"
    }
  ]
}
```

### 7.12.2 Time Series Panels with Thresholds

```json
{
  "title": "Error Rate",
  "type": "timeseries",
  "fieldConfig": {
    "defaults": {
      "thresholds": {
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 0.01 },
          { "color": "red", "value": 0.05 }
        ]
      },
      "unit": "percentunit",
      "custom": {
        "spanNulls": false,
        "lineInterpolation": "smooth",
        "showPoints": "never"
      }
    }
  },
  "targets": [
    {
      "expr": "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
      "legendFormat": "error ratio"
    }
  ]
}
```

### 7.12.3 Gauge Panel

```json
{
  "title": "CPU Utilization",
  "type": "gauge",
  "fieldConfig": {
    "defaults": {
      "min": 0,
      "max": 100,
      "thresholds": {
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 70 },
          { "color": "red", "value": 90 }
        ]
      },
      "unit": "percent"
    }
  },
  "targets": [
    {
      "expr": "avg by (service) (rate(container_cpu_usage_seconds_total[5m])) * 100"
    }
  ]
}
```

### 7.12.4 Heatmap Panel

```json
{
  "title": "Latency Heatmap",
  "type": "heatmap",
  "fieldConfig": {
    "defaults": {
      "unit": "s"
    }
  },
  "targets": [
    {
      "expr": "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)",
      "format": "heatmap"
    }
  ]
}
```

### 7.12.5 Stat with Sparkline

```json
{
  "title": "Active Users",
  "type": "stat",
  "fieldConfig": {
    "defaults": {
      "sparkline": {
        "show": true
      }
    }
  },
  "targets": [
    {
      "expr": "sum(rate(active_users_total[5m]))"
    }
  ]
}
```

### 7.13 Grafana Alerting Configuration

### 7.13.1 Grafana-Managed Alert Rules

```yaml
apiVersion: 1

alertRules:
  - name: High Error Rate
    condition: avg() OF query(A, 5m, now) > 0.01
    for: 5m
    keepFiringFor: 10m
    labels:
      severity: critical
      team: platform
    annotations:
      summary: "High error rate for {{ $labels.service }}"
      runbook: "https://runbook.example.com/high-error-rate"
    datasourceUid: prometheus
    expression: |
      sum(rate(http_requests_total{status_code=~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))
```

### 7.13.2 Grafana Contact Points

```yaml
contactPoints:
  - name: pagerduty
    type: pagerduty
    settings:
      integrationKey: ${PD_KEY}
      severity: critical
      class: incident
      component: "{{ $labels.service }}"
      group: "{{ $labels.cluster }}"
      summary: "{{ $labels.alertname }}"
      source: grafana
      details:
        dashboard: https://grafana.example.com/d/{{ $labels.service }}
        runbook: https://runbook.example.com/{{ $labels.alertname | toLower }}
```

### 7.13.3 Grafana Notification Policies

```yaml
notificationPolicies:
  - matchers:
      - alertname = ".*"
      - severity = "critical"
    receiver: pagerduty
    groupBy: [alertname, service, cluster]
    groupWait: 30s
    groupInterval: 5m
    repeatInterval: 4h

  - matchers:
      - severity = "warning"
    receiver: slack-warning
    groupBy: [service]
    groupWait: 1m
    groupInterval: 15m
    repeatInterval: 2h

  - matchers:
      - severity = "info"
    receiver: slack-info
    groupBy: []
    groupWait: 5m
    repeatInterval: 24h
```

### 7.14 Grafana Dashboard as Code with Python

```python
# generate_dashboard.py
import json
import os

def generate_service_dashboard(service_name):
    dashboard = {
        "__inputs": [],
        "__requires": [],
        "title": f"Service Overview - {service_name}",
        "uid": f"service-{service_name.lower().replace(' ', '-')}",
        "version": 1,
        "timezone": "utc",
        "schemaVersion": 36,
        "panels": [
            generate_stat_panel(
                "Request Rate",
                f'sum(rate(http_requests_total{{service="{service_name}"}}[5m]))',
                "req/s"
            ),
            generate_stat_panel(
                "Error Rate",
                f'sum(rate(http_requests_total{{service="{service_name}",status_code=~"5.."}}[5m])) / sum(rate(http_requests_total{{service="{service_name}"}}[5m]))',
                "percentunit"
            ),
            generate_timeseries_panel(
                "Latency p99",
                f'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{{service="{service_name}"}}[5m])))',
                "s"
            ),
        ],
        "templating": {
            "list": [
                {
                    "name": "service",
                    "type": "constant",
                    "query": service_name,
                    "current": {"value": service_name}
                }
            ]
        }
    }
    return dashboard

def generate_stat_panel(title, expr, unit):
    return {
        "title": title,
        "type": "stat",
        "gridPos": {"h": 8, "w": 8, "x": 0, "y": 0},
        "targets": [{"expr": expr, "legendFormat": ""}],
        "fieldConfig": {
            "defaults": {
                "unit": unit,
                "color": {"mode": "thresholds"},
                "thresholds": {
                    "steps": [
                        {"color": "green", "value": None},
                        {"color": "red", "value": 0.9}
                    ]
                }
            }
        }
    }

def generate_timeseries_panel(title, expr, unit):
    return {
        "title": title,
        "type": "timeseries",
        "gridPos": {"h": 8, "w": 16, "x": 8, "y": 0},
        "targets": [{"expr": expr, "legendFormat": ""}],
        "fieldConfig": {
            "defaults": {
                "unit": unit,
                "custom": {"lineInterpolation": "smooth"}
            }
        }
    }

# Generate dashboards for all services
services = ["order-service", "payment-service", "auth-service", "inventory-service"]
for svc in services:
    dashboard = generate_service_dashboard(svc)
    filename = f"dashboards/service-{svc.lower()}.json"
    os.makedirs("dashboards", exist_ok=True)
    with open(filename, "w") as f:
        json.dump(dashboard, f, indent=2)
    print(f"Generated {filename}")
```

### 8.13 On-Call Runbook Templates

### 8.13.1 Runbook for High Error Rate

```markdown
# Runbook: High Error Rate

**Alert**: HighErrorRate:{service}
**Severity**: P0/P1

## Step 1: Acknowledge
- Acknowledge alert in PagerDuty
- Join the incident channel: #inc-{service}-{timestamp}
- Update the incident tracker

## Step 2: Assess Impact
- Check SLO dashboard: http://grafana/d/{service}-slo
- Check error budget remaining
- Check if this is a known issue (recent deploy? known dependency outage?)
- Determine affected endpoints and user segments

## Step 3: Quick Triage
- Check recent deployments (last 1 hour): kubectl rollout history deployment/{service}
- If recent deploy < 30 min ago, rollback: kubectl rollout undo deployment/{service}
- Check downstream dependency health
- Check resource utilization (CPU, memory, connections)

## Step 4: Deep Investigation
- Open error traces in Tempo: http://grafana/explore?query={status=error,service.name="{service}"}
- Search error logs in Loki: {service="{service}", level="error"} | json
- Check specific error patterns: stack traces, timeout errors, connection refused
- Check if errors are limited to specific endpoint, version, or region

## Step 5: Resolution Options
- **Recent deploy**: Rollback to previous version
- **Dependency failure**: Contact dependency team, activate circuit breaker
- **Resource exhaustion**: Scale up, increase limits
- **Config change**: Revert config, check feature flags
- **Data issue**: Check for corrupt data, rollback migration

## Step 6: Verify Resolution
- Error rate returns to baseline
- Confirm for 10 minutes of normal behavior
- Run synthetic tests
- Close incident

## Step 7: Post-Incident
- Fill out incident timeline
- Schedule postmortem within 48 hours
- Track action items
```

### 8.13.2 Runbook for High Latency

```markdown
# Runbook: High Latency

**Alert**: HighLatency:{service}
**Severity**: P1/P2

## Step 1: Initial Assessment
- Is this slow successes or fast failures?
- Check latency breakdown by endpoint
- Check if latency is correlated with traffic increase
- Check if latency is uniform or spiky

## Step 2: Database Check
- Check database query latency
- Check for slow queries (pg_stat_statements)
- Check connection pool usage
- Check for locks or blocking queries
- Check replication lag

## Step 3: External Dependency Check
- Check downstream service latency
- Check network latency
- Check DNS resolution times
- Check TLS handshake latency

## Step 4: Resource Check
- CPU utilization (high CPU = processing bottleneck)
- Memory pressure (GC pauses)
- Disk I/O (swap thrashing)
- Network saturation

## Step 5: Code/Config Check
- Recent deploy?
- Feature flag changes?
- Config changes?
- Gradual vs. sudden increase?

## Step 6: Resolution
- Scale out (increase replicas)
- Scale up (increase instance size)
- Optimize database queries
- Increase connection pool size
- Enable caching
- Rollback if recent deploy
```

### 8.13.3 Runbook for SLO Burn Rate Alert

```markdown
# Runbook: SLO Burn Rate Alert

**Alert**: {Severity}BurnRate:{service}
**Severity**: P0 (fast burn) / P2 (slow burn)

## What This Means
The error rate is consuming the monthly error budget faster than expected.

## Fast Burn (> 10x)
- Budget will exhaust in hours
- Immediate action required
- Rollback if recent deploy

## Slow Burn (2-10x)
- Budget will exhaust in days
- Investigate but may not require immediate rollback
- Create tracking ticket

## Steps
1. Check error budget remaining: http://grafana/d/{service}-slo
2. Determine burn rate and time to exhaustion
3. Identify error pattern (all requests vs specific endpoint)
4. Apply error budget policy:
   - < 10% remaining: freeze deployments
   - < 5% remaining: declare incident
   - 0% remaining: executive notification required
```

### 8.14 On-Call Schedule and Rotation Management

### 8.14.1 PagerDuty Integration with Alertmanager

```yaml
receivers:
  - name: pagerduty-primary
    pagerduty_configs:
      - routing_key: ${PD_PRIMARY_KEY}
        severity: critical
        description: "[{{ .GroupLabels.severity | toUpper }}] {{ .GroupLabels.alertname }}"
        client: "Prometheus Alertmanager"
        client_url: "https://alertmanager.example.com"
        links:
          - href: "https://grafana.example.com/d/{{ .GroupLabels.service }}"
            text: "Service Dashboard"
        images:
          - src: "https://grafana.example.com/render/d/{{ .GroupLabels.service }}?from={{ .StartsAt }}&to={{ .EndsAt }}&width=500&height=200"
```

### 8.14.2 Escalation Policy in PagerDuty

```yaml
escalation_policy:
  name: "Platform On-Call"
  description: "Primary on-call for platform alerts"
  escalation_rules:
    - targets:
        - user: primary-oncall
          type: user_reference
      escalation_delay_in_minutes: 5
    - targets:
        - user: secondary-oncall
          type: user_reference
      escalation_delay_in_minutes: 10
    - targets:
        - schedule: engineering-managers
          type: schedule_reference
      escalation_delay_in_minutes: 15
```

### 8.14.3 Incident Command Structure

| Role | Responsibility | Notified By |
|------|---------------|-------------|
| Incident Commander | Overall coordination, communication | PagerDuty |
| Operations Lead | Technical investigation | Incident Commander |
| Communications Lead | Internal/external status updates | Incident Commander |
| Scribe | Timeline recording | Incident Commander |
| Subject Matter Experts | Domain-specific expertise | Operations Lead |

### 9.9 War Room Dashboard Template

### 9.9.1 War Room Configuration

```json
{
  "title": "WAR ROOM - {{incident_id}}",
  "tags": ["war-room", "incident"],
  "time": { "from": "now-6h", "to": "now" },
  "refresh": "10s",
  "templating": {
    "list": [
      {
        "name": "incident_id",
        "type": "textbox",
        "query": "",
        "current": { "value": "INC-0000" }
      },
      {
        "name": "affected_services",
        "type": "query",
        "query": "label_values(service_name)",
        "multi": true,
        "includeAll": true
      },
      {
        "name": "severity_filter",
        "type": "query",
        "query": "label_values(severity)",
        "multi": true,
        "includeAll": true
      }
    ]
  },
  "panels": [
    {
      "title": "Error Rate",
      "type": "timeseries",
      "targets": [{
        "expr": "sum by (service) (rate(http_requests_total{service=~\"$affected_services\",status_code=~\"5..\"}[30s])) / sum by (service) (rate(http_requests_total{service=~\"$affected_services\"}[30s]))"
      }]
    },
    {
      "title": "Latency p99",
      "type": "timeseries",
      "targets": [{
        "expr": "histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket{service=~\"$affected_services\"}[30s])))"
      }]
    },
    {
      "title": "Active Alerts",
      "type": "table",
      "targets": [{
        "expr": "ALERTS{alertstate=\"firing\", service=~\"$affected_services\"}",
        "instant": true
      }],
      "columns": ["alertname", "severity", "service", "summary"]
    },
    {
      "title": "Recent Error Logs",
      "type": "logs",
      "targets": [{
        "expr": "{service=~\"$affected_services\", severity=\"error\"} | json",
        "datasource": "Loki"
      }]
    },
    {
      "title": "Error Traces",
      "type": "table",
      "targets": [{
        "expr": "{ status = error && .service.name =~ \"$affected_services\" } | limit 50",
        "datasource": "Tempo"
      }]
    },
    {
      "title": "Service Dependencies",
      "type": "nodeGraph",
      "targets": [{
        "expr": "traces_service_graph_request_total{server=~\"$affected_services\"}",
        "datasource": "Prometheus"
      }]
    }
  ]
}
```

### 10.11 Advanced SLO Concepts

### 10.11.1 Composite SLOs

Composite SLOs combine multiple SLIs into a single SLO. The composite passes only when ALL component SLIs pass.

```yaml
slos:
  - name: "checkout-composite"
    objective: 99.9
    description: "Checkout journey composite SLO"
    composite:
      conditions:
        - sli: order-service-availability
          weight: 0.4
        - sli: payment-service-availability
          weight: 0.3
        - sli: inventory-service-latency
          target: 0.5s
          weight: 0.3
```

### 10.11.2 Multi-SLI SLOs

```yaml
slos:
  - name: "request-quality"
    objective: 99.9
    description: "Request quality SLO (availability + latency + correctness)"
    multi_sli:
      - metric: http_requests_total
        good: status_code < 500
      - metric: http_request_duration_seconds
        good: duration < 2
      - metric: application_errors_total
        good: error == false
    # Composite: all must be good for the request to count as good
    evaluation: all_must_pass
```

### 10.11.3 SLO Burn Rate Budget Allocation

```yaml
# Allocate error budget across teams/services
budget_allocation:
  monthly_budget: 0.1  # 0.1% errors allowed (for 99.9% SLO)
  allocation:
    payment-service: 30%  # Critical path
    checkout-service: 25%
    auth-service: 20%
    product-catalog: 15%
    search-service: 10%
```

### 10.11.4 SLO Target Setting Framework

```yaml
target_framework:
  external_sla: 99.99    # Legal commitment
  internal_target: 99.9  # Engineering target (easier than SLA)
  warning_threshold: 99.5  # Early warning
  debug_threshold: 99.0    # Investigation needed

  # Gap between SLA and SLO = safety buffer
  safety_buffer: 0.09  # 99.99 - 99.9 = 0.09%
```

### 10.12 SLO Monitoring and Reporting

### 10.12.1 Monthly SLO Report

```python
# slo_report.py
import requests
import json
from datetime import datetime, timedelta

PROMETHEUS_URL = "http://prometheus:9090"

def get_slo_attainment(service, window_days=30):
    query = f"""
    1 - (
      sum(rate(http_requests_total{{service="{service}", status_code=~"5.."}}[{window_days}d]))
      /
      sum(rate(http_requests_total{{service="{service}"}}[{window_days}d]))
    )
    """
    resp = requests.get(f"{PROMETHEUS_URL}/api/v1/query",
                        params={"query": query})
    result = resp.json()["data"]["result"]
    if result:
        return float(result[0]["value"][1])
    return None

def generate_monthly_report():
    services = ["order-service", "payment-service", "auth-service",
                "inventory-service", "notification-service"]

    report = {
        "report_date": datetime.now().isoformat(),
        "report_period": "last_30_days",
        "services": []
    }

    for service in services:
        attainment = get_slo_attainment(service)
        if attainment:
            status = "healthy" if attainment >= 0.999 else \
                     "warning" if attainment >= 0.99 else "breached"
            report["services"].append({
                "service": service,
                "slo_target": 0.999,
                "current_attainment": attainment,
                "status": status,
                "difference": attainment - 0.999
            })

    with open("monthly-slo-report.json", "w") as f:
        json.dump(report, f, indent=2)

    return report

if __name__ == "__main__":
    report = generate_monthly_report()
    print(json.dumps(report, indent=2))
```

### 14.9 Anti-Pattern Detection Automation

### 14.9.1 Automated Anti-Pattern Scans

```python
# anti-pattern-detector.py
import requests
import json

PROMETHEUS = "http://prometheus:9090"

def check_high_cardinality_labels():
    """Detect metrics with potentially high-cardinality labels"""
    query = 'topk(20, count by (__name__) ({__name__=~".+"}))'
    resp = requests.get(f"{PROMETHEUS}/api/v1/query", params={"query": query})
    results = resp.json()["data"]["result"]

    suspicious = []
    high_cardinality_labels = ["user_id", "request_id", "trace_id",
                                "session_id", "ip_address", "email"]

    for result in results:
        metric_name = result["metric"]["__name__"]

        # Check label names
        for label in result["metric"]:
            if label.lower() in high_cardinality_labels:
                suspicious.append({
                    "metric": metric_name,
                    "label": label,
                    "issue": "high_cardinality_label"
                })

    return suspicious

def check_raw_counter_alerts():
    """Detect alert rules using raw counter values (without rate())"""
    resp = requests.get(f"{PROMETHEUS}/api/v1/rules")
    rules = resp.json()["data"]["groups"]

    issues = []
    for group in rules:
        for rule in group["rules"]:
            if rule["type"] == "alerting":
                expr = rule["query"]
                # Check if metric name ends with _total but isn't wrapped in rate()
                if "_total" in expr and "rate(" not in expr:
                    issues.append({
                        "rule": rule["name"],
                        "expr": expr,
                        "issue": "raw_counter_alert"
                    })
    return issues

def check_duplicate_metrics():
    """Find metrics that have the same name and labels"""
    query = 'count by (__name__) ({__name__=~".+"})'
    resp = requests.get(f"{PROMETHEUS}/api/v1/query", params={"query": query})
    return []

def generate_report():
    report = {
        "high_cardinality_labels": check_high_cardinality_labels(),
        "raw_counter_alerts": check_raw_counter_alerts(),
        "duplicate_metrics": check_duplicate_metrics(),
        "recommendations": []
    }

    if report["high_cardinality_labels"]:
        report["recommendations"].append(
            "Remove high-cardinality labels from metrics. "
            "Use exemplars or logs instead."
        )

    if report["raw_counter_alerts"]:
        report["recommendations"].append(
            "Wrap counter metrics in rate() in alert expressions. "
            "Raw counters spike on restart."
        )

    with open("anti-pattern-report.json", "w") as f:
        json.dump(report, f, indent=2)

    return report

if __name__ == "__main__":
    report = generate_report()
    print(json.dumps(report, indent=2))
```

### 14.9.2 CI/CD Anti-Pattern Validation

```yaml
# .github/workflows/observability-lint.yaml
name: Observability Lint
on:
  pull_request:
    paths:
      - '**/instrumentation/**'
      - '**/*.go'
      - '**/*.py'
      - '**/*.java'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check high-cardinality labels in code
        run: |
          grep -rn 'attribute.String("user_id' . || true
          grep -rn 'attribute.String("request_id' . || true
          grep -rn 'attribute.String("trace_id' . || true
        continue-on-error: true

      - name: Check metric naming conventions
        run: |
          # Counters should end with _total
          grep -rn 'Int64Counter\|Float64Counter' . | grep -v '_total' || true
        continue-on-error: true

      - name: Check log levels in hot paths
        run: |
          # Logging inside request handlers
          grep -rn 'log\.Info\|slog\.Info' ./handlers/ || true
        continue-on-error: true

      - name: Post results
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            // Parse and format results
```

### 2.12 Distributed Systems Observability Matrix

| Characteristic | Challenge | Mitigation | Tools |
|---------------|-----------|------------|-------|
| Partial failures | Some services succeed, some fail | Distributed tracing with error propagation | Tempo, Jaeger |
| Cascading failures | Failure propagates downstream | Service graphs, circuit breaker metrics | Service graph, RED metrics |
| Network latency | Variable latency between services | Client/server span metrics, network metrics | Tempo, node_exporter |
| Clock skew | Timestamps don't match | NTP monitoring, relative timing in traces | NTP exporter |
| Async processing | No direct request/response | Trace context propagation via message headers | OTel SDK, Kafka interceptor |
| Ephemeral instances | Short-lived containers | Label-based aggregation, not instance-based | Prometheus, Thanos |
| Multi-tenancy | Different behavior per tenant | Tenant dimension on all telemetry | Cortex multi-tenant |
| Version drift | Multiple versions running | Version label on all telemetry | OTel resource attributes |
| Auto-scaling | Number of instances changes | Aggregate metrics, don't alert per-instance | Recording rules |
| Blue/green deploy | Old and new versions coexist | Version label, canary analysis | Grafana, feature flags |
| Chaos experiments | Deliberate failures injected | Tag experiment telemetry, alert suppression | Chaos mesh, OTel |

### 2.13 Observability Requirements by System Type

**Monolith**:
- RED metrics for API endpoints
- Structured logging with request IDs
- Basic distributed tracing for external calls
- USE metrics for host resources
- Simple dashboards

**Microservices**:
- RED metrics per service
- Distributed tracing with context propagation
- Service graph for dependency mapping
- Structured logging with trace context
- SLOs for critical user journeys
- Burn rate alerting
- Multi-tenant cost allocation

**Event-Driven**:
- Producer/consumer metrics per topic/queue
- End-to-end trace propagation through async boundaries
- Consumer lag monitoring
- Message age/delay tracking
- DLQ monitoring

**Serverless**:
- Cold start metrics
- Duration and memory utilization
- Throttle count
- Invocation error rate
- Iterator age (for stream-based)
- Cost per invocation

**Batch Processing**:
- Job duration and success rate
- Data freshness SLIs
- Record count (input vs output)
- Error records and retry rate
- Pipeline stage metrics
- Data quality metrics

**Database**:
- Query latency (p50, p95, p99)
- Connection pool utilization
- Cache hit ratio
- Replication lag
- Lock contention
- Storage growth
- Query throughput

**Storage (Object/File)**:
- Throughput (read/write)
- Latency (first byte, total)
- Error rate
- Capacity utilization
- Request rate by operation type

**CDN/Edge**:
- Cache hit ratio
- Origin shield health
- Edge response time
- Purging latency
- SSL certificate expiry
- Bandwidth utilization

**API Gateway**:
- Request rate by route
- Latency by upstream
- Error rate by upstream
- Rate limiting events
- Authentication failures
- TLS handshake latency

