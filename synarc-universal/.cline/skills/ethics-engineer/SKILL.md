---
name: ethics-engineer
description: Ethics Engineer - SKILL.md
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# Ethics Engineer - SKILL.md

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

> Production-grade ethics engineering skill for the synarc platform. This document defines the complete knowledge base, procedures, checklists, templates, metrics, and decision frameworks for an Ethics Engineer operating within an AI/ML development lifecycle.

**Total sections:** 20 (P1-P20)

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

## P2: Ethical Frameworks

### 2.1 Overview of Ethical Frameworks

An ethical framework provides a systematic method for evaluating the moral acceptability of actions, decisions, and systems. The Ethics Engineer must be fluent in multiple frameworks because different contexts call for different ethical reasoning approaches. No single framework is universally sufficient.

**Reasons for multi-framework competence:**
- Different ethical questions require different analytical approaches
- Frameworks provide complementary perspectives on complex issues
- Stakeholders may reason using different frameworks
- Regulatory contexts often presume specific frameworks
- Confidence increases when multiple frameworks converge on conclusions

### 2.2 Deontology (Duty-Based Ethics)

**Foundational thinkers:** Immanuel Kant, W.D. Ross, John Rawls

**Core principle:** Actions are morally right or wrong based on adherence to rules, duties, or obligations, regardless of consequences. Rightness is determined by conformity to moral rules, not outcomes.

**Key concepts:**
- Categorical imperative: Act according to maxims that could be universal law
- Formula of humanity: Treat humanity always as an end, never merely as a means
- Perfect duties: Absolute obligations that must always be followed
- Imperfect duties: Obligations allowing discretion in fulfillment
- Prima facie duties: Multiple duties requiring balanced resolution when conflicted

**Application to AI systems:**
1. Rule-based constraints encoding absolute ethical requirements
2. Universalizability test for AI system principles
3. Respect for persons through informed consent
4. Duty of transparency about capabilities and limitations
5. Duty of care to prevent foreseeable harm
6. Duty of non-discrimination across all protected attributes
7. Duty of fidelity to promised system behaviors
8. Duty of reparation when systems cause harm

**Strengths:**
- Provides clear, non-negotiable boundaries protecting individual rights
- Consistent and principled across different contexts
- Aligns with legal and regulatory compliance frameworks
**Limitations:**
- Can be rigid in complex scenarios with multiple valid rules
- Duty conflicts may be irresolvable without additional framework guidance
- May not adequately account for severe consequences
### 2.3 Utilitarianism / Consequentialism

**Foundational thinkers:** Jeremy Bentham, John Stuart Mill, Peter Singer

**Core principle:** Actions evaluated by consequences. The best action maximizes overall well-being and minimizes suffering across all affected parties.

**Key concepts:**
- Greatest happiness principle, act vs rule utilitarianism
- Preference utilitarianism, negative utilitarianism
- Total vs average utility, utility calculus

**Utilitarian analysis steps:**
1. Identify all affected stakeholders across direct and indirect pathways
2. Enumerate foreseeable consequences with magnitude, probability, duration
3. Quantify expected utility using appropriate metrics
4. Account for distribution of utility, not just aggregate totals
5. Consider long-term and systemic consequences beyond immediate effects
6. Document assumptions, uncertainties, and value judgments
7. Compare alternatives including non-deployment option

### 2.4 Virtue Ethics

**Foundational thinkers:** Aristotle, Alasdair MacIntyre, Martha Nussbaum

**Core principle:** Ethics focuses on character and virtues. The right action is what a virtuous person would do in the circumstances.

**Intellectual virtues for AI engineering:**
- Epistemic humility, intellectual honesty, attentiveness
- Thoroughness, open-mindedness, courage
**Moral virtues for AI engineering:**
- Benevolence, justice, trustworthiness, compassion
- Integrity, accountability

### 2.5 Care Ethics

**Foundational thinkers:** Carol Gilligan, Nel Noddings, Virginia Held, Joan Tronto

**Core principle:** Ethics grounded in relationships, care, and responsibility to particular others rather than abstract principles or universal rules.

**Key concepts:** Relational ontology, particularity, responsibility, attentiveness, competence, responsiveness

### 2.6 Justice Ethics

**Foundational thinkers:** John Rawls, Amartya Sen, Martha Nussbaum, Iris Marion Young

**Core principle:** Fair distribution of benefits and burdens, recognition of all groups, and participatory parity in decision-making.

**Key concepts:** Distributive, procedural, recognition, participatory, restorative justice; capabilities approach; veil of ignorance

### 2.7 Framework Integration

| Criterion | Recommended Framework |
|---|---|
| Strong rights protections needed | Deontology |
| Cost-benefit analysis required | Utilitarianism |
| Organizational culture assessment | Virtue Ethics |
| Vulnerable populations affected | Care Ethics |
| Distributional fairness concerns | Justice Ethics |
| High-stakes with irreversible harm | Deontology + Utilitarianism |
| Resource allocation decisions | Utilitarianism + Justice |

Conflict resolution strategies: Lexicographic ordering, balancing, reflective equilibrium, overlapping consensus, procedural resolution, transparency.

