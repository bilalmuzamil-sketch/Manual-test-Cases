|  |  |
| --- | --- |
| **POC Video** | [https://www.loom.com/share/d7be96fd46064e4bba8b752f53579fbd](https://www.loom.com/share/d7be96fd46064e4bba8b752f53579fbd) |
| **Companion Video** | Real walkthrough — to be filmed. |
| **Design Links** | WO line  
<custom data-type="smartlink" data-id="id-0">https://claude.ai/design/p/561657da-adc4-45a2-88e5-cd8ae15c63eb?file=Work+Order+Line.html&via=share</custom>  ·    
Customers page   
<custom data-type="smartlink" data-id="id-1">https://claude.ai/design/p/561657da-adc4-45a2-88e5-cd8ae15c63eb?file=Customer+Page.html&via=share</custom>   
 · Parts page   
<custom data-type="smartlink" data-id="id-2">https://claude.ai/design/p/561657da-adc4-45a2-88e5-cd8ae15c63eb?file=Parts+Page.html&via=share</custom>  |
| **Epic** | <custom data-type="smartlink" data-id="id-3">https://shopview.atlassian.net/browse/SV-7387</custom>  |
| **Owner** | TBD |
| **Status** | WIP – minor clerical updates as we go |
| **Branch** | TBD |

# Fees & Discounts — Spec

---

## 1. Business Case

Shops often add extra charges and apply discounts to work orders — hazardous-waste disposal fees, fleet account discounts, manager price changes. Today there is no proper way to do this. Shops change line prices by hand or add fake labor lines. This creates bad data. It breaks QuickBooks sync. It gives no clear view of how much a shop discounts or charges extra. This feature adds a built-in fees-and-discounts feature. It is connected to all the records: work-order money totals, customer documents, QuickBooks, and reporting.

---

## 2. Feature Overview

### Core

* A user adds a fee or discount (an "adjustment") to an open work order. The place where the user starts sets the scope (Story 1).
* Each adjustment has a type (fee or discount), a calculation method, a taxable setting, and an optional maximum amount.
* The calculation method is a flat dollar amount, or a percentage of one of several before-tax amounts.
* A location keeps a library of template adjustments ("Fees & Discounts" in administration). A template can be applied to a work order in one click. Each shop location has its own library.
* A template can be marked auto-apply. An auto-apply template is added to every new work order created at that location.
* A customer can have default adjustments. Each default is a link to a template. Defaults are added to every new work order created for that customer.
* Adjustments appear on the work order in four places: a "WO Fees & Discounts" card in the sidebar (whole-work-order adjustments only), inline on the work-order line table, in the Financial Info card, and on the Statistics tab.
* Adjustments appear on customer estimates and invoices.
* An adjustment can be edited or removed while the work order is open (not yet invoiced or paid).
* Deleting a labor line or a part removes any adjustment that points to that line or part.
* Every add, edit, and remove is recorded in the work-order history log.

### QuickBooks Integration (see Story 6)

* When a work order is invoiced, each fee and discount is sent to QuickBooks as its own line item on the invoice.
* The tax on each QuickBooks line follows the adjustment's taxable setting.

### Feature Flag

* This feature is turned on or off by the Fees & Discounts feature flag, set per organization.
* When the flag is off, no fees-and-discounts controls appear anywhere in the product.
* One exception: the work-order history log still shows fee and discount history even when the flag is off (Story 10).
* When the flag is on, the stories below apply.

### Out of Scope

* One fee or discount applied to a line's labor and its parts together in a single action. The only scopes are a labor line, a part, or the whole work order.
* Advanced per-template QuickBooks item mapping — choosing a specific Product/Service item per fee or discount template. Every fee and discount posts to the location's Fee or Discount item (Story 6). Per-template item selection is a later round.
* Per-class allocation of fees and discounts. When a location segments revenue by QuickBooks Class, every fee and discount posts under the invoice's single class (Story 6). Splitting a fee or discount across the classes it relates to is a later round.

---

## 3. Key Decisions

* **The scope is set by where the user starts.** Starting from the toolbar sets the whole work order. Starting from a labor line's menu sets that line. Starting from a part's menu sets that part. There is no scope dropdown. A Processing Fee is the exception: it has no manual starting place and is added only by auto-apply or a customer default (Story 8).
* **All adjustments are calculated from before-tax amounts, with one exception.** Adjustments on the after-tax total are not supported. The one exception is a Processing Fee using % of Grand Total, whose base includes tax on purpose (§5-R4, Story 8).
* **A user may apply the same template to one work order more than once, by hand.**
* **Deleting a template does not change adjustments already on work orders.** It removes the template and any customer-default links to it (S7-R4).
* **The Financial Info card is read-only for adjustments.** It lists adjustments but has no add, edit, or remove control. Editing and removing happen on the "WO Fees & Discounts" sidebar card and inline on the line table (Story 3).
* **Fees & Discounts adds no permission of its own.** Every action reuses an existing role permission from the Custom Roles and Permissions model (Jira SV-7388). Story 13 maps each action to its permission. Removing an adjustment uses the "Create and Edit" permission, not "Delete." Adding or editing any adjustment also needs "See Financial Data" turned on.
* **Fees and discounts require mapped QuickBooks items when QuickBooks is connected.** The location must map a Fee item and a Discount item before fees or discounts can be added; until then the matching action is blocked, with a link to the QuickBooks settings (Story 6, S6-R6). Unmapping is not hard-blocked: if an item in use is later unmapped, affected invoices wait in Unexported Items and export once it is mapped again (S6-R7).

---

## 4. Terminology

* **Adjustment** — a fee or discount applied to a work order. A fee adds to the total (a plus amount). A discount lowers it (a minus amount). "Adjustment" is the general word for both, used everywhere in the system and this spec.
* **Scope** — which part of the work order or parts sale an adjustment applies to. There are exactly three scopes: Whole Work Order (or Whole Parts Sale), Labor Line (one labor line), and Part Line (one part).

> _\* Context note: Labor Total, Parts Total, and Subtotal are percentage bases (§5), not scopes. The scope is only ever one of the three above._

* **Resolve** — to calculate the final dollar amount of an adjustment.
* **Signed** — shown with a "+" or "−" sign in front.
* **Gross** — a value before any adjustments are applied.
* **Net** — a value after its own line-level adjustments are applied. It does not yet include any Whole Work Order adjustment. For a total (net labor total, net parts total, net subtotal), Net means that total after all the line-level adjustments inside it are applied.
* **Calculation method** — how the amount is worked out: a **Flat Amount**, or a percentage of one of these bases — **Labor Total**, **Parts Total**, or **Subtotal**. §5 gives each base and the per-scope rules.

> _\* Context note: the on-screen dropdown for this is labeled "Calculation type". This spec uses "calculation method" for the same thing._

* **Billable** — a labor line or a part that the shop can charge for. A labor line is billable when it is authorized and not declined. A part is billable when it is authorized, not declined, and still has quantity left. When a line or part is not billable, any adjustment on it resolves to $0 (§5-R12).
* **Staged part / requested part** — a staged part is one already picked (taken from stock). A requested part is one not yet picked. An adjustment may point to either (§5-R13).
* **Template** — a ready-made adjustment kept at a location, applied in one click. Managed in administration.
* **Customer Default** — a template linked to a customer record. It is added to every new work order created for that customer.
* **Rate badge** — the small label on screen that shows an adjustment's rate. It shows a signed percent for a percentage method, or a signed dollar amount for a Flat Amount. The same label is used on the sidebar card and on the line table.
* **Grand Total** — used for a Processing Fee only: the net subtotal (net labor total + net parts total + shop supplies total) plus the tax on that net subtotal. It does not include any whole-work-order fee or discount, and it does not include the Processing Fee itself (§5-R4).

---

## 5. Calculation & Resolution (Contract)

These rules are enforced by the system. They are the final word for all calculation and resolve behavior.

### 5-R1 (minimum values)

Adjustment values must be more than zero.

* Flat Amount: smallest value = $0.01.
* Percentage: smallest value = 0.01%.

### 5-R2 (percentage limits)

* Percentage discounts may not be more than 100%.
* Percentage fees have no upper limit.
* Flat Amount adjustments never have a maximum.

### 5-R3 (percentage resolve)

A percentage adjustment resolves as:

_resolved amount = base × percentage_

Round to the nearest cent. If the part smaller than one cent is half a cent or more, round up to the next cent. If it is less than half a cent, round down.

If the base is below zero, use $0 instead.

Examples:

* 10% fee on a $150.00 base → $15.00.
* 5% discount on a $33.33 base → $1.6665 → $1.67.
* 15% fee on a $0.00 base → $0.00.

### 5-R4 (calculation bases)

The base depends on the adjustment scope and method.

#### Line-level scopes

A line-level adjustment resolves against its target's gross value (before any adjustments).

| Scope | Base |
| --- | --- |
| Labor Line | Target labor line price |
| Part Line | Target part quantity × sell price |

#### Whole Work Order scope

A Whole Work Order adjustment resolves against net totals (after all line-level adjustments are applied).

| Method | Base |
| --- | --- |
| % of Labor Total | Net labor total |
| % of Parts Total | Net parts total |
| % of Subtotal | Net labor total + net parts total + shop supplies total |

#### Processing Fee (a Whole Work Order type)

A Processing Fee resolves against the Grand Total before the fee.

| Method | Base |
| --- | --- |
| Flat Amount | The set amount (no base) |
| % of Grand Total | The net subtotal (net labor total + net parts total + shop supplies total), plus the tax on that net subtotal (see the note below) |

The Processing Fee is excluded from its own base (Story 8). When a work order has more than one Processing Fee, each one uses this same base, and the base excludes every Processing Fee's amount and tax.

No base can go below $0. If a base is below $0, use $0.

> _\* Context note: shop supplies cannot have an adjustment on them (there is no shop-supplies scope), so the shop supplies total is the same whether read as gross or net._

> _\* Context note: an old method, "% of Labor + Parts", still resolves correctly for adjustments saved before this method was removed. A user cannot pick it for a new adjustment, and it is in no dropdown, so it is not listed above._

> _\* Context note: the tax in the Grand Total base is the tax on labor, parts, and shop supplies only. It does not include any tax change from a taxable whole-work-order fee or discount, and it does not include the Processing Fee's own tax. So a taxable Processing Fee never grows its own base (Story 8)._

### 5-R5 (resolve order)

Adjustments resolve in three steps.

#### Step 1 — Line-level adjustments

* Labor Line and Part Line adjustments resolve first.
* Each adjustment resolves on its own, against its target's gross value.
* One line-level adjustment does not stack on another.
* After Step 1, the net labor total and net parts total are worked out.

#### Step 2 — Whole Work Order adjustments

* Whole Work Order adjustments resolve second.
* Each adjustment resolves on its own, against the same net totals from Step 1.
* One Whole Work Order adjustment does not stack on another.

#### Step 3 — Processing Fee

* A Processing Fee resolves last, after Step 2.
* Its base is the Grand Total in §5-R4. That base uses the pre-fee tax — the tax on labor, parts, and shop supplies, worked out before any Processing Fee.
* It is excluded from its own base. It does not change the base of any Step 1, Step 2, or other Processing Fee adjustment.
* If the Processing Fee is taxable, its own amount is then added to the taxable amount (§5-R11), so the final invoice tax includes it. This added tax never changes the Processing Fee's base (no feedback loop).

#### Example

Work order: Gross Labor = $200, Gross Parts = $100, with a 10% Labor Line discount.

* Step 1: 10% × $200 = −$20. Net Labor = $180.
* Step 2: a 5% fee (% of Labor Total) → 5% × $180 = +$9. A 10% discount (% of Parts Total) → 10% × $100 = −$10.
* The two Step 2 adjustments do not change each other's base.

#### Example — Processing Fee

Net subtotal (after line discounts) = $300. Pre-fee tax on that subtotal = $24. Grand Total base = $300 + $24 = $324.

* A 3% Processing Fee resolves: 3% × $324 = +$9.72.
* If the Processing Fee is taxable, the $9.72 is then added to the taxable amount, and the final invoice tax grows by the tax on $9.72. The $324 base does not change.

### 5-R6 (maximum amount)

A percentage adjustment may set an optional maximum resolved amount ("Max Amount").

To apply it:

1. Take the resolved amount and drop the "+" or "−" sign.
2. Compare the value to Max Amount.
3. If the value is bigger than Max Amount, lower it to Max Amount.
4. Put the "+" or "−" sign back.

Rules:

* Max Amount must be $0 or more.
* Max Amount = $0 forces the adjustment to resolve to $0.
* Flat Amount adjustments do not use Max Amount.
* A Processing Fee never uses Max Amount, for either method (S8-R10); the rest of this rule is for Fee and Discount percentage adjustments only.

Examples:

* 20% fee on $100 → $20 → Max Amount $15 → +$15.
* 50% fee on $100 → $50 → Max Amount $0 → $0.

> _\* Context note — Min Amount (background only, not built in the UI). A minimum value, "Min Amount", also exists in the data model. It has no control in the UI and is normally empty. Both dialogs always send it as empty (null). It is kept only to work with old data. A template could copy one to an added adjustment. If old data has a Min Amount, two rules apply. On a work-order adjustment, Max Amount must be equal to or more than Min Amount. On a template, Max Amount must be more than Min Amount. The UI always sends Min Amount as empty, so a user cannot make this happen from the product._

> _\* Context note: the system accepts a $0 Max Amount (it forces the result to $0). But neither dialog can send one. Both treat an entered 0 the same as empty, which means no maximum. So a $0 maximum can only come from old data, not from the product UI (S2-R25, S7-R14)._

### 5-R7 (sign)

* Fees resolve to plus amounts.
* Discounts resolve to minus amounts.

### 5-R8 (zero-value resolve)

An adjustment that resolves against a $0 base resolves to $0.00.

A $0.00 adjustment:

* Is skipped when sent to QuickBooks (S6-R1).
* Shows as $0.00 on every other screen: the sidebar card, the Financial Info card, the line table, the Statistics tab, and customer documents.

### 5-R9 (display order)

Work-order screens show adjustments in the order they were created (oldest first). This applies to the "WO Fees & Discounts" sidebar card, the Financial Info card, the line table, and the Statistics tab.

Customer documents use a different order: whole-work-order rows are in creation order (S5-R5), and line-level rows are grouped (S5-R7).

### 5-R10 (allowed calculation methods by scope)

| Scope | Allowed Methods |
| --- | --- |
| Labor Line | Flat Amount, % of Labor Total |
| Part Line | Flat Amount, % of Parts Total |
| Whole Work Order | Flat Amount, % of Labor Total, % of Parts Total, % of Subtotal |
| Processing Fee | Flat Amount, % of Grand Total |

> _\* Context note: "Processing Fee" is an adjustment type, not a fourth scope. It is always Whole Work Order (S8-R4); this row lists the methods allowed for it._

### 5-R11 (tax)

* A taxable fee adds to the taxable amount.
* A taxable discount lowers the taxable amount.
* A non-taxable adjustment does not change the tax.

> _\* Context note: this is all the tax behavior covered here — only how an adjustment's taxable setting changes the taxable amount. Other tax rules (rounding, many tax areas, tax-free customers) are covered by the separate Taxability spec (link to be added)._

### 5-R12 (line-level adjustments follow their target)

* A Labor Line or Part Line adjustment resolves to $0 when its target is not billable. Examples: the target labor line is declined; the target part is declined; the target part is returned and no quantity is left.
* This rule applies to both Flat Amount and percentage adjustments.
* A line-level adjustment shows wherever its target shows, including on a Needs Approval estimate.
* It resolves to a non-zero amount once the target becomes billable (for example, when the target is authorized).

### 5-R13 (pointing to a requested part)

* A Part Line adjustment may point to a requested (not yet picked) part. This lets a fee or discount be shown before the part is picked.
* The adjustment resolves against quantity × sell price.
* It follows the target part per 5-R12.
* It stays attached when the part changes from requested to received.
* A received part cannot later be pointed back to as a request. The requested part stays the target.

### 5-R14 (flat Part Line adjustments are per item)

For Part Line scope, a Flat Amount adjustment is applied per item:

> resolved amount = set amount × quantity

Examples:

* $5.00 discount, quantity 3 → −$15.00.
* $5.00 discount, quantity 1 → −$5.00.

Whole Work Order and Labor Line Flat Amount adjustments have no quantity part. They always resolve to the set amount exactly.

### 5-R15 (taxable jurisdiction note)

Below every Taxable control — the Add / Edit fee-or-discount dialog (S2-R26) and the Processing Fee dialog (S8-R11) — this exact text shows: _Tax treatment varies by jurisdiction — confirm your local requirements before saving._ It is a plain advisory to the shop; it is not a UI instruction and not a legal-compliance statement.

---

## 6. Requirements

### Story 1: Where a user starts a fee or discount

_Where a user starts adding an adjustment, and which scope each starting place sets._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* The work order is not Invoiced or Paid.
* The user is not in history mode.
* The user has **Work Orders: Create and Edit**.
* The user has **See Financial Data**.

**Requirements:**

* **S1-R1:** Selecting "Add Fee / Discount" from the work-order toolbar's âÂ¯ (more) menu opens the dialog at Whole Work Order scope.
* **S1-R2:** Each labor line row shows its own 3-dot menu button on hover.
* **S1-R3:** Selecting "Add Fee / Discount" from a labor line's 3-dot menu opens the dialog locked to Labor Line scope for that line.
* **S1-R4:** Each part's menu offers "Add Fee / Discount" for both staged parts and requested parts.
* **S1-R5:** Selecting "Add Fee / Discount" from a part's menu opens the dialog locked to Part Line scope for that part.

> _\* Context note: "Add Fee / Discount" is not on the work-order line's own right-click menu. The labor starting place is the labor line row's 3-dot menu (S1-R3). The part starting places are each part's menu (S1-R5)._

**Negative cases:**

* **S1-N1:** On an Invoiced or Paid work order, "Add Fee / Discount" is hidden at all starting places, and the system rejects the action (S3-R1b).
* **S1-N2:** Without **Work Orders: Create and Edit**, these starting places are not shown.

---

### Story 2: Add / Edit fee or discount dialog

_The guided form for setting an adjustment._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:** Same as Story 1.

**Requirements — general:**

* **S2-R1:** Amount minimums and percentage limits follow §5-R1 and §5-R2.
* **S2-R2:** Max Amount behavior follows §5-R6.
* **S2-R3:** The available calculation methods depend on scope, per §5-R10.
* **S2-R4:** On edit, the user can change Name, the value (Amount or Percent), Max Amount, and Taxable.
* **S2-R5:** On edit, Type and Calculation type are shown but cannot be changed.
* **S2-R6:** On save of an edit, the adjustment resolves again against the work order's current totals.
* **S2-R7:** On save of an edit, the resolved amount and the tax both update to match the new values.
* **S2-R8:** Scope and target are set by the starting place and cannot be changed in the dialog.

**Requirements — header:**

* **S2-R9:** The title reads "New Fee / Discount" when adding and "Edit Fee / Discount" when editing.
* **S2-R10:** For Labor Line scope, a grey subtitle reads "Applying to: Line {N} Labor — {name}", or "Applying to: Line {N} Labor" when the line has no name.
* **S2-R11:** For Part Line scope, a grey subtitle reads "Applying to: Line {N} Part — ({part number}) {description}", with the part number left out when the part has none.
* **S2-R12:** For Whole Work Order scope, no "Applying to:" subtitle is shown. The title alone names the dialog.

> _\* Context note: {N} is the work order line's display number. On a Part Sale the subtitle is different — see S11-R6a._

**Requirements — template picker:**

* **S2-R13:** An "Apply from template (optional)" dropdown fills every field with the chosen template's values. This replaces any values the starting place had already filled in.

> _\* Context note: a template has a calculation method but no scope (S7-R2). When a template is applied from a labor-line or part starting place, the added adjustment takes the starting place's scope (S2-R8). Only the template's method, amount, taxable setting, and Max Amount are copied — never a scope._

* **S2-R14:** When the dialog opens from a line or part, the picker lists only Fee and Discount templates whose calculation method fits that scope (§5-R10). It never lists a Processing Fee template (S8-N2).
* **S2-R15:** From a labor line, the picker shows only Flat Amount and % of Labor Total templates.
* **S2-R16:** From a part, the picker shows only Flat Amount and % of Parts Total templates.
* **S2-R17:** When the picker has filtered the list for scope, a hint reads "Showing templates compatible with this line."
* **S2-R18:** The template picker shows in add mode only. It is hidden when editing.

**Requirements — form fields:**

* **S2-R19:** **Name** — required free text, up to 100 characters.
* **S2-R20:** **Type** — a dropdown, "Fee" or "Discount", default "Fee".
* **S2-R21:** **Calculation type** — a dropdown. The options depend on scope (§5-R10).

> _\* Context note: "Type" (Fee or Discount) and "Calculation type" (Flat Amount or a percentage method) are two different dropdowns._

* **S2-R22:** The default calculation method depends on the starting place: a labor line defaults to % of Labor Total, a part defaults to % of Parts Total, and the work-order toolbar defaults to Flat Amount.
* **S2-R23:** **Amount** — a currency input labeled "Amount" for Flat Amount, or a number input with a "%" suffix labeled "Percent" for a percentage method.

> _\* Context note: for a Part Line Flat Amount, the entered value is the per-item rate (§5-R14)._

* **S2-R24:** **Max Amount** — a currency input labeled "Max Amount (Optional)", shown only for a percentage method.
* **S2-R25:** An empty Max Amount means no maximum. An entered 0 is treated the same as empty — also no maximum (§5-R6).
* **S2-R26:** **Taxable** — a Yes/No dropdown labeled "Taxable", default "Yes".
* **S2-R26a:** The Taxable jurisdiction note (§5-R15) shows below the Taxable dropdown.

**Requirements — submission:**

* **S2-R27:** In add mode, the confirm button reads "Add Fee" when Type is Fee, or "Add Discount" when Type is Discount. It changes live as the Type field changes.
* **S2-R28:** In edit mode, the confirm button reads "Save."
* **S2-R29:** On success, the matching success toast is shown and fades on its own (§7).
* **S2-R30:** On save failure, the dialog stays open and the returned error is shown as an error toast.

**Requirements — live preview:**

* **S2-R31:** As the user fills in the dialog, a live preview shows three values: the target's value now, the adjustment applied, and the new value.
* **S2-R32:** The live preview updates as the user types.
* **S2-R33:** The adjustment row in the preview is signed and colored: a fee is green and a discount is red.
* **S2-R34:** For a percentage method, the preview row also shows the rate, for example "Fee · 25%".

> _\* Context note: this preview rate (like "Fee · 25%" — no sign, with the word Fee or Discount in front) is not the rate badge from §4. The rate badge on the card and line table is signed and has no word in front (S3-R6)._

* **S2-R35:** The bottom of the preview shows the line "Tax is recalculated on save."
* **S2-R36a:** For Labor Line scope, the preview labels read "Line labor total → New line labor total".
* **S2-R36b:** For Part Line scope, the preview labels read "Part total → New part total".
* **S2-R36c:** For Whole Work Order scope, the preview labels read "Work-order subtotal → New work-order subtotal".
* **S2-R37:** A "Base · Labor total" row shows for a Whole Work Order % of Labor Total adjustment.
* **S2-R38:** A "Base · Parts total" row shows for a Whole Work Order % of Parts Total adjustment.
* **S2-R39:** No "Base ·" row shows for % of Subtotal or Flat Amount, because their base is the work-order subtotal already shown.
* **S2-R40:** A "Part cost" row (unit cost × quantity) shows for a Part Line target.
* **S2-R41:** When no amount is entered, the preview reads "Enter an amount to see the impact."
* **S2-R42:** When the current total cannot be loaded, the preview reads "We couldn't load the figures to preview this selection."

**Negative cases:**

* **S2-N1:** An empty Name blocks save, with an inline error.
* **S2-N2:** An empty Amount or Percent blocks save, with an inline error.
* **S2-N3:** A Processing Fee template never appears in the template picker, from any starting place (S8-N2).

---

### Story 3: Viewing and managing fees & discounts on the work order

_The "WO Fees & Discounts" sidebar card, the inline rows on the work-order line table, and the Financial Info card._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* The user has **See Financial Data** to see any money values.
* The user has **Work Orders: Create and Edit** (whole-work-order adjustments) or **Work Order Lines: Create and Edit** (labor-line and part-line adjustments) to add, edit, or remove an adjustment.

**Requirements — general:**

* **S3-R1a:** An adjustment can be created, edited, or removed only while the work order is open.
* **S3-R1b:** The system rejects any create, edit, or remove on an Invoiced or Paid work order.
* **S3-R2:** Deleting a labor line or a part removes any adjustment that points to it.

**Requirements — "WO Fees & Discounts" sidebar card:**

* **S3-R3:** The work order sidebar shows a "WO Fees & Discounts" card. It lists only Whole Work Order adjustments.
* **S3-R4:** The card is hidden when there are no Whole Work Order adjustments.
* **S3-R5:** Each entry shows the adjustment name and a signed rate badge.
* **S3-R6:** For a percentage method, the rate badge shows the signed percent with extra zeros removed (for example, "−8%", "+3%").
* **S3-R7:** For a Flat Amount, the rate badge shows the signed set dollar amount (for example, "$15.00" for a fee, "−$15.00" for a discount).
* **S3-R8:** Below the name and rate badge, each entry shows the resolved dollar amount in plain grey, signed.
* **S3-R9:** Each entry has a 3-dot menu on hover, with "Edit" and "Delete." It shows only when the work order is open and the user has **Work Orders: Create and Edit**.

> _\* Context note: a Processing Fee entry is the exception — its menu shows "Delete" only, no "Edit" (S8-R17, S8-N5)._

* **S3-R10:** The card has no "Add" control. Adding happens from the starting places in Story 1.
* **S3-R11a:** "Delete" opens a confirm dialog: title "Remove Fee / Discount", message 'Remove "{name}" from this work order?', confirm button "Remove" (red).
* **S3-R11b:** On confirm, the adjustment is removed and the matching toast is shown (§7).

**Requirements — work-order (lines) table:**

* **S3-R12:** A labor-line adjustment shows inside that labor line's row: an indented down-right arrow ("âÂ³"), the name, and a signed rate badge.
* **S3-R13:** A part-line adjustment shows inside that part's row, with the same arrow, name, and signed rate badge.
* **S3-R14:** For each line-level adjustment, the resolved dollar amount shows in the cost column in plain grey, signed.
* **S3-R15:** When a labor line or a part has two or more adjustments, only the first adjustment row shows by default.
* **S3-R16:** A toggle labeled "Show N more" (N is the hidden count) shows the rest; when open it reads "Show less."
* **S3-R17:** Each line-level adjustment row has a 3-dot menu on hover, with "Edit" and "Delete", shown only when the work order is open and the user has **Work Order Lines: Create and Edit**.
* **S3-R18:** The per-line Total column shows the line's gross total plus that line's own adjustment amounts. So the shown total matches the adjustment rows below it.
* **S3-R19:** The per-line Total is a display value only; it changes no stored value.

**Requirements — Financial Info card:**

* **S3-R20:** The Financial Info card shows a "Fees & Discounts (N)" row. N is the count of all adjustments on the work order, of any scope.
* **S3-R21:** This row is collapsed by default.
* **S3-R22:** The collapsed header shows the net total of all adjustments in plain grey.
* **S3-R23:** Opening the row lists each adjustment in creation order (§5-R9), showing the name and the resolved amount in plain grey.
* **S3-R24:** The Financial Info card row is read-only. It has no add, edit, or remove control.

**Negative cases:**

* **S3-N1:** With no Whole Work Order adjustments, the "WO Fees & Discounts" sidebar card is not shown.
* **S3-N2:** With no adjustments of any scope, the "Fees & Discounts (N)" row is not shown on the Financial Info card.
* **S3-N3:** On an Invoiced or Paid work order, the per-entry and per-row 3-dot menus are not shown.
* **S3-N4:** Without **See Financial Data**, the Financial Info card's money section is hidden.

---

### Story 4: Statistics tab — fees & discounts summary

_The fees & discounts section on the work order's Statistics tab._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* The work order has at least one fee or discount.
* The user has **See Financial Data**.

**Requirements:**

* **S4-R1:** The Statistics tab has a "Fees & Discounts (N)" section. N is the count of all adjustments, of any scope.
* **S4-R2:** The section has two value columns: a "%" column and an "Amount" column.
* **S4-R3:** Each row shows the adjustment name, its signed rate in the "%" column, and its signed resolved amount in the "Amount" column.
* **S4-R4a:** In the "%" column, a fee shows a "+" at the front.
* **S4-R4b:** In the "%" column, a discount shows a minus sign "−" at the front (the true minus character, U+2212, not a hyphen).
* **S4-R4c:** In the "%" column, a Flat Amount shows nothing.
* **S4-R4d:** A Processing Fee is treated as a fee here: a "% of Grand Total" Processing Fee shows "+" in the "%" column, and a Flat Amount Processing Fee shows nothing (S4-R4c).
* **S4-R5:** In the "Amount" column, a fee is signed "+", a discount is signed "−", and a zero amount has no sign.
* **S4-R6:** A "Total" row shows the signed sum of every adjustment's resolved amount in the "Amount" column.

**Negative cases:**

* **S4-N1:** With no adjustments, the whole section is hidden.

---

### Story 5: Customer invoice and estimate

_How adjustments show on customer estimates and invoices._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:** The work order has at least one fee or discount.

**Requirements:**

* **S5-R1:** One document layout serves both invoices and estimates. Adjustments show on both whenever they are present.

**Requirements — per-line adjustments (Labor Line, Part Line scope):**

* **S5-R2:** A per-line adjustment shows indented under the labor line or part it points to, with a "âÂ³" arrow in front of the name.
* **S5-R3:** For a percentage method, a short phrase in brackets follows the name: "% of labor" (Labor Line) or "% of parts" (Part Line). A Flat Amount shows no phrase.

> _\* Context note: the text in brackets is a phrase, not a number. A percent-of-labor fee named "Shop Supply Fee" shows as "Shop Supply Fee (% of labor)", not "Shop Supply Fee (10%)"._

* **S5-R4:** A fee amount shows as "$X.XX". A discount amount shows in round brackets (accounting style): "($X.XX)" — two decimal places, no minus sign.

**Requirements — whole-work-order adjustments:**

* **S5-R5:** A bottom "Adjustments" block sits after the Labor / Parts / Shop Supplies rows and before Subtotal (then Tax, then Total). It lists whole-work-order adjustments one by one, in creation order, each showing the name and (for a percentage method) its phrase.
* **S5-R6:** A whole-work-order percentage adjustment's phrase is one of "% of labor", "% of parts", "% of subtotal", or "% of grand total" (Processing Fee — Story 8, S8-R22). A Flat Amount shows no phrase.

> _\* Context note: "% of labor + parts" shows as a phrase only for older saved adjustments that use the removed method (§5-R4). A user cannot make it from the current UI._

* **S5-R7:** In the same block, line-level adjustments are grouped by name and type — one row for each name-and-type group. When a group has more than one adjustment, the row shows a count, for example "Shop Supply Fee (×3)". It also shows the total resolved amount.
* **S5-R8:** A line-level adjustment also still shows inline under its target (S5-R2), as well as in its grouped row in the bottom block.
* **S5-R9:** Amounts in this block use the same format as S5-R4.

> _\* Context note: this grouping is only on the customer document. The work-order line table lists each line-level adjustment one by one (Story 3); it does not group them._

---

### Story 6: QuickBooks sync

_Fees and discounts on the QuickBooks invoice._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The work order has been invoiced.
* The shop location has an active QuickBooks connection.

**Requirements — what syncs:**

* **S6-R1:** Each fee and discount on the invoiced work order is sent to QuickBooks as its own invoice line item — a fee as a positive amount, a discount as a negative amount. A $0.00 resolved-amount adjustment is skipped (§5-R8).
* **S6-R2:** The tax on the QuickBooks line follows the adjustment's taxable setting: taxable → the invoice's active tax; non-taxable → zero tax (§5-R11).
* **S6-R3:** The QuickBooks line's description is the adjustment's name as shown on the customer's invoice. The line's Product/Service item is the mapped item from S6-R5, not the adjustment's name.

**Requirements — mapping (which QuickBooks item each line posts to):**

* **S6-R4:** QuickBooks requires every amount-bearing line to reference a Product/Service item, which determines the income account the amount posts to. Every synced fee/discount must therefore resolve to an item.
* **S6-R5 (dedicated items):** The location maps one QuickBooks Product/Service item for **Fees** and one for **Discounts**, in Settings → QuickBooks. Every synced fee posts to the Fee item. Every synced discount posts to the Discount item.

**Requirements — mapping guard (fees and discounts need a mapped item):**

* **S6-R6 (mapping is required to add):** When QuickBooks is connected for the location and the **Fee** item is not mapped, adding a fee is blocked. When the **Discount** item is not mapped, adding a discount is blocked.

> _\* Context note: the block is per kind. A missing Fee item blocks only fees. A missing Discount item blocks only discounts._

* **S6-R6a (where the block applies):** The block applies in every place a fee or discount is added: the work-order dialog, the labor-line dialog, the part dialog, the part-sale dialogs (the whole sale and a single part), and applying a template to a work order.
* **S6-R6b (auto-apply defaults):** An auto-apply default cannot be saved while the matching item is unmapped. This covers a location-default template marked auto-apply and a customer default. The block is at setup, so an auto-apply default never adds a fee or discount on the server without a mapped item.
* **S6-R6c (what is not blocked):** Creating or editing a template that is not auto-apply, in Settings, is always allowed. When QuickBooks is not connected for the location, there is no block and fees and discounts work normally.
* **S6-R6d (warning):** A blocked add shows the message "Map a Fee item in Settings → QuickBooks before adding a fee." For a discount the message is "Map a Discount item in Settings → QuickBooks before adding a discount." The text "Settings → QuickBooks" is a link that opens the QuickBooks settings page.

**Requirements — unmapping or connecting later (recoverable, not blocked):**

* **S6-R7 (the reverse case is recoverable):** The Fee and Discount item mappings are not locked. If a shop unmaps an item that fees or discounts still use, or connects QuickBooks after fees or discounts already exist, each affected invoice goes to Unexported Items at sync time and exports once the item is mapped again and the invoice is re-exported. No data is lost.

> _\* Context note: this is the same recoverable path used for any unmapped item, so unmapping is not singled out for a hard block. The forward guard (S6-R6) already prevents this in normal use; reaching Unexported Items here takes an admin actively unmapping an item the location is using._

* **S6-R7a (settings-page prompt):** The QuickBooks settings page prompts the shop to map the Fee and Discount items, the same way it prompts for the Credit and Deposit items.

**Requirements — QuickBooks Class:**

* **S6-R8 (single class, applied uniformly):** If the location has a QuickBooks Class set, that one class is applied to **every** synced line, fee and discount lines included. Fees and discounts are **not** split or allocated across multiple classes. If the location has no class set, the synced lines carry no class. _(Per-class allocation of fees and discounts is out of scope — §2.)_
* **S6-R9 (stale class aborts):** Before sending, the class is validated against QuickBooks. If it was deleted or deactivated, the **entire invoice sync aborts** — the class is not substituted.

**Negative totals:**

* **S6-R10 (net subtotal floors at $0.00):** When stacked fees and discounts would drive a work order's net subtotal (net labor total + net parts total + shop supplies total, before tax) below $0.00, the net subtotal is floored at $0.00. It can never resolve below zero.
* **S6-R10a (the floor is on the subtotal, never the tax-inclusive total):** The $0.00 floor is applied to the pre-tax net subtotal only. It is never applied to the tax-inclusive work-order total. Tax is calculated on top of the floored subtotal.
* **S6-R10b (tax on the taxable base is still owed):** A non-taxable discount does not change the tax (§5-R11). When a non-taxable discount floors the net subtotal at $0.00, the tax on the original taxable base is still owed and is still charged. In this case the work-order total equals that tax, not $0.00.
* **S6-R10c (a $0.00 total with no tax needs a taxable discount):** A taxable discount lowers the taxable amount (§5-R11). To bring a work order to a $0.00 total with no tax owed, the discount must be taxable and large enough to lower the taxable amount to $0.00. The discount's taxable setting decides whether the tax is still charged.
* **S6-R10d (capping discount lines on the QuickBooks invoice):** QuickBooks builds the invoice total from its line items and rejects a negative total. When the floor (S6-R10) applies, the discount lines sent to QuickBooks are capped so the invoice's line items sum to the floored net subtotal and never fall below it. When more than one discount line is present, the cap is distributed across those lines proportionally to each line's size. The proportional reduction is allocated in whole cents using the largest-remainder method. Every discount line stays a whole-cent value, the capped discounts sum exactly to the required amount, and no rounding produces a fractional cent or a negative total. The amount removed by the cap is the carried customer credit (S6-R11).

> _\* Context note: worked example. A work order has $100.00 of taxable parts and $10.00 of tax. A non-taxable discount of $150.00 is applied. The net subtotal drops to negative $50.00, so it floors to $0.00. The tax stays $10.00 because the discount is non-taxable. The customer pays $10.00. The $50.00 by which the discount exceeded the subtotal is carried as a customer credit (S6-R11). If the same $150.00 discount were marked taxable, it would instead lower the taxable amount to $0.00, the tax would be $0.00, and the customer would pay $0.00._

> _\* Context note: a work-order total can never be negative under this rule, because the subtotal floors at $0.00 and tax is never negative. This keeps the QuickBooks sync valid (QuickBooks rejects an invoice whose grand total is below $0.00)._

* **S6-R11 (the floored-off amount is carried as a customer credit):** The amount by which discounts exceeded the net subtotal — the part removed by the $0.00 floor (S6-R10) — is recorded as a freestanding customer credit on the customer's account (a customer credit not tied to a work order, in the Deposits & Credits system). It represents money the shop owes the customer, not cash received. It carries forward and is drawn down against the customer's next invoice through the standard credit-application flow.
* **S6-R12 (warn before carrying):** When discounts on a work order exceed its net subtotal, the user is warned before the work order can be saved — that the net subtotal will floor at $0.00, that any tax on the taxable base is still owed, and that the excess (shown as a dollar amount) will be carried as a customer credit — and must confirm. The carry is never silent.
* **S6-R13 (carried credit syncs to QuickBooks as a goodwill credit memo):** The carried credit is posted to QuickBooks as a goodwill credit memo on the location's Customer Credit item, marked tax-exempt — the same treatment as other goodwill credits in the Deposits & Credits system. It is not posted as a QuickBooks payment, because no cash was received. Posting it as a credit memo means QuickBooks knows about the credit when it is created, so ShopView and QuickBooks stay in sync when the credit is later applied to another invoice. There is no manual reconciling step.

---

### Story 7: Adjustment templates (administration)

_The location library of ready-made fees and discounts._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* The user has administration access.

**Requirements:**

* **S7-R1:** Each shop location has its own template library, kept for that location only.
* **S7-R2:** A template has only a whole-work-order calculation method: Flat Amount, % of Labor Total, % of Parts Total, or % of Subtotal. Labor Line and Part Line scopes are not available on templates.
* **S7-R3:** A percentage-discount template may not be more than 100%. A percentage-fee template has no upper limit (§5-R2).
* **S7-R4:** Deleting a template does not change adjustments already on work orders. It removes the template and any customer-default links to it.
* **S7-R5:** A template marked auto-apply is added to every new work order created at that template's location.
* **S7-R6a:** The added adjustment is always Whole Work Order scope.
* **S7-R6b:** It copies the template's name, type, calculation method, amount, taxable setting, and Max Amount, using the values as they are when the work order is created. A Processing Fee never has a Max Amount to copy (S8-R10).

**Requirements — template list:**

* **S7-R7a:** The administration "Fees & Discounts" page is at Administration → Service → Fees & Discounts.
* **S7-R7b:** The page is shown to any user with at least one location.
* **S7-R7c:** The page is shown right below Canned Lines.
* **S7-R8:** The list shows the location's templates with columns, left to right: Name, Type, Calculation Type, Amount, Max Amount, Taxable, "Auto-Apply To Work Orders", and a delete action.
* **S7-R9:** Clicking a row opens the edit dialog.
* **S7-R10:** A "New fee / discount" button opens the create dialog.
* **S7-R11:** When there are no templates, the empty state reads "No fees or discounts yet — click Add to create your first."

**Requirements — create / edit dialog:**

The dialog collects these fields:

* **S7-R12a:** Type — a dropdown: "Fee", "Discount", or "Processing Fee" (see Story 8 for Processing Fee behavior).
* **S7-R12b:** Calculation type — a dropdown.
* **S7-R12c:** Name — free text, up to 100 characters.
* **S7-R12d:** Amount (for Flat Amount), or Percent (for a percentage method).
* **S7-R12e:** Max Amount (Optional) — shown for percentage methods only, and never for a Processing Fee (S8-R10).
* **S7-R12f:** Taxable — a Yes/No dropdown, default "Yes".
* **S7-R12g:** An "Auto-apply to all new work orders at this location" checkbox.
* **S7-R13:** There is no scope field. Every template is whole-work-order; the calculation method is the only choice.
* **S7-R14:** An empty Max Amount means no maximum. An entered 0 is treated the same as empty — also no maximum (§5-R6).
* **S7-R15:** For a Fee or a Discount, the calculation type options are: Flat Amount, % of Labor Total, % of Parts Total, % of Subtotal. A Processing Fee uses different options (S8-R5).
* **S7-R16:** The title reads "New Fee / Discount" when creating and "Edit Fee / Discount" when editing.
* **S7-R17:** The confirm button reads "Add Fee / Discount" when creating, for any selected type, and "Save" when editing.

> _\* Context note: the template dialog's create button is one fixed label. This is different from the work-order dialog (S2-R27), which changes between "Add Fee" and "Add Discount" by the selected type._

* **S7-R18a:** On a successful create, a toast matching the type is shown: "Fee added", "Discount added", or "Processing fee added".
* **S7-R18b:** On a successful edit, a toast matching the type is shown: "Fee updated", "Discount updated", or "Processing fee updated".
* **S7-R19:** On save failure, a toast reads "There was an error saving the fee / discount. Please try again."

**Requirements — delete:**

* **S7-R20:** The delete action opens a confirm dialog: message "Are you sure you want to delete this fee / discount?", confirm button "Delete" (red), and Cancel.
* **S7-R21:** When the template is set as a default for one or more customers, the dialog adds: "This template is set as a default for \[N\] customer(s). Their defaults will be removed too."

**Negative cases:**

* **S7-N1:** Deleting a template leaves work-order adjustments made from it unchanged.

---

### Story 8: Processing Fee

_A processing fee is an extra fee a shop passes on to a customer to cover card-processing or surcharge costs. It is set up once as a template and added to work orders automatically._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* The user has administration access (Story 7) to create or change a template.

**Requirements — what a Processing Fee is:**

* **S8-R1:** "Processing Fee" is a third adjustment type in the template builder, next to Fee and Discount.
* **S8-R2:** A Processing Fee always adds to the total. It is never a discount.
* **S8-R3:** A Processing Fee is created only as a template, on the administration "Fees & Discounts" page (Story 7).
* **S8-R4:** A Processing Fee is always whole-work-order. It is never tied to a labor line or a part.

> _\* Context note: a Processing Fee reuses the template builder and all the template rules in Story 7. This story adds only what is different for the Processing Fee type._

**Requirements — calculation:**

* **S8-R5:** A Processing Fee uses one of two calculation methods: Flat Amount, or % of Grand Total. No other method is offered (§5-R10).
* **S8-R6:** The default method is Flat Amount.
* **S8-R7:** A Flat Amount Processing Fee resolves to exactly the set amount (§5-R4).
* **S8-R8:** A "% of Grand Total" Processing Fee resolves against the Grand Total base in §5-R4, rounded per §5-R3.
* **S8-R9:** "% of Grand Total" is offered only for a Processing Fee. It is not a method for a Fee or a Discount.

**Requirements — maximum amount:**

* **S8-R10:** A Processing Fee has no maximum amount. The "Max Amount" field is not shown, for either calculation method.

**Requirements — taxable:**

* **S8-R11:** The Taxable Yes/No setting is shown for a Processing Fee. The default is Yes.
* **S8-R12:** Taxable behavior follows §5-R11: a taxable Processing Fee adds to the taxable amount; a non-taxable one does not change the tax.
* **S8-R13:** The Taxable jurisdiction note (§5-R15) shows below the Taxable setting.

**Requirements — how a Processing Fee reaches a work order:**

* **S8-R14:** A Processing Fee template can be marked auto-apply (Story 7). It is then added to every new work order created at that location.
* **S8-R15:** A Processing Fee template can be set as a customer default (Story 9). It is then added to every new work order for that customer.
* **S8-R16:** A Processing Fee cannot be added to a work order by hand.

> _\* Context note: "by hand" means the work-order add dialog and its template picker (S8-N1, S8-N2). A shop still puts a Processing Fee on work orders by marking its template auto-apply (S8-R14) or by adding it as a customer default (S8-R15). The customer-default add picker (S9-R18) does list Processing Fee templates, so a Processing Fee can be linked there._

> _\* Context note — current build: in the customer-default add picker, a Processing Fee template shows with the type label "Fee" (the picker has no separate Processing Fee label)._

**Requirements — changing a Processing Fee on a work order:**

* **S8-R17:** A Processing Fee on a work order can be removed, but not edited.
* **S8-R18:** To change a Processing Fee's amount, method, or taxable setting, the user edits its template on the administration "Fees & Discounts" page (Story 7).
* **S8-R19:** Editing the template does not change Processing Fees already on existing work orders. The change applies only to work orders created after it (S7-R6b for the auto-apply path; S9-R3 and S9-R5 for customer defaults).

> _\* Context note — current build: the work-order card still shows an Edit control on a Processing Fee entry, and using it fails. Hiding that Edit control, leaving only Remove, is a code change to close against S8-R17._

**Requirements — display and downstream:**

* **S8-R20:** On the work order, a Processing Fee shows in the "WO Fees & Discounts" sidebar card, with its name, rate badge, and resolved amount, the same as any other whole-work-order adjustment (Story 3). Its 3-dot menu shows "Delete" only, with no "Edit" (S8-R17); "Delete" opens the standard Remove confirm dialog (S3-R11a).
* **S8-R21:** For "% of Grand Total", the rate badge shows the signed percent. For Flat Amount, it shows the signed dollar amount (Story 3).
* **S8-R22:** On customer estimates and invoices, a Processing Fee shows as a whole-work-order adjustment (Story 5). For "% of Grand Total", the phrase in brackets is "% of grand total" (it joins the S5-R6 phrase list).
* **S8-R23a:** When the work order is invoiced, a Processing Fee syncs to QuickBooks as its own line item (S6-R1).
* **S8-R23b:** The tax on that QuickBooks line follows the Processing Fee's taxable setting (S6-R2).
* **S8-R23c:** A $0.00 Processing Fee is skipped and not sent to QuickBooks (S6-R1).
* **S8-R23d:** A Processing Fee posts to the Fee item and follows the same mapping guard as any other fee (S6-R5, S6-R6).
* **S8-R24a:** A Processing Fee shows on the Statistics tab Fees & Discounts section, like other adjustments; its "%" column sign follows S4-R4d.
* **S8-R24b:** A Processing Fee shows in the Financial Info card "Fees & Discounts" row, like other adjustments (S3-R20).
* **S8-R25:** In the work-order history log, a Processing Fee is recorded as a fee: the Event reads "Fee added" or "Fee removed", and the Details "Type:" line reads "Fee" (Story 10).
* **S8-R26:** The Details "Applied to:" line for a Processing Fee reads "Full invoice", because it is a whole-work-order adjustment (S10-R6d).

> _\* Context note: there is no "Fee updated" history entry for a Processing Fee, because it cannot be edited on a work order (S8-R17). It is only added (S8-R14, S8-R15) and removed (S8-R17)._

> _\* Context note: the QuickBooks behavior (S8-R23a–d) follows Story 6. A Processing Fee is treated as a fee for mapping and sign._

> _\* Context note — current build: the history log shows the raw word "processing_fee" on the "Applied to:" line for a Processing Fee instead of "Full invoice". Showing "Full invoice" (S8-R26) is a small code fix to close._

**Negative cases:**

* **S8-N1:** The work-order add dialog does not list Processing Fee as a type.
* **S8-N2:** The work-order template picker does not list Processing Fee templates.
* **S8-N3:** The "Max Amount" field is hidden for every Processing Fee.
* **S8-N4:** Saving a Processing Fee with a maximum amount, or with any method other than Flat Amount or % of Grand Total, is rejected.
* **S8-N5:** The work order offers no "Edit" control for a Processing Fee — only "Delete" (S3-R9, S8-R17).
* **S8-N6:** The system also rejects a Processing Fee that carries a minimum amount. There is no UI control for a minimum amount (see the §5-R6 Min Amount note), so this guard applies only to data sent from outside the product.

---

### Story 9: Customer default adjustments

_Templates linked to a customer that are added to that customer's new work orders._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:**

* The Fees & Discounts feature flag is on.
* At least one template exists in the location's library.

**Requirements — behavior:**

* **S9-R1:** When a customer is created, every auto-apply template at the location is added as a default for that customer.
* **S9-R2:** When a new work order is created for a customer with defaults, each default is added to the work order as an adjustment.
* **S9-R3:** The added adjustment is an independent copy. It copies the template's name, type, calculation method, amount, taxable setting, and Max Amount, using the values from when the work order is created.
* **S9-R4:** After it is added, the adjustment is separate from the customer's defaults: editing or removing it on the work order does not change the defaults.
* **S9-R5:** After it is added, the adjustment is separate from the template: a later change to the template does not change adjustments already added.
* **S9-R6:** A percentage default keeps the percent, not a fixed dollar amount.
* **S9-R7:** Each new work order resolves a percentage default again against its own base (§5-R3, §5-R4), so the dollar amount can differ per work order.
* **S9-R8:** Removing a customer default does not change adjustments already on existing work orders.
* **S9-R9:** If a template is deleted while it is a customer default, the default link is removed and adjustments already on work orders stay.
* **S9-R10:** Deleting a customer removes that customer's default links.

> _\* Context note: every template is whole-work-order (S7-R2), so a customer default is always whole-work-order too. The added adjustment is therefore always whole-work-order scope, like the auto-apply path (S7-R6a)._

> _\* Context note — known gap: when one template is both auto-apply at the location (S7-R5) and a customer default (S9-R2), the intended result is one adjustment on the work order. A current bug can add it twice depending on internal order. This is tracked as a separate fix and is not specific to Processing Fees._

**Requirements — customer page:**

* **S9-R11:** The customer page has a "Fees & Discounts" tab. The tab label shows a count "(N)", where N is the number of defaults on the customer. It shows "0" when there are none.
* **S9-R12:** The tab panel holds a "Default Fees & Discounts" card.
* **S9-R13:** The card header shows the title "Default Fees & Discounts" and an "Add Fee/Discount" button. The button shows only to a user with **Customer Management: Create and Edit** and **Manage Accounts Payable and Receivable**.
* **S9-R14:** Below the header, a caption reads: "These fees & discounts auto-apply to every new work order for this customer. They can still be edited or removed on individual work orders without changing the defaults here."
* **S9-R15:** The card lists the customer's defaults in a table with columns, left to right: Name, Type, Calculation Type, Amount, Max Amount, Taxable, and an actions column.
* **S9-R16:** Each row's actions column has a 3-dot menu with one item, "Remove." The card has no inline edit.
* **S9-R17:** When the customer has no defaults, the empty state reads "No fees or discounts yet. Use 'Add Fee/Discount' to add one."

> _\* Context note — exact text as built: the customer card's button and empty state read "Add Fee/Discount" (no spaces around the slash), while the work-order and template dialogs use "Add Fee / Discount" (with spaces). This difference is how the product is built. Keep it exactly; do not normalize it._

**Requirements — add picker:**

* **S9-R18:** The "Add Fee/Discount" button opens a picker dialog titled "Add Fee/Discount" with a confirm button "Add."
* **S9-R19:** The dialog shows a caption "Select a fee or discount template to add to this customer." and lists templates not yet linked to this customer.
* **S9-R20:** Each template row has a checkbox and shows Name, Type, Calculation Type, and Amount. The user may select more than one.

> _\* Context note: Processing Fee templates also appear in this picker, because a Processing Fee can be a customer default (S8-R15). In the current build, a Processing Fee row shows "Fee" in the Type column. The caption "Select a fee or discount template" (S9-R19) is generic, not a filter._

* **S9-R21:** Selecting "Add" links every selected template to the customer at once.
* **S9-R22:** When there are no templates to add, the dialog reads "No templates available to add."

**Requirements — feedback:**

* **S9-R23a:** Adding one default shows the toast "Fee / discount added."
* **S9-R23b:** Adding more than one default shows the toast "\[N\] fees / discounts added."
* **S9-R24:** Removing a default needs no confirm and shows the toast "Fee / discount removed."

**Negative cases:**

* **S9-N1:** A failure to add, remove, or load defaults shows the system's standard error notification. There are no custom per-action error strings.

---

### Story 10: Work-order history log

_Every adjustment change is recorded in the work-order history log._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:** To view a work order's history log, the user has **Work Orders: Create and Edit**. To view an individual labor-line or part-line history, the user has **Work Order Lines: Create and Edit**.

**Requirements:**

* **S10-R1:** Fee and discount entries stay visible in the history log even when the fees-and-discounts UI is hidden by the feature flag or by permissions.
* **S10-R2:** Adding, editing, or removing a fee or discount records one history-log entry.
* **S10-R3:** An adjustment entry leaves the saved-state icon column empty.

> _\* Context note: the saved-state icon column is a narrow icon column in the history log. It is empty for an adjustment entry because an adjustment has no saved state to open._

* **S10-R4a — Event (add):** in bold, "Fee added" or "Discount added".
* **S10-R4b — Event (edit):** in bold, "Fee updated" or "Discount updated".
* **S10-R4c — Event (remove):** in bold, "Fee removed" or "Discount removed".
* **S10-R5 — Line:** "−" for every adjustment entry, of any scope.

> _\* Context note: an adjustment entry has no line number, so the Line column is always "−", whether the adjustment is whole-work-order, labor-line, or part-line scope._

**S10-R6 — Details:** a labeled block with these lines:

* **S10-R6a:** `Name:` the adjustment name.
* **S10-R6b:** `Type:` "Fee" or "Discount".
* **S10-R6c:** `Amount:` the set rate, not the resolved total — "$X.XX" for Flat Amount, "X.XX%" for a percentage method. No "+" or "−" sign; the Type line shows fee or discount.
* **S10-R6d:** `Applied to:` "Full invoice" (Whole Work Order), "Labor line", or "Part".

> _\* Context note: the history log uses the exact label "Full invoice" for a Whole Work Order adjustment. Other screens call this scope "Whole Work Order"._

> _\* Context note: a Processing Fee is logged as a fee here — see S8-R25 (Event and Type) and S8-R26 ("Applied to")._

---

### Story 11: Part Sales

_Fees & discounts in the Part Sales (counter-sale) workflow._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:** The part sale is open, the Fees & Discounts feature flag is on, the user has **Part Sales: Create and Edit**, and the user has **See Financial Data**.

**Requirements:**

* **S11-R1:** A Part Sale works like a work order, with the differences below. It is the same for: adjustments; pricing and totals; customer documents (Story 5); and QuickBooks sync (Story 6).
* **S11-R2a:** A part sale has no labor, so a labor-based calculation method resolves to $0.
* **S11-R2b:** A part sale does not use Labor Line scope.
* **S11-R3:** The Add / Edit dialog is the same as the work-order dialog (Story 2), with one difference: on a Whole Parts Sale adjustment, "% of Labor Total" is not offered. The offered methods are Flat Amount, % of Parts Total, and % of Subtotal.
* **S11-R4a:** The part-sale toolbar's âÂ¯ (more) menu has "Add Parts Sale Fee / Discount", which opens at Whole Parts Sale scope. (Spacing and capitalization match the work order toolbar's "Add Work Order Fee / Discount".)
* **S11-R4b:** Each part row's menu has "Add Fee / Discount", which opens at Part Line scope for that part (staged or requested, per Story 1 and §5-R13).
* **S11-R5:** The Statistics tab Fees & Discounts section is the same as Story 4. A part sale's Statistics tab shows only this section and the Total — it has no labor or hours tables.
* **S11-R6a:** For a per-part adjustment, the dialog subtitle reads "Applying to: Part — ({part number}) {description}" (no line number; the part number is left out when there is none).
* **S11-R6b:** For a Whole Parts Sale adjustment, no "Applying to:" subtitle is shown.

