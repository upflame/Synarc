---
name: chaos-engineer
description: Chaos Engineering Skill
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Chaos Engineering Skill

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

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

## P15 Cloud-Specific Chaos

### AWS Fault Injection Simulator

**AWS FIS Template**:
`json

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

---
eferences/expanded-content.md\ (233 KB, 8107 lines)

