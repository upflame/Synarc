---
title: FinOps Engineer
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc
tags:
  - finops
  - cloud-cost
  - cost-optimization
  - tagging
  - right-sizing
  - reserved-instances
  - savings-plans
  - anomaly-detection
  - unit-economics
  - cost-governance
  - sustainability
---

# Purpose

Drive financial accountability, cost visibility, and continuous optimization in cloud environments — bridging engineering, finance, and product to ensure every cloud dollar drives maximum business value.

# Scope

FinOps lifecycle (Inform → Optimize → Operate), cost allocation and tagging, compute/storage/network optimization, commitment discounts (RIs, Savings Plans), auto-scaling, spot instances, cost visibility and reporting, unit economics, forecasting, governance and policy, sustainability. Does not cover specific contract negotiation or accounting.

# Inputs

Cloud provider bills and usage reports, resource utilization metrics, tagging data, budget allocations, business growth forecasts.

# Outputs

Cost allocation dashboards, optimization recommendations, tagging strategies, RI/SP purchase plans, unit economics reports, budget alerts, governance policies, cost anomaly detection systems.

---

## 1. FinOps Lifecycle

### Phase 1: Inform (Visibility & Accountability)
- Tag all resources (95%+ coverage); allocate shared costs using defined methodology
- Build role-appropriate dashboards; set budgets and alerts; implement anomaly detection
- Stakeholders can self-serve cost data; budget adherence within thresholds

### Phase 2: Optimize (Reduce Waste & Improve Efficiency)
- Right-size over-provisioned resources (CPU target per workload type)
- Purchase commitment discounts for steady-state workloads (60%+ coverage)
- Auto-scaling for variable workloads; spot/preemptible for fault-tolerant
- Storage lifecycle policies; eliminate orphaned resources

### Phase 3: Operate (Embed in Daily Workflows)
- Cost checks in CI/CD pipelines; cost-aware deployment strategies
- Automated remediation for common cost issues
- Train engineers on cost-efficient design patterns
- Track unit economics trending downward; cost ownership by engineering teams

## 2. Cost Allocation

### Tagging Strategy
**Mandatory tags**: cost_center, environment (production/staging/development), owner, application, project, provisioning_method, compliance, business_unit.
**Optional**: tier, schedule, expiration_date, region, department, team.

Guidelines: enforce via tag policies (AWS Organizations, Azure Policy, GCP Org Policies); automate via IaC defaults and tag enforcers; backfill missing tags; clean unused keys regularly.

### Allocation Methods
- Direct: resource dedicated to one cost dimension
- Proportional: shared resources split by usage, headcount, revenue, time, or even split
- Hierarchical: BU → Team → Application (for complex orgs)

### Showback vs Chargeback
Start with showback (awareness), mature to chargeback (financial accountability). Hybrid: showback for awareness, chargeback for high-cost teams.

### Shared Cost Allocation
Kubernetes overhead, networking (NAT Gateway, Transit Gateway), security services (WAF, GuardDuty), monitoring (CloudWatch, Datadog), CI/CD infra, shared databases, enterprise support.
Allocate by: usage, headcount, revenue, resource count, or fixed percentage.

## 3. Compute Optimization

### Right-Sizing Process
1. Analyze utilization over 14-30 days (CPU, memory, network, disk)
2. Identify over-provisioned (peak CPU <40%, memory <60%)
3. Identify under-provisioned (sustained >80%)
4. Select target instance type (AWS Compute Optimizer, Azure Advisor, GCP Rightsizing Recommendations)
5. Plan migration, execute, monitor 48-72h, track savings

### Instance Type Selection
- Burstable (t/B-series): variable workloads, low cost
- General purpose (m/D/N-series): balanced
- Compute-optimized (c/F/C-series): CPU-intensive
- Memory-optimized (r/E/M-series): in-memory caches
- GPU (g/p/NC/A-series): ML, graphics — very high cost
- ARM/Graviton: 20-40% savings for compatible workloads

### Commitment Discounts

| Type | Discount | Flexibility | Coverage |
|---|---|---|---|
| Compute SP | Up to 66% | Highest (any instance, region, OS) | EC2, Fargate, Lambda |
| EC2 Instance SP | Up to 72% | Moderate (family + region) | EC2 only |
| Standard RI | Up to 72% | Low (specific instance) | EC2 only |

Strategy: Compute SP as default; RIs for very predictable workloads. Start with 1-year All Upfront, cover baseline usage, leave 10-20% headroom.

### Auto-Scaling
- Target tracking: set utilization target (e.g., CPU 60%)
- Step scaling: add N instances per threshold breach
- Scheduled: for predictable traffic patterns
- Predictive scaling: ML-based for daily/weekly patterns
- Best practices: 120-300s cooldown, mixed instance groups, scale-in protection, warm pools

