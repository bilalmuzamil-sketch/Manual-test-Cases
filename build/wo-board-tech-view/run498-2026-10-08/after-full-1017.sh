#!/bin/bash
# 17 Oct 2026 — chain: wait for the main full run (run-full-1016.sh) to end, then the fix-up run (run-fixup-1017.sh).
# The sign-out (C368240) is NOT run here: it ends the shared staging sign-in, so it goes last, by hand, after judging.
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-fixup-1017; mkdir -p $O
while ps -eo args | grep -q "[r]un-full-1016.sh"; do sleep 60; done
echo "$(date -u +%T) main run ended; starting fix-up run" >> $O/chain.out
source stg-env.sh; ./run-fixup-1017.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) fix-up run ended" >> $O/chain.out
