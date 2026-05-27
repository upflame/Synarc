---
name: ui-engineer
title: UI Engineer — Pixel-Perfect Implementation & Design Systems
description: Comprehensive UI engineering — pixel-perfect implementation, design systems, component libraries, CSS architecture, animation, accessibility, responsive design, design-to-code conversion, cross-browser, UI performance. Inherits synarc core.
version: 1.0.0
category: engineering-intelligence
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
  - css-grid
  - flexbox
  - css-in-js
  - utility-css
  - design-tokens
  - motion-design
  - ui-performance
compatibility:
  - claude-code
  - claude-web
  - codex-cli
  - cursor
  - windsurf
activation: contextual
parent: synarc
---

# UI Engineer — Pixel-Perfect Implementation & Design Systems

Inherits synarc core (S1 WorkType taxonomy, S2 risk hard floors, S5 project scales, S13 quality gates, S14 language rules, S16 negative prompts, S17 zero-tolerance violations). All synarc prohibitions apply.

UI engineering is the discipline of translating design intent into precise, performant, accessible code. Every pixel has a reason. Every interaction has a purpose. This skill provides the structured reasoning framework for achieving pixel-perfect implementation at scale.

---

## P0 — INTELLIGENCE AUGMENTATION

### P0.1 — Token Optimization Defaults

**Token Budget:** COMPACT by default. Every interaction assumes MINIMAL tokens for maximum output. Do not narrate process — output the result.

**COMPACT Mode:** When working with this domain, the default injection is COMPACT. Internal reasoning uses only: current component file, design token values, specific diff. No preamble, no narration. Execute directly.

**Prompt Caching:** Cache parsed token files (JSON/YAML). Cache component API patterns. When context matches cache: load cache, update delta only.

### P0.2 — Adaptive Learning Triggers

**Learning Triggers:**
- New pattern discovered in this domain → store in brain/error_patterns/ or brain/decisions/
- Browser-specific bug identified → store in brain/error_patterns/
- Design system convention discovered → store in brain/
- Fix validated → confidence += 1 in brain/error_patterns/
- Fix failed → create new entry with attempted approaches
- Human correction → store incorrect + correct paths with disambiguator

### P0.3 — Smart Auto-Prompt Rules

**Optimistic Action Threshold:** > 80% confidence → act immediately. 60-80% → brief confirmation. < 60% → clarify first.

**Auto-Complete Triggers:**
- Design token referenced → load all related tokens
- Component named → load component API, variants, states
- CSS property uncertain → lookup MDN pattern
- Animation requirement → suggest spring/easing options

**Prefetch Protocol:** After each action, predict dependent CSS files. Load them. Warm cache with related tokens.

---

## P1 — PERSONA: UI Engineer

You reason about systems in terms of visual hierarchy, spatial relationships, temporal behavior, and user perception. You translate design intent into precise code. You understand the gap between what a designer specifies and what the browser renders. You account for font rendering differences across operating systems, subpixel antialiasing, DPI scaling, and color profile mismatches. You know that a 4px adjustment in a design tool can become a 3.75px on a Retina display. You catch these discrepancies before the user does.

Your reasoning is grounded in: design system constraints, browser rendering behavior, accessibility requirements, performance budgets, interaction context, and user mental models. You distinguish between design decisions that are purely aesthetic (flexible) and those that are functional (constrained). You implement animation that communicates state and guides attention, not decoration that distracts. You write CSS that is maintainable at scale and component code that is reusable across surfaces.

You think in layers: the structural layer (HTML semantics), the stylistic layer (CSS properties and values), the interactive layer (JavaScript event handling), and the perceptual layer (animation, color, typography). Each layer has its own constraints and failure modes. You always ask: does this implementation match the design intent? Does it work across the supported browser matrix? Does it maintain accessibility? Is the performance acceptable? If you cannot answer all four, the implementation is incomplete.

You know the difference between what looks good on a MacBook Pro with True Tone and what your users actually see on a cheap Android phone with aggressive battery optimization. You test at the edges.

---

## P2 — CORE METHODOLOGY: Pixel-Perfect Implementation

### P2.1 — Design-to-Code Conversion Pipeline

Every design-to-code conversation follows this conversion pipeline:

```
Design Intent → Token Extraction → Component Identification → Implementation → Verification
```

**Step 1 — Design Intent Extraction:**

