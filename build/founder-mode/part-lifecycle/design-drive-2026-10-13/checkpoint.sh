#!/bin/bash
# Commit the design-drive and update folders every 4 minutes until STOP-CHECKPOINT exists in the update folder.
cd /home/user/Manual-test-Cases
P=build/founder-mode/part-lifecycle
while [ ! -f $P/update-2026-10-13/STOP-CHECKPOINT ]; do
  sleep 240
  git add -- $P/design-drive-2026-10-13 $P/update-2026-10-13 2>/dev/null
  if ! git diff --cached --quiet; then
    if python3 build/testing-tools/scan_secrets.py --staged >/dev/null; then
      git commit -qm "Part Lifecycle 13 Oct update: background checkpoint

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q -u origin claude/slack-session-setup-7v5itm
    else git reset -q; fi
  fi
done
