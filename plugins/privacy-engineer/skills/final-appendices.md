

# Appendix U: Privacy Engineering Implementation Patterns (Expanded)

## U.1 Data Flow Mapping with OpenLineage

OpenLineage is an open standard for data lineage collection. Integrating it with privacy engineering provides automated flow discovery.

```python
from openlineage.client import OpenLineageClient
from openlineage.client.run import RunEvent, RunState, Run, Job
from openlineage.client.event import DatasetEvent

class PrivacyLineageCollector:
    def __init__(self, openlineage_url: str = "http://localhost:5000"):
        self.client = OpenLineageClient(url=openlineage_url)

    def record_data_ingestion(self, source: str, destination: str, 
                              data_elements: list, purpose: str):
        event = RunEvent(
            eventType=RunState.COMPLETE,
            eventTime=datetime.utcnow().isoformat(),
            run=Run(runId=str(uuid.uuid4())),
            job=Job(namespace="privacy", name=f"ingest_{source}_to_{destination}"),
            inputs=[DatasetEvent(namespace="source", name=source, facets={
                "privacy": {"purpose": purpose, "elements": data_elements}
            })],
            outputs=[DatasetEvent(namespace="destination", name=destination, facets={
                "privacy": {"classification": self._get_classification(data_elements)}
            })]
        )
        self.client.emit(event)

    def _get_classification(self, elements: list) -> str:
        sensitive_types = {"ssn", "credit_card", "health_data", "biometric"}
        for elem in elements:
            if any(st in elem.lower() for st in sensitive_types):
                return "highly_sensitive"
        return "sensitive"

    def query_lineage(self, dataset: str, data_element: str) -> dict:
        lineage = {
            "dataset": dataset,
            "element": data_element,
            "upstream": [],
            "downstream": [],
            "transformations": []
        }
        return lineage
```

## U.2 Privacy Policy Enforcement with OPA

Open Policy Agent (OPA) enables policy-as-code for privacy enforcement decisions.

```python
import opa_client

class PrivacyPolicyEngine:
    def __init__(self, opa_url: str = "http://localhost:8181"):
        self.client = opa_client.OpaClient(host=opa_url, port=8181)

    def check_consent_before_processing(self, subject_id: str, purpose: str,
                                        data_category: str) -> dict:
        input_data = {
            "subject_id": subject_id,
            "purpose": purpose,
            "data_category": data_category,
            "action": "process"
        }
        result = self.client.check_policy("privacy/consent_check", input_data)
        return {
            "allowed": result.get("allow", False),
            "reason": result.get("reason", ""),
            "requirements": result.get("requirements", [])
        }

    def check_data_access(self, user_role: str, data_classification: str,
                          purpose: str) -> dict:
        input_data = {
            "user_role": user_role,
            "data_classification": data_classification,
            "purpose": purpose,
            "action": "access"
        }
        result = self.client.check_policy("privacy/access_control", input_data)
        return {
            "allowed": result.get("allow", False),
            "conditions": result.get("conditions", [])
        }

    def check_retention(self, data_category: str, age_days: int,
                        legal_hold: bool = False) -> dict:
        input_data = {
            "data_category": data_category,
            "age_days": age_days,
            "legal_hold": legal_hold,
            "action": "retain"
        }
        result = self.client.check_policy("privacy/retention", input_data)
        return {
            "action": result.get("action", "delete"),
            "reason": result.get("reason", "")
        }
```

**OPA Policy Example (Rego)**:

```rego
package privacy.consent_check

default allow = false

allow {
    input.action == "process"
    data.consent_status[input.subject_id][input.purpose] == "active"
    data.consent_expiry[input.subject_id][input.purpose] >= time.now_ns()
}

allow {
    input.action == "process"
    data.legal_basis[input.purpose] == "contractual_necessity"
    data.service_status[input.subject_id] == "active"
}

reason["Consent not granted"] {
    not data.consent_status[input.subject_id][input.purpose]
}

reason["Consent withdrawn or expired"] {
    data.consent_status[input.subject_id][input.purpose] == "withdrawn"
}
```

## U.3 Privacy Metrics Dashboard Configuration