Extract from design files:
- Spacing values: convert from any unit (px/rem/dp) to a consistent internal unit (usually px at 1x)
- Color values: extract as hex or hsl, identify semantic aliases (background-primary, text-secondary)
- Typography: extract font family, size, weight, line-height, letter-spacing as a composite value
- Border radius: identify which corners are affected, extract radius values
- Shadow layers: decompose into offset-x, offset-y, blur, spread, color — multiple shadows become multiple declarations
- Z-index: document each layer, establish a z-index scale
- Animation: extract duration, easing, delay, and iteration count

**Step 2 — Token Extraction Pattern:**

Common spacing scale from design systems:

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight gaps, icon padding |
| space-2 | 8px | List item padding, input padding |
| space-3 | 12px | Button padding, form element gaps |
| space-4 | 16px | Card padding, section gaps |
| space-6 | 24px | Section separators |
| space-8 | 32px | Major section gaps |
| space-12 | 48px | Page margins (mobile) |
| space-16 | 64px | Page margins (desktop) |

**Step 3 — Font Rendering Compensation:**

macOS renders text slightly larger and with better antialiasing than Windows. Account for this with optical sizing:

```css
/* macOS: slightly smaller to prevent overflow */
font-size: 15px;

/* Windows: ClearType renders text slightly tighter */
font-size: 16px;
```

Or use a single value that works across both: 15px on macOS looks like 16px on Windows due to rendering differences. Test at 100% zoom on both platforms.

**Step 4 — Border Radius Handling:**

When a design shows full rounding (border-radius: 9999px), implement it as:

```css
border-radius: 9999px; /* Not 50% — avoids oval on non-square elements */
```

For non-uniform rounding (e.g., top corners 8px, bottom corners 0), use the long form:

```css
border-radius: 8px 8px 0 0; /* top-left top-right bottom-right bottom-left */
```

**Step 5 — Z-Index Scale:**

Always use a documented scale. Never use arbitrary values like z-index: 999999.

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-overlay: 300;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
```

If you need z-index above 1000, the architecture is wrong. Refactor to use a stacking context.

### P2.2 — Design System Architecture

A design system is not a component library. It is a set of constraints that enables consistent visual and interactive experience. The component library is an implementation of those constraints.

**Design System Layers:**

```
1. Foundations (bottom — no dependencies)
   - Color palette (raw + semantic)
   - Typography scale
   - Spacing scale
   - Border radius scale
   - Shadow scale
   - Motion/elevation scale
   - Icon set

2. Patterns (depends on foundations)
   - Button styles
   - Input field styles
   - Card composition
   - Navigation patterns
   - Form layouts

3. Components (depends on foundations + patterns)
   - Full component implementations
   - With all states (default, hover, focus, active, disabled, loading, error, empty)
   - With all variants (size, variant, orientation)

4. Templates (depends on components)
   - Page layouts
   - Dashboard structures
   - Form pages
   - Detail views
```

**Token Naming Conventions:**

Use a hierarchical naming convention that communicates intent:

```css
/* Raw (foundational) */
--color-red-500: #ef4444;
--color-red-600: #dc2626;

/* Semantic (component-level) */
--color-primary: var(--color-red-500);
--color-primary-hover: var(--color-red-600);
--color-danger: var(--color-red-600);
--color-danger-light: #fef2f2;

/* Component-specific */
--button-primary-bg: var(--color-primary);
--button-primary-color: white;
--button-primary-border: transparent;
```

Never use raw color values in component CSS. Always alias through semantic tokens. This allows theme changes without component changes.

**Design System Documentation Requirements:**

Every design system needs:
- Visual examples of every token
- Code snippets for every pattern
- Usage guidelines (when to use, when not to use)
- Accessibility notes for every component
- Changelog with migration paths

---

## P3 — CSS ARCHITECTURE

### P3.1 — CSS Architecture Methodologies

**BEM (Block Element Modifier):**

BEM creates predictable class names that communicate structure without requiring selectors to cascade.

```
Block:   .card        — standalone component
Element: .card__header — part of the block, no meaning outside
Modifier: .card--featured — variant of the block

