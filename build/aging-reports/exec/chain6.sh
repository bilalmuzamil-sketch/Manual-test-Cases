#!/bin/bash
# chain6.sh — 11 Nov 2026: after chain5 ends, re-runs the two A/P Unpaid/Detail credit-sort tests (C715310, C715311) whose first run
# stopped on my own heading locator. First p55 (Sales By Customer / Inventory Value PDF date format, control for C1062581);
# then the re-run. Original note: their first run (the heading's text joins the sort icon's name with no space, so "Due Date\b" never matched).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { until ok; do sleep 30; done; }
while pgrep -f "chain5.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
wait_ok; log "start p55"; timeout 600 node p55_sbc_pdf.mjs > p55.log 2>&1; log "end p55 rc=$?"
wait_ok; log "start s9c2"; env ONLY=C715310,C715311 timeout 900 node s9c_ap.mjs > s9c2.log 2>&1; log "end s9c2 rc=$?"; log "chain6 done"
