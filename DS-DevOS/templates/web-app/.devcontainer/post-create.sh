#!/usr/bin/env bash
set -euo pipefail

corepack enable

if [[ -f pnpm-lock.yaml ]]; then
  pnpm install --frozen-lockfile
elif [[ -f package-lock.json ]]; then
  npm ci
elif [[ -f yarn.lock ]]; then
  yarn install --immutable || yarn install
elif [[ -f package.json ]]; then
  pnpm install
fi

echo "Project container is ready."
echo "Authenticate AI tools manually only if installed:"
echo "  claude"
echo "  codex"
