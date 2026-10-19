# Design review — Splitting Sales Representatives (19 Oct 2026)

Feature: Splitting Sales Representatives (epic SV-10890). PO: Chris Ward. No build exists; nothing here is build-verified.
Design: Claude artifact https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm, export
`sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html` (10,541,251 bytes, md5 `d26eb330…`).
Compared against: PRD Confluence 919928833 **v8** (14 Oct 2026, `sources/CONFLUENCE-919928833-v8-2026-10-19.txt`).
Method: skill 21 §1–5 and §4b, Rules 115, 119, 120, 124, 126; lesson L-01 applied (the look is inventoried, not only the words).

## 1 · Reading coverage

| Source | Size | Read |
|---|---|---|
| Design export: `canvas.json` (pages, 68 board titles, 74 notes) | 36,001 B, 1,239 lines | 100% |
| Design export: 68 board files (`*.dc.html`, one PNG each) | 7.9 MB | every non-image line 100% (one shared template, proven by script); **every one of the 68 images viewed** (full or changed-region crop after a pixel diff proved the rest identical — per-board table in `design-files-reading-2026-10-19.md`) |
| Design export: favicon | 1,996 B | viewed |
| Canvas editor runtime inside the export (CSS 484,974 B + JS 1,988,038 B) | 2.47 MB | script-scanned for every feature term, 0 design hits; **not read line by line — needs the QA lead's OK (see Outstanding)** |
| PRD v8 plain text | 42,356 B, 315 lines | lines 1–315, 100% |
| Skill 21, Lessons register, worker brief | — | 100% |

## 2 · What the design is, and its pages

An **image-only design canvas**: 6 pages, 68 artboards; every artboard is one screenshot (1600×1000, phone 390×844 at 2×,
two export pictures). Boards marked "Before" are production today; the rest show the build. Inside a played board there is
nothing to click (0 clickable elements on all 68, logged), so "driving" means using the canvas's own navigation (pages menu,
Zoom, Play, Export) and walking each flow board by board.

| Page (canvas name) | Boards | PRD story that cites it |
|---|---|---|
| 1. Work order card: one rep, add, remove | 20 (1.0–1.19; 1.0, 1.1, 1.18 Before) | Stories 1, 2, 6 (Story 7 says "Design: none", yet 1.18/1.19 show the log) |
| 2. A customer's reps: Edit Customer and New Customer | 19 (2.0–2.18; 2.0–2.2 Before) | Story 4 |
| **3. A part sale's rep** | 5 (3.0 Before, 3.1–3.4) | **No story cites page 3.** It shows the part sale card's one Sales Representative field, which belongs to Part Sales Update v1 (SV-10266) and is unchanged here (PRD S2-N2 and its context note) |
| 4. Sales By Representative report | 13 (4.0–4.3 Before, 4.4–4.12) | Stories 5, 8 |
| 5. Sales By Customer: the filter name | 3 (5.0 Before, 5.1, 5.2) | Story 8 |
| 6. On a phone | 8 (6.0, 6.1 Before, 6.2–6.7) | Story 3 |

There are no other pages. No board shows: the printed work order (Story 6 cites page 1, but page 1 has no printout), the
"(Inactive)" name, an error after a failed save, the collapsed phone card, the customer window on a phone, "Sales Type: None"
/ "Empty export", Sales By Customer exports or its "No sales" wording, the Sales Representative Assignments export, keyboard
focus. For those the PRD is the only source (question Q9).

## 3 · Pages and states reached (canvas drive, Chromium + Playwright, `tools/drive_canvas*.mjs`)

Log: `canvas-drive/canvas-drive.jsonl` (152 records), summary `canvas-drive/canvas-drive-summary.json`. Page load: 0 errors.

