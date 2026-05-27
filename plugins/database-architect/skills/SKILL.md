---
title: Database Architect Skill Pack
description: Comprehensive database architecture, design, modeling, optimization, and operations knowledge base
author: Synarc Database Architect Plugin
version: 4.0.0
created: 2026-05-27
updated: 2026-05-27
coverage: database-selection, relational-design, nosql-design, indexing, query-optimization, data-modeling, migrations, sharding, replication, ha-dr, backup-recovery, concurrency, caching, security, monitoring, connection-management, archival, database-testing
line_count: 10000+
---

# Database Architect Skill Pack

> **Persona:** You are a database architect responsible for all data-related decisions across the organization. You own the logical and physical data models, storage engine selection, indexing strategy, query performance, schema migrations, data distribution, high availability, disaster recovery, and data governance. You do NOT build application caches, write backend APIs, deploy infrastructure, set security policies, or build data pipelines. You design and operate the database layer such that application teams, platform engineers, security engineers, and data engineers can build on a solid foundation.

---

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

## P1: Persona & Scope

### 1.1 Role Definition

The Database Architect owns the data layer end-to-end. This includes:

**In Scope:**
- Database engine selection and version lifecycle
- Logical data modeling (conceptual, logical, physical)
- Physical storage design (tablespaces, filegroups, storage layout)
- Index design and maintenance
- Query optimization and execution plan analysis
- Schema migration strategy and tooling
- Data distribution (sharding, partitioning, federation)
- Replication topology design
- High availability and disaster recovery architecture
- Backup and recovery strategy and validation
- Concurrency and isolation configuration
- Database-level caching strategy
- Performance monitoring and observability
- Connection pooling and routing
- Data archival and lifecycle management
- Database testing strategy

**Out of Scope:**
- Application-level caching
- Backend API design and implementation
- Infrastructure deployment (containers, orchestration, networking)
- Organization-level security policies and compliance frameworks
- Data pipeline construction (ETL/ELT tooling)
- Application code reviews

### 1.2 Decision Framework

Every database decision follows this hierarchy:

```
Business Requirements
  -> Data Characteristics (volume, velocity, variety, veracity)
    -> Access Patterns (read vs write heavy, point vs range, OLTP vs OLAP)
      -> Consistency Requirements (strong vs eventual, isolation level)
        -> Durability Requirements (sync vs async commit)
          -> Availability Requirements (RTO, RPO, SLA)
            -> Operational Maturity (team skill, automation level)
              -> Cost Constraints (licensing, hardware, cloud)
```

### 1.3 Key Metrics Database Architects Track

| Metric | Target Range | Critical Threshold |
|--------|-------------|-------------------|
| Query response time (p50) | <10ms | >100ms |
| Query response time (p99) | <50ms | >500ms |
| Transactions per second | Depends on workload | Saturation at 80% CPU |
| Connection utilization | <80% of max | >90% |
| Cache hit ratio | >95% | <90% |
| Replication lag | <1s | >10s (alert) |
| Backup window | Within maintenance window | Exceeds window |
| Storage growth rate | Predictable monthly | Exponential |
| Index fragmentation | <30% | >50% |

### 1.4 Essential Tools

**Modeling:** dbdiagram.io, draw.io, Lucidchart, DataGrip, DBeaver ERD
**Migration:** Flyway, Liquibase, Sqitch, Alembic, Golang Migrate, Prisma Migrate
**Query Analysis:** EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON), pg_stat_statements, MySQL slow log, SQL Server Query Store, Oracle AWR/Statspack
**Monitoring:** pg_stat_*, MySQL performance_schema, AWS RDS Performance Insights, Datadog, Grafana
**Profiling:** EXPLAIN ANALYZE, TRACE, SET STATISTICS PROFILE ON, DBCC SHOW_STATISTICS
**Load Testing:** pgbench, sysbench, HammerDB, gh-ost (for no-downtime schema changes)

### 1.5 Communication Patterns

- **To Application Teams:** "This index will speed up your dashboard query by 200x, but adds 5% write overhead."
- **To Platform Engineers:** "We need connection pooling at the proxy layer with read/write splitting."
- **To Security Engineers:** "RLS policies are defined at the schema level; encryption at rest uses TDE with HSM-backed keys."
- **To Management:** "We have a 4-hour RPO with point-in-time recovery. To get 1-hour RTO we need automated failover testing."

---

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

---

## P3: Relational Design

### 3.1 Normalization Theory

**1NF (First Normal Form):**
- Each cell contains a single atomic value
- Each row is unique (has a primary key)
- No repeating groups
- Violation: comma-separated values in a column
- Fix: create child table, use junction table for many-to-many

**2NF (Second Normal Form):**
- Must be in 1NF
- Every non-key attribute must be fully functionally dependent on the entire primary key
- Only relevant for composite primary keys
- Violation: table with (OrderID, ProductID) as PK but storing ProductName
- Fix: move ProductName to Product table

**3NF (Third Normal Form):**
- Must be in 2NF
- No transitive functional dependency
- Violation: EmployeeID, DepartmentID, DepartmentName
- Fix: move DepartmentName to Department table

**BCNF (Boyce-Codd Normal Form):**
- Must be in 3NF
- Every determinant must be a candidate key
- Violation: (Student, Subject, Professor) where Professor teaches one Subject
- Fix: split into (Student, Professor) and (Professor, Subject)

**4NF (Fourth Normal Form):**
- Must be in BCNF
- No multi-valued dependencies
- Violation: (EmployeeID, Skill, Language) both independent MVDs
- Fix: separate tables (EmployeeID, Skill) and (EmployeeID, Language)

**5NF (Fifth Normal Form / Join-Projection Normal Form):**
- Must be in 4NF
- Cannot be decomposed into any smaller tables without losing information
- Practical relevance: rare, mostly theoretical

**6NF (Sixth Normal Form):**
- Each non-key attribute gets its own table
- Useful for temporal databases
- Practical relevance: data warehouses with slowly changing dimensions

### 3.2 Denormalization Patterns

**Pattern 1: Pre-joined Summaries**
```
CREATE TABLE order_summary (
    order_id BIGINT PRIMARY KEY,
    customer_name TEXT,
    order_total DECIMAL(12,2),
    item_count INT,
    status TEXT,
    created_at TIMESTAMP
);
```
- When: Read-heavy workload, dashboard queries, reporting
- Cost: Write amplification
- Mitigation: Materialized views or triggers

**Pattern 2: Embedded Repeated Values**
```
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    items JSONB,
    total DECIMAL(12,2)
);
```
- When: Children always accessed with parent, bounded in size
- Cost: Cannot query individual items efficiently
- Mitigation: GIN indexes on JSONB

**Pattern 3: Computed Columns**
```
ALTER TABLE orders ADD COLUMN total_cost DECIMAL(12,2)
    GENERATED ALWAYS AS (quantity * unit_price) STORED;
CREATE INDEX idx_total_cost ON orders(total_cost);
```
- When: Frequent filtering or sorting on computed values
- Cost: Slight write overhead

**Pattern 4: Hierarchical Denormalization**
```
CREATE TABLE category_paths (
    ancestor_id INT,
    descendant_id INT,
    depth INT,
    PRIMARY KEY (ancestor_id, descendant_id)
);
```
- When: Tree structures with frequent subtree queries
- Alternatives: nested sets, materialized path, adjacency list with rCTE

### 3.3 Schema Design Patterns

