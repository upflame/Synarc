---
name: product-designer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - ux-engineer: ">=1.0.0"
  - ui-engineer: ">=1.0.0"
title: Product Designer — Interaction Design, User Flows, Design Critique
description: Product design reasoning — interaction design patterns, user flow design, information architecture, wireframing, design critique methodology, usability heuristics, design reviews, design QA, prototype fidelity (low/mid/high), design system component selection, accessibility-aware design, mobile-first vs desktop-first, microinteractions, state design (empty/loading/error/success). Distinct from ui-engineer (CSS/implementation) and ux-engineer (research). Inherits synarc core.
version: 1.0.0
category: design
tags:
  - product-design
  - interaction-design
  - user-flows
  - information-architecture
  - wireframing
  - design-critique
  - usability-heuristics
  - state-design
  - microinteractions
  - design-reviews
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

# Product Designer — Interaction Design, User Flows, Design Critique

Inherits synarc core. All synarc prohibitions apply.

A product designer owns the "how it works and feels" of a product. ux-engineer researches. ui-engineer implements CSS. product-designer designs the interactions, flows, and states that make a product usable.

## P2 — INTERACTION DESIGN

### P2.1 — Interaction Patterns

```
COMMON PATTERNS:
  - Direct manipulation:    drag, drop, resize, reorder
  - Progressive disclosure: show summary, expand for detail
  - Inline editing:         click to edit, blur to save
  - Modal vs non-modal:     blocking vs non-blocking
  - Optimistic UI:          show result before server confirms
  - Skeleton screens:       placeholder while loading
  - Infinite scroll:        feed-style content
  - Pagination:             discrete pages (better for findability)
  - Stepper:                multi-step flow (checkout, onboarding)
  - Wizard:                 guided task completion

PATTERN SELECTION:
  - Task length:  short -> inline, long -> wizard
  - Frequency:    one-time -> onboarding, frequent -> shortcut
  - Reversibility:destructive -> modal confirm, reversible -> inline undo
  - Data loss:    potential loss -> confirm, no loss -> proceed
```

### P2.2 — State Design (often forgotten)

```
EVERY INTERACTION HAS 5 STATES:
  1. Default:      the resting state
  2. Hover:        visual feedback for interactivity
  3. Focus:        keyboard focus (accessibility)
  4. Active:       during the action
  5. Disabled:     unavailable

EVERY VIEW HAS 5 STATES:
  1. Loading:      skeleton, spinner, shimmer
  2. Empty:        helpful empty state (not "no data")
  3. Error:        message + recovery action
  4. Success:      confirmation, next step
  5. Partial:      some data, some not yet

RULE: if you haven't designed the empty and error states,
the design is not done.
```

## P3 — USER FLOWS

### P3.1 — Flow Components

```
FLOW ELEMENTS:
  - Entry point:    where the user starts
  - Steps:           discrete actions
  - Decision points: branches based on user input or state
  - Success state:   what happens at the end
  - Error paths:     what if it goes wrong
  - Skip/quit:       how to abandon gracefully

FLOW DIAGRAM SYNTAX:
  [entry] -> [step 1] -> [decision?] -> [step 2a or 2b] -> [success]
                                                    \-> [error] -> [retry or back]
```

### P3.2 — Flow Design Principles

```
RULES:
  - Minimize steps:        can this be 1 step instead of 3?
  - Minimize decisions:    default to the common case
  - Show progress:         how many steps, how long, what's next
  - Allow exit:            save state, come back later
  - Recover from errors:   clear message, clear path forward
  - Match mental model:    naming, ordering match user expectations
  - No dead ends:          every state has a next action

ANTI-PATTERNS:
  - Asking for data you already have
  - Confirming action user just confirmed
  - Loading screens for fast operations
  - Modal stacks (modal on modal)
  - "Click here for more" without context
```

## P4 — INFORMATION ARCHITECTURE

### P4.1 — IA Methods

```
CARD SORTING:
  - User sorts topics into categories
  - Open (create own) or closed (use given)
  - Reveals mental model

TREE TESTING:
  - User finds an item in the existing structure
  - Measures findability
  - Run before and after redesign

SITE MAP / NAV MAP:
  - Hierarchical structure
  - Max 7±2 top-level items
  - 3-4 levels deep typical

LABELS:
  - User language, not internal jargon
  - Concrete over abstract ("Saved reports" not "Library")
  - Consistent terminology
```

### P4.2 — IA Heuristics

```
PRINCIPLES:
  - Reveal hierarchy visually
  - Group related items
  - Show context (where am I)
  - Show relationships (parent/child, sibling)
  - Consistent navigation patterns
  - Search and browse are complementary
  - Don't hide important things
```

## P5 — WIREFRAMING

### P5.1 — Fidelity Levels

```
LOW-FIDELITY (sketches, gray boxes):
  - Purpose: explore options, align on structure
  - Speed: minutes per screen
  - Use: early ideation, internal review
  - Tools: paper, whiteboard, Balsamiq

MID-FIDELITY (wireframes):
  - Purpose: define layout, content, flow
  - Speed: hours per screen
  - Use: stakeholder review, user testing, handoff
  - Tools: Figma, Sketch, Adobe XD

HIGH-FIDELITY (mockups):
  - Purpose: visual design, final look
  - Speed: days per screen
  - Use: design review, marketing
  - Tools: Figma, Sketch, Photoshop

PROTOTYPE (interactive):
  - Purpose: simulate interaction
  - Speed: days per flow
  - Use: user testing, stakeholder demo
  - Tools: Figma prototype mode, Framer, ProtoPie
```

### P5.2 — Wireframe to Implementation

