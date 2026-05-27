

# Appendix H: Privacy Implementation Deep Dives

## H.1 Detailed Pseudonymization Implementation

### H.1.1 Tokenization Architecture

Tokenization replaces sensitive identifiers with randomly generated tokens, with the mapping stored securely. This is the most common pseudonymization approach for structured data.

**Tokenization Components**:
- **Token Vault**: Secure database storing identifier-to-token mappings. Encrypted at rest (AES-256-GCM). Access restricted to authorized services. Audit logging of all token generation and lookup operations.
- **Token Generator**: Produces cryptographically random tokens using CSPRNG. Tokens are format-preserving when required (e.g., preserving length and character set for compatibility).
- **Token Manager**: API for token generation, lookup, bulk operations, and token lifecycle management. Supports deterministic and randomized tokenization modes.
- **Resolvers**: Services that map tokens back to original values for authorized purposes. Require multi-factor authentication for high-sensitivity lookups.

**Tokenization Modes**:

| Mode | Description | Use Case | Reversibility | Deterministic |
|---|---|---|---|---|
| Random Token | Random string mapped to identifier | General PII tokenization | Yes (via mapping) | No |
| Format-Preserving | Token preserves original format | Legacy systems with format validation | Yes (via mapping) | No |
| Deterministic Token | Same input always produces same token | Cross-system data correlation | Yes (via mapping) | Yes |
| Hash-Based | One-way hash with salt | Analytics without re-identification | No | Yes (with same salt) |
| HMAC-Based | Keyed hash for controlled reversibility | Reversible only with key knowledge | Yes (with key) | Yes |

### H.1.2 k-Anonymity Implementation

k-Anonymity ensures each record is indistinguishable from at least k-1 other records in the dataset.

**Anatomy of k-Anonymity**:
- **Identifiers**: Direct identifiers removed or pseudonymized
- **Quasi-Identifiers (QIDs)**: Attributes that could identify when combined (ZIP, DOB, gender)
- **Sensitive Attributes**: Protected values (diagnosis, salary, religion)
- **k Parameter**: Minimum group size (higher k = more privacy, less utility)

**Generalization Techniques**:

| QID Type | Generalization Example |
|---|---|
| Age | 32 -> [30-35] |
| ZIP Code | 90210 -> 9021* or 902** |
| Date of Birth | 1990-05-15 -> 1990 or 1990s |
| Salary | $85,000 -> [$75k-$100k] |
| City | Beverly Hills -> Los Angeles County |

**Suppression Techniques**:
- Cell suppression: Replace outlier values with *
- Record suppression: Remove records that cannot be grouped (rate typically < 5%)
- Attribute suppression: Remove entire QID columns when needed

**l-Diversity Extension**: Each equivalence class must have at least l distinct values for each sensitive attribute. Prevents homogeneity attacks.

**t-Closeness Extension**: Distribution of sensitive attributes in each equivalence class must be close to overall distribution (within threshold t). Prevents skewness attacks.

## H.2 Detailed Differential Privacy Implementation

### H.2.1 DP-SGD for Machine Learning

Differentially Private Stochastic Gradient Descent (DP-SGD) trains ML models with mathematical privacy guarantees.

**DP-SGD Algorithm**:
1. Sample a mini-batch of training examples
2. Compute gradients for each example in the batch
3. Clip each gradient to have maximum L2 norm of C
4. Add Gaussian noise to the average gradient
5. Update model parameters with noised gradient
6. Track total privacy budget (epsilon) expended

**Key Parameters**:
- **Noise multiplier (sigma)**: Controls amount of noise. Higher = more privacy, less utility
- **Clipping threshold (C)**: Maximum gradient norm. Affects sensitivity
- **Learning rate (eta)**: Model optimization rate
- **Batch size**: Number of examples per gradient step
- **Number of epochs**: Total training iterations
- **Delta (delta)**: Probability of privacy failure. Typically 1/N^2

**Privacy Accounting**:
- Rényi Differential Privacy (RDP) accounting
- Moments Accountant (Abadi et al., 2016)
- Privacy loss distribution (PLD) accounting

### H.2.2 Local Differential Privacy

Local DP provides privacy at the data source before any collection, ensuring the data collector never sees raw data.

**Randomized Response**: For a binary question: answer truthfully with probability p, answer randomly with probability (1-p). Privacy: epsilon = ln(p / (1-p)). Utility: can estimate population statistics with bias correction.

**Unary Encoding**: For categorical data with d categories: encode as d-bit vector, perturb each bit independently with probability p.

## H.3 Detailed Consent Lifecycle Implementation

### H.3.1 Consent Event Model

