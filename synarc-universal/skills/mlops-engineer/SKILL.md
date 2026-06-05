---
name: mlops-engineer
schema: skill-pack/v1
skill_type:
  - capability
  - workflow
dependencies:
  - synarc-core: ">=6.0.0"
  - ml-engineer: ">=2.0.0"
  - sre-engineer: ">=2.0.0"
title: MLOps Engineer — Model Serving, GPU Infrastructure, Inference Cost
description: MLOps engineering reasoning — model serving architectures (real-time, batch, streaming), GPU infrastructure and scheduling, inference cost optimization, model registry and versioning, model rollout strategies (canary, blue-green, shadow), inference observability (latency, throughput, GPU utilization, cost), autoscaling policies, model compression (quantization, distillation, pruning), hardware selection (GPU SKU, TPU, CPU), cold-start mitigation. Distinct from ml-engineer (training) — this skill is about production model operations. Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - mlops
  - model-serving
  - inference
  - gpu-infrastructure
  - model-registry
  - model-rollout
  - inference-cost
  - quantization
  - autoscaling
  - cold-start
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# MLOps Engineer — Model Serving, GPU Infrastructure, Inference Cost

Inherits synarc core. All synarc prohibitions apply.

MLOps is the operational discipline of running ML models in production. ml-engineer trains. mlops-engineer serves. This skill covers model serving, GPU infra, inference cost, rollout, observability, and compression.


## P2 — MODEL SERVING ARCHITECTURES

### P2.1 — Three Serving Patterns

```
REAL-TIME (online, low-latency):
  HTTP/gRPC endpoint, request/response
  Latency target: < 100ms p95 (chat), < 1s p95 (general)
  Use for: chatbots, search ranking, recommendations
  Tech: Triton, vLLM, TensorRT, custom Flask/FastAPI
  Cost: high (always-on GPU)

BATCH (offline, high-throughput):
  Process many requests in parallel
  Latency tolerance: minutes to hours
  Use for: embeddings generation, bulk classification, offline eval
  Tech: Spark, Ray, custom batch jobs
  Cost: low (spot or scheduled GPU)

STREAMING (continuous):
  Consume from stream, emit predictions
  Latency target: sub-second per event
  Use for: fraud detection, real-time recommendations, anomaly detection
  Tech: Flink, Kafka Streams + model, custom
  Cost: medium (depends on stream rate)

HYBRID:
  Real-time for hot path, batch for cold path
  Cache common queries, batch the rest
  Best cost/latency tradeoff
```

### P2.2 — Serving Stack Selection

```
PYTHON STACKS:
  - FastAPI + custom model wrapper: simple, flexible, slow
  - Ray Serve: scalable, Pythonic, good for ensembles
  - BentoML: model packaging + serving
  - Triton Inference Server: NVIDIA-optimized, multi-framework

NATIVE STACKS:
  - TensorRT (NVIDIA): highest perf on NVIDIA GPU
  - vLLM (LLM-specific): PagedAttention, high throughput
  - llama.cpp / GGUF: CPU/edge inference for LLMs
  - TFLite / ONNX Runtime: cross-platform, mobile/edge

DECISION FACTORS:
  - Model type: LLM, vision, tabular, recommender
  - Latency target: ms range
  - Throughput target: QPS
  - Hardware: NVIDIA, AMD, TPU, CPU
  - Team skill: Python, C++, Rust
  - Cost: GPU hour budget
```


## P3 — GPU INFRASTRUCTURE

### P3.1 — GPU Selection

```
NVIDIA TIERS (2026):
  - H100:        high-end, training + serving, $2-4/hr
  - A100:        workhorse, training + serving, $1-2/hr
  - L40S:        inference-optimized, mid-range, $0.5-1/hr
  - L4:          small inference, edge, $0.2-0.5/hr
  - T4:          legacy, cheap, $0.1-0.3/hr

WHEN TO USE EACH:
  - H100: frontier LLM serving, large batch training
  - A100: production LLM serving at scale
  - L40S: most inference workloads
  - L4: small models, cost-sensitive, edge
  - T4: legacy, very cheap, low throughput

ALTERNATIVES:
  - AMD MI300X: NVIDIA alternative, cost-competitive
  - TPU v5: Google Cloud, training + serving
  - CPU: small models, latency-tolerant, cheap
```

### P3.2 — GPU Scheduling

```
SCHEDULING STRATEGIES:
  DEDICATED:
    - One model, one GPU pool
    - Predictable, simple
    - Wasted capacity if traffic is variable

  SHARED (MIG/MPS):
    - Multiple models, partitioned GPU
    - Better utilization
    - Risk: noisy neighbor

  BURSTABLE:
    - Baseline on small pool, burst to large pool
    - Cost-efficient for variable traffic
    - Risk: cold-start latency

  SERVERLESS:
    - Pay per request, scale to zero
    - Best for low traffic
    - Cold start: 5-30s (problematic for real-time)

ORCHESTRATORS:
  - Kubernetes + GPU operator
  - Ray + KubeRay
  - Slurm (training)
  - SageMaker / Vertex / Azure ML (managed)
```

