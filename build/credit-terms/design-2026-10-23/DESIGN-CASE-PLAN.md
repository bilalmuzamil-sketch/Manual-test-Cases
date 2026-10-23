# Design-case plan — Credit terms (round 2, no cases written yet)

**Written 23 Oct 2026 as case keys:** DL-01 … DL-49 = `D-01` … `D-49`; DV-01 … DV-04 = `D-50` … `D-53`, in `authoring/cases_design.py`. Checklist with ticks: `DESIGN-CASE-CHECKLIST-2026-10-23.md`.

For TestRail section **"Design — how it looks"** (DESIGN 91468, group 91454), local sources `build/credit-terms/cases/design/`. Every case
title starts **"Design: "** (Rule 117, twelfth amendment), at most 80 characters, plain words. Each case: Rule 117 shape (preconditions as
{placeholders} with "For example:", one action per step, one "Step N:" result per step), the picture attached and named in the
preconditions, plain observations a tester can judge by eye at 100% zoom, the PRD quote where the PRD has one (Rule 113), otherwise the
design is the source of the look (Rule 126.5) under **"References from Design"** (board, figure heading, caption words, picture). Every
case is run at **1440 px and 1536 px** wide ("nothing overlaps or is cut off at either width"); **light theme only** (no board draws dark).
Where a drawn board and a build capture differ in look (CT-D05, question 5) the case names both pictures and says which attribute waits on
the answer. Marker: `AUTOMATION: READY` (automatable visual check) for DL cases; `AUTOMATION: HOLD - the design differs from the PRD,
waiting on the PO` for DV cases (not added to the run until released, Rule 130.5).

**Count: 49 look cases (DL-01 … DL-49) + 4 held design-version cases (DV-01 … DV-04) = 53.** Every board and all 62 figures are attached
to at least one case (map at the end).

## A · Credit Terms page and table

| Id | Working title | Picture(s) to attach | What it checks (each a plain observation) | Source of the expected look |
|---|---|---|---|---|
| DL-01 | Design: Credit Terms page and table look as designed | ct-p1-01-active-tab-one-table.png, shots/r16-m-standard.png | Finance group in the side menu with Credit Terms (clock icon, blue when open) right under Payment Methods; title left; ⋯ button then the one blue + New Credit Term top right; Active/Inactive tabs; one table without sections or card; columns Name, Due, Customers, Vendors and an unheaded ⋯ column; Customers/Vendors right aligned, 0 shown; one-line rows; info + lock icons only on COD, Due on Receipt, Credit Hold; a ⋯ on every row | PRD S1-R1, S1-R2, S1-R3, S1-R4, S1-R8, S1-R10, S1-R12, S1-R13, S1-N3; design p1 fig 1 for the look |
| DL-02 | Design: Lock and info tooltips on COD look as designed | ct-p1-01…, ct-p1-03-info-tooltip-cod.png | dark grey box, white text, no arrow, opens right of the icon over the Due text; lock tooltip two lines "Always available." / "COD, Due on Receipt and Credit Hold can't be deactivated."; COD info text | PRD S1-R8, S1-R9 (words); design p1 figs 1, 3 (look) |
| DL-03 | Design: Green success toast looks as designed | ct-p1-10-saved.png, ct-p2-05-moved.png | green box bottom right, check-circle icon, bold first line, second line, Close at the right | PRD §8 (toast with a Close action), S2-R6; design p1 fig 10 |
| DL-04 | Design: Active and Inactive tabs show counts as designed | ct-p1-01…, ct-p4-02-inactive-tab-the-rest.png | label then a rounded count pill; selected = blue text, blue underline, light-blue pill; other = grey text, grey pill | PRD S1-R3; design p1 fig 1 caption ("Tab look matches the Inspection Templates tabs in production") |
| DL-05 | Design: A 31-character term name fits on one row | shots/r15-long-name.png | "Net 45 Fleet Accounts Payable X" whole on one line at 1440 px, wraps (never cut) at 1536/narrower; its "… created" toast wraps onto two lines | PRD S1-R15, S2-R12; design p1 fig 12 |
| DL-06 | Design: Default tag shows after the term name | ct-p1-01…, ct-p1-10-saved.png, ct-p4-01… | light-blue "Default" pill after the info and lock icons on Due on Receipt / COD, right after the name on Net 30; only one row | PRD S1-R11; design p1 figs 1, 10, p4 fig 1 |
| DL-09 | Design: Inactive tab after deactivating every term looks as designed | ct-p4-01-active-tab-after-deactivating-everything-it-can.png, ct-p4-02… | Active shows only COD, Due on Receipt, the default and Credit Hold; Inactive keeps the same columns, widths and order, no icons, no tag | PRD S1-E1, S1-R14, S1-R4 ("same widths on both tabs") |
| DL-10 | Design: Empty Inactive tab shows "No inactive terms" | ct-p4-03-a-new-shop-inactive-tab-empty.png | the line "No inactive terms" and the count 0 (PRD version: in place of the table); References from Design names CT-D02 | PRD S1-N2, §8 row "Inactive tab is empty" |