Consent events are immutable records of every consent action. The event store provides a complete audit trail.

**Consent Event Types**: consent_granted, consent_withdrawn, consent_expired, consent_changed, consent_rejected, consent_renewed, consent_verified

**Event Record**: Each event stores event_id, subject_id, purpose_id, event_type, timestamp, and context (IP, user agent, device, consent version, method).

**Audit Trail**: The event store maintains an append-only log of all consent events. Events are never modified or deleted. Historical consent state is reconstructed by replaying events.

### H.3.2 Consent Propagation Architecture

When consent changes (granted, withdrawn, expired), the change must propagate to all systems that process data based on that consent.

**Propagation Strategies**:
- **Push**: Event bus sends consent changes to all subscribers, services update immediately
- **Pull**: Services poll consent store on each processing request
- **Hybrid**: Push for critical consent changes (withdrawal), pull for routine verification
- **Batch**: Batch export of consent changes for external third parties

**Propagation Verification**: Each subscriber must acknowledge receipt and confirm action taken. Unacknowledged subscribers are retried with exponential backoff. Failed propagation is escalated for manual intervention.

## H.4 Detailed Data Mapping Implementation

### H.4.1 Automated Data Flow Discovery

Data flow discovery automates the process of finding, documenting, and maintaining data flows across an organization's ecosystem.

**Discovery Methods**:
- Cloud provider API scanning (AWS, Azure, GCP resource enumeration)
- Network traffic analysis (VPC flow logs, service mesh telemetry)
- API gateway log analysis (endpoints, request/response schemas)
- Streaming platform inspection (Kafka topic schemas, Kinesis stream analysis)
- ETL job metadata extraction (Airflow DAG parsing, dbt model analysis)
- Database schema analysis (foreign key relationships, cross-database queries)
- Application code scanning (service-to-service call analysis)
- DNS and service discovery analysis (service registries)

**Challenges in Automated Discovery**:
- Data flows through third-party systems (uninstrumentable)
- Backend-to-backend communication (no API gateway mediation)
- Data exports (CSV, JSON dumps) not captured by network monitoring
- Manual data sharing (email, shared drives)
- Legacy systems without API governance

### H.4.2 Data Inventory Automation

A data inventory is a living document that must be continuously updated as the data landscape changes.

**Inventory Automation Components**:
- **Scanner Agents**: Deployed across infrastructure to discover data assets
- **Metadata Extractor**: Extracts schema, classification, and relationship information
- **Classification Engine**: Applies automated classification rules
- **Inventory Database**: Central repository of all data assets
- **Change Tracker**: Monitors for drift and changes
- **Reporting Engine**: Generates gap analysis and compliance reports

**Automated Inventory Maintenance**:
- Daily incremental scanning for new/changed assets
- Weekly full re-scan of high-sensitivity data stores
- Monthly full re-scan of all data assets
- Event-driven scanning triggered by infrastructure changes
- Classification accuracy sampling and validation

## H.5 Purpose Limitation Enforcement

Purpose limitation ensures data collected for one purpose is not used for another incompatible purpose.

### H.5.1 Purpose Tagging Architecture

Every data element should be tagged with its collection purpose at the point of ingestion:

```python
class PurposeTaggedRecord:
    def __init__(self, data: dict, purpose: str, consent_id: str = None):
        self.data = data
        self.purpose = purpose
        self.consent_id = consent_id
        self.collected_at = datetime.utcnow()
        self.purpose_hash = self._compute_purpose_hash()

    def _compute_purpose_hash(self):
        return hashlib.sha256(f"{self.purpose}:{self.consent_id}".encode()).hexdigest()[:16]
```

### H.5.2 Purpose Compatibility Assessment

When a new processing purpose is proposed for existing data, a purpose compatibility assessment must be conducted:

**Compatibility Criteria**:
- Is the new purpose closely related to the original purpose?
- What would the data subject reasonably expect?
- Is the new purpose compatible based on context of collection?
- What is the impact of the new purpose on data subjects?
- Are there additional safeguards that can be applied?

**Incompatible Purposes Require**:
- New consent from data subjects
- Or alternative legal basis (with notification)

## H.6 Privacy Engineering for AI/ML Systems

### H.6.1 Training Data Privacy Pipeline

```
[Raw Data Sources] -> [Consent Check] -> [Pseudonymization] -> [Feature Selection]
        |                  |                    |                     |
        v                  v                    v                     v
[Data Quality Check] <- [Bias Assessment] <- [Minimization] <- [Differential Privacy]
        |
        v
[Training Data Ready]
```

### H.6.2 ML Model Privacy Auditing

