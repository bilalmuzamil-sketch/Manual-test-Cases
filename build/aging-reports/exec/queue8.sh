#!/bin/bash
# queue8.sh (re-used name, 11 Nov) — p46 A/R seed, third try (names suffixed " R3" because the first two runs left customers with no invoices), right after queue23 (s4e).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue23\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p46 env SFX=" R3" timeout 1800 node p46_seed_ar.mjs > p46.log 2>&1
log "queue8 (p46) done"
