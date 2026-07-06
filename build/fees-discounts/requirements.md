# Fees & Discounts V1 — Consolidated Requirements (for test-case authoring)

> **Source of truth:** the "Fees & Discounts V1" spec PDF (12 pages). This doc is a
> structured, near-verbatim extract organized so it can be turned directly into
> concrete manual test cases. Where the spec cites a rule id (e.g. §5-R4, S1-R3)
> the id is kept so cases can be traced back.
>
> **Spec status (from the PDF header):** *WIP — minor clerical updates as we go.*
> Epic / Owner / Branch = TBD.
>
> **IMPORTANT — the PDF is incomplete.** The 12-page document ends in the middle of
> **Story 2** (at requirement **S2-R9**). Stories 3–13 are referenced throughout by
> id (e.g. S3-R1b, S5-R5/R7, S6-R1/R6/R7, S7-R4/R14, S8-R4/R8/R10, S10, S13, S2-R25)
> but their full requirement text is **NOT present** in this document. Everything
> below Story 2 that references a higher story is only what the earlier sections
> quote. See "Open questions / ambiguities".
>
> **Design files:** three claude.ai design links exist (WO line, Customers page,
> Parts page). All three were attempted via the Chromium+proxy harness and are
> **NOT retrievable** — the share links clear Cloudflare only intermittently and
> then redirect to the claude.ai **Sign in** page (they require a logged-in
> claude.ai session we do not have). Requirements below are **spec-only**; any
> pixel-level UI wording must be confirmed against the designs once accessible.

---

## 1. Overview

**What it is.** A built-in way to add extra charges (**fees**) and price reductions
(**discounts**) to a work order, instead of the current workarounds (editing line
prices by hand or adding fake labor lines, which create bad data and break
QuickBooks sync).

**"Adjustment"** is the umbrella term for both a fee and a discount, used
everywhere in the system and the spec.

- A **Fee** *adds* to the total (a **plus / +** amount).
- A **Discount** *lowers* the total (a **minus / −** amount).

**Every adjustment has four settings:**
1. **Type** — fee or discount.
2. **Calculation method** (on-screen dropdown label: **"Calculation type"**) — a
   **Flat Amount**, or a **percentage** of one of several before-tax bases.
3. **Taxable setting** — taxable or non-taxable.
4. **Optional Max Amount** (percentage adjustments only).

**Scope** — where an adjustment applies. Exactly **three** scopes:
- **Whole Work Order** (a.k.a. Whole Parts Sale)
- **Labor Line** (one labor line)
- **Part Line** (one part)

Scope is set by **where the user starts** the add action — there is **no scope
dropdown**.

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
- Per-class allocation — when a location segments revenue by QuickBooks Class,
  every fee/discount posts under the invoice's **single class**.

---

## 2. Fee types

The spec names two kinds of "fee":

1. **Standard Fee** — a normal adjustment of type = fee. Can be scoped to Labor
   Line, Part Line, or Whole Work Order; can be Flat Amount or a percentage of the
   allowed base for that scope (§5-R10). Resolves to a **plus (+)** amount.
   - Percentage fees have **no upper limit** (§5-R2).
   - Real-world examples given: hazardous-waste disposal fee, manager price change.

2. **Processing Fee** — a special **Whole-Work-Order fee type** (it is a *type*, not
   a fourth scope; it is always Whole Work Order — S8-R4). Distinctive rules:
   - **No manual starting place.** It can be added **only by auto-apply or a
     customer default** (Story 8) — a user cannot add one from a toolbar/line menu.
   - Its allowed methods are **Flat Amount** or **% of Grand Total** (§5-R10).
   - **% of Grand Total is the one exception** to the "before-tax" rule — its base
     **includes tax on purpose** (§5-R4).
   - It **never uses Max Amount**, for either method (S8-R10).
   - It **resolves last** (Step 3, §5-R5), excluded from its own base and from every
     other Processing Fee's base.

