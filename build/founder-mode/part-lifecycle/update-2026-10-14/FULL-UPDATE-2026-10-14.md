# Part Lifecycle — update to PRD v29 and Product's answers, 14 Oct 2026 (Rule 122 full pass)

**Trigger:** the QA lead asked us (14 Oct) to look at Chris Ward's answers in the question doc
(https://docs.google.com/document/d/1pkAPGqWVTdtYorNN4SVNl9HkHxuuB9czro_y2DbUeEM/edit). Chris answered all 12 questions and
wrote them into the PRD (v27 → v29). Answers verbatim: `../po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md`.

## Sources
- PRD Confluence 829227015 **v29** (`../sources/CONFLUENCE-829227015-PartLifecycle-2026-10-14.md`): 302 codes — 12 added
  (S1-R9b, S5-E2, S5-E3, S7-N7–N10, S9-R10c, S9-N3a, S11-R3c, S12-R14a/b), 4 reworded (S9-E11, S10-R8, S11-R3, S12-R4), the
  dashboard removed, notes under S7-R6d, S7-N7, S7-N9; one new §8 row. `PRD-CHANGES.md`, `../SOURCE-CHECK-2026-10-14.md`.
  Re-checked unchanged immediately before the writes.
- Comments: none new. Jira: only SV-11041 changed (Critical Reorder checks removed). Design: re-read, all 53 files identical
  to 13 Oct. Tech plan: 7 Oct copy (unchanged).

## What was written (`applied/apply-log.jsonl`; every write read back and matched)
- **All 262 existing cases re-read in full against v29 and re-written** (Source line re-stamped to v29, every quote
  re-copied from the v29 anchor map). 52 changed in substance, for example: Export follows the search and filters; Delete in
  the "Edit Library Part" window; only "Part Library entry not found."; special-order results; the import rules ("Unassigned"
  bin, no duplicate check, blank number skips, blank description never empties); the two ways to get bins with no default;
  a core has no row of its own; canned-job warning A to Z; vendor-return role; "use it" for one part.
- **19 new cases, C573668–C573686** (added first, so each setup doc carries its case number): Export (3), disabled Delete
  with hover text, special-order results (3), default bin deleted, core has no row / core's own Part History (2), import
  rules (5), missing-manufacturer (pre-release data), canned-job warning order, vendor-return permissions (2).
- **Setup docs:** 224 cases keep their 13 Oct doc (content unchanged); 57 new docs (19 new + 38 changed). The 38 replaced
  docs: `docs/OLD-DOCS-TO-DELETE.md` (delete by hand).
- **Retire proposals (not applied):** C425659 and C425758 (dashboard inventory figure — removed from the PRD, Product
  answer 7); C425639, C425759 and C154761 stay in "Retire OR retest".
- **Coverage:** 302/302 codes (`COVERAGE-2026-10-14.md`). Label check 1,518 labels, misses all example data. Design text
  inventory: nothing that was in a case is lost; 203 of 663 design texts now in a case; 0 unclassified.
- **Test runs:** all 281 cases are in the newest open Nightly run, 539. No dedicated Part Lifecycle run (QA lead: "NO").

## Still open (no quotable source) — for the PO sheet after build verification
1. How does a user open a core's own Part History page (S5-E3)? Cases B-N3/C154838/C425691/C425769/C425777 mark it Blocked if no route is found.
2. Can an untracked part be saved with no bin in the dialog (C154770)?
3. Does an open "Edit Library Part" window refresh its Delete button without a reload (C425620)?
4. Is a part added by the import tracked (S7-N10)? Is the template's "name" column the description?
5. What does a user without the Vendor Order Management permissions see?
6. Bin Locations is under "Administration" in the PRD but "Settings" on screen.
7. SV-10380 "5 Available" for bins +5 and −2 (still from the ticket's own text).
