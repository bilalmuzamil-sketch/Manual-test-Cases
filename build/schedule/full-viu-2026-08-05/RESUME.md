# Schedule full live VIU — RESUME (updated every batch)

## 🔴 BLOCKED ON A DEAD SIGN-IN — read `SESSION-BLOCKED-2026-08-06.md` first

The 2026-08-06 resume attempt **stopped at step 0 and observed nothing**. The stored
Schedule cookies return **HTTP 401 `sso_required`** and `POST /api/quick-login` is barred
for this session, so the run cannot start. **The one thing needed is a fresh
`sv_sso_session` / `PHPSESSID` / `cf_clearance` for `.qa.shopview.com`, valid against
`sv8685api.qa.shopview.com`.**

Two traps recorded there so they are not re-tried: the **app** host answers HTTP 200 for
any path because it serves the SPA shell, so **always probe the `…api.` host**; and the
**Filters cookie set is alive but useless here** — 409 `Session has expired.` against the
Schedule API, because each branch keeps its own session store.

**The build has NOT moved** — `v3.5-7ec992f`, last-modified Wed 05 Aug 2026 22:49:36 GMT,
etag `e2a80a6ab5e0b47c29fd88af9db1e980`, re-read 2026-08-06 03:27 UTC. So the 29 verdicts
on that marker are still current and the 97 on `v3.5-d122eef` are still stale.

**Still zero TestRail writes, proven by CONTENT not by timestamp:** all 168 re-read live,
0 field differences, 0 `updated_on` movement. Run 357 re-read: 168 tests, 429 results, all
present by id, 0 changed, 0 new. See `snapshots/NOWRITE-proof-2026-08-06.json` and
`snapshots/run357-untouched-2026-08-06.json`.

**Done anyway this session:** the two unfiled defects are now filed after clean duplicate
searches — **[SV-8923](https://shopview.atlassian.net/browse/SV-8923)** (C30047) and
**[SV-8924](https://shopview.atlassian.net/browse/SV-8924)** (C29975). And **six new Jira
tickets appeared** while we were away, one of which (**SV-8915**) carries a V1 product
decision our cases do not yet reflect. Details in `SESSION-BLOCKED-2026-08-06.md` §5.

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

**Batch 7, the 13 still to do**, all on `v3.5-7ec992f`. *(This list was re-derived from
`batches-6-9.json` minus the recorded verdicts on 2026-08-06 — an earlier edition of it
named only 12 and **omitted SCH-VIEW-04**, which is outstanding. The 13 below are the
computed set and reconcile to the 42 total.)*

* `SCH-TOOL-03` = C30041 — toolbar search highlights matches, fades non-matches
  (open with `[data-test-id=button_schedule_search_toggle]`). Ticket **SV-8874** already covers
  its known fault; the case still says "no developer ticket yet" and that sentence is FALSE.
* `SCH-VIEW-04` = C30045 — the remaining View Options item.
* `SCH-COLOR-01/02/03` = C30071 / C30072 / C30073 — default blue, per-shift recolour
  (`button_shift_detail_color`), editable colour labels.
* `SCH-KEY-01/03/05` = C30066 / C30068 / C30070 — Escape closes topmost, Enter confirms
  (but not inside a note textarea), focus trap.
* `SCH-HRS-02/03/04/05/06` = C38847 / C38848 / C38849 / C38850 / C38851 — the Working Hours
  settings screens.

**Batch 8 — 20, none started:** `SCH-PERM-01…11` = C30074–C30084, `SCH-PERM-12` = C30614,
`SCH-PERM-13` = C38926, `SCH-EDGE-02…06` = C30086–C30090, `SCH-EDGE-07/08` = C38865/C38866.
**Rule 26 applies to the whole of it.**

**Batch 9 — 9, none started:** `SCH-REG-01…05` = C38867–C38871, `SCH-API-01…04` =
C38872–C38875. **Rule 51: an API-only fault goes to `API-ASK.md`, it is not filed.**

## The 25 stale deviations to re-drive after the 42 (step 2)

All were seen on **`v3.5-d122eef`, which no longer exists**. Re-derived from the batch 1–5
verdict files on 2026-08-06:

C29927 SCH-NAV-03 · C29939 SCH-WOL-04 (SV-8873) · C29946 SCH-FILT-05 (SV-8857) ·
C29960 SCH-DND-06 (SV-8840) · C29967 SCH-SCOPE-05 (SV-8886) · C29982 SCH-SPREAD-06
(SV-8855) · C29984 SCH-SPREAD-08 · C29985 SCH-SPREAD-09 · C29987 SCH-SER-01 ·
C29988 SCH-SER-02 (SV-8849) · C29998 SCH-LANE-03 (SV-8850) · C29999 SCH-LANE-04 (SV-8850) ·
C30001 SCH-DAY-01 (SV-8837 — **and now also SV-8915**) · C30004 SCH-DAY-04 (SV-8856) ·
C30009 SCH-MODAL-02 (SV-8833) · C30010 SCH-MODAL-03 (SV-8834) · C30013 SCH-MODAL-06 ·
C30014 SCH-MODAL-07 (SV-8852) · C30016 SCH-EVT-01 · C30020 SCH-EVT-05 · C30021 SCH-EVT-06 ·
C30034 SCH-TIP-01 · C30035 SCH-TIP-02 · C30036 SCH-TIP-03 · C43554 SCH-NAV-08 (SV-8863).

The other **72** from that period are passes and carry forward on the old marker; their
provenance sentence 2 must name **`v3.5-d122eef` / 8/5/2026**, not today's build.

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
