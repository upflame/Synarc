---
name: ml-engineer
description: ML Engineer Skill
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# ML Engineer Skill

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

## Overview

This skill defines the competencies, methodologies, patterns, and quality gates for a senior ML Engineer operating within the synarc ecosystem. It covers the full lifecycle of machine learning systems from architecture design through production deployment and ongoing monitoring.

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

# P2: Methodology

## 2.1 ML Development Lifecycle

The ML Engineer follows a structured lifecycle adapted from CRISP-ML and TDSP:

```
+----------------------------------------------------------------+
|                    ML Development Lifecycle                      |
+----------+----------+----------+----------+----------+----------+
| Business |   Data   |   ML     | Training |Deployment| Monitor  |
| Problem  |Acquisition| Modeling |   & Eval |          | & Retrain|
+----------+----------+----------+----------+----------+----------+
| Define   | Collect  | Feature  | Train    | Container| Track    |
| KPIs     | & Label  | Engineer | Tune     |ize Model | Metrics  |
|          |          |          |          |          |          |
| Feasibil | Validate | Select   | Evaluate | Deploy   | Detect   |
| ity Study| Quality  | Algorithm| (Offline) | Canary   | Drift    |
|          |          |          |          |          |          |
| Frame as | Explorat | Baseline | Validate | Route    | Auto-    |
| ML Task  |ory Data  | Model    | (Online) | Traffic  |Retrain   |
+----------+----------+----------+----------+----------+----------+
```

## 2.2 Phase 1: Business Problem Definition

### 2.2.1 Problem Framing

- Translate business problem into ML task
- Define success metrics (business KPIs, not just ML metrics)
- Establish baseline: rule-based heuristic, simple model, or human performance
- Conduct feasibility study: is there enough data? is the signal strong enough?

### 2.2.2 Success Criteria Framework

| Criterion | Question | Acceptance Threshold |
|---|---|---|
| Business Value | What is the expected ROI? | > 3x engineering cost |
| Model Quality | What is the minimum AUC/F1/accuracy? | > 0.85 AUC |
| Latency | What is the max acceptable p99 latency? | < 100ms |
| Throughput | How many predictions per second? | > 1000 QPS |
| Freshness | How often must the model retrain? | < 24h staleness |
| Reliability | What uptime SLA is required? | > 99.9% |

### 2.2.3 Feasibility Checklist

- Is labeled data available at sufficient volume (n > 10,000)?
- Does historical data represent the production distribution?
- Is the problem linearly separable or does it require deep learning?
- Are there existing pretrained models that can be fine-tuned?
- Is the inference latency requirement achievable with chosen approach?
- Do we have the necessary compute budget for training?
- Are there regulatory constraints (GDPR, CCPA, HIPAA)?
- Is the ML solution actually better than a heuristic?

## 2.3 Phase 2: Data Acquisition and Validation

### 2.3.1 Data Collection Strategy

- Identify data sources: OLTP databases, event streams, S3/data lakes, third-party APIs
- Determine data volume, velocity, variety
- Define data retention and privacy policies
- Establish data lineage tracking

### 2.3.2 Data Quality Validation

| Validation Check | Method | Threshold |
|---|---|---|
| Completeness | % of non-null values | > 99% |
| Uniqueness | % of duplicate rows | < 1% |
| Consistency | Cross-field validation | 100% pass |
| Timeliness | Max data age | < threshold |
| Accuracy | Sample-based manual review | > 95% |
| Freshness | Last updated timestamp | < SLA |
| Distribution Stability | PSI / JS divergence from ref | PSI < 0.1 |
| Schema Conformance | Field types match schema | 100% |

### 2.3.3 Exploratory Data Analysis (EDA) Protocol

1. **Univariate Analysis**: distributions, outliers, missing values
2. **Bivariate Analysis**: correlations, cross-tabulations
3. **Temporal Analysis**: trends, seasonality, drift over time
4. **Segment Analysis**: stratified metrics across cohorts
5. **Data Quality Report**: automated profiling with Great Expectations or Pandas Profiling

### 2.3.4 Labeling Strategy

- **Manual Labeling**: Crowdsourcing (MTurk, Scale), in-house labelers, subject matter experts
- **Semi-Supervised**: Bootstrap with weak labels, then refine
- **Weak Supervision**: Snorkel, programmatic labeling functions
- **Active Learning**: Select most informative samples for labeling
- **Synthetic Data**: Augment dataset with generated samples

**Label Quality Metrics**:
- Inter-annotator agreement: Cohens kappa > 0.7, Fleiss kappa > 0.6
- Label error rate: < 5%
- Label distribution match with production: JS divergence < 0.1

## 2.4 Phase 3: ML Modeling

### 2.4.1 Algorithm Selection Framework

| Condition | Data Volume | Interpretability | Latency | Selection |
|---|---|---|---|---|
| Regression | <10k samples | Required | <10ms | Linear Regression / LASSO |
| Regression | <10k samples | Not required | any | GBR / XGBoost |
| Regression | >100k samples | Required | <10ms | LightGBM with SHAP |
| Regression | >100k samples | Not required | >50ms | Neural Network |
| Binary Clf | <10k samples | Required | <10ms | Logistic Regression |
| Binary Clf | <10k samples | Not required | any | Random Forest / XGBoost |
| Binary Clf | >100k samples | Required | <10ms | GAM / Explainable Boosting |
| Binary Clf | >100k samples | Not required | >50ms | Neural Network / Transformer |
| Multiclass | <10k samples | Required | any | Linear SVM / Naive Bayes |
| Multiclass | >100k samples | Not required | >50ms | Transformer / CNN |
| Multiclass | >1M samples | Not required | any | DistilBERT / EfficientNet |
| Text | <10k samples | Required | any | TF-IDF + Logistic Regression |
| Text | >10k samples | Not required | >50ms | BERT / RoBERTa fine-tune |
| Text | >100k samples | Not required | >100ms | GPT / LLM fine-tune |
| Image | <1k samples | any | any | ResNet (pretrained) / EfficientNet |
| Image | >10k samples | Not required | >50ms | ViT / ConvNeXt |
| Image | >1M samples | Not required | >100ms | Custom ViT from scratch |

### 2.4.2 Baseline Modeling

Always start with a simple baseline before complex models:

1. **Random Baseline**: Random prediction within label distribution
2. **Majority Class Baseline**: Always predict the most common label
3. **Heuristic Baseline**: Simple rule-based system
4. **Linear Baseline**: Logistic regression or linear regression
5. **Tree Baseline**: Decision tree with max_depth=3 for interpretability

Compare all subsequent models against these baselines.

### 2.4.3 Experiment Tracking

Every experiment must capture:

```yaml
experiment:
  id: exp_20240527_001
  timestamp: 2024-05-27T10:00:00Z
  user: ml-engineer@synarc
  git_commit: a1b2c3d4e5f6
  code_branch: feature/embedding-refactor
  dataset:
    name: user_behavior_v4
    version: 4.2.1
    split: train/val/test 80/10/10
    row_count: 1250000
    feature_count: 342
  model:
    architecture: transformer_encoder
    parameter_count: 85M
    framework: pytorch_2.1
    hardware: 4x A100 80GB
    training_time: 6h 23m
    hyperparameters:
      learning_rate: 3e-4
      batch_size: 256
      warmup_steps: 1000
      weight_decay: 0.01
      dropout: 0.1
  metrics:
    validation:
      accuracy: 0.937
      f1_macro: 0.921
      auc_roc: 0.978
      log_loss: 0.183
    test:
      accuracy: 0.931
      f1_macro: 0.915
      auc_roc: 0.974
  artifacts:
    model_path: s3://models/experiments/exp_20240527_001/model.pt
    metrics_path: s3://models/experiments/exp_20240527_001/metrics.json
```

## 2.5 Phase 4: Training and Evaluation

### 2.5.1 Training Pipeline Pseudocode

```python
def train_pipeline(config):
    train_data = load_dataset(config.train_path)
    val_data = load_dataset(config.val_path)
    train_features = transform_features(train_data, config.features)
    val_features = transform_features(val_data, config.features)
    train_loader = DataLoader(train_features, batch_size=config.batch_size, shuffle=True)
    val_loader = DataLoader(val_features, batch_size=config.batch_size, shuffle=False)
    model = init_model(config.model_arch, config.model_params)
    optimizer = init_optimizer(model, config.optimizer, config.learning_rate)
    scheduler = init_scheduler(optimizer, config.scheduler)
    for epoch in range(config.epochs):
        train_metrics = train_epoch(model, train_loader, optimizer, criterion)
        val_metrics = validate_epoch(model, val_loader, criterion)
        log_metrics({**train_metrics, **val_metrics, "epoch": epoch})
        if val_metrics["loss"] < best_val_loss:
            save_checkpoint(model, optimizer, epoch, val_metrics)
    test_metrics = evaluate(model, test_loader)
    log_metrics(test_metrics)
    register_model(model, test_metrics, config)
```

### 2.5.2 Hyperparameter Tuning Strategy

| Method | Budget | When To Use |
|---|---|---|
| Grid Search | High | Few params (<5), small search space |
| Random Search | Medium | Many params, limited compute |
| Bayesian Optimization | Low-Medium | Expensive training, medium param count |
| Population-Based Training | High | Large-scale distributed training |
| Hyperband / ASHA | Low | Many configurations, early stopping |
| Evolutionary Opt | Medium | Non-differentiable search spaces |

### 2.5.3 Evaluation Protocol

**Offline Evaluation**:
- Holdout test set (never used during development)
- Cross-validation for small datasets (k=5 or k=10)
- Temporal validation for time-series data
- Stratified splits for imbalanced datasets

**Online Evaluation**:
- A/B testing with statistical significance (p < 0.05)
- Interleaved experiments for ranking models
- Shadow deployment: run new model in parallel without serving
- Canary deployment: route 1% to 5% to 20% to 100% traffic

## 2.6 Phase 5: Deployment

### 2.6.1 Deployment Strategies

