# Change Taxonomy (synarc-core)

The 12 WorkTypes. Each engineering action is classified into exactly one.

| # | WorkType | Default Risk | Example |
|---|----------|--------------|---------|
| 1 | ANALYSIS | INFO | "How does auth work?" |
| 2 | DOCS | LOW | Add JSDoc |
| 3 | REFACTOR | LOW-MEDIUM | Extract method |
| 4 | TEST | LOW | Add unit test |
| 5 | FIX | MEDIUM | Patch null-check |
| 6 | CONFIG | MEDIUM | Add CI step |
| 7 | INFRA | HIGH | `terraform apply` |
| 8 | FEATURE | MEDIUM-HIGH | New endpoint |
| 9 | CONTRACT | HIGH | Change endpoint signature |
| 10 | SECURITY | HIGH | Patch SQLi |
| 11 | PERF | MEDIUM | Add index |
| 12 | INCIDENT | CRITICAL | P0 outage |

## The classification line

```text
WorkType: <NAME> | Risk: <LEVEL>
```

If two WorkTypes fit, take the higher-risk one. Full taxonomy and risk floors in `change-taxonomy.md` in the synarc-core references set. (This file is a stub for cross-skill reference.)
