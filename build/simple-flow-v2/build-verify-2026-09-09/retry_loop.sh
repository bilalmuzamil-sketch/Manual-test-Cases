#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/simple-flow-v2/build-verify-2026-09-09
for i in $(seq 1 12); do
  n=$(wc -l < $D/REPAIRED-runnable.jsonl 2>/dev/null || echo 0)
  echo "=== attempt $i (REPAIRED=$n) $(date +%H:%M:%S) ==="
  if [ "$n" -ge 15 ]; then echo "ALL 15 DONE"; break; fi
  bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  timeout 560 node $D/apply_edits.mjs $D/runnable-edits.json >> $D/retry_loop.log 2>&1
  sleep 25
done
n=$(wc -l < $D/REPAIRED-runnable.jsonl 2>/dev/null || echo 0)
echo "LOOP END REPAIRED=$n $(date +%H:%M:%S)"
