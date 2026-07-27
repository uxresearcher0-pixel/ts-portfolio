#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-}"
if [[ -z "$NAME" ]]; then
  echo "Usage: $0 <project-name>"
  exit 1
fi

if [[ ! "$NAME" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]; then
  echo "Use letters, numbers, dots, underscores, or hyphens only."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET="$HOME/Development/Active/$NAME"

if [[ -e "$TARGET" ]]; then
  echo "Target already exists: $TARGET"
  exit 1
fi

mkdir -p "$(dirname "$TARGET")"
cp -R "$ROOT_DIR/templates/web-app" "$TARGET"

find "$TARGET" -type f -name "*.template" | while read -r file; do
  destination="${file%.template}"
  sed "s/__PROJECT_NAME__/$NAME/g" "$file" > "$destination"
  rm "$file"
done

cd "$TARGET"
git init
git switch -c main
git add .
git commit -m "chore: initialize project from DS DevOS template"

echo "Created: $TARGET"
echo "Next:"
echo "  cd \"$TARGET\""
echo "  code ."
