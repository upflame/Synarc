
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


