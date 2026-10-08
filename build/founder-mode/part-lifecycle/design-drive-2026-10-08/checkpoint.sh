#!/bin/bash
cd /home/user/Manual-test-Cases
O=build/founder-mode/part-lifecycle/design-drive-2026-10-08
while true; do
  sleep 300
  git add -- $O >/dev/null 2>&1
  if ! git diff --cached --quiet; then
    python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1 && git commit -qm "Part Lifecycle canvas drive checkpoint: $(wc -l < $O/canvas/canvas-drive.jsonl) actions logged

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q origin claude/slack-session-setup-7v5itm
  fi
  grep -q CANVAS-EXIT $O/canvas.log 2>/dev/null && { sleep 5; git add -- $O; git diff --cached --quiet || { git commit -qm "Part Lifecycle canvas drive finished

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU"; git push -q origin claude/slack-session-setup-7v5itm; }; exit 0; }
done
