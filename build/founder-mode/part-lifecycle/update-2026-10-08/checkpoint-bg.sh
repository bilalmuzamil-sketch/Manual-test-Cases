#!/bin/bash
cd /home/user/Manual-test-Cases
U=build/founder-mode/part-lifecycle/update-2026-10-08
W=build/wo-board-tech-view/source-update-2026-10-08
while true; do
  sleep 300
  git add -- $U $W >/dev/null 2>&1
  git diff --cached --quiet || { python3 build/testing-tools/scan_secrets.py --staged >/dev/null 2>&1 && git commit -qm "Background checkpoint: Part Lifecycle run scan $(wc -l < $U/run-membership.jsonl) runs, WO Board shortcut audit

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q origin claude/slack-session-setup-7v5itm; }
  [ -f $U/applied/c154761-delete-result.json ] && [ -f $U/run-membership.DONE ] && { [ -f $W/design-crawl/AUDIT-DONE ] || [ -f $W/design-crawl/AUDIT-STOPPED ]; } && { git add -- $U $W; git diff --cached --quiet || { git commit -qm "Background jobs finished

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU"; git push -q origin claude/slack-session-setup-7v5itm; }; exit 0; }
done
