# SV-10072 — Vendor return "add item" deducted the part id instead of the quantity

- Ticket: https://shopview.atlassian.net/browse/SV-10072 (TESTING QA, Medium, Bug, reporter Ahtasham Amjad, Relates SV-10648)
- Environment: staging https://app.staging.shopview.com (front-end marker v26.40.17-5cb4ad9, Wed 14 Oct 2026 11:36:27 GMT) — the developer (parth fadadu, comment 77483) said the fix is on staging. Location Staging Heavy Duty - 9919.
- BEFORE: production https://app.shopview.com (Rule 86).
- QA lead answers (2026-10-14): **No recording** · **No technical section**.

## Source of truth (Rule 66)
Description: *"one vendor-return path puts a part id where a quantity belongs and then casts it to an integer, so it deducts a nonsense amount"*.
Dusan (77326): `POST /api/inventory/returns/add-item`, stock-part branch only; old code deducts the id's leading digits (`7c9e…` → 7, `12345678-…` → 12,345,678, letter first → nothing); Part History records the same wrong number; work-order items in the same call use a separate branch; the normal create-return flow is unaffected; no screen calls this endpoint (API-only).
Parth (77517): create a vendor return, then add-item `{return_id, inventory_part_id, quantity:"2", credits:10}` → stock goes down by exactly 2.
Chris (77353): nothing in the app can trigger this, check production for past returns through this path before closing.

## Variant matrix (written BEFORE the add-item calls — Rules 96/106)
| # | Case | Expected (source) | Staging | Production BEFORE |
|---|---|---|---|---|
| A1 | id with 8 leading digits (201.6215 WHEEL STUD, id 18658006…, 16 on hand), quantity "2" | 16 → 14 (Parth 77517) | PASS — HTTP 201; 16 → 14; Part History "Returned qty 2 … Qty: 16 → 14 (-2)" (old code: −18,658,006) | Production (v26.40.17-f5bf8f4) already correct: part 1238231 id 18c3cf07… sent 2 → 88 → 86 (old code: −18). Fix is live there too; no pre-fix build exists |
| A2 | id with 1 non-zero leading digit (N79-038, id 1a699927…, 19), quantity "2" | 19 → 17 | PASS — 19 → 17 (old code: −1) | not run |
| A3 | id with leading zeros (MD668D, id 0019667d…, 280), quantity "2" | 280 → 278 | PASS — 280 → 278 (old code: −19) | not run |
| A4 | id starting with a letter (ZLWMS-18, id a00cd61f…, 43), quantity "2" | 43 → 41 | PASS — 43 → 41 (old code: 0) | not run |
| A5 | decimal quantity "1.5" on a decimal-stock part (SH550045136 oil, 39.7) | 39.7 → 38.2 | PASS — 39.7 → 38.2, history "-1.5" | not run |
| A6 | quantity sent as a number (3) rather than text | deducts exactly 3 | PASS — number 3: 14 → 11 | not run |
| A7 | Part History records the same (correct) quantity for every call | Dusan 77326 | PASS — every call wrote one "Returned qty" entry with startingQuantity/remainingQuantity matching the deduction (API + Part History page) | not run |
| A8 | the vendor return shows each added item with its quantity and credit | add-item contract | PASS — return ZZ10072-CM1 lists each added item with quantity 2.00/2.00/2.00/3.00/1.50/2.00 (credits stored as "1000.00000" for credits 10 and part_number/description null — side observation O3) | not run |
| A9 | two add-items for the same part on one return accumulate correctly | deducts 2 then 2 | PASS — same part twice on one return: 16 → 14 → 11 → 9 (console-script run 14:05:50Z) | not run |
| A10 | quantity larger than on hand — observe only (not stated by any source) | — | OBSERVED — N79-038 sent 50 with 17 on hand: HTTP 201, stock −33, history "17 → -33 (-50)". API-only, no source; side observation O2 | not run |
| R1 | normal flow: Create Return (screen) then Receive Credit → stock drops by the returned quantity once | Dusan 77326 "normal create-return flow is unaffected" | PASS — Create Return (ZLWMS-18 × 1, Stillwater Diesel Repair) + Receive Credit (credit memo ZZ10072-CM1, return 1b285dfe…): stock 44 → 43 once. NOTE: no Part History entry (O1 — same on production) | not run |
| R2 | work-order item through add-item (sibling branch) still deducts the sent quantity | Dusan 77326 | PASS (limited) — the only other item key the endpoint stores is return_request_id; it is not looked up, so no work-order part is touched; the stored item carried the sent quantity (2.00) | not run |

