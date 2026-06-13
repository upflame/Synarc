---
name: content-designer
schema: skill-pack/v1
dependencies:
  - synarc-core: ">=6.0.0"
  - product-designer: ">=1.0.0"
title: Content Designer — Microcopy, Error Messages, UX Writing
description: Content design reasoning — microcopy principles, error message structure, empty state copy, button labels, confirmation dialogs, in-product help, onboarding copy, transactional emails, voice and tone guidelines, content accessibility (plain language, reading level, i18n considerations), content testing, content systems and component patterns. The writer for the product, not the marketer. Inherits synarc core.
version: 1.0.0
category: design
tags:
  - content-design
  - ux-writing
  - microcopy
  - error-messages
  - empty-states
  - button-labels
  - voice-and-tone
  - plain-language
  - i18n
  - onboarding-copy
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

# Content Designer — Microcopy, Error Messages, UX Writing

Inherits synarc core. All synarc prohibitions apply.

Content design is the discipline of writing the words in the product. Not marketing copy — the microcopy, error messages, button labels, empty states, and help text that make a product usable.


## P2 — MICROCOPY PRINCIPLES

### P2.1 — Core Rules

```
RULE 1: BE CONCISE
  - Cut every word you can
  - Long copy is rarely read
  - Aim for the shortest version that's still clear
  - Test by reading aloud; if you stumble, rewrite

RULE 2: BE CONCRETE
  - Bad:  "There was an error processing your request."
  - Good: "We couldn't save your changes. Check your connection and try again."
  - Use the specific noun, the specific action, the specific next step

RULE 3: BE CONVERSATIONAL
  - Write like you talk (in a professional context)
  - Avoid corporate jargon, legalese, marketing fluff
  - "You" not "the user"
  - Contractions are fine

RULE 4: BE CONSISTENT
  - Same word for the same thing always
  - Build a content style guide
  - Inconsistency forces users to learn twice
```

### P2.2 — Voice and Tone

```
VOICE:  stable, brand-level, who you are
TONE:   variable, context-dependent, how you say it in this moment

EXAMPLE VOICE:  confident, helpful, slightly playful, never condescending
EXAMPLE TONE in error:  "Oops, that didn't work. Try again?"
EXAMPLE TONE in success: "All set. Your report is ready."

TONE SHIFTS BY CONTEXT:
  - Default:      neutral, helpful
  - Error:        apologetic but not groveling, clear next step
  - Success:      brief, positive
  - Warning:      direct, no panic
  - Empty state:  encouraging, not accusatory

NOT "Hi there!" on every screen. Match the moment.
```


## P3 — ERROR MESSAGES

### P3.1 — Structure

```
GOOD ERROR MESSAGE = 3 PARTS:
  1. WHAT happened:    plain language, not the error code
  2. WHY it happened:  if known and helpful
  3. WHAT to do next:  specific action, button, or link

EXAMPLES:
  BAD:  "Error 503: Service Unavailable"
  GOOD: "We're having trouble connecting to the server. Try again in a moment."

  BAD:  "Invalid input"
  GOOD: "Email must include @. Enter an email like name@example.com."

  BAD:  "Action failed"
  GOOD: "We couldn't delete that file because it's open in another program. Close it and try again."

TONE:
  - Apologize briefly ("Sorry,...")
  - Don't blame the user
  - Don't make jokes about losing work
  - Don't use ALL CAPS or excessive punctuation (!!!)
```

### P3.2 — Error Categories

```
VALIDATION ERRORS (form input):
  - Inline, near the field
  - Specific: which field, what's wrong, what's expected
  - Live: validate on blur, not just on submit
  - Use real-time validation where it helps

SYSTEM ERRORS:
  - Toast or banner, not modal (don't block)
  - Generic message for the user, specific ID in console for support
  - Always offer a path: retry, refresh, contact support

404 / NOT FOUND:
  - Friendly, with a path back
  - Suggest: home, search, recent items
  - Don't apologize to a bot (but do for users)

PERMISSION DENIED:
  - Explain why (if helpful to user)
  - Suggest: ask for access, contact admin
  - Don't say "Forbidden" — say "You don't have access to this"

EMPTY STATES:
  - Not "No data"
  - Friendly explanation + action: "No projects yet. Create your first project."
  - Visual element (illustration, icon) when appropriate
```


