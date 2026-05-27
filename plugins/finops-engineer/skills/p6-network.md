---

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

---

## P7: Network Cost Optimization

### 7.1 Understanding Network Costs

Network costs are often the most surprising line item on the cloud bill. They are complex, variable, and easy to overlook during architecture design.

**Common Network Cost Components:**

| Component | Description | Cost Impact |
|-----------|-------------|-------------|
| Data Transfer Out (DTO) | Data leaving the cloud provider | Highest impact |
| Cross-AZ Traffic | Data transfer between availability zones | Medium impact |
| Cross-Region Traffic | Data transfer between regions | High impact |
| NAT Gateway | Per hour + data processing fee | Medium impact |
| Load Balancer | Per hour + LCU/CLCU charges | Low-Medium impact |
| VPN Connection | Per hour + data transfer | Low-Medium impact |
| Direct Connect | Port hours + data transfer | High impact (fixed) |
| Transit Gateway | Attachment hours + data processing | Medium impact |
| DNS Queries | Per million queries | Low impact |
| CDN/Edge | Cache egress + request fees | Variable |

### 7.2 Data Transfer Costs

**AWS Data Transfer Pricing Pattern:**

Same Region:
  - EC2 to EC2 (same AZ): Free
  - EC2 to EC2 (different AZ): $0.01/GB each direction
  - S3 to EC2 (same region): Free
  - S3 to internet: $0.09/GB first 1 GB, then tiered

Cross Region:
  - EC2 to EC2 (different region): $0.02-0.09/GB
  - S3 to different region: $0.02/GB

Internet:
  - First 1 GB/month: Free
  - Up to 10 TB: $0.09/GB
  - 10-50 TB: $0.085/GB
  - 50-150 TB: $0.07/GB
  - 150-500 TB: $0.05/GB
  - 500+ TB: Negotiated

**Azure Data Transfer Pattern:**

Same Region:
  - VNet to VNet: Free (same region)
  - Azure to Azure (same region): Free

Cross Region:
  - Within continent: $0.01-0.025/GB
  - Between continents: $0.05-0.08/GB

Internet:
  - First 100 GB/month (12 months): Free
  - Then tiered pricing up to $0.083/GB

**GCP Data Transfer Pattern:**

Same Region:
  - VM to VM (same zone): Free
  - VM to VM (different zone): $0.01/GB
  - Google services: Free

Cross Region:
  - North America: $0.01/GB
  - Between continents: $0.05-0.15/GB

Internet:
  - First 200 GB/month: Free to some regions
  - Then tiered from $0.085-0.12/GB

### 7.3 CDN and Edge Optimization

Content Delivery Networks (CDNs) reduce data transfer costs by caching content closer to users.

**CDN Cost Savings Mechanism:**

Without CDN:
  User -> Origin Server
  - Each request hits origin (higher origin load, higher egress costs)
  - Egress from expensive cloud region

With CDN:
  User -> Edge Location (cache hit)
  - Most requests served from edge
  - Reduced origin load
  - Lower egress (cloud to CDN is cheaper than cloud to user)

**CDN Cost Comparison:**

| CDN | Origin Egress Cost | Edge Egress Cost | Cache Hit Ratio Impact |
|-----|-------------------|------------------|----------------------|
| CloudFront | $0.00 (Free to origin) | $0.085/GB | Direct savings |
| Cloudflare | $0.00 (Free to origin, capped) | $0.00-0.03/GB | Significant |
| Azure CDN | $0.00 (Free to origin) | $0.087/GB | Direct savings |
| GCP Cloud CDN | $0.00 (Free to origin) | $0.02-0.08/GB | Direct savings |
| Fastly | $0.00 (Free to origin) | $0.10/GB + platform fee | Direct savings |

**CDN Optimization Strategies:**

1. Maximize cache hit ratio: Set appropriate Cache-Control headers, use long TTLs for static content.
2. Cache at multiple layers: Browser cache, CDN cache, Origin cache.
3. Use origin shield: Reduce load on origin and optimize transfer costs.
4. Compress at edge: Enable compression at CDN level.
5. Use custom domains: Avoid SNI issues and improve performance.
6. Leverage HTTP/2 and HTTP/3: Reduce connection overhead.
7. Optimize image delivery: Use CDN image optimization features.

### 7.4 NAT Gateway Cost Optimization

NAT Gateways are one of the most common network cost surprises.

**Cost Components:**
- Per hour: $0.045/hour (approximately $32/month)
- Data processing: $0.045/GB processed

**Optimization Strategies:**

1. Minimize NAT Gateway traffic: Use VPC endpoints for AWS services (S3, DynamoDB, etc.) to avoid NAT traversal.
2. Use a single NAT Gateway for non-production: NAT Gateways are AZ-specific. A single AZ provides internet access for one zone; use for dev/test.
3. Consider NAT Instance (EC2): For lower volumes, a NAT instance can be cheaper ($5-15/month).
4. Use Transit Gateway + shared NAT: In multi-account setups, share a single NAT Gateway across accounts via Transit Gateway.
5. Move to IPv6: Egress-only internet gateways for IPv6 are free.
6. Optimize traffic patterns: Reduce chatty applications that generate many small requests.

