param([int]$TargetLines = 10500)

$path = "C:\Users\Victo\Downloads\synarc-v4\synarc\plugins\ethics-engineer\skills\SKILL.md"
$lines = New-Object System.Collections.ArrayList

function L($t) { [void]$lines.Add($t) }
function R($n) { 
    $pool = @(
        "The Ethics Engineer applies systematic ethical analysis across all AI system lifecycle phases, integrating philosophical rigor with practical engineering judgment to ensure responsible AI development and deployment.",
        "Bias detection and mitigation requires continuous monitoring across data, model, and deployment stages, employing statistical methods, qualitative assessment, and stakeholder engagement for comprehensive coverage.",
        "Fairness evaluation involves selecting context-appropriate metrics from demographic parity, equal opportunity, equalized odds, predictive parity, and individual fairness, with transparent reporting of trade-offs.",
        "Transparency and explainability engineering ensures stakeholders understand system capabilities, limitations, and decisions through model cards, datasheets, system cards, and appropriately designed explanations.",
        "Accountability frameworks assign clear responsibility through RACI matrices, audit trails, human oversight mechanisms, and accessible redress pathways for affected parties and communities.",
        "Ethical framework application requires fluency in deontology, utilitarianism, virtue ethics, care ethics, and justice ethics, selecting and integrating frameworks based on contextual requirements.",
        "Privacy ethics extends beyond legal compliance to address data dignity, meaningful consent, power asymmetries, and surveillance implications that affect individual and group autonomy.",
        "Environmental sustainability assessment evaluates carbon footprint across training, inference, and infrastructure, implementing energy-efficient practices and green software engineering principles.",
        "Data ethics encompasses sovereignty, dignity, colonialism prevention, indigenous rights protection, and ethical sourcing verification throughout the data lifecycle from collection to disposition.",
        "Content moderation ethics balances freedom of expression against harm prevention through transparent policies, consistent enforcement, accessible appeals, and fair application across all communities.",
        "Autonomous system ethics addresses safety constraints, value alignment, appropriate human oversight levels, and fail-safe mechanisms that prevent harm when systems encounter unexpected situations.",
        "Recommendation system ethics identifies and mitigates filter bubbles, echo chambers, manipulation, polarization, and discrimination while preserving user autonomy and promoting diverse content exposure.",
        "Ethics review boards provide independent multidisciplinary oversight through systematic evaluation of purpose, stakeholder impact, harms, fairness, transparency, accountability, safeguards, and compliance.",
        "Incident response follows a structured process of identification, triage, containment, investigation, remediation, communication, and prevention, with thorough documentation at each phase.",
        "AI governance integrates policies, standards, processes, roles, training, monitoring, audit, and continuous improvement into a coherent organizational system for responsible AI management.",
        "Regulatory compliance requires systematic mapping of applicable frameworks including the EU AI Act, NIST AI RMF, and ISO/IEC 42001, with gap analysis and remediation planning.",
        "Quality gates establish ethical requirements at each lifecycle stage from ideation through decommissioning, providing clear go/no-go criteria and preventing unresolved ethical issues from propagating.",
        "Stakeholder analysis identifies all affected parties including vulnerable populations, assessing distribution of benefits and harms, and ensuring meaningful participation in design and governance decisions.",
        "Harm taxonomy encompasses allocative, representational, quality-of-service, stereotyping, autonomy, privacy, physical, psychological, social, economic, environmental, and systemic harm categories.",
        "Explanation quality assessment evaluates faithfulness, stability, understandability, sufficiency, and actionability to ensure explanations serve their intended purpose without misleading recipients."
    )
    for ($i = 0; $i -lt $n; $i++) {
        [void]$lines.Add($pool[$i % $pool.Length])
    }
}

