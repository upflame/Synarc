---
title: "API Designer Skill"
description: "Comprehensive API design skill covering REST, GraphQL, gRPC, contracts, security, lifecycle, documentation, event-driven architectures, and governance"
version: "1.0.0"
author: "Synarc Platform"
domain: "api-designer"
tags: ["api-design", "rest", "graphql", "grpc", "openapi", "contract-testing", "api-security", "api-lifecycle"]
persona: "api-designer"
icon: "api"
---

# API Designer Skill

> **Domain:** API-first design, specification, contracts, developer experience, and lifecycle management
> **Persona:** API Designer — owns the API surface, contract, specification, and developer experience
> **Scope:** Design-first API methodology, contract-driven development, spec authoring, versioning, governance

---

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current file, relevant imports, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache file analysis permanently. Cache decisions for 24h. Cache error patterns permanently. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

**Knowledge Storage:**
- File analysis: stored in brain/file_analysis/[filename].json (permanent)
- Domain conventions: stored in brain/ (update on every discovery)
- Error patterns: stored in brain/error_patterns/ (permanent, with confidence score)

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Error received → lookup pattern, propose fix immediately
- File named → load file, offer action suggestions
- Exception thrown → analyze stack, propose fix with confidence score

**Prefetch Protocol:** After each action, predict next file from import graph. Load file_analysis/ for predicted file. Warm cache with likely next actions.

**Reduced Round-Trips:** Every task MUST complete in ≤ 2 round-trips. If you don't understand: ask one clarifying question with pre-computed options. Never ask more than one.

## P1: Persona — The API Designer

### Role Definition

The API Designer owns the **external surface** of APIs. They are responsible for:

- Defining API contracts before implementation begins
- Authoring and maintaining specification files (OpenAPI, GraphQL SDL, Proto, AsyncAPI)
- Ensuring consistency, usability, and evolvability of the API
- Enforcing governance rules and style guides
- Driving developer experience (DX) improvements
- Managing versioning strategy and deprecation timelines
- Bridging product requirements into technical API contracts
- Conducting API design reviews and breaking change detection

### Key Responsibilities

| Area | Responsibility |
|------|---------------|
| Specification | Author OpenAPI 3.x specs, GraphQL SDL, Protobuf definitions, AsyncAPI specs |
| Governance | Enforce naming conventions, response consistency, error formats, pagination standards |
| Review | Review all API changes for design quality and backward compatibility |
| DX | Design SDKs, playgrounds, interactive docs, sandbox environments |
| Lifecycle | Plan versioning, deprecation, sunset policies |
| Contracts | Maintain consumer-driven contracts, Pact files, contract test suites |
| Security | Define auth schemes, scopes, rate limit policies |
| Standards | Maintain API style guide, lint rules, spectral configs |

### Collaboration Map

```
Product Manager ──> API Designer ──> Backend Engineer
                      │                    │
                      ├──> Frontend Engineer
                      ├──> QA / Test Engineer
                      ├──> Developer Relations
                      └──> Security Architect
```

### Skills Matrix

| Skill | Beginner | Intermediate | Advanced | Expert |
|-------|----------|--------------|----------|--------|
| OpenAPI 3.x | Can read specs | Can write complete specs | Can maintain complex spec suites | Authors spec tooling |
| GraphQL SDL | Basic schema types | Can design complete schemas | Optimizes resolvers, batching | Federation, gateways |
| Protobuf | Can read .proto | Can write service defs | Streaming, advanced patterns | Ecosphere plugins |
| API Security | Knows auth basics | OAuth2 flows, JWT | Custom auth, token exchange | Zero-trust API security |
| Contract Testing | Knows concept | Can write Pact tests | Provider verification | Contract-driven CI/CD |
| Governance | Follows style guide | Enforces with linting | Authors rules | Defines org standards |
| API Docs | Reads docs | Writes ref docs | Technical writing | Doc tooling automation |

---

## P2: Philosophy — API-First Methodology

### Design-First vs Code-First

**Design-First (Recommended)**

The specification is written **before** any implementation code begins. This enables:

- Stakeholder review before investment
- Contract simulation and mocking
- Parallel frontend/backend development
- Clear API surface for testing
- Early detection of design flaws

Workflow:
```
Requirements → Spec First Draft → Review → Spec Final → Mock Server
     │                                                     │
     └────────────────── Backend Impl ←────────────────────┘
                                    │
                            Frontend Impl ←───────
```

**Code-First (Not Recommended)**

The implementation drives the specification via annotations or code generation.

- Suitable for: Internal microservices, prototypes, legacy migration
- Risks: Spec drift, implementation leaks into contract, poor DX
- Mitigation: Generate specs from code, enforce CI validation

### Contract-Driven Development

The API contract is the **source of truth**. All stakeholders align around it.

**Core Tenets:**

1. **Contract First** — Write the contract before any code
2. **Contract Validation** — Every change must validate against the contract
3. **Contract Testing** — Consumers and providers test against the contract
4. **Contract Versioning** — Contracts evolve with explicit versioning
5. **Contract Discovery** — Contracts are published to a registry

### Principles of Good API Design

1. **Consistency** — Uniform patterns across all endpoints, error formats, naming
2. **Evolvability** — Design for change; additive changes preferred
3. **Usability** — Intuitive, self-documenting, predictable
4. **Performance** — Pagination, caching, compression, minimal payloads
5. **Security** — Auth by default, least privilege, defense in depth
6. **Observability** — Traceable, measurable, debuggable
7. **Simplicity** — Minimal surface area, clear semantics, no leaky abstractions
8. **Completeness** — Handle all states: success, error, edge cases, empty results

### API Design Process

```
┌─────────────────────────────────────────────────┐
│ 1. Requirements Gathering                       │
│    - Identify resources, actions, data fields   │
│    - Define consumer personas                   │
│    - Map user stories to API interactions        │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 2. Spec Drafting                                │
│    - Choose API style (REST/GraphQL/gRPC)       │
│    - Draft specification                        │
│    - Define data models and schemas              │
│    - Plan error responses                       │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 3. Design Review                                │
│    - Peer review of spec                        │
│    - Breaking change detection                  │
│    - Governance linting                         │
│    - Consumer feedback                          │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 4. Contract Publication                         │
│    - Publish to API registry                    │
│    - Generate mock server                       │
│    - Generate client SDKs                       │
│    - Generate documentation                     │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 5. Contract Testing                             │
│    - Consumer contract tests                    │
│    - Provider verification                      │
│    - Spec validation                            │
│    - Security scanning                          │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 6. Implementation & Deployment                  │
│    - Backend implementation                     │
│    - Contract compliance CI                     │
│    - Integration tests                          │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│ 7. Monitoring & Iteration                       │
│    - API analytics                              │
│    - Consumer feedback                          │
│    - Deprecation planning                       │
│    - Version evolution                          │
└─────────────────────────────────────────────────┘
```

### API Styles Decision Matrix

| Criteria | REST | GraphQL | gRPC |
|----------|------|---------|------|
| Best for | CRUD, web APIs | Complex data graphs | Internal services, streaming |
| Caching | Native HTTP caching | Custom cache layer | No native caching |
| Payload size | Configurable | Client-specified | Binary (protobuf) |
| Tooling | Mature ecosystem | Growing ecosystem | Strong for polyglot |
| Learning curve | Low | Medium | High |
| Versioning | URL/header/contract | Schema evolution | Package-based |
| Streaming | EventSource/WebSocket | Subscriptions | Native bidirectional |
| Binary support | Base64 | Base64 | Native binary |
| Query flexibility | Fixed responses | Client-defined | Fixed RPC |
| Type safety | OpenAPI/Swagger | Built-in schema | Protobuf schema |
| Performance | HTTP/1.1 or HTTP/2 | HTTP/2 | HTTP/2 (gRPC) |

---




### Bulk Operation Limits

| Aspect | Limit |
|--------|-------|
| Max batch size | 100 items |
| Timeout per batch | 30 seconds |
| Atomicity | Not guaranteed unless specified |
| Partial failure | Always returned (never rollback on partial success) |
| Idempotency | Bulk operations are NOT idempotent |

### HATEOAS (Hypermedia as the Engine of Application State)

```yaml
GET /users/abc123
Response:
{
  "id": "abc123",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "_links": {
    "self": { "href": "/users/abc123", "method": "GET" },
    "orders": { "href": "/users/abc123/orders", "method": "GET" },
    "update": { "href": "/users/abc123", "method": "PATCH" },
    "delete": { "href": "/users/abc123", "method": "DELETE" },
    "profile": { "href": "/users/abc123/profile", "method": "GET" }
  }
}

# Collection with HATEOAS
GET /users
Response:
{
  "data": [
    {
      "id": "abc123",
      "name": "Alice",
      "_links": {
        "self": { "href": "/users/abc123", "method": "GET" }
      }
    }
  ],
  "_links": {
    "self": { "href": "/users", "method": "GET" },
    "create": { "href": "/users", "method": "POST" },
    "next": { "href": "/users?cursor=xyz", "method": "GET" }
  }
}
```

### Request IDs and Tracing

```yaml
# Client sends Request-Id
POST /users
Request-Id: 7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e
Content-Type: application/json

{ "name": "Alice" }

# Server echoes Request-Id in response
Response: 201 Created
Request-Id: 7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e
Location: /users/abc123
```

### Content Negotiation

```yaml
# Client requests JSON
GET /users/abc123
Accept: application/json

# Client requests XML (if supported)
GET /users/abc123
Accept: application/xml

# Client requests specific version via media type
GET /users/abc123
Accept: application/vnd.api+json;version=2

# Server responds with content type
Response:
Content-Type: application/json; charset=utf-8
```

**Custom Media Types:**

```yaml
# Versioned media type
Accept: application/vnd.company.api.v2+json

# Profile-based
Accept: application/json;profile="https://api.company.com/profiles/user"

# With quality weighting
Accept: application/json;q=0.9, application/vnd.api+json;q=0.5
```

### Response Envelope

```yaml
# Standard wrapper
{
  "data": { ... },
  "meta": {
    "requestId": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
    "timestamp": "2026-05-27T10:00:00Z",
    "version": "2.0"
  }
}

# Collection wrapper
{
  "data": [ ... ],
  "meta": {
    "requestId": "...",
    "timestamp": "...",
    "pagination": {
      "cursor": "...",
      "hasMore": true
    }
  }
}

# Error wrapper
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body contains invalid fields.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      }
    ],
    "requestId": "...",
    "timestamp": "..."
  }
}
```

### Async Operations

For long-running operations, use the async pattern:

```yaml
# Initiate async operation
POST /reports/generate
Content-Type: application/json

{
  "type": "sales-summary",
  "dateRange": { "start": "2026-01-01", "end": "2026-05-27" }
}

Response: 202 Accepted
Location: /operations/op-abc123
{
  "id": "op-abc123",
  "status": "pending",
  "estimatedCompletion": "2026-05-27T10:05:00Z"
}

# Poll for completion
GET /operations/op-abc123

Response: 200 OK
{
  "id": "op-abc123",
  "status": "completed",
  "result": {
    "location": "/reports/sales-summary-2026-05-27"
  }
}

# Or use webhook callback
POST /reports/generate
Content-Type: application/json
Prefer: respond-async

{
  "type": "sales-summary",
  "webhookUrl": "https://client.example.com/webhooks/report-ready"
}
```

### Async Operation States

```
                 +----------+
                 |  PENDING |
                 +----+-----+
                      |
                 +----v-----+
          +------|  RUNNING |------+
          |      +----+-----+      |
     +----v----+      |      +-----v------+
     |  FAILED |      |      | CANCELLED  |
     +---------+      |      +------------+
                 +----v-----+
                 |COMPLETED |
                 +----------+
```

### Conventions for Common Resources

**User Resource:**

```yaml
GET /users/{userId}
Response:
{
  "id": "usr_abc123",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "emailVerified": true,
  "phone": "+1234567890",
  "phoneVerified": false,
  "avatarUrl": "https://cdn.example.com/avatars/abc123.png",
  "status": "active",
  "role": "admin",
  "preferences": {
    "language": "en",
    "timezone": "America/New_York",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
  "createdAt": "2025-01-15T08:30:00Z",
  "updatedAt": "2026-05-27T10:00:00Z",
  "_links": {
    "self": { "href": "/users/usr_abc123" },
    "orders": { "href": "/users/usr_abc123/orders" },
    "profile": { "href": "/users/usr_abc123/profile" }
  }
}
```

**Order Resource:**

```yaml
GET /orders/{orderId}
Response:
{
  "id": "ord_xyz789",
  "orderNumber": "ORD-2026-001234",
  "status": "shipped",
  "customer": {
    "id": "cust_456",
    "name": "Acme Corp"
  },
  "items": [
    {
      "id": "item_001",
      "productId": "prod_widget",
      "productName": "Super Widget",
      "quantity": 2,
      "unitPrice": 1999,
      "totalPrice": 3998
    }
  ],
  "subtotal": 3998,
  "tax": 399.80,
  "shipping": 500,
  "total": 4897.80,
  "currency": "USD",
  "billingAddress": { "street": "123 Main St", "city": "Springfield", "state": "IL", "zipCode": "62701", "country": "US" },
  "shippingAddress": { "street": "456 Oak Ave", "city": "Chicago", "state": "IL", "zipCode": "60601", "country": "US" },
  "shippingMethod": "express",
  "trackingNumber": "1Z999AA10123456784",
  "notes": "Leave at front desk",
  "createdAt": "2026-05-25T14:30:00Z",
  "updatedAt": "2026-05-26T09:15:00Z",
  "_links": {
    "self": { "href": "/orders/ord_xyz789" },
    "invoice": { "href": "/invoices/inv_123" },
    "shipment": { "href": "/shipments/shp_456" }
  }
}
```

### Webhook-Friendly Response Design

Design responses so they work well as webhook payloads:

```yaml
{
  "event": "order.shipped",
  "id": "evt_abc123",
  "createdAt": "2026-05-27T10:00:00Z",
  "data": {
    "object": {
      "id": "ord_xyz789",
      "status": "shipped",
      "total": 4897.80
    },
    "previousAttributes": {
      "status": "processing"
    }
  }
}
```

### REST Design Checklist

- [ ] Resources are named with plural nouns
- [ ] URLs use kebab-case
- [ ] HTTP methods are used correctly (GET/POST/PUT/PATCH/DELETE)
- [ ] Response status codes are appropriate
- [ ] Error responses follow RFC 9457 (Problem Details)
- [ ] Pagination is implemented for all list endpoints
- [ ] Filtering and sorting are supported for list endpoints
- [ ] Sparse fieldsets are supported
- [ ] Resource expansion (include/embed) is implemented
- [ ] CORS headers are configured
- [ ] Rate limiting headers are present
- [ ] Request IDs are supported
- [ ] Idempotency keys are supported for POST
- [ ] ETags and conditional requests for concurrency
- [ ] HATEOAS links are included for discoverability
- [ ] Content negotiation is supported
- [ ] Async operations return 202 with Location header
- [ ] Bulk operations return partial success status
- [ ] All timestamps use ISO 8601 format (UTC)
- [ ] All IDs are globally unique and URL-safe
- [ ] Response envelope is consistent across all endpoints
- [ ] Webhook events follow consistent naming convention
- [ ] Deprecation headers are present for deprecated endpoints
- [ ] API version is indicated in response
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options) are present

### Common REST Anti-Patterns

| Anti-Pattern | Problem | Solution |
|---|---|---|
| /getUser | Verb in URL | GET /users/{userId} |
| /createUser | Verb in URL | POST /users |
| /Users | PascalCase | /users |
| /user | Singular | /users |
| /users/activeUsers | Filter as sub-resource | /users?status=active |
| Nested resources >3 levels | Deep hierarchy | Flatten or use query params |
| 200 for all responses | Wrong status codes | Use proper status codes |
| Generic error bodies | Poor debuggability | Use Problem Details format |
| No pagination | Scalability issues | Default pagination on all list endpoints |
| Inconsistent field naming | Developer confusion | Consistent snake_case or camelCase |
| Missing auth errors | Security risk | Return 401/403 properly |
| Leaking internal IDs | Security risk | Use separate public IDs |

### OpenAPI 3.x Specification

**Structure of an OpenAPI file:**

```yaml
openapi: "3.1.0"
info:
  title: "Users API"
  description: "API for managing users in the system"
  version: "2.0.0"
  contact:
    name: "API Support"
    email: "api-support@example.com"
    url: "https://developer.example.com"
  license:
    name: "Apache 2.0"
    url: "https://www.apache.org/licenses/LICENSE-2.0.html"
servers:
  - url: "https://api.example.com/v2"
    description: "Production server"
  - url: "https://staging-api.example.com/v2"
    description: "Staging server"
paths:
  /users:
    get:
      operationId: "listUsers"
      summary: "List all users"
      description: "Retrieve a paginated list of users with filtering and sorting"
      parameters:
        - name: "status"
          in: "query"
          schema:
            type: "string"
            enum: ["active", "inactive", "pending"]
      responses:
        "200":
          description: "Successful response"
          content:
            application/json:
              schema:
                type: "array"
                items:
                  "$ref": "#/components/schemas/User"
    post:
      operationId: "createUser"
      summary: "Create a new user"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              "$ref": "#/components/schemas/CreateUserRequest"
      responses:
        "201":
          description: "User created successfully"
          content:
            application/json:
              schema:
                "$ref": "#/components/schemas/User"
components:
  schemas:
    User:
      type: "object"
      required: ["id", "name", "email"]
      properties:
        id:
          type: "string"
          example: "usr_abc123"
        name:
          type: "string"
          example: "Alice Smith"
        email:
          type: "string"
          format: "email"
          example: "alice@example.com"
        status:
          type: "string"
          enum: ["active", "inactive", "pending"]
        createdAt:
          type: "string"
          format: "date-time"
        updatedAt:
          type: "string"
          format: "date-time"
    CreateUserRequest:
      type: "object"
      required: ["name", "email"]
      properties:
        name:
          type: "string"
        email:
          type: "string"
          format: "email"
    ErrorResponse:
      type: "object"
      properties:
        type:
          type: "string"
        title:
          type: "string"
        status:
          type: "integer"
        detail:
          type: "string"
        instance:
          type: "string"
    Pagination:
      type: "object"
      properties:
        cursor:
          type: "string"
        hasMore:
          type: "boolean"
        limit:
          type: "integer"
```

**Security Schemes in OpenAPI:**

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: "https://auth.example.com/authorize"
          tokenUrl: "https://auth.example.com/token"
          scopes:
            users:read: "Read user data"
            users:write: "Write user data"
        clientCredentials:
          tokenUrl: "https://auth.example.com/token"
          scopes:
            admin: "Admin access"
security:
  - bearerAuth: []
  - apiKey: []
```

**OpenAPI Specification Best Practices:**

1. Operation IDs -- Every operation should have a unique, meaningful operationId for SDK generation
2. Summary and Description -- Brief summary + detailed description for every endpoint
3. Examples -- Provide examples for all schemas and parameters
4. Error Schemas -- Define reusable error response schemas
5. Pagination Schema -- Define reusable pagination response component
6. Tags -- Group endpoints by functional area
7. External Docs -- Link to comprehensive documentation
8. Deprecation -- Mark deprecated endpoints with deprecated: true
9. Request Bodies -- Always define request body schemas explicitly
10. Response Codes -- Document all possible response codes for each endpoint
11. Security Schemes -- Define all auth mechanisms at component level
12. Servers -- List all environments (production, staging, development)
13. Discriminator -- Use discriminator for polymorphic schemas
14. ReadOnly/WriteOnly -- Mark fields appropriately for create vs read
15. Nullable -- Explicitly mark nullable fields

### OpenAPI Tooling Ecosystem

| Category | Tool | Description |
|----------|------|-------------|
| Editor | Swagger Editor | Browser-based spec editor |
| Editor | Stoplight Studio | Visual API design tool |
| Editor | Insomnia Designer | API design with testing |
| Validation | Spectral | Linter for OpenAPI/AsyncAPI |
| Validation | OpenAPI Validator | Official validation tool |
| Code Gen | OpenAPI Generator | Generate SDKs in 40+ languages |
| Code Gen | oazapfts | TypeScript client generation |
| Code Gen | Kiota | Microsoft API client generator |
| Mock | Prism | HTTP mock server from specs |
| Mock | Mockoon | Desktop mock server |
| Mock | Stoplight Prism | OpenAPI-powered mocks |
| Docs | ReDoc | Beautiful 3-column docs |
| Docs | Swagger UI | Interactive API docs |
| Docs | Stoplight Elements | Documentation components |
| Testing | Dredd | Spec vs implementation testing |
| Testing | Postman | API client with spec import |
| Gateway | Kong | API gateway with spec integration |
| Gateway | Tyk | OpenAPI-compatible gateway |
| CI | Speccy | Spec linting in CI |
| CI | OpenAPI Diff | Breaking change detection |
| CI | Spectral CI | Rule enforcement pipeline |
| CI | Vacuum | OpenAPI/AsyncAPI linting |

---



## P4: GraphQL API Design

### Schema Design Principles

1. **Think in graphs** -- Model your domain as a graph, not REST endpoints
2. **Product-centric** -- Design for consumer use cases, not database tables
3. **Strongly typed** -- Every field has a defined type; no ambiguity
4. **Backward compatible** -- Additive changes only; never remove or rename
5. **Self-documenting** -- Schema is documentation; use descriptions everywhere
6. **Performance-aware** -- Design resolvers with N+1 in mind
7. **Security-first** -- Implement depth limiting, query costing, rate limiting

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Types | PascalCase | User, OrderItem |
| Fields | camelCase | firstName, createdAt |
| Enums | PascalCase | OrderStatus, UserRole |
| Enum values | UPPER_CASE | ACTIVE, PENDING |
| Input types | PascalCase + Input | CreateUserInput |
| Payload types | PascalCase + Payload | CreateUserPayload |
| Arguments | camelCase | userId, first |
| Interfaces | Descriptive | Node, Entity |
| Unions | PascalCase | SearchResult |
| Mutations | Verb + noun | createUser, updateOrder |

### Basic Schema Structure

```graphql
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

type Query {
  user(id: ID!): User
  users(
    first: Int
    after: String
    last: Int
    before: String
    filter: UserFilter
    sort: UserSort
  ): UserConnection!

  order(id: ID!): Order
  orders(first: Int, after: String): OrderConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
  activateUser(id: ID!): ActivateUserPayload!
}

type Subscription {
  userCreated: User!
  userUpdated: User!
  userDeleted: ID!
}
```

### Type Definitions

```graphql
"Represents a user in the system"
type User implements Node {
  "Unique identifier"
  id: ID!
  "Full name"
  name: String!
  "Email address (verified at signup)"
  email: String!
  "Whether the email has been verified"
  emailVerified: Boolean!
  "Phone number (optional)"
  phone: String
  "URL to avatar image"
  avatarUrl: URL
  "Current account status"
  status: UserStatus!
  "User role for authorization"
  role: UserRole!
  "User preferences"
  preferences: UserPreferences!
  "Orders placed by this user"
  orders(first: Int, after: String): OrderConnection!
  "ISO timestamp of creation"
  createdAt: DateTime!
  "ISO timestamp of last update"
  updatedAt: DateTime!
}

"User account status"
enum UserStatus {
  ACTIVE
  INACTIVE
  PENDING
  SUSPENDED
  DELETED
}

"User role for access control"
enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

"User preferences and settings"
type UserPreferences {
  language: String!
  timezone: String!
  notifications: NotificationPreferences!
}

type NotificationPreferences {
  email: Boolean!
  sms: Boolean!
  push: Boolean!
}
```

### Input Types

```graphql
"Input for creating a new user"
input CreateUserInput {
  "Full name (required)"
  name: String!
  "Email address (required)"
  email: String!
  "Optional phone number"
  phone: String
  "Initial user role"
  role: UserRole = USER
  "User preferences"
  preferences: UserPreferencesInput
}

input UserPreferencesInput {
  language: String = "en"
  timezone: String = "UTC"
  notifications: NotificationPreferencesInput
}

input NotificationPreferencesInput {
  email: Boolean = true
  sms: Boolean = false
  push: Boolean = true
}

input UpdateUserInput {
  "User ID to update"
  id: ID!
  "Updated name (omit if not changing)"
  name: String
  "Updated email (omit if not changing)"
  email: String
  "Updated phone (omit if not changing)"
  phone: String
  "Updated preferences"
  preferences: UserPreferencesInput
}
```

### Payload Types

```graphql
"Payload returned from createUser mutation"
type CreateUserPayload {
  "The created user"
  user: User!
  "Any errors encountered"
  errors: [UserError!]
}

"Payload returned from updateUser mutation"
type UpdateUserPayload {
  "The updated user"
  user: User
  "Any errors encountered"
  errors: [UserError!]
}

"Payload returned from deleteUser mutation"
type DeleteUserPayload {
  "ID of deleted user"
  deletedId: ID!
  "Any errors encountered"
  errors: [UserError!]
}

"Payload returned from activateUser mutation"
type ActivateUserPayload {
  "The activated user"
  user: User
  "Any errors encountered"
  errors: [UserError!]
}
```

### Filtering and Sorting

```graphql
"Filter options for users"
input UserFilter {
  status: UserStatus
  role: UserRole
  search: String
  createdAtRange: DateRangeInput
  emailVerified: Boolean
  AND: [UserFilter!]
  OR: [UserFilter!]
}

input DateRangeInput {
  start: DateTime
  end: DateTime
}

"Sort options for users"
input UserSort {
  field: UserSortField!
  direction: SortDirection!
}

enum UserSortField {
  NAME
  EMAIL
  CREATED_AT
  UPDATED_AT
}

enum SortDirection {
  ASC
  DESC
}
```

### Pagination (Relay Connection Spec)

```graphql
"Relay-compliant connection for users"
type UserConnection {
  edges: [UserEdge!]!
  nodes: [User!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Interfaces and Unions

```graphql
"Node interface for Relay compatibility"
interface Node {
  id: ID!
}

"Search result can be either a User or an Order"
union SearchResult = User | Order

type Query {
  search(query: String!, first: Int!): [SearchResult!]!
  node(id: ID!): Node
}
```

### Error Handling

```graphql
"Base error interface"
interface Error {
  message: String!
  code: String!
}

"A validation error on a specific field"
type ValidationError implements Error {
  message: String!
  code: String!
  field: String!
  constraint: String!
}

"A not found error"
type NotFoundError implements Error {
  message: String!
  code: String!
  resourceType: String!
  resourceId: String!
}

type AuthenticationError implements Error {
  message: String!
  code: String!
}

type AuthorizationError implements Error {
  message: String!
  code: String!
  requiredRole: UserRole
}

"Union of all possible user errors"
union UserError = ValidationError | NotFoundError | AuthenticationError | AuthorizationError
```

### Subscription Definitions

```graphql
type Subscription {
  "Subscribe to user creation events"
  userCreated: User!
  "Subscribe to user update events"
  userUpdated(filter: UserSubscriptionFilter): UserUpdatedPayload!
  "Subscribe to user deletion events"
  userDeleted: ID!
  "Subscribe to all order events"
  orderEvents: OrderEvent!
}

input UserSubscriptionFilter {
  status: UserStatus
}

type UserUpdatedPayload {
  user: User!
  previousValues: UserPreviousValues!
  updatedFields: [String!]!
}

type UserPreviousValues {
  name: String
  email: String
  status: UserStatus
}

"Union of all possible order events"
union OrderEvent = OrderCreated | OrderShipped | OrderDelivered | OrderCancelled

type OrderCreated {
  order: Order!
}

type OrderShipped {
  order: Order!
  trackingNumber: String!
}

type OrderDelivered {
  order: Order!
  deliveredAt: DateTime!
}

type OrderCancelled {
  order: Order!
  reason: String
}
```

### Directives

```graphql
# Built-in directives
@deprecated(reason: "Use newField instead")
@specifiedBy(url: "https://example.com/spec")

# Custom directives for auth
directive @auth(requires: UserRole!) on OBJECT | FIELD_DEFINITION
directive @rateLimit(max: Int!, window: String!) on FIELD_DEFINITION
directive @cacheControl(maxAge: Int!, scope: CacheScope) on FIELD_DEFINITION

enum CacheScope {
  PUBLIC
  PRIVATE
}

# Usage
type Query {
  users: [User!]! @auth(requires: ADMIN) @rateLimit(max: 100, window: "1m")
  user(id: ID!): User @cacheControl(maxAge: 60, scope: PUBLIC)
}
```

### Query Cost Analysis

```graphql
# Cost analysis example
# Each field has a cost weight
# Queries are rejected if total cost exceeds threshold

type Query {
  users: [User!]! @cost(weight: 10)
  user(id: ID!): User @cost(weight: 2)
}

type User {
  id: ID! @cost(weight: 0)
  name: String! @cost(weight: 0)
  email: String! @cost(weight: 0)
  orders: [Order!]! @cost(weight: 5)
}

# Query: { users { id name orders { id total } } }
# Cost: 10 (users) + 0*N (id,name) + 5*20 (orders, assuming 20 items) + 0 (id,total)
# Total: 10 + 0 + 100 + 0 = 110
# Max query cost: 500 (default)

# Query depth example
# Max depth: 5 levels
query DeepQuery {
  user(id: "1") {       # Level 1
    orders {            # Level 2
      items {           # Level 3
        product {       # Level 4
          category {    # Level 5 - allowed
            name        # Level 6 - rejected
          }
        }
      }
    }
  }
}
```

### Resolver Patterns

```javascript
// Basic resolver
const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.usersAPI.getUser(id);
    },
    users: async (_, args, { dataSources }) => {
      return dataSources.usersAPI.listUsers(args);
    }
  },
  Mutation: {
    createUser: async (_, { input }, { dataSources, auth }) => {
      if (!auth.isAuthenticated) {
        return {
          user: null,
          errors: [{ message: 'Not authenticated', code: 'AUTH_REQUIRED' }]
        };
      }
      const errors = validateCreateUserInput(input);
      if (errors.length > 0) {
        return { user: null, errors };
      }
      const user = await dataSources.usersAPI.createUser(input);
      return { user, errors: [] };
    }
  },
  User: {
    avatarUrl: (parent) => {
      if (!parent.avatarUrl) return null;
      return `https://cdn.example.com/avatars/${parent.id}.png`;
    },
    orders: (parent, args, { dataSources }) => {
      return dataSources.ordersAPI.getOrdersByUserId.load(parent.id, args);
    }
  }
};
```

### Batching (DataLoader)

```javascript
// DataLoader setup
const DataLoader = require('dataloader');

