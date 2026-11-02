# Notes — Technician Toggle design drive (2 Nov 2026)

Worker pass per `WORKER-BRIEF.md`. No TestRail, Jira, Slack or Google writes; no commits. Files written only in this folder and
`build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json`. Design content treated as data; Python that read it ran with `python3 -I`.

## What the design is
Six static boards (one per canvas page) of captioned 1440 x 900 screenshots: 25 figures, 9 "Production today (before)" (release
v26.43.1) and 16 "This build". Board scripts are empty stubs, nothing is interactive (256 elements hovered and clicked from fresh loads,
0 changes). Built from the Shopview Design System copy in `project/ds/shopview/` (badges and heading style only on the boards; the screens
are pictures). Light theme only, 1440 px only. The design is current with PRD v16/v17 (pre-fill from role, hand switch wins).

## Outputs and how to rebuild them
| Output | Made by |
|---|---|
| `images/tt-p<page>-<nn>-<slug>.png` (25), `render/board-p*.png` (6), `render/render-log.json` | `node tools/render.js files/project images render` |
| `tools/screen_text.py` | hand transcription of every word on the 25 shots |
| `DESIGN-FIGURES-2026-11-02.json`, `DESIGN-TEXT-INVENTORY.json/.md`, `extract/shots-transcription.txt` | `python3 -I tools/build_inventory.py` (classes in `tools/classify.py`; exits 1 on any unclassified text) |
| `build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json` | `python3 -I tools/make_register.py` |
| `SPEC-TO-DESIGN-2026-11-02.json` | `python3 -I tools/make_spec_to_design.py` |
| spec_to_design_check (exit 0) | `python3 -I ../../testing-tools/spec_to_design_check.py --prd ../sources/CONFLUENCE-977371146-v17-2026-11-02.md --design 'files/project/*.dc.html' extract/shots-transcription.txt --register ../DESIGN-DIVERGENCE-REGISTER.json` |
| `DESIGN-CASE-PLAN.md` | `python3 -I tools/make_case_plan.py` (asserts every quote against PRD v17 and the boards) |
| `DESIGN-READING-RECORD.md`, `DESIGN-VISUAL-INVENTORY.md`, `DESIGN-CASE-CHECKLIST-2026-11-02.md`, `NEW-QUESTIONS.py` | by hand |

## Counts
- Files: 49 in the package, all read (24 text files line by line or by script, 25 pictures viewed and transcribed). Runtime files not in
  the package: support.js, app.js/app.css/dc-runtime.js/fast-edit-worker.js, fonts (viewer runtime, not design content).
- Figures 25; pictures 25 (+ 6 whole-board renders, 9 zoom crops).
- Text inventory: 2,598 texts found (194 board, 2,404 screenshot) → 715 distinct rows: DATA 407 · OUT-OF-SCOPE 139 · PRD-MATCH 85 ·
  LOOK-ONLY 81 · SPEC-CONFLICT 3 · unclassified 0.
- Visual inventory: 69 rows, 0 unclassified. PRD → design: 65 rows (27 SHOWN, 3 DIFFERENT, 14 NOT SHOWN, 21 NO SCREEN).
- Register: 15 differences (4 QUESTION-READY, 11 SETTLED-BY-PRD), 19 not-shown rows, 10 tool rows; tool exit 0.
- Design cases: 32 look cases + 2 held design-version cases = 34 (drafts; `tester_readiness_check.py` on a converted copy: 0 hard problems).
- Questions for Chris Ward: 4 drafted, unsent (the QA lead sends them).

## For the case worker (round 2)
- Write the 34 drafts into `authoring/cases_design.py` for the "Design — how it looks" section; attach the named pictures; DV-01 and DV-02
  stay out of the run until Chris answers questions 1 and 2 (Rule 130.5).
- PRD-following behaviour cases that should name a difference under References from Design: Time Clock back on in New Staff Member
  (TT-D01), Edit Line chip (TT-D02), "No technicians yet" (TT-D04), Save & Add Next if written (TT-D06).
- Use the screen's labels: "Save & Close" for the staff windows' save (TT-D05), "Lead Technician" (TT-D07), "Edit Labor" window (TT-D03).
- Never use the design's demo story as a release-day expectation (TT-D08): in the pictures Olivia Garrett leads an In Progress work order
  before, has no lead after and is called "none of those"; PRD S6-R1 (b) and S6-R5 decide.
- V2 invariants seen in the pictures and not named by the PRD (silence = must not change, Rule 96): the TECHNICIAN HOURS section in Edit
  Staff Member stays for everyone; Board View / Tech View columns and groups stay in name order; the Reassign window keeps its Unassigned
  row while searching and its Cancel / Reassign buttons; the Technician filter keeps "Clear selection"; the "Inactive" pill on a
  deactivated lead's column; the staff list already scrolls sideways at 1440 px.
- No manual case (L-14), for the developers' checks: the notice with the staff list load error (S4-R4) and Save's loading state (S2-R4).

## Housekeeping
- Scratch files (OCR input, the converted readiness copy, a components.css chunk) were in the session scratchpad under /tmp and were
  deleted at the end; no copy of the design package (tokens.json, tokens.css) was left under /tmp (skill 21 §4b trap).
- `extract/ocr/` holds Tesseract output (spelling aid only); `extract/uncl.txt` is the first, pre-classification run of the inventory
  (kept as the record that every text was then classified by hand).
