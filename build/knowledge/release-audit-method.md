---
title: Release-day audit of a feature - what to check, in what order, with which tools
keywords: release, audit, green, signal, go, no-go, staging, regression, verdict, run, testrail, retest, build, develop, ships
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/AUDIT-STATUS.md
---
1. What ships: no release PR -> it comes from develop. Confirm staging's build is on develop and that NO commit touches the feature's code between it and develop head (git log/diff limited to the feature's folders). Re-check the build marker before every step: staging redeploys unannounced (b6a5d15 -> e93e93b in one evening).
2. Group the run's latest results by build (regex v\d+\.\d+\.\d+-[0-9a-f]{7} in comments). Passes from older builds count only for areas whose code did not change since (git log <old>..<new> -- <feature dirs>).
3. Re-test exactly the changed areas + every Failed test whose ticket is Ready for Production. Read each case body first (Rule 112).
4. Whole-data checks and export checks by script (see card whole-data-check-kit), then the screen run for UI-only behaviour.
5. Every flag: break MY check first (card check-the-checker), then source, then Jira (121/126). Drafts only; TestRail/Jira writes need his go-ahead.
6. Report as tables: checked / result; known non-blockers with the quote; still to do; what I got wrong; OUTSTANDING.
