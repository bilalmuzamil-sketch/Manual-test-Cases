#!/bin/bash
# chain9.sh — 11 Nov 2026 ~13:00 UTC: replaces chain8 (stopped while p58 ran; its node job keeps running) to put p59 (C715402 step 7 untick instrument) first. Never edited while it runs.
# while it ran (bash reads ahead, L0647), so the rest of the queue is a fresh file that is never edited while it runs. Waits for every node job.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain9: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run p59 timeout 300 node p59_untick.mjs > p59.log 2>&1
run p57 timeout 900 node p57_seed_scroll.mjs > p57.log 2>&1
run s5l env ONLY=C715407,C715408 timeout 900 node s5_run.mjs > s5l.log 2>&1
run s9c2 env ONLY=C715310,C715311 timeout 900 node s9c_ap.mjs > s9c2.log 2>&1
if ! grep -q "OK tech is administrator" p54.log 2>/dev/null; then run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1; fi
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "chain9 done"
