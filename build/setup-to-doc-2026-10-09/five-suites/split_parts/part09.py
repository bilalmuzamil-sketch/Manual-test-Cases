import sys; sys.path.insert(0, __file__.rsplit("/",1)[0]); from common import *
PERM = 'You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.'
FR = "The Fixed Rules tab is open."
OPENNAV = (0, "Open Settings", None)
UB = "User B: a teammate at the same location to tag, who can sign in."
D = {
154749: ([PERM, FR], [OPENNAV], ""),
154750: ([PERM, FR, 1], [OPENNAV], ""),
154751: (None, [], ""),
236959: ([ADMIN_PI, CUST, VEND,
          f'The seeded part sale: {NEWSALE}, with the part "Brake Pads" (Quantity 1; Vendor = the test vendor; Sell Price $100.00).',
          'The sale\'s tax rate is set to an 8.25% rate (for example "ZZAUTOTEST 8.25%").',
          "The sale's own Total on the Finance tab is $108.25 ($100.00 + $8.25 tax).",
          "For comparison, a work order for the same customer with a taxable $100.00 part (Sell Price $100.00, tax 8.25%)."],
         [(1, "If not:", None), (2, "If not:", None), 3, 4, 5, 6, (7, "top menu Work Orders", None)], ""),
236967: ([0, UB, "Two locations User A and User B can both switch between, Location 1 and Location 2.",
          "A work order at Location 2.",
          'The customer (for example "4 Star Truck Repair"), whose own notes are on its Notes tab.',
          "User B is kept signed in on a second browser, at Location 1."],
         [(1, "on a QA branch", None), "with your initials at the top right -> Change Location", (3, "switch to Location 2", "Create Work Order"),
          (4, "top menu Customers", None), (5, "on its Notes tab", None), 6], ""),
236970: ([0, UB, 'A work order at this location (customer for example "4 Star Truck Repair").',
          'A tag group you own (for example "ZZ Pair").',
          'A note on the work order: "Please check this @Tech ShopView and @ZZ Pair today" (tagging User B and the group).'],
         [(1, "on a QA branch", None), (2, "top menu Work Orders", None), (3, "on its Notes tab", None), (4, "bell ->", "New tag group"), 5], ""),
236974: ([0, "A part sale at this location, for a customer that has a Customer Portal login for one of its contacts.", 2, 3],
         [(1, "top menu Parts", "click Save.")], ""),
}
