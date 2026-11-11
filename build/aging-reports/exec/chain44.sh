#!/bin/bash
# chain44.sh — 11 Nov 2026: after chain43 ends: d1e (long name in the unfiltered A/R and A/P Summary lists, design step 5).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-3].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d1e"; timeout 900 node d1e_unfiltered.mjs > d1e.log 2>&1; log "end d1e rc=$?"; log "chain44 done"
