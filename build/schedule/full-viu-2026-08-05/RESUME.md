# Schedule full live VIU — RESUME (updated every batch)

## ⚠️ THE BUILD MOVED MID-PASS — read `BUILD-MARKER-MOVED.md` before anything else

| Half | Cases | Build | Date |
|---|---|---|---|
| Batches 1–5 | **97** | `v3.5-d122eef` — **superseded** | 8/5/2026 |
| Batch 6 + part of 7 | **29** | **`v3.5-7ec992f`** | 8/6/2026 |

**Current marker in force:** `v3.5-7ec992f`, last-modified **Wed 05 Aug 2026 22:49:36 GMT**,
etag `e2a80a6ab5e0b47c29fd88af9db1e980`. Re-read it at every batch; it has now moved four
times in two days.

**Session:** cookies at `/tmp/schedule-viu/ck.txt` were **alive** at 02:28Z on 6 Aug (HTTP 200
on `/api/auth/me/fe-permissions`). `POST /api/quick-login` has **never** been called. If they
die, ask for fresh `sv_sso_session` / `PHPSESSID` / `cf_clearance` for `.qa.shopview.com`.

**Harness (rebuilt this session — `/tmp/sv/` had been wiped):**
`/tmp/sv/h.mjs` exports `boot / go / api / dump / texts`. MITM bridge:
`cd /tmp/schedule-viu && (NODE_USE_ENV_PROXY=1 setsid node bridge.mjs 0 >bridge.log 2>&1 </dev/null &)`
— port lands in `bridge-port.txt`. Playwright resolves from
`/opt/node22/lib/node_modules/playwright`; Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `nohup` does NOT survive here — use
`setsid`. TestRail helper `/tmp/testrail/tr.py` (Rule-50 byte verification built in).

## Progress

| Batch | Areas | Cases | Status |
|---|---|---|---|
| 1 | Navigation, Mini Calendar, WO List/Search, WO Filters | 22 | **OBSERVED 22/22** (old build) |
| 2 | Line Drill-Down, Drag-and-Drop, Scope Picker, Shift Block Anatomy | 22 | **OBSERVED 22/22** (old build) |
| 3 | Multi-Day Spread, Linked Series, Overlap/Lane Stacking | 18 | **OBSERVED 18/18** (old build) |
| 4 | Day View Timeline, Shift Detail Modal, Hover Tooltips | 18 | **OBSERVED 18/18** (old build) |
| 5 | Events, Conflict Detection, Capacity Bars | 17 | **OBSERVED 17/17** (old build) |
| 6 | Deletion/Series/Undo, Reassignment, Shift Start Times | 20 | **OBSERVED 20/20** on `v3.5-7ec992f` |
| 7 | Toolbar, Filter&Display/View Options, Colour, Keyboard, Working Hours | 22 | **9 of 22** on `v3.5-7ec992f` |
| 8 | Permissions, Edge Cases | 20 | **not started** |
| 9 | Cross-Module Regression, API | 9 | **not started** |

**Observed: 126 of 168.** Verdicts so far: **PASS 93 · DEVIATION 29 · HELD 3 · NOT-OBSERVED 1.**

## NEXT ACTION — exact

**Batch 7, the 13 still to do**, all on `v3.5-7ec992f`:

* `SCH-TOOL-03` = C30041 — toolbar search highlights matches, fades non-matches
  (open with `[data-test-id=button_schedule_search_toggle]`). Ticket **SV-8874** already covers
  its known fault; the case still says "no developer ticket yet" and that sentence is FALSE.
* `SCH-COLOR-01/02/03` = C30071 / C30072 / C30073 — default blue, per-shift recolour
  (`button_shift_detail_color`), editable colour labels.
* `SCH-KEY-01/03/05` = C30066 / C30068 / C30070 — Escape closes topmost, Enter confirms
  (but not inside a note textarea), focus trap.
* `SCH-HRS-02/03/04/05/06` = C38847 / C38848 / C38849 / C38850 / C38851 — the Working Hours
  settings screens.

**Do `SCH-HRS-03` together with `SCH-START-01` = C29969 and `SCH-START-02` = C29970.** Both are
blocked on the same thing: every technician who has hours has the identical 07:00–19:00 window
(= the general default), and the shop has no business hours at all. Give ONE technician a
custom window through Edit Staff Member and START-01 becomes settleable; the Edit Location
business-hours toggle settles START-02. **Record the BEFORE values** — the location toggle is a
shared setting and turning it on invalidates batch 5's working-hours observations, so do it
last and note it.

Then **batch 8** (Permissions — **Rule 26 applies: reset each in-scope role to template BEFORE
observing, record before/after and the state you leave it in**) and **batch 9**.

## Then, and only then, the TestRail pass

**NO TESTRAIL WRITE HAS BEEN MADE. Nothing is half-written.** The instruction is to write the
168 cases only once all 168 are observed, so the write pass has deliberately not begun.

When it does: take a **FRESH** pre-write snapshot first (`snapshots/PRE-cases-168.json` is from
5 Aug and other passes have run since), and **send all three text fields
(`custom_preconds`, `custom_steps`, `custom_expected`) on EVERY `update_case`** — TestRail
re-renders any omitted text field and this project shows markup literally to the tester.

**Rule 54 as amended — two sentences that never merge.** Sentence 1 names ONLY documents.
Sentence 2 is "Last checked against build `<marker>` on `<date>`" **with the marker observed
for THAT case** — which for this pass means **97 cases say `v3.5-d122eef` / 8/5/2026** and the
rest say `v3.5-7ec992f`. Barred: "as per the build tested on", "verified by the build", and
"passed"/"verified" on a case that fails.

Run 357 (Ayesha Khan, 168 tests, 429 results): **zero result writes, zero run writes** unless a
case is added.

## Known-good facts learned this pass (worth keeping)

* **Series create:** `POST /api/schedule/shifts {workOrderId, lineIds[], staffId, startDate,
  startTime, spreadMode:'single'|'series', totalMinutes, perDayMinutes, isAllDay}` → 201.
  `spreadMode:'multi'` is rejected — "The spread mode must be single or series."
* **Line technician roster** lives at `GET /api/schedule/work-orders?search=<WO number>` →
  `data.workOrders[0].lines[].technicians[]`. `GET /api/work-orders/{id}` returns 404.
* **Board:** `GET /api/schedule/board?from=<ISO instant>&to=<ISO instant>` — a bare date is
  rejected; it wants a full instant.
* **In Week view a series renders as ONE bar spanning its days.** Clicking the bar always opens
  the shift under the CURSOR, so target a specific day by clicking at
  `x = bar.x + bar.width*(i+0.5)/days`.
* **The UNASSIGNED lane** sits below every technician row, needs scrolling, and only renders in
  a range that already contains an unassigned shift.
* **Lane-label geometry is offset from grid-row geometry** — aiming a drop at a lane label's y
  can land on the department header band and produce an unassigned shift. Use the label's own
  bounding box mid-point.
* **Toast host** is `[data-test-id=undo_toast_host]`, containing `undo_toast`,
  `button_undo_schedule_action`, `button_dismiss_toast`. It appears ~500 ms after the action —
  sample too early and you will wrongly record "no toast".

**Teardown is not required** (QA lead, 2026-08-05). Everything created is recorded in
`CHANGES-MADE.md`, whose two self-contradictions were resolved against the live board on
2026-08-06.