| Strategy | Risk Level | Traffic Impact | Rollback Time | Use Case |
|---|---|---|---|---|
| Shadow | None | 0% | Instant | Validation before production |
| Canary | Low | Gradual | Fast (1 min) | Low-risk production rollout |
| Blue/Green | Medium | Full switch | Medium (5 min) | High-confidence releases |
| Rolling | Low | Gradual | Fast | Microservice deployments |
| A/B Test | Low | Segmented | Fast | Experimental features |

### 2.6.2 Deployment Checklist

- Model passes offline evaluation thresholds
- Model passes shadow deployment validation (48h minimum)
- Container image built and tagged with git SHA
- Model artifact versioned in model registry
- Deployment manifest reviewed and approved
- Rollback plan documented and tested
- Monitoring dashboards updated
- Alerts configured for key metrics
- Runbook updated with deployment steps
- Stakeholders notified of deployment window

## 2.7 Phase 6: Monitoring and Retraining

### 2.7.1 Monitoring Pillars

1. **Data Drift**: Changes in input feature distribution
2. **Prediction Drift**: Changes in model output distribution
3. **Concept Drift**: Changes in relationship between features and target
4. **Model Performance**: Degradation in accuracy, AUC
5. **System Metrics**: Latency, throughput, memory, CPU/GPU utilization
6. **Data Quality**: Missing values, outliers, schema violations

### 2.7.2 Automated Retraining Triggers

- Scheduled: Daily / Weekly / Monthly
- Data Volume: New data exceeds threshold (e.g., 100k new samples)
- Data Drift: PSI > 0.2 on any top-5 feature
- Performance Degradation: AUC drops > 0.02
- Concept Drift: Detected via ADWIN / DDM / Page-Hinkley
- Manual: Triggered by engineer via UI or API

## 2.8 Iteration Cadence

| Activity | Cadence | Owner |
|---|---|---|
| Experiment new features | Daily | ML Engineer |
| Retrain production models | Weekly | Automated pipeline |
| Review monitoring dashboards | Daily | ML Engineer |
| Evaluate new algorithms | Monthly | ML Engineer + DS |
| Architecture review | Quarterly | ML Engineer + Platform |
| Cost optimization review | Monthly | ML Engineer + FinOps |
| Incident post-mortem | Per incident | ML Team |

# P4: Pipeline Design

## 4.1 Pipeline Architecture Principles

### 4.1.1 Core Principles

1. **Determinism**: Same input produces same output (record all random seeds)
2. **Reproducibility**: Full lineage capture for every pipeline run
3. **Idempotency**: Re-running a pipeline produces the same results
4. **Incrementality**: Only process data that has changed
5. **Observability**: Every stage logs metrics, duration, data counts
6. **Failure Isolation**: A failure in one stage does not cascade
7. **Backfillability**: Ability to re-process historical data

### 4.1.2 Pipeline Stages

```
Raw Data -> Validation -> Cleaning -> Feature Engineering -> Training -> Evaluation -> Deployment
```

## 4.2 Data Pipeline Design

### 4.2.1 Batch Data Pipeline

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

default_args = {
    'owner': 'ml-engineer',
    'depends_on_past': False,
    'email_on_failure': True,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'feature_pipeline_hourly',
    default_args=default_args,
    schedule_interval='0 * * * *',
    start_date=datetime(2024, 1, 1),
    catchup=False,
    max_active_runs=1,
)

def validate_raw_data(**context):
    from great_expectations.dataset import PandasDataset
    execution_date = context['execution_date']
    df = pd.read_parquet(f's3://data/raw/{execution_date.strftime("%Y/%m/%d/%H")}/')
    dataset = PandasDataset(df)
    expectations = [
        dataset.expect_column_values_to_not_be_null("user_id"),
        dataset.expect_column_values_to_be_between("age", 0, 120),
    ]
    if not all(e.success for e in expectations):
        raise ValueError("Data validation failed")
    return "validated"

def clean_data(**context):
    execution_date = context['execution_date']
    df = pd.read_parquet(f's3://data/raw/{execution_date.strftime("%Y/%m/%d/%H")}/')
    for col in df.select_dtypes(include=[np.number]).columns:
        Q1, Q3 = df[col].quantile(0.01), df[col].quantile(0.99)
        IQR = Q3 - Q1
        df = df[(df[col] >= Q1 - 1.5 * IQR) & (df[col] <= Q3 + 1.5 * IQR)]
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].fillna('unknown')
    for col in df.select_dtypes(include=[np.number]).columns:
        df[col] = df[col].fillna(df[col].median())
    output_path = f's3://data/cleaned/{execution_date.strftime("%Y/%m/%d/%H")}/'
    df.to_parquet(output_path)
    return output_path

validate_task = PythonOperator(task_id='validate_raw_data', python_callable=validate_raw_data, provide_context=True, dag=dag)
clean_task = PythonOperator(task_id='clean_data', python_callable=clean_data, provide_context=True, dag=dag)
validate_task >> clean_task
```

### 4.2.2 Streaming Data Pipeline

```python
import faust
import numpy as np
from datetime import datetime, timedelta
from collections import defaultdict

app = faust.App('feature-stream-processor', broker='kafka://localhost:9092')

class TransactionEvent(faust.Record, serializer='json'):
    user_id: str
    transaction_id: str
    amount: float
    merchant: str
    timestamp: float

transactions_topic = app.topic('raw-transactions', value_type=TransactionEvent)
features_topic = app.topic('online-features', value_type=dict)
alerts_topic = app.topic('fraud-alerts', value_type=dict)

user_transactions = defaultdict(lambda: [])
WINDOW_SIZES = [60, 300, 3600, 86400]

@app.agent(transactions_topic)
async def process_transactions(stream):
    async for event in stream:
        user_id = event.user_id
        now = datetime.fromtimestamp(event.timestamp)
        user_transactions[user_id].append((now, event.amount))
        oldest_allowed = now - timedelta(seconds=max(WINDOW_SIZES))
        user_transactions[user_id] = [
            (ts, amt) for ts, amt in user_transactions[user_id] if ts > oldest_allowed
        ]
        features = {'user_id': user_id, 'transaction_id': event.transaction_id, 'timestamp': event.timestamp}
        for window in WINDOW_SIZES:
            window_events = [amt for ts, amt in user_transactions[user_id] if ts > now - timedelta(seconds=window)]
            amounts = np.array(window_events) if window_events else np.array([0])
            features[f'window_{window}s_count'] = len(window_events)
            features[f'window_{window}s_sum'] = float(amounts.sum())
            features[f'window_{window}s_mean'] = float(amounts.mean()) if window_events else 0.0
            features[f'window_{window}s_max'] = float(amounts.max()) if window_events else 0.0
        await features_topic.send(value=features)
        if features['window_60s_count'] > 10 and features['window_60s_sum'] > 5000:
            await alerts_topic.send(value={'user_id': user_id, 'reason': 'high_frequency_large_amount', 'severity': 'high'})
```

## 4.3 Feature Engineering Pipeline

### 4.3.1 Feature Types

| Feature Type | Description | Example | Computation Cost |
|---|---|---|---|
| Raw | Direct from data source | Age, income | None |
| Aggregated | Grouped statistics | Avg purchase per user | Medium |
| Temporal | Time-based features | Hour of day, day of week | Low |
| Text | NLP-derived | TF-IDF, BERT embeddings | High |
| Cross | Feature interactions | age x income | Low |
| Ratio | Division of two features | debt_to_income | Low |
| Difference | Delta from baseline | difference_from_mean | Low |
| Embedding | Learned representations | Item2Vec embeddings | Very High |
| Windowed | Rolling window stats | 7-day moving average | Medium |
| Lagged | Previous values | yesterdays price | Low |

### 4.3.2 Feature Engineering Implementation

```python
import pandas as pd
import numpy as np
from typing import List, Dict, Optional
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.decomposition import PCA
from datetime import datetime, timedelta

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def __init__(self, config: Dict):
        self.config = config
        self.transformers = {}
        self.scaler = None
        self.selected_features = None

    def fit(self, X: pd.DataFrame, y: Optional[pd.Series] = None):
        df = X.copy()
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        scale_type = self.config.get('scaling', 'standard')
        if scale_type == 'standard':
            self.scaler = StandardScaler()
        elif scale_type == 'minmax':
            self.scaler = MinMaxScaler()
        elif scale_type == 'robust':
            self.scaler = RobustScaler()
        if self.scaler and numeric_cols:
            self.scaler.fit(df[numeric_cols])
        cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        for col in cat_cols:
            le = LabelEncoder()
            le.fit(df[col].fillna('unknown').astype(str))
            self.transformers[f'label_encoder_{col}'] = le
        if self.config.get('feature_selection') and y is not None:
            selector = SelectKBest(
                score_func=self.config.get('feature_selection_method', mutual_info_classif),
                k=self.config.get('n_features', 50)
            )
            X_encoded = self._encode_all(df, is_train=True)
            selector.fit(X_encoded, y)
            self.selected_features = X_encoded.columns[selector.get_support()].tolist()
            self.transformers['selector'] = selector
        if self.config.get('use_pca'):
            pca = PCA(n_components=self.config.get('pca_components', 10))
            X_encoded = self._encode_all(df, is_train=True)
            pca.fit(X_encoded)
            self.transformers['pca'] = pca
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        return self._encode_all(X, is_train=False)

    def _encode_all(self, df: pd.DataFrame, is_train: bool = False) -> pd.DataFrame:
        df = df.copy()
        result = pd.DataFrame(index=df.index)
        if self.config.get('temporal_features', True) and 'timestamp' in df.columns:
            timestamps = pd.to_datetime(df['timestamp'])
            result['hour'] = timestamps.dt.hour
            result['day_of_week'] = timestamps.dt.dayofweek
            result['month'] = timestamps.dt.month
            result['quarter'] = timestamps.dt.quarter
            result['is_weekend'] = timestamps.dt.dayofweek.isin([5, 6]).astype(int)
            result['hour_sin'] = np.sin(2 * np.pi * result['hour'] / 24)
            result['hour_cos'] = np.cos(2 * np.pi * result['hour'] / 24)
            result['dow_sin'] = np.sin(2 * np.pi * result['day_of_week'] / 7)
            result['dow_cos'] = np.cos(2 * np.pi * result['day_of_week'] / 7)
            result['month_sin'] = np.sin(2 * np.pi * result['month'] / 12)
            result['month_cos'] = np.cos(2 * np.pi * result['month'] / 12)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        for col in numeric_cols:
            if col in ['user_id', 'transaction_id']:
                continue
            result[col] = df[col]
            if self.config.get('log_transform', True):
                positive = df[col] > 0
                result[f'{col}_log'] = np.where(positive, np.log1p(df[col]), 0)
            result[f'{col}_sq'] = df[col] ** 2
            result[f'{col}_sqrt'] = np.sqrt(np.abs(df[col]))
            result[f'{col}_is_missing'] = df[col].isna().astype(int)
        cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        for col in cat_cols:
            if col in ['user_id', 'transaction_id']:
                continue
            encoder_key = f'label_encoder_{col}'
            if encoder_key in self.transformers:
                encoded = self.transformers[encoder_key].transform(df[col].fillna('unknown').astype(str))
            else:
                encoded = pd.factorize(df[col].fillna('unknown').astype(str))[0]
            result[f'{col}_encoded'] = encoded
            freq_map = df[col].value_counts(normalize=True)
            result[f'{col}_freq'] = df[col].map(freq_map).fillna(0)
            if self.config.get('one_hot_encode', True):
                top_k = self.config.get('one_hot_k', 10)
                top_categories = df[col].value_counts().nlargest(top_k).index
                for cat in top_categories:
                    result[f'{col}_oh_{cat}'] = (df[col] == cat).astype(int)
        if self.config.get('cross_features', True):
            num_cols = numeric_cols[:self.config.get('max_cross_cols', 10)]
            for i in range(len(num_cols)):
                for j in range(i + 1, min(i + 3, len(num_cols))):
                    col_i, col_j = num_cols[i], num_cols[j]
                    if col_i in df.columns and col_j in df.columns:
                        result[f'cross_{col_i}_{col_j}_mul'] = df[col_i] * df[col_j]
                        result[f'cross_{col_i}_{col_j}_add'] = df[col_i] + df[col_j]
                        result[f'cross_{col_i}_{col_j}_div'] = df[col_i] / (df[col_j] + 1e-8)
        if self.scaler and numeric_cols:
            scaled_cols = [c for c in numeric_cols if c in result.columns]
            if scaled_cols:
                result[[f'{c}_scaled' for c in scaled_cols]] = self.scaler.transform(result[scaled_cols])
        if 'selector' in self.transformers and not is_train:
            selector = self.transformers['selector']
            available = [c for c in self.selected_features if c in result.columns]
            result = result[available]
        if 'pca' in self.transformers:
            pca = self.transformers['pca']
            numeric_for_pca = result.select_dtypes(include=[np.number]).fillna(0)
            pca_features = pca.transform(numeric_for_pca)
            for i in range(pca_features.shape[1]):
                result[f'pca_{i}'] = pca_features[:, i]
        return result
