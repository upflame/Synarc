
---

# P6 — SERVING & DEPLOYMENT

## 6.1 Serving Architecture Patterns

### 6.1.1 Batch Inference

Production batch inference runs ML models on large datasets on a schedule or trigger.

**Architecture components**:
- Orchestrator (Airflow, Prefect) triggers batch jobs
- Spark or Ray for distributed data processing
- Model loaded from registry (MLflow, S3)
- Predictions written to serving tables or data warehouse
- Monitoring tracks data volume, latency, prediction distributions

**Best practices**:
- Use pandas UDFs in Spark for efficient model inference
- Batch size tuning for optimal throughput (1000-10000 per batch)
- Handle partial failures with retry logic and dead letter queues
- Log prediction metadata for monitoring and debugging
- Cache model artifacts locally to avoid S3 latency on each batch
- Monitor prediction distribution drift relative to training distribution

**Batch inference vs real-time**:
- Use batch when latency requirements are minutes to hours
- Use batch when scoring entire datasets (e.g., daily recommendations)
- Use batch for backfill and historical scoring
- Use real-time for user-facing predictions (<100ms latency)

### 6.1.2 Real-Time Inference

Real-time inference serves predictions with sub-second latency.

**Architecture components**:
- API Gateway for routing and authentication
- Load balancer for traffic distribution
- Model server instances (TorchServe, Triton, TF Serving, BentoML)
- Feature store client for online feature retrieval
- Response caching for repeated queries
- Pre/post-processing transformers

**Latency budget**:
- Network: 5-15ms
- Feature retrieval: 5-30ms
- Model inference: 10-100ms
- Post-processing: 1-5ms
- Total target: <150ms (varies by use case)

**Scaling strategies**:
- Horizontal scaling with Kubernetes HPA based on CPU/memory/latency
- Model replica pooling for multi-model serving
- GPU sharing with MPS or MIG for multi-tenant serving
- Request batching for GPU-efficient inference
- Predictive autoscaling based on traffic patterns
- Over-provisioning for latency-sensitive workloads (2x expected peak)

### 6.1.3 Streaming Inference

Streaming inference runs models on event streams in real-time.

**Architecture components**:
- Event source (Kafka, Kinesis, Pulsar)
- Stream processor (Flink, Kafka Streams, Spark Streaming, RisingWave)
- State store (RocksDB, Redis, MongoDB) for feature computation
- Model loaded in stream processor or external serving endpoint
- Prediction output to downstream topics or sinks
- Monitoring of streaming lag, throughput, error rates

**Use cases**:
- Fraud detection on transaction streams
- Real-time recommendations on clickstream
- Anomaly detection on IoT sensor data
- Dynamic pricing on market events
- Real-time personalization in ad serving

**Key considerations**:
- Exactly-once vs at-least-once semantics for predictions
- State management for time-window feature computation
- Model updates without stream restart (hot-swap)
- Windowing and watermarking for event-time processing
- Backpressure handling and checkpointing
- State checkpointing for failure recovery
- Schema evolution for streaming data

**Pattern: Stateful Feature Computation**:
```python
class RollingFeatureComputer:
    """Stateful stream processor for rolling window features."""
    
    def __init__(self, window_size, slide_size):
        self.window_size = window_size
        self.slide_size = slide_size
        self.state = {}  # entity_id -> deque of events
    
    def process_event(self, event):
        entity_id = event["entity_id"]
        event_time = event["timestamp"]
        
        if entity_id not in self.state:
            self.state[entity_id] = deque()
        
        # Add event to window
        self.state[entity_id].append(event)
        
        # Remove expired events
        cutoff = event_time - self.window_size
        while (self.state[entity_id] and 
               self.state[entity_id][0]["timestamp"] < cutoff):
            self.state[entity_id].popleft()
        
        # Compute features
        window = self.state[entity_id]
        features = {
            "count": len(window),
            "sum": sum(e["value"] for e in window),
            "mean": sum(e["value"] for e in window) / max(len(window), 1),
            "latest_value": window[-1]["value"] if window else 0,
            "has_recent_activity": len(window) > 0,
        }
        return features
```

### 6.1.4 Edge Deployment

Edge deployment runs models on devices (mobile, IoT, browser) for offline or low-latency inference.

**Optimization techniques**:
- Model quantization (FP16, INT8, INT4, NF4)
- Model pruning (structured, unstructured, movement)
- Knowledge distillation (teacher -> student)
- ONNX Runtime for cross-platform optimization
- TensorFlow Lite / Core ML for mobile
- WebGPU / WebNN for browser inference
- XNNPACK for CPU-optimized inference

