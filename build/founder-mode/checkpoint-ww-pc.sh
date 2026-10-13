#!/bin/bash
# Commit What/Why and Price/Category work every 4 minutes until build/founder-mode/STOP-CHECKPOINT-WW-PC exists.
cd /home/user/Manual-test-Cases
while [ ! -f build/founder-mode/STOP-CHECKPOINT-WW-PC ]; do
  sleep 240
  git add -- build/founder-mode/what-why build/founder-mode/price-category 2>/dev/null
  if ! git diff --cached --quiet; then
    if python3 build/testing-tools/scan_secrets.py --staged >/dev/null; then
      git commit -qm "What/Why and Price/Category update: background checkpoint

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q -u origin claude/slack-session-setup-7v5itm
    else git reset -q; fi
  fi
done
