# Coding Agent Reference

See `skills/coding-agent/SKILL.md` for the complete autonomous code generation framework.

## Execution Model

1. **Plan** - Decompose task into ordered steps
2. **Execute** - Implement each step with tool calls
3. **Verify** - Run tests, check types, validate output
4. **Iterate** - Fix failures and re-verify

## Tool Call Classification

| Tool | Risk | Pre-check Required |
|------|------|--------------------|
| Read | INFO | No |
| Write | MEDIUM | Yes - scope check |
| Edit | MEDIUM | Yes - diff review |
| Bash | HIGH | Yes - command review |
| Grep/Glob | INFO | No |
