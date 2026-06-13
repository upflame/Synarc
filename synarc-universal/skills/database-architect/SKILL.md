---
name: database-architect
description: Database Architect Skill Pack
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Database Architect Skill Pack

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

> **Persona:** You are a database architect responsible for all data-related decisions across the organization. You own the logical and physical data models, storage engine selection, indexing strategy, query performance, schema migrations, data distribution, high availability, disaster recovery, and data governance. You do NOT build application caches, write backend APIs, deploy infrastructure, set security policies, or build data pipelines. You design and operate the database layer such that application teams, platform engineers, security engineers, and data engineers can build on a solid foundation.


## P2: Database Selection Methodology

### 2.1 Decision Matrix

| Requirement | Relational (SQL) | Document (MongoDB) | Key-Value (Redis) | Graph (Neo4j) | Time-Series (InfluxDB) | Columnar (ClickHouse) | Wide-Column (Cassandra) |
|-------------|------------------|-------------------|-------------------|--------------|----------------------|---------------------|------------------------|
| ACID transactions | Native | Multi-doc (v4.0+) | Limited (CAS) | ACID (v4.0+) | No | No | No (tunable) |
| Complex joins | Yes | No (aggregation pipeline) | No | Traversal | No | Limited | No |
| Ad-hoc queries | Excellent | Good (BSON + indexes) | Poor (key-based) | Good (Cypher) | Limited | Good (SQL-like) | Limited (CQL) |
| Schema flexibility | Rigid (migrations) | Schema-less | Schema-less | Schema-less | Schema-less | Schema-agnostic | Schema-agnostic |
| Horizontal scaling | Complex (sharding) | Native (sharding) | Native (clustering) | Limited (read replicas) | Native | Native (distributed) | Native (eventual) |
| Write throughput | Moderate | High | Very high | Moderate | Very high | Very high | Very high |
| Geo-distribution | Complex | Native | Multi-region | Limited | Limited | Limited | Native |
| Consistency model | Strong | Tunable | Strong | Strong | Tunable | Strong | Tunable (eventual) |

### 2.2 Relational Database Sub-Selection

| Factor | PostgreSQL | MySQL (InnoDB) | SQL Server | Oracle | SQLite |
|--------|-----------|---------------|------------|--------|--------|
| Licensing | Open source | Open source (GPL) | Commercial | Commercial | Public domain |
| Concurrency | MVCC (row-level) | MVCC (row-level) | MVCC (row-level) | MVCC (row-level) | Writer locks |
| Extensions | Rich (PostGIS, pgvector, TimescaleDB, Citus) | Limited | CLR, T-SQL | PL/SQL, Java | Loadable extensions |
| Replication | Built-in streaming, logical | Async, semi-sync, Group Replication | Always On, mirroring | Data Guard, GoldenGate | None |
| Partitioning | Declarative (10+) | Range, List, Hash, Key | Partitioned tables | Partitioning (8i+) | None |
| Full-text search | Built-in (tsvector) | Built-in (InnoDB) | Built-in | Oracle Text | FTS5 extension |
| JSON support | Excellent (binary JSON, indexes) | Good (JSON type) | JSON, JSON_* functions | JSON (12c+) | JSON1 extension |
| GIS support | PostGIS | Built-in (5.7+) | Spatial types | Oracle Spatial | SpatiaLite |
| CTE & Window functions | Excellent | Good (8.0+) | Excellent | Excellent | Limited |
| Performance for OLTP | Very good | Excellent | Excellent | Excellent | Good |
| Performance for OLAP | Good | Moderate | Good | Good | Poor |

### 2.3 NoSQL Sub-Selection Framework

**Document Stores (MongoDB, Couchbase, Firestore):**
- When: Semi-structured data, polymorphic schemas, rapid iteration, nested objects
- Not when: Heavy joins, ACID-critical, strict schema enforcement
- MongoDB sweet spot: Content management, catalogs, user profiles, IoT metadata
- Couchbase sweet spot: Low-latency, memory-first workloads, sub-millisecond reads
- Firestore sweet spot: Serverless, real-time sync, mobile backends

**Key-Value Stores (Redis, DynamoDB, etcd, FoundationDB):**
- When: Session state, caches, leaderboards, rate limiters, pub/sub
- Not when: Complex queries, multi-key transactions, reporting
- Redis sweet spot: In-memory, ephemeral, high-throughput, data structures
- DynamoDB sweet spot: Serverless, predictable latency at any scale
- etcd sweet spot: Consensus, service discovery, leader election (Raft)
- FoundationDB sweet spot: Ordered key-value with ACID transactions

**Graph Stores (Neo4j, Amazon Neptune, ArangoDB, JanusGraph):**
- When: Highly connected data, path traversal, recommendation, fraud detection
- Not when: Simple CRUD, tabular reporting, high-volume flat writes
- Neo4j sweet spot: Property graph, ACID, Cypher, OLTP
- Neptune sweet spot: Managed AWS, Gremlin + SPARQL
- ArangoDB sweet spot: Multi-model (document + graph + key-value)
- JanusGraph sweet spot: Massive scale, Hadoop/HBase/Cassandra backend

**Time-Series (InfluxDB, TimescaleDB, Prometheus, ClickHouse):**
- When: Metrics, monitoring, IoT sensors, financial tick data, log analytics
- Not when: Point lookups, frequent updates, complex joins
- InfluxDB v2: Purpose-built TSM engine, Flux, downsampling, retention
- TimescaleDB: PostgreSQL extension, full SQL, continuous aggregates
- Prometheus: Pull-based metrics, alerting, multi-dimensional data model
- ClickHouse: Columnar OLAP, sub-second queries on billions of rows

**Columnar / Wide-Column (Cassandra, ScyllaDB, HBase, Bigtable):**
- When: High-volume writes, time-series at massive scale, IoT, messaging
- Not when: Ad-hoc analytics, ACID transactions, frequent schema changes
- Cassandra: Peer-to-peer, no SPOF, tunable consistency, linear scalability
- ScyllaDB: Cassandra-compatible, C++ seastar framework, lower latency
- HBase: Hadoop ecosystem, strong consistency, HDFS backend
- Bigtable: Managed, high-throughput, low-latency

### 2.4 Multi-Model & Specialized Databases

- **Spanner:** Globally distributed, SQL, strong consistency, TrueTime
- **CockroachDB:** PostgreSQL-compatible, distributed ACID, auto-sharding
- **YugabyteDB:** PostgreSQL-compatible, distributed SQL, sharded
- **Cosmos DB:** Multi-model, multi-region write, tunable consistency
- **FaunaDB:** Serverless, strongly consistent, multi-region active-active
- **EdgeDB:** PostgreSQL-based, object-relational, strict schema
- **Dolt:** Git-like versioned SQL database
- **Materialize:** Streaming SQL materialized views
- **Pinot / Druid:** Real-time OLAP, columnar, streaming ingestion

### 2.5 Selection Process Template

```
workload_analysis:
  write_pattern: steady_stream|bursty|batch
  read_pattern: point_lookup|range_scan|aggregation|full_scan
  data_volume: current_gb|predicted_yearly_growth
  consistency: strong|tunable|eventual
  transaction_scope: single_row|multi_row_multi_table
  latency_sla_p99: 1ms|5ms|10ms|50ms|100ms|500ms
  availability_sla: 99.9|99.99|99.999
  geo_distribution: single_region|multi_region_active_active|multi_region_active_passive
  team_expertise: sql_proficient|nosql_familiar|greenfield
  budget: oss_only|managed_service|enterprise_license
  compliance: acid_mandatory|audit_logging|encryption_at_rest
```

### 2.6 Common Selection Mistakes

