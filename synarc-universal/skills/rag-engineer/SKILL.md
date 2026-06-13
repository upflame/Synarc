---
name: rag-engineer
schema: skill-pack/v1
dependencies:
  synarc-core: ">=6.0.0"
title: RAG Engineer — Retrieval-Augmented Generation Pipelines
description: RAG engineering reasoning — chunking strategies, embedding model selection, vector store selection, retrieval architectures (dense, sparse, hybrid), reranking, query rewriting, HyDE, multi-hop retrieval, evaluation (context precision/recall, faithfulness, answer relevance), RAG security (retrieval poisoning, indirect injection), agentic RAG, observability. The dominant production AI pattern of 2026 (35.9% of AI engineering jobs). Inherits synarc core.
version: 1.0.0
category: ai-era
tags:
  - rag
  - retrieval-augmented-generation
  - embeddings
  - vector-search
  - chunking
  - reranking
  - hybrid-search
  - hyde
  - multi-hop
  - rag-evals
  - rag-security
  - agentic-rag
compatible_agents:
  - codex
  - opencode
  - cursor
  - gemini-cli
  - claude-code
  - copilot
  - windsurf
  - cline
  - roo-code
---

# RAG Engineer — Retrieval-Augmented Generation Pipelines

Inherits synarc core. All synarc prohibitions apply.

RAG = Retrieve relevant context, Augment the prompt, Generate. RAG is the dominant production pattern for grounding LLMs in private or fresh data without retraining. 35.9% of AI engineering job postings in 2026 mention RAG. This skill covers the full pipeline: ingestion, chunking, embedding, retrieval, reranking, generation, evaluation, and security.


## P2 — RAG PIPELINE ARCHITECTURE

### P2.1 — The 5 Stages

```
STAGE 1: INGEST
  Source -> Extract -> Normalize -> Chunk -> Embed -> Index
  Source types: PDFs, docs, code, DBs, Notion, Slack, web pages
  Failure modes: format errors, encoding issues, broken tables

STAGE 2: RETRIEVE
  Query -> Embed -> Search index -> Top-K candidates
  Search types: dense (vector), sparse (BM25), hybrid
  Failure modes: empty result, off-topic, semantic gap

STAGE 3: RERANK
  Top-K -> Cross-encoder rerank -> Top-N
  Failure modes: too aggressive pruning, latency

STAGE 4: AUGMENT
  Query + Top-N context -> Prompt template -> LLM
  Failure modes: context overflow, instruction drift

STAGE 5: GENERATE
  LLM -> Answer + Citations
  Failure modes: hallucination, lost citations, over-trust
```

### P2.2 — When RAG Beats Fine-Tuning

```
USE RAG WHEN:
  - Data changes frequently (docs, news, internal wiki)
  - Citations are required (legal, medical, finance)
  - You need freshness (latest policies, latest code)
  - You cannot afford retraining cost
  - You must update knowledge without redeploying the model
  - Source attribution matters

USE FINE-TUNING WHEN:
  - You need a specific output style or format
  - You need a specific reasoning pattern
  - The knowledge is static and large
  - You need very low latency (no retrieval hop)

USE BOTH WHEN:
  - Fine-tune for style/format
  - RAG for fresh, attributed knowledge
```


## P3 — CHUNKING

### P3.1 — Chunking Strategies

```
FIXED-SIZE (default, simple):
  - Split by N tokens (e.g., 512) with M token overlap (e.g., 50)
  - Pros: predictable, simple, fast
  - Cons: breaks mid-sentence, mid-table, mid-code
  - Use for: prototype, simple text

SEMANTIC (recommended for most):
  - Split at natural boundaries (paragraph, section, code function)
  - Pros: preserves meaning, better retrieval
  - Cons: variable sizes, more complex
  - Use for: docs, articles, structured content

STRUCTURE-AWARE:
  - Use the document's structure (headings, code blocks, table rows)
  - Pros: highest quality chunks
  - Cons: parser per format
  - Use for: Markdown, HTML, code, legal contracts

RECURSIVE:
  - Try large splits first (sections), fall back to smaller (paragraphs, sentences)
  - Pros: balance of structure + bounded size
  - Cons: complex
  - Use for: mixed-format documents

HIERARCHICAL:
  - Index at multiple levels (chunk, section, document)
  - Retrieve at the right level
  - Pros: efficient, multi-granular
  - Cons: complex, more storage
  - Use for: long documents, code repos
```

