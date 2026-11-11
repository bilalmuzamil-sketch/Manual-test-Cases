#!/bin/bash
# chain10.sh — 11 Nov 2026 ~13:06 UTC: replaces chain9 (stopped while s9c2 ran) to re-run C715408 alone after the start-location fix. Never edited while it runs.
# while it ran (bash reads ahead, L0647), so the rest of the queue is a fresh file that is never edited while it runs. Waits for every node job.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain10: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5n env ONLY=C715408 timeout 900 node s5_run.mjs > s5n.log 2>&1
if ! grep -q "OK tech is administrator" p54.log 2>/dev/null; then run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1; fi
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "chain10 done"