## B · Row menus and the page menu (one case per menu state)

| Id | Working title | Picture(s) | What it checks | Source |
|---|---|---|---|---|
| DL-07 | Design: Row menu of an unused own term looks as designed | shots/r16-m-unused.png | items in order with icons (pencil, circle check, person, archive, trash); Move Customers greyed; divider; Delete Credit Term red; menu as wide as its items, under the ⋯ | PRD S2-R1 table, S4-N2; design p1 fig 4 |
| DL-35 | Design: Row menu of a standard term looks as designed | shots/r16-m-standard.png, shots/r16-m-move.png | Make Default, Move Customers, Deactivate; no Edit/Delete; hover = grey row; Deactivate tooltip left of the menu | PRD S2-R1, S2-N1, S2-R3; design p1 fig 5, p2 fig 1 |
| DL-45 | Design: COD row menu with no customers shows one greyed item | shots/r16-m-cod.png | only Move Customers, greyed; tooltip "No customers are on this term" left of the menu; narrow menu | PRD S1-N3, S2-N2, S4-N2; design p1 fig 6 |
| DL-46 | Design: Row menu of an own term in use greys Edit and Delete | shots/r16-m-inuse.png | Edit and Delete Credit Term greyed (Delete pale, not red); two-line "Used by …" tooltip left | PRD S2-R1, S2-R2, S2-N5; design p1 fig 7 |
| DL-47 | Design: Row menu of the default term greys Deactivate | ct-p1-08-row-menu-the-current-default.png | Move Customers, Deactivate greyed with the two-line default tooltip; no Make Default; the row highlighted | PRD S2-N4, S2-R1; design p1 fig 8 |
| DL-48 | Design: Move Customers greyed without the customer permissions | ct-p2-09-without-the-customer-permissions.png | Make Default active, Move Customers greyed, one-line permission tooltip | PRD S4-N1; design p2 fig 9 |
| DL-49 | Design: Inactive term menu shows Reactivate first | shots/r16-m-inactive.png | Inactive tab selected; Reactivate (rotate icon) then Move Customers; tooltip "Show in pickers again" left | PRD S2-R1, S2-R3, S2-R10; design p3 fig 5 |
| DL-08 | Design: Page menu shows Audit Log | shots/r16-m-page.png | ⋯ beside New Credit Term opens one item "Audit Log", no icon, under the button | PRD S12-R1; design p1 fig 13 |

## C · Dialogs