**Pre-Training Audit**:
- Training data consent verification
- Training data minimization review
- Sensitive feature identification and handling
- Bias assessment across protected groups
- Differential privacy configuration review

**Post-Training Audit**:
- Memorization testing (canary records, extraction attacks)
- Membership inference attack resistance testing
- Model explanation and interpretability verification
- Fairness testing across demographic groups
- Model card documentation review

**Ongoing Monitoring**:
- Privacy budget tracking (for DP models)
- Query monitoring for extraction attempts
- Drift detection (model behavior changes)
- Data subject opt-out tracking

### H.6.3 Right to Erasure and ML Models

When a data subject exercises right to erasure, their training data should be removed from the model:

**Approaches**:

1. **Retraining**: Remove subject's data from training set and retrain model. Gold standard but expensive.

2. **Model-Based Unlearning**: Remove subject's influence from trained model parameters. Research area with emerging techniques (SISA, delta weights).

3. **Filtering**: Apply inference-time filter to exclude subject's data from model outputs. Not true unlearning but practical.

4. **Representation Inversion**: Invert the subject's contribution to model weights. Computationally intensive.

# Appendix L: Privacy Engineering Scenarios and Solutions

## L.1 Scenario: Data Breach Through Misconfigured Cloud Storage

**Situation**: A development team creates an S3 bucket for storing customer uploads. The bucket is accidentally configured as publicly readable. Customer PII (names, addresses, photos) is exposed for 72 hours before discovery.

**Privacy Engineering Response**:

1. **Detection**: Cloud security monitoring alerts on public bucket configuration. DLP tool detects PII patterns in publicly accessible storage.

2. **Containment**: Immediately block public access to bucket. Revoke all public ACLs. Enable block public access at account level.

3. **Assessment**: 
   - What data was exposed? Customer names, addresses, profile photos, document uploads
   - How many subjects affected? 5,234 customers
   - Who accessed the data? Unknown public access, no logs available before detection
   - Duration of exposure? 72 hours

4. **Notification** (within 72 hours of awareness):
   - SA notification: Nature of incident, categories of data, approximate number of subjects, measures taken
   - Data subject notification: Nature of incident, what happened, what data was involved, what we are doing, what they should do (monitor accounts, change passwords, watch for phishing)

5. **Remediation**:
   - Apply block public access on all S3 buckets (organization-wide policy)
   - Implement S3 bucket policy verification in CI/CD (infrastructure-as-code scanning)
   - Add automated alerting for any public bucket configuration
   - Implement data classification tagging on S3 objects (prevent PII in unclassified buckets)
   - Training for all engineering teams on cloud storage security

6. **Lessons Learned**:
   - IaC scanning should catch public S3 configurations before deployment
   - DLP monitoring should detect PII exposure in real-time
   - Access logging should always be enabled on storage containing sensitive data
   - Principle of least privilege should apply to bucket policies (no public access by default)

## L.2 Scenario: Consent Withdrawal Not Propagating to Third Parties

**Situation**: A user withdraws consent for marketing emails through the company's preference center. The company stops sending emails, but the user continues receiving marketing emails from a third-party email service provider that was not notified of the withdrawal.

**Privacy Engineering Response**:

1. **Detection**: User complaint about continued marketing emails after withdrawal

2. **Assessment**:
   - Consent withdrawal processed in primary consent store
   - Marketing system correctly blocks emails
   - Third-party email service provider not notified (propagation gap)
   - 287 users affected over 45 days

3. **Containment**: Manually export withdrawal list to third-party provider. Add third-party to consent propagation list.

4. **Remediation**:
   - Implement consent propagation service with subscriber register
   - Add third-party email provider as consent subscriber
   - Implement consent change batch export for external providers
   - Add consent propagation verification (check third-party processing 24h after withdrawal)
   - Add monitoring for consent propagation failures

5. **Prevention**:
   - All third-party vendors added to consent propagation register during onboarding
   - DPA requires vendors to honor consent withdrawal within 24 hours
   - Consent propagation tested during vendor integration testing
   - Monthly consent propagation audit

## L.3 Scenario: Automated Decision-Making Without Human Review

**Situation**: A company deploys an AI-powered loan approval system. A data subject is denied a loan and requests human review. The company does not have a process for manual review of automated decisions.

**Privacy Engineering Response**:

1. **Detection**: Data subject complaint to DPO about inability to get human review

2. **Legal Requirements**:
   - GDPR Art 22: Right not to be subject to automated individual decision-making
   - Right to obtain human intervention, express views, contest decision
   - Controller must provide meaningful information about logic, significance, consequences

3. **Immediate Remediation**:
   - Implement manual review workflow within 48 hours
   - Train human reviewers on loan assessment criteria
   - Process pending review requests in queue