## P4 — BUTTONS & CTAs

### P4.1 — Button Labels

```
RULES:
  - Verb + object: "Save changes", "Delete file", "Send invite"
  - Specific beats generic: "Send invite" not "Submit"
  - No "Click here": "Download report" or just the icon
  - Match the action: "Delete" not "Remove" if it deletes permanently

EXAMPLES:
  GOOD: "Save changes", "Create account", "Send message", "Delete project"
  BAD:  "OK", "Submit", "Yes", "Click here"

CONFIRM vs CANCEL:
  - Confirm: the action verb, specific
    "Delete project" (not "OK" or "Yes")
  - Cancel: clear alternative
    "Cancel" or "Keep" (if destructive)
  - In destructive: emphasize the action
    "Delete project" (red), "Keep project" (default)
```

### P4.2 — Action-Specific Patterns

```
CREATE:   "Create", "Add", "New [thing]"
SAVE:    "Save", "Save changes", "Apply"
DELETE:   "Delete", "Remove" (if recoverable)
ARCHIVE:  "Archive" (not "remove" if recoverable)
PUBLISH:  "Publish", "Make live", "Send live"
DUPLICATE: "Duplicate", "Make a copy"
```

## P5 — EMPTY STATES

### P5.1 — Types of Empty

```
FIRST-TIME EMPTY (user just signed up):
  - Welcome them
  - Explain the value
  - Single clear action: "Create your first project"
  - Visual: illustration or icon

NO-RESULTS EMPTY (search/filter found nothing):
  - Acknowledge what they searched
  - Suggest alternatives: clear filters, broader search, related items
  - Don't say "No results" alone

USER-ACTION EMPTY (they deleted everything):
  - Brief, not accusatory
  - Path forward: "Add new [thing]"
  - Don't show "Sorry you deleted everything"

ERROR-INDUCED EMPTY (failed to load):
  - Explain the failure (if it affects user)
  - Action: "Try again" or "Refresh"
  - Different from "no data" empty
```

### P5.2 — Empty State Pattern

```
STRUCTURE:
  - Visual element (optional but recommended)
  - Headline: what's missing, in user terms
  - Body: why it might be empty + what to do
  - Primary action: the next step

EXAMPLE:
  [illustration of empty inbox]
  No notifications yet
  When teammates comment or mention you, you'll see it here.
  [Browse the project] (secondary)
  [Invite teammates] (primary)
```


## P6 — ONBOARDING

### P6.1 — Onboarding Principles

```
GOAL:     time to first value (TTFV)
MEASURE:  activation rate (% who reach the aha moment)
CONSTRAINT: don't over-onboard (3-5 steps max)

PATTERNS:
  WIZARD:           3-5 steps, progress bar, save state
  PROGRESSIVE:      reveal features as user needs them
  SAMPLE-DRIVEN:    pre-populated with example data
  CHECKLIST:        show what's done, what's next
  TIME-TO-VALUE:    skip setup, use defaults, let user customize later
```

### P6.2 — Onboarding Copy

```
RULES:
  - Show, don't tell (screenshots > words)
  - One step, one action
  - Skip option (don't force)
  - Save state (come back later)
  - Personalize when possible (use their name, their data)

ANTI-PATTERNS:
  - "Welcome to [Product]! We're so excited to have you!"
  - 12-step onboarding
  - Tooltips on every screen
  - Tooltips that block interaction
  - No way to skip or come back later
```


## P7 — VOICE & TONE GUIDELINES

### P7.1 — Build a Voice Guide

```
BRAND ATTRIBUTES (3-5):
  e.g., confident, helpful, plain-spoken, no-nonsense

VOICE PRINCIPLES (3-5):
  - We say "you", not "the user"
  - We use active voice
  - We avoid jargon
  - We keep it short

VOCABULARY:
  - Preferred: "use", "make", "share", "find"
  - Avoid:     "utilize", "facilitate", "leverage", "synergy"

TONE BY CONTEXT:
  - Default:    warm, direct
  - Error:      apologetic, clear next step
  - Success:    brief, positive
  - Onboarding: welcoming, encouraging
  - Email:      more formal, but still you

EXAMPLES:
  - Before: "An error occurred during the operation."
  - After:  "We couldn't save your work. Try again?"

  - Before: "Users have the capability to..."
  - After:  "You can..."
```

