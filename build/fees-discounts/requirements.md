# Fees & Discounts V1 — Consolidated Requirements (for test-case authoring)

> **Source of truth:** the **"Fees & Discounts V1"** spec, exported from Confluence
> as a Word `.doc` (MHTML) — extracted in full to `/tmp/fees-discounts/spec-full.txt`.
> This document is a structured, near-verbatim extract organized so it can be turned
> directly into concrete manual test cases. Where the spec cites a rule id (e.g.
> §5-R4, S1-R3, S13-R9) the id is kept so cases can be traced back.
>
> **Spec status (from the header table):** *WIP — minor clerical updates as we go.*
> Epic / Owner / Branch = TBD. POC video (Loom) linked in header; companion video
> "to be filmed."
>
> **COMPLETENESS — now the FULL spec.** The earlier PDF was truncated at Story 2
> (S2-R9). This `.doc` contains the complete spec: **Stories 1–14**, the full §5
> calculation contract, §6 QuickBooks, §7 User Feedback Summary (toast table), and
> §8 Change Log. All previously-missing content (Stories 3–13, incl. the Story 13
> action→permission mapping table) is present and captured below.
>
> **Stories present:** 1 (starting places), 2 (Add/Edit dialog), 3 (viewing/managing
> on WO), 4 (Statistics tab), 5 (customer invoice/estimate), 6 (QuickBooks sync),
> 7 (templates admin), 8 (Processing Fee), 9 (customer defaults), 10 (history log),
> 11 (Part Sales), 12 (visual rules), 13 (permissions), 14 (shop supplies on
> estimates/invoices/financial tab). **No story ids are missing.**
>
> **Design files:** three claude.ai design links exist (WO line, Customers page,
> Parts page) plus the Loom POC video. The claude.ai share links require a logged-in
> claude.ai session and are **NOT retrievable** via the harness. Pixel-level layout
> not in the spec text must be confirmed against the designs / POC video. All exact
> on-screen strings quoted below are taken verbatim from the spec.

---

## 1. Overview

**What it is.** A built-in way to add extra charges (**fees**) and price reductions
(**discounts**) to a work order, instead of the current workarounds (editing line
prices by hand or adding fake labor lines, which create bad data and break
QuickBooks sync). Connected to WO money totals, customer documents, QuickBooks, and
reporting.

**"Adjustment"** is the umbrella term for both a fee and a discount, used everywhere
in the system and the spec.

- A **Fee** *adds* to the total (a **plus / +** amount).
- A **Discount** *lowers* the total (a **minus / −** amount).

**Every adjustment has four settings:**
1. **Type** — fee or discount (or Processing Fee, a template-only type — Story 8).
2. **Calculation method** (on-screen dropdown label: **"Calculation type"**) — a
   **Flat Amount**, or a **percentage** of one of several before-tax bases.
3. **Taxable setting** — taxable or non-taxable.
4. **Optional Max Amount** (percentage adjustments only; never Processing Fee).

**Scope** — where an adjustment applies. Exactly **three** scopes:
- **Whole Work Order** (a.k.a. Whole Parts Sale)
- **Labor Line** (one labor line)
- **Part Line** (one part)

Scope is set by **where the user starts** the add action — there is **no scope
dropdown**. Processing Fee is the exception (no manual starting place — Story 8).

**Where adjustments appear on a work order (four places):**
1. **"WO Fees & Discounts" card** in the sidebar — **whole-work-order adjustments only**.
2. **Inline on the work-order line table** (line-level adjustments show on their line).
3. **Financial Info card** — **read-only** list (no add/edit/remove here).
4. **Statistics tab.**

They also appear on **customer estimates and invoices**, and each is sent to
**QuickBooks** as its own invoice line item on invoicing.

**Templates & defaults:**
- A **location** keeps a **library of template adjustments** ("Fees & Discounts" in
  administration). A template applies to a WO in **one click**. Each shop location
  has its own library.
- A template can be marked **auto-apply** → added to **every new WO created at that
  location**.
- A **customer** can have **default adjustments**; each default is a **link to a
  template**, added to **every new WO created for that customer**.
- A user may apply the **same template to one WO more than once**, by hand.

**Feature flag:**
- Controlled by the **Fees & Discounts feature flag, set per organization**.
- **Off** → no fees-and-discounts controls appear anywhere in the product.
- **Exception:** the WO **history log still shows** fee/discount history even when the
  flag is off (Story 10).

**Editing / removing:** an adjustment can be edited or removed **while the WO is
open** (not yet invoiced or paid). Deleting a labor line or part **removes any
adjustment that points to it**. Every add/edit/remove is written to the **WO
history log**.

**Explicitly out of scope for V1:**
- One fee/discount applied to a line's labor **and** its parts together in a single
  action (only the three scopes above exist).
- Advanced per-template QuickBooks item mapping (picking a specific Product/Service
  per template) — every fee/discount posts to the location's single **Fee** or
  **Discount** item.
- Per-class allocation — when a location segments revenue by QuickBooks Class, every
  fee/discount posts under the invoice's **single class**.

### Key decisions (§3 of spec)
- Scope is set by where the user starts (toolbar = whole WO; labor-line menu = that
  line; part menu = that part). No scope dropdown. Processing Fee is the exception.
- All adjustments calculate from **before-tax** amounts, with **one exception**: a
  Processing Fee using **% of Grand Total**, whose base includes tax on purpose.
- Same template may be applied to one WO **more than once** by hand.
- Deleting a template does not change adjustments already on WOs; it removes the
  template and any customer-default links (S7-R4).
- The **Financial Info card is read-only** for adjustments.
- Fees & Discounts adds **no permission of its own** (Story 13). Removing an
  adjustment uses **"Create and Edit"**, not "Delete." Add/edit also needs **See
  Financial Data**.
- Fees/discounts require **mapped QuickBooks items** (a Fee item and a Discount item)
  when QuickBooks is connected, before adding is allowed (S6-R6). Unmapping later is
  recoverable via Unexported Items, not hard-blocked (S6-R7).

---

## 2. Fee types

The spec names two kinds of "fee":

1. **Standard Fee** — a normal adjustment of type = fee. Scope: Labor Line, Part
   Line, or Whole Work Order; Flat Amount or a percentage of the allowed base for
   that scope (§5-R10). Resolves to a **plus (+)** amount.
   - Percentage fees have **no upper limit** (§5-R2).
   - Real-world examples: hazardous-waste disposal fee, manager price change.

2. **Processing Fee** — a special **Whole-Work-Order fee type** (a *type*, not a
   fourth scope; always Whole Work Order — S8-R4). Distinctive rules (Story 8):
   - "Processing Fee" is a **third type** in the template builder, beside Fee and
     Discount (S8-R1). **Always adds** to the total; never a discount (S8-R2).
   - **Created only as a template** on the administration Fees & Discounts page
     (S8-R3). **Cannot be added to a WO by hand** (S8-R16).
   - **No manual starting place** — reaches a WO **only via auto-apply (S8-R14) or a
     customer default (S8-R15)**.
   - Methods: **Flat Amount** (default, S8-R6) or **% of Grand Total** (S8-R5);
     "% of Grand Total" is offered **only** for a Processing Fee (S8-R9).
   - **% of Grand Total is the one exception** to the "before-tax" rule — its base
     **includes tax on purpose** (§5-R4).
   - **No Max Amount** for either method — the field is not shown (S8-R10, S8-N3).
   - **Taxable** Yes/No shown, default Yes (S8-R11); behavior per §5-R11 (S8-R12). A
     legal disclosure renders below the Taxable setting; render its text **exactly**
     (no paraphrase/auto-translate without legal sign-off). The copy says "toggle"
     but the control is the Yes/No dropdown.
   - **Resolves last** (Step 3, §5-R5), excluded from its own base and from every
     other Processing Fee's base.
   - On a WO it can be **removed but not edited** (S8-R17). To change amount/method/
     taxable, edit the **template** (S8-R18). Editing the template does not change
     Processing Fees already on existing WOs (S8-R19).

