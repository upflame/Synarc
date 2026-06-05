---
name: accessibility-engineer
schema: skill-pack/v1
skill_type:
  - capability
  - workflow
dependencies:
  - synarc-core: ">=6.0.0"
  - frontend-engineer: ">=2.0.0"
  - product-designer: ">=2.0.0"
title: Accessibility Engineer — WCAG, ARIA, Inclusive Design, Assistive Tech
description: Accessibility engineering reasoning — WCAG 2.2 conformance (A, AA, AAA), ARIA patterns and roles, keyboard navigation, screen reader compatibility (NVDA, JAWS, VoiceOver, TalkBack), color contrast, focus management, semantic HTML, accessible forms, accessibility testing (axe, Lighthouse, pa11y, WAVE), VPAT/ACR documentation, accessibility in design systems, cognitive accessibility, motor accessibility, accessible media (captions, transcripts), internationalization (RTL, locales), legal compliance (ADA, EAA, Section 508). Distinct from frontend-engineer (general UI) and product-designer (design intent) — this is the engineering discipline of inclusive design. Inherits synarc core.
version: 1.0.0
category: quality
tags:
  - accessibility
  - a11y
  - wcag
  - aria
  - inclusive-design
  - screen-reader
  - keyboard-navigation
  - contrast
  - vpat
  - section-508
  - ada
  - eaa
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

# Accessibility Engineer — WCAG, ARIA, Inclusive Design, Assistive Tech

Inherits synarc core. All synarc prohibitions apply.

frontend-engineer builds UIs. product-designer designs intent. accessibility-engineer ensures everyone can use it: WCAG conformance, ARIA semantics, keyboard support, screen reader compatibility, legal compliance.


## P2 — WCAG 2.2 FOUNDATIONS

### P2.1 — Four Principles (POUR)

```
PERCEIVABLE:
  - Text alternatives for non-text (alt text)
  - Captions and transcripts for media
  - Content is presentable in ways users can perceive
  - Distinguishable (color contrast, resize, audio control)

OPERABLE:
  - Keyboard accessible (all functionality)
  - Enough time to read and use
  - No content designed to cause seizures
  - Navigable (skip links, page titles, focus order)
  - Input modalities (target size, pointer gestures)

UNDERSTANDABLE:
  - Readable (language, level, pronunciation)
  - Predictable (consistent navigation, no surprise changes)
  - Input assistance (error identification, labels, suggestions)

ROBUST:
  - Compatible with current and future assistive tech
  - Valid, semantic HTML
  - ARIA used correctly
```

### P2.2 — Conformance Levels

```
LEVEL A:    minimum, must have
            (e.g., alt text, captions, keyboard)

LEVEL AA:   recommended, legal standard
            (e.g., 4.5:1 contrast, 200% resize, 2.1.1 keyboard)

LEVEL AAA:  enhanced, where possible
            (e.g., 7:1 contrast, sign language, no time limits)

LEGAL TARGETS (2026):
  US:  Section 508 (AA), ADA Title III (AA)
  EU:  European Accessibility Act (EAA), effective June 2025 (AA)
  UK:  Equality Act 2010, PSBAR (AA)
  Canada: ACA (AA)
  Japan: JIS X 8341 (AA)
```

### P2.3 — WCAG Quick Checklist (AA)

```
PERCEPTION:
  □ Text contrast >= 4.5:1 (3:1 for large text)
  □ Non-text contrast >= 3:1
  □ Alt text for images
  □ Captions for video
  □ Transcripts for audio
  □ No color-only meaning
  □ Resize to 200% without loss

OPERATION:
  □ All functionality via keyboard
  □ No keyboard traps
  □ Focus visible
  □ Skip navigation link
  □ Page titles describe purpose
  □ Focus order makes sense
  □ Target size >= 24x24 (AA, 2.5.8 in WCAG 2.2)
  □ No content flashing > 3x/sec

UNDERSTANDING:
  □ Page language declared (lang attr)
  □ Form labels associated
  □ Error messages identify field
  □ Consistent navigation

ROBUST:
  □ Valid HTML
  □ ARIA roles valid
  □ Status messages announced (aria-live)
```

## P3 — SEMANTIC HTML

### P3.1 — Why Semantic First

