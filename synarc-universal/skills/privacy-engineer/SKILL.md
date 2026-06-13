---
name: privacy-engineer
description: P0 — INTELLIGENCE AUGMENTATION
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# P1: Persona � The Privacy Engineer

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

## 1.1 Role Definition

The Privacy Engineer is a specialized engineering role responsible for embedding privacy controls, safeguards, and accountability mechanisms into software systems, data platforms, and engineering workflows. This role bridges legal/compliance requirements and technical implementation, ensuring that privacy is not an afterthought but a first-class engineering constraint.

### 1.1.1 Primary Responsibilities

- Design and implement privacy controls across data pipelines, services, and products
- Conduct and automate Privacy Impact Assessments (PIA/DPIA) for engineering initiatives
- Build and maintain data classification frameworks, inventories, and mapping artifacts
- Implement consent management infrastructure, DSR fulfillment systems, and preference stores
- Engineer pseudonymization, anonymization, and differential privacy mechanisms into data platforms
- Develop PII detection and classification pipelines using pattern matching, ML, and heuristic approaches
- Establish data retention and secure deletion schedules enforceable at the storage layer
- Manage cross-border data transfer compliance through technical controls and transfer mechanisms
- Partner with legal, security, data engineering, and product teams on privacy-by-design initiatives
- Build privacy-as-code tooling, automated testing, and continuous monitoring for privacy controls
- Respond to privacy incidents by coordinating technical containment, forensic analysis, and notification
- Assess vendor and third-party data processing arrangements from a privacy engineering perspective

### 1.1.2 Key Skills and Competencies

| Competency | Description | Proficiency Required |
|---|---|---|
| Privacy-by-Design | Ability to embed privacy principles into system architecture, SDLC, and engineering practices | Advanced |
| Data Protection Law | Working knowledge of GDPR, CCPA/CPRA, LGPD, PIPL, HIPAA, and emerging US state laws | Intermediate |
| Data Engineering | Proficiency with data pipelines, ETL/ELT, data lakes, warehouses, streaming platforms | Advanced |
| Cryptography | Understanding of encryption, hashing, tokenization, pseudonymization, and anonymization techniques | Intermediate |
| ML/AI Privacy | Knowledge of differential privacy, federated learning, model memorization, and inference attacks | Intermediate |
| Risk Assessment | Ability to conduct PIA/DPIAs, risk scoring, mitigation planning, and control evaluation | Advanced |
| Consent Infrastructure | Experience with consent management platforms, preference stores, and CMP architectures | Intermediate |
| DSR Automation | Building automated workflows for access, deletion, portability, rectification, and objection | Advanced |
| Cross-Border Transfers | Understanding of SCCs, BCRs, adequacy decisions, and TIA methodology | Intermediate |
| Regulatory Mapping | Ability to map data flows and controls to multi-jurisdictional regulatory requirements | Intermediate |
| Incident Response | Privacy breach detection, containment, forensic collection, notification timelines | Intermediate |
| Vendor Assessment | Evaluating DPIAs for vendors, reviewing DPAs, managing subprocessor risks | Intermediate |
| Privacy Automation | Building privacy-as-code pipelines, automated controls testing, and continuous monitoring | Advanced |

### 1.1.3 Typical Work Products

- Data classification schemas and classification engine implementations
- Data flow diagrams and data inventory registers
- PIA/DPIA reports with risk scores, mitigation plans, and sign-off documentation
- Consent management platform configurations, consent receipts, and preference stores
- DSR automation workflows, dashboards, and fulfillment tracking systems
- Pseudonymization and anonymization libraries, configurations, and pipeline integrations
- PII detection engines, classification models, and scanning pipeline configurations
- Retention schedule configurations, deletion job definitions, and audit trails
- Cross-border transfer impact assessments and transfer mechanism documentation
- Privacy incident response runbooks, playbooks, and post-incident remediation plans
- Vendor privacy assessment reports and data processing agreement templates
- Privacy-as-code CI/CD pipeline configurations, automated tests, and monitoring dashboards

### 1.1.4 Organizational Placement

The Privacy Engineer typically sits within:

- **Engineering organization**: Embedded in platform engineering, data engineering, or infrastructure teams
- **Privacy/DPO office**: Matrixed reporting to the Data Protection Officer or Privacy Lead
- **Security organization**: Co-located with security engineers but focused on privacy-specific controls
- **Compliance organization**: Working alongside compliance analysts but with engineering execution focus

In mature organizations, Privacy Engineering is a dedicated function with its own reporting structure, charter, and budget. In earlier-stage organizations, the role is often combined with Security Engineering or Data Engineering responsibilities.

### 1.1.5 Collaboration Matrix

| Stakeholder | Collaboration Focus | Artifacts Shared |
|---|---|---|
| Legal / DPO | Regulatory interpretation, PIA sign-off, breach notification, consent requirements | PIA reports, DSR metrics, incident reports, regulatory mappings |
| Security Engineering | Encryption standards, access controls, incident response, vulnerability management | Data classification, retention policies, breach response playbooks |
| Data Engineering | Data pipeline privacy controls, pseudonymization, retention enforcement | Data flow diagrams, pseudonymization configs, deletion jobs |
| Product Management | Privacy-by-design requirements, consent flows, DSR UX, privacy UX | Privacy requirements, consent flow specs, DSR interfaces |
| ML Engineering | Training data privacy, model audit, differential privacy, federated learning | Privacy budgets, model cards, training data inventories |
| Vendor Management | Third-party privacy assessments, DPA reviews, subprocessor audits | Vendor PIAs, DPA redlines, subprocessor registers |
| Cloud Platform | Data residency, cross-border transfer, infrastructure-level controls | Data location maps, transfer mechanisms, infrastructure PIAs |
| Audit | Control evidence, testing, continuous monitoring | Control documentation, test results, monitoring dashboards |

### 1.1.6 Career Progression

- **Junior Privacy Engineer**: Implements privacy controls under supervision, runs PII scanning, maintains documentation
- **Privacy Engineer**: Independently designs and implements privacy solutions, conducts PIAs, manages DSR workflows
- **Senior Privacy Engineer**: Architect-level ownership of privacy platforms, cross-team strategy, mentoring, advanced privacy techniques
- **Lead / Staff Privacy Engineer**: Organization-wide privacy engineering strategy, standards definition, tooling roadmap, regulatory influence
- **Principal / Distinguished Privacy Engineer**: Industry thought leadership, novel privacy technique development, standards body participation, policy influence


# P2: Privacy-by-Design Philosophy

## 2.1 Foundational Principles

Privacy-by-Design is a framework developed by Dr. Ann Cavoukian, former Information and Privacy Commissioner of Ontario, Canada. It consists of seven foundational principles that should guide all privacy engineering work. These principles are not aspirational statements but actionable engineering constraints.

### 2.1.1 Proactive Not Reactive; Preventative Not Remedial

The privacy engineer must anticipate privacy-invasive events before they occur and design systems to prevent them. This means:

- Conduct privacy threat modeling during system design, not after deployment
- Embed privacy controls into architecture decisions, not as bolt-on afterthoughts
- Build automated privacy checks into CI/CD pipelines to catch violations before release
- Implement privacy regression tests that run with every build
- Design failure modes that default to privacy-preserving outcomes
- Use privacy-enhancing technologies (PETs) by default rather than by exception

Implementation pattern: Privacy requirements are captured as acceptance criteria in user stories. Each story has a "Privacy Acceptance" checklist that must pass before the story is considered done. This mirrors security acceptance criteria but focuses on data minimization, consent, purpose limitation, retention, and subject rights.

### 2.1.2 Privacy as the Default Setting

Systems should be configured to protect privacy automatically, without requiring individual action. This means:

- Opt-in consent models rather than opt-out for data processing activities
- Minimal data collection by default - only collect what is strictly necessary for the specified purpose
- Privacy-preserving defaults in all configuration, UI, and API settings
- No data enrichment or sharing without explicit, granular consent
- Data retention periods default to the minimum necessary duration
- Pseudonymization applied by default at the point of data ingestion
- Telemetry and analytics data collected only with affirmative consent

Implementation pattern: Configuration management systems initialize all privacy-sensitive settings to their most restrictive values. Any relaxation of privacy defaults requires documented exception, risk acceptance, and multi-party approval (product, legal, engineering).

### 2.1.3 Privacy Embedded into Design

Privacy is not an add-on but a core component of the system architecture. This means:

- Privacy requirements are part of system architecture documents, not separate privacy policies
- Data flow diagrams explicitly label PII, consent boundaries, and transfer points
- API contracts include consent tokens, purpose IDs, and retention hints
- Database schemas include consent status, retention dates, and classification labels
- Service meshes and API gateways enforce privacy controls (e.g., PII stripping, consent verification)
- Data lake/warehouse schemas enforce classification column tags and retention expiration

Implementation pattern: Privacy is a first-class architectural concern in the same way as security, availability, and scalability. Architecture Decision Records (ADRs) must include a privacy implications section. Any architecture review board checklist includes privacy review as a mandatory gate.

### 2.1.4 Full Functionality - Positive-Sum, Not Zero-Sum

Privacy should not come at the expense of functionality, and functionality should not come at the expense of privacy. This means:

- Avoiding false trade-offs between privacy and product features
- Innovating to find solutions that achieve both privacy and utility
- Using PETs that enable data analysis without exposing PII
- Designing consent models that allow personalization without surveillance
- Building privacy-preserving analytics that still provide actionable business insights
- Leveraging differential privacy, federated learning, and secure multi-party computation

Implementation pattern: When a product requirement conflicts with privacy, the privacy engineer does not simply say "no" but collaborates to find an alternative approach. The default question is: "How can we achieve the business objective while preserving privacy?" rather than "Which do we prioritize?"

### 2.1.5 End-to-End Security - Full Lifecycle Protection

Privacy requires security throughout the entire data lifecycle, from collection through destruction. This means:

- Encryption at rest and in transit for all PII and sensitive data
- Access controls based on least privilege, need-to-know, and purpose limitation
- Audit logging for all PII access, modification, and deletion events
- Secure key management with hardware security modules or cloud KMS
- Data integrity controls to prevent unauthorized modification
- Secure deletion mechanisms that render data irrecoverable
- Anomaly detection for unusual access patterns to PII

Implementation pattern: Data classification labels drive security controls. High-sensitivity data is subject to stronger controls (field-level encryption, column-level access control, mandatory audit logging). Medium-sensitivity data is subject to standard controls (encryption at rest, row-level security). Low-sensitivity data requires basic controls.

### 2.1.6 Visibility and Transparency - Keep It Open

All data processing activities should be visible, transparent, and accountable. This means:

- Maintaining a publicly visible record of processing activities (ROPA)
- Providing clear, concise privacy notices at the point of data collection
- Building dashboards that show data subjects what data is held about them
- Implementing real-time consent preference tracking and display
- Exposing data processing purposes, legal bases, and retention periods in machine-readable formats
- Publishing transparency reports on data access requests, breaches, and government requests
- Making privacy engineering artifacts (PIAs, DPIAs, data inventories) available to regulators on demand

Implementation pattern: A privacy transparency portal provides data subjects with a self-service view of their data, consent preferences, processing activities, and DSR submission capabilities. This portal is backed by APIs that query the data inventory, consent store, and data lineage systems in real-time.

### 2.1.7 Respect for User Privacy - Keep It User-Centric

Privacy engineering must prioritize the interests and rights of the data subject. This means:

- Designing intuitive, accessible privacy controls that empower rather than confuse users
- Making DSR fulfillment simple, fast, and free of charge
- Providing granular consent options that respect user autonomy
- Avoiding dark patterns that manipulate users into sharing more data
- Supporting accessibility standards in privacy interfaces
- Responding to privacy inquiries and complaints promptly and substantively
- Designing for vulnerable populations with enhanced protections

Implementation pattern: All user-facing privacy interfaces undergo usability testing. Dark pattern audits are conducted quarterly using established frameworks. Consent flows use plain language at appropriate reading levels.

## 2.2 Privacy Engineering Mindset

### 2.2.1 Data Minimization as a Design Constraint

Every data element collected is a liability. The privacy engineer treats data collection like resource allocation in an embedded system - every byte must be justified. Questions to ask:

- Is this data element strictly necessary for the specified purpose?
- Can the purpose be achieved with anonymized or aggregated data instead?
- Can we collect this data at a later stage when it is actually needed?
- Can we compute derived insights without retaining raw data?
- Is there a less privacy-invasive way to achieve the same outcome?

### 2.2.2 Purpose Limitation as an Architectural Principle

Data collected for one purpose must not be repurposed without fresh consent or a compatible legal basis. This requires:

- Tagging data with purpose identifiers at the point of collection
- Purpose-aware access controls that limit data use to authorized purposes
- Separating data stores by purpose to prevent function creep
- Monitoring data access patterns for purpose violations
- Auditing data usage against consented purposes regularly

### 2.2.3 Accountability Over Compliance

The privacy engineer does not aim for checkbox compliance but for demonstrable accountability. This means:

- Maintaining evidence of privacy decisions, not just privacy policies
- Documenting the rationale for data collection, purpose, and retention choices
- Demonstrating that controls are effective, not just that they exist
- Building audit trails that show privacy controls operated correctly over time
- Preparing for regulatory inspection proactively, not reactively

### 2.2.4 Privacy Risk as a Product Risk

Privacy failures are product failures. They erode user trust, attract regulatory penalties, and damage brand value. The privacy engineer treats privacy risk with the same rigor as security risk, availability risk, quality risk, and legal risk.

### 2.2.5 Continuous Improvement

The privacy landscape evolves constantly - new regulations, new technologies, new attack vectors, new user expectations. The privacy engineer maintains a learning posture through:

- Monitoring regulatory developments and updating controls accordingly
- Participating in privacy engineering communities and standards bodies
- Conducting periodic privacy control reviews and improvement cycles
- Learning from privacy incidents and near-misses
- Investing in privacy research and emerging PETs


# P3: Data Classification Framework

## 3.1 Classification Rationale

Data classification is the foundational privacy control. Without knowing what data you have, where it resides, and how sensitive it is, you cannot apply appropriate privacy controls. Classification provides the basis for:

- Determining which privacy controls apply to which data assets
- Scoping PIAs, DPIAs, and data protection audits
- Configuring automated PII detection and scanning tools
- Defining retention and deletion schedules
- Applying differential access controls and encryption
- Managing cross-border transfer restrictions
- Responding to data subject requests efficiently
- Demonstrating accountability to regulators

## 3.2 Classification Taxonomy

### 3.2.1 Personally Identifiable Information (PII)

**Definition**: Any information that can be used to identify a natural person, either directly or indirectly when combined with other information.

**Classification Level**: Sensitive

