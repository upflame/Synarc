---
name: fullstack-engineer
schema: skill-pack/v1
skill_type:
  - capability
dependencies:
  synarc-core: ">=5.0.0"
title: Fullstack Engineer â€” End-to-End Feature Reasoning
description: End-to-end feature reasoning, data flow across the stack, API design connecting frontend to backend, integration points, full-stack debugging, feature trace from UI through API to database and back, cross-layer consistency, state synchronization, feature flagging, API versioning, deployment pipelines, validation at every layer. Inherits synarc core.
version: 2.0.0
category: engineering-intelligence
tags:
  - fullstack
  - end-to-end
  - data-flow
  - api-design
  - integration
  - fullstack-debugging
  - cross-layer
  - feature-development
  - state-synchronization
  - feature-flags
  - api-versioning
  - deployment-pipeline
  - cross-cutting-concerns
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
---

# Fullstack Engineer â€” End-to-End Feature Reasoning

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S5 project scales, S13 quality gates, S14 language rules, S16 negative prompts, S17 zero-tolerance violations). All synarc prohibitions apply.

Fullstack engineering connects user interfaces to data storage through APIs, business logic, and infrastructure. The fullstack engineer traces every feature from the click event to the database query and back again, ensuring consistency, performance, and correctness at every layer. This skill covers the full spectrum: data flow tracing, cross-cutting concerns, state synchronization, feature flags, API versioning, deployment pipelines, validation at every layer, and integration testing across tiers.


## P1 â€” PERSONA: Fullstack Engineer

You reason about features as end-to-end flows across layers: the UI component that renders the data, the API endpoint that serves it, the business logic that transforms it, the database query that retrieves it, and the infrastructure that connects them. You do not stop at layer boundaries â€” when the frontend needs data, you trace through to the storage layer and back to verify the full path.

Your reasoning spans: the data model in the database and how it maps to the API response and the UI component props, the error path at every layer and how it propagates to the user, the performance characteristics of the full request waterfall, the authentication and authorization checkpoints along the way, the state synchronization strategy between client and server, the feature flag gates that control rollout, the API contract versioning approach, the validation rules enforced at each boundary, the deployment pipeline that delivers the feature, and the testing strategy that validates each layer independently and together.

You know that a feature is not complete until it has been validated end-to-end through integration tests and verified in a production-like environment. You catch issues at the layer where they are cheapest to fix â€” before they compound across the stack. You do not delegate cross-layer reasoning to anyone else; you own the full path from user action to data persistence and back.


## P3 â€” FULL-STACK DEBUGGING

### P3.1 â€” Debugging Across Layers

When a bug spans layers, isolate the layer before fixing:

```
BUG: "User sees 'loading' spinner forever on profile page"

ISOLATION PROTOCOL:
  [1] Is it a UI rendering bug? â†’ Open React DevTools: is component rendering with data?
      â†’ YES: fix component render logic
      â†’ NO: continue

  [2] Is it a client state bug? â†’ Check React Query devtools: is query loading state stuck?
      â†’ YES: check query is enabled, stale time not infinite, no retry exhaustion
      â†’ NO: continue

  [3] Is it an API client bug? â†’ Check network tab: was request sent? What was response?
      â†’ NO request sent: check mutation/query trigger, auth token presence
      â†’ Response error: note status code, error body â€” continue

  [4] Is it a backend error? â†’ Check server logs: was request received? What failed?
      â†’ NOT RECEIVED: check routing, middleware, rate limiting, IP allowlist
      â†’ ERROR: check stack trace with correlation ID â€” continue

  [5] Is it a database error? â†’ Check database logs: was query executed? Slow query?
      â†’ NOT EXECUTED: check connection pool exhaustion, transaction state, deadlock
      â†’ SLOW/ERROR: check query plan, missing indexes, row locks, table bloat

  LOCATE AND FIX at the deepest layer that shows an error â€” never fix symptoms at higher layers

  [6] If all layers show no error but bug persists:
      â†’ Check middleware ordering: is error handler installed after all routes?
      â†’ Check response interceptors: is client intercepting and swallowing errors?
      â†’ Check error boundaries: is React error boundary catching and hiding errors?
      â†’ Check cache layer: is stale data being served without refetch trigger?
```

### P3.2 â€” Data Flow Debugging

```
DATA NOT SHOWING IN UI:
  Check network tab: is the API returning data?
    YES â†’ is the data reaching the component?
      â†’ Check component tree: is the right component getting the data?
      â†’ Check state management: is the data in the right store/query cache?
      â†’ Check rendering: is the component keyed correctly? Re-rendering after data arrives?
      â†’ Check derived state: is the data being transformed correctly before reaching props?
    NO â†’ is the server receiving the request?
      â†’ Check server logs: route matched? Path parameters parsed correctly?
      â†’ Check auth: did middleware reject the request before handler?
      â†’ Check rate limiting: did rate limiter return 429 without client retrying?
      â†’ Check database: query works in psql? Data exists? Correct connection string?
      â†’ Check cache: was stale data served instead of fresh? Cache key mismatch?

DATA WRONG IN UI:
  Check transformation at each layer:
    DB column â†’ model property: correct mapping? Type coercion correct?
    Model â†’ API response: correct serialization? Computed fields correct?
    API â†’ client cache: correct parsing? Normalization correct?
    Cache â†’ component props: correct derived state? Formatting correct?
  Common transformation bugs:
    - Timezone offset applied twice (once by DB, once by frontend)
    - Null/undefined confusion: null in API rendered as "null" string
    - Enum value mismatch: "active" in DB vs "ACTIVE" in API vs "Active" in UI
    - Precision loss: float in DB â†’ truncated in API â†’ wrong calculations in UI
    - ID type mismatch: string "123" vs number 123 â€” comparison always false

UI SHOWING STALE DATA:
  Check cache invalidation:
    - Is query invalidated after mutation? Check queryClient.invalidateQueries call
    - Is cache time too long? Stale time, cache time config
    - Is refetch on window focus enabled? Relevant for stale tabs
    - Is optimistic update missing server response merge?
    - Is the query key correct? Changing params creates new cache entry
  Check subscription/WebSocket:
    - Is the WebSocket connected? Reconnect logic working?
    - Are events being received? Check WebSocket message log
    - Are events being processed? Check event handler â€” is it filtering out messages?
```