## P4 — INFERENCE COST OPTIMIZATION

### P4.1 — Cost Levers

```
LEVERS (in order of impact):
  1. Batching:       5-10x throughput per GPU
  2. Quantization:   2-4x throughput, 50-75% memory reduction
  3. Caching:        eliminate repeated work
  4. Right-sizing:   don't use H100 for small model
  5. Spot instances: 60-90% cost reduction
  6. Compression:    smaller model, faster inference

QUANTIZATION:
  - FP32 → FP16:  2x speedup, minimal quality loss
  - FP16 → INT8:  2-4x speedup, small quality loss
  - INT8 → INT4:  1.5-2x speedup, may need quality check
  - Always eval quality after quantization

BATCHING:
  - Dynamic batching: combine requests within window
  - Continuous batching: LLM-specific, very effective
  - Optimal batch size: depends on model, GPU, latency target
  - Eval: throughput vs p95 latency tradeoff
```

### P4.2 — Cost-Quality Tradeoff

```
COST PER 1M TOKENS (LLM example, 2026):
  GPT-4 class:   $10-30 input, $30-60 output
  Sonnet class:  $3-5   input, $15-20 output
  Haiku class:   $0.5-1 input, $2-4   output
  Open 8B local:  $0.10-0.30 (amortized GPU)

QUALITY TRADEOFF:
  Each step down in model size = quality drop
  Measure: pass rate on frozen eval set
  Acceptable: drop < 3% for 5x cost reduction

ROUTER PATTERN:
  Use cheap model first
  Fall back to expensive only when cheap fails confidence threshold
  Often 50-80% cost reduction with same quality
```

## P5 — MODEL REGISTRY & VERSIONING

### P5.1 — Model Registry Contents

```
EVERY REGISTERED MODEL HAS:
  - id:           unique identifier (e.g., "fraud-detector")
  - version:      semver (MAJOR.MINOR.PATCH)
  - framework:    pytorch / tensorflow / onnx / gguf
  - artifact:     storage URI (S3, GCS, etc.)
  - hash:         content hash (sha256)
  - signature:    input/output schema
  - metrics:      eval set scores at registration
  - lineage:      training data, code, hyperparams
  - stage:        dev / staging / canary / production / archived
  - owner:        team
  - created:      timestamp
  - rollouts:     history of canary + production
```

### P5.2 — Versioning Strategy

```
SEMANTIC VERSIONING FOR MODELS:
  MAJOR:  breaking input/output schema change
  MINOR:  quality improvement, no schema change
  PATCH:  retrain, weights only

LINEAGE:
  - Code:           git commit hash of training code
  - Data:           data version (DVC, lakeFS, etc.)
  - Hyperparams:    full config
  - Eval results:   scores on frozen set

DO NOT:
  - Overwrite a production model (always create new version)
  - Delete old versions (keep for rollback, audit)
  - Skip eval before promotion
```

## P6 — MODEL ROLLOUT

### P6.1 — Rollout Strategies

```
CANARY:
  - New model handles X% of traffic
  - Compare quality + cost + latency to baseline
  - Gradually increase: 1% → 5% → 25% → 50% → 100%
  - Roll back on regression

BLUE-GREEN:
  - New model takes 100% traffic at the switch
  - Old model still running, easy rollback
  - Risk: sudden behavior change

SHADOW:
  - New model runs alongside, doesn't affect users
  - Compare predictions to production
  - Promote only when confidence is high
  - Slowest but safest

PROGRESSIVE DELIVERY:
  - Per-user cohort: new model for new users first
  - Per-region: deploy region by region
  - Per-tier: enterprise first or free first
```

### P6.2 — Rollout Gates

```
EVERY PROMOTION STEP MUST PASS:
  - Eval set:        new model >= old on frozen set
  - Latency:         p95 within budget
  - Error rate:      no regression
  - Cost:            within budget
  - Sample review:   50+ outputs human-checked
  - Canary metrics:  no regression in canary period

ROLLBACK:
  - Automatic on: error rate > 2x, latency > 1.5x, cost spike
  - Manual on: any SEV-2+ incident
  - Rollback to last-known-good version
  - Investigate before retry
```

## P7 — INFERENCE OBSERVABILITY

### P7.1 — Key Metrics

```
PER REQUEST:
  - latency_ms:      total, time-to-first-token (LLM)
  - tokens_in:       input length
  - tokens_out:      output length
  - batch_size:      actual batch size
  - gpu_utilization: at request time

AGGREGATE:
  - QPS:              requests per second
  - latency p50/p95/p99
  - throughput:       tokens per second
  - gpu_utilization:  average over time
  - cost_per_request: dollars
  - error_rate:       4xx, 5xx, timeout
  - cache_hit_rate:   if caching enabled

BUSINESS:
  - success_rate:     task completed
  - override_rate:    user changed AI output
  - regeneration_rate: user asked for retry
```

