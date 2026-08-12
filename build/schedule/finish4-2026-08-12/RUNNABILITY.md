# Schedule finish4 — runnability, case by case

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
read at **2026-08-12T09:59Z** and unmoved since the finish3 pass.
**Location: `Staging Heavy Duty - 9919`** on every observation.

**18 cases walked this pass.** Each was checked against the five checks: is the precondition
reachable · does the navigation path exist · is each named control where the step says it is · do
the steps work in the order written · are the labels the ones on screen.

**The behaviour verdict is the manual tester's, not ours (Standing Rule 10, as amended 2026-08-11).**
What is recorded below is that the case can be *run*.

---

## Deletion, series scopes and undo

**C30057 — deleting a middle shift of a series offers all three scope options.** RUNNABLE.
Precondition seeded by nothing — it already existed: series `7fca50c0` carries 4 shifts and the
grid renders member 3 of 4. The modal says so itself: *"Part of a series · Shift 3 of 4"*.
`button_shift_detail_delete` opens **Delete from this series?** offering exactly three scopes —
`button_delete_scope_shift` *"This shift only returns 9h"* · `button_delete_scope_following`
*"This and all later shifts returns 14h 30m"* · `button_delete_scope_series` *"Entire series
(4 shifts) returns 32h 30m"* — plus `button_cancel_dialog`. **Cancelled; zero non-GET calls.**

