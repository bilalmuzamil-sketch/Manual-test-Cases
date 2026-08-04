# STAGED CHANGES — Work In Progress + Inventory Value (2026-08-03/04)

**NOTHING HAS BEEN WRITTEN TO TESTRAIL.** Every change below is staged and awaits the QA lead's
authorisation (Standing Rule 6). Read alongside `VERDICTS.md`.

**Build marker:** `v3.4.1-0ed4433` — re-read at the START **and** the END of this pass
(`last-modified Mon, 03 Aug 2026 13:40:38 GMT`, `etag 02091e9dc11f187d7739b4efa166ea21`,
end-of-run read `2026-08-04T02:10:08Z`). **It did not change mid-run.** The branch is nevertheless
declared NOT FINAL, so every change here is provisional (Rule 49) and appears in `RECHECK-ROWS.md`.

## COUNTS

| Change class | Cases |
|---|---:|
| **A. Notes-only — the Rule-49 non-final-build marker** | **149** (every case in scope) |
| **B. Tester-facing wording edits** (expected / steps / preconditions) | **28** |
| **C. HELD pending a Chris Ward ruling — do NOT edit** | **6** |
| **D. References FLAG — no edit possible until Chris's spec edit lands** | **1** |
| **E. New cases proposed** | **2** |
| **TestRail write operations if all of A + B are authorised** | **149 `update_case`, 0 `add_case`, 0 `delete_case`** |
| **Run-sync duty afterwards (Rule 34 / Rule 47)** | **none for A+B** (no new cases). If E is authorised, run **R359** must be union-synced. |

---

## A. NOTES-ONLY — the Rule-49 build marker (all 149 cases)

Not one of the 149 cases carried a build marker before this pass, because this is the first build the
Report Suite has ever had. Append to the **notes / metadata layer only** — never the tester-facing
fields (Rules 9 / 20):

> `VIU 2026-08-03/04: observed live on the Report Suite QA branch sv8582, build v3.4.1-0ed4433
> (index.html last-modified 2026-08-03 13:40:38 GMT). Engineering declared this branch NOT FINAL, so
> this observation is PROVISIONAL and is queued for re-check — see
> build/report-suite/viu-2026-08-03/batch-wip-iv/RECHECK-ROWS.md.`

---

## B. TESTER-FACING WORDING EDITS (28 cases)

Each entry gives the **current text**, the **proposed text**, and the **live observation** behind it.
Where the change is driven by the build's own label, Rule 9 governs. Where the build contradicts a
requirement, the case is only changed if the build's behaviour is the tester-facing truth and no PO
ruling says otherwise — otherwise it is HELD in section C.

### B1. WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) — the headline

**Current, expected item 3 (verbatim):**
> "Location is NOT offered in the column-selection control — it appears on its own whenever more than
> one location is in scope, and is hidden when a single location is in scope."

**Proposed, expected item 3:**
> "Location IS offered in the column-selection control, between VIN and Advisor, and is OFF by
> default. Turning it on adds a Location column that names each job's location; turning it off
> removes it again."

**Proposed, expected item 2 — add Location to the off-by-default list:**
> "Every other column (VIN, Location, Last Activity, Labor Earned, Labor Remaining, Parts Earned,
> Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default."

**Proposed new tester note (item 4):**
> "Note for the tester: the Location column does NOT appear on its own when you have more than one
> location selected — you have to switch it on yourself. That is what the build does today."

**Live observation.** The Column Selection panel lists 16 items in this order: WO # · Status ·
Customer · Asset · **VIN** · **Location** · Advisor · Days Open · Last Activity · Labor Earned ·
Labor Remaining · Parts Earned · Parts Remaining · Earned · Remaining · Inv. Hrs. A before/after
header read proves the toggle works both ways:

- before: `WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, Total`
- after toggling Location ON: `WO #, Status, Customer, Asset, **Location**, Advisor, Days Open, Earned, Remaining, Total`
- after toggling it OFF again: back to the "before" list.

Two locations were in scope throughout ("All locations") and the column did **not** appear by itself.

**Verbatim spec text our case followed (Rule 25).** WIP spec v6 **S4-R3**: *"The **Location** column
is not offered in the column selector; its visibility is automatic — shown only when more than one
location is in scope (Story 7)."* Also **S7-R13** and the §3 Key Decision *"The per-row Location
column is automatic, not a manual toggle."*

