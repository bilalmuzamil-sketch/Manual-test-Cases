# SV-8218 (Invoice UI Refresh) — work-line footer omits the line's own fee — defect (found by the other session, filed by this one)

**Epic:** https://shopview.atlassian.net/browse/SV-8218 (Invoice UI Refresh). **Owning story (Relates):** SV-9149 (Story 10 — Estimate and Invoice Specifics).
**Env:** app.staging.shopview.com, build **v26.35.9-9812433** (read live). WO **S2-32136** (id 54418716-5394-49f7-8b95-8bc1a5480beb), Invoice **INV-S2-32136**, line **01 "ABCD / EFGH"**.

## Live-observed (this session)
- Line 01: labour 2 × $149.95 = **$299.90**, plus a line-level fee **"ZZAUTOTEST Line Fee" $25.00** (flat, scope labor_line). API `total_cost` = **324.90** (labor + fee).
- The invoice document's **line footer** reads **Labor $299.90 / Line total $299.90** — it omits the $25.00 fee shown one row above it. Should read **$324.90 / $324.90**. (exhibit-1)
- The same document's **Summary DOES add the fee**: Adjustments ▸ Labor **$25.00** → Subtotal $736.09 → Total / Balance **$772.91**. So the customer is billed the fee, but the line total shown is $299.90. The two halves of the page disagree. (exhibit-2)

## Sources (design first, then spec — per QA-lead rule; never the test case)
- **Design Document** (owns appearance): keeps the Summary Labor/Parts rows GROSS and rolls line-level fees/discounts up as their own rows under the Adjustments heading — which is what the Summary correctly does.
- **Spec** S5-R9 / S12 (live Confluence): a line's Labor and Parts figures are that line's own totals **after** its line-level fees and discounts; "Line total" is their sum. The build's line footer violates this.

## Filed
- SV-9769-style follow-up ticket created (see below), parent = epic SV-8218, Relates → SV-9149, priority Medium.
