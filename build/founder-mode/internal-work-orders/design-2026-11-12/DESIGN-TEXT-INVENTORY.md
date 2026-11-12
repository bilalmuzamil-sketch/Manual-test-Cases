# Design text inventory — Internal Work Orders (12 Nov 2026)

Every visible text of every rendered board (all 167 boards of the 10 pages of the dropdown), the visible attribute texts, the 167 board titles, the 10 page names, all 198 canvas notes, and every word in the board files that no board draws (source only). Built by `tools/build_all.py` with the rules in `tools/classify.py`; every row with its board, look (size, weight, colour, component) and codes in `DESIGN-TEXT-INVENTORY.json`. Classes: DATA · PRD-MATCH (PRD code, exact letter case) · OUT-OF-SCOPE (reason) · SPEC-CONFLICT (register id in `../DESIGN-DIVERGENCE-REGISTER.json`) · LOOK-ONLY (design words where the PRD is silent and nothing conflicts).

## Counts

| | rows |
|---|---|
| board | 13651 |
| board title | 167 |
| canvas note | 198 |
| page name | 10 |
| source only | 64 |
| **all rows** | **14090** |

| class | rows |
|---|---|
| DATA | 5784 |
| LOOK-ONLY | 268 |
| OUT-OF-SCOPE | 6562 |
| PRD-MATCH | 1259 |
| SPEC-CONFLICT | 217 |
| **Unclassified** | **0** |

Letter case: PRD-MATCH labels found in the PRD only in other letter case: none (the one case difference, "to no charge?", is IWO-D25).

## Distinct texts on the boards, by class (pages and boards where each shows)

