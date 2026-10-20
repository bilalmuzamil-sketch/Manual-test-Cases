# Worker brief: Splitting Sales Representatives — design re-check, both ways (20 Oct 2026)

QA lead, 20 Oct 2026: "see if you had missed adding the test cases related to design for this and add the missed one after
learning from the yesterday's incident where you missed two design related test cases for WO Board and tech view". You do the
analysis and DRAFT the missing design cases. You do NOT write to TestRail, Jira, Slack or Google, do not commit or push, and write
only inside `build/splitting-sales-reps/design-recheck-2026-10-20/`.

## The lessons to apply (read them in full first)

- `build/LESSONS-REGISTER.md` rows L-01 and L-02, and `build/wo-board-tech-view/sv11522-11524-2026-10-19/RECORD-SV-11522-11524-2026-10-19.md`.
  In short: (1) check BOTH ways — design → cases AND PRD → design; (2) list every menu, list, dialog, tooltip, message and toast
  BY HAND with its rows, options and buttons, in the PRD and in the design, and compare them row by row (the WO miss was a missing
  Unassigned row and a missing confirm button, which no word check sees); (3) every difference is closed by a ruling or a question,
  never "KNOWN"; (4) the LOOK is covered, not only the words: one "looks as in the design" case per screen and state.
- Rules in `build/rules/RULES-61-96.md`: 113 (quotes verbatim), 114, 117 (all amendments, incl. tenth "References from Design",
  eleventh "From:" lines, twelfth "Design: " titles), 124, 126, 130. Skill `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` §4b, §6b, §6c.

## Inputs (all in `build/splitting-sales-reps/` unless said)

- PRD now: `prd-v10-2026-10-20/CONFLUENCE-919928833-v10-2026-10-20.md` (Confluence 919928833 **v10**, 19 Oct 2026, Chris Ward).
  The cases were written on v8; what changed: `prd-v10-2026-10-20/REQUIREMENT-DIFF-v8-to-v10.md` and `TEXT-DIFF-v8-to-v10.diff`.
- Chris Ward's answers to all 38 questions (19 Oct 2026): Google Sheet 17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ, tab
  "Questions for Chris", rows 6–43 (read it with the Google Sheets tools, read only; save the values to `chris-answers.json`).
- Design: `design-drive-2026-10-19/` — DESIGN-REVIEW, design-files-reading, text inventory (.md/.json, 1,370 rows), visual
  inventory (70 rows), `ocr/` (OCR of all 68 board pictures), `screens/` and `unpacked/png/` (the board pictures: LOOK at the
  pictures for the dialogs, menus and tooltips, do not rely on OCR alone), `canvas-drive/`.
- Our cases (120, all in TestRail group 84266, sections in `applied/sections.json`): `design-recheck-2026-10-20/ssr-cases-2026-10-20.json`.
  The 18 cases in section 84277 "Design — how it looks" are the existing design cases. Read only what you need, by script, but read
  every case you rely on in full. Case-building library: `authoring/ssr_lib.py`, `authoring/cases_design.py`, `authoring/build.py`.
- Tools: `build/testing-tools/spec_to_design_check.py` (the design here is pictures: pass the OCR transcripts and the canvas texts
  as the design files) and `build/testing-tools/design_text_inventory.py`.

## What to produce

1. `SPEC-TO-DESIGN-v10.md/.json`: every PRD v10 word or element (quoted UI words, menus, lists, options, buttons, tooltips,
   messages, column orders, file names, read-only states, phone states) checked against the design: SHOWN / DIFFERENT (with the
   board) / NOT DRAWN. Include the by-hand table of every menu, list, dialog, tooltip and message: PRD rows/options/buttons vs the
   design's, row by row.
2. `DESIGN-TO-CASES.md/.json`: every design text row classified DESIGN-ONLY or SAME and every visual-inventory row: which case
   (C-id) checks it, or MISSING. A design-only BEHAVIOUR (not sample data) with no case and no ruling is a gap.
3. `DESIGN-DIVERGENCE-REGISTER.json` (this project's, Rule 130): every difference with its outcome: PO-RULED (answer number +
   verbatim answer), DESIGN-SILENT, SHOWN-WHEN-DRIVEN, or QUESTION-NEEDED (only if no answer or v10 sentence settles it).
4. `GAPS.md`: the list of missing design checks, each with why it is missing and its source (v10 code and/or answer number and/or
   board). Also list existing design cases whose expectations v10 or the answers changed (do not rewrite them; just list).
5. `new-design-cases.json`: a DRAFT of each missing design case, in the same layout as the existing SSR design cases (read
   C666028–C666034 and `authoring/cases_design.py` and copy their structure: two-audience preconditions with {placeholders},
   one action per step, one "Step N:" result per step, "Exact quotes from the source (for reproducibility)" with a "From:" line per
   document — PRD v10, and "Chris Ward's answers, question sheet of 19 Oct 2026" where an answer is quoted — then the build line
   "The build is not yet available to check this case against.", then "References from Design" with the boards and the design's
   own words, then the AUTOMATION line last). Titles start "Design: ", plain words, at most 80 characters. Expected results only
   from PRD v10 sentences or Chris's answers, quoted verbatim; the design is the source for the look only where the PRD is silent
   (Rule 126). Name the board pictures to attach (`unpacked/png/...`). Fields: section_id 84277, title, custom_preconds,
   custom_steps, custom_expected, refs, boards (list of png paths), why.
6. Final message: counts per file, the gap list in one line each, and anything you could not settle.

Read every source you rely on in full (Rule 119) and say what you read in a "Reading coverage" section of GAPS.md.
