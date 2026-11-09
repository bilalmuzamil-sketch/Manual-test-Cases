"""Story 14 — Asset Work Orders tab: whole history and Customer filter (SV-12316): every service work order on the asset at the current
location, for every customer, in today's sort (the release-day change), only the current location, the "Customer" chip and its options,
multi-select matching the customer or the Bill To, search above 8 options, the "Bill To" column, the reset on another asset, and the
Status filter including Imported. Counts are exact (Rule 116)."""
from bt_lib import C
from common import *

S = "S14"
HIST = ("Have a new asset for this test, asset 1, now owned by customer A, that earlier belonged to customer C, with work order 1 for "
        "customer C (made first, while customer C owned it) and work order 2 for customer A (made later), both at the test location and "
        "billing their own customer.")
A = cust("A", ", the asset's current owner")
CO = cust("C", ", the asset's earlier owner")
TAB = "Open asset 1's Work Orders tab from customer A's page."
CHIP = 'Click the "Customer" filter chip.'

C("S14-01", S, "The asset's Work Orders tab lists every owner's work orders",
  [ADMIN, A, CO, HIST],
  [TAB],
  [["Work order 1 (customer C) and work order 2 (customer A) are both listed: 2 rows.",
    "They are in today's order for this tab, work order 1 first as the older one."]],
  ["S14-R1", "KD-ASSET", "REL-1"])
C("S14-02", S, "The tab lists only work orders at the current location",
  [ADMIN, A, CO, HIST,
   "Have a new work order for this test, work order 3, for customer A on asset 1 at a second location, so the tab has one work order it must not list."],
  [TAB],
  [["Work order 1 (customer C) and work order 2 (customer A) are listed.", "Work order 3, at the other location, is not listed: 2 rows."]],
  ["S14-R1", "KD-ASSET"])
C("S14-03", S, "The Customer chip sits beside Status and starts at All customers",
  [ADMIN, A, CO, HIST],
  [TAB],
  [['A "Customer" filter chip sits beside the Status filter and reads "Customer: All customers".', "Work order 1 (customer C) and work order 2 (customer A) are listed."]],
  ["S14-R2"])
C("S14-04", S, "Customer chip options are every customer or Bill To on the asset, A to Z",
  [ADMIN, A, CO, cust("B", ", a payer"),
   "Have a new asset for this test, asset 1, now owned by customer A, that earlier belonged to customer C, with work order 1 for customer C "
   "billing itself and work order 2 for customer A billed to customer B, both at the test location."],
  [TAB, CHIP],
  [["Work order 1 and work order 2 are listed."],
   ['"All customers" is ticked.', "The options are customer A, customer B and customer C, in A to Z order by name: customer B is listed although it is only a Bill To."]],
  ["S14-R3"])
C("S14-05", S, "Picking customers keeps work orders where they are customer or Bill To",
  [ADMIN, A, CO, cust("B", ", a payer"),
   "Have a new asset for this test, asset 1, now owned by customer A, that earlier belonged to customer C, with work order 1 for customer C "
   "billing itself and work order 2 for customer A billed to customer B, both at the test location."],
  [TAB, CHIP, "Tick customer B.", "Tick customer C.", "Apply the filter."],
  [["2 rows are listed."], ["The options show."], ['The chip shows "1 selected".'], ["Two customers are ticked."],
   ["Work order 2 is listed (customer B is its Bill To) and work order 1 is listed (customer C is its customer): 2 rows."]],
  ["S14-R4", "KD-ASSET"])
C("S14-06", S, "Filtering by a payer alone keeps only the work order it pays for",
  [ADMIN, A, CO, cust("B", ", a payer"),
   "Have a new asset for this test, asset 1, now owned by customer A, that earlier belonged to customer C, with work order 1 for customer C "
   "billing itself and work order 2 for customer A billed to customer B, both at the test location."],
  [TAB, CHIP, "Tick customer B.", "Apply the filter."],
  [["2 rows are listed."], ["The options show."], ['The chip shows "1 selected".'], ["Only work order 2 is listed: 1 row.", "Work order 1, customer C's with no payer, is not listed."]],
  ["S14-R4"])
C("S14-07", S, "With more than 8 options the Customer chip offers search",
  [ADMIN, A, "Have a new asset for this test, asset 1, owned by customer A, with nine work orders at the test location: one for customer A "
   "billing itself and eight for customer A, each billed to a different new payer, so the chip has 9 options."],
  [TAB, CHIP, "Type the first word of one payer's name in Search customers."],
  [["9 rows are listed."], ['The chip shows a "Search customers" box above its 9 options.'], ["Only the payers whose names match are listed."]],
  ["S14-R5"])
C("S14-08", S, "With 8 options or fewer the Customer chip has no search",
  [ADMIN, A, "Have a new asset for this test, asset 1, owned by customer A, with eight work orders at the test location: one for customer A "
   "billing itself and seven for customer A, each billed to a different new payer, so the chip has exactly 8 options."],
  [TAB, CHIP],
  [["8 rows are listed."], ["The chip lists its 8 options.", 'No "Search customers" box shows.']],
  ["S14-R5"])
C("S14-09", S, "A Bill To column shows when a row bills someone else",
  [ADMIN, A, cust("B", ", a payer"),
   "Have a new asset for this test, asset 1, owned by customer A, with work order 1 billed to customer B and work order 2 billing customer A, both at the test location."],
  [TAB],
  [['A "Bill To" column shows.', "Work order 1 reads customer B's name under Bill To.", "Work order 2's Bill To cell is blank."]],
  ["S14-R6"])
C("S14-10", S, "No Bill To column when every row bills its own customer",
  [ADMIN, A, CO, HIST],
  [TAB],
  [["Work order 1 and work order 2 are listed with the Customer column.", 'No "Bill To" column shows.']],
  ["S14-R6", "KD-SHOW"])
C("S14-11", S, "The Customer filter resets when another asset is opened",
  [ADMIN, A, CO, HIST, "Have a new asset for this test, asset 2, owned by customer A, with one work order at the test location."],
  [TAB, CHIP, "Tick customer C.", "Apply the filter.", "Open asset 2's Work Orders tab."],
  [["2 rows are listed."], ["The options show."], ["Customer C is ticked."], ["Only work order 1 is listed; work order 2 is not."],
   ['The "Customer" chip reads "Customer: All customers".', "Asset 2's work order is listed."]],
  ["S14-R7"])
C("S14-12", S, "Picking Imported in Status disables and clears the Customer filter",
  [ADMIN, A, CO, HIST],
  [TAB, CHIP, "Tick customer C.", "Apply the filter.", "Add Imported to the Status filter."],
  [["2 rows are listed."], ["The options show."], ["Customer C is ticked."], ["Only work order 1 is listed; work order 2 is not."],
   ['The "Customer" chip is disabled.', 'It reads "Customer: All customers": the pick was cleared.']],
  ["S14-N1"])
