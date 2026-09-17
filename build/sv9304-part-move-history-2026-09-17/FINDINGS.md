# SV-9304 — moving a part between work orders leaves no history

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