4. **System Remediation**:
   - Add human-in-the-loop requirement for all adverse decisions
   - Implement explanation generation (SHAP values, feature importance, counterfactuals)
   - Create tiered explanation interface (data subject, advisor, regulator)
   - Add bias monitoring dashboard
   - Update DPIA for automated decision-making system

5. **Ongoing**:
   - Quarterly fairness audit across protected groups
   - Annual algorithm review by independent auditor
   - Data subject explanation request SLA: 72 hours
   - Human review turnaround SLA: 30 days

## L.4 Scenario: Children's Data Collected Without Parental Consent

**Situation**: An educational app collects data from children under 13 without obtaining verifiable parental consent as required by COPPA and GDPR Article 8.

**Privacy Engineering Response**:

1. **Detection**: Internal privacy audit identifies gap in age verification and parental consent

2. **Assessment**:
   - 45,000 registered users under 13
   - Data collected: name, email, learning progress, behavior patterns
   - No age verification at registration (self-reported only)
   - No parental consent mechanism
   - Processing purposes: personalization, analytics, product improvement

3. **Containment**:
   - Disable personalization for all suspected under-13 accounts
   - Stop processing analytics data for under-13 accounts
   - Preserve data pending consent (do not delete yet - may need for consent process)

4. **Remediation**:
   - Implement neutral age gate (no deceptive age verification)
   - Implement parental consent workflow (email verification, credit card verification, ID check)
   - Create parent dashboard for managing child's data
   - Implement data minimization for children (no behavioral advertising, no third-party sharing)
   - Re-consent all under-13 accounts through parental consent process
   - Delete data for accounts where consent not obtained within 30 days

5. **Regulatory Notification**:
   - Self-report to FTC (COPPA violation) and relevant EU DPA
   - Document remediation plan and timeline
   - Cooperate with regulatory investigation

## L.5 Scenario: Cross-Border Transfer Without Adequate Safeguards

**Situation**: A company uses a US-based cloud provider for customer data processing. After Schrems II, the EU-US Privacy Shield is invalidated. The company has SCCs in place but no Transfer Impact Assessment (TIA) or supplementary measures.

**Privacy Engineering Response**:

1. **Detection**: Regulatory change (Schrems II ruling) requires reassessment of cross-border transfers

2. **Assessment**:
   - All customer data transferred to US-based cloud provider
   - SCCs in place but outdated (2010 version)
   - No TIA conducted
   - No supplementary measures
   - US surveillance laws potentially conflict with EU privacy protections

3. **Remediation**:
   - Update SCCs to 2021 EU SCCs (appropriate module)
   - Conduct TIA for US transfers
   - Implement supplementary measures:
     - Encryption of data at rest with keys held in EU
     - Pseudonymization before transfer (customer IDs tokenized)
     - Restrict US-based personnel access
     - Audit logging of all US-based access
   - Evaluate data localization options for sensitive data

4. **Ongoing**:
   - Annual TIA review
   - Monitor adequacy status (DPF developments)
   - Monitor US surveillance law changes (FISA reform)
   - Quarterly supplemental measures review

## L.6 Scenario: PII in Application Logs

**Situation**: A security audit reveals that application logs contain PII including email addresses, IP addresses, and in some cases, credit card numbers logged during payment debugging.

**Privacy Engineering Response**:

1. **Detection**: Security audit log review identifies PII in production logs

2. **Assessment**:
   - 6 months of logs containing PII
   - Email addresses in registration logs
   - IP addresses in all request logs
   - Credit card numbers in payment debug logs (4 instances)
   - Logs accessible to 50+ engineers
   - Logs retained for 12 months

3. **Containment**:
   - Rotate log files to restricted access storage
   - Restrict log access to essential personnel only
   - Identify and block PII logging at source

4. **Remediation**:
   - Implement PII detection at log generation point (log sanitization)
   - Configure logging frameworks to exclude PII fields
   - Implement structured logging with PII-sensitive fields excluded
   - Add PII scanning to CI/CD pipeline (regression prevention)
   - Rotate and sanitize existing log files

5. **Code Changes**:
   - Before: logger.info(f"User {email} registered at {ip}")
   - After: logger.info(f"User {hash(email)} registered", extra={"event": "registration"})

6. **Monitoring**:
   - PII scanning of all new logs (automated)
   - Alert on any PII pattern in log messages
   - Monthly log PII audit

## L.7 Scenario: Vendor Data Breach

**Situation**: A marketing analytics vendor used by the company suffers a data breach. The vendor processes customer behavioral data and email addresses.

**Privacy Engineering Response**:

