# SIDE-BY-SIDE COVERAGE SUBSTANTIATION (Rule 45(e))

Selected 30 requirements across all six specs.

---

## SBC S4-R13

**REQUIREMENT (verbatim):** * **S4-R13:** Every export — each CSV and each PDF, Summary and Expanded — includes a "Locations:" line naming the currently selected location or locations, or "All locations" when every location the user has access to is selected. When the Location column is shown on screen (more than one location in scope, S4-R12), every export also includes that Location column.

**CITING CASES: 4**

- **C38912 (SBC-LOC-04)** — The Location column shows only with more than one location; Multiple on totals
    - EXPECTED: 7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
- **C30161 (SBC-EXP-03)** — Expanded View CSV: column order, blank-cell rules, and the Locations line
    - EXPECTED: 1. With a single location in scope the Expanded View CSV has these thirteen columns in this exact order: Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal. When more than one location is in scope the file also carries a Location column — immediately after Date, the position it holds on screen — making f
    - EXPECTED: 7. The file carries a "Locations:" line naming the location or locations the report was scoped to, or "All locations" when every location you can access is selected — as a leading line above the column headers.
- **C30169 (SBC-EXP-11)** — Expanded View PDF body matches the CSV's columns and on-screen rules
    - EXPECTED: 1. The Expanded View PDF's body table has the same columns, in the same order and with the same labels, as the Expanded View CSV — thirteen with a single location in scope, plus the Location column after Date when more than one location is in scope — including the Asset column — and shows the full Customer, then Asset, then Invoice breakdown, one block per customer.
    - EXPECTED: 7. The PDF header title reads "Sales By Customer Report" on the Summary and Expanded versions alike — which version you have is told by the file name and the contents, not by a different title.
- **C38856 (SBC-EXP-16)** — Summary and Expanded View downloads exist for both PDF and CSV
    - EXPECTED: 1. The menu offers exactly four items: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)".
    - EXPECTED: 2. Each Summary file gives ONE row per customer, without the asset or invoice detail rows.
    - EXPECTED: 3. Each Expanded View file contains the full Customer, then Asset, then Invoice breakdown.
    - EXPECTED: 4. All four files reflect exactly the filtered data shown on screen.
    - EXPECTED: 5. With a single location in scope the Summary files have these ten columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, Invoice # or Date columns. When more than one location is in scope a Location column is added with the identifying columns, ahead of the money columns (the Summary files

---

## SBC S4-R12

**REQUIREMENT (verbatim):** * **S4-R12:** When more than one location is in scope, the report shows a per-row Location column; the column is hidden when a single location is in scope.

**CITING CASES: 1**

- **C38912 (SBC-LOC-04)** — The Location column shows only with more than one location; Multiple on totals
    - EXPECTED: 1. With more than one location in scope a Location column is shown, positioned immediately after the Date column.
    - EXPECTED: 5. Location is NOT offered in the column selector — it appears and disappears on its own, following the location scope.
    - EXPECTED: 6. With a single location in scope the Location column is hidden and the surrounding columns close up with no gap.
    - EXPECTED: 7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 8. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: a location name on a row whose invoices are all at one location, "Multiple" on a row that aggregates more than one, and the invoice's own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)

---

## SBC S8-R7

**REQUIREMENT (verbatim):** * **S8-R7 (asset label — primary):** The asset label is the vehicle's VIN.

**CITING CASES: 1**

