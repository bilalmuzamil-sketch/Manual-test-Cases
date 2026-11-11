#!/bin/bash
# chain.sh — 11 Nov 2026 10:50 UTC: every remaining aging-reports job in one ordered chain, after the Google sign-in (sv_sso_session) expired
# mid-run. Before EACH job it checks the sign-in with one curl (no browser sign-in, so nothing is spent) and waits while it answers 401.
# The fresh value goes in /tmp/qa-cookies/sv11315-sso.txt (chmod 600, never committed). Log: queue.log ("chain ...").
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run p49 env SFX=" R1" timeout 2400 node p49_seed_ap.mjs > p49.log 2>&1
run s2y timeout 2400 node s2_run.mjs s2y.json > s2y.log 2>&1
run s9c timeout 3000 node s9c_ap.mjs > s9c.log 2>&1
run s9b2 env ONLY=C1062580,C1062581,C1062587 timeout 900 node s9b_ar.mjs > s9b2.log 2>&1
run p48b timeout 400 node p48b_pdf2000_msg.mjs > p48b.log 2>&1
run p50 timeout 600 node p50_overpay.mjs > p50.log 2>&1
run r1 timeout 1500 node r1_reg.mjs > r1.log 2>&1
run p52 env SFX=" R1" timeout 2400 node p52_seed_reg.mjs > p52.log 2>&1
run r2 timeout 3000 node r2_reg.mjs > r2.log 2>&1
run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1
run s4f env ONLY=C1062582,C1062583 timeout 900 node s4_run.mjs > s4f.log 2>&1
run s5h env ONLY=C1062566 timeout 600 node s5_run.mjs > s5h.log 2>&1
run s5i env ONLY=C715402 timeout 600 node s5_run.mjs > s5i.log 2>&1
run s5j env ONLY=C715408 timeout 600 node s5_run.mjs > s5j.log 2>&1
run s5k env ONLY=C715392,C715607,C715609 timeout 1500 node s5_run.mjs > s5k.log 2>&1
run p44 timeout 600 node p44_pageedge.mjs > p44.log 2>&1
run s2d3 env ONLY=C715299,C715307,C715312,C715314,C715323,C715593 timeout 2400 node s2_run.mjs s2d.json > s2d3.log 2>&1
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "chain done"
