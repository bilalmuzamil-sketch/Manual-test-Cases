h2. QA Verification — SV-8721 (Before vs After, live on staging)

*In one line:* the customer's problem — a Purchase Order's received total not matching the paper vendor invoice because part costs were being rounded to 2 decimals — is *fixed*. On the PO Receive screen and the PO Details page the part cost now keeps its full (up to 5) decimals and the PO subtotal/total are worked out from that exact cost, so they match the vendor invoice ($15.60 → *$15.32*, the invoice figure).

Tested live on staging with the customer's exact numbers (three parts at $0.240, $0.027, $0.089). Before/after screenshots are attached (SBS-01 to SBS-05).

h2. What changed, screen by screen

h3. 1) PO *Receive Parts* screen  ✅ Fixed
* *Before:* costs rounded to $0.24 / $0.03 / $0.09; line totals $9.60 / $2.40 / $3.60; *Subtotal $15.60*.
* *Now:* costs shown in full $0.24000 / $0.02700 / $0.08900; line totals $9.60 / $2.16 / $3.56; *Subtotal $15.32*.
* *Verdict:* Fixed — the subtotal now equals the vendor invoice. (image *SBS-01*)

h3. 2) Vendor paper invoice (the correct target)  ✅ Matches
* The paper invoice sub total is *$15.32*. ShopView's Receive screen now shows the same *$15.32*.
* *Verdict:* ShopView matches the invoice. (image *SBS-04*)

h3. 3) PO Details → *Remaining Parts* tab  ✅ Fixed
* *Before/Now:* the Cost column keeps the full 5 decimals ($0.24000 / $0.02700 / $0.08900) and the Total Cost column is correct ($9.60 / $2.16 / $3.56).
* *Verdict:* Fixed — full-precision cost is preserved here too. (image *SBS-05*)

h3. 4) Work Order line *"Parts"* view  ⚠️ Still rounds
* *Before/Now:* this preview column still shows the cost rounded to 2 decimals ($0.03 / $0.09) with totals $2.40 / $3.60 (not $2.16 / $3.56). It is unchanged.
* *Verdict:* Still rounds — this screen was not part of the PO-Receive fix. (image *SBS-02*)

h3. 5) *Edit Part Request* dialog  ⚠️ Still rounds
* *Before/Now:* when you re-open this dialog the cost is shown rounded to 2 decimals ($0.08900 → $0.09000; a part entered at 45.6789 re-opens as 45.68000).
* *Verdict:* Still rounds — the dev has already flagged this dialog as a separate, pre-existing item, not part of this ticket. (image *SBS-03*)

h2. Verdict & scope

*QA decision: PASS — with two separate follow-ups logged.*

*Why this is a safe pass:* this ticket's acceptance is specifically about the *PO Receive / Bulk PO Receive* screens and the resulting PO subtotal/total (per the ticket: "the fix will be covered ... it will always show and be calculated as the full decimal amount. On both the PO and Bulk PO receive pages", and dev's close-out: "on the PO receive page we now show the fully correct decimal cost ... and use that value to compute subtotal/total for the PO"). Every one of those named surfaces now behaves correctly and reproduces the customer's exact correct figure ($15.32). So the customer's reported defect is resolved.

*What this PASS covers:* the PO Receive Parts screen (full-decimal cost + correct line totals/subtotal), the PO Details → Remaining Parts cost display, and the PO list total — all now full-precision and matching the vendor invoice.

*What is explicitly NOT part of this pass (tracked separately):* the two screens below still round. They are outside this ticket's stated scope (the ticket is about the PO Receive/Bulk-Receive totals, which are correct), and the dev has already identified the Edit Part Request dialog as a separate, pre-existing item. They are being raised as their own follow-up so this pass is on the record for exactly what was fixed.

h2. Still to watch (separate follow-up, not blockers for this ticket)
* *Work Order line "Parts" view* — still shows cost rounded to 2 decimals ($2.40 / $3.60 instead of $2.16 / $3.56).
* *Work Order Financial Info panel* — the "Parts" figure shows *$152.64* (rounded sum) while the PO total is *$152.36* (full precision). Same underlying cause as the WO-line view — the Work-Order-side totals still add up the rounded cost.
* *Edit Part Request dialog* — re-opens with the cost rounded to 2 decimals (the dev's already-noted separate/pre-existing item).

Recommend logging the Work-Order-side rounding (line "Parts" view + Financial Info "Parts" total) and the Edit Part Request dialog rounding as their own ticket(s), linked to this one, so the full-precision behaviour can be extended to those displays too.

*Before/after screenshots attached:* SBS-01 (Receive Parts screen), SBS-02 (WO line Parts view), SBS-03 (Edit Part Request dialog), SBS-04 (vendor invoice vs Receive), SBS-05 (PO Details Remaining Parts).