1. **Detection**: Vendor notifies company of breach (per DPA requirement, within 48 hours)

2. **Assessment**:
   - Vendor affected: Marketing Analytics Inc.
   - Data involved: Customer email addresses, behavioral events, device IDs
   - Number affected: 120,000 customers (subset)
   - Root cause: Unpatched vulnerability in vendor's web application
   - Intrusion detected: Vendor's SOC detected unusual database queries

3. **Controller Obligations**:
   - Assess risk to data subjects (phishing risk due to email exposure)
   - Determine if SA notification required (yes, risk of harm)
   - Determine if data subject notification required (yes, medium risk)

4. **Notifications**:
   - SA notification within 72 hours of becoming aware (not when vendor notified - when company had sufficient information)
   - Data subject notification: What happened, what data involved, what we are doing, what they should do (watch for phishing, be cautious of unsolicited communications)

5. **Remediation**:
   - Revoke vendor's data access immediately
   - Demand vendor root cause analysis and remediation plan
   - Evaluate alternative vendors
   - Update vendor assessment process to include breach detection capabilities
   - Implement breach notification drill with critical vendors

6. **Prevention**:
   - Vendor security assessments include incident response capability
   - Contractual requirement for vendor breach notification within 24 hours (not 72)
   - Regular vendor security reviews
   - Data minimization with vendors (only share necessary data)

## L.8 Scenario: Data Subject Access Request for Complex System

**Situation**: A data subject submits an access request. The company has 40+ microservices, data in multiple databases, data warehouse, streaming platforms, and third-party systems. Manual discovery is impractical.

**Privacy Engineering Solution**:

1. **Automated DSR Discovery**:
   - Query data inventory for all systems containing subject's data category
   - Dispatch parallel queries to all systems (with timeout)
   - Collect and merge results
   - Deduplicate records across systems

2. **System Integration**:
   - Each system implements standardized DSR API
   - Systems that cannot implement API provide batch export
   - Legacy systems require manual query (documented exception)

3. **Response Compilation**:
   - Merge data from all systems into structured response
   - Redact third-party data
   - Apply format (JSON, CSV, or both as requested)
   - Generate response metadata (sources, completeness, exclusions)

4. **Quality Controls**:
   - Verify all systems responded (flag non-responders)
   - Verify data completeness (schema validation)
   - Verify data accuracy (sampling check)
   - Legal review for sensitive content

5. **Delivery**:
   - Encrypted download link (expires in 7 days)
   - Physical copy on request
   - Secure portal access

## L.9 Scenario: Data Retention Compliance at Scale

**Situation**: A company has accumulated petabytes of data across multiple systems with no retention enforcement. A regulatory audit requires evidence of retention compliance.

**Privacy Engineering Solution**:

1. **Discovery**:
   - Scan all data stores to identify data categories and ages
   - Classify data by type and applicable retention policy
   - Identify data past retention period

2. **Risk Assessment**:
   - 40% of data is past retention period
   - Some data retained for 10+ years (no business need)
   - Backup data includes records from terminated employees 5+ years ago
   - Legal hold records not identified (some data on hold may be deleted)

3. **Phased Remediation**:
   - Phase 1: Implement legal hold identification (tag records on hold)
   - Phase 2: Delete data past retention for low-sensitivity categories
   - Phase 3: Delete or anonymize medium-sensitivity data
   - Phase 4: Delete or anonymize high-sensitivity data (with enhanced verification)
   - Phase 5: Implement automated retention enforcement

4. **Technical Implementation**:
   - Database: Add TTL indexes, partition-by-date
   - Object Storage: Lifecycle policies (transition to archive, then delete)
   - Data Warehouse: Retention policies on tables, automated purge scripts
   - Backups: Shorten retention, selective restore for legal holds
   - Archives: Migration to cold storage with deletion schedule

5. **Verification**:
   - Post-deletion row counts
   - Sample queries to verify data removal
   - Automated reporting on retention compliance
   - Certificate of destruction for sensitive data

## L.10 Scenario: Privacy Engineering for Analytics Platform

**Situation**: A company wants to provide product analytics (dashboards, funnels, retention analysis) to internal teams without exposing individual user data.

**Privacy Engineering Solution**:

1. **Data Architecture**:
   - Raw event data: Access restricted, retention 30 days
   - Pseudonymized event data: Available for analytics, retention 24 months
   - Aggregated metrics: Available for dashboards, indefinite retention

2. **Pseudonymization Layer**:
   - User IDs tokenized at ingestion
   - IP addresses truncated to /24
   - Email addresses hashed
   - Device IDs pseudonymized with rotating salt

