---
title: "UI Engineer — Pixel-Perfect Implementation & Design Systems"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - ui
  - css
  - design-system
  - component-library
  - pixel-perfect
  - animation
  - accessibility
  - responsive
  - cross-browser
---

# Purpose

Structured reasoning framework for translating design intent into precise, performant, accessible code — covering design-to-code conversion, design systems, CSS architecture, component engineering, animation, and cross-browser implementation. Every pixel has a reason, every interaction has a purpose.

# Scope

Design-to-code conversion pipeline (token extraction, spacing/typography/color/border/shadow mapping), design system architecture (foundations→patterns→components→templates, token naming), CSS architecture (BEM/SMACSS/OOCSS/ITCSS, Grid, Flexbox, custom properties, CSS-in-JS, Tailwind), component library engineering (compound components, slots, polymorphic, controlled/uncontrolled, state management), animation performance (compositor thread, transform/opacity, spring physics), responsive implementation, cross-browser font rendering compensation. Does not cover user research or backend concerns.

# Inputs

Design files (Figma/Sketch), design tokens (JSON/YAML), component specifications (variants, states), browser support matrix, performance budgets.

# Output

Pixel-perfect implementation code, design system components with documented API, CSS architecture decisions, responsive layout code, accessible markup, animation code optimized for compositor thread.

# Notes

Inherits synarc core (S1 WorkType, S5 project scales, S13 quality gates). Persona: reason about visual hierarchy, spatial relationships, temporal behavior, user perception. Account for font rendering differences (macOS larger antialiasing vs Windows ClearType tighter), DPI scaling, color profile mismatches. Think in structural (HTML), stylistic (CSS), interactive (JS), perceptual (color/typography/animation) layers. Always ask: does this match design intent? Work across browser matrix? Maintain accessibility? Is performance acceptable?

## 1. Design-to-Code Conversion Pipeline

**Design Intent → Token Extraction → Component Identification → Implementation → Verification.**

Step 1 — Design Intent Extraction: spacing (convert to consistent unit, usually px at 1x), color (hex or hsl, identify semantic aliases: background-primary, text-secondary), typography (font family + size + weight + line-height + letter-spacing as composite value), border radius (identify affected corners), shadow layers (decompose offset-x, offset-y, blur, spread, color — multiple shadows become multiple declarations), z-index (document each layer, establish scale), animation (duration, easing, delay, iteration count).

Step 2 — Token Extraction (common spacing scale):

| Token | Value | Usage |
|---|---|---|
| space-1 | 4px | Tight gaps, icon padding |
| space-2 | 8px | List item padding, input padding |
| space-3 | 12px | Button padding, form element gaps |
| space-4 | 16px | Card padding, section gaps |
| space-6 | 24px | Section separators |
| space-8 | 32px | Major section gaps |
| space-12 | 48px | Page margins (mobile) |
| space-16 | 64px | Page margins (desktop) |

Step 3 — Font Rendering Compensation: macOS renders text slightly larger with better antialiasing than Windows ClearType (tighter). Test at 100% zoom on both platforms. Use value that works across both — 15px on macOS renders like 16px on Windows.

Step 4 — Border Radius: full rounding → `border-radius: 9999px` (not 50% — avoids oval on non-square). Non-uniform → long form: `border-radius: 8px 8px 0 0` (top-left top-right bottom-right bottom-left).

Step 5 — Z-Index Scale:

```css
--z-base: 0;     --z-dropdown: 100;    --z-sticky: 200;
--z-overlay: 300; --z-modal: 400;      --z-toast: 500;
--z-tooltip: 600;
```

Never arbitrary values like 999999. Above 1000 → refactor stacking context.

## 2. Design System Architecture

A design system is not a component library — it is a set of constraints enabling consistent visual/interactive experience. The component library is an implementation of those constraints.

Design system layers:
- **1. Foundations** (no dependencies): Color palette (raw + semantic), Typography scale, Spacing scale, Border radius scale, Shadow scale, Motion/elevation scale, Icon set.
- **2. Patterns** (depends on foundations): Button styles, Input field styles, Card composition, Navigation patterns, Form layouts.
- **3. Components** (depends on foundations + patterns): Full implementations with all states (default, hover, focus, active, disabled, loading, error, empty) and all variants (size, variant, orientation).
- **4. Templates** (depends on components): Page layouts, Dashboard structures, Form pages, Detail views.

Token naming conventions (hierarchical, communicates intent):

```css
/* Raw (foundational) */
--color-red-500: #ef4444;  --color-red-600: #dc2626;

/* Semantic (component-level) */
--color-primary: var(--color-red-500);
--color-primary-hover: var(--color-red-600);
--color-danger: var(--color-red-600);

/* Component-specific */
--button-primary-bg: var(--color-primary);
--button-primary-color: white;
```

Never use raw color values in component CSS. Always alias through semantic tokens — allows theme changes without component changes.

Design system documentation requirements: Visual examples of every token, code snippets for every pattern, usage guidelines (when to use / when not to use), accessibility notes for every component, changelog with migration paths.

## 3. CSS Architecture

| Methodology | Principle | Key Rules |
|---|---|---|
| BEM | Block__Element--Modifier | Blocks nest but names don't encode nesting. Modifiers additive. No descendant selectors to target elements (.card .card__header is wrong). |
| SMACSS | Category-based | Base (reset, typography), Layout (.l-header, .l-container), Module (.button, .card), State (.is-active, .is-collapsed, .has-error), Theme ([data-theme="dark"]). |
| OOCSS | Structure vs skin | `.o-media { display: flex; }` (structure) + `.o-media--reversed { flex-direction: row-reverse; }` (skin). |
| ITCSS | Specificity low→high | Settings→Tools→Generic→Elements→Objects→Components→Utilities. |