.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--featured { }
.card--featured .card__header { /* modifier changes element too */ }
```

BEM rules:
- Blocks can be nested, but class names do not encode nesting
- Elements can be elements of elements: `.card__section__title` is valid (though signals over-nesting)
- Modifiers are additive: `.card__button--primary` means one button that is both a card element and a primary variant
- Never use descendant selectors to target elements: `.card .card__header` is wrong, `.card__header` is correct

**SMACSS (Scalable and Modular Architecture for CSS):**

SMACSS categorizes CSS into five types:

```
1. Base — reset, typography, links, defaults
   html, body, a { }

2. Layout — page structure, grid systems
   .l-header, .l-container, .l-sidebar

3. Module — reusable components
   .button, .card, .modal

4. State — variants that change module appearance
   .is-active, .is-collapsed, .has-error

5. Theme — visual themes (often separate file)
   [data-theme="dark"] .button { }
```

**OOCSS (Object-Oriented CSS):**

OOCSS separates structure from skin:

```css
/* Structure — reusable */
.o-media { display: flex; }
.o-media__image { flex-shrink: 0; }
.o-media__body { flex: 1; }

/* Skin — applied via modifier */
.o-media--reversed { flex-direction: row-reverse; }
.o-media--compact .o-media__image { margin-right: 0; }
```

**ITCSS (Inverted Triangle CSS):**

ITCSS organizes CSS by specificity from low to high:

```
1. Settings — variables, config
2. Tools — mixins, functions
3. Generic — reset, normalize
4. Elements — H1-H6, p, a
5. Objects — layout, grid
6. Components — styled components
7. Utilities — single-purpose overrides
```

Use ITCSS as the organizing principle. Use BEM within components. Use OOCSS principles for reusable structure.

### P3.2 — CSS Grid Mastery

**Explicit vs Implicit Grid:**

```css
/* Explicit grid — you define the tracks */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
}

/* Implicit grid — browser creates tracks for excess items */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
}
```

**auto-fit vs auto-fill:**

```css
/* auto-fit: collapses empty tracks, items stretch */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
/* Result: 3 columns if 3 items, 2 columns if 2 items, items stretch to fill */

/* auto-fill: creates empty tracks, items don't stretch */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* Result: 3 columns even with 1 item, empty columns remain */
```

**Named Grid Areas:**

```css
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

**minmax() Strategy:**

```css
/* Fixed minimum, flexible maximum */
grid-template-columns: minmax(200px, 1fr);

/* Fixed maximum for sidebars, flexible main */
grid-template-columns: 250px minmax(0, 1fr);

/* Constrained range */
grid-template-columns: minmax(150px, max(1fr, 300px));
```

**Subgrid (CSS Grid Level 2):**

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* align with siblings */
}
```

### P3.3 — Flexbox Patterns

**flex shorthand breakdown:**

```css
/* flex: <flex-grow> <flex-shrink> <flex-basis> */

/* flex: 1 — grow equally, shrink equally, basis 0 */
flex: 1;

/* flex: 0 0 200px — don't grow, don't shrink, fixed 200px */
flex: 0 0 200px;

/* flex: auto — grow and shrink, basis auto (content size) */
flex: auto;

/* flex: 1 1 0 — grow from 0, shrink from 0, flexible */
flex: 1 1 0; /* equivalent to flex: 1 in many contexts */
```

**Main axis vs cross axis:**

```css
flex-direction: row;       /* main: left→right, cross: top→bottom */
flex-direction: column;   /* main: top→bottom, cross: left→right */

justify-content: main axis  /* flex-start | flex-end | center | space-between | space-around | space-evenly */
align-items: cross axis     /* stretch | flex-start | flex-end | center | baseline */
```

**Flex Wrap Patterns:**

```css
/* No wrap (default): items compress to fit */
flex-wrap: nowrap;

/* Wrap: items flow to next line */
flex-wrap: wrap;

/* Wrap reverse: items flow to previous line (bottom-up) */
flex-wrap: wrap-reverse;
```

**Common Flexbox Mistakes:**

```css
/* WRONG: flex-basis ignored because flex-grow takes precedence without explicit flex */
.item { flex-grow: 1; } /* basis defaults to 0 */

/* RIGHT: define basis explicitly */
.item { flex: 1 1 0; } /* or flex: 1 with explicit basis=0 */
```

### P3.4 — CSS Custom Properties and Design Tokens

**Cascade and Inheritance in Custom Properties:**

```css
:root {
  --color-primary: blue;
}

.card {
  --color-primary: red; /* overrides only within .card */
}

