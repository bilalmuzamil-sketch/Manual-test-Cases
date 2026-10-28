#!/bin/bash
# recall.sh — search EVERYTHING we have ever written down before saying "not found", "can't find" or "no way to".
# Usage: build/testing-tools/recall.sh <word or phrase> [more words...]   (case-insensitive, each word searched)
# Searches: the playbook, lessons index, CLAUDE.md + rule archives, every dated findings folder, process docs,
# test cases and testing-tool comments. Prints file:line hits, playbook/lessons FIRST, then findings, newest first.
cd "$(git rev-parse --show-toplevel 2>/dev/null || dirname "$0"/../..)" || exit 1
for q in "$@"; do
  echo "================ $q"
  echo "--- playbook / lessons / rules"
  grep -rIn -i -- "$q" build/APP-ACTIONS-PLAYBOOK.md build/LESSONS-INDEX.md CLAUDE.md build/rules build/*.md 2>/dev/null | cut -c1-240 | head -25
  echo "--- findings + project notes (newest folders first)"
  for d in $(ls -dt build/*/ 2>/dev/null); do grep -rIn -i --include=*.md -- "$q" "$d" 2>/dev/null; done | cut -c1-240 | head -40
  echo "--- tools + test cases"
  grep -rIn -i -- "$q" build/testing-tools test-cases 2>/dev/null | cut -c1-200 | head -10
done
