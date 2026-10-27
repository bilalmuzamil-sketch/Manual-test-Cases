#!/bin/bash
cd /home/user/Manual-test-Cases
O=build/founder-mode/what-why/full-pass-2026-10-27/design/drive
R=$O/page/artifact-page-2026-10-27.html
python3 build/testing-tools/drive_design_canvas.py "$R" $O/canvas > $O/canvas.log 2>&1; echo CANVAS-EXIT $? >> $O/canvas.log
python3 build/testing-tools/drive_design_canvas.py "$R" $O/canvas-1536 --viewport 1536x900 > $O/canvas-1536.log 2>&1; echo CANVAS-EXIT $? >> $O/canvas-1536.log
python3 build/testing-tools/drive_design_full.py "$R" $O/sweep --workers 3 --serve > $O/sweep.log 2>&1; echo SWEEP-EXIT $? >> $O/sweep.log
python3 build/testing-tools/drive_design_full.py "$R" $O/sweep-1536 --workers 3 --serve --viewport 1536x900 > $O/sweep-1536.log 2>&1; echo SWEEP-EXIT $? >> $O/sweep-1536.log
echo ALL-DONE > $O/DONE
