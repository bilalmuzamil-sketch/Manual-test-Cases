#!/bin/bash
cd /home/user/Manual-test-Cases
U=build/founder-mode/part-lifecycle/update-2026-10-08
: > $U/render.log
while read cid; do
  out=$(CID=$cid timeout 180 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | tail -n 1)
  echo "C$cid $out" >> $U/render.log
done < $U/render-ids.txt
echo RENDER-DONE >> $U/render.log
