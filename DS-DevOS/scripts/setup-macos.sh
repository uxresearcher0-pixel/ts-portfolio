#!/usr/bin/env bash
set -euo pipefail

APPLY=false
[[ "${1:-}" == "--apply" ]] && APPLY=true

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This installer supports macOS only."
  exit 1
fi

run() {
  echo "+ $*"
  if [[ "$APPLY" == true ]]; then
    "$@"
  fi
}

echo "DS DevOS macOS bootstrap"
if [[ "$APPLY" == false ]]; then
  echo "PREVIEW MODE: no changes will be made."
  echo "Run again with --apply only after reviewing the commands."
fi
echo

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is not installed."
  echo "For security, DS DevOS does not automatically pipe a remote installer into your shell."
  echo "Review and install Homebrew from its official website, then rerun this script."
  exit 2
fi

run brew update
run brew install git gh jq ripgrep tree shellcheck fnm
run brew install --cask visual-studio-code docker claude-code

if ! command -v fnm >/dev/null 2>&1 && [[ "$APPLY" == false ]]; then
  echo "+ fnm install --lts"
  echo "+ fnm default lts-latest"
else
  run fnm install --lts
  run fnm default lts-latest
fi

if [[ "$APPLY" == true ]]; then
  eval "$(fnm env --use-on-cd)"
  corepack enable
  corepack prepare pnpm@latest --activate

  if ! command -v codex >/dev/null 2>&1; then
    npm install -g @openai/codex
  fi
else
  echo "+ corepack enable"
  echo "+ corepack prepare pnpm@latest --activate"
  echo "+ npm install -g @openai/codex"
fi

DEV_ROOT="$HOME/Development"
for dir in Active Archive Backups Templates Shared Scripts; do
  run mkdir -p "$DEV_ROOT/$dir"
done

echo
echo "Bootstrap stage complete."
echo "Manual authentication remains:"
echo "  gh auth login"
echo "  claude"
echo "  codex"
echo
echo "Docker Desktop must be opened once to finish its setup."
