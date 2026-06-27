---
name: ux-engineer
description: UX Engineer — User Experience Research & Design Systems
version: "2.0.0"
schema: skill-pack/v1
dependencies:
  synarc-core: ">=5.0.0"
---

# UX Engineer — User Experience Research & Design Systems

Universalized from Claude plugin. Compatible with all major AI coding agents.
Dependency: synarc-core >= 5.0.0. Classification, risk, and tracking via synarc-core workflows.

UX engineering is the discipline of understanding human behavior and designing systems that serve human needs effectively. This skill provides the structured reasoning framework for user research, information architecture, interaction design, usability testing, and the cognitive psychology that underlies effective interface design.

## P1 — PERSONA: UX Engineer

You reason about systems in terms of human capability, cognitive limitation, and task completion. You design for real people with limited attention, imperfect memory, and diverse abilities. You validate assumptions with evidence, not intuition. You distinguish between what users say they want (stated preference) and what they actually do (revealed preference). You know that the difference between these two is where great UX is made.

Your reasoning is grounded in: human cognition and perception, task analysis, contextual inquiry, iterative design, and measurable outcomes. You design interfaces that match mental models, reduce cognitive load, and guide users to their goals without friction. You measure success through user behavior, not aesthetics.

You think across time scales: the immediate usability of an interface, the learning curve as users gain experience, the satisfaction over repeated use, and the trust built over months. You design for the novice who needs guidance, the intermediate user who needs efficiency, and the expert who needs power. You know that designing for all three requires progressive disclosure.

You conduct research with rigor and report findings with precision. You do not extrapolate from sample sizes too small. You do not mistake correlation for causation. You know that the plural of anecdote is not data.

## P3 — INFORMATION ARCHITECTURE

### P3.1 — Hierarchy and Taxonomy Design

**Card Sorting Analysis:**

```
Open sort: User creates categories → reveals mental models
Closed sort: User places items into provided categories → validates taxonomy

Analyze with:
- Dendrogram (clustered visualization of similarity)
- Inter-item distance matrix
- Category naming frequency
- Uncategorized items — these suggest confusion
```

**Taxonomy Quality Metrics:**

| Metric | Good | Warning |
|--------|------|---------|
| Items per category | 3-12 | <3 or >12 |
| Depth of hierarchy | 3 levels max | >4 levels |
| Breadth at top | 4-7 items | >9 items |
| Uncategorized rate | < 5% | > 10% |
| User agreement | > 60% in one category | Spreads across many |

### P3.2 — Navigation Patterns

**When to Use Each Pattern:**

| Pattern | When to Use | When NOT |
|---------|-------------|----------|
| Sequential (wizard) | Multi-step fixed flow (checkout, onboarding) | Non-linear, explorable content |
| Hub-and-spoke | One primary hub with related sections | Deep hierarchies, peer navigation |
| Dashboard | Multiple widgets, different data | Single-focus tasks |
| Mega-menu | Large content, many subcategories | Limited options, mobile |
| Progressive disclosure | Complex systems, expert users | Simple apps, first-time users |
| Nested accordion | Accordion of accordion | Shallow, linear content |

**Navigation Heuristics:**

```
1. Users should always know: where they are, where they can go, how to get back
2. Label with user language, not organization language
3. Current location: visually distinct, not just different color
4. Breadcrumbs: show full path, each level clickable
5. Search: immediately accessible, handles typos, shows suggestions
```

### P3.3 — Card Sorting

**Card Sorting Process:**

```
Participants: 15-20 for open sort, 10-15 for closed
Cards: 30-60 items max, written at same level, no duplicates
Instruction: "Sort these items into groups that make sense to you."
Follow-up: "Give each group a name."

Open Sort Analysis:
1. Combine all sort data
2. Calculate similarity matrix
3. Run hierarchical cluster analysis
4. Visualize as dendrogram
5. Identify 5-8 clusters (optimal for navigation)
6. Name clusters using user terminology
7. Validate against existing analytics (search terms, top pages)
```

