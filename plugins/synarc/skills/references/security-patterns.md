---
title: Security Review Patterns
type: reference
status: active
version: 4.0.0
updated: 2027-05-25
owner: synarc-core
tags:
  - security
  - threat-modeling
  - compliance
  - vulnerability
  - secure-coding
---

# Security Review Patterns

## Purpose
I apply security review patterns across the change lifecycle — threat modeling at design time, vulnerability scanning at build time, and security regression testing at deploy time.

## Scope
Threat modeling, secure coding patterns per stack, dependency vulnerability management, secrets lifecycle, authentication/authorization patterns, data protection, compliance mapping (SOC2, HIPAA, PCI, GDPR), security testing. Does not cover network security or infrastructure hardening (covered in platform-adapters.md).

## Inputs
Change classification, module criticality, data sensitivity, compliance requirements, dependency tree, threat model.

## Output
Security risk assessment, required security tests, threat model delta, compliance gap analysis.

## Schema
Numbered sections covering the security review lifecycle from threat modeling through incident response.

## Notes
Security is the one domain where risk floors cannot be lowered. Every security change is at least HIGH risk. CRITICAL risk for auth, payments, PII, secrets, and data access control changes.

---

## 1. Security Risk Classification by Change Type

| Change Type | Default Risk | Security Review Required |
|---|---|---|
| Auth / SSO / session management | CRITICAL | Full threat model review |
| Payment processing | CRITICAL | PCI compliance checklist |
| PII / PHI data handling | CRITICAL | Privacy impact assessment |
| Secrets / credentials | CRITICAL | Secrets management audit |
| Access control / RBAC | CRITICAL | Authorization matrix review |
| API endpoint (public) | HIGH | OWASP Top 10 checklist |
| File upload / download | HIGH | Malware scanning + path traversal check |
| Database query | HIGH | SQL injection scan |
| Third-party dependency | HIGH | CVE scan + license compliance |
| Configuration / env vars | MEDIUM | Secret exposure check |
| UI / frontend change | MEDIUM | XSS + CSRF check |
| Documentation change | LOW | No review needed |

## 2. Threat Modeling Light (For Every Change)

For changes below CRITICAL risk, I apply a condensed threat model:

**STRIDE-M per element touched:**

| Category | Question | If Yes |
|---|---|---|
| Spoofing | Can an attacker impersonate a legitimate user or system? | Add authentication + request signing |
| Tampering | Can data be modified in transit or at rest? | Add integrity checks (HMAC, signatures) |
| Repudiation | Can a user deny performing an action? | Add audit logging + non-repudiation |
| Information Disclosure | Can sensitive data leak? | Add encryption + access control + masking |
| Denial of Service | Can the system be overwhelmed? | Add rate limiting + resource quotas |
| Elevation of Privilege | Can an unprivileged user gain higher access? | Add authorization checks at every boundary |
| Mobility | Can data move between trust boundaries in unexpected ways? | Add data classification labels + boundary validation |

## 3. OWASP Top 10 Quick Reference

| Rank | Vulnerability | How It Shows Up in Code | Detection |
|---|---|---|---|
| A01 | Broken Access Control | Missing `@PreAuthorize`, `requireAuth`, or role check on endpoint | Static analysis + integration test |
| A02 | Cryptographic Failures | Hardcoded keys, weak algorithm (MD5, SHA1), HTTP not HTTPS | Secret scanner + lint rule |
| A03 | Injection | SQL string concatenation, eval(), unsafe deserialize | Parameterized query enforcement + SAST |
| A04 | Insecure Design | No rate limiting on password reset, no lockout on failed auth | Threat model review + pen test |
| A05 | Security Misconfiguration | Default credentials, verbose errors, CORS wildcard | Config validation + hardened template |
| A06 | Vulnerable Components | Outdated library with known CVE | `npm audit` / `pip audit` / `trivy` on every build |
| A07 | Auth Failures | Weak password policy, no MFA, session fixation | Auth testing framework |
| A08 | Data Integrity Failures | No signature on update, no version check on critical data | Signed payloads + integrity checks |
| A09 | Logging Failures | No audit log, log injection, PII in logs | Structured logging + log review |
| A10 | SSRF | User-supplied URLs fetched without validation | URL allowlist + internal network isolation |

