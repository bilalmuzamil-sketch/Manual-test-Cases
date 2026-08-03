# Report Suite — LABEL DIFF: our cases' wording vs the LIVE build

**What this is.** Standing Rule 9 requires every tester-facing word to be the build's own word.
This is the first time a Report Suite build has existed, so this is the first time that can be
checked. Every "build shows" value below was **captured live on 2026-08-03** with evidence saved
under `evidence/`; nothing is inferred (Rule 12).

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBC spec | Confluence 577634305 | **v13**, lastModified 2026-07-31 | 2026-08-03 (sibling worker's live fetch) | **CURRENT** — refreshed capture at `../spec-watch-verification-2026-08-03/live-capture-2026-08-03/` |
| SBR spec | Confluence 585629698 | v15, 2026-07-29 | 2026-08-03 | CURRENT |
| PV spec | Confluence 620888066 | v4, 2026-07-29 | 2026-08-03 | CURRENT |
| TU spec | Confluence 641400833 | v5, 2026-07-29 | 2026-08-03 | CURRENT |
| WIP spec | Confluence 703660034 | v6, 2026-07-29 | 2026-08-03 | CURRENT |
| IV spec | Confluence 720142338 | v3, 2026-07-29 | 2026-08-03 | CURRENT |
| Epic | SV-8582 | not re-read this run | — | **PARTIAL** — Tier-1 currency check not run by me; 6 stories were reopened as of 2026-07-31 and nobody has re-read them |
| Designs | none | N/A — Report Suite is spec-only | — | N/A (no Rule-35 fetch queue) |
| Tech plan | `../tech-plan-2026-07-29/` | 2026-07-29 | not re-fetched | PARTIAL |
| PO answers | Chris Ward through 2026-08-01 | latest ingested | — | CURRENT |
| **LIVE BUILD** | `sv8582.qa.shopview.com` | **`v3.4.1-0ed4433`**, index.html last-modified 2026-08-03 13:40:38 GMT | 2026-08-03 | **PARTIAL — DECLARED NOT FINAL by engineering.** Every row below is provisional; see `RECHECK-QUEUE.md` (status OPEN) |

> **Nothing in this document may be read as final.** The team says the branch is still being
> worked on, so each row is a dated, build-stamped observation queued for re-check (Rule 49).

---

## HOW TO READ THE VERDICTS

- **MATCH** — our wording is already the build's wording. Quoted side by side (Rule 45(e)).
- **EDIT** — our wording differs and ours is the one that should change (the build's label is the
  product's label; Rule 9).
- **DEVIATION** — the build differs from a requirement or a PO ruling. Our case is *right* and the
  build is behind. Each one says whether I believe it is **unbuilt-yet** or a **defect**.
- **REFUTED** — our case asserts something the build contradicts, and the build is the authority
  here because the point is a plain observable fact rather than a product decision.

---

## A. THE HEADLINES (the ones worth waking up to)

### A1. The WIP column selector DOES offer "Location" — our case says it does not
**REFUTED.** This is the question the QA lead asked to be settled live.

| | |
|---|---|
| Our case | **WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)**, expected item 3, verbatim: *"Location is NOT offered in the column-selection control — it appears on its own whenever more than one location is in scope, and is hidden when a single location is in scope."* |
| The build | The Column Selection panel lists, in order: **WO # · Status · Customer · Asset · VIN · `Location` · Advisor · Days Open · Last Activity · Labor Earned · Labor Remaining · Parts Earned · Parts Remaining · Earned · Remaining · Inv. Hrs**. `Location` is a toggle, **off by default**, and it did **not** appear automatically even with two locations in scope. |
| Evidence | `evidence/work-in-progress/menus.json` · `evidence/work-in-progress/ui-observations.json` (`columnSelectorItems` shows `Location` with `toggleOn: false`) |
| Verdict | **Our item 3 is wrong. The other author's automation was right.** |

**The uncomfortable part (Rule 44):** this was already an **internal contradiction inside our own
suite**, and our own audit missed it. **WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)**
and **WIP-PERS-02 = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507)** both list
Location *inside* the fixed toggleable column order — which cannot be true at the same time as
C30467's "NOT offered". The build resolves it in favour of C30466/C30507. C30466's stated order is
an **exact match** to the build's selector order plus Total last.

