# Stillwater Diesel Repair: the "2 cents" on bills 055-541861 and 069-855902 (16 Nov 2026)

Asked by the QA lead 16 Nov 2026: "Please dig into that to find if this is a bug". Staging build v26.45.4-f3d3d2d, read-only.

## Answer: a known bug, already reported as SV-12538 (Open, fast-follow). Not new, not caused by this release, no ticket to file.

| What | Found | Evidence |
|---|---|---|
| Did the bill change between 12 and 16 Nov? | **No.** The app still holds 055-541861 as Amount $643.36, Balance $643.38, unpaid, and no payment exists for the vendor account. | `lethbridge-app-view.json` |
| The bill's own page (Delivery) | 12 × $51.062 + 5% tax = **$643.38**, due **Sep 11, 2026** | `delivery-9c2a6528-….json` |
| The stored Amount | $643.36 = 12 × **$51.06** + 5% tax, due date Sep 8 — the values from before the bill was edited | same, and SV-12538 |
| Why the report's open balance moved | The report reads the stored **balance** when the as-of date is **today**, and works out **Amount − payments** for a **past** date. On 12 Nov, "as of 11/12" was today ($643.38); on 16 Nov it is a past date ($643.36). | `asof-sweep.json`: as of 11/16 → $643.38 / $4.31; as of 11/15, 11/13, 11/12, 10/31, 9/30 → $643.36 / $4.29 |
| Is that new in this release? | **No.** Production's own code does the same: `DbalApAgingDetailFetcher.php` at fc08f23 lines 45-50 (today → `vt.balance`) and 152-153 (past → `vt.amount - payments`). | production v26.45.3 source |
| How many documents? | **Only these 2**, of 14,732 A/P and 1,790 A/R documents (as of today vs as of yesterday). | `mismatch-count.json` |
| Existing ticket | **SV-12538** (Mudassir Qamar, 11 Nov): "edited bills show an old Amount and Due Date, so Open Balance is above Amount" — the same two bills. | Jira |

**One thing SV-12538 does not mention:** for these bills the open balance itself also differs by 2 cents between "as of
today" and "as of any past date" (production does the same). It is a consequence of the stale Amount and goes away with the
SV-12538 fix. SV-12538 is someone else's ticket (Rule 38) — not edited; the QA lead was told.

**For C715471 / C715472:** this is not a failure of either test. The 2 cents came from re-checking a date that is no longer
today, not from the release.

Not checked: bill 069-855902's own page (it is at Staging Heavy Duty - 9919; reading it would mean switching the location
of the QA lead's session). Its report values show the same pattern ($4.29 / $4.31) and SV-12538 lists it with its page total $4.31.

Scripts: `read_lethbridge.py`, `asof_sweep.py`, `count_mismatch.py` (all GET only; cookie from /tmp).
