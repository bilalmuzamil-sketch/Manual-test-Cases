#!/bin/bash
cd /home/user/Manual-test-Cases
python3 build/testing-tools/crawl_design_states.py "build/founder-mode/part-lifecycle/sources/design-2026-10-08-artifact/artifact-raw.html" build/founder-mode/part-lifecycle/design-drive-2026-10-08/crawl --max-depth 6 --max-states 400 --variants --resume > build/founder-mode/part-lifecycle/design-drive-2026-10-08/crawl.log 2>&1
echo CRAWL-EXIT $? >> build/founder-mode/part-lifecycle/design-drive-2026-10-08/crawl.log