- **C30134 (SBC-LBL-01)** — Asset identified by VIN, falling back to Unit #, then plate
    - EXPECTED: 1. Asset (a) is identified by its VIN.
    - EXPECTED: 2. Asset (b) (no VIN) is identified by its Unit # instead.
    - EXPECTED: 3. Asset (c) (no VIN or Unit #) is identified by its plate instead.
    - EXPECTED: 4. For asset (d) (no VIN, Unit #, or plate), note what the label shows - what stands in when all three are missing is confirmed in the build (the older rule showed "Unknown Asset").
    - EXPECTED: 5. Note whether the year/make/model text still appears anywhere in the row - the update says the VIN identifier REPLACES the year/make/model label; confirm the exact rendering in the build.

---

## SBC S14-R15

**REQUIREMENT (verbatim):** * **S14-R15:** Each downloaded file is plain comma-separated text with a .csv extension and opens as rows and columns in a spreadsheet; it is not an .xlsx workbook and not a JSON file.

**CITING CASES: 1**

- **C30160 (SBC-EXP-02)** — Download file names carry the version and the active date range
    - EXPECTED: 4. The file is plain comma-separated text with a .csv extension that opens as rows and columns in a spreadsheet — not an .xlsx workbook and not a JSON file.

---

## SBC S15-R14

**REQUIREMENT (verbatim):** * **S15-R14:** The header shows a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected (S4-R13). The names shown match the Location filter's current selection.

**CITING CASES: 1**

- **C30168 (SBC-EXP-10)** — PDF logo is embedded, scales without distortion
    - EXPECTED: 1. With an uploaded logo, that logo appears pinned to the top-right, scaled to fit its area without distortion.
    - EXPECTED: 2. With no uploaded logo, the bundled ShopView logo is used.
    - EXPECTED: 3. When no logo is available at all, the logo column is not rendered and the text column fills the full width.

---

## SBR S14-R20

**REQUIREMENT (verbatim):** * **S14-R20:** **Location in exports.** Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen — Summary and Expanded, PDF and CSV: a Summary (rolled-up) row carries the rep's location, reading **Multiple** when that rep spans more than one location; an Expanded (per-invoice) row carries that invoice's own exact location. In addition, every export (each PDF and each CSV, Summary and Expanded) includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected — matching the on-screen scope. In a PDF the "Locations:" line appears in the header strip; in a CSV it appears as a leading metadata line above the column-header row.

**CITING CASES: 5**

- **C38913 (SBR-LOC-05)** — The Location column shows only with more than one location; rep rows Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.
    - EXPECTED: 6. The pinned Subtotal column is still rightmost — the Location column never displaces it.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 9. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice's own exact location.
- **C30278 (SBR-EXP-03)** — Summary PDF: one rolled-up row per rep with a recomputed grand totals row
    - EXPECTED: 1. The PDF is A4 portrait, edge-to-edge, with a header strip on the first page showing the workplace name and address, the organization logo, the report title "Sales By Representative," and the selected date range.
    - EXPECTED: 3. With a single location in scope the columns are: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. When more than one location is in scope a Location column is added with the identifying columns ahead of Inv. Hrs, and a rep who spans more than one location reads "Multiple" (this file has no Status column for it to follow — confirm its
- **C30279 (SBR-EXP-04)** — Expanded View PDF: one page-block per rep with its own totals; no grand
    - EXPECTED: 2. Each block shows the header strip (workplace name and address, organization logo, title "Sales By Representative," the selected date range), the rep's name, and a per-invoice table with columns: Date / Invoice / Customer / Status / (Location, only when more than one location is in scope, carrying that invoice's own location) / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Ma
- **C30285 (SBR-EXP-10)** — Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep
    - EXPECTED: 5. The CSV has NO totals row.
    - EXPECTED: 7. When more than one location is in scope the file also carries a Location column, with the identifying columns ahead of the metric columns; a rep whose invoices span more than one location reads "Multiple". (This file has no Status column for it to follow — confirm its exact position in the build.)
- **C30286 (SBR-EXP-11)** — Expanded CSV: file name, verbatim headers, one row per invoice
    - EXPECTED: 5. When more than one location is in scope the file also carries a Location column immediately after Status — the position it holds on screen — and every row shows that invoice's own exact location, never "Multiple".

---

## SBR S21-R7

**REQUIREMENT (verbatim):** * **S21-R7:** A per-row **Location** column is shown on the report **only when the current view spans more than one location** — i.e., when more than one location is in scope (several locations selected, or "All Locations" resolving to more than one accessible location). When the view is scoped to a single location the column is **hidden** ; the one location is already unambiguous.

**CITING CASES: 2**

- **C38913 (SBR-LOC-05)** — The Location column shows only with more than one location; rep rows Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.
    - EXPECTED: 6. The pinned Subtotal column is still rightmost — the Location column never displaces it.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 9. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice's own exact location.
- **C30218 (SBR-ROW-02)** — Row layout: 12 columns in order, blanks in position, bold summary rows
    - EXPECTED: 1. With a single location in scope the columns appear left to right: Date, Invoice, Customer, Status, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal (12 columns). When more than one location is in scope the automatic Location column is added immediately after Status, making 13.

---

## SBR S18-R13

**REQUIREMENT (verbatim):** * **S18-R13:** When shown (S21-R7), the **Location** column appears at the end of the leading identifier group — immediately after the **Status** column and before the first metric column (Inv. Hrs) — on every rep summary row and invoice detail row, matching the Location column's placement across the reports suite; it never displaces the pinned **Subtotal** column, which stays rightmost (S10-R1). The toolbar's **Location filter** control keeps a **constant width** regardless of the selected label (a single location name, several names, or "All Locations"), so the toolbar layout does not shift as the selection changes.

**CITING CASES: 1**

- **C38913 (SBR-LOC-05)** — The Location column shows only with more than one location; rep rows Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.
    - EXPECTED: 6. The pinned Subtotal column is still rightmost — the Location column never displaces it.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 9. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice's own exact location.

---

## SBR S17-R3

**REQUIREMENT (verbatim):** * **S17-R3:** The â‹¯ exports button is the first control in the toolbar's action cluster (leftmost of the actions). On mobile it wraps to a partial row above the stacked controls.

**CITING CASES: 2**

- **C30276 (SBR-EXP-01)** — The ⋯ overflow menu lists exactly four download actions
    - EXPECTED: 1. The menu lists exactly four actions: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", and "Download Expanded View (CSV)".
    - EXPECTED: 2. No other entries appear in the menu.
- **C30302 (SBR-MOB-01)** — On a phone every toolbar control works on touch
    - EXPECTED: 1. Every toolbar control is visible and operable on touch.
    - EXPECTED: 2. Below 1024px the toolbar controls stack vertically at full width; the ⋯ exports button — the first control of the action cluster — wraps to a partial row ABOVE the stacked controls.
    - EXPECTED: 3. At 1024px and above the desktop layout applies.

---

## SBR S14-N3

**REQUIREMENT (verbatim):** * **S14-N3:** Users without Reports-section access do not see the â‹¯ menu.

**CITING CASES: 1**

- **C30199 (SBR-PERM-02)** — Without Reports access: no navigation, no export menu, no Export dialog
    - EXPECTED: 1. The entire Reports navigation — including the "Sales By Representative" entry — is not shown.
    - EXPECTED: 3. The Export Reports dialog and the Sales Representative Assignments download are not reachable.

---

## PV S6-R11

**REQUIREMENT (verbatim):** * **S6-R11:** Every export includes the per-row **Location** column whenever it is shown on screen (more than one location in scope, S2-R12 / S3-R10), in its on-screen column position. Both exports also include a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected. In the PDF the "Locations:" line appears in the header area; in the CSV it appears as a leading metadata line above the column-header row.

**CITING CASES: 1**

- **C38914 (PV-FILT-14)** — The Location column shows only with more than one location, leftmost before Type
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.
    - EXPECTED: 4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row's own location, and "Multiple" on the merged Special Order row.

---

## PV S2-R12

**REQUIREMENT (verbatim):** * **S2-R12:** When the Location filter (S2-R9) resolves to **more than one** location in scope, the table shows a per-row **Location** column identifying each row's location; when a single location is in scope the column is **hidden**. Per-row values follow S3-R10.

**CITING CASES: 1**

- **C38914 (PV-FILT-14)** — The Location column shows only with more than one location, leftmost before Type
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.
    - EXPECTED: 4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row's own location, and "Multiple" on the merged Special Order row.

---

## PV S3-R10

**REQUIREMENT (verbatim):** * **S3-R10:** When the per-row **Location** column is shown (more than one location in scope, S2-R12), each row's value follows the row model (S3-R1a): an **inventory** row — a per-location stock record — shows **its own location's name** ; a merged **special-order** row, which aggregates across the selected locations, shows the literal **Multiple**. A drill-down/detail row shows the exact single location it belongs to. The column is auto-managed by the location scope (it is **not** one of the 20 columns in the picker, S4-R1, and is not user-toggleable) and is hidden entirely when a single location is in scope.

**CITING CASES: 3**

- **C38914 (PV-FILT-14)** — The Location column shows only with more than one location, leftmost before Type
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.
    - EXPECTED: 3. The merged Special Order row shows "Multiple", because it is summed across the selected locations.
    - EXPECTED: 4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
- **C30352 (PV-COL-02)** — First visit shows exactly the 14 default columns in the specified order
    - EXPECTED: 3. When more than one location is in scope the automatic Location column shows as well, leftmost before Type — 15 columns. It is not part of the 14-column default set and is not in the column picker, so its presence is expected and is not a failure of this test.
- **C30353 (PV-COL-03)** — A re-enabled column returns to its canonical slot, with no reload
    - EXPECTED: 2. Columns always render in the fixed canonical left-to-right order regardless of the order they were toggled on (with the automatic Location column, when shown, sitting leftmost before Type): Type, Part #, Description, Category, Vendor, Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Unit Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand, Turns / Yr, Min, Max.

---

## PV S3-R5

**REQUIREMENT (verbatim):** * **S3-R5:** The **Type** column displays `Inventory` or `Special Order` as plain text.

**CITING CASES: 2**

- **C30328 (PV-FILT-01)** — Type filter: single-select, first in row, three options, default Both; reloads
    - EXPECTED: 1. The Type filter is the first control in the filter row.
    - EXPECTED: 2. It is single-select and offers exactly three choices: Both, Inventory, and Special Order (special-order catalog parts that were never put into stock).
    - EXPECTED: 4. Both is an explicit selection returning inventory and Special Order rows together - a deliberate filter value, not the absence of a filter.
    - EXPECTED: 5. Each selection immediately reloads the report limited to that type (no separate Apply step) - under Inventory every row's Type column reads Inventory; under Special Order every row's Type column reads Special Order; under Both, rows of both kinds appear.
- **C30345 (PV-ROW-05)** — Sticky header, all-left alignment on screen, and plain-text Type values
    - EXPECTED: 2. The Type column shows each row's kind as plain text (no badge or chip styling): "Inventory" or "Special Order".

---

## PV S5-R4a

**REQUIREMENT (verbatim):** * **S5-R4a: Profitability column calculations.** All five are derived from the **billed part lines** in the window — for inventory, the part lines on invoiced/paid Service- and Parts-type work orders (windowed by work-order date); for special-order, the vendor part requests. **Reversed/voided sales are excluded** from these sums (netting reversals, consistent with Units Sold). Let **Revenue** = the summed billed sell amount (each line's stored sell price × quantity), **COGS** = the summed billed cost (each line's cost captured at billing time), and **billed units** = the summed billed quantity.

**CITING CASES: 3**

- **C30368 (PV-CALC-10)** — Revenue, Margin, Unit Cost, Sell Price and Margin % use the billed formulas
    - EXPECTED: 5. All five are computed from the RAW (unrounded) Revenue / COGS / billed-units totals and rounded ONCE at the end - not built from already-rounded intermediates.
- **C30369 (PV-CALC-11)** — A reversed or voided sale is excluded from every billed-line column
    - EXPECTED: 1. After the reversal, ALL the billed-line columns drop to reflect only the remaining sale - the reversed/voided sale is excluded from Revenue, Margin, Unit Cost, Sell Price, Margin %, Sold (WO), Sold (Parts Sale), and (for special-order) Units Sold.
    - EXPECTED: 2. This netting is consistent with inventory Units Sold, which already nets reversals via the stock add-back.
- **C30370 (PV-CALC-12)** — Unit Cost / Sell Price and Margin % use independent null triggers
    - EXPECTED: 1. Row 1: Unit Cost and Sell Price show — (billed units ≤ 0) while Revenue and Margin show dollar amounts AND Margin % is still computed from Revenue - a valid mixed row, not a defect.
    - EXPECTED: 2. Row 2: Sell Price shows $0.00 (a number) while Margin % shows — (Revenue ≤ 0) - also valid.
    - EXPECTED: 3. Row 3: Unit Cost, Sell Price, and Margin % all show — together - which happens ONLY when both billed units ≤ 0 AND Revenue ≤ 0.

---

## PV S1-R4

**REQUIREMENT (verbatim):** * **S1-R4:** Both loading the report and exporting it require the **Inventory Reports → View** permission. A user without that permission is denied the report data and the export.

**CITING CASES: 3**

- **C30325 (PV-PERM-01)** — A user with ordinary reports access can load the report and export it
    - EXPECTED: 1. The report data loads and rows are shown.
    - EXPECTED: 2. The export downloads successfully — both opening the report and exporting it are allowed by the same ordinary reports access.
    - EXPECTED: 3. Note for the tester: for now ONE ordinary reports access opens all six of these new reports; none of them has a permission of its own. If the build demands a separate report permission before this works, mark this Failed and report it — do not change the test.
- **C30327 (PV-PERM-03)** — Reports access without Inventory Reports View: entry shows; data denied
    - EXPECTED: 1. The Parts Velocity navigation entry is still visible (the entry follows Reports-section access, not the report permission).
- **C30391 (PV-API-04)** — The backend denies report data AND export without Inventory Reports View
    - EXPECTED: 3. Both loading and exporting are gated by the same Inventory Reports → View permission.

---

## TU S7-R13

**REQUIREMENT (verbatim):** * **S7-R13:** Every download (both PDF views and the CSV) includes the per-row **Location** column whenever it is shown on screen (more than one location in scope — S9-R9), in its on-screen leftmost position. Every download also includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected. In a PDF it appears in the header area; in the CSV it appears as a leading metadata line above the column-header row.

**CITING CASES: 1**

- **C38915 (TU-LOC-06)** — The Location column shows only with more than one location; Summary row blank
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
    - EXPECTED: 5. The Summary row leaves the Location cell blank.
    - EXPECTED: 6. Location is never listed in the Column Selection control — it follows the location scope on its own.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## TU S9-R9

**REQUIREMENT (verbatim):** * **S9-R9:** When the selected scope spans **more than one location** , the report shows a per-row **Location** column; when the scope is a single location, the column is hidden (the scope is unambiguous). This auto-visibility applies on screen and in every export (S7-R13).

**CITING CASES: 2**

- **C30401 (TU-HRS-02)** — Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp)
    - EXPECTED: 6. When more than one location is in scope the automatic Location column also appears, leftmost before Technician — it is not in the Column Selection control and its presence is expected.
- **C38915 (TU-LOC-06)** — The Location column shows only with more than one location; Summary row blank
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
    - EXPECTED: 5. The Summary row leaves the Location cell blank.
    - EXPECTED: 6. Location is never listed in the Column Selection control — it follows the location scope on its own.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## TU S9-R10

**REQUIREMENT (verbatim):** * **S9-R10:** In the Location column (when shown, S9-R9): a technician row whose hours were all clocked at a single location shows that location's name; a technician row whose hours span more than one selected location shows the literal **Multiple** ; an expanded per-day detail row shows the exact location when that day's hours were all at one location, or **Multiple** when that day spans more than one. The Summary row leaves the Location column blank.

**CITING CASES: 1**

- **C38915 (TU-LOC-06)** — The Location column shows only with more than one location; Summary row blank
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
    - EXPECTED: 3. A technician whose hours span more than one selected location shows "Multiple".
    - EXPECTED: 4. An expanded day row shows the exact location when that day's hours were all at one location, and "Multiple" when the day spans more than one.
    - EXPECTED: 5. The Summary row leaves the Location cell blank.
    - EXPECTED: 6. Location is never listed in the Column Selection control — it follows the location scope on its own.

---

## TU S8-R15

**REQUIREMENT (verbatim):** * **S8-R15:** When shown (more than one location in scope — S9-R9), the per-row **Location** column renders as the **leftmost** column, before Technician, using the suite's standard column treatment so its placement matches the same column on the other reports in the suite. The Location filter control (S9-R1) keeps a **constant width** regardless of the selected label (a single location name, several, or "All Locations"), so the toolbar layout does not shift when the selection changes.

**CITING CASES: 1**

- **C38915 (TU-LOC-06)** — The Location column shows only with more than one location; Summary row blank
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
    - EXPECTED: 5. The Summary row leaves the Location cell blank.
    - EXPECTED: 6. Location is never listed in the Column Selection control — it follows the location scope on its own.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## TU S10-R4

**REQUIREMENT (verbatim):** * **S10-R4:** The per-row Location column is not one of the toggleable columns: it is auto-managed by the location scope (shown only when more than one location is in scope — S9-R9) and is never listed in the column selector.

**CITING CASES: 2**

- **C38915 (TU-LOC-06)** — The Location column shows only with more than one location; Summary row blank
    - EXPECTED: 1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
    - EXPECTED: 5. The Summary row leaves the Location cell blank.
    - EXPECTED: 6. Location is never listed in the Column Selection control — it follows the location scope on its own.
    - EXPECTED: 7. With a single location in scope the Location column is hidden.
    - EXPECTED: 8. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
- **C38859 (TU-COL-01)** — Column Selection: Technician always on, the other five toggleable, remembered
    - EXPECTED: 5. The Location column is never listed here — it appears on its own whenever more than one location is in scope.

---

## WIP S7-R13

**REQUIREMENT (verbatim):** * **S7-R13:** The per-row **Location** column is shown automatically whenever the current scope spans more than one location, and is hidden whenever a single location is in scope; the user does not toggle it in the column selector.

**CITING CASES: 1**

- **C38916 (WIP-FLT-09)** — The Location column is automatic and never reads Multiple on a work-order row
    - EXPECTED: 1. With more than one location in scope a Location column is shown, in its fixed position between VIN and Advisor, left-aligned.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## WIP S7-R14

**REQUIREMENT (verbatim):** * **S7-R14:** When the Location column is shown, each work-order row names that work order's location. Because a work order belongs to exactly one location, a WIP row never shows "Multiple"; there are no drill-down or aggregating rows on this report (every row is already a single work order).

**CITING CASES: 1**

- **C38916 (WIP-FLT-09)** — The Location column is automatic and never reads Multiple on a work-order row
    - EXPECTED: 1. With more than one location in scope a Location column is shown, in its fixed position between VIN and Advisor, left-aligned.
    - EXPECTED: 3. NO row ever shows "Multiple" — a work order belongs to exactly one location, and this report has no grouped or drill-down rows.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## WIP S4-R3

**REQUIREMENT (verbatim):** * **S4-R3:** Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column selector and off by default (Story 8). The **Location** column is not offered in the column selector; its visibility is automatic — shown only when more than one location is in scope (Story 7).

**CITING CASES: 3**

- **C30466 (WIP-COL-01)** — With all toggleable columns on, the fixed column order and alignment hold
    - EXPECTED: 1. The columns appear in this order: WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.
    - EXPECTED: 2. WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned.
    - EXPECTED: 3. Every other column (Days Open, Last Activity, and all money/number columns through Total) is right-aligned.
- **C30467 (WIP-COL-02)** — First visit shows the default columns; the rest are in the column selector
    - EXPECTED: 1. The visible columns on first visit are: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, and Total.
    - EXPECTED: 2. Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default.
- **C38916 (WIP-FLT-09)** — The Location column is automatic and never reads Multiple on a work-order row
    - EXPECTED: 1. With more than one location in scope a Location column is shown, in its fixed position between VIN and Advisor, left-aligned.

---

## WIP S10-R5a

**REQUIREMENT (verbatim):** * **S10-R5a:** The **Location** filter control keeps a constant width regardless of the selected label — a single location, several, or "All locations" — so the toolbar layout does not shift as the selection changes. When the Location column is shown, it appears in its fixed position (S4-R1), left-aligned like the other identifier columns, matching the suite's placement of this column.

**CITING CASES: 1**

- **C38916 (WIP-FLT-09)** — The Location column is automatic and never reads Multiple on a work-order row
    - EXPECTED: 1. With more than one location in scope a Location column is shown, in its fixed position between VIN and Advisor, left-aligned.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden.
    - EXPECTED: 7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## IV S10-R15

**REQUIREMENT (verbatim):** * **S10-R15:** Every export (each CSV and each PDF) includes the **Location** column whenever it is shown on screen (S7-R6), and always includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected — matching the on-screen scope. In a PDF the "Locations:" line appears in the header area; in a CSV it appears as a leading metadata line above the column-header row.

**CITING CASES: 1**

- **C38917 (IV-LOC-06)** — The Location column is automatic, sits after Vendor, and never reads Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden and the surrounding columns close up.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand), naming each row's own location.