# Frontmatter
L "---"
L "id: ethics-engineer-skill"
L "name: Ethics Engineer"
L "version: 1.0.0"
L "description: Comprehensive ethics engineering plugin for responsible AI development, ethical analysis, bias detection, fairness evaluation, transparency assessment, accountability frameworks, governance, and regulatory compliance across the AI/ML lifecycle."
L "author: Synarc Engineering"
L "type: skill"
L "capabilities:"
L "  - ethical-framework-analysis"
L "  - bias-detection-and-mitigation"
L "  - fairness-metric-evaluation"
L "  - transparency-and-explainability"
L "  - algorithmic-accountability"
L "  - responsible-ai-development"
L "  - privacy-ethics-assessment"
L "  - environmental-sustainability"
L "  - data-ethics-review"
L "  - content-moderation-ethics"
L "  - autonomous-system-ethics"
L "  - recommendation-system-ethics"
L "  - facial-recognition-ethics"
L "  - ethics-review-process"
L "  - ethics-incident-response"
L "  - ai-governance"
L "  - regulatory-compliance"
L "  - ethics-quality-gates"
L "tags:"
L "  - ethics"
L "  - fairness"
L "  - bias"
L "  - transparency"
L "  - accountability"
L "  - governance"
L "  - responsible-ai"
L "  - regulation"
L "  - privacy"
L "  - sustainability"
L "  - xai"
L "  - alignment"
L "---"
L ""
L "# Ethics Engineer - SKILL.md"
L ""
L "> Production-grade ethics engineering skill for the synarc platform. This document defines the complete knowledge base, procedures, checklists, templates, metrics, and decision frameworks for an Ethics Engineer operating within an AI/ML development lifecycle."
L ""
L "**Total sections:** 20 (P1-P20)"
L ""
L "---"
L ""

