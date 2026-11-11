#!/bin/bash
# queue18.sh — 11 Nov 2026 ~16:20 UTC: s86d (re-sort timeline for C715454/C715455 step 6) after queue17.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-7]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s86d"; timeout 1800 node s86d_resort.mjs > s86d.log 2>&1; log "end s86d rc=$?"; log "queue18 done"