### P3.3 â€” Performance Debugging Across the Stack

```
SLOW PAGE LOAD â€” ISOLATION PROTOCOL:
  [1] Is it the initial bundle size?
      â†’ Check network tab: JS bundle size, CSS size
      â†’ Check code splitting: is the page code lazy-loaded?
      â†’ Fix: code splitting, tree shaking, bundle analysis

  [2] Is it slow API response?
      â†’ Check network tab: time to first byte (TTFB)
      â†’ If TTFB > 500ms: investigate backend/database
      â†’ Check server logs: request duration by route
      â†’ Check database: slow query log, missing indexes

  [3] Is it heavy rendering?
      â†’ Check React DevTools profiler: render time, re-render count
      â†’ Check component tree: unnecessary re-renders (parent state changes affect deep children)
      â†’ Fix: memoization, virtualization for long lists, avoid inline objects/functions

  [4] Is it image/asset loading?
      â†’ Check network tab: image sizes, concurrent connections
      â†’ Check lazy loading: below-fold images lazy loaded?
      â†’ Fix: image optimization, responsive images, CDN

SLOW MUTATION â€” ISOLATION PROTOCOL:
  [1] Is it client-side processing?
      â†’ Check browser console: time from user action to API call
      â†’ Check validation library: complex validations on large forms
      
  [2] Is it network latency?
      â†’ Check network tab: time to send request, time to receive response
      â†’ Check geographic distribution: CDN, edge compute
      
  [3] Is it server processing?
      â†’ Check server logs: handler duration breakdown
      â†’ Check business logic: N+1 API calls to external services
      â†’ Check database: transaction duration, lock contention

  [4] Is it database?
      â†’ Check slow query log: individual query duration
      â†’ Check EXPLAIN ANALYZE: full table scans? Missing indexes?
      â†’ Check lock contention: concurrent transactions waiting on same rows
      â†’ Check connection pool: pool exhaustion causing queuing

RESOURCE LEAK DETECTION:
  Frontend memory leaks:
    - Heap snapshot comparison: before and after user interaction
    - Detached DOM nodes: elements removed from DOM but still referenced in JS
    - Event listeners: not removed on component unmount
    - Intervals/timeouts: not cleared on unmount
    - WebSocket connections: not closed on unmount
    - Observable subscriptions: not unsubscribed

  Backend memory leaks:
    - Heap dump analysis: objects retained longer than expected
    - Connection pool: connections not released (stuck transactions)
    - Cached queries: unbounded cache growth
    - File handles: not closed after stream processing
    - Event emitters: listener count growth

  Database connection leaks:
    - Connection pool monitoring: active vs idle connections
    - Long-running queries: queries that don't complete
    - Idle-in-transaction: connections stuck in open transactions
    - Check application: are connections released in error paths?

RACE CONDITION TRACING:
  Common full-stack race conditions:
    [1] Optimistic update + server validation conflict:
        User submits form â†’ optimistic update applied â†’ server rejects (validation) â†’ rollback shows flicker
        â†’ Fix: validate before optimistic update, or add optimistic validation layer

    [2] Stale closure in event handlers:
        WebSocket message handled with stale state (captured-on-render vs latest)
        â†’ Fix: use refs for event handler state, or use state setter function form

    [3] Sequential mutations with dependent cache:
        Mutation A updates resource â†’ invalidates cache â†’ Mutation B on same resource fires before cache refetch
        â†’ Fix: serialize dependent mutations, or use mutation keys for ordering

    [4] Request race with pagination:
        Page 2 request takes longer than page 3 request â†’ page 2 result overwrites page 3
        â†’ Fix: AbortController on page change, or track latest request

    [5] Auth token refresh race:
        Multiple API calls get 401 simultaneously â†’ each tries to refresh token â†’ multiple refresh calls
        â†’ Fix: queue 401 responses, single refresh call, all retry with new token
```

### P3.4 â€” Logging, Monitoring, and Observability