**My read:** the **build deviates from the spec**, and the outside automation engineer who asserted a
Location toggle described the build correctly. Our case was faithful to the spec, so this is not a
sloppy case — but the tester in front of the build needs the build's behaviour, so the case should be
changed and Chris asked to confirm the model. **Also our own internal contradiction:** C30466 and
C30507 both list Location *inside* the toggleable order, which could not be true at the same time as
C30467's "NOT offered". The build resolves it in favour of C30466/C30507.

**Confirmation of the three cases the task asked about:**

| Case | What it says about Location | Live verdict |
|---|---|---|
| **WIP-COL-02 = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)** | "NOT offered in the column-selection control … appears on its own" | **WRONG** — refuted by the build |
| **WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)** | lists Location inside the fixed toggleable order, between VIN and Advisor | **RIGHT on the position** — an exact match to the panel order. Only its *precondition* is wrong (it says the column shows automatically) |
| **WIP-PERS-02 = [C30507](https://shopview.testrail.io/index.php?/cases/view/30507)** | lists Location inside the fixed order and says toggling never reorders | **RIGHT** — Location returned to its own slot after being toggled, and Total stayed last |

### B2. WIP-COL-01 = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)

**Current, precondition 4:** "More than one location is in scope, so the automatic Location column is showing."
**Proposed:** "Location is turned ON in the column-selection control (it is off by default)."
**Live observation:** the column order and left/right alignment are an exact match to S4-R1/S4-R4; only the mechanism in the precondition is wrong.

### B3. WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)

**Current items 1, 4, 5:** the column "is shown" with >1 location in scope; "Location is NOT offered in the column-selection control"; "With a single location in scope the Location column is hidden."
**Proposed:** items 1/4/5 become — "Location is offered in the column-selection control, between VIN and Advisor, off by default. Turning it on adds the column in that fixed position, left-aligned. It does not appear or disappear on its own when you change the location selection."
**Keep unchanged:** items 2, 3, 6, 7 — all four confirmed live (each row names its own location; no row ever reads "Multiple"; the export header is "Branch"; the filter control keeps a constant width).

### B4. WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452)

**Current item 1:** '…labeled in this order: "Approved - partially completed", "Approved - not started", "Completed", and "Estimates".'
**Proposed item 1:** '…labeled in this order: "Approved - Partially Completed", "Approved - Not Started", "Completed", and "Estimates" — each followed by its count in brackets, for example "Completed (30)".'
**Live observation:** the build title-cases every word and appends a live count.
**Spec text (Rule 25):** WIP spec v6 **S1-R2** closes the lower-case labels verbatim. **My read:** a shipped-string difference, not a defect — Rule 9 says the tester reads the build's word; Chris should confirm the spec text.

### B5. WIP-COL-04 = [C30469](https://shopview.testrail.io/index.php?/cases/view/30469)

**Current item 1:** '…"Estimate", "Approved", "In Progress", "Review", or "Complete".'
**Proposed item 1:** '…"Estimate", "Approved", "In progress", "Review", or "Complete".'
**Live observation:** `GET /api/work-orders/statuses` returns the build's own labels — `Estimate`,
`Approved`, **`In progress`** (lower-case p), `Review`, `Complete`, `Invoiced`, `Paid`.

### B6. WIP-SCOPE-02 = [C30457](https://shopview.testrail.io/index.php?/cases/view/30457)

**Current:** seeds and expects an Invoiced, a Paid, a **Declined** and a part-sale work order to be absent.
**Proposed:** drop Declined from the precondition, the step and expected item 1.
**Live observation:** the build has **no Declined status**. The full enum is `estimate, approved, in_progress, ready_for_review, complete, invoiced, paid`. Invoiced and Paid absence is confirmed (0 of 488 rows) and part-sale absence is confirmed (every WO number is an S2-/S3- service prefix).
**Spec text (Rule 25):** WIP spec v6 **S2-R2**: *"Work orders whose status is Invoiced, Paid, or Declined never appear…"* — the spec names a status the build does not have. **My read:** a spec/case error, not a build defect; worth a word with Chris.

### B7. WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) and IV-DATE-01 = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561)

**Current (both):** an eleven-item closed list — "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", "Custom".
**Proposed (both):** 'The control offers nine presets, in this order: "Last 12 Months", "This Year", "Last Year", "This Quarter", "Last Quarter", "This Month", "Last Month", "This Week", "Last Week". Alongside them it shows a month calendar you pick dates on, a live "Range: N days" readout and an "Apply" button. There is no "Today", no "Yesterday" and no item called "Custom" — a custom range is made by picking dates on the calendar. "All Time" is not offered.'
**Live observation:** the popup's own text reads `Aug 2, 2026 — Aug 4, 2026 | … | Last 12 Months | This Year | Last Year | This Quarter | Last Quarter | This Month | Last Month | This Week | Last Week | Range: 3 days | Apply`. The WIP default is "This Week" and the IV default is "This Month" — both correct.
**Spec text (Rule 25):** WIP **S7-R6** and IV **S5-R1** both close the eleven-item list. **My read:** unbuilt-as-specified, not a defect — this is the application's shared date component, so adding Today/Yesterday/Custom is a product decision affecting all six reports.

### B8. WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)

**Current step 3:** 'Open "Custom" and try to pick a start and end date more than 366 days apart.'
**Proposed step 3:** 'Open the date control and pick a start and end date on the calendar more than a year apart.'
**Current expected item 3:** "A Custom range is capped at a 366-day maximum span from start to end — a longer span cannot be applied."
**Proposed expected item 3:** 'A range longer than a year is refused with the message "Date range cannot be over one year." A 367-day span is accepted; 368 days is refused.'
**Live observation:** span 366 → HTTP 200, 367 → 200, **368 → 400 `{"error":"Date range cannot be over one year."}`**, and every longer span likewise.
**Spec text (Rule 25):** WIP **S7-R8**: *"A Custom range is capped at a 366-day maximum span (start to end)."* The observed cap is 367.

### B9. WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) — partial edit; item 5 HELD

**Proposed item 2:** "On a first visit the Location filter reads \"All locations\"."
**Proposed:** delete item 4 (the separate on-screen location-scope indicator) — no such indicator exists; the filter control is the only place the scope is shown.
**Item 5 is HELD** — see section C2.
**Live observation:** a fresh browser profile loaded WIP with the filter reading "All locations"; nothing else on the page states the scope.
**Spec text (Rule 25):** **S7-R9**: *"On a first visit it defaults to the user's currently active location."*

### B10. WIP-EXP-02 = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511)

**Current item 5 (tester note):** "…when you have more than one location in scope, the files also carry the location column even though you cannot turn it on or off…"
**Proposed item 5:** "Note for the tester: the file carries the location column only when you have switched Location on in the column-selection control — it does not appear just because you have more than one location selected. In the file it is headed \"Branch\", not \"Location\", and the asset column is headed \"Unit\". Both of those names are correct."
**Proposed item 1 caveat:** "…with Total last. One exception on this build: if you turn Inv. Hrs on, the download is refused — that column cannot be exported yet."
**Live observation:** a multi-location CSV taken with the default column set carried **no** Branch column; the same scope with `location` in the columns parameter did. `columns=…,invoiced_hours` returns **400 `{"error":"Invalid column \"invoiced_hours\"."}`**.

### B11. WIP-TOT-02 = [C30495](https://shopview.testrail.io/index.php?/cases/view/30495)

**Proposed:** add a tester note — "Note for the tester: the Inv. Hrs total can only be checked on screen. On this build a download that includes Inv. Hrs is refused, so do not try to verify this column from a file."
**Live observation:** as B10.

### B12. WIP-VIS-01 = [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) and IV-VIS-01 = [C30596](https://shopview.testrail.io/index.php?/cases/view/30596)

**Current item 1 (both):** "white column headers and white data cells".
**Proposed (both):** "The data cells are white and the column-header band is a very light grey."
**Live observation:** the header cell background computes to `rgb(249, 250, 251)`; the data rows are white and unshaded.
**Spec text (Rule 25):** WIP **S10-R1** / IV **S12-R1** both say "white column headers". **My read:** trivial styling, worth a word not a ticket.

### B13. IV-COL-01 = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551), IV-COL-02 = [C30552](https://shopview.testrail.io/index.php?/cases/view/30552), IV-PERS-02 = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580)

**Proposed on all three:** "Qty on Hand" → **"Qty"** wherever the column is named in a tester-facing field.
**Live observation:** the live header row reads `Part #, Description, Category, Vendor, Location, **Qty**, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost`, and both export files use `Qty` too.
**Additionally on IV-COL-01 item 4 and IV-PERS-02:** drop the "automatic / not in the column-selection control" framing — Location is the 5th of 11 items in the IV Column Selection panel and toggling it off removes the column.

### B14. IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554)

**Current items 1–2:** nine default columns, with Margin and Total Sell "hidden by default".
**Proposed items 1–2:** "On a first visit ALL of the columns show: Part #, Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell and Total Cost. Margin and Total Sell are NOT hidden on this build."
**Live observation:** a fresh browser profile rendered all twelve headers.
**Spec text (Rule 25):** IV **S3-R12** lists nine default columns and **S3-R13** says *"The Margin and Total Sell columns are hidden by default"*; **S8-R3** repeats it. **My read:** an unbuilt default.

### B15. IV-COL-05 = [C30555](https://shopview.testrail.io/index.php?/cases/view/30555)

**Proposed:** add a tester note — "Note for the tester: on this build a part cannot be saved without a category, so you will not find a part whose Category cell shows \"—\". Check the Vendor half only."
**Live observation:** `POST /api/inventory/parts/create` rejects an empty body with `category_id: "Missing required parameter"`, and 0 of the 5,657 live rows have a blank Category. 1,327 rows DO show "—" for a missing vendor.

### B16. IV-NAV-03 = [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) and IV-LOC-01 = [C30574](https://shopview.testrail.io/index.php?/cases/view/30574)

**Proposed:** the observed first-visit location default is **"All locations"**, not the user's active location.
**Live observation:** a fresh browser profile loaded Inventory Value with the filter reading "All locations" and the per-row Location column showing.
**Spec text (Rule 25):** IV **S1-R3** (*"…the user's currently active location"*) and **S7-R2** (*"On a first visit … it defaults to the user's currently active location"*).

### B17. IV-NAV-05 = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) and IV-FLT-02 = [C30570](https://shopview.testrail.io/index.php?/cases/view/30570)

**Proposed:** rewrite the steps so they do not depend on a pagination control, and record that the rows load by scrolling.
**Live observation:** the server-side paging contract is fully honoured (`pagination[page]`, `pagination[rowsPerPage]`, `rowsNumber: 5657`, different rows per page, first page returned after any filter/search/sort change) but there is **no pagination control anywhere on the screen** — no `.q-pagination`, no `q-table__bottom` — the grid is one virtualised scrolling list.
**Spec text (Rule 25):** IV **S1-R8**: *"…the user moves through pages with the reports suite's standard pagination control."* **My read:** the paging UI is not built yet.

### B18. IV-TOT-01 = [C30556](https://shopview.testrail.io/index.php?/cases/view/30556)

**Current item 1:** 'a totals row … with the literal label "Total" in the Part # column's cell.'
**Proposed item 1:** 'a totals row … with the label "Totals" in the Part # column's cell.'
**Live observation:** the on-screen label is `Totals`, and both export files also say `Totals`.
**Spec text (Rule 25):** IV **S4-R1**: *"…with the literal label \"Total\" in the Part # column's cell."*

### B19. IV-TOT-02 = [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) — our case would fail a good build

**Current item 3:** "The hand-summed subset matches the server-computed totals to the cent."
**Proposed item 3:** "A hand sum of a small seeded subset matches the totals row. On a large set the totals can differ from a hand sum of the displayed values by a few cents, because the server sums the unrounded values — that is correct, not a defect."
**Live observation:** my full 5,657-row walk of the displayed per-row values came to **$485,542.24** against the server's **$485,542.18** — a 6-cent difference. Everything else in the case is exactly right: the totals row read Qty 195,249.93 / Total Cost $977,080.47 across 9,275 rows while the screen showed about 18 rows, and the CSV of the same scope reproduces those figures precisely.

### B20. IV-DATE-05 = [C30565](https://shopview.testrail.io/index.php?/cases/view/30565)

**Current item 2:** 'When the displayed day matches the date asked for … the "As of" indicator is not shown.'
**Proposed item 2:** 'The "As of" indicator is always shown, next to the report title, for example "As of 08/04/2026".'
**Live observation:** the default view (This Month, ending today, live values) renders `Inventory Value  As of 08/04/2026`.
**Spec text (Rule 25):** IV **S5-R6**: *"When the displayed day matches the date asked for (the common current-view case), the \"As of\" indicator is not shown."*

### B21. IV-DATE-06 = [C30566](https://shopview.testrail.io/index.php?/cases/view/30566)

**Proposed:** rewrite steps 1–2 to pick the dates on the inline calendar; there is no "Custom" item to choose (same shared component as B7). The future-date cap in expected item 2 is **confirmed** — a range ending 2027-01-31 resolved back to 2026-08-04.

### B22. IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)

**Current item 1:** "Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last."
**Proposed item 1:** "Both downloads include every column, whatever you have turned on or off on screen — the column selection does not change the file. The file's own order is Part #, Description, Category, Vendor, [Location,] Qty, Unit Cost, Unit Sell, Total Cost, Total Sell, Margin, Margin % — so Total Cost is not last in the file even though it is last on screen."
**Proposed item 5:** the Location column follows the column-selection toggle, not the scope.
**Live observation:** the export **ignores** a `columns=` parameter entirely (a three-column request and a nonsense-column request both returned the same eleven-column file, with no error), and the file header order differs from the screen order as quoted.
**Spec text (Rule 25):** IV **S10-R3**: *"Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last."*

### B23. IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) — spreadsheet-hostile

**Current item 2:** "In the CSV, money values are written as plain numbers with two decimals and NO thousands separators (so they parse cleanly in a spreadsheet)."
**Proposed item 2:** "On this build the CSV writes money the same way the screen does — with a dollar sign and thousands separators, quoted when the value contains a comma, for example \"$11,176.88\". That means the money columns import as text, not numbers."
**Proposed new tester note:** "Note for the tester: for the same part the screen and the file can differ by a tenth of a percent in Margin % — for part W4707QP the screen shows 56.0% and both files show 56.1%. Record it; do not treat the file as wrong."
**Live observation:** CSV line 4 reads `R134A,Refrigerant,HD-Fluids,—,786.55,$14.21,$21.86,"$11,176.88","$17,193.98","$6,017.10",35.0%`. For W4707QP the API value is `margin_pct: 56.05`, the screen renders `56.0%` and both the CSV and the PDF render `56.1%`.
**Spec text (Rule 25):** IV spec v3 Story 10 context note: *"in the CSV, money values are written as plain numbers with two decimals and no thousands separators (so they parse cleanly in a spreadsheet); the PDF uses the same on-screen currency formatting with the \"$\" and thousands separators."*
**My read:** a genuine deviation with a real user cost — every money column imports as text.

### B24. IV-EXP-09 = [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) — the PDF 500

**Proposed new tester note:**
> "Note for the tester: on this build a PDF download of a large view fails with a plain error —
> \"An error occurred. We're sorry for this inconvenience, please try again a bit later later.\" —
> after roughly half a minute. It is a timeout, not the too-large-to-export message. Narrow the view
> with the part search or a single location and the PDF works. The CSV of the same view always works
> and is quick. Record the failure; it is a known problem, not a mistake you made."

**Live observation.** Reproduced repeatedly and characterised as a **~30-second server-side timeout**, not a row cap:

| Filtered rows | PDF | Time | Note |
|---:|---|---:|---|
| 1 · 11 · 149 · 269 · 276 · 320 · 396 · 408 · 411 · 532 | **200** | 18–29 s | files produced |
| 538 | **200** then **500** | 25 s / 31 s | non-deterministic |
| 578 | **200** then **500** | 25.4 s / 32.2 s | non-deterministic |
| 648 · 725 · 793 · 896 · 1339 · 3872 · 4416 · 4811 · 5154 · 5657 · 9275 | **500** | 31–33 s | always fails |

Every failure lands at **31–33 s**. The **CSV of the identical scope returns in 0.8–2.2 s and always 200.** The whole list is 5,657 rows (one location) / 9,275 rows (two), both **under** the spec's 10,000-row cap, so the friendly guard is never reached. Request ids captured for every probe in `evidence/api/iv-pdf-boundary.json` and `evidence/api/pdfprobe.json` (e.g. `dde055bf-3d20-4be9-83d1-9ddd2f024e9c`, `dfaec4f6-2dd0-4127-bb28-794b3f860946`).
**My read: a genuine defect** — the friendly over-size guard exists on the CSV path and the PDF path 500s instead of using it.

### B25. IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593)

**Proposed new tester note:** "Note for the tester: on this environment the biggest view you can build is about 9,275 rows, which is under the cap, so you cannot make this message appear here. If the PDF fails with a plain error instead, that is the separate timeout problem — see the Inventory Value export-notification case."

### B26. IV-VIS-02 = [C30597](https://shopview.testrail.io/index.php?/cases/view/30597)

**Current item 2:** "the date-range control, the part search, the Category filter, the Vendor filter, and the Location filter (rightmost)."
**Proposed item 2:** "the part search, then the date-range control, then the Category filter, the Vendor filter and the Location filter (rightmost)."
**Live observation:** the toolbar reads, left to right: `...` (export) · Column Selection · `Search parts` · `This Month` · `Category` · `Vendor` · `Location`. Item 1 (export menu leftmost, then Column Selection) is an **exact match**.
**Spec text (Rule 25):** IV **S12-R3** puts the date-range control first.

### B27. WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918)

**Proposed new tester note:** "Note for the tester: on this environment the biggest single tab holds about 114 work orders, so you cannot make this message appear here. Record that and move on."
**Live observation:** the widest WIP scope — a full year across both locations — is 488 work orders in total and 114 in the largest tab, and the cap applies per tab.

### B28. IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)

**Proposed:** note that the PDF's as-of line reads `As of 2026-08-04` (no colon) while the CSV's leading line reads `"As of: 2026-08-04"` (with a colon), so the two files phrase it differently.
**Live observation:** extracted PDF text header block: `Inventory Value` / `Staging Foothills Group Inc` / `Staging Heavy Duty - 9919` / `Start Date Range: Aug 1, 2026 - Aug 4, 2026` / `As of 2026-08-04` / `Locations: Staging Heavy Duty - 9919`. CSV line 1: `"As of: 2026-08-04"`, line 2: `"Locations: Staging Heavy Duty - 9919"`.

---

## C. HELD PENDING A CHRIS WARD RULING — DO NOT EDIT (6 cases)

These cases are **right against the newest authoritative product source** and the build has not caught
up. Editing them would assert behaviour that no written source supports, so they stay as they are
(Rule 32 — latest authoritative source wins; Rule 33 — a build observation does not overturn a PO
ruling).

### C1. The asset-identifier chain — 3 cases

| Case | What it asserts | The build |
|---|---|---|
| **WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470)** | "The Asset cell identifies the asset by its VIN" | the UNIT NUMBER leads, in bold, with the VIN underneath in a smaller muted style |
| **WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485)** | "The Asset column sorts by the identifier it shows — the VIN, falling back to Unit #, then plate" | the displayed identifier is the unit number |
| **WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500)** | each Asset filter option "identifies the asset by its VIN, falling back to Unit #, then plate" | same |

