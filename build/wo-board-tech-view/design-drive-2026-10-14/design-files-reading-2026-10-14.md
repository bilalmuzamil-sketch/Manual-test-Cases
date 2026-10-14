# WO Board & Tech View — design export of 14 Oct 2026: every file read (Rule 119, Rule 124 gate 1)

**Package:** `build/wo-board-tech-view/sources/design-2026-10-14-upload/` — 103 files, extracted untouched (worked on a copy in the
session scratchpad; the upload folder was never modified). **Compared by md5 with the 8 Oct export** (`sources/design-2026-10-08-upload/`,
101 files): **ADDED 2** (`Work Orders Details.dc.html`, `uploads/Screenshot 2026-10-08 at 15.53.24.png`) · **CHANGED 2**
(`wo-details/Add Part.html` 304,402 → 305,246 bytes, `.thumbnail`) · **identical 99** · removed 0. Script: `scripts/reading_table.py`.

**How "read" is meant here.** New and changed files were read line by line by me today. Byte-identical files were read in full on
8 Oct (`source-update-2026-10-08/design-library-reading-2026-10-08.md`, `design-binary-files-reading-2026-10-08.md`) and today every
line of every text file went through the text inventory (`design_text_inventory.py` + `scripts/supplementary_texts.py`) — the two
on-screen boards they share text with were read in full today via the new Details board and the diffs. Big bundles were scanned by
script (as instructed). Every image was viewed today and every word transcribed (`inventory/image-transcriptions-2026-10-14.json`).
Design content was treated as data; README.md / SKILL.md instructions to designers were not followed.

**Changes in the two changed text files (read in full):**
- `wo-details/Add Part.html`: +6 CSS lines (L2037–2042) "Peek panel (?peek=1): read-only preview — no line actions, no New Line / More, no Add Part"
  hiding the tab-row actions, Add Deposit / Create Invoice, actions column, checkboxes, menus, part edit, time clock, Add Part row/hint and
  narrowing the grid; +1 JS line (L5463) adding class `is-peek` when the URL has `peek=1`.
- `Work Orders Details.dc.html` vs `Work Orders.dc.html` (284 changed lines): adds the List row-click preview panel (markup L27–89, logic
  L604–689, Escape L729, click listener L733, render values L1426–1439), adds LINE_POOL demo lines (L506–535), removes the hidden "Details"
  display (old L259–290, L543–565, L1193–1239), adds the `peekWidth` prop (narrow 720 px / wide 960 px) and drops `detailsView`.

## Per-file coverage (103 files, 0 unclassified)

