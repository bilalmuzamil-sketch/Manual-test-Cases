# A-R A-P staging after the feature 2026-11-12

The "after" half of the staging check (Rule 122). Compare with `../staging-before-feature-captured-2026-11-12/` only.

| What | Value |
|---|---|
| Captured | 12 Nov 2026, **13:44 to 14:06 UTC** |
| Build | **v26.45.4-d07623f** on every read (13:42Z, 13:44Z, 13:47Z, every script start, 14:06Z); the feature's route `/api/reporting/reports/ap-aging-summary` answers, the old one 404 |
| Signed in as | the QA lead's staging session (Admin), active location Staging Heavy Duty - 9919 (switched to Lethbridge for C715480 at 14:00:38Z and restored by `POST /api/iam/change-location` at ~14:01Z, 200) |
| Comparison | `COMPARISON.md` (every A/R and A/P document, matched by number + party), `scripts/compare.py`, `scripts/explain.py` |
| Results for run 557 | `RESULTS-run557.json` — dry run clean (14 Passed, 1 Blocked, all 15 already in the run). **Not posted: this session's permission system refused every TestRail write** |
| Held | C715471 (draft 1 + question 2 in `held-defect-drafts/`); C715462's precondition update and move to section 133628 (text: `v1-regression/OVERPAID-INVOICE-RECIPE.md` §5 plus "Set the As of date to 11/11/2026 before step 1") |

| Test | Verdict | Key evidence |
|---|---|---|
| C715471 A/R untouched | **Held** | 1,545 of 1,570 documents unchanged; CM2-4541 → Current (intended); **16 Staging Lethbridge - 4310 documents aged one day short** (draft 1); **6 partly-used credits' Amount changed** (question 2); 40 documents added by others after the snapshot |
| C715472 A/P untouched | Blocked | 14,631 same; C-13911 → Current (intended); 3 4Refuel $1.00 bills gone, not paid — cause unknown |
| C715475 Inventory Value | Passed | DVI Test PDF/CSV identical; Heavy Duty PDF fails as before |
| C715617 Sales By Customer | Passed | differences are invoices created after the snapshot only |
| C715618 Work In Progress | Passed | same rows; one tied row one line lower (PDF re-measured alone: 152,911 bytes in 10 s) |
| C715476 export message | Passed | same two messages |
| C715480 location switcher | Passed | same list + 2 ZZAUTOTEST locations added after the snapshot; switch reloads with same filters/rows |
| C715582 drill-down links | Passed | re-measured 3 times (first read was taken too early — our method) |
| C715583 / C715619 / C715620 | Passed | filter not remembered, as before |
| C715584 SBC menus | Passed | same, 900 px row identical |
| C1062590 credit on as-of date | Passed | CM2-4541 in Current (1) |
| C715477 work order link | Passed | prompt names Staging Lethbridge - 4310; Cancel → "Switch cancelled. Returning to work orders." |
| C715479 left-out ideas | Passed | none of the listed items present |
| C715462 overpaid totals | Passed | as of 11/11/2026: row $500.00 = Totals $500.00 |

## Correction — C715472, 12 Nov 2026 (after 14:15 UTC)

My 14:10 UTC "Blocked" result on C715472 compared rows, columns and amounts only, and **missed the Past Due column**.
Another run had already posted "Failed" at 13:24 UTC (build b8c04e2): bills show a Past Due one day less. Measured
again on the current build (v26.45.4-d07623f) from the same saved data (`C715472-correction/measure_past_due.py`):
**1,149 past-due bills read one day less**, 357 not-yet-due read one day further below zero, 107 two days. Result
617129 (Failed, Defects SV-11531, SV-11441 — the owning stories; no defect ticket, held) now replaces my Blocked one.
It is the same time-zone pattern as `held-defect-drafts/DRAFT-1-...` (A/R side, C715471, already Failed by the other run).

## The three 4Refuel bills (read 12 Nov 2026, 15:38-15:40 UTC, tech@shopview.com as Admin at Staging Lethbridge - 4310)

- **Correction:** they are **$100.00 each**, not $1.00 (the before snapshot stores dollars; the after data stores cents).
  The two TestRail results on C715472 of 14:10 and 14:21 UTC say "$1.00"; results cannot be edited, so it is noted here.
- They were on A/P Aging Detail and A/P Unpaid Invoices in the staging snapshot taken BEFORE the feature (06:46 UTC).
- They still exist, unchanged ($100.00, same dates, not deleted): `v1-regression/staging-run-2026-11-12/4refuel-read-at-lethbridge.json`, `4refuel-list-at-lethbridge.json`.
- They are no longer in 4Refuel's unpaid bills at Lethbridge (209 there; the control E2E-INV-1791977645410 is), and no
  4Refuel payment is listed at Lethbridge. **Why they left the unpaid list is not known.** All three were created by the
  E2E automation ("E2E auto-created delivery", received by Ahtasham Admin).
