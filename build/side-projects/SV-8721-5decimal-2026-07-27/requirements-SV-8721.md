# SV-8721 — requirements (the ticket to TEST)  [SIDE PROJECT]

Source (login-walled pointer): https://shopview.atlassian.net/browse/SV-8721
Ingested live via Atlassian REST v3 on 2026-07-28.

## Header
- **Summary:** Purchase Order Receiving Rounds Part Costs, Causing Vendor Invoice Totals to Mismatch
- **Type:** Bug
- **Status:** TESTING STAGE  (i.e. fix is expected deployed on staging, awaiting QA verify)
- **Assignee:** Dusan Radulovic (dev)   **Reporter:** Ryan Fyfe
- **Fix Version:** (none set)
- **Reported by (customer):** Devon Reichert — Squires Industrial Services Ltd (Intercom)

## What the ticket asks (plain)
When you receive parts on a Purchase Order, ShopView was rounding the part **unit cost to 2 decimal
places** instead of keeping the exact cost from the vendor invoice. That rounding then throws off the
line totals, subtotal, tax and the final total, so the ShopView PO total no longer matches the paper
vendor invoice. The fix must **preserve the full decimal cost through the Receive flow** and calculate
line totals / subtotal / tax / total from that full-precision cost.

## Steps to reproduce (from ticket)
1. Create a Work Order and request the parts.
2. Enter the cost of the parts with more than 2 decimals (e.g. 45.2567, or 0.240 / 0.027 / 0.089).
3. Receive the parts (PO Receive Parts screen).
4. Observe the part cost is rounded and shows only 2 decimal places.

## Expected vs Actual (from the customer's real vendor invoice — Gregg Distributors inv 035-661332)
Costs on vendor invoice: CB2SC-038-200 = **$0.240**, SWS-038 = **$0.027**, NNSC-038 = **$0.089**.

| Part | Qty | Cost (should keep) | Line total (correct) | Actual/rounded cost | Line total (wrong) |
|------|-----|--------------------|----------------------|---------------------|--------------------|
| CB2SC-038-200 | 40 | 0.240 | 9.60 | 0.24 → 9.60 (matches by luck) | 9.60 |
| SWS-038 | 80 | 0.027 | 2.16 | 0.03 → 2.40 | 2.40 |
| NNSC-038 | 40 | 0.089 | 3.56 | 0.09 → 3.60 | 3.60 |

- **Correct totals:** Subtotal **$15.32**, Tax **$0.77**, Total **$16.09**.
- **Wrong (rounded) totals seen in build:** Subtotal **$15.60**, Tax **$0.78**, Total **$16.38**.

## Evidence attachments (ingested)
- 59050.png — Receive Parts screen showing the BUG: Cost $0.24/$0.03/$0.09, Subtotal $15.60, Tax $0.78, Total $16.38.
- 59049.png — WO lines/Parts view, same rounded costs.
- 59048.png — Edit Part Request dialog: Cost stored as **$0.08900** (5 decimals) while Receive showed $0.09.
- 59051.png — the paper vendor invoice (correct values 0.240/0.027/0.089, subtotal 15.32, tax 0.77, total 16.09).
- 59052.png, 59076.mp4 — additional repro views / video.

## Comments (key)
- **MAX / Qazi (2026-07-27):** second customer (NCCHD). Part XNN188C-031 cost **$0.21800** stored right
  in the part-request dialog but Receive Parts shows **$0.22** (qty 30 → $6.60 instead of $6.54); tax on
  inflated amounts. Worked correctly on Fri Jul 24 → smells like a regression from a recent deploy.
- **Dusan (2026-07-27):** "the fix will be covered for all customers and it will always show and be
  calculated as the full decimal amount. **On both the PO and Bulk PO receive pages.**"
- **Ayesha Khan (2026-07-28) — new regression found while verifying:** requesting a part with a 4-decimal
  cost (e.g. 45.6789): on clicking out it appends a zero → 45.67890 (5 dp). After Save & Close, reopening
  the Edit Part Request window shows the cost **rounded → 45.6800**. The **Bulk Receive page still shows
  the original 45.6789**, so Edit Part Request window and Bulk Receive page **disagree**. Editing+saving
  carries the rounded cost over and the total is also rounded.
- **Dusan (2026-07-28):** what this ticket fixed = on the PO receive page we now show the fully correct
  decimal cost (previously rounded-to-2) and use that value to compute subtotal/total for the PO. Other
  edit-dialog issues to be discussed separately (pre-existing, multiple related tickets).

## Fix acceptance (what "fixed" means for this ticket, per Dusan)
1. **PO Receive Parts page** shows the full decimal cost for each part (not rounded to 2 dp).
2. Line extended totals, **Subtotal** and **Tax** are computed from that full-precision cost.
3. Same behaviour on the **Bulk PO Receive** page.
4. For the customer's data this means: Subtotal 15.32 / Tax 0.77 / Total 16.09 (not 15.60/0.78/16.38).

## Scope note for testing
The core SV-8721 fix = the PO Receive / Bulk Receive cost display + PO subtotal/total math. Ayesha's
Edit-Part-Request reopen-rounding + append-zero behaviour is explicitly flagged by dev as a
separate/pre-existing concern (may or may not be in this ticket) — test it and report, but judge the
SV-8721 pass/fail on items 1-4 above.