## 4. Secrets Management Lifecycle

| Phase | Rule | Violation |
|---|---|---|
| Creation | Generate with sufficient entropy (min 128 bits for symmetric, 2048 bits for RSA keys) | Predictable secret |
| Storage | Secrets in a vault (Vault, AWS Secrets Manager, GCP Secret Manager), never in code | Secret in source |
| Retrieval | Runtime retrieval from vault with caching (TTL bounded by rotation period) | Hardcoded credential |
| Transmission | TLS for all secret delivery; mount as volume or env var (ephemeral) | Secret in log |
| Rotation | Automatic rotation at least every 90 days; manual rotation within 1 hour of suspected leak | Stale credential |
| Revocation | Immediate invalidation on compromise; delayed invalidation (TTL-based) for graceful expiry | Orphaned credential |
| Auditing | Every secret access logged with caller identity, timestamp, and reason | Blind access |

**Detection patterns for accidental commits:**

- `git secrets` — pre-commit hook scanning for patterns
- `trufflehog` — deep content scanning in git history
- `detect-secrets` — baseline + diff scanning
- Scan all branches, not just main — secrets leak from feature branches too

## 5. Input Validation at Every Boundary

### Validation Depth by Trust Level

| Trust Zone | Input Source | Validation |
|---|---|---|
| External (internet) | User agents, third-party APIs | Full: type, length, format, range, allowlist, encoding, size |
| Internal (service-to-service) | Other services in the same mesh/mesh | Moderate: type, format, schema validation |
| Trusted (same process) | Internal modules (validated upstream) | Minimal: assertion only |

### Validation Patterns

| Pattern | Description | Example |
|---|---|---|
| Allowlisting | Reject everything not explicitly allowed | Allowed HTML tags list |
| Canonicalization | Convert to standard form before validation | File path normalization |
| Encoding consistency | Reject mixed or non-standard encoding | UTF-8 only at API boundary |
| Size limits | Enforce minimum and maximum on every input | Max request body: 10MB |
| Type coercion safety | Explicit cast with error on lossy conversion | String → int with overflow check |

## 6. Authentication Pattern Selection

| Pattern | Use When | Risk |
|---|---|---|
| Session cookie + HTTP-only + Secure + SameSite | Web app with server-side rendering | CSRF if SameSite not Strict |
| JWT (access + refresh) | SPA, mobile, API-first architecture | Token theft if stored in localStorage |
| OAuth2 + PKCE | Third-party login, delegated authorization | Redirect URI validation must be strict |
| API key + HMAC signing | Service-to-service, server-to-server | API key rotation must be automated |
| mTLS | Zero-trust service mesh | Certificate lifecycle management |
| WebAuthn / passkeys | High-security auth, no-password flows | Browser support + recovery flow |

## 7. Authorization Pattern Selection

| Pattern | Granularity | Complexity | When to Use |
|---|---|---|---|
| Role-based (RBAC) | Coarse — role → permission set | Low | Simple hierarchies, org chart-aligned |
| Attribute-based (ABAC) | Fine — user attributes + resource attributes + context | High | Multi-tenant, complex policies |
| Relationship-based (ReBAC) | Graph — user → relationship → resource | Medium | Social, content sharing, org hierarchy |
| Policy-based (OPA, Casbin) | Externalized — policy engine evaluated per request | High | Multi-service, cross-platform, auditable |

### Authorization Anti-Patterns

- Checking roles in the controller instead of a policy layer (scattered logic)
- Client-side authorization (user can bypass by crafting requests)
- Hardcoded permissions in code (cannot audit or change without deploy)
- Missing default-deny — every endpoint must explicitly declare who can access

## 8. Data Protection by Sensitivity

