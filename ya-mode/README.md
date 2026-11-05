# ya

A Claude Code plugin for verified, simple code: one routed workflow (`ya-mode`), its playbooks, leaf skills, and principles.

ya started as a fork of [pstack](https://github.com/cursor/plugins/tree/main/pstack)'s poteto-mode by Lauren Tan (poteto), through Michael Denyer's Claude Code port at `22b5e137` (0.9.112). It no longer tracks either; this tree is the source. The MIT license notices in `LICENSE*` and `NOTICE*` stay with the code they cover.

## Use

```sh
claude --plugin-dir /Users/alan.yeh/Workspace/my_projects/ya_mode/ya-mode
```

- `/ya:ya-mode` starts the workflow. There is no SessionStart hook; it runs when you type it or when the model invokes it.
- `/ya:setup-ya` writes `~/.claude/ya-models.md`, the per-role model sheet, and includes it from `~/.claude/CLAUDE.md`.
- `/ya:ya-help` answers questions about the skills.

## Layout

- `skills/ya-mode/` is the entry skill. `playbooks/` holds one file per task type, `references/` the shared references, `scripts/` the node tooling for resume, plan and playbook checks, and worktree audits.
- `skills/ya-mode/references/principles.md` holds the ten principles ya-mode reads at task start.
- The other `skills/*/` are leaf skills, including `python-best-practices`, `react-best-practices`, and `node-best-practices`, and the Chinese writing rules in `skills/unslop/references/zh.md`.
- `agents/` holds the subagent definitions: `ya:ya-agent` is the delegate and `ya:ya-reviewer` the independent reviewer.
- `tools/refgraph.mjs` maps skill references (`edges`, `closure <root>`) and checks for banned names and broken relative links (`check`).

## Check

```sh
sh tests/check.sh
```

Script tests, after `npm install` in the statechart scripts directory:

```sh
bun test tests/scripts
(cd skills/statechart/scripts && npm test)
```

`tests/scripts/` covers `resume.mjs`, `check-playbooks.mjs`, `check-plan`, `log.sh`, and `find-transcript.mjs`. The statechart TLC tests skip unless `TLA2TOOLS` points at `tla2tools.jar`. `worktree-audit.mjs` has no test here.
