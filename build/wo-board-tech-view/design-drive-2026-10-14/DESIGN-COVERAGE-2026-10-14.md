# WO Board & Tech View — design export of 14 Oct 2026: coverage proof (Rule 124 as amended 9 Oct, Rules 119, 120, 122)

**Design:** Branko Cicovic's Claude Design project "Work Orders" (787fef1a), export attached by the QA lead on 14 Oct 2026, extracted
untouched at `sources/design-2026-10-14-upload/` (103 files). **Spec used for triage:** PRD Confluence 845185030 **page v48** (12 Oct 2026,
status line "PRD v33"), `currency-2026-10-14/CONFLUENCE-845185030-2026-10-14.md`; review child 853901313 of the same day; tech plan
`sources/Tech-Plan-…-2026-10-08-upload.md` (informs only). **Cases:** all 258 snapshots in `currency-2026-10-14/snapshots-before/`
(240 ours + 18 Vladimir Tomovic's; the 18 use separated steps, which `scripts/caseindex.py` reads too).
**Full pass, not a delta (Rule 122):** every file read, every board swept, every text classified, every flow driven — including the 99
unchanged files. Nothing written to TestRail, Jira, Confluence, Slack or Google; no ShopView build opened; no git (the lead session commits).

## Gate summary

| Gate (Rule 124, 9 Oct amendment) | Result | Evidence |
|---|---|---|
| 1 · Every file of the package read | **PASS** — 103 / 103 (new + changed read line by line today; identical files script-read today and read in full 8 Oct; 46 images viewed and transcribed; 36 fonts identified) | `design-files-reading-2026-10-14.md` |
| 2 · One-click sweep of every board | **PASS** — 4 boards, 573 elements, every one hovered and clicked, 0 failed, 0 missing; 768 / 1920 widths captured | `evidence/sweep/*-summary.json`, `evidence/sweep/variants-2026-10-14.md` |
| 2a · Dark theme | **PASS (by flow)** — the sweep's `?theme=dark` variant does not switch this export; dark was driven for real with `ShopviewTheme.set('dark')` (flow T1) | `FLOWS-2026-10-14.md` T1 |
| 3 · Text inventory, zero unclassified | **PASS** — 1,908 rows, **0 unclassified** | `inventory/design-text-inventory-2026-10-14-classified.{md,json}` |
| 4 · Every multi-step flow driven or named | **PASS** — 16 flows (158 steps, 57 checks) + 4 probes; flows of other features named with the reason | `FLOWS-2026-10-14.md`, `evidence/flows-steps-2026-10-14.md` |
| 5 · Every drag tried, allowed and refused | **PASS** — work order between technicians (allowed + Undo), reorder within a technician, technician column / group reorder, refused: Invoiced, Declined, Imported, no permission | `FLOWS-2026-10-14.md` W3, W3b, probes |
| Proof file | this file (the lead session commits it) | — |

## 1 · What changed — proved by md5 (script `scripts/reading_table.py`)

| File | 8 Oct | 14 Oct | What it is |
|---|---|---|---|
| `Work Orders Details.dc.html` | — | **ADDED** (117,661 B, 1,529 lines) | The Work Orders board **plus a List row-click preview panel** ("Work Order Peek"); the hidden "Details" display is removed |
| `uploads/Screenshot 2026-10-08 at 15.53.24.png` | — | **ADDED** | The work order page as the preview shows it (S1-354: "Lines(4)", "Service - PM-A inspection, 2…", Story "JS: Full PM-A per fleet schedule…", Labor "Brenda Martinez", parts) |
| `wo-details/Add Part.html` | 304,402 B | **CHANGED** 305,246 B | +7 lines: a read-only "peek" mode (`?peek=1`) hiding line actions, New Line, Add Part, time clock, Add Deposit / Create Invoice |
| `.thumbnail` | | **CHANGED** | now pictures the preview panel open on S1-680 |
| other 99 files | | identical | incl. `Work Orders.dc.html`, `Work Orders -no page-fix-.dc.html`, the design system, all screenshots and photos |

## 2 · Files read

103 files: 4 boards (HTML), 1 design-tool runtime (`support.js`), 1 top-level icon file, 12 design-system text files (bundle, manifest,
lint config, 2 CSS, sv-components.jsx, tokens.js, index.js, lucide-icons.js, theme-toggle.js, README, SKILL), 3 SVGs, 46 images (26 screenshots, 11 uploads, 8 avatar photos, thumbnail), 36 fonts. Per-file table with
size, lines and method: `design-files-reading-2026-10-14.md`. **Coverage 100%.**

## 3 · One-click sweep (`build/testing-tools/drive_design_full.py --serve`, copy of the package)

| Board | Elements | Hovered | Clicked | Hover exposed | Click exposed | Failed | Interactions | Time |
|---|---|---|---|---|---|---|---|---|
| Work Orders Details.dc.html (NEW) | 152 | 152 | 152 | 93 | 144 | 0 | 308 | 547 s |
| Work Orders.dc.html | 152 | 152 | 152 | 94 | 144 | 0 | 308 | 519 s |
| Work Orders -no page-fix-.dc.html | 179 | 179 | 179 | 120 | 170 | 0 | 362 | 636 s |
| wo-details/Add Part.html | 90 | 90 | 90 | 27 | 49 | 0 | 180 | 187 s |

On the Details board 84 of the 308 interactions opened the new preview panel (every List row click). Visible text is identical at 768,
1440 and 1920 px on the three Work Orders boards; Add Part differs by width (columns hidden in the narrow layout).

## 4 · Text inventory (the coverage proof)

`design_text_inventory.py --design <package> --cases <258 snapshots> --library _ds/ lucide-icons.js support.js --include-docs
--sweep-text <4 page-text files> <4 interaction-exposed text files> <flow texts>` → 19 files read, **1,292 distinct texts** (118 already
in a case of ours, 621 board texts, 553 library-only texts). **Supplementary pass** (`scripts/supplementary_texts.py`): 255 texts the
tool's word filter drops (single words such as "Undo", "Cancel", "Unassign", "Collapse", lower-case fragments such as "pinned", "open",
"parts"). **Image transcription**: 361 lines from 46 images. **Classified by `scripts/classify.py`** (curated rulings + DATA vocabulary
taken from the boards' own record arrays + C-id lookup across all 258 snapshots):

| Class | Rows | Meaning |
|---|---|---|
| **SPEC-CONFLICT** | 39 | Design differs from the spec v48 — 3 new PO questions (PQ-14-1..3), 2 known questions now answered by the spec where the design lags (W-3 Imported, W-13 search-only), the rest KNOWN and still present |
| **CASE-NEEDED** | 9 | Filtered-empty state (spec S1-N1a, no case in today's set), Collapse all / Expand all, Columns menu search / Show all / Reset (the 8 Oct cases for these are missing from today's set) |
| **COVERED** | 110 | With C-ids |
| **DATA** | 370 | Prototype record values and rows / cards made only of them |
| **OUT-OF-SCOPE** | 1,241 | Work order page (other features), design-system docs and cards, Global Search, page chrome, browser chrome in screenshots, designer review frames, PO-ruled-out items (Undo, Department) |
| NOT-ON-SCREEN | 139 | Code tokens the extractors picked up (selectors, prop values, ids, runtime console messages, unbound computed labels) — listed with the reason, not on-screen text |
| **Unclassified** | **0** | |
| Total | 1,908 | 1,292 + 255 + 361 |

## 5 · What is new in the design, and is it in scope?

1. **List row-click preview panel** (`Work Orders Details.dc.html`). Clicking a List row opens a 960 px side panel ("Work order preview")
   with the work order number, status, "customer · unit · asset", "Open Work Order", a close X ("Close (Esc)"), Escape to close, a
   loading skeleton, and the whole work order page inside it — editable. Only List rows open it; Tech View rows and Board cards do not.
   While it is open it covers the toolbar's display switcher, Columns, Row height and New Work Order. **Not in the spec**: §3 Goals says
   "List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher."
   → **SPEC-CONFLICT, PO question PQ-14-1** (is it part of this release?). No case changes until answered; 5 cases would be affected
   if it ships (C368200, C368201, C368214, C96932, C96946).
2. **`Add Part.html` peek mode** — a read-only preview that hides every line action — exists but the board never turns it on
   (`?embed=1` only), so the panel shows an editable page. Part of PQ-14-1.
3. **New screenshot / thumbnail** — pictures of the preview's content and the panel. The Story row has no tech-story check mark
   (consistent with S8-R1); the Labor row shows the work order's lead in every line (prototype data, not a statement about S7-R8–R10).
4. **Removed:** the hidden "Details" display (left list + work order pane) — the tech plan had already planned "the PRD wins" for it.

**Does the spec need to react?** Only if the PO wants the preview (PQ-14-1). **Do test cases need to react?** Not for the preview until
PQ-14-1 is answered. Independently of the new board, today's spec (v43 / v48) needs cases the snapshot set lacks: S1-N1a / S1-N1b empty
states and S1-R13b ("Imported work orders open in List.") — CN-1, CN-4 in the triage file.

## 6 · The six known divergences (PROJECT-STATE) in this export

| # | Divergence | 14 Oct |
|---|---|---|
| 1 | Density "Row height: Small/Medium/Large" (+ Board "Card size: Compact/Detailed") vs Compact / Regular / Comfortable | still shown |
| 2 | No "Fields to display" picker on Board View | still (Board has only Card size) |
| 3 | Switcher tooltips "Table / By Lead Tech / Board" vs List / Tech View / Board View | still |
| 4 | Opens on the All tab vs spec S1-R10 (Work Orders default) | still opens on All — but **S1-R10 is not in the current spec** (v42 / v48): drop or re-anchor |
| 5 | Empty group "No work orders assigned" vs “No work orders” | still |
| 6 | Restricted-status cards still expose Reassign Lead Tech | still (greyed, with the lock note) |

Not re-raised as new. Details and the other KNOWN items (pin limit 5, Declined locked, toast wording + Undo, lock tooltip wording,
"N open" counting every status, search opening collapsed groups): `TRIAGE-SPEC-CONFLICT-AND-CASE-NEEDED-2026-10-14.md` §C.

## 7 · Reproduce

Scripts in `scripts/`: `reading_table.py` (file table + md5 diff), `flow_drive.py` (flows; writes `flows.json` + screenshots),
`show_flows.py` / `flows_md.py` (render), `probe_*.py` (4 probes), `extract_sweep_text.py` (sweep + flow texts → `--sweep-text`),
`supplementary_texts.py`, `caseindex.py` (C-id lookup over the 258 snapshots), `classify.py` (exits 1 while any row is unclassified).
All take the package / output folders as arguments; run with `python3 -I`. Screenshots and raw sweep logs stay in the session scratchpad.

**OUTSTANDING — what I need from you:** PQ-14-1, PQ-14-2, PQ-14-3 for Sasha Grosman / Branko Cicovic (send last, with the W-list —
Rule 66); confirm whether C96918, C154887, C368149, C368160, C368162 and C368164 were deleted on purpose (they are in the 8 Oct
snapshots, not in today's); decide whether to drop known divergence 4.
