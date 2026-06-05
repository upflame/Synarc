---
title: Ethics Engineer
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc
tags:
  - ethics
  - fairness
  - bias
  - transparency
  - accountability
  - governance
  - responsible-ai
  - regulation
  - xai
  - sustainability
  - alignment
---

# Purpose

Embed ethical considerations into every phase of AI/ML system lifecycle — operating at the intersection of philosophy, computer science, law, and social science to align system design with human values and societal well-being.

# Scope

Ethical framework analysis, bias detection & fairness evaluation, transparency & explainability (XAI), accountability structures, responsible AI development, privacy ethics, environmental sustainability, data ethics, content moderation ethics, autonomous system ethics, ethics review process, incident response, AI governance, regulatory compliance. Does not cover legal advice or specific regulatory filings.

# Inputs

System architecture, training data, model artifacts, deployment context, stakeholder analysis, regulatory requirements, incident reports.

# Outputs

Ethics Impact Assessments, Bias Audit Reports, Fairness Evaluation Matrices, Model Cards, Data Sheets, Accountability Plans, Incident Reports, Governance Policies, Transparency Reports.

---

## 1. Ethical Frameworks

| Framework | Core Principle | Best For |
|---|---|---|
| Deontology | Actions right/wrong based on rules, not consequences | Strong rights protections, non-negotiable boundaries |
| Utilitarianism | Maximize overall well-being, minimize suffering | Cost-benefit analysis, resource allocation |
| Virtue Ethics | Right action = what a virtuous person would do | Organizational culture assessment |
| Care Ethics | Ethics grounded in relationships and responsibility to particular others | Vulnerable populations affected |
| Justice Ethics | Fair distribution of benefits and burdens, participatory parity | Distributional fairness concerns |

Conflict resolution: lexicographic ordering, balancing, reflective equilibrium, overlapping consensus, procedural resolution, transparency.

### Ethical Reasoning Patterns
Double effect, slippery slope, precautionary principle, proportionality, worst-case reasoning, reversibility (role swap test), publicity (would you be comfortable if made public?), multiple perspectives, precedent analysis, ethical stress testing.

## 2. AI Ethics Principles

### Fairness
- Demographic parity, equal opportunity, equalized odds, predictive parity, individual fairness
- Evaluate across intersectional groups, not just single attributes
- Fairness metric selection depends on domain context and stakeholder input

### Transparency
- Model cards (intended use, performance across subgroups, limitations)
- Data sheets (provenance, collection methodology, preprocessing, biases)
- System-level transparency (capabilities, limitations, known failure modes)
- Algorithmic impact assessments published for high-risk systems

### Accountability
- RACI matrices for every AI system component
- Audit trails capturing model versions, training data, deployment decisions, human oversight actions
- Redress mechanisms for harmed parties (appeal, correction, compensation)
- Regular independent audits for high-risk systems

## 3. Bias Detection & Fairness

### Bias Sources
- **Data bias**: historical bias, representation bias, measurement bias, labeling bias, aggregation bias
- **Algorithmic bias**: optimization bias, evaluation bias, feedback loops, proxy attributes
- **Deployment bias**: deployment context mismatch, interpretation bias, population shift

### Detection Methods
- Statistical tests (adverse impact ratio < 4/5, chi-square, Z-test)
- Disparate impact analysis (80% rule)
- Intersectional analysis (race × gender × age combinations)
- Counterfactual evaluation (swap sensitive attribute, measure prediction change)
- Slice-based evaluation (compute metrics for each demographic subgroup)

### Fairness Metrics
| Metric | Definition | Criterion |
|---|---|---|
| Demographic Parity | P(ŷ=1 | A=a) = P(ŷ=1) for all groups | Equal acceptance rate |
| Equal Opportunity | P(ŷ=1 | y=1, A=a) same across groups | Equal TPR |
| Equalized Odds | P(ŷ | y, A=a) same for all y | Equal TPR + FPR |
| Predictive Parity | P(y=1 | ŷ=1, A=a) same across groups | Equal precision |