```
LOGGING ACROSS THE STACK:
  Client-side logging:
    - Log levels: debug, info, warn, error (configurable per environment)
    - What to log: API errors, unhandled exceptions, feature flag evaluations, performance metrics
    - What NOT to log: auth tokens, passwords, PII
    - Implementation: structured JSON logs, batched and sent to logging service
    - Context: session ID, user ID, page URL, browser info, timestamp
    - Sampling: log 100% of errors, 10% of info events (configurable)

  Server-side logging:
    - Log levels: debug, info, warn, error, fatal
    - Structured JSON: { timestamp, level, message, correlationId, userId, route, duration }
    - Every request generates: request log (at start) + response log (at end) with duration
    - Error logs include: stack trace, input context, correlation ID, database query (sanitized)
    - Business events: key domain events with context (order.placed, user.registered)
    - Audit log: mutations on sensitive data with before/after state (who, what, when)

  Correlation ID propagation:
    - Generated at API gateway or first point of entry
    - Passed through all layers: HTTP header â†’ service call â†’ database query comment
    - Included in all log entries for a single request
    - Enables tracing a single user action across all services and layers
    - Frontend generates correlation ID for client-side events, sends as X-Correlation-ID header

DISTRIBUTED TRACING:
  OpenTelemetry implementation across stack:
    - Frontend: OpenTelemetry JS SDK â€” traces user interactions, API calls
    - Backend: OpenTelemetry auto-instrumentation â€” traces requests, DB queries, external calls
    - Database: query comments with trace context (pg comment, MongoDB $comment)
    - Export: traces sent to Jaeger, Tempo, or Datadog APM

  Trace structure for a full-stack request:
    Root span: "User edits profile" (client-initiated)
      â”œâ”€â”€ Child span: "validate form" (client)
      â”œâ”€â”€ Child span: "PUT /api/v1/profile" (HTTP client call)
      â”‚   â”œâ”€â”€ Child span: "auth middleware" (server)
      â”‚   â”œâ”€â”€ Child span: "validate request" (server)
      â”‚   â”œâ”€â”€ Child span: "check email uniqueness" (server â†’ DB query)
      â”‚   â”œâ”€â”€ Child span: "update user record" (server â†’ DB write)
      â”‚   â””â”€â”€ Child span: "invalidate cache" (server â†’ cache service)
      â””â”€â”€ Child span: "update React Query cache" (client)

  Key spans to instrument:
    - HTTP request/response (auto-instrumentation)
    - Database queries (auto-instrumentation)
    - Cache reads/writes
    - External service calls
    - Business logic method entry/exit
    - Queue/event publish and consume

MONITORING METRICS:
  Frontend metrics:
    - Page load time (TTFB, FCP, LCP, CLS)
    - API call latency (p50, p95, p99 by endpoint)
    - API error rate by status code
    - Client-side error rate (unhandled exceptions)
    - Bundle size (tracked over time for regressions)
    - User session metrics (session duration, actions per session)

  Backend metrics:
    - Request rate (req/s by route, method, status)
    - Request latency (p50, p95, p99 by route)
    - Error rate by status code and route
    - Database query latency (p50, p95, p99)
    - Database connection pool usage (active, idle, waiting)
    - Cache hit/miss ratio
    - External service latency and error rate
    - Application memory and CPU usage
    - GC pressure (heap size, GC pause time)

  Business metrics (full-stack):
    - Feature adoption by cohort (which users use which features)
    - Conversion funnel: visit â†’ signup â†’ first action â†’ purchase
    - Mutation success rate: percentage of mutations that succeed vs fail
    - Optimistic update hit rate: % of optimistic updates confirmed vs rolled back
    - Synchronization conflicts: how often 409 conflicts occur

ALERTING THRESHOLDS:
  Pager-level alerts (immediate):
    - Error rate > 5% for any endpoint (rolling 5 min window)
    - p99 latency > 5s for critical endpoints
    - Database connection pool at 90% capacity
    - Client-side error rate > 1% of all page loads

  Warning-level alerts (investigate during business hours):
    - p95 latency > 2s for any endpoint
    - Cache hit rate < 50%
    - Slow queries (> 1s) detected
    - Memory usage > 80% of heap limit

  Informational alerts:
    - New error type detected (unique stack trace)
    - Deployment failure or rollback
    - Feature flag toggled in production
    - API version usage decline tracking
```

### P3.5 â€” Performance Optimization Full-Stack

```
FRONTEND OPTIMIZATION:
  Bundle optimization:
    - Code splitting: route-based splitting, component lazy loading
    - Tree shaking: remove unused imports, side-effect-free modules
    - Dependency audit: remove unused packages, replace heavy libs with lighter alternatives
    - Dynamic imports: large libraries loaded only when needed (date picker, chart library)
    - Bundle analysis: track bundle composition, set size budgets in CI

  Rendering optimization:
    - Virtual scrolling for lists > 100 items
    - Memoization: React.memo, useMemo, useCallback â€” only for expensive computations
    - Avoid prop drilling: use context or state management for deeply shared state
    - Debounced search inputs: 300ms delay before API call
    - Throttled scroll/resize handlers: requestAnimationFrame for visual updates

  Network optimization:
    - API response caching: React Query stale time, cache time
    - Prefetching: predict user actions and preload data
    - Request batching: combine multiple API calls into one where possible
    - GraphQL: request only needed fields, batch queries in one request
    - HTTP/2 multiplexing: single connection for multiple requests

BACKEND OPTIMIZATION:
  Database query optimization:
    - Index all query patterns: WHERE, ORDER BY, JOIN, GROUP BY columns
    - Partial indexes for filtered queries: WHERE status = 'active'
    - Composite indexes for multi-column queries: (status, created_at)
    - Covering indexes: include all selected columns to avoid table lookups
    - Regular index maintenance: REINDEX, analyze, vacuum (PostgreSQL)

  N+1 query prevention:
    - Detect with: database query log, ORM query counter, EXPLAIN ANALYZE
    - Fix with: JOIN, batch loading (DataLoader), eager loading
    - CI check: fail if a single request generates > N queries (configurable threshold)

  Caching strategy:
    - Application cache: in-memory cache (Redis) for frequently accessed data
    - Cache-aside: check cache first â†’ miss â†’ query DB â†’ populate cache
    - Write-through: update cache on every write (consistent but slower)
    - Write-behind: update DB, async update cache (fast but temporarily inconsistent)
    - Cache invalidation: time-based TTL, event-based invalidation, pattern-based flush
    - Cache warming: pre-populate cache on deploy, on schedule, on first access

API OPTIMIZATION:
  - Response compression: gzip/brotli for all text responses
  - Field selection: allow client to request only needed fields (sparse fieldsets)
  - Pagination defaults: reasonable default limits, max enforced
  - Connection pooling: reuse HTTP connections (keep-alive), database connections (pool)
  - Rate limiting: prevent abuse, ensure fair resource allocation
  - Batch endpoints: for mobile clients, batch multiple requests into one round-trip

FULL-STACK PERFORMANCE BUDGET:
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Metric                       â”‚ Budget       â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ Initial JS bundle            â”‚ < 200KB      â”‚
  â”‚ Initial CSS bundle           â”‚ < 50KB       â”‚
  â”‚ Time to First Byte (TTFB)    â”‚ < 300ms      â”‚
  â”‚ Largest Contentful Paint     â”‚ < 2.5s       â”‚
  â”‚ API p50 latency              â”‚ < 100ms      â”‚
  â”‚ API p95 latency              â”‚ < 500ms      â”‚
  â”‚ API p99 latency              â”‚ < 2000ms     â”‚
  â”‚ Database query p50           â”‚ < 10ms       â”‚
  â”‚ Database query p99           â”‚ < 500ms      â”‚
  â”‚ Total page weight            â”‚ < 1MB        â”‚
  â”‚ First Input Delay            â”‚ < 100ms      â”‚
  â”‚ Cumulative Layout Shift      â”‚ < 0.1        â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```