> Note: real business drivers named in the Business Case include hazardous-waste
> disposal fees and fleet/manager price changes — these are examples of fees, not
> separate configured "types" in the data model.

---

## 3. Discount types

The spec treats discounts as a single kind: an adjustment of **type = discount**.
Distinguishing rules vs fees:

- Resolves to a **minus (−)** amount (§5-R7).
- **Percentage discounts may not exceed 100%** (§5-R2) — this is the key
  fee-vs-discount validation difference on percentages.
- Otherwise a discount uses the same scopes, methods, bases, Max Amount, taxable,
  and template/default machinery as a fee.
- Real-world example given: **fleet account discounts**.

There is **no separate "Processing Discount"** — Processing Fee is fee-only.

---

## 4. Work Order Line behavior (Story 1 + Story 2, line-level)

### Starting places / scope selection (Story 1)
**Prerequisites for any add (S1 prereqs):** feature flag on; WO **not Invoiced or
Paid**; user **not in history mode**; user has the **Work Order change permission**.

- **S1-R1** — "Add Fee / Discount" from the **work-order toolbar's ⋯ (more) menu**
  opens the dialog at **Whole Work Order** scope.
- **S1-R2** — Each **labor line row** shows its own **3-dot menu button on hover**.
- **S1-R3** — "Add Fee / Discount" from a **labor line's 3-dot menu** opens the
  dialog **locked to Labor Line scope** for that line.
- **Context** — "Add Fee / Discount" is **not** on the work-order line's own
  right-click menu; the labor starting place is the line row's **3-dot menu**.

### Negative cases (Story 1)
- **S1-N1** — On an **Invoiced or Paid** WO, "Add Fee / Discount" is **hidden at all
  starting places** and the system **rejects** the action (S3-R1b).
- **S1-N2** — **Without the Work Order change permission**, the starting places are
  **not shown**.

### The Add / Edit dialog (Story 2)
Title: **"New Fee / Discount"** when adding, **"Edit Fee / Discount"** when editing
(S2-R9). Prerequisites same as Story 1.

- **S2-R1** — Amount minimums and percentage limits follow §5-R1 and §5-R2.
- **S2-R2** — Max Amount behavior follows §5-R6.
- **S2-R3** — Available **calculation methods depend on scope**, per §5-R10.
- **S2-R4** — On **edit**, the user can change: **Name**, the **value** (Amount or
  Percent), **Max Amount**, and **Taxable**.
- **S2-R5** — On edit, **Type** and **Calculation type** are shown but **cannot be
  changed**.
- **S2-R6** — On save of an edit, the adjustment **resolves again** against the WO's
  **current totals**.
- **S2-R7** — On save of an edit, the **resolved amount and the tax both update** to
  match the new values.
- **S2-R8** — **Scope and target** are set by the starting place and **cannot be
  changed** in the dialog.

### Line-level resolution behavior (from §5)
- A **Labor Line** adjustment resolves against **target labor line price (gross)**
  (§5-R4). Allowed methods: **Flat Amount, % of Labor Total** (§5-R10). Flat Amount
  on a Labor Line has **no quantity part** — resolves to the set amount exactly
  (§5-R14).
- Line-level adjustments **resolve first** (Step 1) and **do not stack** on each
  other (§5-R5).
- A line-level adjustment **shows wherever its target shows**, including on a
  **Needs Approval estimate** (§5-R12).
- If the target line is **not billable** (declined labor line), the adjustment
  **resolves to $0.00**; it resolves to a non-zero amount once the target becomes
  billable/authorized (§5-R12).
- **Deleting the labor line removes** any adjustment pointing to it (Overview / §2).

---

## 5. Parts Page behavior (Part Line scope)

### Starting places (Story 1)
- **S1-R4** — Each **part's menu** offers "Add Fee / Discount" for **both staged
  parts and requested parts**.
