# Incident Response Checklist

Use this checklist when responding to production incidents.

## Triage (First 5 minutes)

- [ ] Severity classified (SEV1-SEV4)
- [ ] Incident commander assigned
- [ ] War room opened (Slack channel, bridge call)
- [ ] Status page updated if customer-facing
- [ ] Initial impact assessment documented

## Containment (First 15 minutes)

- [ ] Root cause hypothesis formed
- [ ] Blast radius estimated
- [ ] Containment action identified (rollback, feature flag, scale, etc.)
- [ ] Containment action executed
- [ ] Impact confirmed reduced

## Communication

- [ ] Stakeholders notified per severity matrix
- [ ] Regular status updates every 15 minutes (SEV1) or 30 minutes (SEV2)
- [ ] Customer communication issued if needed
- [ ] Executive summary prepared

## Resolution

- [ ] Root cause confirmed (not just symptom)
- [ ] Fix applied and verified
- [ ] Monitoring confirms system stable
- [ ] Status page updated to resolved
- [ ] Stakeholders notified of resolution

## Post-Incident

- [ ] Post-mortem scheduled within 48 hours
- [ ] Timeline documented
- [ ] Root cause analysis completed (5 Whys, fishbone, or fault tree)
- [ ] Action items assigned with owners and deadlines
- [ ] Runbooks updated if procedures changed
- [ ] Monitoring/alerting gaps identified and addressed
- [ ] Error intelligence updated in brain directory