// Batch function
async function batchUsers(userIds) {
  const users = await db.users.findAll({ where: { id: { $in: userIds } } });
  // Return in same order as userIds
  const userMap = {};
  users.forEach(user => { userMap[user.id] = user; });
  return userIds.map(id => userMap[id] || null);
}

// Create loader instance per request
function createLoaders() {
  return {
    users: new DataLoader(batchUsers),
    orders: new DataLoader(batchOrders),
    products: new DataLoader(batchProducts),
  };
}

// Context factory
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    loaders: createLoaders(),
    auth: authenticate(req),
  }),
});

// Resolver using DataLoader
const resolvers = {
  Order: {
    user: (order, _, { loaders }) => {
      return loaders.users.load(order.userId);
    }
  },
  User: {
    orders: (user, _, { loaders }) => {
      return loaders.orders.load(user.id);
    }
  }
};
```

### N+1 Problem Solutions

```javascript
// Problem: N+1 queries
// Without DataLoader: For 20 orders, this fires 21 queries
const badResolvers = {
  Order: {
    user: async (order) => {
      return await db.users.findByPk(order.userId); // One query per order!
    }
  }
};

// Solution 1: DataLoader (batches into 2 queries)
const goodResolvers = {
  Order: {
    user: (order, _, { loaders }) => {
      return loaders.users.load(order.userId); // Batched!
    }
  }
};

// Solution 2: Batch resolve (parent resolver includes related data)
const batchResolvers = {
  Query: {
    orders: async (_, args) => {
      const orders = await db.orders.findAll({ where: { ... }, limit: 20 });
      const userIds = [...new Set(orders.map(o => o.userId))];
      const users = await db.users.findAll({ where: { id: userIds } });
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));
      return orders.map(order => ({
        ...order.toJSON(),
        user: userMap[order.userId]
      }));
    }
  }
};

// Solution 3: Look-ahead / Info pattern
const lookaheadResolvers = {
  Query: {
    orders: async (_, args, context, info) => {
      const fields = getRequestedFields(info);
      const includeUser = fields.includes('user');
      const orders = await db.orders.findAll({
        where: { ... },
        include: includeUser ? [{ model: db.users }] : []
      });
      return orders;
    }
  }
};
```

### Caching Strategies

**Response Caching:**

```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache({ maxSize: 100 * 1024 * 1024 }), // 100MB
});

// Automatic persisted queries (APQ)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    ttl: 300, // 5 minutes
  },
});
```

**DataLoader Caching (per request):**

```javascript
function createLoaders() {
  return {
    users: new DataLoader(batchUsers, {
      cache: true, // Within request
      maxBatchSize: 100,
    }),
  };
}

// Cross-request caching with Redis
const redisLoader = new DataLoader(keys => batchFn(keys), {
  cacheMap: new Map(),
});
```

### GraphQL Federation

```graphql
# Subgraph A - Users Service
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}

extend type Query {
  user(id: ID!): User
  users: [User!]!
}

# Subgraph B - Orders Service
type Order @key(fields: "id") {
  id: ID!
  total: Float!
  userId: ID!
  user: User @requires(fields: "userId")
}

extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}

extend type Query {
  order(id: ID!): Order
  orders: [Order!]!
}

# Supergraph gateway composes all subgraphs
```

### GraphQL Security

```javascript
// Depth limiting
const depthLimit = require('graphql-depth-limit');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)],
});

// Query complexity / costing
const costLimit = require('graphql-cost-analysis').default;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    costLimit({
      maxCost: 500,
      objectCost: 1,
      scalarCost: 1,
    }),
  ],
});

// Rate limiting
const rateLimit = require('graphql-rate-limit');
const server = new ApolloServer({
  typeDefs,
  resolvers: rateLimit(resolvers, {
    window: 60 * 1000, // 1 minute
    max: 100,
  }),
});

// Auth middleware with GraphQL Shield
const { shield } = require('graphql-shield');
const permissions = shield({
  Query: {
    users: allow,
    user: allow,
    orders: isAuthenticated,
    adminDashboard: hasRole('ADMIN'),
  },
  Mutation: {
    createUser: allow,
    updateUser: isOwnerOrAdmin,
    deleteUser: hasRole('ADMIN'),
  },
});
```

### GraphQL Testing

```javascript
// Integration testing with Apollo Server
const { createTestClient } = require('apollo-server-testing');
const { query, mutate } = createTestClient(server);

test('creates a user', async () => {
  const CREATE_USER = `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        user { id name email }
        errors { message code }
      }
    }
  `;

  const res = await mutate({
    mutation: CREATE_USER,
    variables: {
      input: { name: 'Alice', email: 'alice@example.com' }
    }
  });

  expect(res.data.createUser.user.name).toBe('Alice');
  expect(res.data.createUser.errors).toHaveLength(0);
});

test('validates email format', async () => {
  const res = await mutate({
    mutation: CREATE_USER,
    variables: {
      input: { name: 'Bob', email: 'not-an-email' }
    }
  });

  expect(res.data.createUser.errors[0].code).toBe('VALIDATION_ERROR');
  expect(res.data.createUser.user).toBeNull();
});

test('user query matches snapshot', async () => {
  const GET_USER = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id name email status
      }
    }
  `;
  const res = await query({
    query: GET_USER,
    variables: { id: 'usr_abc123' }
  });
  expect(res.data).toMatchSnapshot();
});
```

### GraphQL Design Checklist

- [ ] Schema uses descriptive type and field names
- [ ] All fields have descriptions
- [ ] Input types use Input suffix
- [ ] Payload types use Payload suffix or errors pattern
- [ ] Pagination uses Relay Connection spec
- [ ] Error handling uses unions/interfaces
- [ ] Mutations return both data and errors
- [ ] Authentication and authorization are enforced
- [ ] Query depth limiting is configured
- [ ] Query cost analysis is implemented
- [ ] Rate limiting is applied
- [ ] DataLoader is used for N+1 prevention
- [ ] Subscriptions follow naming convention
- [ ] Enums have descriptive values
- [ ] Nullable vs non-nullable is intentional
- [ ] Deprecated fields are marked with @deprecated
- [ ] Federation keys are defined for distributed schemas
- [ ] Cache control directives are set
- [ ] All mutations accept single input argument
- [ ] All queries return connection types for lists
- [ ] IDs are globally unique
- [ ] DateTime fields use ISO 8601 format
- [ ] Mutations use verb+noun naming convention
- [ ] Subscriptions use past-tense event naming

---

## P5: gRPC API Design

### Protocol Buffers (Protobuf)

Protocol Buffers is the IDL for gRPC. It defines message structures and service interfaces.

**File Structure:**

```
proto/
  +-- acme/
      +-- common/
      |   +-- v1/
      |       +-- common.proto     # Shared types (Money, Date, etc.)
      |       +-- errors.proto     # Error models
      +-- user/
      |   +-- v1/
      |       +-- user.proto        # User messages
      |       +-- user_service.proto # User service
      +-- order/
          +-- v1/
              +-- order.proto
              +-- order_service.proto
```

**Package Naming:**

```protobuf
// Package name follows reverse domain + domain + version
syntax = "proto3";

package acme.user.v1;

// Java package
option java_package = "com.acme.user.v1";
option java_multiple_files = true;

// Go package
option go_package = "github.com/acme/api/gen/user/v1;userv1";
```

### Message Definitions

```protobuf
// User message
message User {
  // Unique identifier (ULID format)
  string id = 1;

  // Display name
  string name = 2;

  // Email address
  string email = 3;

  // Whether email is verified
  bool email_verified = 4;

  // Phone number (E.164 format)
  string phone = 5;

  // Current status
  UserStatus status = 6;

  // User role
  UserRole role = 7;

  // User preferences
  UserPreferences preferences = 8;

  // Timestamps
  google.protobuf.Timestamp created_at = 9;
  google.protobuf.Timestamp updated_at = 10;
}

// User status enum
enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0;
  USER_STATUS_ACTIVE = 1;
  USER_STATUS_INACTIVE = 2;
  USER_STATUS_PENDING = 3;
  USER_STATUS_SUSPENDED = 4;
}

// User role enum
enum UserRole {
  USER_ROLE_UNSPECIFIED = 0;
  USER_ROLE_USER = 1;
  USER_ROLE_MODERATOR = 2;
  USER_ROLE_ADMIN = 3;
}

// User preferences
message UserPreferences {
  string language = 1;  // BCP 47 language tag
  string timezone = 2;  // IANA timezone
  NotificationPreferences notifications = 3;
}

message NotificationPreferences {
  bool email = 1;
  bool sms = 2;
  bool push = 3;
}
```

### Field Numbering Rules

| Field Number Range | Category | Rules |
|--------------------|----------|-------|
| 1-15 | Hot fields | Use for frequently occuring fields, encoded in 1 byte |
| 16-2047 | Normal fields | Use for most fields, encoded in 2 bytes |
| 2048-16383 | Rare fields | Use for rarely used fields |
| 16384-536870911 | Reserved | For complex schemas |
| 19000-19999 | Reserved | Protobuf system reserved |

**Best Practices:**
- Reserve field numbers when fields are removed (never reuse)
- Use 1-15 for required/frequent fields
- Leave room between numbers for future fields
- Group related fields with contiguous numbers
- Use reserved keyword for removed fields

```protobuf
message User {
  reserved 11, 12;           // Removed: middle_name, suffix
  reserved 15 to 20;         // Reserved for future expansion
  reserved "ssn", "tax_id";  // Removed field names (cannot reuse accidentally)
}
```

### Service Definitions

```protobuf
// User service definition
service UserService {
  // CRUD operations
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);

  // Business operations
  rpc ActivateUser(ActivateUserRequest) returns (ActivateUserResponse);
  rpc DeactivateUser(DeactivateUserRequest) returns (DeactivateUserResponse);

  // Listing with pagination
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);

  // Streaming
  rpc StreamUsers(StreamUsersRequest) returns (stream User);
  rpc UploadUsers(stream UploadUserRequest) returns (UploadUsersResponse);
  rpc ChatWithSupport(stream ChatMessage) returns (stream ChatMessage);

  // Batch operations
  rpc BatchCreateUsers(BatchCreateUsersRequest) returns (BatchCreateUsersResponse);
}
```

### Request and Response Patterns

```protobuf
// Create
message CreateUserRequest {
  string name = 1;
  string email = 2;
  string phone = 3;
  UserRole role = 4;
  UserPreferences preferences = 5;
}

message CreateUserResponse {
  User user = 1;
}

// Get
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}

// Update (partial update with field mask)
message UpdateUserRequest {
  User user = 1;
  google.protobuf.FieldMask update_mask = 2;
}

message UpdateUserResponse {
  User user = 1;
}

// Delete
message DeleteUserRequest {
  string id = 1;
}

message DeleteUserResponse {
  // Empty by design (204 No Content equivalent)
}

// List with Pagination
message ListUsersRequest {
  int32 page_size = 1;     // Max items per page (default 20, max 100)
  string page_token = 2;   // Cursor for next page
  string filter = 3;       // Filter expression (e.g., "status = ACTIVE")
  string order_by = 4;     // Sort expression (e.g., "name desc")
  google.protobuf.FieldMask field_mask = 5;
}

message ListUsersResponse {
  repeated User users = 1;
  string next_page_token = 2;  // Empty if no more results
  int32 total_size = 3;        // Total matching items (if available)
}
```

### Streaming Patterns

```protobuf
// Server streaming
service OrderService {
  rpc StreamOrderUpdates(StreamOrderUpdatesRequest) returns (stream OrderUpdate);
}

message StreamOrderUpdatesRequest {
  repeated string order_ids = 1;
  OrderEventType event_type = 2;
}

message OrderUpdate {
  string order_id = 1;
  OrderStatus old_status = 2;
  OrderStatus new_status = 3;
  google.protobuf.Timestamp timestamp = 4;
}

// Client streaming
service FileService {
  rpc UploadFile(stream FileChunk) returns (UploadFileResponse);
}

message FileChunk {
  string file_id = 1;
  bytes data = 2;
  int32 sequence_number = 3;
  bool is_last = 4;
}

// Bidirectional streaming
service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}

message ChatMessage {
  string message_id = 1;
  string user_id = 2;
  string text = 3;
  google.protobuf.Timestamp timestamp = 4;
}
```



### Error Handling

```protobuf
// Standard gRPC error codes
// Already defined by gRPC: https://grpc.github.io/grpc/core/md_doc_statuscodes.html

// Custom error details (rich error model)
import "google/rpc/error_details.proto";
import "google/rpc/status.proto";

message ErrorInfo {
  string reason = 1;
  string domain = 2;
  map<string, string> metadata = 3;
}

message BadRequest {
  message FieldViolation {
    string field = 1;
    string description = 2;
  }
  repeated FieldViolation field_violations = 1;
}

message RetryInfo {
  google.protobuf.Duration retry_delay = 1;
}
```

**Client error handling:**

```cpp
// C++ client error handling
try {
  User user = client->GetUser(request);
} catch (const grpc::Status& status) {
  switch (status.error_code()) {
    case grpc::StatusCode::NOT_FOUND:
      // Handle not found
      break;
    case grpc::StatusCode::PERMISSION_DENIED:
      // Handle auth error
      break;
    case grpc::StatusCode::UNAVAILABLE:
      // Retry with backoff
      break;
    case grpc::StatusCode::INVALID_ARGUMENT:
      // Parse error details
      break;
  }
}
```

### gRPC Error Codes

| Code | Number | Usage |
|------|--------|-------|
| OK | 0 | Success |
| CANCELLED | 1 | Operation cancelled (usually by client) |
| UNKNOWN | 2 | Unknown error |
| INVALID_ARGUMENT | 3 | Client specified invalid argument |
| DEADLINE_EXCEEDED | 4 | Deadline expired before operation completed |
| NOT_FOUND | 5 | Requested resource not found |
| ALREADY_EXISTS | 6 | Resource already exists |
| PERMISSION_DENIED | 7 | Caller does not have permission |
| RESOURCE_EXHAUSTED | 8 | Resource exhausted (rate limit, quota) |
| FAILED_PRECONDITION | 9 | System not in required state |
| ABORTED | 10 | Operation aborted (concurrency conflict) |
| OUT_OF_RANGE | 11 | Operation attempted past valid range |
| UNIMPLEMENTED | 12 | Operation not implemented |
| INTERNAL | 13 | Internal server error |
| UNAVAILABLE | 14 | Service temporarily unavailable |
| DATA_LOSS | 15 | Unrecoverable data loss or corruption |
| UNAUTHENTICATED | 16 | Request not authenticated |

### gRPC Versioning

```protobuf
// VERSION 1: Original service
package acme.user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

// VERSION 2: Add new field, new RPC
package acme.user.v2;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  // NEW in v2
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
}

// Backward-compatible changes (safe in same package):
// 1. Adding new fields
// 2. Adding new RPCs
// 3. Adding new enum values (with care)
// 4. Adding new messages

// Breaking changes (require new package):
// 1. Removing fields
// 2. Renaming fields (same as remove + add)
// 3. Changing field types
// 4. Changing field numbers
// 5. Removing RPCs
// 6. Changing RPC signatures
```

### gRPC HTTP/JSON Mapping (gRPC-Web, gRPC Gateway)

```protobuf
import "google/api/annotations.proto";

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse) {
    option (google.api.http) = {
      get: "/v1/users/{id}"
    };
  }

  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse) {
    option (google.api.http) = {
      get: "/v1/users"
    };
  }

  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse) {
    option (google.api.http) = {
      post: "/v1/users"
      body: "*"
    };
  }

  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse) {
    option (google.api.http) = {
      patch: "/v1/users/{user.id}"
      body: "user"
    };
  }

  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse) {
    option (google.api.http) = {
      delete: "/v1/users/{id}"
    };
  }

  rpc BatchCreateUsers(BatchCreateUsersRequest) returns (BatchCreateUsersResponse) {
    option (google.api.http) = {
      post: "/v1/users:batchCreate"
      body: "*"
    };
  }
}
```

### gRPC Interceptors

```javascript
// Server-side interceptor (Node.js)
const interceptors = {
  // Logging interceptor
  logging: (call, callback) => {
    const start = Date.now();
    return (error, response) => {
      const duration = Date.now() - start;
      console.log(`[${call.call.handler.path}] ${duration}ms`, error || 'success');
      callback(error, response);
    };
  },

  // Auth interceptor
  auth: (call, callback) => {
    const metadata = call.metadata.get('authorization');
    if (!metadata.length) {
      return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Missing auth' });
    }
    call.auth = validateToken(metadata[0]);
    callback();
  },

  // Rate limiting interceptor
  rateLimit: (call, callback) => {
    const clientId = call.metadata.get('x-client-id')[0];
    if (rateLimiter.isRateLimited(clientId)) {
      return callback({ code: grpc.status.RESOURCE_EXHAUSTED, message: 'Rate limit exceeded' });
    }
    rateLimiter.increment(clientId);
    callback();
  }
};

// Apply interceptors
const server = new grpc.Server();
server.addService(UserService, implementation, {
  interceptors: [interceptors.auth, interceptors.rateLimit, interceptors.logging]
});
```

### gRPC Health Checking

```protobuf
// Standard health check protocol
package grpc.health.v1;

service Health {
  rpc Check(HealthCheckRequest) returns (HealthCheckResponse);
  rpc Watch(HealthCheckRequest) returns (stream HealthCheckResponse);
}

message HealthCheckRequest {
  string service = 1;  // Empty = check overall health
}

message HealthCheckResponse {
  enum ServingStatus {
    UNKNOWN = 0;
    SERVING = 1;
    NOT_SERVING = 2;
    SERVICE_UNKNOWN = 3;
  }
  ServingStatus status = 1;
}
```

### gRPC Testing

```python
# Python gRPC testing with pytest
import grpc
import pytest
from concurrent import futures

import user_pb2
import user_pb2_grpc

class MockUserService(user_pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        return user_pb2.GetUserResponse(
            user=user_pb2.User(
                id=request.id,
                name="Alice Smith",
                email="alice@example.com"
            )
        )

@pytest.fixture
def grpc_stub():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
    user_pb2_grpc.add_UserServiceServicer_to_server(MockUserService(), server)
    port = server.add_insecure_port("[::]:0")
    server.start()
    channel = grpc.insecure_channel(f"[::]:{port}")
    stub = user_pb2_grpc.UserServiceStub(channel)
    yield stub
    server.stop(None)

def test_get_user(grpc_stub):
    request = user_pb2.GetUserRequest(id="usr_123")
    response = grpc_stub.GetUser(request)
    assert response.user.name == "Alice Smith"
    assert response.user.email == "alice@example.com"

def test_grpc_error_codes(grpc_stub):
    with pytest.raises(grpc.RpcError) as exc:
        request = user_pb2.GetUserRequest(id="nonexistent")
        response = grpc_stub.GetUser(request)
    assert exc.value.code() == grpc.StatusCode.NOT_FOUND
```

### gRPC Design Checklist

- [ ] Package naming follows reverse domain + version
- [ ] Field numbers 1-15 used for frequent fields
- [ ] Reserved keyword used for removed fields
- [ ] Enum has UNSPECIFIED = 0 sentinel value
- [ ] Messages have clear, descriptive names
- [ ] Service names end with Service suffix
- [ ] RPC names use VerbNoun pattern (GetUser, ListUsers)
- [ ] Request and response messages are unique per RPC
- [ ] Pagination uses page_token / next_page_token pattern
- [ ] Standard error codes are used correctly
- [ ] Rich error details included for validation errors
- [ ] Streaming direction is intentional (server/client/bidi)
- [ ] Health check service is implemented
- [ ] HTTP/JSON mapping annotations are present
- [ ] Interceptors handle auth, logging, rate limiting
- [ ] Deadlines/timeouts are enforced on server side
- [ ] Field masks used for partial updates
- [ ] Protobuf well-known types used optimally
- [ ] Backward compatibility is maintained within same package
- [ ] Breaking changes trigger new package version
- [ ] Proto files are formatted with protolint
- [ ] Documentation comments present on all public APIs
- [ ] Idempotency indicated on RPCs
- [ ] File organization matches package hierarchy

---

## P6: API Contracts

### Consumer-Driven Contracts (CDC)

Consumer-driven contracts are agreements between API consumers and providers. The consumer defines their expectations, and the provider verifies they are met.

**Contract Workflow:**

```
Consumer writes contract ---> Publish to Pact Broker ---> Provider verifies
         |                                                         |
         +-------------- Provider implements ----------------------+
```

**Key Concepts:**

| Concept | Description |
|---------|-------------|
| Consumer | The client consuming the API |
| Provider | The server providing the API |
| Contract | Consumer expectations of the provider |
| Pact File | Serialized contract (JSON) |
| Pact Broker | Central repository for contracts |
| Provider Verification | Provider runs contract tests against implementation |
| Webhook | Pact Broker notifies provider of new contracts |

### Pact Contract Testing

**Consumer Side (Write Pact):**

```javascript
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, eachLike, term } = MatchersV3;

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'UsersAPI',
});

describe('Users API consumer contract', () => {
  it('should return a user by ID', async () => {
    provider
      .given('a user exists with ID usr_123')
      .uponReceiving('a request for user details')
      .withRequest({
        method: 'GET',
        path: '/users/usr_123',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: like('usr_123'),
          name: like('Alice Smith'),
          email: like('alice@example.com'),
          status: term({ generate: 'active', matcher: 'active|inactive|pending' }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/users/usr_123`, {
        headers: { Accept: 'application/json' },
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.name).toBeDefined();
    });
  });

  it('should return 404 for non-existent user', async () => {
    provider
      .given('no user exists with ID usr_nonexistent')
      .uponReceiving('a request for non-existent user')
      .withRequest({
        method: 'GET',
        path: '/users/usr_nonexistent',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: {
          type: like('https://api.example.com/errors/not-found'),
          title: like('Resource Not Found'),
          status: 404,
        },
      });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/users/usr_nonexistent`, {
        headers: { Accept: 'application/json' },
      });
      expect(response.status).toBe(404);
    });
  });

  it('should create a new user', async () => {
    provider
      .given('a user can be created')
      .uponReceiving('a request to create a user')
      .withRequest({
        method: 'POST',
        path: '/users',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: {
          name: like('Bob'),
          email: like('bob@example.com'),
        },
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: like('usr_new_1'),
          name: like('Bob'),
          email: like('bob@example.com'),
          createdAt: like('2026-05-27T10:00:00Z'),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const response = await fetch(`${mockServer.url}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name: 'Bob', email: 'bob@example.com' }),
      });
      expect(response.status).toBe(201);
    });
  });
});
```

**Provider Side (Verify Pact):**

```javascript
const { Verifier } = require('@pact-foundation/pact');

describe('Users API provider verification', () => {
  it('should satisfy all consumer contracts', async () => {
    const verifier = new Verifier({
      provider: 'UsersAPI',
      providerBaseUrl: 'https://api.example.com',
      pactUrls: [
        'https://pact-broker.example.com/pacts/provider/UsersAPI/consumer/FrontendApp/latest',
      ],
      stateHandlers: {
        'a user exists with ID usr_123': async () => {
          await setupTestData({ id: 'usr_123', name: 'Alice Smith' });
        },
        'no user exists with ID usr_nonexistent': async () => {
          await cleanupTestData('usr_nonexistent');
        },
        'a user can be created': async () => {
          await resetTestDatabase();
        },
      },
      verificationOptions: {
        before: async () => {
          await setupTestSuite();
        },
        after: async () => {
          await teardownTestSuite();
        },
      },
    });

    const output = await verifier.verifyProvider();
    console.log('Verification output:', output);
  });
});
```

### Pact Broker

```yaml
# docker-compose.yml
version: '3'
services:
  pact-broker:
    image: pactfoundation/pact-broker:latest
    ports:
      - "9292:9292"
    environment:
      PACT_BROKER_DATABASE_URL: "postgres://pact:pact@db:5432/pact"
      PACT_BROKER_WEBHOOKS_ENABLED: "true"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: pact
      POSTGRES_PASSWORD: pact
      POSTGRES_DB: pact
```

**CI/CD Integration:**

```yaml
# .github/workflows/pact-verify.yml
name: Pact Verification
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  verify:
    runs-on: ubuntu-latest
    services:
      api:
        image: my-api:latest
        ports:
          - 8080:8080
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run pact:verify
        env:
          PACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
```

### Contract States

State management is critical for provider verification:

```javascript
// state-handlers.js
module.exports = {
  'a user exists': async (params) => {
    const user = await createUser({
      id: params.id || 'usr_default',
      name: params.name || 'Default User',
      email: params.email || 'default@example.com',
    });
    return { description: `User ${user.id} created` };
  },

  'users exist with various statuses': async () => {
    await createUser({ id: 'usr_1', status: 'active' });
    await createUser({ id: 'usr_2', status: 'inactive' });
    await createUser({ id: 'usr_3', status: 'pending' });
  },

  'no users exist': async () => {
    await clearAllUsers();
  },

  'the user is authorized': async () => {
    await setupAuthToken('valid_token', { scopes: ['users:read'] });
  },

  'the user lacks permissions': async () => {
    await setupAuthToken('limited_token', { scopes: [] });
  },
};
```

### Contract Testing Best Practices

1. **Test real interactions** -- Contracts should reflect actual API usage
2. **Meaningful states** -- Provider states map to real system states
3. **Matchers over exact values** -- Use like, term, eachLike to be flexible
4. **Test error cases** -- Contract for 4xx/5xx responses too
5. **Version contracts** -- Tag contracts with version in Pact Broker
6. **Automate verification** -- Run provider verification in CI/CD pipeline
7. **Webhook notifications** -- Notify providers when consumer contracts change
8. **WIP pacts** -- Allow work-in-progress contracts for new features
9. **Contract tags** -- Tag contracts by environment (prod, staging, test)
10. **Bi-directional contracts** -- Consider both consumer and provider contracts

### Contract Testing Anti-Patterns

| Anti-Pattern | Problem | Solution |
|---|---|---|
| Testing the database | Contract tests couple to internal state | Use meaningful business states |
| Too many states | Tests become unmanageable | Keep states focused on consumer needs |
| Exact value matching | Fragile tests, false positives | Use matchers for flexible matching |
| No error contracts | Missing error handling verification | Contract for error responses too |
| Testing implementation details | Brittle contracts | Test API surface, not internals |
| One contract for everything | Difficult to maintain | Separate contracts per consumer |
| Not tagging contracts | Hard to track production contracts | Tag contracts by environment |

### Contract Evolution

```
  Contract v1 ---> Consumer updates contract ---> New contract published
       |                                                |
       |                                                +--> Provider verification fails
       |                                                |         |
       |                                                |    Provider implements change
       |                                                |         |
       |                                                +--> Provider verification passes
       |                                                |         |
       |                                                |    Contract deployed to prod
       |
       +-- Old contract remains valid for existing consumers
