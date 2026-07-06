# Fees & Discounts V1 — Design Notes (extracted from HTML mockups)

> **Source:** `0b7fe45f-Work_Order.zip` (ShopView design mockups), unzipped to
> `/tmp/fees-discounts/designs/`. These are static HTML/CSS/JS prototypes of the
> Fees & Discounts ("F&D") UI. All labels, options, columns and values below are
> **quoted verbatim from the HTML** (not paraphrased). Cross-referenced against
> `build/fees-discounts/requirements.md` (the "Fees & Discounts V1" spec).
>
> **Purpose:** give enough concrete UI detail (screens, modals, fields, options,
> columns, calc bases, states) to write manual test cases from the design.

---

## 0. Files in the zip

**HTML pages (the design mockups):**

| File | What it shows |
|------|---------------|
| `Work Order Line.html` | **Full WO page** — top nav, left sidebar (WO Fee/Discount card + Financial Info card), tabs (Lines / Parts / Notes / Stats / Finance), the line table, the Stats "Fees & Discounts (N)" breakdown, plus all three F&D modals and the Ask-AI panel. |
| `Work Order Line v1.html` | **Earlier version** of the same WO Line view — same line table, Stats breakdown, "WO Fees & Discounts" card, Financial Info card, and the same three F&D modals. (Fewer page-chrome elements than the final `Work Order Line.html`.) |
| `Customer Page.html` | **Customer detail page** — with the **"Fees & Discounts (3)"** tab (customer default-adjustment library) and the three F&D modals. |
| `Parts Page.html` | **Parts list page** (a parts-order / WO parts view) — parts table with a **"Fees & Discounts" column**, Financial Info card, and the three F&D modals incl. the per-part breakdown modal with a **Max Amount** column and per-row trash/Remove. |
| `Work Order Line - Bundled.html` | 8.2 MB self-contained bundle (inlined JS/CSS) of the WO Line view — same content as `Work Order Line.html`, not separately analysed. |

**Assets (non-page):**
- `components.jsx` — React primitive components (Icon set incl. `settings`, `plus`, `x`, `check`; Button variants primary/secondary/tertiary/destructive/ghost). Reference only.
- `colors_and_type.css` + `_ds/shopview-design-system-.../` — ShopView design-system tokens (`--sv-*` colors, radii, shadows), `_ds_bundle.js`, `_ds_manifest.json`, adherence lint config.
- `fonts/` and `_ds/.../fonts/` — Inter font files.
- `screenshots/` — design-iteration PNGs (e.g. `stats-table.png`, `preview.png`, `wo-sidebar-cards.png`, `01-show-more-state.png`, `fees-lines.png`).
- `uploads/` — reference screenshots (dated `2026-06-*`) + `More.svg`.
- `.thumbnail` — bundler artifact.

**Not present:** no Template Builder / Administration page, no Finance/estimate/invoice F&D view, no standalone Edit modal, no remove-confirm dialog, no history-log view (details in §9).

---

## 1. Work Order — page chrome & sidebar (from `Work Order Line.html`)

Top nav links: **Work Orders · Schedule · Customers · Parts · Reports** (global search `⌘K`, shop switcher "Heavy Duty", avatar).
WO header: **S2-13274**, status **In Progress**, "Started: Jun 8, 2026", "Total Hours: 36.60 hrs", "Progress 33%".
Tabs on the WO: **Lines (3) · Parts · Notes · Stats · Finance**. Top-right actions: `⋮` More-actions menu, **Ask AI**, **Add New Line**.

### 1a. "Work Order Fee / Discount" card (left sidebar)
- Card title: **"Work Order Fee / Discount"** (class `.wo-fd-card`, max-width 300px).
- One entry shown: **"Early Payment Discount"**, meta/value **"−8%"**, amount **"−$857.23"** (discount amounts render in success/green `--sv-success-text`; fees in warning color `--sv-warning-text`).
- Per-entry `⋮` **"More actions"** menu → **Edit**, **Delete** (only these two).
- This card is the **whole-work-order** adjustment surface (matches spec: WO card = whole-WO adjustments only).
- In `Work Order Line v1.html` the equivalent card is titled **"WO Fees & Discounts"** wording via the header "Work Order Fee / Discount" + an **"Add Fee / Discount"** secondary button (`.modal-btn-secondary`) that opens the Add modal.

