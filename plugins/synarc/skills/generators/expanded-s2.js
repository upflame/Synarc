module.exports = {
  generateS2expanded(w) {
    const modules = ['auth', 'payment', 'checkout', 'inventory', 'notification', 'user-service', 'order-service', 'product-service', 'search-service', 'admin-api', 'reporting', 'analytics', 'webhook', 'event-bus', 'cron', 'email', 'sms', 'push', 'file-storage', 'cdn', 'dns', 'load-balancer', 'api-gateway', 'service-mesh', 'config-server', 'secret-manager', 'db-primary', 'db-replica', 'cache', 'queue'];
    const teams = ['platform', 'payments', 'identity', 'fulfillment', 'customer-experience', 'search', 'infrastructure', 'security', 'data-platform', 'observability'];
    const impacts = ['all users', 'authenticated users', 'admin users', 'third-party integrations', 'mobile clients', 'web clients', 'internal services', 'batch processes', 'real-time streams', 'reporting pipelines'];

    for (let i = 0; i < 300; i++) {
      const module = modules[i % modules.length];
      const team = teams[i % teams.length];
      const impact = impacts[i % impacts.length];
      const risk = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5];
      const description = [
        `read-only endpoint accessed by ${impact} with no side effects`,
        `configuration change affecting ${team} team's deployment pipeline`,
        `schema migration on ${module} with potential data integrity implications`,
        `security control modification in ${module} affecting ${impact}`,
        `performance optimization in ${module} targeting ${impact}`,
        `dependency update for ${module} affecting ${team} and downstream consumers`,
        `API change in ${module} consumed by ${impact} with contract implications`,
        `infrastructure change to ${module} managed by ${team} team`,
      ][i % 8];
      w(`Risk assessment: ${risk} ${module}: ${description}. Escalation check: ${['no escalation', 'UNPLANNED +1', '2+ HIGH +1', 'no test coverage +1', 'module fragile +1', 'IRREVERSIBLE → CRITICAL', 'ALL_USERS blast radius', 'unknown module +1'][i % 8]}. Composite: ${['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5]}.`);
      w('');
    }

    // Domain floor examples
    const floorDomains = [
      { domain: 'auth', min: 'CRITICAL', why: 'Access control breach is unrecoverable. Every auth change affects every authenticated request.' },
      { domain: 'payment', min: 'CRITICAL', why: 'Financial transactions have regulatory requirements. Errors cause revenue impact and compliance violations.' },
      { domain: 'pii', min: 'CRITICAL', why: 'Personal data is regulated by GDPR, CCPA, HIPAA. Exposure has legal and reputational consequences.' },
      { domain: 'secrets', min: 'CRITICAL', why: 'Credentials exposure is irreversibly compromised. Rotation cascades across all systems.' },
      { domain: 'schema-destructive', min: 'CRITICAL', why: 'Data loss or corruption from destructive schema changes requires complex recovery procedures.' },
      { domain: 'public-api', min: 'HIGH', why: 'All external consumers must adapt to API changes. Coordination is expensive and slow.' },
      { domain: 'env-rename', min: 'CRITICAL', why: 'Environment variable renames affect all deployment environments and can cause silent failures.' },
      { domain: 'network', min: 'CRITICAL', why: 'Security boundary changes affect all services. Blast radius is the entire platform.' },
    ];
    floorDomains.forEach(fd => {
      for (let i = 0; i < 10; i++) {
        w(`Hard floor: ${fd.domain} → minimum ${fd.min}. ${fd.why}. This floor cannot be lowered by user instruction, team size, timeline, or any other circumstance. Violation: attempt to classify a ${fd.domain} change below ${fd.min}.`);
        w('');
      }
    });

    // Escalation scenarios
    for (let i = 0; i < 200; i++) {
      const condition = [
        'UNPLANNED change detected in session',
        'Session already has 2+ HIGH risk entries',
        'Target module has zero test coverage',
        'Target module is flagged as fragile in MODULE_MAP.md',
        'Active INCIDENT in progress',
        'Change is in an unknown module (no MODULE_MAP.md entry)',
        'Blast radius is ALL_USERS',
        'Reversibility is IRREVERSIBLE',
        'Recurrence flag set on this module',
        'Change touches 3+ files',
        'Change crosses service boundary',
        'No rollback plan defined',
      ][i % 12];
      w(`Escalation: ${condition}. Apply: +1 risk level. Rationale: ${['Scope not agreed — may introduce unexpected interactions', 'Cumulative risk increasing — system is destabilizing', 'No automated safety net — regression risk increases', 'Historical instability increases likelihood of new issues', 'During incident, every change carries emergency risk', 'Cannot assess blast radius — conservative escalation', 'Any mistake affects every user', 'Cannot undo — must be treated with maximum caution', 'Repeated issues indicate deeper problems', 'Coordination complexity increases error probability', 'Distributed system changes have multiplicative risk', 'Cannot recover from failure'][i % 12]}.`);
      w('');
    }

    // Blast radius examples
    for (let i = 0; i < 150; i++) {
      const br = ['SINGLE_USER', 'SINGLE_TENANT', 'SINGLE_FEATURE', 'SINGLE_SERVICE', 'MULTI_SERVICE', 'PLATFORM', 'ALL_USERS', 'DATA_INTEGRITY'][i % 8];
      w(`Blast radius: ${br} for change in ${modules[i % modules.length]}. Multiplier: ${['x1', 'x2', 'x1.5', 'x2', 'x3', 'x4', 'x5', 'x5'][i % 8]}. Base risk ${['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5]} → adjusted ${['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5]}. Monitoring: ${['no additional', 'tenant-level dashboards', 'feature-level alerts', 'service-level RED metrics', 'cross-service tracing', 'platform-level dashboards', 'user-facing monitoring', 'data integrity checks'][i % 8]}.`);
      w('');
    }

    // Reversibility examples
    for (let i = 0; i < 100; i++) {
      const rev = ['SAFE', 'CAREFUL', 'HARD', 'IRREVERSIBLE'][i % 4];
      w(`Reversibility: ${rev}. ${['Change is easily reversible — rollback is a simple revert or inverse operation.', 'Change requires coordinated rollback with dependency awareness.', 'Change is difficult to reverse — data migration or consumer coordination needed.', 'Change cannot be undone — destructive operation requires maximum caution.'][i % 4]}. Adjustment: ${['-1 level', 'no change', '+1 level', '→ CRITICAL'][i % 4]}. Example: ${['adding optional field, adding nullable column', 'renaming with backward-compatible alias', 'removing non-nullable column, changing existing field type', 'DROP TABLE, destructive migration'][i % 4]}.`);
      w('');
    }

    // Composite risk examples
    for (let i = 0; i < 200; i++) {
      const baseRisk = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5];
      const brAdjust = ['x1', 'x2', 'x3', 'x4', 'x5'][i % 5];
      const revAdjust = ['-1', '0', '+1', '→C'][i % 4];
      const escAdjust = ['0', '+1', '+2', '→C'][i % 4];
      w(`Composite: base=${baseRisk} × blast=${brAdjust} + reversibility=${revAdjust} + escalation=${escAdjust}. Final: ${['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 5]}. Module: ${modules[i % modules.length]}. WorkType: ${['FEATURE', 'FIX', 'REFACTOR', 'SCHEMA', 'CONTRACT', 'CONFIG', 'INFRA', 'EXPERIMENT'][i % 8]}. Domain floor check: ${['none', 'auth → CRITICAL', 'payment → CRITICAL', 'PII → CRITICAL', 'secrets → CRITICAL', 'public API → HIGH'][i % 6]}.`);
      w('');
    }

    // Data sensitivity examples
    for (let i = 0; i < 80; i++) {
      const classification = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'CRITICAL', 'REGULATED'][i % 6];
      w(`Data sensitivity: ${classification}. ${['Public information — no access restrictions.', 'Internal company data — not sensitive but not public.', 'Business-sensitive information — limited access.', 'Customer or personal data — strict access controls.', 'Authentication secrets — maximum protection.', 'Regulated data — compliance requirements apply.'][i % 6]}. Risk adjustment: ${['0', '0', '+1', '+2', '→ CRITICAL', '→ CRITICAL'][i % 6]}. Examples: ${['README, public docs', 'internal tools, non-critical config', 'pricing, business logic', 'customer data, PII', 'API keys, encryption keys', 'GDPR data, HIPAA data, PCI data'][i % 6]}.`);
      w('');
    }
  }
};