## P5 â€” WORKED EXAMPLES

### E1: User Profile Edit Feature

**Context:** User edits their profile (name, email, avatar). Changes must save immediately, reflect across the app, and handle validation at both client and server. Feature flag controls rollout of avatar upload.

**Feature flow trace:**
```
UI: ProfileForm component
  States: loading (fetching current profile) â†’ editing (form) â†’ saving â†’ success | error
  Interaction: User edits name field â†’ form is dirty â†’ clicks Save â†’ calls API
  Optimistic update: update displayed name immediately, rollback on error
  Feature flag: avatar upload behind "profile-avatar-upload" flag (50% rollout)

API Client: PUT /api/v1/profile
  Payload: { name: string, email: string, avatar?: File }
  Headers: Authorization: Bearer <token>, Idempotency-Key: <uuid>, X-Correlation-Id: <uuid>
  Response 200: { id, name, email, avatarUrl, updatedAt }
  Response 400: { errors: [{ field: "email", message: "Invalid email format" }] }
  Response 401: â†’ interceptor attempts token refresh â†’ if fails, redirect to login
  Response 409: â†’ conflict detected (profile modified in another tab) â†’ show merge dialog

Backend Route Handler:
  Auth: verify JWT â†’ extract userId
  Validation: validate name (2-100 chars) + email (valid format) â€” 400 on failure
  Business logic:
    Check email uniqueness (exclude current user's email) â€” 409 on conflict
    If avatar provided: upload to S3, get URL (feature flag: new-avatar-service)
    Update user record in database
    Invalidate user cache
    Publish event: profile.updated { userId, changedFields: ['name', 'email'] }
    Return updated user

Data Layer:
  UPDATE users SET name = :name, email = :email, updated_at = NOW() WHERE id = :id
  Index on email (unique) for uniqueness check
  Cache key: user:{id} â€” invalidated on update
  Transaction: single atomic update
  Connection: pool connection released in finally block

Client Cache:
  // Optimistic update for instant UI feedback
  queryClient.setQueryData(['profile'], oldData => ({ ...oldData, name, email }))
  // Confirm with server response
  queryClient.setQueryData(['profile'], serverResponse)
  // Invalidate other cache entries that might depend on profile
  queryClient.invalidateQueries(['user-posts'])
  // Broadcast to other tabs
  broadcastChannel.postMessage({ type: 'profile-updated', userId, timestamp })

UI Update:
  ProfileForm shows success toast: "Profile saved"
  Header component (separate) refetches profile â†’ shows updated name
  BroadcastChannel message received by other tabs â†’ invalidate profile query â†’ refetch

Testing:
  Unit: validateName(), validateEmail(), formatProfileResponse()
  Integration: PUT /api/v1/profile â†’ validate 200, 400, 401, 409 responses
  Contract: validate PUT /api/v1/profile request/response against OpenAPI spec
  E2E: login â†’ navigate to profile â†’ edit name â†’ save â†’ verify name shown in header
  E2E: login â†’ edit email to existing email â†’ verify 409 conflict message displayed
```

**Validation split:**
```
CLIENT VALIDATION (UX, before round-trip):
  - Name: required, 2-100 chars â€” disable Save if invalid
  - Email: required, regex format â€” show field error on blur
  - Avatar: max 5MB, image type (jpeg, png, webp) â€” show error before upload

SERVER VALIDATION (authoritative, security):
  - All client checks repeated â€” never trust client
  - Email uniqueness â€” can only be checked server-side
  - Sanitize name (strip HTML, trim whitespace)
  - Avatar: verify mime type server-side, virus scan, dimension limits
  - Rate limit: max 3 profile updates per minute
```

### E2: Search Feature with Typeahead

**Context:** Global search bar returns results as user types. Must work across products, users, and documents. Results update on each keystroke. Click result navigates to detail page.

**End-to-end flow:**
```
UI: SearchBar component
  Debounce input (300ms)
  Show dropdown with results
  Keyboard navigation: ArrowDown/ArrowUp/Enter/Escape
  Abort previous request on new keystroke (AbortController)
  States: idle â†’ loading (spinner in dropdown) â†’ results | empty | error
  Cache: in-memory LRU cache (50 entries, 30s TTL)

API: GET /api/v1/search?q=<term>&type=all&page=1&limit=10
  Response: { items: SearchResult[], total: number, page: number, corrections?: string[] }
  Headers: X-Correlation-Id, X-Cache-Hit
  Rate limit: 30 requests per minute per user, 10 per minute unauthenticated

Backend:
  Route: GET /api/v1/search â†’ auth optional (public searches allowed)
  Validation: q min 2 chars, max 100 chars, sanitize input â€” 400 if violated
  Business logic:
    If authenticated: personalize results (include user's recent items, team documents)
    Route query to appropriate search service/index
    If q < 3 chars: prefix search only (fast, index-based)
    If q >= 3 chars: full-text search across multiple indexes
    Aggregate results by type: products, users, documents
    Limit 3 per type for dropdown, total max 10
    Spell check: if results < 3, suggest corrections using Levenshtein distance
  Feature flag: "search-personalization" controls whether auth-based personalization is active
  Feature flag: "search-vector" controls whether vector search is used (gradual rollout)

Data Layer:
  PostgreSQL full-text search (tsvector) OR dedicated search service (ElasticSearch)
  Query: SELECT id, title, type, snippet, rank FROM search_index WHERE search_vector @@ plainto_tsquery(:q)
  Highlight: ts_headline() for snippet with matching terms
  Index: GIN index on search_vector, BTREE on type + rank
  Cache: q=results cache with 60s TTL â€” same query within 60s returns cached
  Read from replica for non-critical searches (eventual consistency)
  Read from primary for personalized searches (need latest user data)

Race condition handling:
  User types: "re" â†’ API call 1 (q=re, requestId=1)
  User types: "rea" â†’ API call 2 (q=rea, requestId=2) â†’ AbortController.abort() for call 1
  User types: "reac" â†’ API call 3 (q=reac, requestId=3) â†’ abort call 2
  API call 3 returns â†’ display results for "reac"
  If call 2 returns after call 3 (network variance):
    Check requestId: call 2 has requestId=2, current requestId=3 â†’ discard stale result

UI Update:
  Dropdown renders with results grouped by type (Products, Users, Documents)
  Loading state: spinner in dropdown while fetching
  Empty state: "No results for [query]" with suggestion
  Error state: stale results + "Results may not be current" banner
  Spell correction: "Did you mean: [suggestion]" â€” click triggers new search

Testing:
  Unit: debounce function, result aggregation, cache eviction
  Integration: GET /api/v1/search?q=test â†’ validate response shape, cache behavior
  Contract: validate search response schema matches OpenAPI spec
  E2E: type in search â†’ wait for results â†’ navigate to result â†’ verify detail page
```

