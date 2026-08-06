# FINDINGS - Report Suite VIU, third session, 2026-08-06

Continues `FINDINGS.md` (first session) and `FINDINGS-SESSION2.md` (second). **Nothing here restates
their verdicts; this file holds only what the third session established.** Read `RESUME.md` first.

The third session's job is the **188 cases with no 6 August verdict** - Sales By Representative's 109
(never opened at all), plus 45 Work In Progress, 17 Parts Velocity, 14 Sales By Customer, 2 Technician
Utilization and 1 Inventory Value.

---

## 1 - The count, re-derived from live rather than copied forward

The brief said 188 and `REMAINING.txt` section A said 188. **Both were independently confirmed**, from a
fresh `get_cases` over every section under group 4281, by reading each case's own build sentence:

| | Count |
|---|---|
| Live under group 4281 | **481** |
| **Ours** (`created_by = 3`) | **476** |
| Foreign (Vladimir Tomovic, C38919-C38923) | **5** - hands off, Rule 38 |
| Carrying a verdict on the build now running, `v3.5-7168d14` | **69** |
| Carrying `v3.5-16cf83f` + 8/6/2026 (first session, superseded build) | **219** |
| Carrying `v3.4.1-3d03023` + 8/4/2026 | **176** |
| Carrying `v3.5-16cf83f` + 8/5/2026 | **7** |
| Carrying no build sentence at all | **5** |
| **No 6 August verdict - the outstanding work** | **176 + 7 + 5 = 188** |

**69 + 219 + 188 = 476. I agree with the previous worker's count.**

Live marker census at the start of this session, read from the cases and not from notes:
**357 `READY` + 77 `READY - EXPECT FAIL` + 42 `HOLD` = 476, exactly one marker each.**

---

## 2 - Source currency, checked at session start (Rule 31)

| Source | Live version | Verdict |
|---|---|---|
| Sales By Customer, page 577634305 | **15** (2026-08-05T17:53:06Z) | CURRENT, unmoved |
| Sales By Representative, page 585629698 | **17** (2026-08-05T17:53:08Z) | CURRENT, unmoved |
| Parts Velocity, page 620888066 | **5** (2026-08-05T13:21:40Z) | CURRENT, unmoved |
| Technician Utilization, page 641400833 | **6** (2026-08-05T13:33:10Z) | CURRENT, unmoved |
| Work In Progress, page 703660034 | **9** (2026-08-05T17:54:07Z) | CURRENT, unmoved |
| Inventory Value, page 720142338 | **4** (2026-08-05T13:33:13Z) | CURRENT, unmoved |

These are the **Confluence page versions**, not the version written inside each page body - that
in-body field is the known Rule-31(a) trap.

**Build in force at session start: `v3.5-7168d14`**, `index.html` last-modified Thu 06 Aug 2026
08:32:37 GMT, etag `207df1aa07090fcf99e98e67f1d1d6d5`, read at **09:54:19Z**. Same marker the second
session ended on, so **the branch did not move between the two sessions.**

### Epic SV-8582 - and it has changed since the second session

