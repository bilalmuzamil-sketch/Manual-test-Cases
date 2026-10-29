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
- 2026-10-28 ~22:45 UTC — REPORTS PHASE launched: 4 workers, shared brief `reports/WORKER-BRIEF.md`.
  W1 `reports/W1-labor-wip/` WIP, Technician Utilization, Shop Efficiency, Timesheet Activities, Timesheets.
  W2 `reports/W2-sales-advisor-tax/` Sales By Customer, Sales By Representative, Sales (remaining columns), Service Advisor Analysis, Technician Efficiency (both tabs), Sales Tax Collected, Follow Up.
  W3 `reports/W3-parts/` Parts Velocity, Inventory Value.
  W4 `reports/W4-finance-accounting-comms/` A/R ×3, A/P ×3, IBS Batches, QB Unexported, Export Reports, Notes, Reminders.
  On return: verify each worker's key claims against its committed evidence (Rule 86) before consolidating; then one consolidated report + workbook.

## 2026-10-28 late — reports phase complete, consolidated
- Container restarted mid-W2; /tmp survived; W2 resumed from its transcript (not re-run). QA lead supplied fresh cookies (stored /tmp only, chmod 600); session re-minted 21:31 UTC; build still v26.43.2-f8698cb.
- Coordinator verification (Rule 86): W3 PV-D1/PV-D2 re-read live (see earlier entry); W4 AP1 482/482 at Lethbridge; W2 TAX1 re-read live — S1-38214 own record `invoice_status partially_paid`, `open_balance 105`; Sales Tax row `paid`; `statuses[0]=partially_paid` → 0 rows; SV-4573 quote "Invoice Status (, Partially Paid, Paid)" re-read verbatim; SV-8974 confirmed OBSOLETE (updated 2026-08-09).
- W2 question ids renamed RQ-n → SQ-n (clash with W4's RQ-n).
- Consolidated: `ShopView-Dashboard-and-Reports-Full-Check-2026-10-28.md` + `…-Findings-2026-10-28.xlsx` (built by tools/build_workbook.py + build_report_md.py from tools/findings_data.py). 4 ready to file · 16 held for PO · 8 already reported · 4 QA-lead reopen decisions · 4 not tickets · 43 PO questions.
- Nothing filed in Jira; nothing written to TestRail. Waiting on the QA lead.

## 2026-10-28 late (2) — QA lead's four follow-ups
1. Customer-on-screen rule applied: all 4 ready tickets were reproduced through the screen (AP1 existing bills, two locations; PV-D1 S1-38206 and PV-D2 S1-38206 made fully on screen; TAX1 S1-38214 fully on screen). 10 items a customer cannot reach removed from the pack → `questions-for-chris-2026-10-28/LEFT-OUT-NOT-ON-SCREEN.md`.
2. Closed tickets reviewed → `CLOSED-TICKETS-REVIEW-2026-10-28.md` (SV-8974, SV-8927 safe to reopen; SV-8926, SV-8930 not — asked Chris).
3. Chris question doc in the other session's shape (format only, read-only from origin/claude/slack-session-setup-7v5itm): Google Doc 1mEcB4cpsOqZXeim0vzmlbam2xSB02YshnyYRY0dk9s8, 39 questions; Drive turned three $…$ phrases into equations — repaired in place (Q5, Q23, Q33) and re-read clean. Not shared.
4. "Payments owner" item withdrawn — it was API-only (left out under 1).

## 2026-10-28 late (3) — QA lead: filing under SV-11839; time-zone rule
- Ruling (AskUserQuestion, Rule 63): defects in SV-11839 are type **Bug**, parent **SV-11839**, Medium, relates to the owning story; Product Area **Reports & Dashboards** (required for Bug). Overrides Rule 52 / Rule 73 item [1] for this epic only; Rule 73 one-at-a-time still applies.
- Filed **SV-11922** (AP1). Pictures inline (attachments 63181, 63180), relates to SV-5654 / SV-5655.
- QA lead: *"First make sure you test those tickets ensuring that the Location timezone and your machine timezone is the SAME."* → SV-11922 re-tested with the browser in Asia/Karachi (HD) and America/Edmonton (Lethbridge): still reproduces (SV10190-R3 0 vs -1; SV10190-ST1/ST2 -1 vs -2). Comment 79708 with 2 pictures.
- `testing-tools/staging-boot2.mjs` now sets the browser `timezoneId` to the location's zone (opts.timezone). W2 evidence (SBR, TAX) already used the location zone; W3 PV-D1/PV-D2 screen runs did NOT → redo on America/Toronto before filing. IV recaptured on America/Toronto.
- SV-8974 / SV-8927 re-created as drafts `filed-2026-10-28/drafts/SBR-ORDER.html`, `IV-COLUMNS.html` (QA lead: recreate, not reopen).
- **Rule 99 recorded** (RULES-61-97.md, CLAUDE.md index → 99 rules, skills 03/06/09, playbook) on the QA lead's instruction.
- QA lead marked **SV-11922 Obsolete** pending verification (status not touched by us). **Re-verified under Rule 99** (session + browser + process `TZ` = location zone, recorded): reproduces in all 3 runs — `filed-2026-10-28/SV-11922-REVERIFY-RULE99.json`, pictures `SV11922-RV1..RV3`. Waiting on the QA lead to restore it.
- QA lead: *"Stop on changing the questions doc"* → the Chris Google Doc (1mEcB4cp…) is left exactly as it was (39 questions). The review found candidates to drop/merge/reword (Q3 dup of SV-11823; Q4, Q38 spec-explicit → defect candidates; Q5 merge into the money-format question; Q8, Q10, Q11, Q17, Q18, Q19, Q31(b), Q39; reword Q34, Q36; re-check Q13, Q32 under Rule 99) — **NOT applied**, held until he asks.
- QA lead: *"only create the tickets which are related to the DASHBOARD"* → report-only drafts ON HOLD, not to be filed: SBR-ORDER, IV-COLUMNS, PV-D1, PV-D2, TAX1. Dashboard defects F2, F4 still wait on Chris (DQ-1, DQ-2). SV-11922 (A/P report) was filed earlier and is Obsolete by him.
- **29 Oct 2026 (UTC) — Chris Ward answered all 39 questions** (Q39 added after the first read). Verbatim copy + impact map: `chris-answers-2026-10-29/`. QA lead (going to sleep): prepare the tickets ready to file; titles "Dashboard - …" / "Reports - …"; Dashboard-affecting first, report-only next; file nothing until his go-ahead per ticket.
- Phase 1 re-checked under Rule 99 and drafted: P1-1 declined line (DVI/Toronto), P1-2 clock < 36 s (Lethbridge/Edmonton), P1-3 seconds-only technician row (Heavy Duty/Karachi), P1-4 Labor Delta after a timesheet edit (seeded S1-38215 "ZZAUTOTEST Dash Q27" at DVI Test; clock edited on screen 7:07→6:37 PM), P1-5 comment for SV-11823. F4 withdrawn (Chris Q2). Q39 checked: Dashboard TU shows Admin Shopview 7.70 h on 10 Sep vs 40.70 h in the payroll export → Dashboard not affected.
- Phase 2: four background workers (A labor, B parts, C sales/tax, D finance) drafting report-only tickets per `tickets-2026-10-29/phase2/PHASE2-WORKER-BRIEF.md`, each with its own staging session.