3. **Analytics Tool Configuration**:
   - Row-level data not available in dashboards (aggregated only)
   - Funnel analysis shows counts, not individual paths
   - Retention analysis shows percentages, not individual behavior
   - User-level queries restricted to authorized analysts (pseudonymized)
   - Export controls prevent raw data download

4. **Access Controls**:
   - Role-based access: Viewer (dashboard only), Analyst (pseudonymized queries), Admin (full access with audit)
   - Purpose limitation: Analytics only (no marketing use)
   - Query rate limiting: Prevent bulk extraction
   - Data export approval: Required for any raw data export

# Appendix M: Privacy Engineering Interview Questions

## M.1 Technical Questions

1. Explain the difference between pseudonymization and anonymization. When would you use each?

2. How would you implement consent withdrawal propagation across 50+ microservices?

3. Design a system for automated DSR fulfillment for a company with 200+ data stores.

4. How would you implement differential privacy for a reporting dashboard?

5. Describe the architecture for PII detection across structured and unstructured data.

6. How would you handle right to erasure for data stored in backups and cold storage?

7. Design a retention enforcement system for a data lake with petabytes of data.

8. How would you implement purpose limitation in a service mesh architecture?

9. Describe how to conduct a Transfer Impact Assessment for US cloud provider transfers.

10. How would you implement privacy-as-code in a CI/CD pipeline?

## M.2 Design Questions

1. Design a consent management system for a global e-commerce platform operating in EU, US, Brazil, and China.

2. Design a data mapping automation system for a company growing through acquisitions (20+ legacy systems).

3. Design a PIA/DPIA automation system integrated into the engineering workflow.

4. Design a privacy monitoring dashboard for the DPO with key metrics and alerts.

5. Design a pseudonymization service that can handle 100,000 events/second at ingestion.

## M.3 Scenario Questions

1. Your company receives a DSR access request. You discover data in 30 systems, 3 of which are legacy systems with no APIs. How do you fulfill the request within the regulatory timeline?

2. A data subject withdraws consent for marketing. Six weeks later, they receive a marketing email because a newly acquired subsidiary was not in the consent propagation system. How do you fix this?

3. Your company wants to use customer data for ML model training. The data was collected for service delivery (contractual necessity). What do you need to do?

4. A vendor suffers a data breach affecting your customers' data. Your DPA requires them to notify you within 48 hours, but they notify you after 7 days. What do you do?

5. Your company is acquired by a US company. EU customer data will now be accessible to US-based parent company personnel. What transfer mechanisms and safeguards do you need?

# Appendix N: Privacy Engineering Code Complete Implementations

## N.1 Complete Anonymization Library

```python
import hashlib
import base64
import re
from typing import List, Optional, Set
from datetime import datetime, timedelta

class Anonymizer:
    def __init__(self, salt: str = None):
        self.salt = salt or base64.b64encode(hashlib.sha256(str(datetime.utcnow()).encode()).digest()).decode()[:16]

    def hash_email(self, email: str) -> str:
        email = email.lower().strip()
        hashed = hashlib.sha256(f"{email}:{self.salt}".encode()).hexdigest()
        return f"{hashed[:16]}@anonymized.local"

    def hash_ip(self, ip: str) -> str:
        ip = ip.strip()
        if '.' in ip:
            parts = ip.split('.')
            return f"{parts[0]}.{parts[1]}.xxx.xxx"
        if ':' in ip:
            return hashlib.sha256(f"{ip}:{self.salt}".encode()).hexdigest()[:12]
        return "0.0.0.0"

    def mask_credit_card(self, cc: str) -> str:
        cleaned = re.sub(r'[\s-]', '', cc)
        if len(cleaned) >= 4:
            return f"xxxx-xxxx-xxxx-{cleaned[-4:]}"
        return "xxxx-xxxx-xxxx-xxxx"

    def mask_ssn(self, ssn: str) -> str:
        cleaned = re.sub(r'[\s-]', '', ssn)
        if len(cleaned) >= 4:
            return f"xxx-xx-{cleaned[-4:]}"
        return "xxx-xx-xxxx"

    def generalize_age(self, age: int) -> str:
        bins = [(0, 18), (18, 25), (25, 35), (35, 45), (45, 55), (55, 65), (65, 100)]
        for low, high in bins:
            if low <= age < high:
                return f"[{low}-{high})"
        return "[65+]"

    def generalize_zip(self, zip_code: str, digits: int = 3) -> str:
        return zip_code[:digits].ljust(5, 'x')

    def generalize_date(self, date_str: str, precision: str = "month") -> str:
        try:
            dt = datetime.fromisoformat(date_str)
            if precision == "year":
                return str(dt.year)
            elif precision == "month":
                return f"{dt.year}-{dt.month:02d}"
            else:
                return date_str
        except (ValueError, TypeError):
            return date_str

    def suppress(self, value: str) -> str:
        return "***SUPPRESSED***"

    def anonymize_record(self, record: dict, rules: dict) -> dict:
        result = record.copy()
        for field, rule in rules.items():
            if field in result and result[field] is not None:
                method = rule.get("method", "suppress")
                if method == "hash_email":
                    result[field] = self.hash_email(str(result[field]))
                elif method == "hash_ip":
                    result[field] = self.hash_ip(str(result[field]))
                elif method == "mask_credit_card":
                    result[field] = self.mask_credit_card(str(result[field]))
                elif method == "mask_ssn":
                    result[field] = self.mask_ssn(str(result[field]))
                elif method == "generalize_age":
                    result[field] = self.generalize_age(int(result[field]))
                elif method == "generalize_zip":
                    result[field] = self.generalize_zip(str(result[field]), rule.get("digits", 3))
                elif method == "generalize_date":
                    result[field] = self.generalize_date(str(result[field]), rule.get("precision", "month"))
                elif method == "suppress":
                    result[field] = self.suppress(str(result[field]))
        return result

    def anonymize_dataset(self, records: List[dict], rules: dict) -> List[dict]:
        return [self.anonymize_record(record, rules) for record in records]
```