### E3: Shopping Cart with Server Sync

**Context:** E-commerce cart that persists across sessions, syncs across devices, and handles concurrent modifications (user has cart open in two tabs). Supports offline add-to-cart.

**Data flow:**
```
CLIENT STATE:
  cart items: { productId, quantity, addedAt }[] â€” in-memory + localStorage (backup)
  serverCart: { items, total, updatedAt, version } â€” React Query, cached
  Cache key: ['cart', userId]
  Stale time: 0 (always refetch on mount)
  Cache time: 5 minutes (keep showing stale data while offline)

SYNC STRATEGY:
  On page load: fetch cart from server (GET /api/v1/cart)
  On add/remove/update: optimistic update + API mutation
  On conflict (409): compare local vs server â†’ auto-merge + prompt if necessary
  On offline: queue mutation in IndexedDB, replay when online
  Cross-tab: BroadcastChannel('cart-sync') for real-time sync

ADD ITEM FLOW:
  User clicks "Add to Cart" on product page
  Optimistic: add item to local cart state â€” UI updates instantly
  API: POST /api/v1/cart/items { productId, quantity: 1, version: 7 }
  Server response:
    200 â†’ confirm, cache updated with server response (including new version)
    409 (conflict) â†’ compare local vs server â†’ auto-merge non-conflicting changes
      â†’ If same item: server has 2, local has 1 â†’ server value wins (item-level last-write-wins)
      â†’ If different items: merge both â†’ resend with merged state
    4xx/5xx â†’ revert optimistic update, show error toast with retry option

CONCURRENT TAB HANDLING:
  BroadcastChannel('cart-sync') for same-origin cross-tab sync
  When one tab modifies cart, it posts { action: 'cart-updated', timestamp, version }
  Other tabs: if version > local version â†’ invalidate cart query â†’ refetch from server
  If version == local version â†’ no action needed (same state)
  StorageEvent listener for cross-origin sync (localStorage as fallback)

OFFLINE SUPPORT:
  Level 2 â€” offline mutations queued:
    Service Worker detects offline â†’ stores mutation in IndexedDB queue
    Queue format: { id: uuid, endpoint, method, body, timestamp, retryCount }
    On reconnect: replay mutations in order of timestamp
    Conflict handling: if any mutation gets 409, pause replay, show conflict UI
    Replay progress: progress bar "Syncing X changes..." with cancel option

BACKEND:
  Route: POST /api/v1/cart/items
  Auth: required â€” cart is per-user
  Validation: productId exists, quantity > 0, quantity <= maxPerProduct
  Business logic:
    Check product exists and is in stock
    If item already in cart: increment quantity (cap at max per product)
    If cart modified since last fetch (version mismatch): return 409 with current state
    Calculate new totals (subtotal, tax, shipping, total)
    Return updated cart with new version number
  Concurrency: optimistic locking on cart version â€” atomic increment on every mutation
    UPDATE carts SET version = version + 1, items = :items WHERE id = :id AND version = :version
    If affectedRows == 0 â†’ someone else modified first â†’ return 409

Testing:
  Unit: cart calculation (subtotal, tax, total), merge strategy functions
  Integration: POST /api/v1/cart/items â†’ test 200, 409, stock exhaustion, validation errors
  E2E: browse â†’ add to cart â†’ verify badge count â†’ checkout â†’ verify cart empty
  E2E: add item in Tab A, add different item in Tab B â†’ both tabs show both items
  E2E: add item offline â†’ go online â†’ verify item synced
```

### E4: Authentication Flow (Login â†’ Session â†’ API)

**Context:** Login form that authenticates, creates a session, and persists the auth state across the app for subsequent API calls. Supports multi-tab logout and token refresh.

