# Worker brief: full pass of the A/R and A/P suite against its design (22 Oct 2026)

QA lead, 22 Oct 2026: shared the design (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4) and chose "Full pass now": drive the
whole design, re-check all 257 cases against it, held design-version cases for every difference, new design cases from the Rule 133
checklist, design questions for Chris Ward. The tech plan is still missing (a second full pass follows when it arrives). Earlier
(22 Oct, at creation): "the test cases for DESIGN should from now onward include everything learning from the mistakes ... we MUST
not repeat the mistakes."

You DRAFT only: edit the authoring files and run the gates. No writes to TestRail, Jira, Slack or Google; no commits.
Work only inside `build/ar-ap-report-sorting/`.

## The design (already saved; read every file, Rule 119)

`design-2026-10-22/`:
- `files/project/canvas.json` (7 pages, 7 boards), the 7 boards `files/project/{Main,Export,Grouped,Location,Links,Layout,Filters}.dc.html`.
- `DESIGN-FIGURES-2026-10-22.json`: the 45 figures (board, badge "Production (before)" / "This build (after)" / "New in this build",
  heading, image, alt text, caption). Captions and alt texts are the design's own words.
- `images/*.png`: the 43 screenshots (1440 px wide app screens). VIEW EVERY ONE (Read the png) and transcribe every word on it
  (Rule 124: image-only designs: every image's words). OCR (tesseract, if present) may help but every image is also viewed.
- `files/project/ds/shopviewdesignsystem_fac6ef/` (colors_and_type.css, components.css, tokens.css, tokens.json): the ShopView design
  system copied into the canvas; read for the look rules (link colour, Totals row, chips) where the design names them.
- `files/SKILL.md`, `files/index.html`, `files/artifact-type/reference/*.md`, `thumbnail.json`: the design tool's own files. Read
  them; they hold no ShopView content (say so in the coverage record). The tool runtime (app.js 4.3 MB, app.css, dc-runtime.js,
  fast-edit-worker.js, fonts) is NOT part of this brief: it is the claude.ai viewer, already read in full for the SSR design on 22 Oct
  (build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/); note it as "viewer runtime, not design content".
- Important: the "after" pictures are screenshots of a build ("this build (round 13, 2026-10-19)"). For WHAT the product does,
  expected results come only from the PRD (Rule 57); the design is the source for the LOOK where the PRD is silent (Rule 126).
  Every place a picture or caption differs from PRD v5 is a design difference (Rule 130).

## Rules and skills to read first, in full

`build/LESSONS-REGISTER.md` (all rows, L-01 to L-05); `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole file, especially §4, §4b,
§6, §6b, §6c, §6d: the design-case checklist, every line ticked or the suite is not complete); `build/rules/RULES-61-96.md` Rules 113,
114, 116, 117 (all twelve amendments), 120, 122, 124, 126, 130, 133; `build/skills/IDEAL-TEST-CASE-STANDARD.md`.
Tools: `build/testing-tools/design_text_inventory.py`, `design_visual_inventory.py`, `spec_to_design_check.py` (`--prd --design files
--register`), `design_label_check.py` — use what fits this canvas (boards are images with captions).

## The suite (authoring library, all in `authoring/`)

`ar_lib.py`, `common.py`, `cases_*.py`, `po_questions.py`, `build.py` (gates; must end with 0 PROBLEM lines), `render_setup.py`,
`render_outputs.py`. PRD v5: `sources/CONFLUENCE-947650561-v5-2026-10-22.md`. Chris Ward's open question sheet (10 questions,
not answered yet): `questions-2026-10-22/sheet_rows.py` (do NOT renumber or change those 10). `po_questions.DROPPED` holds 8 points
answered from our own sources — respect them. The C-ids: `testrail-id-map.csv`. Do not change a key's meaning; new cases get new keys.

## What to do

1. Design drive (skill 21): coverage record of every file; TEXT inventory of every word in the boards, captions, alt texts and the 43
   screenshots, each row classified DATA / COVERED (case key) / OUT-OF-SCOPE / SPEC-CONFLICT / CASE-NEEDED, zero unclassified;
   VISUAL inventory (columns and their order per report, icons, chips and their colours at rest and active, header styles, pinned
   column, Totals row, link style light/dark, tooltip position, empty state, toast, dialogs, sizes at 1440 px, no overlap); every
   menu, dialog, tooltip, toast and empty state listed with its rows and buttons (L-02); letter case compared by hand (L-04).
2. PRD → design check (Rule 130, §6c): every PRD look/screen sentence checked against the pictures; every difference either way goes
   in `DESIGN-DIVERGENCE-REGISTER.json` with an outcome (a question for Chris drafted, or a ruling already in the PRD). "Cases follow
   the spec" is never an outcome.
3. Full pass of all 257 cases (Rule 122): re-check each whole case against the design. Where the design shows the PRD's behaviour,
   add the design reference ("References from Design" block: design link, board/page, the picture names, the design's own words
   quoted) — the AR library has a `design=` hook (DREF) already. Where steps or preconditions can be made more runnable from what the
   screenshots show (exact labels, where a control sits), improve them. Expected results stay PRD quotes (Rule 113).
4. New design cases (section DESIGN, titles start "Design: ") for everything the §6d checklist and the inventories show without a
   case: one "looks as designed" case per screen and state shown, comparing with the attached picture at 1440 px, light and dark
   where shown, at 1536 px for no overlap. Attach pictures by name (images/<id>.png) in the References block.
5. Every design behaviour that differs from PRD v5: a HELD design-version case (Rule 130), marker
   `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO`, kept out of the run until Chris rules.
6. Draft the new questions for Chris (plain words, same row shape as `questions-2026-10-22/sheet_rows.py` ROWS: number from 11 on,
   topic "A/R and A/P Report Sorting: …", question with (a)/(b)/(c), what we know today, where we found it, cases) in
   `design-2026-10-22/NEW-QUESTIONS.py` as a ROWS list. Apply skill 07 §6 first: drop anything our own sources answer.
7. Run `python3 authoring/build.py` (0 PROBLEM lines), regenerate the setup file and outputs.

## Output

- `design-2026-10-22/DESIGN-READING-RECORD.md` (every file, size, read how, 100%), `DESIGN-TEXT-INVENTORY.json/.md`,
  `DESIGN-VISUAL-INVENTORY.md`, `DESIGN-CASE-CHECKLIST-2026-10-22.md` (§6d, every line DONE with case keys), updated
  `DESIGN-DIVERGENCE-REGISTER.json`, `NEW-QUESTIONS.py`, `PASS-REPORT.md` (per case: changed or confirmed, why; new cases with
  section and source; held cases; counts).
- Final message: counts (confirmed / changed / new / held), the design differences in one line each, the new questions, gate output.
