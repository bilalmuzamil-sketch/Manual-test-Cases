# SV-12221 — Purchase Orders: search and sort by vendor name (10 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12221 (Bug, TESTING QA, assignee + QA assignee Dusan Radulovic; QA lead said test it, 10 Nov). Customer GL Mécanique via Intercom. No Powertools plan. QA Branch https://sv12221.qa.shopview.com. Board-2 defaults (API mode, no recording, no technical section).
Expected (ticket): searching a vendor name shows all matching POs; clicking Vendor sorts A–Z and Z–A. Extra note: customer wants every visible column sortable. Dusan 80498: "'Ordered By' column is also not sortable … let me know if you agree" (Milos/Chris) — no answer on the ticket.
Fix: ShopView/shopview SV-12221-po-vendor-search-sort, commit 81d6a1bc2 — search matches the vendors the Vendor cell shows (items not fully received), word by word in any order, punctuation stripped, accents via collation; Vendor sort = first vendor shown, no-vendor rows last both ways; io.id tie-break for paging.

## Environment
Branch sv12221 build v26.45.2-411684a, Staging Heavy Duty - 9919, Admin, Chrome 1600x900. Production app.shopview.com v26.45.2-107ad4b, test org (Trucks Hill 2).

## Production (before)
- Vendor header has no sort arrow; clicking it leaves the order unchanged (P2). Search "Delete Test" → "No orders match the search" though 14 POs show it (P1, P0); "Prod Admin" 0 of 4, "Fibridge" 0 of 3 (search-runs.jsonl).

## Branch (after) — 101 open POs, 20 with more than one vendor, 16 with no vendor shown
| # | Check | Result |
|---|---|---|
| 1 | Search full name "Amimi Diesel Services Inc" | 4 = 4 expected (incl. multi-vendor) |
| 2 | "amimi", "services amimi", "amimidiesel" | 4/4 each |
| 3 | Second vendor on a PO: "Willoughby" | 13 = 13 (S-17466 has it as 2nd vendor) — on screen B1 |
| 4 | Punctuation "Akal's"/"akals"; "&" "Mobile Truck & Trailer" 12/12; "trailer mobile hampton" 10/10 | exact |
| 5 | Accents: vendor renamed to "Akal's Mécanique Truck Repair" (left so): "mécanique","mecanique","MECANIQUE","Mécanique Akal","akalsmecanique" | all find S-5610 |
| 6 | PO number search "S12221-5610" still works; nonsense "zzzqqq" → 0 | ok |
| 7 | Vendor sort A–Z and Z–A over all 4 pages | correct order, 101 unique, no-vendor 16 last both ways |
| 8 | On screen: header click toggles A–Z / Z–A (4 clicks), choice kept after reload | ok |
| 9 | Search "Diesel" + Vendor A–Z | 31 rows, sorted |
| 10 | Other columns: Status, Created On, Total Cost, Note sort correctly both ways | ok |
Observations (not in the ticket's two items; asked the QA lead before posting):
- "Ordered By" header still not sortable (code: sortable:false). Customer asked for every column; Dusan asked Milos/Chris in 80498, no answer.
- Purchase Order Number and Work Order sort as text: S-10002 … S-17503 before S-4103. Same on production (S-1923, S-1927 before S-218) → existed before this ticket.
Exhibits: ev/exhibits/01-before-production.png, 02-after-search.png, 03-after-sort.png.
