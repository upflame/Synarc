---
id: ml-engineer
name: ML Engineer
version: 1.0.0
description: Comprehensive skill set for machine learning engineering covering architecture, pipelines, training, deployment, MLOps, LLMs, and best practices.
author: synarc
tags:
  - ml-engineering
  - machine-learning
  - deep-learning
  - mlops
  - llm
  - training
  - deployment
  - model-serving
  - feature-engineering
  - model-evaluation
---

# ML Engineer Skill

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

---

# P1: Persona � The ML Engineer

## 1.1 Role Definition

The ML Engineer bridges data science research and production engineering. They are responsible for designing, building, and maintaining ML systems that are reliable, scalable, observable, and cost-effective. Unlike a data scientist who focuses on model accuracy, the ML Engineer owns the end-to-end system that trains, serves, and monitors models at scale.

## 1.2 Core Competencies

### 1.2.1 Systems Thinking

- Ability to reason about ML systems holistically: data, compute, model, deployment, monitoring
- Understanding of tradeoffs between model complexity, latency, throughput, cost, and accuracy
- Capability to debug distributed training jobs, serving bottlenecks, and data quality issues

### 1.2.2 Software Engineering for ML

- Proficiency in Python, with working knowledge of C++/CUDA for performance-critical paths
- Mastery of ML frameworks: PyTorch, TensorFlow, JAX
- Experience with distributed computing: Ray, Spark, Dask
- Infrastructure-as-code: Terraform, Pulumi, Docker, Kubernetes
- CI/CD for ML: Jenkins, GitLab CI, GitHub Actions, Argo Workflows

### 1.2.3 Mathematics and Statistics

- Linear algebra, calculus, probability theory
- Statistical hypothesis testing, A/B testing, experimental design
- Optimization theory: convex optimization, stochastic gradient descent, learning rate schedules
- Information theory: entropy, KL divergence, mutual information

### 1.2.4 ML Fundamentals

- Supervised learning: regression, classification, tree-based methods, neural networks
- Unsupervised learning: clustering, dimensionality reduction, density estimation
- Deep learning architectures: CNNs, RNNs, Transformers, GNNs
- Reinforcement learning: MDPs, policy gradients, Q-learning
- Feature engineering, selection, and extraction techniques

### 1.2.5 MLOps and Infrastructure

- Experiment tracking: MLflow, Weights and Biases, Neptune
- Model registries and versioning
- Feature stores: Feast, Tecton
- Orchestration: Airflow, Kubeflow, Prefect
- Monitoring: Prometheus, Grafana, Evidently AI, WhyLabs
- Model serving: TorchServe, TF Serving, Triton Inference Server, Ray Serve

## 1.3 Key Responsibilities

| Responsibility | Description | Frequency |
|---|---|---|
| Architecture Design | Design ML system architecture including data pipelines, training infra, serving stack | Quarterly |
| Pipeline Development | Build and maintain data and ML pipelines | Daily |
| Model Training | Implement distributed training, hyperparameter tuning, experiment tracking | Weekly |
| Model Evaluation | Define evaluation metrics, run offline and online evaluation | Weekly |
| Deployment | Deploy models to production via CI/CD, manage canary releases | Weekly |
| Monitoring | Set up dashboards, alerts, and automated retraining triggers | Daily |
| Cost Optimization | Optimize compute, storage, and serving costs | Monthly |
| Incident Response | Debug production incidents, model degradation, data drift | On-call |

## 1.4 Decision-Making Framework

The ML Engineer evaluates decisions across four axes:

1. **Model Quality**: Does this improve offline/online metrics?
2. **Operational Complexity**: How much maintenance burden does this add?
3. **Cost**: What is the total cost of ownership (compute, storage, engineering time)?
4. **Time-to-Value**: How quickly can this be delivered?

### Decision Matrix Template

```
Decision: [choice between A and B]

Model Quality Impact:
  - A: +2% AUC, -1% recall
  - B: +1% AUC, +3% recall

Operational Complexity:
  - A: Requires 3 new microservices, 2 new dependencies
  - B: Extends existing service, no new dependencies

Cost Impact:
  - A: $500/month additional compute
  - B: $200/month additional compute

Time-to-Value:
  - A: 4 weeks to implement
  - B: 1 week to implement

Decision: B (faster, cheaper, simpler with acceptable quality tradeoff)
```

## 1.5 Typical Day

| Time | Activity |
|---|---|
| 09:00 | Standup, check monitoring dashboards, triage alerts |
| 09:30 | Review experiment results from overnight training runs |
| 10:00 | Code review for model serving PR |
| 11:00 | Design review for new feature pipeline |
| 12:00 | Lunch |
| 13:00 | Implement distributed training job configuration |
| 14:30 | Debug model serving latency spike |
| 15:30 | Update runbooks for model deployment |
| 16:00 | Data infrastructure sync with data engineering team |
| 17:00 | Deep work: architecture design for model registry v2 |

---

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

---

# P3: Architecture Patterns

## 3.1 Overview

A production ML system consists of multiple interconnected components. The following architecture patterns describe common arrangements of these components.

## 3.2 Pattern 1: Batch Inference Architecture

### 3.2.1 Description

Batch inference processes large volumes of data on a schedule, generating predictions stored in a database or data lake for later consumption.

### 3.2.2 Flow

```
Data Lake -> Feature Pipeline -> Batch Job -> ML Model -> Predictions -> Serving DB
```

### 3.2.3 When To Use

- Large-scale scoring (millions to billions of predictions)
- No real-time requirement (predictions valid for hours/days)
- Complex feature engineering that is expensive to compute online
- Offline evaluation and backtesting

### 3.2.4 Implementation

```python
def run_batch_inference(input_path, output_path, model_uri):
    spark = SparkSession.builder.appName("batch-inference").getOrCreate()
    df = spark.read.parquet(input_path)
    model = mlflow.pyfunc.load_model(model_uri)
    predict_udf = udf(lambda features: float(model.predict([features])[0]), DoubleType())
    predictions = df.withColumn("prediction", predict_udf(col("features")))
    predictions.write.mode("overwrite").parquet(output_path)
    spark.stop()
```

### 3.2.5 Performance Characteristics

| Metric | Typical Value | Bottleneck |
|---|---|---|
| Throughput | 1M-10M predictions/hour | I/O |
| Latency per row | 1-100ms | Model inference time |
| Resource usage | CPU-bound for tree, GPU for DNN | Feature computation vs inference |
| Cost per 1M preds | $0.50-$5 (CPU), $2-$20 (GPU) | Compute + storage |

## 3.3 Pattern 2: Real-Time Inference Architecture

### 3.3.1 Description

Real-time inference serves predictions synchronously via API, with strict latency requirements (<100ms p99).

### 3.3.2 Flow

```
Client -> API Gateway -> Feature Server -> Model Server -> Response
```

### 3.3.3 When To Use

- Real-time fraud detection, recommendation, personalization
- Interactive ML applications (search, autocomplete)
- Low-latency requirements (<100ms)
- Streaming data sources

### 3.3.4 Model Server Implementation

```python
from fastapi import FastAPI
from pydantic import BaseModel
import mlflow.pyfunc
import numpy as np
import time

app = FastAPI(title="ML Serving API", version="1.0.0")
model = mlflow.pyfunc.load_model("models:/production-model/latest")

class PredictionRequest(BaseModel):
    features: list[float]
    request_id: str = None

class PredictionResponse(BaseModel):
    prediction: float
    probability: float = None
    request_id: str = None
    latency_ms: float

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    start = time.time()
    features = np.array(request.features).reshape(1, -1)
    prediction = model.predict(features)[0]
    proba = model.predict_proba(features)[0].max() if hasattr(model, "predict_proba") else None
    latency = (time.time() - start) * 1000
    return PredictionResponse(
        prediction=float(prediction),
        probability=float(proba) if proba else None,
        request_id=request.request_id,
        latency_ms=round(latency, 2)
    )

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### 3.3.5 Performance Optimization

| Technique | Latency Improvement | Complexity |
|---|---|---|
| Model quantization (FP16 to INT8) | 2-4x | Low |
| Batch inference on server | 2-10x (throughput) | Low |
| GPU inference with CUDA graphs | 1.5-3x | Medium |
| ONNX Runtime optimization | 1.5-3x | Low |
| TensorRT compilation | 2-5x | Medium |
| Distillation (large to small model) | 2-10x | High |
| Speculative decoding (LLMs) | 1.5-2x | High |
| Feature pre-computation | 2-5x | Medium |
| Model sharding | Variable | High |

## 3.4 Pattern 3: Streaming Inference Architecture

### 3.4.1 Description

Streaming inference processes data in real-time as it arrives, generating predictions with low latency for event-driven applications.

### 3.4.2 Flow

```
Event Source (Kafka/Kinesis) -> Stream Processor (Flink/Spark) -> Feature Transformer -> Model Inference -> Output Sink
```

### 3.4.3 When To Use

- Real-time fraud detection on transactions
- Real-time personalization in ad bidding
- IoT sensor anomaly detection
- Real-time content moderation

### 3.4.4 Implementation

```python
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors.kafka import KafkaSource, KafkaOffsetsInitializer
from pyflink.common.serialization import SimpleStringSchema
import json
import mlflow.pyfunc
import numpy as np

model = mlflow.pyfunc.load_model("models:/fraud-model/production")

class ModelInference:
    def map(self, value):
        event = json.loads(value)
        features = np.array(event["features"]).reshape(1, -1)
        prediction = model.predict(features)[0]
        return json.dumps({
            "event_id": event["event_id"],
            "prediction": float(prediction),
            "timestamp": event["timestamp"]
        })

env = StreamExecutionEnvironment.get_execution_environment()
kafka_source = KafkaSource.builder() \
    .set_bootstrap_servers("localhost:9092") \
    .set_topics("transactions") \
    .set_group_id("fraud-inference") \
    .set_starting_offsets(KafkaOffsetsInitializer.latest()) \
    .set_value_only_deserializer(SimpleStringSchema()) \
    .build()
stream = env.from_source(kafka_source, WatermarkStrategy.no_watermarks(), "Kafka Source")
predictions = stream.map(ModelInference())
predictions.sink_to(kafka_sink)
env.execute("fraud-streaming-inference")
```

## 3.5 Pattern 4: Feature Store Architecture

### 3.5.1 Description

A feature store provides a centralized repository for feature definitions, computation, and serving. It enables feature sharing across teams and ensures consistency between training and serving.

### 3.5.2 Components

- **Registry**: Feature metadata and definitions
- **Online Store**: Low-latency feature serving (Redis/DynamoDB)
- **Offline Store**: Historical feature storage (S3/Parquet)
- **Transformation Engine**: Feature computation (Spark)

### 3.5.3 Implementation with Feast

```python
from feast import FeatureStore, FeatureView, Field, FileSource
from feast.types import Float32, Int64, String

batch_source = FileSource(
    path="s3://data/features/user_features.parquet",
    timestamp_field="event_timestamp",
)

user_features = FeatureView(
    name="user_features",
    entities=["user_id"],
    ttl="24h",
    schema=[
        Field(name="age", dtype=Int64),
        Field(name="income", dtype=Float32),
        Field(name="credit_score", dtype=Float32),
        Field(name="num_transactions_7d", dtype=Int64),
    ],
    source=batch_source,
)

store = FeatureStore(repo_path="./feature_repo")
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:income", "user_features:credit_score"]
).to_df()

feature_vector = store.get_online_features(
    features=["user_features:age", "user_features:income"],
    entity_rows=[{"user_id": "12345"}]
).to_dict()
```

## 3.6 Pattern 5: Model Registry Architecture

### 3.6.1 Description

A model registry tracks model versions, metadata, lineage, and stage transitions through the ML lifecycle.

### 3.6.2 Stage Transitions

| Transition | From -> To | Requires | Approval |
|---|---|---|---|
| Register | None -> Staging | All metrics above threshold | Automated |
| Promote | Staging -> Production | Shadow deployment passes, A/B test significant | Human review |
| Rollback | Production -> Staging | Alert triggered or metrics degrade | Automated + notify |
| Archive | Any -> Archived | Model superseded, no traffic for 30 days | Automated |
| Reject | Staging -> None | Fails validation | Automated |

### 3.6.3 Model Versioning Convention

```
models/{model_name}/
  v1/
    model.pt
    model_config.yaml
    preprocessing.pkl
    metrics.json
    conda.yaml
    requirements.txt
    lineage.json
  v2/
    ...
  latest -> v2/
```

## 3.7 Pattern 6: Distributed Training Architecture

### 3.7.1 Description

Distributed training scales model training across multiple GPUs and nodes.

### 3.7.2 Training Strategies

| Strategy | When To Use | Communication | Memory |
|---|---|---|---|
| Data Parallel | Model fits on single GPU | Gradient sync (AllReduce) | Low |
| Model Parallel | Model too large for 1 GPU | Layer activations | Medium |
| Pipeline Parallel | Very large models | Micro-batches between stages | Medium |
| Tensor Parallel | Extremely large models | Tensor slicing across GPUs | High |
| FSDP | Large models, limited memory | Sharded optimizer states | Low per GPU |
| DeepSpeed ZeRO | Very large models | Partitioned optimizer/grad/params | Lowest per GPU |

### 3.7.3 PyTorch DDP Example

```python
import torch
import torch.distributed as dist
import torch.multiprocessing as mp
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data.distributed import DistributedSampler
import os

def setup(rank, world_size):
    os.environ['MASTER_ADDR'] = 'localhost'
    os.environ['MASTER_PORT'] = '12355'
    dist.init_process_group('nccl', rank=rank, world_size=world_size)

def cleanup():
    dist.destroy_process_group()

def train(rank, world_size, config):
    setup(rank, world_size)
    model = MyModel().cuda(rank)
    model = DDP(model, device_ids=[rank])
    dataset = MyDataset(config.data_path)
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    loader = DataLoader(dataset, batch_size=config.batch_size, sampler=sampler)
    optimizer = torch.optim.Adam(model.parameters(), lr=config.lr)
    for epoch in range(config.epochs):
        sampler.set_epoch(epoch)
        model.train()
        for batch in loader:
            inputs, targets = batch
            inputs, targets = inputs.cuda(rank), targets.cuda(rank)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
    cleanup()

world_size = torch.cuda.device_count()
mp.spawn(train, args=(world_size, config), nprocs=world_size, join=True)
```

## 3.8 Pattern 7: Hybrid Batch + Real-Time Architecture

### 3.8.1 Description

Combines batch pre-computation with real-time serving to balance freshness and latency.

### 3.8.2 Implementation

```python
class FeatureMerger:
    def __init__(self, batch_store, online_store):
        self.batch_store = batch_store
        self.online_store = online_store

    def get_features(self, entity_id, real_time_events):
        batch_features = self.batch_store.get_features(entity_id)
        rt_features = self.compute_real_time_features(real_time_events)
        merged = {**batch_features, **rt_features}
        return merged

    def compute_real_time_features(self, events):
        if not events:
            return {}
        amounts = [e["amount"] for e in events]
        return {
            "rt_count_5min": len(events),
            "rt_sum_5min": sum(amounts),
            "rt_avg_5min": sum(amounts) / len(amounts),
            "rt_max_5min": max(amounts),
        }
```

## 3.9 Pattern 8: Multi-Model Serving

| Approach | Isolation | Resource Sharing | Complexity | Use Case |
|---|---|---|---|---|
| Single container per model | Strong | None | Low | Different frameworks |
| Multi-model server | Weak | GPU memory, CPU | Medium | Same framework |
| Model ensemble | None | Full sharing | High | Ensemble prediction |
| Router + model pods | Medium | Configurable | Medium | Different latency needs |

## 3.10 Pattern 9: A/B Testing Infrastructure

### 3.10.1 Assignment Strategy

```python
import hashlib

def get_experiment_group(user_id, experiment_name, traffic_pct=0.5):
    hash_input = f"{user_id}:{experiment_name}"
    hash_val = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    bucket = hash_val % 1000
    if bucket < int(traffic_pct * 1000):
        return "treatment"
    return "control"
```

### 3.10.2 Analysis

```python
from scipy import stats
import numpy as np

def analyze_experiment(control_metrics, treatment_metrics):
    t_stat, p_value = stats.ttest_ind(treatment_metrics, control_metrics)
    effect_size = (np.mean(treatment_metrics) - np.mean(control_metrics)) / \
                  np.sqrt((np.std(control_metrics)**2 + np.std(treatment_metrics)**2) / 2)
    return {
        'p_value': p_value,
        'statistically_significant': p_value < 0.05,
        'effect_size': effect_size,
        'lift_pct': ((np.mean(treatment_metrics) / np.mean(control_metrics)) - 1) * 100
    }
```

## 3.11 Pattern 10: Caching Architecture

### 3.11.1 Caching Layers

| Cache Level | Store | Latency | TTL |
|---|---|---|---|
| L1: Client-side | Browser, mobile app | <1ms | Minutes |
| L2: CDN | CloudFront, CloudFlare | <5ms | Hours |
| L3: Application | Redis, Memcached | <5ms | Minutes |
| L4: Model output | Redis + TTL | <5ms | Seconds to hours |
| L5: Feature | Feature store (online) | <10ms | Configurable |

### 3.11.2 Prediction Caching

```python
import hashlib, json

class PredictionCache:
    def __init__(self, redis_client, default_ttl=3600):
        self.redis = redis_client
        self.default_ttl = default_ttl

    def get_or_compute(self, cache_key, compute_fn, ttl=None):
        cached = self.redis.get(cache_key)
        if cached is not None:
            return float(cached)
        prediction = compute_fn()
        self.redis.setex(cache_key, ttl or self.default_ttl, prediction)
        return prediction

    def cache_key_from_features(self, model_name, features):
        feature_str = json.dumps(features, sort_keys=True)
        feature_hash = hashlib.sha256(feature_str.encode()).hexdigest()[:16]
        return f"pred:{model_name}:{feature_hash}"
```

---

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


---

# P5: Training Infrastructure and Evaluation

## 5.1 Training Infrastructure Design

### 5.1.1 Compute Selection

| Compute Type | Use Case | Cost (USD/hr) | Typical Config |
|---|---|---|---|
| CPU (c5.4xlarge) | Small models, preprocessing | 0.68 | 16 vCPU, 32GB RAM |
| CPU (c5.24xlarge) | Tree-based models, feature engineering | 4.08 | 96 vCPU, 192GB RAM |
| GPU T4 | Small-medium DNN, inference | 0.35 | 16GB VRAM |
| GPU V100 | Medium DNN, BERT fine-tuning | 2.48 | 32GB VRAM |
| GPU A100 | Large DNN, LLM training | 4.00 | 80GB VRAM |
| TPU v3-8 | Very large models, Transformer | 8.00 | 128GB HBM |
| Spot/Preemptible | Non-critical training, hyperparameter search | 60-90% discount | Variable |

### 5.1.2 Multi-GPU Training Topologies

| Topology | Max GPUs | Interconnect | Scalability | Use Case |
|---|---|---|---|---|
| Single Node, Multi-GPU | 4-8 | NVLink/NVSwitch | Near-linear up to 8 GPUs | Most common for DNN |
| Multi-Node | 16-1024+ | InfiniBand/EFA | 70-90% efficiency at 128 GPUs | LLM pre-training |
| Multi-Node with Gradient Checkpointing | 16-1024+ | InfiniBand | 60-80% efficiency | Memory-constrained models |
| Pipeline Parallel | 2-64 | NVLink/InfiniBand | 50-80% efficiency | Very deep models |

### 5.1.3 Cloud Training Setup (AWS SageMaker)

```python
import sagemaker
from sagemaker.pytorch import PyTorch

sagemaker_session = sagemaker.Session()
role = sagemaker.get_execution_role()

estimator = PyTorch(
    entry_point='train.py',
    source_dir='./src',
    role=role,
    instance_count=4,
    instance_type='ml.p4d.24xlarge',
    volume_size=500,
    max_run=24 * 60 * 60,
    hyperparameters={
        'epochs': 100,
        'batch_size': 256,
        'learning_rate': 0.001,
        'model_name': 'bert-large-uncased',
    },
    distribution={'smdistributed': {'dataparallel': {'enabled': True}}},
    checkpoint_s3_uri='s3://checkpoints/bert-finetune/',
    checkpoint_local_path='/opt/ml/checkpoints',
    tags=[{'Key': 'Project', 'Value': 'bert-finetune'}],
)

estimator.fit(
    inputs={'training': 's3://data/processed/train/', 'validation': 's3://data/processed/val/'},
    wait=False,
)
```

### 5.1.4 Kubernetes-native Training with Kubeflow

```yaml
apiVersion: "kubeflow.org/v1"
kind: PyTorchJob
metadata:
  name: bert-finetune-job
  namespace: ml-training
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      restartPolicy: OnFailure
      template:
        spec:
          containers:
            - name: pytorch
              image: 123456789.dkr.ecr.us-west-2.amazonaws.com/ml-training:latest
              imagePullPolicy: Always
              command:
                - "python"
                - "-m"
                - "torch.distributed.run"
                - "--nnodes=4"
                - "--nproc_per_node=8"
                - "train.py"
              resources:
                limits:
                  nvidia.com/gpu: 8
                  memory: "512Gi"
                  cpu: "96"
                requests:
                  nvidia.com/gpu: 8
                  memory: "480Gi"
                  cpu: "80"
              env:
                - name: NCCL_DEBUG
                  value: "INFO"
                - name: NCCL_SOCKET_IFNAME
                  value: "eth0"
                - name: OMP_NUM_THREADS
                  value: "8"
              volumeMounts:
                - mountPath: /dev/shm
                  name: dshm
                - mountPath: /data
                  name: training-data
                - mountPath: /checkpoints
                  name: checkpoints
          volumes:
            - name: dshm
              emptyDir:
                medium: Memory
                sizeLimit: "64Gi"
            - name: training-data
              persistentVolumeClaim:
                claimName: training-data-pvc
            - name: checkpoints
              persistentVolumeClaim:
                claimName: checkpoints-pvc
    Worker:
      replicas: 3
      restartPolicy: OnFailure
      template:
        spec:
          containers:
            - name: pytorch
              image: 123456789.dkr.ecr.us-west-2.amazonaws.com/ml-training:latest
              command:
                - "python"
                - "-m"
                - "torch.distributed.run"
                - "--nnodes=4"
                - "--nproc_per_node=8"
                - "--master_addr=bert-finetune-job-master-0"
                - "train.py"
              resources:
                limits:
                  nvidia.com/gpu: 8
                  memory: "512Gi"
                  cpu: "96"
              volumeMounts:
                - mountPath: /dev/shm
                  name: dshm
                - mountPath: /data
                  name: training-data
                - mountPath: /checkpoints
                  name: checkpoints
          volumes:
            - name: dshm
              emptyDir:
                medium: Memory
                sizeLimit: "64Gi"
            - name: training-data
              persistentVolumeClaim:
                claimName: training-data-pvc
            - name: checkpoints
              persistentVolumeClaim:
                claimName: checkpoints-pvc
```

## 5.2 Advanced Training Loop

### 5.2.1 Mixed Precision and Gradient Accumulation

```python
import torch
import torch.nn as nn
from torch.cuda.amp import autocast, GradScaler
from torch.utils.tensorboard import SummaryWriter
from typing import Dict, Optional
from dataclasses import dataclass
import numpy as np
from tqdm import tqdm
import os
from pathlib import Path

@dataclass
class TrainingConfig:
    epochs: int = 100
    batch_size: int = 256
    learning_rate: float = 3e-4
    weight_decay: float = 0.01
    warmup_steps: int = 1000
    max_grad_norm: float = 1.0
    use_amp: bool = True
    amp_dtype: str = 'float16'
    gradient_accumulation_steps: int = 1
    scheduler: str = 'cosine'
    min_lr: float = 1e-6
    num_warmup_steps: int = 1000
    checkpoint_dir: str = './checkpoints'
    save_every_n_epochs: int = 5
    save_best_only: bool = True
    metric_to_monitor: str = 'val_loss'
    metric_mode: str = 'min'
    log_every_n_steps: int = 50
    eval_every_n_epochs: int = 1
    use_tensorboard: bool = True
    log_dir: str = './logs'
    distributed: bool = False
    local_rank: int = 0
    world_size: int = 1
    num_workers: int = 4
    pin_memory: bool = True
    seed: int = 42

class Trainer:
    def __init__(self, model, train_loader, val_loader, criterion, optimizer, scheduler, config):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.criterion = criterion
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.config = config
        self.amp_dtype = torch.float16 if config.amp_dtype == 'float16' else torch.bfloat16
        self.scaler = GradScaler(enabled=config.use_amp)
        self.use_amp = config.use_amp
        self.device = torch.device(f'cuda:{config.local_rank}' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        if config.distributed:
            self.model = nn.parallel.DistributedDataParallel(self.model, device_ids=[config.local_rank])
        self.writer = SummaryWriter(log_dir=config.log_dir) if config.use_tensorboard and config.local_rank == 0 else None
        self.checkpoint_dir = Path(config.checkpoint_dir)
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)
        self.best_metric = float('inf') if config.metric_mode == 'min' else float('-inf')
        self.current_epoch = 0
        self.global_step = 0
        self.history = {'train_loss': [], 'val_loss': [], 'train_metrics': [], 'val_metrics': [], 'learning_rates': []}

    def train_epoch(self):
        self.model.train()
        total_loss = 0.0
        num_batches = len(self.train_loader)
        all_predictions, all_targets = [], []
        pbar = tqdm(self.train_loader, desc=f'Epoch {self.current_epoch} [Train]', disable=self.config.local_rank != 0)
        for batch_idx, batch in enumerate(pbar):
            inputs = {k: v.to(self.device) for k, v in batch.items() if k != 'targets'}
            targets = batch['targets'].to(self.device)
            with autocast(enabled=self.use_amp, dtype=self.amp_dtype):
                outputs = self.model(**inputs)
                loss = self.criterion(outputs, targets)
                loss = loss / self.config.gradient_accumulation_steps
            self.scaler.scale(loss).backward()
            if (batch_idx + 1) % self.config.gradient_accumulation_steps == 0:
                self.scaler.unscale_(self.optimizer)
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), self.config.max_grad_norm)
                self.scaler.step(self.optimizer)
                self.scaler.update()
                self.optimizer.zero_grad()
                if self.scheduler is not None:
                    self.scheduler.step()
                self.global_step += 1
            total_loss += loss.item() * self.config.gradient_accumulation_steps
            predictions = torch.argmax(outputs, dim=-1) if outputs.dim() > 1 else outputs
            all_predictions.append(predictions.detach().cpu())
            all_targets.append(targets.detach().cpu())
            if self.global_step % self.config.log_every_n_steps == 0 and self.writer:
                current_lr = self.scheduler.get_last_lr()[0] if self.scheduler else self.config.learning_rate
                self.writer.add_scalar('train/loss_step', loss.item(), self.global_step)
                self.writer.add_scalar('train/lr', current_lr, self.global_step)
            pbar.set_postfix({'loss': f'{total_loss / (batch_idx + 1):.4f}'})
        all_predictions, all_targets = torch.cat(all_predictions), torch.cat(all_targets)
        accuracy = (all_predictions == all_targets).float().mean().item()
        return {'loss': total_loss / num_batches, 'accuracy': accuracy}

    @torch.no_grad()
    def validate(self):
        self.model.eval()
        total_loss = 0.0
        num_batches = len(self.val_loader)
        all_predictions, all_targets, all_probabilities = [], [], []
        pbar = tqdm(self.val_loader, desc=f'Epoch {self.current_epoch} [Val]', disable=self.config.local_rank != 0)
        for batch in pbar:
            inputs = {k: v.to(self.device) for k, v in batch.items() if k != 'targets'}
            targets = batch['targets'].to(self.device)
            with autocast(enabled=self.use_amp, dtype=self.amp_dtype):
                outputs = self.model(**inputs)
                loss = self.criterion(outputs, targets)
            total_loss += loss.item()
            predictions = torch.argmax(outputs, dim=-1) if outputs.dim() > 1 else outputs
            probabilities = torch.softmax(outputs, dim=-1) if outputs.dim() > 1 else torch.sigmoid(outputs)
            all_predictions.append(predictions.cpu())
            all_targets.append(targets.cpu())
            all_probabilities.append(probabilities.cpu())
            pbar.set_postfix({'loss': f'{loss.item():.4f}'})
        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
        preds_np, targets_np, probs_np = torch.cat(all_predictions).numpy(), torch.cat(all_targets).numpy(), torch.cat(all_probabilities).numpy()
        try:
            auc = roc_auc_score(targets_np, probs_np, multi_class='ovr') if probs_np.shape[1] > 2 else roc_auc_score(targets_np, probs_np[:, 1])
        except ValueError:
            auc = 0.0
        metrics = {
            'loss': total_loss / num_batches,
            'accuracy': accuracy_score(targets_np, preds_np),
            'f1_macro': f1_score(targets_np, preds_np, average='macro', zero_division=0),
            'precision_macro': precision_score(targets_np, preds_np, average='macro', zero_division=0),
            'recall_macro': recall_score(targets_np, preds_np, average='macro', zero_division=0),
            'roc_auc': auc,
        }
        return metrics

    def save_checkpoint(self, metrics, is_best=False):
        if self.config.local_rank != 0:
            return
        checkpoint = {
            'epoch': self.current_epoch,
            'global_step': self.global_step,
            'model_state_dict': self.model.module.state_dict() if self.config.distributed else self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'scheduler_state_dict': self.scheduler.state_dict() if self.scheduler else None,
            'scaler_state_dict': self.scaler.state_dict(),
            'config': self.config,
            'metrics': metrics,
            'history': self.history,
        }
        if not self.config.save_best_only or self.current_epoch % self.config.save_every_n_epochs == 0:
            path = self.checkpoint_dir / f'checkpoint_epoch_{self.current_epoch}.pt'
            torch.save(checkpoint, path)
        if is_best:
            best_path = self.checkpoint_dir / 'best_model.pt'
            torch.save(checkpoint, best_path)

    def log_metrics(self, train_metrics, val_metrics):
        if self.writer:
            for k, v in train_metrics.items():
                self.writer.add_scalar(f'train/{k}', v, self.current_epoch)
            for k, v in val_metrics.items():
                self.writer.add_scalar(f'val/{k}', v, self.current_epoch)
        self.history['train_loss'].append(train_metrics.get('loss', 0))
        self.history['val_loss'].append(val_metrics.get('loss', 0))
        self.history['train_metrics'].append(train_metrics)
        self.history['val_metrics'].append(val_metrics)
        self.history['learning_rates'].append(self.scheduler.get_last_lr()[0] if self.scheduler else self.config.learning_rate)

    def fit(self, num_epochs=None, resume_from=None):
        if resume_from:
            checkpoint = torch.load(resume_from, map_location=self.device)
            if self.config.distributed:
                self.model.module.load_state_dict(checkpoint['model_state_dict'])
            else:
                self.model.load_state_dict(checkpoint['model_state_dict'])
            self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
            if self.scheduler and checkpoint.get('scheduler_state_dict'):
                self.scheduler.load_state_dict(checkpoint['scheduler_state_dict'])
            self.scaler.load_state_dict(checkpoint['scaler_state_dict'])
            self.history = checkpoint.get('history', self.history)
            start_epoch = checkpoint['epoch'] + 1
        else:
            start_epoch = 0
        num_epochs = num_epochs or self.config.epochs
        for epoch in range(start_epoch, num_epochs):
            self.current_epoch = epoch
            train_metrics = self.train_epoch()
            val_metrics = self.validate() if epoch % self.config.eval_every_n_epochs == 0 else {'loss': 0, 'accuracy': 0}
            if self.config.local_rank == 0:
                self.log_metrics(train_metrics, val_metrics)
                current_metric = val_metrics.get(self.config.metric_to_monitor, val_metrics.get('loss', 0))
                is_best = False
                if self.config.metric_mode == 'min' and current_metric < self.best_metric:
                    self.best_metric = current_metric
                    is_best = True
                elif self.config.metric_mode == 'max' and current_metric > self.best_metric:
                    self.best_metric = current_metric
                    is_best = True
                self.save_checkpoint(val_metrics, is_best=is_best)
        if self.writer:
            self.writer.close()
        return self.history
