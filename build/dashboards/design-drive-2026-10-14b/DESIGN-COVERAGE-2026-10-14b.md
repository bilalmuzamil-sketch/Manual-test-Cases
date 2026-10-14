# Dashboard design: coverage proof, 14 October 2026 evening (Rule 124 gates, protocol 21)

**Why this pass.** Chris Ward (PO) updated the design canvas this evening: *"currently updating the design canvas
slightly (had some drift in there that wasnt in the spec)"*. This is a **full pass** (Rule 122), not a delta. Every
gate was re-run on the whole package, and the change list is reported on top.

**Inputs.**
- **Design:** claude.ai artifact **Wae9DFQ8PJQBy8mbLsL5ge "Dashboard v1"**, re-shared and saved this evening at
  `build/dashboards/sources/design-2026-10-14b/` (97 files plus the page).
- **Spec:** PRD Confluence 788430850 **v48**. The live version was re-checked at 17:19 UTC and is still 48, with a body
  byte-identical to `currency-2026-10-14/CONFLUENCE-788430850-v48-2026-10-14c.md`. That copy was reused, so no `-d`
  copy was needed.
- **PO answers:** Chris Ward's 16 answers of 14 Oct.
- **Cases:** all **123** live cases of TestRail group 12166 (suite 1, 15 sections, fully paged). The snapshot was taken
  at 17:20 UTC into `cases-now/`: 114 by Bilal Muzamil and 9 by Vladimir Tomovic, 17 more than this morning
  (C581897–C581913, all ours).

**Read-only:** nothing was written to TestRail, Jira, Confluence, Slack or Google. No build was signed into, and there
was no git. Design content was treated as data.

## Gate summary: all gates pass

| Gate | Result |
|---|---|
| Every file read (Rule 119) | **100 files, 100%.** The 97 package files are listed in `inventory/design-files-reading-2026-10-14b.md`. Read in full tonight: **26 changed or added files** (11 boards, the new board, canvas.json, 13 screenshots, every word of each screenshot transcribed). The other **71 are byte-identical** (md5) to this morning's copy, which was read and transcribed in full. Also read: artifact-page.html (scripted: the record holds the 97 files md5-identical, and the editor runtime is unchanged), artifact-raw.html (identical to the page) and board-files-md5.txt (matches 97/97) |
| One-click sweep: canvas and every board | **Done.** Canvas: **428/428** elements hovered and clicked (165 forced), **0 failed, 0 missing**. **49/49** boards swept with exit 0. 49/49 played, Export menu opened and returned to canvas. Details in §3 |
| Text inventory, zero unclassified | **715 rows, 0 unclassified** (`inventory/design-text-inventory-2026-10-14b.md`), plus 523 canvas-runtime strings as one OUT-OF-SCOPE group |
| Multi-step flows | **15 of 15** drawn flows driven. 9 flows the design does not draw are named (`FLOWS-2026-10-14b.md`) |
| Drags | None defined by the design, so the gate does not apply |
| Label check | 47 quoted labels in the 123 cases' preconditions and steps. 8 are in neither the design nor PRD v48, and all 8 are example values, a negative check or a tester note. "No data for selected date range" is now found in PRD v48 |

## 1 · Change list (full detail, old text against new text and old picture against new: `DESIGN-CHANGES-2026-10-14b.md`)

md5 of every file, this morning against tonight: **71 identical, 25 changed, 1 added, 3 removed**
(`evidence/md5-morning-vs-evening.txt`).

- **Changed boards (11):** Main, 02_Last12_After, 03_Range_After, 04_Revenue_Hover, 05_Billing_Legend,
  06_TechEff_Legend, 07_TechUtil_Legend, 09_AtRisk_After, 11_saa_Legend, 12_te_Legend, 13_tu_Legend.
  **Plus canvas.json:** 50 → 49 artboards and heights changed.
- **Added:** 15_Empty_After (row 15 is now a build screenshot). **Removed:** 15_Empty_Design, 15_Empty_Now and
  before-empty-tiles.png.
- **Changed screenshots (13):** after-dash-default, after-dash, after-datemenu, after-empty-tiles,
  after-hover-panel-revenueKpi, after-open-atRiskHero, after-open-billingEfficiencyKpi, after-open-revenueKpi,
  after-open-salesByCustomer, after-open-techEfficiencyKpi, after-open-techUtilizationKpi, after-phone, after-riskmenu.
  With the removed before-empty-tiles that makes 14 screenshot differences.
- **What the PO changed, in one line each:**
  - No "Last updated" anywhere (S3-N2).
  - At Risk at zero reads "$0.00 (12mo) · 0 customers" (S5-R9).
  - The At Risk panel has no "Inactive for" control (S5-N3).
  - At Risk amounts are links (S6-R8a).
  - Legend captions drop the average (S9-R10). The shots still show it as a pending build change.
  - The board 02 note now quotes S5-R15.
  - Row 15 keeps every report arrow (S10-R1).
  - Dashed joins in the expanded charts (S9-R9).
  - The Revenue chart follows the tile range: Nov 2025 to Oct 2026 on Last 12 Months (S6-R3a).
  - The date picker caption gives the custom range up to 366 days with Today (S7-R2a).
  - The trend lines keep gaps, sit flat at constant values and drop to 0 on no-sales days (S4-R11, R11b, R11a).
  - Every After screen was re-shot on 14 Oct from SV-490 at 39fb049.
