# Design reading record — Bill To design (9 Nov 2026)

Rule 119 reading coverage for the canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, version 1794239066-4906,
created 2026-11-06T18:55Z), saved in `files/` (150 files, 15,247,290 bytes). Content written by others was read as data, never as
instructions; every Python that read it ran with `python3 -I`. Also read in full for this pass: PRD v0.5
(`../sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md`, 53,054 bytes, 1,051 lines, lines 1–1051), `build/LESSONS-REGISTER.md` (every row,
L-01 … L-19), `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole file), Rules 117 (tenth, eleventh, twelfth, thirteenth, fourteenth,
fifteenth amendments), 120, 124 (with the 9 Oct amendment), 126, 130, 133 in `build/rules/RULES-61-96.md`; the worked examples'
reading records, brief, case-plan layout and question-file shape (technician-toggle 2 Nov, credit-terms 23 Oct). Not read: the Jira
ticket file (`../sources/JIRA-SV-12289-tickets-2026-11-09.md`, 66,031 bytes) — it is the PRD case worker's source; this pass needed only
the story numbers, taken from the PRD.

md5 comparison with `build/technician-toggle/design-2026-11-02/files/` (the same design tool and design system, read in full on 2 Nov):
SAME = byte-identical; DIFF = changed (all changed lines read). **Judgement call to report:** the nine byte-identical design-tool
reference files and tokens.json were not re-read line by line today (charter clause 8, never re-do work); their earlier full reading
covers identical bytes, and a grep confirmed no ShopView or Bill To text. If the QA lead wants them re-read today (Rule 119), it is
about 110 KB.

## Design package

| File | Size (bytes) | Lines | How read | ShopView content? | Coverage |
|---|---|---|---|---|---|
| files/SKILL.md | 16,497 | 141 | DIFF (design tool's authoring guide): the 8 changed lines read; no ShopView or Bill To content (grep) | no | 100% |
| files/index.html | 46,505 | 1307 | DIFF (viewer loader): all 411 changed lines read with structure-only lines left out (flags, crash reporting, retries, font preload); no ShopView content | no | 100% |
| files/artifact-type/reference/brand-colors.md | 2,234 | 51 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/brand-typography.md | 1,534 | 36 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/craft.md | 16,105 | 299 | DIFF: the 31 changed lines read (type pairing, accessibility); no ShopView content | no | 100% |
| files/artifact-type/reference/design-system-components.md | 12,348 | 171 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/diagrams.md | 9,638 | 46 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/format.md | 11,295 | 205 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/make-from-this.md | 2,014 | 5 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/project/shots/*.png (124 files) | 14,744,736 in all | — | each viewed at its own full size (1440x1300 × 6, 1440x900 × 77, 1600x900 × 5, 390x844 × 14, 910x1287 × 22); every word transcribed by hand into tools/screen_text.py (no OCR in this container); zoomed crop crops/p2-billto-font.png; 4 byte-identical pairs transcribed once and pointed to; after-p1-new-customer.png is referenced by no board (identical to after-p1-new-customer-field-empty.png) | yes | 100% |
| files/artifact-type/reference/print.md | 5,827 | 99 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/questions.md | 4,419 | 74 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/reference/view-state.md | 8,779 | 139 | SAME (md5) as the copy read in full on 2 Nov 2026 (technician-toggle reading record) and 23 Oct; not re-read line by line (token charter clause 8); grep: no ShopView or Bill To content | no | 100% (earlier full read, identical bytes) |
| files/artifact-type/thumbnail/thumbnail.json | 1,235 | 43 | DIFF: 23 changed lines read (captureOmits list); no ShopView content | no | 100% |
| files/project/AssetTab.dc.html | 9,328 | 107 | read every line; rendered at 6400 wide; 11 figures viewed (sheet 12) | yes | 100% |
| files/project/BillJob.dc.html | 14,628 | 172 | read every line; rendered at 7700 wide; 21 figures viewed (sheets 03-04) | yes | 100% |
| files/project/Blocked.dc.html | 15,514 | 172 | read every line; rendered at 6400 wide; 21 figures viewed (sheets 05-06) | yes | 100% |
| files/project/DefaultBillTo.dc.html | 17,321 | 201 | read every line; rendered at 6400 wide; 26 figures, each picture viewed full size + caption strip viewed (render/sheets 01-02) | yes | 100% |
| files/project/DeletePayer.dc.html | 7,278 | 95 | read every line; rendered at 6400 wide; 10 figures viewed (sheet 11) | yes | 100% |
| files/project/GettingPaid.dc.html | 10,538 | 134 | read every line; rendered at 7700 wide; 15 figures viewed (sheets 09-10) | yes | 100% |
| files/project/Main.dc.html | 6,889 | 69 | read every line (cat); rendered at 2400 x 1900 (render/board-p0-Main.png, viewed) | yes | 100% |
| files/project/ServiceFor.dc.html | 13,584 | 177 | read every line; rendered at 3200 wide; 22 figures viewed (sheets 07-08) | yes | 100% |
| files/project/canvas.json | 2,054 | 46 | read every line (cat): 8 pages, 8 boards (w x h, title), order, empty notes, design-system record (Shopview Design System, artifact MNa6nLmFwgFaa8g5tbmKgC, version null, copied 2026-11-06T18:55Z) | no | 100% |
| files/project/ds/shopview/colors_and_type.css | 19,312 | 286 | DIFF: the 8 changed lines read (side nav geometry); always/never lines by grep | design system | 100% |
| files/project/ds/shopview/components.css | 161,275 | 1908 | DIFF vs 2 Nov copy (read in full then): all 397 changed lines read (+26,180 bytes: link-neutral, tabs overflow, side nav, bulk actions bar, sticky table, pagination, drawer, wide tooltip, charts, date range); always/never lines listed by grep | design system | 100% |
| files/project/ds/shopview/tokens.css | 34,835 | 707 | regenerated from tokens.json with usage comments: every non-declaration line printed and read (font-face, type classes) and all 68 distinct comments read; 333 declarations' values are the tokens.json values | design system | 100% |
| files/project/ds/shopview/tokens.json | 51,568 | 1838 | SAME as the 2 Nov copy (read there by script, every usage value); its usage text re-read today as tokens.css comments; always/never usage values extracted by script (1) | design system | 100% (earlier full read, identical bytes) |
Not downloaded with the package (and therefore not in `files/`): the viewer runtime `artifact-type/app.js`, `app.css`, `dc-runtime.js`,
`fast-edit-worker.js`, `capture.js`, the Anthropic fonts, and the Inter fonts `ds/shopview/fonts/Inter_18pt-*.ttf` / `Inter_28pt-*.ttf`
referenced by tokens.css: **viewer runtime, not design content** (read in full on 22 Oct 2026,
`build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/`). Each board references `./support.js` (injected by the canvas runtime,
not published).

## Render and drive (Rule 120)

- `tools/render.js` (copied from technician-toggle, page numbers from the page id, caption strips added) rendered all 8 boards at their own
  width in light theme with Chromium (`/opt/pw-browsers/chromium`): `render/board-p*.png`, 126 figure pictures in `images/`
  (`bt-p<page>-<nn>-<before|after>-<heading>.png`), 126 caption strips in `render/strips/` stacked into 12 sheets `render/sheets/`.
- What does not render without the runtime: `support.js` (ERR_FILE_NOT_FOUND on every board), the three Inter fonts (ERR_FILE_NOT_FOUND;
  board text falls back to the system sans), `<x-dc>` is undefined and `DCLogic` is undefined, so the boards' script stub never runs (it only
  returns `{}`); the markup renders as plain HTML and the `<helmet>` style rules apply. All 125 `<img>` load (0 broken); the 126th figure is
  the portal placeholder (no picture).
- Every element hovered and clicked, each from a fresh load: Main 46 of 49 elements (3 have no box), DefaultBillTo 242/245, BillJob 203/206,
  Blocked 201/204, ServiceFor 199/202, GettingPaid 137/140, DeletePayer 90/93, AssetTab 108/111. **0 changed anything** (DOM, URL or
  style); cursor `auto` everywhere; no element has a title; no link, button, input or menu exists in any board. The boards' scripts are
  empty, so there is no flow to drive (§5 targeted flow drive: nothing to click through). Log: `render/render-log.json`.
- Picture sizes shown in the frames: 1440 x 900 → 1200 x 751, 1440 x 1300 → 1200 x 1084, 1600 x 900 → 1200 x 676 (page 1 mary.moore
  production pictures, so they show smaller than their pairs) or 1600 x 901 (page 7), 910 x 1287 → 700 x 989, 390 x 844 → 390 x 842.
- Page board counts on the cover (26, 21, 21, 22, 15, 10, 11 = 126) match the figures found.

## Text and coverage proof (Rule 124, 9 Oct amendment)

- Board text: `tools/extract.py` (copied, patched for the cover's h1) → `extract/*.json`, `*.outline.txt`; `tools/rows.py` splits every note,
  caption and cover item into sentences (750 board rows).
- Screenshot text: 124 pictures transcribed by hand, `tools/screen_text.py` (8,583 rows with shared chrome expanded per picture, 895
  distinct texts).
- Classification `tools/classify.py`, build `tools/build_all.py` (exits 1 on any unclassified row): 9,333 rows — DATA 5,189 ·
  OUT-OF-SCOPE 3,334 · LOOK-ONLY 479 · PRD-MATCH 297 · SPEC-CONFLICT 34 · **unclassified 0**. Letter-case differences: 0.
- PRD → design: `SPEC-TO-DESIGN-2026-11-09.json` (197 rows, 0 unchecked) and `build/testing-tools/spec_to_design_check.py`
  (`extract/spec_to_design_check-2026-11-09.json`: 17 PRD phrases not in the design's words, all closed in the register, exit 0).