```

**Can-I-Deploy:**

```bash
# Check if provider can be deployed safely
npx pact-broker can-i-deploy \
  --pacticipant UsersAPI \
  --version 2.0.0 \
  --to-environment production

# Check if consumer can be deployed
npx pact-broker can-i-deploy \
  --pacticipant FrontendApp \
  --version 1.5.0 \
  --to-environment production

# Matrix check
npx pact-broker can-i-deploy \
  --pacticipant FrontendApp --version 1.5.0 \
  --pacticipant UsersAPI --version 2.0.0
```

### Contract Testing in CI/CD Pipeline

```yaml
stages:
  - consumer-test
  - pact-publish
  - provider-verify
  - can-i-deploy
  - deploy

consumer-test:
  stage: consumer-test
  script:
    - npm ci
    - npm run test:pact
    - npm run pact:publish

pact-publish:
  stage: pact-publish
  script:
    - npx pact-broker publish ./pacts \
      --consumer-app-version $CI_COMMIT_SHA \
      --tag $CI_COMMIT_BRANCH

provider-verify:
  stage: provider-verify
  script:
    - npm ci
    - npm run start:test &
    - npx pact-broker can-i-deploy \
      --pacticipant UsersAPI --version latest
    - npm run pact:verify

can-i-deploy:
  stage: can-i-deploy
  script:
    - npx pact-broker can-i-deploy \
      --pacticipant UsersAPI \
      --version $CI_COMMIT_SHA \
      --to-environment production
  only:
    - main

deploy:
  stage: deploy
  script:
    - deploy-to-production
  only:
    - main
  needs:
    - can-i-deploy
```

### JSON Schema Validation for Contracts

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'status'],
  properties: {
    id: { type: 'string', pattern: '^usr_[a-zA-Z0-9]+$' },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    email: { type: 'string', format: 'email' },
    status: { type: 'string', enum: ['active', 'inactive', 'pending'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
};

const validate = ajv.compile(userSchema);

function validateUserResponse(response) {
  const valid = validate(response);
  if (!valid) {
    throw new Error(`Contract validation failed: ${JSON.stringify(validate.errors)}`);
  }
  return true;
}
```

### Contract Testing Matrix

| Tool | Protocol | Consumer Test | Provider Verify | Broker | Language |
|------|----------|--------------|----------------|--------|----------|
| Pact | HTTP | Yes | Yes | Yes | Multi-language |
| Spring Cloud Contract | HTTP, Messaging | Yes | Yes | No | Java |
| OpenAPI Validator | HTTP (OpenAPI) | No | Yes | No | Multi-language |
| Postman + Newman | HTTP | No | Yes | No | JavaScript |
| Dredd | HTTP (OpenAPI) | No | Yes | No | JavaScript |
| Schemathesis | HTTP (OpenAPI) | No | Yes | No | Python |
| GraphQL Inspector | GraphQL | Yes | Yes | No | JavaScript |

---



## P7: API Security

### Authentication vs Authorization

| Concept | Description | Mechanism |
|---------|-------------|-----------|
| Authentication (AuthN) | Verifying identity | API Keys, OAuth2, JWT, Basic Auth |
| Authorization (AuthZ) | Verifying permissions | Scopes, Roles, RBAC, ABAC |

### API Key Authentication

```yaml
# API Key in header
GET /users/me
X-API-Key: sk_live_abc123def456

# API Key in query parameter
GET /users/me?api_key=sk_live_abc123def456

# API Key in cookie
GET /users/me
Cookie: api_key=sk_live_abc123def456
```

**API Key Format:**

```
sk_live_XXXXXXXXXXXX    # Production key
sk_test_XXXXXXXXXXXX    # Test key
pk_live_XXXXXXXXXXXX    # Public key (limited access)
pk_test_XXXXXXXXXXXX    # Public test key

# Format: prefix + environment + random bytes (base64 encoded)
# Minimum 32 characters, maximum 128
```

**API Key Security Rules:**

- Store keys as hashes (bcrypt or SHA-256)
- Never log full keys (log last 4 characters only)
- Support key rotation with overlapping validity periods
- Rate limit per key
- Scope keys to specific permissions
- Allow key revocation
- Expire keys after configurable period (default 90 days)

### OAuth 2.0 Flows

**Authorization Code Flow (Recommended for web apps):**

```
User ---> Browser ---> Client App
  |                        |
  |                  1. Redirect to Auth Server
  |                        |
  +----------------------> Auth Server
  |  2. User authenticates
  |                        |
  +------------------------ 3. Authorization code
  |                        |
  |                  4. Exchange code for tokens
  |                        |
  |<---------------------- 5. Access Token + Refresh Token + ID Token
  |                        |
  |                  6. API calls with Access Token
  |                        |
  +----------------------> API Server (validates token)
```

**Client Credentials Flow (Machine-to-Machine):**

```
Backend Service ---> Auth Server ---> Access Token ---> API Service
```

**OAuth2 Scopes:**

```yaml
scopes:
  users:read: "Read user profiles"
  users:write: "Create and update users"
  users:delete: "Delete users"
  orders:read: "Read order information"
  orders:write: "Create and update orders"
  admin: "Full administrative access"
```

**Token Exchange:**

```yaml
# Request
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=abc123
&redirect_uri=https://client.example.com/callback
&client_id=client_abc
&client_secret=secret_xyz

# Response
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def456",
  "scope": "users:read orders:read",
  "id_token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Token Refresh:**

```yaml
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=def456
&client_id=client_abc
&client_secret=secret_xyz

{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "ghi789"
}
```

### JWT (JSON Web Tokens)

**JWT Structure:**

```
header.payload.signature

# Header
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-v1"
}

# Payload
{
  "sub": "usr_abc123",
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "exp": 1716800000,
  "iat": 1716796400,
  "jti": "token_unique_id",
  "scope": "users:read orders:read",
  "roles": ["admin"],
  "tenant": "acme-corp",
  "email": "alice@example.com",
  "name": "Alice Smith"
}

# Signature
RSASHA256(base64url(header) + "." + base64url(payload), private_key)
```

**JWT Validation:**

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  cache: true,
  rateLimit: true,
});

async function validateToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header.kid) {
    throw new Error('Invalid token format');
  }

  const key = await client.getSigningKey(decoded.header.kid);
  const publicKey = key.getPublicKey();

  const payload = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://auth.example.com',
    audience: 'https://api.example.com',
    clockTolerance: 30,
  });

  return payload;
}
```

**JWT Best Practices:**

| Practice | Rationale |
|----------|-----------|
| Use RS256 or ES256 (asymmetric) | Prevents server from impersonating clients |
| Short expiration (15-60 min) | Limits window of compromised token |
| Include jti (unique ID) | Enables token revocation |
| Validate all claims | Prevents token forgery |
| Use HTTPS only | Prevents token interception |
| Store in memory only | Prevents XSS token theft |
| Never store in localStorage | Vulnerable to XSS |
| Use refresh tokens for sessions | Enables long-lived sessions |
| Revoke tokens on logout | Ensures complete session termination |
| Rotate signing keys periodically | Limits impact of key compromise |

### Rate Limiting

```yaml
# Rate limit headers
HTTP/1.1 200 OK
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1716800000

# When exceeded:
HTTP/1.1 429 Too Many Requests
Retry-After: 45
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1716800045
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 45 seconds.",
    "retryAfter": 45
  }
}
```

**Rate Limit Tiers:**

| Tier | Rate Limit | Burst | Use Case |
|------|-----------|-------|----------|
| Free | 10 req/min | 20 | Trial access |
| Basic | 100 req/min | 200 | Individual developers |
| Pro | 1000 req/min | 2000 | Business applications |
| Enterprise | 10000 req/min | 20000 | High-volume customers |
| Internal | Unlimited | - | First-party services |

**Rate Limit Algorithms:**

| Algorithm | Description | Pros | Cons |
|-----------|-------------|------|------|
| Token Bucket | Tokens refill at steady rate | Handles bursts well | Memory per key |
| Leaky Bucket | Requests processed at steady rate | Smooth traffic | No burst support |
| Fixed Window | Counter resets at window boundary | Simple to implement | Boundary spikes |
| Sliding Window | Window slides with each request | More accurate | More complex |
| Sliding Log | Log of all request timestamps | Most accurate | High memory usage |

**Distributed Rate Limiting with Redis:**

```javascript
const redis = require('redis');
const client = redis.createClient();

async function checkRateLimit(key, maxRequests, windowSeconds) {
  const now = Date.now();
  const windowStart = now - (windowSeconds * 1000);

  const result = await client.multi()
    .zAdd(key, { score: now, value: `${now}` })
    .zRemRangeByScore(key, 0, windowStart)
    .zCard(key)
    .expire(key, windowSeconds)
    .exec();

  const requestCount = result[2];
  const remaining = Math.max(0, maxRequests - requestCount);

  if (requestCount > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: now + (windowSeconds * 1000) };
  }

  return {
    allowed: true,
    remaining,
    resetAt: now + (windowSeconds * 1000),
  };
}
```

### Quotas and Throttling

```yaml
# Quota headers
HTTP/1.1 200 OK
X-Quota-Limit: 100000
X-Quota-Used: 45000
X-Quota-Remaining: 55000
X-Quota-Reset: 2026-06-01T00:00:00Z

# When exceeded:
HTTP/1.1 429 Too Many Requests
X-Quota-Limit: 100000
X-Quota-Used: 100000
X-Quota-Remaining: 0
X-Quota-Reset: 2026-06-01T00:00:00Z
{
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Monthly API quota exceeded. Resets on June 1, 2026.",
    "quotaLimit": 100000,
    "quotaUsed": 100000,
    "quotaReset": "2026-06-01T00:00:00Z"
  }
}
```

### Security Headers

```yaml
# Recommended security headers for API responses
Content-Security-Policy: "default-src 'none'"
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cache-Control: no-store
Pragma: no-cache
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, Idempotency-Key
Access-Control-Expose-Headers: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
Access-Control-Max-Age: 86400
```

### CORS Configuration

```yaml
# CORS for API
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, Idempotency-Key, Request-Id
Access-Control-Expose-Headers: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Request-Id
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true
Vary: Origin
```

**CORS Preflight Request:**

```yaml
# Preflight (OPTIONS) request
OPTIONS /users
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# Preflight response
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 86400
Vary: Origin
```

### API Security Checklist

- [ ] Authentication is required for all non-public endpoints
- [ ] JWT tokens are validated (signature, expiry, issuer, audience)
- [ ] API keys are hashed when stored
- [ ] OAuth2 scopes are enforced per endpoint
- [ ] Rate limiting is configured per API key / user
- [ ] Quotas are enforced for high-volume usage
- [ ] Security headers are present on all responses
- [ ] CORS is configured for known origins only
- [ ] Input validation rejects malformed data
- [ ] SQL injection prevention (parameterized queries)
- [ ] No sensitive data in URLs or error messages
- [ ] TLS/HTTPS is enforced (HTTP redirects)
- [ ] API keys and secrets are never logged
- [ ] Token revocation is supported
- [ ] Refresh token rotation is implemented
- [ ] Brute force protection on auth endpoints
- [ ] Request size limits are enforced
- [ ] Webhook signatures are verified
- [ ] Audit logging for security events
- [ ] Environment-specific keys (test vs production)

---



## P8: API Lifecycle

### Lifecycle Phases

```
+------------------------------------------------------+
|                  API Lifecycle                        |
|                                                      |
|  Design ---> Develop ---> Test ---> Deploy ---> Operate |
|    |                                                    |
|    +-------------- Version ----------------------------+
|                                                      |
|  Deprecate ---> Migrate ---> Sunset                  |
+------------------------------------------------------+
```

### Phase 1: Design

**Activities:**
- Requirements gathering with stakeholders
- API style selection (REST/GraphQL/gRPC)
- Resource modeling and schema definition
- Specification authoring
- Design review with API guild
- Breaking change analysis

**Outputs:**
- Published spec (OpenAPI/GraphQL/Proto)
- Mock server
- Style guide compliance report
- Design review sign-off

### Phase 2: Develop

**Activities:**
- Server implementation (by backend engineers)
- Client SDK generation
- Contract compliance testing
- Security scanning

**Outputs:**
- Implementation matching spec
- Generated SDKs
- Contract test results

### Phase 3: Test

**Activities:**
- Integration tests against spec
- Contract verification (Pact)
- Performance testing
- Security scanning
- Spec validation

**Outputs:**
- Test reports
- Contract verification results
- Performance benchmarks

### Phase 4: Deploy

**Activities:**
- Can-i-deploy check (Pact)
- Staged rollout (canary, blue-green)
- API gateway configuration
- Documentation publication
- Monitoring setup

**Outputs:**
- Deployed API
- Published docs
- Monitoring dashboards

### Phase 5: Operate

**Activities:**
- Monitoring and alerting
- Consumer feedback collection
- Usage analytics
- Performance optimization
- Support and troubleshooting

**Outputs:**
- API analytics dashboards
- Incident reports
- Optimization recommendations

### Versioning Strategy

**Versioning Approaches:**

| Approach | Example | Pros | Cons |
|----------|---------|------|------|
| URL path | /v1/users | Simple, explicit | URL coupling |
| Header | Accept: application/vnd.api+json;version=2 | Clean URLs | Complex to test |
| Query param | /users?api_version=2 | Easy to switch | Cache pollution |
| Content negotiation | Accept: application/vnd.company.v2+json | Clean, RESTful | Complex routing |

**Recommended: URL versioning for major versions:**

```yaml
/v1/users       # Version 1
/v2/users       # Version 2 (breaking changes)
```

### Backward Compatibility

**Additive Changes (Always Safe):**

- Adding new optional fields to request/response
- Adding new endpoints
- Adding new enum values (with client handling)
- Adding new response headers
- Adding new query parameters
- Extending pagination options

**Breaking Changes (Require New Version):**

- Removing fields from response
- Making optional fields required
- Renaming fields or endpoints
- Changing field types
- Changing enum values
- Removing endpoints
- Changing URL structure
- Changing HTTP methods
- Changing error codes
- Changing authentication requirements

**Semantic Versioning for APIs:**

```yaml
# API version: MAJOR.MINOR.PATCH
# MAJOR: Breaking changes
# MINOR: Additive changes (backward compatible)
# PATCH: Bug fixes, internal changes

openapi: "3.1.0"
info:
  version: "2.1.3"  # MAJOR 2, MINOR 1, PATCH 3
```

### API Evolution (Additive)

```yaml
# V1: Original endpoint
GET /v1/users/{id}
Response:
{
  "id": "usr_123",
  "name": "Alice",
  "email": "alice@example.com"
}

# V2: Added optional fields (backward compatible)
GET /v1/users/{id}
Response:
{
  "id": "usr_123",
  "name": "Alice",
  "email": "alice@example.com",
  "phone": "+1234567890",         # NEW optional field
  "preferences": {                # NEW optional field
    "language": "en",
    "timezone": "UTC"
  }
}

# Later: Added new endpoint (additive)
GET /v1/users/{id}/orders
Response:
{
  "data": [...]
}
```

### Breaking Change Detection

```bash
npx openapi-diff old-spec.yaml new-spec.yaml

# Output:
# BREAKING CHANGES:
#   - DELETE /v1/users/{id}: Removed endpoint
#   - GET /v1/users: Response field "name" changed from required to optional
#   - POST /v1/users: Request field "email" changed from optional to required
#
# Non-Breaking Changes:
#   - GET /v1/users: Added response field "phone" (optional)
#   - POST /v1/users: Added response status 201
```

**Automated Breaking Change Detection in CI:**

```yaml
# .github/workflows/breaking-change-check.yml
name: Check Breaking Changes
on:
  pull_request:
    paths:
      - 'specs/**/*.yaml'

jobs:
  check-breaking:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Get base spec
        run: |
          git show origin/main:specs/users.yaml > /tmp/base-spec.yaml
      - name: Check for breaking changes
        run: |
          npx openapi-diff /tmp/base-spec.yaml specs/users.yaml
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: ':warning: This PR contains potential breaking changes. Please ensure major version bump.'
            })
```

### Deprecation Strategy

**Deprecation Headers:**

```yaml
# Deprecation response header
GET /v1/users
Response:
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 30 Nov 2026 00:00:00 GMT
Link: </v2/users>; rel="successor-version"
```

**Deprecation Workflow:**

```
1. Announce deprecation (blog post, changelog, email)
2. Add deprecation headers to API responses
3. Provide migration guide
4. Set sunset date (minimum 6 months notice)
5. Track consumer migration
6. Sunset: Remove endpoint or return 410 Gone
```

**Deprecation Timeline:**

| Phase | Timeline | Action |
|-------|----------|--------|
| Announcement | T+0 | Publish deprecation notice |
| Cool-down | T+0 to T+6mo | Add deprecation headers, migration support |
| Warning | T+6mo | Increase deprecation header verbosity |
| Grace period | T+6mo to T+12mo | Return warning headers, still functional |
| Sunset | T+12mo | Return 410 Gone or remove endpoint |

### API Registry

An API registry is a centralized catalog of all APIs in the organization.

```yaml
api:
  name: "Users API"
  id: "api_usr_001"
  version: "2.0.0"
  status: "active"  # active, deprecated, sunset
  owner: "team-identity"
  specUrl: "https://specs.example.com/users/v2/openapi.yaml"
  docsUrl: "https://docs.example.com/users/v2"
  healthUrl: "https://api.example.com/health"
  slack: "#api-users"
  consumers:
    - "Frontend App"
    - "Mobile App"
    - "Analytics Pipeline"
  sla:
    availability: "99.9%"
    latency: "200ms p99"
    rateLimit: "1000 req/min"
  changelog:
    - version: "2.0.0"
      date: "2026-01-15"
      changes: ["Breaking: Removed deprecated fields", "Added: phone field"]
    - version: "1.5.0"
      date: "2025-10-01"
      changes: ["Added: preferences field"]
```

---



## P9: API Documentation

### Documentation Types

| Type | Audience | Purpose | Format |
|------|----------|---------|--------|
| Reference Docs | Developers | Endpoint details, parameters, schemas | ReDoc, Swagger UI |
| Quickstart Guide | New users | First API call in 5 minutes | Markdown, tutorials |
| User Guide | All users | Comprehensive usage patterns | Markdown, guides |
| Changelog | All users | Version history | Markdown |
| Migration Guide | Existing users | Upgrading between versions | Markdown |
| SDK Docs | Developers | Language-specific usage | Generated docs |
| API Playground | All users | Try APIs in browser | Interactive UI |
| Release Notes | All users | What is new in each release | Markdown |

### Reference Documentation

```yaml
openapi: "3.1.0"
info:
  title: "Users API"
  version: "2.0.0"
  description: >
    The Users API provides endpoints for managing user accounts.
    Use this API to create, read, update, and delete user profiles.

    ## Authentication
    All API requests require authentication via Bearer JWT token or API key.

    ## Rate Limiting
    - Free tier: 10 requests per minute
    - Pro tier: 1000 requests per minute
    - See Rate Limit headers for current status

    ## Pagination
    All list endpoints support cursor-based pagination.
    Use the cursor parameter to paginate through results.

    ## Errors
    Errors follow RFC 9457 (Problem Details) format.
    See error codes table for all possible errors.

  contact:
    name: "API Support"
    email: "api-support@example.com"
    url: "https://developer.example.com/support"
  termsOfService: "https://example.com/terms"
  x-logo:
    url: "https://example.com/logo.png"
    altText: "Company Logo"
```

### Documentation Best Practices

1. **Write for your audience** -- Assume API literacy but not domain knowledge
2. **Include runnable examples** -- Every endpoint needs a request/response example
3. **Show error responses** -- Document every error code and response
4. **Provide SDK examples** -- Show code examples in multiple languages
5. **Keep docs in sync** -- Generate from spec, never hand-write reference docs
6. **Version your docs** -- Each API version gets its own documentation
7. **Interactive playground** -- Let developers try APIs without leaving docs
8. **Search functionality** -- Make docs searchable
9. **Keyboard shortcuts** -- Power user navigation
10. **Dark mode** -- Developer preference
11. **Mobile responsive** -- Docs work on all devices
12. **OpenAPI spec download** -- Let consumers download the raw spec

### Documentation Generation

```yaml
# Using Redoc CLI
redoc-cli bundle specs/users.yaml \
  --options.theme.colors.primary.main="#0070f3" \
  --options.expandResponses="200,201" \
  --options.hideDownloadButton=false \
  --output docs/users-api.html

# Using Stoplight Elements
import { API } from '@stoplight/elements';

<API
  apiDescriptionUrl="/specs/users.yaml"
  router="hash"
  layout="sidebar"
/>
```

### Changelog

```markdown
## [2.1.0] - 2026-03-15

### Added
- phone field to User response (optional)
- preferences field to User response (optional)
- PATCH /users/{id} endpoint for partial updates
- ?include=orders parameter for user detail endpoint

### Changed
- Rate limit increased from 100 to 200 req/min for Pro tier
- Error responses now include instance field for traceability
- Pagination default page size changed from 10 to 20

### Deprecated
- GET /v1/users/{id}?expand=true -- Use ?include= instead
- status field pending value -- Use inactive instead

### Fixed
- Fixed incorrect Content-Type header on 204 responses
- Fixed CORS preflight not returning allowed methods

## [2.0.0] - 2026-01-15

### Breaking Changes
- Removed username field -- use email for login
- Removed GET /v1/users/search -- use GET /v1/users?filter=
- Changed error format to RFC 9457 (Problem Details)
- Minimum TLS version increased to 1.3

### Added
- Cursor-based pagination on all list endpoints
- Filter and sort support on GET /v1/users
- Idempotency key support on POST /v1/users
- Rate limit headers on all responses
- HATEOAS links on all resource responses

### Migration
- See Migration Guide for details
- Old v1 endpoints will be sunset on 2026-12-31
```

### Migration Guide

```markdown
# Migrating from Users API v1 to v2

## Overview
v2 introduces several improvements including cursor pagination,
standardized error format, and HATEOAS support.

## Timeline
- v2 release: January 15, 2026
- v1 deprecation: March 15, 2026 (deprecation headers added)
- v1 sunset: December 31, 2026

## Breaking Changes

### 1. Error Format Changed
Old (v1):
```json
{
  "error": "User not found"
}
```

New (v2):
```json
{
  "type": "https://api.example.com/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "User with ID usr_123 not found",
  "instance": "/api/logs/err-abc123"
}
```

### 2. Pagination Changed
Old (v1): Offset-based with /users?page=1&per_page=10
New (v2): Cursor-based with /users?cursor=...&limit=20

### 3. Search Replaced with Filter
Old (v1): GET /v1/users/search?q=alice
New (v2): GET /v1/users?filter=name contains 'alice'

## New Features

### Idempotency Keys
Add Idempotency-Key header to POST requests for safe retries.

### HATEOAS Links
Responses now include _links for API navigation.

## SDK Updates
- Node.js: Upgrade to @company/users-api@^2.0.0
- Python: Upgrade to company-users-api>=2.0.0
- Go: Upgrade to github.com/company/users-api/v2

## Testing
Update your contract tests to match v2 response formats.
Run provider verification against v2 to ensure compatibility.
```

### SDK Generation

```yaml
# OpenAPI Generator configuration
generatorName: typescript-axios
npmName: "@company/users-api-sdk"
npmVersion: "2.0.0"
supportsES6: true
withInterfaces: true
useSingleRequestParameter: true
stringEnums: true
```

```bash
# Generate TypeScript SDK
npx @openapitools/openapi-generator-cli generate \
  -i specs/users.yaml \
  -g typescript-axios \
  -o sdks/typescript \
  -c config.yaml

# Generate Python SDK
npx @openapitools/openapi-generator-cli generate \
  -i specs/users.yaml \
  -g python \
  -o sdks/python \
  --package-name company_users_api

# Generate Go SDK
npx @openapitools/openapi-generator-cli generate \
  -i specs/users.yaml \
  -g go \
  -o sdks/go \
  --package-name usersapi
```

### API Documentation Checklist

- [ ] Reference docs generated from spec
- [ ] Quickstart guide for first API call
- [ ] Comprehensive user guide with patterns
- [ ] Changelog maintained for all versions
- [ ] Migration guides for breaking changes
- [ ] SDK documentation for generated clients
- [ ] Interactive playground for trying APIs
- [ ] Error codes documented with examples
- [ ] Rate limit documentation
- [ ] Authentication/authorization documentation
- [ ] Pagination, filtering, sorting documented
- [ ] Webhook event catalog documented
- [ ] FAQ section for common issues
- [ ] Support contact information
- [ ] Terms of service and usage policies
- [ ] OpenAPI spec available for download
- [ ] Postman collection available
- [ ] Code examples in multiple languages
- [ ] Search functionality in docs
- [ ] Version selector in documentation

---



## P10: Event-Driven APIs

### Webhooks

Webhooks are callbacks that notify consumers when events occur.

**Webhook Flow:**

```
API Service ---> Event Occurs ---> HTTP POST ---> Consumer Endpoint
                                         |
                                   HTTP Response (2xx = success)
```

**Webhook Request:**

```yaml
POST /webhooks/user-created
Content-Type: application/json
User-Agent: Company-Webhook/1.0
X-Webhook-ID: whk_abc123
X-Webhook-Event: user.created
X-Webhook-Timestamp: 2026-05-27T10:00:00Z
X-Webhook-Signature: sha256=abc123def456...
X-Webhook-Delivery-Attempt: 1

{
  "id": "evt_xyz789",
  "event": "user.created",
  "createdAt": "2026-05-27T10:00:00Z",
  "data": {
    "object": {
      "id": "usr_abc123",
      "name": "Alice Smith",
      "email": "alice@example.com"
    }
  }
}
```

**Webhook Response:**

```yaml
# Success (webhook acknowledged)
HTTP/1.1 200 OK
# or 202 Accepted

# Retry (webhook temporarily unavailable)
HTTP/1.1 500 Internal Server Error
# or timeout (no response within 5 seconds)
```

**Webhook Signature Verification:**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const actualSig = signature.replace('sha256=', '');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(actualSig)
  );
}

function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook...
  res.status(200).json({ received: true });
}
```

**Webhook Retry Policy:**

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1 | Immediate | 0 |
| 2 | 10 seconds | 10s |
| 3 | 1 minute | 1m 10s |
| 4 | 10 minutes | 11m 10s |
| 5 | 1 hour | 1h 11m 10s |
| 6 | 6 hours | 7h 11m 10s |
| 7 | 24 hours | 31h 11m 10s |

**Webhook Best Practices:**

1. **Idempotency** -- Webhooks may be delivered multiple times; consumers must handle duplicates
2. **Signatures** -- Sign all webhook payloads for verification
3. **Retry with backoff** -- Exponential backoff for failed deliveries
4. **Dead letter queue** -- After max retries, log and alert
5. **Consumer confirmation** -- 2xx response acknowledges receipt
6. **Timeout** -- 5 second timeout for consumer response
7. **Event types** -- Use consistent naming: resource.event (e.g., user.created)
8. **Payload structure** -- Include event metadata, object, and previous values
9. **Rate limiting** -- Do not flood consumers; batch events if needed
10. **Documentation** -- Document all event types, payloads, and delivery guarantees

### Event Catalog

```yaml
event:
  name: "user.created"
  description: "Fired when a new user account is created"
  category: "User Events"
  version: "1.0"
  schema:
    type: "object"
    properties:
      id:
        type: "string"
        description: "Unique event identifier"
      event:
        type: "string"
        enum: ["user.created"]
      createdAt:
        type: "string"
        format: "date-time"
      data:
        type: "object"
        properties:
          object:
            $ref: "#/definitions/User"
          previousAttributes:
            type: "null"
  webhookUrl: "/webhooks/user-created"
  examples:
    - payload: |
        {
          "id": "evt_abc123",
          "event": "user.created",
          "createdAt": "2026-05-27T10:00:00Z",
          "data": {
            "object": {
              "id": "usr_abc123",
              "name": "Alice Smith",
              "email": "alice@example.com",
              "status": "active"
            }
          }
        }
```

**Complete Event Catalog:**

| Event | Description | Payload |
|-------|-------------|---------|
| user.created | New user registered | User object |
| user.updated | User profile updated | User + previous values |
| user.deleted | User account deleted | User ID |
| user.verified | Email verified | User object |
| order.created | New order placed | Order object |
| order.updated | Order status changed | Order + previous values |
| order.shipped | Order shipped | Order + tracking |
| order.delivered | Order delivered | Order + delivery date |
| order.cancelled | Order cancelled | Order + reason |
| payment.completed | Payment successful | Payment object |
| payment.failed | Payment failed | Payment + error |
| payment.refunded | Payment refunded | Payment + amount |

### AsyncAPI Specification

```yaml
asyncapi: "2.6.0"
info:
  title: "User Events API"
  version: "1.0.0"
  description: "Async events for user domain"
  contact:
    name: "API Team"
    email: "api@example.com"

