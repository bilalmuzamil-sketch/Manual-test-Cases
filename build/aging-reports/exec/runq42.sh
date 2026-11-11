#!/bin/bash
# runq42.sh — 11 Nov 2026 ~20:40 UTC: d3h (C715549 only B ticked; C715557 picture) after d3g (runq41), before pm1b (runq40).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq41\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3h"; timeout 600 node d3h_oneloc.mjs > d3h.log 2>&1; log "end d3h rc=$?"; log "runq42 done"
