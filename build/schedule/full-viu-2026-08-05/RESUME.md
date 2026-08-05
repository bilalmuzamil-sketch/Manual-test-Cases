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
| 2 | Line Drill-Down, Drag-and-Drop, Scope Picker, Shift Block Anatomy | 22 | **OBSERVED 22/22** |
| 3 | Multi-Day Spread, Linked Series, Overlap/Lane Stacking | 18 | **OBSERVED 18/18** |
| 4 | Day View Timeline, Shift Detail Modal, Hover Tooltips | 18 | not started |
| 5 | Events, Conflict Detection, Capacity Bars | 17 | not started |
| 6 | Deletion/Series/Undo, Reassignment, Shift Start Times | 20 | not started |
| 7 | Toolbar, Filter&Display/View Options, Colour, Keyboard, Working Hours | 22 | not started |
| 8 | Permissions, Edge Cases | 20 | not started |
| 9 | Cross-Module Regression, API | 9 | not started |

**Observed so far: 62 of 168.** Next case: batch 4, SCH-DAY-01.

**Verdicts so far:** PASS 47 · DEVIATION 14 · HELD 2 · one HOLD lifted (see `evidence/batch*/VERDICTS.json`).

**Teardown is no longer required** (QA lead, 2026-08-05). Data is left in place and
recorded in `CHANGES-MADE.md`.

**NO TestRail write has been made yet.** Pre-write snapshot committed at
`snapshots/PRE-cases-168.json` (SHA 5bf6100).

**Shift create contract (learned live, belongs in the playbook):**
`POST /api/schedule/shifts {workOrderId, lineIds[], staffId, departmentId, startDate,
startTime, spreadMode:'single'|..., totalMinutes, perDayMinutes, color, note, isAllDay,
acknowledgeLongSeries}`; `DELETE /api/schedule/shifts/{id}` -> 204; `PATCH` for edits;
board read is `GET /api/schedule/board?from=…&to=…`. Default start time is **07:00 local**.

**Board baseline:** `snapshots/BOARD-PRE.json.gz` + `BOARD-PRE-digest.json` —
3318 shifts, 204 events, 7 series ids, whole of 2026 swept. Nothing seeded yet,
nothing touched yet.

**Batch 2 wrote to the board and cleaned up. One pre-existing shift was deleted by an
over-wide clean-up and has been RESTORED - see `BOARD-RESTORE-PROOF.md`. All 91 work
orders proven byte-identical afterwards.**
