#!/bin/bash
# chain32.sh — 11 Nov 2026: after chain31 ends: p70 (role on screen for C715425 with the requests recorded; document link kinds).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[01].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p70"; timeout 900 node p70_roles.mjs > p70.log 2>&1; log "end p70 rc=$?"; log "chain32 done"