### P3.2 — Chunking Parameters

```
CHUNK SIZE:
  - 128-256 tokens: small, focused, but loses context
  - 512-1024 tokens: sweet spot for most tasks
  - 2048+ tokens: large, but dilutes retrieval precision

OVERLAP:
  - 10-20% of chunk size is typical
  - Too little: miss context at boundaries
  - Too much: duplicate content, higher storage cost

METADATA TO PRESERVE:
  - Source document ID
  - Section/heading hierarchy
  - Page number (PDFs)
  - Line numbers (code)
  - Timestamp (for freshness)
  - Author (for trust)
  - Tags / categories
  - Access control labels
```


## P4 — EMBEDDINGS

### P4.1 — Embedding Model Selection

```
SELECTION CRITERIA:
  - Task: semantic search, classification, clustering, code
  - Domain: general, code, legal, medical, multilingual
  - Dimensions: 384, 768, 1024, 1536, 3072
  - Cost: per-token or per-query
  - Latency: ms per embed
  - License: commercial vs OSS
  - Context length: 512, 2048, 8192 tokens

PROFILES (2026):
  General short text:    text-embedding-3-small, bge-small, e5-small
  General long text:     text-embedding-3-large, voyage-large, bge-large
  Code:                  voyage-code, jina-code, codebert
  Multilingual:          bge-m3, e5-mistral, mxbai-embed-large
  Domain-specific:       fine-tune bge/e5 on your data

DIMENSION TRADEOFF:
  Higher dim = more nuance, more storage, slower search
  Lower dim = less nuance, cheaper, faster
  1024 is the 2026 sweet spot for most enterprise RAG.
```

### P4.2 — Embedding Pitfalls

```
PITFALLS:
  - Mixing embedding models in one index (incompatible spaces)
  - Embedding without normalizing for cosine similarity
  - Embedding without chunking first (huge blobs, bad precision)
  - Re-embedding everything when you switch models (do dual-index instead)
  - Embedding code with a text model (use a code embedding model)
  - Embedding mixed languages with a single-language model
```


## P5 — RETRIEVAL

### P5.1 — Retrieval Strategies

```
DENSE (vector similarity):
  - Embed query and chunks, cosine similarity
  - Strong: semantic match, paraphrases, cross-lingual
  - Weak: exact terms, IDs, names, recent terms not in training

SPARSE (BM25, TF-IDF):
  - Lexical match, term frequency
  - Strong: exact terms, IDs, error codes, names
  - Weak: paraphrases, semantic similarity

HYBRID (recommended default):
  - Combine dense + sparse (reciprocal rank fusion, learned fusion)
  - Strong: best of both
  - Weak: tuning required

MULTI-VECTOR (ColBERT-style):
  - Embed every token, late interaction
  - Strong: highest precision
  - Weak: storage cost, latency

MULTI-HOP:
  - Retrieve, reason, retrieve again
  - Strong: complex questions requiring chain of facts
  - Weak: latency, complexity
```

### P5.2 — Query Rewriting & HyDE

```
QUERY REWRITING:
  - Resolve references: "What about its pricing?" -> "pricing of product X"
  - Expand abbreviations: "SSO" -> "single sign-on"
  - Add context: "the SDK" -> "the TypeScript SDK for product X"

HyDE (Hypothetical Document Embeddings):
  - Ask LLM to generate a hypothetical answer
  - Embed the hypothetical, use that for retrieval
  - Strong: when query is short / vague
  - Weak: cost of extra LLM call

STEP-BACK PROMPTING:
  - Generate a more abstract query first
  - Retrieve for both abstract + original
  - Strong: factual questions that need concept lookup first
```

### P5.3 — Reranking

