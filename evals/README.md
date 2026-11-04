# evals

A fixed task set that measures whether a ya-mode change produces better and more stable code. Each task runs through `/ya:ya-mode` in a fresh copy of a small billing library. Hidden acceptance tests score the result after the run.

## Tasks

| Task | Kind | What a good run does |
|------|------|----------------------|
| `rounding-bug` | bug | Fixes the float truncation in the shared `toCents`, so both the CSV import and fixed discount codes keep every cent. A patch in the import path alone fails. |
| `billing-schedule` | feature | Adds `nextBillingDates` with month-end clamping, leap days, and argument validation. |
| `pricing-cleanup` | refactor | Simplifies `lineTotal` while 1,260 recorded line prices stay identical, including fractional service hours that the original never rounds. |
| `multi-currency` | feature | Carries JPY and KWD through every module. Its `overlay/` adds eight modules that assume two decimals in different forms: a regex, string slicing, a price cache keyed without the currency, comma grouping anchored on the dot, and a read-back that strips one comma. Each module has its own acceptance test, so a missed spot lowers the score instead of zeroing it. |

Each task directory holds `prompt.md` (what the user types), `kind`, `hidden/` (acceptance tests copied in only after the run), and `reference/` (a correct solution used by `check.sh`). An optional `overlay/` adds files on top of the fixture for that task alone, which keeps the other tasks' baselines valid. The candidate sees only the fixture, its overlay, and the prompt. Nothing in its directory or prompt names the measurement.

## Run

```sh
sh evals/check.sh                                   # acceptance tests separate fixture from reference
sh evals/run.sh <label> ya-mode [runs] [task...]    # default: 2 runs of every task
```

`MODEL` (default `opus`) and `BUDGET` (USD per run, default 20) override the defaults. Tasks run in parallel. A task's repeat runs go one after another.

Each run uses `--setting-sources project,local`, so the user's own plugins and hooks stay out and only the plugin under test loads. `~/.claude/CLAUDE.md` still loads, so the model sheet in `ya-models.md` applies. Permissions run in `auto` mode on top of the allowlist in `run.sh`. A `dontAsk` allowlist alone refused compound shell commands such as `cd x && npm test`, which left runs uncommitted, so a nonzero `denials` column marks a run the harness disturbed.

## Results

`results/<label>/summary.tsv` has one row per run: acceptance and project-suite pass counts, commits, whether the tree was left dirty, diff size, cost, minutes, turns, subagents spawned, and refused tool calls. `<task>-<n>.patch` is the full change and `<task>-<n>.json` the CLI result.

The score reads the checked-out branch. Work a run leaves on another branch or worktree counts as not delivered.

Stability is the spread between repeat runs of one task: the same acceptance result, and diff size and cost within a similar range.