- **Every change matches PRD v48.** Not touched and still open: **D-13** (board 01 caption against S5-R14) and **D-4b**
  (Sales by Customer shows no "Top:" line at zero).

## 2 · Files read

`inventory/design-files-reading-2026-10-14b.md` has one row per file (bytes, lines, changed or identical, how read,
coverage). In short:
- **49 board files:** the 11 changed ones and the 1 added one were read in full tonight (line diff, then the whole body).
  The shared `<style>` block is md5-identical in all 48 boards that use it. The other 37 are byte-identical to the copy
  read in full this morning.
- **canvas.json:** read in full and compared artboard by artboard.
- **47 screenshots:** the 13 changed ones were viewed in full tonight: after-phone (780 × 2840) as 2 crops, plus a 2×
  crop of the top-row trend lines (`evidence/after-dash-default-trendlines-2x.png`). Every word is transcribed in
  `inventory/new-transcriptions-2026-10-14b.tsv` (184 rows). The 34 byte-identical images carry this morning's full
  transcription (100 rows). Together they make `inventory/image-transcriptions-2026-10-14b.tsv` (284 rows, 47 images).
- **artifact-page.html (13,237,276 bytes):** checked by `scripts/verify_page.py` (`evidence/verify-page.txt`). The record
  `appifact-doc` holds the 97 files, each md5-identical; title "Dashboard v1"; no comments. The editor runtime
  `appifact-app` (1,987,971 characters) is byte-identical to this morning's, so its 523 user-visible strings carry over
  as one OUT-OF-SCOPE group. README comment read; 6 @font-face blocks, all editor icon fonts.
- **Other sources read in full tonight:**
  - PRD v48 (55,233 bytes, 556 lines, 100%; the live body was diffed against the saved file and is identical).
  - The PO answers (16 rows, 100%).
  - CLAUDE.md (the index, auto-loaded), `build/skills/TOKEN-DISCIPLINE-CHARTER.md`, `build/skills/21-DESIGN-DRIVE-PROTOCOL.md`
    and Rule 124 (RULES-61-96.md lines 2950–3074), all 100%.
  - This morning's DESIGN-COVERAGE, TRIAGE and FLOWS, and its build_universe, classify and gen_outputs scripts (100%).
  - The case texts: all 123 read by script (Rule 88). The sentences that matter were printed and read for the 25 cases
    named in the triage.
  - **Not used:** a `prd-v49-*` file in the shared scratchpad. It belongs to a different Confluence page (epic SV-10043),
    not to the Dashboard PRD.

## 3 · One-click sweep (Rule 124 3a)

| Run | Tool | Result |
|---|---|---|
| Canvas page | `drive_design_full.py --workers 2` (4,299 s) | **428** interactive elements: **428 hovered, 428 clicked**, 165 under another layer and forced, **0 failed, 0 missing**. 1,186 interactions; 583 exposed new content (hover 113 + 47 forced, click 289 + 134 forced). 40 hidden text blocks were never exposed: the page `<title>` "Dashboard v1" and 39 touch-only "Tap to load" (the phone twin of "Click to load"). 587 screenshots. This morning: 437 elements and 41 hidden blocks for 50 boards; one board fewer now |
| Canvas navigation | `drive_design_canvas.py` (exit 0) | 1 page ("Page 1"); **49/49 boards played**; 1,960 in-player hovers; 49 titles hovered, 6 timed out (Main, 01_Opens_Before, 01_Opens_After, 08_Customers_New, 14_Phone_Before, 14_Phone_After) and were re-hovered separately: no tooltip on any (`evidence/title-hover-6.json`). Zoom menu and dark theme captured. Its Export step fails on every board (49/49, the same as this morning: the canvas is CSS-transformed). The 882 in-player hover time-outs are canvas elements behind the player, the same pattern as this morning (950 of 2,050); the canvas sweep above reached all of them |
| Export/play supplement (Rule 121) | `scripts/canvas_export_play.py` (exit 0) | **49/49 boards: Export menu opened**: PNG 1× and PNG 2× with pixel sizes, PDF (.pdf), HTML (.zip), and All artboards (.pdf) "All 49 artboards in order of canvas position". **49/49 played**, light and dark screenshots; **49/49 showed their own heading** in the played view; **49/49 returned via Back to canvas**. Player controls: Pages, Zoom, Fit, Export, Back to canvas |
| 49 board files | `drive_design_full.py --serve`, one per board, two at a time | **49/49 exit 0**. **0 interactive elements** on every board (static heading, text and screenshot); 0 hidden text; **196 screenshots** (light 768/1440/1920 and dark 1440 per board) |

