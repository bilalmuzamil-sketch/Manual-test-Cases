#!/bin/bash
# queue3.sh (re-used name, 11 Nov 09:36) — p47 PDF-500 message watch, right after queue2.sh (p45). Queues 22-30 match "queue3.sh" in their wait pattern.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue2\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p47 timeout 900 node p47_pdf500.mjs > p47.log 2>&1
log "queue3 (p47) done"