**Proposed edit — WIP-COL-02 (C30467) expected item 3, replace entirely:**
> *"Location is offered in the column-selection control (between VIN and Advisor) and is off by
> default. Turning it on adds a Location column showing which location each job belongs to."*

Also: WIP-COL-02 items 1 and 2 are **MATCH** — the build's default visible set is exactly
WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining (+ Total), and VIN,
Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining and Inv. Hrs are all
present-and-off. Item 2 must gain **Location** to the off-by-default list.

### A2. The Technician Utilization export menu has FOUR items with different words
**DEVIATION — and I believe this is simply how it shipped, not a defect.**

| | |
|---|---|
| Our case | **TU-EXP-01 = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434)** item 2, verbatim: *"The menu holds: \"Download Summary (PDF)\", \"Download Expanded View (PDF)\", and \"Download (CSV)\"."* — three items |
| Governing text | TU spec v5 **S7-R3/S7-R4** (per the case's own refs) |
| The build | **four** items, in this order: **"Summary (PDF)" · "Summary (CSV)" · "Expanded (PDF)" · "Expanded (CSV)"** — no "Download" prefix on any of them, and grouped Summary-then-Expanded rather than PDF-then-CSV |
| Evidence | `evidence/technician-utilization/menus.json` |

This is a straight product-vs-spec difference on shipped strings. It needs Chris to say which is
right; our case cannot be corrected to the build without his word, because the spec closes the list.
**TU-EXP-02 = [C30435](https://shopview.testrail.io/index.php?/cases/view/30435)** depends on the
same menu and inherits the question.

### A3. The date-range picker is not the eleven-option list the spec closes
**DEVIATION.** Highest-impact wording finding after A1, because it is a shared component.

| | |
|---|---|
| Our case | **SBC-DATE-01 = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102)** item 2, verbatim: *"It offers eleven options, in this order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."* plus item 3 *"There is no \"All Time\" option."* |
| Governing text | SBC spec **S2-R2**, which — as the case's own refs correctly record — **closes** the list, so the closed list IS the requirement (this is why Rule 42 was satisfied here) |
| The build | **nine** presets, in this order: **Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month · Last Month · This Week · Last Week**, alongside an inline month calendar, a live **"Range: N days"** readout and an **Apply** button. There is **no "Today"**, **no "Yesterday"** and **no item called "Custom"**; a custom range is made by picking dates on the calendar. Item 3 is **MATCH** — there is no "All Time". |
| Evidence | `evidence/date-range-picker.json`, `evidence/sales-by-customer/menu-date-range.png` |

**My read: unbuilt-as-specified rather than a defect.** This is the application's standard
date-range component (the same control appears on every report), so "Today"/"Yesterday"/"Custom"
would have to be added to a shared component. It needs a product decision, not a bug ticket.
**Knock-on:** **SBC-DATE-03 = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104)**
opens with *"Choosing \"Custom\" opens a date-picker dialog"* — there is no such item to choose, so
its steps are not executable as written. The 366-day cap it asserts is untested for the same reason.
The same picker serves SBR-DATE, IV-DATE and the other reports' date cases.

### A4. The SBR CSV exports name the rep column "Representative" — a third spelling
**DEVIATION**, and it lands squarely in the middle of an argument we have already had.

Three sources, three different words:

| Source | The word |
|---|---|
| SBR spec **S14-R15/S14-R16** (v15, still live) | `Sales Rep` |
| Chris Ward's **Q5 = A** ruling (which our cases correctly follow, Rule 32) | `Sales Representative` |
| **The build, observed 2026-08-03** | **`Representative`** |

Affected: **SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and
**SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)**.
Evidence: `evidence/location-matrix/sales-by-representative__SINGLE__summary.csv` line 2.

**Do NOT edit these two cases to say "Representative" yet.** Chris ruled on the full word; the
build has produced a third option; that is a question for him, not a wording fix for us.

### A5. The Summary CSV is missing four columns our case enumerates
**DEVIATION — I believe unbuilt-yet.**

**SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** item 2 asserts
thirteen headers *"exactly"*, scope-conditionally (correctly, per Rule 42):
> *"With a single location in scope the headers, in order, are exactly: Sales Representative,
> # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin,
> Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal."*

**The build produced nine:**
`Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal`

Missing: **# Invoices · # Customers · Hrs Worked · Hrs Invoiced**. The underlying data payload
*does* carry `invoice_count`, `hours_worked` and `hours_invoiced`, so the numbers exist and only the
export is short — which is why I read this as an unfinished export rather than a data defect.

### A6. The Expanded CSV's column order differs from our case (and from the spec)
**DEVIATION.** **SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)**
says *"Sales Representative, Date, Invoice #, Customer, Status, Hrs Worked, …"*.
The build gives `Representative, Invoice #, Date, Customer, Invoice Status, [Location,] Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal`.
Two differences beyond the rep label: **Invoice # comes before Date**, and the status column is
headed **"Invoice Status"** rather than "Status" (on screen it is just **"Status"**, so the export
renames it). Column count matches at 15 (single-location).

### A7. The Inventory Value export re-orders the columns and does not end with Total Cost
**DEVIATION.**

| | |
|---|---|
| Our case | **IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)** item 1: *"Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last."* |
| On screen | `Part # · Description · Category · Vendor · [Location] · Qty · Unit Cost · Unit Sell · Margin · Margin % · Total Sell · Total Cost` — Total Cost **is** last |
| In the CSV | `Part # · Description · Category · Vendor · [Location] · Qty · Unit Cost · Unit Sell · Total Cost · Total Sell · Margin · Margin %` — Total Cost is **9th**, and **Margin %** is last |
| Evidence | `evidence/location-matrix/inventory-value__MULTI__plain.csv` vs `evidence/inventory-value/labels.json` |

So the export neither preserves the screen order nor puts Total Cost last. The set of columns is the
same; only the order differs.

### A8. Two PDF exports return HTTP 500 at realistic row volumes
**DEVIATION — I believe a genuine defect, and the most reportable thing here.**

`GET /api/reporting/reports/parts-velocity/export?format=pdf…` and the same for
`inventory-value` return **HTTP 500** with *"An error occurred. We're sorry for this inconvenience,
please try again a bit later later."* (the doubled "later later" is the build's own text) whenever
the scope is the whole parts list. Request ids captured: `785df944-9d18-4814-8f80-aa7925839ecf`,
`46899551-afbc-45b4-b51b-c3a89b82355d`, `13edda95-015a-4910-9f02-c5501b696c1f`,
`1d2e0569-6856-4dbb-89c0-b2767a8e687e`.

Why I call it a defect and not just volume: **the CSV of the identical scope succeeds**, and the
PDF succeeds once the scope is narrowed with a search term. And there is a **friendly guard that
should have caught this** — the CSV path returns a clean `400` with *"This report is too large to
export. Narrow the date range or filters, then try again."* The PDF path 500s instead of using that
guard. Affects the PV and IV export cases; SBC, SBR, TU and WIP PDFs all generated fine.

### A9. "Inv. Hrs" can be shown on the WIP screen but cannot be exported
**DEVIATION — I believe unbuilt-yet.** The WIP Column Selection panel offers **Inv. Hrs**, but the
export endpoint rejects it: `columns=…,invoiced_hours` → `400 {"error":"Invalid column \"…\"."}`.
The accepted export columns are exactly
`wo_number, status, customer, asset, vin, location, advisor, days_open, last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total`.

