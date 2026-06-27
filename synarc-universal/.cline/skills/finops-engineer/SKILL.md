---
name: finops-engineer
description: FinOps Engineer
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# FinOps Engineer

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

> *"Every dollar in the cloud is an investment. The FinOps Engineer ensures every investment drives maximum business value."*

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain ? store in brain/error_patterns/ or brain/decisions/
- Fix validated ? confidence += 1 in brain/error_patterns/
- Fix failed ? create new entry with attempted approaches
- Human correction ? store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence ? act immediately. 60-80% ? brief confirmation. < 60% ? clarify first.

**Auto-Complete Triggers:**
- Error received ? lookup pattern, propose fix immediately
- File named ? load file, offer action suggestions
- Exception thrown ? analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in = 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

## P2: FinOps Philosophy

### 2.1 The FinOps Lifecycle

The FinOps lifecycle consists of three iterative phases that form a continuous improvement loop:

#### Phase 1: Inform

The **Inform** phase establishes visibility and accountability. Without accurate, timely data on what is being spent and who is responsible, no optimization is possible.

**Key Activities:**
- Tag and label all resources with cost center, environment, owner, application ID
- Allocate shared costs using defined methodologies
- Build dashboards that provide role-appropriate views
- Establish regular cost reporting cadence
- Set budgets and alerts
- Implement anomaly detection

**Success Criteria:**
- 95%+ resource coverage with proper tags
- Cost allocation is automated and auditable
- Stakeholders can self-serve cost data
- Budget adherence within defined thresholds

#### Phase 2: Optimize

The **Optimize** phase focuses on reducing waste and improving efficiency across all cloud services.

**Key Activities:**
- Right-size over-provisioned resources
- Purchase commitment discounts for steady-state workloads
- Implement auto-scaling for variable workloads
- Use spot/preemptible instances where appropriate
- Implement storage lifecycle policies
- Eliminate orphaned and unutilized resources

**Success Criteria:**
- Resource utilization meets target thresholds (e.g., CPU > 40%, memory > 60%)
- Commitment discount coverage > 60% of eligible spend
- Waste reduction year-over-year
- Optimization recommendations are tracked to closure

#### Phase 3: Operate

The **Operate** phase embeds FinOps practices into daily operations and engineering workflows.

**Key Activities:**
- Integrate cost checks into CI/CD pipelines
- Implement cost-aware deployment strategies (e.g., canary deployments to measure cost impact)
- Automate cost remediation actions
- Train engineers on cost-efficient design patterns
- Run FinOps reviews as part of the regular sprint cadence
- Track unit economics for key business metrics

**Success Criteria:**
- Cost is a consideration in every architecture decision
- Automated remediation handles common cost issues
- Unit costs are trending downward
- Engineering teams have cost ownership

### 2.2 Core Principles

1. **Cost is a shared responsibility.** Engineers, product managers, and finance all have a role to play. No single team can optimize cloud costs alone.

2. **Visibility drives accountability.** When teams can see their costs in real-time, they naturally optimize. Obscuring costs leads to waste.

3. **Optimization is continuous.** Cloud costs are not a set-it-and-forget-it metric. New services, changing usage patterns, and pricing updates require ongoing attention.

4. **Business value, not cost reduction.** The goal is not to minimize spend but to maximize the value derived from each cloud dollar. Cutting costs that generate revenue is counterproductive.

5. **Automation over manual process.** Manual interventions do not scale. Automate cost controls, remediation, and reporting wherever possible.

6. **Unit economics matter.** Absolute cost is less informative than cost per unit (customer, transaction, API call, user). Unit costs enable meaningful comparison over time.

7. **Governance enables innovation.** Well-designed guardrails prevent cost overruns without blocking developer velocity.

### 2.3 Cross-Functional Collaboration

FinOps is inherently cross-functional. The FinOps Engineer must facilitate collaboration between:

