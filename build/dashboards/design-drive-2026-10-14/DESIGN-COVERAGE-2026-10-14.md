# Dashboard design — coverage proof, 14 October 2026 (Rule 124 gates, protocol 21)

**Design:** claude.ai artifact **Wae9DFQ8PJQBy8mbLsL5ge "Dashboard v1"** (the canvas; QA lead: "Claude design (Must check
thoroughly)"), saved and unpacked today: `build/dashboards/sources/design-2026-10-14/`. **Spec:** PRD Confluence 788430850
**v44** (13 Oct 2026 18:37, read 100%) + PO decision 7 Oct 2026 (Chris Ward, Slack: grey "-", empty-chart placeholder,
real zeros stay). **Cases:** all 106 live cases of group 12166 (97 ours + 9 by another author), from
`currency-2026-10-14/snapshots-before/`. Nothing was written to TestRail, Jira, Confluence or Google; no ShopView build
was signed into. Design content was treated as data.

## Gate summary

| Gate | Result |
|---|---|
| Every file read (Rule 119) | **102 files / 100%** — 99 package files (50 board files, canvas.json, 48 screenshots with every word transcribed), board-files-md5.txt, artifact-page.html + artifact-raw.html (scripted) · `design-files-reading-2026-10-14.md` |
| One-click sweep, every board and the canvas | **Done** — canvas 437/437 elements hovered and clicked (169 forced), **0 failed, 0 missing**; 50/50 board files swept; 50/50 boards played and Export menu opened; dark + widths captured |
| Multi-step flows | **15 of 15 flows the design shows driven**; 8 flows the design does not draw are named (spec-only, covered by cases) · `FLOWS-2026-10-14.md` |
| Drags | None defined by the design — gate not applicable |
| Text inventory, zero unclassified | **648 rows, 0 unclassified** · `design-text-inventory-2026-10-14.md` |

## 1 · Change list — no changes since 7 October (proved by md5)

- All **99** files in `files/` are byte-identical to the 7 Oct copy `sources/design-po-empty-states-2026-10-07/canvas/`
  (`md5sum` of both folders, sorted, `diff` empty: 99 = 99). `board-files-md5.txt` matches `files/` exactly.
- `artifact-page.html` = `artifact-raw.html` = the 7 Oct page `full-update-2026-10-07/design-drive/page/Dashboard-v1-canvas.html`
  (md5 `e1d251aaba3cff37766f85fde296d04e`, 13,291,179 bytes, all three).
- Inside the page, the design record `appifact-doc` holds exactly the 99 files, each md5-identical to `files/`
  (48 PNGs base64-decoded), title "Dashboard v1", comments: none.
- **Change list: none.** Everything was driven again regardless (Rule 122).

## 2 · Files read

`design-files-reading-2026-10-14.md` lists every file with size, lines, method and coverage. In short:
- **50 board files (.dc.html, 2–5 KB each):** read in full. 49 share one `<style>` block (md5 `93ec71de…`, read once in
  01_Opens_After); each board's body was printed and read; Main.dc.html (own cover styles) read in full.
- **canvas.json:** read in full (50 artboards, positions, launch view "canvas").
- **48 screenshots:** every one viewed; `before-phone.png` (780×9014) viewed as 5 crops; **every on-screen word transcribed**
  into `image-transcriptions-2026-10-14.tsv` (286 rows).
- **artifact-page.html (13.3 MB):** README comment read; design record verified = the 99 files; the canvas-editor runtime
  (`appifact-app`, 1,987,971 chars, minified design-tool code) scanned 100% by script for user-visible strings (523, listed
  in `canvas-runtime-ui-strings-2026-10-14.json`, group-classified OUT-OF-SCOPE); 5 embedded fonts are the editor's icon
  fonts (anthropicons) per their `@font-face`.
- Also read in full: PRD v44 (524 lines), PRD diff v42→v44, PROJECT-STATE, the 7 Oct proof and logs, register D-1..D-10,
  protocol 21, Rule 124, the token charter. Case texts read by script (all 106).

## 3 · One-click sweep (Rule 124 3a)

| Run | Tool | Result |
|---|---|---|
| Canvas page | `drive_design_full.py --workers 2` (4,358 s) | **437** interactive elements; **437 hovered, 437 clicked**; 169 under another layer → hovered/clicked forced; **0 failed, 0 missing**; 1,212 interactions; 596 exposed new content (hover 115 + 49 forced, click 294 + 138 forced). 41 hidden text blocks never exposed: the page `<title>` "Dashboard v1" and 40 touch-only "Tap to load" (phone twin of "Click to load"). Light 768/1440/1920 + dark 1440 captured. Identical counts to 7 Oct |
| Canvas navigation | `drive_design_canvas.py` | 1 page; **50/50 boards seen and played**; 44/50 titles hovered (6 timed out → re-hovered separately, `title-hover-6.json`: no tooltip on any title, same as the other 44); zoom menu recorded; dark captured. **Its Export step failed on all 50** (canvas is CSS-transformed, buttons outside the viewport) |
| Canvas export/play supplement (Rule 121) | `scripts/canvas_export_play.py` (DOM clicks) | **50/50 boards: Export menu opened** (PNG 1× / PNG 2× with pixel sizes, PDF (.pdf), HTML (.zip), All artboards (.pdf) "All 50 artboards in order of canvas position"); **50/50 played** with light + dark screenshot and the board's frame text; **50/50 returned via Back to canvas**. Player controls each driven by real pointer: Pages (tooltip "Pages — add a page to this canvas", menu "Page 1 · 50"), Zoom (disabled in the player view), Fit (tooltip "Fit: at its own size, scaled down to fit — click to fill the window", toggles to "Fill"), Export (tooltip "Export this artboard", same five options), Read-only (label, no action) |
| 50 board files | `drive_design_full.py --serve`, one per board | 50/50 exit 0; **0 interactive elements on every board** (static heading, text, screenshot — nothing to click), 0 hidden text; **200 screenshots** (light 768/1440/1920 + dark 1440 per board) |

