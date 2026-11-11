#!/bin/bash
# chain15.sh — 11 Nov 2026 ~13:50 UTC: after chain14 ends: p61 (read-only location list).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[234].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p61"; timeout 300 node p61_locations.mjs > p61.log 2>&1; log "end p61 rc=$?"; log "chain15 done"
