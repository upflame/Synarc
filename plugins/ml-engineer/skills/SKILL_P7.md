
## 7.3 Drift Detection

### 7.3.1 Types of Drift

**Data drift** (covariate shift): The distribution of input features changes between training and serving.
- Causes: Seasonality, user behavior changes, external events, system changes
- Detection: Compare feature distributions between reference (training) and current (serving) windows
- Metrics: PSI, KS statistic, JS divergence, Wasserstein distance, Chi-squared test

**Concept drift**: The relationship between features and target changes over time.
- Causes: Market changes, policy changes, competitive landscape, user preference shifts
- Detection: Monitor model performance metrics when ground truth arrives
- Metrics: Accuracy over time, error rate increase, calibration shift
- Types: Sudden (abrupt), gradual, incremental, recurring

**Label drift**: The distribution of the target variable changes.
- Detection: Compare label distributions across time windows
- Implication: May indicate fundamental change in the problem

**Prediction drift**: The distribution of model predictions shifts.
- Detection: Compare prediction distributions between training and serving
- Often the first sign of data drift (before ground truth is available)

### 7.3.2 Drift Detection Implementation

```python
"""Production drift detection module."""

import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from scipy.stats import ks_2samp, chi2_contingency, wasserstein_distance
import logging


@dataclass
class DriftResult:
    feature_name: str
    drift_score: float
    p_value: float
    drifted: bool
    threshold: float
    method: str
    reference_stats: Dict[str, float]
    current_stats: Dict[str, float]


class DriftDetector:
    def __init__(self, threshold: float = 0.05, method: str = "ks"):
        self.threshold = threshold
        self.method = method
        self.logger = logging.getLogger(self.__class__.__name__)
        self.reference_data: Dict[str, np.ndarray] = {}

    def set_reference(self, feature_name: str, data: np.ndarray):
        self.reference_data[feature_name] = data

    def set_reference_batch(self, reference: Dict[str, np.ndarray]):
        self.reference_data.update(reference)

    def detect_drift(self, feature_name: str, current_data: np.ndarray) -> DriftResult:
        if feature_name not in self.reference_data:
            return DriftResult(
                feature_name=feature_name, drift_score=0.0, p_value=1.0,
                drifted=False, threshold=self.threshold, method=self.method,
                reference_stats={"mean": float(np.mean(current_data))},
                current_stats={"mean": float(np.mean(current_data))},
            )

        ref_data = self.reference_data[feature_name]

        if self.method == "ks":
            statistic, p_value = ks_2samp(ref_data, current_data)
            drift_score = statistic
        elif self.method == "psi":
            drift_score = self._compute_psi(ref_data, current_data)
            p_value = self._psi_to_pvalue(drift_score, len(ref_data), len(current_data))
        elif self.method == "wasserstein":
            drift_score = float(wasserstein_distance(ref_data, current_data))
            p_value = self._bootstrap_pvalue(ref_data, current_data, drift_score)
        elif self.method == "js":
            drift_score = self._compute_js_divergence(ref_data, current_data)
            p_value = self._bootstrap_pvalue(ref_data, current_data, drift_score)
        else:
            raise ValueError(f"Unknown drift method: {self.method}")

        drifted = (p_value < self.threshold) if self.method == "ks" else (drift_score > self.threshold)
        if self.method == "ks":
            drifted = p_value < self.threshold
        else:
            drifted = drift_score > self.threshold

        return DriftResult(
            feature_name=feature_name,
            drift_score=float(drift_score),
            p_value=float(p_value),
            drifted=drifted,
            threshold=self.threshold,
            method=self.method,
            reference_stats=self._compute_stats(ref_data),
            current_stats=self._compute_stats(current_data),
        )

    def detect_batch_drift(self, current_data: Dict[str, np.ndarray]) -> Dict[str, DriftResult]:
        results = {}
        for feature_name, data in current_data.items():
            results[feature_name] = self.detect_drift(feature_name, data)
        return results

    def get_drift_summary(self, results: Dict[str, DriftResult]) -> Dict[str, Any]:
        drifted_features = [k for k, v in results.items() if v.drifted]
        return {
            "total_features": len(results),
            "drifted_features": len(drifted_features),
            "drift_rate": len(drifted_features) / max(len(results), 1),
            "drifted_feature_names": drifted_features,
            "mean_drift_score": float(np.mean([r.drift_score for r in results.values()])),
            "max_drift_score": float(max(r.drift_score for r in results.values())),
        }

    @staticmethod
    def _compute_psi(reference: np.ndarray, current: np.ndarray, n_bins: int = 10) -> float:
        min_val = min(reference.min(), current.min())
        max_val = max(reference.max(), current.max())
        bins = np.linspace(min_val, max_val, n_bins + 1)
        ref_hist, _ = np.histogram(reference, bins=bins)
        cur_hist, _ = np.histogram(current, bins=bins)
        ref_pct = ref_hist / ref_hist.sum()
        cur_pct = cur_hist / cur_hist.sum()
        ref_pct = np.clip(ref_pct, 0.001, 1.0)
        cur_pct = np.clip(cur_pct, 0.001, 1.0)
        psi = np.sum((ref_pct - cur_pct) * np.log(ref_pct / cur_pct))
        return float(psi)

    @staticmethod
    def _compute_js_divergence(p: np.ndarray, q: np.ndarray, n_bins: int = 10) -> float:
        min_val = min(p.min(), q.min())
        max_val = max(p.max(), q.max())
        bins = np.linspace(min_val, max_val, n_bins + 1)
        p_hist, _ = np.histogram(p, bins=bins, density=True)
        q_hist, _ = np.histogram(q, bins=bins, density=True)
        p_hist = np.clip(p_hist, 0.001, 1.0)
        q_hist = np.clip(q_hist, 0.001, 1.0)
        m = (p_hist + q_hist) / 2
        js = 0.5 * np.sum(p_hist * np.log(p_hist / m)) + 0.5 * np.sum(q_hist * np.log(q_hist / m))
        return float(js)

    @staticmethod
    def _bootstrap_pvalue(ref: np.ndarray, cur: np.ndarray, observed: float,
                          n_iterations: int = 1000) -> float:
        rng = np.random.RandomState(42)
        combined = np.concatenate([ref, cur])
        n_ref = len(ref)
        count = 0
        for _ in range(n_iterations):
            rng.shuffle(combined)
            ref_sample = combined[:n_ref]
            cur_sample = combined[n_ref:]
            # Simplified: count times null distribution exceeds observed
            null_stat = float(wasserstein_distance(ref_sample, cur_sample))
            if null_stat >= observed:
                count += 1
        return (count + 1) / (n_iterations + 1)

    @staticmethod
    def _psi_to_pvalue(psi: float, n1: int, n2: int) -> float:
        # Approximate p-value from PSI using chi-square distribution
        from scipy.stats import chi2
        p_value = 1 - chi2.cdf(psi * max(n1, n2) / 100, df=9)
        return float(p_value)

    @staticmethod
    def _compute_stats(data: np.ndarray) -> Dict[str, float]:
        return {
            "mean": float(np.mean(data)),
            "std": float(np.std(data)),
            "min": float(np.min(data)),
            "p25": float(np.percentile(data, 25)),
            "p50": float(np.percentile(data, 50)),
            "p75": float(np.percentile(data, 75)),
            "max": float(np.max(data)),
            "null_rate": float(np.isnan(data).mean()),
        }
```

