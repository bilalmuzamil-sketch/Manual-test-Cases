#!/bin/bash
# chain47.sh — 11 Nov 2026: after chain46 ends: p71 (the seven roles for the permission tests, built on screen).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p71"; timeout 1800 node p71_roles.mjs > p71.log 2>&1; log "end p71 rc=$?"; log "chain47 done"
