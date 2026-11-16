# SV-8956 / SV-8950 / SV-8951 / SV-10380: decisions of 16 Nov 2026

QA lead, 16 Nov 2026 (verbatim): "1. OK make this the part of the Reports Parking epic 2. DO the same as above 3. I will follow your recomendation so when you type the message for Chris ask him to bring it back from Obsolete status if it is in obsolete status. 4. OK 5. OK 6. OK"

## Fresh evidence (capture.mjs → capture.json)
Staging build v26.45.4-f3d3d2d, Staging Heavy Duty - 9919, Asia/Karachi, 08:23–08:24 UTC; Rule 99: session, browser, process TZ and app 'timezone' key all Asia/Karachi, offsets agree (read back at start and end). Downloads kept in /tmp only.
- Technician Utilization: files Technician-Utilization-Summary.pdf / -Summary.csv / -Expanded.pdf / -Expanded.csv. Neither CSV has a Summary row (screen Summary row: 0.40 / 0.40 / 0.00 / 100.00% / $0.00). Expanded CSV has 5 per-day rows.
- Sales By Customer: sales-by-customer-summary.pdf / -expanded.pdf / -summary.csv / -expanded.csv: no range.
- Specs re-checked live 08:20 UTC (CQL lastModified): TU 641400833 last changed 13 Aug 2026 (v9); SBC 577634305 last changed 20 Oct 2026 (v22). Unchanged since the worker's quotes.

## Status per item
- **SV-8951 (3):** comment 81456 posted to Chris, ticket left in OBSOLETE for him to bring back if he wants it fixed.
- **SV-8956 (1) and SV-8950 (2): HELD, needs the QA lead.** Both are *Story Defect* sub-tasks (under stories SV-8612 and SV-8654). Jira does not let a sub-task sit directly under an epic, and every child of the Reports Parking epic SV-11936 is a *Bug*. Changing a sub-task into a Bug is a Jira "Move" that the connector cannot do. Pictures are uploaded and ready (media-ids.txt). Nothing written to either ticket yet.
- **SV-10380 (4): settled, no question for Chris.** SV-10380 (created 22 Sep 2026, newer than IV spec v10 of 13 Aug) says verbatim: "Use the net sum of all bin quantities, including negatives, for Inventory Value report quantities and valuation. Include negative-quantity parts with their signed values." and "Product decisions are complete". Latest written decision wins (Rule 32): the build's negative-stock behaviour is the intended one. Consequence: any Report Suite case for Inventory Value that expects only stock above zero now follows an outdated source (Rule 56).
- **5 and 6:** to be run as one worker after the regression run ends (A/R/A/P figure checks on PRD 947650561, plus the Dashboard Technician Efficiency tile re-check).
