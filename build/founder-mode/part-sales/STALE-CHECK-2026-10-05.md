# Founder Mode Part Sales — staleness check (2026-10-05)

**Trigger:** complaint that some Part Sales test cases are stale.
**Cause confirmed:** the Part Sales specification (Confluence 867434569 "Part Sales Update v1", owner Chris
Ward) was edited on 2026-10-05, after our baseline of 2026-09-28 (read 2026-09-30). The edit added **no
change-log row**, so it was found by diffing our saved baseline against the live page requirement by
requirement. Live copy saved: `sources/CONFLUENCE-867434569-PartSales-Update-v1-2026-10-05.md`.
Requirements: 104 → 111 (7 added, 0 removed, 19 reworded — 14 in meaning, 5 punctuation only).

## Our cases now stale — meaning changed (14)
| Case | Requirement | What changed in the specification |
|---|---|---|
| C154591 | S1-N2 | Core actions hidden without permission now also on work orders; any other route is refused by the system |
| C154593 | S1-R10 | Partial cores now per received core row (10 ordered, 6 received → core row of 6, returns those 6; the 4 owed get their own row). Old "return whole quantity then split" removed |
| C154595 | S1-R25 | Moving a part from a part sale onto a service work order **does not exist today** ("If ShopView adds a way…") — case tests a non-existent flow; retire or convert |
| C154596, C154640 | S1-R17 | QuickBooks rewritten: both core rows post to the core's part-category item (returned core nets $0); an unmapped item holds the whole invoice in the Unexported report |
| C154597 | S1-R19 | Reversal now refused while an auto-applied deposit is applied; reverse the payment first, deposit returns to Held |
| C154598 | S1-R22 | Trimmed to "customer document only"; the parts-grid text moved to new S1-R27 (re-cite) |
| C154602 | S1-R26 | Cross-reference changed S1-R22 → S1-R27 |
| C154608 | S3-N1 | Reversing the invoice unlocks the tax card; next invoice locks the rate |
| C154611 | S4-R5 | Deleting a Complete sale with received parts is refused with the received-parts message, never the "Completed" one |
| C154618 | S5-N3 | Reversing the invoice unlocks the sales representative; next invoice captures it afresh |
| C154624 | S7-N3 | A split may move every line; the original keeps the deposit and no lines |
| C154625 | S8-R2, S8-R3 | Memo is exactly "Deposit for Part Sale P4-413"; deposit not offered while Declined |
| C154635 | S8-N4 | Portal deposit wording now tied to SV-10261 shipping |

## Punctuation only — quote re-sync for verbatim fidelity (5)
C154586 (S1-R14), C154589 (S1-R5a), C154601 (S1-R24), C154603 (S1-N10), C154634 (S8-N5) — straight to curly
quotes/apostrophes; no behaviour change.

## New requirements (7)
| Requirement | Coverage |
|---|---|
| S3-R6 customer overview Part Sales tab: Total Price includes tax | **GAP — no case** |
| S8-N6 Create Invoice opens New Customer Payment; closing without paying reverses the invoice | **GAP — no case** |
| S8-R15 smallest deposit $0.01, zero refused; Customer Portal minimum $1.00 | **GAP — no case** |
| S1-R27 parts grid: core keeps its own row, Returned badge, no credit row | covered by behaviour in C154587/C154598 — re-cite only |
| S4-R8 part sale log: four deposit entries | covered by Mudassir's C154848 |
| S4-N7 general deposit writes no entry; no backfill | covered by Mudassir's C154852, C154853 |
| S1-R28 moving a part from a service work order onto a part sale | not testable today (hypothetical) — record only |

## Non-requirement change
Form factor: "usable to tablet width" → "usable down to 768px wide; from 768px up, Return Core and the
Actions column stay visible and clickable without scrolling". **No case in our suite** — gap.

## Mudassir's cases now stale (foreign — report only, Rule 38)
C154874 (QuickBooks, S1-R17), C154877 (tablet width → 768px), C154883 (spec discrepancies — some may now be
resolved by this edit, e.g. the $0.01 minimum).

## Correction (2026-10-05)
Earlier today I said Part Sales had no technical plan. Our record says technical planning is folded into
section 4 of this specification (no separate document). That answer was wrong; it was not missing.
