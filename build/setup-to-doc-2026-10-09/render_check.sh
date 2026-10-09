#!/bin/bash
# usage: render_check.sh <file of case ids> <log>
cd /home/user/Manual-test-Cases
bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
while read -r id; do
  [ -z "$id" ] && continue
  r=$(CID=$id timeout 200 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | grep -E "RESULT" | tail -1)
  if [ -z "$r" ]; then bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1; r=$(CID=$id timeout 200 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | grep -E "RESULT" | tail -1); fi
  echo "C$id $r" >> "$2"
done < "$1"
echo DONE >> "$2"
