#!/bin/bash
# chain50.sh — 11 Nov 2026: after chain49 ends: p65b re-run (C715477; first-row click fixed).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-9].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p65b2"; timeout 600 node p65b_wo_link.mjs > p65b2.log 2>&1; log "end p65b2 rc=$?"; log "chain50 done"
