---
title: Audit Trail and Compliance
description: Immutable, hash-chained audit trail. Rollback to intent. Compliance exports for EU AI Act, SOC2, HIPAA, ISO 27001.
version: 6.6.4
schema: skill-pack/v1
---

# Audit Trail and Compliance

> Every action in Synarc produces an append-only audit record. Records are hash-chained (Merkle-style) so tampering is detectable. Exports target EU AI Act, SOC2, HIPAA, and ISO 27001.

---

## Why a hash chain?

A simple log file can be edited. A log file where **each record references the hash of the previous record** cannot be edited without breaking the chain. This is the same technique used by Certificate Transparency logs and `git` itself.

```text
record_N.hash = sha256(
  record_N.body
  + record_(N-1).hash
  + timestamp
)
```

Any tampering — even a single byte change — produces a cascading mismatch starting at the modified record.

---

## Record types

The audit trail records six event types (see `audit-record.schema.json`):

| `action` | When | Payload contains |
|---|---|---|
| `classify` | A change is classified | `work_type`, `risk_level` |
| `commit-contract` | An Intent Contract is signed | Full contract |
| `execute` | A tool call runs | `tool`, `args_hash`, `result_hash` |
| `verify` | Verification Engine runs | Full verification result |
| `rollback` | Rollback to intent | `contract_id`, `restored_to_commit` |
| `export` | A compliance export is generated | `format`, `record_count`, `hash` |

---

## Retention

Each record carries a `retention_class`:

| Class | Retention | Use case |
|---|---|---|
| `session` | Until session end | Read-only cache |
| `30d` | 30 days | Operational logs |
| `1y` | 1 year | SOC2 baseline |
| `2y` | 2 years | Guardrail violations |
| `5y` | 5 years | Audit / regulatory |

Records are never deleted before their class expires. Expired records are tombstoned with a deletion hash (the chain remains verifiable).

---

## Compliance exports

Run `synarc audit export --format <format>` to produce a compliance report:

| Format | Regulation | What is included |
|---|---|---|
| `eu-ai-act` | EU AI Act 2026 | Risk classification, human oversight points, transparency artifacts |
| `soc2` | SOC 2 Type II | Change log, access logs, incident records |
| `hipaa` | HIPAA | PHI access logs, minimum-necessary proofs, breach records |
| `iso27001` | ISO 27001 | Annex A control evidence, risk treatment records |
| `json` | Raw | The full chain in a single file |
| `csv` | Raw | Flat record export for spreadsheet review |

```bash
# Export the last 90 days for SOC2
synarc audit export --format soc2 --since 90d > soc2-2026-q2.json

# Verify the chain integrity
synarc audit verify
```

---

## Rollback to intent

If a contract is verified as `fail` and a pre-execution snapshot exists, the audit trail records the rollback event with the `contract_id` and the `restored_to_commit` SHA. The user can run:

```bash
synarc audit rollback <contract_id>
```

This restores the file state to the pre-execution snapshot and emits a `rollback` record. The original `execute` records are preserved (not deleted) — the chain shows the rollback explicitly.

---

## See also

- [Verification Engine](./verification.md) — produces the records
- [Intent Contracts](./intent-contracts.md) — produces the contract records
- [`audit-record.schema.json`](../../shared/schemas/audit-record.schema.json) — formal spec
- [`security/OWASP-LLM-mapping.md`](../../security/OWASP-LLM-mapping.md) — threat model