**Architecture patterns**:
- On-device inference with periodic model updates from server
- Hybrid: edge for fast path, cloud for complex predictions
- Federated learning for privacy-preserving model updates
- Model compression pipeline integrated with CI/CD
- Delta updates for model weights to reduce bandwidth

**Deployment pipeline for edge**:
1. Train full-precision model
2. Compress (quantize, prune, distill)
3. Convert to target format (TFLite, CoreML, ONNX)
4. Validate on edge hardware (latency, accuracy)
5. Deploy via app update or shadow push
6. Monitor edge-side metrics and crash reports
7. A/B test edge model vs cloud fallback

### 6.1.5 Serverless ML

Serverless ML provides pay-per-inference pricing with no infrastructure management.

**Platforms**: AWS SageMaker Serverless, GCP Cloud Run, Azure ML Serverless, Modal, Beam, Banana

**Pros**: No infrastructure management, auto-scaling to zero, pay per use, reduced operational burden
**Cons**: Cold starts (1-10s), limited GPU options, memory constraints (typically 1-10GB), higher per-inference cost at scale

**Best for**: Low-traffic models, prototypes, variable workloads, bursty traffic, ML APIs with sporadic usage
**Not for**: High-throughput production (>100 QPS), latency-sensitive apps (<500ms), large models (>5GB)

**Cold start mitigation**:
- Keep-warm pings every 5 minutes
- Provisioned concurrency (reserved instances)
- Model compression to reduce loading time
- Lazy loading of heavy dependencies
- Snapshot startup (CRaC, Spring checkpoint)

## 6.2 Model Optimization for Serving

### 6.2.1 Quantization

Quantization reduces model precision to improve inference speed and reduce memory.

| Type | Precision | Speedup | Memory Reduction | Accuracy Loss |
|---|---|---|---|---|
| FP32 (baseline) | 32-bit | 1x | 1x | — |
| FP16 | 16-bit | 1.5-2x | 2x | Negligible |
| BF16 | 16-bit | 1.5-2x | 2x | Negligible |
| INT8 | 8-bit | 2-4x | 4x | 0.5-2% |
| INT4 | 4-bit | 3-5x | 8x | 1-5% |
| NF4 (QLoRA) | 4-bit | 3-4x | 4-8x | 1-3% |

**Post-training quantization (PTQ)**: Quantize after training. Fast, minimal accuracy loss. Apply on representative calibration data (100-1000 samples).

**Quantization-aware training (QAT)**: Simulate quantization during training using straight-through estimator (STE). Higher accuracy than PTQ. More complex training pipeline with fake-quantization nodes.

**Best practices**:
- Always calibrate on representative data from production distribution
- Evaluate per-layer quantization sensitivity using Hessian-based methods
- Keep sensitive layers (first, last, attention) in higher precision
- Use mixed-precision quantization (MXFP, GPTQ, AWQ)
- Test thoroughly on target hardware before deployment
- Combine with calibration dataset that covers edge cases

### 6.2.2 Pruning

Pruning removes redundant weights or neurons from the model.

| Type | Description | Compression | Accuracy Impact |
|---|---|---|---|
| **Unstructured pruning** | Zero out individual weights | 2-10x (with sparse hardware) | 0-1% |
| **Structured pruning** | Remove entire neurons/channels | 2-4x | 1-3% |
| **Layer pruning** | Remove entire layers | 1.5-2x | 3-5% |
| **Movement pruning** | Remove weights with large movement during training | 5-10x | 1-2% |
| **SparseGPT** | One-shot unstructured pruning for LLMs | 2-5x | 1-3% |

**Best practices**:
- Prune iteratively (gradual magnitude pruning with schedule)
- Fine-tune after pruning to recover accuracy (5-10 epochs)
- Use hardware-aware pruning for target accelerator
- Combine with quantization for maximum compression
- Avoid pruning below critical sparsity threshold (varies by model)
- Use lottery ticket hypothesis for identifying good subnetworks

### 6.2.3 Knowledge Distillation

Distillation trains a smaller "student" model to mimic a larger "teacher" model.

**Types**:
- **Response distillation**: Student learns teacher's output distribution (logits, soft targets with temperature)
- **Feature distillation**: Student learns intermediate representations (hidden states, attention maps)
- **Relation distillation**: Student learns relationships between samples (distance, ranking)

**Design choices**:
- Teacher-student architecture similarity (same architecture = smaller width/depth)
- Temperature for soft targets (higher = softer distribution, more information)
- Distillation loss weight vs task loss weight (typically 0.3-0.7 distillation weight)
- Data augmentation for student training
- Data-free distillation: Use generator to create synthetic training data

