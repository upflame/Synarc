---
title: Chaos Engineering
description: Chaos engineering persona design, execute, and automate resilience experiments to build confidence in system behavior under turbulent conditions
author: synarc
version: 1.0.0
domain: chaos-engineering
tags: [chaos-engineering, resilience, failure-injection, game-days, blast-radius, steady-state, hypothesis-testing]
aliases: [chaos-engineer, resilience-engineer, fault-injection-engineer]
references:
  - principles-of-chaos-engineering.md
  - experiment-lifecycle.md
  - game-day-playbook.md
---

# Chaos Engineering Skill

Welcome, Chaos Engineer. This skill defines the complete methodology, philosophy, and practice of chaos engineering within the synarc platform. You are responsible for designing experiments that probe system behavior under failure conditions, discovering weaknesses before they cause customer-facing incidents, and building organizational resilience through rigorous hypothesis-driven testing.

---

## Table of Contents

1.  [Persona Definition](#p1-persona-definition)
2.  [Chaos Engineering Philosophy](#p2-chaos-engineering-philosophy)
3.  [Experiment Design Methodology](#p3-experiment-design-methodology)
4.  [GameDay Planning and Execution](#p4-gameday-planning-and-execution)
5.  [Failure Injection Techniques](#p5-failure-injection-techniques)
6.  [Infrastructure Chaos](#p6-infrastructure-chaos)
7.  [Application Chaos](#p7-application-chaos)
8.  [Database Chaos](#p8-database-chaos)
9.  [Network Chaos](#p9-network-chaos)
10. [Resilience Testing Patterns](#p10-resilience-testing-patterns)
11. [Observability for Chaos Experiments](#p11-observability-for-chaos-experiments)
12. [Chaos Engineering Maturity Model](#p12-chaos-engineering-maturity-model)
13. [Chaos Engineering in CI/CD](#p13-chaos-engineering-in-cicd)
14. [Container and Kubernetes Chaos](#p14-container-and-kubernetes-chaos)
15. [Cloud-Specific Chaos](#p15-cloud-specific-chaos)
16. [Post-Experiment Analysis](#p16-post-experiment-analysis)
17. [Resilience Anti-Patterns](#p17-resilience-anti-patterns)
18. [Worked Examples](#p18-worked-examples)
19. [Quality Gates](#p19-quality-gates)

---

## P1 Persona Definition

### Role Overview

The Chaos Engineer is a specialized systems-thinking role focused on proactively discovering weaknesses in distributed systems through controlled experimentation. Unlike traditional testing roles that validate known behaviors, the Chaos Engineer explores the unknown � probing how systems behave when components fail in unpredictable ways.

### Core Responsibilities

1.  **Hypothesis Formulation**: Translate system behavior expectations into testable steady-state hypotheses
2.  **Experiment Design**: Design chaos experiments with measurable variables, controlled blast radius, and clear rollback criteria
3.  **Failure Injection**: Execute safe failure injection using appropriate tooling (LitmusChaos, Gremlin, Chaos Mesh, AWS FIS)
4.  **GameDay Facilitation**: Plan and run GameDay exercises that simulate real-world incidents
5.  **Observability Integration**: Ensure experiment telemetry captures steady-state deviation and blast radius
6.  **Remediation Tracking**: Convert experimental findings into actionable remediation items
7.  **Maturity Advancement**: Drive the organization from ad-hoc chaos to continuous, proactive resilience validation

### Key Competencies

- Distributed systems fundamentals (CAP theorem, consistency models, partition tolerance)
- Infrastructure as Code (Terraform, Pulumi, CloudFormation)
- Container orchestration (Kubernetes, ECS, Nomad)
- Observability stack (Prometheus, Grafana, Datadog, OpenTelemetry)
- Programming (Go, Python, TypeScript) for experiment automation
- Incident response and incident management processes
- Statistical analysis for experiment result evaluation
- Risk assessment and blast radius analysis

### Collaboration Interfaces

| Role | Collaboration Point |
|------|-------------------|
| SRE Engineer | Steady-state SLO alignment, error budget impact assessment |
| Incident Commander | Post-incident experiment identification, GameDay coordination |
| Infrastructure Engineer | Experiment environment provisioning, tooling integration |
| Application Developer | Steady-state hypothesis definition, application-level metrics |
| Security Engineer | Experiment boundary validation, compliance requirements |
| Platform Engineer | Chaos tooling integration, CI/CD pipeline embedding |
| Product Manager | Experiment priority based on customer-impacting risk |

### Mindset Attributes

- **Skeptical**: Assume every system component will eventually fail; verify resilience claims experimentally
- **Rigorous**: Every experiment has a hypothesis, measurable metrics, and a control group
- **Safety-Conscious**: Minimize blast radius; always have automated rollback capability
- **Systematic**: Build from simple to complex experiments; validate foundational resilience before advanced scenarios
- **Data-Driven**: Base conclusions on experimental evidence, not design documents or assumptions
- **Collaborative**: Share findings openly; build organizational resilience knowledge

### Weekly Cadence Example

| Day | Activity |
|-----|----------|
| Monday | Review steady-state metrics from production; identify anomalies |
| Tuesday | Design new experiment based on recent incident post-mortem |
| Wednesday | Execute experiment in staging; analyze results |
| Thursday | Prepare GameDay scenario; coordinate with participants |
| Friday | Retrospective on week experiments; update experiment catalog |

### Tooling Stack

```
Chaos Orchestration:    LitmusChaos, Chaos Mesh, Gremlin, AWS FIS, Azure Chaos Studio
Observability:          Prometheus, Grafana, Datadog, New Relic, Honeycomb, OpenTelemetry
Infrastructure:         Kubernetes, Terraform, Helm, Crossplane, Pulumi
CI/CD Integration:      GitHub Actions, GitLab CI, Argo Workflows, Jenkins
Communication:          Slack, PagerDuty, OpsGenie
Incident Management:    Incident.io, PagerDuty, FireHydrant, Blameless
```

### Learning Path

1.  **Foundations**: Chaos engineering principles, distributed systems basics, observability fundamentals
2.  **Tooling**: Learn one chaos platform deeply (recommended: LitmusChaos or Chaos Mesh)
3.  **Experimentation**: Run 10+ experiments in non-production environments with supervision
4.  **GameDays**: Co-facilitate 3+ GameDays before leading independently
5.  **Automation**: Build automated experiment pipelines in CI/CD
6.  **Advancement**: Drive maturity model progression; mentor other engineers

---

## P2 Chaos Engineering Philosophy

### The Principles of Chaos Engineering

Chaos engineering emerged from Netflix experience operating distributed systems at massive scale. The discipline formalizes what experienced operators have always known � systems will fail, and the only way to build confidence is to test failure modes systematically.

#### Principle 1: Define Steady State

**Statement**: Before introducing chaos, define what normal looks like. Steady state is not the absence of failures but the predictable behavior of the system under known conditions.

**Implications**:
- Steady state must be measurable through observable outputs (latency, throughput, error rates)
- Metrics must have known baselines with acceptable ranges
- Steady state definition evolves as the system evolves
- Multiple steady state dimensions may be needed (user-facing, infrastructure, dependent services)

**Common Steady State Metrics**:
```
User-Facing:
  - p50/p95/p99 latency (ms)
  - Error rate (%)
  - Request throughput (req/s)
  - Active users

Infrastructure:
  - CPU utilization (%)
  - Memory usage (%)
  - Disk I/O latency (ms)
  - Network bandwidth utilization (%)

Dependency:
  - Database query latency (ms)
  - Cache hit ratio (%)
  - Message queue depth
  - External API latency (ms)

Business:
  - Checkout completion rate (%)
  - Search success rate (%)
  - Stream start latency (ms)
  - Upload success rate (%)
```

#### Principle 2: Experiment in Production

**Statement**: Chaos experiments must be conducted in production environments where real traffic, real data, and real behavior patterns exist. Staging environments cannot replicate production complexity.

**Safety Constraints**:
- Start with small blast radius
- Use progressive rollout of experiment intensity
- Ensure automated rollback mechanisms exist
- Have human approval gates for high-risk experiments
- Run during low-traffic periods initially
- Monitor experiments with dedicated dashboards

**Production Experiment Guards**:
```yaml
experiment_guards:
  max_blast_radius_percentage: 5
  requires_approval: true
  approval_required_roles:
    - sre-engineer
    - incident-commander
  allowed_time_windows:
    - day: weekday
      start: "09:00"
      end: "14:00"
    - day: weekend
      start: "06:00"
      end: "18:00"
  auto_rollback:
    rollback_on_error_budget_exhaustion: true
    rollback_on_latency_spike: true
    latency_spike_threshold_p99: "2x baseline"
    rollback_on_error_rate_spike: true
    error_rate_spike_threshold: "5x baseline"
```

#### Principle 3: Minimize Blast Radius

**Statement**: Chaos experiments should minimize the scope of potential damage. The goal is to learn, not to cause incidents. Blast radius must be controlled, measurable, and reversible.

**Strategies**:
- Begin with single-instance experiments before multi-instance
- Target low-traffic shards before high-traffic shards
- Use feature flags to isolate experiment traffic
- Leverage cell-based architecture for natural isolation
- Implement circuit breakers that limit cascading effects
- Use time-bound experiments with hard TTLs

**Blast Radius Classification**:
```
Tier 1 (Minimal):
  - Single pod/container termination
  - Single process kill
  - Read-only API latency injection
  - Cache eviction single node

Tier 2 (Moderate):
  - Multiple pod termination (same AZ)
  - Network latency injection service-level
  - Database connection pool reduction
  - Single AZ failure

Tier 3 (Significant):
  - Region-level failure
  - Multiple service dependency failure
  - Data corruption experiments
  - Comprehensive network partition

Tier 4 (Critical):
  - Full production failure
  - Customer-facing degradation
  - Data loss scenarios
  - (Requires VP/CISO approval)
```

#### Principle 4: Automate Experiments Continuously

**Statement**: Manual experiments are necessary for learning but insufficient for building confidence. Continuous automated experimentation is the goal.

**Automation Progression**:
1. Manual experiments with documented runbooks
2. Semi-automated with human trigger and monitoring
3. Fully automated with safety gates
4. Continuous experimentation in CI/CD pipelines
5. Proactive experimentation triggered by deploy risk assessment

### The Scientific Method Applied

Chaos engineering applies the scientific method to production systems:

1.  **Observation**: Note system behavior under normal conditions
2.  **Hypothesis**: Predict how the system will behave under specific failure conditions
3.  **Experiment**: Introduce the failure condition in a controlled manner
4.  **Analysis**: Compare observed behavior against the hypothesis
5.  **Conclusion**: Accept or reject the hypothesis; identify weaknesses
6.  **Iteration**: Design new experiments based on findings

### Chaos Engineering vs. Traditional Testing

| Aspect | Traditional Testing | Chaos Engineering |
|--------|-------------------|-------------------|
| Environment | Staging, QA | Production |
| Focus | Known edge cases | Unknown failure modes |
| Methodology | Predefined test cases | Hypothesis-driven experiments |
| Automation | Automated assertions | Automated with safety controls |
| Data | Synthetic | Production traffic |
| Scope | Single component | Distributed system interactions |
| Frequency | Per release | Continuous |
| Outcome | Bug detection | Resilience validation |
| Risk | Low | Controlled risk |

### The Economics of Chaos Engineering

**Investment Areas**:
- Chaos engineering tooling and infrastructure
- Experiment design and execution time
- GameDay planning and facilitation
- Remediation implementation

**Returns**:
- Reduced MTTR through validated runbooks
- Lower severity and frequency of production incidents
- Increased engineering confidence in system changes
- Reduced cognitive load during real incidents
- Faster deployment velocity through validated resilience

### Organizational Culture Requirements

1.  **Blamelessness**: Experiments that reveal weaknesses are wins, not failures
2.  **Psychological Safety**: Engineers must feel safe running experiments
3.  **Transparency**: Experiment results shared openly across teams
4.  **Learning Orientation**: Focus on discovery, not validation of assumptions
5.  **Safety First**: Blast radius controls are non-negotiable
6.  **Executive Support**: Leadership must understand and support the practice

### Common Objections and Responses

**Objection**: Chaos engineering is too risky for production
**Response**: Controlled experiments with small blast radius and automated rollback are safer than unexpected failures. The risk of NOT running experiments is higher.

**Objection**: We already test in staging
**Response**: Staging environments cannot replicate production scale, traffic patterns, data volume, or the complex interdependencies of production systems.

**Objection**: Our system is too critical for experiments
**Response**: The most critical systems benefit most from chaos engineering. Start with read-only paths and work up.

**Objection**: We do not have the tooling or expertise
**Response**: Start simple with manual experiments. The cost of inaction far exceeds the investment in building chaos engineering capabilities.

### Ethical Boundaries

1.  Never experiment without informed consent from affected teams
2.  Never exceed agreed-upon blast radius parameters
3.  Never experiment during business-critical periods
4.  Always have a rollback plan and execute it if safety thresholds are breached
5.  Always share findings transparently
6.  Never use chaos experiments to blame individuals or teams
7.  Respect compliance requirements (PCI-DSS, HIPAA, SOC2)

---

## P3 Experiment Design Methodology

### The Experiment Lifecycle

Every chaos experiment follows a structured lifecycle from conception to completion. This lifecycle ensures consistency, safety, and learning value across all experiments.

```
1. Identify Hypothesis
2. Define Steady State
3. Design Experiment
4. Safety Review
5. Implement Experiment
6. Execute Experiment
7. Analyze Results
8. Document Findings
9. Track Remediation
10. Share Learnings
```

### Step 1: Identify Hypothesis

Hypotheses should be derived from:
- Recent incidents or near-misses
- Architecture review findings
- Known system dependencies
- Change management data (deployments, config changes)
- On-call engineer observations
- Capacity planning concerns
- Third-party dependency changes

**Hypothesis Examples**:
```
Good: When us-east-1 fails, traffic shifts to us-west-2 within 30 seconds
       with less than 5% error rate increase and less than 50% latency increase

Good: When the payment service experiences 2000ms latency p99,
       the checkout service degrades gracefully by showing a retry message
       rather than returning 500 errors

Bad:  The system is resilient (not testable)
Bad:  The database will fail over (too vague, no measurable outcome)
```

**Hypothesis Template**:
```
When [failure condition] occurs:
  - The system will [expected behavior]
  - Within [timeframe]
  - With [measurable outcomes]
  - Impact limited to [blast radius scope]
```

### Step 2: Define Steady State

Steady state defines normal system behavior across multiple dimensions. It serves as the baseline against which experiment results are compared.

**Steady State Dimensions**:
```
Dimension 1: User-Facing Metrics
  - Metric: checkout_p50_latency
    Baseline: 120ms
    Acceptance Range: 100-200ms
    Source: Datadog

  - Metric: checkout_error_rate
    Baseline: 0.5%
    Acceptance Range: 0-2%
    Source: Grafana

Dimension 2: Infrastructure Metrics
  - Metric: pod_restart_count
    Baseline: 0
    Acceptance Range: 0-3
    Source: Kubernetes API

  - Metric: mysql_connection_count
    Baseline: 45
    Acceptance Range: 30-100
    Source: Prometheus

Dimension 3: Business Metrics
  - Metric: order_creation_rate
    Baseline: 12.5/sec
    Acceptance Range: 8-20/sec
    Source: Custom business metrics pipeline

  - Metric: cart_abandonment_rate
    Baseline: 23%
    Acceptance Range: 15-35%
    Source: Analytics pipeline
```

**Baseline Collection Period**:
- Minimum: 24 hours of data
- Recommended: 7 days of data
- Include known traffic patterns (peak, off-peak)
- Account for day-of-week variations
- Exclude periods with known anomalies or incidents

**Steady State Validation**:
```python
import pandas as pd
import numpy as np

def validate_steady_state(metric_data, baseline_days=7):
    """Validates that current metric data falls within steady state ranges."""
    current_data = metric_data[-300:]  # Last 5 minutes at 1s resolution
    baseline_data = metric_data[:-300]
    baseline_mean = np.mean(baseline_data)
    baseline_std = np.std(baseline_data)
    upper_bound = baseline_mean + 3 * baseline_std
    lower_bound = baseline_mean - 3 * baseline_std
    anomalies = current_data[(current_data < lower_bound) | (current_data > upper_bound)]
    if len(anomalies) > len(current_data) * 0.05:
        return False, f"Steady state violation: {len(anomalies)} anomalous points"
    return True, "Steady state confirmed"
```

### Step 3: Design Experiment

**Experiment Configuration Template**:

```yaml
experiment:
  id: chaos-2026-042
  name: payment-service-network-latency
  owner: team-payments
  status: designed
  hypothesis: |
    When 200ms of network latency is injected into the payment-service on 2 of 5 pods:
    - Checkout service will use the circuit breaker after 3 timeouts
    - p99 checkout latency will increase by less than 500ms
    - Error rate will remain below 2%
    - Blast radius limited to 10% of transaction traffic
  steady_state:
    metrics:
      - name: checkout_p99_latency
        baseline_ms: 250
        acceptable_range_ms: [200, 600]
      - name: checkout_error_rate
        baseline_percent: 0.3
        acceptable_range_percent: [0, 2]
      - name: payment_p99_latency
        baseline_ms: 180
        acceptable_range_ms: [100, 400]
    duration: 300
    source: prometheus-7d-rolling
  experiment_parameters:
    failure_type: network_latency
    target:
      service: payment-service
      namespace: payments
      pods: 2
      percentage: 40
    latency_ms: 200
    jitter_ms: 50
    duration_seconds: 120
    blast_radius:
      max_instances: 2
      max_traffic_percentage: 10
      restricted_services:
        - checkout-service
        - api-gateway
  rollback_criteria:
    conditions:
      - metric: checkout_error_rate
        operator: ">"
        threshold: 5
        duration_seconds: 10
      - metric: checkout_p99_latency
        operator: ">"
        threshold: 2000
        duration_seconds: 10
    auto_rollback: true
    rollback_action: remove_latency_injection
    notification_channels:
      - slack: "#chaos-engineering"
      - pagerduty: chaos-experiments
  schedule:
    window:
      start: "2026-06-01T14:00:00Z"
      end: "2026-06-01T15:00:00Z"
    approval_required: true
    approved_by: []
```

### Step 4: Safety Review

Every experiment requires a safety review before execution. The review process scales with experiment risk level.

**Safety Review Tiers**:

```
Tier 1 (Low Risk):
  - Self-review using checklist
  - Document in experiment tracking system
  - Examples: single pod kill, read-only latency test

Tier 2 (Moderate Risk):
  - Peer review by another chaos engineer
  - Review of rollback criteria and automation
  - Examples: multi-pod failure, latency on critical path

Tier 3 (High Risk):
  - Full review including SRE and incident commander
  - Executive notification required
  - Dry run in staging environment mandatory
  - Examples: AZ failure, data corruption, region failover

Tier 4 (Critical):
  - Requires VP-level approval
  - Business impact assessment required
  - Legal/compliance review if applicable
  - Examples: Full production failover, customer data experiments
```

**Safety Checklist**:
```yaml
safety_checklist:
  - question: Is the steady state clearly defined and measurable?
    required: true
  - question: Are rollback criteria automated?
    required: true
  - question: Is blast radius documented and limited?
    required: true
  - question: Have affected teams been notified?
    required: true
  - question: Is there a manual abort mechanism?
    required: true
  - question: Are monitoring dashboards configured?
    required: true
  - question: Is this experiment within the agreed time window?
    required: true
  - question: Has a dry run been completed for Tier 3+?
    required_for_tiers: [3, 4]
  - question: Have rollback procedures been tested?
    required: true
  - question: Is the experiment documented in the tracking system?
    required: true
```

### Step 5: Implement Experiment

Implementation involves translating the experiment design into executable chaos experiments using the chosen tooling.

**LitmusChaos Experiment Example**:
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosExperiment
metadata:
  name: payment-network-latency
  namespace: litmus
spec:
  definition:
    scope: Namespaced
    permissions:
      - apiGroups: [""]
        resources: ["pods"]
        verbs: ["list", "get", "delete"]
      - apiGroups: [""]
        resources: ["events"]
        verbs: ["create", "patch"]
    experiments:
      - name: pod-network-latency
        spec:
          components:
            env:
              - name: TARGET_CONTAINER
                value: payment-service
              - name: PODS_AFFECTED_PERC
                value: "40"
              - name: NETWORK_LATENCY
                value: "200"
              - name: JITTER
                value: "50"
              - name: TOTAL_CHAOS_DURATION
                value: "120"
              - name: SEQUENCE
                value: "parallel"
              - name: RAMP_TIME
                value: "10"
          probe:
            - name: checkout-health-check
              type: httpProbe
              httpProbe/inputs:
                url: http://checkout-service:8080/health
                expectedStatusCode: 200
              mode: Continuous
              runProperties:
                probeTimeout: 5
                interval: 5
                retry: 3
```

**Chaos Mesh Experiment Example**:
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: payment-latency-042
  namespace: payments
spec:
  action: delay
  mode: fixed-percent
  value: "40"
  selector:
    namespaces:
      - payments
    labelSelectors:
      app: payment-service
  delay:
    latency: "200ms"
    jitter: "50ms"
    correlation: "50"
  duration: "120s"
  scheduler:
    cron: "@at 2026-06-01T14:00:00Z"
```

**AWS FIS Experiment Example**:
```json
{
  "experimentTemplate": {
    "description": "Payment service network latency experiment",
    "targets": {
      "paymentInstances": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": { "Service": "payment-service" },
        "selectionMode": "PERCENTAGE",
        "percentage": 40
      }
    },
    "actions": {
      "networkLatency": {
        "actionId": "aws:ssm:send-command",
        "parameters": {
          "command": "tc qdisc add dev eth0 root netem delay 200ms 50ms",
          "documentArn": "arn:aws:ssm:us-east-1:aws:document/AWS-RunShellScript",
          "duration": "PT120S"
        },
        "targets": { "instances": "paymentInstances" }
      },
      "rollback": {
        "actionId": "aws:ssm:send-command",
        "parameters": {
          "command": "tc qdisc del dev eth0 root netem",
          "documentArn": "arn:aws:ssm:us-east-1:aws:document/AWS-RunShellScript"
        },
        "targets": { "instances": "paymentInstances" }
      }
    },
    "stopConditions": [{
      "source": "aws:cloudwatch:alarm",
      "value": "arn:aws:cloudwatch:us-east-1:123456789012:alarm:CheckoutHighErrorRate"
    }],
    "roleArn": "arn:aws:iam::123456789012:role/aws-fis-experiment-role",
    "tags": {
      "ExperimentType": "chaos-engineering",
      "SteadyStateHypothesis": "payment-resilience"
    }
  }
}
```

### Step 6: Execute Experiment

**Pre-Execution Checklist**:
```python
def pre_execution_check(experiment_config):
    checks_passed = True
    messages = []
    steady_state_ok = check_current_metrics(experiment_config.steady_state)
    if not steady_state_ok:
        checks_passed = False
        messages.append("Steady state violated before experiment start")
    in_window = check_time_window(experiment_config.schedule.window)
    if not in_window:
        checks_passed = False
        messages.append("Outside allowed experiment time window")
    approved = check_approvals(experiment_config)
    if not approved:
        checks_passed = False
        messages.append("Experiment not fully approved")
    rollback_ready = test_rollback_mechanism(experiment_config.rollback_criteria)
    if not rollback_ready:
        checks_passed = False
        messages.append("Rollback mechanism not verified")
    notify_stakeholders(experiment_config, "pre-execution")
    return checks_passed, messages
```

**Execution Monitoring**:
```python
def monitor_experiment(experiment_id, steady_state, rollback_criteria):
    start_time = time.now()
    while time.now() - start_time < experiment.max_duration:
        for metric in steady_state.metrics:
            current_value = query_metric(metric.name)
            if current_value > metric.acceptable_range[1]:
                if check_duration_threshold(metric.name, rollback_criteria.duration_seconds):
                    execute_rollback(experiment_id)
                    return RollbackResult(
                        reason=f"{metric.name} exceeded threshold",
                        current_value=current_value,
                        threshold=metric.acceptable_range[1]
                    )
        time.sleep(5)
    return ExperimentResult(status="completed", duration=time.now() - start_time)
```

### Step 7: Analyze Results

**Analysis Framework**:
```python
class ExperimentAnalysis:
    def analyze(self, baseline_data, experiment_data, hypothesis):
        results = {}
        for metric in hypothesis.metrics:
            baseline_stats = self.compute_statistics(baseline_data[metric.name])
            experiment_stats = self.compute_statistics(experiment_data[metric.name])
            deviation = self.compute_deviation(baseline_stats, experiment_stats)
            significance = self.statistical_test(baseline_data[metric.name], experiment_data[metric.name])
            results[metric.name] = {
                "deviation_percentage": deviation,
                "p_value": significance,
                "significant": significance < 0.05,
                "baseline": baseline_stats,
                "experiment": experiment_stats
            }
        hypothesis_accepted = all(
            r["significant"] == metric.expected_significance
            for metric, r in zip(hypothesis.metrics, results.values())
        )
        return AnalysisResult(
            hypothesis_accepted=hypothesis_accepted,
            metric_results=results,
            findings=self.extract_findings(results, hypothesis)
        )

    def compute_statistics(self, data):
        import numpy as np
        return {
            "mean": np.mean(data), "median": np.median(data),
            "p50": np.percentile(data, 50), "p95": np.percentile(data, 95),
            "p99": np.percentile(data, 99), "std": np.std(data),
            "min": np.min(data), "max": np.max(data)
        }

    def compute_deviation(self, baseline, experiment):
        if baseline["mean"] == 0: return float("inf")
        return ((experiment["mean"] - baseline["mean"]) / baseline["mean"]) * 100

    def statistical_test(self, baseline, experiment):
        from scipy import stats
        _, p_value = stats.ttest_ind(baseline, experiment)
        return p_value
```

### Step 8: Document Findings

**Experiment Report Template**:
```yaml
experiment_report:
  id: chaos-2026-042
  name: payment-service-network-latency
  date: 2026-06-01
  owner: team-payments
  status: completed
  hypothesis: |
    When 200ms network latency is injected into payment-service:
    - Checkout service circuit breaker engages after 3 timeouts
    - p99 checkout latency increases by less than 500ms
    - Error rate less than 2%
  results:
    hypothesis_accepted: false
    findings:
      - metric: checkout_p99_latency
        baseline_ms: 250
        observed_ms: 1850
        deviation_percent: 640
        accepted: false
        note: "Circuit breaker timeout was set to 10s, far exceeding hypothesis"
      - metric: checkout_error_rate
        baseline_percent: 0.3
        observed_percent: 12.5
        deviation_percent: 4066
        accepted: false
        note: "Retry storm caused cascading failures"
      - metric: payment_p99_latency
        baseline_ms: 180
        observed_ms: 650
        deviation_percent: 261
        accepted: true
        note: "Latency injection worked as expected"
  analysis:
    timeline:
      - time: 0s
        event: "Latency injection started on 2 payment pods"
      - time: 12s
        event: "Checkout service timeouts began"
      - time: 18s
        event: "Retry storm initiated - checkout pods at 200% CPU"
      - time: 25s
        event: "Circuit breaker opened (timeout: 10s)"
      - time: 32s
        event: "Error rate exceeded 5% threshold"
      - time: 35s
        event: "Auto-rollback triggered"
      - time: 42s
        event: "Latency injection removed"
      - time: 55s
        event: "System returned to steady state"
  remediation:
    - priority: critical
      finding: "Circuit breaker timeout misconfigured (10s vs expected 3s)"
      action: "Update circuit breaker timeout to 3s in checkout service"
      owner: team-checkout
      deadline: "2026-06-15"
    - priority: high
      finding: "No retry budget or backoff strategy"
      action: "Implement exponential backoff with jitter for payment calls"
      owner: team-checkout
      deadline: "2026-06-30"
    - priority: medium
      finding: "Missing timeout configuration for payment client"
      action: "Add client-side timeout of 2s for payment service calls"
      owner: team-checkout
      deadline: "2026-07-15"
```

### Step 9: Track Remediation

**Remediation Tracking Schema**:
```yaml
remediation_tracker:
  experiment_id: chaos-2026-042
  items:
    - id: REM-001
      finding: "Circuit breaker timeout misconfigured"
      priority: critical
      owner: team-checkout
      status: in_progress
      created: 2026-06-01
      deadline: 2026-06-15
      verification_experiment: chaos-2026-048
    - id: REM-002
      finding: "No retry budget or backoff strategy"
      priority: high
      owner: team-checkout
      status: backlog
      created: 2026-06-01
      deadline: 2026-06-30
      verification_experiment: chaos-2026-052
    - id: REM-003
      finding: "Missing client-side timeout"
      priority: medium
      owner: team-checkout
      status: todo
      created: 2026-06-01
      deadline: 2026-07-15
      verification_experiment: chaos-2026-055
```

### Step 10: Share Learnings

**Knowledge Sharing Mechanisms**:
1. Weekly chaos engineering newsletter with experiment summaries
2. Post-experiment brown bag sessions
3. Experiment catalog with searchable findings database
4. Automated Slack digests to relevant teams
5. Quarterly resilience report to leadership
6. Integration with incident post-mortem process
7. Runbook updates based on experiment findings

---

## P4 GameDay Planning and Execution

### What is a GameDay?

A GameDay is a scheduled, simulated incident event where participants respond to a failure scenario in a controlled environment. Unlike a chaos experiment (which tests a specific hypothesis), a GameDay tests the entire incident response system � people, processes, tools, and communication.

### GameDay vs. Chaos Experiment

| Aspect | Chaos Experiment | GameDay |
|--------|-----------------|---------|
| Scope | Specific failure scenario | End-to-end incident simulation |
| Focus | Hypothesis testing | Process and people testing |
| Participants | Usually 1-2 engineers | Full incident response team |
| Duration | Minutes to hours | 1-4 hours |
| Blast Radius | Real production (limited) | Can be simulated |
| Environment | Production or staging | Staging or simulated |
| Outcome | Technical finding | Process improvement |

### GameDay Planning Framework

#### Phase 1: Design (2-4 weeks before)

**Scenario Selection**:
```
Criteria for Good Scenarios:
  1. Realistic � based on actual incidents or near-misses
  2. Challenging � tests known weaknesses
  3. Educational � teaches participants something new
  4. Achievable � resolvable within the timeframe
  5. Measurable � clear success/failure criteria

Scenario Sources:
  - Recent production incidents
  - Upcoming infrastructure changes
  - New service deployments
  - Chaos experiment findings
  - Risk assessment results
  - Compliance requirements
  - On-call team feedback
```

**Scenario Template**:
```yaml
game_day:
  id: gd-2026-012
  name: "The Silent Database"
  scenario: |
    A database replica in us-east-1 has fallen behind the primary by 45 minutes
    due to a network connectivity issue. The replication lag is growing at 2
    minutes per hour. The primary is at 85% disk capacity. Participants must
    identify the issue, determine the root cause, and implement a remediation
    without causing data loss or extended downtime.
  timeline:
    - time: "T+0"
      event: "Participants receive initial alert"
      inject: |
        Alert: ReplicationLag > 600s for payment-db-replica-1
        Dashboard shows 45min lag, growing.
    - time: "T+15"
      event: "More information available"
      inject: |
        Support ticket: Users reporting delayed payment confirmations
        Disk usage alert for primary DB
    - time: "T+30"
      event: "Escalation point"
      inject: |
        Engineering manager asks for status update
        Customer support reports 50+ tickets
    - time: "T+60"
      event: "Complication"
      inject: |
        Primary DB hits 90% disk usage
        Replication lag now 55 minutes
    - time: "T+90"
      event: "Resolution deadline"
      inject: |
        VP Engineering requests resolution plan
    - time: "T+120"
      event: "Scenario end"
      inject: "End scenario"
  expected_resolution:
    1. Identify replication lag as root cause
    2. Investigate network connectivity to replica
    3. Resolve network issue
    4. Verify replication catches up
    5. Implement monitoring for replication lag
    6. Consider read traffic failover to replica during lag
  success_criteria:
    - "Replication lag identified within 15 minutes"
    - "Root cause identified within 30 minutes"
    - "Remediation implemented within 90 minutes"
    - "No data loss incurred"
    - "Customer impact minimized"
  roles:
    incident_commander: "SRE Lead"
    communications: "Engineering Manager"
    primary_response:
      - "Database Engineer"
      - "Backend Engineer"
    secondary_response:
      - "Network Engineer"
    observers:
      - "New SRE hires"
      - "Junior engineers"
```

#### Phase 2: Preparation (1-2 weeks before)

**Participant Preparation**:
```yaml
preparation:
  notifications:
    - type: email
      to: all_participants
      weeks_before: 2
      content: |
        You have been assigned to GameDay gd-2026-012 on June 15.
        Please block 3 hours (14:00-17:00 UTC).
        No special preparation required.
    - type: calendar
      to: all_participants
      days_before: 7
      title: "GameDay: The Silent Database"
      duration: "3h"
  environment_checklist:
    - item: "Staging environment ready"
      owner: infra-team
    - item: "Monitoring dashboards configured"
      owner: observability-team
    - item: "Communication channels created"
      owner: chaos-engineering
    - item: "Simulation scripts tested"
      owner: chaos-engineering
    - item: "Rollback mechanisms verified"
      owner: infra-team
    - item: "Observers briefed on their role"
      owner: chaos-engineering
```

#### Phase 3: Execution (GameDay)

**GameDay Timeline**:
```
T-14:00 - Setup and environment verification
T-00:30 - Participant briefing (scenario context, rules, expectations)
T-00:15 - Observers and facilitators take positions
T-00:05 - Final checks
T+00:00 - Scenario begins (first alert triggered)
T+00:15 - First check-in
T+00:30 - Escalation if needed
T+00:60 - Mid-scenario check-in
T+00:90 - Escalation/Complication
T+02:00 - Scenario ends
T+02:15 - Debrief begins
T+02:30 - Facilitated retrospective
T+03:00 - Action items documented
```

**Facilitator Responsibilities**:
1.  **Timekeeper**: Keep the scenario on schedule
2.  **Injector**: Trigger events at appropriate times
3.  **Observer**: Watch participant interactions without intervening
4.  **Note-taker**: Document decisions, challenges, and insights
5.  **Safety**: Ensure psychological safety

**Rules for Participants**:
1.  Respond as you would in a real incident
2.  Use actual tools and processes
3.  Communicate through normal channels
4.  No preparation beyond normal readiness
5.  Failure is expected � learning is the goal
6.  Observers do not participate unless asked
7.  If stuck, ask for a hint

**Psychological Safety Reminder**:
> This is a GameDay. The purpose is to learn and improve our incident response capabilities. There are no failures here � every challenge you face reveals an opportunity to make our systems and processes better.

#### Phase 4: Retrospective (Immediately After)

**Retrospective Format**:
```yaml
retrospective:
  game_day_id: gd-2026-012
  date: 2026-06-15
  what_went_well:
    - "Team identified replication lag within 8 minutes"
    - "Communication was clear and timely"
    - "Incident commander effectively delegated tasks"
  what_could_improve:
    - "Network team not engaged until T+45 (should be earlier)"
    - "Runbook for replication lag outdated"
    - "No clear process for customer communication"
    - "Monitoring dashboard not showing replication lag trend"
  action_items:
    - priority: high
      action: "Update replication lag runbook"
      owner: team-database
      deadline: "2026-07-01"
    - priority: high
      action: "Add replication lag trend to main dashboard"
      owner: team-observability
      deadline: "2026-07-01"
    - priority: medium
      action: "Create customer communication template for DB issues"
      owner: team-support
      deadline: "2026-07-15"
    - priority: low
      action: "Schedule quarterly GameDays for database scenarios"
      owner: chaos-engineering
      deadline: "2026-07-30"
  metrics:
    time_to_detect: "8 minutes"
    time_to_respond: "12 minutes"
    time_to_resolve: "67 minutes"
    escalations_used: 2
    hints_requested: 1
    participant_satisfaction: 4.2 / 5.0
```

### GameDay Scenario Catalog

**Scenario 1: The Cascading Failure**
```
Context: A deployment to Service A introduces a memory leak. Over 30 minutes,
Service A memory usage grows from 40% to 95%, causing OOM kills. As pods
restart, the load balancer shifts traffic to remaining pods, accelerating the
failure. Downstream services experience timeouts and begin failing.

Learning Objectives:
  - Symptom identification vs. root cause
  - Effective use of monitoring to correlate events
  - Understanding load balancer behavior during partial failures
  - Implementing circuit breakers or bulkheads
```

**Scenario 2: The Silent Dependency**
```
Context: A third-party payment provider changes their API response format
without notice. Responses are still HTTP 200, but the response body format
has changed. Our parser fails silently. After 4 hours, the payment queue
grows to 50,000 unprocessed items.

Learning Objectives:
  - Monitoring for data correctness, not just HTTP status codes
  - Queue depth monitoring and alerting
  - Structured logging and log analysis
  - Vendor dependency risk management
```

**Scenario 3: The Certificate Expiry**
```
Context: Three internal TLS certificates expire simultaneously at 02:00 UTC.
Services begin failing with TLS handshake errors. The on-call engineer sees
a flood of alerts from multiple services but cannot identify the common cause.

Learning Objectives:
  - Identifying common-cause failures across alert storms
  - Certificate management best practices
  - Automated certificate renewal verification
  - Communication during widespread failures
```

**Scenario 4: Data Corruption**
```
Context: During a routine database maintenance operation, a script corrupts
a critical index in the user database. Queries against the users table begin
failing with index corruption errors. Some queries succeed, some fail.

Learning Objectives:
  - Identifying index corruption symptoms
  - Database backup and recovery procedures
  - Partial vs. complete failure patterns
  - Communication about data-related incidents
```

**Scenario 5: The Region Goes Dark**
```
Context: All traffic to us-east-1 must be shifted to us-west-2 due to an
AWS network event. The multi-region architecture has been designed but never
fully tested.

Learning Objectives:
  - Multi-region failover procedures
  - DNS TTL management and traffic shifting
  - Cross-region data synchronization
  - Capacity management in secondary region
```

**Scenario 6: The Misconfigured Deployment**
```
Context: A Kubernetes deployment is pushed with resource limits set to 10x
normal values. The cluster autoscaler scales up rapidly, adding 200 nodes
in 15 minutes. AWS costs are running at $50,000/hour.

Learning Objectives:
  - Resource limit monitoring and alerting
  - Cost anomaly detection
  - Emergency rollback procedures
  - Cross-team coordination
```

### GameDay Maturity Levels

```
Level 1: Ad-Hoc
  - No structured scenarios
  - Impromptu exercises
  - No repeatability

Level 2: Planned
  - Scheduled quarterly GameDays
  - Documented scenarios
  - Basic retro process
  - Action items tracked

Level 3: Measured
  - Metrics collected for each GameDay
  - Trend analysis over time
  - Blameless culture established
  - Action items closed before next GameDay

Level 4: Continuous
  - GameDays aligned with risk assessment
  - Scenarios derived from production incidents
  - Automated injection capabilities
  - Cross-team participation rotation

Level 5: Proactive
  - GameDays predict future failure modes
  - Scenarios cover unknown unknowns
  - Proactive resilience improvements identified
  - Organizational learning culture
```

---

## P6 Infrastructure Chaos

### Infrastructure Failure Types

Infrastructure chaos targets the foundational layers of your system: compute, storage, networking, and the underlying cloud/platform services.

### EC2 Instance Termination (AWS)

**Purpose**: Test auto-scaling group replacement, load balancer draining, connection handling during instance termination, and state management.

**AWS FIS Experiment**:
```json
{
  "experimentTemplate": {
    "description": "EC2 termination chaos experiment",
    "targets": {
      "paymentInstances": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": {
          "Service": "payment-service",
          "Environment": "production"
        },
        "selectionMode": "PERCENTAGE",
        "percentage": 20
      }
    },
    "actions": {
      "terminateInstances": {
        "actionId": "aws:ec2:terminate-instances",
        "parameters": {},
        "targets": {
          "instances": "paymentInstances"
        }
      }
    },
    "stopConditions": [{ "source": "none" }],
    "roleArn": "arn:aws:iam::123456789012:role/aws-fis-role",
    "tags": { "Name": "payment-ec2-termination" }
  }
}
```

**Observations**:
```yaml
expected_behaviors:
  - "Auto-scaling group launches replacement instance within 2 minutes"
  - "Load balancer drains connections before termination"
  - "In-flight requests are completed or gracefully failed"
  - "No impact on p99 latency > 500ms"
  - "Error rate remains below 1%"

common_findings:
  - "Connection draining timeout too short (default 30s)"
  - "Auto-scaling group cooldown delays replacement"
  - "Health check grace period misconfigured"
  - "ELB connection draining not enabled for classic load balancers"
```

### Kubernetes Pod Deletion

**Purpose**: Test pod disruption budgets (PDBs), replica management, rolling update behavior, and application graceful shutdown.

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: k8s-pod-delete
spec:
  engineState: active
  appinfo:
    appns: production
    applabel: app=payment-service
    appkind: deployment
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "120"
            - name: CHAOS_INTERVAL
              value: "10"
            - name: FORCE
              value: "true"
            - name: PODS_AFFECTED_PERC
              value: "25"
```

**Pod Disruption Budget Check**:
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: payment-service-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: payment-service
```

**Experiment Pre-Check**:
```python
def validate_pdb(namespace, app_label):
    """Validate that PDB exists and allows the experiment."""
    api = kubernetes.client.PolicyV1Api()
    pdbs = api.list_namespaced_pod_disruption_budget(namespace)
    relevant_pdbs = [
        pdb for pdb in pdbs.items
        if app_label in str(pdb.spec.selector.match_labels)
    ]
    if not relevant_pdbs:
        return {"valid": False, "message": "No PDB found for target application"}
    pdb = relevant_pdbs[0]
    current_pods = get_current_pod_count(namespace, app_label)
    if pdb.spec.min_available:
        max_unavailable = current_pods - pdb.spec.min_available
        if max_unavailable <= 0:
            return {"valid": False, "message": f"PDB minAvailable={pdb.spec.min_available} with {current_pods} pods"}
    return {"valid": True, "message": "PDB allows experiment"}
```

### Kubernetes Node Failure

**Purpose**: Test node disruption, pod rescheduling, cluster autoscaling, and workload redistribution.

```bash
# Cordon a node (prevent new pods)
kubectl cordon node-1

# Drain a node (evict pods gracefully)
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data

# Uncordon when done
kubectl uncordon node-1
```

**Node Failure Experiment**:
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: node-drain
spec:
  engineState: active
  chaosServiceAccount: litmus-admin
  experiments:
    - name: node-drain
      spec:
        components:
          env:
            - name: NODE_NAME
              value: "node-1"
            - name: DRAIN_TIMEOUT
              value: "120"
            - name: IGNORE_DAEMONSETS
              value: "true"
            - name: DELETE_EMPTYDIR_DATA
              value: "true"
```

### Disk Failure

**Purpose**: Test disk I/O errors, disk latency, disk full scenarios, and filesystem corruption.

```bash
# Linux: Simulate disk I/O errors using device mapper
dmsetup create errdev --table "0 $(blockdev --getsz /dev/sdb) error"

# Simulate slow I/O by taking device offline
echo "1" > /sys/block/sdb/device/state
```

### Network Partition (Infrastructure Level)

**Purpose**: Test cluster communication, leader election, data consistency, and partial failure handling.

**AWS FIS Network Partition**:
```json
{
  "experimentTemplate": {
    "description": "Network partition between services",
    "targets": {
      "paymentInstances": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": {"Service": "payment-service"},
        "selectionMode": "ALL"
      },
      "checkoutInstances": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": {"Service": "checkout-service"},
        "selectionMode": "ALL"
      }
    },
    "actions": {
      "modifySecurityGroup": {
        "actionId": "aws:ec2:modify-security-group",
        "parameters": {
          "groupId": "sg-xxxxxxxx",
          "ruleDirection": "ingress",
          "ruleAction": "revoke"
        },
        "targets": { "securityGroups": "paymentInstances" }
      }
    },
    "stopConditions": [{
      "source": "aws:cloudwatch:alarm",
      "value": "arn:aws:cloudwatch:us-east-1:123456789012:alarm/HighErrorRate"
    }]
  }
}
```

### Availability Zone Failure

**Purpose**: Test multi-AZ architecture, cross-AZ load balancing, data replication, and failover behavior.

**Approach**:
1. Identify all resources in a specific AZ (instances, RDS replicas, ELB)
2. Terminate or isolate resources in that AZ
3. Observe system behavior
4. Verify failover to remaining AZs

```python
class AZFailureSimulator:
    def __init__(self, region, target_az):
        self.region = region
        self.target_az = target_az
        self.ec2 = boto3.client("ec2", region_name=region)

    def identify_az_resources(self):
        """Identify all resources in the target AZ."""
        resources = {"instances": [], "rds_instances": []}
        instances = self.ec2.describe_instances(
            Filters=[{"Name": "availability-zone", "Values": [self.target_az]}]
        )
        for reservation in instances["Reservations"]:
            for instance in reservation["Instances"]:
                resources["instances"].append(instance["InstanceId"])
        return resources

    def isolate_az_resources(self, resources):
        """Isolate resources in the target AZ by modifying security groups."""
        for instance_id in resources["instances"]:
            instance = self.ec2.describe_instances(InstanceIds=[instance_id])
            sg_ids = [sg["GroupId"] for sg in instance["Reservations"][0]["Instances"][0]["SecurityGroups"]]
            for sg_id in sg_ids:
                self.ec2.revoke_security_group_ingress(
                    GroupId=sg_id,
                    IpPermissions=[{"IpProtocol": "-1", "IpRanges": [{"CidrIp": "10.0.0.0/8"}]}]
                )

    def restore_az_access(self, resources):
        """Restore access to resources in the target AZ."""
        for instance_id in resources["instances"]:
            instance = self.ec2.describe_instances(InstanceIds=[instance_id])
            sg_ids = [sg["GroupId"] for sg in instance["Reservations"][0]["Instances"][0]["SecurityGroups"]]
            for sg_id in sg_ids:
                self.ec2.authorize_security_group_ingress(
                    GroupId=sg_id,
                    IpPermissions=[{"IpProtocol": "-1", "IpRanges": [{"CidrIp": "10.0.0.0/8"}]}]
                )
```

### Region Failure

**Purpose**: Test multi-region architecture, global load balancing, cross-region replication, and disaster recovery.

**Key Considerations**:
1. DNS-based routing: Route53 latency routing, geolocation routing, failover routing
2. Data replication: Cross-region database replication, S3 CRR, DynamoDB global tables
3. Application state: Session replication, cache warming in secondary region
4. Capacity: Secondary region must handle full traffic load
5. Data loss: RPO and RTO requirements during region failure

**Region Failure Experiment Template**:
```yaml
experiment:
  name: region-failover
  type: region_failure
  primary_region: us-east-1
  secondary_region: us-west-2
  steady_state:
    metrics:
      - name: global_error_rate
        baseline: 0.5%
      - name: global_p99_latency
        baseline: 300ms
      - name: primary_region_traffic
        baseline: 65%
      - name: secondary_region_traffic
        baseline: 35%
  experiment_parameters:
    failover_duration: 45
    traffic_shift: 100
    validate_route53: true
    validate_cross_region_replication: true
  expected_results:
    - "Traffic fully shifts to secondary region within DNS TTL (60s)"
    - "Error rate increases by less than 2% during transition"
    - "P99 latency increases by less than 200ms"
    - "No data loss (RPO=0 achieved)"
    - "System returns to normal within 5 minutes of failback"
```

### Cloud Provider API Failure

**Purpose**: Test dependency on cloud provider APIs: EC2 API, S3 API, DynamoDB API, etc.

```yaml
# Chaos Mesh: Block access to AWS EC2 API
apiVersion: chaos-mesh.org/v1alpha1
kind: HTTPChaos
metadata:
  name: block-aws-api
spec:
  mode: all
  selector:
    namespaces: ["production"]
    labelSelectors:
      app: payment-service
  target: Request
  port: 443
  abort: true
  duration: "5m"
```

---

## P7 Application Chaos

### Application Failure Types

Application chaos targets the application layer � services, dependencies, business logic, and configuration.

### Service Crash

**Purpose**: Test application crash recovery, graceful shutdown, state persistence, and startup behavior.

**Implementation**:
```python
class ServiceCrashExperiment:
    def __init__(self, service_name, namespace, replicas_to_kill=1):
        self.service_name = service_name
        self.namespace = namespace
        self.replicas_to_kill = replicas_to_kill

    def execute(self):
        """Crash the target service replicas."""
        api = kubernetes.client.CoreV1Api()
        pods = api.list_namespaced_pod(namespace=self.namespace, label_selector=f"app={self.service_name}")
        target_pods = pods.items[:self.replicas_to_kill]
        for pod in target_pods:
            print(f"Killing pod: {pod.metadata.name}")
            api.delete_namespaced_pod(name=pod.metadata.name, namespace=self.namespace, grace_period_seconds=0)
        return [pod.metadata.name for pod in target_pods]

    def verify_recovery(self, expected_replicas, timeout=120):
        """Verify that pods recover correctly."""
        api = kubernetes.client.CoreV1Api()
        start = time.time()
        while time.time() - start < timeout:
            pods = api.list_namespaced_pod(namespace=self.namespace, label_selector=f"app={self.service_name}")
            ready_pods = [p for p in pods.items if p.status.phase == "Running" and all(cs.ready for cs in p.status.container_statuses or [])]
            if len(ready_pods) >= expected_replicas:
                return {"status": "recovered", "ready": len(ready_pods), "time": time.time() - start}
            time.sleep(5)
        return {"status": "timeout", "ready": len(ready_pods), "time": timeout}
```

### Dependency Failure

**Purpose**: Test behavior when critical dependencies (databases, caches, message queues, external APIs) become unavailable.

**Dependency Failure Matrix**:
```yaml
dependencies:
  - name: mysql-primary
    failure_modes:
      - "connection_refused"
      - "query_timeout"
      - "replication_lag"
      - "connection_limit"
    expected_behavior:
      - "Application uses read replica for reads"
      - "Write operations are queued or gracefully failed"
      - "Circuit breaker opens for write operations"
      - "User sees degraded mode messaging"

  - name: redis-cache
    failure_modes:
      - "connection_refused"
      - "slow_response"
      - "data_corruption"
      - "memory_full"
    expected_behavior:
      - "Application falls back to database queries"
      - "Latency increases but service remains available"
      - "Cache miss ratio increases predictably"

  - name: kafka-message-queue
    failure_modes:
      - "broker_unavailable"
      - "topic_not_found"
      - "producer_timeout"
      - "consumer_lag"
    expected_behavior:
      - "Producers buffer messages locally"
      - "Consumers pause and resume on recovery"
      - "No message loss within buffer limits"

  - name: external-payment-gateway
    failure_modes:
      - "http_500"
      - "timeout"
      - "rate_limit"
      - "invalid_response"
    expected_behavior:
      - "Retry with exponential backoff"
      - "Payment queue grows but orders not lost"
      - "User notified of payment delay"
      - "Alternate payment method offered"
```

### Database Connection Pool Exhaustion

**Purpose**: Test application behavior when database connection pools are exhausted.

**Experiment Design**:
```yaml
experiment:
  name: db-connection-pool-exhaustion
  hypothesis: |
    When MySQL connection pool is reduced to 5 connections:
    - p99 query latency increases by less than 1000ms
    - Application returns 503 after 30s of pool exhaustion
    - No data corruption occurs
    - Circuit breaker opens after 50 consecutive failures
  experiment_parameters:
    target: mysql-primary
    original_pool_size: 100
    reduced_pool_size: 5
    pool_exhaustion_strategy:
      - "Open 50 idle connections"
      - "Set max_connections = 5"
      - "Execute slow queries to hold connections"
    duration_minutes: 10
  rollback:
    - "Kill slow queries"
    - "Restore max_connections to 100"
    - "Verify connection count normalizes"
```

### Cache Failure (Redis/Memcached)

**Purpose**: Test cache failure scenarios: cache down, slow cache, cache data inconsistency.

```yaml
experiment:
  name: redis-cache-failure
  hypothesis: |
    When Redis cache becomes unavailable:
    - Application falls back to database reads within 100ms
    - p95 latency increases by less than 500ms
    - Error rate remains below 1%
    - Cache hit ratio drops to 0% immediately
    - Cache hit ratio returns to baseline within 5 minutes of recovery
  experiment_parameters:
    target: redis-cluster
    failure_mode: connection_refused
    duration_minutes: 5
    expected_cache_hit_baseline: 0.95
    expected_cache_hit_during_failure: 0.0
    expected_cache_hit_post_recovery: 0.90
```

**Application-Level Cache Resilience**:
```python
class CacheClient:
    def __init__(self, redis_client, db_client, fallback_ttl=300):
        self.redis = redis_client
        self.db = db_client
        self.fallback_ttl = fallback_ttl
        self.cache_hits = 0
        self.cache_misses = 0
        self.fallback_reads = 0

    def get(self, key, query_func):
        try:
            value = self.redis.get(key)
            if value is not None:
                self.cache_hits += 1
                return value
        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.warning(f"Cache unavailable: {e}")
            self.fallback_reads += 1

        self.cache_misses += 1
        value = query_func()
        try:
            self.redis.setex(key, self.fallback_ttl, value)
        except Exception as e:
            logger.warning(f"Cache set failed: {e}")
        return value

    def cache_hit_ratio(self):
        total = self.cache_hits + self.cache_misses
        return self.cache_hits / total if total > 0 else 0.0
```

### Message Queue Failure (Kafka/RabbitMQ/SQS)

**Purpose**: Test message queue failure scenarios: broker down, topic deleted, producer/consumer failures.

```yaml
experiment:
  name: kafka-broker-failure
  hypothesis: |
    When 1 of 3 Kafka brokers fails:
    - Producers continue producing with leader re-election
    - Message production latency increases by less than 500ms during re-election
    - No messages are lost
    - Consumers rebalance within 30 seconds
  experiment_parameters:
    target: kafka-cluster
    failure_mode: broker_shutdown
    brokers: 3
    brokers_to_kill: 1
    topic: orders
    partitions: 6
    replication_factor: 3
    min_insync_replicas: 2
```

### Configuration Failure

**Purpose**: Test application behavior when configuration is corrupted, missing, or invalid.

**Types of Configuration Failures**:
1. Missing configuration file: Application fails to start
2. Invalid configuration values: Application falls back to defaults
3. Configuration drift: Configuration varies across instances
4. Secret rotation failure: Application cannot access secrets
5. Feature flag corruption: Wrong code path executed

**Experiment**:
```python
class ConfigFailureExperiment:
    def __init__(self, namespace, config_type="configmap"):
        self.namespace = namespace
        self.api = kubernetes.client.CoreV1Api()

    def corrupt_configmap(self, configmap_name, data_key, corrupted_value):
        """Corrupt a specific configuration value in a ConfigMap."""
        configmap = self.api.read_namespaced_config_map(configmap_name, self.namespace)
        self.original_value = configmap.data.get(data_key) if configmap.data else None
        if corrupted_value is None:
            if configmap.data and data_key in configmap.data:
                del configmap.data[data_key]
        else:
            if configmap.data is None:
                configmap.data = {}
            configmap.data[data_key] = corrupted_value
        self.api.patch_namespaced_config_map(configmap_name, self.namespace, configmap)

    def restore_configmap(self, configmap_name, data_key):
        """Restore original configuration."""
        configmap = self.api.read_namespaced_config_map(configmap_name, self.namespace)
        if self.original_value is not None:
            if configmap.data is None:
                configmap.data = {}
            configmap.data[data_key] = self.original_value
        else:
            if configmap.data and data_key in configmap.data:
                del configmap.data[data_key]
        self.api.patch_namespaced_config_map(configmap_name, self.namespace, configmap)
```

---

## P8 Database Chaos

### Database Failure Taxonomy

```
Database Chaos
+-- Connection Chaos
|   +-- Connection Pool Exhaustion
|   +-- Connection Timeout
|   +-- Connection Refused
|   +-- Max Connections Reached
+-- Query Chaos
|   +-- Slow Query Injection
|   +-- Query Timeout
|   +-- Deadlock Injection
|   +-- Full Table Scan Trigger
|   +-- Index Corruption
+-- Replication Chaos
|   +-- Replication Lag
|   +-- Replication Stop
|   +-- Replication Conflict
|   +-- Split-Brain Scenario
+-- Storage Chaos
|   +-- Disk Full
|   +-- Disk I/O Throttling
|   +-- Data Corruption
|   +-- Tablespace Exhaustion
+-- Availability Chaos
|   +-- Primary Failover
|   +-- Read Replica Failure
|   +-- AZ Outage Database
|   +-- Region Outage Database
+-- Configuration Chaos
    +-- Parameter Change
    +-- Schema Migration Failure
    +-- Index Drop
    +-- Permission Revocation
```

### Connection Pool Exhaustion (Database)

```python
class DatabaseConnectionPoolExperiment:
    def __init__(self, db_config, experiment_config):
        self.db_config = db_config
        self.config = experiment_config

    def execute_reduction(self):
        conn = pymysql.connect(**self.db_config)
        with conn.cursor() as cursor:
            cursor.execute("SELECT @@max_connections")
            self.original_max = cursor.fetchone()[0]
            cursor.execute(f"SET GLOBAL max_connections = {self.config['reduced_pool_size']}")
        self.held_connections = []
        for i in range(self.config["reduced_pool_size"] + 2):
            try:
                c = pymysql.connect(**self.db_config)
                self.held_connections.append(c)
            except Exception as e:
                print(f"Pool filled after {i} connections: {e}")
                break
        return {"max_connections": self.config["reduced_pool_size"], "connections_held": len(self.held_connections)}

    def restore(self):
        conn = pymysql.connect(**self.db_config)
        with conn.cursor() as cursor:
            cursor.execute(f"SET GLOBAL max_connections = {self.original_max}")
        for c in self.held_connections:
            try: c.close()
            except: pass
        self.held_connections = []
        conn.close()
```

### Query Timeout Injection

**Purpose**: Test application behavior when database queries take longer than expected.

```yaml
experiment:
  name: mysql-slow-query-injection
  hypothesis: |
    When 25% of database queries are delayed by 5 seconds:
    - Application p99 latency increases from 200ms to 5500ms
    - Connection pool grows to 80% utilization
    - Circuit breaker opens for write operations after 30 failures
    - Read-only API continues serving from cache
    - Write API returns 503 after circuit breaker opens
```

### Replication Lag

**Purpose**: Test application behavior with stale reads, replication delay, and eventual consistency.

```yaml
experiment:
  name: mysql-replication-lag
  hypothesis: |
    When MySQL replication lag reaches 30 minutes:
    - Read replicas serve data that is up to 30 minutes stale
    - Application read-after-write consistency is maintained via
      session-based read-write splitting
    - Reporting queries on replicas show inconsistent data
    - No data loss when replication catches up
  experiment_parameters:
    target: mysql-replica
    lag_target_seconds: 1800
    lag_injection_method: "stop_replica_sql_thread"
    duration_minutes: 15
```

**Implementation**:
```python
class ReplicationLagExperiment:
    def __init__(self, primary_config, replica_config):
        self.primary = primary_config
        self.replica = replica_config

    def inject_lag(self, lag_seconds=300):
        conn = pymysql.connect(**self.replica)
        with conn.cursor() as cursor:
            cursor.execute("SHOW SLAVE STATUS")
            slave_status = cursor.fetchone()
            self.initial_seconds_behind = slave_status["Seconds_Behind_Master"]
            cursor.execute("STOP SLAVE SQL_THREAD")
        conn.close()

    def restore(self):
        conn = pymysql.connect(**self.replica)
        with conn.cursor() as cursor:
            cursor.execute("START SLAVE SQL_THREAD")
        conn.close()
```

### Database Failover

**Purpose**: Test automated failover behavior, connection handling during failover, and application recovery.

```yaml
experiment:
  name: mysql-autofailover
  hypothesis: |
    When the MySQL primary fails:
    - Automated failover promotes replica within 30 seconds
    - Application detects primary change within 10 seconds
    - Write operations experience up to 30 seconds of unavailability
    - Read operations continue uninterrupted via replicas
    - No data loss (all committed transactions are preserved)
    - Application recovers fully within 60 seconds of failover
  experiment_parameters:
    failover_type: "primary_crash"
    replication_type: "semi-sync"
    orchestrator: "orchestrator"
    expected_failover_time_seconds: 30
    expected_app_detection_time_seconds: 10
    expected_write_unavailability_seconds: 30
```

**Failover Experiment Implementation**:
```python
class DatabaseFailoverExperiment:
    def __init__(self, primary_host, orchestrator_url=None):
        self.primary_host = primary_host
        self.orchestrator = orchestrator_url
        self.client = httpx.Client(timeout=30)

    def trigger_failover(self):
        if self.orchestrator:
            response = self.client.post(f"{self.orchestrator}/api/graceful-master-takeover", json={"host": self.primary_host})
            return response.json()
        else:
            import paramiko
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(self.primary_host, username="admin")
            ssh.exec_command("systemctl stop mysql")
            ssh.close()
            return {"method": "direct_ssh", "primary": self.primary_host}

    def measure_failover_impact(self, test_url, duration_seconds=120):
        results = {"error_count": 0, "success_count": 0, "total_duration": 0}
        start_time = time.time()
        while time.time() - start_time < duration_seconds:
            try:
                response = self.client.get(test_url, timeout=5)
                if response.status_code >= 500:
                    results["error_count"] += 1
                else:
                    results["success_count"] += 1
            except Exception:
                results["error_count"] += 1
            time.sleep(1)
        return results
```

### Data Corruption

**Purpose**: Test backup and recovery procedures, data integrity checks, and application behavior when data is corrupted.

```python
class DataCorruptionExperiment:
    def __init__(self, table_config):
        self.table = table_config

    def corrupt_table_data(self, corruption_type="random_update"):
        conn = pymysql.connect(**self.table["connection"])
        with conn.cursor() as cursor:
            if corruption_type == "random_update":
                cursor.execute(f"UPDATE {self.table['name']} SET {self.table['corrupt_column']} = CONCAT('CORRUPTED_', {self.table['corrupt_column']}) WHERE id % 10 = 0")
            elif corruption_type == "nullify_column":
                cursor.execute(f"UPDATE {self.table['name']} SET {self.table['corrupt_column']} = NULL WHERE id % 5 = 0")
            elif corruption_type == "delete_rows":
                cursor.execute(f"DELETE FROM {self.table['name']} WHERE id % 20 = 0")
            conn.commit()

    def restore_from_backup(self, backup_path):
        import subprocess
        subprocess.run(["mysql", "-h", self.table["connection"]["host"], "-u", self.table["connection"]["user"], f"-p{self.table['connection']['password']}", self.table["database"], "-e", f"SOURCE {backup_path}/{self.table['name']}.sql"])
```

### Database Schema Migration Failure

**Purpose**: Test the resilience of schema migration processes and application compatibility.

```yaml
experiment:
  name: schema-migration-failure
  hypothesis: |
    When a database migration fails midway:
    - Migration tool rolls back the failed migration
    - Application continues using the previous schema version
    - No data is lost from partial migration
    - Alerting fires for failed migration
  experiment_parameters:
    migration_tool: "Flyway"
    failure_type: "statement_timeout"
    timeout_seconds: 5
  scenarios:
    - "Migrate: Add column with default that takes too long"
    - "Migrate: Add index on large table with timeout"
    - "Migrate: Modify column type with incompatible data"
    - "Migrate: Remove column that application still uses"
```

---

## P9 Network Chaos

### Network Failure Taxonomy

```
Network Chaos
+-- Latency
|   +-- Service-to-Service Latency
|   +-- Database Connection Latency
|   +-- External API Latency
|   +-- CDN/DNS Resolution Latency
+-- Packet Loss
|   +-- Random Packet Loss
|   +-- Burst Packet Loss
|   +-- Correlated Packet Loss
+-- Bandwidth Restriction
|   +-- Throttled Bandwidth
|   +-- Shaped Traffic
|   +-- QoS Dropping
+-- DNS Failures
|   +-- DNS Resolution Failure
|   +-- Slow DNS Resolution
|   +-- Wrong DNS Response
|   +-- DNS Poisoning
+-- TLS/SSL Failures
|   +-- Certificate Expired
|   +-- Certificate Wrong Host
|   +-- Untrusted CA
|   +-- TLS Version Mismatch
|   +-- Cipher Suite Mismatch
+-- Load Balancer Failures
|   +-- ALB/NLB Failure
|   +-- Backend Deregistration
|   +-- Sticky Session Failure
|   +-- Health Check Failure
+-- Proxy Failures
    +-- Reverse Proxy Down
    +-- Proxy Latency
    +-- Proxy Connection Limit
    +-- Proxy Configuration Error
```

### Service-to-Service Latency

**Purpose**: Test inter-service communication resilience under network degradation.

```yaml
experiment:
  name: service-mesh-latency
  hypothesis: |
    When 500ms latency is introduced between payment-service and
    checkout-service via Istio service mesh:
    - Circuit breaker opens after 5 consecutive timeouts
    - Checkout p99 latency increases by less than 600ms
    - Retry mechanism triggers with exponential backoff
    - Circuit breaker metrics show opened state
    - Degraded functionality (payment page shows retry message)
  experiment_parameters:
    source_service: checkout-service
    destination_service: payment-service
    protocol: http
    latency_ms: 500
    jitter_ms: 100
    correlation: 50
    duration_seconds: 180
    istio_virtual_service: |
      apiVersion: networking.istio.io/v1beta1
      kind: VirtualService
      metadata:
        name: payment-service-inject
      spec:
        hosts:
          - payment-service
        http:
          - fault:
              delay:
                percentage:
                  value: 100
                fixedDelay: 500ms
            route:
              - destination:
                  host: payment-service
```

**Envoy/Service Mesh Fault Injection**:
```yaml
http_filters:
  - name: envoy.fault
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.filters.http.fault.v3.HTTPFault
      delay:
        percentage:
          numerator: 50
          denominator: HUNDRED
        fixed_delay: 3s
      abort:
        percentage:
          numerator: 10
          denominator: HUNDRED
        http_status: 503
```

**Application-Level Circuit Breaker**:
```python
import pybreaker
import httpx

class PaymentServiceClient:
    def __init__(self):
        self.breaker = pybreaker.CircuitBreaker(fail_max=5, reset_timeout=30)
        self.client = httpx.AsyncClient(timeout=5.0)

    @pybreaker.circuit_breaker
    async def process_payment(self, payment_request):
        try:
            response = await self.client.post("http://payment-service/api/process", json=payment_request)
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException:
            logger.warning("Payment service timeout")
            raise
        except httpx.ConnectError:
            logger.error("Payment service connection failed")
            raise

    async def get_health(self):
        return {
            "circuit_breaker_state": self.breaker.state,
            "failure_count": self.breaker.failure_count,
        }
```

### DNS Failure Simulation

**Purpose**: Test DNS resolution failure handling, DNS caching, and fallback mechanisms.

```yaml
experiment:
  name: dns-resolution-failure
  hypothesis: |
    When DNS resolution for payment-service.internal fails:
    - Application returns cached DNS records (TTL=60s)
    - After TTL expiry, connections fail with DNS resolution error
    - Application retries DNS resolution every 5 seconds
    - Circuit breaker opens after 10 consecutive failures
    - Service degradation message shown to user
  experiment_parameters:
    dns_target: payment-service.internal
    failure_type: "nxdomain"
    duration_seconds: 120
    dns_ttl_seconds: 60
```

**Application DNS Caching Configuration**:
```python
import dns.resolver
import threading
import time

class ResilientDNSResolver:
    def __init__(self, cache_ttl=60, retry_interval=5):
        self.cache = {}
        self.cache_ttl = cache_ttl
        self.resolver = dns.resolver.Resolver()
        self.resolver.timeout = 2
        self.resolver.lifetime = 4
        self._lock = threading.Lock()

    def resolve(self, hostname):
        now = time.time()
        with self._lock:
            if hostname in self.cache:
                cached_ip, cached_time = self.cache[hostname]
                if now - cached_time < self.cache_ttl:
                    return cached_ip
        try:
            answers = self.resolver.resolve(hostname, "A")
            ip = str(answers[0])
            with self._lock:
                self.cache[hostname] = (ip, now)
            return ip
        except (dns.resolver.NXDOMAIN, dns.resolver.Timeout, dns.resolver.NoNameservers) as e:
            with self._lock:
                if hostname in self.cache:
                    cached_ip, _ = self.cache[hostname]
                    logger.warning(f"DNS resolution failed for {hostname}, using stale cache: {cached_ip}")
                    return cached_ip
            raise
```

### TLS/SSL Failure

**Purpose**: Test TLS certificate validation, expiry handling, and mTLS resilience.

```yaml
experiment:
  name: tls-certificate-expiry
  hypothesis: |
    When the payment-service TLS certificate expires:
    - Clients receive TLS handshake errors
    - Applications with certificate pinning reject the connection immediately
    - Applications without pinning proceed with warning
    - mTLS connections fail between services
    - Certificate renewal automation fires (cert-manager)
  experiment_parameters:
    target: payment-service
    certificate_type: "server"
    expiry_scenario: "expired_certificate"
    auto_renewal_enabled: true
    cert_manager_issuer: "letsencrypt-prod"
```

### Load Balancer Failure

**Purpose**: Test load balancer health check behavior, connection draining, and backend registration/deregistration.

```yaml
experiment:
  name: load-balancer-health-check-failure
  hypothesis: |
    When 50% of payment-service instances fail health checks:
    - Load balancer deregisters unhealthy instances within 30 seconds
    - Traffic shifts to healthy instances
    - Healthy instance CPU utilization increases by less than 50%
    - No increase in error rate for healthy instances
    - Connection draining completes within 60 seconds
  experiment_parameters:
    load_balancer_arn: "arn:aws:elasticloadbalancing:..."
    unhealthy_percentage: 50
    health_check_path: "/health"
    health_check_interval_seconds: 10
    unhealthy_threshold: 3
    connection_draining_timeout_seconds: 60
```

---

## P10 Resilience Testing Patterns

### Pattern Catalog

Resilience patterns are reusable solutions to common failure scenarios. This section catalogs patterns with experiment templates.

### Pattern 1: Circuit Breaker Testing

**Purpose**: Verify that circuit breakers open, stay open, and close correctly under failure conditions.

**Hypothesis Template**:
```
When [service] fails with [failure_type]:
  1. Circuit breaker opens after [failure_count] consecutive failures
  2. While open, calls fail fast with [expected_response]
  3. After [reset_timeout], a single test call is allowed (half-open)
  4. If test call succeeds, circuit closes
  5. If test call fails, circuit remains open for another [reset_timeout]
```

**Experiment Template**:
```yaml
experiment:
  pattern: circuit_breaker_test
  target: checkout-service -> payment-service
  steps:
    - name: establish_baseline
      description: "Verify circuit is closed under normal conditions"
      actions:
        - "Send 50 successful requests to payment-service"
      verification:
        - "All requests succeed with less than 200ms latency"
        - "Circuit breaker state: CLOSED"
    - name: inject_failure
      description: "Inject latency to trigger circuit breaker"
      actions:
        - "Inject 10s latency on payment-service"
      duration: "30s"
    - name: verify_open
      description: "Verify circuit breaker opens"
      actions:
        - "Send 100 requests to payment-service via checkout"
      verification:
        - "First 5 requests timeout (circuit still learning)"
        - "Requests 6+ return immediately with fallback response"
        - "Circuit breaker state: OPEN"
        - "Failure count: >= 5"
    - name: verify_half_open
      description: "Verify half-open state after reset timeout"
      actions:
        - "Remove latency injection"
        - "Wait for reset_timeout (30s)"
        - "Send 3 requests"
      verification:
        - "First request probes service (half-open)"
        - "If first succeeds, circuit closes"
        - "Next 2 requests succeed normally"
    - name: verify_close
      description: "Verify circuit returns to closed state"
      actions:
        - "Send 50 requests"
      verification:
        - "All requests succeed"
        - "Circuit breaker state: CLOSED"
        - "Latency back to baseline"
```

**Implementation (Resilience4j)**:
```java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .permittedNumberOfCallsInHalfOpenState(3)
    .slidingWindowSize(10)
    .minimumNumberOfCalls(5)
    .recordExceptions(IOException.class, TimeoutException.class)
    .build();

CircuitBreaker circuitBreaker = CircuitBreaker.of("paymentService", config);

Supplier<String> decorated = CircuitBreaker.decorateSupplier(
    circuitBreaker,
    () -> paymentService.processPayment(request)
);

Supplier<String> withFallback = Decorators.ofSupplier(decorated)
    .withFallback(throwable -> {
        log.warn("Payment service failed, using fallback", throwable);
        return "PAYMENT_DELAYED";
    })
    .get();
```

### Pattern 2: Retry Storm Testing

**Purpose**: Verify that retry logic does not create a retry storm that overwhelms downstream services.

**Hypothesis Template**:
```
When [service] returns [error_type]:
  1. Client retries with [backoff_strategy] up to [max_retries] times
  2. Maximum retry rate is [rate] requests/second
  3. Downstream service does not exceed [threshold] requests/second
  4. Retry queue drains within [duration] after service recovers
```

**Experiment**:
```yaml
experiment:
  pattern: retry_storm_test
  target: checkout-service -> payment-service
  configuration:
    client_retry_config:
      max_retries: 3
      backoff_type: exponential
      initial_delay_ms: 100
      multiplier: 2
      max_delay_ms: 2000
      jitter: true
    service_config:
      instances: 3
      timeout_ms: 2000
      rate_limit_rps: 100
  steps:
    - name: calculate_baseline_rps
      description: "Establish baseline request rate"
      actions:
        - "Measure payment-service request rate: 50 rps"
    - name: inject_partial_failure
      description: "Make 30% of payment requests fail with 503"
      duration: "60s"
    - name: measure_retry_rate
      description: "Measure retry request volume"
      verification:
        - "Effective rps = baseline * (1 + (failure_rate * retries))"
        - "Expected: 50 * (1 + (0.3 * 3)) = 95 rps"
        - "Actual rps less than 100 (within capacity)"
        - "Error rate in checkout: less than 5%"
    - name: inject_full_failure
      description: "Make 100% of payment requests fail"
      duration: "30s"
    - name: measure_retry_storm_impact
      description: "Measure retry storm impact on payment-service"
      verification:
        - "Payment-service request rate: baseline * (1 + (1.0 * 3)) = 200 rps"
        - "If 200 rps exceeds capacity, payment-service becomes completely overloaded"
        - "Cascading failures to other services using payment-service"
        - "Circuit breaker should open to stop the retry storm"
```

### Pattern 3: Load Shedding Testing

**Purpose**: Verify that services shed load gracefully under extreme traffic conditions.

**Hypothesis Template**:
```
When request rate exceeds [threshold] rps:
  1. Service returns 429 (Too Many Requests) for excess requests
  2. P99 latency for served requests remains below [limit]
  3. Service CPU utilization stays below [limit]
  4. Error rate for accepted requests remains below [limit]
  5. Load shedding is fair across clients
```

**Experiment**:
```yaml
experiment:
  pattern: load_shedding_test
  target: payment-service
  configuration:
    normal_capacity: 500 rps
    load_shedding_threshold: 600 rps
    offered_load: 1000 rps
    duration: "120s"
  expected_behavior:
    - "Approximately 400 requests/second are rejected with 429"
    - "Accepted requests see p99 latency less than 500ms"
    - "CPU utilization stays below 80%"
    - "No cascading failures to downstream services"
```

**Load Shedding Implementation**:
```python
import time
import threading
from collections import deque

class LoadShedder:
    def __init__(self, max_rps=600, window_size_ms=1000):
        self.max_rps = max_rps
        self.window_size_ms = window_size_ms
        self.request_times = deque()
        self._lock = threading.Lock()

    def should_accept(self) -> bool:
        now = time.time() * 1000
        window_start = now - self.window_size_ms
        with self._lock:
            while self.request_times and self.request_times[0] < window_start:
                self.request_times.popleft()
            current_rps = len(self.request_times)
            if current_rps >= self.max_rps:
                return False
            self.request_times.append(now)
            return True

    def get_current_rps(self) -> int:
        now = time.time() * 1000
        window_start = now - self.window_size_ms
        with self._lock:
            while self.request_times and self.request_times[0] < window_start:
                self.request_times.popleft()
            return len(self.request_times)

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()
load_shedder = LoadShedder(max_rps=600)

@app.middleware("http")
async def load_shedding_middleware(request: Request, call_next):
    if not load_shedder.should_accept():
        return JSONResponse(
            status_code=429,
            content={"error": "too_many_requests", "message": "Server at capacity. Retry later.", "retry_after_ms": 1000}
        )
    try:
        return await call_next(request)
    except Exception:
        return JSONResponse(status_code=500, content={"error": "internal_error"})
```

### Pattern 4: Graceful Degradation Testing

**Purpose**: Verify that services degrade gracefully when non-critical dependencies fail.

**Hypothesis Template**:
```
When [non-critical dependency] fails:
  1. Core functionality continues with [degraded experience]
  2. Non-critical features return [fallback response]
  3. Error rate for critical paths remains below [limit]
  4. Latency increase for critical paths is less than [limit]
  5. Users receive clear messaging about degraded state
```

**Experiment**:
```yaml
experiment:
  pattern: graceful_degradation_test
  target: checkout-service
  dependencies:
    critical:
      - payment-service
      - cart-service
    non_critical:
      - recommendation-service
      - review-service
      - analytics-service
  scenarios:
    - name: recommendation_failure
      dependency: recommendation-service
      failure_mode: timeout
      expected_degradation:
        - "Product page shows without recommendations"
        - "Search and purchase flows unaffected"
        - "Latency increase less than 50ms"
    - name: review_failure
      dependency: review-service
      failure_mode: 500_error
      expected_degradation:
        - "Product page shows reviews as currently unavailable"
        - "Write review feature disabled with message"
        - "No impact on checkout flow"
    - name: analytics_failure
      dependency: analytics-service
      failure_mode: connection_refused
      expected_degradation:
        - "User-facing features unaffected"
        - "Analytics data buffered locally"
        - "No visible impact to users"
```

### Pattern 5: Timeout Configuration Testing

**Purpose**: Verify that timeouts are correctly configured and do not cause cascading failures.

**Hypothesis Template**:
```
When [downstream service] responds in [duration]:
  1. Client timeout fires after [configured_timeout]
  2. Client returns [expected_response] on timeout
  3. Thread/connection pool is not exhausted
  4. Downstream service is not overwhelmed with persistent connections
```

**Timeout Chain Analysis**:
```
External Request -> API Gateway (30s) -> Service A (25s) -> Service B (20s) -> Database (15s)

Each timeout should be shorter than its caller timeout to avoid masking failures.
Correct:    30s > 25s > 20s > 15s  (timeout hierarchy maintained)
Incorrect:  30s > 25s > 30s > 15s  (Service B timeout exceeds Service A)
```

### Pattern 6: Bulkhead Testing

**Purpose**: Verify that bulkhead patterns isolate failures to specific components.

**Hypothesis Template**:
```
When [component] fails:
  1. Other components in separate bulkheads are unaffected
  2. Bulkhead for failed component fills up and rejects requests
  3. Available bulkhead slots continue processing normally
  4. No cross-bulkhead resource contention occurs
```

**Implementation**:
```python
from concurrent.futures import ThreadPoolExecutor
import threading

class Bulkhead:
    def __init__(self, max_concurrent=10, max_queue=20):
        self.semaphore = threading.Semaphore(max_concurrent)
        self.queue = threading.Queue(maxsize=max_queue)
        self.max_concurrent = max_concurrent

    def acquire(self, timeout=5.0):
        return self.semaphore.acquire(timeout=timeout)

    def release(self):
        self.semaphore.release()

class BulkheadRegistry:
    def __init__(self):
        self.bulkheads = {}

    def register(self, name, max_concurrent=10, max_queue=20):
        self.bulkheads[name] = Bulkhead(max_concurrent, max_queue)

    def get(self, name):
        return self.bulkheads.get(name)

# Usage
bulkheads = BulkheadRegistry()
bulkheads.register("payment-service", max_concurrent=5, max_queue=10)
bulkheads.register("inventory-service", max_concurrent=20, max_queue=50)
bulkheads.register("email-service", max_concurrent=2, max_queue=5)
```

### Pattern 7: Health Check Testing

**Purpose**: Verify that health checks accurately reflect service health and load balancers respond correctly.

**Hypothesis Template**:
```
When [service] becomes unhealthy:
  1. Health check endpoint returns non-200 status
  2. Load balancer deregisters instance within [duration]
  3. No traffic is sent to unhealthy instance after deregistration
  4. Instance is re-registered when health checks pass again
```

**Health Check Experiment**:
```yaml
experiment:
  pattern: health_check_test
  steps:
    - name: verify_healthy_baseline
      actions:
        - "Check /health endpoint returns 200"
        - "Verify load balancer has all instances in service"
    - name: trigger_unhealthy_state
      actions:
        - "Kill application process"
        - "Verify /health returns 503"
    - name: verify_deregistration
      actions:
        - "Wait for health check interval * unhealthy threshold"
        - "Verify instance deregistered from load balancer"
    - name: verify_recovery
      actions:
        - "Restart application"
        - "Verify /health returns 200"
        - "Verify instance re-registered with load balancer"
```

---

## P11 Observability for Chaos Experiments

### Why Observability Matters for Chaos

Without proper observability, chaos experiments are dangerous. You cannot know if your hypothesis is correct, if the blast radius is contained, or if the system has returned to steady state. Observability provides the feedback loop that makes chaos engineering scientific and safe.

### Experiment Telemetry

Every chaos experiment should emit telemetry across four pillars:

1.  **Metrics**: Quantitative measurements of system state
2.  **Logs**: Detailed event records with experiment context
3.  **Traces**: End-to-end request flow visualization
4.  **Alerts**: Notifications when experiment boundaries are exceeded

### Metrics for Chaos Experiments

**Experiment-Specific Metrics**:
```
# Experiment metadata
chaos_experiment_status{experiment_id="...", name="..."} = 1 (running) / 0 (completed)
chaos_experiment_duration_seconds{experiment_id="..."}
chaos_experiment_blast_radius_percentage{experiment_id="..."}
chaos_experiment_rollback_triggered{experiment_id="..."} = 0/1

# Failure injection metrics
chaos_failure_injection_active{type="latency", target="payment-service"} = 1
chaos_failure_injection_duration_seconds{type="latency", target="payment-service"}

# Steady state metrics
chaos_steady_state_deviation{metric="checkout_p99_latency", experiment_id="..."}
chaos_hypothesis_status{experiment_id="..."} = 0 (rejected) / 1 (accepted)
```

**Prometheus Recording Rules**:
```yaml
groups:
  - name: chaos_experiments
    rules:
      - record: chaos:experiment_active
        expr: max(chaos_experiment_status) by (experiment_id)

      - record: chaos:blast_radius_current
        expr: max(chaos_experiment_blast_radius_percentage) by (experiment_id)

      - record: chaos:steady_state_violation
        expr: abs(chaos_steady_state_deviation) > bool 0.1
```

### Dashboards for Chaos Experiments

**Real-Time Experiment Dashboard**:
```
+------------------------------------------------------------------+
| Chaos Experiment: payment-service-network-latency (ID: 042)      |
+------------------------------------------------------------------+
| Status: RUNNING | Duration: 45s/120s | Blast Radius: 8%/10%     |
+------------------------------------------------------------------+
| +----------------------+  +----------------------+               |
| | p99 Latency (ms)     |  | Error Rate (%)       |               |
| | Current: 1850        |  | Current: 12.5        |               |
| | Baseline: 250        |  | Baseline: 0.3        |               |
| | Threshold: 2000      |  | Threshold: 5.0       |               |
| | [=========________]  |  | [=============___]   |               |
| +----------------------+  +----------------------+               |
| +----------------------+  +----------------------+               |
| | Circuit Breaker      |  | Pod Status           |               |
| | checkout->payment    |  | payment-0: KILLED    |               |
| | State: OPEN          |  | payment-1: LATENCY   |               |
| | Failures: 12         |  | payment-2: HEALTHY   |               |
| |                      |  | payment-3: HEALTHY   |               |
| +----------------------+  +----------------------+               |
| Timeline:                                                        |
| 0s:  Injection started                                            |
| 12s: Timeouts began                                              |
| 25s: Circuit breaker OPENED                                      |
| 35s: Rollback triggered                                           |
+------------------------------------------------------------------+
```

**Grafana Dashboard JSON** (partial):
```json
{
  "dashboard": {
    "title": "Chaos Experiment - {{experiment_id}}",
    "panels": [
      {
        "title": "Latency Deviation",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[$__rate_interval]))",
            "legendFormat": "p99 - {{service}}"
          },
          {
            "expr": "chaos_steady_state_deviation{metric=\"p99_latency\"}",
            "legendFormat": "Deviation from baseline"
          }
        ]
      },
      {
        "title": "Blast Radius",
        "type": "gauge",
        "targets": [
          {
            "expr": "chaos:blast_radius_current"
          }
        ],
        "thresholds": [
          { "value": 5, "color": "green" },
          { "value": 8, "color": "yellow" },
          { "value": 10, "color": "red" }
        ]
      }
    ]
  }
}
```

### Logging for Chaos Experiments

**Structured Logging Format**:
```json
{
  "timestamp": "2026-06-01T14:00:05.123Z",
  "level": "info",
  "experiment_id": "chaos-2026-042",
  "event": "failure_injection_started",
  "details": {
    "type": "network_latency",
    "target": "payment-service",
    "parameters": {
      "latency_ms": 200,
      "jitter_ms": 50,
      "pods_affected": 2
    }
  },
  "context": {
    "service": "chaos-engine",
    "environment": "production",
    "region": "us-east-1"
  }
}
```

**Log Analysis Queries**:
```sql
-- All experiments that caused rollback
SELECT experiment_id, reason, duration_seconds
FROM chaos_experiments
WHERE rollback_triggered = true
ORDER BY start_time DESC;

-- Average deviation by experiment type
SELECT failure_type, AVG(max_deviation_percentage) as avg_deviation
FROM chaos_metrics
WHERE experiment_time > NOW() - INTERVAL 30 DAY
GROUP BY failure_type
ORDER BY avg_deviation DESC;

-- Most common findings
SELECT finding, COUNT(*) as frequency
FROM experiment_findings
WHERE accepted = false
GROUP BY finding
ORDER BY frequency DESC;
```

### Distributed Tracing for Experiments

**Trace Context Propagation**:
```python
from opentelemetry import trace
from opentelemetry.propagate import inject

tracer = trace.get_tracer(__name__)

class ChaosAwareRequest:
    def __init__(self):
        self.experiment_id = None

    def inject_experiment_context(self, headers, experiment_id):
        """Inject experiment context into outgoing request headers."""
        headers["X-Chaos-Experiment-Id"] = experiment_id
        headers["X-Chaos-Steady-State"] = "hypothesis-042"
        inject(headers)
        return headers
```

**Span Attributes for Chaos**:
```python
with tracer.start_as_current_span("chaos_experiment") as span:
    span.set_attribute("chaos.experiment.id", "chaos-2026-042")
    span.set_attribute("chaos.experiment.name", "payment-network-latency")
    span.set_attribute("chaos.failure.type", "network_latency")
    span.set_attribute("chaos.failure.target", "payment-service")
    span.set_attribute("chaos.steady_state.metric", "checkout_p99_latency")
    span.set_attribute("chaos.steady_state.baseline_ms", 250)
    span.set_attribute("chaos.steady_state.observed_ms", 1850)
    span.set_attribute("chaos.hypothesis.accepted", False)
```

### Alerting for Chaos Experiments

**Alert Rules**:
```yaml
groups:
  - name: chaos_experiments
    interval: 10s
    rules:
      - alert: ChaosExperimentBlastRadiusExceeded
        expr: chaos:blast_radius_current > 10
        for: 10s
        labels:
          severity: critical
          channel: "#chaos-engineering"
        annotations:
          summary: "Blast radius exceeded for experiment {{ $labels.experiment_id }}"
          description: "Blast radius is {{ $value }}% (threshold: 10%)"

      - alert: ChaosExperimentSteadyStateBreached
        expr: chaos:steady_state_violation > 0
        for: 15s
        labels:
          severity: critical
        annotations:
          summary: "Steady state breached for experiment {{ $labels.experiment_id }}"
          description: "Metric {{ $labels.metric }} deviated from baseline"

      - alert: ChaosExperimentRollbackFailed
        expr: chaos_experiment_rollback_triggered{success="false"} > 0
        labels:
          severity: critical
          channel: "#incident-response"
        annotations:
          summary: "Chaos experiment rollback FAILED - manual intervention required"
```

### Blast Radius Visualization

**Visualization Techniques**:
1.  **Service Graph**: Show affected services highlighted in red/yellow/green
2.  **Traffic Flow**: Show traffic percentage affected in real-time
3.  **Geographic Map**: Show affected regions/AZs
4.  **Dependency Graph**: Show cascading impacts through service dependencies
5.  **Metric Heatmap**: Show metric deviation across all affected components

**Tools**:
- Grafana - Custom dashboards with annotations for experiment phases
- Datadog - APM map with experiment overlay
- Honeycomb - BubbleUp for experiment-specific analysis
- Jaeger/Zipkin - Trace comparison between baseline and experiment

### Post-Experiment Observability Review

```
Checklist:
  1. Were all experiment metrics collected and retained?
  2. Was the timeline accurately reconstructed?
  3. Were all affected services identified through tracing?
  4. Were abnormal logs captured and correlated?
  5. Were alerts triggered at appropriate thresholds?
  6. Is the dashboard reusable for similar experiments?
  7. Are there observability gaps that need addressing?
```

---

## P12 Chaos Engineering Maturity Model

### Overview

The Chaos Engineering Maturity Model provides a framework for assessing and advancing an organization ability to systematically validate resilience. It defines five levels of maturity, each building on the previous.

### Level 1: Ad-Hoc

**Characteristics**:
- Chaos experiments are manual, undocumented one-off events
- No repeatable process for experiment design or execution
- No tooling � everything is done via SSH and manual commands
- Results are anecdotal and not captured systematically
- High risk of real incidents during experiments
- Experiments only run when someone has free time
- No steady state definition or hypothesis formulation
- No blast radius controls or rollback procedures

**Indicators**:
- "We ran a chaos experiment once last year"
- "John knows how to use tc for network latency"
- "We just kill pods and see what happens"
- "We learn from production incidents, not experiments"

**Gap Analysis**:
- No experiment catalog or tracking
- No measurement of experiment outcomes
- No repeatability or consistency
- High variance in experiment quality
- No organizational learning from experiments

**Action Plan**:
1. Define chaos engineering roles and responsibilities
2. Select and deploy chaos engineering tooling
3. Create experiment template and process documentation
4. Train first cohort of chaos engineers
5. Run first documented experiment

### Level 2: Repeatable

**Characteristics**:
- Experiments follow a documented process
- Basic tooling is in place (LitmusChaos, Chaos Mesh)
- Experiments are designed with explicit hypotheses
- Steady state is measured with basic metrics
- Blast radius controls are documented
- Results are captured in experiment reports
- Action items are tracked
- Experiments are scheduled regularly

**Indicators**:
- "We have a chaos engineering playbook"
- "Experiments are scheduled monthly"
- "We use LitmusChaos for pod failures"
- "Experiment reports are stored in our wiki"
- "Post-experiment action items are tracked in JIRA"

**Practices**:
- Monthly scheduled experiments during low traffic
- Standard experiment template for all experiments
- Basic steady state metrics (p99 latency, error rate)
- Manual rollback with documented procedures
- Post-experiment debriefs with affected teams

**Metrics**:
- Number of experiments run per month
- Experiment completion rate
- Findings-to-action-item conversion rate
- Time to remediate findings

**Action Plan**:
1. Standardize experiment templates across all teams
2. Implement automated rollback for common experiments
3. Create experiment catalog with searchable findings
4. Establish monthly experiment schedule
5. Train additional team members in chaos engineering

### Level 3: Automated

**Characteristics**:
- Experiments are automated with safety gates
- CI/CD pipeline integration for some experiments
- Automated rollback based on metric thresholds
- Experiment telemetry is collected automatically
- Dashboards visualize experiment impact in real-time
- Blast radius limits are enforced programmatically
- Automated approval workflows for experiments

**Indicators**:
- "Experiments run automatically on a schedule"
- "Rollback happens automatically when thresholds are breached"
- "Experiment metrics feed into our observability platform"
- "We have dashboards for experiments"
- "Some experiments run as part of deployment pipeline"

**Practices**:
- Weekly automated resilience scans
- Automated rollback with Prometheus alert integration
- Experiment findings automatically filed as tickets
- Real-time experiment dashboards in Grafana
- Automated blast radius enforcement via ChaosEngine config

**Metrics**:
- Percentage of automated vs. manual experiments
- Average time from finding to ticket creation
- Rollback success rate
- False positive rate in experiment alerts
- Experiment coverage across services

**Action Plan**:
1. Automate top 10 most common experiments
2. Integrate with CI/CD for pre/post-deploy experiments
3. Implement automated rollback for all experiments
4. Build experiment dashboards in observability platform
5. Create self-service experiment catalog for teams

### Level 4: Continuous

**Characteristics**:
- Experiments run continuously in production
- Experiment selection is data-driven (based on recent changes, incidents)
- Proactive experimentation before major changes
- GameDays are fully automated with scenario injection
- Experiments are part of the deployment gating process
- Cross-team participation in experiment design and review
- Organizational resilience metrics tracked over time

**Indicators**:
- "Experiments run continuously, not on a schedule"
- "Experiment selection is driven by change risk analysis"
- "Deployments are gated by experiment results"
- "We run GameDays automatically"
- "Resilience is a key organizational metric"

**Practices**:
- Continuous canary experiments in production
- Risk-based experiment scheduling
- Automated GameDay scenario injection
- Experiment results influence deployment decisions
- Resilience scorecards for each service
- Cross-team experiment review board

**Metrics**:
- MTTR trend over time
- Number of incidents prevented by experiments
- Resilience score by service
- Experiment pass rate trend
- Time from finding to remediation
- Deployment velocity with chaos gates

**Action Plan**:
1. Implement continuous experiment scheduling
2. Build risk-based experiment selection engine
3. Create resilience scorecards for all services
4. Automate GameDay scenario generation
5. Integrate experiment results into deployment pipeline

### Level 5: Proactive

**Characteristics**:
- System automatically designs and runs experiments
- Machine learning identifies failure patterns to test
- Predictive resilience � system anticipates failure modes
- Self-healing mechanisms validated continuously
- Chaos engineering is embedded in the engineering culture
- Resilience is a first-class architectural concern
- Organization proactively identifies unknown unknowns

**Indicators**:
- "Experiments are automatically designed by the system"
- "ML models predict which failure modes to test"
- "Self-healing mechanisms are validated continuously"
- "Every service has a resilience requirement in its SLAs"
- "Chaos engineering is part of every engineer onboarding"

**Practices**:
- Automated experiment generation from architecture changes
- Predictive failure mode analysis
- Continuous validation of self-healing mechanisms
- Resilience requirements in service SLAs
- Chaos engineering embedded in all engineering roles
- Proactive resilience improvement based on experiment trends

**Metrics**:
- Percentage of failure modes predicted before incidents
- Self-healing validation coverage
- Time from architecture change to experiment design
- Unknown failure modes discovered by ML
- Cultural resilience index (survey-based)

**Action Plan**:
1. Implement ML-based failure mode prediction
2. Build automated experiment generation from change analysis
3. Create self-healing validation framework
4. Embed resilience requirements in service contracts
5. Foster organization-wide resilience culture

### Maturity Assessment Questionnaire

```yaml
assessment:
  process:
    - question: "Do you have a documented chaos engineering process?"
      levels: [1: "No", 2: "Basic documentation", 3: "Standardized template", 4: "Automated workflow", 5: "Self-optimizing"]
    - question: "How are experiments scheduled?"
      levels: [1: "Ad-hoc", 2: "Monthly", 3: "Weekly automated", 4: "Continuous", 5: "Predictive"]
    - question: "What percentage of experiments are automated?"
      levels: [1: "0%", 2: "25%", 3: "75%", 4: "95%", 5: "100% with auto-design"]
    - question: "How is rollback handled?"
      levels: [1: "Manual SSH", 2: "Documented manual", 3: "Automated with thresholds", 4: "Proactive", 5: "Self-healing integrated"]
    - question: "How are findings tracked?"
      levels: [1: "Word of mouth", 2: "Wiki pages", 3: "Ticketing system", 4: "Automated ticketing", 5: "Auto-remediation"]
  tooling:
    - question: "What chaos tools are in use?"
      levels: [1: "None", 2: "Single tool", 3: "Multiple tools with integration", 4: "Unified platform", 5: "Custom/proprietary"]
    - question: "How is observability integrated?"
      levels: [1: "None", 2: "Basic metrics", 3: "Full metrics + logs", 4: "Metrics + logs + traces", 5: "AI-driven analysis"]
  culture:
    - question: "How does the organization view experiments?"
      levels: [1: "Skeptical", 2: "Tolerant", 3: "Supportive", 4: "Enthusiastic", 5: "Embedded"]
    - question: "How are experiment failures treated?"
      levels: [1: "Blamed", 2: "Tolerated", 3: "Learned from", 4: "Celebrated", 5: "Proactively sought"]
```

---

## P13 Chaos Engineering in CI/CD

### Why CI/CD Integration Matters

Integrating chaos experiments into CI/CD pipelines ensures that resilience validation happens continuously, not as a separate activity. Every deployment is validated against known failure scenarios, catching regressions before they reach production.

### Pipeline Integration Points

```
                    +-- Pre-Deploy Experiments --+
                    |                            |
                    v                            v
Code Commit -> Build -> Deploy Staging -> Deploy Prod
                              ^                    ^
                              |                    |
                    +-- Post-Deploy Exp --+   +-- Canary Exp --+
```

**Three Integration Points**:
1.  **Pre-Deploy**: Validate that changes don't break existing resilience
2.  **Post-Deploy**: Validate that deployed changes handle failures correctly
3.  **Scheduled/Continuous**: Run comprehensive experiments outside deployment cycle

### Pre-Deploy Experiments

**Purpose**: Validate that code changes do not regress existing resilience mechanisms.

**Scope**:
- Circuit breaker configuration validation
- Timeout configuration validation
- Retry logic validation
- Graceful degradation path verification
- Health check endpoint validation

**Implementation**:
```yaml
# GitHub Actions Workflow
name: Pre-Deploy Chaos Validation
on:
  pull_request:
    branches: [main]

jobs:
  chaos-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          kubectl apply -k overlays/staging/

      - name: Run pre-deploy chaos experiments
        run: |
          # Circuit breaker config validation
          litmusctl create experiment -f experiments/circuit-breaker-config.yaml

          # Timeout configuration validation
          litmusctl create experiment -f experiments/timeout-config.yaml

          # Health check validation
          curl -f http://staging-app/health

      - name: Analyze results
        run: |
          # Check if all experiments passed
          litmusctl get experiment-results --namespace litmus

      - name: Block deployment on failure
        if: failure()
        run: |
          echo "Chaos validation failed - deployment blocked"
          exit 1
```

**Gate Configuration**:
```yaml
chaos_gates:
  pre_deploy:
    required_experiments:
      - name: circuit-breaker-config-check
        description: "Verify circuit breaker timeouts are within expected range"
        failure_action: block_deployment
      - name: timeout-hierarchy-check
        description: "Verify timeout hierarchy is maintained"
        failure_action: warn_only
      - name: health-check-verification
        description: "Verify all health endpoints return 200"
        failure_action: block_deployment
    failure_action: block_deployment
```

### Post-Deploy Experiments

**Purpose**: Validate that the deployed system handles failures correctly under production-like conditions.

**Scope**:
- Canary failure injection on new instances
- Gradual traffic shift with failure injection
- New service dependency failure handling
- Configuration change validation
- Feature flag toggling under load

**Implementation**:
```yaml
# GitLab CI Job
post-deploy-chaos:
  stage: post-deploy
  script:
    - |
      # Run canary experiment on new pods only
      litmusctl create experiment -f experiments/canary-pod-failure.yaml
    - |
      # Inject latency on new service instances
      litmusctl create experiment -f experiments/latency-new-instances.yaml
    - |
      # Verify rollback capability
      litmusctl create experiment -f experiments/rollback-verification.yaml
    - |
      # Check results
      RESULT=$(litmusctl get experiment-results --namespace litmus -o json)
      if echo "$RESULT" | jq -e '.failed > 0'; then
        echo "Post-deploy chaos validation failed"
        exit 1
      fi
  only:
    - main
  when: delayed
  start_in: 5 minutes
```

### Scheduled Experiments

**Purpose**: Run comprehensive experiments on a regular cadence to catch issues that emerge over time.

**Scope**:
- Full resilience scan (all available experiments)
- Long-running experiments (sustained failure conditions)
- Multi-service failure scenarios
- Data integrity validation
- Capacity-related failure modes

**Cron Job**:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: weekly-chaos-scan
spec:
  schedule: "0 6 * * 1"  # Every Monday at 6am
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: chaos-runner
              image: litmuschaos/litmusctl:latest
              command:
                - /bin/sh
                - -c
                - |
                  litmusctl create experiment -f /experiments/full-scan.yaml
                  litmusctl watch experiment --namespace litmus --timeout 3600
                  litmusctl get experiment-results --namespace litmus -o json
          restartPolicy: Never
```

### Canary Deployments with Chaos

**Purpose**: Validate new deployments by running failure injection on the canary instances.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payment-service
spec:
  replicas: 10
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - # Run chaos experiment on canary
          experiment:
            templates:
              - name: canary-chaos
                spec:
                  containers:
                    - name: chaos-runner
                      image: litmuschaos/chaos-executor:latest
                      command: ["litmusctl", "create", "experiment", "-f", "/experiments/canary-validation.yaml"]
            analyze:
              - name: chaos-analysis
                requiredForCompletion: true
                templates:
                  - name: pass-fail
                    spec:
                      metrics:
                        - name: chaos-pass-rate
                          successCondition: result.passed > 0.9
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
```

### Experiment Results in CI/CD

**Result Schema**:
```json
{
  "pipeline_id": "1234",
  "stage": "post-deploy",
  "experiments": [
    {
      "name": "pod-failure-canary",
      "status": "passed",
      "duration_seconds": 45,
      "metrics": {
        "error_rate_increase": 0.3,
        "latency_increase_ms": 150,
        "blast_radius_percentage": 8
      },
      "findings": []
    },
    {
      "name": "network-latency-new-instances",
      "status": "failed",
      "duration_seconds": 120,
      "metrics": {
        "error_rate_increase": 12.5,
        "latency_increase_ms": 1850,
        "blast_radius_percentage": 15
      },
      "findings": [
        {
          "severity": "critical",
          "finding": "Circuit breaker timeout misconfigured",
          "component": "checkout-service"
        }
      ]
    }
  ],
  "overall_status": "failed",
  "blocking": true
}
```

### Degraded Deployment Mode

When experiments fail in post-deploy, the deployment can enter a degraded mode:

```yaml
degraded_mode:
  actions:
    - "Rollback the deployment automatically"
    - "File a critical incident ticket"
    - "Notify the deployment team"
    - "Disable the new feature flag"
    - "Scale down canary instances"
    - "Restore previous configuration"
  communication:
    - channel: "#deployments"
      message: "Deployment v2.1.3 failed chaos validation - rolled back"
    - channel: "#incident-response"
      message: "CRITICAL: Deployment v2.1.3 failed post-deploy chaos experiments"
```

---

## P15 Cloud-Specific Chaos

### AWS Fault Injection Simulator

**AWS FIS Template**:
`json
---

## P15 Cloud-Specific Chaos


### AWS Fault Injection Simulator

**AWS FIS Template**:
```json
{
  "experimentTemplate": {
    "description": "AWS FIS complete chaos experiment",
    "targets": {
      "ec2Targets": {
        "resourceType": "aws:ec2:instance",
        "resourceTags": { "ChaosEnabled": "true" },
        "selectionMode": "PERCENTAGE",
        "percentage": 20
      },
      "rdsTargets": {
        "resourceType": "aws:rds:db-cluster",
        "resourceTags": { "ChaosEnabled": "true" },
        "selectionMode": "COUNT",
        "count": 1
      }
    },
    "actions": {
      "ec2Terminate": {
        "actionId": "aws:ec2:terminate-instances",
        "targets": { "instances": "ec2Targets" }
      },
      "rdsFailover": {
        "actionId": "aws:rds:failover-db-cluster",
        "targets": { "clusters": "rdsTargets" }
      }
    },
    "stopConditions": [{
      "source": "aws:cloudwatch:alarm",
      "value": "arn:aws:cloudwatch:us-east-1:123456789012:alarm/ResilienceBreach"
    }],
    "roleArn": "arn:aws:iam::123456789012:role/aws-fis-resilience-role"
  }
}
```

### Azure Chaos Studio

**Azure Experiment**:
```json
{
  "name": "azure-chaos-experiment",
  "properties": {
    "steps": [{
      "name": "CPU Pressure on AKS",
      "branches": [{
        "name": "Branch A",
        "actions": [{
          "type": "continuous",
          "name": "cpu-pressure",
          "selectorId": "aks-payment-pods",
          "parameters": [
            { "key": "cpuPressureInMHz", "value": "1000" },
            { "key": "durationInMinutes", "value": "5" }
          ]
        }]
      }]
    }]
  }
}
```

### GCP Chaos Toolkit

**GCP Experiment**:
```yaml
experiment:
  name: gcp-compute-instance-termination
  provider:
    type: python
    module: chaosgcp.compute.actions
    func: stop_instances
  parameters:
    instance_names:
      - payment-instance-1
    zone: us-central1-a
    project: synarc-production
  steady_state_hypothesis:
    title: Service remains available
    probes:
      - type: probe
        name: checkout-healthy
        provider:
          type: http
          url: http://checkout-service/health
        tolerate:
          - type: tolerance
            provider:
              type: http
              status: 200
  method:
    - type: action
      name: terminate-instances
```
---

## P16 Post-Experiment Analysis


### Timeline Reconstruction

Every experiment produces a timeline of events for analysis. The timeline captures when failures were injected, system responses, and steady state recovery.

  - Experiment execution logs from chaos tooling
  - Application logs from affected services
  - Monitoring metric timestamps
  - Alert firing and resolution records
  - Circuit breaker state change events
  - Auto-scaling events
  - Load balancer registration/deregistration events

### Findings Documentation

Findings represent discrepancies between hypothesis and observed behavior.

  - CRITICAL: Customer-visible impact, data loss, or security breach
  - HIGH: Significant degradation, partial unavailability, or error spike
  - MEDIUM: Minor degradation, latency increase, or non-critical feature failure
  - LOW: Configuration warnings, documentation gaps, or observability gaps

### Remediation Backlog Management

Findings must be tracked through to resolution with SLAs.

  - CRITICAL findings: Remediate within 14 days
  - HIGH findings: Remediate within 30 days
  - MEDIUM findings: Remediate within 60 days
  - LOW findings: Remediate within 90 days

---

## P17 Resilience Anti-Patterns


### Anti-Pattern 1: Cascading Failures

A failure in one component triggers failures in other components, creating a chain reaction.

  - No circuit breakers or bulkheads between services
  - Tight coupling between services (synchronous dependencies)
  - Shared infrastructure (database, cache, message queue)
  - No load shedding at entry points
  - Retry storms amplifying failures

### Anti-Pattern 2: Retry Storms

Aggressive retries amplify load on failing services, preventing recovery.

  - No retry limits or retry budgets
  - Synchronous retry (no backoff)
  - All clients retry simultaneously (thundering herd)
  - No circuit breaker to stop retries

### Anti-Pattern 3: Thundering Herd

When a service recovers, all clients reconnect simultaneously.

  - Synchronized client reconnection
  - No jitter in reconnection timing
  - Short or zero DNS TTL

### Anti-Pattern 4: Dogpile Cache Stampede

When cached values expire, multiple requests regenerate simultaneously.

  - All cache entries have the same TTL
  - No locking or deduplication of cache regeneration
  - Cache warming is not staggered

### Anti-Pattern 5: No-Op Testing

Running experiments that do not create real failure conditions or detect impact.

  - Experiment targets non-critical paths
  - Failure injection is too weak to cause impact
  - Monitoring does not measure the right metrics
  - Teams are incentivized to pass experiments, not discover weaknesses

### Anti-Pattern 6: Experimenting Without a Hypothesis

Chaos experiments require a clear hypothesis about expected behavior.

  - Experiment reports describe what happened but not whether it was expected
  - No steady state baseline documented
  - Results cannot be classified as pass or fail

### Anti-Pattern 7: Ignoring Blast Radius

Experiments without proper blast radius controls risk customer impact.

  - Experiments cause production incidents
  - Multiple teams affected without prior notification
  - Rollback procedures are undeveloped or untested
  - Experiment duration exceeds planned window

### Anti-Pattern 8: Testing Only Happy Path Dependencies

Chaos experiments should cover all critical dependencies, not just well-understood ones.

  - Experiments always target the same services
  - Internal dependencies are never tested
  - Incidents occur from untested failure modes
  - Third-party service failures cause unexpected outages

---

## P18 Worked Examples


### Example 1: Payment Service Latency Injection

Scenario: Inject 500ms latency into 2 of 5 payment-service pods and observe checkout service circuit breaker behavior.

  - Hypothesis: ACCEPTED
  - Circuit breaker opened after 3 timeouts as expected
  - Peak p99 latency: 580ms (below 600ms threshold)
  - Peak error rate: 1.2% (below 2% threshold)
  - Blast radius: 8% of traffic affected (within 10% limit)
  - Key learning: Circuit breaker configuration is correct for this scenario

### Example 2: Database Connection Pool Exhaustion

Scenario: Reduce MySQL max_connections from 100 to 5 and observe application behavior.

  - Hypothesis: REJECTED
  - Application had NO circuit breaker for database operations
  - Read operations failed along with write operations (no replica fallback)
  - p99 latency increased from 150ms to 8500ms
  - Error rate spiked to 45%
  - Finding: Implement circuit breaker for database write operations
  - Finding: Implement read/write splitting with replica fallback

### Example 3: Multi-AZ Failover

Scenario: Isolate us-east-1a resources and verify traffic shifts to us-east-1b.

  - Hypothesis: PARTIALLY ACCEPTED
  - Traffic shifted to us-east-1b within 45 seconds (passed)
  - Error rate increased by 5.2% during transition (failed - expected < 3%)
  - Connection draining took 90 seconds (load balancer timeout misconfigured)

### Example 4: DNS Resolution Failure

Scenario: Block DNS resolution for payment-service.internal.

  - Hypothesis: REJECTED
  - Application did NOT cache DNS records
  - All connections failed immediately with DNS resolution error
  - No circuit breaker for DNS failures
  - Error rate spiked to 100% within 1 second
  - No DNS resolver resilience (single resolver, no fallback)

### Example 5: Kubernetes Node Failure

Scenario: Drain a node running payment-service pods.

  - Hypothesis: ACCEPTED
  - Pods rescheduled within 110 seconds (under 3 minutes)
  - PVCs reattached correctly
  - Only 1 pod unavailable at any time (PDB minAvailable=2)
  - Cluster autoscaler added new node within 2 minutes

### Example 6: Retry Storm with Circuit Breaker Failure

Scenario: Payment-service returns 503 for 100% of requests.

  - Hypothesis: PARTIALLY ACCEPTED
  - Circuit breaker opened after 5 failures (passed)
  - Payment-service request rate peaked at 180 rps (within expected)
  - Retry queue grew to 5000 items before circuit breaker opened
  - Processing retry queue took 15 minutes after recovery

### Example 7: Cache Failure and Fallback

Scenario: Make Redis cache unavailable.

  - Hypothesis: ACCEPTED
  - Fallback to database occurred within 50ms
  - p95 latency increased from 50ms to 420ms (under 500ms threshold)
  - Error rate remained at 0.5%
  - Cache hit ratio returned to 93% within 3 minutes of recovery

### Example 8: TLS Certificate Expiry

Scenario: Use expired TLS certificate for payment-service.

  - Hypothesis: PARTIALLY ACCEPTED
  - Clients with certificate pinning rejected connection (passed)
  - Clients without pinning showed inconsistent behavior
  - Certificate auto-renewal not configured for this certificate
  - Inconsistent TLS validation across client libraries

### Example 9: Schema Migration Failure

Scenario: Kill database connection mid-migration.

  - Hypothesis: ACCEPTED
  - Flyway migration rolled back the failed statement
  - Application continued with previous schema version
  - No data loss (migration was in a transaction)
  - Alert fired for failed migration

### Example 10: Load Shedding at API Gateway

Scenario: Send 1000 rps to gateway configured for 600 rps max.

  - Hypothesis: ACCEPTED
  - API gateway rejected 380 rps with 429 (expected ~400)
  - p99 latency for accepted requests: 340ms (below 500ms)
  - CPU utilization peaked at 72% (below 80%)
  - Rejected requests received correct Retry-After header

### Example 11: Kafka Broker Failure

Scenario: Stop 1 of 3 Kafka brokers.

  - Hypothesis: ACCEPTED
  - Leader re-election completed in 8 seconds
  - No messages lost (all partitions had in-sync replicas)
  - Consumer rebalance completed in 22 seconds
  - Producer latency increased by 250ms during re-election

### Example 12: Configuration Corruption

Scenario: Corrupt a ConfigMap database connection string.

  - Hypothesis: REJECTED
  - Application did NOT validate configuration before applying
  - Application crashed with connection refused error
  - No configuration rollback mechanism existed
  - Service was unavailable for 12 minutes
  - Pod entered CrashLoopBackOff state

---

## P19 Quality Gates


### Experiment Quality Checklist

Every experiment must pass these quality gates before execution:

  - Hypothesis is specific, measurable, and testable
  - Steady state metrics defined with baselines and acceptable ranges
  - Blast radius documented and limited to agreed boundaries
  - Rollback criteria are automated and tested
  - All affected teams notified and consented
  - Experiment within approved time window
  - Monitoring dashboards configured and tested
  - Manual abort mechanism available and tested
  - Stakeholder approvals obtained (per tier)
  - Dry run completed for Tier 3+ experiments

### Quality Metrics

Key metrics for measuring chaos engineering effectiveness:

  - Experiments run per week/month
  - Experiment completion rate
  - Average time from finding to remediation
  - Remediation closure rate
  - Incidents prevented by experiment findings
  - MTTR trend over time
  - Percentage of automated experiments
  - Service coverage (what percentage has been tested)
  - Failure mode coverage (what percentage of known failure modes tested)
  - Team participation rate

---

As Chaos Engineers, we commit to:

  - Never compromise on safety - blast radius controls are non-negotiable
  - Always have a hypothesis - experiments without hypotheses are vandalism
  - Share findings openly - organizational learning over blame
  - Build incrementally - start simple and increase complexity
  - Validate continuously - resilience is not a one-time activity
  - Celebrate discoveries - every finding is a win
  - Respect boundaries - never experiment without consent and controls
  - Drive improvement - every experiment should make the system more resilient

---

This SKILL.md defines the complete Chaos Engineering practice within the synarc platform.
All experiments, GameDays, and resilience activities should follow the methodology,
principles, and quality gates defined herein.
---

## P3 Experiment Design Methodology (Expanded)


### Steady State Hypothesis Formulation

Formulating a precise steady state hypothesis is the most critical step in experiment design. The hypothesis must be specific enough to be falsifiable and measurable enough to be validated with data.

**Criteria for Good Hypotheses**:
  - Falsifiable: The hypothesis can be proven wrong by experimental data
  - Specific: Includes exact metrics, thresholds, and timeframes
  - Measurable: All claims can be quantified with available telemetry
  - Relevant: Tests behavior that matters to system reliability
  - Scoped: Limited to a specific failure mode and blast radius

**Hypothesis Refinement Process**:
1. Initial claim: "The system is resilient to payment service failures"
2. First refinement: "When payment service fails, checkout service degrades gracefully"
3. Second refinement: "When payment service returns HTTP 503, checkout service returns a cached response within 200ms for 95% of requests"
4. Final hypothesis: "When payment service returns HTTP 503 for 50% of requests, checkout service p99 latency increases by less than 500ms from baseline of 250ms, and error rate remains below 2%"

**Common Hypothesis Pitfalls**:
  - Vague claims: "The system will handle the failure well" - not testable
  - Circular reasoning: "The experiment will verify resilience" - not specific
  - Unmeasurable outcomes: "Users will be satisfied" - cannot measure in experiment
  - Missing timeframes: "Latency increases" - by how much and for how long?
  - Overly narrow: Tests only one very specific scenario with limited learning value

### Steady State Baseline Collection

Baseline collection is the process of establishing normal system behavior before introducing chaos. The quality of the baseline directly affects the validity of experiment conclusions.

**Baseline Collection Requirements**:
  - Minimum 24 hours of continuous metric data
  - Recommended 7 days to capture weekly patterns
  - Include peak and off-peak traffic periods
  - Exclude known anomalies, incidents, or maintenance windows
  - Account for day-of-week and seasonal variations
  - Document the collection methodology and any data transformations

**Baseline Statistics to Compute**:
  - Mean, median, and mode for each metric
  - Standard deviation and variance
  - Percentiles: p50, p75, p90, p95, p99, p99.9
  - Minimum and maximum values
  - Rate of change (derivative) for trend detection
  - Autocorrelation to identify periodic patterns

**Statistical Methods for Baseline Validation**:
```python
import numpy as np
from scipy import stats

def validate_baseline(baseline_data, confidence=0.95):
    results = {}
    for metric, values in baseline_data.items():
        # Normality test
        stat, p_value = stats.normaltest(values)
        is_normal = p_value > 0.05
        
        # Confidence intervals
        mean = np.mean(values)
        sem = stats.sem(values)
        ci = stats.t.interval(confidence, len(values)-1, loc=mean, scale=sem)
        
        # Outlier detection (IQR method)
        q1, q3 = np.percentile(values, [25, 75])
        iqr = q3 - q1
        outliers = values[(values < q1 - 1.5*iqr) | (values > q3 + 1.5*iqr)]
        
        results[metric] = {
            "mean": mean,
            "std": np.std(values),
            "is_normal": is_normal,
            "confidence_interval": ci,
            "outlier_count": len(outliers),
            "outlier_percentage": len(outliers) / len(values) * 100
        }
    return results
```

### Blast Radius Calculation and Enforcement

Blast radius must be calculated before every experiment and enforced programmatically during execution.

**Blast Radius Dimensions**:
  - Instance count: Maximum number of instances/pods affected
  - Traffic percentage: Maximum percentage of traffic affected
  - Service count: Maximum number of services affected
  - Geographic scope: Single AZ, multiple AZs, single region, multiple regions
  - User percentage: Maximum percentage of users affected
  - Data scope: Which data partitions or shards are affected
  - Duration: Maximum experiment duration in seconds

**Blast Radius Calculation Formula**:
```text
Blast Radius Score = (instance_count / total_instances) * 0.3
                    + (traffic_percentage / 100) * 0.3
                    + (service_count / total_services) * 0.2
                    + (geo_scope_weight) * 0.2

Where geo_scope_weight = 0.25 for single pod,
                          0.50 for multiple pods,
                          0.75 for single AZ,
                          1.00 for multiple AZs
```

**Enforcement Mechanisms**:
  - Kubernetes: PodDisruptionBudget, NetworkPolicy, ResourceQuota
  - AWS: IAM policies, Security Groups, Service Control Policies
  - Chaos tooling: ChaosEngine blast radius limits, selector constraints
  - Monitoring: Automated rollback triggers when blast radius exceeds limits

### Rollback Criteria Design

Rollback criteria define the conditions under which an experiment must be stopped immediately. These are safety boundaries that protect production systems.

**Types of Rollback Criteria**:
  - Metric-based: Error rate exceeds threshold for sustained duration
  - Latency-based: p99 latency exceeds threshold for sustained duration
  - Budget-based: Error budget exhaustion rate exceeds threshold
  - Alert-based: Any PagerDuty alert fires during experiment
  - Manual: Human operator can trigger rollback at any time
  - Timer-based: Experiment exceeds maximum duration

**Rollback Criteria Template**:
```yaml
rollback_criteria:
  metric_conditions:
    - metric: "error_rate"
      source: "prometheus"
      query: "sum(rate(http_requests_total{status=~"5.."}[1m])) / sum(rate(http_requests_total[1m]))"
      threshold: 0.05
      operator: ">"
      duration_seconds: 10

    - metric: "latency_p99"
      source: "datadog"
      query: "p99:trace.servlet.request.duration{service:checkout-service}"
      threshold_ms: 2000
      operator: ">"
      duration_seconds: 15

  error_budget_condition:
    budget_consumption_rate: 0.1
    window_minutes: 5

  timer_condition:
    max_duration_seconds: 300

  manual_condition:
    abort_endpoint: "/api/experiments/{id}/abort"
    abort_channel: "#chaos-engineering"
```

### Experiment Documentation Standards

Every experiment must be documented to a standard that allows reproduction and learning by other engineers.

**Required Documentation**:
  - Experiment ID and unique identifier
  - Experiment name and description
  - Owner and team responsible
  - Hypothesis with measurable criteria
  - Steady state definition with baselines
  - Experiment parameters (failure type, target, duration, severity)
  - Blast radius calculation and limits
  - Rollback criteria and procedures
  - Timeline of experiment execution
  - Results and analysis
  - Findings with severity classification
  - Remediation items with owners and deadlines

**Documentation Template**:
```markdown
# Experiment Report: [ID]

## Overview
- Name:
- Date:
- Owner:
- Duration:
- Status: [Passed/Failed/Partially Passed]

## Hypothesis
[One paragraph describing expected behavior]

## Steady State
| Metric | Baseline | Acceptable Range | Source |
|--------|----------|-----------------|--------|
| p99 latency | 250ms | 200-600ms | Prometheus |
| Error rate | 0.3% | 0-2% | Datadog |

## Experiment Parameters
- Failure type:
- Target:
- Duration:
- Blast radius:

## Timeline
| Time | Event |
|------|-------|
| T+0s | Injection started |
| T+5s | First timeout |

## Results
[Analysis of results against hypothesis]

## Findings
| Severity | Finding | Remediation | Owner |
|----------|---------|-------------|-------|
| CRITICAL | ... | ... | ... |

## Key Learnings
- [Learning 1]
- [Learning 2]
```

---

## P4 GameDay Planning and Execution (Expanded)


### GameDay Scenario Design Principles

Effective GameDay scenarios balance realism, safety, and educational value.

**Design Principles**:
  - Realism: Scenarios should be based on real incidents or plausible failure modes
  - Progressive difficulty: Start with simple scenarios and increase complexity
  - Psychological safety: Participants should feel safe to make mistakes
  - Clear objectives: Each scenario should have specific learning goals
  - Measurable outcomes: Success criteria must be objective and quantifiable
  - Time-boxed: Scenarios must fit within the scheduled GameDay duration
  - Repeatable: Scenarios should be reusable with different participants

### GameDay Role Definitions

**Incident Commander**: Leads the response, coordinates teams, makes escalation decisions
  - Responsible for overall incident management
  - Delegates tasks to response teams
  - Makes go/no-go decisions on remediation steps
  - Communicates status to stakeholders
  - Decides when to escalate

**Communications Lead**: Manages internal and external communications
  - Drafts status updates for stakeholders
  - Manages the war room communication channel
  - Coordinates with customer support team
  - Prepares post-incident communication

**Primary Responders**: Engineers responsible for technical investigation and remediation
  - Investigate alerts and dashboards
  - Identify root cause
  - Implement remediation
  - Verify system recovery

**SMEs (Subject Matter Experts)**: Deep technical experts in specific domains
  - Available for consultation on domain-specific issues
  - Can be called in by primary responders
  - Do not actively participate unless requested

**Observers**: Learn from watching the exercise
  - Do not participate or interfere
  - Take notes on process improvements
  - Ask questions during debrief only
  - Typically junior engineers or new team members

**Facilitator**: Runs the GameDay exercise
  - Manages the scenario timeline
  - Injects events at appropriate times
  - Ensures psychological safety
  - Keeps the exercise on schedule
  - Leads the debrief and retrospective

### GameDay Technology Setup

**Required Infrastructure**:
  - Isolated environment (staging or dedicated GameDay cluster)
  - Monitoring and observability stack (Prometheus, Grafana, Datadog)
  - Incident management tool (PagerDuty, OpsGenie)
  - Communication platform (Slack, Teams) with dedicated channel
  - Documentation platform for collaboration (Confluence, Notion, Google Docs)
  - Screen recording for post-GameDay analysis (optional)
  - Automation scripts for failure injection

**Environment Requirements**:
  - Must be representative of production (similar architecture, scale, data volume)
  - Must have realistic traffic patterns (use traffic generation tools)
  - Must have all monitoring and alerting configured as in production
  - Must have documented rollback procedures
  - Must be isolated from production systems and data

### GameDay Execution Checklist

**Pre-GameDay (1 week before)** :
  - Scenario designed and reviewed
  - Environment provisioned and verified
  - Injection scripts tested
  - Participants confirmed and roles assigned
  - Observers briefed on their role
  - Calendar invites sent with duration and expectations

**Pre-GameDay (1 day before)** :
  - Final environment check
  - All injection scripts verified
  - Communication channels created
  - Backup plans documented

**GameDay Day**:
  - T-60min: Environment verification
  - T-30min: Participant briefing
  - T-15min: Facilitators and observers take positions
  - T-5min: Final checks
  - T+0: Scenario begins
  - T+30min: Mid-exercise check-in
  - T+90min: Scenario ends
  - T+105min: Debrief begins
  - T+120min: Retrospective
  - T+150min: Action items documented

### Post-GameDay Analysis

**Data Collection**:
  - Timeline of events from injection scripts
  - Participant actions and decisions (from communication logs)
  - Monitoring data during the exercise
  - Alert firing records
  - Incident management tool records

**Metrics to Track**:
  - Time to detect: From first alert to identification of issue
  - Time to respond: From detection to first remediation action
  - Time to resolve: From detection to system recovery
  - Escalation count: Number of escalation levels used
  - Hints requested: Number of times participants asked for help
  - Communication quality: Clarity, frequency, and accuracy of updates

**Trend Analysis**:
  - Compare metrics across multiple GameDays
  - Track improvement in detection and response times
  - Identify recurring issues across scenarios
  - Measure the impact of remediation actions from previous GameDays

---

## P5 Failure Injection Techniques (Expanded)


### Advanced Network Failure Injection

**Correlated Packet Loss**: Real network failures often exhibit correlation in packet loss. Use correlated loss patterns for more realistic experiments.
```bash
# Correlated loss with 25% correlation
tc qdisc add dev eth0 root netem loss 10% 25% 50%
# Where: 10% = loss rate, 25% = correlation, 50% = gap correlation
```

**Packet Corruption**: Simulate data corruption in transit.
```bash
# 5% packet corruption
tc qdisc add dev eth0 root netem corrupt 5%
```

**Packet Duplication**: Simulate network retransmissions.
```bash
# 2% packet duplication
tc qdisc add dev eth0 root netem duplicate 2%
```

**Reordering**: Simulate out-of-order packet delivery.
```bash
# 5% packet reordering with 50ms delay
tc qdisc add dev eth0 root netem delay 50ms reorder 5% 50%
```

### Advanced Resource Exhaustion Techniques

**Memory Pressure with Specific Allocation Patterns**:
```bash
# Allocate and hold memory in chunks
stress-ng --vm 2 --vm-bytes 256M --vm-keep --timeout 120s

# Memory pressure with malloc failures
stress-ng --vm 2 --vm-bytes 256M --vm-method all --timeout 120s
```

**Disk I/O Stress**:
```bash
# Sequential I/O stress
stress-ng --hdd 4 --hdd-bytes 4G --timeout 120s

# Random I/O stress (more realistic)
stress-ng --aio 4 --aio-requests 64 --timeout 120s

# I/O latency injection using blktrace/blkprobe
# Requires kernel support for block layer tracing
```

### Container-Specific Failure Injection

**Container Exec Failure**: Kubernetes probes can fail even when containers are running.
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: container-kill
spec:
  engineState: active
  appinfo:
    appns: production
    applabel: app=payment-service
  experiments:
    - name: container-kill
      spec:
        components:
          env:
            - name: TARGET_CONTAINER
              value: "payment-service"
            - name: TOTAL_CHAOS_DURATION
              value: "60"
            - name: CHAOS_INTERVAL
              value: "5"
            - name: PODS_AFFECTED_PERC
              value: "25"
            - name: SEQUENCE
              value: "parallel"
```

**Readiness Probe Failure**: Simulate application being alive but not ready for traffic.
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: probe-failure
spec:
  appinfo:
    appns: production
    applabel: app=payment-service
  experiments:
    - name: pod-http-modify-response
      spec:
        components:
          env:
            - name: TARGET_SERVICE_PORT
              value: "8080"
            - name: RESPONSE_CODE
              value: "503"
            - name: TOTAL_CHAOS_DURATION
              value: "120"
```

---

## P6 Infrastructure Chaos (Expanded)


### Kubernetes Cluster-Level Chaos

**API Server Failure**: The Kubernetes API server is the brain of the cluster.
```yaml
experiment:
  name: kube-apiserver-failure
  hypothesis: |
    When the Kubernetes API server becomes unavailable:
    - Existing pods continue running normally
    - kubectl commands fail with connection refused
    - Deployments and scaling operations are blocked
    - kubelet continues managing pods on each node
    - Services and endpoints continue functioning
    - API server recovers within 60 seconds (if HA)
  experiment_parameters:
    failure_type: "process_kill"
    target: "kube-apiserver"
    ha_enabled: true
    expected_recovery_time_seconds: 30
    expected_pod_disruption: 0
```

**etcd Failure**: etcd stores all cluster state.
```yaml
experiment:
  name: etcd-member-failure
  hypothesis: |
    When 1 of 3 etcd members fails:
    - etcd leader election completes within 15s
    - API server read operations continue unaffected
    - Write operations may fail briefly during leader election
    - Remaining members maintain quorum
    - No data loss
    - Failed member rejoins and syncs correctly
```

### Storage Infrastructure Chaos

**Persistent Volume Failure**: Test PVC/PV behavior under failure.
```yaml
experiment:
  name: pvc-deletion
  hypothesis: |
    When a PVC is deleted:
    - Pod using the PVC enters pending state
    - PV enters Released state (if retain policy)
    - Data on the PV is preserved (if retain policy)
    - Pod recovers when PVC is recreated
    - Data is accessible from new PVC
```

---

## P7 Application Chaos (Expanded)


### Application-Level Chaos Patterns

**Exception Injection**: Force application code to throw specific exceptions.
```java
// Using Byteman for Java exception injection
RULE Force SQLException
CLASS com.payment.service.PaymentRepository
METHOD findById
AT ENTRY
IF true
DO throw new java.sql.SQLException("Connection pool exhausted")
ENDRULE
```

**Feature Flag Toggling**: Test feature flag behavior under load.
```yaml
experiment:
  name: feature-flag-toggle
  hypothesis: |
    When the new-payment-flow feature flag is toggled on:
    - 50% of traffic uses the new payment flow
    - Error rate increases by less than 1%
    - p99 latency increases by less than 200ms
    - Rollback can be completed within 30 seconds
  experiment_parameters:
    feature_flag: "new-payment-flow"
    flag_type: "boolean"
    rollout_percentage: 50
    duration_minutes: 15
```

### Graceful Shutdown Testing

Purpose: Verify that applications handle SIGTERM correctly during pod termination.

```python
class GracefulShutdownTest:
    def __init__(self, namespace, app_label):
        self.namespace = namespace
        self.app_label = app_label
        self.api = kubernetes.client.CoreV1Api()

    def test_sigterm_handling(self):
        results = []
        pods = self.api.list_namespaced_pod(
            namespace=self.namespace,
            label_selector=f"app={self.app_label}"
        )
        for pod in pods.items[:3]:
### Experiment Scenario Catalog

The following experiment scenarios cover common failure modes across the technology stack. Each scenario includes a hypothesis, parameters, and expected behaviors.

**Scenario 1: Node Latency #1**
  - Target: checkout-service
  - Failure type: network_latency
  - Duration: 40 seconds
  - Blast radius: 6% of instances
  - Expected p99 latency increase: 75ms
  - Expected error rate increase: 0.15000000000000002%

**Scenario 2: Network Crash #1**
  - Target: api-gateway
  - Failure type: dns_failure
  - Duration: 50 seconds
  - Blast radius: 7% of instances
  - Expected p99 latency increase: 100ms
  - Expected error rate increase: 0.2%

**Scenario 3: DNS Timeout #1**
  - Target: user-service
  - Failure type: disk_fill
  - Duration: 60 seconds
  - Blast radius: 8% of instances
  - Expected p99 latency increase: 125ms
  - Expected error rate increase: 0.25%

**Scenario 4: Storage Exhaustion #1**
  - Target: inventory-service
  - Failure type: cpu_stress
  - Duration: 70 seconds
  - Blast radius: 9% of instances
  - Expected p99 latency increase: 150ms
  - Expected error rate increase: 0.30000000000000004%

**Scenario 5: Database Corruption #1**
  - Target: notification-service
  - Failure type: memory_stress
  - Duration: 80 seconds
  - Blast radius: 10% of instances
  - Expected p99 latency increase: 175ms
  - Expected error rate increase: 0.35%

**Scenario 6: Cache Deletion #1**
  - Target: search-service
  - Failure type: process_kill
  - Duration: 90 seconds
  - Blast radius: 11% of instances
  - Expected p99 latency increase: 200ms
  - Expected error rate increase: 0.4%

**Scenario 7: Queue Misconfiguration #1**
  - Target: analytics-service
  - Failure type: time_skew
  - Duration: 100 seconds
  - Blast radius: 12% of instances
  - Expected p99 latency increase: 225ms
  - Expected error rate increase: 0.45000000000000007%

**Scenario 8: Certificate Expiry #1**
  - Target: auth-service
  - Failure type: az_failure
  - Duration: 110 seconds
  - Blast radius: 13% of instances
  - Expected p99 latency increase: 250ms
  - Expected error rate increase: 0.5%

**Scenario 9: Config Saturation #1**
  - Target: order-service
  - Failure type: region_failure
  - Duration: 120 seconds
  - Blast radius: 14% of instances
  - Expected p99 latency increase: 275ms
  - Expected error rate increase: 0.55%

**Scenario 10: Pod Failure #2**
  - Target: payment-service
  - Failure type: pod_kill
  - Duration: 130 seconds
  - Blast radius: 15% of instances
  - Expected p99 latency increase: 300ms
  - Expected error rate increase: 0.6%

**Scenario 11: Node Latency #2**
  - Target: checkout-service
  - Failure type: network_latency
  - Duration: 140 seconds
  - Blast radius: 16% of instances
  - Expected p99 latency increase: 325ms
  - Expected error rate increase: 0.65%

**Scenario 12: Network Crash #2**
  - Target: api-gateway
  - Failure type: dns_failure
  - Duration: 150 seconds
  - Blast radius: 17% of instances
  - Expected p99 latency increase: 350ms
  - Expected error rate increase: 0.7000000000000001%

**Scenario 13: DNS Timeout #2**
  - Target: user-service
  - Failure type: disk_fill
  - Duration: 160 seconds
  - Blast radius: 18% of instances
  - Expected p99 latency increase: 375ms
  - Expected error rate increase: 0.75%

**Scenario 14: Storage Exhaustion #2**
  - Target: inventory-service
  - Failure type: cpu_stress
  - Duration: 170 seconds
  - Blast radius: 19% of instances
  - Expected p99 latency increase: 400ms
  - Expected error rate increase: 0.8%

**Scenario 15: Database Corruption #2**
  - Target: notification-service
  - Failure type: memory_stress
  - Duration: 180 seconds
  - Blast radius: 20% of instances
  - Expected p99 latency increase: 425ms
  - Expected error rate increase: 0.85%

**Scenario 16: Cache Deletion #2**
  - Target: search-service
  - Failure type: process_kill
  - Duration: 190 seconds
  - Blast radius: 21% of instances
  - Expected p99 latency increase: 450ms
  - Expected error rate increase: 0.9%

**Scenario 17: Queue Misconfiguration #2**
  - Target: analytics-service
  - Failure type: time_skew
  - Duration: 200 seconds
  - Blast radius: 22% of instances
  - Expected p99 latency increase: 475ms
  - Expected error rate increase: 0.9500000000000001%

**Scenario 18: Certificate Expiry #2**
  - Target: auth-service
  - Failure type: az_failure
  - Duration: 210 seconds
  - Blast radius: 23% of instances
  - Expected p99 latency increase: 500ms
  - Expected error rate increase: 1.0%

**Scenario 19: Config Saturation #2**
  - Target: order-service
  - Failure type: region_failure
  - Duration: 220 seconds
  - Blast radius: 24% of instances
  - Expected p99 latency increase: 525ms
  - Expected error rate increase: 1.05%

**Scenario 20: Pod Failure #3**
  - Target: payment-service
  - Failure type: pod_kill
  - Duration: 230 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 550ms
  - Expected error rate increase: 1.1%

**Scenario 21: Node Latency #3**
  - Target: checkout-service
  - Failure type: network_latency
  - Duration: 240 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 575ms
  - Expected error rate increase: 1.1500000000000001%

**Scenario 22: Network Crash #3**
  - Target: api-gateway
  - Failure type: dns_failure
  - Duration: 250 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 600ms
  - Expected error rate increase: 1.2000000000000002%

**Scenario 23: DNS Timeout #3**
  - Target: user-service
  - Failure type: disk_fill
  - Duration: 260 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 625ms
  - Expected error rate increase: 1.2500000000000002%

**Scenario 24: Storage Exhaustion #3**
  - Target: inventory-service
  - Failure type: cpu_stress
  - Duration: 270 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 650ms
  - Expected error rate increase: 1.3000000000000003%

**Scenario 25: Database Corruption #3**
  - Target: notification-service
  - Failure type: memory_stress
  - Duration: 280 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 675ms
  - Expected error rate increase: 1.35%

**Scenario 26: Cache Deletion #3**
  - Target: search-service
  - Failure type: process_kill
  - Duration: 290 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 700ms
  - Expected error rate increase: 1.4000000000000001%

**Scenario 27: Queue Misconfiguration #3**
  - Target: analytics-service
  - Failure type: time_skew
  - Duration: 300 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 725ms
  - Expected error rate increase: 1.4500000000000002%

**Scenario 28: Certificate Expiry #3**
  - Target: auth-service
  - Failure type: az_failure
  - Duration: 310 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 750ms
  - Expected error rate increase: 1.5000000000000002%

**Scenario 29: Config Saturation #3**
  - Target: order-service
  - Failure type: region_failure
  - Duration: 320 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 775ms
  - Expected error rate increase: 1.5500000000000003%

**Scenario 30: Pod Failure #4**
  - Target: payment-service
  - Failure type: pod_kill
  - Duration: 330 seconds
  - Blast radius: 25% of instances
  - Expected p99 latency increase: 800ms
  - Expected error rate increase: 1.6%


### Detailed Metric Definitions for Experiment Monitoring

Each experiment must define the metrics that will be monitored before, during, and after the experiment. Below are detailed metric definitions for common experiment types.


| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| http_request_duration_seconds | Histogram | Request duration in seconds | Service, method, status_code, experiment_id |
| http_requests_total | Counter | Total HTTP requests | Service, method, status_code, experiment_id |
| http_errors_total | Counter | Total HTTP errors | Service, error_type, experiment_id |
| grpc_server_handling_seconds | Histogram | gRPC handling time | Service, method, grpc_status, experiment_id |
| db_query_duration_seconds | Histogram | Database query duration | Database, query_type, table, experiment_id |
| db_connections_active | Gauge | Active database connections | Database, host, experiment_id |
| db_connections_idle | Gauge | Idle database connections | Database, host, experiment_id |
| db_replication_lag_seconds | Gauge | Database replication lag | Database, replica_id, experiment_id |
| cache_hit_ratio | Gauge | Cache hit ratio | Cache, experiment_id |
| cache_operations_seconds | Histogram | Cache operation duration | Cache, operation, experiment_id |
| circuit_breaker_state | Gauge | Circuit breaker state (0=closed, 1=open, 2=half-open) | Service, circuit_name, experiment_id |
| circuit_breaker_failure_count | Gauge | Circuit breaker failure count | Service, circuit_name, experiment_id |
| queue_depth | Gauge | Message queue depth | Queue, topic, experiment_id |
| queue_lag_seconds | Gauge | Consumer lag in seconds | Queue, consumer_group, experiment_id |
| thread_pool_active | Gauge | Active thread pool threads | Service, pool_name, experiment_id |
| thread_pool_queue | Gauge | Thread pool queue size | Service, pool_name, experiment_id |
| cpu_utilization | Gauge | CPU utilization percentage | Pod, node, experiment_id |
| memory_usage_bytes | Gauge | Memory usage in bytes | Pod, node, experiment_id |
| disk_usage_bytes | Gauge | Disk usage in bytes | Pod, volume, experiment_id |
| network_received_bytes | Gauge | Network bytes received | Pod, interface, experiment_id |
| network_transmitted_bytes | Gauge | Network bytes transmitted | Pod, interface, experiment_id |
| pod_ready | Gauge | Pod ready state (0=not ready, 1=ready) | Pod, experiment_id |
| pod_restart_count | Gauge | Pod restart count | Pod, experiment_id |
| connection_pool_active | Gauge | Active connection pool connections | Service, pool_name, experiment_id |
| connection_pool_idle | Gauge | Idle connection pool connections | Service, pool_name, experiment_id |
| connection_pool_pending | Gauge | Pending connection pool requests | Service, pool_name, experiment_id |
| rate_limit_remaining | Gauge | Remaining rate limit capacity | Service, limit_name, experiment_id |
| retry_count | Counter | Retry count | Service, operation, experiment_id |
| fallback_triggered | Counter | Fallback triggered count | Service, operation, experiment_id |
| degraded_requests | Counter | Degraded mode requests | Service, feature, experiment_id |

### Expanded GameDay Scenario Catalog


**GameDay Scenario 1: The Phantom Traffic**
  Description: Traffic spike scenario testing autoscaling limits
  - Duration: 75 minutes
  - Participants: 3 engineers
  - Key learning: Autoscaling
  - Difficulty: Easy

**GameDay Scenario 2: The Silent Database**
  Description: Database replication lag detection and remediation
  - Duration: 90 minutes
  - Participants: 4 engineers
  - Key learning: Replication monitoring
  - Difficulty: Medium

**GameDay Scenario 3: The Certificate Massacre**
  Description: Multiple TLS certificate expiry simultaneously
  - Duration: 105 minutes
  - Participants: 5 engineers
  - Key learning: Certificate automation
  - Difficulty: Hard

**GameDay Scenario 4: The Configuration Drift**
  Description: Configuration drift across service instances
  - Duration: 120 minutes
  - Participants: 6 engineers
  - Key learning: Config validation
  - Difficulty: Expert

**GameDay Scenario 5: The Dependency Cascade**
  Description: Cascading failure through service dependencies
  - Duration: 135 minutes
  - Participants: 2 engineers
  - Key learning: Circuit breakers
  - Difficulty: Medium

**GameDay Scenario 6: The Region Fade**
  Description: Multi-region failover with data consistency validation
  - Duration: 150 minutes
  - Participants: 3 engineers
  - Key learning: Disaster recovery
  - Difficulty: Hard

**GameDay Scenario 7: The Data Corruption**
  Description: Data corruption detection and recovery procedures
  - Duration: 165 minutes
  - Participants: 4 engineers
  - Key learning: Backup testing
  - Difficulty: Expert

**GameDay Scenario 8: The Queue Overflow**
  Description: Message queue backpressure and consumer lag handling
  - Duration: 180 minutes
  - Participants: 5 engineers
  - Key learning: Consumer monitoring
  - Difficulty: Medium

**GameDay Scenario 9: The Scale Surge**
  Description: Unexpected traffic surge overwhelming capacity
  - Duration: 195 minutes
  - Participants: 6 engineers
  - Key learning: Capacity planning
  - Difficulty: Easy

**GameDay Scenario 10: The Auth Failure**
  Description: Authentication service failure impacting all services
  - Duration: 210 minutes
  - Participants: 2 engineers
  - Key learning: Auth resilience
  - Difficulty: Hard

**GameDay Scenario 11: The DNS Hijack**
  Description: DNS poisoning redirecting internal traffic
  - Duration: 225 minutes
  - Participants: 3 engineers
  - Key learning: DNSSEC
  - Difficulty: Expert

**GameDay Scenario 12: The Backup Failure**
  Description: Backup restoration failure testing recovery procedures
  - Duration: 240 minutes
  - Participants: 4 engineers
  - Key learning: Backup automation
  - Difficulty: Hard

**GameDay Scenario 13: The Secret Rotation**
  Description: Secret rotation failure blocking service-to-service auth
  - Duration: 255 minutes
  - Participants: 5 engineers
  - Key learning: Secret management
  - Difficulty: Medium

**GameDay Scenario 14: The Deployment Gone Wrong**
  Description: Bad deployment with gradual symptom onset
  - Duration: 270 minutes
  - Participants: 6 engineers
  - Key learning: Deployment safety
  - Difficulty: Easy

**GameDay Scenario 15: The Monitoring Blind Spot**
  Description: Monitoring system failure blinding operations team
  - Duration: 285 minutes
  - Participants: 2 engineers
  - Key learning: Monitoring redundancy
  - Difficulty: Expert

**GameDay Scenario 16: The Capacity Crunch**
  Description: Resource exhaustion from unexpected capacity needs
  - Duration: 300 minutes
  - Participants: 3 engineers
  - Key learning: Resource limits
  - Difficulty: Medium

**GameDay Scenario 17: The Compliance Breach**
  Description: Compliance audit finding requiring immediate remediation
  - Duration: 315 minutes
  - Participants: 4 engineers
  - Key learning: Compliance automation
  - Difficulty: Hard

**GameDay Scenario 18: The Third-Party Sunset**
  Description: Third-party API deprecation with short migration window
  - Duration: 330 minutes
  - Participants: 5 engineers
  - Key learning: Vendor management
  - Difficulty: Medium

**GameDay Scenario 19: The Network Partition**
  Description: Complete network isolation between critical services
  - Duration: 345 minutes
  - Participants: 6 engineers
  - Key learning: Network design
  - Difficulty: Expert

**GameDay Scenario 20: The Recovery Test**
  Description: Full recovery exercise after simulated disaster
  - Duration: 360 minutes
  - Participants: 2 engineers
  - Key learning: Recovery procedures
  - Difficulty: Hard


### Failure Injection Implementation Details

This section provides detailed implementation guidance for each failure injection technique.

**Pod Delete** (Kubernetes)
  - Description: Deletes pods gracefully or forcefully
  - Tools: kubectl delete pod, litmuschaos pod-delete
  - Purpose: Tests deployment resilience, PDB compliance, replica management
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Container Kill** (Kubernetes)
  - Description: Kills specific container within pod
  - Tools: litmuschaos container-kill, chaos-mesh container-kill
  - Purpose: Tests container restart policy, probe behavior
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Node Drain** (Kubernetes)
  - Description: Cordons and drains a node
  - Tools: kubectl drain, litmuschaos node-drain
  - Purpose: Tests pod rescheduling, PVC reattachment, cluster autoscaling
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Network Latency** (Network)
  - Description: Adds delay to network packets
  - Tools: tc netem, chaos-mesh network-delay, envoy fault injection
  - Purpose: Tests timeout handling, retry logic, circuit breakers
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Network Loss** (Network)
  - Description: Drops network packets
  - Tools: tc netem loss, chaos-mesh network-loss
  - Purpose: Tests retry logic, connection resilience, data integrity
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Network Partition** (Network)
  - Description: Isolates service from network
  - Tools: iptables, chaos-mesh network-partition, AWS SG changes
  - Purpose: Tests cluster resilience, leader election, failover
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**DNS Failure** (Network)
  - Description: DNS resolution fails or returns wrong IP
  - Tools: iptables DNS block, chaos-mesh dns-chaos, /etc/hosts
  - Purpose: Tests DNS caching, fallback resolvers, connection resilience
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**TLS Failure** (Network)
  - Description: TLS certificate issues
  - Tools: Expired cert, wrong host, untrusted CA
  - Purpose: Tests TLS validation, certificate pinning, mTLS behavior
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**CPU Stress** (Compute)
  - Description: Consumes CPU resources
  - Tools: stress-ng, litmuschaos pod-cpu-hog
  - Purpose: Tests CPU throttling, autoscaling, request prioritization
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Memory Stress** (Compute)
  - Description: Consumes memory resources
  - Tools: stress-ng --vm, litmuschaos pod-memory-hog
  - Purpose: Tests OOM killer, memory limits, graceful degradation
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Disk Fill** (Storage)
  - Description: Fills disk space
  - Tools: dd, fallocate, litmuschaos pod-disk-fill
  - Purpose: Tests disk space monitoring, log rotation, graceful failure
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Disk I/O Stress** (Storage)
  - Description: Generates heavy disk I/O
  - Tools: stress-ng --hdd, fio
  - Purpose: Tests disk I/O throttling, query performance, backup impact
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Process Kill** (Compute)
  - Description: Kills application process
  - Tools: pkill, kill, systemctl stop
  - Purpose: Tests process supervisor, graceful shutdown, restart behavior
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Time Skew** (Time)
  - Description: Changes system clock
  - Tools: date, chaos-mesh time-chaos
  - Purpose: Tests token validation, scheduled jobs, TTL handling
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**AZ Failure** (Cloud)
  - Description: Isolates/terminates all resources in an AZ
  - Tools: AWS AZ isolation, chaos-mesh zone failure
  - Purpose: Tests multi-AZ architecture, failover, data replication
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration

**Region Failure** (Cloud)
  - Description: Simulates complete region outage
  - Tools: DNS failover, region isolation
  - Purpose: Tests multi-region DR, global load balancing, data sync
  - Implementation considerations: Environment preparation, safety controls, rollback procedures, monitoring configuration


### Advanced Resilience Pattern Implementations


**Bulkhead Isolation** (Resource)
  - Description: Isolates resources per dependency to prevent cascading failures
  - Tools/Technologies: Thread pool per dependency, connection pool per dependency, semaphore per dependency
  - Implementation: Configure separate thread pools for each downstream service; set pool sizes based on expected concurrency; implement queue for overflow; monitor pool utilization
  - Verification: Validate with chaos experiments that specifically test bulkhead isolation

**Health Check API** (Observability)
  - Description: Standardized health check endpoint for all services
  - Tools/Technologies: /health, /ready, /live endpoints, Kubernetes probes
  - Implementation: Implement three endpoints: /health (overall), /ready (ready for traffic), /live (process alive); include dependency status; return 200/503 appropriately
  - Verification: Validate with chaos experiments that specifically test health check api

**Graceful Shutdown** (Application)
  - Description: Handle SIGTERM for clean pod termination
  - Tools/Technologies: signal.Notify, preStop hook, draining connections
  - Implementation: Catch SIGTERM; stop accepting new requests; drain in-flight requests; close connections; flush buffers; exit within terminationGracePeriodSeconds
  - Verification: Validate with chaos experiments that specifically test graceful shutdown

**Retry with Backoff** (Application)
  - Description: Retry failed operations with exponential backoff and jitter
  - Tools/Technologies: Exponential backoff, jitter, retry budgets, circuit breakers
  - Implementation: Implement exponential backoff: delay = initialDelay * multiplier^attempt; add jitter: delay = delay * (0.5 + random); set max retries (3); use retry budgets
  - Verification: Validate with chaos experiments that specifically test retry with backoff

**Timeout Hierarchy** (Application)
  - Description: Maintain consistent timeout hierarchy across service calls
  - Tools/Technologies: Client timeout < service timeout < API gateway timeout
  - Implementation: Ensure each layer has a shorter timeout than the calling layer; document timeout values; verify hierarchy in experiments
  - Verification: Validate with chaos experiments that specifically test timeout hierarchy

**Cache-Aside with Fallback** (Data)
  - Description: Read from cache, fall back to database on cache miss
  - Tools/Technologies: Redis, Memcached, database read replicas
  - Implementation: Check cache; on hit return cached value; on miss query database; populate cache asynchronously; handle cache failure gracefully
  - Verification: Validate with chaos experiments that specifically test cache-aside with fallback

**Circuit Breaker** (Resilience)
  - Description: Fail fast when downstream service is unhealthy
  - Tools/Technologies: Hystrix, Resilience4j, pybreaker, istio
  - Implementation: Configure failure threshold; set open state duration; implement half-open probe; provide fallback; monitor state changes
  - Verification: Validate with chaos experiments that specifically test circuit breaker

**Load Shedding** (Resilience)
  - Description: Reject excess requests to protect system
  - Tools/Technologies: Rate limiting, admission control, queue sizing
  - Implementation: Define max capacity; implement sliding window rate limiter; return 429 with Retry-After; monitor rejection rate; adjust dynamically
  - Verification: Validate with chaos experiments that specifically test load shedding

**Request Deduplication** (Application)
  - Description: Prevent duplicate processing of identical requests
  - Tools/Technologies: Idempotency keys, request hashing, dedup cache
  - Implementation: Generate idempotency key per request; check dedup cache before processing; store completed keys with TTL; handle collisions
  - Verification: Validate with chaos experiments that specifically test request deduplication

**Service Mesh** (Infrastructure)
  - Description: Offload resilience concerns to sidecar proxy
  - Tools/Technologies: Istio, Linkerd, Consul Connect, Envoy
  - Implementation: Implement sidecar injection; configure retry/timeout policies; enable fault injection; use mTLS; monitor mesh telemetry
  - Verification: Validate with chaos experiments that specifically test service mesh


### Observability Integration Patterns


**Structured Logging**
  - Description: Emit JSON-structured logs with experiment context (experiment_id, hypothesis_id, failure_type)
  - Configuration: All services should include experiment_id in log context when an experiment is active

**Distributed Tracing**
  - Description: Propagate experiment context via trace headers (x-chaos-experiment-id)
  - Configuration: Enable trace sampling at 100% during experiments; compare traces against baseline

**Metrics Export**
  - Description: Export experiment-specific metrics to monitoring system
  - Configuration: chaos_experiment_* metrics; steady state deviation metrics; circuit breaker metrics

**Alert Integration**
  - Description: Route experiment alerts to appropriate channels
  - Configuration: Separate alert routing for experiment alerts vs production alerts

**Dashboard Automation**
  - Description: Auto-generate experiment dashboards on experiment start
  - Configuration: Grafana API provisioning; pre-built dashboard templates per experiment type

**Log Aggregation**
  - Description: Aggregate logs across all affected services
  - Configuration: Centralized logging with experiment_id filter; log correlation across services

**Anomaly Detection**
  - Description: Detect anomalies during experiment execution
  - Configuration: Baseline comparison; statistical process control; ML-based anomaly detection

**SLO Monitoring**
  - Description: Track SLO compliance during experiments
  - Configuration: Error budget consumption rate; burn rate alerts; SLO violation detection

**Dependency Mapping**
  - Description: Auto-discover service dependencies during experiments
  - Configuration: Service graph; trace dependency analysis; connection tracking

**Blast Radius Tracking**
  - Description: Real-time blast radius monitoring
  - Configuration: Count affected instances; track traffic percentage; monitor error propagation


### Maturity Level Transition Paths


**Level 1 to Level 2: Ad-Hoc to Repeatable**
  - Transition steps: Implement experiment template; deploy basic tooling; document process; train engineers; schedule monthly experiments

**Level 2 to Level 3: Repeatable to Automated**
  - Transition steps: Automate top 10 experiments; implement auto-rollback; create dashboards; integrate with CI/CD for pre-deploy checks

**Level 3 to Level 4: Automated to Continuous**
  - Transition steps: Implement continuous experiment scheduling; risk-based experiment selection; GameDay automation; resilience scorecards

**Level 4 to Level 5: Continuous to Proactive**
  - Transition steps: ML-based failure prediction; auto-experiment generation; self-healing validation; organization-wide resilience culture


### CI/CD Pipeline Experiment Templates


**Pre-Deploy Safety Check**
  - Tool: GitHub Actions
  - Stage: pre-deploy
  - Purpose: Verifies circuit breaker configs, timeout hierarchies, and health check endpoints before deployment approval

**Post-Deploy Canary Validation**
  - Tool: Argo Rollouts
  - Stage: post-deploy
  - Purpose: Injects failures on canary instances to validate new deployment handles failures correctly

**Weekly Resilience Scan**
  - Tool: CronJob
  - Stage: scheduled
  - Purpose: Runs full experiment suite across all services on weekly basis to catch regressions

**Change-Risk Assessment**
  - Tool: Custom Pipeline
  - Stage: pre-deploy
  - Purpose: Analyzes code changes and schedules targeted experiments based on changed components

**Regression Experiment Suite**
  - Tool: LitmusChaos + CI
  - Stage: post-deploy
  - Purpose: Runs predefined set of experiments that must pass before deployment is considered successful

**GameDay Automation**
  - Tool: Argo Workflows
  - Stage: scheduled
  - Purpose: Fully automated GameDay with scenario injection, monitoring, and retro data collection


### Kubernetes Chaos Experiment Catalog


**Pod Disruption Budget Compliance**
  - Purpose: Verify PDB allows desired number of pods to be disrupted
  - Kubernetes Resource: policy/v1 PodDisruptionBudget

**Horizontal Pod Autoscaler Response**
  - Purpose: Verify HPA scales up/down correctly under load
  - Kubernetes Resource: autoscaling/v1 HorizontalPodAutoscaler

**Cluster Autoscaler Scaling**
  - Purpose: Verify cluster autoscaler adds/removes nodes
  - Kubernetes Resource: Cluster Autoscaler configuration

**Network Policy Enforcement**
  - Purpose: Verify network policies correctly isolate services
  - Kubernetes Resource: networking.k8s.io NetworkPolicy

**Resource Quota Enforcement**
  - Purpose: Verify resource quotas prevent over-allocation
  - Kubernetes Resource: core/v1 ResourceQuota

**Priority Class Preemption**
  - Purpose: Verify high-priority pods preempt low-priority pods
  - Kubernetes Resource: scheduling.k8s.io PriorityClass

**Pod Topology Spread**
  - Purpose: Verify pods are spread across topology domains
  - Kubernetes Resource: core/v1 Pod topologySpreadConstraints

**Volume Expansion**
  - Purpose: Verify PVC expansion works correctly
  - Kubernetes Resource: storage.k8s.io VolumeExpansion

**Storage Class Default**
  - Purpose: Verify default storage class is correctly configured
  - Kubernetes Resource: storage.k8s.io StorageClass

**Ingress Controller Failover**
  - Purpose: Verify ingress controller handles failures
  - Kubernetes Resource: networking.k8s.io Ingress

**Service Mesh mTLS**
  - Purpose: Verify service mesh mTLS between services
  - Kubernetes Resource: Istio PeerAuthentication

**Certificate Management**
  - Purpose: Verify cert-manager auto-renews certificates
  - Kubernetes Resource: cert-manager Certificate

### Comprehensive Failure Mode Reference

This reference catalog covers all failure modes that chaos experiments should address, organized by system layer.


### Compute Layer

  - **EC2 Instance Termination** - Terminate EC2 instances via AWS API
  -   Focus: ASG replacement, connection draining
  -   Scope: 20% instances
  -   Duration: 120s
  - **ECS Task Stop** - Stop ECS tasks
  -   Focus: Service auto-recovery
  -   Scope: 25% tasks
  -   Duration: 60s
  - **Lambda Throttle** - Throttle Lambda function invocations
  -   Focus: Concurrent execution limit
  -   Scope: 50% invocations
  -   Duration: 300s
  - **Container OOM** - Force container memory limit exceeded
  -   Focus: OOM killer, restart policy
  -   Scope: 1 container
  -   Duration: 30s
  - **Process Hang** - Suspend process with SIGSTOP
  -   Focus: Process supervisor, timeout
  -   Scope: 1 process
  -   Duration: 60s
  - **Process Zombie** - Create zombie processes
  -   Focus: Process reaping
  -   Scope: 5 processes
  -   Duration: 120s
  - **Thread Deadlock** - Induce thread deadlock
  -   Focus: Deadlock detection
  -   Scope: 1 service instance
  -   Duration: 180s
  - **File Descriptor Exhaustion** - Open files until FD limit reached
  -   Focus: FD monitoring, graceful failure
  -   Scope: 1 container
  -   Duration: 60s
  - **Connection Limit** - Reduce max connections below current usage
  -   Focus: Connection pooling, queuing
  -   Scope: 25% reduction
  -   Duration: 300s
  - **Worker Pool Exhaustion** - Occupy all worker threads
  -   Focus: Queue growth, request rejection
  -   Scope: 1 service instance
  -   Duration: 120s


### Network Layer (30)

  - **Symmetric Latency** - Add equal latency to all traffic
  -   Focus: Timeout handling
  -   Scope: 50% instances
  -   Duration: 180s
  - **Asymmetric Latency** - Add different latency to different traffic directions
  -   Focus: Timeout handling
  -   Scope: 30% traffic
  -   Duration: 180s
  - **Burst Latency** - Add latency in bursts
  -   Focus: Transient failure handling
  -   Scope: 10% traffic
  -   Duration: 300s
  - **Random Packet Loss** - Drop random packets
  -   Focus: Retry logic, data integrity
  -   Scope: 5% packets
  -   Duration: 180s
  - **Burst Packet Loss** - Drop packets in bursts
  -   Focus: Connection resilience
  -   Scope: 25% packets
  -   Duration: 60s
  - **Correlated Packet Loss** - Drop correlated packets
  -   Focus: TCP behavior, retransmission
  -   Scope: 10% packets
  -   Duration: 180s
  - **Packet Corruption** - Corrupt packet data
  -   Focus: Checksum validation
  -   Scope: 1% packets
  -   Duration: 120s
  - **Packet Duplication** - Duplicate packets
  -   Focus: Idempotency handling
  -   Scope: 2% packets
  -   Duration: 120s
  - **Packet Reordering** - Reorder packets
  -   Focus: Protocol handling
  -   Scope: 5% packets
  -   Duration: 120s
  - **Bandwidth Limit** - Restrict network bandwidth
  -   Focus: Streaming, large payloads
  -   Scope: 1 Mbps limit
  -   Duration: 300s
  - **Connection Refused** - Refuse new TCP connections
  -   Focus: Reconnection logic
  -   Scope: 100% traffic
  -   Duration: 120s
  - **Connection Reset** - Reset established TCP connections
  -   Focus: Connection handling
  -   Scope: 50% traffic
  -   Duration: 60s
  - **Slow DNS Response** - Delay DNS responses
  -   Focus: DNS caching, timeout
  -   Scope: 2s delay
  -   Duration: 300s
  - **Wrong DNS Response** - Return incorrect DNS results
  -   Focus: DNS validation
  -   Scope: 100% queries
  -   Duration: 180s
  - **DNS Server Failure** - Make DNS servers unresponsive
  -   Focus: Fallback resolvers
  -   Scope: 100% queries
  -   Duration: 120s
  - **TLS Handshake Failure** - Fail TLS handshake
  -   Focus: TLS error handling
  -   Scope: 100% connections
  -   Duration: 300s
  - **TLS Version Mismatch** - Negotiate unsupported TLS version
  -   Focus: TLS negotiation
  -   Scope: 100% connections
  -   Duration: 180s
  - **Certificate Expired** - Present expired certificate
  -   Focus: Certificate validation
  -   Scope: 100% connections
  -   Duration: 300s
  - **Certificate Wrong Host** - Present cert for wrong hostname
  -   Focus: Hostname validation
  -   Scope: 100% connections
  -   Duration: 180s
  - **Untrusted CA** - Present cert from untrusted CA
  -   Focus: CA validation, certificate pinning
  -   Scope: 100% connections
  -   Duration: 120s
  - **mTLS Certificate Failure** - Fail client certificate presentation
  -   Focus: mTLS validation
  -   Scope: 100% requests
  -   Duration: 180s
  - **Load Balancer Deregistration** - Remove instance from LB target group
  -   Focus: Connection draining
  -   Scope: 25% instances
  -   Duration: 120s
  - **Health Check Failure** - Fail health check endpoint
  -   Focus: Health check logic
  -   Scope: 50% instances
  -   Duration: 180s
  - **Sticky Session Break** - Break session affinity
  -   Focus: Session handling
  -   Scope: 25% traffic
  -   Duration: 300s
  - **Reverse Proxy Failure** - NGINX/Envoy process crash
  -   Focus: Proxy redundancy
  -   Scope: 1 proxy instance
  -   Duration: 120s
  - **API Gateway Throttle** - Trigger API gateway throttling
  -   Focus: Rate limit handling
  -   Scope: 50% traffic
  -   Duration: 300s
  - **Network Policy Block** - Apply restrictive network policy
  -   Focus: Network policy enforcement
  -   Scope: 100% traffic to target
  -   Duration: 180s
  - **Service Mesh Sidecar Failure** - Sidecar proxy crash
  -   Focus: Service mesh resilience
  -   Scope: 25% sidecars
  -   Duration: 120s
  - **Load Balancer Saturation** - Saturate load balancer capacity
  -   Focus: LB scaling
  -   Scope: 100% capacity
  -   Duration: 300s
  - **Cross-Region Latency** - Add latency between regions
  -   Focus: Cross-region communication
  -   Scope: 100% cross-region traffic
  -   Duration: 600s


### Storage Layer (20)

  - **Disk Read Latency** - Increase disk read latency
  -   Focus: I/O timeout, retry
  -   Scope: 50% reads
  -   Duration: 180s
  - **Disk Write Latency** - Increase disk write latency
  -   Focus: Write timeout, buffer
  -   Scope: 50% writes
  -   Duration: 180s
  - **Disk Read Error** - Return I/O errors on reads
  -   Focus: Error handling, retry
  -   Scope: 25% reads
  -   Duration: 120s
  - **Disk Write Error** - Return I/O errors on writes
  -   Focus: Error handling, data integrity
  -   Scope: 25% writes
  -   Duration: 120s
  - **Disk Full** - Fill disk to capacity
  -   Focus: Space monitoring, log rotation
  -   Scope: 100% disk
  -   Duration: 60s
  - **Inode Exhaustion** - Exhaust inode capacity
  -   Focus: File creation limits
  -   Scope: 100% inodes
  -   Duration: 60s
  - **Disk Slow** - Throttle disk I/O performance
  -   Focus: Performance monitoring
  -   Scope: 50% throughput
  -   Duration: 180s
  - **Mount Point Failure** - Unmount filesystem
  -   Focus: Mount monitoring, failover
  -   Scope: 1 mount point
  -   Duration: 120s
  - **NFS Server Failure** - NFS server becomes unavailable
  -   Focus: NFS failover
  -   Scope: 100% NFS operations
  -   Duration: 180s
  - **EBS Volume Detachment** - Detach EBS volume from EC2
  -   Focus: Volume reattachment
  -   Scope: 1 volume
  -   Duration: 120s
  - **S3 Bucket Inaccessible** - Block S3 bucket access
  -   Focus: S3 error handling
  -   Scope: 100% S3 operations
  -   Duration: 180s
  - **S3 Bucket Deletion** - Delete S3 bucket
  -   Focus: Bucket recovery
  -   Scope: 1 bucket
  -   Duration: 300s
  - **EFS Mount Failure** - EFS mount becomes unavailable
  -   Focus: EFS failover
  -   Scope: 100% EFS operations
  -   Duration: 120s
  - **File Permission Denied** - Change file permissions to deny access
  -   Focus: Permission handling
  -   Scope: 1 directory
  -   Duration: 60s
  - **Disk Quota Exceeded** - Exceed disk quota limit
  -   Focus: Quota monitoring
  -   Scope: 1 user/container
  -   Duration: 60s
  - **RAID Degradation** - Simulate RAID disk failure
  -   Focus: RAID rebuild
  -   Scope: 1 disk
  -   Duration: 300s
  - **Snapshot Failure** - Fail volume snapshot operation
  -   Focus: Backup monitoring
  -   Scope: 100% snapshots
  -   Duration: 180s
  - **Backup Corruption** - Corrupt backup files
  -   Focus: Backup verification
  -   Scope: 1 backup
  -   Duration: 300s
  - **Data Directory Corruption** - Corrupt data directory structure
  -   Focus: Data integrity, recovery
  -   Scope: 1 directory
  -   Duration: 180s
  - **Config File Deletion** - Delete application config files
  -   Focus: Config management, defaults
  -   Scope: 1 file
  -   Duration: 60s


### Detailed Experiment Parameter Sets

This section provides detailed parameter configurations for common experiment types, covering all configurable options.

**Pod Delete Parameters**:
  - TOTAL_CHAOS_DURATION
  - CHAOS_INTERVAL
  - FORCE
  - PODS_AFFECTED_PERC
  - TARGET_PODS
  - SEQUENCE
  - RAMP_TIME
  - DELETE_STS_PODS

**Network Latency Parameters**:
  - NETWORK_LATENCY
  - JITTER
  - LATENCY_DISTRIBUTION
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC
  - TARGET_SERVICE_PORT
  - DESTINATION_IPS
  - DESTINATION_HOSTS
  - SOURCE_PORTS
  - DESTINATION_PORTS

**Network Loss Parameters**:
  - NETWORK_PACKET_LOSS_PERCENTAGE
  - LOSS_CORRELATION
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC
  - TARGET_SERVICE_PORT
  - DESTINATION_IPS

**CPU Stress Parameters**:
  - CPU_CORES
  - CPU_LOAD
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC
  - TARGET_CONTAINER

**Memory Stress Parameters**:
  - MEMORY_CONSUMPTION
  - MEMORY_PERCENTAGE
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC
  - TARGET_CONTAINER

**Disk Fill Parameters**:
  - FILL_PERCENTAGE
  - FILL_COUNT
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC
  - TARGET_CONTAINER
  - DATA_BLOCK_SIZE
  - DATA_BLOCK_COUNT

**Disk Stress Parameters**:
  - FILESYSTEM_UTILIZATION_PERCENTAGE
  - FILESYSTEM_UTILIZATION_PATH
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC

**DNS Chaos Parameters**:
  - DNS_SERVER
  - DNS_DOMAIN_PATTERNS
  - TOTAL_CHAOS_DURATION
  - PODS_AFFECTED_PERC

**HTTP Chaos Parameters**:
  - TARGET_SERVICE_PORT
  - TARGET_ENDPOINT
  - RESPONSE_CODE
  - CONTENT_TYPE
  - HTTP_METHODS
  - RESPONSE_DURATION
  - BODY
  - TOTAL_CHAOS_DURATION

**Container Kill Parameters**:
  - TARGET_CONTAINER
  - TOTAL_CHAOS_DURATION
  - CHAOS_INTERVAL
  - PODS_AFFECTED_PERC
  - SIGNAL
  - GRACE_PERIOD

**Node Drain Parameters**:
  - NODE_NAME
  - DRAIN_TIMEOUT
  - IGNORE_DAEMONSETS
  - DELETE_EMPTYDIR_DATA
  - DISABLE_EVICTION

**Node CPU Hog Parameters**:
  - NODE_CPU_CORE
  - NODE_CPU_PERCENTAGE
  - TOTAL_CHAOS_DURATION
  - NODE_LABEL

**Node Memory Hog Parameters**:
  - NODE_MEMORY_PERCENTAGE
  - TOTAL_CHAOS_DURATION
  - NODE_LABEL

**Kubelet Service Kill Parameters**:
  - TARGET_NODE
  - SERVICE_RESTART
  - TOTAL_CHAOS_DURATION

**Docker Service Kill Parameters**:
  - TARGET_NODE
  - SERVICE_RESTART
  - TOTAL_CHAOS_DURATION


### Cloud Provider Chaos Experiment Configurations


**Compute**:
  - AWS: EC2 (Terminate, Stop, Reboot)
  - Azure: VM (Deallocate, Restart)
  - GCP: Compute Engine (Stop, Delete)

**Database**:
  - AWS: RDS (Failover, Stop, Snapshot)
  - Azure: Azure SQL (Failover)
  - GCP: Cloud SQL (Failover)

**Kubernetes**:
  - AWS: EKS (Pod Delete, Node Drain)
  - Azure: AKS (Pod Delete, Node Drain)
  - GCP: GKE (Pod Delete, Node Drain)

**Network**:
  - AWS: Load Balancer (Deregister)
  - Azure: Load Balancer (Deregister)
  - GCP: Load Balancer (Deregister)

**Storage**:
  - AWS: EBS (Detach, Snapshot)
  - Azure: Managed Disk (Detach)
  - GCP: Persistent Disk (Detach)

**DNS**:
  - AWS: Route53 (Failover)
  - Azure: DNS Zone (Delete)
  - GCP: Cloud DNS (Delete)

**IAM**:
  - AWS: Role (Detach Policy)
  - Azure: Role (Detach)
  - GCP: IAM (Revoke Access)

**Queue**:
  - AWS: SQS (Visibility Timeout)
  - Azure: Service Bus (Disable)
  - GCP: Pub/Sub (Detach Subscription)

**Cache**:
  - AWS: ElastiCache (Reboot)
  - Azure: Redis Cache (Reboot)
  - GCP: Memorystore (Failover)

**CDN**:
  - AWS: CloudFront (Disable)
  - Azure: CDN Profile (Disable)
  - GCP: Cloud CDN (Disable)

### Steady State Baseline Collection Methodology

This section provides a comprehensive guide to collecting and validating steady state baselines for chaos experiments.

**Metric 1: p95 Latency (ms)**
  - Source: Datadog
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 110 ms
  - Acceptable Range: 85 - 135 ms
  - Collection Window: 1m
  - Aggregation: max

**Metric 2: p50 Latency (ms)**
  - Source: Grafana
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 120 ms
  - Acceptable Range: 90 - 150 ms
  - Collection Window: 10m
  - Aggregation: min

**Metric 3: Error Rate (%)**
  - Source: CloudWatch
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 130 %
  - Acceptable Range: 95 - 165 %
  - Collection Window: 30m
  - Aggregation: p99

**Metric 4: Request Rate (req/s)**
  - Source: New Relic
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 140 req/s
  - Acceptable Range: 100 - 180 req/s
  - Collection Window: 1h
  - Aggregation: p95

**Metric 5: CPU Utilization (%)**
  - Source: Graphite
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 150 %
  - Acceptable Range: 105 - 195 %
  - Collection Window: 5m
  - Aggregation: p50

**Metric 6: Memory Utilization (%)**
  - Source: InfluxDB
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 160 %
  - Acceptable Range: 110 - 210 %
  - Collection Window: 1m
  - Aggregation: sum

**Metric 7: Disk I/O (MB/s)**
  - Source: Elastic APM
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 170 MB/s
  - Acceptable Range: 115 - 225 MB/s
  - Collection Window: 10m
  - Aggregation: count

**Metric 8: Network Throughput (Mbps)**
  - Source: Jaeger
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 180 Mbps
  - Acceptable Range: 120 - 240 Mbps
  - Collection Window: 30m
  - Aggregation: rate

**Metric 9: Connection Count (count)**
  - Source: Zipkin
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 190 count
  - Acceptable Range: 125 - 255 count
  - Collection Window: 1h
  - Aggregation: irate

**Metric 10: Queue Depth (count)**
  - Source: Prometheus
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 200 count
  - Acceptable Range: 130 - 270 count
  - Collection Window: 5m
  - Aggregation: avg

**Metric 11: Cache Hit Ratio (ratio)**
  - Source: Datadog
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 210 ratio
  - Acceptable Range: 135 - 285 ratio
  - Collection Window: 1m
  - Aggregation: max

**Metric 12: GC Pause Time (ms)**
  - Source: Grafana
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 220 ms
  - Acceptable Range: 140 - 300 ms
  - Collection Window: 10m
  - Aggregation: min

**Metric 13: Thread Pool Active (count)**
  - Source: CloudWatch
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 230 count
  - Acceptable Range: 145 - 315 count
  - Collection Window: 30m
  - Aggregation: p99

**Metric 14: Connection Pool Active (count)**
  - Source: New Relic
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 240 count
  - Acceptable Range: 150 - 330 count
  - Collection Window: 1h
  - Aggregation: p95

**Metric 15: DNS Resolution Time (ms)**
  - Source: Graphite
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 250 ms
  - Acceptable Range: 155 - 345 ms
  - Collection Window: 5m
  - Aggregation: p50

**Metric 16: TLS Handshake Time (ms)**
  - Source: InfluxDB
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 260 ms
  - Acceptable Range: 160 - 360 ms
  - Collection Window: 1m
  - Aggregation: sum

**Metric 17: Database Query Time (ms)**
  - Source: Elastic APM
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 270 ms
  - Acceptable Range: 165 - 375 ms
  - Collection Window: 10m
  - Aggregation: count

**Metric 18: External API Latency (ms)**
  - Source: Jaeger
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 280 ms
  - Acceptable Range: 170 - 390 ms
  - Collection Window: 30m
  - Aggregation: rate

**Metric 19: Message Processing Rate (msg/s)**
  - Source: Zipkin
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 290 msg/s
  - Acceptable Range: 175 - 405 msg/s
  - Collection Window: 1h
  - Aggregation: irate

**Metric 20: p99 Latency (ms)**
  - Source: Prometheus
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 300 ms
  - Acceptable Range: 180 - 420 ms
  - Collection Window: 5m
  - Aggregation: avg

**Metric 21: p95 Latency (ms)**
  - Source: Datadog
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 310 ms
  - Acceptable Range: 185 - 435 ms
  - Collection Window: 1m
  - Aggregation: max

**Metric 22: p50 Latency (ms)**
  - Source: Grafana
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 320 ms
  - Acceptable Range: 190 - 450 ms
  - Collection Window: 10m
  - Aggregation: min

**Metric 23: Error Rate (%)**
  - Source: CloudWatch
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 330 %
  - Acceptable Range: 195 - 465 %
  - Collection Window: 30m
  - Aggregation: p99

**Metric 24: Request Rate (req/s)**
  - Source: New Relic
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 340 req/s
  - Acceptable Range: 200 - 480 req/s
  - Collection Window: 1h
  - Aggregation: p95

**Metric 25: CPU Utilization (%)**
  - Source: Graphite
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 350 %
  - Acceptable Range: 205 - 495 %
  - Collection Window: 5m
  - Aggregation: p50

**Metric 26: Memory Utilization (%)**
  - Source: InfluxDB
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 360 %
  - Acceptable Range: 210 - 510 %
  - Collection Window: 1m
  - Aggregation: sum

**Metric 27: Disk I/O (MB/s)**
  - Source: Elastic APM
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 370 MB/s
  - Acceptable Range: 215 - 525 MB/s
  - Collection Window: 10m
  - Aggregation: count

**Metric 28: Network Throughput (Mbps)**
  - Source: Jaeger
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 380 Mbps
  - Acceptable Range: 220 - 540 Mbps
  - Collection Window: 30m
  - Aggregation: rate

**Metric 29: Connection Count (count)**
  - Source: Zipkin
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 390 count
  - Acceptable Range: 225 - 555 count
  - Collection Window: 1h
  - Aggregation: irate

**Metric 30: Queue Depth (count)**
  - Source: Prometheus
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 400 count
  - Acceptable Range: 230 - 570 count
  - Collection Window: 5m
  - Aggregation: avg

**Metric 31: Cache Hit Ratio (ratio)**
  - Source: Datadog
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 410 ratio
  - Acceptable Range: 235 - 585 ratio
  - Collection Window: 1m
  - Aggregation: max

**Metric 32: GC Pause Time (ms)**
  - Source: Grafana
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 420 ms
  - Acceptable Range: 240 - 600 ms
  - Collection Window: 10m
  - Aggregation: min

**Metric 33: Thread Pool Active (count)**
  - Source: CloudWatch
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 430 count
  - Acceptable Range: 245 - 615 count
  - Collection Window: 30m
  - Aggregation: p99

**Metric 34: Connection Pool Active (count)**
  - Source: New Relic
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 440 count
  - Acceptable Range: 250 - 630 count
  - Collection Window: 1h
  - Aggregation: p95

**Metric 35: DNS Resolution Time (ms)**
  - Source: Graphite
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 450 ms
  - Acceptable Range: 255 - 645 ms
  - Collection Window: 5m
  - Aggregation: p50

**Metric 36: TLS Handshake Time (ms)**
  - Source: InfluxDB
  - Query: rate(http_requests_total{status="5xx"}[5m])
  - Baseline (7d): 460 ms
  - Acceptable Range: 260 - 660 ms
  - Collection Window: 1m
  - Aggregation: sum

**Metric 37: Database Query Time (ms)**
  - Source: Elastic APM
  - Query: avg(rate(cpu_usage[5m]))
  - Baseline (7d): 470 ms
  - Acceptable Range: 265 - 675 ms
  - Collection Window: 10m
  - Aggregation: count

**Metric 38: External API Latency (ms)**
  - Source: Jaeger
  - Query: avg(redis_hit_ratio)
  - Baseline (7d): 480 ms
  - Acceptable Range: 270 - 690 ms
  - Collection Window: 30m
  - Aggregation: rate

**Metric 39: Message Processing Rate (msg/s)**
  - Source: Zipkin
  - Query: sum(rate(kafka_messages_in[5m]))
  - Baseline (7d): 490 msg/s
  - Acceptable Range: 275 - 705 msg/s
  - Collection Window: 1h
  - Aggregation: irate

**Metric 40: p99 Latency (ms)**
  - Source: Prometheus
  - Query: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
  - Baseline (7d): 500 ms
  - Acceptable Range: 280 - 720 ms
  - Collection Window: 5m
  - Aggregation: avg


### Safety Review Checklist (Expanded)

This expanded checklist covers all safety considerations for chaos experiments.

  - Steady State - Question 1: Are steady state metrics defined with acceptable ranges?
  - Blast Radius - Question 2: Is the blast radius calculated and documented?
  - Rollback - Question 3: Are rollback criteria specific and automated?
  - Monitoring - Question 4: Are monitoring dashboards configured and verified?
  - Communication - Question 5: Have all affected teams been notified?
  - Compliance - Question 6: Have compliance requirements been reviewed?
  - Dependencies - Question 7: Are dependency failure modes understood?
  - Environment - Question 8: Is the experiment environment correctly configured?
  - Documentation - Question 9: Is the experiment documented in the tracking system?
  - Hypothesis - Question 10: Is the experiment hypothesis clearly documented?
  - Steady State - Question 11: Are steady state metrics defined with acceptable ranges?
  - Blast Radius - Question 12: Is the blast radius calculated and documented?
  - Rollback - Question 13: Are rollback criteria specific and automated?
  - Monitoring - Question 14: Are monitoring dashboards configured and verified?
  - Communication - Question 15: Have all affected teams been notified?
  - Compliance - Question 16: Have compliance requirements been reviewed?
  - Dependencies - Question 17: Are dependency failure modes understood?
  - Environment - Question 18: Is the experiment environment correctly configured?
  - Documentation - Question 19: Is the experiment documented in the tracking system?
  - Hypothesis - Question 20: Is the experiment hypothesis clearly documented?
  - Steady State - Question 21: Are steady state metrics defined with acceptable ranges?
  - Blast Radius - Question 22: Is the blast radius calculated and documented?
  - Rollback - Question 23: Are rollback criteria specific and automated?
  - Monitoring - Question 24: Are monitoring dashboards configured and verified?
  - Communication - Question 25: Have all affected teams been notified?
  - Compliance - Question 26: Have compliance requirements been reviewed?
  - Dependencies - Question 27: Are dependency failure modes understood?
  - Environment - Question 28: Is the experiment environment correctly configured?
  - Documentation - Question 29: Is the experiment documented in the tracking system?
  - Hypothesis - Question 30: Is the experiment hypothesis clearly documented?
  - Steady State - Question 31: Are steady state metrics defined with acceptable ranges?
  - Blast Radius - Question 32: Is the blast radius calculated and documented?
  - Rollback - Question 33: Are rollback criteria specific and automated?
  - Monitoring - Question 34: Are monitoring dashboards configured and verified?
  - Communication - Question 35: Have all affected teams been notified?
  - Compliance - Question 36: Have compliance requirements been reviewed?
  - Dependencies - Question 37: Are dependency failure modes understood?
  - Environment - Question 38: Is the experiment environment correctly configured?
  - Documentation - Question 39: Is the experiment documented in the tracking system?
  - Hypothesis - Question 40: Is the experiment hypothesis clearly documented?
  - Steady State - Question 41: Are steady state metrics defined with acceptable ranges?
  - Blast Radius - Question 42: Is the blast radius calculated and documented?
  - Rollback - Question 43: Are rollback criteria specific and automated?
  - Monitoring - Question 44: Are monitoring dashboards configured and verified?
  - Communication - Question 45: Have all affected teams been notified?
  - Compliance - Question 46: Have compliance requirements been reviewed?
  - Dependencies - Question 47: Are dependency failure modes understood?
  - Environment - Question 48: Is the experiment environment correctly configured?
  - Documentation - Question 49: Is the experiment documented in the tracking system?
  - Hypothesis - Question 50: Is the experiment hypothesis clearly documented?


### GameDay Preparation Checklists


  - Pre-GameDay (2 weeks): Design scenario timeline with injection points
  - Pre-GameDay (1 week): Identify participants and assign roles
  - Pre-GameDay (1 day): Prepare environment and verify injection scripts
  - GameDay Day: Create communication channels and briefing materials
  - Pre-GameDay (4 weeks): Set up monitoring dashboards for GameDay metrics
  - Pre-GameDay (2 weeks): Brief observers on their role and expectations
  - Pre-GameDay (1 week): Test rollback procedures and abort mechanisms
  - Pre-GameDay (1 day): Prepare retrospective template and action item tracker
  - GameDay Day: Document lessons learned from previous GameDays
  - Pre-GameDay (4 weeks): Define learning objectives for GameDay scenario #10
  - Pre-GameDay (2 weeks): Design scenario timeline with injection points
  - Pre-GameDay (1 week): Identify participants and assign roles
  - Pre-GameDay (1 day): Prepare environment and verify injection scripts
  - GameDay Day: Create communication channels and briefing materials
  - Pre-GameDay (4 weeks): Set up monitoring dashboards for GameDay metrics
  - Pre-GameDay (2 weeks): Brief observers on their role and expectations
  - Pre-GameDay (1 week): Test rollback procedures and abort mechanisms
  - Pre-GameDay (1 day): Prepare retrospective template and action item tracker
  - GameDay Day: Document lessons learned from previous GameDays
  - Pre-GameDay (4 weeks): Define learning objectives for GameDay scenario #20
  - Pre-GameDay (2 weeks): Design scenario timeline with injection points
  - Pre-GameDay (1 week): Identify participants and assign roles
  - Pre-GameDay (1 day): Prepare environment and verify injection scripts
  - GameDay Day: Create communication channels and briefing materials
  - Pre-GameDay (4 weeks): Set up monitoring dashboards for GameDay metrics
  - Pre-GameDay (2 weeks): Brief observers on their role and expectations
  - Pre-GameDay (1 week): Test rollback procedures and abort mechanisms
  - Pre-GameDay (1 day): Prepare retrospective template and action item tracker
  - GameDay Day: Document lessons learned from previous GameDays
  - Pre-GameDay (4 weeks): Define learning objectives for GameDay scenario #30
  - Pre-GameDay (2 weeks): Design scenario timeline with injection points
  - Pre-GameDay (1 week): Identify participants and assign roles
  - Pre-GameDay (1 day): Prepare environment and verify injection scripts
  - GameDay Day: Create communication channels and briefing materials
  - Pre-GameDay (4 weeks): Set up monitoring dashboards for GameDay metrics
  - Pre-GameDay (2 weeks): Brief observers on their role and expectations
  - Pre-GameDay (1 week): Test rollback procedures and abort mechanisms
  - Pre-GameDay (1 day): Prepare retrospective template and action item tracker
  - GameDay Day: Document lessons learned from previous GameDays
  - Pre-GameDay (4 weeks): Define learning objectives for GameDay scenario #40
  - Pre-GameDay (2 weeks): Design scenario timeline with injection points
  - Pre-GameDay (1 week): Identify participants and assign roles
  - Pre-GameDay (1 day): Prepare environment and verify injection scripts
  - GameDay Day: Create communication channels and briefing materials
  - Pre-GameDay (4 weeks): Set up monitoring dashboards for GameDay metrics
  - Pre-GameDay (2 weeks): Brief observers on their role and expectations
  - Pre-GameDay (1 week): Test rollback procedures and abort mechanisms
  - Pre-GameDay (1 day): Prepare retrospective template and action item tracker
  - GameDay Day: Document lessons learned from previous GameDays
  - Pre-GameDay (4 weeks): Define learning objectives for GameDay scenario #50


### Failure Injection Parameter Reference

Detailed parameter descriptions for all failure injection techniques.

  - **Network Loss - Parameter Set 1**
  -   Duration: 35s
  -   Target: checkout-service
  -   Percentage: 11%
  -   Interval: 6s
  -   Ramp Time: 6s

  - **CPU Stress - Parameter Set 1**
  -   Duration: 40s
  -   Target: api-gateway
  -   Percentage: 12%
  -   Interval: 7s
  -   Ramp Time: 7s

  - **Memory Stress - Parameter Set 1**
  -   Duration: 45s
  -   Target: user-service
  -   Percentage: 13%
  -   Interval: 8s
  -   Ramp Time: 8s

  - **Disk Fill - Parameter Set 1**
  -   Duration: 50s
  -   Target: inventory-service
  -   Percentage: 14%
  -   Interval: 9s
  -   Ramp Time: 9s

  - **Pod Delete - Parameter Set 1**
  -   Duration: 55s
  -   Target: payment-service
  -   Percentage: 15%
  -   Interval: 10s
  -   Ramp Time: 10s

  - **Container Kill - Parameter Set 1**
  -   Duration: 60s
  -   Target: checkout-service
  -   Percentage: 16%
  -   Interval: 11s
  -   Ramp Time: 11s

  - **Node Drain - Parameter Set 1**
  -   Duration: 65s
  -   Target: api-gateway
  -   Percentage: 17%
  -   Interval: 12s
  -   Ramp Time: 12s

  - **DNS Chaos - Parameter Set 1**
  -   Duration: 70s
  -   Target: user-service
  -   Percentage: 18%
  -   Interval: 13s
  -   Ramp Time: 13s

  - **HTTP Chaos - Parameter Set 1**
  -   Duration: 75s
  -   Target: inventory-service
  -   Percentage: 19%
  -   Interval: 14s
  -   Ramp Time: 14s

  - **Network Latency - Parameter Set 2**
  -   Duration: 80s
  -   Target: payment-service
  -   Percentage: 20%
  -   Interval: 15s
  -   Ramp Time: 15s

  - **Network Loss - Parameter Set 2**
  -   Duration: 85s
  -   Target: checkout-service
  -   Percentage: 21%
  -   Interval: 16s
  -   Ramp Time: 16s

  - **CPU Stress - Parameter Set 2**
  -   Duration: 90s
  -   Target: api-gateway
  -   Percentage: 22%
  -   Interval: 17s
  -   Ramp Time: 17s

  - **Memory Stress - Parameter Set 2**
  -   Duration: 95s
  -   Target: user-service
  -   Percentage: 23%
  -   Interval: 18s
  -   Ramp Time: 18s

  - **Disk Fill - Parameter Set 2**
  -   Duration: 100s
  -   Target: inventory-service
  -   Percentage: 24%
  -   Interval: 19s
  -   Ramp Time: 19s

  - **Pod Delete - Parameter Set 2**
  -   Duration: 105s
  -   Target: payment-service
  -   Percentage: 25%
  -   Interval: 20s
  -   Ramp Time: 5s

  - **Container Kill - Parameter Set 2**
  -   Duration: 110s
  -   Target: checkout-service
  -   Percentage: 26%
  -   Interval: 21s
  -   Ramp Time: 6s

  - **Node Drain - Parameter Set 2**
  -   Duration: 115s
  -   Target: api-gateway
  -   Percentage: 27%
  -   Interval: 22s
  -   Ramp Time: 7s

  - **DNS Chaos - Parameter Set 2**
  -   Duration: 120s
  -   Target: user-service
  -   Percentage: 28%
  -   Interval: 23s
  -   Ramp Time: 8s

  - **HTTP Chaos - Parameter Set 2**
  -   Duration: 125s
  -   Target: inventory-service
  -   Percentage: 29%
  -   Interval: 24s
  -   Ramp Time: 9s

  - **Network Latency - Parameter Set 3**
  -   Duration: 130s
  -   Target: payment-service
  -   Percentage: 30%
  -   Interval: 5s
  -   Ramp Time: 10s

  - **Network Loss - Parameter Set 3**
  -   Duration: 135s
  -   Target: checkout-service
  -   Percentage: 31%
  -   Interval: 6s
  -   Ramp Time: 11s

  - **CPU Stress - Parameter Set 3**
  -   Duration: 140s
  -   Target: api-gateway
  -   Percentage: 32%
  -   Interval: 7s
  -   Ramp Time: 12s

  - **Memory Stress - Parameter Set 3**
  -   Duration: 145s
  -   Target: user-service
  -   Percentage: 33%
  -   Interval: 8s
  -   Ramp Time: 13s

  - **Disk Fill - Parameter Set 3**
  -   Duration: 150s
  -   Target: inventory-service
  -   Percentage: 34%
  -   Interval: 9s
  -   Ramp Time: 14s

  - **Pod Delete - Parameter Set 3**
  -   Duration: 155s
  -   Target: payment-service
  -   Percentage: 35%
  -   Interval: 10s
  -   Ramp Time: 15s

  - **Container Kill - Parameter Set 3**
  -   Duration: 160s
  -   Target: checkout-service
  -   Percentage: 36%
  -   Interval: 11s
  -   Ramp Time: 16s

  - **Node Drain - Parameter Set 3**
  -   Duration: 165s
  -   Target: api-gateway
  -   Percentage: 37%
  -   Interval: 12s
  -   Ramp Time: 17s

  - **DNS Chaos - Parameter Set 3**
  -   Duration: 170s
  -   Target: user-service
  -   Percentage: 38%
  -   Interval: 13s
  -   Ramp Time: 18s

  - **HTTP Chaos - Parameter Set 3**
  -   Duration: 175s
  -   Target: inventory-service
  -   Percentage: 39%
  -   Interval: 14s
  -   Ramp Time: 19s

  - **Network Latency - Parameter Set 4**
  -   Duration: 180s
  -   Target: payment-service
  -   Percentage: 40%
  -   Interval: 15s
  -   Ramp Time: 5s

  - **Network Loss - Parameter Set 4**
  -   Duration: 185s
  -   Target: checkout-service
  -   Percentage: 41%
  -   Interval: 16s
  -   Ramp Time: 6s

  - **CPU Stress - Parameter Set 4**
  -   Duration: 190s
  -   Target: api-gateway
  -   Percentage: 42%
  -   Interval: 17s
  -   Ramp Time: 7s

  - **Memory Stress - Parameter Set 4**
  -   Duration: 195s
  -   Target: user-service
  -   Percentage: 43%
  -   Interval: 18s
  -   Ramp Time: 8s

  - **Disk Fill - Parameter Set 4**
  -   Duration: 200s
  -   Target: inventory-service
  -   Percentage: 44%
  -   Interval: 19s
  -   Ramp Time: 9s

  - **Pod Delete - Parameter Set 4**
  -   Duration: 205s
  -   Target: payment-service
  -   Percentage: 45%
  -   Interval: 20s
  -   Ramp Time: 10s

  - **Container Kill - Parameter Set 4**
  -   Duration: 210s
  -   Target: checkout-service
  -   Percentage: 46%
  -   Interval: 21s
  -   Ramp Time: 11s

  - **Node Drain - Parameter Set 4**
  -   Duration: 215s
  -   Target: api-gateway
  -   Percentage: 47%
  -   Interval: 22s
  -   Ramp Time: 12s

  - **DNS Chaos - Parameter Set 4**
  -   Duration: 220s
  -   Target: user-service
  -   Percentage: 48%
  -   Interval: 23s
  -   Ramp Time: 13s

  - **HTTP Chaos - Parameter Set 4**
  -   Duration: 225s
  -   Target: inventory-service
  -   Percentage: 49%
  -   Interval: 24s
  -   Ramp Time: 14s

  - **Network Latency - Parameter Set 5**
  -   Duration: 230s
  -   Target: payment-service
  -   Percentage: 10%
  -   Interval: 5s
  -   Ramp Time: 15s

  - **Network Loss - Parameter Set 5**
  -   Duration: 235s
  -   Target: checkout-service
  -   Percentage: 11%
  -   Interval: 6s
  -   Ramp Time: 16s

  - **CPU Stress - Parameter Set 5**
  -   Duration: 240s
  -   Target: api-gateway
  -   Percentage: 12%
  -   Interval: 7s
  -   Ramp Time: 17s

  - **Memory Stress - Parameter Set 5**
  -   Duration: 245s
  -   Target: user-service
  -   Percentage: 13%
  -   Interval: 8s
  -   Ramp Time: 18s

  - **Disk Fill - Parameter Set 5**
  -   Duration: 250s
  -   Target: inventory-service
  -   Percentage: 14%
  -   Interval: 9s
  -   Ramp Time: 19s

  - **Pod Delete - Parameter Set 5**
  -   Duration: 255s
  -   Target: payment-service
  -   Percentage: 15%
  -   Interval: 10s
  -   Ramp Time: 5s

  - **Container Kill - Parameter Set 5**
  -   Duration: 260s
  -   Target: checkout-service
  -   Percentage: 16%
  -   Interval: 11s
  -   Ramp Time: 6s

  - **Node Drain - Parameter Set 5**
  -   Duration: 265s
  -   Target: api-gateway
  -   Percentage: 17%
  -   Interval: 12s
  -   Ramp Time: 7s

  - **DNS Chaos - Parameter Set 5**
  -   Duration: 270s
  -   Target: user-service
  -   Percentage: 18%
  -   Interval: 13s
  -   Ramp Time: 8s

  - **HTTP Chaos - Parameter Set 5**
  -   Duration: 275s
  -   Target: inventory-service
  -   Percentage: 19%
  -   Interval: 14s
  -   Ramp Time: 9s

  - **Network Latency - Parameter Set 6**
  -   Duration: 280s
  -   Target: payment-service
  -   Percentage: 20%
  -   Interval: 15s
  -   Ramp Time: 10s

  - **Network Loss - Parameter Set 6**
  -   Duration: 285s
  -   Target: checkout-service
  -   Percentage: 21%
  -   Interval: 16s
  -   Ramp Time: 11s

  - **CPU Stress - Parameter Set 6**
  -   Duration: 290s
  -   Target: api-gateway
  -   Percentage: 22%
  -   Interval: 17s
  -   Ramp Time: 12s

  - **Memory Stress - Parameter Set 6**
  -   Duration: 295s
  -   Target: user-service
  -   Percentage: 23%
  -   Interval: 18s
  -   Ramp Time: 13s

  - **Disk Fill - Parameter Set 6**
  -   Duration: 300s
  -   Target: inventory-service
  -   Percentage: 24%
  -   Interval: 19s
  -   Ramp Time: 14s

  - **Pod Delete - Parameter Set 6**
  -   Duration: 305s
  -   Target: payment-service
  -   Percentage: 25%
  -   Interval: 20s
  -   Ramp Time: 15s

  - **Container Kill - Parameter Set 6**
  -   Duration: 310s
  -   Target: checkout-service
  -   Percentage: 26%
  -   Interval: 21s
  -   Ramp Time: 16s

  - **Node Drain - Parameter Set 6**
  -   Duration: 315s
  -   Target: api-gateway
  -   Percentage: 27%
  -   Interval: 22s
  -   Ramp Time: 17s

  - **DNS Chaos - Parameter Set 6**
  -   Duration: 320s
  -   Target: user-service
  -   Percentage: 28%
  -   Interval: 23s
  -   Ramp Time: 18s

  - **HTTP Chaos - Parameter Set 6**
  -   Duration: 325s
  -   Target: inventory-service
  -   Percentage: 29%
  -   Interval: 24s
  -   Ramp Time: 19s

  - **Network Latency - Parameter Set 7**
  -   Duration: 330s
  -   Target: payment-service
  -   Percentage: 30%
  -   Interval: 5s
  -   Ramp Time: 5s


### Infrastructure Chaos Experiment Configurations


  - **Azure VM Experiment #1**
  -   Action: stop
  -   Scope: percentage
  -   Count/Percent: 2
  -   Duration: 150s
  -   Failover Expected: No

  - **GCP Compute Experiment #2**
  -   Action: reboot
  -   Scope: tag-based
  -   Count/Percent: 3
  -   Duration: 180s
  -   Failover Expected: Within 60s

  - **K8s Node Experiment #3**
  -   Action: isolate
  -   Scope: single
  -   Count/Percent: 4
  -   Duration: 210s
  -   Failover Expected: Within 120s

  - **Bare Metal Experiment #4**
  -   Action: drain
  -   Scope: percentage
  -   Count/Percent: 5
  -   Duration: 240s
  -   Failover Expected: Manual

  - **VMware Experiment #5**
  -   Action: terminate
  -   Scope: tag-based
  -   Count/Percent: 1
  -   Duration: 270s
  -   Failover Expected: Yes

  - **OpenStack Experiment #6**
  -   Action: stop
  -   Scope: single
  -   Count/Percent: 2
  -   Duration: 300s
  -   Failover Expected: No

  - **DigitalOcean Experiment #7**
  -   Action: reboot
  -   Scope: percentage
  -   Count/Percent: 3
  -   Duration: 330s
  -   Failover Expected: Within 60s

  - **Linode Experiment #8**
  -   Action: isolate
  -   Scope: tag-based
  -   Count/Percent: 4
  -   Duration: 360s
  -   Failover Expected: Within 120s

  - **Hetzner Experiment #9**
  -   Action: drain
  -   Scope: single
  -   Count/Percent: 5
  -   Duration: 390s
  -   Failover Expected: Manual

  - **AWS EC2 Experiment #10**
  -   Action: terminate
  -   Scope: percentage
  -   Count/Percent: 1
  -   Duration: 420s
  -   Failover Expected: Yes

  - **Azure VM Experiment #11**
  -   Action: stop
  -   Scope: tag-based
  -   Count/Percent: 2
  -   Duration: 450s
  -   Failover Expected: No

  - **GCP Compute Experiment #12**
  -   Action: reboot
  -   Scope: single
  -   Count/Percent: 3
  -   Duration: 480s
  -   Failover Expected: Within 60s

  - **K8s Node Experiment #13**
  -   Action: isolate
  -   Scope: percentage
  -   Count/Percent: 4
  -   Duration: 510s
  -   Failover Expected: Within 120s

  - **Bare Metal Experiment #14**
  -   Action: drain
  -   Scope: tag-based
  -   Count/Percent: 5
  -   Duration: 540s
  -   Failover Expected: Manual

  - **VMware Experiment #15**
  -   Action: terminate
  -   Scope: single
  -   Count/Percent: 1
  -   Duration: 570s
  -   Failover Expected: Yes

  - **OpenStack Experiment #16**
  -   Action: stop
  -   Scope: percentage
  -   Count/Percent: 2
  -   Duration: 600s
  -   Failover Expected: No

  - **DigitalOcean Experiment #17**
  -   Action: reboot
  -   Scope: tag-based
  -   Count/Percent: 3
  -   Duration: 630s
  -   Failover Expected: Within 60s

  - **Linode Experiment #18**
  -   Action: isolate
  -   Scope: single
  -   Count/Percent: 4
  -   Duration: 660s
  -   Failover Expected: Within 120s

  - **Hetzner Experiment #19**
  -   Action: drain
  -   Scope: percentage
  -   Count/Percent: 5
  -   Duration: 690s
  -   Failover Expected: Manual

  - **AWS EC2 Experiment #20**
  -   Action: terminate
  -   Scope: tag-based
  -   Count/Percent: 1
  -   Duration: 720s
  -   Failover Expected: Yes

  - **Azure VM Experiment #21**
  -   Action: stop
  -   Scope: single
  -   Count/Percent: 2
  -   Duration: 750s
  -   Failover Expected: No

  - **GCP Compute Experiment #22**
  -   Action: reboot
  -   Scope: percentage
  -   Count/Percent: 3
  -   Duration: 780s
  -   Failover Expected: Within 60s

  - **K8s Node Experiment #23**
  -   Action: isolate
  -   Scope: tag-based
  -   Count/Percent: 4
  -   Duration: 810s
  -   Failover Expected: Within 120s

  - **Bare Metal Experiment #24**
  -   Action: drain
  -   Scope: single
  -   Count/Percent: 5
  -   Duration: 840s
  -   Failover Expected: Manual

  - **VMware Experiment #25**
  -   Action: terminate
  -   Scope: percentage
  -   Count/Percent: 1
  -   Duration: 870s
  -   Failover Expected: Yes

  - **OpenStack Experiment #26**
  -   Action: stop
  -   Scope: tag-based
  -   Count/Percent: 2
  -   Duration: 900s
  -   Failover Expected: No

  - **DigitalOcean Experiment #27**
  -   Action: reboot
  -   Scope: single
  -   Count/Percent: 3
  -   Duration: 930s
  -   Failover Expected: Within 60s

  - **Linode Experiment #28**
  -   Action: isolate
  -   Scope: percentage
  -   Count/Percent: 4
  -   Duration: 960s
  -   Failover Expected: Within 120s

  - **Hetzner Experiment #29**
  -   Action: drain
  -   Scope: tag-based
  -   Count/Percent: 5
  -   Duration: 990s
  -   Failover Expected: Manual

  - **AWS EC2 Experiment #30**
  -   Action: terminate
  -   Scope: single
  -   Count/Percent: 1
  -   Duration: 1020s
  -   Failover Expected: Yes

  - **Azure VM Experiment #31**
  -   Action: stop
  -   Scope: percentage
  -   Count/Percent: 2
  -   Duration: 1050s
  -   Failover Expected: No

  - **GCP Compute Experiment #32**
  -   Action: reboot
  -   Scope: tag-based
  -   Count/Percent: 3
  -   Duration: 1080s
  -   Failover Expected: Within 60s

  - **K8s Node Experiment #33**
  -   Action: isolate
  -   Scope: single
  -   Count/Percent: 4
  -   Duration: 1110s
  -   Failover Expected: Within 120s

  - **Bare Metal Experiment #34**
  -   Action: drain
  -   Scope: percentage
  -   Count/Percent: 5
  -   Duration: 1140s
  -   Failover Expected: Manual

  - **VMware Experiment #35**
  -   Action: terminate
  -   Scope: tag-based
  -   Count/Percent: 1
  -   Duration: 1170s
  -   Failover Expected: Yes

  - **OpenStack Experiment #36**
  -   Action: stop
  -   Scope: single
  -   Count/Percent: 2
  -   Duration: 1200s
  -   Failover Expected: No

  - **DigitalOcean Experiment #37**
  -   Action: reboot
  -   Scope: percentage
  -   Count/Percent: 3
  -   Duration: 1230s
  -   Failover Expected: Within 60s

  - **Linode Experiment #38**
  -   Action: isolate
  -   Scope: tag-based
  -   Count/Percent: 4
  -   Duration: 1260s
  -   Failover Expected: Within 120s

  - **Hetzner Experiment #39**
  -   Action: drain
  -   Scope: single
  -   Count/Percent: 5
  -   Duration: 1290s
  -   Failover Expected: Manual

  - **AWS EC2 Experiment #40**
  -   Action: terminate
  -   Scope: percentage
  -   Count/Percent: 1
  -   Duration: 1320s
  -   Failover Expected: Yes

  - **Azure VM Experiment #41**
  -   Action: stop
  -   Scope: tag-based
  -   Count/Percent: 2
  -   Duration: 1350s
  -   Failover Expected: No

  - **GCP Compute Experiment #42**
  -   Action: reboot
  -   Scope: single
  -   Count/Percent: 3
  -   Duration: 1380s
  -   Failover Expected: Within 60s

  - **K8s Node Experiment #43**
  -   Action: isolate
  -   Scope: percentage
  -   Count/Percent: 4
  -   Duration: 1410s
  -   Failover Expected: Within 120s

  - **Bare Metal Experiment #44**
  -   Action: drain
  -   Scope: tag-based
  -   Count/Percent: 5
  -   Duration: 1440s
  -   Failover Expected: Manual

  - **VMware Experiment #45**
  -   Action: terminate
  -   Scope: single
  -   Count/Percent: 1
  -   Duration: 1470s
  -   Failover Expected: Yes

  - **OpenStack Experiment #46**
  -   Action: stop
  -   Scope: percentage
  -   Count/Percent: 2
  -   Duration: 1500s
  -   Failover Expected: No

  - **DigitalOcean Experiment #47**
  -   Action: reboot
  -   Scope: tag-based
  -   Count/Percent: 3
  -   Duration: 1530s
  -   Failover Expected: Within 60s

  - **Linode Experiment #48**
  -   Action: isolate
  -   Scope: single
  -   Count/Percent: 4
  -   Duration: 1560s
  -   Failover Expected: Within 120s

  - **Hetzner Experiment #49**
  -   Action: drain
  -   Scope: percentage
  -   Count/Percent: 5
  -   Duration: 1590s
  -   Failover Expected: Manual

  - **AWS EC2 Experiment #50**
  -   Action: terminate
  -   Scope: tag-based
  -   Count/Percent: 1
  -   Duration: 1620s
  -   Failover Expected: Yes


### Application Chaos Test Cases


  - **Test Case 1: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 150ms
  -   Error rate impact: 0.2%
  -   Latency impact: 75ms

  - **Test Case 2: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 200ms
  -   Error rate impact: 0.30000000000000004%
  -   Latency impact: 100ms

  - **Test Case 3: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 250ms
  -   Error rate impact: 0.4%
  -   Latency impact: 125ms

  - **Test Case 4: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 300ms
  -   Error rate impact: 0.5%
  -   Latency impact: 150ms

  - **Test Case 5: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 350ms
  -   Error rate impact: 0.6%
  -   Latency impact: 175ms

  - **Test Case 6: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 400ms
  -   Error rate impact: 0.7000000000000001%
  -   Latency impact: 200ms

  - **Test Case 7: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 450ms
  -   Error rate impact: 0.8%
  -   Latency impact: 225ms

  - **Test Case 8: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 500ms
  -   Error rate impact: 0.9%
  -   Latency impact: 250ms

  - **Test Case 9: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 550ms
  -   Error rate impact: 1.0%
  -   Latency impact: 275ms

  - **Test Case 10: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 600ms
  -   Error rate impact: 1.1%
  -   Latency impact: 300ms

  - **Test Case 11: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 650ms
  -   Error rate impact: 1.2000000000000002%
  -   Latency impact: 325ms

  - **Test Case 12: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 700ms
  -   Error rate impact: 1.3000000000000003%
  -   Latency impact: 350ms

  - **Test Case 13: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 750ms
  -   Error rate impact: 1.4000000000000001%
  -   Latency impact: 375ms

  - **Test Case 14: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 800ms
  -   Error rate impact: 1.5000000000000002%
  -   Latency impact: 400ms

  - **Test Case 15: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 850ms
  -   Error rate impact: 1.6%
  -   Latency impact: 425ms

  - **Test Case 16: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 900ms
  -   Error rate impact: 1.7000000000000002%
  -   Latency impact: 450ms

  - **Test Case 17: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 950ms
  -   Error rate impact: 1.8000000000000003%
  -   Latency impact: 475ms

  - **Test Case 18: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 1000ms
  -   Error rate impact: 1.9000000000000001%
  -   Latency impact: 500ms

  - **Test Case 19: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 1050ms
  -   Error rate impact: 2.0%
  -   Latency impact: 525ms

  - **Test Case 20: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 1100ms
  -   Error rate impact: 2.1%
  -   Latency impact: 550ms

  - **Test Case 21: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 1150ms
  -   Error rate impact: 2.2%
  -   Latency impact: 575ms

  - **Test Case 22: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 1200ms
  -   Error rate impact: 2.3000000000000003%
  -   Latency impact: 600ms

  - **Test Case 23: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 1250ms
  -   Error rate impact: 2.4000000000000004%
  -   Latency impact: 625ms

  - **Test Case 24: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 1300ms
  -   Error rate impact: 2.5000000000000004%
  -   Latency impact: 650ms

  - **Test Case 25: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 1350ms
  -   Error rate impact: 2.6%
  -   Latency impact: 675ms

  - **Test Case 26: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 1400ms
  -   Error rate impact: 2.7%
  -   Latency impact: 700ms

  - **Test Case 27: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 1450ms
  -   Error rate impact: 2.8000000000000003%
  -   Latency impact: 725ms

  - **Test Case 28: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 1500ms
  -   Error rate impact: 2.9000000000000004%
  -   Latency impact: 750ms

  - **Test Case 29: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 1550ms
  -   Error rate impact: 3.0000000000000004%
  -   Latency impact: 775ms

  - **Test Case 30: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 1600ms
  -   Error rate impact: 3.1%
  -   Latency impact: 800ms

  - **Test Case 31: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 1650ms
  -   Error rate impact: 3.2%
  -   Latency impact: 825ms

  - **Test Case 32: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 1700ms
  -   Error rate impact: 3.3000000000000003%
  -   Latency impact: 850ms

  - **Test Case 33: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 1750ms
  -   Error rate impact: 3.4000000000000004%
  -   Latency impact: 875ms

  - **Test Case 34: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 1800ms
  -   Error rate impact: 3.5000000000000004%
  -   Latency impact: 900ms

  - **Test Case 35: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 1850ms
  -   Error rate impact: 3.6%
  -   Latency impact: 925ms

  - **Test Case 36: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 1900ms
  -   Error rate impact: 3.7%
  -   Latency impact: 950ms

  - **Test Case 37: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 1950ms
  -   Error rate impact: 3.8000000000000003%
  -   Latency impact: 975ms

  - **Test Case 38: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 2000ms
  -   Error rate impact: 3.9000000000000004%
  -   Latency impact: 1000ms

  - **Test Case 39: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 2050ms
  -   Error rate impact: 4.0%
  -   Latency impact: 1025ms

  - **Test Case 40: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 2100ms
  -   Error rate impact: 4.1%
  -   Latency impact: 1050ms

  - **Test Case 41: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 2150ms
  -   Error rate impact: 4.2%
  -   Latency impact: 1075ms

  - **Test Case 42: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 2200ms
  -   Error rate impact: 4.3%
  -   Latency impact: 1100ms

  - **Test Case 43: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 2250ms
  -   Error rate impact: 4.3999999999999995%
  -   Latency impact: 1125ms

  - **Test Case 44: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 2300ms
  -   Error rate impact: 4.5%
  -   Latency impact: 1150ms

  - **Test Case 45: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 2350ms
  -   Error rate impact: 4.6%
  -   Latency impact: 1175ms

  - **Test Case 46: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 2400ms
  -   Error rate impact: 4.7%
  -   Latency impact: 1200ms

  - **Test Case 47: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 2450ms
  -   Error rate impact: 4.8%
  -   Latency impact: 1225ms

  - **Test Case 48: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 2500ms
  -   Error rate impact: 4.9%
  -   Latency impact: 1250ms

  - **Test Case 49: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 2550ms
  -   Error rate impact: 5.0%
  -   Latency impact: 1275ms

  - **Test Case 50: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 2600ms
  -   Error rate impact: 5.1%
  -   Latency impact: 1300ms

  - **Test Case 51: Checkout service when another-service is slow**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 2650ms
  -   Error rate impact: 5.2%
  -   Latency impact: 1325ms

  - **Test Case 52: Order service when file-storage is unavailable**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 2700ms
  -   Error rate impact: 5.3%
  -   Latency impact: 1350ms

  - **Test Case 53: Inventory service when email-service is slow**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 2750ms
  -   Error rate impact: 5.4%
  -   Latency impact: 1375ms

  - **Test Case 54: User service when sms-service is unavailable**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 2800ms
  -   Error rate impact: 5.5%
  -   Latency impact: 1400ms

  - **Test Case 55: Notification service when push-service is slow**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 2850ms
  -   Error rate impact: 5.6%
  -   Latency impact: 1425ms

  - **Test Case 56: Search service when cdn is unavailable**
  -   Failure mode: timeout
  -   Expected behavior: retry with backoff
  -   Fallback time: 2900ms
  -   Error rate impact: 5.7%
  -   Latency impact: 1450ms

  - **Test Case 57: Analytics service when database is slow**
  -   Failure mode: slow response
  -   Expected behavior: fallback response
  -   Fallback time: 2950ms
  -   Error rate impact: 5.8%
  -   Latency impact: 1475ms

  - **Test Case 58: Auth service when cache is unavailable**
  -   Failure mode: error response
  -   Expected behavior: degraded mode
  -   Fallback time: 3000ms
  -   Error rate impact: 5.9%
  -   Latency impact: 1500ms

  - **Test Case 59: Cart service when message-queue is slow**
  -   Failure mode: connection reset
  -   Expected behavior: queue for later processing
  -   Fallback time: 3050ms
  -   Error rate impact: 6.0%
  -   Latency impact: 1525ms

  - **Test Case 60: Payment service when external-api is unavailable**
  -   Failure mode: connection refused
  -   Expected behavior: circuit breaker opens
  -   Fallback time: 3100ms
  -   Error rate impact: 6.1%
  -   Latency impact: 1550ms


### Database Chaos Experiment Catalog


  - **PostgreSQL Experiment #1**
  -   Failure: replication lag
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 45s
  -   RPO: 5s

  - **MongoDB Experiment #2**
  -   Failure: failover
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 60s
  -   RPO: 30s

  - **Redis Experiment #3**
  -   Failure: slow query
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 75s
  -   RPO: 5m

  - **Cassandra Experiment #4**
  -   Failure: data corruption
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 90s
  -   RPO: 1h

  - **DynamoDB Experiment #5**
  -   Failure: index corruption
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 105s
  -   RPO: 0 (no loss)

  - **CockroachDB Experiment #6**
  -   Failure: deadlock
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 120s
  -   RPO: 5s

  - **Elasticsearch Experiment #7**
  -   Failure: disk full
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 135s
  -   RPO: 30s

  - **Aurora Experiment #8**
  -   Failure: connection timeout
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 150s
  -   RPO: 5m

  - **Spanner Experiment #9**
  -   Failure: query timeout
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 165s
  -   RPO: 1h

  - **MySQL Experiment #10**
  -   Failure: connection pool exhaustion
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 180s
  -   RPO: 0 (no loss)

  - **PostgreSQL Experiment #11**
  -   Failure: replication lag
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 195s
  -   RPO: 5s

  - **MongoDB Experiment #12**
  -   Failure: failover
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 210s
  -   RPO: 30s

  - **Redis Experiment #13**
  -   Failure: slow query
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 225s
  -   RPO: 5m

  - **Cassandra Experiment #14**
  -   Failure: data corruption
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 240s
  -   RPO: 1h

  - **DynamoDB Experiment #15**
  -   Failure: index corruption
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 255s
  -   RPO: 0 (no loss)

  - **CockroachDB Experiment #16**
  -   Failure: deadlock
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 270s
  -   RPO: 5s

  - **Elasticsearch Experiment #17**
  -   Failure: disk full
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 285s
  -   RPO: 30s

  - **Aurora Experiment #18**
  -   Failure: connection timeout
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 300s
  -   RPO: 5m

  - **Spanner Experiment #19**
  -   Failure: query timeout
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 315s
  -   RPO: 1h

  - **MySQL Experiment #20**
  -   Failure: connection pool exhaustion
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 330s
  -   RPO: 0 (no loss)

  - **PostgreSQL Experiment #21**
  -   Failure: replication lag
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 345s
  -   RPO: 5s

  - **MongoDB Experiment #22**
  -   Failure: failover
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 360s
  -   RPO: 30s

  - **Redis Experiment #23**
  -   Failure: slow query
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 375s
  -   RPO: 5m

  - **Cassandra Experiment #24**
  -   Failure: data corruption
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 390s
  -   RPO: 1h

  - **DynamoDB Experiment #25**
  -   Failure: index corruption
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 405s
  -   RPO: 0 (no loss)

  - **CockroachDB Experiment #26**
  -   Failure: deadlock
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 420s
  -   RPO: 5s

  - **Elasticsearch Experiment #27**
  -   Failure: disk full
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 435s
  -   RPO: 30s

  - **Aurora Experiment #28**
  -   Failure: connection timeout
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 450s
  -   RPO: 5m

  - **Spanner Experiment #29**
  -   Failure: query timeout
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 465s
  -   RPO: 1h

  - **MySQL Experiment #30**
  -   Failure: connection pool exhaustion
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 480s
  -   RPO: 0 (no loss)

  - **PostgreSQL Experiment #31**
  -   Failure: replication lag
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 495s
  -   RPO: 5s

  - **MongoDB Experiment #32**
  -   Failure: failover
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 510s
  -   RPO: 30s

  - **Redis Experiment #33**
  -   Failure: slow query
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 525s
  -   RPO: 5m

  - **Cassandra Experiment #34**
  -   Failure: data corruption
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 540s
  -   RPO: 1h

  - **DynamoDB Experiment #35**
  -   Failure: index corruption
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 555s
  -   RPO: 0 (no loss)

  - **CockroachDB Experiment #36**
  -   Failure: deadlock
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 570s
  -   RPO: 5s

  - **Elasticsearch Experiment #37**
  -   Failure: disk full
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 585s
  -   RPO: 30s

  - **Aurora Experiment #38**
  -   Failure: connection timeout
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 600s
  -   RPO: 5m

  - **Spanner Experiment #39**
  -   Failure: query timeout
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 615s
  -   RPO: 1h

  - **MySQL Experiment #40**
  -   Failure: connection pool exhaustion
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 630s
  -   RPO: 0 (no loss)

  - **PostgreSQL Experiment #41**
  -   Failure: replication lag
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 645s
  -   RPO: 5s

  - **MongoDB Experiment #42**
  -   Failure: failover
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 660s
  -   RPO: 30s

  - **Redis Experiment #43**
  -   Failure: slow query
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 675s
  -   RPO: 5m

  - **Cassandra Experiment #44**
  -   Failure: data corruption
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 690s
  -   RPO: 1h

  - **DynamoDB Experiment #45**
  -   Failure: index corruption
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 705s
  -   RPO: 0 (no loss)

  - **CockroachDB Experiment #46**
  -   Failure: deadlock
  -   Impact metric: connection count
  -   Recovery action: failover
  -   RTO: 720s
  -   RPO: 5s

  - **Elasticsearch Experiment #47**
  -   Failure: disk full
  -   Impact metric: replication lag
  -   Recovery action: restore from backup
  -   RTO: 735s
  -   RPO: 30s

  - **Aurora Experiment #48**
  -   Failure: connection timeout
  -   Impact metric: error rate
  -   Recovery action: repair index
  -   RTO: 750s
  -   RPO: 5m

  - **Spanner Experiment #49**
  -   Failure: query timeout
  -   Impact metric: throughput
  -   Recovery action: increase pool
  -   RTO: 765s
  -   RPO: 1h

  - **MySQL Experiment #50**
  -   Failure: connection pool exhaustion
  -   Impact metric: query latency
  -   Recovery action: restart service
  -   RTO: 780s
  -   RPO: 0 (no loss)


### Network Chaos Experiment Catalog


  - **Network Experiment #1**
  -   Type: loss
  -   Scope: pod-to-pod
  -   Severity: medium
  -   Duration: 90s
  -   Impact: +200ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #2**
  -   Type: corruption
  -   Scope: node-to-node
  -   Severity: high
  -   Duration: 120s
  -   Impact: +500ms latency
  -   Expected degradation: severe

  - **Network Experiment #3**
  -   Type: duplication
  -   Scope: AZ-to-AZ
  -   Severity: critical
  -   Duration: 150s
  -   Impact: 5% loss
  -   Expected degradation: complete failure

  - **Network Experiment #4**
  -   Type: reordering
  -   Scope: region-to-region
  -   Severity: low
  -   Duration: 180s
  -   Impact: 25% loss
  -   Expected degradation: minimal

  - **Network Experiment #5**
  -   Type: bandwidth
  -   Scope: service-to-service
  -   Severity: medium
  -   Duration: 210s
  -   Impact: +50ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #6**
  -   Type: partition
  -   Scope: pod-to-pod
  -   Severity: high
  -   Duration: 240s
  -   Impact: +200ms latency
  -   Expected degradation: severe

  - **Network Experiment #7**
  -   Type: dns
  -   Scope: node-to-node
  -   Severity: critical
  -   Duration: 270s
  -   Impact: +500ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #8**
  -   Type: tls
  -   Scope: AZ-to-AZ
  -   Severity: low
  -   Duration: 300s
  -   Impact: 5% loss
  -   Expected degradation: minimal

  - **Network Experiment #9**
  -   Type: proxy
  -   Scope: region-to-region
  -   Severity: medium
  -   Duration: 330s
  -   Impact: 25% loss
  -   Expected degradation: noticeable

  - **Network Experiment #10**
  -   Type: latency
  -   Scope: service-to-service
  -   Severity: high
  -   Duration: 360s
  -   Impact: +50ms latency
  -   Expected degradation: severe

  - **Network Experiment #11**
  -   Type: loss
  -   Scope: pod-to-pod
  -   Severity: critical
  -   Duration: 390s
  -   Impact: +200ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #12**
  -   Type: corruption
  -   Scope: node-to-node
  -   Severity: low
  -   Duration: 420s
  -   Impact: +500ms latency
  -   Expected degradation: minimal

  - **Network Experiment #13**
  -   Type: duplication
  -   Scope: AZ-to-AZ
  -   Severity: medium
  -   Duration: 450s
  -   Impact: 5% loss
  -   Expected degradation: noticeable

  - **Network Experiment #14**
  -   Type: reordering
  -   Scope: region-to-region
  -   Severity: high
  -   Duration: 480s
  -   Impact: 25% loss
  -   Expected degradation: severe

  - **Network Experiment #15**
  -   Type: bandwidth
  -   Scope: service-to-service
  -   Severity: critical
  -   Duration: 510s
  -   Impact: +50ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #16**
  -   Type: partition
  -   Scope: pod-to-pod
  -   Severity: low
  -   Duration: 540s
  -   Impact: +200ms latency
  -   Expected degradation: minimal

  - **Network Experiment #17**
  -   Type: dns
  -   Scope: node-to-node
  -   Severity: medium
  -   Duration: 570s
  -   Impact: +500ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #18**
  -   Type: tls
  -   Scope: AZ-to-AZ
  -   Severity: high
  -   Duration: 600s
  -   Impact: 5% loss
  -   Expected degradation: severe

  - **Network Experiment #19**
  -   Type: proxy
  -   Scope: region-to-region
  -   Severity: critical
  -   Duration: 630s
  -   Impact: 25% loss
  -   Expected degradation: complete failure

  - **Network Experiment #20**
  -   Type: latency
  -   Scope: service-to-service
  -   Severity: low
  -   Duration: 660s
  -   Impact: +50ms latency
  -   Expected degradation: minimal

  - **Network Experiment #21**
  -   Type: loss
  -   Scope: pod-to-pod
  -   Severity: medium
  -   Duration: 690s
  -   Impact: +200ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #22**
  -   Type: corruption
  -   Scope: node-to-node
  -   Severity: high
  -   Duration: 720s
  -   Impact: +500ms latency
  -   Expected degradation: severe

  - **Network Experiment #23**
  -   Type: duplication
  -   Scope: AZ-to-AZ
  -   Severity: critical
  -   Duration: 750s
  -   Impact: 5% loss
  -   Expected degradation: complete failure

  - **Network Experiment #24**
  -   Type: reordering
  -   Scope: region-to-region
  -   Severity: low
  -   Duration: 780s
  -   Impact: 25% loss
  -   Expected degradation: minimal

  - **Network Experiment #25**
  -   Type: bandwidth
  -   Scope: service-to-service
  -   Severity: medium
  -   Duration: 810s
  -   Impact: +50ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #26**
  -   Type: partition
  -   Scope: pod-to-pod
  -   Severity: high
  -   Duration: 840s
  -   Impact: +200ms latency
  -   Expected degradation: severe

  - **Network Experiment #27**
  -   Type: dns
  -   Scope: node-to-node
  -   Severity: critical
  -   Duration: 870s
  -   Impact: +500ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #28**
  -   Type: tls
  -   Scope: AZ-to-AZ
  -   Severity: low
  -   Duration: 900s
  -   Impact: 5% loss
  -   Expected degradation: minimal

  - **Network Experiment #29**
  -   Type: proxy
  -   Scope: region-to-region
  -   Severity: medium
  -   Duration: 930s
  -   Impact: 25% loss
  -   Expected degradation: noticeable

  - **Network Experiment #30**
  -   Type: latency
  -   Scope: service-to-service
  -   Severity: high
  -   Duration: 960s
  -   Impact: +50ms latency
  -   Expected degradation: severe

  - **Network Experiment #31**
  -   Type: loss
  -   Scope: pod-to-pod
  -   Severity: critical
  -   Duration: 990s
  -   Impact: +200ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #32**
  -   Type: corruption
  -   Scope: node-to-node
  -   Severity: low
  -   Duration: 1020s
  -   Impact: +500ms latency
  -   Expected degradation: minimal

  - **Network Experiment #33**
  -   Type: duplication
  -   Scope: AZ-to-AZ
  -   Severity: medium
  -   Duration: 1050s
  -   Impact: 5% loss
  -   Expected degradation: noticeable

  - **Network Experiment #34**
  -   Type: reordering
  -   Scope: region-to-region
  -   Severity: high
  -   Duration: 1080s
  -   Impact: 25% loss
  -   Expected degradation: severe

  - **Network Experiment #35**
  -   Type: bandwidth
  -   Scope: service-to-service
  -   Severity: critical
  -   Duration: 1110s
  -   Impact: +50ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #36**
  -   Type: partition
  -   Scope: pod-to-pod
  -   Severity: low
  -   Duration: 1140s
  -   Impact: +200ms latency
  -   Expected degradation: minimal

  - **Network Experiment #37**
  -   Type: dns
  -   Scope: node-to-node
  -   Severity: medium
  -   Duration: 1170s
  -   Impact: +500ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #38**
  -   Type: tls
  -   Scope: AZ-to-AZ
  -   Severity: high
  -   Duration: 1200s
  -   Impact: 5% loss
  -   Expected degradation: severe

  - **Network Experiment #39**
  -   Type: proxy
  -   Scope: region-to-region
  -   Severity: critical
  -   Duration: 1230s
  -   Impact: 25% loss
  -   Expected degradation: complete failure

  - **Network Experiment #40**
  -   Type: latency
  -   Scope: service-to-service
  -   Severity: low
  -   Duration: 1260s
  -   Impact: +50ms latency
  -   Expected degradation: minimal

  - **Network Experiment #41**
  -   Type: loss
  -   Scope: pod-to-pod
  -   Severity: medium
  -   Duration: 1290s
  -   Impact: +200ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #42**
  -   Type: corruption
  -   Scope: node-to-node
  -   Severity: high
  -   Duration: 1320s
  -   Impact: +500ms latency
  -   Expected degradation: severe

  - **Network Experiment #43**
  -   Type: duplication
  -   Scope: AZ-to-AZ
  -   Severity: critical
  -   Duration: 1350s
  -   Impact: 5% loss
  -   Expected degradation: complete failure

  - **Network Experiment #44**
  -   Type: reordering
  -   Scope: region-to-region
  -   Severity: low
  -   Duration: 1380s
  -   Impact: 25% loss
  -   Expected degradation: minimal

  - **Network Experiment #45**
  -   Type: bandwidth
  -   Scope: service-to-service
  -   Severity: medium
  -   Duration: 1410s
  -   Impact: +50ms latency
  -   Expected degradation: noticeable

  - **Network Experiment #46**
  -   Type: partition
  -   Scope: pod-to-pod
  -   Severity: high
  -   Duration: 1440s
  -   Impact: +200ms latency
  -   Expected degradation: severe

  - **Network Experiment #47**
  -   Type: dns
  -   Scope: node-to-node
  -   Severity: critical
  -   Duration: 1470s
  -   Impact: +500ms latency
  -   Expected degradation: complete failure

  - **Network Experiment #48**
  -   Type: tls
  -   Scope: AZ-to-AZ
  -   Severity: low
  -   Duration: 1500s
  -   Impact: 5% loss
  -   Expected degradation: minimal

  - **Network Experiment #49**
  -   Type: proxy
  -   Scope: region-to-region
  -   Severity: medium
  -   Duration: 1530s
  -   Impact: 25% loss
  -   Expected degradation: noticeable

  - **Network Experiment #50**
  -   Type: latency
  -   Scope: service-to-service
  -   Severity: high
  -   Duration: 1560s
  -   Impact: +50ms latency
  -   Expected degradation: severe


### Resilience Pattern Implementation Details


  - **Retry - Configuration 1**
  -   Parameters: maxRetries, backoff, jitter
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Timeout - Configuration 2**
  -   Parameters: connectTimeout, readTimeout
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Bulkhead - Configuration 3**
  -   Parameters: maxConcurrent, queueSize
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Cache-Aside - Configuration 4**
  -   Parameters: ttl, refreshAhead, fallback
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Queue-Based Load Leveling - Configuration 5**
  -   Parameters: queueDepth, consumerCount
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Health Endpoint Monitoring - Configuration 6**
  -   Parameters: endpoint, interval, threshold
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Leader Election - Configuration 7**
  -   Parameters: leaseDuration, renewDeadline
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Competing Consumers - Configuration 8**
  -   Parameters: instanceCount, prefetchCount
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Scheduler Agent Supervisor - Configuration 9**
  -   Parameters: interval, maxFailures
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Circuit Breaker - Configuration 10**
  -   Parameters: threshold, timeout, fallback
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Retry - Configuration 11**
  -   Parameters: maxRetries, backoff, jitter
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Timeout - Configuration 12**
  -   Parameters: connectTimeout, readTimeout
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Bulkhead - Configuration 13**
  -   Parameters: maxConcurrent, queueSize
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Cache-Aside - Configuration 14**
  -   Parameters: ttl, refreshAhead, fallback
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Queue-Based Load Leveling - Configuration 15**
  -   Parameters: queueDepth, consumerCount
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Health Endpoint Monitoring - Configuration 16**
  -   Parameters: endpoint, interval, threshold
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Leader Election - Configuration 17**
  -   Parameters: leaseDuration, renewDeadline
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Competing Consumers - Configuration 18**
  -   Parameters: instanceCount, prefetchCount
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Scheduler Agent Supervisor - Configuration 19**
  -   Parameters: interval, maxFailures
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Circuit Breaker - Configuration 20**
  -   Parameters: threshold, timeout, fallback
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Retry - Configuration 21**
  -   Parameters: maxRetries, backoff, jitter
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Timeout - Configuration 22**
  -   Parameters: connectTimeout, readTimeout
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Bulkhead - Configuration 23**
  -   Parameters: maxConcurrent, queueSize
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Cache-Aside - Configuration 24**
  -   Parameters: ttl, refreshAhead, fallback
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Queue-Based Load Leveling - Configuration 25**
  -   Parameters: queueDepth, consumerCount
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Health Endpoint Monitoring - Configuration 26**
  -   Parameters: endpoint, interval, threshold
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Leader Election - Configuration 27**
  -   Parameters: leaseDuration, renewDeadline
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Competing Consumers - Configuration 28**
  -   Parameters: instanceCount, prefetchCount
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Scheduler Agent Supervisor - Configuration 29**
  -   Parameters: interval, maxFailures
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Circuit Breaker - Configuration 30**
  -   Parameters: threshold, timeout, fallback
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Retry - Configuration 31**
  -   Parameters: maxRetries, backoff, jitter
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Timeout - Configuration 32**
  -   Parameters: connectTimeout, readTimeout
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Bulkhead - Configuration 33**
  -   Parameters: maxConcurrent, queueSize
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Cache-Aside - Configuration 34**
  -   Parameters: ttl, refreshAhead, fallback
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Queue-Based Load Leveling - Configuration 35**
  -   Parameters: queueDepth, consumerCount
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

  - **Health Endpoint Monitoring - Configuration 36**
  -   Parameters: endpoint, interval, threshold
  -   Testing strategy: inject errors
  -   Validation metric: response time

  - **Leader Election - Configuration 37**
  -   Parameters: leaseDuration, renewDeadline
  -   Testing strategy: simulate slow response
  -   Validation metric: error rate

  - **Competing Consumers - Configuration 38**
  -   Parameters: instanceCount, prefetchCount
  -   Testing strategy: kill service
  -   Validation metric: resource utilization

  - **Scheduler Agent Supervisor - Configuration 39**
  -   Parameters: interval, maxFailures
  -   Testing strategy: exhaust resource
  -   Validation metric: queue depth

  - **Circuit Breaker - Configuration 40**
  -   Parameters: threshold, timeout, fallback
  -   Testing strategy: inject latency
  -   Validation metric: state transitions

### Prometheus Queries for Chaos Experiment Monitoring


  - 1. **p99 latency for checkout-service**
  -    PromQL: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="checkout-service"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 2000
  -    Severity: warning

  - 2. **p95 latency for api-gateway**
  -    PromQL: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 1000
  -    Severity: warning

  - 3. **Request rate for order-service**
  -    PromQL: `sum(rate(http_requests_total{job="order-service"}[5m]))`
  -    Type: throughput
  -    Alert threshold: 500
  -    Severity: info

  - 4. **CPU utilization for user-service pods**
  -    PromQL: `avg(rate(container_cpu_usage_seconds_total{pod=~"user-service-.*"}[5m])) * 100`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: critical

  - 5. **Memory utilization for payment-service pods**
  -    PromQL: `avg(container_memory_working_set_bytes{pod=~"payment-service-.*"} / 1024 / 1024)`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: warning

  - 6. **Active connections for checkout-service**
  -    PromQL: `sum(http_connections_active{job="checkout-service"})`
  -    Type: connections
  -    Alert threshold: 100
  -    Severity: critical

  - 7. **Circuit breaker state for calls to api-gateway**
  -    PromQL: `resilience4j_circuitbreaker_state{name="paymentService"}`
  -    Type: state
  -    Alert threshold: 1
  -    Severity: critical

  - 8. **Retry rate for calls to order-service**
  -    PromQL: `rate(application_retry_calls_total{target="order-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: warning

  - 9. **Fallback invocation rate for user-service**
  -    PromQL: `rate(application_fallback_calls_total{target="user-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: info

  - 10. **Rate of HTTP 5xx errors for payment-service**
  -    PromQL: `sum(rate(http_requests_total{job="payment-service",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="payment-service"}[5m])) * 100`
  -    Type: error rate
  -    Alert threshold: 5
  -    Severity: critical

  - 11. **p99 latency for checkout-service**
  -    PromQL: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="checkout-service"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 2000
  -    Severity: warning

  - 12. **p95 latency for api-gateway**
  -    PromQL: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 1000
  -    Severity: warning

  - 13. **Request rate for order-service**
  -    PromQL: `sum(rate(http_requests_total{job="order-service"}[5m]))`
  -    Type: throughput
  -    Alert threshold: 500
  -    Severity: info

  - 14. **CPU utilization for user-service pods**
  -    PromQL: `avg(rate(container_cpu_usage_seconds_total{pod=~"user-service-.*"}[5m])) * 100`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: critical

  - 15. **Memory utilization for payment-service pods**
  -    PromQL: `avg(container_memory_working_set_bytes{pod=~"payment-service-.*"} / 1024 / 1024)`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: warning

  - 16. **Active connections for checkout-service**
  -    PromQL: `sum(http_connections_active{job="checkout-service"})`
  -    Type: connections
  -    Alert threshold: 100
  -    Severity: critical

  - 17. **Circuit breaker state for calls to api-gateway**
  -    PromQL: `resilience4j_circuitbreaker_state{name="paymentService"}`
  -    Type: state
  -    Alert threshold: 1
  -    Severity: critical

  - 18. **Retry rate for calls to order-service**
  -    PromQL: `rate(application_retry_calls_total{target="order-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: warning

  - 19. **Fallback invocation rate for user-service**
  -    PromQL: `rate(application_fallback_calls_total{target="user-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: info

  - 20. **Rate of HTTP 5xx errors for payment-service**
  -    PromQL: `sum(rate(http_requests_total{job="payment-service",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="payment-service"}[5m])) * 100`
  -    Type: error rate
  -    Alert threshold: 5
  -    Severity: critical

  - 21. **p99 latency for checkout-service**
  -    PromQL: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="checkout-service"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 2000
  -    Severity: warning

  - 22. **p95 latency for api-gateway**
  -    PromQL: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 1000
  -    Severity: warning

  - 23. **Request rate for order-service**
  -    PromQL: `sum(rate(http_requests_total{job="order-service"}[5m]))`
  -    Type: throughput
  -    Alert threshold: 500
  -    Severity: info

  - 24. **CPU utilization for user-service pods**
  -    PromQL: `avg(rate(container_cpu_usage_seconds_total{pod=~"user-service-.*"}[5m])) * 100`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: critical

  - 25. **Memory utilization for payment-service pods**
  -    PromQL: `avg(container_memory_working_set_bytes{pod=~"payment-service-.*"} / 1024 / 1024)`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: warning

  - 26. **Active connections for checkout-service**
  -    PromQL: `sum(http_connections_active{job="checkout-service"})`
  -    Type: connections
  -    Alert threshold: 100
  -    Severity: critical

  - 27. **Circuit breaker state for calls to api-gateway**
  -    PromQL: `resilience4j_circuitbreaker_state{name="paymentService"}`
  -    Type: state
  -    Alert threshold: 1
  -    Severity: critical

  - 28. **Retry rate for calls to order-service**
  -    PromQL: `rate(application_retry_calls_total{target="order-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: warning

  - 29. **Fallback invocation rate for user-service**
  -    PromQL: `rate(application_fallback_calls_total{target="user-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: info

  - 30. **Rate of HTTP 5xx errors for payment-service**
  -    PromQL: `sum(rate(http_requests_total{job="payment-service",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="payment-service"}[5m])) * 100`
  -    Type: error rate
  -    Alert threshold: 5
  -    Severity: critical

  - 31. **p99 latency for checkout-service**
  -    PromQL: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="checkout-service"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 2000
  -    Severity: warning

  - 32. **p95 latency for api-gateway**
  -    PromQL: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 1000
  -    Severity: warning

  - 33. **Request rate for order-service**
  -    PromQL: `sum(rate(http_requests_total{job="order-service"}[5m]))`
  -    Type: throughput
  -    Alert threshold: 500
  -    Severity: info

  - 34. **CPU utilization for user-service pods**
  -    PromQL: `avg(rate(container_cpu_usage_seconds_total{pod=~"user-service-.*"}[5m])) * 100`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: critical

  - 35. **Memory utilization for payment-service pods**
  -    PromQL: `avg(container_memory_working_set_bytes{pod=~"payment-service-.*"} / 1024 / 1024)`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: warning

  - 36. **Active connections for checkout-service**
  -    PromQL: `sum(http_connections_active{job="checkout-service"})`
  -    Type: connections
  -    Alert threshold: 100
  -    Severity: critical

  - 37. **Circuit breaker state for calls to api-gateway**
  -    PromQL: `resilience4j_circuitbreaker_state{name="paymentService"}`
  -    Type: state
  -    Alert threshold: 1
  -    Severity: critical

  - 38. **Retry rate for calls to order-service**
  -    PromQL: `rate(application_retry_calls_total{target="order-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: warning

  - 39. **Fallback invocation rate for user-service**
  -    PromQL: `rate(application_fallback_calls_total{target="user-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: info

  - 40. **Rate of HTTP 5xx errors for payment-service**
  -    PromQL: `sum(rate(http_requests_total{job="payment-service",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="payment-service"}[5m])) * 100`
  -    Type: error rate
  -    Alert threshold: 5
  -    Severity: critical

  - 41. **p99 latency for checkout-service**
  -    PromQL: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="checkout-service"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 2000
  -    Severity: warning

  - 42. **p95 latency for api-gateway**
  -    PromQL: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])) by (le))`
  -    Type: latency
  -    Alert threshold: 1000
  -    Severity: warning

  - 43. **Request rate for order-service**
  -    PromQL: `sum(rate(http_requests_total{job="order-service"}[5m]))`
  -    Type: throughput
  -    Alert threshold: 500
  -    Severity: info

  - 44. **CPU utilization for user-service pods**
  -    PromQL: `avg(rate(container_cpu_usage_seconds_total{pod=~"user-service-.*"}[5m])) * 100`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: critical

  - 45. **Memory utilization for payment-service pods**
  -    PromQL: `avg(container_memory_working_set_bytes{pod=~"payment-service-.*"} / 1024 / 1024)`
  -    Type: utilization
  -    Alert threshold: 80
  -    Severity: warning

  - 46. **Active connections for checkout-service**
  -    PromQL: `sum(http_connections_active{job="checkout-service"})`
  -    Type: connections
  -    Alert threshold: 100
  -    Severity: critical

  - 47. **Circuit breaker state for calls to api-gateway**
  -    PromQL: `resilience4j_circuitbreaker_state{name="paymentService"}`
  -    Type: state
  -    Alert threshold: 1
  -    Severity: critical

  - 48. **Retry rate for calls to order-service**
  -    PromQL: `rate(application_retry_calls_total{target="order-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: warning

  - 49. **Fallback invocation rate for user-service**
  -    PromQL: `rate(application_fallback_calls_total{target="user-service"}[5m])`
  -    Type: rate
  -    Alert threshold: 10
  -    Severity: info

  - 50. **Rate of HTTP 5xx errors for payment-service**
  -    PromQL: `sum(rate(http_requests_total{job="payment-service",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="payment-service"}[5m])) * 100`
  -    Type: error rate
  -    Alert threshold: 5
  -    Severity: critical


### Datadog Query Examples for Chaos Monitoring


  - 1. **error rate for checkout-service**
  -    Query: `sum:trace.servlet.request.errors{service:checkout-service}.as_count() / sum:trace.servlet.request.hits{service:checkout-service}.as_count() * 100`
  -    Aggregation: avg

  - 2. **request rate for order-service**
  -    Query: `sum:trace.servlet.request.hits{service:order-service}.as_rate()`
  -    Aggregation: sum

  - 3. **apdex score for user-service**
  -    Query: `apdex:trace.servlet.request{service:user-service}.as_count()`
  -    Aggregation: max

  - 4. **trace count for inventory-service**
  -    Query: `trace.servlet.request.count{service:inventory-service}`
  -    Aggregation: min

  - 5. **dependency latency for payment-service -> downstream**
  -    Query: `avg:trace.payment-service.duration{destination_service:*}`
  -    Aggregation: count

  - 6. **cache hit ratio for checkout-service cache**
  -    Query: `avg:redis.checkout-service.hit_ratio`
  -    Aggregation: rate

  - 7. **database query performance for order-service**
  -    Query: `avg:ddb.order-service.query_duration.avg`
  -    Aggregation: distinct

  - 8. **message queue depth for user-service queue**
  -    Query: `avg:sqs.user-service.approximate_age_of_oldest_message`
  -    Aggregation: median

  - 9. **infrastructure metrics for inventory-service hosts**
  -    Query: `avg:system.cpu.user{service:inventory-service}`
  -    Aggregation: stddev

  - 10. **p99 by service for payment-service**
  -    Query: `p99:trace.servlet.request.duration{service:payment-service}`
  -    Aggregation: p99

  - 11. **error rate for checkout-service**
  -    Query: `sum:trace.servlet.request.errors{service:checkout-service}.as_count() / sum:trace.servlet.request.hits{service:checkout-service}.as_count() * 100`
  -    Aggregation: avg

  - 12. **request rate for order-service**
  -    Query: `sum:trace.servlet.request.hits{service:order-service}.as_rate()`
  -    Aggregation: sum

  - 13. **apdex score for user-service**
  -    Query: `apdex:trace.servlet.request{service:user-service}.as_count()`
  -    Aggregation: max

  - 14. **trace count for inventory-service**
  -    Query: `trace.servlet.request.count{service:inventory-service}`
  -    Aggregation: min

  - 15. **dependency latency for payment-service -> downstream**
  -    Query: `avg:trace.payment-service.duration{destination_service:*}`
  -    Aggregation: count

  - 16. **cache hit ratio for checkout-service cache**
  -    Query: `avg:redis.checkout-service.hit_ratio`
  -    Aggregation: rate

  - 17. **database query performance for order-service**
  -    Query: `avg:ddb.order-service.query_duration.avg`
  -    Aggregation: distinct

  - 18. **message queue depth for user-service queue**
  -    Query: `avg:sqs.user-service.approximate_age_of_oldest_message`
  -    Aggregation: median

  - 19. **infrastructure metrics for inventory-service hosts**
  -    Query: `avg:system.cpu.user{service:inventory-service}`
  -    Aggregation: stddev

  - 20. **p99 by service for payment-service**
  -    Query: `p99:trace.servlet.request.duration{service:payment-service}`
  -    Aggregation: p99

  - 21. **error rate for checkout-service**
  -    Query: `sum:trace.servlet.request.errors{service:checkout-service}.as_count() / sum:trace.servlet.request.hits{service:checkout-service}.as_count() * 100`
  -    Aggregation: avg

  - 22. **request rate for order-service**
  -    Query: `sum:trace.servlet.request.hits{service:order-service}.as_rate()`
  -    Aggregation: sum

  - 23. **apdex score for user-service**
  -    Query: `apdex:trace.servlet.request{service:user-service}.as_count()`
  -    Aggregation: max

  - 24. **trace count for inventory-service**
  -    Query: `trace.servlet.request.count{service:inventory-service}`
  -    Aggregation: min

  - 25. **dependency latency for payment-service -> downstream**
  -    Query: `avg:trace.payment-service.duration{destination_service:*}`
  -    Aggregation: count

  - 26. **cache hit ratio for checkout-service cache**
  -    Query: `avg:redis.checkout-service.hit_ratio`
  -    Aggregation: rate

  - 27. **database query performance for order-service**
  -    Query: `avg:ddb.order-service.query_duration.avg`
  -    Aggregation: distinct

  - 28. **message queue depth for user-service queue**
  -    Query: `avg:sqs.user-service.approximate_age_of_oldest_message`
  -    Aggregation: median

  - 29. **infrastructure metrics for inventory-service hosts**
  -    Query: `avg:system.cpu.user{service:inventory-service}`
  -    Aggregation: stddev

  - 30. **p99 by service for payment-service**
  -    Query: `p99:trace.servlet.request.duration{service:payment-service}`
  -    Aggregation: p99

  - 31. **error rate for checkout-service**
  -    Query: `sum:trace.servlet.request.errors{service:checkout-service}.as_count() / sum:trace.servlet.request.hits{service:checkout-service}.as_count() * 100`
  -    Aggregation: avg

  - 32. **request rate for order-service**
  -    Query: `sum:trace.servlet.request.hits{service:order-service}.as_rate()`
  -    Aggregation: sum

  - 33. **apdex score for user-service**
  -    Query: `apdex:trace.servlet.request{service:user-service}.as_count()`
  -    Aggregation: max

  - 34. **trace count for inventory-service**
  -    Query: `trace.servlet.request.count{service:inventory-service}`
  -    Aggregation: min

  - 35. **dependency latency for payment-service -> downstream**
  -    Query: `avg:trace.payment-service.duration{destination_service:*}`
  -    Aggregation: count

  - 36. **cache hit ratio for checkout-service cache**
  -    Query: `avg:redis.checkout-service.hit_ratio`
  -    Aggregation: rate

  - 37. **database query performance for order-service**
  -    Query: `avg:ddb.order-service.query_duration.avg`
  -    Aggregation: distinct

  - 38. **message queue depth for user-service queue**
  -    Query: `avg:sqs.user-service.approximate_age_of_oldest_message`
  -    Aggregation: median

  - 39. **infrastructure metrics for inventory-service hosts**
  -    Query: `avg:system.cpu.user{service:inventory-service}`
  -    Aggregation: stddev

  - 40. **p99 by service for payment-service**
  -    Query: `p99:trace.servlet.request.duration{service:payment-service}`
  -    Aggregation: p99

  - 41. **error rate for checkout-service**
  -    Query: `sum:trace.servlet.request.errors{service:checkout-service}.as_count() / sum:trace.servlet.request.hits{service:checkout-service}.as_count() * 100`
  -    Aggregation: avg

  - 42. **request rate for order-service**
  -    Query: `sum:trace.servlet.request.hits{service:order-service}.as_rate()`
  -    Aggregation: sum

  - 43. **apdex score for user-service**
  -    Query: `apdex:trace.servlet.request{service:user-service}.as_count()`
  -    Aggregation: max

  - 44. **trace count for inventory-service**
  -    Query: `trace.servlet.request.count{service:inventory-service}`
  -    Aggregation: min

  - 45. **dependency latency for payment-service -> downstream**
  -    Query: `avg:trace.payment-service.duration{destination_service:*}`
  -    Aggregation: count

  - 46. **cache hit ratio for checkout-service cache**
  -    Query: `avg:redis.checkout-service.hit_ratio`
  -    Aggregation: rate

  - 47. **database query performance for order-service**
  -    Query: `avg:ddb.order-service.query_duration.avg`
  -    Aggregation: distinct

  - 48. **message queue depth for user-service queue**
  -    Query: `avg:sqs.user-service.approximate_age_of_oldest_message`
  -    Aggregation: median

  - 49. **infrastructure metrics for inventory-service hosts**
  -    Query: `avg:system.cpu.user{service:inventory-service}`
  -    Aggregation: stddev

  - 50. **p99 by service for payment-service**
  -    Query: `p99:trace.servlet.request.duration{service:payment-service}`
  -    Aggregation: p99


### Grafana Dashboard Panel Definitions for Chaos Experiments


  - **Panel 1: Stat - Error Rate**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 2: Gauge - Throughput**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 3: Table - Circuit Breakers**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 4: Bar Gauge - Resource Usage**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 5: Heatmap - Blast Radius**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 6: Logs - Dependency Health**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 7: Traces - Cache Performance**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 8: Node Graph - Queue Depth**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 9: Status History - Experiment Status**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 10: Time Series - Latency Overview**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 11: Stat - Error Rate**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 12: Gauge - Throughput**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 13: Table - Circuit Breakers**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 14: Bar Gauge - Resource Usage**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 15: Heatmap - Blast Radius**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 16: Logs - Dependency Health**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 17: Traces - Cache Performance**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 18: Node Graph - Queue Depth**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 19: Status History - Experiment Status**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 20: Time Series - Latency Overview**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 21: Stat - Error Rate**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 22: Gauge - Throughput**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 23: Table - Circuit Breakers**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 24: Bar Gauge - Resource Usage**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 25: Heatmap - Blast Radius**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 26: Logs - Dependency Health**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 27: Traces - Cache Performance**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 28: Node Graph - Queue Depth**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 29: Status History - Experiment Status**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 30: Time Series - Latency Overview**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 31: Stat - Error Rate**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 32: Gauge - Throughput**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 33: Table - Circuit Breakers**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 34: Bar Gauge - Resource Usage**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 35: Heatmap - Blast Radius**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 36: Logs - Dependency Health**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 37: Traces - Cache Performance**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 38: Node Graph - Queue Depth**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 39: Status History - Experiment Status**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 40: Time Series - Latency Overview**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 41: Stat - Error Rate**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 42: Gauge - Throughput**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 43: Table - Circuit Breakers**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 44: Bar Gauge - Resource Usage**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 45: Heatmap - Blast Radius**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}

  - **Panel 46: Logs - Dependency Health**
  -   Target: checkout-service
  -   Visualization: single stat
  -   Refresh: 10s
  -   Time range: last 15 minutes
  -   Thresholds: {'warning': 2, 'critical': 5}

  - **Panel 47: Traces - Cache Performance**
  -   Target: api-gateway
  -   Visualization: gauge
  -   Refresh: 30s
  -   Time range: last 30 minutes
  -   Thresholds: {'warning': 80, 'critical': 95}

  - **Panel 48: Node Graph - Queue Depth**
  -   Target: all services
  -   Visualization: table
  -   Refresh: 1m
  -   Time range: last 1 hour
  -   Thresholds: {'warning': 60, 'critical': 80}

  - **Panel 49: Status History - Experiment Status**
  -   Target: experiment-wide
  -   Visualization: bar gauge
  -   Refresh: 5m
  -   Time range: last 6 hours
  -   Thresholds: {'warning': 10, 'critical': 20}

  - **Panel 50: Time Series - Latency Overview**
  -   Target: payment-service
  -   Visualization: graph
  -   Refresh: 5s
  -   Time range: last 5 minutes
  -   Thresholds: {'warning': 500, 'critical': 2000}


### Python Experiment Helper Functions


  - **Function: inject_latency**
```python
def inject_latency(experiment_id, parameters=None):
    """Execute inject latency for the given experiment."""
    logger.info(f"Starting inject_latency for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement inject_latency logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"inject_latency failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "inject_latency", result)
    return result
```

  - **Function: inject_packet_loss**
```python
def inject_packet_loss(experiment_id, parameters=None):
    """Execute inject packet loss for the given experiment."""
    logger.info(f"Starting inject_packet_loss for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement inject_packet_loss logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"inject_packet_loss failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "inject_packet_loss", result)
    return result
```

  - **Function: stress_cpu**
```python
def stress_cpu(experiment_id, parameters=None):
    """Execute stress cpu for the given experiment."""
    logger.info(f"Starting stress_cpu for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement stress_cpu logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"stress_cpu failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "stress_cpu", result)
    return result
```

  - **Function: stress_memory**
```python
def stress_memory(experiment_id, parameters=None):
    """Execute stress memory for the given experiment."""
    logger.info(f"Starting stress_memory for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement stress_memory logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"stress_memory failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "stress_memory", result)
    return result
```

  - **Function: fill_disk**
```python
def fill_disk(experiment_id, parameters=None):
    """Execute fill disk for the given experiment."""
    logger.info(f"Starting fill_disk for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement fill_disk logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"fill_disk failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "fill_disk", result)
    return result
```

  - **Function: delete_pod**
```python
def delete_pod(experiment_id, parameters=None):
    """Execute delete pod for the given experiment."""
    logger.info(f"Starting delete_pod for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement delete_pod logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"delete_pod failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "delete_pod", result)
    return result
```

  - **Function: kill_container**
```python
def kill_container(experiment_id, parameters=None):
    """Execute kill container for the given experiment."""
    logger.info(f"Starting kill_container for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement kill_container logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"kill_container failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "kill_container", result)
    return result
```

  - **Function: drain_node**
```python
def drain_node(experiment_id, parameters=None):
    """Execute drain node for the given experiment."""
    logger.info(f"Starting drain_node for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement drain_node logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"drain_node failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "drain_node", result)
    return result
```

  - **Function: fail_dns**
```python
def fail_dns(experiment_id, parameters=None):
    """Execute fail dns for the given experiment."""
    logger.info(f"Starting fail_dns for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement fail_dns logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"fail_dns failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "fail_dns", result)
    return result
```

  - **Function: check_error_rate**
```python
def check_error_rate(experiment_id, parameters=None):
    """Execute check error rate for the given experiment."""
    logger.info(f"Starting check_error_rate for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_error_rate logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_error_rate failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_error_rate", result)
    return result
```

  - **Function: check_latency**
```python
def check_latency(experiment_id, parameters=None):
    """Execute check latency for the given experiment."""
    logger.info(f"Starting check_latency for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_latency logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_latency failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_latency", result)
    return result
```

  - **Function: check_circuit_breaker**
```python
def check_circuit_breaker(experiment_id, parameters=None):
    """Execute check circuit breaker for the given experiment."""
    logger.info(f"Starting check_circuit_breaker for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_circuit_breaker logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_circuit_breaker failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_circuit_breaker", result)
    return result
```

  - **Function: check_pod_health**
```python
def check_pod_health(experiment_id, parameters=None):
    """Execute check pod health for the given experiment."""
    logger.info(f"Starting check_pod_health for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_pod_health logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_pod_health failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_pod_health", result)
    return result
```

  - **Function: check_queue_depth**
```python
def check_queue_depth(experiment_id, parameters=None):
    """Execute check queue depth for the given experiment."""
    logger.info(f"Starting check_queue_depth for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_queue_depth logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_queue_depth failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_queue_depth", result)
    return result
```

  - **Function: rollback_experiment**
```python
def rollback_experiment(experiment_id, parameters=None):
    """Execute rollback experiment for the given experiment."""
    logger.info(f"Starting rollback_experiment for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement rollback_experiment logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"rollback_experiment failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "rollback_experiment", result)
    return result
```

  - **Function: notify_stakeholders**
```python
def notify_stakeholders(experiment_id, parameters=None):
    """Execute notify stakeholders for the given experiment."""
    logger.info(f"Starting notify_stakeholders for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement notify_stakeholders logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"notify_stakeholders failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "notify_stakeholders", result)
    return result
```

  - **Function: log_experiment_event**
```python
def log_experiment_event(experiment_id, parameters=None):
    """Execute log experiment event for the given experiment."""
    logger.info(f"Starting log_experiment_event for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement log_experiment_event logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"log_experiment_event failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "log_experiment_event", result)
    return result
```

  - **Function: record_metric**
```python
def record_metric(experiment_id, parameters=None):
    """Execute record metric for the given experiment."""
    logger.info(f"Starting record_metric for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement record_metric logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"record_metric failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "record_metric", result)
    return result
```

  - **Function: analyze_results**
```python
def analyze_results(experiment_id, parameters=None):
    """Execute analyze results for the given experiment."""
    logger.info(f"Starting analyze_results for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement analyze_results logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"analyze_results failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "analyze_results", result)
    return result
```

  - **Function: calculate_blast_radius**
```python
def calculate_blast_radius(experiment_id, parameters=None):
    """Execute calculate blast radius for the given experiment."""
    logger.info(f"Starting calculate_blast_radius for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement calculate_blast_radius logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"calculate_blast_radius failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "calculate_blast_radius", result)
    return result
```

  - **Function: validate_hypothesis**
```python
def validate_hypothesis(experiment_id, parameters=None):
    """Execute validate hypothesis for the given experiment."""
    logger.info(f"Starting validate_hypothesis for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement validate_hypothesis logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"validate_hypothesis failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "validate_hypothesis", result)
    return result
```

  - **Function: generate_report**
```python
def generate_report(experiment_id, parameters=None):
    """Execute generate report for the given experiment."""
    logger.info(f"Starting generate_report for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement generate_report logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"generate_report failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "generate_report", result)
    return result
```

  - **Function: track_remediation**
```python
def track_remediation(experiment_id, parameters=None):
    """Execute track remediation for the given experiment."""
    logger.info(f"Starting track_remediation for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement track_remediation logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"track_remediation failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "track_remediation", result)
    return result
```

  - **Function: schedule_game_day**
```python
def schedule_game_day(experiment_id, parameters=None):
    """Execute schedule game day for the given experiment."""
    logger.info(f"Starting schedule_game_day for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement schedule_game_day logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"schedule_game_day failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "schedule_game_day", result)
    return result
```

  - **Function: check_steady_state**
```python
def check_steady_state(experiment_id, parameters=None):
    """Execute check steady state for the given experiment."""
    logger.info(f"Starting check_steady_state for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_steady_state logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_steady_state failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_steady_state", result)
    return result
```

  - **Function: inject_latency**
```python
def inject_latency(experiment_id, parameters=None):
    """Execute inject latency for the given experiment."""
    logger.info(f"Starting inject_latency for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement inject_latency logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"inject_latency failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "inject_latency", result)
    return result
```

  - **Function: inject_packet_loss**
```python
def inject_packet_loss(experiment_id, parameters=None):
    """Execute inject packet loss for the given experiment."""
    logger.info(f"Starting inject_packet_loss for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement inject_packet_loss logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"inject_packet_loss failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "inject_packet_loss", result)
    return result
```

  - **Function: stress_cpu**
```python
def stress_cpu(experiment_id, parameters=None):
    """Execute stress cpu for the given experiment."""
    logger.info(f"Starting stress_cpu for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement stress_cpu logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"stress_cpu failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "stress_cpu", result)
    return result
```

  - **Function: stress_memory**
```python
def stress_memory(experiment_id, parameters=None):
    """Execute stress memory for the given experiment."""
    logger.info(f"Starting stress_memory for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement stress_memory logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"stress_memory failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "stress_memory", result)
    return result
```

  - **Function: fill_disk**
```python
def fill_disk(experiment_id, parameters=None):
    """Execute fill disk for the given experiment."""
    logger.info(f"Starting fill_disk for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement fill_disk logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"fill_disk failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "fill_disk", result)
    return result
```

  - **Function: delete_pod**
```python
def delete_pod(experiment_id, parameters=None):
    """Execute delete pod for the given experiment."""
    logger.info(f"Starting delete_pod for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement delete_pod logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"delete_pod failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "delete_pod", result)
    return result
```

  - **Function: kill_container**
```python
def kill_container(experiment_id, parameters=None):
    """Execute kill container for the given experiment."""
    logger.info(f"Starting kill_container for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement kill_container logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"kill_container failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "kill_container", result)
    return result
```

  - **Function: drain_node**
```python
def drain_node(experiment_id, parameters=None):
    """Execute drain node for the given experiment."""
    logger.info(f"Starting drain_node for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement drain_node logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"drain_node failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "drain_node", result)
    return result
```

  - **Function: fail_dns**
```python
def fail_dns(experiment_id, parameters=None):
    """Execute fail dns for the given experiment."""
    logger.info(f"Starting fail_dns for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement fail_dns logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"fail_dns failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "fail_dns", result)
    return result
```

  - **Function: check_error_rate**
```python
def check_error_rate(experiment_id, parameters=None):
    """Execute check error rate for the given experiment."""
    logger.info(f"Starting check_error_rate for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_error_rate logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_error_rate failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_error_rate", result)
    return result
```

  - **Function: check_latency**
```python
def check_latency(experiment_id, parameters=None):
    """Execute check latency for the given experiment."""
    logger.info(f"Starting check_latency for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_latency logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_latency failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_latency", result)
    return result
```

  - **Function: check_circuit_breaker**
```python
def check_circuit_breaker(experiment_id, parameters=None):
    """Execute check circuit breaker for the given experiment."""
    logger.info(f"Starting check_circuit_breaker for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_circuit_breaker logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_circuit_breaker failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_circuit_breaker", result)
    return result
```

  - **Function: check_pod_health**
```python
def check_pod_health(experiment_id, parameters=None):
    """Execute check pod health for the given experiment."""
    logger.info(f"Starting check_pod_health for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_pod_health logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_pod_health failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_pod_health", result)
    return result
```

  - **Function: check_queue_depth**
```python
def check_queue_depth(experiment_id, parameters=None):
    """Execute check queue depth for the given experiment."""
    logger.info(f"Starting check_queue_depth for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_queue_depth logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_queue_depth failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_queue_depth", result)
    return result
```

  - **Function: rollback_experiment**
```python
def rollback_experiment(experiment_id, parameters=None):
    """Execute rollback experiment for the given experiment."""
    logger.info(f"Starting rollback_experiment for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement rollback_experiment logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"rollback_experiment failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "rollback_experiment", result)
    return result
```

  - **Function: notify_stakeholders**
```python
def notify_stakeholders(experiment_id, parameters=None):
    """Execute notify stakeholders for the given experiment."""
    logger.info(f"Starting notify_stakeholders for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement notify_stakeholders logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"notify_stakeholders failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "notify_stakeholders", result)
    return result
```

  - **Function: log_experiment_event**
```python
def log_experiment_event(experiment_id, parameters=None):
    """Execute log experiment event for the given experiment."""
    logger.info(f"Starting log_experiment_event for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement log_experiment_event logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"log_experiment_event failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "log_experiment_event", result)
    return result
```

  - **Function: record_metric**
```python
def record_metric(experiment_id, parameters=None):
    """Execute record metric for the given experiment."""
    logger.info(f"Starting record_metric for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement record_metric logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"record_metric failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "record_metric", result)
    return result
```

  - **Function: analyze_results**
```python
def analyze_results(experiment_id, parameters=None):
    """Execute analyze results for the given experiment."""
    logger.info(f"Starting analyze_results for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement analyze_results logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"analyze_results failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "analyze_results", result)
    return result
```

  - **Function: calculate_blast_radius**
```python
def calculate_blast_radius(experiment_id, parameters=None):
    """Execute calculate blast radius for the given experiment."""
    logger.info(f"Starting calculate_blast_radius for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement calculate_blast_radius logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"calculate_blast_radius failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "calculate_blast_radius", result)
    return result
```

  - **Function: validate_hypothesis**
```python
def validate_hypothesis(experiment_id, parameters=None):
    """Execute validate hypothesis for the given experiment."""
    logger.info(f"Starting validate_hypothesis for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement validate_hypothesis logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"validate_hypothesis failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "validate_hypothesis", result)
    return result
```

  - **Function: generate_report**
```python
def generate_report(experiment_id, parameters=None):
    """Execute generate report for the given experiment."""
    logger.info(f"Starting generate_report for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement generate_report logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"generate_report failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "generate_report", result)
    return result
```

  - **Function: track_remediation**
```python
def track_remediation(experiment_id, parameters=None):
    """Execute track remediation for the given experiment."""
    logger.info(f"Starting track_remediation for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement track_remediation logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"track_remediation failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "track_remediation", result)
    return result
```

  - **Function: schedule_game_day**
```python
def schedule_game_day(experiment_id, parameters=None):
    """Execute schedule game day for the given experiment."""
    logger.info(f"Starting schedule_game_day for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement schedule_game_day logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"schedule_game_day failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "schedule_game_day", result)
    return result
```

  - **Function: check_steady_state**
```python
def check_steady_state(experiment_id, parameters=None):
    """Execute check steady state for the given experiment."""
    logger.info(f"Starting check_steady_state for experiment {experiment_id}")
    result = {"experiment_id": experiment_id, "status": "running"}
    try:
        # TODO: Implement check_steady_state logic
        time.sleep(0.1)
        result["status"] = "completed"
        result["output"] = "OK"
    except Exception as exc:
        result["status"] = "failed"
        result["error"] = str(exc)
        logger.error(f"check_steady_state failed: {exc}")
    finally:
        log_experiment_event(experiment_id, "check_steady_state", result)
    return result
```


### Kubernetes Chaos Experiment YAML Templates


  - **Template 1: container-kill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: container-kill-1
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: container-kill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "70"
  -             - name: CHAOS_INTERVAL
  -               value: "6"
  -             - name: PODS_AFFECTED_PERC
  -               value: "11"
  -             - name: RAMP_TIME
  -               value: "6"
```

  - **Template 2: node-cpu-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-cpu-hog-2
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-cpu-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "80"
  -             - name: CHAOS_INTERVAL
  -               value: "7"
  -             - name: PODS_AFFECTED_PERC
  -               value: "12"
  -             - name: RAMP_TIME
  -               value: "7"
```

  - **Template 3: pod-network-latency**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-latency-3
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-latency
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "90"
  -             - name: CHAOS_INTERVAL
  -               value: "8"
  -             - name: PODS_AFFECTED_PERC
  -               value: "13"
  -             - name: RAMP_TIME
  -               value: "8"
```

  - **Template 4: pod-network-loss**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-loss-4
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-loss
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "100"
  -             - name: CHAOS_INTERVAL
  -               value: "9"
  -             - name: PODS_AFFECTED_PERC
  -               value: "14"
  -             - name: RAMP_TIME
  -               value: "9"
```

  - **Template 5: pod-dns-error**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-dns-error-5
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-dns-error
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "110"
  -             - name: CHAOS_INTERVAL
  -               value: "10"
  -             - name: PODS_AFFECTED_PERC
  -               value: "15"
  -             - name: RAMP_TIME
  -               value: "10"
```

  - **Template 6: pod-http-abort**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-http-abort-6
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-http-abort
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "120"
  -             - name: CHAOS_INTERVAL
  -               value: "11"
  -             - name: PODS_AFFECTED_PERC
  -               value: "16"
  -             - name: RAMP_TIME
  -               value: "11"
```

  - **Template 7: pod-memory-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-memory-hog-7
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-memory-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "130"
  -             - name: CHAOS_INTERVAL
  -               value: "12"
  -             - name: PODS_AFFECTED_PERC
  -               value: "17"
  -             - name: RAMP_TIME
  -               value: "12"
```

  - **Template 8: node-drain**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-drain-8
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-drain
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "140"
  -             - name: CHAOS_INTERVAL
  -               value: "13"
  -             - name: PODS_AFFECTED_PERC
  -               value: "18"
  -             - name: RAMP_TIME
  -               value: "13"
```

  - **Template 9: disk-fill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: disk-fill-9
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: disk-fill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "150"
  -             - name: CHAOS_INTERVAL
  -               value: "14"
  -             - name: PODS_AFFECTED_PERC
  -               value: "19"
  -             - name: RAMP_TIME
  -               value: "14"
```

  - **Template 10: pod-delete**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-delete-10
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-delete
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "160"
  -             - name: CHAOS_INTERVAL
  -               value: "15"
  -             - name: PODS_AFFECTED_PERC
  -               value: "20"
  -             - name: RAMP_TIME
  -               value: "5"
```

  - **Template 11: container-kill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: container-kill-11
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: container-kill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "170"
  -             - name: CHAOS_INTERVAL
  -               value: "16"
  -             - name: PODS_AFFECTED_PERC
  -               value: "21"
  -             - name: RAMP_TIME
  -               value: "6"
```

  - **Template 12: node-cpu-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-cpu-hog-12
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-cpu-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "180"
  -             - name: CHAOS_INTERVAL
  -               value: "17"
  -             - name: PODS_AFFECTED_PERC
  -               value: "22"
  -             - name: RAMP_TIME
  -               value: "7"
```

  - **Template 13: pod-network-latency**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-latency-13
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-latency
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "190"
  -             - name: CHAOS_INTERVAL
  -               value: "18"
  -             - name: PODS_AFFECTED_PERC
  -               value: "23"
  -             - name: RAMP_TIME
  -               value: "8"
```

  - **Template 14: pod-network-loss**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-loss-14
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-loss
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "200"
  -             - name: CHAOS_INTERVAL
  -               value: "19"
  -             - name: PODS_AFFECTED_PERC
  -               value: "24"
  -             - name: RAMP_TIME
  -               value: "9"
```

  - **Template 15: pod-dns-error**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-dns-error-15
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-dns-error
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "210"
  -             - name: CHAOS_INTERVAL
  -               value: "5"
  -             - name: PODS_AFFECTED_PERC
  -               value: "25"
  -             - name: RAMP_TIME
  -               value: "10"
```

  - **Template 16: pod-http-abort**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-http-abort-16
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-http-abort
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "220"
  -             - name: CHAOS_INTERVAL
  -               value: "6"
  -             - name: PODS_AFFECTED_PERC
  -               value: "26"
  -             - name: RAMP_TIME
  -               value: "11"
```

  - **Template 17: pod-memory-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-memory-hog-17
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-memory-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "230"
  -             - name: CHAOS_INTERVAL
  -               value: "7"
  -             - name: PODS_AFFECTED_PERC
  -               value: "27"
  -             - name: RAMP_TIME
  -               value: "12"
```

  - **Template 18: node-drain**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-drain-18
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-drain
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "240"
  -             - name: CHAOS_INTERVAL
  -               value: "8"
  -             - name: PODS_AFFECTED_PERC
  -               value: "28"
  -             - name: RAMP_TIME
  -               value: "13"
```

  - **Template 19: disk-fill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: disk-fill-19
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: disk-fill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "250"
  -             - name: CHAOS_INTERVAL
  -               value: "9"
  -             - name: PODS_AFFECTED_PERC
  -               value: "29"
  -             - name: RAMP_TIME
  -               value: "14"
```

  - **Template 20: pod-delete**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-delete-20
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-delete
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "260"
  -             - name: CHAOS_INTERVAL
  -               value: "10"
  -             - name: PODS_AFFECTED_PERC
  -               value: "30"
  -             - name: RAMP_TIME
  -               value: "5"
```

  - **Template 21: container-kill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: container-kill-21
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: container-kill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "270"
  -             - name: CHAOS_INTERVAL
  -               value: "11"
  -             - name: PODS_AFFECTED_PERC
  -               value: "31"
  -             - name: RAMP_TIME
  -               value: "6"
```

  - **Template 22: node-cpu-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-cpu-hog-22
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-cpu-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "280"
  -             - name: CHAOS_INTERVAL
  -               value: "12"
  -             - name: PODS_AFFECTED_PERC
  -               value: "32"
  -             - name: RAMP_TIME
  -               value: "7"
```

  - **Template 23: pod-network-latency**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-latency-23
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-latency
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "290"
  -             - name: CHAOS_INTERVAL
  -               value: "13"
  -             - name: PODS_AFFECTED_PERC
  -               value: "33"
  -             - name: RAMP_TIME
  -               value: "8"
```

  - **Template 24: pod-network-loss**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-loss-24
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-loss
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "300"
  -             - name: CHAOS_INTERVAL
  -               value: "14"
  -             - name: PODS_AFFECTED_PERC
  -               value: "34"
  -             - name: RAMP_TIME
  -               value: "9"
```

  - **Template 25: pod-dns-error**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-dns-error-25
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-dns-error
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "310"
  -             - name: CHAOS_INTERVAL
  -               value: "15"
  -             - name: PODS_AFFECTED_PERC
  -               value: "35"
  -             - name: RAMP_TIME
  -               value: "10"
```

  - **Template 26: pod-http-abort**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-http-abort-26
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-http-abort
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "320"
  -             - name: CHAOS_INTERVAL
  -               value: "16"
  -             - name: PODS_AFFECTED_PERC
  -               value: "36"
  -             - name: RAMP_TIME
  -               value: "11"
```

  - **Template 27: pod-memory-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-memory-hog-27
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-memory-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "330"
  -             - name: CHAOS_INTERVAL
  -               value: "17"
  -             - name: PODS_AFFECTED_PERC
  -               value: "37"
  -             - name: RAMP_TIME
  -               value: "12"
```

  - **Template 28: node-drain**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-drain-28
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-drain
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "340"
  -             - name: CHAOS_INTERVAL
  -               value: "18"
  -             - name: PODS_AFFECTED_PERC
  -               value: "38"
  -             - name: RAMP_TIME
  -               value: "13"
```

  - **Template 29: disk-fill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: disk-fill-29
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: disk-fill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "350"
  -             - name: CHAOS_INTERVAL
  -               value: "19"
  -             - name: PODS_AFFECTED_PERC
  -               value: "39"
  -             - name: RAMP_TIME
  -               value: "14"
```

  - **Template 30: pod-delete**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-delete-30
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-delete
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "360"
  -             - name: CHAOS_INTERVAL
  -               value: "5"
  -             - name: PODS_AFFECTED_PERC
  -               value: "40"
  -             - name: RAMP_TIME
  -               value: "5"
```

  - **Template 31: container-kill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: container-kill-31
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: container-kill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "370"
  -             - name: CHAOS_INTERVAL
  -               value: "6"
  -             - name: PODS_AFFECTED_PERC
  -               value: "41"
  -             - name: RAMP_TIME
  -               value: "6"
```

  - **Template 32: node-cpu-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-cpu-hog-32
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-cpu-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "380"
  -             - name: CHAOS_INTERVAL
  -               value: "7"
  -             - name: PODS_AFFECTED_PERC
  -               value: "42"
  -             - name: RAMP_TIME
  -               value: "7"
```

  - **Template 33: pod-network-latency**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-latency-33
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-latency
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "390"
  -             - name: CHAOS_INTERVAL
  -               value: "8"
  -             - name: PODS_AFFECTED_PERC
  -               value: "43"
  -             - name: RAMP_TIME
  -               value: "8"
```

  - **Template 34: pod-network-loss**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-loss-34
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-loss
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "400"
  -             - name: CHAOS_INTERVAL
  -               value: "9"
  -             - name: PODS_AFFECTED_PERC
  -               value: "44"
  -             - name: RAMP_TIME
  -               value: "9"
```

  - **Template 35: pod-dns-error**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-dns-error-35
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-dns-error
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "410"
  -             - name: CHAOS_INTERVAL
  -               value: "10"
  -             - name: PODS_AFFECTED_PERC
  -               value: "45"
  -             - name: RAMP_TIME
  -               value: "10"
```

  - **Template 36: pod-http-abort**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-http-abort-36
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-http-abort
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "420"
  -             - name: CHAOS_INTERVAL
  -               value: "11"
  -             - name: PODS_AFFECTED_PERC
  -               value: "46"
  -             - name: RAMP_TIME
  -               value: "11"
```

  - **Template 37: pod-memory-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-memory-hog-37
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-memory-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "430"
  -             - name: CHAOS_INTERVAL
  -               value: "12"
  -             - name: PODS_AFFECTED_PERC
  -               value: "47"
  -             - name: RAMP_TIME
  -               value: "12"
```

  - **Template 38: node-drain**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-drain-38
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-drain
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "440"
  -             - name: CHAOS_INTERVAL
  -               value: "13"
  -             - name: PODS_AFFECTED_PERC
  -               value: "48"
  -             - name: RAMP_TIME
  -               value: "13"
```

  - **Template 39: disk-fill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: disk-fill-39
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: disk-fill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "450"
  -             - name: CHAOS_INTERVAL
  -               value: "14"
  -             - name: PODS_AFFECTED_PERC
  -               value: "49"
  -             - name: RAMP_TIME
  -               value: "14"
```

  - **Template 40: pod-delete**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-delete-40
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-delete
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "460"
  -             - name: CHAOS_INTERVAL
  -               value: "15"
  -             - name: PODS_AFFECTED_PERC
  -               value: "10"
  -             - name: RAMP_TIME
  -               value: "5"
```

  - **Template 41: container-kill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: container-kill-41
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: container-kill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "470"
  -             - name: CHAOS_INTERVAL
  -               value: "16"
  -             - name: PODS_AFFECTED_PERC
  -               value: "11"
  -             - name: RAMP_TIME
  -               value: "6"
```

  - **Template 42: node-cpu-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-cpu-hog-42
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-cpu-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "480"
  -             - name: CHAOS_INTERVAL
  -               value: "17"
  -             - name: PODS_AFFECTED_PERC
  -               value: "12"
  -             - name: RAMP_TIME
  -               value: "7"
```

  - **Template 43: pod-network-latency**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-latency-43
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-latency
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "490"
  -             - name: CHAOS_INTERVAL
  -               value: "18"
  -             - name: PODS_AFFECTED_PERC
  -               value: "13"
  -             - name: RAMP_TIME
  -               value: "8"
```

  - **Template 44: pod-network-loss**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-network-loss-44
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-network-loss
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "500"
  -             - name: CHAOS_INTERVAL
  -               value: "19"
  -             - name: PODS_AFFECTED_PERC
  -               value: "14"
  -             - name: RAMP_TIME
  -               value: "9"
```

  - **Template 45: pod-dns-error**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-dns-error-45
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-dns-error
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "510"
  -             - name: CHAOS_INTERVAL
  -               value: "5"
  -             - name: PODS_AFFECTED_PERC
  -               value: "15"
  -             - name: RAMP_TIME
  -               value: "10"
```

  - **Template 46: pod-http-abort**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-http-abort-46
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-http-abort
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "520"
  -             - name: CHAOS_INTERVAL
  -               value: "6"
  -             - name: PODS_AFFECTED_PERC
  -               value: "16"
  -             - name: RAMP_TIME
  -               value: "11"
```

  - **Template 47: pod-memory-hog**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-memory-hog-47
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-memory-hog
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "530"
  -             - name: CHAOS_INTERVAL
  -               value: "7"
  -             - name: PODS_AFFECTED_PERC
  -               value: "17"
  -             - name: RAMP_TIME
  -               value: "12"
```

  - **Template 48: node-drain**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: node-drain-48
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: node-drain
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "540"
  -             - name: CHAOS_INTERVAL
  -               value: "8"
  -             - name: PODS_AFFECTED_PERC
  -               value: "18"
  -             - name: RAMP_TIME
  -               value: "13"
```

  - **Template 49: disk-fill**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: disk-fill-49
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: disk-fill
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "550"
  -             - name: CHAOS_INTERVAL
  -               value: "9"
  -             - name: PODS_AFFECTED_PERC
  -               value: "19"
  -             - name: RAMP_TIME
  -               value: "14"
```

  - **Template 50: pod-delete**
```yaml
  - apiVersion: litmuschaos.io/v1alpha1
  - kind: ChaosEngine
  - metadata:
  -   name: pod-delete-50
  -   namespace: litmus
  - spec:
  -   engineState: active
  -   appinfo:
  -     appns: production
  -     applabel: app=payment-service
  -   chaosServiceAccount: litmus-admin
  -   experiments:
  -     - name: pod-delete
  -       spec:
  -         components:
  -           env:
  -             - name: TOTAL_CHAOS_DURATION
  -               value: "560"
  -             - name: CHAOS_INTERVAL
  -               value: "10"
  -             - name: PODS_AFFECTED_PERC
  -               value: "20"
  -             - name: RAMP_TIME
  -               value: "5"
```


### Experiment Finding Templates with Remediation Guidance


  - **Finding #1: Retry storm causing cascading failure**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #2: DNS caching not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #3: Connection pool exhausted**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #4: TLS certificate auto-renewal not configured**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #5: Read replica fallback missing**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #6: Health check endpoint too permissive**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #7: Graceful shutdown not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #8: Configuration validation missing**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #9: Load shedding threshold too high**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #10: Circuit breaker timeout misconfigured**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #11: Retry storm causing cascading failure**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #12: DNS caching not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #13: Connection pool exhausted**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #14: TLS certificate auto-renewal not configured**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #15: Read replica fallback missing**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #16: Health check endpoint too permissive**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #17: Graceful shutdown not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #18: Configuration validation missing**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #19: Load shedding threshold too high**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #20: Circuit breaker timeout misconfigured**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #21: Retry storm causing cascading failure**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #22: DNS caching not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #23: Connection pool exhausted**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #24: TLS certificate auto-renewal not configured**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #25: Read replica fallback missing**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #26: Health check endpoint too permissive**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #27: Graceful shutdown not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #28: Configuration validation missing**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #29: Load shedding threshold too high**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #30: Circuit breaker timeout misconfigured**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #31: Retry storm causing cascading failure**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #32: DNS caching not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #33: Connection pool exhausted**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #34: TLS certificate auto-renewal not configured**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #35: Read replica fallback missing**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #36: Health check endpoint too permissive**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #37: Graceful shutdown not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #38: Configuration validation missing**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #39: Load shedding threshold too high**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #40: Circuit breaker timeout misconfigured**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #41: Retry storm causing cascading failure**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #42: DNS caching not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #43: Connection pool exhausted**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #44: TLS certificate auto-renewal not configured**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #45: Read replica fallback missing**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

  - **Finding #46: Health check endpoint too permissive**
  -   Severity: HIGH
  -   Category: code
  -   Impact: partial service degradation
  -   Remediation: Implement circuit breaker
  -   Effort: 2 days
  -   Verification: unit test

  - **Finding #47: Graceful shutdown not implemented**
  -   Severity: MEDIUM
  -   Category: architecture
  -   Impact: latency increase
  -   Remediation: Add DNS caching
  -   Effort: 3 days
  -   Verification: integration test

  - **Finding #48: Configuration validation missing**
  -   Severity: LOW
  -   Category: monitoring
  -   Impact: no customer impact
  -   Remediation: Increase pool size
  -   Effort: 1 week
  -   Verification: code review

  - **Finding #49: Load shedding threshold too high**
  -   Severity: INFO
  -   Category: process
  -   Impact: observability gap
  -   Remediation: Configure cert-manager
  -   Effort: 2 weeks
  -   Verification: manual verification

  - **Finding #50: Circuit breaker timeout misconfigured**
  -   Severity: CRITICAL
  -   Category: configuration
  -   Impact: customer-visible errors
  -   Remediation: Update configuration
  -   Effort: 1 day
  -   Verification: re-run experiment

---

## P14 Container and Kubernetes Chaos

### Kubernetes Failure Taxonomy

```
Kubernetes Chaos
+-- Pod Chaos
|   +-- Pod Delete
|   +-- Pod Kill
|   +-- Pod Crash
|   +-- Pod Resource Exhaustion
+-- Node Chaos
|   +-- Node Cordon/Drain
|   +-- Node Failure
|   +-- Node Resource Exhaustion
+-- Network Chaos
|   +-- Pod Network Latency
|   +-- Pod Network Loss
|   +-- Pod Network Partition
|   +-- DNS Chaos
+-- Storage Chaos
|   +-- Persistent Volume Failure
|   +-- Storage Class Failure
|   +-- PVC Deletion
+-- RBAC Chaos
|   +-- Service Account Permission Revocation
|   +-- Role Binding Deletion
+-- Admission Controller Chaos
|   +-- Webhook Failure
|   +-- Policy Engine Failure
|   +-- Certificate Issues
+-- Cluster Chaos
    +-- API Server Failure
    +-- etcd Failure
    +-- Controller Manager Failure
    +-- Scheduler Failure
```

### Pod Chaos

**Pod Delete** (Graceful):
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pod-delete
spec:
  engineState: active
  appinfo:
    appns: production
    applabel: app=payment-service
    appkind: deployment
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "60"
            - name: CHAOS_INTERVAL
              value: "10"
            - name: FORCE
              value: "false"
            - name: PODS_AFFECTED_PERC
              value: "25"
            - name: RAMP_TIME
              value: "10"
```

**Pod Resource Exhaustion**:
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pod-cpu-hog
spec:
  engineState: active
  appinfo:
    appns: production
    applabel: app=payment-service
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-cpu-hog
      spec:
        components:
          env:
            - name: CPU_CORES
              value: "2"
            - name: TOTAL_CHAOS_DURATION
              value: "120"
            - name: PODS_AFFECTED_PERC
              value: "30"
```

### Node Chaos

**Node Drain**:
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: node-drain
spec:
  engineState: active
  chaosServiceAccount: litmus-admin
  experiments:
    - name: node-drain
      spec:
        components:
          env:
            - name: NODE_NAME
              value: "ip-10-0-1-45"
            - name: DRAIN_TIMEOUT
              value: "120"
            - name: IGNORE_DAEMONSETS
              value: "true"
            - name: DELETE_EMPTYDIR_DATA
              value: "false"
```

### Container Runtime Chaos

**Container Kill**:
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: container-kill
spec:
  engineState: active
  appinfo:
    appns: production
    applabel: app=payment-service
  chaosServiceAccount: litmus-admin
  experiments:
    - name: container-kill
      spec:
        components:
          env:
            - name: TARGET_CONTAINER
              value: "payment-service"
            - name: TOTAL_CHAOS_DURATION
              value: "60"
            - name: CHAOS_INTERVAL
              value: "10"
            - name: PODS_AFFECTED_PERC
              value: "25"
```

### Admission Controller Chaos

**Purpose**: Test that admission controllers fail safely and do not block critical operations.

```yaml
experiment:
  name: admission-webhook-failure
  hypothesis: |
    When the admission controller webhook certificate expires:
    - Validating webhooks fail closed (deny all) by default
    - Mutating webhooks fail open (allow all) by default
    - Pod creation is blocked if webhook is required
    - Existing pods continue running unaffected
```

### etcd Chaos

**Purpose**: Test etcd failure scenarios � the Kubernetes brain failing.

```yaml
experiment:
  name: etcd-failure
  hypothesis: |
    When one etcd member fails:
    - Leader election completes within 15 seconds
    - API server remains available for read operations
    - Write operations may briefly fail during leader election
    - Remaining etcd members maintain quorum
    - No data loss
  experiment_parameters:
    etcd_members: 3
    etcd_members_to_fail: 1
    failure_type: "process_kill"
    expected_recovery_time_seconds: 15
```

### Kubernetes Network Policies

**Purpose**: Test network policy enforcement and isolation.

```yaml
experiment:
  name: network-policy-isolation
  hypothesis: |
    When network policies are applied to restrict payment-service traffic:
    - Only services with matching label selectors can reach payment-service
    - Unauthorized services receive connection refused
    - Authorized services continue normal operation
    - DNS resolution for blocked services still works
  experiment_parameters:
    namespace: production
    target_service: payment-service
    allowed_services:
      - checkout-service
      - api-gateway
    blocked_services:
      - analytics-service
      - logging-service
```

### Cloud-Specific Kubernetes Chaos

#### AWS EKS Chaos
```json
{
  "experimentTemplate": {
    "description": "EKS pod deletion experiment",
    "targets": {
      "eksPods": {
        "resourceType": "aws:eks:pod",
        "resourceTags": { "ChaosEnabled": "true" },
        "selectionMode": "PERCENTAGE",
        "percentage": 25
      }
    },
    "actions": {
      "eksPodDelete": {
        "actionId": "aws:eks:delete-pods",
        "parameters": {},
        "targets": { "pods": "eksPods" }
      }
    },
    "stopConditions": [{
      "source": "aws:cloudwatch:alarm",
      "value": "arn:aws:cloudwatch:us-east-1:123456789012:alarm/ResilienceBreach"
    }]
  }
}
```

#### Azure AKS Chaos
```json
{
  "name": "aks-chaos-experiment",
  "properties": {
    "steps": [{
      "name": "AKS Pod Delete",
      "branches": [{
        "name": "Branch A",
        "actions": [{
          "type": "continuous",
          "name": "pod-delete",
          "selectorId": "aks-payment-pods",
          "parameters": [
            { "key": "podAffectedPercentage", "value": "25" },
            { "key": "durationInMinutes", "value": "5" }
          ]
        }]
      }]
    }]
  }
}
```

#### GKE Pod Chaos
```yaml
experiment:
  name: gke-pod-delete
  provider:
    type: python
    module: chaosgke.pod.actions
    func: delete_pods
  parameters:
    labels:
      app: payment-service
    namespace: production
    project: synarc-production
    cluster: payment-cluster
    location: us-central1-a
    count: 2
  steady_state_hypothesis:
    probes:
      - type: probe
        name: "checkout-healthy"
        provider:
          type: http
          url: "http://checkout-service/health"
        tolerate:
          - type: tolerance
            provider:
              type: http
              status: 200
