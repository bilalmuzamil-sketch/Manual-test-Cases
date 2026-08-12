# Schedule — the seven cases held for "a drag that could not be completed", 2026-08-12

Build **`v3.5-65d6500`** (`index.html` last-modified Tue 11 Aug 2026 09:33:33 GMT, etag
`3250d285ffcf50626363a578fe273071`, sha256 `9348ca09…`), read at the start and again at the end.
Location **`Staging Heavy Duty - 9919`**. Suite 176 cases, run 357 — **never written to**.

**The premise held.** The drag IS drivable, and the two things that defeated the earlier attempts were
ours, not the product's: a drop target computed at **y=2095 in a 1080-tall viewport**, and a **one-line
work order**, where no scope picker is expected at all. A 27-line order opens the picker first try.

---

## The headline: the HOLD reason was wrong on five of the seven

Only two of the seven actually needed a drag we could not previously complete. **Three needed no drag
at all**, and two needed one that works. The HOLD text — *"it needs a drag that could not be
completed"* — had been copied across the whole group.

| Case | Needed a drag? | Now |
|---|---|---|
| C29967 | yes — and it works | **DEVIATION**, ticketed SV-8886 |
| C29982 | yes — and it works | **DEVIATION**, ticketed SV-9090 / SV-8855 (both closed, both still reproduce) |
| C29984 | yes — and it works | **DEVIATION on item 3**, ticketed SV-9006 |
| C29985 | yes — and it works | see below |
| C30004 | drags an EXISTING shift — no scope picker involved | see below |
| C30013 | **no drag at all** — it needs an open detail modal | **DEVIATION on item 4** |
| C30020 | drags an EXISTING event — no scope picker involved | see below |

---

## F1 · C29967 — tick-box mode: two of the four controls the spec asks for are absent

The picker was opened on **S8685-14158 · Brabay Maintenance, 27 lines · 67.7h**, dropped on
**Alicia Campbell · Thu, Aug 13**.

| Spec §4.3 asks for | Build | Verdict |
|---|---|---|
| tick boxes, one per line | **27 checkboxes**, `checkbox_line_picker_<lineId>` | PASS |
| running tally *"Create shift · 2 lines · 6h"* | `text_line_picker_tally` reads **`0 selected · 0h`** → **`2 selected · 4h`** after ticking two | present, **different wording** |
| a **"Select all"** shortcut | **absent** | **FAIL** |
| a **"Cancel"** returning to the single-tap list | **absent** | **FAIL** |

**The arithmetic is right** — the two ticked lines estimate 1.6h + 2.3h = 3.9h, shown as `4h`.

**Before calling the two absent, tick-box mode was proven entered** (27 checkboxes present) **and two
lines were ticked**, so both controls had something to act on. The only `All` control is
`button_line_picker_scope_all`, reading **`All 27`** — a filter between all lines and unscheduled
lines, beside `Unscheduled 0`. It ticks nothing.

**There is a way out of tick-box mode, and the case should say so**: pressing **`Select multiple`
again** toggles the boxes off (27 → 0) with the picker still open. But the button's label does not
change while you are in tick-box mode, so nothing on screen tells a tester that is the way back.

