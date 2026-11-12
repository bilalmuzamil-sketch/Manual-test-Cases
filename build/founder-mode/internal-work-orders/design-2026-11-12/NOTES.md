# Notes — Internal Work Orders design drive (12 Nov 2026)

Worker pass for `WORKER-BRIEF.md`. No writes to TestRail, Jira, Slack or Google; nothing committed. Files written only in this
folder and `build/founder-mode/internal-work-orders/DESIGN-DIVERGENCE-REGISTER.json`. Written as the work goes.

## How the design was reached (Rule 121, no bot check touched)
- The canvas page sits behind a Cloudflare check for a headless browser; not touched. The saved package (`files/`) was rendered locally.
- `tools/serve.js` serves `files/project/` on 127.0.0.1:8765 and answers `./support.js` with `files/artifact-type/dc-runtime.js`. Why that file:
  the runtime carries React and ReactDOM itself (React production build at its top), boots `<x-dc>` on DOMContentLoaded, fetches each
  `<dc-import name=X>` as `./X.dc.html` (its own `ln = "."`), and its own guard message says the page loads "support.js or a copy of it". The
  saved frames in `../from-qa-lead-2026-11-12-final/design-saved-page-files/saved_resource(n).html` show the canvas injecting the same runtime
  (`_f/1794484794-2031/artifact-type/dc-runtime.js`) plus a file map; locally the same files come from disk.
- The package has no `fonts/` folder (the canvas serves it): `Inter_18pt-*.ttf` is answered with the system Inter of the same weight
  (`/usr/share/fonts/opentype/inter/`), logged in `render/server-404.log`. Inter is the design's own `--sv-font-ui`.
- Check against the QA lead's browser save: the text of saved frames (4) "18 Closed · INTERNAL document" and (10) "07 Invoice · the line at
  $0.00, Warranty" was extracted and matches the local rendering word for word (see DESIGN-READING-RECORD.md, "Own rendering checked").

## Version
- Canvas "Internal Work Orders · All flows v6", version 1794484794-2031 (stamp found twice in the saved `_t.html`; `canvas.json` created on files
  at 2026-11-03T13:50:56Z; every page description says "v6.1 · Nov 5, 2026"). PRD Final v1.0 of 9 Nov 2026 is newer and says in its header:
  "Where a frame and this text disagree, the text wins".

## Running findings (filled in as the drive goes; the register is the record)
- See `../DESIGN-DIVERGENCE-REGISTER.json` and the final counts at the end of this file.

## Final counts (12 Nov 2026)
- Pages 10, boards 167 (Happy 44, Review 34, Flow 0 19, Flow 1 25, Flow 2 15, Flow 3 3, Flow 4 11, Flow 5 5, Flow 6 7, Shared screens 4),
  canvas notes 198 (148 distinct). Every board rendered at its own size (167 pictures in `images/`); 131 distinct sources, 90 content groups
  driven (2,598 interactive candidates hovered and clicked, 36 exposed something); 26 frame-opened renders; 88 distinct desktop sources
  re-rendered at 1440 and 1536.
- Text inventory 14,090 rows: OUT-OF-SCOPE 6,562 · DATA 5,784 · PRD-MATCH 1,259 · LOOK-ONLY 268 · SPEC-CONFLICT 217 · unclassified 0.
- PRD → design: 247 rows (SHOWN 52, DIFFERENT 48, NOT SHOWN 30, NO SCREEN 117). `spec_to_design_check.py`: 89 rows, 63 closed, 26 open
  tool artefacts (exit 1, see the checklist line 5).
- Register: 52 differences (45 settled by a PRD sentence, 7 on a question), 40 not-shown rows.
- Visual inventory: 80 screen/state rows, 28 dialog/menu rows, 42 library sentences, width results; unclassified 0.
- Case plan: 85 look cases (DC-01..DC-85, DC-50 held on question 4 of the existing draft) + 6 held design-version cases (DV-01..DV-06) = 91.
- Questions: 6 new rows (8-13) in `NEW-QUESTIONS.py` for Milos Vasic; IWO-D19 rides on question 3 of `../PO-QUESTIONS-DRAFT.md`. Sent: 0.

## Judgement calls (for the QA lead)
- Questions are numbered 8-13 to go under the PRD case worker's 7 in ONE sheet (Rule 131). My draft question on the internal estimate stamp
  was dropped as a duplicate of that draft's question 3; DC-50 (asset Invoices tab) waits on its question 4.
- The design-system bundle (`_ds_bundle.js`, ~470 KB) and the two style sheets were script-read (every comment, string and always/never
  sentence), not read line by line; the boards' look was taken from the rendered computed styles. Rule 119: he may ask for a full read.
- Fonts: the package has no fonts folder; the system Inter was substituted. Frame-opened renders and width renders are harness views
  (the canvas itself shows the board frame at its own size).
- The PRD (Final v1.0, 9 Nov) is newer than the design (v6.1, 5 Nov) and says the text wins: 45 differences are settled by it, and the
  design cases expect the PRD's words with the design's look, naming the register row under "References from Design".
- `spec_to_design_check.py` keeps exiting 1 on 26 tool artefacts (prose between two quoted strings). No closing outcome fits them honestly,
  so they are left open and reported rather than closed under a wrong label.
- Nothing written to TestRail, Jira, Slack or Google; nothing committed.

## Second pass (12 Nov 2026, coordinator's two gates)
- Gate 1, design library read in full: `_ds_bundle.js` read line by line with the Read tool, lines 1-12,181 (100%, 413,134 bytes) in 20
  chunks, with running notes per chunk in `render/ds-bundle-reading-notes.md`; both style sheets read in full too. 31 rules that touch
  these screens are in `tools/library_rules.py` (each checked word for word against the bundle or style sheet), in the text inventory as
  "design library" rows (14,121 rows now, 0 unclassified) and in DESIGN-VISUAL-INVENTORY.md §C. New from the read: IWO-D53 (library
  dialogs close on Esc and on a backdrop click; PRD S1-R2/S4-R2 say they do nothing; settled, design case DC-86), IWO-D54 (library has no
  loading state; PRD asks for a spinner; settled, not-shown row), IWO-D55 ("Total price" column label letter case; settled). DC-25, DC-26
  and DC-28 sharpened with the library's Status column, single-choice checkmark list and shared empty-state words. Plan: 86 DC + 6 DV = 92.
- Gate 2, spec_to_design_check.py: exit 0 (71 rows, all closed). The tool is unchanged; its input is built by `tools/prd_for_check.py`
  (quotes paired as curly quotes per requirement line, words unchanged). The 26 first-run open keys are recorded one by one with their PRD
  line in SPEC-TO-DESIGN-2026-11-12.json → spec_to_design_check.first_run_open_keys (25 fragments of PRD prose, 1 real label now matched).
  Run order: build_all.py → prd_for_check.py → the tool → close_tool_rows.py → the tool again (build_all rewrites the register).
