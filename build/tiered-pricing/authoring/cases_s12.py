"""Story 12 — Seeing what priced a part (SV-12464), PRD v37 lines 813-867, design page 12 (12.1-12.9), tech plan row TPX-21 (phone).
Batch A, 14 Nov 2026. Each case makes its own tier, matrix, category, inventory part, customer and work order; prices are worked from the
seeded rule (Rule 116). The price details' matrix line follows the PRD (matrix, side and rule); the design's "<matrix> · <tier>" line and
its "Same as previous tier: <tier>" row are a held design case (Q29). Reports (Before tiers, renamed tiers) are the reports batch's cases."""
from tp_lib import C, R, B, S, QP, QD, QL, QT
from common import *

K = "S12"
WOU = ADMIN_WO
TIER_A = tier("A")
MX = ("Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: "
      "Default Markup % 50, tier A Markup % 20.")
PART = "Have a new inventory part for this test, part A, in category A, cost $10.00, in a bin (for example E-11)."
CUSTA = customer("A", ", on tier A for work orders")
WO1 = "Have a new work order for this test, work order 1, for customer A, with part A added (sold at $12.00: $10.00 × 1.20)."
BASE = [WOU, TIER_A, MX, PART, CUSTA, WO1, DESK]
OPEN = "Open work order 1."
HOVER = "Point at part A's sell price on the Lines tab."


C("S12-01", K, "Hovering a part's sell price opens its price details",
  BASE, [OPEN, HOVER],
  [R(S("S12-R1"), "Work order 1 opens on its Lines tab with part A at $12.00 ($10.00 × 1.20 = $12.00)."),
   R(S("S12-R1", "every sell price that has a pricing source (Default, tier, fixed price, fixed line total, Manual, and lines priced before the release) opens its price details: there is no icon to hover"),
     "The price details open from the price itself.", "No icon beside the price was needed to open them.")
   + R(S("S12-R2", "the pricing source;"), "They name the pricing source: tier A.")
   + R(S("S12-R2", "the matrix, its side (Work Order Matrix or Part Sale Matrix) and the rule (cost range and calculation);"),
       "They name matrix A, its Work Order Matrix side and the rule: the range from $0.00 and 20% markup.")
   + R(S("S12-R2", "the cost used;"), "Cost: $10.00. Sell price: $12.00 ($10.00 × 1.20 = $12.00).")
   + R(S("S12-R2", "when it was priced;"), "They show the date and time part A was added.")
   + R(S("S12-R2", "\"Inventory, bin <bin>\" for an inventory part"), "Where it came from reads \"Inventory, bin\" and part A's bin.")],
  pics=["12.1"], flags=["numbers"])

C("S12-02", K, "A % Off price's details name the Default price it was taken from",
  [WOU, tier("A"), "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: Default Markup % 50, tier A % Off 10.",
   PART, CUSTA, "Have a new work order for this test, work order 1, for customer A, with part A added.", DESK],
  [OPEN, HOVER],
  [R(S("S12-R2"), "Part A sells at $13.50 (Default $10.00 × 1.50 = $15.00, 10% off = $13.50)."),
   R(S("S12-R2", "for % Off or $ Off, the Default price it was taken from"), "The details show the rule 10% off and the Default price it was taken from, $15.00.",
     "Sell price: $13.50 ($15.00 − $1.50 = $13.50).")],
  pics=["12.1"], flags=["numbers"])

C("S12-03", K, "A special-order part's details name the vendor and bill number",
  [WOU, tier("A"), MX, CUSTA, "Have a new work order for this test, work order 1, for customer A, with a special-order part of category A received on a vendor bill (for example Prairie Tire Supply - VB-4821).",
   "Have a quick-added part with no vendor, made for this test on work order 1, so its details have no From line.", DESK],
  [OPEN, "Point at the special-order part's sell price.", "Point at the quick-added part's sell price."],
  [R(S("S12-R2"), "Work order 1 opens."),
   R(S("S12-R2", "or \"<vendor> - <vendor bill #>\" for a special-order part, as the part number's hover shows today"), "Where it came from reads the vendor's name, \" - \" and the vendor bill number."),
   R(S("S12-R2", "A part with neither, such as a quick-added part with no vendor, has no line for it."), "The details show the source, rule, cost and sell price.", "They have no line for where the part came from.")],
  pics=["12.7"])