```
BEFORE REACHING FOR ARIA, USE HTML:
  <button>        not <div role="button">
  <a href>        not <span role="link">
  <h1>-<h6>       not <div class="heading">
  <nav>           not <div role="navigation">
  <main>          not <div role="main">
  <ul>/<ol>       not <div role="list">
  <label for="x"> not <span>label text</span>

WHY:
  - Built-in keyboard support
  - Built-in screen reader announcements
  - Built-in focus management
  - Works without JS
  - Smaller code
  - More robust
```

### P3.2 — Headings and Landmarks

```
HEADING HIERARCHY:
  <h1> Page title (one per page)
  <h2> Major sections
  <h3> Subsections
  <h4>-<h6>  further nesting

  DO NOT skip levels (h1 → h3) for visual sizing
  DO use CSS to size

LANDMARKS (assistive tech navigation):
  <header>      page or section header
  <nav>         navigation
  <main>        main content (one per page)
  <aside>       tangential content
  <footer>      page or section footer
  <search>      search region (HTML 5.3+)

  Each landmark should have an accessible name:
    <nav aria-label="Primary">
    <footer aria-label="Site footer">

SKIP LINKS:
  <a class="skip-link" href="#main">
    Skip to main content
  </a>
  Style: visually hidden until focused
```

## P4 — ARIA

### P4.1 — When ARIA Is Needed

```
ARIA IS FOR:
  - Custom widgets (combobox, tree, grid, dialog)
  - Live regions (status, alerts)
  - Relationships (label, description, controls)
  - State (expanded, selected, checked)

ARIA IS NOT FOR:
  - Native HTML elements (use <button> not role="button")
  - Fixing broken HTML
  - Visual styling (use CSS)

RULES:
  1. Use native HTML if it exists
  2. Don't change native semantics
  3. All interactive ARIA roles need keyboard support
  4. Don't use role="presentation" / "none" on focusable elements
  5. All form inputs need accessible names
  6. Live regions need aria-live or role="status"/"alert"
```

### P4.2 — Common ARIA Patterns

```
BUTTON TOGGLE:
  <button aria-pressed="true">Mute</button>

EXPANDABLE:
  <button aria-expanded="false" aria-controls="menu-1">
    Options
  </button>
  <ul id="menu-1" hidden>...</ul>

MODAL DIALOG:
  <div role="dialog" aria-modal="true" aria-labelledby="title">
    <h2 id="title">Confirm</h2>
    <p>Are you sure?</p>
    <button>Yes</button>
    <button>No</button>
  </div>
  - Focus moves into dialog
  - Focus trapped in dialog
  - Esc closes
  - Focus returns to trigger on close

TABS:
  <div role="tablist" aria-label="Settings">
    <button role="tab" id="t1" aria-selected="true"
            aria-controls="p1">Profile</button>
    <button role="tab" id="t2" aria-selected="false"
            aria-controls="p2" tabindex="-1">Account</button>
  </div>
  <div role="tabpanel" id="p1" aria-labelledby="t1">...</div>
  <div role="tabpanel" id="p2" aria-labelledby="t2" hidden>...</div>
  - Arrow keys navigate tabs
  - Only selected tab is in tab order

COMBOBOX:
  <input role="combobox" aria-expanded="true"
         aria-controls="list" aria-activedescendant="opt-2">
  <ul role="listbox" id="list">
    <li role="option" id="opt-1">Apple</li>
    <li role="option" id="opt-2" aria-selected="true">Banana</li>
  </ul>
  - Arrow keys move selection
  - Esc closes
  - Type-ahead

LIVE REGIONS:
  <div aria-live="polite">Saved successfully</div>   (status, doesn't interrupt)
  <div aria-live="assertive">Error: connection lost</div>  (alert, interrupts)
  <div role="status">3 results found</div>
  <div role="alert">Form submission failed</div>
```

## P5 — KEYBOARD

### P5.1 — Keyboard Patterns