| Sensitivity | Examples | In Transit | At Rest | In Use | Retention |
|---|---|---|---|---|---|
| Public | README, marketing content | No requirement | No requirement | No requirement | Indefinite |
| Internal | Source code, internal docs, metrics | TLS | No requirement | No requirement | Project lifetime |
| Confidential | Business logic, PII, credentials, config | TLS 1.3 | AES-256 | Memory encryption (if available) | Delete when no longer needed |
| Restricted | PHI, payment card data, government IDs | TLS 1.3 + mutual auth | AES-256 + HSM | Encrypted memory + access audit | Compliance-defined (HIPAA: 6 years, PCI: 12 months) |

## 9. Security Testing by SDLC Phase

### Design
- Threat modeling (STRIDE per component)
- Data flow diagram with trust boundaries
- Security requirement specification

### Development
- IDE plugin for real-time vulnerability detection
- Pre-commit hook for secret scanning
- Lint rules for security anti-patterns (no `eval`, no `exec`, no raw SQL)

### Build
- Dependency scan: `trivy`, `snyk`, `npm audit`, `pip audit`, `govulncheck`
- SAST: `semgrep`, `codeql`, `sonarqube`
- Secret scan: `trufflehog`, `git secrets`
- License compliance: `fossa`, `ort`

### Test
- DAST: `zap` (OWASP ZAP for running web app)
- Fuzz testing: `libfuzzer`, `jqf`, `cargo-fuzz`
- Auth testing framework (login, logout, session, reset flows)
- SQL injection probe (automated parameterized query verification)

### Deploy
- Container scan: `trivy`, `clair`, `grype`
- Infrastructure scan: `tfsec` (Terraform), `checkov` (CloudFormation)
- Compliance assertion: `compliance-checker` for SOC2/HIPAA/PCI controls
- Image signing + signature verification

### Operate
- Runtime monitoring: WAF, IDS/IPS, RASP
- Vulnerability management: 30-day patch window for HIGH, 7-day for CRITICAL
- Penetration testing: annual full-scope, quarterly targeted
- Bug bounty: continuous, with defined scope and reward structure

## 10. Compliance Mapping Quick Reference

| Control | SOC 2 | HIPAA | PCI DSS | GDPR | Implementation |
|---|---|---|---|---|---|
| Access control | CC6.1 | 164.312(a)(1) | 7.1 | Art. 25 | RBAC + audit trail |
| Encryption | CC6.7 | 164.312(e)(2)(ii) | 4.1 | Art. 32 | TLS 1.3 + AES-256 |
| Audit logging | CC5.2 | 164.312(b) | 10.1 | Art. 5(2) | Structured logging to SIEM |
| Vulnerability management | CC7.1 | 164.308(a)(1)(ii) | 6.2 | Art. 32 | Automated scanner + SLA |
| Incident response | CC7.4 | 164.308(a)(6)(ii) | 12.10 | Art. 33 | Defined IRP + notification framework |
| Data retention | CC6.5 | 164.316(b)(2)(i) | 3.1 | Art. 17(1) | Automated retention policy |
| Background checks | CC1.4 | 164.308(a)(3)(ii)(B) | 12.7 | N/A | Pre-employment + annual |
| Risk assessment | CC3.1 | 164.308(a)(1)(ii)(A) | 12.1 | Art. 35 | Annual risk register + treatment plan |
| Third-party due diligence | CC9.2 | 164.308(b)(1) | 12.8 | Art. 28 | Vendor risk assessment + contract review |

## 11. Incident Response Security Checklist

When a security incident is declared (WorkType = INCIDENT with security context):

1. CONTAIN — Isolate affected systems (network segment, disable account, revoke key)
2. ASSESS — Determine scope: what data, what systems, what users, what duration
3. PRESERVE — Snapshot affected systems, preserve logs before they rotate
4. NOTIFY — Legal, compliance, affected users (timeline varies by regulation: HIPAA 60 days, GDPR 72 hours)
5. REMEDIATE — Fix root cause, rotate all potentially exposed secrets, patch vulnerability
6. VERIFY — Confirm containment, validate fix, scan for persistence mechanisms
7. POSTMORTEM — Root cause analysis, timeline, action items, process improvements
8. REPORT — Document for compliance, update risk register, close out with legal sign-off
