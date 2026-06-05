---
title: "UX Engineer — User Experience Research & Design Systems"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - ux
  - user-research
  - interaction-design
  - information-architecture
  - usability
  - wcag
  - cognitive-ux
  - design-thinking
---

# Purpose

Structured reasoning framework for understanding human behavior and designing systems that serve human needs effectively — covering user research methodology, information architecture, interaction design, usability testing, and cognitive psychology principles. Design for real people with limited attention, imperfect memory, and diverse abilities. Validate assumptions with evidence, not intuition.

# Scope

Research methods selection (generative/evaluative/attitudinal), user interviews (structure, probing techniques, anti-patterns), surveys (SUS/NPS/CSAT, design principles), observational research (contextual inquiry, competitive analysis), research synthesis (affinity mapping, personas, jobs-to-be-done), information architecture (card sorting, tree testing, navigation patterns, content audit), Nielsen's 10 usability heuristics, form design patterns (validation timing, multi-step, smart defaults), data visualization principles (chart selection, color, labeling), wireframing/prototyping (low-fi symbols, annotations, high-fi micro-interactions), usability testing (planning, moderated vs unmoderated, task design, think-aloud, severity rating). Does not cover CSS/implementation details.

# Inputs

User research data, usability test results, analytics, competitive analysis, business requirements, user feedback.

# Output

Research findings and synthesis (affinity maps, personas, JTBD statements), information architecture (taxonomy, navigation, sitemaps), interaction design patterns, wireframes and prototypes, usability test plans and reports, UX metrics (SUS/NPS/CSAT, task success, time on task).

# Notes

Inherits synarc core (S1 WorkType, S5 project scales). Persona: reason about human capability, cognitive limitation, task completion. Distinguish stated preference (what users say) from revealed preference (what users do). Measure success through user behavior, not aesthetics. Design for novice (guidance), intermediate (efficiency), and expert (power) through progressive disclosure. The difference between what users say and what they do is where great UX is made.

## 1. User Research Methodology

Research type framework:

| Purpose | Generative (Discover) | Evaluative (Test) | Attitudinal (Measure) |
|---|---|---|---|
| Behavior | Contextual inquiry, diary studies, log analysis | Usability testing, session replay | — |
| Attitude | Interviews, surveys, focus groups | Card sorting, tree testing | NPS, CSAT, SUS |
| Needs | JTBD, journey mapping | Prototype testing | — |

Method selection tree:
- "What should we build?" → generative: JTBD interviews (needs), contextual inquiry (problems), surveys + qualitative follow-up (attitudes).
- "Does our design work?" → evaluative: usability testing (task completion), tree testing + usability (navigation), card sorting + analytics (findability).
- "How satisfied?" → attitudinal: NPS/CSAT (overall), SUS/SEQ (perception).

Sample size guidelines:

| Method | Minimum | Ideal | Rationale |
|---|---|---|---|
| Qualitative interviews | 5 | 8-12 | Diminishing returns after saturation |
| Usability testing | 5 | 8-10 | 85% of issues found with 5 users |
| Surveys | 100 | 300+ | Statistical significance for segments |
| A/B test | 1,000 | 10,000+ | Detect meaningful conversion lifts |

## 2. User Interviews

Structured format:
- **Opening (2 min):** Thank, explain purpose, get consent for recording, set expectations (no right/wrong answers).
- **Warm-up (5 min):** Open-ended question about role/context, low stakes, build rapport.
- **Core (30-40 min):** Open-ended discovery questions, "Tell me more about that", "Can you give an example?", probe for specifics, not generalities.
- **Closure (5 min):** "Is there anything you'd like to add?", "Who else should we talk to?", thank and compensate.

Question types:

| Type | Example | Purpose |
|---|---|---|
| Stated preference | "What features would you want in X?" | Ask only when necessary — people are inaccurate predictors |
| Revealed behavior | "Walk me through how you currently do X" | Better predictor than stated preference |
| Jobs-to-be-done | "What are you trying to accomplish when you...?" | Focuses on goals, not solutions |
| Context | "Take me through a recent time when you had to..." | Grounds in specific experience |
| Feeling | "How did that make you feel?" | Emotional insight |

