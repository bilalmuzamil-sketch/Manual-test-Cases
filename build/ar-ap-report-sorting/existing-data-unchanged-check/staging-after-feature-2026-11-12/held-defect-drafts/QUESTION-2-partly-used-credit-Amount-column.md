# Held question (not a ticket): A/R Aging Detail "Amount" of a partly-used credit changed

**Ask before filing (Rule 121.6).** Measured 12 Nov 2026, staging before (v26.45.3-6197d19, 06:46Z) vs after
(v26.45.4-d07623f, 13:44Z), as of 12 Nov 2026, from the reports' own data calls (`COMPARISON.md`).

On A/R Aging Detail, 6 credits that were partly used show a different **Amount** after the feature. Their **Open
Balance** did not change, so no total, bucket or summary row changed.

| Document | Customer | Amount before | Amount after | Open Balance (both) |
|---|---|---|---|---|
| CM2-4524 | TestVT1 | $-56.57 | $-173.98 | $-56.57 |
| CM2-4526 | TestVT1 | $-25.00 | $-198.98 | $-25.00 |
| CM2-4404 | ZZAUTOTEST SV-9647 Credit Split BEFORE | $-154.96 | $-300.00 | $-154.96 |
| CM2-4353 | 4 Star Truck Repair | $-150.00 | $-200.00 | $-150.00 |
| CM2-4354 | 4 Star Truck Repair | $-70.00 | $-200.00 | $-70.00 |
| DEP2-4713 | 4 Star Truck Repair | $-7,051.12 | $-19,750.83 | $-7,051.12 |

Before, the old report printed the remaining credit in both columns; now Amount is the credit's original amount.

**Question for the QA lead:** is "Amount = the credit's original amount" intended (PRD v11 or the developers' notes do
not say)? If yes, nothing to do. If no, C715471 step 2 ("the same amounts") fails for these 6 rows. We did not find a
PRD sentence defining the Detail "Amount" column for a partly-used credit, and it is not on the epic's "do not file" list.

## Correction and evidence (12 Nov 2026, 16:00-16:10 UTC)

**The PRD DOES speak to it — my "the PRD does not say" above was wrong.** PRD S5-R18a (in v11 and v12, added
2026-10-23 from Bilal's QA questions sheet Q9, answered by Chris): *"The Detail reports' Amount column holds original
amounts and is not compared."* Against it, the same PRD, "What changes for existing users": *"…and the reports show
money exactly as they do today."*, and §2 does not list this as one of the visible changes. Filing a defect therefore
risks an obsolete-as-not-a-bug close (Rule 121) — held for the QA lead's decision.

Evidence ready (`v1-regression/partly-used-credit-2026-11-12/annotated/`):
- PIC1/PIC2 production (old reports, v26.45.4-95406e3): ZZAUTOTEST credit memo CM1-4414 ($200, $155 used) shows
  Amount $-45.00 and Open Balance $-45.00 on A/R Aging Detail; the customer page shows Total -$200.00, Balance -$45.00.
  Seeded for this on the production test account (`seed_partly_used_credit_prod.py`, ledger-prod.json).
- PIC3/PIC4 staging after the feature (v26.45.4-e16016f): CM2-4353 Amount $-200.00 / Open Balance $-150.00 and
  CM2-4354 $-200.00 / $-70.00; the customer page confirms both are $200 credits, partly applied.
- Staging BEFORE the feature exists only as screen TEXT (06:49 UTC, `AR Aging Detail - all buckets expanded - rows.txt`):
  CM2-4353 $-150.00 | $-150.00, CM2-4354 $-70.00 | $-70.00.
