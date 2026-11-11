#!/bin/bash
# chain41.sh — 11 Nov 2026: after chain40 ends: d2b (chip states d2 missed: C715511 step 3, C715513/C715514 steps 3-4).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain40.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d2b"; timeout 900 node d2b_chips.mjs > d2b.log 2>&1; log "end d2b rc=$?"; log "chain41 done"
