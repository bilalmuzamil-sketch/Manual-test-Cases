# Notes — Bill To design drive (9 Nov 2026)

Worker pass for the brief `WORKER-BRIEF.md`. No writes to TestRail, Jira, Slack or Google; nothing committed. Files written only in this
folder and `build/founder-mode/bill-to/DESIGN-DIVERGENCE-REGISTER.json`.

## Counts
- Package: 150 files (8 boards, canvas.json, 4 design-system files, 124 screenshots, 13 design-tool files). Read: see `DESIGN-READING-RECORD.md`.
- Figures: 126 in 8 boards (cover 0; pages 1-7: 26, 21, 21, 22, 15, 10, 11), 125 with a picture + 1 portal placeholder. `DESIGN-FIGURES-2026-11-09.json`.
- Pictures: 124 screenshots viewed at full size and transcribed (4 byte-identical pairs); 126 figure pictures in `images/`; 12 caption sheets viewed.
- Text inventory: 9,333 rows (750 board, 8,583 screenshot) — DATA 5,189, OUT-OF-SCOPE 3,334, LOOK-ONLY 479, PRD-MATCH 297, SPEC-CONFLICT 34, unclassified 0.
- PRD → design: 197 rows — SHOWN 78, DIFFERENT 13, NOT SHOWN 67, NO SCREEN 39.
- Register: 13 differences (BT-D01..D13, all QUESTION, drafted not sent), 7 settled (BT-S01..S07), 20 not shown (BT-N01..N20).
- Design cases: 60 look cases DC-01..DC-60 + 10 held design-version cases DV-01..DV-10 = 70 (`DESIGN-CASE-PLAN.md`).
- Questions for Chris Ward: 13 (`NEW-QUESTIONS.py`), unsent.

## Differences (one line each)
- BT-D01 Change Bill To list puts the current Bill To second; PRD S3-R3 says (this customer) first then A to Z.
- BT-D02 Lock toasts add a "Close" button, and users without permission get a red toast with Close instead of the standard error toast (S5-R2/R5/N1-N3, §8).
- BT-D03 Bill Invoices To window has Cancel as well as Save (S1-R4 names Save only).
- BT-D04 Remove as default Bill To shows Cancel, Remove; PRD lists Remove, Cancel "as they render".
- BT-D05 Legacy invoice/estimate Bill To block prints no phone (S7-R1 says name, address and phone).
- BT-D06 Long Bill To name cut at the desktop card edge with no ellipsis (S3-R2 "the Bill To's name").
- BT-D07 Asset tab with a Bill To column runs off the right edge at 1440 px (sideways scroll).
- BT-D08 Lock tooltips appear at the window's left edge / as one 850 px line.
- BT-D09 Lists that open upward run over the app's top bar.
- BT-D10 Credit Hold banner sits under the tab bar (Lines and Finance), PRD S7-R6 says page header.
- BT-D11 Asset tab caption says the column shows when a "loaded" row bills someone else (S14-R6 "at least one row").
- BT-D12 Cover says AccountingHub needs a new version 4 event, not built; PRD S18-R2 says no AccountingHub change.
- BT-D13 Captions that do not match their pictures (production New Customer toast, mary.moore picture size, cover "one 1600 board", S2-17579 full name, stale Pays for 1).

## Things the case worker should know
- Design-only words with no PRD conflict (design is the look source): the Customer chip's "All customers are included. Pick one or more to narrow." and "1 selected"; the arrow in the Work Order Log; the yellow Delete Customer header; the larger Pays for title; the Bill To value's lighter weight.
- Not Bill To (cover note, out of scope): Credit Terms/Credit Limit fields, the + beside Sales Representative, "Unassigned" for N/A, parts table columns, Over Limit pill, list toolbar spacing.
- S3-R3's "first 50" is stated for the work order field; the customer windows' caption also says "first 50 customers A to Z" — the PRD (Story 2) does not repeat the 50 for the windows (noted, no conflict).
- The Finance tab's on-screen estimate already shows the band (settled, BT-S03).
- No question sheet exists yet for Bill To; merge these 13 with the PRD case worker's questions into one sheet (Rule 131).

## Judgement calls (for the QA lead)
- Nine design-tool reference files and tokens.json are byte-identical to copies read in full on 2 Nov; they were not re-read line by line today (charter clause 8). Rule 119 lets only the QA lead allow a skip: say so if they must be re-read (~110 KB).
- No OCR tool exists in the container (no tesseract; Pillow broken under `-I`), so every word was transcribed by eye; crops were made with Chromium (`tools/crop.js`).
- `design_visual_inventory.py` and `drive_design_full.py` were not used: the boards hold only screenshot frames with empty scripts; `tools/render.js` drove every element (0 reacted) and the visual inventory was built by hand from the pictures.