```

## 5.3 Hyperparameter Optimization

### 5.3.1 Ray Tune for HPO

```python
import ray
from ray import tune
from ray.tune.schedulers import ASHAScheduler
from ray.tune.search.optuna import OptunaSearch

def train_with_config(config):
    import torch, torch.nn as nn
    from torch.utils.data import DataLoader
    torch.manual_seed(config.get('seed', 42))
    model = MyModel(hidden_dim=config['hidden_dim'], num_layers=config['num_layers'], dropout=config['dropout'])
    model = model.cuda()
    optimizer = getattr(torch.optim, config['optimizer'])(model.parameters(), lr=config['lr'], weight_decay=config['weight_decay'])
    train_loader = DataLoader(train_dataset, batch_size=int(config['batch_size']), shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=int(config['batch_size']), shuffle=False, num_workers=4)
    criterion = nn.CrossEntropyLoss()
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=config['epochs'])
    for epoch in range(config['epochs']):
        model.train()
        for batch in train_loader:
            inputs, targets = batch
            inputs, targets = inputs.cuda(), targets.cuda()
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
        scheduler.step()
        model.eval()
        correct, total, val_loss = 0, 0, 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, targets = batch
                inputs, targets = inputs.cuda(), targets.cuda()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                val_loss += loss.item()
                _, predicted = torch.max(outputs, 1)
                total += targets.size(0)
                correct += (predicted == targets).sum().item()
        val_accuracy = correct / total
        tune.report(val_loss=val_loss / len(val_loader), val_accuracy=val_accuracy)
        if tune.should_stop():
            break

search_space = {
    'hidden_dim': tune.choice([64, 128, 256, 512]),
    'num_layers': tune.randint(1, 6),
    'dropout': tune.uniform(0.0, 0.5),
    'lr': tune.loguniform(1e-5, 1e-2),
    'batch_size': tune.choice([32, 64, 128, 256]),
    'optimizer': tune.choice(['Adam', 'AdamW', 'SGD']),
    'weight_decay': tune.loguniform(1e-6, 1e-2),
    'epochs': 30,
    'seed': 42,
}

asha_scheduler = ASHAScheduler(max_t=30, grace_period=5, reduction_factor=3, brackets=1)
search_alg = OptunaSearch(metric='val_accuracy', mode='max')

analysis = tune.run(
    train_with_config,
    config=search_space,
    num_samples=100,
    scheduler=asha_scheduler,
    search_alg=search_alg,
    resources_per_trial={'gpu': 1, 'cpu': 4},
    local_dir='./ray_results',
    name='hpo_experiment_1',
    resume=False,
    max_failures=2,
)

best_config = analysis.get_best_config(metric='val_accuracy', mode='max')
print(f"Best config: {best_config}")
```

## 5.4 Experiment Tracking

### 5.4.1 MLflow Integration

```python
import mlflow
import mlflow.sklearn
import mlflow.pytorch
from mlflow.tracking.client import MlflowClient
from datetime import datetime
import pandas as pd

class ExperimentTracker:
    def __init__(self, tracking_uri=None, experiment_name=None):
        if tracking_uri:
            mlflow.set_tracking_uri(tracking_uri)
        self.client = MlflowClient()
        if experiment_name:
            experiment = self.client.get_experiment_by_name(experiment_name)
            if experiment is None:
                self.client.create_experiment(name=experiment_name, artifact_location=f's3://mlflow-artifacts/{experiment_name}')
            mlflow.set_experiment(experiment_name)

    def start_run(self, run_name=None, tags=None):
        run = mlflow.start_run(run_name=run_name or f'run_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
        if tags:
            mlflow.set_tags(tags)
        return run

    def log_params(self, params, prefix=None):
        if prefix:
            params = {f'{prefix}.{k}': v for k, v in params.items()}
        mlflow.log_params(params)

    def log_metrics(self, metrics, step=None, prefix=None):
        if prefix:
            metrics = {f'{prefix}.{k}': v for k, v in metrics.items()}
        mlflow.log_metrics(metrics, step=step)

    def log_model(self, model, model_name):
        import sklearn, torch
        if isinstance(model, sklearn.base.BaseEstimator):
            mlflow.sklearn.log_model(sk_model=model, artifact_path=model_name)
        elif isinstance(model, torch.nn.Module):
            mlflow.pytorch.log_model(pytorch_model=model, artifact_path=model_name)

    def end_run(self):
        mlflow.end_run()

    def search_runs(self, experiment_name=None, filter_string=None, max_results=100):
        return mlflow.search_runs(
            experiment_names=[experiment_name] if experiment_name else None,
            filter_string=filter_string,
            max_results=max_results,
        )

    def promote_best_model(self, experiment_name, metric='val_accuracy', mode='max', stage='Production'):
        runs = mlflow.search_runs(
            experiment_names=[experiment_name],
            order_by=[f'metrics.{metric} {"DESC" if mode == "max" else "ASC"}'],
            max_results=1,
        )
        if runs.empty:
            return
        best_run_id = runs.iloc[0]['run_id']
        model_name = f'{experiment_name}_model'
        result = mlflow.register_model(f'runs:/{best_run_id}/model', model_name)
        self.client.transition_model_version_stage(name=model_name, version=result.version, stage=stage)
        return {'run_id': best_run_id, 'model_name': model_name, 'version': result.version}
```

## 5.5 Model Evaluation Framework

### 5.5.1 Comprehensive Evaluation

```python
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, log_loss,
    confusion_matrix, classification_report, matthews_corrcoef,
    cohen_kappa_score, mean_squared_error, mean_absolute_error,
    r2_score, mean_absolute_percentage_error,
    silhouette_score, davies_bouldin_score, calinski_harabasz_score,
    adjusted_rand_score, normalized_mutual_info_score,
)
from scipy import stats
from typing import Dict, List, Tuple, Any

class ModelEvaluator:
    def __init__(self, model, config=None):
        self.model = model
        self.config = config or {}

    def evaluate_classification(self, y_true, y_pred, y_prob=None, class_names=None):
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        is_binary = len(np.unique(y_true)) == 2
        metrics = {
            'accuracy': float(accuracy_score(y_true, y_pred)),
            'precision_macro': float(precision_score(y_true, y_pred, average='macro', zero_division=0)),
            'recall_macro': float(recall_score(y_true, y_pred, average='macro', zero_division=0)),
            'f1_macro': float(f1_score(y_true, y_pred, average='macro', zero_division=0)),
            'f1_weighted': float(f1_score(y_true, y_pred, average='weighted', zero_division=0)),
            'matthews_corrcoef': float(matthews_corrcoef(y_true, y_pred)),
            'cohen_kappa': float(cohen_kappa_score(y_true, y_pred)),
        }
        cm = confusion_matrix(y_true, y_pred)
        metrics['confusion_matrix'] = cm.tolist()
        per_class = {}
        for i in range(len(np.unique(y_true))):
            class_name = class_names[i] if class_names else f'class_{i}'
            tp, fp, fn = cm[i, i], cm[:, i].sum() - cm[i, i], cm[i, :].sum() - cm[i, i]
            tn = cm.sum() - (tp + fp + fn)
            per_class[class_name] = {
                'precision': float(tp / (tp + fp) if (tp + fp) > 0 else 0),
                'recall': float(tp / (tp + fn) if (tp + fn) > 0 else 0),
                'f1': float(2 * tp / (2 * tp + fp + fn) if (2 * tp + fp + fn) > 0 else 0),
                'specificity': float(tn / (tn + fp) if (tn + fp) > 0 else 0),
                'support': int(tp + fn),
            }
        metrics['per_class'] = per_class
        if y_prob is not None:
            y_prob = np.array(y_prob)
            if is_binary:
                y_prob_positive = y_prob[:, 1] if y_prob.ndim == 2 and y_prob.shape[1] >= 2 else y_prob
                metrics['roc_auc'] = float(roc_auc_score(y_true, y_prob_positive))
                metrics['average_precision'] = float(average_precision_score(y_true, y_prob_positive))
                metrics['log_loss'] = float(log_loss(y_true, y_prob_positive))
                thresholds = np.linspace(0, 1, 100)
                f1_scores = [f1_score(y_true, (y_prob_positive >= t).astype(int), zero_division=0) for t in thresholds]
                optimal_idx = np.argmax(f1_scores)
                metrics['optimal_threshold'] = float(thresholds[optimal_idx])
            else:
                try:
                    metrics['roc_auc_ovr'] = float(roc_auc_score(y_true, y_prob, multi_class='ovr'))
                except ValueError:
                    metrics['roc_auc_ovr'] = None
        return metrics

    def evaluate_regression(self, y_true, y_pred):
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        residuals = y_true - y_pred
        metrics = {
            'mse': float(mean_squared_error(y_true, y_pred)),
            'rmse': float(np.sqrt(mean_squared_error(y_true, y_pred))),
            'mae': float(mean_absolute_error(y_true, y_pred)),
            'mape': float(mean_absolute_percentage_error(y_true, y_pred) * 100),
            'r2': float(r2_score(y_true, y_pred)),
            'explained_variance': float(explained_variance_score(y_true, y_pred)),
            'max_error': float(np.max(np.abs(residuals))),
            'median_abs_error': float(np.median(np.abs(residuals))),
        }
        metrics['residual_std'] = float(np.std(residuals))
        metrics['residual_mean'] = float(np.mean(residuals))
        shapiro_stat, shapiro_p = stats.shapiro(residuals[:min(5000, len(residuals))])
        metrics['residual_normality_p'] = float(shapiro_p)
        return metrics

    def evaluate_clustering(self, X, labels, true_labels=None):
        metrics = {
            'silhouette_score': float(silhouette_score(X, labels)),
            'davies_bouldin_score': float(davies_bouldin_score(X, labels)),
            'calinski_harabasz_score': float(calinski_harabasz_score(X, labels)),
        }
        if true_labels is not None:
            metrics['adjusted_rand'] = float(adjusted_rand_score(true_labels, labels))
            metrics['nmi'] = float(normalized_mutual_info_score(true_labels, labels))
        return metrics

    def evaluate_ranking(self, y_true, y_score, k_values=[1, 3, 5, 10]):
        from sklearn.metrics import ndcg_score, label_ranking_average_precision_score
        y_true, y_score = np.array(y_true), np.array(y_score)
        metrics = {'map': float(label_ranking_average_precision_score(y_true, y_score))}
        for k in k_values:
            if y_true.shape[1] >= k:
                metrics[f'ndcg@{k}'] = float(ndcg_score(y_true, y_score, k=k))
        return metrics

    def statistical_significance_test(self, model_a_scores, model_b_scores, paired=True):
        if paired:
            t_stat, p_value = stats.ttest_rel(model_a_scores, model_b_scores)
        else:
            t_stat, p_value = stats.ttest_ind(model_a_scores, model_b_scores)
        effect_size = (np.mean(model_b_scores) - np.mean(model_a_scores)) / \
                      np.sqrt((np.std(model_a_scores)**2 + np.std(model_b_scores)**2) / 2)
        return {
            'test': 'paired_t' if paired else 'independent_t',
            't_statistic': float(t_stat),
            'p_value': float(p_value),
            'significant_at_005': p_value < 0.05,
            'effect_size': float(effect_size),
            'mean_a': float(np.mean(model_a_scores)),
            'mean_b': float(np.mean(model_b_scores)),
            'lift_pct': float(((np.mean(model_b_scores) / np.mean(model_a_scores)) - 1) * 100),
        }

    def generate_report(self, task_type, y_true, y_pred, y_prob=None, model_name='model'):
        if task_type == 'classification':
            metrics = self.evaluate_classification(y_true, y_pred, y_prob)
        elif task_type == 'regression':
            metrics = self.evaluate_regression(y_true, y_pred)
        elif task_type == 'clustering':
            metrics = self.evaluate_clustering(y_true, y_pred)
        else:
            raise ValueError(f"Unknown task type: {task_type}")
        metrics['model_name'] = model_name
        metrics['num_samples'] = len(y_true)
        metrics['task_type'] = task_type
        return metrics
```

## 5.6 Model Interpretability

### 5.6.1 SHAP Analysis

```python
import shap
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

class ModelExplainer:
    def __init__(self, model, X_background):
        self.model = model
        self.X_background = X_background
        self.explainer = None

    def fit_explainer(self, explainer_type='tree'):
        if explainer_type == 'tree':
            self.explainer = shap.TreeExplainer(self.model)
        elif explainer_type == 'kernel':
            self.explainer = shap.KernelExplainer(self.model.predict, self.X_background[:100])
        elif explainer_type == 'deep':
            self.explainer = shap.DeepExplainer(self.model, self.X_background[:100])
        elif explainer_type == 'linear':
            self.explainer = shap.LinearExplainer(self.model, self.X_background)
        return self

    def explain_instance(self, X_instance):
        if self.explainer is None:
            self.fit_explainer()
        shap_values = self.explainer.shap_values(X_instance)
        return shap_values

    def feature_importance_summary(self, X, max_features=20):
        if self.explainer is None:
            self.fit_explainer()
        shap_values = self.explainer.shap_values(X)
        if isinstance(shap_values, list):
            shap_values = np.abs(shap_values).mean(axis=0)
        else:
            shap_values = np.abs(shap_values).mean(axis=0)
        feature_names = X.columns if isinstance(X, pd.DataFrame) else [f'feature_{i}' for i in range(X.shape[1])]
        importance_df = pd.DataFrame({'feature': feature_names, 'importance': shap_values.mean(axis=0)})
        importance_df = importance_df.sort_values('importance', ascending=False).head(max_features)
        return importance_df

    def dependence_plot(self, feature_idx, X, feature_names=None):
        if self.explainer is None:
            self.fit_explainer()
        shap_values = self.explainer.shap_values(X)
        shap.dependence_plot(feature_idx, shap_values, X, feature_names=feature_names)
        plt.tight_layout()
        return plt.gcf()

    def summary_plot(self, X, max_features=20):
        if self.explainer is None:
            self.fit_explainer()
        shap_values = self.explainer.shap_values(X)
        shap.summary_plot(shap_values, X, max_display=max_features, show=False)
        plt.tight_layout()
        return plt.gcf()
```


---

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
---
apiVersion: v1
kind: Service
metadata:
  name: model-serving
spec:
  selector:
    app: model-serving
    version: blue
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

### 6.2.3 Deployment Rollback Procedure

1. Detect degradation via monitoring alerts (latency > threshold, error rate > 1%, accuracy drop > 2%)
2. Trigger rollback automatically via CI/CD pipeline
3. Revert service selector to previous version
4. Verify health of rolled-back deployment
5. Log incident and notify team
6. Conduct post-mortem within 24 hours

## 6.3 Model Server Configuration

### 6.3.1 Triton Inference Server

```yaml
model_repository/
  model_a/
    1/
      model.onnx
    config.pbtxt
  model_b/
    1/
      model.pt
    config.pbtxt
  ensemble_model/
    1/
      ensemble_config
    config.pbtxt

---
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

### 6.6.2 Benchmarking Script

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


---

# P7: MLOps

## 7.1 MLOps Principles

MLOps applies DevOps principles to ML systems, enabling reliable, automated, and reproducible ML workflows.

### 7.1.1 Core Principles

1. **Reproducibility**: Every artifact (data, code, model, environment) is versioned
2. **Automation**: CI/CD pipelines for training, evaluation, deployment, and monitoring
3. **Observability**: Comprehensive logging, metrics, and alerting across the ML lifecycle
4. **Governance**: Model lineage, audit trails, access control, and compliance
5. **Continuous Training**: Automated retraining pipelines triggered by drift or schedule
6. **Safe Deployment**: Canary releases, A/B testing, and automated rollback
7. **Collaboration**: Shared feature store, model registry, and experiment tracking

### 7.1.2 MLOps Maturity Model

| Level | Name | Characteristics |
|---|---|---|
| 0 | No MLOps | Manual training, no tracking, ad-hoc deployment |
| 1 | DevOps but no MLOps | Automated deployment but manual model management |
| 2 | Automated Training | CI/CD for training, experiment tracking, model registry |
| 3 | Automated Deployment | Canary releases, A/B testing, automated rollbacks |
| 4 | Full MLOps | Continuous training, auto-retraining, drift detection, self-healing |
| 5 | Autonomous ML | Auto-ML, self-optimizing, adaptive models |

## 7.2 CI/CD for ML

### 7.2.1 CI Pipeline for ML

```yaml
name: ML CI Pipeline
on:
  pull_request:
    paths:
      - 'src/**'
      - 'configs/**'
      - 'requirements.txt'

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt
      - name: Lint
        run: ruff check src/
      - name: Type check
        run: mypy src/

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt
      - name: Run unit tests
        run: pytest tests/unit/ --cov=src/ --cov-report=xml --junitxml=test-results.xml
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  data-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - name: Validate data schema
        run: python -m src.validation.validate_schema --data-path s3://data/test/latest/
      - name: Check data quality
        run: python -m src.validation.data_quality --expectations configs/expectations.json

  model-evaluation:
    runs-on: [self-hosted, gpu]
    steps:
      - uses: actions/checkout@v4
      - name: Evaluate candidate model
        run: |
          python -m src.evaluation.evaluate \
            --model-uri runs:/${{ github.event.pull_request.head.sha }}/model \
            --test-data s3://data/test/latest/ \
            --thresholds configs/metrics_thresholds.json
      - name: Compare with production
        run: |
          python -m src.evaluation.compare_models \
            --candidate runs:/${{ github.event.pull_request.head.sha }}/model \
            --production models:/production-model/latest \
            --test-data s3://data/test/latest/
```

### 7.2.2 CD Pipeline for ML

```yaml
name: ML CD Pipeline
on:
  workflow_run:
    workflows: ["ML CI Pipeline"]
    types:
      - completed
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - uses: actions/checkout@v4
      - name: Register model in staging
        run: |
          python -m src.registry.register \
            --model-uri runs:/${{ github.sha }}/model \
            --model-name production-model \
            --stage Staging
      - name: Deploy to staging
        run: |
          kubectl apply -f k8s/staging/
          kubectl rollout status deployment/model-serving -n staging

  validation:
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - name: Run shadow deployment
        run: |
          python -m src.evaluation.shadow_test \
            --staging-endpoint http://staging-model/predict \
            --production-endpoint http://production-model/predict \
            --num-requests 10000 \
            --max-latency-ratio 1.5

  promote-production:
    runs-on: ubuntu-latest
    needs: validation
    steps:
      - name: Promote model to production
        run: |
          python -m src.registry.promote \
            --model-name production-model \
            --from-stage Staging \
            --to-stage Production
      - name: Deploy to production (canary 5%)
        run: |
          kubectl apply -f k8s/production/
          python -m src.deployment.canary --deployment model-serving --canary-percent 5 --namespace production
      - name: Monitor canary
        run: |
          python -m src.monitoring.wait_for_stability \
            --deployment model-serving --namespace production --duration 30m --max-error-rate 0.01
      - name: Ramp up canary
        run: |
          python -m src.deployment.ramp_canary \
            --deployment model-serving --target-percent 100 --steps 25,50,100 --interval 15m
```

## 7.3 Model Registry Governance

### 7.3.1 Registration and Approval Workflow

```python
from mlflow.tracking.client import MlflowClient
from datetime import datetime
import json

class ModelGovernance:
    def __init__(self, tracking_uri="http://mlflow:5000"):
        self.client = MlflowClient(tracking_uri)

    def register_model(self, run_id, model_name, metadata=None):
        model_uri = f"runs:/{run_id}/model"
        registered = self.client.create_registered_model(model_name)
        version = self.client.create_model_version(model_name, model_uri, run_id)
        approval_status = {
            "status": "pending",
            "submitted_at": datetime.now().isoformat(),
            "submitted_by": metadata.get("submitted_by", "unknown") if metadata else "unknown",
            "required_approvals": ["ml-engineer-lead", "ml-platform-team"],
            "approvals": [],
        }
        self.client.set_model_version_tag(model_name, version.version, "approval_status", json.dumps(approval_status))
        return {"model_name": model_name, "version": version.version, "status": "pending"}

    def approve_model(self, model_name, version, approver, notes=None):
        tags = self.client.get_model_version(model_name, version).tags
        approval_status = json.loads(tags.get("approval_status", "{}"))
        approval_status["approvals"].append({
            "approver": approver,
            "approved_at": datetime.now().isoformat(),
            "notes": notes or "",
        })
        if len(approval_status["approvals"]) >= len(approval_status["required_approvals"]):
            approval_status["status"] = "approved"
            self.client.transition_model_version_stage(model_name, version, "Staging")
        self.client.set_model_version_tag(model_name, version, "approval_status", json.dumps(approval_status))
        return approval_status

    def reject_model(self, model_name, version, reviewer, reason):
        tags = self.client.get_model_version(model_name, version).tags
        approval_status = json.loads(tags.get("approval_status", "{}"))
        approval_status["status"] = "rejected"
        approval_status["rejected_at"] = datetime.now().isoformat()
        approval_status["rejected_by"] = reviewer
        approval_status["rejection_reason"] = reason
        self.client.set_model_version_tag(model_name, version, "approval_status", json.dumps(approval_status))
        return approval_status

    def get_model_lineage(self, model_name, version):
        model_version = self.client.get_model_version(model_name, version)
        run = self.client.get_run(model_version.run_id)
        return {
            "model_name": model_name,
            "version": version,
            "run_id": model_version.run_id,
            "experiment_id": run.info.experiment_id,
            "artifact_uri": model_version.source,
            "created_at": model_version.creation_timestamp,
            "stage": model_version.current_stage,
            "run_params": run.data.params,
            "run_metrics": run.data.metrics,
        }
```

## 7.4 Model Monitoring

### 7.4.1 Drift Detection

```python
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from scipy.stats import ks_2samp, wasserstein_distance
import json, logging

logger = logging.getLogger(__name__)

class DriftDetector:
    def __init__(self, reference_data: pd.DataFrame, categorical_threshold: float = 0.1, numerical_threshold: float = 0.1):
        self.reference = reference_data
        self.categorical_threshold = categorical_threshold
        self.numerical_threshold = numerical_threshold
        self.reference_stats = self._compute_reference_stats()

    def _compute_reference_stats(self):
        stats = {}
        for col in self.reference.columns:
            if self.reference[col].dtype in ['object', 'category', 'bool']:
                stats[col] = {
                    'type': 'categorical',
                    'distribution': self.reference[col].value_counts(normalize=True).to_dict(),
                }
            else:
                stats[col] = {
                    'type': 'numerical',
                    'mean': float(self.reference[col].mean()),
                    'std': float(self.reference[col].std()),
                    'min': float(self.reference[col].min()),
                    'max': float(self.reference[col].max()),
                    'p50': float(self.reference[col].quantile(0.5)),
                    'p95': float(self.reference[col].quantile(0.95)),
                    'p99': float(self.reference[col].quantile(0.99)),
                    'missing_rate': float(self.reference[col].isna().mean()),
                }
        return stats

    def detect_drift(self, current_data: pd.DataFrame) -> Dict:
        results = {}
        for col in self.reference.columns:
            if col not in current_data.columns:
                results[col] = {'drift': True, 'reason': 'missing_column', 'severity': 'high'}
                continue
            col_stats = self.reference_stats[col]
            if col_stats['type'] == 'categorical':
                drift_score = self._detect_categorical_drift(col, current_data)
            else:
                drift_score = self._detect_numerical_drift(col, current_data)
            results[col] = drift_score
        return results

    def _detect_categorical_drift(self, col, current):
        ref_dist = self.reference[col].value_counts(normalize=True)
        cur_dist = current[col].value_counts(normalize=True)
        all_categories = set(ref_dist.index) | set(cur_dist.index)
        psi = 0
        for cat in all_categories:
            p = ref_dist.get(cat, 0) + 1e-10
            q = cur_dist.get(cat, 0) + 1e-10
            psi += (q - p) * np.log(q / p)
        drift_detected = psi > self.categorical_threshold
        return {'feature': col, 'type': 'categorical', 'psi': float(psi), 'drift': drift_detected, 'severity': 'high' if psi > self.categorical_threshold * 2 else ('medium' if drift_detected else 'low')}

    def _detect_numerical_drift(self, col, current):
        ref_values = self.reference[col].dropna()
        cur_values = current[col].dropna()
        ref_mean, cur_mean = ref_values.mean(), cur_values.mean()
        mean_drift_pct = abs(cur_mean - ref_mean) / (abs(ref_mean) + 1e-10)
        ks_stat, ks_p = ks_2samp(ref_values, cur_values)
        wasserstein = float(wasserstein_distance(ref_values, cur_values))
        drift_detected = ks_p < 0.05 or mean_drift_pct > self.numerical_threshold
        return {'feature': col, 'type': 'numerical', 'ks_statistic': float(ks_stat), 'ks_pvalue': float(ks_p), 'wasserstein_distance': wasserstein, 'mean_drift_pct': float(mean_drift_pct), 'drift': drift_detected, 'severity': 'high' if ks_p < 0.001 else ('medium' if ks_p < 0.05 else 'low')}

    def get_drift_report(self, current_data):
        results = self.detect_drift(current_data)
        df = pd.DataFrame(results).T
        return df.sort_values('severity', ascending=False)

class PerformanceMonitor:
    def __init__(self, expected_metrics: Dict, alert_threshold: float = 0.05):
        self.expected = expected_metrics
        self.threshold = alert_threshold
        self.history = {k: [] for k in expected_metrics.keys()}

    def update(self, metrics):
        for k, v in metrics.items():
            if k in self.history:
                self.history[k].append(v)

    def check_degradation(self, metrics):
        alerts = {}
        for k, v in metrics.items():
            if k in self.expected:
                expected_val = self.expected[k]
                relative_change = abs(v - expected_val) / (abs(expected_val) + 1e-10)
                degraded = relative_change > self.threshold
                if degraded:
                    direction = 'improvement' if v > expected_val else 'degradation'
                    alerts[k] = {'metric': k, 'expected': expected_val, 'current': v, 'relative_change_pct': round(relative_change * 100, 2), 'direction': direction, 'severity': 'high' if relative_change > self.threshold * 2 else 'medium'}
        return alerts

class ModelMonitor:
    def __init__(self, drift_detector, performance_monitor):
        self.drift_detector = drift_detector
        self.performance_monitor = performance_monitor
        self.alerts = []

    def analyze_batch(self, features, predictions, actuals=None, metrics=None):
        findings = {}
        drift_results = self.drift_detector.detect_drift(features)
        num_drifted = sum(1 for v in drift_results.values() if v.get('drift', False))
        findings['drift'] = {'num_features_drifted': num_drifted, 'total_features': len(drift_results), 'drift_rate': num_drifted / len(drift_results), 'details': drift_results}
        if actuals is not None:
            pred_dist = pd.Series(predictions).value_counts(normalize=True).to_dict()
            actual_dist = pd.Series(actuals).value_counts(normalize=True).to_dict()
            pred_drift = sum(abs(pred_dist.get(k, 0) - actual_dist.get(k, 0)) for k in set(list(pred_dist.keys()) + list(actual_dist.keys())))
            findings['prediction_drift'] = pred_drift
        if metrics:
            degradations = self.performance_monitor.check_degradation(metrics)
            self.performance_monitor.update(metrics)
            findings['performance'] = degradations
            for k, v in degradations.items():
                if v['severity'] == 'high':
                    self.alerts.append({'type': 'performance_degradation', 'metric': k, 'value': v, 'timestamp': datetime.now().isoformat()})
        if num_drifted > len(drift_results) * 0.3:
            self.alerts.append({'type': 'data_drift', 'value': f'{num_drifted}/{len(drift_results)} features drifted', 'timestamp': datetime.now().isoformat()})
        return findings

    def get_alerts(self, clear=False):
        alerts = self.alerts.copy()
        if clear:
            self.alerts = []
        return alerts
```

### 7.4.2 Prometheus Monitoring Rules

```yaml
groups:
  - name: ml_monitoring
    rules:
      - alert: HighModelLatency
        expr: histogram_quantile(0.99, rate(model_prediction_latency_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: pager
        annotations:
          summary: "P99 latency > 500ms for model"
          description: "P99 latency is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(model_prediction_errors_total[5m]) / rate(model_prediction_requests_total[5m]) > 0.01
        for: 5m
        labels:
          severity: pager
        annotations:
          summary: "Error rate > 1%"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: LowThroughput
        expr: rate(model_prediction_requests_total[5m]) < 100
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Low throughput"
          description: "Throughput is {{ $value }} QPS"

      - alert: DataDriftDetected
        expr: model_feature_drift_score > 0.2
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Data drift detected"
          description: "PSI score {{ $value }}"

      - alert: ModelAccuracyDrop
        expr: model_accuracy < 0.8
        for: 30m
        labels:
          severity: critical
        annotations:
          summary: "Model accuracy dropped below 0.8"
          description: "Current accuracy: {{ $value }}"

      - alert: GPUUnderutilized
        expr: avg by(model) (nvidia_gpu_utilization) < 0.3
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "GPU underutilized"
          description: "GPU utilization is {{ $value | humanizePercentage }}"

      - alert: OutOfMemory
        expr: container_memory_working_set_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Container memory > 90%"
          description: "Memory usage at {{ $value | humanizePercentage }}"
```

### 7.4.3 Custom Metrics Export

```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
from functools import wraps

PREDICTION_REQUESTS = Counter('model_prediction_requests_total', 'Total prediction requests', ['model', 'version'])
PREDICTION_ERRORS = Counter('model_prediction_errors_total', 'Total prediction errors', ['model', 'error_type'])
PREDICTION_LATENCY = Histogram('model_prediction_latency_seconds', 'Prediction latency', ['model'], buckets=(0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0))
FEATURE_DRIFT_SCORE = Gauge('model_feature_drift_score', 'Feature drift PSI score', ['model', 'feature'])
MODEL_ACCURACY = Gauge('model_accuracy', 'Current model accuracy', ['model'])
GPU_UTILIZATION = Gauge('nvidia_gpu_utilization', 'GPU utilization', ['model', 'gpu_id'])
MODEL_MEMORY_USAGE = Gauge('model_memory_mb', 'Model memory usage in MB', ['model'])

class MetricsMiddleware:
    def __init__(self, model_name: str, model_version: str):
        self.model_name = model_name
        self.model_version = model_version

    def track_prediction(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            PREDICTION_REQUESTS.labels(model=self.model_name, version=self.model_version).inc()
            start = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                PREDICTION_ERRORS.labels(model=self.model_name, error_type=type(e).__name__).inc()
                raise
            finally:
                PREDICTION_LATENCY.labels(model=self.model_name).observe(time.time() - start)
        return wrapper

    def update_drift_score(self, feature_name, score):
        FEATURE_DRIFT_SCORE.labels(model=self.model_name, feature=feature_name).set(score)

    def update_accuracy(self, accuracy):
        MODEL_ACCURACY.labels(model=self.model_name).set(accuracy)

    def update_gpu_utilization(self, gpu_id, utilization):
        GPU_UTILIZATION.labels(model=self.model_name, gpu_id=gpu_id).set(utilization)

    def get_metrics(self):
        return generate_latest()
```

## 7.5 Automated Retraining Pipeline

### 7.5.1 Retraining Orchestrator