**Production workflow**:
1. Train large teacher model (expensive, offline)
2. Generate soft targets on training or unlabeled data
3. Train small student model with combined loss: L = alpha * L_distill + (1-alpha) * L_task
4. Deploy student model (cheap, fast inference)
5. Iterate: improve student with more data, architecture search, or larger teacher

### 6.2.4 Compilation and Optimization

**ONNX Runtime**: Cross-platform inference optimizer. Converts models to ONNX format, applies graph optimization (operator fusion, constant folding, redundant node elimination) for ~1.5-3x speedup. Supports CPU, GPU, and NPU execution providers.

**TensorRT**: NVIDIA's inference optimizer. Applies layer fusion, precision calibration (INT8/FP16), kernel auto-tuning, and memory optimization for 2-8x speedup on NVIDIA GPUs. Requires TensorRT-compatible model formats.

**TorchScript / torch.compile**: PyTorch JIT compilation. torch.compile (TorchDynamo with backends like inductor, nvfuser) provides 1.5-2x speedup for most models without code changes. Supports CUDA graphs for kernel launch overhead reduction.

**XLA**: Accelerated Linear Algebra for TensorFlow and JAX. Compiles ML computation graphs into efficient fused kernels for execution on GPUs/TPUs. Best for static graph models.

**vLLM / TGI**: Specialized LLM inference engines. vLLM uses PagedAttention for KV cache management, continuous batching for throughput. TGI uses tensor parallelism, flash attention, and quantization. 2-10x LLM inference throughput over naive implementations.

## 6.3 Deployment Strategies

### 6.3.1 Deployment Patterns Comparison

| Strategy | Risk Level | Traffic Exposure | Rollback Time | User Impact | Infrastructure Cost |
|---|---|---|---|---|---|
| **Shadow** | None | 0% (parallel only) | Instant | None | 2x during shadow |
| **Canary** | Low | 1-10% initially | <1 minute | Minimal | 1.1-2x |
| **Blue-Green** | Medium | 100% at switch | <1 minute | Brief (switch) | 2x during deploy |
| **Rolling update** | Low | Gradual 0-100% | Minutes | Minimal (brief) | 1.5x during deploy |
| **A/B test** | None (experiment) | 50/50 split variable | Instant | Experiment | 2x during test |

### 6.3.2 Shadow Deployment

Shadow deployment runs the new model alongside production without serving its predictions to users.

**Implementation**:
1. Deploy new model to separate endpoint
2. Production proxy forwards copies of all requests to both models
3. Production model's response is served to user
4. Shadow model's response is logged for comparison and analysis
5. Monitoring infrastructure compares both outputs

**Duration**: Days to weeks (until sufficient confidence is established)

**Analysis metrics**:
- Prediction agreement rate (disagreements flagged for review)
- Performance comparison on historical outcomes (when labels arrive)
- Latency and resource usage comparison
- Edge case detection (when models disagree significantly)
- Systematic bias analysis (does shadow predict differently for specific segments)

**When to promote from shadow to canary**:
- Shadow model outperforms or matches production on historical evaluation
- Latency and resource usage within acceptable bounds
- No systematic disagreement patterns that indicate bugs
- All validation gates pass on shadow evaluation results

### 6.3.3 Canary Deployment

Canary deployment gradually shifts small portions of traffic to the new model.

**Implementation**:
1. Deploy new model alongside existing model
2. Route 1-2% of traffic to new model
3. Monitor metrics for statistical significance
4. Gradually increase traffic (5%, 10%, 25%, 50%, 100%)
5. Rollback immediately if metrics degrade at any stage

**Traffic routing strategies**:
- **Random sampling** (simple, adequate for most cases, statistically sound)
- **Cookie/user ID hash** (consistent user experience, deterministic routing)
- **Geographic region** (test in low-risk region first, gradual global rollout)
- **Feature flag** (target specific user segments based on attributes)
- **Progressive delivery** (internal users -> beta users -> all users)

**Monitoring during canary**:
- **Primary metrics**: Business KPIs (conversion rate, revenue per user, engagement)
- **Guardrail metrics**: Latency (p50/p99), error rate (5xx, prediction failures), prediction distribution
- **Comparison metrics**: Model-specific metrics when ground truth is available
- **Statistical significance**: Continuous monitoring with sequential testing
- **Dashboards**: Real-time comparison of all metrics between control and canary