| Action | Result | Screenshot(s) |
|---|---|---|
| Load at 1440×900 | canvas opens on page 1 | `screens/canvas-initial-1440.png` |
| "6 pages" menu | 6 pages listed with board counts 20/19/5/13/3/8 | `screens/canvas-pages-menu-open.png` |
| Each page via the menu, Zoom → Fit artboards | all 68 titles and all 74 notes present in the page | `screens/canvas-p1…p6-overview-fit.png` |
| Zoom menu | Fit artboards, 25%, 50%, 75%, 100%, 150%, 200%; 100% tried | `screens/canvas-zoom-menu-open.png`, `screens/canvas-p1-zoom-100.png` |
| Hover "Read-only" | tooltip: the view cannot save (viewer runtime) | log |
| Hover every board title (68) | no tooltip on any title | log |
| **Play every board (68)** | each opens full-screen with "6 pages · Zoom · Fit · Export · Back to canvas"; 0 clickables inside; hovering the picture shows only the file name | `screens/p1-1.00-…png` … `screens/p6-6.07-…png` (68 files) |
| Export menu (one per page) | PNG 1×, PNG 2×, PDF, HTML (.zip), All artboards (.pdf) "All N artboards" | `screens/canvas-p1-export-menu-open.png` |
| Real export (board 1.12, PNG 1×) | file `card-12-n1-two@1x.png`, 242,851 bytes | log |
| Dark colour scheme | only the canvas chrome turns dark; boards are pictures, unchanged | `screens/canvas-dark-p1-overview.png`, `screens/canvas-dark-play-1.12.png` |
| Phone width 390 (touch) | canvas usable; page 6 and board 6.6 | `screens/canvas-phone-390-*.png` |
| 1536 width | boards 1.10 and 4.10 | `screens/canvas-1536-play-*.png` |
| Detail crops (native / 2×) | card states, tooltips, menus, customer window, part sale card, clipped Shop Supplies column | `screens/zoom/*.png` (10 files) |

## 4 · Text inventory (`design-text-inventory-2026-10-19.md` / `.json`)

1,370 rows, **0 unclassified**: canvas texts 148, hand-verified on-screen texts 147, distinct OCR lines of all 68 images 1,075.

| Class | Rows |
|---|---|
| SAME (PRD says it) | 192 |
| DESIGN-ONLY | 392 |
| SPEC-CONFLICT | 3 (Shop Supplies on a Parts row; Shop Supplies on part sale rows; phone note "At rest the rows read as plain text") |
| DATA | 783 |

The repo tool `design_text_inventory.py` was also run on the unpacked files (`repo-tool-run/`): it finds the 138 canvas texts
only (the boards are pictures); all 138 are in the inventory above.

## 5 · Visual inventory (`design-visual-inventory-2026-10-19.md`)

70 rows (60 screen/state rows + 10 rule-like sentences from the notes), **0 unclassified**: CONFIRM 52, DESIGN-ONLY 8,
rows touching a conflict 9 (5 distinct conflicts), GAP 1. `design_visual_inventory.py` needs a DOM and cannot run on
picture boards; sizes were measured from pixels instead (`tools/measure_card.py` and scans; 1 image px = 1 CSS px).

Key measured facts: field box 44 px tall, 16 px between fields, label pitch 60 px (S1-R6 ✓); + and x buttons 32 × 32 px
(S2-R1/S2-R8 ✓); icons 20 px Lucide (glyph 14 / 12 px); arrow centred with one field, on the name line with two (S1-R11 ✓);
box to button gap 22 px on the work order card (S1-R5 says 16 — C5) but exactly 16 px in the customer window; tooltips
centred below the button; + menu below the button, right-aligned; list same width as the field, 48 px rows.

Numbers on the report boards were recomputed by hand: every summary row equals the sum of its invoice rows, every subtotal
equals Labor + Parts + Shop Supplies + Adjustments, totals $4,103.49 = $1,314.68 + $2,788.81; S1-12's whole-invoice
amount ($94.35) splits $83.32 / $11.03 in proportion to $1,928.00 : $255.15 (S5-R6 ✓); Margin % on every CSV/PDF row
agrees with Margin ÷ (Subtotal − Shop Supplies). All consistent.

## 6 · SPEC-CONFLICTs (design vs PRD v8)

