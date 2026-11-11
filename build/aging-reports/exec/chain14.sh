#!/bin/bash
# chain14.sh — 11 Nov 2026 ~13:45 UTC: after chain13 (s80) ends: s81 (C715611 with vendor A ticked so the PDF is under the limit).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { until ok; do sleep 30; done; }
while pgrep -f "chain1[23].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
wait_ok; log "start s81"; timeout 600 node s81_desc_ap.mjs > s81.log 2>&1; log "end s81 rc=$?"; log "chain14 done"
