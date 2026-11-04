# ya-mode
ya-mode is my AI agent working mode, a simplified version of poteto-mode.
Work in progress...

## Evals

`evals/` holds a fixed bug, feature, and refactor task with hidden acceptance tests. Rerun it after a ya-mode change and compare against `evals/results/`. See [evals/README.md](evals/README.md).

## Upstream refs

`refs/` (gitignored) holds clones of the upstream repos ya-mode was derived from:
[pstack-claude](https://github.com/michael-denyer/pstack-claude),
[ub-mode](https://github.com/unclebob/ub-mode) and
[cursor/plugins](https://github.com/cursor/plugins).

Clone them, or fast-forward existing clones:

```bash
scripts/sync-refs.sh
```
