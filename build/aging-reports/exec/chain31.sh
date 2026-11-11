#!/bin/bash
# chain31.sh — 11 Nov 2026: after chain30 ends: p69 (A/P bill at Location C; location lists by date; A/R documents at Location C).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain30.sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p69"; timeout 900 node p69_locC.mjs > p69.log 2>&1; log "end p69 rc=$?"; log "chain31 done"
