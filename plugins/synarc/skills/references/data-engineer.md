---
title: "Data Engineer — Pipeline Architecture & Data Modeling"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - data-engineering
  - data-pipelines
  - etl
  - elt
  - data-modeling
  - streaming
  - batch-processing
  - data-quality
  - schema-evolution
  - orchestration
  - data-governance
  - data-lakehouse
  - cost-optimization
  - data-cataloging
---

# Purpose

End-to-end data pipeline design reasoning: ingestion, transformation, storage, modeling, governance, quality, and monitoring. Every decision involves trade-offs between freshness, completeness, cost, and complexity.

# Scope

ETL vs ELT methodology, pipeline architecture patterns (batch, streaming, lambda, kappa), storage format selection (Parquet, Avro, Delta Lake, Iceberg, Hudi), data modeling (3NF, star schema, snowflake, data vault, OBT, medallion architecture), batch processing deep dive (Spark, Airflow, Dagster, dbt), stream processing (event time vs processing time, watermarks, windows), data quality frameworks, schema evolution and governance, orchestration strategies, cost optimization. Does not cover backend API design, deployment infrastructure, or application-level caching.

# Inputs

Source system characteristics, data volume/velocity/variety, freshness requirements, query patterns, cost constraints, compliance requirements.

# Output

Pipeline architecture design, data model selection and schema, storage format specification, orchestration DAG design, data quality rules and monitoring, cost estimates.

---

## 1. ETL vs ELT Decision

**ETL** (Transform before load): use when target storage is expensive, target cannot do complex transforms, data must be anonymized before warehouse, regulatory requirements, source has limited retention.

**ELT** (Load before transform): use when warehouse is cheap/scalable, transformation is iterative/SQL-based, raw data needed for reprocessing, team is SQL-proficient.

Not binary — many pipelines use both: Stage 1 ELT raw → Stage 2 ETL curated → Stage 3 ELT analytics.

## 2. Pipeline Architecture Patterns

**Batch-Only:** data collected over window, processed as group. Latency: minutes to hours. Deterministic, replayable, simple error handling. Use for daily/hourly reporting, historical backfills, ML training data.

**Streaming-Only:** each event processed as it arrives. Latency: ms to seconds. Real-time insights, complex state management. Use for fraud detection, real-time dashboards, alerting.

**Lambda:** batch + streaming parallel paths. Two codebases, merging complexity, high ops overhead. Use only when batch infra cannot be replaced and real-time is required.

**Kappa:** single streaming pipeline handles both real-time and historical reprocessing via event log replay. Preferred over Lambda for new streaming projects.

## 3. Storage Format Selection

| Requirement | Parquet | Delta Lake | Iceberg | Hudi |
|-------------|---------|------------|---------|------|
| ACID transactions | No | Yes | Yes | Yes |
| Time travel | No | Yes | Yes | Yes |
| Schema evolution | Manual | Explicit | Rich | Explicit |
| UPSERT | No | Yes | Yes | Yes |
| Engine support | Universal | Spark+ | Multi | Spark+ |

**Selection:** read pattern all columns/few rows → Avro/row format. Read pattern one column/many rows → Parquet/columnar. ACID on data lake → Delta/Iceberg/Hudi.

**Parquet sizing:** 128MB-1GB per row group, 1-2 row groups per file. Codec: Snappy (default), Zstd (balance), Gzip (cold), LZ4 (intermediate).

## 4. Data Modeling Patterns

| Model | Strengths | Use Case |
|-------|-----------|----------|
| 3NF | No redundancy, data integrity | OLTP, operational systems |
| Star Schema | Intuitive BI, fast aggregation | Dimensional analysis, reporting |
| Snowflake | Normalized dimensions, reduced redundancy | Very wide dimension tables |
| Data Vault | Full audit trail, source system changes | Enterprise DW, multi-source |
| OBT / Wide Table | No joins, easy export | ML features, ad-hoc discovery |
| Medallion (Bronze/Silver/Gold) | Raw preservation + layered clean | Modern lakehouse, data mesh |

**SCD strategy:** Type 0 (fixed — dates), Type 1 (overwrite — phone/email), Type 2 (add row — history needed), Type 3 (add column — limited history), Type 4 (separate history table).

## 5. Batch Processing Principles

**Spark:** 2-4 partitions per CPU core, 128MB-512MB after shuffle. Minimize shuffle: use reduceByKey over groupByKey, broadcast small tables, AQE enabled. Target output file size 128MB-1GB.

**Incremental vs full refresh:** full refresh for <1M rows/initial loads. Incremental for >10M rows with watermark tracking. Always parameterize date ranges for backfill support.

**Airflow:** one DAG per data domain, tasks idempotent, deferrable operators for long-running sensors, separate config from code, test DAGs in CI. Avoid 500+ task DAGs, heavy computation in workers.

## 6. Stream Processing Fundamentals

**Event time is truth** — use for windowed aggregations and business logic. Watermarks track completeness of event time windows. Too aggressive → late data discarded. Too conservative → high memory, delayed results.

**Window types:** Tumbling (fixed, non-overlapping), Sliding (fixed, overlapping), Session (gap-based), Global (no time boundary). Each has different late-data handling.

**State management:** streaming requires persistent state for aggregations, joins, sessions. Checkpointing for fault tolerance. Consider RocksDB for large state backends.

## 7. Data Quality Framework

**Enforce at pipeline boundaries (source → raw → curated → aggregated).**
- Freshness: monitor watermark lag, alert on stale data
- Completeness: row count comparison between source and target
- Uniqueness: duplicate detection on key columns
- Accuracy: distribution drift monitoring, anomaly detection
- Schema: enforce at silver layer, schema-on-read at bronze

## 8. Data Governance & Cataloging

**Schema registry** for schema evolution enforcement (Avro, Protobuf). Compatibility modes: BACKWARD (default — reader can read previous), FORWARD (reader can read next), FULL (both directions), NONE.

**Data catalog** for discovery (OpenMetadata, DataHub, Amundsen). Metadata: schema, lineage, ownership, freshness, quality metrics, tags.
