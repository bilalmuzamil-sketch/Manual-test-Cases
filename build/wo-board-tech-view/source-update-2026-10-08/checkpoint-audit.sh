#!/bin/bash
cd /home/user/Manual-test-Cases
P=build/wo-board-tech-view/source-update-2026-10-08
while [ ! -f $P/design-crawl/AUDIT-DONE ]; do sleep 600
  git add -- $P build/testing-tools && python3 build/testing-tools/scan_secrets.py --staged >/dev/null && git commit -qm "WO Board shortcut audit checkpoint

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q origin claude/slack-session-setup-7v5itm
done
