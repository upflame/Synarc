---
name: api-designer
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
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
> **Persona:** API Designer â€” owns the API surface, contract, specification, and developer experience
> **Scope:** Design-first API methodology, contract-driven development, spec authoring, versioning, governance


## P2: Philosophy â€” API-First Methodology

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
Requirements â†’ Spec First Draft â†’ Review â†’ Spec Final â†’ Mock Server
     â”‚                                                     â”‚
     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Backend Impl â†â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
                            Frontend Impl â†â”€â”€â”€â”€â”€â”€â”€
```

**Code-First (Not Recommended)**

The implementation drives the specification via annotations or code generation.

- Suitable for: Internal microservices, prototypes, legacy migration
- Risks: Spec drift, implementation leaks into contract, poor DX
- Mitigation: Generate specs from code, enforce CI validation

### Contract-Driven Development

The API contract is the **source of truth**. All stakeholders align around it.

**Core Tenets:**

1. **Contract First** â€” Write the contract before any code
2. **Contract Validation** â€” Every change must validate against the contract
3. **Contract Testing** â€” Consumers and providers test against the contract
4. **Contract Versioning** â€” Contracts evolve with explicit versioning
5. **Contract Discovery** â€” Contracts are published to a registry

### Principles of Good API Design

1. **Consistency** â€” Uniform patterns across all endpoints, error formats, naming
2. **Evolvability** â€” Design for change; additive changes preferred
3. **Usability** â€” Intuitive, self-documenting, predictable
4. **Performance** â€” Pagination, caching, compression, minimal payloads
5. **Security** â€” Auth by default, least privilege, defense in depth
6. **Observability** â€” Traceable, measurable, debuggable
7. **Simplicity** â€” Minimal surface area, clear semantics, no leaky abstractions
8. **Completeness** â€” Handle all states: success, error, edge cases, empty results

### API Design Process

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 1. Requirements Gathering                       â”‚
â”‚    - Identify resources, actions, data fields   â”‚
â”‚    - Define consumer personas                   â”‚
â”‚    - Map user stories to API interactions        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 2. Spec Drafting                                â”‚
â”‚    - Choose API style (REST/GraphQL/gRPC)       â”‚
â”‚    - Draft specification                        â”‚
â”‚    - Define data models and schemas              â”‚
â”‚    - Plan error responses                       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 3. Design Review                                â”‚
â”‚    - Peer review of spec                        â”‚
â”‚    - Breaking change detection                  â”‚
â”‚    - Governance linting                         â”‚
â”‚    - Consumer feedback                          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 4. Contract Publication                         â”‚
â”‚    - Publish to API registry                    â”‚
â”‚    - Generate mock server                       â”‚
â”‚    - Generate client SDKs                       â”‚
â”‚    - Generate documentation                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 5. Contract Testing                             â”‚
â”‚    - Consumer contract tests                    â”‚
â”‚    - Provider verification                      â”‚
â”‚    - Spec validation                            â”‚
â”‚    - Security scanning                          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 6. Implementation & Deployment                  â”‚
â”‚    - Backend implementation                     â”‚
â”‚    - Contract compliance CI                     â”‚
â”‚    - Integration tests                          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 7. Monitoring & Iteration                       â”‚
â”‚    - API analytics                              â”‚
â”‚    - Consumer feedback                          â”‚
â”‚    - Deprecation planning                       â”‚
â”‚    - Version evolution                          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
        - `?status=shipped` â€” Orders with status "shipped"
        - `?status=shipped,delivered` â€” Orders with status "shipped" or "delivered"
        - `?total[gte]=10000` â€” Orders with total >= 100.00
        - `?createdAt[gte]=2026-01-01&createdAt[lte]=2026-12-31` â€” Orders within date range
        - `?customerId=cust_123` â€” Orders for a specific customer
        - `?filter=status eq 'shipped' and total gte 10000` â€” Complex filter expression
        
        ## Sort Examples
        - `?sort=-createdAt` â€” Sort by creation date descending (newest first)
        - `?sort=total,status` â€” Sort by total ascending, then status ascending
        - `?sort=-priority,createdAt:asc` â€” Complex sort with direction
        
        ## Including Related Resources
        - `?include=items` â€” Include order items in response
        - `?include=items,customer` â€” Include items and customer
        - `?include=items.product` â€” Include items with nested product expansion
        
        ## Sparse Fieldsets
        - `?fields=id,orderNumber,total,status` â€” Only return specific fields
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
        - `items` â€” Order line items
        - `shipments` â€” Shipment details
        - `payments` â€” Payment information
        - `returns` â€” Return/refund details
        - `customer` â€” Customer information
        - `items.product` â€” Items with product details
        
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
        - `notes` â€” Order notes
        - `shippingAddress` â€” Shipping address
        - `billingAddress` â€” Billing address
        - `metadata` â€” Custom key-value pairs
        
        ## Non-Updatable Fields
        The following fields cannot be updated via PATCH:
        - `status` â€” Use dedicated status endpoints
        - `items` â€” Use order items endpoints
        - `total` â€” Computed from items
        - `createdAt` â€” Immutable
        
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