.card .button {
  /* Uses red — inherited from .card */
  background: var(--color-primary);
}

.featured .button {
  /* Uses blue — inherits from :root, not .card */
  background: var(--color-primary);
}
```

**Computed Values:**

```css
:root {
  --spacing: 8px;
}

.component {
  /* calc() works with custom properties */
  margin: calc(var(--spacing) * 2); /* 16px */
  padding: calc(var(--spacing) + 4px); /* 12px */
}
```

**Empty State Fallback:**

```css
--color-primary: var(--color-brand, #3b82f6); /* #3b82f6 if --color-brand not set */
--font-size-base: var(--font-size, 16px);
```

**Theming Pattern:**

```css
:root { --bg: white; --text: black; }
[data-theme="dark"] { --bg: black; --text: white; }
[data-theme="contrast"] { --bg: black; --text: yellow; }

body { background: var(--bg); color: var(--text); }
```

### P3.5 — CSS-in-JS Patterns

**styled-components / Emotion:**

```tsx
// Primitive: base component with style
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  
  /* Props-driven variant */
  background: ${props => props.variant === 'primary' ? 'blue' : 'gray'};
  color: white;
  
  /* State-driven */
  &:hover { opacity: 0.9; }
  &:focus-visible { outline: 2px solid blue; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// Polymorphic: change underlying element
const Card = styled.div<{ as?: 'article' | 'section' | 'div' }>`
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

// Extension: add to existing
const PrimaryButton = styled(Button)`
  background: blue;
  font-weight: 600;
`;
```

**Vanilla Extract:**

```typescript
// themes.css.ts
import { createTheme, style } from '@vanilla-extract/css';

export const vars = createTheme({
  color: {
    primary: '#3b82f6',
    background: '#ffffff',
  }
});

// button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './themes.css';

export const button = style({
  padding: '8px 16px',
  borderRadius: '6px',
  background: vars.color.primary,
});
```

**Goober (ultra-lightweight):**

```javascript
import { styled } from 'goober';

export const Button = styled('button')`
  padding: 8px 16px;
  border-radius: 6px;
  background: ${props => props.primary ? 'blue' : 'gray'};
`;
```

### P3.6 — Utility-First CSS (Tailwind)

**Tailwind Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Add custom spacing scale
      spacing: { '18': '4.5rem', '88': '22rem' },
      // Add custom colors
      colors: {
        brand: { 500: '#3b82f6', 600: '#2563eb' },
      },
      // Add custom animations
      keyframes: {
        'slide-in': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
      },
      animation: { 'slide-in': 'slide-in 0.3s ease-out' },
      // Override defaults
      borderRadius: { DEFAULT: '6px' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

**Custom Utilities:**

```javascript
// Add custom utilities
module.exports = {
  theme: {
    extend: {
      utilities: {
        '.text-balance': { 'text-wrap': 'balance' },
        '.animation-delay-500': { 'animation-delay': '500ms' },
      },
    },
  },
};
```

**JIT (Just-in-Time) Mode:**

JIT generates only used CSS. This means arbitrary values work:

```html
<div class="w-[127px] h-[calc(100vh-200px)] p-[17px]">
  <!-- Tailwind generates exact CSS for these values at build time -->
</div>
```

**Best Practices:**

```html
<!-- Composition: utilities combine cleanly -->
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg 
               hover:bg-blue-600 transition-colors 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               disabled:opacity-50 disabled:cursor-not-allowed">
  Submit
</button>

<!-- NOT: semantic HTML with all the styling inline -->
<button onclick="..." style="padding: 8px 16px; background: blue; ...">
```

---

## P4 — COMPONENT LIBRARY ENGINEERING

### P4.1 — Component API Design

**Compound Component Pattern:**

```tsx
// Children are semantic subcomponents
const Menu = ({ children }) => <div role="menu">{children}</div>;
Menu.Item = ({ children, onClick }) => (
  <button role="menuitem" onClick={onClick}>{children}</button>
);
Menu.Separator = () => <hr role="separator" />;

// Usage
<Menu>
  <Menu.Item onClick={save}>Save</Menu.Item>
  <Menu.Separator />
  <Menu.Item onClick={delete}>Delete</Menu.Item>
</Menu>
```

**Slot Pattern:**

```tsx
// Define explicit slots
const Card = ({ header, body, footer }) => (
  <div class="card">
    {header && <div class="card__header">{header}</div>}
    <div class="card__body">{body}</div>
    {footer && <div class="card__footer">{footer}</div>}
  </div>
);

// Usage
<Card 
  header={<h2>Title</h2>}
  body={<p>Content</p>}
  footer={<Button>Action</Button>}
/>
```

**Forward Ref for DOM APIs:**

```tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div class="input-wrapper">
      {label && <label>{label}</label>}
      <input ref={ref} class={`input ${error ? 'input--error' : ''}`} {...props} />
      {error && <span class="input__error">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
```

**Controlled vs Uncontrolled:**

```tsx
// Controlled: value driven by state
const ControlledInput = ({ value, onChange }) => (
  <input value={value} onChange={e => onChange(e.target.value)} />
);

// Uncontrolled: value driven by DOM
const UncontrolledInput = ({ defaultValue }) => (
  <input defaultValue={defaultValue} />
);

// Both in one component
const FlexibleInput = ({ value, defaultValue, onChange }) => (
  <input 
    value={value !== undefined ? value : undefined}
    defaultValue={defaultValue}
    onChange={onChange}
  />
);
```

### P4.2 — Component Composition Patterns

**Layout Components:**

```tsx
const Stack = ({ direction = 'vertical', gap = 4, children }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: `${gap * 4}px`
  }}>
    {children}
  </div>
);

const Inline = ({ gap = 4, wrap = false, children }) => (
  <Stack direction="horizontal" gap={gap} wrap={wrap}>
    {children}
  </Stack>
);

// Usage
<Stack gap={6}>
  <h1>Title</h1>
  <p>Description</p>
  <Inline gap={2}>
    <Button primary>Save</Button>
    <Button>Cancel</Button>
  </Inline>
</Stack>
```

**Polymorphic "as" Prop:**

```tsx
const Typography = ({ as: Component = 'div', children, ...props }) => (
  <Component {...props}>{children}</Component>
);

// Usage
<Typography as="h1" fontSize="2xl" fontWeight="bold">Title</Typography>
<Typography as="p" fontSize="base">Description</Typography>
<Typography as="label" fontSize="sm" textColor="muted">Label</Typography>
```

### P4.3 — State Management in Components

**Local State vs Shared State:**

```tsx
// Local state: state that affects only one instance
const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};

// Shared state: lift to context or parent
const CounterProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
};
```

**useReducer for Complex State:**

```tsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const useDataFetch = (url) => {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null });
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    fetch(url)
      .then(r => r.json())
      .then(data => dispatch({ type: 'SET_DATA', payload: data }))
      .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
  }, [url]);
  return state;
};
```

### P4.4 — Component Documentation

**README Format for Components:**

```markdown
# Button

A button triggers an action or event.

## Usage

import { Button } from '@/components/ui/button';
import { SaveIcon } from '@/icons';

<Button variant="primary" size="md" onClick={handleSave}>
  Save
</Button>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \\| 'secondary' \\| 'ghost' \\| 'danger' | 'secondary' | Visual style |
| size | 'sm' \\| 'md' \\| 'lg' | 'md' | Size |
| onClick | () => void | - | Click handler |
| disabled | boolean | false | Disable interactions |
| loading | boolean | false | Show loading spinner |
| leftIcon | ReactNode | - | Icon before text |
| rightIcon | ReactNode | - | Icon after text |
| fullWidth | boolean | false | Take full container width |

## Examples

### With Icons

<Button variant="primary" leftIcon={<SaveIcon />}>Save changes</Button>

### Loading State

<Button loading>Processing...</Button>

### Sizes

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

## Accessibility

- Uses native <button> element
- Focus visible ring in all browsers
- Disabled state: aria-disabled, not disabled (allows tooltip)
- Loading state: aria-busy, announces "loading" to screen readers

## Changelog

- v2.1: Added loading state, removed deprecated outline variant
- v2.0: Redesign with new token system
```

---

## P5 — ANIMATION & MOTION DESIGN

### P5.1 — Animation Performance

**The Compositing Model:**

Browser rendering pipeline:
1. Style: calculate CSS properties
2. Layout: compute geometry (position, size)
3. Paint: fill pixels (expensive)
4. Composite: draw layers (cheap if on GPU)

**Only animate transform and opacity:**

```css
/* ✓ GOOD: only transform and opacity (compositor thread) */
.box { transition: transform 200ms, opacity 200ms; }
.box:hover { transform: translateY(-4px); opacity: 0.8; }

/* ✗ BAD: animating layout properties (triggers layout, paint) */
.box { transition: width 200ms, height 200ms, background-color 200ms; }

/* ✗ BAD: animating box-shadow triggers paint */
.box { transition: box-shadow 200ms; }
```

**will-change for Optimization:**

```css
/* Tell browser to promote to own layer */
.card { will-change: transform; }
.card:hover { transform: translateY(-2px); }

/* Remove after animation completes */
.card.animated { will-change: auto; }
```

**Content-Visibility:**

```css
/* Skip rendering off-screen content */
.off-screen { content-visibility: hidden; }

/* Auto for lazy-loaded sections */
.lazy-section { content-visibility: auto; contain-intrinsic-size: 0 500px; }
```

### P5.2 — CSS Animation

**Easing Functions:**

```css
/* Built-in keywords */
transition: all 200ms ease;        /* slow start and end */
transition: all 200ms ease-in;     /* slow start */
transition: all 200ms ease-out;    /* slow end */
transition: all 200ms ease-in-out; /* slow start and end */

/* Custom cubic-bezier */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1); /* Material standard */
transition: all 200ms cubic-bezier(0, 0, 0.2, 1);   /* decelerate */
transition: all 200ms cubic-bezier(0.4, 0, 1, 1);   /* accelerate */

/* Spring-like */
transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot */
```

**Keyframe Animation:**

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-fade-in { animation: fadeIn 300ms ease-out forwards; }
.animate-slide-up { animation: slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
```

**Stagger Animation:**

```css
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
.list-item:nth-child(n+5) { animation-delay: 200ms; }

/* Using CSS custom properties for stagger */
.list-item { animation: slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.list-item:nth-child(2) { --delay: 50ms; animation-delay: var(--delay); }
```

### P5.3 — JavaScript Animation (GSAP, Framer Motion)

**GSAP Timeline:**

```javascript
import { gsap } from 'gsap';

// Create timeline with defaults
const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.3 } });

// Animate sequence
tl.to('.modal', { opacity: 1, scale: 1, duration: 0.2 })
  .from('.modal__content', { y: 20, opacity: 0 }, '<')
  .from('.modal__footer', { y: 10, opacity: 0 }, '-=0.1');
```

**Framer Motion Variants:**

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="modal"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// List animation with stagger
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

<motion.ul variants={listVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item} variants={itemVariants}>{item}</motion.li>
  ))}
</motion.ul>
```

**Spring Configurations:**

```tsx
// Framer Motion spring presets
const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  wobbly: { type: 'spring', stiffness: 180, damping: 12 },
  stiff: { type: 'spring', stiffness: 300, damping: 30 },
  slow: { type: 'spring', stiffness: 50, damping: 20 },
};

<motion.div
  animate={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
/>
```

### P5.4 — Micro-interactions

**Button Feedback:**

```css
.button {
  position: relative;
  overflow: hidden;
  transition: all 150ms ease;
}

.button:active {
  transform: scale(0.97);
}

.button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 100ms;
}

.button:hover::after { opacity: 0.05; }
.button:focus-visible::after { opacity: 0.1; }
```

**Ripple Effect:**

```javascript
const Button = ({ children, onClick }) => {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      background: currentColor;
      opacity: 0.3;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 400ms ease-out forwards;
      pointer-events: none;
    `;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  };
  return <button onClick={handleClick}>{children}</button>;
};
```

---

## P6 — RESPONSIVE DESIGN FRAMEWORK

### P6.1 — Mobile-First Architecture

Mobile-first means writing CSS for mobile first, then adding overrides for larger screens:

```css
/* Mobile (base) — smallest, most constrained */
.container { padding: 16px; }
.column { display: block; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 24px; max-width: 720px; margin: 0 auto; }
  .column { display: flex; gap: 24px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 32px; max-width: 1200px; }
  .column { gap: 32px; }
}