### 1b. "Financial Info" card (left sidebar) — READ-ONLY
- Card title **"Financial Info"** with a single card-level **Edit** pencil (`.wo-icon-btn title="Edit"`). **No per-row menus** — consistent with spec "Financial Info card = read-only list."
- Rows (verbatim):
  - Parts — `$5,501.94`
  - Labor — `$7,268.70`
  - **Fees & Discounts (5)** — **−$2,055.25**  ← count badge "(5)" + net total
    - Early Payment Discount — −$857.23
    - Part discount (LF3620) — −$649.00
    - Fleet discount (LF3620) — −$292.00
    - Parts Handling Fee — +$3.75
    - Line discount — −$260.77
  - Subtotal — $10,715.39
  - HST — $1,393.00
  - Total — $12,108.39
  - Balance — $12,108.39
- Note the F&D breakdown here is nested/indented under the "Fees & Discounts (5)" row; scope is disambiguated by suffix e.g. "(LF3620)". Sign convention: discounts `−`, fees `+`.

---

## 2. Work Order — Line table (Lines tab)

Column header labels (`.wo-th-label`): **Name / Description · Actual / Est. · Status · Rate · Margin · Total** (plus leading select-all checkbox, collapse-all, menu).

Row-level controls per line (`⋮` "More actions" dropdown on a line header):
**Uncomplete · Add line note · Save line · Story history · Audit log · Add fee / discount**.

### 2a. Line-level (labor) adjustment — inline
- Line 1: "Service - Perform LOF and inspection", **Complete** badge, "1.93 / 1.50", "$149.95", "57%", "$495.50".
- Inline under the line title: **"Line discount"  −5%** with a `⋮` (`.wo-inline-more-btn`) → **Edit · Delete**. Discount amount shown at right: **−$26.08**.
- **Labor** sub-row hover `⋮` → **Edit labor · Move labor · Add fee / discount**. ("Brenda Martinez … $224.93".)

### 2b. Part-level adjustments — inline, with "Show N more"
- **Parts** sub-rows; hover `⋮` → **Edit part · Move · Add fee / discount**.
- Part `(LF3620) Engine Oil Filter, Detroit Series 60 (2 Required)` has **multiple** inline adjustments:
  - **Part discount**  −10%  (`⋮` Edit · Delete) → amount −$6.49
  - **Fleet discount**  −5%  (`⋮` Edit · Delete) → amount −$2.92
  - **Parts Handling Fee**  +$3.75  (`⋮` Edit · Delete) → amount +$3.75
  - a **"Show 2 more"** toggle (`.wo-show-more`) collapses/expands extra adjustments. (Screenshots `01-show-more.png` / `01-show-more-state.png` show collapsed vs expanded.)
- Part total column stacks the base total plus each adjustment line (e.g. `$58.47`, `−$6.49`, `−$2.92`, `+$3.75`).
- Other parts (HDEO14, WWF, BRAKECLEAN, GREASETUBE) each expose "Add fee / discount" via their row `⋮` but carry no adjustment.

**Affordances summary (line table):** every scope (WO menu, labor `⋮`, part `⋮`) has an **"Add fee / discount"** item — matches spec "scope is set by where you start; no scope dropdown." Inline adjustments show **name + signed value (% or $)** and per-item **Edit/Delete**.

---

## 3. Work Order — Stats tab: "Fees & Discounts (N)" breakdown table

Section header **"Fees & Discounts (5)"** with columns **Value** and **Amount** (name column on the left; grid `.stats-grid--finance`). Other Stats sections for reference: **Hours** (Tech hours / Clocked hours / Tech Efficiency / Billing Efficiency), **Labor** (Sell price / Cost / Margin / % / Total), **Parts** (same), **Total** (same).

