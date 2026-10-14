#!/bin/bash
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
cd /tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/dd
python3 /home/user/Manual-test-Cases/build/testing-tools/drive_design_canvas.py page/Dashboard-v1-canvas.html out-canvasdrv > canvasdrv.log 2>&1
echo CANVASDRV_EXIT $? >> canvasdrv.log
for f in boards/*.dc.html; do b=$(basename $f .dc.html); python3 /home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py "$f" out-boards/$b --workers 1 --serve >> boards.log 2>&1; echo "BOARD $b EXIT $?" >> boards.log; done
echo BOARDS_DONE >> boards.log
