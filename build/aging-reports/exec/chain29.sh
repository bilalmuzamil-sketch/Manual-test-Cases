#!/bin/bash
# chain29.sh — 11 Nov 2026: after chain28 ends: d1d (long-name wrap at 1440 px on all six reports, design step 5).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-8].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d1d"; timeout 1200 node d1d_longname.mjs > d1d.log 2>&1; log "end d1d rc=$?"; log "chain29 done"
