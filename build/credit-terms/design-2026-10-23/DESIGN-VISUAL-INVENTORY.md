# Design visual inventory — Credit terms (23 Oct 2026)

Rule 126 point 3 / skill 21 §4b. Design: "Default Credit Terms" canvas, https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf, version
1792722751-b285. Every screen and state the 9 boards draw, with what a tester can SEE. Measurements come from the rendered boards
(`tools/measure.js` → `render/measure.json`, summary `render/measure-summary.txt`); looks on screenshots come from viewing each picture at
full size. Colours are the design-system tokens the boards use (hex given so a reviewer can check; a tester compares by eye with the
picture at 100% zoom).

**Widths.** Every app screen on every board is drawn at **1440 px** wide (boards 7488 px or 4512 px hold 1440-px figures side by side).
No board draws 1536 px, a phone, or dark theme ("Light theme." in every board note). Reflow check (ours, not drawn by the design): each drawn
1440-px frame was widened to 1536 px and narrowed to 1280 px in the browser; **0 overlapping cells, 0 page-head overlaps, nothing wider than
the frame** on all 37 drawn frames (`render/measure.json` → `reflow`, pictures `render/reflow-*.png`). The 31-character name fits on one line
at 1440 px (r15-long-name.png); its wrapping at narrower widths is not drawn.

**Classes.** Each row below is COVERED-BY-PLAN (the look case that will check it in round 2, `DESIGN-CASE-PLAN.md` id), DATA, OUT-OF-SCOPE
(reason), SPEC-CONFLICT (register id) or LIBRARY (a design-library sentence, classified). Zero unclassified.

## 1 · Credit Terms page — Active tab (p1 figs 1-3, 8-10; p2 figs 2-5, 9; p3 figs 1-3 behind dialogs)

