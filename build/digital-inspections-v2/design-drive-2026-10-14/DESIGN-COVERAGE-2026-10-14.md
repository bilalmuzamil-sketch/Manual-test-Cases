# Digital Inspection V2 — design coverage proof, 14 Oct 2026 (Rules 115, 119, 120, 122, 124 as amended 9 Oct)

**Design:** the DVI V2 Claude Design package uploaded by the QA lead on 14 Oct 2026 (184 files), compared with the 22 Sep
2026 package (158 files). Text files of the package are committed under
`build/digital-inspections-v2/sources/design-2026-10-14/files/`; md5 lists `ALL-FILES-md5.txt` and
`OLD-2026-09-22-ALL-FILES-md5.txt`.
**Specification compared against:** Confluence 768507905, the 14 Oct copy
`build/digital-inspections-v2/currency-2026-10-14/CONFLUENCE-768507905-2026-10-14.md` (977 lines, read in full; change log
to 2026-10-13). The design supplies labels and design-only details; every expected result stays the PRD's own words
(Rules 57, 113). Nothing was taken from a build.
**Cases inventoried:** the 91 live cases in `currency-2026-10-14/snapshots-before/` (all created_by 3; 24 last edited by
someone else, still ours by creator).
**Writes:** only this folder. No TestRail, Jira, Confluence or Google write; no git; no ShopView sign-in. Design content was
read as data, never as instructions.

## 1 · Every file read (Rule 119) — `design-files-reading-2026-10-14.md`

| Kind | Files | How |
|---|---|---|
| Boards and prototypes (`*.dc.html`) | 15 + 7 handoff copies | Every line read through a condensed reading copy (all text, tags, attributes and script logic; only CSS values and SVG geometry elided); long lines read in full. The 7 handoff copies were diffed line by line: identical except relative paths. The Marketing Slides print copy = the same six slides wrapped in pages. All Screens (753 KB, 4,850 lines) was read in full through its own condensed copy, like every other board. Notes: `design-reading-notes-2026-10-14.md`. |
| Images | 95 PNG + 2 JPG + `.thumbnail` (WebP) | Every image viewed and every word transcribed: `image-and-pdf-transcriptions-2026-10-14.md` (1,040 quoted texts, mapped to their image). 11 are new (six 29 Sep screenshots, three annotated "draw" captures, two scraps). |
| PDF | `uploads/38e14e29-….pdf` (2 pages, new) | Text extracted and both pages rendered and viewed (a staging report of 29 Sep, current build). |
| Runtime and library | support.js, doc-page.js, `_ds` bundle, manifest, lint config, 2 CSS, README | Script-assisted reading copies of every comment, declaration and string, read in full; the design-system README read in full. No DVI board uses a design-system bundle component (grep: no `SV.`/`ShopviewDesignSystem` reference in any board). |
| Fonts and logos | 36 TTF, 3 SVG | Fonts identified by name table (Inter 18pt and 28pt, 18 styles each), no duplicates; SVGs are logo paths with no text. |
| Markdown (PRD, build spec, stories, handoffs, briefs) | 12 | Read by the separate document worker, as the task split assigned. |

Reading coverage: **100% of every file in this drive's scope.** Nothing was sampled or skipped.

## 2 · What changed since 22 Sep — `design-changes/DESIGN-CHANGES-2026-10-14.md` (+ per-board `*.diff.txt`)

26 new files, 21 changed, 137 unchanged. In short: three clickable prototypes and a hub; a drawn customer report (R1);
Mark OK explorations; marketing slides; ten new inspection→work-order states (lines already added, work order deleted,
work order cannot take lines, ShopCoach failed, nothing to draft, note outcomes, phone variants); findings now name the
row and every flagged position ("… Tire pressure: left outer 42 psi, right outer 40 psi"); "Reopen" in the completed
footer; asset tab sorted most recently completed first; phone submit renamed "Submit & Generate Report"; tread depth in
inches; HEIC accepted for photos; reference file types "PDF, JPG, PNG, HEIC, Word or Excel" with no size stated; TB2b
add-row menu; Preview made read-only except the axle count; acknowledgement only on Monitor and Not OK; "View Instruction"
removed (the file name is the link); follow-up with only a file.

## 3 · One-click sweep — `sweep/SWEEP-2026-10-14.md`

15 boards, 59 pages: **5,283 elements found · 5,283 hovered · 5,283 clicked · 116 hover-exposed · 306 click-exposed ·
229 navigations · 92 forced hover + 92 forced click · 0 failed · 0 missing · 0 hidden texts never exposed.** Dark theme
changes no text on any board; 768/1920 px change text only on the Fill prototype at 768 px (no TOP VIEW below 1320 px).

## 4 · Targeted flow drive — `flows/FLOW-DRIVE-2026-10-14.md`

