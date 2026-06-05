# Scale Detection

5 scale categories. Detected once per session at DETECT time. The scale determines injection level, test strategy, and review depth.

## The 5 scales

| Scale | LOC | Modules | Team | Examples |
|-------|-----|---------|------|----------|
| TINY | < 1 000 | 1-3 | Solo | Single-file scripts, utilities, prototypes |
| SMALL | 1 000 - 10 000 | 3-10 | 1-3 | Side projects, MVPs, internal tools |
| MEDIUM | 10 000 - 100 000 | 10-30 | 3-10 | Production services, multi-module apps |
| LARGE | 100 000 - 1 000 000 | 30-100 | 10-50 | Multi-service platforms, monorepos |
| ENTERPRISE | > 1 000 000 | 100+ | 50+ | Multi-tenant SaaS, regulated industries |

LOC is the total across all source files. Modules are top-level directories with their own build/test target. Team is full-time engineers actively committing.

## Detection signals

Run these in order. The first one that returns a clear signal sets the scale. If signals conflict, take the higher scale.

1. **Git log contributors in the last 90 days.** Count unique authors. This is the most reliable team-size signal.
2. **Top-level directory count.** Count directories with their own `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, or equivalent. This is the module count.
3. **Total LOC.** `cloc .` or `find . -name "*.ts" -o -name "*.js" -o -name "*.py" | xargs wc -l` for a quick estimate. Precise count is not needed; the band is.
4. **CI configuration.** A single CI file = TINY/SMALL. Per-service CI = LARGE/ENTERPRISE. Matrix builds = LARGE+.
5. **Deploy targets.** One service = SMALL/MEDIUM. Container orchestration = LARGE+. Multi-region = ENTERPRISE.

## Scale-dependent behavior

| Scale | Injection level | Test strategy | Review depth |
|-------|-----------------|---------------|--------------|
| TINY | SILENT or COMPACT | Skip integration; unit only | Self-review |
| SMALL | COMPACT | Unit + 1 integration | Self-review |
| MEDIUM | STANDARD | Unit + integration + smoke | One peer review |
| LARGE | FULL | Full pyramid + contract tests | Two peer reviews |
| ENTERPRISE | FULL | Full pyramid + contract + e2e + chaos | Two peer reviews + security + SRE sign-off |

## Scale and WorkType interaction

- **TINY** projects should not see INCIDENT WorkType. If they do, the project is misclassified or the WorkType is wrong.
- **ENTERPRISE** projects should not see FEATURE without a feature flag. Auto-flag if missing.
- **MEDIUM** is the most common scale. Most patterns and idioms in this pack assume MEDIUM.
- **LARGE** projects benefit from monorepo tooling (Nx, Turborepo, Bazel). Suggest it during INFRA work.
- **ENTERPRISE** projects benefit from internal developer platforms (IDPs). Hand off to `platform-engineer` for IDP questions.

## Detection failure

If detection cannot complete (no git, no clear module structure, no CI), default to MEDIUM. MEDIUM is the conservative default that does not over-inject context or under-test.

If the project is a fresh init (no commits), default to TINY. There is no history to scale up from.

## Scale and context budget

| Scale | Max context block | Why |
|-------|-------------------|-----|
| TINY | 500 tokens | Project fits in your head |
| SMALL | 1 500 tokens | A few modules to track |
| MEDIUM | 6 000 tokens | Many modules, some history |
| LARGE | 15 000 tokens | Cross-module awareness needed |
| ENTERPRISE | 30 000 tokens | Cross-service and cross-team |

The budget is a soft cap. Exceeding it means the work is broader than the current context can support. Hand off or split the task.

## Gotchas

- A 1 000 000-LOC monorepo with 2 contributors is LARGE, not ENTERPRISE. Team size matters as much as LOC.
- A 5 000-LOC service with 50 engineers is MEDIUM, not LARGE. Many engineers on a small surface is still a small surface.
- If the project is a fork, count the upstream contributors too. The scale is the code's scale, not your team's scale.
- The detection result goes into the Synarc Context Block. It does not silently influence the work.