This breaks **WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511)**
item 1 (*"only the columns currently shown, in the same left-to-right order as the screen"*) for any
tester who turns Inv. Hrs on, and makes **WIP-TOT-02 = [C30495](https://shopview.testrail.io/index.php?/cases/view/30495)**'s
Inv. Hrs total unobservable in an export.

---

## B. THE MATCHES WORTH RECORDING (both texts quoted — Rule 45(e))

These are cases the build **confirms**, and they are the reason the suite is in better shape than
the headlines suggest.

| Case | Our wording (verbatim) | The build (verbatim) | Verdict |
|---|---|---|---|
| **SBC-EXP-01 = [C30159](https://shopview.testrail.io/index.php?/cases/view/30159)** | *"The menu items read, in order: \"Download Summary (PDF)\", \"Download Expanded View (PDF)\", \"Download Summary (CSV)\", \"Download Expanded View (CSV)\" - and there is NO \"Print\" item anywhere in the menu."* | `Download Summary (PDF)`, `Download Expanded View (PDF)`, `Download Summary (CSV)`, `Download Expanded View (CSV)` — and no Print item | **MATCH, exactly, including the order.** Also answers the standing Print question: **no Print control exists on the build** |
| **SBC-COL-01 = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156)** | *"The panel lists nine toggles, in order: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %."* + *"Hovering it shows the tooltip \"Column Selection.\""* + *"there is no Location toggle in this panel"* | Selector: `Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %` · tooltip **`Column Selection`** · no Location toggle | **MATCH** on all three. One nit: our text puts the full stop inside the quotes (`"Column Selection."`); the build's string has no full stop |
| **SBC-COL-02 = [C30157](https://shopview.testrail.io/index.php?/cases/view/30157)** | *"The Customer and Subtotal columns and the chevron control column do NOT appear in the toggle list and are always present."* | Screen shows a chevron column, `Customer` … `Subtotal`; the selector contains none of the three | **MATCH** |
| **SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161)** | *"With a single location in scope the Expanded View CSV has these thirteen columns in this exact order: Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal. When more than one location is in scope the file also carries a Location column — immediately after Date, the position it holds on screen — making fourteen."* | single: `Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal` (13) · multi: the same with `Location` inserted immediately after `Date` (14) | **MATCH, perfectly, both scopes.** The single most impressive case in the suite |
| **SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172)** | *"An error toast is shown each time: \"This report is too large to export. Narrow the date range or filters, then try again.\""* | API returns `400 {"error":"This report is too large to export. Narrow the date range or filters, then try again."}` | **MATCH on the string, verbatim.** The toast rendering itself still needs a UI observation |
| **SBR-COL-01 = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265)** | *"the seven toggleable metric columns … Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %"* + *"The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in the dropdown"* | Selector: exactly those seven · screen: `Date, Invoice, Customer, Status, [Location], Inv. Hrs … Subtotal`, and none of the five is in the selector | **MATCH** on both closed lists |
| **TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859)** | *"an icon button whose tooltip reads \"Column Selection\""* + *"five toggles — Total Hours, WO Hours, Internal Hours, Utilization % and Est. Lost Labor"* + *"Technician is always shown and cannot be t[oggled]"* | tooltip `Column Selection` · selector exactly those five · `Technician` absent from the selector and always rendered | **MATCH** |
| **IV-EXP-01 = [C30587](https://shopview.testrail.io/index.php?/cases/view/30587)** | *"an option labeled \"Download (PDF)\" and an option labeled \"Download (CSV)\""* | `Download (PDF)`, `Download (CSV)` | **MATCH** |
| **IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551)** | *"…Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost"* + *"the automatic Location column also appears, between Vendor and Qty on Hand"* | `Part #, Description, Category, Vendor, [Location], Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost` | **MATCH on order and on Location's position.** One **EDIT**: the build's header is **`Qty`**, not `Qty on Hand` |
| **WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516)** | *"On screen the headers read \"Asset\" and \"Location\"."* / *"In BOTH the PDF and the CSV, the same two columns are headed \"Unit\" and \"Branch\"."* | screen: `Asset`, `Location` · CSV: `"WO #",Status,Customer,**Unit**,VIN,**Branch**,Advisor,…` | **MATCH — the case predicted this exactly and it is confirmed live.** Its open item 4 is now answered: the export header still reads `Unit`, and the cell carries the **unit number**, not the VIN |
| **WIP-PERS-01 = [C30506](https://shopview.testrail.io/index.php?/cases/view/30506)** | *"The Total column is always shown and cannot be turned off — it is not offered in the control at all."* | `Total` is absent from the 16-item selector and always rendered | **MATCH** |
| **WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)** | *"WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total"* | the selector's order is that list minus Total, and Total renders last | **MATCH** |
| **WIP tab labels** (WIP-TAB / WIP-SUM group) | our cases use *"Approved - partially completed"* / *"Approved - not started"* | build: **`Approved - Partially Completed (114)`**, **`Approved - Not Started (33)`**, **`Completed (29)`**, **`Estimates (141)`** | **EDIT** — the build title-cases every word and shows a live count in brackets |
| **The `"Locations:"` line** (SBC-EXP-03/09, SBR-EXP-02, PV-EXP-02, TU-EXP, WIP-EXP-02, IV-EXP-02) | *"Each file (PDF and CSV) carries a \"Locations:\" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build)"* | It is the **very first line** of every CSV, e.g. `"Locations: Staging Heavy Duty - 9919"` — and with everything in scope it reads **`"Locations: All locations"`** rather than naming them | **MATCH**, and the open "exact position" question is now answered: **first line**. **EDIT** worth making: say that an all-locations scope prints the words *All locations* rather than a list of names |
| **IV export "As of" line** | IV-DATE cases refer to an as-of date | The IV CSV carries **`"As of: 2026-08-03"` as line 1, above the Locations line** | **MATCH**, position now pinned |

