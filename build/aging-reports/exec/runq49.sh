#!/bin/bash
# runq49.sh — 11 Nov 2026 18:35 UTC: C715473 late-day PDF (s94) must run when UTC is already 12 Nov but Edmonton is still 11 Nov evening:
# waits for 00:06 UTC, then for any other runner on the shared Admin, then runs s94 with the browser clock in America/Edmonton.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
until [ "$(date -u +%Y%m%d%H%M)" -ge 202611120006 ]; do sleep 60; done
while pgrep -f "runq4[0-8]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s94"; TZ=America/Edmonton timeout 1200 node s94_lateday.mjs > s94.log 2>&1; log "end s94 rc=$?"; log "runq49 done"