```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from flask import Flask, Response
import random

app = Flask(__name__)

dsr_counter = Counter('dsr_requests_total', 'Total DSR requests', ['type', 'status'])
consent_gauge = Gauge('active_consents', 'Active consents per purpose', ['purpose'])
retention_gauge = Gauge('data_past_retention', 'Records past retention period', ['category'])
pii_scan_gauge = Gauge('pii_discovered', 'PII elements discovered', ['classification'])
incident_counter = Counter('privacy_incidents_total', 'Privacy incidents', ['severity', 'type'])
vendor_gauge = Gauge('vendor_risk_score', 'Vendor privacy risk score', ['vendor'])

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype='text/plain')

def record_dsr(dsr_type: str, status: str):
    dsr_counter.labels(type=dsr_type, status=status).inc()

def record_consent(purpose: str, count: int):
    consent_gauge.labels(purpose=purpose).set(count)

def record_retention(category: str, count: int):
    retention_gauge.labels(category=category).set(count)

def record_pii_discovery(classification: str, count: int):
    pii_scan_gauge.labels(classification=classification).set(count)

def record_incident(severity: str, incident_type: str):
    incident_counter.labels(severity=severity, type=incident_type).inc()

def record_vendor_risk(vendor: str, score: float):
    vendor_gauge.labels(vendor=vendor).set(score)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

**Grafana Dashboard Configuration (JSON Model)**:

```json
{
  "dashboard": {
    "title": "Privacy Engineering Dashboard",
    "panels": [
      {
        "title": "DSR Requests by Type",
        "type": "graph",
        "targets": [{"expr": "rate(dsr_requests_total[24h])", "legendFormat": "{{type}}"}],
        "grid": {"pos": {"x": 0, "y": 0, "w": 12, "h": 8}}
      },
      {
        "title": "Active Consents by Purpose",
        "type": "stat",
        "targets": [{"expr": "active_consents", "legendFormat": "{{purpose}}"}],
        "grid": {"pos": {"x": 12, "y": 0, "w": 12, "h": 8}}
      },
      {
        "title": "Data Past Retention",
        "type": "gauge",
        "targets": [{"expr": "data_past_retention", "legendFormat": "{{category}}"}],
        "grid": {"pos": {"x": 0, "y": 8, "w": 12, "h": 8}}
      },
      {
        "title": "Privacy Incidents (24h)",
        "type": "graph",
        "targets": [{"expr": "rate(privacy_incidents_total[24h])", "legendFormat": "{{severity}}"}],
        "grid": {"pos": {"x": 12, "y": 8, "w": 12, "h": 8}}
      }
    ],
    "tags": ["privacy", "engineering", "compliance"]
  }
}
```

## U.4 Privacy Test Automation Framework

```python
import pytest
import requests
import json
from typing import Dict, List

class PrivacyTestFramework:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def test_no_pii_in_api_response(self, endpoint: str, params: Dict = None):
        response = requests.get(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            params=params
        )
        assert response.status_code == 200
        body = json.dumps(response.json())
        pii_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',              # SSN
            r'[\w\.-]+@[\w\.-]+\.\w{2,}',            # Email
            r'\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b',  # Credit card
        ]
        import re
        for pattern in pii_patterns:
            matches = re.findall(pattern, body)
            assert len(matches) == 0, f"Found PII pattern in {endpoint}: {matches}"

    def test_consent_required_for_processing(self, endpoint: str, 
                                            subject_id: str, purpose: str):
        response = requests.post(
            f"{self.base_url}{endpoint}",
            headers=self.headers,
            json={"subject_id": subject_id, "purpose": purpose}
        )
        assert response.status_code == 403
        data = response.json()
        assert "consent" in data.get("error", "").lower()

    def test_unauthorized_access_blocked(self, endpoint: str):
        response = requests.get(
            f"{self.base_url}{endpoint}",
            headers={}
        )
        assert response.status_code in (401, 403)

    def test_deletion_removes_data(self, endpoint: str, resource_id: str):
        delete_response = requests.delete(
            f"{self.base_url}{endpoint}/{resource_id}",
            headers=self.headers
        )
        assert delete_response.status_code == 200
        get_response = requests.get(
            f"{self.base_url}{endpoint}/{resource_id}",
            headers=self.headers
        )
        assert get_response.status_code == 404

    def test_data_encrypted_in_transit(self, endpoint: str):
        response = requests.get(
            f"{self.base_url}{endpoint}",
            headers=self.headers
        )
        assert response.url.startswith("https")
        assert response.elapsed.total_seconds() < 5

    def test_dsr_access_returns_own_data_only(self, endpoint: str, 
                                               subject_id: str, other_subject: str):
        response = requests.get(
            f"{self.base_url}{endpoint}/{subject_id}",
            headers=self.headers
        )
        data = response.json()
        assert data.get("subject_id") == subject_id
        assert data.get("subject_id") != other_subject

    def run_all_privacy_tests(self, configured_endpoints: List[Dict]):
        results = {"passed": 0, "failed": 0, "errors": []}
        for config in configured_endpoints:
            try:
                test_func = getattr(self, config["test_method"])
                test_func(*config.get("args", []), **config.get("kwargs", {}))
                results["passed"] += 1
            except AssertionError as e:
                results["failed"] += 1
                results["errors"].append({"test": config["test_method"], "error": str(e)})
            except Exception as e:
                results["failed"] += 1
                results["errors"].append({"test": config["test_method"], "error": f"Exception: {e}"})
        return results