**Engineering & Finance:**
- Finance speaks in budgets, accruals, and P&L. Engineering speaks in instances, services, and regions.
- The FinOps Engineer translates between these languages: mapping cloud resources to cost centers and GL codes.
- Monthly business reviews should include FinOps data presented in both technical and financial terms.

**Engineering & Product:**
- Product managers make decisions about feature scope and launch timing.
- The FinOps Engineer provides cost impact analysis: "This feature will cost $X per month at scale."
- Unit economics (cost per user, cost per transaction) inform product prioritization.

**Finance & Procurement:**
- Commitment discounts require financial commitment and forecasting.
- The FinOps Engineer provides utilization data to inform purchase decisions.
- Vendor negotiations are backed by data on current and projected spend.

### 2.4 Continuous Improvement Framework

| Week | Activity |
|------|----------|
| Daily | Check cost dashboards, review anomaly alerts, spot-check high-cost services |
| Weekly | Team cost review meeting, optimization opportunity tracking, budget vs actual analysis |
| Monthly | Published cost report, deep dive on top cost drivers, RI/SP coverage review |
| Quarterly | Unit economics review, vendor negotiation, budget forecasting, maturity assessment |
| Annually | Full FinOps program review, tooling assessment, RFP if needed, goal setting |

### 2.5 Cultural Transformation

FinOps succeeds only when it becomes part of the organizational culture. Key cultural shifts:

**From reactive to proactive.** Don't wait for the monthly bill. Monitor costs continuously and act before surprises occur.

**From centralized to distributed.** A central cloud finance team cannot scale with the organization. Embed cost ownership into product teams.

**From blame to enablement.** When costs spike, the response should be curiosity, not blame. Use data to understand the root cause and improve processes.

**From cost center to value driver.** Frame cloud costs as investments in business outcomes. Show how cloud spend enables faster delivery, innovation, and scale.

**From manual to automated.** Replace manual cost tracking and reporting with automated dashboards and alerts. Use infrastructure as code to bake in cost defaults.

## P4: Cost Visibility and Reporting

### 4.1 Reporting Cadence

| Frequency | Audience | Content |
|-----------|----------|---------|
| Daily | FinOps Team | Cost snapshot, anomaly alerts, budget tracker |
| Weekly | Engineering Teams | Team-level spend, optimization opportunities, cost-per-service |
| Monthly | All Stakeholders | Full cost report, trends, RI/SP coverage, budget vs actual |
| Quarterly | Leadership | Unit economics, year-over-year trends, strategic recommendations |
| Annual | Executives | Total cloud value story, sustainability report, program maturity |

### 4.2 Dashboard Design Principles

1. **Know your audience**. Finance dashboards show accruals, budgets, forecasts. Engineering dashboards show instances, services, optimization opportunities.
2. **Show trends, not snapshots**. A single data point is noise. Show day-over-day, week-over-week, and month-over-month trends.
3. **Use the right granularity**. Daily aggregation for operational dashboards. Monthly aggregation for financial reporting.
4. **Include context**. Always show budget vs actual, target vs current. Percentage changes.
5. **Highlight anomalies**. Use color coding, alerts, and conditional formatting.
6. **Enable drill-down**. Click from high-level summary to granular resource-level detail.
7. **Automate delivery**. Email PDF reports, Slack notifications, or embed dashboards in team portals.

### 4.3 Key Metrics and KPIs

**Cost Metrics:**

| Metric | Description | Target |
|--------|-------------|--------|
| Total Cloud Spend | Aggregate cost across all providers | Track trends |
| Cost by Service | Breakdown by cloud service | Varies |
| Cost by Team | Allocation by team | Proportional |
| Cost by Environment | Dev vs staging vs production | Prod 70%+, Dev 15%-, Test 10%- |
| Cost per Customer | Total cost divided by active customers | Decreasing |
| Cost per Transaction | Cost per business transaction | Decreasing |
| Unit Cost | Cost per unit of business value (e.g., per order) | Decreasing |

**Efficiency Metrics:**

