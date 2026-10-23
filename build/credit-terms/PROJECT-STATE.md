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