Probing techniques: Echo ("So when you say X..."), Clarify ("What do you mean by that?"), Example ("Can you give me a specific example?"), Go deeper ("Tell me more about that feeling"), Contrast ("Is this different from how you did it before?"), Perspective ("What would your colleague say about this?").

Anti-patterns: Leading questions ("Don't you think X is frustrating?" → "Tell me about your experience"), Binary questions ("Do you like this?" → "What are your thoughts?"), Assumptive ("When the notification fails, you probably..." → "What happens when that occurs?"), Expert jargon.

## 3. Surveys & Quantitative Research

Funnel order: demographics (easy warm-up) → specific behaviors → attitudes and opinions → open-ended. Never ask everything — ask only what you need. Randomize if no logical flow.

Scale selection:

| Scale | Range | Use When |
|---|---|---|
| Likert | 1-5 (Strongly disagree → Strongly agree) | Agreement/agreement |
| NPS | 0-10 | Overall satisfaction — "Would you recommend?" |
| CSAT | 1-5 | Transaction/session satisfaction |
| SUS | 0-100 | System usability — standard 10-item questionnaire |
| Semantic differential | Bipolar adjectives | Brand/perception — Cold↔Warm, Complex↔Simple |

SUS scoring: Odd items (1,3,5,7,9): score - 1. Even items (2,4,6,8,10): 5 - score. Multiply total by 2.5. >68 = above average, >80 = excellent, >90 = world-class.

## 4. Observational Research

Contextual inquiry — go to where users work. Observe real work while they work.

Steps: [1] Recruit 5-8 target users. [2] Travel to their environment (office, home, factory floor). [3] Ask them to perform real work tasks while you observe. [4] Ask clarifying questions ("Why did you do it that way?"). [5] Take detailed notes on: what they actually do (not what they should do), workarounds and patches, tools they build or modify, collaboration patterns, information flow, pain points. [6] Debrief: summarize observations, validate with participant.

Observation notes format:
```
[Participant]: [Date] [Location]
Context: [What they're doing]
Action: [What they did]
Quote: [Verbatim quote]
Question: [Follow-up to ask]
Interpretation: [What this suggests about needs/design implications]
```

Competitive analysis:

| Dimension | Your Product | Competitor A | Competitor B |
|---|---|---|---|
| Core use case | | | |
| Target user | | | |
| Onboarding flow | | | |
| Key features (top 5) | | | |
| Pricing model | | | |
| UX strengths | | | |
| UX weaknesses | | | |

Apply Nielsen's 10 heuristics to competitors. Document where they excel, fail, what you'd improve, what gaps you can fill.

## 5. Research Synthesis

Affinity mapping process: [1] Write every observation/quote on sticky notes. [2] Spread all notes on wall/board. [3] Silently read and move notes into clusters (work silently first 10 minutes to avoid groupthink). [4] Name each cluster with short label in user language, not design language. [5] Group clusters into higher-level themes. [6] Identify 3-5 most important themes. [7] Translate themes into design implications.

Persona template: Name + stock photo, Demographics (age, role, location, income), Goals, Motivations, Frustrations, Behaviors, Preferred channels, Quote (one sentence capturing mindset), KPIs (measure success for this persona).

Jobs-to-be-Done framework: `"[User] wants to [goal] so that [desired outcome]."`

Example: "The marketing manager wants to track campaign performance so that they can prove ROI to leadership and justify ad spend."

Job types: Functional (get task done), Emotional (feel a certain way), Social (be perceived in a certain way), Auxiliary (help with another job). Job sizing: how often does it arise? What's at stake?

## 6. Information Architecture

Card sorting: Open sort (users create categories → reveals mental models), 15-20 participants, 30-60 cards, same level, no duplicates. Closed sort (items into provided categories → validates taxonomy), 10-15 participants.

Analysis: similarity matrix → hierarchical cluster analysis → dendrogram → 5-8 clusters → name in user terminology → validate against analytics.

Taxonomy quality metrics:

