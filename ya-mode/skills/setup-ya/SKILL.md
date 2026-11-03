---
name: setup-ya
description: Configure which models ya uses per role. Detects available models and writes the override sheet. Use for /setup-ya, "configure ya models", or changing ya's model choices.
---

# Setup ya

Write the per-role model override sheet. Each ya skill names a default model inline; the override sheet adapts those defaults to the models you actually have access to.

The Claude Code config directory is `$CLAUDE_CONFIG_DIR` when that variable is set and `~/.claude` otherwise. This skill calls it `<config>`. The sheet lives at `<config>/ya-models.md`. Inclusion is explicit: the user adds a line to `<config>/CLAUDE.md` (or their project `CLAUDE.md`) such as:

```text
@<config>/ya-models.md
```

with `<config>` written as the resolved path, so the file is loaded as context for every session.

## Steps

### 1. Detect available models

Enumerate the model names the `Agent` tool's `model` parameter accepts in this session. That is the dependable source. They are the family names listed in [Models](#models) below, each running that family's current model, and a full model ID is rejected. Ask the user to confirm or paste any additional slugs they want available. Never write a real slug you have not confirmed is available. The aliases `inherit-parent` and `auto` are always valid even though they are not detected slugs. Both mean the role runs on the parent session's model, which the `Agent` call expresses by omitting `model`.

### 2. Load current state

The default role-to-model mapping is the shape shown in the Write the override sheet step below. If the sheet already exists, read it and treat its values as the current choices. Otherwise start from those defaults. A line whose role is not in that shape, such as `how critics`, is from a retired role. Drop it. An older sheet may name full model IDs that start with `claude-`, which the `Agent` tool rejects. Replace each with its family name, the word after `claude-`.

### 3. Map and confirm

Show every role with its current model, marking any real slug not in the detected set as needing a choice. Also list each line step 2 dropped or rewrote. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` as the options. Prefer `AskUserQuestion` over free text. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena runs one judge. It tries only values from a family other than the parent's, in list order, so order it by preference. An `inherit-parent` or `auto` value never judges. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm. `mechanical edits` takes renames, formatting, import moves, and fully specified one-line changes.

Then ask for the default reasoning effort, the `default effort` line. It is `session`, which keeps the parent session's effort, or one of the levels in [Models](#models). Every role value without a suffix runs at it. Then ask whether any role should run at another level. A role value may carry one after its slug, as in `<slug> @xhigh`; panel entries take their own, as in `<slug> @xhigh, <slug> @max`. Each level is passed as the dispatch's effort, so the choice holds without changing the session. Leave the suffix off for the default effort.

### 4. Validate

Every real slug written must be in the detected set. `inherit-parent` and `auto` always pass. Validate the slug without any `@<level>` suffix, and the level against the effort levels in [Models](#models). The `default effort` value is one of those levels or `session`. If a chosen real slug or level is not available, stop and ask again.

### 5. Write the override sheet

Write `<config>/ya-models.md` with the shape below. Overwrite the whole file so re-runs stay idempotent.

```markdown
# ya model configuration

Per-role model overrides for ya skills. Each ya SKILL.md names its defaults in a Models section; the values here override those defaults. Delete a line to fall back to the skill default. A value of `inherit-parent` or `auto` runs that role on the parent session's model (the `Agent` call omits `model`); an alias entry in a panel list still counts toward that panel's fan-out. A model may carry a reasoning effort, as in `opus @xhigh` (levels: low, medium, high, xhigh, max); the role's subagent then runs at that level, each entry of a panel list on its own. `default effort` sets the level for a value without one; `session` keeps the parent session's effort.

feature, refactoring: sonnet @high
bug-fix: sonnet @high
perf-issue: sonnet @high
hillclimb: sonnet @high
judgment and prose: opus @medium
strongest judgment: opus @medium
mechanical edits: haiku
how explorer: sonnet @high
how explainer: opus @medium
why investigators: sonnet @high
why synthesizer: opus @medium
reflect tooling: sonnet @high
reflect judgment, divergent, synthesizer: opus @medium
arena runners: opus @medium, sonnet @high
arena cross-judge pool: opus @medium, sonnet @high
swarm workers: sonnet @high
architect runners: opus @medium, sonnet @high
interrogate reviewers: opus @medium, sonnet @high

default effort: session
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
- Default panel: `opus`, `fable`, `sonnet`, `haiku`
- Reasoning effort levels: `low`, `medium`, `high`, `xhigh`, `max`
- Default reasoning effort: `session`
- Single-role default: `opus`