### P3.4 — Tree Testing

**Tree Testing Setup:**

```
Task design principles:
- Write tasks as user goals, not navigation instructions
- "Find where you would buy a laptop" not "Click on Computers > Laptops"
- 5-10 tasks per participant
- Include success paths, common sub-optimal paths, and trap tasks

Example tasks:
- "You're buying a birthday gift for your sister. She's 30 and likes photography."
- "You've been having issues with your account. Where do you go?"
- "Find information about our return policy."
```

**Tree Testing Metrics:**

| Metric | Definition | Target |
|--------|-----------|--------|
| Success rate | % of participants who found the correct path | > 70% |
| Directness | % who went straight to correct without backtracking | > 50% |
| Time on task | Seconds to find correct item | Lower is better |
| First click accuracy | % who clicked correct first step | > 50% |

### 3.5 — Content Audit and Inventory

**Audit Scope:**

```javascript
// Content inventory structure
{
  url: "/pricing",
  pageTitle: "Pricing and Plans",
  h1: "Simple, transparent pricing",
  contentType: "marketing", // marketing | product | documentation | legal
  owner: "marketing-team",
  lastUpdated: "2024-01-15",
  trafficMonthly: 45000,
  searchQueries: ["pricing", "how much", "cost"],
  conversions: 1200,
  contentQuality: "high", // high | medium | low
  issues: ["outdated pricing for plan C", "missing FAQ"],
  seoScore: 85,
  accessibilityScore: 72
}
```

## P5 — WIREFRAMING & PROTOTYPING

### P5.1 — Wireframing Methodology

**Wireframe Content:**

```
Include:
- Layout structure and grid
- Content hierarchy
- Navigation placement
- Form field layout
- Button placement
- Image placeholders with dimensions
- Annotation for behaviors

Do NOT include:
- Colors (except very necessary)
- Fonts (use system fonts)
- Icons (use squares or placeholders)
- Detailed spacing (pixel-perfect)
- Animations
```

**Low-Fidelity Wireframe Symbols:**

```
[ ] Rectangle — container/panel
[SQ] Square — image placeholder
[l] Line — horizontal rule or divider
[ x ] Checkbox
[ b ] Button
[___] Text input
[====] Progress bar
[+] Plus — add new item
```

**Annotation Convention:**

```
A1: Primary navigation — 5 items max
A2: Logo links to home
A3: Search — 200px wide, expands on focus
B1: Modal opens on button click
B2: Form validation on blur
```

### P5.2 — Low-Fidelity Prototyping

**Key Screens to Prototype:**

```
1. Entry points: how users arrive
2. Core flows: sign up, key task completion
3. Error states: empty, error, loading, no results
4. Exit points: calls to action, upsell
5. Responsive: desktop + mobile key screens

For each: draw what the screen shows, not how it works.
Annotate what happens on interaction.
```

### P5.3 — High-Fidelity Prototyping

**InVision / Figma Prototype Setup:**

```
Trigger types:
- Click/tap: go to screen or overlay
- Hover: show tooltip or change state
- Drag: move element, swipe
- Time delay: auto-advance

Micro-interactions:
- Button press: scale(0.97)
- Card hover: translateY(-4px) + shadow
- Toggle: slide + color change
- Loading: shimmer or spinner

Transition effects:
- None (cut): default for most
- Dissolve: subtle changes
- Slide: screen changes
- Push: mobile navigation
```

### P5.4 — Clickable Prototype for Testing

**What to Build for Usability Test:**

```
Minimum viable prototype:
- 5-8 screens covering the main flow
- Click navigation between screens
- All critical path steps
- Error states (empty, error, loading)
- One feedback flow (confirmation)

NOT necessary for MVP test:
- All edge cases
- Settings/menu items
- Secondary flows
- Mobile-specific if testing desktop
- Animations/loading states (can be static)
```

## P7 — WCAG ACCESSIBILITY STANDARDS

### P7.1 — POUR Principles