```

### 4.3.3 Aggregate Feature Builder

```python
class AggregateFeatureBuilder:
    def __init__(self, grouping_col='user_id', value_col='amount', windows=[1, 7, 30, 90]):
        self.grouping_col = grouping_col
        self.value_col = value_col
        self.windows = windows

    def build(self, df):
        df = df.copy()
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        all_features = []
        for entity_id, group in df.groupby(self.grouping_col):
            group = group.sort_values('timestamp')
            features = {self.grouping_col: entity_id}
            for window_days in self.windows:
                cutoff = group['timestamp'].max() - timedelta(days=window_days)
                window_data = group[group['timestamp'] >= cutoff]
                if len(window_data) > 0:
                    values = window_data[self.value_col]
                    features[f'agg_{window_days}d_count'] = len(window_data)
                    features[f'agg_{window_days}d_sum'] = values.sum()
                    features[f'agg_{window_days}d_mean'] = values.mean()
                    features[f'agg_{window_days}d_std'] = values.std() if len(values) > 1 else 0.0
                    features[f'agg_{window_days}d_min'] = values.min()
                    features[f'agg_{window_days}d_max'] = values.max()
                    features[f'agg_{window_days}d_median'] = values.median()
                    features[f'agg_{window_days}d_skew'] = values.skew() if len(values) > 2 else 0.0
                else:
                    features[f'agg_{window_days}d_count'] = 0
                    features[f'agg_{window_days}d_sum'] = 0.0
                    features[f'agg_{window_days}d_mean'] = 0.0
                    features[f'agg_{window_days}d_std'] = 0.0
                    features[f'agg_{window_days}d_min'] = 0.0
                    features[f'agg_{window_days}d_max'] = 0.0
            if len(group) > 1:
                recent = group.tail(min(10, len(group)))
                values = recent[self.value_col].values
                features['rate_of_change_last_10'] = (values[-1] - values[0]) / (values[0] + 1e-8)
                features['volatility_last_10'] = values.std() if len(values) > 1 else 0.0
                features['trend_last_10'] = np.polyfit(range(len(values)), values, 1)[0] if len(values) > 1 else 0.0
            else:
                features['rate_of_change_last_10'] = 0.0
                features['volatility_last_10'] = 0.0
                features['trend_last_10'] = 0.0
            all_features.append(features)
        return pd.DataFrame(all_features)
```

## 4.4 Training Pipeline Design

### 4.4.1 Kubeflow Pipeline

```python
import kfp
from kfp import dsl
from kfp.components import func_to_container_op

@func_to_container_op
def load_data_op(data_path: str) -> str:
    import pandas as pd
    df = pd.read_parquet(data_path)
    output_path = '/tmp/data/loaded_data.parquet'
    df.to_parquet(output_path)
    return output_path

@func_to_container_op
def validate_data_op(data_path: str) -> str:
    import pandas as pd
    from great_expectations.dataset import PandasDataset
    df = pd.read_parquet(data_path)
    dataset = PandasDataset(df)
    expectations = [
        dataset.expect_column_values_to_not_be_null("feature_1"),
        dataset.expect_column_values_to_be_between("feature_1", -10, 10),
    ]
    if not all(e.success for e in expectations):
        raise ValueError("Data validation failed")
    return data_path

@func_to_container_op
def train_model_op(train_data_path: str, val_data_path: str, hyperparams: dict) -> str:
    import mlflow
    import pandas as pd
    from sklearn.ensemble import GradientBoostingClassifier
    from sklearn.metrics import accuracy_score, f1_score
    mlflow.set_tracking_uri("http://mlflow:5000")
    with mlflow.start_run() as run:
        train_df = pd.read_parquet(train_data_path)
        val_df = pd.read_parquet(val_data_path)
        X_train, y_train = train_df.drop('target', axis=1), train_df['target']
        X_val, y_val = val_df.drop('target', axis=1), val_df['target']
        model = GradientBoostingClassifier(
            n_estimators=hyperparams.get('n_estimators', 100),
            max_depth=hyperparams.get('max_depth', 3),
            learning_rate=hyperparams.get('learning_rate', 0.1),
        )
        model.fit(X_train, y_train)
        train_preds, val_preds = model.predict(X_train), model.predict(X_val)
        mlflow.log_params(hyperparams)
        mlflow.log_metrics({
            'train_accuracy': accuracy_score(y_train, train_preds),
            'val_accuracy': accuracy_score(y_val, val_preds),
            'train_f1': f1_score(y_train, train_preds, average='weighted'),
            'val_f1': f1_score(y_val, val_preds, average='weighted'),
        })
        mlflow.sklearn.log_model(model, "model")
        return run.info.run_id

@func_to_container_op
def register_model_op(run_id: str, model_name: str, metric_threshold: float) -> str:
    import mlflow
    from mlflow.tracking.client import MlflowClient
    client = MlflowClient()
    run = client.get_run(run_id)
    val_accuracy = run.data.metrics.get('val_accuracy', 0)
    if val_accuracy >= metric_threshold:
        model_uri = f"runs:/{run_id}/model"
        registered = mlflow.register_model(model_uri, model_name)
        client.transition_model_version_stage(name=model_name, version=registered.version, stage="Staging")
        return f"Registered version {registered.version} in Staging"
    else:
        return f"Model rejected: val_accuracy {val_accuracy} < threshold {metric_threshold}"

@dsl.pipeline(name='ML Training Pipeline', description='End-to-end ML training pipeline')
def ml_training_pipeline(
    train_data_path: str = 's3://data/train/latest/',
    val_data_path: str = 's3://data/val/latest/',
    test_data_path: str = 's3://data/test/latest/',
    model_name: str = 'production_model',
    metric_threshold: float = 0.8,
    n_estimators: int = 100,
    max_depth: int = 3,
    learning_rate: float = 0.1,
):
    load_train = load_data_op(train_data_path)
    load_val = load_data_op(val_data_path)
    load_test = load_data_op(test_data_path)
    validate_train = validate_data_op(load_train.output)
    validate_val = validate_data_op(load_val.output)
    validate_test = validate_data_op(load_test.output)
    hyperparams = {'n_estimators': n_estimators, 'max_depth': max_depth, 'learning_rate': learning_rate}
    train = train_model_op(train_data_path=validate_train.output, val_data_path=validate_val.output, hyperparams=hyperparams)
    register = register_model_op(run_id=train.output, model_name=model_name, metric_threshold=metric_threshold)

kfp.compiler.Compiler().compile(ml_training_pipeline, 'ml_training_pipeline.yaml')
```

## 4.5 Feature Store Interaction Patterns

### 4.5.1 Training Data Generation

```python
from feast import FeatureStore
import pandas as pd
from datetime import datetime
from typing import List, Optional

class TrainingDataGenerator:
    def __init__(self, repo_path: str = "./feature_repo"):
        self.store = FeatureStore(repo_path=repo_path)

    def generate_training_data(self, entity_df: pd.DataFrame, feature_names: List[str]) -> pd.DataFrame:
        if 'event_timestamp' not in entity_df.columns:
            entity_df['event_timestamp'] = datetime.now()
        training_df = self.store.get_historical_features(
            entity_df=entity_df, features=feature_names
        ).to_df()
        return training_df

    def get_feature_serving(self, entity_rows: List[dict], features: List[str]) -> dict:
        return self.store.get_online_features(
            features=features, entity_rows=entity_rows
        ).to_dict()
