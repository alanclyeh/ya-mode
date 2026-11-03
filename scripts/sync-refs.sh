#!/usr/bin/env bash
# Clone the upstream repos ya-mode was derived from into refs/, or fast-forward them if already there.
set -euo pipefail

refs="$(cd "$(dirname "$0")/.." && pwd)/refs"
mkdir -p "$refs"

while read -r name url; do
  if [ -d "$refs/$name/.git" ]; then
    echo "pull  $name"; git -C "$refs/$name" pull --ff-only
  else
    echo "clone $name"; git clone "$url" "$refs/$name"
  fi
done <<'EOF'
pstack-claude  https://github.com/michael-denyer/pstack-claude.git
ub-mode        https://github.com/unclebob/ub-mode.git
cursor-plugins https://github.com/cursor/plugins.git
EOF
