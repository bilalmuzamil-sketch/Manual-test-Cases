# Tiered Pricing — design drive proof (14 Nov 2026)

Design: the Claude Design canvas "Tiered Pricing Design", https://claude.ai/artifact/A3NtAX9CHJCD87SXDTn9AE (link given by the QA lead).
**Version driven: 1794631438-539a** (reported by the Artifact listing on 14 Nov 2026; 322 published files). Package saved in
`files-v1794631438-539a/` (`VERSION` file inside). The overview board says: "Approved by the design authority on Nov 9, 2026", drawn from
the interactive prototype v4.24, follows the Tiered Pricing PRD **v37** and the Sales by Tier and Sales by Category PRD **v21**, "Light mode;
desktop at 1440 wide, phone at 390". Design system: Shopview Design System, artifact MNa6nLmFwgFaa8g5tbmKgC, version 1794123152-db22 (copied
13 Nov 2026).

Skill 21 steps 1-5 and §6d lines 9-10 (Rules 120, 124, 126, 130, 133; lessons L-01, L-02, L-04, L-21). Nothing was written to TestRail, Jira,
Slack or Google. The PRD-vs-design comparison (spec_to_design_check.py, register) is left to the case author against the requirement map, as
briefed; section 8 lists what looks like design behaviour the PRD may not have.

