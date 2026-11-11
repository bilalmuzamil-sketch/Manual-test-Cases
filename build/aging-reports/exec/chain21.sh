#!/bin/bash
# chain21.sh — 11 Nov 2026: after chain20 ends: s82 (sort stays while changing date, scrolling and filters: C715316, C715318, C715319, C715321).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain20.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s82"; timeout 1800 node s82_sortstay.mjs > s82.log 2>&1; log "end s82 rc=$?"; log "chain21 done"
