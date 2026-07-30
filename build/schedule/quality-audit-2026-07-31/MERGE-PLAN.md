# Schedule — Consolidation (Merge/Cut) Plan — 2026-07-31

**Companion to:** `USEFULNESS-AUDIT-2026-07-31.md` + `per-case-verdicts.csv` (same folder).
**Source snapshot:** `build/schedule/cases/*.json` at git SHA `7eeb74548eae665f5ac5110512fddc0c8550db41` (working tree clean for this folder at snapshot time).
**Status: PROPOSAL ONLY — nothing has been edited.** No case JSON was touched, no TestRail writes were made (Standing Rule 6). The user can approve the whole plan, per-group, or reject it.

## What this plan does

- **20 merge groups** absorb **23 member cases** into their named survivors (the survivor gains the members' steps/expected lines — no coverage is lost).
- **2 outright cuts** (literal duplicates, named).
- Result: **190 → 165 cases** with identical behavioural coverage.
- A further **19 WEAK-KEEP** cases are flagged (legitimate but low-value / verify-once); dropping them too would give **146**. The recommendation is to KEEP them but tag them "build-acceptance / verify once" rather than per-cycle regression.
- **HELD-pending-Branko cases are NOT touched by any group:** SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015) keep their held status; this plan proposes no edit to them.

Execution note (if approved): this is a TestRail `update_case` (survivor gains steps) + `delete_case` (members/cuts, bodies kept locally marked Retired) pass — it requires fresh explicit authorization per Standing Rule 6, a per-case audit log with re-GET verification, refs preserved onto the survivor (Rule 20), and regeneration of the import + id-map afterwards. The suite is still pre-VIU (spec-only) — merging BEFORE the live VIU pass is the cheap moment to do it.

## Merge groups