C("S12-04", K, "Price details open from the keyboard and give focus back",
  BASE, [OPEN, "Click into part A's sell price box on the Lines tab.", "Press Alt+Down.", "Press Esc.", "Type 13."],
  [R(S("S12-R1"), "Work order 1 opens."), R(S("S12-R1", "The price can be reached by keyboard."), "The cursor is in part A's sell price box."),
   R(S("S12-R2", "With the cursor in the price box, Alt+Down opens them"), "The price details open."),
   R(S("S12-R2", "Focus returns to the price when they close."), "The details close and the cursor is back in the price box."),
   R(S("S12-R2", "typing still edits the price"), "The price box now reads 13: typing edits the price.")],
  pics=["12.1", "12.3"])

C("S12-05", K, "A Same as previous tier price names the tier whose rule was used",
  [WOU, tier("A"), tier("B", ", made right after tier A, on Same as previous tier in matrix A"),
   "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: Default Markup % 50, tier A Markup % 20.",
   PART, customer("A", ", on tier B for work orders"), "Have a new work order for this test, work order 1, for customer A, with part A added.", DESK],
  [OPEN, HOVER, "Click the Parts tab."],
  [R(S("S12-R18"), "Part A sells at $12.00, tier A's price ($10.00 × 1.20 = $12.00)."),
   R(S("S12-R18", "When the tier was priced as Same as previous tier, the details say so and name the tier whose rule was used: \"Fleet is the same as the previous tier, Wholesale, in Brakes.\""),
     "The details read tier B's name, \"is the same as the previous tier,\" tier A's name, \"in\" category A's name, ending with a period."),
   R(S("S12-R19", "A line priced through Same as previous tier records the work order's tier as its pricing source and the tier whose rule was used as a detail. Priced by, Sales by Tier and the delete check in S2-R8 use the work order's tier."),
     "Part A's Priced by reads tier B, the work order's tier.", "It does not read tier A.")],
  pics=["12.2", "12.4"], flags=["numbers"])

C("S12-06", K, "A gray Manual icon shows beside a typed price, and only there",
  [WOU, tier("A"), MX, PART, CUSTA, "Have a new work order for this test, work order 1, for customer A, with part A added twice, as line 1 and line 2.", DESK],
  [OPEN, "Type 14 in line 2's sell price.", "Press Enter.", "Point at line 2's sell price."],
  [R(S("S12-R10"), "Work order 1 opens with both lines at $12.00."), R(S("S12-R10"), "Line 2's price reads 14."),
   R(S("S12-R10", "A gray Manual icon always shows beside a Manual price, and only there"), "A gray Manual icon shows beside line 2's $14.00.",
     "Line 1's $12.00 has no icon."),
   R(S("S12-R4", "For Manual, it also records who typed the price."), "The details name Manual as the source, who typed the price and when.")
   + R(QD("Price typed by hand", "12.3", "S12-R10"), "Their title reads \"Price typed by hand\".")],
  pics=["12.3"])

C("S12-07", K, "A fixed line total part's details give the total and its parts amount",
  [WOU, tier("A"), MX, CUSTA, "Have a new work order for this test, work order 1, for customer A, with a line set to a fixed total of $450.00 whose parts come to $210.00, part A among them.", DESK],
  [OPEN, "Point at part A's sell price on the fixed-total line."],
  [R(S("S12-R12"), "Work order 1 opens with the fixed-total line."),
   R(S("S12-R12", "a fixed line total: the line's fixed total and its parts amount, for example \"Part of a fixed line total of $450.00 (parts $210.00)\""),
     "The details read \"Part of a fixed line total of $450.00 (parts $210.00)\".")
   + R(S("S12-R10", "a fixed price and a fixed line total show no icon, and their details explain them"), "Part A's price shows no Manual icon.", "The details name Fixed line total as the source.")],
  pics=["12.8"])