| Metric | Description | Target |
|--------|-------------|--------|
| Resource Utilization | Average CPU/Memory utilization across resources | CPU > 40%, Memory > 60% |
| RI/SP Coverage | Percentage of eligible spend covered by commitments | > 60% |
| RI/SP Utilization | Actual usage of purchased commitments | > 85% |
| Waste Percentage | Spend on idle/unused resources | < 5% |
| Optimization Velocity | Time from identifying to implementing optimization | < 2 weeks |

**Governance Metrics:**

| Metric | Description | Target |
|--------|-------------|--------|
| Tag Coverage | Percentage of resources with required tags | > 95% |
| Budget Adherence | Percentage of teams within budget | > 90% |
| Anomaly Response Time | Time to respond to cost anomalies | < 4 hours |
| Unallocated Spend | Percentage of spend not allocated | < 2% |

### 4.4 Dashboard Examples

**Executive Dashboard:**
- Total cloud spend (monthly, quarterly, annually)
- Cost by business unit
- Cost as percentage of revenue
- Top 5 cost drivers
- Budget vs actual
- YoY cost trends

**Engineering Dashboard:**
- Team-level daily spend
- Service-level cost breakdown
- Resource utilization heatmap
- Optimization recommendation queue
- RI/SP coverage by account
- Cost per deployment

**Finance Dashboard:**
- Accrued vs billed costs
- Forecast vs actual
- RI/SP amortization
- Unit economics trends
- Vendor credits and discounts
- Capex vs Opex breakdown

### 4.5 Unit Economics

Unit economics answers the question: "What does one unit of our business cost in cloud resources?"

**Defining the Unit:**

The unit should be the primary business metric that drives value:

| Business Model | Unit |
|----------------|------|
| SaaS | Cost per active user, cost per tenant |
| E-commerce | Cost per order, cost per session |
| Media/Streaming | Cost per stream hour, cost per user |
| API Platform | Cost per API call, cost per developer |
| Gaming | Cost per MAU, cost per game session |
| Fintech | Cost per transaction, cost per account |

**Calculating Unit Cost:**

```
Unit Cost = Total Cloud Cost / Total Units

Example:
Total Cloud Cost: $500,000/month
Active Users: 1,000,000
Cost per Active User: $0.50/month
```

**Breaking Down Unit Cost by Service:**

```
Cost per Active User Breakdown:
+-- Compute: $0.20 (40%)
+-- Storage: $0.10 (20%)
+-- Database: $0.08 (16%)
+-- Networking: $0.05 (10%)
+-- Serverless: $0.04 (8%)
+-- Other: $0.03 (6%)
```

### 4.6 Forecasting

**Methods of Cloud Cost Forecasting:**

1. **Linear Extrapolation**: Low-effort, rough estimate. Use for steady-state workloads.
   - `Forecast = Current Spend × (1 + Growth Rate)`

2. **Time Series Forecasting**: ARIMA, Exponential Smoothing. Use for workloads with seasonal patterns.
   - Accounts for weekly, monthly, seasonal cycles.
   - Requires 12+ months of historical data.

3. **Usage-Based Forecasting**: Build a model that maps business metrics to cloud usage.
   - `Cloud Cost = f(Users, Transactions, Data Volume)`
   - More accurate for variable workloads.
   - Requires understanding of cost drivers.

4. **Bottom-Up Forecasting**: Aggregate cloud costs from planned changes.
   - Sum up new services, migrations, growth estimates.
   - Useful for strategic planning.

**Forecasting Best Practices:**

- Always forecast at the service level, not just aggregate.
- Account for reserved instance purchases and expirations.
- Include provider price changes and new instance type releases.
- Run multiple scenarios (optimistic, realistic, pessimistic).
- Update forecasts monthly with actual data.
- Track forecast accuracy over time.

### 4.7 Cost Per Customer/Feature/Team

