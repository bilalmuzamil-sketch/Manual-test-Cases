#!/bin/bash
# Drives every board in the 8 Oct design export (Rule 120). Resumable.
cd /home/user/Manual-test-Cases
python3 build/testing-tools/drive_design_full.py "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-drive/work-orders --workers 3 --serve > build/wo-board-tech-view/source-update-2026-10-08/design-drive/drive-work-orders.log 2>&1
python3 build/testing-tools/drive_design_full.py "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders -no page-fix-.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-drive/work-orders-no-page-fix --workers 3 --serve > build/wo-board-tech-view/source-update-2026-10-08/design-drive/drive-no-page-fix.log 2>&1
python3 build/testing-tools/drive_design_full.py "build/wo-board-tech-view/sources/design-2026-10-08-upload/wo-details/Add Part.html" build/wo-board-tech-view/source-update-2026-10-08/design-drive/add-part --workers 3 --serve > build/wo-board-tech-view/source-update-2026-10-08/design-drive/drive-add-part.log 2>&1
echo ALLDONE >> build/wo-board-tech-view/source-update-2026-10-08/design-drive/drive-work-orders.log
