# Work Orders — Functional Spec

Behavioural spec for the work order detail, completion wizard, receiving and
invoicing flows as prototyped in `Shopview App.dc.html`. Written for
implementation: it describes rules, states and transitions, not visual design.
Where the prototype hard-codes demo data, that is called out.

---

## 1. Settings

Eight org-level settings drive nearly every rule below. Each is a boolean.

| # | Setting | Default | Effect |
|---|---------|---------|--------|
| 0 | Require Approval for New Lines | on | New lines start in **Needs Approval**. Off → lines are auto-approved. |
| 1 | Require Receiving Parts Before Completion | on | Ordered parts must be received before a work order can be invoiced. Off → the Receive step is skipped and receiving is optional. |
| 2 | Require Picking Inventory Parts | on | In-stock parts must be picked. Off → parts are auto-picked and the Pick step never appears. |
| 3 | Require Review | on | A work order must be marked reviewed before invoicing. |
| 4 | Require Tech Story | on | Every line needs a tech story before it can be completed. |
| 5 | Require Mileage | on | Mileage required before the work order can be closed out. |
| 6 | Require Engine Hours | on | Engine hours required before the work order can be closed out. |
| 7 | Parts Have Core Charges | on | Core parts must be resolved (returned or kept) before completion. Off → cores are skipped entirely. |

Plus:

- **Require Ordering Parts** (`ordering`: Manual / Automatic). Automatic means a
  part is considered ordered the moment it is added — no Order action is offered
  anywhere, and new vendor parts land in a to-receive state directly.
- **Custom Permission to Skip Receiving** (`skipRecv`). A permission, not a
  setting. Governs every "Receive later" affordance. Off → Receive is a plain
  button everywhere.

### Quick Controls

A floating panel (prototype affordance) exposing the behaviour-changing settings
plus the role switcher, so flows can be demoed without visiting Settings. Both
surfaces write the same state. Hidden whenever a modal is open.

### Roles

- **Admin** — full permissions.
- **Technician** — no line checkboxes, no bulk bar. Can still use per-line and
  per-part row actions, and can always complete a line.

---

## 2. Line statuses

`pending` (Needs Approval) · `approved` · `declined` · `complete`

Transitions:

| From | Allowed to | Trigger |
|------|-----------|---------|
| pending | approved | Approve |
| pending | declined | Decline |
| approved | declined | Decline |
| approved | complete | Complete |
| declined | approved | Approve (the only action on a declined line) |
| complete | approved | Uncomplete |
| any | pending | Authorization required |

Rules:

- Declining a line with parts is always allowed — no confirmation modal, no
  "return the parts first" guard. It applies immediately with an undo toast.
- Approve/Decline apply immediately. No confirmation dialogs anywhere in this
  flow except **Create invoice** and **Delete lines**.
- A declined line keeps its place as a record; it is not deleted.
- Parts actions (Receive / Order / Pick) only ever count parts on **approved or
  complete** lines. Selecting a Needs-Approval or Declined line contributes no
  parts to those counts.

### Completion is never blocked

A line can always be completed, whatever the state of its parts. Unordered,
unpicked and unreceived parts do not gate the Complete action, and there are no
disabled-with-tooltip states on it. The gating lives in the completion wizard:
whoever closes out the work order is walked through picking, receiving and
resolving. A technician can complete a line in one click and leave the rest to
the person who invoices.

---

## 3. Part statuses

`stock` (In Stock) · `picked` · `auth` (Auth To Order) · `ordered` ·
`awaiting` · `received` · `returned`

Display rules:

- Once a part is picked or received, its status cell is **blank**. Only
  outstanding work shows a status chip.
- With auto-order on, a newly added vendor part goes straight to a to-receive
  state; **Auth To Order** never appears.
- With auto-pick on (Require Picking off), in-stock parts read as picked.

### Row actions

One action per part row, driven by status and settings:

| Part state | Action shown |
|-----------|--------------|
| stock, picking required | **Pick** |
| auth, manual ordering | **Order** |
| ordered / awaiting, receiving required | **Receive** (split button — see below) |
| anything else | none |

**Receive** is a split button when *Custom Permission to Skip Receiving* is on:
the caret opens **Receive now** / **Receive later**. Receive later clears the
part's outstanding status so it no longer blocks completion, and toasts.

When *Require Receiving Parts Before Completion* is **off**, the inline Receive
button disappears and **Receive part** moves into the part's ⋯ menu instead.

### Part ⋯ menu

Move · Return · Add Part Fee / Discount · **Receive Part** (last, only when
receiving is optional).

### Drag and drop

Parts reorder **within their own line only**. Cross-line drops are not
supported. While dragging, the source row dims and a blue insertion line marks
the top or bottom edge of the row being hovered. Drop toasts with undo.

---

## 4. Line ⋯ menu

Anchored to the line number. Contents depend on line state:

