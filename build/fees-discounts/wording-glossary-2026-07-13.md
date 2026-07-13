# F&D build-accurate label glossary — captured live 2026-07-13

> Exact on-screen labels captured live from `qb.qa.shopview.com` on 2026-07-13 for the
> wording+VIU pass (Standing Rule 9). Screenshots in `screenshots/wording-2026-07-13/`.
> Per-area sections added as each area is processed.

## FD-WO — Work Order Lines surface + whole-WO Add/Edit fee/discount dialog

Captured on WO **S3-15960** Lines tab (screenshots `wo-01-lines.png` … `wo-05-maxamount.png`).

**Work order detail tabs (top of the lines area):** `Lines (N)` · `Parts (N)` · `Notes` ·
`Stats` · `Finance` (plus an "AI SHOPCOACH ANALYSIS" link).

**Lines toolbar (top-right):** the "SHOPCOACH ANALYSIS" link, a **more (⋮)** icon button, then
the blue **New Line** button.

**More (⋮) menu items (top-right of Lines):** `Audit Log` · `Timesheets (N)` ·
**`Add Fee/Discount`** · `Delete Work Order`.
→ The whole-WO fee/discount starting place is the **`Add Fee/Discount`** item (NOT
"Add Work Order Fee / Discount", which was our older spec wording).

**Add dialog:**
- Title: **`Add new fee/discount`** (NOT "New Fee / Discount"); an `×` close at top-right.
- Fields top→bottom: **`Apply From Template`** (dropdown) · **`Name`** · **`Type`**
  (dropdown, default `Fee`; other value `Discount`) · **`Calculation Type`** (dropdown,
  default `Flat Amount`) · the amount field · **`Taxable`** (a **toggle switch**, default
  **`Yes`**) · a live-preview box.
- **Calculation Type options (whole-WO):** `Flat Amount` · `% of Labor Total` ·
  `% of Parts Total` · `% of Subtotal`. There is **no generic "Percentage"** option and
  **no "% of Grand Total"** (that is Processing-Fee only).
- **Amount field label changes with the method:** `Flat Amount` → the field reads
  **`$ Amount`** (dollar amount); a `%` method → the field reads **`Percent`** with a `%`
  suffix.
- **`$ Max Amount (Optional)`** field appears **only** when a percentage method is chosen
  (hidden for `Flat Amount`).
- **Live-preview empty prompt (before an amount is typed):** exactly
  **`Enter an amount to see the impact.`**
- Buttons: **`Cancel`** and **`Add Fee`** (when Type = Fee) / **`Add Discount`** (when
  Type = Discount).
- **No tax-jurisdiction note is shown below the Taxable toggle** in the whole-WO Add
  dialog (checked with both Flat Amount and % of Subtotal) — the spec §5-R15 note is
  NOT implemented here (FD-WO-016 finding).
- The `Add Fee` button is **enabled on an empty form** (validates on submit) — the older
  "disabled until valid" expectation is a deviation (FD-WO-005 / BUG-FD-4).

**Inline line adjustment (Lines tab, under a line):** a row labelled **`Fees/Discounts`**
with a `↳` arrow, the adjustment name, a rate badge, a right-aligned grey amount, and a
per-row **⋮ (more_vert)** menu.

**Sidebar cards:**
- **`Financial Info`** card: rows `Parts` · `Labor` · `Shop Supplies` · `Subtotal` ·
  `GST` · `Total` · `Balance`, plus a collapsible **`Fees & Discounts (N)`** row showing
  the net adjustment in grey.
- Whole-WO adjustments card title: **`WO Fees & Discounts`** (NOT "Work Order Fee /
  Discount"); each row shows the name, a signed rate badge, a grey amount, and a ⋮ menu.

**Tax label on this env:** **`GST`** (Canadian test org "Staging Foothills Group Inc" /
Staging Lethbridge - 4310).

## FD-FIN / FD-INLINE / FD-STATS / FD-REMOVE (same WO Lines surface)

- **Financial Info card** header: `Item` / `Cost`; money rows `Parts`, `Labor`,
  `Shop Supplies`, `Subtotal`, `GST`, `Total`, `Balance`, plus a **`Fees & Discounts (N)`**
  row showing the net in grey (shot `fin-03`).
- **Sidebar card** for whole-WO adjustments: title **`WO Fees & Discounts`**; each row =
  name + signed rate badge + grey amount + a **⋮** menu. The ⋮ menu options are exactly
  **`Edit`** and **`Remove`** (shot `fin-03`).
- **Inline line adjustment** (Lines tab): row labelled **`Fees/Discounts`** with a `↳`
  arrow, name, rate badge, right-aligned grey amount and a per-row **⋮** menu whose options
  are **`Edit`** / **`Remove`** (shot `inline-01`).
- **Remove confirm dialog:** title **`Remove Fee / Discount`**, message
  **`Are you sure you want to remove this fee?`**, buttons **`Remove`** and **`Cancel`**
  (shot `inline-02`).
- **Stats tab** (`/statistics`): sections `Hours`, `Labor`, `Parts`, `Total` (each with
  column headers), then a **`Fees & Discounts (N)`** section that lists each fee/discount as
  `name … [value/% for percentages] … signed amount`. This section has **no** `Value`/
  `Amount` column headers (unlike the other sections) and shows **no scope hyperlink** on
  the rows (shot `fin-01`) — BUG-FD-2 deviation.

## FD-EDIT (Edit fee/discount dialog)

- Title **`Edit Fee / Discount`** (shot `edit-01`); opened from a ⋮ menu > **`Edit`**.
- **`Type`** and **`Calculation Type`** are shown **greyed out / locked**; **`Name`**, the
  amount, **`$ Max Amount (Optional)`** (% only) and the **`Taxable`** toggle are editable.
- **No `Apply From Template` dropdown** in Edit (the template picker is hidden).
- Preview rows: **`Work-order subtotal`** / **`Fee`** or **`Discount`** (signed) /
  **`New work-order subtotal`** / **`Tax is recalculated on save.`**
- Buttons: **`Cancel`** / **`Save`**.
