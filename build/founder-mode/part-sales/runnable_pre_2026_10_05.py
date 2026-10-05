"""Runnable preconditions for the 22 Part Sales cases touched on 5 October 2026 (QA lead: preconditions are
setups a manual tester must understand and be able to set up in the account, in the tester's language).
Labels come only from recorded sources: the specification, the design canvas, the playbook (roles/staff/
inventory/vendors), the Price & Category suite (Settings -> Parts -> Categories, QuickBooks Products And
Services column) and Mudassir's build-run cases (Administration -> QuickBooks, ShopPay)."""

ADMIN = "Sign in as an Owner/Admin user. That role holds every permission, including Part sales -> Create & Edit and Invoicing & payments -> Create & Edit."
CUSTOMER = 'A test customer exists. If not: Customers -> New Customer, enter a name (e.g. "4 Star Truck Repair") and save.'
VENDOR = 'A test vendor exists to order parts from. If not: Parts -> Vendors -> New Vendor, enter a Name (e.g. "ZZAUTOTEST Parts Supply"), then Save & Close.'
NEWSALE = "Start a new part sale today (a sale started before this release handles cores the old way): Parts -> Part Sales -> New Part Sale, then select the customer."
CORELINE = ('On the Parts tab click Add Part and fill the row: Description "Water Pump", Quantity 1, Vendor = the test vendor, '
            "Sell Price $517.55, and in the Core column a Core Charge of $79.99. Save the row.")
ORDER = "In that row's Actions column click Order and confirm. The row now shows Awaiting."
RECEIVE = ("Click Receive on the row; in the Receive parts dialog keep the full quantity and confirm. "
           "The part row reads Received and its core row offers Return Core in the Actions column.")
RETURN = "On the core row click Return Core. The core row shows the Returned badge, and the document gains a Core credit row of -$79.99."
PAY_FULL = "Click Create Invoice. In New Customer Payment record a payment for the full balance (Payment Method e.g. \"Cash\") and save. Do not just close the dialog: closing it without paying cancels the invoice."
UNPAY = "Then, on the Finance tab, find that payment in the payment history and reverse it. The sale stays invoiced, with no payment applied."
DEPOSIT = 'On the Finance tab click Add Deposit; in Create Deposit enter Deposit Amount $50.00 (e.g.) and a Payment Method (e.g. "Cash"), then click Record Deposit.'
SIMPLE_SALE = 'On the Parts tab click Add Part: Description "Brake Pads", Quantity 1, Vendor = the test vendor, Sell Price $290.91. Save the row.'
TO_COMPLETE = "Order and Receive that part (Actions column: Order, then Receive and confirm). Receiving every part takes the sale to Complete."
WO_COMPLETE = "A service work order at Complete for the same customer: Work Orders -> New Work Order, select the customer, add a line, approve the line, then click Complete."
WO_CORE = ("A service work order for the same customer with a received core: Work Orders -> New Work Order, select the customer, add a line, "
           "add a part to it with Vendor = the test vendor and a Core Charge of $79.99, then Order and Receive the part.")
ROLE = ("Create the test role: Settings -> Roles & Permissions -> Create custom role -> choose a template (e.g. \"Parts Manager\") -> Apply; {perm}; "
        "enter the Role name \"{name}\" and click Create. Assign it: Settings -> Staff -> open a spare test user -> Edit Staff Member -> Role -> "
        "pick \"{name}\" -> save. That user must log out and back in before testing (a role change ends their session).")
QB_ON = "QuickBooks Online is connected to this shop: Administration -> QuickBooks shows the QuickBooks test company connected. If it is not, connect it there and sign in to the QuickBooks test company."
QB_MAP = ("The core's part category is mapped to a QuickBooks item: Settings -> Parts -> Categories; on the category the part uses "
          "(\"Uncategorized\" if none was chosen) pick an item in the QuickBooks Products And Services column (e.g. \"Parts\").")
TABLET = "A tablet you can hold in portrait, 768 pixels wide (e.g. a standard iPad in portrait). If you have none, ask for one; a resized desktop window cannot be measured reliably by hand."

def core_sale(received=True, returned=False):
    s = [VENDOR, NEWSALE, CORELINE]
    if received: s += [ORDER, RECEIVE]
    if returned: s += [RETURN]
    return s

