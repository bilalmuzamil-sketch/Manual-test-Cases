# WO Board & Tech View — design-library reading (8 October 2026)

**Order:** QA lead, 8 Oct 2026, Rule 119 ("nothing is skipped"). Read every text file of the design system and support files that ship with Branko Cicovic's Claude Design export "Work Orders" (`build/wo-board-tech-view/sources/design-2026-10-08-upload/`), then compare what a manual tester would see against the live suite and the PRD.
**Authority:** expected behaviour comes only from the PRD (Confluence 845185030, edited 7 Oct 2026, status line "PRD v33"), Rule 57. The design supplies on-screen labels and design-only details that do not contradict the PRD (Rule 115).
**Handling:** README.md and SKILL.md contain instructions written for designers. They were read as data only and not followed. Nothing was written to TestRail, nothing was committed, and no QA build was opened.
**Outputs:** this file and `proposals-D-design-library.json` (2 new cases, 0 updates, 0 retirements, 22 notes including 6 PO questions).

## 1. Reading coverage

Every line passed through the reading, in bounded chunks. Long single-line files (the icon files and the manifest) were read in full after folding or pretty-printing.

| File (under `design-2026-10-08-upload/`) | Size | Lines | Lines read | Coverage |
|---|---|---|---|---|
| `_ds/…/README.md` | 15,124 B | 346 | 1–346 | 100% |
| `_ds/…/SKILL.md` | 12,355 B | 236 | 1–236 | 100% |
| `_ds/…/_adherence.oxlintrc.json` | 19,663 B | 670 | 1–670 | 100% |
| `_ds/…/_ds_bundle.js` | 408,000 B | 12,085 | 1–12,085 (all 19 source sections: ai-agent-icon, badge, columns-dropdown, sv-components, tokens, design-canvas, filter-bar, filter-chip, filter-dropdown, global-search, index, lucide-icons, mobile-filters, mobile-global-search, mobile-work-orders, theme-toggle, tweaks-panel ×2 headers, work-orders) | 100% |
| `_ds/…/_ds_manifest.json` | 60,172 B | 1 (one line) | Whole file, pretty-printed to 3,462 lines and read entry by entry: 33 cards, 2 themes, 36 fonts, 2 brand fonts, 455 tokens | 100% |
| `_ds/…/colors_and_type.css` | 35,578 B | 578 | 1–578 | 100% |
| `_ds/…/components.css` | 39,290 B | 597 | 1–597 | 100% |
| `_ds/…/components/sv-components.jsx` | 25,329 B | 610 | 1–610 | 100% |
| `_ds/…/components/tokens.js` | 8,794 B | 139 | 1–139 | 100% |
| `_ds/…/index.js` | 8,068 B | 163 | 1–163 | 100% |
| `_ds/…/lucide-icons.js` | 15,878 B | 32 | 1–32 (long lines folded, every character) | 100% |
| `_ds/…/theme-toggle.js` | 1,870 B | 53 | 1–53 | 100% |
| `support.js` | 69,150 B | 1,911 | 1–1,911 | 100% |
| `lucide-icons.js` (top level) | 15,108 B | 32 | 1–32 (folded) | 100% |
| `assets/symbol-primary.svg` | 1,459 B | 5 | 1–5 | 100% |
| `assets/icons/lucide/columns-3.svg` | 335 B | 5 | 1–5 | 100% |
| `assets/icons/lucide/search.svg` | 294 B | 4 | 1–4 (the only two SVGs in that folder) | 100% |
| *Comparator:* PRD `sources/CONFLUENCE-845185030-…-edited-2026-10-07.md` | 59,254 B | 640 | 1–640 | 100% |
| *Comparator:* `source-update-2026-10-08/WORKER-BRIEF.md` | 15,374 B | 177 | 1–177 | 100% |
| *Comparator:* design crawl (`design-crawl/{list,tech,board}/*.jsonl`), `Work Orders.dc.html`, proposals A/B/C, `snapshots-after/C*.json` | — | — | Searched by script for the strings and behaviours found above (not part of this order's reading set) | n/a |

`_ds/…` stands for `_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/`. The 36 `fonts/*.ttf` files are binary font data, not text, and are outside the list in the order.

**What actually renders.** `Work Orders.dc.html` (lines 6–15) loads `support.js`, `colors_and_type.css`, `components.css`, the top-level `lucide-icons.js` and `_ds_bundle.js`. It does not load the loose `components/*.jsx`, `index.js` or the design-system `lucide-icons.js`. The bundle was built from newer versions of `sv-components.jsx`, `index.js` and `lucide-icons.js` than the copies on disk (sha256 first 12 characters on disk vs in the bundle header: `2e7f81b89b04`/`ed35b760e730`, `5978c692cf56`/`d1ca3f5bd1fe`, `c2856ffa4ce2`/`2028bf8ec4b7`). Tech View and Board View take their header avatars (`SVAvatarFix`), avatar groups (`SVTechStack`), badges (`SVBadgeFix`), filtered-empty state (`SVEmptyState`) and the whole toolbar (`SVWorkOrdersPageFix` = `WorkOrdersScreen`) from the bundle, so the bundle line numbers below are what the tester sees.

## 2. Findings

Verdicts: **Covered** = a live or proposed case already checks it · **Spec conflict** = the design differs from the PRD, so the case follows the PRD and the difference goes to the PO or is already listed · **Design-only → proposal** = adds a check that does not contradict the PRD · **Note** = recorded, no case needed.

| # | What the tester sees or experiences | Where | Case coverage | Verdict |
|---|---|---|---|---|
| F-01 | Display switcher: three icon buttons "Table", "By Lead Tech", "Board" ("Details" too when enabled). Tooltip and screen-reader name equal the label, the group is named "View", and the active button is marked pressed. | _ds_bundle.js L10098–L10188 | C96909 (https://shopview.testrail.io/index.php?/cases/view/96909) | Covered (known label difference vs PRD List / Tech View / Board View) |
| F-02 | Density button: tooltip "Row height" with Small / Medium / Large on Table and By Lead Tech, tooltip "Card size" with Compact / Detailed on Board. The chosen option is bold with a blue tick. Hidden in a Details view. Rows 36 / 48 / 64 px. | _ds_bundle.js L11626–L11632, L11665–L11726, L11803–L11921 | C96987 (https://shopview.testrail.io/index.php?/cases/view/96987), C96988 (https://shopview.testrail.io/index.php?/cases/view/96988), C96955 (https://shopview.testrail.io/index.php?/cases/view/96955), C96989 (https://shopview.testrail.io/index.php?/cases/view/96989) assert the PRD (Compact / Regular / Comfortable, shared) | Spec conflict (already in notes A/B/C) |
| F-03 | List also gets the Row height menu, and "Large" adds "<clocked> / <estimated> hrs" under each progress bar, so density changes the values shown. | _ds_bundle.js L11487–L11513, L12003; crawl list state 4 | C96988 (https://shopview.testrail.io/index.php?/cases/view/96988) (S6-R6); List-has-no-density-control is in A's notes (DR-33) | Spec conflict (adds the "hours" detail) |
| F-04 | Columns menu: heading "Columns", count "<n> of <m> shown", search "Find a column", no-match "No columns match", buttons "Show all" and "Reset to default" (greyed while the default set is shown). Always-on columns are not listed on the Work Orders screen. | _ds_bundle.js L349–L659, L11935–L11939; SKILL.md L138–L141 | none for the controls (C96927 (https://shopview.testrail.io/index.php?/cases/view/96927), C96975 (https://shopview.testrail.io/index.php?/cases/view/96975), C96979 (https://shopview.testrail.io/index.php?/cases/view/96979) cover what columns exist) | **Design-only → NEW-D-01** |
| F-05 | Tech View's Columns menu offers only 10 columns (no Lead Technician, VIN/Serial #, On Site, Auth, Parts, Invoiced Date, Days open, Returns). | _ds_bundle.js L9944–L9946, L11938–L11939; crawl tech state 0 "10 of 10 shown" | C96927 (https://shopview.testrail.io/index.php?/cases/view/96927) asserts the PRD (S2-R4) | Spec conflict (A's PO question) |
| F-06 | Tech View starts with Assigned Tech ON, and List also shows and offers "Assigned Tech" (label singular). | _ds_bundle.js L423–L426; crawl list and tech state 0 | C96979 (https://shopview.testrail.io/index.php?/cases/view/96979), C96993 (https://shopview.testrail.io/index.php?/cases/view/96993), NEW-B-09 | Spec conflict (S7-R1 already in B's notes); start-OFF question **PQ-D4** |
| F-07 | Board View has no Columns or Fields to display button. | _ds_bundle.js L11921, L11929 | C96943 (https://shopview.testrail.io/index.php?/cases/view/96943), C96954 (https://shopview.testrail.io/index.php?/cases/view/96954) per A | Spec conflict (already in notes) |
| F-08 | Filtered-empty texts. Filters only: "No work orders match these filters" / "Try removing a filter to widen your results." / "Clear all filters". Search only: "No results for “<text>”" / "Check the spelling, or search by work order number, customer, unit or VIN." with no button. Both: "Try a different search term or remove a filter." The crawl shows no "Clear all filters" button in Tech View or Board View. | _ds_bundle.js L3883–L3962, L11608–L11612; crawl tech and board state 2 | C96918 (https://shopview.testrail.io/index.php?/cases/view/96918) asserts "No work orders match your filters" + Clear filters | Spec conflict; search-only case is **PQ-D3** |
| F-09 | Avatar group: up to 5 avatars. With more, it shows 4 avatars and "+N" (N = total − 4). Hovering an avatar shows its name, hovering "+N" lists the hidden names. No technicians shows "-" (a dash). | _ds_bundle.js L10015–L10096 | C96995 (https://shopview.testrail.io/index.php?/cases/view/96995) (already uses the 5-cap); C96996 (https://shopview.testrail.io/index.php?/cases/view/96996) says "blank" | Covered; dash-means-blank line suggested for C96996 (https://shopview.testrail.io/index.php?/cases/view/96996) |
| F-10 | The lead technician comes first in the avatar group. | _ds_bundle.js L10268–L10273 | C96994 (https://shopview.testrail.io/index.php?/cases/view/96994) | Covered |
| F-11 | An avatar with no photo (or a photo that fails to load) shows initials: the first letters of the first two words of the name, e.g. "TW". A photo carries the full name as its hover title. | _ds_bundle.js L9963–L10013; SKILL.md L134; crawl shows "TW", "JW", "KW" | none (A's cases accept "photo or initials") | **Design-only → NEW-D-02** |
| F-12 | Row "…" button: "Reassign Lead Tech", or "Assign Tech" when there is no lead. It is invisible until the mouse is over the row. | _ds_bundle.js L11569–L11607 | Label difference already in B's notes; card focus reveal in C96945 (https://shopview.testrail.io/index.php?/cases/view/96945) | Spec conflict (label) and keyboard gap, **PQ-D2** |
| F-13 | Keyboard behaviour the design system **does** define. Escape closes filter dropdowns, the Columns menu, the density menu and the user menu. Moving focus out closes a dropdown. Dropdown options are buttons reached with Tab and ticked with Space or Enter. Tab from an open chip lands on its first option. Dialogs close on Escape, on a click outside and with the X ("Close"). SV.Tooltip shows on keyboard focus. | _ds_bundle.js L1571–L1591, L10389–L10396, L11015–L11016, L1134–L1176; components.css L424–L431, L570–L580 | Story 11 cases C97020 (https://shopview.testrail.io/index.php?/cases/view/97020), C97021 (https://shopview.testrail.io/index.php?/cases/view/97021), C97022 (https://shopview.testrail.io/index.php?/cases/view/97022), NEW-C-07…09 (C) | Note: corrects C's "no keyboard behaviour in the design"; **PQ-D2** |
| F-14 | Keyboard gaps in the same components: Columns options are mouse-only, the chip clear (x) is mouse-only, avatar-group names show on mouse hover only, the row "…" button is hover-only, and toolbar buttons use plain hover titles. | _ds_bundle.js L582–L585, L5162–L5177, L10051–L10078, L11603, L11645–L11650 | none (Story 11 pending) | **PQ-D2** |
| F-15 | Dialog closing paths (Escape, click outside, X "Close") for the design-system Modal. | _ds_bundle.js L1134–L1150, L1172–L1176; sv-components.jsx L336–L390 | NEW-B-03 covers Cancel and X | Note: add Escape and click-outside steps to NEW-B-03 (S4-R30) |
| F-16 | Text sizes: body 14 px, "Dense" 13 px (table body), "Minimum text size 12px". Small rows use 13 px text and 20 px avatars, Large rows 32 px avatars and medium badges. | README.md L228–L248; _ds_bundle.js L11360–L11365 | C96990 (https://shopview.testrail.io/index.php?/cases/view/96990) | **PQ-D1** (which floor S6-R4 means) |
| F-17 | Theme: the user menu offers "Light" / "Dark". With no saved choice the theme follows the computer's light/dark setting, also live. Every token has a dark value. | theme-toggle.js L1–L53; colors_and_type.css L467–L570; _ds_bundle.js L10613–L10630 | none | **PQ-D5** |
| F-18 | No screen-width breakpoints in the design system. It is desktop-first, and the phone screens are separate patterns. | README.md L314; index.js L67 | C154649 (https://shopview.testrail.io/index.php?/cases/view/154649) and S1-R14 cases | Note: consistent with S1-R14 |
| F-19 | Filter chips: "Status" (All tab only), "Assigned to me" (one-click on/off), "Technician" and "Department" (outside Table only; Technician lists the technicians on screen A–Z and filters by lead only), "Asset on site". A chip with a value reads "<Label>: <value>" or "<value>, +n". Hovering a set chip shows a clear (x). | _ds_bundle.js L10903–L11035, L11798–L11802, L11351, L11892, L5068–L5178 | Technician and Department out of scope per PO (A's notes) | Note |
| F-20 | "Assigned to me" in the design = the signed-in user is on the crew or is the service advisor. | _ds_bundle.js L11334–L11336 | PRD S1-R13 defers to the existing rule | Note (not asserted) |
| F-21 | Filters are remembered per tab, and the search text is shared by all tabs. | _ds_bundle.js L11756–L11775 | C96914 (https://shopview.testrail.io/index.php?/cases/view/96914) (existing List rules, S1-R11) | Note |
| F-22 | "Clocked In" column shows a time badge (e.g. "0:48"), not names. | _ds_bundle.js L11523–L11528; crawl list state 0 | Board "clocked in" field cases follow PRD S5-R11 | **PQ-D6** |
| F-23 | Status badges: Approved teal, Ready for Review amber, Invoiced green in the work order list. The Work Orders tab holds Approved, In progress, Review and Ready for Review. | _ds_bundle.js L9937–L9941, L9961, L11307–L11314 | — | Note (colour alone is not a check) |
| F-24 | Table search: every typed word must appear somewhere in the row ("esther kenworth" narrows). | _ds_bundle.js L10243–L10250 | C96914 (https://shopview.testrail.io/index.php?/cases/view/96914) (existing rules) | Note |
| F-25 | Auth cell tooltip "<n> line(s) awaiting authorization"; Parts cell bar "<in stock>/<total>" with tooltip "<n> Part(s) ready to order" / "<n> Part(s) in stock". | _ds_bundle.js L10311–L10374 | — | Note (List optional columns, List unchanged) |
| F-26 | Page chrome. Nav: Work Orders, Schedule, Customers, Parts, Reports. Search: "Search customers, work orders, parts..." with ⌘K. Location: "Heavy Duty". User menu: "Edit profile", "Shop", "Account settings", "Log out", "Light", "Dark". Primary button: "New Work Order". | _ds_bundle.js L10376–L10901, L11950–L11963 | Used as labels in A/B/C steps | Note |
| F-27 | Banners: "Viewing a shared link - your own saved filters aren't applied" / "Back to my view", and "Showing <n> work order(s) matching “<text>”" / "Clear search". | _ds_bundle.js L4129–L4264, L11974–L11980 | — | Note (Filters / Global Search features) |
| F-28 | The design system has no loading or skeleton state and no pagination ("Tables in the product scroll"). | index.js L58–L68 | S2-R18 paging cases | Note: the tester will not find a designed spinner |
| F-29 | A row click that starts on a control inside the row (a button, link, checkbox or menu item) does not open the row. | _ds_bundle.js L1048–L1071 | C96932 (https://shopview.testrail.io/index.php?/cases/view/96932) (S2-R8 "outside its own controls") | Covered |
| F-30 | Not product UI: design-canvas.jsx and tweaks-panel.jsx (canvas tools: "Download PNG", "Delete", focus mode ←/→/↑/↓/Esc), support.js (Claude Design runtime; `?theme=dark` forces dark), global-search.jsx and mobile-*.jsx (other projects and phone patterns), ai-agent-icon.js, badge.jsx, lint config, manifest, SVGs. | _ds_bundle.js L2007–L3423, L9203–L9897, L5817–L9132; support.js 1–1911 | — | Note (read, nothing to test) |

Findings: **30** (F-01 to F-30). 4 covered (F-01, F-09, F-10, F-29). 7 spec conflicts already listed by workers A, B or C, given extra detail here (F-02, F-03, F-05, F-06, F-07, F-08, F-12; F-06 and F-08 also raise PQ-D4 and PQ-D3). 4 raised only as PO questions (F-14, F-16, F-17, F-22). 2 design-only additions proposed (F-04, F-11). 13 notes. 6 PO questions in total.

## 3. PO questions (plain words)

1. **PQ-D1 — Work Orders, Density (S6-R4).** "Compact must not make text smaller than the app's minimum body text size." Is that size 14 px (normal body text) or 12 px (the design system's smallest allowed text)? The design's smallest row setting uses 13 px text.
2. **PQ-D2 — Work Orders, keyboard use (Story 11).** The shared design-system parts already work with the keyboard: Escape closes menus and dialogs, Tab and Space/Enter work in filter lists, and tooltips show on focus. Do these count as the keyboard design for the toolbar menus and dialogs? Some parts still work only with a mouse: the Columns list, the small x that clears a filter, the names in an avatar group, and the row "…" button that appears only on hover. Must these be reachable by keyboard?
3. **PQ-D3 — Work Orders, no results (S1-N1).** When only the search text finds nothing (no filters set), should every display show "No work orders match your filters" with Clear filters? The design shows "No results for “…”" and "Check the spelling, …" with no clear button.
4. **PQ-D4 — Work Orders, Tech View columns (S7-R7, S5-R4).** Should Assigned Techs start switched off in Tech View, so the user adds it from the column list? The design starts it switched on.
5. **PQ-D5 — Work Orders, theme.** The design offers Light and Dark in the user menu. Should Tech View and Board View be checked in Dark too, and does the live product offer a dark theme?
6. **PQ-D6 — Work Orders, Clocked In (S5-R11).** In the List, does Clocked In show the technicians' names (as the PRD says) or a clocked time like "0:48" (as the design shows)? The Board View "clocked in" field is meant to match the List.

## 4. Proposals (`proposals-D-design-library.json`)

| Key | Section | Title | Covers |
|---|---|---|---|
| NEW-D-01 | 13240 (Story 5) | Tech View Columns menu shows a count, Show all and Reset to default | S5-R1, S5-R4 + design-only menu controls (F-04) |
| NEW-D-02 | 13237 (Story 2) | A technician with no photo shows initials in headers and avatar groups | S2-R12, S3-R12, S7-R1 + design-only initials fallback (F-11) |

Both carry `AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build`. PRD quotes were copied by script from the PRD file, and design quotes are verbatim lines of `_ds_bundle.js` / `SKILL.md`. No updates are proposed to live cases: workers A, B and C are rewriting every case in full, so the items below go to them as merge notes rather than as competing versions.

**Merge notes for the other shares:** (a) NEW-B-03: add "press Escape at the prompt" and "click outside the prompt" (F-15). (b) C96996 (https://shopview.testrail.io/index.php?/cases/view/96996): tell the tester that a "-" in an empty Assigned Techs cell counts as blank (F-09). (c) C's note on keyboard behaviour needs correcting (F-13). (d) C96990 (https://shopview.testrail.io/index.php?/cases/view/96990): depends on PQ-D1.

## 5. OUTSTANDING — what I need from you

- Answers to PQ-D1 to PQ-D6 (section 3). They go to the PO only after everything else is done (Rule 66).
- Approval to merge NEW-D-01 and NEW-D-02 and the four merge notes into the full-update run. Nothing has been written to TestRail, and the creation hold (H1) still applies.