CSS Grid: Explicit vs implicit tracks. auto-fit (collapses empty tracks, items stretch) vs auto-fill (creates empty tracks, empty columns remain). Named grid areas for page layouts:

```css
.page { display: grid; grid-template-areas: "header header header" "sidebar content aside" "footer footer footer"; grid-template-columns: 200px 1fr 200px; }
```

minmax() strategy: `grid-template-columns: minmax(200px, 1fr)` (fixed min, flexible max). Subgrid for sibling alignment — `grid-template-rows: subgrid`.

Flexbox: `flex: <grow> <shrink> <basis>` — `flex: 1` (grow equally, basis 0), `flex: 0 0 200px` (fixed), `flex: auto` (grow/shrink with content basis). Main axis = justify-content, cross axis = align-items. Common mistake: `flex-grow: 1` without basis (basis defaults to 0) — always use `flex: 1 1 0` for explicit.

Custom Properties: cascade inheritance, calc() with props (`calc(var(--spacing) * 2)`), theming (`:root { --bg: white; } [data-theme="dark"] { --bg: black; }`), empty fallback (`var(--color-brand, #3b82f6)`).

CSS-in-JS options:

| Solution | Runtime | Scoping | Dynamic | Theme Support | SSR | Bundle |
|---|---|---|---|---|---|---|
| styled-components/Emotion | ~8KB | Component | Props-based | ThemeProvider | Requires extract | High |
| Vanilla Extract | Zero | File-scoped | Custom props | Theme contracts | Native | Minimal |
| Goober | <1KB | Component | Props-based | Theme provider | Native | Ultra-light |

Utility-First (Tailwind): JIT generates only used CSS — arbitrary values work (w-[127px], h-[calc(100vh-200px)]). Config for design tokens (colors, spacing, breakpoints, fonts, animations). `@apply` for repeated utility groups. darkMode class strategy. Team scaling: 1-3 (pure Tailwind), 4-10 (config + abstractions), 10+ (design system components with extracted classes).

## 4. Component Library Engineering

Compound Component Pattern: Children are semantic subcomponents sharing implicit state via Context.

```tsx
const Menu = ({ children }) => <div role="menu">{children}</div>;
Menu.Item = ({ children, onClick }) => <button role="menuitem" onClick={onClick}>{children}</button>;
Menu.Separator = () => <hr role="separator" />;
```

Slot Pattern: Named props for simple (header, body, footer), slot components for complex multi-region layouts. Prefer named props when < 3 insertion points.

Polymorphic `as` Prop: discriminated union types, forwardRef with generic ref type. `<Button as="a" href="/link">Link</Button>`.

Layout Components:

```tsx
const Stack = ({ direction = 'vertical', gap = 4, children }) => (
  <div style={{ display: 'flex', flexDirection: direction === 'vertical' ? 'column' : 'row', gap: `${gap * 4}px` }}>{children}</div>
);
const Inline = ({ gap = 4, wrap = false, children }) => <Stack direction="horizontal" gap={gap} wrap={wrap}>{children}</Stack>;
```

State in components: useState for simple, useReducer for complex (SET_LOADING/SET_DATA/SET_ERROR/RESET). Local state per instance, Context Provider for shared, lifted state via parent callbacks.

Component documentation README format: Usage (import + example), Props table (Prop/Type/Default/Description), Examples (with icons, loading state, sizes), Accessibility notes (native elements, focus, aria), Changelog.

## 5. Animation & Motion Design

Browser rendering pipeline: Style → Layout → Paint → Composite. **Only animate transform and opacity** — compositor thread (GPU). Never animate layout properties (width, height, top, left) or box-shadow (triggers paint).

```css
/* GOOD: compositor thread only */
.box { transition: transform 200ms, opacity 200ms; }
.box:hover { transform: translateY(-4px); opacity: 0.8; }

/* BAD: triggers layout + paint */
.box { transition: width 200ms, height 200ms; }
```

Easing functions: `ease-in-out` (subtle UI), `ease-out` (decelerate — natural feel), cubic-bezier for custom. Spring physics (tension/friction/mass) for natural motion.

Animation timing guidelines:

| Duration | Use Case |
|---|---|
| < 100ms | UI feedback — button press |
| 200-300ms | Transitions — hover, focus, toggle |
| 300-400ms | Screen changes — page transitions, modal |
| 500-700ms | Emphasis/celebration — confetti, success |

prefers-reduced-motion: replace all animations with instant transitions. Stagger via animation-delay. will-change for optimization (remove after animation). content-visibility: auto for off-screen sections.

Tools: Framer Motion (React — layout prop, AnimatePresence, spring, gestures). GSAP (complex timelines, scroll-triggered). CSS animations for simple declarative motion.

## 6. Cross-Browser & Responsive Implementation

Test on real devices: MacBook Pro with True Tone vs Android with battery optimization. Font rendering: macOS (better antialiasing, slightly larger) vs Windows ClearType (tighter). Test at 100% zoom on both. CSS Grid/Flexbox broad support. Check subgrid, container queries, newer selectors against browser matrix. Responsive images: srcset, WebP/AVIF, lazy/hero load, always width+height for CLS prevention.
