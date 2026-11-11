#!/bin/bash
# queue8.sh — 11 Nov 2026 ~15:30 UTC: s87d = C715424 again (number pattern S-17887; Change Location list for enrolment) after queue7.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[234567].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s87d"; ONLY=C715424 timeout 900 node s87_plain.mjs > s87d.log 2>&1; log "end s87d rc=$?"; log "queue8 done"