**Pattern 1: Single Table Inheritance**
```
CREATE TABLE assets (
    id UUID PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('document', 'image', 'video')),
    shared_attrs JSONB
);
```

**Pattern 2: Class Table Inheritance**
```
CREATE TABLE assets (id UUID PRIMARY KEY, created_at TIMESTAMP);
CREATE TABLE documents (id UUID PRIMARY KEY REFERENCES assets(id), content TEXT);
CREATE TABLE images (id UUID PRIMARY KEY REFERENCES assets(id), width INT, height INT);
```

**Pattern 3: Concrete Table Inheritance**
Each subtype has own table with all columns.
Pros: No joins. Cons: Duplicated columns.

**Pattern 4: EAV (Entity-Attribute-Value)**
```
CREATE TABLE entity_attributes (
    entity_id UUID, attribute TEXT, value TEXT,
    PRIMARY KEY (entity_id, attribute)
);
```
- When: Extremely dynamic schemas, sparse data
- Cons: Query complexity, type casting, no referential integrity
- Never use EAV unless absolutely necessary

**Pattern 5: Soft Deletion**
```
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;
CREATE INDEX idx_users_active ON users(deleted_at) WHERE deleted_at IS NULL;
```
- Cons: Query complexity, unique constraint complications
- Better: Separate archive table

**Pattern 6: Temporal/Custom Audit**
```
CREATE TABLE users_history (LIKE users);
CREATE FUNCTION users_audit() RETURNS TRIGGER AS $$
BEGIN INSERT INTO users_history SELECT OLD.*; RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_users_audit AFTER UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION users_audit();
```

**Pattern 7: System-Versioned Temporal Tables**
```
CREATE TABLE users (
    id INT PRIMARY KEY, name TEXT, email TEXT,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_to TIMESTAMPTZ DEFAULT 'infinity'
);
CREATE TABLE users_history (LIKE users);
```

### 3.4 Constraints

```
-- PRIMARY KEY
ALTER TABLE orders ADD PRIMARY KEY (id);

-- UNIQUE
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
CREATE UNIQUE INDEX uq_users_email_active ON users(email) WHERE deleted_at IS NULL;

-- FOREIGN KEY
ALTER TABLE order_items ADD CONSTRAINT fk_order FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- CHECK
ALTER TABLE orders ADD CONSTRAINT ck_positive_total CHECK (total >= 0);

-- EXCLUSION (PostgreSQL)
CREATE EXTENSION btree_gist;
CREATE TABLE reservations (
    room_id INT, during TSTZRANGE,
    EXCLUDE USING GIST (room_id WITH =, during WITH &&)
);
```

**Constraint Design Principles:**
- Every table must have a primary key
- Use natural keys when stable and immutable
- Use surrogate keys when natural keys are mutable or large
- Foreign keys should be indexed, especially on the referencing side
- Avoid too many FKs on OLTP tables
- Use partial unique indexes for soft-delete
- Use deferrable constraints for complex workflows
- NOT NULL is the cheapest constraint

### 3.5 Triggers

**Use Cases:**
- Audit logging
- Denormalized column maintenance
- Data validation (complex cross-table)
- Derived data computation
- Complex business rules

**Anti-Patterns:**
- Chain triggers
- Non-deterministic functions in triggers
- Complex business logic in triggers
- Triggers on high-throughput tables without benchmarking

### 3.6 Views

**Simple Views:**
```
CREATE VIEW active_customers AS
SELECT id, name, email FROM customers WHERE deleted_at IS NULL;
```

**Complex Views:**
```
CREATE VIEW monthly_sales AS
SELECT date_trunc('month', o.created_at) AS month, c.region,
       sum(oi.quantity * oi.unit_price) AS revenue,
       count(DISTINCT o.id) AS order_count
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY 1, 2;
```

**Security Views:**
```
CREATE VIEW employee_safe AS
SELECT id, name, department_id, hire_date FROM employees;
GRANT SELECT ON employee_safe TO frontend_role;
```

**WITH CHECK OPTION:**
```
CREATE VIEW recent_orders AS
SELECT * FROM orders WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
WITH CHECK OPTION;
```

### 3.7 Materialized Views

```
-- PostgreSQL
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT date_trunc('day', created_at) AS day, product_id,
       sum(quantity) AS units_sold, sum(total) AS revenue
FROM orders GROUP BY 1, 2 WITH DATA;

CREATE UNIQUE INDEX idx_mv_daily_sales ON mv_daily_sales(day, product_id);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;

-- TimescaleDB Continuous Aggregate
CREATE MATERIALIZED VIEW cagg_daily
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', created_at) AS day, device_id, avg(temperature)
FROM sensor_data GROUP BY 1, 2;
```

### 3.8 Stored Procedures & Functions

```
CREATE OR REPLACE FUNCTION place_order(
    p_customer_id INT, p_items JSONB, p_shipping_address TEXT
) RETURNS BIGINT AS $$
DECLARE
    v_order_id BIGINT; v_total DECIMAL(12,2) := 0;
BEGIN
    INSERT INTO orders (customer_id, shipping_address, status)
    VALUES (p_customer_id, p_shipping_address, 'pending')
    RETURNING id INTO v_order_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    SELECT v_order_id, (item->>'product_id')::INT, (item->>'quantity')::INT,
           (item->>'unit_price')::DECIMAL
    FROM jsonb_array_elements(p_items) AS item;
    UPDATE orders SET total = (SELECT sum(quantity * unit_price)
        FROM order_items WHERE order_id = v_order_id) WHERE id = v_order_id;
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

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

---

## P5: Indexing Strategy

### 5.1 Index Types

| Type | Best For | Why |
|------|----------|-----|
| B-Tree | Equality + range, sort, join | Balanced tree, O(log n) |
| Hash | Equality lookups only | O(1) lookup |
| GiST | Geometry, full-text, range | Extensible operators |
| GIN | Array/JSONB, full-text | Inverted index |
| BRIN | Large append-only tables | Block-level summaries, tiny |
| Covering | Index-only scan | Avoids heap access |
| Partial | Queries on subset | Smaller index |
| Functional | Function on column | Pre-computed result |
| Full-Text | Text search | tsvector + stemming |
| Vector | Similarity search | IVFFlat, HNSW |
| Bitmap | Low-cardinality in DW | Compressed bitmap |
| Spatial | GIS queries | R-tree via GiST |
| Composite | Multi-column filters | Leftmost prefix rule |

### 5.2 B-Tree Index Deep Dive

```
-- Standard
CREATE INDEX idx_users_email ON users(email);

-- Composite
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);

-- Include extra columns for index-only scans
CREATE INDEX idx_orders_customer ON orders(customer_id) INCLUDE (total, status);

-- ASC/DESC/NULLS
CREATE INDEX idx_inventory_stock ON inventory(quantity ASC NULLS LAST);
```

**Statistics & Maintenance:**
```
ANALYZE orders;
ALTER TABLE orders ALTER COLUMN customer_id SET STATISTICS 1000;
REINDEX INDEX CONCURRENTLY idx_orders_customer_created;
```

### 5.3 GIN Index

```
-- Full-text search
CREATE INDEX idx_articles_fts ON articles USING GIN(to_tsvector('english', title || ' ' || body));

-- JSONB
CREATE INDEX idx_products_attrs ON products USING GIN(attributes jsonb_path_ops);

