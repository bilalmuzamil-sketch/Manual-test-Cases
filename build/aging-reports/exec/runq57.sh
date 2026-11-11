#!/bin/bash
# runq57.sh — 11 Nov 2026 20:06 UTC (PRODUCTION lane): pr6 again (reload before each switch) into prod/pr6c.json.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "node (q3_prod|pr6_wolink)" >/dev/null; do sleep 10; done
log "start pr6c"; PR6OUT=pr6c.json timeout 900 node pr6_wolink.mjs > prod/pr6c.log 2>&1; log "end pr6c rc=$?"; log "runq57 done"