> Real business drivers named in the Business Case (hazardous-waste disposal,
> fleet/manager price changes) are examples of fees, not separate configured data-
> model "types."

---

## 3. Discount types

The spec treats discounts as a single kind: an adjustment of **type = discount**.
Rules vs fees:

- Resolves to a **minus (−)** amount (§5-R7).
- **Percentage discounts may not exceed 100%** (§5-R2) — the key fee-vs-discount
  validation difference on percentages.
- Otherwise a discount uses the same scopes, methods, bases, Max Amount, taxable, and
  template/default machinery as a fee.
- Real-world example: **fleet account discounts**.
- **Over-discounting** (discounts exceed the net subtotal) triggers the S6-R10 floor
  and a carried customer credit — see §7 QuickBooks negative-total handling.

There is **no separate "Processing Discount"** — Processing Fee is fee-only.

---

## 4. Work Order Line behavior

### 4.1 Starting places / scope selection (Story 1)
**Prerequisites for any add (S1 prereqs):** feature flag on; WO **not Invoiced or
Paid**; user **not in history mode**; user has the **Work Order change permission**.

- **S1-R1** — "Add Fee / Discount" from the **work-order toolbar's ⋯ (more) menu**
  opens the dialog at **Whole Work Order** scope. (Toolbar label on WO: **"Add Work
  Order Fee / Discount"**, per S11-R4a comparison.)
- **S1-R2** — Each **labor line row** shows its own **3-dot menu button on hover**.
- **S1-R3** — "Add Fee / Discount" from a **labor line's 3-dot menu** opens the
  dialog **locked to Labor Line scope** for that line.
- **S1-R4** — Each **part's menu** offers "Add Fee / Discount" for **both staged and
  requested parts**.
- **S1-R5** — "Add Fee / Discount" from a **part's menu** opens the dialog **locked
  to Part Line scope** for that part.
- **Context** — "Add Fee / Discount" is **not** on the work-order line's own
  right-click menu. The labor starting place is the labor line row's 3-dot menu;
  the part starting places are each part's menu.

**Negative cases (Story 1):**
- **S1-N1** — On an **Invoiced or Paid** WO, "Add Fee / Discount" is **hidden at all
  starting places** and the system **rejects** the action (S3-R1b).
- **S1-N2** — **Without the Work Order change permission**, the starting places are
  **not shown**.

### 4.2 The Add / Edit dialog (Story 2)
Prerequisites same as Story 1.

**General:**
- **S2-R1** — Amount minimums and percentage limits follow §5-R1 and §5-R2.
- **S2-R2** — Max Amount behavior follows §5-R6.
- **S2-R3** — Available **calculation methods depend on scope**, per §5-R10.
- **S2-R4** — On **edit**, the user can change **Name**, the **value** (Amount or
  Percent), **Max Amount**, and **Taxable**.
- **S2-R5** — On edit, **Type** and **Calculation type** are shown but **cannot be
  changed**.
- **S2-R6** — On save of an edit, the adjustment **resolves again** against the WO's
  **current totals**.
- **S2-R7** — On save of an edit, the **resolved amount and the tax both update**.
- **S2-R8** — **Scope and target** are set by the starting place and **cannot be
  changed** in the dialog.

**Header:**
- **S2-R9** — Title reads **"New Fee / Discount"** (add) / **"Edit Fee / Discount"** (edit).
- **S2-R10** — Labor Line scope: grey subtitle **"Applying to: Line {N} Labor —
  {name}"**, or **"Applying to: Line {N} Labor"** when the line has no name.
- **S2-R11** — Part Line scope: grey subtitle **"Applying to: Line {N} Part —
  ({part number}) {description}"**, with the part number omitted when the part has none.
- **S2-R12** — Whole Work Order scope: **no "Applying to:" subtitle**; the title alone
  names the dialog. ({N} = WO line display number; Part Sale subtitle differs — S11-R6a.)

**Template picker:**
- **S2-R13** — An **"Apply from template (optional)"** dropdown fills every field with
  the chosen template's values (replacing anything the starting place had filled).
  Only the template's **method, amount, taxable, and Max Amount** are copied —
  **never a scope**; the added adjustment takes the starting place's scope (S2-R8).
- **S2-R14** — From a line/part, the picker lists only Fee and Discount templates
  whose method fits that scope (§5-R10). It **never lists a Processing Fee template**
  (S8-N2).
- **S2-R15** — From a labor line: only **Flat Amount and % of Labor Total** templates.
- **S2-R16** — From a part: only **Flat Amount and % of Parts Total** templates.
- **S2-R17** — When filtered, a hint reads **"Showing templates compatible with this
  line."**
- **S2-R18** — Template picker shows in **add mode only**; hidden when editing.

**Form fields:**
- **S2-R19** — **Name** — required free text, up to **100 characters**.
- **S2-R20** — **Type** — dropdown "Fee" or "Discount", default **"Fee"**.
- **S2-R21** — **Calculation type** — dropdown; options depend on scope (§5-R10).
  (Type and Calculation type are two different dropdowns.)
- **S2-R22** — Default method by starting place: labor line → **% of Labor Total**;
  part → **% of Parts Total**; WO toolbar → **Flat Amount**.
- **S2-R23** — **Amount** — currency input labeled **"Amount"** (Flat Amount), or a
  number input with **"%"** suffix labeled **"Percent"** (percentage). For a Part Line
  Flat Amount, the value is the **per-item** rate (§5-R14).
- **S2-R24** — **Max Amount** — currency input labeled **"Max Amount (Optional)"**,
  shown only for a percentage method.
- **S2-R25** — Empty Max Amount = no maximum; an entered **0 is treated as empty** (no
  maximum) (§5-R6).
- **S2-R26** — **Taxable** — Yes/No dropdown labeled **"Taxable"**, default **"Yes"**.

**Submission:**
- **S2-R27** — Add mode confirm button reads **"Add Fee"** (Type=Fee) or **"Add
  Discount"** (Type=Discount); changes **live** with the Type field.
- **S2-R28** — Edit mode confirm button reads **"Save."**
- **S2-R29** — On success, the matching success toast shows and fades on its own (§7).
- **S2-R30** — On save failure, the **dialog stays open** and the returned error shows
  as an error toast.

**Live preview:**
- **S2-R31** — As the user fills in the dialog, a live preview shows three values:
  the target's value now, the adjustment applied, and the new value.
- **S2-R32** — Preview updates as the user types.
- **S2-R33** — The adjustment row is **signed and colored**: **fee green, discount
  red** (this is the only place green/red are used — S12-R2).
- **S2-R34** — For a percentage method, the preview row also shows the rate, e.g.
  **"Fee · 25%"** (note: this is not the rate badge from §4; it has a word in front and
  no sign).
- **S2-R35** — Bottom of preview shows **"Tax is recalculated on save."**
- **S2-R36a** — Labor Line: labels **"Line labor total → New line labor total"**.
- **S2-R36b** — Part Line: labels **"Part total → New part total"**.
- **S2-R36c** — Whole WO: labels **"Work-order subtotal → New work-order subtotal"**.
- **S2-R37** — A **"Base · Labor total"** row shows for a Whole-WO % of Labor Total.
- **S2-R38** — A **"Base · Parts total"** row shows for a Whole-WO % of Parts Total.
- **S2-R39** — **No "Base ·" row** for % of Subtotal or Flat Amount (base is the
  subtotal already shown).
- **S2-R40** — A **"Part cost"** row (unit cost × quantity) shows for a Part Line target.
- **S2-R41** — With no amount entered, preview reads **"Enter an amount to see the
  impact."**
- **S2-R42** — When totals can't load, preview reads **"We couldn't load the figures
  to preview this selection."**

**Negative cases (Story 2):**
- **S2-N1** — Empty **Name** blocks save with an inline error.
- **S2-N2** — Empty **Amount/Percent** blocks save with an inline error.
- **S2-N3** — A Processing Fee template **never** appears in the template picker,
  from any starting place (S8-N2).

### 4.3 Line-level resolution behavior (from §5)
- A **Labor Line** adjustment resolves against **target labor line price (gross)**.
  Allowed methods: **Flat Amount, % of Labor Total**. Flat Amount on a Labor Line has
  **no quantity part** — resolves to the set amount exactly (§5-R14).
- Line-level adjustments **resolve first** (Step 1) and **do not stack** (§5-R5).
- A line-level adjustment **shows wherever its target shows**, incl. a **Needs
  Approval estimate** (§5-R12).
- If the target line is **not billable** (declined), the adjustment resolves to
  **$0.00**; non-zero once billable/authorized (§5-R12).
- **Deleting the labor line removes** any adjustment pointing to it (S3-R2).

---

## 5. Parts Page behavior (Part Line scope)

### Part-line resolution (from §5)
- Base = **target part quantity × sell price (gross)** (§5-R4).
- Allowed methods: **Flat Amount, % of Parts Total** (§5-R10).
- **§5-R14 — Flat Amount on a Part Line is PER ITEM:** resolved = **set amount ×
  quantity**. Ex: $5.00 discount, qty 3 → **−$15.00**; qty 1 → **−$5.00**.
- **§5-R13 — requested parts:** a Part Line adjustment may point to a **requested (not
  yet picked) part**, so the fee/discount shows **before the part is picked**.
  Resolves against quantity × sell price, follows the target per §5-R12, **stays
  attached when the part changes from requested to received**; a received part
  **cannot be re-pointed** to a request.
- **Billable:** part is billable when **authorized, not declined, and still has
  quantity left**. Not billable (declined, or returned with no quantity left) →
  resolves to **$0** (§5-R12).
- **Deleting the part removes** any adjustment pointing to it (S3-R2).

### Part Sales (counter sales) — Story 11
- **S11-R1** — A Part Sale works like a WO; identical for adjustments, pricing/totals,
  customer documents (Story 5), and QuickBooks sync (Story 6).
- **S11-R2a** — No labor → a **labor-based method resolves to $0**.
- **S11-R2b** — Part Sale does **not use Labor Line scope**.
- **S11-R3** — Add/Edit dialog same as Story 2, except on a **Whole Parts Sale**
  adjustment **"% of Labor Total" is not offered**; methods = Flat Amount, % of Parts
  Total, % of Subtotal.
- **S11-R4a** — Toolbar ⋯ menu: **"Add Parts Sale Fee / Discount"** → Whole Parts Sale
  scope. (Matches WO toolbar's "Add Work Order Fee / Discount".)
- **S11-R4b** — Each part row's menu: **"Add Fee / Discount"** → Part Line scope
  (staged or requested).
- **S11-R5** — Statistics tab F&D section same as Story 4; a Part Sale's Statistics tab
  shows only this section and the Total (no labor/hours tables).
- **S11-R6a** — Per-part dialog subtitle: **"Applying to: Part — ({part number})
  {description}"** (no line number; part number omitted when absent).
- **S11-R6b** — Whole Parts Sale: **no "Applying to:" subtitle**.

**Part-requests table column:**
- **S11-R7** — A **"Fees & Discounts" column** shows only on a part sale and only when
  the flag is on.
- **S11-R8** — Core-charge rows: column empty.
- **S11-R9** — Part with no adjustments: shows a **"+ Add"** button, disabled when the
  sale can't be edited.
- **S11-R10a** — Part with ≥1 adjustment: shows the **first adjustment's name and rate**.
- **S11-R10b** — With >1 adjustment: also a **"+N" badge** (N = extras after the first).
- **S11-R10c** — Clicking the cell opens the **viewer dialog**.

**Part adjustments viewer:**
- **S11-R11** — Viewer titled **"Fees & Discounts"**; subtitle = part's label
  (**"{description} · #{part number}"**, or just description when no part number).
- **S11-R12** — Grid columns: **Name, Type, Calculation, Amount, Max Amount**, and a
  per-row remove control.
- **S11-R13** — Amount is the **signed resolved amount**; Max Amount shows "$X.XX" or
  **"—"** when not set.
- **S11-R14** — Per-row remove control shows only when the sale can be edited.
- **S11-R15** — A **"Net adjustment"** row shows the signed sum of the part's amounts.
- **S11-R16** — Viewer has a **Close button only** (no Save/edit).
- **S11-R17** — Removing the last adjustment **closes** the viewer.

**Parts Sale Fees & Discounts card:**
- **S11-R18** — Part Sale sidebar shows a **"Parts Sale Fees & Discounts"** card,
  mirroring the WO card (S3-R3–R11). Lists only Whole Parts Sale (invoice_total)
  adjustments, incl. any Processing Fee.
- **S11-R19** — Card hidden when no whole-parts-sale adjustments.
- **S11-R20** — Each entry: name, signed rate badge, resolved amount in grey, hover
  3-dot Edit/Delete menu (Edit hidden for a Processing Fee — remove-only, S8-R17). A
  context note reads **"Applies to the whole parts sale, after all part-line fees &
  discounts."**

**Negative (Story 11):**
- **S11-N1** — With no adjustments, neither the Statistics section nor the Financial
  Info row shows (same as Stories 3 and 4).

> "Whole Parts Sale" is the Whole-Work-Order scope in a parts-sale context (§4), not a
> separate scope.

---

## 6. Customer Page behavior (defaults + customer documents)

### 6.1 Customer default adjustments (Story 9)
- **S9-R1** — When a customer is created, **every auto-apply template at the location
  is added as a default** for that customer.
- **S9-R2** — On a new WO for a customer with defaults, **each default is added as an
  adjustment**.
- **S9-R3** — The added adjustment is an **independent copy** — copies name, type,
  method, amount, taxable, and Max Amount, using values as of WO creation.
- **S9-R4** — After adding, it's separate from the customer's defaults (editing/
  removing on the WO doesn't change the defaults).
- **S9-R5** — After adding, it's separate from the template (later template change
  doesn't change already-added adjustments).
- **S9-R6** — A percentage default keeps the **percent**, not a fixed dollar amount.
- **S9-R7** — Each new WO re-resolves a percentage default against its own base, so
  the dollar amount can differ per WO.
- **S9-R8** — Removing a customer default doesn't change adjustments already on WOs.
- **S9-R9** — Deleting a template that is a customer default removes the default link;
  adjustments already on WOs stay.
- **S9-R10** — Deleting a customer removes that customer's default links.
- **Known gap** — a template that is both auto-apply at the location (S7-R5) and a
  customer default (S9-R2) should yield **one** adjustment on the WO; a current bug
  can add it **twice** depending on internal order (tracked separately).

**Customer page UI (Story 9):**
- **S9-R11** — Customer page has a **"Fees & Discounts" tab** with a count **"(N)"**
  (defaults on the customer); shows "0" when none.
- **S9-R12** — Tab panel holds a **"Default Fees & Discounts"** card.
- **S9-R13** — Card header: title **"Default Fees & Discounts"** + an **"Add
  Fee/Discount"** button (shown only to a user with the customer change permission).
- **S9-R14** — Caption: **"These fees & discounts auto-apply to every new work order
  for this customer. They can still be edited or removed on individual work orders
  without changing the defaults here."**
- **S9-R15** — Table columns L→R: **Name, Type, Calculation Type, Amount, Max Amount,
  Taxable**, and an actions column.
- **S9-R16** — Row actions: a 3-dot menu with one item **"Remove"** (no inline edit).
- **S9-R17** — Empty state: **"No fees or discounts yet. Use 'Add Fee/Discount' to add
  one."**
- **Exact text** — customer card uses **"Add Fee/Discount"** (no spaces around slash);
  WO/template dialogs use **"Add Fee / Discount"** (with spaces). Keep both exactly.

**Add picker (Story 9):**
- **S9-R18** — "Add Fee/Discount" opens a picker titled **"Add Fee/Discount"** with a
  confirm button **"Add."**
- **S9-R19** — Caption **"Select a fee or discount template to add to this customer."**
  Lists templates **not yet linked** to this customer.
- **S9-R20** — Each row: a checkbox + Name, Type, Calculation Type, Amount. Multi-select allowed.
- **S9-R21** — "Add" links every selected template at once.
- **S9-R22** — With none to add: **"No templates available to add."**
- Processing Fee templates **do** appear in this picker (a Processing Fee can be a
  customer default — S8-R15); in the current build they show **"Fee"** in the Type column.

**Feedback (Story 9):**
- **S9-R23a** — Adding one default: toast **"Fee / discount added."**
- **S9-R23b** — Adding >1: toast **"[N] fees / discounts added."**
- **S9-R24** — Removing a default needs **no confirm**; toast **"Fee / discount removed."**
- **S9-N1** — Add/remove/load failure → the system's standard error notification (no
  custom per-action strings).

### 6.2 Customer invoice & estimate (Story 5)
- **S5-R1** — **One layout serves both invoices and estimates**; adjustments show on
  both whenever present.

**Per-line adjustments (Labor Line, Part Line):**
- **S5-R2** — Shows **indented under** the labor line/part it points to, with a "↳"
  arrow in front of the name.
- **S5-R3** — For a percentage method, a bracketed phrase follows the name: **"(% of
  labor)"** (Labor Line) or **"(% of parts)"** (Part Line). Flat Amount → no phrase.
  (The bracket text is a phrase, not a number — e.g. "Shop Supply Fee (% of labor)",
  not "(10%)".)
- **S5-R4** — A **fee** amount shows as **"$X.XX"**. A **discount** shows in round
  brackets (accounting style) **"($X.XX)"** — two decimals, **no minus sign**.

**Whole-work-order adjustments:**
- **S5-R5** — A bottom **"Adjustments"** block sits after Labor/Parts/Shop Supplies and
  before Subtotal (then Tax, then Total). Lists whole-WO adjustments **one by one, in
  creation order**, each with name and (percentage) phrase.
- **S5-R6** — Whole-WO percentage phrase is one of **"% of labor"**, **"% of parts"**,
  **"% of subtotal"**, or **"% of grand total"** (Processing Fee, S8-R22). Flat Amount
  → no phrase. ("% of labor + parts" shows only for older removed-method adjustments.)
- **S5-R7** — In the same block, **line-level adjustments are grouped by name and
  type** — one row per name-and-type group. With >1 in a group, the row shows a count,
  e.g. **"Shop Supply Fee (×3)"**, plus the total resolved amount.
- **S5-R8** — A line-level adjustment **also still shows inline** under its target
  (S5-R2), **as well as** in its grouped row in the bottom block.
- **S5-R9** — Amounts in this block use the same format as S5-R4.
- Grouping is **only on the customer document**; the WO line table lists each one by
  one (Story 3).

### 6.3 Shop Supplies on estimates/invoices/financial tab (Story 14)
- **S14-R1** — If total shop supplies on an estimate/invoice **= $0.00**, the Shop
  Supplies header/contents **do not display** on the estimate, invoice, or financial
  tab. (Still visible/modifiable in the **left-side financial card** on the WO — just
  hidden from the end-customer when $0.00.)
- **S14-R2** — If shop supplies become **> $0.00** during the WO, the heading/contents
  become visible again for the end-customer.

---

## 7. Calculation rules (§5 — the enforced contract) + QuickBooks (Story 6)

These rules are **enforced by the system** and are the final word on calculation.

**§5-R1 (minimum values)** — values must be **> 0**. Flat Amount smallest =
**$0.01**; Percentage smallest = **0.01%**.

**§5-R2 (percentage limits)** — Percentage **discounts ≤ 100%**; percentage **fees
have no upper limit**; Flat Amount adjustments **never have a maximum**.

**§5-R3 (percentage resolve)** — `resolved amount = base × percentage`.
- Round to nearest cent (**≥ half a cent rounds up**, else down).
- If **base < 0, use $0**.
- Examples: **10% fee on $150.00 → $15.00**; **5% discount on $33.33 → $1.6665 →
  $1.67**; **15% fee on $0.00 → $0.00**.

**§5-R4 (calculation bases):**

| Scope | Method | Base |
|---|---|---|
| Labor Line | (any) | Target labor line price (gross) |
| Part Line | (any) | Target part **quantity × sell price** (gross) |
| Whole Work Order | % of Labor Total | Net labor total |
| Whole Work Order | % of Parts Total | Net parts total |
| Whole Work Order | % of Subtotal | Net labor total + net parts total + shop supplies total |
| Processing Fee | Flat Amount | The set amount (no base) |
| Processing Fee | % of Grand Total | Net subtotal (net labor + net parts + shop supplies) **plus the tax on that net subtotal** |

- Line-level scopes resolve against the target's **gross** value; Whole-WO scopes
  resolve against **net** totals (after line-level).
- **Processing Fee** resolves against the **Grand Total before the fee**; **excluded
  from its own base**; with more than one Processing Fee, each uses the same base that
  **excludes every Processing Fee's amount and tax**.
- **No base goes below $0** (use $0).
- **Grand Total** (Processing Fee only) = net subtotal + tax on that net subtotal;
  **excludes** any whole-WO fee/discount and the Processing Fee itself. The tax in the
  base is tax on **labor, parts, and shop supplies only** (excludes any tax change
  from a taxable whole-WO fee/discount and the Processing Fee's own tax) — so a
  taxable Processing Fee **never grows its own base**.
- Shop supplies **cannot have an adjustment** (no shop-supplies scope), so shop
  supplies total is the same read as gross or net.
- Old method **"% of Labor + Parts"** still resolves for adjustments saved before it
  was removed; **not selectable, not in any dropdown**.

**§5-R5 (resolve order) — three steps:**
1. **Step 1 — Line-level** (Labor Line + Part Line): resolve first, each on its own
   against target gross; do **not stack**. Net labor/parts totals then computed.
2. **Step 2 — Whole Work Order:** resolve second, each on its own against the same net
   totals from Step 1; do **not stack**.
3. **Step 3 — Processing Fee:** resolves last; base = Grand Total (pre-fee tax);
   excluded from its own base; changes no other adjustment's base. If taxable, its own
   amount is added to the taxable amount so final invoice tax includes it, but this
   added tax **never changes the fee's base** (no feedback loop).

**Worked example (Steps 1–2):** Gross Labor $200, Gross Parts $100, 10% Labor Line
discount → Step 1: 10% × $200 = **−$20**, Net Labor **$180**. Step 2: 5% fee (% of
Labor Total) = 5% × $180 = **+$9**; 10% discount (% of Parts Total) = 10% × $100 =
**−$10**. The two Step-2 adjustments don't change each other's base.

**Worked example (Processing Fee):** Net subtotal (after line discounts) $300;
pre-fee tax $24; Grand Total base = **$324**. 3% Processing Fee = 3% × $324 =
**+$9.72**. If taxable, $9.72 is added to the taxable amount and final tax grows by
the tax on $9.72; the $324 base does not change.

**§5-R6 (Max Amount)** — a **percentage** adjustment may set an optional **Max Amount**.
- Apply: take resolved amount, drop the sign, compare to Max Amount; if bigger, lower
  it to Max Amount; put the sign back.
- Max Amount must be **≥ $0**; **Max Amount = $0 forces resolve to $0**.
- **Flat Amount adjustments do not use Max Amount.**
- **Processing Fee never uses Max Amount** (S8-R10).
- Examples: **20% fee on $100 → $20 → Max $15 → +$15**; **50% fee on $100 → $50 → Max
  $0 → $0**.
- **Min Amount** exists in the data model only (no UI control, normally empty); both
  dialogs always send it **empty (null)**. Kept for old data. If old data has one: on
  a WO adjustment **Max ≥ Min**; on a template **Max > Min**. Not triggerable from the
  product (S2-R25, S7-R14). A **$0 Max Amount** can only come from old data.

**§5-R7 (sign)** — **Fees → plus (+)**; **Discounts → minus (−)**.

**§5-R8 (zero-value resolve)** — an adjustment against a **$0 base resolves to
$0.00**. A $0.00 adjustment is **skipped when sent to QuickBooks** (S6-R1) but **shows
as $0.00** on every other screen.

**§5-R9 (display order)** — WO screens (sidebar card, Financial Info card, line
table, Statistics tab) show adjustments in **creation order (oldest first)**. Customer
documents differ (whole-WO in creation order; line-level grouped — S5-R5/R7).

**§5-R10 (allowed methods by scope):**

| Scope | Allowed methods |
|---|---|
| Labor Line | Flat Amount, % of Labor Total |
| Part Line | Flat Amount, % of Parts Total |
| Whole Work Order | Flat Amount, % of Labor Total, % of Parts Total, % of Subtotal |
| Processing Fee | Flat Amount, % of Grand Total |

**§5-R11 (tax)** — a **taxable fee adds** to the taxable amount; a **taxable discount
lowers** it; a **non-taxable adjustment does not change tax**. (Other tax rules —
rounding, multiple tax areas, tax-free customers — are in a separate Taxability spec.)

**§5-R12 (line-level follows its target)** — resolves to **$0 when its target is not
billable** (declined line/part; part returned with no quantity left). Applies to Flat
and percentage. Shows wherever its target shows (incl. Needs Approval estimate);
becomes non-zero once billable/authorized.

**§5-R13 (requested part)** — see §5 Parts behavior above.

**§5-R14 (flat Part Line is per item)** — `resolved = set amount × quantity` for Part
Line Flat Amount. Whole-WO and Labor Line Flat Amount have no quantity part.

### 7.1 QuickBooks sync (Story 6)
Prereqs: WO invoiced; location has an active QuickBooks connection.

**What syncs:**
- **S6-R1** — Each fee/discount on the invoiced WO is sent to QuickBooks as **its own
  invoice line item** — a fee **positive**, a discount **negative**. **$0.00 resolved
  adjustments are skipped** (§5-R8).
- **S6-R2** — Line tax follows the taxable setting: taxable → the invoice's active
  tax; non-taxable → zero tax (§5-R11).
- **S6-R3** — The QuickBooks line **description = the adjustment's name** as shown on
  the customer invoice. The **Product/Service item is the mapped item** (S6-R5), not
  the adjustment name.

**Mapping:**
- **S6-R4** — Every amount-bearing QuickBooks line must reference a Product/Service
  item (determines the income account); every synced fee/discount must resolve to one.
- **S6-R5** — The location maps **one Fee item and one Discount item** in **Settings →
  QuickBooks**. Every fee posts to the Fee item; every discount to the Discount item.

**Mapping guard (add is blocked until items mapped):**
- **S6-R6** — When QuickBooks is connected and the **Fee item is unmapped, adding a
  fee is blocked**; when the **Discount item is unmapped, adding a discount is
  blocked**. (Block is **per kind** — a missing Fee item blocks only fees, etc.)
- **S6-R6a** — Block applies **everywhere a fee/discount is added**: the WO dialog,
  labor-line dialog, part dialog, part-sale dialogs (whole sale + single part), and
  applying a template to a WO.
- **S6-R6b** — An **auto-apply default cannot be saved while the matching item is
  unmapped** (covers a location auto-apply template and a customer default). The block
  is at setup, so an auto-apply default never adds a fee/discount on the server
  without a mapped item.
- **S6-R6c** — **Not blocked:** creating/editing a **non-auto-apply** template in
  Settings is always allowed; when QuickBooks is **not connected**, no block.
- **S6-R6d** — A blocked add shows **"Map a Fee item in Settings → QuickBooks before
  adding a fee."** / **"Map a Discount item in Settings → QuickBooks before adding a
  discount."** "Settings → QuickBooks" is a **link** to the QuickBooks settings page.

**Unmapping / connecting later (recoverable, not hard-blocked):**
- **S6-R7** — Mappings aren't locked. If a shop unmaps an in-use item, or connects
  QuickBooks after fees/discounts already exist, each affected invoice goes to
  **Unexported Items** at sync time and exports once the item is mapped again and the
  invoice re-exported. **No data lost.**
- **S6-R7a** — The QuickBooks settings page **prompts to map the Fee and Discount
  items**, the same way it prompts for Credit and Deposit items.

**QuickBooks Class:**
- **S6-R8** — If the location has a Class set, that **one class applies to every synced
  line** (fee/discount lines included); not split/allocated. No class set → synced
  lines carry no class. (Per-class allocation is out of scope.)
- **S6-R9** — Before sending, the class is validated; if **deleted/deactivated the
  entire invoice sync aborts** — the class is not substituted.

**Negative totals (over-discounting):**
- **S6-R10** — When stacked fees/discounts drive the **net subtotal** (net labor + net
  parts + shop supplies, **before tax**) below $0.00, the net subtotal is **floored at
  $0.00** — never below zero.
- **S6-R10a** — The floor is on the **pre-tax net subtotal only**, never the
  tax-inclusive total. Tax is calculated on top of the floored subtotal.
- **S6-R10b** — A non-taxable discount doesn't change tax (§5-R11). When a non-taxable
  discount floors the subtotal at $0.00, the **tax on the original taxable base is
  still owed and charged**; the WO total then equals that tax, not $0.00.
- **S6-R10c** — To reach a **$0.00 total with no tax**, the discount must be **taxable**
  and large enough to lower the taxable amount to $0.00.
- **S6-R10d** — QuickBooks rejects a negative total. When the floor applies, discount
  lines sent to QuickBooks are **capped** so line items sum to the floored net
  subtotal and never fall below it. With multiple discount lines, the cap is split
  **proportionally to each line's size**, allocated in **whole cents via the
  largest-remainder method** (every line stays whole-cent, capped discounts sum
  exactly, no fractional cent or negative total). The amount removed by the cap is the
  carried customer credit (S6-R11).
  - **Worked example:** $100.00 taxable parts + $10.00 tax; a **non-taxable** $150.00
    discount → net subtotal −$50.00 → floors to $0.00; tax stays $10.00 (discount
    non-taxable); **customer pays $10.00**; the $50.00 excess is carried as a customer
    credit (S6-R11). If the same $150.00 discount were **taxable**, it would lower the
    taxable amount to $0.00, tax = $0.00, **customer pays $0.00**.
- **S6-R11** — The floored-off amount (discounts − net subtotal) is recorded as a
  **freestanding customer credit** on the customer's account (a credit **not tied to a
  WO**, in the Deposits & Credits system). It's money the shop owes the customer (not
  cash received); it carries forward and is drawn down against the customer's next
  invoice via the standard credit-application flow.
