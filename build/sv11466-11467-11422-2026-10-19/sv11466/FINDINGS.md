# SV-11466 — Board View sideways scrollbar (19 Oct 2026)
Verdict: **PASSED** — Jira comment 79018 (3 attachments, read back in order, 7-row table).
Sources: PRD 845185030 v65 (13:11Z 19 Oct; S3-E2 unchanged from v64); Chris 78909 option (A). QA lead: no recording, no technical details, Firefox: install and test, Before: after-only + one line.
Build: staging v26.40.19-c850386 (index.html last-modified Mon, 19 Oct 2026 11:32:40 GMT), re-read at the pre-post gate.

## Variant matrix (all observed)
| Cell | Result |
|---|---|
| Heavy Duty 9919 (~296 cols, sw 89984) 1920/1440/1280/1024 | offsetHeight-clientHeight 16; handle pixel-measured 150 px at all four |
| QB Location (sw 81168) 1440 | 16 / 150 |
| DVI Test (8 techs, sw 2432) 1920/1440/1024 | handle 1053 / 516 / 204 px = proportional, all > 150 |
| ZZAUTOTEST F2 Empty Shop | board fits, no bar (correct) |
| Drag end to end, all widths + DVI | scrollLeft reached max; last column "Deleted technician"; back to 0, Aaron Baker first; Unassigned x=17 throughout |
| Column bars | .board-column__body scrollbar-width thin, 10 px; dark colour rgb(75,85,101) — same as 17 Oct (sv11430 findings) |
| Tech View / List | 8 px (global ::-webkit-scrollbar 8px rule unchanged) |
| Dark theme | handle 150, rgb(75,85,101) on rgb(15,17,26) |
| Firefox 142 (Playwright build, headed under Xvfb, viewport:null) | own standard bar, 12 px, small native handle |
CSS: `.board-view__scroller::-webkit-scrollbar{height:16px}` + `::-webkit-scrollbar-thumb{min-width:150px}`.

## Harness lesson
Playwright Firefox with a fixed `viewport` hides every scrollbar (computed scrollbar-width none, even on a plain div). Headless or headed, use `viewport:null` + xvfb-run to see Firefox's real bar. Install: `PLAYWRIGHT_BROWSERS_PATH=/tmp/pwff node /opt/node22/lib/node_modules/playwright/cli.js install firefox`.

## BEFORE
Not capturable: production has no Board View (no display toggle on v26.40.19-d2441a9); staging already carries the fix. Stated in the comment.

## TestRail (authorized by QA lead)
- add_case 682419 in section 13238 (re-GET 0 mismatches) — "Board View's sideways scroll bar is thick and its handle is never tiny"; appended at end of section (API cannot place it right after C96953).
- Run 498 union: 280 → 281 tests, 1601 results before/after, 0 missing; new test 4053764.
- update_case 96953: S3-E2 quote → v65 + source line; only custom_expected/updated_on/version changed.
- No results logged.
## Pre-post gate
build re-read c850386, PRD 65, ticket Merged to Staging (no new comments since 16 Oct), voice scan clean, no technical section, read back OK.