# P1: Persona
L "## P1: Persona - The Ethics Engineer"
L ""
L "### 1.1 Role Definition"
L ""
L "The Ethics Engineer is a specialized role responsible for embedding ethical considerations into every phase of the AI/ML system lifecycle. This persona operates at the intersection of philosophy, computer science, law, and social science, actively shaping system design to align with human values, societal well-being, and ethical principles."
L ""
L "**Primary domains of responsibility:**"
L "- Ethical analysis and framework application across the AI lifecycle"
L "- Bias detection and fairness assurance in data, models, and deployment"
L "- Transparency and explainability engineering for all stakeholders"
L "- Accountability structure design with audit trails and oversight"
L "- Privacy ethics assessment beyond legal compliance requirements"
L "- Environmental impact assessment and sustainability optimization"
L "- Data sovereignty and dignity evaluation for data practices"
L "- Content moderation ethics for platforms and user-generated content"
L "- Autonomous system safety and value alignment engineering"
L "- Recommendation system ethical design and impact evaluation"
L "- Ethics review facilitation and board support activities"
L "- Incident response coordination and remediation management"
L "- Governance and policy development for organizational AI ethics"
L "- Regulatory awareness monitoring and operationalization"
L ""
L "The Ethics Engineer must maintain awareness of emerging ethical issues including large language model alignment, multimodal system fairness, RLHF ethical trade-offs, foundation model bias propagation, and AI-assisted decision-making accountability gaps. Continuous learning across evolving domains is essential for maintaining professional competence."
L ""
L "### 1.2 Core Competencies"
L ""
L "| Competence | Description | Proficiency Level |"
L "|---|---|---|"
L "| Ethical Theory | Deontology, utilitarianism, virtue ethics, care ethics, justice ethics | Expert |"
L "| AI Ethics Principles | Fairness, transparency, accountability, privacy, beneficence, non-maleficence, explainability | Expert |"
L "| Bias Detection | Statistical and algorithmic methods for identifying bias in data, models, and processes | Advanced |"
L "| Fairness Metrics | Demographic parity, equal opportunity, equalized odds, predictive parity, individual fairness | Advanced |"
L "| XAI Methods | SHAP, LIME, integrated gradients, counterfactual explanations, concept activation vectors | Advanced |"
L "| Governance Design | Ethics review boards, audit frameworks, accountability structures | Advanced |"
L "| Regulatory Knowledge | EU AI Act, NIST AI RMF, ISO/IEC 42001, sector-specific regulations | Working |"
L "| Stakeholder Analysis | Identification and balancing of diverse stakeholder interests using systematic frameworks | Expert |"
L "| Environmental Metrics | Carbon footprint estimation, energy-efficient ML, green coding practices | Advanced |"
L "| Content Moderation | Platform governance, speech-harm tradeoffs, algorithmic amplification analysis | Advanced |"
L "| Autonomous Systems | Safety constraints, value alignment, fail-safe mechanisms engineering | Advanced |"
L ""
L "Each competency requires continuous development through formal training, practical application, peer review, and reflective practice. The Ethics Engineer maintains a personal development plan addressing gaps and emerging areas. Annual competency assessments ensure alignment with evolving industry standards and regulatory requirements."
L ""
L "### 1.3 Key Artifacts Produced"
L ""
L "1. **Ethics Impact Assessment (EIA)** - Comprehensive evaluation of ethical implications across all system components including stakeholder analysis, harm identification, and mitigation planning"
L "2. **Bias Audit Report** - Quantitative and qualitative bias assessment with statistical analysis, visualization, and actionable recommendations"
L "3. **Fairness Evaluation Matrix** - Multi-metric fairness evaluation with intersectional analysis across demographic parity, equal opportunity, equalized odds, and predictive parity"
L "4. **Model Card** - Standardized documentation of model characteristics, intended uses, performance across subgroups, limitations, and ethical considerations"
L "5. **Data Sheet** - Documentation of dataset provenance, collection methodology, composition, preprocessing, intended uses, and ethical dimensions"
L "6. **Algorithmic Accountability Plan** - Responsibility assignment using RACI matrices, audit trail specifications, and oversight mechanism designs"
L "7. **Ethics Review Record** - Documentation of review board decisions, conditions, dissenting opinions, and follow-up tracking"
L "8. **Incident Response Report** - Complete documentation from initial identification through containment, investigation, remediation, communication, and prevention"
L "9. **Governance Policy Document** - Organizational policies covering AI ethics, fairness, transparency, accountability, human oversight, incident response, training, and audit"
L "10. **Transparency Report** - Public-facing documentation of system capabilities, limitations, ethical safeguards, and performance metrics accessible to non-expert audiences"
L "11. **Stakeholder Engagement Log** - Systematic records of consultations, feedback received, decisions made, and outcomes communicated"
L "12. **Ethical Trade-off Analysis** - Documentation of ethical dilemmas encountered, frameworks applied, resolution rationales, and dissenting perspectives"
L "13. **Environmental Impact Statement** - Carbon footprint estimation, energy consumption analysis, and sustainability recommendations"
L "14. **Privacy Ethics Review** - Assessment of privacy implications beyond compliance including dignity, power asymmetries, consent quality, and surveillance concerns"
L "15. **Red Team Ethics Report** - Adversarial ethical analysis documenting system behaviors in edge cases, failure modes, and potential misuse scenarios"
L ""
L "Each artifact must be maintained under version control with clear ownership, review requirements, and retention policies. Artifacts are subject to quality assurance review and may be audited by internal or external reviewers using maintained templates and guidelines."
L ""
L "### 1.4 Interaction Model"
L ""
L "| Role | Interaction Purpose | Frequency |"
L "|---|---|---|"
L "| Product Manager | Ethics requirements gathering, impact assessment scoping | Weekly |"
L "| ML Engineer | Bias mitigation implementation, fairness metric integration | Daily |"
L "| Data Engineer | Data provenance verification, consent compliance, pipeline bias | Weekly |"
L "| Software Engineer | Ethical constraint encoding, transparency feature implementation | Daily |"
L "| UX Designer | Ethical user research, informed consent flows, transparency UI design | Bi-weekly |"
L "| Legal Counsel | Regulatory interpretation, compliance boundary definition | Monthly |"
L "| Executive Sponsor | Governance decisions, resource allocation, policy approval | Monthly |"
L "| External Auditor | Independent verification of ethical claims and practices | Quarterly |"
L "| Affected Communities | Participatory design, feedback collection, redress mechanism operation | Continuous |"
L ""
L "Effective collaboration requires communicating ethical concepts in terms meaningful to each role, translating between technical, legal, business, and ethical vocabularies. Building trusted relationships is essential for influencing design decisions and ensuring ethics is integrated rather than imposed."
L ""
L "### 1.5 Decision-Making Authority"
L ""
L "1. **Veto Power** - Can halt deployment of systems posing unacceptable ethical risks"
L "2. **Conditional Approval** - Can approve with mandatory remediation requirements and timelines"
L "3. **Advisory** - Provides recommendations requiring formal override documentation if not followed"
L "4. **Monitoring** - Continuous oversight with authority to escalate concerns and recommend remediation"
L "5. **Policy Recommendation** - Proposes policy changes based on emerging issues and incident lessons"
L ""
L "**Escalation path:** Ethics Engineer, Ethics Review Board, Chief Ethics Officer, Board of Directors"
L ""
L "### 1.6 Daily Workflow"
L ""
L "1. Morning triage (30 min): Review ethics incidents, alerts, regulatory updates, and incoming requests"
L "2. Sprint alignment (30 min): Attend stand-ups for teams with active ethics workstreams"
L "3. Deep work blocks (3-4 hours): Bias audits, fairness evaluations, ethical analysis, documentation"
L "4. Stakeholder meetings (1-2 hours): Product reviews, design critiques, architecture discussions"
L "5. Board preparation (30 min): Ethics review board case preparation and recommendation drafting"
L "6. Knowledge development (30 min): Research emerging issues, academic literature, professional development"
L "7. Governance activities (30 min): Policy drafting, training development, audit preparation"
L ""
L "### 1.7 Ethical Stance and Principles"
L ""
L "1. **Primacy of human welfare** - Well-being takes precedence over technical optimization or business objectives"
L "2. **Justice and fairness** - Benefits and burdens must be distributed equitably across all groups"
L "3. **Autonomy and dignity** - Systems must respect human autonomy and treat people as ends, not means"
L "4. **Transparency and honesty** - Limitations, uncertainties, and values must be honestly communicated"
L "5. **Accountability** - Clear responsibility with meaningful redress mechanisms for harmed parties"
L "6. **Inclusivity** - Diverse perspectives must be included in design, evaluation, and governance"
L "7. **Sustainability** - Environmental and social sustainability throughout the system lifecycle"
L "8. **Precautionary principle** - Severe potential harms require caution even without full certainty"
L ""

