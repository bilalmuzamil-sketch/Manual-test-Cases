#!/bin/bash
# runq60.sh — 12 Nov 2026 00:57 UTC: Rule 62(c) — re-verify the four held candidates on the NEW build (v26.45.3-34788b2) before any ask:
# draft 04 (C1062582 p56c, C1062583 p56b3) · draft 05 (C715442/443 p62, C715633-638 p62b) · draft 06 (C715555 d3j) · draft 07 (C715475 q9).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
for f in rv_q9_ivmsg rv_d3j_fix rv_p56c_bucket_first_load rv_p56b3_scroll_error rv_p62_report_error rv_p62b_six; do log "start $f"; timeout 2400 node $f.mjs > $f.log 2>&1; log "end $f rc=$?"; done; log "runq60 done"
