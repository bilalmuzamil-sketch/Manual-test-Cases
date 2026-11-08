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
