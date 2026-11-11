#!/bin/bash
# chain20.sh — 11 Nov 2026 ~14:15 UTC: after chain19 ends: p66 (data for the QA lead's four extra tests C1078998, C1078999, C1079000, C1095432).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p66"; timeout 900 node p66_seed_four.mjs > p66.log 2>&1; log "end p66 rc=$?"; log "chain20 done"
