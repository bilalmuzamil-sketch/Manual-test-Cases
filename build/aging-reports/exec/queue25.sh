#!/bin/bash
# queue25.sh — 11 Nov 2026 ~16:50 UTC: d3a2 = d3a for C715529 (at 900 px, as the case says) and C715533 (Total header via sortlib) after queue24.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-4]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3a2"; ONLY=C715529,C715533 timeout 1200 node d3a_design.mjs > d3a2.log 2>&1; log "end d3a2 rc=$?"; log "queue25 done"