- Choosing a relational database for a workload that never joins
- Choosing DynamoDB for workloads needing ad-hoc analytical queries
- Choosing MongoDB when the data is deeply relational
- Choosing Cassandra when read latency is top priority
- Choosing Redis for durable persistent storage
- Ignoring the skills gap
- Overestimating future scale


## P4: NoSQL Design

### 4.1 Document Database Design (MongoDB)

**Schema Design Principles:**
- Design schemas based on access patterns
- Embed data always accessed with parent
- Reference data accessed independently
- Avoid documents exceeding 16MB BSON limit
- Avoid unbounded arrays

**Embedding:**
```
{
  _id: ObjectId("..."),
  name: "Alice",
  profile: { avatar: "url", bio: "Bio text", preferences: { theme: "dark" } },
  shipping_addresses: [
    { street: "123 Main", city: "NYC", is_default: true }
  ]
}
```

**Referencing:**
```
// Customers collection
{ _id: ObjectId("..."), name: "Alice" }
// Orders collection
{ _id: ObjectId("..."), customer_id: ObjectId("..."), total: 100 }
```

**Bucketing Pattern:**
```
{
  sensor_id: "sensor-001",
  date: ISODate("2024-06-01"),
  readings: [
    { ts: ISODate("2024-06-01T00:00:00Z"), value: 72.1 },
    { ts: ISODate("2024-06-01T00:00:05Z"), value: 72.3 }
  ],
  readings_count: 17280
}
```

**Polymorphic Pattern:**
```
{ _id: "...", type: "credit_card", last4: "4242", exp_month: 12, exp_year: 2026 }
{ _id: "...", type: "bank_account", routing: "021000021", account_last4: "9876" }
```

**Schema Validation:**
```
db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "amount", "currency"],
      properties: {
        type: { enum: ["credit_card", "bank_account"] },
        amount: { bsonType: "double", minimum: 0 }
      }
    }
  },
  validationAction: "error"
});
```

### 4.2 Key-Value Design (Redis, DynamoDB)

**Redis Data Structures:**
| Structure | Use Case | Commands |
|-----------|----------|----------|
| String | Caching, counters, locks | SET, GET, INCR, SETNX |
| List | Queues, recent items | LPUSH, RPUSH, LPOP, BRPOP |
| Set | Tags, unique visitors | SADD, SMEMBERS, SINTER |
| Sorted Set | Leaderboards, rate limits | ZADD, ZRANK, ZRANGE |
| Hash | Objects, sessions | HSET, HGET, HGETALL |
| Bitmap | Feature flags, DAU | SETBIT, GETBIT, BITCOUNT |
| HyperLogLog | Unique count estimation | PFADD, PFCOUNT |
| Stream | Event sourcing, message queue | XADD, XREAD, XREADGROUP |

**DynamoDB Single Table Design:**
```
PK                        SK                        Attributes
USER#alice                PROFILE                   name, email, created_at
USER#alice                ORDER#2024-06-01#ORD-001  total, status
USER#bob                  PROFILE                   name, email, created_at
ORDER#ORD-001             ITEM#PROD-001             qty, price
PRODUCT#PROD-001          META                      name, category, price
```

**Hot Key Mitigation:**
- Add random suffix to partition key
- Use write sharding: PK = "USER#" + user_id + "#" + shard_id
- Use DynamoDB Accelerator (DAX)
- Consider adaptive capacity

**DynamoDB Transactions:**
```
const { DynamoDBClient, TransactWriteItemsCommand } = require("@aws-sdk/client-dynamodb");
await client.send(new TransactWriteItemsCommand({
  TransactItems: [
    { Put: { TableName: "Orders", Item: { PK: { S: "ORDER#001" }, ... } } },
    { Update: { TableName: "Inventory", Key: { PK: { S: "PROD#001" } },
      UpdateExpression: "SET stock = stock - :qty",
      ConditionExpression: "stock >= :qty" } }
  ]
}));
```

### 4.3 Graph Data Modeling (Neo4j)

**Property Graph Model:**
- Nodes represent entities
- Relationships represent connections (always directed, always typed)
- Both nodes and relationships can have properties
- Labels group nodes into types

```
CREATE (alice:User {name: "Alice", age: 30, city: "NYC"})
CREATE (bob:User {name: "Bob", age: 25, city: "SF"})
CREATE (alice)-[:FOLLOWS {since: 2023}]->(bob)
CREATE (alice)-[:LIKES {at: datetime()}]->(post1)
```

**Graph Query Patterns:**
```
// Friends of friends
MATCH (alice:User {name: "Alice"})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(fof)
RETURN fof.name

// Recommendation
MATCH (me:User {name: "Alice"})-[:FOLLOWS]->(friend)-[:LIKES]->(post)
WHERE NOT EXISTS((me)-[:LIKES]->(post))
RETURN post.title, count(*) AS score ORDER BY score DESC

// Shortest path
MATCH p = shortestPath((alice)-[:FOLLOWS*]-(charlie))
RETURN p
```

**Data Modeling Principles:**
- Model domain concepts as nodes, not relationship properties
- Use relationship properties sparingly
- Model time as a node for temporal graphs
- Avoid hypernodes (nodes with millions of relationships)
- Use indexes on frequently-filtered node properties

### 4.4 Wide-Column Design (Cassandra)

**Query-First Design:**
- One table per query pattern
- Denormalization is expected
- Partition key determines data locality
- Clustering columns determine sort order

```
-- Query: Recent orders by customer
CREATE TABLE orders_by_customer (
    customer_id UUID, order_date DATE, order_id UUID,
    total DECIMAL, status TEXT,
    PRIMARY KEY ((customer_id), order_date, order_id)
) WITH CLUSTERING ORDER BY (order_date DESC, order_id ASC);

-- Query: Orders by status
CREATE TABLE orders_by_status (
    status TEXT, order_date DATE, order_id UUID,
    customer_id UUID, total DECIMAL,
    PRIMARY KEY ((status), order_date, order_id)
) WITH CLUSTERING ORDER BY (order_date DESC, order_id ASC);
```

**Time-Series Pattern:**
```
CREATE TABLE sensor_data (
    sensor_id TEXT, day DATE, timestamp TIMESTAMP,
    temperature DOUBLE, humidity DOUBLE,
    PRIMARY KEY ((sensor_id, day), timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC)
   AND compaction = { 'class': 'TimeWindowCompactionStrategy',
                      'compaction_window_unit': 'DAYS',
                      'compaction_window_size': 1 }
   AND default_time_to_live = 7776000;
```

**Compaction Strategies:**
- STCS: Default, good for write-heavy workloads
- LCS: Better reads, less space amplification
- TWCS: For time-series (bucketed by time window)

**Lightweight Transactions (LWT):**
```
INSERT INTO inventory (product_id, location, quantity)
VALUES ('PROD-001', 'WH-A', 100) IF NOT EXISTS;

UPDATE inventory SET quantity = 50
WHERE product_id = 'PROD-001' AND location = 'WH-A'
IF quantity = 100;
```


## P6: Query Optimization

### 6.1 Execution Plan Analysis

**PostgreSQL:**
```
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT o.id, c.name FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.created_at > '2024-01-01'
ORDER BY o.total DESC LIMIT 100;

Key terms:
- Seq Scan: full table scan (bad for large tables)
- Index Scan: B-Tree lookup
- Index Only Scan: covering index, no heap access
- Bitmap Index Scan + Bitmap Heap Scan: bitmap of matching pages
- Nested Loop: for each outer row, probe inner (good for small outer)
- Hash Join: hash one side, probe other (good for medium joins)
- Merge Join: sort-merge both sides (good for sorted inputs)
```

