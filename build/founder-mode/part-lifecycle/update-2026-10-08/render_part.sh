#!/bin/bash
cd /home/user/Manual-test-Cases
U=build/founder-mode/part-lifecycle/update-2026-10-08
n=$1
while read cid; do
  [ -z "$cid" ] && continue
  out=$(CID=$cid timeout 240 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | tail -n 1)
  echo "C$cid $out" >> $U/render-$n.log
done < $U/render-ids-$n.txt
echo RENDER-DONE >> $U/render-$n.log