---

## IV S7-R6

**REQUIREMENT (verbatim):** * **S7-R6:** The report includes a per-row **Location** column that is shown only when the current scope spans more than one location; when a single location is in scope the column is hidden. Its visibility follows the location scope automatically and it is not one of the columns offered in the column-selection control (Story 8).

**CITING CASES: 4**

- **C30551 (IV-COL-01)** — With every column on they appear in the fixed order with the set alignment
    - EXPECTED: 4. When more than one location is in scope the automatic Location column also appears, between Vendor and Qty on Hand, left-aligned. It is not in the column-selection control, so its presence is expected and is not a failure of this test.
- **C30554 (IV-COL-04)** — On a first visit the default columns show and the rest stay available
    - EXPECTED: 4. When more than one location is in scope the automatic Location column also shows, between Vendor and Qty on Hand — it is not one of the toggleable columns and its presence is expected.
- **C38917 (IV-LOC-06)** — The Location column is automatic, sits after Vendor, and never reads Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden and the surrounding columns close up.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand), naming each row's own location.
- **C30580 (IV-PERS-02)** — Toggling columns never reorders them
    - EXPECTED: 1. Whatever columns are shown, they appear in the fixed left-to-right order — with the automatic Location column, when more than one location is in scope, between Vendor and Qty on Hand (Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) — toggling visibility never reorders columns.