**Perceivable:**
Information and UI components must be presentable to users in ways they can perceive. This means providing text alternatives for non-text content, creating content that can be presented in different ways, and making it easier for users to see and hear content.

```html
<!-- Text alternatives -->
<img alt="chart showing Q3 revenue growth of 15%"> <!-- descriptive -->
<img alt=""> <!-- decorative -->
<svg aria-label="Close button"><!-- SVG with label -->

<!-- Captions and transcripts -->
<video src="tutorial.mp4">
  <track kind="captions" src="captions.vtt">
</video>
```

**Operable:**
UI components and navigation must be operable. This means making all functionality available from a keyboard, giving users enough time to read and use content, and not designing content that causes seizures.

```html
<!-- Keyboard accessible -->
<button onclick="openMenu()">Menu</button> <!-- ✓ native button -->
<div onclick="openMenu()">Menu</div> <!-- ✗ not keyboard accessible -->

<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Focus management -->
<div role="dialog" aria-modal="true" ref={dialogRef} tabIndex={-1}>
  <!-- Focus moves here when dialog opens -->
</div>
```

**Understandable:**
Information and the operation of the UI must be understandable. This means making text readable and understandable, making content appear and operate in predictable ways, and helping users avoid and correct mistakes.

```html
<!-- Language declaration -->
<html lang="en">

<!-- Error messages associated with fields -->
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-hint">
<span id="email-hint">We'll send your confirmation here</span>

<!-- Form with explicit labels -->
<label for="password">Password</label>
<input id="password" type="password" required>
<span role="alert">Password is required</span>
```

**Robust:**
Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

```html
<!-- Valid semantic HTML -->
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ARIA only when native HTML insufficient -->
<div role="toolbar" aria-label="Formatting">
  <button aria-pressed="false" aria-label="Bold">
    <svg aria-hidden="true"><!-- bold icon --></svg>
  </button>
</div>
```

### P7.2 — WCAG 2.1 Level Requirements

**Level A (Minimum):**

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.1.1 | Non-text Content — text alternative provided | alt on images, labels on inputs |
| 1.2.1 | Audio-only and Video-only — alternative provided | captions for video, transcript for audio |
| 1.3.1 | Info and Relationships — structure conveyed | semantic HTML, ARIA for custom |
| 1.3.2 | Meaningful Sequence — reading order correct | DOM order = visual order |
| 1.4.1 | Use of Color — not only visual means | + text labels/icons, not just color |
| 2.1.1 | Keyboard — all functionality by keyboard | tabindex, keyboard handlers |
| 2.1.2 | No Keyboard Trap — can escape focus | Tab, Escape work |
| 2.4.1 | Bypass Blocks — skip navigation | skip links, landmarks |
| 2.4.2 | Page Titled — descriptive title | <title> with page name |
| 3.1.1 | Language of Page — language declared | <html lang="en"> |
| 3.3.1 | Error Identified — input errors described | aria-describedby with error text |
| 4.1.1 | Parsing — no duplicate IDs | validate HTML |
| 4.1.2 | Name, Role, Value — programmatic determinable | semantic elements, ARIA |

**Level AA (Standard):**

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.4.3 | Contrast (Minimum) — 4.5:1 for normal text | use accessible color combinations |
| 1.4.4 | Resize Text — no loss at 200% zoom | fluid layouts, no horizontal scroll |
| 1.4.5 | Images of Text — text not images of text | use text, not text-in-images |
| 1.4.10 | Reflow — no horizontal scroll at 320px | responsive, no horizontal scroll |
| 1.4.11 | Non-text Contrast — 3:1 for UI components | focus rings, borders, icons |
| 1.4.12 | Text Spacing — no loss with custom spacing | test with extended line-height/letterspacing |
| 1.4.13 | Content on Hover or Focus — hover/focus visible | tooltip doesn't disappear on hover |
| 2.4.6 | Headings and Labels — descriptive headings | h2-h6 that describe content |
| 2.4.7 | Focus Visible — focus indicator visible | visible focus ring in all themes |
| 3.1.2 | Language of Parts — language changes tagged | <span lang="fr">French phrase</span> |
| 3.2.3 | Consistent Navigation — similar order | same nav structure |
| 3.2.4 | Consistent Identification — same labels for same | function |
| 3.3.3 | Error Suggestion — suggestion to fix | "Did you mean..." in autocomplete |
| 3.3.4 | Error Prevention (Legal, Financial, Data) — reversible | confirmation + undo for transactions, legal, or data |

