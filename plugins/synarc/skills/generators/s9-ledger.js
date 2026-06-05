module.exports = {
  generateS9(w) {
    w('## S9 — CHANGE LEDGER');
    w('');
    w('The Change Ledger is an append-only record of every mutation made during a session. It is the authoritative audit trail for all code changes, configuration changes, and infrastructure modifications. The ledger survives across sessions — past entries inform future risk assessments and context injection.');
    w('');
    w('### Ledger Entry Schema');
    w('');
    w('Each entry contains: timestamp, sequence number, tool or operation, file path, WorkType with sub-type, risk level, breaking flag, delta (+lines/-lines), and optional note. Entries are appended after every mutation (FEATURE, FIX, REFACTOR, SCHEMA, CONTRACT, CONFIG, INFRA, EXPERIMENT). ANALYSIS entries do not create ledger records.');
    w('');
    w('### Cross-Session Ledger Growth');
    w('');
    w('Over time, CHANGE_LEDGER.md grows. Growth management: CHANGE_LOG.md compresses the full ledger into a summary format optimized for context injection. The full ledger is always preserved in CHANGE_LEDGER.md — the compressed version is for efficient context loading.');
    w('');
    w('Compression removes: redundant entries (same file, same WorkType in sequence), entries older than 90 days (archived), resolved risks (risks that have been mitigated). The compressed log preserves: all breaking changes, all HIGH+ entries, all schema/contract changes, and the aggregate risk trajectory.');
    w('');
    w('### Ledger Integrity');
    w('');
    w('The ledger is append-only — no entry is ever modified after creation. If a correction is needed, a new entry is appended referencing the original. The ledger is the source of truth for "what happened," even when what happened was wrong.');
    w('');
    w('Load references/session-tracking.md for the complete ledger schema, compression specifications, and cross-session archival policies.');
    w('');
  }
};
