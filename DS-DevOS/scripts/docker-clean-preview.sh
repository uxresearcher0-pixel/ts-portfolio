#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed."
  exit 1
fi

echo "Docker disk usage:"
docker system df
echo
echo "No data was deleted."
echo "After reviewing, the conservative cleanup command is:"
echo "  docker image prune"
echo
echo "Avoid 'docker system prune --volumes' unless you fully understand which data volumes will be removed."
