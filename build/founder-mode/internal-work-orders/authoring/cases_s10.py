"""Story 10 — Shop supplies on internal and no-charge work orders (SV-11767): the flat "Shop supplies" amount, its default from the
customer's Min, Edit Customer accepting Min without a percentage, editing until Close, resets on customer change and conversion, billable
again, the Close row and the document line, $0.00, the permission, and the edge cases. Posting is checked in Stories 7 and 8."""
from iwo_lib import C, NOMAN
from common import *

S = "S10"
SS = '"Shop supplies"'

C("S10-01", S, "A new internal work order takes the customer's Min as Shop supplies",
  [ADMIN, ON, icust("A", ", with a Min shop supplies charge of $15.00 and no percentage, with one asset, asset 1")],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Click Save in the New Work Order window."],
  [["The New Work Order window opens."], ['The "Internal" badge shows.'], ["Asset 1 is picked."],
   [f'The work order shows one field {SS} reading $15.00 in the block where a billable work order shows its totals.', "No percentage is applied."]],
  ["S10-R1", "OV-SS", "KD-SUPPLIES"])
C("S10-02", S, "Without a Min, Shop supplies starts at $0.00",
  [ADMIN, ON, icust("A", ", with no Min shop supplies charge, with one asset, asset 1"), "Make sure the test location has a shop supplies percentage set."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Click Save in the New Work Order window."],
  [["The New Work Order window opens."], ['The "Internal" badge shows.'], ["Asset 1 is picked."],
   [f"{SS} reads $0.00: the location's percentage does not apply."]],
  ["S10-R1"])
C("S10-03", S, "Converting to No Charge sets Shop supplies to the customer's Min",
  [ADMIN, ON, cust("A", ", with a Min shop supplies charge of $12.00"), wo(1, "A", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO, MENU, 'Click "Convert to No Charge".', 'Pick "Goodwill" in Category.', "Click the confirming Convert to No Charge button."],
  [["Work order 1 opens with its billable totals."], ['The menu shows "Convert to No Charge".'], ["The confirmation opens."], ["Goodwill is picked."],
   [f'{SS} reads $12.00.']],
  ["S10-R1", "S10-R2"])
C("S10-04", S, "Edit Customer accepts a Min without a percentage on a flagged customer",
  [ADMIN, ON, icust("A", " with no shop supplies percentage and no Min"), cust("B", ", not flagged, with no shop supplies percentage, so the two windows can be compared")],
  ["Open customer A's page.", "Click Edit Customer.", "Enter $15.00 in the Min shop supplies charge.", SAVE, "Open customer B's page.", "Click Edit Customer."],
  [["Customer A's page opens."], ["The Min field is enabled although no percentage is entered."], ["$15.00 shows."], ["The customer is saved with Min $15.00."],
   ["Customer B's page opens."], ["Customer B's Min field is disabled until a percentage is entered, as today."]],
  ["S10-R1"])
C("S10-05", S, "A percentage on a flagged customer never applies to its internal work orders",
  [ADMIN, ON, icust("A", ", with a shop supplies percentage of 10% and a Min of $15.00"), iwo(1, "A", "Approved", f", with {LABOR_2H}")],
  [OPEN_WO],
  [[f"{SS} reads $15.00, the Min; no 10% charge is added."]],
  ["S10-R1", "OOS-01"])
C("S10-06", S, "The Shop supplies amount can be edited until Close",
  [ADMIN, ON, icust("A", ", with a Min of $15.00"), iwo(1, "A", "Approved"), "Make sure work order 1's Shop supplies amount is $15.00."],
  [OPEN_WO, f"Change {SS} to $22.50 with the shop supplies control.", RELOAD],
  [[f"{SS} reads $15.00."], ["The new amount is saved."], [f"{SS} reads $22.50."]],
  ["S10-R2", "PM-08"])
C("S10-07", S, "A closed work order's Shop supplies amount cannot be edited",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed", ", whose Shop supplies amount is $15.00")],
  [OPEN_WO],
  [[f"{SS} shows $15.00 with no control to change it."]],
  ["S10-R2", "S2-R9"])
C("S10-08", S, "Making the work order billable drops the flat amount",
  [ADMIN, ON, "Make sure the test location charges shop supplies at 10% of labor.", cust("A", " with no shop supplies rule of its own, and its own labor rate of $120.00 an hour"),
   ncwo(1, "A", "Goodwill", "Approved", f", with {LABOR_2H}, whose Shop supplies amount is $15.00")],
  [OPEN_WO, MENU, 'Click "Convert to Billable".', "Click the confirming Convert to Billable button."],
  [[f"{SS} reads $15.00."], ['The menu shows "Convert to Billable".'], ["The confirmation opens."],
   ["The $15.00 flat amount is gone.", "Shop supplies is charged by the location's rule: $24.00 (10% of $240.00 labor)."]],
  ["S10-R2"])
C("S10-09", S, "Changing the Min later does not change an open work order",
  [ADMIN, ON, icust("A", ", with a Min of $15.00"), iwo(1, "A", "Approved", ", whose Shop supplies amount is $15.00")],
  ["Open customer A's page.", "Click Edit Customer.", "Change the Min shop supplies charge to $30.00.", SAVE, OPEN_WO],
  [["Customer A's page opens."], ["The window opens."], ["$30.00 shows."], ["The customer is saved."], [f"{SS} still reads $15.00: nothing is recalculated."]],
  ["S10-E1"])
C("S10-10", S, "The document's Summary shows Shop supplies under Parts cost",
  [ADMIN, ON, icust("A"), iwo(1, "A", "closed", f", with {STOCK_PART}, whose Shop supplies amount is $15.00")],
  [OPEN_WO, FIN],
  [["Work order 1 opens."], ['The Summary reads "Parts cost $80.00" and under it "Shop supplies $15.00".']],
  ["S10-R3"])
C("S10-11", S, "Without See Financial Data the Shop supplies field is not shown",
  [ON, icust("A"), iwo(1, "A", "Approved", ", whose Shop supplies amount is $15.00"), role("has 'Work Orders — Create & Edit' but not 'See Financial Data'")],
  [OPEN_WO],
  [[f"No {SS} field shows on work order 1."]],
  ["S10-N3", "PM-08"])
C("S10-12", S, "Without the invoicing permission the amount shows but cannot be changed",
  [ON, icust("A"), iwo(1, "A", "Approved", ", whose Shop supplies amount is $15.00"),
   role("has 'See Financial Data' but not 'Invoicing & Payments — Create & Edit'")],
  [OPEN_WO],
  [[f"{SS} shows $15.00 with no control to change it, as the shop supplies charge today."]],
  ["PM-08", "S10-R2"])
C("S10-13", S, "A failed Shop supplies save follows today's error handling",
  [ADMIN, ON, icust("A"), iwo(1, "A", "Approved")],
  [OPEN_WO, f"Change {SS} to $20.00."],
  [["Work order 1 opens."], ["When the save fails, the existing shop supplies error handling of the work order shows, unchanged."]],
  ["EH-S10"], marker=NOMAN("the save has to fail, which only a developer can make happen"))
