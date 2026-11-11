#!/bin/bash
# queue6.sh — 11 Nov 2026 ~15:55 UTC: s91 group paging re-run (C1062570, C1062571) after queue5.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[2345].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s91"; timeout 1800 node s91_grouppaging.mjs > s91.log 2>&1; log "end s91 rc=$?"; log "queue6 done"
