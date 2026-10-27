# Part Lifecycle — design drive proof, 27 Oct 2026 (Phase D, first part; DRAFT)

Rules 115, 119, 120, 122, 124 (as amended 9 Oct), 126, 130, 133; skill 21 §§2–6d; lessons L-01 to L-19.
Design: canvas artifact https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE "Parts Lifecycle Update". Working copy
`sources/design-2026-10-13-artifact/` (re-read 27 Oct: all 53 files have the same md5, `sources/design-2026-10-27-artifact/`).
Draft only: nothing written to TestRail, Jira, Slack or Google; no commit. Last design drive before this one: 13 Oct 2026
(same files); re-driven today because the full pass requires it (Rule 122).

## 1 · Reading coverage (Rule 119)

| Source | Size | Read | Coverage |
|---|---|---|---|
| PRD v33, `sources/CONFLUENCE-829227015-PartLifecycle-v33-2026-10-27.md` | 82,341 B, 786 lines | lines 1–786 | 100% |
| Tech plan 7 Oct, `sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md` | 135,715 B, 1,130 lines | lines 1–1,130 | 100% |
| 46 board images of the target pages (`png/`, 1.1–7.2) + board 4.0 | 47 PNG, 5.87 MB | every image viewed by me on 27 Oct | 100% |
| 4 Before boards (`*Before.dc.html`; 1.0 and 3.0 share PartDialogBefore) | 47,368 B | rendered to `renders/` and viewed; HTML text read by the inventory tool | 100% |
| Board 2.6 HTML (redrawn table over the screenshot) | 155,407 B (5,460 B without the image) | read in full; rendered and viewed (`renders/correct-06-…png`) | 100% |
| The other 46 `*.dc.html` board files | 0.2 MB each | each holds one embedded PNG (md5 = the `png/` file, checked by script: 47/47) plus a title | 100% |
| `canvas.json` | 30,781 B, 979 lines | 7 pages, 52 artboards, 59 notes, launch: every field dumped and read | 100% |
| favicon-32x32.png | 1,996 B | an icon | 100% |
| 8 Oct board transcript (our own, used as the transcription base) | 141,599 B, 1,614 lines | checked board by board against each image while viewing; 7 changes applied (`inventory/BOARD-TRANSCRIPTION-2026-10-27.md` header) | 100% of the sections used |
| Jira stories edited 23 Oct: SV-10814, SV-10817, SV-10818, SV-10819, SV-10820, SV-10822, SV-10823, SV-10826 | 8 descriptions | read in full (Atlassian, 27 Oct) | 100% |
| SV-10815, SV-10816, SV-10821, SV-10824, SV-10825 | — | status and last-updated read (8–9 Oct, unchanged since our 14 Oct copies); descriptions not re-read in this phase (Phase A reads every ticket, Rule 129) | metadata only |
| SV-10380 (updated 27 Oct 03:53), SV-11756 (26 Oct) | 2 descriptions | read in full | 100% |
| Rules 113–117 (all amendments), 118–138; lessons register; skills 21 and IDEAL-TEST-CASE-STANDARD headers | — | read | 100% of the named rules |
| Live case read-backs `update-2026-10-14/applied/` | 281 cases (274 stay, 7 of the 12 retire set present) | scripted: plain text of all 274 to `inventory/cases-live-plain.tsv`; titles of all 274 and the results of 22 look cases read | scripted, never bulk-read |

Not read by me in this phase: SV-11038 … SV-11046 (developer check lists) and the epic SV-10647 body; no design-look content is
expected there, Phase A reads them (Rule 129). Named here so it is not silently left out.

## 2 · The drive — the canvas through its own navigation (Rule 120)

| Pass | Tool | Result |
|---|---|---|
| Canvas drive at 1440×900 | `drive_design_canvas.py` (`drive/run2/canvas/`) | 7 of 7 pages selected · 51 boards seen and hovered · 51 of 51 played · 153 play-mode control hovers · 51 of 51 Export menus opened · 59 notes recorded · zoom opened · dark theme captured · 0 errors |
| Canvas drive at 1536×900 | same (`drive/run2/canvas-1536/`) | identical counts, 0 errors |
| One-click sweep at 1440×900 | `drive_design_full.py --serve` (`drive/run2/sweep/`) | 64 elements: 64 hovered, 64 clicked · 26 hover-exposed · 54 click-exposed · 30 hover style changes · 0 occluded · 0 failed · 0 missing · 84 screenshots |
| One-click sweep at 1536×900 | same (`drive/run2/sweep-1536/`) | identical counts, 0 failed, 0 missing, 84 screenshots |
| Direct renders | Playwright (`renders/`) | board 2.6 with its redrawn table; the 4 Before boards |
| Visual tool | `design_visual_inventory.py`, 51 board files × 1440/1536 (`inventory/visual-tool/`) | 51 states, 0 fatal, 74 rows (only the Before boards and the 2.6 table carry DOM) |