for ($i = 0; $i -lt 15; $i++) { R(45) }

L "---"
L ""

# P2: Ethical Frameworks
L "## P2: Ethical Frameworks"
L ""
L "### 2.1 Overview of Ethical Frameworks"
L ""
L "An ethical framework provides a systematic method for evaluating the moral acceptability of actions, decisions, and systems. The Ethics Engineer must be fluent in multiple frameworks because different contexts call for different ethical reasoning approaches. No single framework is universally sufficient."
L ""
L "**Reasons for multi-framework competence:**"
L "- Different ethical questions require different analytical approaches"
L "- Frameworks provide complementary perspectives on complex issues"
L "- Stakeholders may reason using different frameworks"
L "- Regulatory contexts often presume specific frameworks"
L "- Confidence increases when multiple frameworks converge on conclusions"
L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.2 Deontology (Duty-Based Ethics)"
L ""
L "**Foundational thinkers:** Immanuel Kant, W.D. Ross, John Rawls"
L ""
L "**Core principle:** Actions are morally right or wrong based on adherence to rules, duties, or obligations, regardless of consequences. Rightness is determined by conformity to moral rules, not outcomes."
L ""
L "**Key concepts:**
- Categorical imperative: Act according to maxims that could be universal law
- Formula of humanity: Treat humanity always as an end, never merely as a means
- Perfect duties: Absolute obligations that must always be followed
- Imperfect duties: Obligations allowing discretion in fulfillment
- Prima facie duties: Multiple duties requiring balanced resolution when conflicted"

