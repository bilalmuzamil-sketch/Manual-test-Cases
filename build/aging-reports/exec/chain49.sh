#!/bin/bash
# chain49.sh — 11 Nov 2026: after chain48 ends: p66c (bill's Vendor Invoice edit - clear Due date; invoice finance page menus).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-8].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p66c"; timeout 600 node p66c_edit.mjs > p66c.log 2>&1; log "end p66c rc=$?"; log "chain49 done"
