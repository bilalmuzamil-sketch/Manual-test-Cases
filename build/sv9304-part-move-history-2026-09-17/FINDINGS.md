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
