#!/bin/bash
# chain13.sh — 11 Nov 2026 ~13:35 UTC: after chain12 (s78b, d1b) ends: s80 (C715418 / C797944 as the cases set them up). Never edited while it runs.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain13: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "chain12.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run s80 timeout 900 node s80_cancel_scroll.mjs > s80.log 2>&1
log "chain13 done"
