#!/bin/sh
# Rule 29/75 committer for the UI repair batch. Pure shell, gated on the RUN-FLAG FILE
# (never `pgrep -f <scriptname>` — that self-matches). Path-scoped adds only.
REPO=/home/user/Manual-test-Cases
D=build/report-suite/damage-2026-08-26
FLAG=/tmp/rsrepair/RUNNING
cd "$REPO" || exit 1
while :; do
  sleep 60
  git add -- "$D/REPAIRED.jsonl" "$D/FAILED.jsonl" "$D/BATCH-STATUS.txt" "$D/repair-run.log" 2>/dev/null
  if ! git diff --cached --quiet; then
    if python3 build/testing-tools/scan_secrets.py --staged >/tmp/rsrepair/scan.log 2>&1; then
      N=$(wc -l < "$D/REPAIRED.jsonl" 2>/dev/null | tr -d ' ')
      F=$(wc -l < "$D/FAILED.jsonl" 2>/dev/null | tr -d ' ')
      git commit -q -m "RS damage repair ${N}/70 via TestRail UI (failed/skipped: ${F:-0})" \
        -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" \
        -m "Claude-Session: https://claude.ai/code/session_01AZ5XzKsK9wv7M41cSPaMyg"
      git push -q origin HEAD 2>/dev/null || true
    else
      echo "SECRET SCAN FAILED - refusing to commit" >> /tmp/rsrepair/committer.log
      git reset -q
    fi
  fi
  [ -f "$FLAG" ] || break
done
# final sweep after the run flag is cleared
git add -- "$D/REPAIRED.jsonl" "$D/FAILED.jsonl" "$D/BATCH-STATUS.txt" "$D/repair-run.log" 2>/dev/null
if ! git diff --cached --quiet; then
  if python3 build/testing-tools/scan_secrets.py --staged >/tmp/rsrepair/scan.log 2>&1; then
    N=$(wc -l < "$D/REPAIRED.jsonl" 2>/dev/null | tr -d ' ')
    F=$(wc -l < "$D/FAILED.jsonl" 2>/dev/null | tr -d ' ')
    git commit -q -m "RS damage repair FINAL ${N}/70 via TestRail UI (failed/skipped: ${F:-0})" \
      -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" \
      -m "Claude-Session: https://claude.ai/code/session_01AZ5XzKsK9wv7M41cSPaMyg"
    git push -q origin HEAD 2>/dev/null || true
  else
    git reset -q
  fi
fi
echo "committer exit $(date -u +%FT%TZ)" >> /tmp/rsrepair/committer.log
