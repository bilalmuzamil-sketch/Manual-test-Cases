#!/bin/bash
# queue20.sh — 11 Nov 2026 ~16:20 UTC: s90b = s90 again (groups opened with their own chevron) after queue19.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s90b"; timeout 1200 node s90_partsale.mjs > s90b.log 2>&1; log "end s90b rc=$?"; log "queue20 done"