servers:
  production:
    url: "events.example.com:9092"
    protocol: "kafka"
    description: "Production Kafka cluster"
  development:
    url: "localhost:9092"
    protocol: "kafka"
    description: "Local Kafka for development"

defaultContentType: "application/json"

channels:
  user.created:
    description: "Emitted when a new user is created"
    publish:
      operationId: "emitUserCreated"
      summary: "User created event"
      message:
        $ref: "#/components/messages/UserCreated"
    subscribe:
      operationId: "onUserCreated"
      summary: "Receive user created notifications"
      message:
        $ref: "#/components/messages/UserCreated"

  user.updated:
    description: "Emitted when a user is updated"
    publish:
      operationId: "emitUserUpdated"
      summary: "User updated event"
      message:
        $ref: "#/components/messages/UserUpdated"
    subscribe:
      operationId: "onUserUpdated"
      summary: "Receive user updated notifications"
      message:
        $ref: "#/components/messages/UserUpdated"

  user.deleted:
    description: "Emitted when a user is deleted"
    publish:
      operationId: "emitUserDeleted"
      summary: "User deleted event"
      message:
        $ref: "#/components/messages/UserDeleted"
    subscribe:
      operationId: "onUserDeleted"
      summary: "Receive user deleted notifications"
      message:
        $ref: "#/components/messages/UserDeleted"

components:
  messages:
    UserCreated:
      name: "UserCreated"
      title: "User Created Event"
      summary: "A new user has been created"
      contentType: "application/json"
      payload:
        type: "object"
        required: [id, event, createdAt, data]
        properties:
          id:
            type: "string"
            description: "Unique event identifier"
          event:
            type: "string"
            enum: ["user.created"]
          createdAt:
            type: "string"
            format: "date-time"
          data:
            type: "object"
            properties:
              object:
                $ref: "#/components/schemas/User"
              previousAttributes:
                type: "object"
                nullable: true

    UserUpdated:
      name: "UserUpdated"
      title: "User Updated Event"
      summary: "An existing user has been updated"
      payload:
        type: "object"
        required: [id, event, createdAt, data]
        properties:
          id: { type: "string" }
          event: { type: "string", enum: ["user.updated"] }
          createdAt: { type: "string", format: "date-time" }
          data:
            type: "object"
            properties:
              object: { $ref: "#/components/schemas/User" }
              previousAttributes: { $ref: "#/components/schemas/UserPreviousValues" }

    UserDeleted:
      name: "UserDeleted"
      title: "User Deleted Event"
      summary: "A user has been deleted"
      payload:
        type: "object"
        required: [id, event, createdAt, data]
        properties:
          id: { type: "string" }
          event: { type: "string", enum: ["user.deleted"] }
          createdAt: { type: "string", format: "date-time" }
          data:
            type: "object"
            properties:
              object:
                type: "object"
                properties:
                  id: { type: "string" }

  schemas:
    User:
      type: "object"
      required: [id, name, email]
      properties:
        id: { type: "string" }
        name: { type: "string" }
        email: { type: "string", format: "email" }
        status: { type: "string", enum: [active, inactive, pending] }
        createdAt: { type: "string", format: "date-time" }
        updatedAt: { type: "string", format: "date-time" }

    UserPreviousValues:
      type: "object"
      properties:
        name: { type: "string" }
        email: { type: "string" }
        status: { type: "string", enum: [active, inactive, pending] }
```

### Webhook Management UI

```yaml
# Webhook configuration (consumers can manage via UI/API)
webhook:
  url: "https://consumer.example.com/webhooks"
  events:
    - "user.created"
    - "user.updated"
    - "order.shipped"
  description: "Receive user and order notifications"
  enabled: true
  secret: "whsec_abc123def456"
  filter:
    userId: "usr_abc123"
  retry:
    maxAttempts: 7
    initialDelayMs: 10000
  rateLimit: 100
```

### Server-Sent Events (SSE)

```yaml
# SSE endpoint
GET /events?type=user.created&type=user.updated
Accept: text/event-stream

Response:
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: user.created
id: evt_abc123
data: {"id":"usr_1","name":"Alice"}
retry: 3000

event: user.updated
id: evt_def456
data: {"id":"usr_1","name":"Alice Updated"}
```

### Event-Driven API Checklist

- [ ] Webhook signature verification is implemented
- [ ] Idempotency handling in webhook consumers
- [ ] Retry with exponential backoff configured
- [ ] Dead letter queue for failed deliveries
- [ ] Webhook management dashboard for consumers
- [ ] Event catalog published and maintained
- [ ] AsyncAPI spec written for all events
- [ ] Event naming follows resource.event convention
- [ ] Payload includes event metadata
- [ ] Consumer filtering support
- [ ] Rate limiting for webhook delivery
- [ ] Delivery monitoring and alerting
- [ ] SSE endpoints for real-time updates
- [ ] Documentation for all event types
- [ ] Webhook secret rotation support

---



## P11: Worked Examples

### Example 1: RESTful E-Commerce API Design

**Domain:** Online store with products, categories, shopping cart, orders, payments, shipments, reviews.

**Resource Model:**

```
/categories
/categories/{categoryId}
/categories/{categoryId}/products
/products
/products/{productId}
/products/{productId}/reviews
/products/{productId}/variants
/carts/{cartId}
/carts/{cartId}/items
/carts/{cartId}/items/{itemId}
/orders
/orders/{orderId}
/orders/{orderId}/items
/orders/{orderId}/shipments
/orders/{orderId}/invoices
/payments
/payments/{paymentId}
/shipments
/shipments/{shipmentId}
/reviews
/users/{userId}/orders
/users/{userId}/reviews
/users/{userId}/cart
```

**Key Endpoints:**

```yaml
# Products
GET    /products?category=electronics&sort=-price&page=1&per_page=20
GET    /products/{productId}
POST   /products
PUT    /products/{productId}
PATCH  /products/{productId}
DELETE /products/{productId}

# Cart operations
GET    /carts/{cartId}
POST   /carts/{cartId}/items
PATCH  /carts/{cartId}/items/{itemId}
DELETE /carts/{cartId}/items/{itemId}
POST   /carts/{cartId}/checkout

# Order lifecycle
POST   /orders/{orderId}/cancel
POST   /orders/{orderId}/return
GET    /orders/{orderId}/tracking

# Payments
POST   /payments
GET    /payments/{paymentId}
POST   /payments/{paymentId}/refund

# Reviews
POST   /products/{productId}/reviews
GET    /products/{productId}/reviews?sort=-createdAt&rating=4
```

**Product Response:**

```yaml
GET /products/prod_widget_123
Response:
{
  "id": "prod_widget_123",
  "sku": "WGT-001-BLK",
  "name": "Super Widget Black",
  "slug": "super-widget-black",
  "description": "A high-quality black widget for all your widget needs.",
  "shortDescription": "Premium black widget",
  "category": {
    "id": "cat_el_001",
    "name": "Electronics",
    "slug": "electronics"
  },
  "brand": "WidgetCo",
  "price": 2999,
  "compareAtPrice": 3999,
  "currency": "USD",
  "images": [
    {
      "url": "https://cdn.example.com/products/widget-black-1.jpg",
      "alt": "Super Widget Black - Front view",
      "order": 1
    }
  ],
  "variants": [
    {
      "id": "var_001",
      "name": "Black / Small",
      "sku": "WGT-001-BLK-S",
      "price": 2999,
      "inStock": true,
      "quantity": 50,
      "attributes": { "color": "Black", "size": "Small" }
    }
  ],
  "attributes": {
    "color": ["Black", "White", "Red"],
    "size": ["Small", "Medium", "Large"],
    "material": "Aluminum"
  },
  "tags": ["featured", "new-arrival", "best-seller"],
  "averageRating": 4.5,
  "reviewCount": 128,
  "inStock": true,
  "featured": true,
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-05-27T08:30:00Z",
  "_links": {
    "self": { "href": "/products/prod_widget_123" },
    "category": { "href": "/categories/cat_el_001" },
    "reviews": { "href": "/products/prod_widget_123/reviews" },
    "variants": { "href": "/products/prod_widget_123/variants" }
  }
}
```

**Cart Checkout Flow:**

```yaml
# Step 1: Add items to cart
POST /carts/cart_abc/items
{
  "productId": "prod_widget_123",
  "variantId": "var_001",
  "quantity": 2
}

# Step 2: View cart
GET /carts/cart_abc
{
  "id": "cart_abc",
  "items": [
    {
      "id": "item_001",
      "productId": "prod_widget_123",
      "productName": "Super Widget Black",
      "variantName": "Black / Small",
      "unitPrice": 2999,
      "quantity": 2,
      "totalPrice": 5998,
      "imageUrl": "https://cdn.example.com/products/widget-black-1.jpg"
    }
  ],
  "subtotal": 5998,
  "shipping": 500,
  "tax": 599.80,
  "total": 7097.80,
  "currency": "USD",
  "itemCount": 2
}

# Step 3: Checkout
POST /carts/cart_abc/checkout
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "US"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "US"
  },
  "paymentMethodId": "pm_card_visa",
  "email": "alice@example.com",
  "notes": "Leave at front door"
}

# Step 4: Order created
Response: 201 Created
Location: /orders/ord_new_123
{
  "id": "ord_new_123",
  "orderNumber": "ORD-2026-0054321",
  "status": "pending_payment",
  "total": 7097.80,
  "currency": "USD",
  "paymentUrl": "https://payments.example.com/pay/ord_new_123"
}
```

**Order States:**

```
cart --> pending_payment --> processing --> shipped --> delivered
            |                  |
         payment_failed    cancelled
            |                  |
         retry              return_requested --> refunded
```

### Example 2: GraphQL Social Media API

**Schema Design:**

```graphql
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

type Query {
  # Feed
  feed(first: Int!, after: String, filter: FeedFilter): PostConnection!
  post(id: ID!): Post

  # Users
  user(id: ID!): User
  users(first: Int, after: String): UserConnection!
  search(query: String!, first: Int!): [SearchResult!]!

  # Trending
  trendingTopics: [TrendingTopic!]!
  trendingPosts(first: Int!): [Post!]!
}

type Mutation {
  # Auth
  signUp(input: SignUpInput!): SignUpPayload!
  login(input: LoginInput!): LoginPayload!
  logout: Boolean!

  # Posts
  createPost(input: CreatePostInput!): CreatePostPayload!
  updatePost(input: UpdatePostInput!): UpdatePostPayload!
  deletePost(id: ID!): DeletePostPayload!
  likePost(id: ID!): LikePostPayload!
  unlikePost(id: ID!): UnlikePostPayload!

  # Comments
  addComment(input: AddCommentInput!): AddCommentPayload!
  deleteComment(id: ID!): DeleteCommentPayload!

  # Relationships
  followUser(userId: ID!): FollowUserPayload!
  unfollowUser(userId: ID!): UnfollowUserPayload!
  blockUser(userId: ID!): BlockUserPayload!

  # Sharing
  sharePost(postId: ID!, platform: SharePlatform!): SharePostPayload!
  reportContent(input: ReportInput!): ReportContentPayload!
}

type Subscription {
  newFeedPosts: Post!
  postLiked(postId: ID!): Post!
  newComments(postId: ID!): Comment!
  notifications: Notification!
  userOnlineStatus(userId: ID!): UserOnlineStatus!
  typingIndicator(conversationId: ID!): TypingIndicator!
}
```

**Type Definitions:**

```graphql
type User implements Node {
  id: ID!
  username: String!
  displayName: String!
  bio: String
  avatarUrl: URL
  coverUrl: URL
  followerCount: Int!
  followingCount: Int!
  postCount: Int!
  isVerified: Boolean!
  isFollowedByMe: Boolean!
  website: URL
  location: String
  joinedAt: DateTime!
  posts(first: Int!, after: String): PostConnection!
  followers(first: Int!, after: String): UserConnection!
  following(first: Int!, after: String): UserConnection!
  savedPosts(first: Int!, after: String): PostConnection!
}

type Post implements Node {
  id: ID!
  author: User!
  content: String!
  images: [Image!]
  video: Video
  link: LinkPreview
  hashtags: [String!]
  mentions: [User!]
  likeCount: Int!
  commentCount: Int!
  shareCount: Int!
  isLikedByMe: Boolean!
  isSavedByMe: Boolean!
  isEdited: Boolean!
  visibility: PostVisibility!
  createdAt: DateTime!
  updatedAt: DateTime!
  comments(first: Int!, after: String): CommentConnection!
  likes(first: Int!, after: String): UserConnection!
}

type Comment implements Node {
  id: ID!
  post: Post!
  author: User!
  content: String!
  likeCount: Int!
  isLikedByMe: Boolean!
  parentComment: Comment
  replies(first: Int!, after: String): CommentConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Notification implements Node {
  id: ID!
  type: NotificationType!
  actor: User!
  post: Post
  comment: Comment
  read: Boolean!
  createdAt: DateTime!
}

enum NotificationType {
  LIKE
  COMMENT
  FOLLOW
  MENTION
  SHARE
  SYSTEM
}

type TrendingTopic {
  name: String!
  postCount: Int!
  category: String
}
```

**Mutation Examples:**

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    post {
      id
      content
      hashtags
      createdAt
    }
    errors {
      ... on ValidationError {
        field
        message
      }
    }
  }
}

# Variables:
{
  "input": {
    "content": "Hello world! #firstPost",
    "hashtags": ["firstPost", "hello"],
    "visibility": "PUBLIC",
    "images": [
      {
        "url": "https://cdn.example.com/uploads/img1.jpg",
        "altText": "A beautiful sunset"
      }
    ]
  }
}
```

**Resolver with DataLoader:**

```javascript
const resolvers = {
  Query: {
    feed: async (_, { first, after, filter }, { dataSources, auth }) => {
      const userId = auth.userId;
      const following = await dataSources.userAPI.getFollowing(userId);
      return dataSources.postAPI.getFeed({
        userIds: following,
        first,
        after,
        filter: filter || {},
      });
    },
    post: async (_, { id }, { dataSources }) => {
      return dataSources.postAPI.getPost(id);
    },
    search: async (_, { query, first }, { dataSources }) => {
      const [users, posts] = await Promise.all([
        dataSources.userAPI.searchUsers(query, first),
        dataSources.postAPI.searchPosts(query, first),
      ]);
      return [...users, ...posts];
    },
  },
  Mutation: {
    createPost: async (_, { input }, { dataSources, auth }) => {
      if (!auth.isAuthenticated) {
        return { post: null, errors: [{ message: 'Not authenticated', code: 'AUTH_REQUIRED' }] };
      }
      const post = await dataSources.postAPI.createPost({ ...input, userId: auth.userId });
      // Publish to subscription
      dataSources.pubsub.publish('NEW_FEED_POST', { newFeedPosts: post });
      return { post, errors: [] };
    },
    likePost: async (_, { id }, { dataSources, auth }) => {
      const post = await dataSources.postAPI.likePost({ postId: id, userId: auth.userId });
      dataSources.pubsub.publish('POST_LIKED', { postLiked: post });
      return { post };
    },
  },
  Post: {
    author: (post, _, { loaders }) => loaders.users.load(post.authorId),
    comments: (post, args, { loaders }) => loaders.comments.load({ postId: post.id, ...args }),
    isLikedByMe: (post, _, { auth, loaders }) => loaders.likes.load({ postId: post.id, userId: auth.userId }),
  },
  User: {
    posts: (user, args, { loaders }) => loaders.userPosts.load({ userId: user.id, ...args }),
    followers: (user, args, { loaders }) => loaders.followers.load({ userId: user.id, ...args }),
  },
  SearchResult: {
    __resolveType: (obj) => {
      return obj.__typename === 'User' ? 'User' : 'Post';
    },
  },
};
```

### Example 3: gRPC Payment Processing Service

**Proto Definition:**

```protobuf
syntax = "proto3";
package payments.v1;
option go_package = "github.com/company/api/payments/v1;paymentsv1";

import "google/protobuf/timestamp.proto";
import "google/protobuf/field_mask.proto";
import "google/api/annotations.proto";
import "google/rpc/status.proto";

// PaymentService handles payment processing
service PaymentService {
  // Process a payment
  rpc ProcessPayment(ProcessPaymentRequest) returns (ProcessPaymentResponse) {
    option (google.api.http) = {
      post: "/v1/payments:process"
      body: "*"
    };
  }

  // Get payment details
  rpc GetPayment(GetPaymentRequest) returns (Payment) {
    option (google.api.http) = {
      get: "/v1/payments/{payment_id}"
    };
  }

  // List payments with filtering
  rpc ListPayments(ListPaymentsRequest) returns (ListPaymentsResponse) {
    option (google.api.http) = {
      get: "/v1/payments"
    };
  }

  // Refund a payment
  rpc RefundPayment(RefundPaymentRequest) returns (RefundPaymentResponse) {
    option (google.api.http) = {
      post: "/v1/payments/{payment_id}:refund"
      body: "*"
    };
  }

  // Server-streaming: Monitor payment status changes
  rpc MonitorPayment(MonitorPaymentRequest) returns (stream PaymentStatusChange);

  // Bidirectional streaming: Process batch of payments
  rpc BatchProcess(stream ProcessPaymentRequest) returns (stream ProcessPaymentResponse);
}

message Payment {
  string payment_id = 1;
  string order_id = 2;
  int64 amount_cents = 3;
  string currency = 4;           // ISO 4217
  PaymentStatus status = 5;
  PaymentMethod method = 6;
  string description = 7;
  map<string, string> metadata = 8;
  google.protobuf.Timestamp created_at = 9;
  google.protobuf.Timestamp updated_at = 10;
  google.protobuf.Timestamp completed_at = 11;
  string failure_reason = 12;    // Only when status is FAILED
  repeated Refund refunds = 13;
}

enum PaymentStatus {
  PAYMENT_STATUS_UNSPECIFIED = 0;
  PAYMENT_STATUS_PENDING = 1;
  PAYMENT_STATUS_PROCESSING = 2;
  PAYMENT_STATUS_SUCCEEDED = 3;
  PAYMENT_STATUS_FAILED = 4;
  PAYMENT_STATUS_REFUNDED = 5;
  PAYMENT_STATUS_PARTIALLY_REFUNDED = 6;
}

enum PaymentMethod {
  PAYMENT_METHOD_UNSPECIFIED = 0;
  PAYMENT_METHOD_CREDIT_CARD = 1;
  PAYMENT_METHOD_DEBIT_CARD = 2;
  PAYMENT_METHOD_BANK_TRANSFER = 3;
  PAYMENT_METHOD_DIGITAL_WALLET = 4;
  PAYMENT_METHOD_CRYPTO = 5;
}

message Refund {
  string refund_id = 1;
  int64 amount_cents = 2;
  string reason = 3;
  RefundStatus status = 4;
  google.protobuf.Timestamp created_at = 5;
}

enum RefundStatus {
  REFUND_STATUS_UNSPECIFIED = 0;
  REFUND_STATUS_PENDING = 1;
  REFUND_STATUS_SUCCEEDED = 2;
  REFUND_STATUS_FAILED = 3;
}

message ProcessPaymentRequest {
  string order_id = 1;
  int64 amount_cents = 2;
  string currency = 3;
  string source = 4;             // Token from payment provider
  string description = 5;
  string idempotency_key = 6;    // Prevents duplicate processing
  map<string, string> metadata = 7;
}

message ProcessPaymentResponse {
  Payment payment = 1;
  string client_secret = 2;      // For 3D Secure if needed
}

message GetPaymentRequest {
  string payment_id = 1;
  google.protobuf.FieldMask field_mask = 2;
}

message ListPaymentsRequest {
  int32 page_size = 1;
  string page_token = 2;
  string order_id = 3;
  PaymentStatus status = 4;
  string sort_by = 5;
}

message ListPaymentsResponse {
  repeated Payment payments = 1;
  string next_page_token = 2;
  int32 total_count = 3;
}

message RefundPaymentRequest {
  string payment_id = 1;
  int64 amount_cents = 2;        // Partial refund if less than full amount
  string reason = 3;
  string idempotency_key = 4;
}

message RefundPaymentResponse {
  Payment payment = 1;
  Refund refund = 2;
}

message MonitorPaymentRequest {
  string payment_id = 1;
}

message PaymentStatusChange {
  string payment_id = 1;
  PaymentStatus old_status = 2;
  PaymentStatus new_status = 3;
  google.protobuf.Timestamp timestamp = 4;
  string reason = 5;
}
```

**Server Implementation (Node.js):**

```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('proto/payments/v1/payments.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDef).payments.v1;

const server = new grpc.Server();

server.addService(proto.PaymentService.service, {
  ProcessPayment: async (call, callback) => {
    try {
      const { order_id, amount_cents, currency, source, idempotency_key } = call.request;

      // Check idempotency
      const existing = await idempotencyCache.get(idempotency_key);
      if (existing) {
        return callback(null, existing);
      }

      // Validate
      if (amount_cents <= 0) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'amount_cents must be positive',
        });
      }

      // Process with payment provider
      const payment = await paymentProvider.charge({
        amount: amount_cents,
        currency,
        source,
        description: `Order ${order_id}`,
      });

      const response = { payment, client_secret: payment.clientSecret };

      // Cache idempotency
      await idempotencyCache.set(idempotency_key, response, 86400);

      callback(null, response);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  GetPayment: async (call, callback) => {
    const { payment_id, field_mask } = call.request;
    const payment = await db.payments.findByPk(payment_id);
    if (!payment) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: `Payment ${payment_id} not found`,
      });
    }
    callback(null, payment);
  },

  ListPayments: async (call, callback) => {
    const { page_size, page_token, order_id, status } = call.request;
    // Pagination logic
    const payments = await db.payments.findAll({ limit: page_size || 20, offset: ... });
    callback(null, {
      payments,
      next_page_token: payments.length === page_size ? generateToken() : '',
      total_count: await db.payments.count(),
    });
  },

  RefundPayment: async (call, callback) => {
    const { payment_id, amount_cents, reason, idempotency_key } = call.request;

    const existing = await idempotencyCache.get(idempotency_key);
    if (existing) return callback(null, existing);

    const payment = await db.payments.findByPk(payment_id);
    if (!payment) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'Payment not found' });
    }
    if (payment.status !== 'SUCCEEDED') {
      return callback({ code: grpc.status.FAILED_PRECONDITION, message: 'Payment not succeeded' });
    }

    const refund = await paymentProvider.refund(payment_id, amount_cents, reason);
    const response = { payment: updatedPayment, refund };

    await idempotencyCache.set(idempotency_key, response, 86400);
    callback(null, response);
  },

  MonitorPayment: (call) => {
    const { payment_id } = call.request;
    // Subscribe to payment status changes
    const subscription = paymentEventBus.subscribe(payment_id, (event) => {
      call.write({
        payment_id: event.paymentId,
        old_status: event.oldStatus,
        new_status: event.newStatus,
        timestamp: event.timestamp,
        reason: event.reason,
      });
    });

    call.on('cancelled', () => {
      subscription.unsubscribe();
    });
  },

  BatchProcess: (call) => {
    let results = [];

    call.on('data', async (request) => {
      try {
        const payment = await paymentProvider.charge({
          amount: request.amount_cents,
          currency: request.currency,
          source: request.source,
        });
        call.write({ payment, client_secret: payment.clientSecret });
      } catch (error) {
        call.write({
          payment: null,
          error: { code: 'PROCESSING_FAILED', message: error.message },
        });
      }
    });

    call.on('end', () => {
      call.end();
    });
  },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Payment gRPC server running on port 50051');
  server.start();
});
```



### Example 4: API Versioning Strategy (Full Lifecycle)

**Scenario:** Users API evolving from v1 to v2 to v3 with a 2-year deprecation window.

**v1 (Original):**

```yaml
GET /v1/users
Response:
{
  "users": [
    {
      "id": 123,
      "username": "alice",
      "full_name": "Alice Smith",
      "email_address": "alice@example.com"
    }
  ],
  "total": 1
}
```

**v2 (First evolution - breaking changes):**

```yaml
GET /v2/users
Response:
{
  "data": [
    {
      "id": "usr_abc123",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6InVzcl8xNDMifQ",
    "hasMore": false,
    "limit": 20
  }
}

# Changes from v1:
# - Numeric IDs -> prefixed strings (usr_...)
# - snake_case -> camelCase
# - Wrapped response -> data + pagination envelope
# - Offset pagination -> cursor-based
```

**Migration Timeline:**

```
Q1 2025: v1 released
Q1 2026: v2 released, v1 marked stable
Q2 2026: v1 deprecation announced
Q3 2026: Deprecation headers added to v1
Q4 2026: v1 sunset begins (502 for some endpoints)
Q1 2027: v1 fully retired
Q2 2027: v3 planning begins
```

**v2 to v3 Migration (additive evolution):**

```yaml
# v2.1: Add phone field (backward compatible)
GET /v2/users/usr_abc123
Response:
{
  "id": "usr_abc123",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "phone": "+1234567890",  # NEW
  "createdAt": "2026-01-15T10:00:00Z"
}

# v2.2: Add PATCH endpoint
PATCH /v2/users/usr_abc123
{
  "name": "Alice Jones"   # Partial update
}

# v2.3: Add include parameter
GET /v2/users/usr_abc123?include=orders
{
  "id": "usr_abc123",
  ...
  "orders": [...]  # NEW included resource
}
```

### Example 5: OpenAPI to SDK Pipeline

**End-to-end workflow for generating client SDKs from OpenAPI spec.**

**Step 1: Write spec with SDK generation in mind:**

```yaml
openapi: "3.1.0"
info:
  title: "Users API"
  version: "2.1.0"
  x-sdk-config:
    packageName: "users-sdk"
    languages: ["typescript", "python", "go", "java", "ruby"]

paths:
  /users:
    get:
      operationId: "listUsers"    # Used as method name in SDK
      summary: "List all users"
      parameters:
        - name: "status"
          in: "query"
          schema:
            type: "string"
            enum: ["active", "inactive", "pending"]
            x-codegen-ignore: false
            x-codegen-name: "userStatus"  # Override parameter name in SDK
      responses:
        "200":
          description: "Successful response"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/User"
                  pagination:
                    $ref: "#/components/schemas/Pagination"
```

**Step 2: Generate SDKs:**

```bash
# Install generator
npm install @openapitools/openapi-generator-cli -g

# OpenAPI Generator config
cat > config.yaml << EOF
generatorName: typescript-axios
npmName: "@company/users-sdk"
npmVersion: "2.1.0"
supportsES6: true
withInterfaces: true
useSingleRequestParameter: true
stringEnums: true
typescriptThreePlus: true
EOF

# Generate TypeScript SDK
openapi-generator-cli generate \
  -i specs/users.yaml \
  -g typescript-axios \
  -o sdks/typescript \
  -c config.yaml

# Generate Python SDK
openapi-generator-cli generate \
  -i specs/users.yaml \
  -g python \
  -o sdks/python \
  --package-name company_users_sdk \
  --additional-properties=packageVersion=2.1.0

# Generate Go SDK
openapi-generator-cli generate \
  -i specs/users.yaml \
  -g go \
  -o sdks/go \
  --package-name usersapi \
  --additional-properties=packageVersion=2.1.0

# Generate Java SDK
openapi-generator-cli generate \
  -i specs/users.yaml \
  -g java \
  -o sdks/java \
  --library retrofit2 \
  --additional-properties=groupId=com.company,artifactId=users-sdk,artifactVersion=2.1.0
```

**Step 3: Publish to package registries:**

```bash
# TypeScript
cd sdks/typescript
npm publish --access public

# Python
cd sdks/python
python setup.py sdist bdist_wheel
twine upload dist/*

# Go
cd sdks/go
git tag v2.1.0
git push origin v2.1.0
```

**Step 4: Generated SDK usage:**

```typescript
// TypeScript SDK
import { UsersApi, Configuration } from '@company/users-sdk';

const config = new Configuration({
  basePath: 'https://api.example.com/v2',
  apiKey: 'sk_live_abc123',
});

const api = new UsersApi(config);

// List users
const response = await api.listUsers({
  status: 'active',
  pageSize: 20,
});
console.log(response.data.data);

// Create user
const newUser = await api.createUser({
  createUserRequest: {
    name: 'Alice Smith',
    email: 'alice@example.com',
  },
});
console.log(newUser.data);
```

### Example 6: Pact Contract Testing in Microservices

**Scenario:** Three services: FrontendApp (consumer), UsersAPI (provider), OrdersAPI (provider).

**Consumer Test (FrontendApp -> UsersAPI):**

```javascript
// FrontendApp consumer contract test
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, term, eachLike } = MatchersV3;

const usersProvider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'UsersAPI',
});

const ordersProvider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'OrdersAPI',
});

describe('FrontendApp contracts', () => {
  describe('UsersAPI contracts', () => {
    it('fetches user profile on login', async () => {
      usersProvider
        .given('user exists with email alice@example.com')
        .uponReceiving('a request for user profile by email')
        .withRequest({
          method: 'GET',
          path: '/users/profile',
          query: { email: 'alice@example.com' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            id: like('usr_123'),
            name: like('Alice Smith'),
            email: term({ generate: 'alice@example.com', matcher: '\\S+@\\S+\\.\\S+' }),
            avatarUrl: like('https://cdn.example.com/avatars/usr_123.png'),
            preferences: {
              language: term({ generate: 'en', matcher: '[a-z]{2}' }),
              timezone: like('America/New_York'),
              notifications: {
                email: like(true),
                sms: like(false),
                push: like(true),
              },
            },
          },
        });
    });

    it('returns validation error for invalid email format', async () => {
      usersProvider
        .given('API is operational')
        .uponReceiving('a request with invalid email format')
        .withRequest({
          method: 'POST',
          path: '/users',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: {
            name: like('New User'),
            email: term({ generate: 'not-an-email', matcher: '.*' }),
          },
        })
        .willRespondWith({
          status: 422,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/validation-error'),
            title: like('Validation Error'),
            status: 422,
            errors: eachLike({
              field: like('email'),
              message: like('Must be a valid email address'),
              code: like('INVALID_EMAIL_FORMAT'),
            }),
          },
        });
    });
  });

  describe('OrdersAPI contracts', () => {
    it('fetches user orders', async () => {
      ordersProvider
        .given('user has orders with status shipped')
        .uponReceiving('a request for user orders')
        .withRequest({
          method: 'GET',
          path: '/users/usr_123/orders',
          query: { status: 'shipped', limit: '10' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data: eachLike({
              id: like('ord_123'),
              orderNumber: like('ORD-2026-001234'),
              status: term({ generate: 'shipped', matcher: 'shipped|delivered|processing' }),
              total: like(4897),
              currency: term({ generate: 'USD', matcher: 'USD|EUR|GBP' }),
              itemCount: like(3),
              createdAt: like('2026-05-25T14:30:00Z'),
            }),
            pagination: {
              cursor: like('eyJpZCI6Im9yZF8xMjMifQ'),
              hasMore: like(true),
              limit: like(10),
            },
          },
        });
    });
  });
});
```

**Provider Verification (UsersAPI):**

```javascript
// UsersAPI provider verification
const { Verifier } = require('@pact-foundation/pact');

describe('UsersAPI Pact verification', () => {
  it('satisfies all consumer contracts', async () => {
    const opts = {
      provider: 'UsersAPI',
      providerBaseUrl: 'http://localhost:3000',
      pactBrokerUrl: 'https://pact-broker.example.com',
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      publishVerificationResult: true,
      providerVersion: '2.0.0',
      // Tag the provider version
      tags: ['latest'],
      // State handlers for provider states
      stateHandlers: {
        'user exists with email alice@example.com': async () => {
          await seedDatabase({
            users: [{ id: 'usr_123', name: 'Alice Smith', email: 'alice@example.com' }],
          });
        },
        'API is operational': async () => {
          await resetDatabase();
        },
        'no user exists with email': async () => {
          await clearUsers();
        },
        'a user exists with ID usr_123': async () => {
          await seedDatabase({
            users: [{ id: 'usr_123', name: 'Alice Smith', email: 'alice@example.com' }],
          });
        },
        'no user exists with ID usr_nonexistent': async () => {
          await ensureUserNotExists('usr_nonexistent');
        },
        'a user can be created': async () => {
          await resetDatabase();
        },
      },
      // Request filters for adding auth headers
      requestFilter: (req, res, next) => {
        req.headers['Authorization'] = 'Bearer valid_token';
        next();
      },
    };

    await new Verifier(opts).verifyProvider();
  }, 30000);
});
```

**Contracts in CI/CD Pipeline:**

```yaml
# Complete pipeline with can-i-deploy
stages:
  - test
  - pact-publish
  - pact-verify
  - can-i-deploy
  - deploy

frontend-test:
  stage: test
  script:
    - cd frontend
    - npm ci
    - npm test -- --testPathPattern=pact
    - npm run pact:publish
  artifacts:
    paths:
      - frontend/pacts/

pact-publish:
  stage: pact-publish
  script:
    - npx pact-broker publish ./pacts \
      --consumer-app-version $CI_COMMIT_SHA \
      --tag $CI_COMMIT_BRANCH

users-api-verify:
  stage: pact-verify
  script:
    - cd users-api
    - npm ci
    - npx pact-broker can-i-deploy \
      --pacticipant UsersAPI --version latest
    - npm run pact:verify
  needs: [pact-publish]

orders-api-verify:
  stage: pact-verify
  script:
    - cd orders-api
    - npm ci
    - npx pact-broker can-i-deploy \
      --pacticipant OrdersAPI --version latest
    - npm run pact:verify
  needs: [pact-publish]

can-i-deploy:
  stage: can-i-deploy
  script:
    - npx pact-broker can-i-deploy \
      --pacticipant FrontendApp --version $CI_COMMIT_SHA \
      --pacticipant UsersAPI --version latest \
      --pacticipant OrdersAPI --version latest \
      --to-environment production
  only:
    - main
  needs: [users-api-verify, orders-api-verify]

deploy-frontend:
  stage: deploy
  script: deploy-frontend.sh
  only:
    - main
  needs: [can-i-deploy]

deploy-users-api:
  stage: deploy
  script: deploy-users-api.sh
  only:
    - main
  needs: [can-i-deploy]

deploy-orders-api:
  stage: deploy
  script: deploy-orders-api.sh
  only:
    - main
  needs: [can-i-deploy]
```

### Example 7: API Security Implementation (OAuth2 + JWT + Rate Limiting)

**OAuth2 Authorization Server Configuration:**

```yaml
# OAuth2 server configuration
auth_server:
  issuer: "https://auth.example.com"
  token_endpoint: "https://auth.example.com/oauth/token"
  authorization_endpoint: "https://auth.example.com/oauth/authorize"
  jwks_uri: "https://auth.example.com/.well-known/jwks.json"
  scopes:
    - name: "users:read"
      description: "Read user profiles"
    - name: "users:write"
      description: "Create and update users"
    - name: "users:delete"
      description: "Delete users"
    - name: "orders:read"
      description: "Read order information"
    - name: "orders:write"
      description: "Create and update orders"
    - name: "admin"
      description: "Full administrative access"
  clients:
    - client_id: "web_app"
      client_secret: "sec_web_..."   # Hashed
      grant_types: ["authorization_code", "refresh_token"]
      redirect_uris: ["https://app.example.com/callback"]
      scopes: ["users:read", "orders:read", "orders:write"]
    - client_id: "mobile_app"
      client_secret: "sec_mob_..."   # Hashed
      grant_types: ["authorization_code", "refresh_token", "pkce"]
      redirect_uris: ["myapp://callback", "https://app.example.com/mobile-callback"]
      scopes: ["users:read", "orders:read"]
    - client_id: "internal_service"
      client_secret: "sec_svc_..."   # Hashed
      grant_types: ["client_credentials"]
      scopes: ["users:read", "users:write", "admin"]
  token_settings:
    access_token_ttl: 3600           # 1 hour
    refresh_token_ttl: 2592000       # 30 days
    id_token_ttl: 3600               # 1 hour
    signing_algorithm: "RS256"
    key_rotation_days: 90
```

**JWT Token Validation Middleware:**

```javascript
// Express middleware for JWT validation
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const jwks = jwksClient({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 86400000, // 24 hours
});

const AUTH_HEADER_REGEX = /^Bearer\s+(.+)$/i;

async function validateAccessToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded) throw new Error('Invalid token');
  const key = await jwks.getSigningKey(decoded.header.kid);
  return jwt.verify(token, key.getPublicKey(), {
    algorithms: ['RS256'],
    issuer: 'https://auth.example.com',
    audience: 'https://api.example.com',
    clockTolerance: 30,
  });
}

// Middleware
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' },
    });
  }

  const match = authHeader.match(AUTH_HEADER_REGEX);
  if (!match) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid Authorization format' },
    });
  }

  try {
    const payload = await validateAccessToken(match[1]);
    req.auth = {
      userId: payload.sub,
      scopes: payload.scope?.split(' ') || [],
      roles: payload.roles || [],
      tenant: payload.tenant,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
      });
    }
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    });
  }
}

// Scope authorization middleware
function requireScope(...requiredScopes) {
  return (req, res, next) => {
    const hasScope = requiredScopes.some(scope => req.auth.scopes.includes(scope));
    if (!hasScope) {
      return res.status(403).json({
        error: {
          code: 'SCOPE_INSUFFICIENT',
          message: `Required one of scopes: ${requiredScopes.join(', ')}`,
        },
      });
    }
    next();
  };
}

// Role authorization middleware
function requireRole(...roles) {
  return (req, res, next) => {
    const hasRole = roles.some(role => req.auth.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Required one of roles: ${roles.join(', ')}`,
        },
      });
    }
    next();
  };
}