| Text | Class | Codes / register | Boards | Note |
|---|---|---|---|---|
| $0.00 | DATA |  | WO-Detail-Artboard-v6, flow0-11, flow0-5, flow0-6, flow0-8, flow1-2c +45 | demo data |
| $1,120.00 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| $1,124.85 | DATA |  | flow1-2d, flow6-1, flow6-2, flow6-3, flow6-4, flow6-5 +14 | demo data |
| $1,240.00 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| $1,265.00 | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| $1,395.00 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| $149.95 | DATA |  | flow1-2d, flow6-1, flow6-2, flow6-3, flow6-4, flow6-6 +11 | demo data |
| $149.95/h | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, hf-21, hf-22 +2 | demo data |
| $170.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| $180.00 | DATA |  | flow2-3, flow2-3b, flow2-3c, flow2-3d, flow2-4, flow2-4b +21 | demo data |
| $180.00 cost | DATA |  | flow2-3, flow2-3b, flow2-3c, flow2-4, flow2-4b, flow2-6 +8 | demo data |
| $199.95 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| $2,418.60 | DATA |  | flow5-3 | demo data |
| $25.00 | DATA |  | flow0-11, flow1-3, flow1-6b, flow1-6c, flow1-6d, flow1-6e +14 | demo data |
| $264.00 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| $265.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +30 | demo data |
| $269.90 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| $299.90 | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3e, flow6-7 +6 | demo data |
| $320.00 | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3e, hf-21 +3 | demo data |
| $400.00 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| $410.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +38 | demo data |
| $449.85 | DATA |  | flow1-2d, flow6-1, flow6-2, flow6-3, flow6-4, flow6-5 +14 | demo data |
| $559.95 | DATA |  | flow1-2d, flow6-1, flow6-2, flow6-6, hf-30, hf-31 +2 | demo data |
| $564.90 | DATA |  | flow1-2d, flow5-3c, flow6-1, flow6-2, flow6-3, flow6-4 +14 | demo data |
| $590.00 | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | demo data |
| $619.90 | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3e, hf-21 +3 | demo data |
| $675.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +50 | demo data |
| $85.00 | DATA |  | flow1-3d, flow1-4, flow6-7, hf-15, hf-35, rv-6-6 | demo data |
| $85.00 cost | DATA |  | flow1-3e | demo data |
| $95.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +44 | demo data |
| (403) 523 - 0488 | DATA |  | flow0-11, flow0-5, flow0-6, flow0-7, flow0-8, flow1-3d +22 | demo data |
| (403) 523-0488 | DATA |  | flow0-4, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +25 | demo data |
| - | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +29 | demo data |
| . | DATA |  | flow0-2, flow0-3, hf-03, rv-1-3 | demo data |
| 0 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 0 · 0.0 h | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | demo data |
| 0.0 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 0.0% | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 01 | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +16 | demo data |
| 02 | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +11 | demo data |
| 02 Replace - Brake caliper | DATA |  | flow4-5, flow5-3c, hf-39, hf-41b, rv-7-2, rv-7-6 | demo data |
| 02 · Replace alternator · M. Rhodes | DATA |  | flow2-2, flow2-3c, flow6-2, flow6-6, hf-22, hf-25 +4 | attribute holding demo data |
| 1 | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow0-4, flow1-1, flow1-2a +92 | demo data |
| 1 more at locations you don't have access to. | DATA |  | flow0-7 | demo data |
| 1 work order · 3.0 h | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | demo data |
| 1 work order, 1 line · 3.0 h | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | demo data |
| 1 · Warranty · parts cost $410.00 | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| 1.0 | DATA |  | flow4-5, flow4-6, flow5-3c, flow6-7, hf-35, hf-39 +6 | demo data |
| 1.0 h | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +8 | demo data |
| 1.00 | DATA |  | flow6-6 | attribute holding demo data |
| 1.00 / 1.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +24 | demo data |
| 1.00 h · Caliper (special order) × 1 · M. Rhodes · $559.95 | DATA |  | flow6-2, hf-31, rv-6-2 | demo data |
| 1.1% | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 1.7% | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 10 | DATA |  | flow0-4, hf-07 | demo data |
| 100% | DATA |  | flow4-4 | demo data |
| 10842 West Charleston Boulevard | DATA |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | attribute holding demo data |
| 10842 West Charleston Boulevard, Suite 450-B | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | demo data |
| 10842 West Charleston Boulevard, Suite 450-B, Las Vegas, Nevada 89135 | DATA |  | flow0-11, flow0-5, flow0-6, flow0-7, flow0-8, flow1-2c +30 | demo data |
| 10:00 | DATA |  | flow4-11 | demo data |
| 11 | DATA |  | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | demo data |
| 1100 Accounts Receivable | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| 11:00 | DATA |  | flow4-11 | demo data |
| 12 | DATA |  | flow0-4, hf-07 | demo data |
| 1200 Inventory Asset | DATA |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | demo data |
| 123 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | demo data |
| 12:00 | DATA |  | flow4-11 | demo data |
| 1300 Inventory | DATA |  | flow0-10, flow0-9, hf-10, rv-3-1 | attribute holding demo data |
| 13:00 | DATA |  | flow4-11 | demo data |
| 148-434-9127 | DATA |  | flow0-4, hf-07 | demo data |
| 14:00 | DATA |  | flow4-11 | demo data |
| 15:00 | DATA |  | flow4-11 | demo data |
| 16:00 | DATA |  | flow4-11 | demo data |
| 17483 Shane Drive | DATA |  | flow0-4, hf-07 | demo data |
| 18 | DATA |  | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | demo data |
| 1FUJGLDR9KLKA5512 | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +24 | demo data |
| 2 | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b +66 | demo data |
| 2 work orders, 1 line | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| 2.0 | DATA |  | flow2-7b, flow4-5, flow4-6, flow6-7, hf-35, hf-39 +4 | demo data |
| 2.0 h | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +37 | demo data |
| 2.0 hrs | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +24 | demo data |
| 2.00 / 2.00 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +24 | demo data |
| 2017 Ford Transit | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-10b, flow1-2a +74 | demo data |
| 2017 Ford Transit, Unit 14 | DATA |  | flow1-2b, hf-12, rv-3-4 | demo data |
| 2019 Freightliner Cascadia | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +47 | demo data |
| 2019 Freightliner Cascadia · Unit 7 | DATA |  | flow2-7b | demo data |
| 2019 Freightliner Cascadia, Unit 12 | DATA |  | flow1-2b, hf-12, rv-3-4 | demo data |
| 2021 | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| 23 | DATA |  | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | demo data |
| 237 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 2ZTM0GN6FHYZT4KXE | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +44 | demo data |
| 3 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-4, flow1-1, flow1-2a, flow1-2b +14 | demo data |
| 3.0 | DATA |  | flow4-4, flow4-5, hf-39, rv-7-2 | demo data |
| 3.0 h | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +24 | demo data |
| 3.0 hrs | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +44 | demo data |
| 3.6% | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 305 Harris Cape | DATA |  | flow0-4, hf-07 | demo data |
| 348 Ramos Field | DATA |  | flow0-4, hf-07 | demo data |
| 4 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +18 | demo data |
| 4 Star Truck Repair | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-1b, flow0-4, flow1-1, flow1-2a +16 | demo data |
| 4,120 | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| 4000 Sales | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| 41 | DATA |  | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | demo data |
| 416-555-0142 | DATA |  | flow0-4, hf-07 | demo data |
| 464-195-1863 | DATA |  | flow1-2d, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3 +44 | demo data |
| 5 | DATA |  | flow0-4, hf-07 | demo data |
| 5.0 | DATA |  | flow4-4 | demo data |
| 5.5 | DATA |  | flow4-4 | demo data |
| 5000 Cost of Parts | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| 5000 Cost of parts | DATA |  | flow0-10, flow0-9, hf-10, rv-3-1 | attribute holding demo data |
| 5100 Shop Supplies COGS | DATA |  | flow5-3b, hf-41, rv-7-3 | demo data |
| 6 | DATA |  | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | demo data |
| 6.0 | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| 6.5 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 609-461-6502 | DATA |  | flow0-4, hf-07 | demo data |
| 62 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 6200 Vehicle Maintenance Expense | DATA |  | flow0-10, flow0-2a, flow0-2d, flow0-2e, flow0-9, hf-04 +3 | attribute holding demo data |
| 6250 Equipment Maintenance Expense | DATA |  | flow0-9, hf-10, rv-3-1 | attribute holding demo data |
| 6430 Warranty & Goodwill Expense | DATA |  | flow0-10, flow0-2b, flow0-2c, flow0-9, flow5-3c, hf-05 +7 | demo data |
| 6440 Comeback Expense | DATA |  | flow0-10, flow0-2b, flow0-2c, flow0-9, hf-05, hf-06 +4 | attribute holding demo data |
| 6500 Vehicle Expenses | DATA |  | flow0-10, flow0-2a, flow0-2d, flow0-2e, flow0-9, flow5-3b +6 | demo data |
| 665 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| 699-679-2107 | DATA |  | flow0-4, hf-07 | demo data |
| 7 | DATA |  | flow0-4, hf-07 | demo data |
| 7 Star Truck Repair | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-4, flow1-1, flow1-2a, flow1-2b +11 | demo data |
| 7522 Sampson Gardens | DATA |  | flow0-4, hf-07 | demo data |
| 7:00 | DATA |  | flow4-11 | demo data |
| 8 | DATA |  | flow0-4, hf-07 | demo data |
| 8.0 | DATA |  | flow4-4 | demo data |
| 8.5 | DATA |  | flow4-4 | demo data |
| 84 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 88 Harbour Rd | DATA |  | flow0-4, hf-07 | demo data |
| 885-670-3999 | DATA |  | flow0-4, hf-07 | demo data |
| 89135 | DATA |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | attribute holding demo data |
| 8:00 | DATA |  | flow4-11 | demo data |
| 8FGU25 | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| 8FGU25-71244 | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| 9 | DATA |  | flow0-2b, flow0-2c, flow0-4, hf-05, hf-06, hf-07 +2 | demo data |
| 9.5 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 91 | DATA |  | flow4-6, hf-39b, rv-7-5 | demo data |
| 91% | DATA |  | flow4-4 | demo data |
| 94154 Dominguez Gateway | DATA |  | flow0-4, hf-07 | demo data |
| 958-590-3025 | DATA |  | flow0-4, hf-07 | demo data |
| 9:00 | DATA |  | flow4-11 | demo data |
| : | DATA |  | flow1-1, flow1-2a, flow1-2b, flow1-2b2, flow1-2e, flow1-9 +15 | demo data |
| A & J Truck & Trailer Repair | DATA |  | flow0-4, flow1-2d, flow4-5, flow5-3c, flow6-1, flow6-2 +22 | demo data |
| A. Keating | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +13 | attribute holding demo data |
| AK | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | demo data |
| AS | DATA |  | Main, WO-Detail-Artboard-v6, WO-Settings-Artboard-v6, flow0-10, flow0-11, flow0-11b +135 | demo data |
| Aberdeen Diesel Services LLC | DATA |  | flow0-4, hf-07 | demo data |
| Abode Trucking & Repair | DATA |  | flow0-4, hf-07 | demo data |
| Accounts Receivable | DATA |  | flow0-10, flow0-9, hf-10, rv-3-1 | attribute holding demo data |
| Admin ShopView | DATA |  | Main, WO-Detail-Artboard-v6, WO-Settings-Artboard-v6, flow0-10, flow0-11, flow0-11b +135 | attribute holding demo data |
| Affordable Fleet Services | DATA |  | flow0-1b, flow0-4, hf-02, hf-07, rv-1-2 | demo data |
| All locations | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | attribute holding demo data |
| Apex Freight Lines | DATA |  | flow4-7, flow5-3 | demo data |
| Apex Freight Lines · Unit 22 | DATA |  | flow4-9 | demo data |
| Ave Maria Truck Repair | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| Brake caliper (special order) | DATA |  | flow1-3e | demo data |
| Brake pads | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| Calgary | DATA |  | flow0-7 | demo data |
| Caliper (special order) | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +40 | demo data |
| Comeback | DATA |  | flow0-10, flow0-2b, flow0-2c, flow0-9, flow2-2, flow4-5 +16 | demo data |
| Company Vehicle Maintenance | DATA |  | flow0-10, flow0-11, flow0-2a, flow0-2d, flow0-2e, flow0-9 +13 | demo data |
| Core · Brake caliper | DATA |  | flow1-3e | demo data |
| Customer asked to be called before any extra work. | DATA |  | flow6-5, hf-34, rv-6-5 | demo data |
| Customers (1735) | DATA |  | flow5-1, hf-40 | demo data |
| Default Tax Settings | DATA |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | attribute holding demo data |
| EST-S2-34918 | DATA |  | flow1-3d, flow1-4, hf-15 | demo data |
| Ford E-250 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| Ford Transit | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +11 | demo data |
| Forklift | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| Forklift 2 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-11b, flow1-1, flow1-2a, flow1-2b +15 | demo data |
| Forklift 2 · Staging Heavy Duty Fleet · Serial 8FGU25-71244 | DATA |  | flow0-11b, hf-09, rv-3-3 | demo data |
| Freightliner Cascadia | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +11 | demo data |
| Gasket kit | DATA |  | flow1-6e | demo data |
| General Internal | DATA |  | flow0-10, flow0-2a, flow0-2d, flow0-2e, flow0-9, hf-04 +3 | demo data |
| Goodwill | DATA |  | flow0-10, flow0-2b, flow0-2c, flow0-9, flow2-2, flow4-5 +16 | demo data |
| Heavy Duty | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | demo data |
| Hilltop Logistics | DATA |  | flow0-1b, flow0-4, flow1-1, flow1-2a, flow1-2e, flow2-1 +41 | demo data |
| Hilltop Logistics · Truck 4, 2019 Kenworth T680 | DATA |  | flow1-2e, flow2-4b, hf-20, hf-27, rv-3-6, rv-5-1 | demo data |
| Hilltop Logistics · Unit 7 | DATA |  | flow4-10, flow4-11, flow4-9 | demo data |
| Hyundai Santa Fe | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| INV-7731 | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| J. Alvarez | DATA |  | flow4-4 | demo data |
| J. Okonkwo | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +19 | attribute holding demo data |
| JE-2041 | DATA |  | flow5-3b, hf-41, rv-7-3 | demo data |
| JE-2042 | DATA |  | flow5-3b, hf-41, rv-7-3 | demo data |
| JO | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +12 | demo data |
| Journal Entries (74) | DATA |  | flow5-1, hf-40 | demo data |
| Jun 4, 2026 | DATA |  | flow1-10b | demo data |
| K | DATA |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | demo data |
| Las Vegas | DATA |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | attribute holding demo data |
| Las Vegas, Nevada 89135 | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | demo data |
| Lines (1) | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +24 | demo data |
| Lines (2) | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +44 | demo data |
| M. Rhodes | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b +107 | attribute holding demo data |
| MR | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | demo data |
| Mario Jenkins | DATA |  | flow1-2d, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3 +44 | demo data |
| Millertown | DATA |  | flow0-4, hf-07 | demo data |
| Net 30 | DATA |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | attribute holding demo data |
| Nevada | DATA |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | attribute holding demo data |
| New Brunswick | DATA |  | flow0-4, hf-07 | demo data |
| North Jenniferland | DATA |  | flow0-4, hf-07 | demo data |
| Nova Scotia | DATA |  | flow0-4, hf-07 | demo data |
| Nunavut | DATA |  | flow0-4, hf-07 | demo data |
| Oct 1 to Oct 22, 2026 | DATA |  | flow4-4 | attribute holding demo data |
| Oct 1 to Oct 26, 2026 | DATA |  | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | attribute holding demo data |
| Oct 15, 2026 | DATA |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +5 | demo data |
| Oct 15, 2026 11:08 AM | DATA |  | flow2-3d, flow2-3e, hf-24, rv-4-5 | demo data |
| Oct 15, 2026 2:14 PM | DATA |  | flow6-5, hf-34, rv-6-5 | demo data |
| Oct 16, 2026 9:12 AM | DATA |  | flow2-3e | demo data |
| Oct 2, 2026 | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | demo data |
| Oct 2, 2026 9:40 AM | DATA |  | flow6-5, hf-34, rv-6-5 | demo data |
| Oct 20, 2026 | DATA |  | flow5-3 | demo data |
| Oct 22, 2026 | DATA |  | flow1-10b, flow1-6b, flow1-6c, flow1-6e, flow1-6f, flow1-6g +24 | demo data |
| Oct 23, 2026 | DATA |  | flow4-5, flow5-3c, hf-39, hf-41b, rv-7-2, rv-7-6 | demo data |
| Ontario | DATA |  | flow0-4, hf-07 | demo data |
| PM Service · 1.5 h | DATA |  | flow4-9 | demo data |
| Parts (1) | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +24 | demo data |
| Parts (4) | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +44 | demo data |
| Patriciashire | DATA |  | flow0-4, hf-07 | demo data |
| Priscillabury | DATA |  | flow0-4, hf-07 | demo data |
| Red Deer | DATA |  | flow0-7 | demo data |
| Replace - Brake caliper | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| Replace - Brake caliper · 1.0 h | DATA |  | flow4-9 | demo data |
| Replace - Brake pads and rotors | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| Replace turbo actuator | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +21 | demo data |
| Replace turbo actuator · 2.0 h | DATA |  | flow4-9 | demo data |
| Rotor | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| S2-30455 | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| S2-30455 · 02 | DATA |  | flow5-3c, hf-41b, rv-7-6 | demo data |
| S2-30455 · Aug 2, 2026 | DATA |  | flow6-6 | attribute holding demo data |
| S2-30455 · Aug 2, 2026 · Replace alternator | DATA |  | flow1-2e, flow2-2, flow2-3c, flow2-4b, flow6-2, hf-20 +9 | attribute holding demo data |
| S2-31207 | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| S2-31207 · Sep 18, 2026 · Replace turbo actuator | DATA |  | flow1-2e, flow2-4b, hf-20, hf-27, rv-3-6, rv-5-1 | demo data |
| S2-33590 | DATA |  | flow1-10b | demo data |
| S2-34374 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +11 | demo data |
| S2-34479 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| S2-34482 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| S2-34863 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +11 | demo data |
| S2-34870 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +17 | demo data |
| S2-34880 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | demo data |
| S2-34901 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| S2-34918 | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-10b, flow1-2a +83 | demo data |
| S2-34918 · Staging Heavy Duty Fleet | DATA |  | flow1-6 | demo data |
| S2-34918 · Unit 14 · In Progress | DATA |  | flow0-7 | demo data |
| S2-34920 | DATA |  | flow4-5, flow5-3c, hf-39, hf-41b, rv-7-2, rv-7-6 | demo data |
| S2-34951 · Unit 22 · Approved | DATA |  | flow0-7 | demo data |
| S2-35004 | DATA |  | flow4-10 | demo data |
| S2-35004 · Unit 14 · Estimate | DATA |  | flow0-7 | demo data |
| S2-35102 | DATA |  | flow1-1, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3 +37 | demo data |
| S2-36001 | DATA |  | flow4-7, flow4-9, flow5-1, hf-40 | demo data |
| Seized | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| Shop Equipment | DATA |  | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | demo data |
| Shop Equipment Maintenance | DATA |  | flow0-10, flow0-11b, flow0-2a, flow0-2d, flow0-2e, flow0-9 +6 | attribute holding demo data |
| Staging Heavy Duty - 9919 | DATA |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | demo data |
| Staging Heavy Duty Fleet | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-11, flow0-11b, flow0-1b, flow0-2a +74 | demo data |
| Staging Heavy Duty Fleet · Forklift 2 | DATA |  | flow4-11 | demo data |
| Staging Heavy Duty Fleet · Unit 12 | DATA |  | flow4-10 | demo data |
| Staging Heavy Duty Fleet · Unit 14 | DATA |  | flow4-10, flow4-11, flow4-9 | demo data |
| Staging Heavy Duty Internal | DATA |  | WO-Detail-Artboard-v6 | demo data |
| Staging Main | DATA |  | flow0-2c, flow0-2d, hf-06, rv-2-3 | demo data |
| Staging North | DATA |  | flow0-2c, flow0-2d, hf-06, rv-2-3 | demo data |
| Standard · $149.95/h | DATA |  | flow6-6 | attribute holding demo data |
| Standard, $149.95/h | DATA |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | attribute holding demo data |
| Suite 079 | DATA |  | flow0-4, hf-07 | demo data |
| Suite 450-B | DATA |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | attribute holding demo data |
| Thursday, Oct 22, 2026 | DATA |  | flow4-11 | demo data |
| Today | DATA |  | flow5-1, hf-40 | demo data |
| Toronto | DATA |  | flow0-4, hf-07 | demo data |
| Toyota | DATA |  | flow0-11b, hf-09, rv-3-3 | attribute holding demo data |
| Toyota 8FGU25 forklift | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-11b, flow1-1, flow1-2a, flow1-2b +16 | demo data |
| Toyota 8FGU25 forklift, Forklift 2 | DATA |  | flow1-2b, flow1-2b2, hf-12, hf-13, rv-3-4, rv-3-5 | attribute holding demo data |
| Turbo actuator | DATA |  | flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3, flow2-3b +21 | demo data |
| Undeposited Funds | DATA |  | flow0-10, flow0-9, hf-10, rv-3-1 | attribute holding demo data |
| Unit 12 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +15 | demo data |
| Unit 14 | DATA |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b +45 | demo data |
| Unit 14 · 2017 Ford Transit | DATA |  | flow4-7, flow4-8 | demo data |
| Unit 14 · Staging Heavy Duty Fleet · VIN 2ZTM0GN6FHYZT4KXE | DATA |  | flow1-10b | demo data |
| Unit 22 · 2020 Kenworth T680 | DATA |  | flow4-7 | demo data |
| Unit 7 | DATA |  | flow1-1, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3 +27 | demo data |
| Unit 7 · 2019 Freightliner Cascadia | DATA |  | flow4-7 | demo data |
| United States | DATA |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | attribute holding demo data |
| Vendors (670) | DATA |  | flow5-1, hf-40 | demo data |
| Vincenttown | DATA |  | flow0-4, hf-07 | demo data |
| Warranty | DATA |  | flow0-10, flow0-2b, flow0-2c, flow0-9, flow1-2e, flow2-2 +29 | demo data |
| Worn | DATA |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +41 | demo data |
| Yesterday | DATA |  | flow5-1, hf-40 | demo data |
| ZZAUTOTEST Bridgeport Hauling | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +10 | demo data |
| ZZAUTOTEST Bridgeport Hauling · ZZT-4471 | DATA |  | flow4-10 | demo data |
| ZZT-4471 | DATA |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +9 | demo data |
| qb | DATA |  | flow0-11b, flow0-2, flow0-2a, flow0-2b, flow0-2c, flow0-2d +12 | demo data |
| · 02 | DATA |  | flow4-5, hf-39, rv-7-2 | demo data |
| — | DATA |  | flow1-10b | demo data |
| ⌘ | DATA |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | demo data |
| AccountingHub · Sales > Invoices | LOOK-ONLY |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | hub breadcrumb (S8-R1 names Accounting > Sales > Invoices) |
| Categories for work that is not billed: your own equipment (Internal) and a customer's free job (No Charge). Each category names the expense account its parts cost posts to. | LOOK-ONLY |  | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | page intro (PRD S1-R13 gives no intro) |
| Defaults to the customer's Min shop supplies charge. Posted as an expense at Close. | LOOK-ONLY |  | flow1-3, hf-14 | helper under Shop supplies (agrees with S10-R1/R4) |
| Expense account | LOOK-ONLY |  | flow5-3c, hf-41b, rv-7-6 | column header of the No Charge lines block (S8-R7 "expense account") |
| Name * | LOOK-ONLY |  | flow0-2c, flow0-2d, hf-06, rv-2-3 | required marker on Name (S1-R14 "Name (required") |
| Parts cost, No Charge line 02 (Warranty) | LOOK-ONLY |  | flow5-3c, hf-41b, rv-7-6 | journal line description on the hub record (PRD silent; S8-R7 names the source "No Charge line") |
| Shown for categories that require it. Changing to Goodwill clears it. | LOOK-ONLY |  | flow2-3c, hf-25, rv-4-3 | helper in Change category (agrees with S2-R6) |
| Skipped, nothing posted | LOOK-ONLY |  | flow1-6e | note on the Parts with no cost row (agrees with S3-E2) |
| The QuickBooks column shows Staging Main, the location you are in; the dialog sets every location. Archived categories stay on the work orders that used them and in reports. | LOOK-ONLY |  | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | note under the list; agrees with S1-R13 (column per current location, archived kept) |
| Then the line on it, if you know it: it sets the original technician. | LOOK-ONLY |  | flow2-4b, hf-27, rv-5-1 | helper under Original line at Close (agrees with S2-R17) |
| Why a customer's work order is free. Picked when a work order is marked No Charge. Categories that require the original work order ask which earlier work order the job comes from. | LOOK-ONLY |  | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | list help (PRD silent) |
| Work order closed | LOOK-ONLY |  | flow5-4, hf-42, rv-7-4 | hub event name (PRD silent) |
| A/P Aging Detail | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| A/P Aging Summary | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| A/P Unpaid Invoices | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| A/R Aging Collection | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| A/R Aging Detail | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| A/R Aging Summary | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| About Internal customer | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | accessible name of an existing control (not on screen) |
| About No Charge | OUT-OF-SCOPE |  | flow1-2a, flow1-2e, hf-20, rv-3-6 | accessible name of an existing control (not on screen) |
| About internal work orders | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow1-2b, flow1-2b2, hf-12, hf-13, rv-3-4 +1 | accessible name of an existing control (not on screen) |
| Account | OUT-OF-SCOPE |  | flow0-2c, flow0-2d, flow5-3b, flow5-3c, hf-06, hf-41 +4 | label of today's screen, unchanged by the feature |
| Account Receivable | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Accounting Events | OUT-OF-SCOPE |  | flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| AccountingHub | OUT-OF-SCOPE |  | flow5-3, flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| Accounts receivable | OUT-OF-SCOPE |  | flow5-3c, hf-41b, rv-7-6 | label of today's screen, unchanged by the feature |
| Actions | OUT-OF-SCOPE |  | flow1-10b | label of today's screen, unchanged by the feature |
| Actual/Estimate | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +46 | label of today's screen, unchanged by the feature |
| Add | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow1-2a, flow1-2b, flow1-2b2, flow1-2e, flow2-3d +12 | label of today's screen, unchanged by the feature |
| Add Work Order Fee / Discount | OUT-OF-SCOPE |  | flow2-1, flow2-1b, flow2-1c, hf-21, rv-4-1 | label of today's screen, unchanged by the feature |
| Add a note | OUT-OF-SCOPE |  | flow2-3d, flow2-3e, flow6-5, hf-24, hf-34, rv-4-5 +1 | label of today's screen, unchanged by the feature |
| Address | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-7, flow0-8, flow1-2c +30 | label of today's screen, unchanged by the feature |
| Address 1 | OUT-OF-SCOPE |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | label of today's screen, unchanged by the feature |
| Address 2 | OUT-OF-SCOPE |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | label of today's screen, unchanged by the feature |
| Advanced mapping | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Advisor Analysis | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| All | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +22 | label of today's screen, unchanged by the feature |
| Amount | OUT-OF-SCOPE |  | flow6-7, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Approve | OUT-OF-SCOPE |  | flow2-7b | label of today's screen, unchanged by the feature |
| Approved | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b +52 | label of today's screen, unchanged by the feature |
| Asset | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +43 | label of today's screen, unchanged by the feature |
| Asset Here? | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow1-2a, flow1-2b, flow1-2b2, flow1-2e, hf-12 +5 | label of today's screen, unchanged by the feature |
| Asset Types | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Asset on site | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Asset type | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Assets | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +19 | label of today's screen, unchanged by the feature |
| Assigned to me | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Audit Log | OUT-OF-SCOPE |  | flow1-3c, flow2-1, flow2-1b, flow2-1c, flow2-3b, hf-21 +3 | label of today's screen, unchanged by the feature |
| Back | OUT-OF-SCOPE |  | flow4-7, flow4-8 | accessible name of an existing control (not on screen) |
| Bill to | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | label of today's screen, unchanged by the feature |
| Billed hours | OUT-OF-SCOPE |  | flow4-4 | label of today's screen, unchanged by the feature |
| Bin Locations | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Cancel | OUT-OF-SCOPE |  | flow0-2c, flow0-2d, flow0-8, flow1-2c, flow1-2d, flow1-6 +30 | label of today's screen, unchanged by the feature |
| Canned Lines | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Categories | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Category actions | OUT-OF-SCOPE |  | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | accessible name of an existing control (not on screen) |
| Change Customer | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | accessible name of an existing control (not on screen) |
| City | OUT-OF-SCOPE |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | label of today's screen, unchanged by the feature |
| Clock In | OUT-OF-SCOPE |  | flow4-9 | label of today's screen, unchanged by the feature |
| Clocked hours | OUT-OF-SCOPE |  | flow4-4 | label of today's screen, unchanged by the feature |
| Close | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow0-11, flow0-11b, flow0-1b, flow0-2c, flow0-2d +53 | accessible name of an existing control (not on screen) |
| Columns | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | accessible name of an existing control (not on screen) |
| Complete | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +19 | label of today's screen, unchanged by the feature |
| Completed | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +31 | label of today's screen, unchanged by the feature |
| Contact | OUT-OF-SCOPE |  | flow1-2d, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3 +44 | label of today's screen, unchanged by the feature |
| Contacts | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Continue | OUT-OF-SCOPE |  | flow1-2c, flow1-2d | label of today's screen, unchanged by the feature |
| Cost | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Cost of Goods (tax) | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Cost of Parts | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Cost of parts, billable lines | OUT-OF-SCOPE |  | flow5-3c, hf-41b, rv-7-6 | label of today's screen, unchanged by the feature |
| Country | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Create Work Order | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Create invoice | OUT-OF-SCOPE |  | flow1-2d, flow2-1, flow2-1b, flow2-1c, flow2-2, flow2-3e +23 | label of today's screen, unchanged by the feature |
| Credit | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Credit Limit | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Credit Terms | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Customer | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-11b, flow1-1, flow1-10b, flow1-2a +30 | label of today's screen, unchanged by the feature |
| Customer Deposits Liability | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Customer Name | OUT-OF-SCOPE |  | flow0-4, hf-07 | label of today's screen, unchanged by the feature |
| Customer PO | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +11 | label of today's screen, unchanged by the feature |
| Customer portal | OUT-OF-SCOPE |  | flow2-7b | label of today's screen, unchanged by the feature |
| Customers | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | label of today's screen, unchanged by the feature |
| Date | OUT-OF-SCOPE |  | flow1-10b, flow5-1, flow5-3, flow5-4, hf-40, hf-42 +1 | label of today's screen, unchanged by the feature |
| Date range | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, hf-39, hf-39b, rv-7-2 +1 | label of today's screen, unchanged by the feature |
| Date: | OUT-OF-SCOPE |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +12 | label of today's screen, unchanged by the feature |
| Debit | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Decline | OUT-OF-SCOPE |  | flow2-7b | label of today's screen, unchanged by the feature |
| Default Labor Rate | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Default Shop Supplies | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Delete | OUT-OF-SCOPE |  | flow0-11, flow0-11b, flow0-5, flow0-6, flow0-8, hf-08 +3 | label of today's screen, unchanged by the feature |
| Delete line | OUT-OF-SCOPE |  | flow6-1, flow6-4, hf-30, hf-33, rv-6-1, rv-6-4 | label of today's screen, unchanged by the feature |
| Departments | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +21 | label of today's screen, unchanged by the feature |
| Description | OUT-OF-SCOPE |  | flow2-7b, flow5-3b, flow5-3c, flow6-6, hf-41, hf-41b +2 | label of today's screen, unchanged by the feature |
| Details | OUT-OF-SCOPE |  | flow0-11b, flow1-10b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Discount | OUT-OF-SCOPE |  | flow1-10b | label of today's screen, unchanged by the feature |
| Download | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | accessible name of an existing control (not on screen) |
| Download PDF | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Draft | OUT-OF-SCOPE |  | flow5-3 | label of today's screen, unchanged by the feature |
| Duplicate line | OUT-OF-SCOPE |  | flow6-1, flow6-4, hf-30, hf-33, rv-6-1, rv-6-4 | label of today's screen, unchanged by the feature |
| Edit | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-7, flow0-8, hf-08 +1 | label of today's screen, unchanged by the feature |
| Edit Asset | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Edit Customer | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Edit Line | OUT-OF-SCOPE |  | flow6-6 | label of today's screen, unchanged by the feature |
| Edit line | OUT-OF-SCOPE |  | flow6-1, flow6-4, hf-30, hf-33, rv-6-1, rv-6-4 | label of today's screen, unchanged by the feature |
| Efficiency | OUT-OF-SCOPE |  | flow4-4 | label of today's screen, unchanged by the feature |
| Email | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | accessible name of an existing control (not on screen) |
| Engine Hours * | OUT-OF-SCOPE |  | flow1-6 | label of today's screen, unchanged by the feature |
| Engine hours | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Engine hours will be a required field before a line can be completed on a work order | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Entry | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Error | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Estimate | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +13 | label of today's screen, unchanged by the feature |
| Estimate EST-S2-34918 | OUT-OF-SCOPE |  | flow6-7, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Estimate date: | OUT-OF-SCOPE |  | flow1-3d, flow1-4, hf-15 | label of today's screen, unchanged by the feature |
| Estimate/Invoice | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow6-7, hf-15, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Estimate: | OUT-OF-SCOPE |  | flow1-3d, flow1-4, hf-15 | label of today's screen, unchanged by the feature |
| Estimated hours | OUT-OF-SCOPE |  | flow6-6 | label of today's screen, unchanged by the feature |
| Estimates | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Event | OUT-OF-SCOPE |  | flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| Export | OUT-OF-SCOPE |  | flow4-5, flow4-6, flow5-1, hf-39, hf-39b, hf-40 +2 | label of today's screen, unchanged by the feature |
| Export Manually | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Export Reports | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| FINANCE | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Fees & Discounts | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Finance | OUT-OF-SCOPE |  | Main, WO-Detail-Artboard-v6, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2 +97 | label of today's screen, unchanged by the feature |
| Financial Info | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Hours | OUT-OF-SCOPE |  | flow2-7b, flow4-5, flow5-3c, hf-39, hf-41b, rv-7-2 +1 | label of today's screen, unchanged by the feature |
| IBS | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-11, flow0-12, flow0-1b +27 | label of today's screen, unchanged by the feature |
| IBS Batches | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| IMPORTS | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| INTEGRATIONS | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Imports | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| In Progress | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +54 | label of today's screen, unchanged by the feature |
| In progress | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +12 | label of today's screen, unchanged by the feature |
| Inspection Templates | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Integrations | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Inventory | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Inventory Asset | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Inventory Value | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Invoice | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Invoice # | OUT-OF-SCOPE |  | flow1-10b, flow5-3 | label of today's screen, unchanged by the feature |
| Invoice Date | OUT-OF-SCOPE |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +2 | label of today's screen, unchanged by the feature |
| Invoice actions | OUT-OF-SCOPE |  | flow2-5, hf-29, rv-5-4 | accessible name of an existing control (not on screen) |
| Invoice date | OUT-OF-SCOPE |  | flow5-3c, hf-41b, rv-7-6 | label of today's screen, unchanged by the feature |
| Invoiced | OUT-OF-SCOPE |  | flow1-9, flow4-10, hf-19, rv-5-5 | label of today's screen, unchanged by the feature |
| Invoices | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-11b, flow0-12, flow0-1b, flow0-2 +22 | label of today's screen, unchanged by the feature |
| Item | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Journal Entry | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Journal entry | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Labor | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Labor Rates | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Labor rate | OUT-OF-SCOPE |  | flow6-6 | label of today's screen, unchanged by the feature |
| Lead Technician | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b +96 | label of today's screen, unchanged by the feature |
| License plate | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Line | OUT-OF-SCOPE |  | flow2-7b, flow4-5, flow5-3c, hf-39, hf-41b, rv-7-2 +1 | label of today's screen, unchanged by the feature |
| Line Requirements | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Line actions | OUT-OF-SCOPE |  | flow6-1, flow6-4, hf-30, hf-33, rv-6-1, rv-6-4 | accessible name of an existing control (not on screen) |
| Line total | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow6-7, hf-15, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Lines | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Location | OUT-OF-SCOPE |  | flow0-7, flow4-5, flow4-6, hf-39, hf-39b, rv-7-2 +1 | label of today's screen, unchanged by the feature |
| Locations | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +21 | label of today's screen, unchanged by the feature |
| Make | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| Mark As Exported | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Mark Reviewed | OUT-OF-SCOPE |  | flow1-4b | label of today's screen, unchanged by the feature |
| Mark as Exported | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Max | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Mileage | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Mileage * | OUT-OF-SCOPE |  | flow1-6 | label of today's screen, unchanged by the feature |
| Mileage will be a required field before a line can be completed on a work order | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Min | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Missing Details | OUT-OF-SCOPE |  | flow1-6 | label of today's screen, unchanged by the feature |
| Model | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| More actions | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | accessible name of an existing control (not on screen) |
| My assigned lines | OUT-OF-SCOPE |  | flow4-9 | label of today's screen, unchanged by the feature |
| Name | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Name/Description | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +46 | label of today's screen, unchanged by the feature |
| New Customer | OUT-OF-SCOPE |  | flow0-4, hf-07 | label of today's screen, unchanged by the feature |
| New Line | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| New work order | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow1-2a, flow1-2b, flow1-2b2, flow1-2e, hf-12 +5 | label of today's screen, unchanged by the feature |
| No work orders match these filters | OUT-OF-SCOPE |  | flow4-3 | label of today's screen, unchanged by the feature |
| No. | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Notes | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow0-11, flow0-5, flow0-6, flow0-8, flow1-2c +89 | label of today's screen, unchanged by the feature |
| Number | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +22 | label of today's screen, unchanged by the feature |
| On Site | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Open API | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +21 | label of today's screen, unchanged by the feature |
| Open in ShopView | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Organization | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| PARTS | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| PO is required | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Paid | OUT-OF-SCOPE |  | flow1-9, flow5-3, flow5-3c, hf-19, hf-41b, rv-5-5 +1 | label of today's screen, unchanged by the feature |
| Partially paid | OUT-OF-SCOPE |  | flow5-3 | label of today's screen, unchanged by the feature |
| Parts | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | label of today's screen, unchanged by the feature |
| Parts Velocity | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Payment Methods | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Phone | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-7, flow0-8, flow1-2c +80 | label of today's screen, unchanged by the feature |
| Pick the bank account refunds are paid from. | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Posted | OUT-OF-SCOPE |  | flow5-3 | label of today's screen, unchanged by the feature |
| Preview | OUT-OF-SCOPE |  | flow5-3b, flow5-3c, hf-41, hf-41b, rv-7-3, rv-7-6 | label of today's screen, unchanged by the feature |
| Pricing | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Primary | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | accessible name of an existing control (not on screen) |
| Print | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | accessible name of an existing control (not on screen) |
| Print Work Order | OUT-OF-SCOPE |  | flow1-3c, flow2-1, flow2-1b, flow2-1c, flow2-3b, hf-21 +3 | label of today's screen, unchanged by the feature |
| QB Unexported | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Qty | OUT-OF-SCOPE |  | flow2-7b | label of today's screen, unchanged by the feature |
| Qty / Hours | OUT-OF-SCOPE |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +12 | label of today's screen, unchanged by the feature |
| QuickBooks | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-11b, flow0-12, flow0-1b +24 | label of today's screen, unchanged by the feature |
| QuickBooks Accounts | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Quickbooks Unexported Items | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Rate | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3e +49 | label of today's screen, unchanged by the feature |
| Ready for Review | OUT-OF-SCOPE |  | flow1-4b | label of today's screen, unchanged by the feature |
| Reason | OUT-OF-SCOPE |  | flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| Received Payments | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Reference | OUT-OF-SCOPE |  | flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| Refresh From QuickBooks | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Refunds Paid From | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Reminders | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Reports | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | label of today's screen, unchanged by the feature |
| Require Approval for New Lines | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Engine Hours | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Mileage | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Ordering Parts | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Picking Inventory Parts | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Receiving Parts Before Completion | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Review Before Completion | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Require Tech Story | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Retry | OUT-OF-SCOPE |  | flow5-4, hf-42, rv-7-4 | label of today's screen, unchanged by the feature |
| Revenue | OUT-OF-SCOPE |  | flow5-3c, hf-41b, rv-7-6 | label of today's screen, unchanged by the feature |
| Revenue, labor and parts | OUT-OF-SCOPE |  | flow5-3c, hf-41b, rv-7-6 | label of today's screen, unchanged by the feature |
| Review | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +12 | label of today's screen, unchanged by the feature |
| Roles & Permissions | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +21 | label of today's screen, unchanged by the feature |
| SERVICE | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| SETTINGS | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Sales | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Sales By Customer | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Sales By Representative | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Sales Representative | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| Sales Tax Collected | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Save | OUT-OF-SCOPE |  | New-WO-Dialog-v6, flow0-10, flow0-11, flow0-11b, flow0-1b, flow0-2c +29 | label of today's screen, unchanged by the feature |
| Save Settings | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Schedule | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | label of today's screen, unchanged by the feature |
| Search | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +158 | label of today's screen, unchanged by the feature |
| Search customers | OUT-OF-SCOPE |  | flow0-1b, hf-02, rv-1-2 | label of today's screen, unchanged by the feature |
| Search customers, work orders, parts... | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Select Account | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Send to Portal | OUT-OF-SCOPE |  | flow2-7 | label of today's screen, unchanged by the feature |
| Service | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Service Advisor | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Settings | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +30 | label of today's screen, unchanged by the feature |
| Shop Efficiency | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Shop logo | OUT-OF-SCOPE |  | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +15 | accessible name of an existing control (not on screen) |
| ShopView | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +23 | accessible name of an existing control (not on screen) |
| ShopView Accounts | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| Shopview | OUT-OF-SCOPE |  | Main, WO-Detail-Artboard-v6, WO-Settings-Artboard-v6, flow0-10, flow0-11, flow0-11b +136 | accessible name of an existing control (not on screen) |
| Staff | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-12, flow0-1b, flow0-2 +21 | label of today's screen, unchanged by the feature |
| Started | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| State/Province | OUT-OF-SCOPE |  | flow0-11, flow0-4, flow0-5, flow0-6, flow0-8, hf-07 +2 | label of today's screen, unchanged by the feature |
| Stats | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Status | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow1-1, flow1-10b, flow1-2a +73 | label of today's screen, unchanged by the feature |
| Summary | OUT-OF-SCOPE |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +15 | label of today's screen, unchanged by the feature |
| Synced | OUT-OF-SCOPE |  | flow5-3 | label of today's screen, unchanged by the feature |
| System | OUT-OF-SCOPE |  | flow2-3d, flow2-3e, flow6-5, hf-24, hf-34, rv-4-5 +1 | label of today's screen, unchanged by the feature |
| Tax | OUT-OF-SCOPE |  | flow6-7, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Tax rate | OUT-OF-SCOPE |  | flow1-10b | label of today's screen, unchanged by the feature |
| Taxes | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-10, flow0-11, flow0-12, flow0-1b +27 | label of today's screen, unchanged by the feature |
| Tech View | OUT-OF-SCOPE |  | flow4-9 | label of today's screen, unchanged by the feature |
| Tech story will be a required field before a line can be completed on a work order | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Technician | OUT-OF-SCOPE |  | flow4-11, flow4-4, flow6-6 | label of today's screen, unchanged by the feature |
| Technician Efficiency | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Technician Utilization | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Telephone | OUT-OF-SCOPE |  | flow0-4, hf-07 | label of today's screen, unchanged by the feature |
| The Class mapped in your Bookkeeping settings no longer exists in QuickBooks | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| The account period has closed and the account books cannot be updated. | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Timesheet Activities | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Timesheets | OUT-OF-SCOPE |  | flow1-3c, flow2-1, flow2-1b, flow2-1c, flow2-3b, hf-21 +3 | label of today's screen, unchanged by the feature |
| Title * | OUT-OF-SCOPE |  | flow6-6 | label of today's screen, unchanged by the feature |
| Total | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +78 | label of today's screen, unchanged by the feature |
| Total Hours | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Total balance | OUT-OF-SCOPE |  | flow1-10b | label of today's screen, unchanged by the feature |
| Total due | OUT-OF-SCOPE |  | flow6-7, hf-35, rv-6-6 | label of today's screen, unchanged by the feature |
| Total price | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | label of today's screen, unchanged by the feature |
| Try removing a filter to widen your results. | OUT-OF-SCOPE |  | flow4-3 | label of today's screen, unchanged by the feature |
| Type | OUT-OF-SCOPE |  | flow5-1, hf-40 | label of today's screen, unchanged by the feature |
| Unit | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Unit # | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow0-11b, flow1-1, flow1-2a, flow1-2b +19 | label of today's screen, unchanged by the feature |
| Updated from QuickBooks 2 minutes ago | OUT-OF-SCOPE |  | flow0-10, flow0-9, hf-10, rv-3-1 | label of today's screen, unchanged by the feature |
| User menu | OUT-OF-SCOPE |  | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-2a, flow1-2b, flow1-2b2 +16 | accessible name of an existing control (not on screen) |
| VIN | OUT-OF-SCOPE |  | flow1-6 | label of today's screen, unchanged by the feature |
| VIN / Serial # | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| VIN/Serial # | OUT-OF-SCOPE |  | WO-Detail-Artboard-v6, flow1-2c, flow1-2d, flow1-3, flow1-3c, flow1-3d +74 | label of today's screen, unchanged by the feature |
| Vendors | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +17 | label of today's screen, unchanged by the feature |
| Void | OUT-OF-SCOPE |  | flow5-3 | label of today's screen, unchanged by the feature |
| Website | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| When on, each part must be recorded as received before the work order can be completed, reviewed or invoiced. When off, you can finish the work order and receive later. | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| When on, new work order lines require approval. When off, they are auto-approved. | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| When on, you click Order on each part to record that you've ordered it. When off, parts are marked as ordered automatically. | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| When on, you click Pick on each inventory and found part to record that it's been pulled. When off, these parts are ready as soon as the line is approved. | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Work In Progress | OUT-OF-SCOPE |  | flow4-4, flow4-5, flow4-6, flow5-1, hf-39, hf-39b +3 | label of today's screen, unchanged by the feature |
| Work Order | OUT-OF-SCOPE |  | flow1-3d, flow1-4, hf-15 | label of today's screen, unchanged by the feature |
| Work Orders | OUT-OF-SCOPE |  | Main, New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, WO-Settings-Artboard-v6, flow0-10 +159 | label of today's screen, unchanged by the feature |
| Work Orders · Board | OUT-OF-SCOPE |  | flow4-10 | label of today's screen, unchanged by the feature |
| Work orders must be reviewed and signed off before they can be completed | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Work performed | OUT-OF-SCOPE |  | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +12 | label of today's screen, unchanged by the feature |
| Work summary | OUT-OF-SCOPE |  | flow1-3d, flow1-4, hf-15 | label of today's screen, unchanged by the feature |
| Workflow | OUT-OF-SCOPE |  | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-3 +6 | label of today's screen, unchanged by the feature |
| Year | OUT-OF-SCOPE |  | flow0-11b, hf-09, rv-3-3 | label of today's screen, unchanged by the feature |
| ZIP/Postal Code | OUT-OF-SCOPE |  | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | label of today's screen, unchanged by the feature |
| 2 open internal work orders for Staging Heavy Duty Fleet stay internal and close without an invoice. New work orders for Staging Heavy Duty Fleet will be billable. | PRD-MATCH | S1-R12, §8-06 | flow0-8 | PRD words, exact letter case (template with demo data) |
| 3 open work orders for Staging Heavy Duty Fleet are billable. Make them internal? | PRD-MATCH | S1-R11, §8-04 | flow0-7 | PRD words, exact letter case (template with demo data) |
| Already posted to 6500 Vehicle Expenses at the vendor bill | PRD-MATCH | S3-R2 | flow1-6b, flow1-6e, flow1-6f, hf-17, rv-5-2 | PRD words, exact letter case (template with demo data) |
| Billable | PRD-MATCH | OV, KD, TERM, S1-R11, S2-DESIGN, S2-R6 | flow4-1, flow5-3c, hf-41b, rv-7-6 | PRD words, exact letter case |
| By technician | PRD-MATCH | OV, KD, S9-R2, S9-R16, S9-N3, S12-DESIGN | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | PRD words, exact letter case |
| By work order and line | PRD-MATCH | S9-R2 | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | PRD words, exact letter case |
| Categories are mapped to QuickBooks expense accounts. This one is where the asset's internal work orders post. Leave it empty to use the customer's category, Company Vehicle Maintenance. | PRD-MATCH | S1-R15 | flow0-11b, hf-09, rv-3-3 | PRD words, exact letter case (template with demo data) |
| Category | PRD-MATCH | TERM, S1-R13, S1-R14, S2-DESIGN, S2-R2, S2-R4 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, flow4-5 +17 | PRD words, exact letter case |
| Category * | PRD-MATCH | S12-R1 | flow1-2e, flow2-2, flow2-3c, flow6-2, flow6-6, hf-20 +7 | PRD words, exact letter case |
| Category: Warranty · Original work order S2-30455 | PRD-MATCH | S1-R13, S12-R1, S12-R2, S2-R16, S2-R2, S2-R5 | flow2-7b | PRD words, exact letter case (template with demo data) |
| Change category | PRD-MATCH | KD, S1-R11, S2-DESIGN, S2-R3, S2-R6, S2-R8 | flow2-3b, flow6-4, hf-26, hf-33, rv-4-4, rv-6-4 | PRD words, exact letter case |
| Change category for work order S2-35102 | PRD-MATCH | S2-R6, §8-11 | flow2-3c, hf-25, rv-4-3 | PRD words, exact letter case (template with demo data) |
| Change where the cost is posted? | PRD-MATCH | S2-R8 | flow1-2c, flow1-2d | PRD words, exact letter case |
| Classification | PRD-MATCH | TERM, S2-DESIGN, S2-R14, S8-R6, S9-R2, S9-R6 | flow1-1, flow1-2a, flow1-2b, flow1-2b2, flow1-2e, flow1-9 +26 | PRD words, exact letter case |
| Close Work Order | PRD-MATCH | OV, KD, TERM, S3-DESIGN, S3-EH, S3-R1 | WO-Detail-Artboard-v6, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +24 | PRD words, exact letter case |
| Close work order S2-34918? | PRD-MATCH | S3-R2 | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +2 | PRD words, exact letter case (template with demo data) |
| Close work order S2-35102? | PRD-MATCH | S3-R2 | flow2-4, flow2-4b, hf-27, hf-28, rv-5-1 | PRD words, exact letter case (template with demo data) |
| Closed | PRD-MATCH | OV, OOS, KD, TERM, S1-N5, S1-E1 | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-10b, flow1-2a, flow1-2b +32 | PRD words, exact letter case |
| Closed / invoiced | PRD-MATCH | S9-R2 | flow4-5, hf-39, rv-7-2 | PRD words, exact letter case |
| Closed on Oct 22, 2026. To change it, reopen it from the Finance tab. | PRD-MATCH | S2-R9, §8-23 | flow2-6, flow3-1, hf-36 | PRD words, exact letter case (template with demo data) |
| Comeback lines | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Comeback rate | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Completed lines | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Convert to Billable | PRD-MATCH | OV, KD, S1-R11, S2-DESIGN, S2-R6, S2-R18 | flow2-3b, hf-26, rv-4-4 | PRD words, exact letter case |
| Convert to No Charge | PRD-MATCH | OV, KD, S2-DESIGN, S2-R5, S2-R17, S2-R18 | flow2-1, flow2-1b, flow2-2, hf-21, hf-22, rv-4-1 +1 | PRD words, exact letter case |
| Convert work order S2-35102 to billable? | PRD-MATCH | S2-R6 | flow2-3b, hf-26, rv-4-4 | PRD words, exact letter case (template with demo data) |
| Converted to No Charge by Admin ShopView. Category Warranty, original work order S2-30455. Prices, fees and discounts removed; costs and hours kept. | PRD-MATCH | S2-R18 | flow2-3d, flow2-3e, hf-24, rv-4-5 | PRD words, exact letter case (template with demo data) |
| Could not close the work order. Try again. | PRD-MATCH | S3-EH, §8-42 | flow1-S2 | PRD words, exact letter case |
| Default | PRD-MATCH | S1-R7, S1-R13, S1-R14 | flow0-10, flow0-2a, flow0-2d, flow0-2e, flow0-9, hf-04 +3 | PRD words, exact letter case |
| Default category | PRD-MATCH | S1-R14 | flow0-2d | PRD words, exact letter case |
| Default internal category | PRD-MATCH | S1-R7 | flow0-11 | PRD words, exact letter case |
| Deposit: stays billable | PRD-MATCH | S1-R11, §8-05 | flow0-7 | PRD words, exact letter case |
| Dismissed | PRD-MATCH | S4-R3, S4-E1, S8-DESIGN, S8-R3, S8-R7, S8-N2 | flow5-4, hf-42, rv-7-4 | PRD words, exact letter case |
| Do this later | PRD-MATCH | S1-R2, S1-R5, §8-01 | flow0-1b, hf-02, rv-1-2 | PRD words, exact letter case |
| Estimate S2-35102 | PRD-MATCH | OV, S1-R11, TERM | flow2-7, flow2-7b | PRD words, exact letter case (template with demo data) |
| Held | PRD-MATCH | S4-R3, S8-DESIGN, S8-EH, S8-R3, S8-N2, S8-E2 | flow5-4, hf-42, rv-7-4 | PRD words, exact letter case |
| Hide | PRD-MATCH | KD, TERM, S9-R3 | flow4-4 | PRD words, exact letter case |
| Hours only | PRD-MATCH | S3-R2 | WO-Detail-Artboard-v6, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +45 | PRD words, exact letter case |
| Hours only, nothing posted | PRD-MATCH | S3-R2 | flow1-6b, flow1-6e, flow1-6f, flow1-6g, flow2-4, flow2-4b +5 | PRD words, exact letter case |
| Internal | PRD-MATCH | OV, OOS, KD, TERM, S1-DESIGN, S1-EH | New-WO-Dialog-v6, WO-Detail-Artboard-v6, WO-List-Artboard-v6, flow0-11, flow0-4, flow0-5 +67 | PRD words, exact letter case |
| Internal Work Order S2-34918 | PRD-MATCH | HEADER, KD, OV, S1-N4, S1-R1, S1-R13 | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +5 | PRD words, exact letter case (template with demo data) |
| Internal Work Orders | PRD-MATCH | OV, KD, TERM, S1-R1, S1-R3, S1-R13 | Main, WO-Settings-Artboard-v6, flow0-12, flow0-1b, flow0-2, flow0-2a +23 | PRD words, exact letter case |
| Internal categories | PRD-MATCH | OV, TERM, S1-R7, S1-R13, S1-R15 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | PRD words, exact letter case |
| Internal category | PRD-MATCH | S1-R14, S1-R15, S1-R16, S2-R1, S2-R16, S12-E8 | flow0-11b, hf-09, rv-3-3 | PRD words, exact letter case |
| Internal customer | PRD-MATCH | OV, KD, TERM, S1-EH, S1-R2, S1-R4 | flow0-11, flow0-5, flow0-6, flow0-8, hf-08, rv-3-2 | PRD words, exact letter case |
| Internal customer: no prices, no invoice. Posts to Company Vehicle Maintenance, from the customer. | PRD-MATCH | S2-R1, §8-07 | flow1-2b, hf-12, rv-3-4 | PRD words, exact letter case (template with demo data) |
| Internal customer: no prices, no invoice. Posts to Shop Equipment Maintenance, from the asset. | PRD-MATCH | S2-R1, §8-07 | flow1-2b2, hf-13, rv-3-5 | PRD words, exact letter case (template with demo data) |
| Keep billable | PRD-MATCH | S1-R11, §8-04 | flow0-7 | PRD words, exact letter case |
| Make internal | PRD-MATCH | KD, S1-DESIGN, S1-EH, S1-R11, S2-R13, §8-04 | flow0-7 | PRD words, exact letter case |
| Manage categories in | PRD-MATCH | S1-R3 | flow0-2, flow0-3, hf-03, rv-1-3 | PRD words, exact letter case |
| Map their expense accounts in Integrations > | PRD-MATCH | S1-R3 | flow0-2, flow0-3, hf-03, rv-1-3 | PRD words, exact letter case |
| Mark as Billable | PRD-MATCH | S2-R8, S2-R19, S2-R20, S7-R8, S11-R3, S12-DESIGN | flow6-4, hf-33, rv-6-4 | PRD words, exact letter case |
| Mark as No Charge | PRD-MATCH | OV, S2-R8, S11-R3, S12-DESIGN, S12-R1, S12-R2 | flow6-1, flow6-2, hf-30, hf-31, rv-6-1, rv-6-2 | PRD words, exact letter case |
| Mark this line as No Charge? | PRD-MATCH | S12-R2, §8-30 | flow6-2, hf-31, rv-6-2 | PRD words, exact letter case |
| NO CHARGE | PRD-MATCH | OV, OOS, TERM, S2-R3, S2-R4, S2-R5 | flow2-5, flow2-7, flow2-7b, hf-29, rv-5-4 | PRD words, exact letter case |
| New Internal Category | PRD-MATCH | S1-R13, S1-R14 | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | PRD words, exact letter case |
| New No Charge Category | PRD-MATCH | S1-R13, S1-R14 | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | PRD words, exact letter case |
| No Charge | PRD-MATCH | OV, OOS, KD, TERM, S1-R1, S1-R4 | New-WO-Dialog-v6, WO-List-Artboard-v6, flow1-1, flow1-10b, flow1-2a, flow1-2b +54 | PRD words, exact letter case |
| No Charge Work Order S2-35102 | PRD-MATCH | S3-R5 | flow2-5, hf-29, rv-5-4 | PRD words, exact letter case (template with demo data) |
| No Charge categories | PRD-MATCH | OV, TERM, S1-R13, S2-R2, S2-R5, S12-R2 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | PRD words, exact letter case |
| No Charge line | PRD-MATCH | TERM, S2-R19, S7-N3, S8-R7, S9-R2 | flow4-5, hf-39, rv-7-2 | PRD words, exact letter case |
| No Charge lines | PRD-MATCH | S8-R7 | flow5-3c, hf-41b, rv-7-6 | PRD words, exact letter case |
| No Charge · Warranty | PRD-MATCH | KD, OOS, OV, S1-R1, S1-R13, S1-R14 | flow6-3, flow6-4, hf-32, hf-33, rv-6-3, rv-6-4 | PRD words, exact letter case (template with demo data) |
| No open fiscal period covers Oct 22, 2026. | PRD-MATCH | S8-N2 | flow5-4, hf-42, rv-7-4 | PRD words, exact letter case (template with demo data) |
| Not asked | PRD-MATCH | S1-R13 | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | PRD words, exact letter case |
| Not in ShopView | PRD-MATCH | TERM, S1-R14, S2-R2, S2-R16, S2-R17, S3-R2 | flow1-2e, flow2-4b, hf-20, hf-27, rv-3-6, rv-5-1 | PRD words, exact letter case |
| Not set | PRD-MATCH | S1-R13, S5-R4, §8-27 | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | PRD words, exact letter case |
| One per connected location, picked from the chart that is already in QuickBooks. Parts cost of this category posts here instead of Cost of Parts. Empty: posts to the ShopView Review account until you pick one. | PRD-MATCH | S1-R14 | flow0-2c, hf-06, rv-2-3 | PRD words, exact letter case |
| Original line | PRD-MATCH | TERM, S2-R2, S2-R5, S2-R6, S2-R17, S3-R2 | flow2-2, flow2-3c, flow2-4b, flow6-2, flow6-6, hf-22 +7 | PRD words, exact letter case |
| Original technician | PRD-MATCH | S2-R2, S9-R2, S12-R2 | flow4-5, flow4-6, flow5-3c, hf-39, hf-39b, hf-41b +3 | PRD words, exact letter case |
| Original work order | PRD-MATCH | TERM, S1-R13, S2-R2, S2-R5, S2-R6, S2-R16 | flow0-2b, flow0-2c, flow1-2e, flow2-2, flow2-3c, flow4-5 +19 | PRD words, exact letter case |
| Original work order * | PRD-MATCH | S3-R2 | flow2-4b, hf-27, rv-5-1 | PRD words, exact letter case |
| Other | PRD-MATCH | S2-R2, S8-N2 | flow1-2e, flow2-4b, hf-20, hf-27, rv-3-6, rv-5-1 | PRD words, exact letter case |
| Parts cost | PRD-MATCH | S1-R14, S2-E7, S3-R2, S3-R5, S3-E1, S3-E4 | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +35 | PRD words, exact letter case |
| Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped. | PRD-MATCH | S7-N5 | flow1-6g | PRD words, exact letter case |
| Parts with no cost | PRD-MATCH | S3-E2 | flow1-6e | PRD words, exact letter case |
| Posted to 6430 Warranty & Goodwill Expense | PRD-MATCH | S3-R2 | flow2-4, flow2-4b, hf-27, hf-28, rv-5-1 | PRD words, exact letter case |
| Posted to 6500 Vehicle Expenses | PRD-MATCH | S10-R3, S2-E7, S3-R2 | flow1-6b, flow1-6e, flow1-6f, hf-17, rv-5-2 | PRD words, exact letter case (template with demo data) |
| Posted to 6500 Vehicle Expenses, credited to 4300 Shop Supplies Income | PRD-MATCH | S10-R3, S3-R2 | flow1-6b, flow1-6e, flow1-6f, flow1-6g, hf-17, rv-5-2 | PRD words, exact letter case (template with demo data) |
| Posted to ShopView Review, credited to 4300 Shop Supplies Income | PRD-MATCH | S10-R3, S3-N4 | flow1-6c | S10-R3 note with the S3-N4 ShopView Review rule |
| Posting date | PRD-MATCH | TERM | flow1-6b, flow1-6c, flow1-6e, flow1-6f, flow1-6g, flow2-4 +9 | PRD words, exact letter case |
| Prices, fees and discounts are removed from every line; costs and hours are kept. It closes with a NO CHARGE document instead of an invoice. You can convert it back until it is closed. | PRD-MATCH | S2-R5 | flow2-2, hf-22, rv-4-2 | PRD words, exact letter case |
| Prices, fees and discounts are removed; costs and hours are kept. | PRD-MATCH | S1-R11, §8-04 | flow0-7 | PRD words, exact letter case |
| QuickBooks expense account | PRD-MATCH | OV, KD, TERM, S1-R13, S1-R14, S1-R15 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | PRD words, exact letter case |
| Redo hours | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Redo parts cost | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Remove flag | PRD-MATCH | S1-DESIGN, S1-R12, §8-06 | flow0-8 | PRD words, exact letter case |
| Remove the Internal flag from Staging Heavy Duty Fleet? | PRD-MATCH | S1-R12, §8-06 | flow0-8 | PRD words, exact letter case (template with demo data) |
| Reopen Work Order | PRD-MATCH | OV, KD, TERM, S3-R6, S4-DESIGN, S4-EH | flow2-5, flow3-2, hf-29, hf-37, rv-5-4 | PRD words, exact letter case |
| Reopen work order S2-34918? | PRD-MATCH | S4-R2 | flow3-2, hf-37 | PRD words, exact letter case (template with demo data) |
| Required | PRD-MATCH | S1-R13, S2-R11 | flow0-2b, flow0-2c, hf-05, hf-06, rv-2-2, rv-2-3 | PRD words, exact letter case |
| Requires the original work order | PRD-MATCH | OV, S1-R14, S13-R1 | flow0-2c, hf-06, rv-2-3 | PRD words, exact letter case |
| Set account | PRD-MATCH | S3-DESIGN, S3-N4, §8-17 | flow1-6c | PRD words, exact letter case |
| Shop supplies | PRD-MATCH | OV, KD, TERM, S2-DESIGN, S2-R7, S2-E2 | flow1-3, flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f +13 | PRD words, exact letter case |
| Shop supplies on internal and no-charge work orders are credited to the income account of your Shop supplies item in Products And Services; nothing to map here. | PRD-MATCH | S5-R1 | flow0-9, hf-10, rv-3-1 | PRD words, exact letter case |
| Show all | PRD-MATCH | KD, TERM, S9-DESIGN, S9-R1, S9-R3, S9-R11 | flow4-4 | PRD words, exact letter case |
| Show archived (1) | PRD-MATCH | S1-R13 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | PRD words, exact letter case (template with demo data) |
| Special orders and sublet | PRD-MATCH | TERM, S3-R2 | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +2 | PRD words, exact letter case |
| Stock parts | PRD-MATCH | S2-E7, S3-R2, S7-N5 | flow1-6b, flow1-6c, flow1-6d, flow1-6e, flow1-6f, flow1-6g +7 | PRD words, exact letter case |
| The line stays on this work order and shows $0.00 on the invoice. Hours, parts and the story stay; the technician works it like any other line. When the invoice is created, the parts cost of this line posts to the expense account of the category instead of Cost of Parts. | PRD-MATCH | S12-R2, §8-30 | flow6-2, hf-31, rv-6-2 | PRD words, exact letter case |
| This line shows $0.00 on the invoice. Hours and parts stay; the parts cost posts to the category's expense account. | PRD-MATCH | S12-R1, §8-31 | flow6-6 | PRD words, exact letter case |
| This work order changed. Review and close again. | PRD-MATCH | S3-E5, §8-28 | flow1-6f | PRD words, exact letter case |
| Turn on Internal Work Orders in | PRD-MATCH | S1-N4, §8-02 | flow0-6 | PRD words, exact letter case |
| Used by internal customers that have no category of their own. One default at a time; it cannot be archived. | PRD-MATCH | S1-R14 | flow0-2d | PRD words, exact letter case |
| Vendor bill: cost moves at Close | PRD-MATCH | S1-R11, §8-05 | flow0-7 | PRD words, exact letter case |
| Warranty lines | PRD-MATCH | S9-R2 | flow4-6, hf-39b, rv-7-5 | PRD words, exact letter case |
| Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView. | PRD-MATCH | S3-R2 | flow2-4b, hf-27, rv-5-1 | PRD words, exact letter case (template with demo data) |
| Which customers are your own company? | PRD-MATCH | S1-R2, §8-01 | flow0-1b, hf-02, rv-1-2 | PRD words, exact letter case |
| Which earlier work order this job comes from, or Not in ShopView, and the line on it. The line sets the original technician for the comeback and warranty numbers. Optional here, required at Close. | PRD-MATCH | S2-R2 | flow1-2e, flow2-2, hf-20, hf-22, rv-3-6, rv-4-2 | PRD words, exact letter case |
| Which earlier work order this job comes from, or Not in ShopView, and the line on it. The line sets the original technician for the comeback and warranty numbers. Optional here, required before the invoice is created. | PRD-MATCH | S12-R2, S2-R2 | flow6-2, hf-31, rv-6-2 | S2-R2 helper with S12-R2 "required before the invoice is created" |
| Whole work order | PRD-MATCH | S9-R2 | flow4-5, hf-39, rv-7-2 | PRD words, exact letter case |
| Withdrawn: work order reopened | PRD-MATCH | S4-E1 | flow5-1, flow5-4, hf-40, hf-42, rv-7-4 | PRD words, exact letter case |
| Work order | PRD-MATCH | S1-R2, S1-R4, S1-R7, S1-R13, S2-R18, S3-R3 | flow0-7, flow4-5, hf-39, rv-7-2 | PRD words, exact letter case |
| Work order S2-34918 is Closed · Internal. | PRD-MATCH | S3-R3, §8-22 | flow1-8, hf-18, rv-5-3 | PRD words, exact letter case (template with demo data) |
| Work orders | PRD-MATCH | S1-R2, S1-R4, S1-R7, S1-R13, §8-01, §8-03 | flow0-2a, flow0-2b, flow0-2c, flow0-2d, flow0-2e, hf-04 +5 | PRD words, exact letter case |
| You can change this any time: Customers > Edit Customer > Internal customer. | PRD-MATCH | S1-R2 | flow0-1b, hf-02, rv-1-2 | PRD words, exact letter case |
| to change this. | PRD-MATCH | S1-N4, §8-02 | flow0-6 | PRD words, exact letter case |
| $700.00 | SPEC-CONFLICT | IWO-D43 | flow4-5, flow4-6, hf-39, hf-39b, rv-7-2, rv-7-5 | see the divergence register |
| (Administration > Service). Their expense accounts are set there or in Integrations > | SPEC-CONFLICT | IWO-D02 | flow0-2, flow0-3, hf-03, rv-1-3 | see the divergence register |
| A customer's free job: warranty, goodwill, policy, comeback or a category of your own. Closes without an invoice; parts cost posts to the category's expense account. | SPEC-CONFLICT | IWO-D23 | flow2-4, flow2-4b, hf-27, hf-28, rv-5-1 | see the divergence register |
| Adds an Internal option when creating work orders. Creates the system customer Staging Heavy Duty Internal for your own trucks and equipment. | SPEC-CONFLICT | IWO-D37 | WO-Settings-Artboard-v6 | see the divergence register |
| Badge here, we agree, is not no-charge warranty. It's no charge, just that the badge itself | SPEC-CONFLICT | IWO-D50 | rv-1-1 | see the divergence register |
| Category: General Internal | SPEC-CONFLICT | IWO-D19 | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +8 | see the divergence register |
| Category: Warranty · Original work order S2-31207 | SPEC-CONFLICT | IWO-D32 | flow2-5, flow2-7, hf-29, rv-5-4 | see the divergence register |
| Closed on Oct 22, 2026 by Admin ShopView | SPEC-CONFLICT | IWO-D29 | flow3-2, hf-37 | see the divergence register |
| Comeback rate = comeback lines attributed to the technician / lines the technician completed in the date range. Redo hours and parts cost are what the comeback and warranty work cost the shop; the dollar cost of labor comes with labor posting (V2). | SPEC-CONFLICT | IWO-D42 | flow4-6, hf-39b, rv-7-5 | see the divergence register |
| Convert work order S2-35102 to no charge? | SPEC-CONFLICT | IWO-D25 | flow2-2, hf-22, rv-4-2 | see the divergence register |
| Converted to Billable by Admin ShopView. Every line priced at the customer's current pricing. Category Warranty removed. | SPEC-CONFLICT | IWO-D26 | flow2-3e | see the divergence register |
| Every line is priced at the customer's current pricing. You can convert it to no charge again until it is invoiced. | SPEC-CONFLICT | IWO-D26 | flow2-3b, hf-26, rv-4-4 | see the divergence register |
| General Internal: expense account is not mapped | SPEC-CONFLICT | IWO-D47 | flow5-4, hf-42, rv-7-4 | see the divergence register |
| INTERNAL | SPEC-CONFLICT | IWO-D19 | flow1-3d, flow1-4, flow1-6b, flow1-6c, flow1-6d, flow1-6e +8 | see the divergence register |
| Internal Work Orders is off. Turn it on in Settings > Work Orders to use these categories; nothing here is deleted while it is off. | SPEC-CONFLICT | IWO-D07 | flow0-2e | see the divergence register |
| Internal customers | SPEC-CONFLICT | IWO-D08 | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | see the divergence register |
| Internal work order | SPEC-CONFLICT | IWO-D37 | New-WO-Dialog-v6 | see the divergence register |
| Internal work orders | SPEC-CONFLICT | IWO-D37 | WO-Settings-Artboard-v6 | see the divergence register |
| Internal work orders · one row per category | SPEC-CONFLICT | IWO-D11 | flow0-10, flow0-9, hf-10, rv-3-1 | see the divergence register |
| Labor, | SPEC-CONFLICT | IWO-D19 | flow1-3d, flow1-4, hf-15 | see the divergence register |
| Lets you flag internal customers and mark work orders as no charge. Both close without an invoice; parts cost posts to your expense accounts. | SPEC-CONFLICT | IWO-D04 | flow0-12 | see the divergence register |
| Lets you flag your own company as an internal customer and mark a customer's work order as No Charge (warranty, goodwill, comeback). Both close without an invoice; their parts cost posts to the expense account of their category instead of Cost of Parts. | SPEC-CONFLICT | IWO-D01 | Main, flow0-1b, flow0-2, flow0-3, hf-01, hf-02 +4 | see the divergence register |
| Line "Replace - Brake caliper" marked No Charge by Admin ShopView. Category Warranty, original work order S2-30455. Line price $559.95 removed; cost $410.00 and 1.00 h kept. The work order stays billable. | SPEC-CONFLICT | IWO-D33 | flow6-5, hf-34, rv-6-5 | see the divergence register |
| Move this tooltip text. It's fine to be just this tag here, which is fine, but let's bring back the explanation a little, just one sentence. | SPEC-CONFLICT | IWO-D50 | rv-1-1 | see the divergence register |
| No Charge work orders · one row per category | SPEC-CONFLICT | IWO-D11 | flow0-10, flow0-9, hf-10, rv-3-1 | see the divergence register |
| No Charge. | SPEC-CONFLICT | IWO-D19 | flow1-3d, flow1-4, hf-15 | see the divergence register |
| No account set for internal work orders. The entry posts to the ShopView Review account until you set one. | SPEC-CONFLICT | IWO-D22 | flow1-6c | see the divergence register |
| No charge. This work order closes without an invoice. Parts cost posts to Customer No-Charge Expense. | SPEC-CONFLICT | IWO-D23 | flow2-4, flow2-4b, hf-27, hf-28, rv-5-1 | see the divergence register |
| No-Charge Work Orders | SPEC-CONFLICT | IWO-D04 | flow0-12 | see the divergence register |
| No-charge work orders | SPEC-CONFLICT | IWO-D41 | flow4-4 | see the divergence register |
| Not in ShopView / no technician | SPEC-CONFLICT | IWO-D42 | flow4-6, hf-39b, rv-7-5 | see the divergence register |
| Not set at any location. Parts cost of this category posts to the ShopView Review account until you pick one. | SPEC-CONFLICT | IWO-D10 | flow0-2d | see the divergence register |
| Not set. Parts cost of this category posts to the ShopView Review account until you pick one. | SPEC-CONFLICT | IWO-D11 | flow0-10 | see the divergence register |
| Only no-charge | SPEC-CONFLICT | IWO-D41 | flow4-4 | see the divergence register |
| Preselected on every new work order for this customer; a work order can change it. New internal customers get General Internal. | SPEC-CONFLICT | IWO-D09 | flow0-11 | see the divergence register |
| Reopen | SPEC-CONFLICT | IWO-D27 | flow1-8, flow3-2, hf-18, hf-37, rv-5-3 | see the divergence register |
| Reopening returns it from Closed · Internal to Complete. | SPEC-CONFLICT | IWO-D29 | flow3-2, hf-37 | see the divergence register |
| Shown in the Category select when a work order is marked No Charge. It shows on the work order, the NO CHARGE document and the Internal Work Orders report. | SPEC-CONFLICT | IWO-D09 | flow0-2c, hf-06, rv-2-3 | see the divergence register |
| System customer for your own trucks and equipment. | SPEC-CONFLICT | IWO-D37 | WO-Detail-Artboard-v6 | see the divergence register |
| The vendor bill for the caliper ($410.00) was posted to Cost of Parts. If you continue, that cost moves to Internal Work Orders Expense when this work order is closed. | SPEC-CONFLICT | IWO-D34 | flow1-2d | see the divergence register |
| The vendor bill for the caliper ($410.00) was posted to Internal Work Orders Expense. If you continue, that cost moves to Cost of Parts when this work order is invoiced. | SPEC-CONFLICT | IWO-D34 | flow1-2c | see the divergence register |
| The work order asks which earlier work order the job comes from, or "Not in ShopView". Optional when the work order is created, required at Close. | SPEC-CONFLICT | IWO-D10 | flow0-2c, hf-06, rv-2-3 | see the divergence register |
| The work order leaves Closed · No Charge and goes back to Complete. | SPEC-CONFLICT | IWO-D30 | flow3-2, hf-37 | see the divergence register |
| This marks the work order Closed · No Charge. Parts cost and hours are in the Internal Work Orders report. | SPEC-CONFLICT | IWO-D21 | flow1-6d | see the divergence register |
| This posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later. | SPEC-CONFLICT | IWO-D20 | flow1-6b, flow1-6c, flow1-6e, flow1-6f, flow1-6g, flow2-4 +3 | see the divergence register |
| This work order is locked. Reopen it to change lines, hours or parts. | SPEC-CONFLICT | IWO-D29 | flow3-2, hf-37 | see the divergence register |
| Turn on Internal Work Orders in Settings > Work Orders. | SPEC-CONFLICT | IWO-D07 | flow0-2e | see the divergence register |
| Value | SPEC-CONFLICT | IWO-D17 | WO-Detail-Artboard-v6, flow1-2c, flow1-3, flow1-3c, flow1-3d, flow1-3e +24 | see the divergence register |
| Where the cost of work on your own equipment goes. Each internal customer has a default category; a work order can change it. | SPEC-CONFLICT | IWO-D09 | flow0-2a, flow0-2d, flow0-2e, hf-04, rv-2-1 | see the divergence register |
| Work order S2-34918 reopened | SPEC-CONFLICT | IWO-D31 | flow3-3 | see the divergence register |
| Work orders for these customers are internal: no prices and no invoice; parts cost posts to your Internal Work Orders Expense account when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page. | SPEC-CONFLICT | IWO-D05 | flow0-1b, hf-02, rv-1-2 | see the divergence register |

