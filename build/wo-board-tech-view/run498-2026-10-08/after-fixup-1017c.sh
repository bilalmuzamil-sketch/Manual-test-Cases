#!/bin/bash
# 17 Oct 2026 — chain: wait until the fix-up run (run-fixup-1017.sh) has ended, then run the third fix-up queue (run-fixup-1017c.sh,
# list fixup-1017c.txt). The pattern "[r]un-fixup-1017\.sh" matches run-fixup-1017.sh only, never run-fixup-1017c.sh.
# The sign-out (C368240) is NOT run here: it ends the shared staging sign-in, so it goes last, by hand, after judging.
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-fixup-1017c; mkdir -p $O
echo "$(date -u +%T) waiting for run-fixup-1017.sh to end" >> $O/chain.out
while ps -eo args | grep -q "[r]un-fixup-1017\.sh"; do sleep 60; done
echo "$(date -u +%T) run-fixup-1017.sh ended; starting run-fixup-1017c.sh" >> $O/chain.out
source stg-env.sh; ./run-fixup-1017c.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-fixup-1017c.sh ended" >> $O/chain.out