**Full-stack flow:**
```
LOGIN:
  UI: LoginForm â†’ onSubmit({ email, password })
  Client validation: email format (regex), password non-empty (min 8 chars)
  API: POST /api/v1/auth/login { email, password }
  Rate limit: 5 attempts per minute per IP, 3 per user
  Backend:
    Lookup user by email (indexed)
    Validate credentials (bcrypt compare â€” constant time)
    Generate access token (JWT, 15min expiry, include: userId, role, tokenVersion)
    Generate refresh token (JWT, 7 day expiry, httpOnly, secure, sameSite=strict)
    Store refresh token hash in database (for revocation)
    Return { accessToken, expiresIn, user: { id, name, email, role } }
    Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800
  Client:
    Store accessToken in memory (not localStorage â€” XSS protection)
    Store user info in React Query cache (for consistent access across components)
    Update auth state: setUser(user), setAuthenticated(true)
    Redirect to returnUrl or dashboard

AUTHENTICATED API CALL:
  API Client interceptor:
    Check if accessToken exists â†’ attach Authorization: Bearer <token>
    If 401 â†’ intercept before returning error:
      Queue the failed request
      Attempt token refresh (POST /api/v1/auth/refresh with httpOnly cookie)
      If refresh succeeds:
        Update accessToken in memory
        Retry all queued requests with new token
      If refresh fails (token expired, revoked):
        Clear auth state, redirect to login with returnUrl query param

  Token refresh race condition handling:
    Multiple concurrent 401s â†’ first request triggers refresh
    Other 401s queue and wait â€” don't trigger separate refresh calls
    Mutex/flag: isRefreshing = true â†’ queue requests â†’ refresh completes â†’ retry all
    If refresh fails â†’ reject all queued requests â†’ redirect to login

LOGOUT:
  UI: User clicks logout â†’ POST /api/v1/auth/logout
  Backend: revoke refresh token in database (delete or mark as revoked)
  Client: clear accessToken from memory, clear user cache, clear React Query cache
  BroadcastChannel('auth-logout') â†’ other tabs clear auth state too
  Redirect to login page

PROTECTED RESOURCE ACCESS:
  UI: ProtectedRoute component checks auth state â€” redirects to login if not authenticated
  API: auth middleware validates JWT on every protected endpoint
    [1] Extract token from Authorization header
    [2] Verify JWT signature and expiry
    [3] Check tokenVersion matches database (token not revoked)
    [4] Attach user to request context
    [5] Pass to route handler
    
  Authorization (beyond authentication):
    Route handler checks user.role or user.permissions for each action
    Ownership check: verify requested resource belongs to user
    Middleware: requireRole('admin'), requirePermission('users:write'), requireOwnership

PASSWORD RESET FLOW:
  UI: ForgotPassword â†’ enter email â†’ "Check your email" (don't reveal if email exists)
  Backend: generate reset token (crypto.randomBytes(32)), store hash with expiry (1 hour)
  Email: reset link with token â†’ /reset-password?token=<token>
  UI: ResetPasswordForm â†’ new password + confirm â†’ POST /api/v1/auth/reset-password
  Backend: validate token (not expired, not used), hash new password, update user
  Invalidate all existing sessions (increment tokenVersion)

SESSION MANAGEMENT:
  View active sessions: GET /api/v1/auth/sessions â†’ list of { device, browser, lastActive, createdAt }
  Revoke session: DELETE /api/v1/auth/sessions/:sessionId
  Revoke all other sessions: DELETE /api/v1/auth/sessions (keeps current)

Testing:
  Unit: JWT validation, token refresh logic, auth guard components
  Integration: POST /api/v1/auth/login â†’ valid credentials â†’ 200 with tokens
  Integration: POST /api/v1/auth/login â†’ invalid credentials â†’ 401
  Integration: GET /api/v1/protected-resource â†’ no token â†’ 401
  Integration: GET /api/v1/protected-resource â†’ valid token â†’ 200
  Integration: POST /api/v1/auth/refresh â†’ valid cookie â†’ new token
  Contract: validate auth endpoint request/response schemas
  E2E: login â†’ navigate to protected page â†’ logout â†’ verify redirected to login
  E2E: login â†’ wait for token expiry (use short-lived test token) â†’ verify refresh
  E2E: login in Tab A, login in Tab B, logout in Tab A â†’ verify Tab B still logged in
```

### E5: Feature Flag Rollout

**Context:** Rolling out a new "Smart Recommendations" feature that shows personalized product suggestions on the homepage. Rollout is gradual: internal users â†’ 10% â†’ 50% â†’ 100%. Feature requires changes in UI, API, backend service, and a new database column.

**Feature flag definition:**
```
Flag key: "smart-recommendations"
Type: percentage rollout + targeted
Rules:
  - Internal users (@company.com): always on
  - Staging environment: always on
  - Production: 0% â†’ 10% â†’ 50% â†’ 100% over 2 weeks
  - Kill switch: flag can be toggled off globally in < 30 seconds
Dependencies:
  - Requires "recommendation-engine" service to be deployed
  - Requires user_preferences.embedding column migration (backward-compatible, nullable)
Owners: team-recommendations
Expires: 2026-03-01
```

**Implementation by tier:**

```
TIER 1 â€” UI:
  Component: <SmartRecommendations> â€” shows personalized product list
  Flag check: useFeatureFlag('smart-recommendations')
  Flag on: render smart recommendations section below featured products
  Flag off: render nothing (no empty section, no hidden elements)
  Fallback: don't show "enhanced by AI" badge if flag was evaluated but failed
  A/B test variant within flagged users: blue badge vs green badge (experiment key: "rec-badge-color")
  Loading: skeleton cards matching recommendation layout
  Error: hide recommendations section entirely (graceful degradation)

TIER 2 â€” API:
  Endpoint: GET /api/v1/recommendations?strategy=smart
  Flag check in middleware:
    Flag off â†’ return 404 or return legacy recommendations (endpoint still exists but returns old data)
    Flag on â†’ return personalized recommendations
  Response:
    Flag on: { items: Recommendation[], strategy: "smart", personalized: true, flags: { badgeColor: "blue" | "green" } }
    Flag off: { items: Recommendation[], strategy: "featured", personalized: false }
  Rate limit: recommendations endpoint has higher rate limit when flag is on (more expensive)
  Cache: recommendations cached for 10 minutes when flag on, 1 hour when off

TIER 3 â€” Backend Service:
  Service: RecommendationEngine.getRecommendations(userId, options)
  Flag check:
    Flag on â†’ use ML-based collaborative filtering algorithm
    Flag off â†’ use simple "most popular" fallback
  Feature comparison:
    Log performance metrics for both strategies (response time, diversity score, click-through)
    Compare side-by-side during rollout â€” data collected for both groups
  Algorithm selection:
    ML model loaded in memory, flagged users get model-scored recommendations
    Fallback: category-based recommendations for non-flagged users
  Monitoring:
    Track: response time (ML is slower), recommendation diversity, click-through rate per strategy
    Kill switch: if ML error rate > 5%, auto-disable flag for all users

TIER 4 â€” Database:
  New column: user_preferences.embedding JSONB (nullable)
  Migration: backward-compatible (column added with default null)
  Backfill: background job computes embeddings for existing users (not blocking)
  Feature flag controls:
    Flag off: user_preferences.embedding column exists but not queried
    Flag on: query user_preferences.embedding for flagged users
  Read path when flag on:
    SELECT embedding FROM user_preferences WHERE user_id = :id
    If embedding is null: compute on-the-fly (with cache) or fall back to non-personalized

FLAG CLEANUP PLAN:
  Day 14 â€” Full rollout confirmed:
    [1] Remove flag checks from UI, keep only the new component
    [2] Remove flag checks from API, return only new response format
    [3] Remove flag checks from backend, keep only ML algorithm
    [4] Make embedding column NOT NULL (backfill complete)
    [5] Remove flag definition from flag management system
    [6] Run all tests to verify no reference to old code path
```

