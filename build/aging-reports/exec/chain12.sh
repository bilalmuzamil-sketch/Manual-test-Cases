#!/bin/bash
# chain12.sh — 11 Nov 2026 ~13:38 UTC: s78 re-run (s78b) after the on-screen location switch fix (locsw.mjs; the first s78 ran at Lethbridge),
# every test except C715409/C715410 (recorded), then the design re-run d1b. Never edited while it runs.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain12: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run s78b env ONLY=C715414,C715416,C715418,C715419,C715422,C715433,C715434,C715435,C715436,C715437,C715438,C715439,C715440,C715441,C715442,C715443,C715444,C715445,C715447,C715449,C715477,C715479,C715611,C797944 timeout 5400 node s78_run.mjs > s78b.log 2>&1
run d1b timeout 2400 node d1_design.mjs > d1b.log 2>&1
log "chain12 done"
