# Schedule full live VIU — RESUME (updated every batch)

**Build marker in force:** `v3.5-d122eef`, last-modified Wed 05 Aug 2026 15:35:43 GMT,
etag `dd1c57e2fb4beba9758b62a29afdeaab`. Re-read at every batch.

**Cookies:** `/tmp/schedule-viu/ck.txt` (set at 13:23Z). Alive. `quick-login` NEVER called.

**Harness:** `/tmp/sv/h.mjs` (open/safe/grid/sidebar/menus/type helpers), MITM bridge
started with `NODE_USE_ENV_PROXY=1 node /tmp/schedule-viu/bridge.mjs`, port in
`/tmp/schedule-viu/bridge-port.txt`.

| Batch | Areas | Cases | Status |
|---|---|---|---|
| 1 | Navigation, Mini Calendar, WO List/Search, WO Filters | 22 | **OBSERVED 22/22** |
| 2 | Line Drill-Down, Drag-and-Drop, Scope Picker, Shift Block Anatomy | 22 | not started |
| 3 | Multi-Day Spread, Linked Series, Overlap/Lane Stacking | 18 | not started |
| 4 | Day View Timeline, Shift Detail Modal, Hover Tooltips | 18 | not started |
| 5 | Events, Conflict Detection, Capacity Bars | 17 | not started |
| 6 | Deletion/Series/Undo, Reassignment, Shift Start Times | 20 | not started |
| 7 | Toolbar, Filter&Display/View Options, Colour, Keyboard, Working Hours | 22 | not started |
| 8 | Permissions, Edge Cases | 20 | not started |
| 9 | Cross-Module Regression, API | 9 | not started |

**Observed so far: 22 of 168.** Next case: batch 2, SCH-LINE-01.

**Verdicts so far:** PASS 18 · DEVIATION 4 (see `evidence/batch1/VERDICTS.json`).

**NO TestRail write has been made yet.** Pre-write snapshot committed at
`snapshots/PRE-cases-168.json` (SHA 5bf6100).

**Board baseline:** `snapshots/BOARD-PRE.json.gz` + `BOARD-PRE-digest.json` —
3318 shifts, 204 events, 7 series ids, whole of 2026 swept. Nothing seeded yet,
nothing touched yet.
