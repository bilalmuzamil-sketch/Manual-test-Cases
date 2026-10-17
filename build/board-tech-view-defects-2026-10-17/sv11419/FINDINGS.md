# SV-11419 — QA result (17 October 2026)

- Verdict: **PASSED** — Jira comment 78929.
- Environment: staging v26.40.19-754919e, Admin, window 1440 x 900.
- Spec v64: S11-R9, S4-R26, S4-N2, S9-R14; Chris Ward 2026-10-16 (red, x icon, only with a lead, disabled when locked; initial sort on Unassign).

## Matrix
| Case | View | Result |
|---|---|---|
| Lead set (S2-35490, Esther Howard) | Board + Tech | Reassign + Unassign (red rgb(180,35,24), x icon) |
| Keyboard ArrowDown/Enter | Tech (film), Board (s11g) | focus reaches menu_item_unassign_lead_technician; Enter opens prompt |
| Prompt | both | "Clear Esther Howard's scheduled shifts?" Cancel / Keep Shifts / Clear Shifts; Escape → no change (s11f) |
| Keep Shifts | both | toast "Lead technician removed", lead null, shift 5f90b248 unchanged (start/end identical) |
| Unassigned position | Board (s11i) | S2-35490 7th of 13 in Unassigned, not bottom |
| Invoiced S2-36630 (Aaron Baker) | Board + Tech | both items disabled (x19b) |
| Paid S2-15322 | Board + Tech | both items disabled (d10j, x19) |
| No lead S2-17495 | Board + Tech | only Reassign |

Restore: S2-35490 lead put back to Esther Howard after each run (`POST /api/work-orders/{id}/board-move {technicianId}` → 200; shift intact).

## For the QA lead (asked separately, not in the comment)
After a keyboard Unassign on Board View, focus moves to the old lead's column header although the column still has cards (s11g: focus `board_column_header_<id>` "EH Esther Howard 8 8 work orders"). S11-E1 concern; SV-10230 is the general keyboard-focus task.

## Evidence / gate
`ev/x19*`, `ev/s11*.json`, `ev/d10j.json`, exhibit `ev/sv11419-01-unassign.png`, film + `voiceover/`. Scripts `../scripts/x19.mjs`, `x19b.mjs`, `VR19b.mjs`, `ex_unassign.py`. Gate: build marker re-read, ticket TESTING STAGE (last comment Chris 10:17 16 Oct), PRD v64, voice scan clean, no technical section, read back 8 table rows + 2 media.
