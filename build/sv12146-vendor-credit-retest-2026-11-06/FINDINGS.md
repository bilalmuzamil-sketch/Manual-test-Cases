# SV-12146 — vendor credit larger than the bill — retest 6 Nov 2026 (after my rejection 80180 + Mike's request 80264)

**Verdict: PASSED** — posted as comment **80291** (green, 9 checks, 3 exhibits, read back: first line, 3 media in order, 9 rows).
Label `QAcomplete` added (kept `QAComplete_Ayesha_Khan`). Status already **QA Complete** (Ayesha, 80278) — left. QA Assignee = Ayesha — left.

- Branch: sv11839 `v26.45.0-5d54a3f` (fix commit e2e442b "vendor Payments tab and remittance slip show what a credit actually paid"), read before and at post time.
- Production before: `v26.45.1-753355c`, org Bilal-Trucks (test org), Trucks Hill 2.
- Mode: API mode (no recording / technical section). Unattended run.
- Mike's comment 80264 was already put to Milomir (my 80268); his answer 80269: "It is fixed as part of this ticket so you can test it." — tested as acceptance criterion (check 5).

## Test data (left in place)
| Env | Vendor | Bills | Credit | Payment |
|---|---|---|---|---|
| branch | ZZAUTOTEST SV12146 A `0e660472` | ZZ12146A10 $10, ZZ12146A50 $50 | C-13671 $100 (ZZ12146CR100) | A1 $10 bill+credit, A2 $50 bill+credit |
| branch | ZZAUTOTEST SV12146 B `005b9cd7` | B25 $25, B15 $15 | C-13672 $60 | B1 both bills + credit |
| branch | ZZAUTOTEST SV12146 C `ad7737e9` | C10 $10 | C-13673 $10 | C1 exact |
| branch | ZZAUTOTEST SV12146 D `eb155e74` | D10 $10 | — | D1: "Amount to credit" = 100 (see question below) |
| branch | ZZAUTOTEST SV12146 E `f3b11567` | E50 $50 | C-13674 $20 | E1 credit smaller than bill |
| prod | ZZAUTOTEST SV12146 P `7491ec91` | P10 $10, P50 $50 | C-18008 $100 | PB1 $10 bill + credit (before) |
| prod | ZZAUTOTEST SV12146 Q `c64665d7` | Q10 $10 | — | QB1: "Amount to credit" = 100 |
Bills made by a stock order (`POST /api/inventory/orders/create`) received on `/accept-delivery/{orderId}` (Receive) with a vendor invoice number; vendor tax = Exempt (0%).

## Results (all observed on screen + the downloaded slip PDF text)
| # | Check | Branch | Prod before |
|---|---|---|---|
| 1 | $100 credit on $10 bill | dialog "Applies $10.00 · $90.00 remaining", Payment amount $0.00 | same hint shown, but whole credit used |
| 2 | Unpaid Invoices | C-13671 -$90.00 Unapplied | nothing left |
| 3 | Payments tab | bill $10.00, credit -$10.00 Applied | bill $0.00, credit -$100.00 Applied |
| 4 | Slip | Credits Included $10.00, Total $0.00 | Credits Included $100.00, Total $-90.00 |
| 5 | Mike: remaining credit on slip | Remaining column $90.00 + "Remaining Credit: $90.00" | no Remaining column/line |
| 6 | 2nd payment ($50 from leftover) | -$50.00 Applied, slip Remaining $40.00, Unpaid -$40.00; 1st slip unchanged ($90.00) | — |
| 7 | exact $10/$10 | "Fully consumed", Total $0.00, Remaining $0.00 | — |
| 8 | $20 credit on $50 | Payment amount $30, Total $30.00, Remaining $0.00 | — |
| 9 | $60 on $25+$15 | $40 used, Total $0.00, Remaining $20.00, -$20.00 open | — |

## Open question for the QA lead (NOT in the comment — Rule 97(d), Rule 94 does not apply: it is reachable on screen)
**The "Amount to credit" box in New Payment drops the typed amount — on production AND on the branch.**
Steps: vendor with a $10.00 bill and no credit → tick the bill → New Payment → type 100 in "Amount to credit" → the window shows "Payment amount: $110.00" → Make Payment.
The app sends `payment_amount:110, new_credit:100, new_deposit:100`, but the saved payment is $10.00 with `new_credit:0`; no $100 credit appears in Unpaid Invoices, vendor balance 0, slip "Remaining Credit: $0.00". Same on prod (vendor Q). So it is not caused by this fix (pre-existing), but the developer's commit aacb66c says it "keeps a typed 'Amount to credit' open on the credit as before".
Mike's comment literally names this box ("$100 is entered in the Amount to Credit field"), though his expected $90 matches applying an existing credit, which is what the ticket fixes and check 5 proves.
Related but different: SV-11751 (Open) "New Payment modal: accept overpayments and auto-split the excess into Amount to credit". No existing ticket for this (JQL searched "Amount to credit" + vendor payment overpay).
Ask: should this go on SV-12146 as a remaining issue, a new ticket, or be left?

## Pre-post gate
Build markers re-read (branch 5d54a3f, prod 753355c) just before posting; ticket re-read (QA Complete, last comment 80278 Ayesha); text scan for AI fingerprints clean; read back 80291 = first line PASSED, 3 media in order, 9 rows. Surfaces opened per state: New Payment dialog, Unpaid Invoices, Payments tab (expanded), remittance PDF text; the slip sums checked (Subtotal − Credits Included = Total) on every slip.
Learning check: new recipe — create vendor bills via stock order + Accept Delivery; vendor payment endpoints; remittance PDF `GET /api/vendor-payments/{id}/remittance-pdf` → playbook.