**MySQL:**
```
EXPLAIN FORMAT=JSON
SELECT o.id, c.name FROM orders o
JOIN customers c ON c.id = o.customer_id WHERE o.created_at > '2024-01-01'\G

Key columns: type (system > const > eq_ref > ref > range > index > ALL)
possible_keys, key, rows, filtered, Extra
```

**SQL Server:**
```
SET STATISTICS PROFILE ON;
SET STATISTICS IO ON;
SELECT ...
SET STATISTICS PROFILE OFF;
```

**Oracle:**
```
EXPLAIN PLAN FOR SELECT * FROM orders WHERE customer_id = 123;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(FORMAT => 'ALLSTATS LAST'));
```

### 6.2 Join Strategies

**Nested Loop Join:**
- For each outer row, scan inner for matches
- Best when: outer small, inner has index
- O(outer_rows * inner_index_lookup_cost)

**Hash Join:**
- Build hash on smaller, probe with larger
- Best when: no index, both medium/large
- O(build_cost + probe_cost)

**Merge Join:**
- Sort both, then merge
- Best when: both already sorted (indexed)
- O(n + m) if sorted

**Configure (PostgreSQL):**
```
SET enable_nestloop = off;
SET enable_hashjoin = off;
SET enable_mergejoin = off;
```

### 6.3 Subqueries vs CTEs

**Correlated Subquery:**
```
SELECT id, name,
    (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) AS order_count
FROM customers c;
-- N+1 problem
```

**Uncorrelated Subquery:**
```
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE active = true);
```

**CTE:**
```
WITH customer_orders AS (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders WHERE created_at > '2024-01-01' GROUP BY customer_id
)
SELECT c.id, c.name, COALESCE(co.order_count, 0) AS order_count
FROM customers c LEFT JOIN customer_orders co ON co.customer_id = c.id;
```

**CTE Materialization (PG12+):**
```
WITH customer_orders AS NOT MATERIALIZED (...)
```

**LATERAL JOIN:**
```
SELECT c.id, c.name, recent.total
FROM customers c
LEFT JOIN LATERAL (
    SELECT total FROM orders
    WHERE customer_id = c.id
    ORDER BY created_at DESC LIMIT 1
) recent ON true;
```

### 6.4 Query Rewriting

**1. Cursor to Set-based:**
```
-- BAD
DECLARE cur CURSOR FOR SELECT id, salary FROM employees WHERE dept_id = 10;
-- GOOD
UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 10;
```

**2. OR to UNION:**
```
-- BAD
SELECT * FROM orders WHERE customer_id = 123 OR status = 'urgent';
-- GOOD
SELECT * FROM orders WHERE customer_id = 123
UNION
SELECT * FROM orders WHERE status = 'urgent' AND customer_id != 123;
```

**3. NOT IN to NOT EXISTS:**
```
-- BAD
SELECT * FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);
-- GOOD
SELECT * FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

**4. SELECT * to needed columns:**
```
-- BAD: prevents index-only scans
SELECT * FROM orders WHERE customer_id = 123;
-- GOOD
SELECT id, total, status FROM orders WHERE customer_id = 123;
```

**5. Push predicates down:**
```
-- BAD: LEFT JOIN becomes INNER JOIN
SELECT * FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at > '2024-01-01';
-- GOOD
SELECT * FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.created_at > '2024-01-01';
```

**6. UNION to UNION ALL:**
```
SELECT id FROM active_users
UNION ALL
SELECT id FROM archived_users;
```

**7. Aggregate to Window:**
```
SELECT DISTINCT department_id,
    AVG(salary) OVER (PARTITION BY department_id),
    MAX(salary) OVER (PARTITION BY department_id)
FROM employees;
```

### 6.5 Statistics and Cardinality

```
-- View statistics (PostgreSQL)
SELECT tablename, attname, n_distinct, most_common_vals,
       most_common_freqs, histogram_bounds, correlation
FROM pg_stats WHERE tablename = 'orders';

-- Update
ANALYZE orders;

-- Set target
ALTER TABLE orders ALTER COLUMN customer_id SET STATISTICS 1000;

-- Extended statistics (PG10+)
CREATE STATISTICS s_orders_customer_status (dependencies)
ON customer_id, status FROM orders;
```

### 6.6 Query Hints

**MySQL:**
```
SELECT * FROM orders USE INDEX (idx_customer_created)
WHERE customer_id = 123 AND created_at > '2024-01-01';

SELECT * FROM orders FORCE INDEX (PRIMARY) WHERE id = 123;
```

**SQL Server:**
```
SELECT * FROM orders WITH (INDEX(idx_customer_created)) WHERE customer_id = 123;
SELECT * FROM orders WITH (NOLOCK) WHERE customer_id = 123;
```

**Oracle:**
```
SELECT /*+ INDEX(orders idx_orders_customer) */ * FROM orders WHERE customer_id = 123;
SELECT /*+ FULL(orders) */ * FROM orders WHERE customer_id = 123;
```

### 6.7 Query Optimization Process

```
Step 1: Identify slow query (slow query log, monitoring)
Step 2: Capture execution plan (EXPLAIN ANALYZE)
Step 3: Check index usage
Step 4: Verify row estimates vs actual
Step 5: Examine join order and method
Step 6: Check sort operations
Step 7: Review WHERE clause sargability
Step 8: Check data types (implicit conversion)
Step 9: Consider query structure
Step 10: Implement fix
Step 11: Verify improvement
Step 12: Monitor in production
```

### 6.8 Sargability

```
-- NOT SARGABLE:
WHERE UPPER(email) = 'ALICE@EXAMPLE.COM'
WHERE DATE(created_at) = '2024-06-01'
WHERE total + 10 > 100

-- SARGABLE:
WHERE email = 'alice@example.com'
WHERE created_at >= '2024-06-01' AND created_at < '2024-06-02'
WHERE total > 90
WHERE phone LIKE '555%'
```

### 6.9 Parameterized Queries

```
-- PostgreSQL
PREPARE find_orders(INT) AS SELECT * FROM orders WHERE customer_id = $1;
EXECUTE find_orders(123);

-- SQL Server
EXEC sp_executesql
  N'SELECT * FROM orders WHERE customer_id = @id',
  N'@id INT', @id = 123;
```

### 6.10 Parallel Query

```
-- PostgreSQL
SET max_parallel_workers_per_gather = 4;
SET parallel_tuple_cost = 0.01;
SET parallel_setup_cost = 100;

-- MySQL (8.0.17+)
SET GLOBAL innodb_parallel_read_threads = 4;
```


## P8: Schema Migrations

### 8.1 Guiding Principles

- Every migration must be reversible
- Backward compatible (app runs with old or new schema)
- Expand-Migrate-Contract pattern for zero-downtime
- Test against production data copy
- Never modify applied migrations
- Version control all migration files
- Automate migration execution

### 8.2 Expand-Migrate-Contract

**Phase 1: Expand**
Add new column/table without removing old.
```
ALTER TABLE orders ADD COLUMN total_v2 DECIMAL(12,2);
CREATE INDEX idx_orders_status_v2 ON orders(status_v2);
-- Application writes to both, reads old
UPDATE orders SET total_v2 = total WHERE total_v2 IS NULL;
```

**Phase 2: Migrate**
Application uses both, prefers new.
```
-- Application reads from total_v2, writes both
-- Monitor for issues
```

**Phase 3: Contract**
Remove old after confirming stability.
```
ALTER TABLE orders DROP COLUMN total;
ALTER TABLE orders RENAME COLUMN total_v2 TO total;
```

### 8.3 Migration Tools

**Flyway:**
```
./flyway migrate -url=jdbc:postgresql://localhost/mydb -user=app -password=***
./flyway validate
```

**Liquibase:**
```
databaseChangeLog:
  - changeSet:
      id: 001-create-users
      changes:
        - createTable:
            tableName: users
            columns:
              - column: { name: id, type: BIGINT, autoIncrement: true }
              - column: { name: name, type: VARCHAR(255) }
