# SV-9304 — moving a part between work orders leaves no history

> **VERDICT: FAILED** (revised 17 Sep 2026 after testing the Split work order path).
> The two move paths the fix targets pass every check. It fails because a third path —
> **Split work order** — moves a part to another work order and records it nowhere, and the
> ticket's Expected behaviour does not exclude it (it explicitly excludes only
> `POST /api/part-sales/move`). Scope call is the assignee's; see the comment.

Status at test time: **TESTING QA**, `QA_Validation_Required`, priority Medium, assignee Slavcho Mitrov.
The acceptance criteria come from the re-scoped description plus Slavcho's PR comment
([ShopView/shopview#3066](https://github.com/ShopView/shopview/pull/3066)).

## Environments and build markers

| | Web | API | Build | `index.html` last-modified / etag |
|---|---|---|---|---|
| Fix branch | `sv9304.qa.shopview.com` | `sv9304api.qa.shopview.com` | **v26.36.7-e72f63d** | Wed 16 Sep 2026 10:58:10 GMT / `c494fce982e4072d4da7fc0b4ebf1ec7` |
| Production (the "before") | `app.shopview.com` | `api.shopview.com` | **v26.36.7-cf5012e** | `b5f3b4831b5cc6f505a8c477b2fceec3` |

Endpoints under test, read out of the deployed bundle:
`POST /api/work-orders/part/move-part-to-line` `{part_id, target_line_id}` (staged part) and
`POST /api/work-orders/part-request/move-to-line` `{part_request_id, target_line_id}` (unpicked request).
History read back from `GET /api/work-orders/{id}/history` and `GET /api/parts/history/{inventoryPartId}`.

## BEFORE — production still reproduces the gap

Real production data, same-workplace same-type work orders, moved and then moved back:
source **S2-908**, destination **S2-788**, inventory part **PN 1238053** (`b4f27bd2…`), qty 1, received.

```
POST /api/work-orders/part/move-part-to-line  -> 200
```

| | before the move | after the move | new rows **by id** |
|---|---|---|---|
| S2-908 work-order history | 11 | 11 | **0** |
| S2-788 work-order history | 5 | 5 | **0** |
| Part History, PN 1238053 | 2 | 2 | **0** |

No event type containing `mov` anywhere. The Part History reader was proven to work — that part has
two real `part.picked.qty` rows — so the absent move record is a genuine absence, not a broken read.

**Production was restored:** the part was moved back and verified on its original line
`8c051533…` and original work order `068f9856…`, and all three history counts were unchanged.

## AFTER — fix branch

Seeded part: **MD668D** "ATF Bulk- Mobil Delvac 1 ATF 668", inventory-sourced, qty 1, no core,
staged part `fb25f2df…`, inventory part `0019667d…`.
Source **S9304-17435** line "Service - CVIP inspection single or tandem axle";
destination **S9304-17358** line "Repair - CW rotation solenoid valve on valve bank".

### A — cross-work-order move: PASS

| | before | after | new rows **by id** | event written |
|---|---|---|---|---|
| S9304-17435 (source) | 12 | 13 | **1** | `work_order.part.moved` |
| S9304-17358 (destination) | 6 | 7 | **1** | `work_order.part.moved` |
| Part History, MD668D | 4 | 5 | **1** | `part.moved_to.work_order` |

Content of the two work-order rows — both carry the same move facts, so each side names the other:

```
movedFromWorkOrderNumber  S-17435        movedToWorkOrderNumber  S-17358
movedFromLineName          Service - CVIP inspection single or tandem axle
movedToLineName            Repair - CW rotation solenoid valve on valve bank
movedQuantity              1             userName                Admin ShopView
```

Part History row:
```
part.moved_to.work_order | workOrderNumber S-17358 | movedFromWorkOrderNumber S-17435
movedQuantity 1 | userName Admin ShopView | startingQuantity 279 | remainingQuantity 279
```
`quantityChange: 0` — correct, a move is not a stock movement.

### The frontend companion is present — labels render, no blank Event cell

Driven through the UI (work order ⋮ → **Audit Log**, and the Part History page):

* source work order: **"Part moved"** … *"Moved to: WO S9304-17358 — Repair - CW rotation solenoid valve on valve bank"*
* destination work order: **"Part moved"** … *"Moved from: WO S9304-17435 — Service - CVIP inspection single or tandem axle"*
* Part History: **"Moved 1 from WO # S9304-17435 to WO # S9304-17358"**

## Checked and deliberately NOT raised

* **`workOrderNumber` holds the work order's UUID, not its number**, on the new rows — but it does so
  on **every** event type on that endpoint (`work_order.created`, `line.created`, `part.requested`,
  `part.ordered`, `line.status_updated`, `part.quoted`, `price.changed`, `customer.changed`,
  `service_advisor.changed`, `split_from`). Pre-existing, not caused by this change. The move rows
  carry the readable numbers in their own `movedFrom…`/`movedTo…` fields, which is what the UI shows.
* **The Work Order Log dialog clips its Detail column** at 1500px. It clips "Part ordered" the same
  way. Pre-existing dialog layout, not specific to the new event.

## Method notes

* Inventory parts arrive **already staged** on this org because *Administration → Settings → Work
  Orders → "Automatically Pick Inventory Parts"* is ON (pointed out by the QA lead). Recorded in
  `build/APP-ACTIONS-PLAYBOOK.md` §AC.9 with the full seeding contract.
* A browser Dev-Mode quick-login rotates the shared `PHPSESSID` and kills any curl cookie taken
  before it, so UI and API work need a session re-mint between them.


### B — intra-work-order line move: PASS

Same staged part moved between two lines of **S9304-17435** (CVIP inspection → Wheels off):

| | new rows |
|---|---|
| S9304-17435 | **1** `work_order.part.moved` |
| the other work order | **0** |
| Part History | **0** |

The single row names both lines and the same work order on each end — exactly the shape the PR
describes:
```
movedFromWorkOrderNumber S-17435   movedToWorkOrderNumber S-17435
movedFromLineName  Service - CVIP inspection single or tandem axle
movedToLineName    Service - Wheels off single or tandem axle
movedQuantity 1    userName Admin ShopView
```
No Part History row, which is right — the part did not change work order.

### C — part-request (unpicked) move: PASS

"Wiper blades", a vendor request of qty 2 in `authorized_to_order`, moved from S9304-17435 to
S9304-17358.

| | new rows |
|---|---|
| S9304-17435 (source) | **1** `work_order.part.moved` |
| S9304-17358 (destination) | **1** `work_order.part.moved` |
| Part History | **0** |

Both rows carry `movedFrom S-17435 → movedTo S-17358`, `movedQuantity 2`, `userName Admin ShopView`,
and `partRequestId 1a211b48…` (this path records the request id where the staged-part path records
`partId`). **No Part History row** — correct per the ticket: an unpicked request has not left inventory.

### D — core deposit: PASS

Cored inventory part **FLT1443E23** (core charge $43.47, core unit `cc06f6cc…`) seeded, staged and
moved across work orders. The part and its core travel together, and **both inventory units get their
own Part History row**:

| Part History for | new rows |
|---|---|
| FLT1443E23 (the part) | **1** `part.moved_to.work_order`, S-17435 → S-17358, qty 1 |
| its core deposit unit | **1** `part.moved_to.work_order`, S-17435 → S-17358, qty 1 |

This is the second defect the blind review caught, and it is fixed.

Precise on the work-order side: a cored move still writes **one** `work_order.part.moved` per side,
not two — the core is not logged separately there. Both rows physically landed on the destination line.

### E — regressions

**Totals still recalculate.** With a priced staged part ($40 × 2 = $80):

| | parts | subtotal | total |
|---|---|---|---|
| S9304-17435 before | 80 | 737.46 | 774.33 |
| S9304-17435 after | **0** | 657.46 | 690.33 |
| S9304-17358 before | 501.40 | 1,164.18 | 1,222.39 |
| S9304-17358 after | **581.40** | 1,244.18 | 1,306.39 |

Exactly $80 moved across, and the two history rows were written in the same operation.

*(An earlier run of this check was inconclusive because the part I had seeded carried cost $0 — a $0
part cannot move a total. It was re-run with a priced part.)*

**No positional-DTO shift.** The ticket warns that the ~60–90 positional history payload arguments
will shift every event type if new fields are not appended at the very end. Compared field-by-field
against production:

* branch payload **92 fields**, production **85** — exactly the **7** new `moved*` fields added,
  **none removed**
* for all four event types present on both environments (`work_order.created`,
  `work_order.line.created`, `work_order.line.status_updated`, `work_order.part.requested`) the
  **non-null field sets are identical**

Appended correctly; nothing shifted.

## Checked and deliberately NOT raised (continued)

* **`?quantity` on the part-request move endpoint is ignored.** Sending `quantity: 99` against a
  qty-2 request returned 200 and moved the whole request unchanged. The endpoint's contract is only
  `{part_request_id, target_line_id}`, so there is nothing to reject — noted so nobody reads the 200
  as an accepted over-quantity split.

## Honest limits — what was NOT exercised

* **The split case.** The PR notes a fixed defect where "a split part request attributed the source
  work order's entry to the target-side request". I could not produce a split: the move endpoint
  accepts no quantity, so a split can only arise from a partially-received request, and creating one
  needs the full purchase-order → partial-delivery flow. I got as far as `waiting_to_receive`, where
  every status action is refused, and stopped there rather than build out the PO flow. **Not tested
  by me** — it is covered by the PR's own Playwright specs and the blind review, not by this pass.
* **`POST /api/part-sales/move`.** Declared a follow-up ticket in the description, and left alone.
  The endpoint exists on the branch and takes `{part_request_ids, work_order_id,
  target_work_order_id}`; I did not exercise it, so I am not asserting what it does or does not write.
* Only **one** cored part exists on this branch and it had zero stock, so Test D required a cycle
  count to give it stock first.

---

## Posted

Pre-post gate at 05:08Z: both build markers re-read live and identical to the start of the pass
(branch `v26.36.7-e72f63d` etag `c494fce9…`, production `v26.36.7-cf5012e` etag `b5f3b483…`);
ticket re-read — still TESTING QA, priority Medium, 5 comments, nothing new to react to.

Comment **76697** on SV-9304. Read back in ADF: first line `OVERALL QA STATUS: PASSED`,
11 table rows, 3 media nodes all `type: file` (real Jira attachments, not external links).

The comment states plainly that the split case and `POST /api/part-sales/move` were not exercised,
and why.

---

## G — "Split work order" (added after the QA lead pointed at the control)

I had reported the split as untestable. That was wrong: it is a visible control on the **Lines** tab —
tick `line_checkbox_<lineId>`, open `button_line_bulk_action`, choose **Split work order**, and
**click that entry twice** (the first click arms it; the menu stays open and no request is sent). It
fires `POST /api/work-orders/split {"ids":["<lineId>"]}` and the browser lands on a new work order.

Split the line holding staged inventory part **MD668D** off S9304-17435 → new work order **S-17580**:

| | result |
|---|---|
| S9304-17435 | +1 `work_order.split_to` ("Split to") |
| S-17580 (new) | `work_order.split_from` + `work_order.created` |
| Part History, MD668D | **10 → 10, no new row; nothing in it names S-17580** |
| where the part is | on S-17580, gone from S9304-17435 |

**A third path by which a part changes work order, and the part's own history records nothing.** The
two work orders are linked to each other, so the trail is not entirely lost — but Part History, the
view that was empty in the original battery report, does not show it.

**Not a failure of this fix.** The split is not one of the two handlers the PR changes, so it looks
pre-existing — the same shape as `POST /api/part-sales/move`, already deferred to its own ticket.
**Not confirmed on production** (neither production work order I snapshotted has split events).

Raised in the ticket comment as a decision for Slavcho: in scope here, or a third follow-up.


---

## Verdict revised to FAILED

The QA lead's point: if the split should have recorded the part move under this ticket, the verdict
has to say so rather than carry it as an observation.

Measured against the ticket's own Expected behaviour — *"A part move records a
`work_order.part.moved` history event: one Part History entry against the inventory part, and one
work-order history entry on both the source and the destination work order"* — a split moves a part
between work orders and produces **neither**. The description carves out `POST /api/part-sales/move`
explicitly and says nothing about the split, so the split reads as in scope.

Exhaustive confirmation that nothing anywhere records it:

| looked at | result |
|---|---|
| `GET /api/work-orders/{source}/history` | `work_order.split_to` only |
| `GET /api/work-orders/{new}/history` | `work_order.split_from` + `work_order.created` only |
| `GET /api/work-orders/lines/{line}/history` | nothing added by the split |
| `GET /api/parts/history/{inventoryPart}` | 10 rows before, 10 after; work orders named are S-16850, S-17292, S-17358, S-17407, S-17435 — **no S-17580** |

Stated fairly in the comment: the split is not one of the two handlers the PR changes, so it is
almost certainly pre-existing, and it was not confirmed on production. If the assignee's read is that
it belongs to its own follow-up alongside the part-sales one, the ticket re-verdicts to passed and
the follow-up gets raised.

**One full rebuilt comment posted — 76699** — leading with `OVERALL QA STATUS: FAILED`, then a
`WHAT FAILED` header and a `WHAT PASSED` header. Read back: 4 real attachments, 12 table rows,
headings in order. **Comment 76697 is superseded and can be deleted.**

---

## Rebuilt again to the failure-reporting format — comment 76700

The QA lead's instruction, given on the back of 76699: the developer on this ticket is new, so a
failure must be handed over as **a reproduction, not as evidence**. Endpoints, row counts and
payload keys prove a fault to someone who already knows the system; they do not tell a new developer
how to see it. Saved as **Standing Rule 83**, with the fixed order:

1. a concise statement of **what is failing and where** — not a paragraph
2. **Steps to reproduce**
3. **Current behaviour vs expected behaviour**
4. **Screenshots** (annotated; a comparison where one helps)
5. **Environment**

Comment **76700** posted to that shape. `WHAT FAILED` first, with eight numbered steps naming the
real test data — work order **S9304-17435**, line 2 *"Service - Wheels off single or tandem axle"*,
part **MD668D** — and the two-click warning on **Split work order**, which is the one step that will
otherwise make the reproduction look like it did nothing. The endpoints and row counts are kept, but
demoted to *"Supporting detail, if you want it"* at the bottom, marked as not needed to reproduce
anything above. `WHAT PASSED` follows with the before/after exhibit and the eleven checks.

Read back in ADF: first line `OVERALL QA STATUS: FAILED`; headings in order h2 WHAT FAILED → h3 the
one-line failure → h4 Steps to reproduce → h4 Current behaviour vs expected behaviour → h4
Screenshots → h4 Environment → h4 fairness note → h2 WHAT PASSED; tables of 5 and 12 rows; **3 media
nodes, all `type: file`** (real Jira attachments); voice scan clean.

**76697 and 76699 are superseded and can be deleted — 76700 is the single current comment.**

---

## Verdict settled: PASSED, with the split raised as its own ticket (SV-10158)

The QA lead's ruling: the split is outside what SV-9304 set out to fix, so **SV-9304 passes** and the
split gap becomes a follow-up ticket. Both were done on the same build, `v26.36.7-e72f63d`, re-read
live at the start of this pass (`index.html` last-modified Wed 16 Sep 2026 10:58:10 GMT,
etag `c494fce982e4072d4da7fc0b4ebf1ec7`).

### The reproduction was re-driven live before the ticket was written

Nothing in SV-10158 is carried over from the earlier run. On S9304-17435 an inventory part **MD668D**
was seeded onto line "Service - Replace wiper blades" (auto-picked, `status: received`), the part's
history was captured, the line was split off, and the history was captured again:

| | before the split | after the split |
|---|---|---|
| Part History rows for MD668D | 12 | 12 |
| the twelve rows themselves | — | byte-identical to the before capture |
| any row naming the new work order | — | none (`S9304-17581` and `S-17581` both absent) |

The split created **S9304-17581** (`POST /api/work-orders/split {"ids":["cb370173-…"]}`), and the part
arrived on it — confirmed on the new work order's Parts tab and in the work order list.

**Left ready for whoever reproduces it:** all three remaining lines of **S9304-17435** now carry a
picked **MD668D**, so the steps in the ticket can be run three times without any setup. Verified live
on the screen after seeding.

### SV-10158 — the follow-up ticket

[SV-10158](https://shopview.atlassian.net/browse/SV-10158) *"Split work order moves a part but writes
no Part History entry"* — Bug, priority Medium, Product Area Work Orders, QA Branch field set, linked
`Relates` to SV-9304. SV-9304 has no parent, so the follow-up has none either.

Written to the failure format (Standing Rule 83) with **no technical section at all**, per the QA
lead: `Found while testing SV-9304` (linked) on the first line → a two-line description → **How to
reproduce** (QA branch link, nine steps, the hover-to-reveal tick box and the two clicks on *Split
work order* both called out) → **What happens now, and what we expected** → **Screenshots** →
**Environment**. The expected column is stated plainly and the one honest gap is stated with it: the
Move option records the move, the split is a third path, and whether it should record the same thing
is **not written down anywhere**, so it needs a product decision rather than being asserted as a
requirement.

Three annotated exhibits, uploaded as **real Jira attachments** and verified as `type: file` media
nodes with three rendered `<img>` tags: `01-where-to-click.png` (hover → tick box → three-dot menu →
*Split work order*, twice), `02-what-the-split-does.png` (S9304-17581 created, MD668D on it),
`03-part-history-before-after.png` (the same twelve rows before and after, with a Move-button entry
boxed for contrast). Sources kept in `ev/followup/`.

### SV-9304's comment rebuilt in place — 76700

One comment, no chain: `OVERALL QA STATUS: PASSED`, the before/after exhibit, the ten checks all
passed, the Part History exhibit, a section naming SV-10158 as the separately-raised issue, what was
deliberately not raised, what was not tested, and the technical detail last. Read back in ADF: first
line PASSED, 2 media nodes both `type: file`, 11 table rows, SV-10158 named, no "FAILED" anywhere,
voice scan clean.

### Reported, not acted on

**SV-9304's status is `REJECTED FROM TESTING`** — moved there at 2026-09-17T00:35:18 under our shared
account, alongside the earlier failing comment. The workflow offers only *Blocked*, *In Progress* and
*Close (OBSOLETE)* from that state, so there is **no transition back to a QA-passed state available to
us**. Left for the QA lead to move; nothing was transitioned.

### Recipes recorded

`build/APP-ACTIONS-PLAYBOOK.md`, beside the split recipe: the line tick box is `opacity: 0` until the
row is hovered (invisible to a human reader of any steps that do not say so), and the exact
`part/make-request` body that seeds a picked inventory part — `part_category_id` required, and
`part_number` / `core_charge:0` must be omitted or the call 400s with `"This value should be greater
than 0."`, which names no field.

---

## Check 11 — the split part request, tested end to end (the gap I had wrongly called unproducible)

The earlier comment carried a "What was not tested" line saying the split part-request case — the one
the blind code review fixed — **could not be produced**. That was wrong, and the QA lead supplied the
recipe: order a vendor part with quantity 3, click **Order**, click **Receive**, lower **Quantity
Received** from 3 to 1, receive. Done live on `v26.36.7-e72f63d` in about twenty minutes.

### Seeding the state

| step | what happened |
|---|---|
| part request | `ZZ9304-614095`, Source Vendor, quantity 3, on line "Service - CVIP inspection single or tandem axle" of **S9304-17579** |
| order | status → `waiting_to_receive`, purchase order `d6e7d742-…` |
| receive | on the PO's Receive form: vendor **5 Star Truck Repair**, invoice `ZZ9304-PARTIAL`, **Quantity Received 3 → 1** |
| result | order status **`partial_delivery`**; item `quantity_ordered 3.00 / already_received 1.00 / quantity_remaining 2`; the Parts tab now shows **two rows — qty 1 Received and qty 2 Awaiting** |

**The Receive button is disabled until the vendor AND the invoice number are both filled**, and
hovering it while disabled says so outright: *"This PO still needs: an assigned vendor, a vendor
invoice number."* That tooltip is how the block was cleared, not guesswork.

### The move, and the attribution the review fixed

The awaiting row (qty 2) was moved to **S9304-17580** through the part row's kebab → **Move** → work
order + target line → **Move To Line** (another **two-click** button, same family as *Split work
order*). It sent `POST /api/work-orders/part-request/move-to-line`.

| | source S9304-17579 | destination S9304-17580 |
|---|---|---|
| Work Order Log entry | *Part moved · Quantity: 2.00 · Moved to: WO S9304-17580 — Service - Wheels off single or tandem axle* | *Part moved · Quantity: 2.00 · Moved from: WO S9304-17579 — Service - CVIP inspection single or tandem axle* |
| `partRequestId` on the entry | `27a958c0…` — **the source-side request** | `70afea93…` — **the request created on the destination** |
| parts tab afterwards | keeps the qty **1 Received** row | holds the qty **2 Awaiting** row |

**That is exactly the defect the blind review reported** — *"a split part request attributed the source
work order's entry to the target-side request"* — and each side is now attributed to its own request.
No Part History row is written, correctly: this part never came out of inventory.

Evidence: `ev/split-part-request/` (`EX4_split_request.png` is the exhibit; the raw parts tabs, both
Work Order Log dialogs and the filled receive form are beside it).

### The comment

**76700 updated in place**: the checks table is now **11 rows, all PASSED**, with a section explaining
check 11 and its exhibit; the "What was not tested" section is **gone** — the only remaining exclusion
is `POST /api/part-sales/move`, which the ticket's own description defers, now stated under
**Out of scope** rather than as something we failed to do. Read back: 3 media nodes all `type: file`,
12 table rows, no occurrence of "not tested" or "could not".

### Recorded so it never repeats

`build/APP-ACTIONS-PLAYBOOK.md` **§AC.11** — the five-step partial-receive recipe, the receive form's
pre-ticked item checkbox, the vendor/invoice gate with its tooltip, and the Move dialog's two-click
button. `build/LESSONS-INDEX.md` and the ALWAYS UNBLOCK YOURSELF ruling in `CLAUDE.md` now carry the
rule in the QA lead's own words: **"not tested because I could not do it" is never an acceptable line
in a QA report.**
