# SV-10200 — returning picked parts credits inventory twice. PARTIAL — stopped on the QA lead's instruction.

**Status: STOPPED mid-test at the QA lead's request — he verified it manually. This is not a verdict and
must not be read as one.** Recorded because the fixture is built and the evidence up to the stopping
point is real.

**Branch** `sv10200.qa.shopview.com`, build **`v26.36.8-7ee41e7`**, last-modified Tue 22 Sep 08:39:18
GMT, etag `c08ab446feff11fd63a034820cd70aa5`. Organization `d55bc308…`, signed in via Quick login → Admin.

## The plan I was following

The **ticket description** (Ashton Selleck, Selleck Truck & Trailer, WO S-257) reports a single return of
3 batteries writing **two** `Returned` ledger rows, taking on hand 9 → 12 → **15**.

**Dipesh's handoff comment narrows the cause and gives the repro**: a part with a core charge puts two
lines on the work order — the part and its core — and *"editing the part request made the core line point
at the same item as the part line"*, so a return credited that one item twice. His steps: inventory part
with a **core charge**, stock 12 → add to a **service** work order line, qty 3 → **edit the part request
from the Lines tab and save** (the step that used to break it) → **pick** → **return** → Parts → Part
History. Expected: one `Picked` row 12 → 9, **one** `Returned` row 9 → 12, on hand back to 12. He also
notes the bug only affects parts **with** a core charge.

## What was completed, live

| step | result |
|---|---|
| Inventory part with a core charge, stock 12 | **P550848** `000657fe…`, core charge **$25**, quantity **12**, bin **H3B**. Setting the core charge also gave it a `core_part_id` (`1135bf37…`) — the second inventory item the bug is about |
| Service work order + line | **WO** `2f4b4728…`, line `1dd1e9a1…` |
| Inventory part on the line, qty 3 | request `f8ad0490…`, source inventory, core charge 25 |
| **Edit the part request from the Lines tab and save — twice** | done through the screen: the part-number cell opens the Edit Part Request dialog (`dialog_part`; `input_part_cost` is **disabled** for an inventory part, so the quantity was edited via `input_bin_quantity_<bin>`), quantity 3 → 4 → 3. Both saves posted **`POST /api/work-orders/part/change-request` → 200** |
| **Pick** | `POST /api/work-orders/part/perform-request-status-action` → **201**. Stock **12 → 9** ✓, and the core line appeared on the work order (*"Core for FUEL/WATER SEPARATOR…"*, with Ok / Not Ok) |

## The one thing worth keeping — the two lines point at DIFFERENT inventory items

Read live from the work order after the edit-and-save and the pick:

```
PART b6c8dadd-ac6f-4d9f-b105-e50821c88f5f | FUEL/WATER SEPARATOR …  | qty 3 | is_core False | INV_ID 000657fe-522f-4c3f-9680-621c5449e2bd
PART 7cedc2f7-4392-4323-b288-1a682b47b727 | Core for FUEL/WATER SEP… | qty 3 | is_core True  | INV_ID 1135bf37-2370-4992-80e7-3c4e50850e47
```

**Two different `inventory_part_id` values, after exactly the edit path that used to collapse them into
one.** That is the corruption Dipesh describes, and it is not present here. **It is not a pass** — the
return itself was never performed and Part History was never read, which is where the duplicate row would
show. It is one supporting observation, stopped one step short of the assertion.

## Where it stopped

At the work order's **Parts** tab (`/workorders/{id}/part-requests`, reached by clicking
`link_part_requests_tab` — the bare `/parts` URL renders an empty shell), looking for the Return control.
The picked part's kebab on the Lines tab offers only *Move* and *Add Part Fee / Discount*; the core row's
offers only *Core OK*. The customer's own steps complete the line and invoice before returning, so the
Return action most likely appears after that.

## Not done

Steps 5 and 6 — **the return, and reading Part History** — plus the regression check on a part **without**
a core charge, and the double-submit idempotency angle the ticket description raises. No comment was
posted on the ticket and nothing was filed.

## Environment left as-is

Per-ticket QA branch, so nothing was cleaned up. The fixture is intact and one step from the return:
WO `2f4b4728…`, part **P550848** picked qty 3, stock at **9**.