| Id | Working title | Picture(s) | What it checks | Source |
|---|---|---|---|---|
| DL-11 | Design: Make Default confirmation looks as designed | ct-p1-09-make-net-30-the-default.png | title, ×, message, Cancel (white) and Make Default (blue) right aligned, smaller rounded corners than the form windows | PRD S2-R5; design p1 fig 9 |
| DL-12 | Design: Delete Credit Term confirmation looks as designed | shots/r15-delete.png | title "Confirmation", message, Cancel, red Delete Credit Term | PRD S2-R9; design p1 fig 11 |
| DL-13 | Design: New Credit Term window with Net days looks as designed | ct-p3-01-new-credit-term-net-x-days.png | Name with hint under it; two options with their boxes and trailing words; the other box greyed; blue information line with icon; Cancel / Create Credit Term | PRD S3-R1, S3-R2, S3-R3, S3-R5; design p3 fig 1 |
| DL-14 | Design: New Credit Term window with day of month looks as designed | ct-p3-02-new-credit-term-day-of-the-following-month.png | Day box active with 10, Days box greyed and empty, blue line | PRD S3-R3, S3-R4, S3-R5; design p3 fig 2 |
| DL-15 | Design: New Credit Term errors show in red under the field | ct-p3-03-validation-errors.png | red border and red message under Name and Days; Create pale (disabled); (blue line rule per PRD, CT-D03) | PRD S3-R9, S3-R6; design p3 fig 3 |
| DL-16 | Design: Edit Credit Term window looks as designed | shots/r15-edit.png | title Edit Credit Term, filled values, Cancel / Save Changes | PRD S2-R4, S3-R1; design p3 fig 4 |
| DL-17 | Design: Move Customers window looks as designed | ct-p2-02-move-customers-from-cod.png, ct-p2-03-some-customers-unticked.png | top to bottom: search, Select All / Select None, "{n} selected" right, ticked list (tinted boxes) A to Z, Move To with hint, Cancel / Move {n} Customers; unticked boxes empty | PRD S4-R1, S4-R2, S4-R4, S4-R7; design p2 figs 2, 3 |
| DL-37 | Design: Move To dropdown lists the active terms | ct-p2-04-pick-another-term.png | opens over the list; selected row light blue; the term being moved from absent; no Default tag | PRD S4-R7, S4-N3; design p2 fig 4 |
| DL-18 | Design: Move To COD shows the $0 line under the hint | shots/r15-move-cod.png | both grey lines under Move To; Move 14 Customers | PRD S4-R7, S4-R10; design p2 fig 6 |
| DL-19 | Design: The $0 confirmation looks as designed | shots/r15-limit-confirm.png, shots/r15-limit-cancel.png | title, message, Cancel and red "Set Limits To $0 And Move"; after Cancel the window is back as it was | PRD S4-R14, S4-R15; design p2 figs 7, 8 |
| DL-20 | Design: Credit Terms Log window looks as designed | shots/r16-log.png | title left, search centred, × right; columns Event, User, Details, Date, Time; newest first; two-line edit details | PRD S12-R2, S12-R3, S12-R8; design p1 fig 14 |
| DL-21 | Design: Empty Credit Terms Log shows its empty line | shots/r15-log-empty.png | headings and "No history here. Yet." centred | PRD S12-E1; design p1 fig 15 |
| DL-38 | Design: Credit Terms Log load error looks as designed | shots/r15-log-error.png | the sentence in the table and a red alert with Close | PRD S12 Error Handling (CT-D08: caption out of date, picture = PRD v3); design p1 fig 16 |
| DL-25 | Design: Over Credit confirmation looks as it does today | shots/before-over-credit.png, ct-p8-03-still-warns-limit-above-0-exceeded.png | title, message, red Create then Cancel exactly as today's picture (CT-D06: compare with the production picture) | PRD S9-R1, S9-R3; design p8 figs 1, 3 |

## D · Customers, vendors, due dates