**104 children now, not 105.** Verified two ways (`parent=SV-8582` and `"Epic Link"=SV-8582`), key sets
equal, no paging remainder. The difference is **[SV-8821](https://shopview.atlassian.net/browse/SV-8821)**,
which was **closed OBSOLETE and had its parent removed** by someone else between the second session's
read and this one. Read live: `Bug` - **parent NONE** - OBSOLETE - Low - Product Area Work Orders.

**Not reversed, and not re-parented.** It is another person's triage under our shared account, and
Rule 53's corollary says a change we did not make is read as their deliberate action and asked about,
never undone. It is worth noting only because SV-8821 is the one ticket the 2026-08-04 pass was
*corrected* to parent onto this epic, so that correction has now been undone by someone else, and that
is the QA lead's call to make rather than ours.

---

## 3 - The nine tickets the second session filed: all nine verified, nothing to fix

The brief asked whether SV-8962 to SV-8970 actually carry a correct source block, the right type, the
right parent and priority Low. **Read back live, all nine pass on every count.**

| Ticket | Type | Parent | Priority | Source block | Cited requirements checked against the live spec |
|---|---|---|---|---|---|
| SV-8962 | Story Defect | SV-8616 | Low | present | SBC S18-R2, S18-R5 - both present in v15 |
| SV-8963 | Story Defect | SV-8608 | Low | present | SBC S10-R1, S10-R3 - both present |
| SV-8964 | Story Defect | SV-8613 | Low | present | SBC S15-R7 - present |
| SV-8965 | Story Defect | SV-8617 | Low | present | SBC S20-R8, R9, R10, R12, R14 - all five present |
| SV-8966 | Story Defect | SV-8604 | Low | present | SBC S6-R5, S6-R6, S18-R9 - all present |
| SV-8967 | Story Defect | SV-8660 | Low | present | WIP S4-R5 - present in v9 |
| SV-8968 | Story Defect | SV-8663 | Low | present | WIP S7-R1, S7-R2, S7-R4 - all present |
| SV-8969 | Story Defect | SV-8663 | Low | present | WIP S7-R3, S7-R5 - both present |
| SV-8970 | Story Defect | SV-8666 | Low | present | WIP S10-R1 - present |

**22 cited requirement anchors, 22 found in the live spec bodies at the versions cited, 0 missing.**
Every one is Open, and none has Product Area, which is correct for a Story Defect. No repair needed -
this is a clean audit result rather than an absence of checking.

---

## 4 - Sales By Representative, driven live for the first time

Report path `/reports/sales-by-representative`. Data endpoint
`GET /api/reporting/reports/sales-by-representative`, per-rep detail rows at
`.../sales-by-representative/{repKey}/invoices`, exports at `.../sales-by-representative/export`.
The Unassigned bucket's rep key is the all-zero uuid `00000000-0000-0000-0000-000000000000`;
`unassigned` as a key is rejected with `Invalid rep key "unassigned"`.

**Date parameters:** every preset is sent as `range=custom&start_date=...&end_date=...`. The API also
accepts the bare preset names `this_month`, `this_year`, `today` - but **rejects `last_12_months`**
with `Selected date range is invalid.`, which is the first preset the picker offers. Because the SPA
always expands a preset into explicit dates, that rejection is not reachable from the screen; it is
recorded in `API-ASK.md` rather than filed (Rule 51).

### What passes, established live

- **Export menu: exactly the four actions S14-R1 names, verbatim** - "Download Summary (PDF)",
  "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)".
- **Column selector: exactly the seven toggles S20-R2 names**, all on by default, and the five
  always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in it (S20-R3).
- **Product Type: three options**, "Parts & Service" / "Parts only" / "Service only" (S3-R1).
- **Invoice Status: exactly four**, "All Statuses" / "Paid" / "Partially Paid" / "Unpaid" (S4-R1).
- **Toolbar control order, left to right: overflow exports, Column Selection, Show Unassigned, Date
  Range, Product Type, Invoice Status, Location** - exactly S18-R7.2, which also puts Show Unassigned
  between the column selector and the date picker (S22-R1) and Location rightmost (S21-R1).
- **Lazy detail fetch (S6-R2):** the first chevron activation fires exactly one
  `.../{repId}/invoices` request; **a second expansion of the same rep fires none** - it is cached.
- **Header chevron (S6-R5, S6-R6):** expands every visible rep in one action and the glyph tracks
  state, `keyboard_double_arrow_down` to `keyboard_double_arrow_up`.
- **Per-row chevron accessible name (S18-R9):** "Expand ZZAUTOTEST RepA" / "Collapse ZZAUTOTEST RepA",
  the `Expand {rep name}` form the requirement asks for.
- **Status badge (S8-R2, S8-R3, S8-R4):** reads "Unpaid", dark red `rgb(184, 24, 0)` on light red
  `rgb(255, 224, 219)`, Quasar's canonical `bg-red-1 text-red-10` tokens, vertically centred.
- **Links (S12-R1, S12-R2, S12-R4, S12-R5):** the invoice number is a real anchor to
  `/workorders/{id}/finance` in theme blue `rgb(34, 118, 218)` with no underline at rest; the customer
  name is an anchor to `/customers/{id}` in body black `rgb(0, 0, 0)`, no underline at rest.
- **Subtotal (S10-R1, S10-R2, S10-R3):** rightmost, `position: sticky`, and **bold on the header
  (800) and on every rep row and the Totals row (700)**.
- **Show Unassigned (S22-R3, S22-R4):** sends `showUnassigned=1`, adds one row labelled exactly
  "Unassigned", **pinned to the top and still pinned after a sort**, and the grand Totals include it
  ($810.76 + $224.92 + $799.84 = $1,835.52).
- **Server-side sorting (S11-R1):** all eight financial columns carry a sort control and each sends
  `pagination[sortBy]` + `pagination[descending]`; the sorted header exposes `aria-sort="ascending"`
  or `"descending"`.
- **Hiding the active sort column (S20-R9):** sorted by Margin % descending, then hidden - the row
  order held, the saved view kept `sortBy: margin_pct, descending: true`, and **re-showing the column
  brought the descending indicator back**.
- **Column toggle (S20-R4, S20-R7):** applies at once with no confirm step and **fires no server
  request**.
- **Persistence (S23-R1):** with a genuinely non-default saved view - This Year, Lethbridge only,
  Service only, Unpaid, Show Unassigned on, sorted by Subtotal descending, two metric columns - the
  reload fired **exactly one request and it carried every one of those settings**. See section 6 for
  the false defect this disproved.
- **First visit / cleared storage (S23-R4):** all defaults - This Month, Parts & Service, All
  Statuses, All locations, all seven metric columns, A to Z - and the saved view is written on load.
- **Location column conditional (S21-R7, S21-R8):** present when both locations are in scope, and
  **absent when the scope resolves to one location** - proven both on screen and in the CSV.
- **`(N)` count contrast (S18-R11):** `rgb(97, 97, 97)` at 13px on the body surface, about 5.8:1,
  comfortably over the 4.5:1 floor.
- **Empty-data export (S14-E3):** all four downloads generate against a zero-row filter set; the CSVs
  come back as a header-row-only file **with the UTF-8 BOM** and no Totals row.
- **Reversed custom range** is refused: `Invalid start date provided. Must be less than end date.`

### THE HISTORIC EXPORT GAP IS CLOSED - Location is in both spreadsheets

This is the ground on which our worst recorded defect sat: **SBR-EXP-10 =
[C30285](https://shopview.testrail.io/index.php?/cases/view/30285)** and **SBR-EXP-11 =
[C30286](https://shopview.testrail.io/index.php?/cases/view/30286)** enumerated the CSV headers
*"exactly"* without Location, so a tester on a correct build would have failed it (Standing Rules
40-45 all trace to this). **Read from the files today, S14-R20 is met:**

- Summary CSV header: `Representative,Location,"Inv. Hrs",...` - Location present, in the position it
  occupies on screen.
- Expanded CSV header: `...,"Invoice Status",Location,"Hrs Worked",...` - likewise.
- Both files carry the `"Locations: All locations"` line the requirement asks for, and it correctly
  reads the location's own name when a single location is in scope.
- With one location in scope the column is correctly **absent** from both files.

Both cases are being rewritten **scope-conditionally under Rule 42** - no closed "exactly these
headers" list without a version-pinned anchor.

### The deviations, each with the requirement it breaches

| # | What the build does | Requirement | Status |
|---|---|---|---|
| D1 | Summary CSV omits **# Invoices, # Customers, Hrs Worked, Hrs Invoiced**, and ends with a **Totals row** | S14-R15 | **already filed - [SV-8880](https://shopview.atlassian.net/browse/SV-8880)**, still reproduces |
| D2 | Both CSVs write money as `"$1,979.40"` and Margin % as `100.0%` | **S14-R17** - "plain numbers for re-pivoting - no currency symbol, thousands separators, or parentheses... Margin % is a number to one decimal (e.g., 45.2)" | new |
| D3 | Expanded CSV and PDF put **Invoice # before Date** and head the column **"Invoice Status"** not "Status" | S14-R16 column order and heading list | new |
| D4 | Expanded CSV emits a **rep-level row before each rep's invoices, plus a Totals row** | S14-R16 - "one row per invoice flattened across all reps" | new |
| D5 | Export filenames carry a range suffix - `sales-by-representative-summary-this_month.csv` | S14-R15, S14-R16, **S14-R11** - the names are given verbatim and are "deterministic" | new |
| D6 | **Expanded View PDF is one flat table with a grand Totals row, on A3** | **S14-R6** - one page-block per rep, page break before each new rep, per-rep totals row, "no grand-totals row"; **S14-R3** - A4 | new |
| D7 | **PDF heading end date is one day later than the range asked for** | S2-R5 | **already filed - [SV-8937](https://shopview.atlassian.net/browse/SV-8937)**; see section 5 |
| D8 | Detail rows within one day run by **timestamp descending**, so invoice numbers come out arbitrary | **S6-R9** - "tie-broken by invoice number ascending by the numeric portion... (e.g., P100 and S100 **on the same day**)" | new |
| D9 | The **third click on a sorted header re-orders in the browser and sends no request** | S11-R5 read with S14-R2a and server-side sorting | new |
| D10 | Date presets are **Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week** - **no Today, no Yesterday** | S2-R2 names Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom | **question for Chris, not filed - see section 7** |
| D11 | A custom span of **367 inclusive days is accepted**; 368 is refused with "Date range cannot exceed 366 days." | S2-R6 - the cap is 366 inclusive days | new, boundary pinned exactly |
| D12 | An **invalid saved date range leaves the report empty** - the trigger reads "Select Date Range", no request is sent, and the table shows the no-data message | S23-R3 - a stale value "falls back to that setting's default" | new; the "never errors" half does pass |
| D13 | The empty-state message reads **"No sales data found for the selected filters."** | **S16-R1** - the message is given verbatim as "No sales activity matches the current filters." | new |
| D14 | **Column-header row is `position: static`** and the **Totals row is `position: static`** | **S10-R6** header sticky to the top during vertical scroll; S10-R5 Totals row "sticky at the bottom of the scroll area" | new |
| D15 | Every body row's background is `rgb(249, 250, 251)` - **the same pale grey as the page**, not white | **S18-R7.4** "column-header cells and all body cells render on white"; S18-R7.1 page is the blue-grey | new; same class as SV-8965 (SBC) and SV-8970 (WIP) |
| D16 | The **title's left edge is at x=61 while the first data column starts at x=278**, and the **Location filter's right edge is at 1594 while the Subtotal column ends at 1650** | **S18-R1** - the title aligns with the leftmost data column and the rightmost control with the rightmost data column | new |
| D17 | **Chevrons measure 22x22 px** | **S17-R6** - chevrons present a touch target of at least 44x44 | new |
| D18 | **No mobile external totals bar** - at 390 px the full in-table Totals row is kept | **S10-R5** mobile branch - "a simplified external totals bar directly below the table and outside its horizontal scroll container, showing Totals left and the grand Subtotal right" | new |
| D19 | Accessible names: overflow exports is **"Export report"**, the column selector is **"Column Selection"**, the header chevron is **"Expand all representatives"** | **S18-R9** gives them verbatim as "Report actions", "Show or hide columns", "Expand all reps" / "Collapse all reps" | new |

**Mobile passes that matter:** at 390x844 the table scrolls sideways on its own (`scrollWidth` 1335
against `clientWidth` 370) while **the page itself does not** - `document.scrollWidth` is 390, equal to
the window - which is S17-R4's real point.

### D9 - the sort defect, and how it was proven

Four consecutive clicks on the Subtotal header, watching requests rather than the screen:

| Click | Request sent | On-screen order | `aria-sort` |
|---|---|---|---|
| 1 | `subtotal:false` | RepA $224.92, RepB $799.84 | ascending |
| 2 | `subtotal:true` | RepB $799.84, RepA $224.92 | descending |
| **3** | **none** | RepA, RepB - flipped back | ascending |
| **4** | **none** | RepB, RepA - flipped again | descending |

So the direction keeps toggling, which S11-R5 wants, **but from the third click onward the report stops
asking the server and re-sorts the rows already in the browser.** With one page of reps the answer
happens to be right, which is why this is easy to miss. **Consequence, stated as a consequence and not
as an observation:** the report pages at 30 rows, so on an organisation with more than 30 contributing
reps the third click would re-order only the visible page instead of re-querying, and the report would
show the wrong reps. That consequence was **not** reproduced - this estate has four reps.

### D8 - the tie-break defect, proven on 849 rows

The Unassigned bucket over This Year returns **849 invoice rows in one response**. The primary sort is
right - Aug 06, then Aug 04, Jul 31, Jun 12, Jun 11, Jun 10 - but **within a single day the order is by
timestamp descending**, which makes the invoice numbers arbitrary. On 2026-06-12 the build returns
`S-15487, P-117, P-113, S-15750, S-15646, S-15828, S-15812`; S6-R9 requires the same-day set to run
`P-113, P-117, S-15487, S-15646, S-15750, S-15812, S-15828`.

**The reading is the spec's own, not ours:** S6-R9 illustrates a date tie with "(e.g., P100 and S100
**on the same day**)", so a date tie is a same-day tie, and the tie-break is owed.

---

## 5 - Two already-filed tickets that this report widens: reported, deliberately not edited

**[SV-8937](https://shopview.atlassian.net/browse/SV-8937)** - "PDF heading shows an end date one day
later than the range asked for, **on three reports**" - names Parts Velocity, Technician Utilization
and Sales By Customer. **It affects Sales By Representative too**, so the count is four. Controlled
against three different end dates, including a month boundary:

| Range asked for | CSV first line | PDF heading |
|---|---|---|
| 1 Jan to **6 Aug** 2026 | `Date Range: Jan 1, 2026 - Aug 6, 2026` | `Date Range: Jan 1, 2026 - Aug 7, 2026` |
| 1 Jan to **15 Jul** 2026 | `... - Jul 15, 2026` | `... - Jul 16, 2026` |
| 1 Jan to **31 Mar** 2026 | `... - Mar 31, 2026` | `... - Apr 1, 2026` |

The **start** date is never shifted (10 Feb stays 10 Feb), so it is the end date only. Re-confirmed on
Sales By Customer as well, so this is not an SBR-only reading of the same ticket.

**[SV-8964](https://shopview.atlassian.net/browse/SV-8964)** - the Expanded View PDF on A3 instead of
A4 - is written against Sales By Customer and cites SBC's S15-R7. **SBR's Expanded View PDF is A3 as
well** (1190.55 x 841.89 pt against the Summary's 841.89 x 595.276).

**Neither ticket was edited.** `RESUME.md` section 8 records that the QA lead is retrofitting SV-8937's
mechanism and scope in one pass of his own, and widening someone's ticket mid-pass would cut across
that. Both are listed here so the retrofit has the fourth report and the second PDF in front of it.

**One honest wrinkle on the A3 finding:** SBR's own **S14-R3 says "A4 portrait"** while SBC's S15-R7
says "A4 landscape", and SBR's Summary PDF is A4 **landscape**. A sixteen-column table cannot fit A4
portrait, and the two specifications plainly disagree about the same rendering engine. **The A3 half is
unambiguous and is a defect on either reading; the portrait/landscape half is a question for Chris**
(section 7) and is **not** being resolved by looking at what the build does (Rule 58).

---

## 6 - A false defect this session disproved before writing it down

**"The report fires two requests on load and the first one has no location scope, so S23-R1's
'restored before the first data fetch' is broken."** That is what the load trace shows, and it is
wrong.

The control was to save a genuinely non-default view and reload. With `locationIds` set to Lethbridge
alone, **the reload fired exactly one request, and it carried `locations=f8a8b802...` along with
`productType=service`, `invoiceStatus=unpaid`, `showUnassigned=1`, `sortBy=subtotal`,
`descending=true` and the reduced column set.** The double request happens **only** on a first visit
with no saved view, where the first call omits `locations` and the second sends all of them - and since
the default is All locations, both calls describe the same scope and no wrong data is ever displayed.
It is one redundant request on a cold start, not a broken restore.

**S23-R1 therefore PASSES**, and the redundant cold-start request is recorded as a deliberate decision
rather than promoted into a defect.

---

## 7 - New questions for Chris Ward (added to `QUESTIONS-FOR-CHRIS.md`)

Both are cases where **a source is ambiguous or two sources disagree, and Rule 58 forbids settling that
by looking at the build.** Neither has changed any case's expectation.

1. **The date presets.** SBR's S2-R2 lists Today, Yesterday, This Week, This Month, Last Month, This
   Year, Last Year, This Quarter, Last Quarter and Custom. Every one of the six reports offers
   **Last 12 Months and Last Week instead of Today and Yesterday**, and the Sales By Customer
   specification was already updated to put Last 12 Months first. So the new list looks intended and
   S2-R2 simply has not caught up - but that is an inference, and the affected cases are on **HOLD**
   until he says so rather than being failed against a requirement he has probably already superseded.
2. **PDF paper orientation.** SBR's S14-R3 says A4 **portrait**; SBC's S15-R7 says A4 **landscape**;
   both reports render landscape. Which is right for SBR?

---

## 8 - Session and access

Started on the cookie header the second session left at `/tmp/rs-viu/cookie-header.txt`, which was
**still alive** - `GET /api/auth/me/fe-permissions` on **`sv8582api`** returned HTTP 200 with 42
permissions on the first try. **No `quick-login` and no `switch-user` was called at any point**, so the
shared single-sign-on token was never rotated and no worker on another branch was signed out.

Mid-session the QA lead supplied a fresh set for all three branches; the exact switch point is recorded
in `CHANGES-MADE.md`. All three were verified against **their own** API host - Reports `sv8582api`,
Filters `sv8785api`, Schedule `sv8685api` - each HTTP 200 with 42 permissions, which **confirms again
that the single-sign-on token and the Cloudflare clearance are shared across branches while the PHP
session id is per-branch.** Values live in `/tmp/qa-cookies/` at mode 600 in a mode-700 directory and
appear in no file in this repository.

**The second test login is still unavailable and it is still the branch refusing, not us.** Read
`SECOND-LOGIN-ATTEMPT.md`: `switch-user` answers HTTP 403 "Access denied." to an administrator against
a real confirmed Technician, and `quick-login` with the technician key answers HTTP 403. Both routes
were already exhausted by the second session and were **not** re-attempted, because a failed
`quick-login` burns the shared session for every branch.