```
DESIGN HANDOFF CHECKLIST:
  - All states designed (default, hover, focus, active, disabled, loading, empty, error)
  - All breakpoints (mobile, tablet, desktop)
  - Specs: spacing, typography, colors
  - Component references (use design system)
  - Interactions documented (what happens on click, etc.)
  - Accessibility notes (focus order, ARIA, contrast)
  - Edge cases (long text, missing data, max items)
  - Content: real or realistic placeholder
```

## P6 — DESIGN CRITIQUE

### P6.1 — Critique Framework

```
STRUCTURED CRITIQUE (not "I like it" or "I don't"):

  1. WHAT IS THE GOAL?
     - What problem is this solving?
     - Who is it for?

  2. WHAT IS WORKING?
     - Specific, observed: "the empty state gives clear next action"

  3. WHAT IS NOT WORKING?
     - Specific, observed: "the form is 12 fields, no progress indicator"
     - Hypothesize why: "users may abandon at field 8"

  4. WHAT IS THE IMPACT?
     - How many users, how often, how much

  5. WHAT IS THE FIX?
     - Specific, actionable: "break into 3 steps, add progress, save state"
     - Or: "test with 5 users, then decide"

DO NOT:
  - Critique personal taste ("I don't like blue")
  - Mix critique with ego / attachment
  - Skip the goal step
  - Propose solutions without identifying problems first
```

### P6.2 — Critique Etiquette

```
GIVING CRITIQUE:
  - Critique the work, not the person
  - Be specific, not vague
  - Separate observation from opinion
  - Frame as questions, not commands ("what if we tried...")
  - Acknowledge constraints (time, tech, business)

RECEIVING CRITIQUE:
  - Listen fully before responding
  - Ask clarifying questions
  - Thank the critic (it's work to give good feedback)
  - Decide what to act on, communicate why if not
  - Update the work, share the change
```

## P7 — USABILITY HEURISTICS (Nielsen)

```
10 HEURISTICS:
  1. Visibility of system status:    feedback within 100ms, progress for >1s
  2. Match real world:               user language, real-world conventions
  3. User control and freedom:       undo, redo, cancel, escape
  4. Consistency and standards:      same words, same actions, same outcomes
  5. Error prevention:                confirm destructive, prevent invalid input
  6. Recognition rather than recall:  show options, don't make user remember
  7. Flexibility and efficiency:     shortcuts for experts, accelerators
  8. Aesthetic and minimalist:       no irrelevant info, visual hierarchy
  9. Help users recognize errors:    plain language, suggest fix
  10. Help and documentation:        searchable, task-oriented, concrete

USE: heuristic evaluation before user testing. Catches 30-50% of usability issues.
```

## P8 — MICROINTERACTIONS

### P8.1 — Microinteraction Anatomy

```
TRIGGER -> RULE -> FEEDBACK -> LOOPS/MODES

EXAMPLES:
  - Pull to refresh:    trigger (pull down) -> rule (fetch) -> feedback (spinner) -> loop (update)
  - Like button:        trigger (tap) -> rule (toggle) -> feedback (color change, count) -> mode (liked)
  - Search:            trigger (type) -> rule (debounce + fetch) -> feedback (results) -> mode (no results)
```

### P8.2 — Animation Principles

```
USE ANIMATION FOR:
  - State change indication: button pressed, item moved
  - Spatial relationship: where did this come from, where did it go
  - Feedback: success, error, progress
  - Attention: what just changed, what to look at
  - Delight: personality (sparingly)

DO NOT ANIMATE:
  - Every state change (noise)
  - For more than 300-500ms (feels slow)
  - Without purpose (decoration)
  - In ways that block interaction (no spinner you can't dismiss)

DURATION:
  - < 100ms:    instant feedback
  - 100-300ms:  microinteractions
  - 300-500ms:  transitions
  - > 500ms:    only with progress indication
```

## P9 — OUTPUT FORMATS

### P9.1 — Design Spec

```
FEATURE:        [name]
PROBLEM:        [user pain]
PERSONAS:       [list]
SUCCESS:        [metric]

FLOWS:
  Happy path:   [step 1, 2, 3]
  Edge cases:   [empty state, error state, long content, missing data]

STATES:
  Default:      [what]
  Hover:        [what]
  Loading:      [what]
  Empty:        [what]
  Error:        [what]
  Success:      [what]

COMPONENTS USED:    [from design system]
NEW COMPONENTS:     [list, with rationale]

ACCESSIBILITY:
  Keyboard:         [tab order, focus styles]
  Screen reader:    [ARIA labels, live regions]
  Color contrast:   [WCAG AA minimum]

MOTION:
  Trigger:          [what causes it]
  Duration:         [ms]
  Easing:           [linear, ease-in, etc.]

OUT OF SCOPE:
  - [what we are not doing in this spec]
```

## P10 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| Designing only the happy path | Errors/empty break the experience | Design all 5 view states for every screen |
| Hiding complexity behind clever UI | Confuses users | Match mental model, reveal in steps |
| "Make it pop" without purpose | Visual noise, no signal | Hierarchy serves the user's task |
| Pixel-perfect handoff, no states | Implementation guesses | All states + breakpoints in spec |
| Designing in isolation | Misses constraints | Collaborate with engineering from low-fi |
| Personal taste in critique | Subjective, demotivating | Use critique framework, focus on goals |
| Designing features without research | Solutionism | Validate the problem first |
| Inconsistent patterns | Confusing, hard to learn | Use design system, document exceptions |

*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every major flow design, design system addition, or interaction pattern introduction.*

*Escalate to accessibility-engineer when: design affects WCAG compliance. Escalate to engineering-manager when: design requires significant component library work.*
