#!/bin/bash
# chain22.sh — 11 Nov 2026: after chain21 ends: s83 (chevron C715354/C715356, pinned row C715363, sideways C715600, location lists C715384/C715385).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[01].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s83"; timeout 1800 node s83_groups.mjs > s83.log 2>&1; log "end s83 rc=$?"; log "chain22 done"
