#!/bin/bash
# Commits the design drive/crawl output every 10 minutes until both jobs have finished (Rule 75).
cd /home/user/Manual-test-Cases
P=build/wo-board-tech-view/source-update-2026-10-08
busy() { ps -eo args | awk '$1=="python3" && ($2 ~ /crawl_design_states|drive_design_full/) {f=1} END {exit !f}'; }
commit() {
  git add -- $P build/testing-tools/crawl_design_states.py build/wo-board-tech-view/sources/design-2026-10-08-upload build/wo-board-tech-view/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md
  python3 build/testing-tools/scan_secrets.py --staged >/dev/null && git commit -qm "WO Board design drive and crawl checkpoint

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QvLHRX1rY5c7HuyoMWVGpU" && git push -q origin claude/slack-session-setup-7v5itm
}
sleep 60
while busy; do sleep 600; commit; done
commit; echo finished
