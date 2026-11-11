#!/bin/bash
# runq45.sh — 11 Nov 2026 ~21:45 UTC: d3k (C715544 wrap picture) after d3j (runq44), before pm1b (runq40).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq4[1234]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3k"; timeout 600 node d3k_wrappic.mjs > d3k.log 2>&1; log "end d3k rc=$?"; log "runq45 done"