### G-NAV-LANDING
- **Survivor:** SCH-NAV-01 (C29925, https://shopview.testrail.io/index.php?/cases/view/29925) — "Schedule appears as a top-level navigation item"
- **Absorbs:**
  - SCH-NAV-02 (C29926, https://shopview.testrail.io/index.php?/cases/view/29926) — "The Schedule screen is split into a left work order sidebar and a main schedule grid" — Layout read happens in the same open-the-page sitting as the nav click; two assertions, not a separate flow.
- **What the survivor gains:** the two-region layout (sidebar with mini calendar + WO list / grid with toolbar) becomes 2 expected lines of the nav/open case
- **Refs to fold into the survivor (Rule 20):** SCH-NAV-02: `SV-8686 (§3, §3.1, §3.2)`

### G-CELL-MENU
- **Survivor:** SCH-REAS-03 (C30054, https://shopview.testrail.io/index.php?/cases/view/30054) — "Right-click a grid cell opens a menu with Create Event and New Work Order"
- **Absorbs:**
  - SCH-REAS-04 (C30055, https://shopview.testrail.io/index.php?/cases/view/30055) — "'View Day' is no longer offered in the grid cell context menu" — Same observation as the survivor (right-click, read the menu) — the 'no View Day' negative is one expected line.
  - SCH-REAS-05 (C30056, https://shopview.testrail.io/index.php?/cases/view/30056) — "'New Shift' is no longer offered in the grid cell context menu" — Same observation as the survivor — the 'no New Shift' negative is one expected line.
- **What the survivor gains:** the menu case asserts the menu contains ONLY 'Create Event' + 'New Work Order' — explicitly no 'View Day' and no 'New Shift' (two removed-item lines fold in)
- **Refs to fold into the survivor (Rule 20):** SCH-REAS-04: `SV-8700 (§7 (Right-click context menu - View Day))`; SCH-REAS-05: `SV-8700 (§7 (Right-click context menu - New Shift), §14.1 (creation via context menu))`

### G-SIDEBAR-SEARCH
- **Survivor:** SCH-WOL-04 (C29939, https://shopview.testrail.io/index.php?/cases/view/29939) — "'Search work orders' matches customer name, unit number, and technician name"
- **Absorbs:**
  - SCH-WOL-03 (C29938, https://shopview.testrail.io/index.php?/cases/view/29938) — "'Search work orders' matches the work order number" — WO-number search is a fourth keystroke sequence in the same search box the survivor already exercises three times.
- **What the survivor gains:** the work-order-number search becomes a fourth search step, so one case proves all four searchable card fields
- **Refs to fold into the survivor (Rule 20):** SCH-WOL-03: `SV-8687 (§3.1 (Sidebar search))`

### G-DRILLDOWN-OPEN
- **Survivor:** SCH-LINE-01 (C29948, https://shopview.testrail.io/index.php?/cases/view/29948) — "Clicking a work order card replaces the list in place with that order's lines, with a back control"
- **Absorbs:**
  - SCH-LINE-02 (C29949, https://shopview.testrail.io/index.php?/cases/view/29949) — "Drill-down header shows the work order id plus its line count" — The header is read the moment the drill-down opens in the survivor; two assertions, same sitting.
- **What the survivor gains:** the drill-down header read (work order id + line count matching approved lines) becomes an expected line of the open/back case
- **Refs to fold into the survivor (Rule 20):** SCH-LINE-02: `SV-8687 (§3.1 (Line drill-down))`

### G-SCOPE-CONTENTS
- **Survivor:** SCH-SCOPE-01 (C29963, https://shopview.testrail.io/index.php?/cases/view/29963) — "'Schedule whole work order' is pinned at the top, visually distinct, labeled with line count and total hours"
- **Absorbs:**
  - SCH-SCOPE-04 (C29966, https://shopview.testrail.io/index.php?/cases/view/29966) — "Scope picker line rows show the line title, estimated hours, and current technician roster" — Reading the line rows happens while reading the pinned whole-order row — one read-the-picker case.
- **What the survivor gains:** the line-row contents (title, estimated hours, roster avatar stack + count) become expected lines — one read-the-picker case
- **Refs to fold into the survivor (Rule 20):** SCH-SCOPE-04: `SV-8689 (§4.3)`

### G-SCOPE-MULTI
- **Survivor:** SCH-SCOPE-05 (C29967, https://shopview.testrail.io/index.php?/cases/view/29967) — "'Select multiple' switches rows to checkboxes with a confirm bar showing a running tally"
- **Absorbs:**
  - SCH-SCOPE-06 (C29968, https://shopview.testrail.io/index.php?/cases/view/29968) — "'Select all' equals whole order; Cancel returns to the fast single-tap list" — Select-all and Cancel are exercised inside the same 'Select multiple' session the survivor opens.
- **What the survivor gains:** 'Select all' (tally equals the whole order) and Cancel (returns to the single-tap list, creates nothing) become final steps of the checkbox-mode case
- **Refs to fold into the survivor (Rule 20):** SCH-SCOPE-06: `SV-8689 (§4.3 (Select all shortcut, Cancel))`

### G-SPREAD-HEADER
- **Survivor:** SCH-SPREAD-02 (C29978, https://shopview.testrail.io/index.php?/cases/view/29978) — "'Change scope' returns from the spread step to the scope picker"
- **Absorbs:**
  - SCH-SPREAD-01 (C29977, https://shopview.testrail.io/index.php?/cases/view/29977) — "Spread step shows the chosen scope in its header with a 'Change scope' back-link" — The header is read on arriving at the spread step, immediately before the survivor clicks its back-link.
- **What the survivor gains:** the spread-step header assertions (step 2 of the same modal, chosen scope shown, 'Change scope' present) become expected lines before the back-link is clicked
- **Refs to fold into the survivor (Rule 20):** SCH-SPREAD-01: `SV-8691 (§4.5)`

### G-VIN-TOGGLE
- **Survivor:** SCH-VIEW-04 (C30045, https://shopview.testrail.io/index.php?/cases/view/30045) — "The 'VIN Number' toggle adds the VIN to shift blocks (day/week) only; the hover tooltip and the detail modal always show the VIN"
- **Absorbs:**
  - SCH-BLOCK-03 (C29993, https://shopview.testrail.io/index.php?/cases/view/29993) — "VIN appears as an extra block line only when the VIN toggle is on, in day and week views only (month omits it)" — Duplicates the survivor's block-VIN assertions (day/week add, month omits) — the survivor already states all of it.
  - SCH-DAY-07 (C30007, https://shopview.testrail.io/index.php?/cases/view/30007) — "With the VIN toggle on, day-view lane heights grow so block text is not clipped" — The day-view lane growth is one expected line the survivor's day-view step already passes through.
- **What the survivor gains:** the block VIN line in day+week only, month omission, and the day-view lane growing so text is not clipped all fold into the one VIN-toggle case (it already asserts most of this)
- **Refs to fold into the survivor (Rule 20):** SCH-BLOCK-03: `SV-8690 (§4.4, §9 (VIN option))`; SCH-DAY-07: `SV-8694 (§4.8 (Lane height with VIN))`

### G-SHIFT-COLOR
- **Survivor:** SCH-COLOR-02 (C30072, https://shopview.testrail.io/index.php?/cases/view/30072) — "Choosing a color from the shift modal's picker recolors the shift with matching background, text, and accent tones"
- **Absorbs:**
  - SCH-BLOCK-04 (C29994, https://shopview.testrail.io/index.php?/cases/view/29994) — "Shift blocks default to blue; a custom colour can be set per shift" — Default blue = SCH-COLOR-01; picker recolour = the survivor; the one NEW assertion (per-shift, not per-WO) folds in.
- **What the survivor gains:** colour is per SHIFT, not per work order (two shifts of the same order do not share a custom colour) becomes an expected line — and the stale per-WO note is corrected
- **Refs to fold into the survivor (Rule 20):** SCH-BLOCK-04: `SV-8690 (§4.4, §10)`

### G-SAMEDAY-LANE
- **Survivor:** SCH-LANE-01 (C29996, https://shopview.testrail.io/index.php?/cases/view/29996) — "Shifts whose times do not overlap share a single lane - the row keeps its normal height"
- **Absorbs:**
  - SCH-LANE-05 (C30000, https://shopview.testrail.io/index.php?/cases/view/30000) — "A technician can hold multiple shifts on the same day from different work orders" — Same observable as the survivor (two non-overlapping same-day shifts, one lane, no conflict) — only the two-WO setup differs.
- **What the survivor gains:** the two non-overlapping same-day shifts come from TWO DIFFERENT work orders, proving multi-WO same-day scheduling in the same observation
- **Refs to fold into the survivor (Rule 20):** SCH-LANE-05: `SV-8693 (§12 (edge case), §4.7)`

### G-AUTOSCROLL
- **Survivor:** SCH-DAY-01 (C30001, https://shopview.testrail.io/index.php?/cases/view/30001) — "Day view auto-scrolls on load and day navigation so the working-day start sits at the left edge (with a small buffer)"
- **Absorbs:**
  - SCH-DAY-02 (C30002, https://shopview.testrail.io/index.php?/cases/view/30002) — "Manual scrolling is not overridden - auto-scroll fires only on load or day navigation" — The not-overridden half of the same auto-scroll contract, tested in the same day-view session.
- **What the survivor gains:** manual scroll is not overridden + the full 24-hour timeline stays scrollable + only day navigation re-triggers auto-scroll become steps 3-5
- **Refs to fold into the survivor (Rule 20):** SCH-DAY-02: `SV-8694 (§4.8)`

### G-EVENT-MODAL
- **Survivor:** SCH-EVT-03 (C30018, https://shopview.testrail.io/index.php?/cases/view/30018) — "Event modal offers name, date, start/end time, an all-day toggle, and a color category"
- **Absorbs:**
  - SCH-EVT-04 (C30019, https://shopview.testrail.io/index.php?/cases/view/30019) — "The all-day toggle creates an all-day event" — The all-day toggle is one of the fields the survivor already fills; its behaviour is one more step.
- **What the survivor gains:** the all-day toggle behaviour (time fields not required when on; the event renders as an all-day block) folds in as a step of the modal-fields case
- **Refs to fold into the survivor (Rule 20):** SCH-EVT-04: `SV-8696 (§4.10, §8.1 (Event allDay field))`

### G-HOURS-CONFLICT
- **Survivor:** SCH-CONF-03 (C30025, https://shopview.testrail.io/index.php?/cases/view/30025) — "Before hours: a shift starting before the technician's configured working-day start is flagged"
- **Absorbs:**
  - SCH-CONF-04 (C30026, https://shopview.testrail.io/index.php?/cases/view/30026) — "After hours: a shift extending past the technician's configured working-day end is flagged" — Mirror of the survivor (after- vs before-hours) — same shift, same day-view sitting, second drag.
- **What the survivor gains:** one working-hours-conflict case: drag the same shift to start BEFORE the start and then extend PAST the end — both reason sentences observed in one sitting
- **Refs to fold into the survivor (Rule 20):** SCH-CONF-04: `SV-8697 (§4.11 (After hours))`

### G-VIEW-TOGGLES
- **Survivor:** SCH-VIEW-05 (C30046, https://shopview.testrail.io/index.php?/cases/view/30046) — "'View Options' popover offers Business Hours, Capacity Bars, Events, Tech Hours, Saturday, Sunday with the spec defaults"
- **Absorbs:**
  - SCH-VIEW-07 (C30048, https://shopview.testrail.io/index.php?/cases/view/30048) — "Capacity Bars toggle shows and hides the per-day capacity bars" — Pure show/hide flip on the popover the survivor already has open.
  - SCH-VIEW-08 (C30049, https://shopview.testrail.io/index.php?/cases/view/30049) — "Events toggle shows and hides event blocks on the grid" — Pure show/hide flip on the popover the survivor already has open.
- **What the survivor gains:** the two pure show/hide flips (Capacity Bars off/on, Events off/on) become steps after the six-toggle defaults read — one View-Options case
- **Refs to fold into the survivor (Rule 20):** SCH-VIEW-07: `SV-8700 (§9 (Capacity Bars), §4.12)`; SCH-VIEW-08: `SV-8700 (§9 (Events))`

### G-UNDO
- **Survivor:** SCH-DEL-09 (C30065, https://shopview.testrail.io/index.php?/cases/view/30065) — "Undo restores the state before the action - for delete, move, and reassign"
- **Absorbs:**
  - SCH-DEL-07 (C30063, https://shopview.testrail.io/index.php?/cases/view/30063) — "Every create, delete, move, and reassign action produces a toast with an Undo option" — Each action in the survivor already ends with the toast + the Undo click — the toast-presence sweep adds no new observation.
- **What the survivor gains:** the toast-appears-with-Undo assertion per action type folds into the undo-restores case (each action already ends with the toast + Undo click)
- **Refs to fold into the survivor (Rule 20):** SCH-DEL-07: `SV-8688 (§7 (Toast notifications), §11 (Undo))`

### G-ESCAPE
- **Survivor:** SCH-KEY-01 (C30066, https://shopview.testrail.io/index.php?/cases/view/30066) — "Escape closes the topmost open modal or popover, following the stacking order"
- **Absorbs:**
  - SCH-KEY-02 (C30067, https://shopview.testrail.io/index.php?/cases/view/30067) — "Within the shift modal, Escape first dismisses an open sub-picker before closing the modal itself" — Contained in the survivor's layered-Escape contract; the in-modal sub-pickers become explicit layers.
- **What the survivor gains:** the in-modal sub-picker escapes (colour picker, time picker, note edit each close first; then the modal) become explicit steps of the stacking-order case
- **Refs to fold into the survivor (Rule 20):** SCH-KEY-02: `SV-8700 (§7 (Escape within the shift modal))`

### G-ENTER
- **Survivor:** SCH-KEY-03 (C30068, https://shopview.testrail.io/index.php?/cases/view/30068) — "Enter confirms the active confirmable dialog (delete scope, reassign, spread, event create/edit)"
- **Absorbs:**
  - SCH-KEY-04 (C30069, https://shopview.testrail.io/index.php?/cases/view/30069) — "Enter does not fire inside textareas - multiline note editing works normally" — The exception half of the same Enter contract, tested in the same dialogs session.
- **What the survivor gains:** the Enter-inside-a-textarea exception (inserts a new line, never confirms) becomes the final step of the Enter-confirms case
- **Refs to fold into the survivor (Rule 20):** SCH-KEY-04: `SV-8700 (§7 (Enter does not fire inside textareas))`

### G-HRS-LOCATION
- **Survivor:** SCH-HRS-02 (C38847, https://shopview.testrail.io/index.php?/cases/view/38847) — "Edit Location shows a per-day (Mon-Sun) From-To business-hours editor"
- **Absorbs:**
  - SCH-HRS-01 (C38846, https://shopview.testrail.io/index.php?/cases/view/38846) — "Edit Location has a 'Set business hours for this shop' toggle, off by default" — The toggle reveal is step 1 of reaching the editor the survivor tests.
- **What the survivor gains:** the 'Set business hours for this shop' toggle label, its off-by-default state, and the reveal become steps 1-2 of the per-day editor case
- **Refs to fold into the survivor (Rule 20):** SCH-HRS-01: `SV-8699 (§4.2 Working Hours - business hours toggle)`

### G-HRS-VALIDATION
- **Survivor:** SCH-HRS-06 (C38851, https://shopview.testrail.io/index.php?/cases/view/38851) — "Overlapping hour ranges flag red with a message and disable Save"
- **Absorbs:**
  - SCH-HRS-07 (C38852, https://shopview.testrail.io/index.php?/cases/view/38852) — "Incomplete hour rows (empty From or To) are ignored by the overlap check" — A second scenario in the same validation editor the survivor already has open.
- **What the survivor gains:** the incomplete-row-ignored rule becomes a second validation scenario of the overlap-validation case (same editor, same sitting)
- **Refs to fold into the survivor (Rule 20):** SCH-HRS-07: `SV-8699 (§4.2 Working Hours - incomplete rows ignored by overlap check)`

### G-WEEK-EXPORT
- **Survivor:** SCH-EXP-01 (C38853, https://shopview.testrail.io/index.php?/cases/view/38853) — "Week Export opens a printable Department-by-Technician week grid"
- **Absorbs:**
  - SCH-EXP-02 (C38854, https://shopview.testrail.io/index.php?/cases/view/38854) — "Exported week view lists each department with its technicians and shifts" — Reading the exported content happens in the same export the survivor opens.
- **What the survivor gains:** the exported content checks (department headers, technician rows, shifts in correct day columns, week date range) fold into the open-the-export case
- **Refs to fold into the survivor (Rule 20):** SCH-EXP-02: `SV-8685 (design Week Export - V1 scope pending Branko)`

## Outright cuts

- **SCH-START-08** (C29976, https://shopview.testrail.io/index.php?/cases/view/29976) — "Every shift always has a start time - none is created without one"
  - Duplicate sweep: its steps literally re-run the other entry-point cases (SCH-START-01 C29954, SCH-START-02 C29955, SCH-START-03 C29956, SCH-START-04 C29957, SCH-START-05 C29958) and each of those already reads the created shift's start time — the 'every shift has a start time' invariant adds no new observation.
  - Refs recorded for the audit trail: `SV-8688 (§4.2, §12)`
- **SCH-EDGE-01** (C30085, https://shopview.testrail.io/index.php?/cases/view/30085) — "Planned hours across technicians may exceed the estimate - accepted without error"
  - Duplicate of SCH-SPREAD-10 (C29986): same setup (spread the same order's full estimate on technician A then B) and the same assertion (over-estimate accepted, no error) — SCH-SPREAD-10's expected line 3 states it verbatim.
  - Refs recorded for the audit trail: `SV-8691 (§12, §4.5)`

## Approval

Reply per-group (e.g. "approve G-CELL-MENU, G-VIN-TOGGLE; hold the rest"), or "approve all", or "reject". Nothing is executed without that authorization (Standing Rule 6).
