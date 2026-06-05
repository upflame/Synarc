# Hypothesis Template

Copy this block for every debugging session. Save the filled version to `brain/errors/<slug>.md` or to your working notes.

```markdown
# Hypothesis: <one-line summary>

## Candidates (ranked by likelihood)

### H1: <candidate 1>
- Mechanism: <how this candidate produces the symptom>
- Evidence for: <data points that support>
- Evidence against: <data points that contradict>
- Test: <one experiment that proves or eliminates>
- Likelihood: HIGH | MEDIUM | LOW

### H2: <candidate 2>
- Mechanism: <how this candidate produces the symptom>
- Evidence for: <data points that support>
- Evidence against: <data points that contradict>
- Test: <one experiment that proves or eliminates>
- Likelihood: HIGH | MEDIUM | LOW

### H3: <candidate 3>
- Mechanism: <how this candidate produces the symptom>
- Evidence for: <data points that support>
- Evidence against: <data points that contradict>
- Test: <one experiment that proves or eliminates>
- Likelihood: HIGH | MEDIUM | LOW

## Working hypothesis

H<N> until proven otherwise. Last updated: <date>.

## Verification log

- <date>: ran <test>. Result: <observation>. Decision: H<n> still leading / eliminated.
- <date>: ran <test>. Result: <observation>. Decision: ...

## Root cause statement

Root cause: <file:line> — <one-line cause>.
Evidence: <one-line proof>.

## Open questions

- <what I do not yet know>
- <what could still prove me wrong>
```

## How to fill it

**Candidates.** Always at least 3. If you have only 1, you have not thought hard enough. The first candidate is usually the most recent change; the second is usually the most recent failure pattern; the third is the "what would a senior engineer suspect" candidate.

**Mechanism.** Not "this is broken" — how the candidate produces the symptom. If you cannot state the mechanism, you do not understand the candidate.

**Evidence for.** Concrete data: log lines, commit SHAs, timing, configuration values, user reports. Not "this looks suspicious."

**Evidence against.** Also concrete. If you have none, the candidate is unfalsifiable — drop it.

**Test.** One experiment. Run the experiment, get a result, update the ranking. The test must be cheap (≤ 5 minutes) and definitive (yes/no, not "maybe").

**Likelihood.** Be honest. The most likely candidate is often wrong; the field is full of agents who committed to the obvious answer and shipped a fix that did not fix anything.

## When to stop

Stop hypothesizing when:

- One candidate has a passing test that the others do not.
- All candidates are eliminated, and you have a new candidate list.
- You have spent more time hypothesizing than the cost of just reading all the relevant code.

The third case is the most common. If the search space is small, reading is faster than experimenting.
