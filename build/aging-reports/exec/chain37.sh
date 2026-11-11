#!/bin/bash
# chain37.sh — 11 Nov 2026: after chain36 ends: s82b = C715318 / C715321 re-run with a group open at every step (lines visible).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s82b"; ONLY=C715318,C715321 timeout 1500 node s82_sortstay.mjs > s82b.log 2>&1; log "end s82b rc=$?"; log "chain37 done"