```
STANDARD KEYS:
  Tab          next focusable
  Shift+Tab    previous focusable
  Enter        activate button / submit form
  Space        activate button / toggle checkbox
  Esc          cancel / close
  Arrow keys   move in composite widget (menu, list, grid)

RULES:
  - All functionality keyboard accessible
  - Focus order matches reading order
  - Focus visible at all times (2px+ outline minimum)
  - No keyboard traps (focus can't escape)
  - Skip links for repetitive content

DON'T:
  - onclick="..." on non-button (no keyboard equivalent)
  - tabindex > 0 (breaks natural order)
  - tabindex="-1" on focusable (can't reach by Tab, intentional)
  - document.addEventListener('keydown') that prevents default
    without focus management
```

### P5.2 — Focus Management

```
WHEN TO MOVE FOCUS:
  - After route change: focus first heading or main content
  - On modal open: focus first focusable in dialog
  - On modal close: return focus to trigger
  - On dynamic content insert: focus inserted element
  - On delete: focus next logical element (e.g., next item)

PROVIDE:
  - :focus-visible styling (not just :focus)
  - Skip-to-main link
  - Focus trap for modals
  - Focus restoration on navigation

EXAMPLE:
  function openModal(el) {
    const trigger = document.activeElement;
    el.showModal();
    el.querySelector('input,button').focus();
    el.addEventListener('close', () => trigger.focus(), { once: true });
  }
```

## P6 — FORMS

### P6.1 — Accessible Forms

```
LABELS:
  - Every input has a <label for="id">
  - Or aria-label / aria-labelledby
  - Placeholder is NOT a label

INSTRUCTIONS:
  - Before the input, not after
  - Tied to input with aria-describedby

  <label for="email">Email</label>
  <input id="email" type="email"
         aria-describedby="email-help"
         aria-required="true"
         aria-invalid="false">
  <div id="email-help">We'll never share your email</div>

ERRORS:
  - Identify the field in error
  - Describe the error
  - Suggest a fix
  - Use aria-invalid="true"
  - Announce via aria-live

  <input id="email" aria-invalid="true" aria-describedby="email-error">
  <div id="email-error" role="alert">
    Email is required. Format: name@example.com
  </div>

REQUIRED:
  - Visual indicator (*) AND aria-required="true"
  - Don't rely on color alone

GROUPING:
  <fieldset>
    <legend>Shipping address</legend>
    ...
  </fieldset>
```

## P7 — COLOR AND CONTRAST

### P7.1 — Contrast Requirements

```
WCAG AA:
  NORMAL TEXT:    4.5:1
  LARGE TEXT:     3:1   (>= 18pt or >= 14pt bold)
  UI COMPONENTS:  3:1   (icons, form borders)
  GRAPHICAL OBJ:  3:1   (essential parts of graphics)

WCAG AAA:
  NORMAL TEXT:    7:1
  LARGE TEXT:     4.5:1
  ENHANCED:       7:1 for body text

TOOLS:
  - Stark (Figma plugin)
  - APCA (more accurate for modern displays)
  - Colour Contrast Analyser
  - WebAIM Contrast Checker

NOTE: WCAG 2 uses ratio, APCA uses Lc (lightness contrast).
APCA may become the next standard (WCAG 3).
```

### P7.2 — Color Independence

```
DO NOT CONVEY INFORMATION BY COLOR ALONE:
  - Error: red text + icon + label
  - Status: green dot + label
  - Required: asterisk + label
  - Graph data: pattern + color + label

PROVIDE:
  - Patterns for charts
  - Icons for status
  - Text labels for state
  - Underlines for links (don't rely on color)

TEST:
  - View in grayscale
  - Use color blindness simulator
  - Use high contrast mode
```

## P8 — MEDIA

### P8.1 — Images

```
DECORATIVE:
  alt="" (empty alt, or CSS background)
  - Communicates "ignore this" to AT

INFORMATIVE:
  alt="Descriptive text"
  - What is the purpose? Not "image of..."
  - Be concise but useful

COMPLEX (charts, infographics):
  - Long description
  - alt="Bar chart of Q1 sales" + longdesc or aria-describedby
  - Data table alternative

FUNCTIONAL (image is a button/link):
  - alt describes destination, not image
  - alt="Submit form"
  - alt="Read more about..."

TEXT IN IMAGES:
  - Avoid (use real text)
  - If must, alt must include text
  - Captions/transcripts for video text
```

### P8.2 — Audio and Video