**Direct Identifiers** (can identify a person directly):
- Full name (first and last name combination)
- Government-issued ID numbers (passport, driver's license, national ID, SSN, SIN)
- Email address (personal or work with name context)
- Phone number (mobile, landline)
- Biometric data (fingerprints, facial recognition templates, iris scans, voice prints)
- Medical record numbers, health insurance IDs
- Financial account numbers (bank accounts, credit cards combined with holder name)
- Digital identity (cryptographic keys, digital certificates tied to identity)
- IP address (when combined with other data that reveals identity)
- Device IDs (IMEI, IMSI, MAC address in personal context)

**Indirect Identifiers** (can identify when combined):
- Date of birth
- Postal address, zip code with demographic context
- Gender
- Occupation and employer
- Educational history
- Marital status, family composition
- Photographs and video footage
- Voice recordings
- User account names, online handles (when linked to real identity)
- Location history, GPS coordinates
- Purchase history (when linkable to an individual)

**Handling Requirements**:
- Encrypted at rest using AES-256 or equivalent
- Encrypted in transit using TLS 1.3
- Access restricted to authorized personnel with legitimate business need
- Pseudonymized in analytics and development environments
- Retention minimized to purpose-appropriate duration
- Audit logged for all access and modification events
- Consent required for collection and processing
- DSR-accessible (subject can request access, correction, deletion)

### 3.2.2 Sensitive Personal Information (SPI)

**Definition**: PII that reveals sensitive characteristics or could lead to discrimination, harm, or stigmatization if disclosed. Often subject to enhanced regulatory protections.

**Classification Level**: Highly Sensitive

**Categories of SPI**:
- Racial or ethnic origin
- Political opinions
- Religious or philosophical beliefs
- Trade union membership
- Genetic data
- Biometric data used for identification purposes
- Health data (physical and mental health conditions, medical history)
- Sex life or sexual orientation
- Criminal convictions and offenses
- Precise geolocation data (GPS coordinates, cell tower triangulation)
- Children's data (under 13 under COPPA, under 16 under GDPR)
- Financial hardship information
- Immigration status

**Handling Requirements** (in addition to PII requirements):
- Explicit consent required for processing (not just consent - explicit, specific, and unambiguous)
- Mandatory DPIA before processing
- Enhanced encryption (field-level encryption recommended)
- Strict purpose limitation (cannot be repurposed without fresh explicit consent)
- Access limited to minimum necessary personnel
- Separate storage from other data categories where feasible
- Shorter retention periods (default to minimum necessary)
- DSR fulfillment priority (respond within shortened timelines where applicable)
- Breach notification with enhanced regulatory scrutiny
- Prohibition on automated decision-making with legal effects unless specific exceptions apply

### 3.2.3 Protected Health Information (PHI)

**Definition**: Individually identifiable health information held or transmitted by covered entities or business associates under HIPAA.

**Classification Level**: Highly Sensitive

**PHI Categories**:
- Medical history and records
- Health insurance information
- Treatment information and plans
- Payment and billing records
- Lab results and diagnostic reports
- Prescription records
- Genetic test results
- Mental health records
- Substance abuse treatment records
- HIV/AIDS status
- Reproductive health information
- Clinical trial data (when linkable to individual)
- Medical device data (pacemaker readings, insulin pump data)

**Handling Requirements**:
- All PII handling requirements apply
- HIPAA Privacy Rule minimum necessary standard
- HIPAA Security Rule administrative, physical, and technical safeguards
- Business Associate Agreements (BAAs) required with all vendors
- Patient authorization required for non-treatment, non-payment, non-operations uses
- Accounting of disclosures maintained for 6 years
- Breach notification within 60 days under HIPAA
- De-identification according to HIPAA Safe Harbor or Expert Determination methods
- Limited Data Set with data use agreement for research

### 3.2.4 Financial Data

**Definition**: Information relating to an individual's financial status, transactions, accounts, or financial history.

**Classification Level**: Sensitive to Highly Sensitive depending on context

**Financial Data Categories**:
- Credit card numbers (PAN)
- Bank account numbers
- Income and salary information
- Credit scores and reports
- Transaction history
- Investment portfolio details
- Tax returns and financial statements
- Loan and mortgage information
- Bankruptcy records
- Debt collection information
- Insurance policy details
- Payment history and default records

**Handling Requirements**:
- PCI DSS compliance for payment card data
- Field-level encryption for account numbers
- Tokenization for payment processing where possible
- Strict access controls with separation of duties
- Transaction monitoring for fraud and unauthorized access
- Retention according to regulatory requirements (e.g., 5-7 years for tax records)
- Secure deletion with certificate of destruction
- Consent for data sharing with third parties
- Right to access and portability under applicable regulations

### 3.2.5 Pseudonymized Data

**Definition**: Data from which direct identifiers have been replaced with pseudonyms or tokens, but which can still be re-linked to the individual with additional information held separately.

**Classification Level**: Sensitive (re-identification risk remains)

**Handling Requirements**:
- Pseudonymization mapping stored with equivalent security to the original PII
- Mapping accessible only to authorized personnel
- Pseudonymization techniques documented and auditable
- Re-identification policy established (when, by whom, under what circumstances)
- Privacy controls appropriate to original sensitivity level
- Considered PII under GDPR (pseudonymized data is still personal data)

### 3.2.6 Anonymized Data

**Definition**: Data from which identifiers have been removed or altered such that re-identification is not reasonably possible. True anonymization is irreversible.

**Classification Level**: Low Sensitivity (if properly anonymized)

**Anonymization Criteria**:
- Single-out test: Cannot isolate an individual from the dataset
- Linkability test: Cannot link records relating to the same individual across datasets
- Inference test: Cannot infer information about an individual with reasonable confidence
- Re-identification risk assessment: Risk below organization's threshold (typically <5% for most contexts)
- Motivation and capability of potential attackers considered in risk assessment

**Handling Requirements**:
- Anonymization process documented and validated
- Re-identification risk assessment conducted and reviewed annually
- No attempt to re-identify without explicit policy and justification
- Considered not personal data under GDPR if properly anonymized
- Deletion of original identifiers verified
- Anonymization method peer-reviewed

### 3.2.7 Aggregated Data

**Definition**: Statistical summaries or grouped data that cannot be traced back to individuals.

**Classification Level**: Low Sensitivity

**Handling Requirements**:
- Aggregation method must prevent residual identification
- Minimum group sizes established (typically n >= 5 or n >= 10)
- Cell suppression for small cells
- Differential privacy noise injection for highly sensitive aggregations
- Documentation of aggregation methodology
- Periodic review for re-identification risk

## 3.3 Classification Criteria Matrix

| Data Type | Classification | Encryption Standard | Access Control | Retention Default | Breach Notification | Consent Required |
|---|---|---|---|---|---|---|
| Direct Identifiers | Sensitive | AES-256, TLS 1.3 | Role-based, Least Privilege | 30 days after purpose | Yes (72h GDPR) | Yes (explicit) |
| SPI | Highly Sensitive | Field-level AES-256 | Need-to-know, Separation | 90 days after purpose | Yes (enhanced) | Yes (explicit) |
| PHI | Highly Sensitive | Field-level AES-256 | Minimum Necessary, BAA | 6 years (HIPAA) | Yes (60d HIPAA) | Yes (HIPAA auth) |
| Financial (PAN) | Highly Sensitive | AES-256 + Tokenization | Separation of Duties | 13-37 months (PCI) | Yes | Yes |
| Financial (non-PAN) | Sensitive | AES-256, TLS 1.3 | Role-based | 5-7 years (tax) | Yes | Yes |
| Pseudonymized | Sensitive | AES-256 for mapping | Mapping access limited | Same as original | Yes | Original consent |
| Anonymized | Low | Standard at rest | Standard | No limit | No | No |
| Aggregated | Low | Standard at rest | Standard | No limit | No | No |

## 3.4 Classification Methodology

### 3.4.1 Automated Classification

Automated classification uses rules, patterns, and ML models to classify data at rest and in motion:

**Pattern-Based Classification**:
- Regex patterns (SSN: \d{3}-\d{2}-\d{4}, Email: [\w.-]+@[\w.-]+\.\w+)
- Credit card Luhn algorithm validation
- Known format matching (phone numbers, postal codes, dates)
- Document fingerprinting (standard forms containing PII fields)
- File type and metadata analysis
- Column header and field name matching ("ssn", "email", "dob", "phone")

**ML-Based Classification**:
- Named Entity Recognition (NER) for names, locations, organizations
- Text classification for document sensitivity
- Image analysis for embedded text (OCR + NER)
- Unstructured data classification using transformer models
- Anomaly detection for misclassified or unclassified data
- Active learning for false positive reduction

**Contextual Classification**:
- Data lineage analysis (classification inherited from source)
- Data environment (production vs. development vs. testing)
- Data purpose and processing context
- User role and access pattern analysis
- Data sensitivity based on combination with other data

### 3.4.2 Manual Classification

For data that cannot be reliably classified automatically:

- Data owner classification (person closest to the data assigns classification)
- Data steward review and validation
- Privacy engineer audit sampling
- Legal review for borderline cases
- User-reported classification (allow data subjects to flag sensitive content)

### 3.4.3 Classification Workflow

1. **Data discovery**: Identify and inventory all data assets across the organization
2. **Preliminary classification**: Apply automated classification rules
3. **Validation**: Manual review of automated classifications with sampling
4. **Adjudication**: Resolution of conflicting or unclear classifications
5. **Labeling**: Apply classification labels to data assets
6. **Enforcement**: Classification-driven controls activated
7. **Monitoring**: Ongoing classification accuracy monitoring and reclassification triggers

## 3.5 Classification Implementation

### 3.5.1 Data Labeling Standards

Labels should be machine-readable and persistent:

**Database Columns**: Column comments, tags, or extended properties containing classification metadata
**Files**: Metadata headers, filenames with classification prefix, sidecar .metadata files
**API Payloads**: JSON schema extensions, OpenAPI extensions, header annotations
**Data Lakes/Warehouses**: Column-level tags, schemas with classification attributes
**Object Storage**: S3/GCS/Azure Blob tags, storage class policies
**Log Events**: Structured logging with classification field
**Streaming Events**: Avro/Protobuf/JSON schema with classification field

Example labeling schema:

`json
{
  "classification": "sensitive",
  "category": "pii",
  "subcategory": "direct_identifier",
  "identifier_type": "email",
  "jurisdiction": "gdpr",
  "retention_days": 90,
  "consent_required": true,
  "pseudonymization_required": true,
  "encryption_standard": "AES-256-GCM"
}
`

### 3.5.2 Classification Enforcement Points

| Enforcement Point | Action |
|---|---|
| Data Ingestion API | Validate classification header, reject unclassified data |
| Database Write | Check column classification, apply column-level encryption |
| Query Engine | Include classification in query audit log, apply access filters |
| Data Export | Flag classified data in export manifest, apply redaction rules |
| Data Display | Mask or truncate PII in UI based on classification |
| ETL Pipeline | Route data based on classification to appropriate storage |
| ML Training | Exclude high-sensitivity data or apply differential privacy |
| Data Sharing | Require classification review before external sharing |

## 3.6 Classification Review and Maintenance

### 3.6.1 Periodic Review Schedule

- **Quarterly**: Automated re-scanning of all data stores for classification accuracy
- **Semi-annual**: Manual review of classification rules and patterns
- **Annual**: Full classification framework review with legal/compliance
- **Event-driven**: Reclassification triggered by regulatory changes, new data types, mergers, new products

### 3.6.2 Reclassification Triggers

- New regulation or regulatory guidance affecting data categories
- New product or feature introducing novel data types
- Merger or acquisition introducing new data assets
- Data breach or privacy incident revealing classification gaps
- Changes in data use or processing purposes
- Identified classification errors during audit

## 3.7 Classification Governance

### 3.7.1 Roles and Responsibilities

- **Data Owners**: Assign and maintain classification for their data assets
- **Data Stewards**: Review automated classifications, resolve disputes
- **Privacy Engineer**: Build and maintain classification systems, audit compliance
- **DPO**: Approve classification framework, review escalation cases
- **Data Engineering**: Enforce classification at pipeline and storage level
- **Legal/Compliance**: Determine regulatory classification requirements


# P4: Data Mapping and Inventory

## 4.1 Data Mapping Fundamentals

Data mapping is the practice of identifying, documenting, and visualizing how personal data flows through an organization. It answers the fundamental questions: what data, where does it come from, where does it go, who processes it, why do they process it, and how long is it kept.

### 4.1.1 Why Data Mapping Matters

- **Regulatory requirement**: GDPR Article 30 requires maintenance of Records of Processing Activities (ROPA)
- **DSR fulfillment**: Without data maps, you cannot locate all instances of a data subject's data
- **PIA/DPIA prerequisite**: You cannot assess privacy risks without knowing data flows
- **Breach response**: Data maps accelerate containment and notification by showing where breached data resides
- **Cross-border transfer**: Data maps show which data crosses borders and through which mechanisms
- **Consent management**: Data maps link data collection points to consent mechanisms
- **Vendor management**: Data maps show which third parties process data and for what purposes
- **Data minimization**: Data maps reveal unnecessary data collection and duplication

## 4.2 Data Mapping Methodology

### 4.2.1 Data Discovery Phase

**Objective**: Identify all personal data assets across the organization

**Activities**:
- Automated scanning of databases, data lakes, data warehouses, and file storage
- API inventory and endpoint analysis for data collection points
- Code repository scanning for PII handling patterns
- Network traffic analysis for data flows between services
- Queue and stream inspection (Kafka, Kinesis, RabbitMQ, SQS)
- Cloud service enumeration (S3 buckets, RDS instances, DynamoDB tables)
- SaaS application integration analysis (Salesforce, Zendesk, Marketo, etc.)
- Data pipeline and ETL job analysis
- Backup and archive location identification
- Third-party data sharing arrangement review

**Output**: Comprehensive data asset inventory with metadata

### 4.2.2 Data Flow Mapping Phase

**Objective**: Map how data moves between systems, services, and organizations

**Activities**:
- Service-to-service communication mapping
- API integration diagram creation
- ETL/ELT pipeline flow documentation
- Data replication and synchronization mapping
- Data export and sharing process documentation
- Third-party data flow identification
- Cross-border transfer point identification
- Data transformation and enrichment point documentation
- Data deletion and archival path mapping

**Output**: Data flow diagrams (DFDs) at system, organization, and ecosystem levels

### 4.2.3 Processing Activity Documentation Phase

**Objective**: Document each processing activity with required metadata

**For each processing activity, document**:
- Processing activity name and identifier
- Controller/processor information
- Categories of data subjects
- Categories of personal data processed
- Categories of recipients
- Processing purposes and legal bases
- Retention periods and deletion mechanisms
- Technical and organizational security measures
- Cross-border transfer details (countries, mechanisms)
- Consent or authorization basis
- Automated decision-making details
- DSR process applicable to this activity

## 4.3 Data Inventory Structure

### 4.3.1 Data Element Registry

A data element is the atomic unit of the data inventory:

| Field | Description | Example |
|---|---|---|
| Data Element ID | Unique identifier | DE-001234 |
| Name | Human-readable name | Customer Email Address |
| Description | Detailed description | Primary email address used for account communication |
| Data Category | Classification category | PII - Direct Identifier |
| Sensitivity Level | Classification level | Sensitive |
| Format | Data format | Email (RFC 5322) |
| Collection Point | Where data enters the system | User Registration Form |
| Collection Purpose | Why data is collected | Account creation and verification |
| Legal Basis | Lawful basis for processing | Consent |
| Consent ID | Associated consent purpose | consent_purpose_account |
| Retention Period | How long data is kept | 90 days after account closure |
| Deletion Mechanism | How data is deleted | Hard delete from users table |
| Encryption Standard | Encryption applied | AES-256-GCM at rest, TLS 1.3 in transit |
| Pseudonymization | Pseudonymization status | Tokenized at ingestion point |
| Access Control | Access restriction | Role: user_support, purpose: account_management |
| Data Owner | Responsible party | Product: Identity Team |
| Data Steward | Day-to-day steward | John Smith |
| Jurisdiction | Applicable regulation | GDPR, CCPA |
| Cross-Border | Countries data is stored in | US, EU, Singapore |
| Last Reviewed | Last review date | 2026-05-01 |

### 4.3.2 System Inventory

| Field | Description | Example |
|---|---|---|
| System ID | Unique identifier | SYS-0042 |
| System Name | System name | Customer Account Service |
| System Type | Type of system | Microservice (Go, PostgreSQL) |
| Data Elements | Associated data elements | DE-001234, DE-001235, DE-001236 |
| Data Subjects | Categories of data subjects | Customers, Customer Representatives |
| Processing Purposes | Business purposes | Account Management, Authentication, Notification |
| Legal Bases | Lawful bases | Consent, Contractual Necessity |
| Data Flows Inbound | Sources of data | Registration API, Admin Panel |
| Data Flows Outbound | Destinations of data | Notification Service, Analytics Pipeline |
| Third Parties | Data recipients external to org | SendGrid (email delivery) |
| Cross-Border Transfers | Countries data is sent to/from | US, Ireland, Singapore |
| Dependencies | Upstream/downstream dependencies | Identity Provider, Payment Service |
| Custodian | Engineering team responsible | Identity Squad |

### 4.3.3 Processing Activity Register (Article 30)

The GDPR Article 30 ROPA template:

**For Controllers**:
1. Name and contact details of the controller and DPO
2. Purposes of the processing
3. Description of categories of data subjects and personal data
4. Categories of recipients
5. Cross-border transfer details (third country, safeguards)
6. Retention periods for different categories of data
7. General description of technical and organizational security measures

**For Processors**:
1. Name and contact details of the processor, each controller, and DPO
2. Categories of processing carried out on behalf of each controller
3. Cross-border transfer details
4. General description of technical and organizational security measures

## 4.4 Data Flow Diagrams

### 4.4.1 DFD Notation Standards

Data flow diagrams should follow consistent notation:

**External Entity**: Rectangle - Data subject, third party, regulator
**Process**: Circle or rounded rectangle - Service, function, pipeline stage
**Data Store**: Open-ended rectangle (two parallel lines) - Database, file store, cache
**Data Flow**: Arrow with label - Direction of data movement
**Trust Boundary**: Dashed line - Boundary between trust zones (e.g., internet vs. internal)
**PII Annotation**: Red highlight on data flows containing PII
**Consent Annotation**: Blue marker on flows where consent applies
**Transfer Annotation**: Dotted red cross-border indicator

### 4.4.2 DFD Levels

**Context Diagram (Level 0)**: Single process representing the system, external entities, and major data flows. Shows the system boundary.

**Level 1 DFD**: Major processes within the system, data stores, and external entities. Shows main data flows and identifies PII touchpoints.

**Level 2 DFD**: Detailed breakdown of high-risk processes. Shows subprocesses, intermediate data stores, transformation steps.

**Level N DFD**: Further decomposition as needed for complex, high-risk processing.

### 4.4.3 DFD Annotation Requirements

Each PII data flow should be annotated with:
- Flow ID and name
- Data elements included
- Classification level
- Consent model applying to this flow
- Purpose limitation tags
- Transfer mechanism (if cross-border)
- Encryption status
- Retention period
- DSR applicability

## 4.5 Data Lineage

Data lineage tracks the complete lifecycle of data elements from origin through transformations to final disposition.

### 4.5.1 Lineage Granularity Levels

- **System-level lineage**: Data moves between systems (high-level)
- **Table-level lineage**: Data moves between tables/datasets
- **Column-level lineage**: Specific fields traced through transformations
- **Row-level lineage**: Individual records traced through systems
- **Field-level lineage**: Individual data element transformations documented

### 4.5.2 Lineage Documentation Formats

- **Directed Acyclic Graphs (DAGs)**: Visual representation of data flow paths
- **Provenance metadata**: Embedded metadata recording data origin and transformations
- **Data catalog integration**: Lineage linked to data catalog entries
- **OpenLineage standard**: Open standard for data lineage collection
- **Marquez, Atlan, DataHub**: Data lineage platforms

## 4.6 Automated Data Mapping

### 4.6.1 Data Discovery Tools

Tools for automated data discovery should scan:
- Database schemas across all environments
- Cloud storage (S3, GCS, Azure Blob, ADLS)
- Data warehouse/lake schemas (Snowflake, Redshift, BigQuery, Databricks)
- Streaming platforms (Kafka topics, Kinesis streams)
- File shares and collaboration platforms
- Email and communication systems (with appropriate access controls)
- Backup systems and disaster recovery replicas

### 4.6.2 Flow Discovery

Automated flow discovery techniques:
- Service mesh traffic analysis (Istio, Linkerd, Consul)
- API gateway logs (Kong, Apigee, AWS API Gateway)
- DNS query analysis for service discovery
- Cloud network flow logs (VPC Flow Logs, VPC Traffic Mirroring)
- Application-level tracing (Jaeger, Zipkin, OpenTelemetry)
- ETL job metadata extraction (Airflow, dbt, Glue, Dataflow)
- Message queue inspection (Kafka MirrorMaker, topic routing)

### 4.6.3 Mapping Automation Pipeline

1. **Scan**: Automated discovery agents scan infrastructure
2. **Extract**: Metadata extracted and normalized
3. **Classify**: Automated classification applied to discovered assets
4. **Map**: Flow relationships inferred from traffic and configuration
5. **Validate**: Data stewards review automated mappings
6. **Publish**: Data maps published to central inventory
7. **Monitor**: Continuous monitoring for drift from mapped state

## 4.7 Data Map Maintenance

### 4.7.1 Drift Detection

Data maps become outdated as systems evolve. Drift detection mechanisms:
- Infrastructure-as-code changes trigger data map review
- CI/CD pipeline includes data map validation step
- Network flow changes automatically flagged for review
- New API endpoints require data map update
- Cloud resource changes detected and mapped
- Periodic full re-scanning of environment

### 4.7.2 Data Map Governance

- **Data map owner**: Engineering team responsible for data map accuracy
- **Review cadence**: Quarterly full review, monthly spot checks
- **Change control**: Data map changes tracked and versioned
- **Access control**: Data map access restricted to authorized personnel
- **Audit trail**: All data map changes logged with who and why
- **Certification**: Data owners certify data map accuracy annually


# P5: Consent Management

## 5.1 Consent Fundamentals

Consent is one of the lawful bases for processing personal data under GDPR (Article 6), and a key requirement under CCPA/CPRA (opt-out for sale/share, opt-in for minors), LGPD, PIPL, and other regulations. Consent must be freely given, specific, informed, and unambiguous.

### 5.1.1 Valid Consent Criteria

**Freely Given**:
- No coercion, pressure, or power imbalance
- No bundling with service terms (cannot condition service on unnecessary consent)
- Genuine choice with ability to refuse without detriment
- Separate consent for separate processing purposes
- No default pre-ticked checkboxes
- Withdrawal as easy as giving consent

**Specific**:
- Granular consent for each processing purpose
- Not blanket consent for all processing
- Purpose-specific consent requests
- Cannot use consent for multiple purposes under one consent action

**Informed**:
- Identity of controller clearly disclosed
- Each processing purpose clearly explained
- What data will be collected for each purpose
- Retention periods for each purpose
- Who will receive the data (categories of recipients)
- Cross-border transfer information
- Right to withdraw at any time
- Consequences of withdrawal
- DSR rights information

**Unambiguous**:
- Clear affirmative action required
- No silence, pre-ticked boxes, or inactivity
- Statement or clear affirmative action
- Readily distinguishable from other matters
- Plain language, understandable to average user

## 5.2 Consent Collection Architecture

### 5.2.1 Consent Collection Patterns

**Explicit Consent** (for SPI, automated decisions, cross-border transfers):
- Unambiguous, specific, informed indication of wishes
- Statement or clear affirmative action
- Recorded and stored for proof
- Required for: SPI processing, automated individual decision-making, cross-border transfers without adequacy

**Standard Consent** (for general PII processing):
- May be implied from clear affirmative action
- Must meet all valid consent criteria
- Appropriate for: Email marketing, analytics, personalization

**Opt-Out Consent** (CCPA/CPRA model):
- Data collection happens by default
- Data subject can opt out of sale/sharing
- Must be easy to exercise (Do Not Sell link)
- Special rules for minors (13-15 opt-in required)

### 5.2.2 Consent Collection Points

| Touchpoint | Method | Context |
|---|---|---|
| Registration/Account Creation | Checkboxes + granular options | Multi-purpose consent collection |
| First Visit (non-authenticated) | Cookie consent banner | Marketing/analytics tracking consent |
| Feature Activation | Contextual consent prompt | Purpose-specific consent at point of use |
| Sensitive Data Collection | Explicit consent with details | SPI collection requires enhanced consent |
| Data Sharing Request | Consent flow for third-party sharing | Specific sharing purpose |
| Cross-Border Transfer | Consent mechanism for transfer | SCC/BCR with consent as alternative |
| Application Settings | Privacy dashboard with toggles | Ongoing consent management |

### 5.2.3 Consent UX Requirements

- **Equivalent prominence**: Consent request must be as prominent as any other request
- **No dark patterns**: No confusing language, hidden options, or coercive design
- **Plain language**: Appropriate reading level for target audience
- **Granularity**: Separate controls for distinct processing purposes
- **Revocability**: Withdrawal interface as easy as consent interface
- **Accessibility**: WCAG 2.1 AA compliance for all consent interfaces
- **Multi-language**: Consent in all languages relevant to data subjects
- **Layered notices**: Short notice at collection point, full notice available

## 5.3 Consent Data Model

### 5.3.1 Consent Purpose Registry

`json
{
  "purpose_id": "purpose_marketing_email",
  "name": "Email Marketing",
  "description": "Send promotional emails about products and services",
  "category": "marketing",
  "legal_basis": "consent",
  "consent_type": "explicit",
  "data_elements": ["email", "name", "preferences"],
  "retention_days": 365,
  "renewal_period_days": 365,
  "third_party_sharing": false
}
`

### 5.3.2 Consent Record Schema

`json
{
  "consent_id": "cns-20260527-a1b2c3d4",
  "subject_id": "usr-001234",
  "purpose_id": "purpose_marketing_email",
  "status": "active",
  "collection_timestamp": "2026-05-27T10:30:00Z",
  "collection_context": {
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "device_id": "dev-5678",
    "location": "US",
    "consent_version": "v2.1"
  },
  "expiry_timestamp": "2027-05-27T10:30:00Z",
  "withdrawal_timestamp": null,
  "evidence": {
    "consent_receipt_id": "rcpt-9876",
    "recorded_consent_text": "I agree to receive marketing emails",
    "recorded_purpose_text": "We will send you promotional offers and product updates",
    "recorded_data_elements": ["Email address", "Name", "Preference selections"],
    "collection_method": "checkbox_interaction"
  },
  "history": [
    {
      "timestamp": "2026-05-27T10:30:00Z",
      "action": "granted",
      "channel": "registration_form"
    }
  ]
}
`

### 5.3.3 Consent Preference Store

The consent preference store is the authoritative repository for all consent records:

**Preference store requirements**:
- Immutable audit log of consent actions (grant, change, withdraw)
- Real-time read capability for consent decisions
- High availability (consent check is in critical path for data processing)
- Low-latency consent verification (< 10ms P99)
- Purpose enumeration (ability to query all consents for a subject)
- Bulk operations support (for mass withdrawal scenarios)
- Consent record TTL management (expiry-based retention)
- Backup and disaster recovery (consent records are critical evidence)

## 5.4 Consent Lifecycle

### 5.4.1 Consent Lifecycle States

`
[Requested] -> [Granted] -> [Active]
                                    |
                                    v
                              [Expired] -> [Archived]
                                    |
                                    v
                             [Withdrawn] -> [Archived]
                                    |
                                    v
                              [Rejected]
`

- **Requested**: Consent requested, awaiting action
- **Granted**: Consent given and recorded, actively honored
- **Active**: Currently valid and enforced consent
- **Expired**: Consent reached its expiration, automatically revoked
- **Withdrawn**: Data subject actively withdrew consent
- **Rejected**: Data subject declined consent
- **Archived**: Historical record retained for evidence (no longer enforceable)

### 5.4.2 Consent Expiry and Renewal

- Consent should not be indefinite. Set appropriate expiration periods:
  - Marketing consents: 6-12 months, annual renewal
  - Analytics consents: 12-24 months, renewal at expiry
  - Essential consents: Duration of relationship, no renewal needed
  - SPI consents: Short duration based on processing purpose
- Renewal process should be frictionless but not automatic
- Expired consents must be treated as withdrawn (no further processing)

### 5.4.3 Consent Withdrawal

- Withdrawal must be as easy as giving consent
- Withdrawal does not affect lawfulness of processing before withdrawal
- Systems must stop processing within defined SLA (e.g., 48 hours)
- Withdrawal must propagate through all systems and third parties
- Consent withdrawal history must be retained (audit trail)

## 5.5 Consent Enforcement

### 5.5.1 Consent Check Integration

Consent must be checked before any processing activity that depends on it:

`python
def process_for_marketing(user_id, campaign_id):
    # Consent check
    consent = consent_store.get(user_id, purpose="marketing_email")
    if not consent or consent.status != "active":
        raise ConsentNotGrantedError(
            user_id=user_id,
            purpose="marketing_email",
            action="skip",
            timestamp=now()
        )
    # Proceed with processing
    ...
`

### 5.5.2 Consent Propagation

Consent decisions must propagate across:
- Internal databases and data warehouses
- Data pipelines and ETL processes
- Analytics and reporting systems
- ML training pipelines
- Third-party data processors
- Subprocessors

**Propagation mechanisms**:
- Consent store API (query by subject + purpose)
- Consent event bus (push consent changes to subscribers)
- Consent file (batch consent export for third parties)
- Consent header in API requests (passed along data flow)

### 5.5.3 Consent Audit Trail

All consent interactions must be logged:
- Consent grant (who, what, when, where, context)
- Consent change (what changed, when, reason)
- Consent withdrawal (who, what, when, channel)
- Consent check (system, purpose, subject, result)
- Consent expiration (auto-revocation event)
- Consent renewal (re-consent action)

## 5.6 Consent Management Platforms

### 5.6.1 CMP Evaluation Criteria

| Criterion | Description |
|---|---|
| Purpose Management | Ability to define, version, and manage consent purposes |
| Granularity | Multiple levels of consent granularity |
| Geolocation Detection | Auto-detection of subject location for regulation-specific flows |
| Preference Storage | Immutable, auditable consent record storage |
| Consent APIs | REST/gRPC APIs for consent check and management |
| TCF Compliance | IAB Transparency & Consent Framework support |
| Multi-language | Interface and notice localization |
| Accessibility | WCAG compliance for consent interfaces |
| Withdrawal Support | Easy withdrawal mechanisms |
| Audit Logging | Complete audit trail of consent actions |
| Third-Party Integration | Consent signals to SSPs, DSPs, ad servers |
| Consent Analytics | Reporting on consent rates, patterns, trends |


# P6: Data Subject Rights (DSR)

## 6.1 DSR Framework

Data Subject Rights are the core mechanism by which individuals maintain control over their personal data. The privacy engineer must build systems that enable timely, accurate, and complete fulfillment of these rights.

### 6.1.1 DSR Inventory

| Right | Regulation | SLA | Fee | Format |
|---|---|---|---|---|
| Right to Access | GDPR Art 15, CCPA, LGPD Art 19, PIPL Art 45 | 30 days (GDPR), 45 days (CCPA) | Free (1st copy) | Structured, machine-readable |
| Right to Rectification | GDPR Art 16, CCPA, LGPD Art 18, PIPL Art 46 | 30 days | Free | Confirmation + update |
| Right to Erasure | GDPR Art 17, CCPA, LGPD Art 18, PIPL Art 47 | 30 days | Free | Confirmation of deletion |
| Right to Restrict Processing | GDPR Art 18, LGPD Art 18 | 30 days | Free | Processing halted |
| Right to Data Portability | GDPR Art 20, CCPA, LGPD Art 18, PIPL Art 45 | 30 days | Free | CSV, JSON, XML |
| Right to Object | GDPR Art 21, LGPD Art 18 | 30 days | Free | Processing stopped |
| Right to Not Be Subject to ADM | GDPR Art 22, LGPD Art 20 | 30 days | Free | Manual review |
| Right to Opt-Out of Sale | CCPA, CPRA | 15 days | Free | Processing ceased |
| Right to Non-Discrimination | CCPA, CPRA | N/A | N/A | Equal service/price |

### 6.1.2 DSR Fulfillment Pipeline

1. **Request Intake**: Capture DSR through available channels (web form, email, phone, mail)
2. **Identity Verification**: Verify requestor identity (multi-factor for sensitive rights)
3. **Request Validation**: Validate request completeness, detect abuse, confirm rights applicability
4. **Request Routing**: Dispatch to relevant data owners and systems
5. **Data Discovery**: Locate all data subject data across systems (using data inventory)
6. **Data Collection**: Gather data from all sources
7. **Data Processing**: Transform, filter, compile as needed for the specific right
8. **Review**: Legal/compliance review of response content (redact third-party data)
9. **Delivery**: Provide response to data subject through appropriate channel
10. **Fulfillment Logging**: Record fulfillment details for audit trail

## 6.2 Right to Access

### 6.2.1 Scope of Access Request

Data subject is entitled to:
- Confirmation of whether personal data is being processed
- Access to the personal data (copy of data)
- Information about processing:
  - Processing purposes
  - Categories of personal data
  - Recipients or categories of recipients
  - Retention periods (or criteria for determining them)
  - Right to rectification, erasure, restriction, objection
  - Right to lodge complaint with supervisory authority
  - Source of data (if not collected from subject)
  - Automated decision-making logic and significance
  - Cross-border transfer safeguards

### 6.2.2 Access Response Format

Response should be:
- Provided in a commonly used electronic format (CSV, JSON, XML)
- Structured and machine-readable for portability
- Comprehensive across all systems
- Free of charge for first copy
- Delivered within regulatory timeline
- Redacted to protect third-party rights

## 6.3 Right to Erasure (Right to be Forgotten)

### 6.3.1 Erasure Triggers

- Data is no longer necessary for original purpose
- Consent is withdrawn and no other legal basis exists
- Data subject objects and no overriding legitimate grounds
- Data was unlawfully processed
- Erasure required by legal obligation
- Data collected in relation to child (GDPR Art 8 consent)

### 6.3.2 Erasure Exceptions

- Exercise of freedom of expression and information
- Legal obligation requiring processing
- Public health reasons
- Archiving for public interest, research, statistical purposes
- Establishment, exercise, or defense of legal claims

### 6.3.3 Technical Erasure Implementation

**Hard Deletion**: Records permanently removed from databases
- DELETE FROM table WHERE user_id = ?
- Physical page cleanup, space reclamation
- Index rebuild after mass deletion
- Cascading deletes through related tables

**Soft Deletion with Retention**: Flagged for deletion, removed after retention
- UPDATE SET deleted_at = NOW(), deleted_by = 'dsr-request'
- Background job purges after 30-day grace period
- Enforced through application-level filters

**Secure Deletion**: Data irrecoverably destroyed
- Overwrite with random data before deletion
- Cryptographic erasure (destroy encryption keys)
- Storage-level secure delete (SSD TRIM, HDD overwrite)
- Certificate of destruction generated

**Anonymization**: Data transformed to unidentifiable form
- Replace identifiers with anonymized placeholders
- Aggregation to level where re-identification impossible
- Verified through re-identification risk assessment

## 6.4 Right to Data Portability

### 6.4.1 Portability Scope

- Data provided by the data subject (not inferred or derived data)
- Data processed by automated means (not paper records)
- Data processed on basis of consent or contract (not legitimate interest or legal obligation)

### 6.4.2 Portability Format Requirements

- Structured, commonly used, machine-readable format
- XML, JSON, CSV with clear schema
- Self-describing (schema/documentation included)
- Interoperable with other systems
- Support for direct transmission between controllers where technically feasible

### 6.4.3 Portability API Design

Establish standardized API for data export:

`json
GET /api/v2/subjects/{id}/export
Accept: application/json
{
  "subject_id": "usr-001234",
  "export_format": "json",
  "include": ["profile", "transactions", "communications", "preferences"],
  "direct_transfer": {
    "target_controller": "controller_id",
    "target_api": "https://target.com/api/import",
    "auth_token": "encrypted_token"
  }
}
`

Response:
`json
{
  "export_id": "exp-5678",
  "subject_id": "usr-001234",
  "generated_at": "2026-05-27T10:30:00Z",
  "expires_at": "2026-06-26T10:30:00Z",
  "format": "application/json",
  "size_bytes": 245678,
  "data": {
    "profile": { ... },
    "transactions": [ ... ],
    "communications": [ ... ],
    "preferences": { ... }
  }
}
`

## 6.5 Right to Rectification

### 6.5.1 Rectification Process

1. Subject identifies inaccurate data
2. Subject provides corrected data and evidence of inaccuracy
3. Controller validates correction (may require evidence)
4. Systems updated (primary record and all copies)
5. Notifications sent to all recipients of inaccurate data
6. Confirmation provided to data subject

### 6.5.2 Technical Implementation

- Update API for profile data
- Batch correction for historical records
- Cascading updates through data pipelines
- Correction propagation to third parties
- Audit trail of changes (before/after)

## 6.6 Right to Restrict Processing

### 6.6.1 Restriction Triggers

- Subject contests data accuracy (pending verification)
- Processing is unlawful, subject opposes erasure
- Data needed for legal claims (by subject or by controller)
- Subject objected to processing (pending verification of legitimate grounds)

### 6.6.2 Restriction Implementation

- Data flagged as restricted in all systems
- Processing blocked at access control layer
- Only storage permitted (no use, no transformation)
- Restriction cleared when condition resolved
- Subject notified when restriction lifted

## 6.7 DSR Automation

### 6.7.1 Automated DSR System Components

**Request Intake Module**:
- Web-based portal for DSR submission
- Email parsing and classification
- API endpoint for third-party DSR tools
- Identity verification integration
- Abuse detection and rate limiting

**Orchestration Engine**:
- DSR routing to appropriate data sources
- Parallel data collection from multiple systems
- Progress tracking and status reporting
- SLA monitoring and escalation
- Multi-stage approval workflows

**Data Collection Module**:
- Query data inventory for relevant systems
- Generate targeted queries for each data source
- Collect data in standardized format
- Handle large-volume responses (pagination, streaming)
- Timeout and retry handling

**Response Generation Module**:
- Compile collected data into response format
- Apply redaction rules (third-party data, legal privilege)
- Generate reports and export files
- Encrypt and secure delivery
- Track delivery confirmation

## 6.8 DSR Metrics and Reporting

### 6.8.1 Key Metrics

| Metric | Target |
|---|---|
| Request fulfillment rate | > 98% within SLA |
| Average fulfillment time | < 10 days |
| Identity verification success rate | > 95% |
| First-contact resolution | > 80% |
| Data completeness | > 99% of systems queried |
| Error rate | < 1% |
| Subject satisfaction | > 4/5 |

### 6.8.2 Regulatory Reporting

- Quarterly DSR statistics for DPO/Board
- Annual transparency report on DSRs
- Regulatory response templates for DSR audits
- Trend analysis (increasing rights, common request types)

# P7: Privacy Impact Assessment (PIA/DPIA)

## 7.1 PIA vs DPIA

PIA is a broader privacy risk assessment; DPIA is a specific GDPR requirement for high-risk processing. In practice, organizations often use a unified methodology.

| Aspect | PIA | DPIA |
|---|---|---|
| Scope | Any new project, system, process, or initiative involving personal data | Processing likely to result in high risk to data subjects |
| Legal Requirement | Best practice, required under some regulations (PIPEDA, LGPD) | Mandatory under GDPR Art 35 |
| Threshold | Broad - any privacy risk, even low | High risk only |
| Output | PIA Report | DPIA Report |
| Consultation | Internal stakeholders | DPO, and SA consultation if high risk remains |
| Timing | Early in project lifecycle (design phase) | Before processing begins |
| Review Frequency | Periodic, triggered by changes | At least annually, triggered by risk changes |

## 7.2 DPIA Triggers

Processing that requires a DPIA under GDPR Article 35 includes:

- Systematic and extensive profiling with significant effects on individuals
- Large-scale processing of special categories of data (SPI, criminal convictions)
- Systematic monitoring of publicly accessible areas on a large scale
- Cross-linking of datasets from multiple sources
- Processing of vulnerable persons' data (children, employees, patients)
- Innovative technologies (IoT, AI, biometrics, blockchain)
- Data processing preventing data subjects from exercising rights
- Large-scale processing of location data
- Processing of biometric data for identification
- Processing of genetic data

## 7.3 DPIA Methodology

### 7.3.1 Step 1: Identify Need for DPIA

**Screening Questions**:
1. Does the processing involve systematic evaluation of personal aspects (profiling)?
2. Does the processing involve special categories of data or criminal data?
3. Does the processing involve systematic monitoring of publicly accessible areas?
4. Does the processing involve vulnerable data subjects?
5. Does the processing involve innovative technologies?
6. Does the processing involve cross-linking of datasets?
7. Does the processing prevent data subjects from exercising rights?
8. Does the processing involve large-scale processing of any personal data?
9. Does the processing involve cross-border transfers without adequacy?
10. Does the processing involve automated decision-making with legal effects?

**Scoring**: If any answer is "Yes", a DPIA is recommended. Multiple "Yes" answers indicate mandatory DPIA.

### 7.3.2 Step 2: Describe Processing

Document the processing systematically:

**Processing Overview**:
- Name and purpose of processing activity
- System name and version
- Controller information (name, DPO contact)
- Data processor information (if applicable)

**Data Flow Description**:
- Nature of processing (collection, recording, organization, structuring, storage, adaptation, retrieval, consultation, use, disclosure, dissemination, alignment, combination, restriction, erasure, destruction)
- Scope of processing (what data, from whom, how much, frequency)
- Context of processing (relationship with data subjects, expectations, source)
- Purposes of processing (specific, explicit, legitimate)
- Data elements collected and their classification
- Data subjects affected (customers, employees, patients, children)
- Data recipients (internal departments, third parties, countries)
- Data retention schedule

### 7.3.3 Step 3: Necessity and Proportionality Assessment

For each data element and processing activity, assess:

**Necessity**:
- Is the processing necessary for the stated purpose?
- Can the purpose be achieved without processing this data?
- Is there a less intrusive means to achieve the same purpose?
- Is the processing the minimum necessary for the purpose?

**Proportionality**:
- Is the processing proportionate to the benefit?
- Is the impact on data subjects balanced against the benefit?
- Could the processing cause harm or distress to data subjects?
- Are there safeguards in place to protect data subjects' interests?

### 7.3.4 Step 4: Risk Assessment

Risk = Likelihood � Impact

**Likelihood Scoring**:
1 - Remote (no known incidents, strong controls)
2 - Unlikely (rare in industry, controls present)
3 - Possible (known to occur, controls in place but gaps)
4 - Likely (common, weak controls)
5 - Almost certain (expected, no effective controls)

**Impact Scoring**:
1 - Negligible (no or minimal effect on individuals)
2 - Minor (annoyance, inconvenience)
3 - Moderate (material disadvantage, distress)
4 - Major (significant harm, financial loss, discrimination)
5 - Severe (long-term harm, fundamental rights violation)

**Risk Matrix**:

| Likelihood \ Impact | 1 Negligible | 2 Minor | 3 Moderate | 4 Major | 5 Severe |
|---|---|---|---|---|---|
| 5 Almost Certain | Medium | High | High | Critical | Critical |
| 4 Likely | Medium | Medium | High | High | Critical |
| 3 Possible | Low | Medium | Medium | High | High |
| 2 Unlikely | Low | Low | Medium | Medium | High |
| 1 Remote | Low | Low | Low | Medium | Medium |

**Risk Treatment**:
- **Critical**: Processing must not proceed without SA consultation and explicit authorization
- **High**: Processing must have robust mitigation before proceeding
- **Medium**: Processing may proceed with documented mitigation measures
- **Low**: Processing may proceed with standard privacy controls

### 7.3.5 Step 5: Mitigation Measures

For each identified risk, document:
- Risk ID and description
- Current controls in place
- Proposed additional controls
- Residual risk level after mitigation
- Implementation owner and timeline
- Monitoring and review mechanism

**Types of Mitigation**:
- Technical: Encryption, pseudonymization, access controls, audit logging, anonymization, differential privacy
- Organizational: Policies, procedures, training, awareness, accountability structures
- Contractual: DPAs, SCCs, BCRs, contractual restrictions, audit rights
- Process: Data minimization, retention schedules, consent mechanisms, DSR processes

### 7.3.6 Step 6: DPIA Sign-off and Review

**Sign-off Chain**:
1. Privacy Engineer (preparer) - conducts the DPIA
2. Data Owner (reviewer) - reviews and provides input
3. DPO (approver) - reviews for compliance, signs off
4. (If high risk remains) Supervisory Authority - consulted

**Review Schedule**:
- Annual review for active DPIAs
- Triggered review for: significant processing changes, new regulations, privacy incidents, complaints, technology changes

## 7.4 DPIA Artifacts

### 7.4.1 DPIA Report Structure

1. Executive Summary
2. Processing Description
3. Necessity and Proportionality Assessment
4. Data Flow Diagrams (Level 0, Level 1, Level 2 as needed)
5. Risk Assessment Matrix
6. Identified Risks and Mitigations
7. Residual Risk Assessment
8. Mitigation Implementation Plan
9. Monitoring and Review Plan
10. Sign-off and Approvals
11. Appendices (screening questions, data inventory extracts, consent records)

### 7.4.2 DPIA Register

Maintain a register of all completed DPIAs with:
- DPIA ID and version
- Processing activity name
- Date of completion and review
- Risk level (residual)
- Approval status and date
- SA consultation status (if applicable)
- Next review date
- Processing activity status (active, changed, ceased)

## 7.5 Lightweight PIA Process

For lower-risk processing, a streamlined PIA may be appropriate:

1. Quick screening (5 questions)
2. Data flow summary (not full DFD)
3. Risk identification (not full matrix)
4. Mitigation checklist
5. Privacy engineer sign-off (not full DPO review)

## 7.6 PIA Automation

### 7.6.1 Automated PIA Triggers

Integrate PIA requirements into engineering workflow:
- New service creation triggers PIA screening
- New API endpoint with PII triggers PIA
- Database schema changes involving new personal data columns trigger PIA
- Third-party integration triggers vendor PIA
- Data retention changes trigger PIA review
- Consent model changes trigger PIA review

### 7.6.2 PIA CI/CD Integration

- PIA screening step in CI/CD pipeline for new deployments
- Automated questionnaire for privacy risk identification
- Integration with ticketing system for PIA tracking
- Automated approval routing based on risk level
- PIA status gate in deployment pipeline (high-risk must have approved DPIA)

# P8: Privacy in System Design

## 8.1 Privacy-Enhancing Technologies (PETs)

### 8.1.1 Pseudonymization

Pseudonymization replaces direct identifiers with pseudonyms, making data no longer directly attributable to a specific individual without additional information held separately.

**Techniques**:
- **Tokenization**: Replace identifiers with random tokens, mapping stored separately
- **Hashing**: One-way hash of identifiers (with salt to prevent rainbow table attacks)
- **HMAC**: Keyed-hash message authentication code for reversible pseudonymization
- **Format-preserving encryption (FPE)**: Encrypt data maintaining original format
- **Hash-based masking**: Hash identifier, store mapping in secure vault
- **Deterministic pseudonymization**: Same input always produces same pseudonym (useful for linking, risky for privacy)

**Implementation Requirements**:
- Separate storage of pseudonymization mapping from pseudonymized data
- Encryption of mapping table at rest and in transit
- Strict access control on mapping table
- Key rotation capability for HMAC-based approaches
- Audit logging of pseudonymization and re-identification events
- Documented re-identification policy and procedure

**When to Use Pseudonymization**:
- Analytics on customer behavior without direct identification
- Development and testing environments (use pseudonymized production data)
- Data sharing with third parties for processing
- Data lakes for research and analysis
- Machine learning training sets

### 8.1.2 Anonymization

Anonymization irreversibly removes identifying information such that the data subject is not or no longer identifiable.

**Techniques**:
- **Randomization**: Add random noise, permute values, generate synthetic data
- **Generalization**: Broaden values (age -> age range, city -> region)
- **Suppression**: Remove identifiers entirely
- **k-Anonymity**: Each record indistinguishable from at least k-1 other records
- **l-Diversity**: Sensitive attributes have at least l distinct values per group
- **t-Closeness**: Distribution of sensitive attributes in each group close to overall distribution
- **Differential Privacy**: Add calibrated noise to query results
- **Synthetic Data Generation**: Create artificial dataset with statistical properties

**Anonymization Validation**:
- Re-identification risk assessment (motivated intruder test)
- Singling out test
- Linkability test
- Inference test
- Peer review of anonymization approach
- Periodic re-assessment as data landscape changes

### 8.1.3 Aggregation

Aggregation combines individual data points into statistical summaries.

**Techniques**:
- **Sum/Count/Average**: Basic statistical aggregation
- **Histogram bucketing**: Group values into ranges
- **Median/Percentile**: Distribution-based aggregation
- **Cell suppression**: Suppress cells with small counts (n < threshold)
- **Rule-based suppression**: Suppress identifiable outliers

**Minimum Threshold Standards**:
- n >= 5 (general analytics)
- n >= 10 (health data, financial data)
- n >= 20 (sensitive data, small populations)
- Suppress any cell below threshold
- Suppress complementary cells (prevent differencing)

### 8.1.4 Differential Privacy

Differential privacy provides mathematical guarantees that the inclusion or exclusion of a single individual's data does not significantly affect the output of a computation.

**Key Concepts**:
- **Epsilon (e)**: Privacy budget parameter (lower = more privacy, less accuracy)
- **Sensitivity**: Maximum change in query result from adding/removing one record
- **Mechanism**: Laplace mechanism (numerical), Exponential mechanism (categorical)
- **Composition**: Privacy budget accumulates across multiple queries
- **Accountant**: Privacy budget tracker

**Implementation**:
- Determine acceptable e (typical range: 0.1 to 10 based on use case)
- Add calibrated noise to query results
- Track privacy budget consumption per subject
- Apply composition theorem for multiple queries
- Provide privacy dashboard showing budget consumed

## 8.2 Privacy Architecture Patterns

### 8.2.1 Privacy by Default Architecture

`
[Data Subject] -> [Consent Layer] -> [Purpose Boundary] -> [Data Store]
                       |                    |
                       v                    v
               [Preference Store]    [Access Control]
                       |                    |
                       v                    v
                 [Audit Log]        [Retention Enforcer]
`

- Consent layer validates processing authorization before data enters system
- Purpose boundary enforces data usage restrictions
- Preference store provides real-time consent status
- Access control enforces need-to-know and purpose limitation
- Retention enforcer ensures data is removed on schedule

### 8.2.2 Pseudonymization at Ingestion

`
[Raw Data] -> [Ingestion API] -> [Pseudonymization Layer] -> [Pseudonymized Store]
                    |                        |
                    v                        v
            [Raw Data Buffer]        [Mapping Store]
                    |                        |
                    v                        v
            [Secure Vault]          [Access Control]
`

- Raw data only exists temporarily in ingestion pipeline
- Pseudonymization applied before persistent storage
- Mapping stored separately with encryption
- Raw data in buffer purged after pseudonymization
- Access to mapping requires elevated privileges with audit

### 8.2.3 Layered Data Architecture

`
Layer 1: Raw Data (restricted access, short retention)
    - Original data with full PII
    - Limited to authorized personnel
    - Default retention: 7-30 days

Layer 2: Pseudonymized Data (general access, medium retention)
    - PII replaced with pseudonyms
    - Available for analytics and development
    - Default retention: 90-365 days

Layer 3: Aggregated/Anonymized Data (broad access, long retention)
    - Statistical summaries, no individual-level data
    - Available for reporting and research
    - Default retention: indefinite (with periodic review)

Layer 4: Derived Insights (public access, indefinite retention)
    - Non-personal insights, trends, benchmarks
    - No re-identification risk
    - Published externally where appropriate
`

### 8.2.4 Purpose-Limited Data Zones

Separate data environments for each processing purpose:

`
[Mesh of Purpose-Limited Zones]
    |
    |--- Zone A: Account Management (contractual necessity)
    |       Schema: users, accounts, subscriptions
    |       Retention: duration of account + 90 days
    |
    |--- Zone B: Marketing (consent)
    |       Schema: marketing_preferences, email_log
    |       Retention: 12 months or until consent withdrawn
    |
    |--- Zone C: Analytics (legitimate interest)
    |       Schema: pseudonymized_events, aggregated_reports
    |       Retention: 24 months
    |
    |--- Zone D: Compliance (legal obligation)
    |       Schema: audit_logs, consent_records, dsr_logs
    |       Retention: 6 years
`

Data cannot cross zone boundaries without documented purpose compatibility assessment and appropriate authorization.

## 8.3 Privacy in the SDLC

### 8.3.1 Privacy Requirements in Design

**Design Phase Privacy Checklist**:
- [ ] Data flow diagram created showing all PII touchpoints
- [ ] Privacy notice content drafted for collection points
- [ ] Consent model defined for each processing purpose
- [ ] Legal basis identified for each processing activity
- [ ] Data minimization review conducted
- [ ] Purpose limitation boundaries established
- [ ] Retention schedule defined
- [ ] DSR implications assessed
- [ ] Cross-border transfer requirements identified
- [ ] Third-party data sharing identified
- [ ] Pseudonymization/anonymization strategy defined
- [ ] Access control model defined for PII
- [ ] Encryption requirements specified
- [ ] Incident response integration defined
- [ ] PIA/DPIA screening completed

### 8.3.2 Privacy in Development

**Development Phase Privacy Checklist**:
- [ ] Privacy controls implemented per design
- [ ] PII handling follows coding standards
- [ ] Consent checks integrated into processing code
- [ ] Data minimization enforced at code level
- [ ] Pseudonymization implemented at ingestion
- [ ] Access controls enforced in application logic
- [ ] Audit logging implemented for PII access
- [ ] Retention enforcement in data access layer
- [ ] DSR query support implemented
- [ ] Secure deletion capability implemented
- [ ] Error messages do not leak PII
- [ ] Logging does not include PII
- [ ] API contracts include privacy metadata

### 8.3.3 Privacy in Testing

**Test Phase Privacy Checklist**:
- [ ] Test data is pseudonymized (never use production PII in test)
- [ ] Privacy regression tests pass
- [ ] Consent verification tests pass
- [ ] DSR endpoint tests pass
- [ ] Access control tests for PII pass
- [ ] Audit log tests pass
- [ ] Retention enforcement tests pass
- [ ] PII scanning tests of API responses pass
- [ ] Data export/portability tests pass
- [ ] Deletion/erasure tests pass

### 8.3.4 Privacy in Deployment

**Deployment Phase Privacy Checklist**:
- [ ] Final PIA/DPIA sign-off obtained
- [ ] Privacy notice published and accessible
- [ ] Consent mechanism tested in target environment
- [ ] Data flow verified in production
- [ ] Access controls verified
- [ ] Encryption verified (at rest, in transit)
- [ ] Audit logging verified
- [ ] DSR portal/submission verified
- [ ] Retention enforcement enabled
- [ ] Incident response plan updated to include new data flows
- [ ] Privacy documentation updated
- [ ] Team privacy training completed for new processing

## 8.4 Privacy Testing and Validation

### 8.4.1 Privacy Unit Tests

- Test that consent is checked before processing
- Test that unconsented processing is blocked
- Test that data minimization is enforced
- Test that pseudonymization is applied correctly
- Test that anonymization passes re-identification risk threshold
- Test that retention TTLs are enforced
- Test that deletion actually removes data
- Test that access controls block unauthorized access

### 8.4.2 Privacy Integration Tests

- End-to-end consent flow validation
- End-to-end DSR fulfillment validation
- Data pipeline pseudonymization validation
- Cross-system consent propagation validation
- Retention enforcement across data stores
- Deletion propagation across systems

### 8.4.3 Privacy Regression Tests

- Run privacy test suite on every build
- Include privacy tests in CI/CD pipeline
- Alert on privacy test failures
- Periodically re-run PII scanning tests
- Test privacy controls after infrastructure changes


# P9: Data Retention and Deletion

## 9.1 Retention Fundamentals

Data retention is the practice of keeping personal data only as long as necessary to fulfill the purpose for which it was collected. Retention management is a cornerstone of privacy-by-design and data minimization.

### 9.1.1 Legal Basis for Retention

- **GDPR Art 5(1)(e)**: Data must be kept no longer than necessary for processing purposes
- **CCPA/CPRA**: No specific retention limit but must disclose retention periods
- **HIPAA**: 6 years from creation or last effective date (whichever is later)
- **PCI DSS**: Cardholder data retention limited to business justification, max 13-37 months
- **GLBA**: Financial records retention (various, typically 5-7 years)
- **SOX**: Business records retention (7 years)
- **State laws**: Varying retention requirements by jurisdiction

### 9.1.2 Retention vs. Deletion

Retention and deletion are two sides of the same coin:
- **Retention Schedule**: How long each data category is kept
- **Deletion Mechanism**: How data is removed when retention period expires
- **Retention Enforcement**: Automated systems that enforce retention periods
- **Deletion Verification**: Confirmation that deletion occurred correctly

## 9.2 Retention Schedule Design

### 9.2.1 Retention Schedule Components

Each retention policy should define:

| Component | Description | Example |
|---|---|---|
| Data Category | What data this applies to | Customer email address |
| Processing Purpose | Why data is processed | Account notification |
| Legal Basis | Why lawful processing | Contractual necessity |
| Retention Period | How long to keep | Duration of account + 90 days |
| Retention Trigger | When retention clock starts | Account closure date |
| Deletion Mechanism | How data is removed | Hard delete |
| Deletion Verification | How deletion is confirmed | Audit log entry + row count |
| Review Frequency | How often to review | Quarterly |
| Data Owner | Who is responsible | Identity Team |
| Regulatory Reference | Which regulation | GDPR Art 5, CCPA |

### 9.2.2 Retention Period Determination

**Factors to Consider**:
- Processing purpose and duration
- Legal/regulatory requirements
- Contractual obligations
- Statute of limitations for claims
- Industry standards and best practices
- Data subject expectations
- Technical feasibility of deletion
- Business need for historical analysis
- Anonymization alternatives

**Common Retention Periods**:
- Account data: Duration of account + 30-90 days
- Transaction data: 3-7 years (tax, legal)
- Marketing data: Until consent withdrawn or 12 months of inactivity
- Analytics data: 12-24 months (pseudonymized), indefinite (aggregated)
- Log data: 3-12 months (raw), 12-24 months (aggregated)
- Consent records: Duration of processing + 3 years (for proof)
- DSR records: 3-6 years (for audit trail)
- Employment data: Duration of employment + 3-7 years
- Health data: 10-25 years depending on jurisdiction
- Financial records: 5-7 years

### 9.2.3 Retention Schedule Format

`yaml
retention_policies:
  - id: RTL-001
    name: Customer Account Email
    data_elements:
      - customer_email
      - verified_email
    purposes:
      - account_management
      - account_notification
    legal_bases:
      - contractual_necessity
    retention:
      trigger: account_closure_date
      period_days: 90
      period_type: post_purpose
      action: hard_delete
      exception: legal_hold
    deletion:
      mechanism: hard_delete_from_database
      verification: audit_log_and_row_count_zero
      certificate: required
    owner: identity_team
    regulation: gdpr_article_5, ccpa
`

## 9.3 Deletion Mechanisms

### 9.3.1 Deletion at the Database Level

**Hard Deletion**:
- SQL: DELETE FROM table WHERE condition
- Database: Row physically removed, space potentially reclaimed
- Considerations: Cascading deletes, referential integrity, performance impact
- Verification: Row count after deletion = 0, audit log confirmation

**Soft Deletion**:
- SQL: UPDATE SET deleted_at = NOW(), is_deleted = TRUE
- Database: Row remains but marked as deleted
- Considerations: Application-level filtering, background purge jobs
- Verification: Audit log, spot-check of soft-deleted records

**TTL-Based Deletion**:
- Database native TTL (Cassandra TTL, MongoDB TTL index, Redis TTL)
- Automatically removes data after configured time
- Considerations: TTL granularity, TTL extensions, TTL monitoring

**Partition-Based Deletion**:
- Drop entire partitions containing expired data
- Efficient for time-series data
- Considerations: Partition key design, partition granularity

### 9.3.2 Deletion at the Storage Level

**File Deletion**:
- Filesystem: rm/unlink, secure deletion (overwrite before removal)
- Object Storage: S3 lifecycle policies, delete markers
- Considerations: Versioned objects, multi-region replication

**Secure Deletion**:
- Overwrite data before releasing storage
- Cryptographic erasure (destroy encryption keys)
- SSD: TRIM command, sanitize commands
- HDD: DoD 5220.22-M overwrite standards
- Cloud: Deletion + verification of destruction

### 9.3.3 Deletion at the Application Level

**API Deletion**:
- DELETE endpoints for individual and batch deletion
- Asynchronous deletion for complex or large-scale operations
- Idempotent deletion (deleting already-deleted data succeeds)

**Deletion Orchestration**:
- Deletion workflow across multiple systems
- Dependency management (delete in correct order)
- Failure handling and retry logic
- Consistency verification across systems

## 9.4 Retention Enforcement Architecture

### 9.4.1 Enforcement Points

| Layer | Enforcement | Tools |
|---|---|---|
| Database | TTL, Partition drops, Delete triggers | MySQL TTL, Cassandra TTL, PostgreSQL pg_cron |
| Storage | Lifecycle policies, Object expiration | S3 Lifecycle, GCS Object Lifecycle, Azure Blob Lifecycle |
| Application | Business logic checks before create/read | Application code, services |
| Pipeline | Retention checks in ETL/ELT | Apache Airflow, dbt, streaming processors |
| Data Warehouse | Retention policies on tables | Snowflake retention, BigQuery expiration |
| Archive | Archive-to-deletion schedules | Glacier lifecycle, Backup retention policies |

### 9.4.2 Automated Retention Enforcement

**Ingestion-Time Tagging**:
- Assign expiration timestamp at data creation
- Calculate based on data category + purpose + retention policy
- Store as column/attribute on the record

**Scheduled Purge Jobs**:
- Batch jobs that identify and delete expired records
- Run daily/weekly based on data volume
- Include verification and reporting
- Alert on purge job failures

**Real-Time Enforcement**:
- Delete/block access to expired data at query time
- Enforce through data access layer
- Prevent access to data past retention period

### 9.4.3 Retention Exception Management

**Legal Holds**:
- Override retention policy when data is needed for legal proceedings
- Must be approved by legal counsel
- Tracked and monitored separately
- Released when legal hold expires
- Protected from deletion during hold period

**Investigative Holds**:
- Retention override for privacy/security incidents
- Limited duration, approved by DPO or security lead
- Released after investigation complete

## 9.5 Deletion Verification

### 9.5.1 Verification Methods

- **Row count**: Confirm pre-deletion count, post-deletion count = 0
- **Sample query**: Query for deleted records, confirm not found
- **Re-import test**: Attempt to re-import deleted records, confirm failure
- **Checksum comparison**: Verify deletion across replicas
- **Audit log**: Verify deletion event recorded with timestamp, actor, scope

### 9.5.2 Certificate of Destruction

For high-sensitivity data, generate a certificate of destruction documenting:
- Data category and scope of deletion
- Systems/locations where data was stored
- Deletion method used
- Date and time of deletion
- Person/system who initiated deletion
- Verification results (row counts, confirmations)
- Witness (optional, for regulatory purposes)
- Retention of certificate (typically 3-6 years)

# P10: PII Detection and Classification

## 10.1 PII Detection Fundamentals

PII detection is the automated identification of personal data across an organization's data landscape. It is the prerequisite for classification, protection, and compliance.

### 10.1.1 Detection Scope

**Structured Data**:
- Database columns and fields
- Data warehouse/lake columns
- API request/response payloads
- CSV, JSON, Parquet, Avro files
- Spreadsheets and data extracts

**Semi-Structured Data**:
- XML documents
- JSON documents
- Log files (structured and unstructured)
- Configuration files containing credentials
- Email headers and metadata

**Unstructured Data**:
- Documents (PDF, DOCX, TXT)
- Email bodies and attachments
- Chat and messaging histories
- Source code and comments
- Support tickets and notes
- Social media content
- Image data (via OCR)
- Audio transcripts (via speech-to-text)
- Video metadata and captions

## 10.2 PII Detection Techniques

### 10.2.1 Pattern-Based Detection

Pattern matching uses regular expressions and format validators:

**Common PII Patterns**:
- Email: [\w\.-]+@[\w\.-]+\.\w{2,}
- SSN: \d{3}-\d{2}-\d{4}
- Phone: \+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}
- Credit Card: \d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4} (with Luhn check)
- IP Address: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}
- Passport: [A-Z]\d{7,9}
- Driver's License: [A-Z]{1,3}\d{4,8}
- Bank Account: \d{8,17}
- Date of Birth: \d{1,2}[/-]\d{1,2}[/-]\d{2,4}
- ZIP Code: \d{5}(-\d{4})?