### 7.3.3 Drift Monitoring Configuration

```yaml
drift_monitoring:
  schedule: "*/30 * * * *"  # Every 30 minutes
  window_size: 10000  # Samples per window
  reference_window: 7d  # Reference period for training data

  features:
    - name: "user_7d_click_count"
      method: "psi"
      threshold: 0.2
      alert_on: "drift"
    
    - name: "user_age"
      method: "ks"
      threshold: 0.05
      alert_on: "drift"
    
    - name: "item_price"
      method: "wasserstein"
      threshold: 1.0
      alert_on: "drift"

  model_predictions:
    method: "psi"
    threshold: 0.1
    alert_on: "drift"

  performance:
    schedule: "@daily"  # Requires ground truth
    metric: "auc_roc"
    min_value: 0.75
    alert_on: "degradation"
```

### 7.3.4 Alerting Thresholds

| Metric | Method | Normal | Warning | Critical | Action |
|---|---|---|---|---|---|
| **PSI** | Population Stability Index | <0.1 | 0.1-0.2 | >0.2 | Investigate at warning, retrain at critical |
| **KS statistic** | Kolmogorov-Smirnov | <0.1 | 0.1-0.2 | >0.2 | Investigate at warning, alert at critical |
| **JS divergence** | Jensen-Shannon | <0.05 | 0.05-0.15 | >0.15 | Alert at warning, paginate at critical |
| **Wasserstein** | Earth Mover's Distance | <0.1 | 0.1-0.5 | >0.5 | Investigate if consistent or growing |

