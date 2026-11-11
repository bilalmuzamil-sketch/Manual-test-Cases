#!/bin/bash
# queue22.sh (re-used name, 11 Nov) — p52: regression-test data (customers ZZR, vendors ZZRV), after queue21 (r1).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 34; while pgrep -f "queue1[1-9]\.sh$|queue2[01]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p52 env SFX=" R1" timeout 2400 node p52_seed_reg.mjs > p52.log 2>&1
log "queue22 (p52) done"