**Cost Per Customer:**
- Identify the cost drivers per customer (compute, storage, data transfer).
- Allocate shared costs proportionally.
- Segment customers by tier (free, basic, premium, enterprise).
- Track cost per customer over time.
- Identify unprofitable customer segments.

**Cost Per Feature:**
- Map cloud resources to product features.
- Allocate shared infrastructure to features based on usage.
- Calculate cost per feature per month.
- Compare feature cost to feature revenue (if available).
- Inform product decisions with cost data.

**Cost Per Team:**
- Tag resources with team ownership.
- Allocate shared services to consuming teams.
- Show each team their spend.
- Set team-level budgets.
- Recognize and reward cost-efficient teams.

### 4.8 Automated Reporting

Build automated reporting pipelines:

**Data Pipeline:**
```
Cloud Provider API ? Cost Export (CSV/Parquet) ? Data Lake (S3/Blob/GCS)
? ETL (Athena/BigQuery/Synapse) ? Dashboard (QuickSight/Power BI/Looker)
```

**Automation Triggers:**
- Daily: Refresh cost dashboards, send Slack summary
- Weekly: Email cost report to engineering leads
- Monthly: Full cost report PDF to stakeholders
- On-threshold: Alert when spend exceeds budget

**Tooling for Automation:**
- AWS: Cost and Usage Report (CUR) ? Athena ? QuickSight
- Azure: Cost Export ? Power BI
- GCP: Billing Export BigQuery ? Looker
- Third-party: CloudHealth, Cloudability, Vantage APIs

### 4.9 Cost Intelligence

Beyond basic reporting, build cost intelligence capabilities:

**What-If Analysis:**
- "What if we move this workload to a different instance type?"
- "What if we purchase a 3-year reserved instance?"
- "What if we move to a different region?"
- "What if we implement auto-scaling?"

**Cost Modeling:**
- Model the cost of new features before building them
- Compare cost of different architectural approaches
- Build cost calculators for engineering teams

**Benchmarking:**
- Compare your costs to industry benchmarks
- Compare cost efficiency across teams internally
- Track cost efficiency improvements over time

### 4.10 Data Export and Integration

Ensure cost data is available where decisions are made:

| Integration | Purpose |
|-------------|---------|
| ERP/Finance System | Accruals, budgeting, P&L |
| Jira/Linear | Tag optimization tickets to teams |
| Slack/Teams | Cost alerts and daily summaries |
| PagerDuty/Opsgenie | Anomaly alerting |
| Data Warehouse | Advanced analytics and ML |
| BI Tools | Custom reporting |

## P6: Storage Optimization

### 6.1 Storage Tiering Strategy

Cloud providers offer multiple storage tiers with different price-performance characteristics.

**AWS S3 Storage Classes:**

| Class | Durability | Availability | Min Storage Duration | Retrieval Fee | Use Case |
|-------|------------|--------------|---------------------|---------------|----------|
| S3 Standard | 99.999999999% | 99.99% | None | None | Frequently accessed data |
| S3 Intelligent-Tiering | 99.999999999% | 99.9% | 30 days | None | Unknown/changing access patterns |
| S3 Standard-IA | 99.999999999% | 99.9% | 30 days | Per GB retrieved | Infrequently accessed |
| S3 One Zone-IA | 99.999999999% | 99.5% | 30 days | Per GB retrieved | Recreatable data |
| S3 Glacier Instant Retrieval | 99.999999999% | 99.9% | 90 days | Per GB retrieved | Archive, millisecond retrieval |
| S3 Glacier Flexible Retrieval | 99.999999999% | 99.99% | 90 days | Per GB retrieved | Archive, minutes retrieval |
| S3 Glacier Deep Archive | 99.999999999% | 99.99% | 180 days | Per GB retrieved | Long-term archive, hours retrieval |

**Azure Blob Storage Tiers:**

| Tier | Min Storage Duration | Retrieval Cost | Use Case |
|------|---------------------|---------------|----------|
| Hot | None | Lowest | Frequently accessed |
| Cool | 30 days | Low | Infrequently accessed |
| Cold | 90 days | Medium | Rarely accessed |
| Archive | 180 days | Highest | Long-term retention |

