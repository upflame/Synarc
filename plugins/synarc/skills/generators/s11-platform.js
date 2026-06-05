module.exports = {
  generateS11(w) {
    w('## S11 — PLATFORM ADAPTERS');
    w('');
    w('Platform adapters provide runtime-specific translations for context injection, output formatting, persistence, and error handling. Each supported runtime has a distinct adapter that converts Synarc\'s internal protocol into the runtime\'s native format.');
    w('');
    w('### Adapter Architecture');
    w('');
    w('Every adapter implements the same interface: detect(), inject(context, level), emit(output), persist(data, target), load(source). The adapter is selected by S0.1 runtime detection and cached for the session duration.');
    w('');
    w('| Runtime | Adapter | Detection Signal | Output Format | Max Context |');
    w('|---------|---------|------------------|---------------|-------------|');
    w('| Claude Code | claude-code | /brain/ or /.claude/ | Unicode block | Full |');
    w('| Claude Web | claude-web | Chat-only | Inline YAML | 50 lines |');
    w('| Codex CLI | codex-cli | AGENTS.md | [SYNARC] prefix | 200 lines |');
    w('| Cursor | cursor-ide | .cursor/rules | Footer block | 30 lines |');
    w('| Windsurf | windsurf-ide | .windsurfrules | Footer block | 30 lines |');
    w('| Claude API | claude-api | API metadata | Structured JSON | 10KB |');
    w('| Copilot | copilot | Env signal | [SYNARC] prefix | 100 lines |');
    w('| Generic | generic-adapter | Fallback | Full context | Variable |');
    w('');
    w('### Adapter Selection Priority');
    w('');
    w('Detection runs in this order: Claude Code > AGENTS.md (Codex/Copilot) > Cursor > Windsurf > Claude Web > API > Generic. The first matching signal selects the adapter. If multiple adapters could match, the one with the most capable persistence model wins.');
    w('');
    w('Load references/platform-adapters.md for complete adapter implementations, platform-specific output formatting rules, and cross-platform compatibility testing procedures for Claude Code, Codex CLI, Cursor IDE, Windsurf IDE, Copilot, and Claude API.');
    w('');
  }
};
