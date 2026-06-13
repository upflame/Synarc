---
workflow: intent-templates
version: 1.0.0
description: Intent Template selection workflow — match WorkType to template, customize, propose contract
---

# Intent Template Workflow

## Purpose

Accelerate contract creation by using per-WorkType templates. Each template provides default scope rules, standard promises with verification methods, and clarifying questions for ambiguous inputs.

## Trigger Conditions

WHEN:
- a change is classified (runs after S1)
- user provides an incomplete or ambiguous request
- user explicitly requests a template

THEN:
Activate Intent Template workflow

## Required Inputs

- Change classification (WorkType + sub-type)
- User's natural language request

## Workflow

### Step 1: Match WorkType to Template

| User Intent | Template |
|---|---|
| "Add X", "build Y", "implement Z" | TMPL-FEATURE-01 |
| "Fix", "broken", "error", stack trace | TMPL-FIX-01 |
| "Clean up", "extract", "reorganize" | TMPL-REFACTOR-01 |
| DB migration, model change, field change | TMPL-SCHEMA-01 |
| API route, response shape, signature | TMPL-CONTRACT-01 |
| ENV vars, config files, deployment params | TMPL-CONFIG-01 |
| Docker, K8s, Terraform, cloud | TMPL-INFRA-01 |
| "Try this", "test if", "explore" | TMPL-EXPERIMENT-01 |
| Production issue, outage, CVE | TMPL-INCIDENT-01 |
| Roadmap, ADR, design doc | TMPL-PLAN-01 |

### Step 2: Disambiguate with Clarifying Questions

If the user's request is ambiguous, ask one question at a time from the template's `clarifying_questions` array:

```
Template TMPL-FEATURE-01 needs clarification:
  Q: Is this a new module or an addition to an existing module?
  A) New module
  B) Addition to existing module
  C) Extension of third-party module
```

Never ask more than one question per turn. Wait for the answer before asking the next.

### Step 3: Customize Template

Apply user-specific customizations to the template:

- Adjust `scope.files` and `scope.modules` based on user's specific request
- Modify `risk_cap` if user indicates urgency or safety concerns
- Add or remove promises based on sub-type
- Update verification targets to match specific file/test paths

### Step 4: Propose Contract

Emit the customized contract proposal using the standard format from S1.5:

```
CONTRACT: CTR-XXXXXXXX (from template TMPL-FEATURE-01)
  TYPE: FEATURE:PLANNED
  SCOPE: [user-specified files]
  MODULES: [user-specified modules]
  RISK CAP: MEDIUM
  PROMISES:
    1. Implement specified functionality → verify: test_passes on [test-file]
    2. All type checks pass → verify: type_check
    3. No existing tests broken → verify: test_passes on full suite
  STATUS: proposed
```

### Step 5: Fallback for Non-Matching Inputs

If no template matches the user's intent:
1. Use the generic template (TMPL-GENERIC-01)
2. All promises default to "manual_review" verification
3. Ask at minimum: "What files will you change?" and "What risk level applies?"

## Template Reference

Templates are defined in `skills/synarc-core/references/templates/`:
- `TMPL-FEATURE-01.json`
- `TMPL-FIX-01.json`
- `TMPL-REFACTOR-01.json`
- `TMPL-SCHEMA-01.json`
- `TMPL-CONTRACT-01.json`
- `TMPL-CONFIG-01.json`
- `TMPL-INFRA-01.json`
- `TMPL-EXPERIMENT-01.json`
- `TMPL-INCIDENT-01.json`
- `TMPL-PLAN-01.json`
- `TMPL-GENERIC-01.json`

## Validation

- Template matches WorkType
- All clarifying questions answered (or explicitly skipped)
- Customizations preserve all required promises
- Resulting contract passes schema validation

## Failure Handling

- No template match → use generic template
- User refuses to answer clarifying questions → use defaults with WARN level
- Customization removes required promise → flag as WARN, auto-add missing promise back

## Quality Checklist

- [ ] Correct template selected for WorkType
- [ ] Clarifying questions asked if scope ambiguous
- [ ] Required promises preserved after customization
- [ ] Contract proposed in standard format

## Security Checklist

- [ ] Templates do not bypass risk assessment
- [ ] Required promises cannot be removed without flagging
- [ ] Generic template still enforces minimum scope declaration