**C30060 — 'the whole series' removes all of that technician's series shifts.** RUNNABLE.
Its precondition (*"the SAME work order has a series on technician A and an independent series on
technician B"*) **was not reachable and was SEEDED**: `POST /api/schedule/shifts` with
`spread_mode: series` put series `81a6b48c` on **MQ Test Tech Qamar** for the same work order
**S-14209**. Driving it: technician A's series **4 → 0**, technician B's **2 → 2**, board
**174 → 170**, one call — `DELETE /api/schedule/shifts/…?scope=series`. Undo toast present.

**C30065 — every action toasts with Undo, and Undo restores.** RUNNABLE for the delete half.
Toast read **within 700 ms**: *"Shift deleted. Undo close"* with an **Undo** button. Clicking it
issued `POST /api/schedule/shifts/restore` and **the same shift id came back** (board 170 → 170,
`victim_back = true`) — worth recording, because a delete-and-recreate mints a *new* id.
**HONEST LIMIT:** the **create** half was driven by the finish3 pass (C29955, toast *"Shift
scheduled. Undo"* at ~400 ms); the **move** and **reassign** halves were not driven here.

**C38864 — actions save immediately; Undo reverses, closing does not cancel.** RUNNABLE.
Steps 1–2 driven end to end: the 4-shift series delete went 4 → 0 and **still read 0 after a full
page reload with Undo never clicked**. Step 4 driven: delete → Undo within the toast → restored.
Step 3's **move** half was not driven — it needs a drag between two days.

## Reassignment

**C43556 — a series member can be reassigned in week view.** RUNNABLE. **The drag worked.**
Block scrolled into view first, then dragged in 20 steps onto another technician's lane; mid-drag
`schedule-drop-target` was present; on release the build raised **"Reassign shift S-14209 ·
Kastone Solutions … Move this shift to Lisa Stewart on Wed, Aug 12? Cancel Reassign"** — exactly
the confirmation expected result 2 describes. **Cancelled; zero non-GET calls, so nothing moved.**
**Note recorded rather than glossed:** the precondition names work order **S-9379 on Jose Young**;
that series is not on this board, so a different series was used and is named in the evidence.

## Day view

**C30005 — dragging a shift's left or right edge resizes it.** RUNNABLE. **And this one was very
nearly reported as a false absence:** a first probe read the block's children and found **no**
resize handles, cursor `pointer`. Hovering the **edge** — which is what the case actually asks for
— shows `fc-event-resizer fc-event-resizer-start` with **`cursor: w-resize`** at the left edge and
the matching resizer at the right. The handles exist; the first reading was our harness.

**C30017 — day-view event creation.** RUNNABLE. Day toggle works; a left-click on empty timeline
opens **"SERVICE/PARTS · WED, AUG 12 · 12:00 · Create Event · New Work Order"**, and Create Event
opens the event modal.

**C30018 — event modal fields.** RUNNABLE to step 1. The modal offers **Event name · All day ·
Start date · Start time · End date · End time · a colour (Grey) · Note (optional) · Cancel ·
Create Event** — every field the case names. **Steps 2–4 (save, re-open, all-day render) not
driven.**

## Colour

**C30072 — the shift modal colour picker.** RUNNABLE. `button_shift_detail_color` (reading
*"blue expand_more"*) opens swatches `button_color_swatch_blue`, `…_teal`, `…_violet`, `…_pink`,
`…_cyan`, `…_amber`, `…_grey`.

**C30073 — colour labels are editable per shop.** RUNNABLE. Each swatch carries its own
`button_color_label_rename_<colour>` (an **edit** control), and clicking it reveals
**`input_color_label_name`** pre-filled with the current label. **Nothing was saved** — this pass
verifies the route, it does not rename a shop-wide label.

## Capacity

**C30031 — over capacity, an amber spill extends past the track.** RUNNABLE to step 1. The bar
renders as `capacity-bar` › `__lane` › `__track` › `__fill` › `__tick` › **`__spill`**, and the
bar's own title reads **"Capacity 63% — 129h 6m scheduled of 205h, overtime"**. **The over-capacity
day the precondition asks for was not seeded**, so the spill's *appearance* is not asserted here —
only that the element and the route exist.

## Keyboard

**C30068 — Enter confirms the active dialog, but not inside a note textarea.** RUNNABLE.
All four dialogs the case names were reached live during this pass — the **spread step** (finish3),
the **reassign confirm**, the **event modal** and the **series delete-scope** prompt — and the
shift detail modal's **note** control was opened. **Enter itself was not pressed in each**, because
in three of the four that would commit a change; the case is runnable, the key presses are the
tester's.

## Drag-and-drop

**C29962 — a click-to-arm alternative exists.** RUNNABLE, and it still fails as its marker says.
Hunted three ways: **zero** `data-test-id` matching arm / click-to-schedule (the control was
`button_sidebar_arm_<woId>` when it existed on 5 August), the card's own controls read after a
hover, and a click on the card produced no armed state and no popup. Consistent with **SV-8957**;
the case keeps `AUTOMATION: READY - EXPECT FAIL (SV-8957)`.

## Working hours settings

**C38849 / C38850 / C38851.** **The route is RUNNABLE exactly as the preconditions write it.**
*Settings > Staff > the pencil on a technician's row* reaches `staff_edit_button`, and the form
carries **`toggle_custom_working_hours`** labelled **"Set working hours for this technician"** —
and, beneath it, the per-day editor the two later cases need: `select_working_hours_start_monday_0`,
`select_working_hours_end_monday_0`, `button_remove_working_hours_monday_0` and
**`button_add_working_hours_monday`** (the *"Add Hours"* control), repeating per day.
**HONEST LIMIT: the editor itself was NOT driven.** Turning that toggle on and saving is a staff
settings write, which this pass deliberately does not make. So for **C38850** and **C38851** the
route and the controls are verified; the ranges, the overlap validation and the Save button are not.
**One cosmetic label note (logged, not escalated):** the preconditions say *"the pencil"*; the
control is an **`edit_note`** icon. A reader of the source would recognise it as the same thing.

## Dark mode

**C38866 / C43589.** **The precondition route is RUNNABLE** — the app's own theme control is in the
profile menu (`profile_menu_button` → **"light_mode Light / dark_mode Dark"**, the dark option being
**`button_night_mode_dark`**). Surfaces measured with dark mode applied: the shift detail dialog
computes background **`rgb(32, 41, 57)`** against a page background of **`rgb(20, 24, 36)`**, with
**`box-shadow: rgba(0,0,0,0.6) 0 16px 40px`** and a `1px solid rgb(54,65,82)` border — so a pop-up
does read as raised above the page, which is C43589's subject.
**HONEST LIMIT, and it matters: that dark state was applied by the harness (`body--dark`), NOT by
clicking the product's own toggle** — the toggle writes a user preference and this pass changes no
setting. The route is verified; the theme was not switched the tester's way.
