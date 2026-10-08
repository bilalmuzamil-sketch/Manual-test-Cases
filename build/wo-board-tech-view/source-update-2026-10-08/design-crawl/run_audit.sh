#!/bin/bash
# Rule 124 §9 shortcut audit: re-sweep, with no shortcuts, 10 skipped + 10 shortcut-swept screens per display.
cd /home/user/Manual-test-Cases
C=build/testing-tools/crawl_design_states.py
for w in list tech board; do
  python3 $C "build/wo-board-tech-view/sources/design-2026-10-08-upload/Work Orders.dc.html" build/wo-board-tech-view/source-update-2026-10-08/design-crawl/$w-audit --vendor build/wo-board-tech-view/sources/design/vendor --audit-from build/wo-board-tech-view/source-update-2026-10-08/design-crawl/$w --audit-count 10 --resume > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/$w-audit.log 2>&1 &
done
wait
echo done > build/wo-board-tech-view/source-update-2026-10-08/design-crawl/AUDIT-DONE
