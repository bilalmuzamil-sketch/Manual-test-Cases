#!/bin/bash
# 22 Oct 2026 (Rule 75 / Rule 29): while the production run of run 498 writes pictures and logs, commit them every 10 minutes,
# path-scoped to evidence/prod-2026-10-22, only after the real secret scanner passes; stops when the full run's queue is done.
cd /home/user/Manual-test-Cases || exit 1
P=build/wo-board-tech-view/run498-2026-10-08/evidence/prod-2026-10-22
while true; do
  if [ -n "$(git status --porcelain -- "$P")" ]; then
    git add -- "$P" && python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1 && \
    git commit -q -m "WO Board production run: evidence autosave $(date -u +%H:%M)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FWbxRKg4riKCp3gpbbwYzA" && git push -q -u origin claude/test-execution-defects-cdrjsq 2>/dev/null
  fi
  grep -q '^QUEUE-DONE' /tmp/queue-prod-full.log 2>/dev/null && grep -q '^QUEUE-DONE' /tmp/queue-prod-redo.log 2>/dev/null && break
  sleep 600
done