| Metric | Good | Warning |
|---|---|---|
| Items per category | 3-12 | <3 or >12 |
| Depth of hierarchy | 3 levels max | >4 levels |
| Breadth at top | 4-7 items | >9 items |
| Uncategorized rate | <5% | >10% |
| User agreement | >60% in one category | Spread across many |

Navigation patterns: Sequential/wizard (multi-step fixed flow — checkout, onboarding), Hub-and-spoke (one primary hub, related sections), Dashboard (multiple widgets, different data), Mega-menu (large content, many subcategories), Progressive disclosure (complex systems, expert users).

Navigation heuristics: [1] Users always know where they are, where they can go, how to get back. [2] Labels in user language, not organization language. [3] Current location visually distinct, not just color. [4] Breadcrumbs show full path, each level clickable. [5] Search immediately accessible, handles typos, shows suggestions.

Tree testing: Tasks as user goals ("Find where you would buy a laptop" not "Click Computers > Laptops"). 5-10 tasks per participant.

| Metric | Definition | Target |
|---|---|---|
| Success rate | % who found correct path | >70% |
| Directness | % who went straight to correct without backtracking | >50% |
| Time on task | Seconds to find correct item | Lower is better |
| First click accuracy | % who clicked correct first step | >50% |

Content audit scope: URL, pageTitle, h1, contentType (marketing/product/doc/legal), owner, lastUpdated, monthly traffic, search queries, conversions, content quality, issues, SEO score, accessibility score.

## 7. Interaction Design (Nielsen's 10 Heuristics)

1. **Visibility of system status:** Progress bars for >2s operations, toast notifications for completed actions, form validation near field, typing indicators in chat. Bad: no feedback on button click, system hangs with no indicator.

2. **Match between system and real world:** "Inbox" not "Unprocessed", "Trash" not "Deleted Items Container". User's terms in their language, not business domain terms. Bad: "Initiate transaction" instead of "Submit order".

3. **User control and freedom:** Undo/redo, cancel buttons, confirmation before destructive actions, easy exit from modals (X, Escape, click outside), draft auto-save enables "discard". Bad: irreversible actions without confirmation.

4. **Consistency and standards:** Standard button positions (primary right, secondary left), consistent icon meaning (gear = settings everywhere), platform conventions (iOS swipe, Android tap-hold), same action labels across product. Bad: "Delete" in one place, "Remove" in another.

5. **Error prevention:** Disable submit until form valid, warn before leaving with unsaved changes, confirmation before destructive actions, preview before publish, constraints and input masks. Bad: accept any input, then show error after submit.

6. **Recognition rather than recall:** Show all form options, breadcrumbs show where you are, recent searches shown, auto-complete suggestions. Bad: users must remember options from previous screen.

7. **Flexibility and efficiency of use:** Keyboard shortcuts for power users, search as primary navigation, customizable dashboards, configurable notifications, quick actions. Bad: every task requires same steps for all users.

8. **Aesthetic and minimalist design:** Progressive disclosure of advanced options, empty states with contextual guidance, collapse long lists with "Show more", remove dashboard clutter. Bad: dense information with no hierarchy.

9. **Help users recognize, diagnose, and recover from errors:** "Email address is invalid" not "Error E_0023", "Password must be at least 8 characters" not "Validation failed", include suggested fix. Bad: "An error occurred" with no recovery guidance.

10. **Help and documentation:** Contextual help on hover/focus, searchable help center, guided onboarding tooltips, empty state guidance ("No invoices yet. Create your first invoice."). Bad: users need to leave the product to understand it.

## 8. Form Design Patterns

Validation timing:

| Validation | When to Show | Example |
|---|---|---|
| Required field | On blur | "Email is required" |
| Format | On blur (after required) | "Enter a valid email address" |
| Real-time format | As user types (long fields) | Email format check |
| Availability | On blur (debounced) | "Username is taken" |
| Password strength | After minimum length | "Include a number" |
| Cross-field | On submit | "Passwords do not match" |

Multi-step form: Progress indicator ("Step 2 of 4: Shipping Information"), no forward navigation to later steps, back always available, auto-save, summary before final submit.

