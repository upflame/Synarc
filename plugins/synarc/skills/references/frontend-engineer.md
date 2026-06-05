---
title: "Frontend Engineer — UI Architecture & Rendering Strategy"
type: reference
status: active
version: 2.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - frontend
  - ui-architecture
  - component-design
  - state-management
  - rendering
  - accessibility
  - performance
  - responsive-design
  - css-architecture
---

# Purpose

Structured reasoning framework for frontend engineering — UI component architecture, state management, rendering strategies, accessibility-first design, performance budgets, responsive design, CSS architecture, and bundle optimization. Every decision affects perceived performance, accessibility, and user task completion.

# Scope

Component decomposition, composition patterns (compound/render-props/hooks/slots), state management decision trees, rendering strategy selection (SSR/SSG/CSR/ISR/streaming/hybrid), WCAG 2.2 accessibility compliance, Core Web Vitals optimization (LCP/INP/CLS), responsive design with container queries, CSS architecture (BEM/SMACSS/OOCSS/ITCSS), bundle optimization (splitting/tree-shaking). Does not cover backend or infrastructure concerns.

# Inputs

Design mockups, component requirements, user interaction patterns, performance budgets, target device/browser matrix, accessibility requirements.

# Output

Component tree with responsibility boundaries, state management architecture, rendering strategy with rationale, accessibility implementation, CSS architecture decisions, performance optimization plan with budgets.

# Notes

Inherits synarc core (S1 WorkType taxonomy, S5 project scales, S13 quality gates). Persona: reason about component trees, data flow through UI, rendering cycles, user interactions. Evaluate through UX, DX, production behavior, and team scalability lenses. Distinguish component state (ephemeral), application state (shared), server state (fetched), and URL state (shareable).

## 1. Component Decomposition

Three architectural layers:

| Layer | Responsibility | State | Testing |
|---|---|---|---|
| PAGE (route-level) | Data fetching, error/loading, compose features, SEO metadata | Server/URL state | Full route rendering, E2E |
| FEATURE (domain-level) | Encapsulate user-facing feature, owns local state | Local + shared | Data states, user workflows |
| PRESENTATIONAL (leaf-level) | Pure rendering, props in/JSX out | None | Storybook, prop combinations |

Decomposition rules: component doing data fetching + state + complex styling → split by concern. More than 5 props → likely multiple responsibilities. Hard to test without 3+ mocks → too coupled — extract data layer. Used in exactly one place → not a candidate for premature abstraction.

Atomic Design mapping:

| Level | Examples | Characteristics | State | Testing |
|---|---|---|---|---|
| ATOMS | Button, Input, Label | Smallest, no business logic, no data deps | None | Storybook with all prop variants, snapshot each |
| MOLECULES | SearchBar, DatePicker, FormField | Compose atoms, layout + interaction logic | Local (input value, open/closed) | State transitions, keyboard, validation |
| ORGANISMS | ProductList, CheckoutForm | Compose molecules, data fetching for domain | Server state + local UI | Loading/empty/error/data, user workflows |
| TEMPLATES | PageLayout, DashboardGrid | Arrange organisms in layout, no data/logic | None | Responsive breakpoints, slot rendering |
| PAGES | SearchPage, ProductDetailPage | One per route, compose template + organisms | All types | Full route, E2E workflows |

## 2. Composition Patterns

| Pattern | When to Use | Example | Performance Note |
|---|---|---|---|
| Compound Components | Sub-components share implicit state | Tabs, Accordion, Select | Memoize children, lazy load non-active |
| Slots | Multiple insertion points | Card with header/body/footer | Named props for <3 slots |
| Render Props | Parent controls rendering of child internals | DataFetcher providing data | Hooks often replace in modern React |
| Hooks | Stateful logic reuse without UI | useMediaQuery, useAuth | Compose multiple behaviors |
| Polymorphic `as` | Same component renders different HTML | Button as="a" vs as="button" | forwardRef with generic ref type |

Compound component example: `<Tabs><TabList><Tab>One</Tab></TabList><TabPanel>Content</TabPanel></Tabs>`. State via Context (activeIndex, onTabChange). Tab reads context, applies styles. TabPanel renders only if matches activeIndex.

Slots: named props for simple — `<Card header={<h2>Title</h2>}>`. Slot components for complex layouts. Prefer named props when <3 insertion points.

