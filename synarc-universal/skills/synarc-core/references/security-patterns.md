# Security Patterns (synarc-core)

The 6 attack classes that cover ~90% of real-world security incidents. This file is a quick-reference; full coverage lives in `security-engineer/references/owasp-mapping.md`.

## The 6 classes

| # | Class | One-line check |
|---|-------|----------------|
| 1 | Injection | User input is parameterized, escaped, or allow-listed before reaching query/command/template |
| 2 | Broken auth | Tokens rotate, sessions expire, passwords use argon2/bcrypt/scrypt |
| 3 | Sensitive data exposure | PII encrypted at rest, TLS in transit, secrets redacted in logs |
| 4 | Broken access control | Default-deny on every endpoint, ownership check on every resource |
| 5 | Security misconfiguration | Secure headers set, error pages don't leak, no default credentials |
| 6 | XSS | Output encoding at render, CSP set, no `innerHTML` on user input |

## When to hand off

Hand off to `security-engineer` when:

- Change is in `auth/`, `crypto/`, `permissions/`, `secrets/`, `keys/`, `.env*`.
- Change introduces a new external dependency that handles sensitive data.
- Change is a fix for a reported vulnerability.
- Change is a new API endpoint that handles PII.
- Change is a security-sensitive config (CORS, CSP, TLS, IAM).

The 5-question sanity check below is for non-sensitive changes only.

## The 5-question sanity check

1. Does user input reach a query, command, template, or shell? If yes, is it parameterized/escaped/allow-listed?
2. Is the change in a path that handles auth or authz? If yes, is the check on server, not client?
3. Does the change log anything containing a password, token, or PII? If yes, is it redacted?
4. Does the change expose a new endpoint? If yes, does it have a default-deny authz check?
5. Does the change modify a security header, CSP, or CORS config? If yes, is the new value strictly more restrictive?

If any answer is "no" or "I don't know", hand off to `security-engineer`. The cost of a handoff is one turn; the cost of an incident is unbounded.