- **S6-R12** — When discounts exceed the net subtotal, the user is **warned before the
  WO can be saved** — that the net subtotal will floor at $0.00, tax on the taxable
  base is still owed, and the excess (shown as a dollar amount) will be carried as a
  customer credit — and **must confirm**. The carry is never silent.
- **S6-R13** — The carried credit posts to QuickBooks as a **goodwill credit memo** on
  the location's **Customer Credit item, marked tax-exempt** (same as other goodwill
  credits). It is **not** a QuickBooks payment (no cash received). Posting as a credit
  memo keeps ShopView and QuickBooks in sync when the credit is later applied. No
  manual reconciling step.

---

## 8. Viewing & managing on the work order (Story 3), Statistics tab (Story 4), History log (Story 10)

### 8.1 Story 3 — WO sidebar card, inline line rows, Financial Info card
Prereqs: flag on; WO **pricing-view permission** to see money; WO **change
permission** to edit/remove.

**General:**
- **S3-R1a** — Create/edit/remove only while the WO is **open**.
- **S3-R1b** — The system **rejects** any create/edit/remove on an **Invoiced or
  Paid** WO.
- **S3-R2** — Deleting a labor line or part **removes any adjustment pointing to it**.

**"WO Fees & Discounts" sidebar card:**
- **S3-R3** — Sidebar shows a **"WO Fees & Discounts"** card listing **only Whole Work
  Order adjustments**.