**GCP Storage Classes:**

| Class | Min Storage Duration | Retrieval Cost | Use Case |
|-------|---------------------|---------------|----------|
| Standard | None | None | Frequently accessed |
| Nearline | 30 days | Per GB | Less than once per month |
| Coldline | 90 days | Per GB | Less than once per quarter |
| Archive | 365 days | Per GB | Less than once per year |

### 6.2 Lifecycle Policies

Lifecycle policies automate the transition of data between storage tiers and the deletion of expired data.

**Sample S3 Lifecycle Policy:**

```
Rule 1: Log Data
  - Transition to Standard-IA after 30 days
  - Transition to Glacier after 90 days
  - Transition to Deep Archive after 365 days
  - Expire (delete) after 730 days

Rule 2: Temporary Files
  - Expire (delete) after 7 days
  - Prefix: tmp/

Rule 3: Old Versions
  - Transition noncurrent versions to Standard-IA after 30 days
  - Expire noncurrent versions after 90 days

Rule 4: Failed Uploads
  - Delete incomplete multipart uploads after 7 days
```

**Lifecycle Policy Best Practices:**

1. Start with conservative transition times. It is easier to accelerate than to retrieve from archive.
2. Use prefix-based rules to apply different policies to different data types.
3. Consider compliance requirements before setting deletion policies.
4. Monitor transition costs. Moving data between tiers incurs API charges.
5. Test lifecycle policies with a subset of data before broad rollout.

### 6.3 Storage Optimization Techniques

**Compression:**
- Compress data before uploading to reduce storage costs
- Use columnar formats (Parquet, ORC) for analytics data
- Enable gzip compression for log files
- Compress images, videos, and other media

**Deduplication:**
- Eliminate duplicate data at the application layer
- Use content-addressable storage patterns
- Leverage block storage deduplication

**Data Retention Policies:**

| Data Type | Retention Period | Action |
|-----------|-----------------|--------|
| Application logs | 30-90 days | Delete or archive |
| System logs | 90-365 days | Archive |
| Audit logs | 1-7 years | Archive (varies by regulation) |
| User data | As long as account active | Tier to cold storage over time |
| Backups | 30-365 days | Delete old backups |
| Old database snapshots | 7-30 days | Delete |
| Temp files | 1-7 days | Delete |
| Build artifacts | 30-90 days | Delete old versions |

### 6.4 EBS and Block Storage Optimization

**EBS Volume Types (AWS):**

| Volume Type | Max IOPS | Max Throughput | Use Case |
|-------------|----------|---------------|----------|
| gp3 | 16,000 | 1,000 MB/s | General purpose (default) |
| gp2 | 16,000 | 250 MB/s | Legacy general purpose |
| io1/io2 | 64,000 | 1,000 MB/s | High-performance databases |
| st1 | 500 | 500 MB/s | Throughput-optimized (HDD) |
| sc1 | 250 | 250 MB/s | Cold (HDD) |

**EBS Optimization Tips:**

1. Use gp3 as the default volume type. It costs less than gp2 for similar performance.
2. Right-size volumes. Most volumes have significant allocated but unused capacity.
3. Use snapshots for backup, not volume copies.
4. Delete unattached volumes. They still incur charges.
5. Use EBS Lifecycle Manager for automated snapshot lifecycle.
6. Consider instance store volumes for temporary data.
7. Enable data deduplication where appropriate.

**Azure Disk Types:**

| Type | Max IOPS | Max Throughput | Use Case |
|------|----------|---------------|----------|
| Ultra | 160,000 | 2,000 MB/s | Extremely high performance |
| Premium SSD v2 | 80,000 | 1,200 MB/s | Production workloads |
| Premium SSD | 20,000 | 900 MB/s | Consistent performance |
| Standard SSD | 6,000 | 750 MB/s | Dev/test |
| Standard HDD | 2,000 | 500 MB/s | Backup, infrequent access |