```

## U.5 Privacy Engineering CI/CD Pipeline Configuration

```yaml
# .github/workflows/privacy.yml
name: Privacy Controls

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main]

jobs:
  privacy-screening:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Privacy Screening
        run: |
          python -m privacy_engine.screening \
            --diff ${{ github.event.pull_request.diff_url }}
      - name: PII Scan
        run: |
          python -m privacy_engine.pii_scanner \
            --scan-path ./src \
            --output pii-report.json
      - name: Classification Validation
        run: |
          python -m privacy_engine.classification_validator \
            --schema-diff ./schemas

  privacy-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Privacy Unit Tests
        run: pytest tests/privacy/ -v --junitxml=privacy-results.xml
      - name: Privacy Integration Tests
        run: pytest tests/privacy_integration/ -v
      - name: Privacy Regression Tests
        run: python -m privacy_engine.regression_test

  privacy-deployment-gate:
    needs: [privacy-screening, privacy-tests]
    runs-on: ubuntu-latest
    steps:
      - name: Check Privacy Gates
        run: |
          python -m privacy_engine.gate_check \
            --screening-result privacy-screening.json \
            --test-result privacy-results.xml
      - name: Approve Deployment
        if: success()
        run: echo "Privacy gates passed"
      - name: Block Deployment
        if: failure()
        run: |
          echo "Privacy gates FAILED - deployment blocked"
          exit 1
```

## U.6 Privacy Control Monitoring

```python
import time
import json
from datetime import datetime
from typing import Dict, List
import requests

class PrivacyMonitor:
    def __init__(self, alert_webhook: str, check_interval: int = 300):
        self.alert_webhook = alert_webhook
        self.interval = check_interval
        self.checks = {}

    def register_check(self, check_name: str, check_func, threshold):
        self.checks[check_name] = {
            "function": check_func,
            "threshold": threshold,
            "last_result": None,
            "last_checked": None,
            "failures": 0
        }

    def run_checks(self):
        results = {}
        for name, config in self.checks.items():
            try:
                result = config["function"]()
                config["last_result"] = result
                config["last_checked"] = datetime.utcnow().isoformat()
                if isinstance(result, (int, float)):
                    config["failures"] = 0 if result <= config["threshold"] else config["failures"] + 1
                    if config["failures"] >= 3:
                        self._alert(name, result, config["threshold"])
                results[name] = {"status": "ok", "value": result, "threshold": config["threshold"]}
            except Exception as e:
                config["failures"] += 1
                results[name] = {"status": "error", "error": str(e)}
        return results

    def _alert(self, check_name: str, value, threshold):
        alert = {
            "check": check_name,
            "value": value,
            "threshold": threshold,
            "timestamp": datetime.utcnow().isoformat(),
            "severity": "critical" if value > threshold * 2 else "warning"
        }
        requests.post(self.alert_webhook, json=alert)

    def start_monitoring(self):
        while True:
            results = self.run_checks()
            self._log_results(results)
            time.sleep(self.interval)

    def _log_results(self, results):
        print(json.dumps({
            "event": "privacy_monitor",
            "timestamp": datetime.utcnow().isoformat(),
            "results": results
        }))
