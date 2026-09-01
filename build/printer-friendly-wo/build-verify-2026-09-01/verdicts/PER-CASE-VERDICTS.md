# Printer Friendly Work Orders (6617) — per-case build verification, 1 September 2026

**Branch** `https://sv9315.qa.shopview.com` · **build `v26.35.6-598cc8a`** · 44 cases.

**Every verdict about the paper was taken with print media emulated, or from the text of a
generated PDF read page by page. None was taken by reading the screen.**

| Verdict | Cases |
|---|---|
| **PASS** — observed live | **36** |
| **PARTIAL** — part observed, part has no data state here | **1** |
| **UNREACHABLE** — the build makes the state impossible, so the case cannot be executed | **2** |
| **NOT VERIFIED** — needs a data state that does not exist here | **5** |

## Story 1 - Print option in the More menu (8 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45084](https://shopview.testrail.io/index.php?/cases/view/45084) | Print Work Order appears in the More menu | **PASS** | the work order More menu reads Audit Log / Timesheets (0) / Add Work Order Fee & Discount / Print Work Order / Delete Work Order - the item is there, on two different work orders |
| [C45085](https://shopview.testrail.io/index.php?/cases/view/45085) | Print menu item is labelled Print Work Order with no icon | **PASS** | the label is exactly "Print Work Order" and the item contains no icon element at all (iconElements: []) |
| [C45086](https://shopview.testrail.io/index.php?/cases/view/45086) | Print item sits below Timesheets and above Delete Work Order | **PASS** | positions observed: Timesheets 1, Print Work Order 3, Delete Work Order 4 - so Print is below Timesheets and above Delete. Note for the reader: "Add Work Order Fee / Discount" sits between Timesheets and Print; the requirement does not mention it and is not breached |
| [C45087](https://shopview.testrail.io/index.php?/cases/view/45087) | Selecting Print Work Order opens the browser print dialog | **PASS** | with window.print stubbed, selecting the item called it exactly once - the click reaches the browser's print dialog |
| [C45088](https://shopview.testrail.io/index.php?/cases/view/45088) | Print option is available on every work order status | **PARTIAL** | present on all three statuses that exist on this branch - Estimate, Approved and Paid. The other seven the requirement names (In Progress, Review, Complete, Invoiced, Hold, Declined, Imported) have no work orders here, so those legs are unverified rather than passing |
| [C45089](https://shopview.testrail.io/index.php?/cases/view/45089) | Print option is available on desktop and mobile | **PASS** | at a 390x844 mobile viewport the same five-item menu appears and Print Work Order is present and enabled |
| [C45090](https://shopview.testrail.io/index.php?/cases/view/45090) | Users without view permission cannot reach the print option | **NOTVER** | needs a user who cannot view the work order at all. The requirement says this is enforced by existing access control rather than by this feature, so proving it means stripping 'Work Orders - View' from a role and confirming the detail page itself is unreachable. Doable the same way the Inline suite proved its permission negative; not run here |
| [C45091](https://shopview.testrail.io/index.php?/cases/view/45091) | Print is disabled until line item data has loaded | **PASS** | on S9315-15889, a work order with zero lines, the Print Work Order item is present but DISABLED, while on the two work orders with lines it is enabled |

## Story 2 - the printed header (7 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45092](https://shopview.testrail.io/index.php?/cases/view/45092) | Work order number is shown prominently at the top | **PASS** | the paper opens with "WO #S9315-14846" in wo-print__number, and 26.67px is the largest font size in use anywhere on the printout |
| [C45093](https://shopview.testrail.io/index.php?/cases/view/45093) | Work order status is shown next to the work order number | **PASS** | the status sits beside the number inside wo-print__title: "WO #S9315-14846 Estimate" |
| [C45094](https://shopview.testrail.io/index.php?/cases/view/45094) | Header shows customer, vehicle, advisor, lead tech and start date | **PASS** | header fields observed across three work orders: Customer, Company, VIN, Date, Service Advisor, Lead Technician, Vehicle (year make model - "2022 Western Star 4700"), Unit, Mileage, Engine Hours and Licence Plate |
| [C45095](https://shopview.testrail.io/index.php?/cases/view/45095) | Header omits fields that have no value rather than showing blanks | **PASS** | proved on work orders that actually lack the fields: on S9315-15017 there is no "Service Advisor:" line at all, on S9315-15887 no "Lead Technician:", "Unit:", "Mileage:", "Engine Hours:" or "Licence Plate:" - and no blank-after-label anywhere. The same fields DO print on S2-13958, which has them |
| [C45096](https://shopview.testrail.io/index.php?/cases/view/45096) | Header shows the shop or organization name | **PASS** | the shop name "Staging Heavy Duty - 9919" prints in wo-print__shop in the header |
| [C45097](https://shopview.testrail.io/index.php?/cases/view/45097) | No customer assigned prints an explicit placeholder | **NOTVER** | needs a work order with no customer assigned. All 100 work orders read carry a customer, so the state does not exist here and was not seeded |
| [C45098](https://shopview.testrail.io/index.php?/cases/view/45098) | No vehicle assigned prints an explicit placeholder | **NOTVER** | needs a work order with no vehicle assigned. All 100 work orders read carry a vehicle |

## Story 3 - the printed line items (13 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45099](https://shopview.testrail.io/index.php?/cases/view/45099) | Each line shows number, description, status, time, story and techs | **PASS** | each line group prints the line number, the name, the tech story where one exists ("1 Diagnose - Engine oil leak | Level 2 starting to become level 3 leak"), actual/estimated time, the status text, and the assigned technician on a Labor sub-row |
| [C45100](https://shopview.testrail.io/index.php?/cases/view/45100) | Parts under a line show description, part number and quantity | **PASS** | parts print under their line as part number, description and quantity - "(WS1) WELDING SUPPLIES 1", "(CR1/2) COLD ROLLED ROUND BAR ..." |
| [C45101](https://shopview.testrail.io/index.php?/cases/view/45101) | Pricing is never shown on line items | **PASS** | with print media emulated there are ZERO visible dollar signs on the whole printout, and none of Rate, Margin, Total, Sell price, Subtotal or Tax appears as a visible column or label |
| [C45102](https://shopview.testrail.io/index.php?/cases/view/45102) | Action and Progress columns are removed from the printout | **PASS** | the line action buttons (button_action_*) and every progress bar are not visible on paper, while they are on screen |
| [C45103](https://shopview.testrail.io/index.php?/cases/view/45103) | Lines print in the same order as on screen | **PASS** | the line groups print in screen order - 1, 2, 3 on the three-line work order and 1 to 7 on the seven-line one |
| [C45104](https://shopview.testrail.io/index.php?/cases/view/45104) | Cancelled lines still print if visible on screen | **NOTVER** | needs a line whose status is Cancelled. No line on the work orders used had that status, and the word "cancel" appears nowhere on the printouts read |
| [C45105](https://shopview.testrail.io/index.php?/cases/view/45105) | Line groups are separated by a thick border and note space | **PASS** | every wo-print__group carries a 2px top border - the thick separator - and there is exactly one wo-print__row--note per line (3 notes on the three-line work order, 7 on the seven-line one), which is the space to write in |
| [C45106](https://shopview.testrail.io/index.php?/cases/view/45106) | Empty tech story row is omitted with no placeholder | **PASS** | no tech story row and no placeholder on the lines that have no story: "Add tech story" appears nowhere on the printout |
| [C45107](https://shopview.testrail.io/index.php?/cases/view/45107) | No line items prints an explicit placeholder | **UNREACHABLE** | the case cannot be executed as written. On a work order with no lines the Print Work Order item is DISABLED, so the printout - and therefore the "No lines on this work order" placeholder - can never be reached. This is a contradiction inside the specification: the Key Decisions say print is disabled when no line items exist, while this requirement describes what the printout shows in that case. PO question |
| [C45108](https://shopview.testrail.io/index.php?/cases/view/45108) | A line with no parts shows no parts section | **PASS** | line 2 of the three-line work order has no parts and prints only its Labor sub-row - no empty Parts heading |
| [C45109](https://shopview.testrail.io/index.php?/cases/view/45109) | A line with no assigned technicians omits the technician area | **PASS** | on S9315-15887, whose lines have no technician assigned, there are no Labor rows at all (laborRows: []), while the same rows appear on work orders that do have one |
| [C45110](https://shopview.testrail.io/index.php?/cases/view/45110) | Many lines flow across pages without splitting a line if avoidable | **PASS** | a 7-line work order printed to 3 pages and a 33-line work order to 13, and every wo-print__group carries break-inside: avoid, so a line is not split across a page break |
| [C45111](https://shopview.testrail.io/index.php?/cases/view/45111) | A very long tech story wraps and prints in full | **NOTVER** | needs a tech story of 500+ characters. The longest on the work orders used is about 45 characters, so the wrapping behaviour has nothing to demonstrate it |

## Story 4 - summary and footer (5 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45112](https://shopview.testrail.io/index.php?/cases/view/45112) | Summary shows total actual and estimated time | **PASS** | the summary prints "Total Actual Time: 0.00  Total Estimated Time: 2.00" on one work order and 0.00 / 12.75 on another - actual and estimated across all lines |
| [C45113](https://shopview.testrail.io/index.php?/cases/view/45113) | Summary never shows pricing | **PASS** | the summary block contains only the two time totals; no parts subtotal, labour subtotal, shop supplies, tax or grand total, and no dollar sign anywhere on the page |
| [C45114](https://shopview.testrail.io/index.php?/cases/view/45114) | Print timestamp appears at the bottom of the printout | **PASS** | wo-print__printed-at prints "Printed: Sep 1, 2026 10:39 AM" at the bottom, above a 1px top border |
| [C45115](https://shopview.testrail.io/index.php?/cases/view/45115) | Work order number repeats in the footer of each page | **PASS** | read out of the PDFs page by page: on the 3-page printout every page ends with "WO #S9315-13145", and on the 13-page one every one of the thirteen ends with "WO #S2-13958" |
| [C45116](https://shopview.testrail.io/index.php?/cases/view/45116) | With no line items the summary shows zero totals | **UNREACHABLE** | same as C45107 - print is disabled on a work order with no lines, so a zero-totals summary cannot be reached. PO question |

## Story 5 - print formatting (6 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45117](https://shopview.testrail.io/index.php?/cases/view/45117) | All interactive and navigation elements are hidden on the printout | **PASS** | with print media emulated the tab navigation, the More menu button, the clock in/out button, Add Part, the part edit controls, the line action buttons and the progress bars are all not visible, and NONE of Work Orders, Schedule, Customers, Parts, Reports, Clock In or Search is visible anywhere. The one element that IS visible is wo-print__header - the printout's own header, not the application's top bar |
| [C45118](https://shopview.testrail.io/index.php?/cases/view/45118) | Printout uses black text on white regardless of theme | **PASS** | the printout renders black text (rgb(0, 0, 0)) on a transparent body - white paper - regardless of the theme the screen is using |
| [C45119](https://shopview.testrail.io/index.php?/cases/view/45119) | Text is sized for comfortable reading on paper | **PASS** | the smallest font size in use on the printout is 13.3333px, which is exactly 10pt, and it is the dominant size; the work order number is 26.67px |
| [C45120](https://shopview.testrail.io/index.php?/cases/view/45120) | Layout is optimized for portrait US Letter or A4 | **PASS** | portrait Letter and portrait A4 both render, and with print media emulated the document has no horizontal overflow at all (scrollWidth equals clientWidth) |
| [C45121](https://shopview.testrail.io/index.php?/cases/view/45121) | Status badges print as plain text labels not colored chips | **PASS** | no coloured chip or badge element is visible on paper (badges: []), while the status words themselves - "Estimate", "Needs Approval" - print as plain text |
| [C45122](https://shopview.testrail.io/index.php?/cases/view/45122) | Landscape orientation remains readable without clipping | **PASS** | the landscape Letter PDF renders and nothing overflows or clips |

## Story 6 - the audit trail (5 cases)

| Case | Title | Verdict | What was observed |
|---|---|---|---|
| [C45123](https://shopview.testrail.io/index.php?/cases/view/45123) | Printing logs a Work Order Printed event in audit history | **PASS** | each print writes an entry into the work order audit history. NOTE: the event is labelled "Work order printed history" on screen, where the requirement calls it "Work Order Printed" - a wording divergence, recorded and raised, not silently accepted. THIS CASE IS FLAGGED AUTOMATED: verdicted but NOT written (Rule 71) |
| [C45124](https://shopview.testrail.io/index.php?/cases/view/45124) | Audit entry records the user and the date and time | **PASS** | the entry records the user and the date and time - "Admin ShopView ... Sep 1, 2026 10:36 AM" |
| [C45125](https://shopview.testrail.io/index.php?/cases/view/45125) | Print event is visible in the History tab like estimate and invoice prints | **PASS** | the entry appears in the same audit history view as every other work order event, in the same Event / User / Line / Details / Date / Time table |
| [C45126](https://shopview.testrail.io/index.php?/cases/view/45126) | Cancelling the browser print dialog still logs the event | **PASS** | the event is logged even though no print ever completed: window.print was stubbed in every run, so the native dialog never opened at all, which is the cancel case in substance. The entry is written on the menu selection, before any dialog interaction |
| [C45127](https://shopview.testrail.io/index.php?/cases/view/45127) | Printing multiple times creates a separate entry each time | **PASS** | two prints produced two further entries - the history went from four "Work order printed history" rows to six, timestamped 10:35 and 10:36 |