**Live DOM, verbatim:**
`<div class="wip-asset"><span class="wip-asset__unit text-weight-bold">6548</span><span class="wip-asset__vin text-caption text-grey-7">1FDSE3EL1EDB20609</span></div>`

**Our source:** Chris Ward's ruling of **2026-07-29** — *"A is the correct answer"* on the VIN → Unit # → plate chain, with the durable instruction *"Not just for these specs though -- really good to keep this in mind for all actions moving forward"* (`../../chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`).
**The build's source:** WIP spec v6 **S4-R7** — *"The **Asset** column is a two-line cell: the unit number on the first line in bold, and the vehicle identification number on the second line in a smaller, muted style"* — and **S4-R9** *"The Asset column sorts by unit number."*
**My read:** the ruling is **not built yet**. Chris's own spec still carries the old text, so engineering built to the spec.

**On the "VIN really means serial number" point the task asked about:** the observation I can make honestly is that the build's second line is populated from the asset's VIN field and shows values that are plainly **not** vehicle VINs — the live data includes `BULK PARTS1`, `12-06696`, `P631627` and `86J8FAC1VALJ43SJY`, alongside genuine 17-character VINs like `1FDSE3EL1EDB20609`. So the field is already carrying serial-number-style values for non-vehicle assets, which is exactly the terminology caution the ruling records. **I did not create a non-vehicle asset**: the report has no asset-creation surface, the VIN column is populated from existing asset records, and the point is already evidenced by the live data above. The **"— no VIN —"** placeholder S4-R8 specifies also has real subjects in the data — `S3-15607` (unit 2109, no VIN), `S3-15417` (unit B104, no VIN), `S3-14311` (neither) — so the placeholder branch is observable without seeding; it is queued in `RECHECK-ROWS.md` for a screen read.