```

**Alembic:**
```
alembic revision --autogenerate -m "create users table"
alembic upgrade head
alembic downgrade -1
```

### 8.4 Online Schema Changes

**gh-ost (MySQL):**
```
gh-ost --host=127.0.0.1 --database=mydb --table=orders \
  --alter="ADD COLUMN total_v2 DECIMAL(12,2)" --execute
```

**pgroll (PostgreSQL):**
```
pgroll add-column orders total_v2 DECIMAL(12,2)
```

**Safe FK Add (PostgreSQL):**
```
ALTER TABLE order_items ADD CONSTRAINT fk_order_v2
    FOREIGN KEY (order_v2_id) REFERENCES orders(id) NOT VALID;
ALTER TABLE order_items VALIDATE CONSTRAINT fk_order_v2;
```

### 8.5 Backward Compatibility Checks

| Change | Safe | Unsafe |
|--------|------|--------|
| Add nullable column | Yes | - |
| Add NOT NULL column | With default | Without default |
| Drop column | After stopping reads | While app reads it |
| VARCHAR to TEXT | Yes | - |
| TEXT to VARCHAR | No (truncation risk) | - |
| Add index CONCURRENTLY | Yes | Blocking create |
| Add FK | With NOT VALID | Without NOT VALID |

### 8.6 Migration Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Irreversible migration | Always write down migration |
| Modifying applied migrations | Only add new migrations |
| Large migration in one statement | Use batching, online tools |
| Migration depending on app code | Self-contained migrations |
| Not testing on production-sized data | Test with prod data volume |
| Renaming columns directly | Add new, dual-write, backfill, drop |


## P10: Replication

### 10.1 Topologies

**Single Leader:**
```
Primary: accepts all writes
Replicas: read-only, backup source
Async (default), semi-sync, sync
PostgreSQL: streaming replication, logical replication
MySQL: binlog-based async, semi-sync, Group Replication
```

**Multi-Leader:**
```
Multiple nodes accept writes
Bi-directional propagation
Conflict resolution required
PostgreSQL BDR, MySQL Group Replication, Galera Cluster
```

**Leaderless:**
```
Any node accepts reads/writes
R + W > N for consistency
Cassandra: ANY, ONE, QUORUM, ALL
DynamoDB: eventually consistent, strongly consistent, global tables
```

### 10.2 Replication Lag

**Causes:**
- Large write volume on primary
- Long-running transactions
- Under-provisioned replicas
- Expensive queries on replicas
- Network latency
- Single-threaded apply

**Monitoring (PostgreSQL):**
```
SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
FROM pg_stat_replication;

SELECT now() - pg_last_xact_replay_timestamp() AS replica_lag;
```

**Monitoring (MySQL):**
```
SHOW SLAVE STATUS\G
-- Seconds_Behind_Master, Relay_Master_Log_File, Exec_Master_Log_Pos
```

**Mitigation:**
- Upgrade replica instance
- Parallel replication workers
- Reduce long-running transactions
- Multi-threaded apply
- Route read-after-write to primary

### 10.3 Conflict Resolution

| Strategy | How | Used By |
|----------|-----|---------|
| LWW | Latest timestamp wins | DynamoDB, Cassandra, Cosmos |
| Custom Merge | Stored procedure | Cosmos DB, CouchDB |
| CRDT | Mathematical convergence | Redis CRDTs, Riak |
| Application | Log for human resolution | CouchDB MVCC |

### 10.4 Read Replicas Architecture

**Use Cases:**
- Offload reporting/analytics
- Serve read-heavy applications
- Geographic read locality
- HA (promote on failure)

**Routing Strategies:**
1. Application level: separate pools for primary/replica
2. Proxy level: PgBouncer + pgcat, ProxySQL
3. Connection strings: read/write splitting in ORM

### 10.5 Sync vs Async

| Aspect | Sync | Async |
|--------|------|-------|
| Data loss | RPO = 0 | RPO = lag |
| Write latency | Higher | Lower |
| Write throughput | Lower | Higher |
| Impact of replica down | Affects primary | No impact |
| Use case | Finance, compliance | Most OLTP, geo-replicas |

**Semi-Sync:**
- PostgreSQL: synchronous_standby_names
- MySQL: rpl_semi_sync_master_enabled

### 10.6 Quorum Replication

**Cassandra:**
```
Write: coordinator sends to all replicas, waits for consistency-level ACKs
Read: coordinator sends to replicas, waits for quorum, compares timestamps, read repair
```

**Consistency Levels:**
| Level | Guarantee |
|-------|-----------|
| ANY | Write guaranteed (hint stored) |
| ONE | One replica |
| QUORUM | Majority (RF/2 + 1) |
| LOCAL_QUORUM | Quorum in local DC |
| EACH_QUORUM | Quorum in each DC |
| ALL | All replicas |

**Formula: R + W > N for strong consistency**

### 10.7 CDC

| Database | Mechanism |
|----------|-----------|
| PostgreSQL | Logical replication slots, wal2json, Debezium |
| MySQL | Binlog (row-based), Debezium, Maxwell |
| SQL Server | CDC feature, Change Tracking |
| Oracle | LogMiner, GoldenGate, XStream |


## P12: Backup & Recovery

### 12.1 Backup Types

| Type | Description | Size | Restore |
|------|-------------|------|---------|
| Full | Complete database copy | Full size | Baseline |
| Incremental | Changes since last backup | Small | Full + all incrementals |
| Differential | Changes since last full | Medium | Full + latest diff |
| Physical | Copy raw database files | Full size | File copy + recovery |
| Logical | SQL/delimited export | Variable | SQL execution |

### 12.2 PostgreSQL Backup

**Physical (pg_basebackup):**
```
pg_basebackup -h primary -D /backup/full/$(date +%Y%m%d) -X stream -P -v
```

**WAL Archiving:**
```
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /archive/%f && cp %p /archive/%f'
archive_timeout = 60
```

**PITR:**
```
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2024-06-01 14:30:00 UTC'
```

**Logical (pg_dump):**
```
pg_dump -h localhost -U postgres -Fc mydb > mydb.dump
pg_restore -d mydb mydb.dump
pg_dump -h localhost -U postgres -Fd -j 4 mydb -f /backup/dump_dir
pg_dump -h localhost -U postgres --schema-only mydb > schema.sql
```

### 12.3 MySQL Backup

**Physical (XtraBackup):**
```
xtrabackup --backup --target-dir=/backup/full/20240601 --user=root --password=***
xtrabackup --prepare --target-dir=/backup/full/20240601
xtrabackup --copy-back --target-dir=/backup/full/20240601
```

**Logical (mysqldump):**
```
mysqldump -h localhost -u root -p --all-databases > fulldump.sql
mysqldump --single-transaction --quick --routines --triggers mydb > mydb.sql
```

**PITR:**
```
mysqlbinlog mysql-bin.000123 --stop-datetime="2024-06-01 14:30:00" | mysql -u root -p
```

### 12.4 MongoDB Backup

```
mongodump --uri="mongodb://localhost:27017" --out=/backup/dump --gzip
mongorestore --uri="mongodb://localhost:27017/mydb" /backup/dump
```

### 12.5 Backup Strategy

```
RPO < 1 minute: Continuous WAL archiving + sync replication
RPO < 1 hour: WAL archiving every 60s, incremental backups
RPO < 1 day: Daily full + differential every 6 hours

