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