## N.2 Complete Consent Management System

```python
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import uuid
import json
import hashlib

class ConsentManager:
    def __init__(self, store, event_bus, config=None):
        self.store = store
        self.event_bus = event_bus
        self.config = config or {
            "default_retention_days": 365,
            "propagation_timeout_hours": 24,
            "renewal_reminder_days": 30
        }

    def grant_consent(self, subject_id: str, purpose_id: str, 
                      context: dict = None) -> dict:
        consent_id = str(uuid.uuid4())
        consent = {
            "consent_id": consent_id,
            "subject_id": subject_id,
            "purpose_id": purpose_id,
            "status": "active",
            "granted_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=self.config["default_retention_days"])).isoformat(),
            "context": context or {},
            "evidence": {
                "consent_text": context.get("consent_text", ""),
                "purpose_text": context.get("purpose_text", ""),
                "version": context.get("version", "1.0"),
                "ip_address": context.get("ip_address", ""),
                "user_agent": context.get("user_agent", ""),
            }
        }
        self.store.save(f"consents/{consent_id}.json", json.dumps(consent))
        self.event_bus.publish("consent:granted", {
            "subject_id": subject_id,
            "purpose_id": purpose_id,
            "consent_id": consent_id,
            "timestamp": consent["granted_at"]
        })
        return consent

    def withdraw_consent(self, subject_id: str, purpose_id: str,
                         context: dict = None) -> dict:
        consent = self.find_active_consent(subject_id, purpose_id)
        if not consent:
            raise ConsentNotFoundError(f"No active consent for {subject_id} / {purpose_id}")
        consent["status"] = "withdrawn"
        consent["withdrawn_at"] = datetime.utcnow().isoformat()
        consent["withdrawal_context"] = context or {}
        self.store.save(f"consents/{consent['consent_id']}.json", json.dumps(consent))
        self.event_bus.publish("consent:withdrawn", {
            "subject_id": subject_id,
            "purpose_id": purpose_id,
            "consent_id": consent["consent_id"],
            "timestamp": consent["withdrawn_at"]
        })
        return consent

    def check_consent(self, subject_id: str, purpose_id: str) -> dict:
        consent = self.find_active_consent(subject_id, purpose_id)
        if not consent:
            return {"granted": False, "reason": "no_consent"}
        if consent["status"] != "active":
            return {"granted": False, "reason": f"status_{consent['status']}"}
        if consent["expires_at"] and consent["expires_at"] < datetime.utcnow().isoformat():
            return {"granted": False, "reason": "expired"}
        return {
            "granted": True,
            "consent_id": consent["consent_id"],
            "purpose": purpose_id,
            "expires_at": consent["expires_at"]
        }

    def find_active_consent(self, subject_id: str, purpose_id: str) -> Optional[dict]:
        consents = self.store.list("consents")
        for consent_id in consents:
            data = json.loads(self.store.read(f"consents/{consent_id}"))
            if data["subject_id"] == subject_id and data["purpose_id"] == purpose_id:
                return data
        return None

    def get_all_consents(self, subject_id: str) -> List[dict]:
        consents = []
        for consent_id in self.store.list("consents"):
            data = json.loads(self.store.read(f"consents/{consent_id}"))
            if data["subject_id"] == subject_id:
                consents.append(data)
        return consents

    def process_consent_change(self, event: dict):
        subject_id = event["subject_id"]
        purpose_id = event["purpose_id"]
        action = event.get("action", "")
        if action == "withdrawn":
            consent = self.find_active_consent(subject_id, purpose_id)
            if consent and consent["status"] == "active":
                self.withdraw_consent(subject_id, purpose_id, {"source": "external_event"})
```