- **S1-R5** — "Add Fee / Discount" from a **part's menu** opens the dialog **locked
  to Part Line scope** for that part.
- **Context** — the part starting places are **each part's menu** (S1-R5).

### Part-line resolution (from §5)
- Base = **target part quantity × sell price (gross)** (§5-R4).
- Allowed methods: **Flat Amount, % of Parts Total** (§5-R10).
- **§5-R14 — Flat Amount on a Part Line is PER ITEM:** resolved amount = **set
  amount × quantity**.
  - Example: $5.00 discount, qty 3 → **−$15.00**.
  - Example: $5.00 discount, qty 1 → **−$5.00**.
- **§5-R13 — requested parts:** a Part Line adjustment may point to a **requested
  (not yet picked) part**, so the fee/discount can show **before the part is
  picked**. It resolves against **quantity × sell price**, follows the target per
  §5-R12, **stays attached when the part changes from requested to received**, and a
  received part **cannot later be re-pointed** to a request (the requested part
  stays the target).
- **Billable:** a part is billable when **authorized, not declined, and still has
  quantity left**. Not billable (declined, or returned with no quantity left) →
  adjustment resolves to **$0** (§5-R12).
- **Deleting the part removes** any adjustment pointing to it (Overview / §2).

> The spec's "Whole Parts Sale" wording is just the Whole-Work-Order scope in a
> parts-sale context (§4 Scope) — not a separate scope.

---

## 6. Customer Page behavior (customer defaults + customer documents)

The spec covers the Customer page in two ways; full Story text (likely Story 5 and
Story 7) is **not in the 12-page PDF**, so only the following is authoritative:

**Customer defaults:**
- A customer can have **default adjustments**; each is a **link to a template**.
- Defaults are **added to every new WO created for that customer** (Overview / §2).
- **Deleting a template removes** the template **and any customer-default links to
  it** (S7-R4); it does **not** change adjustments already on existing WOs.

**Customer documents (estimates & invoices):**
- Adjustments **appear on customer estimates and invoices** (Overview).
- A **$0.00** adjustment still **shows as $0.00** on customer documents (§5-R8).
- **Display order on customer documents differs** from WO screens: **whole-work-order
  rows are in creation order** (cites S5-R5) and **line-level rows are grouped**
  (cites S5-R7) — §5-R9. (The grouping detail lives in Story 5, not in this PDF.)

**Whole-Work-Order scope resolution** (relevant to what a customer/whole-WO
adjustment charges):
- Resolves against **net totals** (after all line-level adjustments), Step 2, and
  **does not stack** on other whole-WO adjustments (§5-R5). Bases per method:
  - **% of Labor Total** → Net labor total
  - **% of Parts Total** → Net parts total
  - **% of Subtotal** → Net labor total + Net parts total + shop supplies total
  - Allowed methods: **Flat Amount, % of Labor Total, % of Parts Total, % of
    Subtotal** (§5-R10). Whole-WO Flat Amount has **no quantity part** — resolves to
    the set amount exactly (§5-R14).

---

## 7. Calculation rules (§5 — the enforced contract)

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

- Line-level scopes resolve against the target's **gross** value (before any
  adjustments). Whole-WO scopes resolve against **net** totals (after line-level).
- **Processing Fee** resolves against the **Grand Total before the fee**; it is
  **excluded from its own base**, and when there is more than one Processing Fee
  each uses the same base that **excludes every Processing Fee's amount and tax**.
- **No base goes below $0** (use $0 if it would).
- **Grand Total** (Processing Fee only) = net subtotal + tax on that net subtotal;
  it **excludes** any whole-WO fee/discount and **excludes the Processing Fee
  itself**. The tax in the Grand Total base is the tax on **labor, parts, and shop
  supplies only** — it excludes any tax change from a taxable whole-WO fee/discount
  and the Processing Fee's own tax (so a taxable Processing Fee **never grows its
  own base**).