```

## 4.6 Pipeline Testing

### 4.6.1 Unit Tests

```python
import pytest
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class TestFeatureEngineer:
    @pytest.fixture
    def sample_data(self):
        np.random.seed(42)
        n = 1000
        return pd.DataFrame({
            'user_id': np.random.randint(1, 100, n),
            'age': np.random.randint(18, 80, n),
            'income': np.random.normal(50000, 20000, n),
            'country': np.random.choice(['US', 'UK', 'CA', 'DE', 'FR', 'JP'], n),
            'transaction_amount': np.random.exponential(100, n),
            'timestamp': pd.date_range('2024-01-01', periods=n, freq='h'),
            'target': np.random.binomial(1, 0.3, n),
        })

    def test_feature_count(self, sample_data):
        config = {'temporal_features': True, 'log_transform': True, 'cross_features': True, 'one_hot_encode': True, 'one_hot_k': 3}
        fe = FeatureEngineer(config)
        X, y = sample_data.drop('target', axis=1), sample_data['target']
        fe.fit(X, y)
        result = fe.transform(X)
        assert result.shape[1] > X.shape[1]
        assert result.shape[0] == X.shape[0]

    def test_temporal_features_created(self, sample_data):
        config = {'temporal_features': True}
        fe = FeatureEngineer(config)
        X = sample_data.drop('target', axis=1)
        fe.fit(X)
        result = fe.transform(X)
        for col in ['hour', 'day_of_week', 'month', 'is_weekend', 'hour_sin', 'hour_cos']:
            assert col in result.columns, f"Missing: {col}"

    def test_deterministic_output(self, sample_data):
        config = {'temporal_features': True, 'cross_features': True}
        X = sample_data.drop('target', axis=1)
        fe1, fe2 = FeatureEngineer(config), FeatureEngineer(config)
        fe1.fit(X)
        fe2.fit(X)
        result1 = fe1.transform(X)
        result2 = fe2.transform(X)
        pd.testing.assert_frame_equal(result1, result2)
```

## 4.7 Pipeline Monitoring and Alerting

### 4.7.1 Pipeline Metrics

| Metric | Description | Alert Threshold |
|---|---|---|
| pipeline_duration_seconds | Total pipeline execution time | > 2x expected |
| data_row_count | Number of rows processed | < 80% of expected |
| data_null_fraction | Fraction of null values | > 0.05 |
| feature_count | Number of features generated | < 90% of expected |
| feature_distribution_psi | Feature distribution shift | PSI > 0.2 |
| training_loss | Training loss value | NaN or Inf |
| validation_metric | Validation metric (AUC, F1) | Drop > 0.02 |
| model_size_bytes | Model artifact size | > 2x expected |

### 4.7.2 Alert Routing

```
Pipeline Failure
  - Data validation failure -> Data Engineering team (PagerDuty)
  - Training failure -> ML Engineer (Slack)
  - Evaluation metric drop -> ML Engineer + Data Science (Email + Slack)
  - Deployment failure -> ML Engineer + Platform Engineering (PagerDuty)
  - Cost anomaly -> ML Engineer + FinOps (Email)
  - Unknown error -> ML Engineer (PagerDuty)

# P6: Model Serving and Deployment

## 6.1 Serving Architecture Patterns

### 6.1.1 Online Serving

Online serving provides real-time predictions via REST/gRPC endpoints.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mlflow.pyfunc
import numpy as np
import time, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Model Serving API", version="1.0.0")
model = mlflow.pyfunc.load_model("models:/production-model/latest")

class PredictRequest(BaseModel):
    features: list
    request_id: str = None

class PredictResponse(BaseModel):
    prediction: float
    probability: float = None
    request_id: str = None
    latency_ms: float

@app.on_event("startup")
def load_model():
    global model
    logger.info("Loading model...")
    model = mlflow.pyfunc.load_model("models:/production-model/latest")
    logger.info("Model loaded successfully")

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    start = time.time()
    try:
        features = np.array(request.features).reshape(1, -1)
        prediction = model.predict(features)[0]
        proba = model.predict_proba(features)[0].max() if hasattr(model, "predict_proba") else None
        latency = (time.time() - start) * 1000
        return PredictResponse(
            prediction=float(prediction),
            probability=float(proba) if proba is not None else None,
            request_id=request.request_id,
            latency_ms=round(latency, 2),
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_batch")
async def predict_batch(requests: list[PredictRequest]):
    start = time.time()
    try:
        features = np.array([r.features for r in requests])
        predictions = model.predict(features)
        probas = model.predict_proba(features).max(axis=1) if hasattr(model, "predict_proba") else None
        results = []
        for i, req in enumerate(requests):
            results.append({
                "prediction": float(predictions[i]),
                "probability": float(probas[i]) if probas is not None else None,
                "request_id": req.request_id,
            })
        return {"predictions": results, "total_latency_ms": round((time.time() - start) * 1000, 2), "batch_size": len(requests)}
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model": "production-model", "timestamp": time.time()}

@app.get("/metadata")
async def metadata():
    return {
        "model_name": "production-model",
        "framework": "pytorch",
        "input_dim": 342,
        "output_dim": 2,
        "model_version": "v2.1.0",
    }
```

### 6.1.2 Batch Serving

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf
from pyspark.sql.types import DoubleType, StructType, StructField
import mlflow.pyfunc
import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-path", required=True)
    parser.add_argument("--output-path", required=True)
    parser.add_argument("--model-uri", default="models:/production-model/latest")
    return parser.parse_args()

def run_batch_inference(spark, input_path, output_path, model_uri):
    df = spark.read.parquet(input_path)
    model = mlflow.pyfunc.load_model(model_uri)

    def predict_batch(features_list):
        import numpy as np
        features = np.array(features_list)
        return model.predict(features).tolist()

    predict_schema = StructType([StructField("prediction", DoubleType(), True)])
    predict_udf = udf(predict_batch, predict_schema)
    predictions = df.withColumn("prediction", predict_udf(col("features")))
    predictions.write.mode("overwrite").parquet(output_path)
    return predictions.count()

if __name__ == "__main__":
    args = parse_args()
    spark = SparkSession.builder.appName("batch-inference").getOrCreate()
    count = run_batch_inference(spark, args.input_path, args.output_path, args.model_uri)
    print(f"Processed {count} records")
    spark.stop()
```

## 6.2 Deployment Strategies

### 6.2.1 Canary Deployment

```python
import random
import hashlib

class CanaryDeployer:
    def __init__(self, model_a_endpoint, model_b_endpoint, canary_percent=5):
        self.model_a = model_a_endpoint
        self.model_b = model_b_endpoint
        self.canary_percent = canary_percent
        self.metrics_a = {'total': 0, 'errors': 0, 'latency': []}
        self.metrics_b = {'total': 0, 'errors': 0, 'latency': []}

    def should_route_to_canary(self, entity_id):
        hash_val = int(hashlib.md5(str(entity_id).encode()).hexdigest(), 16) % 100
        return hash_val < self.canary_percent

    def predict(self, features, entity_id=None):
        import time
        if entity_id and self.should_route_to_canary(entity_id):
            start = time.time()
            try:
                result = self.model_b.predict(features)
                self.metrics_b['total'] += 1
                self.metrics_b['latency'].append((time.time() - start) * 1000)
                return result, 'canary'
            except Exception as e:
                self.metrics_b['errors'] += 1
                self.metrics_b['total'] += 1
                raise e
        else:
            start = time.time()
            try:
                result = self.model_a.predict(features)
                self.metrics_a['total'] += 1
                self.metrics_a['latency'].append((time.time() - start) * 1000)
                return result, 'stable'
            except Exception as e:
                self.metrics_a['errors'] += 1
                self.metrics_a['total'] += 1
                raise e

    def promote_canary(self):
        self.canary_percent = min(100, self.canary_percent * 3)
        return self.canary_percent

    def rollback_canary(self):
        self.canary_percent = 0
        return self.canary_percent

    def get_metrics(self):
        from numpy import mean, std
        def compute_stats(arr):
            if not arr:
                return {'mean': 0, 'p50': 0, 'p95': 0, 'p99': 0, 'count': 0}
            arr = sorted(arr)
            return {
                'mean': mean(arr),
                'p50': arr[len(arr) // 2],
                'p95': arr[int(len(arr) * 0.95)],
                'p99': arr[int(len(arr) * 0.99)],
                'count': len(arr),
            }
        return {
            'stable': {**compute_stats(self.metrics_a['latency']), 'errors': self.metrics_a['errors'], 'total': self.metrics_a['total'], 'error_rate': self.metrics_a['errors'] / max(self.metrics_a['total'], 1)},
            'canary': {**compute_stats(self.metrics_b['latency']), 'errors': self.metrics_b['errors'], 'total': self.metrics_b['total'], 'error_rate': self.metrics_b['errors'] / max(self.metrics_b['total'], 1)},
        }
```

### 6.2.2 Blue/Green Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-serving-blue
  labels:
    app: model-serving
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: model-serving
      version: blue
  template:
    metadata:
      labels:
        app: model-serving
        version: blue
    spec:
      containers:
      - name: model-server
        image: 123456789.dkr.ecr.us-west-2.amazonaws.com/model:v1.0.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: "8Gi"
            cpu: "4"
          requests:
            memory: "4Gi"
            cpu: "2"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triton-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: triton-server
  template:
    metadata:
      labels:
        app: triton-server
    spec:
      containers:
      - name: triton
        image: nvcr.io/nvidia/tritonserver:23.12-py3
        args:
        - tritonserver
        - --model-repository=/models
        - --load-model=ensemble_model
        - --http-port=8000
        - --grpc-port=8001
        - --metrics-port=8002
        ports:
        - containerPort: 8000
        - containerPort: 8001
        - containerPort: 8002
        resources:
          limits:
            nvidia.com/gpu: 2
            memory: "32Gi"
            cpu: "16"
        volumeMounts:
        - mountPath: /models
          name: model-repo
      volumes:
      - name: model-repo
        persistentVolumeClaim:
          claimName: model-repo-pvc
```

### 6.3.2 TorchServe Configuration

```python
import torch
from ts.torch_handler.base_handler import BaseHandler

class CustomModelHandler(BaseHandler):
    def __init__(self):
        super().__init__()
        self.initialized = False

    def initialize(self, context):
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir = properties.get("model_dir")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = torch.jit.load(f"{model_dir}/model.pt", map_location=self.device)
        self.model.eval()
        self.initialized = True

    def preprocess(self, data):
        import numpy as np
        inputs = []
        for row in data:
            features = row.get("data") or row.get("body")
            if isinstance(features, dict):
                features = features.get("features", features)
            inputs.append(features)
        return torch.tensor(np.array(inputs, dtype=np.float32)).to(self.device)

    def inference(self, data):
        with torch.no_grad():
            results = self.model(data)
        return results

    def postprocess(self, data):
        return data.tolist()
```

## 6.4 Model Optimization for Serving

### 6.4.1 Model Quantization

```python
import torch
import torch.quantization as quant

def quantize_model(model, calibration_loader=None):
    model.eval()
    model.qconfig = quant.get_default_qconfig('fbgemm')
    quant.prepare(model, inplace=True)
    if calibration_loader:
        with torch.no_grad():
            for batch in calibration_loader:
                model(batch)
    quant.convert(model, inplace=True)
    return model

def quantize_dynamic(model):
    return torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear, torch.nn.LSTM, torch.nn.GRU}, dtype=torch.qint8
    )

