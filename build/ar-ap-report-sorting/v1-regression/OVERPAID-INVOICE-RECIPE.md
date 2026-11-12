# Overpaid invoice: how to make one through normal app actions (for C715462)

Test case: C715462 "A/R Summary: the Totals row leaves out overpaid invoices, as the rows do",
https://shopview.testrail.io/index.php?/cases/view/715462. Written 12 Nov 2026 by the A/R and A/P lane.
Nothing was written to TestRail or Jira.

## The answer in one paragraph

You can't make an invoice that is overpaid as of today: every payment path is guarded. You can make one
that the A/R reports count as overpaid as of an earlier day, using only normal screen actions:

1. Pay part of the invoice.
2. Reverse that payment.
3. Pay the full amount with an earlier payment date.

The reports replay the payments as of the date picked in "As of". A payment reversed today still counts
for every day before today, and the new payment counts from its own payment date. So for those days,
more was paid than the invoice's amount. This is now set up on staging: customer
**ZZAUTOTEST OVERPAID C715462 Cust A** has invoice **S-40181** ($100.00, with $120.00 counted as of
10 and 11 Nov 2026) and the open invoice **S-40182** ($500.00). On the A/R Summary **As of 11/11/2026**,
the customer row shows $500.00 and the Totals row shows $500.00.

## 1. What "overpaid" means: the exact condition the code uses

Both versions use the same expression:
- V2: SV-11315 branch `8e35ee0d02`, unchanged at the staging merge `b8c04e2`.
- V1: production `fc08f23`.

**The invoice's replayed open balance, as of the cutoff,**
`ct.amount − SUM(cps.amount)` over the invoice's payment statements where `cps.payment_date <= cutoff`
and `(cp.reversed_at IS NULL OR cp.reversed_at > cutoff)`.

| What | Where |
|---|---|
| The replay expression (V2) | `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/Aging/ArOpenBalanceAsOfSql.php:59-68` |
| An invoice is a row only when that balance is `> 0`; "an overpaid invoice is not a row, as today" | `.../Aging/ArOpenDocumentsSql.php:34` (doc) and `:127` (`ar_doc.is_credit = 0 AND ar_doc.open_cents > 0`) |
| The V2 Totals are the sum of those same rows (S5-R18), so an overpaid invoice is in neither | `ArOpenDocumentsSql.php:24-27` (one derived table for the rows, totals and exports) |
| V1 Totals: same expression, but kept when `<> 0`, so a negative balance was taken off the Totals | `fc08f23` `api/src/Reporting/Dashboard/Infrastructure/Doctrine/AccountReceivable/Service/DbalAgingSummaryTotalsFetcher.php:38-63` |
| V1 customer rows: `> 0` only | `fc08f23` `.../AccountReceivable/Service/DbalAccountReceivableCustomerFetcher.php:115` |
| The cutoff: end of the picked day at the location's time zone, clamped to now. Today = now | `b8c04e2` `api/src/Reporting/Reports/Application/DTO/Aging/AgingAsOfDto.php:8-14`; V1 sends the end of the picked local day (`fc08f23` `AgingSummaryReport.vue:294-297`) |

So "overpaid" means: as of the cutoff, the payments counted against the invoice (not reversed by then)
add up to more than its amount. **It is a statement about a date, not about the invoice's stored
balance.** `customer_transaction.balance` never goes below zero.

## 2. Every path checked, and what each does

The ranking runs from most to least likely, normal user actions first. The guards are identical at
`fc08f23` (production) and `b8c04e2` (staging).

