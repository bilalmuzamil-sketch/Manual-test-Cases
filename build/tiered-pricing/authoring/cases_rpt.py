"""Sales by Tier and Sales by Category (reports PRD, Confluence 968687617 v21, story SV-11718), tech plan 2 rows TPX-23..TPX-40, design page 20.
Batch B, phase 2, 14 Nov 2026.

Rule 116 in full: every figure is computed here from invoices the case makes for its own customers, and the case narrows the report to those
customers with the Customer filter (reports PRD S3-R4), so other data on staging never moves a number. Parity with Sales by Customer is checked
for the same filters (S1-R7); ratios are pooled, never averaged (Margin %, % of Total); zero and negative denominators show "—"; credits are
negative, after the restocking fee, before tax, dated by the credit; level sums add up; downloads equal the screen. Invoices are made today, so
the default date range (this month) holds them; the day boundary is checked both sides with a custom range."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import RPA, MX, TR, CU, WO, PS, STAGE

K = "RPT"
SBT = "Open Reports › Sales by Tier."
SBC_OPEN = "Open Reports › Sales by Category."
CFA = "Pick customer A in the Customer filter."
BASE = [RPA, MX(), TR()]
RP = ["20.2"]
TA = "tier A's row (its number and name, for example \"7 · Fleet Test\")"


def INVWO(n, c, what):
    return f"Have a new work order for this test, work order {n}, for customer {c}, with {what}, invoiced today."


def INVPS(n, c, what):
    return f"Have a new Part Sale for this test, Part Sale {n}, for customer {c}, with {what}, invoiced today."


TIERPART = "a part in category A, cost $100.00, priced $121.50 by tier A"

# ---- Story 1: rows, columns, Totals ----------------------------------------------------------------------------------------------
C("RPT-01", K, "Reports › Parts lists the two new reports above Parts Velocity",
  [RPA, DESK],
  [ "Open Reports.", "Look at the Performance group of the reports menu."],
  [R(S("RPT-S1-R1", "Reports › Parts lists Sales by Tier, Sales by Category, Parts Velocity and Inventory Value, in that order."),
     "Under Parts the menu lists Sales by Tier, Sales by Category, Parts Velocity and Inventory Value, in that order.")
   + R(QL("20.2", "RPT-S1-R1"), "Sales by Tier and Sales by Category each carry a small \"New\" badge, as in picture 20.2."),
   R(S("RPT-S1-R1", "Neither report appears under Performance."), "Performance lists Sales, Technician Efficiency, Shop Efficiency and Sales By Customer, as today.")
   + R(S("RPT-S1-R1", "Neither report appears under Performance."), "Neither Sales by Tier nor Sales by Category is listed there.")],
  pics=RP)

C("RPT-02", K, "Only invoiced, non-void part lines count",
  BASE + [CU(), WO("1", "A", ", with a part in category A, cost $100.00, priced $121.50 by tier A, not invoiced"), DESK],
  [SBT, CFA, "Invoice work order 1.", "Reload Sales by Tier.", "Void work order 1's invoice.", "Reload Sales by Tier."],
  [R(S("RPT-S1-R2"), "Sales by Tier opens on this month."),
   R(S("RPT-S1-R2", "Only invoiced lines count; an open work order appears once it is invoiced."),
     "It reads \"There are no results for selected date range\": the open work order is not counted yet.", "The Customer chip shows customer A."),
   R(S("RPT-S1-R2"), "Work order 1 is invoiced today."),
   R(S("RPT-S1-R2", "Lines are dated by the date their invoice was created"), f"{TA[0].upper() + TA[1:]} shows Parts Invoiced $121.50 ($135.00 × 0.90 = $121.50) and Parts Cost $100.00."),
   R(S("RPT-S1-R2"), "The invoice is void."),
   R(S("RPT-S1-R2", "Void invoices never count."), "Tier A's row is gone and the report reads \"There are no results for selected date range\" again.",
     "The Customer chip still shows customer A.")],
  pics=["20.2", "20.11"], flags=["numbers"])

C("RPT-03", K, "Every part line sits in the row of what priced it",
  BASE + [CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
          INVWO("1", "A", f"{TIERPART}; the fixed-price part at $12.50; a special-order part in category A, cost $50.00, with a typed price of $80.00; and line 2 with a fixed line total of $450.00 ($240.00 labor) holding one part in category A, quantity 1, cost $30.00"),
          DESK],
  [SBT, CFA],
  [R(S("RPT-S1-R2"), "Sales by Tier opens on this month."),
   R(S("RPT-S1-R3", "Every invoiced part line is in exactly one row: each tier (Default included), Fixed price, Fixed line total, Manual or Before tiers."),
     f"{TA[0].upper() + TA[1:]} reads Parts Cost $100.00, Parts Invoiced $121.50.",
     "Fixed price reads Parts Cost $10.00, Parts Invoiced $12.50.",
     "Fixed line total reads Parts Cost $30.00, Parts Invoiced $210.00 ($450.00 − $240.00 = $210.00).",
     "Manual reads Parts Cost $50.00, Parts Invoiced $80.00.")
   + R(S("RPT-S1-R7", "sums the whole filtered result"), "Totals read Parts Cost $190.00 ($100.00 + $10.00 + $30.00 + $50.00) and Parts Invoiced $424.00 ($121.50 + $12.50 + $210.00 + $80.00).")
   + R(S("RPT-S1-R3", "A row shows only when it has invoiced lines or credits in the range and filters"), "No Default row and no Before tiers row show for customer A.")],
  pics=RP, flags=["numbers"])

C("RPT-04", K, "A part's core charge stays in the part's row",
  BASE + [CU(), INVWO("1", "A", f"{TIERPART} and a core charge of $20.00 on that part"), DESK],
  [SBT, CFA, "Open Reports › Sales By Customer.", CFA],
  [R(S("RPT-S1-R3"), "Sales by Tier opens."),
   R(S("RPT-S1-R3", "A part's core and environmental charges, and any fee or discount attached to that single part, are in the same row and category as the part."),
     "Tier A's row is the one row for customer A; the core charge has no row of its own.", "Note tier A's Parts Invoiced."),
   R(S("RPT-S1-R7"), "Sales By Customer opens."),
   R(S("RPT-S1-R7", "its Parts Invoiced equals Sales by Customer's Parts Invoiced, to the cent"),
     "Customer A's Parts Invoiced equals the noted tier A Parts Invoiced: noted figure − its figure = $0.00.")],
  pics=["20.2", "today:20.1"], flags=["numbers"])

C("RPT-05", K, "A tier with nothing invoiced in the range has no row",
  BASE + [TR("B", "A", "% Off 20", ", with no customer invoiced this month"), CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, "Open the Priced By filter."],
  [R(S("RPT-S1-R3", "A row shows only when it has invoiced lines or credits in the range and filters, so a month in which no Wholesale customer was invoiced has no Wholesale row."),
     "Tier A has a row.", "Tier B has no row in the report."),
   R(S("RPT-S3-R3", "Priced By: lists every tier"), "The Priced By list still offers tier B, ticked like every other option.")],
  pics=["20.2", "20.5"])

C("RPT-06", K, "Columns, margins and shares are computed from the row's lines",
  BASE + [CU(), INVWO("1", "A", f"{TIERPART} and a special-order part in category A, cost $50.00, with a typed price of $80.00"), W1440],
  [SBT, CFA, "Point at the info icon beside % of Total."],
  [R(S("RPT-S1-R2"), "Sales by Tier opens."),
   R(S("RPT-S1-R6", "The columns, in this order:"), "The columns read Priced By, Parts Cost, Parts Invoiced, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total, in that order.")
   + R(S("RPT-S1-R6", "Parts Margin %: Parts Margin ÷ Parts Invoiced, two decimals"),
       "Tier A: Parts Margin $21.50 ($121.50 − $100.00), Parts Margin % 17.70% ($21.50 ÷ $121.50 = 17.695%), % of Total 60.30% ($121.50 ÷ $201.50).",
       "Manual: Parts Margin $30.00 ($80.00 − $50.00), Parts Margin % 37.50%, % of Total 39.70% ($80.00 ÷ $201.50).")
   + R(S("RPT-S1-R6", "Parts Net: Parts Invoiced plus Parts Credits."), "Both rows show Parts Credits $0.00 and Parts Net equal to Parts Invoiced ($121.50 + $0.00 = $121.50).")
   + R(S("RPT-S1-R6", "Parts Margin: Parts Invoiced minus Parts Cost, as Parts Margin on Sales by Customer."),
       "Totals: Parts Cost $150.00, Parts Invoiced $201.50, Parts Margin $51.50, Parts Margin % 25.56% ($51.50 ÷ $201.50), % of Total 100.00%.",
       "Totals' Parts Margin % is not 27.60%, the average of 17.70% and 37.50%."),
   R(S("RPT-S1-R6", "The header's tooltip says \"Share of Parts Invoiced for everything that matches your filters.\""),
     "A tooltip reads \"Share of Parts Invoiced for everything that matches your filters.\"")],
  pics=RP, flags=["numbers"])

C("RPT-07", K, "Totals tie to Sales by Customer to the cent",
  BASE + [CU(), CU("B", "Default"), INVWO("1", "A", TIERPART), INVPS("1", "B", "a part in category A, cost $40.00, priced $54.00 by Default"), DESK],
  [SBT, "Pick customers A and B in the Customer filter.", "Open Reports › Sales By Customer.", "Pick customers A and B in the Customer filter."],
  [R(S("RPT-S1-R7"), "Sales by Tier opens on this month at your location."),
   R(S("RPT-S1-R7", "A bold \"Totals\" row stays at the bottom while scrolling and sums the whole filtered result"),
     "Totals read Parts Invoiced $175.50 (customer A's work order 1, $121.50 by tier A, + customer B's Part Sale 1, $54.00) and Parts Cost $140.00 ($100.00 + $40.00), Parts Margin $35.50."),
   R(S("RPT-S1-R7"), "Sales By Customer opens on this month at the same location."),
   R(S("RPT-S1-R7", "For the same date range, locations and Sales Type, its Parts Invoiced equals Sales by Customer's Parts Invoiced, to the cent."),
     "Sales By Customer's Totals read Parts Invoiced $175.50: $175.50 − $175.50 = $0.00.",
     "Its Parts Margin reads $35.50, matching Sales by Tier (so Parts Cost matches too).")],
  pics=["20.2", "today:20.1"], flags=["numbers"])

C("RPT-08", K, "A renamed tier stays one row under its current name",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [ "Rename tier A on its tier page.", "Invoice a new work order for customer A with a part in category A, cost $100.00.", SBT, CFA],
  [R(S("S2-R28"), "Tier A has its new name."), R(S("S10-R14"), "The second invoice is made today, its part at $121.50."),
   R(S("RPT-S1-R8"), "Sales by Tier opens."),
   R(S("RPT-S1-R8", "A renamed tier is one row under its current name"), "One row shows tier A's new name with Parts Invoiced $243.00 ($121.50 + $121.50).")
   + R(S("RPT-S1-R8"), "No row shows tier A's old name.")],
  pics=RP, flags=["numbers"])

C("RPT-09", K, "A renamed Default shows its current name",
  [RPA, "Make sure Default has its original name, Default.", MX(), CU("B", "Default"), INVWO("1", "B", "a part in category A, cost $100.00, priced $135.00 by Default"), DESK],
  [TIERS, "Click Default's row.", "Click Default's name at the top of the page.", "Type Retail.", "Press Enter.", SBT, "Pick customer B in the Customer filter.",
   TIERS, "Click Retail's row.", "Click Retail's name at the top of the page.", "Type Default.", "Press Enter."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Default's page opens."), R(S("S2-R5"), "The name can be edited."), R(S("S2-R5"), "The name reads Retail."),
   R(S("S2-R28"), "The title reads Retail."), R(S("RPT-S1-R8"), "Sales by Tier opens."),
   R(S("RPT-S1-R8", "a renamed Default shows its current name (Tiered Pricing S4-R15)"), "Customer B's row reads 1 · Retail with Parts Invoiced $135.00 ($100.00 × 1.35).")
   + R(S("RPT-S1-R8"), "No row reads Default."),
   R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Retail's page opens."), R(S("S2-R5"), "The name can be edited."), R(S("S2-R5"), "The name reads Default."),
   R(S("S2-R5"), "The title reads Default again.")],
  pics=RP, flags=["numbers"])

C("RPT-10", K, "Labor, shop supplies and work order fees are left out",
  BASE + [CU(), "Make sure customer A gets shop supplies and a whole work order fee (for example a $25.00 fee in Fees & Discounts).",
          INVWO("1", "A", f"line 1 labor of $240.00, {TIERPART}"), DESK],
  [SBT, CFA],
  [R(S("RPT-S1-R9"), "Sales by Tier opens."),
   R(S("RPT-S1-R9", "Labor, shop supplies and whole work order or Part Sale fees are not in the report."),
     "Tier A's row reads Parts Invoiced $121.50, the part ($135.00 × 0.90 = $121.50).", "The $240.00 labor, the shop supplies and the $25.00 fee are not in any row.")],
  pics=RP, flags=["numbers"])

C("RPT-11", K, "Internal work orders closed without an invoice are left out",
  BASE + [CU(), INVWO("1", "A", TIERPART),
          "Have a new internal work order for this test, work order 2, for customer A, with a part in category A, cost $50.00, closed without an invoice.", DESK],
  [SBT, CFA],
  [R(S("RPT-S1-R10"), "Sales by Tier opens."),
   R(S("RPT-S1-R10", "Internal and no-charge work orders close without an invoice, so their part lines are not in the report"),
     "Tier A's row reads Parts Invoiced $121.50 ($135.00 × 0.90 = $121.50) and Parts Cost $100.00, from work order 1's part.", "Work order 2's $50.00 part adds nothing.")],
  pics=RP, flags=["numbers"])

C("RPT-12", K, "Row names show tier numbers, archived tiers say (archived)",
  BASE + [TR("B", "A", "% Off 20"), CU(), CU("B", "B"), INVWO("1", "A", TIERPART), INVWO("2", "B", "a part in category A, cost $100.00, priced $108.00 by tier B"),
          "Make sure customer B was moved to Default and tier B archived after work order 2 was invoiced.", DESK],
  [TIERS, SBT, "Pick customers A and B in the Customer filter."],
  [R(S("S2-R15"), "Note tier A's number on the Tiers list (for example 7)."),
   R(S("RPT-S1-R11"), "Sales by Tier opens."),
   R(S("RPT-S1-R11", "Active tier rows show the tier's number and name (\"2 · Fleet\")."), "Tier A's row reads its number, a middle dot and its name (for example \"7 · Fleet Test\").")
   + R(S("RPT-S1-R11", "An archived tier has no number (Tiered Pricing S2-R15), so its row shows its name with \"(archived)\"."),
       "Tier B's row reads its name followed by \"(archived)\", with no number.")
   + R(S("RPT-S1-R11", "No icon beside any row name."), "Neither row has an icon beside its name.")
   + R(S("RPT-S1-R8", "Archived tiers stay in the report while they have sales in the range."), "Tier B's row shows Parts Invoiced $108.00 ($135.00 × 0.80).")],
  pics=["20.2", "2.2"], flags=["numbers"])

C("RPT-13", K, "Each level loads 30 rows at a time",
  [RPA, "Use a staging location whose Default row has more than 30 customers this month (open it once to check).", DESK],
  [SBT, "Open the Default row.", "Scroll to the last customer shown under Default."],
  [R(S("RPT-S1-R12"), "Sales by Tier opens."),
   R(S("RPT-S1-R12", "30 rows a page at every level (rows, customers, invoices), with more loading as the user scrolls."), "30 customers show under Default."),
   R(S("RPT-S1-R12", "with more loading as the user scrolls"), "More customers load under Default.", "No customer shows twice.")
   + R(S("RPT-S1-R7", "A bold \"Totals\" row stays at the bottom while scrolling"), "The Totals row stays at the bottom and its figures do not change.")],
  pics=["20.3"])

C("RPT-14", K, "No margin shows $0.00 and negative margins show a minus sign",
  [RPA, MX(d="Markup % 50"), TR("B", "A", "% Off 60"), TR("C", "A", "Markup % 0"), CU("B", "B"), CU("C", "C"),
   INVWO("1", "B", "a part in category A, cost $10.00, priced $6.00 by tier B"), INVWO("2", "C", "a part in category A, cost $100.00, priced $100.00 by tier C"), DESK],
  [SBT, "Pick customers B and C in the Customer filter.", "Click Download Summary (PDF) in the ⋯ menu.", "Click Download Summary (CSV) in the ⋯ menu."],
  [R(S("RPT-S1-R13"), "Sales by Tier opens."),
   R(S("RPT-S1-R13", "A row whose lines made no margin shows $0.00 Parts Margin; negative amounts show as negatives (\"−$12.40\") on screen, in the Totals and in every download."),
     "Tier C's row reads Parts Margin $0.00 ($100.00 − $100.00) and Parts Margin % 0.00%.",
     "Tier B's row reads Parts Margin −$4.00 ($6.00 − $10.00) and Parts Margin % −66.67% (−$4.00 ÷ $6.00).",
     "Totals read Parts Margin −$4.00 and Parts Margin % −3.77% (−$4.00 ÷ $106.00).")
   + R(QT("negative percentages \"−4.20%\"", "TPX-30", "TP2"), "The negative percentages carry a minus sign in front."),
   R(QT("PDF \"−$12.40\" and \"−4.20%\"", "TPX-30", "TP2"), "The PDF shows −$4.00 and −66.67% for tier B and −$4.00 in the Totals."),
   R(S("RPT-S4-E1", "Negative amounts download as negative numbers (S1-R13)."), "The CSV shows -4.00 for tier B's Parts Margin and -4.00 in the Totals row.")
   + R(QT("CSV \"-12.40\"", "TPX-30", "TP2"), "The CSV numbers have no $ sign and use a plain minus.")],
  pics=["20.2", "20.20"], flags=["numbers"])

C("RPT-15", K, "Margin % and % of Total show a dash when Parts Invoiced is zero or less",
  [RPA, MX(), TR(), CU(), CU("D", "Default"), INVWO("1", "A", TIERPART),
   INVWO("2", "D", "a found part with no cost and a typed price of −$5.00, and line 1 labor of $100.00 so the invoice total is positive"), DESK],
  [SBT, "Pick customers A and D in the Customer filter.", "Pick only customer D in the Customer filter."],
  [R(S("RPT-S1-R6"), "Sales by Tier opens."),
   R(S("RPT-S1-R6", "\"—\" when Parts Invoiced is $0.00 or less"), "The Manual row reads Parts Invoiced −$5.00 and Parts Margin % \"—\".")
   + R(S("RPT-S1-R6", "a negative row shows a negative share"),
       "The Manual row's % of Total reads −4.29% (−$5.00 ÷ $116.50); tier A's reads 104.29% ($121.50 ÷ $116.50).",
       "Totals read Parts Invoiced $116.50 ($121.50 − $5.00)."),
   R(S("RPT-S1-R6", "\"—\" when the Totals' Parts Invoiced is $0.00 or less"), "The Manual row and the Totals read \"—\" for % of Total (Totals' Parts Invoiced is −$5.00).",
     "Parts Margin % reads \"—\" too.")],
  pics=RP, flags=["numbers"])

C("RPT-16", K, "Hidden columns are remembered per report but the sort is not",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, CFA, "Click the Columns icon.", "Untick Parts Margin.", "Click the Parts Invoiced heading.", RELOAD, SBC_OPEN],
  [R(S("RPT-S1-R14"), "Sales by Tier opens."), R(S("RPT-S3-R4"), "Tier A's row shows customer A's $121.50 ($135.00 × 0.90 = $121.50)."),
   R(S("RPT-S1-R14", "A column chooser, remembered per browser, can hide Parts Cost, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total."),
     "The Columns list shows Parts Cost, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total, each ticked.")
   + R(S("RPT-S1-R14", "The first column and Parts Invoiced always show."), "Priced By and Parts Invoiced are not in the list."),
   R(S("RPT-S1-R14"), "The Parts Margin column is gone from the table.", "The other columns stay."),
   R(S("RPT-S3-R8"), "The rows sort by Parts Invoiced, biggest first."),
   R(S("RPT-S1-R14", "Only the column choice is remembered; the sort isn't, and the report always opens in its first-load order (S3-R7)."),
     "After the reload Parts Margin is still hidden.", "The rows are back in first-load order (Default first, then tiers by number).")
   + R(QD("Hide Parts Margin", "20.15", "RPT-S1-R14"), "The table matches picture 20.15 without Parts Margin."),
   R(QT("column choice remembered per report (20.16)", "TPX-26", "TP2"), "Sales by Category still shows its Parts Margin column (its own choice).")],
  pics=["20.14", "20.15", "20.16"])

C("RPT-17", K, "A date range with nothing invoiced shows the no-results message",
  [RPA, DESK],
  [SBT, "Pick Custom range in the Date filter.", "Type a From and To date in a month next year (for example Jan 1 and Jan 31, 2027)."],
  [R(S("RPT-S1-N1"), "Sales by Tier opens on this month."), R(QD("Custom range", "20.11", "RPT-S3-R1"), "From and To boxes show under Custom range."),
   R(S("RPT-S1-N1", "With default filters and nothing invoiced or credited in the date range, the report shows \"There are no results for selected date range\" and no Totals row."),
     "The table reads \"There are no results for selected date range\" under a calendar icon, with no Totals row.", "The Date chip shows the picked range.")],
  pics=["20.11"])

C("RPT-18", K, "Without Reports — Page Access the reports are not listed",
  [RPA, "Have a user for this test whose role does not have 'Reports — Page Access', signed in in a second browser window.",
   "Keep the address of Sales by Tier, copied from the first window.", DESK],
  [ "Open the main menu as that user.", "Open the copied Sales by Tier address as that user."],
  [R(S("RPT-S1-N2", "Without 'Reports — Page Access', the report isn't listed"), "The menu shows Work Orders and the other areas the role allows.", "Reports and the two reports are not listed."),
   R(S("RPT-S1-N2", "its link shows \"Access restricted\", as every report does"), "The page shows \"Access restricted\".", "No report figures show.")],
  pics=RP)

C("RPT-19", K, "A line priced for an earlier customer stays in its row under the new customer",
  BASE + [TR("B", "A", "% Off 20"), CU(), CU("B", "B"), CU("C", "A"),
          "Have a new work order for this test, work order 1, for customer A, with a part in category A priced $121.50 by tier A, then changed to customer B and invoiced today.",
          "Have a new work order for this test, work order 2, for customer C, with a part in category A priced $121.50 by tier A, then changed to customer B and invoiced today.", DESK],
  [SBT, "Pick customer B in the Customer filter.", "Open tier A's row.", "Click Download Expanded View (CSV) in the ⋯ menu."],
  [R(S("RPT-S1-E1"), "Sales by Tier opens."),
   R(S("RPT-S1-E1", "A part priced for one customer on a work order whose customer was later changed stays in the row of what priced it, under the invoice's customer"),
     "Tier A's row reads Parts Invoiced $243.00 ($121.50 + $121.50), not tier B's."),
   R(S("RPT-S2-R5", "An invoice is always listed under its own customer, with its own number and date, as on Sales by Customer."), "Customer B is listed under tier A with both invoices.")
   + R(S("RPT-S2-R5"), "Customers A and C are not listed under tier A."),
   R(S("RPT-S4-R4", "The expanded download names the customer a line was priced for when it differs from the invoice's customer (S1-E1), in a \"Priced For\" column."),
     "The CSV has a Priced For column: work order 1's invoice row names customer A, work order 2's names customer C.")
   + R(QT("\"Multiple\" for a row or Priced For spanning several", "TPX-28", "TP2"), "Customer B's row under tier A reads \"Multiple\" in Priced For (priced for customers A and C).")],
  pics=["20.3", "20.4"], flags=["numbers"])

C("RPT-20", K, "A line typed over a fixed price is in Manual",
  [RPA, MX(), CU("B", "Default"), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
   INVWO("1", "B", "that inventory part with its price typed over to $15.00"), DESK],
  [SBT, "Pick customer B in the Customer filter."],
  [R(S("RPT-S1-E2"), "Sales by Tier opens."),
   R(S("RPT-S1-E2", "A line typed over a fixed price is in Manual."), "The Manual row reads Parts Cost $10.00 and Parts Invoiced $15.00 for the category A part ($15.00 − $10.00 = $5.00 margin).", "No Fixed price row shows.")],
  pics=RP, flags=["numbers"])

C("RPT-21", K, "A fixed line total reports its parts amount in Fixed line total",
  BASE + [CU(), INVWO("1", "A", "line 1 with a fixed line total of $450.00 ($240.00 labor) holding two parts in category A, quantity 1 each, costs $30.00 and $10.00"), DESK],
  [SBT, CFA, "Open Reports › Sales By Customer.", CFA],
  [R(S("RPT-S1-E4"), "Sales by Tier opens."),
   R(S("RPT-S1-E4", "A fixed line total's parts are in Fixed line total, whatever the customer's tier"),
     "The Fixed line total row reads Parts Invoiced $210.00 ($450.00 − $240.00) and Parts Cost $40.00 ($30.00 + $10.00).",
     "Its Parts Margin reads $170.00 and Parts Margin % 80.95% ($170.00 ÷ $210.00).")
   + R(S("RPT-S1-E4"), "Tier A has no row for these parts."),
   R(S("RPT-S1-E4"), "Sales By Customer opens."),
   R(S("RPT-S1-E4", "The row reports the parts amount Sales by Customer counts for that line"), "Customer A's Parts Invoiced reads $210.00: $210.00 − $210.00 = $0.00.")],
  pics=RP, flags=["numbers"])

C("RPT-22", K, "A fixed line total with no quantity-1 part reports one cent less",
  BASE + [CU(), INVWO("1", "A", "line 1 with a fixed line total of $340.00 ($240.00 labor) holding one part in category A, quantity 3, cost $20.00 each"), DESK],
  [SBT, CFA],
  [R(S("RPT-S1-E4"), "Sales by Tier opens."),
   R(QT("when no part has quantity 1, the leftover cent moves to labor and the parts count one cent less", "TPX-40", "TP2"),
     "The Fixed line total row reads Parts Invoiced $99.99 ($100.00 ÷ 3 = $33.33 each; $33.33 × 3 = $99.99), not $100.00.")
   + R(S("TP-S10-R13", "any leftover cent goes on a part with a quantity of 1, or on the line's labor when there is none, as today"), "Its Parts Cost reads $60.00 (3 × $20.00).")],
  pics=RP, flags=["numbers"])

C("RPT-23", K, "Lines priced before the release are in Before tiers",
  [RPA, "Use staging, where invoices from before the release are kept.", "Note the date the release reached staging.", DESK],
  [SBT, "Pick Custom range in the Date filter.", "Type a range that ends before the release reached staging (for example the month before)."],
  [R(S("RPT-S1-E4"), "Sales by Tier opens."), R(S("RPT-S3-R1"), "From and To boxes show."),
   R(S("RPT-S1-E4", "Fixed line totals invoiced before release recorded no pricing source, so they are in Before tiers."),
     "Every invoiced part line of that range is in one row, Before tiers.", "No tier, Fixed price, Fixed line total or Manual row shows.")
   + R(S("TP-S12-R6", "Reports show them as \"Before tiers\"."), "The row reads Before tiers, with no number.")],
  pics=RP)

C("RPT-24", K, "A canned line's part is in the tier's row",
  BASE + [CU(), "Have a new canned line for this test with an inventory part in category A, cost $100.00.",
          "Have a new work order for this test, work order 1, for customer A, with that canned line added, invoiced today.", DESK],
  [SBT, CFA],
  [R(S("RPT-S1-E5"), "Sales by Tier opens."),
   R(S("RPT-S1-E5", "There is no canned line row. A part from a canned line is priced by the customer's tier when added and is in that tier's row."),
     "Tier A's row reads Parts Invoiced $121.50 ($135.00 × 0.90).", "No canned line row shows.")],
  pics=RP, flags=["numbers"])

C("RPT-25", K, "A single-part discount lowers that part's row",
  BASE + [CU(), INVWO("1", "A", f"{TIERPART}, with a $10.00 discount attached to that part only"), DESK],
  [SBT, CFA, "Open Reports › Sales By Customer.", CFA],
  [R(S("RPT-S1-E6"), "Sales by Tier opens."),
   R(S("RPT-S1-E6", "A discount on a single part line, on a work order or a Part Sale, lowers Parts Invoiced in the row of what priced that part, as on Sales by Customer."),
     "Tier A's row reads Parts Invoiced $111.50 ($121.50 − $10.00).", "Its Parts Margin reads $11.50 ($111.50 − $100.00)."),
   R(S("RPT-S1-E6"), "Sales By Customer opens."),
   R(S("RPT-S1-E6", "as on Sales by Customer"), "Customer A's Parts Invoiced reads $111.50: $111.50 − $111.50 = $0.00.")],
  pics=RP, flags=["numbers"])

C("RPT-26", K, "A line priced through Same as previous tier is in the customer's tier row",
  [RPA, MX(), TR("A", "A", "Markup % 20"), TR("B", "A", "Same as previous tier"),
   "Note that tiers A and B are made one right after the other with no other tier made in between, so tier B is the number right after tier A.", CU("B", "B"),
   INVWO("1", "B", "a part in category A, cost $100.00, priced $120.00 through tier B"), DESK],
  [SBT, "Pick customer B in the Customer filter."],
  [R(S("RPT-S1-E7"), "Sales by Tier opens."),
   R(S("RPT-S1-E7", "A line priced by a tier as Same as previous tier is in that tier's row (the customer's tier), not the tier it followed"),
     "Tier B's row reads Parts Invoiced $120.00 ($100.00 × 1.20, tier A's rule).", "Tier A has no row.")],
  pics=RP, flags=["numbers"])

C("RPT-27", K, "A Part Sale return counts as a negative credit after the restocking fee",
  [RPA, MX(), TR("A", "A", "Markup % 25"), CU("A", "A", "Part Sales"), INVPS("1", "A", "5 units of a part in category A, cost $16.00 each, priced $20.00 each by tier A"), DESK],
  [ "Return 2 units from Part Sale 1 with a $5.00 restocking fee, without applying the credit.", SBT, CFA],
  [R(S("RPT-S1-E8"), "A credit for the return is made today and left open."),
   R(S("RPT-S1-E8"), "Sales by Tier opens."),
   R(S("RPT-S1-E8", "A credit line that names a part line counts at the amount credited after any restocking fee, before tax, on the date the credit was created, whether or not it has been applied."),
     "Tier A's row reads Parts Credits −$35.00 (2 × $20.00 − $5.00 = $35.00), with no tax in it.",
     "Its Parts Net reads $65.00 ($100.00 − $35.00).")
   + R(QP("Margin and % of Total use Parts Invoiced.", "RPT-S1-R6"), "Its Parts Margin stays $20.00 ($100.00 − $80.00) and Parts Margin % 20.00%.")],
  pics=RP, flags=["numbers"])

C("RPT-28", K, "Goodwill, void and vendor credits are not in the reports",
  [RPA, MX(), TR("A", "A", "Markup % 25"), CU("A", "A", "Part Sales"), INVPS("1", "A", "5 units of a part in category A, cost $16.00 each, priced $20.00 each by tier A"), DESK],
  [ "Make a $50.00 goodwill credit for customer A on the customer page.", "Return 1 unit from Part Sale 1 with no restocking fee.", SBT, CFA, "Void the return's credit.",
   "Reload Sales by Tier.", "Open Reports › Sales By Customer.", CFA],
  [R(S("RPT-S1-E8"), "The goodwill credit is made."), R(S("RPT-S1-E8"), "A $20.00 credit for the return is made."), R(S("RPT-S1-E8"), "Sales by Tier opens."),
   R(S("RPT-S1-E8", "A credit with no part lines, such as one created on the customer page for goodwill, an overpayment, a fee or a write-off, is not in these reports"),
     "Tier A's row reads Parts Credits −$20.00, the return only (1 × $20.00).", "The $50.00 goodwill credit is not in any row."),
   R(S("RPT-S1-E8"), "The return's credit is void."),
   R(S("RPT-S1-E8", "Void credits and vendor credits never count."), "Tier A's row reads Parts Credits $0.00 again.", "Parts Invoiced still reads $100.00."),
   R(S("RPT-S1-E8"), "Sales By Customer opens."),
   R(S("RPT-S1-E8", "It still shows in Sales and Sales by Customer."), "Customer A's row there shows the $50.00 goodwill credit.")],
  pics=["20.2", "today:20.1"], flags=["numbers"])

C("RPT-29", K, "A return on an old invoice counts this month and never moves a past month",
  [RPA, "Use staging, where Part Sales invoiced before the release are kept.",
   "Have a Part Sale on staging invoiced before the release (last month or earlier) with a part line that can still be returned, for a customer you note as customer A.", DESK],
  [SBT, CFA, "Pick the month of that Part Sale's invoice in the Date filter.", "Note the Before tiers row's Parts Invoiced and Parts Credits.",
   "Return the part line from that Part Sale with no restocking fee.", "Pick This month in the Date filter.", "Pick the month of the Part Sale's invoice again in the Date filter."],
  [R(S("RPT-S1-E8"), "Sales by Tier opens on this month."), R(S("RPT-S1-E8"), "The Customer chip shows customer A."), R(S("RPT-S1-E8"), "The old month shows a Before tiers row."),
   R(S("RPT-S1-E8"), "Both figures are noted."), R(S("RPT-S1-E8"), "A credit for the return is made today."),
   R(S("RPT-S1-E8", "a credit on a line priced before release is in Before tiers"), "This month shows a Before tiers row with the return's credit as a negative Parts Credits figure."),
   R(S("RPT-S1-E8", "A credit never changes the original invoice or a past month."), "The old month's Before tiers row shows the same Parts Invoiced and Parts Credits as noted.", "No new credit shows in that month.")],
  pics=RP)

C("RPT-30", K, "A credit on a reissued invoice counts in its line's tier row",
  BASE + [CU(), "Have a new work order for this test, work order 1, for customer A, with a part in category A priced $121.50 by tier A, invoiced, its invoice voided, then invoiced again today.", DESK],
  [ "Make a credit memo for the part line of work order 1's new invoice (for example $40.00).", SBT, CFA],
  [R(S("RPT-S1-E8"), "A credit memo naming the part line is made today."), R(S("RPT-S1-E8"), "Sales by Tier opens."),
   R([S("RPT-S1-E8", "A credit line is in the row and category of the part line it credits, at the original invoiced price"), QT("A part line on several invoices (voided then reissued): a credit goes to the latest non-void invoice's row", "TPX-33", "TP2")],
     "Tier A's row reads Parts Invoiced $121.50 (the voided invoice counts nothing) and Parts Credits −$40.00.", "Parts Net reads $81.50 ($121.50 − $40.00).")],
  pics=RP, flags=["numbers"])

C("RPT-31", K, "A warranty part typed to $0 is Manual and a no-cost part is in the tier",
  BASE + [CU(), INVWO("1", "A", "a special-order part in category A, cost $100.00, typed to $0.00 as warranty, and a part in category A with no cost"), DESK],
  [SBT, CFA],
  [R(S("RPT-S1-E9"), "Sales by Tier opens."),
   R(S("RPT-S1-E9", "Warranty parts are typed to $0 and are in Manual. A part with no cost is in the customer's tier at $0."),
     "The Manual row reads Parts Cost $100.00, Parts Invoiced $0.00 and Parts Margin −$100.00 ($0.00 − $100.00), Parts Margin % \"—\".",
     "Tier A's row reads Parts Cost $0.00 and Parts Invoiced $0.00.")],
  pics=RP, flags=["numbers"])

# ---- Story 2: opening rows ------------------------------------------------------------------------------------------------------
C("RPT-32", K, "Rows open to customers, then to their invoices and credits",
  BASE + [CU(), CU("B", "A"), INVWO("1", "A", TIERPART), INVWO("2", "A", "a part in category A, cost $200.00, priced $243.00 by tier A"),
          INVWO("3", "B", TIERPART), DESK],
  [SBT, "Pick customers A and B in the Customer filter.", "Open tier A's row.", "Open customer A's row under tier A."],
  [R(S("RPT-S2-R1", "Each report opens with every row closed."), "Every row shows closed."),
   R(S("RPT-S2-R1"), "Tier A's row reads Parts Invoiced $486.00 ($121.50 + $243.00 + $121.50)."),
   R(S("RPT-S2-R2", "Opening a row lists the invoices' and credits' customers for the lines in that row, with the same columns for that customer's lines in the row only."),
     "Customer A reads $364.50 ($121.50 + $243.00), 75.00% of total; customer B reads $121.50, 25.00%.")
   + R(S("RPT-S2-R4", "Each level adds up to the row above it."), "$364.50 + $121.50 = $486.00, tier A's figure."),
   R(S("RPT-S2-R3", "Opening a customer lists their invoices and credits with the row's lines on them, each with its date and the same columns for those lines only."),
     "Work order 1's invoice reads $121.50 (25.00%) and work order 2's $243.00 (50.00%), each with its number and today's date.")
   + R(S("RPT-S2-R4"), "$121.50 + $243.00 = $364.50, customer A's figure; 25.00% + 50.00% = 75.00%.")],
  pics=["20.3", "20.4"], flags=["numbers"])

C("RPT-33", K, "A customer priced by two tiers shows under both without double counting",
  BASE + [TR("B", "A", "% Off 20"), CU(), INVWO("1", "A", TIERPART), "Make sure customer A was moved to tier B after work order 1 was invoiced.",
          INVWO("2", "A", "a part in category A, cost $100.00, priced $108.00 by tier B"), DESK],
  [SBT, CFA, "Open tier A's row.", "Open tier B's row."],
  [R(S("RPT-S2-R2"), "Sales by Tier opens."),
   R(S("RPT-S2-R2"), "Tier A reads $121.50, tier B $108.00, Totals $229.50 ($121.50 + $108.00)."),
   R(S("RPT-S2-R2", "A customer priced by two tiers shows under both."), "Customer A is listed under tier A with $121.50."),
   R(S("RPT-S2-R2", "A customer priced by two tiers shows under both."), "Customer A is listed under tier B with $108.00.", "Totals still read $229.50.")],
  pics=["20.3"], flags=["numbers"])

C("RPT-34", K, "An invoice with no customer is under No Company",
  [RPA, MX(), "Have a new Part Sale for this test with no customer picked, with a part in category A, cost $100.00, priced $135.00 by Default, invoiced today.", DESK],
  [SBT, "Open the Default row."],
  [R(S("RPT-S2-R2"), "Sales by Tier opens."),
   R(S("RPT-S2-R2", "Invoices with no customer are under \"No Company\", as on Sales by Customer."), "A \"No Company\" customer is listed under Default.", "Its invoices include the new Part Sale's $135.00 (the category A part, $100.00 × 1.35).")],
  pics=["20.3"])

C("RPT-35", K, "Invoice and credit numbers link with the date beside them, oldest first",
  [RPA, MX(), TR("A", "A", "Markup % 25"), CU("A", "A", "work orders and Part Sales"), INVWO("1", "A", "a part in category A, cost $16.00, priced $20.00 by tier A"),
   INVPS("1", "A", "2 units of a part in category A, cost $16.00 each, priced $20.00 each by tier A, one unit then returned"), DESK],
  [SBT, CFA, "Open tier A's row.", "Open customer A's row.", "Click work order 1's invoice number.", "Go back to Sales by Tier.", "Click the credit's number."],
  [R(S("RPT-S2-R3"), "Sales by Tier opens."), R(S("RPT-S2-R3"), "Tier A's row reads Parts Invoiced $60.00 ($20.00 + 2 × $20.00) and Parts Credits −$20.00."),
   R(S("RPT-S2-R3"), "Customer A is listed."),
   R(QT("On screen the date sits beside the number in the first column, in muted text, as design 20.4 shows: \"Invoice 10510 · Oct 2, 2026\"", "TPX-27", "TP2"),
     "Rows read \"Invoice\" with the number, a middle dot and today's date in gray, and the credit reads \"Credit\" with its number and date.")
   + R(QT("First-load order of documents is date oldest first, then number smallest first", "TPX-27", "TP2"), "Invoices and the credit are listed by date, then by number, smallest first."),
   R(S("RPT-S2-R3", "An invoice or credit number links to it (the work order's Finance tab or the Part Sale"), "Work order 1 opens on its Finance tab."),
   R(S("RPT-S2-R3"), "Sales by Tier shows again."),
   R(S("RPT-S2-R3", "a credit opens its PDF in a new tab, since ShopView has no page for a single credit"), "The credit's PDF opens in a new browser tab.")],
  pics=["20.4"], flags=["numbers"])

C("RPT-36", K, "Numbers from another location or not allowed to open are plain text",
  [RPA, "Use a staging client with two locations, location 1 and location 2.", MX(), TR(), CU(), INVWO("1", "A", TIERPART),
   "Have a new work order for this test, work order 2, at location 2, for customer A, with a part in category A, invoiced today.",
   "Have a second user for this test with 'Reports — Page Access' at location 1 but not 'See Financial Data', signed in in a second browser window.", DESK],
  [SBT, "Pick location 1 and location 2 in the Location filter.", CFA, "Open tier A's row.", "Open customer A's row.", "Open the same rows as the second user."],
  [R(S("RPT-S2-N1"), "Sales by Tier opens at location 1."), R(S("RPT-S3-R2"), "Both locations are picked."), R(S("RPT-S2-N1"), "The Customer chip shows customer A."),
   R(S("RPT-S2-N1"), "Customer A is listed."),
   R(S("RPT-S2-N1", "An invoice or credit from another location, or one the user may not open, shows its number as plain text (S2-R3)."),
     "Work order 1's invoice number is a blue link.", "Work order 2's invoice number (location 2) is plain text."),
   R(S("RPT-S2-N1", "or one the user may not open"), "For the second user, work order 1's invoice number is plain text.", "Its figures still show.")],
  pics=["20.4"])

# ---- Story 3: filters and sorting -------------------------------------------------------------------------------------------------
C("RPT-37", K, "The date range defaults to this month and allows one year at most",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, "Open the Date filter.", "Pick Custom range.", "Type a From date more than a year before the To date (for example 01/01/2025 to 10/31/2026).",
   "Type a From and To date that both are yesterday.", "Type a From and To date that both are today.", CFA],
  [R(S("RPT-S3-R1", "Date range: the first chip; required, this month by default"), "The first chip reads \"Date: This month\" and is blue."),
   R(QD("Year to date", "20.10", "RPT-S3-R1"), "The list reads This month, Last month, This quarter, Last 90 days, Year to date and Custom range."),
   R(QD("One year at most.", "20.11", "RPT-S3-R1"), "From and To boxes show with the help text \"One year at most.\""),
   R(QT("over-a-year message \"Choose a date range of one year or less.\"", "TPX-23", "TP2"), "Under the boxes it reads \"Choose a date range of one year or less.\" in red.")
   + R(S("RPT-S3-R1", "one year at most"), "The report keeps its last valid range."),
   R(S("RPT-S1-R2", "Lines are dated by the date their invoice was created"), "With yesterday as the range, the report reads \"There are no results for selected date range\": work order 1 was invoiced today.", "The Date chip shows yesterday's date."),
   R(S("RPT-S1-R2"), "With today only, the range is applied."),
   R(S("RPT-S1-R2", "Lines are dated by the date their invoice was created"), "Tier A's row reads Parts Invoiced $121.50 ($135.00 × 0.90).")],
  pics=["20.10", "20.11"], flags=["numbers"])

C("RPT-38", K, "Filters accept at most 50 picked values in total",
  [RPA, "Use a staging location with more than 55 customers invoiced this month.", DESK],
  [SBT, "Tick 50 customers in the Customer filter.", "Tick one more customer.", "Open the Priced By filter."],
  [R(S("RPT-S3-R1"), "Sales by Tier opens."), R(S("RPT-S3-R1"), "50 customers are ticked."),
   R(S("RPT-S3-R1", "the shared filter bar allows at most 50 picked values across all filters"), "The 51st customer is not taken: 50 stay ticked.", "The report shows the 50 customers' rows."),
   R(S("RPT-S3-R1", "\"All\" doesn't count toward it."), "Priced By still has every option ticked (All).", "Those ticks do not count toward the 50.")],
  pics=["20.6"])

C("RPT-39", K, "Priced By lists every tier, archived ones marked, then the other sources",
  BASE + [TR("B", "A", "% Off 20", ", archived"), DESK],
  [SBT, "Open the Priced By filter."],
  [R(S("RPT-S3-R3"), "Sales by Tier opens with a plain Priced By chip."),
   R(S("RPT-S3-R3", "Priced By: lists every tier (archived ones marked \"(archived)\"), then Fixed price, Fixed line total, Manual and Before tiers. All selected by default."),
     "The list shows every tier, tier A among them, and tier B with \"(archived)\" after its name.",
     "After the tiers it lists Fixed price, Fixed line total, Manual and Before tiers, in that order.",
     "Every option is ticked.")],
  pics=["20.5"])

C("RPT-40", K, "Category lists Uncategorized first, then A to Z, on both reports",
  [RPA, "Have two new categories for this test, category A named Aaa Test Category and category B named Zzz Test Category.", DESK],
  [SBT, "Open the Category filter.", SBC_OPEN, "Open the Category filter."],
  [R(S("RPT-S3-R9"), "Sales by Tier opens."),
   R(S("RPT-S3-R9", "Category: lists every category with Uncategorized first, then A to Z. All selected by default."),
     "Uncategorized is first.", "Category A comes before category B, with the other categories A to Z.", "Every category is ticked."),
   R(S("RPT-S3-R9", "Both reports have it."), "Sales by Category opens with a Category chip."),
   R(S("RPT-S3-R9"), "The list is the same: Uncategorized first, then A to Z.")],
  pics=["20.7"])

C("RPT-41", K, "The Customer filter finds customers, including one with only a credit",
  [RPA, MX(), TR("A", "A", "Markup % 25"), CU("A", "A", "Part Sales"), CU("B", "A", "Part Sales"),
   INVPS("1", "A", "a part in category A priced $20.00 by tier A"),
   "Before the day of the test, have a new Part Sale for this test, Part Sale 2, for customer B, with a part in category A priced $20.00 by tier A, invoiced; return it on the test day.", DESK],
  [SBT, "Pick Custom range in the Date filter with today as From and To.", "Type customer B's name in the Customer filter's search.", "Tick customer B.", "Tick customer A.", "Clear the Customer filter."],
  [R(S("RPT-S3-R4"), "Sales by Tier opens."), R(S("RPT-S3-R1"), "The report shows today's range: customer B's one activity today is the return's credit."),
   R([S("RPT-S3-R4"), QT("over invoices and credits in scope", "TPX-29", "TP2")], "Customer B is found."),
   R(S("RPT-S3-R4"), "Customer B's lines show: tier A with Parts Invoiced $0.00 and Parts Credits −$20.00 (1 × $20.00)."),
   R(S("RPT-S3-R4", "Customer: search for one or more customers, as on Sales by Customer."), "Customers A and B's lines show together; tier A's row reads Parts Invoiced $20.00 from customer A."),
   R(S("RPT-S3-R4", "Empty means all."), "Every customer's lines show again.")],
  pics=["20.6"], flags=["numbers"])

C("RPT-42", K, "Sales Type splits Part Sales from Work Orders and names the chip",
  BASE + [CU("A", "A", "work orders and Part Sales"), INVWO("1", "A", TIERPART), INVPS("1", "A", "a part in category A, cost $200.00, priced $243.00 by tier A"), DESK],
  [SBT, CFA, "Open the Sales Type filter.", "Untick Part Sales.", "Untick Work Orders.", "Tick both options again."],
  [R(S("RPT-S3-R5"), "Sales by Tier opens."),
   R(S("RPT-S3-R5"), "Tier A reads Parts Invoiced $364.50 ($121.50 + $243.00)."),
   R(S("RPT-S3-R5", "Sales Type: two options, \"Part Sales\" (Part Sale invoices and their credits) and \"Work Orders\" (work order invoices, including their parts), both selected by default."),
     "The options read Part Sales and Work Orders, both ticked."),
   R(S("RPT-S3-R5", "The closed filter reads \"Sales Type: All\", the one option picked, or \"Sales Type: None\"."), "The chip reads \"Sales Type: Work Orders\" in blue.",
     "Tier A reads $121.50, the work order's part ($364.50 − $243.00 = $121.50)."),
   R(S("RPT-S3-R5"), "The chip reads \"Sales Type: None\".")
   + R(S("RPT-S3-N1", "including no Sales Type selected"), "The report reads \"No record matches these filters\" with no Totals row."),
   R([S("RPT-S3-R5", "The closed filter reads \"Sales Type: All\""), QT("closed chips read \"All\", X restores All (20.2)", "TPX-25", "TP2")], "The chip reads \"Sales Type: All\" and is plain.", "Tier A reads $364.50 again.")],
  pics=["20.9", "20.21"], flags=["numbers"])

C("RPT-43", K, "Location opens on your location and adds a Location column for two",
  [RPA, "Use a staging client with two locations, location 1 and location 2, and a user who can work at both, signed in at location 1.", MX(), TR(), CU(),
   INVWO("1", "A", TIERPART), "Have a new work order for this test, work order 2, at location 2, for customer A, with a part in category A priced $121.50, invoiced today.", DESK],
  [SBT, CFA, "Open the Location filter.", "Tick location 2.", "Open tier A's row."],
  [R(S("RPT-S3-R2", "Location: the last chip, following the report standard."), "The last chip reads \"Location:\" with location 1, in blue."),
   R(S("RPT-S3-R2", "opens on the signed-in location"), "Tier A reads Parts Invoiced $121.50, from location 1 ($135.00 × 0.90 = $121.50)."),
   R(QD("Location filter", "20.8", "RPT-S3-R2"), "The list shows location 1 ticked and location 2, with Clear selection under them."),
   R(S("RPT-S3-R2", "It is multi-select"), "Tier A reads $243.00 ($121.50 + $121.50).")
   + R(S("RPT-S3-R2", "A Location column shows only when more than one location is in scope."), "A Location column shows."),
   R(QT("\"Multiple\" for a row or Priced For spanning several", "TPX-28", "TP2"), "Customer A's Location reads \"Multiple\".")
   + R(S("RPT-S3-R2", "Tiers apply to the whole client, so this shows a location's sales by tier."), "Its invoices read location 1 and location 2.")],
  pics=["20.8", "20.3"], flags=["numbers"])

C("RPT-44", K, "A user with one location sees no Location chip",
  [RPA, "Have a user for this test with 'Reports — Page Access' who can work at one location only, signed in in a second browser window.", DESK],
  [ "Open Reports › Sales by Tier as that user."],
  [R(S("RPT-S3-R2", "is hidden for users with one location"), "The chips read Date, Sales Type, Priced By, Category and Customer.", "No Location chip shows.")],
  pics=RP)

C("RPT-45", K, "A link to a location the user can't access is refused",
  [RPA, "Use a staging client with two locations, location 1 and location 2.",
   "Have a user for this test with 'Reports — Page Access' at location 1 only, signed in in a second browser window.", DESK],
  [SBT, "Pick only location 2 in the Location filter.", "Copy the page address.", "Open the copied address as the second user."],
  [R(S("RPT-S3-R2"), "Sales by Tier opens."), R(S("RPT-S3-R2"), "The Location chip shows location 2."), R(S("RPT-S3-R6"), "The address is copied."),
   R(S("RPT-S3-R2", "A location the user can't access is refused with \"Unknown location\"."), "The report shows \"Unknown location\".", "No figures from location 2 show.")],
  pics=["20.8"])

C("RPT-46", K, "The Location pick carries over when switching location",
  [RPA, "Use a staging client with two locations, location 1 and location 2, and a user who can work at both, signed in at location 1.", DESK],
  [SBT, "Tick location 2 in the Location filter.", "Switch to location 2 at the top right.", SBC_OPEN],
  [R(S("RPT-S3-R2"), "Sales by Tier opens on location 1."), R(S("RPT-S3-R2"), "The Location chip shows both locations."),
   R(S("RPT-S3-R2", "carries over when the user switches location"), "Sales by Tier still shows both locations in the Location chip."),
   R(QT("filters carry between the two reports through the nav link (RPT-S3-R11)", "TPX-37", "TP2"), "Sales by Category shows both locations too.")],
  pics=["20.8", "20.16"])

C("RPT-47", K, "Opening a filter puts the cursor in its search box",
  [RPA, DESK],
  [SBT, "Open the Customer filter.", "Type a.", "Open the Category filter.", "Type b."],
  [R(S("RPT-S3-R10"), "Sales by Tier opens."),
   R(S("RPT-S3-R10", "Opening a filter's dropdown puts the cursor in its search box."), "The cursor blinks in \"Search customers\"."),
   R(S("RPT-S3-R10"), "The customer list narrows to names with an a."),
   R(S("RPT-S3-R10", "Opening a filter's dropdown puts the cursor in its search box."), "The cursor blinks in \"Search categories\"."),
   R(S("RPT-S3-R10"), "The category list narrows to names with a b.")],
  pics=["20.6", "20.7"])

C("RPT-48", K, "Chips are blue only with a specific pick, Date and Location always",
  [RPA, "Use a staging client with two locations, signed in at location 1.", DESK],
  [SBT, "Untick one option in the Priced By filter.", "Tick it again.", "Click Clear selection in the Location filter."],
  [R(S("RPT-S3-R12", "Date range and Location always do, so they are always blue."), "The Date and Location chips are blue.")
   + R(S("RPT-S3-R12", "Every other filter is plain when it is All or nothing is picked"), "Sales Type, Priced By, Category and Customer are plain."),
   R(S("RPT-S3-R12", "A filter chip shows as selected (blue) only when it holds a specific selection."), "The Priced By chip turns blue with its picks."),
   R(S("RPT-S3-R12", "the shared filter chip treats a filter whose default is all selected (Priced By, Category, Sales Type) as nothing picked, so it is plain when all are selected"),
     "The Priced By chip is plain again."),
   R(QT("Location chip not clearable (20.9 \"always blue\")", "TPX-24", "TP2"), "The Location chip still holds a location and stays blue.")],
  pics=["20.2", "20.5", "20.8"])

C("RPT-49", K, "Filters live in the page address for reload, links and back",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, CFA, "Untick Part Sales in the Sales Type filter.", RELOAD, "Copy the page address into a new browser tab.", "Click the browser's Back button in the first tab.",
   "Open Reports › Sales by Tier from the reports menu."],
  [R(S("RPT-S3-R6"), "Sales by Tier opens with default filters."), R(S("RPT-S3-R6"), "The Customer chip shows customer A."), R(S("RPT-S3-R6"), "The chip reads Sales Type: Work Orders."),
   R(S("RPT-S3-R6", "Filters are kept in the page address, so back, reload, a link or a bookmark reopens the same view."), "After the reload customer A and Work Orders are still picked."),
   R(S("RPT-S3-R6", "a link"), "The new tab opens with customer A and Work Orders picked."),
   R(S("RPT-S3-R6", "back"), "The first tab shows the view before Work Orders was picked (customer A, Sales Type plain)."),
   R(S("RPT-S3-R6", "A new visit starts from the defaults."), "The report opens with this month, your location and every other filter at All.")],
  pics=RP)

C("RPT-50", K, "Switching to Sales by Category carries filters, closes rows and resets sort",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, CFA, "Untick Part Sales in the Sales Type filter.", "Click the Parts Margin heading.", "Open tier A's row.", "Click Sales by Category in the reports menu.",
   "Open Reports › Parts Velocity.", "Click Sales by Tier in the reports menu."],
  [R(S("RPT-S3-R11"), "Sales by Tier opens."), R(S("RPT-S3-R11"), "The Customer chip shows customer A."), R(S("RPT-S3-R11"), "Sales Type reads Work Orders."),
   R(S("RPT-S3-R8"), "Rows sort by Parts Margin, biggest first."), R(S("RPT-S2-R2"), "Customer A shows under tier A."),
   R(S("RPT-S3-R11", "Switching between the two reports carries the shared filters (date range, Location, Sales Type, Customer, Category, Priced By) in the page address, closes open rows and resets the sort."),
     "Sales by Category opens with customer A and Work Orders picked.", "Every row is closed and the rows are in first-load order (Uncategorized first)."),
   R(QT("filters carry between the two reports through the nav link (RPT-S3-R11)", "TPX-37", "TP2"), "Parts Velocity opens."),
   R(QT("filters carry between the two reports through the nav link (RPT-S3-R11)", "TPX-37", "TP2"), "Sales by Tier opens with default filters: customer A is not picked.",
     "Sales Type is plain.")],
  pics=["20.16"])

C("RPT-51", K, "First load lists tiers by number, archived in archive order, then the rest",
  [RPA, MX(), TR("A", "A", "% Off 10"), TR("B", "A", "% Off 20", ", made after tier A"), TR("C", "A", "% Off 30"), TR("D", "A", "% Off 40"),
   "Have new customers for this test, customers A, B, C and D, each put on the tier with its letter for work orders, and customer E left on Default.",
   "Have a new work order for this test, invoiced today, for each of customers A to E, each with one part in category A, cost $100.00; customer E's work order also has a fixed-price part, a part with a typed price and a fixed line total.",
   "Make sure tier D was archived first and tier C second, after their customers were moved to Default and their work orders invoiced.", DESK],
  [SBT, "Pick customers A to E in the Customer filter."],
  [R(S("RPT-S3-R7"), "Sales by Tier opens."),
   R(S("RPT-S3-R7", "On first load, Sales by Tier's rows are in tier number order (Default first, then active tiers, then archived tiers in the order they were archived), then Fixed price, Fixed line total, Manual and Before tiers."),
     "Rows read, in order: Default, tier A, tier B, tier D (archived), tier C (archived), Fixed price, Fixed line total, Manual.")],
  pics=["20.2"])

C("RPT-52", K, "Number columns sort biggest first, then reversed, then first-load order",
  BASE + [TR("B", "A", "Markup % 50"), CU(), CU("B", "B"), CU("C", "Default"),
          INVWO("1", "A", TIERPART), INVWO("2", "B", "a part in category A, cost $100.00, priced $150.00 by tier B"),
          INVWO("3", "C", "a part in category A, cost $100.00, priced $135.00 by Default"), DESK],
  [SBT, "Pick customers A, B and C in the Customer filter.", "Click the Parts Margin heading.", "Click the Parts Margin heading again.", "Click the Parts Margin heading a third time."],
  [R(S("RPT-S3-R8"), "Sales by Tier opens."), R(S("RPT-S3-R7"), "Rows read Default, tier A, tier B (first-load order)."),
   R(S("RPT-S3-R8", "The first click on text sorts A to Z and on a number column biggest first"),
     "Rows read tier B ($150.00 − $100.00 = $50.00), Default ($35.00), tier A ($21.50).")
   + R(QD("Result: First click on a number column puts the biggest on top", "20.13", "RPT-S3-R8"), "An arrow shows on the Parts Margin heading, as in picture 20.13."),
   R(S("RPT-S3-R8", "the second click reverses"), "Rows read tier A ($21.50), Default ($35.00), tier B ($50.00)."),
   R(S("RPT-S3-R8", "the third returns to the first-load order (S3-R7)"), "Rows read Default, tier A, tier B again.")],
  pics=["20.12", "20.13"], flags=["numbers"])

C("RPT-53", K, "Parts Credits puts the largest credit on top and text sorts A to Z",
  [RPA, MX(), TR("A", "A", "Markup % 25"), TR("B", "A", "Markup % 25"), CU("A", "A", "Part Sales"), CU("B", "B", "Part Sales"),
   INVPS("1", "A", "5 units of a part in category A priced $20.00 each by tier A, 1 unit returned today"),
   INVPS("2", "B", "5 units of a part in category A priced $20.00 each by tier B, 3 units returned today"), DESK],
  [SBT, "Pick customers A and B in the Customer filter.", "Click the Parts Credits heading.", "Click the Priced By heading."],
  [R(S("RPT-S3-R8"), "Sales by Tier opens."), R(S("RPT-S3-R8"), "Tier A shows −$20.00 and tier B −$60.00 in Parts Credits."),
   R(S("RPT-S3-R8", "Parts Credits are negative, so the first click puts the largest credit on top."), "Tier B (−$60.00, 3 × $20.00) is above tier A (−$20.00)."),
   R(S("RPT-S3-R8", "The first click on text sorts A to Z"), "Rows sort A to Z by their shown names.")],
  pics=["20.13"], flags=["numbers"])

C("RPT-54", K, "Changing the sort closes open rows and customers sort within their row",
  BASE + [CU(), CU("B", "A"), INVWO("1", "A", TIERPART), INVWO("2", "B", "a part in category A, cost $200.00, priced $243.00 by tier A"), DESK],
  [SBT, "Pick customers A and B in the Customer filter.", "Open tier A's row.", "Click the Parts Invoiced heading.", "Open tier A's row again."],
  [R(S("RPT-S3-R8"), "Sales by Tier opens."), R(S("RPT-S2-R2"), "Customers A and B show under tier A."),
   R(QT("a sort change closes open rows, as SBC", "TPX-34", "TP2"), "Tier A's row closes.", "The rows sort by Parts Invoiced."),
   R(S("RPT-S2-R2"), "Customers A and B show under tier A again."), R(S("RPT-S3-R8", "Customers and invoices sort the same way within their row."), "Customer B ($200.00 × 1.35 × 0.90 = $243.00) is listed above customer A ($121.50).")],
  pics=["20.3", "20.13"], flags=["numbers"])

C("RPT-55", K, "Filters that match nothing show the no-match message",
  [RPA, DESK],
  [SBT, "Untick Part Sales in the Sales Type filter.", "Untick Work Orders.", "Click Clear All Filters."],
  [R(S("RPT-S3-N1"), "Sales by Tier opens."), R(S("RPT-S3-N1"), "The chip reads Sales Type: Work Orders."),
   R(S("RPT-S3-N1", "Filters that match nothing, including no Sales Type selected, show \"No record matches these filters\", \"Try changing filters to widen your results.\" and a \"Clear All Filters\" button, and no Totals row."),
     "The table reads \"No record matches these filters\" and \"Try changing filters to widen your results.\" with a Clear All Filters button.", "No Totals row shows."),
   R(S("RPT-S3-N1"), "The filters go back to their defaults and the rows return.")],
  pics=["20.21", "20.23"])

C("RPT-56", K, "A filter search with no match keeps the picks",
  [RPA, DESK],
  [SBT, "Untick one category in the Category filter.", "Type zzzz in the Category filter's search."],
  [R(S("RPT-S3-E1"), "Sales by Tier opens."), R(S("RPT-S3-E1"), "The Category chip turns blue."),
   R(S("RPT-S3-E1", "A filter search with no match shows no options and keeps the current picks."), "The list shows no options.", "The Category chip stays blue with the same picks.")],
  pics=["20.7"])

# ---- Story 4: downloads -------------------------------------------------------------------------------------------------------------
C("RPT-57", K, "The ⋯ menu offers four downloads",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, CFA, "Open the ⋯ menu.", "Click Download Summary (PDF).", "Click Download Expanded View (PDF) in the ⋯ menu.", "Click Download Summary (CSV) in the ⋯ menu.",
   "Click Download Expanded View (CSV) in the ⋯ menu."],
  [R(S("RPT-S4-R1"), "Sales by Tier opens."), R(S("RPT-S3-R4"), "Tier A's row shows customer A's $121.50."),
   R(S("RPT-S4-R1", "The ⋯ menu offers four downloads for each report: \"Download Summary (PDF)\", \"Download Expanded View (PDF)\", \"Download Summary (CSV)\" and \"Download Expanded View (CSV)\"."),
     "The menu lists Download Summary (PDF), Download Expanded View (PDF), Download Summary (CSV) and Download Expanded View (CSV)."),
   R(S("RPT-S4-R1"), "A PDF file downloads."), R(S("RPT-S4-R1"), "A second PDF file downloads."), R(S("RPT-S4-R1"), "A CSV file downloads."), R(S("RPT-S4-R1"), "A second CSV file downloads.")],
  pics=["20.18"])

C("RPT-58", K, "Summary has rows and Totals, Expanded has every level",
  [RPA, MX(), TR("A", "A", "Markup % 25"), CU("A", "A", "Part Sales"), INVPS("1", "A", "5 units of a part in category A, cost $16.00 each, priced $20.00 each by tier A, 2 units returned today with a $5.00 restocking fee"), DESK],
  [SBT, CFA, "Click Download Summary (CSV) in the ⋯ menu.", "Click Download Expanded View (CSV) in the ⋯ menu."],
  [R(S("RPT-S4-R2"), "Sales by Tier opens with every row closed."), R(S("RPT-S4-R2"), "Tier A reads Parts Invoiced $100.00 and Parts Credits −$35.00."),
   R(S("RPT-S4-R2", "Summary has the rows and the Totals."), "The Summary CSV has tier A's row and a Totals row (Parts Invoiced 100.00 = 5 × 20.00).", "It has nothing below them."),
   R(S("RPT-S4-R2", "Expanded has every level (rows, then the levels under them, down to invoices and credits) whatever is open on screen."),
     "The Expanded CSV has tier A's row, customer A under it, and Part Sale 1's invoice ($100.00) and the credit (-35.00) under customer A, though nothing was open.")
   + R(QT("In the Expanded download, a credit row's \"Invoice #\" cell reads its credit number (for example \"CM-5003\"), and its \"Date\" cell the credit's date", "TPX-32", "TP2"),
       "The credit row's Invoice # is the credit's number and its Date is today.")],
  pics=["20.18", "20.20"], flags=["numbers"])

C("RPT-59", K, "Downloads follow the filters, sort and shown columns",
  BASE + [TR("B", "A", "% Off 20", ", archived after customer B's invoice"), CU(), CU("B", "B"), INVWO("1", "A", TIERPART),
          INVWO("2", "B", "a part in category A, cost $100.00, priced $108.00 by tier B"), DESK],
  [SBT, "Pick customers A and B in the Customer filter.", "Untick Parts Cost in the Columns list.", "Click the Parts Invoiced heading.", "Click Download Summary (CSV) in the ⋯ menu.",
   "Click Download Summary (PDF) in the ⋯ menu."],
  [R(S("RPT-S4-R3"), "Sales by Tier opens."), R(S("RPT-S4-R3"), "Tier A reads $121.50 and tier B (archived) $108.00."), R(S("RPT-S1-R14"), "Parts Cost is hidden."),
   R(S("RPT-S3-R8"), "Tier A ($121.50) is above tier B ($108.00)."),
   R(S("RPT-S4-R3", "Both use the current filters, sort and shown columns, and show Priced By in plain text, with tier numbers and \"(archived)\" as on screen (S1-R11)."),
     "The CSV lists tier A before tier B, with customers A and B's figures ($121.50 + $108.00 = $229.50 in Totals).", "It has no Parts Cost column.",
     "Tier A reads its number and name; tier B reads its name with \"(archived)\".")
   + R(S("RPT-S1-R14", "Downloads follow the columns shown."), "The CSV's other columns are the ones shown on screen."),
   R(S("RPT-S4-R3"), "The PDF shows the same rows, order, columns and labels as the CSV.")],
  pics=["20.15", "20.20"], flags=["numbers"])

C("RPT-60", K, "A PDF over 2,000 rows is refused with the export message",
  [RPA, "Use a staging location whose invoices in the last 12 months fill more than 2,000 rows in the Expanded View (check with the Expanded CSV in step 3).", DESK],
  [SBT, "Pick Custom range in the Date filter with the last 12 months.", "Click Download Expanded View (CSV) in the ⋯ menu.", "Click Download Expanded View (PDF) in the ⋯ menu.",
   "Click Download Summary (PDF) in the ⋯ menu."],
  [R(S("RPT-S4-R5"), "Sales by Tier opens."), R(S("RPT-S4-R5"), "The report shows the 12 months."),
   R(S("RPT-S4-R5", "A PDF covers up to 2,000 rows and a CSV up to 50,000."), "The Expanded CSV downloads with more than 2,000 data rows."),
   R(S("RPT-S4-R5", "Above that, the download is refused with \"This report is too large to export. Choose a shorter date range, then try again.\""),
     "A message reads \"This report is too large to export. Choose a shorter date range, then try again.\"")
   + R(S("RPT-S4-N1", "A download over its limit is refused with the message in S4-R5, and no file is made."), "No PDF file is made."),
   R(S("RPT-S4-R5"), "The Summary PDF (a few rows) downloads.")],
  pics=["20.18"])

C("RPT-61", K, "Download headers use the report words, as Sales by Customer does",
  BASE + [CU(), INVWO("1", "A", TIERPART), "Use a staging client with two locations, and pick both in the Location filter in step 2.", DESK],
  [SBT, "Pick both locations in the Location filter.", CFA, "Click Download Expanded View (CSV) in the ⋯ menu.", "Open Reports › Sales By Customer.",
   "Click Sales By Customer's expanded CSV download."],
  [R(S("RPT-S4-R6"), "Sales by Tier opens."), R(S("RPT-S4-R6"), "Both locations are picked."), R(S("RPT-S3-R4"), "Tier A's row shows customer A's $121.50."),
   R(S("RPT-S4-R6", "The columns these reports add read \"Priced By\", \"Category\", \"Priced For\", \"Parts Cost\", \"Parts Credits\", \"Parts Net\" and \"% of Total\"."),
     "The CSV headers read Priced By, Customer, Invoice #, Date, Location, Priced For, Parts Cost, Parts Invoiced, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total.",
     "The Totals row is labelled \"Totals\"."),
   R(S("RPT-S4-R6"), "Sales By Customer opens."),
   R(S("RPT-S4-R6", "Download headers match Sales by Customer's downloads word for word where the column is the same"),
     "Customer, Invoice #, Date, Location, Parts Invoiced and Parts Margin are spelled the same, letter for letter, in both downloads.")],
  pics=["20.20", "today:20.1"])

C("RPT-62", K, "Every download starts with the title, date range and every filter",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [SBT, "Click Download Summary (CSV) in the ⋯ menu.", CFA, "Click Download Summary (PDF) in the ⋯ menu."],
  [R(S("RPT-S4-R7"), "Sales by Tier opens."),
   R(S("RPT-S4-R7", "Every download starts with the report's title; \"Date Range: <from> – <to>\"; \"Locations: All locations\" or the location names"),
     "The CSV starts with \"Sales by Tier\", then \"Date Range:\" with this month's first and last day, then \"Locations:\" with your location's name.")
   + R(QT("\"Category: All categories\" or the picked names; \"Priced By: All\" or the picked labels as on screen", "TPX-31", "TP2"),
       "It has one line each reading \"Sales Type: All\", \"Category: All categories\", \"Priced By: All\" and \"Customer: All customers\"."),
   R(S("RPT-S4-R7"), "The Customer chip shows customer A."),
   R(S("RPT-S4-R7", "then one line each for Sales Type, Category, Priced By and Customer, written out even when set to all. The PDF shows the client's logo."),
     "The PDF starts with the client's logo and the title, and its Customer line names customer A.")],
  pics=["20.20"])

C("RPT-63", K, "Download header lines put Category before Priced By",
  [RPA, DESK],
  [SBT, "Click Download Summary (CSV) in the ⋯ menu."],
  [R(S("RPT-S3-R5"), "Sales by Tier opens."),
   R(S("RPT-S4-R7", "then one line each for Sales Type, Category, Priced By and Customer"),
     "After the Locations line the CSV reads Sales Type, then Category, then Priced By, then Customer.")
   + R(QD("Priced By: All", "20.20", "RPT-S4-R7"), "The Priced By line comes after the Category line (picture 20.20 shows the two the other way round).")],
  pics=["20.20"], held_on="Q30")

C("RPT-64", K, "A download with no rows shows Empty export and makes no file",
  [RPA, DESK],
  [SBT, "Untick both options in the Sales Type filter.", "Click Download Summary (CSV) in the ⋯ menu."],
  [R(S("RPT-S4-N2"), "Sales by Tier opens."), R(S("RPT-S3-N1"), "The report reads \"No record matches these filters\"."),
   R(S("RPT-S4-N2", "A download with no rows shows the existing \"Empty export\" notice, and no file is made."), "A notice reads \"Empty export\".", "No file downloads.")],
  pics=["20.21", "20.22"])

# ---- Story 5: Sales by Category --------------------------------------------------------------------------------------------------
C("RPT-65", K, "Sales by Category totals equal Sales by Tier's",
  [RPA, MX(), MX("B", "B", "Markup % 50"), TR(), "Make sure tier A's column in matrix B is % Off 10.", CU(),
   INVWO("1", "A", f"{TIERPART} and a part in category B, cost $100.00, priced $135.00 by tier A"), DESK],
  [SBC_OPEN, CFA, "Open category B's row.", SBT, CFA],
  [R(S("RPT-S5-R1"), "Sales by Category opens."),
   R(S("RPT-S5-R1", "Sales by Category has Sales by Tier's columns, filters, sorting, Totals, credits and downloads (Stories 1, 3 and 4)."),
     "The columns read Category, Parts Cost, Parts Invoiced, Parts Credits, Parts Net, Parts Margin, Parts Margin % and % of Total.",
     "Category A reads $121.50, category B $135.00; Totals $256.50 ($121.50 + $135.00).")
   + R(S("RPT-S5-R3", "% of Total is as S1-R6."), "Category A reads 47.37% ($121.50 ÷ $256.50) and category B 52.63% ($135.00 ÷ $256.50)."),
   R(S("RPT-S5-R2", "A category opens to its Priced By rows"), "Category B opens to tier A's row, $135.00, 52.63%: the same share as its parent."),
   R(S("RPT-S5-E2"), "Sales by Tier opens."),
   R(S("RPT-S5-E2", "Sales by Category's Totals equal Sales by Tier's for the same filters."), "Sales by Tier's Totals read $256.50: $256.50 − $256.50 = $0.00.")],
  pics=["20.16", "20.17"], flags=["numbers"])

C("RPT-66", K, "Categories show under their current name and open down to invoices",
  [RPA, MX(), CU("B", "Default"), INVWO("1", "B", "a part in category A, cost $100.00, priced $135.00 by Default"), DESK],
  [ "Rename category A on its category page.", SBC_OPEN, "Pick customer B in the Customer filter.", "Open the category's row.", "Open the Default row.", "Open customer B's row."],
  [R(S("RPT-S5-R2"), "Category A has its new name."), R(S("RPT-S5-R2"), "Sales by Category opens."),
   R(S("RPT-S5-R2", "Rows are categories, by the category on each part line, under its current name"), "One row shows category A's new name with $135.00."),
   R(S("RPT-S5-R2", "A category opens to its Priced By rows (Default, each tier, Fixed price, Fixed line total, Manual, Before tiers)"), "It opens to a Default row with $135.00."),
   R(S("RPT-S5-R2", "each to customers"), "Default opens to customer B."),
   R(S("RPT-S5-R2", "each to invoices and credits"), "Customer B opens to work order 1's invoice, $135.00.")],
  pics=["20.17"])

C("RPT-67", K, "Only categories with sales show, Uncategorized first",
  [RPA, "Have two new categories for this test, category A named Aaa Test Category and category B named Zzz Test Category, with no matrix.",
   "Have a third new category for this test, category C, with no sales.", CU("B", "Default"),
   INVWO("1", "B", "parts in category A, category B and Uncategorized, each cost $100.00"), DESK],
  [SBC_OPEN, "Pick customer B in the Customer filter."],
  [R(S("RPT-S5-R4"), "Sales by Category opens."),
   R(S("RPT-S5-R4", "Only categories with sales or credits in the range show; a category with neither has no row. Uncategorized sorts first on first load, then categories A to Z."),
     "Rows read Uncategorized, category A, category B, in that order.", "Category C has no row.")],
  pics=["20.16"])

C("RPT-68", K, "A category with no margin shows $0.00 and negatives a minus",
  [RPA, MX(d="Markup % 50"), MX("B", "B", "Markup % 0"), TR("A", "A", "% Off 60"), "Make sure tier A's column in matrix B is Same as previous tier.", CU(),
   INVWO("1", "A", "a part in category A, cost $10.00, priced $6.00 by tier A, and a part in category B, cost $100.00, priced $100.00"), DESK],
  [SBC_OPEN, CFA],
  [R(S("RPT-S5-R5"), "Sales by Category opens."),
   R(S("RPT-S5-R5", "A category with sales but no margin shows $0.00 Parts Margin; negative totals show as negatives (S1-R13)."),
     "Category B reads Parts Margin $0.00 ($100.00 − $100.00).", "Category A reads Parts Margin −$4.00 ($6.00 − $10.00) and Parts Margin % −66.67%.")],
  pics=["20.16"], flags=["numbers"])

C("RPT-69", K, "Priced By rows inside a category follow Sales by Tier's order",
  [RPA, MX(), TR(), CU(), CU("B", "Default"), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
   INVWO("1", "A", f"{TIERPART} and a part in category A with a typed price of $80.00"), INVWO("2", "B", "that fixed-price part and a part in category A, cost $100.00, priced $135.00 by Default"), DESK],
  [SBC_OPEN, "Pick customers A and B in the Customer filter.", "Open category A's row."],
  [R(S("RPT-S5-R6"), "Sales by Category opens."), R(S("RPT-S5-R6"), "Category A reads $349.00 ($121.50 + $80.00 + $12.50 + $135.00)."),
   R(S("RPT-S5-R6", "Inside a category, Priced By rows follow Sales by Tier's order (S3-R7)."), "Rows read Default, tier A, Fixed price, Manual, in that order.")],
  pics=["20.17"], flags=["numbers"])

C("RPT-70", K, "Sales by Category shows the same two empty states",
  [RPA, DESK],
  [SBC_OPEN, "Pick a custom date range in a month next year.", "Pick This month in the Date filter.", "Untick both options in the Sales Type filter."],
  [R(S("RPT-S5-N1"), "Sales by Category opens."),
   R(S("RPT-S5-N1", "Empty results show the same two empty states as Sales by Tier (S1-N1, S3-N1)."), "It reads \"There are no results for selected date range\" with no Totals row."),
   R(S("RPT-S5-N1"), "This month's rows show again."),
   R(S("RPT-S5-N1"), "It reads \"No record matches these filters\" and \"Try changing filters to widen your results.\" with Clear All Filters, and no Totals row.")],
  pics=["20.11", "20.23"])

C("RPT-71", K, "A deleted category's lines report under Uncategorized",
  [RPA, MX(), CU("B", "Default"), INVWO("1", "B", "a part in category A, cost $100.00, priced $135.00"), DESK],
  [CATEGORIES, "Click category A.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the question.", SBC_OPEN, "Pick customer B in the Customer filter."],
  [R(S("TP-S8-R8"), "The Categories page lists category A."), R(S("TP-S8-R8"), "Category A's page opens."), R(S("TP-S8-R8"), "The menu shows Audit Log and Delete."),
   R(S("TP-S8-R8"), "The Delete question opens."), R(S("TP-S8-R8"), "Category A is deleted."), R(S("RPT-S5-E1"), "Sales by Category opens."),
   R(S("RPT-S5-E1", "A line whose category was deleted reports under Uncategorized (Tiered Pricing S8-E1)."), "Uncategorized reads $135.00.", "Category A has no row.")],
  pics=["20.16"])

C("RPT-72", K, "A fixed line total over two categories splits by part cost",
  [RPA, MX(), MX("B", "B", "Markup % 35"), CU("B", "Default"),
   INVWO("1", "B", "line 1 with a fixed line total of $450.00 ($240.00 labor) holding a part in category A, cost $30.00, and a part in category B, cost $10.00, quantity 1 each"), DESK],
  [SBC_OPEN, "Pick customer B in the Customer filter.", SBT, "Pick customer B in the Customer filter.", "Pick only category A in the Category filter."],
  [R(S("RPT-S5-E3"), "Sales by Category opens."),
   R(S("RPT-S5-E3", "A fixed line total that spans categories is split across them by the split the line recorded (Tiered Pricing S10-R13): in proportion to each part's cost at invoicing, in cents"),
     "Category A reads $157.50 ($210.00 × $30.00 ÷ $40.00) and category B $52.50 ($210.00 × $10.00 ÷ $40.00).",
     "$157.50 + $52.50 = $210.00, the line's parts amount ($450.00 − $240.00)."),
   R(S("RPT-S5-E3"), "Sales by Tier opens."),
   R(S("RPT-S5-E3"), "Fixed line total reads $210.00."),
   R(S("RPT-S5-E3", "The Category filter on Sales by Tier uses the same split."), "Fixed line total reads $157.50, category A's share.")],
  pics=["20.16", "20.7"], flags=["numbers"])

C("RPT-73", K, "A fixed line total whose parts all cost $0 splits by quantity",
  [RPA, MX(), MX("B", "B", "Markup % 35"), CU("B", "Default"),
   INVWO("1", "B", "line 1 with a fixed line total of $340.00 ($240.00 labor) holding a part in category A, quantity 3, and a part in category B, quantity 1, both with cost $0.00"), DESK],
  [SBC_OPEN, "Pick customer B in the Customer filter."],
  [R(S("RPT-S5-E3"), "Sales by Category opens."),
   R(S("RPT-S5-E3", "Parts that all cost $0 split by quantity."),
     "Category A reads $75.00 ($100.00 × 3 ÷ 4) and category B $25.00 ($100.00 × 1 ÷ 4).", "$75.00 + $25.00 = $100.00, the parts amount ($340.00 − $240.00).")],
  pics=["20.16"], flags=["numbers"])

C("RPT-74", K, "Sales by Category groups by category, never by matrix",
  [RPA, MX(extra=", pricing a second new category made for this test, category B, as well"), CU("B", "Default"),
   INVWO("1", "B", "a part in category A and a part in category B, cost $100.00 each, priced $135.00 each"), DESK],
  [SBC_OPEN, "Pick customer B in the Customer filter."],
  [R(S("RPT-S5-E4"), "Sales by Category opens."),
   R(S("RPT-S5-E4", "The report groups by category only; there is no matrix grouping."),
     "Category A and category B are two rows, $135.00 each.", "Matrix A's name is not a row.")],
  pics=["20.16"])

C("RPT-75", K, "Lines invoiced before the release keep their invoiced category",
  [RPA, "Use staging, where invoices from before the release are kept.",
   "Have a part line on staging invoiced before the release in a customer-named category (for example a category named after a fleet customer).", DESK],
  [SBC_OPEN, "Pick the month of that invoice in the Date filter.", "Open the customer-named category's row."],
  [R(S("RPT-S5-E5"), "Sales by Category opens."),
   R(S("RPT-S5-E5", "Lines invoiced before release stay under the category they were invoiced with, including customer-named categories."),
     "The customer-named category has a row in that month.", "Its Parts Invoiced includes that part line's sales."),
   R(S("TP-S12-R6", "Reports show them as \"Before tiers\"."), "The category opens to a Before tiers row.")],
  pics=["20.17"])

C("RPT-76", K, "A credit on a part line keeps its row after the invoice is reversed",
  BASE + [CU(), INVWO("1", "A", TIERPART), DESK],
  [ "Make a $40.00 credit memo for the part line of work order 1's invoice.", "Reverse work order 1's invoice.", SBT, CFA, SBC_OPEN, CFA],
  [R(S("RPT-S1-E8"), "A credit memo naming the part line is made today."), R(S("RPT-S1-E8"), "The invoice is reversed and work order 1 is back to Complete.", "The credit memo still exists."),
   R(S("RPT-S1-E8"), "Sales by Tier opens."),
   R([S("RPT-S1-E8", "A credit line is in the row and category of the part line it credits"),
      QT("When that line has no snapshot row (its invoice was reversed and the rows cascaded), it reads the same recorded pricing columns", "TPX-33", "TP2")],
     "Tier A's row still shows Parts Credits −$40.00.", "The credit is not moved to Default or Before tiers."),
   R(S("RPT-S5-R1"), "Sales by Category opens."),
   R(S("RPT-S1-E8", "A credit line is in the row and category of the part line it credits"), "Category A's row shows Parts Credits −$40.00 ($0.00 − $40.00 = −$40.00).")],
  pics=RP, flags=["numbers"])