F&D rows (each name + a blue scope **link** `.stats-sub-link` + Value + Amount):

| Name | Scope link (hyperlink) | Value | Amount |
|------|------------------------|-------|--------|
| Work order discount | S2-13274 | −8% | −$857.23 |
| Part discount | Line 1 · (LF3620) Engine Oil Filter | −10% | −$649.00 |
| Fleet discount | Line 1 · (LF3620) Engine Oil Filter | −5% | −$292.00 |
| Parts Handling Fee | Line 1 · (LF3620) Engine Oil Filter | +2% | +$3.75 |
| Line discount | Line 1 · Service - Perform LOF and inspection | −5% | −$260.77 |
| **Total** | | | **−$1,198.02** |

- **Scope links** name the target (WO number, or "Line N · <part/labor>") — clicking is the "jump to scope / breakdown" affordance.
- Row hover exposes a `⋮` **row-more** button (`.row-more-btn`).
- There's an **"Add Fee / Discount"** secondary button near this table (`.modal-btn-secondary`).
- **Sign convention** consistent: discount `−`, fee `+`; percentage shown as "Value", dollar impact as "Amount".

> ⚠ Numeric inconsistency in the mock: Stats "Fees & Discounts (5)" totals **−$1,198.02**, but the Financial Info card "Fees & Discounts (5)" totals **−$2,055.25**. Treat as mock placeholder data, not a spec rule.

---

## 4. Customer page — "Fees & Discounts (3)" tab (customer default library)

Tabs on the customer: Work Orders · Part Sales · Contacts · Assets · Notes · Unpaid Invoices · Payments · **Fees & Discounts (3)** · Credits.
Tab action button: **"Add Fee/Discount"** (`.modal-btn-primary`).

**Table columns (verbatim):**
**Name · Type · Calculation Type · Amount · Max Amount · Taxable · Auto-Apply to Work Orders** + Actions (`⋮`).

Rows:

| Name | Type | Calculation Type | Amount | Max Amount | Taxable | Auto-Apply to Work Orders |
|------|------|------------------|--------|-----------|---------|---------------------------|
| Military Discount | Discount | 10% of Subtotal | −10% | — | No | Yes |
| Parts Handling Fee | Fee | % of Labor Total | 5% | $50.00 | Yes | No |
| Early Payment Discount | Discount | % of Parts Total | −3% | — | No | No |

- Per-row `⋮` **More actions** → **Remove** (only "Remove", no "Delete").
- This is the surface for spec's **customer default adjustments** ("each default = a link to a template", auto-apply column). Confirms **Taxable** (Yes/No) and **Max Amount** exist as data even though the Add modal here doesn't collect them (see §5, §9).
- **Calculation bases seen here:** "10% of Subtotal", "% of Labor Total", "% of Parts Total".

---

## 5. Parts page — "Fees & Discounts" column + per-part breakdown

WO/parts header: **P1-4**, **Approved**, **Over Limit**, "Started: May 18, 2026", customer "Accurate Aeronautics". Left sidebar has the same **Financial Info** card as §1b. Tabs: **Parts · Statistics · Finance**. Action: **Add Part**.

**Parts table columns (verbatim):**
select · **Description · Part Number · Quantity · Cost · Core · Sell Price · Margin · Category · Vendor · Fees & Discounts · Requested At · Status · Actions**.

**"Fees & Discounts" column behaviors (the key cell = `.pt-fd-cell` / `.pt-fd-add-btn`):**
- Part `#37346` (Mobil 1 5W20): cell shows **"Military Discount  −10%"**, cell `title="View Military Discount"` (single adjustment → names it, links to breakdown).
- Part `#55073` (Mobil 1 5W20): cell shows **"Parts Handling Fee  2%  +2"** — i.e. first adjustment + a **"+2" badge** for the two additional adjustments; cell `title="View fees & discounts"`.
- Part `#28439` (Fleetguard FF5421): **no adjustments** → shows an **"Add"** button (`.pt-fd-add-btn title="Add fee / discount"`).
- So the column has three states: **single** (name + value), **multiple** (name + value + **+N** badge), **empty** (**+ Add** button). Clicking a populated cell opens the **breakdown modal** (§8).

