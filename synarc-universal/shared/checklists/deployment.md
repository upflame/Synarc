# Deployment Checklist

Use this checklist before and after every production deployment.

## Pre-Deployment

- [ ] All CI checks passing (lint, test, build, security scan)
- [ ] Migration scripts tested against staging database
- [ ] Rollback script tested and ready
- [ ] Feature flags configured for gradual rollout
- [ ] Monitoring dashboards reviewed for baseline metrics
- [ ] Alert thresholds verified for new behavior
- [ ] Deployment order verified (schema before code, etc.)
- [ ] Dependencies deployed in correct order (if multi-service)

## During Deployment

- [ ] Deployment started in maintenance window (if applicable)
- [ ] Health checks passing after each component deployed
- [ ] No error rate spike in first 5 minutes
- [ ] No latency spike in first 5 minutes
- [ ] Database migrations applied successfully

## Post-Deployment

- [ ] All smoke tests passing
- [ ] Key user flows verified manually
- [ ] Error rate within normal bounds
- [ ] Latency within normal bounds
- [ ] Memory/CPU within normal bounds
- [ ] Feature flags verified in correct state
- [ ] Deployment logged in brain directory

## Rollback Triggers

If any of these occur, execute rollback immediately:

- [ ] Error rate exceeds 5% for more than 2 minutes
- [ ] P99 latency exceeds 2x baseline for more than 5 minutes
- [ ] Data integrity check fails
- [ ] Critical user flow broken
- [ ] Security vulnerability introduced
