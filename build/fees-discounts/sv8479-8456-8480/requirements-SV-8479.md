# SV-8479 — Ingest Requirements (Fees & Discounts UI corrections, #2)

> **Source (pointer only — do NOT fetch):** https://shopview.atlassian.net/browse/SV-8479
> **Ingest date:** 2026-07-22 · built ENTIRELY from local capture `/tmp/fd-tickets/SV-8479/` (no Jira login/network).
> **Project:** Fees & Discounts · **Epic:** SV-7387 · **PO:** Chris Ward.

## Issue metadata
| Field | Value |
|---|---|
| Key | **SV-8479** |
| Summary | F&D UI corrections, #2 -- table verbiage, entry point placement, badge removal |
| Issue type | **Story Defect** |
| Status | **REJECTED FROM TESTING** (re-opened 2026-07-22 for item #1 only; see comments) |
| Resolution | None |
| Priority | Medium |
| Reporter | **Chris Ward** |
| Creator | Chris Ward |
| Assignee | **Nikola Milosevic** |
| Parent | **SV-8288** — "Story 12: Visual rules" |
| Created | 2026-07-21 19:15 (-0500) |
| Updated | 2026-07-22 11:37 (-0500) |
| Predecessor | **SV-8456** (F&D UI corrections #1, Done) — this is the second pass |

---

## SCOPE HEADLINE — what SV-8479 requires (plain terms)

SV-8479 is a **frontend-only, second pass** of Fees & Discounts UI corrections. Backend/calculations are unaffected — every item is a label, placement, or styling change. **Items 1–12 are on the Work Order screen; items 13–20 are on the Parts Sale screen.** The PO's design screenshots are the source of truth where they differ from prose.

Concrete changes required (each tied to its evidence):

**Work Order (items 1–12)**
- **1. Labor fee/discount entry-point placement + label.** Move the add entry point to a three-dot menu on the **left of the first assigned technician** (or "Unassigned" when none); menu item reads **"Add Labor Fee / Discount"**. *(Picture 1 red→green 58831; QA staging 58861 — QA confirms label but flags it landed to the RIGHT of Unassigned → the only re-open reason.)*
- **2. Part-row menu label.** Work-order part-row three-dot item must read **"Add Part Fee / Discount"** (currently "Add Fee / Discount"). *(Picture 2 red 58818 → green 58808; QA 58868 ✅)*
- **3. Blank the left-column label.** The left-column row label **"Fees/Discounts"** under a labor line must be **blank (no label)**. *(Picture 3 red 58814 → Picture 4 green 58830; QA 58877 ✅)*
- **4. Remove badges on labor/part line amounts → plain text.** Line-level fee/discount amounts must render as **plain text, no colored badges/pills**: percentage discounts show **"−X%"**, fees show **"X%"** (no sign). *(Picture 3 red 58814 → Picture 4 green 58830; QA 58862 ✅)*
- **5. Remove badge in the WO Fees & Discounts card → plain text.** Adjustment shows name + percentage in brackets on the same line as the amount — discount **"(−5%)"**, fee **"(5%)"**; flat-amount adjustments show **name alone (no brackets)**. Example **"Military Discount (−5%) −$17.25"**. *(Picture 5 red 58826 → Picture 6 green 58806; QA 58864 ✅ shows "Discount (−4%) −$20.89")*
- **6. Add/fix the WO card disclaimer.** WO Fees & Discounts card must show **"Applies to the whole work order, after all other fees & discounts."** *(Picture 7 green mockup 58807; QA 58869 ✅)*
- **7. Move the WO Financial-Info F&D line above Subtotal.** "Fees & Discounts (N)" line must render **directly above Subtotal** (currently at the bottom below Balance), amount aligned in the same column; **hidden when zero**. *(Picture 8 red 58816 → Picture 9 green 58810; QA 58875 ✅)*
- **8. Labor modal title/subline.** Title **"New Labor Fee / Discount"**; subline **"Applying To: Line {N} Labor — {line name}"** (e.g. "Line 1 Labor — Replace Brake Pots"). Was "Add new fee/discount" / "Applying to: {line name}". *(Picture 10 red 58828 → Picture 11 green 58803; QA 58859 ✅)*
- **9. Part modal title/subline (WO).** Title **"New Part Fee / Discount"**; subline **"Applying To: Line {N} Part — {part name}"** (e.g. "Line 1 Part — (Bolt1) Bolts (Assorted)"). *(Picture 12 red 58811 → Picture 13 green 58801; QA 58867 ✅)*
- **10. WO toolbar menu label.** Toolbar three-dot item must read **"Add Work Order Fee / Discount"** (label only, order unchanged). Was "Add Fee/Discount". *(Picture 14 red 58812 → Picture 15 green 58815; QA 58863 ✅)*
- **11. WO whole-order modal title/subline.** Title **"New Work Order Fee / Discount"**; subline **"Applying To: Entire Work Order"**. Was "Add new fee/discount" with no subline. *(Picture 16 red 58800 → Picture 17 green 58809; QA 58870 ✅)*
- **12. WO Stats column headings.** Fees & Discounts section on WO → Stats must show right-side headings **"%"** and **"Amount"** (in that order), matching other Stats sections; blank % cell for flat fees. Was missing. *(Picture 18 red 58817 → Picture 19 green 58804; QA 58858 ✅)*

**Parts Sale (items 13–20)**
- **13. Remove the "+ Add" button.** Parts-sale parts table Fees & Discounts column must **drop the redundant "+ Add" button**; entry points remain the per-row three-dot ("Add Part Fee / Discount") and the top-right three-dot (whole parts sale). Column stays and still shows existing fees. *(Picture 20 red 58822; QA 58873 ✅)*
- **14. Per-part menu label (parts sale).** Per-part three-dot item must read **"Add Part Fee / Discount"** (identical to WO item 2). Was "Add Fee / Discount". *(Picture 21 red 58802/58818-style → QA 58874 ✅)*
- **15. Remove badge in Parts Sale card → plain text.** Same convention as item 5 (brackets for %, sign per fee/discount, name-only for flat); dollar stays inline. Example **"TEST +$50.00"**. *(Picture 22 red 58813; QA 58871 ✅ shows "Part Fee (11%) +$2.65" / "New Processing Fee (10%) +$2.53")*
- **16. Remove badges in parts-sale table column → plain text.** Values as plain text (no badges), item-5 sign convention: fees **"10%"** (no sign), discounts **"−X%"**; overflow count **"+2"/"+1"** stays. *(Picture 23 red 58820; QA 58860 ✅ shows "Fee 10% +1")*
- **17. Add Parts Sale Financial-Info F&D line above Subtotal.** Parts Sale Financial Info card must show a **"Fees & Discounts (N)"** line with its total **directly above Subtotal**, matching the WO card (item 7); hidden when zero. *(Picture 24 green 58827; QA 58865 ✅)*
- **18. Parts-sale per-part modal title.** Title **"New Part Fee / Discount"**; subline unchanged **"Applying to: Part — {part}"** (parts sales have no lines, so no "Line N"). Was "Add new fee/discount". *(Picture 25 red 58805; QA 58866 ✅)*
- **19. Parts-sale whole-sale modal title + new subline.** Title **"New Parts Sale Fee / Discount"**; ADD subline **"Applying To: Entire Parts Sale"** (same format as item 11). Was "Add new fee/discount". Entry point = top-right three-dot → "Add Parts Sale Fee / Discount". *(Picture 27 red 58824; QA 58872=dup of 58866 marked ✅)*
- **20. Parts-sale Statistics column headings.** Fees & Discounts section on Parts Sale → Statistics must show the same **"%"** and **"Amount"** headings, per item 12. *(No PO picture — mirrors item 12; QA 58876 ✅)*

**QA verdict (staging, 2026-07-22, Ahtasham Amjad):** 19 of 20 items pass; **only item #1 fails** — the labor entry-point landed to the **right** of "Unassigned" but the expected position is the **left** of "Unassigned". Ticket re-opened for that single fix; everything else looks good.

**Regression preserves (from NOTES):** the **jurisdiction tax note** in the dialogs ("Tax treatment varies by jurisdiction — confirm your local requirements before saving.") and the **"Pass convenience fee to customer"** banner must remain.

---

## DESCRIPTION (verbatim)

**PRODUCT AREA**
Settings / Work Orders / Customers / Fees & Discounts

**ENVIRONMENT**
Local / dev — follow-up to SV-8456 Done (F&D UI corrections #1). Frontend-only; backend unaffected. The product owner's design screenshots are the source of truth where they differ from the written spec.

**DESCRIPTION**
Second pass of Fees & Discounts UI corrections. Each item below either did not fully land in SV-8456 Done or was newly spotted during handoff review. All frontend-only. Actual and Expected are numbered 1–20 and paired: item N in Actual maps to item N in Expected. Items 1–12 are on the Work Order screen; items 13–20 are on the Parts Sale screen.

**STEPS TO REPRODUCE**

1. Open a Work Order → Lines tab; view labor and part lines carrying fees/discounts, the Work Order Fees & Discounts side card, and the Financial Info card.
2. On the Work Order, open the toolbar three-dot menu.
3. Open the Work Order → Stats tab; scroll to the Fees & Discounts section.
4. Add a fee/discount at each level (labor line, part, whole work order) to view each modal.
5. Open Parts → Parts Sales → a parts sale; view the parts table, the Parts Sale Fees & Discounts card, and the Financial Info card.
6. On the parts sale, open a per-part three-dot menu and the top-right three-dot menu; open each add-fee/discount modal.
7. Open the parts sale → Statistics tab; scroll to the Fees & Discounts section.

**ACTUAL RESULT (MISSES)**

**Work Order**

1. The entry point to add a labor-line fee/discount lives on the work-order line's three-dot menu. (Picture 1, red)
2. On a work-order part row, the three-dot menu item to add a fee/discount reads "Add Fee / Discount". (Picture 2)
3. Under a labor line, the left-column row label "Fees/Discounts" renders. (Picture 3, red)
4. Labor- and part-line fee/discount amounts render as colored badges/pills (e.g. $25.00, −50%, +50%, $50.00). (Picture 3, red)
5. In the Work Order Fees & Discounts card, the adjustment's percentage renders as a colored badge/pill (e.g. −5%) below the name. (Picture 5, red)
6. The Work Order Fees & Discounts card shows no applies-to disclaimer (the Parts Sale card has one).
7. In the Financial Info card, the "Fees & Discounts (N)" line renders at the bottom of the card, below Balance. (Picture 8, red)
8. The labor-line fee/discount modal title reads "Add new fee/discount"; subline reads "Applying to: {work order line name}". (Picture 10, red)
9. The part fee/discount modal title reads "Add new fee/discount"; subline reads "Applying to: {part name}". (Picture 12, red)
10. The work-order-level add entry point in the toolbar three-dot menu reads "Add Fee/Discount". (Picture 14, red)
11. The Add Work Order Fee/Discount modal title reads "Add new fee/discount" with no subline. (Picture 16, red)
12. On Work Order → Stats, the Fees & Discounts section renders its rows/values but is missing its right-side column headings ("%" and "Amount"). (Picture 18, red)

**Parts Sale**

13. On the parts-sale parts table, the Fees & Discounts column shows a "+ Add" button on part rows with no fee yet. (Picture 20, red)
14. On the parts-sale table, the per-part three-dot menu item reads "Add Fee / Discount". (Picture 21, red)
15. In the Parts Sale Fees & Discounts card, the adjustment amount renders as a colored badge/pill (e.g. $50.00). (Picture 22, red)
16. In the parts-sale parts table's Fees & Discounts column, values render as colored badges/pills — the fee percentage (e.g. +10%) and the overflow count (e.g. +2) _Context: The text is fine, the badges are not intended_. (Picture 23, red)
17. The Parts Sale Financial Info card does not present a "Fees & Discounts (N)" line directly above Subtotal.
18. On the parts-sale per-part modal, the title reads "Add new fee/discount". (Picture 25, red)
19. On the whole-parts-sale modal (top-right three-dot → "Add Parts Sale Fee / Discount"), the title reads "Add new fee/discount". (Picture 27, red)
20. On Parts Sale → Statistics, the Fees & Discounts section is missing the same "%" and "Amount" column headings.

**EXPECTED RESULT**

**Work Order**

1. The labor-line fee/discount entry point moves to a three-dot menu on the left of the first assigned technician (or "Unassigned" when none is assigned); the add menu item reads "Add Labor Fee / Discount". (Picture 1, green)
2. The part menu item reads "Add Part Fee / Discount". (Picture 2)
3. The left-column "Fees/Discounts" label is blank (no label). (Picture 4, green)
4. Labor- and part-line fee/discount amounts render as plain text, no badges: percentage-based discounts show "−X%", fees show "X%" (no sign). (Picture 4, green)
5. The adjustment renders as plain text: name followed by the percentage in brackets on the same line as the amount — discount "(−5%)", fee "(5%)"; flat-amount adjustments show the name alone (no brackets). Example: "Military Discount (−5%) −$17.25". (Picture 6)
   _Context note on Picture 6: the shot shows the label as "(5%)"; it illustrates the plain-text format only. Because this value is a discount, it must render as "(−5%)" per the sign rule (discounts prefixed "−", fees no sign)._
6. The Work Order Fees & Discounts card shows the disclaimer: "Applies to the whole work order, after all other fees & discounts." (Picture 7, green — mockup)
7. The "Fees & Discounts (N)" line renders directly above Subtotal, with its total (positive or negative) aligned in the same amount column as the other lines. The line is hidden when there are zero fees/discounts. _Context: the total sum, whether positive or negative, SHOULD be shown on the right side – just not included in this picture._ (Picture 9, green)
8. Title reads "New Labor Fee / Discount"; subline reads "Applying To: Line {N} Labor — {line name}" (e.g. "Line 1 Labor — Replace Brake Pots"), where {N} is the line's position on the work order. (Picture 11, green)
9. Title reads "New Part Fee / Discount"; subline reads "Applying To: Line {N} Part — {part name}" (e.g. "Line 1 Part — (Bolt1) Bolts (Assorted)"). (Picture 13, green)
10. The toolbar three-dot menu item reads "Add Work Order Fee / Discount" (label only — menu order unchanged). (Picture 15, green)
11. Title reads "New Work Order Fee / Discount"; subline reads "Applying To: Entire Work Order". (Picture 17, green)
12. The Fees & Discounts section shows the right-side column headings "%" and "Amount" (in that order), aligned above their value columns, matching the header treatment of the other Stats sections. _Context – as you can see, a row will be blank if it's a flat fee rather than a percentage._ (Picture 19, green)

**Parts Sale**

13. The "+ Add" button is removed (redundant double entry point). Entry points remain: the per-row three-dot menu (fee/discount that part) and the top-right three-dot menu (fee/discount the whole parts sale). The Fees & Discounts column stays and still displays existing part fees. (Picture 20)
14. The per-part three-dot menu item reads "Add Part Fee / Discount" (identical to the Work Order part row, item 2). (Picture 21)
15. Renders as plain text using the same convention as item 5 (brackets for percentage, sign per fee/discount, name-only for flat); dollar amount stays in line. _Context: please remove badges._ Pictured flat fee → "TEST +$50.00". (Picture 22 shows current/red)
16. Values render as plain text (no badges), using the item-5 sign convention: fees show "10%" (no sign), discounts show "−X%"; the overflow count "+2" stays as-is. (Picture 23 shows current/red)
17. The Parts Sale Financial Info card shows a "Fees & Discounts (N)" line with its total (positive or negative) directly above Subtotal, exactly matching the Work Order Financial Info card (item 7). Hidden when zero. _Context: Identical to the financial info card on work orders, this picture does not show the actual amount on the right (which we need to show)._ (Picture 24, green)
18. Title reads "New Part Fee / Discount". Subline is unchanged ("Applying to: Part — {part}") — parts sales have no lines, so no "Line N" reference. (Picture 25)
19. Title reads "New Parts Sale Fee / Discount"; add a subline "Applying To: Entire Parts Sale" (same format as item 11). (Picture 26 shows the three-dot context; Picture 27 shows current/red)
20. The Fees & Discounts section shows the same "%" and "Amount" column headings, exactly per item 12. (No picture — mirrors item 12.)

**NOTES**

- Follow-up to SV-8456 Done. Frontend-only.
- Labor fee/discount strings use "Labor" (no "Line") across the menu item, add dialog, and edit dialog — for symmetry with "Part".
- Percentage sign convention (items 4, 5, 15, 16): percentage-based discounts are prefixed "−", fees carry no sign; flat-amount adjustments show the name alone with no brackets. Applies to the WO card, WO line-level, parts-sale card, and the parts-sale table column.
- WO card disclaimer (item 6): the card already carries a scope note; this defect updates the copy to "…after all other fees & discounts." and ensures it renders. Picture 7 is a mockup.
- Financial Info F&D line (items 7, 17): amount rendering is existing/expected behavior — the green mockups (Pictures 9, 24) intentionally omit the dollar amount. The defect is placement (directly above Subtotal) and hiding the line when zero.
- Preserve (regression check): the jurisdiction tax note in the dialogs and the "Pass convenience fee to customer" banner.

---

## COMMENTS (verbatim, in order)

### Comment 1 — Nikola Milosevic — 2026-07-22 10:10:03 (-0500)
> @Ahtasham Amjad this one is merged and ready for testing on stage

### Comment 2 — Ahtasham Amjad — 2026-07-22 11:35:11 (-0500)
> **Env**: Staging
>
> **QA Result:**
>
> 1. The labor-line fee/discount entry point reads "Add Labor Fee / Discount" ✅
>    However, it is moved to right of unassigned 🔴
>    **Expected:** Should be on the left of unassigned *(image 58861)*
> 2. The part menu item reads "Add Part Fee / Discount" ✅ *(image 58868)*
> 3. The left-column "Fees/Discounts" label is blank (no label) ✅ *(image 58877)*
> 4. Labor- and part-line fee/discount amounts render as plain text, no badges: percentage-based discounts show "−X%", fees show "X%" (no sign) ✅ *(image 58862)*
> 5. The adjustment renders as plain text: name followed by the percentage in brackets on the same line as the amount — discount "(−5%)", fee "(5%)"; flat-amount adjustments show the name alone (no brackets). Example: "Military Discount (−5%) −$17.25". ✅ *(image 58864)*
> 6. The Work Order Fees & Discounts card shows the disclaimer: "Applies to the whole work order, after all other fees & discounts." ✅ *(image 58869)*
> 7. The "Fees & Discounts (N)" line renders directly above Subtotal, with its total (positive or negative) aligned in the same amount column as the other lines. The line is hidden when there are zero fees/discounts. *(image 58875)*
> 8. Title reads "New Labor Fee / Discount"; subline reads "Applying To: Line {N} Labor — {line name}" ✅ *(image 58859)*
> 9. Title reads "New Part Fee / Discount"; subline reads "Applying To: Line {N} Part — {part name}" *(image 58867)*
> 10. The toolbar three-dot menu item reads "Add Work Order Fee / Discount" (label only — menu order unchanged) ✅ *(image 58863)*
> 11. Title reads "New Work Order Fee / Discount"; subline reads "Applying To: Entire Work Order". *(image 58870)*
> 12. The Fees & Discounts section shows the right-side column headings "%" and "Amount" (in that order), aligned above their value columns, matching the header treatment of the other Stats sections. *(image 58858)*
> 13. The "+ Add" button is removed (redundant double entry point). Entry points remain: the per-row three-dot menu (fee/discount that part) and the top-right three-dot menu (fee/discount the whole parts sale) *(image 58873)*
> 14. The per-part three-dot menu item reads "Add Part Fee / Discount" (identical to the Work Order part row, item 2) ✅ *(image 58874)*
> 15. Renders as plain text using the same convention as item 5 (brackets for percentage, sign per fee/discount, name-only for flat); dollar amount stays in line ✅ *(image 58871)*
> 16. Values render as plain text (no badges), using the item-5 sign convention: fees show "10%" (no sign), discounts show "−X%"; the overflow count "+2" ✅ *(image 58860)*
> 17. The Parts Sale Financial Info card shows a "Fees & Discounts (N)" line with its total (positive or negative) directly above Subtotal, exactly matching the Work Order Financial Info card (item 7). Hidden when zero. _Context: Identical to the financial info card on work orders_ ✅ *(image 58865)*
> 18. Title reads "New Part Fee / Discount". Subline is unchanged ("Applying to: Part — {part}") — parts sales have no lines, so no "Line N" reference ✅ *(image 58866)*
> 19. Title reads "New Parts Sale Fee / Discount"; add a subline "Applying To: Entire Parts Sale" ✅ *(image 58872 = dup of 58866)*
> 20. The Fees & Discounts section shows the same "%" and "Amount" column headings ✅ *(image 58876)*
>
> **Re-opening** this for a minor change for **Point#1**, Rest looks good @Nikola Milosevic
> cc: @Chris Ward

---

## ATTACHMENTS (all 54 — 46 unique + 8 byte-identical duplicates)

Images copied into the repo live in `attachments/SV-8479/`. All are ShopView app-UI screenshots; none show credentials/passwords/OTP/email inboxes. (A few carry a browser bookmark bar with folder names — Mail/Jira/GitHub/QuickBooks/TestRail/Custom Roles/Production — and staging work-order URLs; neither is a secret.)

### Description "Picture" series — PO before/after (RED = current/bug, GREEN = expected)

| # | File (repo) | ~Size | UI state described |
|---|---|---|---|
| 58831 | Picture 01 - item 1 - labor entry (red+green) | 49 KB | WO Lines tab. **Item 1.** Line 1 "TEST" (Approved). Under Labor row "Unassigned" a three-dot menu is open showing **"Edit labor"** and **"Add Labor Fee / Discount"** (green callout box + green arrow pointing at the three-dot on the LEFT of Unassigned). Red box highlights the line number "1". Shows the target placement of the labor add-menu. |
| 58818 | Picture 02 - item 2 - WO part menu RED (Add Fee-Discount) | 18 KB | WO Parts row "(PART W/ FEE) Turbocharger Oil" with sub-line "test (+11%)". Per-part three-dot menu open showing **Move / Return / Add Fee/Discount** — red box + red arrow on **"Add Fee/Discount"** (the current wrong label). |
| 58808 | Picture 02 - item 2 - WO part menu green | 4 KB | Tight crop of the WO part three-dot menu with green box around **"Add Part Fee / Discount"** (the expected label) beside "Move". |
| 58814 | Picture 03 - items 3-4 - WO labor-parts RED | 111 KB | Full WO Lines view (Admin ShopView / Chris Ward Test / S9). **Current/bug.** Left-column label **"Fees/Discounts"** rendered (red box); Labor sub-line "Towing Fee $25.00" and Parts sub-lines "Test −50% / Test2 +50% / Test $50.00" — all as **grey badges/pills** (red boxes). WO Fees & Discounts card "Military Discount −5% −$17.25". Financial Info: Parts $20 / Labor $250 / Shop Supplies $0 / Subtotal $327.75 / GST $16.39 / Total $344.14 / Balance $344.14 / **Fees & Discounts (5) $57.75** (at bottom). |
| 58830 | Picture 04 - items 3-4 - WO labor-parts GREEN | 72 KB | Same WO (Matt Holst / Chris W Test / Valley). **Expected.** Green box around the labor+parts block: left-column label is **blank**; amounts are **plain text** — Labor "yes! 1% / NO! 2%", Parts "TESTY 1212% / 123 1% / Tier 1 pricing discount −15% / Tier 1 pricing discount −15%". WO card "TEST $12.00 / $12.00". Financial Info shows **"All Fees & Discounts (7)"** collapsible then Subtotal $228.70 / Zero Tax $0 / Total $228.70 / Balance $228.70. |
| 58826 | Picture 05 - item 5 - WO card RED badge | 113 KB | Full WO. **Current/bug.** Red box around WO Fees & Discounts card row **"Military Discount"** with the **"−5%" grey badge** below the name and "−$17.25" at right. |
| 58806 | Picture 06 - item 5 - WO card GREEN (discount must show -5pct) | 5 KB | Tight crop of WO Fees & Discounts card: **"Military Discount (5%)   −$17.25"** as plain text (percent in brackets, inline). Illustrates format only; per sign rule this discount must render "(−5%)". |
| 58807 | Picture 07 - item 6 - WO card disclaimer GREEN mockup | 8 KB | Mockup of WO Fees & Discounts card: **"TEST   +$50.00"** and below the disclaimer **"Applies to the whole work order, after all other fees & discounts."** (green border = mockup). |
| 58816 | Picture 08 - item 7 - WO Financial Info RED | 119 KB | Full WO. **Current/bug.** Red box + red arrow to Financial Info bottom row **"Fees & Discounts (5)   $57.75"** rendered BELOW Balance ($344.14). |
| 58810 | Picture 09 - item 7 - WO Financial Info GREEN | 14 KB | Crop of Financial Info card, **expected order:** Parts $5 / Labor $135 / Shop Supplies $13.50 / **Fees & Discounts (7)** (green arrow) / Subtotal $228.70 / Zero Tax $0 / Total $228.70 / Balance $228.70 — F&D line now directly ABOVE Subtotal (amount intentionally omitted in mockup). |
| 58828 | Picture 10 - item 8 - Labor modal RED | 20 KB | Add-fee modal. **Current/bug.** Red box around title **"Add new fee/discount"** + subline **"Applying to: Tow vehicle into shop"**. Fields: Name, Type=Fee, Calculation Type=% Of Labor Total, Percent, Max Amount (Optional), Taxable=Yes, jurisdiction note, "Enter an amount to see the impact.", Cancel / Add Fee. |
| 58803 | Picture 11 - item 8 - Labor modal GREEN | 100 KB | Add-fee modal over WO (Line 1 "Replace brake pots"). **Expected.** Green box around title **"New Labor Fee / Discount"** + subline **"Applying To: Line 1 Labor — Replace Brake Pots"**. Includes "Apply From Template (Optional)" dropdown + "Showing templates compatible with this line", Name (required, red), Type=Fee, Calc Type=% of Labor Total, Percent, Max Amount, Taxable=Yes. |
| 58811 | Picture 12 - item 9 - WO part modal RED | 131 KB | Add-fee modal on WO part "Turbocharger Oil" (browser chrome visible, URL app.staging.shopview.com/workorders/…/lines). **Current/bug.** Red box around title **"Add new fee/discount"** + subline **"Applying to: Turbocharger Oil"**. Calc Type=% Of Parts Total. |
| 58801 | Picture 13 - item 9 - WO part modal GREEN | 44 KB | Add-fee modal on WO part "(Bolt1) Bolts (assorted)". **Expected.** Green box around title **"New Part Fee / Discount"** + subline **"Applying To: Line 1 Part — (Bolt1) Bolts (Assorted)"**. |
| 58812 | Picture 14 - item 10 - WO toolbar menu RED | 30 KB | WO toolbar three-dot menu open. **Current/bug.** Items: Audit Log / Timesheets (0) / **Add Fee/Discount** (red box) / Delete Work Order. Red arrow to the three-dot. |
| 58815 | Picture 15 - item 10 - WO toolbar menu GREEN | 20 KB | WO toolbar three-dot menu. **Expected.** Green box around **"Add Work Order Fee / Discount"** at top, then Audit Log / Timesheets (0) / Delete Work Order. Also visible: Customer PO, Add Deposit, Create Invoice buttons. |
| 58800 | Picture 16 - item 11 - WO whole modal RED | 19 KB | Whole-WO add modal. **Current/bug.** Red box around title **"Add new fee/discount"** (no subline). Fields: Apply From Template, Name, Type=Fee, Calc Type=Flat Amount, Amount, Taxable=Yes, jurisdiction note, Cancel / Add Fee. |
| 58809 | Picture 17 - item 11 - WO whole modal GREEN | 51 KB | Whole-WO add modal over an invoice-style view. **Expected.** Green box around title **"New Work Order Fee / Discount"** + subline **"Applying To: Entire Work Order"**. Apply From Template (Optional), Name (required, blue), Type=Fee, Calc Type=Flat Amount, Amount, Taxable=Yes. |
| 58817 | Picture 18 - item 12 - WO Stats RED | 113 KB | WO → Stats tab (S9-25782, Over Limit). **Current/bug.** Red box + arrows around **Fees & Discounts (2)** section: rows "test +$2.20 +11%", "ttt +$50.00 +20%", "Total +$52.20" — but the section has **no "%"/"Amount" column headings** (unlike Labor/Parts/Total sections above which show Sell price/Cost/Margin/%). |
| 58804 | Picture 19 - item 12 - WO Stats GREEN | 102 KB | WO → Stats tab. **Expected.** Green box around the F&D section right columns showing headings **"%"** and **"Amount"**, rows: TEST (blank%) +$12.00 / yes! +1% +$1.35 / NO! +2% +$2.70 / TESTY +1212% +$60.60 / 123 +1% +$0.05 / Tier 1 pricing discount −15% −$0.75 (×2) / Total +$75.20. |
| 58822 | Picture 20 - item 13 - parts-sale table +Add RED | 91 KB | Parts Sale P9-1114 (Estimate/Over Limit). **Current/bug.** Row 1 "3/8" BRASS TUBE 90° ELBOW" F&D column shows "Enviro Fee +10% +2" badges; **Row 2 "#04 BSPP REPLACEMENT O-RING" F&D column shows a "+ Add" button** (red box) — the redundant entry point to remove. Parts Sale Fees & Discounts card "TEST $50.00 +$50.00" + disclaimer "Applies to the whole parts sale, after all part-line fees & discounts." |
| 58802 | Picture 21 - item 14 - parts-sale part menu RED | 109 KB | Parts Sale P9-1114. Per-part three-dot menu (Actions) open on row 1 with red box + arrow showing **"Add Fee / Discount"** (current label). NOTE: label here already reads "Add Fee / Discount"; the expected is "Add Part Fee / Discount" (item 14). |
| 58813 | Picture 22 - item 15 - parts-sale card RED badge | 91 KB | Parts Sale P9-1114. **Current/bug.** Red box around Parts Sale Fees & Discounts card row **"TES[T] $50.00"** where "$50.00" is a **grey badge**; "+$50.00" at right. |
| 58820 | Picture 23 - item 16 - parts-sale table column RED | 93 KB | Parts Sale P9-1114. **Current/bug.** Red box around row-1 Fees & Discounts column **"Enviro Fee +10% +2"** where "+10%" and "+2" are **grey badges/pills**. |
| 58827 | Picture 24 - item 17 - parts-sale Financial Info GREEN | 12 KB | Crop of Parts Sale Financial Info card, **expected:** Parts $29.00 / **Fees & Discounts (6)** (green arrow) / Subtotal $30.80 / Zero Tax $0 / Total $30.80 / Balance $30.80 — F&D line directly above Subtotal (amount omitted in mockup). |
| 58805 | Picture 25 - item 18 - parts-sale part modal RED | 108 KB | Parts Sale P9-1114 per-part add modal. **Current/bug.** Red box around title **"Add new fee/discount"** + subline **"Applying to: Part — (1465-6) 3/8" BRASS TUBE 90° ELBOW FOR NYLON DOT"**. Type=Fee, Calc Type=% Of Parts Total, Percent, Max Amount, Taxable=Yes. |
| 58824 | Picture 27 - item 19 - parts-sale whole modal RED | 106 KB | Parts Sale P9-1114 whole-sale add modal. **Current/bug.** Red box around title **"Add new fee/discount"** (no subline). Type=Fee, Calc Type=Flat Amount, Amount, Taxable=Yes, jurisdiction note, Cancel / Add Fee. |

### QA staging verification series — Ahtasham Amjad, 2026-07-22 (all on `app.staging.shopview.com`)

| # | File (repo) | ~Size | UI state described |
|---|---|---|---|
| 58861 | QA-staging-item01 | 196 KB | WO 3996683a… Lines. Labor "Unassigned" three-dot open, menu **"Add Labor Fee / Discount"** (green box). Red box on the three-dot with red annotation **"Move it to left of unassigned"** — the three-dot sits to the RIGHT of "Unassigned" (the failing item). WO Fees & Discounts card "Fee +$500,000.00" + disclaimer present. |
| 58868 | QA-staging-item02 | 121 KB | WO part row "(N68SL-356) … SPRING LOADED T-BOLT CLAMP" per-part three-dot open: Move / **Add Part Fee / Discount** (green box). ✅ |
| 58877 | QA-staging-item03 | 72 KB | WO Lines. Green boxes around Labor block "Fee 10% / Discount $11.00" and Parts block "Name $11.00 / Fee −11%" — **left-column label blank**, amounts plain text. ✅ |
| 58862 | QA-staging-item04 | 49 KB | Crop of WO card **"Fee +$500,000.00"** and **"Discount (−4%)  −$20.89"** — plain text, no badges. ✅ |
| 58864 | QA-staging-item05 | 10 KB | Tight crop of WO Fees & Discounts card: **"Fee +$500,000.00"** and **"Discount (−4%)  −$20.89"** — plain-text bracket/sign format. ✅ |
| 58869 | QA-staging-item06 | 16 KB | WO Fees & Discounts card with green box around the disclaimer **"Applies to the whole work order, after all other fees & discounts."** ✅ |
| 58875 | QA-staging-item07 | 25 KB | WO Financial Info crop: Parts $21.74 / Labor $464.86 / Shop Supplies $48.81 / **Fees & Discounts (6) $500,045.21** (green box) / Subtotal $500,580.62 / GST $29.03 / Total $500,609.65 / Balance — F&D above Subtotal. ✅ |
| 58859 | QA-staging-item08 | 109 KB | WO add modal, green box: title **"New Labor Fee / Discount"** + subline **"Applying To: Line 1 Labor — Nmwnwn"**. Calc Type=% Of Labor Total. ✅ |
| 58867 | QA-staging-item09 | 86 KB | WO add modal, green box: title **"New Part Fee / Discount"** + subline **"Applying To: Line 1 Part — 3.50-3.82" (89-97mm) SPRING LOADED T-BOLT CLAMP"**. ✅ |
| 58863 | QA-staging-item10 | 91 KB | WO toolbar three-dot menu (green box): **"Add Work Order Fee / Discount"** at top, then Audit Log / Timesheets (0) / Delete Work Order. ✅ |
| 58870 | QA-staging-item11 | 57 KB | WO whole-order add modal (green box): title **"New Work Order Fee / Discount"** + subline **"Applying To: Entire Work Order"**. Apply From Template, Type=Fee, Calc Type=Flat Amount, Amount, Taxable=Yes. ✅ |
| 58858 | QA-staging-item12 | 131 KB | WO → Stats. Green box around F&D section headings **"%" / "Amount"**; rows Fee +10% +$46.49 / Discount +$11.00 / Name +$11.00 / Fee −11% −$2.39 / Fee +$500,000.00 / Discount −4% −$20.89 / Total +$500,045.21. ✅ |
| 58873 | QA-staging-item13 | 141 KB | Parts Sale P9-1115 (Approved). Green box around Vendor/Requested At/Status/**Fees & Discounts**/Actions columns; part "Ahtasham new catalog" shows F&D "Parts Fee 11%" with **NO "+ Add" button** on the fee-less area. ✅ |
| 58874 | QA-staging-item14 | 62 KB | Parts Sale per-part three-dot (Actions) open, green box around **"Add Part Fee / Discount"**. ✅ |
| 58871 | QA-staging-item15 | 95 KB | Parts Sale (Richard Gaines). Parts Sale Fees & Discounts card **plain text**: "Part Fee (11%) +$2.39", "New Processing Fee (10%) +$2.28", "Fee +$500,000.00" + disclaimer. ✅ |
| 58860 | QA-staging-item16 | 124 KB | Parts Sale table F&D column, green box: **"Fee 10% +1"** as plain text (no badges). Card rows "Part Fee (11%) +$2.65 / New Processing Fee (10%) +$2.53 / Fee +$500,000.00". ✅ |
| 58865 | QA-staging-item17 | 88 KB | Parts Sale Financial Info crop, green box around **"Fees & Discounts (5) $500,007.57"** directly above Subtotal $500,029.31 / GST $1.47 / Total $500,030.78 / Balance. ✅ |
| 58866 | QA-staging-item18 | 79 KB | Parts Sale per-part add modal, green box: title **"New Part Fee / Discount"** (subline unchanged "Applying to: Part —"). Type=Fee, Calc Type=Flat Amount, Amount, Taxable=Yes. ✅ |
| 58876 | QA-staging-item20 | 158 KB | Parts Sale → Statistics. Green box around F&D section headings **"%" / "Amount"**; rows Part Fee +11% +$2.65 / New Processing Fee +10% +$2.53 / Fee +$500,000.00 / Fee +10% +$2.17 / Discount +1% +$0.22 / Total +$500,007.57. ✅ |

### Byte-identical duplicates (8 — NOT re-copied; same md5 as the listed unique)

| id | filename | duplicate of |
|---|---|---|
| 58832 | Picture 01 - item 1 - labor entry (red+green) … (bdc2d118…) | 58831 |
| 58872 | image-20260722-163208.png (QA item 19) | 58866 (QA item 18) — the QA item-19 ✅ shot reuses the item-18 image |
| 58829 | Picture 20 - item 13 … (0f5ad09f…) | 58822 |
| 58819 | Picture 21 - item 14 … (7810de4e…) | 58802 |
| 58825 | Picture 22 - item 15 … (9497a0a8…) | 58813 |
| 58823 | Picture 23 - item 16 … (cc4c245d…) | 58820 |
| 58821 | Picture 25 - item 18 … (c7980519…) | 58805 |
| 58833 | Picture 27 - item 19 … (430f053d…) | 58824 |

> **Note on Picture 26 / item 19:** the description references "Picture 26 shows the three-dot context" for the parts-sale whole-sale entry point, but **no Picture 26 was attached** to the ticket (only Picture 27 red). Flag for authoring.

---

## Traceability (Rule 20)
- **Ticket:** SV-8479 (Story Defect, REJECTED FROM TESTING) · **Parent:** SV-8288 (Story 12: Visual rules) · **Epic:** SV-7387 · **Predecessor:** SV-8456 (Done).
- **Spec anchors:** SV-8479 Actual/Expected items 1–20 (WO 1–12, Parts Sale 13–20) + NOTES (sign convention, Labor-not-Line, disclaimer copy, Financial-Info placement, regression preserves).
- The eventual test cases must cite the exact item number (e.g. "SV-8479 (item 8 — Labor modal title/subline)") and preserve the jurisdiction tax note + convenience-fee banner as regression checks.