Retention:
  Daily: 30 days
  Weekly: 12 weeks
  Monthly: 12 months
  Yearly: 7 years (compliance)
  Archived: cold storage (S3 Glacier)
```

### 12.6 Backup Validation

- File size > 0
- Checksum/hash matches
- Restore on non-production
- Verify row counts
- Execute key queries
- Check for corruption (pg_checksums, DBCC CHECKDB)

### 12.7 Restore Testing

```
-- PostgreSQL
pg_ctl stop -D /data/pgdata
rm -rf /data/pgdata
pg_basebackup -h backup_server -D /data/pgdata -X stream
pg_ctl start -D /data/pgdata
psql -c "SELECT count(*) FROM orders;"

-- MySQL
mysql -e "CREATE DATABASE test_restore;"
mysql test_restore < /backup/full_dump.sql
mysql -e "SELECT count(*) FROM test_restore.orders;"
```

### 12.8 DR Testing

- Tabletop exercise: walk through runbook
- Partial DR: restore single critical database
- Full DR: complete failover, run 24h, fail back
- Chaos testing: kill primary, measure recovery time

**Metrics:** backup success rate (>99.9%), restore success rate (100%), TTR, RPO achieved, RTO achieved


## P14: Caching

### 14.1 Database-Level Caching

**PostgreSQL Shared Buffers:**
```
-- Shared memory for data blocks
shared_buffers = 4GB  (typically 25% of RAM)
-- Effectiveness: cache hit ratio > 95% is good
SELECT 'cache hit ratio' AS name,
       sum(blks_hit) / (sum(blks_hit) + sum(blks_read)) * 100 AS ratio
FROM pg_stat_database;
```

**InnoDB Buffer Pool:**
```
innodb_buffer_pool_size = 8G  (typically 70% of RAM)
-- Monitor:
SHOW STATUS LIKE 'Innodb_buffer_pool_read_%';
-- read_requests: total reads
-- reads: reads from disk (not cache)
```

### 14.2 Result Cache

**MySQL Query Cache (removed in 8.0):**
- Legacy feature, not recommended
- Use application-level caching instead

**PostgreSQL Query Plan Cache:**
- No generic result cache built-in
- pg_stat_statements for query statistics
- Plan cache via PREPARE/EXECUTE

### 14.3 Write-Through Cache

```
-- Write to cache AND database simultaneously
// Application pattern
async function writeData(key, value) {
    await redis.set(key, JSON.stringify(value));
    await db.query('INSERT INTO cache_test VALUES ($1, $2)', [key, value]);
}
-- Pros: Cache always consistent
-- Cons: Write latency = max(cache, db)
```

### 14.4 Write-Behind (Write-Back) Cache

```
-- Write to cache immediately, async write to DB
async function writeData(key, value) {
    await redis.set(key, JSON.stringify(value));
    // Queue async write to database
    writeQueue.push({ key, value, timestamp: Date.now() });
}
-- Background worker flushes queue to DB
-- Pros: Very fast writes
-- Cons: Data loss if cache fails before DB write
```

### 14.5 Read-Through Cache

```
async function getData(key) {
    let value = await redis.get(key);
    if (!value) {
        value = await db.query('SELECT * FROM data WHERE key = $1', [key]);
        await redis.set(key, JSON.stringify(value));
    }
    return value;
}
```

### 14.6 Cache Invalidation

**TTL-based:**
```
SETEX cache:key 3600 "value"  -- Expires in 1 hour
```

**Event-based (cache-aside):**
```
// On data update:
async function updateData(key, value) {
    await db.query('UPDATE data SET value = $1 WHERE key = $2', [value, key]);
    await redis.del(`cache:${key}`);
}
// On next get, cache miss -> reload from DB
```

**Write-through:**
Cache updated atomically with DB write.

**Pattern Considerations:**
- TTL: simple but may serve stale data within TTL window
- Event-based: more consistent but adds complexity
- Write-through: most consistent but slowest writes

### 14.7 Redis Patterns

```
-- Rate limiter (sorted set + time window)
-- Sliding window counter
INCR rate_limit:user:1234:api:endpoint
EXPIRE rate_limit:user:1234:api:endpoint 60

-- Distributed lock (Redlock)
SET lock:resource_id "instance_id" NX PX 10000

-- Session store
SETEX session:abc123 '{"user_id": 123, "expires": ...}' 3600

-- Leaderboard
ZADD leaderboard:game:weekly 1500 "player1"
ZREVRANGE leaderboard:game:weekly 0 9 WITHSCORES

-- Message queue
LPUSH task:queue "{...payload...}"
BRPOP task:queue 0

-- Pub/Sub
SUBSCRIBE channel:orders
PUBLISH channel:orders "order created"
```

### 14.8 Cache-Aside vs Read-Through vs Write-Through

| Pattern | Read | Write | Consistency | Complexity |
|---------|------|-------|-------------|------------|
| Cache-Aside | Miss -> load to cache | Invalidate cache | Good | Low |
| Read-Through | Cache loads from DB | Invalidate cache | Good | Medium |
| Write-Through | Miss -> load to cache | Write to both | Strong | Medium |
| Write-Behind | Miss -> load to cache | Write to cache, async DB | Weak | High |


## P16: Performance Monitoring

### 16.1 Slow Query Log

**PostgreSQL:**
```
log_min_duration_statement = 1000  -- Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_connections = on
log_disconnections = on
log_checkpoints = on

-- Using pg_stat_statements
CREATE EXTENSION pg_stat_statements;
SELECT query, calls, total_exec_time, mean_exec_time, rows,
       shared_blks_hit, shared_blks_read
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 20;
```

**MySQL:**
```
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1

-- Analyze slow log
mysqldumpslow -t 10 /var/log/mysql/slow.log
pt-query-digest /var/log/mysql/slow.log
```

**SQL Server:**
```
-- Query Store (primary tool)
ALTER DATABASE mydb SET QUERY_STORE = ON;
ALTER DATABASE mydb SET QUERY_STORE (
    OPERATION_MODE = READ_WRITE,
    INTERVAL_LENGTH_MINUTES = 15,
    MAX_PLANS_PER_QUERY = 200
);

-- Top queries by duration
SELECT TOP 10 q.query_id, qt.query_sql_text,
       rs.avg_duration, rs.avg_cpu_time, rs.avg_logical_reads
FROM sys.query_store_query q
JOIN sys.query_store_query_text qt ON q.query_text_id = qt.query_text_id
JOIN sys.query_store_plan p ON q.query_id = p.query_id
JOIN sys.query_store_runtime_stats rs ON p.plan_id = rs.plan_id
ORDER BY rs.avg_duration DESC;
```

### 16.2 Wait Events

**PostgreSQL Wait Events:**
```
-- Current wait events
SELECT pid, wait_event_type, wait_event, state, query
FROM pg_stat_activity
WHERE wait_event IS NOT NULL AND state != 'idle'
ORDER BY wait_event_type;

-- Wait event types:
-- Lock: waiting for heavyweight lock
-- LWLock: waiting for lightweight lock
-- BufferPin: waiting for buffer pin
-- Activity: background worker waiting
-- IO: waiting for I/O completion
-- Client: waiting for client to send data
```

**Wait Event Analysis (PostgreSQL):**
```
SELECT wait_event_type, wait_event, count(*)
FROM pg_stat_activity WHERE wait_event IS NOT NULL GROUP BY 1, 2;

-- Long-term wait statistics (PG14+)
SELECT wait_event_type, wait_event, total_time, count
FROM pg_stat_wait_events
WHERE total_time > 0;
```

### 16.3 AWR / Statspack (Oracle)

```
-- Statspack
SQL> @?/rdbms/admin/spcreate.sql
SQL> EXEC statspack.snap;
-- After workload, create report
SQL> @?/rdbms/admin/spreport.sql

