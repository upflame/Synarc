---
name: design-systems-engineer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - ui-engineer: ">=1.0.0"
  - frontend-engineer: ">=2.0.0"
title: Design Systems Engineer — Tokens, Component Libraries, Multi-Brand Theming
description: Design systems engineering reasoning — design token architecture (primitive, semantic, component), token formats (Style Dictionary, W3C Design Tokens), component library design (anatomy, API, variants, composition), multi-brand theming, documentation systems (Storybook, etc.), contribution model, versioning and deprecation, design-code drift, Figma-to-code pipelines, white-label product architecture, accessibility baked into tokens. Inherits synarc core.
version: 1.0.0
category: design
tags:
  - design-systems
  - design-tokens
  - component-library
  - theming
  - white-label
  - style-dictionary
  - storybook
  - figma-to-code
  - design-code-drift
  - accessibility-tokens
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

# Design Systems Engineer — Tokens, Component Libraries, Multi-Brand Theming

Inherits synarc core. All synarc prohibitions apply.

A design systems engineer builds the shared visual + interaction language of a product. The work is tokens, components, documentation, and governance — not one-off screens.


## P2 — DESIGN TOKENS

### P2.1 — Token Architecture (3 Tiers)

```
TIER 1: PRIMITIVE TOKENS (raw values)
  - color.blue.500:    #3B82F6
  - spacing.4:         16px
  - font.size.14:      14px
  - radius.md:         8px
  - shadow.md:         0 4px 6px rgba(0,0,0,0.1)
  - Purpose: single source of truth for raw values
  - Naming: semantic only of the value type (blue.500), not purpose

TIER 2: SEMANTIC TOKENS (intent)
  - color.action.primary:        var(--color-blue-500)
  - color.text.body:             var(--color-gray-900)
  - color.surface.elevated:      var(--color-white)
  - spacing.layout.gutter:      var(--spacing-4)
  - font.body.size:              var(--font-size-14)
  - Purpose: map intent to primitive
  - Naming: by purpose, not value
  - Allows: theming, dark mode, multi-brand

TIER 3: COMPONENT TOKENS (component-specific)
  - button.primary.bg:           var(--color-action-primary)
  - button.primary.text:         var(--color-text-inverse)
  - card.padding:                var(--spacing-layout-gutter)
  - Purpose: component-level defaults
  - Naming: by component
  - Allows: component-level overrides without changing tokens
```

### P2.2 — Why 3 Tiers

```
CHANGE PROPAGATION:
  Primitive -> Semantic:  rename a primitive, semantic updates automatically
  Semantic -> Component:  change semantic intent, components update

EXAMPLES:
  - Switch blue.500 to a new blue:  only primitive changes
  - Switch "primary action" from blue to green: only semantic changes
  - Make button bigger in one place:  only component changes

ANTI-PATTERN: using primitives directly in components.
  Result: 100 files to update when brand color changes.
```

### P2.3 — Token Formats

```
FORMATS:
  - Style Dictionary:    JSON/YAML input, multi-platform output (CSS, iOS, Android, etc.)
  - W3C Design Tokens:   upcoming standard, vendor-neutral
  - CSS custom properties: simplest, web-only
  - Tailwind config:     if you use Tailwind, that's your token layer

STYLE DICTIONARY STRUCTURE:
  tokens/
    color/
      primitive/
        blue.json
      semantic/
        action.json
    spacing/
      primitive.json
      semantic.json
    components/
      button.json
      card.json
  build.js    // platform-specific outputs
  platforms/
    css.json
    ios.json
    android.json
```

## P3 — COMPONENT LIBRARY

### P3.1 — Component Anatomy

```
EVERY COMPONENT HAS:
  NAME:        stable, semantic (Button, not Box1)
  PURPOSE:     1 sentence, what it's for
  VARIANTS:    visual variants (primary, secondary, ghost)
  SIZES:       size variants (sm, md, lg)
  STATES:      default, hover, focus, active, disabled, loading, error
  PROPS/API:   the contract
  ANATOMY:     sub-parts (label, icon, container)
  COMPOSITION: how it composes with other components
  A11Y:        role, keyboard, ARIA, contrast
  TOKENS:      which tokens it uses
  EXAMPLES:    common use cases
  ANTI-PATTERNS: what NOT to do
  VERSION:     semver
  STATUS:      draft / beta / stable / deprecated
```

### P3.2 — Component API Design

