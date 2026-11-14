"""Story 15 — The below-cost warning in the matrix (SV-12467), PRD v37 lines 923-954, design page 15 (15.1-15.2). Batch A, 14 Nov 2026.
The lowest below-cost cost is worked from the rule with prices rounded to the cent, half away from zero (PRD Pricing today), so the
tooltip's figure is checked exactly (Rule 116). Each case makes its own tiers and matrix."""
from tp_lib import C, R, B, S, QD, QL
from common import *

K = "S15"
OPEN = [MATRICES, open_matrix("A")]
LISTED = lambda: R(S("S15-R5"), "Matrix A is listed.")


def mx(extra, lab="A"):
    return matrix(lab, ", pricing a new category made for this test, " + extra)


C("S15-01", K, "A tier that sells below cost shows the warning with the lowest cost",
  [ADMIN, tier("A"),
   mx("with two ranges, $0.00 to $100.00 and from $100.01: Default on + $ 10 in both ranges, tier A on % Off 20 in both ranges"), DESK],
  OPEN + ["Point at the warning icon beside tier A's first-range value.", "Point at the warning icon beside tier A's last-range value."],
  [LISTED(),
   R(S("S15-R5", "shows the standard warning icon (an exclamation mark) to the right of the value, in view and in edit"),
     "A warning icon shows to the right of tier A's value in both ranges.", "Default's values (Cost + $10) have no warning icon."),
   R(S("S15-R5", "Example: in a $0.00 to $100.00 range where Default is Cost + $10 and Fleet is 20% off, a $40.03 part sells for $40.02 (20% off $50.03), so the tooltip reads \"Fleet sells a $40.03 part below cost.\""),
     "A tooltip reads tier A's name followed by \"sells a $40.03 part below cost.\" ($40.03 + $10.00 = $50.03, 20% off = $40.024, rounded to $40.02, below $40.03).")
   + R(S("S15-R5", "where <$cost> is the lowest cost in the range at which the rule sells below cost"),
       "At $40.02 the price is $40.02 ($50.02 × 0.80 = $40.016, rounded to $40.02), equal to the cost, so $40.03 is the lowest."),
   R(S("S15-R5", "where <$cost> is the lowest cost in the range at which the rule sells below cost"),
     "A tooltip reads tier A's name followed by \"sells a $100.01 part below cost.\" ($100.01 + $10.00 = $110.01, 20% off = $88.008, rounded to $88.01, below $100.01).")],
  pics=["15.1"], flags=["numbers"])

C("S15-02", K, "A price exactly at cost does not warn, a deeper discount does",
  [ADMIN, tier("A"), mx("with one range from $0.00: Default on Markup % 0, tier A on % Off 1"), DESK],
  OPEN,
  [LISTED(),
   R(S("S15-N4", "A price exactly at cost (0% markup, + $0.00) doesn't warn"), "Default's 0% markup value shows no warning icon.")
   + R(S("S15-N4", "a deeper discount below it does"), "Tier A's 1% off value shows the warning icon to its right.")],
  pics=["15.1"])

C("S15-03", K, "The warning appears and disappears as the grid is edited",
  [ADMIN, tier("A"), mx("with one range from $0.00: Default on Margin % 40, tier A on % Off 5"), DESK],
  OPEN + [EDIT, "Replace tier A's value with 95.", "Replace tier A's value with 5.", "Replace tier A's value with 95.", SAVE],
  [LISTED(), R(S("S15-R5"), "Tier A's 5% off value has no warning icon."),
   R(S("S15-R5", "in view and in edit"), "The grid is in edit; tier A's value 5 has no warning icon."),
   R(S("S15-R3", "The warning updates as the grid is edited"), "The warning icon appears beside tier A's value 95 before anything is saved."),
   R(S("S15-R3", "so the client sees it disappear when they fix the rule"), "The warning icon is gone from tier A's value 5.", "The value 5 still shows in tier A's cell."),
   R(S("S15-R3"), "The warning icon shows beside 95 again."),
   R(S("S15-R2", "The warning never blocks saving"), "The grid saves and returns to view with tier A on 95% off.",
     "The warning icon still shows beside tier A's 95% off in view.")],
  pics=["15.2", "15.1"])

C("S15-04", K, "The warning never changes the price the rule gives",
  [ADMIN, tier("A"), mx("with one range from $0.00: Default on Margin % 40, tier A on % Off 95"), DESK],
  OPEN,
  [LISTED(),
   R(S("S15-R5"), "Tier A's 95% off shows the warning icon.")
   + R(S("S15-R2", "never changes a price"),
       "The Price Part Simulator at $100.00 shows Default $166.67 ($100.00 ÷ 0.60 = $166.666…, rounded to $166.67).",
       "It shows tier A $8.33 and a profit of −$91.67 (5% of $166.67 = $8.3335, rounded to $8.33, $8.33 − $100.00 = −$91.67): the warning did not raise the price.")],
  pics=["15.1", "5.2"], flags=["numbers"])