-- AWR (Diagnostic Pack)
SQL> EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;
-- Generate report
SQL> @?/rdbms/admin/awrrpt.sql
```

### 16.4 Latency Breakdown

```
-- Application -> Network -> Database -> Storage

-- Measure each layer:
-- 1. Application: query response time instrumented
-- 2. Network latency: ping, traceroute
-- 3. Database time: pg_stat_activity, query duration
-- 4. Storage latency: iostat, iowait, disk latency

-- PostgreSQL: track_io_timing
track_io_timing = on
-- Then EXPLAIN (ANALYZE, BUFFERS) shows I/O time
```

### 16.5 Active Session History

**PostgreSQL:**
```
-- pg_stat_activity gives current snapshot
-- pg_stat_bgwriter for background writer stats
-- pg_stat_user_tables for table-level activity (seq_scan, idx_scan, n_tup_*)
```

**MySQL Performance Schema:**
```
-- Current sessions
SELECT * FROM performance_schema.threads WHERE PROCESSLIST_ID IS NOT NULL;

-- Wait events by thread
SELECT thread_id, event_name, source, timer_wait/1000000000 AS wait_ms
FROM performance_schema.events_waits_current
WHERE timer_wait > 1000000000  -- events > 1s
ORDER BY timer_wait DESC;
```

**Oracle ASH:**
```
-- Active Session History (ASH) — sampled every 10 seconds
-- V$ACTIVE_SESSION_HISTORY
-- DBA_HIST_ACTIVE_SESS_HISTORY (AWR)
```

### 16.6 Blocking Chain Analysis

```
-- PostgreSQL: blocked queries
SELECT blocked.pid AS blocked_pid, blocked.query AS blocked_query,
       blocking.pid AS blocking_pid, blocking.query AS blocking_query,
       pg_cancel_backend(blocking.pid)  -- or pg_terminate_backend
FROM pg_stat_activity blocked
JOIN pg_locks blocked_locks ON blocked.pid = blocked_locks.pid AND NOT blocked_locks.granted
JOIN pg_locks blocking_locks ON blocked_locks.locktype = blocking_locks.locktype
    AND blocked_locks.database = blocking_locks.database
    AND blocked_locks.relation = blocking_locks.relation
    AND blocked_locks.page = blocking_locks.page
    AND blocked_locks.tuple = blocking_locks.tuple
    AND blocking_locks.granted
JOIN pg_stat_activity blocking ON blocking.pid = blocking_locks.pid;
```


## P18: Data Archival

### 18.1 Partitioned Archival

```
-- Stage 1: Detach old partition
ALTER TABLE orders DETACH PARTITION orders_2019;

-- Stage 2: Compress and move
ALTER TABLE orders_2019 SET TABLESPACE archive_tbs;
-- PostgreSQL: with ZSTD compression (PG15+)
ALTER TABLE orders_2019 SET (compression = pglz);

-- Stage 3: Move to cold storage (CSV export + S3)
COPY orders_2019 TO '/tmp/orders_2019.csv' CSV HEADER;
-- Upload to S3 Glacier, delete original after verification
DROP TABLE IF EXISTS orders_2019;
```

### 18.2 Lifecycle Policies

```
-- pg_cron for automated partition management
SELECT cron.schedule('archive-old-data', '0 2 1 * *', $$
    CALL archive_partitions('orders', INTERVAL '2 years');
$$);

-- DynamoDB TTL (automatic expiration)
-- Enable TTL on table, specify attribute name

-- MongoDB TTL index
db.orders.createIndex({ "archived_at": 1 }, { expireAfterSeconds: 0 });

-- S3 lifecycle policies for backup files
-- Transition to Glacier after 30 days
-- Delete after 365 days
```

### 18.3 Retention Strategies

| Data Type | Retention | Archival | Purging |
|-----------|-----------|----------|---------|
| Transactional orders | 7 years (compliance) | After 2 years to cold storage | After 7 years |
| Audit logs | 3-7 years (varies) | Monthly | After retention |
| Session data | 24 hours | None | After 24h TTL |
| Metrics (raw) | 30 days | Downsampled after 7 days | After 30 days |
| Metrics (1h avg) | 1 year | None | After 1 year |
| Backup files | 30 days daily, 12 weeks weekly, 12 months monthly | Glacier after 30 days | After retention |

### 18.4 Purge Strategies

```
-- Batch deletion (avoid huge single DELETE)
DO $$
DECLARE deleted_rows INT;
BEGIN
    LOOP
        DELETE FROM orders WHERE created_at < '2020-01-01' LIMIT 10000;
        GET DIAGNOSTICS deleted_rows = ROW_COUNT;
        EXIT WHEN deleted_rows = 0;
        COMMIT;
    END LOOP;
END;
$$;

-- Create empty partition with same structure, then drop old
CREATE TABLE orders_new (LIKE orders INCLUDING ALL);
DROP TABLE orders_old;

-- For MySQL: pt-archiver
pt-archiver --source h=localhost,D=mydb,t=orders \
  --purge --where 'created_at < "2020-01-01"' \
  --limit 10000 --commit-each
```


## P20: Worked Examples

### Example 1: E-Commerce Platform Database Selection

**Context:** Building an e-commerce platform with 1M products, 100K customers, 10K orders/day

**Requirements:**
- Customer profiles (semi-structured, varying attributes)
- Product catalog with variants, categories, inventory
- Order processing (ACID required for payments, inventory)
- Real-time inventory lookups (<5ms p99)
- Analytics queries on historical sales
- Search across 1M products

**Decision:**
- **Customer profiles:** MongoDB (polymorphic, fast reads)
- **Product catalog:** MongoDB (denormalized variants, catalog browsing)
- **Orders + payments:** PostgreSQL (ACID, transaction processing)
- **Inventory:** Redis (real-time stock counters, <1ms reads)
- **Analytics:** ClickHouse (columnar OLAP on exported data)
- **Full-text search:** Elasticsearch (synonyms, faceted search)

**Schema highlights:**
- PostgreSQL: orders (normalized), payments, shippments - strong consistency
- MongoDB: products with embedded variants, categories as references
- Redis: inventory:PROD-001 as string (stock count), hot selling counter

### Example 2: SaaS Multi-Tenant Database Architecture

**Context:** SaaS platform with 500 tenants, each with up to 1GB data

**Isolation strategies considered:**
1. Database per tenant (strongest isolation, hardest to manage)
2. Schema per tenant (good isolation, shared database)
3. Shared schema with tenant_id column (simplest, weakest isolation)

**Decision: Schema per tenant for premium, shared for standard**

```
-- Shared schema (standard tier)
CREATE TABLE orders_standard (
    id BIGSERIAL,
    tenant_id INT NOT NULL,
    customer_id INT,
    total DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT now()
) PARTITION BY LIST (tenant_id);

-- RLS for data isolation
ALTER TABLE orders_standard ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders_standard
    USING (tenant_id = current_setting('app.tenant_id')::INT);

-- Dedicated schema (premium tier)
CREATE SCHEMA tenant_42;
CREATE TABLE tenant_42.orders (...);
```

### Example 3: Time-Series IoT Platform

**Context:** 100K sensors reporting every 5 seconds

**Requirements:**
- Ingest 20K writes/second
- Query: latest reading per sensor (sub-second)
- Query: average over last hour, day, week
- Query: alert when temperature exceeds threshold
- Data retention: raw 30 days, hourly avg 1 year

**Decision: TimescaleDB (PostgreSQL extension)**

```
-- Hypertable
CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INT NOT NULL,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION
);
SELECT create_hypertable('sensor_data', 'time',
    chunk_time_interval => INTERVAL '1 day');

