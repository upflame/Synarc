# Fallback Prompt: Tier 2 — External Integration

When the native capability is unavailable, use external tools or APIs to accomplish the task.

## Template

```
The {capability_name} capability is not natively available in this runtime.

Use external tools to accomplish the task:
1. Use {tool_name} to {action}
2. Parse the output to extract {field}
3. Format as {output_format}

Workaround:
- If {tool_name} is unavailable, fall back to Tier 3 (manual workflow).
```

## Examples

### Change Classification (via git diff)
```
The change classification capability is not natively available.

Use git to analyze changes:
1. Run `git diff --stat HEAD~1..HEAD` to get file change summary
2. Run `git diff HEAD~1..HEAD` to get full diff
3. Analyze the diff to determine:
   - WorkType: FEATURE (new files) / FIX (error handling) / REFACTOR (structure change)
   - Risk Level: based on file types affected (auth/payment = HIGH, docs = LOW)
   - Breadth: count of files and services affected

If git is unavailable, fall back to Tier 3.
```

### Risk Assessment (via static analysis)
```
The risk assessment capability is not natively available.

Use static analysis tools:
1. Run linter to identify code quality issues
2. Run type checker to identify type errors
3. Run security scanner to identify vulnerabilities
4. Aggregate findings into risk assessment

If no analysis tools are available, fall back to Tier 3.
```
