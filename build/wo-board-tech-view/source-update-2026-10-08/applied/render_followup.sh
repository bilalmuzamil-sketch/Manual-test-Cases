#!/bin/bash
# After the main render pass finishes, render the 4 cases written or changed after it started.
cd /home/user/Manual-test-Cases
D=build/wo-board-tech-view/source-update-2026-10-08/applied
until [ "$(wc -l < $D/render-log.txt)" -ge 165 ]; do sleep 30; done
for id in 368135 96996 368160 368161; do r=$(CID=$id timeout 120 /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs 2>&1 | tail -1); echo "C$id $r" >> $D/render-log-followup.txt; done
echo "main $(wc -l < $D/render-log.txt) notOK $(grep -vc 'RESULT OK' $D/render-log.txt) · followup notOK $(grep -vc 'RESULT OK' $D/render-log-followup.txt)"