-- Continuous aggregates
CREATE MATERIALIZED VIEW device_hourly
WITH (timescaledb.continuous) AS
SELECT sensor_id,
       time_bucket('1 hour', time) AS bucket,
       avg(temperature) AS avg_temp,
       max(temperature) AS max_temp,
       min(temperature) AS min_temp
FROM sensor_data
GROUP BY sensor_id, 2;

-- Compression
ALTER TABLE sensor_data SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'sensor_id'
);
SELECT add_compression_policy('sensor_data', INTERVAL '7 days');

-- Retention
SELECT add_retention_policy('sensor_data', INTERVAL '30 days');
```

### Example 4: Social Network Graph Database

**Context:** Building a social network with users, posts, likes, follows

**Decision: Neo4j for relationships, PostgreSQL for content**

```
// Neo4j: Relationship queries
CREATE CONSTRAINT FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE INDEX FOR (u:User) ON (u.name);

// Feed generation (friends + interests)
MATCH (me:User {id: 'user-123'})-[:FOLLOWS]->(friend)-[:POSTED]->(post)
OPTIONAL MATCH (me)-[:LIKES]->(liked_post)
WHERE NOT EXISTS((me)-[:SEEN]->(post))
RETURN post, friend.name AS author, post.created_at AS time
ORDER BY time DESC LIMIT 20

// Friend recommendations (mutual friends)
MATCH (me:User {id: 'user-123'})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(candidate)
WHERE NOT EXISTS((me)-[:FOLLOWS]->(candidate))
RETURN candidate.name, count(*) AS mutual_friends
ORDER BY mutual_friends DESC LIMIT 10
```

```
-- PostgreSQL: User content with ACID
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

### Example 5: Global Event Sourcing System

**Context:** Global event sourcing with 50 regions, 100K events/second

**Decision: Apache Kafka for event log + Cassandra for read models**

```
-- Kafka: Event log (canonical source of truth)
// Topic: events.orders
// Partition key: order_id (ensures order events stay ordered)
// Retention: 7 days or compacted

-- Cassandra: Read model (denormalized for query patterns)
// Event-sourced read models rebuilt from Kafka

-- Each region has local Kafka + Cassandra cluster
-- Cross-region replication via MirrorMaker
```

**Schema:**
```
// Kafka event schema (Avro)
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "event_id", "type": "string"},
    {"name": "aggregate_id", "type": "string"},
    {"name": "event_type", "type": "string"},
    {"name": "data", "type": "bytes"},
    {"name": "timestamp", "type": "long"}
  ]
}

// Cassandra read model
CREATE TABLE order_summary (
    order_id UUID PRIMARY KEY,
    customer_id UUID, status TEXT, total DECIMAL,
    items LIST<FROZEN<item_type>>,
    last_event_type TEXT, last_event_ts TIMESTAMP
);
```

### Example 6: Financial Ledger with ACID + Audit

**Context:** Double-entry accounting system with 1M transactions/day

**Requirements:**
- ACID transactions (money cannot disappear)
- Complete audit trail
- Point-in-time balance queries
- No silent data corruption

**Decision: PostgreSQL with careful design**

```
-- Double-entry ledger
CREATE TABLE journal_entries (
    id BIGSERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by TEXT
);

CREATE TABLE journal_lines (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL REFERENCES journal_entries(id),
    account_id INT NOT NULL REFERENCES accounts(id),
    amount DECIMAL(20,2) NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('debit', 'credit')),
    CHECK (amount > 0)
);

-- Constraint: every entry must balance
CREATE VIEW entry_balance AS
SELECT entry_id, sum(CASE WHEN side='debit' THEN amount ELSE -amount END) AS balance
FROM journal_lines GROUP BY entry_id;

-- But constraint must be enforced at transaction level
-- Use DEFERRABLE constraint
ALTER TABLE journal_entries ADD CONSTRAINT balanced_entry
    CHECK (NOT EXISTS (SELECT 1 FROM entry_balance eb WHERE eb.entry_id = id AND balance != 0))
    DEFERRABLE INITIALLY DEFERRED;

-- Running balance (materialized for performance)
CREATE MATERIALIZED VIEW account_balances AS
SELECT account_id, entry_date,
       sum(amount) FILTER (WHERE side='debit') - sum(amount) FILTER (WHERE side='credit') AS balance
FROM journal_lines jl
JOIN journal_entries je ON je.id = jl.entry_id
GROUP BY account_id, entry_date;
```

### Example 7: Content Management System with Search

**Context:** CMS with 500K articles, categories, tags, authors, comments

**Decision: PostgreSQL for structured data, MongoDB for content storage, Elasticsearch for search**

```
-- PostgreSQL: Relationships, integrity
CREATE TABLE authors (id INT PRIMARY KEY, name TEXT, email TEXT);
CREATE TABLE categories (id INT PRIMARY KEY, name TEXT, slug TEXT UNIQUE);
CREATE TABLE article_meta (
    id BIGSERIAL PRIMARY KEY,
    author_id INT REFERENCES authors(id),
    category_id INT REFERENCES categories(id),
    title TEXT NOT NULL, slug TEXT UNIQUE,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now()
);

-- MongoDB: Article content (body, images, embeds - variable structure)
{
  _id: ObjectId("..."),
  article_id: 12345,
  body: "<html content>",
  blocks: [
    { type: "text", content: "..." },
    { type: "image", url: "...", caption: "..." },
    { type: "code", language: "python", content: "... "}
  ],
  meta_description: "...",
  open_graph: { title: "...", image: "..." }
}

-- Elasticsearch: Full-text search with faceting
PUT /articles
{
  "mappings": {
    "properties": {
      "title": { "type": "text", "analyzer": "english" },
      "body": { "type": "text", "analyzer": "english" },
      "author": { "type": "keyword" },
      "category": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "published_at": { "type": "date" }
    }
  }
}
```

### Example 8: Multi-Region Active-Active with CockroachDB

**Context:** Global user base (US, EU, APAC), 99.999% availability required

**Decision: CockroachDB (distributed SQL, PostgreSQL-compatible)**

```
-- Table with locality
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name STRING, email STRING UNIQUE,
    region STRING NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Global table (low latency everywhere)
-- Regional by row (data stays in home region, but available everywhere)

ALTER TABLE users SET LOCALITY REGIONAL BY ROW;
-- CockroachDB automatically adds a crdb_region column

-- Follower reads for read-heavy workloads
SELECT * FROM users AS OF SYSTEM TIME follower_read_timestamp()
WHERE id = 'abc-123-def';

-- Survives entire region failure automatically
-- RPO = 0 (no data loss), RTO = seconds
```

### Example 9: Object Store Migration to PostgreSQL

**Context:** Migrating from MongoDB to PostgreSQL for a growing startup

**Migration Strategy:**
```
1. Set up PostgreSQL with target schema
2. Add CDC from MongoDB to PostgreSQL (Debezium + Kafka)
3. Backfill historical data (batch export/import)
4. Verify data consistency (row counts, checksums)
5. Switch read queries to PostgreSQL (with validation)
6. Switch write queries to PostgreSQL
7. Decommission MongoDB

-- Batch export
mongoexport --uri="mongodb://localhost/mydb" --collection=orders \
  --query='{created_at: {$lt: ISODate("2024-01-01")}}' \
  --type=csv --fields=_id,customer_id,total,status,created_at > orders_old.csv

psql -c "\COPY orders FROM 'orders_old.csv' CSV HEADER"

-- Real-time sync (Debezium + Kafka + JDBC sink)
-- Validates data after sync
SELECT count(*) FROM mongo_orders_count WHERE count = (SELECT count(*) FROM orders);
```

