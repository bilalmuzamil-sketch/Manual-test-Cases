#!/bin/bash
# 17 Oct 2026: round 5 of the run 498 fix-ups. Waits until round 4 (run-fixup-1017d.sh) is gone — exact command-line match (L0429) —
# then runs run-fixup-1017e.sh, then the sign-out batch run-signout-1017.sh LAST. Replaces after-round4-1017.sh (stopped by hand, so it
# cannot start the sign-out batch before round 5). Log: logs-fixup-1017e/chain.out
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-fixup-1017e; mkdir -p $O
echo "$(date -u +%T) waiting for round 4 (run-fixup-1017d.sh) to end" >> $O/chain.out
while pgrep -f "^/bin/bash \./run-fixup-1017d\.sh" >/dev/null || pgrep -f "^/bin/bash \./run-fixup-1017c\.sh" >/dev/null; do sleep 60; done
echo "$(date -u +%T) round 4 ended; starting run-fixup-1017e.sh" >> $O/chain.out
source stg-env.sh; ./run-fixup-1017e.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) starting the sign-out batch run-signout-1017.sh" >> $O/chain.out
./run-signout-1017.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-signout-1017.sh ended" >> $O/chain.out
