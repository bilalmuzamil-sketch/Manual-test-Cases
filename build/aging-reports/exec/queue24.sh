#!/bin/bash
# queue24.sh — 11 Nov 2026 ~16:35 UTC: p62c (offline: cached data or a failure?) after queue23.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-3]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p62c"; timeout 1200 node p62c_cache.mjs > p62c.log 2>&1; log "end p62c rc=$?"; log "queue24 done"
