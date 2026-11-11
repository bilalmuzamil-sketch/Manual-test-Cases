#!/bin/bash
# chain45.sh — 11 Nov 2026: after chain44 ends: s80c = C715418 with invoice A = S11315-17734 (inside the case's Past due 1-30 filter).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-4].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s80c"; INV=S11315-17734 ONLY=C715418 timeout 900 node s80_cancel_scroll.mjs > s80c.log 2>&1; log "end s80c rc=$?"; log "chain45 done"