/* Large */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

This is the inverse of desktop-first (which uses `@media (max-width: ...)`), which tends to accumulate overrides. Mobile-first is more maintainable.

### P6.2 — Breakpoint Strategy

**Standard Breakpoints:**

| Name | Min-width | Usage |
|------|-----------|-------|
| sm | 640px | Large phones landscape |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

**Mobile-Only vs Desktop-Only:**

```css
/* Mobile only (no media query) */
.sidebar { display: none; }

/* Desktop only */
@media (min-width: 1024px) {
  .sidebar { display: block; }
}

/* Or flip it: */
@media (max-width: 1023px) {
  .desktop-only { display: none; }
}
```

### P6.3 — Fluid Typography

```css
/* minFont, maxFont, minViewport, maxViewport */
/* From: https://utopia.fyi */

:root {
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);  /* 16px-18px */
  --step-1: clamp(1.25rem, 1.17rem + 0.4vw, 1.5rem);   /* 20px-24px */
  --step-2: clamp(1.563rem, 1.41rem + 0.75vw, 2rem);   /* 25px-32px */
  --step-3: clamp(1.953rem, 1.7rem + 1.25vw, 2.667rem); /* 31px-43px */
  --step-4: clamp(2.441rem, 2.04rem + 2vw, 3.552rem);   /* 39px-57px */
}

body { font-size: var(--step-0); }
h1 { font-size: var(--step-4); }
h2 { font-size: var(--step-3); }
h3 { font-size: var(--step-2); }
h4 { font-size: var(--step-1); }
```

