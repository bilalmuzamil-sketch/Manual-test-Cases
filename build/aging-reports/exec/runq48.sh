#!/bin/bash
# runq48.sh — 11 Nov 2026 ~23:50 UTC: q3_prod on PRODUCTION (before-release side), alongside runq47 (different site, its own sign-in).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
log "start q3prod"; timeout 1800 node q3_prod.mjs > q3prod.log 2>&1; log "end q3prod rc=$?"; log "runq48 done"
