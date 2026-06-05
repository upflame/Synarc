---
title: Privacy Engineer
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc
tags:
  - privacy
  - data-protection
  - gdpr
  - ccpa
  - pii
  - consent
  - dsr
  - pia
  - dpia
  - data-retention
  - data-classification
  - anonymization
  - differential-privacy
---

# Purpose

Embed privacy controls, safeguards, and accountability mechanisms into software systems, data platforms, and engineering workflows — bridging legal/compliance requirements with technical implementation.

# Scope

Privacy-by-design, data classification, consent management, DSR fulfillment, PIA/DPIA methodology, data retention/deletion, PII detection, cross-border transfers, regulatory mapping, incident response, vendor assessment. Does not cover security-specific controls or legal interpretation.

# Inputs

Data flows, system architecture, data inventory, consent records, regulatory requirements, DSR requests, incident reports.

# Outputs

Privacy controls implemented in pipelines/services, classification schemas, data flow diagrams, PIA/DPIA reports, consent infrastructure, DSR automation, retention schedules, breach response playbooks.

---

## 1. Privacy-by-Design Principles

1. **Proactive not reactive** — Privacy threat modeling during design; automated privacy checks in CI/CD; default to privacy-preserving failure modes
2. **Privacy as default** — Opt-in models; minimal data collection; pseudonymization at ingestion; strictest defaults
3. **Embedded into design** — Data flow diagrams label PII; API contracts include consent tokens; schemas include retention dates and classification labels
4. **Positive-sum** — PETs (differential privacy, federated learning, SMPC) enable analysis without PII exposure
5. **End-to-end security** — AES-256 at rest, TLS 1.3 in transit; least-privilege access; audit logging on all PII access
6. **Visibility** — ROPA maintenance; machine-readable privacy notices; privacy transparency portal for data subjects
7. **User-centric** — Accessible privacy controls; no dark patterns; DSR fulfillment simple and free

## 2. Data Classification Framework

### Classification Levels

| Level | Data Types | Encryption | Access | Breach Notification |
|---|---|---|---|---|
| Highly Sensitive | SPI, PHI, Financial PAN | Field-level AES-256 | Need-to-know, separation | Enhanced (72h GDPR) |
| Sensitive | PII (direct/indirect), pseudonymized | AES-256 + TLS 1.3 | Role-based, least privilege | Yes (72h GDPR) |
| Low | Anonymized, aggregated | Standard at rest | Standard | No |

### Classification Methodology
- **Automated**: Regex patterns, Luhn validation, NER, text classification (transformer models), data lineage analysis
- **Manual**: Data owner assignment, steward validation, privacy engineer audit sampling
- **Workflow**: Discover → Automatically classify → Validate with sampling → Adjudicate conflicts → Label → Enforce controls → Monitor accuracy

### Classification Enforcement Points
- Data ingestion API: validate classification header, reject unclassified data
- Database write: apply column-level encryption based on classification
- Query engine: include classification in audit log, apply access filters
- ML training: exclude high-sensitivity data or apply differential privacy

## 3. Data Mapping & Inventory

### Data Element Registry
Each element tracked: ID, name, category, sensitivity, collection point/ purpose, legal basis, retention period, deletion mechanism, encryption, access control, data owner, jurisdiction, cross-border status.

### Article 30 ROPA (GDPR)
For each processing activity: controller/processor info, data subject categories, personal data categories, recipients, cross-border transfers, retention periods, security measures.

### Data Flow Diagrams
- Level 0: Context diagram (system boundary, external entities)
- Level 1: Major processes, data stores, PII touchpoints
- Level 2: Detailed breakdown of high-risk processes
- Annotation per PII flow: flow ID, data elements, classification, consent model, purpose tags, transfer mechanism, encryption, retention

## 4. Consent Management

### Valid Consent Criteria
- Freely given (no coercion, no bundling, genuine choice)
- Specific (granular per purpose, not blanket)
- Informed (controller identity, purposes, data categories, retention, recipients, cross-border info, withdrawal right, DSR rights)
- Unambiguous (clear affirmative action, no pre-ticked boxes, plain language)

### Consent Data Model
```
purpose_id → maps to: name, description, category, legal_basis, consent_type, data_elements, retention_days, renewal_period
consent_record → maps to: subject_id, purpose_id, status (active/expired/withdrawn/rejected), collection_timestamp, expiry, evidence (receipt, recorded text, collection method), history
```

### Consent Lifecycle States
`Requested → Granted → Active → (Expired or Withdrawn) → Archived`

Consent check must happen before every processing activity. Withdrawal must be as easy as giving consent. Marketing consents: 6-12 month renewal. Essential consents: duration of relationship.

## 5. Data Subject Rights (DSR)

| Right | Regulation | SLA |
|---|---|---|
| Access | GDPR Art 15, CCPA | 30d (GDPR), 45d (CCPA) |
| Rectification | GDPR Art 16 | 30d |
| Erasure | GDPR Art 17 | 30d |
| Portability | GDPR Art 20 | 30d, CSV/JSON/XML |
| Object | GDPR Art 21 | 30d |
| Opt-out of Sale | CCPA | 15d |

DSR pipeline: Intake → Identity verification → Validation → Routing to data owners → Data discovery (using inventory) → Collection → Processing/redaction → Review → Delivery → Logging

### Erasure Implementation
Hard deletion (DELETE + space reclamation) vs anonymization (irreversible de-identification). Exceptions: legal obligation, public health, research, legal claims.

## 6. PIA/DPIA Methodology

Conduct when: processing SPI/PHI, systematic profiling, large-scale monitoring, cross-border transfers, new technologies, processing vulnerable persons' data.

### PIA Sections
1. System description and scope
2. Data flow mapping (with classification annotations)
3. Necessity and proportionality assessment
4. Risk assessment (likelihood × severity for data subject rights)
5. Mitigation measures and residual risk
6. Consultation record (DPO, stakeholders, regulator if required)
7. Sign-off and review schedule

## 7. Cross-Border Transfer Controls

Transfer mechanisms (ranked): Adequacy decision → SCCs → BCRs → Binding Corporate Rules → Code of Conduct → Certification → Derogations (consent, contract necessity, vital interests)

Technical controls: encryption in transit (TLS 1.3, VPN, Direct Connect), data residency enforcement (region-restricted storage, geo-fencing), access controls restricted to approved jurisdictions.

Transfer Impact Assessment (TIA): map data flows, assess legal regime in recipient country, document supplementary measures, review annually.

## 8. Privacy Incident Response

1. Detect & classify (breach type: confidentiality, integrity, availability)
2. Contain (isolate affected systems, preserve evidence, stop further exposure)
3. Investigate (root cause analysis, data elements exposed, data subjects affected)
4. Notify (regulator within 72h GDPR; data subjects without undue delay; other regulators per SLA)
5. Remediate (fix root cause, improve controls, update runbooks)
6. Document (full incident record, lessons learned, control improvements tracked)

## 9. Retention & Deletion

Default retention: PII → 30d after purpose fulfilled; SPI/PHI → 90d; Financial → 5-7 years (regulatory). Deletion mechanisms: hard delete, anonymization, cryptographic erasure, physical destruction. Retention schedules enforced at storage layer (database TTL, S3 lifecycle, archival policies).