### P7.2 — What to Alert On

```
CRITICAL (page immediately):
  - Error rate > 5x baseline
  - Latency p95 > 2x budget
  - All pods down
  - Cost spike > 2x

WARNING (slack):
  - Error rate > 2x baseline
  - Latency p95 > 1.5x budget
  - GPU utilization > 90% sustained
  - Cost trend up > 20% week over week

INFO (dashboard):
  - Daily cost
  - Latency distribution
  - Throughput trend
  - Cache hit rate
```

## P8 — MODEL COMPRESSION

### P8.1 — When to Compress

```
COMPRESS WHEN:
  - Latency too high for current model
  - Cost too high
  - Memory too large for target hardware
  - Need to run on edge / mobile

DO NOT COMPRESS WHEN:
  - Quality is already barely meeting bar (compression drops quality)
  - Latency and cost are already acceptable
  - Eval set is not robust enough to measure quality loss
```

### P8.2 — Compression Techniques

```
QUANTIZATION:
  - Post-training:    quantize existing weights
  - Quantization-aware training: train with quantization in mind
  - Best for: LLMs, large models
  - Trade: small quality loss, 2-4x speedup

DISTILLATION:
  - Train small model to mimic large model
  - Best for: when you control training
  - Trade: 10-30% quality loss, 5-10x speedup

PRUNING:
  - Remove low-importance weights
  - Structured (whole neurons) or unstructured
  - Best for: over-parameterized models
  - Trade: small quality loss, 1.5-3x speedup

ARCHITECTURE SEARCH:
  - Find a smaller architecture for the task
  - Best for: greenfield, no existing model
  - Trade: high engineering cost, large quality gain

EVAL AFTER EVERY TECHNIQUE:
  - Frozen eval set: must not regress
  - Adversarial eval: must not regress
  - Real production sample: spot check
```

## P9 — OUTPUT FORMATS

### P9.1 — Model Serving Spec

```
MODEL:           [name + version]
PURPOSE:         [task, use case]
SERVING TYPE:    [real-time / batch / streaming]
FRAMEWORK:       [vLLM / Triton / custom]
HARDWARE:        [GPU SKU, count]
QUANTIZATION:    [FP16 / INT8 / INT4]
BATCHING:        [dynamic, max batch size, window]
LATENCY TARGET:  [p50, p95, p99]
THROUGHPUT:      [QPS target]
COST BUDGET:     [$/1k requests, $/month]
AUTOSCALING:     [min/max replicas, scale metric]
OBSERVABILITY:   [metrics, traces, logs]
ROLLOUT:         [canary %, gate criteria]
ROLLBACK:        [auto-trigger, manual path]
```

### P9.2 — Model Rollout Runbook

```
ROLLOUT:     [model] v[N] → v[N+1]
STRATEGY:    canary
START:       [timestamp]
OWNER:       [team]

GATES (must all pass before promotion):
  [ ] Frozen eval set:  new >= old
  [ ] Canary latency:   p95 within 110% of old
  [ ] Canary error:     < 1.5x of old
  [ ] Canary cost:       < 1.2x of old
  [ ] Sample review:     50 outputs human-checked
  [ ] Stakeholder sign-off

ROLLOUT SCHEDULE:
  1% traffic:    hold 1 hour
  5% traffic:    hold 4 hours
  25% traffic:   hold 12 hours
  50% traffic:   hold 24 hours
  100% traffic:  monitor for 7 days

ROLLBACK TRIGGERS:
  - SEV-1 incident
  - Error rate > 2x baseline
  - Latency p95 > 1.5x budget
  - User feedback spike
```

## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Real-time serving for batch workload | Wasteful, expensive | Batch for offline, real-time for latency-sensitive |
| H100 for small model | 10x cost, no benefit | Right-size hardware to model |
| No quantization, full FP32 | 2-4x slower, more memory | Quantize unless quality bar fails |
| No batching, 1 request per GPU | Massive waste | Dynamic batching, 5-10x throughput |
| Overwrite production model in place | Cannot rollback | Always new version, registry tracks history |
| No eval before promotion | Quality regressions ship | Frozen eval set, gate every promotion |
| No rollback plan | Stuck with bad model | Auto-rollback triggers, manual path |
| Cold start ignored | First requests timeout | Warm pool, model preloading |
| Cost not monitored | Bill shock | Per-request cost, daily reports, alerts |
| Single model on single GPU, no scaling | SPOF, no burst | Replicated, autoscaled |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every model rollout, cost change, or hardware change.*

*Escalate to sre-engineer when: serving has reliability or capacity issues. Escalate to security-engineer when: serving processes PII or has external exposure. Escalate to ml-engineer when: model quality issue needs retraining.*