C("S12-08", K, "A line on a work order whose customer moved tier says so",
  [WOU, tier("A"), tier("B"), MX, PART, customer("A", ", on tier A for work orders"),
   "Have a new work order for this test, work order 1, for customer A, with part A added while customer A was on tier A.",
   "Before the test, set customer A's Work Order Tier to tier B in Edit Customer, after work order 1 was made.", DESK],
  [OPEN, HOVER],
  [R(S("S12-R12"), "Part A still sells at $12.00 ($10.00 × 1.20 = $12.00, tier A)."),
   R(S("S12-R12", "a line on a work order or Part Sale whose customer has since moved to another tier: \"Priced by Fleet, Acme Freight's tier when this work order was made. Acme Freight is now on Wholesale.\""),
     "The details read \"Priced by\" tier A's name, customer A's name, \"'s tier when this work order was made.\" and customer A's name \"is now on\" tier B's name, ending with a period.")
   + R(S("S12-R10", "A customer change, a tier change, a fixed price and a fixed line total show no icon"), "The price shows no Manual icon.", "The details open from the price.")],
  pics=["12.6"], flags=["numbers"])

C("S12-09", K, "A canned line's saved price on a Default work order says so",
  [WOU, customer("A", ", on Default for work orders"),
   "Have a new canned line for this test, canned line A, with a part that has a saved price (for example $50.00).",
   "Have a new work order for this test, work order 1, for customer A, with canned line A added.", DESK],
  [OPEN, "Point at the canned line part's sell price."],
  [R(S("S12-R12"), "Work order 1 opens with canned line A's part at its saved price."),
   R(S("S12-R12", "a canned line's saved price on a work order or Part Sale whose tier is Default (S11-R7): \"Saved price from canned line <canned line>.\""),
     "The details read \"Saved price from canned line\" and canned line A's name, ending with a period.", "The details name Default as the source.")],
  pics=["12.7"])

C("S12-10", K, "A line priced before the release reads Priced before tiers",
  [WOU, STAGING, "Use a work order on staging, work order 1, with a part line priced before the release and still open."],
  [OPEN, "Point at that part line's sell price."],
  [R(S("S12-R6"), "Work order 1 opens."),
   R(S("S12-R6", "Lines priced before the release never show the Manual icon; their details read \"Priced before tiers\"."),
     "The details read \"Priced before tiers\".", "The price shows no Manual icon.")
   + R(S("S12-R12", "a line priced before the release: \"Priced before tiers\", with what the line recorded (S12-R6)"), "They show the cost and sell price the line recorded.")],
  pics=["12.5"])

C("S12-11", K, "Parts tab has a Priced by column after Sell Price",
  [WOU, tier("A"), MX, PART, CUSTA, "Have a new work order for this test, work order 1, for customer A, with part A added twice, as line 1 and line 2, line 2 with a typed price of $14.00.", DESK],
  [OPEN, "Click the Parts tab.", "Point at line 1's Priced by.", "Click the Lines tab."],
  [R(S("S12-R3"), "Work order 1 opens on the Lines tab."),
   R(S("S12-R3", "The work order Parts tab and the Part Sale parts table get a Priced by column after Sell Price. It shows the pricing source in words, with the Manual icon for a Manual price"),
     "A Priced by column sits right after Sell Price.", "Line 1 reads tier A's name; line 2 reads Manual with the Manual icon."),
   R(S("S12-R3", "hovering or focusing it opens the price details too"), "Line 1's price details open."),
   R(S("S12-R3", "The work order Lines tab opens the details from its part rows' prices but has no Priced by column."), "The Lines tab shows its usual columns.", "It has no Priced by column.")],
  pics=["12.4"])

C("S12-12", K, "The Part Sale parts table has a Priced by column too",
  ["Sign in as an Admin whose role has 'See Financial Data' and 'Part Sales — Create & Edit'.", tier("A"), MX, PART, customer("A", ", on tier A for Part Sales"),
   "Have a new Part Sale for this test, Part Sale 1, for customer A, with part A added.", DESK],
  ["Open Part Sale 1.", "Point at part A's Priced by."],
  [R(S("S12-R3", "The work order Parts tab and the Part Sale parts table get a Priced by column after Sell Price."), "The parts table shows Priced by right after Sell Price.",
     "Part A's Priced by reads tier A's name."),
   R(S("S12-R3", "hovering or focusing it opens the price details too"), "Part A's price details open, naming tier A and matrix A's Work Order Matrix side.")],
  pics=["12.4"])