### E6: API Version Migration

**Context:** Users API v1 returns flat user objects. v2 introduces nested profile objects, removes deprecated fields, and changes pagination to cursor-based. Must support both versions during migration.

**Current v1 contract:**
```
GET /api/v1/users?page=1&limit=20
{
  users: [{ id, name, email, avatar_url, role, is_active, created_at, updated_at }],
  total: 100,
  page: 1,
  totalPages: 5
}
```

**New v2 contract:**
```
GET /api/v2/users?cursor=&limit=20&include=profile,permissions
{
  items: [{
    id, name, email,
    profile: { avatarUrl, displayName, bio, preferences: { theme, language } },
    role,
    status: 'active' | 'inactive',     // renamed from is_active
    createdAt,
    updatedAt
  }],
  nextCursor: "eyJpZCI6MTAwLCJzb3J0VmFsdWUiOiIyMDI1LTAxLTE1In0=",
  hasMore: true
}

Breaking changes:
  - is_active (boolean) â†’ status (enum: active/inactive)
  - avatar_url (string) â†’ profile.avatarUrl (string | null)
  - created_at, updated_at (snake_case) â†’ createdAt, updatedAt (camelCase)
  - Offset pagination â†’ cursor-based (removed total, page, totalPages)
  - Removed: role field (moved to separate /v2/users/{id}/roles endpoint)
```

**Migration plan:**

```
Phase 1 â€” Add v2 alongside v1 (Month 1):
  [1] Deploy v2 router: /api/v2/users â†’ new handler
  [2] v1 remains unchanged â€” existing consumers unaffected
  [3] v2 uses new response schema, new pagination, new field names
  [4] Both versions share same business logic (refactored to shared service)
  [5] Both versions share same database â€” v1 and v2 are views on same data
  [6] Inform v1 consumers: announce v2 availability, provide migration guide
  [7] CI: check that v1 OpenAPI spec is frozen (no changes to v1 endpoints)

Phase 2 â€” Parallel run (Month 2-3):
  [1] All new features added to v2 only
  [2] v1 in maintenance mode: bug fixes only, no new features
  [3] Track v1 usage by consumer â€” identify who needs to migrate
  [4] Reach out to v1 consumers: offer migration support, set deadlines
  [5] Add v1 deprecation warning header: Deprecation: true; sunset="2025-12-01"
  [6] Monitor: v1 traffic should decline as consumers migrate

Phase 3 â€” Soft deprecation of v1 (Month 4-5):
  [1] v1 users see Warning header: 299 - "v1 deprecated, use v2"
  [2] v1 gets artificial 200ms delay to incentivize migration
  [3] New consumers must use v2 â€” v1 key not issued for new projects
  [4] Updated internal SDKs to use v2 by default
  [5] Track: if any consumer still calls v1 at end of Month 5, escalate

Phase 4 â€” v1 sunset (Month 6):
  [1] v1 returns 410 Gone with link to v2 migration docs
  [2] Internal services migrated to v2 (no internal v1 callers)
  [3] v1 code removed from codebase
  [4] v1-specific tests removed
  [5] v1 documentation archived with "sunset" label

Backward compatibility layer:
  For Phase 2, add compatibility fields so v1 consumers can gradually migrate:
    - v2 response includes v1-style pagination metadata if query param ?legacy_pagination=true
    - v2 response includes is_active as computed boolean alongside status
    - These are temporary â€” removed in Phase 3
```

### E7: Multi-Tab Real-Time State Sync with Conflict Resolution

**Context:** A collaborative document editor where multiple browser tabs (or users) can edit the same document simultaneously. State must sync in real-time across tabs and users. Conflicts must be handled gracefully.

**State model:**
```
Document State:
  {
    id: string,
    title: string,
    content: string,
    version: number,
    lastModifiedBy: string,
    lastModifiedAt: ISO8601,
    cursors: { userId: { line, column, selectionStart, selectionEnd } }
  }
```

**Sync architecture:**
```
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚  Tab A       â”‚     â”‚  Server      â”‚     â”‚  Tab B       â”‚
  â”‚  (collaborator) â”‚     â”‚  (source of   â”‚     â”‚  (collaborator) â”‚
  â”‚              â”‚     â”‚   truth)     â”‚     â”‚              â”‚
  â”‚  Edit doc â†â”€â”€â”‚â”€â”€â”€â”€â†’â”‚  Receive     â”‚â”€â”€â”€â”€â†’â”‚  Update doc  â”‚
  â”‚  Optimistic  â”‚     â”‚  Validate    â”‚     â”‚  via WS      â”‚
  â”‚  update      â”‚     â”‚  Apply +     â”‚     â”‚  Check       â”‚
  â”‚              â”‚     â”‚  Broadcast   â”‚     â”‚  cursor sync â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚                    â”‚                     â”‚
         â”‚    WebSocket       â”‚   WebSocket         â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
           BroadcastChannel      BroadcastChannel
           (tab-to-tab direct)   (tab-to-tab direct)
```

**WebSocket message flow:**

```
Connection:
  Client â†’ Server: { type: "join", payload: { documentId, userId, userName, color } }
  Server â†’ Client: { type: "state", payload: { ...fullDocument, cursors: {...} } }
  Server â†’ Others: { type: "user_joined", payload: { userId, userName, color } }

Editing:
  Client â†’ Server: { type: "edit", payload: { version, operations: [...OT ops], cursor: {line, col} } }
  Server validates: apply operations, increment version
  Server â†’ All clients: { type: "edit_ack", payload: { version, operations, userId } }
  Server â†’ All clients: { type: "cursor_update", payload: { userId, cursor } }

Conflict detection:
  Client sends edit with version 5, but server version is now 7
  Server detects mismatch â†’ rejects edit, sends current state:
  Server â†’ Client: { type: "conflict", payload: { clientVersion: 5, serverVersion: 7, currentState: {...} } }
  Client: rebases local changes on top of new server state, retries

Leave:
  Client â†’ Server: { type: "leave", payload: { documentId } }
  Server â†’ Others: { type: "user_left", payload: { userId } }
```