## Results
(filled in as observed)


Staging build marker: v26.40.17-5cb4ad9 at 13:51Z, then **v26.40.17-ddb9ba1 (last-modified 13:54:24 GMT)** — staging redeployed during the pass; every add-item call ran after 13:57Z, i.e. on ddb9ba1.

## Side observations (not filed — to the QA lead as questions, Rules 93/94/97d)
- **O1 (screen-reachable, pre-existing):** Parts → Create Return → Save Return takes the stock off (staging ZLWMS-18 44 → 43; production 1754925 Item-9122 114 → 113, manual return 11baa3b0…) but Part History records **nothing** for it, on staging and on production. Jira searched ("part history"+"return", "Returned qty", "manual return"+"history"): no ticket.
- **O2 (API-only):** add-item accepts a quantity larger than on hand and leaves stock negative (N79-038 17 → −33).
- **O3 (API-only):** add-item stores `credits: 10` as "1000.00000", leaves part number/description empty, and accepts any `inventory_part_id` (a made-up id returned 201) and unknown fields silently.
- Part History wording for this path reads "Returned qty 2 from WO #" with no number (same on production).

## Restore (staging is shared)
Stock put back by cycle count (`inventory/parts/change`): 201.6215 16, N79-038 19, MD668D 280, ZLWMS-18 44, SH550045136 39.7 — each read back. The vendor return ZZ10072-CM1 and its items stay (test data).

## Verdict
PASSED — every matrix cell passes on staging v26.40.17-ddb9ba1. No recording, no technical section (QA lead's answers). Side observations O1–O3 go to the QA lead as questions, not into the comment (Rules 94/97d).

## Pre-post gate (2026-10-14 ~14:30 UTC)
- Staging marker re-read during the walk: v26.40.17-ddb9ba1 (13:54:24 GMT) — the same build every add-item ran on.
- Ticket re-read live: TESTING QA, Medium, last comment 78576 (parth fadadu, 13 Oct) — nothing new.
- Reproduction walked live, exactly as written (the console line was read from comment.txt and run unchanged): Parts opens Inventory directly (step corrected), 201.6215 16 Available → script printed 201 → 14 Available → Part History top line "Returned qty 2 from WO # Qty: 16 → 14 (-2)". Stock put back to 16 afterwards so the steps stay true.
- Voice scan clean; no technical section; no recording.
- Posted **78683** (2026-10-14T09:32:35-0500). Read back: first line "OVERALL QA STATUS: PASSED", 3 media all `type:file` in order, 12 table rows (header + 11), code block intact.

## Learning check
- `GET /api/inventory/parts` pages with `pagination[rowsPerPage]` / `pagination[page]`; `limit`/`page`/`rowsPerPage` are ignored and silently return page 1 again (I first concluded no part id started with a letter). Playbook §AQ + LESSONS-INDEX.
- Part History is the page `/parts/history/{partId}`; production's build has no `button_part_history_` id, so open the address.
- The Inventory list keeps a saved Bin Location filter chip; its ⊗ needs a coordinate click (a span intercepts), and the reader's steps must say to clear it.
- Manual return on screen: Save Return → `POST /api/part/manual-return-request/create`; Receive Credit on it → `POST /api/part/manual-return/{id}/create {creditMemoNumber, creditDate, tax, note}` → `{return_id}` (the vendor return add-item needs).
