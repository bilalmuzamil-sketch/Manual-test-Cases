# SV-11869 — Customer Invoice report: apostrophe before a line text starting with =, +, -, @, tab, CR (QA on staging, 28 Oct 2026)

Ticket: https://shopview.atlassian.net/browse/SV-11869 · TESTING STAGE · labels none · QA Assignee Bilal (checked 28 Oct).
Checklist: Nemanja's test plan (comment 79675) + description + Chris 79663 (every row's text incl. parts and discounts; QuickBooks never gets it; PRD S3-R8a v17).
Mode: QA lead asleep and told me to continue unattended — no recording, no technical section, scripted ("API") way with nothing skipped (Rules 104/84/113 asks not possible; defaults used).
Staging build v26.43.2-f8698cb (index.html last-modified Wed 28 Oct 2026 14:06:20 GMT). Production v26.43.2-537378f.

## Set-up (staging, location Staging Heavy Duty - 9919)
Work order **S2-38197** (4 Star Truck Repair, 2011 Hyundai Santa Fe 665), created on screen (Work Orders → Create Work Order).
Lines added **on screen** (New Line → Title / Description, Line Approved, Save & Close): `=Replace hose`/leaking, `-Brake check`/front axle,
`@Alignment`/pulls left, `+Top up coolant`/low level, `Rotate tires`/uneven wear, `Replace = hose`/equals in middle, `ZZ Tab line`/tab start.
The app capitalises the first letter of the Description ("Leaking"). Lines starting with a TAB and a CARRIAGE RETURN can't be typed on screen
(Tab moves focus) — created by the same request the window sends (set-up only). Discount `-10% fleet` (10% of subtotal) and part `-A12`
"Hose clamp" (new inventory part, 5 in stock) added to line 1 on screen (Add Part → More options). Lines completed, part picked, WO
completed and invoiced (INV-S2-38197) by API (set-up).

## The check — on screen: Reports → Export Reports → Customer Invoice → Today → Export (file `ev/customer-invoice-staging.csv`)
| Row | Line text in the file | Result |
|---|---|---|
| labour `+Top up coolant` | `'+Top up coolant - Low level` | one apostrophe ✔ |
| labour `=Replace hose` | `'=Replace hose - Leaking` | ✔ |
| part `-A12` | `'-A12: Hose clamp` | ✔ |
| labour tab-start | `'<TAB>Tab start - tab` | ✔ |
| labour `ZZ Tab line` | `ZZ Tab line - Tab start` | none ✔ (starts with a letter) |
| labour `@Alignment` | `'@Alignment - Pulls left` | ✔ |
| labour `-Brake check` | `'-Brake check - Front axle` | ✔ |
| labour `Rotate tires` | `Rotate tires - Uneven wear` | none ✔ |
| labour CR-start | `'<CR>CR start - carriage return` | ✔ |
| labour `Replace = hose` | `Replace = hose - Equals in middle` | none ✔ (= in the middle) |
| discount `-10% fleet` | `'-10% fleet`, rate -2.50, amount -2.50 | ✔ — amount plain number |
Exactly one apostrophe each (raw bytes checked). Other columns (Customer, Location, Memo) unchanged — no guard there, as Chris scoped (SV-11885).

## Spreadsheet
LibreOffice Calc 24.2 (installed for this), CSV import with **formula evaluation ON**: every guarded cell is text (`t="s"`, no `<f>`), shows the apostrophe.
Control (comparison only, not a ShopView file): the same CSV with the leading apostrophes stripped → `=Replace hose - Leaking` becomes **Err:509**
(`#VALUE!` in xlsx). Calc evaluates only `=`; `+ - @` stay text in Calc even unguarded, so the control proves the risk for `=` only — the guard for the
others is proven in the raw file. Excel / Google Sheets not available here.

## QuickBooks
Staging IS connected (`/api/bookkeeping/products-and-services` 200 with real items; integration authUrl null). QB Unexported = 0 customers/vendors/journal
entries, so INV-S2-38197 synced without error. **What QuickBooks received (no apostrophe) could not be looked at: we hold no QuickBooks login, and
ShopView has no screen or endpoint that shows the synced lines** (Bookkeeping controllers listed: none reads an invoice back). Outstanding item.

## Regression — Sales By Customer CSV
Staging (Download Summary (CSV)) vs production: both UTF-8 BOM, same 3 header lines (Date Range / Product Type / Locations), same 10 columns
(Customer, Labor Delta, … Margin %), no cell starts with an apostrophe. Our invoice's -2.50 appears in 4 Star Truck Repair's Adjustments. PASS.

## Production (before)
Production's New Line window still reads "What Are You Doing? / Why Are You Doing It?" (build v26.43.2-537378f) and its Customer Invoice report writes
line texts as "What are you doing?: …" — so a line text can't start with = there; there's no like-for-like before. Said so in the comment.

## Observation (not this ticket, explained by configuration)
Report InvoiceDate/DueDate read 10-29-2026 / 11-05-2026 while the Finance tab shows Invoice Date Oct 28, 2026 / Due Nov 4. Cause: location
"Staging Heavy Duty - 9919" timezone = **Asia/Karachi** (UTC+5) — invoiced 19:05 UTC = 00:05 Oct 29 there. Production's report shows today's
invoices as 10-28 (Trucks Hill 2). Report follows the location date; the invoice/Finance tab shows Oct 28. Left for the QA lead (Rule 97d) in the register.
