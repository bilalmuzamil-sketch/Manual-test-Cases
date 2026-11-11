#!/bin/bash
# chain2.sh — 11 Nov 2026: jobs written after chain.sh started (bash reads a running script as it goes, so it is never edited in place).
# Waits for chain.sh to finish, then the same sign-in check before each job.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain2: sign-in expired, waiting"; n=$((n+1)); sleep 30; done; }
while pgrep -f "chain\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run r3 timeout 3000 node r3_reg.mjs > r3.log 2>&1
run r4 timeout 3000 node r4_planned.mjs > r4.log 2>&1
log "chain2 done"
