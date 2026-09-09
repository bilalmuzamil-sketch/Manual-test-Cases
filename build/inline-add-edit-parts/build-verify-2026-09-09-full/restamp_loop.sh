#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/inline-add-edit-parts/build-verify-2026-09-09-full
for i in $(seq 1 12); do
  n=$(wc -l < $D/restamp/APPLIED.jsonl 2>/dev/null || echo 0)
  echo "=== attempt $i (applied=$n) $(date +%H:%M:%S) ==="
  if [ "$n" -ge 162 ]; then echo "ALL 162 DONE"; break; fi
  bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  timeout 900 node build/testing-tools/surgical_replace.mjs $D/restamp-plan.json >> $D/restamp.log 2>&1
  sleep 20
done
echo "LOOP END applied=$(wc -l < $D/restamp/APPLIED.jsonl 2>/dev/null || echo 0) $(date +%H:%M:%S)"