-- Trigram similarity
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_users_name_trgm ON users USING GIN(name gin_trgm_ops);
```

### 5.4 GiST Index

```
-- Geometry
CREATE INDEX idx_locations ON places USING GIST(location);

-- Range types
CREATE INDEX idx_ranges ON reservations USING GIST(during);

-- pgvector
CREATE INDEX idx_vectors ON items USING GIST(embedding vector_l2_ops);
```

### 5.5 BRIN Index

```
-- Standard
CREATE INDEX idx_events_created_brin ON events USING BRIN(created_at);

-- Tuned pages_per_range
CREATE INDEX idx_events_created_brin ON events USING BRIN(created_at)
WITH (pages_per_range = 32);
```

**BRIN vs B-Tree:**
- BRIN size: ~0.1% of table size
- BRIN maintenance: low
- BRIN query speed: slower for random, fast for range
- BRIN build time: seconds vs hours on large tables

### 5.6 Composite Index Strategy

**Leftmost Prefix Rule:**
```
Index: CREATE INDEX idx ON t(a, b, c);
Uses index: WHERE a=1, WHERE a=1 AND b=2, WHERE a=1 AND b=2 AND c=3
Does NOT use: WHERE b=2, WHERE c=3
```

**Column Order Strategy:**
1. Equality conditions first
2. Range conditions second
3. ORDER BY columns
4. INCLUDE columns

### 5.7 Functional Indexes

```
-- Case-insensitive search
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = LOWER('Alice@Example.Com');

-- Date truncation
CREATE INDEX idx_orders_month ON orders(date_trunc('month', created_at));

-- Expression index
CREATE INDEX idx_orders_total ON orders((quantity * unit_price));

-- JSONB expression index (PG12+)
CREATE INDEX idx_orders_currency ON orders(((details->>'currency')::TEXT));
```

### 5.8 Full-Text Search Indexes

```
-- PostgreSQL
ALTER TABLE articles ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))) STORED;
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, plainto_tsquery('english', 'database design') AS query
WHERE search_vector @@ query
ORDER BY rank DESC LIMIT 20;

-- MySQL
CREATE FULLTEXT INDEX idx_articles_fts ON articles(title, body);
SELECT *, MATCH(title, body) AGAINST('database design' IN NATURAL LANGUAGE MODE) AS relevance
FROM articles WHERE MATCH(title, body) AGAINST('database design')
ORDER BY relevance DESC;
```

### 5.9 Vector Indexes (pgvector)

```
CREATE EXTENSION vector;
CREATE TABLE items (
    id BIGINT PRIMARY KEY, embedding vector(1536)
);

-- IVFFlat
CREATE INDEX idx_items_ivfflat ON items
    USING IVFFLAT (embedding vector_cosine_ops) WITH (lists = 100);

-- HNSW (pgvector 0.5+)
CREATE INDEX idx_items_hnsw ON items
    USING HNSW (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Query: cosine similarity
SELECT id, 1 - (embedding <=> $1::vector) AS similarity
FROM items ORDER BY embedding <=> $1::vector LIMIT 10;
```

### 5.10 Index Maintenance

```
-- PostgreSQL
REINDEX INDEX CONCURRENTLY idx_orders_customer;
REINDEX TABLE CONCURRENTLY orders;

-- Monitor index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes ORDER BY idx_scan ASC;

-- MySQL
ALTER TABLE orders DROP INDEX idx_old, ADD INDEX idx_new(customer_id, created_at),
    ALGORITHM=INPLACE, LOCK=NONE;
ANALYZE TABLE orders;
ALTER TABLE orders ENGINE=InnoDB;  -- defragment
```

### 5.11 Index Anti-Patterns

| Anti-Pattern | Why Bad | Fix |
|-------------|---------|-----|
| Over-indexing | Slows writes, increases storage | Keep ratio < 5:1 for OLTP |
| Unused indexes | Wasted space and write overhead | Drop with zero scans |
| Low-cardinality index | B-Tree on gender rarely used | Skip or use BRIN |
| No FK indexes | Cascading JOINs do full scan | Index foreign keys |
| Function on indexed col | WHERE UPPER(name) ignores index | Use functional index |
| Indexing everything | Death by a thousand cuts | Add for known patterns only |
| Not monitoring bloat | Degraded performance | Schedule REINDEX |
| Large composite no leftmost | Index built but never used | Match column order to queries |

---

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

---

## P7: Data Modeling

### 7.1 Conceptual, Logical, Physical

**Conceptual:** Entities, relationships, business rules. No attributes or keys.
**Logical:** Tables, columns, relationships, keys. Normalized to 3NF.
**Physical:** Specific data types, indexes, storage, constraints.

### 7.2 Star Schema

```
CREATE TABLE fact_sales (
    date_key INT REFERENCES dim_date(date_key),
    product_key INT REFERENCES dim_product(product_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    quantity INT NOT NULL, unit_price DECIMAL(10,2),
    total_amount DECIMAL(12,2) NOT NULL
);

CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,
    customer_id INT, name TEXT, email TEXT,
    city TEXT, state TEXT, country TEXT,
    segment TEXT, valid_from DATE, valid_to DATE, is_current BOOLEAN
);
```

**Characteristics:**
- Central fact with numeric measures
- Surrounding dimension tables (denormalized)
- Every dimension has surrogate key
- No direct dimension-to-dimension relationships

### 7.3 Snowflake Schema

```
CREATE TABLE dim_country (country_key INT PRIMARY KEY, country_code CHAR(2), country_name TEXT);
CREATE TABLE dim_state (state_key INT PRIMARY KEY, state_code CHAR(2), state_name TEXT, country_key INT REFERENCES dim_country);
CREATE TABLE dim_city (city_key INT PRIMARY KEY, city_name TEXT, state_key INT REFERENCES dim_state);
CREATE TABLE dim_customer (customer_key INT PRIMARY KEY, name TEXT, city_key INT REFERENCES dim_city);
```

**Star vs Snowflake:**
| Aspect | Star | Snowflake |
|--------|------|-----------|
| Normalization | Denormalized | Normalized |
| Query complexity | Simple (few joins) | More joins |
| Storage | More | Less |
| ETL complexity | Simpler | More complex |
| Performance | Faster | Slower |

### 7.4 Data Vault 2.0

**Components: Hub, Link, Satellite**

```
-- HUB: Business keys
CREATE TABLE hub_customer (
    customer_hash CHAR(32) PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    load_date TIMESTAMP NOT NULL, record_source TEXT NOT NULL
);

CREATE TABLE hub_order (
    order_hash CHAR(32) PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    load_date TIMESTAMP NOT NULL, record_source TEXT NOT NULL
);

-- LINK: Relationships
CREATE TABLE link_order_customer (
    link_hash CHAR(32) PRIMARY KEY,
    order_hash CHAR(32) REFERENCES hub_order(order_hash),
    customer_hash CHAR(32) REFERENCES hub_customer(customer_hash),
    load_date TIMESTAMP NOT NULL, record_source TEXT NOT NULL
);

-- SATELLITE: Descriptive attributes
CREATE TABLE sat_customer_detail (
    customer_hash CHAR(32) REFERENCES hub_customer(customer_hash),
    load_date TIMESTAMP NOT NULL, name TEXT, email TEXT,
    effective_from TIMESTAMP, effective_to TIMESTAMP,
    record_source TEXT NOT NULL,
    PRIMARY KEY (customer_hash, load_date)
);
```

**Principles:**
- All relationships are many-to-many (links)
- All data is temporal (satellites)
- No updates, only inserts (append-only)
- Raw vault stays close to source
- Business vault adds derived data
- Information mart presents star schemas on top

### 7.5 One Big Table (OBT)

```
CREATE TABLE sales_obt (
    order_date DATE, customer_name TEXT, customer_segment TEXT,
    product_name TEXT, product_category TEXT, product_price DECIMAL,
    quantity INT, total DECIMAL, store_name TEXT, store_region TEXT
);
```

| Pro | Con |
|-----|-----|
| Zero joins | Massive table width |
| Fastest query | Redundant data |
| Easy for BI | ETL failures affect everything |
| Simple | No referential integrity |

### 7.6 Slowly Changing Dimensions (SCD)

**Type 0:** Retain original - never change
**Type 1:** Overwrite - no history
**Type 2:** Add new row - full history
**Type 3:** Add new attribute - previous value
**Type 4:** Mini-dimension - rapidly changing
**Type 5:** Type 4 with bridge
**Type 6:** Hybrid (1+2+3) - current, history, original
**Type 7:** Dual Type 1 and Type 2

```
-- Type 2 example
UPDATE dim_customer SET valid_to = '2024-06-01', is_current = FALSE
WHERE customer_key = 123;
INSERT INTO dim_customer (customer_key, customer_id, name, email, city, valid_from, valid_to, is_current)
VALUES (nextval('dim_customer_seq'), 456, 'Alice', 'new@email.com', 'NYC', '2024-06-01', '9999-12-31', TRUE);
```

**Type 6 (Hybrid):**
```
CREATE TABLE dim_customer_scd6 (
    customer_key INT PRIMARY KEY, customer_id INT, name TEXT,
    email_historical TEXT, email_current TEXT, original_email TEXT,
    valid_from DATE, valid_to DATE, is_current BOOLEAN
);
```

### 7.7 Temporal Tables

**SQL Server:**
```
CREATE TABLE employees (
    id INT PRIMARY KEY, name VARCHAR(100), position VARCHAR(50),
    salary DECIMAL(10,2),
    valid_from DATETIME2 GENERATED ALWAYS AS ROW START,
    valid_to DATETIME2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (valid_from, valid_to)
) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.employees_history));