C("S12-13", K, "After a tier is renamed the details show the old and current name",
  [WOU, tier("A", ", named for example Fleet"), MX, PART, CUSTA, WO1, DESK],
  [TIERS, open_tier("A"), "Click the tier name at the top of the page.", "Type a new name (for example Fleet Plus).", "Press Enter.", OPEN, "Click the Parts tab.", "Point at part A's Priced by."],
  [R(S("S12-R5"), "The Tiers list shows tier A."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R5"), "The name becomes editable."), R(S("S2-R5"), "The new name shows."),
   R(S("S2-R28"), "The title shows the new name."), R(S("S12-R5"), "Work order 1 opens."),
   R(S("S12-R5", "After a tier is renamed, the Priced by column shows its current name."), "Part A's Priced by reads the new name (for example Fleet Plus)."),
   R(S("S12-R5", "The price details show the name it had when the part was priced, followed by the current name, for example \"Fleet (now Fleet Plus)\"."),
     "The details read the old name followed by \"(now\" and the new name \")\" (for example \"Fleet (now Fleet Plus)\").")
   + R(S("S12-R15", "The line records the tier itself, as well as the name it showed."), "Part A still sells at $12.00.")],
  pics=["12.4", "12.1"])

C("S12-14", K, "Editing the matrix later never changes what a line recorded",
  BASE, [MATRICES, open_matrix("A"), EDIT, "Replace tier A's value with 40.", SAVE, OPEN, HOVER],
  [R(S("S12-R5"), "Matrix A is listed."), R(S("S12-R5"), "Matrix A's page opens."), R(S("S12-R5"), "The grid is in edit."), R(S("S12-R5"), "Tier A's value reads 40."),
   R(S("S12-R5"), "The grid saves with tier A on 40% markup."), R(S("S12-R5"), "Work order 1 opens."),
   R(S("S12-R5", "Renaming, editing, archiving or deleting a tier, matrix, rule or category later never changes what a line recorded."),
     "Part A still sells at $12.00 ($10.00 × 1.20 = $12.00).", "The details still show the rule 20% markup, not 40%.")],
  pics=["12.1"], flags=["numbers"])

C("S12-15", K, "Priced by and price details show no part status",
  [WOU, tier("A"), MX, CUSTA, "Have a new work order for this test, work order 1, for customer A, with a special-order part of category A that is requested and not yet received.", DESK],
  [OPEN, "Point at the special-order part's sell price.", "Click the Parts tab."],
  [R(S("S12-R7", "The Parts and Lines tables keep today's status."), "The Lines tab shows the part's status (for example Requested) as today."),
   R(S("S12-R7", "The Priced by column and the price details show no part status, such as \"Received\"."), "The details name the source and rule.", "They show no part status."),
   R(S("S12-R7"), "The Parts tab still shows the part's status as today.", "Its Priced by names the source in words, with no status.")],
  pics=["12.1", "12.4"])

C("S12-16", K, "No pricing source shows while a part is being added",
  [WOU, tier("A"), MX, PART, CUSTA, "Have a new work order for this test, work order 1, for customer A, with no parts.", DESK],
  [OPEN, "Start adding part A with Quick Add.", "Save the part."],
  [R(S("S12-R8"), "Work order 1 opens."),
   R(S("S12-R8", "While a part is being added (Quick Add, the inline row), no pricing source shows."), "The add row shows part A's price fields.", "No pricing source shows on it."),
   R(S("S12-R8", "The price details and the Manual icon appear once the part is saved."), "Part A is saved at $12.00.", "Hovering its price now opens the details naming tier A.")],
  pics=["12.1"])

C("S12-17", K, "The Priced by column is read-only",
  BASE, [OPEN, "Click the Parts tab.", "Click part A's Priced by."],
  [R(S("S12-R9"), "Work order 1 opens."), R(S("S12-R9"), "Part A's Priced by reads tier A."),
   R(S("S12-R9", "The Priced by column is read-only: nothing reprices a line from it."), "Nothing opens to edit the source.", "Part A still sells at $12.00 and still reads tier A.")],
  pics=["12.4"])

C("S12-18", K, "A part with no cost opens details for the tier at $0.00",
  [WOU, tier("A"), MX, CUSTA, "Have a new work order for this test, work order 1, for customer A, with a quick-added part of category A that has no cost.", DESK],
  [OPEN, "Point at the no-cost part's sell price."],
  [R(S("S12-N2"), "The part sells at $0.00."),
   R(S("S12-N2", "A part with no cost opens price details for the customer's tier at $0.00 (S10-N1), on work orders and Part Sales, never the Manual icon."),
     "The details name tier A with a sell price of $0.00.", "The price shows no Manual icon.")],
  pics=["12.1"])

C("S12-19", K, "Nothing about what priced a part shows on documents",
  BASE + ["Use a client whose customer portal is turned on, so work order 1 can be opened there."],
  [OPEN, "Print work order 1.", "Open work order 1's estimate.", "Invoice work order 1.", "Open the invoice PDF.", "Open work order 1 in the customer portal."],
  [R(S("S12-N3"), "Work order 1 opens."),
   R(S("S12-N3", "Nothing about what priced a part shows on the customer's invoice, the estimate, the work order printout, a PDF or in the customer portal in this release."),
     "The printout shows part A at $12.00.", "It shows no Priced by, tier name or price details."),
   R(S("S12-N3"), "The estimate shows part A at $12.00.", "It shows no pricing source."), R(S("S12-N3"), "The work order is invoiced."),
   R(S("S12-N3"), "The invoice PDF shows part A at $12.00.", "It shows no pricing source."),
   R(S("S12-N3"), "The portal shows part A at $12.00.", "It shows no pricing source.")],
  nopic="no design board draws the printout, estimate, invoice or portal")

C("S12-20", K, "On a tablet a tap opens the price details and a tap elsewhere closes them",
  BASE[:-1] + ["Use a tablet, or a browser window between 768 and 1024 pixels wide with touch."],
  [OPEN, "Tap part A's sell price on the Lines tab.", "Tap an empty part of the page."],
  [R(S("S12-E1"), "Work order 1 opens."),
   R(S("S12-E1", "On a tablet a tap on the price opens the details (S12-R2)"), "The price details open, naming tier A."),
   R(S("S12-E1", "a tap elsewhere closes them"), "The details close.", "Part A still reads $12.00.")],
  pics=["12.1"])

C("S12-21", K, "On a phone the Priced by column is hidden and status stays",
  BASE[:-1] + ["Use a phone, or a browser window narrower than 768 pixels."],
  [OPEN, "Tap the Parts tab."],
  [R(S("S12-R7"), "Work order 1 opens."),
   R([S("S12-R3"), QT("hide the column at phone width", "TPX-21")], "The Parts list shows part A with its price.", "It has no Priced by column.")
   + R(S("S12-R7", "The Parts and Lines tables keep today's status."), "The part's status column shows as today.")],
  nopic="no design board draws the work order on a phone")

C("S12-22", K, "A line kept through Change Customer names the customer it was priced for",
  BASE + [customer("B", ", on tier A for work orders")],
  [OPEN, "Open work order 1's three-dot menu.", "Click Change Customer.", "Pick customer B.", "Click Update Customer.", HOVER],
  [R(S("S12-R17"), "Work order 1 opens for customer A."), R(S("S14-R4"), "The menu lists Change Customer."), R(S("S14-R4"), "The Change Customer dialog opens."),
   R(S("S14-E1"), "Customer B is picked."), R(S("S14-R2"), "Work order 1 now shows customer B."),
   R(S("S12-R17", "A line kept through Change Customer says so in its details, for example \"Priced by Fleet for Acme Freight\"."),
     "The details read \"Priced by\" tier A's name \"for\" customer A's name.", "Part A still sells at $12.00.")],
  pics=["12.9"])
