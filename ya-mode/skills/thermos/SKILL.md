---
name: thermos
description: "Run both thermo-nuclear reviews as parallel subagents, then synthesize their findings. Use for thermos, double thermo review, or combined bug/security and code-quality branch audits."
---

# Thermos

Run the two thermo review passes as async background subagents in parallel, then synthesize their results.

## Workflow

1. Determine the review scope from the user request, PR, current branch, or relevant changed files.
2. Gather the diff and any file/context excerpts needed for reviewers to evaluate the change without guessing.
3. Launch two `general-purpose` subagents in the same message with `run_in_background: true`. Tell each to load its rubric skill and follow it, audit only the changed code, finish its own audit before reading any PR discussion, give file:line evidence, and spawn no subagents:
   - The **thermo-nuclear-review** skill for bugs, breakages, security, devex regressions, feature-flag leaks, and other branch-audit risks.
   - The **thermo-nuclear-code-quality-review** skill for maintainability, structure, file-size growth, spaghetti, abstractions, and codebase-health risks.
4. Pass each subagent the same scoped diff/file context and ask it to return prioritized findings with file references and evidence.
5. After both finish, synthesize the results with findings first, deduplicated across reviewers. Weight overlapping findings more heavily, resolve disagreements with your own judgment, and keep summaries brief.

If individual background summaries are already visible to the user, do not restate them wholesale. Surface the unified verdict, the highest-signal findings, and any remaining uncertainty.