SELECT * FROM employees
FOR SYSTEM_TIME AS OF '2024-01-01T00:00:00' WHERE id = 123;
```

### 7.8 Graph Modeling Patterns

**Adjacency List:**
```
CREATE TABLE employees (id INT PRIMARY KEY, name TEXT, manager_id INT REFERENCES employees(id));
```

**Nested Sets:**
```
CREATE TABLE categories (id INT PRIMARY KEY, name TEXT, lft INT NOT NULL, rgt INT NOT NULL);
```

**Materialized Path:**
```
CREATE TABLE comments (id INT PRIMARY KEY, content TEXT, path TEXT);
```

**Closure Table:**
```
CREATE TABLE category_closure (
    ancestor_id INT, descendant_id INT, depth INT,
    PRIMARY KEY (ancestor_id, descendant_id)
);
```

---

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

---

## P9: Sharding & Partitioning

### 9.1 Partitioning

**Range:**
```
CREATE TABLE orders (id BIGINT, customer_id INT, total DECIMAL(12,2), created_at TIMESTAMP NOT NULL)
PARTITION BY RANGE (created_at);
CREATE TABLE orders_2024_q1 PARTITION OF orders FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
CREATE TABLE orders_2024_q2 PARTITION OF orders FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
```

**List:**
```
CREATE TABLE customers (id BIGINT, name TEXT, region TEXT NOT NULL)
PARTITION BY LIST (region);
CREATE TABLE customers_na PARTITION OF customers FOR VALUES IN ('US', 'CA', 'MX');
CREATE TABLE customers_eu PARTITION OF customers FOR VALUES IN ('UK', 'DE', 'FR');
```

**Hash:**
```
CREATE TABLE sessions (id BIGINT, session_id UUID NOT NULL, data JSONB)
PARTITION BY HASH (session_id);
CREATE TABLE sessions_0 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE sessions_1 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 1);
```

**MySQL:**
```
CREATE TABLE orders (id BIGINT NOT NULL, created_at DATE NOT NULL, total DECIMAL(12,2))
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### 9.2 Partition Pruning

```
EXPLAIN SELECT * FROM orders WHERE created_at >= '2024-04-01' AND created_at < '2024-07-01';
-- Only scans orders_2024_q2

SET enable_partition_pruning = on;
SET enable_partitionwise_join = on;  -- PG12+
SET enable_partitionwise_aggregate = on;
```

### 9.3 Partition Maintenance

```
-- Detach for archival
ALTER TABLE orders DETACH PARTITION orders_2022_01;
ALTER TABLE orders_2022_01 SET TABLESPACE archive_tbs;

-- Attach new
CREATE TABLE orders_2024_q3 (LIKE orders INCLUDING INDEXES);
ALTER TABLE orders ATTACH PARTITION orders_2024_q3
    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');

-- Automated (pg_partman)
SELECT partman.create_parent('public.orders', 'created_at', 'native', 'monthly');
SELECT partman.run_maintenance();
```

### 9.4 Sharding

**Shard Key Criteria:**
1. High cardinality
2. Even distribution
3. Aligned with access patterns
4. Immutable
5. Supports common queries

**Citus:**
```
SELECT create_distributed_table('orders', 'customer_id');
SELECT create_reference_table('products');
SELECT create_distributed_table('customers', 'customer_id');
SELECT create_distributed_table('orders', 'customer_id', colocate_with => 'customers');
```

### 9.5 Cross-Shard Queries

| Type | Description |
|------|-------------|
| Single shard | WHERE includes shard key - fast |
| Fan-out | No shard key - queries all shards |
| Distributed TX | 2PC, Saga pattern |
| Cross-shard JOIN | Expensive - use co-location |

### 9.6 Rebalancing

- Virtual shards: map shard -> node, reassign to balance
- Consistent hashing: minimal redistribution (Cassandra, Redis)
- Range rebalancing: split hot ranges (MongoDB, Citus)

### 9.7 Partition vs Shard

| Factor | Partition | Shard |
|--------|-----------|-------|
| Data size | <10TB | >10TB |
| Write throughput | Moderate | Very high |
| Cross queries | Simple | Complex |
| Transactions | Yes | Limited |
| Administration | Simple | Complex |
| Geo-distribution | No | Yes |

---

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

---

## P11: HA & Disaster Recovery

### 11.1 RTO/RPO

| Term | Definition |
|------|-----------|
| RTO | Recovery Time Objective - time to restore service |
| RPO | Recovery Point Objective - max data loss |
| MTTR | Mean Time To Recovery |
| MTBF | Mean Time Between Failures |
| SLA | Service Level Agreement |

### 11.2 HA Patterns

**Cold Standby:**
- Manual failover: restore backup, start DB, redirect traffic
- RTO: hours, RPO: last backup
- Pros: Simple, cheap. Cons: Hours of downtime.

**Warm Standby (WAL Shipping):**
- Continuous log shipping, standby in recovery
- Failover: promote standby
- RTO: minutes, RPO: last shipped WAL
- Pros: Better RTO/RPO. Cons: Standby cannot serve reads.

**Hot Standby (Streaming Replication):**
- Real-time WAL streaming, standby accepts reads
- Failover: auto-detect + promote
- RTO: seconds-minutes, RPO: seconds (async) or 0 (sync)
- Pros: Low RTO/RPO, standby serves reads.

