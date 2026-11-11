#!/bin/bash
# queue19.sh (re-used name, 11 Nov) — p48b: C715469 step 4 message pictures, after queue18 (s9c).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 28; while pgrep -f "queue1[1-8]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p48b timeout 400 node p48b_pdf2000_msg.mjs > p48b.log 2>&1
log "queue19 (p48b) done"