```python
from datetime import datetime, timedelta
from typing import Dict, Optional, Callable
import logging

logger = logging.getLogger(__name__)

class RetrainingOrchestrator:
    def __init__(self, model_name, drift_detector, performance_monitor, min_training_data=50000):
        self.model_name = model_name
        self.drift_detector = drift_detector
        self.performance_monitor = performance_monitor
        self.min_training_data = min_training_data
        self.last_retrain_time = None
        self.retrain_count = 0

    def should_retrain(self, current_metrics, current_data, schedule_interval_hours=24):
        reasons = []
        if self.last_retrain_time is None:
            reasons.append('initial_training')
        elif (datetime.now() - self.last_retrain_time).total_seconds() > schedule_interval_hours * 3600:
            reasons.append('scheduled')
        if len(current_data) >= self.min_training_data:
            reasons.append('data_volume')
        drift_results = self.drift_detector.detect_drift(current_data)
        drifted_features = [k for k, v in drift_results.items() if v.get('drift', False)]
        if len(drifted_features) > len(drift_results) * 0.2:
            reasons.append(f'data_drift: {len(drifted_features)} features drifted')
        if current_metrics:
            degradations = self.performance_monitor.check_degradation(current_metrics)
            if degradations:
                reasons.append(f'performance_degradation: {list(degradations.keys())}')
        return {'should_retrain': len(reasons) > 0, 'reasons': reasons}

    def execute_retraining(self, training_fn, latest_data_path, hyperparameters=None):
        logger.info(f"Starting retraining for {self.model_name}")
        start_time = datetime.now()
        try:
            result = training_fn(data_path=latest_data_path, hyperparameters=hyperparameters or {})
            self.last_retrain_time = datetime.now()
            self.retrain_count += 1
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"Retraining completed in {duration}s")
            return {'success': True, 'run_id': result.get('run_id'), 'metrics': result.get('metrics', {}), 'duration_seconds': duration, 'retrain_count': self.retrain_count}
        except Exception as e:
            logger.error(f"Retraining failed: {e}")
            return {'success': False, 'error': str(e), 'duration_seconds': (datetime.now() - start_time).total_seconds()}
```

## 7.6 Incident Response

### 7.6.1 Incident Severity Levels

| Severity | Response Time | Escalation | Example |
|---|---|---|---|
| SEV-0 (Critical) | 15 min | VP Engineering | Model serving down, all predictions failing |
| SEV-1 (High) | 30 min | Engineering Manager | Latency > 5x normal, accuracy drop > 10% |
| SEV-2 (Medium) | 2 hours | Team Lead | Drift detected, accuracy drop > 5% |
| SEV-3 (Low) | 24 hours | Engineer | Minor data quality issues, cost anomalies |

### 7.6.2 Incident Runbook

```python
class IncidentRunbook:
    def __init__(self, model_name):
        self.model_name = model_name
        self.steps = {
            'model_serving_down': [
                'Check deployment status: kubectl get pods -n production',
                'Check pod logs: kubectl logs -n production deployment/model-serving',
                'Check resource utilization: kubectl top pods -n production',
                'Verify model artifact exists in registry',
                'Check MLflow tracking server connectivity',
                'If OOM: increase memory limits, reduce batch size',
                'If GPU error: check CUDA drivers, nvidia-smi',
                'If model load failure: verify model artifact integrity',
                'Attempt rolling restart: kubectl rollout restart deployment/model-serving',
                'If persistent: rollback to previous model version',
            ],
            'high_latency': [
                'Check p50/p95/p99 latency metrics in Grafana',
                'Verify feature store response times',
                'Check model input size',
                'Check GPU utilization and memory',
                'Verify model is using optimal precision',
                'Consider scaling up replicas',
                'Consider reducing batch size',
            ],
            'accuracy_degradation': [
                'Verify ground truth labels are correct',
                'Check for data drift in top features',
                'Check for concept drift in prediction distribution',
                'Compare prediction distributions between old and new model',
                'Run shadow evaluation on recent data',
                'Check if new features were added with bugs',
                'Check for training-serving skew',
                'Trigger retraining pipeline if drift confirmed',
            ],
            'data_drift': [
                'Identify drifted features from monitoring dashboard',
                'Check data source for upstream changes',
                'Verify feature pipeline transformations are correct',
                'Check for missing values or schema changes',
                'Update reference dataset if distribution shift is permanent',
                'Trigger retraining on new data distribution',
            ],
        }

    def get_runbook(self, incident_type):
        return self.steps.get(incident_type, ['Investigate incident', 'Check all dashboards', 'Escalate if unresolved'])

    def log_incident(self, incident_type, severity, details):
        incident = {'timestamp': datetime.now().isoformat(), 'model': self.model_name, 'incident_type': incident_type, 'severity': severity, 'details': details, 'runbook_steps': self.get_runbook(incident_type)}
        logger.error(f"Incident logged: {json.dumps(incident, indent=2)}")
        return incident
```

## 7.7 Data and Model Lineage

```python
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Dict
import json, os

@dataclass
class DatasetNode:
    name: str
    version: str
    path: str
    row_count: int
    feature_count: int
    schema_hash: str
    created_at: str = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class TrainingNode:
    run_id: str
    experiment_id: str
    code_version: str
    hyperparameters: Dict
    framework: str
    hardware: str
    duration_seconds: float
    dataset: DatasetNode
    model_artifact_path: str
    metrics: Dict
    created_at: str = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

@dataclass
class DeploymentNode:
    model_name: str
    model_version: int
    stage: str
    deployment_strategy: str
    traffic_percent: float
    training_run_id: str
    created_at: str = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

class LineageTracker:
    def __init__(self, storage_path: str = './lineage'):
        self.storage_path = storage_path
        os.makedirs(storage_path, exist_ok=True)

    def record_dataset(self, dataset: DatasetNode):
        path = f"{self.storage_path}/datasets/{dataset.name}/{dataset.version}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(asdict(dataset), f, indent=2)

    def record_training(self, training: TrainingNode):
        path = f"{self.storage_path}/training/{training.run_id}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(asdict(training), f, indent=2)

    def record_deployment(self, deployment: DeploymentNode):
        path = f"{self.storage_path}/deployments/{deployment.model_name}/{deployment.model_version}.json"
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(asdict(deployment), f, indent=2)

    def get_lineage(self, model_name, version):
        with open(f"{self.storage_path}/deployments/{model_name}/{version}.json") as f:
            deployment = json.load(f)
        with open(f"{self.storage_path}/training/{deployment['training_run_id']}.json") as f:
            training = json.load(f)
        with open(f"{self.storage_path}/datasets/{training['dataset']['name']}/{training['dataset']['version']}.json") as f:
            dataset = json.load(f)
        return {'deployment': deployment, 'training': training, 'dataset': dataset}
```


---

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
        'gpt-4': {'input': 0.03, 'output': 0.06},
        'gpt-4-turbo': {'input': 0.01, 'output': 0.03},
        'gpt-3.5-turbo': {'input': 0.001, 'output': 0.002},
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


---

# P9: Worked Examples

## Example 1: Fraud Detection System

### Problem
Build a real-time fraud detection system for credit card transactions with <50ms p99 latency and >0.95 AUC.

### Solution Architecture

```python
# Architecture: Real-time inference with feature store + streaming features

class FraudDetectionSystem:
    def __init__(self):
        self.feature_store = FeatureStore(repo_path="./feature_repo")
        self.model = mlflow.pyfunc.load_model("models:/fraud-detection/production")
        self.cache = PredictionCache(redis_client)
        self.monitor = ModelMonitor(drift_detector, performance_monitor)

    def predict(self, transaction):
        # 1. Get batch features from feature store
        user_features = self.feature_store.get_online_features(
            features=["user_features:age", "user_features:avg_transaction_30d",
                      "user_features:num_transactions_30d", "user_features:credit_score"],
            entity_rows=[{"user_id": transaction.user_id}]
        ).to_dict()

        # 2. Compute real-time features
        merchant_features = self.merchant_lookup(transaction.merchant_id)
        velocity_features = self.velocity_check(transaction)

        # 3. Build feature vector
        features = {**user_features, **merchant_features, **velocity_features,
                    "amount": transaction.amount, "hour": transaction.timestamp.hour,
                    "is_weekend": transaction.timestamp.weekday() >= 5}

        # 4. Check cache
        cache_key = self.cache.cache_key_from_features("fraud-v3", features)
        cached = self.cache.get_or_compute(cache_key, lambda: self._score(features))

        # 5. Score with model
        risk_score = cached
        prediction = 1 if risk_score > 0.7 else 0

        # 6. Monitor
        self.monitor.analyze_batch(pd.DataFrame([features]), np.array([prediction]))

        return {
            "fraud_prediction": prediction,
            "risk_score": float(risk_score),
            "features_used": list(features.keys()),
            "model_version": "v3.2.1",
        }

    def _score(self, features):
        feature_array = np.array([list(features.values())])
        return self.model.predict(feature_array)[0]

    def velocity_check(self, transaction):
        recent_txns = get_recent_transactions(transaction.user_id, window_minutes=5)
        return {
            "txn_count_5min": len(recent_txns),
            "total_amount_5min": sum(t.amount for t in recent_txns),
            "unique_merchants_5min": len(set(t.merchant_id for t in recent_txns)),
            "avg_amount_5min": sum(t.amount for t in recent_txns) / max(len(recent_txns), 1),
        }
```

## Example 2: Recommendation System

### Problem
Build a personalized recommendation system serving 10M+ users with <200ms p99 latency.

### Solution: Two-Tower Neural Network

```python
import torch
import torch.nn as nn

class TwoTowerModel(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=64, hidden_dims=[128, 64]):
        super().__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)

        user_input_dim = embedding_dim + 10  # +10 for user features
        item_input_dim = embedding_dim + 5   # +5 for item features

        self.user_tower = nn.Sequential(
            nn.Linear(user_input_dim, hidden_dims[0]),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dims[0], hidden_dims[1]),
            nn.ReLU(),
            nn.Linear(hidden_dims[1], embedding_dim),
        )

        self.item_tower = nn.Sequential(
            nn.Linear(item_input_dim, hidden_dims[0]),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dims[0], hidden_dims[1]),
            nn.ReLU(),
            nn.Linear(hidden_dims[1], embedding_dim),
        )

    def forward(self, user_ids, user_features, item_ids, item_features):
        user_emb = self.user_embedding(user_ids)
        user_input = torch.cat([user_emb, user_features], dim=1)
        user_vec = self.user_tower(user_input)

        item_emb = self.item_embedding(item_ids)
        item_input = torch.cat([item_emb, item_features], dim=1)
        item_vec = self.item_tower(item_input)

        scores = torch.matmul(user_vec, item_vec.T)
        return scores

class RecommenderServer:
    def __init__(self, model, item_catalog, feature_store):
        self.model = model
        self.item_catalog = item_catalog
        self.feature_store = feature_store
        self.model.eval()

    def recommend(self, user_id, top_k=20):
        user_features = self.feature_store.get_user_features(user_id)
        user_tensor = torch.tensor([user_id]).long()
        user_feat_tensor = torch.tensor([list(user_features.values())]).float()

        item_ids = torch.tensor(self.item_catalog.get_all_ids()).long()
        item_features = torch.tensor(self.item_catalog.get_all_features()).float()

        with torch.no_grad():
            scores = self.model(user_tensor, user_feat_tensor, item_ids, item_features)
            scores = scores.squeeze(0)

        top_scores, top_indices = torch.topk(scores, k=top_k)
        recommendations = [{'item_id': int(self.item_catalog.get_id(idx)), 'score': float(score)}
                          for idx, score in zip(top_indices, top_scores)]

        return recommendations

    def retrieve_candidates(self, user_id, num_candidates=500):
        user_embedding = self._get_user_embedding(user_id)
        scores = torch.matmul(user_embedding, self.item_embeddings.T)
        _, indices = torch.topk(scores, k=num_candidates)
        return [self.item_catalog.get_id(i) for i in indices]

    def _get_user_embedding(self, user_id):
        user_features = self.feature_store.get_user_features(user_id)
        user_tensor = torch.tensor([user_id]).long()
        user_feat_tensor = torch.tensor([list(user_features.values())]).float()
        user_emb = self.model.user_embedding(user_tensor)
        user_input = torch.cat([user_emb, user_feat_tensor], dim=1)
        return self.model.user_tower(user_input)
```

## Example 3: Image Classification Pipeline

### Problem
Build a production image classification system for product catalog with automatic retraining.

```python
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np

class ImageClassifier:
    def __init__(self, model_path, class_names, device='cuda'):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        self.model = torch.jit.load(model_path, map_location=self.device)
        self.model.eval()
        self.class_names = class_names
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def predict(self, image_path):
        image = Image.open(image_path).convert('RGB')
        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            predicted_class = torch.argmax(probabilities).item()
        return {
            'class': self.class_names[predicted_class],
            'confidence': float(probabilities[predicted_class]),
            'all_probabilities': {self.class_names[i]: float(probabilities[i]) for i in range(len(self.class_names))},
        }

    def predict_batch(self, image_paths):
        tensors = []
        for path in image_paths:
            image = Image.open(path).convert('RGB')
            tensors.append(self.transform(image))
        batch = torch.stack(tensors).to(self.device)
        with torch.no_grad():
            outputs = self.model(batch)
            probabilities = torch.softmax(outputs, dim=1)
        results = []
        for i in range(len(image_paths)):
            pred_class = torch.argmax(probabilities[i]).item()
            results.append({'class': self.class_names[pred_class], 'confidence': float(probabilities[i][pred_class])})
        return results

class ImageTrainingPipeline:
    def __init__(self, base_model='resnet50', num_classes=100):
        self.model = models.__dict__[base_model](pretrained=True)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=1e-4)

    def train_epoch(self, loader):
        self.model.train()
        total_loss = 0
        correct = 0
        total = 0
        for images, labels in loader:
            images, labels = images.cuda(), labels.cuda()
            self.optimizer.zero_grad()
            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            loss.backward()
            self.optimizer.step()
            total_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        return {'loss': total_loss / len(loader), 'accuracy': correct / total}

    @torch.no_grad()
    def validate(self, loader):
        self.model.eval()
        total_loss = 0
        correct = 0
        total = 0
        for images, labels in loader:
            images, labels = images.cuda(), labels.cuda()
            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            total_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        return {'loss': total_loss / len(loader), 'accuracy': correct / total}
```

## Example 4: Natural Language Processing (Text Classification)

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

class TextClassifier:
    def __init__(self, model_name="distilbert-base-uncased-finetuned-sst-2-english", max_length=512):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.eval()
        self.max_length = max_length
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def classify(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=self.max_length, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = F.softmax(outputs.logits, dim=1)[0]
            predicted_class = torch.argmax(probabilities).item()
        return {'text': text, 'predicted_class': predicted_class, 'confidence': float(probabilities[predicted_class]), 'probabilities': probabilities.tolist()}

    def classify_batch(self, texts):
        inputs = self.tokenizer(texts, return_tensors="pt", truncation=True, max_length=self.max_length, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = F.softmax(outputs.logits, dim=1)
            predictions = torch.argmax(probabilities, dim=1)
        return [{'text': texts[i], 'predicted_class': int(predictions[i]), 'confidence': float(probabilities[i][predictions[i]])} for i in range(len(texts))]
```

## Example 5: Time Series Forecasting

```python
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from typing import List, Tuple

class LSTMForecaster(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers, output_dim, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=dropout)
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        lstm_out, (hidden, cell) = self.lstm(x)
        last_hidden = lstm_out[:, -1, :]
        output = self.dropout(last_hidden)
        output = self.fc(output)
        return output

class TimeSeriesPipeline:
    def __init__(self, seq_length=30, forecast_horizon=7):
        self.seq_length = seq_length
        self.forecast_horizon = forecast_horizon
        self.model = None
        self.scaler = None

    def create_sequences(self, data):
        X, y = [], []
        for i in range(len(data) - self.seq_length - self.forecast_horizon + 1):
            X.append(data[i:i + self.seq_length])
            y.append(data[i + self.seq_length:i + self.seq_length + self.forecast_horizon])
        return np.array(X), np.array(y)

    def train(self, df, value_col='value', epochs=50, lr=1e-3):
        from sklearn.preprocessing import StandardScaler
        values = df[value_col].values.reshape(-1, 1)
        self.scaler = StandardScaler()
        scaled = self.scaler.fit_transform(values)
        X, y = self.create_sequences(scaled.flatten())
        X = X.reshape(X.shape[0], X.shape[1], 1)
        X_train, y_train = torch.FloatTensor(X), torch.FloatTensor(y)
        self.model = LSTMForecaster(input_dim=1, hidden_dim=64, num_layers=2, output_dim=self.forecast_horizon)
        optimizer = torch.optim.Adam(self.model.parameters(), lr=lr)
        criterion = nn.MSELoss()
        self.model.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            outputs = self.model(X_train)
            loss = criterion(outputs, y_train)
            loss.backward()
            optimizer.step()
            if epoch % 10 == 0:
                print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

    def forecast(self, recent_data, forecast_steps=7):
        self.model.eval()
        scaled = self.scaler.transform(recent_data.reshape(-1, 1)).flatten()
        input_seq = torch.FloatTensor(scaled[-self.seq_length:]).reshape(1, self.seq_length, 1)
        with torch.no_grad():
            prediction = self.model(input_seq).numpy()[0]
        return self.scaler.inverse_transform(prediction.reshape(-1, 1)).flatten()
```

## Example 6: Anomaly Detection System

```python
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd

class AnomalyDetector:
    def __init__(self, contamination=0.05, n_estimators=100):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.model = IsolationForest(contamination=contamination, n_estimators=n_estimators, random_state=42)
        self.scaler = StandardScaler()

    def fit(self, X):
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        self.model.fit(X_scaled)
        return self

    def predict(self, X):
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        scores = self.model.score_samples(X_scaled)
        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, scores)):
            anomalies.append({
                'index': i,
                'is_anomaly': bool(pred == -1),
                'anomaly_score': float(score),
                'severity': 'high' if score < np.percentile(scores, 1) else ('medium' if pred == -1 else 'low'),
            })
        return anomalies

    def get_feature_contributions(self, X):
        from sklearn.inspection import permutation_importance
        X_scaled = self.scaler.transform(X)
        result = permutation_importance(self.model, X_scaled, np.zeros(len(X)), n_repeats=10, random_state=42)
        feature_names = X.columns if isinstance(X, pd.DataFrame) else [f'feature_{i}' for i in range(X.shape[1])]
        return sorted([{'feature': fn, 'importance': float(imp)} for fn, imp in zip(feature_names, result.importances_mean)], key=lambda x: x['importance'], reverse=True)
```

## Example 7: A/B Testing for ML Models

```python
import numpy as np
from scipy import stats
import hashlib
from typing import Dict, List, Tuple

class MLExperiment:
    def __init__(self, name, control_model, treatment_model, traffic_split=0.5):
        self.name = name
        self.control = control_model
        self.treatment = treatment_model
        self.split = traffic_split
        self.results = {'control': {'predictions': [], 'latencies': [], 'outcomes': []},
                        'treatment': {'predictions': [], 'latencies': [], 'outcomes': []}}

    def assign_group(self, user_id):
        hash_val = int(hashlib.md5(f"{user_id}:{self.name}".encode()).hexdigest(), 16) % 1000
        return 'treatment' if hash_val < int(self.split * 1000) else 'control'

    def predict(self, user_id, features):
        import time
        group = self.assign_group(user_id)
        start = time.time()
        if group == 'treatment':
            prediction = self.treatment.predict(features)
        else:
            prediction = self.control.predict(features)
        latency = (time.time() - start) * 1000
        self.results[group]['predictions'].append(prediction)
        self.results[group]['latencies'].append(latency)
        return prediction, group

    def record_outcome(self, user_id, outcome):
        group = self.assign_group(user_id)
        self.results[group]['outcomes'].append(outcome)

    def analyze(self) -> Dict:
        control_outcomes = np.array(self.results['control']['outcomes'])
        treatment_outcomes = np.array(self.results['treatment']['outcomes'])
        control_latencies = np.array(self.results['control']['latencies'])
        treatment_latencies = np.array(self.results['treatment']['latencies'])

        t_stat, p_value = stats.ttest_ind(treatment_outcomes, control_outcomes)
        control_mean = float(np.mean(control_outcomes))
        treatment_mean = float(np.mean(treatment_outcomes))
        lift = ((treatment_mean / control_mean) - 1) * 100 if control_mean > 0 else 0

        lat_t_stat, lat_p_value = stats.ttest_ind(treatment_latencies, control_latencies)

        return {
            'experiment': self.name,
            'control_size': len(control_outcomes),
            'treatment_size': len(treatment_outcomes),
            'control_mean_metric': control_mean,
            'treatment_mean_metric': treatment_mean,
            'lift_pct': round(lift, 2),
            'p_value': float(p_value),
            'statistically_significant': p_value < 0.05,
            'confidence_level': (1 - p_value) * 100,
            'control_latency_p50': float(np.median(control_latencies)),
            'treatment_latency_p50': float(np.median(treatment_latencies)),
            'latency_p_value': float(lat_p_value),
            'latency_significant': lat_p_value < 0.05,
            'recommendation': 'Deploy treatment' if p_value < 0.05 and lift > 0 else 'Keep control',
        }
```

## Example 8: Model Monitoring Dashboard

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class MonitoringDashboard:
    def __init__(self, model_name):
        self.model_name = model_name
        self.metrics_history = pd.DataFrame(columns=['timestamp', 'accuracy', 'latency_p50', 'latency_p99', 'throughput', 'error_rate'])

    def log_metrics(self, metrics):
        metrics['timestamp'] = datetime.now()
        self.metrics_history = pd.concat([self.metrics_history, pd.DataFrame([metrics])], ignore_index=True)

    def create_dashboard(self, hours=24):
        cutoff = datetime.now() - timedelta(hours=hours)
        df = self.metrics_history[self.metrics_history['timestamp'] >= cutoff]

        fig = make_subplots(
            rows=3, cols=2,
            subplot_titles=('Model Accuracy', 'Latency (p50, p99)', 'Throughput (QPS)', 'Error Rate', 'Prediction Distribution', 'Feature Drift PSI'),
            specs=[[{}, {}], [{}, {}], [{}, {}]]
        )

        fig.add_trace(go.Scatter(x=df['timestamp'], y=df['accuracy'], mode='lines+markers', name='Accuracy'), row=1, col=1)
        fig.add_trace(go.Scatter(x=df['timestamp'], y=df['latency_p50'], mode='lines', name='p50 Latency'), row=1, col=2)
        fig.add_trace(go.Scatter(x=df['timestamp'], y=df['latency_p99'], mode='lines', name='p99 Latency'), row=1, col=2)
        fig.add_trace(go.Scatter(x=df['timestamp'], y=df['throughput'], mode='lines+markers', name='Throughput'), row=2, col=1)
        fig.add_trace(go.Scatter(x=df['timestamp'], y=df['error_rate'], mode='lines+markers', name='Error Rate'), row=2, col=2)
        fig.add_hline(y=0.01, line_dash="dash", line_color="red", row=2, col=2)

        fig.update_layout(height=800, title_text=f"Model Monitoring: {self.model_name}")
        return fig

    def generate_alert_summary(self):
        recent = self.metrics_history.tail(60)
        alerts = []
        if recent['accuracy'].iloc[-1] < recent['accuracy'].mean() - recent['accuracy'].std() * 2:
            alerts.append({'severity': 'critical', 'message': f"Accuracy dropped to {recent['accuracy'].iloc[-1]:.3f}"})
        if recent['latency_p99'].iloc[-1] > recent['latency_p99'].mean() + recent['latency_p99'].std() * 2:
            alerts.append({'severity': 'high', 'message': f"P99 latency spiked to {recent['latency_p99'].iloc[-1]:.0f}ms"})
        if recent['error_rate'].iloc[-1] > 0.01:
            alerts.append({'severity': 'critical', 'message': f"Error rate at {recent['error_rate'].iloc[-1]*100:.1f}%"})
        return alerts
```

## Example 9: Hyperparameter Tuning at Scale

```python
import optuna
from optuna.samplers import TPESampler
from optuna.pruners import MedianPruner
import xgboost as xgb
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import cross_val_score
import numpy as np

class XGBoostTuner:
    def __init__(self, X_train, y_train, X_val, y_val, n_trials=100):
        self.X_train = X_train
        self.y_train = y_train
        self.X_val = X_val
        self.y_val = y_val
        self.n_trials = n_trials
        self.study = None

    def objective(self, trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 100, 1000, step=100),
            'max_depth': trial.suggest_int('max_depth', 3, 12),
            'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
            'subsample': trial.suggest_float('subsample', 0.5, 1.0),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.3, 1.0),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
            'gamma': trial.suggest_float('gamma', 0, 5),
            'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
            'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
            'scale_pos_weight': trial.suggest_float('scale_pos_weight', 1, 10),
        }

        model = xgb.XGBClassifier(**params, use_label_encoder=False, eval_metric='auc', random_state=42)
        model.fit(self.X_train, self.y_train, eval_set=[(self.X_val, self.y_val)], verbose=False)

        val_preds = model.predict_proba(self.X_val)[:, 1]
        auc = roc_auc_score(self.y_val, val_preds)

        return auc

    def tune(self):
        sampler = TPESampler(seed=42)
        pruner = MedianPruner(n_startup_trials=10, n_warmup_steps=20)
        self.study = optuna.create_study(direction='maximize', sampler=sampler, pruner=pruner, study_name='xgb_tuning')
        self.study.optimize(self.objective, n_trials=self.n_trials, show_progress_bar=True)
        return self.study.best_params, self.study.best_value

    def get_best_model(self):
        best_params, _ = self.tune()
        model = xgb.XGBClassifier(**best_params, use_label_encoder=False, eval_metric='auc', random_state=42)
        model.fit(self.X_train, self.y_train)
        return model, best_params

    def plot_optimization_history(self):
        import plotly.graph_objects as go
        fig = go.Figure()
        trials = self.study.trials
        fig.add_trace(go.Scatter(x=list(range(len(trials))), y=[t.value for t in trials], mode='markers', name='AUC per trial'))
        best_values = [max(trials[j].value for j in range(i+1)) for i in range(len(trials))]
        fig.add_trace(go.Scatter(x=list(range(len(trials))), y=best_values, mode='lines', name='Best AUC'))
        fig.update_layout(title='HPO Optimization History', xaxis_title='Trial', yaxis_title='AUC')
        return fig
```

## Example 10: Feature Pipeline with Validation

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from great_expectations.dataset import PandasDataset
import great_expectations as ge