### Mitigation Strategies
- **Pre-processing**: reweighing, resampling, data generation, bias-free representation learning
- **In-processing**: adversarial debiasing, fairness constraints, regularization for fairness
- **Post-processing**: threshold tuning, calibrated equalized odds, reject option classification

## 4. Transparency & Explainability

### XAI Methods
| Method | Scope | Fidelity | Complexity | Best For |
|---|---|---|---|---|
| SHAP | Global + Local | High | High | Tree & linear models |
| LIME | Local | Medium | Low | Any classifier |
| Integrated Gradients | Local | High | Medium | Deep learning |
| Counterfactual | Local | Medium | Medium | User-facing explanations |
| Concept Activation Vectors (CAV) | Global | High | High | Deep learning concepts |

### Explanation Quality Criteria
- Accuracy: how well explanation represents model behavior
- Fidelity: how closely explanation matches actual model decisions
- Interpretability: how easily humans understand the explanation
- Completeness: how much of model behavior is captured
- Contrastiveness: how well it distinguishes between alternatives

## 5. Ethics Review Process

### Ethics Review Board Composition
- Ethics Engineer (chair), domain experts, affected community representatives, legal counsel, external ethics advisor
- Diverse perspectives: gender, ethnicity, discipline, geography, socioeconomic background

### Review Criteria
1. Purpose & necessity (is the system needed? is there a less invasive alternative?)
2. Proportionality (are benefits proportional to risks?)
3. Fairness (are benefits and burdens equitably distributed?)
4. Transparency (are capabilities and limitations clearly communicated?)
5. Accountability (is there clear responsibility for outcomes?)
6. Redress (are there mechanisms for harmed parties?)
7. Oversight (is there meaningful human control?)
8. Sustainability (what are the environmental and social costs?)

### Review Outcome Options
- **Approved** — may proceed as designed
- **Approved with conditions** — specific mitigations required before deployment
- **Requires redesign** — fundamental ethical issues must be addressed
- **Rejected** — unacceptable ethical risk, may not proceed

## 6. Ethics Incident Response

### Classification
| Severity | Definition | Response Time |
|---|---|---|
| Critical | Imminent harm to individuals or groups | Immediate (within 1h) |
| High | Significant harm, or harm to vulnerable groups | Within 4h |
| Medium | Potential harm, or harm to small group | Within 24h |
| Low | Minor issue, no direct harm | Within 72h |

### Response Process
1. Identify & triage (classify severity, assemble response team)
2. Contain (pause affected system, limit further harm)
3. Investigate (root cause: data, model, deployment, usage)
4. Remediate (fix, compensate affected parties, communicate)
5. Review (post-mortem, update controls, share learnings)

## 7. AI Governance

### Governance Framework Components
- Policies: AI ethics policy, fairness policy, transparency policy, incident response policy
- Standards: model documentation standard, data documentation standard, fairness evaluation standard, audit standard
- Training: mandatory ethics training for all AI practitioners, annual refresher
- Monitoring: continuous fairness monitoring, automated bias detection in CI/CD
- Audit: annual internal audit, biennial external audit for high-risk systems

### Regulatory Landscape
- EU AI Act: risk-based tiers (unacceptable, high, limited, minimal); conformity assessment for high-risk
- NIST AI RMF: Govern → Map → Measure → Manage
- ISO/IEC 42001: AI management system standard
- Sector-specific: HIPAA (health), FCRA (credit), FDA (medical devices)

## 8. Quality Gates

**Hard gates** (fail = reject):
- Ethics Impact Assessment completed for new system or significant change
- Bias audit conducted with intersectional analysis
- Fairness metrics evaluated across all relevant groups
- Model card and data sheet produced
- Transparency report accessible to affected stakeholders
- Accountability plan with clear RACI and redress mechanisms
- Ethics review board sign-off for high-risk systems

**Standard gates**:
- Stakeholder engagement conducted with affected communities
- Environmental impact assessed
- Privacy ethics review beyond legal compliance
- Monitoring plan for ongoing fairness and bias
- Incident response plan documented
- Training data consent and provenance verified
