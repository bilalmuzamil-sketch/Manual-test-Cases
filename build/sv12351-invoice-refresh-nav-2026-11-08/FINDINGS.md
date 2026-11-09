# SV-12351 — Stop obsolete invoice refreshes after navigation (8 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12351 (Bug, TESTING QA, assignee Stefan Mitrovic, labels FE/sentry-sync, no QA assignee, no Powertools plan). QA branch https://sv12351.qa.shopview.com. Sentry SHOPVIEW-APP-4HD (7636340540).
Mode: Board-2 defaults (API mode, no recording, no technical section).

## How a user hits it (from the Sentry breadcrumbs, latest event 8 Nov 00:18 UTC)
Finance tab of a work order that is not invoiced yet -> type in **Customer PO** -> click **Work Orders** in the top menu.
Leaving the field saves the PO (`POST /api/work-orders/change-customer-po` 201) and queues an invoice refresh; the refresh runs after the
page has changed and calls `GET /api/invoices//details` (empty work-order id) -> 404.

## Production BEFORE — v26.45.2-132dcb4 (last-modified Sat 07 Nov 2026 20:28:42 GMT), test org, Trucks Hill 2
Work order S2-786 (Ahsan, Complete, not invoiced). The Finance tab is disabled on In Progress work orders (S2-1920), so a Complete one is needed.
| Round | Empty-id 404 | Red toast "Error fetching draft invoice details / Invoice error" on the Work Orders list |
|---|---|---|
| 1 | yes | yes |
| 2 | yes | yes |
| 3 | yes | yes |
| 4 | yes | yes |
4 of 4. Log: ev/prod-r1-log.txt; screenshots ev/prod-r1-1-po-typed.png, ev/prod-r1-2-after-nav.png.
(The yellow "IBS Location ID is not configured for location Trucks Hill 2" warning is a location-settings warning on the test org, unrelated.)

## Branch AFTER
Waiting for fresh `.qa.shopview.com` cookies (6 Nov set returns 401).
Planned matrix: list (4 rounds) · another draft WO · an invoiced WO · stay on the WO and tab Lines->Finance (preview must still refresh)
· PO change then wait (current-owner refresh) · Finance tab first open on a fresh WO.

## Branch AFTER — sv12351 v26.45.2-9444adc (last-modified Sat 07 Nov 2026 22:21:53 GMT), 9 Nov 2026
Fresh cookies 8 Nov. Work order S2-17113 (shown as S12351-17113 on the branch, Complete, not invoiced). Production comparison: S2-786 / S2-918.
"TEST-ONLY" below = the browser held or altered one server answer so the timing race can be produced on demand; the product was not changed.
| # | Case (ticket wording) | Production v26.45.2-132dcb4 | Branch | Evidence |
|---|---|---|---|---|
| 1 | Type Customer PO, click Work Orders in the top menu (4 rounds) | 4/4: empty-id 404 + red "Error fetching draft invoice details" | 0/4 | prod-r1, branch-r1 |
| 2 | Hold the preview render, change the PO again (queues a refresh), leave to the list, release (the ticket's own recipe) | `GET /api/invoices//details` 404 + red toast | nothing after release, no toast | prod-queue, branch-queue |
| 3 | Same, but leave to another, INVOICED work order (S2-1926 / S2-16654) | details + render requests sent for the DESTINATION work order | none | prod-queue-invoiced, branch-queue-invoiced |
| 4 | PO save held, open another draft work order (S2-850 / S2-16273) | details + render for the destination | none | prod-otherwo-held, branch-otherwo-held |
| 5 | Initialization race: open Finance, leave before the first details load answers | after release: render request 400 + toasts "Bad request" / "Error get invoice HTML" on the list | details answered, nothing else, no toast | prod-init, branch-init |
| 6 | Hold the render only, leave to the list (no queued refresh) | no error either | no error | prod-holdest, branch-holdest |
| 7 | Stay on Finance after a PO change -> preview refreshes; Lines tab and back -> refreshes | yes | yes | prod-stay, branch-stay |
| 8 | Current work order's own details fail (TEST-ONLY 500) -> error still shown | - | "Ooooops! An error occurred" + "Error fetching draft invoice details" shown | branch-forced500 |
| 9 | Regression walk: invoice date 11/12/2026 -> preview "Invoice date: Nov 12, 2026"; Download -> INV-S2-16271.pdf; Create Invoice (S2-16271, S2-15597) -> 201 and New Customer Payment opens (creation hand-off); Cash payment $10 -> preview Payments $10.00, Balance $283.77; Reverse paid invoice -> "please delete payment before reversing"; Reverse unpaid S2-15597 -> status Complete, preview refreshed | - | all as expected | branch-reg1..8 |
Observation (not on screen): after Reverse the branch sent the preview render request TWICE at the same moment in 2 of 3 tries (28.23/28.26, 27.15/27.15); production sent it once in 2 of 2 (S2-918). The screen looks the same. Ticket says "Preserve ... serialized/coalesced rebuilds". -> asked the QA lead (Rule 97d) whether it goes to Stefan.
Production also sent two Sentry error reports on Reverse; the branch sent none.
| 10 | Part sale (P2-204 branch / P2-93 production): Finance preview loads; type Customer PO, click Parts in the top menu | 2/2: red "Error fetching draft invoice details" after leaving | 0/3, preview loads | prod-ps1/2, branch-ps/ps2/ps3 |
| 11 | Add Deposit on S2-17435 (Cash $5.00, ZZAUTOTEST SV12351 deposit) | - | "A deposit was created", preview shows Deposit Nov 9, 2026 Cash $5.00 | branch-reg9 |
Double render request also happens on PRODUCTION when a part sale's Finance tab first opens (2/2), so double requests are not new in general; only the Reverse case differs (branch 2/3 double, production 0/2).
