#!/bin/bash
# queue10.sh (re-used name, 11 Nov) — p48: C715469/C715467 PDF 2,000-line limit, after queue9 (s4p4).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 10; while pgrep -f "queue9\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p48 timeout 1500 node p48_pdf2000.mjs > p48.log 2>&1
log "queue10 (p48) done"
