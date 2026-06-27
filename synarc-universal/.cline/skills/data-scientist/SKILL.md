---
name: data-scientist
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - data-engineer: ">=2.0.0"
  - statistics-skill: "bundled"
title: Data Scientist — Statistical Reasoning, Experimentation, Causal Inference
description: Data science reasoning — descriptive statistics, inferential statistics, hypothesis testing, A/B test design and analysis, statistical power, multi-armed bandits, causal inference (potential outcomes, DAGs, instrumental variables, regression discontinuity), time series forecasting, classification metrics, regression metrics, ranking metrics, exploratory data analysis, statistical pitfalls, experiment pre-registration, common mistakes. Distinct from data-engineer (pipelines) — this skill is about analyzing data and drawing valid conclusions. Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - data-science
  - statistics
  - hypothesis-testing
  - ab-testing
  - experimentation
  - causal-inference
  - time-series
  - classification-metrics
  - eda
  - statistical-power
  - multi-armed-bandits
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

# Data Scientist — Statistical Reasoning, Experimentation, Causal Inference

Inherits synarc core. All synarc prohibitions apply.

Data science is the discipline of extracting valid conclusions from data. data-engineer builds the pipelines. data-scientist asks the questions. This skill covers statistics, experimentation, causal inference, metrics, and the discipline of saying "we don't know" when the data does not support a conclusion.

## P2 — EXPERIMENTATION

### P2.1 — A/B Test Design

```
ELEMENTS OF A VALID A/B TEST:
  - Hypothesis:        clear, falsifiable
  - Primary metric:    one metric, pre-registered
  - Secondary metrics: exploratory (not for launch decisions)
  - Unit of assignment:user / session / cookie (must be consistent)
  - Randomization:     uniform, independent
  - Sample size:       power calculation, not guessed
  - Duration:          full business cycles (at least 1-2 weeks)
  - Guardrail metrics: latency, errors, revenue (no regression)
  - Pre-registration:  document before running

ANTI-PATTERNS:
  - Stopping at first significance (peeking)
  - Running multiple variants without correction
  - Including post-treatment data in the analysis
  - Comparing unequal sample sizes
  - Using a biased assignment (e.g., by region without check)
  - Calling a winner without replication
```

### P2.2 — Sample Size & Power

```
POWER ANALYSIS:
  Inputs:
    - Baseline rate:  current conversion (e.g., 5%)
    - MDE:            minimum detectable effect (e.g., +0.5pp)
    - Alpha:          false positive rate (typically 5%)
    - Power:          1 - beta, typically 80%
  Output: sample size per variant

DURATION:
  - Total samples / daily traffic = days to run
  - Always run >= 1 full business cycle (week, not just 3 days)
  - Account for weekly seasonality (run M-F or full week)

PEEKING:
  - Looking at results before the planned end inflates false positive rate
  - Use sequential testing (always-valid p-values) if you must peek
  - Or pre-commit to a single analysis time
```

### P2.3 — Multi-Armed Bandits

```
USE BANDITS WHEN:
  - Cost of exploration is high
  - Many arms to test
  - You can shift traffic in real-time
  - Long-term regret matters more than "best" identification

DO NOT USE BANDITS WHEN:
  - You need a clean causal estimate
  - You have compliance requirements for pre-registration
  - Number of arms is small (< 5)
  - You will ship the winner anyway

TYPES:
  - Epsilon-greedy:        explore 10%, exploit 90%
  - UCB:                   explore based on uncertainty
  - Thompson sampling:     sample from posterior, pick best
  - Contextual:            arm depends on user features
```

## P3 — CAUSAL INFERENCE

### P3.1 — When Correlation Is Not Enough

```
CORRELATION SUFFICES WHEN:
  - Decision is purely descriptive (what is)
  - You have a randomized experiment
  - You have no confounders (rare)

YOU NEED CAUSAL INFERENCE WHEN:
  - Decision is interventional (what if we do X)
  - Data is observational
  - Confounders exist (almost always)
  - You need to know if X causes Y, not just correlates
```

### P3.2 — Causal Methods

