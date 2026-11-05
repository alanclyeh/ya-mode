#!/bin/sh
# Skill references are intact.
root=$(cd "$(dirname "$0")/.." && pwd)
fail=0
check() { if [ "$2" = ok ]; then echo "ok   $1"; else echo "FAIL $1"; fail=1; fi; }

node "$root/tools/refgraph.mjs" "$root/skills" check "$root/tools/banned.txt" >/dev/null && r=ok || r=bad
check "no banned references, no broken links" $r
! grep -rqE "codex-tools|pi-tools|copilot-tools|muse-tools|generate\.mjs|pstack-claude|principle-[a-z]|inherit-parent|ya-models\.md. line" "$root/skills" "$root/agents" --include='*.md' --exclude-dir=licenses && r=ok || r=bad
check "no runtime-map or generator references" $r

exit $fail
