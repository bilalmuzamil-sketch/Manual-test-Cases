# Worker brief: drive the Credit terms design in full (23 Oct 2026)

QA lead, 23 Oct 2026: new testing suite "Credit terms"; design https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (canvas "Default
Credit Terms", version 1792722751-b285, created 2026-10-22T17:07Z). A second worker drafts the PRD cases in parallel in
`build/credit-terms/authoring/`. Your job now is the design drive and its proof; design cases are written in a second round, after
both of you finish (you will be asked then).

You do NOT write to TestRail, Jira, Slack or Google; no commits. Work only inside `build/credit-terms/design-2026-10-23/` (read
anything else).

## The design (saved; read every file, Rule 119)

`design-2026-10-23/files/`:
- `project/canvas.json`: 9 pages, one board each — p1 "1 List and row menus" Main.dc.html · p2 "2 Move customers to another term"
  Default.dc.html · p3 "3 New credit term and Inactive tab" NewTerm.dc.html · p4 "4 Everything deactivated and an empty tab"
  Empty.dc.html · p5 "5 New Customer" NewCustomer.dc.html · p6 "6 Customer on a deactivated term" Inactive.dc.html · p7 "7 Vendors"
  Vendor.dc.html · p8 "8 Over Credit warning" OverCredit.dc.html · p9 "9 Invoice due date" Invoice.dc.html.
- The boards are HTML mock-ups built from the ShopView design system (`project/ds/shopview/*.css`, tokens.json; Inter fonts in
  `project/ds/shopview/fonts/`, kept out of git), plus 25 screenshots in `project/shots/` (`before-*` = production today, `r15-*`,
  `r16-*` = build rounds). Each board references `./support.js`, which is NOT a published file (the canvas runtime injects it); render
  the boards in Chromium (Playwright, executablePath `/opt/pw-browsers/chromium` if needed) without it and record anything that does
  not render.
- `SKILL.md`, `index.html`, `artifact-type/reference/*.md`, `artifact-type/thumbnail/thumbnail.json`: the design tool's own files.
  Read them; note whether they hold ShopView content. The viewer runtime (app.js, app.css, dc-runtime.js, fast-edit-worker.js,
  fonts) was not downloaded: it is the claude.ai viewer, read in full for the SSR design on 22 Oct
  (build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/); record it as "viewer runtime, not design content".
- PRD v3 (the source of WHAT the product does): `build/credit-terms/sources/CONFLUENCE-963346440-v3-2026-10-23.md`. The design is the
  source for the LOOK where the PRD is silent (Rule 126). Every place the design differs from PRD v3 is a design difference (Rule 130).

## Rules and skills to read first, in full

`build/LESSONS-REGISTER.md` (all rows L-01 to L-09); `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole file, especially §4, §4b,
§6, §6b, §6c, §6d checklist); `build/rules/RULES-61-96.md` Rules 117 (tenth and twelfth amendments), 120, 124, 126, 130, 133.
Worked example of the same job on the previous suite: `build/ar-ap-report-sorting/design-2026-10-22/` (WORKER-BRIEF, reading
record, inventories, checklist, NEW-QUESTIONS.py, PASS-REPORT). Tools: `build/testing-tools/design_text_inventory.py`,
`design_visual_inventory.py`, `spec_to_design_check.py`, `design_label_check.py`, `drive_design*.py` — use what fits.

## What to do

1. **Read and render every board.** Render each board at its own width in light theme (and dark where the board shows dark),
   screenshot every figure/state into `images/` with readable names (`ct-p<page>-<slug>.png`), and view every picture yourself.
   Every interactive thing in the boards (hover titles, buttons, tabs, menus, `:hover` rules, `title=` attributes, anything with a
   script) is clicked or hovered and what it shows recorded (Rule 120). View every one of the 25 screenshots and transcribe every
   word on it (Rule 124).
2. **Figures list:** `DESIGN-FIGURES-2026-10-23.json` — every figure: board, page, badge/label (before / after / new), heading,
   caption, the picture file, the state it shows (for example "row menu of an unused shop term").
3. **Text inventory:** every word in the boards, captions and screenshots, each row classified DATA / PRD-MATCH (with the PRD code
   or §8 row it matches word for word) / OUT-OF-SCOPE / SPEC-CONFLICT (design words differ from PRD v3 — quote both) / LOOK-ONLY (a
   look the PRD does not describe); zero unclassified. Compare letter case by hand (L-04).
4. **Visual inventory:** per screen and state: layout, columns and widths, row order, icons (which, where, colour), tags ("Default"),
   menus with their items, order, icons, divider, red items, greyed items; dialogs with title, message, buttons and their colours;
   tooltips with position; toasts; empty and error states; tabs and counts; New Credit Term window (options, disabled box, hint, blue
   line, errors); Move Customers window (search, Select All/None, "n selected", list, Move To, hint, red line, buttons); New Customer
   (Credit Terms + Credit Limit side by side, locked limit, Default tag in dropdown); "(Inactive)" on cards and in Edit; vendor
   screens; Over limit badge; invoice due date; Credit Terms Log window (columns, search, empty, error); sizes and wrapping of long
   names; no overlap. Note the width each board is drawn at.
5. **Every menu, dialog, tooltip, toast and empty state** listed with its rows and buttons (L-02), with the PRD sentence it should
   match.
6. **PRD → design check (Rule 130, §6c):** every PRD look/screen sentence (S1–S12 and §8 rows) checked against the boards: SHOWN /
   NOT SHOWN (PRD §2 says states with no board follow the PRD text: list them) / DIFFERENT. Every difference either way goes in
   `build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json` (create it; you may write this one file outside your folder) with: id, board,
   picture, design words, PRD words + code, kind (wording / behaviour / look), proposed outcome (question for Chris, or already
   settled by a named PRD sentence). "Cases follow the spec" is never an outcome.
7. **Design-case plan** (for round 2, no cases yet): `DESIGN-CASE-PLAN.md` — every "looks as designed" case the §6d checklist needs
   (one per screen and state, picture to attach, widths 1440 and 1536 px, light/dark where shown), and every HELD design-version case
   Rule 130 needs (one per behaviour difference).
8. **Questions:** draft the design questions for Chris Ward in `NEW-QUESTIONS.py` as a ROWS list (number from 1; topic "Credit terms:
   …"; question with (a)/(b)/(c); what we know today; where we found it (board, picture, PRD code); cases affected — leave as "to be
   filled" for now). Apply skill 07 §6 first: drop anything PRD v3 settles, and list what you dropped and why.

## Output

`DESIGN-READING-RECORD.md` (every file, size, read how, 100%); `DESIGN-FIGURES-2026-10-23.json`; `images/`;
`DESIGN-TEXT-INVENTORY.json` and `.md`; `DESIGN-VISUAL-INVENTORY.md`; `SPEC-TO-DESIGN-2026-10-23.json`;
`build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json`; `DESIGN-CASE-PLAN.md`; `NEW-QUESTIONS.py`; `NOTES.md` (anything that did not
render or you could not do). Final message: counts (files, figures, pictures, inventory rows by class), the differences one line
each, the planned design cases count, the questions.