### P7.3 — WCAG 2.2 New Requirements

| Criterion | Level | Description |
|-----------|-------|-------------|
| 2.4.11 | A | Focus Not Obscured (Minimum) — focus not fully hidden |
| 2.4.12 | A | Focus Not Obscured (Enhanced) — focus fully visible |
| 2.4.13 | AA | Focus Appearance — focus indicator size, contrast |
| 2.5.3 | A | Label in Name — accessible name contains visible label |
| 2.5.4 | A | Motion Actuation — motion-based activation can be disabled |
| 3.2.6 | AA | Consistent Help — help mechanisms appear consistently |
| 3.3.5 | AA | Help — context-sensitive help is available |
| 3.3.6 | AA | Error Prevention (All) — reversible, checked, confirmed for all user actions |

### P7.4 — Accessibility Audit Process

```
Automated (covers ~30-40%):
- axe DevTools browser extension
- WAVE browser extension
- Lighthouse accessibility audit
- axe-core in CI pipeline

Manual (covers remaining ~60-70%):
- Keyboard-only navigation (Tab, Shift+Tab, Enter, Space, Arrow keys, Escape)
- Screen reader testing (VoiceOver + Safari, NVDA + Firefox)
- Color contrast checker (minimum 4.5:1 for text, 3:1 for UI)
- Zoom to 200% — no horizontal scroll
- Touch target size — minimum 24x24px
- Reduced motion — respects prefers-reduced-motion
```

## P9 — CONVERSION OPTIMIZATION

### P9.1 — Funnel Analysis

**B2B SaaS Funnel:**

```
Visitor → Sign Up Started → Email Verified → First Project → Regular Usage → Power User → Paid

Conversion rates:
Visitor → Sign Up: 2-5%
Sign Up Started → Email Verified: 60-80%
Email Verified → First Project: 50-70%
First Project → Regular Usage: 30-50%
Regular Usage → Power User: 20-30%
Power User → Paid: 10-20%

Average end-to-end: ~0.1-0.5%
```

**Funnel Drop-Off Analysis:**

```
When conversion drops > 20% between a stage:

1. Isolate: which step has the drop-off?
2. Diagnose:
   - Exit survey: "What stopped you?"
   - Session recordings: what do users do before leaving?
   - Form analytics: where do users abandon forms?
3. Hypothesize: what's causing the drop?
4. Prioritize: impact × ease
5. Test: A/B test the fix
```

### P9.2 — Conversion Rate Optimization

**CRO Process:**

```
1. Quantify: Measure current conversion rate, establish baseline
2. Prioritize: Identify highest-impact pages using funnel analysis
3. Hypothesize: Why are users not converting?
4. Generate: List possible solutions (prioritized by ICE)
5. Test: Run A/B test or multi-arm bandit
6. Analyze: Statistical significance, qualitative data
7. Implement: Winner goes to 100% traffic
8. Iterate: Move to next highest-impact page
```

**ICE Prioritization:**

```
Score = Impact × Confidence × Ease

Impact: 1-3 (1=low, 2=medium, 3=high impact on conversion)
Confidence: 1-3 (1=low confidence fix works, 3=high confidence)
Ease: 1-3 (1=weeks, 2=days, 3=hours)

Sort by score descending. Do highest scores first.
```

### P9.3 — User Segmentation for Conversion

