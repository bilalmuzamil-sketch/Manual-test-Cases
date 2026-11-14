"""Story 5 — Price Part Simulator (SV-12457), PRD v37 lines 463-493, design page 5 (5.1-5.4). Batch A, 14 Nov 2026.
Every number is worked from seeded rules (Rule 116): margin price = cost ÷ (1 − margin), markup price = cost × (1 + markup), % Off taken from
Default's price, profit = price − cost, rounded to the cent (PRD Terminology and Pricing today). Tiers are client-wide, so each case makes its
own tiers and matrix; other tiers of the client also get a column (Same as previous tier in a new matrix) and are not judged."""
from tp_lib import C, R, B, S, QP, QD, QL
from common import *

K = "S5"
OPEN = [MATRICES, open_matrix("A")]
LISTED = lambda: R(S("S5-R1"), "Matrix A is listed.")
OPENS = lambda: R(S("S5-R1"), "Matrix A's page opens on the Work Order Matrix tab.")
PC = "Price Part Simulator's Part Cost"


def mx(extra):
    return matrix("A", ", pricing a new category made for this test, category A, " + extra)


C("S5-01", K, "Simulator shows under the grid with a Part Cost of $100.00",
  [ADMIN, tier("A"), mx("one range from $0.00 with Default on Markup % 50"), DESK],
  OPEN + ["Point at the info icon beside the Price Part Simulator title."],
  [LISTED(),
   R(S("S5-R1", "Under the grid on the matrix page, on both tabs, a separate table titled \"Price Part Simulator\""),
     "Under the grid sits a separate table titled \"Price Part Simulator\".")
   + R(S("S5-R1", "has one Part Cost field, in dollars, starting at $100.00"), "It has one Part Cost field, in dollars, reading $100.00.")
   + R(S("S5-R2", "under Default and each active tier"), "It has a column under Default and one under each active tier, tier A included.")
   + R(S("S5-R1", "Its columns line up with the grid's."), "Each simulator column sits directly under the grid column of the same tier."),
   R(S("S5-R1", "with the info tooltip \"Type a part cost to see each tier's price and profit. Nothing is saved.\""),
     "A tooltip reads \"Type a part cost to see each tier's price and profit. Nothing is saved.\"")],
  pics=["5.1"])

C("S5-02", K, "Simulator shows on the Part Sale Matrix tab too",
  [ADMIN, mx("with Separate Part Sale pricing on, Default on Markup % 50 on the Work Order Matrix and Markup % 20 on the Part Sale Matrix, one range from $0.00 on each"), DESK],
  OPEN + ["Click the Part Sale Matrix tab."],
  [LISTED(), OPENS() + R(S("S5-R2"), "Default's simulator price reads $150.00 ($100.00 × 1.50 = $150.00)."),
   R(S("S5-R1", "on both tabs, a separate table titled \"Price Part Simulator\""), "The Price Part Simulator shows under the Part Sale grid too.")
   + R(S("S5-R2", "on that tab's side"), "Default's simulator price now reads $120.00, from the Part Sale side ($100.00 × 1.20 = $120.00).")],
  pics=["5.1", "3.19"], flags=["numbers"])

C("S5-03", K, "Tier pages and category pages have no simulator",
  [ADMIN, tier("A"), mx("one range from $0.00 with Default on Markup % 50"), DESK],
  [TIERS, open_tier("A"), CATEGORIES, "Click category A's row."],
  [R(S("S5-R1"), "The Tiers list shows tier A."),
   R(S("S5-R1", "Tier pages and category pages have no simulator."), "Tier A's page shows its Pricing tab with the list of matrices.", "No Price Part Simulator shows on the page."),
   R(S("S5-R1"), "The Categories list shows category A."),
   R(S("S5-R1", "Tier pages and category pages have no simulator."), "Category A's page shows matrix A's grid.", "No Price Part Simulator shows under the grid.")],
  pics=["5.1", "2.32", "7.8"])

