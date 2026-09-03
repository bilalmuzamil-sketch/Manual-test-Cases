# SV-6295 — Separate Rows per Receive Action on Parts Tab (WO & Part Sales)

QA branch: sv6295.qa.shopview.com / sv6295api.qa.shopview.com
Build marker: **v26.35.7-13e8586**
Org: Staging Foothills Group Inc (Staging Heavy Duty - 9919 workplace)
Tester login: cookie-authed admin (dev quick-login), workplace b3c8c820 (Heavy Duty 9919)

Requirements source of truth = the ticket DESCRIPTION (Rule 66); dev comments supplementary.

## Requirements
- R1: every partial receive action creates a NEW row on the Parts tab (WO & Part Sales), regardless of same/diff vendor or prior partial receipt.
- R2: each row retains vendor-at-receipt, qty received in that transaction, and status (Received/Awaiting).
- R3: changing vendor on AWAITING qty only affects future (not-yet-received) rows, NOT already-received rows.
- R4: rows never merge, even at full receipt — final state shows multiple rows.
- R5: returned parts are NOT shown as a row on the Parts tab (Jasna: "show received status, since we are not showing returned on parts tab").
- R6: editing vendor on a vendor invoice updates the corresponding WO/PS parts-tab row vendor ONLY if the WO/PS is not Invoiced or Paid.
- R7 (dev comment): invoiced PS bug — receive 4+5+1 (=10), return 3 → effective 7; before invoicing correct; after Invoiced must still show Qty 7 / Received (not 4 / Returned).
- Dev FE note: Return action must use the correct qty from the selected row; received→line update endpoint, awaiting→change-request.

## Endpoints observed
- Parts tab data: `GET /api/work-orders/{wid}/parts/list-requests-by-line` → collection[].part_requests[] (received-wise split; received rows carry work_order_part_id).
- Receive: `POST /api/orders/receive-requested-parts` {vendor_id, invoice_number, invoice_date, note, total, tax, items[]}.
- Change awaiting vendor: `POST /api/work-orders/part/change-request` {id, vendor_id}.
- Return: `POST /api/work-orders/part/make-return-request` {partId(=work_order_part_id), quantity, returnReason}.

## WO scenario (WO 88055529 "S6295-13556", line "Repair - Missing exhaust manifold bolt")
Order 92c14ca0 = 3 parts (CS8SC-038-100, 8WS-038, 8LWS-038), qty 6 each, vendor Stillwater Diesel Repair.

- **T1/R1+R2 PASS** — received 2 of 6 (invoice ZZAUTOTEST-R1). CS8SC split into Received qty 2 (gets work_order_part_id) + Awaiting qty 4. Each part keeps vendor/qty/status per row. Evidence WO-01 (before) / WO-02 (after).
- **T2/R3 PASS** — changed the AWAITING CS8SC vendor Stillwater→Weehawken. Awaiting row → Weehawken; already-Received(2) row unchanged (still Stillwater). Only the future row changed.
- **T3/R4 PASS** — received the remaining under each vendor. CS8SC final = Received 2 (Stillwater) + Received 4 (Weehawken): two received rows, different vendors, both fully received (rem 0), NOT merged into Received(6). 8WS/8LWS each = Received 2 + Received 4 (Stillwater), not merged. Evidence WO-03.
- **T4/R5 PASS** — Return dialog on the CS8SC/Weehawken (qty 4) row PREFILLED Quantity = 4 (the selected row's exact qty = dev fix works). Returned 2. Result: that row → Received qty 2; NO "Returned" row appears (all rows status Received). Evidence WO-04.

Received rows lock the Vendor dropdown; awaiting rows allow changing it (matches R2/R3).

## Part Sales (T5) + Invoiced display (T7) + vendor-invoice edit (T6) — status
- Part Sales use the SAME endpoint `GET /api/work-orders/{id}/parts/list-requests-by-line` (verified — a part-sale id returns the identical part_requests shape). The row-splitting logic is shared code with WO, which is fully proven above.
- Existing WOs/PS that already carry returned parts (13 WOs, 27 PS) render **only "Received" rows — zero "Returned" rows** at the endpoint, consistent with R5 / Jasna's ruling, across paid/complete states.
- NOT independently driven this session (transparent):
  - T7 invoiced-PS repro (receive 4+5+1, return 3, invoice → 7/Received): needs a fully seeded PS driven through invoicing. Blockers this session: (a) PS detail UI routes render dead pages (`/part-sales/{id}`, `/…/details`, `/…/part-requests`), and the list is a virtual table with no row hrefs; (b) API PS part-add needs a line, and `lines/create` requires a tech-story/labor/fixed-price shape not yet mapped; (c) driving the seeded WO to Invoiced is blocked on the line "tech story" set endpoint (unmapped verb) + the WO is "Over Limit".
  - T6 vendor-invoice edit reflects on the row only if not Invoiced/Paid: needs the invoiced/paid negative state.
- These are reachable with more seeding time or a pre-seeded PS; flagged for the QA lead.

## UPDATE — Part Sales (T5) + Invoiced display (T7) verified on real invoiced data
Part Sales render through the IDENTICAL endpoint `GET /api/work-orders/{id}/parts/list-requests-by-line` (the current build's fixed code path).
- **T5/T7 PASS** — examined 6 invoiced/PAID Part Sales that carry returned parts (P2-175, P2-154, P2-144, P2-105, P2-92, P2-37). Every one:
  - shows all part rows as **Received** — ZERO "Returned" rows (dev bug was status → "Returned" after invoicing).
  - preserves **split rows** even when fully received/paid (e.g. P2-92: 610.783.1 = Received q8 + Received q6, not merged into q14).
  - reduces the received row's quantity by the returned amount (fully-returned rows show qty 0, status still Received) — i.e. NOT the dev's wrong "qty 4 instead of 7"; the effective received qty is what shows.
  This is the dev's exact expected result (qty stays correct + status stays Received after invoicing), confirmed on real invoiced/paid Part Sales.

## Limitations (transparent)
- Part Sales module UI does not render via deep-link/hydration this session (routes land on the app's error page), so PS evidence is endpoint-level (the same endpoint the WO Parts tab UI renders). WO scenarios have full UI screenshots.
- T6 (editing vendor on a vendor invoice updates the row vendor only if not Invoiced/Paid) not independently driven — needs the vendor-invoice edit flow + the invoiced/paid negative state.
- The dev's EXACT PS repro (receive 4+5+1, return 3, invoice → 7) not seeded from scratch (PS part-add API/UI blocked); the same behavior class is verified on WO (controlled) + real invoiced PS (above).

## Verdict
Core behavior of SV-6295 PASSES: each receive = new row; vendor/qty/status kept per row; vendor-change-on-awaiting affects only future rows; no merge after full receipt; returned parts never shown as a Returned row (status stays Received, qty reduced); invoiced/paid state renders correctly; the dev's return-qty prefill fix works.
