#!/bin/bash
# chain51.sh — 11 Nov 2026: after chain50 ends: s86b = C715451, C715613, C715615 re-run with the exact "Totals" row match (a vendor named "Total Truck ...").
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-9].sh|chain50.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s86b"; ONLY=C715451,C715613,C715615 timeout 2400 node s86_paging.mjs > s86b.log 2>&1; log "end s86b rc=$?"; log "chain51 done"