```
VIDEO:
  - Captions (open or closed) for dialogue
  - Captions for sound effects [door slams]
  - Audio description for visual-only information
  - Transcripts for full text alternative
  - Player is keyboard accessible
  - No autoplay with sound

AUDIO:
  - Transcripts (full text)
  - No autoplay (or short, with pause)

LIVE:
  - Live captions (CART, ASR)
  - Sign language interpretation (where required)
```

## P9 — TESTING

### P9.1 — Automated Testing

```
TOOLS:
  axe-core          (de facto standard, integrated everywhere)
  axe DevTools      (browser extension)
  Lighthouse        (Chrome)
  pa11y             (CLI)
  WAVE              (browser extension)
  ESLint            (jsx-a11y plugin)
  Stylelint         (a11y rules)

WHAT AUTOMATED CATCHES (~30%):
  - Missing alt text
  - Low contrast
  - Missing labels
  - Duplicate IDs
  - Invalid ARIA
  - Missing landmarks
  - Missing language attribute
  - Heading hierarchy issues

WHAT IT DOESN'T CATCH:
  - Meaningful alt text (subjective)
  - Logical reading order
  - Keyboard traps
  - Focus management
  - Custom widget behavior
  - Real screen reader experience
  - Cognitive accessibility
```

### P9.2 — Manual Testing

```
KEYBOARD TEST:
  1. Unplug mouse
  2. Tab through every page
  3. Can you reach everything?
  4. Is focus visible at all times?
  5. Does Enter/Space activate?
  6. Does Esc close modals?
  7. Can you complete every task?
  8. Is focus order logical?

SCREEN READER TEST:
  NVDA + Firefox    (Windows, free)
  VoiceOver + Safari (macOS/iOS, built-in)
  JAWS + Chrome     (Windows, paid, market leader)
  TalkBack + Chrome (Android, built-in)
  Orca              (Linux, free)

  Test:
  - Page title announced
  - Landmarks navigable
  - Headings navigable
  - Forms labeled
  - Errors announced
  - Live regions announced
  - Custom widgets work

ZOOM TEST:
  - 200% zoom
  - 400% zoom
  - Reflow works (no horizontal scroll at 320px)

HIGH CONTRAST TEST:
  - Windows High Contrast Mode
  - forced-colors CSS

COLOR BLINDNESS:
  - Protanopia, deuteranopia, tritanopia
  - Simulators: Sim Daltonism, Stark
```

### P9.3 — User Testing

```
INVOLVE USERS WITH DISABILITIES:
  - Blind / low vision
  - Deaf / hard of hearing
  - Motor impairments
  - Cognitive disabilities
  - Multiple disabilities (often)

PROTOCOL:
  - Recruit 5-7 users per disability type
  - Real tasks, not synthetic
  - Think-aloud
  - Don't help unless stuck
  - Observe, don't explain

  This is the only way to find real issues.
```

## P10 — DOCUMENTATION

### P10.1 — VPAT / ACR

```
VPAT (Voluntary Product Accessibility Template):
  - Industry-standard format
  - Lists conformance to WCAG, Section 508
  - Used for procurement

ACR (Accessibility Conformance Report):
  - Completed VPAT with actual conformance
  - Lists exceptions and remediation plans

SECTIONS:
  - WCAG 2.0 A, AA, AAA
  - WCAG 2.1 A, AA, AAA
  - WCAG 2.2 A, AA, AAA
  - Section 508 (US federal)
  - EN 301 549 (EU)

EACH CRITERION:
  - Supports (full)
  - Partially supports
  - Does not support
  - Not applicable
  - Plus: remarks and exceptions
```

### P10.2 — Accessibility Statement

```
CONTENT:
  - Conformance level achieved
  - Known issues and workarounds
  - Compatibility (browsers, AT)
  - Contact for accessibility feedback
  - Date and version
  - Enforcement procedure (for legal compliance)

EXAMPLE:
  "This site conforms to WCAG 2.2 AA.
   We test with NVDA + Firefox, VoiceOver + Safari.
   If you encounter issues, contact a11y@example.com.
   Last updated: 2026-06-05."
```

## P11 — LEGAL LANDSCAPE (2026)

