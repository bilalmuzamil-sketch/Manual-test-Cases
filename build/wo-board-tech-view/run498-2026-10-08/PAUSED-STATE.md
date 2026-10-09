# Run 498 — PAUSED 9 Oct 2026 ~15:00 UTC (QA lead: "save the state and pause everything else we can resume later")

**Why paused:** the QA lead moved to the defect round. At the pause the branch sv10043 also answered quick-login with **HTTP 502** (three batches failed to sign in at 14:58: kbd-fix4, rename-probe, d8-pics2) — check `GET https://sv10043.qa.shopview.com/` and a quick-login before resuming.

**Live run counts at pause:** 252 tests — 187 passed · 16 failed · 9 blocked · 40 untested (2 of them, C368175 and C154650, are left for MANUAL testing by the QA lead: they need organisation B).

## Resume, in this order (each line = one step; run with `GS_APP=https://sv10043.qa.shopview.com ./wob-run.sh <script>` and the variables shown)

| # | Variables | Script | What it settles |
|---|---|---|---|
| 1 | `WOB_LIVE=1 ONLY=C368151,C368152,C97020` | `kbd-fix4.mts` | C368151, C368152, C97020 — keyboard (collapse, reassign to Ben by keyboard, view-only user on a real view-only role) |
| 2 | `` | `rename-probe.mts` | rename probe — does the List keep a stale lead name after a staff rename? (not a check) |
| 3 | `WOB_SCALE=2 WOB_EV=./defect-drafts/raw ONLY=D8` | `d8-pics2.mts` | D8 re-check in its ORIGINAL state (line already has a technician, add a second) — decides whether D8 stands, narrows or closes |
| 4 | `ONLY=C368217` | `ps-counts.mts` | C368217 — Part Sales Parts/Returns counts |
| 5 | `ONLY=C368196` | `sort-fix5.mts` | C368196 — List sort, Clocked In (other headers already judged) |
| 6 | `` | `deleted-search3.mts` | C368191 — Deleted-user hunt on line tasks |
| 7 | `ONLY=C368172,C368177,C368178,C368179,C368192,C368190,C368188,C368189` | `high1-fix5.mts` | C368172, C368177, C368178, C368179, C368190, C368188, C368189 (+C368192 setup) — Schedule, timesheet, new-line technician, Asset on Site |
| 8 | `ONLY=C368220,C368221,C368222,C368224,C368225,C368226,C368227,C368228,C368229,C368230,C368231,C368232,C368233,C368234,C368235,C368236,C368237` | `medium-fix3.mts` | C368220–C368237 — Parts/report filters kept after reload |
| 9 | `` | `dash-probe2.mts` | dashboard probe 2 (C368246) — full dashboard answer, page errors |
| 10 | `WOB_LIVE=1 ONLY=C97003,C97012` | `s9-fix7.mts` | C97003, C97012 — column reorder (full order) and refused drop on two real sessions |
| 11 | `WOB_LIVE=1 ONLY=C368149` | `c368149-two.mts` | C368149 — two dispatchers, two real sessions |
| 12 | `ONLY=C368238,C368239` | `imp-fix3.mts` | C368238, C368239 — sign in as another user while a page loads (time limit per step) |
| 13 | `` | `signout-fix.mts` | C368240 — sign-out, ALWAYS LAST |

Also still open: **C97022** (keyboard focus kept) — the case's "refresh" step always puts browser focus at the top of the page; a question for the QA lead before it is judged.

Queue scripts were in the session scratchpad (`master46*.sh`); they are NOT needed to resume — the table above is the whole queue.
