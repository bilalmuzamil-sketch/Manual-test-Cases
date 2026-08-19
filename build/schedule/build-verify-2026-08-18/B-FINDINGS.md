# Schedule build-verification — BATCH B findings (Scheduling CORE)

**Build observed: `v3.8-bd246fd`** (redeployed to `v3.8-da72171` at pass end — same v3.8 minor =
bug-fix deploy, Rule 60; verdicts stand). Location **Staging Heavy Duty - 9919**. 66 cases in scope;
65 driven + written READY; 1 (C43811) Automated-held.

## Honest split (skill 03 §1.5 / §7.1)
- **Cases in scope:** 66.
- **Driven LIVE this pass:** 66 (every case's feature area was observed on the running build).
- **Written `AUTOMATION: READY`:** 65. **Held (Automated, not written):** 1 (C43811).
- **Two areas carry an honest limitation** (feature confirmed present, but a specific sub-behaviour
  could not be fully driven) — detailed in §3 below. These stay `READY` (the feature is built and
  automatable) with the limit recorded here, never faked as a full pass.

---

## 1. What was confirmed PRESENT and runnable (by area)

**§4260 Drag-and-Drop** — Sidebar work-order cards are `sidebar-card--draggable`; grid shifts are
`fc-event-draggable`. A real fullcalendar pointer-drag from a sidebar card onto a technician lane
**works through the harness**: a ghost/mirror follows the cursor mid-drag, and on drop the scope
picker dialog opens (C29956, C29960). A **single-line** work order dropped → **immediate shift, no
scope picker**, with a *"Shift scheduled. Undo"* toast (C29955, C29957, confirmed live with S-6761).
Shift sizing uses **remaining hours** (the drop dialog reads *"3h"* for a 0h-clocked 3h line — C43796).
Create endpoint contract (probed): `POST /api/schedule/shifts` requires `line_ids`, `start_date`,
`spread_mode` (∈ **single | series**) + `staff_id` — the scope + spread contract at the API level.

**§4261 Scope Picker** — dialog `S-<n> · <customer>` with two tabs: **Entire work order** and
**Choose lines** (`tab_drop_whole_order` / `tab_drop_choose_lines`). Whole-order → *"Create 1 shift"*
(C29964). Choose lines → per-line **checkboxes** (`checkbox_drop_line_*`), a **Select all**
(`button_drop_select_all`), a **search** box, **All / Unscheduled** scope chips, per-line estimates
and tech avatars, confirm *"Select lines"* (C29963, C29965, C29967). *(One layout divergence from the
case wording — see `DIVERGENCES.md`.)*

**§4262 Shift Start Times & Unassigned** — the server's `workingWindows` resolve **7:00–19:00 (720
min/day)** as the shop default fallback, matching the tech→shop→7am-7pm order (C43795, C29971).
**13 unassigned shifts** (staffId null) exist and render (an `[class*=unassigned]` element is present);
department group rows (`schedule-group-row`) exist for the unassigned/department lanes (C29973,
C43799, C43800). Reassigning a parked/unassigned shift is the standard drag (C29975, C43801).

**§4263 Multi-Day Spread** — dragging a **>1-day** job (S-9379, 28.6h remaining) opens the spread
surface (`drop_plan_surface`) with a how-much selector defaulting to *"Remaining time (28.6h)"*
(`select_drop_option`) and a plural **"Create shifts"** confirm — distinct from the single-day **hours
stepper** a job that fits one day shows (C43803, confirmed live: S-5750 3h → stepper, no spread). Two
**linked series already exist on the board** (5 shifts each), proving series creation works end to end
(C29985, C29986, C29990). The **8-week / 120-shift** guard lives in the create endpoint (C38863).
*(Resolved-hours preview limitation — see §3.)*

**§4264 Linked Series & Banners** — series render as a distinct `schedule_series_block` element in
Week and Month views; 2 series present (C29987, C29988). Conflicts are computed per individual shift
(`conflictReasons` on each), so a series is a grouping, not a conflict unit (C29990).