---

## 6. MODAL — "Add new fee/discount" (the primary Add dialog)

Present identically in **all four** HTML pages (`id="feeModal"`; opened by `openFeeModal()` from any "Add fee / discount" affordance / toolbar / `⋮`).

- **Header title:** **"Add new fee/discount"**. **Header context/subtitle = the scope**:
  - WO scope → **"S2-13274"** (the WO number).
  - Part scope (Parts page) → link **"Line 2 · S2-13274"**.
- Close `×` (`.modal-close-btn title="Close"`). Also closes on overlay click and **Esc**.

**Fields (in order):**
1. **"Apply from template"** — `<select id="fd-template">` (floating label). Options (verbatim, value → label):
   - *(blank)*
   - `fleet-discount` → **"Fleet Standard Discount (−10%)"**
   - `loyalty-discount` → **"Loyalty Discount (−5%)"**
   - `shop-supply` → **"Parts Handling Fee (+$25.00 flat)"**
   - `env-fee` → **"Environmental Fee (+2.5%)"**
   - `early-payment` → **"Early Payment Discount (−3%)"**
   - `labor-surcharge` → **"Labor Surcharge (+$50.00 flat)"**
   - Selecting a template **auto-fills** Name/Type/Calc/Amount via `applyTemplate()` (values in JS `FD_TEMPLATES`):
     | key | name | type | calc | amount |
     |-----|------|------|------|--------|
     | fleet-discount | Fleet Standard Discount | discount | percentage | 10 |
     | loyalty-discount | Loyalty Discount | discount | percentage | 5 |
     | shop-supply | Parts Handling Fee | fee | flat | 25 |
     | env-fee | Environmental Fee | fee | percentage | 2.5 |
     | early-payment | Early Payment Discount | discount | percentage | 3 |
     | labor-surcharge | Labor Surcharge | fee | flat | 50 |
2. **"Name"** — `<input type="text" id="fd-name">` (free text; placeholder is a single space for the floating-label effect).
3. **"Type"** — `<select id="fd-type">`: *(blank)* · **Discount** (`discount`) · **Fee** (`fee`). *(No "Processing Fee" option here.)*
4. **"Calculation type"** — `<select id="fd-calc">`: *(blank)* · **Percentage** (`percentage`) · **Flat amount** (`flat`).
5. **"Amount"** — `<input type="number" id="fd-amount">`. Adornment switches by calc type (`updateCalcUI()`): **`$` prefix** when Flat, **`%` suffix** when Percentage, none when blank.
6. **"Max cap"** — `<input type="number" id="fd-maxcap" min="0" step="any">`. (Field is always rendered in these mockups; caps the computed adjustment — see preview logic.)

**Live preview block (`.fd-summary`):**
- **"Work Order Total"** — `$10,715.39` (constant `FD_WO_TOTAL = 10715.39`).
- **"Fee / Discount"** — starts as `—`; label flips to **"Discount"** or **"Fee"** once Type chosen; value shows **`−$…`** (green) for discount, **`+$…`** (amber) for fee.
- **"New Work Order Total"** — recomputed live.
- **Preview math (`updateSummary()`):** `adj = percentage ? WO_TOTAL*amount/100 : amount`; if `maxcap` set and `adj > cap`, `adj = cap`; `delta = discount ? −adj : +adj`; `newTotal = WO_TOTAL + delta`. Negative amounts are floored to 0 (`Math.max(0, raw)`).
  - ⚠ **The preview always computes percentage against the single WO Total** — it does **not** vary by base (Labor/Parts/Subtotal). The Add modal has **no base selector** at all.