### 6.5 S3 Intelligent Tiering

S3 Intelligent Tiering automatically optimizes storage costs for data with unknown or changing access patterns.

**How It Works:**
- Automatically moves data between Frequent Access, Infrequent Access, and Archive Instant Access tiers
- No retrieval fees
- Small monthly monitoring and automation fee ($0.0025 per 1,000 objects)
- 30-day minimum for the Frequent Access tier

**When to Use:**
- Data with unpredictable access patterns
- Data lakes with varied usage across datasets
- When you don't want to manually manage lifecycle policies
- Cost-sensitive scenarios where retrieval fees would be unpredictable

### 6.6 Archival Strategy

**Archive Workflow:**

1. Classify data (by age, access frequency, compliance requirements)
2. Define archival policies (what, when, how)
3. Implement lifecycle policies for auto-archival
4. Test retrieval procedures
5. Set up retrieval cost tracking
6. Document archive inventory
7. Periodically review archival data for relevance

**Archive Cost Calculation:**

Storage: $0.001/GB/month (Glacier Deep Archive) vs $0.023/GB/month (Standard)
1 PB archived for 1 year:
  Standard: $276,000/year
  Deep Archive: $12,000/year
  Savings: $264,000/year

**Retrieval Lead Time Guidelines:**

| Tier | Retrieval Time | Best For |
|------|---------------|----------|
| Glacier Instant | 1-5 minutes | Infrequent but urgent access |
| Glacier Flexible | 1-5 minutes (Expedited), 3-5 hours (Standard) | Audit, compliance |
| Glacier Deep Archive | 12 hours | Legal hold, regulatory |

### 6.7 Object Storage Cost Optimization

**S3 Cost Drivers:**
- Storage amount (GB-months)
- PUT/GET/LIST request counts
- Data transfer out
- S3 Select usage
- S3 Object Lambda
- Replication

**Optimization Techniques:**

1. Reduce request costs: Aggregate small objects, batch requests, use S3 Inventory for listing.
2. Minimize data transfer: Use CloudFront, enable S3 Transfer Acceleration only when beneficial.
3. Optimize replication: Replicate only critical data. Use same-region replication when possible.
4. Use S3 Batch Operations: Get bulk pricing for large operations.
5. Delete incomplete multipart uploads: Auto-delete after 7 days.
6. Use checksums efficiently: Choose appropriate checksum algorithm.

### 6.8 File Storage (EFS, FSx, Azure Files)

**NFS/SMB Storage Optimization:**

- Choose the right performance mode (Bursting vs Provisioned for EFS)
- Use lifecycle management to move cold files to IA/Archive
- Consider FSx for Lustre for HPC workloads
- Use Azure Files sync for hybrid scenarios
- Enable compression for file shares

### 6.9 Storage Monitoring and Alerting

**Key Storage Metrics to Monitor:**

| Metric | Why It Matters | Alert Threshold |
|--------|---------------|-----------------|
| Bucket size growth | Predict cost trends | > 20% monthly growth |
| Storage tier distribution | Identify optimization opportunities | > 50% in Standard |
| Object count | Request cost impact | Trend monitoring |
| Transition size | Lifecycle policy cost | Per-policy tracking |
| Retrieval volume | Archive retrieval costs | > 1% of total archive |
| Data transfer out | Network egress costs | > $X threshold |
| Unattached volumes | Waste identification | Any |

## 8 — UNIT ECONOMICS AND VALUE DRIVERS

### 8.1 — Unit Economics Framework

**Unit Economics Definition:**

Unit economics measures the cost and revenue associated with a single unit of business. A unit can be a customer, a transaction, a feature, or a product.

```
Gross Margin per Unit = Revenue per Unit - Cost per Unit
LTV (Lifetime Value) = Gross Margin per Unit × Average Customer Lifetime
CAC (Customer Acquisition Cost) = Total Sales and Marketing Costs / New Customers Acquired
LTV:CAC Ratio = LTV / CAC
Payback Period = CAC / Monthly Gross Margin per Customer
```