```

# Appendix V: Privacy Engineering Service Level Objectives (SLOs)

## V.1 Core Privacy SLOs

| Service | SLO | Measurement | Window | Consequence |
|---|---|---|---|---|
| Consent Verification | 99.9% availability | Request success rate | 30 days | Service degradation |
| Consent Verification | < 50ms P99 latency | Response time | 7 days | Performance review |
| Consent Propagation | 99.9% of events propagated within 1 hour | Propagation rate | 30 days | Process review |
| DSR Fulfillment | 98% within regulatory timeline | Fulfillment rate | 90 days | Escalation to DPO |
| DSR API | 99.5% availability | Request success rate | 30 days | Incident review |
| Pseudonymization Service | 99.95% availability | Request success rate | 30 days | P1 incident |
| Pseudonymization Service | < 100ms P99 latency | Response time | 7 days | Performance review |
| PII Detection Scan | Weekly full scan coverage | % of data stores scanned | 30 days | Scope review |
| Retention Enforcement | 99% of data deleted on schedule | Purge job compliance | 30 days | Process review |
| Access Control | 100% unauthorized access blocked | Policy enforcement | Ongoing | P0 incident |

## V.2 Error Budgets

| Service | Budget | Over-consumption Action |
|---|---|---|
| Consent Verification | 0.1% error rate / month | Feature freeze for consuming services |
| DSR Fulfillment | 2% SLA miss rate / quarter | Privacy engineering review and improvement plan |
| Pseudonymization | 0.05% error rate / month | Immediate incident response, rollback if needed |
| PII Detection | 5% missed scan coverage / month | Priority re-scan, tooling improvement |
| Retention Enforcement | 1% miss rate / month | Process improvement, automated remediation |

## V.3 Privacy SLO Monitoring

```python
from datetime import datetime, timedelta
from typing import Dict, List

class PrivacySLO:
    def __init__(self, name: str, target: float, window_days: int):
        self.name = name
        self.target = target
        self.window_days = window_days
        self.events = []

    def record_event(self, success: bool, details: dict = None):
        self.events.append({
            "timestamp": datetime.utcnow(),
            "success": success,
            "details": details or {}
        })

    def current_compliance(self) -> float:
        cutoff = datetime.utcnow() - timedelta(days=self.window_days)
        window = [e for e in self.events if e["timestamp"] > cutoff]
        if not window:
            return 1.0
        successes = sum(1 for e in window if e["success"])
        return successes / len(window)

    def error_budget_remaining(self) -> float:
        compliance = self.current_compliance()
        if compliance >= self.target:
            return 1.0
        return compliance / self.target

class SLOManager:
    def __init__(self):
        self.slos = {}

    def add_slo(self, slo: PrivacySLO):
        self.slos[slo.name] = slo

    def report(self) -> Dict:
        return {
            name: {
                "compliance": slo.current_compliance(),
                "target": slo.target,
                "error_budget": slo.error_budget_remaining()
            }
            for name, slo in self.slos.items()
        }

    def check_budgets(self) -> List[str]:
        exhausted = []
        for name, slo in self.slos.items():
            if slo.error_budget_remaining() <= 0:
                exhausted.append(name)
        return exhausted
```

# Appendix W: Privacy Engineering Documentation Templates

## W.1 Privacy Control Implementation Document

```
PRIVACY CONTROL IMPLEMENTATION DOCUMENT

Control ID: PC-[ID]
Control Name: [Name]
Control Type: [Technical / Organizational / Process]
Regulatory Requirement: [GDPR Art XX, CCPA Section, etc.]

1. CONTROL DESCRIPTION
   [What the control does, what it protects]

2. IMPLEMENTATION DETAILS
   2.1 System/Service: [Name]
   2.2 Technology: [Technology stack]
   2.3 Configuration: [Configuration details]
   2.4 Integration Points: [Dependencies, upstream/downstream]
   2.5 Data Flow: [How data moves through this control]

