# A/R and A/P aging — release audit for 19 Nov 2026 (started 18 Nov ~20:30 UTC)

Ordered by the QA lead 18 Nov: "audit/test everything and either draft the defects … or give me the green signal".
Every line below is observed, measured or quoted this session (Rule 126).

## 1. What ships
- Release comes from `develop` (no develop→main release PR yet, checked 18 Nov via GitHub). develop head `ed7ec3be2c`.
- Staging runs `v26.45.5-b6a5d15`, which is on develop; **no commit touches the report code** (`api/src/Reporting/Reports`,
  `app/src/components/ts/reporting`, `OpenBalanceAsOfSql`) between b6a5d15 and develop head → staging = what ships, for this feature.
- Production today: `v26.45.5-0b53dd5`, old reports (new route 404).

## 2. Run 557 today (489 tests)
- 482 Passed, 7 Failed, 0 other (`run557-tests.json`, `run557-results.json`).
- Builds behind the 482 passes: 343 on v26.45.2-6a8b89c (11 Nov), 84 b8c04e2, 18 d07623f, 17 34788b2, 17 f3d3d2d (14 Nov),
  1 e16016f, 1 f3d3d2d (18 Nov), 1 b6a5d15 (18 Nov). 282 of them on the QA branch, 200 on staging.
- **Gap:** report changes merged AFTER most of those passes — SV-12544, SV-12547, SV-12663, SV-12723, SV-12545, SV-12539,
  SV-12858, SV-12863 (git log 6a8b89c..b6a5d15). Their areas need a re-run on b6a5d15 before a green signal.

| Failed test | Ticket | Ticket status (18 Nov) |
|---|---|---|
| C1145255–C1145258 columns stay in place | SV-12763 | Open, moved to "Founder Mode Batch #3" (out of this epic); dev notes list the ~34 px shift as "Kept by the developer" |
| C1145247, C1145248 long name in Customer/Vendor menu | SV-12722 | Ready for Production — **re-test needed** |
| C1145253 long name on A/R Collection | SV-12764 | Ready for Production — **re-test needed** |

