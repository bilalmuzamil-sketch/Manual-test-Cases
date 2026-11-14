"""Story 18 — Accounting and QuickBooks receive the right figures (SV-11707), PRD v37 S18 rows (no design page, not a screen in ShopView).
Batch B, phase 2, 14 Nov 2026. Checked in the QuickBooks sandbox connected to staging; AccountingHub on staging if connected there, otherwise the
production test account after the release (look only), as the QA lead allowed for this one check."""
from tp_lib import C, R, B, S, QP, QD, QT, QL, QJ, HOLD
from common import *
from cases_s10 import WOA, MX, TR, CU, WO, OPENWO, ADDP

K = "S18"
QB = "Use staging with the QuickBooks sandbox connected, and sign in to that QuickBooks sandbox in a second browser window."
NOPIC = "Story 18 has no design page (not a screen in ShopView); the check is made in QuickBooks or AccountingHub"

C("S18-01", K, "QuickBooks receives each part line at its invoice price, in today's shape",
  [WOA, QB, MX(), TR(), CU(), "Have a new inventory part for this test at your location, in category A, cost $10.00, fixed sell price $12.50.",
   WO("1", "A", ", with a tier-priced part in category A at $121.50, the fixed-price part at $12.50 and a part with a typed price of $99.00"), DESK],
  [OPENWO(), "Click Invoice.", "Open the invoice in the QuickBooks sandbox once it has synced."],
  [R(S("S18-R1"), "Work order 1 opens with its three parts."), R(S("S18-R1"), "The invoice is created and syncs as today."),
   R(S("S18-R1", "Each part line is sent with its sell price exactly as on the invoice, whatever priced it."),
     "QuickBooks shows the three part lines at $121.50, $12.50 and $99.00, the same as the ShopView invoice ($121.50 + $12.50 + $99.00 = $233.00).")
   + R(S("S18-R1", "The figures sent are unchanged in shape: no new fields, and neither the pricing source nor the price details are sent."),
       "No line in QuickBooks mentions a tier, Manual, Fixed price or a price details text.")],
  nopic=NOPIC, flags=["numbers"])

C("S18-02", K, "An invoice synced again after a tier change sends the same prices",
  [WOA, QB, MX(), TR(), CU(), WO("1", "A", ", with a tier-priced part in category A at $121.50, invoiced and synced to QuickBooks"), DESK],
  [TIERS, open_tier("A"), "Set tier A's rule in matrix A to % Off 20 with Set Rule.", OPENWO(), "Sync the invoice to QuickBooks again from its Finance tab.",
   "Open the invoice in the QuickBooks sandbox."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R24"), "Matrix A's row reads 20% off."),
   R(S("S11-R6"), "Work order 1's part still reads $121.50."), R(S("S18-R1"), "The invoice syncs again."),
   R(S("S18-R1", "An invoice re-synced after a tier or matrix changed sends the prices on its lines, which never change (S11-R6)."),
     "The QuickBooks line still reads $121.50, not $108.00 ($135.00 × 0.80).")],
  nopic=NOPIC, flags=["numbers"])

C("S18-03", K, "QuickBooks books part revenue by the line's category",
  [WOA, QB, MX(extra=", mapped in Settings › Categories to a QuickBooks item for this test, item A"),
   MX("B", "B", "Markup % 35", ", mapped to a different QuickBooks item, item B"), CU("B", "Default"),
   "Have a new inventory part for this test at your location, in category A, cost $100.00.",
   WO("1", "B", ", with that inventory part on line 1, its line category changed to category B, invoiced and synced"), DESK],
  [OPENWO(), "Open the invoice in the QuickBooks sandbox."],
  [R(S("S18-R3"), "Work order 1 shows the part in category B."),
   R(S("S18-R3", "QuickBooks and AccountingHub book part revenue by the category on the work order or Part Sale line, as today."),
     "The QuickBooks line uses item B (category B, the line's category), not item A (category A, the part's own category).")],
  nopic=NOPIC)