## 3. State Management Decision Tree

| State Type | Lifetime | Scope | Examples | Solution |
|---|---|---|---|---|
| LOCAL | Component lifetime | Single component + children | Form input, toggle, hover, drag | useState (simple), useReducer (complex) |
| SHARED | App session | Multiple components across tree | Auth, theme, notifications | Context (simple), zustand/redux (complex) |
| SERVER | Server-controlled | Derived from server data | User profile, product list | React Query, SWR, Apollo |
| URL | URL lifetime | Shareable, bookmarkable | Search params, filters, pagination | next/navigation, react-router |
| FORM | Form session | Form and its fields | Values, touched, errors | react-hook-form (complex), local (simple) |

Local state decisions: used only in this component? → useState/useReducer. Resets on navigation? → local is correct. Derived from other state? → useMemo, not useState.

Shared state decisions: read by 3+ unrelated components? → global state. Changes >10/sec? → avoid Context (re-renders) — use atomic (jotai/zustand). Auth? → global state + httpOnly cookie + in-memory.

Server state decisions: SOT on server? → server state library. Multiple components need same? → shared query key. Stale-while-revalidate acceptable? → background refetch. Data changes without user action? → polling/WebSocket. Read frequently, changes rarely? → long staleTime (5-30 min), cache in localStorage.

URL state decisions: bookmarkable? → URL params. Too complex? → store ID, fetch from server. Ephemeral (scroll, hover)? → NOT URL state — use local.

State management library comparison:

| Lib | Bundle | Boilerplate | DevTools | Async | SSR | Persistence |
|---|---|---|---|---|---|---|
| Context | ~0KB | Low | No | No | Manual | Manual |
| Zustand | ~2KB | Low | Yes | No | Manual | zustand/persist |
| Jotai | ~3KB | Low | Yes | No | Manual | jotai/persist |
| Redux Toolkit | ~12KB | Medium | Yes | createAsyncThunk | Manual | redux-persist |
| React Query | ~13KB | Low | Yes | Built-in | Built-in | queryClient.persist |

## 4. Rendering Strategy Selection

| Strategy | TTFB | Content Freshness | SEO | Interactivity | Best For |
|---|---|---|---|---|---|
| SSR | Higher (server per request) | Per request | Excellent | After hydrate | Auth, dynamic, SEO-needed |
| SSG | Lowest (CDN edge) | Stale between builds | Excellent | After hydrate | Blog, docs, marketing |
| CSR | Low (static assets) | Per request | Poor (requires JS) | Rich, instant | Auth apps, dashboards |
| ISR | Low (CDN edge) | On-demand revalidation | Excellent | After hydrate | CMS content, semi-dynamic |
| Streaming SSR | Progressive chunks | Per request | Excellent | Progressive | Data-heavy pages |

Rendering decision matrix:

| Condition | Public Static | Public Dynamic | Auth Static | Auth Dynamic |
|---|---|---|---|---|
| SEO required | SSG | SSR/ISR | N/A | N/A |
| No SEO | SSG/CSR | CSR | CSR/SSR | CSR/SSR |
| Real-time | CSR+WS | CSR+WS | CSR+WS | CSR+WS |
| Heavy interactivity | CSR | CSR | CSR | CSR |
| Content-first | SSG | SSR/ISR | N/A | SSR |
| Data freshness | ISR | SSR | ISR | SSR |
| Offline | CSR+SW | CSR+SW | CSR+SW | CSR+SW |

Hybrid rendering patterns:
- **Islands (Astro, Qwik):** Static HTML shell with isolated interactive "islands". Each island loads own JS independently. Use for mostly static content with few interactive widgets.
- **Progressive hydration:** Server-rendered HTML, hydrate components in priority order. Above-fold first, below-fold after interaction or idle. React selective hydration via Suspense boundaries.
- **Edge rendering:** Render at CDN edge instead of origin. Reduces TTFB for global audience. Vercel Edge Functions, Cloudflare Workers, Deno Deploy.

Streaming SSR architecture: `<Suspense fallback={<ShellSkeleton />}><MainContent /></Suspense>` — streams first (fast data). Subsequent Suspense boundaries stream as they resolve. Each boundary hydrates independently. Error in one doesn't break entire page. SEO crawlers see HTML content.