## 7.4 Retraining Triggers

### 7.4.1 Trigger Types

| Trigger | Description | Configuration | Latency |
|---|---|---|---|
| **Time-based** | Retrain on fixed schedule | Weekly, bi-weekly, monthly | High |
| **Data volume** | Retrain after N new samples collected | 1M new rows | Medium |
| **Data drift** | Retrain when feature distributions shift | PSI > 0.2 | Low |
| **Concept drift** | Retrain when model performance degrades | AUC drop > 0.02 | Low (requires labels) |
| **Calendar event** | Retrain before known events (holidays, sales) | Seasonal schedule | High |
| **On-demand** | Manual retraining triggered by engineer | PR/button | — |

### 7.4.2 Retraining Decision Logic

```python
def should_retrain(
    drift_results: DriftReport,
    performance_metrics: PerformanceReport,
    last_retrain: datetime,
    config: RetrainingConfig,
) -> RetrainingDecision:
    reasons = []

    # Check time-based trigger
    days_since_retrain = (datetime.now() - last_retrain).days
    if days_since_retrain >= config.max_days_without_retrain:
        reasons.append(f"Scheduled retrain ({days_since_retrain}d since last)")

    # Check data volume trigger
    new_samples = get_new_sample_count(last_retrain)
    if new_samples >= config.min_samples_for_retrain:
        reasons.append(f"Data volume threshold ({new_samples} new samples)")

    # Check drift triggers
    if drift_results.drift_rate > config.max_drift_rate:
        drifted = ", ".join(drift_results.drifted_feature_names[:5])
        reasons.append(f"Data drift detected in: {drifted}")

    # Check performance triggers
    if performance_metrics and performance_metrics.degraded:
        reasons.append(f"Performance degradation: {performance_metrics.metric_delta:.4f}")

    should_retrain = len(reasons) >= config.min_triggers

    return RetrainingDecision(
        should_retrain=should_retrain,
        reasons=reasons,
        trigger_count=len(reasons),
        drift_report=drift_results,
        performance_report=performance_metrics,
    )
```

### 7.4.3 Retraining Pipeline

```yaml
retraining_pipeline:
  name: "automated_retraining"
  triggers:
    - type: schedule
      cron: "0 3 * * 0"  # Every Sunday 3AM
    - type: drift
      max_drift_rate: 0.3
      min_interval_hours: 24  # Don't retrain more than once per day
    - type: performance
      metric: test_auc_roc
      degradation_threshold: 0.02

  gates:
    pre_training:
      - name: data_quality
        required: true
      - name: data_freshness
        required: true
    post_training:
      - name: performance
        metric: test_auc_roc
        min_value: 0.70
      - name: regression
        reference_model: "current_production"
        max_degradation: 0.01
      - name: drift
        reference_dataset: "training_initial"
        max_psi: 0.15

  deployment:
    strategy: shadow
    shadow_duration_hours: 48
    auto_promote: true
    canary_traffic_pct: 2
    rollback_on_degradation: true
```

## 7.5 Model Monitoring System

### 7.5.1 Monitoring Architecture

```
                    +-------------------------+
                    |   Ground Truth Store     |
                    |   (DWH, Labels API)      |
                    +-----------+-------------+
                                |
                    +-----------v-------------+
                    |   Performance Monitor   |
                    |   (NannyML, WhyLabs)    |
                    +-----------+-------------+
                                |
+-------------------------------+-------------------------------+
|                               |                               |
v                               v                               v
+------------------+   +------------------+   +------------------+
| Prediction       |   | Data Drift       |   | System Health    |
| Monitor          |   | Monitor          |   | Monitor          |
| (Evidently,      |   | (Evidently,      |   | (Prometheus,     |
|  whylogs)        |   |  Great Exp)      |   |  Grafana)        |
+--------+---------+   +--------+---------+   +--------+---------+
         |                      |                       |
         +----------------------+-----------------------+
                                |
                    +-----------v-------------+
                    |   Alert Manager         |
                    |   (PagerDuty, Slack)     |
                    +-----------+-------------+
                                |
                    +-----------v-------------+
                    |   Dashboard             |
                    |   (Grafana)             |
                    +-------------------------+
```

