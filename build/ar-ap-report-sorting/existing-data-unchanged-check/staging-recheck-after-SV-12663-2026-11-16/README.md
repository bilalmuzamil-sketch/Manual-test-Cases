# C715471 / C715472 re-check after SV-12663 (staging, 16 Nov 2026)

Ordered by the QA lead 16 Nov 2026 ("1. Yes" to re-running C715471 and C715472 on staging).
**No TestRail result posted** — the verdict needs his decision (see the end).

| What | Value |
|---|---|
| Tests | [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) A/R untouched, [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) A/P untouched (run 557; last result Failed, 12 Nov, SV-12663) |
| Build | **v26.45.4-f3d3d2d** at the start and end of every pull (07:29–07:32 UTC) and on the screen check |
| As-of date | 2026-11-12, the date of the staging "before" snapshot (`../staging-before-feature-captured-2026-11-12/`, 06:46 UTC, old version v26.45.3-6197d19) |
| Signed in as | the QA lead's staging session (Admin), cookies from `/tmp` only; read-only GET calls and a read-only browser (login, logout and change-location blocked) |
| Fix under test | SV-12663, "Fixed and deployed to staging (build v26.45.4-db2a7f6)", QA-passed by Mudassir 13 Nov. Since the fix the screen sends its own time zone (`timezone=`, the browser's stored zone of the selected location) with every aging read, and the server counts days in that zone |

## 1. SV-12663 is fixed: Past Due and the bucket always follow the Due Date shown

`scripts/check.py`, every document of A/R Detail, A/P Detail, A/R Collection and A/P Unpaid, PRD v13 S1-R5a
("Its Past Due ... is the number of days from the due date to the as-of date"):

| Screen zone sent | A/R Detail | A/P Detail | A/R Collection | A/P Unpaid |
|---|---|---|---|---|
| Asia/Karachi (Staging Heavy Duty - 9919) | 0 wrong of 1,760 | 0 of 14,721 | 0 of 1,599 | 0 of 14,721 |
| America/Edmonton (Staging Lethbridge - 4310) | 0 wrong of 1,763 | 0 of 14,724 | 0 of 1,609 | 0 of 14,724 |
| **Control:** no zone sent (session zone), read in Asia/Karachi | 265 wrong | 2,228 | 236 | 1,718 |

The control proves the check catches the SV-12663 symptom. (1,320 vendor credits on A/P Unpaid show no Due Date; counted, not judged.)

## 2. But compared with BEFORE the release, some Due Dates and Past Dues are one day different

**The old version shows and counts every date by the UTC (Greenwich) calendar; the new one by the screen's zone.**
Proof:
- The old data reproduces the UTC day: A/R Collection 1,456 of 1,457, A/P Detail 14,196 of 14,663 (`scripts/check.py` §2 input; method in this README's commit).
- The old SCREEN, in a Pakistan-time browser, showed bill GNV306853 (stored due 2024-05-04 19:11 UTC) as Due Date **May 4, 2024**, Past Due **922** (`../staging-before-feature-captured-2026-11-12/1-six-reports/AP Aging Detail - all buckets expanded - rows.txt`).
- The NEW screen today (`screen/`, opened and read by eye):

| GNV306853, As of 11/12/2026 | Date | Due Date | Past Due |
|---|---|---|---|
| Before the release (old screen, Pakistan-time browser) | Mar 5, 2024 | May 4, 2024 | 922 |
| Now, screen zone Asia/Karachi | **Mar 6, 2024** | **May 5, 2024** | **921** |
| Now, screen zone America/Edmonton | Mar 5, 2024 | May 4, 2024 | 922 |

It also happens in a North American zone: bill **IS2499319** (stored due 2025-11-23 06:00 UTC) was Due **Nov 23, 2025**, Past
Due **354** before; a Mountain-time screen now shows **Nov 22, 2025**, **355**.

Documents whose Past Due (or bucket) differs from before, apart from the changes PRD section 2 lists (`RECHECK-*.md` §2):

| Screen zone | A/R Detail (bucket) | A/R Collection | A/P Detail | A/P Unpaid |
|---|---|---|---|---|
| America/Edmonton | 0 | 74 of 1,457 | 1,240 of 14,632 | 1,222 of 14,632 |
| Asia/Karachi | 16 of 1,564 | 150 of 1,447 | 1,609 of 14,632 | 1,118 of 14,632 |

**Is it intended?** PRD v13 (read 16 Nov, unchanged since 13 Nov) does not say which calendar a document's day is counted in;
"What changes for existing users" lists no date change. SV-12663's developer comment (13 Nov) said "we'll keep the time zone the
reports used before this release" (it believed that was the browser's zone; the data shows UTC), while its QA handoff lists the
Karachi case under "Known mismatches (not bugs)". So this is a **Product decision, not a ticket** (Rules 58, 121).

## 3. Everything else matches

- Same documents and amounts, except: 6 partly-used credits whose **Amount** now holds the original amount (PRD v13 S5-R18a, intended); 1–3 credits dated on the as-of date now in Current with Past Due 0 (PRD section 2, intended); the three 4Refuel $100 bills paid by the E2E automation on 12 Nov (`../4refuel-consistency-2026-11-12/`); documents created after the snapshot.
- **Unexplained, small:** two Stillwater Diesel Repair bills (055-541861, 069-855902) had an open balance 2 cents above their amount on 12 Nov (before and after the release); today it equals the amount. Cause not established.
- Summary reports: only customers/vendors with documents added after the snapshot differ (§3 of `RECHECK-*.md`).

## Files

`scripts/pull.py` (the six reports, as the screen asks for them, `timezone=` optional) · `scripts/check.py` · `scripts/screen_check.js` ·
`data-as-of-2026-11-12-*/*.json.gz` (raw answers, gzipped) · `reference/` (location list with time zones from `GET /api/workplaces`) ·
`RECHECK-Asia-Karachi.md`, `RECHECK-America-Edmonton.md`, `summary-*.json` · `screen/` (pictures + read values).
