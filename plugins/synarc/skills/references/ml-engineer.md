---
title: ML Engineer
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc
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

# Purpose

Design, build, and maintain ML systems that are reliable, scalable, observable, and cost-effective — bridging data science research and production engineering across the full ML lifecycle.

# Scope

ML lifecycle architecture (business problem → data → modeling → training → deployment → monitoring), inference patterns (batch, real-time, streaming), feature stores, model registries, distributed training, MLOps, pipeline design, evaluation protocol. Does not cover data science research or domain-specific model architectures.

# Inputs

Business requirements, data sources, feature specifications, training infrastructure, model registry state, monitoring metrics.

# Outputs

Architected ML systems, training pipelines, deployed model endpoints, monitoring dashboards, experiment records, cost-optimized serving infrastructure.

---

## 1. ML Development Lifecycle

Six-phase lifecycle: Business Problem → Data Acquisition → ML Modeling → Training & Eval → Deployment → Monitor & Retrain.

### Phase 1: Business Problem Definition
- Translate business problem into ML task; define success metrics (not just ML metrics — business KPIs)
- Establish baseline (heuristic, simple model, or human performance); conduct feasibility study
- Feasibility checklist: labeled data volume >10k, historical data represents production, latency/throughput/reliability SLAs achievable, regulatory constraints

### Phase 2: Data Acquisition & Validation
- Identify sources (OLTP, event streams, data lakes, third-party); validate completeness (>99%), uniqueness (<1% dupes), timeliness, distribution stability (PSI <0.1)
- EDA protocol: univariate → bivariate → temporal → segment → automated profiling (Great Expectations)
- Labeling: manual, semi-supervised, weak supervision (Snorkel), active learning, synthetic data
- Label quality: Cohen's kappa >0.7, error rate <5%, distribution match JS divergence <0.1

### Phase 3: ML Modeling
- Algorithm selection: data volume × interpretability × latency requirements
- Always start with simple baselines (random, majority class, heuristic, linear, shallow tree)
- Experiment tracking: capture git_commit, dataset version, hyperparameters, all metrics, model artifacts, hardware, training time

### Phase 4: Training & Evaluation
- Hyperparameter tuning: Grid Search (few params) → Random Search → Bayesian Optimization → Hyperband/ASHA → PBT
- Offline evaluation: holdout test set, cross-validation (k=5/10), temporal validation for time-series, stratified splits for imbalanced
- Online evaluation: A/B testing (p<0.05), interleaved experiments, shadow deployment, canary (1%→5%→20%→100%)

### Phase 5: Deployment
- Strategies: Shadow (0% traffic, validation) → Canary (gradual) → Blue/Green (full switch) → Rolling (gradual per node) → A/B Test (segmented)
- Deployment checklist: offline thresholds pass, 48h shadow validation passes, container tagged with git SHA, model versioned, rollback plan documented, monitoring/alerts configured

### Phase 6: Monitoring & Retraining
- Six monitoring pillars: Data drift, Prediction drift, Concept drift, Model performance, System metrics (latency/throughput/memory/GPU), Data quality
- Automated retraining triggers: scheduled (daily/weekly), data volume threshold, PSI >0.2 on top-5 features, AUC drop >0.02, concept drift detected (ADWIN/DDM/Page-Hinkley), manual

## 2. Architecture Patterns

### Batch Inference
`Data Lake → Feature Pipeline → Batch Job → ML Model → Predictions → Serving DB`
- Use for: large-scale scoring (millions+), no real-time requirement, complex feature engineering
- Throughput: 1M-10M predictions/hour; cost: $0.50-$5/1M (CPU)

### Real-Time Inference
`Client → API Gateway → Feature Server → Model Server → Response`
- Use for: fraud detection, recommendation, personalization; latency <100ms p99
- Optimization techniques: quantization (2-4x), ONNX (1.5-3x), TensorRT (2-5x), distillation (2-10x), speculative decoding for LLMs (1.5-2x)

### Streaming Inference
`Event Source (Kafka/Kinesis) → Stream Processor (Flink/Spark) → Feature Transformer → Model Inference → Output Sink`
- Use for: real-time fraud on transactions, ad bidding, IoT anomaly detection, content moderation

### Feature Store
Components: Registry (metadata), Online Store (Redis/DynamoDB), Offline Store (S3/Parquet), Transformation Engine (Spark)
- Ensures training/serving consistency, enables feature sharing across teams

### Model Registry
Stages: Register (Staging, automated) → Promote (Production, human review) → Rollback (Staging, automated+notify) → Archive (30d no traffic)
- Store: model artifacts, config, preprocessing pipeline, metrics, lineage, dependencies

## 3. Distributed Training

| Strategy | Comm | Memory | Use Case |
|---|---|---|---|
| Data Parallel | Gradient sync (AllReduce) | Low per GPU | Model fits single GPU |
| Model Parallel | Layer activations | Medium | Model too large for 1 GPU |
| Pipeline Parallel | Micro-batches | Medium | Very large models |
| Tensor Parallel | Tensor slicing | High | Extremely large models |
| FSDP | Sharded optimizer states | Lowest per GPU | Large models, limited memory |
| DeepSpeed ZeRO | Partitioned optimizer/grad/params | Lowest per GPU | Very large models |

Use PyTorch DDP for multi-GPU within a node; FSDP or DeepSpeed for larger scale.

## 4. Pipeline Design Principles

1. Determinism (same input → same output, record seeds)
2. Reproducibility (full lineage capture)
3. Idempotency (re-running produces same results)
4. Incrementality (only process changed data)
5. Observability (every stage logs metrics, duration, data counts)
6. Failure isolation (failure in one stage does not cascade)
7. Backfillability (ability to re-process historical data)

Pipeline stages: `Raw Data → Validation (Great Expectations) → Cleaning → Feature Engineering → Training → Evaluation → Deployment`

## 5. Feature Engineering

| Feature Type | Cost | Example |
|---|---|---|
| Raw | None | Age, income |
| Aggregated | Medium | Avg purchase per user |
| Temporal | Low | Hour of day, sin/cos encoding |
| Text | High | TF-IDF, BERT embeddings |
| Cross | Low | age × income |
| Embedding | Very High | Item2Vec |

Always include temporal cyclical encoding (sin/cos), frequency encoding for categoricals, and missing value indicators.

## 6. Performance Optimization

| Technique | Latency Improvement | Complexity |
|---|---|---|
| Quantization (FP16→INT8) | 2-4x | Low |
| Batch inference on server | 2-10x (throughput) | Low |
| ONNX Runtime | 1.5-3x | Low |
| TensorRT | 2-5x | Medium |
| Distillation | 2-10x | High |
| Feature pre-computation | 2-5x | Medium |
| Prediction caching | Variable | Low |

## 7. Quality Gates

Tier 1 (Hard):
- Business problem framed with success criteria
- Data quality validation passes (completeness >99%, uniqueness >99%)
- Baseline model established before complex modeling
- Experiment tracking captures all metadata
- Offline evaluation on holdout set performed
- Model passes shadow deployment (48h minimum)
- Deployment checklist completed
- Monitoring dashboards configured before production rollout

Tier 2 (Standard):
- Hyperparameter tuning uses appropriate method
- A/B test reaches statistical significance (p<0.05)
- Feature distribution drift monitored (PSI)
- Cost optimization reviewed
- Model card / documentation produced