**Strengths**:
- High precision for well-defined formats
- No training data required
- Easy to maintain and update
- Fast execution
- Deterministic and auditable

**Weaknesses**:
- Cannot detect unstructured PII not matching patterns
- High false positive rate for patterns (numbers matching SSN format)
- Cannot adapt to new PII types without rule updates
- Language-dependent for some patterns

### 10.2.2 ML-Based Detection

Machine learning models detect PII that does not match fixed patterns:

**Named Entity Recognition (NER)**:
- Identify names, locations, organizations, dates, monetary values
- Fine-tuned models (BERT, RoBERTa, SpaCy)
- Domain-specific models for medical, legal, financial text
- Multi-language NER models

**Classification Models**:
- Document-level sensitivity classification
- Content-based PII probability scoring
- Multi-label classification for PII type identification
- Confidence scoring with threshold tuning

**Contextual Models**:
- Transformers that understand PII context (e.g., "John" = name vs "John" = place)
- Relationship extraction between entities
- Document structure analysis

**Strengths**:
- Detects PII matching no fixed pattern
- Understands context and reduces false positives
- Adaptable to new PII types with retraining
- Handles unstructured and natural language content

**Weaknesses**:
- Requires labeled training data
- Model bias and fairness concerns
- Black-box nature (harder to audit)
- Computational cost of inference
- Requires ongoing model maintenance