**Cost Comparison:**

Scenario: 10 TB/month NAT Gateway traffic

NAT Gateway:
  - Hourly: $0.045 x 730 hours = $32.85/month
  - Data processing: $0.045 x 10,240 GB = $460.80/month
  - Total: $493.65/month

NAT Instance (t4g.nano):
  - Compute: ~$5/month
  - No data processing fee
  - Total: ~$5/month

### 7.5 Cross-Region Traffic Optimization

Cross-region data transfer is among the most expensive network costs.

**Strategies to Minimize Cross-Region Traffic:**

1. Data residency: Keep data in the same region as compute.
2. Global infrastructure: Use a global architecture with regional deployments.
3. Database replication: Use managed replication (cross-region read replicas) rather than application-level data transfer.
4. Async communication: Use queues and event buses for cross-region async patterns.
5. Data compression: Compress data before cross-region transfer.
6. Deduplication: Avoid sending duplicate data across regions.
7. Cache globally: Use global CDN with regional origins.
8. Use provider backbone: Use AWS Global Accelerator, Azure Front Door, GCP Cloud CDN for optimized routing.

### 7.6 Load Balancer Optimization

**Load Balancer Cost Components:**

| LB Type | Hourly Charge | LCU/CLCU Charge | Best For |
|---------|--------------|-----------------|----------|
| ALB | $0.0225/hr | Per LCU (new connections, active connections, processed bytes, rule evaluations) | HTTP/HTTPS traffic |
| NLB | $0.0225/hr | Per NLCU (new connections, active connections, throughput) | TCP/UDP traffic |
| GLB | $0.0225/hr | Per GLCU | Gateway traffic |
| CLB | $0.025/hr | Per GB data processed | Legacy (not recommended) |

**Optimization Strategies:**

1. Use appropriate LB type: Don't use ALB for TCP traffic.
2. Right-size rules: Reduce number of rule evaluations per request.
3. Connection management: Use keepalive connections.
4. Idle LB deletion: Regularly check for LBs with no targets.
5. Consider service mesh: For microservices, service mesh (Istio, Consul) can reduce LB dependency.
6. Use AWS PrivateLink: For internal traffic, avoid public LBs.

### 7.7 Direct Connect and VPN

**Cost Comparison:**

| Connection Type | Setup Cost | Monthly Cost | Bandwidth | Use Case |
|-----------------|------------|--------------|-----------|----------|
| Site-to-Site VPN | Free | $0.05/hr per tunnel | Internet-dependent | Low volume, flexible |
| Direct Connect | Variable (~$500 setup) | $200-2,000+/month | 50 Mbps - 100 Gbps | High volume, consistent |
| Direct Connect Gateway | Included in DX | $0-200+/month | Same as DX | Multi-region |
| Transit Gateway | Free | $0.05/hr per attachment | Dependent on connections | Complex network topology |

**When to Use Direct Connect:**

- Transferring > 10 TB/month consistently
- Latency-sensitive workloads
- Regulatory requirements for private connectivity
- Hybrid cloud architectures
- Large-scale data migration

**Direct Connect Cost Optimization:**

1. Select the right port speed (start low, scale up)
2. Use Direct Connect Gateway for multi-region access
3. Share connections across accounts via Transit Gateway
4. Consider hosted virtual interfaces from partner providers
5. Monitor utilization and downgrade underutilized connections

### 7.8 VPC and Subnet Design for Cost

**Cost-Optimized VPC Design Principles:**

1. Minimize cross-AZ traffic: Co-locate services that communicate heavily within the same AZ.
2. Use VPC Endpoints: Interface endpoints ($0.01/hr + $0.01/GB) and Gateway endpoints (free) reduce NAT Gateway costs.
3. VPC Peering vs Transit Gateway: VPC peering is cheaper per connection but doesn't scale. TGW is better for many VPCs.
4. Shared services VPC: Centralize common services (NAT, proxies) in a shared VPC.
5. Egress-only Internet Gateway: Free for IPv6.
6. Flow Logs optimization: Sample flow logs, aggregate, and use cost-effective storage.

### 7.9 Data Egress Optimization Framework

**Egress Cost Reduction Decision Tree:**

Is the data leaving the cloud?
- YES -> Is it going to a user?
  - YES -> Use CDN, compress data, optimize content
  - NO -> Is it going to another cloud provider?
    - YES -> Use Direct Connect/Partner Interconnect
    - NO -> Is it going to on-prem?
      - YES -> Use Direct Connect or VPN
      - NO -> Investigate destination
- NO (internal traffic) ->
  - Same AZ? -> Free
  - Same region? -> Low cost
  - Cross region -> Consider architectural changes

**Egress Cost Tracking:**

Set up a monthly egress report:
Top 10 Egress Destinations:
1. Internet (users): 40 TB - $3,600
2. On-prem via DX: 20 TB - $200 (DX port)
3. Other cloud (GCP): 5 TB - $450
4. Partner API: 3 TB - $270
