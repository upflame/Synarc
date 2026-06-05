module.exports = {
  generateS5expanded(w) {
    const stacks = ['Node.js/Express', 'Python/Django', 'Go/Chi', 'Rust/Axum', 'Java/Spring', 'C#/.NET', 'Ruby/Rails', 'PHP/Laravel', 'Swift/Vapor', 'Kotlin/Ktor'];
    const fileTypes = ['controller.ts', 'service.ts', 'repository.ts', 'middleware.ts', 'handler.ts', 'model.ts', 'route.ts', 'validator.ts', 'helper.ts', 'config.ts'];

    for (let i = 0; i < 300; i++) {
      const stack = stacks[i % stacks.length];
      const file = fileTypes[i % fileTypes.length];
      const op = ['Write', 'Edit', 'Delete', 'Rename', 'Move'][i % 5];
      w(`Pre-action check: ${op} ${file} in ${stack} project. A1: ${['adding new route handler', 'fixing bug in existing handler', 'refactoring service layer', 'updating model schema', 'adding validation middleware', 'modifying configuration'][i % 6]}. A2: ${['touches contract — inline warning', 'touches shared module — verify consumers', 'touches auth — CRITICAL floor', 'touches schema — migration check needed', 'internal only — no contract impact', 'read-only — no mutation'][i % 6]}. A3: ${['within declared scope', 'outside declared scope — flag UNPLANNED', 'within scope but cascading', 'scope unclear — clarify'][i % 4]}. A4: rollback ${['git checkout', 'restore from backup', 'migration revert', 'no rollback — IRREVERSIBLE'][i % 4]}. A5: ${['not destructive', 'destructive — read current state first', 'migration — confirm intent', 'new file — no overwrite risk'][i % 4]}. A6: aggregate risk ${['unchanged', '+1', '+2', '→ CRITICAL'][i % 4]}.`);
      w('');
    }

    // Pre-action failure scenarios
    for (let i = 0; i < 200; i++) {
      const failure = [
        'File does not exist at expected path — check alternate locations, verify the path is correct',
        'File read fails due to permissions — log error, attempt different access method, report if persistent',
        'Command execution fails with non-zero exit — capture stderr, classify error, retry or escalate',
        'API call times out — retry with exponential backoff, max 3 attempts, escalate if all fail',
        'Multiple files need writes but dependency order is circular — break circular dependency, checkpoint',
        'Test failure after change — diagnose failure, determine if existing test is wrong or new code is wrong',
        'Type error after change — type mismatch between interface and implementation, fix type contract',
        'Lint warning after change — address warning, maintain code quality standards, do not ignore',
        'Migration fails mid-step — check transaction state, determine if partial migration occurred, fix and retry',
        'Rollback fails — state is partially migrated, manual intervention required, escalate to user',
      ][i % 10];
      w(`Error recovery: ${failure}. Classification: ${['transient — retry', 'transient — retry with backoff', 'permanent — stop and surface', 'permanent — log and checkpoint', 'partial success — resume from last'][i % 5]}. Session impact: note in ledger, update aggregate risk if applicable, checkpoint if HIGH+.`);
      w('');
    }

    // Language-specific execution rules
    for (let i = 0; i < 200; i++) {
      const stack = stacks[i % stacks.length];
      const patterns = {
        'Node.js/Express': { test: 'jest', type: 'tsc --noEmit', lint: 'eslint', build: 'npm run build', pkg: 'npm ls', fmt: 'prettier' },
        'Python/Django': { test: 'pytest', type: 'mypy', lint: 'ruff', build: 'python setup.py', pkg: 'pip list', fmt: 'black' },
        'Go/Chi': { test: 'go test', type: 'go vet', lint: 'golangci-lint', build: 'go build', pkg: 'go list', fmt: 'gofmt' },
        'Rust/Axum': { test: 'cargo test', type: 'cargo check', lint: 'clippy', build: 'cargo build', pkg: 'cargo tree', fmt: 'rustfmt' },
        'Java/Spring': { test: 'mvn test', type: 'mvn compile', lint: 'checkstyle', build: 'mvn package', pkg: 'mvn dependency:tree', fmt: 'spotless' },
      };
      const p = patterns[stack] || { test: 'test', type: 'typecheck', lint: 'lint', build: 'build', pkg: 'list', fmt: 'fmt' };
      w(`Stack: ${stack}. Verification commands: type check: ${p.type}, lint: ${p.lint}, test: ${p.test}, build: ${p.build}, format: ${p.fmt}. Run after every file write sequence. If any command fails, diagnose and fix before continuing. Do not skip verification for speed.`);
      w('');
    }

    // Scope boundary scenarios
    const scopeDeclarations = [
      { task: 'Add rate limiting to payment API', files: ['src/payment/middleware.ts', 'src/payment/types.ts'], modules: ['payment'] },
      { task: 'Fix null pointer in auth middleware', files: ['src/auth/middleware.ts'], modules: ['auth'] },
      { task: 'Implement user search endpoint', files: ['src/search/controller.ts', 'src/search/service.ts', 'src/search/repository.ts'], modules: ['search'] },
      { task: 'Update user profile to include avatar', files: ['src/users/profile.ts', 'src/users/types.ts'], modules: ['users'] },
      { task: 'Refactor checkout flow for performance', files: ['src/checkout/handler.ts', 'src/checkout/service.ts', 'src/checkout/repository.ts', 'src/checkout/types.ts'], modules: ['checkout'] },
    ];
    scopeDeclarations.forEach(sd => {
      for (let i = 0; i < 20; i++) {
        const extraFile = fileTypes[i % fileTypes.length];
        w(`Scope: ${sd.task}. Files: ${sd.files.join(', ')}. Modules: ${sd.modules.join(', ')}. Detected out-of-scope: ${extraFile} is not in the declared file list. If this file needs modification, flag UNPLANNED before proceeding. Risk escalation: +1 for scope expansion.`);
        w('');
      }
    });

    // Code review scenarios
    for (let i = 0; i < 150; i++) {
      const layer = ['Correctness', 'Contracts', 'Quality', 'Architecture', 'Security', 'Performance'][i % 6];
      const verdict = ['BLOCK', 'BLOCK', 'CHANGE', 'COMMENT', 'BLOCK', 'COMMENT'][i % 6];
      const issue = [
        'Logic error in conditional branching — path A and path B are handled, but path C (all-other-cases) falls through to default behavior that violates business rules',
        'Response shape changed — the endpoint formerly returned {id, name} now returns {id, name, email} without versioning or documentation',
        'Function exceeds 100 lines with nested conditionals — extract validation logic, error handling, and response formatting into separate functions',
        'Module imports from four layers (controller, service, repository, external) creating circular dependency — introduce interface abstraction',
        'SQL query concatenates user input directly — use parameterized query to prevent SQL injection',
        'N+1 query pattern in loop — batch the queries into a single IN clause or use DataLoader pattern',
      ][i % 6];
      w(`Review layer ${layer}: ${issue}. Verdict: ${verdict}. ${verdict === 'BLOCK' ? 'Must fix before merge — non-negotiable.' : verdict === 'CHANGE' ? 'Should fix — improves quality.' : 'Consider for future — acknowledge as technical debt.'} Impact: ${['functionality is incorrect', 'consumers will break', 'code is maintainable but not clean', 'future changes will be harder', 'production data at risk', 'production performance will degrade'][i % 6]}.`);
      w('');
    }

    // Decision tree traversal examples
    for (let i = 0; i < 100; i++) {
      const node = [
        'Read task description → classify WorkType → check scope → begin execution',
        'Before tool call: classify this call → verify scope → read file (if write) → check safety (if command) → execute',
        'Error encountered: stop → classify error type → transient? → retry or escalate → log outcome',
        'Scope expansion detected: new file outside declared scope → classify expansion → if MEDIUM+ → pause and flag → re-declare scope',
        'Multi-file change: read all affected files → determine dependency order → execute writes → run project validation',
        'Risk threshold reached: aggregate risk HIGH → pause → surface checkpoint → require confirmation → continue or abandon',
        'Contract change detected: identify all consumers → assess impact → emit breaking change analysis → update contracts doc',
        'Review request received: read diff → apply review layers in order → produce aggregated verdict → suggest fixes',
      ][i % 8];
      w(`Decision tree: ${node}. Each node is a check point. Never skip nodes. Speed is not a valid reason to bypass safety checks. If context is constrained, complete all checks before any execution.`);
      w('');
    }
  }
};
