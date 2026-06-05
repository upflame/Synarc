module.exports = {
  generateS1expanded(w) {
    const subTypeContent = {};

    // Build large pool of FEATURE scenario paragraphs
    const featureScenarios = [];
    const domains = ['auth', 'payment', 'checkout', 'inventory', 'notification', 'user-profile', 'admin-dashboard', 'search', 'recommendation', 'reporting', 'analytics', 'onboarding', 'subscription', 'billing', 'shipping', 'review', 'rating', 'comment', 'social-feed', 'messaging', 'file-upload', 'image-processing', 'video-streaming', 'real-time-collab', 'webhook', 'cron-job', 'data-export', 'data-import', 'audit-log', 'compliance'];
    const scopes = ['user-facing', 'admin-facing', 'internal', 'third-party', 'public'];
    const langs = ['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin'];
    const patterns = ['repository', 'service', 'controller', 'handler', 'middleware', 'provider', 'factory', 'strategy', 'observer', 'command'];

    domains.forEach(domain => {
      scopes.forEach(scope => {
        langs.forEach(lang => {
          patterns.forEach(pattern => {
            if (Math.random() > 0.95) { // Sample for size management
              w(`FEATURE:PLANNED: When building a ${domain} module for ${scope} audiences in ${lang}, the ${pattern} pattern structures the implementation. The feature adds ${domain} capability that ${scope} consumers interact with through defined API boundaries. Risk assessment: MEDIUM base, escalate if crossing service boundaries. Test requirements: unit tests for ${pattern} logic, integration tests for API endpoints, contract tests for public interfaces.`);
              w('');
            }
          });
        });
      });
    });

    // FIX scenarios
    for (let i = 0; i < 200; i++) {
      const fixType = ['FIX:BUG', 'FIX:CRASH', 'FIX:REGRESSION', 'FIX:SECURITY', 'FIX:DATA', 'FIX:PERFORMANCE', 'FIX:SILENT', 'FIX:FLAKE'][i % 8];
      const domain = domains[i % domains.length];
      const cause = ['null check missing', 'race condition in concurrent access', 'incorrect boundary condition', 'wrong type conversion', 'missing input validation', 'incorrect state transition', 'wrong algorithm selection', 'off-by-one in iteration', 'unhandled edge case', 'incorrect configuration value', 'deprecated API usage', 'missing error path', 'incorrect indexing', 'wrong sort order', 'incorrect aggregation'][i % 15];
      const capCause = cause.charAt(0).toUpperCase() + cause.slice(1);
      w(fixType + ': ' + capCause + ' in ' + domain + ' module. Root cause analysis: trace the error path from trigger to symptom. Impact: affects ' + ['single user', 'all users in a session', 'all authenticated users', 'read operations', 'write operations', 'data consistency', 'reporting accuracy', 'third-party integrations'][i % 8] + '. Fix approach: ' + ['add null guard', 'implement proper locking', 'fix boundary condition', 'add type validation', 'implement input sanitization', 'correct state machine', 'replace algorithm', 'adjust off-by-one'][i % 8] + '. Verify: add unit test that reproduces the exact failure scenario.');
      w('');
    }

    // REFACTOR scenarios
    for (let i = 0; i < 150; i++) {
      const rType = ['REFACTOR:EXTRACT', 'REFACTOR:RENAME', 'REFACTOR:REORGANIZE', 'REFACTOR:SIMPLIFY', 'REFACTOR:TYPE', 'REFACTOR:PERF'][i % 6];
      const module = domains[i % domains.length];
      w(`${rType}: ${module} module. Current state: ${['monolithic function handling multiple concerns', 'poorly named symbols causing confusion', 'flat directory structure with no organization', 'deeply nested conditionals', 'missing type safety', 'O(n^2) algorithm'][i % 6]}. Target state: ${['extracted into focused functions', 'renamed to match domain vocabulary', 'organized by feature not by type', 'flattened with early returns', 'fully typed with strict mode', 'O(n) or better'][i % 6]}. Verification: pass existing tests before and after, confirm identical behavior, verify no new warnings. Risk default: ${['MEDIUM', 'HIGH (public)', 'MEDIUM', 'LOW', 'LOW', 'MEDIUM'][i % 6]}.`);
      w('');
    }

    // SCHEMA scenarios
    for (let i = 0; i < 120; i++) {
      const sType = ['SCHEMA:DB_ADD', 'SCHEMA:DB_REMOVE', 'SCHEMA:DB_RENAME', 'SCHEMA:DB_TYPE', 'SCHEMA:DB_INDEX', 'SCHEMA:EVENT_ADD', 'SCHEMA:EVENT_REMOVE', 'SCHEMA:MODEL'][i % 8];
      const table = ['users', 'orders', 'products', 'inventory', 'payments', 'sessions', 'audit_logs', 'notifications', 'subscriptions', 'accounts', 'profiles', 'settings', 'tokens', 'events', 'messages'][i % 15];
      w(`${sType}: ${table} table. ${['Add column', 'Remove column', 'Rename column', 'Change column type', 'Add index', 'Add event field', 'Remove event field', 'Update ORM model'][i % 8]}. ${['Backward compatible', 'Breaking — requires migration', 'Breaking — requires dual-write', 'Potentially breaking', 'Non-breaking performance improvement', 'Additive, safe', 'Breaking — consumer impact', 'Conditionally breaking'][i % 8]}. Migration strategy: ${['CREATE TABLE IF NOT EXISTS', 'DROP + recreate with backup', 'RENAME + create new + migrate', 'ALTER TABLE ALTER COLUMN', 'CREATE INDEX CONCURRENTLY', 'outbox event with version bump', 'consumer notification + grace period', 'model version upgrade'][i % 8]}. Rollback: ${['DROP COLUMN', 'restore from backup', 'RENAME back', 'ALTER back + data fix', 'DROP INDEX', 'revert event schema', 're-notify consumers', 'rollback model version'][i % 8]}.`);
      w('');
    }

    // CONTRACT scenarios
    for (let i = 0; i < 100; i++) {
      const endpoint = ['/api/v1/users', '/api/v1/orders', '/api/v1/products', '/api/v1/payments', '/api/v1/subscriptions', '/api/v1/notifications', '/api/v1/search', '/api/v1/reports', '/api/v1/webhooks', '/api/v1/integrations', '/api/v1/exports', '/api/v1/imports', '/api/v1/analytics', '/api/v1/audit', '/api/v1/admin'][i % 15];
      const change = ['CONTRACT:ROUTE_ADD', 'CONTRACT:ROUTE_REMOVE', 'CONTRACT:RESPONSE_ADD', 'CONTRACT:RESPONSE_REMOVE', 'CONTRACT:PARAM_ADD_REQ', 'CONTRACT:PARAM_REMOVE', 'CONTRACT:STATUS_CODE', 'CONTRACT:HEADER'][i % 8];
      w(`${change}: ${endpoint}. ${['Adding new endpoint with POST method', 'Removing deprecated endpoint', 'Adding response field to existing endpoint', 'Removing response field', 'Adding required query parameter', 'Removing optional parameter', 'Changing success status code', 'Adding custom response header'][i % 8]}. Breaking: ${['No (additive)', 'Yes — all consumers affected', 'No (additive)', 'Yes — consumers parsing response', 'Yes — all current requests will fail', 'Yes — consumers sending this param', 'Yes — client status code handling', 'No (additive)'][i % 8]}. Deprecation strategy: ${['none needed', 'migration guide + redirect', 'announce + add before remove', 'announce + grace period', 'announce + dual-support', 'announce + remove after N months', 'announce + test client compatibility', 'announce + add' ][i % 8]}.`);
      w('');
    }

    // CONFIG scenarios
    for (let i = 0; i < 100; i++) {
      const envVar = ['DB_HOST', 'REDIS_URL', 'API_KEY', 'JWT_SECRET', 'SENTRY_DSN', 'LOG_LEVEL', 'NODE_ENV', 'PORT', 'DATABASE_URL', 'CORS_ORIGINS', 'RATE_LIMIT_WINDOW', 'RATE_LIMIT_MAX', 'SESSION_TTL', 'TOKEN_EXPIRY', 'PAGINATION_DEFAULT_SIZE'][i % 15];
      w(`CONFIG:${['ENV_ADD', 'ENV_REMOVE', 'ENV_VALUE', 'FLAG', 'TIMEOUT', 'LIMIT', 'SECRET', 'LOG_LEVEL'][i % 8]}: ${envVar}. ${['Adding new required environment variable — all deployments must be updated', 'Removing deprecated environment variable — ensure no code references remain', 'Changing environment variable value — affects runtime behavior', 'Toggling feature flag — enables/disables feature', 'Adjusting timeout value — changes wait behavior', 'Modifying rate limit — affects client throughput', 'Rotating secret — requires coordinated deployment', 'Changing log level — affects observability verbosity'][i % 8]}. Risk: ${['HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'CRITICAL', 'LOW'][i % 8]}. All deployments affected: ${['yes — required var', 'yes — removal changes behavior', 'yes — value matters', 'yes — flag affects runtime', 'conditional', 'conditional', 'yes — secret rotation needed', 'no — log level is per-instance'][i % 8]}.`);
      w('');
    }

    // INFRA scenarios
    for (let i = 0; i < 100; i++) {
      const infraType = ['DOCKER', 'K8S', 'TERRAFORM', 'NETWORK', 'SCALING', 'STORAGE', 'IAM', 'MONITORING', 'CI', 'CD'][i % 10];
      const resource = ['nginx', 'postgres', 'redis', 'app-service', 'worker', 'cron-job', 'message-queue', 'cache-cluster', 'search-index', 'cdn-distribution'][i % 10];
      w(`INFRA:${infraType}: ${resource}. ${['Updating Dockerfile base image and dependencies', 'Modifying Kubernetes deployment manifest with resource limits', 'Changing Terraform module for infrastructure provisioning', 'Updating network security group rules', 'Adjusting horizontal pod autoscaler thresholds', 'Resizing persistent volume claim', 'Modifying IAM role permissions', 'Adding monitoring alert and dashboard', 'Updating CI pipeline build steps', 'Modifying CD pipeline deployment strategy'][i % 10]}. Risk: ${['HIGH', 'HIGH', 'HIGH', 'CRITICAL', 'MEDIUM', 'HIGH', 'CRITICAL', 'MEDIUM', 'MEDIUM', 'HIGH'][i % 10]}. State rollback: ${['docker compose down + up', 'kubectl rollout undo', 'terraform plan revert', 'restore previous security group', 'revert HPA config', 'revert PVC + restore data', 'revert IAM policy', 'disable alert', 'revert CI config', 'revert CD config'][i % 10]}.`);
      w('');
    }

    // EXPERIMENT scenarios
    for (let i = 0; i < 50; i++) {
      const tech = ['Redis Streams', 'Apache Kafka', 'gRPC', 'GraphQL Federation', 'WebAssembly', 'eBPF', 'DuckDB', 'ClickHouse', 'Temporal', 'Dagger'][i % 10];
      w(`EXPERIMENT:${['SPIKE', 'POC', 'PROTOTYPE', 'EVAL', 'BENCHMARK'][i % 5]}: ${tech} for ${domains[i % domains.length]} use case. Duration: ${['1 week', '2 weeks', '1 month', '1 week', '3 days'][i % 5]}. Success criteria: ${['functional integration', 'performance within threshold', 'feature parity', 'compatibility verified', 'throughput target met'][i % 5]}. Expiry: ${['2026-07-01', '2026-08-01', '2026-09-01', '2026-07-15', '2026-06-15'][i % 5]}. Cleanup plan: ${['remove spike code', 'remove POC branch', 'archive prototype', 'document findings', 'remove benchmark artifacts'][i % 5]}.`);
      w('');
    }

    // Analysis scenarios
    for (let i = 0; i < 50; i++) {
      w(`ANALYSIS:${['CODE', 'ARCHITECTURE', 'ERROR', 'DIFF', 'DEPLOY', 'SECURITY', 'PERFORMANCE', 'DEPENDENCY'][i % 8]} of ${domains[i % domains.length]} module. Scope: ${['review changed files since last deploy', 'examine service boundaries and coupling', 'diagnose production error pattern', 'review pending pull request diff', 'evaluate deployment readiness', 'audit security controls and dependencies', 'analyze performance bottlenecks', 'map dependency tree'][i % 8]}. Output: structured analysis with findings, risks, and recommendations. No code changes — pure analysis.`);
      w('');
    }

    // Incident scenarios
    const incidentTypes = ['OUTAGE', 'DATA_LOSS', 'SECURITY', 'DEGRADED', 'ROLLBACK', 'MITIGATION', 'PERFORMANCE', 'CAPACITY', 'DEPLOYMENT_FAILURE', 'COMPLIANCE'];
    for (let i = 0; i < 50; i++) {
      const it = incidentTypes[i % incidentTypes.length];
      w(`INCIDENT:${it}: ${domains[i % domains.length]} service. Severity: CRITICAL. All incidents are CRITICAL by default. Response: ${['immediate triage, assess blast radius, mitigate', 'data restore from backup, verify integrity', 'block attack vector, rotate credentials, audit logs', 'identify degradation cause, implement mitigation, monitor', 'execute rollback plan, verify pre-rollback state', 'apply fix, verify resolution, monitor for recurrence', 'analyze bottleneck, implement optimization, validate', 'scale resources, implement rate limiting, review capacity plan', 'revert deployment, diagnose failure, fix, redeploy', 'assess compliance gap, document, remediate'][i % 10]}. Post-incident: root cause analysis, monitoring gap review, prevention plan.`);
      w('');
    }

    // WorkType cross-check scenarios
    const crossChecks = [
      { primary: 'FEATURE', mistaken: 'REFACTOR', diff: 'FEATURE adds new behavior; REFACTOR preserves existing behavior unchanged. Key test: does the output change for the same input?' },
      { primary: 'FIX', mistaken: 'REFACTOR', diff: 'FIX changes behavior to correct an error; REFACTOR preserves behavior while improving structure. Key test: does the fix change visible behavior?' },
      { primary: 'SCHEMA', mistaken: 'CONFIG', diff: 'SCHEMA changes data structure (tables, columns, types); CONFIG changes runtime settings (values, flags, timeouts). Key test: does the change affect persisted data shape?' },
      { primary: 'CONTRACT', mistaken: 'FEATURE', diff: 'CONTRACT changes API boundaries; FEATURE adds internal implementation. Key test: does the change affect external consumers?' },
      { primary: 'CONFIG', mistaken: 'INFRA', diff: 'CONFIG is application-level settings; INFRA is environment-level provisioning. Key test: is a new resource being created?' },
      { primary: 'EXPERIMENT', mistaken: 'FEATURE', diff: 'EXPERIMENT has an expiration date and cleanup plan; FEATURE is permanent. Key test: will this code exist in 6 months?' },
      { primary: 'ANALYSIS', mistaken: 'FIX', diff: 'ANALYSIS does not modify code; FIX does. Key test: does the output include file writes?' },
      { primary: 'PLAN', mistaken: 'ANALYSIS', diff: 'PLAN produces artifacts (ADRs, designs); ANALYSIS does not. Key test: is there a deliverable document?' },
      { primary: 'DOCS', mistaken: 'CONTRACT', diff: 'DOCS describe existing behavior; CONTRACT prescribes behavior. Key test: does changing the doc change system behavior?' },
      { primary: 'INFRA', mistaken: 'CONFIG', diff: 'INFRA provisions and manages resources; CONFIG configures existing resources. Key test: is a cloud resource being created or modified?' },
    ];
    crossChecks.forEach(cc => {
      for (let i = 0; i < 5; i++) {
        w(`Cross-check: ${cc.primary} vs ${cc.mistaken} (variant ${i + 1}). ${cc.diff}. Apply this distinction when the change type is ambiguous. Conservative path: classify as the higher-risk type.`);
        w('');
      }
    });

    // Ambiguity resolution scenarios
    for (let i = 0; i < 80; i++) {
      const scenario = [
        `The user reports a bug in the ${domains[i % domains.length]} module but the stack trace points to a shared utility. Classify as FIX (conservative — treat runtime errors as bugs, even if the root cause is in a different module than the symptom).`,
        `The user asks to "clean up" the ${domains[i % domains.length]} module. This is REFACTOR unless behavior changes. Verify: run existing tests before and after. If tests pass and output is identical, it is REFACTOR. If behavior changes, reclassify as FIX or FEATURE.`,
        `The user adds a field to the ${domains[i % domains.length]} configuration. This is CONFIG if the field changes runtime behavior. It is SCHEMA if the field changes the shape of persisted data. Check: does this field get stored in a database?`,
        `The user updates the API documentation for ${domains[i % domains.length]}. This is DOCS if only the documentation changes. It is CONTRACT if the documentation reveals an undocumented current behavior that consumers depend on.`,
        `The user experiments with a new ${['caching strategy', 'database technology', 'message format', 'API pattern', 'deployment model'][i % 5]} in the ${domains[i % domains.length]} module. Classify as EXPERIMENT. Duration limit: 1 month. Expiry tracking required.`,
        `The user asks "explain how ${domains[i % domains.length]} works." This is ANALYSIS. No code changes. Output is explanatory. If the analysis reveals a bug, classify the explanation as ANALYSIS and the subsequent fix as FIX.`,
        `The user creates a plan for rewriting the ${domains[i % domains.length]} module. Classify as PLAN. Output: architecture decision record, migration plan, risk assessment. Subsequent implementation steps are FEATURE or REFACTOR.`,
        `The user adds a ${['health check endpoint', 'metrics endpoint', 'debug endpoint'][i % 3]} to ${domains[i % domains.length]}. This is FEATURE (new functionality). Even though it is small, it is additive behavior that changes the API surface.`,
      ][i % 8];
      w(scenario);
      w('');
    }

    // Classification confidence scenarios
    for (let i = 0; i < 60; i++) {
      const confidence = ['CERTAIN', 'LIKELY', 'UNCERTAIN', 'CONTRADICTED'][i % 4];
      const reason = [
        'The user explicitly stated the work type in their request: "Fix the timeout error in checkout."',
        'The user described the task in general terms: "Make the payment module better." Strong signals suggest FEATURE or REFACTOR.',
        'The request contains multiple possible interpretations: "Update the user endpoint." Is this adding a field (FEATURE), changing behavior (FIX), or restructuring (REFACTOR)?',
        'The user said both "just look at this" (ANALYSIS) and "fix it" (FIX) in the same message.',
      ][i % 4];
      w(`Confidence: ${confidence} — ${reason} ${confidence === 'UNCERTAIN' ? 'Ask one clarifying question with pre-computed options.' : confidence === 'CONTRADICTED' ? 'Stop. Resolve contradiction before proceeding.' : 'Proceed with current classification.'}`);
      w('');
    }
  }
};
