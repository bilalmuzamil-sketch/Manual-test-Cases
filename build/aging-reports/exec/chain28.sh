#!/bin/bash
# chain28.sh — 11 Nov 2026: after chain27 ends: d1c = A/P Detail design re-measure after the loader has gone (C715493-C715495).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-7].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d1c"; D1OUT=d1c ONLY=apd timeout 1500 node d1_design.mjs > d1c.log 2>&1; log "end d1c rc=$?"; log "chain28 done"
