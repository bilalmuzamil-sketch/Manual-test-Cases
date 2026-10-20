# SV-11498 + SV-11454 — locked work orders on Board/Tech View (staging, 20 Oct 2026)

Build `v26.40.20-9c75418` throughout; Admin; 1440x900 dpr 2. PRD 845185030 **v68**: S4-N6 now words the note
"Invoiced · can't be reassigned" / "Paid · can't be reassigned" (Chris ruling 19 Oct). The build still shows the old
sentence — already raised as **SV-11545 (Open)**, so not counted against either ticket.

## SV-11498 (keyboard note on disabled Reassign) — PASSED, comment 79108
`sv11498.mjs <WO> <view> <tag>`: click Search, then only Tab/Enter/ArrowDown; reads `document.activeElement` + visible `.q-tooltip`.
| Cell | Result |
|---|---|
| Board, Invoiced S2-37313 (lead ZA) | focus Reassign → note; focus Unassign → note; Enter on item → no dialog; mouse hover same note |
| Board, Paid S2-16688 (lead Brandi Smith) | same |
| Board, Paid S2-33692 (Unassigned column) | same (menu shows only Reassign) |
| Tech View, S2-37313 and S2-16688 | same |
Note sits directly below the focused item (rects in `ev/b-37313.json`).
Side observation: an Unassigned card's menu says "Reassign lead technician", not "Assign" (S3-R14) — already tracked
in SV-11524 / SV-11522 (test case C682422). Bucket (b), nothing filed.
Lock-icon hover read no tooltip in my probe (selector may be wrong); not in this ticket's scope; SV-11545 covers the lock text.

## SV-11454 (refused move leaves locked card reading Approved) — PASSED, comment 79109
`sv11454.mjs <view> <tag>` (PAID=1 for paid): seeds a fresh Approved WO (customer ZZAUTOTEST F3 Keyboard Limits 47469
Bravo Co, canned line HD CVIP electric brake trailer via `create-from-canned-line`), drags it from Unassigned to Brandi
Smith (lead set, toast "Lead technician updated"), then a second tab completes + invoices (+ pays) via API, then page A
(not reloaded) drags to another technician.
| Cell | WO | After refused move |
|---|---|---|
| Board, Invoiced | S2-37623 | alert S4-N8 + status sentence; card "Invoiced" + lock, stays BS column; same at +15 s; lead unchanged |
| Tech View, Invoiced | S2-37625 | row "Invoiced" + lock, stays BS group; lead unchanged |
| Board, Paid ($406.09 cash) | S2-37627 | card "Paid" + lock; lead unchanged |
Before the drag the card still read Approved (page A not refreshed) — expected; it updates on the refused move.
Leftovers on staging (test data, ZZAUTOTEST customer): S2-37620 (Approved, unused), S2-37623/37625 Invoiced, S2-37627 Paid.
A wrong-vehicle WO from a bad lookup (f6da3079…) was deleted.

## Exhibits
`sv11498-01-keyboard-note-before-after.png` (before = ticket picture), `sv11454-01-refused-move-before-after.png`
(before = ticket picture), `sv11454-02-paid-and-tech-view.png`; `build.py`.

## Gate
Build marker re-read, both tickets TESTING STAGE with 0 comments, PRD v68, text scanned. Read back: panel first,
media in order, tables 7 and 5 rows. No recording / no technical section.
