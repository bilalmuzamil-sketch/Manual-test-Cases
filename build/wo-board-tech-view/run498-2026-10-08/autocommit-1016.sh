#!/bin/bash
# 16 Oct 2026 — every 20 minutes while the full run is going: commit + push the run folder's evidence (path-scoped, secret scan first).
# Stops by itself when run-full-1016.sh is no longer running (after one final commit).
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"; P=build/wo-board-tech-view/run498-2026-10-08
while :; do
  alive=$(ps -eo args | grep -c "[r]un-full-1016.sh")
  git add -- "$P/" >/dev/null 2>&1
  if ! git diff --cached --quiet; then
    if python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1; then
      git commit -qm "Run 498 full staging run: evidence checkpoint $(date -u +%H:%M) UTC

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FWbxRKg4riKCp3gpbbwYzA" && git push -q origin claude/test-execution-defects-cdrjsq >/dev/null 2>&1
    else git reset -q -- "$P/"; echo "$(date -u +%T) secret scan refused a checkpoint" >> "$P/evidence/staging-full-2026-10-14/logs-full-1016/autocommit.out"; fi
  fi
  [ "$alive" -eq 0 ] && break; sleep 1200
done
