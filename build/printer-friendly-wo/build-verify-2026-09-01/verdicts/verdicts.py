# verdicts.py — per-case build-verification verdict for suite 6617 (Printer Friendly Work Orders),
# branch sv9315, build v26.35.6-598cc8a, 1 September 2026.
#
# HOW A PRINT LAYOUT WAS VERIFIED WITHOUT A PRINTER, stated up front because every verdict rests on it:
#   * window.print was STUBBED before the menu item was clicked, so the click could be proven to
#     reach it without a native dialog automation cannot see.
#   * page.emulateMedia({media:'print'}) makes the browser apply the @media print rules, so what the
#     paper carries - visibility, colours, font sizes, borders - is read off the live DOM.
#   * PDFs were produced at Letter portrait, Letter landscape and A4, and their TEXT was extracted
#     page by page, which is what settles pagination and the repeated footer.
# No verdict below reads the SCREEN and calls it the printout.
#
# VERDICTS
#   PASS         observed live, with print media emulated where the requirement is about the paper
#   PARTIAL      part observed, part has no data state on this branch; both legs named
#   UNREACHABLE  the build makes the state impossible, so the case as written can never be executed
#   NOTVER       needs a data state that does not exist here and was not seeded; never guessed

V = {
 # ---------------- Story 1 - Print option in the More menu (8) ----------------
 45084: ('PASS', 'A-menu-item',
         'the work order More menu reads Audit Log / Timesheets (0) / Add Work Order Fee '
         '& Discount / Print Work Order / Delete Work Order - the item is there, on two different '
         'work orders'),
 45085: ('PASS', 'A-menu-item',
         'the label is exactly "Print Work Order" and the item contains no icon element at all '
         '(iconElements: [])'),
 45086: ('PASS', 'A-menu-item',
         'positions observed: Timesheets 1, Print Work Order 3, Delete Work Order 4 - so Print is '
         'below Timesheets and above Delete. Note for the reader: "Add Work Order Fee / Discount" '
         'sits between Timesheets and Print; the requirement does not mention it and is not breached'),
 45087: ('PASS', 'A-menu-item',
         'with window.print stubbed, selecting the item called it exactly once - the click reaches '
         "the browser's print dialog"),
 45088: ('PARTIAL', 'B-across-statuses',
         'present on all three statuses that exist on this branch - Estimate, Approved and Paid. The '
         'other seven the requirement names (In Progress, Review, Complete, Invoiced, Hold, Declined, '
         'Imported) have no work orders here, so those legs are unverified rather than passing'),
 45089: ('PASS', 'C-mobile',
         'at a 390x844 mobile viewport the same five-item menu appears and Print Work Order is '
         'present and enabled'),
 45090: ('NOTVER', 'not exercised',
         'needs a user who cannot view the work order at all. The requirement says this is enforced '
         'by existing access control rather than by this feature, so proving it means stripping '
         "'Work Orders - View' from a role and confirming the detail page itself is unreachable. "
         'Doable the same way the Inline suite proved its permission negative; not run here'),
 45091: ('PASS', 'B-across-statuses + F-no-lines',
         'on S9315-15889, a work order with zero lines, the Print Work Order item is present but '
         'DISABLED, while on the two work orders with lines it is enabled'),

 # ---------------- Story 2 - the printed header (7) ----------------
 45092: ('PASS', 'D-print-view + E-header-contents',
         'the paper opens with "WO #S9315-14846" in wo-print__number, and 26.67px is the largest '
         'font size in use anywhere on the printout'),
 45093: ('PASS', 'E-header-contents',
         'the status sits beside the number inside wo-print__title: "WO #S9315-14846 Estimate"'),
 45094: ('PASS', 'D-print-view + probe-omission',
         'header fields observed across three work orders: Customer, Company, VIN, Date, Service '
         'Advisor, Lead Technician, Vehicle (year make model - "2022 Western Star 4700"), Unit, '
         'Mileage, Engine Hours and Licence Plate'),
 45095: ('PASS', 'probe-omission',
         'proved on work orders that actually lack the fields: on S9315-15017 there is no "Service '
         'Advisor:" line at all, on S9315-15887 no "Lead Technician:", "Unit:", "Mileage:", "Engine '
         'Hours:" or "Licence Plate:" - and no blank-after-label anywhere. The same fields DO print '
         'on S2-13958, which has them'),
 45096: ('PASS', 'E-header-contents',
         'the shop name "Staging Heavy Duty - 9919" prints in wo-print__shop in the header'),
 45097: ('NOTVER', 'not exercised',
         'needs a work order with no customer assigned. All 100 work orders read carry a customer, so '
         'the state does not exist here and was not seeded'),
 45098: ('NOTVER', 'not exercised',
         'needs a work order with no vehicle assigned. All 100 work orders read carry a vehicle'),

 # ---------------- Story 3 - the printed line items (13) ----------------
 45099: ('PASS', 'I-line-details + probe-print-final',
         'each line group prints the line number, the name, the tech story where one exists ("1 '
         'Diagnose - Engine oil leak | Level 2 starting to become level 3 leak"), actual/estimated '
         'time, the status text, and the assigned technician on a Labor sub-row'),
 45100: ('PASS', 'I-line-details',
         'parts print under their line as part number, description and quantity - "(WS1) WELDING '
         'SUPPLIES 1", "(CR1/2) COLD ROLLED ROUND BAR ..."'),
 45101: ('PASS', 'D-print-view',
         'with print media emulated there are ZERO visible dollar signs on the whole printout, and '
         'none of Rate, Margin, Total, Sell price, Subtotal or Tax appears as a visible column or label'),
 45102: ('PASS', 'D-print-view',
         'the line action buttons (button_action_*) and every progress bar are not visible on paper, '
         'while they are on screen'),
 45103: ('PASS', 'probe-print-final',
         'the line groups print in screen order - 1, 2, 3 on the three-line work order and 1 to 7 on '
         'the seven-line one'),
 45104: ('NOTVER', 'not exercised',
         'needs a line whose status is Cancelled. No line on the work orders used had that status, '
         'and the word "cancel" appears nowhere on the printouts read'),
 45105: ('PASS', 'probe-print-final',
         'every wo-print__group carries a 2px top border - the thick separator - and there is exactly '
         'one wo-print__row--note per line (3 notes on the three-line work order, 7 on the seven-line '
         'one), which is the space to write in'),
 45106: ('PASS', 'I-line-details',
         'no tech story row and no placeholder on the lines that have no story: "Add tech story" '
         'appears nowhere on the printout'),
 45107: ('UNREACHABLE', 'F-no-lines',
         'the case cannot be executed as written. On a work order with no lines the Print Work Order '
         'item is DISABLED, so the printout - and therefore the "No lines on this work order" '
         'placeholder - can never be reached. This is a contradiction inside the specification: the '
         'Key Decisions say print is disabled when no line items exist, while this requirement '
         'describes what the printout shows in that case. PO question'),
 45108: ('PASS', 'probe-print-final',
         'line 2 of the three-line work order has no parts and prints only its Labor sub-row - no '
         'empty Parts heading'),
 45109: ('PASS', 'probe-omission',
         'on S9315-15887, whose lines have no technician assigned, there are no Labor rows at all '
         '(laborRows: []), while the same rows appear on work orders that do have one'),
 45110: ('PASS', 'J-pagination + probe-omission',
         'a 7-line work order printed to 3 pages and a 33-line work order to 13, and every '
         'wo-print__group carries break-inside: avoid, so a line is not split across a page break'),
 45111: ('NOTVER', 'not exercised',
         'needs a tech story of 500+ characters. The longest on the work orders used is about 45 '
         'characters, so the wrapping behaviour has nothing to demonstrate it'),

 # ---------------- Story 4 - summary and footer (5) ----------------
 45112: ('PASS', 'probe-print-final',
         'the summary prints "Total Actual Time: 0.00  Total Estimated Time: 2.00" on one work order '
         'and 0.00 / 12.75 on another - actual and estimated across all lines'),
 45113: ('PASS', 'D-print-view + probe-print-final',
         'the summary block contains only the two time totals; no parts subtotal, labour subtotal, '
         'shop supplies, tax or grand total, and no dollar sign anywhere on the page'),
 45114: ('PASS', 'probe-print-final',
         'wo-print__printed-at prints "Printed: Sep 1, 2026 10:39 AM" at the bottom, above a 1px top '
         'border'),
 45115: ('PASS', 'J-pagination + probe-omission',
         'read out of the PDFs page by page: on the 3-page printout every page ends with "WO '
         '#S9315-13145", and on the 13-page one every one of the thirteen ends with "WO #S2-13958"'),
 45116: ('UNREACHABLE', 'F-no-lines',
         'same as C45107 - print is disabled on a work order with no lines, so a zero-totals summary '
         'cannot be reached. PO question'),

 # ---------------- Story 5 - print formatting (6) ----------------
 45117: ('PASS', 'D-print-view + E-header-contents',
         'with print media emulated the tab navigation, the More menu button, the clock in/out '
         'button, Add Part, the part edit controls, the line action buttons and the progress bars are '
         'all not visible, and NONE of Work Orders, Schedule, Customers, Parts, Reports, Clock In or '
         'Search is visible anywhere. The one element that IS visible is wo-print__header - the '
         "printout's own header, not the application's top bar"),
 45118: ('PASS', 'D-print-view',
         'the printout renders black text (rgb(0, 0, 0)) on a transparent body - white paper - '
         'regardless of the theme the screen is using'),
 45119: ('PASS', 'D-print-view',
         'the smallest font size in use on the printout is 13.3333px, which is exactly 10pt, and it '
         'is the dominant size; the work order number is 26.67px'),
 45120: ('PASS', 'G-orientation-and-footer',
         'portrait Letter and portrait A4 both render, and with print media emulated the document '
         'has no horizontal overflow at all (scrollWidth equals clientWidth)'),
 45121: ('PASS', 'E-header-contents',
         'no coloured chip or badge element is visible on paper (badges: []), while the status words '
         'themselves - "Estimate", "Needs Approval" - print as plain text'),
 45122: ('PASS', 'G-orientation-and-footer',
         'the landscape Letter PDF renders and nothing overflows or clips'),

 # ---------------- Story 6 - the audit trail (5) ----------------
 45123: ('PASS', 'H-audit-trail',
         'each print writes an entry into the work order audit history. NOTE: the event is labelled '
         '"Work order printed history" on screen, where the requirement calls it "Work Order '
         'Printed" - a wording divergence, recorded and raised, not silently accepted. THIS CASE IS '
         'FLAGGED AUTOMATED: verdicted but NOT written (Rule 71)'),
 45124: ('PASS', 'H-audit-trail',
         'the entry records the user and the date and time - "Admin ShopView ... Sep 1, 2026 10:36 AM"'),
 45125: ('PASS', 'H-audit-trail',
         'the entry appears in the same audit history view as every other work order event, in the '
         'same Event / User / Line / Details / Date / Time table'),
 45126: ('PASS', 'H-audit-trail',
         'the event is logged even though no print ever completed: window.print was stubbed in every '
         'run, so the native dialog never opened at all, which is the cancel case in substance. The '
         'entry is written on the menu selection, before any dialog interaction'),
 45127: ('PASS', 'H-audit-trail',
         'two prints produced two further entries - the history went from four "Work order printed '
         'history" rows to six, timestamped 10:35 and 10:36'),
}