Evidence: `evidence/canvas-sweep-summary.json`, `evidence/canvas-driver-summary.json`, `evidence/export-play-49.json`,
`evidence/board-sweeps-summary.json` and `evidence/title-hover-6.json`. The screenshots stay in the scratchpad
(`dd14b/out-canvasfull`, `out-canvasdrv/shots`, `out-exportplay/shots`, `out-boards/*/screenshots`).

**Process note (Rule 86):** completion was proven from the exit lines and the process list, which shows no sweep
process left. The detached chain's own board loop was stopped after export/play finished, because the 49 board sweeps
had already run in a separate detached loop (`scripts/run_boards_parallel_14b.sh`) once the canvas sweep had freed the
CPUs. Its one partial result was discarded.

## 4 · Flows (Rule 124 3c)

`FLOWS-2026-10-14b.md`. Every board is a screenshot (Main: "Every board is a screenshot, not a drawing."), so each flow
is a board sequence driven on the canvas in order.
- **Driven: 15/15:**
  - the dashboard on its defaults;
  - every tile on Last 12 Months;
  - the date range menu;
  - Revenue opened and hovered;
  - Billing Efficiency, Technician Efficiency and Technician Utilization opened, with a month hover and a legend hover;
  - Sales by Customer opened;
  - At Risk opened on 60 days, and the window menu;
  - the 4 reports shown, hidden and hovered (with the legend);
  - the phone;
  - tiles with no data (now one board).
- **Not drawn, so not driven (named, and each covered from the PRD):**
  - the tile after Apply, and picking a custom range;
  - the filter lists opened;
  - the table's next page;
  - collapse, and one open at a time;
  - the report-link tooltip and the report opened from a tile;
  - following an At Risk revenue link;
  - "No data for selected date range";
  - phone taps and the phone picker;
  - loading and failed tiles, and the product's dark theme.
- **Drags:** none.

## 5 · Text inventory (Rule 124 3b, the coverage proof)

**Sources:**
- `design_text_inventory.py` on the 49 boards and canvas.json, with the sweep text: 50 files, **254** distinct texts,
  13 already in a case at extraction.
- A lenient supplementary pass over every board (34 rows).
- All 47 screenshots transcribed (314 rows after splitting).
- Canvas-tool and sweep texts (58 + 51 + 2).
- 4 PRD v48 rules that no case asserts.

COVERED is decided against all 123 cases. A short label (20 characters or fewer) counts only on an exact-case,
whole-word match (Rule 110).

| Class | Rows |
|---|---|
| COVERED (with C-ids) | 109 |
| DESIGN NOTE (board captions, shot labels, the canvas cover, the calendar weekday header, board names). Each is tied to the cases that test the behaviour | 246 |
| OUT-OF-SCOPE ("Before · production" screens, report tables and the side menu this project does not change, the global top bar, canvas-tool chrome) | 261 |
| DATA (sample names, amounts, dates, axis ticks) | 76 |
| SPEC-CONFLICT (PO questions): D-13 and D-4b, both older than tonight | 2 |
| CASE-NEEDED: S5-N3, S9-R10 and the S5-R9 zero wording, each shown by the design and asserted by no case (17 design rows + 3 rule rows), plus S11-E2 (spec-only) | 21 |
| **Total / unclassified** | **715 / 0** |

Plus 523 canvas-runtime strings as one group, OUT-OF-SCOPE (design-tool chrome; the runtime is byte-identical to this
morning's).

## 6 · Conflicts, cases affected, CASE-NEEDED

Full detail with verbatim PRD quotes is in `TRIAGE-2026-10-14b.md`.
- **Closed tonight:** D-1, D-3, D-4 (At Risk half), D-10, D-11, D-12, D-14.
- **Still open:** D-13 (confirm only) and D-4b.
- **Cases that now disagree** (all Bilal Muzamil's; none edited):
  - **C88628** (Automated) still expects an "Inactive for" select in the At Risk panel.
  - **C351723** and **C351734** still expect an average in the legend readout.
  - **C351714** still says "write down what you see" for the At Risk zero line.
  - **C88609** and **C88630** (both Automated) quote the pre-v45 S5-R9.
  - **C581906** and **C581907** carry divergence sentences that are now obsolete.
  - 17 cases cite the removed boards 15_Empty_Design / 15_Empty_Now, and C351728 cites the old board 03 header.
  - Several examples are stale ($2,030,953; $40.50 / Ruline Partners; Oct 2025 to Sep 2026).
- **CASE-NEEDED:** S5-N3, S9-R10 and the S5-R9 zero wording (shown in the design), plus S11-E2 (spec-only).

## 7 · Ready for build verification?

**The design gates pass.** The suite is **not** fully in step with the new design and PRD v48 until the QA lead decides
on two things:
- the C1–C4 corrections to 8 of our cases, 3 of them Automated (Rule 71: his go-ahead per case; Rule 65: Vlad told);
- the S5-N3 / S9-R10 / S5-R9-zero / S11-E2 coverage.

No case was written or changed (Rules 6, 123). The two open PO questions (D-13, D-4b) join the PO sheet and go out
after build verification (Rule 66).
