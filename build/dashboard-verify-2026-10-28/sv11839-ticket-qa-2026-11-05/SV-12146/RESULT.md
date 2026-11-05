# SV-12146 — Vendor payments: applying a credit larger than the bill uses up the whole credit, and the remaining amount is lost

**Ticket:** https://shopview.atlassian.net/browse/SV-12146 (status TESTING QA, standalone bug) · **QA branch:** https://sv11839.qa.shopview.com · **Fix:** commit aacb66c73, which is in the build tested (v26.45.0-277b249).

## Verdict: FAIL (partly fixed)
The money is now right: only the bill amount is taken from the credit, the rest stays open and can be used, and the remittance slip never goes negative. **But the vendor's Payments tab still shows the credit as "−$100.00 Applied"** under each payment it was used for. The ticket lists exactly that as wrong ("Payments tab: the credit shows −$100.00, status Applied") and expects only $10.00 of the credit to be used.

## What the ticket expects (verbatim)
> **Expected Result:**
> * Only **$10.00** of the credit is used to pay the $10.00 bill.
> * The credit keeps a **remaining balance of $90.00**, shown in **Unpaid Invoices**, and can be applied to a future bill.
> * **Remittance slip:** Credits Included **$10.00**, **Total $0.00**.

From the ticket's **Actual Result** (what must no longer happen): *"Payments tab: the credit shows -$100.00, status Applied."*
Chris Ward, comment 80115 (4 Nov 2026): *"Expected behavior is exactly as you wrote it: only the bill amount is used from the credit, the rest stays open on the vendor and shows in Unpaid Invoices, and the remittance slip never shows a negative total."*

## What I did (on screen, Staging Heavy Duty - 9919)
1. Made a new vendor, **ZZAUTOTEST QA11839 Credit Vendor**, and three bills for it by receiving a purchase order on screen with tax $0.00: **ZZVC12146-A $10.00**, **ZZVC12146-B $50.00**, **ZZVC12146-C $10.00**.
2. Parts → Vendors → the vendor → **New credit** → $100.00 (credit **C-13668**).
3. Ticked bill A and credit C-13668 → **New payment** → payment method "10000 Calgary Chequing" → **Make Payment**. The dialog said **"Applies $10.00 · $90.00 remaining"**.
4. Read **Unpaid Invoices**, the **Payments** tab, and downloaded the **Remittance** slip (PDF, text read from the file).
5. Applied the rest of C-13668 to bill B ($50.00); the dialog said **"Applies $50.00 · $40.00 remaining"**.
6. Equal case: new credit **C-13669** for $10.00 applied to bill C ($10.00); the dialog said **"Fully consumed"**.

## What I saw
| Check | Seen | Expected | OK? |
|---|---|---|---|
| Remittance slip, payment 1 ($10 bill + $100 credit) | Subtotal **$10.00** · Credits Included **$10.00** · **Total $0.00** · Credits Summary: C-13668 original $100.00, Payment **$10.00** | Credits Included $10.00, Total $0.00 | ✅ |
| Unpaid Invoices after payment 1 | C-13668 **−$100.00 original · −$90.00 open**, Unapplied | $90.00 remaining, shown in Unpaid Invoices | ✅ |
| Remaining credit usable (payment 2, $50 bill) | Slip: Credits Included **$50.00**, Total **$0.00**; C-13668 balance before $90.00, payment $50.00. Unpaid Invoices: **−$40.00** open | can be applied to a future bill | ✅ |
| Equal credit ($10 credit, $10 bill) | Slip: Credits Included **$10.00**, Total **$0.00**; C-13669 no longer open | no negative total | ✅ |
| **Payments tab** | Under payment 1 (bill A) **and** under payment 2 (bill B): **"Credit C-13668 … −$100.00 · Applied"**. The bill rows show Amount **$0.00**. Nothing on the tab shows that only $10.00 (and then $50.00) was used | only $10.00 of the credit used (not "−$100.00 Applied") | ❌ |

Annotated picture: `SV-12146/FAIL-annotated.png`.

## Build, time, location, zones
- Build: **v26.45.0-277b249**. Every step file records the page's own `app-version` at the time of that step, and all of them, 05:01–05:17 UTC, read v26.45.0-277b249. A read at 04:58:22 UTC, before the steps began, still showed v26.45.0-aacb66c, so the build changed just before testing started. 277b249 is the branch's newest commit and contains the SV-12146 fix aacb66c73.
- When: 5 Nov 2026, 05:00–05:20 UTC (late evening of 4 Nov at Heavy Duty).
- Location: **Staging Heavy Duty - 9919**.
- Zones (Rule 99), recorded at the start and end of every step file: change-location with `workplace_timezone=America/Edmonton` (200) · browser `timezoneId` America/Edmonton · process `TZ` America/Edmonton · `localStorage['timezone']` "America/Edmonton" · header showing the location.

## Evidence
- `setup-receive-*.json`: the three bills.
- `step-credit-*.json`, `step-pay-*.json`: what the screen sent and received.
- `step-read-after-pay{1,2,3}.json`: Unpaid Invoices and Payments rows.
- `remittance-*.txt`: text extracted from the downloaded PDFs.
- Pictures `0-…` to `5-…` and `FAIL-annotated.png`.
- Seed log: `../seed-log.jsonl`.

No Jira or TestRail write was made.

## Draft Jira comment (NOT POSTED)
**QA result: partly fixed. One thing is still wrong.**

**What I did** (QA branch sv11839, build v26.45.0-277b249, Staging Heavy Duty - 9919, 4 Nov 2026 late evening, Edmonton time):
1. Made a new vendor with a $10.00 bill and a $50.00 bill.
2. Parts → Vendors → the vendor → New credit, $100.00.
3. New payment: picked the $10.00 bill and the $100.00 credit, and saved.
4. Then paid the $50.00 bill with what was left of the same credit.

**What is now right:**
- The remittance slip for the $10 bill shows Credits Included **$10.00** and Total **$0.00**. It never goes negative.
- Unpaid Invoices keeps **$90.00** of the credit open.
- I used that $90.00 on the $50.00 bill and **$40.00** stayed open.
- A $10 credit on a $10 bill is used up exactly, with Total $0.00.

**What is still wrong — the Payments tab.** Under each payment, the credit line still says **"−$100.00 Applied"**, both for the $10 payment and for the $50 payment. So the tab reads as if the whole $100 credit was used, twice. The ticket expects "only $10.00 of the credit is used to pay the $10.00 bill", and lists "Payments tab: the credit shows -$100.00, status Applied" as the problem. The bill lines on that tab also show $0.00 instead of $10.00 and $50.00.

Picture: the Payments tab, with the two credit lines marked (FAIL-annotated.png).
