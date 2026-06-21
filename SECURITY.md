# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 6.x     | Yes       |
| 5.x     | No        |

## Reporting a Vulnerability

Synarc is a security-conscious project. If you discover a security vulnerability, please report it privately before disclosing it publicly.

**Do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to **info@upflame.in** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigation (if applicable)

You should receive a response within 48 hours. If you do not, please follow up.

## Security Features

- **No network calls** — Synarc makes zero external network requests. All cognition is local.
- **Sandboxed execution** — The runtime operates within the agent's permission boundary.
- **Deterministic classification** — Same input produces same output. No stochastic behavior in governance.
- **Hash-verified integrity** — Plugin manifests are SHA-256 verified.
- **Tamper protection** — Runtime integrity is validated on activation.
- **Risk hard floors** — Certain domains (auth, payments, schema changes) enforce minimum risk levels that cannot be lowered.

## OWASP Top 10 for LLMs

Synarc maps controls to the OWASP LLM Top 10 (LLM01-LLM10). See [security/OWASP-LLM-mapping.md](synarc-universal/security/OWASP-LLM-mapping.md) for detailed mappings.

## Review Surface

The security review surface is synarc-universal/. Older directories at the repo root (plugins/, docs/, examples/, rain/, RELEASES.md, CLAUDE.md, GEMINI.md) were removed in v6.5.0 and contain no executable code. Their full history is reachable via git log for audit purposes only — they are not part of any current release artifact.