---

## IV S7-R7

**REQUIREMENT (verbatim):** * **S7-R7:** When the Location column is shown, each row's Location cell names the location that row's part stock is held at. Because each row is one part at one location (S2-R2, S2-R3), every row maps to exactly one location — the report never shows an aggregated "Multiple" value in this column.

**CITING CASES: 1**

- **C38917 (IV-LOC-06)** — The Location column is automatic, sits after Vendor, and never reads Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.
    - EXPECTED: 3. NO row ever shows "Multiple" — each row is one part at one location.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden and the surrounding columns close up.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

---

## IV S12-R10

**REQUIREMENT (verbatim):** * **S12-R10:** When shown, the **Location** column appears in the left-hand identifier group, immediately after Vendor and before Qty on Hand (S3-R1), using the suite's standard column styling. The **Location** filter control in the toolbar keeps a constant width regardless of the selected location label — a long location name or "All locations" does not resize the control — matching the Location column and filter treatment used across the reports suite.

**CITING CASES: 1**

- **C38917 (IV-LOC-06)** — The Location column is automatic, sits after Vendor, and never reads Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.
    - EXPECTED: 4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.
    - EXPECTED: 5. With a single location in scope the Location column is hidden and the surrounding columns close up.
    - EXPECTED: 6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand), naming each row's own location.