### C2. The single-location Location filter — 2 cases

| Case | What it asserts | The build |
|---|---|---|
| **WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503)** item 5 | "For a user with access to only one location the Location filter is NOT shown at all" | the control is still shown |
| **IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577)** | same | same |

**Our source:** Chris Ward's answer of **2026-07-31, Q1=A** — the filter is HIDDEN for a one-location user, which he called *"classic spec drift"*.
**The build's source:** IV spec v3 **S7-N1** — *"A user with access to only one location still sees the filter with a single selectable location."*
**Live observation:** a single-location subject (a Sales Representative with exactly one accessible workplace) still saw the Location filter on Inventory Value, and narrowing an admin's scope to one location also left the control in place.
**My read:** the ruling is **not built yet**, and the stale S7-N1 text is what shipped.

### C3. The Estimates summary figure — 1 case

**WIP-SUM-05 = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491)** item 1 asserts the Estimates figure equals the Estimates tab's total **quoted** value. The build shows **$0.00** while that tab holds 146 work orders — it is showing the approved-value total, which is always zero for an estimate.
**Spec text (Rule 25):** WIP **S5-R8** — *"**Estimates** is the total quoted value of the jobs in the Estimates tab, and is shown in a muted style."*
The muted styling and the exclusion from Total Earned / Total Remaining are both **confirmed**.
**My read:** the quoted-value figure is **not built**. Our case is right; do not weaken it.