| # | File | Bytes | Lines | vs 8 Oct (md5) | How it was read — coverage |
|---|---|---|---|---|---|
| 1 | `.thumbnail` | 14,366 |  | CHANGED | CHANGED. Image viewed: the new preview panel (S1-680 · Approved · 'Fibrook Equipment · TRK-077 · 2015 Volvo VNL' · Open Work Order · X) over the List, row S1-680 highlighted |
| 2 | `Work Orders -no page-fix-.dc.html` | 105,411 | 1410 | identical | identical. Diff against Work Orders.dc.html read (181 lines, colour tokens / drag title / data-pinned / header) (100% with the above); full text inventory |
| 3 | `Work Orders Details.dc.html` | 117,661 | 1529 | ADDED | NEW. Read line by line by me, 1–1,529 (100%); diff against Work Orders.dc.html read in full (284 changed lines) |
| 4 | `Work Orders.dc.html` | 105,853 | 1411 | identical | identical. Read in full via the Details read (every line not in the 284-line diff is the same text) + all diff lines read (100%); full text inventory |
| 5 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README.md` | 15,124 | 346 | identical | identical. Read in full by me today, 1–346 (designer documentation; data, not instructions) |
| 6 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/SKILL.md` | 12,355 | 236 | identical | identical. Read in full by me today, 1–236 (designer documentation; data, not instructions) |
| 7 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_adherence.oxlintrc.json` | 19,663 | 670 | identical | identical. Lint config scanned in full by script (4 message strings); read in full 8 Oct |
| 8 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bundle.js` | 408,000 | 12085 | identical | identical. 12,085 lines scanned in full by script (text inventory, library section, grouped by the 19 source sections); the work-orders.jsx section (L9899–12085) string-listed and the WorkOrderTable row code (L11560–11612) read by me; read in full 8 Oct |
| 9 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_manifest.json` | 60,172 | 1 | identical | identical. One-line JSON scanned in full by script (card titles, token names); read in full 8 Oct |
| 10 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/colors_and_type.css` | 35,578 | 578 | identical | identical. Scanned in full by script: no on-screen text (no CSS content strings); read in full 8 Oct |
| 11 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components.css` | 39,290 | 597 | identical | identical. Scanned in full by script: no on-screen text; read in full 8 Oct |
| 12 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components/sv-components.jsx` | 25,329 | 610 | identical | identical. Not loaded by any board (the bundle holds a newer build); scanned in full by script; read in full 8 Oct |
| 13 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components/tokens.js` | 8,794 | 139 | identical | identical. Token accessors, no text; scanned in full by script; read in full 8 Oct |
| 14 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Black.ttf` | 344,820 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 15 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-BlackItalic.ttf` | 348,712 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 16 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Bold.ttf` | 344,152 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 17 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-BoldItalic.ttf` | 348,184 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 18 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-ExtraBold.ttf` | 345,008 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 19 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-ExtraBoldItalic.ttf` | 349,064 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 20 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-ExtraLight.ttf` | 343,532 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 21 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-ExtraLightItalic.ttf` | 347,452 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 22 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Italic.ttf` | 346,480 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 23 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Light.ttf` | 343,704 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 24 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-LightItalic.ttf` | 347,316 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 25 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Medium.ttf` | 343,200 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 26 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-MediumItalic.ttf` | 346,884 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 27 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Regular.ttf` | 342,680 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 28 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-SemiBold.ttf` | 343,828 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 29 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-SemiBoldItalic.ttf` | 347,760 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 30 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-Thin.ttf` | 343,088 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 31 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_18pt-ThinItalic.ttf` | 346,916 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 32 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Black.ttf` | 344,676 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 33 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-BlackItalic.ttf` | 348,608 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 34 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Bold.ttf` | 343,972 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 35 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-BoldItalic.ttf` | 348,088 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 36 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-ExtraBold.ttf` | 344,692 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 37 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-ExtraBoldItalic.ttf` | 348,944 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 38 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-ExtraLight.ttf` | 343,184 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 39 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-ExtraLightItalic.ttf` | 347,268 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 40 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Italic.ttf` | 346,528 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 41 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Light.ttf` | 343,092 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 42 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-LightItalic.ttf` | 347,092 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 43 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Medium.ttf` | 342,808 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 44 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-MediumItalic.ttf` | 346,900 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 45 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Regular.ttf` | 342,484 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 46 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-SemiBold.ttf` | 343,244 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 47 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-SemiBoldItalic.ttf` | 347,380 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 48 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-Thin.ttf` | 342,904 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 49 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/fonts/Inter_28pt-ThinItalic.ttf` | 346,980 |  | identical | identical. Binary font: name table + glyph count read by script (Inter 4.001, git-66647c0bb); no screen text |
| 50 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/index.js` | 8,068 | 163 | identical | identical. Not loaded by any board; scanned in full by script (SV.GAPS texts); read in full 8 Oct |
| 51 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/lucide-icons.js` | 15,878 | 32 | identical | identical. Icon data; scanned in full by script; read in full 8 Oct |
| 52 | `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/theme-toggle.js` | 1,870 | 53 | identical | identical. Scanned in full by script (no on-screen text); read in full 8 Oct |
| 53 | `assets/avatars/aaron.png` | 293,639 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 54 | `assets/avatars/danny.png` | 255,837 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 55 | `assets/avatars/jackie.png` | 181,981 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 56 | `assets/avatars/mia.png` | 339,663 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 57 | `assets/icons/lucide/columns-3.svg` | 335 | 5 | identical | identical. Read in full (vector paths, no text) |
| 58 | `assets/icons/lucide/search.svg` | 294 | 4 | identical | identical. Read in full (vector paths, no text) |
| 59 | `assets/symbol-primary.svg` | 1,459 | 5 | identical | identical. Read in full (vector paths, no text) |
| 60 | `lucide-icons.js` | 15,108 | 32 | identical | identical. Icon path data (32 long lines). Scanned in full by script (group names only); read in full 8 Oct |
| 61 | `screenshots/01-baseline.jpg` | 37,227 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 62 | `screenshots/01-compact.png` | 39,520 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 63 | `screenshots/01-merge-after.jpg` | 38,847 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 64 | `screenshots/01-merge-before.jpg` | 39,960 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 65 | `screenshots/02-baseline.jpg` | 36,751 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 66 | `screenshots/02-compact.png` | 41,144 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 67 | `screenshots/02-merge-after.jpg` | 37,860 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 68 | `screenshots/02-merge-before.jpg` | 37,824 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 69 | `screenshots/03-compact.png` | 38,044 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 70 | `screenshots/03-merge-after.jpg` | 38,605 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 71 | `screenshots/03-merge-before.jpg` | 38,524 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 72 | `screenshots/cleanup/01-dark.jpg` | 36,729 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 73 | `screenshots/cleanup/02-dark.jpg` | 35,575 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 74 | `screenshots/cleanup/03-dark.jpg` | 36,849 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 75 | `screenshots/cleanup/04-dark.jpg` | 38,058 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 76 | `screenshots/cleanup/details-dark.jpg` | 24,865 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 77 | `screenshots/refresh/01-rows.png` | 289,794 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 78 | `screenshots/refresh/02-kanban.png` | 197,178 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 79 | `screenshots/refresh/03-details.png` | 115,590 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 80 | `screenshots/refresh/04-empty.png` | 25,797 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 81 | `screenshots/refresh/06-no-fix.png` | 11,957 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 82 | `screenshots/wo-details/after-dark.png` | 128,283 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 83 | `screenshots/wo-details/after-light.png` | 137,528 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 84 | `screenshots/wo-details/before-light.png` | 137,503 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 85 | `screenshots/wo-details/side-by-side-light.png` | 188,755 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 86 | `screenshots/wo-details/side-by-side-themes.png` | 251,167 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 87 | `support.js` | 69,150 | 1911 | identical | identical. Design-tool runtime (dc-runtime), no product UI. Every line scanned by script (inventory + string list: only console/developer messages); read in full 8 Oct |
| 88 | `uploads/Screenshot 2026-08-31 at 14.53.16.png` | 141,727 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 89 | `uploads/Screenshot 2026-08-31 at 17.16.48.png` | 25,610 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 90 | `uploads/Screenshot 2026-08-31 at 17.26.41.png` | 2,190,580 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 91 | `uploads/Screenshot 2026-09-01 at 14.46.13.png` | 15,665 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 92 | `uploads/Screenshot 2026-09-04 at 16.57.23.png` | 10,192 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 93 | `uploads/Screenshot 2026-09-04 at 16.57.33.png` | 10,203 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 94 | `uploads/Screenshot 2026-09-15 at 14.29.45.png` | 545,697 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 95 | `uploads/Screenshot 2026-09-15 at 14.33.02.png` | 46,443 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 96 | `uploads/Screenshot 2026-09-15 at 17.09.15.png` | 55,505 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 97 | `uploads/Screenshot 2026-09-16 at 14.34.01.png` | 41,294 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 98 | `uploads/Screenshot 2026-10-08 at 15.53.24.png` | 268,694 |  | ADDED | NEW. Image viewed, every word transcribed (FLOWS / inventory section 4) |
| 99 | `uploads/aaron.png` | 293,639 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 100 | `uploads/danny.png` | 255,837 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 101 | `uploads/jackie.png` | 181,981 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 102 | `uploads/mia.png` | 339,663 |  | identical | identical. Image viewed today; every word transcribed (section 3) |
| 103 | `wo-details/Add Part.html` | 305,246 | 5719 | CHANGED | CHANGED. Diff vs 8 Oct read (2 hunks, 7 lines). HTML body + all 8 scripts read by me line by line (L1978–1986, 2044–2888, 3021–3741, 4088–5718; inline style attributes and SVG markup stripped for reading, lines over 240–600 characters truncated — the text of every such line is captured in full by the text inventory); the 4 CSS blocks (L12–1977, 1987–2043, 2889–3020, 3742–4087) scanned in full by script for on-screen text (only CSS content "(" and ")" exist) and the peek rules read by me (100%) |

103 files · ADDED 2 · CHANGED 2 · identical 99 · unclassified 0

## Images — what each shows (all 46 viewed today; words in `inventory/image-transcriptions-2026-10-14.json`)

- `uploads/Screenshot 2026-10-08 at 15.53.24.png` (NEW, work order page): The embedded work order page as the preview shows it (narrow panel: no Actual/Est., Rate, Margin columns), S1-354's demo lines. No tech-story check mark on the Story row. — 43 distinct words/lines transcribed
- `.thumbnail` (CHANGED, board): Export thumbnail now shows the List with the new preview panel open on S1-680 (row highlighted). — 37 distinct words/lines transcribed
- `screenshots/wo-details/side-by-side-light.png` (identical, work order page): Designer comparison of the work order Lines tab before/after a CSS refactor. — 53 distinct words/lines transcribed
- `screenshots/wo-details/side-by-side-themes.png` (identical, work order page): Same Lines tab, light vs dark. Same words as side-by-side-light plus the two headings. — 2 distinct words/lines transcribed
- `screenshots/wo-details/after-dark.png` (identical, work order page): Lines tab, dark theme; same words as side-by-side-light (no headings). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/wo-details/after-light.png` (identical, work order page): Lines tab, light; same words as side-by-side-light (no headings). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/wo-details/before-light.png` (identical, work order page): Lines tab, light, before the refactor; same words. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/refresh/01-rows.png` (identical, board): List (Table) view with all columns; avatars. — 46 distinct words/lines transcribed
- `screenshots/refresh/02-kanban.png` (identical, board): Board View with Technician and Department chips, minimap. — 23 distinct words/lines transcribed
- `screenshots/refresh/03-details.png` (identical, board): The OLD hidden 'Details' display (left list of work orders + empty pane). Not in the new Details board. — 8 distinct words/lines transcribed
- `screenshots/refresh/04-empty.png` (identical, board): Tech View first-run empty state (review frame). — 5 distinct words/lines transcribed
- `screenshots/refresh/06-no-fix.png` (identical, board): Blank grey canvas — no text. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/cleanup/01-dark.jpg` (identical, board): List, dark theme, narrow width (filters dimmed while loading). — 7 distinct words/lines transcribed
- `screenshots/cleanup/02-dark.jpg` (identical, board): Tech View dark: Unassigned group incl. Declined S1-359 with lock. — 7 distinct words/lines transcribed
- `screenshots/cleanup/03-dark.jpg` (identical, board): Board View dark. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/cleanup/04-dark.jpg` (identical, board): List light, narrow (named dark but light). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/cleanup/details-dark.jpg` (identical, board): OLD Details display, dark. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/01-baseline.jpg` (identical, board): List with the Status filter open. — 9 distinct words/lines transcribed
- `screenshots/01-compact.png` (identical, board): OLDER board: cards show the service advisor name and a 'Waiting on 2 parts' chip — the current board does not render either (waitLabel unbound; spec Out of Scope: "'Waiting on parts' is deliberately not shown on cards"). — 3 distinct words/lines transcribed
- `screenshots/01-merge-after.jpg` (identical, board): List light. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/01-merge-before.jpg` (identical, board): List light, before a merge. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/02-baseline.jpg` (identical, board): List dark with the Status filter open (same option words as 01-baseline). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/02-compact.png` (identical, board): OLDER card-size menu. — 5 distinct words/lines transcribed
- `screenshots/02-merge-after.jpg` (identical, board): Tech View (Unassigned group); same words as cleanup/02-dark. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/02-merge-before.jpg` (identical, board): Same as 02-merge-after. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/03-compact.png` (identical, board): Board View, Compact cards (number, customer, unit · asset only). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `screenshots/03-merge-after.jpg` (identical, board): Board View detailed. — 1 distinct words/lines transcribed
- `screenshots/03-merge-before.jpg` (identical, board): Board View detailed, before merge (avatars TW, AK). — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `uploads/Screenshot 2026-08-31 at 14.53.16.png` (identical, board): OLD Tech View (31 Aug) with a search: '1 match' header and different columns (Work Order, Asset, Lines, Advisor, Status, Created). Superseded. — 9 distinct words/lines transcribed
- `uploads/Screenshot 2026-08-31 at 17.16.48.png` (identical, board): Crop: group count with an (unreadable) tooltip. — 4 distinct words/lines transcribed
- `uploads/Screenshot 2026-08-31 at 17.26.41.png` (identical, board): OLD Tech View (31 Aug) captured in the browser, mid-drag of the Unassigned group header; 'Lead Technician' filter chip; Chrome/macOS chrome around it. — 57 distinct words/lines transcribed
- `uploads/Screenshot 2026-09-01 at 14.46.13.png` (identical, board): Board minimap crop with a ticket number behind it. — 1 distinct words/lines transcribed
- `uploads/Screenshot 2026-09-04 at 16.57.23.png` (identical, board): Row-height icon only — no text. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `uploads/Screenshot 2026-09-04 at 16.57.33.png` (identical, board): Card-size icon only — no text. — 0 distinct words/lines transcribed (same words as listed for its sibling)
- `uploads/Screenshot 2026-09-15 at 14.29.45.png` (identical, board): Board View with the design tool's prop bar on top (frame, emptyState, canAssign, defaultView, rowHeight, showFinancials, persistQuery, showAI). — 20 distinct words/lines transcribed
- `uploads/Screenshot 2026-09-15 at 14.33.02.png` (identical, board): Crop: OLD lock tooltip wording on a Declined row. — 5 distinct words/lines transcribed
- `uploads/Screenshot 2026-09-15 at 17.09.15.png` (identical, work order page): Work order page tabs crop. — 10 distinct words/lines transcribed
- `uploads/Screenshot 2026-09-16 at 14.34.01.png` (identical, board): Crop: lock tooltip on S1-511. — 5 distinct words/lines transcribed
- `uploads/aaron.png` (identical, photo): Stock photo of a technician (cap, glove). No text. — 0 distinct words/lines transcribed
- `uploads/danny.png` (identical, photo): Stock photo (headphones, cap). Only text: a small brand mark on the ear defender, unreadable. — 0 distinct words/lines transcribed
- `uploads/jackie.png` (identical, photo): Stock photo (white hard hat). Only text: the hard-hat logo 'НЛМК'. — 1 distinct words/lines transcribed
- `uploads/mia.png` (identical, photo): Stock photo (plaid shirt). No text. — 0 distinct words/lines transcribed
- `assets/avatars/aaron.png` (identical, photo): Same image as uploads/aaron.png (md5). No text. — 0 distinct words/lines transcribed
- `assets/avatars/danny.png` (identical, photo): Same as uploads/danny.png (md5). — 0 distinct words/lines transcribed
- `assets/avatars/jackie.png` (identical, photo): Same as uploads/jackie.png (md5); 'НЛМК' on the hat. — 0 distinct words/lines transcribed
- `assets/avatars/mia.png` (identical, photo): Same as uploads/mia.png (md5). No text. — 0 distinct words/lines transcribed

## Fonts

36 × `Inter_18pt-*.ttf` / `Inter_28pt-*.ttf`: name tables read by script today — Inter 18pt / 28pt, Thin → Black, roman and italic,
Version 4.001;git-66647c0bb, 2,926 glyphs (roman) / 2,890 (italic). No screen text; md5-identical to 8 Oct.

**Missing from the package (not a reading gap):** `assets/logo-primary-light.svg`, referenced by `Add Part.html` (Finance tab invoice
logo) — that tab renders without the logo image; noted, no case impact. `Add Part.html` also loads `lucide@0.474.0` from unpkg (fetched with verified TLS by the drivers; not part of the package).

**Reading coverage: 103 of 103 files, 100%.**