Evidence: `evidence/` (summaries, export/play records, player controls, per-board results). Screenshots stay in the
scratchpad (`out-canvasfull`, `out-canvasdrv/shots`, `out-exportplay/shots`, `out-boards/*/screenshots`).

## 4 · Flows (Rule 124 3c)

`FLOWS-2026-10-14.md`. The boards are screenshots, so each flow is a board sequence driven on the canvas in order.
**Driven: 15/15** (open on defaults · all on Last 12 Months · date range menu · Revenue open + hover · Billing / Tech
Efficiency / Tech Utilization open + month hover + legend hover · Sales by Customer open · At Risk open + window menu ·
4 reports shown / hidden / hovered (+ legend) · phone · empty states today → approved).
**Not driven because not drawn (named, each covered by cases from the PRD):** tile after Apply; the Advisor/Technician
filter lists opened; table next page; collapse and one-open-at-a-time switching; report-link tooltip and the report as
opened from a tile; the At Risk panel's own select opened; phone taps; loading/failed tiles and the product's dark theme.
**Drags:** none in the design.

## 5 · Text inventory (Rule 124 3b, the coverage proof)

Sources: `design_text_inventory.py` (51 files, 192 texts, 11 marked "in a case" — all 11 are the Main board's scope list,
reclassified DESIGN NOTE because their match came from the canvas cover, not a screen) + a lenient supplementary pass over
every board (34 texts the tool drops: single words, lowercase-with-digit, this/let/var/const) + all 48 screenshots
transcribed (291 rows after splitting) + sweep/canvas texts (128) + 3 PRD v44 rules with no case.
COVERED is decided against all 106 cases; a short label (≤20 characters) counts only on an exact-case whole-word match,
and coincidental matches (e.g. "4", "Date", "LABOR", zoom "200%") were rejected (Rule 110).

| Class | Rows |
|---|---|
| COVERED (with C-ids) | 117 |
| DESIGN NOTE (board captions, screenshot labels, canvas cover, calendar weekday header…) — each tied to the cases that test the behaviour | 211 |
| OUT-OF-SCOPE (Before · production screens; report tables and side menu unchanged by this project; global top bar; superseded "today" empty state; canvas-tool chrome) | 236 |
| DATA (sample names, amounts, dates, axis ticks) | 70 |
| SPEC-CONFLICT (PO questions) | 11 rows = 7 questions (3 already in the register + 4 new) |
| CASE-NEEDED | 3 |
| **Total / unclassified** | **648 / 0** |

Plus 523 canvas-runtime strings, one group, OUT-OF-SCOPE (design-tool chrome). Label check
(`design_label_check.py`, 38 quoted labels in the 106 cases' preconditions and steps): 7 not in design or spec — all
example values ("Range: 31 days", "1 - 10 of 69", "$… (12mo)", "Range: N days"), a negative check ("vs last period",
C88607), a tester note ("release note not found", C88632), and "No data for selected date range" in
[C433976](https://shopview.testrail.io/index.php?/cases/view/433976) — **another author's case (hands-off, Rule 38):
that text is in neither the design nor PRD v44; reported only.**

## 6 · SPEC-CONFLICT and CASE-NEEDED (detail and verbatim quotes: `TRIAGE-SPEC-CONFLICT-AND-CASE-NEEDED-2026-10-14.md`)

**SPEC-CONFLICT, already in the register (unchanged):** D-10 "Last updated: N minutes ago" vs S3-R1 (C88652) · D-4 At
Risk/Sales by Customer at zero (C351714, C351715) · D-3 second "Inactive for" select (C88628) · D-1 legend "avg"
(C351723, C351734).
**SPEC-CONFLICT, NEW:**
- **D-11** — approved row-15 drawing shows no report link on the Technician Efficiency and Technician Utilization tiles;
  S4-R1/S10-R1 require one on every KPI tile. Cases C88604, C88623, C88629, C351706–C351715 follow the PRD.
- **D-12** — board 02 note says At Risk revenue is measured "the way Sales By Customer does"; S5-R15 says "the way the
  Revenue tile measures revenue". Cases C88609, C88610, C88630, C88643, C88644 follow S5-R15.
- **D-13** (confirm only) — board 01 caption says At Risk opens on 120 days every visit; S5-R14 (and board 09) say the
  window is remembered. Cases C88610, C88615, C88618 follow S5-R14.
- **D-14** (spec silent) — expanded charts bridge months with no value with a dashed line; PRD defines gaps only for
  sparklines. No case written. Related chart cases C88621, C351719, C351720, C351724.

**CASE-NEEDED (PRD v44 rules added 13 Oct, no case cites them):** **S8-R5a** (table under the chart follows the filter;
design shows it on the Technician Efficiency/Utilization and Billing panels) · **S8-N1a** (table hidden when every
technician is unticked; not drawn) · **S4-R11a** (Revenue/count-tile empty buckets are points at 0; Revenue This Month
sparkline shows it). Nearest cases: C88619, C88649, C351717 · C88620 · C88606, C88647, C351706–C351708, C351713.
No case was written (Rules 6, 62, 123).

## 7 · Ready for build verification?

The design gates pass. The suite itself is **not** complete against PRD v44 until the 3 CASE-NEEDED rules get cases (QA
lead's go-ahead needed) — those come from the 13 Oct PRD change, not from the design. The 4 new PO questions join
D-1..D-10 and go out after build verification (QA lead, 7 Oct).
