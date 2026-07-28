h2. QA verification — SV-8721 (5-decimal cost on PO Receive)

Tested live on staging (app.staging.shopview.com). I re-created the customer's exact case from the Gregg Distributors vendor invoice, plus the extra scenarios raised in the comments. Results below, area by area. The rule I checked against is the SV-4543 precision contract: *show 5 decimal places on the item cost, then round the money line total to 2 decimals*.

h3. Area 1 — PO Receive Parts screen (the customer's exact case)

* *What we tested:* Created a Work Order, requested the three vendor parts at the invoice costs (0.240, 0.027, 0.089), ordered them, and opened the *Receive Parts* screen.
* *What was expected:* The unit cost should stay at full precision (5 decimals) and the line totals + subtotal should be calculated from that full cost, so the ShopView total matches the paper vendor invoice (Subtotal $15.32).
* *What is happening now vs before:*
** Unit costs now display in full: *$0.24000 / $0.02700 / $0.08900*. Before, they were rounded to $0.24 / $0.03 / $0.09.
** Line totals are now *$9.60 / $2.16 / $3.56*. The 0.027 line was *$2.40* before (now $2.16), and the 0.089 line was *$3.60* before (now $3.56).
** *Subtotal is now $15.32* (correct). It was *$15.60* before.
* Result: *PASS.* The issue does not reproduce.

h3. Area 2 — Backend precision (order/receive data)

* *What we tested:* Read the order detail data behind the Receive screen to confirm the fix is in the data, not just the display.
* *What was expected:* The order/receive data should carry the full-precision cost, and the money totals should be computed from it.
* *What is happening now vs before:* The data now carries the full-precision values alongside the old rounded ones — e.g. for the 0.089 part the full cost is *0.08900* (old rounded value was 0.09), the line total is *$3.56* (old was $3.60), and the order subtotal is *$15.32* (old was $15.60). The Receive screen shows the corrected full-precision values.
* Result: *PASS.* The fix is applied for all customers at the data level, not only on screen.

h3. Area 3 — Purchase Orders list total

* *What we tested:* Checked the *Total Price* for the seeded PO on the Purchase Orders list (/parts/orders).
* *What was expected:* The PO list total should also be computed on full precision.
* *What is happening now vs before:* The PO shows *Total Price $152.36* = $15.32 (the three customer parts) + $137.04 (an added 4-decimal part). The old rounded math would have shown *$152.64*. So the full-precision fix flows through to the PO list total too.
* Result: *PASS.*

h3. Area 4 — Ayesha's 4-decimal note (cost 45.6789)

* *What we tested:* Requested a part at a 4-decimal cost (45.6789) and checked how it is stored and totalled on the Receive/precision side.
* *What was expected:* The cost should be preserved to 5 decimals and the line total rounded to 2 decimals.
* *What is happening now vs before:* The cost is stored as *45.67890* (a trailing zero is appended — same value, cosmetic, which explains the "appends a zero" observation) and the line total is *$137.04* (3 × 45.6789, rounded to 2 decimals). This side is correct.
* *Not re-verified this run (honest):* The other half of Ayesha's note — reopening the *Edit Part Request* dialog showing the cost rounded to 4 decimals (45.6800) — was not reproducible here because that dialog was not reachable on an already-ordered part. Dev (Dusan) has scoped that edit-dialog rounding as a separate / pre-existing concern outside this ticket.

h3. Verdict

*SV-8721 is FIXED on staging and does not reproduce.* The PO Receive screen now keeps the full 5-decimal unit cost and computes the line totals, subtotal and PO total from that full precision — matching the SV-4543 rule (5 decimals on cost, round the line total to 2 decimals). The customer's totals now come out correct (Subtotal $15.32 instead of $15.60).

*Honest scope — not driven this run:*
* The standalone/multi-PO *Bulk Receive* page (the grouped "Receive Selected" flow needs multiple same-vendor POs; the single per-row Receive reuses the same screen already verified above).
* Ayesha's *Edit Part Request* dialog reopen-rounding, which dev (Dusan) scoped as separate / pre-existing from this ticket.

Screenshot of the fix attached: *R1-receive-screen.png* (Receive Parts screen showing 5-decimal costs and Subtotal $15.32).
