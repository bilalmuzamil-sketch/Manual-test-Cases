# Design visual inventory — Internal Work Orders (12 Nov 2026)

Rule 126 / skill 21 §4b. Updated 12 Nov 2026 after the full line-by-line read of the design library (§C, DC-86, IWO-D53 to IWO-D55). The design is a canvas of 167 live component boards (`.dc.html`), so the look was read from each board **rendered locally** at its own size in light theme (`tools/render.js`, pictures in `images/`), from the computed style of every visible text (size, weight, colour, background, case: `render/render-log-*.json`, summary of the feature's own labels in `render/look-facts.txt`, `tools/look_facts.py`), from the frame-opened renders where a frame cuts its board (`render/full/`), and from renders at 1440 and 1536 px (`render/widths/`, `render/full-and-widths.json`). The design draws no dark theme and no density switch. Happy flow and Review boards are byte-for-byte copies of a Flow board apart from the title (`render/hf-rv-diffs.txt`); they are listed with their Flow board.

Every row is **COVERED** (design case in `DESIGN-CASE-PLAN.md`), **SPEC-CONFLICT** (register row in `../DESIGN-DIVERGENCE-REGISTER.json`: settled by a named PRD sentence, or a drafted question with its held case), **OUT-OF-SCOPE** (unchanged production screen or designer tooling, reason given) or **DATA** (designer's sample values). Unclassified: **0**.

## A. Screens and states

| # | Screen / state (board · picture) | What the design shows (look) | Class |
|---|---|---|---|
| V01 | Settings > Work Orders, toggle off (Flow 0 01 · iwo-flow0-01; Happy 01) | Toggle row "Internal Work Orders" in the Workflow group after Require Review Before Completion, name 14px semibold dark grey, description 12px grey wrapping to 3 lines at 1280; toggle off; no hints | COVERED DC-01; SPEC-CONFLICT IWO-D01 (description, settled S1-R1) |
| V02 | Turn-on window (Flow 0 01b; Happy 02; Review 1.2) | Centred modal over the page, title, X, grey body, one customer search field with chips, hint line, "You can change this…" line, buttons "Do this later" (white, outlined) then "Save" (blue) bottom right | COVERED DC-02; SPEC-CONFLICT IWO-D05 (body names an old account, Save drawn enabled with nothing picked) |
| V03 | Settings, toggle on (Flow 0 02; Happy 03; Review 1.3) | Two grey 12px hint lines under the description, each led by an info icon; "Internal Work Orders" and "QuickBooks" as blue links, green QuickBooks mark before the second | COVERED DC-03 (1440 + 1536); SPEC-CONFLICT IWO-D02 |
| V04 | Settings, toggle on, no flagged customer (Flow 0 03) | Drawn pixel-identical to V03 (no "No internal customer yet" hint) | COVERED DC-04 (PRD wording); SPEC-CONFLICT IWO-D03 |
| V05 | Settings, turned off (Flow 0 12) | Toggle named "No-Charge Work Orders" with an older description | COVERED DC-05; SPEC-CONFLICT IWO-D04 |
| V06 | Categories page, Internal categories (Flow 0 2a; Happy 04; Review 2.1) | Page title 24px semibold; grey intro; tabs as pills (selected grey fill); blue "+ New Internal Category" right; white rounded table: Category · QuickBooks expense account (green mark) · Internal customers (smaller grey text) · Work orders (right-aligned count) · three-dots; small grey outlined "Default" badge after General Internal; "Not set" orange with a warning triangle; grey note under the table ending with a blue "Show archived (1)" link | COVERED DC-06 (1440 + 1536); SPEC-CONFLICT IWO-D08 (column label) |
| V07 | Categories page, No Charge categories (Flow 0 2b; Happy 05; Review 2.2) | Same frame; columns Category · QuickBooks expense account · Original work order ("Required" / "Not asked", 13px semibold) · Work orders · menu; blue "+ New No Charge Category" | COVERED DC-07 |
| V08 | New No Charge Category window (Flow 0 2c; Happy 06; Review 2.3) | Modal: Name with a grey helper; "QuickBooks expense account" with one picker per location (Staging Main, Staging North) and the long helper; checkbox "Requires the original work order" with helper; Cancel / Save | COVERED DC-08; SPEC-CONFLICT IWO-D09 (Name helper, question 8, DV-01), IWO-D10 |
| V09 | New Internal Category window (Flow 0 2d) | As V08 with "Default category" checkbox and helper instead of the original-work-order checkbox | COVERED DC-09; SPEC-CONFLICT IWO-D10 |
| V10 | Categories page, setting off (Flow 0 2e) | Notice at the top, tables drawn greyed (read-only), New buttons disabled | COVERED DC-10; SPEC-CONFLICT IWO-D07 (PRD: lists stay editable) |
| V11 | Customers list (Flow 0 04; Happy 07) | Small "Internal" badge (10px semibold, orange-brown text on light orange, square corners) right after the flagged customer's name | COVERED DC-11 |
| V12 | Customer page, internal customer (Flow 0 05) | "Internal" badge after the name in the header (11px) | COVERED DC-12 |
| V13 | Edit Customer, flagged (Flow 0 11; Happy 08; Review 3.2; Flow 0 05/08 behind dialogs) | Last field "Internal customer" ticked; on 11: select "Default internal category" with a grey helper under it; Min shop supplies $25.00 accepted without a percentage | COVERED DC-13; SPEC-CONFLICT IWO-D06 (05/08/3.2 lack the helper and the select) |
| V14 | Edit Customer, setting off (Flow 0 06) | Checkbox ticked and greyed, line "Turn on Internal Work Orders in Settings to change this." with Settings a blue link; no badge in the header | COVERED DC-14 |
| V15 | Make internal window (Flow 0 07) | Modal: title question, grey body, a bordered list (Work order · location), notes "Vendor bill: cost moves at Close" / "Deposit: stays billable" in small grey, "1 more at locations you don't have access to.", buttons "Keep billable" (white) then "Make internal" (blue) | COVERED DC-15 |
| V16 | Remove flag window (Flow 0 08) | Modal title "Remove the Internal flag from …?", body, buttons Cancel then "Remove flag" | COVERED DC-16 |
| V17 | Edit Asset, internal category (Flow 0 11b; Happy 09; Review 3.3) | Divider after the existing fields, select "Internal category" (Shop Equipment Maintenance picked), helper led by the green QuickBooks mark | COVERED DC-17 |
| V18 | QuickBooks, ShopView Accounts rows (Flow 0 09; Happy 10; Review 3.1) | Two group headers under Cost of Parts (uppercase-free, semibold) then one row per category with an account picker; grey note on shop supplies; frame cuts the bottom of the list (read from `render/full/`) | COVERED DC-18; SPEC-CONFLICT IWO-D11 |
| V19 | QuickBooks, empty category row (Flow 0 10) | Empty picker with the existing grey empty-row hint under it | COVERED DC-19; SPEC-CONFLICT IWO-D11 |
| V20 | Work orders list (Flow 1 01, 09; Flow 4 01-03; Happy 11, 19, 38; WO List artboard) | 1440 table; badges after the customer name (10px semibold); both badges the same orange style; Total Price "No Charge" in the cell; Classification chip blue (selected) with the value | COVERED DC-25, DC-26, DC-27, DC-28, DC-29; SPEC-CONFLICT IWO-D35 (badge column), IWO-D15 (same style), IWO-D36 (02 shows Internal) |
| V21 | New Work Order, regular customer (Flow 1 02a; New WO artboard) | Divider under "Asset Here?", checkbox "No Charge" with info icon; tooltip not drawn | COVERED DC-20; SPEC-CONFLICT IWO-D12 |
| V22 | New Work Order, internal customer (Flow 1 02b, 2b2; Happy 12, 13; Review 3.4, 3.5) | "Internal" badge + info icon after the customer name; dark tooltip with white text; on 02b the open asset list covers it | COVERED DC-21, DC-22; SPEC-CONFLICT IWO-D13 |
| V23 | New Work Order, No Charge ticked (Flow 1 02e; Happy 20; Review 3.6) | "Category *" select (Warranty), "Original work order" select open with groups (customer · unit) and "Other / Not in ShopView", grey helper; no Original technician line | COVERED DC-23, DC-24; SPEC-CONFLICT IWO-D24 |
| V24 | Work order detail, internal, in progress (Flow 1 03; Happy 14; WO Detail artboard) | Header white with the normal border, "Internal" badge 11px next to the status; lines table keeps Rate ($0.00) and Total; Financial Info with a Value column; "Shop supplies $25.00" field; blue "Close Work Order" header button while lines are open | COVERED DC-30, DC-31, DC-35; SPEC-CONFLICT IWO-D14 (no orange header), IWO-D17 (prices), IWO-D18 (button placement) |
| V25 | Three-dots menu, internal (Flow 1 3c) | Menu: Audit Log, Timesheets, Print Work Order … no Create invoice, no Send to Portal | COVERED DC-32; SPEC-CONFLICT IWO-D18 |
| V26 | Finance tab, open internal estimate (Flow 1 04, 3d; Happy 15) | Estimate document: masthead, grey "INTERNAL" stamp (11px on light grey) with "Category: General Internal", line totals, "No Charge." block | COVERED DV-02 (held, sheet question 3); SPEC-CONFLICT IWO-D19 |
| V27 | Lines with a core row (Flow 1 3e) | Core row under the part: "Core · Brake caliper", "$85.00 cost", no price | COVERED DC-33 |
| V28 | Ready for review (Flow 1 04b) | No Close Work Order button; review action as on billable | COVERED DC-34 |
| V29 | Complete, ready to close (Flow 1 05; Happy 16) | Blue header button "Close Work Order" | COVERED DC-35 |
| V30 | Change customer, vendor bill (Flow 1 2c, 2d) | Modal "Change where the cost is posted?" with body and Cancel / Continue | COVERED DC-36; SPEC-CONFLICT IWO-D34 |
| V31 | Close · Missing Details first (Flow 1 06) | Missing Details step before the confirmation | COVERED DC-37 |
| V32 | Close confirmation (Flow 1 07; Happy 17; Review 5.2) | Modal: Posting date field; rows label left, amount right, grey note under each; sentence under the rows; Cancel (white) then "Close Work Order" (blue) | COVERED DC-38; SPEC-CONFLICT IWO-D20 |
| V33 | Close, no account set (Flow 1 7b) | Warning note with a blue "Set account" link under Stock parts | COVERED DC-39; SPEC-CONFLICT IWO-D22 |
| V34 | Close, no accounting integration (Flow 1 7c) | No notes, no Posting date | COVERED DC-40; SPEC-CONFLICT IWO-D21 |
| V35 | Close, parts with no cost (Flow 1 7d) | Extra block "Parts with no cost" listing "Gasket kit" | COVERED DC-41 |
| V36 | Close, work order changed (Flow 1 7e) | Error line at the top of the modal "This work order changed. Review and close again." | COVERED DC-42 |
| V37 | Close, QuickBooks without inventory accounts (Flow 1 7f) | Grey note replaces the account note | COVERED DC-43 |
| V38 | Close failed (Flow 1 S2) | Red alert toast "Could not close the work order. Try again." without a dismiss control | COVERED DC-44; SPEC-CONFLICT IWO-D28 |
| V39 | Closed internal work order + INTERNAL document (Flow 1 08; Happy 18; Review 5.3) | Grey "Closed" pill + Internal badge; green success alert without X; "Reopen" white button in the header; document masthead, INTERNAL stamp, Summary with "Labor 2.0 h" | COVERED DC-45; SPEC-CONFLICT IWO-D27, IWO-D28, IWO-D32 |
| V40 | Asset Invoices tab (Flow 1 10b) | Row: number, date, customer, grey "Closed" pill, "No Charge" badge, "—" in empty cells | COVERED DC-50 (held on sheet question 4); SPEC-CONFLICT IWO-D16 |
| V41 | Convert to No Charge in the menu (Flow 2 01; Happy 21; Review 4.1) | Menu item highlighted blue on light blue (hover) | COVERED DC-51 |
| V42 | Convert to No Charge, deposit (Flow 2 1b) | Item greyed (light grey text), no tooltip drawn | COVERED DC-52; SPEC-CONFLICT IWO-D40 |
| V43 | Convert to No Charge, no permission (Flow 2 1c) | Item absent | COVERED DC-53 |
| V44 | Convert confirmation (Flow 2 02; Happy 22; Review 4.2) | Modal: title in lower-case "no charge", grey body, Category * (Warranty), Original work order and Original line selects, grey helper, Cancel / "Convert to No Charge" (blue) | COVERED DC-54; SPEC-CONFLICT IWO-D25, IWO-D24 |
| V45 | No-charge work order (Flow 2 03; Happy 23; Review 4.3 copy) | "No Charge" badge in the Internal style next to the status; white header; "Parts cost $180.00", "$180.00 cost" on the part | COVERED DC-55; SPEC-CONFLICT IWO-D14, IWO-D15 |
| V46 | Convert to Billable (Flow 2 3b; Happy 26; Review 4.4) | Menu: Change category, Convert to Billable, Close Work Order; modal with body and Cancel / "Convert to Billable" | COVERED DC-56; SPEC-CONFLICT IWO-D26 |
| V47 | Change category (Flow 2 3c; Happy 25; Review 4.3) | Modal title, Category * Warranty, Original work order and line, Cancel / Save | COVERED DC-57 |
| V48 | Notes after Convert (Flow 2 3d, 3e; Happy 24; Review 4.5) | System note by "ShopView" with time, plain text (no links) | COVERED DC-58, DC-59; SPEC-CONFLICT IWO-D33, IWO-D26 |
| V49 | Close a no-charge work order (Flow 2 04; Happy 28) | Confirmation as V32 with the category account; behind it an old "No Charge" checkbox and hint on the customer card | COVERED DC-60; SPEC-CONFLICT IWO-D23 |
| V50 | Close, original work order required (Flow 2 4b; Happy 27; Review 5.1) | "Original work order *" select open above the rows with an orange warning line | COVERED DC-61; SPEC-CONFLICT IWO-D23 |
| V51 | Closed no-charge, Finance tab (Flow 2 05; Happy 29; Review 5.4) | Document block "No Charge Work Order S2-35102", NO CHARGE stamp with "Category: Warranty · Original work order S2-31207" (plain text); menu with "Reopen Work Order" | COVERED DC-62, DC-46; SPEC-CONFLICT IWO-D32 |
| V52 | Closed no-charge, read-only (Flow 2 06) | Header line "Closed on Oct 22, 2026. To change it, reopen it from the Finance tab."; menu without Convert | COVERED DC-63 |
| V53 | Finance tab, open no-charge estimate (Flow 2 07) | "Estimate S2-35102", NO CHARGE stamp with category line | COVERED DC-64 |
| V54 | Portal estimate (Flow 2 7b) | Portal page, NO CHARGE stamp, category line, no prices | COVERED DC-65 |
| V55 | Closed internal, locked (Flow 3 01; Happy 36) | Header line "Closed on …"; frame-opened render shows a locked note below | COVERED DC-49, DV-03 (held, question 9); SPEC-CONFLICT IWO-D29 |
| V56 | Reopen dialog (Flow 3 02; Happy 37) | Modal over the Lines tab: title, one-sentence body, Cancel / "Reopen Work Order" (blue); locked note card behind | COVERED DC-47; SPEC-CONFLICT IWO-D30, IWO-D29 |
| V57 | Complete again (Flow 3 03) | Green toast "Work order S2-34918 reopened"; Close Work Order header button | COVERED DC-48, DV-04 (held, question 10); SPEC-CONFLICT IWO-D31 |
| V58 | Technician Efficiency chip (Flow 4 04) | Chip "No-charge work orders: Show all", list Hide / Only no-charge / Show all | COVERED DC-73; SPEC-CONFLICT IWO-D41 |
| V59 | Internal Work Orders report, by work order (Flow 4 05; Happy 39; Review 7.2) | Filters row; summary cards (category name, 16px semibold amount, grey counts); tabs; table 13px; work order numbers and dates wrap onto two lines; empty cells on the internal row; totals row | COVERED DC-74 (1440 + 1536), DV-05, DV-06; SPEC-CONFLICT IWO-D43, IWO-D44 (question 11), IWO-D45 (question 12) |
| V60 | Report, by technician (Flow 4 06; Happy 39b; Review 7.5) | Columns per S9-R2; row "Not in ShopView / no technician"; grey note under the table | COVERED DC-75 (1440 + 1536); SPEC-CONFLICT IWO-D42 |
| V61 | Phone list card (Flow 4 07) | 390 px card with "No Charge" badge on an internal work order | COVERED DC-76; SPEC-CONFLICT IWO-D16 |
| V62 | Phone detail header (Flow 4 08) | Header with an orange outline and light orange background, "No Charge" badge on an internal work order | COVERED DC-77; SPEC-CONFLICT IWO-D16 |
| V63 | Tech View (Flow 4 09) | "Internal" badge next to the number | COVERED DC-78 |
| V64 | Board card (Flow 4 10) | Card with a "No Charge" badge on an internal work order; closed card in the closed column | COVERED DC-79; SPEC-CONFLICT IWO-D16 |
| V65 | Schedule card (Flow 4 11) | "Internal" badge next to the number on the card | COVERED DC-80 |
| V66 | QB Unexported (Flow 5 01; Happy 40) | Journal Entries tab, row with "Internal" badge, type "Journal Entry", withdrawn row | COVERED DC-81; SPEC-CONFLICT IWO-D46 |
| V67 | AccountingHub Sales > Invoices (Flow 5 03) | "Closed" pill (grey) + badge; Status filter | COVERED DC-82 |
| V68 | AccountingHub closed record (Flow 5 3b; Happy 41; Review 7.3) | Record header pill + badge; definition list (12px grey labels, 12px semibold values); journal table | COVERED DC-83 |
| V69 | AccountingHub Held event (Flow 5 04; Happy 42; Review 7.4) | "Held" pill amber (same colours as the Internal badge), reason text, Dismissed row | COVERED DC-84; SPEC-CONFLICT IWO-D47 |
| V70 | AccountingHub invoice with a No Charge line (Flow 5 3c; Happy 41b; Review 7.6) | "No Charge lines" card cut by the 840 px frame (seen in the frame-opened render) | COVERED DC-85; SPEC-CONFLICT IWO-D48 |
| V71 | Line menu, Mark as No Charge (Flow 6 01; Happy 30; Review 6.1) | Item between Edit line and Delete line, empty icon slot | COVERED DC-66; SPEC-CONFLICT IWO-D38 |
| V72 | Mark this line as No Charge window (Flow 6 02; Happy 31; Review 6.2) | Modal: grey line summary "1.00 h · Caliper (special order) × 1 · M. Rhodes · $559.95", body, Category *, originals, Cancel / "Mark as No Charge" (blue) | COVERED DC-67; SPEC-CONFLICT IWO-D24 |
| V73 | Line marked No Charge (Flow 6 03; Happy 32; Review 6.3) | Chip "No Charge · Warranty" after the title; Rate/Total $0.00 (grey 13px); no badge on the header | COVERED DC-68 |
| V74 | No-charge line menu (Flow 6 04; Happy 33; Review 6.4) | Change category / Mark as Billable (blue on light blue), empty icon slots | COVERED DC-69; SPEC-CONFLICT IWO-D38, IWO-D40 |
| V75 | Notes and Audit Log (Flow 6 05; Happy 34; Review 6.5) | Note by ShopView with the time | COVERED DC-70; SPEC-CONFLICT IWO-D33 |
| V76 | Edit Line, No Charge (Flow 6 06) | Divider at the bottom, checkbox "No Charge" with helper, selects under it | COVERED DC-71 |
| V77 | "Invoice" with the $0.00 line (Flow 6 07; Happy 35; Review 6.6) | Draws the estimate (EST number, Create invoice in the header); line 02 at $0.00 with "Warranty" under the title | COVERED DC-72; SPEC-CONFLICT IWO-D39 |
| V78 | Shared screens, the four artboards at default props | Old defaults: "Internal work orders" toggle, system customer "Staging Heavy Duty Internal" | OUT-OF-SCOPE as screens (superseded component defaults); SPEC-CONFLICT IWO-D37 settled by KD/TERM |
| V79 | Review page notes and reviewer paragraphs (Review 1.1 frame-opened) | Two reviewer remarks below the frame, not visible on the canvas | SPEC-CONFLICT IWO-D50 (question 13; no case until answered) |
| V80 | App shell on every board (top bar, left settings menu, search, avatar) | Production chrome, unchanged | OUT-OF-SCOPE (unchanged production) |

## B. Dialogs, menus, toasts and empty states — rows and buttons in order, against the PRD

| # | Item (board) | Design: rows / options / buttons in order | PRD | Verdict |
|---|---|---|---|---|
| B01 | Turn-on window (Flow 0 01b) | title · body · customer picker · hint · change line · Do this later · Save | S1-R2: same order; Save disabled until a pick | SAME order; Save state DIFFERENT (IWO-D05) |
| B02 | Make internal (Flow 0 07) | title+body · list rows (number · unit · status, location, note) · "1 more at locations…" · Keep billable · Make internal | S1-R11 | SAME |
| B03 | Remove flag (Flow 0 08) | title · body · Cancel · Remove flag | S1-R12 | SAME |
| B04 | Category windows (Flow 0 2c, 2d) | Name · QuickBooks expense account (per location) · Requires the original work order / Default category · Cancel · Save | S1-R14 | SAME (helper wording IWO-D09, IWO-D10) |
| B05 | New Work Order bottom (Flow 1 02a, 02e) | Asset Here? · divider · No Charge · Category * · Original work order · (Original line) | S2-R2 (+ Original technician line) | DIFFERENT: no Original technician line (IWO-D24) |
| B06 | Change where the cost is posted? (Flow 1 2c, 2d) | body · Cancel · Continue | S2-R8 | SAME (account names IWO-D34) |
| B07 | Work order three-dots menu, internal (Flow 1 3c) | Audit Log · Timesheets · Print Work Order (no Create invoice, no portal items) | S2-R11, S2-N5, S2-R15, S3-N2 | DIFFERENT: Close Work Order not in the menu while lines are open (IWO-D18) |
| B08 | Close confirmation (Flow 1 07) | Posting date · Stock parts · Special orders and sublet · Labor · Shop supplies · sentence · Cancel · Close Work Order | S3-R2 | SAME order (sentence IWO-D20) |
| B09 | Close variants (Flow 1 7b-7f, Flow 2 04, 4b) | as B08 with: Set account link / no notes / Parts with no cost / error line / inventory note / Original work order * above the rows | S3-N4, S3-E4, S3-E2, S3-E5, S7-N5, S3-R2 | SAME except IWO-D21, IWO-D22 |
| B10 | Close failed toast (Flow 1 S2) | message only | S3-EH: alert toast that must be dismissed | DIFFERENT (IWO-D28) |
| B11 | Success alert after Close (Flow 1 08) | message only | PRD names no success message; note says "X dismisses it" | IWO-D28 (settled: no PRD wording to test; look only) |
| B12 | Menu of a billable work order (Flow 2 01) | … Add Work Order Fee / Discount · Convert to No Charge … | S2-R5 "next to Add Work Order Fee / Discount" | SAME |
| B13 | Convert to No Charge (Flow 2 02) | title · body · Category * · Original work order · Original line · helper · Cancel · Convert to No Charge | S2-R5 | SAME order (title case IWO-D25) |
| B14 | Menu of a no-charge work order (Flow 2 3b) | Change category · Convert to Billable · Close Work Order | S2-R6 | SAME |
| B15 | Convert to Billable (Flow 2 3b) | title · body · Cancel · Convert to Billable | S2-R6 | SAME (body IWO-D26) |
| B16 | Change category (Flow 2 3c) | title · Category * · Original work order · Original line · Cancel · Save | S2-R6 | SAME |
| B17 | Finance tab invoice menu, closed (Flow 2 05) | Reopen Work Order (Download, Print, Email on the toolbar) | S4-R1, S3-R6 | SAME |
| B18 | Reopen (Flow 3 02) | title · body (one sentence) · Cancel · Reopen Work Order | S4-R2 (two sentences) | DIFFERENT body (IWO-D30) |
| B19 | Reopen toast (Flow 3 03) | "Work order S2-34918 reopened" | not in the PRD | QUESTION 10 (IWO-D31, DV-04) |
| B20 | Technician Efficiency chip (Flow 4 04) | Show all · Hide · Only no-charge | S9-R3: Hide · Only internal · Show all | DIFFERENT (IWO-D41) |
| B21 | Classification chip (Flow 4 01) | All · Billable · Internal · No Charge | S2-R14 | SAME |
| B22 | Classification, no results (Flow 4 03) | empty table, chip "Classification: Internal" | S2-R14 (no empty-state wording in the PRD) | SAME (design-silent wording; production empty state) |
| B23 | Line menu, billable (Flow 6 01) | Edit line · Mark as No Charge · Delete line | S12-R1 | SAME (icon IWO-D38) |
| B24 | Mark this line as No Charge (Flow 6 02) | title · summary · body · Category * · Original work order · Original line · helper · Cancel · Mark as No Charge | S12-R2 | SAME (no Original technician line, IWO-D24) |
| B25 | Line menu, no-charge line (Flow 6 04) | Change category · Mark as Billable | S12-R5 | SAME (icons IWO-D38) |
| B26 | Mark line as billable confirmation | not drawn | S12-R5 | NOT DRAWN (IWO-D40; case follows the PRD) |
| B27 | Edit Line bottom (Flow 6 06) | divider · No Charge · helper · Category * · Original work order · Original line | S12-R1 | SAME |
| B29 | Every dialog (library Modal, sv-components.jsx lines 1134-1149) | Esc and a click on the backdrop close the window | S1-R2: "Esc and a click outside do nothing, as in every dialog of the app"; S4-R2 | DIFFERENT (IWO-D53, settled by the PRD; DC-86) |
| B28 | Error toasts of S1-EH, S2-EH, S4-EH, the "Pick a category" field message, "Reverse the deposit first", "Reverse the invoice first.", "Reopen the work order to change the customer." tooltips, the 100-category limit message, the archived-name refusal | not drawn | the PRD gives the words | NOT DRAWN (register not-shown rows; cases follow the PRD words) |

## C. Design-library rules (`_ds_bundle.js` read in full, lines 1-12,181 in 20 chunks, and both style sheets read in full; running notes `render/ds-bundle-reading-notes.md`)

Every rule the library states that touches an Internal Work Orders screen (always/never sentences, default labels, empty states, toast, badge and chip conventions), word for word with its file and lines; the same rows are in the text inventory as "design library" rows (`tools/library_rules.py`, each checked word for word against the bundle or the style sheet by script). The remaining always/never sentences are code and tooling rules with no visible effect (token use, load order, canvas and Tweaks tooling), confirmed by the full read.

| # | File (lines) | The library's words | Class | Case / register | Meaning here |
|---|---|---|---|---|---|
| L01 | columns-dropdown.jsx (442-446) | label: "Total price", | SPEC-CONFLICT | IWO-D55, DC-25 | the list column is "Total price" (lower-case p) and is always last; the PRD writes "Total Price"; the case uses the screen label |
| L02 | badge.jsx (280-290) | "Complete": "success", | COVERED | DC-29, DC-45 | no "Closed" status exists in either status map, so the new Closed status renders in the neutral tone (grey), as the boards draw it |
| L03 | components/sv-components.jsx (948-950) | They are NOT interchangeable | COVERED | DC-29, DC-82 | work-order and finance status vocabularies differ; Closed sits in the work-order list (All tab) and on the hub Sales Invoices page |
| L04 | components/sv-components.jsx (690-691) | Now it warns once per name, so a typo or a glyph that was never vendored shows up the first time it renders. | SPEC-CONFLICT | IWO-D38, DC-66, DC-69 | the line-menu icons "badge-dollar-sign" and "pencil-line" are not in the vendored set (lucide-icons.js), so the boards show an empty slot |
| L05 | components/sv-components.jsx (703) | do not ship an empty box. | SPEC-CONFLICT | IWO-D38, DC-66, DC-69 | Mark as No Charge, Change category and Mark as Billable must carry real icons, like the other menu rows |
| L06 | components/sv-components.jsx (836-838) | Checked state is a TINTED fill with an accent glyph | COVERED | DC-13, DC-23, DC-71 | the Internal customer, No Charge and Requires the original work order checkboxes, when ticked |
| L07 | components/sv-components.jsx (1013-1015) | Counts render as parenthesised text, matching the spec. They are not pills. | COVERED | DC-31 | work order tabs "Lines (2)", "Parts (4)" keep their counts in brackets |
| L08 | components/sv-components.jsx (1063) | empty = 'Nothing to show.', | COVERED | DC-28, DC-74 | a table with no rows shows a text-only empty state (the work orders list uses its own empty state, L13) |
| L09 | components/sv-components.jsx (1134-1141) | if (e.key === 'Escape') onClose(); | SPEC-CONFLICT | IWO-D53, DC-86 | the library Modal closes on Esc and on a click on the scrim; the PRD says Esc and a click outside do nothing in every dialog of the app |
| L10 | components/sv-components.jsx (1342-1346) | "aria-label": "Dismiss" | SPEC-CONFLICT | IWO-D28, DC-44, DC-45 | an alert or toast that can be dismissed carries an X; the PRD error toasts "must be dismissed", the boards draw them without the X |
| L11 | components/sv-components.jsx (1668-1670) | className: "sv-facts__empty" | COVERED | DC-83 | an empty value in a key/value block (AccountingHub record) shows a dash |
| L12 | components/sv-components.jsx (1706-1707) | Never both. | COVERED | DC-25, DC-06 | a list screen with tabs has no visible page title; the categories page (no list layout) shows its title "Internal Work Orders" |
| L13 | filter-bar.jsx (3948) | No work orders match these filters | COVERED | DC-28 | the work orders list filtered by Classification with no match shows "No work orders match these filters" and "Try removing a filter to widen your results." |
| L14 | filter-chip.jsx (5142-5148) | Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown | COVERED | DC-26, DC-27, DC-73 | the Classification chip and the Technician Efficiency chip with a value: "Label: value" in blue on light blue |
| L15 | filter-dropdown.jsx (5727) | Single-select list — checkmark on the selected row, no checkboxes (Asset on site) | COVERED | DC-26, DC-73 | the single-choice Classification and Internal work orders lists mark the picked value with a checkmark |
| L16 | index.js (7280) | 'skeleton / loading': 'No loading state anywhere in the system, including buttons.', | SPEC-CONFLICT | IWO-D54 | the PRD asks for a spinner on the confirming button while an action runs; the library has no loading state and no board draws one |
| L17 | index.js (7281) | 'empty state illustration': 'By design — Shopview empty states are text only.', | COVERED | DC-28 | empty states (filtered list, report with no rows) are text only, no picture |
| L18 | index.js (7276) | 'pagination': 'Not designed. Tables in the product scroll.', | COVERED | DC-74, DC-75 | the Internal Work Orders report table scrolls; no pages |
| L19 | mobile-filters.jsx (7544-7564) | label: "Asset on site", | OUT-OF-SCOPE | IWO-N19 (S2-R14 mobile filter sheet) | the library mobile filter sheet has no Classification row yet; the design draws no mobile filter sheet; the PRD-following case is the case worker's |
| L20 | tokens.js (1845-1846) | inverse: 'var(--sv-surface-inverse)', | COVERED | DC-20, DC-21, DC-73 | tooltips are a dark bubble with light text (Internal badge tooltip, No Charge tooltip, chip tooltip) |
| L21 | work-orders.jsx (10019-10024) | completed: ['Complete', 'Invoiced', 'Paid'] | COVERED | DC-29 | the Completed tab holds Complete, Invoiced and Paid; a closed internal work order shows on the All tab with Status Closed |
| L22 | work-orders.jsx (10375) | Nothing. Always this, never an empty cell or a bare hyphen in text. | SPEC-CONFLICT | IWO-D44, DV-05 | empty report cells should show the dash; the design leaves them blank (question 11) |
| L23 | work-orders.jsx (10399) | A cell that navigates. A link, not a button — buttons do things. | COVERED | DC-74, DC-62 | Work order and Original work order in the report, and the original work order on the NO CHARGE document, are links |
| L24 | work-orders.jsx (10479-10480) | A count that needs a person. The only amber in the row, because it is the one thing in it asking for action. | SPEC-CONFLICT | IWO-D15, DC-25 | amber in a list row is kept for the one thing asking for action; the design draws the Internal (and No Charge) badge amber. The PRD settles only "a different style from Internal" (IWO-D15); the colour is not asked |
| L25 | work-orders.jsx (11538-11541) | const badgeSize = large ? 'md' : 'sm'; | COVERED | DC-25 | at the default row height (48) list badges are the small size (10px), as drawn; the Small and Large row heights are not drawn (DESIGN-SILENT) |
| L26 | work-orders.jsx (11662) | w: c.key === 'onsite' ? 56 : c.key === 'status' ? 120 : undefined | COVERED | DC-25 | the Status column is 120 px; with the status and the Internal / No Charge badge in it (S2-R10) nothing may wrap or overlap at 1440 and 1536 |
| L28 | components.css (255-259) | Spec: preview/tabs.html — pill only, 32px, radius 6. | COVERED | DC-06, DC-07 | the Internal categories / No Charge categories tabs are pills, the selected one grey, as drawn |
| L29 | components.css (51) | .sv-btn--primary:disabled { opacity: 0.4; } | COVERED | DC-02, DC-35, DC-61 | a disabled blue button (Save with nothing picked, Close Work Order before an original is picked) is the same blue at 40% opacity |
| L30 | components.css (233) | .sv-badge--warning { background: var(--sv-warning-fill); border-color: var(--sv-warning-border); color: var(--sv-warning-text); } | SPEC-CONFLICT | IWO-D15, DC-25, DC-55 | the boards draw both the Internal and the No Charge badge in exactly this warning tone (fill #FFFAEB, text #B54708); the PRD asks for No Charge "a different style from Internal" |
| L31 | components.css (236) | .sv-badge--neutral { background: var(--sv-surface-sunken); border-color: var(--sv-border-strong); color: var(--sv-text-primary); } | COVERED | DC-29, DC-45, DC-62 | the Closed status and the INTERNAL / NO CHARGE stamps are neutral grey (fill #EEF2F6) |
| L27 | design-canvas.jsx / tweaks-panel.jsx / ai-agent-icon.js / theme-toggle.js (11-230, 2064-3480, 9217-9980) | They are Claude Design artboard scaffolding | OUT-OF-SCOPE |  | designer tooling and the dark-theme switch: no Internal Work Orders board uses them (the design draws light theme only) |

## D. Widths 1440 and 1536 (each of the 88 distinct desktop board sources re-rendered at both widths; copies share the result; the two phone boards are 390 px by design)

| Result | Boards | Class |
|---|---|---|
| No overlap, no clipping | 71 of 88 | — |
| Header search placeholder "Search customers, work orders, parts..." truncated and touching ⌘ K at 1440 and 1536 | 11 (work orders list and New Work Order boards) | OUT-OF-SCOPE (production top bar, unchanged) |
| Inline link wrapping flagged as overlap (settings hints, categories note "Show archived (1)") | 5 (Flow 0 03, 2e; Happy 03, 04, 05; their Flow copies share them) | False positive: an inline link on a wrapped line; checked on `render/widths/hf-04-1536.png`, nothing overlaps (COVERED DC-03, DC-06 at 1536) |
| Report: work order numbers ("S2-" / "34918") and dates wrap; "S2-30455 · 02" touches its line number | 1 flagged by the check (Happy 39 = Flow 4 05); the same wrap is seen in the 39b / Flow 4 06 picture | SPEC-CONFLICT IWO-D45, question 12, DV-06 |

## E. Counts

- Screens and states: 80 rows (V01-V80): COVERED 77, of which 51 also carry a SPEC-CONFLICT row; OUT-OF-SCOPE 2 (V78 with its register row, V80); SPEC-CONFLICT only 1 (V79).
- Dialogs, menus, toasts: 29 rows: SAME 18, DIFFERENT 7, NOT DRAWN 2, QUESTION 1, look-only settled 1.
- Library rules: 31 rows from the full read (COVERED 20, SPEC-CONFLICT 9, OUT-OF-SCOPE 2); the other always/never sentences are code/tooling rules with no visible effect.
- Widths: 88 distinct sources at two widths: 71 clean, 11 production top bar, 5 false positives (checked), 1 real wrap (question 12).
- Unclassified: 0. Questions unsent: 6 new (rows 8-13 of the one sheet) + 2 already in the sheet draft that hold design cases (3: DV-02, 4: DC-50).
