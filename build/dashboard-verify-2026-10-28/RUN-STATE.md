# Dashboard + Reports FULL independent verification — run state (started 2026-10-28)

## The order (QA lead, 2026-10-28, verbatim)
> "TestRail (yes/no)" → **NO**
> "I want you to run the independant run based on PRD and sources and find calculation bugs for dashboard and if the reports are also not showing the correct data, and I need complete defects drafted to create the jira ticket for each defect with the steps of reproduction which a layman non technical person and a manual QA tester can follow to reproduce the defect/bug.
> Make sure that you NEVER run a delta pass, I need a FULL pass run to find the bugs/defects and all the jira tickets drafted for each bug/defect, then I will give you a go ahead and you will create each defect/bug upon my permission.
> I want this dashboard first and then the reports to be 100% scrutinez to ensure either they are showing correct data OR we have a defect/bug for anything which is wrong.
> Continue unattended as I am going to sleep now."

Earlier in the same thread: "I want everything in the dashboard to be correct ... for every filter/timeline and everything."

## Constraints
- NO TestRail writes (answer NO). Existing 126 dashboard cases (section 12166, run 525) untouched.
- NO Jira creation — drafts only; each ticket created only on his explicit per-ticket go-ahead (Rule 62 / H1).
- FULL pass, never delta. Expected behaviour from PRD + sources (Rule 57), build gives only labels + pass/fail.
- Build: staging, develop f8698cbc1 (deployed 2026-10-28 13:56 UTC). Code read: develop e8b3c4b31 (identical app code).
- Cookies in /tmp/cln/cookies.json (600, never committed). Expire ~24 h or on a staging redeploy.
- Throwaway data tagged ZZAUTOTEST; restore anything changed.

## Sources
- Dashboard PRD: Confluence 788430850 "Dashboard" (epic SV-490, owner Chris Ward, modified 2026-10-22) → `PRD-Dashboard-v1-read-2026-10-28.md`
- Formula reference (code-derived, NOT an expectation source): `../report-suite/ShopView-Reports-What-Every-Column-Calculates-2026-10-28.md`
- Report specs: Report Suite (epic SV-8582) Confluence pages — to be re-read for the reports phase.

## Plan
1. Dashboard — every tile/chart/card × 9 presets + custom + 366 cap × 4 locations:
   L1 screen = API, L2 API = independent recompute from raw records, L3 API = report (S3-R1 parity), L4 seeded known-data checks for edges.
2. Reports — every report's totals/columns recomputed independently from raw records, against their specs.
3. Defect drafts (Rule 94 gate, skill 06) → `DEFECT-DRAFTS.md`; workbook `Dashboard-and-Reports-Verification-2026-10-28.xlsx`.

## Progress log
- 2026-10-28: session OK (59 perms). Workplaces: QB Location (Vancouver), Staging Heavy Duty - 9919 (Karachi), Staging Lethbridge - 4310 (Edmonton), DVI Test (Toronto).
- Browser harness: boot2('admin') + localStorage `location` = JSON workplace id (without it the dashboard fetches nothing).
- Early observation (to verify): techUtilizationKpi idle days 33.33 % and 2139.92 clocked vs 755.51 WO hrs this month on default workplace — matches open SV-11688 (Ready to Fix).