def export_to_onnx(model, dummy_input, output_path, opset_version=17):
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        export_params=True,
        opset_version=opset_version,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}},
    )
    return output_path

def optimize_with_tensorrt(onnx_path, output_path, precision='fp16'):
    import tensorrt as trt
    TRT_LOGGER = trt.Logger(trt.Logger.WARNING)
    with trt.Builder(TRT_LOGGER) as builder, builder.create_network() as network, trt.OnnxParser(network, TRT_LOGGER) as parser:
        builder.max_batch_size = 64
        config = builder.create_builder_config()
        config.max_workspace_size = 1 << 30
        if precision == 'fp16':
            config.set_flag(trt.BuilderFlag.FP16)
        elif precision == 'int8':
            config.set_flag(trt.BuilderFlag.INT8)
        with open(onnx_path, 'rb') as f:
            parser.parse(f.read())
        engine = builder.build_engine(network, config)
        with open(output_path, 'wb') as f:
            f.write(engine.serialize())
    return output_path
```

### 6.4.2 Model Distillation

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class DistillationTrainer:
    def __init__(self, teacher_model, student_model, temperature=4.0, alpha=0.7):
        self.teacher = teacher_model
        self.student = student_model
        self.temperature = temperature
        self.alpha = alpha

    def distillation_loss(self, student_outputs, teacher_outputs, targets):
        hard_loss = F.cross_entropy(student_outputs, targets)
        soft_teacher = F.softmax(teacher_outputs / self.temperature, dim=1)
        soft_student = F.log_softmax(student_outputs / self.temperature, dim=1)
        soft_loss = F.kl_div(soft_student, soft_teacher, reduction='batchmean') * (self.temperature ** 2)
        return self.alpha * soft_loss + (1 - self.alpha) * hard_loss

    def train(self, train_loader, val_loader, optimizer, num_epochs, device='cuda'):
        self.teacher.eval()
        self.student.train()
        for epoch in range(num_epochs):
            total_loss = 0
            for batch in train_loader:
                inputs, targets = batch
                inputs, targets = inputs.to(device), targets.to(device)
                optimizer.zero_grad()
                with torch.no_grad():
                    teacher_outputs = self.teacher(inputs)
                student_outputs = self.student(inputs)
                loss = self.distillation_loss(student_outputs, teacher_outputs, targets)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            print(f"Epoch {epoch}, Loss: {total_loss / len(train_loader):.4f}")
        return self.student
```

## 6.5 Containerization

### 6.5.1 Dockerfile

```dockerfile
FROM pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
COPY model/ ./model/
ENV MODEL_URI=models:/production-model/latest
ENV MLFLOW_TRACKING_URI=http://mlflow:5000
EXPOSE 8080
CMD ["uvicorn", "src.serve:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "4"]
```

### 6.5.2 CI/CD Deploy Pipeline

```yaml
name: Model Deployment
on:
  workflow_dispatch:
    inputs:
      model_version:
        description: 'Model version to deploy'
        required: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789:role/ml-deploy-role
        aws-region: us-west-2
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
    - name: Download model artifact
      run: mlflow artifacts download --run-id ${{ github.event.inputs.model_version }} --artifact-path model
    - name: Build, tag, and push image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: model-serving
        IMAGE_TAG: ${{ github.event.inputs.model_version }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    - name: Deploy to EKS
      run: |
        kubectl set image deployment/model-serving model-server=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -n production
        kubectl rollout status deployment/model-serving -n production
```

## 6.6 Load Testing and Benchmarking

### 6.6.1 Locust Load Test

```python
from locust import HttpUser, task, between
import random

class ModelServingUser(HttpUser):
    wait_time = between(0.1, 1.0)

    def on_start(self):
        self.features = [random.random() for _ in range(342)]

    @task(10)
    def predict(self):
        payload = {"features": self.features, "request_id": str(random.randint(0, 1000000))}
        with self.client.post("/predict", json=payload, catch_response=True) as response:
            if response.status_code == 200:
                data = response.json()
                if data.get("latency_ms", 0) > 500:
                    response.failure(f"Latency too high: {data['latency_ms']}ms")
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(1)
    def health(self):
        self.client.get("/health")
```

### 6.6.4 Benchmarking Script

```python
import time
import numpy as np
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

class ModelBenchmark:
    def __init__(self, endpoint: str, model_name: str = "benchmark"):
        self.endpoint = endpoint
        self.model_name = model_name

    def single_request(self, features):
        start = time.time()
        try:
            resp = requests.post(f"{self.endpoint}/predict", json={"features": features}, timeout=10)
            latency = (time.time() - start) * 1000
            return {"success": resp.status_code == 200, "latency_ms": latency, "status": resp.status_code}
        except Exception as e:
            return {"success": False, "latency_ms": (time.time() - start) * 1000, "error": str(e)}

    def benchmark(self, num_requests=1000, concurrency=10, feature_dim=342):
        features_list = [[float(np.random.random()) for _ in range(feature_dim)] for _ in range(num_requests)]
        start = time.time()
        results = []
        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = [executor.submit(self.single_request, f) for f in features_list]
            for future in as_completed(futures):
                results.append(future.result())
        total_time = time.time() - start
        latencies = [r["latency_ms"] for r in results if r["success"]]
        successful = sum(1 for r in results if r["success"])
        return {
            "model": self.model_name,
            "total_requests": num_requests,
            "concurrency": concurrency,
            "total_time_seconds": round(total_time, 2),
            "successful": successful,
            "failed": num_requests - successful,
            "success_rate": successful / num_requests,
            "throughput_rps": round(num_requests / total_time, 2),
            "latency_ms": {
                "mean": round(float(np.mean(latencies)), 2),
                "median": round(float(np.median(latencies)), 2),
                "p50": round(float(np.percentile(latencies, 50)), 2),
                "p90": round(float(np.percentile(latencies, 90)), 2),
                "p95": round(float(np.percentile(latencies, 95)), 2),
                "p99": round(float(np.percentile(latencies, 99)), 2),
                "min": round(float(np.min(latencies)), 2),
                "max": round(float(np.max(latencies)), 2),
            },
        }
```

# P8: LLMs and GenAI Patterns

## 8.1 LLM Architecture Patterns

### 8.1.1 LLM Serving Architecture

LLMs present unique challenges due to their size (billions of parameters) and autoregressive generation nature.

### 8.1.2 Key Components

| Component | Purpose | Examples |
|---|---|---|
| Tokenizer | Convert text to token IDs, manage vocab | HuggingFace, SentencePiece |
| KV Cache | Store key-value pairs for attention | GPU memory, PagedAttention |
| Continuous Batching | Batch requests dynamically | vLLM, TGI, Ray Serve |
| Speculative Decoding | Use draft model for faster generation | Medusa, Self-Speculative |
| Quantization | Reduce model precision for efficiency | GPTQ, AWQ, GGUF, bitsandbytes |
| Prefix Caching | Cache common prompt prefixes | vLLM prefix caching |
| Guardrails | Content filtering, input/output validation | NeMo Guardrails |

### 8.1.3 Inference Flow

```
Client -> API Gateway -> LLM Engine (vLLM / TGI) -> KV Cache -> Token Generation -> Response Streaming
```

## 8.2 LLM Serving Implementation

### 8.2.1 vLLM Inference Engine

```python
from vllm import LLM, SamplingParams
from typing import List, Dict
import time

class VLLMInferenceEngine:
    def __init__(self, model_name: str, tensor_parallel_size: int = 1, gpu_memory_utilization: float = 0.9):
        self.model_name = model_name
        self.sampling_params = None
        self.llm = LLM(
            model=model_name,
            tensor_parallel_size=tensor_parallel_size,
            gpu_memory_utilization=gpu_memory_utilization,
            max_model_len=8192,
            trust_remote_code=True,
            dtype="float16",
            seed=42,
        )

    def set_sampling_params(self, temperature=0.7, top_p=0.9, top_k=50, max_tokens=1024, presence_penalty=0.0, frequency_penalty=0.0):
        self.sampling_params = SamplingParams(
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
            max_tokens=max_tokens,
            presence_penalty=presence_penalty,
            frequency_penalty=frequency_penalty,
            stop=["</s>", "Human:", "Assistant:"],
        )

    def generate(self, prompts, sampling_params=None):
        params = sampling_params or self.sampling_params
        if params is None:
            params = SamplingParams(temperature=0.7, max_tokens=1024)
        outputs = self.llm.generate(prompts, params)
        results = []
        for output in outputs:
            results.append({
                'prompt': output.prompt,
                'generated_text': output.outputs[0].text,
                'tokens': len(output.outputs[0].token_ids),
                'finish_reason': output.outputs[0].finish_reason,
            })
        return results

    def chat(self, messages, sampling_params=None):
        params = sampling_params or self.sampling_params
        if params is None:
            params = SamplingParams(temperature=0.7, max_tokens=1024)
        outputs = self.llm.chat(messages, params)
        return [{'role': 'assistant', 'content': output.outputs[0].text} for output in outputs]

    def benchmark(self, prompts, num_runs=3):
        import numpy as np
        results = []
        for _ in range(num_runs):
            start = time.time()
            outputs = self.generate(prompts)
            total_time = time.time() - start
            total_tokens = sum(o['tokens'] for o in outputs)
            results.append({
                'total_time': total_time,
                'total_tokens': total_tokens,
                'throughput_tokens_per_sec': total_tokens / total_time,
                'avg_latency_per_request_ms': (total_time / len(prompts)) * 1000,
            })
        return {
            'model': self.model_name,
            'num_prompts': len(prompts),
            'avg_throughput': float(np.mean([r['throughput_tokens_per_sec'] for r in results])),
            'avg_latency_ms': float(np.mean([r['avg_latency_per_request_ms'] for r in results])),
        }
```

