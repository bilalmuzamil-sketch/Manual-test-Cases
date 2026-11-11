#!/bin/bash
# chain27.sh — 11 Nov 2026: after chain26 ends: s85 (the QA lead's four extra tests on the p66 data: C1078998, C1078999, C1079000, C1095432).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s85"; timeout 1500 node s85_four.mjs > s85.log 2>&1; log "end s85 rc=$?"; log "chain27 done"