| Id | Working title | Picture(s) | What it checks | Source |
|---|---|---|---|---|
| DL-22 | Design: New Customer shows Credit Terms and Credit Limit side by side | shots/before-new-customer.png, ct-p5-02-new-customer-credit-terms-prefilled-with-the-def.png | two fields side by side after State/Province / Country, Credit Terms prefilled with the default, Credit Limit empty | PRD S5-R1, S5-R2; design p5 figs 1, 2 |
| DL-23 | Design: Credit Terms dropdown on New Customer looks as designed | ct-p5-03-new-customer-the-credit-terms-picker.png | same width as the field, active terms in order, Default pill on the default, selected row tinted, no hover text | PRD S5-R3, S1-R5; design p5 fig 3 |
| DL-24 | Design: Credit Limit locks at $0.00 for COD on New Customer | ct-p5-04-new-customer-cod-picked-limit-locked-at-0.png | "$ 0.00" greyed; hover text in a dark tooltip | PRD S5-R4; design p5 fig 4 |
| DL-39 | Design: New Customer without AP/AR access has no credit fields | ct-p5-05-new-customer-without-view-and-manage-ap-ar-data.png | no Credit Terms, no Credit Limit, nothing left blank in their place | PRD S5-N1; design p5 fig 5 |
| DL-26 | Design: Customer card shows a deactivated term as Inactive | shots/before-customer-page.png, ct-p6-02-customer-on-a-deactivated-term.png | "Credit term" with "Net 10 (Inactive)" under it, whole, not cut (do not compare the credit limit value: CT-D09) | PRD S5-R8, S5-R14; design p6 figs 1, 2 |
| DL-27 | Design: Edit Customer keeps the inactive term selected | shots/before-edit-customer.png, ct-p6-04-edit-customer-keeps-the-inactive-term.png | Credit Terms "Net 10 (Inactive)" beside an editable Credit Limit | PRD S5-R7, S5-R12; design p6 figs 3, 4 |
| DL-40 | Design: Credit Limit locks at $0.00 for COD on Edit Customer | ct-p6-06-edit-customer-cod-or-credit-hold-locks-the-limit.png | "$ 0.00" greyed with the hover text | PRD S5-R4, S5-R9; design p6 fig 6 |
| DL-28 | Design: Dropdown of a customer on an inactive term lists it last | ct-p6-05-this-customer-s-picker.png, ct-p7-07-edit-vendor-keeps-the-inactive-term.png | active terms in order, then "Net 10 (Inactive)" last and selected (customer drawing cut off: CT-D10; vendor picture shows the row) | PRD S5-R7; design p6 fig 5 caption, p7 fig 7 |
| DL-41 | Design: Other customers' dropdown leaves out the inactive term | ct-p6-07-any-other-customer-s-picker.png | Net 10 not in the list | PRD S5-N2; design p6 fig 7 |
| DL-29 | Design: New Vendor starts on COD with the shop's own terms | shots/before-new-vendor.png, ct-p7-02-new-vendor-starts-on-cod-picker-with-your-terms.png | COD shown, Credit Limit editable "$ 0.00", list incl. Net 10, no Default tag | PRD S6-R1, S6-R2, S6-R4; design p7 figs 1, 2 |
| DL-30 | Design: Edit Vendor dropdown looks as designed | shots/before-vendor.png, ct-p7-04-edit-vendor-the-picker-with-your-terms.png, ct-p7-08-any-other-vendor-s-picker.png | selected row tinted with a blue tick; same list and order as the customer dropdown, no Default tag; another vendor's list has no Net 10 | PRD S6-R1, S6-R2, S6-N2; design p7 figs 3, 4, 8 |
| DL-31 | Design: Edit Vendor lists the vendor's inactive term last | ct-p7-07-edit-vendor-keeps-the-inactive-term.png | ✓ "Net 10 (Inactive)" last, after Credit Hold, selected | PRD S6-R3; design p7 fig 7 |
| DL-42 | Design: Vendor card shows a deactivated term as Inactive | shots/before-vendor-page.png, ct-p7-06-vendor-on-a-deactivated-term.png | "Credit term" "Net 10 (Inactive)" whole | PRD S6-R3, S6-R6; design p7 figs 5, 6 |
| DL-32 | Design: Vendor invoice due date for a day-of-month term | shots/before-vendor-bill.png, ct-p7-10-vendor-on-10th-of-next-month-oct-5-due-nov-10.png | Invoice date Oct 5 → Due date Nov 10 in the Vendor Invoice card, layout as today | PRD S7-R2, S7-R9; design p7 figs 9, 10 |
| DL-43 | Design: Vendor invoice due date for a shop's Net term | ct-p7-11-vendor-on-net-10-oct-5-due-oct-15.png | Oct 5 → Oct 15 | PRD S7-R1, S7-R9; design p7 fig 11 |
| DL-33 | Design: Invoice shows the day-of-month term and due date | shots/before-invoice.png, ct-p9-02-10th-of-next-month-invoice-oct-5-due-nov-10.png | Due date Nov 10, 2026 under Invoice date Oct 5, 2026; Terms chip "10th of next month", whole; layout as today | PRD S7-R2, S5-R8, S5-R11; design p9 figs 1, 2 |
| DL-44 | Design: Late-month invoice is still due the next month | ct-p9-03-invoice-oct-28-still-due-nov-10.png | Oct 28 → Nov 10 | PRD S7-R2; design p9 fig 3 |
| DL-34 | Design: New Work Order for a COD customer shows no warning | ct-p8-02-cod-customer-0-limit-owes-1-200-no-warning.png | Save opens the work order; no Confirmation drawn | PRD S9-N1, S9-N2; design p8 fig 2 |
| DL-36 | Design: Over limit badge looks as it does today | shots/before-invoice.png | the red "Over Limit" pill beside Invoiced, unchanged (CT-D07: PRD writes "Over limit") | PRD S9-R2, S9 Form factor; design p9 fig 1 picture |

## E · Held design-version cases (Rule 130.5; `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO`; not in the run)

