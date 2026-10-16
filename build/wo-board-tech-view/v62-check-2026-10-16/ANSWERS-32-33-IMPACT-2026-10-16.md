# WO Board and Tech View: what Chris Ward's answers 32 and 33 (PRD v62) change for our cases (16 Oct 2026)

Read-only. Nothing written to TestRail, Jira, Confluence or the sheet.

## Sources read now
- Sheet https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU/edit, tab "Questions for Chris", rows 36-40 (answers 31-33).
- PRD Confluence 845185030 is now **v62** (16 Oct 2026 17:35 UTC, "Bilal Q32, Q33"). Saved verbatim `CONFLUENCE-845185030-v62-2026-10-16.md`
  (95,293 chars, read 100% by script). Against v61: 250 codes both sides, 0 added, 0 removed, **2 reworded (S2-R23, S11-R1)**, plus two Change Log rows. Nothing else.
  - S2-R23: "the design’s smaller, lighter initials" → "the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials".
  - S11-R1: "or the first one when none has been" → "or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty".
- TestRail WO root 13204: 297 live cases (277 ours, 20 Vladimir's), snapshot `snapshots-before/`; run 498 277 tests.

## Answer 32 (header avatar initials): no behaviour change for our cases
C590117 and C590119 already expect header initials "in dark grey (a little darker than in the design picture)", which is exactly the
ruling (#4B5565, darker than the design's #697586). A correct build passes; a build with the design's lighter grey fails. No run is affected.

## Answer 33 (first Tab stop): no behaviour change for our cases
C97021 already expects the first Tab to land on the first card in "Unassigned" (Board View) and the first row in "Unassigned" (Tech View),
which is the ruling. The other keyboard cases (C96945, C97020, C368150, C368152, C97022, C368151) press Tab "until a card shows a focus
ring" and then arrow to their card, so they do not depend on which card is first. Vladimir's C335321 tests the last-focused card, not the first.
Not covered by any case: Unassigned collapsed or empty → first Tab lands on the first technician's first row or card (new case, not a change).

## Quotes now out of date (Rule 113) — no effect on pass/fail
12 cases quote the v61 text of a reworded rule (all created and last edited by account 3; all are Retest or Untested in run 498):
- S11-R1: C96945 (Automated), C97020, C97021 (edited 17:10 UTC by someone else, QA lead: not to be restored), C368150, C368152.
- S2-R23: C590110, C590114, C590117, C590119, C590128, C614716, C614717.
The setup file `../v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md` also still lists questions 32 and 33 as open and quotes the v61 text.

## QA lead's decisions and what was done (16 Oct 2026)
1. Quote refresh in the 12 cases: **no** (left as they are).
2. New case: **yes** → **C614719** https://shopview.testrail.io/index.php?/cases/view/614719 "First Tab skips a collapsed or empty Unassigned to the first technician", section 13246 (S11), refs SV-10054, two-audience shape, quotes S11-R1 / S2-R2 / S2-R17 verbatim from PRD v62, AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build. Tool `new_case_first_tab.py`; read back 200, fields OK. PRD re-checked just before the write: still v62.
   Run 498: 277 → 278 tests, union only, nothing dropped, no status changed. Test: https://shopview.testrail.io/index.php?/tests/view/4007027 (Untested).
3. Setup file: **yes** → `update_setup_file.py`: header now 22 cases and PRD v62; the 7 S2-R23 and 5 S11-R1 quotes now carry the v62 text; open questions 32 and 33 marked ANSWERED; SETUP-C614719 recipe, mapping row, traceability and VIU row added. (The cases themselves still quote v61, by the QA lead's choice.)
