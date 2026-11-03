#!/bin/sh
# Skill references are intact and the optional Stop-hook gate behaves.
root=$(cd "$(dirname "$0")/.." && pwd)
fail=0
check() { if [ "$2" = ok ]; then echo "ok   $1"; else echo "FAIL $1"; fail=1; fi; }

node "$root/tools/refgraph.mjs" "$root/skills" check "$root/tools/banned.txt" >/dev/null && r=ok || r=bad
check "no banned references, no broken links" $r
! grep -rqE "codex-tools|pi-tools|copilot-tools|muse-tools|generate\.mjs|pstack-claude" "$root/skills" "$root/agents" --include='*.md' --exclude-dir=licenses && r=ok || r=bad
check "no runtime-map or generator references" $r

tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
mkdir "$tmp/repo" && cd "$tmp/repo" && git init -q && git config user.email t@t && git config user.name t
export CLAUDE_PROJECT_DIR=$tmp/repo
gate() { printf '%s' "$1" | sh "$root/hooks/gate.sh" >/dev/null 2>&1; echo $?; }

[ "$(gate '{}')" = 0 ] && r=ok || r=bad; check "gate: no .ya-gates -> allow" $r
printf 'false\n' > .ya-gates && git add .ya-gates && git commit -qm init
[ "$(gate '{}')" = 0 ] && r=ok || r=bad; check "gate: clean tree -> allow" $r
echo x > f
[ "$(gate '{}')" = 2 ] && r=ok || r=bad; check "gate: dirty tree + failing gate -> block" $r
[ "$(gate '{"stop_hook_active": true}')" = 0 ] && r=ok || r=bad; check "gate: stop_hook_active -> allow" $r
printf '# comment\n\ntrue\n' > .ya-gates
[ "$(gate '{}')" = 0 ] && r=ok || r=bad; check "gate: passing gate -> allow" $r

exit $fail
