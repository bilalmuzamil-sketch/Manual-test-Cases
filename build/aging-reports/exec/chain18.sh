#!/bin/bash
# chain18.sh — 11 Nov 2026 ~14:08 UTC: after chain17 ends: p64 (C715445 customer-card check).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-7].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p64"; timeout 300 node p64_card_check.mjs > p64.log 2>&1; log "end p64 rc=$?"; log "chain18 done"
