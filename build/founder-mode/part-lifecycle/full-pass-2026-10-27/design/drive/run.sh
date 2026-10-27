#!/bin/bash
cd /home/user/Manual-test-Cases
O=build/founder-mode/part-lifecycle/full-pass-2026-10-27/design/drive
R=build/founder-mode/part-lifecycle/sources/design-2026-10-13-artifact/artifact-page.html
python3 build/testing-tools/drive_design_canvas.py "$R" $O/run2/canvas > $O/run2/canvas.log 2>&1; echo CANVAS-EXIT $? >> $O/run2/canvas.log
python3 build/testing-tools/drive_design_canvas.py "$R" $O/run2/canvas-1536 --viewport 1536x900 > $O/run2/canvas-1536.log 2>&1; echo CANVAS-EXIT $? >> $O/run2/canvas-1536.log
python3 build/testing-tools/drive_design_full.py "$R" $O/run2/sweep --workers 3 --serve > $O/run2/sweep.log 2>&1; echo SWEEP-EXIT $? >> $O/run2/sweep.log
python3 build/testing-tools/drive_design_full.py "$R" $O/run2/sweep-1536 --workers 3 --serve --viewport 1536x900 > $O/run2/sweep-1536.log 2>&1; echo SWEEP-EXIT $? >> $O/run2/sweep-1536.log
echo ALL-DONE > $O/run2/DONE
