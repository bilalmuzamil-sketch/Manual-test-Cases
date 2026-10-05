# SV-10740 — what to type on sv10740

**Ticket:** [SV-10740 — Short Words Lose Their Record On A One-Letter Typo, With No Guidance On Screen](https://shopview.atlassian.net/browse/SV-10740)  
**Branch:** https://sv10740.qa.shopview.com — build `v26.40.3-da63248`, workplace **Staging Heavy Duty - 9919**  
**Data proven:** 2026-10-05T07:52:14Z — every row below was searched on this branch, correct word first, then the typo, and judged by **which record came back**, not by how many.

## 1 · Every tab — the ticket's own words

Type the **correct word** first and note the record it finds. Then clear the box and type the **typo**. The ticket is fixed for that tab when the typo brings back **that same record** — or, if it does not, when the screen tells you what to do (type more, word too short).

| Tab | Type first | Then type | The record to look for | Seeded for this ticket? |
|---|---|---|---|---|
| **All** | `Maria` | `Maxia` | S2-7715, Mariah's Truck & Trailer Repair | no — already on the branch |
| **Work orders** | `Santa` | `Saxta` | S10740-17620, S10740-17619 | no — already on the branch |
| **Customers** | `Greene` | `Grexne` | Truckmaster Truck & Trailer Repair - Erie, Kearny Truck Repair | no — already on the branch |
| **Assets** | `Johnson` | `Johxson` | 2018 Freightliner Cascadia, 2024 Freightliner Cascadia | no — already on the branch |
| **Parts** | `Cleaner` | `Clexner` | Brake & Parts Cleaner, Restore Plus Cooling System Cleaner | no — already on the branch |
| **Vendors** | `Ranking` | `Ranxing` | ZZVENDORPO Supply Open, ZZVENDORPO Supply Quiet | no — already on the branch |
| **Part sales** | `Adrian` | `Adrxan` | P10740-256 | **yes** — this branch had no 'Adrian' record |
| **Purchase orders** | `Adams` | `Adxms` | I10740-1402 | **yes** — this branch had no 'Adams' record |
| **Vendor invoices** | `Abadi` | `Abxdi` | ZZTINV-FZABADI-DI01 | **yes** — this branch had no 'Abadi' record |

> On the day the data was seeded, all nine typos brought the record back on this branch. That is a **reading of the build on 2026-10-05**, not your verdict — run them yourself.

## 2 · What must NOT match — the six identifier fields

The ticket's own numbers (`S3-31627`, `I3-721`, `P3-132`…) are **staging** numbers and do not exist on this branch. Use these instead. The third column must still find the record; the fourth must find **nothing** — each was checked to be a number this branch genuinely does not hold.

| Tab | Field | Exact — must find | Punctuation stripped — must still find | One character wrong — must find NOTHING |
|---|---|---|---|---|
| Work orders | WO number | `S10740-17584` | `S1074017584` | `S10740-17504` |
| Purchase orders | PO number | `I10740-1402` | `I107401402` | `I10740-1404` |
| Vendor invoices | Invoice number | `ZZTINV-FZABADI-DI01` | `ZZTINVFZABADIDI01` | `ZZTINV-FZABADI-DI00` |
| Assets | VIN | `1FUJGLDR9CLBP8834` | `1FUJGLDR9CLBP8834` | `1FUJGLDR9CLBP8830` |
| Parts | Part number | `ZZFIELDPN-7781` | `ZZFIELDPN7781` | `ZZFIELDPN-7780` |
| Part sales | P-number | `P10740-256` | `P10740256` | `P10740-255` |

## 3 · Other cases in run 415 that name a production number

Three cases tell you to type a number that does not exist on this branch. Type the right-hand value instead:

| Case | The case says | Type this on sv10740 |
|---|---|---|
| [C44847](https://shopview.testrail.io/index.php?/cases/view/44847) | real `S2-889`, near miss `S2-909` | real `S10740-17584`, near miss `S10740-17504` |
| [C44849](https://shopview.testrail.io/index.php?/cases/view/44849) | real `P2-58`, near miss `P2-59` | real `P10740-256`, near miss `P10740-255` |
| [C146265](https://shopview.testrail.io/index.php?/cases/view/146265) | brings back `P2-78` | use the **SV10740** workbook row SRI-PS-I1 |

The result-row cases have their own workbook for this branch, every term proven here: `build/search-results-integrity/ShopView-Global-Search-Result-Row-Tests-for-Manual-QA-SV10740.xlsx` (111 rows; 109 return results, the other 2 are meant to return nothing).

## 4 · Rebuild after a redeploy

Say **`RESEED GLOBAL SEARCH sv10740`** — steps 18–18d put this ticket's data back and re-prove this sheet.
