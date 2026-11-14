## 3 · Boards rendered, per page (coverage proof; per-board detail in BOARD-COVERAGE.md)

| Page | Boards on the canvas | Rendered | Pictures | Candidates | Hovered | Clicked | Exposed | Failed |
|---|---|---|---|---|---|---|---|---|
| 0 · Overview | 1 | 1 | 1 | 41 | 41 | 41 | 41 | 0 |
| 1 · Story 1: Release day | 4 | 4 | 4 | 199 | 199 | 199 | 179 | 0 |
| 2 · Story 2: Tiers | 60 | 60 | 60 | 3282 | 3282 | 3282 | 2403 | 0 |
| 3 · Story 3: Matrices and rules | 29 | 29 | 29 | 1862 | 1862 | 1862 | 1098 | 0 |
| 4 · Story 4: The tier grid: every tier of a matrix, edited in place | 27 | 27 | 27 | 1990 | 1990 | 1990 | 1448 | 0 |
| 5 · Story 5: Price Part Simulator | 4 | 4 | 4 | 226 | 226 | 226 | 183 | 0 |
| 6 · Story 6: Every matrix in one list | 14 | 14 | 14 | 843 | 843 | 843 | 608 | 0 |
| 7 · Story 7: Categories: every category's pricing at a glance | 15 | 15 | 15 | 1323 | 1323 | 1323 | 573 | 0 |
| 8 · Story 8: Categories over time | 12 | 12 | 12 | 873 | 873 | 873 | 455 | 0 |
| 9 · Story 9: Putting customers on tiers | 41 | 41 | 41 | 2072 | 2072 | 2072 | 794 | 0 |
| 10 · Story 10: How a part is priced | 12 | 12 | 12 | 302 | 302 | 302 | 248 | 0 |
| 11 · Story 11: When a part is priced again | 7 | 7 | 7 | 272 | 272 | 272 | 96 | 0 |
| 12 · Story 12: Seeing what priced a part | 9 | 9 | 9 | 311 | 311 | 311 | 249 | 0 |
| 13 · Story 13: Part Sales | 4 | 4 | 4 | 99 | 99 | 99 | 83 | 0 |
| 14 · Story 14: Changing the customer on a work order | 8 | 8 | 8 | 278 | 278 | 278 | 76 | 0 |
| 15 · Story 15: The below-cost warning in the matrix | 2 | 2 | 2 | 137 | 137 | 137 | 107 | 0 |
| 20 · Sales by Tier and Sales by Category | 23 | 23 | 23 | 1089 | 1089 | 1089 | 920 | 0 |
| **All** | **272** | **272** | **272** | **15199** | **15199** | **15199** | **9561** | **0** |

## 6b · Movement found by comparing the design's own pictures of the same screen (checklist line 10)

Method: boards were grouped by screen (same breadcrumb, title and selected tab); for each pair with the SAME column headings the left edge (x), width and top (y) of every heading were compared at 1440 px. 260 pairs compared, 143 with identical headings, 49 of those with movement. Pairs whose headings differ (a column hidden, edit mode adds a picker row) are in inventory/movement.json too.

