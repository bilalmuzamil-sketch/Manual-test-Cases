# SV-9828 — Vendor return: partial quantities lose their fraction — QA findings (7 Oct 2026)

**Ticket:** [SV-9828](https://shopview.atlassian.net/browse/SV-9828) · Bug · Medium · TESTING QA · assignee parth fadadu · reporter Dusan Bulovan · no parent, no links. Found while tracing SV-9681.
**Expected behaviour (source):** Chris Ward, comment **77578** (29 Sep): item 1 — *"Partial quantities lose their fraction. Returning 2.5 gallons takes only 2 off stock … Fix: take the exact returned quantity off stock, decimals included."* · check: *"return 2.5 of a part to a vendor, and on-hand stock drops by exactly 2.5."* · item 2 — *"Stock may still be overstated from single-item returns made while the old bug was live … Find the parts affected and send the list to Support."*
**QA handoff:** Parth, comment **77605** — use **Receive Credit for a core return** (bug path); **Create Return → Save Return** is the control and must stay exact; item 2 *"has no UI repro. It needs a data query."*
**PR:** ShopView/shopview#3372 (open), fix commit `9cc1f92` (+ merges of main `a6880ac`, `71ec2f7`, `a4b34da`). Changes: `UpdateInventoryWhenPartGetsReturnedToVendor` (exact deduction, default + named bins), `UpdateInventoryPartWhenReturnGetsDeleted` (exact restore), `AddReturnItemCommand` (no truncation). Item 2 explicitly not in the PR.
**AFTER build:** `sv9828.qa.shopview.com`, front end `v26.40.8-71ec2f7` (last-modified Wed 07 Oct 2026 08:35:19 GMT).
**BEFORE (Rule 86):** production `app.shopview.com`, `v26.40.10-9b663ae`.

## Set-up (per-ticket branch, no clean-up)
P550848 (FUEL/WATER SEPARATOR, vendor Hester & Sons) had no core on the branch → given one with `inventory/parts/change {…, core:true, core_charge:25}`; core part `b919e7ca…` (same vendor, 6 on hand). Work orders seeded by API (customer 4 Star Truck Repair, canned line *Service - Battery service*); **everything under test clicked on screen**: inline Add Part (qty), **Pick**, core **Ok**, Parts → Returns tick → **Receive Credit** → Credit Memo # → **Post Credit**; **Create Return → Save Return**; **Cancel Return → Yes**.
**Core stock is not shown on any screen** — core parts are not listed in Parts → Inventory on the branch **or on production** (5 cored production parts checked, none of their cores listed), and the part edit window shows only *Core Charge*. Core stock was therefore read from the part record (`GET /api/inventory/parts/{coreId}`). Main-part stock is shown on screen as the Inventory badge *"N Available"*.

## Results — branch (`v26.40.8-71ec2f7`)
| # | Path | Work order / part | Returned | Stock before → after | Change | Result |
|---|---|---|---|---|---|---|
| 1 | Receive Credit, core return | S9828-17580 / P550848 core | 2.5 | 6.00 → 3.50 | −2.5 | PASS |
| 2 | Receive Credit, core return | S9828-17581 | 0.5 | 3.50 → 3.00 | −0.5 | PASS |
| 3 | Receive Credit, core return | S9828-17582 | 1.25 | 3.00 → 1.75 | −1.25 | PASS |
| 4 | Receive Credit, core return (whole number) | S9828-17583 | 3 | 1.75 → −1.25 | −3 | PASS |
| 5 | Receive Credit, received qty edited to 1.5 of 2.5 | S9828-17584 | 1.5 | −1.25 → −2.75 | −1.5 | PASS |
| 6 | Create Return → Save Return (control), screen badge | MD668D ATF bulk | 2.5 | **20 Available → 17.5 Available** | −2.5 | PASS |
| 6b | Create Return of a part WITH a core adds two rows (part + core) | P550848 | part 1 / core 2.5 | main 20 → 19, core −2.75 → −5.25 | exact both | PASS (my first attempt typed 2.5 into the core row; quantity box is `input_return_qty_0_0` once a part is chosen) |
| 7 | Cancel a manual return (restore) — via `POST /api/part/manual-return-request/{id}/cancel` | MD668D | 2.5 | 17.5 → 20 | +2.5 | PASS (back end; the screen button sends nothing — see below) |
| 8 | Delete a completed vendor return — `POST /api/inventory/returns/delete {id}` (no screen) | core + MD668D | 1.5 / 2.5 | core −5.25 → −3.75, MD668D 17.5 → 20 | +1.5 / +2.5 | PASS (back end only) |
| 9 | Add a single item to an existing return (original bug) — `POST /api/inventory/returns/add-item {return_id, quantity, inventory_part_id}` (no screen) | MD668D | 2.5 | 20 → 17.5; item stored as 2.50 | −2.5 | PASS (back end only) |
| 10 | Picking a 2.5 part | P550848 | 2.5 | 6 → 3.5 | −2.5 | exact (not this ticket, recorded) |

Not applicable: a non-core inventory part has no Return in its ⋮ menu (only *Move* / *Add Part Fee / Discount*), so Receive Credit only moves stock for core returns.
Back-end probe side effect: `add-item` with only `return_id` + `quantity` returned 201 and stored a part-less 2.50 item on return ZZE (matches the PR's deferred "no validation" note); the return was later deleted.

## Production BEFORE (bug reproduced on screen)
Work order **S2-963** (Trucks Hill 2, customer *aa*), part **1238214 (A428)** at quantity 2.5, Pick, core **Ok**, Returns → **Receive Credit** showed *Received quantity* **2.50** → Post Credit → core **32 → 30 (−2)**. Evidence `ev/prod/confirm.png`, `ev/prod/result.json`.

## ⚠️ Observation for the QA lead — Cancel Return does nothing (production and branch)
Parts → Returns → ⋮ on a **Manual** return → **Cancel Return** → dialog *"Warning! This will permanently delete the return…"* → **Yes**: the dialog closes, **no request is sent**, no message, the row stays, stock unchanged. Front-end code says Yes should call `POST part/manual-return-request/{id}/cancel` and toast *"Manual return cancelled successfully"*. Reproduced on **production `v26.40.10-9b663ae`** (ZZT-FIB-1002, 7 → 4.5 after Create Return; Cancel Return → still 4.5) and on the branch (MD668D). The endpoint itself works (row 7). **SV-9498** (customer E2 Trucking, cancel manual returns) was **QA-passed by us on 10 Sep** when the button worked → this looks like a **regression**. Not caused by SV-9828 (PR is back-end only). Bucket: (a) confirmed defect, already-closed ticket SV-9498 covers the symptom. **Raised with the QA lead before any ticket.**

## Production clean-up (restore-after)
Manual return cancelled via endpoint (ZZT 4.5 → 7); vendor credit **ZZ9828PROD** deleted (`inventory/returns/delete`, core 30 → 32); part removed from S2-963 (main 27.5 → 30); S2-963 deleted (re-read → 400). Removing the part also added 2.5 to the core (34.5) — corrected with a cycle count. **Final: main 30 = 30, core 32 = 32, ZZT-FIB-1002 7 = 7.** Location left at Trucks Hill 2.

## Branch state left
P550848 now has a core (b919e7ca…); stock values moved by the tests; work orders S9828-17580…17585; credits ZZB–ZZD remain (ZZE deleted). Per-ticket branch, no clean-up.
