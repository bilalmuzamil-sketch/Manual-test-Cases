---
title: The A/R A/P 92-test staging run kit cannot reseed a staging that still holds its old records
keywords: seed, reseed, staging, run.js, run card, 92 tests, anchor, ledger, fixed document numbers, already invoice with number, release morning, fallback, smoke
learned: 2026-11-19
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md; build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/tools/seeded-staging-failed-reseed-2026-11-19.json; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/smoke_screens.js
---
- seed.py dates every record relative to the run day but uses FIXED document numbers (ZZT-P61-BILL_LATE...). On a staging that kept the old records, a reseed is refused (19 Nov: 84 of 85 "There is already invoice with number").
- run.js refuses a ledger anchored on another day ("STOP: today at location A is ... but the seed is anchored on ..."), because case dates move with the anchor.
- So the 92-test screen run works only on the day it was seeded, or after a redeploy that wiped the records. Fix needed in the kit: a per-anchor suffix on document numbers (and the cases' named numbers read from the ledger).
- Fallback that worked in 10 minutes: scripts/smoke_screens.js (all six reports: errors, expand/collapse, links, export menu, info icon) + scripts/sort_in_group.js (header sort inside open groups).
- The 12 Nov ledger is kept as seeded-staging-anchor-2026-11-12.json and restored as seeded-staging.json.
