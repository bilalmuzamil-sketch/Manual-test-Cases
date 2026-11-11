#!/bin/bash
# chain30.sh — 11 Nov 2026: after chain29 ends: s80b = C715418 re-run (scrolls the 21-line group to find invoice A).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s80b"; ONLY=C715418 timeout 900 node s80_cancel_scroll.mjs > s80b.log 2>&1; log "end s80b rc=$?"; log "chain30 done"
