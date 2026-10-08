#!/bin/bash
cd /home/user/Manual-test-Cases
O=build/founder-mode/part-lifecycle/design-drive-2026-10-08
python3 build/testing-tools/drive_design_canvas.py build/founder-mode/part-lifecycle/sources/design-2026-10-08-artifact/artifact-raw.html $O/canvas > $O/canvas.log 2>&1
echo CANVAS-EXIT $? >> $O/canvas.log