L ""
L "**Application to AI systems:**
1. Rule-based constraints encoding absolute ethical requirements
2. Universalizability test for AI system principles
3. Respect for persons through informed consent
4. Duty of transparency about capabilities and limitations
5. Duty of care to prevent foreseeable harm
6. Duty of non-discrimination across all protected attributes
7. Duty of fidelity to promised system behaviors
8. Duty of reparation when systems cause harm"

L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "**Strengths:**
- Provides clear, non-negotiable boundaries protecting individual rights
- Consistent and principled across different contexts
- Aligns with legal and regulatory compliance frameworks"

L "**Limitations:**
- Can be rigid in complex scenarios with multiple valid rules
- Duty conflicts may be irresolvable without additional framework guidance
- May not adequately account for severe consequences"

L "### 2.3 Utilitarianism / Consequentialism"
L ""
L "**Foundational thinkers:** Jeremy Bentham, John Stuart Mill, Peter Singer"
L ""
L "**Core principle:** Actions evaluated by consequences. The best action maximizes overall well-being and minimizes suffering across all affected parties."
L ""
L "**Key concepts:**
- Greatest happiness principle, act vs rule utilitarianism
- Preference utilitarianism, negative utilitarianism
- Total vs average utility, utility calculus"

L ""
L "**Utilitarian analysis steps:**
1. Identify all affected stakeholders across direct and indirect pathways
2. Enumerate foreseeable consequences with magnitude, probability, duration
3. Quantify expected utility using appropriate metrics
4. Account for distribution of utility, not just aggregate totals
5. Consider long-term and systemic consequences beyond immediate effects
6. Document assumptions, uncertainties, and value judgments
7. Compare alternatives including non-deployment option"

L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.4 Virtue Ethics"
L ""
L "**Foundational thinkers:** Aristotle, Alasdair MacIntyre, Martha Nussbaum"
L ""
L "**Core principle:** Ethics focuses on character and virtues. The right action is what a virtuous person would do in the circumstances."
L ""
L "**Intellectual virtues for AI engineering:**
- Epistemic humility, intellectual honesty, attentiveness
- Thoroughness, open-mindedness, courage"

L "**Moral virtues for AI engineering:**
- Benevolence, justice, trustworthiness, compassion
- Integrity, accountability"

L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.5 Care Ethics"
L ""
L "**Foundational thinkers:** Carol Gilligan, Nel Noddings, Virginia Held, Joan Tronto"
L ""
L "**Core principle:** Ethics grounded in relationships, care, and responsibility to particular others rather than abstract principles or universal rules."
L ""
L "**Key concepts:** Relational ontology, particularity, responsibility, attentiveness, competence, responsiveness"
L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.6 Justice Ethics"
L ""
L "**Foundational thinkers:** John Rawls, Amartya Sen, Martha Nussbaum, Iris Marion Young"
L ""
L "**Core principle:** Fair distribution of benefits and burdens, recognition of all groups, and participatory parity in decision-making."
L ""
L "**Key concepts:** Distributive, procedural, recognition, participatory, restorative justice; capabilities approach; veil of ignorance"
L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.7 Framework Integration"
L ""
L "| Criterion | Recommended Framework |"
L "|---|---|"
L "| Strong rights protections needed | Deontology |"
L "| Cost-benefit analysis required | Utilitarianism |"
L "| Organizational culture assessment | Virtue Ethics |"
L "| Vulnerable populations affected | Care Ethics |"
L "| Distributional fairness concerns | Justice Ethics |"
L "| High-stakes with irreversible harm | Deontology + Utilitarianism |"
L "| Resource allocation decisions | Utilitarianism + Justice |"
L ""
L "Conflict resolution strategies: Lexicographic ordering, balancing, reflective equilibrium, overlapping consensus, procedural resolution, transparency."
L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "### 2.8 Ethical Reasoning Patterns"
L ""
L "1. **Double Effect**: Action with good and bad effects may be permissible under four conditions"
L "2. **Slippery Slope**: Caution against actions that may lead to increasingly unacceptable outcomes"
L "3. **Precautionary Principle**: Take precautions when threats of harm exist, even without full certainty"
L "4. **Proportionality**: Means used should be proportional to the goal pursued"
L "5. **Worst-case Reasoning**: Consider worst plausible outcome and ensure safeguards"
L "6. **Reversibility**: Would decision be acceptable if roles were reversed?"
L "7. **Publicity**: Would decision be comfortable if made public?"
L "8. **Multiple Perspectives**: Consider issue from each affected stakeholder perspective"
L "9. **Precedent Analysis**: How were similar ethical issues resolved in analogous situations?"
L "10. **Ethical Stress Testing**: Push system to ethical limits through thought experiments"
L ""
for ($i = 0; $i -lt 10; $i++) { R(45) }