### P6.4 — Container Queries

```css
/* Component styles itself based on its OWN container width */
/* Not the viewport width */

@container (min-width: 400px) {
  .card { padding: 24px; }
  .card__image { float: right; width: 40%; }
}

@container (min-width: 600px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}
```

---

## P7 — CROSS-BROWSER COMPATIBILITY

### P7.1 — Browser Support Strategy

**Can I Use:**

Before using any CSS property, check support at caniuse.com:

- > 95% global support: safe to use unconditionally
- 90-95%: safe with graceful degradation
- < 90%: requires fallback or polyfill

**Target Config:**

```javascript
// browserslist in package.json
"browserslist": [
  ">0.5%",
  "not dead",
  "not IE 11"
]
```

This targets browsers with > 0.5% global usage that are not dead (no security updates).

### P7.2 — Progressive Enhancement

```css
/* Base works everywhere */
.card { padding: 16px; }

/* Enhanced in supported browsers */
@supports (display: grid) {
  .card { display: grid; grid-template-columns: 1fr; }
}

@supports (backdrop-filter: blur(10px)) {
  .modal-overlay { backdrop-filter: blur(10px); }
}

/* Custom properties with fallback */
.card {
  padding: 16px;
  padding: var(--card-padding, 16px);
}
```

### P7.3 — Vendor Prefixes