**Multi-Region Active-Passive:**
- Primary region active, secondary has replica
- Failover: promote replica, update DNS
- RTO: minutes, RPO: seconds
- Pros: Survives region failure. Cons: Cost.

**Multi-Region Active-Active:**
- All regions accept writes, bidirectional replication
- No failover needed
- RTO: seconds, RPO: varies
- Pros: No downtime, low latency. Cons: Complexity, cost.

### 11.3 Failover Automation

**Patroni (PostgreSQL):**
- etcd/Consul/ZooKeeper for leader election
- Auto-failover with configurable TTL
- Automatic replica promotion and reconfiguration

```
patroni:
  scope: myapp
  name: pg1
  restapi: { listen: 0.0.0.0:8008 }
  etcd: { host: etcd1:2379 }
  bootstrap:
    dcs:
      ttl: 30
      loop_wait: 10
      maximum_lag_on_failover: 1048576
```

**Orchestrator (MySQL):**
- Topology detection and management
- Auto-failover with best replica promotion
- Hooks for notifications and DNS updates

**SQL Server Always On:**
- Windows Server Failover Cluster (WSFC)
- Availability Group with up to 8 secondaries
- Synchronous commit for zero data loss
- Automatic failover with cluster quorum

### 11.4 Health Checks

| Level | Check |
|-------|-------|
| 1 | Process is running (pg_isready, SELECT 1) |
| 2 | Database accepts connections |
| 3 | Replication healthy (lag < threshold) |
| 4 | Query performance acceptable |
| 5 | Full stack business transaction |

### 11.5 Split-Brain Prevention

- STONITH: power off failed node (IPMI, iDRAC)
- Quorum: majority must agree on leader (Raft)
- Lease-based: primary holds time-limited lease

### 11.6 DR Tiers

| Tier | RTO | RPO | Cost | Description |
|------|-----|-----|------|-------------|
| 0 | Minutes | Near zero | Very high | Active-active multi-region |
| 1 | Minutes | Seconds | High | Active-passive, sync replication |
| 2 | Hours | Minutes | Medium | Warm standby, WAL shipping |
| 3 | Hours | Hours | Low | Cold standby, daily backups |
| 4 | Days | Days | Very low | Backup only |

---

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

---

## P13: Concurrency Control

### 13.1 MVCC

**How MVCC Works:**
- Every transaction sees a snapshot as of a point in time
- Writes create new row versions; old versions remain for readers
- Readers do not block writers

**PostgreSQL MVCC:**
```
-- Hidden columns: xmin, xmax, ctid
-- xmin: creating transaction ID
-- xmax: deleting/updating transaction ID

-- VACUUM removes dead versions
VACUUM VERBOSE orders;
VACUUM ANALYZE orders;

-- Autovacuum config
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 60
autovacuum_vacuum_scale_factor = 0.2
```

### 13.2 Isolation Levels

**ANSI SQL Isolation Levels:**

| Level | Dirty Read | Non-repeatable Read | Phantom Read | Serialization Anomaly |
|-------|-----------|---------------------|--------------|----------------------|
| READ UNCOMMITTED | Possible | Possible | Possible | Possible |
| READ COMMITTED | Prevented | Possible | Possible | Possible |
| REPEATABLE READ | Prevented | Prevented | Possible | Possible |
| SERIALIZABLE | Prevented | Prevented | Prevented | Prevented |

**PostgreSQL:**
```
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- No READ UNCOMMITTED (acts like READ COMMITTED)
```

**MySQL:**
```
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Default: REPEATABLE READ
```

**SQL Server:**
```
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;  -- = NOLOCK
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
```

### 13.3 Locking

**PostgreSQL:**
```
-- Row-level locks
SELECT * FROM orders WHERE id = 123 FOR UPDATE;      -- Exclusive, prevents updates/deletes
SELECT * FROM orders WHERE id = 123 FOR NO KEY UPDATE;  -- Weaker than UPDATE
SELECT * FROM orders WHERE id = 123 FOR SHARE;          -- Shared, prevents exclusive
SELECT * FROM orders WHERE id = 123 FOR KEY SHARE;      -- Weakest

-- NOWAIT and SKIP LOCKED
SELECT * FROM orders WHERE status = 'pending' FOR UPDATE SKIP LOCKED LIMIT 10;
```

**Deadlock Detection:**
```
-- PostgreSQL: deadlock_timeout (default 1s)
-- Automatically aborts one transaction on deadlock

-- View blocked queries
SELECT pid, blocked_by, query FROM pg_blocked_queries;  -- PG14+
-- Or use pg_locks:
SELECT blocked.pid, blocked.query, blocking.pid, blocking.query
FROM pg_locks blocked
JOIN pg_locks blocking ON blocked.granted = false AND blocking.granted = true;
```

**Lock Monitoring:**
```
-- Current locks
SELECT relation::regclass, mode, granted, pid, query
FROM pg_locks JOIN pg_stat_activity USING (pid)
WHERE NOT pid = pg_backend_pid();

-- Lock waits (PostgreSQL)
SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';
```

### 13.4 Optimistic Locking

```
-- Version column approach
ALTER TABLE products ADD COLUMN version INT DEFAULT 0;

-- Application code
UPDATE products SET name = 'New Name', version = version + 1
WHERE id = 123 AND version = 5;
-- If version != 5, no rows updated -> retry logic needed
```

### 13.5 Pessimistic Locking

```
-- SELECT FOR UPDATE locks row before update
BEGIN;
SELECT * FROM inventory WHERE product_id = 123 AND location = 'WH-A' FOR UPDATE;
-- Check stock
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123 AND location = 'WH-A';
COMMIT;
```

### 13.6 Deadlock Prevention

- Access tables in the same order across transactions
- Keep transactions short
- Use READ COMMITTED (lower locking vs SERIALIZABLE)
- Use NOWAIT or SKIP LOCKED
- Index FK columns to reduce lock range
- Consider optimistic locking for low-contention workloads
- Monitor deadlock_timeout (lower for faster detection)

### 13.7 Understanding Lock Escalation

- Row locks may escalate to page or table locks
- Occurs when many rows are locked in a single transaction
- SQL Server: lock_escalation config (threshold 5000 locks)
- Mitigation: use batch operations, partition tables, use READ COMMITTED SNAPSHOT

---

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

---

## P15: Database Security

### 15.1 Encryption at Rest

**Transparent Data Encryption (TDE):**
```
-- PostgreSQL: pg_tde extension, or disk-level encryption (LUKS)
-- MySQL: InnoDB tablespace encryption
ALTER TABLE orders ENCRYPTION='Y';

-- SQL Server TDE
CREATE DATABASE ENCRYPTION KEY WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE MyServerCert;
ALTER DATABASE mydb SET ENCRYPTION ON;

-- Oracle TDE
ADMINISTER KEY MANAGEMENT CREATE KEYSTORE;
ADMINISTER KEY MANAGEMENT SET KEYSTORE OPEN;
ADMINISTER KEY MANAGEMENT SET KEY;
```

**Column-Level Encryption:**
```
-- PostgreSQL (pgcrypto)
CREATE EXTENSION pgcrypto;
INSERT INTO users (ssn) VALUES (pgp_sym_encrypt('123-45-6789', 'encryption_key'));
SELECT pgp_sym_decrypt(ssn, 'encryption_key') FROM users WHERE id = 123;
```

### 15.2 Encryption in Transit