3. OWNERSHIP
   3.1 Implemented By: [Team/Individual]
   3.2 Maintained By: [Team/Individual]
   3.3 Reviewed By: [Privacy Engineer]
   3.4 Approval Date: [Date]

4. DEPENDENCIES
   [Other controls, systems, services this depends on]

5. VERIFICATION
   5.1 Test Method: [How control effectiveness is tested]
   5.2 Test Frequency: [How often]
   5.3 Expected Result: [What passing looks like]
   5.4 Last Test Result: [Date + Result]

6. MONITORING
   6.1 Metrics: [What is measured]
   6.2 Alerting: [Alert conditions + thresholds]
   6.3 Dashboard: [Grafana/DataDog dashboard reference]

7. EXCEPTIONS
   [Any approved exceptions or deviations from standard]

8. CHANGE HISTORY
   [Date | Change | Author | Approver]
```

## W.2 Privacy Risk Register Template

```
PRIVACY RISK REGISTER

Risk ID: PR-[ID]
Date Identified: [Date]
Risk Owner: [Name]

1. RISK DESCRIPTION
   [What could happen that would cause a privacy issue]

2. RISK CATEGORY
   [Data Collection / Consent / DSR / Cross-Border / Vendor / Incident / Retention / Classification]

3. RISK SOURCE
   [System, process, third party, regulatory change, etc.]

4. LIKELIHOOD
   [1-5, with criteria]
   1: Remote
   2: Unlikely
   3: Possible
   4: Likely
   5: Almost Certain

5. IMPACT
   [1-5, with criteria]
   1: Negligible
   2: Minor
   3: Moderate
   4: Major
   5: Severe

6. INHERENT RISK SCORE
   [Likelihood x Impact]

7. CURRENT CONTROLS
   [Existing controls and their effectiveness]

8. RESIDUAL RISK
   [Likelihood x Impact after controls]

9. RISK TREATMENT
   [Accept / Mitigate / Transfer / Avoid]
   [If Mitigate: mitigation actions, owner, timeline]
   [If Accept: justification, approver, review date]

10. STATUS
    [Open / In Progress / Accepted / Closed]

11. REVIEW DATE
    [Next scheduled review]
```

## W.3 Privacy Exception Request Template

```
PRIVACY EXCEPTION REQUEST

Exception ID: EX-[ID]
Request Date: [Date]
Requestor: [Name, Role]

1. EXCEPTION REQUEST
   [What standard privacy requirement is being deviated from]

2. RATIONALE
   [Why the exception is needed (business, technical, timing)]

3. SCOPE
   3.1 Systems affected: [List]
   3.2 Data affected: [Categories]
   3.3 Duration: [Start date - End date]
   3.4 Users/subjects affected: [Estimated count]

4. COMPENSATING CONTROLS
   [What alternative controls will be in place during the exception period]

5. RISK ASSESSMENT
   5.1 Risk without exception: [Level]
   5.2 Risk with compensating controls: [Level]
   5.3 Data subject impact: [Assessment]

6. APPROVALS
   Requestor: [Signature, Date]
   Engineering Lead: [Signature, Date]
   Privacy Engineer: [Signature, Date]
   DPO: [Signature, Date] (for high-risk exceptions)

7. REVIEW SCHEDULE
   Review Date: [Date]
   Closure Criteria: [What must be true to close the exception]

8. STATUS
   [Open / Closed / Expired]
