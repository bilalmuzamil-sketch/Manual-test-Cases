#!/bin/bash
# 17 Oct 2026 — copy of autocommit-1017.sh for the end-of-run sign-out batch (run-signout-1017.sh and its waiter): evidence only, every 20 min.
# commit + push the run's EVIDENCE folder only (path-scoped, secret scan first). Evidence only, so half-edited scripts
# of a helper are never swept in (L0415). Stops by itself after one final commit when no fix-up round is running.
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"; P=build/wo-board-tech-view/run498-2026-10-08/evidence
while :; do
  alive=$(ps -eo args | grep -cE "[r]un-signout-1017|[a]fter-signout-1017")
  git add -- "$P/" >/dev/null 2>&1
  if ! git diff --cached --quiet; then
    if python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1; then
      git commit -qm "Run 498 sign-out batch: evidence checkpoint $(date -u +%H:%M) UTC

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FWbxRKg4riKCp3gpbbwYzA" && git push -q origin claude/test-execution-defects-cdrjsq >/dev/null 2>&1
    else git reset -q -- "$P/"; echo "$(date -u +%T) secret scan refused a checkpoint" >> "$P/staging-full-2026-10-14/logs-signout-1017/autocommit.out"; fi
  fi
  [ "$alive" -eq 0 ] && break; sleep 1200
done