## N.3 Complete DSR Fulfillment System

```python
from typing import List, Dict, Optional, Callable
from datetime import datetime
import asyncio
import uuid
import json

class DSRSystem:
    def __init__(self, identity_verifier, data_sources, response_builder, notification):
        self.identity_verifier = identity_verifier
        self.data_sources = data_sources
        self.response_builder = response_builder
        self.notification = notification
        self.requests = {}

    async def submit_request(self, subject_id: str, dsr_type: str, 
                            details: dict = None) -> dict:
        request_id = str(uuid.uuid4())
        request = {
            "request_id": request_id,
            "subject_id": subject_id,
            "dsr_type": dsr_type,
            "details": details or {},
            "status": "submitted",
            "submitted_at": datetime.utcnow().isoformat(),
            "verification_status": "pending",
            "results": {},
            "errors": []
        }
        self.requests[request_id] = request
        verification = await self.identity_verifier.verify(subject_id, dsr_type)
        request["verification_status"] = verification["status"]
        if verification["status"] == "verified":
            await self._fulfill(request)
        else:
            request["status"] = "verification_failed"
        return request

    async def _fulfill(self, request: dict):
        request["status"] = "in_progress"
        try:
            if request["dsr_type"] in ("access", "portability"):
                result = await self._collect_data(request)
                request["results"] = self.response_builder.build(result, request["dsr_type"])
            elif request["dsr_type"] == "erasure":
                request["results"] = await self._execute_erasure(request)
            elif request["dsr_type"] == "rectification":
                request["results"] = await self._execute_rectification(request)
            elif request["dsr_type"] in ("restriction", "objection"):
                request["results"] = await self._execute_restriction(request)
            request["status"] = "completed"
            request["completed_at"] = datetime.utcnow().isoformat()
            await self.notification.send(request["subject_id"], {
                "type": "dsr_completed",
                "request_id": request["request_id"],
                "dsr_type": request["dsr_type"],
                "status": "completed"
            })
        except Exception as e:
            request["status"] = "failed"
            request["errors"].append({"phase": "fulfillment", "error": str(e)})

    async def _collect_data(self, request: dict) -> Dict:
        tasks = []
        for source in self.data_sources:
            if source.supports_request_type(request["dsr_type"]):
                tasks.append(source.query(request["subject_id"]))
        results = await asyncio.gather(*tasks, return_exceptions=True)
        collected = {}
        for i, source in enumerate(self.data_sources):
            if source.supports_request_type(request["dsr_type"]):
                if isinstance(results[i], Exception):
                    request["errors"].append({
                        "source": source.name,
                        "error": str(results[i]),
                        "action": "query"
                    })
                else:
                    collected[source.name] = results[i]
        return collected

    async def _execute_erasure(self, request: dict) -> Dict:
        results = {}
        for source in self.data_sources:
            if source.supports_request_type("erasure"):
                try:
                    deletion = source.delete(request["subject_id"])
                    results[source.name] = {
                        "status": "deleted",
                        "records_affected": deletion
                    }
                except Exception as e:
                    results[source.name] = {
                        "status": "error",
                        "error": str(e)
                    }
                    request["errors"].append({
                        "source": source.name,
                        "error": str(e),
                        "action": "delete"
                    })
        return results

    async def _execute_rectification(self, request: dict) -> Dict:
        results = {}
        corrections = request["details"].get("corrections", {})
        for source in self.data_sources:
            if source.supports_request_type("rectification"):
                try:
                    source.update(request["subject_id"], corrections)
                    results[source.name] = {"status": "updated", "fields": list(corrections.keys())}
                except Exception as e:
                    results[source.name] = {"status": "error", "error": str(e)}
        return results

    async def _execute_restriction(self, request: dict) -> Dict:
        results = {}
        for source in self.data_sources:
            if source.supports_request_type(request["dsr_type"]):
                try:
                    source.restrict(
                        request["subject_id"],
                        request["dsr_type"] == "objection"
                    )
                    results[source.name] = {"status": "restricted"}
                except Exception as e:
                    results[source.name] = {"status": "error", "error": str(e)}
        return results

    def get_status(self, request_id: str) -> Optional[dict]:
        return self.requests.get(request_id)