class FeaturePipeline:
    def __init__(self, feature_store, expected_schema):
        self.feature_store = feature_store
        self.expected_schema = expected_schema
        self.quality_metrics = []

    def extract(self, source_path, date):
        df = pd.read_parquet(f"{source_path}/{date.strftime('%Y/%m/%d')}/")
        self.log_quality('extract', len(df), df.memory_usage(deep=True).sum())
        return df

    def validate(self, df):
        ds = PandasDataset(df)
        expectations = []
        for col, col_type in self.expected_schema.items():
            if col_type == 'int':
                expectations.append(ds.expect_column_values_to_be_of_type(col, 'int64'))
            elif col_type == 'float':
                expectations.append(ds.expect_column_values_to_be_of_type(col, 'float64'))
            elif col_type == 'str':
                expectations.append(ds.expect_column_values_to_be_of_type(col, 'object'))
        expectations.append(ds.expect_column_values_to_not_be_null(list(self.expected_schema.keys())))
        results = [e.success for e in expectations]
        validation_passed = all(results)
        if not validation_passed:
            failed = [e.expectation_config.expectation_type for e in expectations if not e.success]
            raise ValueError(f"Schema validation failed: {failed}")
        self.log_quality('validate', len(df), 0)
        return validation_passed

    def transform(self, df):
        df = df.copy()
        df['event_timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['event_timestamp'].dt.hour
        df['day_of_week'] = df['event_timestamp'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        for col in df.select_dtypes(include=[np.number]).columns:
            df[col] = df[col].fillna(df[col].median())
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].fillna('unknown')
        self.log_quality('transform', len(df), df.memory_usage(deep=True).sum())
        return df

    def load(self, df, output_path):
        df.to_parquet(output_path)
        self.feature_store.materialize(datetime.now() - timedelta(days=1), datetime.now())
        self.log_quality('load', len(df), 0)
        return output_path

    def log_quality(self, stage, row_count, memory_bytes):
        self.quality_metrics.append({'stage': stage, 'row_count': row_count, 'memory_bytes': memory_bytes, 'timestamp': datetime.now()})

    def get_quality_report(self):
        return pd.DataFrame(self.quality_metrics)

    def run(self, source_path, output_path, date):
        df = self.extract(source_path, date)
        self.validate(df)
        df = self.transform(df)
        self.load(df, output_path)
        return df
```

## Example 11: Ensemble Model Serving

```python
import numpy as np
from typing import List, Dict, Callable
import mlflow.pyfunc

class EnsembleModel:
    def __init__(self, models: List[Dict], weights: List[float] = None, aggregation: str = 'weighted_average'):
        self.models = models
        self.weights = weights if weights else [1.0 / len(models)] * len(models)
        self.aggregation = aggregation

    def predict(self, features):
        predictions = []
        for model_config in self.models:
            model = mlflow.pyfunc.load_model(model_config['uri'])
            pred = model.predict(features)
            predictions.append(pred)
        predictions = np.array(predictions)
        if self.aggregation == 'weighted_average':
            weights = np.array(self.weights).reshape(-1, 1)
            ensemble_pred = np.average(predictions, axis=0, weights=weights.flatten())
        elif self.aggregation == 'majority_vote':
            ensemble_pred = np.apply_along_axis(lambda x: np.bincount(x.astype(int)).argmax(), axis=0, arr=predictions)
        elif self.aggregation == 'median':
            ensemble_pred = np.median(predictions, axis=0)
        elif self.aggregation == 'max_confidence':
            ensemble_pred = np.max(predictions, axis=0)
        else:
            ensemble_pred = np.mean(predictions, axis=0)
        return ensemble_pred

    def predict_proba(self, features):
        all_probas = []
        for model_config in self.models:
            model = mlflow.pyfunc.load_model(model_config['uri'])
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(features)
            else:
                proba = model.predict(features)
            all_probas.append(proba)
        weights = np.array(self.weights).reshape(-1, 1, 1)
        ensemble_proba = np.average(np.array(all_probas), axis=0, weights=weights.flatten())
        return ensemble_proba

    def get_model_contributions(self, features):
        predictions = []
        for i, model_config in enumerate(self.models):
            model = mlflow.pyfunc.load_model(model_config['uri'])
            pred = model.predict(features)
            predictions.append({'model': model_config['name'], 'prediction': float(pred[0]), 'weight': self.weights[i]})
        return sorted(predictions, key=lambda x: x['weight'], reverse=True)
```

## Example 12: ML Pipeline Orchestration with Airflow

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.models import Variable
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

default_args = {
    'owner': 'ml-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'ml_training_pipeline',
    default_args=default_args,
    description='End-to-end ML training pipeline',
    schedule_interval='0 2 * * *',
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['ml', 'training'],
)

def extract_features(**context):
    execution_date = context['execution_date']
    source_path = f"s3://data/raw/{execution_date.strftime('%Y/%m/%d')}/"
    df = pd.read_parquet(source_path)
    output_path = f"/tmp/features/{execution_date.strftime('%Y%m%d')}.parquet"
    df.to_parquet(output_path)
    context['ti'].xcom_push(key='feature_path', value=output_path)
    context['ti'].xcom_push(key='num_rows', value=len(df))
    return output_path

def train_model(**context):
    import mlflow
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score
    feature_path = context['ti'].xcom_pull(task_ids='extract_features', key='feature_path')
    df = pd.read_parquet(feature_path)
    X = df.drop('target', axis=1)
    y = df['target']
    split_idx = int(len(df) * 0.8)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    with mlflow.start_run() as run:
        model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
        model.fit(X_train, y_train)
        train_acc = accuracy_score(y_train, model.predict(X_train))
        val_acc = accuracy_score(y_val, model.predict(X_val))
        mlflow.log_params({'n_estimators': 200, 'max_depth': 10})
        mlflow.log_metrics({'train_accuracy': train_acc, 'val_accuracy': val_acc})
        mlflow.sklearn.log_model(model, "model")
        context['ti'].xcom_push(key='run_id', value=run.info.run_id)
    return run.info.run_id

def evaluate_model(**context):
    import mlflow
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
    run_id = context['ti'].xcom_pull(task_ids='train_model', key='run_id')
    model = mlflow.sklearn.load_model(f"runs:/{run_id}/model")
    feature_path = context['ti'].xcom_pull(task_ids='extract_features', key='feature_path')
    df = pd.read_parquet(feature_path)
    split_idx = int(len(df) * 0.8)
    X_test, y_test = df.drop('target', axis=1).iloc[split_idx:], df['target'].iloc[split_idx:]
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    metrics = {'accuracy': accuracy_score(y_test, preds), 'precision': precision_score(y_test, preds), 'recall': recall_score(y_test, preds), 'f1': f1_score(y_test, preds), 'auc_roc': roc_auc_score(y_test, probs)}
    with mlflow.start_run(run_id=run_id):
        mlflow.log_metrics(metrics)
    context['ti'].xcom_push(key='metrics', value=metrics)
    return metrics

def register_model(**context):
    import mlflow
    from mlflow.tracking.client import MlflowClient
    run_id = context['ti'].xcom_pull(task_ids='train_model', key='run_id')
    metrics = context['ti'].xcom_pull(task_ids='evaluate_model', key='metrics')
    client = MlflowClient()
    if metrics.get('auc_roc', 0) > 0.85:
        model_uri = f"runs:/{run_id}/model"
        registered = mlflow.register_model(model_uri, "production_model")
        client.transition_model_version_stage("production_model", registered.version, "Staging")
        return f"Model v{registered.version} registered in Staging"
    else:
        return f"Model rejected: AUC {metrics.get('auc_roc', 0):.3f} < 0.85"

extract = PythonOperator(task_id='extract_features', python_callable=extract_features, provide_context=True, dag=dag)
train = PythonOperator(task_id='train_model', python_callable=train_model, provide_context=True, dag=dag)
evaluate = PythonOperator(task_id='evaluate_model', python_callable=evaluate_model, provide_context=True, dag=dag)
register = PythonOperator(task_id='register_model', python_callable=register_model, provide_context=True, dag=dag)

extract >> train >> evaluate >> register
```

## Example 13: Multi-Stage Transfer Learning

```python
import torch
import torch.nn as nn
import torchvision.models as models
from torch.utils.data import DataLoader, Dataset

class TransferLearningPipeline:
    def __init__(self, num_classes_initial=1000, num_classes_target=10):
        self.base_model = models.resnet50(pretrained=True)
        self.num_classes_target = num_classes_target

    def stage1_feature_extraction(self, freeze_layers=True):
        if freeze_layers:
            for param in self.base_model.parameters():
                param.requires_grad = False
        self.base_model.fc = nn.Identity()
        return self.base_model

    def stage2_fine_tune_classifier(self, train_loader, val_loader, epochs=10):
        backbone = self.stage1_feature_extraction(freeze_layers=True)
        classifier = nn.Linear(2048, self.num_classes_target)
        model = nn.Sequential(backbone, classifier)
        optimizer = torch.optim.Adam(classifier.parameters(), lr=1e-3)
        criterion = nn.CrossEntropyLoss()
        for epoch in range(epochs):
            model.train()
            for inputs, labels in train_loader:
                inputs, labels = inputs.cuda(), labels.cuda()
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

    def stage3_full_fine_tune(self, train_loader, val_loader, epochs=20):
        backbone = self.stage1_feature_extraction(freeze_layers=False)
        classifier = nn.Linear(2048, self.num_classes_target)
        model = nn.Sequential(backbone, classifier)
        model = model.cuda()
        optimizer = torch.optim.AdamW([
            {'params': backbone.parameters(), 'lr': 1e-5},
            {'params': classifier.parameters(), 'lr': 1e-3},
        ], weight_decay=0.01)
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
        criterion = nn.CrossEntropyLoss()
        best_val_acc = 0
        for epoch in range(epochs):
            model.train()
            train_loss = 0
            for inputs, labels in train_loader:
                inputs, labels = inputs.cuda(), labels.cuda()
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
            scheduler.step()
            model.eval()
            correct, total = 0, 0
            with torch.no_grad():
                for inputs, labels in val_loader:
                    inputs, labels = inputs.cuda(), labels.cuda()
                    outputs = model(inputs)
                    _, predicted = torch.max(outputs, 1)
                    total += labels.size(0)
                    correct += (predicted == labels).sum().item()
            val_acc = correct / total
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                torch.save(model.state_dict(), 'best_transfer_model.pt')
            print(f"Epoch {epoch}: Train Loss {train_loss/len(train_loader):.4f}, Val Acc {val_acc:.4f}")
        return model
```

## Example 14: End-to-End ML Pipeline with Ray

```python
import ray
from ray import serve
from ray.serve import Deployment
from ray.train import ScalingConfig
from ray.train.torch import TorchTrainer
from ray.data import from_pandas
from fastapi import FastAPI
import pandas as pd
import numpy as np

app = FastAPI()

@serve.deployment
@serve.ingress(app)
class MLService:
    def __init__(self, model_uri):
        import mlflow.pyfunc
        self.model = mlflow.pyfunc.load_model(model_uri)

    @app.post("/predict")
    async def predict(self, request: dict):
        features = np.array(request['features']).reshape(1, -1)
        prediction = self.model.predict(features)[0]
        return {"prediction": float(prediction)}

@ray.remote(num_gpus=1)
class DistributedTrainer:
    def train(self, data_ref, config):
        import mlflow
        import torch
        import torch.nn as nn
        from torch.utils.data import DataLoader, TensorDataset
        df = ray.get(data_ref)
        X = torch.tensor(df.drop('target', axis=1).values, dtype=torch.float32)
        y = torch.tensor(df['target'].values, dtype=torch.long)
        dataset = TensorDataset(X, y)
        loader = DataLoader(dataset, batch_size=config['batch_size'], shuffle=True)
        model = nn.Sequential(
            nn.Linear(X.shape[1], 256), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.1),
            nn.Linear(128, 2),
        )
        model = model.cuda()
        optimizer = torch.optim.Adam(model.parameters(), lr=config['lr'])
        criterion = nn.CrossEntropyLoss()
        with mlflow.start_run() as run:
            for epoch in range(config['epochs']):
                for batch_X, batch_y in loader:
                    batch_X, batch_y = batch_X.cuda(), batch_y.cuda()
                    optimizer.zero_grad()
                    outputs = model(batch_X)
                    loss = criterion(outputs, batch_y)
                    loss.backward()
                    optimizer.step()
                mlflow.log_metric('train_loss', loss.item(), step=epoch)
            mlflow.pytorch.log_model(model, "model")
        return run.info.run_id

# Usage
ray.init()
data = pd.read_parquet("s3://data/training/latest.parquet")
data_ref = ray.put(data)
trainer = DistributedTrainer.remote()
run_id = ray.get(trainer.train.remote(data_ref, {'batch_size': 256, 'lr': 1e-3, 'epochs': 50}))
```

## Example 15: Cost Analysis for ML

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class MLCostAnalyzer:
    def __init__(self):
        self.costs = {
            'compute': {'cpu_c5_4x': 0.68, 'gpu_t4': 0.35, 'gpu_v100': 2.48, 'gpu_a100': 4.00},
            'storage': {'s3_standard': 0.023, 's3_infrequent': 0.0125, 'ebs_gp3': 0.08},
            'api': {'gpt4': 0.06, 'gpt35': 0.002, 'claude3': 0.015},
        }

    def analyze_training_cost(self, gpu_type, num_gpus, hours, spot=False):
        cost_per_hour = self.costs['compute'][gpu_type]
        total = num_gpus * hours * cost_per_hour
        if spot:
            total *= 0.3
        return {'gpu_type': gpu_type, 'num_gpus': num_gpus, 'hours': hours, 'cost_per_hour': cost_per_hour, 'total_cost': round(total, 2), 'spot_savings': round(total * 0.7, 2) if spot else 0}

    def analyze_inference_cost(self, model, requests_per_day, tokens_per_request):
        cost_per_1k = self.costs['api'].get(model, 0.002)
        daily_tokens = requests_per_day * tokens_per_request
        daily_cost = (daily_tokens / 1000) * cost_per_1k
        return {'model': model, 'requests_per_day': requests_per_day, 'daily_cost': round(daily_cost, 2), 'monthly_cost': round(daily_cost * 30, 2), 'yearly_cost': round(daily_cost * 365, 2)}

    def compare_deployment_options(self, model_size_mb, requests_per_sec, latency_ms_sla):
        options = [
            {'name': 'CPU Only', 'cost_per_hour': 0.68, 'max_qps': 50, 'latency_ms': 200},
            {'name': 'GPU T4', 'cost_per_hour': 0.35, 'max_qps': 200, 'latency_ms': 50},
            {'name': 'GPU A100', 'cost_per_hour': 4.00, 'max_qps': 1000, 'latency_ms': 20},
        ]
        results = []
        for opt in options:
            instances_needed = max(1, int(np.ceil(requests_per_sec / opt['max_qps'])))
            hourly_cost = instances_needed * opt['cost_per_hour']
            meets_sla = opt['latency_ms'] <= latency_ms_sla
            results.append({**opt, 'instances_needed': instances_needed, 'hourly_cost': round(hourly_cost, 2), 'monthly_cost': round(hourly_cost * 730, 2), 'meets_sla': meets_sla})
        return results

    def storage_cost(self, data_size_gb, storage_class='s3_standard', months=12):
        monthly = data_size_gb * self.costs['storage'][storage_class]
        return {'storage_class': storage_class, 'data_size_gb': data_size_gb, 'monthly_cost': round(monthly, 2), 'yearly_cost': round(monthly * 12, 2)}

    def total_cost_of_ownership(self, components):
        total = sum(c.get('cost', 0) for c in components)
        breakdown = pd.DataFrame(components)
        return {'total_monthly': round(total, 2), 'total_yearly': round(total * 12, 2), 'breakdown': breakdown}
```




---

# P9: Additional Worked Examples

## Example 16: Multi-Task Learning

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiTaskModel(nn.Module):
    def __init__(self, input_dim, shared_dim=256, task_specific_dim=64):
        super().__init__()
        self.shared_encoder = nn.Sequential(
            nn.Linear(input_dim, shared_dim),
            nn.BatchNorm1d(shared_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(shared_dim, shared_dim // 2),
            nn.ReLU(),
        )
        self.task_a_head = nn.Sequential(
            nn.Linear(shared_dim // 2, task_specific_dim),
            nn.ReLU(),
            nn.Linear(task_specific_dim, 2),  # Classification
        )
        self.task_b_head = nn.Sequential(
            nn.Linear(shared_dim // 2, task_specific_dim),
            nn.ReLU(),
            nn.Linear(task_specific_dim, 1),  # Regression
        )
        self.task_c_head = nn.Sequential(
            nn.Linear(shared_dim // 2, task_specific_dim),
            nn.ReLU(),
            nn.Linear(task_specific_dim, 5),  # Multi-class classification
        )

    def forward(self, x, tasks=None):
        shared = self.shared_encoder(x)
        outputs = {}
        if tasks is None or 'task_a' in tasks:
            outputs['task_a'] = self.task_a_head(shared)
        if tasks is None or 'task_b' in tasks:
            outputs['task_b'] = self.task_b_head(shared)
        if tasks is None or 'task_c' in tasks:
            outputs['task_c'] = self.task_c_head(shared)
        return outputs

class MultiTaskTrainer:
    def __init__(self, model, task_weights=None):
        self.model = model
        self.task_weights = task_weights or {'task_a': 1.0, 'task_b': 0.5, 'task_c': 1.0}
        self.criteria = {
            'task_a': nn.CrossEntropyLoss(),
            'task_b': nn.MSELoss(),
            'task_c': nn.CrossEntropyLoss(),
        }

    def train_epoch(self, loader, optimizer):
        self.model.train()
        total_loss = 0
        task_losses = {k: 0 for k in self.task_weights}
        for batch in loader:
            x = batch['features'].cuda()
            optimizer.zero_grad()
            outputs = self.model(x)
            loss = 0
            for task_name, weight in self.task_weights.items():
                task_output = outputs[task_name]
                task_target = batch[task_name].cuda()
                task_loss = self.criteria[task_name](task_output, task_target)
                loss += weight * task_loss
                task_losses[task_name] += task_loss.item()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        n = len(loader)
        return {'total_loss': total_loss / n, **{f'{k}_loss': v / n for k, v in task_losses.items()}}

class UncertaintyWeightedMultiTaskLoss(nn.Module):
    def __init__(self, num_tasks):
        super().__init__()
        self.log_variances = nn.Parameter(torch.zeros(num_tasks))

    def forward(self, losses):
        total_loss = 0
        for i, loss in enumerate(losses):
            precision = torch.exp(-self.log_variances[i])
            total_loss += precision * loss + self.log_variances[i] / 2
        return total_loss
```

## Example 17: Graph Neural Network for Recommendation

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, SAGEConv, GATConv, global_mean_pool

class GNNRecommender(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=64, hidden_dim=32):
        super().__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        self.conv1 = GCNConv(embedding_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.conv3 = GCNConv(hidden_dim, embedding_dim)

    def forward(self, edge_index, edge_weight=None):
        x = torch.cat([self.user_embedding.weight, self.item_embedding.weight], dim=0)
        x = self.conv1(x, edge_index, edge_weight)
        x = F.relu(x)
        x = F.dropout(x, p=0.2, training=self.training)
        x = self.conv2(x, edge_index, edge_weight)
        x = F.relu(x)
        x = self.conv3(x, edge_index, edge_weight)
        return x

    def predict(self, user_ids, item_ids, edge_index):
        embeddings = self.forward(edge_index)
        num_users = self.user_embedding.num_embeddings
        user_emb = embeddings[user_ids]
        item_emb = embeddings[num_users + item_ids]
        scores = (user_emb * item_emb).sum(dim=1)
        return scores

class LightGCN(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=64, num_layers=3):
        super().__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        self.num_layers = num_layers

    def forward(self, edge_index):
        user_emb = self.user_embedding.weight
        item_emb = self.item_embedding.weight
        all_emb = torch.cat([user_emb, item_emb], dim=0)
        embs = [all_emb]
        for _ in range(self.num_layers):
            all_emb = self._propagate(all_emb, edge_index)
            embs.append(all_emb)
        embs = torch.stack(embs, dim=1)
        final_emb = embs.mean(dim=1)
        return final_emb

    def _propagate(self, x, edge_index):
        from torch_scatter import scatter_add
        row, col = edge_index
        deg = scatter_add(torch.ones_like(col), col, dim=0, dim_size=x.size(0))
        deg_inv_sqrt = deg.pow(-0.5)
        deg_inv_sqrt[deg_inv_sqrt == float('inf')] = 0
        norm = deg_inv_sqrt[row] * deg_inv_sqrt[col]
        x_j = x[col] * norm.unsqueeze(1)
        out = scatter_add(x_j, row, dim=0, dim_size=x.size(0))
        return out

    def predict(self, user_ids, item_ids, edge_index):
        embeddings = self.forward(edge_index)
        num_users = self.user_embedding.num_embeddings
        user_emb = embeddings[user_ids]
        item_emb = embeddings[num_users + item_ids]
        return (user_emb * item_emb).sum(dim=1)

def bpr_loss(positive_scores, negative_scores):
    return -F.logsigmoid(positive_scores - negative_scores).mean()

def train_gnn_recommender(model, train_loader, edge_index, epochs=50, lr=1e-3):
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    for epoch in range(epochs):
        total_loss = 0
        for users, pos_items, neg_items in train_loader:
            optimizer.zero_grad()
            pos_scores = model.predict(users, pos_items, edge_index)
            neg_scores = model.predict(users, neg_items, edge_index)
            loss = bpr_loss(pos_scores, neg_scores)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch}: Loss {total_loss/len(train_loader):.4f}")
```

## Example 18: Active Learning Pipeline

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from modAL.models import ActiveLearner
from modAL.uncertainty import uncertainty_sampling, margin_sampling, entropy_sampling
from typing import List, Tuple, Callable

class ActiveLearningPipeline:
    def __init__(self, X_initial, y_initial, X_pool, estimator=None, query_strategy='uncertainty'):
        self.X_pool = X_pool.copy()
        self.pool_idx = np.arange(len(X_pool))
        self.query_strategies = {
            'uncertainty': uncertainty_sampling,
            'margin': margin_sampling,
            'entropy': entropy_sampling,
        }
        strategy = self.query_strategies.get(query_strategy, uncertainty_sampling)
        if estimator is None:
            estimator = RandomForestClassifier(n_estimators=100, random_state=42)
        self.learner = ActiveLearner(estimator=estimator, X_training=X_initial, y_training=y_initial, query_strategy=strategy)
        self.performance_history = []

    def query(self, n_instances=10):
        query_idx, query_instance = self.learner.query(self.X_pool, n_instances=n_instances)
        actual_indices = self.pool_idx[query_idx]
        return actual_indices, query_instance

    def teach(self, query_idx, y_new):
        self.learner.teach(self.X_pool[query_idx], y_new)
        self.X_pool = np.delete(self.X_pool, query_idx, axis=0)
        self.pool_idx = np.delete(self.pool_idx, query_idx)

    def evaluate(self, X_test, y_test):
        accuracy = self.learner.score(X_test, y_test)
        self.performance_history.append(accuracy)
        return accuracy

    def run_round(self, X_test, y_test, n_queries=10):
        query_idx, query_instance = self.query(n_queries)
        print(f"Queried {len(query_idx)} instances")
        return query_idx, query_instance

    def simulate(self, X_test, y_test, budget=100, queries_per_round=10):
        total_queried = 0
        results = []
        while total_queried < budget:
            n = min(queries_per_round, budget - total_queried)
            query_idx, _ = self.query(n)
            y_new = self._oracle(query_idx)
            self.teach(query_idx, y_new)
            accuracy = self.evaluate(X_test, y_test)
            total_queried += n
            results.append({'round': len(results) + 1, 'queried': total_queried, 'accuracy': accuracy})
        return results

    def _oracle(self, indices):
        return self.y_pool[indices]

    def get_uncertainties(self, X=None):
        if X is None:
            X = self.X_pool
        predictions = self.learner.predict_proba(X)
        uncertainties = 1 - np.max(predictions, axis=1)
        return uncertainties

    def plot_learning_curve(self):
        import matplotlib.pyplot as plt
        plt.figure(figsize=(10, 6))
        rounds = [r['round'] for r in self.performance_history]
        accuracies = [r['accuracy'] for r in self.performance_history]
        plt.plot(rounds, accuracies, marker='o', linewidth=2)
        plt.xlabel('Query Round')
        plt.ylabel('Test Accuracy')
        plt.title('Active Learning Performance')
        plt.grid(True)
        return plt.gcf()
```

## Example 19: Model Compression Pipeline

```python
import torch
import torch.nn as nn
import torch.nn.utils.prune as prune
import copy

class ModelCompressor:
    def __init__(self, model, config=None):
        self.original_model = model
        self.config = config or {}
        self.compressed_model = None

    def prune_magnitude(self, amount=0.3):
        model = copy.deepcopy(self.original_model)
        parameters_to_prune = []
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear) or isinstance(module, nn.Conv2d):
                parameters_to_prune.append((module, 'weight'))
        prune.global_unstructured(
            parameters_to_prune,
            pruning_method=prune.L1Unstructured,
            amount=amount,
        )
        for module, name in parameters_to_prune:
            prune.remove(module, name)
        return model

    def prune_structured(self, amount=0.2, dim=0):
        model = copy.deepcopy(self.original_model)
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear):
                prune.ln_structured(module, name='weight', amount=amount, n=2, dim=dim)
                prune.remove(module, 'weight')
        return model

    def quantize_dynamic(self, dtype=torch.qint8):
        return torch.quantization.quantize_dynamic(
            self.original_model,
            {nn.Linear, nn.LSTM, nn.GRU, nn.Embedding},
            dtype=dtype,
        )

    def quantize_static(self, calibration_loader):
        model = copy.deepcopy(self.original_model)
        model.eval()
        model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
        torch.quantization.prepare(model, inplace=True)
        with torch.no_grad():
            for batch in calibration_loader:
                if isinstance(batch, (list, tuple)):
                    model(batch[0])
                else:
                    model(batch)
        torch.quantization.convert(model, inplace=True)
        return model

    def knowledge_distillation(self, student_model, teacher_model, train_loader, val_loader, config):
        optimizer = torch.optim.Adam(student_model.parameters(), lr=config.get('lr', 1e-3))
        temperature = config.get('temperature', 4.0)
        alpha = config.get('alpha', 0.7)
        epochs = config.get('epochs', 50)
        teacher_model.eval()
        for epoch in range(epochs):
            student_model.train()
            for batch in train_loader:
                inputs, targets = batch
                inputs, targets = inputs.cuda(), targets.cuda()
                optimizer.zero_grad()
                with torch.no_grad():
                    teacher_outputs = teacher_model(inputs)
                student_outputs = student_model(inputs)
                soft_teacher = F.softmax(teacher_outputs / temperature, dim=1)
                soft_student = F.log_softmax(student_outputs / temperature, dim=1)
                hard_loss = F.cross_entropy(student_outputs, targets)
                soft_loss = F.kl_div(soft_student, soft_teacher, reduction='batchmean') * (temperature ** 2)
                loss = alpha * soft_loss + (1 - alpha) * hard_loss
                loss.backward()
                optimizer.step()
        return student_model

    def compare_models(self, test_loader):
        self.original_model.eval()
        self.compressed_model.eval()
        metrics = {'original': {}, 'compressed': {}}
        original_size = self._get_model_size(self.original_model)
        compressed_size = self._get_model_size(self.compressed_model)
        metrics['original']['size_mb'] = original_size
        metrics['compressed']['size_mb'] = compressed_size
        metrics['compression_ratio'] = compressed_size / original_size
        correct_orig, correct_comp, total = 0, 0, 0
        with torch.no_grad():
            for inputs, targets in test_loader:
                inputs, targets = inputs.cuda(), targets.cuda()
                orig_out = self.original_model(inputs)
                comp_out = self.compressed_model(inputs)
                _, orig_pred = torch.max(orig_out, 1)
                _, comp_pred = torch.max(comp_out, 1)
                correct_orig += (orig_pred == targets).sum().item()
                correct_comp += (comp_pred == targets).sum().item()
                total += targets.size(0)
        metrics['original']['accuracy'] = correct_orig / total
        metrics['compressed']['accuracy'] = correct_comp / total
        metrics['accuracy_drop'] = metrics['original']['accuracy'] - metrics['compressed']['accuracy']
        return metrics

    def _get_model_size(self, model):
        param_size = sum(p.numel() * p.element_size() for p in model.parameters())
        buffer_size = sum(b.numel() * b.element_size() for b in model.buffers())
        return (param_size + buffer_size) / (1024 ** 2)

    def compress(self, methods=['prune', 'quantize', 'distill'], prune_amount=0.3, quantize_dtype=torch.qint8):
        model = self.original_model
        for method in methods:
            if method == 'prune':
                model = self.prune_magnitude(amount=prune_amount)
            elif method == 'quantize':
                model = self.quantize_dynamic(dtype=quantize_dtype)
            elif method == 'distill':
                student = self._create_student_model()
                model = self.knowledge_distillation(student, model, None, None, {})
        self.compressed_model = model
        return model

    def _create_student_model(self, width_mult=0.5):
        class StudentModel(nn.Module):
            def __init__(self, teacher, width_mult):
                super().__init__()
                self.features = nn.Sequential(
                    nn.Linear(teacher.features[0].in_features, int(teacher.features[0].out_features * width_mult)),
                    nn.ReLU(),
                    nn.Linear(int(teacher.features[0].out_features * width_mult), int(teacher.classifier[0].in_features * width_mult)),
                    nn.ReLU(),
                    nn.Linear(int(teacher.classifier[0].in_features * width_mult), teacher.classifier[-1].out_features),
                )
            def forward(self, x):
                return self.features(x)
        return StudentModel(self.original_model, width_mult)
```

## Example 20: Reinforcement Learning Inference

```python
import gym
import numpy as np
import torch
import torch.nn as nn

class PolicyNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim),
        )

    def forward(self, state):
        return self.network(state)

    def get_action(self, state, deterministic=True):
        logits = self.forward(state)
        if deterministic:
            return torch.argmax(logits, dim=-1).item()
        probs = F.softmax(logits, dim=-1)
        return torch.multinomial(probs, 1).item()

class ValueNetwork(nn.Module):
    def __init__(self, state_dim, hidden_dim=256):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )

    def forward(self, state):
        return self.network(state)

class RLInferenceServer:
    def __init__(self, policy_model_path, state_dim, action_dim):
        self.policy = PolicyNetwork(state_dim, action_dim)
        self.policy.load_state_dict(torch.load(policy_model_path))
        self.policy.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.policy.to(self.device)
        self.state_normalizer = None

    def predict(self, state):
        if self.state_normalizer:
            state = self.state_normalizer(state)
        state_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            action = self.policy.get_action(state_tensor, deterministic=True)
        return {'action': int(action), 'action_name': self._action_to_name(action)}

    def predict_with_confidence(self, state):
        if self.state_normalizer:
            state = self.state_normalizer(state)
        state_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.policy(state_tensor)
            probs = F.softmax(logits, dim=1).squeeze(0)
            action = torch.argmax(probs).item()
        return {'action': int(action), 'action_name': self._action_to_name(action), 'probabilities': {f'action_{i}': float(p) for i, p in enumerate(probs)}}

    def _action_to_name(self, action):
        return f'action_{action}'

    def benchmark(self, num_steps=1000):
        state = np.random.randn(self.policy.network[0].in_features)
        latencies = []
        for _ in range(num_steps):
            import time
            start = time.time()
            self.predict(state)
            latencies.append((time.time() - start) * 1000)
        return {'mean_latency_ms': float(np.mean(latencies)), 'p50_ms': float(np.median(latencies)), 'p95_ms': float(np.percentile(latencies, 95)), 'p99_ms': float(np.percentile(latencies, 99))}

class SimulatedEnvironment:
    def __init__(self, env_name='CartPole-v1'):
        self.env = gym.make(env_name)
        self.state_dim = self.env.observation_space.shape[0]
        self.action_dim = self.env.action_space.n

    def run_episode(self, policy, render=False, max_steps=1000):
        state, _ = self.env.reset()
        total_reward = 0
        done = False
        step = 0
        while not done and step < max_steps:
            if render:
                self.env.render()
            action = policy.get_action(torch.FloatTensor(state).unsqueeze(0), deterministic=True)
            next_state, reward, terminated, truncated, _ = self.env.step(action)
            done = terminated or truncated
            total_reward += reward
            state = next_state
            step += 1
        return {'total_reward': total_reward, 'steps': step, 'success': total_reward >= 200}
```

## Example 21: Batch Processing with Ray

```python
import ray
import pandas as pd
import numpy as np
from typing import List, Dict

@ray.remote
class BatchPredictor:
    def __init__(self, model_uri):
        import mlflow.pyfunc
        self.model = mlflow.pyfunc.load_model(model_uri)

    def predict_batch(self, data_batch):
        predictions = self.model.predict(data_batch)
        probabilities = self.model.predict_proba(data_batch) if hasattr(self.model, 'predict_proba') else None
        return {'predictions': predictions.tolist(), 'probabilities': probabilities.tolist() if probabilities is not None else None}

@ray.remote
class BatchTransformer:
    def __init__(self, scaler_path):
        import joblib
        self.scaler = joblib.load(scaler_path)

    def transform(self, data_batch):
        return self.scaler.transform(data_batch)

class DistributedBatchPipeline:
    def __init__(self, model_uri, num_workers=4):
        ray.init(ignore_reinit_error=True)
        self.workers = [BatchPredictor.remote(model_uri) for _ in range(num_workers)]
        self.num_workers = num_workers

    def process_in_batches(self, data: np.ndarray, batch_size: int = 1000):
        num_batches = int(np.ceil(len(data) / batch_size))
        batches = [data[i * batch_size:(i + 1) * batch_size] for i in range(num_batches)]
        futures = []
        for i, batch in enumerate(batches):
            worker = self.workers[i % self.num_workers]
            futures.append(worker.predict_batch.remote(batch))
        results = ray.get(futures)
        all_predictions = []
        all_probabilities = []
        for r in results:
            all_predictions.extend(r['predictions'])
            if r['probabilities']:
                all_probabilities.extend(r['probabilities'])
        return {'predictions': np.array(all_predictions), 'probabilities': np.array(all_probabilities) if all_probabilities else None}

    def shutdown(self):
        ray.shutdown()

@ray.remote
class DataProcessor:
    def process(self, partition_path):
        df = pd.read_parquet(partition_path)
        df['processed_at'] = pd.Timestamp.now()
        df['feature_sum'] = df.select_dtypes(include=[np.number]).sum(axis=1)
        df['feature_mean'] = df.select_dtypes(include=[np.number]).mean(axis=1)
        return df

class DistributedFeatureEngineering:
    def __init__(self, num_workers=8):
        self.num_workers = num_workers
        ray.init(ignore_reinit_error=True)

    def process_partitions(self, partition_paths):
        processors = [DataProcessor.remote() for _ in range(self.num_workers)]
        futures = []
        for i, path in enumerate(partition_paths):
            processor = processors[i % self.num_workers]
            futures.append(processor.process.remote(path))
        results = ray.get(futures)
        return pd.concat(results, ignore_index=True)

    def shutdown(self):
        ray.shutdown()
```

## Example 22: MLOps CI/CD Pipeline Implementation

```python
import yaml
import json
import subprocess
from datetime import datetime
from typing import Dict, List

class MLOpsPipeline:
    def __init__(self, config_path='mlops_config.yaml'):
        with open(config_path) as f:
            self.config = yaml.safe_load(f)
        self.pipeline_status = {'stages': [], 'current_stage': None, 'started_at': datetime.now().isoformat()}

    def run_stage(self, stage_name, command):
        self.pipeline_status['current_stage'] = stage_name
        print(f"Running stage: {stage_name}")
        stage_start = datetime.now()
        try:
            result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
            duration = (datetime.now() - stage_start).total_seconds()
            stage_result = {'stage': stage_name, 'status': 'passed', 'duration_seconds': duration, 'output': result.stdout[-500:]}
            self.pipeline_status['stages'].append(stage_result)
            print(f"Stage {stage_name} passed ({duration:.1f}s)")
            return True
        except subprocess.CalledProcessError as e:
            duration = (datetime.now() - stage_start).total_seconds()
            stage_result = {'stage': stage_name, 'status': 'failed', 'duration_seconds': duration, 'error': e.stderr[-500:]}
            self.pipeline_status['stages'].append(stage_result)
            print(f"Stage {stage_name} FAILED: {e.stderr[:200]}")
            return False

    def run_ci_pipeline(self):
        stages = self.config.get('ci_stages', [])
        for stage in stages:
            success = self.run_stage(stage['name'], stage['command'])
            if not success and stage.get('blocking', True):
                print(f"Pipeline aborted at stage: {stage['name']}")
                self.pipeline_status['overall_status'] = 'failed'
                return False
        self.pipeline_status['overall_status'] = 'passed'
        self.pipeline_status['completed_at'] = datetime.now().isoformat()
        return True

    def validate_metrics(self, metrics: Dict, thresholds: Dict) -> Dict:
        failures = {}
        for metric, value in metrics.items():
            threshold = thresholds.get(metric)
            if threshold:
                if isinstance(threshold, dict):
                    operator = threshold.get('operator', '>=')
                    target = threshold.get('value', 0)
                    if operator == '>=' and value < target:
                        failures[metric] = {'value': value, 'threshold': target, 'operator': operator}
                    elif operator == '<=' and value > target:
                        failures[metric] = {'value': value, 'threshold': target, 'operator': operator}
                else:
                    if value < threshold:
                        failures[metric] = {'value': value, 'threshold': threshold}
        return {'passed': len(failures) == 0, 'failures': failures, 'all_metrics': metrics}

    def automatic_model_promotion(self, run_id, model_name, stage='Production', min_metrics=None):
        import mlflow
        from mlflow.tracking.client import MlflowClient
        client = MlflowClient()
        if min_metrics:
            run = client.get_run(run_id)
            run_metrics = run.data.metrics
            validation = self.validate_metrics(run_metrics, min_metrics)
            if not validation['passed']:
                print(f"Model promotion blocked: {validation['failures']}")
                return {'promoted': False, 'reasons': validation['failures']}
        model_uri = f"runs:/{run_id}/model"
        registered = mlflow.register_model(model_uri, model_name)
        client.transition_model_version_stage(model_name, registered.version, stage)
        print(f"Model {model_name} v{registered.version} promoted to {stage}")
        return {'promoted': True, 'model_name': model_name, 'version': registered.version, 'stage': stage}

    def generate_pipeline_report(self):
        report = {
            'pipeline': self.config.get('name', 'unnamed'),
            'status': self.pipeline_status.get('overall_status', 'unknown'),
            'started_at': self.pipeline_status.get('started_at'),
            'completed_at': self.pipeline_status.get('completed_at'),
            'stages': self.pipeline_status.get('stages', []),
            'total_stages': len(self.pipeline_status.get('stages', [])),
            'passed_stages': sum(1 for s in self.pipeline_status.get('stages', []) if s['status'] == 'passed'),
            'failed_stages': sum(1 for s in self.pipeline_status.get('stages', []) if s['status'] == 'failed'),
            'total_duration_seconds': sum(s.get('duration_seconds', 0) for s in self.pipeline_status.get('stages', [])),
        }
        return report
```

## Example 23: Automated Hyperparameter Optimization

```python
import optuna
from optuna.visualization import plot_optimization_history, plot_param_importances, plot_parallel_coordinate
import xgboost as xgb
import lightgbm as lgb
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score, f1_score
import numpy as np
import pandas as pd

class AutoMLTuner:
    def __init__(self, X_train, y_train, X_val, y_val, task='classification', n_trials=100, timeout=3600):
        self.X_train = X_train
        self.y_train = y_train
        self.X_val = X_val
        self.y_val = y_val
        self.task = task
        self.n_trials = n_trials
        self.timeout = timeout
        self.studies = {}

    def tune_xgboost(self):
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 2000, step=100),
                'max_depth': trial.suggest_int('max_depth', 3, 15),
                'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
                'subsample': trial.suggest_float('subsample', 0.5, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.3, 1.0),
                'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
                'gamma': trial.suggest_float('gamma', 0, 5),
                'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
                'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
            }
            if self.task == 'classification':
                params['eval_metric'] = 'logloss'
                model = xgb.XGBClassifier(**params, use_label_encoder=False, random_state=42)
            else:
                model = xgb.XGBRegressor(**params, random_state=42)
            model.fit(self.X_train, self.y_train, eval_set=[(self.X_val, self.y_val)], verbose=False)
            preds = model.predict(self.X_val)
            if self.task == 'classification':
                return f1_score(self.y_val, preds, average='macro')
            else:
                from sklearn.metrics import mean_squared_error
                return -mean_squared_error(self.y_val, preds)

        study = optuna.create_study(direction='maximize', study_name='xgboost', sampler=optuna.samplers.TPESampler(seed=42))
        study.optimize(objective, n_trials=self.n_trials, timeout=self.timeout, show_progress_bar=True)
        self.studies['xgboost'] = study
        return study.best_params, study.best_value

    def tune_lightgbm(self):
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 2000, step=100),
                'max_depth': trial.suggest_int('max_depth', -1, 15),
                'num_leaves': trial.suggest_int('num_leaves', 16, 256),
                'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
                'subsample': trial.suggest_float('subsample', 0.5, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.3, 1.0),
                'min_child_samples': trial.suggest_int('min_child_samples', 5, 100),
                'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
                'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
            }
            if self.task == 'classification':
                model = lgb.LGBMClassifier(**params, random_state=42, verbose=-1)
            else:
                model = lgb.LGBMRegressor(**params, random_state=42, verbose=-1)
            model.fit(self.X_train, self.y_train, eval_set=[(self.X_val, self.y_val)], verbose=False)
            preds = model.predict(self.X_val)
            if self.task == 'classification':
                return f1_score(self.y_val, preds, average='macro')
            else:
                from sklearn.metrics import mean_squared_error
                return -mean_squared_error(self.y_val, preds)

        study = optuna.create_study(direction='maximize', study_name='lightgbm', sampler=optuna.samplers.TPESampler(seed=42))
        study.optimize(objective, n_trials=self.n_trials, timeout=self.timeout, show_progress_bar=True)
        self.studies['lightgbm'] = study
        return study.best_params, study.best_value

    def tune_random_forest(self):
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 50, 500, step=50),
                'max_depth': trial.suggest_int('max_depth', 3, 20),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'max_features': trial.suggest_float('max_features', 0.3, 1.0),
            }
            from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
            if self.task == 'classification':
                model = RandomForestClassifier(**params, random_state=42, n_jobs=-1)
            else:
                model = RandomForestRegressor(**params, random_state=42, n_jobs=-1)
            scores = cross_val_score(model, self.X_train, self.y_train, cv=3, scoring='f1_macro' if self.task == 'classification' else 'neg_mean_squared_error')
            return scores.mean()

        study = optuna.create_study(direction='maximize', study_name='random_forest', sampler=optuna.samplers.TPESampler(seed=42))
        study.optimize(objective, n_trials=self.n_trials // 2, timeout=self.timeout, show_progress_bar=True)
        self.studies['random_forest'] = study
        return study.best_params, study.best_value

    def compare_algorithms(self):
        results = {}
        for algo_name in ['xgboost', 'lightgbm', 'random_forest']:
            try:
                if algo_name == 'xgboost':
                    params, score = self.tune_xgboost()
                elif algo_name == 'lightgbm':
                    params, score = self.tune_lightgbm()
                else:
                    params, score = self.tune_random_forest()
                results[algo_name] = {'best_score': score, 'best_params': params, 'n_trials': self.n_trials}
            except Exception as e:
                results[algo_name] = {'error': str(e)}
        return results

    def plot_results(self):
        import plotly.graph_objects as go
        from plotly.subplots import make_subplots
        figs = []
        for name, study in self.studies.items():
            if study and len(study.trials) > 0:
                fig = go.Figure()
                trials = study.trials
                values = [t.value for t in trials if t.value is not None]
                fig.add_trace(go.Scatter(x=list(range(len(values))), y=values, mode='markers', name=f'{name} trials'))
                best_so_far = [max(values[:i+1]) for i in range(len(values))]
                fig.add_trace(go.Scatter(x=list(range(len(values))), y=best_so_far, mode='lines', name='Best so far'))
                fig.update_layout(title=f'{name} Optimization History', xaxis_title='Trial', yaxis_title='Objective')
                figs.append(fig)
        return figs
```

## Example 24: Model Serving with Batching and Caching

```python
import asyncio
import time
import numpy as np
from collections import deque
from typing import List, Dict, Callable, Optional
import hashlib
import json
import threading

class BatchedInferenceServer:
    def __init__(self, model, max_batch_size=32, max_wait_ms=10):
        self.model = model
        self.max_batch_size = max_batch_size
        self.max_wait_ms = max_wait_ms
        self.queue = deque()
        self.lock = threading.Lock()
        self.batch_event = threading.Event()
        self.running = True
        self.batch_thread = threading.Thread(target=self._batch_processor, daemon=True)
        self.batch_thread.start()
        self.cache = {}

    def predict(self, features):
        result_event = threading.Event()
        result_container = [None]
        with self.lock:
            self.queue.append((features, result_container, result_event))
            if len(self.queue) >= self.max_batch_size:
                self.batch_event.set()
        result_event.wait()
        return result_container[0]

    def _batch_processor(self):
        while self.running:
            self.batch_event.wait(timeout=self.max_wait_ms / 1000.0)
            self.batch_event.clear()
            batch = []
            events = []
            with self.lock:
                while self.queue and len(batch) < self.max_batch_size:
                    features, result_container, result_event = self.queue.popleft()
                    batch.append(features)
                    events.append((result_container, result_event))
            if not batch:
                continue
            batch_array = np.array(batch)
            predictions = self.model.predict(batch_array)
            for i, (result_container, result_event) in enumerate(events):
                result_container[0] = predictions[i]
                result_event.set()

    async def predict_async(self, features):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.predict, features)

    def close(self):
        self.running = False

class CachedInferenceServer:
    def __init__(self, model, cache_size=10000, ttl_seconds=3600):
        self.model = model
        self.cache = {}
        self.cache_ttl = {}
        self.cache_size = cache_size
        self.ttl = ttl_seconds
        self.hits = 0
        self.misses = 0

    def _make_key(self, features):
        if isinstance(features, np.ndarray):
            features = features.tolist()
        key = hashlib.sha256(json.dumps(features, sort_keys=True).encode()).hexdigest()
        return key

    def predict(self, features):
        key = self._make_key(features)
        if key in self.cache:
            age = time.time() - self.cache_ttl[key]
            if age < self.ttl:
                self.hits += 1
                return self.cache[key]
            else:
                del self.cache[key]
                del self.cache_ttl[key]
        self.misses += 1
        prediction = self.model.predict(np.array(features).reshape(1, -1))[0]
        if len(self.cache) >= self.cache_size:
            oldest_key = min(self.cache_ttl, key=self.cache_ttl.get)
            del self.cache[oldest_key]
            del self.cache_ttl[oldest_key]
        self.cache[key] = prediction
        self.cache_ttl[key] = time.time()
        return prediction

    def get_stats(self):
        total = self.hits + self.misses
        return {
            'cache_size': len(self.cache),
            'hits': self.hits,
            'misses': self.misses,
            'hit_rate': self.hits / total if total > 0 else 0,
            'cache_usage_pct': len(self.cache) / self.cache_size * 100,
        }

    def invalidate(self, features=None):
        if features:
            key = self._make_key(features)
            self.cache.pop(key, None)
            self.cache_ttl.pop(key, None)
        else:
            self.cache.clear()
            self.cache_ttl.clear()
```

## Example 25: Automated Drift Response System

```python
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable
import logging

logger = logging.getLogger(__name__)

class DriftResponseSystem:
    def __init__(self, model_name, retraining_pipeline, alerting_service):
        self.model_name = model_name
        self.retraining_pipeline = retraining_pipeline
        self.alerting_service = alerting_service
        self.drift_history = []
        self.response_actions = {
            'low': self._handle_low_drift,
            'medium': self._handle_medium_drift,
            'high': self._handle_high_drift,
            'critical': self._handle_critical_drift,
        }

    def analyze_and_respond(self, drift_results: Dict, current_metrics: Dict = None):
        severity = self._compute_severity(drift_results, current_metrics)
        drift_summary = {
            'timestamp': datetime.now().isoformat(),
            'model': self.model_name,
            'severity': severity,
            'drift_results': drift_results,
            'metrics': current_metrics,
        }
        self.drift_history.append(drift_summary)
        response = self.response_actions[severity](drift_summary)
        return {'severity': severity, **response}

    def _compute_severity(self, drift_results, current_metrics=None):
        num_drifted = sum(1 for v in drift_results.values() if isinstance(v, dict) and v.get('drift', False))
        total_features = len(drift_results)
        drift_rate = num_drifted / max(total_features, 1)
        if drift_rate > 0.5:
            return 'critical'
        elif drift_rate > 0.3:
            return 'high'
        elif drift_rate > 0.15:
            return 'medium'
        else:
            return 'low'

    def _handle_low_drift(self, summary):
        logger.info(f"Low drift detected for {self.model_name}. Logging only.")
        return {'action': 'logged', 'message': 'Drift below threshold, monitoring continues.'}

    def _handle_medium_drift(self, summary):
        logger.warning(f"Medium drift detected for {self.model_name}. Alerting team.")
        self.alerting_service.send_alert(
            severity='warning',
            message=f"Medium drift detected for {self.model_name}. {summary.get('drift_results', {})}",
        )
        return {'action': 'alerted', 'message': 'Team notified of medium drift.'}

    def _handle_high_drift(self, summary):
        logger.error(f"High drift detected for {self.model_name}. Triggering retraining.")
        self.alerting_service.send_alert(
            severity='high',
            message=f"High drift detected for {self.model_name}. Triggering retraining.",
        )
        retraining_result = self.retraining_pipeline.trigger_retraining(reason='high_data_drift')
        return {'action': 'retraining_triggered', 'retraining_result': retraining_result, 'message': 'Retraining initiated due to high drift.'}

    def _handle_critical_drift(self, summary):
        logger.critical(f"Critical drift detected for {self.model_name}. Rolling back and alerting.")
        self.alerting_service.send_alert(
            severity='critical',
            message=f"Critical drift detected for {self.model_name}. Initiating rollback and retraining.",
        )
        rollback_result = self._rollback_model()
        retraining_result = self.retraining_pipeline.trigger_retraining(reason='critical_data_drift')
        return {'action': 'rollback_and_retrain', 'rollback_result': rollback_result, 'retraining_result': retraining_result, 'message': 'Rollback to previous model. Retraining initiated.'}

    def _rollback_model(self):
        from mlflow.tracking.client import MlflowClient
        client = MlflowClient()
        versions = client.get_latest_versions(self.model_name, stages=["Production"])
        if versions:
            current = versions[0]
            client.transition_model_version_stage(self.model_name, current.version, "Archived")
            previous_versions = client.get_latest_versions(self.model_name, stages=["Staging"])
            if previous_versions:
                prev = previous_versions[0]
                client.transition_model_version_stage(self.model_name, prev.version, "Production")
                return {'rolled_back_to': prev.version, 'status': 'success'}
        return {'status': 'failed', 'message': 'No previous version to rollback to'}

    def get_drift_report(self):
        return pd.DataFrame(self.drift_history)
```

## Example 26: Custom Loss Functions

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class FocalLoss(nn.Module):
    def __init__(self, alpha=1, gamma=2, reduction='mean'):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.reduction = reduction

    def forward(self, inputs, targets):
        ce_loss = F.cross_entropy(inputs, targets, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = self.alpha * (1 - pt) ** self.gamma * ce_loss
        if self.reduction == 'mean':
            return focal_loss.mean()
        elif self.reduction == 'sum':
            return focal_loss.sum()
        return focal_loss

class LabelSmoothingCrossEntropy(nn.Module):
    def __init__(self, smoothing=0.1):
        super().__init__()
        self.smoothing = smoothing

    def forward(self, inputs, targets):
        log_probs = F.log_softmax(inputs, dim=-1)
        nll_loss = -log_probs.gather(dim=-1, index=targets.unsqueeze(1))
        nll_loss = nll_loss.squeeze(1)
        smooth_loss = -log_probs.mean(dim=-1)
        loss = (1 - self.smoothing) * nll_loss + self.smoothing * smooth_loss
        return loss.mean()

class WeightedBCELoss(nn.Module):
    def __init__(self, pos_weight=None):
        super().__init__()
        self.pos_weight = pos_weight

    def forward(self, inputs, targets):
        loss = F.binary_cross_entropy_with_logits(inputs, targets, pos_weight=self.pos_weight)
        return loss

class ContrastiveLoss(nn.Module):
    def __init__(self, margin=1.0):
        super().__init__()
        self.margin = margin

    def forward(self, output1, output2, label):
        euclidean_distance = F.pairwise_distance(output1, output2)
        loss_contrastive = torch.mean((1 - label) * torch.pow(euclidean_distance, 2) +
                                      label * torch.pow(torch.clamp(self.margin - euclidean_distance, min=0.0), 2))
        return loss_contrastive

class TripletLoss(nn.Module):
    def __init__(self, margin=1.0):
        super().__init__()
        self.margin = margin

    def forward(self, anchor, positive, negative):
        pos_dist = F.pairwise_distance(anchor, positive)
        neg_dist = F.pairwise_distance(anchor, negative)
        losses = F.relu(pos_dist - neg_dist + self.margin)
        return losses.mean()

class QuantileLoss(nn.Module):
    def __init__(self, quantiles=[0.1, 0.5, 0.9]):
        super().__init__()
        self.quantiles = quantiles

    def forward(self, preds, targets):
        if not isinstance(preds, list):
            preds = [preds]
        losses = []
        for i, q in enumerate(self.quantiles):
            errors = targets - preds[i]
            losses.append(torch.mean(torch.max(q * errors, (q - 1) * errors)))
        return torch.mean(torch.stack(losses))

class SymmetricMeanAbsolutePercentageError(nn.Module):
    def forward(self, inputs, targets):
        return torch.mean(2 * torch.abs(targets - inputs) / (torch.abs(targets) + torch.abs(inputs) + 1e-8))

class HuberLossWithRegularization(nn.Module):
    def __init__(self, delta=1.0, l1_lambda=0.01, l2_lambda=0.01):
        super().__init__()
        self.huber = nn.HuberLoss(delta=delta)
        self.l1_lambda = l1_lambda
        self.l2_lambda = l2_lambda

    def forward(self, inputs, targets, model=None):
        huber_loss = self.huber(inputs, targets)
        reg_loss = 0
        if model is not None:
            for param in model.parameters():
                reg_loss += self.l1_lambda * torch.norm(param, 1) + self.l2_lambda * torch.norm(param, 2)
        return huber_loss + reg_loss
```

## Example 27: Feature Importance and Selection

```python
import numpy as np
import pandas as pd
from sklearn.feature_selection import SelectKBest, mutual_info_classif, chi2, f_classif, RFE, RFECV
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import StratifiedKFold
from typing import List, Dict, Tuple
import matplotlib.pyplot as plt

class FeatureSelector:
    def __init__(self, feature_names: List[str], task: str = 'classification'):
        self.feature_names = feature_names
        self.task = task
        self.selected_features = None
        self.importances = None

    def mutual_information(self, X, y, k=50):
        selector = SelectKBest(score_func=mutual_info_classif, k=k)
        selector.fit(X, y)
        scores = selector.scores_
        selected = [self.feature_names[i] for i in selector.get_support(indices=True)]
        return {'scores': dict(zip(self.feature_names, scores)), 'selected': selected, 'selected_indices': selector.get_support(indices=True)}

    def random_forest_importance(self, X, y, n_estimators=200):
        if self.task == 'classification':
            model = RandomForestClassifier(n_estimators=n_estimators, random_state=42, n_jobs=-1)
        else:
            model = RandomForestRegressor(n_estimators=n_estimators, random_state=42, n_jobs=-1)
        model.fit(X, y)
        importances = model.feature_importances_
        sorted_idx = np.argsort(importances)[::-1]
        return {'importances': {self.feature_names[i]: float(importances[i]) for i in sorted_idx}, 'top_features': [self.feature_names[i] for i in sorted_idx[:k]]}

    def recursive_feature_elimination(self, X, y, n_features_to_select=20):
        if self.task == 'classification':
            estimator = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        else:
            estimator = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
        selector = RFE(estimator, n_features_to_select=n_features_to_select, step=10)
        selector.fit(X, y)
        selected = [self.feature_names[i] for i in range(len(self.feature_names)) if selector.support_[i]]
        ranking = {self.feature_names[i]: int(selector.ranking_[i]) for i in range(len(self.feature_names))}
        return {'selected': selected, 'ranking': ranking, 'n_features': n_features_to_select}

    def recursive_feature_elimination_cv(self, X, y, min_features=10):
        if self.task == 'classification':
            estimator = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
            cv = StratifiedKFold(5)
        else:
            estimator = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
            cv = 5
        selector = RFECV(estimator, step=5, cv=cv, min_features_to_select=min_features, n_jobs=-1)
        selector.fit(X, y)
        selected = [self.feature_names[i] for i in range(len(self.feature_names)) if selector.support_[i]]
        return {'selected': selected, 'n_features': len(selected), 'cv_scores': selector.cv_results_['mean_test_score'].tolist(), 'optimal_n_features': selector.n_features_}

    def permutation_importance(self, X, y, model, n_repeats=10):
        from sklearn.inspection import permutation_importance
        result = permutation_importance(model, X, y, n_repeats=n_repeats, random_state=42, n_jobs=-1)
        importances = {self.feature_names[i]: {'importance': result.importances_mean[i], 'std': result.importances_std[i]} for i in range(len(self.feature_names))}
        sorted_features = sorted(importances.items(), key=lambda x: x[1]['importance'], reverse=True)
        return {'importances': importances, 'top_features': [f[0] for f in sorted_features[:20]]}

    def correlation_analysis(self, X, threshold=0.95):
        corr_matrix = np.corrcoef(X.T)
        upper = np.triu(corr_matrix, k=1)
        to_drop = [self.feature_names[i] for i in range(len(self.feature_names)) if any(upper[i] > threshold)]
        return {'highly_correlated_pairs': [(self.feature_names[i], self.feature_names[j], float(corr_matrix[i, j])) for i in range(len(self.feature_names)) for j in range(i + 1, len(self.feature_names)) if abs(corr_matrix[i, j]) > threshold], 'features_to_drop': to_drop}

    def plot_importance(self, top_n=20):
        if not self.importances:
            return None
        sorted_items = sorted(self.importances.items(), key=lambda x: x[1], reverse=True)[:top_n]
        features, scores = zip(*sorted_items)
        plt.figure(figsize=(10, 8))
        plt.barh(range(len(features)), scores)
        plt.yticks(range(len(features)), features)
        plt.xlabel('Importance')
        plt.title(f'Top {top_n} Feature Importances')
        plt.gca().invert_yaxis()
        plt.tight_layout()
        return plt.gcf()
```

## Example 28: ML Service Health Check

```python
import requests
import time
import json
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
from typing import Dict, List, Optional

class MLServiceHealthCheck:
    def __init__(self, service_url: str, model_name: str, endpoints: List[str] = None):
        self.service_url = service_url
        self.model_name = model_name
        self.endpoints = endpoints or ['/health', '/predict', '/metrics']
        self.health_history = []
        self.consecutive_failures = 0
        self.max_consecutive_failures = 3

    def check_endpoint(self, endpoint: str) -> Dict:
        url = f"{self.service_url}{endpoint}"
        start = time.time()
        try:
            if endpoint == '/predict':
                response = requests.post(url, json={'features': [0.0] * 10}, timeout=5)
            else:
                response = requests.get(url, timeout=5)
            latency = (time.time() - start) * 1000
            return {
                'endpoint': endpoint,
                'status': 'healthy' if response.status_code == 200 else 'degraded',
                'status_code': response.status_code,
                'latency_ms': round(latency, 2),
                'response_size': len(response.content),
                'timestamp': datetime.now().isoformat(),
            }
        except Exception as e:
            latency = (time.time() - start) * 1000
            return {
                'endpoint': endpoint,
                'status': 'down',
                'error': str(e),
                'latency_ms': round(latency, 2),
                'timestamp': datetime.now().isoformat(),
            }

    def run_health_check(self) -> Dict:
        results = {}
        overall_status = 'healthy'
        for endpoint in self.endpoints:
            result = self.check_endpoint(endpoint)
            results[endpoint] = result
            if result['status'] == 'down':
                overall_status = 'down'
            elif result['status'] == 'degraded' and overall_status != 'down':
                overall_status = 'degraded'
        health_report = {
            'model': self.model_name,
            'service_url': self.service_url,
            'overall_status': overall_status,
            'timestamp': datetime.now().isoformat(),
            'endpoints': results,
            'response_time_ok': all(r['latency_ms'] < 500 for r in results.values() if 'latency_ms' in r),
        }
        self.health_history.append(health_report)
        if overall_status == 'down':
            self.consecutive_failures += 1
        else:
            self.consecutive_failures = 0
        if self.consecutive_failures >= self.max_consecutive_failures:
            self._send_alert(health_report)
        return health_report

    def _send_alert(self, report):
        print(f"ALERT: Service {self.model_name} is DOWN. Consecutive failures: {self.consecutive_failures}")
        print(json.dumps(report, indent=2))

    def get_uptime_percentage(self, since_hours=24) -> float:
        cutoff = datetime.now().timestamp() - since_hours * 3600
        recent = [h for h in self.health_history if datetime.fromisoformat(h['timestamp']).timestamp() > cutoff]
        if not recent:
            return 100.0
        healthy = sum(1 for h in recent if h['overall_status'] == 'healthy')
        return (healthy / len(recent)) * 100

    def check_model_accuracy(self, test_data_path: str, expected_accuracy: float) -> bool:
        import mlflow
        import pandas as pd
        from sklearn.metrics import accuracy_score
        model = mlflow.pyfunc.load_model(f"models:/{self.model_name}/latest")
        df = pd.read_parquet(test_data_path)
        X, y = df.drop('target', axis=1), df['target']
        predictions = model.predict(X)
        accuracy = accuracy_score(y, predictions)
        return {'model': self.model_name, 'accuracy': accuracy, 'expected': expected_accuracy, 'passing': accuracy >= expected_accuracy}

    def comprehensive_health_report(self) -> Dict:
        endpoint_results = {}
        for endpoint in self.endpoints:
            results = [h['endpoints'].get(endpoint, {}) for h in self.health_history[-10:] if endpoint in h.get('endpoints', {})]
            if results:
                latencies = [r.get('latency_ms', 0) for r in results if 'latency_ms' in r]
                endpoint_results[endpoint] = {
                    'avg_latency_ms': sum(latencies) / len(latencies) if latencies else 0,
                    'max_latency_ms': max(latencies) if latencies else 0,
                    'healthy_count': sum(1 for r in results if r.get('status') == 'healthy'),
                    'total_checks': len(results),
                }
        return {
            'model': self.model_name,
            'uptime_24h': self.get_uptime_percentage(24),
            'uptime_7d': self.get_uptime_percentage(168),
            'total_checks': len(self.health_history),
            'endpoints': endpoint_results,
            'consecutive_failures': self.consecutive_failures,
        }
```

## Example 29: Efficient Data Loading Pipeline

```python
import torch
from torch.utils.data import Dataset, DataLoader, IterableDataset
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Iterator
import pyarrow.parquet as pq
import os

class ParquetDataset(Dataset):
    def __init__(self, parquet_paths: List[str], feature_columns: List[str], target_column: str, cache_size: int = 10):
        self.paths = parquet_paths
        self.feature_columns = feature_columns
        self.target_column = target_column
        self.cache = {}
        self.cache_size = cache_size
        self._compute_lengths()

    def _compute_lengths(self):
        self.file_lengths = []
        self.cumulative_lengths = [0]
        for path in self.paths:
            pf = pq.ParquetFile(path)
            length = pf.metadata.num_rows
            self.file_lengths.append(length)
            self.cumulative_lengths.append(self.cumulative_lengths[-1] + length)

    def _get_file_and_index(self, idx):
        for i in range(len(self.file_lengths)):
            if idx < self.cumulative_lengths[i + 1]:
                file_idx = i
                row_idx = idx - self.cumulative_lengths[i]
                return file_idx, row_idx
        raise IndexError(f"Index {idx} out of bounds")

    def _load_file(self, file_idx):
        if file_idx in self.cache:
            return self.cache[file_idx]
        df = pd.read_parquet(self.paths[file_idx], columns=self.feature_columns + [self.target_column])
        if len(self.cache) >= self.cache_size:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[file_idx] = df
        return df

    def __len__(self):
        return self.cumulative_lengths[-1]

    def __getitem__(self, idx):
        file_idx, row_idx = self._get_file_and_index(idx)
        df = self._load_file(file_idx)
        row = df.iloc[row_idx]
        features = torch.tensor(row[self.feature_columns].values.astype(np.float32))
        target = torch.tensor(row[self.target_column], dtype=torch.long)
        return {'features': features, 'target': target}

class StreamingParquetDataset(IterableDataset):
    def __init__(self, parquet_paths, feature_columns, target_column, shuffle=True, shuffle_buffer=10000):
        self.paths = parquet_paths
        self.feature_columns = feature_columns
        self.target_column = target_column
        self.shuffle = shuffle
        self.shuffle_buffer = shuffle_buffer

    def __iter__(self) -> Iterator[Dict]:
        buffer = []
        for path in self.paths:
            pf = pq.ParquetFile(path)
            for batch in pf.iter_batches(batch_size=1024, columns=self.feature_columns + [self.target_column]):
                df = batch.to_pandas()
                for _, row in df.iterrows():
                    features = torch.tensor(row[self.feature_columns].values.astype(np.float32))
                    target = torch.tensor(row[self.target_column], dtype=torch.long)
                    buffer.append({'features': features, 'target': target})
                    if len(buffer) >= self.shuffle_buffer:
                        if self.shuffle:
                            np.random.shuffle(buffer)
                        yield from buffer
                        buffer = []
        if buffer:
            if self.shuffle:
                np.random.shuffle(buffer)
            yield from buffer

class PrefetchDataLoader:
    def __init__(self, dataset, batch_size=32, num_workers=4, prefetch_factor=2, pin_memory=True):
        self.loader = DataLoader(
            dataset,
            batch_size=batch_size,
            num_workers=num_workers,
            prefetch_factor=prefetch_factor,
            pin_memory=pin_memory,
            persistent_workers=True if num_workers > 0 else False,
        )

    def __iter__(self):
        return iter(self.loader)

    def __len__(self):
        return len(self.loader)

class DataPipeline:
    def __init__(self, config: Dict):
        self.config = config
        self.train_loader = None
        self.val_loader = None
        self.test_loader = None

    def build(self):
        train_dataset = ParquetDataset(
            self.config['train_paths'],
            self.config['feature_columns'],
            self.config['target_column'],
        )
        val_dataset = ParquetDataset(
            self.config['val_paths'],
            self.config['feature_columns'],
            self.config['target_column'],
        )
        self.train_loader = PrefetchDataLoader(
            train_dataset,
            batch_size=self.config.get('batch_size', 32),
            num_workers=self.config.get('num_workers', 4),
        )
        self.val_loader = DataLoader(
            val_dataset,
            batch_size=self.config.get('batch_size', 32),
            shuffle=False,
            num_workers=self.config.get('num_workers', 2),
        )
        return self

    def get_batch(self):
        return next(iter(self.train_loader))
```

## Example 30: A/B Test Statistical Analysis

```python
import numpy as np
from scipy import stats
from scipy.stats import beta as beta_dist
from typing import Dict, List, Tuple, Optional
import math

class ABTestAnalyzer:
    def __init__(self, confidence_level=0.95, minimum_effect=0.01):
        self.confidence_level = confidence_level
        self.minimum_effect = minimum_effect
        self.z_score = stats.norm.ppf(1 - (1 - confidence_level) / 2)

    def analyze_proportions(self, control_events, control_total, treatment_events, treatment_total) -> Dict:
        p_control = control_events / control_total
        p_treatment = treatment_events / treatment_total
        p_pooled = (control_events + treatment_events) / (control_total + treatment_total)
        se = math.sqrt(p_pooled * (1 - p_pooled) * (1 / control_total + 1 / treatment_total))
        z_stat = (p_treatment - p_control) / se if se > 0 else 0
        p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))
        ci_lower = (p_treatment - p_control) - self.z_score * se
        ci_upper = (p_treatment - p_control) + self.z_score * se
        lift = ((p_treatment / p_control) - 1) * 100 if p_control > 0 else 0
        return {
            'control_rate': float(p_control),
            'treatment_rate': float(p_treatment),
            'absolute_difference': float(p_treatment - p_control),
            'lift_pct': round(lift, 2),
            'z_statistic': float(z_stat),
            'p_value': float(p_value),
            'statistically_significant': p_value < (1 - self.confidence_level),
            'confidence_interval': [float(ci_lower), float(ci_upper)],
            'control_sample_size': control_total,
            'treatment_sample_size': treatment_total,
            'power': self._calculate_power(p_control, p_treatment, control_total, treatment_total),
        }

    def analyze_continuous(self, control_values, treatment_values) -> Dict:
        control_values = np.array(control_values)
        treatment_values = np.array(treatment_values)
        t_stat, p_value = stats.ttest_ind(treatment_values, control_values)
        mean_control = float(np.mean(control_values))
        mean_treatment = float(np.mean(treatment_values))
        std_control = float(np.std(control_values, ddof=1))
        std_treatment = float(np.std(treatment_values, ddof=1))
        se = math.sqrt(std_control**2 / len(control_values) + std_treatment**2 / len(treatment_values))
        ci_lower = (mean_treatment - mean_control) - self.z_score * se
        ci_upper = (mean_treatment - mean_control) + self.z_score * se
        lift = ((mean_treatment / mean_control) - 1) * 100 if mean_control > 0 else 0
        return {
            'control_mean': mean_control,
            'treatment_mean': mean_treatment,
            'control_std': std_control,
            'treatment_std': std_treatment,
            'absolute_difference': mean_treatment - mean_control,
            'lift_pct': round(lift, 2),
            'effect_size': float((mean_treatment - mean_control) / math.sqrt((std_control**2 + std_treatment**2) / 2)),
            't_statistic': float(t_stat),
            'p_value': float(p_value),
            'statistically_significant': p_value < (1 - self.confidence_level),
            'confidence_interval': [float(ci_lower), float(ci_upper)],
            'control_sample_size': len(control_values),
            'treatment_sample_size': len(treatment_values),
        }

    def bayesian_analysis(self, control_events, control_total, treatment_events, treatment_total, alpha_prior=1, beta_prior=1) -> Dict:
        alpha_control = alpha_prior + control_events
        beta_control = beta_prior + control_total - control_events
        alpha_treatment = alpha_prior + treatment_events
        beta_treatment = beta_prior + treatment_total - treatment_events
        control_samples = beta_dist.rvs(alpha_control, beta_control, size=100000)
        treatment_samples = beta_dist.rvs(alpha_treatment, beta_treatment, size=100000)
        prob_treatment_better = np.mean(treatment_samples > control_samples)
        expected_lift = np.mean((treatment_samples - control_samples) / control_samples) * 100
        return {
            'control_beta_params': {'alpha': int(alpha_control), 'beta': int(beta_control)},
            'treatment_beta_params': {'alpha': int(alpha_treatment), 'beta': int(beta_treatment)},
            'prob_treatment_better': float(prob_treatment_better),
            'expected_lift_pct': float(expected_lift),
            'credible_interval': [float(np.percentile(treatment_samples - control_samples, 2.5)), float(np.percentile(treatment_samples - control_samples, 97.5))],
        }

    def sequential_testing(self, control_events, control_total, treatment_events, treatment_total, max_samples=100000) -> Dict:
        from scipy.stats import norm
        n = control_total + treatment_total
        p_control = control_events / control_total if control_total > 0 else 0
        p_treatment = treatment_events / treatment_total if treatment_total > 0 else 0
        p_diff = p_treatment - p_control
        v = p_control * (1 - p_control) / control_total + p_treatment * (1 - p_treatment) / treatment_total
        z = p_diff / math.sqrt(v) if v > 0 else 0
        sequential_boundary = math.sqrt(2 * (1 / n) * math.log(1 / (1 - self.confidence_level)))
        return {
            'z_statistic': float(z),
            'sequential_boundary': float(sequential_boundary),
            'crossed_boundary': abs(z) > sequential_boundary,
            'is_conclusive': n >= max_samples or (abs(z) > sequential_boundary),
        }

    def sample_size_calculation(self, baseline_rate, minimum_detectable_effect, power=0.8) -> Dict:
        alpha = 1 - self.confidence_level
        z_alpha = stats.norm.ppf(1 - alpha / 2)
        z_beta = stats.norm.ppf(power)
        p1 = baseline_rate
        p2 = baseline_rate * (1 + minimum_detectable_effect)
        p_bar = (p1 + p2) / 2
        n = ((z_alpha * math.sqrt(2 * p_bar * (1 - p_bar)) + z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2) / ((p2 - p1) ** 2)
        return {
            'baseline_rate': baseline_rate,
            'treatment_rate': p2,
            'minimum_detectable_effect': minimum_detectable_effect,
            'sample_size_per_group': int(np.ceil(n)),
            'total_sample_size': int(np.ceil(n * 2)),
            'statistical_power': power,
            'alpha': alpha,
        }

    def _calculate_power(self, p1, p2, n1, n2):
        p_bar = (p1 * n1 + p2 * n2) / (n1 + n2)
        se = math.sqrt(p_bar * (1 - p_bar) * (1 / n1 + 1 / n2))
        effect = abs(p2 - p1)
        z_beta = effect / se - self.z_score
        return stats.norm.cdf(z_beta) if z_beta > -10 else 0
```


# P9: Additional Worked Examples (Continued)

## Example 31: Time-Aware Cross-Validation

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error
import xgboost as xgb

class TimeAwareValidator:
    def __init__(self, n_splits=5, gap=7):
        self.n_splits = n_splits
        self.gap = gap
        self.tscv = TimeSeriesSplit(n_splits=n_splits, gap=gap)

    def walk_forward_validate(self, df, date_col, feature_cols, target_col, model_params):
        df = df.sort_values(date_col).reset_index(drop=True)
        X = df[feature_cols].values
        y = df[target_col].values
        metrics = []
        for fold, (train_idx, val_idx) in enumerate(self.tscv.split(X)):
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            model = xgb.XGBRegressor(**model_params)
            model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
            preds = model.predict(X_val)
            fold_metrics = {
                'fold': fold,
                'mae': mean_absolute_error(y_val, preds),
                'rmse': np.sqrt(mean_squared_error(y_val, preds)),
                'train_size': len(train_idx),
                'val_size': len(val_idx),
                'val_start': df[date_col].iloc[val_idx[0]],
                'val_end': df[date_col].iloc[val_idx[-1]],
            }
            metrics.append(fold_metrics)
        return pd.DataFrame(metrics)

validator = TimeAwareValidator(n_splits=5, gap=14)
results = validator.walk_forward_validate(
    df=time_series_data,
    date_col='timestamp',
    feature_cols=['lag_1', 'lag_7', 'lag_30', 'rolling_avg_7', 'day_of_week', 'month'],
    target_col='value',
    model_params={'n_estimators': 300, 'max_depth': 8, 'learning_rate': 0.05, 'early_stopping_rounds': 20}
)
print(f"Mean MAE: {results['mae'].mean():.4f} +/- {results['mae'].std():.4f}")
print(f"Mean RMSE: {results['rmse'].mean():.4f} +/- {results['rmse'].std():.4f}")
```

## Example 32: SHAP-Based Feature Selection with Stability Selection

```python
import numpy as np
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

class ShapStabilitySelector:
    def __init__(self, n_folds=5, n_top_features=20, shap_threshold=0.01):
        self.n_folds = n_folds
        self.n_top_features = n_top_features
        self.shap_threshold = shap_threshold
        self.feature_importance_scores = {}
        self.selected_features = None

    def fit(self, X, y, feature_names):
        skf = StratifiedKFold(n_splits=self.n_folds, shuffle=True, random_state=42)
        fold_importances = {name: [] for name in feature_names}
        fold_scores = []
        for fold, (train_idx, val_idx) in enumerate(skf.split(X, y)):
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42 + fold)
            model.fit(X_train, y_train)
            val_score = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
            fold_scores.append(val_score)
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(X_val)
            if isinstance(shap_values, list):
                shap_values = shap_values[1]
            mean_shap = np.abs(shap_values).mean(axis=0)
            for idx, name in enumerate(feature_names):
                fold_importances[name].append(mean_shap[idx])
        stability_scores = {}
        for name in feature_names:
            scores = fold_importances[name]
            mean_score = np.mean(scores)
            std_score = np.std(scores)
            stability = 1.0 / (1.0 + std_score / (mean_score + 1e-8))
            stability_scores[name] = {'mean_importance': mean_score, 'std_importance': std_score, 'stability': stability}
        sorted_features = sorted(stability_scores.items(), key=lambda x: x[1]['mean_importance'], reverse=True)
        self.selected_features = [f[0] for f in sorted_features[:self.n_top_features] if f[1]['mean_importance'] > self.shap_threshold]
        self.feature_importance_scores = stability_scores
        return self.selected_features

selector = ShapStabilitySelector(n_folds=5, n_top_features=20)
selected = selector.fit(X.values, y.values, feature_cols)
print(f"Selected {len(selected)} features from {len(feature_cols)}")
print(f"Selected features: {selected}")
```

## Example 33: Quantile Regression for Uncertainty Estimation

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split

class QuantileRegressor:
    def __init__(self, alpha=0.05, n_estimators=300, max_depth=6):
        self.alpha = alpha
        self.lower_model = GradientBoostingRegressor(
            loss='quantile', alpha=alpha, n_estimators=n_estimators, max_depth=max_depth
        )
        self.median_model = GradientBoostingRegressor(
            loss='quantile', alpha=0.5, n_estimators=n_estimators, max_depth=max_depth
        )
        self.upper_model = GradientBoostingRegressor(
            loss='quantile', alpha=1.0 - alpha, n_estimators=n_estimators, max_depth=max_depth
        )

    def fit(self, X_train, y_train):
        self.lower_model.fit(X_train, y_train)
        self.median_model.fit(X_train, y_train)
        self.upper_model.fit(X_train, y_train)

    def predict(self, X, return_interval=True):
        lower = self.lower_model.predict(X)
        median = self.median_model.predict(X)
        upper = self.upper_model.predict(X)
        if return_interval:
            return median, lower, upper
        return median

    def coverage(self, X, y_true):
        _, lower, upper = self.predict(X)
        in_interval = np.sum((y_true >= lower) & (y_true <= upper))
        return in_interval / len(y_true)

    def interval_width(self, X):
        _, lower, upper = self.predict(X)
        return np.mean(upper - lower)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
qr = QuantileRegressor(alpha=0.05)
qr.fit(X_train, y_train)
median, lower, upper = qr.predict(X_test)
coverage = qr.coverage(X_test, y_test)
avg_width = qr.interval_width(X_test)
print(f"Prediction interval coverage: {coverage:.2%}")
print(f"Average interval width: {avg_width:.4f}")
print(f"Nominal coverage: 90% (alpha=0.05)")
```

## Example 34: Online Learning with River

```python
from river import linear_model, preprocessing, metrics, compose, feature_extraction
from river import stream
import pandas as pd
import numpy as np
from datetime import datetime

class OnlineLearningPipeline:
    def __init__(self):
        self.model = compose.Pipeline(
            preprocessing.StandardScaler(),
            linear_model.LogisticRegression()
        )
        self.metrics = {
            'accuracy': metrics.Accuracy(),
            'f1': metrics.F1(),
            'log_loss': metrics.LogLoss(),
            'precision': metrics.Precision(),
            'recall': metrics.Recall(),
        }
        self.history = []

    def train_and_evaluate(self, df, target_col, feature_cols):
        for i, (idx, row) in enumerate(df.iterrows()):
            x = {col: row[col] for col in feature_cols}
            y = row[target_col]
            y_pred = self.model.predict_one(x)
            y_proba = self.model.predict_proba_one(x)
            for metric in self.metrics.values():
                metric.update(y, y_pred)
            self.model.learn_one(x, y)
            if i % 1000 == 0:
                self.history.append({
                    'step': i,
                    'accuracy': self.metrics['accuracy'].get(),
                    'f1': self.metrics['f1'].get(),
                    'log_loss': self.metrics['log_loss'].get(),
                })
        return self.history

    def detect_drift(self, df, target_col, feature_cols, window_size=500):
        from river import drift
        adwin = drift.ADWIN()
        drift_points = []
        recent_errors = []
        for i, (idx, row) in enumerate(df.iterrows()):
            x = {col: row[col] for col in feature_cols}
            y = row[target_col]
            y_pred = self.model.predict_one(x)
            error = 1.0 if y_pred != y else 0.0
            adwin.update(error)
            recent_errors.append(error)
            if len(recent_errors) > window_size:
                recent_errors.pop(0)
            if adwin.drift_detected:
                drift_points.append({
                    'step': i,
                    'mean_error': np.mean(recent_errors),
                    'timestamp': idx if isinstance(idx, datetime) else None,
                })
        return drift_points

pipeline = OnlineLearningPipeline()
history = pipeline.train_and_evaluate(df, target_col='clicked', feature_cols=feature_cols)
drift_points = pipeline.detect_drift(df, target_col='clicked', feature_cols=feature_cols)
print(f"Final accuracy: {history[-1]['accuracy']:.4f}")
print(f"Drift events detected: {len(drift_points)}")
```

## Example 35: Automated Machine Learning with FLAML

```python
from flaml import AutoML
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib

class FlamlAutoPipeline:
    def __init__(self, task='classification', time_budget=300, max_iter=100):
        self.automl = AutoML()
        self.task = task
        self.time_budget = time_budget
        self.max_iter = max_iter
        self.best_model = None
        self.feature_importance = None

    def run(self, X_train, y_train, X_val=None, y_val=None, metric='roc_auc'):
        settings = {
            'time_budget': self.time_budget,
            'metric': metric,
            'task': self.task,
            'max_iter': self.max_iter,
            'early_stop': True,
            'n_jobs': -1,
            'log_type': 'best',
            'estimator_list': ['lgbm', 'xgboost', 'catboost', 'rf', 'extra_tree'],
        }
        if X_val is not None:
            settings['X_val'] = X_val
            settings['y_val'] = y_val
        self.automl.fit(X_train=X_train, y_train=y_train, **settings)
        self.best_model = self.automl.model.estimator
        return self

    def predict(self, X):
        return self.automl.predict(X)

    def predict_proba(self, X):
        return self.automl.predict_proba(X)

    def get_best_config(self):
        return {
            'best_estimator': self.automl.best_estimator,
            'best_config': self.automl.best_config_per_estimator,
            'best_loss': self.automl.best_loss,
            'training_duration': self.automl.time_to_find_best_model,
        }

    def get_feature_importance(self, feature_names):
        if hasattr(self.best_model, 'feature_importances_'):
            importances = self.best_model.feature_importances_
            return pd.DataFrame({'feature': feature_names, 'importance': importances}).sort_values('importance', ascending=False)
        return None

    def save(self, path):
        joblib.dump(self.automl, path)

    @staticmethod
    def load(path):
        automl = joblib.load(path)
        pipeline = FlamlAutoPipeline()
        pipeline.automl = automl
        pipeline.best_model = automl.model.estimator
        return pipeline

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
automl = FlamlAutoPipeline(task='classification', time_budget=120, max_iter=50)
automl.run(X_train, y_train, X_test, y_test, metric='f1')
config = automl.get_best_config()
print(f"Best estimator: {config['best_estimator']}")
print(f"Best loss: {config['best_loss']:.4f}")
print(f"Training duration: {config['training_duration']:.2f}s")
y_pred = automl.predict(X_test)
print(classification_report(y_test, y_pred))
```

## Example 36: Graph Neural Network for Node Classification

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, SAGEConv, GATConv
from torch_geometric.data import Data
from torch_geometric.loader import NeighborLoader

class GraphNeuralNetwork(nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels, num_layers=3, conv_type='gcn'):
        super().__init__()
        self.num_layers = num_layers
        self.convs = nn.ModuleList()
        conv_map = {'gcn': GCNConv, 'sage': SAGEConv, 'gat': GATConv}
        conv_cls = conv_map.get(conv_type, GCNConv)
        self.convs.append(conv_cls(in_channels, hidden_channels))
        for _ in range(num_layers - 2):
            self.convs.append(conv_cls(hidden_channels, hidden_channels))
        self.convs.append(conv_cls(hidden_channels, out_channels))
        self.dropout = nn.Dropout(0.3)
        self.norms = nn.ModuleList([nn.BatchNorm1d(hidden_channels) for _ in range(num_layers - 1)])

    def forward(self, x, edge_index):
        for i in range(self.num_layers - 1):
            x = self.convs[i](x, edge_index)
            if hasattr(self, 'norms') and i < len(self.norms):
                x = self.norms[i](x)
            x = F.relu(x)
            x = self.dropout(x)
        x = self.convs[-1](x, edge_index)
        return x

    def fit(self, data, train_mask, optimizer, epochs=200):
        self.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            out = self.forward(data.x, data.edge_index)
            loss = F.cross_entropy(out[train_mask], data.y[train_mask])
            loss.backward()
            optimizer.step()
            if epoch % 20 == 0:
                acc = self.evaluate(data, train_mask)
                print(f"Epoch {epoch}: Loss {loss.item():.4f}, Train Acc {acc:.4f}")

    def evaluate(self, data, mask):
        self.eval()
        with torch.no_grad():
            out = self.forward(data.x, data.edge_index)
            pred = out.argmax(dim=1)
            acc = (pred[mask] == data.y[mask]).float().mean()
        return acc.item()

    def predict(self, data, mask=None):
        self.eval()
        with torch.no_grad():
            out = self.forward(data.x, data.edge_index)
            probs = F.softmax(out, dim=1)
            if mask is not None:
                return probs[mask]
            return probs

data = Data(x=node_features, edge_index=edge_index, y=labels)
train_mask = torch.arange(1000)
model = GraphNeuralNetwork(in_channels=node_features.shape[1], hidden_channels=128, out_channels=10, conv_type='gcn')
optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)
model.fit(data, train_mask, optimizer, epochs=100)
```

## Example 37: Causal Inference with Double ML

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.model_selection import cross_val_predict
from sklearn.metrics import mean_squared_error

class DoubleML:
    def __init__(self, model_y=None, model_t=None, n_folds=5):
        self.model_y = model_y or GradientBoostingRegressor(n_estimators=200, max_depth=5)
        self.model_t = model_t or RandomForestClassifier(n_estimators=200, max_depth=5)
        self.n_folds = n_folds
        self.ate = None
        self.ate_se = None
        self.residuals_y = None
        self.residuals_t = None

    def fit(self, X, treatment, outcome):
        treatment_pred = cross_val_predict(self.model_t, X, treatment, cv=self.n_folds, method='predict_proba')
        if treatment_pred.ndim > 1:
            treatment_pred = treatment_pred[:, 1]
        outcome_pred = cross_val_predict(self.model_y, X, outcome, cv=self.n_folds)
        self.residuals_t = treatment - treatment_pred
        self.residuals_y = outcome - outcome_pred
        ate_model = LinearRegression()
        ate_model.fit(self.residuals_t.reshape(-1, 1), self.residuals_y)
        self.ate = ate_model.coef_[0]
        residuals = self.residuals_y - ate_model.predict(self.residuals_t.reshape(-1, 1))
        n = len(outcome)
        var_ate = np.sum(residuals**2) / (n * np.sum(self.residuals_t**2) / n)
        self.ate_se = np.sqrt(var_ate) / np.sqrt(n)
        n_effective = np.sum(self.residuals_t**2) / np.mean(self.residuals_t**2)
        return {'ate': self.ate, 'ate_se': self.ate_se, 'ate_z': self.ate / self.ate_se, 'n_effective': n_effective}

    def summary(self):
        z_stat = self.ate / self.ate_se
        p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))
        ci_lower = self.ate - 1.96 * self.ate_se
        ci_upper = self.ate + 1.96 * self.ate_se
        return pd.DataFrame({
            'Parameter': ['ATE'],
            'Estimate': [self.ate],
            'Std. Err': [self.ate_se],
            'z': [z_stat],
            'P > |z|': [p_value],
            'CI Lower': [ci_lower],
            'CI Upper': [ci_upper],
        })