```
-- PostgreSQL
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
ssl_ca_file = 'root.crt'

-- MySQL
[mysqld]
ssl-ca = ca.pem
ssl-cert = server-cert.pem
ssl-key = server-key.pem
require_secure_transport = ON

-- Force SSL per user
ALTER USER 'app_user'@'%' REQUIRE SSL;
```

### 15.3 Row-Level Security (RLS)

```
-- PostgreSQL
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    tenant_id INT NOT NULL,
    total DECIMAL(12,2)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
    USING (tenant_id = current_setting('app.tenant_id')::INT);

-- Per-user policies
CREATE POLICY user_orders ON orders
    USING (customer_id = current_user::INT);

-- Only managers can see all; regular users see their own
CREATE POLICY manager_access ON orders
    USING (current_user IN (SELECT manager FROM user_manager_map));
```

### 15.4 Column-Level Security

```
-- PostgreSQL: column-level privileges
GRANT SELECT (id, name, email) ON users TO app_role;
-- salary column cannot be selected by app_role

-- Oracle: Virtual Private Database (VPD)
-- SQL Server: Column-level permissions
GRANT SELECT ON users(id, name, email) TO app_user;
DENY SELECT ON users(salary) TO app_user;
```

### 15.5 Audit Logging

```
-- PostgreSQL: pgaudit extension
CREATE EXTENSION pgaudit;
-- pgaudit.log = 'write,ddl,role'
-- pgaudit.log_level = 'notice'

-- MySQL: audit_log plugin
-- MySQL Enterprise Audit
INSTALL PLUGIN audit_log SONAME 'audit_log.so';

-- Custom audit table
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT, operation TEXT,
    old_data JSONB, new_data JSONB,
    changed_by TEXT, changed_at TIMESTAMP DEFAULT now()
);

-- Trigger-based audit
CREATE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log(table_name, operation, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP,
        CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        current_user);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 15.6 Connection Security

```
-- Database firewalls (pg_hba.conf, MySQL user permissions)
-- PostgreSQL pg_hba.conf
hostssl mydb app_user 10.0.0.0/8 scram-sha-256

-- MySQL user permissions
CREATE USER 'app_user'@'10.0.0.0/255.0.0.0' IDENTIFIED BY 'password' REQUIRE SSL;

-- Connection proxy (tcp_wrapper, iptables, security groups)
-- Limit connections per user
ALTER USER app_user CONNECTION LIMIT 25;
```

### 15.7 IAM for Databases

```
-- AWS RDS IAM authentication
CREATE USER iam_user WITH LOGIN;
GRANT rds_iam TO iam_user;

-- Connecting with IAM token
aws rds generate-db-auth-token \
  --hostname mydb.xxx.us-east-1.rds.amazonaws.com \
  --port 5432 --username iam_user

