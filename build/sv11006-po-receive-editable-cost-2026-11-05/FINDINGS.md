# SV-11006 — PO receive: editable cost for work-order parts (5 Nov 2026, IN PROGRESS)
QA lead: API mode, no recording, no technical section. Handoff = Parth comment 80175 (8 steps + regression list).
Builds: branch sv11006 v26.45.0-7571668; production v26.45.0-8e138e1.

## Production BEFORE (S2-1923, Trucks Hill 2, PO d900f512)
PO receive (`/order/{po}?receive=1`): part A cost $40.00000 is plain text (no input); part B (empty cost) has an input. WO "Receive parts"
window (line right-click > Receive parts): part A cost IS an input (40). = the customer's complaint. ev/prod-explore-p1/{receive,wo-receive}.png

## Branch results
| # | Check | Result | Data |
|---|---|---|---|
| 1 | Edit cost on PO receive (Parts > Purchase Orders > row Receive) | PASS: $40 -> $80, Sell $90 -> $180 at once; typing into Sell does nothing (no input); received; WO part cost 80 / sell 180 / margin 55.56 | S11006-17580 (b1) |
| 2a | Unpriced part, matrix | PASS: cost $25 -> Sell $62.50 = Default matrix (Uncategorized) band 24.01–55 markup 150%; saved 25 / 62.50 | b1 part B |
| 2b | Unpriced part, fixed sell price (vendor request linked to inventory part with fixed $35) | PASS: cost $10 -> Sell $35.00, saved 10 / 35 | S11006-17586 (b7) |
| 2c | Unpriced part on a fixed-line-total line (code path) | PASS: cost $20 -> Sell stays $0.00, saved 20 / 0; line fixed total 100 unchanged | S11006-17587 (b8) |
| 2d | Vendor part merely sharing a fixed-rule part number (not linked) | Sell $22.22 = matrix, as the code defines "fixed" = linked inventory part | S11006-17584 (b6) |
| 3 | Inventory PO | PASS: no Sell column; cost $12.00000 text, no input | I11006-1396 |
| 4 | Invoiced/paid WO lock (PO receive + WO modal) | BLOCKED — see below | |
| 5 | Split line onto invoiced WO | BLOCKED — see below | |
| 6 | Stale tab | BLOCKED — see below | |
| 7 | Back prompt | PASS: changed cost + Back -> "Discard entered details? … Stay / Leave"; Stay keeps 55; restored 40 + Back -> no prompt, goes to list; Leave -> list, reopened cost still 40 | b9, b13 |
| 8 | No See Financial Data (custom role "ZZAUTOTEST SV-11006 No SFD" = Parts Technician perms, SFD off, given to tech@shopview.com) | PASS: receive screen columns Part / Qty ordered / Qty received only (no Cost, no Sell); receive 200 "Parts received for S-17588"; stored cost 40/90 untouched | S11006-17588 (b9) |
| R1 | WO Receive parts window, approved WO | PASS: $40 -> $60, saved sell $135 (margin 55.56 kept) | b10 |
| R2 | Bulk Receive (list > tick 2 POs > Receive Selected > Expand all) | PASS: cost inputs + Sell; $40 -> $80 shows $180 + notice "Updating the cost also updates the sell price to keep the margin."; saved 80/180, other PO untouched 40/90 | S11006-17590/17591 |
| R3 | Core part | PASS: core row cost/qty disabled; part A $70 -> sell $157.50; core charge 15 kept | S11006-17592 (c1) |
| R4 | Receive later / deferred | BLOCKED — see below | |

## BLOCKER (steps 4, 5, 6, R4)
Getting an invoiced WO with a PO part still outstanding needs the part marked **Received later** (developer's own e2e test:
`partsApi.deferReceipt` = `POST /api/work-orders/parts/received-later`). On sv11006 that returns **403 Access denied**: the
`woReceivedLater` permission is **missing from the branch's permission catalogue** (`GET /api/fe-permissions` has no such code;
production's has `woReceivedLater` id 2662c015…). The Admin role screen shows a "Receive later" toggle (`wosetting_receivedlater`);
switching it on and saving (Edit Anyway + Confirm) sends the same 57 permissions and it reads back off. Same gap as SV-11253.
Tried and ruled out: requireOrderingParts off (still "All vendor parts must be received before completing the work order."),
partial receive (still blocks), creating the permission via API (405/404).

## State left on the branch
Tech user role = "ZZAUTOTEST SV-11006 No SFD" (was Technician). Admin role unchanged (57 perms). requireOrderingParts restored true.

## FINAL (5 Nov 2026, 16:13 UTC) — PASSED, posted comment 80245, label QAcomplete, status QA Complete
- Parth added the woReceivedLater permission (catalogue now has it; Admin role 57 -> 58 after switching "Receive later" on and saving; re-read confirmed).
- The branch REDEPLOYED at 15:36:30 UTC: v26.45.0-7571668 -> v26.45.2-b7be383. Every check was re-run on b7be383 (scripts/rerun.sh, log /tmp/sv11006/rerun.log, 15:56-16:09 UTC), plus split (d6) and stale tab (d7), which already ran after the redeploy.
- Production for the before picture: v26.45.1-753355c (redeployed 14:16 UTC). Its receive screen already has a Sell column, but a filled cost on an open work order is plain text (S2-1927) = the bug.
- Results on b7be383: 1 S11006-17605 40->80 sell 90->180 saved; 2 matrix 25->62.50 + fixed 10->35 (17606); 3 inventory PO no Sell, $12.00000 text; 4 invoiced 17613 + paid 17614: filled cost locked, empty fillable, receive unchanged keeps 40/90, totals unchanged; 5 partial receive 1 of 2 on 17601, split onto 17602, invoiced -> original PO locks that part (a plain split moves the part onto its own new PO instead, so the partial-receive split is the shape that leaves it on the original PO); 6 stale tab 17603: 400 "can't be changed because its work order is invoiced or paid. Reload the page and try again.", reloads locked, stored 40/90; 7 Back prompt (17607); 8 no SFD (tech on role ZZAUTOTEST SV-11006 No SFD) no Cost/Sell, receive ok; R1 WO modal 40->60 sell 135; R2 bulk 80/180, other PO 40/90; R3 receive later ok; R4 core row greyed $15, A 70->157.50.
- Note in comment: on an invoiced/paid WO the line menu has no "Receive parts", so the WO window can't be opened there (handoff said it shows the cost read-only).
- Side observation, NOT in the comment, asked to QA lead: filling an EMPTY cost while receiving a part on an INVOICED work order raises the WO Financial Info card (Parts $90 -> $152.50, Total $737.06) while the invoice stays $674.56 and Balance $674.56. Production does the same (S2-1926: card $489.90 -> $714.90, invoice $489.90). Existing behaviour, not this ticket.
- Exhibits: ev/before-after-po-receive.png, ev/branch-invoiced-paid-locked.png, ev/branch-split-locked.png, ev/branch-stale-tab.png (scripts/exhibit.py). Read back: 4 images, 13 rows.
- Learning check: playbook gets the split-after-partial-receive recipe + bulk action button ids (button_bulk_more / button_bulk_receive) + WO auto-completes when its last line completes.
