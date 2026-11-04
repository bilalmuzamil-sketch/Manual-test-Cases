# Parts Lifecycle — nine tests checked against PRD v36 and build v26.45.0-2c807b5 (4 Nov 2026)

QA lead, 4 Nov 2026: listed C154775 C154829 C573671 C847730 C154833 C425620 C839446 C425700 C839447 with PRD references; "if anything in the
PRD goes again the answers of Chris, I would suggest follow the answer of Chris, and see the PRD by yourself too, do not rely on my references".

- PRD now **v36** (Confluence 829227015, edited 3 Nov 2026 by Chris Ward, "QA answers"). Diff against v35 (v35-v36-requirement-diff.txt):
  only S6-R5, S11-R3c and S13-R19a changed; the rest of the diff is copy formatting (v35-v36-other-diff.txt). Change Log 2026-11-03:
  rulings on SV-12105, SV-12110, SV-12115.
- Chris Ward's rulings (Jira comments, 3 Nov 2026), read: SV-12105 "go with the number shown in the column. Total Qty sorts by the available
  quantity, on screen and on the printed count sheet"; SV-12110 "A part picked from the Part Library results is linked … Only a number typed
  in by hand with no link keeps its old number (S13-R19a)"; SV-12115 "a received work order line, an open vendor return and a credited return
  all keep Delete blocked". None conflicts with v36.
- Build: QA site now **v26.45.0-2c807b5** (= branch head SV-10647-parts-lifecycle). Contains the SV-12110/SV-12115 fix (337b5c69); no
  SV-12105 commit yet. Screens seen read-only (probes 32-35): Inventory search and Total Qty sort; Part Library entry page, Edit Library Part,
  disabled Delete (slightly paler red) with hover "Part cannot be deleted. Please delete related parts first."; enabled Delete and the
  Confirmation "Are you sure you want to delete this library part?"; Edit Inventory Part (Delete Part); New Purchase Order; Receive screen
  ("Receive Parts (1)"); Vendor Invoices and a vendor invoice page. Data survived the redeploy.
- apply9.py (write-log.txt, 9/9 verify=OK): quotes of S6-R5, S11-R3c, S13-R19a → v36 words; PRD version line → v36 (every PRD quote in each
  case checked word for word in v36); "dimmed" → "disabled" in C154829, C573671, C847730; C154775 gains Chris's SV-12105 ruling and a
  divergence sentence (the tech plan's "the SQL sorts on p.quantity" is superseded); stamp v26.45.0-2c807b5, 11/4/2026.
- Checks: tester-runnable PASS, runnable 9/9, display 9/9 fr-view.
