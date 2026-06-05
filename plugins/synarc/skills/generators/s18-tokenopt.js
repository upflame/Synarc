module.exports = {
  generateS18(w) {
    w('## S18 — TOKEN OPTIMIZATION');
    w('');
    w('Token optimization ensures Synarc operates efficiently within AI context window constraints. Every token counts — unnecessary tokens reduce the available budget for engineering content. Optimization applies to both input (skill files, context injection) and output (responses, auto-emit).');
    w('');
    w('### Compression Strategies');
    w('');
    w('**Structural compression:** Use tables instead of prose lists. Use code blocks for structured data. Use bullet points for enumerations. Use H3 ### instead of H2 ## for sub-sections (saves 1 token per heading).');
    w('');
    w('**Lexical compression:** Replace multi-word phrases with compact equivalents. "In order to" → "to". "Due to the fact that" → "because". "A significant number of" → "many". "At this point in time" → "now". "It is worth noting that" → "note:". These replacements save 2-4 tokens each and compound over the course of a session.');
    w('');
    w('**Semantic compression:** Use standard abbreviations: k (thousand), ms (milliseconds), s (seconds), KB (kilobytes), MB (megabytes), p50/p95/p99 (percentiles). Use → for directional relationships. Use == for definitions. Use / for alternatives.');
    w('');
    w('### Context Budget Management');
    w('');
    w('| Budget Remaining | Strategy |');
    w('|-----------------|----------|');
    w('| > 60% | Full context — load all relevant sections |');
    w('| 40-60% | Standard — load framework + 2-4 relevant sections |');
    w('| 20-40% | Compact — load only S1, S2, current domain section |');
    w('| 10-20% | Minimal — classification only, skip all section loading |');
    w('| < 10% | Emergency — output only, stop loading new content |');
    w('');
    w('### Deduplication Across Skills');
    w('');
    w('Synarc core defines S-sections once. Child skills reference by ID rather than duplicating. P0 is shared across all skills. This hierarchical deduplication means loading multiple skills costs marginally more than loading one — the shared cache prefix covers core content.');
    w('');
    w('Load references/negative-prompts.md section on compression for the complete token optimization guide including: compression patterns table, context budget management algorithm, prompt caching architecture, cross-skill deduplication rules, and streaming output optimization patterns.');
    w('');
  }
};