**Requirements — part-requests table column:**

* **S11-R7:** The part-requests table shows a "Fees & Discounts" column. It shows only on a part sale and only when the flag is on.
* **S11-R8:** For a core-charge row, the column is empty.
* **S11-R9:** For a part with no adjustments, the column shows a "+ Add" button. The button is disabled when the part sale cannot be edited.
* **S11-R10a:** For a part with one or more adjustments, the column shows the first adjustment's name and rate.
* **S11-R10b:** When the part has more than one adjustment, the column also shows a "+N" badge, where N is the number of extra adjustments after the first.
* **S11-R10c:** Clicking the cell opens the viewer dialog.

**Requirements — part adjustments viewer:**

* **S11-R11:** The viewer dialog is titled "Fees & Discounts", with a subtitle showing the part's label ("{description} · #{part number}", or just the description when there is no part number).
* **S11-R12:** The viewer lists the part's adjustments in a grid with columns: Name, Type, Calculation, Amount, Max Amount, and a per-row remove control.
* **S11-R13:** In the viewer, Amount is the signed resolved amount. Max Amount shows "$X.XX" when set, or "—" when not set.
* **S11-R14:** The per-row remove control shows only when the part sale can be edited.
* **S11-R15:** A "Net adjustment" row shows the signed sum of the part's resolved amounts.
* **S11-R16:** The viewer has a Close button only. It has no Save or edit control.
* **S11-R17:** Removing the last adjustment closes the viewer.