## 3. Known, not blockers (quoted)
- SV-12951 (Chris, 17 Nov): "out of scope for the Nov 19 release"; "production behaves the same, so it is not a regression".
- SV-12538 / SV-12136: 2-cent Stillwater bills, pre-existing, fix outside the epic (Chris 18 Nov, closed SV-12136 as duplicate).
- Partly-used credit Amount: intended (PRD S5-R18a; QA lead's 12 Nov comment on SV-11315, Milos "will do" the PRD line — not in v14).

## 4. Still to do (needs a staging session)
1. Re-test SV-12722 and SV-12764 (3 failed tests).
2. Re-run the areas changed since 11 Nov on b6a5d15: PDFs (date format, "Total for", 1,000-row limit, long names on all six),
   CSVs, as-of date after today, Past Due in the screen's zone, Summary empty-cell sort.
3. Whole-data checks on b6a5d15 (every document, both zones): Past Due rule, totals add up, Summary = Detail (S5-R18a), sort
   orders, filters — scripts in `../existing-data-unchanged-check/staging-recheck-after-SV-12663-2026-11-16/scripts/`.
4. The 92-test screen run (`../v1-regression/STAGING-RUN-CARD.md`), only between 07:15 and 17:45 UTC.
5. Verdict: green, or defect drafts that pass Rules 121, 125, 126 (shown to the QA lead before filing).


## 5. Results, 18 Nov 20:30–21:00 UTC (staging v26.45.5-e93e93b — no report-code change from b6a5d15)

| Area | What was checked | Result |
|---|---|---|
| Whole data, both zones | every document of all six reports as of 11/18/2026, Asia/Karachi and America/Edmonton: Past Due rule S1-R5a, buckets, bucket order S1-R5, totals S5-R18, Summary = Detail per bucket and per party S5-R18a, opening sort S1-R1..R6 with ties S2-R4, paging repeats/skips S1-R8, Collection/Unpaid documents = Detail documents | **all pass** — 32 + 28 checks, 0 wrong (`data-as-of-2026-11-18-*/INVARIANTS.md`) |
| Exports (Story 3) | 6 CSVs untouched + filtered; PDFs: both Summaries, A/R Detail/Collection (2 customers), A/P Detail/Unpaid (3 vendors), long names, 1,000-row boundary | **all pass** — header lines, headings, one row per document, plain money, YYYY-MM-DD, Totals, on-screen order, "Total for", no "Subtotal", "Nov 04 2026", "(-$…)", every column on every page; **exactly 1,000 rows → PDF (21.9 s), 1,001 → refused with the one S3-N1 message** (`exports/EXPORT-CHECKS.md`, pictures in `exports/png/`) |
| SV-12723 blank cells sort last | both Summaries, every money column, both directions | **pass** (`SORT-AND-FUTURE-DATE.md`) |
| SV-12545 as-of after today | all six reports as of 11/25/2026; Past Due counted to Nov 25 | **pass** |
| SV-12722 (C1145247, C1145248) | screen, 1440 px, case steps 1–5 | **pass** — previously Failed (`screen/`) |
| SV-12764 (C1145253) | screen, 1440 px, case steps 1–2 | **pass** — previously Failed |
| SV-12763 (C1145255–58) | not re-run | ticket Open, moved out of the epic; dev notes: "Kept by the developer" — stays Failed, not a blocker |

**My own check errors this run (corrected, none was the app's):** A/P name order with "-", " ", "." in bill numbers (my sort key), A/R
Collection membership (I first wrote my own rule; PRD S8-R1 + old code `CollectionsItem.php:31` decide it), a $0.00 Total read as blank,
and step 4 of the menu tests clicking the wrong row. Each was re-checked against the source before being set aside.

**Observation, not a release defect:** in the Customer/Vendor menu's search box, the first selected tag's "×" is squeezed to a sliver
when the name is very long (`screen/C1145247-5-tags-zoom.png`). Shared component `FilterSearchListPanel.vue`, already on production;
this release does not change how tags are drawn (git diff main..develop: 5 lines, selection logic only). No Jira ticket found.
Not checked on a production screen.

**Not yet covered (the 92-test screen run, from 07:15 UTC 19 Nov):** permissions by role, location prompt, document links, loading and
error states, info icons, header-click sorting on screen, Expand/Collapse all, pinned rows.


## 6. Release morning, 19 Nov 07:20–07:35 UTC (staging v26.45.5-e93e93b, unchanged; production v26.45.5-0b53dd5, old reports)

| Step | Result |
|---|---|
| Session / build | staging session 200; build unchanged since the overnight checks |
| Status board (run card step 1) | 47 of 47 seeded parties answered by the reports |
| Reseed for today (step 2) | **FAILED, our kit:** 84 of 85 refused ("There is already invoice with number: ZZT-P61-BILL_LATE") - the seeder uses fixed document numbers, so it can only reseed a wiped environment. One record was created: direct vendor credit "ZZT-DIRECT-P93" ($7.00, test data). The 12 Nov ledger was restored; the failed attempt is kept as `seeded-staging-failed-reseed-2026-11-19.json` |
| 92-test screen run | **NOT RUN** - the runner refuses a seed anchored on another day (dates in the cases move with the seed). Its 12 Nov staging results (84 on b8c04e2) stand for areas whose code did not change; the only aging-report code changes since are the six fixes re-tested overnight (git log b8c04e2..e93e93b) |
| Screen smoke, all six reports (`scripts/smoke_screens.js`) | 0 console errors, 0 server errors; Expand all / Collapse all work (e.g. A/R Detail 8 -> 475 -> 8 rows); document links have targets; Export menu "Download (PDF)", "Download (CSV)"; info icons; no sideways scroll |
| Header sort inside open groups (`scripts/sort_in_group.js`) | works on all four grouped reports, both directions; groups stay in order (PRD Key Decisions: "Groups never move; header clicks sort the rows inside each group") |

**Verdict: GREEN for the A/R and A/P aging reports release** - no release-blocking defect found. Not covered this morning:
the role/permission cases and the cross-location prompt (passed on staging 12 Nov; their code is unchanged since).
