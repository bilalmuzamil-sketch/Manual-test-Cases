#!/bin/bash
# 49 board sweeps, two at a time (started once the canvas sweep had finished, to use the free CPUs).
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
cd /tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/dd14b
ls boards/*.dc.html | xargs -P 2 -I{} bash -c 'b=$(basename {} .dc.html); python3 /home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py {} out-boardsP/$b --workers 1 --serve > logsP-$b.txt 2>&1; echo "BOARD $b EXIT $?" >> boardsP.log'
echo BOARDSP_DONE >> boardsP.log
