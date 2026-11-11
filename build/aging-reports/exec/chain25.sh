#!/bin/bash
# chain25.sh — 11 Nov 2026: after chain24 ends: p68 seed (only-at-Lethbridge customer/vendor, date format, location sort, own-location, types).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-4].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p68"; timeout 1500 node p68_seed_batch.mjs > p68.log 2>&1; log "end p68 rc=$?"; log "chain25 done"