### 10.2.3 Heuristic Detection

Heuristic methods use rules of thumb and contextual clues:

**Column Name Analysis**:
- "ssn", "social_security", "email", "phone_number"
- "date_of_birth", "dob", "birth_date"
- "passport_number", "national_id"

**Data Type + Pattern**:
- VARCHAR(11) + format matching SSN
- VARCHAR(254) + format matching email
- DATE field with age range < 150 years

**Business Logic Context**:
- Registration forms always contain email
- Invoice tables always contain transaction amount
- Address tables always contain postal code

**Statistical Analysis**:
- Entropy analysis (IDs tend to be high-entropy)
- Cardinality analysis (PII columns often high cardinality)
- Value distribution analysis (names, cities have power-law distribution)

### 10.2.4 Composite Detection Strategy

The most effective approach combines all techniques:

`
Input Data
    |
    v
[Pattern Matcher] ----match?--> [PII Candidate + Type + Confidence]
    | no match
    v
[ML Classifier] ----match?--> [PII Candidate + Type + Confidence]
    | no match
    v
[Heuristic Analyzer] --match?--> [PII Candidate + Type + Confidence]
    | no match
    v
[Label: Not PII]
`

Confidence scoring:
- Pattern match only: Low-Medium (0.3-0.7)
- Pattern match + context: Medium-High (0.6-0.9)
- ML classified + pattern verified: High (0.8-0.95)
- Multi-model agreement: Very High (0.95+)