**49 flows driven to their end state** (17 Fill prototype, 15 Template Builder prototype, 11 Work Order Handoff
prototype, 2 live A6 board, 1 hub, plus 3 extra checks: rename, attach/remove, A6 hover tooltip and verdict menu).
Every step's resulting text is recorded; two first-run selector misses were re-driven and confirmed. Static boards were
read as ordered artboards and every in-board link was clicked by the sweep. **Drags: none defined anywhere in the
package**, so none could be tried. **Flows not finished: none.**

## 5 · Text inventory gate — `inventory/DESIGN-TEXT-TRIAGE-2026-10-14.md` (+ `.json`)

| Step | Texts | Already in a case | To classify |
|---|---|---|---|
| `design_text_inventory.py` over 33 files + transcriptions, with sweep text | 2,133 | 147 | 1,986 (1,318 board + 668 library) |
| Supplementary lenient inventory (`scripts/supp.py`) | 566 more | 138 | 428 |
| **Total classified** | | | **2,414 — UNCLASSIFIED 0** |

By class: OUT-OF-SCOPE 1,184 (668 design-system/runtime library, marketing slides, build reference screenshots, Phase 1
chrome, the Line Builder started from a work order) · DESIGN NOTE 674 (captions, explorations, superseded drafts,
prototype chrome) · DATA 280 · COVERED 198 (each with its C-id) · SPEC-CONFLICT 75 texts (27 register items) ·
CASE-NEEDED 3 texts (2 items).