---

## IV S3-R1

**REQUIREMENT (verbatim):** * **S3-R1:** The columns appear in this left-to-right order: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost. When the report is scoped to more than one location, a **Location** column (S7-R6) is inserted between Vendor and Qty on Hand; it is hidden for a single-location scope.

**CITING CASES: 3**

- **C30551 (IV-COL-01)** — With every column on they appear in the fixed order with the set alignment
    - EXPECTED: 1. With a single location in scope the columns appear in this order: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.
    - EXPECTED: 2. Part #, Description, Category, and Vendor are left-aligned.
    - EXPECTED: 4. When more than one location is in scope the automatic Location column also appears, between Vendor and Qty on Hand, left-aligned. It is not in the column-selection control, so its presence is expected and is not a failure of this test.
- **C38917 (IV-LOC-06)** — The Location column is automatic, sits after Vendor, and never reads Multiple
    - EXPECTED: 1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.
    - EXPECTED: 7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand), naming each row's own location.
- **C30580 (IV-PERS-02)** — Toggling columns never reorders them
    - EXPECTED: 1. Whatever columns are shown, they appear in the fixed left-to-right order — with the automatic Location column, when more than one location is in scope, between Vendor and Qty on Hand (Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) — toggling visibility never reorders columns.


## UNSUBSTANTIATED ROWS: 0 []
