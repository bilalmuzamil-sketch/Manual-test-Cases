#!/bin/bash
# chain36.sh — 11 Nov 2026: after chain35 ends: s86 (paging 30s/100s and Totals against the CSV: C715450-55, C715612-15).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-5].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s86"; timeout 3600 node s86_paging.mjs > s86.log 2>&1; log "end s86 rc=$?"; log "chain36 done"