PRE = {
 154586: [ADMIN, CUSTOMER, VENDOR, NEWSALE, CORELINE,
          "Leave the part unordered and unreceived (its Status stays Quoted).",
          "The sale's tax is GST 5% (the expected figures use it). If not, on the Financial Info card click Edit tax rate, pick GST 5% and Save."],
 154589: [ADMIN, CUSTOMER] + core_sale(received=True, returned=True),
 154591: [CUSTOMER] + core_sale(received=True) + [WO_CORE,
          ROLE.format(name="ZZAUTOTEST Parts no core", perm="tick Part sales -> Create & Edit, and untick Vendors -> Create & Edit, Work Order Parts -> Create and Work Orders -> Create & Edit") + " This user is User X.",
          ROLE.format(name="ZZAUTOTEST No financial data", perm="untick See Financial Data") + " This user is User Y.",
          "Build the sale and the work order while signed in as an Owner/Admin user, then switch to User X and User Y for the steps."],
 154593: [ADMIN, CUSTOMER, VENDOR, NEWSALE,
          'On the Parts tab click Add Part: Description "Water Pump", Quantity 10, Vendor = the test vendor, Sell Price $517.55, Core Charge $79.99. Save the row.',
          "In the Actions column click Order and confirm (all 10 are ordered).",
          "Click Receive; in the Receive parts dialog change the quantity to 6 and confirm. 4 are still owed."],
 154595: [ADMIN, CUSTOMER] + core_sale(received=True) + [
          "A service work order for the same customer to move the part onto: Work Orders -> New Work Order, select the customer, add a line."],
 154596: [ADMIN, CUSTOMER, QB_ON, QB_MAP] + core_sale(received=True, returned=True) + [
          "A second part sale for the unmapped check: Settings -> Parts -> Categories -> New Category, name it \"ZZAUTOTEST No QuickBooks item\" and leave its QuickBooks Products And Services empty. "
          "Then build a second sale exactly as above, but set the part's Category to \"ZZAUTOTEST No QuickBooks item\" before ordering; Order, Receive and Return Core on it too."],
 154597: [ADMIN, CUSTOMER] + core_sale(received=True, returned=True) + [PAY_FULL, UNPAY,
          "A second part sale built the same way (new sale, core line, Order, Receive) but NOT returned. Before invoicing, take a deposit for its full total: read the Total on the Finance tab (e.g. $627.42), then Add Deposit for that amount and Record Deposit.",
          "Click Create Invoice on the second sale. The deposit applies automatically; if New Customer Payment opens, it shows nothing left to pay - close it."],
 154598: [ADMIN, CUSTOMER] + core_sale(received=True, returned=True),
 154601: [ADMIN, CUSTOMER] + core_sale(received=False) + [ORDER + " Do not receive it yet.",
          "For comparison, a service work order with an ordered core: Work Orders -> New Work Order, select the customer, add a line, add a part with Vendor = the test vendor and a Core Charge of $79.99, and click Order. Do not receive it yet."],
 154603: [ADMIN, CUSTOMER, VENDOR, NEWSALE,
          'An inventory core in stock whose own price differs from the quote: Parts -> Inventory -> New Inventory Part, Description "ZZAUTOTEST Core - Water Pump", Quantity in stock 1, Sell Price $85.00; save.',
          'On the new sale\'s Parts tab click Add Part for that inventory core, enter Core Charge $79.99 as the quoted figure, and save the row. Its Actions column offers Pick (the part is In Stock); do not pick it yet.'],
 154608: [ADMIN, CUSTOMER, VENDOR, NEWSALE, SIMPLE_SALE, TO_COMPLETE, PAY_FULL, UNPAY,
          'Two tax rates exist: Settings -> Taxes. If needed add one, e.g. "ZZAUTOTEST 6%" at 6.00%.',
          ROLE.format(name="ZZAUTOTEST No part sale edit", perm="untick Part sales -> Create & Edit (leave Part sales View ticked)") ],
 154611: [ADMIN, CUSTOMER, VENDOR, NEWSALE, SIMPLE_SALE,
          TO_COMPLETE + " Do not invoice it.", WO_COMPLETE],
 154618: [ADMIN, CUSTOMER,
          'Two staff members are marked as sales representatives: Settings -> Staff -> open the staff member -> Edit Staff Member -> turn on the Sales Rep toggle -> save. Do this for two people (e.g. "Dana Lee" and "Sam Ortiz").',
          "A third staff member has the Sales Rep toggle off.",
          VENDOR, NEWSALE, 'In the header card set Sales Representative to the first rep (e.g. "Dana Lee").', SIMPLE_SALE, TO_COMPLETE, PAY_FULL, UNPAY],
 154624: [ADMIN, CUSTOMER, VENDOR,
          'Sale A: Parts -> Part Sales -> New Part Sale, select the customer; Add Part "Water Pump" (Vendor = the test vendor, Sell Price $517.55, Core Charge $79.99) and Add Part "Brake Pads" (Sell Price $290.91). Then ' + DEPOSIT[0].lower() + DEPOSIT[1:],
          "Sale B: built exactly like Sale A, with its own $50.00 deposit.",
          "Sale C: a new part sale with one part (\"Brake Pads\", $290.91); Order and Receive it, then " + PAY_FULL[0].lower() + PAY_FULL[1:]],
 154625: [ADMIN, CUSTOMER, VENDOR, NEWSALE,
          'Add two parts on the Parts tab (e.g. "Brake Pads" $290.91 and "Oil Filter" $12.50, Vendor = the test vendor). The sale reads Estimate.',
          "For the Declined step you will decline each line from its row menu; a sale reads Declined only once every line is declined."],
 154634: [ADMIN, CUSTOMER, NEWSALE, SIMPLE_SALE + " The sale reads Estimate.",
          "Checkable by hand: a shop with online payments off, or a user with no Customer Portal access. Use either: (1) on this test shop, ShopPay turned off; or (2) a test role without Customer Portal access - "
          + ROLE.format(name="ZZAUTOTEST No portal", perm="untick the Customer Portal permission"),
          "Not checkable by hand: a Customer Portal that cannot be reached. A manual tester cannot take the portal offline, so that half is left to automation."],
 154635: [ADMIN, CUSTOMER, NEWSALE, SIMPLE_SALE + " The sale reads Estimate.",
          "Know whether this build's Customer Portal takes part sale deposits: the release notes for this build say so, or ask the QA lead. The expected results cover both answers."],
 154640: [ADMIN, CUSTOMER, QB_ON, QB_MAP] + core_sale(received=True, returned=True) + [PAY_FULL.replace("Click Create Invoice.", "Click Create Invoice so the invoice syncs to QuickBooks."),
          "Compare every figure to the cent; do not estimate."],
}