| Screen | From (board) | To (board) | What moves (heading: dx / dwidth / dy px) |
|---|---|---|---|
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 47 2.47 Check a matrix | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 48 2.48 Click select-all | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 49 2.49 Uncheck two | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 50 2.50 Type 35 | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 51 2.51 Click Set Rule with no value | (checkbox/blank): +0 / +0 / +102; Matrix: +0 / +0 / +102; Work Order Matrix: +0 / +0 / +102; Part Sale Matrix: +0 / +0 / +102 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 52 2.52 Pick Margin %, type 120, click Set Rule | (checkbox/blank): +0 / +0 / +102; Matrix: +0 / +0 / +102; Work Order Matrix: +0 / +0 / +102; Part Sale Matrix: +0 / +0 / +102 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 53 2.53 Click Set Rule (every matrix checked) | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 54 2.54 Click Set Rule (some checked) | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 55 2.55 Click Set Rule in the dialog | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 59 2.59 Set a rule it already has | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Matrices › Stop 40 / ('',) | 05 3.5 Result: Enter or clicking away saves at once; Esc can | 25 3.25 Type a taken name and click Create Matrix | Part Cost: +0 / +70 / -51; 1Default: +70 / -11 / -51; 2Tier 2: +58 / -11 / -51; 3Tier 3: +47 / -11 / -51; 4Tier 4: +35 / -11 / -51; 5Tier 5: +23 / -11 / -51 … |
| Pricing › Matrices › Hydraulics 2025 / ('Hydraulics 2025',) | 10 3.10 Result: No badge on the page; the reason shows as pl | 07 4.7 Type in a range | Part Cost: +0 / +70 / +138; 1Default: +70 / -11 / +138; 2Tier 2: +58 / -11 / +138; 3Tier 3: +47 / -11 / +138; 4Tier 4: +35 / -11 / +138; 5Tier 5: +23 / -11 / +138 … |
| Pricing › Matrices › Hydraulics 2025 / ('Hydraulics 2025',) | 10 3.10 Result: No badge on the page; the reason shows as pl | 08 4.8 Change range 2 to Markup % and type 45 | Part Cost: +0 / +70 / +138; 1Default: +70 / -11 / +138; 2Tier 2: +58 / -11 / +138; 3Tier 3: +47 / -11 / +138; 4Tier 4: +35 / -11 / +138; 5Tier 5: +23 / -11 / +138 … |
| Pricing › Matrices › Fluids 30 / ('Fluids 30',) | 13 3.13 Save a matrix that prices several categories | 02 4.2 Hover a "Uses previous tier" cell | Part Cost: +0 / -70 / -124; 1Default: -70 / +11 / -124; 2Tier 2: -58 / +11 / -124; 3Tier 3: -47 / +11 / -124; 4Tier 4: -35 / +11 / -124; 5Tier 5: -23 / +11 / -124 … |
| Pricing › Matrices › Fluids 30 / ('Fluids 30',) | 13 3.13 Save a matrix that prices several categories | 16 4.16 Same as previous tier, in edit | Part Cost: +0 / -70 / -124; 1Default: -70 / +11 / -124; 2Tier 2: -58 / +11 / -124; 3Tier 3: -47 / +11 / -124; 4Tier 4: -35 / +11 / -124; 5Tier 5: -23 / +11 / -124 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 04 4.4 Result: Tread Plus Default: + $45 up to $300, then 15% margin | Cost Range: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 04 4.4 Result: Tread Plus Default: + $45 up to $300, then 15% margin | Part Cost: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 14 4.14 Ranges with different types | Cost Range: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 14 4.14 Ranges with different types | Part Cost: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 15 4.15 Result: The column header reads "Mixed rules"; cells spell out | Part Cost: +0 / +70 / +80; 1Default: +70 / -11 / +80; 2Tier 2: +58 / -11 / +80; 3Tier 3: +47 / -11 / +80; 4Tier 4: +35 / -11 / +80; 5Tier 5: +23 / -11 / +80 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 23 3.23 Open Categories | Cost Range: +0 / +0 / +221; 1Default + $ Markup % Ma: +0 / +0 / +221; 2Tier 2 Previous tier % : +0 / +0 / +221; 3Tier 3 Previous tier % : +0 / +0 / +221; 4Tier 4 Previous tier % : +0 / +0 / +221; 5Tier 5 Previous tier % : +0 / +0 / +221 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 23 3.23 Open Categories | Part Cost: +0 / +0 / +221; 1Default: +0 / +0 / +221; 2Tier 2: +0 / +0 / +221; 3Tier 3: +0 / +0 / +221; 4Tier 4: +0 / +0 / +221; 5Tier 5: +0 / +0 / +221 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 24 3.24 Click Create Matrix with no name | Cost Range: +0 / +0 / +26; 1Default + $ Markup % Ma: +0 / +0 / +26; 2Tier 2 Previous tier % : +0 / +0 / +26; 3Tier 3 Previous tier % : +0 / +0 / +26; 4Tier 4 Previous tier % : +0 / +0 / +26; 5Tier 5 Previous tier % : +0 / +0 / +26 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 24 3.24 Click Create Matrix with no name | Part Cost: +0 / +0 / +26; 1Default: +0 / +0 / +26; 2Tier 2: +0 / +0 / +26; 3Tier 3: +0 / +0 / +26; 4Tier 4: +0 / +0 / +26; 5Tier 5: +0 / +0 / +26 … |
| Settings › Categories › New Category / ('',) | 06 8.6 Result: Name (cursor in it), matrix, Cancel / Create  | 07 8.7 Click Create Category with no name | Cost Range: +0 / +0 / +26; 1Default: +0 / +0 / +26; 2Tier 2: +0 / +0 / +26; 3Tier 3: +0 / +0 / +26; 4Tier 4: +0 / +0 / +26; 5Tier 5: +0 / +0 / +26 … |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 06 9.6 Check two customers | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 07 9.7 Uncheck Part Sales on one row | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 08 9.8 Uncheck both Work Orders and Part Sales on a row | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 09 9.9 Click Select All | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 10 9.10 Uncheck Part Sales in the bar, then Select All | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 11 9.11 Result: Customers already on Tier 2 for the picked channel are | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 12 9.12 Search customers | Customer: +0 / -11 / +0; Work Order Tier: -11 / +6 / +0; Part Sales Tier: -6 / +6 / +0 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 13 9.13 A search with no match | Customer: +0 / -83 / +0; Work Order Tier: -83 / +43 / +0; Part Sales Tier: -40 / +40 / +0 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 14 9.14 Click Add to Tier 2 | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 06 10.6 Quick Add a part with a cost | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 07 10.7 Save it | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 08 10.8 Result: Priced by the work order's tier | Total: +2 / -2 / +0 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 09 10.9 Quick Add with a sell price of -5 | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 07 11.7 Receive a tier-priced part at a new cost, then hover its price | Name/Description: +1 / +3 / +0; Actual/Estimate: +4 / +2 / +0; Progress: +6 / +1 / +0; Status: +7 / +2 / +0; Action: +8 / +1 / +0; Rate: +9 / +1 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 02 12.2 Hover a part priced through Same as previous tier | Progress: +2 / +0 / +0; Status: +2 / +1 / +0; Action: +3 / +0 / +0; Rate: +3 / +0 / +0; Margin: +3 / +0 / +0; Total: +4 / -4 / +0 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 09 12.9 Hover a line priced for the previous customer | Name/Description: +0 / +0 / +79; Actual/Estimate: +0 / +0 / +79; Progress: +0 / +0 / +79; Status: +0 / +0 / +79; Action: +0 / +0 / +79; Rate: +0 / +0 / +79 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 08 14.8 Result: A notice counts the lines priced for the previous cust | Name/Description: +0 / +0 / +79; Actual/Estimate: +0 / +0 / +79; Progress: +0 / +0 / +79; Status: +0 / +0 / +79; Action: +0 / +0 / +79; Rate: +0 / +0 / +79 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 03 20.3 Open a tier's row | Priced By: +0 / +79 / +0; Parts Cost: +79 / -10 / +0; Parts Invoiced: +70 / -12 / +0; Parts Credits: +58 / -12 / +0; Parts Net: +47 / -10 / +0; Parts Margin: +38 / -11 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 04 20.4 Open a customer's row | Priced By: +0 / +94 / +0; Parts Cost: +94 / -10 / +0; Parts Invoiced: +84 / -14 / +0; Parts Credits: +71 / -14 / +0; Parts Net: +56 / -10 / +0; Parts Margin: +48 / -13 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 11 20.11 Pick a range with no sales | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 21 20.21 Download with no rows | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 22 20.22 Result: "Empty export." | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 23 20.23 Filters that match nothing | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Category',) | 16 20.16 Sales by Category | 17 20.17 Open a category's row | Category: +0 / +10 / +0; Parts Cost: +10 / -1 / +0; Parts Invoiced: +8 / -1 / +0; Parts Credits: +7 / -1 / +0; Parts Net: +5 / -1 / +0; Parts Margin: +5 / -2 / +0 … |

