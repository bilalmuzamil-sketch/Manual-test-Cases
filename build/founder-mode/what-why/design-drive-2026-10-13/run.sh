#!/bin/bash
cd /home/user/Manual-test-Cases
O=build/founder-mode/what-why/design-drive-2026-10-13
R=build/founder-mode/what-why/sources/design-2026-10-13-artifact/artifact-page.html
python3 build/testing-tools/drive_design_full.py "$R" $O/sweep --workers 3 --serve > $O/sweep.log 2>&1; echo SWEEP-EXIT $? >> $O/sweep.log
python3 build/testing-tools/drive_design_canvas.py "$R" $O/canvas > $O/canvas.log 2>&1; echo CANVAS-EXIT $? >> $O/canvas.log