- **S3-R4** — Card is **hidden when there are no whole-WO adjustments**.
- **S3-R5** — Each entry: adjustment name + a **signed rate badge**.
- **S3-R6** — Percentage rate badge: signed percent with extra zeros removed (e.g.
  **"−8%"**, **"+3%"**).
- **S3-R7** — Flat Amount rate badge: signed set dollar amount (e.g. **"$15.00"** fee,
  **"−$15.00"** discount).
- **S3-R8** — Below name/badge: the **resolved dollar amount in plain grey, signed**.
- **S3-R9** — Each entry has a hover **3-dot menu** with **"Edit"** and **"Delete"**,
  shown only when the WO is open and the user has the change permission. (Processing
  Fee entry: **"Delete" only, no "Edit"** — S8-R17, S8-N5.)
- **S3-R10** — Card has **no "Add" control** (adding is from Story 1 starting places).
- **S3-R11a** — "Delete" opens a confirm dialog: title **"Remove Fee / Discount"**,
  message **'Remove "{name}" from this work order?'**, confirm button **"Remove"** (red).
- **S3-R11b** — On confirm, the adjustment is removed and the matching toast shows (§7).

**Work-order (lines) table:**
- **S3-R12** — A labor-line adjustment shows inside that labor line's row: an indented
  **"↳"** arrow, the name, and a signed rate badge.