-- GCP Cloud SQL IAM
-- Azure AD authentication for SQL Server/PostgreSQL
```

---

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

---

## P17: Connection Management

### 17.1 Connection Pooling

**Why Pool:**
- Database connections are expensive to create (TCP handshake, SSL, auth)
- Each connection consumes memory (~2-10MB per idle connection)
- Databases have max_connections limit
- Helps absorb connection spikes without overwhelming DB

**Pooling Tools:**

**PgBouncer (PostgreSQL):**
```
[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction  -- transaction-level pooling (recommended)
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 5
```

**ProxySQL (MySQL):**
```
admin-variables=
{
    admin_credentials="admin:admin"
}

mysql_variables=
{
    threads=4
    max_connections=2048
    default_query_delay=0
    default_query_timeout=36000000
}

mysql_servers=
(
    { address="10.0.0.1", port=3306, hostgroup=0, max_connections=100 },
    { address="10.0.0.2", port=3306, hostgroup=1, max_connections=100 }
)
```

### 17.2 Max Connections Sizing

```
Formula: max_connections = (total_RAM - OS_ram - shared_buffers - other_overhead) / per_connection_memory

Example (16GB RAM PostgreSQL):
  OS: 2GB
  shared_buffers: 4GB
  Other overhead: 1GB
  Available = 9GB
  Per connection: ~2MB (idle), ~10-30MB (active)
  Safe max: 200 (if most idle) or 50-100 (if mostly active)
```

### 17.3 Connection Routing

**Read/Write Splitting:**
```
-- Application-level
# Write connections go to primary
# Read connections go to replica

-- Proxy-level (ProxySQL)
mysql_query_rules:
    - rule_id: 1
      match: "^SELECT .*"
      destination_hostgroup: 1  # replicas
    - rule_id: 2
      match: ".*"
      destination_hostgroup: 0  # primary
```

### 17.4 RDS Proxy (AWS)

```
-- Connection multiplexing for Lambda and high-churn apps
-- Reduces connection churn on RDS
-- IAM authentication integration
-- SQL injection detection

aws rds create-db-proxy \
  --db-proxy-name myproxy \
  --engine-family POSTGRESQL \
  --auth Description=mydb_auth \
  --role-arn arn:aws:iam::xxx:role/rds-proxy-role \
  --vpc-subnet-ids subnet-xxx subnet-yyy
```

### 17.5 Connection Pool Anti-Patterns

| Anti-Pattern | Why | Fix |
|-------------|-----|-----|
| Pool size too large | Overwhelms DB, contention | Start with CPU*2+disk*1 |
| No timeout on connections | Connections hang forever | Set statement_timeout, connection timeout |
| Single pool for all workloads | Read and write compete | Separate read/write pools |
| Pool starves Lambda | Lambda churn exhausts pool | Use RDS Proxy or transaction pooling |
| Not monitoring pool usage | Run out of connections | Monitor wait_queue, pool utilization |
| Connection leak | Forgot to return to pool | Use context manager, finally blocks |

---

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

---

## P19: Database Testing

### 19.1 Integration Testing

**Test Database Setup:**
```
-- Template database for fast test creation
CREATE DATABASE test_template;
-- Populate with schema and seed data
-- Create test databases quickly:
CREATE DATABASE test_123 TEMPLATE test_template;
```

**Test Isolation Strategies:**
1. Separate test database per developer
2. Test containers (Testcontainers for integration tests)
3. In-memory databases (H2, SQLite) for unit testing
4. Transaction rollback (test wraps in TX, rolls back)

```
-- PostgreSQL: savepoint-based rollback
BEGIN;
INSERT INTO setup_data ...;
SAVEPOINT test_start;
-- Run test
ROLLBACK TO SAVEPOINT test_start;
-- Clean slate for next test
ROLLBACK;
```

### 19.2 Migration Testing

```
-- Test migration forward and backward
#!/bin/bash
# 1. Create test database
createdb migration_test
# 2. Apply all migrations
migrate -path migrations -database "postgres://localhost/migration_test" up
# 3. Verify schema integrity
pg_dump --schema-only migration_test > current_schema.sql
# 4. Roll back
migrate -path migrations -database "postgres://localhost/migration_test" down -all
pg_dump --schema-only migration_test > empty_schema.sql
# 5. Verify empty
# 6. Repeat forward to verify idempotency

-- Test data preservation
-- Create test data, run migration, verify data still accessible
```

### 19.3 Performance Testing

**pgbench (PostgreSQL):**
```
-- Initialize with custom scale factor
pgbench -i -s 100 mydb

-- Run benchmark
pgbench -c 50 -j 4 -T 300 -P 5 mydb

-- Custom script
cat > benchmark.sql << EOF
\set customer_id random(1, 100000)
SELECT * FROM orders WHERE customer_id = :customer_id;
EOF
pgbench -f benchmark.sql -c 20 -T 60 -P 5 mydb
```

**sysbench (MySQL):**
```
sysbench /usr/share/sysbench/oltp_read_write.lua prepare \
  --mysql-host=127.0.0.1 --mysql-db=mydb
sysbench /usr/share/sysbench/oltp_read_write.lua run \
  --mysql-host=127.0.0.1 --mysql-db=mydb \
  --threads=32 --time=300 --report-interval=10
```

**HammerDB:**
- GUI-driven TPC-C, TPC-H benchmarks
- Supports PostgreSQL, MySQL, SQL Server, Oracle
- Standardized workload for vendor comparisons

### 19.4 Chaos Testing

**Introduction of Faults:**
- Kill database process (SIGKILL, SIGTERM)
- Network partition (block port 5432 with iptables)
- Disk full (fill disk space, 95%+ utilization)
- Connection exhaustion (open N+1 connections)
- Replication lag simulation (slower replica)
- Corrupt data page (test recovery procedures)

```
-- Chaos testing scenarios:
1. Kill primary: measure detection + failover time
2. Kill replica: verify no impact on primary writes
3. Saturate I/O: measure query degradation
4. Slow network: add latency between primary and replica
5. Certificate expiration: verify monitoring alerts
6. Backup failure: verify alerting and retry logic
```

**Validation After Chaos:**
- Data integrity (checksum, consistency check)
- Replication converged
- Application recovered (connection retry logic)
- Monitoring alerted within expected time
- No data loss (verify row counts, checksums)

---

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

---

## P21: Anti-Patterns

### 21.1 Schema & Data Model Anti-Patterns

**1. God Table (Wide Table Syndrome)**
```
-- Anti-pattern: Single table with 200+ columns
CREATE TABLE everything (
    id INT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, address TEXT,
    city TEXT, state TEXT, zip TEXT, country TEXT, latitude DECIMAL, longitude DECIMAL,
    company TEXT, title TEXT, department TEXT, manager TEXT, hire_date DATE,
    salary DECIMAL, bonus DECIMAL, commission DECIMAL, 401k_contribution DECIMAL,
    ... 180 more columns
);
-- Fix: Split into related tables by domain (user_profile, employment, compensation)
```

**2. EAV Everywhere**
```
-- Anti-pattern: Using EAV for all dynamic attributes
-- Fix: JSONB for truly dynamic, proper columns for known attributes
```

**3. Polymorphic Associations**
```
-- Anti-pattern: Single FK column referencing multiple tables
CREATE TABLE comments (
    id INT PRIMARY KEY,
    parent_type TEXT,  -- 'post', 'photo', 'video'
    parent_id INT,     -- references different tables based on parent_type
    content TEXT
);
-- Fix: separate junction tables or use PostgreSQL inheritance
```

**4. Natural Keys as PK (Mutable)**
```
-- Anti-pattern: Using email as primary key
CREATE TABLE users (email TEXT PRIMARY KEY, ...);
-- Problem: user changes email -> cascade update everywhere
-- Fix: Surrogate key (UUID or serial), email as unique column
```

**5. Not Using Surrogate Keys for Dimensions**
```
-- In star schema, using natural keys as dimension PK
-- Fix: Always use surrogate keys in dimensions (natural key as business key column)
```

### 21.2 Index Anti-Patterns

**1. Indexing Every Column**
```
-- Anti-pattern: Index on every column "just in case"
-- Fix: Only index known query patterns
```

**2. Not Covering Filter + Sort in Single Index**
```
-- Anti-pattern: Separate indexes for filter and sort
-- Fix: Composite index that covers both filter and ORDER BY
CREATE INDEX idx ON orders(customer_id, created_at DESC);
```

**3. Over-indexing High-Write Tables**
```
-- Anti-pattern: 15 indexes on a table receiving 10K writes/second
-- Each index slows INSERT by O(log n) and doubles storage
-- Fix: Keep to essential indexes, use fewer composite indexes
```

**4. Ignoring Index Size vs Memory**
```
-- Anti-pattern: Index larger than available memory
-- Every lookup requires disk I/O
-- Fix: Consider BRIN for large tables, partition before indexing
```

### 21.3 Query Anti-Patterns

**1. N+1 Query Problem**
```
-- Anti-pattern: Loading parent + one query per child
for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)
-- Fix: JOIN, batch loading, or lazy loading with eager fetch
```

**2. SELECT * in Production**
```
-- Anti-pattern: SELECT * in application code
-- Prevents index-only scans, couples to schema
-- Fix: SELECT only needed columns
```

**3. Implicit Type Conversion**
```
-- Anti-pattern: WHERE varchar_col = 123 (int)
-- Prevents index usage, causes full scan
-- Fix: Use proper type matching in queries
```

**4. Large IN Lists**
```
-- Anti-pattern: WHERE id IN (1,2,3,...,10000)
-- Long parse time, suboptimal execution plan
-- Fix: Use temp table JOIN, batch processing
```

**5. OR Conditions on Different Columns**
```
-- Anti-pattern: WHERE status = 'active' OR customer_id = 123
-- Rarely uses indexes optimally
-- Fix: UNION if each branch has index, or reconsider query
```

### 21.4 Migration Anti-Patterns

**1. Big Bang Migrations**
```
-- Anti-pattern: Writing entire schema from scratch
-- Fix: Atomic, incremental, reversible changes
```

**2. Migration with Application Logic**
```
-- Anti-pattern: Migration depends on app code (Rails callbacks)
-- Fix: SQL-only migrations, no model dependencies
```

**3. Running Migrations at Deploy Time (Blocking)**
```
-- Anti-pattern: ALTER TABLE ADD COLUMN at deploy (locks table)
-- Fix: Run migrations before deploy, use NOT VALID + CONCURRENTLY
```

**4. Not Downgrading Test Data**
```
-- Anti-pattern: Migration works forward but data loss on rollback
-- Fix: Always write reversible migrations with data preservation
```

### 21.5 Caching Anti-Patterns

**1. Cache Penetration (Querying Non-Existent Keys)**
```
-- Anti-pattern: High-volume queries for keys that don't exist in cache or DB
-- Every miss hits DB
-- Fix: Cache null values with short TTL, Bloom filter
```

**2. Cache Breakdown (Hot Key Expiry)**
```
-- Anti-pattern: Popular cache key expires, thousands of requests hit DB simultaneously
-- Fix: Lock/mutex for rebuild, longer TTL with background refresh, dogpile prevention
```

**3. Cache Bloat (Caching Everything)**
```
-- Anti-pattern: Caching all query results without invalidation strategy
-- Memory grows unbounded, stale data served
-- Fix: TTL, LRU eviction, selective caching
```

### 21.6 Concurrency Anti-Patterns

**1. Long-Running Transactions**
```
-- Anti-pattern: Transaction open while processing business logic
BEGIN;
-- 10 seconds of application code...
UPDATE ...;
-- More application code...
INSERT ...;
COMMIT;
-- Fix: Keep transactions short, acquire locks late, release early
```

**2. SELECT FOR UPDATE on Hot Rows**
```
-- Anti-pattern: Frequent SELECT FOR UPDATE on the same row
-- Sequences all writes to hot row
-- Fix: Batch updates, optimistic locking, message queue
```

**3. Read-Modify-Write Without Locking**
```
-- Anti-pattern:
row = SELECT * FROM inventory WHERE id = 123;
if row.stock > 0:
    UPDATE inventory SET stock = stock - 1 WHERE id = 123;