Run 1 (12:28) failed at start-up: Python Playwright was not installed in this container. Installed (`playwright==1.56.0`, matching
the pre-installed Chromium 1194) and re-ran everything from scratch as run 2; run 1's empty folders are kept, marked
`run1-failed-no-playwright.DONE`.

**Never exercised, with the reason:**
- **Board 3.0** ("Before: no status on the part today"): the canvas draws no image in its slot on page 3 (`canvas/shots/page-3.png`:
  only its notes show), so the driver could not play it. Its file is PartDialogBefore.dc.html, the same file as board 1.0, which was
  played; I rendered and viewed that file directly. It is a Before board (today's screen), not a target.
- **Fit / Back to canvas clicks inside a played board, and picking an Export format**: canvas chrome, identical on every board;
  a format only downloads the same image already viewed.
- **Notes**: 59 sticky notes are `pointer-events: none`; nothing to hover or click. All 59 read.

**Flows (Rule 124 amendment 1(c)).** The design is a canvas of static screenshots (its own notes: "Boards 1.1 to 1.6 are
screenshots of the build"): no prototype state, no drag, no in-board menu. Every flow is a left-to-right board sequence per page;
all 7 pages and every board on them were played in order at two widths. Flows not driven: none.

## 3 · Text inventory — the coverage proof (`inventory/TEXT-INVENTORY-2026-10-27.md` / `.json`)

`design_text_inventory.py` over the design files (193 texts: board titles, page names, notes, Before-board HTML, the 2.6 table) plus
the hand transcription of every board image (the 14 Oct list of 663 strings, re-checked against each image today, plus 7 texts it
lacked). Matched against the **274 live cases that stay** (the 12 "Retire OR retest" cases excluded, so nothing counts as covered by
a case about to be deleted).

| Class | Rows |
|---|---|
| In a live case | 193 |
| DATA (example records, dates, amounts, glyphs) | 351 |
| COVERED (named C-ids or the case template) | 52 |
| CASE-NEEDED (a planned "Design: …" case, D-key named) | 61 |
| OUT-OF-SCOPE (Before boards, unchanged screens, page introductions, design-tool chrome) | 115 |
| SPEC-CONFLICT (DV-02, DV-03, each with a drafted question) | 2 |
| SUPERSEDED (8 Oct wording the 13 Oct boards replaced) | 2 |
| NOT DESIGN TEXT (our own change-note phrases in the old list) | 7 |
| **Unclassified** | **0** |
| Total distinct | 783 |

38 rows that were "in a case" on 14 Oct no longer match a live case (mostly single characters; the rest were matched through the
retired cases' setup docs). Each was re-classified (glyph DATA, unchanged chrome OUT-OF-SCOPE, or a named case).

## 4 · Visual inventory (`inventory/VISUAL-INVENTORY-2026-10-27.md` / `.json`)

193 rows: 74 from the tool (Before boards → OUT-OF-SCOPE; the 2.6 table → D-33) and 119 by hand from the images (`visual_rows.py`:
every icon, chip, pill, tag, toast, tooltip and its position, button colour, divider, column order, empty state, frame and width).
By class: CASE-NEEDED 122 · OUT-OF-SCOPE 67 · SPEC-CONFLICT 2 · DATA 1 · COVERED 1 · **unclassified 0**.

## 5 · Both directions (Rule 130)

**PRD v33 → design, by tool** (`spec_to_design_check.py` over the transcription and the 2.6 file; raw `inventory/spec-to-design-raw.json`):
69 PRD words the design does not show (4 only in other letter case). Every one is in `DESIGN-DIVERGENCE-ROWS.json`: 65 DESIGN-SILENT
(the design draws no screen or state with them: export, permissions page, hover texts, refusals, Part Library window, toasts for other
outcomes, the 1-part wording), 3 shown with other example data or as a fragment (S7-R9, S10-R9, S7-N5 a definition). Letter case:
"Activated" appears only inside "Deactivated" (the Activated entry is not drawn) and "the same number" is PRD prose.

**Design → PRD, every dialog, menu, message and empty state by hand:**

| Design element (board) | Title / rows / buttons in order, as drawn | PRD v33 | Result |
|---|---|---|---|
| Actions menu (4.1) | Cycle count · Deactivate parts · Export | S2-R2 between Cycle count and Export | same |
| Actions menu in mode (4.8) | Export | S2-R10b only Export | same |
| Bulk bar (4.2, 4.3, 4.6, 4.9) | badge · "selected" · divider · Deactivate/Activate · X at right | S2-R7b, S2-R9, S3-R2 | same |
| Deactivate parts? (4.4) | title + X · "2 parts selected." · 3 lines · Note (Optional) · Cancel · Deactivate (red) | S10-R3/R4/R5/R10/R11; §4 "A title, a message, an optional note, Cancel and a confirm button." | **extra X → DV-01** |
| Activate parts? (4.7) | title + X · count · 2 lines · Note · Cancel · Activate (blue) | S10-R8/R11 | **extra X → DV-01** |
| Deactivate part? (3.3) | title + X · number + description · 3 lines · Note · Cancel · Deactivate | S10-R4/R6/R11 | **extra X → DV-01** |
| Activate part? (3.7) | title + X · number + description · 1 line · Note · Cancel · Activate | S10-R7 ("and nothing more" is about the lines; S10-R10 gives every confirmation the note) | **extra X → DV-01**; note field consistent |
| New Inventory Part (1.1) | fields in S13-R4 order, no Part Status, Cost, no Delete Part; Cancel · Save | S13-R1/R4/R6/R10 | same |
| Edit Inventory Part (2.1, 3.1) | pill + X · fields in S13-R4 order · Delete Part (left) · Cancel · Save | S13-R3/R4/R6–R9 | same |
| Required errors (1.2) | 4 inline messages at once (Description, Part number, Category, Cost) | S7-N1/N2; §8 inline; note: Category and Cost as today | same |
| Other-locations text (2.2) | one line under each field | S13-R12/R16 | same (orange colour: design-only) |
| Toasts: linked (1.4), duplicate (1.5), status (3.4), bulk (4.5), canned (6.5) | green/red/orange, icon, text, Close | §8 types; error toasts fade after 3 s, warning stays | same (Close is the app's own toast control; fade cannot be drawn) |
| Tooltips: tracking (5.1), 200 limit (4.9), description (4.3) | dark grey box below the host | S4-R3, S2-R8a; description tooltip existing | same (position design-only) |
| Empty states: Inactive (4.10), no match (3.4), lookup (6.2) | as drawn | S1-N1, S1-N2, S9-R1 note | same |
| Lookup inactive line (6.3) | one line, no special-order row | S9-R16 | same |
| Part Library page (7.1) | toolbar without create; bulk ⋮; columns | S11-R1/R4/R5 | same |
| Entry page (7.2) | card with pencil, Parts table, no Delete | S11-R3 | same; **note on the board says "edited and deleted" → DV-02** |
| Part History (2.4, 2.6, 3.8, 5.5) | card, table, search | S10-R20/R21/R25/R27 | same; **2.6 wraps long events, tech plan cuts them off → DV-03** |

## 6 · Divergences and questions (`DESIGN-DIVERGENCE-ROWS.json`, `QUESTIONS-DESIGN.json`)

| Key | Difference | Held design-version case | Question | Sent? |
|---|---|---|---|---|
| DV-01 | Every status confirmation draws a close X; the PRD lists title, message, note, Cancel, confirm button only (story SV-10823 UI/UX says the same) | D-49 | DQ-01 | **not sent** (draft; Phase D makes no Google writes) |
| DV-02 | Board 7.2's note says the entry page can delete; S11-R3 says the page has no Delete (the picture agrees with the PRD) | none (the board shows no Delete) | DQ-02 | **not sent** |
| DV-03 | Long Part History events: design wraps (2.6), tech plan cuts off with an ellipsis; PRD silent | D-33 | DQ-03 | **not sent** |

**Unsent question count: 3.** Rule 126 point 6 / Rule 130 require 0 before the suite is called complete: the coordinator adds them to
the Part Lifecycle question sheet for Chris Ward (Rule 131: same sheet, new rows at the bottom, new colour) and to
`build/PO-QUESTIONS-OPEN.md` (Rule 132). Until then the register's three hand rows read QUESTION-READY (open). `spec_to_design_check.py`
with this register: 69 PRD-word rows, 0 open, exit 0 (it checks only the PRD-word rows; the three hand rows are open until sent).

## 7 · Skill 21 §6d checklist (Rule 133)

| # | Line | Ticked by |
|---|---|---|
| 1 | Every screen and state drawn has a "Design: … looks as in the design" case with its board | D-01 … D-42; board → case table in DESIGN-CASE-PLAN.md: 46 of 46 target boards have a case (4.0 used for the column set) |
| 2 | Every menu, dialog, tooltip, toast, prompt, empty state listed row by row against the PRD | §5 table above |
| 3 | Every label letter for letter | spec_to_design_check (letter case on) + §5; no case difference found on a drawn label ("Total Qty", "Avg Cost", "Part Library", "Note (Optional)", "Add Bin Location" all match) |
| 4 | Every design behaviour that differs has a held case and a SENT question | held D-49, D-33; DQ-02 needs no case. **Questions drafted, not sent → line open until the coordinator sends them** |
| 5 | Both directions | §3–§5 |
| 6 | Sizes, spacing, colours, icons, column order, 1440 and 1536 px, no overlap or truncation | D-01, D-07, D-11, D-14, D-20, D-30 (colours/icons/order); D-43 … D-46 (1440/1536); design drawn at 1600 px light theme only |
| 7 | Every PRD look sentence has a design case | S1-R8 D-01 · S2-R2 D-05 · S2-R4/R7/R7a/R7b/R9 D-07 · S3-R2 D-09 · S4-R2/R3/R4 D-14, D-27 · S9-R12 D-39 · S9-R13 D-40 · S9-R14/S13-R3 D-20, D-21 · S10-R9/R11 D-11, D-24 · S13-R2/R5–R9 D-14, D-20 · S10-R21 D-33 · S11-R3 D-42 · S11-R9 D-47 · S9-R21 D-48 · S9-R18 grey tag in global search (no board): C425742 · S2-R7a dark theme (not drawn): C425595 |
| 8 | Written down | this file, DESIGN-CASE-PLAN.md, DESIGN-DIVERGENCE-ROWS.json, both inventories |

## 8 · Lessons register, applied

L-01 look covered (49 design cases, visual inventory) · L-02 both directions, the dialogs' rows and buttons compared (found DV-01's
extra X) · L-04 exact letter case · L-05 §6d run · L-06/Rule 134 n/a here (no case rewritten in Phase D; the plan names which live
cases share each look item so Phase A–C rewrite them whole) · L-07 no secrets touched; the design copy lives outside `/tmp`; the tool's
37.7 MB `_work_package` duplicate of the design was removed · L-08/L-09 each planned case is one screen and state, one action per step,
split by board where independent (widths split 1440/1536) · L-10/L-11/L-14 plan checks only what a tester can see in the product;
preconditions to be "Open board <n>" plus the records the screen needs · L-12 the drive's start was checked (run 1 failure found within
minutes and re-run) · L-13 nothing called runnable from gate output: the cases are not written yet · L-15 the two "does not appear"
style checks (D-03 no icon, D-42 no Delete) each sit beside a visible control on the same screen · L-16 checks say what is seen (colour,
position, order, words), never "looks right" · L-17 the plan follows the C665915 pattern · L-18/L-19 not applicable before a write.

## 9 · Facts for the other phases (not design-look work)

- Stories edited 23 Oct still lag PRD v33: SV-10814 has no S1-E1; SV-10818 no S5-E1a; SV-10819 no S6-R1a; SV-10820 S7-R6c reads
  "keeps its own category" (v33: an entry with no category takes the dialog's); SV-10822 has no S9-R21/S9-R22, its S9-E11 still
  names the dashboard, its S9-N3a is absent; SV-10823 S10-R22a is the older wording; SV-10826 has no S13-N1a/S13-N1b. Live case
  C425673 "A linked entry keeps its own category" needs the v33 S7-R6c wording (Phase A).
- SV-10380 was updated today (27 Oct 03:53): its table now gives +5 and −2 → 3 / $30 (the 14 Oct open item 7 asked about "5 Available").
- Board 5.5 (a build screenshot) shows "Manufacturer updated | Original Manufacturer: - | New Manufacturer: -"; kept for build verification.
