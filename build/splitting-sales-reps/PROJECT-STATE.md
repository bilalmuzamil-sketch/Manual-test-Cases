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

## 22 Oct 2026 — Chris answered 39 and 40; PRD v11

- PRD 919928833 **v11** (21 Oct; diff `prd-v11-2026-10-22/PRD-DIFF-v10-to-v11.diff`): new S5-R15b (Part Sales row: dash in Labor Delta, Labor Invoiced, Labor Margin; blank in CSV; added to Release day), S1-R6a context note (no Lead Technician message exists today; test no blank strip, every gap 16px).
- QA lead 22 Oct: "1. Yes do what is right to do". Done 22 Oct (v11-update-2026-10-22/):
  - Every case re-checked against PRD v11 by the build (143 PRD codes covered, 0 problems); 124 updated and read back. Content changed in C665968 (S5-07), C666017 (D-01: no blank strip under Lead Technician, every gap 16px, answer 40), C666031 (D-15), C666032 (D-16); the rest only say "version 11, read 22 Oct 2026".
  - New: C715271 (S5-18, part sale labor cells in the downloads) and C715272 (REL-16, the Release day display change, totals unchanged).
  - C690660 (DR-03) released: S5-R15b and answer 39 quoted, marker "not yet build-verified (no build yet)". Five other DR cases' PRD line moved to v11.
  - C690665 (DR-08) deleted (snapshot design-recheck-2026-10-20/deleted/C690665-before-delete.json; get_case answers 400).
  - Run 547: 135 tests (was 132; added C690660, C715271, C715272), none lost, no result changed. Id map 135 rows. Setup file regenerated. No PO question open.
- QA lead 21 Oct: the 41 report-suite cases this feature breaks wait until the feature is live. 2.47 MB design viewer code: read in full 22 Oct 2026 (design-drive-2026-10-19/viewer-code/VIEWER-CODE-READING-SUMMARY-2026-10-22.md): no ShopView content, no effect on the cases.

## 20 Oct 2026 (afternoon) — suite brought to PRD v10 and Chris Ward's answers

- QA lead, 20 Oct 2026: "2. Yes" (update all cases to v10) and "3. Yes" (cases for the 6 v10 rules with none).
- All 120 cases re-checked whole (Rule 41). 117 updated in TestRail (37 changed in what the tester reads, 80 only in the v10 quotes and
  "From:" line); C665997, C665999, C666000 unchanged (they quote only the report specs). Edit lock held, every case read back (apply4-log).
- 6 new cases: C690666 (S1-11, S1-E3), C690667 (S2-14, S2-E6), C690668 (S4-25, S4-R3), C690669 (S4-26, S4-R20), C690670 (S7-05, S7-R6),
  C690671 (S8-12, S8-R4/S8-R9). C690666 and C690670 are AUTOMATION: HOLD (only a data repair sets them up; developers check).
- Suite now 134 cases (126 in the library + DR-01..DR-08). TICKET-SWEEP prd_version_handled = 10.
- Then (QA lead "1. Yes 2. Yes 3. Leave it"): setup file regenerated for v10 (135 recipes incl. DR-01..DR-08, ACCOUNT-E part-sales-only
  slot, developer-check slot; still not linked); new case C690672 (S3-04) for answer 10, wide touch tablet; SV-11269's old acceptance
  criterion left alone (our cases follow the PRD and design). Suite now 134 cases. Later 20 Oct (Rule 131): the questions moved into the suite's own sheet 17Ry1Bt… (light green, rows 46-47, questions 39-40); the phone-control question was withdrawn as answered by answer 9 and C690662 (DR-05) deleted; the separate sheet 1OjdCk… moved to the bin. C690660 and C690665 held for questions 39 and 40.
  Report: v10-update-2026-10-20/REPORT.md.

## 20 Oct 2026 — design re-check both ways (lessons L-01, L-02), PRD v10, Chris Ward's answers
- PRD moved v8 → **v10** (19 Oct 2026, Chris Ward; v9 from his answers to our question sheet, v10 S4-R21 wording): 20 codes changed, 4 new (S1-R6a, S1-E3, S2-E6, S7-R6). Saved and diffed: `prd-v10-2026-10-20/`. The 120 cases still quote v8; updating them waits for the QA lead (full pass or named set).
- Chris answered all 38 questions (sheet 17Ry1Bt…, saved `design-recheck-2026-10-20/chris-answers.json`). The 19 Oct design conflicts C1–C5 are all ruled for the PRD (answers 2, 11, 15, 24, 25).
- Stories SV-11265–SV-11272 refreshed by Chris on 19 Oct to match v9 (answer 37); ticket ledger created (`TICKET-LEDGER.json`, 18 tickets).
- Design re-check both ways (`design-recheck-2026-10-20/`): all 68 board pictures viewed again; PRD v10 → design 78 elements (51 shown, 9 different, 18 not drawn) plus a by-hand table of 27 menus, lists, tooltips and messages; design → cases 1,370 text rows and 70 visual rows; divergence register 59 rows.
- **8 missing design cases created in section 84277, pictures attached, read back:** C690658–C690665 (3 of them, C690660, C690662, C690665, held: AUTOMATION: HOLD waiting on the PO, questions Q-A, Q-B, Q-C not yet sent).
- **C666030 is now wrong:** it expects "Sales Representative" on the part sale; v10 S2-N2 and answer 7 keep "Sales representative". Correcting it waits for the QA lead (with the v10 update).

