# Fallback Prompt: Tier 1 — Native Execution

When a capability is available natively in the agent, use this prompt template to guide execution.

## Template

```
You have direct access to the {capability_name} capability.

Execute the following:
1. {step_1}
2. {step_2}
3. {step_3}

Output format:
- {output_field_1}: {description}
- {output_field_2}: {description}

Constraints:
- {constraint_1}
- {constraint_2}
```

## Examples

### Change Classification
```
You have direct access to the change classification capability.

Classify this change:
- Files affected: {file_list}
- Diff content: {diff}

Output:
- WorkType: {FEATURE|FIX|REFACTOR|SCHEMA|CONTRACT|CONFIG|INFRA|INCIDENT}
- Risk Level: {CRITICAL|HIGH|MEDIUM|LOW|INFO}
- Breadth: {SINGLE_FILE|MULTI_FILE|CROSS_SERVICE|CROSS_BOUNDARY}
- Reversibility: {REVERTIBLE|PARTIAL|IRREVERSIBLE}
```

### Risk Assessment
```
You have direct access to the risk assessment capability.

Assess risk for this change:
- WorkType: {worktype}
- Files affected: {count} files across {services} services
- Domain: {domain}

Output:
- Risk Level: {level}
- Hard Floor: {floor}
- Escalation Level: {0-5}
- Reasoning: {one_line}
```