### 7.5.2 Key Monitoring Metrics

**Prediction monitoring**:
- Prediction counts (volume per model, per version, per time window)
- Prediction distribution (mean, std, percentiles, histogram)
- Positive rate (fraction of positive predictions)
- Prediction velocity (change in prediction over time)
- Prediction staleness (time since last model refresh)

**Model performance monitoring**:
- Accuracy, precision, recall, F1 (when ground truth available)
- AUC-ROC, log loss, MAE, RMSE (depending on task)
- Calibration error (ECE, MCE)
- Performance by slice (region, user type, device, etc.)
- Performance trend (rolling 7-day vs rolling 30-day)

**Data quality monitoring**:
- Feature null rates
- Feature range violations
- Schema conformance
- Data freshness (lag from event time to available)
- Data volume (row count per partition)

**System monitoring**:
- Request latency (p50, p95, p99, p999)
- Throughput (requests/second)
- Error rate (4xx, 5xx, prediction failures)
- Resource utilization (CPU, memory, GPU, network)
- Model loading time
- Feature retrieval latency

### 7.5.3 Alert Rules Configuration

```yaml
alerts:
  - name: "high_prediction_drift"
    metric: "prediction_psi"
    threshold: 0.2
    window: "1h"
    severity: "warning"
    channels: ["slack-ml-team"]
  
  - name: "performance_degradation"
    metric: "rolling_auc_roc"
    threshold: 0.70
    comparison: "less"
    window: "7d"
    severity: "critical"
    channels: ["pagerduty", "slack-ml-team", "email-ml-oncall"]
  
  - name: "high_error_rate"
    metric: "error_rate"
    threshold: 0.01
    window: "5m"
    severity: "critical"
    channels: ["pagerduty"]
  
  - name: "feature_null_rate_increase"
    metric: "null_rate"
    threshold: 0.10
    comparison: "greater"
    window: "1h"
    severity: "warning"
    channels: ["slack-data-engineering"]
  
  - name: "p99_latency_spike"
    metric: "p99_latency"
    threshold: 500  # ms
    window: "5m"
    severity: "warning"
    channels: ["slack-ml-infra"]
```

## 7.6 ML Pipeline CI/CD

### 7.6.1 CI Pipeline Configuration

```yaml
# .github/workflows/ml-ci.yml
name: ML Pipeline CI
on:
  pull_request:
    paths:
      - 'training/**'
      - 'features/**'
      - 'pipelines/**'
      - 'models/**'
      - 'requirements/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install ruff mypy
      - run: ruff check .
      - run: mypy --strict training/

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -e ".[dev]"
      - run: pytest tests/ --cov=training --cov=features -x
      - run: pytest tests/ --cov=training --cov=features -x --integration

  data-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install great_expectations
      - run: great_expectations checkpoint run data_quality_checkpoint

  feature-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python -m pytest tests/test_features.py -x
  
  model-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python -m pytest tests/test_models.py -x

  build:
    needs: [lint, test, data-tests, feature-tests, model-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t ml-training:latest -f Dockerfile.training .
      - name: Push to registry
        run: docker push registry.example.com/ml-training:latest
```

### 7.6.2 CD Pipeline Configuration

```yaml
# .github/workflows/ml-cd.yml
name: ML Pipeline CD
on:
  push:
    branches: [main]
    paths:
      - 'serving/**'
      - 'config/**'

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: kubectl apply -f k8s/staging/
      - run: python -m tests.integration_test --env staging
      - run: python -m tests.load_test --env staging --duration 5m
  
  shadow-deploy:
    needs: [deploy-staging]
    runs-on: ubuntu-latest
    steps:
      - run: python -m scripts.deploy_shadow --model ${{ github.event.inputs.model_uri }}
  
  shadow-eval:
    needs: [shadow-deploy]
    runs-on: ubuntu-latest
    steps:
      - run: |
          python -m scripts.shadow_evaluation \
            --duration 48h \
            --thresholds '{"auc_roc": 0.75}'
  
  canary-deploy:
    needs: [shadow-eval]
    runs-on: ubuntu-latest
    steps:
      - run: python -m scripts.deploy_canary --traffic 2%
  
  canary-promote:
    needs: [canary-deploy]
    runs-on: ubuntu-latest
    steps:
      - run: python -m scripts.promote_canary --eval-duration 24h
  
  notify:
    needs: [canary-promote]
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST -H 'Content-type: application/json' \
          --data '{"text":"Model deployment complete!"}' \
          $SLACK_WEBHOOK_URL
```