dml = DoubleML()
result = dml.fit(X[confounders].values, X['treatment'].values, X['outcome'].values)
print(dml.summary())
print(f"Estimated treatment effect: {dml.ate:.4f} (SE: {dml.ate_se:.4f})")
```

## Example 38: Federated Learning Simulation

```python
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from collections import OrderedDict

class FederatedClient:
    def __init__(self, client_id, data, target, batch_size=32):
        self.client_id = client_id
        self.dataloader = DataLoader(TensorDataset(data, target), batch_size=batch_size, shuffle=True)
        self.n_samples = len(data)

    def train(self, model, epochs=5, lr=0.01):
        model.train()
        optimizer = torch.optim.SGD(model.parameters(), lr=lr, momentum=0.9)
        local_epochs_loss = []
        for epoch in range(epochs):
            epoch_loss = 0
            for batch_X, batch_y in self.dataloader:
                optimizer.zero_grad()
                outputs = model(batch_X)
                loss = F.cross_entropy(outputs, batch_y)
                loss.backward()
                optimizer.step()
                epoch_loss += loss.item()
            local_epochs_loss.append(epoch_loss / len(self.dataloader))
        state_dict = model.state_dict()
        return state_dict, self.n_samples, local_epochs_loss

class FederatedServer:
    def __init__(self, model, clients, fraction=0.3):
        self.model = model
        self.clients = clients
        self.fraction = fraction
        self.round_history = []

    def select_clients(self, round_num):
        np.random.seed(round_num)
        num_clients = max(1, int(len(self.clients) * self.fraction))
        return np.random.choice(self.clients, num_clients, replace=False)

    def federated_averaging(self, client_updates, total_samples):
        global_state = OrderedDict()
        for key in client_updates[0][0].keys():
            global_state[key] = torch.zeros_like(client_updates[0][0][key])
        for state_dict, n_samples, _ in client_updates:
            weight = n_samples / total_samples
            for key in state_dict.keys():
                global_state[key] += weight * state_dict[key]
        return global_state

    def train(self, rounds=50, client_epochs=5):
        for round_num in range(rounds):
            selected_clients = self.select_clients(round_num)
            client_updates = []
            for client in selected_clients:
                state_dict, n_samples, losses = client.train(self.model, epochs=client_epochs)
                client_updates.append((state_dict, n_samples, losses))
            total_samples = sum(n for _, n, _ in client_updates)
            global_state = self.federated_averaging(client_updates, total_samples)
            self.model.load_state_dict(global_state)
            avg_loss = np.mean([l[-1] for _, _, l in client_updates])
            self.round_history.append({'round': round_num, 'avg_loss': avg_loss, 'num_clients': len(selected_clients)})
            if round_num % 10 == 0:
                print(f"Round {round_num}: Loss {avg_loss:.4f}, Clients {len(selected_clients)}")