- Shop supplies **cannot have an adjustment** (no shop-supplies scope), so the shop
  supplies total is the same read as gross or net.
- Old method **"% of Labor + Parts"** still resolves for adjustments saved before it
  was removed; it is **not selectable** and **not in any dropdown**.

**§5-R5 (resolve order) — three steps:**
1. **Step 1 — Line-level** (Labor Line + Part Line): resolve first, each on its own
   against target gross; do **not stack**. Net labor total and net parts total are
   then computed.
2. **Step 2 — Whole Work Order:** resolve second, each on its own against the same
   net totals from Step 1; do **not stack**.
3. **Step 3 — Processing Fee:** resolves last; base = Grand Total (pre-fee tax);
   excluded from its own base; does not change any other adjustment's base. If
   taxable, its own amount is added to the taxable amount so the final invoice tax
   includes it, but this added tax **never changes the fee's base** (no feedback
   loop).

**Worked example (Steps 1–2):** Gross Labor $200, Gross Parts $100, 10% Labor Line
discount → Step 1: 10% × $200 = **−$20**, Net Labor **$180**. Step 2: 5% fee (% of
Labor Total) = 5% × $180 = **+$9**; 10% discount (% of Parts Total) = 10% × $100 =
**−$10**. The two Step-2 adjustments don't change each other's base.

**Worked example (Processing Fee):** Net subtotal (after line discounts) $300;
pre-fee tax $24; Grand Total base = **$324**. 3% Processing Fee = 3% × $324 =
**+$9.72**. If taxable, $9.72 is added to the taxable amount and final tax grows by
the tax on $9.72; the $324 base does not change.

**§5-R6 (Max Amount)** — a **percentage** adjustment may set an optional **Max
Amount** (max resolved amount).
- Apply: take the resolved amount, drop the sign, compare to Max Amount; if bigger,
  lower it to Max Amount; put the sign back.
- Max Amount must be **≥ $0**; **Max Amount = $0 forces the resolve to $0**.
- **Flat Amount adjustments do not use Max Amount.**
- **Processing Fee never uses Max Amount** (S8-R10) — the rule is for Fee/Discount
  percentages only.
- Examples: **20% fee on $100 → $20 → Max $15 → +$15**; **50% fee on $100 → $50 →
  Max $0 → $0**.
- **Min Amount** exists in the data model only (no UI control, normally empty); both
  dialogs always send it **empty (null)**. It is kept for old data. If old data has a
  Min Amount: on a WO adjustment **Max ≥ Min**; on a template **Max > Min**. A user
  **cannot** trigger this from the product (S2-R25, S7-R14).
- A **$0 Max Amount** can only come from old data — both dialogs treat an entered 0
  the same as empty (no maximum).

**§5-R7 (sign)** — **Fees → plus (+)**; **Discounts → minus (−)**.

**§5-R8 (zero-value resolve)** — an adjustment against a **$0 base resolves to
$0.00**. A $0.00 adjustment is **skipped when sent to QuickBooks** (S6-R1) but
**shows as $0.00** on every other screen (sidebar card, Financial Info card, line
table, Statistics tab, customer documents).

**§5-R9 (display order)** — WO screens (sidebar card, Financial Info card, line
table, Statistics tab) show adjustments in **creation order (oldest first)**.
Customer documents differ (whole-WO in creation order; line-level grouped).

**§5-R10 (allowed methods by scope):**

| Scope | Allowed methods |
|---|---|
| Labor Line | Flat Amount, % of Labor Total |
| Part Line | Flat Amount, % of Parts Total |
| Whole Work Order | Flat Amount, % of Labor Total, % of Parts Total, % of Subtotal |
| Processing Fee | Flat Amount, % of Grand Total |

**§5-R11 (tax)** — a **taxable fee adds** to the taxable amount; a **taxable
discount lowers** it; a **non-taxable adjustment does not change tax**. (Other tax
rules — rounding, multiple tax areas, tax-free customers — are covered by a separate
Taxability spec, not here.)