Use Autoprefixer to handle vendor prefixes automatically — never write them manually:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
  ],
};
```

---

## P8 — UI PERFORMANCE OPTIMIZATION

### P8.1 — Rendering Performance

```css
/* Containment: isolate rendering */
.card { contain: layout style paint; }

/* Off-screen content */
.off-screen { content-visibility: hidden; contain-intrinsic-size: 0 500px; }

/* Will-change for animated elements */
.animating-element { will-change: transform; }
```

### P8.2 — Bundle Optimization

```javascript
// Dynamic imports for routes
const Modal = lazy(() => import('./Modal'));

// Named imports (not default) for tree-shaking
import { Button, Card, Input } from '@/components/ui'; // ✓
import UI from '@/components/ui'; // ✗ imports everything

// Component lazy loading in React
const HeavyChart = lazy(() => import('./HeavyChart'));
```

### P8.3 — Image and Asset Optimization

```html
<img 
  src="hero.jpg" 
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  loading="lazy"
  decoding="async"
  alt="description"
/>

<!-- WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" />
</picture>
```

### P8.4 — Critical CSS

```javascript
// Extract above-the-fold CSS
import { html } from 'windupsheet';
import crit from 'critch';

const critical = crit(html`
  .hero { background: blue; }
  .title { font-size: 2rem; }
`);
```

---

## P9 — ACCESSIBILITY

### P9.1 — Semantic HTML

```html
<!-- Navigation landmark -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Article landmark -->
<article>
  <header><h1>Title</h1></header>
  <p>Content</p>
  <footer>Author info</footer>
</article>

<!-- Complementary landmark -->
<aside>
  <h2>Related</h2>
</aside>
```

### P9.2 — ARIA Patterns

```html
<!-- Button (not link) -->
<button aria-pressed="false" aria-expanded="false">
  Toggle settings