## 7.7 ML Data Management

### 7.7.1 Data Versioning

Every dataset used for training must be versioned.

**Approaches**:
- **DVC (Data Version Control)**: Git-based data versioning with remote storage
- **LakeFS**: Git-like semantics for data lakes
- **Dolt**: Git for data (SQL database with versioning)
- **Nessie**: Git-like versioning for data lakes
- **Manual hash**: Compute hash of dataset and store in metadata

**What to version**:
- Raw data snapshots
- Processed training datasets
- Feature vectors
- Data splits (train/val/test)

**Version metadata**:
- Dataset name and version
- Data sources (tables, files, dates)
- Processing pipeline version
- Row count, column count, schema hash
- Data range (min/max timestamps)
- Hash of dataset contents
- Creation timestamp

### 7.7.2 Data Lineage

Track the complete lineage from raw data to model predictions.

```yaml
data_lineage:
  model: "purchase_prediction_v2"
  
  training_run:
    id: "mlflow_run_abc123"
    timestamp: "2024-10-15T10:30:00Z"
    code_commit: "a1b2c3d4"
    
  features:
    - name: "user_7d_click_count"
      source: "clickstream_events"
      transform: "aggregate_7d_window"
      version: "2.1.0"
    - name: "user_total_purchases"
      source: "purchase_events"
      transform: "count_aggregate"
      version: "1.3.0"
      
  training_data:
    source: "feature_store_training_dataset_v4"
    rows: 15000000
    date_range: "2024-01-01 to 2024-09-30"
    split: "temporal_202401_202407_train_202408_val_202409_test"
    
  raw_data_sources:
    - name: "clickstream_events"
      location: "kafka://events/clickstream"
      date_range: "2024-01-01 to 2024-09-30"
      version: "topic_retention_30d"
    - name: "purchase_events"
      location: "bigquery://analytics.purchases"
      date_range: "2024-01-01 to 2024-09-30"
      version: "table_snapshot_20241001"
```

### 7.7.3 Dataset Splits

**Temporal split** (for time-dependent data):
- Train: Oldest data (e.g., first 70% by time)
- Validation: Middle (e.g., next 15%)
- Test: Most recent (e.g., last 15%)
- Never use future data in training

**Random split** (for i.i.d. data):
- Train: 70%, Validation: 15%, Test: 15%
- Stratified by target for imbalanced datasets

**Group split** (when entities appear multiple times):
- Ensure all rows from same entity are in same split
- Prevents leakage between train and test

**Stratified split**:
- Maintain class proportions across splits
- Use for imbalanced classification

## 7.8 Governance & Compliance

### 7.8.1 Model Risk Classification

| Risk Level | Description | Examples | Governance Requirements |
|---|---|---|---|
| **Low** | No direct user impact, internal use | Internal dashboards, exploratory analysis | Minimal: logging only |
| **Medium** | Indirect user impact | Recommendation ranking, content moderation | Model card, offline eval, monitoring |
| **High** | Direct user impact | Loan approval, fraud detection, medical diagnosis | Full governance: model card, fairness audit, approval gates, human-in-the-loop |
| **Critical** | Legal/regulatory implications | Credit scoring, hiring, criminal justice | Regulatory compliance, external audit, explainability |

### 7.8.2 Approval Gates by Risk Level

| Gate | Low | Medium | High | Critical |
|---|---|---|---|---|
| **Unit tests** | Required | Required | Required | Required |
| **Data quality checks** | Optional | Required | Required | Required |
| **Offline evaluation** | Required | Required | Required | Required |
| **Slice evaluation** | Optional | Required | Required | Required |
| **Fairness audit** | Optional | Optional | Required | Required |
| **Shadow evaluation** | Optional | Required | Required | Required |
| **Canary deployment** | Optional | Optional | Required | Required |
| **Manual approval** | Not required | Optional | Required | Required |
| **External audit** | Not required | Not required | Optional | Required |
| **Explainability report** | Optional | Optional | Required | Required |
