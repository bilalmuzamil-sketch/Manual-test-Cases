#!/bin/bash
cd /home/user/Manual-test-Cases
python3 build/testing-tools/drive_design_full.py "build/founder-mode/part-lifecycle/sources/design-2026-10-08-artifact/artifact-raw.html" build/founder-mode/part-lifecycle/design-drive-2026-10-08/sweep --workers 3 --serve > build/founder-mode/part-lifecycle/design-drive-2026-10-08/sweep.log 2>&1
echo SWEEP-EXIT $? >> build/founder-mode/part-lifecycle/design-drive-2026-10-08/sweep.log