| # | Path | Verdict | Evidence |
|---|---|---|---|
| 1 | **Pay part, reverse it, then pay in full with an earlier payment date** | **WORKS**, for any as-of day between the second payment's date and the day before the reversal | Measured on staging (section 3). Payment reversal stamps `reversedAt = now` (`CustomerPayment.php:632`); the payment date is typed by the user (`CreatePaymentCommand::getPaymentDate`); the replay counts a reversed payment for every cutoff before its reversal |
| 2 | Pay more than the open amount | Refused: "Transaction cannot be overpaid." (already known) | `CreatePaymentCommandHandler.php:1567`; aggregate guard `CustomerTransaction.php:207` (`$amount > $this->balance` throws) |
| 3 | Deposit bigger than the work order total | No overpayment: the rest becomes a separate deposit DEP2-… (already known) | Other session's playbook, facts only |
| 4 | Apply a deposit, then reverse the deposit | Refused for an applied deposit ("reverse the payment that applied it") | `Deposit.php:372` (`CannotReverseAppliedDepositError`). **Historically this was the gap:** `DepositLedgerReverser::reverseDepositFromInvoice()` restores the invoice balance but leaves the deposit's payment-statement amount in place, so a later payment would overpay. The guard now blocks it |
| 5 | Apply a credit memo, then void the credit | Refused while it has active applications ("Reverse the applied payment(s) or refund before voiding this credit.") | `VoidCreditMemoCommandHandler.php:85` |
| 6 | Two payments at the same moment | Blocked: the customer account row is locked first in every payment | `CreatePaymentCommandHandler.php:165` (`lockForPayment`) |
| 7 | Reverse the invoice and re-invoice for less (for example, a credited part) | Doesn't carry payments: an invoice can be reversed only while nothing is paid on it (`isReversible`: balance = amount) | `CustomerTransaction.php:269-282` |
| 8 | Change an invoice's amount after payment | No path: `customer_transaction.amount` has no setter. The only raw `UPDATE … SET amount` touches vendor delivery totals and a one-off data repair (`RepairArCpsShortfallCommand`) | `git grep` at `fc08f23` |
| 9 | IBS batch payment reversal | Consistent: the whole payment is reversed, so all its statement rows drop out | `IbsBatch/ReversePayment/ReversePaymentCommandHandler.php:301` |

**Where production's 16 come from (inference, NOT VERIFIED):** most likely they were made before the
guards in paths 2 and 4 existed. SV-7384's own comment describes deposit dollars applied twice driving a
balance negative. A data repair is the other candidate. Today's code does not let a user make one that is
overpaid as of today.

## 3. The working recipe, as measured on staging (12 Nov 2026)