**Rollback criteria**:
- Any guardrail metric degrades beyond threshold (e.g., latency +20%)
- Primary metric degradation with p < 0.10 (relaxed threshold for early detection)
- System instability (error rate > 0.1%, pod crashes, OOM events)
- Manual rollback triggered by on-call engineer at any sign of trouble
- Automatic rollback on critical metric breach (p < 0.01)

### 6.3.4 Blue-Green Deployment

Maintain two identical environments (blue = current, green = new). Switch traffic atomically.

**Implementation**:
1. Deploy new model version to green environment
2. Run integration and load tests on green
3. Switch load balancer from blue to green
4. Monitor for issues during cooldown period
5. If issues detected, switch back to blue (instant rollback)

**Pros**: Instant switch (DNS change or load balancer update), easy rollback (flip back), full isolation for testing
**Cons**: Double infrastructure cost during deployment transition, "big bang" risk (all traffic hits new version at once), no gradual exposure

**Best for**: Models with stable, well-tested releases where testing in green provides sufficient confidence, or when infrastructure cost of double environment is acceptable.

### 6.3.5 Model Versioning and Serving

**URL-based versioning**: /v1/predict, /v2/predict
- Simple, explicit, easy to reason about
- Clients must update URLs when version changes
- Good for stable APIs with infrequent changes

**Header-based versioning**: X-Model-Version: 2.0.0
- Backward-compatible for clients that don't specify version
- Requires API gateway support for header parsing and routing
- Enables gradual migration

**Weight-based routing**: v1 gets 90%, v2 gets 10%
- Enables gradual rollout with automatic traffic shifting
- Requires routing infrastructure (load balancer, service mesh)
- Canary deployment pattern

**Feature-flagged**: Toggle model version per user/cookie/segment
- Most flexible, targeted rollouts by user attributes
- Requires feature flag system (LaunchDarkly, Split, custom)
- Enables kill switches and targeted experiments

## 6.4 Model Serving Infrastructure

### 6.4.1 Serving Stack Components

**Load balancer**: ALB, Nginx, HAProxy, Istio Gateway
Routes traffic to model server instances, handles TLS termination, health checks, traffic splitting.

**API Gateway**: Kong, Apigee, AWS API Gateway, Tyk
Authentication, rate limiting, request validation, request routing based on model/version, caching, API key management.

**Model server**: TorchServe, Triton Inference Server, TF Serving, BentoML, Seldon Core, Ray Serve, MLflow Serving
Loads models into memory, runs inference, manages model lifecycle (loading, unloading, versioning, health probes).

**Feature retrieval service**: Feast Online Serving, Tecton, Redis, DynamoDB
Low-latency feature store queries for real-time features, caching layer, batch-key lookups.

**Pre/post-processors**: Custom transformers (Python, Java, Go)
Request preprocessing (feature transformation, normalization, imputation), response post-processing (calibration, thresholding, formatting, enrichment).

**Model router**: Lightweight service that routes requests to appropriate model based on model name, version, or business rules. Can be standalone or part of API gateway.

**Monitoring stack**: Prometheus (metrics), Grafana (dashboards), ELK/Loki (logging), Jaeger/Zipkin (tracing)

### 6.4.2 Triton Inference Server

Triton is NVIDIA's production inference server supporting multiple frameworks and GPU features.

**Key features**:
- Multi-framework: PyTorch, TensorFlow, ONNX, TensorRT, custom backends
- Concurrent model execution on the same GPU
- Dynamic batching for throughput optimization
- Model pipelines (ensemble, BLS) for multi-step inference
- Model version management with readiness/health checks
- Prometheus metrics for monitoring
- gRPC and HTTP/REST endpoints
- Model warmup to avoid cold start latency

**Production configuration**:
```yaml
model_repository:
  - name: my_model
    platform: pytorch
    max_batch_size: 32
    input:
      - name: input__0
        dtype: TYPE_FP32
        dims: [-1, 768]
    output:
      - name: output__0
        dtype: TYPE_FP32
        dims: [-1, 1]
    instance_group:
      - count: 2
        kind: KIND_GPU
    dynamic_batching:
      preferred_batch_size: [4, 8, 16, 32]
      max_queue_delay_microseconds: 100
    model_warmup:
      - name: warmup_request
        batch_size: 1
        inputs:
          - name: input__0
            dims: [1, 768]
            data_type: TYPE_FP32
            random_data: True
```

### 6.4.3 BentoML Service

BentoML provides Python-native model serving with automatic API generation, OpenAPI docs, and containerization.