```
ALWAYS RERANK WHEN:
  - Top-K > 5 (rerank brings best to top)
  - Latency budget allows (cross-encoder = 50-200ms)
  - Quality matters more than speed

RERANKER CHOICES:
  - Cross-encoder: highest quality, slowest
  - ColBERT: good quality, moderate speed
  - LLM-based: highest quality, slowest, most expensive
  - Cohere Rerank / Jina Rerank: managed, fast
  - bge-reranker: OSS, self-hostable

WHEN TO SKIP RERANK:
  - Top-K = 1-3
  - Latency budget < 100ms total
  - Quality is already > 95%
```


## P6 — GENERATION

### P6.1 — Prompt Template for RAG

```
TEMPLATE:
  SYSTEM: You answer questions using ONLY the provided context.
          If the context does not contain the answer, say "I don't know".
          Always cite the source by its [n] marker.
          Do not use prior knowledge.

  USER:
    Context:
    [1] <chunk 1 with source label>
    [2] <chunk 2 with source label>
    [3] <chunk 3 with source label>

    Question: {query}

    Answer with citations in the form [n].

RULES:
  - Strict context grounding: "I don't know" if not in context
  - Citations: every claim has a [n] reference
  - No fabrication: if uncertain, say so
  - Show sources at the end: "Sources: [1] doc.md, [2] faq.md"
```

### P6.2 — Hallucination Mitigation

```
STRATEGIES:
  1. Strict context grounding (above prompt)
  2. Low temperature (0.0 for factual, 0.3 for creative)
  3. Structured output (force citations in schema)
  4. Self-verification step: "Did you use only the context? If not, regenerate."
  5. Faithfulness eval: compare answer to context automatically

EVAL METRIC:
  Faithfulness = (claims in answer that are supported by context) / (all claims)
  Target: > 0.95 for high-stakes domains
```


## P7 — RAG EVALUATION

### P7.1 — Three Core Metrics

```
CONTEXT PRECISION:
  Of the retrieved chunks, how many are relevant?
  Higher = less noise in the context
  Target: > 0.80

CONTEXT RECALL:
  Of the chunks needed to answer, how many were retrieved?
  Higher = fewer missed facts
  Target: > 0.90

ANSWER FAITHFULNESS:
  Of the claims in the answer, how many are supported by the context?
  Higher = less hallucination
  Target: > 0.95

ANSWER RELEVANCE:
  Does the answer address the actual question?
  Higher = less off-topic
  Target: > 0.90
```

### P7.2 — Eval Construction

```
EVAL SET:
  - 100+ real user queries (anonymized)
  - Gold answers (human-written)
  - Gold relevant chunks (human-labeled)
  - Adversarial queries (unanswerable, ambiguous, hostile)

EVAL TOOLS:
  - RAGAS (open source)
  - TruLens (open source)
  - DeepEval (open source)
  - LangSmith (managed)
  - Phoenix (Arize, OSS)

HUMAN EVAL:
  - Sample 50 cases per release
  - Score: faithfulness, relevance, citation accuracy
  - Compare to LLM-judge scores (calibration)
```

### P7.3 — Common Failure Modes

| Failure | Symptom | Fix |
|---|---|---|
| Low recall | Missing relevant docs | Tune chunking, add hybrid, expand query |
| Low precision | Irrelevant context in top-K | Rerank, tighten query, add metadata filter |
| Hallucination | Answer not in context | Stricter prompt, lower temp, faithfulness gate |
| Lost citations | Answer says [3] but no [3] in context | Validate citations in output |
| Stale data | Answer reflects old facts | Add freshness filter, reindex schedule |
| Right answer, wrong source | Citation points to wrong doc | Improve chunking to keep source aligned |


## P8 — RAG SECURITY

### P8.1 — Threat Model

```
T1: Indirect prompt injection via retrieved docs
    Attacker poisons a document the RAG will retrieve.
    The chunk contains hidden instructions that override system prompt.
    Defense: chunk provenance, content sanitization, instruction/data separation.

T2: Retrieval poisoning
    Attacker inserts malicious documents into the index.
    Defense: ingestion allowlist, source verification, signed docs.

T3: Data exfiltration via citations
    The answer cites a private URL the user can then access.
    Defense: enforce same access control on citations as on source docs.

T4: Multi-user leakage
    User A's query retrieves chunks from a doc User A cannot access.
    Defense: enforce ACL at retrieval time, not at index time.
```

### P8.2 — Defenses

