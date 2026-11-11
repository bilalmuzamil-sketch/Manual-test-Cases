#!/bin/bash
# chain16.sh — 11 Nov 2026 ~14:00 UTC: after chain15 ends: p62 (C715442/C715443 report-load error instrument).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
while pgrep -f "chain1[2345].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
until ok; do sleep 30; done; log "start p62"; timeout 600 node p62_report_error.mjs > p62.log 2>&1; log "end p62 rc=$?"; log "chain16 done"