```python
import bentoml
import numpy as np
from bentoml.io import NumpyNdarray, JSON

@bentoml.service(
    traffic={"timeout": 30, "max_concurrency": 100},
    resources={"gpu": 0, "memory": "512Mi"},
)
class PredictionService:
    def __init__(self):
        self.model = bentoml.mlflow.load_model("my_model:latest")
        self.preprocessor = load_preprocessor()

    @bentoml.api(batchable=True, batch_dim=0)
    def predict(self, input: np.ndarray) -> np.ndarray:
        processed = self.preprocessor.transform(input)
        return self.model.predict(processed)

    @bentoml.api
    def predict_proba(self, input: np.ndarray) -> np.ndarray:
        processed = self.preprocessor.transform(input)
        return self.model.predict_proba(processed)

    @bentoml.api(input=JSON(), output=JSON())
    async def predict_features(self, features: dict) -> dict:
        import pandas as pd
        df = pd.DataFrame([features])
        processed = self.preprocessor.transform(df)
        pred = self.model.predict(processed)
        proba = self.model.predict_proba(processed)
        return {"prediction": int(pred[0]), "probability": float(proba[0])}
```

### 6.4.4 Ray Serve

Ray Serve provides scalable model serving with Python-native API, autoscaling, and multi-model support.

```python
from ray import serve
from ray.serve.handle import DeploymentHandle
from starlette.requests import Request

@serve.deployment(
    num_replicas=2,
    ray_actor_options={"num_gpus": 0.5},
    autoscaling_config={
        "min_replicas": 1,
        "max_replicas": 10,
        "target_num_ongoing_requests_per_replica": 10,
        "upscale_delay_s": 10,
        "downscale_delay_s": 60,
    },
    user_config={
        "model_version": "v2",
    },
)
class MyModel:
    def __init__(self):
        import mlflow
        self.model_version = "latest"
        self._load_model()

    def _load_model(self):
        self.model = mlflow.pyfunc.load_model(
            f"models:/my_model/{self.model_version}"
        )
        self.model_metadata = mlflow.models.get_model_info(
            f"models:/my_model/{self.model_version}"
        )

    async def __call__(self, request: Request) -> dict:
        body = await request.json()
        pred = self.model.predict(body.get("features", body))
        return {
            "prediction": pred.tolist() if hasattr(pred, 'tolist') else pred,
            "model_version": self.model_version,
        }

    @serve.api
    async def batch_predict(self, instances: list) -> list:
        import pandas as pd
        df = pd.DataFrame(instances)
        preds = self.model.predict(df)
        return preds.tolist()

    async def reconfigure(self, config):
        if "model_version" in config:
            self.model_version = config["model_version"]
            self._load_model()

serve.run(MyModel.bind())
```

### 6.4.5 Autoscaling Configuration

Kubernetes HPA configuration for model serving based on multiple metrics:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: model-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: model-server
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: model_inference_latency_p99
        target:
          type: AverageValue
          averageValue: 100m  # 100ms
    - type: Pods
      pods:
        metric:
          name: model_queue_depth
        target:
          type: AverageValue
          averageValue: 5
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
```

## 6.5 Online Feature Serving

### 6.5.1 Feature Store Online Serving

Online feature stores provide low-latency access to pre-computed features for real-time inference.

**Storage backends**:
- **Redis**: Sub-millisecond reads, TTL-based expiration, simple key-value. Best for most use cases.
- **DynamoDB**: Serverless, auto-scaling, consistent reads, single-digit millisecond reads. Good for serverless architectures.
- **Cassandra**: High availability, multi-region replication, no single point of failure. Good for geo-distributed systems.
- **Aerospike**: High throughput (millions ops/sec), low latency (<1ms), flash-optimized. Best for high-scale serving.
- **MongoDB**: Document store, flexible queries, good for complex feature structures.

**Serving patterns**:
- Single-key lookup: Get features for one entity (user_id="abc")
- Batch-key lookup: Get features for multiple entities in one call (batch of user_ids)
- Multi-entity lookup: Get features for related entities (user, item, context)
- Point query: Get specific features for an entity (just "user_7d_click_count")

**API design for feature serving**:
```protobuf
service FeatureStoreService {
  rpc GetOnlineFeatures(OnlineFeaturesRequest) returns (OnlineFeaturesResponse);
  rpc GetBatchOnlineFeatures(BatchOnlineFeaturesRequest) returns (BatchOnlineFeaturesResponse);
}

message OnlineFeaturesRequest {
  string feature_service = 1;  // Logical group of features
  map<string, string> entity_keys = 2;  // {"user_id": "123", "item_id": "456"}
  repeated string feature_names = 3;  // Empty = all features in service
}

