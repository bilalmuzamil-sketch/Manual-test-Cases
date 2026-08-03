#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""THE EDIT PLAN for the six verifier findings (2026-08-03).

Every entry gives the FINAL value of each changed field. Fields absent = unchanged.
`why` is copied verbatim into the per-operation audit log.
`reverified` records the Rule-41 whole-case re-read: the spec + version it was
re-read against, and any SECOND FINDING the re-read produced.

Spec source of truth for this pass: build/report-suite/spec-current-2026-07-31/
*-current.md  (SBC v12 / SBR v15 / PV v4 / TU v5 / WIP v6 / IV v3, all 2026-07-29).
SBC CAVEAT: the live Confluence SBC page was modified 2026-07-31 and our mirror is
2 days behind (VERIFICATION-2026-08-03.md §12). Every SBC anchor added below was
re-verified in the mirror we hold; the pin therefore records exactly what we
verified against, which is what makes the next SBC bump re-surface these cases.
"""

SPECV = {
    'SBC': 'SBC spec v12 2026-07-29', 'SBR': 'SBR spec v15 2026-07-29',
    'PV': 'PV spec v4 2026-07-29', 'TU': 'TU spec v5 2026-07-29',
    'WIP': 'WIP spec v6 2026-07-29', 'IV': 'IV spec v3 2026-07-29',
}

NEVER_TOUCH = {30327, 30391, 38919, 38920, 38921, 38922, 38923}

PLAN = {}


def op(cid, group, why, reverified, **fields):
    assert cid not in PLAN, cid
    assert cid not in NEVER_TOUCH, f'C{cid} is out of bounds for this pass'
    PLAN[cid] = dict(group=group, why=why, reverified=reverified, fields=fields)


# ─────────────────────────────────────────────────────────────────────────────
# GROUP A — V-3 (HIGH): the export case asserts the "Locations:" line but its
# refs never cites the requirement that GOVERNS the export surface. That missing
# link is the exact mechanism by which SBR S14-R20 slipped past us on 2026-07-29.
# ─────────────────────────────────────────────────────────────────────────────
op(30167, 'A/V-3',
   'Adds SBC S4-R13 (suite export rule) AND S15-R14 (the PDF-header "Locations:" '
   'line, the anchor that most directly governs this case) so a change to either '
   're-surfaces C30167. Both verified verbatim in the current SBC mirror.',
   'Re-verified whole against SBC spec v12 2026-07-29 (spec-current-2026-07-31/'
   'Sales-By-Customer-Report-current.md): title, preconditions, steps, expected 1-4, '
   'refs, notes. S15-R7 (A4 landscape/25px), S15-R8..R11 and S15-R14 all resolve; '
   'expected 1-4 match them. SECOND FINDING: the precise governing anchor S15-R14 '
   '("The header shows a \'Locations:\' line ... (S4-R13)", L623) was never cited - '
   'added alongside S4-R13.',
   refs='SV-8613 (SBC spec v12 2026-07-29 Story 15 S15-R7; S15-R8; S15-R9; S15-R10; '
        'S15-R11; S15-R14 + Story 4 S4-R13 — PDF header block; S15-R14/S4-R13 = the '
        '"Locations:" line in every export [Chris Ward 2026-07-29, newest-wins])')

op(30277, 'A/V-3',
   'Adds SBR S14-R20 — the requirement that governs the "Locations:" line and the '
   'Location column in all four exports. Verified verbatim at L566.',
   'Re-verified whole against SBR spec v15 2026-07-29: title, preconditions 1-4, steps 1-3, '
   'expected 1-5, refs, notes. S14-R2/S14-R2a (active order, server-generated), S21-R6 '
   '(exports respect the location filter), S22-R4 (Unassigned pinned top) all resolve and '
   'match expected 1-4. No second finding.',
   refs='SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R2; S14-R2a; S14-R20 + Story 21 '
        'S21-R6 + Story 22 S22-R4 — all four downloads honour the filters, the full result '
        'set and the active order; S14-R20 = the "Locations:" line in every export)')

op(30376, 'A/V-3',
   'Adds PV S6-R11 (the export Location column + "Locations:" line) and replaces the '
   'un-versioned "specs/parts-velocity.md" path with the version-pinned spec token.',
   'Re-verified whole against PV spec v4 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-3, refs, notes. S6-R2 (L445) closes the filter list the case checks and '
   'S6-R11 (L463) governs expected 3. No second finding.',
   refs='SV-8646 (PV spec v4 2026-07-29 S6-R2; S6-R11; §3 Key Decisions — both exports '
        'reflect the filters and search active at export time; S6-R11 = the "Locations:" '
        'line in both exports [Chris Ward 2026-07-29, newest-wins])')

op(30437, 'A/V-3',
   'Adds TU S7-R13. Also adds the plain tester line for the automatic Location column: '
   'expected 5 says the download mirrors "the columns currently shown", but Location is '
   'NOT in the Column Selection control (S9-R9/S7-R13) — a tester with two locations in '
   'scope would otherwise fail a correct build over an extra column.',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-5, '
   'expected 1-5, refs, notes. S7-R8 (only selected technicians + selected locations), '
   'S7-R9, S7-R10 (downloads mirror the shown columns), S7-E1 (all selected), S9-R8 (both '
   'PDFs + CSV cover the selected locations) all resolve. SECOND FINDING: expected 5\'s '
   '"mirrors the columns currently shown" collided with the automatic Location column, '
   'which no tester turns on — plain conditional line added.',
   refs='SV-8654 (TU spec v5 2026-07-29 S7-R8; S7-R9; S7-R10; S7-R13; S7-E1; S9-R8 — '
        'downloads mirror the shown columns and the technician/location/date scope; '
        'S7-R13 = the "Locations:" line and the automatic Location column)',
   expected=[
     "1. Every download includes ONLY the technicians currently selected in the technician filter - the deselected technician is absent from all three files.",
     "2. Every download covers the location(s) currently selected in the location filter and the date range currently active on the report.",
     "3. With every technician selected, the download covers all technicians for the range at the selected location(s).",
     '4. Every download (each PDF and the CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).',
     "5. Every download also mirrors the columns currently shown on screen — a column hidden in the Column Selection control is absent from the files, and a re-shown column comes back.",
     "6. Note for the tester: when you have more than one location in scope, the files also carry a Location column even though it is not in the Column Selection control. That is correct - it appears by itself. With a single location in scope there is no Location column, and that is also correct.",
   ])

op(30511, 'A/V-3',
   'The verifier asked for WIP S7-R13. Re-derived: the anchor that governs the export '
   '"Locations:" line is S9-R10a, which this case ALREADY cited - so the V-3 row was '
   'already half-satisfied. S7-R13 + S9-E1 are added because they govern the automatic '
   'Location column and its "Branch" export heading, which expected 1 needed a '
   'conditional for. Plain tester line added.',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-5, '
   'expected 1-4, refs, notes. S9-R2/R3/R4 and S9-R10a all resolve and match expected 1-4. '
   'SECOND FINDING (and a correction to the verifier): S7-R13 (L348) is the ON-SCREEN '
   'auto-visibility rule; the EXPORT rule is S9-R10a (L414) plus the "Branch" heading '
   'S9-E1 (L420). Expected 1\'s "only the columns currently shown" collided with the '
   'automatic Branch column — plain conditional line added.',
   refs='SV-8665 (WIP spec v6 2026-07-29 Story 9 S9-R2; S9-R3; S9-R4; S9-R10a + Story 7 '
        'S7-R13; S9-E1 — downloads mirror the shown columns, the filters and the Totals '
        'row; S9-R10a = the "Locations:" line; S7-R13/S9-E1 = the automatic "Branch" column)',
   expected=[
     "1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last.",
     "2. Both downloads honor the current date range and location filter, and include only the jobs left visible by the advisor, customer, and asset filters.",
     "3. Both downloads include a Totals row matching the on-screen Totals row for the tab.",
     '4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).',
     '5. Note for the tester: when you have more than one location in scope, the files also carry the location column even though you cannot turn it on or off - and in the file it is headed "Branch", not "Location". Both of those are correct. With a single location in scope there is no such column, and that is also correct.',
   ])

op(30588, 'A/V-3',
   'Adds IV S10-R15 (the export Location column + "Locations:" line) and replaces the '
   'un-versioned "specs/inventory-value.md" path with the version-pinned spec token. '
   'Plain tester line added for the automatic Location column vs expected 1.',
   'Re-verified whole against IV spec v3 2026-07-29: title, preconditions 1-2, steps 1-5, '
   'expected 1-4, refs, notes. S10-R3 (only the columns currently shown, Total Cost last), '
   'S10-R4, S10-R5, S10-R6 (Totals row) and S10-R15 all resolve. SECOND FINDING: expected 1 '
   'closed the column set while S7-R6/S10-R15 insert Location automatically between Vendor '
   'and Qty on Hand — plain conditional line added.',
   refs='SV-8677 (IV spec v3 2026-07-29 Story 10 S10-R3; S10-R4; S10-R5; S10-R6; S10-R15 — '
        'downloads keep the shown columns and order, honour the filters and include the '
        'Totals row; S10-R15 = the "Locations:" line and the automatic Location column)',
   expected=[
     "1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last.",
     "2. Both downloads honor the current date, category, vendor, location, and part-search filters, and apply the current sort.",
     '3. Both downloads include a totals row labeled "Totals" matching the on-screen totals (the full-filtered-set totals).',
     '4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).',
     "5. Note for the tester: when you have more than one location in scope, the files also carry a Location column (between Vendor and Qty on Hand) even though it is not in the column-selection control. That is correct - it appears by itself. With a single location in scope there is no Location column, and that is also correct.",
   ])

# ─────────────────────────────────────────────────────────────────────────────
# GROUP B — V-2 (LOW): slash shorthand hides 5 anchors from every anchor-based tool.
# ─────────────────────────────────────────────────────────────────────────────
op(38856, 'B/V-2',
   'Expands the slash shorthand "S14-R1/R2/R4" and "S15-R1/R2/R4/R5" into full, '
   'greppable anchors. Before this change S14-R2, S14-R4, S15-R2, S15-R4 and S15-R5 '
   'were invisible to any anchor-based re-check — C38856 was the only case in the '
   'suite writing refs this way.',
   'Re-verified whole against SBC spec v12 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-5, refs, notes. All eight anchors resolve (S14-R1 L556, S14-R2 L557, '
   'S14-R4, S15-R1 L607, S15-R2 L608, S15-R4, S15-R5, S4-R13 L231). Expected 5 is already '
   'scope-conditional ("With a single location in scope ..."), so no Rule-42 rewrite is '
   'needed. No second finding.',
   refs='SV-8612; SV-8613; SV-8603 (SBC spec v12 2026-07-29 S14-R1; S14-R2; S14-R4; S15-R1; '
        'S15-R2; S15-R4; S15-R5; S4-R13 — the four-item Summary/Expanded menu, the Summary '
        'column list, and the automatic Location column in every export)')

# ─────────────────────────────────────────────────────────────────────────────
# GROUP C — V-10 (HIGH), Rule 42: closed enumerations with no version-pinned anchor.
# Treatment (b) in every case below: the closed list IS the requirement (each spec
# line quoted in `reverified` closes it in the spec's own words), so the list stays
# and the refs is pinned to the governing anchor + spec version, saying so.
# Treatment (a) was applied on 2026-07-31 to the cases where the spec makes the list
# conditional (C30161, C30285, C30286, C30352, C30401, C30551, C38856) - those are
# already scope-conditional and are left alone.
# ─────────────────────────────────────────────────────────────────────────────
op(30102, 'C/V-10',
   'Pins the closed eleven-option list to SBC S2-R2 + spec version. The spec closes '
   'the list itself, so the enumeration stays (Rule 42(b)).',
   'Re-verified whole against SBC spec v12 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-3, refs. S2-R2 verbatim L152: "The picker offers eleven options, in this '
   'order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, '
   'Last Year, This Quarter, Last Quarter, Custom." The case matches exactly. No second '
   'finding.',
   refs='SV-8601 (SBC spec v12 2026-07-29 Story 2 S2-R1; S2-R2 — S2-R2 CLOSES the list '
        'itself ("offers eleven options, in this order: ..."), so the closed list IS the '
        'requirement; re-check this case whenever S2-R2 changes)')

op(30107, 'C/V-10',
   'Pins the closed three-option list to SBC S3-R2 + spec version (Rule 42(b)).',
   'Re-verified whole against SBC spec v12 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-5, refs. S3-R2 verbatim L188: "The dropdown offers exactly three options, in '
   'this order: \\"Parts & Service,\\" \\"Parts only,\\" \\"Service only.\\"" S3-R3..R6 match '
   'expected 2-4; expected 5 (whole-invoice classification by prefix) matches S3-R5/R6. '
   'No second finding.',
   refs='SV-8602 (SBC spec v12 2026-07-29 Story 3 S3-R1; S3-R2; S3-R3; S3-R4; S3-R5; S3-R6 '
        '— S3-R2 CLOSES the list itself ("exactly three options, in this order"), so the '
        'closed list IS the requirement; re-check whenever S3-R2 changes)')

op(30149, 'C/V-10',
   'Pins the closed financial-column list/order to SBC §2 + S7-R6 + spec version, and '
   'records that Location is NOT a financial column so the enumeration is unaffected by '
   'the automatic Location column (S4-R12 / S20-R19).',
   'Re-verified whole against SBC spec v12 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-4, refs. §2 L38 verbatim: "The report shows these financial columns, in this '
   'order: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop '
   'Supplies, Margin, and Margin %."; S7-R6 L298 repeats the set and adds Subtotal; S11-R1 '
   'L463 pins Subtotal rightmost. SECOND FINDING: checked whether the automatic Location '
   'column could invalidate this list - it cannot; S20-R19 places Location with the '
   'IDENTIFIER columns immediately after Date, outside the financial block.',
   refs='SV-8605 (SBC spec v12 2026-07-29 §2; §4 Terminology; Story 7 S7-R6; Story 11 S11-R1 '
        '— §2/S7-R6 CLOSE the financial-column list and its order, so the closed list IS '
        'the requirement; Location is an identifier column, not a financial one [S4-R12; '
        'S20-R19], so it does not enter this list)')

op(30156, 'C/V-10',
   'Pins the closed nine-toggle list to SBC S13-R4 + spec version, and adds the plain '
   'tester line that Location is not in the panel because it appears automatically — '
   'otherwise a tester with two locations in scope could fail a correct build.',
   'Re-verified whole against SBC spec v12 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-4, refs. S13-R4 verbatim L528: "The nine toggleable columns are, in order: '
   'Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop '
   'Supplies, Margin, Margin %." S13-R1/R2/R3/R7 match expected 1-4. SECOND FINDING: the '
   'panel list and the automatic Location column (S4-R12) can confuse a layman - plain '
   'line added.',
   refs='SV-8611 (SBC spec v12 2026-07-29 Story 13 S13-R1; S13-R2; S13-R3; S13-R4; S13-R7 '
        '— S13-R4 CLOSES the list itself ("The nine toggleable columns are, in order"), so '
        'the closed list IS the requirement; Location is automatic and never a toggle '
        '[S4-R12; S4-R13])',
   expected=[
     "1. The column selector is a separate control next to the overflow menu — it is not an item inside the overflow menu.",
     '2. Hovering it shows the tooltip "Column Selection."',
     "3. The panel lists nine toggles, in order: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %.",
     "4. With no saved selection, all nine toggleable columns default to visible.",
     "5. Note for the tester: there is no Location toggle in this panel. That is correct - the Location column appears by itself when you have more than one location in scope, so it is never something you switch on here.",
   ])

op(30159, 'C/V-10',
   'Pins the closed four-item menu + its verbatim labels to SBC S14-R1/R2 + S15-R1/R2 + '
   'spec version. The refs previously carried only a message date, not a spec version.',
   'Re-verified whole against SBC spec v12 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-3, refs. S14-R1 L556 + S14-R2 L557 + S15-R1 L607 + S15-R2 L608 close the '
   'four items and their verbatim labels; S20-R16 L774 pins the menu leftmost in the action '
   'area. "Print" absence is the Chris Ward 2026-07-29 ruling (newest-wins) and is retained. '
   'No second finding.',
   refs='SV-8612; SV-8613 (SBC spec v12 2026-07-29 S14-R1; S14-R2; S15-R1; S15-R2; S20-R16 '
        '— these CLOSE the four-item menu and its verbatim labels, so the closed list IS '
        'the requirement; menu reshaped + "Print" removed per Chris Ward 2026-07-29 '
        '[newest-wins])')

op(30206, 'C/V-10',
   'Pins the closed three-option list to SBR S3-R2 + spec version (Rule 42(b)).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-5, refs. S3-R2 verbatim L201: "The dropdown offers exactly three options: '
   '\\"Parts & Service,\\" \\"Parts only,\\" \\"Service only.\\"" S3-R3..R7 match expected 1-5. '
   'No second finding.',
   refs='SV-8621 (SBR spec v15 2026-07-29 Story 3 S3-R1; S3-R2; S3-R3; S3-R4; S3-R5; S3-R6; '
        'S3-R7 — S3-R2 CLOSES the list itself ("exactly three options"), so the closed list '
        'IS the requirement; re-check whenever S3-R2 changes)')

op(30208, 'C/V-10',
   'Pins the closed four-option list to SBR S4-R2 + spec version (Rule 42(b)).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-4, refs. S4-R2 verbatim L230: "The dropdown offers exactly four options: '
   '\\"All Statuses,\\" \\"Unpaid,\\" \\"Partially Paid,\\" \\"Paid.\\"" S4-R1/R3/R5 match '
   'expected 1/3/4. No second finding.',
   refs='SV-8622 (SBR spec v15 2026-07-29 Story 4 S4-R1; S4-R2; S4-R3; S4-R5 — S4-R2 CLOSES '
        'the list itself ("exactly four options"), so the closed list IS the requirement; '
        're-check whenever S4-R2 changes)')

op(30234, 'C/V-10',
   'Pins the closed money-label list to SBR S5-R2 (the authoritative left-to-right column '
   'order) + spec version, and upgrades the ticket from the epic to the owning story '
   'SV-8623 for S5-R2 (Rule 20 per-story precision).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-4, refs. SECOND FINDING: the refs cited only "§3 definitions; §4 '
   'Terminology" and the epic SV-8582, calling the case "CROSS-CUTTING ... with no single '
   'owning story" - but S5-R2 L259 IS the owning requirement and states verbatim: "The '
   'columns appear left-to-right: Date, Invoice, Customer, Status, Inv. Hrs, Labor '
   'Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. '
   '(12 columns ...)" (§4 L37 repeats the money set). Both now cited. Location sits after '
   'Status (S21-R7) and is not a money column, so the label list is unaffected.',
   refs='SV-8623; SV-8582 (SBR spec v15 2026-07-29 S5-R2 = the authoritative 12-column '
        'left-to-right order; §3 definitions; §4 Terminology — S5-R2 CLOSES the money-column '
        'label list, so the closed list IS the requirement; Location sits after Status '
        '[S21-R7] and is not a money column)')

op(30239, 'C/V-10',
   'Pins the "(no other metrics)" closure to SBR S10-R5 (mobile) + spec version. The '
   'phrase is the spec\'s own, so the closed assertion stays (Rule 42(b)).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-4, refs. S10-R5 mobile branch verbatim L392: "a simplified external totals '
   'bar directly below the table and outside its horizontal scroll container, showing '
   '\\"Totals\\" left and the grand Subtotal right (no other metrics) ... White card '
   'surface, thin top border. During vertical page scroll the bar sits after the table in '
   'normal flow (it is not pinned to the viewport bottom)." Expected 1-4 match line for '
   'line. No second finding.',
   refs='SV-8627 (SBR spec v15 2026-07-29 Story 10 S10-R5 (mobile branch) + Story 17 S17-R4 '
        '— S10-R5 CLOSES it in the spec\'s own words: "Totals" left, the grand Subtotal '
        'right, "(no other metrics)"; so the closed assertion IS the requirement)')

op(30265, 'C/V-10',
   'Pins the closed seven-toggle / five-always-on lists to SBR S20-R2 and S20-R3 + spec '
   'version, and adds the plain tester line that Location is not a toggle.',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-5, '
   'expected 1-4, refs. S20-R2 verbatim L768: "The seven toggleable columns are: Inv. Hrs, '
   'Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %." S20-R3 '
   'L769: "The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do '
   'not appear in the dropdown and cannot be hidden." S20-R1/R6/N1 match expected 1/2/4. '
   'SECOND FINDING: with more than one location in scope the table also shows Location '
   '(S21-R7), which is in neither list - plain line added so a layman does not fail a '
   'correct build.',
   refs='SV-8637 (SBR spec v15 2026-07-29 Story 20 S20-R1; S20-R2; S20-R3; S20-R6; S20-N1 '
        '— S20-R2/S20-R3 CLOSE the seven toggles and the five always-on columns, so the '
        'closed lists ARE the requirement; Location is automatic and in neither list '
        '[S21-R7])',
   expected=[
     "1. The dropdown lists the seven toggleable metric columns, each with a toggle switch: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %.",
     "2. On first visit all seven metric columns are visible.",
     "3. The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in the dropdown and cannot be hidden.",
     "4. With all seven metric columns hidden the table still renders the five always-on columns and the grand Totals indicator — no empty or error state.",
     "5. Note for the tester: if you have more than one location in scope you will also see a Location column on the table that is in neither list. That is correct - it appears by itself and is not something you can switch on or off here.",
   ])

op(30276, 'C/V-10',
   'Pins the closed four-action menu to SBR S14-R1 + spec version (Rule 42(b)).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-2, refs. S14-R1 verbatim L515: "The toolbar\'s ⋯ overflow menu lists exactly '
   'four actions: \\"Download Summary (PDF)\\", \\"Download Expanded View (PDF)\\", '
   '\\"Download Summary (CSV)\\", \\"Download Expanded View (CSV)\\"." S17-R3 L660 pins the '
   'button first in the action cluster. No second finding.',
   refs='SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R1 + Story 17 S17-R3 (position) — '
        'S14-R1 CLOSES it in the spec\'s own words ("lists exactly four actions: ..."), so '
        'the closed list IS the requirement; re-check whenever S14-R1 changes)')

op(30281, 'C/V-10',
   'Pins the two verbatim PDF filenames and the footer string to SBR S14-R11 / S14-R4 + '
   'spec version (Rule 42(b) — the exact strings ARE the requirement).',
   'Re-verified whole against SBR spec v15 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-3, refs. S14-R11 verbatim L539: "PDF filenames are deterministic: '
   '`sales-by-representative-summary.pdf` and `sales-by-representative-expanded.pdf`." '
   'S14-R4 L525 closes the footer string; S14-R3a L523 the default-logo fallback. No '
   'second finding.',
   refs='SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R3a; S14-R4; S14-R11 — S14-R11 '
        'CLOSES both PDF filenames verbatim ("deterministic") and S14-R4 closes the footer '
        'string, so the exact strings ARE the requirement)')

op(30290, 'C/V-10',
   'Pins the verbatim over-cap toast. CRITICAL: the string in this case is the ONE '
   'suite-wide message Chris Ward ruled on 2026-07-31 (Q2=A) and is DELIBERATELY '
   'different from the SBR spec\'s own S14-E2/§7 wording, whose correction is still '
   'pending. The refs said nothing about that, so anyone diffing this case against the '
   'SBR spec would have read it as our error.',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-3, refs. SECOND FINDING (important): S14-E2 L582 and §7 L881 both still read '
   '"This export is too large to generate. Narrow the date range or filters and try '
   'again.", while the case asserts "This report is too large to export. Narrow the date '
   'range or filters, then try again." That is CORRECT and intentional - Chris Ward '
   '2026-07-31 Q2 = Option A, "One message everywhere" (chris-answers-2026-07-31/'
   'answers-ingested.md L42-46, applied as DELTAS.md D1), newest-wins per Rule 32. The '
   '10,000-row cap and the 120s persistence come from S14-E2/§7 and match. The provenance '
   'is now recorded in refs.',
   refs='SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-E2; §7 — 10,000-row cap, no truncated '
        'file, toast persists 120s; the toast STRING is the ONE suite-wide message ruled by '
        'Chris Ward 2026-07-31 Q2=A [newest-wins], so S14-E2/§7\'s own wording is stale '
        'pending his spec edit)')

op(30293, 'C/V-10',
   'Pins the closed three-header list to SBR S15-R4 + spec version, records the Chris Ward '
   '2026-07-31 Q5 "Sales Rep" → "Sales Representative" rename as the newest-wins source '
   'for the deliberate difference from the spec text, and states that this CSV is not one '
   'of the report\'s four exports so S14-R20 adds no Location column. Plain tester line '
   'added so a multi-location tester does not fail a correct build.',
   'Re-verified whole against SBR spec v15 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-4, refs. S15-R4 verbatim L602: "The CSV has a header row + one row per '
   'customer. Headers, in order: `Customer Name`, `Sales Rep`, `Rep is active?`. UTF-8 BOM '
   'prepended."; S15-R3 L601: "The Export action downloads `sales-rep-assignments.csv` and '
   'shows a success toast (§7)." The case\'s "Sales Representative" wording and file name '
   'are the Chris Ward Q5 rename (newest-wins), already disclosed in the case\'s own '
   'tester note (expected 4). SECOND FINDING: the closed three-header list needed the '
   'explicit "no Location column here" carve-out, since every OTHER SBR export gained one '
   'under S14-R20 - added.',
   refs='SV-8632 (SBR spec v15 2026-07-29 Story 15 S15-R3; S15-R4; §7 — S15-R4 CLOSES the '
        'three headers, so the closed list IS the requirement; "Sales Rep"→"Sales '
        'Representative" per Chris Ward 2026-07-31 Q5 [newest-wins]; NOT one of the four '
        'report exports, so S14-R20 adds no Location column)',
   expected=[
     '1. The file downloads as "sales-representative-assignments.csv (the short form "rep" is gone from the file name — confirm the exact final file name in the build)".',
     '2. A success toast shows "Success" with the caption "Report downloaded." and auto-fades after 5 seconds.',
     "3. The CSV starts with a UTF-8 BOM and its headers, in order, are exactly: Customer Name, Sales Representative, Rep is active?.",
     '4. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.',
     "5. Note for the tester: this file has only those three columns even if you have several locations in scope. It is a separate customer-to-representative list, not one of the report's four downloads, so it has no Location column - do not fail it for that.",
   ])

op(30328, 'C/V-10',
   'Pins the closed three-option Type list to PV S2-R1 + spec version. The refs previously '
   'carried only a message date, not a spec version.',
   'Re-verified whole against PV spec v4 2026-07-29: title, preconditions 1-3, steps 1-4, '
   'expected 1-5, refs. S2-R1 verbatim L194: "The toolbar provides a **Type** filter '
   '(single-select, first in the filter row) with options: **Both**, **Inventory**, '
   '**Special Order**. On a first visit (no saved view) the default is **Both** ... '
   '**Both** is an explicit selection ... not the absence of a filter." Expected 1-5 match; '
   'S3-R5 L263 closes the Type column\'s plain-text values. No second finding.',
   refs='SV-8642 (PV spec v4 2026-07-29 S2-R1; S3-R5 — S2-R1 CLOSES the three Type options '
        '("Both, Inventory, Special Order") and the Both default, so the closed list IS the '
        'requirement; \'Catalogue\'→\'Special Order\' per Chris Ward 2026-07-29 [newest-wins])')

op(30330, 'C/V-10',
   'Pins the closed eleven-option list to PV S2-R2 + spec version (Rule 42(b)).',
   'Re-verified whole against PV spec v4 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-4, refs. S2-R2 verbatim L196: "The toolbar provides a **date range** '
   'selector offering exactly these options: **Today, Yesterday, This Week, Last Week, '
   'This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom**. On '
   'a first visit the default is **This Year**; there is no \\"All Time\\" option ..." '
   'SECOND FINDING (noted, not fixed here): the case does not assert the "This Year" '
   'first-visit default that S2-R2 also states; that default is carried by the PV '
   'remembered-view cases, so no change is made and no coverage is lost.',
   refs='SV-8642 (PV spec v4 2026-07-29 S2-R2; §2 Out of Scope — S2-R2 CLOSES it in the '
        'spec\'s own words ("offering exactly these options: Today ... Custom"; no "All '
        'Time"), so the closed list IS the requirement)')

op(30338, 'C/V-10',
   'Pins the verbatim empty-state string to PV S2-R11 / S2-N1 / §7 + spec version '
   '(Rule 42(b) — the exact string IS the requirement).',
   'Re-verified whole against PV spec v4 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-2, refs. S2-R11 L214 and S2-N1 L223 both route the empty state to §7, whose '
   'notifications table carries the standard reports no-data label verbatim. No second '
   'finding.',
   refs='SV-8642 (PV spec v4 2026-07-29 S2-R11; S2-N1; §7 — §7 CLOSES the empty-state '
        'string verbatim ("Empty bays, endless possibilities. Get Going!"), the '
        'application\'s standard reports no-data label, so the exact string IS the '
        'requirement)')

op(30346, 'C/V-10',
   'Pins the closed info-icon set and its three verbatim descriptions to PV S3-R6 + spec '
   'version (Rule 42(b)).',
   'Re-verified whole against PV spec v4 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-6, refs. S3-R6 verbatim L265: "Three columns — **Units Sold**, **Demand**, '
   'and **Turns / Yr** — carry a grey ⓘ icon immediately to the right of the header '
   'label. The icon is always-on (not a hover-to-reveal affordance) ... Turns / Yr is '
   'hidden by default (S4-R3), so its icon appears only once that column is enabled ... '
   'the icon is also focusable and exposes the same text to assistive technology." Three '
   'columns named means expected 6 ("No other column header carries an info icon") is the '
   'spec\'s own closure. No second finding.',
   refs='SV-8643 (PV spec v4 2026-07-29 S3-R6 — S3-R6 CLOSES the set (exactly three columns: '
        'Units Sold, Demand, Turns / Yr) and quotes each description verbatim, so the closed '
        'set and the exact strings ARE the requirement)')

op(30375, 'C/V-10',
   'Pins the closed two-item export menu to PV S6-R1 + spec version (Rule 42(b)).',
   'Re-verified whole against PV spec v4 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-2, refs. S6-R1 verbatim L443: "A **⋯** overflow button in the toolbar '
   '(leftmost in the toolbar\'s action cluster) opens an export menu with two items, in '
   'this order: **Download (PDF)** and **Download (CSV)**." No second finding.',
   refs='SV-8646 (PV spec v4 2026-07-29 S6-R1 — S6-R1 CLOSES it in the spec\'s own words '
        '("an export menu with two items, in this order: Download (PDF) and Download '
        '(CSV)"), so the closed list IS the requirement)')

op(30384, 'C/V-10',
   'Pins the verbatim success/failure toast strings to PV S6-R9 / S6-N1 + spec version '
   '(Rule 42(b) — the exact strings, including the casing mix, ARE the requirement).',
   'Re-verified whole against PV spec v4 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-3, refs. S6-R9 verbatim L459: success toast reads "Velocity report exported '
   '(CSV)" or "Velocity report exported (PDF)". S6-N1 L470: "The server-provided message is '
   'used when available; otherwise the toast reads \\"Failed to export velocity report '
   '(csv)\\" or \\"Failed to export velocity report (pdf)\\"." The UPPERCASE-success / '
   'lowercase-failure mix is the shipped wording, documented as-is. No second finding.',
   refs='SV-8646 (PV spec v4 2026-07-29 S6-R9; S6-N1; §7 (casing note) — S6-R9/S6-N1 CLOSE '
        'the toast strings verbatim, including the shipped UPPERCASE-success / '
        'lowercase-failure casing mix, so the exact strings ARE the requirement)')

op(30399, 'C/V-10',
   'Pins the verbatim no-data string to TU §7 (+ S1-N2, S3-N1, S5-N1, S9-N2) + spec '
   'version (Rule 42(b)).',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-3, refs. S1-N2 L176, S9-N2 L603 and S5-N1 L373 all route to the §7 no-data '
   'message; S3-N1 L293 hides the Summary row when no technician rows are visible; S5-N1 '
   'confirms "Clear all" shows the SAME message and hides the Summary row (expected 3). '
   'No second finding.',
   refs='SV-8648 (TU spec v5 2026-07-29 S1-N2; S3-N1; S5-N1; S9-N2; §7 — §7 CLOSES the '
        'no-data string verbatim ("Empty bays, endless possibilities. Get Going!"), the '
        'standard reports no-data label, so the exact string IS the requirement)')

op(30441, 'C/V-10',
   'Pins the two verbatim download notifications to the TU §7 notifications table + spec '
   'version (Rule 42(b)).',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-2, refs. Story 7 Error Handling L490/L492 and the §7 table L645/L646 close '
   'both strings verbatim: "Download started" (success notification) and "Failed to '
   'download report" (error notification). SECOND FINDING: Story 7 Error Handling carries '
   'no S-anchor of its own for these two strings, so §7 is now cited explicitly as the '
   'closing reference rather than left implicit.',
   refs='SV-8654 (TU spec v5 2026-07-29 Story 7 Error Handling + §7 notifications table — '
        'these CLOSE both strings verbatim ("Download started" / "Failed to download '
        'report"), so the exact strings ARE the requirement; Story 7 has no S-anchor for '
        'them, §7 is the closing reference)')

op(30451, 'C/V-10',
   'Pins the verbatim browser page title to WIP S1-R5 + spec version. The refs previously '
   'carried only ruling dates, no spec version.',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-3, refs. S1-R1 verbatim L130: report appears "under the **Performance** '
   'group, labeled \\"Work In Progress\\"". S1-R5 L134: "The browser page title is \\"Work '
   'In Progress - Report | ShopView\\" (the separator is a plain hyphen with one space on '
   'each side)." The "below the pre-existing entries" ordering is the PRD video 2026-07-30 '
   '(newest-wins) and is retained; the one-ordinary-reports-permission access is the QA '
   'lead\'s 2026-08-03 ruling and is retained. No second finding.',
   refs='SV-8657 (WIP spec v6 2026-07-29 Story 1 S1-R1; S1-R5 — S1-R5 CLOSES the page title '
        'verbatim, so the exact string IS the requirement; Performance group, below the '
        'named anchor items per the PRD video 2026-07-30; access = the one ordinary reports '
        'permission per QA lead 2026-08-03)')

op(30452, 'C/V-10',
   'Pins the closed four-tab list and its order to WIP S1-R2 + spec version (Rule 42(b)).',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-3, refs. S1-R2 verbatim L131: "Opening the report shows four tabs, labeled '
   '(in order) \\"Approved - partially completed\\", \\"Approved - not started\\", '
   '\\"Completed\\", and \\"Estimates\\"." S1-R3 L132 pins the default tab. No second '
   'finding.',
   refs='SV-8657 (WIP spec v6 2026-07-29 Story 1 S1-R2; S1-R3; §3 Key Decisions (no '
        'on-screen status filter) — S1-R2 CLOSES the four tab labels and their order '
        'verbatim, so the closed list IS the requirement)')

op(30469, 'C/V-10',
   'Pins the closed five status-label list to WIP S4-R6 + spec version (Rule 42(b)).',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-3, refs. S4-R6 verbatim L216: "Status is shown as a badge using the '
   'status\'s label (\\"Estimate\\", \\"Approved\\", \\"In Progress\\", \\"Review\\", '
   '\\"Complete\\"), color-coded per the application\'s standard status colors; the label '
   'text is always present, so color is never the sole signal." S10-R8 L459 repeats the '
   'label-not-colour rule. No second finding.',
   refs='SV-8660 (WIP spec v6 2026-07-29 Story 4 S4-R6 + Story 10 S10-R8 — S4-R6 CLOSES the '
        'five status labels verbatim ("Estimate", "Approved", "In Progress", "Review", '
        '"Complete") and the label-not-colour rule, so the closed list IS the requirement)')

op(30487, 'C/V-10',
   'Pins the closed seven-figure list and its order to WIP S5-R1 + spec version '
   '(Rule 42(b)).',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-2, refs. S5-R1 verbatim L269: "The summary strip shows seven figures, in '
   'this order: **Total Earned**, **Total Remaining**, **Not Started**, **Started — '
   'Earned**, **Started — Remaining**, **Ready to Invoice**, and **Estimates**." S5-R10 '
   'L278 closes the currency format. No second finding.',
   refs='SV-8661 (WIP spec v6 2026-07-29 Story 5 S5-R1; S5-R10 — S5-R1 CLOSES the seven '
        'figures and their order verbatim and S5-R10 closes the currency format, so the '
        'closed list IS the requirement)')

op(30515, 'C/V-10',
   'Pins the two verbatim file names to WIP S9-R9 + spec version (Rule 42(b)).',
   'Re-verified whole against WIP spec v6 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-3, refs. S9-R9 verbatim L412: "The downloaded files are named '
   '\\"wip-2-report.pdf\\" and \\"wip-2-report.csv\\"." Expected 3 records that the "-2-" '
   'segment is the specified current behaviour. No second finding.',
   refs='SV-8665 (WIP spec v6 2026-07-29 Story 9 S9-R9 — S9-R9 CLOSES both file names '
        'verbatim, including the "-2-" segment, so the exact strings ARE the requirement)')

op(30591, 'C/V-10',
   'Pins the two verbatim file names to IV S10-R10 + spec version (Rule 42(b)).',
   'Re-verified whole against IV spec v3 2026-07-29: title, preconditions 1-2, steps 1-2, '
   'expected 1-2, refs. S10-R10 verbatim L439: "The downloaded files are named '
   '\\"inventory-value-report.pdf\\" and \\"inventory-value-report.csv\\"." No second '
   'finding.',
   refs='SV-8677 (IV spec v3 2026-07-29 Story 10 S10-R10 — S10-R10 CLOSES both file names '
        'verbatim, so the exact strings ARE the requirement)')

# ─────────────────────────────────────────────────────────────────────────────
# GROUP D — V-7 (MEDIUM): a non-technical tester is told to "measure a contrast
# ratio" with no tool and no method. Rewritten so the tester-facing check is
# something they can do by eye; the numeric ratio stays in the case as the
# design/engineering figure it is, and stays in refs, so nothing is deleted.
# ─────────────────────────────────────────────────────────────────────────────
op(30387, 'D/V-7',
   'Removes the un-runnable "check the contrast" instruction and restates it as a '
   'by-eye legibility check, with the 3:1 figure kept as an explicitly '
   'design/engineering-owned measurement. Refs pinned to PV S7-R6 + spec version.',
   'Re-verified whole against PV spec v4 2026-07-29: title, precondition 1, steps 1-3, '
   'expected 1-2, refs. S7-R6 verbatim L495: "The report supports dark mode; page '
   'background, toolbar, and cells use their dark-mode equivalents. The grey ⓘ info icon '
   'uses a token that meets at least a 3:1 contrast ratio against the cell background in '
   'both light and dark mode." The requirement is about the TOKEN the build uses - which is '
   'why a manual tester cannot verify it by measurement and should not be asked to. No '
   'second finding.',
   refs='SV-8647 (PV spec v4 2026-07-29 S7-R6 — dark-mode support + the grey info icon\'s '
        'colour token meeting ≥ 3:1 against the cell background in both modes; the ratio '
        'is a design-token property, so the manual check is by-eye legibility and the '
        'measurement is design/engineering-owned)',
   steps=[
     "1. Switch the application to dark mode.",
     "2. Look at the page background, toolbar, and cells.",
     "3. Look at the grey ⓘ info icon next to a column heading in dark mode, then switch back to light mode and look at it again.",
   ],
   expected=[
     "1. The report supports dark mode: page background, toolbar, and cells use their dark-mode equivalents.",
     "2. In BOTH light mode and dark mode the grey ⓘ info icon is clearly visible against the cell behind it - you can see it at a glance without leaning in, and it does not disappear into the background.",
     "3. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether you can see the icon easily in both modes. Only report it if the icon is hard to see. (The design rule behind this is a minimum 3:1 contrast ratio, which the design and engineering team check with a contrast tool - not by hand.)",
   ])

op(30309, 'D/V-7',
   'Removes the "a contrast-checking tool is available" precondition and the "Measure the '
   'contrast ratio" step, restating them as a by-eye legibility check; the WCAG AA 4.5:1 '
   'figure is kept as the design/engineering-owned measurement. Refs pinned to SBR '
   'S18-R11/S18-R12 + spec version.',
   'Re-verified whole against SBR spec v15 2026-07-29: title, precondition 1, steps 1-2, '
   'expected 1-2, refs. S18-R11 verbatim L707: "The subdued-grey used for the `(N)` count '
   'and the \\"(Inactive)\\" tag meets at least WCAG AA contrast (≥ 4.5:1) against the '
   'white body surface in light mode and against the dark surface in dark mode; the reduced '
   'font size does not drop it below that ratio." S18-R12 L708 closes the '
   'no-colour-alone rule and matches expected 2 exactly. No second finding.',
   refs='SV-8635 (SBR spec v15 2026-07-29 Story 18 S18-R11; S18-R12 — subdued-grey (N) count '
        'and "(Inactive)" tag at ≥ 4.5:1 WCAG AA in both modes, and nothing conveyed by '
        'colour alone; the ratio is a design-token property, so the manual check is by-eye '
        'legibility and the measurement is design/engineering-owned)',
   preconds=[
     '1. You are on the report with a rep row showing a (N) count and - if arrangeable - an "(Inactive)" tag.',
   ],
   steps=[
     '1. Read the subdued-grey (N) count and the "(Inactive)" tag in light mode, then switch to dark mode and read them again.',
     "2. Review how Inv. Hrs, the status badges, and the links convey their meaning.",
   ],
   expected=[
     '1. In BOTH light mode and dark mode the subdued-grey (N) count and the "(Inactive)" tag are easy to read against the surface behind them - the smaller text does not fade into the background.',
     "2. No information is conveyed by color alone: Inv. Hrs carries its +/- sign, status badges carry their text label, and links carry a hover/focus underline.",
     "3. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether you can read the grey text easily in both modes, and only report it if you cannot. (The design rule behind this is WCAG AA contrast of at least 4.5:1, which the design and engineering team check with a contrast tool - not by hand.)",
   ])

op(30448, 'D/V-7',
   'Removes the "Measure the information icon\'s contrast" step and restates it as a '
   'by-eye legibility check; the 3:1 figure is kept as the design/engineering-owned '
   'measurement. Refs pinned to TU S8-R9/S8-R13/S8-R14 + spec version.',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-3, refs. S8-R9 verbatim L530 lists exactly the elements the case checks '
   '(page background, toolbar, cells, the Total Hours link, the information icon, the sort '
   'indicator, the "—" glyph); S8-R13 L545 is the ≥ 3:1 icon rule; S8-R14 L547 the link '
   'affordance/focus rule in both modes. No second finding.',
   refs='SV-8655 (TU spec v5 2026-07-29 S8-R9; S8-R13; S8-R14 — dark-mode legibility of '
        'every named element, the info icon at ≥ 3:1 in both modes, and the Total Hours '
        'link affordance/focus in both modes; the ratio is a design-token property, so the '
        'manual check is by-eye legibility and the measurement is design/engineering-owned)',
   steps=[
     "1. Switch the application to dark mode.",
     '2. Check each element: page background, toolbar, cells, the Total Hours link, the information icon, the sort indicator, and a "—" glyph.',
     "3. Look at the information icon in dark mode, then switch back to light mode and look at it again.",
     "4. Check the Total Hours link's underline/affordance and focus indicator in both modes.",
   ],
   expected=[
     '1. The report supports dark mode: page background, toolbar, cells, the Total Hours link, the information icon, the sort indicator, and the "—" glyph are all clearly legible in dark mode.',
     "2. In BOTH light mode and dark mode the information icon is clearly visible against the background behind it - you can see it at a glance and it does not disappear into the background.",
     "3. The Total Hours link's non-color affordance and focus indicator apply in both modes.",
     "4. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether you can see the icon easily in both modes, and only report it if you cannot. (The design rule behind this is a minimum 3:1 contrast ratio, which the design and engineering team check with a contrast tool - not by hand.)",
   ])

# ─────────────────────────────────────────────────────────────────────────────
# GROUP E — V-8 (LOW), Rule 4: two UI-section cases require reading the network
# tab. Rewritten UI-observable. Nothing is lost: the back-end half of BOTH
# assertions is already covered in the "TU - API" section (C30449 and C30450),
# quoted side by side in `reverified` (Rule 45(e)).
# ─────────────────────────────────────────────────────────────────────────────
op(30419, 'E/V-8',
   'Removes the devtools precondition and the network-watching step from a UI-titled '
   'section (Rule 4) and restates the on-demand load in terms a layman can see on screen. '
   'The back-end assertion is NOT dropped - it is already covered by TU-API-01 = C30449 '
   'in the "TU - API" section.',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-4, '
   'expected 1-4, refs. S4-R2 verbatim L315: "When a row is expanded, the report shows one '
   'row for each day the technician clocked time in the range, in date order from earliest '
   'to latest. The day rows **load on expand** - they are fetched on demand when the '
   'technician row is expanded, not shipped with the initial report payload ..."; S4-N1 '
   'L328 (no row for a day with no time); S9-R4 L582 (per-day rows pool across selected '
   'locations). SIDE BY SIDE for the moved assertion (Rule 45(e)): C30449 expected 1-2 read '
   '"The initial report payload does NOT ship the day rows." / "Expanding a technician row '
   'issues an on-demand backend request that returns that technician\'s per-day breakdown." '
   '- so the network-level claim keeps a home in an API-titled section. No second finding.',
   refs='SV-8651 (TU spec v5 2026-07-29 S4-R2; S4-N1; S9-R4 — one row per clocked day in '
        'date order, load-on-expand, no row for an unclocked day, per-day pooling across '
        'the selected locations; the back-end half of the load-on-expand assertion is '
        'covered by C30449 in the "TU - API" section, so this UI case stays devtools-free '
        'per Rule 4)',
   preconds=[
     "1. A technician clocked time on several (but not all) days of the range - including, for the pooling check, time at two selected locations on the same day.",
   ],
   steps=[
     "1. Before expanding anything, look at the technician's row - there are no day rows under it yet.",
     "2. Expand the technician's row and watch the data area as the day rows appear.",
     "3. Read the day rows top to bottom.",
     "4. Look for rows on days the technician did not clock time.",
     "5. On the double-location day, count the rows for that date.",
   ],
   expected=[
     "1. One row appears for each day the technician clocked time in the range, in date order from earliest to latest.",
     "2. The day rows are not there until you expand the row - they arrive at the moment you expand it (you may briefly see the standard loading indicator in that area), and the rest of the report does not reload.",
     "3. A day with no clocked time has NO row.",
     "4. With several locations selected, a day's row POOLS that day's hours across the selected locations - one day row per date, not one per location.",
     "5. Note for the tester: you do not need developer tools for this test - just watch the screen.",
   ])

op(30424, 'E/V-8',
   'Removes the devtools precondition and the network-watching step from a UI-titled '
   'section (Rule 4) and restates the no-reload claim in the spec\'s own on-screen words. '
   'The back-end assertion is NOT dropped - it is already covered by C30450 in the '
   '"TU - API" section.',
   'Re-verified whole against TU spec v5 2026-07-29: title, preconditions 1-2, steps 1-3, '
   'expected 1-4, refs. S5-R3 L352, S5-R4 L354 and S5-R5 L356 match expected 1/2/4. The '
   'no-reload claim is the spec\'s own §3 Key Decision, verbatim L76: "**The technician '
   'filter works on screen only and does not reload the report** (Story 5); the '
   '**location filter reloads the report from the server** (Story 9)", echoed by the Story '
   '5 context note L385. SIDE BY SIDE for the moved assertion (Rule 45(e)): C30450 '
   'expected 3 reads "The technician filter causes NO server request - it works on screen '
   'only (hide/show + Summary recalculation)." - so the network-level claim keeps a home in '
   'an API-titled section. No second finding.',
   refs='SV-8652 (TU spec v5 2026-07-29 S5-R3; S5-R4; S5-R5 + §3 Key Decisions ("the '
        'technician filter works on screen only and does not reload the report"); S5 '
        'context note — the server-request half is covered by C30450 in the "TU - API" '
        'section, so this UI case stays devtools-free per Rule 4)',
   preconds=[
     "1. Several technician rows are visible and the Summary row shows their totals.",
     "2. Note the current date range so you can confirm it does not change.",
   ],
   steps=[
     "1. Note the Summary values, then deselect one technician in the Filter by Technician filter.",
     "2. Watch the data area and the Summary row.",
     "3. Re-select the technician.",
   ],
   expected=[
     "1. The deselected technician's row is hidden.",
     "2. The Summary row recalculates over the technicians that remain visible.",
     "3. The report does NOT reload - the technician filter works on screen only: the rows and the Summary update straight away, no loading indicator appears in the data area, and the date range does not change.",
     "4. Re-selecting the technician shows the row again (and the Summary recalculates back).",
     "5. Note for the tester: you do not need developer tools for this test - just watch the screen.",
   ])



# ─────────────────────────────────────────────────────────────────────────────
# SECOND PASS, same day — SBC pins upgraded v12 2026-07-29 -> v13 2026-07-31.
# WHY: a parallel worker established live SBC = v13 (2026-07-31) and captured it
# (spec-watch-verification-2026-08-03/live-capture-2026-08-03/). I diffed the two
# bodies myself rather than take it on trust: 222 requirement anchors each, 0 added,
# 0 removed, and the ONLY substantive text changes are S1-R2, S1-N1 and the removed
# Story-1 Prerequisite - all the permission gate. (S14-R14 and S15-R6 also "differ",
# but only by markdown escaping of an underscore: "this_month" vs "this\_month" -
# a capture artifact, so the parallel worker's "exactly 3 changes" is CORRECT.)
# ALL 30 SBC anchors this pass pinned are byte-identical in live v13, so the pin can
# honestly name the live version instead of a mirror that is one behind.
# Same check run on SBR and PV against their live captures: 0 anchors added/removed,
# and every anchor this pass pinned differs only by whitespace/emphasis artifacts
# (similarity 0.992-0.999) - no substantive change, so SBR v15 / PV v4 pins stand.
# TU v5 / WIP v6 / IV v3: version-matched to live, NOT text-diffed (no live capture
# available this session) - stated rather than implied (Rule 12).
# ─────────────────────────────────────────────────────────────────────────────
_SBC_V13 = [30102, 30107, 30149, 30156, 30159, 30167, 38856]
for _c in _SBC_V13:
    PLAN[_c]['reverified'] += (
        ' | SBC v13 RE-CHECK 2026-08-03: this case\'s anchors re-diffed against the LIVE '
        'v13 capture (spec-watch-verification-2026-08-03/live-capture-2026-08-03/'
        'Sales-By-Customer-Report-current-2026-08-03.md) - byte-identical to the v12 '
        'mirror, so the pin was upgraded to "SBC spec v13 2026-07-31".')

# ─────────────────────────────────────────────────────────────────────────────
# FINAL refs values live in refs_final.json and OVERRIDE the drafts above.
# Why: TestRail's `refs` field, probed live on 2026-08-03 (see
# APP-ACTIONS-PLAYBOOK.md §L), splits on COMMAS, TRIMS each entry, re-joins with
# a bare "," and REJECTS (HTTP 400 "Field :refs does not match the required
# pattern.") any entry longer than 248 characters. All 475 existing Report Suite
# refs are comma-FREE single entries (max 245 chars), so the house style is:
# ONE comma-free entry, semicolons as separators, <= 248 chars. refs_final.json
# is asserted against exactly that before every run.
# ─────────────────────────────────────────────────────────────────────────────
import json as _json
import os as _os
_FINAL = _json.load(open(_os.path.join(_os.path.dirname(__file__), 'refs_final.json')))
for _c, _r in _FINAL.items():
    _c = int(_c)
    assert _c in PLAN, f'refs_final has C{_c} which is not in the plan'
    assert ',' not in _r, f'C{_c}: refs must be comma-free (TestRail splits on commas)'
    assert len(_r) <= 248, f'C{_c}: refs is {len(_r)} chars, TestRail rejects > 248'
    PLAN[_c]['fields']['refs'] = _r
assert set(map(int, _FINAL)) == set(PLAN), 'refs_final and PLAN disagree'

if __name__ == '__main__':
    import json
    print(f'ops: {len(PLAN)}')
    for g in sorted({v['group'] for v in PLAN.values()}):
        ids = [c for c, v in PLAN.items() if v['group'] == g]
        print(f'  {g}: {len(ids)}  {sorted(ids)}')
    bad = [c for c, v in PLAN.items() if 'refs' in v['fields'] and len(v['fields']['refs']) > 250]
    print('refs over 250 chars:', [(c, len(PLAN[c]['fields']['refs'])) for c in bad])
    print('max refs len:', max(len(v['fields'].get('refs', '')) for v in PLAN.values()))