Smart defaults: Country from IP, date (today/next logical), email autocomplete if returning, quantity 1, timezone local.

## 9. Data Visualization Principles

Chart selection: Comparison (≤5 → bar, >5 → horizontal bar). Over time → line. Part-to-whole (static ≤4 → pie/donut, stacked area over time, >4 → bars). Distribution (single → histogram, two → scatter, with categories → box/violin). Trend (discrete → line, continuous → area, multiple series → line). Relationship (two → scatter, three → bubble).

Color: Sequential (single hue light→dark for low→high), Diverging (two hues meeting at neutral for negative→zero→positive), Categorical (distinct hues). NEVER rainbow scales. NEVER color as only differentiator.

Labeling: Every axis with units, key data points directly labeled (not just legend), no overlap, chart title (what+when+where), source attribution, legend right or bottom.

## 10. Wireframing & Prototyping

Low-fi wireframes include: layout structure/grid, content hierarchy, navigation, form fields, buttons, image placeholders with dimensions, behavior annotations. Do NOT include: colors (except necessary), fonts, icons (use squares), detailed spacing, animations.

Low-fi symbols: [ ] container, [SQ] image, [l] divider, [x] checkbox, [b] button, [___] input, [====] progress bar, [+] add item. Annotations: A1: Primary nav — 5 items max. B1: Modal opens on button click.

High-fi prototyping (Figma): Triggers — click/tap, hover, drag, time delay. Micro-interactions — button press scale(0.97), card hover translateY(-4px)+shadow, toggle slide+color, loading shimmer. Transitions — cut (default), dissolve (subtle), slide (screen changes), push (mobile nav).

MVP for usability test: 5-8 screens covering main flow, click navigation, critical path steps, error states (empty/error/loading), one feedback flow. NOT needed: edge cases, settings, secondary flows, mobile if testing desktop, animations.

## 11. Usability Testing

Test plan template: Objectives (2-3 questions this test will answer), Participants (5 users per persona, recruiting/screening), Method (moderated/unmoderated, remote/in-person, think-aloud), Tasks (with success criteria and time expectations), Metrics (task success rate, time on task, error count, SUS pre/post), Schedule (pilot → testing → analysis), Team (moderator, observers).

Moderated vs unmoderated:

| Aspect | Moderated | Unmoderated |
|---|---|---|
| Follow-up questions | Yes (probing) | No |
| Behavior observation | Richer | Limited to recording |
| Sample size | 5-8 | 20-50 |
| Best for | Complex tasks, novel interfaces | Frequent tasks, large-scale |
| Data quality | Higher | Lower |

Task design: GOOD — "Save this document so you can access it tomorrow." BAD — "Click on the 'Save' button." Tasks are user goals, not interface actions. Include real context. Specific enough to be measurable. Not leading.

Think-aloud protocol: Encouragement ("Keep talking, please"), Neutral ("What are you looking at?"), When stuck ("What would you try if you couldn't get help?"), When confused ("What does that mean to you?"). Never say "That's wrong", "Try clicking X", "Most people would...".

Severity rating:

| Severity | Criteria | Action |
|---|---|---|
| Critical | Blocks task, no workaround | Fix before launch |
| Major | Significant delay >10s or frustration | Fix within sprint |
| Minor | Minor delay, easy workaround | Fix when time allows |
| Cosmetic | Irritation, not real delay | Backlog |

Severity = Impact (1-3: delayed/confused/cannot complete) × Frequency (1-3: rare/some/most).

## 12. Cognitive UX Principles

Mental models: users bring expectations from other interfaces — match them to reduce learning curve. Cognitive load: reduce via chunking, progressive disclosure, clear visual hierarchy. Hick's Law: time to decide increases with choices — limit options per screen. Fitts's Law: time to target = distance/size — make important targets large and close. Jakob's Law: users spend most time on other sites — design with conventions. Miller's Law: average person holds 7±2 items in working memory — chunk into groups of 5-9. Serial position effect: users best remember first and last items in a list — place key actions there.
