#!/usr/bin/env bash
# Usage: diff_against_baseline.sh <key> <fresh_body_file>
# Prints a unified diff of the fresh page body vs the stored baseline.
# Exit 0 = no change, 1 = changed. Does NOT modify the baseline.
set -euo pipefail
KEY="${1:?key required (fees-discounts|simple-flow)}"
FRESH="${2:?fresh body file required}"
HERE="$(cd "$(dirname "$0")" && pwd)"
BASE="$HERE/baselines/${KEY}.md"
if [[ ! -f "$BASE" ]]; then echo "No baseline for $KEY at $BASE" >&2; exit 2; fi
if diff -q "$BASE" "$FRESH" >/dev/null; then
  echo "NO CHANGE: $KEY"
  exit 0
else
  echo "CHANGED: $KEY"
  echo "----- unified diff (baseline -> fresh) -----"
  diff -u "$BASE" "$FRESH" || true
  exit 1
fi
