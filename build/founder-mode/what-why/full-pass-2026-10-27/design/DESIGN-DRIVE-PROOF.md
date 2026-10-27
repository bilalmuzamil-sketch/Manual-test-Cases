# What/Why (Title and Description) — design drive proof, 27 Oct 2026 (Phase D, part 1; DRAFT)

Rules 115, 119, 120, 122, 124 (as amended 9 Oct), 126, 130, 133; skill 21 §§2–6d; lessons L-01 to L-19. Worked example followed:
`build/founder-mode/part-lifecycle/full-pass-2026-10-27/design/`.
Design: canvas artifact https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6 "What Are You Doing / Why Are You Doing It?", 2 pages, 7 boards,
4 notes. Working copy `sources/design-2026-10-27-artifact/files/` (re-read 27 Oct: only change since 13 Oct is "Title *" → "Title" in
Main.dc.html, line 38). Last design drive before this one: 13 Oct 2026 (`design-drive-2026-10-13/`); re-driven in full today because the
full pass requires it (Rule 122). Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed; nothing written
outside `full-pass-2026-10-27/design/`.

## 1 · Reading coverage (Rule 119)

| Source | Size | Read | Coverage |
|---|---|---|---|
| PRD 845348896 **v15** (14 Oct 2026 16:32 UTC), read 27 Oct with the Atlassian tools (markdown, full) | 28,097 B (Phase A's saved copy) | whole page read in the tool result; section 5 also saved as `inventory/PRD-v15-section5-working-copy.md`; all 41 requirement lines compared by script with Phase A's `sources/CONFLUENCE-845348896-v15-2026-10-27.md`: identical | 100% |
| v13 → v15 by code (`inventory/prd-v13-v15-req-diff.txt`) | 40 → 41 codes | changed: S1-R1, S1-R3, S1-R6, S1-R7, S3-R3, S3-R4, S3-R6, S3-R6a, S3-R8, S3-N1, S4-R3; new S3-E4 (S1-R7 is named under the S1-R3 entry of the v14 Change Log) | 100% |
| Chris Ward's 8 answers, Google Doc 1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA | 8 answers + FYI | read in full (Drive, 27 Oct) | 100% |
| Tech plan 23 Sep 2026 `sources/tech-plan-Title-and-Description-2026-10-13.md` | 41,389 B, 466 lines | lines 1–466 | 100% |
| Jira capture 13 Oct `sources/jira-2026-10-13/STORIES-2026-10-13.md` (SV-11257, SV-10130…10133, SV-10390…10393 with comments) | 47,068 B, 634 lines | lines 1–634 | 100% |
| SV-11850 (bug, 27 Oct 09:14) | description + 1 screenshot attachment | description read in full (Atlassian, 27 Oct); the attachment picture not opened (it shows the empty builder the text describes) | text 100% |
| Stories' current status | — | SV-10131 read as "Merged to Staging" through SV-11850's link; the other stories' 27 Oct state is Phase A's (`sources/jira-2026-10-27/`, not re-read here) | named |
| 7 board files `*.dc.html` (27 Oct copy) | 45,107 B, 667 lines | every line read (DialogBefore 1–87, Main 1–92, EditBefore 1–99, EditAfter 1–101, QuickBooks 1–113, EdgeCases 1–98, Truncation 1–77; inline CSS read as styling) | 100% |
| `canvas.json` | 3,053 B, 114 lines | 2 pages, 7 artboards, 4 notes, launch: every field | 100% |
| Board renders (`renders/board-*.png`, 7) and canvas play shots | 7 + 13 PNG | every board viewed by me on 27 Oct | 100% |
| Rules 113–117 (all amendments), 118–138; lessons L-01–L-19; skills 21 and IDEAL-TEST-CASE-STANDARD | — | read | 100% of the named rules |
| Worked example: Part Lifecycle design proof, run script, plan header | — | read | the parts copied |
| Live cases: 37 read-backs `update-2026-10-13/applied/C<id>-after.json` (latest write 13 Oct) | 37 cases | copied to `inventory/cases-live/`; plain text of all 37 to `inventory/cases-live-plain.tsv` by script; all 37 titles read; S1 and S2 cases (10) read in full (preconditions, steps, results); C549085 read in full; the rest matched by script | scripted, never bulk-read |

Not read in this phase: the 27 Oct Jira capture Phase A is writing (`sources/jira-2026-10-27/`) and the SV-11850 screenshot. No
design-look content is expected in either; named so nothing is silently left out.

## 2 · The drive (Rule 120)

The driven page is the 13 Oct browser-ready page with its single "Title *" replaced by "Title" (the only 27 Oct change), so the drive
matches the current design: `drive/page/artifact-page-2026-10-27.html`, md5 376a71a2ee13dad6914f05b560f7b93d (13 Oct page md5
b18d1576b792f312ff98832f3723907a). Run script `drive/run.sh`; all four runs exited 0 (`drive/*.log`, `drive/DONE`).

| Pass | Tool | Result |
|---|---|---|
| Canvas drive at 1440×900 | `drive_design_canvas.py` (`drive/canvas/`) | 2 of 2 pages selected · 7 of 7 boards seen and hovered · 7 of 7 played · 21 play-mode control hovers · 7 of 7 Export menus opened · 4 notes recorded · zoom · dark theme captured · 0 errors · never played: none · never exported: none |
| Canvas drive at 1536×900 | same (`drive/canvas-1536/`) | identical counts, 0 errors |
| One-click sweep at 1440×900 | `drive_design_full.py --serve` (`drive/sweep/`) | 44 elements: 44 hovered, 44 clicked · 20 hover-exposed · 39 click-exposed · 22 hover style changes · 0 occluded · 0 failed · 0 missing · 88 interactions · 63 screenshots · 1 hidden text block never exposed: the page's own `<title>` (display:none, not design text) |
| One-click sweep at 1536×900 | same (`drive/sweep-1536/`) | identical counts, 0 failed, 0 missing |
| Direct renders | Playwright (`renders/board-1.1 … 2.2.png`), full page | all 7 boards, viewed |
| Rendered DOM extract | `dom_extract.py` → `inventory/dom-extract-2026-10-27.json` | every visible text (213 text nodes), 16 icons, 107 boxes with computed size, weight, colour, background, border |
| Visual tool | `design_visual_inventory.py`, 7 boards × 1440/1536 (`inventory/visual-tool/`) | 14 states, 0 fatal, 11 rows; 0 overlapping text pairs and 0 clipped texts at both widths |

**Never exercised, with the reason:** none of the 7 boards or 2 pages. Inside a played board nothing is clickable (`play_inner_click`
0 on both widths): the boards are static HTML whose buttons and fields are drawn `div`s with no handlers, so there is no menu, dropdown,
tooltip, toast or dialog to open. Picking an Export format only downloads the board already viewed. The 4 notes are not interactive;
all 4 read.

**Flows (Rule 124 amendment 1(c)).** No multi-step flow exists in the files: no prototype state, no drag, no in-board menu, no
confirm or undo, no empty or error state behind an action. Each page is a left-to-right board sequence; both pages and all 7 boards
were played in order at two widths. Flows not driven: none.

## 3 · Text inventory — the coverage proof (`inventory/TEXT-INVENTORY-2026-10-27.md` / `.json`)

Rows = every visible text of the 7 rendered boards, the canvas board titles, page names and 4 notes, plus every
`design_text_inventory.py` row (`inventory/machine-text-inventory-2026-10-27.*`: 114 texts, 34 in a case) and sweep line not already
present (the tool drops one-word labels such as "Title", "Status", "Delete" and numbers, so the rendered DOM is the complete list).
Matched against the **37 live cases** (read-backs of 13 Oct).

| Class | Rows |
|---|---|
| OUT-OF-SCOPE (Before boards, designer's notes and pills, canvas titles and page names, canvas viewer chrome, existing field limits) | 85 |
| DATA (example values, QuickBooks quantities and amounts, glyphs) | 25 |
| CASE-NEEDED (a planned "Design: …" case, D-key named) | 22 |
| COVERED (named live C-ids) | 17 |
| SPEC-CONFLICT (DV-01 and DV-02 closed by Chris Ward's 14 Oct ruling; DV-04 with drafted question DQ-01) | 3 |
| **Unclassified** | **0** |
| Total distinct | 152 (48 also appear in a live case) |

The 13 Oct triage (112 texts, 57 "DESIGN NOTE", 0 CASE-NEEDED) is superseded: under Rule 126 the dialog words and the invoice panels
now each need a look case.

## 4 · Visual inventory (`inventory/VISUAL-INVENTORY-2026-10-27.md` / `.json`)

47 rows: 11 from the tool (board frames → OUT-OF-SCOPE; 16 px grey down-arrow and close X icons → D-01/D-03/D-06; no overlap or clipping
at 1440/1536 → D-07…D-10) and 36 by hand from the board files and the rendered DOM (`build_design_outputs.py`, list `H`: grey picker
box with 2 px dark-red underline, label colours and sizes, prompt colour and case, no asterisk, box borders, header elements, button order
and colours, purple AI tag, red Delete, blue Edit Line X, the legacy and modern invoice panels with the "SCOPE OF WORK" heading, the
ShopCoach editor and table rows that have no board). By class: CASE-NEEDED 30 · OUT-OF-SCOPE 14 · COVERED 2 · SPEC-CONFLICT 1 (DQ-02,
grey italic) · **unclassified 0**. The design has no design-system library and no "always / never / must" sentences (Rule 126 point 4: none
to list). The design draws the light theme only and no phone width (PRD Form Factor: same words, no separate design).

## 5 · Both directions (Rule 130)

**PRD v15 → design, by tool** (`spec_to_design_check.py` over the 7 board files and canvas.json; raw `inventory/spec-to-design-raw.json`):
7 PRD words the design does not show, 0 only in other letter case: S1-R6 "Title is a required field", "Line Name is a required field",
"X is a required field" (the design draws no error state) and S4-R2's four column names (no board for Story 4). All 7 are DESIGN-SILENT
rows in `DESIGN-DIVERGENCE-ROWS.json`; the tool then exits 0. By hand: Story 2 (ShopCoach line builder) has no board, so S2-R1/S2-R2 are
DESIGN-SILENT too (the tool counts "Title"/"Description" as shown because the dialog boards show them).

**Design → PRD, every dialog drawn, by hand** (no menu, tooltip, toast, prompt or empty state is drawn):

| Design element (board) | Title / rows / buttons in order, as drawn | PRD v15 | Result |
|---|---|---|---|
| New Line, after (1.2) | header: New Line · AI · SHOPCOACH LINE BUILDER · X; Title picker (label at top, "What are you doing?" under it, down-arrow, focused look) · Description (label at top, "Why are you doing it?") · Technicians / Add Technician · Labor Rate, Estimated Time, Tech Time · Save & Add Part, Save & Add Line, Save & Close | S1-R1 (no asterisk), S1-R2, S1-R3 (labels at the top, placeholder underneath; the one layout change), S1-R5 (picker labeled Title, focused on open), S1-R7 (same fields, same order) | same (the 13 Oct "Title *" is gone: DV-03 closed) |
| New Line, before (1.1) vs after (1.2) | identical except the two boxes: before, the question alone inside each box (Title Case); after, label at the top and the sentence-case question under it | S1-R3 "in production the label sat inside the empty box"; S1-R7 | same |
| Edit Line, after (1.5) | header: Edit Line · blue X; Title (filled) · Description (empty, prompt) · Status · Technicians · labor row · AI SHOPCOACH LABOR GUIDE · Delete · Save & Close | S1-R1, S1-R2, S1-R3, S1-R7; tech plan: picker only in create mode | same |
| Edit Line, before (1.4) vs after (1.5) | identical except the two labels (and the empty Description now has its label at the top) | S1-R3, S1-R7 | same |
| QuickBooks After table (1.3) | Description · Qty · Amount; two lines joined with " - " | S3-R1, S3-R2, S3-R5 | same (QuickBooks' own screen; text covered by C154713, C154715) |
| Legacy / Modern invoice panels (1.3) | title bold, description, narrative (modern under "Scope of work") | §3 "The narrative carries no label either…"; §2 invoice documents untouched | same → D-11…D-14 |
| Require Tech Story ON / OFF panels (1.3) | with story / ends after the description | S3-R3, S3-R6, S3-R6a | same |
| Awkward inputs (2.1) | no description; hyphens; four tech-story flavours; semicolon | S3-E1, S3-R9, S3-R6, S3-R9a, **S3-R12** | same except the imported line → **DV-04** |
| The long end (2.2) | title survives, description clipped; 4,000 bytes; never split a character | S3-R7, S3-R7a, §4 | same |
| Canvas notes | note-format "Require Tech Story, which is off by default"; board 2.1 note "written by the line dialog when nothing was typed" | S3-R6a v15; S3-R6 v15 (§3 still carries the broader sentence) | **DV-01, DV-02**, both ruled by Chris Ward on 14 Oct |

## 6 · Divergences and questions (`DESIGN-DIVERGENCE-ROWS.json`, `QUESTIONS-DESIGN.json`)

| Key | Difference | Outcome | Held design-version case | Question |
|---|---|---|---|---|
| DV-01 | Canvas note: Require Tech Story "is off by default"; PRD v15 S3-R6a: shops since June 2025 off, older shops on | PO-RULED (answer 8, 14 Oct; PRD v14) | none (note text only; behaviour cases test both states) | — |
| DV-02 | Board 2.1 note: the line dialog writes "Tech story missing." when nothing was typed; PRD v15 S3-R6: only when an existing line with no tech story is saved from Edit Line | PO-RULED (answer 6, 14 Oct; PRD v14) | none (no screen differs) | — |
| DV-03 | 13 Oct board showed "Title *"; PRD S1-R1 "with no asterisk" | PO-RULED and fixed in the design (27 Oct copy reads "Title") | D-01 checks no star | — |
| DV-04 | Board 2.1 lists a line "Imported from a previous system" among the texts that reach the books, reading "Replace tie rod - excessive play"; PRD S3-R12 says an imported invoice never reaches the live sync and its text is unaffected whatever the import wrote; the report is not mentioned | QUESTION-READY (not sent) | **D-15 (held)** | DQ-01 |
| — | ShopCoach empty cell "grey italic" (developer's note on SV-10131 only; PRD and design silent) | no source | none (not asserted in D-16/D-17) | DQ-02 |
| — | Modern invoice: is the "Scope of work" heading dropped with the narrative? (PRD §3 "drop it entirely" names the narrative only) | no source | none (D-14 does not assert the heading) | DQ-03 |

**Unsent question count: 3** (DQ-01 to DQ-03). Rule 126 point 6 / Rule 130 need 0 before the suite is called complete: the coordinator
adds them to the What/Why question document for Chris Ward (1QcT7FRZ…, Rule 131: same file, new rows at the bottom, new colour) and to
`build/PO-QUESTIONS-OPEN.md` (Rule 132). Until then DV-04 reads QUESTION-READY (open). `spec_to_design_check.py` with this register:
7 PRD-word rows, 0 open, exit 0 (it checks the PRD-word rows only; DV-04 is open until DQ-01 is sent).

## 7 · Skill 21 §6d checklist (Rule 133)

| # | Line | Ticked by |
|---|---|---|
| 1 | Every screen and state drawn has a "Design: …" case with its board | New Line at rest (1.2): D-01, D-02, D-03 · Edit Line with a filled title and empty description (1.5): D-04, D-05, D-06 · legacy and modern invoice prints (1.3): D-11 to D-14 · imported line (2.1): held D-15. Before boards 1.1/1.4 are today's screens (controls in D-01, D-02, D-04). Text-output boards 2.1/2.2 and the QuickBooks table are not screens of ours: every example is checked letter for letter by named behaviour cases (DESIGN-CASE-PLAN.md header). No other state is drawn (no hover, open, error, empty list, dark, phone) |
| 2 | Every menu, dialog, tooltip, toast, prompt, empty state listed row by row against the PRD | §5 table (two dialogs drawn; no menu, tooltip, toast or empty state exists in the design) |
| 3 | Every label letter for letter | spec_to_design_check (letter case on): 0 CASE-DIFFERS; by hand: "Title" (no star), "Description", "What are you doing?" / "Why are you doing it?" sentence case (note-case), "Save & Add Part", "Save & Add Line", "Save & Close", "SHOPCOACH LINE BUILDER", "SHOPCOACH LABOR GUIDE", "Scope of work" (printed in capitals by the modern view: D-12 states "SCOPE OF WORK" as drawn) |
| 4 | Every design behaviour that differs has a held case and a SENT question | DV-04 → held D-15 + DQ-01; DV-01/02/03 ruled. **DQ-01 drafted, not sent → line open until the coordinator sends it** |
| 5 | Both directions | §3–§5 |
| 6 | Sizes, spacing, colours, icons, column order, 1440 and 1536 px, no overlap or truncation | colours, icons, order: D-01 to D-06, D-11, D-12; widths: D-07 to D-10 (tool: 0 overlap, 0 clipped at both widths); light theme only drawn; no library |
| 7 | Every PRD look sentence has a design case | S1-R1/R2/R3 → D-01, D-02, D-04, D-05 · S1-R5 focus on open → D-01 · S1-R7 → D-03, D-06 · S2-R1/R2 (no board) → D-16, D-17 · §3 invoice views → D-11 to D-14 · S1-R6 message under Title (no board) → C154709, C549075 and Phase A's leaving-Title-empty case · Form Factor (no board) → C549078 · S4-R6 on-screen column list (no board, words only) → C154723 |
| 8 | Written down | this file, DESIGN-CASE-PLAN.md, DESIGN-DIVERGENCE-ROWS.json, QUESTIONS-DESIGN.json, both inventories |

## 8 · Lessons register, applied

L-01 look covered (17 design cases planned, visual inventory 47 rows) · L-02 both directions, each dialog's rows and buttons compared
(found DV-04; the error state is design-silent) · L-03 n/a (no ticket edit) · L-04 exact letter case (tool 0 CASE-DIFFERS; by hand
above) · L-05 §6d run · L-06/Rule 134 n/a here (no case rewritten in Phase D; the plan names which live cases share each look item so
Phase A rewrites them whole) · L-07 secret scan of this folder run on its own: clean (structural patterns; no fingerprint file in /tmp);
design copies live under `build/`, none under `/tmp` · L-08/L-09 each planned case is one screen and state, one action per step; widths
split per dialog and per width · L-10 preconditions say only what is needed ("Sign in as an Admin", "Have …"), no who-to-ask · L-11 each
precondition is used by the steps or results (the line with no description in D-05/D-09/D-10 is what shows the prompt) · L-12 the drive's
start was checked (logs show discovery within 40 s; all four runs exited 0) · L-13 nothing called runnable from gate output: the cases
are not written yet · L-14 every planned case can be set up in the product by hand; the 4,000-byte and QuickBooks parts stay with
Phase A's behaviour cases · L-15 every "does not appear" check has a control on the same screen (D-01 typing clears the prompt; D-02 the
label is above; D-05 the filled Title; D-13/D-14 title and description still print) · L-16 checks say what is seen (colour, position,
order, exact words), never "looks right" · L-17 the plan follows the C665915 pattern; no Blocked line · L-18/L-19 not applicable before
a write.

## 9 · Facts for the other phases (not design-look work)

- **SV-11850** (27 Oct, Open): on staging, Build Lines in the ShopCoach Line Builder returns "Failed to parse work description into lines"
  and the UI shows nothing, for every input. It names WO S2-37674, Staging Heavy Duty - 9919, and says the builder is reached by typing a
  work description "in the ShopCoach Line Builder box" on the Lines tab; our live cases reach it by "Click New Line → Click AI SHOPCOACH
  LINE BUILDER". Phase A to settle the path. Every case through Build Lines (C154711, C154712, C549079, C549080; D-16, D-17) meets
  SV-11850's symptom on staging; whether it applies on sv10130 is not known from the sources.
- **Invoice layout switch** (fact from the invoice-ui-refresh project files, not a rule): Settings → Invoice → "Legacy invoice layout"
  toggle, off = Modern, on = Legacy; an invoice keeps the design it was created with. D-11 to D-14 name it "screen label to confirm".
- **Imports path** used by C549085: Settings → Data Import → Invoices (PRD: Administration → Invoices).
- PRD §3 still says "The line dialog writes that literal sentence when nothing was typed"; S3-R6 (v14) narrows it to Edit Line. Cases
  quote S3-R6 for how to make the placeholder (as D-13/D-14 do).
- The 37 live cases carry `custom_atmstatus` 1 (Not Automated) and `custom_automation_type` 2; none is flagged Automated (Rule 71: nothing to tell).