C("S18-04", K, "A credit books to the inventory part's current category",
  [WOA, QB, MX(extra=", mapped to a QuickBooks item for this test, item A"), MX("B", "B", "Markup % 35", ", mapped to a different QuickBooks item, item B"),
   CU("B", "Default"), "Have a new inventory part for this test at your location, in category A, cost $100.00.",
   WO("1", "B", ", with that inventory part on line 1 at $135.00, invoiced and synced"), "Make sure the inventory part was moved to category B after the invoice synced.", DESK],
  [ "Make a credit for the part line from work order 1's invoice.", "Open the credit in the QuickBooks sandbox once it has synced."],
  [R(S("S18-R3"), "A credit for the part is made and syncs."),
   R(S("S18-R3", "Credits and refunds use the inventory part's current category, as today."), "The QuickBooks credit line uses item B, mapped to category B, the part's current category.", "It does not use item A of category A.")],
  nopic=NOPIC)

C("S18-05", K, "A synced invoice is not sent again when its category is deleted",
  [WOA, QB, "Have a new category for this test, category A, mapped to a QuickBooks item for this test, item A.", CU("B", "Default"),
   WO("1", "B", ", with a part in category A, invoiced and synced to QuickBooks"), DESK],
  [CATEGORIES, "Click category A.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the question.", "Open the invoice in the QuickBooks sandbox.",
   OPENWO(), "Sync the invoice to QuickBooks again from its Finance tab.", "Open the invoice in the QuickBooks sandbox again."],
  [R(S("S8-R8"), "The Categories page lists category A."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8"), "The menu shows Audit Log and Delete."),
   R(S("S8-R8"), "The Delete question opens."), R(S("S8-R8"), "Category A is deleted."),
   R(S("S18-R5", "An invoice already synced is not sent again because a deleted category's lines moved to Uncategorized (S8-R8)."),
     "The QuickBooks invoice still shows item A and its last change date is before the delete."),
   R(S("S8-E1"), "Work order 1's part now shows Uncategorized."), R(S("S18-R5"), "The invoice syncs again."),
   R(S("S18-R5", "If it is re-synced later, its part revenue books to Uncategorized's QuickBooks item."), "The QuickBooks line now uses Uncategorized's item.")],
  nopic=NOPIC)

C("S18-06", K, "Deleting a category is sent to AccountingHub as category changes are",
  [WOA, "Use staging if AccountingHub is connected there; otherwise use the production test account after the release (a look-only check in AccountingHub).",
   "Have a new category for this test, category A, with no parts.", DESK],
  [CATEGORIES, "Click category A.", "Open the page's three-dot menu.", "Click Delete.", "Click Delete in the question.", "Open AccountingHub's category list for this client."],
  [R(S("S8-R8"), "The Categories page lists category A."), R(S("S8-R8"), "Category A's page opens."), R(S("S8-R8"), "The menu shows Audit Log and Delete."), R(S("S8-R8"), "The Delete question opens."),
   R(S("S8-R8"), "Category A is deleted."),
   R(S("S18-R6", "Deleting a category is sent to AccountingHub the way category changes are today."),
     "AccountingHub shows category A as removed (deactivated), the way it shows a category change today.")],
  nopic=NOPIC, marker=HOLD("runs where AccountingHub is connected: staging if it is, otherwise the production test account after the release"))

C("S18-07", K, "With no integration connected nothing is sent",
  [WOA, "Use a staging client with no QuickBooks, AccountingHub or IBS connection (Settings › Integrations shows none connected).", MX(), TR(), CU(),
   WO("1", "A", ", with a tier-priced part in category A at $121.50"), DESK],
  [OPENWO(), "Click Invoice.", "Open Settings › Integrations."],
  [R(S("S18-N1"), "Work order 1 opens."),
   R(S("S18-N1", "If no integration is connected, nothing is sent, as today."), "The invoice is created at $121.50 for the part, as today.", "No sync status or sync error shows on it."),
   R(S("S18-N1"), "Settings › Integrations still shows no integration connected.")],
  nopic=NOPIC)
