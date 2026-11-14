"""Story 13 — Part Sales (SV-11702), PRD v37 S13 rows, design page 13 (13.1-13.4). Batch B, phase 2, 14 Nov 2026."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import PSA, MX, TR, CU, PS, HOVER

K = "S13"
OPENPS = "Open Part Sale 1."
ADDPS = "Add a part with category A and cost 100.00 to Part Sale 1."
PSPICS = ["13.3", "13.4"]

C("S13-01", K, "A Part Sale is priced by the customer's Part Sales tier from the Part Sale side",
  [PSA, MX(extra=", and Separate Part Sale pricing turned on with Part Sale Matrix Default Markup % 50"),
   TR("A", "A", "% Off 10", " on the Part Sale Matrix side"), CU("A", "A", "Part Sales"), PS(), DESK],
  [OPENPS, ADDPS, HOVER],
  [R(S("S13-R1"), "Part Sale 1 opens on its parts table."),
   R(S("S13-R1", "Parts on a Part Sale are priced by the customer's Part Sales tier when the Part Sale was made (S10-R14), from the Part Sale Matrix side of the matrix when that side is on"),
     "The part's sell price reads $135.00: Part Sale Default $100.00 × 1.50 = $150.00 × 0.90 = $135.00."),
   R(S("S13-R1", "The Priced by column and price details work as on work orders (Story 12)."),
     "The price details name tier A, matrix A's Part Sale Matrix side, the 10% off rule and Default's price $150.00.")],
  pics=PSPICS, flags=["numbers"])

C("S13-02", K, "With the Part Sale side off a Part Sale uses the Work Order side",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS(), DESK],
  [OPENPS, ADDPS],
  [R(S("S13-R1"), "Part Sale 1 opens on its parts table."),
   R(S("S13-R1", "and its Work Order Matrix side when it is off (S10-R18)"),
     "The part's sell price reads $121.50: Work Order Default $100.00 × 1.35 = $135.00 × 0.90 = $121.50.")],
  pics=PSPICS, flags=["numbers"])

C("S13-03", K, "A customer whose Part Sales tier was never changed pays Default on Part Sales",
  [PSA, MX(), TR(), CU("A", "A", "work orders only (the Part Sales tier left on Default)"), PS(), DESK],
  [OPENPS, ADDPS],
  [R(S("S13-R1"), "Part Sale 1 opens on its parts table."),
   R(S("S13-R1", "A customer whose Part Sales tier was never changed is priced by Default (S9-R2)."),
     "The part reads $135.00, Default's price ($100.00 × 1.35 = $135.00), not tier A's $121.50.")
   + R(S("S12-R3"), "Its Priced By column reads Default.")],
  pics=PSPICS, flags=["numbers"])

C("S13-04", K, "The Part Sale table shows Priced By after Sell Price",
  [PSA, MX(), TR(), CU("A", "A", "Part Sales"), PS("1", "A", ", with one part in category A priced by tier A and one part with a typed price"), W1440],
  [OPENPS, "Point at the tier-priced part's Priced By value."],
  [R(S("S12-R3", "The work order Parts tab and the Part Sale parts table get a Priced by column after Sell Price."),
     "The parts table's columns read Description, Part Number, Quantity, Cost, Core, Sell Price, Priced By, Margin, Category, Vendor and Requested At, as in picture 13.3.")
   + R(S("S12-R3", "It shows the pricing source in words, with the Manual icon for a Manual price"), "The tier-priced part reads tier A's name.", "The typed part reads Manual with the gray Manual icon."),
   R(S("S12-R3", "hovering or focusing it opens the price details too"), "The price details open beside the value, titled \"Why this price\".")
   + R(QL("13.4", "S13-R1"), "Their rows read Priced by, Matrix, Cost Range, Rule, Cost, Sell price, Priced on and From, as in picture 13.4.")],
  pics=PSPICS)

C("S13-05", K, "Changing the customer on a Part Sale keeps its prices and shows the notice",
  [PSA, MX(), TR(), TR("B", "A", "% Off 20"), CU("A", "A", "Part Sales"), CU("B", "B", "Part Sales"),
   PS("1", "A", ", with a part in category A priced $121.50 by tier A"), DESK],
  [OPENPS, "Click Change Customer in the Part Sale's three-dot menu.", "Pick customer B.", "Click Update Customer."],
  [R(S("S13-E1"), "Part Sale 1 opens with the part at $121.50."),
   R(S("S14-R4", "On a Part Sale it adds \"Parts already on the Part Sale keep their prices, and new parts keep this Part Sale's pricing.\""),
     "Change Customer opens with \"Parts already on the Part Sale keep their prices, and new parts keep this Part Sale's pricing.\""),
   R(S("S14-R5", "On a Part Sale: \"This Part Sale keeps Default pricing."), "An amber note says this Part Sale keeps tier A pricing and tier B applies to new Part Sales."),
   R(S("S13-E1", "With this release, it works as on a work order: parts already on it keep their prices (S11-R6), and the same notice shows (Story 14)."),
     "Part Sale 1 names customer B and its part still reads $121.50.", "A notice says 1 line was priced at tier A for the previous customer.")],
  pics=["14.5", "13.3"])

C("S13-06", K, "A Part Sale split off takes the customer's current Part Sales tier",
  [PSA, MX(), TR(), TR("B", "A", "% Off 20"), CU("A", "A", "Part Sales"),
   PS("1", "A", ", with two parts in category A, cost $100.00 each, priced $121.50 by tier A"),
   "Make sure customer A was moved to tier B for Part Sales after Part Sale 1 was made.", DESK],
  [OPENPS, "Click Split Part Sale in the Part Sale's three-dot menu.", "Tick the second part.", "Click Split."],
  [R(S("S13-R1"), "Part Sale 1 opens."), R(S("S11-E6"), "The split screen opens as today, listing both parts."), R(S("S11-E6"), "The second part is ticked."),
   R(S("S11-E6", "a Part Sale is split by its parts the same way"), "A new Part Sale opens for customer A with the second part.")
   + R(S("S11-E6", "The new work order or Part Sale takes the customer's current settings, including their current tier for that channel (S10-R14)"),
       "The moved part reads $108.00, tier B's price ($135.00 × 0.80 = $108.00).")
   + R(S("S11-E6", "Lines left behind keep their prices."), "The part left on Part Sale 1 still reads $121.50.")],
  pics=["14.5", "13.3"], flags=["numbers"])
