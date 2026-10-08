#!/bin/bash
# usage: display_check.sh <comma ids>  -> appends "<cid> <RESULT line>" to display-check.log
D=/home/user/Manual-test-Cases/build/wo-board-tech-view/structure-conversion-2026-10-08
cd /home/user/Manual-test-Cases
source build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
for c in $(echo "$1" | tr ',' ' '); do
  grep -q "^$c RESULT OK" $D/display-check.log 2>/dev/null && continue
  r=$(CID=$c timeout 300 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | grep -o "RESULT.*" | tail -1)
  echo "$c ${r:-RESULT MISSING}" >> $D/display-check.log
done