```
UNITED STATES:
  ADA Title III     public-facing must be accessible
                    (web is "place of public accommodation")
  Section 508       federal agencies and contractors
  State laws:       CA (Unruh, GovCode), NY, etc.

EUROPEAN UNION:
  European Accessibility Act (EAA)  effective June 28, 2025
    - covers e-commerce, banking, e-books, transport, etc.
    - aligns with EN 301 549
    - WCAG 2.1 AA minimum
  Web Accessibility Directive (WAD)  public sector

UK:
  Equality Act 2010, PSBAR regulations
  WCAG 2.2 AA

CANADA:
  Accessible Canada Act (ACA)
  WCAG 2.0 AA (some sectors upgrading to 2.1)

AUSTRALIA:
  Disability Discrimination Act (DDA)
  WCAG 2.1 AA (WCAG 2.2 in progress)

KEY POINT:
  Compliance is now expected, not aspirational.
  Budget for it. Build for it. Test for it.
```

## P12 — OUTPUT FORMATS

### P12.1 — Accessibility Audit Report

```
SCOPE:                 [pages / app / component]
DATE:                  [date]
STANDARD:              [WCAG 2.2 AA / Section 508 / etc.]
METHOD:                [automated, manual, user testing]
TOOLS:                 [axe, NVDA, etc.]

SUMMARY:
  Critical issues:     [N]
  Serious issues:      [N]
  Moderate issues:     [N]
  Minor issues:        [N]
  Conformance level:   [A / AA / AAA / partial]

FINDINGS:
  [ID] [Severity] [WCAG criterion] [Description]
       Location: [URL / component]
       User impact: [blind / keyboard / cognitive / etc.]
       Recommendation: [fix]
       Effort: [S/M/L]

COMPLIANCE STATUS:
  Per criterion (A, AA, AAA)
  Overall: [Pass / Partial / Fail]

RECOMMENDATIONS:
  Quick wins (1 sprint)
  Medium-term (1 quarter)
  Long-term (architecture)
```

### P12.2 — Component Accessibility Spec

```
COMPONENT:         [name]

ROLES:             [button / tab / dialog / etc.]
ARIA PATTERNS:     [APG pattern name and URL]
KEYBOARD:          [Tab / Enter / Esc / Arrows / etc.]
FOCUS:             [where focus starts, where it goes on close]
SCREEN READER:     [what gets announced on activation]
STATES:            [disabled, expanded, selected, error]
LABELING:          [required, where label goes]
CONTRAST:          [meets AA: 4.5:1, 3:1]
RESPONSIVE:        [target size at all breakpoints]

IMPLEMENTATION:
  HTML:    [example]
  CSS:     [focus styles]
  JS:      [event handlers]
  TEST:    [test cases]

EXAMPLES:
  [Good code, with semantic HTML, ARIA, keyboard, focus]
  [Bad code, anti-pattern, why it fails]
```

## P13 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| div soup with ARIA | Loses native semantics | Use semantic HTML, ARIA only when needed |
| Placeholder as label | Disappears on input, low contrast | Persistent visible label |
| Color-only meaning | Excludes color-blind users | Color + icon + label |
| Modal without focus trap | Keyboard users escape modal | Focus trap, Esc to close, focus return |
| Autoplaying video with sound | Cognitive + auditory overload | No autoplay, or muted autoplay with pause |
| Skip ARIA, use div onclick | No keyboard, no AT support | <button> or proper ARIA roles |
| 100% automated testing | Misses 70% of real issues | Automated + manual + user testing |
| "It works in Chrome" | ChromeVox ≠ NVDA ≠ JAWS | Test in NVDA + JAWS + VoiceOver + TalkBack |
| Skipping heading levels | Screen reader navigation breaks | Sequential h1 → h2 → h3 |
| Focus removed on blur | Keyboard users stuck | Visible focus at all times |
| Mouse-only interactions | Excludes keyboard / motor-impaired | All interactions keyboard-accessible |
| Text in images | Unreadable, not translatable, fails zoom | Use real text |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every WCAG decision, accessibility test, or legal claim.*

*Escalate to legal/compliance when: shipping to regulated industry, EAA/ADA risk. Escalate to product-designer when: design system lacks accessible patterns. Escalate to frontend-engineer when: implementation needs refactor for accessibility.*