clients = [FederatedClient(i, client_data[i], client_target[i]) for i in range(100)]
model = nn.Sequential(nn.Linear(50, 128), nn.ReLU(), nn.Linear(128, 10))
server = FederatedServer(model, clients, fraction=0.2)
server.train(rounds=30, client_epochs=3)
```

## Example 39: Bandit-Based Experimentation

```python
import numpy as np
import pandas as pd
from scipy import stats

class ThompsonSamplingBandit:
    def __init__(self, variants, alpha=1, beta=1):
        self.variants = variants
        self.alpha = {v: alpha for v in variants}
        self.beta = {v: beta for v in variants}
        self.trials = {v: 0 for v in variants}
        successes = {v: 0 for v in variants}
        self.history = []

    def select_variant(self):
        samples = {v: np.random.beta(self.alpha[v], self.beta[v]) for v in self.variants}
        chosen = max(samples, key=samples.get)
        return chosen, samples

    def update(self, variant, reward):
        self.trials[variant] += 1
        if reward == 1:
            self.alpha[variant] += 1
        else:
            self.beta[variant] += 1
        win_rate = self.alpha[variant] / (self.alpha[variant] + self.beta[variant])
        self.history.append({
            'variant': variant,
            'reward': reward,
            'win_rate': win_rate,
            'trials': self.trials[variant],
            'total_trials': sum(self.trials.values()),
        })

    def get_results(self):
        rows = []
        for variant in self.variants:
            n = self.trials[variant]
            wins = self.alpha[variant] - 1
            rate = wins / n if n > 0 else 0
            ci_lower = stats.beta.ppf(0.025, self.alpha[variant], self.beta[variant])
            ci_upper = stats.beta.ppf(0.975, self.alpha[variant], self.beta[variant])
            rows.append({
                'variant': variant,
                'trials': n,
                'wins': wins,
                'win_rate': rate,
                'ci_lower': ci_lower,
                'ci_upper': ci_upper,
            })
        return pd.DataFrame(rows)

    def probability_of_being_best(self, n_simulations=10000):
        samples = {v: np.random.beta(self.alpha[v], self.beta[v], n_simulations) for v in self.variants}
        best_counts = {v: 0 for v in self.variants}
        for i in range(n_simulations):
            best = max(self.variants, key=lambda v: samples[v][i])
            best_counts[best] += 1
        return {v: count / n_simulations for v, count in best_counts.items()}

bandit = ThompsonSamplingBandit(variants=['A', 'B', 'C', 'D'])
for _ in range(1000):
    variant, _ = bandit.select_variant()
    reward = 1 if np.random.random() < true_rates[variant] else 0
    bandit.update(variant, reward)
results = bandit.get_results()
prob_best = bandit.probability_of_being_best()
print(results)
print(f"Probability of being best: {prob_best}")
```

## Example 40: Distributed Training with PyTorch DDP

```python
import torch
import torch.nn as nn
import torch.distributed as dist
import torch.multiprocessing as mp
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, Dataset, DistributedSampler
from torch.utils.tensorboard import SummaryWriter
import os
import tempfile

class DDPTrainer:
    def __init__(self, model, dataset, batch_size=64, lr=0.001, epochs=10):
        self.model = model
        self.dataset = dataset
        self.batch_size = batch_size
        self.lr = lr
        self.epochs = epochs

    def setup(self, rank, world_size):
        os.environ['MASTER_ADDR'] = 'localhost'
        os.environ['MASTER_PORT'] = '12355'
        dist.init_process_group('nccl', rank=rank, world_size=world_size)

    def cleanup(self):
        dist.destroy_process_group()

    def train_worker(self, rank, world_size):
        self.setup(rank, world_size)
        device = torch.device(f'cuda:{rank}')
        model = self.model.to(device)
        ddp_model = DDP(model, device_ids=[rank])
        sampler = DistributedSampler(self.dataset, num_replicas=world_size, rank=rank)
        loader = DataLoader(self.dataset, batch_size=self.batch_size, sampler=sampler, pin_memory=True)
        optimizer = torch.optim.AdamW(ddp_model.parameters(), lr=self.lr, weight_decay=0.01)
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=self.epochs)
        criterion = nn.CrossEntropyLoss()
        if rank == 0:
            writer = SummaryWriter(log_dir=f'runs/ddp_training')
        for epoch in range(self.epochs):
            sampler.set_epoch(epoch)
            ddp_model.train()
            epoch_loss = 0
            for batch_X, batch_y in loader:
                batch_X, batch_y = batch_X.to(device), batch_y.to(device)
                optimizer.zero_grad()
                outputs = ddp_model(batch_X)
                loss = criterion(outputs, batch_y)
                loss.backward()
                optimizer.step()
                epoch_loss += loss.item()
            scheduler.step()
            if rank == 0:
                avg_loss = epoch_loss / len(loader)
                writer.add_scalar('Loss/train', avg_loss, epoch)
                if epoch % 5 == 0:
                    print(f"Epoch {epoch}: Loss {avg_loss:.4f}")
        if rank == 0:
            writer.close()
            torch.save(model.state_dict(), 'ddp_model_final.pt')
        self.cleanup()

    def train(self, world_size=4):
        mp.spawn(self.train_worker, args=(world_size,), nprocs=world_size, join=True)

model = nn.Sequential(nn.Linear(784, 512), nn.ReLU(), nn.Dropout(0.2), nn.Linear(512, 256), nn.ReLU(), nn.Linear(256, 10))
dataset = TensorDataset(torch.randn(10000, 784), torch.randint(0, 10, (10000,)))
trainer = DDPTrainer(model, dataset, batch_size=128, lr=0.001, epochs=20)
trainer.train(world_size=4)
```

## Example 41: Model Compression with Knowledge Distillation

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader

class KnowledgeDistiller:
    def __init__(self, teacher_model, student_model, temperature=4.0, alpha=0.7):
        self.teacher = teacher_model
        self.student = student_model
        self.temperature = temperature
        self.alpha = alpha

    def distillation_loss(self, student_logits, teacher_logits, labels):
        soft_targets = F.softmax(teacher_logits / self.temperature, dim=1)
        soft_prob = F.log_softmax(student_logits / self.temperature, dim=1)
        distillation_loss = F.kl_div(soft_prob, soft_targets, reduction='batchmean') * (self.temperature ** 2)
        student_loss = F.cross_entropy(student_logits, labels)
        return self.alpha * distillation_loss + (1.0 - self.alpha) * student_loss

    def train(self, train_loader, val_loader, epochs=50, lr=0.001):
        self.teacher.eval()
        self.student.train()
        optimizer = torch.optim.Adam(self.student.parameters(), lr=lr)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=5)
        best_val_loss = float('inf')
        for epoch in range(epochs):
            train_loss = 0
            for inputs, labels in train_loader:
                inputs, labels = inputs.cuda(), labels.cuda()
                optimizer.zero_grad()
                with torch.no_grad():
                    teacher_logits = self.teacher(inputs)
                student_logits = self.student(inputs)
                loss = self.distillation_loss(student_logits, teacher_logits, labels)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
            val_loss = self.evaluate(val_loader)
            scheduler.step(val_loss)
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                torch.save(self.student.state_dict(), 'best_student.pt')
            if epoch % 10 == 0:
                print(f"Epoch {epoch}: Train Loss {train_loss/len(train_loader):.4f}, Val Loss {val_loss:.4f}")

    def evaluate(self, loader):
        self.student.eval()
        total_loss = 0
        with torch.no_grad():
            for inputs, labels in loader:
                inputs, labels = inputs.cuda(), labels.cuda()
                teacher_logits = self.teacher(inputs)
                student_logits = self.student(inputs)
                loss = self.distillation_loss(student_logits, teacher_logits, labels)
                total_loss += loss.item()
        return total_loss / len(loader)

teacher = nn.Sequential(nn.Linear(784, 1024), nn.ReLU(), nn.Linear(1024, 512), nn.ReLU(), nn.Linear(512, 256), nn.ReLU(), nn.Linear(256, 10)).cuda()
student = nn.Sequential(nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 128), nn.ReLU(), nn.Linear(128, 10)).cuda()
distiller = KnowledgeDistiller(teacher, student, temperature=4.0, alpha=0.7)
distiller.train(train_loader, val_loader, epochs=30, lr=0.001)
print("Knowledge distillation complete. Student model size: 4.2x smaller than teacher.")
```

## Example 42: Reinforcement Learning Inference Policy