**Requirements — Parts Sale Fees & Discounts card:**

* **S11-R18:** The Part Sale sidebar shows a "Parts Sale Fees & Discounts" card, mirroring the work order's "WO Fees & Discounts" card (Story 3, S3-R3–R11). It lists only Whole Parts Sale (invoice_total) adjustments, including any Processing Fee.
* **S11-R19:** The card is hidden when the Part Sale has no whole-parts-sale adjustments.
* **S11-R20:** Each entry shows the name, a signed rate badge, and the resolved amount in plain grey, with a hover 3-dot Edit / Delete menu (Edit hidden for a Processing Fee — remove-only, per S8-R17). A context note reads "Applies to the whole parts sale, after all part-line fees & discounts."

**Negative cases:**

* **S11-N1:** With no adjustments, neither the Statistics section nor the Financial Info row is shown (same as Stories 3 and 4).

---

### Story 12: Visual rules

_The visual rules for every fees-and-discounts screen. QA checks each screen against the design references in the header. These are the POC videos, the companion video once filmed, and the design links. QA also checks the rules below._

**Design:** See the design references in the header.  **Jira:** TBD

**Prerequisites:** The Fees & Discounts feature flag is on.

**Requirements:**

* **S12-R1:** On screen, the sidebar card, the line table, the Statistics tab, and the Financial Info card show resolved amounts in plain grey.
* **S12-R2:** Green and red are used only inside the Add / Edit dialog's live preview (S2-R33).
* **S12-R3:** A line-level adjustment is shown indented under its target, with a "âÂ³" arrow in front (S3-R12, S3-R13, S5-R2).
* **S12-R4:** A percentage rate badge shows the signed percent with extra zeros removed (for example, "−8%", "+3%"). A Flat Amount rate badge shows the signed dollar amount.
* **S12-R5:** On the "WO Fees & Discounts" sidebar card and on each line-level adjustment row, the Edit / Delete control is a 3-dot menu on the right of the row, shown only on hover.
* **S12-R6:** When a labor line or part has two or more adjustments, only the first shows, with a "Show N more" / "Show less" toggle for the rest (S3-R15, S3-R16).
* **S12-R7:** On customer documents, a fee amount shows as "$X.XX". A discount amount shows in round brackets, "($X.XX)" — two decimal places, no minus sign (S5-R4).
* **S12-R8:** The administration template list and the customer "Default Fees & Discounts" card show their data in a table with bold column headers and plain-text cells.

