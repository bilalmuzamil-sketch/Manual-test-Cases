#!/bin/bash
# 17 Oct 2026 — chain: wait until NO fix-up round is going (run-fixup-1017.sh, run-fixup-1017c.sh, after-fixup-1017c.sh), then run the
# END-OF-RUN SIGN-OUT BATCH (run-signout-1017.sh, list signout-1017.txt). Patterns are anchored on ".sh" so they never match this waiter.
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-signout-1017; mkdir -p $O
echo "$(date -u +%T) waiting for run-fixup-1017.sh, run-fixup-1017c.sh and after-fixup-1017c.sh to end" >> $O/chain.out
while ps -eo args | grep -qE "[r]un-fixup-1017\.sh|[r]un-fixup-1017c\.sh|[a]fter-fixup-1017c\.sh"; do sleep 60; done
echo "$(date -u +%T) no fix-up round running; starting run-signout-1017.sh" >> $O/chain.out
source stg-env.sh; ./run-signout-1017.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-signout-1017.sh ended" >> $O/chain.out