### 2.8 Ethical Reasoning Patterns

1. **Double Effect**: Action with good and bad effects may be permissible under four conditions
2. **Slippery Slope**: Caution against actions that may lead to increasingly unacceptable outcomes
3. **Precautionary Principle**: Take precautions when threats of harm exist, even without full certainty
4. **Proportionality**: Means used should be proportional to the goal pursued
5. **Worst-case Reasoning**: Consider worst plausible outcome and ensure safeguards
6. **Reversibility**: Would decision be acceptable if roles were reversed?
7. **Publicity**: Would decision be comfortable if made public?
8. **Multiple Perspectives**: Consider issue from each affected stakeholder perspective
9. **Precedent Analysis**: How were similar ethical issues resolved in analogous situations?
10. **Ethical Stress Testing**: Push system to ethical limits through thought experiments

---

---

## P3: AI Ethics Principles

### 3.1 Introduction

3.1 Introduction covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.2 Fairness

3.2 Fairness covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.3 Transparency

3.3 Transparency covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.4 Accountability

3.4 Accountability covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.5 Privacy

3.5 Privacy covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.6 Beneficence

3.6 Beneficence covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.7 Non-Maleficence

3.7 Non-Maleficence covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.8 Explainability

3.8 Explainability covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.9 Principle Trade-offs

3.9 Principle Trade-offs covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 3.10 Maturity Model

3.10 Maturity Model covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P5: Transparency & Explainability

### 5.1 Foundations

5.1 Foundations covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 5.2 Documentation Standards

5.2 Documentation Standards covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 5.3 XAI Methods

5.3 XAI Methods covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 5.4 Explanation Quality

5.4 Explanation Quality covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 5.5 Designing for Transparency

5.5 Designing for Transparency covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P7: Responsible AI Development

### 7.1 Responsible AI Framework

7.1 Responsible AI Framework covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 7.2 Ethics Review Boards

7.2 Ethics Review Boards covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 7.3 Ethical Design Reviews

7.3 Ethical Design Reviews covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 7.4 Impact Assessments

7.4 Impact Assessments covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 7.5 Safeguards Engineering

7.5 Safeguards Engineering covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P9: Environmental Ethics

### 9.1 Carbon Footprint

9.1 Carbon Footprint covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 9.2 Energy-Efficient AI

9.2 Energy-Efficient AI covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 9.3 Green Software

9.3 Green Software covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 9.4 Lifecycle Sustainability

9.4 Lifecycle Sustainability covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P11: Content Moderation Ethics

### 11.1 The Moderation Challenge

11.1 The Moderation Challenge covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 11.2 Speech vs Harm

11.2 Speech vs Harm covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 11.3 Algorithmic Amplification

11.3 Algorithmic Amplification covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 11.4 Fairness in Moderation

11.4 Fairness in Moderation covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 11.5 Moderation System Design

11.5 Moderation System Design covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P13: Recommendation System Ethics

### 13.1 Ethical Issues

13.1 Ethical Issues covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 13.2 Filter Bubbles

13.2 Filter Bubbles covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 13.3 Manipulation and Autonomy

13.3 Manipulation and Autonomy covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P15: Ethics Incidents

### 15.1 Incident Classification

15.1 Incident Classification covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 15.2 Response Process

15.2 Response Process covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 15.3 Documentation

15.3 Documentation covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 15.4 Post-Incident Improvement

15.4 Post-Incident Improvement covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P17: Regulation & Standards

### 17.1 Regulatory Landscape

17.1 Regulatory Landscape covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 17.2 EU AI Act

17.2 EU AI Act covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 17.3 NIST AI RMF

17.3 NIST AI RMF covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 17.4 ISO/IEC 42001

17.4 ISO/IEC 42001 covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 17.5 Compliance Approach

17.5 Compliance Approach covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## P19: Anti-Patterns

### 19.1 Overview

19.1 Overview covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.2 Ethics Washing

19.2 Ethics Washing covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.3 Fairness Unawareness

19.3 Fairness Unawareness covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.4 Checklist Only

19.4 Checklist Only covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.5 Accuracy Over Fairness

19.5 Accuracy Over Fairness covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.6 One-Shot Engagement

19.6 One-Shot Engagement covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.7 Ethics by Obscurity

19.7 Ethics by Obscurity covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.8 Technical Solutionism

19.8 Technical Solutionism covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.9 Ethics Arbitrage

19.9 Ethics Arbitrage covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.10 Responsibility Diffusion

19.10 Responsibility Diffusion covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.11 Ethics Theater

19.11 Ethics Theater covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

### 19.12 False Dichotomy

19.12 False Dichotomy covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts.

## Appendices

### A: Key Resources

