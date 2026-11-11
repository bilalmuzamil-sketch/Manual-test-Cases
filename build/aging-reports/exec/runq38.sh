#!/bin/bash
# runq38.sh — 11 Nov 2026 ~18:50 UTC: p77b (C715537 Close clicked by the message's own button) after runq31-34 and runq37, before pm1 (runq36) and d3b2 (runq35).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-47]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p77b"; timeout 600 node p77b_close.mjs > p77b.log 2>&1; log "end p77b rc=$?"; log "runq38 done"
