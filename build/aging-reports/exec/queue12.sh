#!/bin/bash
# queue12.sh — 11 Nov 2026 ~16:00 UTC: s83c (C715363 pinned row re-measured on screen; C715600 at 1200 and 1000 px) after queue11.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[01]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s83c"; timeout 1800 node s83c_pin.mjs > s83c.log 2>&1; log "end s83c rc=$?"; log "queue12 done"
