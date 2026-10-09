#!/usr/bin/env bash
# Publishes ./data/* to the orphan `data` branch as a single fresh commit (no history growth).
# Usage: scripts/publish-data.sh <dir-with-files>   (run inside a checkout with push rights)
set -euo pipefail
SRC="$(cd "$1" 2>/dev/null && pwd || true)"
if [ -z "$SRC" ] || [ -z "$(ls -A "$SRC" 2>/dev/null)" ]; then echo "Nothing to publish; keeping the last good snapshot."; exit 0; fi
REPO_DIR="$(pwd)"
PUB="$(mktemp -d)"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
if git ls-remote --exit-code --heads origin data >/dev/null 2>&1; then
  git fetch --depth=1 origin data
  git worktree add "$PUB" FETCH_HEAD --detach
else
  git worktree add --detach "$PUB"
  (cd "$PUB" && git rm -rf -q . 2>/dev/null || true; find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +)
fi
cd "$PUB"
cp -R "$SRC"/. .
touch .nojekyll
BR="snapshot-$$"
git checkout --orphan "$BR"
git add -A
git commit -q -m "Data snapshot $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push --force origin "$BR":data
cd "$REPO_DIR"
git worktree remove --force "$PUB"
