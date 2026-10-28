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
- 2026-10-28 ~18:00 UTC — LAYER A (internal consistency, PRD structure): 1,185 checks, 1,181 PASS, 4 FAIL = "367-day custom range not refused" ×4 locations. NOT a defect: the reports accept the same 367 inclusive days (both test `diff->days > 366`), and the on-screen picker caps at 366 (code note) → Rule 24 pass; picker cap still to be observed in the browser.
- LAYER B (S3-R1 parity, paired reads, SAA paged): 2,592 checks, 2,592 PASS — every tile, chart total, advisor/technician/customer row and every report preset-by-name equals its report, 4 locations × 9 presets + 6 custom ranges.
- Harness lessons: SAA returns ≤1000 rows/page (page it); open never-clocked-out timesheets grow between reads → pair dashboard+report reads seconds apart; dashboard needs localStorage `location` in the browser.
- NEXT: LAYER C independent recompute from raw records (WO list + invoice view + clock records) vs PRD; LAYER D seeded edge cases; LAYER L1 screen = data.
- LAYER L1 (screen = server, PRD wording/format, preset dates, empty-chart rule, tile independence, defaults): 1,184 checks, 1,184 PASS (4 locations × 5 tiles × 9 presets + At Risk × 5 windows).
- LAYER C (independent recompute):
  - C1 per-invoice: 8,036 invoices × 5 checks = 40,180; 40,176 PASS; 4 FAIL = 1-cent Parts rounding (S2-14085, S2-13807, S2-9398, S2-6653) — observation only.
  - C2 population: 0 invoiced/paid service WOs missing from Sales (all 4 locations, 2 years). Parts-sale list only partial (80 of 258 parts WOs listed) — limit noted.
  - C3 invoiced hours vs lines on the invoice: 8,035/8,036 MATCH; 1 = S2-38022 (a line added after the invoice was PAID is counted as invoiced hours) → candidate F3.
  - C3b worked hours: 5,422/5,425 PASS (3 × ≤0.04 h rounding). Tech Efficiency: 72/87 → all tech-hour gaps = DECLINED lines counted → FINDING F2.
  - C5 At Risk: 20/20 location×window exact (count, members, last date, lifetime count, 12-mo revenue).
- FINDING F2 (reproduced on fresh data, DVI Test, build v26.43.2-f8698cb): WO S1-38195, customer "ZZAUTOTEST Dash A1", tech Esther Howard; line 1 complete 1.0 h, line 2 DECLINED (0.5 h clocked, 1.0 h tech time); invoice shows line 1 only ($135). Dashboard Technician Efficiency = 133.33% "2.00 Invoiced Tech Hrs / 1.50 Clocked"; PRD-correct 100.00% "1.00 / 1.00". Billing Efficiency on the same invoice correctly 100% (1.00/1.00).
- Void path: "Reverse" DELETES the invoice (figures drop correctly). A real VOID arises only when a line is added via the New Line (Line/Create) path to a Complete/Invoiced WO with a PENDING invoice; the canned-line path instead ADDS the line to the pending invoice (subtotal $135→$270) — invoicing-side inconsistency, outside the dashboard PRD → observation.
- SV-11688 (open, Ready to Fix) still live: Technician Utilization counts never-clocked-out timesheets (HD: Daniel Montoya, Jacqueline Calderon, Monica Brady ~24 h/day).
- Harness lessons: report display dates use the SESSION timezone → always POST change-location before reading a location; technician-tasks/create wants `dd/mm/yyyy hh:mm` local + staff_id (ISO → HTTP 500, an unhandled-input observation); a clock with neither WO nor department is refused ("Department id is missing.").
- 2026-10-28 ~22:30 UTC — DASHBOARD PASS COMPLETE. Expanded panels 121/121, chart filters 9/9, 366 picker cap ✅ (Apply disabled, "Range: 367 days (max 366)"), negative revenue "-$15.00" ✅, Today button ✅.
- Defect pack: `defect-pack-2026-10-28/` — F2 (declined lines in Technician Efficiency) and F4 (Revenue after work-order discount) DRAFTED + HELD for PO (A2 fails: PRD wording open) → PO-QUESTIONS DQ-1/DQ-2. F1 = SV-11688 (already filed). F3/F5 API-only (Rule 24). Observations O1–O8 in NOT-FILED.md.
- NEXT: REPORTS PHASE — every report recomputed independently against its own source (Report Suite PRDs for WIP / TU / SBC / SBR / PV / IV; other reports: find written sources first).
