# Bill To — PROJECT STATE

- **PO:** Chris Ward. **Epic:** SV-12289 (19 stories SV-12303..SV-12321). **TestRail:** section 132467 (suite 1, Founder Mode).
- **PRD:** Confluence 1003585538, v0.5 (pending approval from Mat and Amani, 6 Nov; last modified 7 Nov). **Design:** https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd (8 pages).
- **Tech plan:** not available yet (QA lead, 9 Nov); update the cases when it comes.

## 9 Nov 2026 — intake
- PRD, all 20 tickets and the design package (8 boards, 124 screenshots) saved. `INTAKE-2026-11-09.md`.

## 9 Nov 2026 — round 1 case library (case worker; no TestRail/Jira/Slack/Google writes, no commit)
- 271 cases in `authoring/` (S1–S19, API, DATA, REL, INV; "Design — how it looks" empty until the design round). `python3 authoring/build.py` → 0 PROBLEM lines; tester-readiness 0 hard. 235 runnable on a build (Rule 69 marker), 36 held: 6 on PO questions 1–3 (`PO-QUESTIONS-DRAFT.md`, not sent), 6 on the SV-11665 release, 4 on the portal app release, 9 production around the release, 11 a tester cannot set up (`NO-MANUAL-PROPOSAL.md`).
- PRD codes 176/178 covered (S15-N1, S18-R2 not testable, reasons in `REPORT.md`); stories identical to PRD v0.5; epic's "AccountingHub change" superseded by the PRD (latest wins).
- `TICKET-LEDGER.json` / `TICKET-SWEEP.json` (prd_version_handled "0.5"): `ticket_sweep.py` 0 unhandled (the tool now reads decimal versions). Setup file for Claude sessions: `BILL-TO-SETUP-FILE.md`. Proposed subsections: `sections.json` (ids null).

## 9 Nov 2026 — round 2 (design cases and references; no TestRail/Jira/Slack/Google writes, no commit)
- 345 cases: + 70 design cases D-01..D-70 (`authoring/make_cases_design.py` from `design-2026-11-09/DESIGN-CASE-PLAN.md`; changes listed in `authoring/design_changes.json`) and 4 new held PRD cases (S3-32, S7-24, S7-25, S14-13). 135 PRD cases carry References from Design. build.py 0 PROBLEM; readiness 0 hard.
- 59 held: 29 on PO questions 1–15 (`PO-QUESTIONS-DRAFT.md`: ours 1–3, the design's 4–15; design question 13 dropped as settled), 6 SV-11665, 4 portal release, 9 production, 11 cannot be set up. `create.py` (dry run) now attaches 412 pictures (113 files).

## 10 Nov 2026 — written to TestRail (QA lead: "Go ahead")
- Sources re-checked before the writes (Rule 59): PRD page last modified 7 Nov (v0.5); no ticket under the epic or its stories updated since 9 Nov.
- The 11 cases a tester cannot set up are NOT in TestRail (QA lead: "If a tester can not set it up then they should not be in testrail."); kept in the library only (`create.py` NO_MANUAL).
- 24 subsections under 132467 (ids in `sections.json`, 133491-133514). 334 cases added, every one read back equal (`applied/create-log.jsonl`, `applied/C<id>-after.json`, `testrail-id-map.csv`); 409 pictures attached and read back. Live count in the 24 subsections: 334.
- Run **558 "Bill To - Execution"** (https://shopview.testrail.io/index.php?/runs/view/558): 286 tests, all assigned to Mudassir, description "Owner: Mudassir.", no milestone. 48 held out of the run: `applied/HELD-CASES-2026-11-10.md` (31 on PO questions, 6 SV-11665, 4 portal release, 9 production around the release).
- Question sheet for Chris Ward built (QA lead: "Yes please"): https://docs.google.com/spreadsheets/d/1o55Q5O5kFNV1JWcBX2pFZy741A1enT8BomHWzJH_Vi8 (15 questions); the QA lead shares it. Listed in `build/PO-QUESTIONS-OPEN.md`.
- When an answer arrives: apply it to the held cases named in the open list, release them into run 558 (union only), delete the losing design-version case.