-- Race condition: two concurrent reads see stock=1, both proceed
-- Fix: Atomic UPDATE, SELECT FOR UPDATE, or optimistic lock
```

### 21.7 Partitioning/Sharding Anti-Patterns

**1. Choosing Wrong Shard Key**
```
-- Anti-pattern: Shard by region when 80% of users are in one region
-- One hot shard handles 80% traffic
-- Fix: Distribute evenly (hash, user_id, tenant_id)
```

**2. Shard Too Large / Too Many**
```
-- Anti-pattern: 1000 shards on 3 nodes
-- Complexity without benefit
-- Anti-pattern: Shard key with only 4 possible values
-- Max 4 shards, distribution problems
```

**3. Cross-Shard JOINs Everywhere**
```
-- Anti-pattern: Designing schema assuming cross-shard JOINs are cheap
-- Fix: Co-locate related data, denormalize, use reference tables
```

---

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

---

## Appendix: Quick Reference

### ACID Properties

| Property | Meaning |
|----------|---------|
| Atomicity | Transaction commits or aborts as a unit |
| Consistency | Transaction brings database from valid state to valid state |
| Isolation | Concurrent transactions appear sequential |
| Durability | Committed transaction survives failures |

### CAP Theorem

| Property | Meaning |
|----------|---------|
| Consistency | Every read receives most recent write or error |
| Availability | Every request receives a non-error response |
| Partition Tolerance | System continues despite network partitions |

Choose 2 of 3. In practice, CP or AP (partition tolerance is mandatory).

### PACELC Theorem (Extension)

- If Partition (P): tradeoff between Availability (A) and Consistency (C)
- Else (E): tradeoff between Latency (L) and Consistency (C)

### BASE (Alternative to ACID)

| Term | Meaning |
|------|---------|
| Basically Available | System guarantees availability |
| Soft State | State may change over time |
| Eventual Consistency | System will become consistent over time |

### Common Ports

| Database | Default Port |
|----------|-------------|
| PostgreSQL | 5432 |
| MySQL | 3306 |
| SQL Server | 1433 |
| Oracle | 1521 |
| MongoDB | 27017 |
| Redis | 6379 |
| Cassandra | 9042 |
| CockroachDB | 26257 |
| Neo4j | 7687 (Bolt), 7474 (HTTP) |

### Notable Extensions

**PostgreSQL:**
- pg_stat_statements: Query performance stats
- postgis: Geographic information system
- pgvector: Vector similarity search
- timescaledb: Time-series hypertables
- pgaudit: Audit logging
- pg_cron: Scheduled jobs
- HypoPG: Hypothetical indexes
- pg_hint_plan: Query hints
- pg_partman: Automated partition management
- citus: Distributed tables
- btree_gist: GiST support for B-Tree operators
- pg_trgm: Trigram fuzzy string matching

**MySQL:**
- InnoDB: Default storage engine (ACID-compliant)
- MyRocks: RocksDB-based, compression, write-optimized
- Group Replication: Multi-primary/primary-secondary replication
- Performance Schema: Instrumentation and monitoring

### Resource Limits

| Resource | PostgreSQL | MySQL | SQL Server |
|----------|-----------|-------|------------|
| Max DB size | Unlimited (OS limit) | Unlimited | 524PB |
| Max table size | 32TB | 64TB (InnoDB) | 524PB |
| Max row size | 1.6TB | 65KB (8KB page) | 8KB |
| Max index per table | Unlimited | 64 | 999 |
| Max columns per table | 1600 | 1017 | 1024 |
| Max connections | 100-500 (recommended) | 151-10000 | 32767 |

### SQL Cheat Sheet

```
-- Date dimension generation (PostgreSQL)
INSERT INTO dim_date (date_key, date, year, quarter, month, day, day_of_week, is_weekend)
SELECT
    to_char(d, 'YYYYMMDD')::INT AS date_key,
    d::DATE AS date,
    EXTRACT(YEAR FROM d)::INT AS year,
    EXTRACT(QUARTER FROM d)::INT AS quarter,
    EXTRACT(MONTH FROM d)::INT AS month,
    EXTRACT(DAY FROM d)::INT AS day,
    EXTRACT(DOW FROM d)::INT AS day_of_week,
    EXTRACT(DOW FROM d) IN (0, 6) AS is_weekend
FROM generate_series('2000-01-01'::DATE, '2030-12-31'::DATE, '1 day') AS d;

-- Paging with keyset (cursor) pagination (vs OFFSET)
SELECT * FROM orders
WHERE created_at < '2024-06-01T00:00:00Z'
ORDER BY created_at DESC
LIMIT 50;

-- Upsert (PostgreSQL)
INSERT INTO inventory (product_id, location, quantity)
VALUES ('PROD-001', 'WH-A', 100)
ON CONFLICT (product_id, location) DO UPDATE
SET quantity = excluded.quantity;

-- Upsert (MySQL)
INSERT INTO inventory (product_id, location, quantity)
VALUES ('PROD-001', 'WH-A', 100)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

-- Merge (SQL Server)
MERGE inventory AS target
USING (VALUES ('PROD-001', 'WH-A', 100)) AS source (product_id, location, quantity)
ON target.product_id = source.product_id AND target.location = source.location
WHEN MATCHED THEN UPDATE SET quantity = source.quantity
WHEN NOT MATCHED THEN INSERT (product_id, location, quantity) VALUES (source.product_id, source.location, source.quantity);

-- User activity (window function)
SELECT user_id, action, created_at,
       lag(created_at) OVER (PARTITION BY user_id ORDER BY created_at) AS prev_action_time,
       extract(epoch FROM created_at - lag(created_at) OVER (PARTITION BY user_id ORDER BY created_at)) AS seconds_since_last_action
FROM user_activity;

-- Running total
SELECT date, amount,
       sum(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM daily_sales;

-- Sampling
SELECT * FROM users TABLESAMPLE SYSTEM (1);  -- PostgreSQL
SELECT * FROM users ORDER BY RANDOM() LIMIT 1000;  -- Simple random
```

### Useful Queries

```
-- Check table sizes (PostgreSQL)
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC LIMIT 20;

-- Check database size (PostgreSQL)
SELECT datname, pg_size_pretty(pg_database_size(datname))
FROM pg_database ORDER BY pg_database_size(datname) DESC;

-- Current queries (PostgreSQL)
SELECT pid, age(now(), query_start) AS duration, state, query
FROM pg_stat_activity
WHERE state != 'idle' AND NOT pid = pg_backend_pid()
ORDER BY duration DESC;

-- Bloat estimate (PostgreSQL)
SELECT schemaname, tablename, n_dead_tup,
       n_live_tup, round(n_dead_tup * 100.0 / (n_live_tup + 1), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_pct DESC;

-- Check active connections (MySQL)
SELECT user, host, db, command, time, state
FROM information_schema.processlist;

-- InnoDB status
SHOW ENGINE INNODB STATUS\G

-- Table fragmentation (MySQL)
SELECT table_schema, table_name, data_free, data_length,
       round(data_free * 100 / data_length, 2) AS fragmentation_pct
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'performance_schema', 'mysql')
AND data_length > 1048576
ORDER BY fragmentation_pct DESC;
```

---

*END OF SKILL.md - Database Architect Skill Pack*
