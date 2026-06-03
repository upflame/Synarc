# Security Patterns Reference

See `skills/security-engineer/SKILL.md` for the complete security pattern library.

## OWASP Top 10 Coverage

| OWASP | Pattern | Mitigation |
|-------|---------|------------|
| A01 | Broken Access Control | RBAC + resource-level checks |
| A02 | Cryptographic Failures | TLS 1.3 + AES-256 + bcrypt |
| A03 | Injection | Parameterized queries + output encoding |
| A04 | Insecure Design | Threat modeling + security reviews |
| A05 | Security Misconfiguration | Hardening + least privilege |
| A06 | Vulnerable Components | Dependency scanning + updates |
| A07 | Auth Failures | MFA + rate limiting + session mgmt |
| A08 | Data Integrity Failures | Signed commits + SBOM |
| A09 | Logging Failures | Audit logging + no PII in logs |
| A10 | SSRF | Input validation + allowlists |
