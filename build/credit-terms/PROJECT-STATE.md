# Credit terms — PROJECT STATE

## 23 Oct 2026 — intake
- QA lead, 23 Oct 2026: new testing suite "Credit terms". "NO Technical Plan as yet which I will share with you once I get it."
- PRD: Confluence 963346440 (https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/963346440/Credit+terms).
- Epic: SV-11638. Design: https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (share key given; start page page-d2a1c944fabb).
- TestRail group 91454 (suite 1).
- Prior facts (not rules, not cases): build/sv9087-credit-term-2026-08-27/FINDINGS.md (today's credit-term behaviour verified on the
  SV-9087 branch: Net 30 due dates, Due on receipt, Credit Hold banner, Charge Account withheld from COD, vendor due dates) and
  build/sv8815-customer-credit-2026-08-20/.

## 23 Oct 2026 — intake done
- PRD v3 (2026-10-22T17:25:54Z, "Renamed to Credit terms", owner and design authority Chris Ward, status "Ready for tech plan -
  2026-10-22") saved: `sources/CONFLUENCE-963346440-v3-2026-10-23.md` (pandoc from the HTML body; the two legacy-content tables, S2-R1
  row menu and S12-R3 log rows, converted from the macro) and the raw `.html`. Read in full: 1,056 lines, sections 1–9, 211 requirement
  codes (S1–S12). Note: Story 11 has no S11-R15 (numbering goes R14 → R16).
- Stories SV-11670 (Story 1) … SV-11681 (Story 12), all Open, created 22 Oct, no comments: `sources/JIRA-SV-11638-stories-2026-10-23.md`.
  Every one of the 211 requirement lines is word-for-word the PRD's (7 differ only in bullet/table formatting). Stories add Context and
  Acceptance Criteria; their PRD link points at the draft URL (resumedraft.action?draftId=963346440).
- Design "Default Credit Terms" (artifact 2erYxWz2ffDNcoXzEfu6wf, version 1792722751-b285, created 2026-10-22T17:07Z): 9 pages, one
  HTML board each (Main, Default, NewTerm, Empty, NewCustomer, Inactive, Vendor, OverCredit, Invoice), 25 screenshots, ShopView design
  system copy. Saved in `design-2026-10-23/files/` (viewer runtime and fonts kept out of git by `.gitignore`).
- Project type: V2 / upgrade of an existing feature (credit terms exist today: twelve fixed terms). Baseline facts:
  `build/sv9087-credit-term-2026-08-27/FINDINGS.md`. To confirm with the QA lead.
- TestRail sections under group 91454 (`sections.json`): S1 91455 … S12 91466, DATA 91467 "Counts and due dates — exact numbers",
  DESIGN 91468 "Design — how it looks".
- QA lead, 23 Oct 2026: "It is an updgrade" — project type (ii) V2 / upgrade CONFIRMED (Rule 96 invariants apply).
- 23 Oct: PRD draft done by worker — 291 cases (S1 36, S2 36, S3 28, S4 36, S5 26, S6 8, S7 12, S8 13, S9 10, S10 16, S11 20, S12 21,
  DATA 29), build gate 0 PROBLEM lines, 211/211 PRD codes covered; 7 PO questions drafted (PO-QUESTIONS-DRAFT.md). Design drive done:
  62 figures, 962-row text inventory (0 unclassified), 10 differences (CT-D01..D10), 5 design questions, 53 planned design cases.

## 23 Oct 2026 — suite created in TestRail (QA lead: "Get Done with all the test cases creation")
- 344 cases created under group 91454 (291 from PRD v3 + 53 design cases), every read-back equal; 218 design pictures attached
  and read back (170 cases). Map: `testrail-id-map.csv`; log: `applied/create-log.jsonl`. C723865…C724209.
- A container restart stopped the first creation run after 283 cases; C724148 (DATA-21) had been created but not logged — found by
  the section check, compared field by field with the proposal (equal) and adopted, so no duplicate was made.
- Run 551 "Credit terms - Execution" (milestone 5, assigned to Bilal): 335 tests = every case except the 9 held on Chris Ward's
  answers (C723936, C723999, C724000, C724046, C724105, C724206–C724209). https://shopview.testrail.io/index.php?/runs/view/551
- Question sheet for Chris (Editor): https://docs.google.com/spreadsheets/d/15S4Giqs10rQZ69CSK4RgqoYalryaSqxHM0iWBv7fdVw —
  questions 1–7 PRD, 8–12 design (design questions 1–5 renumbered; held markers say "question 8"…"question 11").