---

## D. REFERENCES FLAG — no edit possible yet (1 case)

**WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918)** carries
`SV-8665 (WIP spec Story 9 — the 10,000-row export cap applies to ALL SIX reports per Chris Ward
answer 2026-07-31 Q3=A; the WIP spec page still has no cap line; his spec edit is pending)`.
The ticket is present and the provenance is honest, but **there is no requirement on the WIP spec page
to anchor to** — a Rule-20 shortfall we cannot close ourselves. It resolves the moment Chris adds the
cap requirement. Every other case in scope carries a ticket AND a spec anchor that still exists in the
current spec body (0 dead anchors across 149).

---

## E. NEW CASES PROPOSED (2) — authoring NOT executed

Both are proposed only. Nothing has been authored and no `add_case` has been staged, because a new
case in either report changes the run-completeness duty for **R359** (Rule 34 / Rule 47) and that
needs the QA lead's go-ahead.

### E1. NEW — "A large Inventory Value PDF download fails instead of being refused politely"

**Why it is needed.** The 500 is a distinct, reproducible behaviour that **no existing case covers**.
`IV-EXP-07 = C30593` covers the *cap* message and `IV-EXP-09 = C30595` covers the *notification*
strings; neither describes a large PDF failing after ~30 seconds, so a tester hitting it today has no
case to record it against and would most likely file it under the wrong one.
**Proposed refs:** `SV-8677 (IV spec v3 2026-07-29 S10-R11; S10-R12; S10-R14 — the observed failure
path is a ~30 s server-side timeout, not the S10-R12 cap; observed on build v3.4.1-0ed4433)`
**Proposed section:** `IV — Exports`
**Shape:** narrow the view with the part search so the PDF succeeds; widen to the whole list; request
the PDF; expect a plain error after about half a minute and no file; request the CSV of the same view
and expect it to succeed quickly.

### E2. NEW — "Inventory Value money columns in the CSV import as text, not numbers"

**Why it is needed.** `IV-EXP-03 = C30589` asserts the *spec's* plain-number format. If that case is
edited to the build (B23), the spec's requirement stops being tested by anything. A separate case
keeps the requirement visible until Chris rules.
**Proposed refs:** `SV-8677 (IV spec v3 2026-07-29 Story 10 context note — "in the CSV, money values
are written as plain numbers with two decimals and no thousands separators"; build v3.4.1-0ed4433
writes on-screen currency formatting instead)`
**Proposed section:** `IV — Exports`

---

## SECRETS

No cookie value, session id, Cloudflare token, TestRail email or TestRail password appears in any file
in this batch folder. `tools/secret_scan.sh` reads the live secret values from `/tmp` at run time and
greps the whole folder for each of them; it reported **SECRET SCAN CLEAN** before every commit.
