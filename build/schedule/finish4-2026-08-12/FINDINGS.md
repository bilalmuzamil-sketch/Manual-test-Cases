# Schedule finish4 — findings

**Build `v3.5-65d6500`**, unmoved. **18 cases walked. 15 written. Run 357 untouched.**

## 1 · The killed pass lost nothing

The finish3 worker died **during its write-up, not during its writes**. All 19 of its
`update_case` operations were verified **landed by content** — each case re-read live and searched
for the exact text the operation claimed to leave behind, in both directions where a change was
claimed. The 9 walked cases it did not write already carried the correct stamp. One untracked file
was recovered and committed before any other work began. Full account: `RECOVERY.md`.

## 2 · The drag works, and so does everything the "drag-dependent" label was blocking

Three separate things had been reported over this project as unreachable by our tooling. **None of
them was.**

- **A series shift could not be opened.** It could: the id first targeted simply is not among the
  blocks the grid renders, and the one that *is* rendered sits at **y = 1371 in a 1080-tall
  viewport**, so the coordinate click fell outside the window.
- **The reassign drag.** It completed first try once the block was scrolled into view, and raised
  **"Move this shift to Lisa Stewart on Wed, Aug 12?"**.
- **The resize handles.** They exist — `fc-event-resizer-start`, `cursor: w-resize` — and were only
  invisible to a probe that never hovered the edge.

**That last one is the one to keep.** It would have been a false defect report, on a **final**
branch, the **day before release**, and it would have looked entirely credible: a clean probe, a
clear absence, a case that plainly asks for a control the DOM does not show. **Three false absences
were caught this pass by the same discipline — state what makes the current state one where the
thing should appear, before calling it missing.** All four are tabulated in `DIVERGENCES.md` §3.

## 3 · No substantive divergence

Not one of the 18 walked cases sends a tester somewhere the build does not have. One **cosmetic**
difference is logged (the staff-row edit control is an `edit_note` icon where three cases say
*"the pencil"*) and deliberately not escalated, because a reader of the source would recognise it.

## 4 · Undo restores the SAME shift, and that is worth knowing

`POST /api/schedule/shifts/restore` brought back shift `e35d37ef…` **under its own id**. A
delete-and-recreate mints a **new** id — which is exactly why the 12 August accidental deletion
could not be fully undone. Undo is a genuine restore, not a re-create.

## 5 · The delete scope dialog is well built

Three scopes, each quantifying what it returns: *"This shift only returns 9h"*, *"This and all later
shifts returns 14h 30m"*, *"Entire series (4 shifts) returns 32h 30m"*. Driving the third took
technician A's series **4 → 0** while technician B's independent series on the **same work order**
stayed at **2** — the per-technician scoping C30060 asserts.

## 6 · Four cases are blocked by a scope rule, not by the product

**C29971, C30080, C30083, C38870** each need a **role, staff or settings** change, which this pass
was instructed not to make (such edits have killed sessions on this estate — the Technician session
was lost that way and never returned). They are unwalked for a **scope** reason and are reported as
such, not as product gaps.

## 7 · Observed in passing, reported and not acted on

**C29962's provenance cites the specification at §7 and §11** — the *toast* and *undo* anchors —
on a case about a **click-to-arm alternative to dragging**. It may be a mis-set anchor. It was
**not** changed: this pass was chartered to re-stamp sentence 2 only, and sentence 1 is a
traceability question for a pass that is authorised to touch it.

## Outstanding — what I need from you

The three items in `COMPLETION-REPORT.md`: **permission for a role/staff/settings change** (unblocks
four of the nine remaining), **the unfiled Story Defects** (chiefly the missing Unassigned row), and
**SV-9005, which can be closed**.
