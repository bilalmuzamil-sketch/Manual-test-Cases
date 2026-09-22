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

## §2 — PRODUCTION: the boundary is exactly $1,000.00

Five values, each entered into Average Cost and saved, then the part saved a second time with **only
the Min value changed**. Read off the Inventory page list each time; `purchasePrice` captured off the
wire on every save.

| Entered | After the first save | After ONE unrelated save | Payload on the 2nd save | Verdict |
|---|---|---|---|---|
| `999.99` | `$999.99` | **`$999.99`** | `"999.99"` | survives |
| `1000.00` | `$1,000.00` | **`$1.00`** | `"1,000.00"` | collapses |
| `1234.56` | `$1,234.56` | **`$1.00`** | `"1,234.56"` | collapses |
| `3896.04` | `$3,896.04` | **`$3.00`** | `"3,896.04"` | collapses — the reported case |
| `12345.67` | `$12,345.67` | **`$12.00`** | `"12,345.67"` | collapses |

**Every save re-sends the field as a quoted string** — `"999.99"` just as much as `"3,896.04"`. The
string is not the fault; the **thousands separator inside it** is. Below `$1,000` the displayed text
has no comma and survives the round trip untouched. At `$1,000` and above it does, and what is stored
is the part before the comma: `12,345.67` → `12`.

So the defect is precisely: **any inventory part whose Average Cost is $1,000 or more loses all but
its thousands digits the next time that part is saved for any reason at all.**

That also settles why two months of triage could not reproduce it. Chris Ward wrote *"I cannot
replicate this … possibly a previously entered value"*. Entering a cost and checking it always looks
right — it is the **second, unrelated save** that does the damage, and nothing in the report pointed
at one.

## §3 — FIX BRANCH (AFTER): all five values survive, and the payload is a number

Environment `sv9940.qa.shopview.com`, build **`v26.36.9-e96da48`**, part
`000657fe-522f-4c3f-9680-621c5449e2bd`. Identical script to §2 — same five values, same
"save again changing only Min", same reading off the Inventory page list.

| Entered | After the first save | After ONE unrelated save | Payload on the 2nd save | Verdict |
|---|---|---|---|---|
| `999.99` | `$999.99` | `$999.99` | `999.99` | survives |
| `1000.00` | `$1,000.00` | **`$1,000.00`** | `1000` | **survives** |
| `1234.56` | `$1,234.56` | **`$1,234.56`** | `1234.56` | **survives** |
| `3896.04` | `$3,896.04` | **`$3,896.04`** | `3896.04` | **survives — the reported case** |
| `12345.67` | `$12,345.67` | **`$12,345.67`** | `12345.67` | **survives** |

**Ten saves, ten numeric payloads, zero quoted strings.** On production every second save carried
`"3,896.04"`; on the branch it carries `3896.04`. The screen now sends the value rather than the text
it is displaying, so there is no separator to truncate at.

The `999.99` row is the regression control: it was never broken and is still correct, so the change
has not disturbed values below the threshold.

## §4 — The RECEIVING path: the reporter's actual flow

The reporter did not describe editing the part. They described a **vendor-invoice receipt**, so the
receiving path had to be examined on its own rather than assumed to be covered.

**(a) The receive screen has no cost field at all.** Driving
`/order/{id}?receive=1` on the branch and dumping every control: the editable inputs are the **vendor
invoice number**, the **invoice date**, a **Quantity Received** box per line, and **Tax**. The Cost
column is **read-only display text** (`$20.69000`, five decimals), carried from the purchase order.
Full dump: `ev/recv-form.json`.

That matters directly: the §1/§2 defect is a form re-submitting a *displayed, formatted* value. **The
receive screen has no cost value to re-submit**, so it cannot introduce a thousands separator, and the
truncation cannot arise on this path.

**(b) Receiving with a cost above $1,000 in play.** No purchase order on the branch had a line at or
above $1,000, so the condition was seeded instead of skipped: part **CS-RB-268**
(`ecaae871-…`, 1 unit at `$20.69`) had its Average Cost set to **`$3,896.04`** through the now-fixed
dialog, and then its purchase order (13 units at `$20.69`, vendor **Mobile Truck & Trailer Repair
Hampton**) was received against vendor invoice **`ZZAUTOTEST8447`** — `POST /api/inventory/orders/accept`
→ **201**.

| | Average Cost | Quantity |
|---|---|---|
| before | `$20.69` | 1 |
| after setting the cost | **`$3,896.04`** | 1 |
| after receiving 13 at `$20.69` | **`$747.32`** | 14 |

