#!/bin/bash
# 17 Oct 2026: replaces after-round5-1017.sh (stopped by hand at ~09:40 UTC). Waits until round 5 (run-fixup-1017e.sh) is gone
# (exact command-line match, L0429), then HOLDS the sign-out batch until the go-file below exists, so the last stubborn script
# faults can be worked live on the one shared staging sign-in first (a real log-out may end that sign-in, L0410).
# Release: touch evidence/staging-full-2026-10-14/logs-signout-1017/GO      Log: logs-fixup-1017e/chain.out
cd "$(dirname "$0")"; O=evidence/staging-full-2026-10-14/logs-fixup-1017e; G=evidence/staging-full-2026-10-14/logs-signout-1017/GO
echo "$(date -u +%T) after-round5b: waiting for round 5 (run-fixup-1017e.sh) to end, then for $G" >> $O/chain.out
while pgrep -f "^/bin/bash \./run-fixup-1017e\.sh" >/dev/null; do sleep 60; done
echo "$(date -u +%T) round 5 ended; sign-out batch HELD until $G exists" >> $O/chain.out
while [ ! -f "$G" ]; do sleep 60; done
echo "$(date -u +%T) GO found; starting the sign-out batch run-signout-1017.sh" >> $O/chain.out
source stg-env.sh; ./run-signout-1017.sh >> $O/chain.out 2>&1
echo "$(date -u +%T) run-signout-1017.sh ended" >> $O/chain.out
