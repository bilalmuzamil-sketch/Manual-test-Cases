"""Story 17 — Reports and totals stay consistent (SV-11706), PRD v37 S17 rows (no design page; the reports' page 20 where a report shows).
Batch B, phase 2, 14 Nov 2026. Story 17's report figures are proved in full in the RPT cases (Sales by Tier and Sales by Category PRD)."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import WOA, PSA, RPA, MX, TR, CU, WO, PS, OPENWO, ADDP, PARTS, HOVER, opened

K = "S17"

C("S17-01", K, "Stats, invoice total and tax add up the saved line prices",
  [WOA, MX(), TR("A", "A", "Markup % 20"), CU(), WO(), "Make sure your location's parts tax rate is known (for example 5% GST).", DESK],
  [OPENWO(), ADDP(), ADDP("A", "50.00"), "Click the Stats tab.", "Click Invoice."],
  [opened(), R(S("S10-R20"), "The first part reads $120.00 ($100.00 × 1.20)."), R(S("S10-R20"), "The second part reads $60.00 ($50.00 × 1.20)."),
   R(S("S17-R1", "Work order and Part Sale Stats, invoice totals and taxes calculate from the saved line prices, as today."),
     "Stats show parts of $180.00 ($120.00 + $60.00 = $180.00) beside the line's labor."),
   R(S("S17-R1"), "The invoice's parts total reads $180.00.", "Its tax on parts reads $180.00 × the tax rate (for example 5% = $9.00).")],
  nopic="the design draws no Stats tab or invoice for this story (Story 17 has no design page)", flags=["numbers"])

C("S17-02", K, "Part Sale totals add up the saved line prices",
  [PSA, MX(), TR("A", "A", "Markup % 20"), CU("A", "A", "Part Sales"), PS(), DESK],
  [ "Open Part Sale 1.", "Add a part with category A and cost 100.00 to Part Sale 1.", "Click the Statistics tab."],
  [R(S("S13-R1"), "Part Sale 1 opens."), R(S("S13-R1"), "The part reads $120.00 ($100.00 × 1.20)."),
   R(S("S17-R1", "Work order and Part Sale Stats, invoice totals and taxes calculate from the saved line prices, as today."),
     "Statistics show parts of $120.00 and cost $100.00, the saved line price and cost ($120.00 − $100.00 = $20.00 profit).")],
  pics=["13.3"], flags=["numbers"])

C("S17-03", K, "The new reports sit under Reports › Parts and read what each line recorded",
  [RPA, MX(), TR(), CU(), WO("1", "A", ", with a part in category A priced $121.50 by tier A, invoiced today"), DESK],
  [ "Open Reports.", "Click Sales by Tier under Parts.", "Rename tier A on its tier page.", "Reload Sales by Tier."],
  [R(S("S17-R2", "They sit under Reports › Parts and ship in the same release as this PRD."), "Sales by Tier and Sales by Category are listed under Parts."),
   R(S("S17-R2", "They read only what each line recorded (S12-R4, S12-R6)."), "A row for tier A shows Parts Invoiced including the part's $121.50 ($135.00 × 0.90 = $121.50)."),
   R(S("S2-R28"), "Tier A has its new name."),
   R(S("S17-R2", "They read only what each line recorded"), "The same row now shows tier A's new name with the same Parts Invoiced.")],
  pics=["20.2"], flags=["numbers"])

C("S17-04", K, "A Part Sale return shows as a credit with Invoiced, Credits and Net",
  [RPA, MX(rng="one cost range ($0.00 and up) whose Default rule is Markup % 35"), TR("A", "A", "Markup % 25"), CU("A", "A", "Part Sales"),
   PS("1", "A", ", with 5 units of a part in category A, cost $16.00 each, priced $20.00 each by tier A, invoiced today"), DESK],
  [ "Return 2 units from Part Sale 1 with a $5.00 restocking fee.", "Open Reports › Sales by Tier.", "Pick customer A in the Customer filter."],
  [R(S("S17-R5"), "A credit for the return is made."),
   R(S("S17-R5"), "Sales by Tier opens."),
   R(S("S17-R5", "Sales by Tier and Sales by Category show Invoiced, Credits and Net."), "Tier A's row shows Parts Invoiced $100.00 (5 × $20.00 = $100.00).")
   + R(S("S17-R5", "Credits are customer credit memos only (Part Sale returns and credits made on the customer page), before tax, after any restocking fee, dated by the credit, and counted in the credited line's tier or category at the original invoiced price (S11-N1)."),
       "Its Parts Credits reads −$35.00 (2 × $20.00 − $5.00 = $35.00).", "Its Parts Net reads $65.00 ($100.00 − $35.00 = $65.00).")],
  pics=["20.2"], flags=["numbers"])

C("S17-05", K, "Sales and Sales by Customer keep today's report",
  [RPA, "Use staging, where data from before the release is kept.", DESK],
  [ "Open Reports › Sales By Customer.", "Open Reports › Sales."],
  [R(S("S17-R3", "Sales and Sales by Customer are unchanged."),
     "Sales By Customer shows today's filters, columns and Totals, as in the attached Today picture.")
   + R(QP("This PRD changes neither", "RPT-S1-R7"), "It has no Priced By filter or column."),
   R(S("S17-R3"), "Sales opens as today.")
   + R(QP("This PRD changes neither", "RPT-S1-R7"), "It has no Priced By filter or column.")],
  pics=["today:20.1"])

C("S17-06", K, "A customer discount applies after the tier price",
  [WOA, MX(), TR("A", "A", "Markup % 20"), CU(), "Make sure customer A has a 5% discount in Fees & Discounts (for example a military discount), set before work order 1 was made.",
   WO("1", "A", ", with no labor amount on line 1"), DESK],
  [OPENWO(), ADDP(), HOVER, "Click the Stats tab."],
  [opened(),
   R(S("S17-E1", "A customer Fees & Discounts entry (for example a 5% military discount) applies at the end of the work order, after tier pricing, as today."),
     "The part reads $120.00 ($100.00 × 1.20), with no discount in the line price."),
   R(S("S17-E1", "The price details explain the line's unit sell price before that discount."), "The price details show sell price $120.00 and tier A's 20% markup rule."),
   R(S("S10-R2", "Fees & Discounts apply after the line prices, as today (S17-E1)."),
     "Stats show the 5% discount of $6.00 ($120.00 × 0.05 = $6.00) taken at the end: $120.00 − $6.00 = $114.00 before tax.")],
  pics=["10.8"], flags=["numbers"])