## 6c · Stress data probe (checklist line 9) — harness result, not a design statement

The design draws no long or special-character names. To show the case author what the design's own styles do, every occurrence of a typed record name (tier, matrix, category, customer) on 32 representative boards was replaced in the rendered page with: (spaces) "Northern Alberta Heavy Equipment Fleet Services Preferred Customer Pricing", (nospaces) "NorthernAlbertaHeavyEquipmentFleetServicesPreferredCustomerPricingTier", (special) `A&B "Fleet" O'Neil <Tier> & Co.`. Pictures in render/stress/. The expected look for these cases must still come from a source (PRD, design library, PO answer).

| Board | Value | Names replaced | How they show | Page wider | Columns moved | Rows taller | Runs past its box |
|---|---|---|---|---|---|---|---|
| 2.2 T01-TiersList | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.2 T01-TiersList | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.2 T01-TiersList | special | 3 | one line 3 |  |  | 0 |  |
| 2.32 TP01-TierPage | spaces | 7 | one line 1, wraps to 2 lines 5, wraps to 4 lines 1 |  |  | 3 |  |
| 2.32 TP01-TierPage | nospaces | 7 | one line 2, cut off without ... 5 | yes |  | 1 | runs past its TD. |
| 2.32 TP01-TierPage | special | 7 | one line 6, wraps to 2 lines 1 |  |  | 1 |  |
| 2.7 T05-RowMenu | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.7 T05-RowMenu | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.7 T05-RowMenu | special | 3 | one line 3 |  |  | 0 |  |
| 6.2 MX01-Matrices | spaces | 5 | shortened with ... 3, wraps to 4 lines 1, wraps to 8 lines 1 |  |  | 2 |  |
| 6.2 MX01-Matrices | nospaces | 5 | shortened with ... 3, cut off without ... 2 |  |  | 1 |  |
| 6.2 MX01-Matrices | special | 5 | one line 3, wraps to 2 lines 1, wraps to 4 lines 1 |  |  | 1 |  |
| 3.2 MP01-Matrix | spaces | 7 | one line 2, wraps to 2 lines 1, shortened with ... 4 |  |  | 0 |  |
| 3.2 MP01-Matrix | nospaces | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 3.2 MP01-Matrix | special | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 4.6 ED01-Edit | spaces | 7 | one line 1, wraps to 2 lines 1, shortened with ... 5 |  |  | 0 |  |
| 4.6 ED01-Edit | nospaces | 7 | one line 2, shortened with ... 5 |  |  | 0 |  |
| 4.6 ED01-Edit | special | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 7.3 CA01-Categories | spaces | 10 | wraps to 6 lines 2, wraps to 3 lines 2, wraps to 4 lines 5, wraps to 5 lines 1 |  |  | 2 |  |
| 7.3 CA01-Categories | nospaces | 10 | wraps to 2 lines 7, one line 2, wraps to 3 lines 1 |  | yes | 1 |  |
| 7.3 CA01-Categories | special | 10 | wraps to 3 lines 7, wraps to 2 lines 3 |  |  | 2 |  |
| 7.8 CA03-Category | spaces | 8 | one line 5, wraps to 2 lines 1, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 7.8 CA03-Category | nospaces | 8 | one line 6, shortened with ... 2 | yes |  | 0 | runs past its DIV.sv-field |
| 7.8 CA03-Category | special | 8 | one line 6, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 9.28 CU01-Customers | spaces | 2 | one line 2 |  | yes | 0 |  |
| 9.28 CU01-Customers | nospaces | 2 | one line 2 |  | yes | 0 |  |
| 9.28 CU01-Customers | special | 2 | one line 2 |  | yes | 0 |  |
| 9.30 CU02-CustomerCard | spaces | 4 | shortened with ... 1, wraps to 3 lines 2, one line 1 |  |  | 0 |  |
| 9.30 CU02-CustomerCard | nospaces | 4 | shortened with ... 1, wraps to 4 lines 2, one line 1 |  |  | 0 |  |
| 9.30 CU02-CustomerCard | special | 4 | shortened with ... 1, one line 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | spaces | 7 | shortened with ... 1, wraps to 3 lines 2, one line 1, wraps to 2 lines 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | nospaces | 7 | shortened with ... 1, wraps to 4 lines 2, one line 1, wraps to 2 lines 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | special | 7 | shortened with ... 1, one line 3, wraps to 2 lines 3 |  |  | 0 |  |
| 9.32 CU04-TierPicked | spaces | 8 | shortened with ... 1, wraps to 3 lines 2, one line 1, wraps to 2 lines 4 |  |  | 0 |  |
| 9.32 CU04-TierPicked | nospaces | 8 | shortened with ... 1, wraps to 4 lines 2, one line 1, wraps to 2 lines 4 |  |  | 0 |  |
| 9.32 CU04-TierPicked | special | 8 | shortened with ... 1, one line 4, wraps to 2 lines 3 |  |  | 0 |  |
| 9.40 PH02-TierSheet | spaces | 5 | wraps to 3 lines 2, wraps to 2 lines 3 |  |  | 0 |  |
| 9.40 PH02-TierSheet | nospaces | 5 | wraps to 2 lines 5 |  |  | 0 | runs past its BUTTON.sv-menu__row |
| 9.40 PH02-TierSheet | special | 5 | one line 2, wraps to 2 lines 3 |  |  | 0 |  |
| 9.1 MC01-CustomersTab | spaces | 5 | one line 4, wraps to 2 lines 1 |  |  | 0 |  |
| 9.1 MC01-CustomersTab | nospaces | 5 | one line 5 | yes |  | 0 |  |
| 9.1 MC01-CustomersTab | special | 5 | one line 5 |  |  | 0 |  |
| 9.4 MC02-ManageAdd | spaces | 15 | one line 4, wraps to 2 lines 2, wraps to 3 lines 1, wraps to 6 lines 7, wraps to 5 lines 1 |  | yes | 1 |  |
| 9.4 MC02-ManageAdd | nospaces | 15 | one line 6, wraps to 2 lines 1, wraps to 4 lines 1, wraps to 3 lines 7 | yes | yes | 1 |  |
| 9.4 MC02-ManageAdd | special | 15 | one line 6, wraps to 2 lines 2, wraps to 3 lines 7 |  | yes | 1 |  |
| 9.6 MC03-TickTwo | spaces | 17 | one line 1, wraps to 2 lines 6, wraps to 4 lines 1, wraps to 3 lines 1, wraps to 6 lines 7, wraps to 5 lines 1 |  | yes | 4 |  |
| 9.6 MC03-TickTwo | nospaces | 17 | one line 3, cut off without ... 5, wraps to 2 lines 1, wraps to 4 lines 1, wraps to 3 lines 7 | yes | yes | 2 | runs past its TD. |
| 9.6 MC03-TickTwo | special | 17 | one line 7, wraps to 2 lines 3, wraps to 3 lines 7 |  | yes | 2 |  |
| 10.5 WO01-Lines | spaces | 2 | wraps to 3 lines 1, wraps to 2 lines 1 |  |  | 0 |  |
| 10.5 WO01-Lines | nospaces | 2 | one line 1, wraps to 2 lines 1 |  |  | 0 |  |
| 10.5 WO01-Lines | special | 2 | wraps to 2 lines 2 |  |  | 0 |  |
| 12.4 WO04-PartsTab | spaces | 5 | wraps to 3 lines 1, one line 2, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 12.4 WO04-PartsTab | nospaces | 5 | one line 3, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 12.4 WO04-PartsTab | special | 5 | wraps to 2 lines 1, one line 2, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 13.3 PSL01-PartSale | spaces | 0 |  |  |  | 0 |  |
| 13.3 PSL01-PartSale | nospaces | 0 |  |  |  | 0 |  |
| 13.3 PSL01-PartSale | special | 0 |  |  |  | 0 |  |
| 14.3 CC02-Change | spaces | 4 | wraps to 3 lines 1, wraps to 2 lines 1, one line 2 |  |  | 0 | runs past its DIV.sv-field |
| 14.3 CC02-Change | nospaces | 4 | one line 3, wraps to 2 lines 1 |  |  | 0 | runs past its DIV.sv-field |
| 14.3 CC02-Change | special | 4 | wraps to 2 lines 2, one line 2 |  |  | 0 | runs past its DIV.sv-field |
| 12.9 G12-PrevCustomer | spaces | 8 | one line 1, wraps to 2 lines 4, wraps to 4 lines 2, wraps to 3 lines 1 |  |  | 0 |  |
| 12.9 G12-PrevCustomer | nospaces | 8 | one line 1, wraps to 2 lines 3, wraps to 3 lines 2, wraps to 4 lines 1, cut off without ... 1 |  |  | 0 |  |
| 12.9 G12-PrevCustomer | special | 8 | one line 4, wraps to 2 lines 2, wraps to 3 lines 2 |  |  | 0 |  |
| 20.2 RP01-ByTier | spaces | 2 | wraps to 2 lines 2 |  | yes | 2 |  |
| 20.2 RP01-ByTier | nospaces | 2 | one line 2 |  | yes | 0 |  |
| 20.2 RP01-ByTier | special | 2 | wraps to 2 lines 2 |  | yes | 2 |  |
| 20.3 RP02-RowOpen | spaces | 2 | wraps to 2 lines 2 |  | yes | 3 |  |
| 20.3 RP02-RowOpen | nospaces | 2 | one line 2 |  | yes | 1 |  |
| 20.3 RP02-RowOpen | special | 2 | wraps to 2 lines 2 |  | yes | 3 |  |
| 20.16 RP06-ByCategory | spaces | 3 | wraps to 2 lines 3 |  | yes | 3 |  |
| 20.16 RP06-ByCategory | nospaces | 3 | one line 2, wraps to 2 lines 1 |  | yes | 1 |  |
| 20.16 RP06-ByCategory | special | 3 | one line 2, wraps to 2 lines 1 |  | yes | 1 |  |
| 20.6 GR-CustFilter | spaces | 4 | wraps to 4 lines 2, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.6 GR-CustFilter | nospaces | 4 | one line 4 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.6 GR-CustFilter | special | 4 | wraps to 2 lines 4 |  | yes | 2 |  |
| 20.7 GR-CatFilter | spaces | 5 | wraps to 4 lines 3, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.7 GR-CatFilter | nospaces | 5 | one line 4, wraps to 2 lines 1 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.7 GR-CatFilter | special | 5 | wraps to 2 lines 5 |  | yes | 2 |  |
| 20.5 RP03-Filter | spaces | 5 | wraps to 4 lines 3, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.5 RP03-Filter | nospaces | 5 | one line 5 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.5 RP03-Filter | special | 5 | wraps to 2 lines 5 |  | yes | 2 |  |
| 3.13 SV02-ChangeAll | spaces | 9 | one line 1, wraps to 2 lines 4, shortened with ... 4 |  |  | 0 |  |
| 3.13 SV02-ChangeAll | nospaces | 9 | one line 4, shortened with ... 4, wraps to 3 lines 1 |  |  | 0 |  |
| 3.13 SV02-ChangeAll | special | 9 | one line 5, shortened with ... 4 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | special | 3 | one line 3 |  |  | 0 |  |
| 9.18 MC10-RemoveConfirm | spaces | 7 | one line 1, wraps to 2 lines 5, wraps to 4 lines 1 |  |  | 3 |  |
| 9.18 MC10-RemoveConfirm | nospaces | 7 | one line 2, cut off without ... 5 | yes |  | 1 | runs past its TD. |
| 9.18 MC10-RemoveConfirm | special | 7 | one line 6, wraps to 2 lines 1 |  |  | 1 |  |
| 8.1 CA07-PickMatrix | spaces | 10 | one line 5, wraps to 2 lines 2, shortened with ... 2, wraps to 3 lines 1 |  |  | 0 | runs past its DIV.sv-field |
| 8.1 CA07-PickMatrix | nospaces | 10 | one line 6, wraps to 2 lines 1, shortened with ... 2, cut off without ... 1 | yes |  | 0 | runs past its DIV.sv-field |
| 8.1 CA07-PickMatrix | special | 10 | one line 6, wraps to 2 lines 2, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 3.23 NM02-Cats | spaces | 12 | wraps to 9 lines 2, wraps to 2 lines 5, wraps to 10 lines 1, shortened with ... 4 |  |  | 0 |  |
| 3.23 NM02-Cats | nospaces | 12 | one line 2, wraps to 2 lines 6, shortened with ... 4 |  |  | 0 | runs past its BUTTON.sv-dd-row |
| 3.23 NM02-Cats | special | 12 | one line 7, wraps to 2 lines 1, shortened with ... 4 |  |  | 0 |  |

## 9 · Pictures per page (file names for case attachments, folder `images/`)

**0 · Overview** (1)  
`page-00-board-01-0-0-overview.png`

**1 · Story 1: Release day** (4)  
`page-01-board-01-1-1-release-day-settings-pricing-opens-on-tiers.png`, `page-01-board-02-1-2-release-day-matrices-tab.png`, `page-01-board-03-1-3-click-a-matrix.png`, `page-01-board-04-1-4-result-opening-a-matrix-shows-todays-rules-as-the-defaul.png`

**2 · Story 2: Tiers** (60)  
`page-02-board-01-2-1-today-the-pricing-page.png`, `page-02-board-02-2-2-tiers-list.png`, `page-02-board-03-2-3-hover-the-info-icon.png`, `page-02-board-04-2-4-click-the-three-dot-menu-beside-new-tier.png`, `page-02-board-05-2-5-click-audit-log.png`, `page-02-board-06-2-6-result-audit-log-tiers-every-tiers-changes-newest-first.png`, `page-02-board-07-2-7-click-a-tiers-three-dot-menu-never-used.png`, `page-02-board-08-2-8-hover-the-greyed-delete.png`, `page-02-board-09-2-9-the-last-rows-menu-opens-upward.png`, `page-02-board-10-2-10-click-new-tier.png`, `page-02-board-11-2-11-result-the-new-tiers-page-opens-no-dialog-with-the-curs.png`, `page-02-board-12-2-12-click-create-tier-with-no-name.png`, `page-02-board-13-2-13-type-a-name-another-tier-uses.png`, `page-02-board-14-2-14-type-an-archived-tiers-name.png`, `page-02-board-15-2-15-type-a-name-the-reports-use.png`, `page-02-board-16-2-16-type-fleet-plus-and-click-create-tier.png`, `page-02-board-17-2-17-result-the-tier-is-created-and-its-page-stays-open.png`, `page-02-board-18-2-18-archive-a-tier-that-has-customers.png`, `page-02-board-19-2-19-click-remove-customers-in-the-blocked-dialog.png`, `page-02-board-20-2-20-result-manage-customers-opens-on-the-remove-tab-so-the-.png`, `page-02-board-21-2-21-archive-a-tier-with-no-customers.png`, `page-02-board-22-2-22-result-the-dialog-lists-one-per-line-every-tier-that-fo.png`, `page-02-board-23-2-23-click-archive.png`, `page-02-board-24-2-24-result-tier-5-moves-to-the-archived-rows-the-tiers-afte.png`, `page-02-board-25-2-25-an-archived-tiers-menu.png`, `page-02-board-26-2-26-click-reactivate.png`, `page-02-board-27-2-27-result-no-confirmation.png`, `page-02-board-28-2-28-delete-a-tier-that-priced-nothing.png`, `page-02-board-29-2-29-click-delete.png`, `page-02-board-30-2-30-result-the-tier-and-its-column-in-every-matrix-are-gone.png`, `page-02-board-31-2-31-click-a-tier-tier-2.png`, `page-02-board-32-2-32-result-the-tiers-page-opens-on-pricing-every-matrix-and.png`, `page-02-board-33-2-33-point-at-the-name.png`, `page-02-board-34-2-34-click-the-pencil.png`, `page-02-board-35-2-35-result-the-name-is-edited-in-place.png`, `page-02-board-36-2-36-type-a-taken-name-and-press-enter.png`, `page-02-board-37-2-37-type-fleet-and-press-enter.png`, `page-02-board-38-2-38-click-the-pages-three-dot-menu.png`, `page-02-board-39-2-39-click-audit-log.png`, `page-02-board-40-2-40-result-audit-log-tier-2-event-user-details-old-new-date.png`, `page-02-board-41-2-41-defaults-page.png`, `page-02-board-42-2-42-result-default-is-priced-by-each-matrixs-default-column.png`, `page-02-board-43-2-43-an-archived-tiers-page.png`, `page-02-board-44-2-44-result-archived-shows-as-plain-text.png`, `page-02-board-45-2-45-click-a-matrix-on-the-tiers-page.png`, `page-02-board-46-2-46-result-the-matrix-opens-in-edit-with-tier-2s-column-in-.png`, `page-02-board-47-2-47-check-a-matrix.png`, `page-02-board-48-2-48-click-select-all.png`, `page-02-board-49-2-49-uncheck-two.png`, `page-02-board-50-2-50-type-35.png`, `page-02-board-51-2-51-click-set-rule-with-no-value.png`, `page-02-board-52-2-52-pick-margin-type-120-click-set-rule.png`, `page-02-board-53-2-53-click-set-rule-every-matrix-checked.png`, `page-02-board-54-2-54-click-set-rule-some-checked.png`, `page-02-board-55-2-55-click-set-rule-in-the-dialog.png`, `page-02-board-56-2-56-result-the-checks-clear.png`, `page-02-board-57-2-57-click-undo.png`, `page-02-board-58-2-58-result-exactly-what-the-tier-had-comes-back.png`, `page-02-board-59-2-59-set-a-rule-it-already-has.png`, `page-02-board-60-2-60-result-nothing-is-asked-a-toast-says-so.png`

**3 · Story 3: Matrices and rules** (29)  
`page-03-board-01-3-1-click-a-matrix-stop-40.png`, `page-03-board-02-3-2-result-the-matrix-page-categories-work-order-part-sale-t.png`, `page-03-board-03-3-3-point-at-the-name.png`, `page-03-board-04-3-4-click-the-pencil.png`, `page-03-board-05-3-5-result-enter-or-clicking-away-saves-at-once-esc-cancels.png`, `page-03-board-06-3-6-click-the-pages-three-dot-menu.png`, `page-03-board-07-3-7-click-audit-log.png`, `page-03-board-08-3-8-result-newest-first-each-save-then-every-rule-it-changed.png`, `page-03-board-09-3-9-an-inactive-matrix.png`, `page-03-board-10-3-10-result-no-badge-on-the-page-the-reason-shows-as-plain-t.png`, `page-03-board-11-3-11-save-a-matrix-that-prices-one-category.png`, `page-03-board-12-3-12-result-saved-without-asking-a-toast-confirms.png`, `page-03-board-13-3-13-save-a-matrix-that-prices-several-categories.png`, `page-03-board-14-3-14-save-the-general-matrix.png`, `page-03-board-15-3-15-type-120-in-a-off-column-and-click-save.png`, `page-03-board-16-3-16-change-a-value-then-click-the-part-sale-matrix-tab.png`, `page-03-board-17-3-17-click-the-part-sale-matrix-tab-off.png`, `page-03-board-18-3-18-turn-on-separate-part-sale-pricing.png`, `page-03-board-19-3-19-a-matrix-with-its-own-part-sale-prices.png`, `page-03-board-20-3-20-turn-it-off.png`, `page-03-board-21-3-21-click-new-matrix.png`, `page-03-board-22-3-22-result-name-categories-and-the-grid-ready-to-fill-cance.png`, `page-03-board-23-3-23-open-categories.png`, `page-03-board-24-3-24-click-create-matrix-with-no-name.png`, `page-03-board-25-3-25-type-a-taken-name-and-click-create-matrix.png`, `page-03-board-26-3-26-duplicate-a-matrix.png`, `page-03-board-27-3-27-result-a-copy-of-its-rules-ready-to-name.png`, `page-03-board-28-3-28-delete-a-matrix.png`, `page-03-board-29-3-29-result-delete-stop-40-names-the-matrix.png`

**4 · Story 4: The tier grid: every tier of a matrix, edited in place** (27)  
`page-04-board-01-4-1-hover-the-cost-range-info-icon.png`, `page-04-board-02-4-2-hover-a-uses-previous-tier-cell.png`, `page-04-board-03-4-3-a-column-that-mixes-rule-types.png`, `page-04-board-04-4-4-result-tread-plus-default-45-up-to-300-then-15-margin.png`, `page-04-board-05-4-5-click-edit.png`, `page-04-board-06-4-6-result-every-cell-is-editable.png`, `page-04-board-07-4-7-type-in-a-range.png`, `page-04-board-08-4-8-change-range-2-to-markup-and-type-45.png`, `page-04-board-09-4-9-a-columns-rule-picker.png`, `page-04-board-10-4-10-defaults-rule-picker.png`, `page-04-board-11-4-11-pick-off-for-tier-5.png`, `page-04-board-12-4-12-pick-previous-tier-for-tier-2.png`, `page-04-board-13-4-13-a-from-cost-cells-symbol.png`, `page-04-board-14-4-14-ranges-with-different-types.png`, `page-04-board-15-4-15-result-the-column-header-reads-mixed-rules-cells-spell-.png`, `page-04-board-16-4-16-same-as-previous-tier-in-edit.png`, `page-04-board-17-4-17-result-the-cells-show-the-previous-tiers-values-muted-a.png`, `page-04-board-18-4-18-type-a-bad-value-and-click-save.png`, `page-04-board-19-4-19-change-a-range-end.png`, `page-04-board-20-4-20-click-add-range.png`, `page-04-board-21-4-21-click-a-ranges-delete.png`, `page-04-board-22-4-22-after-a-few-edits.png`, `page-04-board-23-4-23-click-cancel-with-changes.png`, `page-04-board-24-4-24-change-defaults-rules.png`, `page-04-board-25-4-25-edit-from-an-archived-tier.png`, `page-04-board-26-4-26-result-the-archived-view-default-plus-archived-tiers-wi.png`, `page-04-board-27-4-27-hover-defaults-column-in-the-archived-view.png`

**5 · Story 5: Price Part Simulator** (4)  
`page-05-board-01-5-1-type-a-part-cost-in-the-price-part-simulator.png`, `page-05-board-02-5-2-a-cost-a-tier-sells-below.png`, `page-05-board-03-5-3-type-0-as-the-part-cost.png`, `page-05-board-04-5-4-type-a-cost-while-editing-the-grid.png`

**6 · Story 6: Every matrix in one list** (14)  
`page-06-board-01-6-1-today-the-matrices-list.png`, `page-06-board-02-6-2-click-the-matrices-tab.png`, `page-06-board-03-6-3-hover-the-tiers-info-icon.png`, `page-06-board-04-6-4-hover-the-tier-numbers-in-the-tiers-column.png`, `page-06-board-05-6-5-click-the-status-filter.png`, `page-06-board-06-6-6-pick-inactive.png`, `page-06-board-07-6-7-result-the-chip-turns-blue-with-the-selection.png`, `page-06-board-08-6-8-hover-an-inactive-status.png`, `page-06-board-09-6-9-search-tread.png`, `page-06-board-10-6-10-a-search-with-no-match.png`, `page-06-board-11-6-11-click-a-matrixs-three-dot-menu.png`, `page-06-board-12-6-12-the-general-matrixs-menu.png`, `page-06-board-13-6-13-audit-log-beside-new-matrix.png`, `page-06-board-14-6-14-result-audit-log-matrices-every-matrixs-changes-deleted.png`

**7 · Story 7: Categories: every category's pricing at a glance** (15)  
`page-07-board-01-7-1-today-the-categories-list.png`, `page-07-board-02-7-2-today-edit-category.png`, `page-07-board-03-7-3-settings-categories.png`, `page-07-board-04-7-4-hover-a-uses-previous-tier-cell.png`, `page-07-board-05-7-5-search-tire.png`, `page-07-board-06-7-6-a-search-with-no-match.png`, `page-07-board-07-7-7-click-a-category-brakes.png`, `page-07-board-08-7-8-result-the-category-page-name-tax-exempt-quickbooks-mapp.png`, `page-07-board-09-7-9-a-category-whose-matrix-prices-others.png`, `page-07-board-10-7-10-hover-the-grayed-edit.png`, `page-07-board-11-7-11-click-go-to-the-fluids-30-matrix.png`, `page-07-board-12-7-12-click-new-matrix-on-a-categorys-page.png`, `page-07-board-13-7-13-result-the-new-matrix-opens-with-this-category-already-.png`, `page-07-board-14-7-14-audit-log-beside-new-category.png`, `page-07-board-15-7-15-result-audit-log-categories.png`

**8 · Story 8: Categories over time** (12)  
`page-08-board-01-8-1-pick-another-matrix-for-the-category.png`, `page-08-board-02-8-2-uncategorized.png`, `page-08-board-03-8-3-result-a-system-category-it-cant-be-renamed-moved-or-del.png`, `page-08-board-04-8-4-rename-brakes-to-a-taken-name.png`, `page-08-board-05-8-5-click-new-category.png`, `page-08-board-06-8-6-result-name-cursor-in-it-matrix-cancel-create-category.png`, `page-08-board-07-8-7-click-create-category-with-no-name.png`, `page-08-board-08-8-8-type-wheel-seals-and-click-create-category.png`, `page-08-board-09-8-9-result-created-on-the-general-matrix-the-toast-says-so.png`, `page-08-board-10-8-10-click-delete-in-the-three-dot-menu.png`, `page-08-board-11-8-11-click-delete-in-the-delete-dialog.png`, `page-08-board-12-8-12-result-the-category-is-gone-its-parts-and-past-lines-ar.png`

**9 · Story 9: Putting customers on tiers** (41)  
`page-09-board-01-9-1-click-the-tiers-customers-tab.png`, `page-09-board-02-9-2-search-a-tiers-customers-tab-with-no-match.png`, `page-09-board-03-9-3-open-the-customers-tabs-channel-filter.png`, `page-09-board-04-9-4-click-manage-customers.png`, `page-09-board-05-9-5-hover-the-add-customers-tab.png`, `page-09-board-06-9-6-check-two-customers.png`, `page-09-board-07-9-7-uncheck-part-sales-on-one-row.png`, `page-09-board-08-9-8-uncheck-both-work-orders-and-part-sales-on-a-row.png`, `page-09-board-09-9-9-click-select-all.png`, `page-09-board-10-9-10-uncheck-part-sales-in-the-bar-then-select-all.png`, `page-09-board-11-9-11-result-customers-already-on-tier-2-for-the-picked-chann.png`, `page-09-board-12-9-12-search-customers.png`, `page-09-board-13-9-13-a-search-with-no-match.png`, `page-09-board-14-9-14-click-add-to-tier-2.png`, `page-09-board-15-9-15-result-new-work-orders-and-part-sales-use-tier-2.png`, `page-09-board-16-9-16-click-the-remove-customers-tab.png`, `page-09-board-17-9-17-check-one-and-click-remove.png`, `page-09-board-18-9-18-result-remove-1-customer-they-go-back-to-default-for-th.png`, `page-09-board-19-9-19-click-remove.png`, `page-09-board-20-9-20-result-they-are-back-on-default.png`, `page-09-board-21-9-21-an-archived-tiers-customers-tab.png`, `page-09-board-22-9-22-click-reactivate-tier.png`, `page-09-board-23-9-23-result-no-confirmation.png`, `page-09-board-24-9-24-remove-tab-of-a-tier-with-no-customers.png`, `page-09-board-25-9-25-today-the-customers-list.png`, `page-09-board-26-9-26-today-a-customers-page.png`, `page-09-board-27-9-27-today-edit-customer.png`, `page-09-board-28-9-28-customers.png`, `page-09-board-29-9-29-open-a-customer.png`, `page-09-board-30-9-30-result-the-customer-cards-pricing-group-labor-rate-shop.png`, `page-09-board-31-9-31-click-edit.png`, `page-09-board-32-9-32-click-work-order-tier-and-type-3.png`, `page-09-board-33-9-33-pick-3-tier-3.png`, `page-09-board-34-9-34-click-save.png`, `page-09-board-35-9-35-result-the-card-shows-the-new-tier.png`, `page-09-board-36-9-36-edit-the-counter-sale-customer.png`, `page-09-board-37-9-37-edit-customer-with-only-default.png`, `page-09-board-38-9-38-today-edit-customer-on-a-phone.png`, `page-09-board-39-9-39-on-a-phone-edit-customer.png`, `page-09-board-40-9-40-on-a-phone-tap-work-order-tier.png`, `page-09-board-41-9-41-on-a-phone-pick-3-tier-3.png`

**10 · Story 10: How a part is priced** (12)  
`page-10-board-01-10-1-today-a-work-order.png`, `page-10-board-02-10-2-today-add-part-quick-add-row.png`, `page-10-board-03-10-3-today-cost-fills-the-sell-price.png`, `page-10-board-04-10-4-open-a-work-order-s1-2671.png`, `page-10-board-05-10-5-result-parts-are-priced-by-the-work-orders-tier.png`, `page-10-board-06-10-6-quick-add-a-part-with-a-cost.png`, `page-10-board-07-10-7-save-it.png`, `page-10-board-08-10-8-result-priced-by-the-work-orders-tier.png`, `page-10-board-09-10-9-quick-add-with-a-sell-price-of-5.png`, `page-10-board-10-10-10-a-part-with-no-cost.png`, `page-10-board-11-10-11-result-no-rule-prices-it-0-00-logged-under-the-work-or.png`, `page-10-board-12-10-12-click-the-fixed-rules-tab.png`

**11 · Story 11: When a part is priced again** (7)  
`page-11-board-01-11-1-click-a-part.png`, `page-11-board-02-11-2-type-a-sell-price.png`, `page-11-board-03-11-3-split-work-order-works-as-today.png`, `page-11-board-04-11-4-after-the-split.png`, `page-11-board-05-11-5-result-the-new-work-order-priced-by-the-customers-curre.png`, `page-11-board-06-11-6-receive-a-part.png`, `page-11-board-07-11-7-receive-a-tier-priced-part-at-a-new-cost-then-hover-its.png`

**12 · Story 12: Seeing what priced a part** (9)  
`page-12-board-01-12-1-hover-a-price.png`, `page-12-board-02-12-2-hover-a-part-priced-through-same-as-previous-tier.png`, `page-12-board-03-12-3-hover-a-typed-price.png`, `page-12-board-04-12-4-click-the-parts-tab.png`, `page-12-board-05-12-5-a-line-priced-before-tiers.png`, `page-12-board-06-12-6-the-customer-has-moved-tier-since.png`, `page-12-board-07-12-7-a-canned-line-part-on-a-default-work-order.png`, `page-12-board-08-12-8-a-part-on-a-fixed-line-total.png`, `page-12-board-09-12-9-hover-a-line-priced-for-the-previous-customer.png`

**13 · Story 13: Part Sales** (4)  
`page-13-board-01-13-1-today-a-part-sale.png`, `page-13-board-02-13-2-open-a-part-sale-p1-1131.png`, `page-13-board-03-13-3-result-priced-by-the-part-sales-tier-from-the-part-sale.png`, `page-13-board-04-13-4-hover-a-price.png`

**14 · Story 14: Changing the customer on a work order** (8)  
`page-14-board-01-14-1-today-change-customer.png`, `page-14-board-02-14-2-click-the-work-orders-three-dot-menu.png`, `page-14-board-03-14-3-change-customer.png`, `page-14-board-04-14-4-pick-a-customer-on-another-tier.png`, `page-14-board-05-14-5-change-customer-on-a-part-sale.png`, `page-14-board-06-14-6-pick-a-customer-on-the-same-tier.png`, `page-14-board-07-14-7-click-update-customer.png`, `page-14-board-08-14-8-result-a-notice-counts-the-lines-priced-for-the-previou.png`

**15 · Story 15: The below-cost warning in the matrix** (2)  
`page-15-board-01-15-1-hover-the-below-cost-warning.png`, `page-15-board-02-15-2-type-95-in-tier-5-while-editing.png`

**20 · Sales by Tier and Sales by Category** (23)  
`page-20-board-01-20-1-today-sales-by-customer-unchanged.png`, `page-20-board-02-20-2-reports-sales-by-tier.png`, `page-20-board-03-20-3-open-a-tiers-row.png`, `page-20-board-04-20-4-open-a-customers-row.png`, `page-20-board-05-20-5-open-priced-by.png`, `page-20-board-06-20-6-open-the-customer-filter.png`, `page-20-board-07-20-7-open-the-category-filter.png`, `page-20-board-08-20-8-open-the-location-filter.png`, `page-20-board-09-20-9-sales-type-work-orders-only.png`, `page-20-board-10-20-10-pick-a-custom-range-over-one-year.png`, `page-20-board-11-20-11-pick-a-range-with-no-sales.png`, `page-20-board-12-20-12-sort-by-parts-margin.png`, `page-20-board-13-20-13-result-first-click-on-a-number-column-puts-the-biggest.png`, `page-20-board-14-20-14-click-the-columns-icon.png`, `page-20-board-15-20-15-hide-parts-margin.png`, `page-20-board-16-20-16-sales-by-category.png`, `page-20-board-17-20-17-open-a-categorys-row.png`, `page-20-board-18-20-18-click-download.png`, `page-20-board-19-20-19-click-download-summary-csv.png`, `page-20-board-20-20-20-result-prototype-stand-in-see-the-info-icon-the-real-m.png`, `page-20-board-21-20-21-download-with-no-rows.png`, `page-20-board-22-20-22-result-empty-export.png`, `page-20-board-23-20-23-filters-that-match-nothing.png`

Extra pictures: `orphan-not-on-canvas-CU04b-8-4b-pick-3-tier-3.png`, `page-09-board-28-9-28-customers-full-height.png`, `page-09-board-29-9-29-open-a-customer-full-height.png`, `page-09-board-30-9-30-result-the-customer-cards-pricing-group-labor-rate-shop-full-height.png`, `page-09-board-31-9-31-click-edit-full-height.png`, `page-09-board-32-9-32-click-work-order-tier-and-type-3-full-height.png`, `page-09-board-33-9-33-pick-3-tier-3-full-height.png`, `page-09-board-34-9-34-click-save-full-height.png`, `page-09-board-35-9-35-result-the-card-shows-the-new-tier-full-height.png`, `page-09-board-37-9-37-edit-customer-with-only-default-full-height.png`, `page-10-board-06-10-6-quick-add-a-part-with-a-cost-full-height.png`, `page-10-board-07-10-7-save-it-full-height.png`, `page-10-board-09-10-9-quick-add-with-a-sell-price-of-5-full-height.png`, `page-12-board-09-12-9-hover-a-line-priced-for-the-previous-customer-full-height.png`, `page-14-board-08-14-8-result-a-notice-counts-the-lines-priced-for-the-previou-full-height.png`