### Example 10: Sharding Migration for Hypergrowth

**Context:** Single PostgreSQL instance hitting 2TB, scaling issues

**Migration to sharded architecture (Citus):**
```
// Current: single node
// Target: 4 Citus worker nodes + coordinator

-- Define shard key (customer_id for data locality)
SELECT create_distributed_table('orders', 'customer_id');
SELECT create_distributed_table('customers', 'customer_id',
                                colocate_with => 'orders');

-- Migration: copy data in batches
WITH batch AS (
    SELECT * FROM legacy_orders
    WHERE customer_id BETWEEN 1 AND 10000
    ORDER BY customer_id
    LIMIT 10000
)
INSERT INTO orders SELECT * FROM batch;

-- Validate
SELECT count(*), 'legacy_orders' AS source FROM legacy_orders
UNION ALL
SELECT count(*), 'orders' FROM orders;

-- Recreate indexes
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);

-- Switch application to Citus
-- Drop legacy after validation
```

### Example 11: Materialized View for Real-Time Dashboard

**Context:** Operations dashboard polling every 30 seconds, need sub-second response

**Decision: Continuous aggregate (TimescaleDB)**
```
-- Raw data: 100M rows, 1M new rows/day
-- Query: revenue by product category for last 24 hours (formerly 12 seconds)

-- Before: direct query took 12 seconds
SELECT p.category, sum(oi.quantity * oi.unit_price) AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.created_at > now() - INTERVAL '24 hours'
GROUP BY p.category;

-- After: continuous aggregate (sub-100ms)
CREATE MATERIALIZED VIEW cagg_daily_revenue
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', o.created_at) AS bucket,
       p.category,
       sum(oi.quantity * oi.unit_price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY 1, 2;

SELECT category, sum(revenue) FROM cagg_daily_revenue
WHERE bucket > now() - INTERVAL '24 hours'
GROUP BY category;
```

### Example 12: Distributed Counter with Strong Consistency

**Context:** Global view counter for 10M pages, need accurate real-time counts

**Decision: PostgreSQL with batch updates**
```
-- Direct approach: UPDATE counter SET views = views + 1 (contention hot spot)
-- Better: batch updates

-- Design: buffer in Redis, flush to PostgreSQL every 5 seconds
-- Redis: INCR page:page_id:views (per-page counter)
-- Background job: aggregate and flush

-- PostgreSQL
CREATE TABLE page_views (
    page_id INT PRIMARY KEY,
    view_count BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Batch flush
WITH updates (page_id, delta) AS (
    VALUES
    (1, 150), (2, 83), (3, 201)
)
INSERT INTO page_views (page_id, view_count, updated_at)
SELECT page_id, delta, now() FROM updates
ON CONFLICT (page_id) DO UPDATE
SET view_count = page_views.view_count + excluded.view_count,
    updated_at = now();

-- For read: Redis first (near-real-time), then PostgreSQL
-- Accuracy: Redis + Postgres sum = consistent total
```


## P22: Quality Gates

### 22.1 Pre-Production Gates

**Gate 1: Schema Design Review**
```
Checklist:
[ ] Every table has a primary key
[ ] Data types are appropriate (not all VARCHAR, correct numeric precision)
[ ] Indexes exist for known query patterns
[ ] Foreign key columns are indexed
[ ] No EAV pattern without justification
[ ] JSONB columns have GIN indexes where queried
[ ] CHECK constraints for domain validation
[ ] NOT NULL constraints on required columns
[ ] Soft-delete has partial unique index
[ ] NO gaps in sequence, no wraparound risk
```

**Gate 2: Migration Safety**
```
Checklist:
[ ] Migration is reversible (has down migration)
[ ] Migration is backward compatible (old + new schema)
[ ] Zero-downtime (Expand-Migrate-Contract verified)
[ ] Add column is NULLABLE first
[ ] Add FK uses NOT VALID + VALIDATE
[ ] Create index CONCURRENTLY
[ ] Drop column has dual-write phase completed
[ ] Data migration tested with production-sized data
[ ] Rollback plan documented
[ ] No application code dependency in migration
```

**Gate 3: Query Performance**
```
Checklist:
[ ] No full table scans on tables > 10K rows
[ ] EXPLAIN ANALYZE shows Index Scan, not Seq Scan
[ ] Row estimates match actual rows (within 2x)
[ ] No implicit type conversions
[ ] No SELECT * in production queries
[ ] JOIN columns have indexes
[ ] WHERE clause is sargable
[ ] Subquery plan is efficient (not nested loop on large tables)
[ ] LIMIT/OFFSET has ORDER BY on indexed column
[ ] Prepared statements used for repeated queries
```

### 22.2 Production Gates

**Gate 4: Performance Baselines**
```
Checklist:
[ ] Query response time baselines recorded (p50, p95, p99)
[ ] Throughput baselines (TPS, QPS)
[ ] Cache hit ratio baselines (>95%)
[ ] Connection pool utilization baseline (<80%)
[ ] Replication lag baseline (<1s)
[ ] Backup duration baseline
[ ] Storage growth rate baseline (GB/week)
```

**Gate 5: Monitoring & Alerting**
```
Checklist:
[ ] Slow query log enabled with thresholds
[ ] Connection count alert (>80% of max)
[ ] Replication lag alert (>10s)
[ ] Replication status alert (IO/SQL threads stopped)
[ ] Disk space alert (<20% free)
[ ] Cache hit ratio alert (<90%)
[ ] Backup failure alert
[ ] Long-running transaction alert (>5 minutes)
[ ] Deadlock detection configured
[ ] CPU > 80%, memory > 85% alerting
```

### 22.3 Operational Gates

**Gate 6: Backup Validation**
```
Checklist:
[ ] Full backup completes within maintenance window
[ ] Backup restore tested weekly (critical) or monthly (standard)
[ ] PITR tested quarterly
[ ] Backup file checksum validated
[ ] DR test executed quarterly
[ ] RTO met in last 3 tests
[ ] RPO met in last 3 tests
[ ] Off-site backup copy exists
```

**Gate 7: Security Hardening**
```
Checklist:
[ ] Encryption in transit (SSL/TLS) enforced
[ ] Encryption at rest (TDE or disk-level)
[ ] Minimum privilege principle for DB users
[ ] RLS configured for multi-tenant schemas
[ ] Audit logging enabled
[ ] Connection limits per user
[ ] Default passwords changed
[ ] Unused extensions/database features disabled
[ ] Public schema access restricted
[ ] SQL injection prevention (parameterized queries)
```

**Gate 8: Capacity Planning**
```
Checklist:
[ ] Storage growth projected for next 12 months
[ ] CPU utilization growth projected
[ ] Memory saturation forecast
[ ] Connection growth forecast
[ ] Backup storage growth projected
[ ] Performance regression testing integrated in CI
[ ] Load testing results available for peak traffic
[ ] Scaling runbook exists and tested
```

### 22.4 Continuous Improvement

**Gate 9: Index Maintenance**
```
Checklist:
[ ] Unused indexes identified and dropped (monthly)
[ ] Index bloat checked and rebuilt (quarterly)
[ ] Missing indexes identified from execution plans (weekly)
[ ] Duplicate indexes consolidated
[ ] Statistics updated on tables with >10% data change
```

**Gate 10: Schema Governance**
```
Checklist:
[ ] Schema version controlled
[ ] All schema changes go through migration process
[ ] No direct DDL on production database
[ ] ERD/documentation updated with schema changes
[ ] Data dictionary maintained (column descriptions, domains)
[ ] Deprecated schema elements tracked with removal timeline
```


*END OF SKILL.md - Database Architect Skill Pack*