**§5-R12 (line-level follows its target)** — a Labor/Part Line adjustment resolves
to **$0 when its target is not billable** (declined line; declined part; part
returned with no quantity left). Applies to Flat Amount and percentage. Shows
wherever its target shows (incl. Needs Approval estimate). Becomes non-zero once the
target is billable/authorized.

**§5-R13 (requested part)** — see §5 Parts behavior above.

**§5-R14 (flat Part Line is per item)** — `resolved amount = set amount × quantity`
for Part Line Flat Amount. Whole-WO and Labor Line Flat Amount have no quantity
part (set amount exactly).

---

## 8. Permissions (Story 13 — ties to Custom Roles & Permissions, Jira SV-7388)

**Fees & Discounts adds no permission of its own.** Every action reuses an existing
role permission from the Custom Roles and Permissions model. (Story 13 maps each
action to its permission — that mapping table is **not in this PDF**.)

Known, explicit permission facts from the spec:
- Adding, editing, or removing an adjustment requires the **Work Order change**
  permission (Story 1 prerequisites; S1-N2: without it the starting places are not
  shown).
- **Removing** an adjustment uses the **"Create and Edit"** permission — **not
  "Delete."**
- **Adding or editing any adjustment also requires "See Financial Data" turned on.**
- The user must **not be in history mode**, and the WO must **not be Invoiced or
  Paid**, to add/edit/remove (S1 prereqs; S1-N1 / S3-R1b).

---

## 9. Validation, edge cases & state rules

**Value validation (dialog):**
- Flat Amount < $0.01 → invalid (min $0.01, §5-R1).
- Percentage < 0.01% → invalid (min 0.01%, §5-R1).
- Percentage **discount > 100%** → invalid (§5-R2). Percentage **fee** has no cap.
- Flat Amount fields never accept a Max Amount (§5-R2 / §5-R6).
- Entering **0** in Max Amount is treated as **empty (no maximum)** by both dialogs
  (§5-R6).
- On edit, Type and Calculation type are **locked** (S2-R5); Scope/target are
  **locked** (S2-R8).

**Calculation edge cases:**
- **$0 base → $0.00 resolve** (§5-R8); QuickBooks skips $0.00 lines, screens show
  them.
- **Base below $0 → treated as $0** (§5-R3, §5-R4).
- **Rounding** at exactly half a cent rounds **up** (§5-R3).
- **Max Amount = $0** (old data only) forces **$0.00** (§5-R6).
- **Part Line Flat Amount** multiplies by quantity; **quantity change re-resolves**
  it (§5-R14).
- **Multiple Processing Fees** — each excludes all Processing Fees' amounts+tax from
  the shared base (§5-R4).
- **Taxable Processing Fee** adds its own amount to the taxable amount but never to
  its own base (no feedback loop) (§5-R5).

**Billability / target state:**
- Declined labor line / declined part / returned part with no qty left → adjustment
  resolves to **$0** but stays visible; flips to non-zero when target becomes
  billable (§5-R12).
- Requested part adjustment survives requested→received; received part cannot be
  re-pointed to a request (§5-R13).

**Lifecycle / state gating:**
- WO **Invoiced or Paid** → no add/edit/remove; controls hidden; action rejected
  (S1-N1, S3-R1b).
- **Feature flag off** → all controls hidden **except** the WO history log, which
  still shows fee/discount history (Story 10).
- **Deleting a line/part** removes its adjustments; **deleting a template** removes
  the template + customer-default links but leaves existing WO adjustments untouched
  (S7-R4).

**QuickBooks:**
- Each fee/discount posts as its **own invoice line item**; line tax follows the
  adjustment's taxable setting.
- A **Fee item and a Discount item must be mapped** at the location before
  fees/discounts can be added when QuickBooks is connected; until then the matching
  action is **blocked with a link to QuickBooks settings** (S6-R6).
