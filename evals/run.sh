#!/bin/sh
# Usage: sh evals/run.sh <label> <plugin-dir> [runs] [task...]
# Runs each task <runs> times through `/ya:ya-mode` in a fresh copy of the fixture and scores it into results/<label>/.
. "$(dirname "$0")/lib.sh"
label=${1:?label}; plugin=$(cd "${2:?plugin dir}" && pwd); runs=${3:-2}
if [ $# -ge 3 ]; then shift 3; else shift $#; fi
tasks=${*:-$(cd "$evals/tasks" && ls)}
model=${MODEL:-opus}; budget=${BUDGET:-20}
claude auth status 2>/dev/null | jq -e .loggedIn >/dev/null || { echo "claude CLI is not logged in; run: claude auth login" >&2; exit 1; }
out="$evals/results/$label"; mkdir -p "$out"
summary="$out/summary.tsv"
[ -f "$summary" ] || printf 'task\tkind\trun\taccept_pass\taccept_fail\tsuite_pass\tsuite_fail\tcommits\tleft_dirty\tfiles\tinsertions\tdeletions\tcost_usd\tminutes\tturns\tsubagents\tdenials\terror\n' > "$summary"
tail='全自動跑完，不用問我。這個 repo 沒有 remote，做完在本地 commit 就好，不用開 PR。'
# Pre-approved tools; auto mode's classifier decides the rest. A nonzero denials column means the harness, not the plugin, blocked work.
allowed='Read Edit Write Glob Grep Skill Agent TaskCreate TaskUpdate TaskList TaskGet TodoWrite Bash(node:*) Bash(npm:*) Bash(git:*) Bash(ls:*) Bash(cat:*) Bash(head:*) Bash(tail:*) Bash(grep:*) Bash(rg:*) Bash(find:*) Bash(wc:*) Bash(diff:*) Bash(mkdir:*)'

run_one() {
  task=$1 i=$2 kind=$(cat "$evals/tasks/$1/kind")
  dir=$(mktemp -d)/billing-kit; make_project "$dir" "$task" || return 1
  log="$out/$task-$i"
  prompt="/ya:ya-mode $(cat "$evals/tasks/$task/prompt.md")

$tail"
  (cd "$dir" && claude -p "$prompt" --plugin-dir "$plugin" --setting-sources project,local \
    --permission-mode auto --allowed-tools $allowed --model "$model" --max-budget-usd "$budget" \
    --output-format json > "$log.json" 2> "$log.err")

  commits=$(git -C "$dir" rev-list --count initial..HEAD)
  [ -n "$(git -C "$dir" status --porcelain)" ] && dirty=yes || dirty=no
  git -C "$dir" add -A && git -C "$dir" diff --cached initial > "$log.patch"
  set -- $(git -C "$dir" diff --cached --numstat initial | awk '{f++; a+=$1; d+=$2} END {print f+0, a+0, d+0}')
  files=$1 ins=$2 del=$3
  set -- $(run_tests "$dir"); suite_pass=$1 suite_fail=$2
  set -- $(run_tests "$dir" $(add_hidden "$task" "$dir")); acc_pass=$1 acc_fail=$2
  meta=$(jq -r '[.total_cost_usd, (.duration_ms / 60000 | . * 10 | round / 10), .num_turns, .subagent_stats.spawned, (.permission_denials | length), .is_error] | @tsv' "$log.json" 2>/dev/null || printf 'NA\tNA\tNA\tNA\tNA\ttrue')
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$task" "$kind" "$i" "$acc_pass" "$acc_fail" \
    "$suite_pass" "$suite_fail" "$commits" "$dirty" "$files" "$ins" "$del" "$meta" >> "$summary"
  echo "done $task #$i: accept $acc_pass/$((acc_pass + acc_fail)), $meta"
}

# Tasks run in parallel; a task's repeat runs go one after another.
for task in $tasks; do
  ( i=1; while [ "$i" -le "$runs" ]; do run_one "$task" "$i"; i=$((i + 1)); done ) &
done
wait
echo "results: $summary"