C("S15-05", K, "A Uses previous tier cell has no warning of its own",
  [ADMIN, tier("A"), tier("B", ", made right after tier A, on Same as previous tier in matrix A"),
   mx("with one range from $0.00: Default on Margin % 40, tier A on % Off 95"), DESK],
  OPEN,
  [LISTED(),
   R(S("S15-N3", "A cell that says \"Uses previous tier\" shows no below-cost warning of its own; the column it uses carries it."),
     "Tier A's 95% off shows the warning icon.", "Tier B's cell reads \"Uses previous tier\" with no warning icon beside it.")],
  pics=["15.1"])

C("S15-06", K, "A dearer part selling for less than the range before it does not warn",
  [ADMIN, mx("with two ranges, $0.00 to $100.00 with Default on Markup % 50 and from $100.01 with Default on Markup % 10"), DESK],
  OPEN + ["Type 100.01 in the Price Part Simulator's Part Cost."],
  [LISTED(),
   R(S("S15-N5", "A range that sells a part that costs more for less than a part in the range before it shows no warning."),
     "Default's 50% markup and 10% markup values show no warning icon.", "Both values show in the grid as \"50% markup\" and \"10% markup\".")
   + R(S("S5-R2"), "The simulator at $100.00 shows Default $150.00 ($100.00 × 1.50 = $150.00)."),
   R(S("S5-R2"), "Default now reads $110.01 ($100.01 × 1.10 = $110.011, rounded to $110.01): less than $150.00, but above the $100.01 cost.")
   + R(S("S15-N5"), "The grid's values still show no warning icon.", "The 10% markup value is still shown.")],
  pics=["15.1"], flags=["numbers"])

C("S15-07", K, "The last open range is checked up to ten times its start or $10,000",
  [ADMIN, tier("A"),
   mx("with two ranges, $0.00 to $1,000.00 and from $1,000.01: Default on + $ 2000 in both, tier A on % Off 10 in both"),
   mx("with two ranges, $0.00 to $5,000.00 and from $5,000.01: Default on + $ 2000 in both, tier A on % Off 10 in both", lab="B"), DESK],
  OPEN + [MATRICES, open_matrix("B"), "Point at the warning icon beside tier A's last-range value."],
  [LISTED(),
   R(S("S15-R5", "For the last, open range, costs up to ten times its start or $10,000, whichever is higher, are checked."),
     "Tier A's values in matrix A show no warning icon: the last range is checked up to $10,000.10 ($1,000.01 × 10 = $10,000.10), while tier A first sells below cost at $18,000.06 (0.90 × (cost + $2,000) falls below the cost above $18,000).",
     "Tier A's values still show \"10% off\" in both ranges."),
   R(S("S15-R5"), "Matrix A is listed with matrix B."),
   R(S("S15-R5", "For the last, open range, costs up to ten times its start or $10,000, whichever is higher, are checked."),
     "In matrix B a warning icon shows beside tier A's last-range value: that range is checked up to $50,000.10 ($5,000.01 × 10 = $50,000.10).",
     "Tier A's first-range value in matrix B has no warning icon (every cost up to $5,000 sells above cost)."),
   R(S("S15-R5", "where <$cost> is the lowest cost in the range at which the rule sells below cost"),
     "A tooltip reads tier A's name followed by \"sells a $18,000.06 part below cost.\" ($18,000.06 + $2,000.00 = $20,000.06, 10% off = $18,000.054, rounded to $18,000.05, below $18,000.06; at $18,000.05 the price rounds to $18,000.05, equal to the cost).")],
  pics=["15.1"], flags=["numbers"])

C("S15-08", K, "The warning shows on the Part Sale Matrix side too",
  [ADMIN, tier("A"),
   mx("with Separate Part Sale pricing on and one range from $0.00 on each side: Default on Margin % 40 on both sides, tier A on % Off 5 on the Work Order Matrix and % Off 95 on the Part Sale Matrix"), DESK],
  OPEN + ["Click the Part Sale Matrix tab."],
  [LISTED(), R(S("S15-R5"), "On the Work Order Matrix tab tier A's 5% off has no warning icon."),
   R(S("S15-R5", "The warning is always on, in every matrix and on both sides; there is no setting to turn it off."),
     "On the Part Sale Matrix tab tier A's 95% off shows the warning icon to its right.", "The page offers no setting to turn the warning off.")],
  pics=["15.1", "3.19"])
