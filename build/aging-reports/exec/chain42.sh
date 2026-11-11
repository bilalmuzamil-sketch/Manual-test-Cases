#!/bin/bash
# chain42.sh — 11 Nov 2026: after chain41 ends: s84b (Sales By Customer loading bar + empty state, control for C715499-C715504).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[01].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s84b"; timeout 900 node s84b_sbc.mjs > s84b.log 2>&1; log "end s84b rc=$?"; log "chain42 done"