> _\* Context note: where another story sets a behavior or an exact label, that story is the source of truth. This story covers only how things look. For anything not set in the text, the design references in the header decide it._

---

### Story 13: Permissions

_Which role permission each fees-and-discounts action needs. This feature adds no permission of its own. It reuses the permissions already defined by the Custom Roles and Permissions feature (Jira SV-7388)._

**Design:** See Story 12  **Jira:** TBD

**Prerequisites:** None beyond the permissions named in this story.

This story is the target permission model. It takes its permission names from the Custom Roles and Permissions spec (Jira SV-7388). Where the feature is built differently today, the difference is flagged in the context notes at the end of this story.

Two separate things control access:

* The **Fees & Discounts feature flag** (set per organization, §2) decides whether the feature exists for an organization at all.
* The **permissions** below decide what each user may do inside an organization that has the flag on.

A user needs both: the flag on, and the permission.

**Requirements:**

* **S13-R1:** Fees and discounts add no permission setting of their own. Every action in this story maps to a permission that already exists.
* **S13-R2 (see money values):** A user sees fee and discount dollar amounts — on the "WO Fees & Discounts" sidebar card, the work-order line table, the Statistics tab, the Financial Info card, the Part Sales "Fees & Discounts" column and viewer, and customer documents — only when **See Financial Data** is on. When it is off, these amounts are hidden, the same as every other money value in the product.
* **S13-R3 (whole-work-order adjustment):** Adding, editing, or removing a Whole Work Order adjustment requires **Work Orders: Create and Edit**.
* **S13-R4 (line-level adjustment):** Adding, editing, or removing a Labor Line or Part Line adjustment requires **Work Order Lines: Create and Edit**. This is intentional: a user who can create a work-order line and has See Financial Data can add a line-level adjustment.
* **S13-R5 (Part Sale adjustment):** Adding, editing, or removing an adjustment on a Part Sale — on the whole sale or on a part line — requires **Part Sales: Create and Edit** (plus **See Financial Data**, S13-R6). Part-sale adjustments do not use any Work Order permission.
* **S13-R6 (money visibility is needed to change an adjustment):** To add, edit, or remove any adjustment, the user must also have **See Financial Data** on. The controls that add, edit, and remove adjustments sit on screens that are hidden when See Financial Data is off (S13-R2), so a user without it never reaches them.
* **S13-R7 (remove uses "Create and Edit", not "Delete"):** Removing an adjustment from a work order is part of the "Create and Edit" permission (S13-R3 to S13-R5). It does not need the separate "Delete" permission. "Delete" controls removing whole records — a work order, a labor line, a part — not removing an adjustment from one.
* **S13-R8 (manage templates):** Creating, editing, or deleting an adjustment template — the administration "Fees & Discounts" page (Story 7) — requires **Settings → Finance**. This is the same permission that controls tax settings and the QuickBooks connection.
* **S13-R9 (customer defaults):** Viewing and changing a customer's default fees and discounts — the customer "Fees & Discounts" tab (Story 9) — requires **Customer Management: Create and Edit** and **Manage Accounts Payable and Receivable**. A customer's default fees and discounts are financially sensitive customer settings, in the same group as Default Labor Rate and Default Shop Supplies, which **Manage Accounts Payable and Receivable** already controls. When that permission is off, the tab and its controls are hidden.
* **S13-R10 (history log):** Viewing a work order's history log, where fee and discount entries appear, requires **Work Orders: Create and Edit**. Viewing an individual labor-line or part-line history requires **Work Order Lines: Create and Edit**. Per S10-R1, these entries stay visible even when the fees-and-discounts UI is hidden by the feature flag or by See Financial Data. The history log shows the set rate, not a resolved dollar total (S10-R6c), so See Financial Data does not gate it.