- **Request part** (hidden on a completed line)
- **Uncomplete line** (only on a completed line)
- Add line note · Save as canned line · Edit labor
- **Receive parts (n)** — only when receiving is optional and the line has
  parts to receive
- Authorization required

---

## 5. Request part

Opens the New Part Request modal from a line's ⋯ menu.

- Part number field is a typeahead over inventory + catalog parts.
- Selecting an **inventory** part: description and source lock, vendor is
  disabled, bin appears, cost is locked, sell price and margin editable.
- Selecting a **catalog/vendor** part: vendor is editable and may be empty.
- Mandatory: quantity, description, category (defaults to Uncategorized).
- On save the part is appended to that line — inventory parts as In Stock,
  vendor parts as Auth To Order (or straight to to-receive when auto-ordering).
- Available on both work orders.

---

## 6. Bulk action bar

Appears when one or more lines are selected. Floats over the Lines/Parts/Notes
tab row in a zero-height sticky shell, so nothing on the page shifts. Selecting
a row highlights the entire line, sub-rows included. Hidden entirely for
technicians.

### Structure

```
n selected · [primary] · [group 2] · [group 3] · More ▾ · ✕
```

Actions are grouped, with a visible divider between groups. Empty groups are
dropped, and exactly one primary (filled) button is rendered — the first item of
the first surviving group.

**Group order**

1. Finish action — **Create Invoice** (Review off) or **Complete All Lines**
   (Review on), only when the selection covers every open line
2. **Complete Lines (n)** / **Complete Line**
3. Approve (n) — only when the selection contains approvable lines
4. Parts — Receive n parts ▾ · Order n parts · Pick n parts

**Decline always lives in More**, never in a slot.

### More menu

Authorization required (n) · Split to new work order · ─ · [Mark as reviewed] ·
Create invoice · ─ · Decline (n) · Delete lines (n)

- With Review on and the work order not yet reviewed, **Mark as reviewed**
  appears above a **disabled** Create invoice.
- Both invoicing items disappear once an invoice exists.
- Leading and duplicate dividers are stripped when items are absent.
- Empty selection renders "No actions available for this selection".

### Labels

- One line → **Complete Line**
- Several but not all → **Complete Lines (n)**
- Every open line, Review off → **Create Invoice**
- Every open line, Review on → **Complete All Lines**

### Confirmations and undo

| Action | Behaviour |
|--------|-----------|
| Approve | immediate, undo toast |
| Decline | immediate, undo toast — no modal |
| Authorization required / Complete / Uncomplete | immediate, undo toast |
| Order N parts | confirmation modal; not undoable |
| Create invoice | confirmation modal |
| Delete lines | confirmation modal |