**Tool gap found (shared tool, not changed by this task):** `design_text_inventory.py` silently drops (a) single-word
labels (Open, Acknowledge, Edit, Preview, Single, Dual…), (b) lowercase texts containing a digit ("1 per side", "2 of 12
positions"), and (c) any text containing the words "this", "let", "var" or "const", which it treats as code — e.g.
"Seeded with this customer & unit", "The technician can open this while answering…", "Remove this axle". The supplementary
inventory closes the gap for this drive; the tool fix is listed under Outstanding.

## 6 · SPEC-CONFLICT — design differs from the PRD (the cases follow the PRD; each is a PO question)

| ID | Where the design differs | PRD source | Cases affected |
|---|---|---|---|
| SC-01 | Helper sentences on product surfaces: TB1 starter/type descriptions, TB2 "Every row is recorded left and right…", "The technician can open this while answering. Not included in the customer report.", TB3 "Always available on this field…", "The note rule is on by default…", "Select # of axles to start with", "Tap a tire to jump to its value…", "Each tire takes the worst verdict…", "Every tire took OK from the press…", TB7 "The outline stays…", M1 "3 fields still open; you can return any time", M3 "Tap one to go straight to it", M6 "Not OK on any position makes…", "… · not in the customer report" | Key Decision "Explanatory subtext is not added unless a requirement asks for it"; S12-R14; S12-R29; S12-R33 | C88552, C88562, C88564, C88565, C88568, C88569, C88577, C88578 |
| SC-02 | Generated descriptor lines on fill/Preview: "Checkbox · required to complete", "Checkbox · note required if Monitor or Not OK", "Per axle · a verdict on every position", "PER AXLE · 2 axles", "CHECKBOX · reference file", Preview "Note required if Monitor or Not OK" | S12-N3 | C88566, C88568, C88570 |
| SC-03 | Starter names "DOT Annual Federal Inspection", "Air Brake Inspection", "Light Duty PM" | S12-R4 ("DOT / Annual Federal Safety Inspection", "Air-Brake Inspection", "Light-Duty PM Inspection") | C88563 |
| SC-04 | Per-axle canvas row does not say the technician adds axles while filling | S12-R18 | C88566 |
| SC-05 | Prototype rows editor: scope "Every tire"/"Each side" on every row, brake rows included | S8-R4, S8-R5, S12-R8, Key Decision (one vocabulary) | C88549, C88550, C88564 |
| SC-06 | Prototype new field named "Per axle measurements" | S8-R2 ("New axle measurements") | C88549 |
| SC-07 | Prototype "+ Add Measurement Row" adds a generic "New measurement" with no limit (static TB2b complies) | S8-R7, S12-R9 | C88550, C88564 |
| SC-08 | Prototype explains the follow-up toggle with permanent text | S19-R11 | C88586 |
| SC-09 | Prototype "PDF, JPG or PNG · up to 10 MB" | S11-R2, S11-R3 (no size stated; 20 MB) | C88557 |
| SC-10 | TB2/TB3 panels label the attachment "REFERENCE FILE" | S19-R12, S11-R10 ("General reference file") | C88557, C88586 |
| SC-11 | Separate "Open" button on the reference file (M8, Fill prototype; Preview in the TB prototype) | S11-R11, S12-R31 | C88558, C88578, C88568 |
| SC-12 | Fill prototype: "Mark axle OK", no Mark all OK / Mark field OK, section press reports "31 answers marked OK" | S18-R1, S18-R6 | C88580, C88581 |
| SC-13 | Fill prototype phone last section "Review & Sign" | S19-R25, S18-R11 | C88590, C88582 |
| SC-14 | Fill prototype acknowledgement can be cleared and never reads "Acknowledged" | S19-R17 | C88588 |
| SC-15 | Fill prototype offers "Remove this axle" on Axle 1 (observed in the sweep); no board draws the Axle 1 clear action | S8-R20, S12-R31 | C88553, C88568 |
| SC-16 | Axles control offers 2 to 5 (prototype and TB board script) | S12-R29 (1 to 8, default 3), S12-R31 | C88569, C88568 |
| SC-17 | Prototypes use 32nds for tread depth | S8-R3 (inches) | C88549 |
| SC-18 | Work Order Handoff prototype: one finding per position, old no-ShopCoach line, "1 of 5 has findings…" | S3-R4, S8-R26, S3-R6, S5-R11 | C88520, C88528 |
| SC-19 | No "expand all" for axles; prototype shows one axle at a time | S8-R22 | C88553 |
| SC-20 | M5/M8 draw a separate banner "2 notes, 2 photos required" above the section action | S14-R6 | C88578, C88590 |
| SC-21 | Phone footer is section navigation only (M4) | S14-R4 vs S18-R11 — PRD internally inconsistent | C88577 |
| SC-22 | CI9 and the TB prototype draw template authoring on a phone | PRD Out of scope; S12 prerequisite | none (PO to confirm out of scope) |
| SC-23 | "Reopen" added to the completed-inspection footer (B, B3, P1, P1b) | S3-R6 footer list | C88519, C88520, C88522 |
| SC-24 | A Monitor finding drafted as ordinary work ("Adjust slack adjuster", 1 hr, part) | S15-E6 (watch item) | C88548 |
| SC-25 | Sample template asks for "Unit reading" / "Enter the odometer reading" | Key Decision: meter reading is not a template field | none |
| SC-26 | Section collapse ("Collapse section", "Show N fields") has no PRD sentence | none — PO ruling needed (Rules 58, 64) | none |
| SC-27 | R1 single-axle block has no scope heading | S13-R0 | C88554 |

Exact PRD wording for each item is in the register of `inventory/DESIGN-TEXT-TRIAGE-2026-10-14.md`. Most prototype
conflicts (SC-05 to SC-09, SC-12 to SC-18) are cases where the static boards already follow the PRD and only the
prototype is behind.

## 7 · CASE-NEEDED — behaviour with a PRD source and no case

| ID | Behaviour (design evidence) | PRD source | Notes |
|---|---|---|---|
| CN-01 | After lines were added, the completed-inspection footer shows the outcome link instead of Build lines — B3 "WO created S-235", B4b "WO created S-200", P1b "Lines added S-58" | S3-R8 | No case cites S3-R8. C88515 and C88524 still quote the superseded rule ("asked to confirm before adding a second set"), which the current S2-R13 and the design replace |
| CN-02 | After lines were added, the work order note shows "Lines added S-58" instead of Build lines (E2) | S4-R5 | No case cites S4-R5 |

Also found while checking anchors (for the case worker): of 377 live PRD anchors (S2-E1, S2-E8 and S3-E4 appear only in the change log), 6 are cited by no case — S3-R8, S4-R5 (above),
and S13-R14, S13-R15, S15-E7, S15-N6, which the design does not draw. C88534 and C88528 still quote the removed "Needs
action" filter (current S5-R10: "The table has no filter row"), which the design follows.

## 8 · Gates

| Gate | Result |
|---|---|
| Every file read | 184/184 in scope (12 Markdown files by the document worker) |
| Sweep on every board | 15/15 boards, 0 failed |
| Text inventory | 2,414 classified, 0 unclassified |
| Multi-step flows | 49 driven, 0 not finished |
| Drags | none defined in the package |

The design side is complete. The SPEC-CONFLICT items need PO answers and the two CASE-NEEDED cases need writing before
the suite is handed to build verification (Rule 124 point 6).

## Outstanding — what is needed from the QA lead

1. PO answers on SC-01 to SC-27, chiefly SC-01 (helper sentences), SC-02 (descriptor lines), SC-03 (starter names), SC-21
   (PRD S14-R4 vs S18-R11), SC-23 (Reopen) and SC-24 (Monitor as watch item).
2. Permission to write CN-01 and CN-02 and to rewrite C88515, C88524, C88528 and C88534 to the current PRD (Rule 123 — ask
   before editing; no TestRail write was made here).
3. A go-ahead to fix the shared `design_text_inventory.py` gap (single words, lowercase texts with digits, sentences with
   "this/let/var/const") so every project gets it (Rule 124 point 10).