- **S3-R13** — A part-line adjustment shows inside that part's row, same arrow/name/badge.
- **S3-R14** — For each line-level adjustment, the resolved dollar amount shows in the
  cost column in **plain grey, signed**.
- **S3-R15** — With ≥2 adjustments on a line/part, **only the first row shows** by default.
- **S3-R16** — A **"Show N more"** toggle reveals the rest; when open it reads **"Show
  less."**
- **S3-R17** — Each line-level adjustment row has a hover 3-dot **Edit/Delete** menu
  (only when WO open + change permission).
- **S3-R18** — The per-line **Total column shows the line's gross total plus that
  line's own adjustment amounts** (so the shown total matches the adjustment rows).
- **S3-R19** — The per-line Total is **display only**; it changes no stored value.

**Financial Info card:**
- **S3-R20** — Shows a **"Fees & Discounts (N)"** row; N = count of **all**
  adjustments of any scope.
- **S3-R21** — Collapsed by default.
- **S3-R22** — Collapsed header shows the **net total** of all adjustments in plain grey.
- **S3-R23** — Opening lists each adjustment in **creation order** (§5-R9): name +
  resolved amount in plain grey.
- **S3-R24** — Read-only: **no add/edit/remove control**.

**Negative (Story 3):**
- **S3-N1** — No whole-WO adjustments → sidebar card not shown.
- **S3-N2** — No adjustments of any scope → the Financial Info "Fees & Discounts (N)"
  row not shown.