- Independent checks before creation: 887 PRD quotes and 237 design quotes verbatim; every term-name example ≤ 31 characters (11
  were 32–35 and were shortened); every picture present; one AUTOMATION line, last, on every case.
- Sweep 23 Oct (after creation): epic SV-11638 has the same 12 stories, nothing new; PRD still v3.
- Waiting on the QA lead: tech plan (then a full Rule 134 pass); a test organization holding only ZZAUTOTEST records (S1-23, S1-25,
  S11-04, S12-16); a post-release organization (S11-10) and a way to recognise one with no settings record (S11-11); Public API
  documentation (S10-11…S10-16); AccountingHub/IBS access (S8-11, S8-12); records captured before release (S7-05, S11-02, S11-07,
  S11-14); a QA branch for SV-11638.
- Rule 128 ticket footers were not added to the 12 stories (as with the A/R and A/P suite); offered to the QA lead.

## 26 Oct 2026 — QA lead's answers to the outstanding list
1. Chris's 12 questions: wait for his answers. 2. Tech plan: shared when the QA lead gets it. 3. Test organizations (clean org for
C723887, C723889, C724089, C724123; post-release org for C724095, C724096): created after the QA environment exists — WHEN THE QA LEAD
GIVES THE QA ENVIRONMENT, REMIND HIM TO GIVE A NEW ORGANIZATION. 4. Public API docs and 5. AccountingHub/IBS access: shared when he gets
them. 6. "This you can take from production environment if you need the BEFORE screenshots." — done: C724041, C724087, C724092,
C724099 now run on production (before values taken there shortly before the release reaches production; run there after);
P-OLD recipe updated; applied 26 Oct, read back clean. 7. QA branch: given when he gets it. 8. Rule 128 story footers: "NO".

- 26 Oct 2026, QA lead: "Why do you need this when you are supposed to create the test cases and you are supposed to ask the Manual QA
  tester to get them as the preconditions." Done: 13 cases (C723887, C723889, C724089, C724123, C724095, C724080-C724085, C724058,
  C724059) no longer held; each states what the tester needs in its preconditions (set-aside or new organization, API documentation,
  AccountingHub/IBS access — "ask your QA lead"). The QA-environment reminders are withdrawn. Still held for honest reasons: 4
  release-day cases (production before/after), C724096 (an organization with no settings record cannot be made or recognised by a
  tester), 10 cases a tester cannot trigger by hand, and the 9 held on Chris's answers.
- 26 Oct 2026, QA lead: "DOnt say "ask your QA lead" JUst mention what is needed". Removed from the 7 cases that had it (C723887,
  C723889, C724058, C724059, C724089, C724095, C724123); applied and read back. Lesson L-10.
- 26 Oct 2026, QA lead: "Simply say what is needed." The generic set-aside-organization line was removed from C723887, C723889, C724089, C724123 (each already states the state it needs; C723889 now adds "and no other terms of its own"). Applied, read back.
- 26 Oct 2026, QA lead: "Preconditions should be like a scenario, easier for a manual QA tester to understand  to create in the account."
  (Rule 117 thirteenth amendment, permanent, all suites). DRAFTED, not applied to TestRail: every one of the 344 cases now opens its
  Preconditions with one "Scenario:" line (`authoring/scenarios.py`, rendered first by `ct_lib.render`; gate in `authoring/build.py`);
  "You are an Admin user working at {Location-A}."; design cases end with the starting screen; S1-25 matches the worked example;
  examples fixed in S4-10, S10-11 to S10-16, S12-09, DATA-05/06b/10/16; D-17's contradictory default line made one line. Every other
  field byte-identical; setup file regenerated. Evidence: `scenario-preconditions-2026-10-26/PASS-REPORT.md`. Needs the QA lead's
  go-ahead before any TestRail update (Rule 6).