| # | Topic | Design shows (where) | PRD v8 says (verbatim) |
|---|---|---|---|
| **C1** | Shop Supplies on a work order's **Parts** row | "$0.0…" on screen (4.5, 4.10, clipped), "0.00" in the CSV (4.11), "$0.00" in the PDF (4.12) for Devon's S1-12 Parts row. The note for 4.12 itself says "An empty side shows a dash." | S5-R15: "On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero." · S5-R23: "In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF." |
| **C2** | Order of names in the customer window list | "Unassigned, Dylan Rush, Christian Wallace, Jason Garrison" (2.4, 2.11) — not A–Z. The canvas says the customer window's test data shows login names, while the card shows staff names | S4-R3: "Its dropdown starts with "Unassigned", followed by every staff member whose Sales Representative switch is on and whose account is active, sorted by first name, then last name, A to Z, as on the work order (S1-R8)." |
| **C3** | Dropdown arrow on a phone at rest | No box and no arrow at rest (6.2 one field, 6.6 two fields); note 6.6: "At rest the rows read as plain text." | S3-R4: "Nothing in the fields or the buttons depends on hover. On a touch screen the Sales Representative fields always show their dropdown arrow, as the + and remove x buttons always do." |
| **C4** | Shop Supplies on a **part sale** row that has none | "$0.0…" on screen, "0.00" CSV, "$0.00" PDF for P1-9006, P1-4, P1-9005 | S5-R15a: "On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when it has none." (Ambiguous: $0.00 may be a "real zero" under S5-R15.) |
| **C5** | Space between the field box and the + / x on the work order card | 22 px from the box border (19 px from the outer edge of its 3 px glow) — measured on 1.6, 1.7, 1.10, 1.13. In the customer window the same gap is exactly 16 px | S1-R5: "The box ends 16px before the 32px column that holds the + and remove x buttons." |

Design-internal mismatches (not against the PRD): notes 4.1 and 5.0 say production's filter options read "Part Sales" /
"Service Sales", but both images show "Parts" / "Services" (Q6). Screen dates Sep 28 2026 vs export dates Sep 29 2026 for the
same invoices (Q7).

## 7 · Flows (skill 21 §5)

Every flow below was walked board by board in the Play view (the boards are pictures, so there is nothing further to click).

| Flow | Boards, in order | Walked |
|---|---|---|
| Work order: pick a rep | 1.2 → 1.3 → 1.4 → 1.5 | yes |
| Work order: add the Parts field | 1.5 → 1.6 → 1.7 → 1.8 → 1.9 → 1.10 | yes |
| Work order: pick who sold the labor | 1.10 → 1.11 → 1.12 | yes |
| Work order: remove the Parts field | 1.12 → 1.13 → 1.14 | yes |
| Work order: clear with Unassigned | 1.14 → 1.15 → 1.16 | yes |
| Work order: invoiced, read only | 1.17 | yes |
| Work order log | 1.18 (before) → 1.19 | yes |
| Edit Customer: one rep | 2.3 → 2.4 → 2.5 | yes |
| Edit Customer: add Service Parts, then Part Sales | 2.5 → 2.6 → 2.7 → 2.8 → 2.9 → 2.10 | yes |
| Edit Customer: three people, remove Service Parts | 2.10 → 2.11 → 2.12 → 2.13 → 2.14 | yes |
| Customer page shows every row | 2.15 | yes |
| New Customer: field, + menu, Part Sales on its own | 2.16 → 2.17 → 2.18 | yes |
| Part sale field (unchanged) | 3.1 → 3.2 → 3.3 → 3.4 | yes |
| Sales By Representative: rows per rep, expand | 4.4 → 4.5 | yes |
| Sales Type filter, Labor only | 4.6 → 4.7 | yes |
| Column selector: Sales Type on | 4.8 → 4.9 → 4.10 | yes |
| Expanded exports | 4.11 (CSV), 4.12 (PDF) | yes |
| Sales By Customer filter | 5.1 → 5.2 | yes |
| Phone: pick a rep, add Parts, Parts list | 6.2 → 6.3 → 6.4 → 6.5 → 6.6 → 6.7 | yes |

**Not drivable (no board exists):** remove x and clearing on a phone; customer window on a phone (S3-R5); collapsed phone card
(S3-R6); Sales Type "None" and "Empty export" (S8-R3–R5); Sales By Customer exports and "No sales" (S8-R8, S8-R9); print
(Story 6); "(Inactive)" (S1-E2); save error (S1-N3); Escape / click-outside closing (S1-R15, S2-R4); keyboard focus (S1-R4).
Interaction itself (hover timing, Escape, saving) cannot be driven on a picture design at all.

## 8 · Candidate questions for the product owner (not sent — the lane session decides)

