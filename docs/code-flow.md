# ya-mode Code flow

Version: 0.1.0, matching the `ya` plugin version in `ya-mode/.claude-plugin/plugin.json`. Drawn from commit `d9f8424`.

Source: `ya-mode/skills/ya-mode/SKILL.md`, section "Code flow". Feature, Bug fix, Refactoring, and Perf issue run these steps.

Image files: [code-flow-v0.1.0.svg](code-flow-v0.1.0.svg), [code-flow-v0.1.0.png](code-flow-v0.1.0.png). Bump the version in the file names and here when the flow changes.

![ya-mode Code flow v0.1.0](code-flow-v0.1.0.svg)

The same flow as a Mermaid diagram:

```mermaid
flowchart LR
    Plan["Plan<br/>使用者先核准"] --> Implement["Implement<br/>可平行才派 ya-agent"]
    Implement --> Tests["Tests<br/>bug fix 先寫失敗測試"]
    Tests --> Gates["Gates<br/>test、typecheck、lint"]
    Gates --> Review["Review<br/>opus + sonnet 獨立審"]
    Review -- "改過 code,最多 3 輪" --> Gates
    Review --> PR["Opening a PR"]
    Review -- "第 3 輪仍有 blocking" --> Stop["停下,列給使用者"]
```

- **Plan**: read the code, post a plan, and wait for approval. A one-file change that touches no public interface needs no plan. 「全自動」 or "don't ask" skips the wait for the rest of the session.
- **Implement**: written in the main session. Spawn one `ya:ya-agent` per piece, each in its own worktree, only when the plan splits into pieces that touch disjoint files.
- **Review**: one `ya:ya-reviewer` per model on the `reviewers` line, started together with the same brief. Fix findings two or more reviewers raise. Decide solo findings with evidence. A round that changes code reruns Gates and starts fresh reviewers.
