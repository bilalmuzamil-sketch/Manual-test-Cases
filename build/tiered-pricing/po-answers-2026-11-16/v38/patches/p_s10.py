import sys; sys.path.insert(0, 'po-answers-2026-11-16/v38/patches'); from _p import patch
patch('authoring/cases_s10.py', [
('''"""Story 10 — How a part is priced (SV-11699), PRD v37 S10 rows, design page 10 (10.1-10.12), tech-plan rows TPX-01 (held on Q24), TPX-06,
TPX-08. Batch B, phase 2, 14 Nov 2026.''',
 '''"""Story 10 — How a part is priced (SV-11699), PRD S10 rows (v38 since 16 Nov 2026), design page 10 (10.1-10.12), tech-plan rows TPX-01, TPX-06,
TPX-08. Batch B, phase 2, 14 Nov 2026. 16 Nov 2026: Matt Barge's answer 24 and PRD v38 S10-R14 (a line added to a work order whose invoice is
sent or paid goes on a new work order, priced by the customer's current tier): S10-39 rewritten and released.'''),
('''C("S10-39", K, "A reopened paid work order prices new parts by its kept tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), WO("1", "A", ", invoiced and paid in full"), DESK],
  [ "Put customer A on tier B for work orders in Edit Customer.", OPENWO(), ADDP()],
  [R(S("S9-R7"), "Customer A is saved on tier B."), R(S("S10-R14"), "Work order 1 opens again for the new part."),
   R(S("S10-R14", "A work order or Part Sale keeps the tier its customer had for that channel when it was made"),
     "The new part fills in at $121.50, the tier A price the work order kept ($135.00 × 0.90 = $121.50).")
   + R(QT("reopened paid work order takes the current tier", "TPX-01"),
       "Not tier B's $108.00, the price engineering's plan gives (the question to the PO decides which is right).")],
  pics=WO_PICS, held_on="Q24", flags=["numbers"])''',
 '''C("S10-39", K, "A part added to a paid work order goes on a new one at the current tier",
  [WOA, MX(), TR(), TR("B", "A", "% Off 20"), CU(), WO("1", "A", ", invoiced and paid in full"), DESK],
  [ "Put customer A on tier B for work orders in Edit Customer.", OPENWO(), ADDP(), OPENWO()],
  [R(S("S9-R7"), "Customer A is saved on tier B."), R(S("S10-R14"), "Work order 1 opens, its invoice paid."),
   R(S("S10-R14", "Adding a line to a work order whose invoice is sent or paid puts it on a new work order, as today."),
     "The part is put on a new work order for customer A, with its own work order number, not on work order 1.")
   + R([S("S10-R14", "That work order is new, so its parts are priced by the customer's current tier."), QT("reopened paid work order takes the current tier", "TPX-01")],
       "The new part's sell price is $108.00, tier B's price, customer A's current tier ($135.00 × 0.80 = $108.00).",
       "It is not $121.50, the tier A price work order 1 kept ($135.00 × 0.90 = $121.50)."),
   R(S("S10-R14", "Adding a line to a work order whose invoice is sent or paid puts it on a new work order, as today."),
     "Work order 1 opens with its own lines and paid invoice as before, without the new part.")],
  pics=WO_PICS, flags=["numbers"])'''),
])
patch('authoring/verdicts_batch_b.py', [
('''HELD = {
 "TPX-01": "Q24",
}''', '''HELD = {
}   # 16 Nov 2026: TPX-01 released (Matt Barge's answer 24 agrees with the plan; PRD v38 S10-R14; cited by S10-39)'''),
('''"Sales by Tier columns when a row and a customer open (20.2 vs 20.3, 20.4; held on Q31)"''', '''"Sales by Tier columns when a row and a customer open (20.2 vs 20.3, 20.4; S19-R24 v38)"'''),
('''"Sales by Tier headings on the empty states (20.2 vs 20.11, 20.21-20.23; held on Q31)"''', '''"Sales by Tier headings on the empty states (20.2 vs 20.11, 20.21-20.23; S19-R24 v38)"'''),
('''"Sales by Category columns when a category opens (20.16 vs 20.17; held on Q31)"''', '''"Sales by Category columns when a category opens (20.16 vs 20.17; S19-R24 v38)"'''),
('''"work order lines table while Quick Add is open (10.5 vs 10.6, 10.7, 10.9; held on Q31)"''', '''"work order lines table while Quick Add is open (10.5 vs 10.6, 10.7, 10.9; S19-R24 v38)"'''),
('''"report filter chips when a chip widens (20.2 vs 20.9; held on Q31)"''', '''"report filter chips when a chip widens (20.2 vs 20.9; S19-R24 v38)"'''),
])
patch('authoring/verdicts_batch_a.py', [
('''"Manage Customers columns on search (9.12, 9.13 vs 9.4; held on Q31)"''', '''"Manage Customers columns on search (9.12, 9.13 vs 9.4; S19-R24 v38)"'''),
])
patch('authoring/verdicts.py', [
('''"simulator columns between view and edit (3.5 vs 3.25; held on Q31)"''', '''"simulator columns between view and edit (3.5 vs 3.25; S19-R24 v38)"'''),
('''"New Matrix category list pushing the grid (3.22 vs 3.23; held on Q31)"''', '''"New Matrix category list pushing the grid (3.22 vs 3.23; S19-R24 v38)"'''),
(''' "TP-S3-R13": "Picker, search, Select all, \\"Now: <matrix>\\", Uncategorized not listed and the move on save are checked; WHEN the move happens on an existing matrix (on save vs when the picker closes) is held on Q6.",''',
 ''' "TP-S3-R13": ("Picker, search, Select all, \\"Now: <matrix>\\", Uncategorized not listed, the line changing only in Edit (S3-46), the price moving only "
               "on Save (S3-17, S3-18) and Cancel putting the line back (S3-47) are checked (PRD v38, answer 6); what a category's own page names "
               "as its matrix between the pick and Save is asked as question 32 (no case holds on it: the check is added when answered)."),'''),
])