| # | Topic (plain words) | Question, with options | What we know today | Where found |
|---|---|---|---|---|
| Q1 | Shop Supplies on the Parts row of a split work order | In Sales By Representative, the Parts row of a split work order shows $0.00 under Shop Supplies (screen, CSV and PDF). Should it be: (a) a dash on screen and in the PDF, blank in the CSV, as the PRD says; (b) $0.00 as the design shows? | PRD S5-R15 and S5-R23 say a dash / blank; the design's own note for the PDF also says "An empty side shows a dash" | Boards 4.5, 4.10, 4.11, 4.12 |
| Q2 | Shop Supplies on a part sale with none | A part sale with no shop supplies shows $0.00 under Shop Supplies. Should it be: (a) a dash; (b) $0.00, because $0.00 is its real amount? | PRD S5-R15a: "or a dash when it has none"; S5-R15: "$0.00 is shown only for a real zero" — the two can be read either way | Boards 4.5, 4.10, 4.11, 4.12 |
| Q3 | Order of names in the customer's Sales Representative list | The design lists Dylan Rush, Christian Wallace, Jason Garrison. Should the list be: (a) A to Z by first name, as on the work order; (b) as the design shows? | PRD S4-R3: A to Z by first name, then last name. The canvas says the customer window's test copy shows login names, not staff names, so the picture may simply be sorted by staff name | Boards 2.4, 2.11 |
| Q4 | Dropdown arrow on a phone | On a phone, should the Sales Representative fields: (a) always show their dropdown arrow, as the PRD says; (b) look like plain text until tapped, as the design shows? | PRD S3-R4 (a); design boards 6.2 and 6.6 and their note (b) | Page 6 |
| Q5 | Space between the field and the + button on the work order card | The design measures about 22 px between the field's box and the + (16 px in the customer window). Should the card use: (a) 16 px, as the PRD says; (b) the spacing in the design? | PRD S1-R5: 16 px. Measured from the board pictures (1 px tolerance) | Boards 1.6, 1.7, 1.10, 1.13 |
| Q6 | Filter option names on Sales By Customer | Today's options read "Parts" and "Services" in the design's own "before" pictures; the build reads "Part Sales" and "Service Sales". Is that rename intended: (a) yes, both options are renamed, and a saved choice keeps its options under the new names; (b) no, only the filter's title changes? | PRD S8-R7 and S8-E1 point to (a); the canvas notes claim today's options already read "Part Sales" / "Service Sales", which the pictures contradict | Boards 4.1, 5.0, 5.2 |
| Q7 | Invoice dates differ between the screen and the export | The same invoices show Sep 28 2026 on screen and Sep 29 2026 in the CSV and PDF. Is this: (a) expected (time zone of the export); (b) a mistake in the design data? | Not covered by the PRD | Boards 4.10 vs 4.11, 4.12 |
| Q8 | The design refers to numbered decisions | The canvas cites "decision 34, 37, 38, 40, 47, 48, 65, 66, 67, 69, 70, 71". Can we have that list: (a) yes, link it; (b) no, the PRD v8 is the full record? | None of these numbers appears in PRD v8 or the tech plan | Canvas notes, pages 1–6 |
| Q9 | Screens the PRD describes but the design does not show | Printed work order (Story 6), "(Inactive)" name, save error, collapsed phone card, customer window on a phone, "Sales Type: None" / "Empty export", Sales By Customer exports. Should we: (a) wait for design boards; (b) test these from the PRD wording alone? | Story 6 cites "page 1", which has no printout | Whole canvas |
| Q10 | Column picker tooltip hides the Sales Type switch | On board 4.8 the "Column Selection" tooltip covers the Sales Type switch, so the "off by default" state is not visible. Is the tooltip: (a) expected to close when the panel opens; (b) acceptable as shown (production does the same today)? | PRD S5-R21: off by default. Production board 4.2 shows the same overlap | Boards 4.2, 4.8 |
| Q11 | Mixed label casing on the invoiced card | The invoiced (read-only) card reads "Lead technician" and "Service advisor" beside "Sales Representative - Labor". Should the read-only labels: (a) stay as today; (b) all use the editable card's capitals? | PRD S2-R17: "same label and wording" (about the SR fields only) | Board 1.17 |

## 9 · Design picture to compare against (for testers)