- **S3-N3** — Invoiced/Paid WO → per-entry and per-row 3-dot menus not shown.
- **S3-N4** — Without WO pricing-view permission → the Financial Info money section is
  hidden.

### 8.2 Story 4 — Statistics tab
Prereqs: flag on; WO has ≥1 adjustment; WO pricing-view permission.
- **S4-R1** — A **"Fees & Discounts (N)"** section; N = count of all adjustments, any scope.
- **S4-R2** — Two value columns: a **"%"** column and an **"Amount"** column.
- **S4-R3** — Each row: name, signed rate in "%", signed resolved amount in "Amount".
- **S4-R4a** — In "%", a **fee shows "+"** in front.
- **S4-R4b** — In "%", a **discount shows "−"** (the true minus U+2212, not a hyphen).
- **S4-R4c** — In "%", a **Flat Amount shows nothing**.
- **S4-R4d** — A Processing Fee is treated as a fee: "% of Grand Total" shows "+";
  Flat Amount Processing Fee shows nothing.
- **S4-R5** — In "Amount", fee "+", discount "−", zero amount no sign.
- **S4-R6** — A **"Total"** row shows the signed sum of every resolved amount in "Amount".
- **S4-N1** — With no adjustments, the whole section is hidden.

### 8.3 Story 10 — Work-order history log
Prereq: user has the work-order history permission (View History Logs — S13-R10).
- **S10-R1** — Fee/discount entries **stay visible in the history log even when the
  F&D UI is hidden** by the feature flag or by permissions.
- **S10-R2** — Adding, editing, or removing a fee/discount records **one** entry.
- **S10-R3** — An adjustment entry leaves the **saved-state icon column empty**.
- **S10-R4a** — Event (add), bold: **"Fee added"** / **"Discount added"**.
- **S10-R4b** — Event (edit), bold: **"Fee updated"** / **"Discount updated"**.
- **S10-R4c** — Event (remove), bold: **"Fee removed"** / **"Discount removed"**.
- **S10-R5** — **Line column = "−"** for every adjustment entry, any scope (no line number).
- **S10-R6** — Details block lines:
  - **S10-R6a — Name:** the adjustment name.
  - **S10-R6b — Type:** "Fee" or "Discount".
  - **S10-R6c — Amount:** the **set rate, not the resolved total** — **"$X.XX"** (Flat)
    or **"X.XX%"** (percentage). No "+"/"−" sign.
  - **S10-R6d — Applied to:** **"Full invoice"** (Whole WO), **"Labor line"**, or
    **"Part"**. (History log uses the exact label "Full invoice"; other screens say
    "Whole Work Order".)
- A **Processing Fee** is logged as a fee: Event "Fee added"/"Fee removed", Type "Fee"
  (S8-R25), Applied to "Full invoice" (S8-R26). No "Fee updated" entry (can't be
  edited on a WO). *Current build shows raw "processing_fee" on "Applied to:" — a
  small fix to show "Full invoice."*

---

## 9. Adjustment templates (administration) — Story 7 & Processing Fee — Story 8

### 9.1 Story 7 — template library
Prereqs: flag on; user has administration access (Settings → Finance — S13-R8).
- **S7-R1** — Each shop location has its **own template library**, for that location only.
- **S7-R2** — A template has only a **whole-work-order calculation method**: Flat
  Amount, % of Labor Total, % of Parts Total, or % of Subtotal. **No Labor Line or
  Part Line scopes on templates.**
- **S7-R3** — A percentage-**discount** template ≤ 100%; a percentage-**fee** template
  has no upper limit (§5-R2).
- **S7-R4** — Deleting a template **does not change adjustments already on WOs**; it
  removes the template and any customer-default links.
- **S7-R5** — A template marked **auto-apply** is added to **every new WO created at
  that template's location**.
