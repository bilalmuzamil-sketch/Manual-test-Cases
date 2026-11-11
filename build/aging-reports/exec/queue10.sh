#!/bin/bash
# queue10.sh — 11 Nov 2026 ~15:40 UTC: p62b (load-error message, six reports offline + 500 control; C715633-C715638) after queue9.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[2-9].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p62b"; timeout 1800 node p62b_six.mjs > p62b.log 2>&1; log "end p62b rc=$?"; log "queue10 done"