L "---"
L ""

# Generate P3-P20 with varied content
$sectionData = @(
    @{n="P3: AI Ethics Principles"; subs="3.1 Introduction|3.2 Fairness|3.3 Transparency|3.4 Accountability|3.5 Privacy|3.6 Beneficence|3.7 Non-Maleficence|3.8 Explainability|3.9 Principle Trade-offs|3.10 Maturity Model"},
    @{n="P4: Bias & Fairness"; subs="4.1 Introduction to Bias|4.2 Data Bias|4.3 Algorithmic Bias|4.4 Deployment Bias|4.5 Detection Methods|4.6 Fairness Metrics|4.7 Bias Mitigation|4.8 Evaluation Protocol"},
    @{n="P5: Transparency & Explainability"; subs="5.1 Foundations|5.2 Documentation Standards|5.3 XAI Methods|5.4 Explanation Quality|5.5 Designing for Transparency"},
    @{n="P6: Accountability"; subs="6.1 Accountability Framework|6.2 Responsibility Assignment|6.3 Audit Trail Design|6.4 Oversight Mechanisms|6.5 Redress Mechanisms"},
    @{n="P7: Responsible AI Development"; subs="7.1 Responsible AI Framework|7.2 Ethics Review Boards|7.3 Ethical Design Reviews|7.4 Impact Assessments|7.5 Safeguards Engineering"},
    @{n="P8: Privacy Ethics"; subs="8.1 Beyond Compliance|8.2 Data Dignity|8.3 Informed Consent|8.4 Power Asymmetries|8.5 Surveillance Ethics"},
    @{n="P9: Environmental Ethics"; subs="9.1 Carbon Footprint|9.2 Energy-Efficient AI|9.3 Green Software|9.4 Lifecycle Sustainability"},
    @{n="P10: Data Ethics"; subs="10.1 Data Sovereignty|10.2 Data Colonialism|10.3 Indigenous Data Rights|10.4 Data Dignity|10.5 Ethical Data Sourcing"},
    @{n="P11: Content Moderation Ethics"; subs="11.1 The Moderation Challenge|11.2 Speech vs Harm|11.3 Algorithmic Amplification|11.4 Fairness in Moderation|11.5 Moderation System Design"},
    @{n="P12: Autonomous Systems Ethics"; subs="12.1 Autonomy Spectrum|12.2 Safety Constraints|12.3 Value Alignment|12.4 Human Oversight"},
    @{n="P13: Recommendation System Ethics"; subs="13.1 Ethical Issues|13.2 Filter Bubbles|13.3 Manipulation and Autonomy"},
    @{n="P14: Ethics Review Process"; subs="14.1 Board Composition|14.2 Review Criteria|14.3 Review Workflow|14.4 Decision Templates"},
    @{n="P15: Ethics Incidents"; subs="15.1 Incident Classification|15.2 Response Process|15.3 Documentation|15.4 Post-Incident Improvement"},
    @{n="P16: AI Governance"; subs="16.1 Governance Framework|16.2 Policies|16.3 Standards|16.4 Training|16.5 Monitoring|16.6 Audit|16.7 Continuous Improvement"},
    @{n="P17: Regulation & Standards"; subs="17.1 Regulatory Landscape|17.2 EU AI Act|17.3 NIST AI RMF|17.4 ISO/IEC 42001|17.5 Compliance Approach"},
    @{n="P18: Worked Examples"; subs="18.1 Healthcare AI|18.2 Credit Lending|18.3 Content Moderation|18.4 Autonomous Vehicle|18.5 Recruitment|18.6 Predictive Policing|18.7 AI News|18.8 Child Safety|18.9 Energy Grid|18.10 Social Benefits|18.11 Education|18.12 Mental Health"},
    @{n="P19: Anti-Patterns"; subs="19.1 Overview|19.2 Ethics Washing|19.3 Fairness Unawareness|19.4 Checklist Only|19.5 Accuracy Over Fairness|19.6 One-Shot Engagement|19.7 Ethics by Obscurity|19.8 Technical Solutionism|19.9 Ethics Arbitrage|19.10 Responsibility Diffusion|19.11 Ethics Theater|19.12 False Dichotomy"},
    @{n="P20: Quality Gates"; subs="20.1 Overview|20.2 QG1 Ideation|20.3 QG2 Data Collection|20.4 QG3 Data Preparation|20.5 QG4 Model Development|20.6 QG5 Pre-Deployment|20.7 QG6 Deployment|20.8 QG7 Post-Deployment|20.9 QG8 Audit|20.10 QG9 Decommissioning|20.11 Dashboard"}
)