| # | What you see | Class |
|---|---|---|
| V1 | Side menu: group **FINANCE** (capitals, like every group) holds **Payment Methods** then **Credit Terms** directly below; Credit Terms selected = blue text with a blue clock icon ("schedule") | DL-01 |
| V2 | Page title **Credit Terms** (30 px, semibold) left; top right a square white **⋯** button (outlined) then the blue primary **+ New Credit Term** button (plus icon, white text). One primary button on the page | DL-01 |
| V3 | Tabs under the title: **Active** + count pill, **Inactive** + count pill. Selected: blue text (#175CD3), 2 px blue underline (#257CFF), light-blue pill (#E9F5FF). Unselected: grey text (#697586), no underline, light-grey pill (#EEF2F6). Thin grey line under the tab row | DL-01, DL-04 |
| V4 | One table, no sections, no card frame (white, edge rules only). Columns in order: **Name** (347 px), **Due** (417 px), **Customers** (139 px, right aligned), **Vendors** (139 px, right aligned), unlabeled actions column (116 px; its "Actions" heading is visually hidden). Headings 12 px, semibold, grey (#697586), sentence case | DL-01 |
| V5 | Rows 48 px tall, 14 px text, one line each, light divider between rows; counts right aligned, 0 shown as **0** | DL-01 |
| V6 | Row order: COD, Due on Receipt, Net 7, Net 10 (shop's own, between Net 7 and Net 15), Net 15, Net 20, Net 30, Net 45, Net 60, Net 90, Net 120, 10th of next month, Credit Hold last (Net 50 is on the Inactive tab in this demo) | DL-01 |
| V7 | COD, Due on Receipt and Credit Hold: name, then a grey outlined **info (i)** icon, then a grey outlined **lock** icon. No other row has either icon | DL-01 |
| V8 | **Default** tag: light-blue pill (#E9F5FF fill, #175CD3 text, 22 px tall) right after the name, after the info and lock icons on COD / Due on Receipt; exactly one row carries it | DL-01, DL-06 |
| V9 | Each row ends with a grey **⋯** icon button, right aligned | DL-01 |
| V10 | Tooltips (lock, info): dark grey box (#616161 at 92%), white 14 px regular text, 4 px corners, no arrow, opening to the **right** of the icon and covering the Due text of that row; the lock tooltip is two lines ("Always available." / the second sentence) | DL-02 (look); CT-D01 for the Due on Receipt words |
| V11 | Success toast: green (#21BA45) 400 × 56 px box at the bottom right of the content (above the page bottom edge, right of centre), white check-circle icon, bold first line, regular second line, **Close** text button at the right | DL-03 |
| V12 | Top bar: ShopView logo, ShopHub ▾, Work Orders, Schedule, Customers, Parts, Reports, Dashboard, search box "Searc…" with Ctrl K, Clock In, bell, location pill "Staging Heavy Duty - 9919" with avatar AS | OUT-OF-SCOPE (app chrome, unchanged) |

## 2 · Row menus (p1 figs 4-8, p2 fig 1, fig 9; p3 fig 5)

| # | Menu (term) | Items in order, icon, state | Width / position | Class |
|---|---|---|---|---|
| V13 | Unused own term (Net 6, r16-m-unused) | Edit (pencil) · Make Default for New Customers (circle check) · Move Customers (person) **greyed** · Deactivate (archive box) · divider · Delete Credit Term (trash) **red text, red icon** | white panel with shadow, below the ⋯, right edge aligned with the ⋯; as wide as its longest item | DL-07 |
| V14 | Standard term (Net 15, r16-m-standard / r16-m-move) | Make Default for New Customers · Move Customers · Deactivate; hovered row = light-grey fill; Deactivate tooltip opens to the **left** of the menu | same | DL-35 |
| V15 | COD as default, no customers (r16-m-cod) | Move Customers only, **greyed**; tooltip left of the menu | 158 px wide (caption) | DL-45 |
| V16 | In-use own term (10th of next month, r16-m-inuse) | Edit **greyed** · Make Default · Move Customers · Deactivate · divider · Delete Credit Term **greyed** (red turns pale grey); two-line tooltip left of the menu | same | DL-46 |
| V17 | Current default, standard (Net 30, p1 fig 8) | Move Customers · Deactivate **greyed** (#CDD5DF text and icon); two-line tooltip left of the menu, right aligned text; Make Default absent; the row behind is highlighted light grey | 164 × 96 px | DL-47 |
| V18 | COD for a user without the customer permissions (p2 fig 9) | Make Default for New Customers · Move Customers **greyed**; one-line tooltip left of the menu | 270 × 96 px | DL-48 |
| V19 | Inactive standard term (Net 7, r16-m-inactive) | Reactivate (rotate arrow) hovered · Move Customers; tooltip left | same | DL-49 |
| V20 | Page ⋯ menu (r16-m-page) | Audit Log, no icon | below the ⋯ button, as wide as the item | DL-08 |

## 3 · Inactive tab and the all-deactivated state (p4)

| # | What you see | Class |
|---|---|---|
| V21 | Active 4 / Inactive 10 after deactivating everything possible: Active lists COD, Due on Receipt, Net 30 (Default tag), Credit Hold | DL-09 |
| V22 | Inactive tab selected (blue underline under Inactive): same columns and widths as Active (measured identical: 347/417/139/139/116), same row order; no info/lock icons; no Default tag | DL-09 |
| V23 | New shop: Active 12 / Inactive 0 selected; column headings stay; one centred row "No inactive terms" (grey 14 px) inside the table, a rule under it | SPEC-CONFLICT CT-D02 (PRD: the line in place of the table); DL-10 + held DV-02 |

## 4 · Dialogs (all centred over a dimmed page, scrim)

| # | Dialog | Title / size | Body, top to bottom | Buttons (right aligned, order, colour) | Class |
|---|---|---|---|---|---|
| V24 | Make Default (p1 fig 9) | "Make Net 30 the default?" 20 px; 520 px wide, 8 px corners; grey × top right; header rule | the message, grey 14 px | **Cancel** white with grey border · **Make Default** blue (#257CFF) white text | DL-11 |
| V25 | Delete (r15-delete) | "Confirmation" large bold; blue × | "Are you sure you want to delete this credit term?" | **Cancel** grey filled · **Delete Credit Term** red filled | DL-12 (build picture); look question CT-D05 |
| V26 | New Credit Term (p3 figs 1-2) | "New Credit Term" 18 px; 640 px wide, 12 px corners; grey × | Name (floating label, 590 px) with grey hint "Up to 31 characters…" under it; two radio rows: "Due Net X days" + Days box (120 px, floating label) + "days after the invoice date"; "Due day of the following month" + Day box + "of the following month"; the not-chosen box greyed (#EEF2F6 fill, pale border, placeholder) and its trailing words pale grey; blue information line (light-blue #E9F5FF box, blue #175CD3 text, info icon) | **Cancel** white · **Create Credit Term** blue | DL-13, DL-14 |
| V27 | New Credit Term errors (p3 fig 3) | same | Name and Days boxes red border (#F04438), red label, red 12 px message under each ("Net 30 is already a standard term. Pick another name.", "Enter 1 to 365 days."); no blue line | **Create Credit Term** pale blue (disabled, 40% opacity) | DL-15; CT-D03, CT-D04 held DV-03/DV-04 |
| V28 | Edit Credit Term (r15-edit) | "Edit Credit Term"; blue × | filled; name selected on open; blue information line | **Cancel** grey filled · **Save Changes** blue | DL-16 |
| V29 | Move Customers (p2 figs 2-4) | "Move Customers from COD" 18 px; 640 px, 12 px corners; grey × | "Search customers" box with magnifier; blue link buttons **Select All**, **Select None** left, "214 selected" grey right; scrolling list in a bordered box, rows 36 px with a 1 px line, each a tinted checkbox (light-blue fill, blue tick) and the name, A to Z; **Move To** select (notched label, chevron), grey hint "Prefilled with your default for new customers." under it | **Cancel** white · **Move 214 Customers** blue | DL-17 |
| V30 | Move To open (p2 fig 4) | — | dropdown opens upward over the list, 300 px wide: Due on Receipt (selected: light-blue row, blue text) · Net 7 · Net 10 · Net 15 · Net 20 · Net 30 · Net 45 · Net 60 · Net 90 (list scrolls); no Default tag in this list; COD absent | — | DL-37 |
| V31 | Move To COD (r15-move-cod) | "Move Customers from Net 7" | under Move To two grey lines: the hint and "Their credit limit will be set to $0." | **Cancel** grey filled · **Move 14 Customers** blue | DL-18 |
| V32 | $0 confirmation (r15-limit-confirm) | "Set 14 customers' credit limit to $0?" large bold; blue × | the message (two lines) | **Cancel** grey filled · **Set Limits To $0 And Move** red | DL-19 (behind it the Move button shows a spinner, see NOTES.md) |
| V33 | Credit Terms Log (r16-log) | "Credit Terms Log" bold left; search centred (magnifier + "Search"); blue × right; 1200 px wide, as tall as its rows | columns Event, User, Details, Date, Time on a light-grey heading band; rows newest first; an edit row shows its two Details lines; dates "Oct 22, 2026", times "09:35 AM" | none | DL-20 |
| V34 | Log empty / error (r15-log-empty, r15-log-error) | same | grey centred line "No history here. Yet." / the error sentence in the same place; error: red alert bottom right (warning triangle, white text, Close) | none | DL-21 (empty), DL-38 (error) |
| V35 | Over Credit (production before-over-credit.png) | "Confirmation" large bold; blue × | the message | **Create** red · **Cancel** blue filled | DL-25 (compare with the production picture; the board redraw has a white Cancel: CT-D06) |

## 5 · Customer and vendor windows, cards, pickers (p5, p6, p7)

| # | What you see | Class |
|---|---|---|
| V36 | New Customer (608 px window): fields Name *, Phone, Address 1, Address 2, City / ZIP, State/Province / Country, then **Credit Terms** (left, 271 px) and **Credit Limit** (right, 271 px) side by side, then Sales Representative (+), Notes, Website, IBS; Save blue at the bottom right | DL-22 |
| V37 | Credit Terms prefilled "Due on Receipt" (floating label); Credit Limit empty with its label inside the box | DL-22 |
| V38 | Customer Credit Terms dropdown: opens upward, 271 px, same width as the field; rows COD, **Due on Receipt** + Default pill (selected: light-blue row, blue text, no tick), Net 7, Net 10, Net 15, Net 20, Net 30, Net 45, Net 60 (scrolls); no hover text on options | DL-23 |
| V39 | COD picked: Credit Limit "$ 0.00" greyed (#EEF2F6 fill, pale border, grey text); tooltip "COD and Credit Hold customers can't charge to account, so they have no credit limit." dark grey, under-right of the field, over the Sales Representative row | DL-24 |
| V40 | Without View and Manage AP/AR Data: no Credit Terms, no Credit Limit; Sales Representative follows State/Province / Country | DL-39 |
| V41 | Customer card: "Credit term" label (semibold) with **Net 10 (Inactive)** under it (semibold value); "Credit limit" "$0.00" | DL-26 (demo value mismatch CT-D09) |
| V42 | Edit Customer: Credit Terms "Net 10 (Inactive)" selected, Credit Limit "$ 5,000.00" editable, side by side; COD picked → "$ 0.00" greyed with the same tooltip | DL-27 (inactive term), DL-40 (COD lock) |
| V43 | Edit Customer dropdown for the Net 10 (Inactive) customer: active terms, Net 10 absent among them; the drawing is cut at the top and ends at Net 90 — the "Net 10 (Inactive)" last row is not visible | DL-28 (CT-D10); any other customer's list (p6 fig 7): DL-41 |
| V44 | Vendor windows (800 px): Credit Terms (367 px) and Credit Limit (367 px) side by side; New Vendor shows "COD"; Credit Limit "$ 0.00" editable on every term; Save & Close blue | DL-29 |
| V45 | Vendor dropdown: rows text only, the selected row light-blue with a **blue tick** before the name (customer dropdown has no tick); no Default tag anywhere; first row (COD) cut off under the window top in figs 2, 4, 8 | DL-30 |
| V46 | Vendor on Net 10 (Inactive): card "Net 10 (Inactive)"; Edit Vendor list ends Net 120, 10th of next month, Credit Hold, then ✓ **Net 10 (Inactive)** selected | DL-31 (Edit Vendor list), DL-42 (vendor card) |

## 6 · Due dates and the Over Credit warning (p7 figs 9-11, p8, p9)

| # | What you see | Class |
|---|---|---|
| V47 | Vendor invoice card: "Invoice date" Oct 5, 2026, "Due date" Nov 10, 2026 (10th of next month) / Oct 15, 2026 (Net 10); the due date carries a yellow highlight that is "not part of the screen" | DL-32 (10th of next month), DL-43 (Net 10) |
| V48 | Work order invoice: "Invoice date:" / "Due date:" right under the invoice number (right aligned, bold values); reference chips Work Order · Customer PO · **Terms 10th of next month** (the Terms chip outlined orange = board highlight, not part of the screen) | DL-33 (Oct 5), DL-44 (Oct 28) |
| V49 | New Work Order for a COD customer with $0 limit: the New Work Order window only, no confirmation | DL-34 |
| V50 | Still warns: Confirmation over the New Work Order window, Create red then Cancel | DL-25 (compare with the production picture; the board redraw has a white Cancel: CT-D06) |
| V51 | Today's badges on the work order card: "Invoiced" (green) and "Over Limit" (red pill) | DL-36 (CT-D07) |

## 7 · Design-library rules (Rule 126 point 4): every always / never / must / should / only sentence

Library: `files/project/ds/shopview/` (colors_and_type.css, components.css, tokens.css, tokens.json). 19 sentences found; each classified.

| # | Library sentence (file) | Where it applies on the boards | Class |
|---|---|---|---|
| L1 | "Selected is visually identical to hover … Count badges are parenthesised text, NOT chips." (components.css, TABS) | The Credit Terms tabs use an underline and count pills instead; the board says why: "Tab look matches the Inspection Templates tabs in production" (p1 fig 1 caption). The customer page tabs follow the library ("Work Orders (27)") | LOOK (board's own written choice) → DL-01 checks the board's look |
| L2 | "Checked checkbox/radio use a TINTED fill with an accent glyph — not a solid accent fill" (components.css, CONTROLS) | Drawn Move list: tinted ✓; build capture r15-move-cod: solid blue | CT-D05 (question 5) |
| L3 | "danger rows recolour the text only — no red hover background" (MENU) | Delete Credit Term red text and icon, no red row | DL-07 |
| L4 | Menu "260px panel" (MENU spec) | Boards: "The menu is as wide as its items" (158 px, 164 px, 270 px) | LOOK (board's own written choice) → DL-07 |
| L5 | Danger button "Use only for delete / remove / reset." (BUTTON) | Delete Credit Term ✓, Set Limits To $0 And Move ✓; Over Credit "Create" is red — today's dialog, unchanged (S9-R1) | DL-12, DL-19; OUT-OF-SCOPE for Create (existing dialog) |
| L6 | "The placement class and the arrow class are INVERSES" (TOOLTIP) | Board tooltips have no arrow and are grey #616161 regular text (not the library's grey-900 bold-title tooltip) — the same as the build captures | DL-02 (board look) |
| L7 | "Radius differs by header type: 12 for the title header, 8 for the icon+subtitle confirmation" (MODAL) | Form dialogs 12 px; confirmations 8 px (measured) | DL-11, DL-13 |
| L8 | "the <input> must come BEFORE the <label> … the input must carry placeholder=" "" (INPUT) | build rule for floating labels; not visible | OUT-OF-SCOPE (markup rule, nothing a tester sees) |
| L9 | "right-align must be set on the th AND the td" (TABLE) | Customers and Vendors headings and numbers right aligned | DL-01 |
| L10 | "Never hardcode a header height" (SHELL) | markup rule | OUT-OF-SCOPE (markup rule) |
| L11 | "A list screen in Shopview is white … the table runs edge to edge. Nothing is wrapped in a card." (List layout) | Credit Terms page: white, table not in a card ✓ | DL-01 |
| L12 | "Disabled-on and disabled-off are the same colour. Only the thumb moves." (toggle) | no toggle on any board | OUT-OF-SCOPE (component not used) |
| L13 | "inner buttons must be fully transparent" (split button) | not used | OUT-OF-SCOPE (component not used) |
| L14 | "must follow the tone rules" (badge flat) | markup rule | OUT-OF-SCOPE (markup rule) |
| L15 | "Never consumed by components directly … Dark greys, never pure black; off-whites, never pure white." (colors_and_type.css, dark primitives) | dark theme not drawn | OUT-OF-SCOPE (no dark board) |
| L16 | "the ONLY layer components read … Never reference primitives or hex from a component." | markup rule | OUT-OF-SCOPE (markup rule) |
| L17 | "This file defines NO tokens … It only spends them" / "can never fight an artboard's own CSS" (components.css header) | markup rule | OUT-OF-SCOPE (markup rule) |
| L18 | "DS rule: one primary button per view" (quoted on p1 fig 1 caption) | one blue button on the page (New Credit Term); each dialog one blue/red confirm | DL-01, DL-11 |
| L19 | "The 2px gap between rows is real" (MENU) | menu rows | DL-07 |

## 8 · Totals

Screen/state rows V1-V51 over the 62 figures, plus 19 design-library sentences L1-L19 = 70 rows. Classified: 61 rows map to a planned look
case (DL-01 … DL-49 in DESIGN-CASE-PLAN.md; DL-05, the 31-character name, is the widths paragraph above) and, where the design differs
from the PRD, to the register (CT-D01 V10, CT-D02 V23, CT-D03/CT-D04 V27, CT-D05 L2/V25, CT-D06 V35/V50, CT-D07 V51, CT-D09 V41,
CT-D10 V43) with the 4 held design-version cases DV-01 … DV-04; 9 rows OUT-OF-SCOPE with the reason (V12 app chrome; L8, L10, L12-L17
markup rules, unused components, no dark board); L1 and L4 are the boards' own written departures from the library and are checked as
the boards draw them. **Unclassified: 0. Unsent questions: 5** (CT-D01 … CT-D05, drafted in NEW-QUESTIONS.py; the QA lead sends them).
