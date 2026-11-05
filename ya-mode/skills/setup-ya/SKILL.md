---
name: setup-ya
description: Configure which models ya uses per role. Detects available models and writes the override sheet. Use for /setup-ya, "configure ya models", or changing ya's model choices.
---

# Setup ya

Write the per-role model override sheet. [ya-mode's Models section](../ya-mode/SKILL.md#models) names the defaults; the sheet adapts them to the models you have access to.

The Claude Code config directory is `$CLAUDE_CONFIG_DIR` when that variable is set and `~/.claude` otherwise. This skill calls it `<config>`. The sheet lives at `<config>/ya-models.md`. Inclusion is explicit: the user adds a line to `<config>/CLAUDE.md` (or their project `CLAUDE.md`) such as:

```text
@<config>/ya-models.md
```

with `<config>` written as the resolved path, so the file is loaded as context for every session.

## Steps

### 1. Detect available models

Enumerate the model names the `Agent` tool's `model` parameter accepts in this session. That is the dependable source. They are the family names listed in [Models](#models) below, each running that family's current model, and a full model ID is rejected. Ask the user to confirm or paste any additional slugs they want available. Never write a slug you have not confirmed is available.

### 2. Load current state

The roles are the ones in the sheet shape under Write the override sheet. If the sheet already exists, read it and treat its values as the current choices. Otherwise start from those defaults. Drop a line whose role is not in that shape, such as `how explorer` or `default effort`, because that role is retired. Map an old `feature, refactoring` value to `implementer` and an old `how explorer` value to `explorer`. Replace a full model ID that starts with `claude-` with its family name, the word after `claude-`.

### 3. Map and confirm

Show every role with its current model, marking any slug not in the detected set as needing a choice. Also list each line step 2 dropped or rewrote. Ask whether to accept as-is or change specific roles, offering the detected models. Prefer `AskUserQuestion` over free text. List roles run one subagent per entry, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena runs one judge, trying entries from a family other than the parent's in list order. A value may carry an effort, as in `<slug> @xhigh`, and list entries take their own. Without one, the role runs at the session's effort.

### 4. Validate

Every slug written must be in the detected set, and every level in the effort levels in [Models](#models). If one is not available, stop and ask again.

### 5. Write the override sheet

Write `<config>/ya-models.md` with the shape below. Overwrite the whole file so re-runs stay idempotent.

```markdown
# ya model configuration

Per-role models for ya skills. ya-mode's Models section names the defaults; a line here overrides one. A value is a model, with an optional effort as in `opus @high` (low, medium, high, xhigh, max). Lists run one subagent per entry.

implementer: sonnet @high
reviewers: opus @medium, sonnet @high
explorer: sonnet @high
swarm workers: sonnet @high
arena runners: opus @medium, sonnet @high
arena cross-judge pool: opus @medium, sonnet @high
architect runners: opus @medium, sonnet @high
interrogate reviewers: opus @medium, sonnet @high
```

### 6. Wire it in

If `<config>/CLAUDE.md` does not already include `<config>/ya-models.md`, append an `@` line naming the sheet's resolved path, such as `@~/.claude/ya-models.md`, so the model rows load on every session. If the user prefers project scope, add the include to the project's `CLAUDE.md` instead.

### 7. Confirm

Tell the user where the override was written and how its model rows load. Re-running this skill updates the override sheet.

### 8. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a project `verify` or `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke [`/create-verification-skill`](../create-verification-skill/SKILL.md). On no, move on without pushing.

### 9. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md). On no, move on without pushing.

## Models

- Available Claude models: `opus`, `fable`, `sonnet`, `haiku`
- Reasoning effort levels: `low`, `medium`, `high`, `xhigh`, `max`