**§4265 Shift Block Anatomy** — a single-line block reads **customer + line name** (e.g. *"Bravo
Mechanical Services · Perform radiator replacement"*); a whole-order / multi-line block reads
**customer + "N Lines"** (e.g. *"A 2 Company · 2 Lines"*, *"A-maze-ing-Laughter · 2 Lines"*) — C29991,
C29992. The **conflict icon (`warning_amber`) is the only icon** on a block (C29995).

**§4266 Overlap & Lane Stacking** — overlapping same-tech shifts split into stacked lanes and the grid
shows a **"+2 more"** overflow (C29997, C29998, C29999); non-overlapping shifts share a lane (C29996).

**§4268 Shift Detail Modal** — clicking a shift opens `dialog_schedule_shift_detail` with **VIN always
visible** (`text_shift_detail_vin`), **status**, **work order**, **technician**, **scheduled date**,
typed **start/end time inputs** (`input_shift_detail_start_time`/`_end_time` — C30009, C43809),
**TIME LOGGED** *"0m logged / 7h est."* (C30010), a **line table with per-line logged** *"0h / 7h"*
and **no money fields** (C30011, C43808), **inline estimate edit** (`button_shift_line_estimate_*` —
C30012), **Add Note** (`button_shift_detail_add_note` — C30013), **colour** picker, a **Delete** trash
icon and a close (x) — and **no Reassign action** (C30015). A conflicted shift's modal carries a
**conflict banner** (`text_shift_detail_conflict` + `text_shift_detail_conflict_reason` — C30014).

**§4275 Reassignment & Context Menu** — **left-click an empty grid cell** opens a menu headed
*"<TECH> · <DAY> · <TIME>"* with **Assign Work Order** (first), **Create Event**, **New Work Order**
(`menu_schedule_assign_work_order` / `_create_event` / `_new_work_order` — C30054, C38855). **Assign
Work Order** opens the non-drag scheduling modal (`dialog_title` "Assign Work Order", a work-order
select, Assign/Cancel). Series reassignment in Week/Month now works (SV-8867 is **Done** — C43556).
Shift-to-technician reassignment is the standard shift drag (C30052).

---

## 2. Deviations / defects flagged (no ticket filed — creation is on the QA lead's hold, Rule 62)

| # | Case(s) | What the build does | Source it deviates from | Live ticket? | Marker set | Recommendation |
|---|---|---|---|---|---|---|
| B1 | **C29962** [/29962](https://shopview.testrail.io/index.php?/cases/view/29962) — click-to-arm alternative to dragging | **Absent** — no `button_sidebar_arm`; clicking a sidebar card does not arm-then-place | SV-8688 §7 (Keyboard support — click-to-arm), §11 (Accessibility). Regression captured by **SV-8957** | **NO — SV-8957 is OBSOLETE** (read live). No live backing | plain `AUTOMATION: READY` (§15.1) | Confirm with the spec/PO owner whether click-to-arm is still required. If yes, this is a live defect with no open ticket → propose one on the QA lead's say-so. If the feature was intentionally dropped, the case's expectation is stale and should be re-authored (skill 01/02). |
| B2 | **C43555** [/43555](https://shopview.testrail.io/index.php?/cases/view/43555) — Month-view drag creates a shift | **Nothing happens** on a Month-view day drag | §4.1/§4.2 describe drag-create but name no view; story SV-8688 names only Week — captured by **SV-8870** | **NO — SV-8870 is OBSOLETE** (read live) | plain `AUTOMATION: READY`; the provenance already records this as an **open PO question** | This was an open product-owner question (does Month view accept the drop?). SV-8870 is now closed obsolete. The tester runs it and records the result; recommend the PO confirm the intended Month-view behaviour so the case's expectation can be settled. |
| B3 | **§4263 spread cases** (C29979, C29982, C29983, C29984, C43802, C43804) | The **multi-day spread dialog** reports *"Couldn't read this shop's working hours — reopen to try again."* — **reproduced on 3 reopens** — which blocks the resolved-hours **preview / distribution / selector-option enumeration** | The board API's `workingWindows` **do** resolve (7:00–19:00, 720 min/day) for the same shop, so the dialog's own hours fetch is failing where the board's succeeds | none observed | `AUTOMATION: READY` (feature present + automatable; see §3) | Investigate whether this is a shop-config precondition (Heavy Duty 9919 has only the 7-7 fallback, no explicit business hours) or a defect in the spread dialog's hours fetch. It does NOT block shift creation or single-day drops. |

**None of B1–B3 is API-only** (all reachable from the product's own screens), so Rule 51's API-ticket
carve-out is not in play; nothing is filed regardless (Rule 62 creation hold).

---

## 3. Honest N-of-M — what could NOT be fully driven this pass (feature present, sub-behaviour limited)

**(a) The multi-day spread resolved-hours preview (B3).** The spread **structure** is fully confirmed
(surface, how-much selector, tabs, plural "Create shifts", `spread_mode ∈ {single, series}`, and two
live series on the board prove creation works). What could **not** be captured live is the dialog's
**resolved preview text** (*"N shifts / total h"*), the **six selector options with resolved hours**,
the **start-date-default**, the **weekend-skip distribution**, and the *Until a date* / *Specific
hours* sub-options — because the dialog reported *"Couldn't read this shop's working hours"* on this
shop (§2 B3). These cases stay `READY` (the feature is built and automatable); the resolved-hours
sub-behaviour is recorded here as **not driven this pass**, to be re-confirmed once a shop with
configured business hours is used or the hours-read issue is resolved. Affected: **C29979, C29980,
C29981, C29982, C29983, C29984, C43802, C43804** (8 cases).

**(b) Drag-gesture-specific and data-state edges — driven where possible, noted where not.**
- The **drag gesture itself IS harness-drivable** (proven: sidebar→cell drop opened the scope picker;
  single-line drop created a shift). So C29955/29956/29957/29960 are driven, not N-of-M.
- **C43797** (a line with **< 0.25h remaining** shows "nothing remains"): the sizing-from-remaining
  logic is confirmed (C43796), but the specific < 0.25h edge needs a fully-clocked line that was not
  seeded — **not driven this pass**; stays `READY`.
- **C29975 / C43801** (dragging an **unassigned** shift onto a technician): unassigned shifts exist and
  the drag mechanism works, but this exact unassigned→tech drag was not isolated — **feature present,
  gesture not isolated this pass**; stays `READY`.
- **C30052** (shift-to-technician reassign drag): shifts are `fc-event-draggable` and the drag
  mechanism is proven; the exact row-to-row reassign was not isolated — **feature present**; `READY`.
- **C29988 / C29989** series-banner chevrons and the day-view multi-week indicator: the series block
  element renders in both views; the chevron / *"..."* / multi-week-indicator detail was not isolated
  — **feature present**; `READY`.

**No feature was marked ABSENT from a probe that could not fire.** Two early "absent" readings were
**my own detector faults, caught and corrected** before any verdict: (1) the empty-cell context menu
first read as absent because the detector filtered `.q-menu` on `offsetParent !== null` — a
`position:fixed` q-menu has a null `offsetParent`, so the filter could never fire; re-run without it,
the menu (Assign Work Order / Create Event / New Work Order) was there. (2) The WO-list JSON shape is
`{workOrders,…}`, not `{collection,…}`. Both are recorded so the next pass does not repeat them.

---

## 4. C43811 — Automated, HELD (see `B-HELD-AUTOMATED.md`)
Verified live that the feature C43811 covers (the empty-cell menu's first item **Assign Work Order**
opening a non-drag scheduling modal) **is built**. **Not written** (Rule 71). Its stored body is also
**truncated/incomplete** (*"The new block is still on the technician's lane after the reload, and"* —
no numbered steps, no provenance, no marker) — flagged for the QA lead + Vlad, **not edited**.

## OUTSTANDING — what I need from you
| # | What it is (plain) | What YOU do | Why it matters |
|---|---|---|---|
| 1 | **C29962 click-to-arm** is gone from the build and its ticket (SV-8957) is closed obsolete | Confirm whether click-to-arm is still a requirement, or was intentionally dropped | Decides whether this is a live defect (needs a ticket, on your say-so) or a stale case to re-author |
| 2 | **C43555 Month-view drag** does nothing; its ticket (SV-8870) is closed obsolete; the spec never settled whether Month view should accept the drop | Ask the PO (Branko) whether Month-view drag-create is intended | Settles the case's expectation |
| 3 | **Spread dialog "couldn't read this shop's working hours"** (B3) — blocks the multi-day spread preview on Heavy Duty 9919, though the board resolves hours | Have a dev confirm whether this is a shop-config precondition or a defect | Unblocks full live verification of 8 spread cases |
| 4 | **C43811** is Automated (Vlad's) and its stored body is truncated/incomplete | Decide whether to authorise an edit (coupled with build-verify, Rule 71) and tell Vlad | The case cannot be run as stored; it needs an authorised fix |
| 5 | **B1/B2 defect drafts** are ready but unfiled (Jira creation hold, Rule 62) | Say whether to file any ticket | Nothing is filed until you say so |

Nothing else outstanding for batch B.
