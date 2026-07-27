#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$HOME/Development}"

echo "Storage report for: $ROOT"
echo
if [[ ! -d "$ROOT" ]]; then
  echo "Directory does not exist."
  exit 1
fi

du -sh "$ROOT"
echo
echo "Largest project directories:"
find "$ROOT" -mindepth 1 -maxdepth 2 -type d -print0 2>/dev/null \
  | xargs -0 du -sk 2>/dev/null \
  | sort -nr \
  | head -n 20 \
  | awk '{printf "%.2f GB\t", $1/1024/1024; $1=""; sub(/^ /,""); print}'

echo
echo "Common regenerable directories:"
find "$ROOT" -type d \( \
  -name node_modules -o \
  -name .next -o \
  -name dist -o \
  -name build -o \
  -name coverage -o \
  -name .cache -o \
  -name .turbo \
\) -prune -print 2>/dev/null | head -n 100

echo
echo "This command reports only. It deletes nothing."