NEW_PRE = {
 "S3-R6": [ADMIN, CUSTOMER, VENDOR, NEWSALE,
           'On the Parts tab click Add Part: Description "Brake Pads", Quantity 1, Vendor = the test vendor, Sell Price $100.00. Save the row.',
           'Set the tax: on the Financial Info card click Edit tax rate, pick an 8.25% rate and Save (if none exists, add "ZZAUTOTEST 8.25%" at 8.25% under Settings -> Taxes first).',
           "Check the sale's own Total on the Finance tab: $108.25 ($100.00 + $8.25 tax).",
           "For comparison, a work order for the same customer with a taxable $100.00 part: Work Orders -> New Work Order, select the customer, add a line with a part at Sell Price $100.00, tax 8.25%."],
 "S8-N6": [ADMIN, CUSTOMER, VENDOR, NEWSALE, SIMPLE_SALE, TO_COMPLETE + " Do not invoice it.", WO_COMPLETE],
 "S8-R15": [ADMIN, CUSTOMER, VENDOR, NEWSALE, SIMPLE_SALE + " The sale reads Estimate.",
            "For the comparison step, a service work order for the same customer: Work Orders -> New Work Order, select the customer, add a line.",
            "For the Customer Portal steps only: ShopPay is on for this shop with a connected account and at least one payment method, and you can open the payment link as the customer and pay with the shop's test card. If Collect in Portal is disabled on this build (the portal does not yet take part sale deposits), mark steps 4-5 Blocked and write why."],
 "FORM-768": [ADMIN, CUSTOMER] + core_sale(received=True) + [TABLET],
}

STEP_FIX = {  # step wording a manual tester cannot act on
 154603: ["Add Part with a Core Charge of $0.00 and try to save; read the message shown.",
          "Add a part with no Core Charge and save; check the grid for a core row under it.",
          "On the inventory core row click Pick, and watch the sale Total on the Finance tab change at that moment."],
}