**Footer:** **Cancel** (`.modal-btn-secondary`) · **Add** (`.modal-btn-primary` `id="fd-add-btn"`).
- **Add is `disabled` by default.** `validateForm()` enables it only when **Name AND Type AND Calc type AND Amount > 0** are all set. (Max cap not required.)
- Closing/cancel resets all fields, adornments, preview, and re-disables Add (`resetFeeModal()`).

---

## 7. MODAL — "Add Fee/Discount" (bulk template picker, checkbox list)

Second, distinct Add dialog present in all pages (`.modal-hd-title` **"Add Fee/Discount"**, subtitle **"Select a fee or discount template to add to this customer"**). Close `×`.

**Columns:** **Name · Type · Calculation Type · Amount** (Parts-page variant adds a **Max Amount** column). Each row has a **checkbox** (`.wo-checkbox`) → multi-select.

Template rows (verbatim; Parts-page Max-Amount values in parens):

| Name | Type | Calculation Type | Amount | (Max Amount) |
|------|------|------------------|--------|--------------|
| Military Discount | Discount | 10% of Subtotal | −10% | — |
| Parts Handling Fee | Fee | % of Labor Total | 5% | $50.00 |
| Early Payment Discount | Discount | % of Parts Total | −3% | — |
| Loyalty Discount | Discount | % of Parts Total | −5% | — |
| Environmental Fee | Fee | % of Labor Total | 2.5% | — |
| Labor Surcharge | Fee | Flat amount | $50.00 | — |
| Fuel Surcharge | Fee | % of Subtotal | 3% | — |
| Senior / Veteran Discount | Discount | % of Subtotal | −8% | — |

**Footer:** **Cancel** · **Add**.

> ⚠ **Two different template sets** in the mock: the §6 "Apply from template" dropdown (6 entries) ≠ this picker list (8 entries). Real product should share one location template library; treat the divergence as mock data only.
>
> **Calculation bases seen (full set):** "% of Subtotal" / "10% of Subtotal", "% of Labor Total", "% of Parts Total". (No "% of Grand Total" appears anywhere — that is Processing-Fee-only per spec §2, and Processing Fee UI is absent.)

---

## 8. MODAL — per-line / per-part "Fees & Discounts" breakdown

Opened from a populated Parts-page F&D cell (§5), a Stats scope link (§3), or a WO line breakdown. Header **"Fees & Discounts"** + a subtitle naming the item.

- **WO-line-table / Customer variant** subtitle: **"Mobil 1 5W20 Synthetic Engine Oil · #55073"**. Columns **Name · Type · Calculation · Amount**. Rows:
  - Parts Handling Fee · Fee · 2% of Labor Total · +$1.43
  - Military Discount · Discount · 10% of Subtotal · −$3.31
  - Early Payment Discount · Discount · 3% of Parts Total · −$0.99
  - **Net adjustment  −$2.87**
  - Footer: **Close** only (read-only variant — no per-row remove).

