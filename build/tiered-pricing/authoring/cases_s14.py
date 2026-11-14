"""Story 14 — Changing the customer on a work order (SV-12466), PRD v37 lines 894-922, design page 14 (14.1-14.8, 14.1 a Today picture).
Batch A, 14 Nov 2026. The notice follows the PRD (only tier and Default lines count; a tier name only when one tier priced them); the design's
notice names "Tier 2, Fixed price and Manual" (14.8), held on Q27. Counts and prices are worked from seeded lines (Rule 116)."""
from tp_lib import C, R, B, S, QP, QD, QL
from common import *

K = "S14"
MX = ("Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: "
      "Default Markup % 50, tier A Markup % 20.")
WO_MENU = ["Open work order 1.", "Open work order 1's three-dot menu.", "Click Change Customer."]
WO_MENU_R = lambda: [R(S("S14-R4"), "Work order 1 opens."), R(S("S14-R4"), "The menu lists Change Customer, Split Work Order and Back to Work Orders."),
                     R(S("S14-R4"), "The Change Customer dialog opens.")]


C("S14-01", K, "Change Customer keeps today's caption and adds the pricing sentence",
  [ADMIN_WO, customer("A"), "Have a new work order for this test, work order 1, for customer A.", DESK],
  WO_MENU,
  WO_MENU_R()[:2] + [R(S("S14-R4", "The Change Customer dialog keeps today's grey caption"), "The dialog shows today's gray caption, as in the Today picture.")
   + R(S("S14-R4", "and adds \"Parts already on the work order keep their prices, and new parts keep this work order's pricing.\""),
       "It adds \"Parts already on the work order keep their prices, and new parts keep this work order's pricing.\"")],
  pics=["14.2", "14.3", "today:14.1"])

C("S14-02", K, "On a Part Sale the dialog uses Part Sale wording",
  ["Sign in as an Admin whose role has 'See Financial Data' and 'Part Sales — Create & Edit'.", customer("A"), "Have a new Part Sale for this test, Part Sale 1, for customer A.", DESK],
  ["Open Part Sale 1.", "Open Part Sale 1's three-dot menu.", "Click Change Customer."],
  [R(S("S14-R4"), "Part Sale 1 opens."), R(S("S14-R4"), "The menu lists Change Customer."),
   R(S("S14-R4", "which reads differently on a Part Sale"), "The gray caption speaks of the Part Sale.")
   + R(S("S14-R4", "On a Part Sale it adds \"Parts already on the Part Sale keep their prices, and new parts keep this Part Sale's pricing.\""),
       "It adds \"Parts already on the Part Sale keep their prices, and new parts keep this Part Sale's pricing.\"")],
  pics=["14.5"])

C("S14-03", K, "An amber note names both tiers when the new customer's tier differs",
  [ADMIN_WO, tier("A"), customer("A", ", on Default for work orders"), customer("B", ", on tier A for work orders"),
   "Have a new work order for this test, work order 1, for customer A.", DESK],
  WO_MENU + ["Pick customer B."],
  WO_MENU_R() + [R(S("S14-R5", "When the new customer's tier differs from the work order's tier, an amber note in the dialog names both, for example \"This work order keeps Default pricing. Fleet Plus applies to new work orders, or split this one to use it.\""),
     "An amber note reads \"This work order keeps Default pricing.\" then tier A's name \"applies to new work orders, or split this one to use it.\"")
   + R(S("S14-R5", "Red is not used."), "The note is amber, not red.", "Update Customer is on.")],
  pics=["14.4", "14.7"])

C("S14-04", K, "On a Part Sale the amber note speaks of Part Sales",
  ["Sign in as an Admin whose role has 'See Financial Data' and 'Part Sales — Create & Edit'.", tier("A"), customer("A", ", on Default for Part Sales"),
   customer("B", ", on tier A for Part Sales"), "Have a new Part Sale for this test, Part Sale 1, for customer A.", DESK],
  ["Open Part Sale 1.", "Open Part Sale 1's three-dot menu.", "Click Change Customer.", "Pick customer B."],
  [R(S("S14-R5"), "Part Sale 1 opens."), R(S("S14-R5"), "The menu lists Change Customer."), R(S("S14-R5"), "The Change Customer dialog opens."),
   R(S("S14-R5", "On a Part Sale: \"This Part Sale keeps Default pricing. Fleet Plus applies to new Part Sales, or split this one to use it.\""),
     "An amber note reads \"This Part Sale keeps Default pricing.\" then tier A's name \"applies to new Part Sales, or split this one to use it.\"", "The note is not red.")],
  pics=["14.5"])

