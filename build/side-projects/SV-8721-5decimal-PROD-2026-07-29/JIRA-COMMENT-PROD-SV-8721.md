h2. QA Verification — SV-8721 verified on PRODUCTION (2026-07-29)

*In one line:* the fix is *live and working on Production*. The Purchase Order Receive screen on Production now keeps the part cost at its full (up to 5) decimals and works the subtotal/total out from that exact cost — reproducing the customer's exact scenario gives the correct *$15.32* (the vendor-invoice figure), not the old wrong $15.60. Production behaves exactly as it did on staging when we verified the fix there on July 27.

Tested live on Production with the customer's exact numbers (three parts at $0.240, $0.027, $0.089, plus one part at 45.6789 as a 4-decimal check), on a throwaway test work order that was deleted afterwards. Screenshots attached.

h2. What we checked, area by area

h3. 1) PO *Receive Parts* screen — costs and line totals  ✅ Working on Production
* *What we did:* put the customer's three parts (costs 0.240 / 0.027 / 0.089) plus a 45.6789 part on one purchase order and opened the Receive Parts screen.
* *Expected:* costs shown in full decimals, line totals worked out from the full cost.
* *Observed on Production:* costs *$0.24000 / $0.02700 / $0.08900 / $45.67890*; line totals *$9.60 / $2.16 / $3.56 / $137.04*. (The old bug showed $0.24 / $0.03 / $0.09 with wrong totals $9.60 / $2.40 / $3.60.)

h3. 2) The Subtotal — the customer's reported number  ✅ Working on Production
* *Expected:* the customer's three parts must add up to *$15.32* (the paper vendor invoice figure). The bug produced $15.60.
* *Observed on Production:* with just the customer's three parts selected the screen shows *Subtotal: $15.32* — the exact correct figure, same as staging.
* With all four parts selected it shows *$152.36* (the old rounded math would give $152.64) — so the full-precision calculation carries through bigger orders too.

h3. 3) Purchase Orders list — Total Price column  ✅ Working on Production
* *Expected:* the list total should come from the full-precision costs.
* *Observed on Production:* the test PO's row shows *Total Price $152.36* (not the rounded $152.64).

h3. 4) Behind the scenes (what the system stores)  ✅ Working on Production
* The order record on Production now carries the full-precision values alongside the old rounded ones — the cost is stored as 0.24000 / 0.02700 / 0.08900 / 45.67890 and the order total as 152.36. A part entered with 4 decimals (45.6789) is kept as 45.67890 (same harmless trailing zero as on staging).

h2. Verdict

*QA decision: PASS on Production.* Every check gives the same result we verified on staging on July 27 — 8 out of 8 checkpoints match, none differ. The customer's reported problem (PO received total not matching the paper vendor invoice because costs were rounded to 2 decimals) does not reproduce on Production.

h2. Honest scope (not covered by this pass)
* The multi-PO *Bulk Receive* page was not driven this run (needs several same-vendor POs; the single-PO Receive screen — the surface the customer's bug was on — is what we verified).
* The *Edit Part Request* dialog and the Work-Order-side rounded displays (WO line "Parts" view / Financial Info "Parts" figure) were not re-checked on Production — dev already scoped those as separate, pre-existing items outside this ticket.
* We did not press the final Receive button on Production (display + calculation were the fix under test); the test work order and PO were deleted afterwards, so nothing was left behind.

*Screenshots to attach:* PROD-R2-receive-3parts-subtotal-15.32.png (the customer's three parts, Subtotal $15.32), PROD-R1-receive-screen-4parts.png (full screen, 5-decimal costs, $152.36), PROD-B0-po-list-total-152.36.png (PO list Total Price $152.36).
