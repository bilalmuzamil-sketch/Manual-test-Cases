#!/bin/bash
# 17 Oct 2026 — chain: wait until round 3 (run-fixup-1017c.sh and its waiter after-fixup-1017c.sh) is gone — matched EXACTLY on the
# process command line (L0429: a bare-name grep also matches unrelated shells whose command text mentions the name) — then run round 4
# (run-fixup-1017d.sh, list fixup-1017d.txt), then the END-OF-RUN SIGN-OUT BATCH (run-signout-1017.sh), so the sign-outs come last.
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-fixup-1017d; mkdir -p $O
echo "$(date -u +%T) waiting for round 3 (run-fixup-1017c.sh, after-fixup-1017c.sh) to end" >> $O/chain.out
while pgrep -f "^/bin/bash \./run-fixup-1017c\.sh" >/dev/null || pgrep -f "^/bin/bash \./after-fixup-1017c\.sh" >/dev/null || pgrep -f "^/bin/bash \./run-fixup-1017\.sh" >/dev/null; do sleep 60; done
echo "$(date -u +%T) round 3 ended; starting run-fixup-1017d.sh" >> $O/chain.out
source stg-env.sh; ./run-fixup-1017d.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-fixup-1017d.sh ended; starting the sign-out batch run-signout-1017.sh" >> $O/chain.out
./run-signout-1017.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-signout-1017.sh ended" >> $O/chain.out