- Unmapping is **not hard-blocked**: an in-use item later unmapped → affected
  invoices wait in **Unexported Items** and export once it's mapped again (S6-R7).
- **$0.00** adjustments are **skipped** in QuickBooks (S6-R1).
- Every fee/discount posts to the location's **single Fee/Discount item** and under
  the invoice's **single class** (per-template item and per-class splitting are out
  of scope).

**History:**
- Every add/edit/remove is written to the WO history log; the log shows history even
  when the feature flag is off (Story 10). (History-log split of WO-level vs
  line-level — see CLAUDE.md finding — is a broader project note, not in this PDF.)

---

## 10. Open questions / ambiguities (flag to user — do not guess in test cases)

1. **PDF is truncated at Story 2 (S2-R9).** The full text of **Stories 3–13** is not
   in the document, yet they are referenced. Test cases for the following are
   **unwritable from this PDF alone** and need the missing story text:
   - **Story 3** — the "WO Fees & Discounts" sidebar card + inline line-table edit/
     remove UI (only S3-R1b, the invoiced/paid rejection, is quoted).
   - **Story 5** — customer documents: exact grouping/order of line-level rows on
     estimates/invoices (S5-R5, S5-R7 cited only).
   - **Story 6** — full QuickBooks behavior (S6-R1/R6/R7 cited only).
   - **Story 7** — template administration UI and rules (S7-R4/R14 cited only).
   - **Story 8** — Processing Fee full behavior (S8-R4/R10 cited only).
   - **Story 10** — history log behavior beyond "shows when flag off."
   - **Story 12** — the actual UI/design (dialog layout, field labels, control
     placement) — this is the story the 3 design links back.
   - **Story 13** — the **action→permission mapping table** (which exact permission
     gates add vs edit vs remove, beyond the few facts quoted in §3 Key Decisions).
2. **Design files not retrievable.** Exact on-screen labels, dropdown option wording,
   button text, empty/error-state copy, and layout are **not confirmed** — only the
   dialog title ("New Fee / Discount" / "Edit Fee / Discount"), the "Calculation
   type" dropdown label, "Add Fee / Discount" menu item, and "Rate badge" are named
   in the text. Confirm all other UI strings against the designs before writing
   pixel/label-exact steps.
3. **Whole-Work-Order Flat Amount base.** §5-R4 lists bases only for the three
   percentage methods at Whole-WO scope; Flat Amount at Whole-WO is "the set amount"
   by inference (§5-R14 says Whole-WO Flat has no quantity part) but the base table
   doesn't spell out an explicit Flat row for Whole WO. Low risk, worth confirming.
4. **"See Financial Data" for removal.** The spec says removal uses "Create and
   Edit" and that add/edit "also needs See Financial Data." It does **not explicitly
   state** whether **removal** also requires "See Financial Data." Needs
   confirmation (Story 13).
5. **History mode definition.** "The user is not in history mode" is a prerequisite;
   the PDF does not define what puts a user in history mode.
6. **Statistics tab content.** Adjustments "appear on the Statistics tab" and in
   creation order, but the PDF gives no detail on what the Statistics tab shows for
   fees/discounts.
7. **Auto-apply + customer default interaction / duplication.** A location auto-apply
   template and a customer default could both add the same template to a new WO;
   the PDF permits manual duplicate application but does not state whether auto-apply
   and defaults de-duplicate.
8. **Processing Fee creation path detail.** It's added "only by auto-apply or a
   customer default" — the exact configuration path (is a Processing Fee a template
   flagged as Processing Fee?) sits in Story 7/8, not in this PDF.
9. **Spec status is WIP** ("minor clerical updates as we go") and, per project
   CLAUDE.md, several Fees/Discounts-adjacent spec changes are **not yet implemented
   on staging** — cases written to this spec may FAIL against the current app. Verify
   implementation state before executing.
