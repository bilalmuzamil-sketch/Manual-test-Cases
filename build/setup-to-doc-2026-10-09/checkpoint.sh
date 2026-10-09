#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/setup-to-doc-2026-10-09
while [ ! -f $D/STOP-CHECKPOINT ]; do
  sleep 240
  git add -- $D >/dev/null 2>&1
  git diff --cached --quiet || { python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1 && git commit -qm "Setup-to-doc: background checkpoint

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q origin claude/slack-session-setup-7v5itm; }
done