| Id | Working title | Picture | The design's version | PRD version (the PRD-following case) | Register / question |
|---|---|---|---|---|---|
| DV-01 | Design: Due on Receipt info tooltip reads as designed | ct-p1-02-info-tooltip-due-on-receipt.png | "Payment is due on the invoice date, but you can create the invoice without taking payment." | S1-R8 "Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment." | CT-D01, question 1 |
| DV-02 | Design: Empty Inactive tab keeps the column headings | ct-p4-03-a-new-shop-inactive-tab-empty.png | headings stay, the line sits inside the table | S1-N2 "in place of the table" | CT-D02, question 2 |
| DV-03 | Design: No blue line while the Name is invalid | ct-p3-03-validation-errors.png | "No sentence shows while a field is invalid." | S3-R5 the line shows while the number is valid | CT-D03, question 3 |
| DV-04 | Design: Name error shows after clicking in and out | ct-p3-03-validation-errors.png | "Errors show only after a field is touched" | S3-R10 only after typing (or Create) | CT-D04, question 4 |

CT-D05 (which picture is the reference for the look) needs no held case: no behaviour differs; the DL cases name both pictures for the
attributes listed in question 5 until it is answered. CT-D06 … CT-D10 are settled or design-silent: no held case.

## F · §6d checklist (skill 21, Rule 133)

| # | Line | Ticked by |
|---|---|---|
| 1 | every screen and state has a look case with the picture | all 37 drawn figures and 25 screenshots mapped below; DL-01 … DL-49 |
| 2 | every menu, dialog, tooltip, toast, prompt, empty state listed with rows/buttons in order and compared with the PRD | DESIGN-VISUAL-INVENTORY.md §2, §4; SPEC-TO-DESIGN-2026-10-23.json `by_hand`; differences CT-D01, CT-D02, CT-D06 |
| 3 | every label letter for letter | DESIGN-TEXT-INVENTORY (exact case); CASE-DIFFERS rows: "Set Limits to $0 and Move" (PRD's own display form), "Over Limit" (CT-D07), "NET 30"/"net 10" (data examples) |
| 4 | every design behaviour that differs has a held case and a SENT question | DV-01 … DV-04; questions 1-4 drafted, **not sent** (the QA lead sends) — line open until sent |
| 5 | both directions | text + visual inventories; spec_to_design_check.py (21 rows, all with an outcome) + by-hand list |
| 6 | sizes, colours, icons, column order, 1440 and 1536 px, no overlap, library always/never | DESIGN-VISUAL-INVENTORY.md §1-§7 (reflow 1280/1536: 0 overlaps); each DL case at 1440 and 1536 |
| 7 | every PRD look sentence has a design case | SPEC-TO-DESIGN-2026-10-23.json (each SHOWN row → DL id; NOT SHOWN rows follow the PRD text in the behaviour cases) |
| 8 | written down | DESIGN-DIVERGENCE-REGISTER.json; this file; the proof files in this folder |

## G · Every figure and screenshot is attached to a case

p1: fig1 DL-01/02/04/06 · fig2 DV-01 · fig3 DL-02 · fig4 DL-07 · fig5 DL-35 · fig6 DL-45 · fig7 DL-46 · fig8 DL-47 · fig9 DL-11 · fig10 DL-03/06 ·
fig11 DL-12 · fig12 DL-05 · fig13 DL-08 · fig14 DL-20 · fig15 DL-21 · fig16 DL-38. p2: fig1 DL-35 · fig2 DL-17 · fig3 DL-17 · fig4 DL-37 ·
fig5 DL-03 · fig6 DL-18 · fig7 DL-19 · fig8 DL-19 · fig9 DL-48. p3: fig1 DL-13 · fig2 DL-14 · fig3 DL-15/DV-03/DV-04 · fig4 DL-16 · fig5 DL-49.
p4: fig1 DL-09/06 · fig2 DL-09/04 · fig3 DL-10/DV-02. p5: fig1 DL-22 · fig2 DL-22 · fig3 DL-23 · fig4 DL-24 · fig5 DL-39. p6: fig1 DL-26 ·
fig2 DL-26 · fig3 DL-27 · fig4 DL-27 · fig5 DL-28 · fig6 DL-40 · fig7 DL-41. p7: fig1 DL-29 · fig2 DL-29 · fig3 DL-30 · fig4 DL-30 ·
fig5 DL-42 · fig6 DL-42 · fig7 DL-31/DL-28 · fig8 DL-30 · fig9 DL-32 · fig10 DL-32 · fig11 DL-43. p8: fig1 DL-25 · fig2 DL-34 · fig3 DL-25.
p9: fig1 DL-33/DL-36 · fig2 DL-33 · fig3 DL-44. All 62 figures (25 screenshots included) attached.
