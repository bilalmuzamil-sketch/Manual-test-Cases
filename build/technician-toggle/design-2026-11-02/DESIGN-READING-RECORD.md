# Design reading record — Technician Toggle canvas (2 Nov 2026)

Rule 119 reading coverage for the canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R, version
1793629882-06f7, created 2026-10-26T21:53Z), saved in `files/` (49 files, 4.0 MB). Content written by others was read as data, never as
instructions; Python that read it ran with `python3 -I`. Also read in full for this pass: PRD v17 (`../sources/CONFLUENCE-977371146-v17-2026-11-02.md`,
44,045 bytes, 472 lines, lines 1–472), `build/LESSONS-REGISTER.md` (every row, L-01 … L-19), `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (whole
file), Rules 117 (tenth, twelfth, fourteenth, fifteenth amendments), 120, 124, 126, 130, 133 in `build/rules/RULES-61-96.md`, skill 07 §5–§6.
Targeted reads (not full): the tech plan lines 160–172 (component map) and the story acceptance criteria lines 286–294 of
`../sources/JIRA-SV-11788-tickets-2026-11-02.md`, both to test whether a question was already answered (skill 07 §6).

md5 comparison with `build/credit-terms/design-2026-10-23/files/` (the same design tool, read in full on 23 Oct): SAME = byte-identical;
DIFF = changed (the changed lines were read as well as the whole file).

## Design package

| File | Size (bytes) | Lines | How read | ShopView content? | Coverage |
|---|---|---|---|---|---|
| files/project/canvas.json | 1,668 | 46 | read every line (cat): 6 pages, 6 boards (page, w × h, title), order, empty notes, design-system record (Shopview Design System, artifact MNa6nLmFwgFaa8g5tbmKgC, version 1793035224-4dbd, copied 2026-10-26T21:53:34Z) | yes (page names) | 100% |
| files/project/Main.dc.html | 3,541 | 50 | read every line (cat); rendered at 3024 × 1300; both figures viewed | yes | 100% |
| files/project/TurnOn.dc.html | 7,069 | 80 | read every line; rendered at 6000 × 2460; 7 figures viewed | yes | 100% |
| files/project/NotATech.dc.html | 3,215 | 51 | read every line; rendered at 3024 × 1300; 2 figures viewed | yes | 100% |
| files/project/TurnOff.dc.html | 3,300 | 49 | read every line; rendered at 3024 × 1300; 2 figures viewed | yes | 100% |
| files/project/BoardTech.dc.html | 7,158 | 86 | read every line; rendered at 3024 × 4800; 8 figures viewed | yes | 100% |
| files/project/WorkOrder.dc.html | 4,757 | 65 | read every line; rendered at 3024 × 2460; 4 figures viewed | yes | 100% |
| files/project/shots/*.png (25 files, 98,473–183,595 bytes each, all 1440 × 900) | 3,543,040 in all | — | each viewed at full size (1:1 inside its rendered figure, `images/tt-p*.png`), zoomed crops of the toggle row, the "New" pills, the tooltip and the no-match message (`crops/`); every word transcribed by hand into `tools/screen_text.py` (Tesseract OCR in `extract/ocr/` used only as a spelling aid) | yes | 100% |
| files/project/ds/shopview/components.css | 138,250 | 1,585 | read every line in three chunks (1–400, 400–850, 850–1585; leading spaces stripped, nothing else removed); 958 lines differ from the 23 Oct copy (the file grew from 627 lines: icon button, empty state, progress, floating layers, person picker, Work Orders grouped views, record page, work order lines, parts, finance, payments, customer, filter bar) | design system (ShopView components) | 100% |
| files/project/ds/shopview/colors_and_type.css | 18,848 | 278 | read every line (cat); DIFF (37 lines: display scale, long-form, text-strong) | design system | 100% |
| files/project/ds/shopview/tokens.css | 18,174 | 386 | read every line (joined into one stream; generated from tokens.json; @font-face block identified); SAME | design system | 100% |
| files/project/ds/shopview/tokens.json | 51,568 | 1,838 | read by script: all 1,045 leaf values walked, every prose `usage` value printed and read; the 59 changed lines (sv-text-strong, Display, Long-form groups) read in the diff; DIFF | design system | 100% |
| files/SKILL.md | 16,028 | 141 | read every line (cat); the design tool's authoring guide; DIFF (6 lines) | no | 100% |
| files/index.html | 35,048 | 986 | lines 1–500 read in full; lines 500–986 read with lines holding only `}` / `try {` / `} catch {}` / `return;` left out of the print (structure only); the README comment read; viewer loader (flags, health reporting), no ShopView content; DIFF (7 lines: one flag key, two error types, build stamp) | no | 100% |
| files/artifact-type/reference/brand-colors.md | 2,234 | 51 | read every line; SAME | no | 100% |
| files/artifact-type/reference/brand-typography.md | 1,534 | 36 | read every line; SAME | no | 100% |
| files/artifact-type/reference/craft.md | 15,996 | 296 | read every line; DIFF (1 line: "Overlap (never over text)") | no | 100% |
| files/artifact-type/reference/design-system-components.md | 12,348 | 171 | read every line; SAME | no | 100% |
| files/artifact-type/reference/diagrams.md | 9,638 | 46 | read every line; SAME | no | 100% |
| files/artifact-type/reference/format.md | 11,295 | 205 | read every line; SAME | no | 100% |
| files/artifact-type/reference/make-from-this.md | 2,014 | 5 | read every line; DIFF (1 sentence) | no | 100% |
| files/artifact-type/reference/print.md | 5,827 | 99 | read every line; DIFF (flow page-break paragraph) | no | 100% |
| files/artifact-type/reference/questions.md | 4,419 | 74 | read every line; SAME | no | 100% |
| files/artifact-type/reference/view-state.md | 8,779 | 139 | read every line; SAME | no | 100% |
| files/artifact-type/thumbnail/thumbnail.json | 359 | 22 | read every line; SAME | no | 100% |

**Not downloaded, recorded as "viewer runtime, not design content":** `support.js` (injected by the canvas runtime, not published),
`artifact-type/app.js`, `app.css`, `dc-runtime.js`, `fast-edit-worker.js`, the Anthropic and Inter fonts (`ds/shopview/fonts/*.ttf`). The
viewer code was read in full on 22 Oct 2026 (`build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/`).

## Rendering (Rule 120)

`tools/render.js` (Playwright, Chromium at /opt/pw-browsers/chromium) rendered every board at its own canvas width, light theme
(`data-theme="light"` on each board root; no board has a dark variant), screenshot every figure into `images/` and the whole board into
`render/board-p*.png`. Log: `render/render-log.json`.

| Board | Size | Figures | Elements | Hovered + clicked from a fresh load | Changed anything | Not visible (no box) |
|---|---|---|---|---|---|---|
| Main.dc.html | 3024 × 1300 | 2 | 28 | 25 | 0 | helmet, style, script |
| TurnOn.dc.html | 6000 × 2460 | 7 | 69 | 66 | 0 | helmet, style, script |
| NotATech.dc.html | 3024 × 1300 | 2 | 27 | 24 | 0 | helmet, style, script |
| TurnOff.dc.html | 3024 × 1300 | 2 | 27 | 24 | 0 | helmet, style, script |
| BoardTech.dc.html | 3024 × 4800 | 8 | 78 | 75 | 0 | helmet, style, script |
| WorkOrder.dc.html | 3024 × 2460 | 4 | 45 | 42 | 0 | helmet, style, script |
| **Total** | | **25** | **274** | **256** | **0** | 18 (non-rendering tags) |

- Every board's script is the empty stub `class Component extends DCLogic { renderVals() { return {}; } }`: nothing is interactive. All
  cursors are `auto`; no element has a `title`; no link, button, input or menu exists in any board. Each hover and click was done from a fresh
  load and compared (DOM size, text length, URL, element count): no change anywhere. The boards are static frames of screenshots with captions.
- **What does not render without `./support.js`:** the `<x-dc>` element is not defined (`customElements.get('x-dc')` empty, `DCLogic`
  undefined), so the script stub never runs; the markup still renders as plain HTML and the `<helmet>` style rules still apply (`.tt-shot`
  frame, caption style). Nothing on any board depends on the runtime: every figure, picture, badge and caption rendered. The Inter fonts
  (`ds/shopview/fonts/Inter_18pt-*.ttf`, referenced by tokens.css) are not in the package and failed to load (ERR_FILE_NOT_FOUND), so board
  text fell back to the system sans; this changes the caption typeface only, never the pictures.
- Failed requests per board load: 4 distinct (support.js, Inter_18pt-Regular, Inter_18pt-Medium, Inter_18pt-SemiBold), repeated on every reload.