message OnlineFeaturesResponse {
  map<string, google.protobuf.Value> features = 1;
  google.protobuf.Timestamp serving_timestamp = 2;
  map<string, google.protobuf.Timestamp> feature_timestamps = 3;
}
```

**Caching strategies**:
- Local cache: In-memory LRU cache in model server (fastest, limited capacity)
- Redis cache: Shared cache with configurable TTL (fast, shared across replicas)
- Multi-level cache: L1 (process memory) -> L2 (Redis) -> L3 (DynamoDB/Cassandra)
- Cache warming: Pre-populate cache for active entities on model deployment

**Consistency patterns**:
- Eventual consistency for most feature types (acceptable for ML)
- Strong consistency for critical features (financial, risk scoring)
- Read-repair for stale cache entries
- TTL-based invalidation with active refresh for real-time features

## 6.6 Canary Analysis Framework

### 6.6.1 Metrics to Monitor During Canary

| Category | Metric | Comparison | Alert Threshold | Priority |
|---|---|---|---|---|
| **Business** | Conversion rate | Control vs canary | p < 0.05 | Critical |
| **Business** | Revenue per user | Control vs canary | p < 0.05 | Critical |
| **Business** | User engagement | Control vs canary | p < 0.05 | High |
| **Model** | Prediction mean | Canary vs training | PSI > 0.1 | High |
| **Model** | Positive rate | Canary vs control | diff > 0.02 | Medium |
| **Model** | Feature importance | Canary vs training | Rank change > 3 | Medium |
| **Performance** | P50 latency | Control vs canary | >10% increase | High |
| **Performance** | P99 latency | Control vs canary | >20% increase | Critical |
| **Performance** | Error rate | Control vs canary | >0.1% absolute | Critical |
| **Performance** | Timeout rate | Control vs canary | >0.5% absolute | Critical |
| **System** | CPU utilization | Canary | >80% | High |
| **System** | Memory utilization | Canary | >85% | High |
| **System** | GPU utilization | Canary | >90% | Medium |

### 6.6.2 Statistical Analysis for Canary

```python
def analyze_canary_metrics(
    control_metrics: np.ndarray,
    canary_metrics: np.ndarray,
    metric_name: str,
    alpha: float = 0.05,
    min_effect_size: float = 0.01,
) -> dict:
    from scipy import stats
    import numpy as np

    n_control = len(control_metrics)
    n_canary = len(canary_metrics)

    if n_control < 30 or n_canary < 30:
        return {
            "metric": metric_name,
            "error": "Insufficient sample size",
            "n_control": n_control,
            "n_canary": n_canary,
        }

    # Test normality
    _, p_normal_control = stats.normaltest(control_metrics)
    _, p_normal_canary = stats.normaltest(canary_metrics)
    is_normal = p_normal_control > alpha and p_normal_canary > alpha

    if is_normal:
        t_stat, p_value = stats.ttest_ind(control_metrics, canary_metrics, equal_var=False)
        test_used = "welch_t_test"
        control_ci = stats.t.interval(0.95, df=n_control-1,
            loc=np.mean(control_metrics), scale=stats.sem(control_metrics))
        canary_ci = stats.t.interval(0.95, df=n_canary-1,
            loc=np.mean(canary_metrics), scale=stats.sem(canary_metrics))
    else:
        u_stat, p_value = stats.mannwhitneyu(control_metrics, canary_metrics, alternative='two-sided')
        test_used = "mann_whitney_u"
        # Bootstrap CIs
        rng = np.random.RandomState(42)
        control_boot = [np.mean(rng.choice(control_metrics, n_control, replace=True)) for _ in range(1000)]
        canary_boot = [np.mean(rng.choice(canary_metrics, n_canary, replace=True)) for _ in range(1000)]
        control_ci = (np.percentile(control_boot, 2.5), np.percentile(control_boot, 97.5))
        canary_ci = (np.percentile(canary_boot, 2.5), np.percentile(canary_boot, 97.5))

    control_mean = float(np.mean(control_metrics))
    canary_mean = float(np.mean(canary_metrics))
    effect_size = canary_mean - control_mean
    relative_change = effect_size / abs(control_mean) if control_mean != 0 else 0

    is_significant = p_value < alpha and abs(effect_size) > min_effect_size

    return {
        "metric": metric_name,
        "control_mean": control_mean,
        "control_ci_95": [float(x) for x in control_ci],
        "canary_mean": canary_mean,
        "canary_ci_95": [float(x) for x in canary_ci],
        "effect_size": effect_size,
        "relative_change_pct": relative_change * 100,
        "p_value": float(p_value),
        "significant": is_significant,
        "test_used": test_used,
        "n_control": n_control,
        "n_canary": n_canary,
    }
