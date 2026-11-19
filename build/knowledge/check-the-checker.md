---
title: When my own script flags a failure, try to break the script first
keywords: false positive, fail, flag, check, script, invariant, verify, defect, draft, my mistake, checker
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md; build/rules/MISTAKES-AND-CHECKS.md
---
- 18 Nov release audit: 5 of 5 "failures" my scripts raised were my own errors (M18-M21): a sort key, a rule I invented, $0 read as blank, a prefix-matching click, a CSV apostrophe read as an order change.
- Before a flag goes anywhere: (1) print the actual rows behind it; (2) find the PRD/case sentence the check encodes - quote it, never my wording; (3) ask what the old code did (pinned commit); (4) re-run with the fix and record the correction next to the flag.
- 19 Nov: a smoke check said "header click changes nothing" on grouped reports - it clicked with every group closed; PRD: "Groups never move; header clicks sort the rows inside each group". Checked again with groups open: sorting works.