- **S7-R6a** — The added adjustment is always **Whole Work Order scope**.
- **S7-R6b** — It copies the template's **name, type, method, amount, taxable, and Max
  Amount**, using values as of WO creation. (A Processing Fee has no Max Amount to copy.)

**Template list page:**
- **S7-R7a** — Located at **Administration → Service → Fees & Discounts**.
- **S7-R7b** — Shown to any user with at least one location. *(S13-R8 tightens this to
  Settings → Finance — a current-build difference to close.)*
- **S7-R7c** — Shown right below **Canned Lines**.
- **S7-R8** — Columns L→R: **Name, Type, Calculation Type, Amount, Max Amount, Taxable,
  "Auto-Apply To Work Orders"**, and a delete action.
- **S7-R9** — Clicking a row opens the **edit dialog**.
- **S7-R10** — A **"New fee / discount"** button opens the create dialog.
- **S7-R11** — Empty state: **"No fees or discounts yet — click Add to create your first."**

**Create / edit dialog fields:**
- **S7-R12a** — **Type** — dropdown: **"Fee"**, **"Discount"**, or **"Processing Fee"**.
- **S7-R12b** — **Calculation type** — dropdown.
- **S7-R12c** — **Name** — free text, up to 100 chars.
- **S7-R12d** — **Amount** (Flat) or **Percent** (percentage).
- **S7-R12e** — **Max Amount (Optional)** — percentage methods only; **never for a
  Processing Fee** (S8-R10).
- **S7-R12f** — **Taxable** — Yes/No dropdown, default "Yes".
- **S7-R12g** — An **"Auto-apply to all new work orders at this location"** checkbox.
- **S7-R13** — **No scope field** — every template is whole-WO; the method is the only choice.
- **S7-R14** — Empty Max Amount = no maximum; entered 0 treated as empty (§5-R6).
- **S7-R15** — For a Fee/Discount the method options are Flat Amount, % of Labor Total,
  % of Parts Total, % of Subtotal. A Processing Fee uses different options (S8-R5).
- **S7-R16** — Title **"New Fee / Discount"** (create) / **"Edit Fee / Discount"** (edit).
- **S7-R17** — Confirm button reads **"Add Fee / Discount"** when creating (for any
  type) and **"Save"** when editing. *(Unlike the WO dialog S2-R27, this button label
  is fixed.)*
- **S7-R18a** — Create toast by type: **"Fee added"** / **"Discount added"** /
  **"Processing fee added"**.
- **S7-R18b** — Edit toast by type: **"Fee updated"** / **"Discount updated"** /
  **"Processing fee updated"**.
- **S7-R19** — Save failure toast: **"There was an error saving the fee / discount.
  Please try again."**

**Delete:**
- **S7-R20** — Confirm dialog: message **"Are you sure you want to delete this fee /
  discount?"**, confirm **"Delete"** (red), and Cancel.
- **S7-R21** — When the template is a default for ≥1 customer, the dialog adds: **"This
  template is set as a default for [N] customer(s). Their defaults will be removed
  too."**
- **S7-N1** — Deleting a template leaves WO adjustments made from it unchanged.

### 9.2 Story 8 — Processing Fee
See §2 (Fee types) for the full Processing Fee rule set (S8-R1–R26 and negative cases
S8-N1–N6). Key negatives:
- **S8-N1** — WO add dialog does not list Processing Fee as a type.
- **S8-N2** — WO template picker does not list Processing Fee templates.
- **S8-N3** — Max Amount field hidden for every Processing Fee.
- **S8-N4** — Saving a Processing Fee with a Max Amount, or any method other than Flat
  Amount / % of Grand Total, is **rejected**.
- **S8-N5** — WO offers **no "Edit"** for a Processing Fee — **"Delete" only**.
- **S8-N6** — The system rejects a Processing Fee carrying a minimum amount (guard for
  data sent from outside the product; no UI control exists).

---

## 10. Permissions (Story 13 — Custom Roles & Permissions, Jira SV-7388)

**Fees & Discounts adds no permission of its own** (S13-R1). Every action maps to an
existing Custom Roles permission. Two independent gates: the **feature flag** (per
org, decides the feature exists) **and** the **permission** (decides what a user may
do). A user needs **both**.

### 10.1 Action → permission mapping

| Action | Permission required |
|---|---|
| **See** fee/discount **dollar amounts** (sidebar card, WO line table, Statistics tab, Financial Info card, Part Sales F&D column & viewer, customer documents) | **See Financial Data** (S13-R2) — the "pricing-view permission" in Stories 3/4/11 |
| **Add / edit / remove a Whole Work Order adjustment** | **Work Orders: Create and Edit** (S13-R3) |
| **Add / edit / remove a Labor Line or Part Line adjustment** | **Work Order Lines: Create and Edit** (S13-R4) |
| **Add / edit / remove a Part Sale part adjustment** | **Part Sales: Create and Edit** (S13-R5) |
| **Any add/edit/remove of an adjustment** (money-visibility prerequisite) | **also requires See Financial Data on** (S13-R6) — controls sit on screens hidden when SFD is off |
| **Remove an adjustment** | part of **"Create and Edit"**, **NOT** the separate "Delete" (S13-R7). "Delete" is for whole records (WO, labor line, part) |
| **Create / edit / delete an adjustment template** (admin Fees & Discounts page, Story 7) | **Settings → Finance** (S13-R8) — same permission as tax settings and the QuickBooks connection; this is Story 7's "administration access" |
| **View / change a customer's default fees & discounts** (customer "Fees & Discounts" tab, Story 9) | **Customer Management: Create and Edit** **AND** **Manage Accounts Payable and Receivable** (S13-R9); off → tab and controls hidden. This is Story 9's "customer change permission" |
| **See fee/discount entries in the WO history log** | **View History Logs** (S13-R10). Entries stay visible even when the F&D UI is hidden by flag or SFD; log shows the set rate not a resolved total (S10-R6c) so SFD does not gate it |

### 10.2 Earlier-story phrase → exact permission (S13-R11)

| Phrase used in earlier stories | Exact permission |
|---|---|
| "Work Order change permission" (Stories 1, 3) | **Work Orders: Create and Edit** for whole-WO actions (S13-R3); **Work Order Lines: Create and Edit** for labor-line/part-line actions (S13-R4) |
| "Work Order change permission" on a Part Sale (Story 11) | **Part Sales: Create and Edit** (S13-R5) |
| "Work Order pricing-view permission" (Stories 3, 4, 11) | **See Financial Data** (S13-R2) |
| "administration access" (Story 7) | **Settings → Finance** (S13-R8) |
| "customer change permission" (Story 9) | **Customer Management: Create and Edit** + **Manage Accounts Payable and Receivable** (S13-R9) |
| "work-order history permission" (Story 10) | **View History Logs** (S13-R10) |

### 10.3 Negative cases (Story 13)
- **S13-N1** — Without See Financial Data: all fee/discount dollar amounts hidden, and
  no add/edit/remove control is reachable.
- **S13-N2** — Without the matching change permission (S13-R3–R5): add/edit/remove
  controls not shown, and the system rejects the action.
- **S13-N3** — Without Manage Accounts Payable and Receivable: the customer "Fees &
  Discounts" tab and its controls are hidden.

### 10.4 Current-build differences to close when this model ships
- (1) The admin Fees & Discounts page is shown today to any user with a location
  (S7-R7b); S13-R8 tightens it to **Settings → Finance**.
- (2) The current build may use one WO-edit check where S13-R3/R4 **split** whole-WO
  actions from line-level actions.
- Story 13 is the **target** model (Custom Roles SV-7388, not yet released). Until it
  ships, the feature uses the matching existing role checks; behavior is the same and
  only the setting names change.

---

## 11. Visual rules (Story 12)

QA checks each screen against the design references (Loom POC video, companion video,
design links) plus:
- **S12-R1** — Sidebar card, line table, Statistics tab, and Financial Info card show
  resolved amounts in **plain grey**.