What the design is: 272 boards on 17 pages (0 Overview, Stories 1-15, 20 Sales by Tier and Sales by Category; Stories 16-19 have no page,
several notes say "Also Story 19"). **Every board is a static screen**: each board's logic block is empty (`renderVals() { return {}; }` in all
273 files), light theme only (`data-theme="light"` on all 273; tp-app.css line 211: "light mode only"), desktop boards drawn at a fixed 1440 px
(`.tpc-board` width 1440), 3 phone boards at 390 px. A flow is a canvas ROW: "Click …" boards outline the target in orange (`tpc-hl`, "an
annotation, not part of the UI") and the next board shows the result. Tooltips are drawn on their own hover boards; elsewhere they exist only
as `data-tip` text (the board runtime does not show them on hover), so every `data-tip` text was taken into the text inventory.

## 1 · Files read (Rule 119)

| File(s) | Size | Lines | How read | Coverage |
|---|---|---|---|---|
| 273 board files `project/*.dc.html` (272 on the canvas + `CU04b-TierChosen.dc.html`, which is in the package but not on the canvas) | 5,093,749 B | 9,288 | Every line parsed by script: every text node, every visible attribute (data-tip, aria-label, title, placeholder, alt, value, option, optgroup) and the structure (tables, dialogs, menus, toasts, inputs, icons) extracted from the rendered DOM of each board (render logs `render/render-log-0..3.json`); the shared tool `design_text_inventory.py` read all 276 text files of `project/` again (`inventory/tool-text-inventory.*`, 1,813 distinct texts). Pictures: every board rendered; boards viewed by eye during the drive: 2.55, 9.40 and the stress pictures; the rest are checked by the DOM extraction, not by eye | 100% of lines processed; eye review of every picture is left to the design-case author when attaching them |
| `project/canvas.json` | 134,182 B | 5,825 | Every key read by script; all 301 notes (30 row titles, 256 blue step notes, 15 grey "Today" notes) printed in page order and read in full (`render/canvas-notes.txt`); 17 pages; 272 board entries (x, y, w, h, title, page, expand) | 100% |
| `project/tp-app.css` (the design's own stylesheet) | 54,651 B | 651 | Read in full, line by line | 100% |
| `project/Main.dc.html` (overview) | 9,254 B | 32 | Read in full | 100% |
| `project/ds/…/components.css`, `colors_and_type.css`, `tokens.css`, `tokens.json` (design library) | 267,0 KB | 4,739 | Byte-identical (md5) to the Bill To package of 9 Nov 2026 (`build/founder-mode/bill-to/design-2026-11-09/files/project/ds/shopview/`), which was read in full there (components.css in full on 2 Nov + every changed line on 9 Nov). Today: every block comment split into sentences and every always/never/must/should/only/avoid sentence extracted with file:line (`inventory/library-sentences.json`, 57 incl. tp-app.css); tokens.json usage strings in the text inventory | 100% (earlier full read, identical bytes) |
| 8 fonts `ds/…/fonts/Inter_18pt/28pt-{Regular,Medium,SemiBold,Bold}.ttf`; `assets/symbol-primary.svg` | 2.75 MB; 1,459 B | — | Identified (Inter text and display cuts; ShopView logo symbol). tokens.css names 18 more Inter files the package does not ship; the local server answered them with the system Inter of the same weight (`render/server-log.txt`) | 100% identified |
| `artifact-type/dc-runtime.js` (board runtime, served as `./support.js`) | 188,749 B | 351 | Byte-identical to the copy used for Internal Work Orders on 12 Nov; used only to render | identified |
| `SKILL.md`, `artifact-type/reference/{brand-colors,brand-typography,craft,diagrams}.md` | 46 KB | 573 | Read in full (canvas editor's own authoring guide; not Tiered Pricing content) | 100% |
| `artifact-type/reference/{design-system-components,format,make-from-this,print,questions,shaders,view-state}.md`, `index.html` (canvas page shell, title "Design") | 115 KB | 2,345 | **Not read line by line**: the canvas editor's own guides and page shell, not part of the Tiered Pricing design. Kept in the folder | named for the QA lead (Rule 119) |
| Canvas viewer runtime `artifact-type/app.js`, `app.css`, `capture.js`, `fast-edit-worker.js`, `i18n/*` (10), `fonts/anthropicons-variable.woff2`, `third-party-licenses.js`, `thumbnail/thumbnail.json`, `reference/google-fonts-*.json` | ≈10 MB | — | **Not read, not committed** (viewer code, not design content; an earlier version was read in full on 22 Oct 2026, `build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/`). sha256 of each in `render/viewer-files-sha256.txt` | named for the QA lead |
| 11 "Before · screenshot" images (`/_blob/…`, used by the 13 "Today" boards 2.1, 6.1, 7.1-7.2 drawn, 9.25-9.27, 9.38, 10.1-10.3, 13.1, 14.1, 20.1) | — | — | **Not obtainable**: they sit in the artifact's asset store, which only a writer can list (`not_writer`); reading by id returns "not found". Their captions and alt text are in the text inventory. These boards show today's production, not the new design | needs the QA lead (see Outstanding) |

## 2 · Rendering and sweep method
- `tools/serve.js` serves the package on 127.0.0.1:8771 with `./support.js` = `dc-runtime.js`; external links (Jira, Confluence, the canvas
  page) are blocked, never followed. `tools/render.js` (from the Internal Work Orders recipe) renders every board at its canvas size in
  Chromium, light theme; 4 detached shards; resumable checkpoint per board.
- Per board: picture `images/page-NN-board-NN-<title>.png`; every visible text with box and style; attributes; clipped, overflowing and
  overlapping text; look facts (section 5); then the one-click sweep: every candidate (button, link, input, select, label, role, tabindex,
  tooltip attribute, pointer cursor) hovered and clicked from a known state, the page reloaded after any change; text, element count,
  address and the element's own colour/border/opacity/shadow compared before and after. Hover crops in `render/drive/` (one per distinct
  effect in the content area; header/side-menu repeats and byte-identical crops removed, lists kept in `render/drive-*.json`).
- Widths: the desktop boards are drawn at a fixed 1440 px. Each was also rendered in a 1536 px window: 254 of 268 keep the 1440 board with
  every column at the same place (spare width stays on the right); 14 are fluid (the overview and the 13 "Today" boards). 18 pictures kept
  in `render/w1536/` (one per page + the two drawn "Today" boards whose columns spread).
- Dark theme: **not offered by the design** (Overview: "Light mode"; tp-app.css: "light mode only: the page is shared for review, so it stays
  in the canvas's light theme whatever the viewer's setting"). Not rendered, because no dark state exists to compare against.
- **14 boards are taller than their canvas frame**, so the canvas cuts their bottom: 9.28 Customers and 9.29 (content 1,211 px, frame 1,111),
  9.30-9.36 and 9.37 Edit Customer boards (1,185 vs 1,088; on 9.35 the "Acme Freight saved" toast sits at y 1,075, at the cut), 10.6-10.7
  (973 vs 895), 10.9 (1,023 vs 935), 12.9 and 14.8 (902 vs 876). Each also has a `-full-height.png` picture.

## 3 · Boards rendered, per page (coverage proof; per-board detail in BOARD-COVERAGE.md)

| Page | Boards on the canvas | Rendered | Pictures | Candidates | Hovered | Clicked | Exposed | Failed |
|---|---|---|---|---|---|---|---|---|
| 0 · Overview | 1 | 1 | 1 | 41 | 41 | 41 | 41 | 0 |
| 1 · Story 1: Release day | 4 | 4 | 4 | 199 | 199 | 199 | 179 | 0 |
| 2 · Story 2: Tiers | 60 | 60 | 60 | 3282 | 3282 | 3282 | 2403 | 0 |
| 3 · Story 3: Matrices and rules | 29 | 29 | 29 | 1862 | 1862 | 1862 | 1098 | 0 |
| 4 · Story 4: The tier grid: every tier of a matrix, edited in place | 27 | 27 | 27 | 1990 | 1990 | 1990 | 1448 | 0 |
| 5 · Story 5: Price Part Simulator | 4 | 4 | 4 | 226 | 226 | 226 | 183 | 0 |
| 6 · Story 6: Every matrix in one list | 14 | 14 | 14 | 843 | 843 | 843 | 608 | 0 |
| 7 · Story 7: Categories: every category's pricing at a glance | 15 | 15 | 15 | 1323 | 1323 | 1323 | 573 | 0 |
| 8 · Story 8: Categories over time | 12 | 12 | 12 | 873 | 873 | 873 | 455 | 0 |
| 9 · Story 9: Putting customers on tiers | 41 | 41 | 41 | 2072 | 2072 | 2072 | 794 | 0 |
| 10 · Story 10: How a part is priced | 12 | 12 | 12 | 302 | 302 | 302 | 248 | 0 |
| 11 · Story 11: When a part is priced again | 7 | 7 | 7 | 272 | 272 | 272 | 96 | 0 |
| 12 · Story 12: Seeing what priced a part | 9 | 9 | 9 | 311 | 311 | 311 | 249 | 0 |
| 13 · Story 13: Part Sales | 4 | 4 | 4 | 99 | 99 | 99 | 83 | 0 |
| 14 · Story 14: Changing the customer on a work order | 8 | 8 | 8 | 278 | 278 | 278 | 76 | 0 |
| 15 · Story 15: The below-cost warning in the matrix | 2 | 2 | 2 | 137 | 137 | 137 | 107 | 0 |
| 20 · Sales by Tier and Sales by Category | 23 | 23 | 23 | 1089 | 1089 | 1089 | 920 | 0 |
| **All** | **272** | **272** | **272** | **15199** | **15199** | **15199** | **9561** | **0** |


## 4 · Sweep results (totals)
- 272 / 272 boards rendered (plus the off-canvas board file, picture `images/orphan-not-on-canvas-CU04b-8-4b-pick-3-tier-3.png`), 0 runtime
  errors, 0 console errors; the only failed loads are the 11 "Today" screenshot images.
- 15,199 interactive candidates: 15,199 hovered, 15,199 clicked, 0 failures. 9,561 hovers change the element's look (hover colour, border,
  pencil and info-icon visibility); 0 hovers add text (static boards; tooltips are drawn on their own boards); 16 clicks change the page, all
  on the overview's links out of the design (blocked). Clicking anything on a step board changes nothing else: the next state is the next
  board. Per board in `BOARD-COVERAGE.md`.

## 5 · Inventories
- **Text inventory** `inventory/text-inventory.json`: 2,630 distinct texts (every visible text, every data-tip / aria-label / title /
  placeholder / alt / value / option / optgroup, the 301 canvas notes, the 272 board titles, plus 130 rows the shared tool found in the files
  that no board shows as a whole: board `<title>`s of the "Today" boards and the off-canvas board, page names, design-library token notes, and
  pieces of longer shown texts). Classified for now: **UI-TEXT 1,079 · DATA 852 · NOTE 699 · unclassified 0**, each with its basis and the
  boards it shows on. Classification against the cases (COVERED / OUT-OF-SCOPE / SPEC-CONFLICT / CASE-NEEDED) is for the case author.
- **Visual inventory** `inventory/visual-inventory.json`: 78 screens (boards grouped by breadcrumb kind or title) with every state (board) and
  picture; per table the columns in order with left edge and width at 1440, header style, cell kinds (bold, link, badge, checkbox, muted text,
  dash, number, sub-line), alignment, row heights, dash cells, header info tooltips and sort icons; badges with colours and heights; buttons
  with variant and disabled state; 36 icons named (Lucide names; the info icon is the 18 px Material info-outline that tp-app.css says copies
  the Work In Progress report); dialogs with widths; menus; tooltips with their position against the outlined element; toasts with position;
  page frame; inputs with prefixes/suffixes and widths; the outlined click target of every step board; the 57 design-library sentences;
  1536 results; line 9 and line 10 results. Look facts worth a case (from the files and the renders):
  - Tooltips: grey #616161, text #fafafa, 13 px (0.8125rem), radius 4, max 18rem, "6px below the anchor" (tp-app.css v3.17, copied from
    the Work In Progress report); rendered 0-5 px below the outlined element.
  - Info icon: 18 px, muted, accent on hover/focus, 44 px hit area (tp-app.css v3.17); price info icon "shows only on hover over the row or
    price, or on keyboard focus" (Fabian, Nov 2).
  - Rename pencil "shows while the pointer is over the name (or it has focus); always shown without hover (touch)" (Branko, Nov 9).
  - Tier numbers are plain text, no pill (Branko, Nov 9); the "#" column numbers centred under the "#".
  - Grid: tier columns rendered 149 px and 160 px wide at 1440 (also 170/176 on a few boards); "the grid never stretches its columns to fill a
    wide box: spare width stays to the right"; up to 5 cost ranges with no vertical scrollbar; the below-cost triangle sits in "a space kept
    beside every value, so nothing shifts" (note 15.1).
  - Report: Parts Invoiced is the bold headline column, third, not pinned; Totals row sticky at the bottom on the page background; filter
    chips 28 px pills, filled with the accent tint when they hold a value (Date and Location always filled); first column inset 2rem.
  - Toasts: bottom right, 24 px from the edges, 400 px wide, compact success style; the Set Rule toast is the full style with Undo, close and
    a 20-second timer bar (`--toast-ms: 20000ms`), paused while pointed at.
  - Menus open 4 px below their button, aligned right, 200 px wide; a menu that would be cut off opens upward (2.9).
  - Dialog widths: 480 (confirmations), 520, 560, 600 (Edit Customer), 640 (Change Customer, Edit Part Request), 860 (Audit Logs), 880 (Summary
    CSV), 900 (Manage Customers); 358 on the phone.
- **Dialogs, menus, panels, tooltips, toasts, errors, banners, empty states**: `inventory/overlays.json` (160 distinct) and
  `inventory/panels.json` (58 panels: filter panels, pickers, price-details popovers, menus, with every row, its checked state and buttons).
  The hand list is section 6.

## 6 · Every dialog, menu, tooltip, toast and message (hand list; exact letters; buttons in screen order, left to right)

### Dialogs
| Board(s) | Title | Body / rows | Buttons (in order) | Close (x) | Width |
|---|---|---|---|---|---|
| 2.6 | Audit Log: Tiers | table Event · User · Details · Date · Time, newest first (e.g. "Tier Created", "Tier Archived", "Tier Deleted", "Customer Added") | Close | yes | 860 |
| 2.19 | Tier 2 Can’t Be Archived Yet | "4 customers are on Tier 2" / "Take them off or move them to another tier first, then archive it. Parts already on their work orders keep their prices." Table Customer · On Tier 2 for ("Work orders and Part Sales", "Work orders only") | Remove Customers · Close | yes | 560 |
| 2.20, 9.16 | Manage Customers on Tier 2 (Remove tab) | tabs "Add Customers" · "Remove Customers 4"; columns (checkbox) · Customer · Work Order Tier · Part Sales Tier · Take Off Tier 2 for | Cancel · Remove Customers (disabled) | yes | 900 |
| 2.22 | Archive Tier 5? | "These tiers price the same as Tier 5 and will follow Tier 4 instead:" list "Internal"; "Parts already on work orders keep their prices." | Cancel · Archive | yes | 520 |
| 2.23 | Archive Tier 5? | "Parts already on work orders keep their prices." | Cancel · Archive | yes | 520 |
| 2.29 | Delete Tier 5? | "This can’t be undone. Parts already on work orders keep their prices." | Cancel · Delete | yes | 520 |
| 2.40 | Audit Log: Tier 2 | Event · User · Details · Date · Time | Close | yes | 860 |
| 2.53 | Set Tier 2’s Rule? | "Tier 2 becomes 35% off in all 7 matrices (2 inactive), replacing what it had. Parts already on work orders keep their prices." | Cancel · Set Rule | yes | 480 |
| 2.54, 2.55 | Set Tier 2’s Rule? | "Tier 2 becomes 35% off in 2 matrices, replacing what it had. Parts already on work orders keep their prices." | Cancel · Set Rule | yes | 480 |
| 3.7 | Change Default’s Prices? | "Default’s rules change, and these 3 tiers price from Default in this matrix, so they change too:" Tier 3 / Tier 4 / Tier 5; "Parts already on work orders keep their prices." | Cancel · Save | yes | 560 |
| 3.8 | Audit Log: Stop 40 | Event · User · Details · Date · Time ("Rule Changed", "Matrix Created") | Close | yes | 860 |
| 3.13 | Change Prices in 2 Categories? | "The Fluids 30 matrix prices 2 categories:" Filters / Oil; "Saving changes prices in all 2. Parts already on work orders keep their prices."; "Default’s rules change, and these 4 tiers price from Default in this matrix, so they change too:" Tier 2…Tier 5 | Cancel · Change All | yes | 560 |
| 3.14 | Save the General Matrix? | "This changes prices for 9 categories without a matrix of their own." list ending "+6"; Default follower list | Cancel · Save | yes | 520 |
| 3.16, 4.23 | Discard These Changes? | "Your changes haven’t been saved." | Keep Editing · Discard Changes | yes | 480 |
| 3.20 | Turn Off Part Sale Pricing? (aria-label "Turn off Part Sale pricing?") | "Turning off the separate Part Sale matrix will revert the pricing to the work order matrix." | Cancel · Turn Off | yes | 480 |
| 3.29 | Delete Stop 40? | "Stop 40 prices Brakes. Once it’s deleted, it uses the General Matrix. Tier 2, Tier 3, Internal have their own rows here; those rows go with it. Parts already on work orders keep their prices." | Cancel · Delete | yes | 480 |
| 4.24 | Change Prices in 3 Categories? | Dynamic 26: Batteries / Electrical / Lighting; follower list Tier 2…Tier 5 | Cancel · Change All | yes | 560 |
| 6.14 | Audit Log: Matrices | Event · User · Details · Date · Time | Close | yes | 860 |
| 7.2 (Today, drawn) | Edit Category | Name; QuickBooks Products And Services; Tax Exempt | Delete · Save & Close | yes | 560 |
| 7.15 | Audit Log: Categories | Event · User · Details · Date · Time ("Category Deleted … → Uncategorized (23 parts, 61 lines)") | Close | yes | 860 |
| 8.11 | Delete Wipers? | "Its parts and lines, invoiced ones included, move to Uncategorized, and its QuickBooks mapping is removed. This can’t be undone." | Cancel · Delete | yes | 480 |
| 9.4, 9.5 | Manage Customers on Tier 2 (Add tab) | tabs Add Customers · Remove Customers 4; columns (checkbox) · Customer · Work Order Tier · Part Sales Tier · Use Tier 2 for; no message above the list (tab tooltip instead) | Cancel · Add Customers (disabled) | yes | 900 |
| 9.6, 9.7, 9.14 | same, 2 checked | dark bar "2 selected · Select All (21) · Work Orders · Part Sales" above the search; per-row Work Orders / Part Sales checkboxes | Cancel · Add 2 Customers | yes | 900 |
| 9.8 | same, 1 checked, both channels unticked | row message "Pick Work Orders, Part Sales or both." | Cancel · Add 1 Customer (disabled) | yes | 900 |
| 9.9 / 9.10 / 9.11 | same: Select All / one channel / skips | 21 selected; 1 selected; 20 selected (footer counts the skipped) | Cancel · Add 21 Customers / Add 1 Customer / Add 20 Customers | yes | 900 |
| 9.12 / 9.13 | same: search / no match | narrowed list / "No customer matches "zzz". Clear Search" | Cancel · Add Customers (disabled) | yes | 900 |
| 9.17 | Manage Customers on Tier 2 (Remove, 1 checked) | 1 selected · Select All (4) | Cancel · Remove 1 Customer | yes | 900 |
| 9.18, 9.19 | Remove 1 Customer? | "Removing 1 customer: 1 for both. They go back to Default for the channels you picked. Parts already on their work orders keep their prices." | Keep Customers · Remove | yes | 480 |
| 9.24 | Manage Customers on Tier 5 (Remove tab, count 0) | "No customer is on Tier 5 yet." | Cancel · Remove Customers (disabled) | yes | 900 |
| 9.31-9.37 | Edit Customer | fields in order: Name * · Phone · Address · (labor rate select: Default, Heavy Duty, Light Duty) Default Labor Rate · (Location default, No shop supplies, 5% of labor) Default Shop Supplies · Work Order Tier (help "Prices parts on this customer’s new work orders. Existing work orders and Part Sales keep their prices and tier.") · Part Sales Tier (help "Prices parts on Part Sales. Set on its own: changing the work order tier never changes it.") · Notes. 9.36 Counter Sale adds "Every walk-in sale uses this tier."; 9.37 (only Default) has no tier fields | Save | yes | 600 |
| 9.39-9.41 (phone) | Edit Customer | same fields stacked | Save | yes | 358 |
| 11.1, 11.2 | Edit Part Request | Part Number · Description * · Quantity · Source (Inventory / Vendor / Found Part) · Category (17 categories) · Vendor · Cost (help "The cost of an inventory part can’t be re-entered.") · Core Charge · Sell Price · Margin | Remove Part · Cancel · Save Part | yes | 640 |
| 11.3, 11.4 | Split Work Order | "Choose the lines to move. Each line’s labor and parts move together to a new work order for Acme Freight." rows "Replace drive tires 2 parts", "PM service, 250-hour 3 parts" | Cancel · Split | yes | 560 |
| 11.6 | Receive Part | "Drive tire M729"; Received Cost * ($) | Cancel · Receive | yes | 480 |
| 14.3 | Change Customer | "Updating the customer will change the account and contact on this work order. Existing notes, assets, and lines stay on the work order; only the customer and contact are updated. Parts already on the work order keep their prices, and new parts keep this work order’s pricing." Customer, Contact | Cancel · Update Customer (disabled) | yes | 640 |
| 14.4, 14.7 | Change Customer (other tier picked) | + amber note "This work order keeps Tier 2 pricing. Default applies to new work orders, or split this one to use it." | Cancel · Update Customer | yes | 640 |
| 14.5 | Change Customer (Part Sale) | Part Sale wording; note "This Part Sale keeps Tier 4 pricing. Default applies to new Part Sales, or split this one to use it." | Cancel · Update Customer | yes | 640 |
| 14.6 | Change Customer (same tier) | no amber note | Cancel · Update Customer | yes | 640 |
| 20.20 | Summary CSV (prototype stand-in) | CSV text: title, "Date Range: …", Locations, Sales Type, Priced By, Category, Customer, then the columns | Close · Copy | yes | 880 |

### Menus and pickers
| Board(s) | Opened from | Rows in order |
|---|---|---|
| 2.4, 2.5, 3.6, 3.7, 6.13, 7.14 | three-dot beside New Tier / matrix page / New Matrix / New Category | Audit Log |
| 2.7, 2.21, 2.28 | tier row three-dot (tier never used) | Audit Log · Archive · Delete |
| 2.8, 2.18, 2.38, 2.39 | tier row / tier page three-dot (tier in use) | Audit Log · Archive · Delete (greyed; hover "Can’t delete Tier 2. 2 open work orders, estimates or Part Sales use it.") |
| 2.9, 2.25, 2.26 | archived tier row (last row: opens upward) | Audit Log · Reactivate · Delete |
| 3.26, 3.28, 6.11 | matrix row three-dot | Duplicate · Delete |
| 6.12 | General Matrix row | Duplicate · Delete (greyed; "The General Matrix can’t be deleted. You can edit it.") |
| 8.10 | category page three-dot | Audit Log · Delete |
| 12.9, 14.2-14.8 | work order three-dot | Change Customer · Split Work Order · Back to Work Orders |
| 14.5 | Part Sale three-dot | Change Customer · Split Part Sale · Back to Part Sales |
| 9.32 | Work Order Tier picker, typed "3" | search "Search tiers" = 3 (clear button) · 3 · Tier 3 |
| 9.33, 9.40 | Work Order Tier picker | 1 · Default · 2 · Tier 2 (ticked) · 3 · Tier 3 · 4 · Tier 4 · 5 · Tier 5 · 6 · Internal |
| 20.18, 20.19, 20.21 | Download | Download Summary (PDF) (greyed, "Not part of this prototype") · Download Expanded View (PDF) (greyed) · Download Summary (CSV) · Download Expanded View (CSV) |
| 2.50 and grid boards | rule type select | group "Off default price": % Off · $ Off; group "From cost": + $ · Markup % · Margin %; grid column picker adds "Previous tier" first; Default's picker has only + $ · Markup % · Margin %; a mixed column shows "Mixed rules" |

### Filter panels
| Board(s) | Panel | Rows in order (count) | Foot |
|---|---|---|---|
| 6.5, 6.6 | Status filter | Active 5 · Inactive 2 | Clear selection |
| 9.3 | Sales Type filter (tier's Customers tab; note calls it the channel filter) | Work Orders and Part Sales 3 · Work Orders only 1 | Clear selection |
| 20.5 | Priced By filter | Default · Tier 2 · Tier 3 · Tier 4 · Tier 5 · Internal · Fleet Old · Fixed price · Fixed line total · Manual · Before tiers | Clear selection |
| 20.6 | Customer filter | search "Search customers"; 22 customers A-Z | Clear selection |
| 20.7 | Category filter | search "Search categories"; 17 categories A-Z (Uncategorized among them, alphabetical) | Clear selection |
| 20.8 | Location filter | Calgary North (ticked) · Red Deer | Clear selection |
| 20.9, 20.23 | Sales Type filter (report) | Part Sales · Work Orders (20.9: Work Orders ticked) | — |
| 20.10, 20.11 | Date filter | This month · Last month · This quarter · Last 90 days · Year to date · Custom range (From, To) | 20.10 error "Choose a date range of one year or less."; 20.11 help "One year at most." |
| 20.14, 20.15 | Columns | Parts Cost · Parts Credits · Parts Net · Parts Margin · Parts Margin % · % of Total (20.15: Parts Margin unticked) | — |

### Tooltips (drawn)
2.3 "The tier’s place in the order. New tiers go last; archiving one moves later tiers up." · 2.8 "Can’t delete Tier 2. 2 open work orders,
estimates or Part Sales use it." · 4.1 "A part’s cost picks its row. The first range starts at $0.00; the last has no upper limit." · 4.2 "Uses
previous tier, 1 · Default." · 4.27 "Default prices live parts, so it can’t be changed in the archived view." · 6.3 "Tiers this matrix prices
itself, by number. The rest are the same as the previous tier." · 6.4 "1 · Default, 2 · Tier 2, 3 · Tier 3, 4 · Tier 4, 6 · Internal" · 6.8 "No
categories use this matrix" · 6.12 "The General Matrix can’t be deleted. You can edit it." · 7.4 "Uses previous tier, 4 · Tier 4." · 7.9 "The
Fluids 30 matrix also prices 1 other category: Oil." · 7.10 "Can’t edit here. The Fluids 30 matrix prices 2 categories, so edit it from the
matrix." · 9.5 "Check the customers to put on Tier 2. Each one gets Work Orders and Part Sales unless you uncheck one, in the bar for everyone or
on the customer’s own row." · 15.1 "Tier 5 sells a $50.01 part below cost." (All `data-tip` tooltip texts, drawn or not, are in the text
inventory: e.g. "How each matrix prices this tier. Click a matrix to change it.", "Uses previous tier, 2 · Tier 2. Priced by 1 · Default’s rule.")

### Price details popovers ("Why this price", 400 px)
11.7, 12.1 tier price (Priced by · Matrix · Cost Range · Rule · Cost · Sell price · Priced on · From + "Acme Freight’s work order tier (Tier 2)
prices its parts.") · 12.2 adds "Same as previous tier: Default" · 12.3 "Price typed by hand" (Priced by Manual (typed by hand) · Typed by ·
Sell price · Calculated price · From + "A typed price stays when the quantity changes. Changing the cost or category recalculates it. Clear the
sell price to go back to the calculated price.") · 12.5 "Priced before tiers" ("This part was priced before Tiered Pricing, so no tier or rule
was recorded.") · 12.6 customer moved tier ("Priced by Default, Northway Haulers’s tier when this work order was made. Northway Haulers is now
on Tier 2.") · 12.7 canned line ("Saved price from canned line Air brake chamber replace.") · 12.8 fixed line total ("Part of a fixed line
total of $450.00 (parts $210.00)" … "Bow River Haulers’s tier doesn’t apply to this line.") · 12.9 "Priced for the previous customer" ·
13.4 Part Sale ("15% off Default ($255.15)", "Calgary Transit Parts’s Part Sales tier (Tier 4) prices its parts.").

### Toasts
2.17 "Fleet Plus created" / "It prices the same as the tier before it until you set its rules." · 2.24 "Tier 5 archived" / "It stays in reports.
The tiers after it move up one number." · 2.27 "Tier 5 is reactivated. It’s now the last tier, Tier 6." · 2.30 "Tier 5 deleted" · 2.37 "Tier
renamed to Fleet" · 2.56 "Tier 2 set to 35% off" / "2 matrices changed." [Undo] [x] 20 s · 2.57 "… 1 matrix changed." · 2.58 "Undone" / "Tier 2’s
rules are back." · 2.60 "Tier 2 already uses 35% markup in that matrix" · 3.12 "Stop 40 saved" / "1 change: Tier 2 $0.00–$100.00: 22% margin.
Parts already on work orders keep their prices." · 3.18 "Separate Part Sale pricing on" / "It starts as a copy of the work order prices. Click
Edit to change them." · 8.1 "Brakes now uses Tread Plus" / "Parts already on work orders keep their prices." · 8.9 "Wheel Seals created" /
"Priced by General Matrix for every tier." · 8.12 "Wipers deleted" · 9.15 "2 customers added to Tier 2" / "New work orders and Part Sales use
Tier 2. Existing ones keep their prices and tier." · 9.20 "1 customer taken off Tier 2" / "They’re back on Default for the channels you picked.
Existing work orders and Part Sales keep their prices and tier." · 9.23 "Fleet Old is reactivated. It’s now the last tier, Tier 7." · 9.35
"Acme Freight saved" / "Existing work orders and Part Sales keep their prices and tier." · 10.8 "Part added" / "$308.00 each, priced by Tier 2." ·
11.5 "S1-2877 created from S1-2671" / "3 parts moved, priced by Tier 3." · 11.7 "Part received" / "$80.00 each, Tier 2." · 12.2 "Part added" /
"$59.64 each, priced by Tier 2." · 12.9, 14.8 "Customer changed to Northern Lights Towing" / "4 lines priced at Tier 2, Fixed price and Manual
for the previous customer." · 20.22 "Empty export" (info style).

### Field errors, banners, empty states, notices
Errors: 2.12 "Tier name is a required field" · 2.13 / 2.36 taken name (field red) · 2.14 archived name · 2.15 "Manual is used by the reports.
Choose another name." · 2.51 (bar) value required · 2.52 "Enter a margin from 0 to 99.99" · 3.15 / 4.18 banner "Save is blocked" + "Tier 5: enter
a % from 0 to 99.99 in every range." / "Work Order Matrix: Rule 1: Enter a margin from 0 to 99.99" · 3.24 "Save is blocked" "Matrix name is a
required field." + field "Matrix name is a required field" · 3.25 "A matrix called Stop 40 already exists." · 5.3 cost 0 → field error, every
column "—" · 8.4 "A category called tires already exists. Click away to keep Brakes." · 8.7 "Name is a required field" · 9.8 "Pick Work Orders,
Part Sales or both." · 10.9 "Sell price cannot be negative." · 20.10 "Choose a date range of one year or less."
Banners/notices: 4.26-4.27 "Archived tiers don’t price parts. Reactivate a tier and assign customers to use these rules." · 9.36 "Every walk-in
sale uses this tier." · 12.9, 14.8 "4 lines priced at Tier 2, Fixed price and Manual for the previous customer" / "They keep their prices, and
their price details say who they were priced for." · 14.4, 14.7 and 14.5 amber notes (above).
Empty states: 3.17 "Part Sales use the work order prices" / "Turn on Separate Part Sale pricing to give Part Sales their own prices." · 6.10 "No
matrices match "zzz"" [Clear Search] · 7.6 "No category matches "zzz"" [Clear Search] · 9.2 "No customer matches "zzz"" [Clear All Filters] · 9.13
"No customer matches "zzz"." [Clear Search] · 9.21 "Fleet Old is archived" / "Reactivate it to add customers." [Reactivate Tier] · 9.23, 9.24 "No
customers on … yet" / "Add customers to price their parts with this tier." [Manage Customers] · 9.24 "No customer is on Tier 5 yet." · 9.36 "No
work orders yet" · 20.11 "There are no results for selected date range" · 20.21-20.23 "No record matches these filters" / "Try changing filters
to widen your results." [Clear All Filters].

## 6b · Movement found by comparing the design's own pictures of the same screen (checklist line 10)

Method: boards were grouped by screen (same breadcrumb, title and selected tab); for each pair with the SAME column headings the left edge (x), width and top (y) of every heading were compared at 1440 px. 260 pairs compared, 143 with identical headings, 49 of those with movement. Pairs whose headings differ (a column hidden, edit mode adds a picker row) are in inventory/movement.json too.

| Screen | From (board) | To (board) | What moves (heading: dx / dwidth / dy px) |
|---|---|---|---|
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 47 2.47 Check a matrix | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 48 2.48 Click select-all | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 49 2.49 Uncheck two | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 50 2.50 Type 35 | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 51 2.51 Click Set Rule with no value | (checkbox/blank): +0 / +0 / +102; Matrix: +0 / +0 / +102; Work Order Matrix: +0 / +0 / +102; Part Sale Matrix: +0 / +0 / +102 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 52 2.52 Pick Margin %, type 120, click Set Rule | (checkbox/blank): +0 / +0 / +102; Matrix: +0 / +0 / +102; Work Order Matrix: +0 / +0 / +102; Part Sale Matrix: +0 / +0 / +102 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 53 2.53 Click Set Rule (every matrix checked) | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 54 2.54 Click Set Rule (some checked) | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 55 2.55 Click Set Rule in the dialog | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 32 2.32 Result: The tier's page opens on Pricing: every matr | 59 2.59 Set a rule it already has | (checkbox/blank): +0 / +0 / +68; Matrix: +0 / +0 / +68; Work Order Matrix: +0 / +0 / +68; Part Sale Matrix: +0 / +0 / +68 |
| Pricing › Matrices › Stop 40 / ('',) | 05 3.5 Result: Enter or clicking away saves at once; Esc can | 25 3.25 Type a taken name and click Create Matrix | Part Cost: +0 / +70 / -51; 1Default: +70 / -11 / -51; 2Tier 2: +58 / -11 / -51; 3Tier 3: +47 / -11 / -51; 4Tier 4: +35 / -11 / -51; 5Tier 5: +23 / -11 / -51 … |
| Pricing › Matrices › Hydraulics 2025 / ('Hydraulics 2025',) | 10 3.10 Result: No badge on the page; the reason shows as pl | 07 4.7 Type in a range | Part Cost: +0 / +70 / +138; 1Default: +70 / -11 / +138; 2Tier 2: +58 / -11 / +138; 3Tier 3: +47 / -11 / +138; 4Tier 4: +35 / -11 / +138; 5Tier 5: +23 / -11 / +138 … |
| Pricing › Matrices › Hydraulics 2025 / ('Hydraulics 2025',) | 10 3.10 Result: No badge on the page; the reason shows as pl | 08 4.8 Change range 2 to Markup % and type 45 | Part Cost: +0 / +70 / +138; 1Default: +70 / -11 / +138; 2Tier 2: +58 / -11 / +138; 3Tier 3: +47 / -11 / +138; 4Tier 4: +35 / -11 / +138; 5Tier 5: +23 / -11 / +138 … |
| Pricing › Matrices › Fluids 30 / ('Fluids 30',) | 13 3.13 Save a matrix that prices several categories | 02 4.2 Hover a "Uses previous tier" cell | Part Cost: +0 / -70 / -124; 1Default: -70 / +11 / -124; 2Tier 2: -58 / +11 / -124; 3Tier 3: -47 / +11 / -124; 4Tier 4: -35 / +11 / -124; 5Tier 5: -23 / +11 / -124 … |
| Pricing › Matrices › Fluids 30 / ('Fluids 30',) | 13 3.13 Save a matrix that prices several categories | 16 4.16 Same as previous tier, in edit | Part Cost: +0 / -70 / -124; 1Default: -70 / +11 / -124; 2Tier 2: -58 / +11 / -124; 3Tier 3: -47 / +11 / -124; 4Tier 4: -35 / +11 / -124; 5Tier 5: -23 / +11 / -124 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 04 4.4 Result: Tread Plus Default: + $45 up to $300, then 15% margin | Cost Range: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 04 4.4 Result: Tread Plus Default: + $45 up to $300, then 15% margin | Part Cost: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 14 4.14 Ranges with different types | Cost Range: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 14 4.14 Ranges with different types | Part Cost: +0 / +0 / -58; 1Default: +0 / +0 / -58; 2Tier 2: +0 / +0 / -58; 3Tier 3: +0 / +0 / -58; 4Tier 4: +0 / +0 / -58; 5Tier 5: +0 / +0 / -58 … |
| Pricing › Matrices › Tread Plus / ('Tread Plus',) | 19 3.19 A matrix with its own Part Sale prices | 15 4.15 Result: The column header reads "Mixed rules"; cells spell out | Part Cost: +0 / +70 / +80; 1Default: +70 / -11 / +80; 2Tier 2: +58 / -11 / +80; 3Tier 3: +47 / -11 / +80; 4Tier 4: +35 / -11 / +80; 5Tier 5: +23 / -11 / +80 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 23 3.23 Open Categories | Cost Range: +0 / +0 / +221; 1Default + $ Markup % Ma: +0 / +0 / +221; 2Tier 2 Previous tier % : +0 / +0 / +221; 3Tier 3 Previous tier % : +0 / +0 / +221; 4Tier 4 Previous tier % : +0 / +0 / +221; 5Tier 5 Previous tier % : +0 / +0 / +221 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 23 3.23 Open Categories | Part Cost: +0 / +0 / +221; 1Default: +0 / +0 / +221; 2Tier 2: +0 / +0 / +221; 3Tier 3: +0 / +0 / +221; 4Tier 4: +0 / +0 / +221; 5Tier 5: +0 / +0 / +221 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 24 3.24 Click Create Matrix with no name | Cost Range: +0 / +0 / +26; 1Default + $ Markup % Ma: +0 / +0 / +26; 2Tier 2 Previous tier % : +0 / +0 / +26; 3Tier 3 Previous tier % : +0 / +0 / +26; 4Tier 4 Previous tier % : +0 / +0 / +26; 5Tier 5 Previous tier % : +0 / +0 / +26 … |
| Pricing › Matrices › New Matrix / ('',) | 22 3.22 Result: Name, categories and the grid ready to fill; | 24 3.24 Click Create Matrix with no name | Part Cost: +0 / +0 / +26; 1Default: +0 / +0 / +26; 2Tier 2: +0 / +0 / +26; 3Tier 3: +0 / +0 / +26; 4Tier 4: +0 / +0 / +26; 5Tier 5: +0 / +0 / +26 … |
| Settings › Categories › New Category / ('',) | 06 8.6 Result: Name (cursor in it), matrix, Cancel / Create  | 07 8.7 Click Create Category with no name | Cost Range: +0 / +0 / +26; 1Default: +0 / +0 / +26; 2Tier 2: +0 / +0 / +26; 3Tier 3: +0 / +0 / +26; 4Tier 4: +0 / +0 / +26; 5Tier 5: +0 / +0 / +26 … |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 06 9.6 Check two customers | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 07 9.7 Uncheck Part Sales on one row | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 08 9.8 Uncheck both Work Orders and Part Sales on a row | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 09 9.9 Click Select All | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 10 9.10 Uncheck Part Sales in the bar, then Select All | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 11 9.11 Result: Customers already on Tier 2 for the picked channel are | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 12 9.12 Search customers | Customer: +0 / -11 / +0; Work Order Tier: -11 / +6 / +0; Part Sales Tier: -6 / +6 / +0 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 13 9.13 A search with no match | Customer: +0 / -83 / +0; Work Order Tier: -83 / +43 / +0; Part Sales Tier: -40 / +40 / +0 |
| Pricing › Tiers › Tier 2 / ('Tier 2',) | 04 9.4 Click Manage Customers | 14 9.14 Click Add to Tier 2 | (checkbox/blank): +0 / +0 / +92; Customer: +0 / +0 / +92; Work Order Tier: +0 / +0 / +92; Part Sales Tier: +0 / +0 / +92; Use Tier 2 for: +0 / +0 / +92 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 06 10.6 Quick Add a part with a cost | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 07 10.7 Save it | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 08 10.8 Result: Priced by the work order's tier | Total: +2 / -2 / +0 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 09 10.9 Quick Add with a sell price of -5 | Name/Description: -19 / -52 / +0; Actual/Estimate: -71 / +14 / +0; Progress: -57 / +9 / +0; Status: -48 / +12 / +0; Action: -36 / +8 / +0; Rate: -28 / +10 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 07 11.7 Receive a tier-priced part at a new cost, then hover its price | Name/Description: +1 / +3 / +0; Actual/Estimate: +4 / +2 / +0; Progress: +6 / +1 / +0; Status: +7 / +2 / +0; Action: +8 / +1 / +0; Rate: +9 / +1 / +0 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 02 12.2 Hover a part priced through Same as previous tier | Progress: +2 / +0 / +0; Status: +2 / +1 / +0; Action: +3 / +0 / +0; Rate: +3 / +0 / +0; Margin: +3 / +0 / +0; Total: +4 / -4 / +0 |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 09 12.9 Hover a line priced for the previous customer | Name/Description: +0 / +0 / +79; Actual/Estimate: +0 / +0 / +79; Progress: +0 / +0 / +79; Status: +0 / +0 / +79; Action: +0 / +0 / +79; Rate: +0 / +0 / +79 … |
| Work Orders › S1-2671 / ('',) | 05 10.5 Result: Parts are priced by the work order's tier | 08 14.8 Result: A notice counts the lines priced for the previous cust | Name/Description: +0 / +0 / +79; Actual/Estimate: +0 / +0 / +79; Progress: +0 / +0 / +79; Status: +0 / +0 / +79; Action: +0 / +0 / +79; Rate: +0 / +0 / +79 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 03 20.3 Open a tier's row | Priced By: +0 / +79 / +0; Parts Cost: +79 / -10 / +0; Parts Invoiced: +70 / -12 / +0; Parts Credits: +58 / -12 / +0; Parts Net: +47 / -10 / +0; Parts Margin: +38 / -11 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 04 20.4 Open a customer's row | Priced By: +0 / +94 / +0; Parts Cost: +94 / -10 / +0; Parts Invoiced: +84 / -14 / +0; Parts Credits: +71 / -14 / +0; Parts Net: +56 / -10 / +0; Parts Margin: +48 / -13 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 11 20.11 Pick a range with no sales | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 21 20.21 Download with no rows | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 22 20.22 Result: "Empty export." | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Tier',) | 02 20.2 Reports › Sales by Tier | 23 20.23 Filters that match nothing | (checkbox/blank): +0 / -20 / +0; Priced By: -20 / -16 / +0; Parts Cost: -36 / +5 / +0; Parts Invoiced: -31 / +5 / +0; Parts Credits: -25 / +5 / +0; Parts Net: -20 / +1 / +0 … |
|  / ('Sales by Category',) | 16 20.16 Sales by Category | 17 20.17 Open a category's row | Category: +0 / +10 / +0; Parts Cost: +10 / -1 / +0; Parts Invoiced: +8 / -1 / +0; Parts Credits: +7 / -1 / +0; Parts Net: +5 / -1 / +0; Parts Margin: +5 / -2 / +0 … |


## 6c · Stress data probe (checklist line 9) — harness result, not a design statement

The design draws no long or special-character names. To show the case author what the design's own styles do, every occurrence of a typed record name (tier, matrix, category, customer) on 32 representative boards was replaced in the rendered page with: (spaces) "Northern Alberta Heavy Equipment Fleet Services Preferred Customer Pricing", (nospaces) "NorthernAlbertaHeavyEquipmentFleetServicesPreferredCustomerPricingTier", (special) `A&B "Fleet" O'Neil <Tier> & Co.`. Pictures in render/stress/. The expected look for these cases must still come from a source (PRD, design library, PO answer).

| Board | Value | Names replaced | How they show | Page wider | Columns moved | Rows taller | Runs past its box |
|---|---|---|---|---|---|---|---|
| 2.2 T01-TiersList | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.2 T01-TiersList | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.2 T01-TiersList | special | 3 | one line 3 |  |  | 0 |  |
| 2.32 TP01-TierPage | spaces | 7 | one line 1, wraps to 2 lines 5, wraps to 4 lines 1 |  |  | 3 |  |
| 2.32 TP01-TierPage | nospaces | 7 | one line 2, cut off without ... 5 | yes |  | 1 | runs past its TD. |
| 2.32 TP01-TierPage | special | 7 | one line 6, wraps to 2 lines 1 |  |  | 1 |  |
| 2.7 T05-RowMenu | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.7 T05-RowMenu | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.7 T05-RowMenu | special | 3 | one line 3 |  |  | 0 |  |
| 6.2 MX01-Matrices | spaces | 5 | shortened with ... 3, wraps to 4 lines 1, wraps to 8 lines 1 |  |  | 2 |  |
| 6.2 MX01-Matrices | nospaces | 5 | shortened with ... 3, cut off without ... 2 |  |  | 1 |  |
| 6.2 MX01-Matrices | special | 5 | one line 3, wraps to 2 lines 1, wraps to 4 lines 1 |  |  | 1 |  |
| 3.2 MP01-Matrix | spaces | 7 | one line 2, wraps to 2 lines 1, shortened with ... 4 |  |  | 0 |  |
| 3.2 MP01-Matrix | nospaces | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 3.2 MP01-Matrix | special | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 4.6 ED01-Edit | spaces | 7 | one line 1, wraps to 2 lines 1, shortened with ... 5 |  |  | 0 |  |
| 4.6 ED01-Edit | nospaces | 7 | one line 2, shortened with ... 5 |  |  | 0 |  |
| 4.6 ED01-Edit | special | 7 | one line 3, shortened with ... 4 |  |  | 0 |  |
| 7.3 CA01-Categories | spaces | 10 | wraps to 6 lines 2, wraps to 3 lines 2, wraps to 4 lines 5, wraps to 5 lines 1 |  |  | 2 |  |
| 7.3 CA01-Categories | nospaces | 10 | wraps to 2 lines 7, one line 2, wraps to 3 lines 1 |  | yes | 1 |  |
| 7.3 CA01-Categories | special | 10 | wraps to 3 lines 7, wraps to 2 lines 3 |  |  | 2 |  |
| 7.8 CA03-Category | spaces | 8 | one line 5, wraps to 2 lines 1, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 7.8 CA03-Category | nospaces | 8 | one line 6, shortened with ... 2 | yes |  | 0 | runs past its DIV.sv-field |
| 7.8 CA03-Category | special | 8 | one line 6, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 9.28 CU01-Customers | spaces | 2 | one line 2 |  | yes | 0 |  |
| 9.28 CU01-Customers | nospaces | 2 | one line 2 |  | yes | 0 |  |
| 9.28 CU01-Customers | special | 2 | one line 2 |  | yes | 0 |  |
| 9.30 CU02-CustomerCard | spaces | 4 | shortened with ... 1, wraps to 3 lines 2, one line 1 |  |  | 0 |  |
| 9.30 CU02-CustomerCard | nospaces | 4 | shortened with ... 1, wraps to 4 lines 2, one line 1 |  |  | 0 |  |
| 9.30 CU02-CustomerCard | special | 4 | shortened with ... 1, one line 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | spaces | 7 | shortened with ... 1, wraps to 3 lines 2, one line 1, wraps to 2 lines 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | nospaces | 7 | shortened with ... 1, wraps to 4 lines 2, one line 1, wraps to 2 lines 3 |  |  | 0 |  |
| 9.31 CU03-EditCustomer | special | 7 | shortened with ... 1, one line 3, wraps to 2 lines 3 |  |  | 0 |  |
| 9.32 CU04-TierPicked | spaces | 8 | shortened with ... 1, wraps to 3 lines 2, one line 1, wraps to 2 lines 4 |  |  | 0 |  |
| 9.32 CU04-TierPicked | nospaces | 8 | shortened with ... 1, wraps to 4 lines 2, one line 1, wraps to 2 lines 4 |  |  | 0 |  |
| 9.32 CU04-TierPicked | special | 8 | shortened with ... 1, one line 4, wraps to 2 lines 3 |  |  | 0 |  |
| 9.40 PH02-TierSheet | spaces | 5 | wraps to 3 lines 2, wraps to 2 lines 3 |  |  | 0 |  |
| 9.40 PH02-TierSheet | nospaces | 5 | wraps to 2 lines 5 |  |  | 0 | runs past its BUTTON.sv-menu__row |
| 9.40 PH02-TierSheet | special | 5 | one line 2, wraps to 2 lines 3 |  |  | 0 |  |
| 9.1 MC01-CustomersTab | spaces | 5 | one line 4, wraps to 2 lines 1 |  |  | 0 |  |
| 9.1 MC01-CustomersTab | nospaces | 5 | one line 5 | yes |  | 0 |  |
| 9.1 MC01-CustomersTab | special | 5 | one line 5 |  |  | 0 |  |
| 9.4 MC02-ManageAdd | spaces | 15 | one line 4, wraps to 2 lines 2, wraps to 3 lines 1, wraps to 6 lines 7, wraps to 5 lines 1 |  | yes | 1 |  |
| 9.4 MC02-ManageAdd | nospaces | 15 | one line 6, wraps to 2 lines 1, wraps to 4 lines 1, wraps to 3 lines 7 | yes | yes | 1 |  |
| 9.4 MC02-ManageAdd | special | 15 | one line 6, wraps to 2 lines 2, wraps to 3 lines 7 |  | yes | 1 |  |
| 9.6 MC03-TickTwo | spaces | 17 | one line 1, wraps to 2 lines 6, wraps to 4 lines 1, wraps to 3 lines 1, wraps to 6 lines 7, wraps to 5 lines 1 |  | yes | 4 |  |
| 9.6 MC03-TickTwo | nospaces | 17 | one line 3, cut off without ... 5, wraps to 2 lines 1, wraps to 4 lines 1, wraps to 3 lines 7 | yes | yes | 2 | runs past its TD. |
| 9.6 MC03-TickTwo | special | 17 | one line 7, wraps to 2 lines 3, wraps to 3 lines 7 |  | yes | 2 |  |
| 10.5 WO01-Lines | spaces | 2 | wraps to 3 lines 1, wraps to 2 lines 1 |  |  | 0 |  |
| 10.5 WO01-Lines | nospaces | 2 | one line 1, wraps to 2 lines 1 |  |  | 0 |  |
| 10.5 WO01-Lines | special | 2 | wraps to 2 lines 2 |  |  | 0 |  |
| 12.4 WO04-PartsTab | spaces | 5 | wraps to 3 lines 1, one line 2, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 12.4 WO04-PartsTab | nospaces | 5 | one line 3, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 12.4 WO04-PartsTab | special | 5 | wraps to 2 lines 1, one line 2, shortened with ... 2 |  |  | 0 | runs past its TD. |
| 13.3 PSL01-PartSale | spaces | 0 |  |  |  | 0 |  |
| 13.3 PSL01-PartSale | nospaces | 0 |  |  |  | 0 |  |
| 13.3 PSL01-PartSale | special | 0 |  |  |  | 0 |  |
| 14.3 CC02-Change | spaces | 4 | wraps to 3 lines 1, wraps to 2 lines 1, one line 2 |  |  | 0 | runs past its DIV.sv-field |
| 14.3 CC02-Change | nospaces | 4 | one line 3, wraps to 2 lines 1 |  |  | 0 | runs past its DIV.sv-field |
| 14.3 CC02-Change | special | 4 | wraps to 2 lines 2, one line 2 |  |  | 0 | runs past its DIV.sv-field |
| 12.9 G12-PrevCustomer | spaces | 8 | one line 1, wraps to 2 lines 4, wraps to 4 lines 2, wraps to 3 lines 1 |  |  | 0 |  |
| 12.9 G12-PrevCustomer | nospaces | 8 | one line 1, wraps to 2 lines 3, wraps to 3 lines 2, wraps to 4 lines 1, cut off without ... 1 |  |  | 0 |  |
| 12.9 G12-PrevCustomer | special | 8 | one line 4, wraps to 2 lines 2, wraps to 3 lines 2 |  |  | 0 |  |
| 20.2 RP01-ByTier | spaces | 2 | wraps to 2 lines 2 |  | yes | 2 |  |
| 20.2 RP01-ByTier | nospaces | 2 | one line 2 |  | yes | 0 |  |
| 20.2 RP01-ByTier | special | 2 | wraps to 2 lines 2 |  | yes | 2 |  |
| 20.3 RP02-RowOpen | spaces | 2 | wraps to 2 lines 2 |  | yes | 3 |  |
| 20.3 RP02-RowOpen | nospaces | 2 | one line 2 |  | yes | 1 |  |
| 20.3 RP02-RowOpen | special | 2 | wraps to 2 lines 2 |  | yes | 3 |  |
| 20.16 RP06-ByCategory | spaces | 3 | wraps to 2 lines 3 |  | yes | 3 |  |
| 20.16 RP06-ByCategory | nospaces | 3 | one line 2, wraps to 2 lines 1 |  | yes | 1 |  |
| 20.16 RP06-ByCategory | special | 3 | one line 2, wraps to 2 lines 1 |  | yes | 1 |  |
| 20.6 GR-CustFilter | spaces | 4 | wraps to 4 lines 2, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.6 GR-CustFilter | nospaces | 4 | one line 4 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.6 GR-CustFilter | special | 4 | wraps to 2 lines 4 |  | yes | 2 |  |
| 20.7 GR-CatFilter | spaces | 5 | wraps to 4 lines 3, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.7 GR-CatFilter | nospaces | 5 | one line 4, wraps to 2 lines 1 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.7 GR-CatFilter | special | 5 | wraps to 2 lines 5 |  | yes | 2 |  |
| 20.5 RP03-Filter | spaces | 5 | wraps to 4 lines 3, wraps to 2 lines 2 |  | yes | 2 |  |
| 20.5 RP03-Filter | nospaces | 5 | one line 5 |  | yes | 0 | runs past its BUTTON.sv-dd-row |
| 20.5 RP03-Filter | special | 5 | wraps to 2 lines 5 |  | yes | 2 |  |
| 3.13 SV02-ChangeAll | spaces | 9 | one line 1, wraps to 2 lines 4, shortened with ... 4 |  |  | 0 |  |
| 3.13 SV02-ChangeAll | nospaces | 9 | one line 4, shortened with ... 4, wraps to 3 lines 1 |  |  | 0 |  |
| 3.13 SV02-ChangeAll | special | 9 | one line 5, shortened with ... 4 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | spaces | 3 | one line 3 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | nospaces | 3 | one line 3 |  |  | 0 |  |
| 2.22 T21-ArchiveConfirm | special | 3 | one line 3 |  |  | 0 |  |
| 9.18 MC10-RemoveConfirm | spaces | 7 | one line 1, wraps to 2 lines 5, wraps to 4 lines 1 |  |  | 3 |  |
| 9.18 MC10-RemoveConfirm | nospaces | 7 | one line 2, cut off without ... 5 | yes |  | 1 | runs past its TD. |
| 9.18 MC10-RemoveConfirm | special | 7 | one line 6, wraps to 2 lines 1 |  |  | 1 |  |
| 8.1 CA07-PickMatrix | spaces | 10 | one line 5, wraps to 2 lines 2, shortened with ... 2, wraps to 3 lines 1 |  |  | 0 | runs past its DIV.sv-field |
| 8.1 CA07-PickMatrix | nospaces | 10 | one line 6, wraps to 2 lines 1, shortened with ... 2, cut off without ... 1 | yes |  | 0 | runs past its DIV.sv-field |
| 8.1 CA07-PickMatrix | special | 10 | one line 6, wraps to 2 lines 2, shortened with ... 2 |  |  | 0 | runs past its DIV.sv-field |
| 3.23 NM02-Cats | spaces | 12 | wraps to 9 lines 2, wraps to 2 lines 5, wraps to 10 lines 1, shortened with ... 4 |  |  | 0 |  |
| 3.23 NM02-Cats | nospaces | 12 | one line 2, wraps to 2 lines 6, shortened with ... 4 |  |  | 0 | runs past its BUTTON.sv-dd-row |
| 3.23 NM02-Cats | special | 12 | one line 7, wraps to 2 lines 1, shortened with ... 4 |  |  | 0 |  |


## 7 · Multi-step flows (canvas rows), driven board by board
30 rows (`inventory/flows.json`: every board in click order, its kind — click, result or state — and its outlined target). Each "Click …"
board was checked to be followed by its result board, and each result board against its note. All 30 rows run to a result. Two rows end on a
board whose title starts "Click": **4.23 "Click Cancel with changes"** (the same board already shows the "Discard These Changes?" dialog; what
Keep Editing or Discard Changes leads to is not drawn in this row; 3.16's note says "Keep Editing stays; Discard Changes opens the Part Sale
Matrix tab") and **10.12 "Click the Fixed Rules tab"** (a one-board row; the board shows the Fixed Rules tab itself, read only). No drag is
defined anywhere in the files (tp-app.css keeps a `tr.tp2-dragging` style from "Nov 5: drag to reorder tiers", but no board draws a drag and the
2.3 tooltip says the order follows creation and archiving), so the drag gate does not apply.

## 7b · Design-to-design inconsistencies (for the case author and, where they matter, the PO)
1. Letter case, note vs board: note 4.23 "Discard these changes?" / "Keep editing / Discard changes" and note 3.16 "Discard these changes?" vs the
   dialog "Discard These Changes?" with "Keep Editing" / "Discard Changes" (L-04: compare exact letters with the PRD).
2. Note 3.20 and the dialog's own aria-label say "Turn off Part Sale pricing?"; the visible title is "Turn Off Part Sale Pricing?".
3. Punctuation, note vs board: 20.22 "Empty export." vs toast "Empty export"; 6.8 "No categories use this matrix." vs tooltip without the period;
   3.24 "Matrix name is a required field." appears with the period in the banner and without it under the field (same board).
4. Two different date-range texts in the same panel: 20.10 error "Choose a date range of one year or less." vs 20.11 help "One year at most.".
5. "Sales Type" names two different filters: on a tier's Customers tab (9.3; the note calls it the channel filter) the rows are "Work Orders and
   Part Sales" / "Work Orders only"; on the reports (20.9) "Part Sales" / "Work Orders".
6. Search empty-state buttons differ: Customers tab no-match (9.2) offers "Clear All Filters", the Manage Customers no-match (9.13) and the lists
   (6.10, 7.6) "Clear Search"; 9.13 ends with a period, the others do not.
7. tp-app.css says tier columns are "136px at 1920 wide, down to 126px on smaller screens, never wider than 142px", but its own variables are
   128-176 px and the boards render them 149 and 160 px wide at 1440 (170/176 on a few).
8. 14 canvas frames are shorter than their board (section 2), so on the canvas the bottom of 9.28-9.37, 10.6, 10.7, 10.9, 12.9 and 14.8 is cut
   (9.35's toast sits at the cut).
9. `CU04b-TierChosen.dc.html` (title "8.4b Pick 3 · Tier 3", an older numbering) is in the package but not on the canvas; it equals board 9.33
   without the open picker list. A canvas shows every `.dc.html` it holds, so it may appear somewhere on the canvas.
10. Line 10 movements of the design's own pictures (section 6b): Sales by Tier columns move right by 58-94 px when a row is opened (20.3, 20.4)
    and left by 20-36 px on the empty states (20.11, 20.21-20.23); Sales by Category moves 7-10 px when a row opens (20.17); the filter chips
    shift left as a filled chip widens (Date chip x 525 → 433 when "Work Orders" is picked, 468 with a custom range, 482 with "None"); Manage
    Customers columns move 11 px on a search and 83 px on no match (9.12, 9.13); the work-order lines table moves 19-71 px while Quick Add is
    open (10.6, 10.7, 10.9) and 1-7 px on 11.7/12.2/10.8; the simulator's Part Cost column changes width by 70 px between view and edit (3.5 →
    3.25, 3.10 → 4.7, 3.13 → 4.2/4.16, 3.19 → 4.15); bars push the list down (bulk bar 68 px, bar error 102 px, Manage Customers selection bar
    92 px, the work-order notice 79 px).

11. Line 9 stress probe (harness, section 6c; pictures `render/stress/`): with a long name WITHOUT spaces the tier page title pushes the
    three-dot "More actions" button past the right edge and the page scrolls sideways (TP01); matrix names in the tier page's Matrix column are
    cut at the cell edge with no "..." (TP01, MC10); on Sales by Tier a long tier name in Priced By pushes the number columns right until
    "Parts Margin %" is cut at the right edge, and a long customer or category name in the Customer / Category filter list is cut at the
    panel edge with no "..." (GR-CustFilter, GR-CatFilter, RP03) — the L-21 pattern (SV-12722, SV-12764). Names WITH spaces wrap inside their
    row; grid column headings (tier names) are shortened with "..."; long names wrap in the Categories list and push its row taller. The
    expected behaviour for these cases must come from a source (PRD, library, PO).

## 8 · Design behaviour the PRD may not have (check against the requirement map)
2.9 menu opens upward on the last row · 2.11 New Tier opens a page, no dialog, cursor in the name · 2.15 reserved names (Manual, Fixed price, Fixed
line total, Before tiers, any letter case) · 2.27 / 9.23 Reactivate with no confirmation, back as the last tier · 2.33 / 3.3 rename pencil on
hover (always on touch); Enter or click-away saves, Esc cancels · 2.48 select-all includes inactive matrices; "in all <n> matrices" only when all
are checked · 2.56 toast 20 s, pauses while pointed at, Undo · 2.60 setting a rule it already has asks nothing · 3.16 per-tab Edit/Save/Cancel
with discard prompt on tab switch · 4.7-4.8 auto-fill follows the last range entered; grey values are not changes · 4.13 Alt+Down opens a From
cost cell's unit picker · 4.19-4.21 ranges entered by their end, next starts a cent later; Add Range / delete count as one change · 4.22 bar counts
only edited cells · 5.3 cost 0, empty or not a number → every column "—" · 5.4 simulator uses unsaved grid values · 6.4 tier numbers with names
on hover · 6.9 / 7.5 search matches matrix and category names · 7.9-7.11 Edit greyed when the matrix prices other categories, with "Go to the
Fluids 30 matrix" · 8.3 Uncategorized can't be renamed, moved or deleted · 9.5 tab tooltips instead of a message · 9.11 Select All skips
customers already on the tier, footer counts them · 9.31 / 9.37 tier fields shown only with 2 or more tiers · 9.39 phone below 768 px · 10.5
only a typed price carries an icon · 10.11 no cost → $0.00, logged under the tier · 12.4 Priced by column after Sell Price · 14.6 no amber note
on the same tier · 15.1 one warning only, space kept so nothing shifts · 20.8 Location always blue · 20.13 sort cycle: biggest first, reverse,
then first-load order; arrows on hover and on the sorted column · 20.15 hidden column remembered · 20.18 PDF up to 2,000 rows, CSV up to 50,000 ·
20.20 the CSV starts with title, date range and every filter; the dialog is a prototype stand-in · info icons on prices show only on row hover
(tp-app.css, Fabian Nov 2) · tooltips copy the Work In Progress report's style (owner, Nov 6).

## 8b · Outstanding — what needs the QA lead
1. The 11 "Today" screenshot images cannot be fetched (asset store is writer-only). Fastest fix: a browser "Save page" of the canvas or writer
   access to the artifact. Meanwhile their captions and alt text are recorded; they show today's production, not the new design.
2. Rule 119: not read line by line — the canvas editor's own guides (7 reference .md files) and page shell (`index.html`), and the ≈10 MB viewer
   runtime (hashes recorded). Recommendation: accept as not design content (as on Bill To); say if you want them read.
3. Pictures were checked by DOM extraction; only a few were viewed by eye. The design-case author views each picture when attaching it.

## 9 · Pictures per page (file names for case attachments, folder `images/`)

**0 · Overview** (1)  
`page-00-board-01-0-0-overview.png`

**1 · Story 1: Release day** (4)  
`page-01-board-01-1-1-release-day-settings-pricing-opens-on-tiers.png`, `page-01-board-02-1-2-release-day-matrices-tab.png`, `page-01-board-03-1-3-click-a-matrix.png`, `page-01-board-04-1-4-result-opening-a-matrix-shows-todays-rules-as-the-defaul.png`

**2 · Story 2: Tiers** (60)  
`page-02-board-01-2-1-today-the-pricing-page.png`, `page-02-board-02-2-2-tiers-list.png`, `page-02-board-03-2-3-hover-the-info-icon.png`, `page-02-board-04-2-4-click-the-three-dot-menu-beside-new-tier.png`, `page-02-board-05-2-5-click-audit-log.png`, `page-02-board-06-2-6-result-audit-log-tiers-every-tiers-changes-newest-first.png`, `page-02-board-07-2-7-click-a-tiers-three-dot-menu-never-used.png`, `page-02-board-08-2-8-hover-the-greyed-delete.png`, `page-02-board-09-2-9-the-last-rows-menu-opens-upward.png`, `page-02-board-10-2-10-click-new-tier.png`, `page-02-board-11-2-11-result-the-new-tiers-page-opens-no-dialog-with-the-curs.png`, `page-02-board-12-2-12-click-create-tier-with-no-name.png`, `page-02-board-13-2-13-type-a-name-another-tier-uses.png`, `page-02-board-14-2-14-type-an-archived-tiers-name.png`, `page-02-board-15-2-15-type-a-name-the-reports-use.png`, `page-02-board-16-2-16-type-fleet-plus-and-click-create-tier.png`, `page-02-board-17-2-17-result-the-tier-is-created-and-its-page-stays-open.png`, `page-02-board-18-2-18-archive-a-tier-that-has-customers.png`, `page-02-board-19-2-19-click-remove-customers-in-the-blocked-dialog.png`, `page-02-board-20-2-20-result-manage-customers-opens-on-the-remove-tab-so-the-.png`, `page-02-board-21-2-21-archive-a-tier-with-no-customers.png`, `page-02-board-22-2-22-result-the-dialog-lists-one-per-line-every-tier-that-fo.png`, `page-02-board-23-2-23-click-archive.png`, `page-02-board-24-2-24-result-tier-5-moves-to-the-archived-rows-the-tiers-afte.png`, `page-02-board-25-2-25-an-archived-tiers-menu.png`, `page-02-board-26-2-26-click-reactivate.png`, `page-02-board-27-2-27-result-no-confirmation.png`, `page-02-board-28-2-28-delete-a-tier-that-priced-nothing.png`, `page-02-board-29-2-29-click-delete.png`, `page-02-board-30-2-30-result-the-tier-and-its-column-in-every-matrix-are-gone.png`, `page-02-board-31-2-31-click-a-tier-tier-2.png`, `page-02-board-32-2-32-result-the-tiers-page-opens-on-pricing-every-matrix-and.png`, `page-02-board-33-2-33-point-at-the-name.png`, `page-02-board-34-2-34-click-the-pencil.png`, `page-02-board-35-2-35-result-the-name-is-edited-in-place.png`, `page-02-board-36-2-36-type-a-taken-name-and-press-enter.png`, `page-02-board-37-2-37-type-fleet-and-press-enter.png`, `page-02-board-38-2-38-click-the-pages-three-dot-menu.png`, `page-02-board-39-2-39-click-audit-log.png`, `page-02-board-40-2-40-result-audit-log-tier-2-event-user-details-old-new-date.png`, `page-02-board-41-2-41-defaults-page.png`, `page-02-board-42-2-42-result-default-is-priced-by-each-matrixs-default-column.png`, `page-02-board-43-2-43-an-archived-tiers-page.png`, `page-02-board-44-2-44-result-archived-shows-as-plain-text.png`, `page-02-board-45-2-45-click-a-matrix-on-the-tiers-page.png`, `page-02-board-46-2-46-result-the-matrix-opens-in-edit-with-tier-2s-column-in-.png`, `page-02-board-47-2-47-check-a-matrix.png`, `page-02-board-48-2-48-click-select-all.png`, `page-02-board-49-2-49-uncheck-two.png`, `page-02-board-50-2-50-type-35.png`, `page-02-board-51-2-51-click-set-rule-with-no-value.png`, `page-02-board-52-2-52-pick-margin-type-120-click-set-rule.png`, `page-02-board-53-2-53-click-set-rule-every-matrix-checked.png`, `page-02-board-54-2-54-click-set-rule-some-checked.png`, `page-02-board-55-2-55-click-set-rule-in-the-dialog.png`, `page-02-board-56-2-56-result-the-checks-clear.png`, `page-02-board-57-2-57-click-undo.png`, `page-02-board-58-2-58-result-exactly-what-the-tier-had-comes-back.png`, `page-02-board-59-2-59-set-a-rule-it-already-has.png`, `page-02-board-60-2-60-result-nothing-is-asked-a-toast-says-so.png`

**3 · Story 3: Matrices and rules** (29)  
`page-03-board-01-3-1-click-a-matrix-stop-40.png`, `page-03-board-02-3-2-result-the-matrix-page-categories-work-order-part-sale-t.png`, `page-03-board-03-3-3-point-at-the-name.png`, `page-03-board-04-3-4-click-the-pencil.png`, `page-03-board-05-3-5-result-enter-or-clicking-away-saves-at-once-esc-cancels.png`, `page-03-board-06-3-6-click-the-pages-three-dot-menu.png`, `page-03-board-07-3-7-click-audit-log.png`, `page-03-board-08-3-8-result-newest-first-each-save-then-every-rule-it-changed.png`, `page-03-board-09-3-9-an-inactive-matrix.png`, `page-03-board-10-3-10-result-no-badge-on-the-page-the-reason-shows-as-plain-t.png`, `page-03-board-11-3-11-save-a-matrix-that-prices-one-category.png`, `page-03-board-12-3-12-result-saved-without-asking-a-toast-confirms.png`, `page-03-board-13-3-13-save-a-matrix-that-prices-several-categories.png`, `page-03-board-14-3-14-save-the-general-matrix.png`, `page-03-board-15-3-15-type-120-in-a-off-column-and-click-save.png`, `page-03-board-16-3-16-change-a-value-then-click-the-part-sale-matrix-tab.png`, `page-03-board-17-3-17-click-the-part-sale-matrix-tab-off.png`, `page-03-board-18-3-18-turn-on-separate-part-sale-pricing.png`, `page-03-board-19-3-19-a-matrix-with-its-own-part-sale-prices.png`, `page-03-board-20-3-20-turn-it-off.png`, `page-03-board-21-3-21-click-new-matrix.png`, `page-03-board-22-3-22-result-name-categories-and-the-grid-ready-to-fill-cance.png`, `page-03-board-23-3-23-open-categories.png`, `page-03-board-24-3-24-click-create-matrix-with-no-name.png`, `page-03-board-25-3-25-type-a-taken-name-and-click-create-matrix.png`, `page-03-board-26-3-26-duplicate-a-matrix.png`, `page-03-board-27-3-27-result-a-copy-of-its-rules-ready-to-name.png`, `page-03-board-28-3-28-delete-a-matrix.png`, `page-03-board-29-3-29-result-delete-stop-40-names-the-matrix.png`

**4 · Story 4: The tier grid: every tier of a matrix, edited in place** (27)  
`page-04-board-01-4-1-hover-the-cost-range-info-icon.png`, `page-04-board-02-4-2-hover-a-uses-previous-tier-cell.png`, `page-04-board-03-4-3-a-column-that-mixes-rule-types.png`, `page-04-board-04-4-4-result-tread-plus-default-45-up-to-300-then-15-margin.png`, `page-04-board-05-4-5-click-edit.png`, `page-04-board-06-4-6-result-every-cell-is-editable.png`, `page-04-board-07-4-7-type-in-a-range.png`, `page-04-board-08-4-8-change-range-2-to-markup-and-type-45.png`, `page-04-board-09-4-9-a-columns-rule-picker.png`, `page-04-board-10-4-10-defaults-rule-picker.png`, `page-04-board-11-4-11-pick-off-for-tier-5.png`, `page-04-board-12-4-12-pick-previous-tier-for-tier-2.png`, `page-04-board-13-4-13-a-from-cost-cells-symbol.png`, `page-04-board-14-4-14-ranges-with-different-types.png`, `page-04-board-15-4-15-result-the-column-header-reads-mixed-rules-cells-spell-.png`, `page-04-board-16-4-16-same-as-previous-tier-in-edit.png`, `page-04-board-17-4-17-result-the-cells-show-the-previous-tiers-values-muted-a.png`, `page-04-board-18-4-18-type-a-bad-value-and-click-save.png`, `page-04-board-19-4-19-change-a-range-end.png`, `page-04-board-20-4-20-click-add-range.png`, `page-04-board-21-4-21-click-a-ranges-delete.png`, `page-04-board-22-4-22-after-a-few-edits.png`, `page-04-board-23-4-23-click-cancel-with-changes.png`, `page-04-board-24-4-24-change-defaults-rules.png`, `page-04-board-25-4-25-edit-from-an-archived-tier.png`, `page-04-board-26-4-26-result-the-archived-view-default-plus-archived-tiers-wi.png`, `page-04-board-27-4-27-hover-defaults-column-in-the-archived-view.png`

**5 · Story 5: Price Part Simulator** (4)  
`page-05-board-01-5-1-type-a-part-cost-in-the-price-part-simulator.png`, `page-05-board-02-5-2-a-cost-a-tier-sells-below.png`, `page-05-board-03-5-3-type-0-as-the-part-cost.png`, `page-05-board-04-5-4-type-a-cost-while-editing-the-grid.png`

**6 · Story 6: Every matrix in one list** (14)  
`page-06-board-01-6-1-today-the-matrices-list.png`, `page-06-board-02-6-2-click-the-matrices-tab.png`, `page-06-board-03-6-3-hover-the-tiers-info-icon.png`, `page-06-board-04-6-4-hover-the-tier-numbers-in-the-tiers-column.png`, `page-06-board-05-6-5-click-the-status-filter.png`, `page-06-board-06-6-6-pick-inactive.png`, `page-06-board-07-6-7-result-the-chip-turns-blue-with-the-selection.png`, `page-06-board-08-6-8-hover-an-inactive-status.png`, `page-06-board-09-6-9-search-tread.png`, `page-06-board-10-6-10-a-search-with-no-match.png`, `page-06-board-11-6-11-click-a-matrixs-three-dot-menu.png`, `page-06-board-12-6-12-the-general-matrixs-menu.png`, `page-06-board-13-6-13-audit-log-beside-new-matrix.png`, `page-06-board-14-6-14-result-audit-log-matrices-every-matrixs-changes-deleted.png`

**7 · Story 7: Categories: every category's pricing at a glance** (15)  
`page-07-board-01-7-1-today-the-categories-list.png`, `page-07-board-02-7-2-today-edit-category.png`, `page-07-board-03-7-3-settings-categories.png`, `page-07-board-04-7-4-hover-a-uses-previous-tier-cell.png`, `page-07-board-05-7-5-search-tire.png`, `page-07-board-06-7-6-a-search-with-no-match.png`, `page-07-board-07-7-7-click-a-category-brakes.png`, `page-07-board-08-7-8-result-the-category-page-name-tax-exempt-quickbooks-mapp.png`, `page-07-board-09-7-9-a-category-whose-matrix-prices-others.png`, `page-07-board-10-7-10-hover-the-grayed-edit.png`, `page-07-board-11-7-11-click-go-to-the-fluids-30-matrix.png`, `page-07-board-12-7-12-click-new-matrix-on-a-categorys-page.png`, `page-07-board-13-7-13-result-the-new-matrix-opens-with-this-category-already-.png`, `page-07-board-14-7-14-audit-log-beside-new-category.png`, `page-07-board-15-7-15-result-audit-log-categories.png`

**8 · Story 8: Categories over time** (12)  
`page-08-board-01-8-1-pick-another-matrix-for-the-category.png`, `page-08-board-02-8-2-uncategorized.png`, `page-08-board-03-8-3-result-a-system-category-it-cant-be-renamed-moved-or-del.png`, `page-08-board-04-8-4-rename-brakes-to-a-taken-name.png`, `page-08-board-05-8-5-click-new-category.png`, `page-08-board-06-8-6-result-name-cursor-in-it-matrix-cancel-create-category.png`, `page-08-board-07-8-7-click-create-category-with-no-name.png`, `page-08-board-08-8-8-type-wheel-seals-and-click-create-category.png`, `page-08-board-09-8-9-result-created-on-the-general-matrix-the-toast-says-so.png`, `page-08-board-10-8-10-click-delete-in-the-three-dot-menu.png`, `page-08-board-11-8-11-click-delete-in-the-delete-dialog.png`, `page-08-board-12-8-12-result-the-category-is-gone-its-parts-and-past-lines-ar.png`

**9 · Story 9: Putting customers on tiers** (41)  
`page-09-board-01-9-1-click-the-tiers-customers-tab.png`, `page-09-board-02-9-2-search-a-tiers-customers-tab-with-no-match.png`, `page-09-board-03-9-3-open-the-customers-tabs-channel-filter.png`, `page-09-board-04-9-4-click-manage-customers.png`, `page-09-board-05-9-5-hover-the-add-customers-tab.png`, `page-09-board-06-9-6-check-two-customers.png`, `page-09-board-07-9-7-uncheck-part-sales-on-one-row.png`, `page-09-board-08-9-8-uncheck-both-work-orders-and-part-sales-on-a-row.png`, `page-09-board-09-9-9-click-select-all.png`, `page-09-board-10-9-10-uncheck-part-sales-in-the-bar-then-select-all.png`, `page-09-board-11-9-11-result-customers-already-on-tier-2-for-the-picked-chann.png`, `page-09-board-12-9-12-search-customers.png`, `page-09-board-13-9-13-a-search-with-no-match.png`, `page-09-board-14-9-14-click-add-to-tier-2.png`, `page-09-board-15-9-15-result-new-work-orders-and-part-sales-use-tier-2.png`, `page-09-board-16-9-16-click-the-remove-customers-tab.png`, `page-09-board-17-9-17-check-one-and-click-remove.png`, `page-09-board-18-9-18-result-remove-1-customer-they-go-back-to-default-for-th.png`, `page-09-board-19-9-19-click-remove.png`, `page-09-board-20-9-20-result-they-are-back-on-default.png`, `page-09-board-21-9-21-an-archived-tiers-customers-tab.png`, `page-09-board-22-9-22-click-reactivate-tier.png`, `page-09-board-23-9-23-result-no-confirmation.png`, `page-09-board-24-9-24-remove-tab-of-a-tier-with-no-customers.png`, `page-09-board-25-9-25-today-the-customers-list.png`, `page-09-board-26-9-26-today-a-customers-page.png`, `page-09-board-27-9-27-today-edit-customer.png`, `page-09-board-28-9-28-customers.png`, `page-09-board-29-9-29-open-a-customer.png`, `page-09-board-30-9-30-result-the-customer-cards-pricing-group-labor-rate-shop.png`, `page-09-board-31-9-31-click-edit.png`, `page-09-board-32-9-32-click-work-order-tier-and-type-3.png`, `page-09-board-33-9-33-pick-3-tier-3.png`, `page-09-board-34-9-34-click-save.png`, `page-09-board-35-9-35-result-the-card-shows-the-new-tier.png`, `page-09-board-36-9-36-edit-the-counter-sale-customer.png`, `page-09-board-37-9-37-edit-customer-with-only-default.png`, `page-09-board-38-9-38-today-edit-customer-on-a-phone.png`, `page-09-board-39-9-39-on-a-phone-edit-customer.png`, `page-09-board-40-9-40-on-a-phone-tap-work-order-tier.png`, `page-09-board-41-9-41-on-a-phone-pick-3-tier-3.png`

**10 · Story 10: How a part is priced** (12)  
`page-10-board-01-10-1-today-a-work-order.png`, `page-10-board-02-10-2-today-add-part-quick-add-row.png`, `page-10-board-03-10-3-today-cost-fills-the-sell-price.png`, `page-10-board-04-10-4-open-a-work-order-s1-2671.png`, `page-10-board-05-10-5-result-parts-are-priced-by-the-work-orders-tier.png`, `page-10-board-06-10-6-quick-add-a-part-with-a-cost.png`, `page-10-board-07-10-7-save-it.png`, `page-10-board-08-10-8-result-priced-by-the-work-orders-tier.png`, `page-10-board-09-10-9-quick-add-with-a-sell-price-of-5.png`, `page-10-board-10-10-10-a-part-with-no-cost.png`, `page-10-board-11-10-11-result-no-rule-prices-it-0-00-logged-under-the-work-or.png`, `page-10-board-12-10-12-click-the-fixed-rules-tab.png`

**11 · Story 11: When a part is priced again** (7)  
`page-11-board-01-11-1-click-a-part.png`, `page-11-board-02-11-2-type-a-sell-price.png`, `page-11-board-03-11-3-split-work-order-works-as-today.png`, `page-11-board-04-11-4-after-the-split.png`, `page-11-board-05-11-5-result-the-new-work-order-priced-by-the-customers-curre.png`, `page-11-board-06-11-6-receive-a-part.png`, `page-11-board-07-11-7-receive-a-tier-priced-part-at-a-new-cost-then-hover-its.png`

**12 · Story 12: Seeing what priced a part** (9)  
`page-12-board-01-12-1-hover-a-price.png`, `page-12-board-02-12-2-hover-a-part-priced-through-same-as-previous-tier.png`, `page-12-board-03-12-3-hover-a-typed-price.png`, `page-12-board-04-12-4-click-the-parts-tab.png`, `page-12-board-05-12-5-a-line-priced-before-tiers.png`, `page-12-board-06-12-6-the-customer-has-moved-tier-since.png`, `page-12-board-07-12-7-a-canned-line-part-on-a-default-work-order.png`, `page-12-board-08-12-8-a-part-on-a-fixed-line-total.png`, `page-12-board-09-12-9-hover-a-line-priced-for-the-previous-customer.png`

**13 · Story 13: Part Sales** (4)  
`page-13-board-01-13-1-today-a-part-sale.png`, `page-13-board-02-13-2-open-a-part-sale-p1-1131.png`, `page-13-board-03-13-3-result-priced-by-the-part-sales-tier-from-the-part-sale.png`, `page-13-board-04-13-4-hover-a-price.png`

**14 · Story 14: Changing the customer on a work order** (8)  
`page-14-board-01-14-1-today-change-customer.png`, `page-14-board-02-14-2-click-the-work-orders-three-dot-menu.png`, `page-14-board-03-14-3-change-customer.png`, `page-14-board-04-14-4-pick-a-customer-on-another-tier.png`, `page-14-board-05-14-5-change-customer-on-a-part-sale.png`, `page-14-board-06-14-6-pick-a-customer-on-the-same-tier.png`, `page-14-board-07-14-7-click-update-customer.png`, `page-14-board-08-14-8-result-a-notice-counts-the-lines-priced-for-the-previou.png`

**15 · Story 15: The below-cost warning in the matrix** (2)  
`page-15-board-01-15-1-hover-the-below-cost-warning.png`, `page-15-board-02-15-2-type-95-in-tier-5-while-editing.png`

**20 · Sales by Tier and Sales by Category** (23)  
`page-20-board-01-20-1-today-sales-by-customer-unchanged.png`, `page-20-board-02-20-2-reports-sales-by-tier.png`, `page-20-board-03-20-3-open-a-tiers-row.png`, `page-20-board-04-20-4-open-a-customers-row.png`, `page-20-board-05-20-5-open-priced-by.png`, `page-20-board-06-20-6-open-the-customer-filter.png`, `page-20-board-07-20-7-open-the-category-filter.png`, `page-20-board-08-20-8-open-the-location-filter.png`, `page-20-board-09-20-9-sales-type-work-orders-only.png`, `page-20-board-10-20-10-pick-a-custom-range-over-one-year.png`, `page-20-board-11-20-11-pick-a-range-with-no-sales.png`, `page-20-board-12-20-12-sort-by-parts-margin.png`, `page-20-board-13-20-13-result-first-click-on-a-number-column-puts-the-biggest.png`, `page-20-board-14-20-14-click-the-columns-icon.png`, `page-20-board-15-20-15-hide-parts-margin.png`, `page-20-board-16-20-16-sales-by-category.png`, `page-20-board-17-20-17-open-a-categorys-row.png`, `page-20-board-18-20-18-click-download.png`, `page-20-board-19-20-19-click-download-summary-csv.png`, `page-20-board-20-20-20-result-prototype-stand-in-see-the-info-icon-the-real-m.png`, `page-20-board-21-20-21-download-with-no-rows.png`, `page-20-board-22-20-22-result-empty-export.png`, `page-20-board-23-20-23-filters-that-match-nothing.png`

Extra pictures: `orphan-not-on-canvas-CU04b-8-4b-pick-3-tier-3.png`, `page-09-board-28-9-28-customers-full-height.png`, `page-09-board-29-9-29-open-a-customer-full-height.png`, `page-09-board-30-9-30-result-the-customer-cards-pricing-group-labor-rate-shop-full-height.png`, `page-09-board-31-9-31-click-edit-full-height.png`, `page-09-board-32-9-32-click-work-order-tier-and-type-3-full-height.png`, `page-09-board-33-9-33-pick-3-tier-3-full-height.png`, `page-09-board-34-9-34-click-save-full-height.png`, `page-09-board-35-9-35-result-the-card-shows-the-new-tier-full-height.png`, `page-09-board-37-9-37-edit-customer-with-only-default-full-height.png`, `page-10-board-06-10-6-quick-add-a-part-with-a-cost-full-height.png`, `page-10-board-07-10-7-save-it-full-height.png`, `page-10-board-09-10-9-quick-add-with-a-sell-price-of-5-full-height.png`, `page-12-board-09-12-9-hover-a-line-priced-for-the-previous-customer-full-height.png`, `page-14-board-08-14-8-result-a-notice-counts-the-lines-priced-for-the-previou-full-height.png`


## 10 · Files of this drive
`files-v1794631438-539a/` (package) · `images/` (272 board pictures + 14 full-height + 1 off-canvas) · `BOARD-COVERAGE.md` · `inventory/` (text-inventory.json, visual-inventory.json, overlays.json, panels.json, movement.json, flows.json, stress-probe.json, icons.json, library-sentences.json, coverage.json, tool-text-inventory.*) · `render/` (render logs per shard, hover crops, 1536 and stress pictures, canvas notes, readable overlay and panel lists, server log, viewer hashes) · `tools/` (serve.js, render.js, panels.js, stress.js, analyze.py, make_proof.py; rerun: `node tools/serve.js 8771 &`, `node tools/render.js --shard i/4` ×4, `node tools/panels.js`, `node tools/stress.js`, `python3 tools/analyze.py`, `python3 tools/make_proof.py`).