## 10.3 False Positive Management

### 10.3.1 Sources of False Positives

- Numbers matching PII patterns but not actually PII (e.g., order numbers matching SSN format)
- Names that are also common words ("Bill", "Will", "Rose", "Summer")
- Standard form fields named similarly to PII fields
- Synthetic test data, sample data, example data
- Technical identifiers that look like PII (session IDs, token values)
- Cultural variations in name/address formats

### 10.3.2 False Positive Reduction Techniques

**Context Verification**:
- Check field metadata (column name, data type, constraints)
- Check data relationship (foreign keys, table context)
- Check business context (table name, database name, application context)

**Cross-Validation**:
- Verify PII candidate against secondary patterns
- Cross-reference with known data formats (e.g., Luhn check for credit cards)
- Use multiple detection methods and require consensus

**Whitelisting**:
- Maintain whitelist of known non-PII patterns
- Review and update whitelist regularly
- Allow per-data-source overrides

**Confidence Thresholds**:
- Set minimum confidence score for each PII type
- Flag low-confidence matches for human review
- Tune thresholds based on false positive rate monitoring

### 10.3.3 Human-in-the-Loop Review

- Automated detection flags candidates
- Low-confidence flags routed to data stewards for manual review
- Medium-confidence flags sampled (10-20%) for quality check
- High-confidence flags auto-approved with post-processing audit
- Review outcomes used to retrain models and refine patterns