**Ticket: [SV-8886](https://shopview.atlassian.net/browse/SV-8886)** — Story Defect, parent SV-8689,
**In Progress**, and it describes exactly this, down to the tally wording. Nothing new to file.

## F2 · C29982 — there is no start-date control anywhere in the spread step

Spec §4.5: *"**Start date.** Defaults to the earliest working day. Adjusting it is how a second
technician's series can be made sequential (starting after the first) rather than parallel."*

**No such control exists.** The series always begins on the day dropped on. Before recording that,
**all five options of the "How much to schedule" selector were opened and chosen in turn** — including
the two the spec says reveal an extra control — because a field appearing only under a custom option
would otherwise read as missing:

| Option | Reveals | Start date? |
|---|---|---|
| `Full estimate (67h 44m)` (default) | nothing | no |
| `1 week` | nothing | no |
| `2 weeks` | nothing | no |
| `Until a date…` | **`Finish by`** + `Thu, Aug 13` with prev/next arrows | no — it bounds the **end** |
| `Specific hours…` | **`Hours`** stepper `− 9h +` | no |

The only date control in the dialog is `text_spread_until_date`, labelled **`Finish by`**.

**The selector itself matches the spec exactly** — three options apply immediately, two reveal a
control, which is the progressive disclosure §4.5 describes.

**Two tickets already cover this and BOTH ARE CLOSED WHILE THE DEFECT STILL REPRODUCES:**
**[SV-9090](https://shopview.atlassian.net/browse/SV-9090)** (10 Aug, *"Spread scheduling always begins
on the drop day"*) and **[SV-8855](https://shopview.atlassian.net/browse/SV-8855)** (4 Aug, ours) — both
**OBSOLETE / Done**. This is Standing Rule 61's exact case, so the case names the symptom and all three
outcomes rather than trusting either status.

## F3 · C29984 — the preview is right in two of three parts

Preview **collapsed**: `8 shifts · 67h 44m` and `Aug 13 to Aug 24 · 9h/day, Mon–Fri`.
Preview **expanded** (`button_spread_toggle_preview`): a genuine week-by-week breakdown —
`Week of Aug 13: Thu 13, Fri 14` · `Week of Aug 17: Mon 17, Tue 18, Wed 19, Thu 20, Fri 21` ·
`Week of Aug 24: Mon 24`.

**Item 3 fails: no skipped day is struck through, and no reason is given — the skipped days are simply
not listed at all.** The run spans Aug 13 → Aug 24 and therefore crosses **two** weekends (15–16 and
22–23); none of those four dates appears. The collapsed line's own `Mon–Fri` proves the build knows it
is skipping them.

Covered by **[SV-9006](https://shopview.atlassian.net/browse/SV-9006)** (open, QA Complete), whose
Actual Result says in terms: *"The preview does not strike Saturday through and gives no reason."*
**Honest limit: SV-9006's other half — Saturday being scheduled — did NOT reproduce here**, but this
was a different technician (Alicia Campbell, Mon–Fri), so that is not evidence against the ticket.

## F4 · C30013 — notes work, but they are kept PER SHIFT, not per work order

Driven on shift `6b12f567…` of **S-13014 · Fuline Enterprises**:

1. **Add** — `button_shift_detail_add_note` → `input_shift_detail_note` → confirm. **PASS.**
2. **Edit** — `button_shift_detail_note_edit`, text changed and redisplayed. **PASS.**
3. **Delete** — `button_shift_detail_note_delete` removes it immediately. **PASS.**
4. **Per work order** — **FAIL.** S-13014 has **18 shifts**; the note landed on **one**, and **0 of the
   other 17** carried it.

**The confirm control is an icon, `button_shift_detail_note_confirm`, not a button labelled Save.** A
text-only search for a save button finds nothing and would have reported "there is no way to save a
note" — a false absence, recorded here so the next pass does not repeat it.

**The first attempt at item 4 was wrong and is corrected here.** It picked a candidate pair of shifts
from the API and then opened whatever block was on screen, so it compared two shifts that never
received a note and concluded "same". The re-run adds the note first and then looks up **that** shift's
own work order — which is why the answer is now a measurement rather than a coincidence.

**No ticket covers this.** Prepared, not filed — the creation hold is active (Standing Rule 62).

---

## The estate

**The board is back to its baseline counts — 545 shifts / 49 events / 18 series — and the final diff
is TWO rows, not zero, and both are the same incident:** one shift REMOVED and one ADDED, because a
cleanup step deleted a pre-existing shift by matching on a customer name and it had to be recreated.
**Every field of the replacement matches the original except the id, which a delete destroys for
good.** Full account: `INCIDENT-accidental-delete-2026-08-12.md`. Snapshots `evidence/board-BEFORE.json`
→ `evidence/board-AFTER.json`; the mid-run snapshots show the board was clean before that point.

**Build byte-identical at the start and the end of the session** — `v3.5-65d6500`, etag
`3250d285…`, `index.html` sha256 `9348ca09…` both times, so nothing redeployed underneath this work.

**One piece of ZZAUTOTEST residue exists and it is NOT ours:** shift `0f1bec52-f420-4798-948d-16f1d43c9fda`
carries the note **`ZZAUTOTEST line one\nZZAUTOTEST line two`**. Its hash is **identical in the baseline
taken before this session touched anything**, so it predates us — left by an earlier pass. Reported,
not removed.

---

## F5 · C29985 — the spread creates exactly what it promised, but nothing offers an Undo

Confirming **`Create 8 shifts`** produced **exactly the eight days the preview named** — Aug 13, 14,
17, 18, 19, 20, 21, 24 — **all four weekend dates skipped**, all sharing **one `seriesId`**, and
7 × 540 min + 1 × 284 min = **4064 min = 67h 44m, the estimate to the minute**. Items 1 and 3 pass.
The grid carried `schedule_series_block`, `schedule_block_series_cue` and `schedule_block_series_after`
while the series existed, so item 2's banner is built, though it was not examined closely.

**Item 4 fails: no toast, no Undo.**

**One existing shift changed while the series existed** — `bb43d6a3-…` gained
`isConflict: true / double_booked`. That is a **derived** consequence of the new series double-booking
the same technician on Aug 14, not collateral damage: it reverted by itself when the series was
removed, and nothing was done to it. **Conflict detection demonstrably works.**

## F6 · C30004 — the snapping is right; the Undo is missing

A shift dragged sideways in Day view moved **02:30 → 05:15**: minute **15**, so it **snapped to the
quarter hour**, and the duration stayed **60 → 60**. Items 1, 2 and 3 pass. **Item 4 fails.**

## F7 · C30020 — the day move works; the technician move was not reachable from here

Dragging an event moved it **Aug 9 → Aug 10**, so item 2 passes. **Item 3 fails** — no toast.

**Item 1 was NOT observed, and that is a limit of ours, not a verdict on the product.** Two attempts
were made; one dropped +90 px and the staff id did not change, the other dropped +230 px and no move
registered at all. The lane rectangles could not be resolved from the DOM, so the drop was never
confirmed to land in a different technician's lane. **A person with a mouse will manage this in
seconds** — the case now asks the tester to do exactly that and report what they see.

## F8 · No toast and no Undo on three separate actions

Creating a series, moving a shift, moving an event. Polled every 350 ms for 11 s, and separately a
**`MutationObserver` over the whole document recorded 37 added nodes, 0 with a notification class and
0 containing "Undo"**. The specification asks for one on each of the three.

**No ticket covers this** — a JQL sweep of every SV issue whose summary mentions *undo* or *toast*
returns three unrelated items (work-order lines, timesheets, imports). **Prepared, not filed:** the
QA lead's *"create nothing until my next order"* hold is active (Standing Rule 62).

## F9 · The label sweep found one thing, and it was small

All 176 Schedule cases were swept against the labels this session actually read off
`v3.5-65d6500` — using the **computed text-transform**, not `textContent`, because these labels are
CSS-transformed and a `textContent` sweep reports the pre-transform string and would make correct
cases look wrong.

**Nine suspect patterns, 7 casing hits, and 6 of the 7 are ordinary prose** ("only approved work order
lines appear", "spreads the full estimate again"), not label references. **One was real:**
**[C29980](https://shopview.testrail.io/index.php?/cases/view/29980)** quoted the field as
`'finish by'` where the build shows **`Finish by`** (`transform: none`, so that is genuinely what the
tester sees). Corrected.

**Also checked and clean:** no case says a bare *"Create shifts"* where the button carries a count; no
case says *"Add note"* for **`Add Note`**; `Add Hours` already carries its capital H.

**The honest limit: this is not a full label re-check of the 162 unchecked cases.** It compares them
against the labels **this session could observe**, which is the scope picker, the spread step, the
shift modal and the staff/location editors. Anything outside those screens is untouched.

---

## OUTSTANDING — what I need from you

1. **Permission to file four defect tickets.** Each has been observed, written up and has ready-to-file
   text; none exists yet, and each is blocking one case from moving off `HOLD`:
   **(a)** no toast/Undo after creating a series, moving a shift, or moving an event — one ticket
   covers all three (C29985, C30004, C30020); **(b)** shift notes are kept **per shift**, not per work
   order (C30013). **Not created: your "do not create anything until my next order" hold is active,
   and Standing Rule 62 requires your permission per ask.**
2. **Whether to reopen [SV-9090](https://shopview.atlassian.net/browse/SV-9090) and
   [SV-8855](https://shopview.atlassian.net/browse/SV-8855).** Both are closed OBSOLETE and the missing
   start-date control **plainly still reproduces** — proven against all five options of the selector.
   The cases are honest either way, so this is a truth-and-tidiness call, not a blocker.
3. **A second sign-in as a non-administrator.** **13 of the 31 Schedule holds** are waiting on exactly
   this. Impersonation was deliberately not used.
4. **Two playbook notes I did not write myself** (`build/APP-ACTIONS-PLAYBOOK.md` is not mine to edit
   from this worker): the shift create/delete contract discovered by probing — the field is
   `total_minutes`, not `scheduled_minutes`, and `start_date` is a **local date** — and the fact that
   **deleting a shift from the detail modal asks nothing at all**.
5. **One thing you should know rather than be asked for.** A cleanup step of mine **deleted a
   pre-existing shift** by matching on a customer name where two shifts shared one. It was restored
   field-for-field and the board is back to baseline counts, but **the id could not be restored**. The
   full record is in `INCIDENT-accidental-delete-2026-08-12.md`.
6. **Someone else's ZZAUTOTEST residue is on the board** — shift `0f1bec52-…` carries the note
   `ZZAUTOTEST line one / ZZAUTOTEST line two`. Its hash is identical in the baseline taken **before**
   this session touched anything, so it predates us. Left alone.
