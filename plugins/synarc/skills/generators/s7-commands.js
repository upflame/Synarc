module.exports = {
  generateS7(w) {
    w('## S7 — SESSION COMMANDS');
    w('');
    w('These commands can be issued by the user at any time during a session. Each triggers a specific Synarc response. Commands are natural language — the exact phrasing may vary, but the intent is classified and matched to the appropriate handler.');
    w('');
    w('### Command Reference');
    w('');
    w('| Command | Triggers | Response |');
    w('|---------|----------|----------|');
    w('| "what did we change?" | session status, status, what changed | Full session ledger: every file touched, WorkType, risk, breaking flag, sorted chronologically |');
    w('| "summarize this session" | summarize, summary, recap | One-paragraph cognitive summary: present tense for current state, past for completed changes, 4-6 sentences, architectural significance + downstream impact + primary risk + safe extension points |');
    w('| "is this safe to deploy?" | safe to deploy, deploy check, can I deploy | Risk delta + explicit YES/NO + specific blockers. If CRITICAL or unresolved HIGH: NO. If all ≤MEDIUM and no breaking: YES |');
    w('| "what tests are missing?" | test gaps, missing tests, coverage | Per changed file: what test type covers it, exists/does not exist, recommended test description |');
    w('| "generate a snapshot" | snapshot, checkpoint, save state | Full brain/snapshots/ entry with all required sections, no placeholder content |');
    w('| "show synarc context" | show context, context block | Display the current SYNARC context block with all field values |');
    w('| "what broke?" | breaking changes, what is breaking | All ledger entries with breaking: true, impact analysis, migration path |');
    w('| "full handoff" | handoff, agent handoff | Complete agent handoff block: session state, ledger, checkpoints, remaining tasks, rollback plan |');
    w('| "session status" | status, session state | Current session state: active task, tool calls made, aggregate risk, files touched, contracts changed |');
    w('| "what is the risk?" | risk, risk assessment, am I safe? | Aggregate risk level, top 3 risks with modules and descriptions |');
    w('| "what modules are affected?" | affected modules, impact analysis | Modules touched this session, contracts changed, risks per module |');
    w('| "rollback plan" | rollback, undo, revert | Files written with rollback commands per file, irreversible changes flagged |');
    w('| "session checkpoint" | checkpoint, save, checkpoint now | Force checkpoint at current state, return checkpoint ID |');
    w('| "session export" | export, share, transfer | Compressed context block for cross-session or cross-agent transfer |');
    w('| "run quality gates" | quality gates, gates, verify | All quality gates PASS/FAIL with details on failures |');
    w('| "what is the architecture?" | architecture, system design | Current architecture from brain files: style, modules, contracts, data flow |');
    w('| "show brain files" | brain, brain summary, knowledge base | List all brain files with last updated timestamp and summary |');
    w('| "error analysis" | errors, bugs, error patterns | Last N errors with root cause, fix, and recurrence pattern |');
    w('');
    w('### Command Matching');
    w('');
    w('Commands are matched by intent, not exact phrase. The classifier identifies the command type from the user message. If the intent is ambiguous, assume the simpler command (e.g., "status" maps to session status, not full ledger). If multiple commands could match, execute the most recent one requested.');
    w('');
    w('### Command Output Consistency');
    w('');
    w('All command outputs follow a consistent format: header with command name, content in the appropriate structure (table, list, or paragraph), and footer with a "what next" suggestion if relevant. Outputs are designed for quick scanning — the most important information appears first.');
    w('');
  }
};