- **S12-R2** — **Green and red are used only inside the Add/Edit dialog's live
  preview** (S2-R33).
- **S12-R3** — A line-level adjustment is **indented under its target with a "↳"
  arrow** (S3-R12/R13, S5-R2).
- **S12-R4** — A percentage rate badge = signed percent, extra zeros removed (e.g.
  "−8%", "+3%"); a Flat Amount rate badge = signed dollar amount.
- **S12-R5** — On the sidebar card and each line-level row, the Edit/Delete control is
  a **3-dot menu on the right, shown only on hover**.
- **S12-R6** — With ≥2 adjustments on a line/part, only the first shows, with a "Show N
  more" / "Show less" toggle (S3-R15/R16).
- **S12-R7** — On customer documents, a fee amount = "$X.XX"; a discount = "($X.XX)" —
  two decimals, no minus (S5-R4).
- **S12-R8** — The admin template list and the customer "Default Fees & Discounts" card
  show data in a table with **bold column headers and plain-text cells**.
- Where another story sets a behavior or exact label, **that story is the source of
  truth**; Story 12 covers only how things look.

---

## 12. User Feedback Summary (§7 — toast table)

| Trigger | Message | Behavior |
|---|---|---|
| Fee/discount added to WO | "Fee added" / "Discount added" (matches type) | Success toast, fades on its own |
| Fee/discount updated on WO | "Fee updated" / "Discount updated" (matches type) | Success toast, fades on its own |
| Fee/discount removed from WO | "Fee removed" / "Discount removed" (matches type) | Success toast, fades on its own |
| Fee/discount save failure on WO | (returned error message — no custom string) | Error toast; dialog stays open (S2-R30) |
| Template created | "Fee added" / "Discount added" / "Processing fee added" (matches type) | Success toast, fades on its own |
| Template updated | "Fee updated" / "Discount updated" / "Processing fee updated" (matches type) | Success toast, fades on its own |
| Template save failure | "There was an error saving the fee / discount. Please try again." | Error toast |
| Customer default added (one) | "Fee / discount added" | Success toast, fades on its own |
| Customer default added (>1) | "[N] fees / discounts added" | Success toast, fades on its own |
| Customer default removed | "Fee / discount removed" | Success toast, fades on its own |
| Customer default add/remove/load failure | (system standard error notification — no custom string) | Error toast |

> WO/template toasts name the type; customer-default toasts are generic and don't
> change by type.

---

## 13. Validation, edge cases & state rules (cross-reference)

**Value validation (dialog):**
- Flat Amount < $0.01 → invalid (§5-R1). Percentage < 0.01% → invalid (§5-R1).
- Percentage **discount > 100%** → invalid (§5-R2); percentage **fee** has no cap.
- Flat Amount fields never accept a Max Amount (§5-R2/R6).
- Entering **0** in Max Amount = **empty (no maximum)** in both dialogs (§5-R6).
- On edit, Type and Calculation type are locked (S2-R5); Scope/target locked (S2-R8).
- Empty Name (S2-N1) / empty Amount or Percent (S2-N2) block save with inline errors.

**Calculation edge cases:**
- $0 base → $0.00 resolve (§5-R8); QuickBooks skips $0.00 lines, screens show them.
- Base below $0 → treated as $0 (§5-R3/R4).
- Rounding at exactly half a cent rounds **up** (§5-R3).
- Max Amount = $0 (old data only) forces $0.00 (§5-R6).
- Part Line Flat Amount multiplies by quantity; quantity change re-resolves (§5-R14).
- Multiple Processing Fees — each excludes all Processing Fees' amounts+tax from the
  shared base (§5-R4).
- Taxable Processing Fee adds its own amount to the taxable amount but never to its own
  base (no feedback loop) (§5-R5).
- Over-discounting → net subtotal floors at $0.00 (S6-R10), discount lines capped with
  largest-remainder penny allocation (S6-R10d), excess carried as a customer credit
  (S6-R11) after a mandatory warning/confirm (S6-R12), posted to QuickBooks as a
  tax-exempt goodwill credit memo (S6-R13).

**Billability / target state:**
- Declined labor line / declined part / returned part with no qty left → resolves to
  $0 but stays visible; flips to non-zero when target becomes billable (§5-R12).
- Requested part adjustment survives requested→received; received part can't be
  re-pointed to a request (§5-R13).

**Lifecycle / state gating:**
- WO Invoiced or Paid → no add/edit/remove; controls hidden; action rejected (S1-N1,
  S3-R1b, S3-N3).
- User in **history mode** → can't add (S1 prereq).
- Feature flag off → all controls hidden **except** the WO history log (Story 10).
- Deleting a line/part removes its adjustments (S3-R2); deleting a template removes the
  template + customer-default links but leaves existing WO adjustments (S7-R4, S7-N1).

**QuickBooks:** see §7.1 (S6-R1–R13) — per-line-item sync, per-kind mapping guard,
single class, negative-total floor + carried credit.

---

## 14. Open questions / ambiguities (flag to user — do not guess in test cases)

The full spec is now available (Stories 1–14). The remaining genuinely-unclear items:

1. **Design files not retrievable.** The three claude.ai design links (WO line,
   Customers page, Parts page) and pixel-level layout require a logged-in claude.ai
   session and are not accessible via the harness. All exact strings quoted above come
   from the spec text; anything the spec does not spell out (precise placement,
   spacing, iconography beyond the "↳" arrow, ⋯ menu look) must be confirmed against
   the designs / Loom POC video before writing pixel-exact steps.
2. **Whole-Work-Order Flat Amount base.** §5-R4 lists explicit bases only for the three
   percentage methods at Whole-WO scope; Whole-WO Flat Amount is "the set amount" by
   inference (§5-R14: Whole-WO Flat has no quantity part). Low risk; confirm the base
   table has no explicit Whole-WO Flat row on purpose.
3. **History mode definition.** "The user is not in history mode" is a prerequisite;
   the spec does not define what puts a user in history mode.
4. **Auto-apply + customer-default duplication.** Documented **known bug** (S9 note):
   a template both auto-apply at the location and a customer default can add **twice**;
   intended result is one adjustment. Tracked separately — test accordingly and treat
   a double-add as a known defect, not a spec requirement.
5. **Legal disclosure exact text (Processing Fee, S8-R12 note).** The spec says to
   render the taxable disclosure "exactly as written" but the disclosure's literal
   text is not reproduced in the exported document (only the instruction is). The exact
   wording must be obtained from the dialog / legal before asserting it in a case.
6. **Spec status is WIP** ("minor clerical updates as we go"), and per project
   CLAUDE.md several F&D-adjacent spec changes are **not yet implemented on staging** —
   cases written to this spec may FAIL against the current app. Documented current-
   build differences: S8 Processing Fee still shows an Edit control that fails
   (S8-R17), history "Applied to:" shows raw "processing_fee" (S8-R26), the admin page
   visibility is broader than S13-R8, and the WO-edit permission may not yet be split
   per S13-R3/R4. Verify implementation state before executing.
7. **Companion walkthrough video** is "to be filmed" — not yet a QA reference.

---

## 15. Extraction provenance
- **Source file:** `f41d1027-FeesDiscountsV1.doc` (Confluence-exported MHTML/Word .doc).
- **Method:** parsed the MHTML with Python `email` module, decoded the quoted-printable
  `text/html` part, and converted HTML→text preserving tables. Raw extracted text saved
  to `/tmp/fees-discounts/spec-full.txt`.
- **Completeness:** Stories 1–14 present, plus §1–§5 (business case, overview, key
  decisions, terminology, calculation contract), §6 requirements (the stories), §7 User
  Feedback Summary, §8 Change Log. **No story ids missing.**
