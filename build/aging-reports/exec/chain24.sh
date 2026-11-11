#!/bin/bash
# chain24.sh — 11 Nov 2026: after chain23 ends: d2 (design captures: chips/menus, export menu, links, Total/Totals row, headings; C715509-516, C715563, C715621-632).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-3].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d2"; timeout 2400 node d2_design.mjs > d2.log 2>&1; log "end d2 rc=$?"; log "chain24 done"
