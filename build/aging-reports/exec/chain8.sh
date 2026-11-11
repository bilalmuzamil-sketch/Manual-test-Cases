#!/bin/bash
# chain8.sh — 11 Nov 2026 ~12:40 UTC: replaces chain7 (stopped while s2d3 ran; its node job keeps running). chain7 skipped two jobs inserted
# while it ran (bash reads ahead, L0647), so the rest of the queue is a fresh file that is never edited while it runs. Waits for every node job.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain8: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run p56b3 timeout 600 node p56b3_scroll_error.mjs > p56b3.log 2>&1
run s5i3 env ONLY=C715402 timeout 600 node s5_run.mjs > s5i3.log 2>&1
run p58 timeout 300 node p58_seed_old_hd_bill.mjs > p58.log 2>&1
run s5m env ONLY=C715609 timeout 600 node s5_run.mjs > s5m.log 2>&1
run p57 timeout 900 node p57_seed_scroll.mjs > p57.log 2>&1
run s5l env ONLY=C715407,C715408 timeout 900 node s5_run.mjs > s5l.log 2>&1
run s9c2 env ONLY=C715310,C715311 timeout 900 node s9c_ap.mjs > s9c2.log 2>&1
if ! grep -q "OK tech is administrator" p54.log 2>/dev/null; then run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1; fi
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "chain8 done"