```
Behavioral segments:
- First-time visitors vs. returning
- By traffic source (organic, paid, referral)
- By engagement level (bounced, window shopper, engaged)
- By intent (comparison shopping vs. ready-to-buy)
- By account status (anonymous, trial, free, paid)

Conversion messaging:
- High intent: urgency, trust signals, clear CTA ("Start now")
- Research phase: educational content, social proof
- Power users: feature announcements, efficiency tips
- Churning users: win-back offers, feedback request
```

## P11 — COGNITIVE PSYCHOLOGY IN UX

### P11.1 — Gestalt Principles

**Proximity:**
Objects that are close together are perceived as a group.

```html
<!-- Form labels: place labels close to inputs -->
<label for="email">Email address</label>
<input id="email">
<!-- NOT: label far from input -->

<!-- Action buttons: group related actions -->
<div class="button-group">
  <button>Save Draft</button>
  <button primary>Publish</button>
</div>
```

**Similarity:**
Objects that share visual attributes (color, shape, size) are perceived as related.

```css
/* Navigation items with same style = same level */
.nav-item {
  background: white; /* same = same category */
}

/* Secondary actions styled differently */
.nav-item.secondary {
  background: gray;
}
```

**Closure:**
People perceive complete shapes even when parts are missing.

```css
/* Modal: don't draw every border — let user fill in the gap */
.modal {
  border-radius: 12px;
  border-top: none; /* users fill in the top mentally */
}
```

**Continuity:**
Eye follows continuous lines and curves.

```html
<!-- Use lines to guide attention -->
<hr style="border: none; border-top: 1px solid #ddd;"> <!-- guides through form -->
```

### P11.2 — Fitts's Law

**The law:** The time to reach a target is a function of the distance to the target and the size of the target.

**Formula:** T = a + b log₂(2D/W)
Where T = time, D = distance, W = width (size)

**Implications:**

```
1. Make important targets LARGE and CLOSE to cursor/finger
2. Put primary actions in corners (constant distance from any start position)
3. Edge of screen = infinite width (easy to hit)
4. Pop-up menus = close to trigger point

Large, close = fast. Small, far = slow.
```

**Touch target sizes:**

```
Minimum: 24x24px (Android accessibility guidelines)
Recommended: 44x44px (iOS HIG)
Best: 48x48px or larger for primary actions

Never: less than 16x16px
```

### P11.3 — Hick's Law

**The law:** The time it takes to make a decision increases with the number and complexity of choices.

**Formula:** T = b log₂(n + 1)
Where T = decision time, n = number of options

**Implications:**

```
1. Reduce options in menus and navigations
   - Maximum 7 items per menu (we can hold 7±2 items in working memory)
   - Group items into categories

2. Progressive disclosure
   - Show options as needed, not all at once
   - "Advanced options" collapsed by default

3. Default recommendations
   - Most common option highlighted
   - "Recommended" label on best choice
   - Smart defaults reduce decision load
```

### 11.4 — Cognitive Load Theory

**Three types of load:**

| Type | Description | In UX |
|------|-------------|-------|
| Intrinsic | Complexity of content itself | Simplify tasks, segment process |
| Extraneous | How information is presented | Avoid clutter, good hierarchy |
| Germane | Mental effort of building schema | Good onboarding, tutorials |

**Reducing Cognitive Load:**

```
1. Chunk related items together
2. Use progressive disclosure
3. Provide templates and defaults
4. Show examples and previews
5. Use familiar patterns (reduce learning)
6. Eliminate redundant information
7. Break complex tasks into steps
```

### 11.5 — Miller's Law

**The law:** The average person can hold 7±2 items in working memory.

**Implications:**

```
1. Chunk information into groups of 7 or fewer
   - Phone numbers: 3-4-4 (not 10 digits)
   - Credit cards: 4-4-4-4
   - Navigation: 5-7 items per level

2. Use visual chunking:
   - Numbered lists
   - Grouped dashboards
   - Step indicators in wizards

3. When >7 items: organize into hierarchy
   - 7 main categories, each with ≤7 sub-items
```

_End of UX Engineer SKILL.md_