#!/bin/bash
# One-click sweep, 14 Oct 2026 evening pass (Rule 124 3a). Two detached chains; each writes its own log; no polling needed.
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
cd /tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/dd14b
T=/home/user/Manual-test-Cases/build/testing-tools
( python3 $T/drive_design_full.py page/Dashboard-v1-canvas.html out-canvasfull --workers 2 > canvasfull.log 2>&1; echo CANVASFULL_EXIT $? >> canvasfull.log ) &
( python3 $T/drive_design_canvas.py page/Dashboard-v1-canvas.html out-canvasdrv > canvasdrv.log 2>&1; echo CANVASDRV_EXIT $? >> canvasdrv.log
  python3 /home/user/Manual-test-Cases/build/dashboards/design-drive-2026-10-14b/scripts/canvas_export_play.py page/Dashboard-v1-canvas.html out-exportplay > exportplay.log 2>&1; echo EXPORTPLAY_EXIT $? >> exportplay.log
  for f in boards/*.dc.html; do b=$(basename $f .dc.html); python3 $T/drive_design_full.py "$f" out-boards/$b --workers 1 --serve >> boards.log 2>&1; echo "BOARD $b EXIT $?" >> boards.log; done
  echo BOARDS_DONE >> boards.log ) &
wait