## P8 — ACCESSIBILITY (Content)

### P8.1 — Plain Language

```
RULES:
  - Short sentences (< 20 words)
  - Common words over jargon
  - Active voice
  - Address the user directly
  - Reading level: grade 8 or below for general audience
  - Spell out acronyms on first use

EXAMPLES:
  Before: "Facilitate the dissemination of information to facilitate user acquisition."
  After:  "Share to get more users."

  Before: "Authentication credentials are invalid."
  After:  "That password doesn't match. Try again or reset it."

TOOLS:
  - Hemingway (reading level)
  - Grammarly (clarity)
  - Readable (multiple metrics)
```

### P8.2 — i18n Considerations

```
RULES:
  - Avoid idioms: "hit a home run" doesn't translate
  - Avoid culture-specific references
  - Use full words: avoid contractions if formality matters
  - Plan for 30-50% expansion: German, French longer than English
  - Don't concatenate strings: "You have {n} messages" not "You have" + n + "messages"
  - Date, time, currency: use locale-aware formatting
  - Allow RTL: Hebrew, Arabic
  - Use ICU MessageFormat for plurals: {n, plural, one {# message} other {# messages}}
```

## P9 — CONTENT TESTING

### P9.1 — How to Test Microcopy

```
METHOD 1: USABILITY TEST
  - 5 users per change
  - Watch them complete a task with the new copy
  - Look for: confusion, hesitation, error

METHOD 2: FIRST-CLICK TEST
  - "Where would you click to X?"
  - Measures findability of button labels

METHOD 3: COMPREHENSION TEST
  - "What does this error mean? What would you do?"
  - Measures clarity

METHOD 4: A/B TEST
  - For high-traffic surfaces
  - Measure: conversion, error rate, time to complete

METHOD 5: 5-SECOND TEST
  - Show for 5 seconds
  - "What was this page about?"
  - Measures hierarchy and scannability
```

## P10 — OUTPUT FORMATS

### P10.1 — Content Style Guide Entry

```
TERM:               [word or phrase]
USE:                [the preferred term]
DO NOT USE:         [synonyms to avoid]
DEFINITION:         [what it means in our product]
EXAMPLE IN USE:     [sentence using the term]
EXAMPLE WRONG:      [sentence using the wrong term]
```

### P10.2 — Error Message Spec

```
TRIGGER:        [what user action causes this]
CODE:           [internal error code]
USER MESSAGE:   [the visible text]
TONE:           [apologetic / informative / etc.]
NEXT ACTION:    [what user can do, button label]
INTERNAL LOG:   [what to log for support]
```

## P11 — ANTI-PATTERNS

| Anti-Pattern | Problem | Correct |
|---|---|---|
| "Click here" | Inaccessible, vague | Specific verb + object, or use a button |
| "Error 503" exposed | Confusing to users | Plain language + specific next step |
| "Sorry for the inconvenience" in every error | Groveling, no signal | Brief, actionable, move on |
| Marketing copy in UI | Disrupts task, confuses | Task-focused microcopy, marketing in marketing channels |
| Long button labels | Truncated on mobile | 1-3 words, verb + object |
| Inconsistent terms | "User" vs "Member" vs "Account" | Style guide, enforced in review |
| Idioms in UI | Don't translate, don't age well | Plain, universal language |
| Pun-y error messages | Clever but unclear | Clear first, personality second |
| Empty state says "No data" | Tells user nothing | Friendly explanation + action |
| ALL CAPS or excessive punctuation | Shouting, not professional | Sentence case, one period |


*Synarc S2 risk hard floors, S13 quality gates, S17 zero-tolerance violations apply. Ledger entry for every content style guide addition, voice change, or major copy rewrite.*

*Escalate to accessibility-engineer when: content affects WCAG or i18n. Escalate to legal when: copy has regulatory implications (financial, health, legal disclaimers).*
