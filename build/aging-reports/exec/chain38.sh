#!/bin/bash
# chain38.sh — 11 Nov 2026: after chain37 ends: s87 (no phone C715446; credit/deposit plain text C715423; not-enrolled location C715424).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-7].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s87"; timeout 1200 node s87_plain.mjs > s87.log 2>&1; log "end s87 rc=$?"; log "chain38 done"
