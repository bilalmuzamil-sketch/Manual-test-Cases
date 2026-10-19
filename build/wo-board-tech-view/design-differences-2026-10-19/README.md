# WO Board and Tech View: design vs PRD v66, every difference (19 Oct 2026, Rule 130)

- Inputs: design export of 14 Oct 2026 (all three boards), its flow drive (`../design-drive-2026-10-14/FLOWS-2026-10-14.md`, read in full),
  the 14 Oct triage table, PRD v66 (`../sv11522-11524-2026-10-19/CONFLUENCE-845185030-v66-2026-10-19.md`), Chris Ward's answers 1–33.
- Result: 16 open differences (`differences.py`), 7 already ruled, 10 PRD states the design does not draw (DESIGN-SILENT). Register:
  `../DESIGN-DIVERGENCE-REGISTER.json`; check: `spec_to_design_check.py` exits 1 until the sheet is sent (7 word rows stay open).
- Question sheet for Chris Ward (18 rows), shared with chris.w@shopview.com as editor on 19 Oct 2026 (QA lead's order):
  https://docs.google.com/spreadsheets/d/1coGNz1ZNj1GiFA4rS7pt9nwKsNgE8bCLpuutygK4iQs (read back 19 Oct 2026, all rows as written).
- Held design-version cases (QA lead, 19 Oct 2026: "Yes and permanent"), section 73780, not in run 498, marker
  `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO`: C682429 (D01), C682430 (D02–D05), C682431 (D06–D09),
  C682432 (D10), C682433 (D11–D12), C682434 (D13), C682435 (D14–D15), C682436 (D16). Each read back.
- When Chris answers: design wins → release the held case (marker, PRD quote) and change the PRD-following cases; PRD wins → delete the
  held case with the QA lead's go-ahead; register row → PO-RULED with his words and date.