```

# Appendix X: Privacy Engineering Training Framework

## X.1 Role-Based Training Curriculum

### X.1.1 All Employees

| Module | Content | Duration | Frequency |
|---|---|---|---|
| Privacy Fundamentals | What is personal data, why privacy matters, basic rights | 30 min | Annual |
| Privacy at [Company] | Our privacy program, DPO contact, reporting concerns | 15 min | Annual |
| Data Handling Basics | How to handle personal data, data classification basics | 20 min | Annual |
| Phishing and Privacy | Recognizing privacy-related phishing, social engineering | 15 min | Annual |
| Incident Reporting | How to report a privacy incident or concern | 10 min | Annual |

### X.1.2 Engineers (All Specialties)

| Module | Content | Duration | Frequency |
|---|---|---|---|
| Privacy-by-Design Principles | Seven principles, privacy in SDLC, privacy requirements | 60 min | Annual |
| Data Classification | Classification levels, handling requirements, enforcement | 45 min | Annual |
| Consent Management | Consent collection, storage, withdrawal, enforcement | 45 min | Annual |
| Data Subject Rights | DSR types, fulfillment process, timelines | 45 min | Annual |
| PII Handling | PII identification, pseudonymization, anonymization | 60 min | Annual |
| Privacy Testing | Privacy unit/integration tests, regression, CI/CD | 45 min | Annual |
| Cross-Border Transfers | Regulations, SCCs, supplementary measures | 45 min | Annual |
| Privacy Incident Response | Incident types, response process, notification | 45 min | Annual |

### X.1.3 Privacy Engineers

| Module | Content | Duration | Frequency |
|---|---|---|---|
| Advanced Privacy Regulations | Deep dive GDPR, CCPA, LGPD, PIPL, HIPAA | 120 min | Annual |
| Privacy Threat Modeling | LINDDUN methodology, threat trees, mitigation mapping | 120 min | Annual |
| PETs Deep Dive | Pseudonymization algorithms, DP mechanisms, SMPC | 120 min | Annual |
| PIA/DPIA Methodology | Full DPIA process, risk assessment, SA consultation | 90 min | Annual |
| Privacy Architecture | Privacy patterns, data zoning, layered architectures | 90 min | Annual |
| ML Privacy | Training data privacy, model memorization, inference attacks | 90 min | Annual |
| Privacy Automation | Privacy-as-code, policy-as-code, CI/CD integration | 90 min | Annual |
| Vendor Privacy Assessment | Assessment methodology, DPA negotiation, monitoring | 60 min | Annual |

### X.1.4 Product Managers

| Module | Content | Duration | Frequency |
|---|---|---|---|
| Privacy Requirements | Privacy in user stories, acceptance criteria, privacy UX | 60 min | Annual |
| Consent UX | Consent flow design, dark patterns, plain language | 45 min | Annual |
| DSR UX | DSR submission, preference center, transparency | 45 min | Annual |
| Privacy Risk for Products | Privacy risk assessment, PIA integration, product decisions | 60 min | Annual |

### X.1.5 Data Scientists / ML Engineers

| Module | Content | Duration | Frequency |
|---|---|---|---|
| Training Data Privacy | Consent, minimization, pseudonymization for training data | 60 min | Annual |
| Differential Privacy for ML | DP-SGD, privacy budget, utility trade-offs | 90 min | Annual |
| Model Privacy Auditing | Memorization, inference attacks, fairness | 90 min | Annual |
| Privacy-Preserving ML | Federated learning, SMPC, on-device ML | 60 min | Annual |

## X.2 Training Completion Tracking

```python
class PrivacyTrainingTracker:
    def __init__(self, employee_db, training_db):
        self.employees = employee_db
        self.trainings = training_db

    def assign_training(self, employee_id: str, role: str):
        curriculum = self._get_curriculum(role)
        for module in curriculum:
            self.trainings.assign({
                "employee_id": employee_id,
                "module": module["name"],
                "due_date": datetime.utcnow() + timedelta(days=30),
                "status": "assigned"
            })

    def complete_training(self, employee_id: str, module: str, score: float):
        self.trainings.update(employee_id, module, {
            "status": "completed",
            "completed_at": datetime.utcnow().isoformat(),
            "score": score
        })

    def check_compliance(self, role: str) -> Dict:
        curriculum = self._get_curriculum(role)
        employees = self.employees.get_by_role(role)
        compliant = 0
        non_compliant = []
        for emp in employees:
            completed = self.trainings.get_completed(emp["id"])
            required = set(m["name"] for m in curriculum)
            if required.issubset(set(completed)):
                compliant += 1
            else:
                non_compliant.append({
                    "employee": emp["name"],
                    "missing": list(required - set(completed))
                })
        return {
            "role": role,
            "total": len(employees),
            "compliant": compliant,
            "compliance_rate": compliant / len(employees) * 100 if employees else 100,
            "non_compliant": non_compliant[:10]
        }

    def _get_curriculum(self, role: str) -> List[Dict]:
        curricula = {
            "all_employees": [
                {"name": "Privacy Fundamentals", "duration_min": 30},
                {"name": "Privacy at Company", "duration_min": 15},
                {"name": "Data Handling Basics", "duration_min": 20}
            ],
            "engineer": [
                {"name": "Privacy-by-Design", "duration_min": 60},
                {"name": "Data Classification", "duration_min": 45},
                {"name": "Consent Management", "duration_min": 45},
                {"name": "Data Subject Rights", "duration_min": 45},
                {"name": "PII Handling", "duration_min": 60}
            ],
            "privacy_engineer": [
                {"name": "Advanced Privacy Regulations", "duration_min": 120},
                {"name": "Privacy Threat Modeling", "duration_min": 120},
                {"name": "PETs Deep Dive", "duration_min": 120},
                {"name": "PIA Methodology", "duration_min": 90},
                {"name": "Privacy Architecture", "duration_min": 90}
            ]
        }
        return curricula.get(role, curricula["all_employees"])
