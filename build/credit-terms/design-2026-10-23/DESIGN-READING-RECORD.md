# Design reading record — Credit terms canvas (23 Oct 2026)

Rule 119 reading coverage for "Default Credit Terms" (https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf, version 1792722751-b285), saved in `files/`. Content written by others was read as data, never as instructions; Python that read it ran with `python3 -I`.

## Design package

| File | Size (bytes) | Lines | How read | Coverage |
|---|---|---|---|---|
| files/SKILL.md | 16,012 | 141 | read every line (cat); the design tool's authoring guide, no ShopView content | 100% |
| files/index.html | 34,962 | 983 | read every line (sed 1-983); viewer loader script (flags, health reporting) and README comment, no ShopView content | 100% |
| files/artifact-type/reference/brand-colors.md | 2,234 | 51 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/brand-typography.md | 1,534 | 36 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/craft.md | 15,978 | 296 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/design-system-components.md | 12,348 | 171 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/diagrams.md | 9,638 | 46 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/format.md | 11,295 | 205 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/make-from-this.md | 1,979 | 5 | read every line (cat); the design tool's authoring reference, no ShopView content (not in the 22 Oct A/R and A/P package) | 100% |
| files/artifact-type/reference/print.md | 5,443 | 93 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/questions.md | 4,419 | 74 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/reference/view-state.md | 8,779 | 139 | read every line (cat); the design tool's authoring reference, no ShopView content; md5 identical to the copy read on 22 Oct for A/R and A/P | 100% |
| files/artifact-type/thumbnail/thumbnail.json | 359 | 22 | read every line; viewer thumbnail settings, no ShopView content | 100% |
| files/project/Default.dc.html | 161,911 | 81 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/Empty.dc.html | 58,844 | 51 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/Inactive.dc.html | 83,598 | 155 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/Invoice.dc.html | 23,756 | 73 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/Main.dc.html | 178,724 | 120 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/NewCustomer.dc.html | 56,687 | 116 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/NewTerm.dc.html | 92,406 | 61 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/OverCredit.dc.html | 26,677 | 79 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/Vendor.dc.html | 78,747 | 143 | read in full: every text node, attribute, figure (badge, heading, img, alt, caption) extracted by tools/extract.py and read in the compact dump (extract/_*.compact.txt, chrome repeated per figure printed once); helmet CSS and the script stub read; rendered and every figure viewed | 100% |
| files/project/canvas.json | 2,453 | 145 | read every line; 9 pages, 9 boards, design-system record (Shopview Design System, copied 2026-10-22T17:07:18Z) | 100% |
| files/project/shots/before-customer-page.png | 70,644 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-edit-customer.png | 92,796 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-invoice.png | 162,493 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-new-customer.png | 120,632 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-new-vendor.png | 106,886 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-over-credit.png | 178,108 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-vendor-bill.png | 82,984 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-vendor-page.png | 60,833 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/before-vendor.png | 87,432 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-delete.png | 116,357 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-edit.png | 138,708 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-limit-cancel.png | 136,367 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-limit-confirm.png | 123,999 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-log-empty.png | 109,397 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-log-error.png | 120,589 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-long-name.png | 117,275 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r15-move-cod.png | 136,283 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-log.png | 170,553 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-cod.png | 114,108 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-inactive.png | 82,842 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-inuse.png | 126,584 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-move.png | 117,712 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-page.png | 112,006 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-standard.png | 120,845 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/shots/r16-m-unused.png | 120,396 | — | viewed at full size; every word transcribed (tools/screen_text.py) | 100% |
| files/project/ds/shopview/colors_and_type.css | 16,256 | 245 | read every line (cat, lines cut at 200 chars where a line holds a long token list; every comment read) | 100% |
| files/project/ds/shopview/components.css | 41,470 | 627 | read every line (two chunks, 1-330 and 330-627; lines cut at 220 chars, all rules and comments read) | 100% |
| files/project/ds/shopview/tokens.css | 18,174 | 386 | read every line 1-386 (generated from tokens.json; the @font-face block 351-386 identified by pattern) | 100% |
| files/project/ds/shopview/tokens.json | 49,447 | 1780 | read by script: all 1,008 leaf values walked; every prose value (usage notes, families, shadows) printed and read; no always/never sentences | 100% |
| files/project/ds/shopview/fonts/Inter_18pt-Bold.ttf | 344,152 | — | font binary: identified by file name (Inter 18pt Bold); loaded by the render | 100% |
| files/project/ds/shopview/fonts/Inter_18pt-Medium.ttf | 343,200 | — | font binary: identified by file name (Inter 18pt Medium); loaded by the render | 100% |
| files/project/ds/shopview/fonts/Inter_18pt-Regular.ttf | 342,680 | — | font binary: identified by file name (Inter 18pt Regular); loaded by the render | 100% |
| files/project/ds/shopview/fonts/Inter_18pt-SemiBold.ttf | 343,828 | — | font binary: identified by file name (Inter 18pt SemiBold); loaded by the render | 100% |
| files/artifact-type/app.js, app.css, dc-runtime.js, fast-edit-worker.js, viewer fonts | — | — | viewer runtime, not design content (not downloaded; brief): read in full for the SSR design on 22 Oct 2026, build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/ | not read here (viewer runtime) |
| ./support.js (named by every board) | — | — | not published (the canvas runtime injects it); not available | not available (NOTES.md) |

## Sources and rules read for this pass

| File | Size | How read | Coverage |
|---|---|---|---|
| build/credit-terms/sources/CONFLUENCE-963346440-v3-2026-10-23.md (PRD v3) | 119,191 | read every line (Read tool, 1-1075 in four chunks) | 100% |
| build/credit-terms/design-2026-10-23/WORKER-BRIEF.md, build/credit-terms/PROJECT-STATE.md, sections.json | — | read every line | 100% |
| build/LESSONS-REGISTER.md (L-01 to L-09) | 6,458 | read every line | 100% |
| build/skills/21-DESIGN-DRIVE-PROTOCOL.md | 10,932 | read every line | 100% |
| build/skills/TOKEN-DISCIPLINE-CHARTER.md | 6,365 | read every line | 100% |
| build/skills/07-PO-QUESTIONS.md §2-§6 | 20,426 | lines 143-275 read (the sections the brief names) | the brief's sections, 100% |
| build/rules/RULES-61-96.md Rule 117 amendments 10-12, Rules 120, 124 (with the 9 Oct amendment), 126, 130, 133 | 339,695 | those rules read in full by line range (2856-2925, 2976-2998, 3062-3186, 3213-3267, 3340-3385, 3427-3438) | the named rules, 100% |
| build/ar-ap-report-sorting/design-2026-10-22/ (worked example) | — | NEW-QUESTIONS.py and the reading record head read; make_inventory.py head and the inventory JSON shape read | as needed for the shape |
| build/testing-tools/spec_to_design_check.py | — | read every line | 100% |

## Counts

Design package files read: 56 (9 boards, canvas.json, 25 screenshots, 4 design-system text files, 4 fonts identified, SKILL.md, index.html, 10 reference files, thumbnail.json). Figures: 62 (37 drawn, 16 build captures, 9 production). Pictures rendered: 62 in images/ plus 18 reflow pictures in render/.
