# SV-8447 — Inventory page shows Average Cost as $3.00 instead of $3,896.04

**Ticket:** [SV-8447](https://shopview.atlassian.net/browse/SV-8447) · status **TESTING QA** · priority Low ·
reporter Ryan Fyfe (PowerTools, source-intercom) · assignee Dusan Radulovic ·
created 2026-07-20 · updated 2026-09-22T08:00:32-0500.

**Links:** `Fixed by` **SV-9940** · `relates to` **SV-9192**.

## §0 — Sources, read live at pass start

Read live over the Jira REST API at 2026-09-22 (~14:30 UTC), not from memory.

**The customer's report (verbatim from the description):**
- Customer **Brian Orban**, **Midwest Diesel Service of Alpena**, 9 users.
- Part **DD16 CYLINDER HEAD W/VALVES**, part number **DCWHDT47304VS**.
- Vendor invoice **M0000144843 (Superior Turbo And Injection)**.
- *"Received cost (from vendor invoice): $3,896.04"*
- *"Part history when received: correctly reflects $3,896.04"*
- *"Inventory page display: Average Cost incorrectly shows $3.00"*
- **Steps to Reproduce: "1. Unable to replicate"**
- Expected: *"Inventory page should display Average Cost = $3,896.04 … consistent with the vendor
  invoice and part history."*

**Comment history (3 comments, all read):**
1. Chris Ward, 21 Jul — *"please look and try to replicate."*
2. Chris Ward, 27 Jul — *"I cannot replicate this, this appears to be a low-priority issue due to a
   previously entered value (or possibly a fixed issue). Please triage as you see fit. Customer looks
   to be unblocked."*
3. Dusan Radulovic, 16 Sep — *"This one is fixed by: SV-9940"*

**What the report tells us that matters for the test.** The reporter's own evidence says the
**receipt stored the right cost** (*"Part history when received: correctly reflects $3,896.04"*) and
only the **Inventory page Average Cost** was wrong. So the corruption is in the average-cost field
itself, after a correct receipt — not in the receiving arithmetic. That is the hypothesis this pass
has to prove or disprove, on both paths.

**There is no `sv8447` QA branch** (DNS does not resolve). The QA lead confirmed the branch to test on
is **`sv9940.qa.shopview.com`**, the branch of the ticket that claims the fix.

## §0b — Environments and build markers (read live)

| Environment | URL | Build marker | index.html last-modified |
|---|---|---|---|
| BEFORE (pre-fix) | `app.shopview.com` | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT |
| AFTER (fix branch) | `sv9940.qa.shopview.com` | **`v26.36.9-e96da48`** | Tue, 22 Sep 2026 12:52:44 GMT |

Production is the BEFORE per Standing Rule 86.

## §0c — What "Average Cost" is

The Inventory page (`/parts/inventory`) carries an **Average Cost** column — the reporter's exact
surface. Its stored field is `purchase_price` on the inventory part, and the edit dialog's control is
`input_average_cost`, sent in the save payload as `purchasePrice`.

## §1 — PRODUCTION (BEFORE): the customer's reported symptom reproduces exactly

Environment `app.shopview.com`, build **`v26.36.9-8d1613f`**, test org `72b2cc90…`, part
**1237944 / "A158"** (workplace `b617914c…`, part id `0085fddf-7299-49aa-b2f4-c40c98fbce71`).
Driven through the screen: Inventory page → the part's edit dialog → Save; the Average Cost was read
**off the Inventory page list column**, which is the surface the customer names.

| # | Action | Average Cost on the Inventory page | Screenshot |
|---|---|---|---|
| 0 | baseline | `$10.00` | `ev/p0-baseline.png` |
| 1 | enter **3896.04** in Average Cost, Save | **`$3,896.04`** — correct | `ev/p1-set.png` |
| 2 | reopen, change **Min 5 → 4** only, Save | **`$3.00`** — the reported number | `ev/p2-broken.png` |

**Step 2 touched nothing but Min.** The Average Cost was not edited, and it still changed from
`$3,896.04` to `$3.00` — which is the customer's report word for word: *"Inventory page displays
Average Cost = $3.00 even though the receipt/vendor invoice and part history reflect $3,896.04."*

**The mechanism, captured off the wire on the two saves:**

```
save #1 (typed the value)      "purchasePrice":3896.04      ← a NUMBER, stored correctly
save #2 (only Min was changed) "purchasePrice":"3,896.04"   ← the formatted DISPLAY STRING
```

On the second save the screen re-submits the field as the text it is displaying. Once the value is
over one thousand that text carries a **thousands separator**, and the server reads the number up to
the comma — `"3,896.04"` becomes `3`. That is exactly `$3,896.04 → $3.00`, and it is the same fault
as SV-9940's `$1,069.03 → $1.00`.

**This also explains why nobody could replicate it for two months.** The reporter's steps say *"1.
Unable to replicate"* and Chris Ward wrote *"I cannot replicate this … possibly a previously entered
value"*. He was close: the trigger is not entering the cost, it is **saving the part again for any
other reason afterwards** — and only for values of $1,000 or more, because below that the displayed
text has no comma in it. A tester who typed a cost and checked it saw the right number and moved on.

## §1b — A side effect I caused on production, and what it tells us about the blast radius

Driving the reproduction changed a field I had not intended to touch, and I am recording it here
rather than quietly putting it back.

At baseline the Inventory list showed this part's Sell Price as **`$300.00` with a "Fixed Sell Price"
marker**. After the save sequence it read **`$100`** with the marker gone; the API confirmed
`sell_price` 300 → **100** and `is_fixed_price` true → **false**.

The part edit dialog has **no "Fixed Sell Price" control** (the dialog's only inputs are Average Cost,
Sell Price, Core Charge, Min, Max, the bin rows and the four selects — dumped live). The consistent
reading is that **changing Average Cost recalculates Sell Price from a markup** — cost `10.00` × 10 =
sell `100.00` — and a recalculated price is no longer a "fixed" one.

**Why this matters for SV-8447 rather than being an aside:** if Sell Price is derived from Average
Cost, then the silent truncation in §1 does not only misstate valuation — it drags the **selling
price** down with it. A part received at `$3,896.04` whose average cost collapses to `$3.00` would
carry a sell price computed from `$3.00`. That is a pricing exposure, not just a reporting one.

**This is stated as a hypothesis, not a verdict.** It has not yet been isolated on a clean part with a
single variable changed, and it is not what SV-8447 reports. It is carried into the branch testing to
be settled there.