## 10.4 PII Scanning Pipeline

### 10.4.1 Pipeline Architecture

`
[Data Sources] -> [Scanner Agents] -> [Classification Engine] -> [Label Store]
                                                |
                                                v
                                         [Alert Manager]
                                                |
                                                v
                                         [Remediation Queue]
`

**Scanner Agents**:
- Database scanners (connect to databases, analyze schemas and sample data)
- File system scanners (walk file systems, analyze files)
- API scanners (analyze API payloads and responses)
- Stream scanners (analyze streaming data samples)
- Cloud storage scanners (analyze S3, GCS, Azure Blob)

**Classification Engine**:
- Pattern matching module
- ML inference module
- Heuristic analysis module
- Confidence scoring and cross-validation
- Classification label assignment

### 10.4.2 Scan Scheduling

- **Initial full scan**: Complete scan of all data assets
- **Incremental scans**: Scan new/changed data daily
- **Full re-scans**: Comprehensive re-scan monthly/quarterly
- **Event-driven scans**: Scan triggered by data changes
- **On-demand scans**: Scan specific data assets as needed

### 10.4.3 Scanning Performance

- Truncate scanning targets when possible (reasonable sample sizes)
- Multi-threaded and distributed scanning
- Incremental scanning (only new and changed data)
- Priority-based scanning (high-sensitivity first)
- Resource-aware scheduling (avoid production impact)

## 10.5 PII Detection for Different Data Types

### 10.5.1 Database PII Detection

- Query database schemas for column names, data types, constraints
- Sample row data for value analysis
- Analyze foreign keys and relationships for inferred PII
- Check column comments, tags, and extended properties
- Review stored procedures and views for PII exposure

### 10.5.2 Document PII Detection

- Extract text from documents (PDF, DOCX, TXT, HTML)
- Apply NER and pattern matching to extracted text
- Analyze document metadata (author, creation date)
- Process images via OCR for embedded text
- Analyze document structure (headers, sections, tables)

### 10.5.3 API PII Detection

- Analyze OpenAPI/Swagger specs for PII schemas
- Inspect API request/response samples
- Check API documentation for data descriptions
- Audit API logs for actual data being transmitted
- Test API endpoints with synthetic data

### 10.5.4 Log PII Detection

- Parse structured log formats (JSON, key=value)
- Apply pattern matching to log messages
- Check for PII in log metadata fields
- Analyze log patterns for common PII leakage
- Monitor log aggregation systems for PII

# P11: Privacy in Data and ML

## 11.1 Privacy in Data Pipelines

### 11.1.1 Privacy-by-Design in Data Engineering

Data pipelines must embed privacy controls as core pipeline components, not as afterthoughts:

**Pipeline Privacy Controls**:
- Pseudonymization at ingestion point
- Data classification tagging at pipeline entry
- Purpose-based data routing
- Retention enforcement at each pipeline stage
- Consent verification before processing
- PII detection and alerting in pipeline
- Audit logging at each transformation step
- Secure handling of intermediate results

### 11.1.2 Pseudonymization at Ingestion

Implement pseudonymization as the first processing step after data ingestion:

**Stream Ingestion**:
`python
def ingest_user_event(raw_event):
    # Step 1: Classify incoming data
    classification = classify_data(raw_event)

    # Step 2: Pseudonymize identifiers
    pseudonymized = pseudonymization_service.pseudonymize(
        data=raw_event,
        identifiers=classification.identifiers,
        purpose=raw_event.purpose
    )

    # Step 3: Store pseudonymized data to primary store
    primary_store.write(pseudonymized)

    # Step 4: If needed, store raw data in restricted access store
    if classification.requires_raw_storage:
        secure_vault.write(
            data=raw_event,
            retention=classification.retention,
            access_control=classification.access_control
        )

    # Step 5: Audit log the ingestion
    audit_log.record(
        event="ingestion",
        data_type=classification.data_type,
        pseudonymized=True,
        purpose=raw_event.purpose
    )
`

### 11.1.3 Data Lake Privacy Controls

**Column-Level Security**:
- Tag columns with classification level
- Apply column-level access controls (masking, redaction)
- Enforce column-level encryption for sensitive fields
- Implement column-level audit logging

**Row-Level Security**:
- Filter rows based on user authorization
- Purpose-based row access
- Data subject access for DSR fulfillment

**Schema Enforcement**:
- Schemas include classification metadata
- Schema validation at write time
- Schema evolution review for privacy impact

### 11.1.4 Purpose Limitation in Pipelines

- Tag data with purpose ID at ingestion
- Pipeline stages check purpose before processing
- Data routing based on purpose compatibility
- Cross-purpose data access requires explicit authorization
- Purpose violation alerts and blocking

## 11.2 Privacy in Machine Learning

### 11.2.1 Training Data Privacy

**Data Minimization for ML**:
- Collect only data necessary for model performance
- Use pseudonymized data for training where possible
- Anonymize or aggregate features not requiring individual-level data
- Remove direct identifiers from training datasets
- Minimize feature set to essential predictors

**Training Data Governance**:
- Document training data sources and composition
- Maintain data provenance for all training datasets
- Track consent for training data collection
- Implement opt-out mechanism for training data inclusion
- Regular audit of training data for bias and privacy risks

**Consent for ML Training**:
- Separate consent for training vs. inference
- Clear disclosure of ML training in privacy notice
- Right to object to ML training as processing
- Ability to withdraw training data consent

### 11.2.2 Model Memorization

**What is Model Memorization?**
Models can memorize training data, including PII, making it extractable through targeted queries.

**Risk Factors**:
- Model size (larger models memorize more)
- Data duplication (duplicated records more likely to be memorized)
- Outlier/unusual records (rare examples memorized more)
- Model access (black-box vs. white-box access)
- Number of queries (more queries increase extraction risk)

**Mitigation Strategies**:
- Differential privacy during training
- Data deduplication in training sets
- Regularization to reduce overfitting
- Output perturbation (add noise to predictions)
- Query limitations and rate limiting
- Monitor for extraction attacks
- Periodic extraction attack testing

### 11.2.3 Differential Privacy for ML

**Training with Differential Privacy**:
- Add calibrated noise to gradients during training
- Use DP-SGD (Differentially Private Stochastic Gradient Descent)
- Track privacy budget (epsilon) over training epochs
- Apply privacy amplification (subsampling, shuffling)

**Implementation Steps**:
1. Determine target epsilon (e) for the model
2. Choose DP mechanism (DP-SGD, DP-FedAvg)
3. Configure noise multiplier and clipping threshold
4. Train model with DP guarantee
5. Track privacy budget expenditure
6. Validate model utility at target epsilon
7. Document privacy guarantee for model card

**Trade-offs**:
- Higher privacy (lower e) reduces model accuracy
- Larger datasets require less noise for same epsilon
- Some model architectures more DP-friendly than others

### 11.2.4 Federated Learning

**How Federated Learning Protects Privacy**:
- Model trains on device, not on central server
- Only model updates (gradients) sent to server
- Raw data never leaves the device
- Aggregation adds privacy protection (FedAvg, Secure Aggregation)

**Privacy Considerations in Federated Learning**:
- Gradients can leak information about training data
- Model updates require differential privacy (DP-FedAvg)
- Secure multi-party computation for gradient aggregation
- Trusted execution environments for aggregation servers
- Participant anonymity and unlinkability

