#!/bin/bash
# runq55.sh — 11 Nov 2026 19:42 UTC (PRODUCTION lane): pr6 again (menu-name read + card-number click) into prod/pr6b.json, after runq51.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "runq51\.sh|node (q3_prod|pr6_wolink)" >/dev/null; do sleep 10; done
log "start pr6b"; PR6OUT=pr6b.json timeout 900 node pr6_wolink.mjs > prod/pr6b.log 2>&1; log "end pr6b rc=$?"; log "runq55 done"
