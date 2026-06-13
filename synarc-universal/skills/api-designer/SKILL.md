---
name: api-designer
description: API Designer Skill
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# API Designer Skill

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

> **Domain:** API-first design, specification, contracts, developer experience, and lifecycle management
> **Persona:** API Designer — owns the API surface, contract, specification, and developer experience
> **Scope:** Design-first API methodology, contract-driven development, spec authoring, versioning, governance


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
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
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

---

## EXPANDED API CONTENT

This section contains expanded API specifications, testing patterns, and performance patterns.

Reference file: \eferences/expanded-content.md\ (98 KB, 3534 lines)

