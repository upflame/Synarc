---
title: JSON Schemas Reference — Synarc Universal
description: Complete reference for all 9 JSON Schemas in `shared/schemas/`. Each schema defines a stable, machine-readable contract used by every tool in the Synarc ecosystem.
version: 6.6.4
schema: skill-pack/v1
---

# JSON Schemas Reference (v6.6.4)

Every data structure in the Synarc ecosystem has a formal JSON Schema definition. These schemas are the **stable contract** between the SKILL.md authoring layer, the CLI installer, the runtime adapters, and any third-party tool that wants to integrate.

All schemas live in [`shared/schemas/`](../shared/schemas/) and conform to **JSON Schema Draft 2020-12**.

| Schema | File | Purpose |
|---|---|---|
| [skill-manifest](#skill-manifest) | `skill-manifest.schema.json` | SKILL.md frontmatter contract |
| [intent-contract](#intent-contract) | `intent-contract.schema.json` | Formal pre-execution agent commitment |
| [intent-template](#intent-template) | `intent-template.schema.json` | Per-WorkType contract template |
| [verification-result](#verification-result) | `verification-result.schema.json` | Post-execution promise verdict |
| [audit-record](#audit-record) | `audit-record.schema.json` | Immutable audit trail entry |
| [risk-assessment](#risk-assessment) | `risk-assessment.schema.json` | 6-level risk ladder output |
| [ledger-entry](#ledger-entry) | `ledger-entry.schema.json` | Session tracking ledger row |
| [brain-document](#brain-document) | `brain-document.schema.json` | `brain/` directory document format |
| [guardrails](#guardrails) | `guardrails.schema.json` | Constitutional safety rules |

---

## Validation

Validate any Synarc artifact with any JSON Schema validator. Examples:

```bash
# Node — using ajv (the fastest validator)
npx ajv-cli validate -s shared/schemas/skill-manifest.schema.json -d my-skill.yaml

# Python — using jsonschema
python -c "import json, jsonschema; jsonschema.validate(json.load(open('risk.json')), json.load(open('shared/schemas/risk-assessment.schema.json')))"

# VS Code — install the "JSON Schema Validator" extension; the schemas are picked up automatically when in the workspace.
```

The pack also ships a PowerShell validator (`scripts/validate-skills.ps1`) that uses these schemas to enforce L2 conformance on every `SKILL.md` and `skill.yaml`.

---

## skill-manifest

**File:** `shared/schemas/skill-manifest.schema.json`
**Used by:** Every `SKILL.md` and `skill.yaml` in `skills/<skill>/`.

Defines the metadata block at the top of every skill. The full field list is documented in [`SCHEMA.md` §3](../SCHEMA.md). Key fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | Lowercase, hyphenated. Must be unique across the pack. |
| `version` | string (semver) | ✅ | MAJOR.MINOR.PATCH |
| `schema` | string | ✅ | Fixed to `skill-pack/v1` |
| `description` | string | ✅ | One sentence — when does this skill activate? |
| `compatible_agents` | string[] | ✅ | Subset of the 8 supported agents |
| `activation` | object | ✅ | `type: always-on` or `intent-based` |
| `dependencies` | object | | `{ "<skill-id>": "<semver-constraint>" }` |
| `category` | string \| string[] | | For grouping in catalogs |
| `tags` | string[] | | Search/filter |
| `priority` | string | | `low` \| `normal` \| `high` \| `critical` |
| `integrity.hash` | string (sha256) | | Filled by `npm run sync` |

---

## intent-contract

**File:** `shared/schemas/intent-contract.schema.json`
**Used by:** Any agent about to execute a non-trivial task. The contract is created **before** the first tool call.

A contract commits the agent to:

| Field | Type | Meaning |
|---|---|---|
| `contract_id` | string (uuid) | Unique per contract |
| `task_summary` | string | One-line description of the task |
| `work_type` | enum | One of the 12 WorkTypes (`FEATURE`, `FIX`, `REFACTOR`, `INCIDENT`, `ANALYSIS`, `DOCS`, `CONFIG`, `TEST`, `INFRA`, `DATA`, `MIGRATION`, `EXPERIMENT`) |
| `scope.in_scope` | string[] | Exact files/paths the agent is allowed to touch |
| `scope.out_of_scope` | string[] | Files the agent must NOT touch |
| `promises` | object[] | `[{ promise, verification }]` — what the agent claims it will do and how the user can verify |
| `risk_cap` | enum | `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` — maximum risk allowed during execution |
| `estimated_effort` | string | `XS` \| `S` \| `M` \| `L` \| `XL` |
| `hard_floors_applied` | string[] | Domain hard floors triggered (e.g., `auth=CRITICAL`) |
| `created_at` | string (ISO 8601) | Timestamp |
| `agent_id` | string | Identifier of the agent that signed |
| `signature` | string (optional) | HMAC-SHA256 of the canonical contract |

See [advanced/intent-contracts.md](./advanced/intent-contracts.md) for the full lifecycle and examples.

---

## intent-template

**File:** `shared/schemas/intent-template.schema.json`
**Used by:** `shared/workflows/intent-templates/<work-type>.yaml` — one template per WorkType.

Templates are the **default contracts** for a given WorkType. They pre-fill the scope rules, standard promises, and clarifying questions. A contract created from a template can be edited before signing.

| Field | Type | Meaning |
|---|---|---|
| `work_type` | enum | Which WorkType this template applies to |
| `description` | string | When to use this template |
| `default_scope_rules` | object[] | Standard `in_scope` / `out_of_scope` heuristics |
| `standard_promises` | object[] | Pre-written promises the user typically wants |
| `clarifying_questions` | string[] | Questions to ask the user before signing |
| `default_risk_cap` | enum | Default `risk_cap` for this WorkType |
| `domain_hard_floors` | object[] | Hard floors triggered by keywords (e.g., `auth` → `CRITICAL`) |

---

## verification-result

**File:** `shared/schemas/verification-result.schema.json`
**Used by:** The Verification Engine, after an agent claims to have completed a task.

| Field | Type | Meaning |
|---|---|---|
| `contract_id` | string (uuid) | Links back to the signed Intent Contract |
| `executed_at` | string (ISO 8601) | When the agent finished |
| `scope_check.actual_files_touched` | string[] | Files the agent actually modified |
| `scope_check.out_of_scope_violations` | string[] | Files modified that were out of scope |
| `promise_check` | object[] | Per-promise: `status: passed|failed|skipped`, evidence |
| `risk_delta` | object | `planned_risk` vs `observed_risk` |
| `composite_verdict` | enum | `pass` \| `partial` \| `fail` |
| `rollback_to_intent` | string (optional) | Path to a snapshot if rollback is possible |

See [advanced/verification.md](./advanced/verification.md) for the engine internals.

---

## audit-record

**File:** `shared/schemas/audit-record.schema.json`
**Used by:** `shared/workflows/audit-compliance/` — every record is append-only.

| Field | Type | Meaning |
|---|---|---|
| `record_id` | string (uuid) | Unique per record |
| `timestamp` | string (ISO 8601) | When the record was created |
| `actor` | object | `{ agent_id, user_id, session_id }` |
| `action` | enum | `classify` \| `commit-contract` \| `execute` \| `verify` \| `rollback` \| `export` |
| `payload` | object | Action-specific data |
| `previous_record_hash` | string (sha256) | Hash chain — every record references its predecessor |
| `record_hash` | string (sha256) | Hash of this record (includes the previous) |
| `retention_class` | enum | `session` \| `30d` \| `1y` \| `2y` \| `5y` |

Records form a **Merkle-like chain** — any tampering invalidates the chain. Export formats include `eu-ai-act`, `soc2`, `hipaa`, `iso27001`. See [advanced/audit.md](./advanced/audit.md).

---

## risk-assessment

**File:** `shared/schemas/risk-assessment.schema.json`
**Used by:** The Risk Assessment workflow, on every classified change.

| Field | Type | Meaning |
|---|---|---|
| `assessment_id` | string (uuid) | |
| `work_type` | enum | The 12 WorkTypes |
| `base_risk` | enum | WorkType-default risk |
| `hard_floors` | object[] | Domain-triggered floors (e.g., `payment: CRITICAL`) |
| `dimension_modifiers` | object | `file_breadth`, `reversibility`, `scope_alignment`, `public_api`, `data_classification`, `test_coverage`, `blast_radius` |
| `composite_risk` | enum | `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `escalation` | enum | `none`, `warning`, `checkpoint`, `block` |
| `rollback_path` | string (optional) | How to revert if needed |
| `assessed_at` | string (ISO 8601) | |
| `assessor` | string | Agent ID |

The 6-level ladder:

| Level | Meaning | Default action |
|---|---|---|
| `INFO` | No risk | Proceed silently |
| `LOW` | Cosmetic / docs | Proceed with low-noise tracking |
| `MEDIUM` | Standard feature/fix | Proceed with full ledger tracking |
| `HIGH` | Cross-boundary | Checkpoint + impact statement |
| `CRITICAL` | Auth / payment / production | Checkpoint + explicit confirmation |
| `BLAST` | Cannot revert / unknown scope | Block until human review |

---

## ledger-entry

**File:** `shared/schemas/ledger-entry.schema.json`
**Used by:** `brain/LEDGER.md` (or `.ledger/` for binary-mode) — every mutation creates one entry.

| Field | Type | Meaning |
|---|---|---|
| `entry_id` | string (uuid) | |
| `timestamp` | string (ISO 8601) | |
| `work_type` | enum | |
| `risk_level` | enum | |
| `scope` | enum | `in_scope` \| `out_of_scope` |
| `breaking_change` | boolean | |
| `files_touched` | object[] | `[{ path, additions, deletions }]` |
| `contracts_affected` | string[] | API contracts touched |
| `aggregate_risk` | object | Running total + trend |
| `session_id` | string | Links to the active session |

The ledger is **append-only**. `git log` is the source of truth for who changed what and when.

---

## brain-document

**File:** `shared/schemas/brain-document.schema.json`
**Used by:** Every file in `brain/` — `CURRENT_STATE.md`, `MODULE_MAP.md`, `API_CONTRACTS.md`, `DECISIONS.md`, etc.

| Field | Type | Meaning |
|---|---|---|
| `document_type` | enum | `current_state`, `module_map`, `api_contracts`, `decisions`, `incidents`, `runs`, `glossary` |
| `version` | integer | Monotonically increasing per document type |
| `last_updated` | string (ISO 8601) | |
| `frontmatter` | object | Type-specific frontmatter (matches SKILL.md style) |
| `body` | string | Markdown content |
| `related_documents` | string[] | Cross-references to other brain docs |

The brain is a **lightweight, human-readable** state store. It is regenerated by agents on session start; it is not the source of truth (that is `git`). See [advanced/brain.md](./advanced/brain.md).

---

## guardrails

**File:** `shared/schemas/guardrails.schema.json`
**Used by:** Every `skills/<skill>/guardrails.yaml` and the global `shared/guardrails/constitutional-rules.yaml`.

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Unique rule ID |
| `category` | enum | `fabrication`, `risk_suppression`, `scope_absorption`, `unsafe_default`, `pii_exposure`, `auth_bypass`, `data_exfiltration`, `dependency_injection`, `prompt_injection`, `cost_runaway` |
| `severity` | enum | `info`, `warn`, `block` |
| `match` | object | Pattern: `intent_pattern`, `tool_call_pattern`, `output_pattern` |
| `action` | enum | `refuse`, `redact`, `warn`, `require_approval` |
| `message` | string | Human-readable explanation |
| `references` | string[] | OWASP-LLM category IDs (see `security/OWASP-LLM-mapping.md`) |

30+ zero-tolerance rules ship in v6.6.4. See [advanced/guardrails.md](./advanced/guardrails.md) for the full rule set.

---

## See also

- [`SCHEMA.md`](../SCHEMA.md) — the SKILL.md format specification
- [`shared/schemas/`](../shared/schemas/) — every JSON file
- [Advanced docs](./advanced/) — deep dives on each subsystem