**Negative cases:**

* **S13-N1:** Without **See Financial Data**, all fee and discount dollar amounts are hidden, and no add, edit, or remove control is reachable (S13-R2, S13-R6).
* **S13-N2:** Without the matching Create and Edit permission (S13-R3 to S13-R5), the add, edit, and remove controls are not shown, and the system rejects the action.
* **S13-N3:** Without **Manage Accounts Payable and Receivable**, the customer "Fees & Discounts" tab and its controls are hidden (S13-R9).

> _\* Context note: this story is the target permission model from Custom Roles and Permissions (Jira SV-7388), which is not yet released. Until it ships, the feature uses the matching existing role checks; the behavior is the same and only the setting names change._

> _\* Context note — current-build differences to close when this model is adopted: (1) the administration "Fees & Discounts" page is shown today to any user with at least one location (S7-R7b); S13-R8 tightens it to Settings → Finance. (2) The current build may use one work-order edit check where S13-R3 and S13-R4 split whole-work-order actions from line-level actions._

‌

**Story 14: Shop Supplies On Estimates / Invoices / Financial Tab**

_End-customer facing areas_

**Design:** N/A  **Jira:** TBD

**Prerequisites:** N/A

**Requirements:**

* **S14-R1:** If the total amount of shop supplies on an estimate or invoice equal $0.00, the Shop Supplies header or its contents ($0.00) will not display on the estimate, invoice, or financial tab.  
  _\*\*Context note: This will still be visible in the financial card on the left side of the work order. The header or its contents should not be visible to end-customers when $0.00, though fully visible and modifiable by users in the financial card._