```
POTENTIAL OUTCOMES (Rubin):
  - Y(1) - Y(0) = treatment effect
  - Need treatment assignment to be ignorable
  - Match, stratify, weight to adjust for confounders

DIRECTED ACYCLICAL GRAPHS (DAGs):
  - Encode causal assumptions visually
  - Identify: confounders, mediators, colliders
  - Use do-calculus to identify causal effects from data
  - Helpful for: designing which variables to measure

INSTRUMENTAL VARIABLES:
  - When unobserved confounders exist
  - Find a variable that affects treatment but not outcome directly
  - Two-stage least squares, IV regression

REGRESSION DISCONTINUITY:
  - Treatment assigned by a threshold
  - Compare observations just above and just below threshold
  - Powerful, local effect

DIFFERENCE-IN-DIFFERENCES:
  - Compare change over time between treated and control
  - Strong assumption: parallel trends
  - Common in policy / business analysis

SYNTHETIC CONTROL:
  - Construct control as weighted average of untreated units
  - Compare to treated unit over time
  - Good for: "what if we hadn't done X" at org level
```

## P4 — TIME SERIES

### P4.1 — Time Series Methods

```
CLASSIC:
  - ARIMA / SARIMA:        univariate, stationary
  - Exponential smoothing: simple, robust
  - Prophet (Facebook):    trend + seasonality + holidays
  - State space models:    flexible, structural

ML:
  - Gradient boosting (XGBoost, LightGBM) with lag features
  - N-BEATS, N-HiTS:       deep learning, univariate
  - Temporal Fusion Transformer: multivariate, interpretable

DEEP LEARNING:
  - LSTM, GRU:              sequential, slow
  - Transformers for time:  recent, effective with lots of data

EVAL:
  - Walk-forward validation (not random k-fold)
  - Metrics: MAE, RMSE, MAPE
  - Baseline: seasonal naive (last week's same day)
  - Beat baseline by meaningful margin
```

### P4.2 — Time Series Pitfalls

```
LEAKAGE:
  - Using future values to predict past
  - Train/test split by time, not random
  - Compute features with shift(1) or shift(N)

NON-STATIONARITY:
  - Mean, variance, or autocorrelation changes over time
  - Differencing, detrending, log transform
  - Test: ADF, KPSS

SEASONALITY:
  - Daily, weekly, yearly patterns
  - Decompose, model explicitly
  - Always include in the validation period

OUTLIERS:
  - Anomalies can dominate the loss
  - Winsorize, robust loss, separate outlier model
  - Investigate: real anomaly or data error?
```

## P5 — CLASSIFICATION METRICS

### P5.1 — Confusion Matrix & Derived Metrics

```
CONFUSION MATRIX:
                 Predicted
                 Pos    Neg
  Actual  Pos    TP     FN
          Neg    FP     TN

DERIVED:
  Accuracy:    (TP+TN) / (TP+TN+FP+FN)        # misleading on imbalanced
  Precision:   TP / (TP+FP)                   # when you say pos, how often right
  Recall:      TP / (TP+FN)                   # of all actual pos, how many caught
  Specificity: TN / (TN+FP)                   # of all actual neg, how many caught
  F1:          2 * P * R / (P + R)            # harmonic mean
  F-beta:      (1+beta^2) * P * R / (beta^2*P + R)
  AUC-ROC:     TPR vs FPR across thresholds
  AUC-PR:      precision vs recall, better for imbalanced
  LogLoss:     probabilistic, penalizes confidence
```

### P5.2 — Which Metric When

```
BALANCED DATA, COST SYMMETRIC:        accuracy, F1
IMBALANCED, COST OF FP != FN:         precision-recall, F-beta
RANKING:                              AUC-ROC, NDCG, MAP
PROBABILISTIC:                        log loss, Brier score
HIGH STAKES (medical, fraud):         recall (catch all), then precision
RECOMMENDER:                          NDCG, MAP, hit rate
IMbalanced, care about top-K:         precision@K, recall@K
```

## P6 — REGRESSION METRICS

```
MSE:     mean squared error, penalizes large errors
RMSE:    sqrt(MSE), same units as target
MAE:     mean absolute error, robust to outliers
MAPE:    mean absolute percentage error, scale-independent
R^2:     variance explained, but not for non-linear
Quantile loss: pinball loss, for quantile regression
```

## P7 — EDA (Exploratory Data Analysis)

### P7.1 — EDA Checklist

