# Design visual inventory — Bill To (9 Nov 2026)

Rule 126 / skill 21 §4b. The Bill To design is a canvas of **real screenshots** (124 pictures) in 126 figure frames, so the look is
read from the pictures, not from component code: every picture was viewed at its own pixel size, with zoomed crops where a detail was
small (`crops/p2-billto-font.png`). `design_visual_inventory.py` was not run: it renders component boards and has nothing to
render here (the boards hold only `<img>` frames, badges and captions); this file is the hand-made inventory it would produce.
Light theme only (no board draws dark); widths 1440 (and 1440 x 1300), 1600 (asset search, three mary.moore production pictures), 390 (phone).
Every row: **COVERED** (design case in `DESIGN-CASE-PLAN.md`), **SPEC-CONFLICT** (register row, question drafted, held case),
**OUT-OF-SCOPE** (reason), or **DATA**. Unclassified: **0**.

## A. Screens and states

| # | Screen / state (picture) | What the design shows (look) | Class |
|---|---|---|---|
| V01 | New Customer, Bill Invoices To empty (bt-p1-02) | Full-width dropdown "Bill Invoices To" / "This customer" directly below Credit Terms \| Credit Limit, above Sales Representative; no help line; Address 1 with + (no Address 2) | COVERED DC-01 (1440 + 1536) |
| V02 | New Customer, list open (bt-p1-03) | List opens below, over Sales Rep/Notes/Website; 5 rows visible; row 1 typed name + "(this customer)" blue on light blue; then A to Z black on white; field text selected, arrow up | COVERED DC-02 |
| V03 | New Customer, searching / picked (bt-p1-04, -05) | 2 rows ((this customer), match); picked name shown, label and border blue | COVERED DC-03 |
| V04 | Edit Customer, saved default (bt-p1-07) | Field with payer name; small grey help line directly under it, left-aligned; Address 2 with x; Credit Limit greyed (Credit Terms work) | COVERED DC-04 (1440 + 1536) |
| V05 | Edit Customer, list open / searching (bt-p1-08, -09) | (this customer) first black; current pick blue on light blue **in its A-to-Z place** | COVERED DC-05 |
| V06 | Edit Customer, Counter Sale customer (bt-p1-10) | No field, no help line, no gap; Credit Terms \| Credit Limit then Sales Representative | COVERED DC-06 |
| V07 | Customer card line (bt-p1-12) | Under IBS: bold label (same style as Address/Phone), name regular, blue "Change" on its own line; then divider, counters | COVERED DC-07 |
| V08 | Customer that bills itself (bt-p1-11, bt-p5-10) | Card ends IBS → divider → Contacts/Assets; no line, no Pays for | COVERED DC-08 |
| V09 | Bill Invoices To window (bt-p1-13) | Small centred window, title, x, grey help line wrapping to 2 lines, one field, buttons Cancel (grey filled) then Save (blue filled) | COVERED DC-09; SPEC-CONFLICT BT-D03 (DV-03) |
| V10 | Bill Invoices To window, list open (bt-p1-14) | List opens upward, 9 rows, runs over the app's top bar | COVERED DC-05/DC-09 (order); SPEC-CONFLICT BT-D09 (DV-09) |
| V11 | Pays for counter (bt-p1-16) | Third counter "Pays for", number blue, Contacts/Assets black; three counters closer together on one row | COVERED DC-10 |
| V12 | Pays for tooltip (bt-p1-17) | Dark grey, white text, below the card's bottom edge, starting left of the counter, running past the card edge | COVERED DC-11; position in BT-D08 question |
| V13 | Pays for window (bt-p1-18) | Title larger (about 24px) than other Bill To windows; grey line; bulleted underlined blue link; grey Close bottom right; x | COVERED DC-12 |
| V14 | User without AP/AR: New Customer (bt-p1-20) | No field (and no Credit Terms/Limit); window closes up; Foreman top bar | COVERED DC-13 |
| V15 | User without AP/AR: card and Edit Customer (bt-p1-22, -24) | Line without Change; Edit Customer without field/help line | COVERED DC-14 |
| V16 | Customer page on a phone (bt-p1-26) | Label under IBS; name and blue Change on ONE line (desktop: two lines) | COVERED DC-15 |
| V17 | Work order card, This customer (bt-p2-02) | Last row "Bill To" grey small label / value; no border, arrow or button at rest; value a lighter weight than "None" above (crops/p2-billto-font.png) | COVERED DC-16 |
| V18 | Bill To list open (bt-p2-03) | Field bordered, value selected, arrow up; list opens upward, ~355px wide (wider than the 215px card), 9 rows; (this customer) blue on light blue | COVERED DC-17; SPEC-CONFLICT BT-D09 |
| V19 | Bill To searching / no match / Counter Sale (bt-p2-04, -05, bt-p3-18) | List below the field, card width; no "no results" message; Change Customer icon visible | COVERED DC-18 |
| V20 | Bill To picked (bt-p2-06, -08, bt-p3-14) | No toast; name cut at card edge, no ellipsis ("Valders Diesel & Fleet Re") | COVERED DC-19; SPEC-CONFLICT BT-D06 (DV-06) |
| V21 | Authorizer list (bt-p2-10, -11) | Opens upward, slightly wider than card; "No authorizer" one line; contacts two lines (name black, customer grey smaller); Bill To's contact last; no separator | COVERED DC-20; self-paying list DC-21 |
| V22 | Part sale card (bt-p2-17) | Bill To row after Authorizer, same style | COVERED DC-22 |
| V23 | New Work Order (bt-p2-19) | Identical to production, no Bill To | COVERED DC-23 |
| V24 | Work order on a phone (bt-p2-21) | Bill To under Authorizer; full name fits | COVERED DC-24 |
| V25 | Work Order Log (bt-p2-15) | Event "Bill To changed"; Details bold "Bill To:", names underlined blue links, black → arrow; newest first | COVERED DC-25 |
| V26 | Change Customer while deposit held (bt-p2-13) | Two-arrow icon blue (enabled) at the card's top right | OUT-OF-SCOPE as look (production control); behaviour S6-R3 settled BT-S02, cases are the case worker's |
| V27 | Invoiced card / tooltip (bt-p3-02, -03) | Read-only row looks like other read-only rows (smaller text, full name fits); tooltip dark grey under the card from x=0, over the asset title | COVERED DC-26; SPEC-CONFLICT BT-D08 (DV-08) |
| V28 | Invoiced toast (bt-p3-04) | Red toast bottom right ~400 x 87px, white warning triangle, white text, white text buttons Go To Invoice then Close on a second line | COVERED DC-27; SPEC-CONFLICT BT-D02 (DV-02) |
| V29 | Deposit card / tooltip (bt-p3-06, -07) | Same look at rest as editable; tooltip one line ~850px at the window's bottom left | COVERED DC-28; BT-D08 |
| V30 | Deposit toast, admin (bt-p3-08) | Red toast, text over 3 lines, Open Deposits then Close | COVERED DC-29; BT-D02 |
| V31 | Deposit toast, mary.moore desktop / phone (bt-p3-11, -12) | Close only, placed right of the text, vertically centred; phone toast full width, 5 lines | COVERED DC-30, DC-31; BT-D02 |
| V32 | Credit Hold banner + pill (bt-p3-14) | Red-outlined "Credit Hold" pill beside status; full-width pink banner (light red fill) under the tab bar, red text on line 1, red "Change Bill To" bottom right; no full stop | COVERED DC-32 (1440 + 1536); SPEC-CONFLICT BT-D10 (DV-10) |
| V33 | Banner on Finance (bt-p3-16) | Same banner under the Finance toolbar; toolbar unchanged; on-screen estimate shows the SERVICE FOR band and Terms "Credit Hold" | COVERED DC-33 |
| V34 | Change Bill To (bt-p3-17) | Page scrolls; list open upward over the top bar; current Bill To second | COVERED DC-34; SPEC-CONFLICT BT-D01 (DV-01), BT-D09 |
| V35 | Phone Credit Hold + Change Bill To (bt-p3-20, -21) | Pill in phone summary card; banner wraps 2 lines above line 1; Change Bill To opens details and the list (over the top bar) | COVERED DC-35 |
| V36 | Modern invoice band (bt-p4-02) | Full width under ADDRESSES box; light grey fill, thin grey border, rounded; "SERVICE FOR" small bold caps letter-spaced, name bold larger, rest regular, " · " separators; content below shifts down ~50px | COVERED DC-36 |
| V37 | Legacy invoice band (bt-p4-04) | Same band under Bill To / Remit payment to; legacy Bill To block has no phone line | COVERED DC-37; SPEC-CONFLICT BT-D05 (DV-05) |
| V38 | Estimates (bt-p4-06, -08) | Band without Unit; modern estimate has one BILL TO box (no Remit) | COVERED DC-38, DC-39 |
| V39 | Part sale with / without vehicle, both layouts (bt-p4-10..16) | Band with Unit; name-only band with no trailing separator | COVERED DC-40..DC-43 |
| V40 | Pays for itself, both layouts (bt-p4-18, -20) | No band; byte-identical to production | COVERED DC-44, DC-45 |
| V41 | Batch page 1 (bt-p4-22) | Legacy batch page 1 with band; footer "Software Powered by ShopView", "Page 1 of 7" | COVERED DC-46 (pages 2-7 not pictured, BT-N11) |
| V42 | Payer Invoices tab (bt-p5-02, -04, -06) | Column "Service For" (Title Case) after No., plain black text; earlier columns shift left; text runs up to Memo without overlap at 1440 | COVERED DC-47 (1440 + 1536) |
| V43 | Customer's own Invoices tab (bt-p5-10) | Empty, no Service For column | COVERED DC-48 |
| V44 | New Customer Payment (bt-p5-08) | Identical to production, no Service For column | COVERED DC-49 |
| V45 | Sending invoice (bt-p5-12) | One Bill To contact row ticked (name + bold email), no customer name; attachments box unticked | COVERED DC-50 |
| V46 | Payer page on phone (bt-p5-15) | Bill Invoices To + Change on one line; three counters, Pays for blue; table below the fold | COVERED DC-51 |
| V47 | Portal placeholder (bt-p5-13) | Dashed box "The customer portal could not be shot." | OUT-OF-SCOPE: not a product screen (BT-N19) |
| V48 | Edit Customer with Delete (bt-p6-02) | Bill Invoices To This customer + help line; card Pays for 1; Delete dark red | COVERED DC-52 (step 1) |
| V49 | Delete Customer window (bt-p6-05) | Stacked on top of the Confirmation; YELLOW title row, large bold title, blue x; refusal text; bulleted underlined link; Cancel (grey) then Remove As Default Bill To (blue) | COVERED DC-52 |
| V50 | Remove as default Bill To (bt-p6-06) | Third stacked window (yellow header of the one below visible); large bold sentence-case title; Cancel then Remove | COVERED DC-53; SPEC-CONFLICT BT-D04 (DV-04) |
| V51 | After Remove / result (bt-p6-07, -08) | Back on Confirmation (Cancel pale); reloaded card without Pays for | COVERED DC-54 (picture's stale counter: BT-D13) |
| V52 | Phone delete confirmation (bt-p6-10) | Production confirmation, stacked full-width buttons; phone Edit Customer help line wraps to 2 lines | OUT-OF-SCOPE as a case: unchanged production window (S12 desktop only; BT-S04); help line wrap noted |
| V53 | Asset tab toolbar (bt-p7-02) | Search, Status, chip "(building icon) Customer: All customers" ⌄, New at right; one line at 1440; whole history oldest first | COVERED DC-55 (1440 + 1536) |
| V54 | Chip panel open (bt-p7-03) | Panel under chip, right-aligned with New, covering columns; All customers ticked (blue), divider, grey help text 2 lines, rows with grey dash boxes; no search; no Apply | COVERED DC-56 |
| V55 | One picked / applied (bt-p7-04, -05) | "1 selected" grey at right of All customers; chip light blue, blue text cut with "..." | COVERED DC-57 |
| V56 | 1600 with search (bt-p7-07) | Search filled with clear x; Status; chip; New — one line | COVERED DC-58 |
| V57 | Bill To column on asset tab (bt-p7-10, -11) | Column right after Customer, blank on self-billed rows; at 1440 the last columns run off ("T" header) and the table scrolls sideways | COVERED DC-59, DC-60; SPEC-CONFLICT BT-D07 (DV-07), BT-D11 |
| V58 | Asset page on a phone (bt-p7-09) | Byte-identical to production; tab below the fold | OUT-OF-SCOPE: nothing Bill To visible in the picture |

## B. Dialogs, menus, tooltips and toasts, row by row against the PRD (§6c step 2, §6d item 2)

| Element | Title | Rows / text | Buttons (order) | PRD | Result |
|---|---|---|---|---|---|
| Bill Invoices To window | "Bill Invoices To" | help line; one field | x · Cancel · Save | S1-R3, S1-R4: help line; field; "a \"Save\" button" | help line exact; **extra Cancel** → BT-D03 |
| Pays for window | "A & J Truck & Trailer Repair pays for" | line; bulleted links | x · Close | S1-R9, S1-R10 | exact |
| Pays for tooltip | — | "Customers billed to this customer by default" | — | S1-R8 | exact |
| Bill Invoices To list (New/Edit Customer) | — | "(this customer)" first; A to Z; pick in place | — | S1-R5, S2-R4, S3-R3 | match |
| Bill To list (work order) | — | "(this customer)" first; A to Z (plain); **current Bill To second** (Change Bill To) | — | S3-R3 | **differs** → BT-D01 |
| Authorizer list | — | No authorizer; customer's contacts; Bill To's contacts; second line | — | S4-R1, S4-R2 | match |
| Invoiced tooltip | — | M4 | — | S5-R1, §8 M4 | exact; position BT-D08 |
| Invoiced toast | — | M4 | Go To Invoice · Close | S5-R2 (Go To Invoice) | **extra Close** → BT-D02 |
| Deposit tooltip | — | M1 (one deposit) | — | S5-R4, §8 M1 | exact; position BT-D08 |
| Deposit toast (admin) | — | M1 | Open Deposits · Close | S5-R5 | **extra Close** → BT-D02 |
| Deposit toast (no permission) | — | M1 | Close | S5-N2/N3 "no button"; §8 standard toast caption | **differs** → BT-D02 |
| Credit Hold banner | — | M2 | Change Bill To | S7-R6, §8 M2 | exact text; placement BT-D10 |
| Create Invoice tooltip / M2 toast | — | — | — | S7-R8, S7-R9 | NOT SHOWN (BT-N09) |
| Delete Customer window | "Delete Customer" | D8 refusal; links | Cancel · Remove As Default Bill To | S12-R1..R3, §8 D8 | exact, same order |
| Remove confirmation | "Remove as default Bill To" | D8 confirm | Cancel · Remove | S12-R4, §8 D8 ("Remove", "Cancel") | **order differs** → BT-D04 |
| Customer chip panel | — | All customers; help line; customers A to Z | none | S14-R2..R5 | match; own words LOOK-ONLY (BT-S07) |
| Sending invoice | "Sending invoice" | Bill To contacts | Send Email | S9-R1..R4 | match |
| Counter Sale toasts, save-fail toasts, payment refusals | — | — | — | §8 D3, M3, M5 | NOT SHOWN (BT-N02, BT-N13) |

## C. Letter case (L-04)

Every PRD-MATCH label in the pictures was compared with the PRD by script (`tools/build_all.py`, `letter_case`): **0** differ in
letter case ("Bill Invoices To", "This customer", "Change", "Pays for", "Bill To", "Go To Invoice", "Open Deposits", "Change Bill To",
"SERVICE FOR", "Service For", "Delete Customer", "Remove As Default Bill To", "Remove as default Bill To", "Bill To changed",
"All customers", "No authorizer"). `spec_to_design_check.py` also reports 0 letter-case-only differences.
Not Bill To (recorded, out of scope): the invoiced work order's cards read "Lead technician", "Service advisor" (production) beside
"Sales Representative" (Split Representatives work).

## D. Sizes, widths, overlap (1440 / 1536 px)

- 1440 px: no overlap seen on any Bill To element except the asset tab's Bill To column (BT-D07) and the floating elements that cover
  other content by design (lists BT-D09, tooltips BT-D08, chip panel V54). 1536 px is not pictured; cases DC-01, DC-04, DC-07, DC-32,
  DC-47, DC-55 add a 1536 px step.
- Name truncation: desktop work order card cuts long names (BT-D06); the chip label cuts with "..." (V55); the Valders card address cuts
  with "..." (production).
- Picture sizes are listed in `DESIGN-READING-RECORD.md`; three mary.moore production pictures and the two asset search pictures are 1600 wide.

## E. Design library "always / never / must" sentences (Rule 126.4)

The boards are frames of screenshots; the library CSS styles only the frames (`sv-badge`, `sv-h1`..`sv-h3`). Each sentence:

| File:line | Sentence | Class |
|---|---|---|
| components.css:16 | "can never fight an artboard's own CSS" | OUT-OF-SCOPE: library mechanics, no product look |
| components.css:79 | link-neutral "never underlined" | OUT-OF-SCOPE: component not on any Bill To screen (Bill To links are underlined blue in the pictures, which are the source) |
| components.css:105 | inner buttons "must be fully transparent" | OUT-OF-SCOPE: library mechanics |
| components.css:126-127 | input before label; placeholder | OUT-OF-SCOPE: code rule |
| components.css:270 | violet Deposit pill "never reads as Invoice (info) or Credit (warning)" | OUT-OF-SCOPE for Bill To: no Deposit row in any Bill To picture; the Invoices tab shows blue Invoice pills (V42) |
| components.css:272 | tone rules | OUT-OF-SCOPE: code rule |
| components.css:312 | tabs overflow "never wraps or scrolls" | OUT-OF-SCOPE: no Bill To tab row changes |
| components.css:356 | right-align on th and td | OUT-OF-SCOPE: code rule |
| components.css:540 | never hardcode a header height | OUT-OF-SCOPE: code rule |
| components.css:705 | display type never in product | OUT-OF-SCOPE: public pages |
| components.css:937 | SearchField "always open, bordered" | OUT-OF-SCOPE: the asset search (V56) is production's |
| components.css:1049 | placeholder "Dashed, labelled, never product" | LOOK-ONLY: the portal "Not shown" box is such a placeholder (V47), not a product screen |
| components.css:1269 | printed document "always on light paper" | COVERED: page 4 documents are light (DC-36..DC-46); no dark theme pictured |
| colors_and_type.css:106, 166, 168, 177 | display type, raw dark palette, never pure black/white, never reference primitives | OUT-OF-SCOPE: code/token rules; no dark theme pictured |
| tokens.json usage (1 sentence: Display L "One per page") | public pages | OUT-OF-SCOPE |

## F. Counts

58 screen/state rows (A): COVERED 54 (with 10 conflicts held as DV-01..DV-10), OUT-OF-SCOPE 4. 18 element rows (B): 11 match,
5 differ (BT-D01..D04, BT-D10 placement), 2 not shown. 16 library sentences (E): classified. **Unclassified 0.** Questions drafted 13,
**sent 0** (Rule 126.6: the suite is not complete until the QA lead sends them).
