#!/bin/bash
# chain7.sh — 11 Nov 2026 ~12:05 UTC: replaces chain5 (stopped while s9b2 ran; its node job kept running). Runs p55 (Sales By Customer PDF date control for C1062581) first, then the rest of chain5, then the C715310/C715311 re-run.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
ok() { local S; S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null); [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)" = "200" ]; }
wait_ok() { local n=0; until ok; do [ $((n % 20)) -eq 0 ] && log "chain7: sign-in expired, waiting for a fresh one"; n=$((n+1)); sleep 30; done; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done   # wait for EVERY running job (L0635 addendum)
run() { local name=$1; shift; wait_ok; log "start $name"; "$@"; log "end $name rc=$?"; }
run p55 timeout 600 node p55_sbc_pdf.mjs > p55.log 2>&1
run p55b timeout 600 node p55b_sbc_pdf.mjs > p55b.log 2>&1
run p48b timeout 400 node p48b_pdf2000_msg.mjs > p48b.log 2>&1
run p50 timeout 600 node p50_overpay.mjs > p50.log 2>&1
run s4f env ONLY=C1062582,C1062583 timeout 900 node s4_run.mjs > s4f.log 2>&1
run p50b timeout 600 node p50b_overpay_ui.mjs > p50b.log 2>&1
run p56 timeout 600 node p56_bucket_error.mjs > p56.log 2>&1
run p56b timeout 600 node p56b_scroll_error.mjs > p56b.log 2>&1
run p56c timeout 600 node p56c_bucket_first_load.mjs > p56c.log 2>&1
run p56b2 env P56B_OUT=./p56b2/ timeout 600 node p56b_scroll_error.mjs > p56b2.log 2>&1
run s5h env ONLY=C1062566 timeout 600 node s5_run.mjs > s5h.log 2>&1
run p56b3 timeout 600 node p56b3_scroll_error.mjs > p56b3.log 2>&1
run s5i env ONLY=C715402 timeout 600 node s5_run.mjs > s5i.log 2>&1
run s5j env ONLY=C715408 timeout 600 node s5_run.mjs > s5j.log 2>&1
run s5i2 env ONLY=C715402 timeout 600 node s5_run.mjs > s5i2.log 2>&1
run s5k env ONLY=C715392,C715607,C715609 timeout 1500 node s5_run.mjs > s5k.log 2>&1
run p56b3b timeout 600 node p56b3_scroll_error.mjs > p56b3.log 2>&1
run p44 timeout 600 node p44_pageedge.mjs > p44.log 2>&1
run s5i3 env ONLY=C715402 timeout 600 node s5_run.mjs > s5i2.log 2>&1
run s2d3 env ONLY=C715299,C715307,C715312,C715314,C715323,C715593 timeout 2400 node s2_run.mjs s2d.json > s2d3.log 2>&1
run p57 timeout 900 node p57_seed_scroll.mjs > p57.log 2>&1
run s5l env ONLY=C715407,C715408 timeout 900 node s5_run.mjs > s5l.log 2>&1
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
if ! grep -q "OK tech is administrator" p54.log 2>/dev/null; then run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1; fi
run s9c2 env ONLY=C715310,C715311 timeout 900 node s9c_ap.mjs > s9c2.log 2>&1
log "chain7 done"
