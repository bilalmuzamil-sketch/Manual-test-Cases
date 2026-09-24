# Simple Flow — Claude Design build brief

| | |
|---|---|
| **Date** | 2026-07-31 |
| **Owner** | Milos Vasic |
| **For** | Claude Design — start building from this |
| **Rule source** | [POC rules](./2026-07-31-simple-flow-poc-rules.md) — the *why* and the rule IDs live there; this document is *where on screen and what it looks like* |
| **Ordering rationale** | [Ordering levers design brief](./2026-07-31-simple-flow-ordering-levers-design.md) |

## 0. How to use this

Everything lands on **three surfaces**, and the document is organised that way:

1. **Settings** — Administration › Work Order settings
2. **Workflow** — the work order list
3. **Workflow detail** — the work order page itself, which carries most of the change

A fourth surface, the **receive screen**, is reached from the work order and gets three small changes; it is at the end.

Each surface says: what is there **today**, what **changes**, **where** it sits, and every **state that must be drawn**. Rule IDs in brackets point at the rule source.

Two conventions:

- **[PROPOSE]** — the behaviour is decided, the presentation is not. Bring two or three options; do not pick silently. All eight are collected in §6.
- **[DON'T]** — a thing that looks like an improvement and is not. §7 collects them.

## 1. Four rules that drive every screen

Everything below is an application of one of these. If a screen seems to need a fifth rule, that is a signal to stop and ask.

**R1 — Visibility follows state, not settings.** An ordering control exists if and only if a part is waiting to be ordered. Nothing on any screen checks "is Automatic on?" to decide what to show. Consequence: in Automatic the whole ordering vocabulary disappears on its own, and a part that fails to order becomes visible instead of stranded. *(POC-G1)*

**R2 — State is always shown; the action is offered once.** A part that needs receiving always says so on its own row. The button that does the receiving appears once per work order, not once per part. This is the difference between informing and nagging. *(POC-8B)*

**R3 — New words are labels, not statuses.** *Staged*, *Receiving skipped*, *Labor complete · awaiting parts* are computed for display. Nothing new is stored. *(POC-G6)*

**R4 — Line status is derived, never clicked.** A technician says the labor is done; the system works out whether the line is finished. *(POC-5A)*

---

## 2. Surface — Settings › Work Order

### Today

Seven toggles in a single flat column, in this order: Require Approval for New Lines · Require Receiving Parts Before Completion · Automatically Pick Inventory Parts · Require Review Before Completion · Require Tech Story · Require Mileage · Require Engine Hours. No grouping, no headings, one Save at the bottom.

### What changes

**A `Parts` group** collecting the parts-related settings in the order the user meets them in the flow — ordering, then receiving. Everything else stays where it is. *(POC-3.1)*

**One new setting inside it:**

| | |
|---|---|
| Label | **Parts ordering** |
| Values | **Manual** (default) · **Automatic** |
| Helper, Manual | "You order parts yourself, per part or in bulk." |
| Helper, Automatic | "Parts are ordered as soon as their line is approved. No order buttons appear anywhere." |

Two values, so it is a segmented control or a pair of radios — **not** a toggle. A toggle would force a label like "Automatic ordering off", which is how the existing receiving setting ended up with a label that disagrees with what it stores. *(POC-3.2)*

**The existing receiving toggle moves *visually* into the group**, directly under Parts ordering. It is the same setting: on means receiving is required, off means it is not. **[DON'T]** relabel it, rename its stored field, or turn it into three values. *(POC-3.2a, POC-3.3)*

### States to draw

1. Parts group with **Manual** selected — receiving toggle beneath it, both live
2. Parts group with **Automatic** selected — nothing else changes; the receiving toggle stays exactly as available as before
3. The group while settings are still loading — **the pre-load values must match the real defaults.** Today two settings render the opposite of their default for a moment, which shows the admin a configuration the shop does not have

---

## 3. Surface — Workflow (work order list)

### Today

The list carries a **Waiting on Parts** count per work order, which clicks through to receiving.

### What changes

Almost nothing — and that is deliberate. This surface becomes **the** place where outstanding parts are remembered, precisely because the completion flow stops nagging about them.

**Waiting on Parts stays and keeps its click-through.** It is the reminder that a vendor bill has not landed, and it lives where the parts person looks rather than where the advisor closes a job. *(POC-8B.6)*

**Rolled-up statuses must be able to express the new middle state.** A work order whose lines are all `Labor complete · awaiting parts` is neither in progress in the old sense nor complete. **[PROPOSE]** how that reads in the list. *(POC-5A.4)*

**In Automatic, no column, chip or tooltip on this list may say a part is not ordered.** Under R1 that falls out for free — there is never such a part — but any hardcoded "not ordered yet" string has to go.

### To confirm against the live page

I have not verified the list's exact columns and chips. Before building, check: which status chips a work order can show, whether Waiting on Parts is a column or a badge, and whether any ordering wording appears there today.

---

## 4. Surface — Workflow detail (the work order page)

This is where most of the work is. Reference layout, from the current page:

- **Left column:** work order number, status chips, started date, total hours, progress, lead technician, service advisor, customer card, vehicle card, fees and discounts
- **Main column:** tabs (Lines · Parts · Notes · Stats · Finance), then a toolbar row (⋮ · assign · **New Line** · **Complete Work Order**), then the lines table
- **Lines table columns:** checkbox · collapse · ⋮ · Name/Description · Actual/Estimate · Progress · Status · **Action** · Rate · Margin · Total
- **Each line expands into:** a **Story** row, a **Labor** row (with a red **Stop** button while running), and **Parts** rows

### 4.1 The parts row — remove the buttons, keep the pills

**Today:** every part row renders a coloured button in the Action column — blue **Receive** when the part is awaiting receipt, blue **Order** when it is awaiting ordering, **Pick** when it is in stock. A line with four outstanding parts shows four buttons, and the same rows repeat on the Parts tab and inside the line card, so the same button appears on three different surfaces.

**Changes:**

- The **Status pill stays exactly as it is** — `Awaiting`, `Auth To Order`, `Request`, `Quoted`. It already sits in its own column, separate from Action. That pill *is* the badge; it is not being built and must not be removed. *(POC-8B.1, R2)*
- **The per-part Receive button goes.** *(POC-8B.2)*
- **The per-part Order button goes**, replaced by one affordance per work order — §4.2. *(POC-6.1)*
- **Pick is out of scope** — leave it alone.
- Receiving or ordering **one** part stays possible from the row's **⋮ more menu**, for the person who deliberately wants a single line. *(POC-8B.4)*

**Result to aim for:** the line in the reference screenshot goes from four coloured buttons to four pills and no buttons, with one affordance above or below the parts group.

### 4.2 One ordering affordance, one receiving affordance

Both sit **with the parts they concern** — not in the top toolbar, which already carries New Line and Complete Work Order. *(POC-6.3, POC-8B.3, closes tracker P-16)*

| Affordance | Appears when | Reads |
|---|---|---|
| Order | ≥1 part waiting to be ordered — therefore **never in Automatic** | `Order all · {n} parts · {m} vendors` |
| Receive | ≥1 part awaiting receipt | `Receive parts ({n})` |

After ordering, confirm what happened: `Ordered {n} parts across {m} vendors.` *(POC-6.3)*

**[PROPOSE]** Placement and scope. These are per work order, but the parts are nested inside lines — so does the affordance sit once above the lines table, once per line, or in a bar that appears when something is outstanding? Bulk actions currently hide in a ⋮ menu and both product and design consider that wrong. *(§6.1)*

**[DON'T]** put either in the top toolbar. In Automatic the ordering one would be permanently absent, leaving a hole.

### 4.3 The line row — three meaningful states, not two

**Today:** green marks a line in progress, grey marks it complete. Both are broken in small ways: the green paints only half the row, and the grey has too little contrast against the page background.

**Changes:** a line now has a third state worth showing — **labor finished, parts outstanding**:

| State | Meaning | Drawn as |
|---|---|---|
| In progress | Work started | green — **fix the half-painted row** |
| `Labor complete · awaiting parts` | Technician done, something in the requirement set outstanding | **[PROPOSE]** — Sasha's instinct: a line should *not* go grey merely because labor is done |
| Complete | Requirement set satisfied | grey — **fix the contrast** |
| Ready for Review | Same, with Require Review on | existing treatment |

**Also worth doing in this pass:** completed lines stay expanded and probably should default to collapsed. Precedent already in the product — the multi-vendor receive screen collapses a vendor once received. *(§6.6)*

**[DON'T]** add a manual status dropdown for a derived state. If a line reads wrong, the requirement set is wrong. *(POC guardrail 9)*

### 4.4 The Stop-working modal — the smallest change with the biggest effect

**Today:** the modal is titled *Stop working on {WO} — {line}* and contains a **`Line Completed?` toggle that is unavailable while the line still has requested parts**, a *What Have You Been Doing On This Line?* textarea, a Department picker, and a **Clock Out** escape at the bottom right.

That disabled toggle is the whole problem. The technician has finished the physical work and cannot say so, so the line stays open and the advisor and foreman chase a person who is not the blocker.

**Changes:**

- The toggle is **relabelled `Labor completed?`** and is **available even when parts are outstanding**. *(POC-5A.1)*
- Turning it on records that the labor is done. **It does not complete the line.** *(POC-5A.2)*
- The tech story requirement is enforced **here**, where the textarea already is. *(POC-5A.6)*
- **[DON'T]** add mileage, VIN or engine hours to this modal. Labor completion asks only what the technician can know; vehicle fields belong to work order completion. *(POC guardrail 10)*

**States to draw:** toggle off · toggle on with no parts outstanding · toggle on **with parts outstanding** (the new case — what does the modal tell the technician will happen?) · tech story required and empty.

### 4.5 The completion modal

**Today:** titled *Complete Work Order* or *Complete & Send to Review*, with a subtitle reading `{work order number} · {customer}` — both already visible on the page behind it. Steps appear as pills. A *Receive Parts* action routes to the receive page and **silently places the purchase orders first**.

**Changes:**

- **Drop the subtitle.** It repeats what is behind the modal. *(closes tracker P-17)* — **[PROPOSE]** whether it stays on small screens, where the modal covers the page and the number is genuinely not visible
- **Ordering step appears only in Manual, and only when something is waiting to be ordered.** In Automatic there is never an ordering step, never a count, never an offer to order. *(R1, POC-7.1)*
- When there is one, it reads `{n} parts have not been ordered yet.` *(POC-7.2)*
- **Ordering must never happen as a side effect of a differently-named action.** If continuing will place purchase orders, say so first. *(POC-7.3)*
- The **receive route stays only when receiving is required**, where it is the gate. When receiving is not required the modal adds nothing of its own. *(POC-8B.6)*
- **`Send to Review` becomes `Ready for Review`** everywhere — primary action, modal title, and the *complete without receiving* action. Nothing is transmitted and nothing is notified; the current wording promises otherwise
- Any **unavailable control states why, on hover and next to itself** — and when several conditions block at once, **all** are listed, not just the first. The receive screen already does this correctly (`This PO still needs: a vendor, an invoice number, …`); copy that shape

**Also on the toolbar behind the modal:** the **Complete Work Order** button says that even when Require Review is on and it cannot complete anything. With review on it should read **`Ready for Review`**, matching the modal.

### 4.6 Moving parts between lines

Dragging a part from one line to another **within the same work order**. This is a new gesture on an operation that already exists in the backend with its own validation — a part that is already staged cannot be moved. Do not build a second path. *(POC-5B)*

- A moved part keeps everything but its line: status, purchase order membership, quantity, cost, sell price, notes
- An invalid drop **says why** rather than silently refusing
- The existing move action stays in the ⋮ menu, so the operation is reachable without dragging
- **[PROPOSE]** valid vs invalid drop target, and the keyboard route

### 4.7 The missing vendor

A part with no vendor **still orders** — it goes onto the work order's purchase order carrying the existing **Vendor Missing** flag, and stays out of QuickBooks until a vendor is assigned. That is existing behaviour and is not changing. *(POC-5.6)*

But in Automatic **nobody is present when that purchase order is born**, so a work order can quietly accumulate parts that can never reach a vendor bill. The page has to say a vendor is still needed — without reintroducing ordering vocabulary an Automatic shop is not supposed to see. **[PROPOSE]** how. *(POC-5.7)*

---

## 5. Surface — Receive screen

Reached from the work order. Three changes only; everything else on this screen is out of scope.

- **Money fields show a currency symbol.** Editable Cost and Sell are plain number inputs today while Tax and every read-only figure in the same table show currency. Use the same shop-currency source those figures already use — not a hardcoded `$`. *(POC-8.4)*
- **Select all / clear all per purchase order.** Rows arrive pre-selected; once a user deselects there is no bulk way back. *(POC-8B.5)*
- **Nothing about money blocks the receive.** A part with an empty or zero **cost** or **sell price** can be received. Every other blocker — vendor, invoice number, invoice date, tax, part number, quantity — stays exactly as it is. *(POC-G3, POC-8.1, POC-8.2)*

---

## 6. The eight things to propose alternatives for

1. **Bulk affordance placement** — where a work-order-level Order all / Receive parts lives, given the toolbar is full and in Automatic the ordering one is never present (§4.2)
2. **Failed auto-order** — in Automatic a failed order leaves one part showing Manual affordances the shop has never seen. Quietest treatment that still makes clear the shop is not at fault (§4.2)
3. **Where the count belongs** in `Order all` — label, beside it, or only in the confirmation (§4.2)
4. **`Labor complete · awaiting parts`** — how it reads against green and grey (§4.3)
5. **Rolled-up status in the work order list** for that same middle state (§3)
6. **Completed rows collapsed by default** — worth it, and how it behaves on refresh (§4.3)
7. **Drag and drop** — valid/invalid drop targets and the keyboard route (§4.6)
8. **Missing-vendor signal** in Automatic, without ordering vocabulary (§4.7)

Plus two small ones: whether the completion modal keeps its subtitle on small screens (§4.5), and how `Receiving skipped` sits next to `Awaiting` without the two competing.

## 7. What must not change

1. No master "Simple Mode" switch — there is none by design, and the settings change what the flow asks for, not whether it exists
2. No third ordering value. A shop that never raises purchase orders is served by Automatic plus receiving not required
3. No new stored status. *Staged*, *Receiving skipped* and *Labor complete · awaiting parts* are labels (R3) — and **Staged must never appear on a part that has not been received**, because it already means "physically on hand and allocated"
4. Do not touch the receiving toggle's label, stored field or behaviour
5. Do not move a part through ordering by writing its status — the real lifecycle has to run, or the demo silently skips vendor bills, part history and inventory movement
6. Line approval still gates completion
7. No per-part Receive or Order button anywhere (R2)
8. Labor completion does not complete the line, and there is no manual override of a derived status
9. No mileage, VIN or engine hours at labor stop
10. Do not redesign the completion modal beyond what §4.5 lists

## 8. Build checklist — every state that must exist

**Settings:** Manual selected · Automatic selected · mid-load with correct defaults

**Work order, Manual:** parts awaiting order (pills, no per-row buttons, one Order all) · parts awaiting receipt (pills, one Receive parts) · both at once · nothing outstanding

**Work order, Automatic:** part just added on an approved line, already awaiting receipt · part on an unapproved line reading `Quoted` · **auto-order failed** — one part awaiting order with Manual affordances present · a part with no vendor

**Line states:** in progress · labor complete with parts outstanding · complete · Ready for Review

**Stop-working modal:** toggle off · on, nothing outstanding · **on, parts outstanding** · tech story required and empty

**Completion modal, Manual:** ordering step present · receive step present because receiving is required · a blocked action listing several reasons at once · nothing outstanding at all

**Completion modal, Automatic:** no ordering step anywhere

**Receive Later:** the deferral route offered · a part reading `Receiving skipped` afterwards, with its receive action still reachable

**Receive screen:** currency on editable money fields · nothing selected after clear-all · a zero-cost, zero-sell part being received successfully

## 9. Traceability

Every rule ID here resolves in the [POC rules](./2026-07-31-simple-flow-poc-rules.md), which carries the full mapping back to the Levers document, the V1 and V2 specifications, and the Jira tickets each change closes — including SV-8779, SV-8438, SV-8495, SV-8427, SV-8540, SV-8467 and SV-8770.

## 10. Change log

| Date | Change |
|---|---|
| 2026-07-31 | Written for the Claude Design build, reorganised from the rule document into the three surfaces the work actually lands on. |