// Owner check middleware
function requireOwnership(paramName = 'userId') {
  return (req, res, next) => {
    const resourceOwnerId = req.params[paramName];
    if (req.auth.userId !== resourceOwnerId && !req.auth.roles.includes('admin')) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'You do not own this resource' },
      });
    }
    next();
  };
}
```

**Rate Limiting Middleware:**

```javascript
// Rate limiter with Redis
const Redis = require('ioredis');
const redis = new Redis();

const RATE_LIMIT_TIERS = {
  free: { requests: 10, window: 60, burst: 20 },
  basic: { requests: 100, window: 60, burst: 200 },
  pro: { requests: 1000, window: 60, burst: 2000 },
  enterprise: { requests: 10000, window: 60, burst: 20000 },
};

async function rateLimiter(req, res, next) {
  const clientId = req.auth?.userId || req.ip;
  const tier = req.auth?.tier || 'free';
  const limits = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.free;

  // Sliding window rate limit
  const now = Date.now();
  const windowStart = now - (limits.window * 1000);
  const key = `ratelimit:${clientId}:${req.path}`;

  const pipeline = redis.pipeline();
  pipeline.zadd(key, now, `${now}:${Math.random()}`);
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zcard(key);
  pipeline.expire(key, limits.window);
  pipeline.ttl(key);

  const results = await pipeline.exec();
  const requestCount = results[2][1];

  // Set rate limit headers
  const remaining = Math.max(0, limits.requests - requestCount);
  const resetAt = Math.ceil((now + (limits.window * 1000)) / 1000);

  res.setHeader('RateLimit-Limit', limits.requests);
  res.setHeader('RateLimit-Remaining', remaining);
  res.setHeader('RateLimit-Reset', resetAt);

  if (requestCount > limits.requests + limits.burst) {
    const retryAfter = Math.ceil(limits.window - ((now - windowStart) / 1000));
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
        retryAfter,
      },
    });
  }

  next();
}

// Apply middleware chain
app.use('/api/v2', authMiddleware, rateLimiter);
app.get('/api/v2/users', requireScope('users:read'), usersController.list);
app.post('/api/v2/users', requireScope('users:write'), usersController.create);
app.get('/api/v2/users/:userId', requireScope('users:read'), requireOwnership('userId'), usersController.get);
app.put('/api/v2/users/:userId', requireScope('users:write'), requireOwnership('userId'), usersController.update);
app.delete('/api/v2/users/:userId', requireScope('users:delete'), requireRole('admin'), usersController.delete);
```

### Example 8: AsyncAPI Event-Driven Architecture

**Event Bus Design with Kafka:**

```yaml
asyncapi: "2.6.0"
info:
  title: "E-Commerce Event Bus"
  version: "2.0.0"
  description: "Central event bus for all e-commerce domain events"

servers:
  production:
    url: "kafka://events.example.com:9092"
    protocol: "kafka"
    description: "Production Kafka cluster"
    security:
      - saslScram: []

channels:
  order.events:
    description: "Order lifecycle events"
    parameters:
      orderId:
        description: "Order identifier"
        schema:
          type: "string"
    subscribe:
      operationId: "onOrderEvent"
      message:
        oneOf:
          - $ref: "#/components/messages/OrderCreated"
          - $ref: "#/components/messages/OrderShipped"
          - $ref: "#/components/messages/OrderDelivered"
          - $ref: "#/components/messages/OrderCancelled"
    publish:
      operationId: "emitOrderEvent"
      message:
        $ref: "#/components/messages/OrderEvent"

  payment.events:
    description: "Payment lifecycle events"
    subscribe:
      operationId: "onPaymentEvent"
      message:
        oneOf:
          - $ref: "#/components/messages/PaymentCompleted"
          - $ref: "#/components/messages/PaymentFailed"
          - $ref: "#/components/messages/PaymentRefunded"

  notification.events:
    description: "Notification events"
    publish:
      operationId: "sendNotification"
      message:
        $ref: "#/components/messages/NotificationRequest"

components:
  messages:
    OrderCreated:
      name: "OrderCreated"
      title: "Order Created"
      summary: "Emitted when a new order is placed"
      contentType: "application/avro"
      payload:
        type: "record"
        name: "OrderCreatedEvent"
        fields:
          - name: "eventId"
            type: "string"
          - name: "eventType"
            type: "string"
          - name: "timestamp"
            type: "long"
            logicalType: "timestamp-millis"
          - name: "orderId"
            type: "string"
          - name: "customerId"
            type: "string"
          - name: "totalAmount"
            type: "double"
          - name: "currency"
            type: "string"
          - name: "items"
            type: "array"
            items:
              type: "record"
              name: "OrderItem"
              fields:
                - name: "productId"
                  type: "string"
                - name: "quantity"
                  type: "int"
                - name: "unitPrice"
                  type: "double"
          - name: "shippingAddress"
            type: "record"
            name: "Address"
            fields:
              - name: "street"
                type: "string"
              - name: "city"
                type: "string"
              - name: "zipCode"
                type: "string"
              - name: "country"
                type: "string"

    OrderShipped:
      name: "OrderShipped"
      title: "Order Shipped"
      payload:
        type: "record"
        name: "OrderShippedEvent"
        fields:
          - name: "eventId"
            type: "string"
          - name: "eventType"
            type: "string"
          - name: "timestamp"
            type: "long"
            logicalType: "timestamp-millis"
          - name: "orderId"
            type: "string"
          - name: "carrier"
            type: "string"
          - name: "trackingNumber"
            type: "string"
          - name: "estimatedDelivery"
            type: "long"
            logicalType: "timestamp-millis"

    PaymentCompleted:
      name: "PaymentCompleted"
      title: "Payment Completed"
      payload:
        type: "record"
        name: "PaymentCompletedEvent"
        fields:
          - name: "eventId"
            type: "string"
          - name: "eventType"
            type: "string"
          - name: "timestamp"
            type: "long"
          - name: "paymentId"
            type: "string"
          - name: "orderId"
            type: "string"
          - name: "amount"
            type: "double"
          - name: "currency"
            type: "string"
          - name: "paymentMethod"
            type: "string"

    NotificationRequest:
      name: "NotificationRequest"
      title: "Notification Request"
      payload:
        type: "record"
        name: "NotificationRequestEvent"
        fields:
          - name: "eventId"
            type: "string"
          - name: "notificationType"
            type: "string"
          - name: "userId"
            type: "string"
          - name: "channels"
            type: "array"
            items:
              type: "string"
          - name: "template"
            type: "string"
          - name: "data"
            type: "map"
            values:
              type: "string"

  securitySchemes:
    saslScram:
      type: "scramSha256"
      description: "SASL/SCRAM-SHA-256 authentication"
```

**Kafka Producer/Consumer Implementation:**

```python
# Kafka event producer
from confluent_kafka import Producer
import json
import uuid
from datetime import datetime

class EventProducer:
    def __init__(self, bootstrap_servers):
        self.producer = Producer({
            'bootstrap.servers': bootstrap_servers,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'SCRAM-SHA-256',
            'sasl.username': 'events_producer',
            'sasl.password': '***',
        })

    def publish_order_created(self, order):
        event = {
            'eventId': str(uuid.uuid4()),
            'eventType': 'OrderCreated',
            'timestamp': int(datetime.utcnow().timestamp() * 1000),
            'orderId': order.id,
            'customerId': order.customer_id,
            'totalAmount': order.total,
            'currency': order.currency,
            'items': [{
                'productId': item.product_id,
                'quantity': item.quantity,
                'unitPrice': item.unit_price,
            } for item in order.items],
        }
        self.producer.produce(
            topic='order.events',
            key=order.id,
            value=json.dumps(event).encode('utf-8'),
            callback=self.delivery_callback,
        )
        self.producer.flush()

    def delivery_callback(self, err, msg):
        if err:
            print(f'Delivery failed: {err}')
        else:
            print(f'Event delivered to {msg.topic()} [{msg.partition()}]')

# Kafka consumer for notification service
from confluent_kafka import Consumer, KafkaError

class EventConsumer:
    def __init__(self, bootstrap_servers, group_id):
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': group_id,
            'auto.offset.reset': 'earliest',
            'enable.auto.commit': True,
        })

    def consume_events(self, topics, handler):
        self.consumer.subscribe(topics)
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(f'Consumer error: {msg.error()}')
                        break
                event = json.loads(msg.value().decode('utf-8'))
                handler(event)
        except KeyboardInterrupt:
            pass
        finally:
            self.consumer.close()
```



### Example 9: API Deprecation and Sunset

**Complete deprecation workflow for the Users API v1.**

**Step 1: Deprecation Announcement**

```markdown
# Deprecation Notice: Users API v1

## Announcement Date: March 15, 2026

We are announcing the deprecation of Users API v1, effective immediately.
v2 is now the recommended version and includes significant improvements.

## Timeline
- **March 15, 2026** — Deprecation announced; deprecation headers added to v1 responses
- **June 15, 2026** — v1 endpoints begin returning warning headers
- **September 15, 2026** — v1 returns 502 Gone for POST/PUT/DELETE endpoints
- **December 31, 2026** — v1 fully retired; all endpoints return 410 Gone

## Migration Resources
- Migration Guide: https://docs.example.com/migrations/v1-to-v2
- Changelog: https://docs.example.com/changelog
- Support: api-support@example.com

## What You Need To Do
1. Update your API calls to use v2 endpoints
2. Update your authentication to use bearer tokens (API keys still supported)
3. Update your error handling for the new RFC 9457 format
4. Update your pagination logic for cursor-based pagination
5. Test your application against v2 in our staging environment
```

**Step 2: Deprecation Headers**

```javascript
// Express middleware for deprecation headers
function deprecationMiddleware(versionInfo) {
  return (req, res, next) => {
    if (versionInfo.deprecated) {
      res.setHeader('Deprecation', true);
      res.setHeader('Sunset', versionInfo.sunsetDate);
      res.setHeader('Link', `<${versionInfo.successorVersion}>; rel="successor-version"`);

      if (versionInfo.warningPhase) {
        res.setHeader('Warning', `299 - "This API version is deprecated. Use ${versionInfo.successorVersion} instead."`);
      }
    }
    next();
  };
}

// Version configuration
const VERSION_INFO = {
  v1: {
    deprecated: true,
    sunsetDate: 'Sat, 31 Dec 2026 00:00:00 GMT',
    successorVersion: '/v2',
    warningPhase: false,     // Becomes true after June 15
    gonePhase: false,         // Becomes true after September 15 (writes)
    retirePhase: false,       // Becomes true after December 31
  },
  v1_1: {
    deprecated: true,
    sunsetDate: 'Sat, 31 Dec 2026 00:00:00 GMT',
    successorVersion: '/v2',
  },
};

// Apply to v1 endpoints
router.use('/v1', deprecationMiddleware(VERSION_INFO.v1));
router.use('/v1.1', deprecationMiddleware(VERSION_INFO.v1_1));
```

**Step 3: Migration Tracking**

```javascript
// Track migration progress
async function getMigrationMetrics() {
  const stats = await Promise.all([
    db.query('SELECT COUNT(*) as total FROM api_usage WHERE version = $1', ['v1']),
    db.query('SELECT COUNT(*) as total FROM api_usage WHERE version = $1', ['v2']),
    db.query(`
      SELECT consumer_id, COUNT(*) as calls
      FROM api_usage
      WHERE version = 'v1'
      GROUP BY consumer_id
      ORDER BY calls DESC
    `),
  ]);

  return {
    v1TotalCalls: stats[0].rows[0].total,
    v2TotalCalls: stats[1].rows[0].total,
    migrationProgress: (stats[1].rows[0].total / (stats[0].rows[0].total + stats[1].rows[0].total)) * 100,
    topConsumersNotMigrated: stats[2].rows.slice(0, 10),
  };
}

// Alert if consumers havent migrated
async function checkMigrationDeadlines() {
  const threeMonthsBeforeSunset = new Date('2026-09-15');
  const now = new Date();

  if (now > threeMonthsBeforeSunset) {
    const consumers = await getV1Consumers();
    for (const consumer of consumers) {
      await sendEmail({
        to: consumer.ownerEmail,
        subject: 'URGENT: API v1 sunset approaching',
        body: `Your application ${consumer.name} is still using API v1. 
               v1 will be retired on December 31, 2026. Please migrate to v2 immediately.`,
      });
    }
  }
}
```

**Step 4: Gradual Sunset Execution**

```javascript
// Gradual sunset based on phase
function sunsetMiddleware(versionInfo) {
  return (req, res, next) => {
    if (versionInfo.retirePhase) {
      return res.status(410).json({
        type: 'https://api.example.com/errors/gone',
        title: 'Gone',
        status: 410,
        detail: 'This API version has been retired. Use /v2 instead.',
        migrationUrl: 'https://docs.example.com/migrations/v1-to-v2',
      });
    }

    if (versionInfo.gonePhase && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return res.status(410).json({
        type: 'https://api.example.com/errors/gone',
        title: 'Gone',
        status: 410,
        detail: 'Write operations for this API version are no longer supported. Use /v2 instead.',
        migrationUrl: 'https://docs.example.com/migrations/v1-to-v2',
      });
    }

    if (versionInfo.warningPhase) {
      res.setHeader('Warning', `299 - "This API version is deprecated. Use ${versionInfo.successorVersion} instead."`);
    }

    next();
  };
}
```

### Example 10: GraphQL Federation with Apollo

**Supergraph Architecture:**

```
                    +------------------+
                    | Apollo Gateway   |
                    | (Supergraph)     |
                    +--------+---------+
                             |
          +------------------+------------------+
          |                  |                  |
+---------v--------+ +------v--------+ +-------v--------+
| Users Subgraph   | | Orders Subgraph| | Products Subg. |
| (users service)  | | (orders svc)  | | (products svc) |
+------------------+ +---------------+ +----------------+
```

**Users Subgraph:**

```graphql
# users/subgraph/schema.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external", "@requires"])

type Query {
  "Current authenticated user"
  me: User!
  "Get user by ID"
  user(id: ID!): User
  "Search users"
  users(first: Int, after: String): UserConnection!
}

type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String! @shareable
  avatarUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserConnection {
  edges: [UserEdge!]!
  nodes: [User!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

```javascript
// users/subgraph/resolvers.js
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { parse } = require('graphql');

const resolvers = {
  Query: {
    me: (_, __, { auth }) => usersService.getUser(auth.userId),
    user: (_, { id }) => usersService.getUser(id),
    users: (_, args) => usersService.listUsers(args),
  },
  User: {
    __resolveReference: (ref, { auth }) => {
      // Called when other subgraphs reference a User
      return usersService.getUser(ref.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs: parse(typeDefs), resolvers }],
});

server.listen(4001).then(() => {
  console.log('Users subgraph running on port 4001');
});
```

**Orders Subgraph:**

```graphql
# orders/subgraph/schema.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@requires", "@provides"])

type Query {
  order(id: ID!): Order
  orders(first: Int, after: String): OrderConnection!
}

type Order @key(fields: "id") {
  id: ID!
  total: Float!
  currency: String!
  status: OrderStatus!
  items: [OrderItem!]!
  userId: String!
  user: User @requires(fields: "userId")
  createdAt: DateTime!
}

type OrderItem @key(fields: "id") {
  id: ID!
  productId: String!
  quantity: Int!
  unitPrice: Float!
  totalPrice: Float!
  product: Product @requires(fields: "productId")
}

extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}

extend type Product @key(fields: "id") {
  id: ID! @external
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

```javascript
// orders/subgraph/resolvers.js
const resolvers = {
  Query: {
    order: (_, { id }) => ordersService.getOrder(id),
    orders: (_, args) => ordersService.listOrders(args),
  },
  Order: {
    __resolveReference: (ref) => ordersService.getOrder(ref.id),
    user: (order) => ({ __typename: 'User', id: order.userId }),
  },
  OrderItem: {
    product: (item) => ({ __typename: 'Product', id: item.productId }),
  },
  User: {
    orders: (user) => ordersService.getOrdersByUser(user.id),
  },
};
```

**Apollo Gateway Configuration:**

```javascript
// gateway/index.js
const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('@apollo/server');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'users', url: 'http://users-service:4001/graphql' },
      { name: 'orders', url: 'http://orders-service:4002/graphql' },
      { name: 'products', url: 'http://products-service:4003/graphql' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
  introspection: true,
});

server.listen(4000).then(() => {
  console.log('Gateway running on port 4000');
});
```

**Federated Query Example:**

```graphql
query GetUserWithOrders {
  me {
    id
    name
    email
    orders {
      id
      total
      status
      items {
        quantity
        product {
          name
          price
        }
      }
    }
  }
}
```

### Example 11: API Governance with Spectral

**Custom Spectral Ruleset:**

```yaml
# .spectral.yaml
extends: [[spectral:oas, all]]

rules:
  # Naming conventions
  my-api-kebab-case-paths:
    description: "Paths must use kebab-case"
    message: "{{property}} must use kebab-case"
    severity: error
    given: "$.paths[*]~"
    then:
      function: pattern
      functionOptions:
        match: "^\/[a-z0-9-_.{}]+(\/[a-z0-9-_.{}]+)*$"

  my-api-plural-collections:
    description: "Collection names must be plural"
    message: "Path segment {{property}} should be plural"
    severity: warn
    given: "$.paths[*]~"
    then:
      function: pattern
      functionOptions:
        notMatch: "^\/[a-z]+$"
        match: "^\/[a-z]+s(\/|$)"

  my-api-operation-summary:
    description: "Every operation must have a summary"
    message: "Operation must have a summary"
    severity: error
    given: "$..paths.*[get,post,put,patch,delete,head,options]"
    then:
      field: summary
      function: defined

  my-api-operation-description:
    description: "Every operation must have a description"
    message: "Operation must have a description"
    severity: warn
    given: "$..paths.*[get,post,put,patch,delete,head,options]"
    then:
      field: description
      function: defined

  my-api-operation-id:
    description: "Every operation must have an operationId"
    message: "Operation must have an operationId (used for SDK generation)"
    severity: error
    given: "$..paths.*[get,post,put,patch,delete,head,options]"
    then:
      field: operationId
      function: defined

  my-api-operation-id-casing:
    description: "operationId must use camelCase"
    message: "operationId {{property}} should use camelCase"
    severity: error
    given: "$..paths.*[get,post,put,patch,delete,head,options]"
    then:
      field: operationId
      function: casing
      functionOptions:
        type: camel

  my-api-request-body-schema:
    description: "POST and PUT operations must have a request body schema"
    message: "{{method}} {{path}} must define a request body schema"
    severity: error
    given: "$.paths[*][post,put]"
    then:
      field: requestBody.content.application/json.schema
      function: defined

  my-api-response-schemas:
    description: "Every success response must have a schema"
    message: "Response {{property}} must have a content schema"
    severity: warn
    given: "$..responses[200,201,202]"
    then:
      field: content.application/json.schema
      function: defined

  my-api-error-response:
    description: "Error responses (4xx, 5xx) must use standard error schema"
    message: "Error response must conform to RFC 9457"
    severity: error
    given: "$..responses[400,401,403,404,409,422,429,500]"
    then:
      field: content.application/json.schema
      function: defined

  my-api-pagination:
    description: "List endpoints must support pagination"
    message: "GET operations on collections must have pagination parameters"
    severity: error
    given: "$.paths.*[get]"
    then:
      function: defined
      functionOptions:
        condition:
          given: "$..parameters[?(@.name == 'cursor' || @.name == 'page' || @.name == 'limit' || @.name == 'per_page')]"
          function: truthy

  my-api-version-in-path:
    description: "Paths should include version prefix"
    message: "Path {{property}} should include version (e.g., /v2/users)"
    severity: warn
    given: "$.paths[*]~"
    then:
      function: pattern
      functionOptions:
        match: "^\/v[0-9]+\/"

  my-api-error-response-schema:
    description: "Error response must include type, title, status, detail"
    message: "Error response must follow RFC 9457: type, title, status, detail required"
    severity: error
    given: "$..responses[400,401,403,404,409,422,429,500].content.application/json.schema"
    then:
      function: schema
      functionOptions:
        schema:
          type: object
          required: ["type", "title", "status", "detail"]
          properties:
            type: { type: "string", format: "uri" }
            title: { type: "string" }
            status: { type: "integer" }
            detail: { type: "string" }

  my-api-security-schemes:
    description: "API must define security schemes"
    message: "API must define at least one security scheme"
    severity: error
    given: "$"
    then:
      field: components.securitySchemes
      function: defined

  my-api-standard-headers:
    description: "API should include standard headers in responses"
    message: "Response should include Request-Id header parameter"
    severity: warn
    given: "$..responses.*"
    then:
      field: headers.Request-Id
      function: defined

  my-api-rate-limit-headers:
    description: "API should include rate limit headers"
    message: "Response should include rate limit headers"
    severity: warn
    given: "$..responses.*"
    then:
      function: defined
      functionOptions:
        condition:
          given: "$..headers[RateLimit-Limit,RateLimit-Remaining,RateLimit-Reset]"
          function: defined

  my-api-no-verbs-in-path:
    description: "Paths should not contain HTTP verbs"
    message: "Path {{property}} contains a verb; use HTTP methods instead"
    severity: warn
    given: "$.paths[*]~"
    then:
      function: pattern
      functionOptions:
        notMatch: "\/(get|create|update|delete|list|search|find)\/"

  my-api-consistent-error-codes:
    description: "Error codes must be UPPER_SNAKE_CASE"
    message: "Error code {{property}} should be UPPER_SNAKE_CASE"
    severity: error
    given: "$..paths.*[get,post,put,patch,delete].responses.*.content.application/json.schema.properties.code"
    then:
      function: casing
      functionOptions:
        type: upper
        separator:
          allowLeading: false
          char: "_"

  my-api-date-time-format:
    description: "Date fields must use ISO 8601 format"
    message: "{{property}} must have format: date-time"
    severity: error
    given: "$..properties[*][?(@.type == 'string' && @.match(/[Aa]t$/))]"
    then:
      field: format
      function: defined
      functionOptions:
        match: "date-time"

  my-api-enum-values:
    description: "Enum values must use UPPER_CASE"
    message: "Enum values must use UPPER_SNAKE_CASE"
    severity: error
    given: "$..[?(@.enum)]..enum"
    then:
      function: casing
      functionOptions:
        type: upper
        separator: { char: "_" }