---

## C. SMALLER LABEL EDITS (build's word on the left of the arrow is what our cases should adopt)

| Our wording | The build | Cases affected |
|---|---|---|
| "All Locations" (option in the Location filter) | **`All locations`** (lower-case L), and the filter also offers a **`Clear all`** action our cases never mention | TU-LOC-01 = [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) and every LOC/FLT case that names the option |
| "Qty on Hand" | **`Qty`** | IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551), IV column/sort/export cases |
| "Turns / Yr" | **`Turns/Yr`** (no spaces) | PV-ROW-06 = [C30346](https://shopview.testrail.io/index.php?/cases/view/30346), PV column cases |
| "Status" (SBR export header) | **`Invoice Status`** in the export; `Status` on screen | SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) |
| — (not mentioned) | the empty-export toast reads **`Empty export`** / **`Export didn't yield any results`** with a `Close` action | SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) and the other no-match export cases, which currently say the export *"still downloads — no error and no warning is shown"* → **REFUTED**: the build shows a warning toast and starts **no** download |
| — (not mentioned) | the export overflow button's accessible name is **`Export report`**; the column button's is **`Column Selection`** | the VIS / accessibility cases in each report |
| "Product Type" options | **`Parts & Service`** · **`Parts only`** · **`Service only`** | SBC-TYPE-01, SBR-TYPE-01 and the Product Type cases |
| "Invoice Status" options | **`All Statuses`** · **`Paid`** · **`Partially Paid`** · **`Unpaid`** | SBR-STAT group |
| PV "Type" options | **`Both`** · **`Inventory`** · **`Special Order`** | PV-FILT-01 = [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) — **MATCH** on the rename Chris made |

---

## D. COUNTS

| | |
|---|---|
| Reports whose labels were captured live | **6 of 6** |
| Quoted strings our cases assert, across the suite | **337** |
| Candidates the automated sweep raised | **216** (`evidence/label-diff-candidates.json`) — most are toast/dialog strings that need an interactive step, not static page text |
| **Discrepancies confirmed by observation and adjudicated here** | **9 headline + 9 smaller = 18** |
| Of those: **EDIT ours** | 7 |
| Of those: **DEVIATION (ours right, build behind)** | 8 — of which **1 I read as a defect** (A8, the PDF 500s) and **7 as unbuilt-yet or a product question** |
| Of those: **REFUTED (ours wrong on a plain fact)** | 3 — A1 (WIP Location toggle) and the no-match-export "no warning" claim, plus the "Custom" date item |
| **MATCHES recorded with both texts quoted** | **16 groups**, including two exact closed-list matches (SBC-EXP-03, SBR-COL-01) |

**Honest limit:** this document covers the labels that are visible on page load, in the menus, in
the filter option lists and in the generated CSV files. Labels that only appear after a multi-step
interaction — most toasts, the deactivation dialog, the tree-expansion controls, the mobile layout —
are **not yet captured** and are listed as remaining work in `SUMMARY-FOR-QA-LEAD.md`. I have not
described a single one of them as verified.