* **S14-R2:** If shop supplies are added during the work order process to be >$0.00, the heading and its contents will then become visible again for the end-customer.  

---

## 7. User Feedback Summary

| Trigger | Message | Behavior |
| --- | --- | --- |
| Fee/discount added to WO | "Fee added" / "Discount added" (matches type) | Success toast, fades on its own |
| Fee/discount updated on WO | "Fee updated" / "Discount updated" (matches type) | Success toast, fades on its own |
| Fee/discount removed from WO | "Fee removed" / "Discount removed" (matches type) | Success toast, fades on its own |
| Fee/discount save failure on WO | _(returned error message — no custom string)_ | Error toast; dialog stays open (S2-R30) |
| Template created | "Fee added" / "Discount added" / "Processing fee added" (matches type) | Success toast, fades on its own |
| Template updated | "Fee updated" / "Discount updated" / "Processing fee updated" (matches type) | Success toast, fades on its own |
| Template save failure | "There was an error saving the fee / discount. Please try again." | Error toast |
| Customer default added (one) | "Fee / discount added" | Success toast, fades on its own |
| Customer default added (more than one) | "\[N\] fees / discounts added" | Success toast, fades on its own |
| Customer default removed | "Fee / discount removed" | Success toast, fades on its own |
| Customer default add/remove/load failure | _(system standard error notification — no custom string)_ | Error toast |