## 5. Accessibility-First Design (WCAG 2.2)

Four WCAG principles:

**PERCEPTIBLE:** Text alternatives for non-text content. Color + icon + pattern (not color alone). Contrast ≥ 4.5:1 normal text, ≥ 3:1 large text (AA); ≥ 7:1 / ≥ 4.5:1 (AAA). Text resizable to 200%. Images of text avoided.

**OPERABLE:** All functionality from keyboard. Visible focus indicators (never outline:none). Focus order = visual order. Touch targets ≥ 44x44px. prefers-reduced-motion. No keyboard traps. Pointer cancellation (no down-event triggers). Focus not obscured by sticky headers.

**UNDERSTANDABLE:** Page title. Associated `<label>` for form fields. Error messages identify field + why. Language set. Consistent navigation. Autocomplete attributes. aria-live for status messages.

**ROBUST:** Semantic HTML. First rule of ARIA: don't use if native works. Custom components expose role, state, keyboard interaction. Tested with actual screen readers (VoiceOver, NVDA, JAWS).

WCAG 2.2 additions: Focus Not Obscured (minimum/enhanced), Focus Appearance (≥2px, contrast ≥3:1), Dragging Movements alternative, Target Size ≥ 24x24px (AA) / ≥ 44x44px (AAA), Consistent Help, Accessible Authentication (no cognitive function tests).

ARIA design patterns:

| Component | Roles & Attributes | Keyboard |
|---|---|---|
| Accordion | Trigger: (button) aria-expanded, aria-controls. Panel: role="region", aria-labelledby | Enter/Space toggle, Tab between headers |
| Tabs | Container: role="tablist". Tab: role="tab", aria-selected, aria-controls. Panel: role="tabpanel", aria-labelledby | Tab to enter, Left/Right switch, Tab to panel |
| Modal/Dialog | role="dialog"/"alertdialog", aria-modal, aria-labelledby, aria-describedby | Tab cycles within (focus trap), Escape closes, focus returns on close |
| Combobox | role="combobox", aria-expanded, aria-controls="listbox". Listbox: role="listbox". Options: role="option", aria-selected | Down opens + moves, Enter selects, Escape closes |
| Tooltip | Trigger: aria-describedby="tooltip-id". Tooltip: role="tooltip" | Show on focus, Escape dismiss. No interactive content inside |

Accessibility review checklist: [1] Native HTML possible? [2] Every interactive element keyboard-operable? [3] Screen reader announces state changes? [4] Errors associated via aria-describedby? [5] Correct focus management after navigation/modal/async? [6] Informative alt text or decorative alt=""? [7] Logical heading hierarchy (h1→h2→h3)? [8] Touch targets ≥ 44x44px mobile? [9] prefers-reduced-motion? [10] Keyboard-only possible? [11] aria-live for status changes? [12] Tested with actual screen reader?

## 6. Performance Budgets & Optimization

Core Web Vitals:

| Metric | Good | Needs Work | Poor |
|---|---|---|---|
| LCP | < 2.5s | 2.5s - 4.0s | > 4.0s |
| INP (replaces FID) | < 200ms | 200ms - 500ms | > 500ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB | < 800ms | 800ms - 1.8s | > 1.8s |
| TBT (lab) | < 200ms | 200ms - 600ms | > 600ms |
| FCP | < 1.8s | 1.8s - 3.0s | > 3.0s |

Budget targets: JS bundle < 150KB gzipped (>300KB = must split). Page weight < 500KB (>1MB = investigate). API p95 < 200ms. Image per visible < 100KB. Third-party JS < 50KB. Font total < 50KB. Time to interactive < 3.5s on 3G.

INP optimization (measures p98 of ALL interactions): identify handlers > 50ms → yield every 50ms (setTimeout(0) or scheduler.yield()) → requestIdleCallback for non-critical → batch DOM reads before writes (avoid forced layout) → isInputPending() for cooperative scheduling → web workers for computation.