```
MANDATORY:
  - ACL at retrieval: filter chunks by user's permissions
  - Source verification: only ingest from trusted sources
  - Citation validation: every [n] must point to a real, accessible chunk

RECOMMENDED:
  - Anomaly detection on retrieved content (unusual patterns)
  - Length cap on chunks (prevent prompt-bloat attacks)
  - Output schema enforcement (force citation structure)
  - Periodic reindexing with source audit trail
```


## P9 — AGENTIC RAG

### P9.1 — From Static RAG to Agentic RAG

```
STATIC RAG:
  query -> retrieve -> augment -> generate
  One retrieve call. Fixed pipeline.

AGENTIC RAG:
  query -> agent loop:
    - decide whether to retrieve
    - decide which index / tool to query
    - decide whether to retrieve more
    - decide when to answer
  Multiple retrieve calls per query. Adaptive.

WHEN TO GO AGENTIC:
  - Multi-source queries (docs + DBs + web)
  - Multi-hop questions (need chain of facts)
  - Ambiguous queries (need clarification)
  - High-stakes domain (need verification step)
```

### P9.2 — Agentic RAG Patterns

```
PATTERN 1: SELF-ASK
  Agent asks itself clarifying questions, retrieves for each.
  Good for: complex multi-part questions.

PATTERN 2: REACT-STYLE RETRIEVE
  Agent loops: think, retrieve, read, think, retrieve again, answer.
  Good for: research-style queries.

PATTERN 3: PLAN-AND-RETRIEVE
  Plan retrieval steps upfront, execute, synthesize.
  Good for: known multi-step queries (compliance check, etc.)

PATTERN 4: CORRECTIVE RAG (CRAG)
  Retrieve, evaluate relevance, re-retrieve with new query if low.
  Good for: when initial retrieval quality is variable.
```


## P10 — OUTPUT FORMATS

### P10.1 — RAG System Specification

```
SYSTEM:         [name]
USE CASE:       [what user need it serves]
CORPUS:         [source, size, freshness SLA]
EMBEDDING:      [model, dim]
CHUNKING:       [strategy, size, overlap]
INDEX:          [vector store, hybrid? metadata filters?]
RETRIEVAL:      [dense/sparse/hybrid, top-K]
RERANK:         [model, top-N]
LLM:            [model, temperature, max tokens]
PROMPT:         see /prompts/rag/<id>/
EVAL:           [metrics, dataset, threshold]
SECURITY:       [ACL model, injection defenses]
LATENCY BUDGET: [ms p50, ms p95]
COST BUDGET:    [per query]
```

### P10.2 — RAG Failure Analysis

```
QUERY:           "What's the Q3 revenue for product X?"
RETRIEVED:       [3 chunks about Q3 OKRs, 1 about product X, 0 about Q3 revenue]
GOLD:            [chunk about Q3 revenue for product X]
ROOT CAUSE:      Query embedded poorly OR index missing the right doc
FIX:             [specific action: reindex, add metadata, change query embedding]

QUERY:           ...
```
```

## P11 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| 4096-token chunks | Retrieval precision collapses | 512-1024 tokens with overlap |
| No chunking, embed whole docs | Massive blobs, semantically muddy | Chunk first, embed chunks |
| BM25 only, no semantic | Misses paraphrases, conceptual queries | Hybrid retrieval (default) |
| No reranking, top-K=20 | Noisy context dilutes answer | Rerank, top-N=3-5 |
| No eval set, "looks good" | No signal, no regression detection | Frozen eval set + RAGAS |
| Top-K=1 | Misses relevant context | Top-K=10, rerank to 3-5 |
| Prompt: "Use the context to answer" (vague) | Model uses prior knowledge | "Use ONLY the context. Say 'I don't know' if not in context." |
| No ACL at retrieval time | Multi-tenant data leak | Filter by user permissions on every retrieve |
| Embedding user data in a public model | Privacy / compliance | Use a model you control, scrub PII first |
| Same chunking for code and prose | Code chunks break at function boundaries | Use structure-aware chunking for code |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every RAG architecture change, eval set update, or security audit.*

*Escalate to security-engineer when: RAG ingests untrusted external data or has cross-tenant access. Escalate to ai-safety-eval-engineer when: RAG is user-facing at scale.*