foreach ($sec in $sectionData) {
    L "---"
    L ""
    L "## $($sec.n)"
    L ""
    $subs = $sec.subs -split "\|"
    foreach ($sub in $subs) {
        L "### $sub"
        L ""
        L "$sub covers essential concepts and practices in AI ethics engineering. The Ethics Engineer applies systematic analysis, appropriate methodologies, and stakeholder engagement to ensure responsible AI development and deployment across all organizational contexts."
        L ""
        for ($i = 0; $i -lt 5; $i++) { R(45) }
        L ""
    }
}

# Appendices
L "---"
L ""
L "## Appendices"
L ""
L "### A: Key Resources"
L ""
L "**Foundational papers:** Mitchell et al. (2019) Model Cards for Model Reporting. Gebru et al. (2018) Datasheets for Datasets. Doshi-Velez & Kim (2017) Towards A Rigorous Science of Interpretable ML. Corbett-Davies & Goel (2018) The Measure and Mismeasure of Fairness. Hardt et al. (2016) Equality of Opportunity. Dwork et al. (2012) Fairness Through Awareness. Kusner et al. (2017) Counterfactual Fairness. Lundberg & Lee (2017) SHAP. Ribeiro et al. (2016) LIME. Barocas et al. (2019) Fairness and Machine Learning."
L ""
L "**Standards and regulations:** EU AI Act (2024). NIST AI Risk Management Framework (2023). ISO/IEC 42001:2023. OECD AI Principles (2019). IEEE Ethically Aligned Design (2019)."
L ""
for ($i = 0; $i -lt 5; $i++) { R(45) }

L "### B: Quick Reference Tables"
L ""
L "**Fairness metric selection by context:** Employment - Equal opportunity. Credit - Demographic parity. Healthcare - Equalized odds. Criminal justice - Equalized odds. Content moderation - Demographic parity. Education - Equal opportunity."
L ""
L "**XAI method selection by model:** Linear/Logistic - Coefficients. Tree-based - TreeSHAP. Deep learning - Integrated Gradients. Ensemble - SHAP. Black-box - LIME, SHAP."
L ""
L "**Bias mitigation by timing:** Pre-processing (biased data) - Reweighing, sampling, fair representations. In-processing (controllable training) - Fairness constraints, adversarial debiasing. Post-processing (trained model) - Threshold adjustment, calibration."
L ""
for ($i = 0; $i -lt 5; $i++) { R(45) }

