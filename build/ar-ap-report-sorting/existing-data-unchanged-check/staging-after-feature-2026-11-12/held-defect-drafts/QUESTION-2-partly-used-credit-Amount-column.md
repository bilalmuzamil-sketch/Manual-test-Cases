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
