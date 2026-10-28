# DEFECT CANDIDATE — Revenue is counted after a work-order discount; the PRD says "before any discount"
Project: Dashboard v1 (epic SV-490) · Prepared: 2026-10-28 · Prepared by: credit-memo-document-location lane (independent dashboard pass)
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — fails A2 (the PRD sentence can be read two ways on this very invoice); PO question DQ-2 raised. Ticket fully drafted in `TICKET-F4-revenue-after-discount.wiki`.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | `v26.43.2-f8698cb`, DVI Test, 28 Oct 2026. Run 1: S1-38196 ("ZZAUTOTEST Dash A1", $135.00 labor + $20.00 flat whole-work-order discount added through the fees-and-discounts screen's API) → Revenue rose by $115.00, Sales Subtotal $115.00. Run 2: S1-38200 ("ZZAUTOTEST Dash F2"), entirely through the screen (⋮ → *Add Work Order Fee / Discount*, Type *Discount*, *Flat Amount* $20, Taxable *No*, *Add Discount*) → Sales Subtotal $115.00, Labor Invoiced $135.00 |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ❌ | Dashboard PRD v53 (2026-10-22), S3-R2 row "Revenue": *"Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos. Shown to the cent."* On S1-38200 the invoice itself prints *Subtotal $115.00* (after the discount), so "sum of invoice subtotals" gives $115.00 while "before any discount" gives $135.00. The sentence contradicts itself here. The code comment says "discount" was meant as the old invoice-level percentage discount, which IS left out — but a code comment is not a source (Rule 57). |
| A3 | NOT an unfinished feature | ✅ | SV-9575 Done; SV-490 Done |
| A4 | NOT already reported | ✅ | `project = SV AND text ~ "before any discount"` and `project = SV AND (summary ~ "Revenue" AND summary ~ "discount") AND created >= 2026-06-01` — see `DUPLICATE-SEARCH.md` |
| A5 | NOT by design | ⚠️ | The PRD change log (v50, 2026-10-16) adds "fees" to "Other" but says nothing about discounts |
| A6 | NOT environment / data / role | ✅ | Seeded data, Admin, both an API-added and a screen-added discount behave the same |
| A7 | Correct parent | ✅ | Revenue formula = Story 3 → SV-9575 |
| A8 | Evidence complete | ✅ | `F4-pictures/F4-1-invoice-with-discount.png`; build marker; steps proven on screen |
| A9 | Adversarial self-review | ❌ | Refusal 3 ("the invoice subtotal is $115, the PRD says *sum of invoice subtotals*") is not defeated |
| A10 | Rule 62 | ✅ | Not filed. Not yet asked. |

## A9 — THE SIX REFUSALS, ARGUED AND ANSWERED
1. Unbuilt? → No, Done.
2. Spec changed? → v53 is current.
3. Works as designed? → **Not defeated** — the subtotal printed on the invoice is the after-discount figure, and the PRD says "sum of invoice subtotals".
4. Cannot reproduce? → Twice, once through the screen only.
5. Duplicate? → None found.
6. Environment? → No.

## IF NOT ADMISSIBLE
What it is instead: PO decision DQ-2 — "Does a work-order discount (Fees & Discounts) reduce Revenue, or is Revenue taken before it?"
Side effect worth showing the PO: when a discount is present the Revenue split shows a negative *Other* (DVI Test, This Month: "Parts -28% · Labor 130% · Other -2%").
Recorded in: `PO-QUESTIONS-2026-10-28.md` DQ-2 · `NOT-FILED.md`.
