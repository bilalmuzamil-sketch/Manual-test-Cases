#!/bin/bash
# runq43.sh — 11 Nov 2026 ~21:20 UTC: d3i (C715544 vendor name wrapping) after d3h (runq42), before pm1b (runq40).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq4[12]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3i"; timeout 600 node d3i_wrap.mjs > d3i.log 2>&1; log "end d3i rc=$?"; log "runq43 done"