## 22 Oct 2026 (later) — tech plan pass, Rule 134 (DRAFT, not applied to TestRail)
- Tech plan re-uploaded 22 Oct (byte-identical to 19 Oct), read in full again: `tech-plan-pass-2026-10-22/` (READING-RECORD, NOTES,
  TECH-PLAN-STATEMENTS: 72 statements, PASS-REPORT: every case part by part).
- Verdicts: 122 CONFIRMED, 13 CHANGE (6 in content: S2-07, S2-11, S4-20, S4-21, S5-01, S6-01; 7 tech plan From line only), 0 RETIRE,
  9 NEW drafted (S2-15, S2-16, S4-27, S4-28, S5-19, S5-20, REL-17, REL-18, REL-19). Library 138 cases; build.py 0 PROBLEM.
- 6 plan-vs-PRD divergences, all already ruled (answers 5, 7, 14, 16, 25, 39); question 41 drafted (NEW-QUESTIONS.md), not in the sheet.
- Waiting on the QA lead: go-ahead for the TestRail writes (13 updates, 9 adds, run 547 union) and for sending question 41.
- 22 Oct 2026 tech-plan pass applied (Rule 134; tech-plan-pass-2026-10-22/PASS-REPORT.md): the tech plan uploaded 22 Oct is byte-identical
  to 19 Oct; re-read in full. 122 confirmed, 13 updated (6 content: C665931, C665935, C665959, C665960, C665962, C665976 — C665976's
  steps also split to one action each; 7 "From:" line only), 0 retired, 9 new C715564-C715572. All read back OK (apply4-log). Run 547:
  135 → 144, none lost. Question 41 added to sheet 17Ry1Bt rows 48-49 (light orange, colour guide F3). Divergences plan-vs-PRD: 6, all
  already ruled (answers 5, 7, 14, 16, 25, 39). Other suites' cases the plan names (C30255, C154617, C30161, C38923, C30287, C43575):
  reported, not edited.
- 22 Oct 2026 one action per step (Rule 135): 93 library cases + C690660/C690661/C690664 rewritten (steps 465 → 681), all read back OK;
  run 547 unchanged (144). Show Unassigned / Sales Type / Close-selector steps dropped where no result depends on them. Over-10-step
  cases kept whole and asked (Rule 127): C665959 (11), C665970 (12), C665981 (13). Build prints ASK for these instead of PROBLEM.
  Open for build verification: whether a staff member's Sales Representative switch saves on its own (S1-07, S1-09, S4-20, S4-23 save;
  S6-01, S6-02 do not).
- 22 Oct 2026 Rule 136 pass applied (rule136-2026-10-22/): 30 cases split into 64 (34 new C715639-C715672), 49 shortened, steps 681 →
  542; invoice-row cases now expand the rep's row first (SBR spec v28 Story 6); S4-18/S4-19 now quote the S4-R21 requirement, not a
  change-log cell. 79 + 3 updated, 34 added, all read back OK (C665967's read-back recovered after a rate-limit stop: live equals the new
  version); 15 pictures uploaded. Run 547: 144 → 178, none lost.

## 23 Oct 2026 — Chris Ward answered question 41; PRD v13; named-set update (QA lead chose "Named set only")
- Answer 41 (sheet 17Ry1Bt, E49): "(b) "Unassigned", and the same for an added "Sales Representative - Service Parts" field ... PRD v13,
  S4-R7 and S4-R8." Saved in design-recheck-2026-10-20/chris-answers.json.
- PRD v13 (23 Oct 2026 15:33 UTC) saved in prd-v13-2026-10-23/. Script diff against v11: of 143 requirement codes only S4-R7 and S4-R8
  changed (sentences added); otherwise only the status line ("Ready for development - 2026-10-22") and a change-log row.
- Updated top to bottom (quotes from v13 + answer 41, From line v13): S3-03 C665939, S4-03 C665942, S4-04 C665943, D-11 C666027,
  D-13 C666029 (their tester-facing parts use active reps and stay valid). New: S4-03b C724219 (Service Parts starts Unassigned),
  S4-04c C724220 (Part Sales starts Unassigned). Run 547: 178 → 180 (union). Log: applied/apply5-v13-log.jsonl.
- The other 173 cases keep their v11 quotes (word for word identical in v13); the QA lead chose not to restamp them.
- Not testable as a customer case: the "account deactivated" half of S4-R7/S4-R8 — deactivating an account removes the person from
  every customer field first (S4-R20), so no field can hold them when a field is added.
- The tech plan copies the person into the added field; the PRD now says "Unassigned" — expect the build to differ until changed.
- 26 Oct 2026: Rule 117 thirteenth amendment (QA lead: "Preconditions should be like a scenario") applied to every case of this suite: one "Scenario:" line first, then what must exist in setup order; only custom_preconds changed (script-checked), every case updated in TestRail with an edit lock and read back clean.
