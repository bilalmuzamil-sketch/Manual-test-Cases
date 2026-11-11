#!/bin/bash
# chain26.sh — 11 Nov 2026: after chain25 ends: s84 (tests on the p68 data: empty states, date format, types, PDF/CSV types, location sort, own location).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-5].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s84"; timeout 2400 node s84_seeded.mjs > s84.log 2>&1; log "end s84 rc=$?"; log "chain26 done"
