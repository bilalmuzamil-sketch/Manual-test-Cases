# Design reading record — Internal Work Orders (12 Nov 2026)

Design: https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, canvas "Internal Work Orders · All flows v6", version 1794484794-2031 (the stamp is in the QA lead's saved `_t.html`). Saved package: `design-2026-11-12/files/` (174 files). The QA lead's browser save: `from-qa-lead-2026-11-12-final/`.

Reading coverage (Rule 119): every board file read in full (the 4 component artboards line by line with styles stripped; the 163 flow boards by script: their own content after the shared head, which was proved identical, then the 127 distinct bodies read in full and the 33 Happy/Review copies proved equal to their flow board apart from the title, `render/hf-rv-diffs.txt`); canvas.json read in full; the PRD read in full (805 lines, 179,770 bytes, 100%). The design-system bundle `_ds_bundle.js` was read in full, line by line (12,181 lines, 413,134 bytes, 100%, 20 chunks with running notes in `render/ds-bundle-reading-notes.md`); the two style sheets were read in full as well (see the table).

## Package files

| File | Bytes | Lines | sha256 (first 16) | How read |
|---|---|---|---|---|
| SKILL.md | 16906 | 142 | 6ba790a1bcbdf096 | byte-identical to build/ar-ap-report-sorting/currency-2026-11-10/design-current/SKILL.md (the canvas artifact type's own skill, read there); not design content |
| artifact-type/dc-runtime.js | 188749 | 352 | b795ee21261f2e7d | lines 1-303: the React and ReactDOM production builds (vendor code, identified by their licence headers, not read line by line); lines 304-351: the canvas runtime, read where it decides boot, dc-import, x-import and file loading (to build support.js); used as support.js for every render |
| index.html | 47000 | 1309 | 5020568ee6b6c443 | the canvas viewer page of the artifact type (no board content); scanned for design words: none |
| project/New-WO-Dialog-v6.dc.html | 21261 | 226 | fbf88daa15b3301d | read in full, rendered |
| project/WO-Detail-Artboard-v6.dc.html | 82705 | 773 | 6f8509d2e1854ab8 | read in full (styles stripped for reading; every line of markup and script), rendered at default props on Shared screens and through 80 boards |
| project/WO-List-Artboard-v6.dc.html | 13444 | 143 | bc0e80529a289115 | read in full, rendered |
| project/WO-Settings-Artboard-v6.dc.html | 37483 | 352 | d85c7c62ece3b1dc | read in full (styles stripped), rendered |
| project/_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bundle.js | 413134 | 12181 | 2d3b35bf72006c50 | read in full, line by line, with the Read tool: lines 1-12,181 (100%) in 20 consecutive chunks (1-660, 661-1240, 1241-1819, 1820-2063, 2064-2783, 2784-3481, 3482-4301, 4302-5107, 5108-5899, 5900-6559, 6560-7215, 7216-7655, 7656-8200, 8201-8720, 8721-9290, 9291-9985, 9985-10544, 10545-11104, 11105-11664, 11665-12181), all 19 source sections; running notes per chunk in render/ds-bundle-reading-notes.md; the 27 rules that touch these screens in tools/library_rules.py (checked word for word against the bundle) and in the text inventory |
| project/_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/colors_and_type.css | 35994 | 583 | 2d2205d34c759159 | read in full (lines 1-400 and 401-582, plus the ends of the long lines); tokens matched to the rendered computed styles (warning and neutral badge tones); notes in render/ds-bundle-reading-notes.md |
| project/_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components.css | 41791 | 649 | cb960b7228e3d164 | read in full (lines 1-330 and 331-648, plus the ends of the long lines); rules L28-L31 in tools/library_rules.py; notes in render/ds-bundle-reading-notes.md |
| project/canvas.json | 89552 | 3202 | adcbd59fb5e04b47 | read in full (page list, 167 boards, 198 notes: every note read word for word in render/canvas-layout.txt) |

## Boards (all 167, every page of the dropdown)

Each board rendered locally at its own size (light theme) with the canvas runtime as `support.js` (`tools/serve.js`, `tools/render.js`), screenshot in `images/`, every visible text extracted with its box and style, and every interactive candidate (button, link, input, label, role, tabindex, title, pointer cursor) hovered and clicked from a known state. Boards whose source is the same apart from the title were driven once and recorded for each. "Cut" = text the board's own frame hides (read from the source and the frame-opened render in `render/full/`).

| Page | # | Board title | File | Size | Bytes | sha256 (16) | Picture | Drive (candidates / exposed) | Cut by frame |
|---|---|---|---|---|---|---|---|---|---|
| Happy flow v6 | 01 | 01 Turn on Internal Work Orders | hf-01.dc.html | 1280x1000 | 1238 | fb2d6583397eed63 | iwo-happy-01-01-turn-on-internal-work-orders.png | 45 / 0 |  |
| Happy flow v6 | 02 | 02 Pick your internal customers | hf-02.dc.html | 1280x1000 | 4317 | 6fc316f7270a3e3a | iwo-happy-02-02-pick-your-internal-customers.png | 66 / 0 |  |
| Happy flow v6 | 03 | 03 Setting on | hf-03.dc.html | 1280x1000 | 1232 | b54da6502db9bd42 | iwo-happy-03-03-setting-on.png | 49 / 3 |  |
| Happy flow v6 | 04 | 04 Internal categories | hf-04.dc.html | 1280x1000 | 1278 | b861b3769f431bc7 | iwo-happy-04-04-internal-categories.png | 40 / 1 |  |
| Happy flow v6 | 05 | 05 No Charge categories | hf-05.dc.html | 1280x1000 | 1279 | bcb5f471be7d884a | iwo-happy-05-05-no-charge-categories.png | 40 / 1 |  |
| Happy flow v6 | 06 | 06 New No Charge category | hf-06.dc.html | 1280x1000 | 1303 | 04c0934bf07e1583 | iwo-happy-06-06-new-no-charge-category.png | 53 / 0 |  |
| Happy flow v6 | 07 | 07 Customers list | hf-07.dc.html | 1280x840 | 4536 | 4d266b273d4ac8bc | iwo-happy-07-07-customers-list.png | 9 / 0 |  |
| Happy flow v6 | 08 | 08 Edit Customer · Internal customer | hf-08.dc.html | 1280x1240 | 7265 | f066e504d176be93 | iwo-happy-08-08-edit-customer-internal-customer.png | 52 / 0 |  |
| Happy flow v6 | 09 | 09 Edit Asset · internal category | hf-09.dc.html | 1280x1000 | 5518 | c5888a16abdc9c2e | iwo-happy-09-09-edit-asset-internal-category.png | 36 / 0 |  |
| Happy flow v6 | 10 | 10 QuickBooks · one row per category | hf-10.dc.html | 1280x1000 | 20785 | 793e8062588edb2a | iwo-happy-10-10-quickbooks-one-row-per-category.png | 46 / 0 | 7 |
| Happy flow v6 | 11 | 11 Work orders list | hf-11.dc.html | 1440x680 | 1191 | 63de4eac3e9733e4 | iwo-happy-11-11-work-orders-list.png | 25 / 4 |  |
| Happy flow v6 | 12 | 12 New work order · internal customer | hf-12.dc.html | 1280x680 | 1281 | eb37fcb3f4011e65 | iwo-happy-12-12-new-work-order-internal-customer.png | 41 / 0 |  |
| Happy flow v6 | 13 | 13 Asset with its own category | hf-13.dc.html | 1280x680 | 1328 | 427b6c096a9da13b | iwo-happy-13-13-asset-with-its-own-category.png | 37 / 0 |  |
| Happy flow v6 | 14 | 14 In progress: cost and hours, no prices | hf-14.dc.html | 1280x840 | 1249 | 23440d376aaa7c45 | iwo-happy-14-14-in-progress-cost-and-hours-no-prices.png | 20 / 0 | 5 |
| Happy flow v6 | 15 | 15 Finance tab | hf-15.dc.html | 1280x840 | 1201 | 98af5e0723a6625c | iwo-happy-15-15-finance-tab.png | 25 / 0 | 12 |
| Happy flow v6 | 16 | 16 Complete, ready to close | hf-16.dc.html | 1280x840 | 1207 | 077c62b3267250c9 | iwo-happy-16-16-complete-ready-to-close.png | 18 / 0 | 3 |
| Happy flow v6 | 17 | 17 Close confirmation | hf-17.dc.html | 1280x840 | 4736 | adc901c3f6197e60 | iwo-happy-17-17-close-confirmation.png | 32 / 0 | 12 |
| Happy flow v6 | 18 | 18 Closed · INTERNAL document | hf-18.dc.html | 1280x840 | 1285 | 1f7c0e047360e43a | iwo-happy-18-18-closed-internal-document.png | 24 / 0 | 12 |
| Happy flow v6 | 19 | 19 Work orders list · Status Closed | hf-19.dc.html | 1440x680 | 1265 | bdf76ff4199b4bec | iwo-happy-19-19-work-orders-list-status-closed.png | 29 / 3 |  |
| Happy flow v6 | 20 | 20 New work order · No Charge, category, original | hf-20.dc.html | 1280x1120 | 1368 | 1ea55635332a3593 | iwo-happy-20-20-new-work-order-no-charge-category-original.png | 46 / 0 |  |
| Happy flow v6 | 21 | 21 Or convert a billable work order | hf-21.dc.html | 1280x840 | 1243 | 272e465dfc217cdf | iwo-happy-21-21-or-convert-a-billable-work-order.png | 25 / 0 |  |
| Happy flow v6 | 22 | 22 Confirm: category and original work order | hf-22.dc.html | 1280x960 | 4091 | 33b52a2a9d15ef2a | iwo-happy-22-22-confirm-category-and-original-work-order.png | 32 / 0 |  |
| Happy flow v6 | 23 | 23 After the convert | hf-23.dc.html | 1280x840 | 1245 | 496d3d1a5d92b347 | iwo-happy-23-23-after-the-convert.png | 17 / 0 |  |
| Happy flow v6 | 24 | 24 Notes record the convert | hf-24.dc.html | 1280x840 | 1282 | 30ff6160e791a4d0 | iwo-happy-24-24-notes-record-the-convert.png | 20 / 0 |  |
| Happy flow v6 | 25 | 25 Change category | hf-25.dc.html | 1280x840 | 2926 | e5036563309932e2 | iwo-happy-25-25-change-category.png | 27 / 0 |  |
| Happy flow v6 | 26 | 26 Convert to Billable | hf-26.dc.html | 1280x840 | 2415 | 3c23b26518bad559 | iwo-happy-26-26-convert-to-billable.png | 28 / 0 |  |
| Happy flow v6 | 27 | 27 Close · original work order required | hf-27.dc.html | 1280x840 | 5187 | 523e910c2ce30159 | iwo-happy-27-27-close-original-work-order-required.png | 34 / 0 | 3 |
| Happy flow v6 | 28 | 28 Close confirmation | hf-28.dc.html | 1280x840 | 3666 | 29c1cdc490feee24 | iwo-happy-28-28-close-confirmation.png | 26 / 0 | 3 |
| Happy flow v6 | 29 | 29 Closed · NO CHARGE document | hf-29.dc.html | 1280x840 | 1341 | 5f218ac4fd143afd | iwo-happy-29-29-closed-no-charge-document.png | 23 / 0 |  |
| Happy flow v6 | 30 | 30 Line menu · Mark as No Charge | hf-30.dc.html | 1280x840 | 1220 | 3b2d2bd1dfc1e63c | iwo-happy-30-30-line-menu-mark-as-no-charge.png | 25 / 0 |  |
| Happy flow v6 | 31 | 31 Mark this line as No Charge? | hf-31.dc.html | 1280x1000 | 4579 | 437027c6dfe0c7c0 | iwo-happy-31-31-mark-this-line-as-no-charge.png | 32 / 0 |  |
| Happy flow v6 | 32 | 32 Line marked No Charge · $0.00 | hf-32.dc.html | 1280x840 | 1224 | 5e4204a2e41399be | iwo-happy-32-32-line-marked-no-charge-0-00.png | 18 / 0 |  |
| Happy flow v6 | 33 | 33 Line menu · Change category, Mark as Billable | hf-33.dc.html | 1280x840 | 1259 | 30d4c724e0e50d78 | iwo-happy-33-33-line-menu-change-category-mark-as-billable.png | 26 / 0 |  |
| Happy flow v6 | 34 | 34 Notes and Audit Log | hf-34.dc.html | 1280x840 | 1240 | e5784c75038f52de | iwo-happy-34-34-notes-and-audit-log.png | 21 / 0 |  |
| Happy flow v6 | 35 | 35 Invoice · the line at $0.00, Warranty | hf-35.dc.html | 1280x1500 | 1245 | 257e8caa7c1f4d89 | iwo-happy-35-35-invoice-the-line-at-0-00-warranty.png | 25 / 0 |  |
| Happy flow v6 | 36 | 36 Closed work order | hf-36.dc.html | 1280x840 | 1285 | ae00dc407b6d38aa | iwo-happy-36-36-closed-work-order.png | 17 / 0 | 4 |
| Happy flow v6 | 37 | 37 Reopen Work Order | hf-37.dc.html | 1280x840 | 2272 | 2fad357aa0294baa | iwo-happy-37-37-reopen-work-order.png | 23 / 0 | 3 |
| Happy flow v6 | 38 | 38 Work orders list · Classification | hf-38.dc.html | 1440x680 | 1235 | 0284b96add7b5b21 | iwo-happy-38-38-work-orders-list-classification.png | 23 / 4 |  |
| Happy flow v6 | 39 | 39 Internal Work Orders report | hf-39.dc.html | 1280x900 | 14810 | ed27c3968e3bc0a4 | iwo-happy-39-39-internal-work-orders-report.png | 47 / 2 |  |
| Happy flow v6 | 40 | 39b Internal Work Orders report · by technician | hf-39b.dc.html | 1280x900 | 14830 | 6f5bd050ebef152c | iwo-happy-40-39b-internal-work-orders-report-by-technician.png | 45 / 0 |  |
| Happy flow v6 | 41 | 40 QuickBooks · held entry | hf-40.dc.html | 1280x840 | 10129 | 0f28b145b3afff47 | iwo-happy-41-40-quickbooks-held-entry.png | 38 / 0 |  |
| Happy flow v6 | 42 | 41 AccountingHub · Closed record | hf-41.dc.html | 1280x840 | 4847 | 44a86f08e2d7bf66 | iwo-happy-42-41-accountinghub-closed-record.png | 12 / 0 |  |
| Happy flow v6 | 43 | 42 AccountingHub · Held event | hf-42.dc.html | 1280x840 | 3772 | 7376f9eba9fe769d | iwo-happy-43-42-accountinghub-held-event.png | 9 / 0 |  |
| Happy flow v6 | 44 | 41b AccountingHub · Invoice record with one No Charge line | hf-41b.dc.html | 1280x840 | 5732 | 17030dc249957965 | iwo-happy-44-41b-accountinghub-invoice-record-with-one-no-charg.png | 11 / 0 | 6 |
| Review · What changed after the CEO review | 01 | 1.1 · 01 Turn on Internal Work Orders | rv-1-1.dc.html | 1280x1000 | 1519 | 50b832aa008956b3 | iwo-review-01-1-1-01-turn-on-internal-work-orders.png | 45 / 0 | 2 |
| Review · What changed after the CEO review | 02 | 1.2 · 02 Pick your internal customers | rv-1-2.dc.html | 1280x1000 | 4317 | 6fc316f7270a3e3a | iwo-review-02-1-2-02-pick-your-internal-customers.png | same source as hf-02.dc.html (driven there) |  |
| Review · What changed after the CEO review | 03 | 1.3 · 03 Setting on | rv-1-3.dc.html | 1280x1000 | 1232 | b54da6502db9bd42 | iwo-review-03-1-3-03-setting-on.png | same source as hf-03.dc.html (driven there) |  |
| Review · What changed after the CEO review | 04 | 2.1 · 04 Internal categories | rv-2-1.dc.html | 1280x1000 | 1278 | b861b3769f431bc7 | iwo-review-04-2-1-04-internal-categories.png | same source as hf-04.dc.html (driven there) |  |
| Review · What changed after the CEO review | 05 | 2.2 · 05 No Charge categories | rv-2-2.dc.html | 1280x1000 | 1279 | bcb5f471be7d884a | iwo-review-05-2-2-05-no-charge-categories.png | same source as hf-05.dc.html (driven there) |  |
| Review · What changed after the CEO review | 06 | 2.3 · 06 New No Charge category | rv-2-3.dc.html | 1280x1000 | 1303 | 04c0934bf07e1583 | iwo-review-06-2-3-06-new-no-charge-category.png | same source as hf-06.dc.html (driven there) |  |
| Review · What changed after the CEO review | 07 | 3.1 · 10 QuickBooks · one row per category | rv-3-1.dc.html | 1280x1000 | 20785 | 793e8062588edb2a | iwo-review-07-3-1-10-quickbooks-one-row-per-category.png | same source as hf-10.dc.html (driven there) | 7 |
| Review · What changed after the CEO review | 08 | 3.2 · 08 Edit Customer · Internal customer | rv-3-2.dc.html | 1280x1240 | 7265 | f066e504d176be93 | iwo-review-08-3-2-08-edit-customer-internal-customer.png | same source as hf-08.dc.html (driven there) |  |
| Review · What changed after the CEO review | 09 | 3.3 · 09 Edit Asset · internal category | rv-3-3.dc.html | 1280x1000 | 5518 | c5888a16abdc9c2e | iwo-review-09-3-3-09-edit-asset-internal-category.png | same source as hf-09.dc.html (driven there) |  |
| Review · What changed after the CEO review | 10 | 3.4 · 12 New work order · internal customer | rv-3-4.dc.html | 1280x680 | 1281 | eb37fcb3f4011e65 | iwo-review-10-3-4-12-new-work-order-internal-customer.png | same source as hf-12.dc.html (driven there) |  |
| Review · What changed after the CEO review | 11 | 3.5 · 13 Asset with its own category | rv-3-5.dc.html | 1280x680 | 1328 | 427b6c096a9da13b | iwo-review-11-3-5-13-asset-with-its-own-category.png | same source as hf-13.dc.html (driven there) |  |
| Review · What changed after the CEO review | 12 | 3.6 · 20 New work order · No Charge, category, original | rv-3-6.dc.html | 1280x1120 | 1368 | 1ea55635332a3593 | iwo-review-12-3-6-20-new-work-order-no-charge-category-original.png | same source as hf-20.dc.html (driven there) |  |
| Review · What changed after the CEO review | 13 | 4.1 · 21 Or convert a billable work order | rv-4-1.dc.html | 1280x840 | 1243 | 272e465dfc217cdf | iwo-review-13-4-1-21-or-convert-a-billable-work-order.png | same source as hf-21.dc.html (driven there) |  |
| Review · What changed after the CEO review | 14 | 4.2 · 22 Confirm: category and original work order | rv-4-2.dc.html | 1280x960 | 4091 | 33b52a2a9d15ef2a | iwo-review-14-4-2-22-confirm-category-and-original-work-order.png | same source as hf-22.dc.html (driven there) |  |
| Review · What changed after the CEO review | 15 | 4.3 · 25 Change category | rv-4-3.dc.html | 1280x840 | 2926 | e5036563309932e2 | iwo-review-15-4-3-25-change-category.png | same source as hf-25.dc.html (driven there) |  |
| Review · What changed after the CEO review | 16 | 4.4 · 26 Convert to Billable | rv-4-4.dc.html | 1280x840 | 2415 | 3c23b26518bad559 | iwo-review-16-4-4-26-convert-to-billable.png | same source as hf-26.dc.html (driven there) |  |
| Review · What changed after the CEO review | 17 | 4.5 · 24 Notes record the convert | rv-4-5.dc.html | 1280x840 | 1282 | 30ff6160e791a4d0 | iwo-review-17-4-5-24-notes-record-the-convert.png | same source as hf-24.dc.html (driven there) |  |
| Review · What changed after the CEO review | 18 | 5.1 · 27 Close · original work order required | rv-5-1.dc.html | 1280x840 | 5187 | 523e910c2ce30159 | iwo-review-18-5-1-27-close-original-work-order-required.png | same source as hf-27.dc.html (driven there) | 3 |
| Review · What changed after the CEO review | 19 | 5.2 · 17 Close confirmation | rv-5-2.dc.html | 1280x840 | 4736 | adc901c3f6197e60 | iwo-review-19-5-2-17-close-confirmation.png | same source as hf-17.dc.html (driven there) | 12 |
| Review · What changed after the CEO review | 20 | 5.3 · 18 Closed · INTERNAL document | rv-5-3.dc.html | 1280x840 | 1285 | 1f7c0e047360e43a | iwo-review-20-5-3-18-closed-internal-document.png | same source as hf-18.dc.html (driven there) | 12 |
| Review · What changed after the CEO review | 21 | 5.4 · 29 Closed · NO CHARGE document | rv-5-4.dc.html | 1280x840 | 1341 | 5f218ac4fd143afd | iwo-review-21-5-4-29-closed-no-charge-document.png | same source as hf-29.dc.html (driven there) |  |
| Review · What changed after the CEO review | 22 | 5.5 · 19 Work orders list · Status Closed | rv-5-5.dc.html | 1440x680 | 1265 | bdf76ff4199b4bec | iwo-review-22-5-5-19-work-orders-list-status-closed.png | same source as hf-19.dc.html (driven there) |  |
| Review · What changed after the CEO review | 23 | 6.1 · 30 Line menu · Mark as No Charge | rv-6-1.dc.html | 1280x840 | 1220 | 3b2d2bd1dfc1e63c | iwo-review-23-6-1-30-line-menu-mark-as-no-charge.png | same source as hf-30.dc.html (driven there) |  |
| Review · What changed after the CEO review | 24 | 6.2 · 31 Mark this line as No Charge? | rv-6-2.dc.html | 1280x1000 | 4579 | 437027c6dfe0c7c0 | iwo-review-24-6-2-31-mark-this-line-as-no-charge.png | same source as hf-31.dc.html (driven there) |  |
| Review · What changed after the CEO review | 25 | 6.3 · 32 Line marked No Charge · $0.00 | rv-6-3.dc.html | 1280x840 | 1224 | 5e4204a2e41399be | iwo-review-25-6-3-32-line-marked-no-charge-0-00.png | same source as hf-32.dc.html (driven there) |  |
| Review · What changed after the CEO review | 26 | 6.4 · 33 Line menu · Change category, Mark as Billable | rv-6-4.dc.html | 1280x840 | 1259 | 30d4c724e0e50d78 | iwo-review-26-6-4-33-line-menu-change-category-mark-as-billable.png | same source as hf-33.dc.html (driven there) |  |
| Review · What changed after the CEO review | 27 | 6.5 · 34 Notes and Audit Log | rv-6-5.dc.html | 1280x840 | 1240 | e5784c75038f52de | iwo-review-27-6-5-34-notes-and-audit-log.png | same source as hf-34.dc.html (driven there) |  |
| Review · What changed after the CEO review | 28 | 6.6 · 35 Invoice · the line at $0.00, Warranty | rv-6-6.dc.html | 1280x1500 | 1245 | 257e8caa7c1f4d89 | iwo-review-28-6-6-35-invoice-the-line-at-0-00-warranty.png | same source as hf-35.dc.html (driven there) |  |
| Review · What changed after the CEO review | 29 | 7.1 · 38 Work orders list · Classification | rv-7-1.dc.html | 1440x680 | 1235 | 0284b96add7b5b21 | iwo-review-29-7-1-38-work-orders-list-classification.png | same source as hf-38.dc.html (driven there) |  |
| Review · What changed after the CEO review | 30 | 7.2 · 39 Internal Work Orders report | rv-7-2.dc.html | 1280x900 | 14817 | 19d29787f1257a7a | iwo-review-30-7-2-39-internal-work-orders-report.png | same source as hf-39.dc.html (driven there) |  |
| Review · What changed after the CEO review | 31 | 7.3 · 41 AccountingHub · Closed record | rv-7-3.dc.html | 1280x840 | 4847 | 44a86f08e2d7bf66 | iwo-review-31-7-3-41-accountinghub-closed-record.png | same source as hf-41.dc.html (driven there) |  |
| Review · What changed after the CEO review | 32 | 7.4 · 42 AccountingHub · Held event | rv-7-4.dc.html | 1280x840 | 3772 | 7376f9eba9fe769d | iwo-review-32-7-4-42-accountinghub-held-event.png | same source as hf-42.dc.html (driven there) |  |
| Review · What changed after the CEO review | 33 | 7.5 · 39b Report · by technician | rv-7-5.dc.html | 1280x900 | 14816 | 457b0c7a7a22d3a5 | iwo-review-33-7-5-39b-report-by-technician.png | same source as hf-39b.dc.html (driven there) |  |
| Review · What changed after the CEO review | 34 | 7.6 · 41b Hub · invoice with one No Charge line | rv-7-6.dc.html | 1280x840 | 5722 | f29b8e12b0df0f4d | iwo-review-34-7-6-41b-hub-invoice-with-one-no-charge-line.png | same source as hf-41b.dc.html (driven there) | 6 |
| Flow 0 · Turn it on | 01 | 01 Settings · Work Orders, setting off | Main.dc.html | 1280x1000 | 1246 | 7bc22e25f9bb9019 | iwo-flow0-01-01-settings-work-orders-setting-off.png | same source as hf-01.dc.html (driven there) |  |
| Flow 0 · Turn it on | 02 | 01b Turn on · pick your internal customers | flow0-1b.dc.html | 1280x1000 | 4329 | ca16ae68490b3c3f | iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png | same source as hf-02.dc.html (driven there) |  |
| Flow 0 · Turn it on | 03 | 02 Settings · setting on | flow0-2.dc.html | 1280x1000 | 1244 | a35fa472579b5f02 | iwo-flow0-03-02-settings-setting-on.png | same source as hf-03.dc.html (driven there) |  |
| Flow 0 · Turn it on | 04 | 2a Internal Work Orders page · Internal categories | flow0-2a.dc.html | 1280x1000 | 1307 | 5d763d8c29d12fee | iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png | same source as hf-04.dc.html (driven there) |  |
| Flow 0 · Turn it on | 05 | 2b Internal Work Orders page · No Charge categories | flow0-2b.dc.html | 1280x1000 | 1308 | 4acbdadbfcab1663 | iwo-flow0-05-2b-internal-work-orders-page-no-charge-categories.png | same source as hf-05.dc.html (driven there) |  |
| Flow 0 · Turn it on | 06 | 2c New No Charge Category | flow0-2c.dc.html | 1280x1000 | 1303 | 20d3f29094062fd6 | iwo-flow0-06-2c-new-no-charge-category.png | same source as hf-06.dc.html (driven there) |  |
| Flow 0 · Turn it on | 07 | 2d New Internal Category | flow0-2d.dc.html | 1280x1000 | 1302 | 00ba9aa4c2d6c119 | iwo-flow0-07-2d-new-internal-category.png | 53 / 0 |  |
| Flow 0 · Turn it on | 08 | 2e Internal Work Orders page · setting off | flow0-2e.dc.html | 1280x1000 | 1287 | 3d0850d0ac549889 | iwo-flow0-08-2e-internal-work-orders-page-setting-off.png | 42 / 1 |  |
| Flow 0 · Turn it on | 09 | 03 Settings · setting on, no flagged customer | flow0-3.dc.html | 1280x1000 | 1270 | 55a9c740a9265e7d | iwo-flow0-09-03-settings-setting-on-no-flagged-customer.png | 49 / 3 |  |
| Flow 0 · Turn it on | 10 | 04 Customers list | flow0-4.dc.html | 1280x840 | 4536 | 17dbea42749b8096 | iwo-flow0-10-04-customers-list.png | same source as hf-07.dc.html (driven there) |  |
| Flow 0 · Turn it on | 11 | 05 Customer page · internal customer | flow0-5.dc.html | 1280x1240 | 7265 | 483e469b7c99ba5c | iwo-flow0-11-05-customer-page-internal-customer.png | same source as hf-08.dc.html (driven there) |  |
| Flow 0 · Turn it on | 12 | 06 Edit Customer · setting off | flow0-6.dc.html | 1280x1240 | 7329 | ba4bbec8e942a4d1 | iwo-flow0-12-06-edit-customer-setting-off.png | 53 / 1 |  |
| Flow 0 · Turn it on | 13 | 07 Make internal · confirm | flow0-7.dc.html | 1280x840 | 5471 | 5969be2428ea8cac | iwo-flow0-13-07-make-internal-confirm.png | 12 / 0 |  |
| Flow 0 · Turn it on | 14 | 08 Remove flag · confirm | flow0-8.dc.html | 1280x1240 | 8471 | 0e38854409101f9a | iwo-flow0-14-08-remove-flag-confirm.png | 56 / 0 |  |
| Flow 0 · Turn it on | 15 | 09 Settings > Integrations > QuickBooks | flow0-9.dc.html | 1280x1000 | 20793 | a00f72391a9d717b | iwo-flow0-15-09-settings-integrations-quickbooks.png | same source as hf-10.dc.html (driven there) | 7 |
| Flow 0 · Turn it on | 16 | 10 QuickBooks · category row not set | flow0-10.dc.html | 1280x1000 | 20745 | 6561bc8573c3ab36 | iwo-flow0-16-10-quickbooks-category-row-not-set.png | 46 / 0 | 7 |
| Flow 0 · Turn it on | 17 | 11 Edit Customer · Min without % | flow0-11.dc.html | 1280x1240 | 7875 | 351ba2c8633d72da | iwo-flow0-17-11-edit-customer-min-without.png | 54 / 0 |  |
| Flow 0 · Turn it on | 18 | 11b Edit Asset · internal category | flow0-11b.dc.html | 1280x1000 | 5519 | cbfde99519bb8672 | iwo-flow0-18-11b-edit-asset-internal-category.png | same source as hf-09.dc.html (driven there) |  |
| Flow 0 · Turn it on | 19 | 12 Settings · turned off | flow0-12.dc.html | 1280x1080 | 1172 | ce78697bb3a15aba | iwo-flow0-19-12-settings-turned-off.png | 45 / 0 |  |
| Flow 1 · Create and close | 01 | 01 Work orders list | flow1-1.dc.html | 1440x680 | 1191 | dd16b8e66006f34f | iwo-flow1-01-01-work-orders-list.png | same source as hf-11.dc.html (driven there) |  |
| Flow 1 · Create and close | 02 | 02a New work order | flow1-2a.dc.html | 1280x680 | 1262 | 4c580e1ee4b40163 | iwo-flow1-02-02a-new-work-order.png | 38 / 0 |  |
| Flow 1 · Create and close | 03 | 02b New work order · internal customer | flow1-2b.dc.html | 1280x680 | 1282 | 9799a1bac3220058 | iwo-flow1-03-02b-new-work-order-internal-customer.png | same source as hf-12.dc.html (driven there) |  |
| Flow 1 · Create and close | 04 | 2b2 New work order · asset with its own category | flow1-2b2.dc.html | 1280x680 | 1347 | 516ff7f74c183ca0 | iwo-flow1-04-2b2-new-work-order-asset-with-its-own-category.png | same source as hf-13.dc.html (driven there) |  |
| Flow 1 · Create and close | 05 | 2c Change customer · bill already posted | flow1-2c.dc.html | 1280x840 | 2397 | dde336a91abf5cf4 | iwo-flow1-05-2c-change-customer-bill-already-posted.png | 22 / 0 | 3 |
| Flow 1 · Create and close | 06 | 2d Change customer · bill already posted | flow1-2d.dc.html | 1280x840 | 2377 | 65019124589cea2e | iwo-flow1-06-2d-change-customer-bill-already-posted.png | 22 / 0 |  |
| Flow 1 · Create and close | 07 | 02e New work order · No Charge ticked | flow1-2e.dc.html | 1280x1120 | 1356 | 68894e8ed014304a | iwo-flow1-07-02e-new-work-order-no-charge-ticked.png | same source as hf-20.dc.html (driven there) |  |
| Flow 1 · Create and close | 08 | 03 Work order · in progress | flow1-3.dc.html | 1280x840 | 1236 | 321d7be3e884def0 | iwo-flow1-08-03-work-order-in-progress.png | same source as hf-14.dc.html (driven there) | 5 |
| Flow 1 · Create and close | 09 | 3c Menu · internal | flow1-3c.dc.html | 1280x840 | 1240 | c39e8578dd9c1bed | iwo-flow1-09-3c-menu-internal.png | 22 / 0 | 3 |
| Flow 1 · Create and close | 10 | 3d Finance tab · Close | flow1-3d.dc.html | 1280x840 | 1233 | 3daff9ab01f2cf1c | iwo-flow1-10-3d-finance-tab-close.png | 25 / 0 | 12 |
| Flow 1 · Create and close | 11 | 3e Lines · core row | flow1-3e.dc.html | 1280x840 | 1218 | a54f0c48245604d9 | iwo-flow1-11-3e-lines-core-row.png | 18 / 0 | 3 |
| Flow 1 · Create and close | 12 | 04 Work order · Finance tab | flow1-4.dc.html | 1280x840 | 1215 | e929b6ccbeff71e2 | iwo-flow1-12-04-work-order-finance-tab.png | same source as hf-15.dc.html (driven there) | 12 |
| Flow 1 · Create and close | 13 | 04b Work order · Ready for review | flow1-4b.dc.html | 1280x840 | 1212 | 5e323c9dcd77e72a | iwo-flow1-13-04b-work-order-ready-for-review.png | 18 / 0 | 3 |
| Flow 1 · Create and close | 14 | 05 Work order · Complete, ready to close | flow1-5.dc.html | 1280x840 | 1221 | 68812daadc017d98 | iwo-flow1-14-05-work-order-complete-ready-to-close.png | same source as hf-16.dc.html (driven there) | 3 |
| Flow 1 · Create and close | 15 | 06 Close · Missing Details first | flow1-6.dc.html | 1280x840 | 2751 | d4006e4b7dd2c067 | iwo-flow1-15-06-close-missing-details-first.png | 28 / 0 | 3 |
| Flow 1 · Create and close | 16 | 07 Close · confirm | flow1-6b.dc.html | 1280x840 | 4734 | dcc53c72ed7ea312 | iwo-flow1-16-07-close-confirm.png | same source as hf-17.dc.html (driven there) | 12 |
| Flow 1 · Create and close | 17 | 7b Close · no account set | flow1-6c.dc.html | 1280x840 | 5056 | 01cb0a8731d1c69b | iwo-flow1-17-7b-close-no-account-set.png | 33 / 0 | 12 |
| Flow 1 · Create and close | 18 | 7c Close · no accounting integration | flow1-6d.dc.html | 1280x840 | 4017 | 3b1aed53c3611887 | iwo-flow1-18-7c-close-no-accounting-integration.png | 30 / 0 | 12 |
| Flow 1 · Create and close | 19 | 7d Close · parts with no cost | flow1-6e.dc.html | 1280x840 | 5282 | 1cc9b34136a83636 | iwo-flow1-19-7d-close-parts-with-no-cost.png | 32 / 0 | 12 |
| Flow 1 · Create and close | 20 | 7e Close · work order changed | flow1-6f.dc.html | 1280x840 | 5104 | eafbea4489523f2a | iwo-flow1-20-7e-close-work-order-changed.png | 33 / 0 | 12 |
| Flow 1 · Create and close | 21 | 7f Close · QuickBooks without inventory accounts | flow1-6g.dc.html | 1280x840 | 4857 | 157a44c9f5055ed8 | iwo-flow1-21-7f-close-quickbooks-without-inventory-accounts.png | 32 / 0 | 12 |
| Flow 1 · Create and close | 22 | 08 Work order · Closed, invoice | flow1-8.dc.html | 1280x840 | 1287 | b705d6418d94501c | iwo-flow1-22-08-work-order-closed-invoice.png | same source as hf-18.dc.html (driven there) | 12 |
| Flow 1 · Create and close | 23 | 09 Work orders list · All tab, Status Closed | flow1-9.dc.html | 1440x680 | 1274 | cb0c36f9969dc27c | iwo-flow1-23-09-work-orders-list-all-tab-status-closed.png | same source as hf-19.dc.html (driven there) |  |
| Flow 1 · Create and close | 24 | 10b Asset · Invoices tab | flow1-10b.dc.html | 1280x840 | 3691 | da7d7a4159459b89 | iwo-flow1-24-10b-asset-invoices-tab.png | 11 / 0 |  |
| Flow 1 · Create and close | 25 | S2 Close Work Order · failed | flow1-S2.dc.html | 1280x840 | 1506 | cdc2bd796d285168 | iwo-flow1-25-s2-close-work-order-failed.png | 19 / 0 | 3 |
| Flow 2 · No charge on a customer's work order | 01 | 01 Convert to No Charge | flow2-1.dc.html | 1280x840 | 1231 | 44158fa45ff28852 | iwo-flow2-01-01-convert-to-no-charge.png | same source as hf-21.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 02 | 1b Convert to No Charge · deposit | flow2-1b.dc.html | 1280x840 | 1266 | b1f64729fef7c254 | iwo-flow2-02-1b-convert-to-no-charge-deposit.png | 25 / 0 |  |
| Flow 2 · No charge on a customer's work order | 03 | 1c Convert to No Charge · no permission | flow2-1c.dc.html | 1280x840 | 1270 | 3d0b1426fa520828 | iwo-flow2-03-1c-convert-to-no-charge-no-permission.png | 24 / 0 |  |
| Flow 2 · No charge on a customer's work order | 04 | 02 Confirm | flow2-2.dc.html | 1280x960 | 4057 | 5e2b487ebf02767e | iwo-flow2-04-02-confirm.png | same source as hf-22.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 05 | 03 No charge work order | flow2-3.dc.html | 1280x840 | 1248 | f0fc421e1728d293 | iwo-flow2-05-03-no-charge-work-order.png | same source as hf-23.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 06 | 3b Convert to Billable · confirm | flow2-3b.dc.html | 1280x840 | 2426 | 47f58e8d7c7dd4a1 | iwo-flow2-06-3b-convert-to-billable-confirm.png | same source as hf-26.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 07 | 3c Change category | flow2-3c.dc.html | 1280x840 | 2926 | 2d87a0a3f2bb8d71 | iwo-flow2-07-3c-change-category.png | same source as hf-25.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 08 | 3d Notes · after Convert to No Charge | flow2-3d.dc.html | 1280x840 | 1293 | a38f96a3415c1c8d | iwo-flow2-08-3d-notes-after-convert-to-no-charge.png | same source as hf-24.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 09 | 3e Notes · after Convert to Billable | flow2-3e.dc.html | 1280x840 | 1251 | e0f383942745c48c | iwo-flow2-09-3e-notes-after-convert-to-billable.png | 21 / 0 |  |
| Flow 2 · No charge on a customer's work order | 10 | 04 Close · confirm | flow2-4.dc.html | 1280x840 | 3664 | 2782901870e55c60 | iwo-flow2-10-04-close-confirm.png | same source as hf-28.dc.html (driven there) | 3 |
| Flow 2 · No charge on a customer's work order | 11 | 4b Close · original work order required | flow2-4b.dc.html | 1280x840 | 5187 | 06d6bdb0ba92457a | iwo-flow2-11-4b-close-original-work-order-required.png | same source as hf-27.dc.html (driven there) | 3 |
| Flow 2 · No charge on a customer's work order | 12 | 05 Finance tab · closed | flow2-5.dc.html | 1280x840 | 1334 | 80e13802b626e0d3 | iwo-flow2-12-05-finance-tab-closed.png | same source as hf-29.dc.html (driven there) |  |
| Flow 2 · No charge on a customer's work order | 13 | 06 Closed · read-only | flow2-6.dc.html | 1280x840 | 1359 | ac7c1151f2ab6c76 | iwo-flow2-13-06-closed-read-only.png | 17 / 0 |  |
| Flow 2 · No charge on a customer's work order | 14 | 07 Finance tab · open estimate | flow2-7.dc.html | 1280x840 | 1318 | a204a472ce99d5ec | iwo-flow2-14-07-finance-tab-open-estimate.png | 21 / 0 |  |
| Flow 2 · No charge on a customer's work order | 15 | 7b Portal · no-charge estimate | flow2-7b.dc.html | 1280x840 | 3631 | d1ede5128fee1f60 | iwo-flow2-15-7b-portal-no-charge-estimate.png | 2 / 0 |  |
| Flow 3 · Reopen | 01 | 01 Work order · Closed | flow3-1.dc.html | 1280x840 | 1288 | 91be808c1bc23452 | iwo-flow3-01-01-work-order-closed.png | same source as hf-36.dc.html (driven there) | 4 |
| Flow 3 · Reopen | 02 | 02 Reopen dialog | flow3-2.dc.html | 1280x840 | 2268 | 418afc640b5141cd | iwo-flow3-02-02-reopen-dialog.png | same source as hf-37.dc.html (driven there) | 3 |
| Flow 3 · Reopen | 03 | 03 Work order · Complete again | flow3-3.dc.html | 1280x840 | 1522 | 29012f3915bc76d3 | iwo-flow3-03-03-work-order-complete-again.png | 19 / 0 | 3 |
| Flow 4 · Find internal and no-charge work orders | 01 | 01 Work orders list | flow4-1.dc.html | 1440x680 | 1228 | d72a3d9c950ca644 | iwo-flow4-01-01-work-orders-list.png | 30 / 4 |  |
| Flow 4 · Find internal and no-charge work orders | 02 | 02 List · No Charge | flow4-2.dc.html | 1440x680 | 1218 | 2545d5f2e808f482 | iwo-flow4-02-02-list-no-charge.png | same source as hf-38.dc.html (driven there) |  |
| Flow 4 · Find internal and no-charge work orders | 03 | 03 List · No Charge, no results | flow4-3.dc.html | 1440x680 | 1213 | 55df7ed7d20306bb | iwo-flow4-03-03-list-no-charge-no-results.png | 20 / 4 |  |
| Flow 4 · Find internal and no-charge work orders | 04 | 04 Technician Efficiency · Show all | flow4-4.dc.html | 1280x840 | 9209 | fd8d7bcd83daf99a | iwo-flow4-04-04-technician-efficiency-show-all.png | 37 / 0 |  |
| Flow 4 · Find internal and no-charge work orders | 05 | 05 Internal Work Orders report | flow4-5.dc.html | 1280x900 | 14836 | e1ebced907c9bc2a | iwo-flow4-05-05-internal-work-orders-report.png | same source as hf-39.dc.html (driven there) |  |
| Flow 4 · Find internal and no-charge work orders | 06 | 06 Internal Work Orders report · by technician | flow4-6.dc.html | 1280x900 | 14829 | 28190dbc6bc2dfa9 | iwo-flow4-06-06-internal-work-orders-report-by-technician.png | same source as hf-39b.dc.html (driven there) |  |
| Flow 4 · Find internal and no-charge work orders | 07 | 07 Mobile · list card | flow4-7.dc.html | 390x844 | 3944 | f2825d6b29cd6091 | iwo-flow4-07-07-mobile-list-card.png | 1 / 0 |  |
| Flow 4 · Find internal and no-charge work orders | 08 | 08 Mobile · detail header | flow4-8.dc.html | 390x844 | 2335 | 6b2251f27ad05df2 | iwo-flow4-08-08-mobile-detail-header.png | 1 / 0 |  |
| Flow 4 · Find internal and no-charge work orders | 09 | 09 Tech View | flow4-9.dc.html | 1280x840 | 3737 | 761bb4dd31b7e23d | iwo-flow4-09-09-tech-view.png | 10 / 0 |  |
| Flow 4 · Find internal and no-charge work orders | 10 | 10 Board · internal card | flow4-10.dc.html | 1280x840 | 7882 | 3a0b6a4bc4b6e0a2 | iwo-flow4-10-10-board-internal-card.png | 7 / 0 |  |
| Flow 4 · Find internal and no-charge work orders | 11 | 11 Schedule · card | flow4-11.dc.html | 1280x840 | 7865 | d76eef37e5fa3903 | iwo-flow4-11-11-schedule-card.png | 7 / 0 |  |
| Flow 5 · What the books see | 01 | 01 QB Unexported · held entry | flow5-1.dc.html | 1280x840 | 10132 | 3e6ac5c35645120c | iwo-flow5-01-01-qb-unexported-held-entry.png | same source as hf-40.dc.html (driven there) |  |
| Flow 5 · What the books see | 02 | 03 AccountingHub · Sales > Invoices | flow5-3.dc.html | 1280x840 | 4133 | 089c090a64876071 | iwo-flow5-02-03-accountinghub-sales-invoices.png | 15 / 0 |  |
| Flow 5 · What the books see | 03 | 3b AccountingHub · Closed record | flow5-3b.dc.html | 1280x840 | 4847 | 8fc3c880ffb86896 | iwo-flow5-03-3b-accountinghub-closed-record.png | same source as hf-41.dc.html (driven there) |  |
| Flow 5 · What the books see | 04 | 04 AccountingHub · Held event | flow5-4.dc.html | 1280x840 | 3772 | 26e6aafacdf501c4 | iwo-flow5-04-04-accountinghub-held-event.png | same source as hf-42.dc.html (driven there) |  |
| Flow 5 · What the books see | 05 | 3c AccountingHub · Invoice record with one No Charge line | flow5-3c.dc.html | 1280x840 | 5731 | 41de36bfc8281972 | iwo-flow5-05-3c-accountinghub-invoice-record-with-one-no-charge.png | same source as hf-41b.dc.html (driven there) | 6 |
| Flow 6 · Move one line off a billable work order | 01 | 01 Line menu · Mark as No Charge | flow6-1.dc.html | 1280x840 | 1220 | 3b2d2bd1dfc1e63c | iwo-flow6-01-01-line-menu-mark-as-no-charge.png | same source as hf-30.dc.html (driven there) |  |
| Flow 6 · Move one line off a billable work order | 02 | 02 Mark this line as No Charge? | flow6-2.dc.html | 1280x1000 | 4579 | 437027c6dfe0c7c0 | iwo-flow6-02-02-mark-this-line-as-no-charge.png | same source as hf-31.dc.html (driven there) |  |
| Flow 6 · Move one line off a billable work order | 03 | 03 Line marked No Charge · $0.00 | flow6-3.dc.html | 1280x840 | 1224 | 5e4204a2e41399be | iwo-flow6-03-03-line-marked-no-charge-0-00.png | same source as hf-32.dc.html (driven there) |  |
| Flow 6 · Move one line off a billable work order | 04 | 04 Line menu · Change category, Mark as Billable | flow6-4.dc.html | 1280x840 | 1259 | 30d4c724e0e50d78 | iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png | same source as hf-33.dc.html (driven there) |  |
| Flow 6 · Move one line off a billable work order | 05 | 05 Notes and Audit Log | flow6-5.dc.html | 1280x840 | 1240 | e5784c75038f52de | iwo-flow6-05-05-notes-and-audit-log.png | same source as hf-34.dc.html (driven there) |  |
| Flow 6 · Move one line off a billable work order | 06 | 06 Edit Line · No Charge in the dialog | flow6-6.dc.html | 1280x840 | 4207 | 0c34c2e1377122dd | iwo-flow6-06-06-edit-line-no-charge-in-the-dialog.png | 40 / 0 |  |
| Flow 6 · Move one line off a billable work order | 07 | 07 Invoice · the line at $0.00, Warranty | flow6-7.dc.html | 1280x1500 | 1245 | 257e8caa7c1f4d89 | iwo-flow6-07-07-invoice-the-line-at-0-00-warranty.png | same source as hf-35.dc.html (driven there) |  |
| Shared screens | 01 | WO Detail Artboard v6 | WO-Detail-Artboard-v6.dc.html | 1280x840 | 82705 | 6f8509d2e1854ab8 | iwo-components-01-wo-detail-artboard-v6.png | 18 / 0 |  |
| Shared screens | 02 | WO List Artboard v6 | WO-List-Artboard-v6.dc.html | 1440x680 | 13444 | bc0e80529a289115 | iwo-components-02-wo-list-artboard-v6.png | 24 / 4 |  |
| Shared screens | 03 | WO Settings Artboard v6 | WO-Settings-Artboard-v6.dc.html | 1280x1000 | 37483 | d85c7c62ece3b1dc | iwo-components-03-wo-settings-artboard-v6.png | 45 / 0 |  |
| Shared screens | 04 | New WO Dialog v6 | New-WO-Dialog-v6.dc.html | 1280x680 | 21261 | fbf88daa15b3301d | iwo-components-04-new-wo-dialog-v6.png | 39 / 1 |  |

## Per page: every board done

| Page | Boards | Rendered | Pictures viewed | Driven (distinct sources) |
|---|---|---|---|---|
| Happy flow v6 | 44 | 44 | 44 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 44 |
| Review · What changed after the CEO review | 34 | 34 | 34 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 1 |
| Flow 0 · Turn it on | 19 | 19 | 19 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 9 |
| Flow 1 · Create and close | 25 | 25 | 25 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 15 |
| Flow 2 · No charge on a customer's work order | 15 | 15 | 15 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 6 |
| Flow 3 · Reopen | 3 | 3 | 3 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 1 |
| Flow 4 · Find internal and no-charge work orders | 11 | 11 | 11 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 8 |
| Flow 5 · What the books see | 5 | 5 | 5 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 1 |
| Flow 6 · Move one line off a billable work order | 7 | 7 | 7 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 1 |
| Shared screens | 4 | 4 | 4 (each distinct picture viewed at full size; byte-identical renders proved pixel-equal) | 4 |

## The QA lead's browser save

| File | Bytes | sha256 (16) | How read |
|---|---|---|---|
| design-saved-page-files/_t.html | 491299 | c72cf56e14a9b75f | the canvas shell: script-read (text, version stamp 1794484794-2031, 68 of 198 note texts and 66 of 167 titles of the Review page it had loaded, all equal to canvas.json) |
| design-saved-page-files/frame-shell-BFBlUvGQ.js.download | 194019 | 77ac379e0c271837 | claude.ai viewer code: identified, not design content |
| design-saved-page-files/saved_resource(1).html | 214157 | 65ec20740e72dfe7 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(10).html | 200378 | d0189a7179d4e8ee | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(11).html | 185284 | e3b03266ca6050c5 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(12).html | 133597 | dc2566fc64f46864 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(13).html | 190621 | 9d995b35c75bdbca | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(2).html | 221413 | ab454f1c3e9b25f2 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(3).html | 215632 | f584205d5fc2efcf | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(4).html | 200901 | 6bf0bc8ac6d818ff | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(5).html | 197946 | cdac959edcda657c | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(6).html | 233253 | cdf5ac0b19a710a9 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(7).html | 192209 | 4da3660771d1c241 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(8).html | 198062 | cbe4896812a04607 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource(9).html | 190037 | 7a317d80d4b80815 | rendered board frame saved by the browser: its text extracted and compared word for word with the local rendering of the same board |
| design-saved-page-files/saved_resource.html | 703 | f48e604af6299e39 | a Cloudflare challenge frame (703 bytes): identified, not opened |
| design-saved-page.html | 603706 | a11c68f7e91123c7 | the claude.ai artifact page around the canvas: text extracted (viewer chrome only) |

## Own rendering checked

- Saved frame (4) "18 Closed · INTERNAL document" and (10) "07 Invoice · the line at $0.00, Warranty": every visible word equals the local render of hf-18 / hf-35 (including the hidden "removed" marker text, which the canvas also keeps in the page).
- Two content-identical boards rendered separately (hf-15 and flow1-4) differ by 0 pixels (`tools/imgdiff.js`): the local render is stable.
- Fonts: the package has no `fonts/` folder; the system Inter (same family the design names) was served for `Inter_18pt-*.ttf`.