```
FOR EVERY NEW DATASET:
  - Size:            rows, columns
  - Schema:          types, nulls
  - Distributions:   mean, median, std, quantiles per numeric
  - Outliers:        boxplot, z-score, IQR
  - Missing:         pattern (MCAR, MAR, MNAR), per column
  - Correlations:    numeric-numeric, numeric-categorical
  - Target:          distribution, balance
  - Time:            trends, seasonality, gaps
  - Duplicates:      exact, near (entity resolution)
  - Joins:           if multiple tables, check key uniqueness
  - Data quality:    negative ages, future dates, etc.

VISUAL:
  - Histogram, boxplot, scatter, pair plot
  - For time series: line, decompose, ACF/PACF
  - For categorical: bar, mosaic, count
```

## P8 — STATISTICAL PITFALLS

### P8.1 — Common Mistakes

| Mistake | Problem | Correct |
|---|---|---|
| P-hacking (running many tests, reporting p<0.05) | Inflated false positive | Pre-register, correct for multiple comparisons |
| Stopping at first significance | Inflated false positive | Pre-commit duration, sequential testing if peeking |
| Correlation = causation | Wrong conclusion | Causal inference methods, or just say "correlated" |
| Imbalanced classes + accuracy | 99% accuracy on 99% negative | Use precision, recall, F1, PR-AUC |
| Data leakage from future | Optimistic performance | Time-based split, lag features |
| Small sample, large effect | Overconfident, may not replicate | Confidence interval, replication |
| Cherry-picked subgroup | Spurious significance | Pre-register subgroups, correct for multiple |
| Confounding | Correlation without causation | Causal methods, sensitivity analysis |
| Simpson's paradox | Aggregate trend reverses per group | Stratify, check subgroups |
| Survivorship bias | Only survivors in the data | Include failed cases, check selection |

### P8.2 — Saying "We Don't Know"

```
THE DATA DOES NOT SUPPORT A CONCLUSION WHEN:
  - Sample size is too small
  - Variance is too high
  - Confounders are uncontrolled
  - Effect size is within noise
  - No replication

INSTEAD OF OVERSTATING:
  "We don't have enough data to conclude X."
  "The effect could be anywhere from A to B (95% CI)."
  "This is suggestive, not conclusive."
  "We'd need N more observations to detect this effect."
```

## P9 — OUTPUT FORMATS

### P9.1 — Experiment Report

```
HYPOTHESIS:        [falsifiable claim]
DESIGN:            [A/B / multi-arm / bandit]
PRIMARY METRIC:    [name, current, target effect]
SAMPLE SIZE:       [calculated from power analysis]
DURATION:          [days, full business cycles]
GUARDRAIL METRICS: [no regression allowed]

RESULTS:
  Treatment:        [N, metric value, CI]
  Control:          [N, metric value, CI]
  Effect:           [point estimate, 95% CI, p-value]
  Decision:         [ship / don't ship / extend / redo]

GUARDRAILS:
  latency:          [delta, within budget?]
  errors:           [delta, within budget?]
  revenue:          [delta, within budget?]

SEGMENT ANALYSIS:  [pre-registered only]
NOVELTY:           [any unexpected findings, exploratory only]
```

### P9.2 — Causal Analysis Memo

```
QUESTION:         [interventional question]
DATA:             [observational, time range]
ASSUMPTIONS:      [DAG, identification strategy]
METHOD:           [DAGs / IV / DiD / synthetic control]
RESULTS:          [point estimate, CI, sensitivity]
LIMITATIONS:      [untestable assumptions, residual confounders]
CONCLUSION:       [causal claim, with caveats]
```

## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Run test, see p<0.05, ship | P-hacking, false positive | Pre-register, frozen analysis plan |
| "Significant" = important | Statistical != practical | Effect size, business impact, CI |
| Test on Monday, ship Friday | No full business cycle | Run >= 1 full cycle (1-2 weeks) |
| A/B test a UI change with N=100 | Underpowered, noise | Power analysis, N from MDE |
| Treat every metric as primary | Multiple comparisons problem | 1 primary, rest secondary/exploratory |
| Correlation = causation | Wrong conclusion | Causal methods, or say "associated" |
| Look at results every day | Peeking inflates FP | Pre-commit, sequential testing, or alpha-spending |
| Cherry-pick best segment | Spurious | Pre-register subgroups, correct for multiple |
| Data with leakage, ship it | Overoptimistic in prod | Time-based split, validate on truly held-out |

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every experiment, causal claim, or model evaluation.*

*Escalate to ethics-engineer when: experiment has disparate impact across protected classes. Escalate to product-engineer when: experiment drives product decisions.*
