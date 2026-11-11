#!/bin/bash
# queue14.sh — 11 Nov 2026 ~16:25 UTC: s92 (C1062573, C1062575 A/P Detail dates / types, seeds its own bills) and s93 (C715343 Locations line order) after queue13.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-3]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s92"; timeout 1800 node s92_apdates.mjs > s92.log 2>&1; log "end s92 rc=$?"; log "start s93"; timeout 900 node s93_locorder.mjs > s93.log 2>&1; log "end s93 rc=$?"; log "queue14 done"