| Screen / state a tester needs | Picture |
|---|---|
| Work order card, nobody assigned, at rest | `screens/p1-1.02-nobody-assigned-at-rest.png` |
| Hover on the rep row: box, arrow, + | `screens/p1-1.03-hover-the-box-and-the-plus.png`, `screens/p1-1.06-hover-box-arrow-and-plus.png` |
| The list, Unassigned first and checked | `screens/p1-1.04-the-list-unassigned-first.png` |
| One rep picked, at rest | `screens/p1-1.05-one-rep-picked-at-rest.png` |
| + tooltip | `screens/p1-1.07-hover-the-plus.png` (zoom: `screens/zoom/p1-zoom-tooltips-menu-remove-x.png`) |
| + menu | `screens/p1-1.08-the-plus-menu.png` |
| Labor and Parts fields, at rest | `screens/p1-1.09-parts-added-both-rows-copy-becky.png` |
| Labor and Parts fields, hovered (arrow on the name line, x beside Parts) | `screens/p1-1.10-hover-two-rows.png` |
| Labor list open | `screens/p1-1.11-labor-pick-who-sold-the-labor.png` |
| Two different reps | `screens/p1-1.12-two-reps.png` |
| Remove x tooltip | `screens/p1-1.13-hover-the-remove-x.png` |
| After removing Parts | `screens/p1-1.14-parts-removed-the-labor-person-stays.png` |
| Clearing with Unassigned | `screens/p1-1.15-clearing-pick-unassigned.png`, `screens/p1-1.16-cleared-unassigned.png` |
| Invoiced card, read only | `screens/p1-1.17-after-invoicing-read-only.png` |
| Work order log entries | `screens/p1-1.19-the-log-records-every-rep-change.png` |
| Edit Customer: field, list, one rep | `screens/p2-2.03-…`, `p2-2.04-…`, `p2-2.05-…` |
| Edit Customer: + tooltip and menu | `screens/p2-2.06-hover-the-plus.png`, `screens/p2-2.07-the-plus-menu-two-options.png` |
| Edit Customer: Service Parts added; menu with Part Sales only | `screens/p2-2.08-service-parts-added.png`, `screens/p2-2.09-the-plus-menu-now-offers-part-sales-only.png` |
| Edit Customer: three rows; Part Sales list; three people | `screens/p2-2.10-…`, `p2-2.11-…`, `p2-2.12-…` |
| Edit Customer: remove x tooltip; Part Sales without Service Parts | `screens/p2-2.13-hover-the-remove-x.png`, `screens/p2-2.14-part-sales-without-service-parts.png` |
| Customer page with every row | `screens/p2-2.15-the-customer-page-reads-every-row.png` |
| New Customer: field, menu, Part Sales on its own | `screens/p2-2.16-…`, `p2-2.17-…`, `p2-2.18-…` |
| Part sale field (unchanged) | `screens/p3-3.01-…` to `p3-3.04-…` |
| Sales By Representative default (Sales Type column off) | `screens/p4-4.04-one-row-per-rep.png`, `screens/p4-4.05-expanded-sales-type-column-off.png` |
| Sales Type filter open; Labor only | `screens/p4-4.06-the-sales-type-filter.png`, `screens/p4-4.07-labor-only.png` |
| Column picker; Sales Type on; expanded with Sales Type | `screens/p4-4.08-…`, `p4-4.09-…`, `p4-4.10-expanded-with-sales-type.png` |
| Expanded CSV and PDF | `screens/p4-4.11-expanded-export-csv.png`, `screens/p4-4.12-expanded-export-pdf.png` (full size: `unpacked/png/sbr-11-…`, `sbr-12-…`) |
| Sales By Customer filter, closed and open | `screens/p5-5.01-after-sales-type.png`, `screens/p5-5.02-after-the-filter-open.png` |
| Phone: field, list, picked, + menu, Parts added, Parts list | `screens/p6-6.02-…` to `p6-6.07-…` (full size: `unpacked/png/phone-0*.png`) |

## 10 · Files in this folder

`design-files-reading-2026-10-19.md` · `design-text-inventory-2026-10-19.md/.json` · `design-visual-inventory-2026-10-19.md`
· `canvas-drive/` (drive log) · `screens/` (86 browser screenshots + `zoom/` 10 detail crops) · `ocr/` (68 OCR transcripts) ·
`unpacked/files/` (70 embedded files) · `unpacked/png/` (68 board images) · `repo-tool-run/` · `tools/` (every script used).
`unpacked/artifact-page.html` (the browser-ready 10.5 MB page) was deleted after the drive to keep the repo small; recreate it
with `python3 build/testing-tools/extract_artifact_canvas.py <export> <folder>`.

## OUTSTANDING — what I need from you

1. **Rule 119 skip to confirm:** the export's canvas-editor runtime (2.47 MB of Anthropic viewer CSS/JS, no ShopView content
   by script scan) was not read line by line. Confirm the skip, or say so and it will be read in full.
2. Decide whether questions Q1–Q11 go to Chris Ward (none has been sent; the lane session owns sending).