C("S5-04", K, "Simulator shows each column's sell price and profit for the typed cost",
  [ADMIN, tier("A"), tier("B", ", made after tier A"),
   mx("one range from $0.00: Default Markup % 50, tier A Margin % 20, tier B % Off 10"), DESK],
  OPEN + [f"Type 250 in the {PC}."],
  [LISTED(),
   R(S("S5-R2", "the table shows, under Default and each active tier, the sell price and the profit (\"$12.50 profit\")"),
     "At $100.00: Default reads $150.00 and \"$50.00 profit\" ($100.00 × 1.50 = $150.00, $150.00 − $100.00 = $50.00).",
     "Tier A reads $125.00 and \"$25.00 profit\" ($100.00 ÷ 0.80 = $125.00).",
     "Tier B reads $135.00 and \"$35.00 profit\" (10% off Default's $150.00 = $135.00)."),
   R(S("S5-R4", "The table updates as the cost is typed"), "The figures change while 250 is typed, with no button to press.")
   + R(S("S5-R2", "Profit is the sell price minus the typed cost, per unit, before Fees & Discounts, rounded to the cent."),
       "Default reads $375.00 and \"$125.00 profit\" ($250.00 × 1.50 = $375.00, $375.00 − $250.00 = $125.00).",
       "Tier A reads $312.50 and \"$62.50 profit\" ($250.00 ÷ 0.80 = $312.50).",
       "Tier B reads $337.50 and \"$87.50 profit\" ($375.00 × 0.90 = $337.50).")],
  pics=["5.1"], flags=["numbers"])

C("S5-05", K, "Simulator rounds a margin price and its profit to the cent",
  [ADMIN, tier("A"), mx("one range from $0.00: Default Margin % 30, tier A % Off 15"), DESK],
  OPEN + [f"Type 10 in the {PC}."],
  [LISTED(), OPENS(),
   R(S("S5-R2", "rounded to the cent"), "Default reads $14.29 and \"$4.29 profit\" ($10.00 ÷ 0.70 = $14.2857…, rounded to $14.29, $14.29 − $10.00 = $4.29).")
   + R(S("S5-R3", "Prices follow Story 10 exactly"), "Tier A reads $12.15 and \"$2.15 profit\" (15% off $14.29 = $12.1465, rounded to $12.15).")],
  pics=["5.1"], flags=["numbers"])

C("S5-06", K, "Simulator prices a Same as previous tier column like the tier before it",
  [ADMIN, tier("A"), tier("B", ", made right after tier A, on Same as previous tier in matrix A"),
   mx("one range from $0.00: Default Markup % 50, tier A Margin % 20"), DESK],
  OPEN,
  [LISTED(),
   R(S("S5-R3", "Prices follow Story 10 exactly, Same as previous tier included."),
     "Tier A reads $125.00 and \"$25.00 profit\" ($100.00 ÷ 0.80 = $125.00).",
     "Tier B, which uses the previous tier, reads the same $125.00 and \"$25.00 profit\".")],
  pics=["5.1"], flags=["numbers"])

C("S5-07", K, "A cost on a range boundary is priced by the range that holds it",
  [ADMIN, mx("two ranges, $0.00 to $100.00 with Default Markup % 50 and from $100.01 with Default Markup % 20"), DESK],
  OPEN + [f"Type 100.01 in the {PC}."],
  [LISTED(),
   R(S("S5-R3", "A cost on a range boundary is priced by the range that contains it"), "At $100.00 Default reads $150.00 ($100.00 × 1.50 = $150.00, first range)."),
   R(S("S5-R3", "A cost on a range boundary is priced by the range that contains it"),
     "Default reads $120.01 and \"$20.00 profit\" ($100.01 × 1.20 = $120.012, rounded to $120.01, second range).")],
  pics=["5.1"], flags=["numbers"])

C("S5-08", K, "A cost with more than two decimals is rounded to the cent first",
  [ADMIN, mx("two ranges, $0.00 to $100.00 with Default Markup % 50 and from $100.01 with Default Markup % 20"), DESK],
  OPEN + [f"Type 100.005 in the {PC}."],
  [LISTED(), OPENS(),
   R(S("S5-R3", "a cost with more than two decimals is rounded to the cent first"),
     "Default reads $120.01: the cost is first rounded to $100.01, which falls in the second range ($100.01 × 1.20 = $120.012, rounded to $120.01).")
   + R(S("S5-R3", "a cost with more than two decimals is rounded to the cent first (S3-E3)"), "Default does not read $150.01, the first range's price.")],
  pics=["5.1"], flags=["numbers"])