**The $3,896.04 was not truncated by the receipt** — no `$3.00`, no `$3,896.04 → $3`. The value went
into a recalculation, which is what receiving is supposed to do.

**(c) Part History records the cost correctly** — exactly as the customer reported it does:

```
Received | Mobile Truck & Trailer Repair Hampton - ZZAUTOTEST8447 | Bin: D2B | Starting qty: 1 | New qty: 14 | Qty change: 13
Average cost updated | Original cost: $20.69 | New cost: $3896.04 | Original sell price: $38.32 | New sell price: $5126.41
```

Full capture: `ev/history.txt`.

**(d) This also settles §1b — the sell price following the cost is BY DESIGN, not a defect.** Part
History logs the sell-price change as part of the same "Average cost updated" event, with both the old
and new sell price named. It is deliberate, logged behaviour. **The §1b hypothesis is withdrawn**, and
it is not raised as a finding.

## §5 — The $747.32 figure: chased down, and it is the data, not the build

§4(b) left one number unexplained. A naive weighted average of 1 unit at `$3,896.04` and 13 at
`$20.69` is `$297.50`, and the build produced **`$747.32`**. That was not left as a loose end.

**A second, clean receipt was run on purchase order `I9940-1390`** (Stillwater Diesel Repair, invoice
`ZZAUTOTEST8447B`), covering four parts — three with **zero** starting stock and one with existing
stock, so the formula could be read off directly:

| Part | Starting qty | Received | PO cost | Resulting Average Cost | Weighted average | |
|---|---|---|---|---|---|---|
| `66432` | 0 | 5 | `$1.34` | **`$1.34`** | `$1.34` | exact |
| `66433` | 0 | 5 | `$2.11` | **`$2.11`** | `$2.11` | exact |
| `66434` | 0 | 5 | `$4.19` | **`$4.19`** | `$4.19` | exact |
| `3111` | 4 (at `$3.25`) | 10 | `$2.97` | **`$3.05`** | (4×3.25 + 10×2.97)/14 = `$3.05` | exact |

**The averaging is exact to the cent in all four.** So the formula is sound and receiving is not
mis-handling cost.

**What produced `$747.32` is arithmetic on that one part's stock.** Solving
`(x × 3896.04 + 13 × 20.69) / (x + 13) = 747.32` gives **x = 3.0000** exactly: the calculation used an
opening quantity of **3**, while the Inventory list displayed **1 Available**. CS-RB-268's own history
explains where a 3 comes from — it carries `Cycle Count | Qty: 3 → 1 (-2)` and `Cycle Count | Qty: 1 →
3 (+2)` on the same minute, and a pick recorded against `Bin: Unassigned | Starting qty: 0 | Remaining
qty: -2`. A displayed total that nets a negative unassigned row against a positive bin will not equal
the quantity the valuation walks.

**This is reported as an observation, not a defect, and deliberately not raised as one:**
- it is **not** what SV-8447 reports (that ticket is a truncation, and the customer's receipt and part
  history were both correct);
- **no document states the intended formula**, so there is no requirement to judge it against
  (Standing Rule 57);
- and it sits in **server-side valuation**, which a front-end number-formatting change cannot reach —
  so it is neither caused nor fixed by SV-9940.

It is written down here so it is visible rather than silently dropped, and it is the one thing in this
pass I would want a second opinion on before anyone calls it fine.

## §6 — Verdict

**SV-8447 PASSES on `sv9940.qa.shopview.com` (build `v26.36.9-e96da48`).**

- The reported symptom — Inventory page Average Cost reading **`$3.00`** where the receipt said
  **`$3,896.04`** — **reproduces on production** and **does not reproduce on the fix branch**.
- The trigger is now understood and stated: not entering the cost, but **saving the part again
  afterwards**, for any reason, at **$1,000 or more**.
- The cause is proven off the wire on both builds: production re-submits `"3,896.04"`, the branch
  sends `3896.04`.
- The receiving path the customer described is **not a route for this defect** — the receive screen
  has no cost field — and receiving computes average cost exactly.
- The under-$1,000 control (`999.99`) is unchanged, so nothing below the threshold was disturbed.

**Honest limits.** Two parts of this pass are worth stating plainly: the `$747.32` observation in §5 is
unadjudicated for want of a documented formula; and the receive comparison was run on the branch only,
because the receive screen carries no cost input, making a production receive incapable of showing the
reported truncation either way.