- 26 Oct 2026: Rule 117 thirteenth amendment (QA lead: "Preconditions should be like a scenario") applied to every case of this suite: one "Scenario:" line first, then what must exist in setup order; only custom_preconds changed (script-checked), every case updated in TestRail with an edit lock and read back clean.
- 26 Oct 2026: Rule 117 fourteenth amendment (the QA lead's own pattern, "Yes, permanent, all suites") DRAFTED for all 344 cases, not
  applied to TestRail: plain precondition bullets in setup order (no Scenario line, no {placeholder}, no "For example", no setup-file
  link), Blocked line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." last; steps with plain record
  names (term A, customer B, work order 1, "the test location"); "Expected Result" with "Step N:" and one bullet per sentence; a blank
  paragraph; quotes, From lines, References from Design and AUTOMATION line byte-identical (344/344). Converter `authoring/pattern.py`
  (rules + hand-written forms), rendered by `ct_lib.render`; old layout kept as `ct_lib.render_scenario`; pattern gate in
  `authoring/build.py` (0 PROBLEM lines). The authoring data keeps placeholders and examples for the setup file, which now also lists each
  case's plain names. Evidence: `pattern-format-2026-10-26/PASS-REPORT.md`. Needs the QA lead's go-ahead before any TestRail update (Rule 6).
- 26 Oct 2026: relevance and independence pass DRAFTED (coordinator review; QA lead: "they must make sense and relate to the steps and
  expected results below" and "if one test case fails that does not block the other test case"), not applied to TestRail: 210 cases'
  preconditions (and 11 notes) changed; steps, titles, quotes, design blocks and AUTOMATION lines identical to the applied version (one
  result bullet in S12-10 now says "the test location" for location A). `authoring/relevance.py` (applied in `ct_lib.C()`): records no
  step or result uses are dropped or left unnamed, records a case changes are "(made for this test)", standard Net terms a case needs are
  stated active, notes no longer name other cases, "(from other tests)" removed. Two permanent gates added to `authoring/build.py`
  (relevance; independence: no case key or C-id in tester text, changed records made for this test) plus a stale hand-written-form check;
  0 PROBLEM lines. Evidence: `pattern-format-2026-10-26/RELEVANCE-PASS.md`. Needs the QA lead's go-ahead before any TestRail update.

## 26 Oct 2026 — tester read-through (DRAFT, not applied to TestRail)
- QA lead, 26 Oct 2026: "GO" to a read-through of every case ("Make sure that your work does not bite me"); brief
  `build/tester-readthrough-2026-10-26/WORKER-BRIEF.md`. Nothing written to TestRail, Jira, Slack or Google; nothing committed.
- The 10 Credit terms cases deleted from TestRail today on the QA lead's order (S1-27 C723891, S1-28 C723892, S2-35 C723935, S3-27 C723963,
  S3-28 C723964, S4-30 C723994, S4-34 C723998, S5-23 C724023, S5-25 C724025, S12-19 C724126) are out of the library (case modules,
  scenarios.py, relevance.py, design_refs.py, render_outputs.py) and of proposals.json, the setup file and the outputs. 12 PRD items covered
  only by them (S1-E3, S5-E3, EH-S1, EH-S4c, EH-S5b, EH-S12, UFS-1, -21, -26, -31, -38, -45) read "No manual case: deleted 26 Oct 2026 on the
  QA lead's order (a manual tester cannot set it up); left to the developers' own checks" in REPORT.md §2 (`ct_lib.NO_MANUAL`, accepted by
  the coverage gate). 334 cases remain.
- Every one of the 334 cases read as a tester; fixes in `authoring/readthrough.py` (applied by `ct_lib.render` after `pattern.py`):
  the "mark this test Blocked" line removed from all 334 (Rule 117 fifteenth amendment; new build.py gate, and render_setup.py refuses to
  write it); 186 cases with further fixes (setup said as what to create and in setup order, bundled bullets split, vague wording made
  concrete, unnamed windows/pages/"It" named, S1-22/S1-32-34/S4-02/S11-03 steps made runnable, S8-07/S8-02/D-18 one action per step,
  S10-11/12 results no longer speak of a window for an API request). Check 3: S8-08 now proves a sync ran (term B on a synced invoice
  appears; PRD S8-R1 quote added, the only quote change), S8-06 syncs an invoice of customer A before checking QuickBooks (S8-R6 already
  quoted). Quotes block onward byte-identical to applied/C<id>-after.json for 333/334 (S8-08 differs only by the added quote); titles,
  markers and the 9 held cases' markers and notes unchanged.
- Gates: `python3 authoring/build.py` PROBLEM lines: 0. Identity check and report:
  `build/tester-readthrough-2026-10-26/credit-terms/verify_and_report.py` → `READTHROUGH-REPORT.md` (old vs new for every changed case,
  per-part CHANGED/CONFIRMED record, "could not make concrete" and "negative check without a control" lists).
- For the QA lead: S12-18 (C724125) and D-38 (C724185) cannot be set up by a manual tester for the same reason as the deleted cases (a
  request outside the page; a log that fails to load on demand). Not deleted; listed in the report.
- Setup file and outputs regenerated (the setup file now also lists each case's preconditions as the TestRail case states them).
  Needs the QA lead's go-ahead before any TestRail update (Rule 6).
