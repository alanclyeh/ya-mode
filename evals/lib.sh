# Shared by check.sh and run.sh. Source it; it sets $evals.
evals=$(cd "$(dirname "$0")" && pwd)

# make_project <dir> <task>: a fresh git repo holding the fixture plus the task's overlay, one commit tagged "initial".
make_project() {
  mkdir -p "$1" && cp -R "$evals/fixture/." "$1/" &&
    { [ ! -d "$evals/tasks/$2/overlay" ] || cp -R "$evals/tasks/$2/overlay/." "$1/"; } &&
    git -C "$1" init -q && git -C "$1" add -A &&
    git -C "$1" -c user.email=dev@billing-kit.local -c user.name=dev commit -qm "initial" &&
    git -C "$1" tag initial
}

# run_tests <dir> [files...]: prints "pass fail" from node's TAP summary; no files means the project's own suite.
run_tests() {
  dir=$1; shift
  out=$(cd "$dir" && node --test --test-reporter=tap "$@" 2>&1)
  pass=$(printf '%s\n' "$out" | sed -n 's/^# pass //p' | tail -1)
  fail=$(printf '%s\n' "$out" | sed -n 's/^# fail //p' | tail -1)
  echo "${pass:-0} ${fail:-0}"
}

# add_hidden <task> <dir>: copies the task's acceptance files into the project's test/ and prints their paths.
add_hidden() {
  cp "$evals/tasks/$1/hidden/"* "$2/test/"
  for f in "$evals/tasks/$1/hidden/"*.test.js; do echo "test/$(basename "$f")"; done
}