C("S14-05", K, "A customer on the same tier shows no amber note",
  [ADMIN_WO, tier("A"), MX, customer("A", ", on tier A for work orders"), customer("B", ", on tier A for work orders"),
   "Have a new work order for this test, work order 1, for customer A, with a category A part at a cost of $10.00 (sold at $12.00).", DESK],
  WO_MENU + ["Pick customer B.", "Click Update Customer.", "Point at the part's sell price."],
  WO_MENU_R() + [R(S("S14-E1", "Changing to a customer on the same tier shows no amber note in the dialog"), "Customer B is picked.", "No amber note shows.", "Update Customer is on."),
   R(S("S14-E1"), "Work order 1 now shows customer B."),
   R(S("S14-E1", "the lines still record the customer they were priced for"), "The details read \"Priced by\" tier A's name \"for\" customer A's name.", "The part still sells at $12.00.")],
  pics=["14.6", "12.9"])

C("S14-06", K, "Changing the customer reprices nothing and counts the tier lines",
  [ADMIN_WO, tier("A"), MX, customer("A", ", on tier A for work orders"), customer("B", ", on Default for work orders"),
   "Have a new inventory part for this test, part F, in category A with a fixed sell price of $40.00.",
   "Have a new work order for this test, work order 1, for customer A, with four category A part lines: line 1 and line 2 at a cost of $10.00 (sold at $12.00), line 3 with a typed price of $14.00, and part F.",
   DESK],
  WO_MENU + ["Pick customer B.", "Click Update Customer."],
  WO_MENU_R() + [R(S("S14-R5"), "The amber note names Default for new work orders."),
   R(S("S14-R2", "Changing the customer never reprices parts already on the work order (S11-R6)."), "Lines 1 and 2 still sell at $12.00, line 3 at $14.00 and part F at $40.00.")
   + R(S("S14-R2", "The count is the part lines whose pricing source is a tier or Default and whose recorded customer is the previous customer; Manual, Fixed price, Fixed line total and Before tiers lines don't count."),
       "A notice reads \"2 lines priced at\" tier A's name \"for the previous customer\" (4 lines − 1 Manual − 1 Fixed price = 2).")
   + R(S("S14-R2", "Those lines show no Manual icon (S12-R10)"), "Lines 1 and 2 show no Manual icon; line 3 keeps its Manual icon.")],
  pics=["14.7", "14.8"], flags=["numbers"])

C("S14-07", K, "New parts after the change keep the work order's tier",
  [ADMIN_WO, tier("A"), MX, customer("A", ", on tier A for work orders"), customer("B", ", on Default for work orders"),
   "Have a new work order for this test, work order 1, for customer A.", DESK],
  WO_MENU + ["Pick customer B.", "Click Update Customer.", "Add a category A part at a cost of $20.00."],
  WO_MENU_R() + [R(S("S14-R5"), "The amber note shows."), R(S("S14-R3", "Changing the customer changes who is invoiced, not the work order's tier."), "Work order 1 now shows customer B."),
   R(S("S14-R3", "New parts added after the change are priced by the work order's tier, as they would have been before the change (S10-R14)."),
     "The new part sells at $24.00 ($20.00 × 1.20 = $24.00, tier A).", "It is not priced at Default's $30.00 ($20.00 × 1.50).")],
  pics=["14.7", "14.8"], flags=["numbers"])

C("S14-08", K, "Without See Financial Data the notice does not show",
  ["Sign in as a user whose role has 'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit' but not 'See Financial Data'. An Admin makes the records below before the test.", tier("A"), MX,
   customer("A", ", on tier A for work orders"), customer("B"),
   "Have a new work order for this test, work order 1, for customer A, with a category A part line.", DESK],
  WO_MENU + ["Pick customer B.", "Click Update Customer."],
  WO_MENU_R() + [R(S("S14-E1"), "Customer B is picked."),
   R(S("S14-R2", "Users without 'See Financial Data' don't see this notice (S16-R5)."), "Work order 1 now shows customer B.", "No notice about lines priced for the previous customer shows.")],
  pics=["14.8"])

C("S14-09", K, "Changing the customer is blocked while deposits exist",
  [ADMIN_WO, customer("A"), "Have a new work order for this test, work order 1, for customer A, with a deposit taken on it.", DESK],
  WO_MENU,
  WO_MENU_R()[:2] + [R(S("S14-N1", "Changing the customer is blocked while deposits exist, as today."), "The customer cannot be changed: it is blocked as today while the deposit exists.",
     "Work order 1 still shows customer A.")],
  pics=["14.2", "today:14.1"])
