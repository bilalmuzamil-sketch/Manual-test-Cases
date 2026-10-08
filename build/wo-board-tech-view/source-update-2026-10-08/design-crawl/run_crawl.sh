#!/bin/bash
# Stateful full crawl of the 8 Oct Work Orders design (Rule 120), one worker per display. Resumable (--resume).
cd /home/user/Manual-test-Cases
C=build/testing-tools/crawl_design_states.py
python3 $C "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-crawl/list  --vendor build/wo-board-tech-view/sources/design/vendor --max-depth 6 --max-states 300 --variants --resume --no-expand '^(By Lead Tech|Board)$' > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/list.log 2>&1 &
python3 $C "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-crawl/tech  --vendor build/wo-board-tech-view/sources/design/vendor --max-depth 6 --max-states 300 --variants --resume --seed 'button||button|By Lead Tech|#1::click' --no-expand '^(Table|Board)$' > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/tech.log 2>&1 &
python3 $C "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-crawl/board --vendor build/wo-board-tech-view/sources/design/vendor --max-depth 6 --max-states 300 --variants --resume --seed 'button||button|Board|#1::click' --no-expand '^(Table|By Lead Tech)$' > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/board.log 2>&1 &
wait
echo ALLDONE > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/DONE