### 8.2.2 OpenAI-Compatible API

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
import time, uuid

app = FastAPI(title="LLM Serving API")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: int = 1024
    stream: bool = False
    stop: Optional[Union[str, List[str]]] = None

class CompletionRequest(BaseModel):
    model: str
    prompt: Union[str, List[str]]
    temperature: float = 0.7
    max_tokens: int = 1024

class EmbeddingRequest(BaseModel):
    model: str
    input: Union[str, List[str]]

llm_engine = None

@app.on_event("startup")
async def startup():
    global llm_engine
    llm_engine = VLLMInferenceEngine(model_name="meta-llama/Llama-2-7b-chat-hf", tensor_parallel_size=1)

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    try:
        outputs = llm_engine.chat(
            [m.dict() for m in request.messages],
            SamplingParams(
                temperature=request.temperature,
                top_p=request.top_p,
                max_tokens=request.max_tokens,
                stop=[request.stop] if isinstance(request.stop, str) else request.stop,
            )
        )
        generated = outputs[0]['content']
        completion_tokens = len(generated.split())
        prompt_tokens = sum(len(m.content.split()) for m in request.messages)
        return {
            "id": f"chatcmpl-{uuid.uuid4().hex[:12]}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [{"index": 0, "message": {"role": "assistant", "content": generated}, "finish_reason": "stop"}],
            "usage": {"prompt_tokens": prompt_tokens, "completion_tokens": completion_tokens, "total_tokens": prompt_tokens + completion_tokens},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/completions")
async def completions(request: CompletionRequest):
    prompts = [request.prompt] if isinstance(request.prompt, str) else request.prompt
    outputs = llm_engine.generate(prompts, SamplingParams(temperature=request.temperature, max_tokens=request.max_tokens))
    choices = [{"index": i, "text": output['generated_text'], "finish_reason": output['finish_reason']} for i, output in enumerate(outputs)]
    return {"id": f"cmpl-{uuid.uuid4().hex[:12]}", "object": "text_completion", "created": int(time.time()), "model": request.model, "choices": choices}

@app.post("/v1/embeddings")
async def embeddings(request: EmbeddingRequest):
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("intfloat/e5-mistral-7b-instruct")
    inputs = [request.input] if isinstance(request.input, str) else request.input
    embeddings = model.encode(inputs).tolist()
    return {
        "object": "list",
        "data": [{"object": "embedding", "index": i, "embedding": emb} for i, emb in enumerate(embeddings)],
        "model": request.model,
        "usage": {"prompt_tokens": sum(len(i.split()) for i in inputs), "total_tokens": sum(len(i.split()) for i in inputs)},
    }
```

## 8.3 Prompt Engineering Patterns

### 8.3.1 Prompt Templates

```python
from typing import Dict, List, Optional

class PromptTemplates:
    @staticmethod
    def instruction_template(instruction: str, context: str = None) -> str:
        parts = []
        if context:
            parts.append(f"Context: {context}")
        parts.append(f"Instruction: {instruction}")
        parts.append("Response:")
        return "\n\n".join(parts)

    @staticmethod
    def few_shot_template(instruction: str, examples: List[Dict], query: str) -> str:
        parts = [f"Instruction: {instruction}\n"]
        for i, example in enumerate(examples):
            parts.append(f"Example {i + 1}:")
            parts.append(f"Input: {example['input']}")
            parts.append(f"Output: {example['output']}")
            parts.append("")
        parts.append(f"Input: {query}")
        parts.append("Output:")
        return "\n".join(parts)

    @staticmethod
    def chain_of_thought_template(question: str, examples: List[Dict] = None) -> str:
        parts = ["Let's think step by step."]
        if examples:
            for ex in examples:
                parts.append(f"Question: {ex['question']}")
                parts.append(f"Reasoning: {ex['reasoning']}")
                parts.append(f"Answer: {ex['answer']}")
                parts.append("")
        parts.append(f"Question: {question}")
        parts.append("Reasoning:")
        return "\n".join(parts)

    @staticmethod
    def rag_template(query: str, contexts: List[str], system_prompt: str = None) -> str:
        parts = []
        if system_prompt:
            parts.append(f"System: {system_prompt}")
            parts.append("")
        parts.append("Context:")
        for i, ctx in enumerate(contexts):
            parts.append(f"[{i + 1}] {ctx}")
        parts.append("")
        parts.append(f"Question: {query}")
        parts.append("Answer based on the context above:")
        return "\n".join(parts)

    @staticmethod
    def structured_extraction_template(text: str, schema: Dict) -> str:
        schema_str = "\n".join([f"  {k}: {v}" for k, v in schema.items()])
        return f"Extract the following fields from the text below:\n\n{schema_str}\n\nText:\n{text}\n\nExtracted structured data (JSON format):"

    @staticmethod
    def classification_template(text: str, classes: List[str]) -> str:
        classes_str = ", ".join(classes)
        return f"Classify the following text into one of these categories: {classes_str}\n\nText: {text}\nCategory:"

    @staticmethod
    def summarization_template(text: str, max_words: int = 100) -> str:
        return f"Summarize the following text in at most {max_words} words:\n\nText:\n{text}\n\nSummary:"
```

### 8.3.2 Prompt Management

```python
import json, hashlib
from datetime import datetime
from typing import Dict, List, Optional

class PromptManager:
    def __init__(self, storage_path: str = './prompts'):
        self.storage_path = storage_path
        import os
        os.makedirs(storage_path, exist_ok=True)
        self.prompts = {}

    def register_prompt(self, name: str, template: str, version: str = "1.0.0", metadata: Dict = None):
        prompt_id = hashlib.sha256(f"{name}:{version}".encode()).hexdigest()[:12]
        self.prompts[prompt_id] = {
            'id': prompt_id,
            'name': name,
            'template': template,
            'version': version,
            'created_at': datetime.now().isoformat(),
            'metadata': metadata or {},
        }
        import os
        path = f"{self.storage_path}/{name}/{version}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(self.prompts[prompt_id], f, indent=2)
        return prompt_id

    def render(self, name: str, variables: Dict, version: str = "latest") -> str:
        template = self._load_template(name, version)
        for k, v in variables.items():
            template = template.replace(f"{{{{{k}}}}}", str(v))
        return template

    def _load_template(self, name: str, version: str = "latest") -> str:
        import os
        if version == "latest":
            versions_dir = f"{self.storage_path}/{name}/"
            if not os.path.exists(versions_dir):
                raise ValueError(f"Prompt '{name}' not found")
            versions = sorted(os.listdir(versions_dir))
            version = versions[-1].replace('.json', '')
        with open(f"{self.storage_path}/{name}/{version}.json") as f:
            data = json.load(f)
        return data['template']

    def evaluate_prompt(self, prompt: str, model, expected_output: str = None) -> Dict:
        output = model.generate([prompt])[0]['generated_text']
        result = {'prompt': prompt, 'output': output, 'length': len(output), 'tokens': len(output.split())}
        if expected_output:
            from difflib import SequenceMatcher
            similarity = SequenceMatcher(None, output, expected_output).ratio()
            result['similarity_to_expected'] = similarity
        return result
```

## 8.4 RAG (Retrieval-Augmented Generation)

### 8.4.1 RAG Pipeline

```python
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Tuple, Optional
import faiss, pickle, os

class RAGPipeline:
    def __init__(self, embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2", use_gpu: bool = False):
        self.embedding_model = SentenceTransformer(embedding_model_name)
        if use_gpu:
            self.embedding_model = self.embedding_model.to('cuda')
        self.index = None
        self.documents = []
        self.metadata = []
        self.chunk_size = 512
        self.chunk_overlap = 64

    def chunk_documents(self, documents, chunk_size=None, overlap=None):
        chunk_size = chunk_size or self.chunk_size
        overlap = overlap or self.chunk_overlap
        chunks = []
        for doc in documents:
            text = doc.get('text', doc.get('content', ''))
            doc_id = doc.get('id', str(len(chunks)))
            title = doc.get('title', '')
            if len(text) <= chunk_size:
                chunks.append({'id': f"{doc_id}_0", 'text': text, 'title': title, 'metadata': doc.get('metadata', {})})
            else:
                words = text.split()
                for i in range(0, len(words), chunk_size - overlap):
                    chunk_text = ' '.join(words[i:i + chunk_size])
                    chunks.append({'id': f"{doc_id}_{i // (chunk_size - overlap)}", 'text': chunk_text, 'title': title, 'metadata': doc.get('metadata', {})})
        return chunks

    def build_index(self, documents):
        chunks = self.chunk_documents(documents)
        texts = [c['text'] for c in chunks]
        embeddings = self.embedding_model.encode(texts, show_progress_bar=True, normalize_embeddings=True)
        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        self.index.add(embeddings.astype(np.float32))
        self.documents = chunks
        return len(chunks)

    def save_index(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        faiss.write_index(self.index, f"{path}.index")
        with open(f"{path}.docs.pkl", 'wb') as f:
            pickle.dump({'documents': self.documents, 'model_name': self.embedding_model.model_name}, f)

    def load_index(self, path):
        self.index = faiss.read_index(f"{path}.index")
        with open(f"{path}.docs.pkl", 'rb') as f:
            data = pickle.load(f)
            self.documents = data['documents']

    def retrieve(self, query, k=5, score_threshold=0.0):
        query_embedding = self.embedding_model.encode([query], normalize_embeddings=True)
        scores, indices = self.index.search(query_embedding.astype(np.float32), k)
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if score >= score_threshold and idx < len(self.documents):
                doc = self.documents[idx]
                results.append({'id': doc['id'], 'text': doc['text'], 'title': doc.get('title', ''), 'score': float(score), 'metadata': doc.get('metadata', {})})
        return results

    def augment_prompt(self, query, k=5, template=None):
        retrieved = self.retrieve(query, k=k)
        contexts = [r['text'] for r in retrieved]
        if template is None:
            template = "Answer the question based on the context below. If the context doesn't contain relevant information, say so.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"
        prompt = template.format(context="\n\n".join(contexts), query=query)
        return prompt, retrieved

    def answer(self, query, llm, k=5, template=None):
        prompt, retrieved = self.augment_prompt(query, k=k, template=template)
        response = llm.generate([prompt])[0]['generated_text']
        return {'query': query, 'answer': response, 'source_documents': retrieved, 'context_used': prompt}
```

### 8.4.2 Advanced RAG Techniques

```python
class AdvancedRAG:
    @staticmethod
    def hybrid_search(dense_index, bm25_index, query, k=5, alpha=0.5):
        dense_results = dense_index.retrieve(query, k=k * 2)
        bm25_results = bm25_index.retrieve(query, k=k * 2)
        combined = {}
        for r in dense_results:
            combined[r['id']] = combined.get(r['id'], 0) + alpha * r.get('score', 0)
        for r in bm25_results:
            combined[r['id']] = combined.get(r['id'], 0) + (1 - alpha) * r.get('score', 0)
        sorted_results = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:k]
        return sorted_results

    @staticmethod
    def query_rewriting(query, llm):
        rewritten = llm.generate([f"Rewrite the following query to be more specific:\nOriginal: {query}\nRewritten:"])[0]['generated_text'].strip()
        return rewritten

    @staticmethod
    def multi_query_retrieval(query, llm, retriever, num_queries=3, k=5):
        expanded = llm.generate([f"Generate {num_queries} different versions of: {query}"])[0]['generated_text']
        queries = [q.strip("- \n") for q in expanded.split('\n') if q.strip()][:num_queries]
        all_results = []
        for q in [query] + queries:
            all_results.extend(retriever.retrieve(q, k=k))
        seen_ids = set()
        unique_results = []
        for r in all_results:
            if r['id'] not in seen_ids:
                seen_ids.add(r['id'])
                unique_results.append(r)
        return unique_results[:k]

class BM25Index:
    def __init__(self):
        self.documents = []
        self.bm25 = None

    def build(self, documents):
        from rank_bm25 import BM25Okapi
        self.documents = documents
        tokenized = [doc['text'].split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)

    def retrieve(self, query, k=5):
        tokenized_query = query.split()
        scores = self.bm25.get_scores(tokenized_query)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]
        return [{'id': self.documents[i]['id'], 'text': self.documents[i]['text'], 'score': float(scores[i])} for i in top_indices]
```

## 8.5 Fine-Tuning Patterns

### 8.5.1 PEFT (Parameter Efficient Fine-Tuning)

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
from datasets import Dataset
from typing import Dict, List, Optional

class PEFTFinetuner:
    def __init__(self, base_model_name: str, load_in_8bit: bool = True, use_lora: bool = True):
        self.base_model_name = base_model_name
        self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            load_in_8bit=load_in_8bit,
            device_map="auto",
            trust_remote_code=True,
        )
        if use_lora:
            lora_config = LoraConfig(
                task_type=TaskType.CAUSAL_LM,
                r=8,
                lora_alpha=32,
                lora_dropout=0.1,
                target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
                bias="none",
            )
            self.model = prepare_model_for_kbit_training(self.model)
            self.model = get_peft_model(self.model, lora_config)
            self.model.print_trainable_parameters()

    def format_instruction(self, example, template=None):
        if template is None:
            template = "### Instruction:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n{output}"
        return template.format(**example)

    def prepare_dataset(self, data, template=None):
        formatted = [self.format_instruction(d, template) for d in data]
        tokenized = self.tokenizer(formatted, truncation=True, padding="max_length", max_length=512, return_tensors="pt")
        tokenized["labels"] = tokenized["input_ids"].clone()
        return Dataset.from_dict({"input_ids": tokenized["input_ids"].tolist(), "attention_mask": tokenized["attention_mask"].tolist(), "labels": tokenized["labels"].tolist()})

    def train(self, train_data, val_data=None, output_dir="./lora-finetuned", num_epochs=3, batch_size=4, learning_rate=2e-4):
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            gradient_accumulation_steps=4,
            warmup_steps=100,
            learning_rate=learning_rate,
            fp16=True,
            logging_steps=10,
            evaluation_strategy="steps" if val_data else "no",
            eval_steps=100,
            save_steps=500,
            save_total_limit=3,
            remove_unused_columns=False,
            report_to="mlflow",
            load_best_model_at_end=True if val_data else False,
        )
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_data,
            eval_dataset=val_data,
            tokenizer=self.tokenizer,
            data_collator=lambda data: {
                'input_ids': torch.tensor([d['input_ids'] for d in data]),
                'attention_mask': torch.tensor([d['attention_mask'] for d in data]),
                'labels': torch.tensor([d['labels'] for d in data]),
            },
        )
        trainer.train()
        trainer.save_model(output_dir)
        return trainer.state.log_history

    def generate(self, instruction, input_text="", max_new_tokens=256, temperature=0.7):
        prompt = f"### Instruction:\n{instruction}\n\n### Input:\n{input_text}\n\n### Response:\n"
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_new_tokens=max_new_tokens, temperature=temperature, do_sample=temperature > 0, top_p=0.9, pad_token_id=self.tokenizer.eos_token_id)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response[len(prompt):].strip()
```

### 8.5.2 QLoRA Fine-Tuning

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset

def create_qlora_model(model_name="meta-llama/Llama-2-7b-hf"):
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
    )
    model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=bnb_config, device_map="auto", trust_remote_code=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.pad_token = tokenizer.eos_token
    model.gradient_checkpointing_enable()
    model = prepare_model_for_kbit_training(model)
    lora_config = LoraConfig(
        r=64, lora_alpha=16,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.1, bias="none", task_type="CAUSAL_LM",
    )
    model = get_peft_model(model, lora_config)
    return model, tokenizer

