# Splitting Sales Representatives — PROJECT-STATE (canonical cold-resume doc)

**Started:** 19 Oct 2026. **PO / spec owner:** Chris Ward. **Epic:** SV-10890. **Type:** V2 / upgrade of today's single sales
representative (Rule 96). **Build:** none yet — every case says the build is not yet available to check it against; build
verification is another session's job. **TestRail:** suite 1, group 84266 (https://shopview.testrail.io/index.php?/suites/view/1&group_id=84266).
**Test run:** none (QA lead: "No run for now"). **Setup file:** prepared, NOT linked from the cases (QA lead, 19 Oct 2026).
Intake: INTAKE-2026-10-19.md. Worker brief: WORKER-BRIEF.md.

## Sources (Rule 57)
- PRD Confluence 919928833 v8 — sources/CONFLUENCE-919928833-v8-2026-10-19.{html,txt}
- Tech plan upload — sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md
- Design export — sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html
- Jira — review/jira/

## Status
- 19 Oct 2026: intake done; sources read in full by workers: tech plan + Jira (review/, 15 PO questions), design drive
  (design-drive-2026-10-19/: 6 pages, 68 image boards, text inventory 1,370 rows and visual inventory 70 rows, 0 unclassified,
  5 design-vs-PRD conflicts), today's behaviour (baseline/: 56 invariants; 41 of our existing cases in other suites WILL BREAK),
  updated report specs SBR v28 / SBC v21 (report-specs/: 22 disagreements with PRD v8, which is later and wins).
- **113 cases created in TestRail group 84266**, 11 sub folders (applied/sections.json), all read back field by field
  (applied/apply-log.jsonl); id map testrail-id-map.csv. All 138 PRD codes covered. Every case: "The build is not yet available to
  check this case against." Built by authoring/build.py (quotes checked verbatim against PRD v8, tech plan, report specs).
- 19 Oct 2026 (later): QA lead caught that the design cases had no design references. Fixed to the WO Board standard: 18 design
  cases (7 new, C666028–C666034), every design board's picture attached (68 of 68 boards, 69 attachments over 23 cases, read back),
  the boards' own titles and notes quoted verbatim, every story case's Source names the design page its story cites. All 120 cases
  updated and read back (applied/apply2-log.jsonl). build.py now has a DESIGN GATE that refuses a design case without pictures or
  design words, or a board attached to no case.
- Setup file prepared, NOT linked: SPLITTING-SALES-REPS-SETUP-FILE.md.
- PO question sheet for Chris Ward: https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ (38 questions from 65 sources, 4 dropped as answered; 258/258 cells verified). Not shared or sent; the QA lead sends it.
- Open with the QA lead: the 41 existing cases that will break (baseline/V1-BASELINE-AND-INVARIANTS.md section e); the design
  helper scanned 2.47 MB of canvas viewer code by script instead of line by line (Rule 119 needs his OK).

## 20 Oct 2026 — design re-check both ways (lessons L-01, L-02), PRD v10, Chris Ward's answers
- PRD moved v8 → **v10** (19 Oct 2026, Chris Ward; v9 from his answers to our question sheet, v10 S4-R21 wording): 20 codes changed, 4 new (S1-R6a, S1-E3, S2-E6, S7-R6). Saved and diffed: `prd-v10-2026-10-20/`. The 120 cases still quote v8; updating them waits for the QA lead (full pass or named set).
- Chris answered all 38 questions (sheet 17Ry1Bt…, saved `design-recheck-2026-10-20/chris-answers.json`). The 19 Oct design conflicts C1–C5 are all ruled for the PRD (answers 2, 11, 15, 24, 25).
- Stories SV-11265–SV-11272 refreshed by Chris on 19 Oct to match v9 (answer 37); ticket ledger created (`TICKET-LEDGER.json`, 18 tickets).
- Design re-check both ways (`design-recheck-2026-10-20/`): all 68 board pictures viewed again; PRD v10 → design 78 elements (51 shown, 9 different, 18 not drawn) plus a by-hand table of 27 menus, lists, tooltips and messages; design → cases 1,370 text rows and 70 visual rows; divergence register 59 rows.
- **8 missing design cases created in section 84277, pictures attached, read back:** C690658–C690665 (3 of them, C690660, C690662, C690665, held: AUTOMATION: HOLD waiting on the PO, questions Q-A, Q-B, Q-C not yet sent).
- **C666030 is now wrong:** it expects "Sales Representative" on the part sale; v10 S2-N2 and answer 7 keep "Sales representative". Correcting it waits for the QA lead (with the v10 update).
