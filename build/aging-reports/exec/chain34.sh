#!/bin/bash
# chain34.sh — 11 Nov 2026: after chain33 ends: p66b (other routes to a no-due-date invoice/bill and an overpaid bill, Rule 107).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-3].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p66b"; timeout 600 node p66b_routes.mjs > p66b.log 2>&1; log "end p66b rc=$?"; log "chain34 done"