```

**Spectral CLI Integration:**

```bash
# Run Spectral linting locally
npx spectral lint specs/users.yaml

# With custom ruleset
npx spectral lint -r .spectral.yaml specs/users.yaml

# Output formats
npx spectral lint -r .spectral.yaml -f json specs/users.yaml
npx spectral lint -r .spectral.yaml -f html specs/users.yaml > lint-report.html

# In CI
npx spectral lint -r .spectral.yaml --fail-severity=error specs/users.yaml
```

**CI Integration:**

```yaml
# .github/workflows/api-lint.yml
name: API Spec Linting
on:
  pull_request:
    paths:
      - 'specs/**/*.yaml'
      - 'specs/**/*.json'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @stoplight/spectral-cli
      - name: Lint OpenAPI specs
        run: |
          npx spectral lint -r .spectral.yaml --fail-severity=error specs/
      - name: Lint AsyncAPI specs
        run: |
          npx spectral lint -r .spectral-async.yaml --fail-severity=error specs/async/
      - name: Comment PR with results
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = fs.readFileSync('spectral-results.json', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## API Lint Results\n\n${results}`
            })
```

### Example 12: API Performance Optimization

**Scenario:** High-traffic e-commerce API needs optimization.

**Problem Analysis:**

```yaml
# Current state
- 10M requests/day
- Average response time: 450ms
- p99 response time: 2800ms
- 3% error rate
- 40% cache hit rate
```

**Optimizations Applied:**

**1. Response Compression:**

```javascript
// Express compression middleware
const compression = require('compression');
app.use(compression({
  level: 6,              // Balance speed vs compression
  threshold: 1024,       // Only compress >1KB responses
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));
```

**2. HTTP Caching:**

```javascript
// Cache control headers
app.get('/api/v2/products/:id', async (req, res) => {
  const product = await getProduct(req.params.id);

  // Strong caching for static product data
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  res.setHeader('ETag', `"${product.etag}"`);
  res.setHeader('Last-Modified', product.updatedAt.toUTCString());

  // Conditional request handling
  const ifNoneMatch = req.headers['if-none-match'];
  const ifModifiedSince = req.headers['if-modified-since'];

  if (ifNoneMatch === `"${product.etag}"`) {
    return res.status(304).end();
  }
  if (ifModifiedSince && new Date(ifModifiedSince) >= product.updatedAt) {
    return res.status(304).end();
  }

  res.json(product);
});

// CDN cache invalidation via surrogate keys
function invalidateCDNCache(surrogateKey) {
  // Send purge request to CDN
  fetch('https://api.fastly.com/service/abc123/purge', {
    method: 'POST',
    headers: {
      'Fastly-Key': process.env.FASTLY_API_KEY,
      'Surrogate-Key': surrogateKey,
    },
  });
}

// On product update
async function updateProduct(id, data) {
  const product = await db.products.update(id, data);
  await invalidateCDNCache(`product:${id}`);
  await invalidateCDNCache('products:list');
  return product;
}
```

**3. Connection Pooling:**

```javascript
// Database connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  max: 20,               // Max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
app.get('/api/v2/users', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE status = $1', [req.query.status]);
    res.json(result.rows);
  } finally {
    client.release();  // Return to pool
  }
});

// HTTP connection pooling
const http = require('http');
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 20,
  timeout: 60000,
});
```

**4. Pagination Optimization:**

```javascript
// Keyset pagination (performance optimized)
app.get('/api/v2/products', async (req, res) => {
  const { cursor, limit = 20, sort = 'id', direction = 'asc' } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10), 100);

  let query;
  const params = [parsedLimit + 1]; // Fetch one extra to detect hasMore

  if (cursor) {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const operator = direction === 'asc' ? '>' : '<';
    query = `
      SELECT * FROM products
      WHERE ${sort} ${operator} $2
      ORDER BY ${sort} ${direction}
      LIMIT $1
    `;
    params.push(decoded);
  } else {
    query = `
      SELECT * FROM products
      ORDER BY ${sort} ${direction}
      LIMIT $1
    `;
  }

  const results = await pool.query(query, params);
  const hasMore = results.rows.length > parsedLimit;
  if (hasMore) results.rows.pop(); // Remove extra row

  const nextCursor = hasMore
    ? Buffer.from(String(results.rows[results.rows.length - 1][sort])).toString('base64url')
    : null;

  res.json({
    data: results.rows,
    pagination: {
      cursor: nextCursor,
      hasMore,
      limit: parsedLimit,
    },
  });
});
```

**5. Response Size Optimization:**

```javascript
// Sparse fieldsets
app.get('/api/v2/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  const fields = req.query.fields ? req.query.fields.split(',') : null;

  if (fields) {
    const filtered = {};
    fields.forEach(field => {
      if (user[field] !== undefined) {
        filtered[field] = user[field];
      }
    });
    return res.json({ data: filtered });
  }

  res.json({ data: user });
});

// Compression for large payloads
app.get('/api/v2/products/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Encoding', 'gzip');

  const gzip = zlib.createGzip();
  res.setHeader('Transfer-Encoding', 'chunked');

  const stream = await createProductStream();
  stream.pipe(gzip).pipe(res);
});
```

**Results After Optimization:**

```yaml
# Optimized state
- 10M requests/day (no change)
- Average response time: 45ms (90% improvement)
- p99 response time: 120ms (95% improvement)
- 0.1% error rate (97% improvement)
- 85% cache hit rate (112% improvement)
```



## P12: Anti-Patterns

### REST Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **Verbs in URLs** | `/api/createUser` or `/api/getUserById` | Use HTTP methods: `POST /users`, `GET /users/{id}` |
| 2 | **Wrong HTTP methods** | `POST /users/delete/123` or `GET /users?id=123&action=delete` | Use `DELETE /users/123` |
| 3 | **Inconsistent naming** | Mixing snake_case, camelCase, kebab-case | Choose one convention and stick to it |
| 4 | **Nested resources >3 levels** | `/orgs/1/projects/2/sprints/3/tasks/4/comments` | Flatten or use query parameters |
| 5 | **Returning 200 for everything** | `200 { "error": "User not found" }` | Use proper status codes: `404`, `422`, etc. |
| 6 | **No pagination** | `/users` returns all 1M users | Always paginate list endpoints |
| 7 | **Returning database IDs directly** | `{ "id": 42 }` | Use opaque, public IDs |
| 8 | **Leaking implementation details** | Error messages like "SQL constraint violation" | User-friendly error responses |
| 9 | **Inconsistent error format** | Each endpoint returns different error structure | Standard RFC 9457 error format |
| 10 | **No rate limiting** | API can be abused by any client | Implement rate limiting on all endpoints |
| 11 | **Bare metal IDs** | Auto-increment integers exposed | Use UUIDs or ULIDs |
| 12 | **Ignoring idempotency** | POST can create duplicate resources | Add Idempotency-Key support |
| 13 | **No versioning** | `/users` without version | Version from day one (`/v1/users`) |
| 14 | **Breaking changes without notice** | Response format changes unexpectedly | Deprecation notice, additive changes first |
| 15 | **Authentication on every endpoint** | Some endpoints accidentally unauthenticated | Default-deny auth model |
| 16 | **Sensitive data in URLs** | `GET /users?ssn=123-45-6789` | Never put sensitive data in URLs |
| 17 | **No conditional requests** | Every request returns full payload | Support ETags and If-Modified-Since |
| 18 | **Over-fetching** | Response always returns all fields | Support sparse fieldsets |
| 19 | **Under-fetching** | Client needs N+1 requests for related data | Support resource expansion |
| 20 | **Chatty APIs** | Multiple small requests for one operation | Batch endpoints, bulk operations |
| 21 | **Inconsistent date formats** | Mix of UNIX timestamps and ISO 8601 | Always use ISO 8601 in UTC |
| 22 | **Inconsistent pagination** | Different pagination style per endpoint | Standard pagination everywhere |
| 23 | **No HATEOAS** | Client needs hardcoded URLs | Include _links for discoverability |
| 24 | **Unclear ownership** | No way to know who owns/operates the API | Include contact info in spec |
| 25 | **No deprecation headers** | Consumers blindsided by removals | Always include Deprecation/Sunset headers |

### GraphQL Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **One-to-one mapping with database** | Schema mirrors DB tables | Design schema for consumer use cases |
| 2 | **No query depth limiting** | Deeply nested queries crash server | Enforce max depth (e.g., 5 levels) |
| 3 | **No query costing** | Expensive queries degrade performance | Implement query complexity analysis |
| 4 | **Ignoring N+1 problem** | 20 users = 21 queries | Use DataLoader for batching |
| 5 | **Returning raw errors** | `{ "errors": [{ "message": "Internal error" }] }` | Use error unions/interfaces with codes |
| 6 | **No input validation** | Malformed input crashes resolver | Validate in resolver, return ValidationError |
| 7 | **No authentication** | Anyone can query any data | Shield with authentication middleware |
| 8 | **No rate limiting** | Unrestricted query volume | Rate limit by user/IP/query cost |
| 9 | **Mutations return only ID** | Client has to query again for data | Return full object or payload |
| 10 | **Not using connections** | `users: [User!]!` without pagination | Use Relay Connection spec for lists |
| 11 | **Using non-nullable everywhere** | `User!`, `String!` causes cascading nulls | Use non-nullable only when field is guaranteed |
| 12 | **No descriptions** | Schema without docs | Add descriptions to all types and fields |
| 13 | **Exposing internal fields** | `passwordHash`, `internalNotes` in schema | Never expose internal data |
| 14 | **Ignoring subscriptions** | Client polls for updates | Use subscriptions for real-time events |
| 15 | **No persisted queries** | Large query strings hit server | Register known queries for efficiency |
| 16 | **Monolithic schema** | Everything in one file | Use federation or schema modules |
| 17 | **Not batching mutations** | N+1 create requests | Batch mutations or use array inputs |
| 18 | **No introspection protection** | Anyone can see full schema | Disable introspection in production |
| 19 | **Over-fetching via queries** | Client requests 50 fields, uses 3 | Cost queries by field |
| 20 | **Too many resolvers per request** | Deeply nested execution | Limit query depth and cost |

### gRPC Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **Not using proto3** | Using proto2 unnecessarily | Always use proto3 for gRPC |
| 2 | **Reusing field numbers** | Breaking change when fields are removed | Use `reserved` keyword |
| 3 | **No enums for states** | Stringly typed status fields | Use enums with UNSPECIFIED = 0 |
| 4 | **Not setting deadlines** | Hanging requests | Always set client deadlines and server timeouts |
| 5 | **Ignoring error codes** | Always returning INTERNAL | Use appropriate gRPC status codes |
| 6 | **Large messages** | Payloads >4MB | Use streaming for large data |
| 7 | **No health check** | No way to probe service health | Implement Health/Check RPC |
| 8 | **No interceptors** | Logging, auth, metrics scattered across handlers | Use interceptors for cross-cutting concerns |
| 9 | **Blocking streams** | Stream handler blocks on I/O | Use async handlers for streaming |
| 10 | **Not using field masks** | Full object replacement on update | Use google.protobuf.FieldMask |
| 11 | **One massive proto file** | Hard to maintain | Split by domain and version |
| 12 | **No backward compatibility plan** | Breaking changes without notice | Additive-only within same package |
| 13 | **Not using well-known types** | Custom Timestamp, Duration types | Use google.protobuf.Timestamp etc. |
| 14 | **Exposing internal errors** | Stack traces in error messages | Clean, consumer-friendly error model |
| 15 | **No load balancing** | All traffic to one instance | Use client-side or proxy LB |

### API Lifecycle Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **Code-first without contract** | Spec drift, no single source of truth | Always design-first with spec |
| 2 | **No breaking change detection** | Accidental breaking changes | Automated OpenAPI diff in CI |
| 3 | **Sunsetting without notice** | Consumers broken overnight | Minimum 6 months deprecation notice |
| 4 | **No migration guide** | Consumers cannot upgrade | Provide detailed migration guide |
| 5 | **Skipping design review** | Inconsistent APIs, poor DX | Mandatory API design review |
| 6 | **No API registry** | Cannot find existing APIs | Central API catalog with all versions |
| 7 | **No consumer tracking** | Unknown who uses deprecated features | Track consumer migrations |
| 8 | **Version everywhere** | Version in URL, header, body | Choose one versioning strategy |
| 9 | **No SLA** | No guarantees for consumers | Define and publish SLAs |
| 10 | **No changelog** | Consumers cannot track changes | Maintain detailed changelog |

### Documentation Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **Outdated docs** | Docs dont match implementation | Generate docs from spec, verify in CI |
| 2 | **No examples** | Developers dont know how to call API | Include request/response examples |
| 3 | **Missing error documentation** | Unhandled errors in production | Document all error codes and responses |
| 4 | **Only reference docs** | No guides or tutorials | Include quickstart, user guide, tutorials |
| 5 | **No interactive playground** | Hard to test APIs | Provide Swagger UI or GraphQL playground |
| 6 | **No version selector** | Readers see wrong version | Multi-version documentation |
| 7 | **No search** | Hard to find specific information | Full-text search in docs |

### Security Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **No authentication** | Anyone can access API | Authenticate all requests |
| 2 | **Weak password hashing** | Passwords stored in plaintext | Use bcrypt/argon2 |
| 3 | **Token in URL** | Token logged, cached | Use Authorization header |
| 4 | **No rate limiting** | Brute force attacks | Rate limit by IP, user, API key |
| 5 | **CORS set to * in production** | Any website can call API | Restrict CORS to known origins |
| 6 | **Exposing internal IPs** | Error reveals infrastructure | Clean error messages |
| 7 | **No input validation** | Injection attacks | Validate and sanitize all input |
| 8 | **No HTTPS** | Traffic intercepted | Enforce HTTPS, HSTS |
| 9 | **Hardcoded secrets** | Secrets in source code | Use environment variables, vault |
| 10 | **Overly permissive scopes** | Token has too much access | Principle of least privilege |

### Event-Driven Anti-Patterns

| # | Anti-Pattern | Problem | Solution |
|---|-------------|---------|----------|
| 1 | **No webhook signature** | Impersonation attacks | Sign all webhook payloads |
| 2 | **No idempotency handling** | Duplicate event processing | Idempotent webhook handlers |
| 3 | **Infinite retries** | Consumer DOS | Max retry limit with backoff |
| 4 | **No dead letter queue** | Events lost after retries | Dead letter for failed events |
| 5 | **No consumer confirmation** | Lost acknowledgments | Require 2xx response |
| 6 | **Too many events** | Consumer overloaded | Batch events, rate limit delivery |
| 7 | **No documentation** | Consumers unsure of event schema | Event catalog with schemas |

---
## P13: Quality Gates

### API Design Quality Gates

**Gate 1: Specification Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| Spec is valid | Passes OpenAPI/GraphQL/Proto validation | BLOCKER | Spectral, openapi-validator |
| All operations have operationId | Every endpoint has unique operationId | ERROR | Spectral |
| All fields have descriptions | Every schema field is documented | WARN | Spectral |
| Error responses defined | 4xx and 5xx responses documented | ERROR | Spectral |
| Security schemes defined | Auth mechanism specified | BLOCKER | Spectral |
| Pagination on list endpoints | Collection GETs have pagination params | ERROR | Spectral |
| Consistent naming | snake_case or camelCase consistent | ERROR | Spectral |
| No breaking changes | Compatible with previous version | BLOCKER | openapi-diff |

**Gate 2: Security Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| Auth required | All endpoints require auth | BLOCKER | Manual review |
| No secrets in spec | No hardcoded keys or passwords | BLOCKER | Spectral, secrets scanner |
| Rate limiting configured | Rate limit policies defined | ERROR | Manual review |
| CORS configured | CORS policy restricts origins | WARN | Manual review |
| HTTPS enforced | No HTTP endpoints | BLOCKER | Gateway config |
| Input validation | All inputs validated against schema | ERROR | Schema validation |

**Gate 3: Contract Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| Consumer contracts pass | Pact verification passes | BLOCKER | Pact verifier |
| Provider contracts pass | Provider satisfies all pacts | BLOCKER | Pact verifier |
| Can-i-deploy check | Matrix compatibility verified | BLOCKER | Pact broker |
| Spec matches implementation | Dredd/schemathesis passes | ERROR | Dredd |
| JSON Schema validation | Request/response matches schema | ERROR | Ajv |

**Gate 4: Performance Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| p95 latency < 500ms | 95th percentile under threshold | WARN | k6, artillery |
| p99 latency < 2000ms | 99th percentile under threshold | ERROR | k6, artillery |
| Error rate < 1% | Less than 1% errors under load | ERROR | k6, artillery |
| Throughput meets target | Handles expected load | WARN | k6, artillery |
| No memory leaks | Stable memory under sustained load | ERROR | Load test |

**Gate 5: Documentation Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| Reference docs published | Docs generated and deployed | BLOCKER | CI check |
| Quickstart guide exists | Getting started doc present | WARN | Manual |
| Changelog updated | Changelog has current version entry | WARN | CI check |
| Migration guide available | For breaking changes | BLOCKER (if breaking) | Manual |
| API playground accessible | Interactive docs working | WARN | Manual |

**Gate 6: API Lifecycle Quality**

| Check | Criteria | Severity | Tool |
|-------|----------|----------|------|
| No direct-to-production changes | Changes go through review | BLOCKER | PR workflow |
| Breaking changes approved | API guild approves breaking changes | BLOCKER | Manual review |
| Deprecation communicated | Sunset date announced publicly | BLOCKER | Manual |
| Consumer migration tracked | Migration progress monitored | WARN | Dashboard |
| API registered in catalog | Entry in API registry | ERROR | Registry check |

### Quality Gate Pipeline

```yaml
# Complete API quality gate pipeline
stages:
  - spec-lint
  - spec-diff
  - contract-verify
  - security-scan
  - performance-test
  - doc-check
  - gate-approval
  - deploy

spec-lint:
  stage: spec-lint
  script:
    - spectral lint -r .spectral.yaml specs/
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

spec-diff:
  stage: spec-diff
  script:
    - openapi-diff origin/main:specs/current.yaml specs/next.yaml
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

contract-verify:
  stage: contract-verify
  script:
    - pact-broker can-i-deploy --pacticipant $API_NAME --version $CI_COMMIT_SHA
    - npm run pact:verify
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

security-scan:
  stage: security-scan
  script:
    - trufflehog --entropy=True --regex ./specs/
    - spectral lint -r .spectral-security.yaml specs/
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

performance-test:
  stage: performance-test
  script:
    - k6 run --vus 100 --duration 30s performance/load-test.js
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  allow_failure: true

doc-check:
  stage: doc-check
  script:
    - test -f docs/quickstart.md
    - test -f docs/migration-guide.md
    - test -f CHANGELOG.md
    - grep "$CI_COMMIT_TAG" CHANGELOG.md
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/'

gate-approval:
  stage: gate-approval
  script:
    - echo "All quality gates passed"
  needs:
    - spec-lint
    - spec-diff
    - contract-verify
    - security-scan
    - performance-test
    - doc-check
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  when: manual

deploy:
  stage: deploy
  script:
    - deploy-to-production
  needs:
    - gate-approval
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
```

### API Design Review Template

```markdown
# API Design Review

## Review Information
- **API Name:** 
- **Version:** 
- **Author:** 
- **Reviewers:** 
- **Date:** 

## Checklist

### Naming Convention
- [ ] Resources use plural nouns
- [ ] Paths use kebab-case
- [ ] Fields use consistent case (camelCase recommended)
- [ ] operationId follows verbNoun pattern

### HTTP Methods
- [ ] GET for retrieval (idempotent, safe)
- [ ] POST for creation / actions (not idempotent)
- [ ] PUT for full replacement (idempotent)
- [ ] PATCH for partial update (not idempotent)
- [ ] DELETE for removal (idempotent)

### Status Codes
- [ ] 200 for success GET/PUT/PATCH
- [ ] 201 for success POST
- [ ] 202 for async acceptance
- [ ] 204 for success DELETE
- [ ] 400 for bad request
- [ ] 401 for unauthenticated
- [ ] 403 for unauthorized
- [ ] 404 for not found
- [ ] 409 for conflict
- [ ] 422 for validation error
- [ ] 429 for rate limiting
- [ ] 500 for internal error
- [ ] 503 for unavailable

### Error Format
- [ ] Follows RFC 9457 (Problem Details)
- [ ] Includes type, title, status, detail
- [ ] Includes unique error codes
- [ ] Consistent across all endpoints

### Pagination
- [ ] Cursor-based for production APIs
- [ ] Limit parameter with max value
- [ ] nextCursor/hasMore in response
- [ ] Default page size (20 recommended)

### Security
- [ ] Authentication required
- [ ] Authorization scopes defined
- [ ] Rate limiting configured
- [ ] No sensitive data exposed
- [ ] CORS configured

### Performance
- [ ] Sparse fieldsets supported
- [ ] Resource expansion supported
- [ ] Compression supported
- [ ] Caching headers defined

### Evolution
- [ ] Version prefix in URL
- [ ] No breaking changes from previous version
- [ ] Deprecation strategy documented
- [ ] Additive changes preferred

## Review Decision
- [ ] Approved
- [ ] Approve with comments
- [ ] Changes requested

## Review Notes
```

### Continuous Improvement

**API Metrics to Track:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| API design review cycle time | < 3 days | PR merge time |
| Breaking changes per release | 0 | openapi-diff |
| Spec lint pass rate | 100% | Spectral |
| Contract verification pass rate | 100% | Pact |
| Documentation freshness | < 1 week since deploy | Doc publish timestamp |
| Consumer migration time | < 3 months | Pact broker |
| API time-to-first-call | < 5 minutes | Quickstart complexity |
| Consumer satisfaction score | > 4.0 / 5.0 | Survey |

**Retrospective Questions:**

1. Were there any breaking changes that could have been additive?
2. Did any consumers report issues that were not covered in contracts?
3. Was the spec validated before implementation began?
4. Were there any security concerns discovered late?
5. Did the documentation match the actual behavior?
6. Were there any performance issues under load?
7. Did the versioning strategy work well for consumers?
8. What would we do differently for the next version?

---

> **This SKILL.md covers the API Designer domain comprehensively, including REST, GraphQL, gRPC design, API contracts, security, lifecycle management, documentation, event-driven architecture, worked examples, anti-patterns, and quality gates. All content is production-grade and follows industry best practices.**




## P14: Expanded API Specifications

### Complete OpenAPI 3.1 Specification Walkthrough

This section provides a detailed, line-by-line walkthrough of a production-grade OpenAPI 3.1 specification for a complete Order Management API.

**Complete Spec:**

```yaml
openapi: "3.1.0"
info:
  title: "Order Management API"
  description: |
    The Order Management API provides endpoints for managing the complete order lifecycle.
    
    ## Capabilities
    - Create, retrieve, update, and cancel orders
    - Manage order items, shipments, and returns
    - Process payments and refunds
    - Track order status changes via webhooks
    - Generate order reports and analytics
    
    ## Authentication
    All API requests require authentication via Bearer JWT token.
    Obtain tokens from the Authorization Server at https://auth.example.com.
    
    ## Rate Limiting
    - Standard tier: 1,000 requests per minute
    - Enterprise tier: 10,000 requests per minute
    - See response headers for current rate limit status
    
    ## Pagination
    All list endpoints use cursor-based pagination.
    - `limit`: Number of items per page (default: 20, max: 100)
    - `cursor`: Opaque cursor from previous response
    - Response includes `nextCursor` and `hasMore`
    
    ## Errors
    Errors follow RFC 9457 (Problem Details) format.
    Every error response includes:
    - `type`: URI identifying the error type
    - `title`: Short human-readable summary
    - `status`: HTTP status code
    - `detail`: Human-readable explanation
    - `instance`: URI identifying the specific occurrence
    
    ## Idempotency
    POST and PATCH requests support idempotency via the `Idempotency-Key` header.
    Keys are valid for 24 hours and scoped per API key.
    
    ## Versioning
    This is version 2 of the Order Management API.
    Version is indicated in the URL path.
    See the changelog for version history.
    
  version: "2.3.0"
  contact:
    name: "API Support Team"
    email: "api-support@example.com"
    url: "https://developer.example.com/support"
  license:
    name: "Apache 2.0"
    url: "https://www.apache.org/licenses/LICENSE-2.0.html"
  termsOfService: "https://example.com/terms"
  x-logo:
    url: "https://cdn.example.com/brand/api-logo.svg"
    altText: "Company API Logo"
  x-default-sort: "-createdAt"
  x-rate-limits:
    standard: 1000
    enterprise: 10000

servers:
  - url: "https://api.example.com/v2"
    description: "Production environment"
    variables: {}
  - url: "https://staging-api.example.com/v2"
    description: "Staging environment for integration testing"
  - url: "http://localhost:3000/v2"
    description: "Local development environment"

tags:
  - name: "Orders"
    description: "Order CRUD and lifecycle operations"
    externalDocs:
      description: "Order management guide"
      url: "https://docs.example.com/guides/orders"
  - name: "Order Items"
    description: "Manage items within orders"
  - name: "Shipments"
    description: "Order shipping and tracking"
  - name: "Returns"
    description: "Order returns and refunds"
  - name: "Webhooks"
    description: "Webhook event subscriptions"
  - name: "Reports"
    description: "Order analytics and reporting"

