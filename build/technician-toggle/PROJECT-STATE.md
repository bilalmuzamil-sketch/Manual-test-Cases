# Technician Toggle — PROJECT STATE

- **PO / design authority:** Chris Ward. **Epic:** SV-11788. **TestRail:** section 113017 (suite 1, under 20434 Founder Mode).
- **PRD:** Confluence 977371146, v17 (2 Nov 2026). **Design:** https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R (6 pages).
- **Intake:** `INTAKE-2026-11-02.md`.

## 2 Nov 2026 — intake
- PRD v17, Jira sweep (17 tickets) and the uploaded tech plan saved under `sources/`.
- The uploaded tech plan is for PRD v9 (role version) and does not describe the staff-member toggle. Asked the QA lead for the current plan and the project type.
- No cases yet. Next: read PRD, design (driven in full), tickets and the current plan in full; draft cases in the QA lead's pattern; gates; write to 113017 only with his go-ahead.
- QA lead answers, 2 Nov 2026: project type "Upgrade (Recommended)" (V2, skill 17); tech plan "No newer plan; go ahead".
- Design package saved (`design-2026-11-02/files/`, version 1793629882-06f7: 6 boards of captioned screenshots, 25 shots). 17 tickets saved in full (`sources/JIRA-SV-11788-tickets-2026-11-02.md`).
- Two workers started 2 Nov: PRD cases (`WORKER-BRIEF.md`, library in `authoring/`) and the design drive (`design-2026-11-02/WORKER-BRIEF.md`). Round 2: design cases from `design-2026-11-02/DESIGN-CASE-PLAN.md` into `authoring/cases_design.py`.
- 2 Nov 2026, QA lead: "Yes, write it all"; the 5 cases a tester cannot force: "Leave them out" (`NO-MANUAL-CASES.md`); question sheet: "Yes, make the sheet". Subsections 113018-113025 created; 228 cases written (map `testrail-id-map.csv`, read-backs in `applied/`), design pictures attached; run "Technician Toggle - Execution" with the 177 unheld cases.
- Question sheet https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M (8 questions) shared with Chris Ward by the QA lead on 2 Nov 2026; he will say when it is answered. 17 cases held on it (`../PO-QUESTIONS-OPEN.md`).
- Write finished 2 Nov 2026: 228 cases (S1 37 · S2 38 · S3 47 · S4 10 · API 15 · Release day 28 · What must not change 19 · Design 34), every case read back equal, 214 pictures attached (all HTTP 200, every case's attachment list read back complete). Run 555 "Technician Toggle - Execution" (milestone 5, assigned to Bilal): 177 tests = the 177 unheld cases; 51 held out (29 release day, 17 PO questions 1-8, 5 waiting on the release or a Public API request).
- Rule 128 story footers (SV-11879..SV-11884): QA lead, 2 Nov 2026: "Yeah leave it for now." Not added.
- 2 Nov 2026, Chris answered questions 1-8 (`po-answers-2026-11-02/`), PRD v18 and design version 1793640819-ff4d. QA lead: "Named set (Recommended)". Applied: 54 cases rewritten (locked on read-backs, 0 skipped, 0 problems; record `v18-named-set-record.json`, log `applied/update-v18-log.jsonl`); 15 released cases and 6 new cases (S1-38..S1-41, S3-49, S3-50 = C897376-C897381) added to run 555 (union only) → 198 tests. D-33 C897374 and D-34 C897375 (design-version cases, ruled for the PRD) listed in `po-answers-2026-11-02/DELETE.json`, awaiting the QA lead's yes. Live: 234 cases.
