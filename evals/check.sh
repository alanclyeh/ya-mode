#!/bin/sh
# Proves each task's acceptance tests separate the untouched fixture from a correct reference.
. "$(dirname "$0")/lib.sh"
fail=0
check() { if [ "$2" = ok ]; then echo "ok   $1"; else echo "FAIL $1 ($3)"; fail=1; fi; }
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT

for task_dir in "$evals"/tasks/*/; do
  task=$(basename "$task_dir"); kind=$(cat "$task_dir/kind")

  make_project "$tmp/$task-fixture"
  set -- $(run_tests "$tmp/$task-fixture" $(add_hidden "$task" "$tmp/$task-fixture"))
  if [ "$kind" = refactor ]; then
    [ "$2" = 0 ] && [ "$1" -gt 0 ] && r=ok || r=bad; check "$task: acceptance passes on the fixture" $r "$1 pass, $2 fail"
  else
    [ "$2" != 0 ] && r=ok || r=bad; check "$task: acceptance fails on the fixture" $r "$1 pass, $2 fail"
  fi

  make_project "$tmp/$task-ref"
  cp -R "$task_dir/reference/." "$tmp/$task-ref/"
  set -- $(run_tests "$tmp/$task-ref")
  [ "$2" = 0 ] && r=ok || r=bad; check "$task: reference keeps the project suite green" $r "$2 fail"
  set -- $(run_tests "$tmp/$task-ref" $(add_hidden "$task" "$tmp/$task-ref"))
  [ "$2" = 0 ] && [ "$1" -gt 0 ] && r=ok || r=bad; check "$task: acceptance passes on the reference" $r "$1 pass, $2 fail"
done

make_project "$tmp/mutant"
sed -i.orig 's/0\.05/0.06/' "$tmp/mutant/src/pricing.js"
set -- $(run_tests "$tmp/mutant" $(add_hidden pricing-cleanup "$tmp/mutant"))
[ "$2" != 0 ] && r=ok || r=bad; check "pricing-cleanup: acceptance catches a changed rate" $r "$2 fail"

exit $fail