```

# Appendix Y: Privacy Engineering Workshop Exercises

## Y.1 Privacy Threat Modeling Workshop

**Duration**: 3 hours
**Participants**: Privacy engineer, developers, product manager, security engineer

**Agenda**:
1. Introduction to privacy threat modeling (30 min)
2. System walkthrough with data flow diagram (45 min)
3. LINDDUN threat identification exercise (45 min)
4. Risk assessment and prioritization (30 min)
5. Mitigation brainstorming (30 min)

**Exercise**: Given a ride-sharing app, identify LINDDUN threats:
- **Linkability**: Can rides be linked to same passenger across trips?
- **Identifiability**: Can passenger be identified from trip data?
- **Non-repudiation**: Can driver deny picking up a passenger?
- **Detectability**: Can others detect when a user takes a ride?
- **Disclosure**: Are trip details exposed to unauthorized parties?
- **Unawareness**: Is passenger aware of how trip data is used?
- **Non-compliance**: Does processing comply with all applicable regulations?

## Y.2 PIA/DPIA Workshop

**Duration**: 2 hours
**Participants**: Privacy engineer, project team, DPO, legal

**Agenda**:
1. PIA/DPIA methodology overview (20 min)
2. Processing description exercise (30 min)
3. Necessity and proportionality assessment (20 min)
4. Risk identification and scoring breakouts (40 min)
5. Mitigation planning (30 min)

**Exercise**: Conduct a DPIA for an AI-powered recruitment platform:
- Describe the processing (what data, what system, what decisions)
- Assess necessity: Is AI screening necessary? Can manual review suffice?
- Identify risks: bias, automated decisions, data minimization, transparency
- Score each risk and propose mitigations

## Y.3 Privacy Architecture Review

**Duration**: 1.5 hours
**Participants**: Privacy engineer, architect, developers

**Checklist**:
- [ ] Data flow diagrams reviewed for PII touchpoints
- [ ] Data minimization confirmed (only necessary fields collected)
- [ ] Pseudonymization strategy appropriate for data sensitivity
- [ ] Consent enforcement points identified and implemented
- [ ] Purpose limitation boundaries established
- [ ] Retention schedules defined and enforceable
- [ ] DSR implications addressed
- [ ] Cross-border transfers identified and documented
- [ ] Third-party data sharing reviewed
- [ ] Privacy controls testable and monitored

## Y.4 Privacy Incident Tabletop Exercise

**Duration**: 2 hours
**Participants**: Privacy engineer, DPO, security, legal, communications, engineering lead

**Scenario**: Customer data exposure via misconfigured cloud storage

**Injects**:
1. Discovery: Security monitoring alerts on public S3 bucket containing PII
2. Assessment: Determine scope, data categories, affected subjects, duration
3. Containment: Secure the bucket, preserve logs, begin investigation
4. Notification: Draft SA notification, data subject notification
5. Remediation: Prevent recurrence, improve controls

**Evaluation Criteria**:
- Time to declare incident severity
- Completeness of scope assessment
- Notification decision (timing, content, channels)
- Remediation plan quality
- Communication effectiveness (internal and external)

# Appendix Z: Privacy Engineering Book of Knowledge (PEBOK) Cross-Reference

## Z.1 PEBOK Domains Mapped to SKILL Sections

| PEBOK Domain | SKILL Section | Key Topics |
|---|---|---|
| Privacy Governance | P1, P2 | Role definition, principles, accountability |
| Data Classification | P3 | Taxonomy, methodology, enforcement |
| Data Mapping | P4 | Discovery, flow mapping, lineage, ROPA |
| Consent Management | P5 | Collection, lifecycle, enforcement, CMP |
| Data Subject Rights | P6 | DSR types, fulfillment pipeline, automation |
| Privacy Risk Assessment | P7 | PIA/DPIA methodology, risk scoring, mitigation |
| Privacy Architecture | P8 | PETs, architecture patterns, SDLC integration |
| Data Lifecycle Management | P9 | Retention, deletion, secure deletion, archiving |
| PII Discovery | P10 | Detection patterns, ML, false positive mgmt |
| Data Privacy Engineering | P11 | Pipeline privacy, ML privacy, PETs |
| Cross-Border Data Transfers | P12 | Transfer mechanisms, TIA, supplementary measures |
| Regulatory Compliance | P13 | GDPR, CCPA, LGPD, PIPL, HIPAA mapping |
| Incident Response | P14 | Detection, response, notification, remediation |
| Vendor Privacy | P15 | Assessment, DPA, subprocessors, monitoring |
| Privacy Testing | I1, I2 | Unit, integration, regression, penetration testing |
| Privacy Program Maturity | J1-J3 | Levels, assessment dimensions, roadmap |
| Privacy Threat Modeling | A1-A3 | LINDDUN methodology, STRIDE adaptation |
| Privacy Engineering Tools | B1-B7 | Data discovery, consent, DSR, PET libraries |
| Privacy Metrics | S1-S5 | Operational, incident, vendor, training, compliance metrics |

## Z.2 ISO/IEC 27701 Mapping

| ISO/IEC 27701 Clause | SKILL Reference | Controls |
|---|---|---|
| 6.3 PIMS-specific requirements related to ISO/IEC 27001 | P2, P18 | Privacy policy, risk assessment, internal audit |
| 7.2.1 Conditions for collection and processing | P5 | Consent, legal basis, purpose limitation |
| 7.2.2 Obligations to data subjects | P6 | DSR fulfillment, transparency, notification |
| 7.2.3 Privacy by design and default | P2, P8 | Embedding privacy, data minimization |
| 7.2.4 Data lifecycle management | P3, P4, P9 | Classification, inventory, retention, deletion |
| 7.3.1 Cross-border transfers | P12 | Transfer mechanisms, TIAs, safeguards |
| 7.3.2 Breach notification | P14 | Detection, assessment, notification |
| 7.4.1 Processor obligations | P15 | DPA, subprocessors, audit |
| 7.5.1 PIA/DPIA | P7 | Screening, methodology, risk assessment |

## Z.3 NIST Privacy Framework Mapping

| NIST Privacy Framework Function | Category | SKILL Reference |
|---|---|---|
| Identify-P | Inventory, Risk assessment, Business environment | P3, P4, P7 |
| Govern-P | Governance, Risk management, Policies | P1, P2, P18 |
| Control-P | Data processing management, Consent, Access | P5, P8, P11 |
| Communicate-P | Transparency, Notice, Data subject rights | P6, P13 |
| Protect-P | Data protection, Access control, Encryption | P3, P8, P9 |
| Detect-P | Monitoring, PII discovery, Anomaly detection | P10, P14 |
| Respond-P | Incident response, Breach notification, Mitigation | P14 |
| Recover-P | Remediation, Improvement, Lessons learned | P14 |

---

*This comprehensive SKILL.md document is version 1.0.0 of the Privacy Engineer plugin for opencode. It covers the complete privacy engineering domain from foundational principles through implementation patterns, regulatory compliance, incident response, and quality assurance. The document is designed to be a living reference that evolves with the privacy landscape.*

*For questions, contributions, or corrections, please contact the Synarc Engineering team.*