## Canvas notes (all 198)

| Note | Page | Text | Class | Codes / register | Note |
|---|---|---|---|---|---|
| c-flow0-1 | flow0 | Turns on Internal Work Orders. Switching the toggle on opens the modal of frame 1b. | PRD-MATCH | S1-R2 |  |
| c-flow0-1b | flow0 | First turn-on: pick the internal customers once. Nothing is preselected (the location is not always a customer). Afterwards the flag lives on the customer, not here. | PRD-MATCH | S1-R2, KD |  |
| c-flow0-2 | flow0 | After the modal the toggle is on and saved. The tab stays light: two hint lines, one of them a link to the Internal Work Orders page where the categories live (frame 2a). Later turn-ons use Save settings like every other toggle and open no modal. | PRD-MATCH | S1-R2, S1-R3, S1-R10 |  |
| c-flow0-2a | flow0 | A page of its own under Administration > Service, like Labor Rates and Canned Lines. Two tabs. The starting set is seeded when the setting is first turned on: General Internal (the default) here, Warranty, Goodwill and Comeback on the other tab. The QuickBooks column shows the expense account for the location you are in, as the parts Categories page shows Products and Services; Not set means ShopView Review until one is picked. The shop adds its own (Company Vehicle Maintenance, Shop Equipment Maintenance) or archives what it does not use. The same accounts are also editable in Integrations > QuickBooks > ShopView Accounts, one row per category, for shops used to mapping there (frame 9). | SPEC-CONFLICT | IWO-D52 | "seeded when the setting is first turned on" vs S1-R13 "seeded … when this release ships"; rest agrees with S1-R13, S5-R1 |
| c-flow0-2b | flow0 | Same page, second tab. The third column says whether the category requires the original work order (Warranty and Comeback do). Several categories can share an account. | PRD-MATCH | S1-R13 |  |
| c-flow0-2c | flow0 | New No Charge Category, or a click on a row (Edit). Name, the QuickBooks expense account per connected location (one small table, so a multi-location shop sets everything here) and whether the category requires the original work order. Nothing is created in QuickBooks: the account is picked from the chart that is already there. Archive is in the row menu; a category is never deleted, so old work orders and reports keep it. | PRD-MATCH | S1-R13, S1-R14, S1-R16 |  |
| c-flow0-2d | flow0 | Same dialog for an internal category: name, the QuickBooks expense account and Default category. The default is used by every internal customer without a category of its own and cannot be archived. A small shop keeps General Internal and never opens this. | PRD-MATCH | S1-R14 |  |
| c-flow0-2e | flow0 | While the setting is off the menu item is disabled with the tooltip "Turn on Internal Work Orders in Settings > Work Orders." and the page is read-only with the same note; nothing is deleted. Same rule as the Internal customer checkbox (frame 6). | SPEC-CONFLICT | IWO-D07 | menu item disabled and page read-only vs S1-R13 "the lists stay editable" |
| c-flow0-3 | flow0 | Informational only; nothing is required or blocked. | PRD-MATCH | S1-R4 |  |
| c-flow0-4 | flow0 | The badge is the only change on this page. Search finds the flagged customer by name. | PRD-MATCH | S1-R8, OOS |  |
| c-flow0-5 | flow0 | The checkbox is the only place the flag is set. Save flags the customer; when it already has open billable work orders the dialog of frame 7 follows. Shown only while the setting is on. Not shown on New Customer. | SPEC-CONFLICT | IWO-D06 | "The checkbox is the only place the flag is set" vs S1-R7 "The checkbox and the modal are the only places" |
| c-flow0-6 | flow0 | With the setting off the checkbox shows only on an already flagged customer, read-only. The badge is hidden while the setting is off. | PRD-MATCH | S1-N4 |  |
| c-flow0-7 | flow0 | Shown on Save when the flagged customer has open billable work orders. Lists up to 10 of them, then 'and [n] more'. Rows with a deposit stay billable. Lists open billable work orders at every location the user has access to; Make internal converts all of them. | PRD-MATCH | S1-R11 |  |
| c-flow0-8 | flow0 | Opens when the checkbox is unticked, before the dialog is saved. Open internal work orders are not touched. | PRD-MATCH | S1-R12, S1-R6 |  |
| c-flow0-9 | flow0 | Same mapping, second door: one row per category under Cost of Parts, grouped Internal work orders and No Charge work orders. Editing here or on the category writes the same value for this location; a new category adds its row here by itself. Cost of Parts and Inventory Asset are used as today for the credit side. | PRD-MATCH | S5-R1, S5-R3 |  |
| c-flow0-10 | flow0 | Same page when a category has no account at this location: its row is empty with the warning. Set it here or on the category, same thing. | PRD-MATCH | S5-R4 |  |
| c-flow0-11 | flow0 | On a flagged customer Min is accepted without a percentage; it is the shop supplies default on internal work orders. Default internal category shows only while the customer is flagged; a shop with several internal customers (Fleet, Shop Equipment, Facility) gives each its own. | PRD-MATCH | S10-R1, S1-R7 |  |
| c-flow0-11b | flow0 | Asset of an internal customer: its own internal category. The QuickBooks mark sits in the explanation: categories are mapped to QuickBooks expense accounts. Priority: asset, then customer, then General Internal. | PRD-MATCH | S1-R15, S2-R1 |  |
| c-flow0-12 | flow0 | Turning the setting off hides the hint lines and the customer badges and leaves the flags on the customers. | PRD-MATCH | S1-R10 |  |
| title1 t-flow0 | flow0 | Flow 0 · Turn it on | LOOK-ONLY |  | page title |
| d-flow0 | flow0 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  The shop owner turns Internal Work Orders on, picks the company in the modal or later on its customer page, and gets the starting categories. Each category carries its QuickBooks expense account, set on the category like a parts category's Products and Services. | SPEC-CONFLICT | IWO-D52 | "gets the starting categories" on turn-on vs S1-R13 seeding at release |
| c-flow1-1 | flow1 | Clicks Create Work Order. | LOOK-ONLY |  | flow step |
| c-flow1-2a | flow1 | Hilltop Logistics is a regular customer, so No Charge sits at the bottom of the dialog, unticked, with the info tooltip. Picking Staging Heavy Duty Fleet instead shows 2b. | PRD-MATCH | S2-R2 | tooltip not drawn: IWO-D12 |
| c-flow1-2b | flow1 | Staging Heavy Duty Fleet is an internal customer, so the work order is internal: Internal badge, no checkbox, no category to pick. The tooltip says where it posts (the asset's category, else the customer's, else General Internal). Nobody on the work order is asked an accounting question. | PRD-MATCH | S2-R1 |  |
| c-flow1-2b2 | flow1 | Forklift 2 carries its own internal category (Flow 0 frame 11b), so the tooltip now names Shop Equipment Maintenance, from the asset. Change it on the asset, not here. | PRD-MATCH | S2-R1, S1-R15 |  |
| c-flow1-2c | flow1 | Shown only when a vendor bill already exists on the work order. Without a bill, changing the customer works as today. With several bills: The vendor bills for 3 parts ($1,240.00) were posted to Internal Work Orders Expense. When the work order stays internal or no charge the dialog also says: Shop supplies resets to Staging Heavy Duty Fleet's minimum ($25.00). | SPEC-CONFLICT | IWO-D34 | account name "Internal Work Orders Expense"; shop supplies sentence placed in this dialog |
| c-flow1-2d | flow1 | Shown only when a vendor bill already exists on the work order. Without a bill, changing the customer works as today. When the work order stays internal or no charge the dialog also says: Shop supplies resets to Staging Heavy Duty Fleet's minimum ($25.00). | SPEC-CONFLICT | IWO-D34 | as c-flow1-2c |
| c-flow1-2e | flow1 | Category is required when No Charge is ticked and starts empty; Save says Pick a category until one is picked. The list holds the shop's active No Charge categories (Warranty, Goodwill, Comeback to start). Warranty and Comeback also show Original work order: the customer's earlier work orders, same asset first, and Not in ShopView. Optional here, required at Close. | PRD-MATCH | S2-R2 |  |
| c-flow1-3 | flow1 | Opens the Finance tab. | LOOK-ONLY |  | flow step |
| c-flow1-3c | flow1 | On a Complete work order Close Work Order is the header button; while lines are open it sits in the menu, where Create invoice sits today. | PRD-MATCH | S3-N2 | the board itself differs: IWO-D18 |
| c-flow1-3d | flow1 | The Finance-tab action is Close too; no path creates a billable invoice. | PRD-MATCH | S3-R1 |  |
| c-flow1-3e | flow1 | Cores keep their row without a price; OK or Not OK is resolved in the completion steps before Close, as today. | PRD-MATCH | S2-E7 |  |
| c-flow1-4 | flow1 | Returns to Lines after the technicians mark every line Complete. | LOOK-ONLY |  | flow step |
| c-flow1-4b | flow1 | Clicks Mark Reviewed. | LOOK-ONLY |  | flow step |
| c-flow1-5 | flow1 | Clicks Close Work Order. | LOOK-ONLY |  | flow step |
| c-flow1-6 | flow1 | Close runs the same completion steps as Create invoice (tech stories, cores, missing details, per the organization's settings); the last button reads Close Work Order and opens the confirmation. | PRD-MATCH | S3-R3 |  |
| c-flow1-6b | flow1 | One press, like Create invoice: completes and closes. | PRD-MATCH | KD, S3-R2 |  |
| c-flow1-6c | flow1 | When Internal Work Orders Expense is not mapped. The work order closes and the entry posts to ShopView Review. | SPEC-CONFLICT | IWO-D22 | "When Internal Work Orders Expense is not mapped" (v0.17 fixed row) vs S3-N4 "No account set for [category]" |
| c-flow1-6d | flow1 | Shops without QuickBooks or AccountingHub. Nothing is posted. | PRD-MATCH | S3-E4 |  |
| c-flow1-6e | flow1 | Costed parts post; parts with no cost are listed and skipped. | PRD-MATCH | S3-E2 |  |
| c-flow1-6f | flow1 | Someone edited the work order after the dialog opened. Close stays disabled until the dialog is reopened. | PRD-MATCH | S3-E5 |  |
| c-flow1-6g | flow1 | Invoice-only QuickBooks shop: Inventory Asset or Cost of Parts is not mapped, so no parts entry is sent, as invoicing today. Shop supplies still posts. | PRD-MATCH | S7-N5 |  |
| c-flow1-8 | flow1 | One success alert at the top; X dismisses it, then the locked note shows as on any closed work order. Same Finance tab and toolbar as today. The invoice number is the work order number and the document is stamped NO CHARGE. No Add Deposit, Create Invoice, Remit payment to or balance due. Downloads the invoice from the toolbar, then returns to the Work Orders list. On the document the stamp and the category line sit under the masthead line, left, clear of the logo that prints in the top centre. | SPEC-CONFLICT | IWO-D19, IWO-D28 | "stamped NO CHARGE" (its board shows INTERNAL; question 2); "X dismisses it" (no X drawn) |
| c-flow1-9 | flow1 | Closed work orders show where invoiced ones show (All tab, Status chip), not in Completed, which lists work waiting for an invoice. | PRD-MATCH | S2-R10 |  |
| c-flow1-10b | flow1 | Total balance No Charge; Discount and Tax rate empty. | PRD-MATCH | S3-R6, S9-R10 |  |
| c-flow1-S2 | flow1 | The work order stays Complete. Clicks Close Work Order again. | PRD-MATCH | S3-EH |  |
| title1 t-flow1 | flow1 | Flow 1 · Create and close | LOOK-ONLY |  | page title |
| d-flow1 | flow1 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  A service advisor repairs one of the shop's own trucks and closes the job without an invoice.  States  S2  Close Work Order · failed  The work order stays Complete. Clicks Close Work Order again. | PRD-MATCH | S3-EH |  |
| c-flow2-1 | flow2 | Shown while the setting is on and the work order is not invoiced; needs Work Orders Create & Edit and See Financial Data, like fees and discounts. | PRD-MATCH | S2-R5, PERM |  |
| c-flow2-1b | flow2 | A work order with a deposit cannot be converted; the action is disabled with the tooltip Reverse the deposit first. Same rule as the Change Customer button today. | PRD-MATCH | S2-N4 |  |
| c-flow2-1c | flow2 | Users without See Financial Data do not see the action, as they cannot add a fee or discount. | PRD-MATCH | S2-N2 |  |
| c-flow2-2 | flow2 | Clicks Convert to No Charge. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S2-R5, S2-R17 |  |
| c-flow2-3 | flow2 | The category shows on the NO CHARGE document and in the report, not on the work order. | PRD-MATCH | S2-R16 |  |
| c-flow2-3b | flow2 | Convert to Billable asks first. | PRD-MATCH | S2-R6 |  |
| c-flow2-3c | flow2 | Opened from the menu (Change category). Save is enabled once the category or the original work order differs from the current one. | PRD-MATCH | S2-R6 | omits "or the original line" of S2-R6 (no conflict) |
| c-flow2-4 | flow2 | Clicks Close Work Order. Stock parts post to the account of the category (Warranty: 6430). | PRD-MATCH | S3-R2 |  |
| c-flow2-4b | flow2 | Only when the category requires the original work order and none was picked at creation or conversion. Close Work Order stays disabled until a work order or Not in ShopView is picked; Goodwill never shows this. | PRD-MATCH | S3-R2 |  |
| c-flow2-5 | flow2 | End of flow. Reopen Work Order sits in the invoice menu. The NO CHARGE stamp and Category: Warranty · Original work order S2-30455 sit under the masthead line, clear of the centred logo. | PRD-MATCH | S3-R5, S4-R1 |  |
| c-flow2-6 | flow2 | From Close on the classification is locked, like the invoiced lock today. The Change Customer button is disabled with the tooltip Reopen the work order to change the customer. A billable invoiced work order keeps today's behaviour. | PRD-MATCH | S2-R9 |  |
| c-flow2-7 | flow2 | A no-charge estimate can go to the customer; the closed document never does. | PRD-MATCH | S2-R11 |  |
| c-flow2-7b | flow2 | The customer approves the work, not an amount. Cost is never shown on the portal. | PRD-MATCH | S2-R11 |  |
| title1 t-flow2 | flow2 | Flow 2 · No charge on a customer's work order | LOOK-ONLY |  | page title |
| d-flow2 | flow2 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  A work order on a real customer can be converted to no charge, and back, until it is closed or invoiced. It stays on that customer and that asset, closes without an invoice, and its parts cost posts to the expense account of its category (Warranty, Goodwill, Comeback or the shop's own) instead of Cost of Parts. One free line on a paid job is moved to its own No Charge work order (Flow 6); marking a line No Charge in place is V2 and reuses these categories. | SPEC-CONFLICT | IWO-D49 | free line "moved to its own No Charge work order"; "marking a line No Charge in place is V2" vs Story 12 / Out of Scope |
| c-flow3-1 | flow3 | Reopen Work Order is in the Finance tab's invoice menu (Flow 2 frame 5). Opens the dialog of frame 2. The Change Customer button is disabled with the tooltip Reopen the work order to change the customer. A billable invoiced work order keeps today's behaviour. | PRD-MATCH | S4-R1, S2-R9 |  |
| c-flow3-2 | flow3 | Clicks Reopen Work Order. Reopen needs the Work Orders — Delete permission, like Reverse. | PRD-MATCH | S4-R1, PERM |  |
| c-flow3-3 | flow3 | End of flow. Adds the part, then closes the work order again as in Flow 1. | PRD-MATCH | S4-R4 |  |
| title1 t-flow3 | flow3 | Flow 3 · Reopen | LOOK-ONLY |  | page title |
| d-flow3 | flow3 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  A closed internal work order needs a forgotten part, so the service advisor reopens it. This mirrors invoice reversal on external work orders. | PRD-MATCH | S4-R1 |  |
| c-flow4-1 | flow4 | The three-state chip belongs to the reports; the list has Classification only, shown while the setting is on. | PRD-MATCH | S2-R14, S9-R3 |  |
| c-flow4-2 | flow4 | Classification: No Charge (internal and customer no-charge work). Switches to the Estimates tab. | SPEC-CONFLICT | IWO-D36 | "Classification: No Charge (internal and customer no-charge work)" vs S2-R14 separate values |
| c-flow4-3 | flow4 | End of flow. Classification: All or Clear filters returns to the full list. | PRD-MATCH | S2-R14 |  |
| c-flow4-4 | flow4 | Technician Efficiency keeps the chip, default Show all, hidden while the shop has no internal or no-charge work. | PRD-MATCH | S9-R3, S9-R4 |  |
| c-flow4-5 | flow4 | One report for all free work: whole internal and no-charge work orders, and now one row per no-charge line of a billable work order (Line column, Classification "No Charge line", invoiced date). Summary strip per category above the table. Money reports exclude these rows without a filter. | PRD-MATCH | S9-R2, S9-R1 |  |
| c-flow4-6 | flow4 | Second tab of the same report, grouped by original technician: completed lines in the range, comeback lines, warranty lines, comeback rate, hours and parts cost of the redo. No new data: it reads the same rows as the first tab through the original line. The dollar cost of labor arrives with labor posting (V2). | PRD-MATCH | S9-R2 |  |
| c-flow4-7 | flow4 | Status and No Charge badge on the card. | SPEC-CONFLICT | IWO-D16 | No Charge badge on the internal work order S2-34918 |
| c-flow4-8 | flow4 | Status and No Charge badge in the header. | SPEC-CONFLICT | IWO-D16 | as c-flow4-7 |
| c-flow4-9 | flow4 | The No Charge badge on the S2-34918 card. | SPEC-CONFLICT | IWO-D16 | note says No Charge; the board draws Internal (the board agrees with the PRD) |
| c-flow4-10 | flow4 | Board cards show the badge; a closed internal or no-charge work order sits where an invoiced one sits. | PRD-MATCH | S2-R10 |  |
| c-flow4-11 | flow4 | Schedule cards show the badge next to the number. | PRD-MATCH | S2-R10 |  |
| title1 t-flow4 | flow4 | Flow 4 · Find internal and no-charge work orders | LOOK-ONLY |  | page title |
| d-flow4 | flow4 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  A service advisor filters the list down to internal and no-charge work orders, and the Internal Work Orders report shows all free work: whole work orders and single no-charge lines, by category and by original technician. | PRD-MATCH | S9-R2 |  |
| c-flow5-1 | flow5 | Reopen reverses only what was posted; an entry still waiting here gets no reversal and is marked withdrawn. | PRD-MATCH | S4-E1 |  |
| c-flow5-3 | flow5 | Closed is a value of the Status filter; no Classification filter in this version. | PRD-MATCH | S8-R6 |  |
| c-flow5-3b | flow5 | Header and totals only; lines live on the NO CHARGE document in ShopView. | PRD-MATCH | S8-R1 |  |
| c-flow5-3c | flow5 | A billable work order with one no-charge line reaches the hub as an ordinary invoice record (Paid), with a No Charge lines block: line, category, original work order and line, technician, hours, parts cost, expense account. The journal entry posts the billable parts cost to Cost of Parts and the no-charge line's parts cost to the category account. Accounts per the AccountingHub owner (Nov 5): 6500 General Internal, 6430 Warranty & Goodwill (existing in the hub chart), Comeback Expense is a new account whose number the hub confirms; migration maps the starting categories automatically, never an empty row for them. | PRD-MATCH | S8-R7, S6-R2 | Comeback number: the hub owner confirmed 6440 on 2026-11-09 (S6-R2), newer than the note |
| c-flow5-4 | flow5 | Held retries automatically once the row is mapped or the period opened. Dismissed: the Close was withdrawn by Reopen before posting; nothing was posted, so nothing is reversed. | PRD-MATCH | S8-N2, S4-E1 |  |
| title1 t-flow5 | flow5 | Flow 5 · What the books see | LOOK-ONLY |  | page title |
| d-flow5 | flow5 | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  Nothing is sent as an invoice. The parts cost goes to the mapped expense account; only entries QuickBooks rejects wait here; a missing account posts to ShopView Review.  AccountingHub uses the same mapping row and the same hold rule; its held events appear on this page too.  A billable work order with a no-charge line reaches the hub as a normal invoice record with a No Charge lines block; the line's parts cost posts to the category account instead of Cost of Parts. | PRD-MATCH | S7-R2, S8-N2, S8-R7 |  |
| title1 t-components | components | Shared screens | LOOK-ONLY |  | page title |
| title1 t-flow6 | flow6 | Flow 6 · One no-charge line on a billable work order | PRD-MATCH | S12 | matches Story 12; the dropdown page name differs (IWO-D49) |
| d-flow6 | flow6 | v6.1 · Nov 5, 2026 · after the CEO review  One free line on a paid job stays on that job. The line is marked No Charge with a category and, where required, the original work order; it shows $0.00 on the work order and the invoice, keeps its hours, parts and story, and its parts cost posts to the category's expense account when the invoice is created. The work order itself stays billable, no badge; Create invoice, pay and close as today.  Whole-work-order No Charge (Flow 2) stays for jobs that are entirely free: NO CHARGE document, Closed state. Moving a line to its own work order was dropped: a shop that wants that splits the work order as today. | PRD-MATCH | S12-R1, S12-R3, S12-R4, KD |  |
| c-flow6-1 | flow6 | On a billable work order, while Internal Work Orders is on and the work order is not invoiced. Same permissions as Convert to No Charge. The item replaces the earlier "Move to a No Charge work order" (dropped Nov 5: a shop that wants it separate splits the work order as today). | PRD-MATCH | S12-R1, OOS |  |
| c-flow6-2 | flow6 | Clicks Mark as No Charge. Category and Original work order are the same fields as Convert to No Charge; the line stays where it is. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S12-R2 |  |
| c-flow6-3 | flow6 | The line carries a No Charge · Warranty chip next to its name; Rate, Total and its parts show $0.00, hours and status unchanged. The original work order is in the notes and the Audit Log, not on the line. No badge on the work order: a normal billable work order with one no-charge line. Financial Info is the cost view and does not change: the cost of the no-charge line stays and posts to the Warranty account at invoicing. | PRD-MATCH | S12-R3, S12-R4 |  |
| c-flow6-4 | flow6 | The marked line offers Change category and Mark as Billable. Mark as Billable prices the line at the customer's current pricing and removes the category. | SPEC-CONFLICT | IWO-D26 | "prices the line at the customer's current pricing" vs S12-R5/S2-R6 "as a new line would be today" |
| c-flow6-5 | flow6 | Every line change writes a system note and an Audit Log row: who, when, category, original work order, the price removed, the cost and hours kept. | PRD-MATCH | S12-R6 |  |
| c-flow2-3d | flow2 | Every change of classification writes a system note on the work order and an Audit Log entry: Convert to No Charge (category, original work order, what was removed), Change category, Convert to Billable, Close and Reopen. Notes are read-only and carry who and when. | PRD-MATCH | S2-R18 |  |
| c-flow2-3e | flow2 | After Convert to Billable the earlier note stays; nothing is rewritten. The Audit Log row is Classification: No Charge (Warranty) to Billable. | PRD-MATCH | S2-R13, S2-R18 |  |
| title1 t-hf-1 | happy | 1 · Set up | LOOK-ONLY |  | row title |
| c-hf-01 | happy | Settings > Work Orders. Switching the toggle on opens the modal of the next frame. | PRD-MATCH | S1-R2 |  |
| c-hf-02 | happy | Shown once, the first time the toggle is switched on. Save saves the toggle and the picked customers together and then asks about their open billable work orders (frame 7); Do this later saves the toggle only. Later turn-ons open no modal. Closing with X acts as Do this later; Esc and a click outside do nothing, as in every dialog of the app. | PRD-MATCH | S1-R2, S1-R5 |  |
| c-hf-03 (same text as c-flow0-2) | happy | After the modal the toggle is on and saved. The tab stays light: two hint lines, one of them a link to the Internal Work Orders page where the categories live (frame 2a). Later turn-ons use Save settings like every other toggle and open no modal. | PRD-MATCH | S1-R2, S1-R3, S1-R10 |  |
| c-hf-04 (same text as c-flow0-2a) | happy | A page of its own under Administration > Service, like Labor Rates and Canned Lines. Two tabs. The starting set is seeded when the setting is first turned on: General Internal (the default) here, Warranty, Goodwill and Comeback on the other tab. The QuickBooks column shows the expense account for the location you are in, as the parts Categories page shows Products and Services; Not set means ShopView Review until one is picked. The shop adds its own (Company Vehicle Maintenance, Shop Equipment Maintenance) or archives what it does not use. The same accounts are also editable in Integrations > QuickBooks > ShopView Accounts, one row per category, for shops used to mapping there (frame 9). | SPEC-CONFLICT | IWO-D52 | "seeded when the setting is first turned on" vs S1-R13 "seeded … when this release ships"; rest agrees with S1-R13, S5-R1 |
| c-hf-05 (same text as c-flow0-2b) | happy | Same page, second tab. The third column says whether the category requires the original work order (Warranty and Comeback do). Several categories can share an account. | PRD-MATCH | S1-R13 |  |
| c-hf-06 (same text as c-flow0-2c) | happy | New No Charge Category, or a click on a row (Edit). Name, the QuickBooks expense account per connected location (one small table, so a multi-location shop sets everything here) and whether the category requires the original work order. Nothing is created in QuickBooks: the account is picked from the chart that is already there. Archive is in the row menu; a category is never deleted, so old work orders and reports keep it. | PRD-MATCH | S1-R13, S1-R14, S1-R16 |  |
| c-hf-07 (same text as c-flow0-4) | happy | The badge is the only change on this page. Search finds the flagged customer by name. | PRD-MATCH | S1-R8, OOS |  |
| c-hf-08 (same text as c-flow0-5) | happy | The checkbox is the only place the flag is set. Save flags the customer; when it already has open billable work orders the dialog of frame 7 follows. Shown only while the setting is on. Not shown on New Customer. | SPEC-CONFLICT | IWO-D06 | "The checkbox is the only place the flag is set" vs S1-R7 "The checkbox and the modal are the only places" |
| c-hf-09 | happy | Only the last field is new, and only on assets of an internal customer. Priority on a new internal work order: the asset's category, else the customer's default, else General Internal. Leave it empty on vehicles; set it on equipment and buildings that sit under the same internal customer. | PRD-MATCH | S1-R15, S2-R1 |  |
| c-hf-10 (same text as c-flow0-9) | happy | Same mapping, second door: one row per category under Cost of Parts, grouped Internal work orders and No Charge work orders. Editing here or on the category writes the same value for this location; a new category adds its row here by itself. Cost of Parts and Inventory Asset are used as today for the credit side. | PRD-MATCH | S5-R1, S5-R3 |  |
| title1 t-hf-2 | happy | 2 · Internal work order | LOOK-ONLY |  | row title |
| c-hf-11 (same text as c-flow1-1) | happy | Clicks Create Work Order. | LOOK-ONLY |  | flow step |
| c-hf-12 (same text as c-flow1-2b) | happy | Staging Heavy Duty Fleet is an internal customer, so the work order is internal: Internal badge, no checkbox, no category to pick. The tooltip says where it posts (the asset's category, else the customer's, else General Internal). Nobody on the work order is asked an accounting question. | PRD-MATCH | S2-R1 |  |
| c-hf-13 (same text as c-flow1-2b2) | happy | Forklift 2 carries its own internal category (Flow 0 frame 11b), so the tooltip now names Shop Equipment Maintenance, from the asset. Change it on the asset, not here. | PRD-MATCH | S2-R1, S1-R15 |  |
| c-hf-14 (same text as c-flow1-3) | happy | Opens the Finance tab. | LOOK-ONLY |  | flow step |
| c-hf-15 (same text as c-flow1-4) | happy | Returns to Lines after the technicians mark every line Complete. | LOOK-ONLY |  | flow step |
| c-hf-16 (same text as c-flow1-5) | happy | Clicks Close Work Order. | LOOK-ONLY |  | flow step |
| c-hf-17 (same text as c-flow1-6b) | happy | One press, like Create invoice: completes and closes. | PRD-MATCH | KD, S3-R2 |  |
| c-hf-18 (same text as c-flow1-8) | happy | One success alert at the top; X dismisses it, then the locked note shows as on any closed work order. Same Finance tab and toolbar as today. The invoice number is the work order number and the document is stamped NO CHARGE. No Add Deposit, Create Invoice, Remit payment to or balance due. Downloads the invoice from the toolbar, then returns to the Work Orders list. On the document the stamp and the category line sit under the masthead line, left, clear of the logo that prints in the top centre. | SPEC-CONFLICT | IWO-D19, IWO-D28 | "stamped NO CHARGE" (its board shows INTERNAL; question 2); "X dismisses it" (no X drawn) |
| c-hf-19 (same text as c-flow1-9) | happy | Closed work orders show where invoiced ones show (All tab, Status chip), not in Completed, which lists work waiting for an invoice. | PRD-MATCH | S2-R10 |  |
| title1 t-hf-3 | happy | 3 · No Charge on a customer work order | LOOK-ONLY |  | row title |
| c-hf-20 | happy | Category is required when No Charge is ticked and starts empty; Save says Pick a category until one is picked. The list holds the shop's active No Charge categories (Warranty, Goodwill, Comeback to start). Warranty and Comeback also show Original work order: the customer's earlier work orders, same asset first, and Not in ShopView. Optional here, required at Close. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S2-R2, S2-R17 |  |
| c-hf-21 (same text as c-flow2-1) | happy | Shown while the setting is on and the work order is not invoiced; needs Work Orders Create & Edit and See Financial Data, like fees and discounts. | PRD-MATCH | S2-R5, PERM |  |
| c-hf-22 (same text as c-flow2-2) | happy | Clicks Convert to No Charge. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S2-R5, S2-R17 |  |
| c-hf-23 (same text as c-flow2-3) | happy | The category shows on the NO CHARGE document and in the report, not on the work order. | PRD-MATCH | S2-R16 |  |
| c-hf-24 (same text as c-flow2-3d) | happy | Every change of classification writes a system note on the work order and an Audit Log entry: Convert to No Charge (category, original work order, what was removed), Change category, Convert to Billable, Close and Reopen. Notes are read-only and carry who and when. | PRD-MATCH | S2-R18 |  |
| c-hf-25 (same text as c-flow2-3c) | happy | Opened from the menu (Change category). Save is enabled once the category or the original work order differs from the current one. | PRD-MATCH | S2-R6 | omits "or the original line" of S2-R6 (no conflict) |
| c-hf-26 (same text as c-flow2-3b) | happy | Convert to Billable asks first. | PRD-MATCH | S2-R6 |  |
| c-hf-27 | happy | Only when the category requires the original work order and none was picked at creation or conversion. Close Work Order stays disabled until a work order or Not in ShopView is picked; Goodwill never shows this. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S3-R2, S2-R17 |  |
| c-hf-28 (same text as c-flow2-4) | happy | Clicks Close Work Order. Stock parts post to the account of the category (Warranty: 6430). | PRD-MATCH | S3-R2 |  |
| c-hf-29 (same text as c-flow2-5) | happy | End of flow. Reopen Work Order sits in the invoice menu. The NO CHARGE stamp and Category: Warranty · Original work order S2-30455 sit under the masthead line, clear of the centred logo. | PRD-MATCH | S3-R5, S4-R1 |  |
| title1 t-hf-4 | happy | 4 · One no-charge line on a billable work order | LOOK-ONLY |  | row title |
| c-hf-30 (same text as c-flow6-1) | happy | On a billable work order, while Internal Work Orders is on and the work order is not invoiced. Same permissions as Convert to No Charge. The item replaces the earlier "Move to a No Charge work order" (dropped Nov 5: a shop that wants it separate splits the work order as today). | PRD-MATCH | S12-R1, OOS |  |
| c-hf-31 (same text as c-flow6-2) | happy | Clicks Mark as No Charge. Category and Original work order are the same fields as Convert to No Charge; the line stays where it is. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S12-R2 |  |
| c-hf-32 (same text as c-flow6-3) | happy | The line carries a No Charge · Warranty chip next to its name; Rate, Total and its parts show $0.00, hours and status unchanged. The original work order is in the notes and the Audit Log, not on the line. No badge on the work order: a normal billable work order with one no-charge line. Financial Info is the cost view and does not change: the cost of the no-charge line stays and posts to the Warranty account at invoicing. | PRD-MATCH | S12-R3, S12-R4 |  |
| c-hf-33 (same text as c-flow6-4) | happy | The marked line offers Change category and Mark as Billable. Mark as Billable prices the line at the customer's current pricing and removes the category. | SPEC-CONFLICT | IWO-D26 | "prices the line at the customer's current pricing" vs S12-R5/S2-R6 "as a new line would be today" |
| c-hf-34 (same text as c-flow6-5) | happy | Every line change writes a system note and an Audit Log row: who, when, category, original work order, the price removed, the cost and hours kept. | PRD-MATCH | S12-R6 |  |
| c-hf-35 | happy | The invoice of a billable work order: no INTERNAL or NO CHARGE stamp, no badge. The no-charge line prints with its hours and parts at $0.00 and one word under the title, Warranty. Totals, tax, deposits and portal approval on the billable amounts. The customer sees zero; the books see the cost: the line's parts cost posts to the Warranty expense account when the invoice is created. | PRD-MATCH | S12-R7, S12-R4, S12-R8 |  |
| title1 t-hf-5 | happy | 5 · Reopen | LOOK-ONLY |  | row title |
| c-hf-36 (same text as c-flow3-1) | happy | Reopen Work Order is in the Finance tab's invoice menu (Flow 2 frame 5). Opens the dialog of frame 2. The Change Customer button is disabled with the tooltip Reopen the work order to change the customer. A billable invoiced work order keeps today's behaviour. | PRD-MATCH | S4-R1, S2-R9 |  |
| c-hf-37 (same text as c-flow3-2) | happy | Clicks Reopen Work Order. Reopen needs the Work Orders — Delete permission, like Reverse. | PRD-MATCH | S4-R1, PERM |  |
| title1 t-hf-6 | happy | 6 · Find and report | LOOK-ONLY |  | row title |
| c-hf-38 (same text as c-flow4-2) | happy | Classification: No Charge (internal and customer no-charge work). Switches to the Estimates tab. | SPEC-CONFLICT | IWO-D36 | "Classification: No Charge (internal and customer no-charge work)" vs S2-R14 separate values |
| c-hf-39 (same text as c-flow4-5) | happy | One report for all free work: whole internal and no-charge work orders, and now one row per no-charge line of a billable work order (Line column, Classification "No Charge line", invoiced date). Summary strip per category above the table. Money reports exclude these rows without a filter. | PRD-MATCH | S9-R2, S9-R1 |  |
| title1 t-hf-7 | happy | 7 · Accounting | LOOK-ONLY |  | row title |
| c-hf-40 (same text as c-flow5-1) | happy | Reopen reverses only what was posted; an entry still waiting here gets no reversal and is marked withdrawn. | PRD-MATCH | S4-E1 |  |
| c-hf-41 | happy | Header and totals only; lines live on the NO CHARGE document in ShopView. Accounts per the AccountingHub owner (Nov 5): 6500 General Internal, 6430 Warranty & Goodwill (existing in the hub chart), Comeback Expense is a new account whose number the hub confirms; migration maps the starting categories automatically, never an empty row for them. | PRD-MATCH | S8-R1, S6-R2 |  |
| c-hf-42 (same text as c-flow5-4) | happy | Held retries automatically once the row is mapped or the period opened. Dismissed: the Close was withdrawn by Reopen before posting; nothing was posted, so nothing is reversed. | PRD-MATCH | S8-N2, S4-E1 |  |
| d-hf | happy | v6.1 · Nov 5, 2026 · Internal Work Orders after the CEO review  The happy path, one row per flow, top to bottom: set up, an internal work order to Close, a customer's no-charge work order to Close, one no-charge line on a billable work order, Reopen, finding and reporting, what the books see. Every frame is a copy of its frame on the flow pages; edge cases stay there. | LOOK-ONLY |  | page description |
| title1 t-rv-1 | review | 1 · Settings: what is there and turning it on | LOOK-ONLY |  | row title |
| c-rv-1-1 | review | Settings > Work Orders. One toggle, Internal Work Orders. Nothing else lives on this tab. | PRD-MATCH | S1-R1 |  |
| c-rv-1-2 (same text as c-flow0-1b) | review | First turn-on: pick the internal customers once. Nothing is preselected (the location is not always a customer). Afterwards the flag lives on the customer, not here. | PRD-MATCH | S1-R2, KD |  |
| c-rv-1-3 | review | Setting on. Two hint lines and a link to the Internal Work Orders page where the categories are managed. | PRD-MATCH | S1-R3 |  |
| title1 t-rv-2 | review | 2 · Categories: two lists the shop manages | LOOK-ONLY |  | row title |
| c-rv-2-1 | review | Internal categories: General Internal as default plus the shop's own (Company Vehicle Maintenance, Shop Equipment Maintenance). An expense account per category. | PRD-MATCH | S1-R13 |  |
| c-rv-2-2 | review | No Charge categories: Warranty, Goodwill, Comeback to start plus the shop's own (Policy dropped as a default). Third column: requires the original work order (Warranty, Comeback). | PRD-MATCH | S1-R13, OOS |  |
| c-rv-2-3 | review | A category: name, QuickBooks expense account per location, the flag. Archive, never delete; old work orders and reports keep their category. | PRD-MATCH | S1-R14, S1-R16 |  |
| title1 t-rv-3 | review | 3 · Where the categories show up | LOOK-ONLY |  | row title |
| c-rv-3-1 | review | QuickBooks ShopView Accounts: the same mapping, one row per category under Cost of Parts. Edit here or on the category. Nothing is created in QuickBooks; an empty row posts to ShopView Review as today. | PRD-MATCH | S5-R1, S5-R4 |  |
| c-rv-3-2 | review | Customer: Internal customer checkbox plus a Default internal category. | PRD-MATCH | S1-R7 | the board does not draw the select (IWO-D06) |
| c-rv-3-3 (same text as c-flow0-11b) | review | Asset of an internal customer: its own internal category. The QuickBooks mark sits in the explanation: categories are mapped to QuickBooks expense accounts. Priority: asset, then customer, then General Internal. | PRD-MATCH | S1-R15, S2-R1 |  |
| c-rv-3-4 | review | New work order for an internal customer: Internal badge, nothing to pick. The category comes from the asset, else the customer, else General Internal; the tooltip names it. Removed after the CEO review: the Internal category select. | PRD-MATCH | S2-R1, KD |  |
| c-rv-3-5 | review | Pick Forklift 2 and the tooltip names the asset's own category, Shop Equipment Maintenance. | PRD-MATCH | S2-R1 |  |
| c-rv-3-6 | review | New work order for a regular customer with No Charge ticked: Category required (the No Charge list), Original work order when the category requires it, optional here. | PRD-MATCH | S2-R2 |  |
| title1 t-rv-4 | review | 4 · Changing a work order | LOOK-ONLY |  | row title |
| c-rv-4-1 | review | Three dots on a billable work order: Convert to No Charge. Same permissions as fees and discounts. | PRD-MATCH | S2-R5, PERM |  |
| c-rv-4-2 | review | Convert asks for the category and the original work order. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S2-R5, S2-R17 |  |
| c-rv-4-3 | review | Change category: same two fields. | PRD-MATCH | S2-R6 |  |
| c-rv-4-4 (same text as c-flow2-3b) | review | Convert to Billable asks first. | PRD-MATCH | S2-R6 |  |
| c-rv-4-5 | review | Every one of these writes a system note on the work order and an Audit Log row: who, when, category, original work order, what was removed. | PRD-MATCH | S2-R18 |  |
| title1 t-rv-5 | review | 5 · Closing | LOOK-ONLY |  | row title |
| c-rv-5-1 | review | Close: the original work order is required for Warranty and Comeback, with Not in ShopView for jobs done before ShopView. The original technician is stored with it. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S3-R2, S2-R17 |  |
| c-rv-5-2 | review | Close confirmation names the category's account. Parts cost debits it; the inventory credit stays as today. | PRD-MATCH | S3-R2, KD |  |
| c-rv-5-3 | review | Internal Work Order document: stamp and category under the masthead, clear of the logo. | PRD-MATCH | S3-R5 |  |
| c-rv-5-4 | review | NO CHARGE document: stamp, Category and Original work order under the masthead. | PRD-MATCH | S3-R5, S2-R16 |  |
| c-rv-5-5 | review | Closed work orders in the list, next to invoiced ones. | PRD-MATCH | S2-R10 |  |
| title1 t-rv-6 | review | 6 · One no-charge line on a billable work order | LOOK-ONLY |  | row title |
| c-rv-6-1 (same text as c-flow6-1) | review | On a billable work order, while Internal Work Orders is on and the work order is not invoiced. Same permissions as Convert to No Charge. The item replaces the earlier "Move to a No Charge work order" (dropped Nov 5: a shop that wants it separate splits the work order as today). | PRD-MATCH | S12-R1, OOS |  |
| c-rv-6-2 (same text as c-flow6-2) | review | Clicks Mark as No Charge. Category and Original work order are the same fields as Convert to No Charge; the line stays where it is. New: an optional Original line select under the original work order; the line sets the original technician for the comeback and warranty numbers (else the lead technician of the original work order). | PRD-MATCH | S12-R2 |  |
| c-rv-6-3 (same text as c-flow6-3) | review | The line carries a No Charge · Warranty chip next to its name; Rate, Total and its parts show $0.00, hours and status unchanged. The original work order is in the notes and the Audit Log, not on the line. No badge on the work order: a normal billable work order with one no-charge line. Financial Info is the cost view and does not change: the cost of the no-charge line stays and posts to the Warranty account at invoicing. | PRD-MATCH | S12-R3, S12-R4 |  |
| c-rv-6-4 (same text as c-flow6-4) | review | The marked line offers Change category and Mark as Billable. Mark as Billable prices the line at the customer's current pricing and removes the category. | SPEC-CONFLICT | IWO-D26 | "prices the line at the customer's current pricing" vs S12-R5/S2-R6 "as a new line would be today" |
| c-rv-6-5 (same text as c-flow6-5) | review | Every line change writes a system note and an Audit Log row: who, when, category, original work order, the price removed, the cost and hours kept. | PRD-MATCH | S12-R6 |  |
| c-rv-6-6 (same text as c-hf-35) | review | The invoice of a billable work order: no INTERNAL or NO CHARGE stamp, no badge. The no-charge line prints with its hours and parts at $0.00 and one word under the title, Warranty. Totals, tax, deposits and portal approval on the billable amounts. The customer sees zero; the books see the cost: the line's parts cost posts to the Warranty expense account when the invoice is created. | PRD-MATCH | S12-R7, S12-R4, S12-R8 |  |
| title1 t-rv-7 | review | 7 · Finding it and the books | LOOK-ONLY |  | row title |
| c-rv-7-1 | review | List chip: All, Billable, Internal, No Charge. | PRD-MATCH | S2-R14 |  |
| c-rv-7-2 (same text as c-flow4-5) | review | One report for all free work: whole internal and no-charge work orders, and now one row per no-charge line of a billable work order (Line column, Classification "No Charge line", invoiced date). Summary strip per category above the table. Money reports exclude these rows without a filter. | PRD-MATCH | S9-R2, S9-R1 |  |
| c-rv-7-3 | review | AccountingHub Closed record with Classification, Category, Original work order, Original technician. One mapping row per category, seeded. Accounts per the AccountingHub owner (Nov 5): 6500 General Internal, 6430 Warranty & Goodwill (existing in the hub chart), Comeback Expense is a new account whose number the hub confirms; migration maps the starting categories automatically, never an empty row for them. | PRD-MATCH | S8-R1, S6-R2 |  |
| c-rv-7-4 | review | Held names the category row that is not mapped; Dismissed when a Reopen withdraws a Close. | PRD-MATCH | S8-N2 |  |
| title1 t-rv-8 | review | 8 · Not built, and why | LOOK-ONLY |  | row title |
| s-rv-8-1 | review | Moving a line to its own work order: dropped (Nov 5)  The CEO review settled the line case the other way: a no-charge line stays on the billable work order (row 6). One invoice, the warranty line at $0.00, the rest paid as usual.  What that adds to the build: a classification and category per line; $0.00 pricing of the line on the work order, the invoice, the portal and the Finance tab; the line's parts cost posted to the category's account at invoicing; the hub record carrying the line-level category and cost. Whole-work-order No Charge stays as in rows 3 to 5.  A shop that wants the free work on its own work order splits the work order as today, then converts it. | PRD-MATCH | KD, OOS |  |
| s-rv-8-2 | review | V2, right after V1: labor posting and technician rates  V1 posts the parts cost at Close: a real inventory movement with a known cost. Labor is already paid through payroll, so posting labor on a warranty job means moving a cost out of payroll into the category's account: an internal labor cost per technician, a rule the accountant signs off, and a mapping row per category per kind (parts, labor).  V1 already stores the category, the original work order, the original technician and the hours on every internal and no-charge work order and shows them in the report. V2 adds the labor posting and the comeback and warranty rates per technician on top. Doing it in V1 would hold the whole feature for the accounting rule. | PRD-MATCH | OV |  |
| s-rv-8-3 | review | Separate features, not V1 or V2  Manufacturer warranty as a receivable: claiming the cost back from the manufacturer is a claim process with its own accounting.  Retail value of free work on the document or the report: pricing and reporting, no change to classification or posting.  Goodwill approval flow: who may give work away for free is permissions and approval, a workflow feature. | PRD-MATCH | OOS |  |
| d-rv | review | v6.1 · Nov 5, 2026 · Review page  The screens that changed after the CEO review, in the order a shop meets them: Settings, the categories, where they show up, changing a work order, closing, one no-charge line on a billable work order, finding it and the books, then what was left out on purpose. Every frame is a copy of its Happy flow frame; the number after the dot is the Happy flow frame number. | LOOK-ONLY |  | page description |
| c-flow6-6 | flow6 | Second door, same fields: the No Charge checkbox at the bottom of Edit Line and of New Line, so a warranty line can be born No Charge from the Line Builder. | PRD-MATCH | S12-R1 |  |
| c-flow6-7 (same text as c-hf-35) | flow6 | The invoice of a billable work order: no INTERNAL or NO CHARGE stamp, no badge. The no-charge line prints with its hours and parts at $0.00 and one word under the title, Warranty. Totals, tax, deposits and portal approval on the billable amounts. The customer sees zero; the books see the cost: the line's parts cost posts to the Warranty expense account when the invoice is created. | PRD-MATCH | S12-R7, S12-R4, S12-R8 |  |
| c-hf-39b (same text as c-flow4-6) | happy | Second tab of the same report, grouped by original technician: completed lines in the range, comeback lines, warranty lines, comeback rate, hours and parts cost of the redo. No new data: it reads the same rows as the first tab through the original line. The dollar cost of labor arrives with labor posting (V2). | PRD-MATCH | S9-R2 |  |
| c-hf-41b (same text as c-flow5-3c) | happy | A billable work order with one no-charge line reaches the hub as an ordinary invoice record (Paid), with a No Charge lines block: line, category, original work order and line, technician, hours, parts cost, expense account. The journal entry posts the billable parts cost to Cost of Parts and the no-charge line's parts cost to the category account. Accounts per the AccountingHub owner (Nov 5): 6500 General Internal, 6430 Warranty & Goodwill (existing in the hub chart), Comeback Expense is a new account whose number the hub confirms; migration maps the starting categories automatically, never an empty row for them. | PRD-MATCH | S8-R7, S6-R2 | Comeback number: the hub owner confirmed 6440 on 2026-11-09 (S6-R2), newer than the note |
| c-rv-7-5 (same text as c-flow4-6) | review | Second tab of the same report, grouped by original technician: completed lines in the range, comeback lines, warranty lines, comeback rate, hours and parts cost of the redo. No new data: it reads the same rows as the first tab through the original line. The dollar cost of labor arrives with labor posting (V2). | PRD-MATCH | S9-R2 |  |
| c-rv-7-6 (same text as c-flow5-3c) | review | A billable work order with one no-charge line reaches the hub as an ordinary invoice record (Paid), with a No Charge lines block: line, category, original work order and line, technician, hours, parts cost, expense account. The journal entry posts the billable parts cost to Cost of Parts and the no-charge line's parts cost to the category account. Accounts per the AccountingHub owner (Nov 5): 6500 General Internal, 6430 Warranty & Goodwill (existing in the hub chart), Comeback Expense is a new account whose number the hub confirms; migration maps the starting categories automatically, never an empty row for them. | PRD-MATCH | S8-R7, S6-R2 | Comeback number: the hub owner confirmed 6440 on 2026-11-09 (S6-R2), newer than the note |

## Board titles and page names

| Page | Board | Title | Class | Register |
|---|---|---|---|---|
| happy | hf-01.dc.html | 01 Turn on Internal Work Orders | LOOK-ONLY |  |
| happy | hf-02.dc.html | 02 Pick your internal customers | LOOK-ONLY |  |
| happy | hf-03.dc.html | 03 Setting on | LOOK-ONLY |  |
| happy | hf-04.dc.html | 04 Internal categories | LOOK-ONLY |  |
| happy | hf-05.dc.html | 05 No Charge categories | LOOK-ONLY |  |
| happy | hf-06.dc.html | 06 New No Charge category | LOOK-ONLY |  |
| happy | hf-07.dc.html | 07 Customers list | LOOK-ONLY |  |
| happy | hf-08.dc.html | 08 Edit Customer · Internal customer | LOOK-ONLY |  |
| happy | hf-09.dc.html | 09 Edit Asset · internal category | LOOK-ONLY |  |
| happy | hf-10.dc.html | 10 QuickBooks · one row per category | LOOK-ONLY |  |
| happy | hf-11.dc.html | 11 Work orders list | LOOK-ONLY |  |
| happy | hf-12.dc.html | 12 New work order · internal customer | LOOK-ONLY |  |
| happy | hf-13.dc.html | 13 Asset with its own category | LOOK-ONLY |  |
| happy | hf-14.dc.html | 14 In progress: cost and hours, no prices | LOOK-ONLY |  |
| happy | hf-15.dc.html | 15 Finance tab | LOOK-ONLY |  |
| happy | hf-16.dc.html | 16 Complete, ready to close | LOOK-ONLY |  |
| happy | hf-17.dc.html | 17 Close confirmation | LOOK-ONLY |  |
| happy | hf-18.dc.html | 18 Closed · INTERNAL document | LOOK-ONLY |  |
| happy | hf-19.dc.html | 19 Work orders list · Status Closed | LOOK-ONLY |  |
| happy | hf-20.dc.html | 20 New work order · No Charge, category, original | LOOK-ONLY |  |
| happy | hf-21.dc.html | 21 Or convert a billable work order | LOOK-ONLY |  |
| happy | hf-22.dc.html | 22 Confirm: category and original work order | LOOK-ONLY |  |
| happy | hf-23.dc.html | 23 After the convert | LOOK-ONLY |  |
| happy | hf-24.dc.html | 24 Notes record the convert | LOOK-ONLY |  |
| happy | hf-25.dc.html | 25 Change category | LOOK-ONLY |  |
| happy | hf-26.dc.html | 26 Convert to Billable | LOOK-ONLY |  |
| happy | hf-27.dc.html | 27 Close · original work order required | LOOK-ONLY |  |
| happy | hf-28.dc.html | 28 Close confirmation | LOOK-ONLY |  |
| happy | hf-29.dc.html | 29 Closed · NO CHARGE document | LOOK-ONLY |  |
| happy | hf-30.dc.html | 30 Line menu · Mark as No Charge | LOOK-ONLY |  |
| happy | hf-31.dc.html | 31 Mark this line as No Charge? | LOOK-ONLY |  |
| happy | hf-32.dc.html | 32 Line marked No Charge · $0.00 | LOOK-ONLY |  |
| happy | hf-33.dc.html | 33 Line menu · Change category, Mark as Billable | LOOK-ONLY |  |
| happy | hf-34.dc.html | 34 Notes and Audit Log | LOOK-ONLY |  |
| happy | hf-35.dc.html | 35 Invoice · the line at $0.00, Warranty | SPEC-CONFLICT | IWO-D39 |
| happy | hf-36.dc.html | 36 Closed work order | LOOK-ONLY |  |
| happy | hf-37.dc.html | 37 Reopen Work Order | LOOK-ONLY |  |
| happy | hf-38.dc.html | 38 Work orders list · Classification | LOOK-ONLY |  |
| happy | hf-39.dc.html | 39 Internal Work Orders report | LOOK-ONLY |  |
| happy | hf-39b.dc.html | 39b Internal Work Orders report · by technician | LOOK-ONLY |  |
| happy | hf-40.dc.html | 40 QuickBooks · held entry | LOOK-ONLY |  |
| happy | hf-41.dc.html | 41 AccountingHub · Closed record | LOOK-ONLY |  |
| happy | hf-42.dc.html | 42 AccountingHub · Held event | LOOK-ONLY |  |
| happy | hf-41b.dc.html | 41b AccountingHub · Invoice record with one No Charge line | LOOK-ONLY |  |
| review | rv-1-1.dc.html | 1.1 · 01 Turn on Internal Work Orders | LOOK-ONLY |  |
| review | rv-1-2.dc.html | 1.2 · 02 Pick your internal customers | LOOK-ONLY |  |
| review | rv-1-3.dc.html | 1.3 · 03 Setting on | LOOK-ONLY |  |
| review | rv-2-1.dc.html | 2.1 · 04 Internal categories | LOOK-ONLY |  |
| review | rv-2-2.dc.html | 2.2 · 05 No Charge categories | LOOK-ONLY |  |
| review | rv-2-3.dc.html | 2.3 · 06 New No Charge category | LOOK-ONLY |  |
| review | rv-3-1.dc.html | 3.1 · 10 QuickBooks · one row per category | LOOK-ONLY |  |
| review | rv-3-2.dc.html | 3.2 · 08 Edit Customer · Internal customer | LOOK-ONLY |  |
| review | rv-3-3.dc.html | 3.3 · 09 Edit Asset · internal category | LOOK-ONLY |  |
| review | rv-3-4.dc.html | 3.4 · 12 New work order · internal customer | LOOK-ONLY |  |
| review | rv-3-5.dc.html | 3.5 · 13 Asset with its own category | LOOK-ONLY |  |
| review | rv-3-6.dc.html | 3.6 · 20 New work order · No Charge, category, original | LOOK-ONLY |  |
| review | rv-4-1.dc.html | 4.1 · 21 Or convert a billable work order | LOOK-ONLY |  |
| review | rv-4-2.dc.html | 4.2 · 22 Confirm: category and original work order | LOOK-ONLY |  |
| review | rv-4-3.dc.html | 4.3 · 25 Change category | LOOK-ONLY |  |
| review | rv-4-4.dc.html | 4.4 · 26 Convert to Billable | LOOK-ONLY |  |
| review | rv-4-5.dc.html | 4.5 · 24 Notes record the convert | LOOK-ONLY |  |
| review | rv-5-1.dc.html | 5.1 · 27 Close · original work order required | LOOK-ONLY |  |
| review | rv-5-2.dc.html | 5.2 · 17 Close confirmation | LOOK-ONLY |  |
| review | rv-5-3.dc.html | 5.3 · 18 Closed · INTERNAL document | LOOK-ONLY |  |
| review | rv-5-4.dc.html | 5.4 · 29 Closed · NO CHARGE document | LOOK-ONLY |  |
| review | rv-5-5.dc.html | 5.5 · 19 Work orders list · Status Closed | LOOK-ONLY |  |
| review | rv-6-1.dc.html | 6.1 · 30 Line menu · Mark as No Charge | LOOK-ONLY |  |
| review | rv-6-2.dc.html | 6.2 · 31 Mark this line as No Charge? | LOOK-ONLY |  |
| review | rv-6-3.dc.html | 6.3 · 32 Line marked No Charge · $0.00 | LOOK-ONLY |  |
| review | rv-6-4.dc.html | 6.4 · 33 Line menu · Change category, Mark as Billable | LOOK-ONLY |  |
| review | rv-6-5.dc.html | 6.5 · 34 Notes and Audit Log | LOOK-ONLY |  |
| review | rv-6-6.dc.html | 6.6 · 35 Invoice · the line at $0.00, Warranty | SPEC-CONFLICT | IWO-D39 |
| review | rv-7-1.dc.html | 7.1 · 38 Work orders list · Classification | LOOK-ONLY |  |
| review | rv-7-2.dc.html | 7.2 · 39 Internal Work Orders report | LOOK-ONLY |  |
| review | rv-7-3.dc.html | 7.3 · 41 AccountingHub · Closed record | LOOK-ONLY |  |
| review | rv-7-4.dc.html | 7.4 · 42 AccountingHub · Held event | LOOK-ONLY |  |
| review | rv-7-5.dc.html | 7.5 · 39b Report · by technician | LOOK-ONLY |  |
| review | rv-7-6.dc.html | 7.6 · 41b Hub · invoice with one No Charge line | LOOK-ONLY |  |
| flow0 | Main.dc.html | 01 Settings · Work Orders, setting off | LOOK-ONLY |  |
| flow0 | flow0-1b.dc.html | 01b Turn on · pick your internal customers | LOOK-ONLY |  |
| flow0 | flow0-2.dc.html | 02 Settings · setting on | LOOK-ONLY |  |
| flow0 | flow0-2a.dc.html | 2a Internal Work Orders page · Internal categories | LOOK-ONLY |  |
| flow0 | flow0-2b.dc.html | 2b Internal Work Orders page · No Charge categories | LOOK-ONLY |  |
| flow0 | flow0-2c.dc.html | 2c New No Charge Category | LOOK-ONLY |  |
| flow0 | flow0-2d.dc.html | 2d New Internal Category | LOOK-ONLY |  |
| flow0 | flow0-2e.dc.html | 2e Internal Work Orders page · setting off | LOOK-ONLY |  |
| flow0 | flow0-3.dc.html | 03 Settings · setting on, no flagged customer | SPEC-CONFLICT | IWO-D03 |
| flow0 | flow0-4.dc.html | 04 Customers list | LOOK-ONLY |  |
| flow0 | flow0-5.dc.html | 05 Customer page · internal customer | LOOK-ONLY |  |
| flow0 | flow0-6.dc.html | 06 Edit Customer · setting off | LOOK-ONLY |  |
| flow0 | flow0-7.dc.html | 07 Make internal · confirm | LOOK-ONLY |  |
| flow0 | flow0-8.dc.html | 08 Remove flag · confirm | LOOK-ONLY |  |
| flow0 | flow0-9.dc.html | 09 Settings > Integrations > QuickBooks | LOOK-ONLY |  |
| flow0 | flow0-10.dc.html | 10 QuickBooks · category row not set | LOOK-ONLY |  |
| flow0 | flow0-11.dc.html | 11 Edit Customer · Min without % | LOOK-ONLY |  |
| flow0 | flow0-11b.dc.html | 11b Edit Asset · internal category | LOOK-ONLY |  |
| flow0 | flow0-12.dc.html | 12 Settings · turned off | LOOK-ONLY |  |
| flow1 | flow1-1.dc.html | 01 Work orders list | LOOK-ONLY |  |
| flow1 | flow1-2a.dc.html | 02a New work order | LOOK-ONLY |  |
| flow1 | flow1-2b.dc.html | 02b New work order · internal customer | LOOK-ONLY |  |
| flow1 | flow1-2b2.dc.html | 2b2 New work order · asset with its own category | LOOK-ONLY |  |
| flow1 | flow1-2c.dc.html | 2c Change customer · bill already posted | LOOK-ONLY |  |
| flow1 | flow1-2d.dc.html | 2d Change customer · bill already posted | LOOK-ONLY |  |
| flow1 | flow1-2e.dc.html | 02e New work order · No Charge ticked | LOOK-ONLY |  |
| flow1 | flow1-3.dc.html | 03 Work order · in progress | LOOK-ONLY |  |
| flow1 | flow1-3c.dc.html | 3c Menu · internal | LOOK-ONLY |  |
| flow1 | flow1-3d.dc.html | 3d Finance tab · Close | LOOK-ONLY |  |
| flow1 | flow1-3e.dc.html | 3e Lines · core row | LOOK-ONLY |  |
| flow1 | flow1-4.dc.html | 04 Work order · Finance tab | LOOK-ONLY |  |
| flow1 | flow1-4b.dc.html | 04b Work order · Ready for review | LOOK-ONLY |  |
| flow1 | flow1-5.dc.html | 05 Work order · Complete, ready to close | LOOK-ONLY |  |
| flow1 | flow1-6.dc.html | 06 Close · Missing Details first | LOOK-ONLY |  |
| flow1 | flow1-6b.dc.html | 07 Close · confirm | LOOK-ONLY |  |
| flow1 | flow1-6c.dc.html | 7b Close · no account set | LOOK-ONLY |  |
| flow1 | flow1-6d.dc.html | 7c Close · no accounting integration | LOOK-ONLY |  |
| flow1 | flow1-6e.dc.html | 7d Close · parts with no cost | LOOK-ONLY |  |
| flow1 | flow1-6f.dc.html | 7e Close · work order changed | LOOK-ONLY |  |
| flow1 | flow1-6g.dc.html | 7f Close · QuickBooks without inventory accounts | LOOK-ONLY |  |
| flow1 | flow1-8.dc.html | 08 Work order · Closed, invoice | LOOK-ONLY |  |
| flow1 | flow1-9.dc.html | 09 Work orders list · All tab, Status Closed | LOOK-ONLY |  |
| flow1 | flow1-10b.dc.html | 10b Asset · Invoices tab | LOOK-ONLY |  |
| flow1 | flow1-S2.dc.html | S2 Close Work Order · failed | LOOK-ONLY |  |
| flow2 | flow2-1.dc.html | 01 Convert to No Charge | LOOK-ONLY |  |
| flow2 | flow2-1b.dc.html | 1b Convert to No Charge · deposit | LOOK-ONLY |  |
| flow2 | flow2-1c.dc.html | 1c Convert to No Charge · no permission | LOOK-ONLY |  |
| flow2 | flow2-2.dc.html | 02 Confirm | LOOK-ONLY |  |
| flow2 | flow2-3.dc.html | 03 No charge work order | LOOK-ONLY |  |
| flow2 | flow2-3b.dc.html | 3b Convert to Billable · confirm | LOOK-ONLY |  |
| flow2 | flow2-3c.dc.html | 3c Change category | LOOK-ONLY |  |
| flow2 | flow2-3d.dc.html | 3d Notes · after Convert to No Charge | LOOK-ONLY |  |
| flow2 | flow2-3e.dc.html | 3e Notes · after Convert to Billable | LOOK-ONLY |  |
| flow2 | flow2-4.dc.html | 04 Close · confirm | LOOK-ONLY |  |
| flow2 | flow2-4b.dc.html | 4b Close · original work order required | LOOK-ONLY |  |
| flow2 | flow2-5.dc.html | 05 Finance tab · closed | LOOK-ONLY |  |
| flow2 | flow2-6.dc.html | 06 Closed · read-only | LOOK-ONLY |  |
| flow2 | flow2-7.dc.html | 07 Finance tab · open estimate | LOOK-ONLY |  |
| flow2 | flow2-7b.dc.html | 7b Portal · no-charge estimate | LOOK-ONLY |  |
| flow3 | flow3-1.dc.html | 01 Work order · Closed | LOOK-ONLY |  |
| flow3 | flow3-2.dc.html | 02 Reopen dialog | LOOK-ONLY |  |
| flow3 | flow3-3.dc.html | 03 Work order · Complete again | LOOK-ONLY |  |
| flow4 | flow4-1.dc.html | 01 Work orders list | LOOK-ONLY |  |
| flow4 | flow4-2.dc.html | 02 List · No Charge | SPEC-CONFLICT | IWO-D36 |
| flow4 | flow4-3.dc.html | 03 List · No Charge, no results | SPEC-CONFLICT | IWO-D36 |
| flow4 | flow4-4.dc.html | 04 Technician Efficiency · Show all | LOOK-ONLY |  |
| flow4 | flow4-5.dc.html | 05 Internal Work Orders report | LOOK-ONLY |  |
| flow4 | flow4-6.dc.html | 06 Internal Work Orders report · by technician | LOOK-ONLY |  |
| flow4 | flow4-7.dc.html | 07 Mobile · list card | LOOK-ONLY |  |
| flow4 | flow4-8.dc.html | 08 Mobile · detail header | LOOK-ONLY |  |
| flow4 | flow4-9.dc.html | 09 Tech View | LOOK-ONLY |  |
| flow4 | flow4-10.dc.html | 10 Board · internal card | LOOK-ONLY |  |
| flow4 | flow4-11.dc.html | 11 Schedule · card | LOOK-ONLY |  |
| flow5 | flow5-1.dc.html | 01 QB Unexported · held entry | LOOK-ONLY |  |
| flow5 | flow5-3.dc.html | 03 AccountingHub · Sales > Invoices | LOOK-ONLY |  |
| flow5 | flow5-3b.dc.html | 3b AccountingHub · Closed record | LOOK-ONLY |  |
| flow5 | flow5-4.dc.html | 04 AccountingHub · Held event | LOOK-ONLY |  |
| flow5 | flow5-3c.dc.html | 3c AccountingHub · Invoice record with one No Charge line | LOOK-ONLY |  |
| flow6 | flow6-1.dc.html | 01 Line menu · Mark as No Charge | LOOK-ONLY |  |
| flow6 | flow6-2.dc.html | 02 Mark this line as No Charge? | LOOK-ONLY |  |
| flow6 | flow6-3.dc.html | 03 Line marked No Charge · $0.00 | LOOK-ONLY |  |
| flow6 | flow6-4.dc.html | 04 Line menu · Change category, Mark as Billable | LOOK-ONLY |  |
| flow6 | flow6-5.dc.html | 05 Notes and Audit Log | LOOK-ONLY |  |
| flow6 | flow6-6.dc.html | 06 Edit Line · No Charge in the dialog | LOOK-ONLY |  |
| flow6 | flow6-7.dc.html | 07 Invoice · the line at $0.00, Warranty | SPEC-CONFLICT | IWO-D39 |
| components | WO-Detail-Artboard-v6.dc.html | WO Detail Artboard v6 | LOOK-ONLY |  |
| components | WO-List-Artboard-v6.dc.html | WO List Artboard v6 | LOOK-ONLY |  |
| components | WO-Settings-Artboard-v6.dc.html | WO Settings Artboard v6 | LOOK-ONLY |  |
| components | New-WO-Dialog-v6.dc.html | New WO Dialog v6 | LOOK-ONLY |  |
| happy |  | Happy flow v6 | LOOK-ONLY |  |
| review |  | Review · What changed after the CEO review | LOOK-ONLY |  |
| flow0 |  | Flow 0 · Turn it on | LOOK-ONLY |  |
| flow1 |  | Flow 1 · Create and close | LOOK-ONLY |  |
| flow2 |  | Flow 2 · No charge on a customer's work order | LOOK-ONLY |  |
| flow3 |  | Flow 3 · Reopen | LOOK-ONLY |  |
| flow4 |  | Flow 4 · Find internal and no-charge work orders | LOOK-ONLY |  |
| flow5 |  | Flow 5 · What the books see | LOOK-ONLY |  |
| flow6 |  | Flow 6 · Move one line off a billable work order | SPEC-CONFLICT | IWO-D49 |
| components |  | Shared screens | LOOK-ONLY |  |

## Source-only strings (in the board files, drawn by no board)

| File | Text | Class | Note |
|---|---|---|---|
| New-WO-Dialog-v6.dc.html |  has no assets yet. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | . Change it if this job belongs elsewhere. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | From the asset  | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | From the customer. Change it if this job belongs elsewhere. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | Internal customer: every work order is no charge. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | Internal customers tick this automatically. You can use it for any customer. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | Reason * | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | Warranty, goodwill, comeback or policy work. Closes without an invoice; parts cost posts to Customer No-Charge Expense. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | Warranty, goodwill, policy or comeback work. Closes without an invoice; parts cost posts to Customer No-Charge Expense. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| New-WO-Dialog-v6.dc.html | the category account | OUT-OF-SCOPE S7-R3,S7-R8,S8-R3,S9-R15,S12-E3,S12-E7 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | 1.0 hrs | DATA | demo data |
| WO-Detail-Artboard-v6.dc.html | 1.5 hrs | DATA | demo data |
| WO-Detail-Artboard-v6.dc.html | 2016 Ford Transit | DATA | demo data |
| WO-Detail-Artboard-v6.dc.html | Add Deposit, Create Invoice, Remit payment to, Terms, balance due | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Caliper seized on the driver side, special order placed. Note came with the line. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Category changed from Warranty to Comeback by Admin ShopView. Original work order S2-30455 kept. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Convert to external | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Convert to internal | OUT-OF-SCOPE KD | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Created on Oct 15, 2026 by Admin ShopView with the line, its parts and its hours. Work order S2-34918 keeps its other lines and stays billable. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Delete work order | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Estimate S2-34863 | OUT-OF-SCOPE OV,S1-R11,TERM | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Estimate S2-35120 | OUT-OF-SCOPE OV,S1-R11,TERM | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Internal invoice, Oct 3, 2026 | OUT-OF-SCOPE TERM | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Invoice date: | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Line "Replace - Brake caliper" moved here from work order S2-34918 by Admin ShopView. Category Warranty, original work order S2-30455. Parts: Caliper (special order) x 1. Hours: 1.00 (M. Rhodes). | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Line "Replace - Brake caliper" moved to No Charge work order S2-35120 (Warranty) by Admin ShopView. This work order stays billable. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Line moved here from work order | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Move to a No Charge work order | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Move to an Internal work order | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | No Charge Work Order S2-34863 | OUT-OF-SCOPE S3-R5 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | No Charge Work Order S2-35120 | OUT-OF-SCOPE S3-R5 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Oct 14, 2026 4:02 PM | DATA | demo data |
| WO-Detail-Artboard-v6.dc.html | Oct 16, 2026 8:51 AM | DATA | demo data |
| WO-Detail-Artboard-v6.dc.html | On the internal invoice when the work order is closed | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Reopening reverses the internal invoice. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Reverse the deposit first | OUT-OF-SCOPE S2-N4,§8-13 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Detail-Artboard-v6.dc.html | Tax, Total, Payments, Balance due, Signature | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Unit 3 | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Warranty, goodwill, policy or comeback work. Closes without an invoice; parts cost posts to Customer No-Charge Expense. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Detail-Artboard-v6.dc.html | Work order S2-34918 closed. Internal invoice created. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-List-Artboard-v6.dc.html | Only internal | OUT-OF-SCOPE OV,KD,TERM,S9-R2,S9-R3 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Settings-Artboard-v6.dc.html | 4000 Labor Income | DATA | demo data |
| WO-Settings-Artboard-v6.dc.html | 4100 Parts Sales | DATA | demo data |
| WO-Settings-Artboard-v6.dc.html | 5000 Cost of Goods Sold | DATA | demo data |
| WO-Settings-Artboard-v6.dc.html | 6400 Repairs and Maintenance | DATA | demo data |
| WO-Settings-Artboard-v6.dc.html | Account mapping | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Add customer | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Choose the QuickBooks account each Shopview amount posts to. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Close or move the 2 open internal work orders first. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Flag your own company as an internal customer on its customer page: Edit Customer > Internal customer. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Internal work orders: expense account | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Labor income | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Labor on internal work orders | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Lets you mark work orders as internal. They close without an invoice and their parts cost is posted to your internal expense account. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Move labor cost at technician pay | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | No internal customer set. Work orders for your own equipment stay billable until you add one. No charge on customer work orders works now. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No charge on customer work orders works now. | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Parts income | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | QuickBooks account | OUT-OF-SCOPE S3-R2 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| WO-Settings-Artboard-v6.dc.html | Set the internal expense account in Settings > | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| WO-Settings-Artboard-v6.dc.html | Staging Heavy Duty Rentals | OUT-OF-SCOPE | in the board source only: a prop value or switched-off variant that no board of the canvas draws |
| flow2-6.dc.html | Reopen the work order to change the customer. | OUT-OF-SCOPE S2-R9 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| flow3-1.dc.html | Reopen the work order to change the customer. | OUT-OF-SCOPE S2-R9 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
| hf-36.dc.html | Reopen the work order to change the customer. | OUT-OF-SCOPE S2-R9 | in the board source only: a prop value or switched-off variant that no board of the canvas draws (would be PRD-MATCH) |