paths:
  /orders:
    get:
      tags:
        - "Orders"
      operationId: "listOrders"
      summary: "List orders with filtering and pagination"
      description: |
        Retrieves a paginated list of orders based on the provided filters.
        
        ## Filter Examples
        - `?status=shipped` — Orders with status "shipped"
        - `?status=shipped,delivered` — Orders with status "shipped" or "delivered"
        - `?total[gte]=10000` — Orders with total >= 100.00
        - `?createdAt[gte]=2026-01-01&createdAt[lte]=2026-12-31` — Orders within date range
        - `?customerId=cust_123` — Orders for a specific customer
        - `?filter=status eq 'shipped' and total gte 10000` — Complex filter expression
        
        ## Sort Examples
        - `?sort=-createdAt` — Sort by creation date descending (newest first)
        - `?sort=total,status` — Sort by total ascending, then status ascending
        - `?sort=-priority,createdAt:asc` — Complex sort with direction
        
        ## Including Related Resources
        - `?include=items` — Include order items in response
        - `?include=items,customer` — Include items and customer
        - `?include=items.product` — Include items with nested product expansion
        
        ## Sparse Fieldsets
        - `?fields=id,orderNumber,total,status` — Only return specific fields
      parameters:
        - name: "status"
          in: "query"
          description: "Filter by order status (comma-separated for multiple values)"
          required: false
          schema:
            type: "string"
            example: "shipped,delivered"
        - name: "customerId"
          in: "query"
          description: "Filter by customer ID"
          required: false
          schema:
            type: "string"
            example: "cust_123"
        - name: "total"
          in: "query"
          description: "Filter by total amount"
          required: false
          schema:
            type: "object"
            properties:
              gte:
                type: "integer"
                description: "Greater than or equal"
              lte:
                type: "integer"
                description: "Less than or equal"
              gt:
                type: "integer"
                description: "Greater than"
              lt:
                type: "integer"
                description: "Less than"
            example: "{ \"gte\": 10000, \"lte\": 50000 }"
          style: "deepObject"
        - name: "createdAt"
          in: "query"
          description: "Filter by creation date range"
          required: false
          schema:
            type: "object"
            properties:
              gte:
                type: "string"
                format: "date-time"
              lte:
                type: "string"
                format: "date-time"
            example: "{ \"gte\": \"2026-01-01T00:00:00Z\", \"lte\": \"2026-12-31T23:59:59Z\" }"
          style: "deepObject"
        - name: "sort"
          in: "query"
          description: "Sort order (prefix with - for descending)"
          required: false
          schema:
            type: "string"
            example: "-createdAt"
        - name: "cursor"
          in: "query"
          description: "Pagination cursor from previous response"
          required: false
          schema:
            type: "string"
            example: "eyJpZCI6Im9yZF8xMjMifQ"
        - name: "limit"
          in: "query"
          description: "Number of items per page (max 100)"
          required: false
          schema:
            type: "integer"
            minimum: 1
            maximum: 100
            default: 20
            example: 20
        - name: "include"
          in: "query"
          description: "Related resources to include (comma-separated)"
          required: false
          schema:
            type: "string"
            example: "items,customer"
        - name: "fields"
          in: "query"
          description: "Sparse fieldset (comma-separated field names)"
          required: false
          schema:
            type: "string"
            example: "id,orderNumber,total,status"
      responses:
        "200":
          description: "Successful response with paginated order list"
          headers:
            RateLimit-Limit:
              schema:
                type: "integer"
              description: "Max requests per window"
            RateLimit-Remaining:
              schema:
                type: "integer"
              description: "Requests remaining in current window"
            RateLimit-Reset:
              schema:
                type: "integer"
              description: "Unix timestamp when rate limit resets"
            Request-Id:
              schema:
                type: "string"
                format: "uuid"
              description: "Unique request identifier for tracing"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                        format: "uuid"
                      timestamp:
                        type: "string"
                        format: "date-time"
                      pagination:
                        $ref: "#/components/schemas/Pagination"
                required:
                  - data
                  - meta
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    post:
      tags:
        - "Orders"
      operationId: "createOrder"
      summary: "Create a new order"
      description: |
        Creates a new order with the provided items and customer information.
        
        ## Idempotency
        Include an `Idempotency-Key` header to safely retry this request.
        The server will return the same response for the same key within 24 hours.
        
        ## Validation
        - At least one item is required
        - All product IDs must exist
        - Quantities must be positive integers
        - Shipping address is required for physical goods
        - Billing address is required for paid orders
        
        ## Webhook
        Successful order creation triggers an `order.created` webhook event.
      parameters:
        - name: "Idempotency-Key"
          in: "header"
          description: "Unique idempotency key for safe retries"
          required: false
          schema:
            type: "string"
            format: "uuid"
            example: "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateOrderRequest"
      responses:
        "201":
          description: "Order created successfully"
          headers:
            Location:
              schema:
                type: "string"
                format: "uri"
              description: "URL of the created order"
            Request-Id:
              schema:
                type: "string"
                format: "uuid"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
                        format: "date-time"
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "422":
          $ref: "#/components/responses/ValidationError"
        "429":
          $ref: "#/components/responses/TooManyRequests"

  /orders/{orderId}:
    get:
      tags:
        - "Orders"
      operationId: "getOrder"
      summary: "Get order details by ID"
      description: |
        Retrieves detailed information about a specific order.
        
        ## Including Related Resources
        Use the `include` parameter to embed related resources:
        - `items` — Order line items
        - `shipments` — Shipment details
        - `payments` — Payment information
        - `returns` — Return/refund details
        - `customer` — Customer information
        - `items.product` — Items with product details
        
        ## Sparse Fieldsets
        Use the `fields` parameter to limit response fields.
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          description: "Unique identifier of the order"
          schema:
            type: "string"
            pattern: "^ord_[a-zA-Z0-9]{20,30}$"
            example: "ord_abc123def456ghi789"
        - name: "include"
          in: "query"
          description: "Related resources to include (comma-separated)"
          required: false
          schema:
            type: "string"
            example: "items,shipments"
        - name: "fields"
          in: "query"
          description: "Sparse fieldset (comma-separated field names)"
          required: false
          schema:
            type: "string"
            example: "id,orderNumber,status,total"
      responses:
        "200":
          description: "Order details"
          headers:
            Request-Id:
              schema:
                type: "string"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
                        format: "date-time"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "404":
          $ref: "#/components/responses/NotFound"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    patch:
      tags:
        - "Orders"
      operationId: "updateOrder"
      summary: "Update order fields"
      description: |
        Performs a partial update on the specified order.
        
        ## Updatable Fields
        - `notes` — Order notes
        - `shippingAddress` — Shipping address
        - `billingAddress` — Billing address
        - `metadata` — Custom key-value pairs
        
        ## Non-Updatable Fields
        The following fields cannot be updated via PATCH:
        - `status` — Use dedicated status endpoints
        - `items` — Use order items endpoints
        - `total` — Computed from items
        - `createdAt` — Immutable
        
        ## Idempotency
        Include `Idempotency-Key` header for safe retries.
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "Idempotency-Key"
          in: "header"
          schema:
            type: "string"
            format: "uuid"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UpdateOrderRequest"
      responses:
        "200":
          description: "Order updated successfully"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"
        "409":
          $ref: "#/components/responses/Conflict"
        "422":
          $ref: "#/components/responses/ValidationError"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    delete:
      tags:
        - "Orders"
      operationId: "cancelOrder"
      summary: "Cancel an order"
      description: |
        Cancels an order. Only orders in "pending" or "processing" status can be cancelled.
        Cancelled orders trigger the `order.cancelled` webhook event.
        
        ## Effects of Cancellation
        - Pending payments are voided
        - Completed payments are refunded
        - Shipped items cannot be cancelled (use returns endpoint)
        - Inventory is restocked
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "reason"
          in: "query"
          description: "Reason for cancellation"
          required: false
          schema:
            type: "string"
            example: "Customer requested cancellation"
      responses:
        "200":
          description: "Order cancelled successfully"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"
        "409":
          $ref: "#/components/responses/Conflict"
        "429":
          $ref: "#/components/responses/TooManyRequests"

  /orders/{orderId}/items:
    get:
      tags:
        - "Order Items"
      operationId: "listOrderItems"
      summary: "List items in an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of order items"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/OrderItem"
                  meta:
                    type: "object"

    post:
      tags:
        - "Order Items"
      operationId: "addOrderItem"
      summary: "Add an item to an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AddOrderItemRequest"
      responses:
        "201":
          description: "Item added to order"
          content:
            application/json:
              schema:
                type: "object"

  /orders/{orderId}/items/{itemId}:
    patch:
      tags:
        - "Order Items"
      operationId: "updateOrderItem"
      summary: "Update an order item (quantity)"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "itemId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: "object"
              properties:
                quantity:
                  type: "integer"
                  minimum: 0
                  description: "New quantity (0 removes the item)"
      responses:
        "200":
          description: "Item updated"

    delete:
      tags:
        - "Order Items"
      operationId: "removeOrderItem"
      summary: "Remove an item from an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "itemId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "204":
          description: "Item removed successfully"

  /orders/{orderId}/shipments:
    get:
      tags:
        - "Shipments"
      operationId: "listShipments"
      summary: "List shipments for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of shipments"

    post:
      tags:
        - "Shipments"
      operationId: "createShipment"
      summary: "Create a shipment for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateShipmentRequest"
      responses:
        "201":
          description: "Shipment created"

  /orders/{orderId}/shipments/{shipmentId}/track:
    get:
      tags:
        - "Shipments"
      operationId: "trackShipment"
      summary: "Track a shipment"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "shipmentId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "Tracking information"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TrackingInfo"

  /orders/{orderId}/returns:
    get:
      tags:
        - "Returns"
      operationId: "listReturns"
      summary: "List returns for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of returns"

    post:
      tags:
        - "Returns"
      operationId: "requestReturn"
      summary: "Request a return for an order item"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: "object"
              properties:
                itemId:
                  type: "string"
                quantity:
                  type: "integer"
                reason:
                  type: "string"
                  enum:
                    - "defective"
                    - "wrong_item"
                    - "not_as_described"
                    - "changed_mind"
                    - "other"
      responses:
        "201":
          description: "Return request created"

  /webhooks:
    get:
      tags:
        - "Webhooks"
      operationId: "listWebhookSubscriptions"
      summary: "List webhook subscriptions"
      responses:
        "200":
          description: "List of webhook subscriptions"

    post:
      tags:
        - "Webhooks"
      operationId: "createWebhookSubscription"
      summary: "Create a webhook subscription"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateWebhookRequest"
      responses:
        "201":
          description: "Webhook subscription created"

  /webhooks/{webhookId}:
    delete:
      tags:
        - "Webhooks"
      operationId: "deleteWebhookSubscription"
      summary: "Delete a webhook subscription"
      parameters:
        - name: "webhookId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "204":
          description: "Webhook subscription deleted"

  /reports/orders:
    get:
      tags:
        - "Reports"
      operationId: "getOrdersReport"
      summary: "Get order analytics report"
      parameters:
        - name: "startDate"
          in: "query"
          required: true
          schema:
            type: "string"
            format: "date"
        - name: "endDate"
          in: "query"
          required: true
          schema:
            type: "string"
            format: "date"
        - name: "granularity"
          in: "query"
          schema:
            type: "string"
            enum: ["day", "week", "month"]
            default: "day"
        - name: "groupBy"
          in: "query"
          schema:
            type: "string"
            enum: ["status", "payment_method", "customer_segment"]
      responses:
        "200":
          description: "Order analytics report"

components:
  schemas:
    Order:
      type: "object"
      description: "Represents a customer order"
      required:
        - id
        - orderNumber
        - status
        - customerId
        - items
        - subtotal
        - total
        - currency
        - createdAt
        - updatedAt
      properties:
        id:
          type: "string"
          description: "Unique order identifier"
          example: "ord_abc123def456ghi789"
          pattern: "^ord_[a-zA-Z0-9]{20,30}$"
        orderNumber:
          type: "string"
          description: "Human-readable order number"
          example: "ORD-2026-0054321"
          pattern: "^ORD-\\d{4}-\\d{7}$"
        status:
          type: "string"
          description: "Current order status"
          enum:
            - "pending"
            - "pending_payment"
            - "processing"
            - "shipped"
            - "delivered"
            - "cancelled"
            - "returned"
            - "refunded"
          example: "shipped"
        customerId:
          type: "string"
          description: "Customer who placed the order"
          example: "cust_abc123"
        customer:
          $ref: "#/components/schemas/Customer"
        items:
          type: "array"
          description: "Order line items"
          items:
            $ref: "#/components/schemas/OrderItem"
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        subtotal:
          type: "integer"
          description: "Subtotal in smallest currency unit (cents)"
          example: 5998
          minimum: 0
        shipping:
          type: "integer"
          description: "Shipping cost in cents"
          example: 500
          minimum: 0
        tax:
          type: "integer"
          description: "Tax amount in cents"
          example: 599
          minimum: 0
        discount:
          type: "integer"
          description: "Discount amount in cents"
          example: 0
          minimum: 0
        total:
          type: "integer"
          description: "Total amount in cents (subtotal + shipping + tax - discount)"
          example: 7097
          minimum: 0
        currency:
          type: "string"
          description: "ISO 4217 currency code"
          example: "USD"
          pattern: "^[A-Z]{3}$"
        paymentMethod:
          type: "string"
          description: "Payment method used"
          enum: ["credit_card", "debit_card", "bank_transfer", "digital_wallet", "crypto"]
          example: "credit_card"
        paymentStatus:
          type: "string"
          description: "Payment status"
          enum: ["pending", "authorized", "captured", "failed", "refunded", "partially_refunded"]
          example: "captured"
        notes:
          type: "string"
          description: "Order notes"
          example: "Leave at front door"
          maxLength: 1000
        metadata:
          type: "object"
          description: "Custom key-value metadata"
          additionalProperties:
            type: "string"
          example:
            source: "web"
            campaign: "spring_sale_2026"
        shipments:
          type: "array"
          description: "Order shipments"
          items:
            $ref: "#/components/schemas/Shipment"
        returns:
          type: "array"
          description: "Order returns"
          items:
            $ref: "#/components/schemas/Return"
        createdAt:
          type: "string"
          description: "ISO 8601 creation timestamp"
          format: "date-time"
          example: "2026-05-27T14:30:00Z"
        updatedAt:
          type: "string"
          description: "ISO 8601 last update timestamp"
          format: "date-time"
          example: "2026-05-27T15:00:00Z"
        _links:
          type: "object"
          description: "HATEOAS links for API navigation"
          properties:
            self:
              $ref: "#/components/schemas/Link"
            items:
              $ref: "#/components/schemas/Link"
            shipments:
              $ref: "#/components/schemas/Link"
            payments:
              $ref: "#/components/schemas/Link"
            cancel:
              $ref: "#/components/schemas/Link"
    OrderItem:
      type: "object"
      description: "A single line item within an order"
      required:
        - id
        - productId
        - productName
        - quantity
        - unitPrice
        - totalPrice
      properties:
        id:
          type: "string"
          description: "Line item identifier"
          example: "item_abc123"
        productId:
          type: "string"
          description: "Product identifier"
          example: "prod_widget_001"
        productName:
          type: "string"
          description: "Product name at time of order"
          example: "Super Widget Black"
        sku:
          type: "string"
          description: "Stock keeping unit"
          example: "WGT-001-BLK"
        variantName:
          type: "string"
          description: "Variant name if applicable"
          example: "Black / Small"
        quantity:
          type: "integer"
          description: "Quantity ordered"
          example: 2
          minimum: 1
          maximum: 999
        unitPrice:
          type: "integer"
          description: "Price per unit in cents"
          example: 2999
          minimum: 0
        totalPrice:
          type: "integer"
          description: "Total line price in cents (quantity * unitPrice)"
          example: 5998
          minimum: 0
        imageUrl:
          type: "string"
          description: "Product image URL"
          format: "uri"
          example: "https://cdn.example.com/products/widget-black-1.jpg"
        product:
          $ref: "#/components/schemas/Product"
    Customer:
      type: "object"
      description: "Customer information"
      properties:
        id:
          type: "string"
          example: "cust_abc123"
        name:
          type: "string"
          example: "Alice Smith"
        email:
          type: "string"
          format: "email"
          example: "alice@example.com"
        phone:
          type: "string"
          example: "+1234567890"
    Address:
      type: "object"
      description: "Physical address"
      required:
        - street
        - city
        - country
      properties:
        street:
          type: "string"
          example: "123 Main St"
          maxLength: 255
        street2:
          type: "string"
          example: "Apt 4B"
          maxLength: 255
        city:
          type: "string"
          example: "Springfield"
          maxLength: 100
        state:
          type: "string"
          example: "IL"
          maxLength: 100
        zipCode:
          type: "string"
          example: "62701"
          maxLength: 20
        country:
          type: "string"
          example: "US"
          pattern: "^[A-Z]{2}$"
    Shipment:
      type: "object"
      description: "Order shipment information"
      properties:
        id:
          type: "string"
          example: "shp_abc123"
        carrier:
          type: "string"
          enum: ["fedex", "ups", "usps", "dhl"]
          example: "fedex"
        trackingNumber:
          type: "string"
          example: "1Z999AA10123456784"
        status:
          type: "string"
          enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"]
          example: "in_transit"
        estimatedDelivery:
          type: "string"
          format: "date"
          example: "2026-06-01"
        deliveredAt:
          type: "string"
          format: "date-time"
        items:
          type: "array"
          items:
            type: "string"
          description: "IDs of items in this shipment"
    Return:
      type: "object"
      description: "Return/refund information"
      properties:
        id:
          type: "string"
          example: "ret_abc123"
        itemId:
          type: "string"
          example: "item_abc123"
        quantity:
          type: "integer"
          example: 1
        reason:
          type: "string"
          enum: ["defective", "wrong_item", "not_as_described", "changed_mind", "other"]
        status:
          type: "string"
          enum: ["requested", "approved", "rejected", "shipped_back", "received", "refunded"]
        refundAmount:
          type: "integer"
          description: "Refund amount in cents"
          example: 2999
        requestedAt:
          type: "string"
          format: "date-time"
        refundedAt:
          type: "string"
          format: "date-time"
    Product:
      type: "object"
      description: "Product information"
      properties:
        id:
          type: "string"
          example: "prod_widget_001"
        name:
          type: "string"
          example: "Super Widget Black"
        imageUrl:
          type: "string"
          format: "uri"
        price:
          type: "integer"
          description: "Current price in cents"
          example: 2999
    TrackingInfo:
      type: "object"
      description: "Shipment tracking information"
      properties:
        carrier:
          type: "string"
        trackingNumber:
          type: "string"
        status:
          type: "string"
        estimatedDelivery:
          type: "string"
          format: "date"
        events:
          type: "array"
          items:
            type: "object"
            properties:
              timestamp:
                type: "string"
                format: "date-time"
              location:
                type: "string"
              description:
                type: "string"
              status:
                type: "string"
    Pagination:
      type: "object"
      description: "Cursor-based pagination information"
      properties:
        cursor:
          type: "string"
          description: "Opaque cursor for the next page"
          example: "eyJpZCI6Im9yZF8xMjMifQ"
          nullable: true
        hasMore:
          type: "boolean"
          description: "Whether there are more results"
          example: true
        limit:
          type: "integer"
          description: "Number of items per page"
          example: 20
    Link:
      type: "object"
      description: "HATEOAS link object"
      properties:
        href:
          type: "string"
          format: "uri"
          description: "Target URL"
        method:
          type: "string"
          description: "HTTP method"
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        rel:
          type: "string"
          description: "Link relation"
    CreateOrderRequest:
      type: "object"
      description: "Request body for creating a new order"
      required:
        - items
        - shippingAddress
        - billingAddress
      properties:
        customerId:
          type: "string"
          description: "Customer ID (if not provided, creates a guest order)"
          example: "cust_abc123"
        items:
          type: "array"
          description: "Order items"
          minItems: 1
          maxItems: 100
          items:
            type: "object"
            required:
              - productId
              - quantity
            properties:
              productId:
                type: "string"
                description: "Product identifier"
                example: "prod_widget_001"
              variantId:
                type: "string"
                description: "Variant identifier (if applicable)"
                example: "var_001"
              quantity:
                type: "integer"
                description: "Quantity to order"
                minimum: 1
                maximum: 999
                example: 2
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        currency:
          type: "string"
          description: "ISO 4217 currency code (defaults to USD)"
          default: "USD"
          example: "USD"
        notes:
          type: "string"
          description: "Order notes"
          maxLength: 1000
          example: "Leave at front door"
        metadata:
          type: "object"
          description: "Custom metadata"
          additionalProperties:
            type: "string"
    UpdateOrderRequest:
      type: "object"
      description: "Request body for updating an order"
      properties:
        notes:
          type: "string"
          maxLength: 1000
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        metadata:
          type: "object"
          additionalProperties:
            type: "string"
    AddOrderItemRequest:
      type: "object"
      required:
        - productId
        - quantity
      properties:
        productId:
          type: "string"
        variantId:
          type: "string"
        quantity:
          type: "integer"
          minimum: 1
    CreateShipmentRequest:
      type: "object"
      required:
        - carrier
        - itemIds
      properties:
        carrier:
          type: "string"
          enum: ["fedex", "ups", "usps", "dhl"]
        itemIds:
          type: "array"
          items:
            type: "string"
          minItems: 1
        trackingNumber:
          type: "string"
    CreateWebhookRequest:
      type: "object"
      required:
        - url
        - events
      properties:
        url:
          type: "string"
          format: "uri"
          description: "Webhook endpoint URL"
          example: "https://consumer.example.com/webhooks"
        events:
          type: "array"
          description: "Events to subscribe to"
          items:
            type: "string"
            enum:
              - "order.created"
              - "order.updated"
              - "order.shipped"
              - "order.delivered"
              - "order.cancelled"
              - "order.returned"
              - "payment.completed"
              - "payment.failed"
              - "payment.refunded"
          example:
            - "order.created"
            - "order.shipped"
        description:
          type: "string"
          maxLength: 255
        secret:
          type: "string"
          description: "Webhook signing secret (auto-generated if not provided)"
        enabled:
          type: "boolean"
          default: true
        filter:
          type: "object"
          properties:
            customerId:
              type: "string"
            minTotal:
              type: "integer"
    ErrorResponse:
      type: "object"
      description: "RFC 9457 Problem Details error response"
      required:
        - type
        - title
        - status
        - detail
      properties:
        type:
          type: "string"
          format: "uri"
          description: "URI identifying the error type"
          example: "https://api.example.com/errors/validation-error"
        title:
          type: "string"
          description: "Short human-readable summary"
          example: "Validation Error"
        status:
          type: "integer"
          description: "HTTP status code"
          example: 422
        detail:
          type: "string"
          description: "Human-readable explanation"
          example: "The request body contains invalid fields."
        instance:
          type: "string"
          format: "uri"
          description: "URI identifying the specific error occurrence"
          example: "/api/logs/err-abc123"
        errors:
          type: "array"
          description: "Detailed error information"
          items:
            $ref: "#/components/schemas/ErrorDetail"
    ErrorDetail:
      type: "object"
      properties:
        field:
          type: "string"
          description: "Field that caused the error"
          example: "email"
        message:
          type: "string"
          description: "Error message for this field"
          example: "Must be a valid email address"
        code:
          type: "string"
          description: "Error code for programmatic handling"
          example: "INVALID_EMAIL_FORMAT"

  responses:
    BadRequest:
      description: "Bad request (malformed syntax or invalid parameters)"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/bad-request"
            title: "Bad Request"
            status: 400
            detail: "Invalid query parameter 'sort'. Allowed values: createdAt, updatedAt, total, status"
            instance: "/api/logs/err-bad-request-001"
    Unauthorized:
      description: "Authentication required or token invalid"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/unauthorized"
            title: "Unauthorized"
            status: 401
            detail: "Missing or invalid authentication token"
            instance: "/api/logs/err-auth-001"
    Forbidden:
      description: "Authenticated but not authorized"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/forbidden"
            title: "Forbidden"
            status: 403
            detail: "Insufficient permissions to access this resource"
            instance: "/api/logs/err-authz-001"
    NotFound:
      description: "Resource not found"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/not-found"
            title: "Not Found"
            status: 404
            detail: "Order with ID ord_nonexistent not found"
            instance: "/api/logs/err-404-001"
    ValidationError:
      description: "Validation error (semantic validation failed)"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/validation-error"
            title: "Validation Error"
            status: 422
            detail: "The request body contains invalid fields."
            instance: "/api/logs/err-validation-001"
            errors:
              - field: "items"
                message: "At least one item is required"
                code: "MIN_ITEMS"
              - field: "items[0].productId"
                message: "Product not found: prod_nonexistent"
                code: "PRODUCT_NOT_FOUND"
    Conflict:
      description: "Resource state conflict"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/conflict"
            title: "Conflict"
            status: 409
            detail: "Order cannot be cancelled because it has already been shipped"
            instance: "/api/logs/err-conflict-001"
    TooManyRequests:
      description: "Rate limit exceeded"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/rate-limit-exceeded"
            title: "Too Many Requests"
            status: 429
            detail: "Rate limit exceeded. Retry after 45 seconds."
            instance: "/api/logs/err-ratelimit-001"

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "JWT Bearer token obtained from the authorization server"
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
      description: "Legacy API key authentication (deprecated, use bearer token)"

security:
  - bearerAuth: []
```




## P15: Expanded API Testing Patterns

### API Testing Strategy

A comprehensive API testing strategy covers multiple levels of testing:

```
                    /\
                   /  \
                  /    \
                 / E2E \
                /--------\
               /          \
              / Integration \
             /--------------\
            /                \
           /   Contract       \
          /--------------------\
         /                      \
        /     Component          \
       /--------------------------\
      /                            \
     /          Unit                \
    /--------------------------------\
```

### Unit Testing Specifications

**OpenAPI Spec Validation Tests:**

```javascript
// spec-validation.test.js
const { validate } = require('@apidevtools/swagger-parser');
const fs = require('fs');
const path = require('path');
const spectral = require('@stoplight/spectral-core');
const { Spectral } = require('@stoplight/spectral-core');
const { fetch } = require('@stoplight/spectral-runtime');
const { httpAndFileResolver } = require('@stoplight/spectral-runtime');

describe('OpenAPI Specification Validation', () => {
  let spec;

  beforeAll(async () => {
    const specPath = path.join(__dirname, '..', 'specs', 'orders.yaml');
    spec = await validate(fs.readFileSync(specPath, 'utf8'));
  });

  test('spec is valid OpenAPI 3.1', () => {
    expect(spec.openapi).toMatch(/^3\.\d+\.\d+$/);
  });

  test('info section is complete', () => {
    expect(spec.info).toBeDefined();
    expect(spec.info.title).toBeDefined();
    expect(spec.info.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(spec.info.description).toBeDefined();
  });

  test('all paths have unique operationIds', () => {
    const operationIds = [];
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        if (operation.operationId) {
          expect(operationIds).not.toContain(operation.operationId);
          operationIds.push(operation.operationId);
        }
      });
    });
  });

  test('all paths follow kebab-case', () => {
    Object.keys(spec.paths).forEach(path => {
      expect(path).toMatch(/^\/v\d+\/[a-z0-9-_.{}]+(\/[a-z0-9-_.{}]+)*$/);
    });
  });

  test('all operations have summary and description', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        if (operation.summary) {
          expect(operation.summary.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('all responses have content schemas', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        Object.entries(operation.responses || {}).forEach(([code, response]) => {
          if (code.startsWith('2')) {
            expect(response.content).toBeDefined();
          }
        });
      });
    });
  });

  test('error responses use consistent format', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        Object.entries(operation.responses || {}).forEach(([code, response]) => {
          if (code.startsWith('4') || code.startsWith('5')) {
            const schema = response.content?.['application/json']?.schema;
            if (schema) {
              const props = schema.properties || schema.allOf?.[0]?.properties || {};
              expect(props.type || props.title).toBeDefined();
              expect(props.title || props.type).toBeDefined();
              expect(props.status || props.detail).toBeDefined();
            }
          }
        });
      });
    });
  });
});
```

**JSON Schema Validation Tests:**

```javascript
// schema-validation.test.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  strictTypes: true,
  strictTuples: true,
});
addFormats(ajv);

