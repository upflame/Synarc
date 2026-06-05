---
title: "Database Architect"
type: reference
status: active
version: 4.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - database-architect
  - database-selection
  - relational-design
  - nosql-design
  - indexing
  - query-optimization
  - data-modeling
  - migrations
  - sharding
  - replication
  - ha-dr
  - backup-recovery
  - concurrency
  - caching
  - connection-management
  - database-testing
---

# Purpose

End-to-end database architecture: engine selection, logical/physical data modeling, indexing strategy, query performance, schema migrations, data distribution, high availability, disaster recovery, and data governance.

# Scope

Database selection methodology (relational, document, key-value, graph, time-series, columnar, wide-column), relational design (normalization, denormalization patterns, schema design patterns, constraints, triggers, views, materialized views, stored procedures), NoSQL design (MongoDB, Redis, DynamoDB, Neo4j, Cassandra), indexing strategy (B-Tree, GIN, GiST, BRIN, partial, functional, covering, full-text, vector), query performance analysis, migration strategy and tooling, data distribution (sharding, partitioning, replication), HA/DR architecture, backup/recovery strategy, concurrency and isolation, caching, connection pooling, monitoring, data archival. Does not cover application caches, backend API design, infrastructure deployment, or security policies.

# Inputs

Business requirements, data characteristics (volume/velocity/variety), access patterns, consistency/durability/availability requirements, operational maturity, cost constraints.

# Output

Database selection decision, logical and physical data models, indexing strategy, migration plan, replication topology, HA/DR architecture, backup strategy, performance monitoring configuration.

---

## 1. Decision Framework

Business Requirements → Data Characteristics → Access Patterns → Consistency Requirements → Durability Requirements → Availability Requirements (RTO/RPO) → Operational Maturity → Cost Constraints.

## 2. Database Selection Matrix

| Requirement | Relational (SQL) | Document (MongoDB) | Key-Value (Redis) | Graph (Neo4j) | Time-Series | Wide-Column (Cassandra) |
|------------|------------------|-------------------|-------------------|--------------|-------------|------------------------|
| ACID transactions | Native | Multi-doc (v4.0+) | Limited (CAS) | ACID (v4.0+) | No | No (tunable) |
| Complex joins | Yes | Aggregation pipeline | No | Traversal | No | No (CQL) |
| Ad-hoc queries | Excellent | Good (BSON+indexes) | Poor (key-based) | Good (Cypher) | Limited | Limited |
| Horizontal scaling | Complex (sharding) | Native (sharding) | Native (clustering) | Limited | Native | Native (eventual) |
| Write throughput | Moderate | High | Very high | Moderate | Very high | Very high |

**Relational sub-selection by factor:** PostgreSQL (extensions, JSON, GIS), MySQL (OLTP performance, replication), SQL Server (Always On, CLR), Oracle (enterprise features), SQLite (embedded).

## 3. Relational Design Patterns

**Normalization:** 1NF (atomic columns), 2NF (full functional dependency), 3NF (no transitive dependencies), BCNF (every determinant is candidate key). Denormalize for read-heavy workloads via pre-joined summaries, embedded JSONB, computed columns, or hierarchical paths.

**Constraint design principles:** every table has a PK, use natural keys when stable/immutable/surrogate keys otherwise, index foreign keys (especially referencing side), use partial unique indexes for soft-delete, deferrable constraints for complex workflows, NOT NULL is cheapest constraint.

**Inheritance patterns:** single table (shared columns + JSONB + type discriminator), class table (subtype per table with FK), concrete table (all columns per subtype, no joins, duplicated columns).

## 4. NoSQL Design Principles

**MongoDB:** design schemas based on access patterns, embed data always accessed with parent, reference independent data, avoid >16MB BSON limit, avoid unbounded arrays. Use bucketing for time-series, polymorphic pattern for varied types.

**Redis:** String (caching, counters, locks), List (queues), Set (tags, unique), Sorted Set (leaderboards, rate limits), Hash (objects, sessions), Stream (event sourcing, message queue).

**DynamoDB:** single table design with composite PK/SK. Hot key mitigation: random suffix to PK, write sharding, DAX. Transactions for multi-item operations.

**Cassandra:** query-first design — one table per query pattern, denormalization expected. Partition key = data locality, clustering columns = sort order. Time-series with TWCS compaction and TTL.

**Neo4j:** nodes = entities, relationships = connections (directed, typed). Model domain concepts as nodes, not relationship properties. Avoid hypernodes.

## 5. Indexing Strategy

| Type | Best For | Characteristics |
|------|----------|-----------------|
| B-Tree | Equality + range, sort, join | O(log n), standard choice |
| Hash | Equality lookups | O(1), no range |
| GIN | Array/JSONB, full-text | Inverted index |
| GiST | Geometry, range types | Extensible operators |
| BRIN | Large append-only tables | Block-level, tiny |
| Partial | Queries on subset | Smaller index |
| Functional | Function on column | Pre-computed |
| Covering | Index-only scan | Include columns |
| Vector | Similarity search | IVFFlat, HNSW |

**B-Tree rules:** leftmost prefix rule for composite indexes, DESC for sorting, INCLUDE for index-only scans, `ANALYZE` after bulk changes, `REINDEX CONCURRENTLY` for maintenance.

## 6. Migration Strategy

**Tooling:** Flyway, Liquibase, Sqitch, Alembic, Golang Migrate, Prisma Migrate.

**Rules:** every migration is reversible (has up and down), test against production-size data, add columns as nullable first → backfill → NOT NULL, never edit existing migration files, use transaction-wrapped migrations where possible.

## 7. HA/DR & Replication

**Replication:** streaming replication (PostgreSQL sync/async), Always On (SQL Server), Data Guard (Oracle), Group Replication (MySQL). DR: RTO < 1 hour, RPO < 5 minutes for critical systems.

**Key metrics:** p50 query < 10ms, p99 query < 50ms, connection utilization < 80%, cache hit ratio > 95%, replication lag < 1s, backup within maintenance window.