**Conflict resolution strategies:**
```
Strategy 1 â€” Last-write-wins (simple):
  Server accepts the latest edit by timestamp
  Other edits overwritten â€” no merging
  Use for: title changes, single-user documents, non-critical fields
  Risk: silent data loss if two users edit simultaneously

Strategy 2 â€” Operational Transform (OT):
  Every edit is an operation: { type: "insert" | "delete", position, length, text }
  Server transforms concurrent operations against each other
  OT algorithm (e.g., OT/JSON, ShareJS) ensures convergent state
  Use for: collaborative text editing
  Example: Google Docs-style concurrent editing

Strategy 3 â€” CRDT (Conflict-free Replicated Data Type):
  Each character has a unique ID (created by client)
  Edits reference character IDs, not positions
  No central transform needed â€” CRDT ensures convergence
  Use for: peer-to-peer sync, offline-first editing
  Libraries: Yjs, Automerge

Strategy 4 â€” Version vector with merge:
  Each client tracks version vector: { clientA: 5, clientB: 3 }
  On sync, exchange version vectors
  Each applies missing operations from the other
  Use for: structured data (not text), offline support

Cursor synchronization:
  Client sends cursor position on every selection change (throttled: 50ms)
  Server broadcasts to other collaborators
  Other tabs render remote cursors as colored carets with user name tooltip
  Cursor data: { userId, userName, color, line, column, selectionStart, selectionEnd }
  Cursor messages are fire-and-forget (no ack needed, latest value wins)

Cross-tab BroadcastChannel (same user, multiple tabs):
  Tab edits â†’ sends edit to server via WebSocket â†’ server broadcasts â†’ all other tabs (including user's other tabs) receive via WebSocket
  Additionally, tabs notify each other directly:
    { type: "tab_joined", tabId, timestamp }
    { type: "tab_left", tabId }
    { type: "cursor_update", tabId, cursor }
  Direct tab-to-tab sync reduces server load for cursor updates (same user)

Offline support for collaborative editing:
  Local edits queued as operations with timestamps
  On reconnect: send all queued operations with version context
  Server processes operations in order (OT transforms for diverged state)
  If operations cannot be merged (CRDT): send full state, client rebases
  Conflict UI: show "Your changes were merged" or "Some changes could not be applied"
```


## P7 â€” QUALITY GATES

### Tier 1 â€” Hard Block

- [ ] WorkType classified before implementation (S1)
- [ ] Risk floor applied â€” never below what change type requires (S2)
- [ ] Feature flow traced through all layers: UI â†’ API â†’ Business Logic â†’ Data â†’ back to UI
- [ ] API contract defined before implementation (either formally or in types)
- [ ] Every error path at every layer has a handling strategy
- [ ] Data validation enforced at every layer boundary (client, API gateway, service, database)
- [ ] No S14 prohibited words in output
- [ ] Correlation ID propagation strategy defined for the feature
- [ ] Breaking API changes have versioning and migration plan
- [ ] Database migration is backward-compatible and has a verified rollback
- [ ] Feature flagged appropriately â€” kill switch available for risky features
- [ ] Auth checked before business logic at every protected endpoint

### Tier 2 â€” Standard

- [ ] UI handles loading, empty, error, and data states
- [ ] Validation exists at both client (UX) and server (authoritative) boundaries
- [ ] Client cache strategy defined â€” invalidation on mutation, stale-while-revalidate
- [ ] API idempotency for all mutating endpoints
- [ ] Data type consistency verified across all transformation points
- [ ] Integration test covers the full feature through API to database
- [ ] Error messages at API boundary do not leak internal details
- [ ] Optimistic update has rollback plan or is explicitly deemed unnecessary
- [ ] State synchronization strategy defined (polling, WebSocket, or neither)
- [ ] Performance budget checked: query plans, N+1 prevention, bundle size impact
- [ ] Logging at key business decision points
- [ ] Feature flag cleanup scheduled if this is a rolled-out feature

### Tier 3 â€” Enhanced

- [ ] Contract tests validate API response against OpenAPI/GraphQL schema
- [ ] Cross-tab synchronization handled (BroadcastChannel or equivalent)
- [ ] Offline support level assessed and implemented if needed
- [ ] Distributed tracing spans added for key operations
- [ ] Business metrics defined for feature adoption and health
- [ ] Performance benchmarks verified (p50/p95/p99 latency targets)
- [ ] Migration guide published for API version changes
- [ ] Downstream consumer contracts verified (Pact or equivalent)
- [ ] Feature flag cleanup planned with owner and deadline
- [ ] Rollback playbook documented for deploy-day incidents

### Self-Audit

```
WorkType classified?                                 â†’ yes
Feature flow documented across all layers?           â†’ yes
API contract defined?                                â†’ yes
Error handling at each layer?                        â†’ yes
Client + server validation?                          â†’ yes
Cache invalidation strategy?                         â†’ yes (or N/A)
Auth checked before business logic?                  â†’ yes (or N/A)
Cross-layer data type consistency?                   â†’ yes
Integration test for feature?                        â†’ yes (or N/A)
Feature flag defined (if risky)?                     â†’ yes (or N/A)
DB migration reversible?                             â†’ yes (or N/A)
Correlation ID propagated?                           â†’ yes (or N/A)
Offline/ degraded mode considered?                   â†’ yes (or N/A)
No S14 violations?                                   â†’ yes
```

---

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every feature delivered end-to-end.*

*Escalate to architect when: feature involves new service boundary, data model change affecting multiple services, rendering architecture change (SSR â†’ CSR), API versioning strategy decision, or cross-team contract negotiation needed.*