```python
import numpy as np
import torch
import torch.nn as nn
import pickle
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class Action:
    action_id: int
    action_name: str
    features: np.ndarray
    expected_reward: float

class RLInferencePolicy:
    def __init__(self, policy_network_path, action_space_path, epsilon=0.05):
        self.policy_net = torch.load(policy_network_path, map_location='cpu')
        self.policy_net.eval()
        self.action_space = pickle.load(open(action_space_path, 'rb'))
        self.epsilon = epsilon
        self.action_history = []

    def preprocess_state(self, state: Dict[str, Any]) -> torch.Tensor:
        features = []
        features.append(state.get('user_embedding', np.zeros(64)))
        features.append(state.get('context_features', np.zeros(32)))
        features.append(state.get('time_features', np.zeros(8)))
        return torch.tensor(np.concatenate(features), dtype=torch.float32).unsqueeze(0)

    def select_action(self, state: Dict[str, Any], valid_actions: List[int] = None) -> Action:
        if np.random.random() < self.epsilon:
            return self._random_action(valid_actions)
        state_tensor = self.preprocess_state(state)
        with torch.no_grad():
            action_values = self.policy_net(state_tensor).squeeze(0).numpy()
        if valid_actions is not None:
            mask = np.full(len(self.action_space), -np.inf)
            for idx in valid_actions:
                mask[idx] = action_values[idx]
            action_values = mask
        best_action_idx = np.argmax(action_values)
        action = self.action_space[best_action_idx]
        self.action_history.append({
            'action_id': action.action_id,
            'action_value': float(action_values[best_action_idx]),
            'epsilon': self.epsilon,
        })
        return action

    def _random_action(self, valid_actions: List[int] = None) -> Action:
        if valid_actions is not None:
            idx = np.random.choice(valid_actions)
        else:
            idx = np.random.randint(len(self.action_space))
        return self.action_space[idx]

    def update_policy(self, new_policy_path):
        self.policy_net = torch.load(new_policy_path, map_location='cpu')
        self.policy_net.eval()

    def get_action_stats(self):
        if not self.action_history:
            return {}
        action_ids = [h['action_id'] for h in self.action_history]
        unique, counts = np.unique(action_ids, return_counts=True)
        return {'total_actions': len(self.action_history), 'unique_actions': len(unique), 'action_distribution': dict(zip(unique, counts)), 'exploration_rate': np.mean([h['epsilon'] for h in self.action_history[-1000:]])}

policy = RLInferencePolicy(policy_network_path='models/policy_net_v3.pt', action_space_path='models/action_space.pkl')
state = {'user_embedding': np.random.randn(64), 'context_features': np.random.randn(32), 'time_features': np.random.randn(8)}
action = policy.select_action(state, valid_actions=[0, 1, 2, 5, 8])
print(f"Selected action: {action.action_name} (ID: {action.action_id}, Expected Reward: {action.expected_reward:.4f})")
```

## Example 43: Automated Hyperparameter Optimization with Optuna

```python
import optuna
from optuna.samplers import TPESampler
from optuna.pruners import MedianPruner
import xgboost as xgb
from sklearn.model_selection import cross_val_score
from sklearn.metrics import roc_auc_score
import numpy as np
import pandas as pd

class OptunaHPO:
    def __init__(self, X, y, n_trials=100, direction='maximize'):
        self.X = X
        self.y = y
        self.n_trials = n_trials
        self.direction = direction
        self.study = None
        self.best_params = None
        self.best_value = None

    def objective(self, trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 100, 1000, step=100),
            'max_depth': trial.suggest_int('max_depth', 3, 15),
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
            'subsample': trial.suggest_float('subsample', 0.6, 1.0),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
            'gamma': trial.suggest_float('gamma', 0.0, 5.0),
            'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
            'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
        }
        model = xgb.XGBClassifier(**params, use_label_encoder=False, eval_metric='logloss', random_state=42)
        scores = cross_val_score(model, self.X, self.y, cv=5, scoring='roc_auc', n_jobs=-1)
        mean_score = scores.mean()
        trial.report(mean_score, step=0)
        return mean_score

    def optimize(self, timeout=None):
        sampler = TPESampler(seed=42)
        pruner = MedianPruner(n_startup_trials=10, n_warmup_steps=0)
        self.study = optuna.create_study(direction=self.direction, sampler=sampler, pruner=pruner, study_name='xgb_hpo')
        self.study.optimize(self.objective, n_trials=self.n_trials, timeout=timeout, show_progress_bar=True)
        self.best_params = self.study.best_params
        self.best_value = self.study.best_value
        return self.best_params, self.best_value

    def get_trial_history(self):
        trials_df = self.study.trials_dataframe()
        return trials_df.sort_values('value', ascending=self.direction == 'minimize')

    def plot_parallel_coordinate(self, params=None):
        if params is None:
            params = list(self.best_params.keys())[:5]
        fig = optuna.visualization.plot_parallel_coordinate(self.study, params=params)
        return fig

    def plot_param_importance(self):
        fig = optuna.visualization.plot_param_importances(self.study)
        return fig

    def suggest_next_parameters(self):
        if self.study is None:
            return {}
        best_trial = self.study.best_trial
        return {'params': best_trial.params, 'value': best_trial.value, 'number': best_trial.number}

hpo = OptunaHPO(X_train, y_train, n_trials=50)
best_params, best_value = hpo.optimize(timeout=600)
print(f"Best params: {best_params}")
print(f"Best CV AUC: {best_value:.4f}")
```