```
PROPS THAT MATTER:
  - variant:  visual style (primary, secondary)
  - size:     visual size (sm, md, lg)
  - state:    visual state (default, loading, error)
  - disabled: boolean
  - fullWidth: boolean
  - onClick:  action
  - children: content

PROPS TO AVOID:
  - color="red":           use semantic intent
  - customStyle={...}:     escapes the system
  - position="top-right":  use composition
  - showIcon:              use <Button.Icon>

NAMING CONVENTION:
  - Boolean props:  is*, has*, show*, can*  (or just the name)
  - Variant props:  variant="primary"
  - Size props:     size="md"
  - Action props:   onClick, onChange
```

### P3.3 — Composition

```
PRIMITIVES vs COMPOSITIONS:
  PRIMITIVE:    <Button>
  COMPOSITION:  <Button.Group><Button>Save</Button><Button>Cancel</Button></Button.Group>

EXAMPLES:
  - Card:        <Card><Card.Header>...</Card.Header><Card.Body>...</Card.Body><Card.Footer>...</Card.Footer></Card>
  - Form:        <Form><Form.Field><Form.Label>...</Form.Label><Form.Input /></Form.Field></Form>
  - List:        <List><List.Item>...</List.Item></List>

RULES:
  - Components compose, not configure
  - Avoid prop sprawl: if a component has > 10 props, split it
  - Use slots / children for content, props for behavior
  - Use compound components for related parts
```

## P4 — THEMING

### P4.1 — Theme Architecture

```
THEME = collection of semantic + component tokens

THEME STRUCTURE:
  themes/
    light.json      // default
    dark.json       // dark mode
    high-contrast.json
    brand-a.json    // white-label brand A
    brand-b.json    // white-label brand B
    print.json      // for print stylesheets

THEME SWITCHING:
  - Set theme on <html data-theme="dark"> or root element
  - CSS variables update based on attribute
  - All components automatically re-style

ACCESSIBILITY THEMES:
  - high-contrast:    for users with low vision
  - dark:             for low-light environments
  - reduced-motion:   for users with vestibular issues
  - large-text:       for users who need bigger text
  Provide a theme switcher, persist user choice
```

### P4.2 — Multi-Brand / White-Label

```
ARCHITECTURE:
  - One component library
  - N theme files (one per brand)
  - App loads its brand's theme at runtime
  - Zero code changes per brand

BRAND-SPECIFIC:
  - Colors, typography, logo, sometimes spacing scale
  - Maybe: component variants (one brand has a "feature" button)

ANTI-PATTERNS:
  - Hardcoding brand colors in components
  - Branching component code per brand
  - Different component sets per brand
  Use tokens + themes instead.
```

## P5 — DOCUMENTATION

### P5.1 — Documentation Sites

```
TOOLS:
  - Storybook:    most popular, isolated dev environment
  - Histoire:     Vue-native Storybook alternative
  - Docz:         MDX-based
  - Docusaurus:   for broader docs
  - Custom:       if you have very specific needs

EVERY COMPONENT STORY INCLUDES:
  - Default state
  - All variants
  - All sizes
  - All states (hover, focus, disabled, loading, error)
  - All sizes together (responsive)
  - With long content (overflow handling)
  - With empty/zero state
  - Interactive: knobs, controls
  - Code snippet (copy-pasteable)
  - A11y notes
  - When to use, when NOT to use
  - Design link
```

### P5.2 — Living Documentation

```
KEEP DOCS IN SYNC:
  - Component PR must update story
  - CI fails if story missing for a component
  - Visual regression tests catch drift
  - Quarterly doc audit
  - Deprecations: clear notice in story + CHANGELOG
  - "This component is deprecated, use X instead" banner
```

## P6 — GOVERNANCE

### P6.1 — Contribution Model

```
MODELS:
  CENTRALIZED:    one team owns the system
                  Pros: consistency
                  Cons: bottleneck, slow

  FEDERATED:      domain teams contribute, central team curates
                  Pros: distributed ownership
                  Cons: coordination overhead

  OPEN SOURCE:    any engineer can contribute, PR review by maintainers
                  Pros: speed, adoption
                  Cons: quality variance

CHOOSE BASED ON:
  - Team size:  small -> centralized, large -> federated
  - Product complexity: simple -> centralized, complex -> federated
  - Adoption:    low -> centralized, high -> federated
```

### P6.2 — Versioning and Deprecation