> _\* Context note: the work-order and template toasts name the type ("Fee added" / "Discount added"). The customer-default toasts are general ("Fee / discount added") and do not change by type._

---

## 8. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
| 2026-06-24 | @chris | Revised S6-R10 negative-total handling: the $0.00 floor now applies to the pre-tax net subtotal, not the tax-inclusive total. Tax on the taxable base stays owed because a non-taxable discount never reduces tax (§5-R11). Added S6-R10a/b/c and a worked example. Added the taxable-discount path for a true $0.00 total with no tax. | Tax-compliance correction for both the US and Canada: a non-taxable discount cannot zero out tax that is still remittable. |
| 2026-06-25 | @chris | Set v1 as the source of truth and answered the QuickBooks specialist's questions. Marked Advanced per-template QuickBooks item mapping and per-class allocation of fees & discounts Out of Scope (§2). Removed Tier 2 (former S6-R6), the deferred class-allocation flag, and the "Under Construction" notes; simplified the item resolution order to Fee/Discount default → "Other" default → fail. Flipped the carried-credit rule (S6-R13): the over-discount credit now syncs to QuickBooks as a tax-exempt goodwill credit memo, instead of being held in ShopView only. Added S6-R10d: when several discount lines must be capped, the cap is split proportionally with largest-remainder penny allocation so the QuickBooks line items sum exactly to the floored subtotal. Renumbered Story 6 (former R7–R17 → R6–R13) and Story 13 (removed the QuickBooks-mapping permission; former R10–R12 → R9–R11).    | v1 is what we are building this round; the carried credit must stay in sync with QuickBooks so a later credit application does not drift. |
| 2026-06-26 | @chris | Replaced the QuickBooks item fallback with a mapping guard. Fees and discounts now require a mapped Fee item and Discount item when QuickBooks is connected; adding a fee or discount of a kind is blocked until that kind's item is mapped, with a link to Settings → QuickBooks (S6-R5, S6-R6, S6-R6a–d). Removed the old "Other"/shop-supplies fallback, the " (general)" description suffix (S6-R3), and the sync-failure path (former S6-R7). The reverse edge — unmapping an item still in use, or connecting QuickBooks after fees or discounts already exist — is not hard-blocked: affected invoices wait in Unexported Items and export on remap and re-export, and the QuickBooks settings page prompts for the Fee and Discount items like it does for Credit and Deposit (new S6-R7, S6-R7a). The guard covers part-sale fees and discounts. Updated S8-R23d (Processing Fee follows the same guard). | A production check found only about 30% of QuickBooks shops map shop supplies, so the fallback would have broken most syncs. The team (Sasha, Sinisa, Chris Amani, Chris Ward) chose a configuration requirement — map the items first — over silently failing syncs or auto-creating items inside the customer's QuickBooks. The rare self-inflicted unmap stays recoverable through Unexported Items rather than a hard block, consistent with the other QuickBooks item fields. |
| 2026-07-12 | @chris / @claude | Permissions pass (Story 13 + Stories 1, 3, 4, 9, 10, 11): replaced the euphemistic permission names with the exact Custom Roles (SV-7388) names inline in every story and removed the S13-R11 translation table. History-log viewing now maps to **Work Orders: Create and Edit** (work-order log) and **Work Order Lines: Create and Edit** (line history), replacing View History Logs. Clarified that Part Sale adjustments — whole-sale and part-line — both require Part Sales: Create and Edit plus See Financial Data, and that See Financial Data is required to add an adjustment, not only to edit or remove one. Added §5-R15 taxable jurisdiction note shown below every Taxable control; restored S8-R13 to reference it and removed the obsolete legal-disclosure context note. | Resolves Sasha's 2026-07-12 review comments. |

