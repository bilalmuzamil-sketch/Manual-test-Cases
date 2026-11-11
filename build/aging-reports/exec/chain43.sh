#!/bin/bash
# chain43.sh — 11 Nov 2026: after chain42 ends: s84c = C715389 re-run (step 5 click looked for the wrong menu row kind; fixed).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-2].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s84c"; ONLY=C715389 timeout 900 node s84_seeded.mjs > s84c.log 2>&1; log "end s84c rc=$?"; log "chain43 done"
