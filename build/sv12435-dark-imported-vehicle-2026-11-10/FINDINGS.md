# SV-12435 — dark mode: vehicle details invisible on an imported invoice (tested 10 Nov 2026)
Picked up from the 15:31 UTC 3-hourly Board 2 check (QA assignee empty, no Powertools plan, no handoff comment; dev Dusan).
Fix: branch SV-12435-dark-mode-imported-vehicle-info commit c90603f11b — `app/src/css/invoice.scss` `.workorder-info-section { color: black; }`
(class used only by `ImportedInvoice.vue`). QA branch sv12435 build v26.45.3-8f11821 (was asleep; woken with the sleep-page wake
call `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv {"action":"wake","env":"sv12435"}`,
~110 s). Production v26.45.3-fc08f23. Mode: API mode, no recording, no technical section.
Branch had no imported invoices → imported one on screen (Settings → Imports → Invoices): ZZ12435-INV1, customer Mayfield Heights
Truck Centre, VIN ZZ12435DARK000045 (ev/import-sv12435.csv). Production example: ZZ9818-P.
Dark mode switch: profile menu → `button_night_mode_dark` / `button_night_mode_light` (body gets `body--dark`).

| # | Check | Production (before) | Branch (after) |
|---|---|---|---|
| 1 | Dark, vehicle strip text colour | rgb(255,255,255) on white | rgb(0,0,0) on white |
| 2 | Dark, any white text on the sheet | 12 strip items white | 0 of 41 |
| 3 | Light, strip | black | black |
| 4 | Phone 390×844 dark | white | black |
| 5 | Print media dark | rgb(49,55,74) | rgb(49,55,74) (unchanged) |
| 6 | Download PDF dark | – | vehicle row prints (ev/branch/dlpage-1.png) |
| 7 | Regular invoices | class only in ImportedInvoice.vue | not affected |
Posted comment 80670 (green PASSED, 7 checks, before/after picture 106dfd99), label QAcomplete, QA Assignee Bilal, QA Complete — read back.

## Side observation (Rule 93 bucket: confirmed, not tracked; asked the QA lead, not filed)
Imported invoice labor line: screen shows Quantity **1.00**, downloaded PDF shows Quantity **60.00** (the line's time is stored as
60 minutes, `timeEstimate: 60`). Same on production (ZZ9818-P: screen 1.00, PDF 60.00) and on the branch (ZZ12435-INV1, imported
with Qty 1). Searched Jira (imported + PDF + quantity / minutes): no ticket. SV-12501 (Board Backlog) plans to show the server-built
page on screen too — which would carry the 60.00 onto the screen.
