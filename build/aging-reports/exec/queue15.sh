#!/bin/bash
# queue15.sh (re-used name, 11 Nov) — p49 A/P exact-amount seed (all sets), after queue14 (s9b).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 20; while pgrep -f "queue1[1234]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p49 env SFX=" R1" timeout 2400 node p49_seed_ap.mjs > p49.log 2>&1
log "queue15 (p49) done"