Bulk actions are **partial success**, never all-or-nothing: apply every line
that passes, skip the blocked ones, and report per line with a human-readable
reason ("3 lines approved. 1 line couldn't be declined — Line 3: parts must be
returned first."). Undo restores the exact prior status of only the lines that
changed. Toasts auto-dismiss after ~5s.

---

## 7. Completion wizard

One modal, driven by a step list computed from the settings **and** from what is
actually outstanding. Steps whose work is already done are skipped, so a second
pass never re-asks.

### Step order

1. **Tech stories** — only for lines that don't already have one
2. **Pick parts** — only when picking is required and something is still in stock
3. **Resolve cores** — only when Parts Have Core Charges is on and cores exist
4. **Receive parts** — only when receiving is required and parts are outstanding
5. **Missing details** — mileage / engine hours, **always last**

If nothing is required, there is no wizard: the action completes immediately.

### Step pills

- Rendered from the live step list — only applicable steps appear.
- A completed step shows a checkmark and is read-only.
- Pending steps are clickable, so someone missing the mileage can skip ahead and
  come back.
- Reopening the wizard shows only what's left.
- The modal title names the current step ("Pick parts", "Receive parts"), not the
  flow.

### Buttons

The button is the action being taken — there is no Continue anywhere.

| Step | Button |
|------|--------|
| Tech stories | Save |
| Pick parts | **Pick all** (picking is what advances) |
| Resolve cores | resolve each core, then advance |
| Receive parts | **Receive parts** (split, with Receive later) |
| Missing details | Save |

### Receive step

- States the outstanding count plainly: "3 parts not received."
- No mention of ordering. If a part was never marked ordered it is included
  anyway; ordering and the PO happen silently on Receive.
- **Receive parts** opens the full receive modal, scoped to the work order.
  Closing that modal resumes the wizard at the next step.
- **Receive later** (permission-gated) advances without receiving.

### Missing details

Shows only the fields that are required. Asked **once per work order**, and only
when the run closes out every remaining line — completing line 2 while others
remain skips it. Values are remembered, so a later run doesn't ask again.

### Scope

`only` records which lines the run covers.

- **Partial run** — completes just those lines, toasts, no success screen, work
  order status untouched.
- **Whole-order run** — completes everything still open.

### Finish

The wizard carries an explicit *to invoice* intent:

- **Complete All Lines** — completes every line, toasts "All lines completed",
  stays on the work order. The invoice is a separate, deliberate step.
- **Create Invoice** / **Mark as Reviewed** — same wizard, but runs through to
  the end: invoice created, Finance tab, payment modal open.

---

## 8. Header actions

Next to New Line:

- While any line is open: a ⋯ menu holding **Mark as Reviewed** (Review on, not
  yet reviewed) and **Create Invoice**.
- Once every line is complete: that action is promoted to a primary button.
- Once an invoice exists: gone.

Create Invoice from anywhere opens a confirmation stating how many lines are
still open and that creating the invoice completes them all, then runs the
wizard through to the invoice.

---

## 9. Receive modal

Opened from a part row, a line menu, the bulk bar, or the wizard.

### Scope

| Entry point | Contents |
|-------------|----------|
| Part row Receive | every part on the work order **from that same vendor** still awaiting receipt, all checked |
| Part row Receive, no vendor | every **vendorless** part on the work order, all **unchecked** |
| Line menu | that line's outstanding parts |
| Bulk bar / wizard | every outstanding part on the work order |

Excluded: parts not yet ordered, and parts on lines that aren't approved.

### Layout and behaviour

- One card per vendor, collapsed by default, showing vendor name, part count and
  total. **Vendor missing always sorts first.**
- Expanding a card reveals the form: vendor invoice number (autofocused,
  Enter submits), invoice date, delivery note on one row; then the part rows.
- A **Select all / Deselect all** toggle in each card header. Unchecking a part
  leaves it awaiting receipt; checked parts are received against the invoice.
- Editable per part: part number (required when blank, red border until filled),
  quantity received (red when over quantity ordered), cost.
- Changing a cost shows a transient informational banner that updating cost
  updates the sell price. No sell price column.
- Receiving a card collapses it and marks it received with a green confirmation
  row: vendor, quantity, invoice number.
- When only one card remains, it expands automatically.
- Empty state: "Nothing to receive."

### Vendor missing

- The card header shows a warning label only.
- **Assign vendor** is the first field in the expanded form, marked required,
  with a searchable typeahead over vendors; no match offers "Add vendor".
- Invoice number, cost, quantity and delivery note stay disabled until a vendor
  is picked.
- Assigning applies to **checked parts only** — they move into a vendor card
  ready to receive; unchecked parts stay behind in the vendorless card.

---

## 10. Clock in / out

- **Start** begins the timer; the button becomes **Stop**.
- **Stop** opens a modal with the tech story field and two actions:
  **Clock Out** (secondary) and **Clock out and complete** /
  **Clock out and send to review** (primary, per the Review setting).
- No "line completed" toggle. Completing from here is never blocked by parts —
  the line moves to Complete and receiving is left to whoever invoices.

---

## 11. Finance

Reached from the Finance tab on either work order, or **Go To Invoice** on the
completion success screen.

### Document

Shop block, logo, **Estimate: EST-S3-…** / **Invoice: INV-S3-…**, Bill To and
Remit-payment-to, a metadata grid (Unit, VIN/Serial, Asset, Mileage, Eng Hrs,
Service Order, Terms, Due date, Customer PO, Authorizer), the line table
(Description / Quantity / Rate / Amount), totals with adjustments, tax, payments
and balance, and the legal paragraph.

### States

| Condition | Behaviour |
|-----------|-----------|
| Lines still open | **Add Deposit** + **Create Invoice** disabled, with a hover reason. Toggle locked to Estimate. |
| All lines complete | Create Invoice live. Creates INV-S3-…, flips to Invoice, reveals the invoice date, swaps in **New Payment**. |
| Invoiced | New Payment opens the payment modal. |
| Paid | Status reads **Paid**; the document gains a payment row and a $0.00 balance. |

### Payment modal

Payment date · required payment method dropdown (error state until picked) ·
reference number · memo, alongside a table of the customer's open invoices with
this work order pre-checked. Per-row payment amount, amount to credit, payment
total. **Make Payment** / **Send to Terminal** record it. Closing the modal
rolls nothing back — the lines stay complete and the invoice stands.

---

## 12. Notes for implementation

- The prototype holds two work orders: **S3-25095** (4 lines, all approved) and
  **S3-26363** (6 lines, mixed statuses, multiple vendors including a vendorless
  part). Both support every rule above; nothing is exclusive to one.
- All the counts in the bulk bar, the wizard and the receive modal derive from a
  single "what is still outstanding" query per scope. Keeping them on one source
  is what stops the wizard's count from disagreeing with the modal's contents.
- Completion scope (`only`) and invoice intent (`toInvoice`) are the two flags
  that decide everything about how a wizard run ends. Both are set when the run
  is opened and never inferred later.
- Statuses are the interlock, not the UI: no button should be disabled to
  prevent an action the state machine already forbids, and no button should be
  enabled for an action the state machine will reject.