```

### 6.6.3 Canary Decision Matrix

Based on canary analysis, determine the next action:

| Business Metrics | Performance Metrics | Error Rate | Decision |
|---|---|---|---|
| Improved | Stable | Low | Promote to full rollout |
| Neutral | Stable | Low | Continue canary, increase traffic |
| Neutral | Degraded | Low | Investigate performance, optimize |
| Neutral | Stable | High | Rollback, fix errors |
| Degraded | Any | Any | Immediate rollback |
| Improved | Degraded | Low | Partial rollout with optimization |
| Improved | Degraded | High | Rollback, investigate root cause |

---

# P7 — MLOPS

## 7.1 ML CI/CD Pipeline

### 7.1.1 CI Pipeline (Continuous Integration)

Triggered on code changes (pull request, merge to main).

**Stages**:
1. **Lint and type check**: ruff, mypy, pylint for Python code
2. **Unit tests**: Test individual functions (data processing, feature computation, model utilities)
3. **Data contract tests**: Validate input data schemas and quality
4. **Feature tests**: Validate feature computation logic and values
5. **Model tests**: Test model on known examples, check output ranges, invariants
6. **Integration tests**: Test end-to-end pipeline on small dataset
7. **Build**: Build Docker image for training and serving

**Gates**: All tests must pass. No regression in evaluation metrics on reference dataset.

### 7.1.2 CD Pipeline (Continuous Deployment)

Triggered on merge to main (or release branch).

**Stages**:
1. **Build training image**: Build and push Docker image for training
2. **Staging deployment**: Deploy model to staging (identical to prod but isolated)
3. **Integration tests**: Test prediction format, latency, throughput, error rates
4. **Load tests**: Simulate peak traffic, measure p50/p99 latency
5. **Shadow deployment**: Deploy shadow model alongside production
6. **Shadow evaluation**: Compare predictions over time window
7. **Canary deployment**: Gradual traffic shift with monitoring
8. **Full rollout**: Promote to full production
9. **Notification**: Notify team of successful deployment

### 7.1.3 CT Pipeline (Continuous Training)

Triggered on schedule, data arrival, or drift detection.

**Stages**:
1. **Check data freshness**: Ensure required data sources are available
2. **Validate data quality**: Run Great Expectations suite on new data
3. **Generate training dataset**: Compute features, create temporal splits
4. **Train model**: Run training with experiment tracking
5. **Evaluate model**: Compute all metrics, slices, fairness
6. **Validate model gates**: Run validation gate suite
7. **Register model**: Push to model registry with metadata
8. **Deploy if gate passes**: Automatically proceed to shadow -> canary -> production
9. **Notify**: Report results to team

## 7.2 Model Validation Gates in CI/CD

### 7.2.1 Gate Configuration

```yaml
validation_gates:
  - name: data_quality
    required: true
    checks:
      - type: schema_conformance
        severity: critical
      - type: null_rate
        max_null_rate: 0.05
        severity: high
      - type: row_count
        min_rows: 10000
        severity: high

  - name: model_performance
    required: true
    checks:
      - type: metric_threshold
        metric: test_auc_roc
        min_value: 0.75
        comparison: greater
      - type: metric_threshold
        metric: test_f1
        min_value: 0.65
        comparison: greater
      - type: regression_check
        metric: test_auc_roc
        reference_model: "production"
        max_degradation: 0.02

  - name: slice_consistency
    required: false
    checks:
      - type: max_slice_variance
        metric: f1
        max_variance: 0.15
      - type: min_slice_metric
        metric: recall
        min_slice_value: 0.4

  - name: fairness
    required: true
    checks:
      - type: demographic_parity
        max_difference: 0.05
        protected_attributes: [gender, age_group]
      - type: equal_opportunity
        max_difference: 0.05

  - name: overfitting
    required: true
    checks:
      - type: train_val_gap
        metric: f1
        max_gap: 0.08

  - name: prediction_stability
    required: true
    checks:
      - type: psi
        reference_dataset: "training_predictions"
        max_psi: 0.1
```

### 7.2.2 Gate Implementation

```python
"""Validation gate system for CI/CD pipelines."""

from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Callable, Any
import logging
import json


class GateSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class GateStatus(Enum):
    PASS = "pass"
    WARNING = "warning"
    FAIL = "fail"
    ERROR = "error"
    SKIP = "skip"


@dataclass
class GateResult:
    gate_name: str
    status: GateStatus
    message: str
    details: Dict[str, Any] = field(default_factory=dict)
    severity: GateSeverity = GateSeverity.HIGH