**Build:** `v26.45.4-b8c04e2`, which is the SV-11315 merge (PR #4262).

**The upgrade had landed on staging:** the new `/api/reporting/reports/ar-aging-summary` answered 200,
and the old `/api/reporting/account-receivable/aging-summary-report` answered 404.

**Location A:** Staging Heavy Duty - 9919 (Asia/Karachi). Every figure below was read from the new
A/R Summary, narrowed to the customer. The script is `overpaid-recipe/seed_overpaid.py`; every reading
is in `overpaid-recipe/overpaid-staging.json`.

| Step (UTC) | Unpaid list: S-40181 ($100.00) | A/R Summary row as of 9 Nov | as of 10 Nov | as of 11 Nov | as of 12 Nov (today) |
|---|---|---|---|---|---|
| Two invoices, both dated 9 Nov noon local: S-40181 $100.00 and S-40182 $500.00 (11:48:21Z) | $100.00 owed | $600.00 | $600.00 | $600.00 | $600.00 |
| P1: $20.00 cash on S-40181, dated 9 Nov (11:48:25Z) | $80.00 owed | $580.00 | $580.00 | $580.00 | $580.00 |
| P1 reversed (11:48:27Z) | $100.00 owed | $580.00 | $580.00 | **$580.00** | $600.00 |
| P2: $100.00 cash on S-40181, dated 10 Nov (11:48:31Z) | gone (paid) | $580.00 | **$500.00** | **$500.00** | $500.00 |

How to read it (Rule 110):
- **Attribution.** The "P1 reversed" line proves a reversed payment still counts for an earlier as-of day:
  as of 11 Nov the row stayed at $580.00, while today's went back to $600.00.
- **Identity.** After P2, S-40181 has $20.00 + $100.00 = $120.00 counted against $100.00 as of 10 and
  11 Nov. Its replayed balance is −$20.00, so the row holds only S-40182 ($500.00).
- **What a failure would look like.** V1's Totals would read $480.00 here. V2's read $500.00.

**On screen** (`overpaid-recipe/evidence-staging/ar-summary-asof-2026-11-11-customer-A.png`): A/R Aging
Summary, "As of: 11/11/2026", "Customer: ZZAUTOTEST OVER…". One row reads "ZZAUTOTEST OVERPAID C715462
Cust A · Staging Heavy Duty - 9919 · 1-30 Days $500.00 · Total $500.00". The Totals row reads "$0.00
$500.00 $0.00 $0.00 $0.00 $500.00".

**To rebuild it** (resumable; re-running skips finished steps; `--check` re-measures read-only):
`python3 build/ar-ap-report-sorting/v1-regression/overpaid-recipe/seed_overpaid.py staging`.
On a fresh environment it dates everything from that day: invoices 3 days back, P2 2 days back. Read the
report as of the day before the run.

**By hand in the app, for any location:**
1. Create the customer.
2. Create a $100.00 invoice and a $500.00 invoice, dated at least 2 days ago. Use the work order's Finance
   tab invoice date.
3. Customer → Invoices → New Payment: $20.00 on the $100.00 invoice, with the payment date set to the
   invoice's date.
4. Reverse that payment.
5. New Payment: $100.00 on the same invoice, with the payment date set to the next day (still in the past).
6. Read A/R Summary with "As of" set to yesterday.

## 4. Records to use

| Environment | Customer | Invoices | As-of days on which S-40181 is overpaid |
|---|---|---|---|
| **Staging (ready now)** | ZZAUTOTEST OVERPAID C715462 Cust A (`6df5d452-e832-46b2-a338-ddde92fcc613`) | S-40181 $100.00 (paid $20.00 on 9 Nov, reversed 12 Nov 11:48Z; paid $100.00 on 10 Nov) · S-40182 $500.00 open | **10 Nov 2026 and 11 Nov 2026** (fixed; this doesn't move as time passes) |
| Production test account | not made: staging worked, so step 5 of the brief was not triggered | the same recipe applies (identical code at `fc08f23`) | — |

## 5. Proposed C715462 precondition text (not written; the QA lead reviews and writes)

This needs more than an identifier change: the case needs a past "As of" day. So the call is the QA
lead's, not a Rule 111 correction.

> - Run this on staging (the upgrade is installed there).
> - Sign in as an Admin user (the "Admin" role).
> - Customer A is "ZZAUTOTEST OVERPAID C715462 Cust A" at Staging Heavy Duty - 9919. Its $100.00 invoice S-40181 was paid $20.00 on 11/9/2026 (that payment was reversed on 11/12/2026) and $100.00 on 11/10/2026, so as of 11/11/2026 the report counts $120.00 paid on it: overpaid by $20.00. Its other invoice, S-40182 ($500.00), is open (invoice B).
> - Do not try to pay more than an invoice's balance: the app refuses it. An invoice is overpaid only as of a day before a payment on it was reversed.
> - Use a desktop browser window 1440 px wide.
> - Open A/R Summary (Reports, then "A/R Aging Summary" under ACCOUNTS RECEIVABLE in the left menu).
> - Set "As of" to 11/11/2026.
> - Leave the report with the Customer filter showing only customer A ticked.

With these numbers the Expected Result's example ($100.00 paid $120.00, invoice B $500.00) is exact,
not just an example.

## 6. Also unblocked (not acted on)

- **V1R-76** (C1095432, retired 12 Nov 2026 as "cannot be set up") is unblocked by the same record.
  Reviving it is the QA lead's call.
- **V1R-27** (an overpaid bill, C1079000) may yield to the same idea on the vendor side: reverse a vendor
  payment, then pay again with an earlier date. **NOT TRIED.**
