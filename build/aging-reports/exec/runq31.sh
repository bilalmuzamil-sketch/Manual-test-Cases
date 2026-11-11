#!/bin/bash
# runq31.sh — 11 Nov 2026 ~16:55 UTC: s83d (C715600 re-measure at 1200/1000/900 px after resizing, no reload) after queues 11-26.
# Named runq*, not queue*, so no older queue's wait pattern can match it and no committed old queueNN.sh is ever reused (L0662).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s83d"; timeout 900 node s83d_side.mjs > s83d.log 2>&1; log "end s83d rc=$?"; log "runq31 done"