```
SEMANTIC VERSIONING:
  MAJOR:  breaking API change (component removed, prop renamed, behavior changed)
  MINOR:  new component, new variant, new prop (backward compatible)
  PATCH:  bug fix, token value tweak, typo

DEPRECATION PROCESS:
  1. Mark deprecated in code (JSDoc, prop type)
  2. Show warning in dev mode
  3. Add migration guide
  4. Set sunset date (typically next major version)
  5. Communicate to consumers
  6. Remove on sunset date

NEVER:
  - Remove a component without 6+ months notice
  - Change a prop type silently
  - Break the API in a minor version
```

## P7 — DESIGN-CODE DRIFT

### P7.1 — Causes of Drift

```
CAUSES:
  - Designer updates Figma, code not updated
  - Engineer tweaks style, design not updated
  - Component is used in undocumented way
  - New design needs don't match existing tokens
  - Time pressure: "just do it for this screen"

SYMPTOMS:
  - Same component looks different in different places
  - One-off color values in component files
  - Components don't match design files
  - New screen requires new colors
  - Designers frustrated, engineers frustrated
```

### P7.2 — Drift Prevention

```
TOOLS:
  - Visual regression tests (Chromatic, Percy)
  - Token-based styling only (no hardcoded values)
  - Lint rules: no hex colors in component code
  - PR review: design + code review for any visual change
  - Quarterly design audit: does code match Figma?
  - Single source of truth: tokens

PROCESS:
  - Figma uses tokens (variables), not hardcoded values
  - Code consumes tokens, not raw values
  - One change, both update automatically (via token build)
```

## P8 — ACCESSIBILITY IN DESIGN SYSTEMS

### P8.1 — Bake A11y In

```
IN TOKENS:
  - color.text.body:    meets WCAG AA on color.surface.base
  - color.action:       meets WCAG AA on color.surface.interactive
  - focus.ring:         visible, 3:1 contrast minimum

IN COMPONENTS:
  - Every interactive: keyboard accessible
  - Focus management:  logical order
  - ARIA:              roles, states, properties
  - Labels:            associated with controls
  - Live regions:      for dynamic content

IN DOCUMENTATION:
  - A11y notes per component
  - Tested with screen reader, keyboard only
  - Color contrast documented
```

## P9 — OUTPUT FORMATS

### P9.1 — Token Spec

```
TIER:        primitive | semantic | component
NAME:        color.action.primary
TYPE:        color
VALUE:       var(--color-blue-500)  // or #3B82F6 for primitive
DESCRIPTION: primary action color (CTAs, links)
FALLBACK:    (some platforms don't support variables)
PLATFORMS:   web, ios, android, ...
```

### P9.2 — Component Spec

```
NAME:        Button
VERSION:     2.1.0
STATUS:      stable
PURPOSE:     trigger an action

VARIANTS:    primary, secondary, ghost, danger
SIZES:       sm (32px), md (40px), lg (48px)
STATES:      default, hover, focus, active, disabled, loading

API:
  variant:    enum
  size:       enum
  disabled:   boolean
  loading:    boolean
  fullWidth:  boolean
  onClick:    function
  children:   ReactNode

A11Y:
  role:       button
  keyboard:   Space/Enter triggers
  focus:      visible ring
  aria:       aria-disabled, aria-busy when loading

TOKENS USED:
  - color.action.primary
  - color.text.inverse
  - spacing.layout.gutter
  - radius.md

DEPRECATIONS:
  - icon prop (use Button.Icon child)

EXAMPLES:
  <Button variant="primary" onClick={save}>Save</Button>
```

## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Hardcoded values in components | Drift, impossible to rebrand | Use semantic tokens always |
| One tier of tokens (no semantic) | Can't rebrand, can't theme | 3-tier architecture |
| Component with > 10 props | Prop sprawl, hard to use | Split or use composition |
| Components that take "style" prop | Escape hatch defeats the system | Variants + composition |
| No deprecation policy | Forced migration chaos | 6-month notice + migration guide |
| Docs out of sync with code | Users can't trust the system | Storybook in CI, visual regression |
| White-label via code branches | N copies of the codebase | Themes + tokens |
| Components without a11y | Retrofitting is expensive | Bake in from day 1 |
| Token values in component names | Can't change without rename | Semantic names, change values freely |
| Component without all states | Designers/eng guess at hover, disabled | All 5 states designed and tested |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every new component, token tier addition, or breaking change.*

*Escalate to accessibility-engineer when: token changes affect WCAG. Escalate to frontend-engineer when: component changes affect build or bundle size. Escalate to cto when: design system strategy is org-wide.*
