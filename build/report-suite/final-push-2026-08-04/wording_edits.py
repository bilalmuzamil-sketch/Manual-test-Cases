#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — the HAND-AUTHORED wording layer (L3).

Every entry carries the EXACT live text as `old` so build_plan.py aborts if the
live case has moved (Rule 50: never write blind).  Each entry records:
  why   — the audit finding it repairs
  ref   — the source that governs the new text
NOTHING here touches a held case (build_plan.py raises if it does).

Repair patterns reused (Rule 16 — mirror what already exists):
  P-EYE   the C30386 / SBC-EXP-08 repair: replace an un-measurable pixel/colour/
          font-weight assertion with a by-eye check plus a plain tester note that
          names design+engineering as the owner of the exact figures.
  P-COND  Rule 42 scope-conditional wording instead of a closed absolute.
  P-DEDUP delete an expected item that duplicates another case, renumber the rest.
"""

EDITS = {}


def E(cid, why, ref, **fields):
    EDITS[cid] = {'why': why, 'ref': ref,
                  'fields': {k: (v[0], v[1]) for k, v in fields.items()}}


# ══════════════════════════════════════════════════════════════════════════
# 1. THE FOUR INTERNALLY CONTRADICTORY CASES (brief item 3)
# ══════════════════════════════════════════════════════════════════════════

# SBC-DATE-03 — step 1 says a month calendar is how a custom range is picked;
# expected 1 still said choosing "Custom" opens a dialog.  No "Custom" item exists.
E(30104,
  'Intra-case contradiction CG-SBC-CUSTOM-RANGE: step 1 says the range is picked '
  'on a month calendar inside the picker; expected 1 said choosing "Custom" opens '
  'a dialog. There is no "Custom" item on this build.',
  'SBC spec v13 2026-07-31 S2-R3/S2-R4/S2-N2 (the 366-day cap is the requirement; '
  'the spec does not name a "Custom" menu item) + live build v3.4.1-0ed4433',
  custom_expected=(
   '1. Choosing "Custom" opens a date-picker dialog for a start and end date.\n'
   '2. A range of 366 days or fewer applies normally.\n'
   '3. A range wider than 366 days cannot be applied — the report prevents the selection rather than loading the wider range.',
   '1. The date range picker shows a month calendar inside it — that is how a custom start and end date are chosen on this build. There is no separate "Custom" item to choose.\n'
   '2. A range of 366 days or fewer applies normally.\n'
   '3. A range wider than 366 days cannot be applied — the report prevents the selection rather than loading the wider range.'))

# IV-NAV-05 — expected 1 demanded a pagination control, expected 3 said none exists.
E(30538,
  'Intra-case contradiction CG-IV-PAGINATION: expected 1 required "the reports '
  'suite\'s standard pagination control" while expected 3 said there are no '
  'numbered page controls. Expected 1 now asserts the paging BEHAVIOUR the spec '
  'requires (one page at a time, not the whole list) which is observable; the '
  'record that numbered controls are absent stays in expected 3.',
  'IV spec v3 2026-07-29 S1-R8 + §2 Scale and data model + live build v3.4.1-0ed4433',
  custom_expected=(
   "1. The server returns one page of rows at a time; the user moves through pages with the reports suite's standard pagination control.\n"
   '2. Changing any server-side filter (Date, Location, Category, Vendor), the part search, or the sort returns the FIRST page of the new result set - the list jumps back to the top.\n'
   '3. Note for the tester: on this build there are no numbered page controls on the screen - the rows load as you scroll. That is what you should see; record it and carry on with the checks above.',
   '1. The server returns one page of rows at a time rather than the whole list at once; further rows keep arriving as you scroll to the bottom.\n'
   '2. Changing any server-side filter (Date, Location, Category, Vendor), the part search, or the sort returns the FIRST page of the new result set - the list jumps back to the top.\n'
   '3. Note for the tester: on this build there are no numbered page controls on the screen - the rows load as you scroll. That is what you should see; record it and carry on with the checks above.'))

# IV-TOT-01 — expected 1 said "Totals"; spec S4-R1 says the ON-SCREEN label is
# "Total" and S10-R6 says the DOWNLOADED row is "Totals".  Case now asserts the
# spec value, so a build showing "Totals" on screen fails and is reported.
E(30556,
  'Intra-case contradiction CG-IV-TOTALS-LABEL: expected 1 required the on-screen '
  'label "Totals" while the case\'s own note records that spec S4-R1 says "Total" '
  'on screen and S10-R6 says "Totals" in the download. The case now asserts the '
  'spec value on screen and names the download label separately, so the two are no '
  'longer in conflict and the build difference stays visible.',
  'IV spec v3 2026-07-29 S4-R1 verbatim: "A totals row is shown at the bottom of '
  'the report, with the literal label \\"Total\\" in the Part # column\'s cell." + S10-R6',
  title=('Totals row: Totals label, blank identity/per-unit cells, pinned bold Total Cost',
         'Totals row: Total label, blank identity/per-unit cells, pinned bold Total Cost'),
  custom_expected=(
   '1. A totals row is shown at the bottom, with the label "Totals" in the Part # column\'s cell.\n'
   '2. The Description, Category, and Vendor cells are blank; the Unit Cost and Unit Sell cells are blank (a per-unit price has no meaningful sum).\n'
   '3. The totals-row Total Cost cell is pinned far right and bold, matching the column, and the row uses the same number formats as the data rows.\n'
   '4. The totals row stays visible at the bottom while the rows scroll.',
   '1. A totals row is shown at the bottom, with the label "Total" in the Part # column\'s cell. In the downloaded files the same row is labelled "Totals" — that difference is intended.\n'
   '2. The Description, Category, and Vendor cells are blank; the Unit Cost and Unit Sell cells are blank (a per-unit price has no meaningful sum).\n'
   '3. The totals-row Total Cost cell is pinned far right and bold, matching the column, and the row uses the same number formats as the data rows.\n'
   '4. The totals row stays visible at the bottom while the rows scroll.\n'
   '5. Note for the tester: if the label on screen reads "Totals" instead of "Total", mark this test Failed and report it — do not change the test.'))

# SBR-BADGE-01 — expected 1 closed Status's neighbours absolutely; with more than
# one location in scope the automatic Location column sits immediately after Status.
E(30226,
  'Cross-case contradiction CG-SBR-STATUS-POSITION: expected 1 said Status sits '
  'between Customer and Inv. Hrs, but SBR-EXP-04 (C30279) and SBR-COL-01 (C30265) '
  'place the automatic Location column immediately AFTER Status per S21-R7. '
  'Rewritten scope-conditionally (Rule 42) so both are true.',
  'SBR spec v15 2026-07-29 S8-R1 + S21-R7 (automatic Location column immediately '
  'after Status) + Chris Ward 2026-07-29',
  custom_expected=(
   '1. The Status column sits between the Customer column and the Inv. Hrs column.\n'
   '2. Every detail row renders a small colored badge reading "Paid," "Partially Paid," or "Unpaid" — badge rendering is unconditional on detail rows.\n'
   '3. The mapping is: paid → Paid; overpaid → Paid; prepaid with zero balance → Paid; prepaid with a balance owed → Partially Paid; partially_paid → Partially Paid; unpaid → Unpaid.\n'
   '4. Badges are vertically centered in their cells; on rep summary rows the Status cell is blank; the badge\'s text is the accessible label — status is never conveyed by color alone.',
   '1. The Status column sits immediately after the Customer column. With a single location in scope the next column to its right is Inv. Hrs; when more than one location is in scope the automatic Location column is inserted immediately after Status, so Inv. Hrs then follows Location.\n'
   '2. Every detail row renders a small colored badge reading "Paid," "Partially Paid," or "Unpaid" — badge rendering is unconditional on detail rows.\n'
   '3. The mapping is: paid → Paid; overpaid → Paid; prepaid with zero balance → Paid; prepaid with a balance owed → Partially Paid; partially_paid → Partially Paid; unpaid → Unpaid.\n'
   '4. Badges are vertically centered in their cells; on rep summary rows the Status cell is blank; the badge\'s text is the accessible label — status is never conveyed by color alone.'))


# ══════════════════════════════════════════════════════════════════════════
# 2. THE FIX-WORDING REPAIRS (brief item 2), minus the 4 held for Chris's
#    Location ruling and the 2 whose only fault is an unversioned refs (fixed by L2)
# ══════════════════════════════════════════════════════════════════════════

# IV-CALC-03 — precondition asks for a state the build cannot create.
E(30547,
  'FIX-WORDING: precondition 2 asks for a part with NO category, but the build '
  'cannot save one (category is required; 0 of 5,657 live rows are blank). '
  'IV-COL-05 already carries the plain tester note for exactly this state; this '
  'case did not. Same note added, precondition marked as possibly unreachable.',
  'IV spec v3 2026-07-29 Story 6 markup-by-category + live build v3.4.1-0ed4433',
  custom_preconds=(
   '1. You are signed in to the ShopView App on a desktop browser.\n'
   '2. A ZZAUTOTEST in-stock part exists with a known unit cost, NO fixed sell price, and NO category.\n'
   '3. The Margin and Total Sell columns are turned on.',
   '1. You are signed in to the ShopView App on a desktop browser.\n'
   '2. A ZZAUTOTEST in-stock part exists with a known unit cost, NO fixed sell price, and NO category.\n'
   '3. The Margin and Total Sell columns are turned on.\n'
   '4. Note for the tester: on this build a part cannot be saved without a category, so you may not be able to create the part described in step 2. If you cannot, mark this test Blocked and say so — do not guess the result.'),
  custom_expected=(
   '1. A part with no category takes no markup, so its Unit Sell equals its Unit Cost.\n'
   '2. Such a part shows a Margin of $0.00 and a Margin % of 0.0% — the stock is valued at cost.',
   '1. A part with no category takes no markup, so its Unit Sell equals its Unit Cost.\n'
   '2. Such a part shows a Margin of $0.00 and a Margin % of 0.0% — the stock is valued at cost.\n'
   '3. Note for the tester: if no part without a category can be created or found, mark this test Blocked rather than Passed or Failed.'))

# IV-DATE-04 — step said "Select a Custom range"; no Custom item exists.
E(30564,
  'FIX-WORDING: step 1 said "Select a Custom range" but this build has no Custom '
  'item — the range is made on the inline calendar (its sibling IV-DATE-06 already '
  'says so). Un-runnable step corrected; no expected result touched.',
  'IV spec v3 2026-07-29 S5-R3/S5-R4 + live build v3.4.1-0ed4433',
  custom_steps=(
   '1. Select a Custom range ending on the past recorded day.\n'
   '2. Find the part and read its quantity and values.\n'
   '3. Compare them to what the part held on that recorded day (not today).',
   '1. Open the date range picker and use the month calendar inside it to set a range ending on the past recorded day, then apply.\n'
   '2. Find the part and read its quantity and values.\n'
   '3. Compare them to what the part held on that recorded day (not today).'))

# IV-EXP-10 — the expected made the DEFECT the pass condition.
E(43548,
  'FIX-WORDING (the most serious of the 25): the expected result made the DEFECT '
  'the pass condition — "On the whole list the PDF does not download" — so a tester '
  'on a FIXED build would have to mark it Failed, and automation would lock the bug '
  'in as correct. The expected now states the CORRECT behaviour; the observed '
  'failure is preserved verbatim as a known-defect note naming the ticket. This '
  'strengthens the defect evidence rather than erasing it: on today\'s build the '
  'case now fails visibly.',
  'IV spec v3 2026-07-29 Story 10 + tech-plan-2026-07-29 A3/FR-F4 (the ten-thousand-'
  'row cap is the only documented limit) + ticket SV-8820',
  custom_expected=(
   '1. The narrowed PDF downloads successfully.\n'
   '2. On the whole list the PDF does not download. After roughly half a minute a plain error appears reading "An error occurred. We\'re sorry for this inconvenience, please try again a bit later later." — record that this happened and roughly how many rows were in the view.\n'
   '3. The CSV of that same whole list downloads successfully and quickly.\n'
   '4. Once the view is narrowed the PDF works again.\n'
   '5. Note for the tester: this is NOT the too-large-to-export message. If you see "This report is too large to export. Narrow the date range or filters, then try again." instead, that is the polite refusal working correctly and belongs to the export-cap test, not this one.',
   '1. The narrowed PDF downloads successfully.\n'
   '2. On the whole list the PDF either downloads successfully too, or is refused politely with the message "This report is too large to export. Narrow the date range or filters, then try again." Either of those is a pass.\n'
   '3. The CSV of that same whole list downloads successfully and quickly.\n'
   '4. Once the view is narrowed the PDF works again.\n'
   '5. KNOWN PROBLEM at the time of writing: on the whole list the PDF did not download at all. After roughly half a minute a plain error appeared reading "An error occurred. We\'re sorry for this inconvenience, please try again a bit later later." If you still see that, mark this test Failed, note roughly how many rows were in the view, and refer to the reported problem — do not change the test.\n'
   '6. Note for the tester: the polite refusal message in item 2 is the correct behaviour. The plain error in item 5 is the problem being tracked. Tell the two apart by the wording.'))

# IV-FLT-02 — step and expected assumed pages; the build loads on scroll.
E(30570,
  'FIX-WORDING: step 1 and expected 1 assumed numbered pages ("where the list '
  'starts"); this build has no page controls and loads on scroll, as its own '
  'sibling IV-NAV-05 (C30538) records. Reworded to "jumps back to the top".',
  'IV spec v3 2026-07-29 S7-R11 server-side filtering + live build v3.4.1-0ed4433',
  custom_steps=(
   '1. Scroll well down the list, then select a Category and check where the list starts and which rows are listed.\n'
   '2. Repeat with a Vendor selection.\n'
   '3. Repeat with a part search.\n'
   '4. Also change the date range, the location selection, and the sort — watching the data area each time.',
   '1. Scroll well down the list, then select a Category and check whether the list has jumped back to the top and which rows are now listed.\n'
   '2. Repeat with a Vendor selection.\n'
   '3. Repeat with a part search.\n'
   '4. Also change the date range, the location selection, and the sort — watching the data area each time.'),
  custom_expected=(
   '1. Each change re-queries the server and returns the first page of the new result set.\n'
   '2. The filtering covers the ENTIRE data set — matching parts that were further down the list appear — not just a narrowing of the rows currently on screen.\n'
   '3. Every change — date range, location, Category, Vendor, part search, sort — reloads the rows from the server; while loading the standard reports loading indicator shows, and existing rows are replaced only when the new data returns.',
   '1. Each change re-queries the server and the list jumps back to the top of the new set of rows.\n'
   '2. The filtering covers the ENTIRE data set — matching parts that were further down the list appear — not just a narrowing of the rows currently on screen.\n'
   '3. Every change — date range, location, Category, Vendor, part search, sort — reloads the rows from the server; while loading the standard reports loading indicator shows, and existing rows are replaced only when the new data returns.'))

# IV-VIS-05 — "dark-mode-legible colors" had no applicable pass criterion.
E(30600,
  'FIX-WORDING: expected 2 "all use dark-mode-legible colors" gave the tester no '
  'pass criterion (audit fail condition F6). Replaced with the concrete by-eye '
  'checks the audit named, in the C30386 repair pattern.',
  'IV spec v3 2026-07-29 S12-R8 dark mode + live build v3.4.1-0ed4433',
  custom_expected=(
   '1. The report supports dark mode.\n'
   '2. The page background, toolbar, cells, and the "—" glyph all use dark-mode-legible colors.',
   '1. The report supports dark mode: the page background, the toolbar, and the table cells all switch to their dark equivalents rather than staying light.\n'
   '2. In dark mode you can read the toolbar text and the cell text at a glance, and the "—" glyph in an empty Category or Vendor cell is clearly visible against the dark cell behind it — it does not disappear into the background.\n'
   '3. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether everything is easy to read in dark mode, and only report it if something is hard to see. (The exact colour values behind this are design-token values the design and engineering team check with their own tooling, not by hand.)'))

# PV-EXP-07 — expected 3 duplicated PV-EXP-06 expected 3.
E(30381,
  'FIX-WORDING (P-DEDUP): expected 3 duplicated PV-EXP-06 (C30380) expected 3, '
  'which already contrasts the PDF wording with the CSV. Removed here and left in '
  'the one case that owns the contrast; step 3 removed with it.',
  'PV spec v4 2026-07-29 S6-R7 null rendering; the "N days" contrast is owned by '
  'PV-EXP-06 (C30380)',
  custom_steps=(
   '1. Download the CSV and locate the null cells.\n'
   '2. Download the PDF and locate the same cells.\n'
   '3. In the PDF, read a non-null Last Sale value.',
   '1. Download the CSV and locate the null cells.\n'
   '2. Download the PDF and locate the same cells.'),
  custom_expected=(
   '1. A null value renders as — (em-dash) in BOTH the CSV and the PDF, in every nullable field: Unit Cost, Sell Price, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max.\n'
   '2. Revenue, Margin, and the count metrics are never null in the exports either ($0.00 / 0.00 / 0).\n'
   "3. In the PDF, Last Sale renders as 'N days' (e.g. 42 days).",
   '1. A null value renders as — (em-dash) in BOTH the CSV and the PDF, in every nullable field: Unit Cost, Sell Price, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max.\n'
   '2. Revenue, Margin, and the count metrics are never null in the exports either ($0.00 / 0.00 / 0).'))

# PV-ROW-07 — expected 4 duplicated PV-EXP-06 expected 2.
E(30347,
  'FIX-WORDING (P-DEDUP): expected 4 duplicated PV-EXP-06 (C30380) expected 2 '
  '(the CSV carrying full untruncated values). Kept in the export case only.',
  'PV spec v4 2026-07-29 S3-R6 truncation; export behaviour owned by PV-EXP-06 (C30380)',
  custom_expected=(
   '1. Long Description, Category, and Vendor text is truncated with an ellipsis on screen.\n'
   '2. The full value shows on native hover (browser tooltip).\n'
   '3. Part # is NEVER truncated - on screen (and in the exports).\n'
   '4. The CSV export carries the full untruncated Description / Category / Vendor values.',
   '1. Long Description, Category, and Vendor text is truncated with an ellipsis on screen.\n'
   '2. The full value shows on native hover (browser tooltip).\n'
   '3. Part # is NEVER truncated - on screen (and in the exports).'))

# PV-ROW-08 — expected 3 duplicated PV-CALC-12, expected 4 duplicated PV-EXP-07.
E(30348,
  'FIX-WORDING (P-DEDUP): expected 3 duplicated PV-CALC-12 (C30370) and expected 4 '
  'duplicated PV-EXP-07 (C30381) expected 1. Trimmed to this case\'s own subject — '
  'the never-null guarantee and the special-order em-dashes.',
  'PV spec v4 2026-07-29 S3-R7 null rendering; the per-field null rules are owned by '
  'PV-CALC-12 (C30370) and the export rendering by PV-EXP-07 (C30381)',
  custom_steps=(
   '1. On the special-order row, read On Hand, Turns / Yr, Min, and Max.\n'
   '2. On the no-activity inventory row, read Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Demand, Revenue, and Margin.\n'
   '3. On the same row, read Unit Cost, Sell Price, Margin %, and Last Sale (assuming no billed units, no revenue, and no recorded sale ever).',
   '1. On the special-order row, read On Hand, Turns / Yr, Min, and Max.\n'
   '2. On the no-activity inventory row, read Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Demand, Revenue, and Margin.'),
  custom_expected=(
   '1. On Hand, Turns / Yr, Min, and Max show — (em-dash) on special-order rows - always.\n'
   '2. The count metrics and money totals are NEVER null: Units Sold / Units Returned / Sold (WO) / Sold (Parts Sale) show 0.00, Demand shows 0, Revenue and Margin show $0.00.\n'
   '3. Unit Cost and Sell Price show — when billed units are zero or less; Margin % shows — when Revenue is zero or less; Last Sale shows — when the row has no recorded sale.\n'
   '4. Every null renders as the same — (em-dash) glyph, in the table and in all exports.',
   '1. On Hand, Turns / Yr, Min, and Max show — (em-dash) on special-order rows - always.\n'
   '2. The count metrics and money totals are NEVER null: Units Sold / Units Returned / Sold (WO) / Sold (Parts Sale) show 0.00, Demand shows 0, Revenue and Margin show $0.00.'))

# SBC-CALC-06 — expected 4 was an unbounded universal.
E(30154,
  'FIX-WORDING: expected 4 "This holds regardless of permission, data, filters, or '
  'sort" is an unbounded universal a tester cannot exhaust (audit fail condition '
  'F6). Replaced with the two concrete variations the audit asked for.',
  'SBC spec v13 2026-07-31 §2/S7-R6 (Subtotal rightmost and pinned) + S11-R1',
  custom_expected=(
   '1. Subtotal is the rightmost column in the table.\n'
   '2. It stays visible pinned at the right edge while the table scrolls horizontally.\n'
   '3. Subtotal values are rendered at font-weight 700 on the header, every customer/asset/invoice row, and the totals row.\n'
   '4. This holds regardless of permission, data, filters, or sort — the Subtotal column is always present, pinned, and bold.',
   '1. Subtotal is the rightmost column in the table.\n'
   '2. It stays visible pinned at the right edge while the table scrolls horizontally.\n'
   '3. Subtotal values are shown in bold on the header, on every customer, asset and invoice row, and on the totals row.\n'
   '4. Check it still holds after two changes: narrow the date range so fewer rows match, then sort by a different column. Subtotal stays the rightmost column, stays pinned, and stays bold both times.'))

# SBC-TREE-01 — expected 3 asserted a colour and a font weight needing dev tools.
E(30121,
  'FIX-WORDING (P-EYE): expected 3 asserted colour #616161 at font-weight 600, '
  'checkable only with dev tools. PV-VIS-02 (C30386) and SBC-EXP-08 were already '
  'repaired to a by-eye check; this case was missed. Same repair applied.',
  'SBC spec v13 2026-07-31 S8-R1/S8-R2 (the count in parentheses is the requirement; '
  'the colour and weight are design-token values)',
  custom_expected=(
   '1. The customer occupies exactly one summary row at the top level of the table.\n'
   '2. The customer\'s name is shown at the start of the row, followed by the number of contributing invoices in parentheses — for example, Acme Corp (5).\n'
   '3. The count is rendered in color #616161 at font-weight 600, the same font size as the name.\n'
   '4. The count reflects the active date range, Product Type, and location — it drops when the range is narrowed; it is not a lifetime count.',
   '1. The customer occupies exactly one summary row at the top level of the table.\n'
   '2. The customer\'s name is shown at the start of the row, followed by the number of contributing invoices in parentheses — for example, Acme Corp (5).\n'
   '3. The count is the same size as the customer name next to it, in a slightly softer grey, and is easy to read.\n'
   '4. The count reflects the active date range, Product Type, and location — it drops when the range is narrowed; it is not a lifetime count.\n'
   '5. Note for the tester: you do not need to measure anything and you do not need any tool for item 3. Just say whether the count looks the right size and is easy to read, and only report it if it looks obviously wrong. (The exact colour and weight behind this are design-token values the design and engineering team check with their own tooling.)'))

# SBC-TREE-13 — expected 4 asserted font weights, step 3 said to use dev tools.
E(30133,
  'FIX-WORDING (P-EYE): expected 4 asserted font-weight 600/700 and step 3 told the '
  'tester to use dev tools. Same repair as PV-VIS-02 / SBC-EXP-08. The column-parity '
  'assertions (items 1-3) are deliberately untouched — they are the load-bearing part.',
  'SBC spec v13 2026-07-31 S13-R5 column parity across row types; the weights are '
  'design-token values',
  custom_steps=(
   '1. Compare the columns of a customer row, an asset row, an invoice row, and the totals row left to right.\n'
   '2. Look at the Date cell on the customer and asset rows.\n'
   '3. Inspect the font weights on a customer summary row (dev tools).',
   '1. Compare the columns of a customer row, an asset row, an invoice row, and the totals row left to right.\n'
   '2. Look at the Date cell on the customer and asset rows.\n'
   '3. Look at a customer summary row and compare how heavy its text looks with the invoice rows beneath it.'),
  custom_expected=(
   '1. Every row type — customer, asset, invoice, totals — renders the same columns in the same left-to-right order.\n'
   '2. A cell with no value for its row (for example the Date cell on a customer or asset row) is left blank and keeps its column position; no value moves into another column.\n'
   '3. The Date cell on the customer summary row is blank.\n'
   '4. Every cell on a customer summary row uses font-weight 600, except the Subtotal cell which uses font-weight 700.',
   '1. Every row type — customer, asset, invoice, totals — renders the same columns in the same left-to-right order.\n'
   '2. A cell with no value for its row (for example the Date cell on a customer or asset row) is left blank and keeps its column position; no value moves into another column.\n'
   '3. The Date cell on the customer summary row is blank.\n'
   '4. A customer summary row reads as heavier than the invoice rows under it, and its Subtotal cell is the heaviest cell on that row.\n'
   '5. Note for the tester: you do not need to measure anything and you do not need any tool for item 4. Just say whether the summary row stands out from the invoice rows and whether its Subtotal looks the boldest, and only report it if it looks obviously wrong. (The exact weights behind this are design-token values the design and engineering team check with their own tooling.)'))

# SBC-VIS-01 — the heaviest un-repaired pixel case in the suite.
E(30185,
  'FIX-WORDING (P-EYE) — the heaviest un-repaired pixel case in the suite: expected '
  '2/4/5/6 asserted 32px, 24px, 2rem, 1px and 24px values and step 1 told the tester '
  'to inspect with dev tools (audit dimension-3 verdict TOOL). Repaired exactly as '
  'PV-VIS-02 (C30386) was, naming design and engineering as the owner of the figures. '
  'This is the case the brief pointed at as C30386 — C30386 itself was already '
  'repaired in the 2026-08-04 push; the un-repaired twins were C30185 and C30305.',
  'SBC spec v13 2026-07-31 Story 20 S20-R1..S20-R8 layout; the pixel figures are '
  'design-token values, not tester-facing requirements',
  custom_steps=(
   '1. Inspect the page background, toolbar surface, and paddings with dev tools.\n'
   "2. Check the toolbar's position against the top of the page and the table against the side edges.\n"
   "3. Compare the title's left edge and the action cluster's right edge with the leftmost/rightmost data-cell positions.\n"
   "4. Check the line between the toolbar and the headers, the date-range picker's dropdown arrow size, the table corners, and the outermost cell paddings.",
   '1. Look at the page background behind the data area and at the toolbar strip above the table, including the space between its controls and the edges of the strip.\n'
   "2. Check whether the toolbar sits flush against the top of the page with no gap, and whether the table reaches the left and right edges next to the side navigation.\n"
   "3. Compare the left edge of the title and the right edge of the action cluster with the leftmost and rightmost columns of data.\n"
   "4. Look at the line between the toolbar and the column headers, the size of the date-range picker's dropdown arrow next to the other filter arrows, the table's corners, and the space at the far left and far right of the rows.\n"
   '5. Open another report in the suite (for example Inventory Value) side by side and compare.'),
  custom_expected=(
   '1. The page has no padding; the page background is the standard blue-grey (#f9fafb in light mode).\n'
   '2. The toolbar surface is white (#ffffff); its padding is 32px top, 24px bottom, and 2rem left and right; it touches the top of the page with no gap, and the table reaches the left and right edges next to the side navigation.\n'
   '3. The left edge of the title and the right edge of the action cluster line up with the leftmost and rightmost data-cell positions.\n'
   '4. A 1px horizontal line in the standard table-header border color separates the toolbar from the column headers.\n'
   "5. The date-range picker's dropdown arrow is 24px, the same size as the other filter dropdown arrows.\n"
   '6. The table has no rounded corners; the leftmost cell (header, body, totals) has 2rem left padding and the rightmost cell 2rem right padding.\n'
   '7. When the table content does not fill the viewport, the blue-grey page background shows through below the table — no white strip.',
   '1. The page background behind the data area is the standard soft blue-grey used across the suite, and the page itself has no border of empty space around it.\n'
   '2. The toolbar strip is white, its controls sit clear of the edges rather than pressed up against them, it sits flush against the top of the page with no gap, and the table reaches the left and right edges next to the side navigation.\n'
   '3. The left edge of the title lines up with the leftmost column of data, and the right edge of the action cluster lines up with the rightmost column.\n'
   '4. A thin dividing line separates the toolbar from the column headers.\n'
   "5. The date-range picker's dropdown arrow is the same size as the other filter dropdown arrows next to it.\n"
   '6. The table has square corners, and the first and last columns sit clear of the left and right edges of the table — the text is not touching the edge.\n'
   '7. When there are too few rows to fill the screen, the blue-grey page background shows through below the table — there is no white strip left over.\n'
   '8. It all looks the same as the other reports in the suite: put another report side by side and nothing should look out of place.\n'
   '9. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether the spacing, the alignment and the dividing line look right and consistent with the other reports, and only report it if something looks obviously off. (The exact figures behind this — 32px/24px toolbar padding, a 1px header border, 2rem edge padding, a 24px arrow — are design-token values the design and engineering team check with their own tooling, not by hand.)'))

# SBR-ASGN-02 — the hedge sat INSIDE the quoted file name.
E(30293,
  'FIX-WORDING: expected 1 put the hedge inside the quoted file name, so a cold '
  'tester could not tell what the file name is meant to be. Parenthetical moved out '
  'of the quotes. No other item touched — the pending-rename note stays.',
  'SBR spec v15 2026-07-29 S15-R3/S15-R4 + Chris Ward 2026-07-29 rename ruling',
  custom_expected=(
   '1. The file downloads as "sales-representative-assignments.csv (the short form "rep" is gone from the file name — confirm the exact final file name in the build)".\n'
   '2. A success toast shows "Success" with the caption "Report downloaded." and auto-fades after 5 seconds.\n'
   '3. The CSV starts with a UTF-8 BOM and its headers, in order, are exactly: Customer Name, Sales Representative, Rep is active?.\n'
   '4. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.\n'
   '5. Note for the tester: this file has only those three columns even if you have several locations in scope. It is a separate customer-to-representative list, not one of the report\'s four downloads, so it has no Location column - do not fail it for that.',
   '1. The file downloads as "sales-representative-assignments.csv" — the short form "rep" is gone from the file name.\n'
   '2. A success toast shows "Success" with the caption "Report downloaded." and auto-fades after 5 seconds.\n'
   '3. The CSV starts with a UTF-8 BOM and its headers, in order, are exactly: Customer Name, Sales Representative, Rep is active?.\n'
   '4. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.\n'
   '5. Note for the tester: this file has only those three columns even if you have several locations in scope. It is a separate customer-to-representative list, not one of the report\'s four downloads, so it has no Location column - do not fail it for that.'))

# SBR-VIS-01 — the same pixel class as SBC-VIS-01.
E(30305,
  'FIX-WORDING (P-EYE): expected 1 asserted 32px / 24px / 2rem paddings and pixel '
  'alignment — the same un-repaired class as SBC-VIS-01 (C30185), while PV-VIS-02 '
  '(C30386) was already repaired to a by-eye check. Same repair applied.',
  'SBR spec v15 2026-07-29 Story 20 layout; the pixel figures are design-token values',
  custom_steps=(
   "1. Look at the toolbar's surface, padding, and how the title and the rightmost control line up with the table columns.\n"
   "2. Look at the page background around the data area, the line between the toolbar and the column headers, and the table's side edges.\n"
   "3. Look at the header cells, the body cells, the pinned Subtotal cells, and the grand Totals indicator's surface.",
   "1. Look at the toolbar strip, at the space between its controls and the edges of the strip, and at how the title and the rightmost control line up with the table columns.\n"
   "2. Look at the page background around the data area, the line between the toolbar and the column headers, and the table's side edges.\n"
   "3. Look at the header cells, the body cells, the pinned Subtotal cells, and the grand Totals indicator's surface.\n"
   '4. Open another report in the suite (for example Parts Velocity) side by side and compare.'),
  custom_expected=(
   '1. The toolbar has a solid white background with padding 32px top / 24px bottom / 2rem left and right; the title\'s left edge aligns with the leftmost data column, and the rightmost toolbar control (the Location filter) aligns its right edge with the rightmost data column.\n'
   '2. The data area sits on the standard blue-grey page background with ZERO horizontal page padding — the toolbar and table run edge-to-edge against the side navigation.\n'
   '3. A thin horizontal separator line sits between the toolbar and the column headers.\n'
   '4. Column-header cells and all body cells render on white; the pinned Subtotal column matches the row background (not a contrasting strip); the grand Totals indicator renders on the white card surface with a thin top border.\n'
   '5. Row types are differentiated by font weight and color, not background color. These rules apply unconditionally whenever the report is rendered.',
   '1. The toolbar has a solid white background and its controls sit clear of the edges rather than pressed up against them; the title\'s left edge lines up with the leftmost data column, and the rightmost toolbar control (the Location filter) lines its right edge up with the rightmost data column.\n'
   '2. The data area sits on the standard blue-grey page background and runs edge-to-edge against the side navigation — there is no strip of empty space down either side.\n'
   '3. A thin horizontal separator line sits between the toolbar and the column headers.\n'
   '4. Column-header cells and all body cells render on white; the pinned Subtotal column matches the row background (not a contrasting strip); the grand Totals indicator renders on the white card surface with a thin top border.\n'
   '5. Row types are told apart by how heavy and what colour their text is, not by a different background colour.\n'
   '6. It all looks the same as the other reports in the suite: put another report side by side and nothing should look out of place.\n'
   '7. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether the spacing and the alignment look right and consistent with the other reports, and only report it if something looks obviously off. (The exact figures behind this — 32px/24px toolbar padding, 2rem edge padding — are design-token values the design and engineering team check with their own tooling, not by hand.)'))


# ── the repeated cosmetic filter-width assertion: five copies, consolidated to one.
#    IV-LOC-06 (C38917) is HELD for Chris's Location ruling, so it keeps the copy
#    and becomes the single owner; the other four drop it.
_WIDTH = ('The Location filter control keeps the same width whichever label it shows — '
          'one location, several, or "All locations" — so the toolbar does not shift as '
          'you change the selection.')

E(38912,
  'FIX-WORDING (P-DEDUP): expected 7 was one of FIVE identical copies of a cosmetic '
  'filter-width assertion sitting inside a load-bearing Location case. Consolidated '
  'to a single owner — IV-LOC-06 (C38917) keeps it because it is held for Chris\'s '
  'Location ruling and may not be edited. Step 7 removed with it and the remaining '
  'item renumbered. Also fixes a STALE version pin in refs: the case cited SBC spec '
  'v12 2026-07-29 when the live spec is v13 2026-07-31.',
  'SBC spec v13 2026-07-31 S4-R12/S4-R12a/S4-R13 + S20-R19',
  custom_steps=(
   '1. Select two or more locations in the Location filter and read the column headers.\n'
   '2. Read the Location cell on a customer row whose invoices are all at one location.\n'
   '3. Read the Location cell on a customer row and an asset row whose invoices span two locations.\n'
   '4. Expand to an invoice row and read its Location cell.\n'
   '5. Open the column selector and look for Location in the list.\n'
   '6. Narrow the Location filter to a single location and read the headers again.\n'
   '7. Change the Location selection between one location, several, and "All locations", watching the filter control\'s width.\n'
   '8. With more than one location still selected, download all four files from the download menu (Summary and Expanded View, PDF and CSV) and read the columns in each one.',
   '1. Select two or more locations in the Location filter and read the column headers.\n'
   '2. Read the Location cell on a customer row whose invoices are all at one location.\n'
   '3. Read the Location cell on a customer row and an asset row whose invoices span two locations.\n'
   '4. Expand to an invoice row and read its Location cell.\n'
   '5. Open the column selector and look for Location in the list.\n'
   '6. Narrow the Location filter to a single location and read the headers again.\n'
   '7. With more than one location still selected, download all four files from the download menu (Summary and Expanded View, PDF and CSV) and read the columns in each one.'),
  custom_expected=(
   '1. With more than one location in scope a Location column is shown, positioned immediately after the Date column.\n'
   '2. A customer or asset row whose invoices are all at one location shows that location\'s name.\n'
   '3. A customer or asset row whose invoices come from more than one location shows "Multiple".\n'
   '4. An invoice row always shows its own exact location — never "Multiple".\n'
   '5. Location is NOT offered in the column selector — it appears and disappears on its own, following the location scope.\n'
   '6. With a single location in scope the Location column is hidden and the surrounding columns close up with no gap.\n'
   '7. ' + _WIDTH + '\n'
   '8. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: a location name on a row whose invoices are all at one location, "Multiple" on a row that aggregates more than one, and the invoice\'s own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)',
   '1. With more than one location in scope a Location column is shown, positioned immediately after the Date column.\n'
   '2. A customer or asset row whose invoices are all at one location shows that location\'s name.\n'
   '3. A customer or asset row whose invoices come from more than one location shows "Multiple".\n'
   '4. An invoice row always shows its own exact location — never "Multiple".\n'
   '5. Location is NOT offered in the column selector — it appears and disappears on its own, following the location scope.\n'
   '6. With a single location in scope the Location column is hidden and the surrounding columns close up with no gap.\n'
   '7. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: a location name on a row whose invoices are all at one location, "Multiple" on a row that aggregates more than one, and the invoice\'s own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)'))

E(38914,
  'FIX-WORDING (P-DEDUP): expected 6 was a copy of the cosmetic filter-width '
  'assertion consolidated onto IV-LOC-06 (C38917). Step 6 removed with it and the '
  'remaining items renumbered.',
  'PV spec v4 2026-07-29 S2-R9 + S6-R11',
  custom_steps=(
   '1. Select two or more locations and read the column headers from the left.\n'
   '2. Read the Location cell on each of the two inventory rows for the part stocked at both locations.\n'
   '3. Read the Location cell on the merged Special Order row.\n'
   '4. Open the column picker and look for Location in the list.\n'
   '5. Narrow to a single location and read the headers again.\n'
   '6. Change the selection between one location, several, and "All Locations", watching the filter control\'s width.\n'
   '7. With more than one location still selected, download the CSV and the PDF and read their columns from the left.',
   '1. Select two or more locations and read the column headers from the left.\n'
   '2. Read the Location cell on each of the two inventory rows for the part stocked at both locations.\n'
   '3. Read the Location cell on the merged Special Order row.\n'
   '4. Open the column picker and look for Location in the list.\n'
   '5. Narrow to a single location and read the headers again.\n'
   '6. With more than one location still selected, download the CSV and the PDF and read their columns from the left.'),
  custom_expected=(
   '1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.\n'
   '2. Each inventory row shows its own location\'s name (an inventory row is one part at one location).\n'
   '3. The merged Special Order row shows "Multiple", because it is summed across the selected locations.\n'
   '4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.\n'
   '5. With a single location in scope the Location column is hidden.\n'
   '6. ' + _WIDTH + '\n'
   '7. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row\'s own location, and "Multiple" on the merged Special Order row.',
   '1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.\n'
   '2. Each inventory row shows its own location\'s name (an inventory row is one part at one location).\n'
   '3. The merged Special Order row shows "Multiple", because it is summed across the selected locations.\n'
   '4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.\n'
   '5. With a single location in scope the Location column is hidden.\n'
   '6. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row\'s own location, and "Multiple" on the merged Special Order row.'))

E(38913,
  'FIX-WORDING (P-DEDUP): expected 8 was a copy of the cosmetic filter-width '
  'assertion consolidated onto IV-LOC-06 (C38917). Step 8 removed with it and the '
  'remaining items renumbered.',
  'SBR spec v15 2026-07-29 S21-R7 + S14-R20',
  custom_steps=(
   '1. Select two or more locations and read the column headers.\n'
   '2. Read the Location cell on the single-location rep\'s summary row.\n'
   '3. Read the Location cell on the rep whose invoices span two locations.\n'
   '4. Expand that rep and read an invoice detail row\'s Location cell.\n'
   '5. Read the Location cell on the Unassigned summary row.\n'
   '6. Check that the pinned Subtotal column is still the rightmost column.\n'
   '7. Narrow to a single location and read the headers again.\n'
   '8. Change the selection between one location, several, and "All Locations", watching the filter control\'s width.\n'
   '9. With more than one location still selected, download all four files from the ⋯ menu (Summary and Expanded View, PDF and CSV) and read the Location column in each one.',
   '1. Select two or more locations and read the column headers.\n'
   '2. Read the Location cell on the single-location rep\'s summary row.\n'
   '3. Read the Location cell on the rep whose invoices span two locations.\n'
   '4. Expand that rep and read an invoice detail row\'s Location cell.\n'
   '5. Read the Location cell on the Unassigned summary row.\n'
   '6. Check that the pinned Subtotal column is still the rightmost column.\n'
   '7. Narrow to a single location and read the headers again.\n'
   '8. With more than one location still selected, download all four files from the ⋯ menu (Summary and Expanded View, PDF and CSV) and read the Location column in each one.'),
  custom_expected=(
   '1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.\n'
   '2. A rep summary row whose invoices are all at one location shows that location\'s name.\n'
   '3. A rep summary row whose invoices span more than one location shows "Multiple".\n'
   '4. An invoice detail row shows that invoice\'s own exact location — never "Multiple".\n'
   '5. The Unassigned summary row follows the same rule as any rep summary row.\n'
   '6. The pinned Subtotal column is still rightmost — the Location column never displaces it.\n'
   '7. With a single location in scope the Location column is hidden.\n'
   '8. ' + _WIDTH + '\n'
   '9. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep\'s row carries that rep\'s location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice\'s own exact location.',
   '1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.\n'
   '2. A rep summary row whose invoices are all at one location shows that location\'s name.\n'
   '3. A rep summary row whose invoices span more than one location shows "Multiple".\n'
   '4. An invoice detail row shows that invoice\'s own exact location — never "Multiple".\n'
   '5. The Unassigned summary row follows the same rule as any rep summary row.\n'
   '6. The pinned Subtotal column is still rightmost — the Location column never displaces it.\n'
   '7. With a single location in scope the Location column is hidden.\n'
   '8. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep\'s row carries that rep\'s location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice\'s own exact location.'))

E(38915,
  'FIX-WORDING (P-DEDUP): expected 8 was a copy of the cosmetic filter-width '
  'assertion consolidated onto IV-LOC-06 (C38917). Step 8 removed with it and the '
  'remaining items renumbered.',
  'TU spec v5 2026-07-29 S7-R13 + S7-R14',
  custom_steps=(
   '1. Select two or more locations and read the column headers from the left.\n'
   '2. Read the Location cell on the single-location technician\'s row.\n'
   '3. Read the Location cell on the technician whose hours span two locations.\n'
   '4. Expand that technician and read the Location cell on a single-location day and on the mixed day.\n'
   '5. Read the Location cell on the Summary row at the bottom.\n'
   '6. Open the Column Selection control and look for Location in the list.\n'
   '7. Narrow to a single location and read the headers again.\n'
   '8. Change the selection between one location, several, and "All Locations", watching the filter control\'s width.\n'
   '9. With more than one location still selected, download both PDF views and the CSV and read their columns from the left.',
   '1. Select two or more locations and read the column headers from the left.\n'
   '2. Read the Location cell on the single-location technician\'s row.\n'
   '3. Read the Location cell on the technician whose hours span two locations.\n'
   '4. Expand that technician and read the Location cell on a single-location day and on the mixed day.\n'
   '5. Read the Location cell on the Summary row at the bottom.\n'
   '6. Open the Column Selection control and look for Location in the list.\n'
   '7. Narrow to a single location and read the headers again.\n'
   '8. With more than one location still selected, download both PDF views and the CSV and read their columns from the left.'),
  custom_expected=(
   '1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.\n'
   '2. A technician whose hours were all clocked at one location shows that location\'s name.\n'
   '3. A technician whose hours span more than one selected location shows "Multiple".\n'
   '4. An expanded day row shows the exact location when that day\'s hours were all at one location, and "Multiple" when the day spans more than one.\n'
   '5. The Summary row leaves the Location cell blank.\n'
   '6. Location is never listed in the Column Selection control — it follows the location scope on its own.\n'
   '7. With a single location in scope the Location column is hidden.\n'
   '8. ' + _WIDTH + '\n'
   '9. Every download — both PDF views and the CSV — includes the Location column in its on-screen leftmost position, carrying the same values you just read on screen.',
   '1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.\n'
   '2. A technician whose hours were all clocked at one location shows that location\'s name.\n'
   '3. A technician whose hours span more than one selected location shows "Multiple".\n'
   '4. An expanded day row shows the exact location when that day\'s hours were all at one location, and "Multiple" when the day spans more than one.\n'
   '5. The Summary row leaves the Location cell blank.\n'
   '6. Location is never listed in the Column Selection control — it follows the location scope on its own.\n'
   '7. With a single location in scope the Location column is hidden.\n'
   '8. Every download — both PDF views and the CSV — includes the Location column in its on-screen leftmost position, carrying the same values you just read on screen.'))