## Example 44: Multi-Modal Model Fusion

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiModalFusion(nn.Module):
    def __init__(self, text_dim=768, image_dim=2048, tabular_dim=128, fusion_dim=512, num_classes=10):
        super().__init__()
        self.text_encoder = nn.Sequential(
            nn.Linear(text_dim, fusion_dim),
            nn.LayerNorm(fusion_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
        )
        self.image_encoder = nn.Sequential(
            nn.Linear(image_dim, fusion_dim),
            nn.LayerNorm(fusion_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
        )
        self.tabular_encoder = nn.Sequential(
            nn.Linear(tabular_dim, fusion_dim // 2),
            nn.LayerNorm(fusion_dim // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
        )
        self.cross_attention = nn.MultiheadAttention(embed_dim=fusion_dim, num_heads=8, dropout=0.1, batch_first=True)
        self.fusion_gate = nn.Sequential(
            nn.Linear(fusion_dim * 3, 3),
            nn.Softmax(dim=1),
        )
        self.classifier = nn.Sequential(
            nn.Linear(fusion_dim, fusion_dim // 2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(fusion_dim // 2, num_classes),
        )

    def forward(self, text_feat, image_feat, tabular_feat):
        text_encoded = self.text_encoder(text_feat)
        image_encoded = self.image_encoder(image_feat)
        tabular_encoded = self.tabular_encoder(tabular_feat)
        tabular_projected = F.pad(tabular_encoded, (0, fusion_dim - tabular_encoded.shape[-1]))
        stacked = torch.stack([text_encoded, image_encoded, tabular_projected], dim=1)
        attended, _ = self.cross_attention(stacked, stacked, stacked)
        text_attended = attended[:, 0, :]
        image_attended = attended[:, 1, :]
        tabular_attended = attended[:, 2, :]
        gate_input = torch.cat([text_attended, image_attended, tabular_attended], dim=1)
        gate_weights = self.fusion_gate(gate_input)
        fused = gate_weights[:, 0:1] * text_attended + gate_weights[:, 1:2] * image_attended + gate_weights[:, 2:3] * tabular_attended
        output = self.classifier(fused)
        return output, gate_weights

    def analyze_modality_importance(self, text_feat, image_feat, tabular_feat):
        _, gate_weights = self.forward(text_feat, image_feat, tabular_feat)
        mean_weights = gate_weights.mean(dim=0).detach().cpu().numpy()
        return {'text_weight': mean_weights[0], 'image_weight': mean_weights[1], 'tabular_weight': mean_weights[2]}

fusion_dim = 512
model = MultiModalFusion(text_dim=768, image_dim=2048, tabular_dim=128, fusion_dim=fusion_dim, num_classes=10)
text_input = torch.randn(32, 768)
image_input = torch.randn(32, 2048)
tabular_input = torch.randn(32, 128)
output, gates = model(text_input, image_input, tabular_input)
print(f"Output shape: {output.shape}")
print(f"Gate weights: {gates.mean(dim=0)}")
```

## Example 45: Automated Data Pipeline Testing

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Callable, Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class DataQualityCheck:
    name: str
    check_fn: Callable
    severity: str = 'error'
    threshold: Optional[float] = None

class DataPipelineTester:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.checks: List[DataQualityCheck] = []
        self.results: List[Dict] = []

    def add_schema_check(self, expected_schema: Dict[str, str]):
        def check(df):
            errors = []
            for col, dtype in expected_schema.items():
                if col not in df.columns:
                    errors.append(f"Missing column: {col}")
                elif str(df[col].dtype) != dtype:
                    errors.append(f"Column {col}: expected {dtype}, got {df[col].dtype}")
            return len(errors) == 0, {'errors': errors, 'columns_checked': len(expected_schema)}
        self.checks.append(DataQualityCheck(name='schema_validation', check_fn=check, severity='error'))

    def add_missing_value_check(self, max_missing_rate=0.05, columns=None):
        def check(df):
            target_cols = columns or df.columns
            violations = []
            for col in target_cols:
                rate = df[col].isnull().mean()
                if rate > max_missing_rate:
                    violations.append(f"{col}: {rate:.2%} missing > {max_missing_rate:.2%}")
            return len(violations) == 0, {'violations': violations, 'threshold': max_missing_rate}
        self.checks.append(DataQualityCheck(name='missing_values', check_fn=check, severity='error', threshold=max_missing_rate))

    def add_unique_constraint(self, columns: List[str]):
        def check(df):
            violations = []
            for col in columns:
                if df[col].isnull().any():
                    violations.append(f"{col} has null values, cannot verify uniqueness")
                elif df[col].nunique() < len(df) * 0.9:
                    violations.append(f"{col} may have duplicates: {df[col].nunique()} unique / {len(df)} total")
            return len(violations) == 0, {'violations': violations, 'columns': columns}
        self.checks.append(DataQualityCheck(name='unique_constraint', check_fn=check, severity='warning'))

    def add_range_check(self, column: str, min_val=None, max_val=None):
        def check(df):
            violations = []
            if min_val is not None and df[column].min() < min_val:
                violations.append(f"{column}: min {df[column].min()} < {min_val}")
            if max_val is not None and df[column].max() > max_val:
                violations.append(f"{column}: max {df[column].max()} > {max_val}")
            return len(violations) == 0, {'violations': violations, 'range': (min_val, max_val)}
        self.checks.append(DataQualityCheck(name=f'range_{column}', check_fn=check, severity='error'))

    def add_distribution_check(self, column: str, reference_mean, reference_std, z_score_threshold=3):
        def check(df):
            mean = df[column].mean()
            std = df[column].std()
            z_mean = abs(mean - reference_mean) / (reference_std / np.sqrt(len(df)))
            violations = []
            if z_mean > z_score_threshold:
                violations.append(f"{column}: mean {mean:.4f} differs from reference {reference_mean:.4f} (z={z_mean:.2f})")
            return len(violations) == 0, {'violations': violations, 'current_mean': float(mean), 'reference_mean': reference_mean, 'z_score': float(z_mean)}
        self.checks.append(DataQualityCheck(name=f'distribution_{column}', check_fn=check, severity='warning', threshold=z_score_threshold))

    def add_freshness_check(self, date_column: str, max_age_hours=24):
        def check(df):
            if date_column not in df.columns:
                return False, {'error': f"Column {date_column} not found"}
            max_date = pd.to_datetime(df[date_column]).max()
            age = datetime.now() - max_date
            violations = []
            if age.total_seconds() > max_age_hours * 3600:
                violations.append(f"Data age: {age.total_seconds()/3600:.1f}h > {max_age_hours}h")
            return len(violations) == 0, {'violations': violations, 'max_date': str(max_date), 'age_hours': age.total_seconds() / 3600}
        self.checks.append(DataQualityCheck(name='freshness', check_fn=check, severity='error'))

    def run_all(self) -> Dict:
        summary = {'total_checks': len(self.checks), 'passed': 0, 'failed': 0, 'warnings': 0, 'results': []}
        for check in self.checks:
            try:
                passed, details = check.check_fn(self.df)
                result = {'name': check.name, 'passed': passed, 'severity': check.severity, 'details': details}
                self.results.append(result)
                summary['results'].append(result)
                if passed:
                    summary['passed'] += 1
                elif check.severity == 'warning':
                    summary['warnings'] += 1
                else:
                    summary['failed'] += 1
                status = 'PASSED' if passed else ('WARNING' if check.severity == 'warning' else 'FAILED')
                logger.info(f"Check '{check.name}': {status}")
            except Exception as e:
                result = {'name': check.name, 'passed': False, 'severity': check.severity, 'details': {'error': str(e)}}
                self.results.append(result)
                summary['results'].append(result)
                summary['failed'] += 1
                logger.error(f"Check '{check.name}' raised exception: {e}")
        summary['all_passed'] = summary['failed'] == 0
        return summary

    def report(self):
        summary = self.run_all()
        print(f"\n{'='*60}")
        print(f"Data Pipeline Test Report")
        print(f"{'='*60}")
        print(f"Total checks: {summary['total_checks']}")
        print(f"  Passed:     {summary['passed']}")
        print(f"  Warnings:   {summary['warnings']}")
        print(f"  Failed:     {summary['failed']}")
        print(f"  All passed: {summary['all_passed']}")
        print(f"{'='*60}")
        for result in summary['results']:
            status = 'PASS' if result['passed'] else ('WARN' if result['severity'] == 'warning' else 'FAIL')
            print(f"  [{status}] {result['name']}: {result['details']}")
        return summary

tester = DataPipelineTester(df)
tester.add_schema_check({'user_id': 'int64', 'amount': 'float64', 'timestamp': 'datetime64[ns]', 'category': 'object'})
tester.add_missing_value_check(max_missing_rate=0.05)
tester.add_unique_constraint(['transaction_id'])
tester.add_range_check('amount', min_val=0, max_val=100000)
tester.add_distribution_check('amount', reference_mean=250.0, reference_std=150.0)
tester.add_freshness_check('timestamp', max_age_hours=12)
results = tester.report()
```

## Example 46: Production Model Health Check Service

```python
import asyncio
import aiohttp
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import Dict, List, Optional, Any
import json

@dataclass
class ModelHealthStatus:
    model_name: str
    model_version: str
    status: str
    latency_p50_ms: float
    latency_p99_ms: float
    throughput_qps: float
    error_rate: float
    prediction_drift: float
    data_drift: float
    memory_usage_mb: float
    uptime_hours: float
    last_updated: str

class ModelHealthService:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = json.load(f)
        self.models = self.config.get('models', [])
        self.alert_webhook = self.config.get('alert_webhook')
        self.thresholds = self.config.get('thresholds', {
            'latency_p99_ms': 500,
            'error_rate': 0.01,
            'drift_threshold': 0.2,
            'memory_mb': 4096,
        })

    async def check_model_health(self, model_info: Dict) -> ModelHealthStatus:
        endpoint = model_info.get('health_endpoint')
        metrics_endpoint = model_info.get('metrics_endpoint')
        async with aiohttp.ClientSession() as session:
            health_resp = await session.get(endpoint, timeout=5)
            health_data = await health_resp.json()
            metrics_resp = await session.get(metrics_endpoint, timeout=5)
            metrics_data = await metrics_resp.json()
        status = ModelHealthStatus(
            model_name=model_info['name'],
            model_version=health_data.get('version', 'unknown'),
            status='healthy' if health_resp.status == 200 else 'unhealthy',
            latency_p50_ms=metrics_data.get('latency', {}).get('p50', 0),
            latency_p99_ms=metrics_data.get('latency', {}).get('p99', 0),
            throughput_qps=metrics_data.get('throughput', {}).get('qps', 0),
            error_rate=metrics_data.get('errors', {}).get('rate', 0),
            prediction_drift=metrics_data.get('drift', {}).get('prediction', 0),
            data_drift=metrics_data.get('drift', {}).get('data', 0),
            memory_usage_mb=metrics_data.get('resources', {}).get('memory_mb', 0),
            uptime_hours=metrics_data.get('uptime_hours', 0),
            last_updated=datetime.now().isoformat(),
        )
        return status

    def evaluate_health(self, status: ModelHealthStatus) -> Dict:
        issues = []
        if status.status != 'healthy':
            issues.append({'severity': 'critical', 'message': f"Model {status.model_name} is not healthy"})
        if status.latency_p99_ms > self.thresholds['latency_p99_ms']:
            issues.append({'severity': 'high', 'message': f"p99 latency {status.latency_p99_ms}ms > {self.thresholds['latency_p99_ms']}ms"})
        if status.error_rate > self.thresholds['error_rate']:
            issues.append({'severity': 'critical', 'message': f"Error rate {status.error_rate:.2%} > {self.thresholds['error_rate']:.2%}"})
        if status.data_drift > self.thresholds['drift_threshold']:
            issues.append({'severity': 'high', 'message': f"Data drift {status.data_drift:.3f} > {self.thresholds['drift_threshold']}"})
        if status.memory_usage_mb > self.thresholds['memory_mb']:
            issues.append({'severity': 'medium', 'message': f"Memory {status.memory_usage_mb}MB > {self.thresholds['memory_mb']}MB"})
        overall = 'critical' if any(i['severity'] == 'critical' for i in issues) else 'warning' if issues else 'healthy'
        return {'overall_status': overall, 'issues': issues, 'checked_at': datetime.now().isoformat()}

    async def run_health_check(self) -> Dict:
        results = {}
        for model in self.models:
            try:
                status = await self.check_model_health(model)
                evaluation = self.evaluate_health(status)
                results[model['name']] = {'status': status, 'evaluation': evaluation}
            except Exception as e:
                results[model['name']] = {'error': str(e), 'evaluation': {'overall_status': 'error', 'issues': [{'severity': 'critical', 'message': str(e)}]}}
        return results

service = ModelHealthService('config/health_check_config.json')
results = asyncio.run(service.run_health_check())
for model_name, result in results.items():
    eval_result = result.get('evaluation', {})
    print(f"{model_name}: {eval_result.get('overall_status', 'unknown')}")
    for issue in eval_result.get('issues', []):
        print(f"  [{issue['severity']}] {issue['message']}")
```

## Example 47: Feature Importance with Permutation

```python
import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score, accuracy_score, f1_score
from sklearn.model_selection import StratifiedKFold
from tqdm import tqdm

class PermutationFeatureImportance:
    def __init__(self, model, X, y, metric='roc_auc', n_repeats=10, n_folds=5, random_state=42):
        self.model = model
        self.X = X
        self.y = y
        self.metric = metric
        self.n_repeats = n_repeats
        self.n_folds = n_folds
        self.random_state = random_state
        self.feature_names = X.columns if isinstance(X, pd.DataFrame) else [f'feature_{i}' for i in range(X.shape[1])]
        self.importances_ = None
        self.importances_std_ = None

    def _score(self, y_true, y_pred):
        if self.metric == 'roc_auc':
            return roc_auc_score(y_true, y_pred)
        elif self.metric == 'accuracy':
            return accuracy_score(y_true, y_pred)
        elif self.metric == 'f1':
            return f1_score(y_true, y_pred)
        else:
            raise ValueError(f"Unknown metric: {self.metric}")

    def compute(self):
        skf = StratifiedKFold(n_splits=self.n_folds, shuffle=True, random_state=self.random_state)
        importances = np.zeros((self.n_folds * self.n_repeats, self.X.shape[1]))
        np.random.seed(self.random_state)
        idx = 0
        for train_idx, val_idx in skf.split(self.X, self.y):
            X_train, X_val = self.X.iloc[train_idx] if isinstance(self.X, pd.DataFrame) else self.X[train_idx], self.X.iloc[val_idx] if isinstance(self.X, pd.DataFrame) else self.X[val_idx]
            y_train, y_val = self.y.iloc[train_idx] if isinstance(self.y, pd.Series) else self.y[train_idx], self.y.iloc[val_idx] if isinstance(self.y, pd.Series) else self.y[val_idx]
            self.model.fit(X_train, y_train)
            if hasattr(self.model, 'predict_proba'):
                baseline_pred = self.model.predict_proba(X_val)
                if baseline_pred.ndim > 1:
                    baseline_pred = baseline_pred[:, 1]
            else:
                baseline_pred = self.model.predict(X_val)
            baseline_score = self._score(y_val, baseline_pred)
            for feature_idx in range(self.X.shape[1]):
                for repeat in range(self.n_repeats):
                    X_permuted = X_val.copy()
                    col = X_val.columns[feature_idx] if isinstance(X_val, pd.DataFrame) else feature_idx
                    shuffled = np.random.permutation(X_permuted[col].values)
                    if isinstance(X_permuted, pd.DataFrame):
                        X_permuted[col] = shuffled
                    else:
                        X_permuted[:, feature_idx] = shuffled
                    if hasattr(self.model, 'predict_proba'):
                        perm_pred = self.model.predict_proba(X_permuted)
                        if perm_pred.ndim > 1:
                            perm_pred = perm_pred[:, 1]
                    else:
                        perm_pred = self.model.predict(X_permuted)
                    perm_score = self._score(y_val, perm_pred)
                    importances[idx, feature_idx] = baseline_score - perm_score
                    idx += 1
        self.importances_ = importances.mean(axis=0)
        self.importances_std_ = importances.std(axis=0)
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.importances_,
            'std': self.importances_std_,
        }).sort_values('importance', ascending=False)
        return importance_df

    def plot(self, top_n=20):
        imp_df = pd.DataFrame({'feature': self.feature_names, 'importance': self.importances_, 'std': self.importances_std_})
        imp_df = imp_df.sort_values('importance', ascending=True).tail(top_n)
        plt.figure(figsize=(10, 8))
        plt.barh(range(len(imp_df)), imp_df['importance'].values, xerr=imp_df['std'].values)
        plt.yticks(range(len(imp_df)), imp_df['feature'].values)
        plt.xlabel(f'Decrease in {self.metric} when permuted')
        plt.title('Permutation Feature Importance')
        plt.tight_layout()
        return plt.gcf()

from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=200, random_state=42)
pfi = PermutationFeatureImportance(model, X, y, metric='roc_auc', n_repeats=5, n_folds=3)
importance_df = pfi.compute()
print(importance_df.head(10))
```

## Example 48: Automated Retraining with Performance Tracking

```python
import mlflow
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import pickle
import json
from pathlib import Path

class AutoRetrainingPipeline:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = json.load(f)
        self.model_dir = Path(self.config.get('model_dir', 'models'))
        self.model_dir.mkdir(exist_ok=True)
        self.metric_to_monitor = self.config.get('metric_to_monitor', 'roc_auc')
        self.retraining_threshold = self.config.get('retraining_threshold', 0.02)
        self.min_training_interval = self.config.get('min_training_interval_hours', 24)
        self.last_training_time = None
        self.performance_history = []

    def should_retrain(self, current_metrics: Dict) -> bool:
        if self.last_training_time is None:
            return True
        hours_since_last = (datetime.now() - self.last_training_time).total_seconds() / 3600
        if hours_since_last < self.min_training_interval:
            return False
        if not self.performance_history:
            return True
        recent_performance = [p[self.metric_to_monitor] for p in self.performance_history[-3:]]
        if len(recent_performance) >= 2:
            degradation = recent_performance[-1] - current_metrics.get(self.metric_to_monitor, 0)
            if degradation > self.retraining_threshold:
                return True
        return False

    def prepare_training_data(self, data_path, date_column, target_column, feature_columns):
        df = pd.read_parquet(data_path)
        df = df.sort_values(date_column)
        split_idx = int(len(df) * 0.85)
        train_df = df.iloc[:split_idx]
        val_df = df.iloc[split_idx:]
        self.training_metadata = {
            'data_path': data_path,
            'train_rows': len(train_df),
            'val_rows': len(val_df),
            'train_start': train_df[date_column].min().isoformat() if pd.api.types.is_datetime64_any_dtype(train_df[date_column]) else str(train_df[date_column].min()),
            'train_end': train_df[date_column].max().isoformat() if pd.api.types.is_datetime64_any_dtype(train_df[date_column]) else str(train_df[date_column].max()),
            'features': feature_columns,
            'target': target_column,
        }
        return train_df[feature_columns], train_df[target_column], val_df[feature_columns], val_df[target_column]

    def train_model(self, X_train, y_train, X_val, y_val, model_type='xgboost'):
        with mlflow.start_run() as run:
            if model_type == 'xgboost':
                model = xgb.XGBClassifier(n_estimators=300, max_depth=8, learning_rate=0.05, eval_metric='logloss', early_stopping_rounds=20, random_state=42)
                model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
            else:
                model = RandomForestClassifier(n_estimators=300, max_depth=12, random_state=42)
                model.fit(X_train, y_train)
            train_pred = model.predict(X_train)
            train_proba = model.predict_proba(X_train)[:, 1] if hasattr(model, 'predict_proba') else train_pred
            val_pred = model.predict(X_val)
            val_proba = model.predict_proba(X_val)[:, 1] if hasattr(model, 'predict_proba') else val_pred
            metrics = {
                'train_accuracy': accuracy_score(y_train, train_pred),
                'val_accuracy': accuracy_score(y_val, val_pred),
                'val_precision': precision_score(y_val, val_pred, average='weighted'),
                'val_recall': recall_score(y_val, val_pred, average='weighted'),
                'val_f1': f1_score(y_val, val_pred, average='weighted'),
                'val_roc_auc': roc_auc_score(y_val, val_proba) if y_val.nunique() == 2 else 0.0,
            }
            mlflow.log_params({'model_type': model_type, 'n_estimators': 300, 'max_depth': 8})
            mlflow.log_metrics(metrics)
            mlflow.log_artifact(self.config.get('config_path', 'config.json'))
            if model_type == 'xgboost':
                mlflow.xgboost.log_model(model, 'model')
            else:
                mlflow.sklearn.log_model(model, 'model')
            model_path = self.model_dir / f"model_{run.info.run_id}.pkl"
            with open(model_path, 'wb') as f:
                pickle.dump(model, f)
            self.last_training_time = datetime.now()
            self.performance_history.append(metrics)
            self.performance_history = self.performance_history[-10:]
        return model, metrics, run.info.run_id

    def run(self, data_path, date_column, target_column, feature_columns):
        X_train, y_train, X_val, y_val = self.prepare_training_data(data_path, date_column, target_column, feature_columns)
        model, metrics, run_id = self.train_model(X_train, y_train, X_val, y_val)
        result = {
            'timestamp': datetime.now().isoformat(),
            'run_id': run_id,
            'metrics': metrics,
            'training_metadata': self.training_metadata,
            'retrained': True,
        }
        with open(self.model_dir / f"training_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w') as f:
            json.dump(result, f, default=str)
        return result

pipeline = AutoRetrainingPipeline('config/retraining_config.json')
result = pipeline.run(data_path='s3://data/transactions/latest.parquet', date_column='timestamp', target_column='is_fraud', feature_columns=feature_cols)
print(f"Retrained model: {result['run_id']}")
print(f"Val ROC-AUC: {result['metrics']['val_roc_auc']:.4f}")
```

## Example 49: Time Series Forecasting with Multiple Horizons

```python
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error
import lightgbm as lgb
from typing import Dict, List, Tuple

class MultiHorizonForecaster:
    def __init__(self, forecast_horizons=[1, 7, 30, 90], feature_lags=[1, 7, 14, 30], window_sizes=[7, 30]):
        self.horizons = forecast_horizons
        self.feature_lags = feature_lags
        self.window_sizes = window_sizes
        self.models = {}

    def create_features(self, df, date_col, target_col, id_col=None):
        df = df.sort_values([id_col, date_col]) if id_col else df.sort_values(date_col)
        groups = df.groupby(id_col) if id_col else [(None, df)]
        feature_dfs = []
        for group_key, group_df in groups:
            for lag in self.feature_lags:
                group_df[f'lag_{lag}'] = group_df[target_col].shift(lag)
            for window in self.window_sizes:
                group_df[f'rolling_mean_{window}'] = group_df[target_col].shift(1).rolling(window).mean()
                group_df[f'rolling_std_{window}'] = group_df[target_col].shift(1).rolling(window).std()
                group_df[f'rolling_min_{window}'] = group_df[target_col].shift(1).rolling(window).min()
                group_df[f'rolling_max_{window}'] = group_df[target_col].shift(1).rolling(window).max()
            dates = pd.to_datetime(group_df[date_col])
            group_df['day_of_week'] = dates.dt.dayofweek
            group_df['day_of_month'] = dates.dt.day
            group_df['month'] = dates.dt.month
            group_df['quarter'] = dates.dt.quarter
            group_df['year'] = dates.dt.year
            group_df['day_of_year'] = dates.dt.dayofyear
            group_df['week_of_year'] = dates.dt.isocalendar().week.astype(int)
            group_df['is_month_end'] = dates.dt.is_month_end.astype(int)
            group_df['is_quarter_end'] = dates.dt.is_quarter_end.astype(int)
            group_df['elapsed_days'] = (dates - dates.min()).dt.days
            feature_dfs.append(group_df)
        return pd.concat(feature_dfs).dropna()

    def train(self, df, date_col, target_col, id_col=None):
        feature_df = self.create_features(df, date_col, target_col, id_col)
        exclude_cols = {date_col, target_col}
        if id_col:
            exclude_cols.add(id_col)
        feature_cols = [c for c in feature_df.columns if c not in exclude_cols]
        for horizon in self.horizons:
            horizon_df = feature_df.copy()
            horizon_df['target_horizon'] = horizon_df.groupby(id_col)[target_col].shift(-horizon) if id_col else df[target_col].shift(-horizon)
            horizon_df = horizon_df.dropna(subset=['target_horizon'])
            train_mask = np.random.random(len(horizon_df)) < 0.8
            train_data = horizon_df[train_mask]
            val_data = horizon_df[~train_mask]
            X_train, y_train = train_data[feature_cols], train_data['target_horizon']
            X_val, y_val = val_data[feature_cols], val_data['target_horizon']
            model = lgb.LGBMRegressor(n_estimators=500, learning_rate=0.03, max_depth=8, num_leaves=64, subsample=0.8, colsample_bytree=0.8, random_state=42)
            model.fit(X_train, y_train, eval_set=[(X_val, y_val)], callbacks=[lgb.early_stopping(20), lgb.log_evaluation(0)])
            self.models[horizon] = {'model': model, 'features': feature_cols, 'val_mae': mean_absolute_error(y_val, model.predict(X_val)), 'val_rmse': np.sqrt(mean_squared_error(y_val, model.predict(X_val)))}
        return self.models

    def predict(self, df, date_col, target_col, id_col=None):
        feature_df = self.create_features(df, date_col, target_col, id_col)
        predictions = {}
        for horizon, model_info in self.models.items():
            available_features = [f for f in model_info['features'] if f in feature_df.columns]
            preds = model_info['model'].predict(feature_df[available_features].iloc[-1:])
            predictions[horizon] = preds[0]
        return predictions

    def get_feature_importance(self, horizon):
        if horizon in self.models:
            model = self.models[horizon]['model']
            features = self.models[horizon]['features']
            return pd.DataFrame({'feature': features, 'importance': model.feature_importances_}).sort_values('importance', ascending=False)
        return None

forecaster = MultiHorizonForecaster(forecast_horizons=[1, 7, 30], feature_lags=[1, 7, 14, 30], window_sizes=[7, 30])
models = forecaster.train(df, date_col='date', target_col='sales', id_col='store_id')
for horizon, info in models.items():
    print(f"Horizon {horizon}d: MAE={info['val_mae']:.2f}, RMSE={info['val_rmse']:.2f}")
predictions = forecaster.predict(df, date_col='date', target_col='sales', id_col='store_id')
print(f"Next day prediction: {predictions[1]:.2f}")
print(f"Next week prediction: {predictions[7]:.2f}")
print(f"Next month prediction: {predictions[30]:.2f}")
```

## Example 50: Complete MLOps Pipeline with All Components

```python
import mlflow
import json
import yaml
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import xgboost as xgb
import shap
import warnings
warnings.filterwarnings('ignore')

@dataclass
class PipelineConfig:
    experiment_name: str
    model_name: str
    data_path: str
    target_column: str
    feature_columns: List[str]
    test_size: float = 0.2
    validation_size: float = 0.1
    random_state: int = 42
    model_params: Dict = None
    monitoring_config: Dict = None

    def __post_init__(self):
        if self.model_params is None:
            self.model_params = {'n_estimators': 300, 'max_depth': 8, 'learning_rate': 0.05, 'subsample': 0.8, 'colsample_bytree': 0.8}
        if self.monitoring_config is None:
            self.monitoring_config = {'drift_threshold': 0.2, 'performance_threshold': 0.02, 'alert_webhook': None}

class DataValidator:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.validation_results = {}

    def validate_schema(self, df: pd.DataFrame) -> bool:
        expected_columns = self.config.feature_columns + [self.config.target_column]
        missing = [c for c in expected_columns if c not in df.columns]
        extra = [c for c in df.columns if c not in expected_columns and c not in ['timestamp', 'id']]
        self.validation_results['schema'] = {'missing_columns': missing, 'extra_columns': extra, 'valid': len(missing) == 0}
        return self.validation_results['schema']['valid']

    def validate_quality(self, df: pd.DataFrame) -> Dict:
        issues = []
        for col in self.config.feature_columns:
            missing_rate = df[col].isnull().mean()
            if missing_rate > 0.05:
                issues.append({'column': col, 'issue': f'missing_rate={missing_rate:.2%}', 'severity': 'warning'})
        if df.duplicated().sum() > 0:
            issues.append({'column': 'all', 'issue': f'duplicates={df.duplicated().sum()}', 'severity': 'warning'})
        self.validation_results['quality'] = {'issues': issues, 'valid': len([i for i in issues if i['severity'] == 'error']) == 0}
        return self.validation_results

    def validate_distribution(self, df: pd.DataFrame, reference_stats: Dict = None) -> Dict:
        if reference_stats is None:
            return {'valid': True, 'note': 'No reference stats provided'}
        drifted_features = []
        for col in self.config.feature_columns:
            if col in reference_stats:
                current_mean = df[col].mean()
                ref_mean = reference_stats[col]['mean']
                ref_std = reference_stats[col]['std']
                if abs(current_mean - ref_mean) > 3 * ref_std:
                    drifted_features.append({'column': col, 'current_mean': current_mean, 'ref_mean': ref_mean})
        self.validation_results['distribution'] = {'drifted_features': drifted_features, 'valid': len(drifted_features) == 0}
        return self.validation_results

class ModelTrainer:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.model = None
        self.explainer = None
        self.shap_values = None

    def prepare_data(self, df: pd.DataFrame):
        X = df[self.config.feature_columns]
        y = df[self.config.target_column]
        X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=self.config.test_size, random_state=self.config.random_state, stratify=y)
        val_size_adj = self.config.validation_size / (1 - self.config.test_size)
        X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=val_size_adj, random_state=self.config.random_state, stratify=y_temp)
        return X_train, X_val, X_test, y_train, y_val, y_test

    def train(self, X_train, y_train, X_val, y_val):
        with mlflow.start_run(run_name=f"train_{datetime.now().strftime('%Y%m%d_%H%M%S')}") as run:
            mlflow.set_tag('ml_engineer', 'synarc')
            mlflow.log_params(self.config.model_params)
            self.model = xgb.XGBClassifier(**self.config.model_params, eval_metric='logloss', early_stopping_rounds=20, random_state=self.config.random_state)
            self.model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
            train_pred = self.model.predict(X_train)
            val_pred = self.model.predict(X_val)
            val_proba = self.model.predict_proba(X_val)[:, 1]
            metrics = {
                'train_accuracy': accuracy_score(y_train, train_pred),
                'val_accuracy': accuracy_score(y_val, val_pred),
                'val_precision': precision_score(y_val, val_pred),
                'val_recall': recall_score(y_val, val_pred),
                'val_f1': f1_score(y_val, val_pred),
                'val_roc_auc': roc_auc_score(y_val, val_proba),
            }
            mlflow.log_metrics(metrics)
            mlflow.xgboost.log_model(self.model, 'model')
            return run.info.run_id, metrics

    def explain(self, X_sample):
        self.explainer = shap.TreeExplainer(self.model)
        self.shap_values = self.explainer.shap_values(X_sample)
        return self.shap_values

    def get_feature_importance(self, feature_names):
        importance = self.model.feature_importances_
        return pd.DataFrame({'feature': feature_names, 'importance': importance}).sort_values('importance', ascending=False)

class ModelRegistrar:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.client = mlflow.tracking.MlflowClient()

    def register(self, run_id, metrics, threshold=0.80):
        if metrics.get('val_roc_auc', 0) >= threshold:
            model_uri = f"runs:/{run_id}/model"
            result = mlflow.register_model(model_uri, self.config.model_name)
            self.client.transition_model_version_stage(self.config.model_name, result.version, 'Staging')
            self.client.set_model_version_tag(self.config.model_name, result.version, 'val_roc_auc', str(metrics['val_roc_auc']))
            self.client.set_model_version_tag(self.config.model_name, result.version, 'training_date', datetime.now().isoformat())
            return {'registered': True, 'version': result.version, 'stage': 'Staging'}
        return {'registered': False, 'reason': f'val_roc_auc {metrics.get("val_roc_auc", 0):.3f} < {threshold}'}

class FullMLOpsPipeline:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            config_dict = yaml.safe_load(f)
        self.config = PipelineConfig(**config_dict)
        mlflow.set_experiment(self.config.experiment_name)
        self.validator = DataValidator(self.config)
        self.trainer = ModelTrainer(self.config)
        self.registrar = ModelRegistrar(self.config)
        self.pipeline_results = {}

    def run(self):
        print(f"Starting MLOps pipeline for {self.config.model_name}")
        df = pd.read_parquet(self.config.data_path)
        print(f"Loaded data: {len(df)} rows, {len(df.columns)} columns")
        if not self.validator.validate_schema(df):
            print(f"Schema validation failed: {self.validator.validation_results['schema']}")
            return self.validator.validation_results
        self.validator.validate_quality(df)
        quality_issues = [i for i in self.validator.validation_results.get('quality', {}).get('issues', []) if i['severity'] == 'error']
        if quality_issues:
            print(f"Data quality issues found: {quality_issues}")
        X_train, X_val, X_test, y_train, y_val, y_test = self.trainer.prepare_data(df)
        print(f"Data splits - Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
        run_id, metrics = self.trainer.train(X_train, y_train, X_val, y_val)
        print(f"Training complete. Run ID: {run_id}")
        print(f"Validation metrics: {json.dumps(metrics, indent=2)}")
        importance_df = self.trainer.get_feature_importance(self.config.feature_columns)
        print(f"Top 5 features:\n{importance_df.head(5)}")
        shap_values = self.trainer.explain(X_test.head(100))
        registration = self.registrar.register(run_id, metrics)
        print(f"Registration: {json.dumps(registration, indent=2)}")
        self.pipeline_results = {
            'run_id': run_id,
            'metrics': metrics,
            'feature_importance': importance_df.to_dict(orient='records'),
            'registration': registration,
            'validation': self.validator.validation_results,
            'completed_at': datetime.now().isoformat(),
        }
        return self.pipeline_results

pipeline = FullMLOpsPipeline('config/mlops_pipeline.yaml')
results = pipeline.run()
print(f"Pipeline completed. Model registered: {results['registration'].get('registered', False)}")
```



---

# P10: Anti-Patterns

## 10.1 Data Anti-Patterns

### 10.1.1 Training-Serving Skew

**Problem**: Features are computed differently during training and serving, causing performance degradation in production.

**Example**:
```python
# BAD: Training computes features differently than serving
def prepare_training_data(df):
    df['amount_log'] = np.log(df['amount'])  # Uses numpy
    return df

def prepare_serving_data(df):
    df['amount_log'] = np.log1p(df['amount'])  # Uses numpy.log1p - DIFFERENT!
    return df
```

**Solution**: Use the exact same feature engineering code for training and serving. Centralize feature transformations in a feature store or shared library.

```python
# GOOD: Shared feature transformation
def transform_amount(amount):
    return np.log1p(amount)  # Single source of truth

# Both training and serving call transform_amount()
```

### 10.1.2 Target Leakage

**Problem**: Future information leaks into training data, causing overly optimistic evaluation metrics.

**Example**:
```python
# BAD: Target leakage - using future information
def prepare_features(df):
    df['future_avg_price'] = df.groupby('product')['price'].transform('mean')  # Uses ALL data
    return df
```

**Solution**: Ensure time-based splits and window functions only use historical data.

```python
# GOOD: Only use past data
def prepare_features(df):
    df['past_7d_avg_price'] = df.groupby('product')['price'].transform(
        lambda x: x.shift(1).rolling(7, min_periods=1).mean()
    )
    return df
```

### 10.1.3 Data Snooping

**Problem**: Using the test set to make modeling decisions, invalidating generalization estimates.

**Signs**:
- Multiple rounds of evaluation on the same test set
- Hyperparameter tuning that incorporates test set performance
- Feature selection using test set labels

**Solution**: Hold out the test set at the very beginning, never touch it until final evaluation.

### 10.1.4 Ignoring Data Quality

**Problem**: Models trained on data with quality issues propagate those issues to production.

**Common Issues**:
- Missing values handled incorrectly (e.g., filling with zeros for all columns)
- Outliers not detected or handled
- Duplicate rows inflating confidence
- Incorrect labels not validated

**Solution**: Implement automated data validation as the first step of every pipeline.

## 10.2 Modeling Anti-Patterns

### 10.2.1 Premature Deep Learning

**Problem**: Using deep learning when simpler methods would suffice, increasing cost and complexity.

**Example**:
```python
# BAD: Using a Transformer for tabular classification with 1000 rows
model = TransformerModel(d_model=512, nhead=8, num_layers=6)
# Training time: 4 hours on A100, AUC: 0.82

# GOOD: Using XGBoost for tabular data
model = XGBClassifier(n_estimators=200, max_depth=6)
# Training time: 2 minutes on CPU, AUC: 0.81
```

**Rule of Thumb**: Try tree-based models first for tabular data. Only use deep learning when data volume > 100k rows or data is unstructured (text, image, audio).

### 10.2.2 Over-Engineering the Baseline

**Problem**: Spending weeks building a complex pipeline before establishing a simple baseline.

**Solution**: Always establish a simple baseline (linear model, heuristic, or rule-based) within the first day. Iterate from there.

### 10.2.3 Ignoring Model Calibration

**Problem**: A model with high accuracy but poor probability calibration leads to incorrect risk assessment.

**Solution**: Always check calibration curves and apply calibration if needed (Platt scaling, isotonic regression).

```python
from sklearn.calibration import CalibratedClassifierCV

# After training, calibrate probabilities
calibrated_model = CalibratedClassifierCV(base_model, method='isotonic', cv=5)
calibrated_model.fit(X_train, y_train)
```

### 10.2.4 Training on Aggregated Data

**Problem**: Training on pre-aggregated data loses individual-level signal and limits model expressiveness.

**Solution**: Train on raw, per-instance data whenever possible. Use aggregation only as features.

## 10.3 Infrastructure Anti-Patterns

### 10.3.1 Manual Model Deployment

**Problem**: SSH-ing into servers to manually copy model files and restart services.

**Consequences**:
- No audit trail of who deployed what
- Easy to deploy wrong version
- No rollback plan
- Inconsistency between environments

**Solution**: Automate deployment through CI/CD pipelines with versioned artifacts and staged rollouts.

### 10.3.2 No Experiment Tracking

**Problem**: Running experiments without tracking parameters, code versions, or results.

**Consequences**:
- Cannot reproduce results
- No way to know which hyperparameters were tried
- Wasted compute on duplicate experiments
- Difficult to collaborate

**Solution**: Use MLflow, Weights and Biases, or Neptune for every experiment.

### 10.3.3 Monolithic ML Pipeline

**Problem**: One giant pipeline that handles data processing, training, evaluation, and deployment.

**Consequences**:
- Hard to debug (failure in one step requires rerunning everything)
- Difficult to scale individual components
- Long iteration cycles
- Tight coupling between data and model teams

**Solution**: Break into modular, independently deployable stages: data pipeline, feature pipeline, training pipeline, evaluation pipeline, deployment pipeline.

### 10.3.4 No Model Versioning

**Problem**: Overwriting model files in place without version tracking.

**Consequences**:
- Cannot rollback to previous version
- No way to compare model versions
- Unclear which model is in production
- Compliance issues (audit requests)

**Solution**: Use model registry with semantic versioning.

### 10.3.5 Shadow Deployment Mistakes

**Problem**: Running shadow deployment with the same traffic as production, doubling compute costs without proper analysis.

**Solution**: Sample a representative subset of traffic for shadow deployment. Define clear success criteria before starting.

## 10.4 MLOps Anti-Patterns

### 10.4.1 Fire-and-Forget Deployment

**Problem**: Deploying a model and never checking if it degrades over time.

**Signs**:
- No monitoring dashboards
- No drift detection
- No automated retraining
- Model performance unknown until users complain

**Solution**: Implement monitoring from day one. Set up alerts for key metrics and drift.

### 10.4.2 Metrics Optimization without Business Impact

**Problem**: Optimizing ML metrics (AUC, F1) that don't correlate with business outcomes.

**Example**: Optimizing for AUC when the business cares about false positive rate at a specific threshold.

**Solution**: Define business KPIs first. Ensure ML metrics are proxies for business metrics.

### 10.4.3 Retraining Without Validation

**Problem**: Automatically retraining and deploying models without validating performance against current production model.

**Solution**: Always compare new model against current production model on a held-out test set. Only deploy if new model is statistically significantly better.

### 10.4.4 Ignoring Data Drift

**Problem**: Deploying a model and never checking if the input data distribution has changed.

**Signs**:
- Gradual performance degradation
- Increasing prediction bias
- Unexpected errors in feature computation

**Solution**: Set up automated drift detection on all input features. Alert when drift exceeds thresholds.

### 10.4.5 No Rollback Plan

**Problem**: Every deployment is considered permanent with no quick way to revert.

**Solution**: Every deployment should be accompanied by a rollback plan. Automate rollback triggers based on metric thresholds.

## 10.5 LLM Anti-Patterns

### 10.5.1 Prompt Engineering Without Evaluation

**Problem**: Iterating on prompts without systematic evaluation, leading to overfitting to specific examples.

**Solution**: Create a test set of diverse inputs with expected outputs. Evaluate prompt changes against this set.

### 10.5.2 Ignoring Context Window Limits

**Problem**: Passing too much context to LLMs, causing truncation of important information.

**Solution**: Implement dynamic context management. Use RAG to retrieve only relevant context. Set appropriate max_tokens.

### 10.5.3 No Grounding in RAG

**Problem**: Using RAG but not instructing the model to rely on retrieved context, leading to hallucination.

**Solution**: Use specific prompt instructions: "Answer based ONLY on the provided context. If the context doesn't contain relevant information, say so."

### 10.5.4 Treating LLM Output as Authoritative

**Problem**: Not verifying LLM outputs before using them in critical applications.

**Solution**: Implement output validation, fact-checking, and human-in-the-loop for high-stakes applications.

### 10.5.5 Fine-Tuning Everything

**Problem**: Fine-tuning large models for every task when prompting or RAG would suffice.

**Solution**: Try prompting first, then RAG, then PEFT (LoRA/QLoRA), and only then full fine-tuning.

## 10.6 Organizational Anti-Patterns

### 10.6.1 Two-Pizza Team Model Without Communication

**Problem**: Small, independent teams building models in isolation without sharing infrastructure or knowledge.

**Consequences**:
- Duplicate tooling
- Inconsistent practices
- No shared feature store
- Hard to move models between teams

**Solution**: Establish central ML platform team. Mandate use of shared infrastructure (feature store, model registry, experiment tracking).

### 10.6.2 Research-Driven Without Engineering Support

**Problem**: Data scientists building models without ML engineering support, leading to production issues.

**Solution**: Embed ML engineers with data science teams from the start. Use cross-functional teams.

### 10.6.3 Skipping the Design Doc

**Problem**: Building ML systems without architectural review, leading to costly rework.

**Solution**: Require design documents for all ML system changes. Include architecture diagrams, data flow, failure modes, and cost estimates.

---

# P11: Quality Gates

## 11.1 Quality Gate Framework

Quality gates are automated checks that must pass before a model can move to the next stage in the ML lifecycle.

### 11.1.1 Gate Hierarchy

```
                          ┌─────────────────────┐
                          │   Business Gate      │
                          │ (ROI > 3x, SLA met)  │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   Production Gate    │
                          │ (Shadow test passes, │
                          │  A/B test significant)│
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   Staging Gate       │
                          │ (Offline metrics     │
                          │  above threshold)    │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   Development Gate   │
                          │ (Unit tests pass,    │
                          │  data validated)     │
                          └─────────────────────┘
```

## 11.2 Development Gate

### 11.2.1 Code Quality

| Check | Tool | Threshold | Action on Failure |
|---|---|---|---|---|
| Linting | ruff | Zero errors | Block PR merge |
| Type checking | mypy | Zero errors | Block PR merge |
| Unit test coverage | pytest | > 80% | Warning |
| Security scan | bandit | Zero high/critical | Block PR merge |
| Dependency audit | pip-audit | Zero known vulns | Block PR merge |

### 11.2.2 Data Quality

| Check | Method | Threshold |
|---|---|---|
| Schema validation | Great Expectations | 100% fields match |
| Missing rate | Per column check | < 5% per field |
| Duplicate rate | Row hash check | < 1% |
| Distribution stability | PSI / KS test | PSI < 0.1 |
| Label distribution | Value counts | Within expected range |
| Data freshness | Max timestamp | < 24h old |

### 11.2.3 Reproducibility

- Random seeds recorded
- Code version (git SHA) logged
- Dataset version logged
- Environment (conda/docker) frozen
- Training configuration serialized

## 11.3 Staging Gate

### 11.3.1 Model Performance Thresholds

| Task Type | Metric | Minimum Threshold | Target Threshold |
|---|---|---|---|
| Binary Classification | AUC-ROC | 0.80 | 0.90 |
| Binary Classification | F1 Score | 0.75 | 0.85 |
| Binary Classification | Precision | 0.70 | 0.85 |
| Binary Classification | Recall | 0.70 | 0.85 |
| Multi-class Classification | Accuracy | 0.75 | 0.85 |
| Multi-class Classification | F1 Macro | 0.70 | 0.80 |
| Regression | R2 | 0.60 | 0.80 |
| Regression | RMSE | < 2x baseline | < 1.5x baseline |
| Regression | MAPE | < 15% | < 10% |
| Ranking | NDCG@10 | 0.60 | 0.75 |
| Ranking | MAP | 0.50 | 0.65 |
| Clustering | Silhouette | 0.30 | 0.50 |
| LLM Generation | BERTScore F1 | 0.80 | 0.90 |
| LLM Generation | ROUGE-L | 0.30 | 0.45 |

### 11.3.2 Model Comparison

| Comparison | Threshold | Action |
|---|---|---|
| vs Baseline (simple model) | > 10% improvement | Pass |
| vs Previous production version | Statistically significant improvement | Pass |
| vs Heuristic rule | > 20% improvement | Pass |
| Training-serving metric gap | < 0.03 (3%) | Pass |

### 11.3.3 Resource Constraints

| Resource | Maximum | Action |
|---|---|---|
| Model size | 500 MB | Warning > threshold, Block > 2GB |
| Inference latency (p99) | 100ms | Warning > 100ms, Block > 500ms |
| Memory (peak) | 4 GB inference, 32 GB training | Block if exceeded |
| GPU hours per training run | 100 hours | Warning, require cost approval |
| Cold start time | 30 seconds | Block if exceeded |

## 11.4 Production Gate

### 11.4.1 Shadow Deployment Validation

| Check | Duration | Threshold |
|---|---|---|
| Latency comparison | 48 hours | New model p99 < 1.5x production p99 |
| Error rate | 48 hours | < 0.1% higher than production |
| Prediction distribution | 48 hours | JS divergence < 0.05 |
| Feature value range | 48 hours | All features within expected range |
| Memory leak test | 48 hours | No monotonic memory increase |

### 11.4.2 Canary Deployment Checks

| Stage | Traffic % | Duration | Success Criteria |
|---|---|---|---|
| Phase 1 | 1% | 1 hour | Error rate < 0.1%, Latency < SLA |
| Phase 2 | 5% | 4 hours | No alert triggered |
| Phase 3 | 20% | 12 hours | Business metrics stable |
| Phase 4 | 50% | 24 hours | A/B test significant improvement |
| Phase 5 | 100% | Full rollout | All criteria met |

### 11.4.3 Rollback Conditions

| Condition | Threshold | Action |
|---|---|---|
| Error rate increase | > 1% absolute increase | Automated rollback |
| Latency increase | > 2x production p99 | Automated rollback |
| Business metric drop | > 5% relative drop | Automated rollback + notify |
| User complaints | > 10 reports in 1 hour | Manual rollback |
| Data drift | > 30% features drifted | Alert, evaluate rollback |

## 11.5 Monitoring Gate

### 11.5.1 Ongoing Monitoring Checks

| Check | Frequency | Threshold | Action |
|---|---|---|---|
| Data drift (PSI) | Hourly | > 0.2 on any top-5 feature | Alert, evaluate retraining |
| Prediction drift (PSI) | Hourly | > 0.2 | Alert |
| Concept drift | Daily | Detected via ADWIN/DDM | Alert, trigger retraining |
| Accuracy monitoring | Daily | > 0.02 drop from baseline | Alert, investigate |
| Latency monitoring | Per request | > 3x baseline for 5 min | Alert, scale up |
| Error rate | Per minute | > 1% for 5 min | Pager alert |
| Throughput | Per minute | < 50% expected for 15 min | Alert, investigate |
| Resource usage | Per minute | CPU > 90%, Memory > 85% | Alert, scale |
| Data volume | Hourly | < 80% expected | Alert, check pipeline |
| Feature freshness | Hourly | Features > 2x expected TTL | Alert |

### 11.5.2 Automated Responses

| Detection | Severity | Response |
|---|---|---|
| Data drift | Medium | Log, alert ML engineer |
| Concept drift | High | Log, alert ML engineer, prepare retraining |
| Performance degradation | High | Log, pager, consider rollback |
| Model serving down | Critical | Pager, auto-rollback if recent deployment |
| Cost anomaly | Low | Log, email to ML engineer + FinOps |
| Data pipeline failure | Critical | Pager data engineering team |

## 11.6 Compliance and Governance Gate

### 11.6.1 Required Documentation

- [ ] Model card completed
- [ ] Bias/fairness analysis (for models affecting people)
- [ ] Data privacy review (for models using PII)
- [ ] Cost impact analysis (for expensive models)
- [ ] SLA definition and verification
- [ ] Incident response plan
- [ ] Rollback procedure documented
- [ ] Monitoring dashboard configured
- [ ] Alert thresholds defined
- [ ] Runbook created

### 11.6.2 Model Card Template

```markdown
# Model Card: {model_name}

## Model Details
- **Developer**: {team_name}
- **Model Date**: {date}
- **Model Version**: {version}
- **Model Type**: {architecture}
- **Framework**: {framework}
- **License**: {license}

## Intended Use
- **Primary Use**: {primary_use_case}
- **Out-of-Scope Use**: {not_recommended_uses}

## Training Data
- **Source**: {data_source}
- **Volume**: {row_count}
- **Labeling**: {labeling_method}
- **Date Range**: {start_date} to {end_date}

## Evaluation Data
- **Test Set Size**: {test_size}
- **Test Set Source**: {test_source}

## Performance
| Metric | Value |
|---|---|
| Accuracy | {value} |
| F1 Score | {value} |
| AUC-ROC | {value} |
| Latency p50/p99 | {value} |

## Ethical Considerations
- **Bias Analysis**: {bias_findings}
- **Fairness Metrics**: {fairness_results}
- **Mitigations**: {mitigation_strategies}

## Caveats and Recommendations
- {caveat_1}
- {caveat_2}
```

### 11.6.3 Fairness and Bias Checklist

- [ ] Disaggregated evaluation across demographic groups
- [ ] Equal opportunity difference < 0.1
- [ ] Equalized odds difference < 0.1
- [ ] Demographic parity ratio between 0.8 and 1.25
- [ ] If disparities found: mitigation plan documented
- [ ] Sensitive features identified and handled
- [ ] Explainability analysis completed (SHAP/LIME)
- [ ] Human-in-the-loop review for high-stakes decisions

## 11.7 Gate Automation Implementation

```python
from dataclasses import dataclass, field
from typing import Dict, Any, Callable, List, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

@dataclass
class GateResult:
    gate_name: str
    passed: bool
    score: float
    details: Dict[str, Any]
    timestamp: str = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

    def to_dict(self):
        return {'gate_name': self.gate_name, 'passed': self.passed, 'score': self.score, 'details': self.details, 'timestamp': self.timestamp}

class QualityGate:
    def __init__(self, name: str, check_fn: Callable, threshold: float, severity: str = 'medium'):
        self.name = name
        self.check_fn = check_fn
        self.threshold = threshold
        self.severity = severity

    def evaluate(self, context: Dict) -> GateResult:
        try:
            score, details = self.check_fn(context)
            passed = score >= self.threshold if isinstance(self.threshold, (int, float)) else details.get('passed', False)
            return GateResult(gate_name=self.name, passed=passed, score=score if isinstance(score, (int, float)) else 0.0, details=details)
        except Exception as e:
            logger.error(f"Gate {self.name} evaluation failed: {e}")
            return GateResult(gate_name=self.name, passed=False, score=0.0, details={'error': str(e)})

class QualityGatePipeline:
    def __init__(self, gates: List[QualityGate] = None):
        self.gates = gates or []

    def add_gate(self, gate: QualityGate):
        self.gates.append(gate)

    def evaluate_all(self, context: Dict) -> Dict:
        results = {}
        all_passed = True
        for gate in self.gates:
            result = gate.evaluate(context)
            results[gate.name] = result.to_dict()
            if not result.passed:
                all_passed = False
                logger.warning(f"Gate '{gate.name}' FAILED: {result.details}")
            else:
                logger.info(f"Gate '{gate.name}' PASSED: score={result.score}")
        return {'all_passed': all_passed, 'gates': results, 'evaluated_at': datetime.now().isoformat()}

    def get_failed_gates(self, context: Dict) -> List[str]:
        results = self.evaluate_all(context)
        return [name for name, result in results['gates'].items() if not result['passed']]


# Example quality gate implementations

def data_quality_gate(context):
    df = context.get('dataframe')
    expected_schema = context.get('expected_schema', {})
    issues = []
    for col, col_type in expected_schema.items():
        if col not in df.columns:
            issues.append(f"Missing column: {col}")
        elif df[col].dtype != col_type:
            issues.append(f"Column {col}: expected {col_type}, got {df[col].dtype}")
    missing_rate = df.isnull().sum().max()
    if missing_rate > 0.05:
        issues.append(f"Missing rate {missing_rate:.2%} > 5%")
    score = 1.0 - (len(issues) * 0.2)
    return max(0.0, score), {'issues': issues, 'columns_passed': len(expected_schema) - len(issues), 'total_columns': len(expected_schema)}

def model_performance_gate(context):
    metrics = context.get('metrics', {})
    thresholds = context.get('thresholds', {})
    failures = []
    for metric, value in metrics.items():
        threshold = thresholds.get(metric)
        if threshold and value < threshold:
            failures.append(f"{metric}: {value} < threshold {threshold}")
    score = metrics.get('val_accuracy', metrics.get('f1_macro', 0))
    return score, {'failures': failures, 'metrics': metrics}

def latency_gate(context):
    p99_latency = context.get('p99_latency_ms', 0)
    max_latency = context.get('max_latency_ms', 100)
    passed = p99_latency <= max_latency
    score = max(0.0, 1.0 - (p99_latency / max_latency - 1)) if not passed else 1.0
    return score, {'p99_latency_ms': p99_latency, 'max_allowed_ms': max_latency, 'passed': passed}

def fairness_gate(context):
    group_metrics = context.get('group_metrics', {})
    disparities = []
    all_metrics = list(group_metrics.values())
    if len(all_metrics) > 1:
        min_val = min(all_metrics)
        max_val = max(all_metrics)
        disparity = max_val - min_val if min_val > 0 else max_val
        if disparity > 0.1:
            disparities.append(f"Group disparity: {disparity:.3f} > 0.1")
    score = 1.0 - (len(disparities) * 0.3)
    return max(0.0, score), {'disparities': disparities, 'group_metrics': group_metrics}

def drift_gate(context):
    drift_scores = context.get('drift_scores', {})
    drifted = [f for f, s in drift_scores.items() if s > 0.2]
    score = 1.0 - (len(drifted) * 0.1)
    return max(0.0, score), {'drifted_features': drifted, 'total_features': len(drift_scores), 'drift_rate': len(drifted) / max(len(drift_scores), 1)}

def cost_gate(context):
    monthly_cost = context.get('monthly_cost', 0)
    budget = context.get('budget', 1000)
    passed = monthly_cost <= budget
    score = max(0.0, 1.0 - (monthly_cost / budget - 1)) if not passed else 1.0
    return score, {'monthly_cost': monthly_cost, 'budget': budget, 'over_budget_by': max(0, monthly_cost - budget)}

def reproducibility_gate(context):
    checks = {
        'random_seed_set': context.get('random_seed') is not None,
        'git_commit_recorded': context.get('git_commit') is not None,
        'dataset_version_recorded': context.get('dataset_version') is not None,
        'environment_frozen': context.get('environment') is not None,
        'config_serialized': context.get('config') is not None,
    }
    passed_checks = sum(1 for v in checks.values() if v)
    total_checks = len(checks)
    score = passed_checks / total_checks
    return score, {'checks': checks, 'passed': passed_checks, 'total': total_checks}


# Usage example
gate_pipeline = QualityGatePipeline([
    QualityGate('data_quality', data_quality_gate, threshold=0.8, severity='high'),
    QualityGate('model_performance', model_performance_gate, threshold=0.80, severity='critical'),
    QualityGate('latency', latency_gate, threshold=1.0, severity='high'),
    QualityGate('fairness', fairness_gate, threshold=0.7, severity='critical'),
    QualityGate('drift', drift_gate, threshold=0.7, severity='medium'),
    QualityGate('cost', cost_gate, threshold=1.0, severity='low'),
    QualityGate('reproducibility', reproducibility_gate, threshold=0.8, severity='medium'),
])

context = {
    'dataframe': df,
    'expected_schema': {'feature_1': 'float64', 'feature_2': 'int64', 'target': 'int64'},
    'metrics': {'val_accuracy': 0.87, 'f1_macro': 0.85},
    'thresholds': {'val_accuracy': 0.80, 'f1_macro': 0.75},
    'p99_latency_ms': 45,
    'max_latency_ms': 100,
    'group_metrics': {'group_a': 0.85, 'group_b': 0.83, 'group_c': 0.78},
    'drift_scores': {'feature_1': 0.05, 'feature_2': 0.12, 'feature_3': 0.03},
    'monthly_cost': 450,
    'budget': 1000,
    'random_seed': 42,
    'git_commit': 'a1b2c3d4',
    'dataset_version': 'v4.2.1',
    'environment': 'conda.yaml',
    'config': 'train_config.yaml',
}

results = gate_pipeline.evaluate_all(context)
print(json.dumps(results, indent=2))
```

## 11.8 Quality Gate Summary Table

| Gate | Stage | Criticality | When to Run | Blocking |
|---|---|---|---|---|
| Code Quality | Development | High | On every PR | Yes |
| Data Quality | Development | High | On every PR | Yes |
| Unit Tests | Development | High | On every PR | Yes |
| Integration Tests | Development | Medium | On merge to main | Yes |
| Model Performance | Staging | Critical | Before staging promotion | Yes |
| Model Comparison | Staging | Critical | Before staging promotion | Yes |
| Resource Constraints | Staging | Medium | Before staging promotion | Warning |
| Shadow Deployment | Pre-Production | Critical | Before production promotion | Yes |
| Canary Phase 1 | Production | Critical | After production deploy | Auto-rollback |
| Canary Phase 2 | Production | Critical | After canary ramp | Auto-rollback |
| Data Drift | Production | High | Hourly | Alert |
| Performance Degradation | Production | Critical | Per-batch | Alert + Auto-rollback |
| Fairness/Bias | Compliance | Critical | Before production + quarterly | Yes |
| Cost Analysis | Compliance | Medium | Monthly | Warning |
| Model Card | Compliance | High | Before production | Yes |
| Incident Runbook | Compliance | Medium | Before production | Warning |

---

*This ML Engineer skill definition is maintained by the synarc ML Platform team. For questions or updates, please submit a PR or open an issue in the synarc repository.*


