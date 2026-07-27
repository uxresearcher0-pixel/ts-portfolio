#!/usr/bin/env bash
set -u

command_version() {
  local label="$1"
  local command_name="$2"
  shift 2
  if command -v "$command_name" >/dev/null 2>&1; then
    local version
    version=$("$@" 2>/dev/null | head -n 1 || true)
    printf "✓ %-16s %s\n" "$label" "${version:-installed}"
  else
    printf "○ %-16s not installed\n" "$label"
  fi
}

echo "DS DevOS system check"
echo "No secret files are read."
echo

if [[ "$(uname -s)" == "Darwin" ]]; then
  printf "✓ %-16s %s\n" "macOS" "$(sw_vers -productVersion)"
  printf "✓ %-16s %s\n" "Architecture" "$(uname -m)"
else
  printf "! %-16s %s\n" "Operating system" "$(uname -s)"
fi

command_version "Homebrew" brew brew --version
command_version "Git" git git --version
command_version "GitHub CLI" gh gh --version
command_version "Docker" docker docker --version
command_version "VS Code" code code --version
command_version "Node" node node --version
command_version "pnpm" pnpm pnpm --version
command_version "Claude Code" claude claude --version
command_version "Codex" codex codex --version

echo
echo "Disk summary:"
df -h / | awk 'NR==1 || NR==2 {print}'