describe('JSON Schema Validation', () => {
  let schemas;

  beforeAll(() => {
    const specPath = path.join(__dirname, '..', 'specs', 'orders.yaml');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    schemas = spec.components.schemas;
  });

  describe('Order schema', () => {
    const validate = ajv.compile(schemas.Order);

    test('valid order passes validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'shipped',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 5998,
        total: 7097,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      const valid = validate(order);
      expect(valid).toBe(true);
    });

    test('missing required fields fails validation', () => {
      const invalidOrder = { id: 'ord_123' };
      const valid = validate(invalidOrder);
      expect(valid).toBe(false);
      expect(validate.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ params: { missingProperty: 'orderNumber' } }),
        ])
      );
    });

    test('invalid status enum fails validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'invalid_status',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('negative total fails validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: -100,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('invalid currency format fails', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'US Dollars',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('additional properties are not allowed', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
        extraField: 'should not be here',
      };
      expect(validate(order)).toBe(false);
    });
  });

  describe('CreateOrderRequest schema', () => {
    const validate = ajv.compile(schemas.CreateOrderRequest);

    test('valid create request', () => {
      const request = {
        customerId: 'cust_abc123',
        items: [
          { productId: 'prod_widget_001', quantity: 2 },
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'US',
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'US',
        },
      };
      expect(validate(request)).toBe(true);
    });

    test('empty items fails validation', () => {
      const request = {
        items: [],
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('missing shipping address fails', () => {
      const request = {
        items: [{ productId: 'prod_1', quantity: 1 }],
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('quantity must be positive', () => {
      const request = {
        items: [{ productId: 'prod_1', quantity: 0 }],
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('too many items fails validation', () => {
      const items = Array.from({ length: 101 }, (_, i) => ({
        productId: `prod_${i}`,
        quantity: 1,
      }));
      const request = {
        items,
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });
  });

  describe('Address schema', () => {
    const validate = ajv.compile(schemas.Address);

    test('valid US address', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      };
      expect(validate(address)).toBe(true);
    });

    test('missing street fails', () => {
      expect(validate({ city: 'Springfield', country: 'US' })).toBe(false);
    });

    test('invalid country code fails', () => {
      expect(validate({
        street: '123 Main St',
        city: 'Springfield',
        country: 'USA',
      })).toBe(false);
    });

    test('street too long fails', () => {
      expect(validate({
        street: 'A'.repeat(256),
        city: 'Springfield',
        country: 'US',
      })).toBe(false);
    });
  });

  describe('Pagination schema', () => {
    const validate = ajv.compile(schemas.Pagination);

    test('valid pagination with more results', () => {
      expect(validate({
        cursor: 'eyJpZCI6Im9yZF8xMjMifQ',
        hasMore: true,
        limit: 20,
      })).toBe(true);
    });

    test('valid pagination at end', () => {
      expect(validate({
        cursor: null,
        hasMore: false,
        limit: 20,
      })).toBe(true);
    });

    test('hasMore must be boolean', () => {
      expect(validate({ cursor: null, hasMore: 'true', limit: 20 })).toBe(false);
    });
  });
});
```

### Integration Testing

```javascript
// orders-api.integration.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Orders API Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /v2/orders', () => {
    test('creates a new order successfully', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', '550e8400-e29b-41d4-a716-446655440000')
        .send({
          customerId: 'cust_abc123',
          items: [
            { productId: 'prod_widget_001', variantId: 'var_001', quantity: 2 },
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'US',
          },
          billingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'US',
          },
          notes: 'Leave at front door',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toMatch(/^ord_/);
      expect(response.body.data.orderNumber).toMatch(/^ORD-\d{4}-\d{7}$/);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.total).toBeGreaterThan(0);
      expect(response.headers.location).toMatch(/\/orders\/ord_/);
    });

    test('returns 422 for invalid product', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 'prod_nonexistent', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.type).toBeDefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].code).toBe('PRODUCT_NOT_FOUND');
    });

    test('returns 422 for empty items', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].field).toBe('items');
    });

    test('returns 401 without auth token', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .send({
          items: [{ productId: 'prod_1', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(401);
    });

    test('returns 429 on rate limit exceeded', async () => {
      const promises = Array.from({ length: 1100 }, (_, i) =>
        request(app)
          .post('/v2/orders')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Idempotency-Key', `key-${i}`)
          .send({
            items: [{ productId: 'prod_1', quantity: 1 }],
            shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
            billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          })
      );

      const responses = await Promise.all(promises);
      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    test('idempotency returns same result for same key', async () => {
      const idempotencyKey = '550e8400-e29b-41d4-a716-446655440001';

      const firstResponse = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      const secondResponse = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(firstResponse.status).toBe(201);
      expect(secondResponse.status).toBe(201);
      expect(secondResponse.body.data.id).toBe(firstResponse.body.data.id);
    });

    test('idempotency key with different body fails', async () => {
      const idempotencyKey = '550e8400-e29b-41d4-a716-446655440002';

      await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 5 }],
          shippingAddress: { street: '456 Oak Ave', city: 'Chicago', country: 'US' },
          billingAddress: { street: '456 Oak Ave', city: 'Chicago', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].code).toBe('IDEMPOTENCY_KEY_REUSED');
    });
  });

  describe('GET /v2/orders', () => {
    test('returns paginated orders', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.pagination).toBeDefined();
      expect(response.body.meta.pagination.limit).toBe(10);
    });

    test('filters by status', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'shipped' });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(order.status).toBe('shipped');
      });
    });

    test('filters by date range', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          'createdAt[gte]': '2026-01-01T00:00:00Z',
          'createdAt[lte]': '2026-12-31T23:59:59Z',
        });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(new Date(order.createdAt)).toBeDefined();
      });
    });

    test('sorts by total descending', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sort: '-total', limit: 100 });

      expect(response.status).toBe(200);
      for (let i = 1; i < response.body.data.length; i++) {
        expect(response.body.data[i].total).toBeLessThanOrEqual(response.body.data[i - 1].total);
      }
    });

    test('returns sparse fields', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ fields: 'id,orderNumber,status', limit: 5 });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(Object.keys(order)).toEqual(['id', 'orderNumber', 'status']);
      });
    });

    test('includes related resources', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ include: 'items', limit: 5 });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(order.items).toBeDefined();
      });
    });

    test('default page size is 20', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.meta.pagination.limit).toBe(20);
    });

    test('max page size is 100', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 200 });

      expect(response.body.meta.pagination.limit).toBe(100);
    });

    test('includes rate limit headers', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });

    test('includes request ID', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['request-id']).toBeDefined();
    });

    test('returns 400 for invalid sort field', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sort: 'invalidField' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /v2/orders/:orderId', () => {
    test('returns order by ID', async () => {
      const response = await request(app)
        .get('/v2/orders/ord_abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe('ord_abc123');
      expect(response.body.data._links).toBeDefined();
      expect(response.body.data._links.self).toBeDefined();
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.type).toMatch(/not-found/);
    });
  });

  describe('PATCH /v2/orders/:orderId', () => {
    test('updates order notes', async () => {
      const response = await request(app)
        .patch('/v2/orders/ord_abc123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: 'Updated notes' });

      expect(response.status).toBe(200);
      expect(response.body.data.notes).toBe('Updated notes');
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .patch('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: 'test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /v2/orders/:orderId', () => {
    test('cancels pending order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_pending_123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('cancelled');
    });

    test('returns 409 for shipped order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_shipped_123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(409);
      expect(response.body.type).toMatch(/conflict/);
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});

// Helper function
async function getAuthToken() {
  const response = await request(app)
    .post('/auth/token')
    .send({
      grant_type: 'client_credentials',
      client_id: 'test_client',
      client_secret: 'test_secret',
      scope: 'orders:read orders:write',
    });
  return response.body.access_token;
}
```

### Contract Testing (Pact)

```javascript
// orders-api.pact.test.js
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, term, eachLike, iso8601DateTime } = MatchersV3;

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'OrdersAPI',
  pactfileWriteMode: 'merge',
});

describe('Orders API Pact Tests', () => {
  describe('List Orders', () => {
    test('returns paginated orders list', async () => {
      provider
        .given('orders exist with various statuses')
        .uponReceiving('a request for the first page of orders')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          query: { limit: '20' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'RateLimit-Limit': '1000',
            'RateLimit-Remaining': '999',
            'Request-Id': like('req-abc123'),
          },
          body: {
            data: eachLike({
              id: like('ord_abc123'),
              orderNumber: like('ORD-2026-001234'),
              status: term({ generate: 'shipped', matcher: '^(pending|processing|shipped|delivered|cancelled)$' }),
              customerId: like('cust_abc123'),
              total: like(7097),
              currency: term({ generate: 'USD', matcher: '^[A-Z]{3}$' }),
              createdAt: iso8601DateTime(),
              updatedAt: iso8601DateTime(),
            }),
            meta: {
              requestId: like('req-abc123'),
              timestamp: iso8601DateTime(),
              pagination: {
                cursor: like('eyJpZCI6Im9yZF8xMjMifQ'),
                hasMore: like(true),
                limit: 20,
              },
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders?limit=20`, {
          headers: { Authorization: 'Bearer valid_token' },
        });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data[0].id).toBeDefined();
        expect(body.data[0].orderNumber).toBeDefined();
        expect(body.meta.pagination.limit).toBe(20);
      });
    });

    test('returns filtered orders by status', async () => {
      provider
        .given('orders with status "shipped" exist')
        .uponReceiving('a request for shipped orders')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          query: { status: 'shipped', limit: '20' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data: eachLike({
              id: like('ord_abc123'),
              status: 'shipped',
            }),
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
              pagination: {
                cursor: null,
                hasMore: false,
                limit: 20,
              },
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders?status=shipped&limit=20`, {
          headers: { Authorization: 'Bearer valid_token' },
        });
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Create Order', () => {
    test('creates order successfully', async () => {
      provider
        .given('a valid product exists')
        .uponReceiving('a request to create a new order')
        .withRequest({
          method: 'POST',
          path: '/v2/orders',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: {
            customerId: like('cust_abc123'),
            items: eachLike({
              productId: like('prod_widget_001'),
              quantity: like(2),
            }),
            shippingAddress: {
              street: like('123 Main St'),
              city: like('Springfield'),
              country: term({ generate: 'US', matcher: '^[A-Z]{2}$' }),
            },
            billingAddress: {
              street: like('123 Main St'),
              city: like('Springfield'),
              country: 'US',
            },
          },
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            Location: like('/v2/orders/ord_new_123'),
          },
          body: {
            data: {
              id: like('ord_new_123'),
              orderNumber: like('ORD-2026-0054321'),
              status: 'pending',
              customerId: like('cust_abc123'),
              items: eachLike({
                id: like('item_001'),
                productId: like('prod_widget_001'),
                quantity: like(2),
                unitPrice: like(2999),
                totalPrice: like(5998),
              }),
              subtotal: like(5998),
              total: like(7097),
              currency: 'USD',
              createdAt: iso8601DateTime(),
              updatedAt: iso8601DateTime(),
            },
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: JSON.stringify({
            customerId: 'cust_abc123',
            items: [{ productId: 'prod_widget_001', quantity: 2 }],
            shippingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
            billingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
          }),
        });

        expect(response.status).toBe(201);
        const body = await response.json();
        expect(body.data.id).toBeDefined();
        expect(body.data.status).toBe('pending');
      });
    });

    test('returns validation error for invalid request', async () => {
      provider
        .given('API is operational')
        .uponReceiving('a request with empty items array')
        .withRequest({
          method: 'POST',
          path: '/v2/orders',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: {
            items: [],
            shippingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
            billingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
          },
        })
        .willRespondWith({
          status: 422,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/validation-error'),
            title: like('Validation Error'),
            status: 422,
            detail: like('The request body contains invalid fields.'),
            errors: eachLike({
              field: like('items'),
              message: like('At least one item is required'),
              code: like('MIN_ITEMS'),
            }),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: JSON.stringify({
            items: [],
            shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
            billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          }),
        });

        expect(response.status).toBe(422);
      });
    });
  });

  describe('Cancel Order', () => {
    test('cancels pending order', async () => {
      provider
        .given('an order exists with status "pending"')
        .uponReceiving('a request to cancel a pending order')
        .withRequest({
          method: 'DELETE',
          path: '/v2/orders/ord_pending_123',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data: {
              id: like('ord_pending_123'),
              status: 'cancelled',
            },
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders/ord_pending_123`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.data.status).toBe('cancelled');
      });
    });

    test('refuses to cancel shipped order', async () => {
      provider
        .given('an order exists with status "shipped"')
        .uponReceiving('a request to cancel a shipped order')
        .withRequest({
          method: 'DELETE',
          path: '/v2/orders/ord_shipped_123',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 409,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/conflict'),
            title: like('Conflict'),
            status: 409,
            detail: like('Order cannot be cancelled because it has already been shipped'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders/ord_shipped_123`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(409);
      });
    });
  });

  describe('Error Handling', () => {
    test('returns 401 for missing auth', async () => {
      provider
        .given('API requires authentication')
        .uponReceiving('a request without auth token')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
        })
        .willRespondWith({
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/unauthorized'),
            title: like('Unauthorized'),
            status: 401,
            detail: like('Missing or invalid authentication token'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`);
        expect(response.status).toBe(401);
      });
    });

    test('returns 429 when rate limited', async () => {
      provider
        .given('rate limit is exceeded for the client')
        .uponReceiving('a request when rate limited')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '45',
            'RateLimit-Limit': '1000',
            'RateLimit-Remaining': '0',
          },
          body: {
            type: like('https://api.example.com/errors/rate-limit-exceeded'),
            title: like('Too Many Requests'),
            status: 429,
            detail: like('Rate limit exceeded. Retry after 45 seconds.'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(429);
        expect(response.headers.get('Retry-After')).toBeDefined();
      });
    });
  });
});
```

### Performance Testing

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const orderCreationTime = new Trend('order_creation_time');
const orderListTime = new Trend('order_list_time');
const errorRate = new Rate('error_rate');
const totalOrders = new Counter('total_orders_created');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 VUs
    { duration: '5m', target: 100 },  // Ramp to 100 VUs
    { duration: '5m', target: 200 },  // Ramp to 200 VUs
    { duration: '10m', target: 200 }, // Stay at 200 VUs
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],
    order_creation_time: ['p(95)<1000'],
    order_list_time: ['p(95)<300'],
    error_rate: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000/v2';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'test_token';

export default function () {
  group('Order List Endpoint', () => {
    const responses = http.batch([
      ['GET', `${BASE_URL}/orders?limit=20&status=shipped`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
      ['GET', `${BASE_URL}/orders?limit=50&sort=-total`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
      ['GET', `${BASE_URL}/orders?limit=10&include=items`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
    ]);

    responses.forEach(res => {
      orderListTime.add(res.timings.duration);
      errorRate.add(res.status >= 400);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has data array': (r) => JSON.parse(r.body).data !== undefined,
        'has pagination': (r) => JSON.parse(r.body).meta?.pagination !== undefined,
      });
    });
  });

  group('Order Creation Endpoint', () => {
    const payload = JSON.stringify({
      customerId: `cust_${__VU}_${__ITER}`,
      items: [
        { productId: 'prod_widget_001', variantId: 'var_001', quantity: Math.floor(Math.random() * 5) + 1 },
        { productId: 'prod_gadget_002', quantity: Math.floor(Math.random() * 3) + 1 },
      ],
      shippingAddress: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      },
      billingAddress: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      },
    });

    const res = http.post(`${BASE_URL}/orders`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Idempotency-Key': `${__VU}-${__ITER}-${Date.now()}`,
      },
    });

    orderCreationTime.add(res.timings.duration);
    totalOrders.add(1);
    errorRate.add(res.status >= 400);

    check(res, {
      'status is 201': (r) => r.status === 201,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has order id': (r) => JSON.parse(r.body).data?.id !== undefined,
      'has location header': (r) => r.headers.Location !== undefined,
    });
  });

  group('Error Handling', () => {
    // Test validation error
    const invalidPayload = JSON.stringify({
      items: [],
      shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
    });

    const validationRes = http.post(`${BASE_URL}/orders`, invalidPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    check(validationRes, {
      'validation returns 422': (r) => r.status === 422,
      'has error details': (r) => JSON.parse(r.body).errors !== undefined,
      'error in RFC 9457 format': (r) => {
        const body = JSON.parse(r.body);
        return body.type && body.title && body.status && body.detail;
      },
    });

    // Test 404
    const notFoundRes = http.get(`${BASE_URL}/orders/ord_nonexistent`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    check(notFoundRes, {
      'not found returns 404': (r) => r.status === 404,
      'error type matches': (r) => JSON.parse(r.body).type.includes('not-found'),
    });
  });

  sleep(1);
}

export function teardown(data) {
  console.log(`Total orders created: ${totalOrders.name}`);
  console.log(`Error rate: ${errorRate.name}`);
}
```




## P16: API Performance & Caching

### Caching Strategies

**HTTP Caching Headers:**

```yaml
# Cache-Control directives
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=300, stale-if-error=86400

# Components of Cache-Control:
# public/proxy-replicatable
# private (browser only)
# no-cache (must revalidate)
# no-store (never cache)
# max-age=<seconds>
# s-maxage=<seconds> (shared cache max age)
# stale-while-revalidate=<seconds> (serve stale while revalidating)
# stale-if-error=<seconds> (serve stale if origin error)
# must-revalidate (strict revalidation)
# proxy-revalidate (shared caches must revalidate)
```

**ETag Generation Strategies:**

```javascript
// Strong ETag (content hash)
function generateStrongETag(content) {
  const crypto = require('crypto');
  return `"${crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex')}"`;
}

// Weak ETag (for semantically equivalent content)
function generateWeakETag(content) {
  return `W/"${content.updatedAt.getTime()}-${content.version}"`;
}

// Conditional request handling
app.get('/api/v2/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  const etag = generateStrongETag(order);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
  res.json({ data: order });
});
```

**CDN Caching Strategy:**

```yaml
# CDN cache rules
cache_rules:
  - pattern: "/api/v2/products/*"
    ttl: 3600           # 1 hour
    stale_while_revalidate: 300
    surrogate_key: "products"

  - pattern: "/api/v2/categories"
    ttl: 86400          # 24 hours
    stale_while_revalidate: 3600
    surrogate_key: "categories"

  - pattern: "/api/v2/orders/*"
    ttl: 0              # Never cache (private data)
    bypass: true

  - pattern: "/api/v2/static/*"
    ttl: 31536000       # 1 year
    immutable: true
```

**GraphQL Response Caching:**

```javascript
// Apollo Server response caching
const { ApolloServer } = require('@apollo/server');
const responseCachePlugin = require('@apollo/server-plugin-response-cache');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) => {
        // Group cache by user or anonymous
        return requestContext.context?.auth?.userId || 'anonymous';
      },
      shouldReadFromCache: (requestContext) => {
        // Only cache GET requests (not subscriptions)
        return requestContext.request.http?.method === 'GET';
      },
      extraCacheKeyData: (requestContext) => {
        return {
          locale: requestContext.context?.locale || 'en',
        };
      },
    }),
  ],
});

// Schema directives for cache hints
type Product @cacheControl(maxAge: 300) {
  id: ID!
  name: String!
  price: Int!
  description: String @cacheControl(maxAge: 600)
}

type Query {
  products: [Product!]! @cacheControl(maxAge: 60)
  orders: [Order!]! @cacheControl(maxAge: 0, scope: PRIVATE)
}
```

**Redis Caching Layer:**

```javascript
// Redis cache manager
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

class CacheManager {
  constructor(redis) {
    this.redis = redis;
    this.defaultTTL = 300; // 5 minutes
  }

  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    // Try cache first
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss - fetch data
    const data = await fetchFn();

    // Store in cache (don't wait for completion)
    this.redis.setex(key, ttl, JSON.stringify(data)).catch(err => {
      console.error('Cache set error:', err);
    });

    return data;
  }

  async invalidate(pattern) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async invalidateByTag(tag) {
    // Tag-based invalidation
    const keys = await this.redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
      await this.redis.del(`tag:${tag}`);
    }
  }

  async setWithTag(key, data, tags, ttl = this.defaultTTL) {
    await this.redis.setex(key, ttl, JSON.stringify(data));
    for (const tag of tags) {
      await this.redis.sadd(`tag:${tag}`, key);
      await this.redis.expire(`tag:${tag}`, ttl + 3600);
    }
  }

  async getCacheHealth() {
    try {
      await this.redis.ping();
      const info = await this.redis.info('stats');
      return { status: 'healthy', info };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

const cacheManager = new CacheManager(redis);

// Usage in endpoints
app.get('/api/v2/products/:id', async (req, res) => {
  const data = await cacheManager.getOrSet(
    `product:${req.params.id}`,
    () => getProduct(req.params.id),
    3600 // 1 hour TTL
  );

  if (!data) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
  }

  res.json({ data });
});

// Invalidating cache on write
app.post('/api/v2/products', async (req, res) => {
  const product = await createProduct(req.body);

  // Invalidate related caches
  await cacheManager.invalidate('products:list*');
  await cacheManager.invalidateByTag('category:' + product.categoryId);

  res.status(201).json({ data: product });
});
```

### Compression

```javascript
// Dynamic compression with content negotiation
const compression = require('compression');

app.use(compression({
  // Compression levels: 1 (fast) to 9 (best)
  level: 6,
  // Only compress responses >= 1KB
  threshold: 1024,
  // Skip compression for already compressed responses
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Skip for SSE
    if (req.headers.accept === 'text/event-stream') {
      return false;
    }
    return compression.filter(req, res);
  },
  // Use brotli if available
  brotli: {
    enabled: true,
    quality: 4,
  },
}));

// Or manual compression for specific endpoints
app.get('/api/v2/reports/export', async (req, res) => {
  const zlib = require('zlib');
  const { pipeline } = require('stream');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="orders-export.json"');

  const acceptEncoding = req.headers['accept-encoding'] || '';
  let compressionStream;

  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    compressionStream = zlib.createBrotliCompress();
  } else if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    compressionStream = zlib.createGzip();
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    compressionStream = zlib.createDeflate();
  } else {
    compressionStream = new PassThrough();
  }

  const orderStream = await createOrderExportStream();
  pipeline(orderStream, compressionStream, res, (err) => {
    if (err) console.error('Export error:', err);
  });
});
```

### Connection Pooling

```javascript
// HTTP connection pooling
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 20,
  scheduling: 'lifo',
  timeout: 60000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 20,
  scheduling: 'lifo',
  timeout: 60000,
  rejectUnauthorized: true,
});

// Database connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500,
  allowExitOnIdle: true,
});

// Monitor pool health
setInterval(async () => {
  const { totalCount, idleCount, waitingCount } = pool;
  console.log(`DB Pool - Total: ${totalCount}, Idle: ${idleCount}, Waiting: ${waitingCount}`);

  if (waitingCount > 5) {
    console.warn('High pool wait count, consider increasing pool size');
  }
}, 30000);
```

### Response Optimization

```javascript
// Response size optimization middleware
function responseOptimizer(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // Remove null fields
    if (req.query.stripNulls !== 'false') {
      body = removeNullFields(body);
    }

    // Apply sparse fields
    if (req.query.fields) {
      body = applySparseFields(body, req.query.fields);
    }

    // Apply compression
    if (shouldCompress(req, body)) {
      res.setHeader('Content-Encoding', 'gzip');
      // ... compression logic
    }

    return originalJson(body);
  };

  next();
}

function removeNullFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeNullFields);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, removeNullFields(v)])
    );
  }
  return obj;
}

function applySparseFields(data, fieldsString) {
  const fields = fieldsString.split(',').map(f => f.trim());
  if (Array.isArray(data)) {
    return data.map(item => applySparseFieldsToObject(item, fields));
  }
  if (data && typeof data === 'object') {
    return applySparseFieldsToObject(data, fields);
  }
  return data;
}

function applySparseFieldsToObject(obj, fields) {
  const result = {};
  fields.forEach(field => {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
  });
  return result;
}
```

### API Gateway Caching

```yaml
# Kong API Gateway caching configuration
plugins:
  - name: proxy-cache
    config:
      content_type:
        - "application/json"
      cache_ttl: 300
      strategy: "memory"
      memory:
        dictionary_name: "api_cache"
        max_size_mb: 100
      response_code:
        - 200
        - 301
        - 404
      request_method:
        - "GET"
        - "HEAD"
      vary_by_query_params:
        - "fields"
        - "limit"

  - name: rate-limiting
    config:
      second: 100
      minute: 1000
      hour: 50000
      policy: "local"
      fault_tolerant: true
      hide_client_headers: false
      redis:
        host: "redis"
        port: 6379
        database: 0
        timeout: 2000

  - name: request-size-limiting
    config:
      allowed_payload_size: 10  # MB

  - name: correlation-id
    config:
      header_name: "X-Request-Id"
      generator: "uuid"
      echo_downstream: true
```

### Advanced Pagination Patterns

```javascript
// Keyset pagination with composite cursors
function encodeCursor(values) {
  const cursor = values.map(v => String(v)).join('|');
  return Buffer.from(cursor).toString('base64url');
}

function decodeCursor(cursor) {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return decoded.split('|');
}

app.get('/api/v2/orders', async (req, res) => {
  const { cursor, limit = 20, sort = '-createdAt' } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10), 100);

  // Parse sort
  const sortFields = sort.split(',').map(f => {
    const dir = f.startsWith('-') ? 'desc' : 'asc';
    const field = f.replace(/^[-+]/, '');
    return { field, direction: dir };
  });

  // Build query
  let query = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  // Add cursor condition for keyset pagination
  if (cursor) {
    const cursorValues = decodeCursor(cursor);
    const sortConditions = sortFields.map((sf, i) => {
      const value = cursorValues[i];
      const operator = sf.direction === 'desc' ? '<' : '>';
      return `${sf.field} ${operator} $${params.length + 1}`;
    });
    conditions.push(`(${sortConditions.join(' AND ')})`);
    cursorValues.forEach(v => params.push(v));
  }

  // Apply other filters
  if (req.query.status) {
    const statuses = req.query.status.split(',');
    const placeholders = statuses.map((_, i) => `$${params.length + i + 1}`);
    conditions.push(`status IN (${placeholders.join(',')})`);
    params.push(...statuses);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Add sort
  query += ' ORDER BY ' + sortFields.map(sf => `${sf.field} ${sf.direction}`).join(', ');

  // Add limit (fetch one extra to determine if more)
  query += ` LIMIT $${params.length + 1}`;
  params.push(parsedLimit + 1);

  const results = await pool.query(query, params);
  const hasMore = results.rows.length > parsedLimit;
  if (hasMore) results.rows.pop(); // Remove extra row

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && results.rows.length > 0) {
    const lastRow = results.rows[results.rows.length - 1];
    const cursorValues = sortFields.map(sf => lastRow[sf.field]);
    nextCursor = encodeCursor(cursorValues);
  }

  res.json({
    data: results.rows,
    meta: {
      pagination: {
        cursor: nextCursor,
        hasMore,
        limit: parsedLimit,
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
});
```

### Performance Monitoring

```javascript
// API performance monitoring middleware
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestSize = new prometheus.Histogram({
  name: 'http_request_size_bytes',
  help: 'HTTP request size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
});

const httpResponseSize = new prometheus.Histogram({
  name: 'http_response_size_bytes',
  help: 'HTTP response size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
});

const activeRequests = new prometheus.Gauge({
  name: 'http_requests_active',
  help: 'Number of active HTTP requests',
});

const cacheHitRatio = new prometheus.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits vs misses',
  labelNames: ['cache', 'result'],
});

// Middleware
function performanceMiddleware(req, res, next) {
  const start = Date.now();
  activeRequests.inc();

  // Track request size
  const reqSize = parseInt(req.headers['content-length']) || 0;
  httpRequestSize.observe({ method: req.method, route: req.route?.path || 'unknown' }, reqSize);

  // Record response size on finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || 'unknown',
      status_code: res.statusCode,
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);

    const resSize = parseInt(res.getHeader('content-length')) || 0;
    httpResponseSize.observe({ method: req.method, route: req.route?.path || 'unknown' }, resSize);

    activeRequests.dec();
  });

  next();
}

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      memory: checkMemoryUsage(),
    },
  };

  const isHealthy = Object.values(health.checks).every(c => c.status === 'healthy');
  res.status(isHealthy ? 200 : 503).json(health);
});

async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    return { status: 'healthy', latency: Date.now() - start };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkRedisHealth() {
  try {
    const start = Date.now();
    await redis.ping();
    return { status: 'healthy', latency: Date.now() - start };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

function checkMemoryUsage() {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);

  return {
    status: heapUsedMB < heapTotalMB * 0.9 ? 'healthy' : 'warning',
    heapUsedMB,
    heapTotalMB,
    rssMB,
    externalMB: Math.round(usage.external / 1024 / 1024),
  };
}

// Performance alerts
function checkPerformanceAlerts() {
  setInterval(async () => {
    const metrics = await prometheus.register.getSingleMetricAsString('http_request_duration_seconds');
    // Check p99 latency
    // Check error rate
    // Check active requests
    // Send alerts if thresholds exceeded
  }, 60000);
}
```

### Performance Budget

```yaml
# Performance budget for API endpoints
performance_budget:
  global:
    p50_latency_ms: 100
    p95_latency_ms: 500
    p99_latency_ms: 2000
    error_rate_percent: 1
    throughput_rps: 1000

  endpoints:
    /v2/orders:
      GET:
        p50: 50
        p95: 200
        p99: 500
      POST:
        p50: 200
        p95: 500
        p99: 1000

    /v2/orders/{id}:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/orders/{id}/items:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/products:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/products/{id}:
      GET:
        p50: 20
        p95: 50
        p99: 200
```