**Healthy Thresholds:**

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| LTV:CAC | > 3:1 | 2:1 - 3:1 | < 2:1 |
| Payback Period | < 12 months | 12-18 months | > 18 months |
| Gross Margin | > 60% | 40-60% | < 40% |
| Churn | < 5% monthly | 5-10% monthly | > 10% monthly |

### 8.2 — Cloud Cost per Unit

**Calculating Cost per Feature:**

```python
# Example: Cost per API call
total_monthly_cloud_cost = 50000  # dollars
total_api_calls = 500_000_000

cost_per_call = total_monthly_cloud_cost / total_api_calls
# = $0.0001 per call = $0.10 per 1,000 calls

# Cost per feature (proportional to API calls)
feature_api_calls = {
    "authentication": 80_000_000,  # 16% of total
    "data_storage": 120_000_000,  # 24% of total
    "analytics": 200_000_000,     # 40% of total
    "notifications": 100_000_000   # 20% of total
}

for feature, calls in feature_api_calls.items():
    feature_cost = cost_per_call * calls
    print(f"{feature}: ${feature_cost:.2f}/month")
```

**Feature Cost Optimization Priority:**

1. High-cost features (top 20% of cloud cost) get detailed optimization investigations
2. Medium-cost features (20-60%) get periodic review
3. Low-cost features (bottom 40%) are left as-is unless obvious waste

### 8.3 — Margins by Service Tier

**Cost-to-Serve Analysis:**

```python
# Service tier cost breakdown
service_tiers = {
    "free_tier": {
        "users": 10000,
        "avg_compute_cost_per_user": 0.02,
        "avg_storage_cost_per_user": 0.01,
        "support_cost_per_user": 0.005
    },
    "pro_tier": {
        "users": 5000,
        "avg_compute_cost_per_user": 0.08,
        "avg_storage_cost_per_user": 0.04,
        "support_cost_per_user": 0.02
    },
    "enterprise_tier": {
        "users": 1000,
        "avg_compute_cost_per_user": 0.25,
        "avg_storage_cost_per_user": 0.15,
        "support_cost_per_user": 0.10
    }
}

for tier, costs in service_tiers.items():
    total_cost = sum(costs.values())
    print(f"{tier}: ${total_cost:.4f}/user/month")
```

**Tier Profitability Analysis:**

| Tier | Revenue/User | Cost/User | Margin | Customers | Total Margin |
|------|-------------|-----------|--------|-----------|--------------|
| Free | $0 | $0.015 | -$0.015 | 10,000 | -$150 |
| Pro | $49 | $0.14 | $48.86 | 5,000 | $244,300 |
| Enterprise | $499 | $0.50 | $498.50 | 1,000 | $498,500 |

Free tier is a customer acquisition channel, not a profit center. If free tier conversion rate is < 5%, reconsider free tier offering.

### 8.4 — Optimization ROI Framework

**Prioritizing Optimization Projects:**

```
ROI = (Projected Annual Savings) / (Implementation Cost + Ongoing Maintenance)

Prioritization:
- ROI > 10: High priority, approve immediately
- ROI 3-10: Medium priority, approve in next cycle
- ROI 1-3: Low priority, approve if capacity available
- ROI < 1: Do not approve (unless strategic reason)
```

**Example Optimization Projects:**

| Project | One-time Cost | Annual Savings | ROI | Priority |
|---------|--------------|----------------|-----|----------|
| Spot instances for batch | $10,000 | $120,000 | 12x | High |
| Reserved instances | $50,000 | $180,000 | 3.6x | Medium |
| Architecture refactor | $200,000 | $100,000 | 0.5x | Low |
| Right-sizing compute | $5,000 | $60,000 | 12x | High |

---

## End of FinOps Engineer SKILL.md