@dataclass
class ValidationContext:
    model_uri: str
    metrics: Dict[str, float]
    slice_metrics: Dict[str, Dict[str, float]]
    data_quality_report: Dict[str, Any]
    training_predictions: Optional[List[float]] = None
    production_metrics: Optional[Dict[str, float]] = None
    fairness_report: Optional[Dict[str, Any]] = None
    model_info: Optional[Dict[str, Any]] = None


class ValidationPipeline:
    def __init__(self, config_path: Optional[str] = None):
        self.gates: List[Callable] = []
        self.results: List[GateResult] = []
        self.logger = logging.getLogger(self.__class__.__name__)
        if config_path:
            self.load_config(config_path)

    def add_gate(self, gate_fn: Callable, name: str, severity: GateSeverity = GateSeverity.HIGH):
        self.gates.append((gate_fn, name, severity))

    def load_config(self, config_path: str):
        with open(config_path) as f:
            config = json.load(f)
        for gate_config in config.get("validation_gates", []):
            self._create_gate_from_config(gate_config)

    def _create_gate_from_config(self, config: dict):
        name = config["name"]
        required = config.get("required", True)
        severity = GateSeverity(config.get("severity", "high"))

        if config.get("type") == "metric_threshold":
            self.add_gate(
                lambda ctx: self._check_metric_threshold(
                    ctx, config["metric"], config.get("min_value", 0),
                    config.get("comparison", "greater")
                ),
                name=name,
                severity=severity if required else GateSeverity.LOW,
            )
        elif config.get("type") == "regression_check":
            self.add_gate(
                lambda ctx: self._check_regression(
                    ctx, config["metric"], config.get("max_degradation", 0.02)
                ),
                name=name,
                severity=severity if required else GateSeverity.LOW,
            )

    def run(self, context: ValidationContext) -> List[GateResult]:
        self.results = []
        for gate_fn, name, severity in self.gates:
            try:
                result = gate_fn(context)
                self.logger.info(f"Gate '{name}': {result.status.value}")
                self.results.append(result)
            except Exception as e:
                self.logger.error(f"Gate '{name}' threw exception: {e}")
                self.results.append(GateResult(
                    gate_name=name,
                    status=GateStatus.ERROR,
                    message=str(e),
                    severity=severity,
                ))
        return self.results

    def all_passed(self) -> bool:
        """All HIGH/CRITICAL severity gates passed."""
        return all(
            r.status in (GateStatus.PASS, GateStatus.SKIP)
            for r in self.results
            if r.severity in (GateSeverity.HIGH, GateSeverity.CRITICAL)
        )

    def get_summary(self) -> Dict[str, Any]:
        return {
            "total": len(self.results),
            "passed": sum(1 for r in self.results if r.status == GateStatus.PASS),
            "failed": sum(1 for r in self.results if r.status == GateStatus.FAIL),
            "warnings": sum(1 for r in self.results if r.status == GateStatus.WARNING),
            "errors": sum(1 for r in self.results if r.status == GateStatus.ERROR),
        }

    @staticmethod
    def _check_metric_threshold(ctx: ValidationContext, metric: str,
                                  threshold: float, comparison: str) -> GateResult:
        value = ctx.metrics.get(metric)
        if value is None:
            return GateResult(gate_name="metric_threshold", status=GateStatus.ERROR,
                            message=f"Metric {metric} not found")
        if comparison == "greater":
            passed = value >= threshold
        elif comparison == "less":
            passed = value <= threshold
        else:
            passed = abs(value) <= threshold
        status = GateStatus.PASS if passed else GateStatus.FAIL
        return GateResult(
            gate_name=f"{metric}_threshold",
            status=status,
            message=f"{metric} = {value:.4f}, threshold = {comparison} {threshold}",
            details={"metric": metric, "value": value, "threshold": threshold},
        )

    @staticmethod
    def _check_regression(ctx: ValidationContext, metric: str,
                           max_degradation: float) -> GateResult:
        current = ctx.metrics.get(metric)
        baseline = ctx.production_metrics.get(metric) if ctx.production_metrics else None
        if current is None or baseline is None:
            return GateResult(gate_name="regression_check", status=GateStatus.SKIP,
                            message=f"Insufficient data for {metric} regression check")
        degradation = baseline - current
        status = GateStatus.PASS if degradation <= max_degradation else GateStatus.FAIL
        return GateResult(
            gate_name=f"{metric}_regression",
            status=status,
            message=f"Degradation in {metric}: {degradation:.4f} (max allowed: {max_degradation})",
            details={"metric": metric, "current": current, "baseline": baseline, "degradation": degradation},
        )
```
