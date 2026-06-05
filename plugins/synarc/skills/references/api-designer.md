---
title: "API Designer"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - api-designer
  - api-design
  - rest
  - graphql
  - grpc
  - openapi
  - contract-testing
  - api-security
  - api-lifecycle
  - api-governance
---

# Purpose

API-first design methodology covering specification authoring, contract-driven development, versioning strategy, governance, security, and lifecycle management. The API contract is the source of truth — written before implementation begins.

# Scope

API style selection (REST, GraphQL, gRPC), OpenAPI 3.x spec authoring, GraphQL SDL design, Protobuf definitions, contract testing (Pact), versioning and deprecation, API security (auth schemes, rate limiting), developer experience (SDKs, mock servers, docs), governance (linting, style guides, breaking change detection), event-driven APIs (AsyncAPI, webhooks). Does not cover backend implementation or deployment.

# Inputs

Product requirements, consumer personas, existing API contracts, style guides, security requirements, API registry state.

# Output

API specifications (OpenAPI, GraphQL SDL, Proto, AsyncAPI), mock servers, contract test suites, style guide rules, versioning plans, breaking change reports.

---

## 1. API Style Decision Matrix

| Criteria | REST | GraphQL | gRPC |
|----------|------|---------|------|
| Best for | CRUD, web APIs | Complex data graphs | Internal services, streaming |
| Caching | Native HTTP | Custom layer | No native caching |
| Tooling | Mature ecosystem | Growing | Strong polyglot |
| Versioning | URL/header/contract | Schema evolution | Package-based |
| Streaming | EventSource/WebSocket | Subscriptions | Native bidirectional |
| Learning curve | Low | Medium | High |

## 2. Design-First Methodology

Contract before code. Workflow: Requirements → Spec Draft → Review → Final → Mock Server → Parallel backend + frontend implementation.

**Core tenets:** Contract First, Contract Validation (every change validates against contract), Contract Testing (consumers + providers test against contract), Contract Versioning (explicit versioning), Contract Discovery (published to registry).

**Principles:** consistency, evolvability, usability, performance (pagination, caching, compression), security (auth by default, least privilege), observability, simplicity, completeness (success + error + edge cases).

## 3. REST Design Standards

**URL conventions:** plural nouns, kebab-case, correct HTTP methods (GET/POST/PUT/PATCH/DELETE), proper status codes. No verbs in URLs. Filter as query params, not sub-resources. Max 3 levels of nesting.

**Naming:** snake_case or camelCase consistent across all endpoints. All IDs globally unique and URL-safe. All timestamps ISO 8601 UTC.

**Error responses:** RFC 9457 Problem Details format with code, message, details, requestId, timestamp.

**Pagination:** cursor-based preferred, hasMore boolean, consistent across all list endpoints. Filtering, sorting, sparse fieldsets supported.

**Async operations:** return 202 Accepted with Location header pointing to operation resource. States: PENDING → RUNNING → COMPLETED / FAILED / CANCELLED.

**Idempotency:** POST endpoints support idempotency keys. ETags and conditional requests for concurrency. Bulk operations return partial success status (never rollback on partial failure).

## 4. OpenAPI 3.x Specification

**Structure:** openapi version, info (title, version, contact), servers (all environments), paths (operations with operationId, summary, parameters, requestBody, responses), components (schemas, securitySchemes, parameters).

**Best practices:** unique meaningful operationIds, examples for all schemas/parameters, reusable error schemas, tags for grouping, deprecated:true for deprecated endpoints, discriminator for polymorphic schemas, readOnly/writeOnly for create vs read, nullable explicitly marked.

**Security schemes** defined at component level: bearerAuth (JWT), apiKey (header), oauth2 (authorizationCode + clientCredentials flows).

## 5. GraphQL API Design

**Naming:** Types PascalCase, fields camelCase, enums PascalCase, enum values UPPER_CASE, Input types PascalCase+Input, mutation names Verb+noun.

**Schema design principles:** think in graphs (not REST endpoints), product-centric (not DB tables), strongly typed, additive changes only, self-documenting (descriptions everywhere), performance-aware (N+1 prevention), security-first (depth limiting, query costing, rate limiting).

**Structure:** Query (read operations), Mutation (write operations), Subscription (real-time events). Use Relay Connection spec for pagination (first/after/last/before pattern).

## 6. gRPC / Protobuf Design

**.proto conventions:** package declaration, service definitions with RPC methods, message types, request/response types. Use proto3 syntax. Stream keyword for bidirectional streaming. Field numbers stable — never reuse. Package-based versioning.

## 7. API Versioning & Deprecation

**Versioning strategies:** URL path (/v1/users), custom media type (application/vnd.company.v2+json), header-based (Accept-version: 2). Prefer URL path for external APIs, header-based for internal.

**Minimum version support:** N-2 (current + 2 previous). Deprecation notice ≥6 months before sunset. Sunset documentation published ≥3 months before removal. Keep deprecated endpoints functional during deprecation window.

**Deprecation headers:** `Sunset: Sat, 31 Dec 2027 23:59:59 GMT`, `Deprecated: true`.

## 8. Contract Testing

**When:** API consumed by different team/service, shared library with public API, events published to shared broker, schema change crossing service boundary.

**Implementation:** consumer-driven contracts (Pact), schema registry (Avro/Protobuf), OpenAPI spec validation (Spectral), breaking change detection in CI.

**Cadence:** consumer contracts verified on every consumer build, provider verification on every provider build. Breaking contract blocks CI pipeline.

## 9. API Security

**Auth patterns:** Session cookie (HTTP-only + Secure + SameSite Strict) for SSR web apps, JWT (access + refresh) for SPA/mobile, OAuth2 + PKCE for third-party, API key + HMAC for service-to-service, mTLS for zero-trust mesh.

**Default security:** all endpoints require auth (default-deny), rate limiting with headers (X-RateLimit-Remaining), request validation at every boundary, CORS configured explicitly (never wildcard in production).

## 10. API Governance

**Linting:** Spectral ruleset for OpenAPI/AsyncAPI enforcing naming, response consistency, error format, pagination standards.

**Breaking change detection:** automated in CI — diff against previous spec version. Changes requiring major version: removing fields/endpoints, renaming, changing field types, adding required fields, changing enum values.

**Style guide:** maintained as code (spectral config), enforced in CI, reviewed quarterly.
