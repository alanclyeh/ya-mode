#!/bin/sh
# Stop hook. Runs the project's .ya-gates when the tree has changes, and blocks the stop (exit 2) on the first failure.
# shortcut: the second stop is always allowed (stop_hook_active), so a still-failing gate blocks once per turn, not forever.
input=$(cat)
case $input in *'"stop_hook_active": true'*|*'"stop_hook_active":true'*) exit 0 ;; esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f .ya-gates ] || exit 0
[ -n "$(git status --porcelain 2>/dev/null)" ] || exit 0

while IFS= read -r cmd; do
  case $cmd in ''|'#'*) continue ;; esac
  if ! out=$(sh -c "$cmd" 2>&1); then
    printf 'ya-mode gate failed: %s\n%s\n' "$cmd" "$(printf '%s\n' "$out" | tail -30)" >&2
    exit 2
  fi
done < .ya-gates
exit 0