**Federated Learning Architecture**:

`
[Devices] --local training--> [Model Updates] --encrypted--> [Aggregation Server]
    |                                                               |
    v                                                               v
[No raw data leaves device]                                [Aggregated Model]
                                                                   |
                                                                   v
                                                            [Updated Model]
                                                                   |
                                                                   v
                                                            [Distribute to Devices]
`

### 11.2.5 Inference Privacy

**Risks During Inference**:
- Model inversion attacks (reconstruct training data from model outputs)
- Membership inference attacks (determine if individual in training set)
- Attribute inference attacks (infer sensitive attributes from predictions)
- Model extraction attacks (steal model functionality through queries)

**Mitigation Strategies**:
- Limit prediction confidence scores (output class labels, not probabilities)
- Apply output perturbation (add noise to predictions)
- Round or bucket continuous predictions
- Implement query limits and rate limiting
- Monitor for suspicious query patterns
- Add canary records to detect extraction attempts

### 11.2.6 Model Cards and Privacy Documentation

Each ML model should have a model card including:

- Model purpose and intended use
- Training data sources and composition
- Privacy protections applied (pseudonymization, anonymization, differential privacy)
- Privacy budget (e) for DP-trained models
- Training data consent status
- Memorization risk assessment
- Inference privacy protections
- Re-identification risk for training data
- Fairness and bias assessment
- Data retention for training data
- DSR applicability (right to erasure from training data)

## 11.3 Privacy-Preserving Data Sharing

### 11.3.1 Privacy-Preserving Record Linkage (PPRL)

Technique for linking records across datasets without revealing PII:

- Match keys derived from PII using one-way hashing
- Bloom filter encoding for fuzzy matching
- Secure multi-party computation for linkage
- Third-party linkage service with privacy guarantees

### 11.3.2 Secure Multi-Party Computation (SMPC)

Multiple parties compute a function on their private data without revealing inputs:

- Secret sharing (split data into shares, distribute)
- Garbled circuits (boolean circuit evaluation)
- Oblivious transfer (retrieve data without revealing which)
- Homomorphic encryption (compute on encrypted data)

### 11.3.3 Homomorphic Encryption

Compute on encrypted data without decryption:

- Partially homomorphic (supports addition or multiplication)
- Somewhat homomorphic (supports limited operations)
- Fully homomorphic (supports arbitrary computations)
- Performance considerations (1000-1000000x slower than plaintext)


# P12: Cross-Border Data Transfer

## 12.1 Transfer Fundamentals

Cross-border data transfer is one of the most complex areas of privacy compliance. The privacy engineer must understand the mechanisms available, assess transfer risks, and implement technical controls for lawful data flows.

### 12.1.1 What Constitutes a Transfer

A cross-border transfer occurs when personal data is:
- Transmitted from one country to another (network transfer)
- Accessed remotely from another country (remote access)
- Stored on servers located in another country
- Processed by a service provider located in another country
- Transferred through cloud infrastructure spanning multiple regions

### 12.1.2 Key Regulatory Requirements

| Regulation | Restriction | Mechanism |
|---|---|---|
| GDPR Art 44-49 | Transfers to non-adequate countries require safeguards | Adequacy decision, SCCs, BCRs, derogations |
| CCPA/CPRA | No specific cross-border restriction | Contractual protections |
| LGPD Art 33-36 | Similar to GDPR framework | Adequacy, SCCs, contractual clauses |
| PIPL Art 38-43 | Security assessment, certification, contract | Standard contract, certification, security assessment |
| HIPAA | BAAs required for any PHI transfer | BAA with business associate |

## 12.2 Transfer Mechanisms

### 12.2.1 Adequacy Decisions

The European Commission determines that a third country ensures an adequate level of protection:

**Countries with Adequacy (as of 2026)**:
- European Economic Area (EEA) countries
- Andorra, Argentina, Canada (commercial orgs), Faroe Islands
- Guernsey, Isle of Man, Israel, Japan, Jersey
- New Zealand, Republic of Korea, Switzerland, United Kingdom
- Uruguay, United States (DPF - Data Privacy Framework)

**Adequacy assessment criteria**:
- Rule of law, respect for human rights
- Existence of independent supervisory authority
- International commitments and obligations
- Effective enforcement mechanisms
- Data subject rights protections

### 12.2.2 Standard Contractual Clauses (SCCs)

**2021 EU SCCs Structure**:
- Module 1: Controller to Controller
- Module 2: Controller to Processor
- Module 3: Processor to Processor
- Module 4: Processor to Controller

**SCC Requirements**:
- Docking clause (new parties can join)
- Data subject third-party beneficiary rights
- Transparency obligations
- Accuracy and minimization obligations
- Storage limitation and erasure obligations
- Security requirements
- Subprocessor authorization
- Data breach notification
- Cooperation with supervisory authorities
- DSR fulfillment obligations
- Liability and indemnification
- Jurisdiction and governing law
- Audit rights (on-site inspection or documentation review)

**SCC Implementation Workflow**:
1. Map all cross-border transfers
2. Identify appropriate SCC module
3. Complete SCC schedules (parties, description of transfer, technical measures)
4. Conduct Transfer Impact Assessment (TIA)
5. Execute SCCs with counterparty
6. Implement supplementary measures (if TIA identifies risks)
7. Monitor and review annually

### 12.2.3 Binding Corporate Rules (BCRs)

BCRs allow intra-group transfers within a corporate group:

**Types of BCRs**:
- BCR-C (Controller): For processing as a controller
- BCR-P (Processor): For processing as a processor

**BCR Content Requirements**:
- Group structure and contact details
- Data processing activities covered
- Binding nature (internal and external)
- Data protection principles
- Data subject rights
- Complaint handling
- Audit and monitoring
- Training and awareness
- Changes and updates
- Cooperation with supervisory authorities

### 12.2.4 Supplementary Measures

When SCCs alone are insufficient (e.g., for transfers to countries with surveillance laws):

**Technical Supplementary Measures**:
- End-to-end encryption (data in transit)
- Field-level encryption (data at rest)
- Pseudonymization before transfer
- Tokenization with token vault in originating country
- Data masking/shredding before cross-border transfer
- Access controls limiting foreign-based personnel

**Organizational Supplementary Measures**:
- Restricted access for foreign-based personnel
- Data classification and sensitivity-based handling
- Access logging and monitoring
- Privacy training for foreign-based personnel
- Incident response coordination across borders

## 12.3 Transfer Impact Assessment (TIA)

### 12.3.1 TIA Methodology

**Step 1**: Identify the transfer (what data, from where, to where, via what mechanism)

**Step 2**: Assess the legal framework of the destination country:
- Surveillance laws and their scope
- Government access rights
- Judicial oversight and due process
- Data subject protections
- Enforcement and remedies

**Step 3**: Assess the data importer's handling:
- Security measures
- Access controls
- Incident response capability
- Data protection organization
- Prior incidents of government access requests

**Step 4**: Identify supplementary measures needed (if assessment reveals gaps)

**Step 5**: Document and approve TIA, obtain DPO sign-off

### 12.3.2 TIA Documentation

`json
{
  "tia_id": "TIA-2026-0042",
  "transfer_description": {
    "exporter": "Synarc Corp (EU)",
    "importer": "Synarc Corp (US)",
    "data_subjects": "EU customers, employees",
    "data_categories": "Account data, transaction data, HR data",
    "transfer_mechanism": "SCCs Module 2 + Supplementary Measures",
    "transfer_purpose": "Global customer platform operations"
  },
  "destination_assessment": {
    "country": "United States",
    "legal_framework": "US surveillance laws (FISA 702, EO 12333)",
    "government_access": "Possible under FISA, subject to DPF commitments",
    "oversight": "FISC, Privacy and Civil Liberties Oversight Board",
    "remedies": "DPF redress mechanism, ombudsperson",
    "risk_level": "Medium (with supplementary measures)"
  },
  "supplementary_measures": [
    "End-to-end encryption for data in transit",
    "Data at rest encryption with keys held in EU",
    "Pseudonymization before transfer",
    "Restricted access for US-based personnel",
    "Audit logging of all US-based access"
  ],
  "residual_risk": "Low",
  "approval": {
    "assessor": "Privacy Engineering",
    "reviewer": "DPO",
    "date": "2026-05-27",
    "next_review": "2027-05-27"
  }
}
`

## 12.4 Data Residency and Localization

### 12.4.1 Data Residency Strategies

- **Single Region**: All data stored in one geographic region
- **Multi-Region**: Data stored in multiple regions for redundancy
- **Regional Storage**: Data stored in region of origin, with export on request
- **Local Processing**: Data processed in-country, aggregated data exported

### 12.4.2 Cloud Provider Data Residency Controls

- **AWS**: Region selection, S3 bucket policies, VPC endpoints, Outposts
- **Azure**: Region selection, Azure Policy, Customer Lockbox, Azure Dedicated Region
- **GCP**: Region selection, Organization Policies, CMEK, Assured Workloads
- **Sovereign Clouds**: AWS GovCloud, Azure Government, Google Assured Workloads

# P13: Regulatory Mapping

## 13.1 Regulatory Landscape Overview

### 13.1.1 Major Global Privacy Regulations

| Regulation | Jurisdiction | Effective Date | Key Provisions |
|---|---|---|---|
| GDPR | EU/EEA | May 2018 | Comprehensive rights, 7 principles, DPO, DPIA, breach notification, high fines |
| CCPA/CPRA | California | Jan 2020/2023 | Consumer rights, opt-out sale/share, non-discrimination, expanded sensitive data |
| LGPD | Brazil | Aug 2020 | Similar to GDPR, DPO, DPIA, high fines, ANPD enforcement |
| PIPL | China | Nov 2021 | Consent, cross-border transfer restrictions, data localization, sensitive data |
| HIPAA Privacy Rule | US (healthcare) | Apr 2003 | PHI protections, minimum necessary, BAA, patient rights, breach notification |
| PIPEDA | Canada | Apr 2000 | Consent, purpose limitation, access rights, OPC oversight |
| CDPA | Virginia | Jan 2023 | Consumer rights, opt-out, data protection assessments, controller obligations |
| CPA | Colorado | Jul 2023 | Similar to CDPA, additional profiling protections |
| CTDPA | Connecticut | Jul 2023 | Consumer rights, opt-out, data processing transparency |
| FADP | Switzerland | Sep 2023 | Modernized, GDPR-like, DPO, DPIA, breach notification |
| UK GDPR | UK | Jan 2021 (post-Brexit) | Substantively equivalent to EU GDPR |
| APPI | Japan | May 2017 (amended 2022) | Consent, cross-border, rights, PPC enforcement |

## 13.2 GDPR Deep Dive

### 13.2.1 Key Articles for Privacy Engineering

| Article | Topic | Engineering Implications |
|---|---|---|
| Art 5 | Principles | Data minimization, purpose limitation, storage limitation, integrity, confidentiality |
| Art 6 | Lawfulness | Legal basis determination, consent management, legitimate interest assessment |
| Art 7 | Consent conditions | Freely given, specific, informed, unambiguous, withdrawal mechanisms |
| Art 8 | Child consent | Age verification, parental consent mechanisms |
| Art 9 | Special categories | Enhanced protections, explicit consent, DPIA mandatory |
| Art 12-14 | Transparency | Privacy notices, layered notices, machine-readable formats |
| Art 15 | Right of access | DSR access portal, data discovery, response formatting |
| Art 17 | Right to erasure | Deletion infrastructure, propagation to third parties |
| Art 20 | Data portability | Structured, machine-readable format, direct transfer |
| Art 22 | Automated decisions | Algorithmic transparency, human review, right to explanation |
| Art 25 | Data protection by design | Privacy-by-design, data minimization, pseudonymization |
| Art 30 | ROPA | Data mapping, processing register, automated ROPA generation |
| Art 32 | Security | Encryption, access controls, incident response, regular testing |
| Art 33 | Breach notification | Detection, assessment, notification within 72 hours |
| Art 35 | DPIA | DPIA screening, methodology, mitigation, SA consultation |
| Art 44-49 | Cross-border | Transfer mechanisms, adequacy, SCCs, BCRs, derogations |

## 13.3 CCPA/CPRA Deep Dive

### 13.3.1 Key Provisions

- **Right to Know**: Categories and specific pieces of personal information collected
- **Right to Delete**: Erasure of personal information (with exceptions)
- **Right to Opt-Out**: Sale or sharing of personal information for cross-context advertising
- **Right to Non-Discrimination**: No price/service difference for exercising rights
- **Right to Correct**: Rectification of inaccurate personal information
- **Right to Limit**: Use of sensitive personal information
- **Right to Portability**: Data portability at 12-month granularity

### 13.3.2 CCPA/CPRA Implementation Requirements

- "Do Not Sell or Share My Personal Information" link on homepage
- "Limit the Use of My Sensitive Personal Information" link
- Cookie consent banner for targeted advertising
- Opt-out preference signals (GPC) honored
- Data inventory for CPRA categories
- Service provider contracts with specific restrictions
- Annual risk assessments
- Automated decision-making transparency
- Data subject request verification processes

## 13.4 Regulatory Mapping Methodology

### 13.4.1 Regulation-to-Control Mapping

Map each regulatory requirement to specific technical and organizational controls:

| Requirement | Regulation | Control Type | Control Implementation |
|---|---|---|---|
| Right to erasure | GDPR Art 17, CCPA, LGPD Art 18 | Technical | Deletion API, anonymization pipeline, propagation mechanism |
| Consent withdrawal | GDPR Art 7(3) | Technical | Consent preference system, processing gate checks |
| Cross-border safeguards | GDPR Art 46 | Technical + Org | Encryption, access controls, SCCs, TIA process |
| Retention limitation | GDPR Art 5(1)(e) | Technical | TTL enforcement, purge jobs, retention schedule |
| DPIA | GDPR Art 35 | Process | DPIA workflow, risk scoring, approval, SA consultation |
| Breach notification | GDPR Art 33, 34 | Process + Tech | Detection pipeline, assessment workflow, notification templates |

### 13.4.2 Multi-Regulatory Compliance

For organizations operating across multiple jurisdictions:

- **Common baseline**: Implement GDPR-level protections as baseline (most comprehensive)
- **Jurisdiction-specific overlays**: Additional requirements for specific regions
- **Conflicting requirements**: Privacy shield for conflicting laws (e.g., US surveillance vs. EU privacy)
- **Primary regulator**: Determine lead supervisory authority under GDPR one-stop-shop

## 13.5 Regulatory Monitoring

### 13.5.1 Regulatory Change Management

- Subscribe to regulatory updates (IAAP, DLA Piper, OneTrust)
- Quarterly regulatory landscape review
- Impact assessment for each regulatory change
- Control updates prioritized by risk and compliance deadline
- Regulatory change register maintained

### 13.5.2 Regulatory Obligation Register

`json
{
  "obligation_id": "OBL-0042",
  "regulation": "GDPR",
  "article": "Article 17",
  "requirement": "Right to erasure (right to be forgotten)",
  "applicable_data": "All personal data",
  "control_implementations": [
    "User deletion endpoint (DELETE /api/v2/users/{id})",
    "Background deletion job for cascade deletion",
    "Deletion propagation to analytics systems",
    "Deletion confirmation email to subject"
  ],
  "effectiveness_metrics": [
    "Deletion SLA: < 30 days",
    "Deletion completeness: 100%",
    "Deletion verification: % zero-row counts"
  ],
  "test_results": "Passed (2026-05-15)",
  "next_review": "2026-08-15"
}
`