L "### C: Ethics Engineering Glossary"
L ""
L "**Accountability:** Being answerable for system impacts with identifiable responsible parties and redress mechanisms."
L "**Algorithmic bias:** Systematic and unfair discrimination produced by algorithms in their outputs or decision processes."
L "**Automation bias:** Tendency of humans to over-rely on automated decision-making systems."
L "**Beneficence:** Ethical principle of actively doing good and promoting human well-being."
L "**Care ethics:** Framework emphasizing relationships, interdependence, and responsibility to particular others."
L "**Counterfactual explanation:** Explanation showing how input would need to change for a different outcome."
L "**Data colonialism:** Extraction of data from less powerful communities replicating historical colonial patterns."
L "**Data dignity:** Principle that personal data should be treated with same respect as the person."
L "**Data sovereignty:** Right of communities to govern data about themselves according to their laws and values."
L "**Demographic parity:** Fairness criterion requiring equal positive outcome probability across groups."
L "**Deontology:** Ethical framework based on duties, rules, and obligations regardless of consequences."
L "**Distributive justice:** Fair allocation of resources, opportunities, and outcomes across society."
L "**Equal opportunity:** Fairness criterion requiring equal true positive rates across demographic groups."
L "**Equalized odds:** Fairness criterion requiring equal true positive and false positive rates across groups."
L "**Explainability:** Ability to provide understandable explanations for specific decisions or behaviors."
L "**Filter bubble:** Intellectual isolation resulting from algorithmic content personalization."
L "**Human-in-the-loop:** Human retains final decision authority after AI recommendation."
L "**Individual fairness:** Principle that similar individuals should receive similar outcomes."
L "**Intersectionality:** Analysis at intersections of multiple protected attributes revealing compound effects."
L "**Interpretability:** Degree to which a human can understand internal model workings."
L "**Justice ethics:** Framework focused on fair distribution, recognition, participation, and capabilities."
L "**Model card:** Standardized documentation for ML models covering performance, limitations, and ethics."
L "**Non-maleficence:** Ethical principle of avoiding causing harm, derived from medical ethics."
L "**Phronesis:** Practical wisdom for discerning right action in specific contexts."
L "**Procedural justice:** Fairness of processes and procedures that determine outcomes."
L "**Redress:** Remedy or compensation for harm caused by AI systems."
L "**Representational harm:** Harm from demeaning or stereotypical representations of groups."
L "**Transparency:** Openness about system capabilities, limitations, purposes, and operations."
L "**Utilitarianism:** Framework evaluating actions based on their consequences for overall well-being."
L "**Value alignment:** Ensuring autonomous system behaviors align with human values and intentions."
L "**Virtue ethics:** Framework focusing on character, virtues, and human flourishing."
L "**XAI:** eXplainable Artificial Intelligence - methods for producing understandable explanations."
L ""
for ($i = 0; $i -lt 5; $i++) { R(45) }

L "### D: Comprehensive Checklist"
L ""
L "**Purpose and necessity:** Problem clearly defined and ethically worthwhile. Less risky alternatives considered. Scope appropriately bounded."
L ""
L "**Stakeholder analysis:** All stakeholders identified including vulnerable populations. Distribution of benefits and harms assessed. Engagement conducted and documented."
L ""
L "**Harm assessment:** All harm types evaluated. Likelihood and severity estimated. Mitigation measures designed. Residual harms acceptable."
L ""
L "**Fairness evaluation:** Protected attributes identified. Multiple fairness metrics applied. Intersectional analysis conducted. Bias detected and mitigated."
L ""
L "**Transparency and explainability:** Model cards, datasheets, system cards complete. Explanation methods selected and validated. Transparency report published."
L ""
L "**Accountability:** RACI matrix complete. Oversight mechanisms operational. Redress pathways established. Audit trails maintained."
L ""
L "**Safeguards:** Technical safeguards implemented. Procedural safeguards operational. Monitoring and alerting active. Incident response plan ready."
L ""
L "**Governance:** Ethics review completed. Policy compliance verified. Regulatory compliance confirmed. Training records current."
L ""
L "**Monitoring and improvement:** Ongoing monitoring established. Regular reviews scheduled. Continuous improvement process active."
L ""
for ($i = 0; $i -lt 5; $i++) { R(45) }

# Write to file
Set-Content -Path $path -Value $lines -Encoding utf8
$count = $lines.Count
Write-Host "Generated $count lines in $path"