### Spot/Preemptible Instances
60-90% discount. Good for: batch, stateless web servers, CI/CD runners, data analytics, fault-tolerant ML training. Bad for: stateful workloads, databases, real-time user-facing, low-latency apps. Use diversified instance types + capacity-optimized allocation + graceful interruption handling.

### Orphaned Resource Cleanup
Common waste: stopped EBS volumes, unassociated Elastic IPs, old AMIs/snapshots, unused LBs, stale ASGs, idle NAT Gateways. Grace period: 7-14 days notification before deletion.

## 4. Storage Optimization

### Tiering Strategy
| Tier | Retrieval | Cost/GB/mo | Best For |
|---|---|---|---|
| S3 Standard / Hot | Instant | $0.023 | Frequently accessed |
| S3 IA / Cool | Instant | $0.0125 | Infrequent (>30d) |
| S3 Glacier Instant | Millisecond | $0.004 | Archive, quick access |
| S3 Glacier Flexible | Minutes | $0.0036 | Archive, audit |
| S3 Deep Archive | Hours | $0.001 | Long-term (180d min) |

Lifecycle policies: automate transitions based on age. Example: logs → IA at 30d → Glacier at 90d → Deep Archive at 365d → delete at 730d.

### Optimization
- Compress (gzip/Parquet for analytics), deduplicate, set retention policies
- Use gp3 as default EBS (cheaper than gp2 for same perf)
- Delete unattached volumes; use EBS Lifecycle Manager for snapshot lifecycle
- S3 Intelligent-Tiering for unpredictable access patterns (auto-moves between tiers)

## 5. Network Cost Optimization

### Key Cost Drivers
Data Transfer Out (DTO) — highest impact; Cross-AZ traffic ($0.01/GB); Cross-region ($0.02-0.09/GB); NAT Gateway ($0.045/hr + $0.045/GB); Load Balancers ($0.0225/hr + LCU charges).

### Optimization
- Minimize cross-AZ traffic: co-locate communicating services in same AZ
- Use VPC endpoints (gateway endpoints are free) to avoid NAT traversal
- CDN (CloudFront, Cloudflare): cache at edge, reduce origin egress
- Reduce NAT Gateway traffic; consider NAT instance for low volumes
- Keep data in same region as compute; use global CDN with regional origins
- Compress cross-region data; use provider backbone (Global Accelerator, Azure Front Door)

## 6. Cost Visibility & Reporting

| Cadence | Audience | Content |
|---|---|---|
| Daily | FinOps team | Cost snapshot, anomaly alerts, budget tracker |
| Weekly | Engineering teams | Team-level spend, optimization opportunities |
| Monthly | All stakeholders | Full cost report, RI/SP coverage, budget vs actual |
| Quarterly | Leadership | Unit economics, YoY trends, strategic recommendations |

### Key KPIs
- Cost metrics: total spend, cost by service/team/environment, cost per customer/transaction
- Efficiency: resource utilization (>40% CPU, >60% memory), RI/SP coverage (>60%), utilization (>85%), waste (<5%)
- Governance: tag coverage (>95%), budget adherence (>90%), anomaly response (<4h), unallocated (<2%)

### Unit Economics
Unit = primary business metric (active user, order, API call, stream hour). `Unit Cost = Total Cloud Cost / Total Units`. Break down by service (compute, storage, database, networking, serverless). Track trending downward.

### Forecasting
Methods: linear extrapolation (steady-state), time series ARIMA (seasonal), usage-based modeling (f(users, transactions, data volume)), bottom-up (aggregate planned changes). Always forecast at service level. Run optimistic/realistic/pessimistic scenarios. Update monthly.

## 7. Governance & Automation

### Budget Controls
Set budgets at account/team/service level with alert thresholds (50%, 80%, 90%, 100%). Automated actions: stop non-production instances, restrict provisioning, notify owners.

### CI/CD Cost Gates
- Tag compliance check (fail if missing mandatory tags)
- Cost impact estimation for new resources
- Architecture review for high-cost patterns

### Cost Anomaly Detection
Monitor: day-over-day spikes >20%, week-over-week >30%, month-over-month >50%, new service usage, unforecasted spend. Automated remediation: stop/terminate identified waste, notify owner, file optimization ticket.

## 8. Sustainability

Track carbon footprint per cloud provider (AWS Customer Carbon Footprint Tool, Azure Emissions Impact Dashboard, GCP Carbon Footprint). Optimization aligns with cost efficiency: right-sizing reduces both cost and carbon; spot/preemptible improves utilization; efficient storage tiering reduces energy; region selection based on carbon intensity.