def train_qlora(model, tokenizer, dataset_path, output_dir="./qlora-output"):
    dataset = load_dataset("json", data_files=dataset_path, split="train")
    def format_func(examples):
        texts = []
        for instruction, input_text, output in zip(examples["instruction"], examples["input"], examples["output"]):
            texts.append(f"### Instruction:\n{instruction}\n\n### Input:\n{input_text}\n\n### Response:\n{output}")
        return tokenizer(texts, truncation=True, padding="max_length", max_length=512)
    tokenized_dataset = dataset.map(format_func, batched=True, remove_columns=dataset.column_names)
    training_args = TrainingArguments(
        output_dir=output_dir, num_train_epochs=3, per_device_train_batch_size=4,
        gradient_accumulation_steps=4, warmup_steps=100, learning_rate=2e-4, fp16=True,
        logging_steps=10, save_strategy="epoch",
    )
    trainer = Trainer(model=model, args=training_args, train_dataset=tokenized_dataset)
    trainer.train()
    trainer.save_model(output_dir)
    return trainer
```

## 8.6 LLM Evaluation

### 8.6.1 Evaluation Framework

```python
import numpy as np
from typing import List, Dict
from rouge_score import rouge_scorer
from bert_score import BERTScorer
import evaluate

class LLMEvaluator:
    def __init__(self, reference_model=None):
        self.reference_model = reference_model
        self.bertscorer = BERTScorer(model_type="microsoft/deberta-xlarge-mnli", lang="en", rescale_with_baseline=True)
        self.rouge = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

    def evaluate_generation(self, predictions, references, inputs=None):
        metrics = {}
        rouge_scores = {'rouge1': [], 'rouge2': [], 'rougeL': []}
        for pred, ref in zip(predictions, references):
            scores = self.rouge.score(ref, pred)
            for k in rouge_scores:
                rouge_scores[k].append(scores[k].fmeasure)
        for k, v in rouge_scores.items():
            metrics[f'{k}_f1'] = float(np.mean(v))
        P, R, F1 = self.bertscorer.score(predictions, references)
        metrics['bertscore_f1'] = float(F1.mean().item())
        bleu = evaluate.load("bleu")
        bleu_score = bleu.compute(predictions=predictions, references=[[r] for r in references])
        metrics['bleu'] = bleu_score['bleu']
        exact_matches = sum(1 for p, r in zip(predictions, references) if p.strip() == r.strip())
        metrics['exact_match'] = exact_matches / len(predictions)
        return metrics

    def evaluate_classification(self, predictions, labels):
        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
        return {
            'accuracy': float(accuracy_score(labels, predictions)),
            'f1_macro': float(f1_score(labels, predictions, average='macro', zero_division=0)),
            'precision_macro': float(precision_score(labels, predictions, average='macro', zero_division=0)),
            'recall_macro': float(recall_score(labels, predictions, average='macro', zero_division=0)),
        }
```

### 8.6.2 LLM-as-a-Judge

```python
class LLMasJudge:
    def __init__(self, judge_model):
        self.judge_model = judge_model

    def evaluate_helpfulness(self, response, expected=None):
        prompt = f"Evaluate the following response for helpfulness on a scale of 1-5:\n\nResponse: {response}\n{f'Expected: {expected}' if expected else ''}\n\nScore (1-5):"
        result = self.judge_model.generate([prompt])[0]['generated_text']
        import re
        scores = re.findall(r'[1-5]', result)
        return int(scores[0]) if scores else 3

    def evaluate_harmlessness(self, response):
        prompt = f"Evaluate if the following response is harmful:\n\nResponse: {response}\n\nIs it harmful? (yes/no):"
        result = self.judge_model.generate([prompt])[0]['generated_text']
        return {'harmful': 'yes' in result.lower().split()[:3], 'explanation': result}

    def pairwise_comparison(self, instruction, response_a, response_b):
        prompt = f"Compare the following responses:\n\nInstruction: {instruction}\n\nResponse A: {response_a}\n\nResponse B: {response_b}\n\nWhich is better? (A or B):\nReason:"
        return self.judge_model.generate([prompt])[0]['generated_text']