- **Parts-page variant (editable):** subtitle is a scope link, e.g. **"Line 2 · Mobil 1 5W20 Synthetic Engine Oil · #55073"**. Columns add **Max Amount**, and **each row has a trash button** `.pfd-trash-btn title="Remove"`:
  - Parts Handling Fee · Fee · 2% of Labor Total · +$1.43 · $50.00 · 🗑
  - Military Discount · Discount · 10% of Subtotal · −$3.31 · — · 🗑
  - Early Payment Discount · Discount · 3% of Parts Total · −$0.99 · — · 🗑
  - **Net adjustment  −$2.87** · footer **Close**.
  - Single-adjustment variant (#37346): Military Discount · Discount · 10% of Subtotal · −$6.53 · — · 🗑; **Net adjustment −$6.53**.

**Breakdown columns summary:** **Name / Type / Calculation / Amount** (+ **Max Amount** on Parts page); a **Net adjustment** footer total; **Close** button; **per-row 🗑 Remove** only in the editable (Parts-page) variant. The "Calculation" column here shows the **base-aware** phrasing (e.g. "2% of Labor Total").

---

## 9. Design ↔ spec discrepancies (vs `requirements.md`)

1. **No calculation-base selector in the Add modal.** Spec §5 says a percentage adjustment is "a percentage of one of several before-tax bases" (Labor/Parts/Subtotal, and % of Grand Total for Processing Fee). The Add modal (§6) only offers **Percentage / Flat amount** and computes % off a single flat WO total. The **base is only shown in read-only lists** (customer tab, template picker, breakdown, stats) — never collected in the design's Add dialog. **Open design question.**
2. **No Taxable control in the Add/Edit dialog.** Spec §1 lists "Taxable setting" as a core field; the Customer tab (§4) has a **Taxable** column, but no modal collects it.
3. **No Processing Fee.** Spec Story 8 defines a third type "Processing Fee" (template-only, "% of Grand Total"). Absent from Type options and from any admin page — consistent with it being template/admin-only, but the admin surface itself is missing (see below).
4. **Max cap always shown.** Spec §1/§2 restricts Max Amount to percentage adjustments (never Processing Fee). The design shows "Max cap" unconditionally and caps flat amounts too.
5. **Two divergent template lists** (§6 dropdown of 6 vs §7 picker of 8) — mock inconsistency, not a spec model.
6. **Numeric mismatch** between Stats total (−$1,198.02) and Financial Info total (−$2,055.25) for the same "(5)" set — placeholder data.
7. **"Remove" vs "Delete" wording** — spec §Permissions says removing uses "Create and Edit," not "Delete." Design mostly uses **"Remove"** (customer tab, parts breakdown trash) but the inline line/part `⋮` and WO card use **"Delete"/"Edit"**. Wording is inconsistent across surfaces.
8. **Consistencies confirmed:** scope-by-starting-place with **no scope dropdown** (✓); WO card = whole-WO only (✓); Financial Info = read-only (✓); customer defaults + **Auto-Apply** column (✓); sign convention fee `+` / discount `−` (✓); "+N" badge and "Show N more" for multiple adjustments (✓).

---

## 10. Design elements NOT present / still open

- **No standalone Edit modal.** "Edit" is only a menu item everywhere; there is **no markup** showing the Edit dialog or **which fields are locked vs editable** (spec Story 2). The Add modal is presumably reused, but locked-field behavior is unspecified in these files.
- **No remove/delete confirmation dialog.** Remove/Delete act directly (menu item or 🗑); no confirm/undo dialog or destructive-warning modal exists in the HTML.
- **No validation/error visual states** beyond the disabled **Add** button. No inline error text, no field-level red/invalid styling, no "amount required" / "name required" messages, no max-length or negative-amount error copy (negatives are silently floored to 0). No toast/feedback UI (spec §7 toast table) is mocked.
- **No Template Builder / Administration "Fees & Discounts" page** (spec Story 7 / Story 8) — the location template library and Processing-Fee creation UI are not in these files.
- **No customer estimate or invoice view** (spec Story 5) — how F&D renders on printed/customer-facing documents is not shown. (Customer page has an "Unpaid Invoices" tab label only, no F&D content.)
- **No Finance-tab F&D view** — the WO "Finance" and parts "Finance" tabs exist as labels but no F&D-specific finance layout is mocked.
- **No history / audit log view for F&D** (spec Story 10) — "Story history" and "Audit log" are line `⋮` menu items with no F&D-history screen.
- **No QuickBooks mapping UI** (spec Story 6) — expected (backend), noted for completeness.
- **No feature-flag "off" empty state** — spec says all F&D controls disappear when the org flag is off; no such state is mocked.
- **No tooltips/placeholder copy of substance** — text inputs use a blank-space placeholder purely to drive floating labels; cell tooltips are limited to `title="View fees & discounts"` / `title="View <name>"` / `title="Add fee / discount"` / `title="Remove"` / `title="More actions"`.