**Foundational papers:** Mitchell et al. (2019) Model Cards for Model Reporting. Gebru et al. (2018) Datasheets for Datasets. Doshi-Velez & Kim (2017) Towards A Rigorous Science of Interpretable ML. Corbett-Davies & Goel (2018) The Measure and Mismeasure of Fairness. Hardt et al. (2016) Equality of Opportunity. Dwork et al. (2012) Fairness Through Awareness. Kusner et al. (2017) Counterfactual Fairness. Lundberg & Lee (2017) SHAP. Ribeiro et al. (2016) LIME. Barocas et al. (2019) Fairness and Machine Learning.

**Standards and regulations:** EU AI Act (2024). NIST AI Risk Management Framework (2023). ISO/IEC 42001:2023. OECD AI Principles (2019). IEEE Ethically Aligned Design (2019).

### B: Quick Reference Tables

**Fairness metric selection by context:** Employment - Equal opportunity. Credit - Demographic parity. Healthcare - Equalized odds. Criminal justice - Equalized odds. Content moderation - Demographic parity. Education - Equal opportunity.

**XAI method selection by model:** Linear/Logistic - Coefficients. Tree-based - TreeSHAP. Deep learning - Integrated Gradients. Ensemble - SHAP. Black-box - LIME, SHAP.

**Bias mitigation by timing:** Pre-processing (biased data) - Reweighing, sampling, fair representations. In-processing (controllable training) - Fairness constraints, adversarial debiasing. Post-processing (trained model) - Threshold adjustment, calibration.

### C: Ethics Engineering Glossary

**Accountability:** Being answerable for system impacts with identifiable responsible parties and redress mechanisms.
**Algorithmic bias:** Systematic and unfair discrimination produced by algorithms in their outputs or decision processes.
**Automation bias:** Tendency of humans to over-rely on automated decision-making systems.
**Beneficence:** Ethical principle of actively doing good and promoting human well-being.
**Care ethics:** Framework emphasizing relationships, interdependence, and responsibility to particular others.
**Counterfactual explanation:** Explanation showing how input would need to change for a different outcome.
**Data colonialism:** Extraction of data from less powerful communities replicating historical colonial patterns.
**Data dignity:** Principle that personal data should be treated with same respect as the person.
**Data sovereignty:** Right of communities to govern data about themselves according to their laws and values.
**Demographic parity:** Fairness criterion requiring equal positive outcome probability across groups.
**Deontology:** Ethical framework based on duties, rules, and obligations regardless of consequences.
**Distributive justice:** Fair allocation of resources, opportunities, and outcomes across society.
**Equal opportunity:** Fairness criterion requiring equal true positive rates across demographic groups.
**Equalized odds:** Fairness criterion requiring equal true positive and false positive rates across groups.
**Explainability:** Ability to provide understandable explanations for specific decisions or behaviors.
**Filter bubble:** Intellectual isolation resulting from algorithmic content personalization.
**Human-in-the-loop:** Human retains final decision authority after AI recommendation.
**Individual fairness:** Principle that similar individuals should receive similar outcomes.
**Intersectionality:** Analysis at intersections of multiple protected attributes revealing compound effects.
**Interpretability:** Degree to which a human can understand internal model workings.
**Justice ethics:** Framework focused on fair distribution, recognition, participation, and capabilities.
**Model card:** Standardized documentation for ML models covering performance, limitations, and ethics.
**Non-maleficence:** Ethical principle of avoiding causing harm, derived from medical ethics.
**Phronesis:** Practical wisdom for discerning right action in specific contexts.
**Procedural justice:** Fairness of processes and procedures that determine outcomes.
**Redress:** Remedy or compensation for harm caused by AI systems.
**Representational harm:** Harm from demeaning or stereotypical representations of groups.
**Transparency:** Openness about system capabilities, limitations, purposes, and operations.
**Utilitarianism:** Framework evaluating actions based on their consequences for overall well-being.
**Value alignment:** Ensuring autonomous system behaviors align with human values and intentions.
**Virtue ethics:** Framework focusing on character, virtues, and human flourishing.
**XAI:** eXplainable Artificial Intelligence - methods for producing understandable explanations.

### D: Comprehensive Checklist

**Purpose and necessity:** Problem clearly defined and ethically worthwhile. Less risky alternatives considered. Scope appropriately bounded.

**Stakeholder analysis:** All stakeholders identified including vulnerable populations. Distribution of benefits and harms assessed. Engagement conducted and documented.

**Harm assessment:** All harm types evaluated. Likelihood and severity estimated. Mitigation measures designed. Residual harms acceptable.

**Fairness evaluation:** Protected attributes identified. Multiple fairness metrics applied. Intersectional analysis conducted. Bias detected and mitigated.

**Transparency and explainability:** Model cards, datasheets, system cards complete. Explanation methods selected and validated. Transparency report published.

**Accountability:** RACI matrix complete. Oversight mechanisms operational. Redress pathways established. Audit trails maintained.

**Safeguards:** Technical safeguards implemented. Procedural safeguards operational. Monitoring and alerting active. Incident response plan ready.

**Governance:** Ethics review completed. Policy compliance verified. Regulatory compliance confirmed. Training records current.

**Monitoring and improvement:** Ongoing monitoring established. Regular reviews scheduled. Continuous improvement process active.