# P14: Privacy Incident Response

## 14.1 Incident Classification

### 14.1.1 Privacy Incident vs. Security Incident

| Aspect | Privacy Incident | Security Incident |
|---|---|---|
| Focus | Unauthorized processing, access to personal data | Breach of confidentiality, integrity, availability |
| Impact | Data subject rights, privacy | System security, data protection |
| Notification | Data subjects, regulator | Regulator, affected parties |
| Examples | Accidental PII disclosure, unauthorized processing, consent violation | Malware, network intrusion, DoS, system compromise |
| Overlap | Many events are both (e.g., hack exposing PII) | |

### 14.1.2 Privacy Incident Categories

**Unauthorized Access**:
- Employee accessing PII without legitimate purpose
- Contractor viewing data beyond scope
- Third party accessing data without authorization
- Former employee accessing data after termination

**Data Disclosure**:
- Accidental email containing PII sent to wrong recipient
- PII exposed through API without authentication
- Data leak through misconfigured cloud storage
- Unintended disclosure in public documents
- Data exposed through error messages or logs

**Data Loss**:
- Physical device containing PII lost or stolen
- Backup media lost in transit
- Cloud data permanently deleted without backup
- Data corrupted or unreadable

**Consent Violation**:
- Processing data beyond consented purpose
- Processing data without valid consent
- Failure to honor consent withdrawal
- Consent not properly collected or recorded

**DSR Failure**:
- Failure to respond to DSR within regulatory timeline
- Incomplete or inaccurate DSR response
- Failure to propagate deletion/rectification to third parties
- Identity verification failure leading to unauthorized access

**Data Integrity**:
- PII accidentally modified or corrupted
- Data subject's data incorrectly attributed to another person
- Accuracy failure due to system bug

## 14.2 Incident Response Lifecycle

### 14.2.1 Phase 1: Detection and Reporting

**Detection Methods**:
- Automated monitoring alerts (PII access anomalies)
- Data loss prevention (DLP) alerts
- Intrusion detection system (IDS) alerts
- User/customer reports
- Employee reports
- Regulatory authority notification (data subject complaint)
- Media inquiry

**Reporting Channels**:
- Security operations center (SOC) ticket
- Privacy incident hotline/email
- DPO direct report
- Manager escalation
- Whistleblower channel
- Regulatory authority referral

**Initial Triage**:
- Acknowledge receipt of report
- Initial severity assessment (confirmed vs. suspected)
- Assignment to response team
- Initial containment instructions

### 14.2.2 Phase 2: Assessment and Classification

**Assessment Questions**:
1. What personal data is involved? (types, categories, sensitivity)
2. How many data subjects are affected?
3. What is the root cause of the incident?
4. Is the incident ongoing or contained?
5. What systems and data stores are affected?
6. Are there cross-border data implications?
7. Is there a risk of harm to data subjects?
8. Are there legal/regulatory notification requirements?
9. Are there contractual notification requirements?
10. Is media/public attention expected?

**Severity Classification**:

| Level | Criteria | Response |
|---|---|---|
| Critical | High-risk to data subjects, large scale, sensitive data, high likelihood of harm, regulatory attention expected | Full response team, immediate notification, executive briefing |
| High | Risk to data subjects, moderate scale, moderate sensitivity | Full response team, 24h notification |
| Medium | Limited risk, small scale, low sensitivity, contained | Standard response, 72h notification |
| Low | No risk to data subjects, PII not involved (test data, pseudonymized) | Document and close |

### 14.2.3 Phase 3: Containment

**Technical Containment**:
- Isolate affected systems (network segmentation)
- Revoke access credentials (if unauthorized access)
- Apply ACLs to exposed data stores
- Take systems offline if necessary
- Preserve evidence (forensic images, logs)
- Block data exfiltration (if ongoing)

**Organizational Containment**:
- Notify affected data subjects (if required for safety/mitigation)
- Engage legal counsel
- Contact public relations/communications
- Notify cyber insurance
- Contact DPO
- Engage forensic investigators

### 14.2.4 Phase 4: Investigation and Forensics

**Forensic Collection**:
- System logs (access logs, application logs, security logs)
- Network traffic captures
- System memory dumps (if security incident)
- Disk images (if unauthorized access)
- Email and communication records
- Access control logs
- Change management records
- Video surveillance (physical security incidents)

**Analysis**:
- Determine root cause
- Determine scope (data, systems, subjects, duration)
- Determine if data was actually accessed/viewed/exfiltrated
- Determine if malicious or accidental
- Determine if similar risks exist in other systems
- Determine effectiveness of existing controls

**Documentation**:
- Incident timeline (discovery to resolution)
- Evidence inventory chain of custody
- Analysis findings
- Affected data inventory
- Affected systems inventory
- Root cause determination

### 14.2.5 Phase 5: Notification

**Regulatory Notification**:

| Regulation | Timeline | Format | Content |
|---|---|---|---|
| GDPR Art 33 | 72 hours | SA notification form | Nature, categories, affected, contact, consequences, measures |
| CCPA/CPRA | No specific timeline (advisable: as soon as possible) | Notice to affected consumers | Breach notification letter |
| HIPAA | 60 days | HHS notification form | Nature, data, mitigation, contact |
| LGPD | Reasonable period | ANPD notification | Nature, data, measures, contact |
| PIPL | Immediately | CAC notification | Nature, categories, consequences, measures |

**Data Subject Notification**:
- Nature of the incident
- Nome and contact details of DPO
- Likely consequences
- Measures taken to address the incident
- Measures recommended to data subject
- Guidance to protect against potential harm
- Regulatory authority contact information

**Contents of Notification**:
- Clear and plain language
- Description of the nature of the incident
- Categories and approximate number of data subjects
- Categories and approximate number of personal data records
- Contact information for DPO or designated contact
- Likely consequences
- Measures taken or proposed to address the incident
- Recommendations for data subjects

### 14.2.6 Phase 6: Remediation

**Immediate Remediation**:
- Patch vulnerability (if root cause)
- Restore access controls
- Update security configurations
- Re-encrypt data (if encryption failure)
- Implement additional monitoring

**Long-Term Remediation**:
- Root cause analysis report
- Control improvement plan
- Process improvement plan
- Technology improvement plan
- Training and awareness improvement
- Policy and procedure updates

**Lessons Learned**:
- Incident review meeting
- What went well
- What went wrong
- What could be improved
- Action items with owners and deadlines

### 14.2.7 Phase 7: Closure

- Confirm all actions completed
- Confirm all notifications sent
- Verify remediation effectiveness
- Update incident register
- Update risk register
- Update PIA/DPIA if affected
- Final report prepared
- Incident formally closed

## 14.3 Breach Notification Decision Tree

`
Privacy Incident Detected
    |
    v
Is it likely to result in risk to data subjects?
    |
    +-- No ? Document incident, no notification required (internal only)
    |
    +-- Yes ?
         |
         v
Is the risk high?
    |
    +-- No ? Notify supervisory authority, no individual notification unless required by national law
    |
    +-- Yes ? Notify supervisory authority AND affected data subjects
`

## 14.4 Incident Response Automation

### 14.4.1 Automated Detection

- PII access anomaly detection (unusual volume, unusual time, unusual location)
- DLP policy violation alerts
- Consent violation detection (processing without valid consent)
- Data exposure scanning (public cloud storage, exposed APIs)
- Dark web monitoring for leaked data

### 14.4.2 Automated Response

- Automated containment (revoke access, isolate system)
- Automated evidence collection (snapshot system, collect logs)
- Automated notification triggers (when criteria met)
- Automated ticketing (create incident in IR system)

## 14.5 Incident Response Team

### 14.5.1 Core Team

- **Incident Response Lead**: Coordination, decision-making, communication
- **Privacy Engineer**: Technical analysis, containment, remediation
- **DPO**: Regulatory compliance, notification decisions, SA liaison
- **Legal Counsel**: Legal advice, privilege, regulatory submissions
- **Communications/PR**: Internal and external messaging
- **Security Engineer**: Security analysis, forensics, containment (if security-related)

### 14.5.2 Extended Team (as needed)

- HR (employee-related incidents)
- IT (system restoration)
- Data Engineering (data pipeline incidents)
- Product (product-related privacy issues)
- Executive Sponsor (resource authorization, strategic decisions)
- External Counsel (for complex incidents)
- Forensic Investigators (for criminal/high-severity incidents)
- Cyber Insurance (to activate coverage and resources)

# P15: Vendor Privacy Assessment

## 15.1 Vendor Privacy Risk Overview

Vendors and third parties represent a significant privacy risk vector. Data shared with vendors remains the data controller's responsibility. A vendor's privacy failure is your privacy failure.

### 15.1.1 Vendor Privacy Risk Categories

- **Data Processing Risk**: Vendor processes personal data without adequate controls
- **Data Breach Risk**: Vendor security incident exposes shared data
- **Consent Violation Risk**: Vendor processes data beyond consented purpose
- **Cross-Border Risk**: Vendor transfers data to jurisdictions without adequacy
- **Subprocessor Risk**: Vendor engages subprocessors without authorization
- **Contractual Risk**: Inadequate DPAs, missing protections, insufficient audit rights
- **Concentration Risk**: Over-reliance on single vendor for critical privacy functions
- **Sunset/Transition Risk**: Vendor discontinuation leading to data abandonment

## 15.2 Vendor Assessment Process

### 15.2.1 Vendor Privacy Assessment Workflow

1. **Vendor identification**: Identify all vendors processing personal data
2. **Risk tiering**: Tier vendors by data sensitivity and processing criticality
3. **Questionnaire**: Send privacy assessment questionnaire
4. **Evidence review**: Review vendor privacy documentation and certifications
5. **DPIA for vendors**: Conduct DPIA for high-risk vendor processing
6. **DPA review**: Review and negotiate Data Processing Agreement
7. **Subprocessor review**: Review subprocessor list and approvals
8. **Approval**: Obtain DPO/legal approval for vendor engagement
9. **Ongoing monitoring**: Periodic review and monitoring of vendor privacy posture

### 15.2.2 Vendor Risk Tiering

| Tier | Criteria | Assessment Depth | Review Frequency |
|---|---|---|---|
| Tier 1: Critical | Processes SPI/PHI, large volume, cross-border, core function | Full DPIA, on-site audit, continuous monitoring | Quarterly |
| Tier 2: High | Processes PII, moderate volume, important function | Full assessment, documentation review, annual audit | Semi-annual |
| Tier 3: Medium | Processes limited PII, non-critical function | Standard questionnaire, DPA review | Annual |
| Tier 4: Low | No PII, aggregated data only, subprocessor no access | Self-assessment, standard terms | Biennial |

### 15.2.3 Assessment Questionnaire

**Section 1: Data Processing Overview**
- What personal data will you process on our behalf?
- What is the purpose of processing?
- What categories of data subjects are affected?
- What is the volume/scale of processing?
- What is the retention period for the data?

**Section 2: Data Protection Organization**
- Do you have a designated DPO or privacy lead?
- What privacy training do your personnel receive?
- What is your privacy organizational structure?
- Do you have a privacy incident response team?

**Section 3: Technical Controls**
- What encryption standards do you use (at rest, in transit)?
- What access controls do you have for our data?
- What is your identity and access management approach?
- What is your data segregation approach (multi-tenant vs. dedicated)?
- What is your backup and disaster recovery approach?
- What is your vulnerability management program?

**Section 4: Compliance and Certifications**
- What privacy certifications do you hold? (ISO 27701, SOC 2, ISO 27001, PCI DSS)
- Do you have DPF certification (if applicable)?
- Have you conducted a DPIA for your services?
- Do you have a privacy incident response plan?
- What is your breach notification process and timeline?

**Section 5: Subprocessors**
- List all subprocessors and their roles
- What is your subprocessor vetting process?
- How do you ensure subprocessor compliance?
- What notice is provided for subprocessor changes?

**Section 6: Cross-Border Transfers**
- Where is our data stored and processed?
- What cross-border transfer mechanisms apply?
- Do you have SCCs with your subprocessors?
- Have you conducted TIAs for relevant transfers?

## 15.3 Data Processing Agreement (DPA)

### 15.3.1 DPA Essential Terms

- **Parties and scope**: Who is involved, what processing is covered
- **Instructions**: Processor processes data only on documented instructions
- **Confidentiality**: Processor personnel bound by confidentiality
- **Security measures**: Technical and organizational measures
- **Subprocessing**: Authorization, notice, and approval mechanisms
- **Cross-border transfers**: Transfer mechanisms and safeguards
- **Data subject rights**: Processor assistance with DSR fulfillment
- **Assistance with compliance**: DPIA, SA consultation, breach notification
- **Breach notification**: Processor notification timeline and content
- **Data deletion/return**: Post-termination handling of data
- **Audit rights**: Controller's right to audit processor
- **Liability**: Liability allocation for privacy failures
- **Termination**: Termination rights for privacy breaches
- **Governing law**: Jurisdiction and dispute resolution

### 15.3.2 DPA Review Checklist

- [ ] Correct parties identified (controller/processor roles correct)
- [ ] Processing description complete and accurate
- [ ] Instructions clause allows written changes
- [ ] Confidentiality obligations adequate
- [ ] Security measures sufficiently detailed
- [ ] Subprocessor list complete, change notification adequate
- [ ] Cross-border transfers compliant with GDPR Chapter V
- [ ] DSR assistance clause includes all rights
- [ ] Breach notification timeline within regulatory requirements (24-48h)
- [ ] Deletion/return clause practical and verifiable
- [ ] Audit rights adequate (on-site or documentation review)
- [ ] Liability allocation reasonable
- [ ] DPA signed with effective date

## 15.4 Subprocessor Management

### 15.4.1 Subprocessor Vetting

- Review subprocessor privacy and security posture
- Ensure subprocessor has equivalent contractual protections
- Verify subprocessor certifications
- Conduct subprocessor risk assessment
- Review subprocessor breach history

### 15.4.2 Subprocessor Register

Maintain current register of all subprocessors:
- Subprocessor name and contact
- Subprocessor location
- Services provided
- Data accessed/processed
- Data flow between processor and subprocessor
- Contractual protections in place
- Audit history
- Approval status and date

## 15.5 Vendor Monitoring

### 15.5.1 Ongoing Monitoring

- Periodic reassessment (frequency based on tier)
- Security incident reports from vendor
- Vendor certification renewal tracking
- Vendor privacy policy changes review
- Subprocessor change notifications
- Breach notifications from vendor's other clients (industry-wide trends)
- Media monitoring for vendor privacy incidents

### 15.5.2 Vendor Offboarding

- Data deletion/return verification
- Access revocation
- Termination of DPAs
- Deletion certification from vendor
- Deletion of vendor access from internal systems
- Removal from vendor management system
- Documentation archived for audit trail


# P16: Worked Examples

## Example 1: E-Commerce Customer Analytics Pipeline

---

## EXPANDED PRIVACY CONTENT

This section contains expanded privacy engineering content (worked examples, anti-patterns, quality gates, appendices, implementation patterns).

Reference file: \eferences/expanded-content.md\ (96 KB, 1952 lines)