Performance decision trees:
- **Bundle > 150KB:** code-split by routes (React.lazy) → by component (below-fold lazy) → by library (async large deps: charts, editors) → tree-shake (ESM, avoid barrel exports, sideEffects: false) → use lodash-es/date-fns over lodash/moment.
- **LCP > 2.5s:** identify LCP element → preload (fetchpriority="high") → WebP/AVIF + srcset → responsive images → inline critical CSS → SSR/SSG for immediate content → optimize TTFB.
- **INP > 200ms:** identify slow handlers → break long tasks → defer non-critical → web workers → avoid complex selectors in frequent events.
- **CLS > 0.1:** explicit width/height on images → reserve space for async content (skeleton with dimensions) → aspect-ratio CSS → avoid content injection above existing → font-display: optional/swap.

Measurement: LAB (Lighthouse CI, WebPageTest, bundle analyzer, React DevTools profiler, Chrome Performance tab). FIELD (web-vitals library + RUM provider — Datadog, New Relic, Sentry). Budget enforcement in CI (Lighthouse CI, bundle size diff check).

## 7. Responsive Design

Mobile-first: base = mobile layout (single column, stacked content). min-width queries add complexity.

Content-based breakpoints — break when content breaks, not at device sizes:

| Name | Width | Context |
|---|---|---|
| --bp-sm | 640px | Large phones, comfortable padding, 2-col |
| --bp-md | 768px | Tablets, sidebar appears, hamburger→nav |
| --bp-lg | 1024px | Small desktop, max-width containers |
| --bp-xl | 1280px | Desktop, multi-column |
| --bp-2xl | 1536px | Large desktop, whitespace management |

Container queries: component adapts to container, not viewport. @container (min-width: 400px) { .card { grid-template-columns: 200px 1fr; } }. Use for reusable layout-aware components (sidebar, main, modal). Media queries for page-level layout, device features (hover, pointer).

Fluid typography: `font-size: clamp(1rem, 0.75rem + 0.5vw, 1.25rem)`. Fluid spacing: `--space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem)`.

Responsive images: srcset with 3-4 widths (400w, 800w, 1200w, 2000w). sizes for viewport-based selection. Always width+height (prevents CLS). WebP + AVIF + JPEG fallback via `<picture>`. lazy-load below-fold, eager-load hero (preload + fetchpriority="high").

## 8. CSS Architecture

| Methodology | Principle | Organization |
|---|---|---|
| BEM | Block__Element--Modifier | Component-scoped classes, no descendant selectors |
| SMACSS | Category-based | Base, Layout, Module, State, Theme |
| OOCSS | Structure vs skin | .o-media structure + .o-media--reversed skin |
| ITCSS | Specificity low→high | Settings→Tools→Generic→Elements→Objects→Components→Utilities |

BEM rules: Blocks nest but names don't encode nesting. Modifiers additive. Never `.card .card__header` — use `.card__header`.

CSS Grid: explicit vs implicit tracks. auto-fit (collapses empty tracks) vs auto-fill (creates empty tracks). Named grid areas for page layouts. minmax() for flexible sizing. Subgrid for sibling alignment.

Flexbox: `flex: <grow> <shrink> <basis>` — `flex: 1` (grow equally, basis 0), `flex: 0 0 200px` (fixed), `flex: auto` (grow/shrink with content basis). justify-content (main axis), align-items (cross axis).

Custom Properties: cascade inheritance, calc() with props, theming (`:root { --bg: white; } [data-theme="dark"] { --bg: black; }`), empty fallback (`var(--brand, #3b82f6)`).

CSS-in-JS options: styled-components/Emotion (~8KB runtime, props-driven, polymorphic, extension). Vanilla Extract (zero-runtime, type-safe theme contracts). Goober (ultra-lightweight <1KB).

Tailwind: JIT-only used CSS, arbitrary values (w-[127px]), config for tokens, @apply for repeated patterns. Team scaling: 1-3 pure Tailwind, 4-10 config+abstractions, 10+ design system components with extracted classes.

Design tokens: Primitive (--color-blue-500) → Semantic (--color-primary) → Component (--btn-bg) → Theme override ([data-theme="dark"]). Delivery via Style Dictionary for multi-platform.

## 9. Bundle Optimization

Code splitting strategies: Route-level (highest impact — React.lazy per route). Component-level (medium — below-fold lazy). Library-level (targeted — async large deps). Vendor splitting (react-chunk, ui-chunk, vendor-chunk — avoid single vendor.js).

Tree shaking: ESM only (CommonJS can't shake). Avoid barrel exports. sideEffects: false in package.json. Use lodash-es, date-fns. Specific imports over wildcard re-exports.
