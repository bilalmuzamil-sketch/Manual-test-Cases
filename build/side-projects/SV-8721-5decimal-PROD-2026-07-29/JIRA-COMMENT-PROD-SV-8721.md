> **POSTED as comment 74275 on 2026-07-29 (3 inline screenshots, attachment ids 59136 PROD-R2-receive-3parts-subtotal-15.32.png · 59137 PROD-R1-receive-screen-4parts.png · 59138 PROD-B0-po-list-total-152.36.png).**
> **EDITED IN PLACE 2026-07-29 (PUT /rest/api/2/issue/SV-8721/comment/74275 → 200, updated 05:16:59):** upgraded with the tax/Total leg — 4th screenshot **PROD-R3-tax-total.png uploaded as attachment id 59142**, new section "2b) Tax and grand Total" (customer's exact invoice figures Subtotal $15.32 / Tax $0.77 / Total $16.09 reproduced; honest 0%-tax-rate note), intro + Verdict strengthened (end-to-end invoice-figure match), screenshots line lists all 4. Verified back: re-GET 200, body byte-identical to the PUT, all 4 `!refs!` present, all 4 attachment filenames confirmed on the issue. The tax/Total addendum (JIRA-ADDENDUM-TAX-TOTAL.md) was FOLDED INTO this comment — not posted separately.
> The exact live comment body (Jira wiki markup) is below.

Verified on production Environment: *→ QA Status:* {color:#36b37e}*Fixed*{color}

The Purchase Order Receive screen on Production now keeps the part cost at its full (up to 5) decimals and works the subtotal/total out from that exact cost — reproducing the customer's exact scenario gives their exact invoice figures, *Subtotal $15.32 / Tax $0.77 / Total $16.09*, not the old wrong $15.60. Production behaves exactly as it did on staging when we verified the fix there on July 27.

Tested live on Production with the customer's exact numbers (three parts at $0.240, $0.027, $0.089, plus one part at 45.6789 as a 4-decimal check), on a throwaway test work order that was deleted afterwards. Screenshots attached.

h2. What we checked, area by area

h3. 1) PO *Receive Parts* screen — costs and line totals  ✅ Working on Production

* *What we did:* put the customer's three parts (costs 0.240 / 0.027 / 0.089) plus a 45.6789 part on one purchase order and opened the Receive Parts screen.
* *Expected:* costs shown in full decimals, line totals worked out from the full cost.
* *Observed on Production:* costs *$0.24000 / $0.02700 / $0.08900 / $45.67890*; line totals *$9.60 / $2.16 / $3.56 / $137.04*. (The old bug showed $0.24 / $0.03 / $0.09 with wrong totals $9.60 / $2.40 / $3.60.)

!PROD-R1-receive-screen-4parts.png|width=853!

h3. 2) The Subtotal — the customer's reported number  ✅ Working on Production

* *Expected:* the customer's three parts must add up to *$15.32* (the paper vendor invoice figure). The bug produced $15.60.
* *Observed on Production:* with just the customer's three parts selected the screen shows *Subtotal: $15.32* — the exact correct figure, same as staging.

!PROD-R2-receive-3parts-subtotal-15.32.png|width=853!

* With all four parts selected it shows *$152.36* (the old rounded math would give $152.64) — so the full-precision calculation carries through bigger orders too.

h3. 2b) Tax and grand Total — the customer's exact invoice figures  ✅ Working on Production

* *What we did:* with the customer's three parts showing Subtotal $15.32, we typed the vendor invoice tax *$0.77* into the Tax box on the Receive screen.
* *Observed on Production:* the Total updates to *$16.09* exactly (15.32 + 0.77) — the customer's invoice figures reproduced to the cent. The bug used to produce 15.60 / 0.78 / 16.38.
* One honest note: our test company on Production is set to a 0% tax rate, so the Tax box starts at $0.00 there (Total $15.32 — also correct math). That starting value is a company tax-rate setting, not part of this bug.

!PROD-R3-tax-total.png|width=853!

h3. 3) Purchase Orders list — Total Price column  ✅ Working on Production

* *Expected:* the list total should come from the full-precision costs.
* *Observed on Production:* the test PO's row shows *Total Price $152.36* (not the rounded $152.64).

!PROD-B0-po-list-total-152.36.png|width=853!

h3. 4) Behind the scenes (what the system stores)  ✅ Working on Production

* The order record on Production now carries the full-precision values alongside the old rounded ones — the cost is stored as 0.24000 / 0.02700 / 0.08900 / 45.67890 and the order total as 152.36. A part entered with 4 decimals (45.6789) is kept as 45.67890 (same harmless trailing zero as on staging).

h2. Verdict

*QA decision: PASS on Production.* Every check gives the same result we verified on staging on July 27, and Production matches the customer's reported expectation end-to-end — their invoice's Subtotal, Tax and Total ($15.32 / $0.77 / $16.09) are reproduced exactly. The customer's reported problem (PO received total not matching the paper vendor invoice because costs were rounded to 2 decimals) does not reproduce on Production.

h2. Honest scope (not covered by this pass)

* The multi-PO *Bulk Receive* page was not driven this run (needs several same-vendor POs; the single-PO Receive screen — the surface the customer's bug was on — is what we verified).
* The *Edit Part Request* dialog and the Work-Order-side rounded displays (WO line "Parts" view / Financial Info "Parts" figure) were not re-checked on Production — dev already scoped those as separate, pre-existing items outside this ticket.
* We did not press the final Receive button on Production (display + calculation were the fix under test); the test work order and PO were deleted afterwards, so nothing was left behind.

_Screenshots (attached, shown inline above): PROD-R1-receive-screen-4parts.png (full screen, 5-decimal costs, $152.36) · PROD-R2-receive-3parts-subtotal-15.32.png (the customer's three parts, Subtotal $15.32) · PROD-R3-tax-total.png (Tax $0.77 entered, Total $16.09) · PROD-B0-po-list-total-152.36.png (PO list Total Price $152.36)._