C("S5-09", K, "While the grid is in edit the simulator uses the unsaved values",
  [ADMIN, mx("one range from $0.00 with Default on Markup % 50"), DESK],
  OPEN + [EDIT, "Type 60 in Default's first range.", "Click Cancel.", "Click Discard Changes."],
  [LISTED(), OPENS() + R(S("S5-R2"), "Default's simulator price reads $150.00 ($100.00 × 1.50 = $150.00)."),
   R(S("S5-R4"), "The grid is in edit and the simulator still shows under it."),
   R(S("S5-R4", "while the grid is in edit, reflects the unsaved values"), "Before saving, Default's simulator price reads $160.00 and \"$60.00 profit\" ($100.00 × 1.60 = $160.00)."),
   R([S("S19-R3", "a grid in edit with unsaved changes asks \"Discard these changes?\" (Keep Editing / Discard Changes)"), S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case.")], "A question asks \"Discard These Changes?\" with Keep Editing and Discard Changes."),
   R(S("S5-R6", "Nothing typed in the simulator is saved or changes a price."), "The grid is back in view with Default on 50% markup.",
     "Default's simulator price reads $150.00 again.")],
  pics=["5.4", "5.1"], flags=["numbers"])

C("S5-10", K, "A price below the typed cost shows a minus profit and the warning",
  [ADMIN, tier("A"), mx("one range from $0.00: Default Markup % 50, tier A $ Off 60"), DESK],
  OPEN + ["Point at the warning icon beside tier A's simulator price."],
  [LISTED(),
   R(S("S5-R5", "A negative profit shows with a minus sign"), "Tier A reads $90.00 ($150.00 − $60.00 = $90.00).",
     "Its profit reads with a minus sign: −$10.00 profit ($90.00 − $100.00 = −$10.00).")
   + R(S("S5-R5", "a sell price below the typed cost shows the below-cost warning icon"), "A warning icon shows beside tier A's price.",
       "Default's $150.00 has no warning icon."),
   R(S("S5-R5", "with the tooltip \"Below cost.\""), "A tooltip reads \"Below cost.\"")],
  pics=["5.2"], flags=["numbers"])

C("S5-11", K, "Nothing typed in the simulator is saved",
  [ADMIN, mx("one range from $0.00 with Default on Markup % 50"), DESK],
  OPEN + [f"Type 250 in the {PC}.", MATRICES, open_matrix("A")],
  [LISTED(), OPENS(), R(S("S5-R2"), "Default's simulator price reads $375.00 ($250.00 × 1.50 = $375.00)."),
   LISTED(),
   R(S("S5-R1", "starting at $100.00"), "The Part Cost reads $100.00 again.")
   + R(S("S5-R6", "Nothing typed in the simulator is saved or changes a price."), "Default's simulator price reads $150.00 and the grid still shows 50% markup.")],
  pics=["5.1"], flags=["numbers"])

for i, (what, typed) in enumerate((("an empty cost", None), ("a cost of zero", "0"), ("a cost that is not a number", "abc")), 12):
    steps = OPEN + ([f"Clear the {PC}."] if typed is None else [f"Clear the {PC}.", f"Type {typed} in the Part Cost."])
    res = [LISTED(), OPENS() + R(S("S5-R2"), "Default's simulator price reads $150.00.")]
    if typed is not None:
        res.append(R(S("S5-N1"), "The Part Cost is empty."))
    res.append(R(S("S5-N1", "the field shows an error and the table shows \"—\" under every column"),
                 "The Part Cost field shows an error message.", "Every simulator column shows \"—\" instead of a price."))
    C(f"S5-{i}", K, f"Simulator with {what} shows an error and dashes",
      [ADMIN, mx("one range from $0.00 with Default on Markup % 50"), DESK], steps, res, pics=["5.3"])