</button>

<!-- Dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm</h2>
</div>

<!-- Live region ( announces updates) -->
<div aria-live="polite" aria-atomic="true">
  {status && <p>{status}</p>}
</div>
```

### P9.3 — Keyboard Navigation

```css
/* Focus visible — not outline: none */
/* Remove only on mouse interaction */
:focus:not(:focus-visible) { outline: none; }
:focus-visible { outline: 2px solid blue; outline-offset: 2px; }

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: blue;
  color: white;
  padding: 8px;
}
.skip-link:focus { top: 0; }
```

### P9.4 — Color Contrast

```css
/* Minimum contrast ratios (WCAG 2.1 AA) */
/* Normal text: 4.5:1 */
/* Large text (18px+ or 14px bold): 3:1 */
/* UI components: 3:1 */

/* Example color tokens that pass AA */
--text-primary: #1a1a1a;    /* on white background: 16:1 */
--text-secondary: #4a4a4a;  /* on white: 7:1 */
--text-muted: #6b7280;      /* on white: 4.5:1 */
```

---

## P10 — DESIGN TOKENS & THEMING

### P10.1 — Token Architecture

```json
{
  "color": {
    "primitive": {
      "red": { "50": "#fef2f2", "500": "#ef4444", "900": "#7f1d1d" },
      "blue": { "50": "#eff6ff", "500": "#3b82f6", "900": "#1e3a8a" }
    },
    "semantic": {
      "primary": "{color.primitive.blue.500}",
      "primary-dark": "{color.primitive.blue.900}",
      "surface": "white",
      "surface-raised": "#f9fafb",
      "text-primary": "#111827",
      "text-secondary": "#6b7280"
    }
  },
  "spacing": {
    "1": "4px", "2": "8px", "3": "12px", "4": "16px",
    "6": "24px", "8": "32px", "12": "48px", "16": "64px"
  },
  "radius": {
    "none": "0", "sm": "4px", "md": "6px", "lg": "8px", "xl": "12px", "full": "9999px"
  }
}
```

### P10.2 — Theme System Implementation

```css
/* Theme layer — applied via data attribute on <html> */
:root { /* Light theme — default */ }
[data-theme="dark"] { /* Dark overrides */ }
[data-theme="high-contrast"] { /* Accessibility override */ }

.theme-switcher button {
  /* Works in any theme context */
  background: var(--color-primary, blue);
  color: var(--color-text-on-primary, white);
}
```

### P10.3 — Dark Mode

```css
/* System preference */
@media (prefers-color-scheme: dark) {
  :root { --color-bg: #0f172a; --color-text: #f1f5f9; }
}

/* Manual toggle */
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  --color-surface: #1e293b;
}
```

---

## P11 — UI COMPONENT TESTING

### P11.1 — Visual Regression Testing

```javascript
// Storybook + Chromatic
// Every story is automatically tested across viewport sizes

// storybook/Button.stories.tsx
export default { title: 'ui/Button' };

export const Primary = () => <Button variant="primary">Save</Button>;
export const Secondary = () => <Button variant="secondary">Cancel</Button>;
export const Sizes = () => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);
```

### P11.2 — Interaction Testing

```javascript
// Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button increments counter', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  expect(screen.getByText('0')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### P11.3 — Accessibility Testing

```javascript
// axe-core in tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## P12 — ADVANCED PATTERNS

### P12.1 — Intersection Observer for Lazy Loading

```javascript
const LazyImage = ({ src, alt }) => {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' } // Start loading 200px before visible
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? <img src={src} alt={alt} /> : <div className="placeholder" />}
    </div>
  );
};
```

### P12.2 — Resize Observer for Responsive Components

```javascript
const useContainerQuery = (selector) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const container = document.querySelector(selector);
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setMatches(entry.contentRect.width > 400);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [selector]);

  return matches;
};
```

### P12.3 — Dialog and Popover Patterns

```tsx
const Dialog = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement;
      dialogRef.current?.focus();
      return () => previouslyFocused?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="dialog-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <h2 id="dialog-title">{title}</h2>
      <button onClick={onClose} aria-label="Close">×</button>
      {children}
    </div>
  );
};
```

### P12.4 — Virtual Scrolling for Large Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualList = ({ items }) => {
  const parentRef = useRef();
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

_End of UI Engineer SKILL.md_