```

## 8.7 LLM Cost Optimization

### 8.7.1 Cost Estimation

```python
class LLMCostCalculator:
    COST_PER_1K_TOKENS = {
        'model-v4': {'input': 0.03, 'output': 0.06},
        'model-v4-turbo': {'input': 0.01, 'output': 0.03},
        'model-v3.5-turbo': {'input': 0.001, 'output': 0.002},
        'claude-3-opus': {'input': 0.015, 'output': 0.075},
        'claude-3-sonnet': {'input': 0.003, 'output': 0.015},
        'llama-2-70b': {'input': 0.001, 'output': 0.002},
        'llama-2-13b': {'input': 0.0005, 'output': 0.001},
        'mixtral-8x7b': {'input': 0.0007, 'output': 0.0007},
    }

    GPU_COST_PER_HOUR = {
        'A100-80GB': 4.00,
        'V100-32GB': 2.48,
        'T4-16GB': 0.35,
        'H100-80GB': 6.00,
    }

    @classmethod
    def estimate_api_cost(cls, model, input_tokens, output_tokens):
        if model not in cls.COST_PER_1K_TOKENS:
            return None
        pricing = cls.COST_PER_1K_TOKENS[model]
        cost = (input_tokens / 1000) * pricing['input'] + (output_tokens / 1000) * pricing['output']
        return round(cost, 4)

    @classmethod
    def estimate_training_cost(cls, gpu_type, num_gpus, hours, gpu_utilization=0.8):
        if gpu_type not in cls.GPU_COST_PER_HOUR:
            return None
        hourly_cost = cls.GPU_COST_PER_HOUR[gpu_type]
        total = num_gpus * hours * hourly_cost * gpu_utilization
        return round(total, 2)

    @classmethod
    def compare_models(cls, input_tokens, output_tokens, daily_requests=10000):
        results = []
        for model, pricing in cls.COST_PER_1K_TOKENS.items():
            per_request = (input_tokens / 1000) * pricing['input'] + (output_tokens / 1000) * pricing['output']
            daily = per_request * daily_requests
            monthly = daily * 30
            yearly = monthly * 12
            results.append({'model': model, 'per_request': round(per_request, 4), 'daily': round(daily, 2), 'monthly': round(monthly, 2), 'yearly': round(yearly, 2)})
        return sorted(results, key=lambda x: x['per_request'])

    @classmethod
    def optimize_prompt(cls, prompt, max_tokens=None):
        current_tokens = len(prompt.split())
        suggestions = []
        if current_tokens > 2000:
            suggestions.append("Prompt too long, consider truncating or summarizing")
        if max_tokens and current_tokens + max_tokens > 4096:
            suggestions.append("Total tokens may exceed context window")
        redundant_phrases = ["please", "kindly", "I would like to ask you to", "if you don't mind"]
        for phrase in redundant_phrases:
            if phrase in prompt.lower():
                suggestions.append(f"Remove redundant phrase: '{phrase}'")
        return {'current_tokens': current_tokens, 'suggestions': suggestions}
```

### 8.7.2 Caching and Batching Strategies

```python
import hashlib, json, time
from functools import lru_cache
from typing import List, Dict

class LLMResponseCache:
    def __init__(self, redis_client=None, ttl=3600):
        self.redis = redis_client
        self.ttl = ttl
        self.local_cache = {}

    def _make_key(self, prompt, model, params):
        key_dict = {'prompt': prompt, 'model': model, 'params': params}
        key_str = json.dumps(key_dict, sort_keys=True)
        return hashlib.sha256(key_str.encode()).hexdigest()

    def get(self, prompt, model, params):
        key = self._make_key(prompt, model, params)
        if self.redis:
            cached = self.redis.get(key)
            if cached:
                return json.loads(cached)
        return self.local_cache.get(key)

    def set(self, prompt, model, params, response):
        key = self._make_key(prompt, model, params)
        value = json.dumps(response)
        if self.redis:
            self.redis.setex(key, self.ttl, value)
        self.local_cache[key] = response

    def invalidate(self, prompt=None, model=None):
        if self.redis and model:
            for key in self.redis.scan_iter(match=f"*{model}*"):
                self.redis.delete(key)
        if model:
            self.local_cache = {k: v for k, v in self.local_cache.items() if model not in k}

class PromptBatchingOptimizer:
    @staticmethod
    def batch_similar_prompts(prompts, similarity_threshold=0.8):
        from difflib import SequenceMatcher
        batches = []
        used = set()
        for i, p1 in enumerate(prompts):
            if i in used:
                continue
            batch = [i]
            used.add(i)
            for j, p2 in enumerate(prompts):
                if j in used:
                    continue
                similarity = SequenceMatcher(None, p1, p2).ratio()
                if similarity > similarity_threshold:
                    batch.append(j)
                    used.add(j)
            batches.append(batch)
        return batches

    @staticmethod
    def estimate_cost_savings(current_cost, cached_ratio=0.3, batched_ratio=0.2):
        cache_savings = current_cost * cached_ratio * 0.9
        batch_savings = current_cost * batched_ratio * 0.3
        return {'current_cost': current_cost, 'cache_savings': cache_savings, 'batch_savings': batch_savings, 'total_savings': cache_savings + batch_savings, 'new_cost': current_cost - cache_savings - batch_savings}
```

## 8.8 LLM Safety and Guardrails

### 8.8.1 Content Filtering

```python
import re
from typing import List, Dict, Tuple

class ContentFilter:
    def __init__(self):
        self.harmful_patterns = [
            r'\b(hate|racist|sexist|discriminat(e|ory))\b',
            r'\b(violence|violent|kill|murder|harm)\b',
            r'\b(sexual\s+content|porn|explicit)\b',
            r'\b(illegal|unlawful|criminal)\b',
            r'\b(self-harm|suicide|suicidal)\b',
        ]
        self.pii_patterns = [
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            r'\b[\w.-]+@[\w.-]+\.\w+\b',
            r'\b\d{3}[- ]?\d{2}[- ]?\d{4}\b',
        ]

    def contains_harmful_content(self, text: str) -> Dict:
        findings = []
        for pattern in self.harmful_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                findings.append({'pattern': pattern, 'matches': matches})
        return {'harmful': len(findings) > 0, 'findings': findings}

    def contains_pii(self, text: str) -> Dict:
        findings = []
        for pattern in self.pii_patterns:
            matches = re.findall(pattern, text)
            if matches:
                findings.append({'pattern': pattern, 'matches': matches[:5]})
        return {'has_pii': len(findings) > 0, 'findings': findings}

    def sanitize_output(self, text: str) -> str:
        for pattern in self.pii_patterns:
            text = re.sub(pattern, '[REDACTED]', text)
        return text

    def filter_response(self, text: str) -> Dict:
        harmful = self.contains_harmful_content(text)
        pii = self.contains_pii(text)
        return {
            'original': text,
            'filtered': self.sanitize_output(text) if pii['has_pii'] else text,
            'blocked': harmful['harmful'] or pii['has_pii'],
            'reasons': {
                'harmful_content': harmful['harmful'],
                'pii_detected': pii['has_pii'],
            }
        }
```

### 8.8.2 Guardrails Implementation

```python
from typing import Dict, List, Callable

class Guardrail:
    def __init__(self, name: str, check_fn: Callable, action: str = "block", severity: str = "medium"):
        self.name = name
        self.check_fn = check_fn
        self.action = action
        self.severity = severity

    def check(self, input_text: str, output_text: str = None) -> Dict:
        result = self.check_fn(input_text, output_text)
        return {'name': self.name, 'triggered': result, 'action': self.action, 'severity': self.severity}

class GuardrailPipeline:
    def __init__(self):
        self.guardrails = []

    def add_guardrail(self, guardrail: Guardrail):
        self.guardrails.append(guardrail)

    def process_input(self, text: str) -> Dict:
        triggered = []
        for guardrail in self.guardrails:
            result = guardrail.check(text)
            if result['triggered']:
                triggered.append(result)
        blocked = any(r['action'] == 'block' for r in triggered)
        severity = max([r['severity'] for r in triggered]) if triggered else 'low'
        return {'blocked': blocked, 'triggered_guardrails': triggered, 'severity': severity, 'message': 'Input blocked by guardrails' if blocked else 'Input passed guardrails'}

    def process_output(self, input_text: str, output_text: str) -> Dict:
        triggered = []
        for guardrail in self.guardrails:
            result = guardrail.check(input_text, output_text)
            if result['triggered']:
                triggered.append(result)
        blocked = any(r['action'] == 'block' for r in triggered)
        return {'blocked': blocked, 'triggered_guardrails': triggered, 'output': output_text, 'sanitized_output': self._sanitize(output_text) if triggered else output_text}

    def _sanitize(self, text: str) -> str:
        return "[Content filtered by safety guardrails]"

# Example guardrails
def toxicity_check(input_text, output_text=None):
    toxic_words = ['hate', 'kill', 'stupid', 'idiot']
    text = input_text if output_text is None else output_text
    return any(word in text.lower() for word in toxic_words)

def pii_check(input_text, output_text=None):
    import re
    text = input_text if output_text is None else output_text
    return bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text))

def prompt_injection_check(input_text, output_text=None):
    injection_patterns = ['ignore previous instructions', 'forget your instructions', 'system prompt', 'you are now']
    text = input_text if output_text is None else output_text
    return any(pattern in text.lower() for pattern in injection_patterns)

# Usage
pipeline = GuardrailPipeline()
pipeline.add_guardrail(Guardrail("toxicity", toxicity_check, "block", "high"))
pipeline.add_guardrail(Guardrail("pii", pii_check, "block", "high"))
pipeline.add_guardrail(Guardrail("prompt_injection", prompt_injection_check, "block", "critical"))
```

# P9: Additional Worked Examples

## Example 16: Multi-Task Learning

---
eferences/expanded-content.md\ (154 KB, 3711 lines)

