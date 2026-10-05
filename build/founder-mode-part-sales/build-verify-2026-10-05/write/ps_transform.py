import json,re,html,sys
d=json.load(open('/tmp/cln/ps104-live.json'))
HELD={154587,154588,154590,154592,154599,154602,154604,154605,154606,154607,154609,154610,154612,154617,154621,154622,154623,154637,154638,154639,154642,154878}
E=lambda s: html.escape(s,quote=False)
STAMP='<p>Last checked against build v26.40.7-7ffda69 on 10/5/2026.</p>'
M_READY='<p>AUTOMATION: READY</p>'
M_PORTAL='<p>AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch</p>'
M_QB='<p>AUTOMATION: HOLD - needs QuickBooks connected; the Part Sales QA branch has no QuickBooks company connected</p>'
M_NA='<p>AUTOMATION: Not available on Build to test Yet - Last checked 10/5/2026</p>'
CUSTOMER_NOTE=' (The payment dialog lists every open invoice for this customer and fills in an amount on each one: set the Payment amount of every other invoice to 0 so only this sale is paid.)'
# ---- shared precondition/step replacements (plain text, encoded below) ----
R=[
 ('A test customer exists. If not: Customers -> New Customer, enter a name (e.g. "4 Star Truck Repair") and save.',
  'A test customer exists. If not: top menu Customers -> New Customer, enter a Name (e.g. "4 Star Truck Repair") and click Save.'),
 ('A customer to sell to exists; if none does, create one first: Customers -> New Customer (e.g. "4 Star Truck Repair").',
  'A customer to sell to exists; if none does, create one first: top menu Customers -> New Customer, enter a Name (e.g. "4 Star Truck Repair") and click Save.'),
 ('A customer to sell to exists; if none does, create one via Customers -> New Customer (e.g. "4 Star Truck Repair").',
  'A customer to sell to exists; if none does, create one first: top menu Customers -> New Customer, enter a Name (e.g. "4 Star Truck Repair") and click Save.'),
 ('If not: Parts -> Vendors -> New Vendor, enter a Name (e.g. "ZZAUTOTEST Parts Supply"), then Save & Close.',
  'If not: top menu Parts -> Vendors (left sidebar) -> New Vendor, enter a Name (e.g. "ZZAUTOTEST Parts Supply"), pick a value in Taxes (required, e.g. "GST"), then click Save & Close.'),
 ('Parts -> Part Sales -> New Part Sale, then select the customer.',
  'top menu Parts -> Part Sales -> New Part Sale; in the New part sale dialog pick the Customer and click Save. The sale opens with the status Estimate.'),
 ('On the Parts tab click Add Part and fill the row: Description "Water Pump", Quantity 1, Vendor = the test vendor, Sell Price $517.55, and in the Core column a Core Charge of $79.99. Save the row.',
  'On the Parts tab click Add Part (on a sale with no parts the Add Part dialog opens by itself). In the Add Part dialog enter Description "Water Pump", Quantity 1 (required), Vendor = the test vendor, Sell Price $517.55 and Core Charge $79.99, then click Save & Close. The grid shows the part and, beneath it, a row "Core for Water Pump".'),
 ('On the Parts tab click Add Part: Description "Water Pump", Quantity 10, Vendor = the test vendor, Sell Price $517.55, Core Charge $79.99. Save the row.',
  'On the Parts tab click Add Part. In the Add Part dialog enter Description "Water Pump", Quantity 10, Vendor = the test vendor, Sell Price $517.55 and Core Charge $79.99, then click Save & Close. The grid shows the part and, beneath it, a row "Core for Water Pump".'),
 ('In the Actions column click Order and confirm (all 10 are ordered).',
  'Click Authorize (green button above the parts list); the sale becomes Approved and the row shows Auth To Order. In the row\'s Actions column click Order (all 10 are ordered; the row shows Awaiting).'),
 ('Click Receive; in the Receive parts dialog change the quantity to 6 and confirm. 4 are still owed.',
  'Click Receive. In the Receive parts dialog tick the rows, type a part number in each red Part number box (e.g. "ZZ-WP-1", then press Enter), enter the part row\'s Cost (e.g. $400.00), change Qty Received to 6 and click Receive Parts. 4 are still owed.'),
 ('On the Parts tab click Add Part: Description "Brake Pads", Quantity 1, Vendor = the test vendor, Sell Price $290.91. Save the row.',
  'On the Parts tab click Add Part (on a sale with no parts the Add Part dialog opens by itself). In the Add Part dialog enter Description "Brake Pads", Quantity 1 (required), Vendor = the test vendor and Sell Price $290.91, then click Save & Close.'),
 ('On the Parts tab click Add Part: Description "Brake Pads", Quantity 1, Vendor = the test vendor, Sell Price $100.00. Save the row.',
  'On the Parts tab click Add Part (on a sale with no parts the Add Part dialog opens by itself). In the Add Part dialog enter Description "Brake Pads", Quantity 1 (required), Vendor = the test vendor and Sell Price $100.00, then click Save & Close.'),
 ('Leave the part unordered and unreceived (its Status stays Quoted).',
  'Leave the part unordered and unreceived: do not click Authorize or Order (on this build its Status column reads Requested).'),
 ("In that row's Actions column click Order and confirm. The row now shows Awaiting.",
  "Click Authorize (green button above the parts list); the sale becomes Approved and the part row shows Auth To Order. In that row's Actions column click Order. The row now shows Awaiting."),
 ('Click Receive on the row; in the Receive parts dialog keep the full quantity and confirm. The part row reads Received and its core row offers Return Core in the Actions column.',
  'Click Receive on the row. In the Receive parts dialog tick both rows (Select All), type a part number in each red Part number box (e.g. "ZZ-WP-1", then press Enter), enter the part row\'s Cost (e.g. $400.00), keep Qty Received at the full quantity and click Receive Parts. The message "Parts received." appears; the part row reads Received and its core row offers Return Core in the Actions column.'),
 ('On the core row click Return Core. The core row shows the Returned badge, and the document gains a Core credit row of -$79.99.',
  'On the core row click Return Core (no confirmation appears). The core row\'s Status reads Returned, and the document on the Finance tab gains a Core credit row of -$79.99.'),
 ('Order and Receive that part (Actions column: Order, then Receive and confirm).',
  'Order and Receive that part: click Authorize (green button above the parts list), then in the row\'s Actions column click Order, then Receive; in the Receive parts dialog tick the row, type a part number in the red Part number box (e.g. "ZZ-BP-1", then press Enter), enter a Cost (e.g. $150.00) and click Receive Parts.'),
 ('Click Create Invoice. In New Customer Payment record a payment for the full balance (Payment Method e.g. "Cash") and save.',
  'On the Finance tab click Create Invoice. In the New Customer Payment dialog pick a Payment Method (e.g. "Cash") and click Make Payment for the full balance.'+CUSTOMER_NOTE),
 ('then click Create Invoice. In New Customer Payment record a payment for the full balance (Payment Method e.g. "Cash") and save.',
  'then on the Finance tab click Create Invoice. In the New Customer Payment dialog pick a Payment Method (e.g. "Cash") and click Make Payment for the full balance.'+CUSTOMER_NOTE),
 ('Click Create Invoice so the invoice syncs to QuickBooks. In New Customer Payment record a payment for the full balance (Payment Method e.g. "Cash") and save.',
  'On the Finance tab click Create Invoice so the invoice syncs to QuickBooks. In the New Customer Payment dialog pick a Payment Method (e.g. "Cash") and click Make Payment for the full balance.'+CUSTOMER_NOTE),
 ('Then, on the Finance tab, find that payment in the payment history and reverse it. The sale stays invoiced, with no payment applied.',
  'Then reverse that payment: top menu Customers -> open the customer -> Payments tab -> on the payment\'s row click the trash icon (tooltip "Remove") -> in the Confirmation dialog click Reverse. The sale stays Invoiced, with no payment applied.'),
 ('Reverse the invoice (the Reverse invoice action)',
  'Reverse the invoice (Finance tab -> the menu ( ... ) -> Reverse -> Reverse in the Warning dialog)'),
 ('reverse the invoice (the Reverse invoice action)',
  'reverse the invoice (Finance tab -> the menu ( ... ) -> Reverse -> Reverse in the Warning dialog)'),
 ('Settings -> Roles & Permissions -> Create custom role -> choose a template (e.g. "Parts Manager") -> Apply;',
  'Settings (click your initials at the top right -> Settings) -> Roles & Permissions -> Create Custom Role -> in Choose a template pick e.g. "Parts Manager" -> Apply;'),
 ('Settings -> Staff -> open a spare test user -> Edit Staff Member -> Role -> pick ',
  'Settings -> Staff -> on a spare test user\'s row click the edit icon -> in Edit Staff Member set Role to '),
 (' -> save. That user must log out',' -> Save & Close. That user must log out'),
 ('Settings -> Staff -> open the staff member -> Edit Staff Member -> turn on the Sales Rep toggle -> save.',
  'Settings (click your initials at the top right -> Settings) -> Staff -> on the staff member\'s row click the edit icon -> in Edit Staff Member turn on Sales Representative -> Save & Close.'),
 ('A third staff member has the Sales Rep toggle off.','A third staff member has Sales Representative turned off (same screen).'),
 ('Two tax rates exist: Settings -> Taxes. If needed add one, e.g. "ZZAUTOTEST 6%" at 6.00%.',
  'Two tax rates exist: Settings (click your initials at the top right -> Settings) -> Taxes. If needed click New Tax and add one, e.g. "ZZAUTOTEST 6%" at 6.00%.'),
 ('Set the tax: on the Financial Info card click Edit tax rate, pick an 8.25% rate and Save (if none exists, add "ZZAUTOTEST 8.25%" at 8.25% under Settings -> Taxes first).',
  'Set the tax: on the Financial Info card click the edit icon (tooltip "Edit tax rate"), pick an 8.25% rate in the Taxes list and click Save (if none exists, first add "ZZAUTOTEST 8.25%" at 8.25%: click your initials at the top right -> Settings -> Taxes -> New Tax).'),
 ('The sale\'s tax is GST 5% (the expected figures use it). If not, on the Financial Info card click Edit tax rate, pick GST 5% and Save.',
  'The sale\'s tax is GST at 5% (the expected figures use it; the Financial Info card names the tax, e.g. "GST"). If not, on the Financial Info card click the edit icon (tooltip "Edit tax rate"), pick "GST (5%)" in the Taxes list and click Save.'),
 ('Administration -> QuickBooks','Settings (click your initials at the top right -> Settings) -> left sidebar INTEGRATIONS -> QuickBooks'),
 ('Settings -> Parts -> Categories','Settings (click your initials at the top right -> Settings) -> left sidebar PARTS -> Categories'),
 ('You are signed in as a user with the Part sales -> Create & Edit permission, on the build under test.',
  'Sign in as an Owner/Admin user. That role holds every permission, including Part sales -> Create & Edit.'),
 ('You are signed in as a user with BOTH Part sales -> Create & Edit AND Invoicing & payments -> Create & Edit, on the build under test.',
  'Sign in as an Owner/Admin user. That role holds every permission, including BOTH Part sales -> Create & Edit AND Invoicing & payments -> Create & Edit.'),
 ('You are signed in with Part sales -> Create & Edit and Invoicing & payments -> Create & Edit, on the build under test.',
  'Sign in as an Owner/Admin user. That role holds every permission, including Part sales -> Create & Edit and Invoicing & payments -> Create & Edit.'),
 ('Seed it: open Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair"), and on the Parts tab click Add Part and set a Sell Price (e.g. $290.91).',
  'Seed it: top menu Parts -> Part Sales -> New Part Sale, pick the Customer (e.g. "4 Star Truck Repair") and click Save; in the Add Part dialog that opens enter a Description (e.g. "Brake Pads"), Quantity 1 and a Sell Price (e.g. $290.91), then click Save & Close.'),
 ('Seed it: Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair"), add a part (Add Part), and open the Finance tab.',
  'Seed it: top menu Parts -> Part Sales -> New Part Sale, pick the Customer (e.g. "4 Star Truck Repair") and click Save; in the Add Part dialog that opens enter a Description (e.g. "Brake Pads"), Quantity 1 and a Sell Price (e.g. $290.91), click Save & Close, then open the Finance tab. The sale reads Estimate (click Authorize above the parts list for Approved).'),
 ('Collect in Portal','Collect In Portal'),
 ('Submit Deposit','click Record Deposit'),
]
# per-case extra replacements (plain text)
PER={
 154591:[('tick Part sales -> Create & Edit, and untick Vendors -> Create & Edit, Work Order Parts -> Create and Work Orders -> Create & Edit;',
          'tick Part sales -> Create & Edit, and untick every box under Vendor and order management (vendors, purchase orders, deliveries and part returns), Work order lines -> Create & Edit and Work orders -> Create & Edit (this build has no permission named "Vendors" or "Work Order Parts"; these are the nearest);'),
         ('untick See Financial Data;','untick See Financial Data (under Cross-Cutting);'),
         ('A service work order for the same customer with a received core: Work Orders -> New Work Order, select the customer, add a line, add a part to it with Vendor = the test vendor and a Core Charge of $79.99, then Order and Receive the part.',
          'A service work order for the same customer with a received core: top menu Work Orders -> New Work Order, select the customer, add a line, add a part to it with Vendor = the test vendor and a Core Charge of $79.99, then Order and Receive the part (in the Receive parts dialog type a part number and Cost, then click Receive Parts).')],
 154603:[('An inventory core in stock whose own price differs from the quote: Parts -> Inventory -> New Inventory Part, Description "ZZAUTOTEST Core - Water Pump", Quantity in stock 1, Sell Price $85.00; save.',
          'An inventory core in stock whose own price differs from the quote: top menu Parts -> Inventory (left sidebar) -> New Inventory Part; in the dialog pick a Catalog Part (e.g. one named "ZZAUTOTEST Core - Water Pump"; create it first under Parts -> Catalog if it does not exist), Sell Price $85.00, Quantity 1, then click Save.'),
         ("On the new sale's Parts tab click Add Part for that inventory core, enter Core Charge $79.99 as the quoted figure, and save the row.",
          "On the new sale's Parts tab click Add Part; in the Add Part dialog set Source to Inventory, pick that inventory part in Part Number, enter Quantity 1 and Core Charge $79.99 as the quoted figure, then click Save & Close."),
         ('Add Part with a Core Charge of $0.00 and try to save; read the message shown.','Click Add Part, enter a Description, Quantity 1 and a Core Charge of $0.00, click Save & Close and read the message shown.')],
 154608:[('use Edit tax rate to pick the second tax rate (e.g. 6.00%) and save.','click the edit icon (tooltip "Edit tax rate"), pick the second tax rate (e.g. 6.00%) in the Taxes list and click Save.')],
 154611:[('open the menu -> Delete Part Sale','open the menu ( ... ) at the top of the parts list -> Delete Part Sale'),
         ('Work Orders -> New Work Order, select the customer, add a line, approve the line, then click Complete.','top menu Work Orders -> New Work Order, select the customer, add a line, approve the line, then click Complete.')],
 236960:[('Work Orders -> New Work Order, select the customer, add a line, approve the line, then click Complete.','top menu Work Orders -> New Work Order, select the customer, add a line, approve the line, then click Complete.')],
 154613:[('A test user WITHOUT Part sales -> Create & Edit; and another part sale plus a service work order whose entries must never appear here.',
          'A test user WITHOUT Part sales -> Create & Edit: click your initials at the top right -> Settings -> Roles & Permissions -> Create Custom Role -> in Choose a template pick e.g. "Parts Manager" -> Apply; untick Part sales -> Create & Edit (leave Part sales View ticked); Role Name "ZZAUTOTEST No part sale edit" -> Create. Then Settings -> Staff -> on a spare test user\'s row click the edit icon -> set Role to "ZZAUTOTEST No part sale edit" -> Save & Close; that user logs out and back in. Also create a second part sale the same way, and open any service work order (top menu Work Orders) and make one change on it, so both have entries that must never appear here.'),
         ('open a part sale and look for Audit Log, then try the log address directly.','open a part sale, open the menu ( ... ) at the top of the parts list and look for Audit Log. (On this build the Audit Log opens as a Part Sale Log panel on the sale\'s own page, with no separate web address to type, so reaching the log "directly" cannot be done by hand; that part is left to automation.)'),
         ('A customer to sell to exists;','Sign in as an Owner/Admin user to build the data below. A customer to sell to exists;')],
 154614:[('A part sale started before the release and a split made before the release (use existing pre-release records on the build); and a service work order with Split from / Split to entries.',
          'A part sale started before the release and a split made before the release: in top menu Parts -> Part Sales, open the oldest sales in the list (created before the Founder Mode release reached this build, e.g. dated Sep 30, 2026 or earlier; ask the QA lead for the release date if unsure). A service work order with Split from / Split to entries: top menu Work Orders, open a work order, tick one of its lines and use Split on it.'),
         ("Open the pre-release part sale's Audit Log and look for a Created entry.","Open the pre-release part sale, open the menu ( ... ) at the top of the parts list -> Audit Log, and in the Part Sale Log look for a Created entry.")],
 154615:[('The shop has at least one active sales representative (Settings -> Staff, mark a staff member as a Sales Representative).',
          'The shop has at least one active sales representative: click your initials at the top right -> Settings -> Staff -> on a staff member\'s row click the edit icon -> in Edit Staff Member turn on Sales Representative -> Save & Close.'),
         ('Find the Sales Representative field and open its picker.','Find the Sales Representative field (it reads Unassigned when empty) and click it to open its picker.')],
 154616:[('At least two active sales representatives exist; the sale will be taken to invoice.',
          'At least two active sales representatives exist: click your initials at the top right -> Settings -> Staff -> on a staff member\'s row click the edit icon -> turn on Sales Representative -> Save & Close; repeat for a second person. The sale will be taken to invoice.'),
         ('Open the Audit Log and read the rep-change entry.','Open the menu ( ... ) at the top of the parts list -> Audit Log, and in the Part Sale Log read the rep-change entry.'),
         ('Receive the parts, Create Invoice, and confirm the rep is captured on the invoice.','Receive the parts (Authorize, then Order and Receive on the row; in the Receive parts dialog type a part number and Cost, then click Receive Parts), click Create Invoice on the Finance tab, and confirm the rep is captured on the invoice.'),
         ('Open the Sales By Representative report and find the sale.','Open the Sales By Representative report (top menu Reports) and find the sale.')],
 154619:[('New Part Sale + add several parts; leave one Quoted (Order), one ordered (Receive), one in stock (Pick), and one part carrying a received core (Return Core).',
          'top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save), then Add Part four times (Description, Quantity 1, Vendor = a test vendor; give one a Core Charge, e.g. $79.99; for the in-stock one set Source to Inventory and pick an inventory part). Click Authorize. Leave one at Auth To Order (its Actions show Order), Order one (Receive), leave the inventory one In Stock (Pick), and Order + Receive the one with the core (its core row shows Return Core).')],
 154620:[('A service work order parts grid for comparison; and a part sale row that has no primary action (e.g. a fully-actioned row).',
          'A service work order parts grid for comparison: top menu Work Orders -> open any work order that has parts -> its parts list. A part sale row that has no primary action: on a part sale, a part row that has been received (its Actions cell shows only the return icon and the menu ( ... )).')],
 154624:[('Add Part "Water Pump" (Vendor = the test vendor, Sell Price $517.55, Core Charge $79.99) and Add Part "Brake Pads" (Sell Price $290.91). Then on the Finance tab click Add Deposit; in Create Deposit enter Deposit Amount $50.00 (e.g.) and a Payment Method (e.g. "Cash"), then click Record Deposit.',
          'in the Add Part dialog enter "Water Pump" (Quantity 1, Vendor = the test vendor, Sell Price $517.55, Core Charge $79.99) and click Save & Add Part, then "Brake Pads" (Quantity 1, Sell Price $290.91) and click Save & Close. Then on the Finance tab click Add Deposit; in Create Deposit enter Deposit Amount $50.00 (e.g.) and a Payment Method (e.g. "Cash"), then click Record Deposit.'),
         ('Sale A: Parts -> Part Sales -> New Part Sale, select the customer;','Sale A: top menu Parts -> Part Sales -> New Part Sale, pick the Customer and click Save;'),
         ('Sale C: a new part sale with one part ("Brake Pads", $290.91); Order and Receive it, then click Create Invoice.',
          'Sale C: a new part sale with one part ("Brake Pads", Quantity 1, $290.91, Vendor = the test vendor); click Authorize, then Order and Receive it (in the Receive parts dialog type a part number and Cost, then click Receive Parts), then on the Finance tab click Create Invoice.'),
         ('In New Customer Payment record a payment for the full balance (Payment Method e.g. "Cash") and save.','In the New Customer Payment dialog pick a Payment Method (e.g. "Cash") and click Make Payment for the full balance.'+CUSTOMER_NOTE),
         ('select the line with the core and use the bulk menu -> Split Part Sale; read where the deposit ends up.','tick the line with the core and use the menu ( ... ) above the parts list -> Split Part Sale (the new sale opens straight away); read where the deposit ends up.'),
         ('select every line and use Split Part Sale;','tick every line and use the menu ( ... ) above the parts list -> Split Part Sale;'),
         ('On the original Sale B, reverse its held deposit,','On the original Sale B, reverse its held deposit (customer -> Deposits tab),')],
 154625:[('Add two parts on the Parts tab (e.g. "Brake Pads" $290.91 and "Oil Filter" $12.50, Vendor = the test vendor). The sale reads Estimate.',
          'Add two parts on the Parts tab: in the Add Part dialog enter "Brake Pads" (Quantity 1, Sell Price $290.91, Vendor = the test vendor) and click Save & Add Part, then "Oil Filter" (Quantity 1, Sell Price $12.50) and click Save & Close. The sale reads Estimate.'),
         ('For the Declined step you will decline each line from its row menu; a sale reads Declined only once every line is declined.',
          'For the Declined step: on this build there is no Decline in a line\'s menu; the red Decline button above the parts list declines the sale at once (no confirmation) and it reads Declined. For the Approved and Complete checks: Authorize (green button) makes it Approved; ordering and receiving every part makes it Complete.'),
         ('compare the number in the Memo with the sale number shown on the part sale (e.g. P4-413).','compare the number in the Memo with the sale number shown on the part sale (e.g. P9667-370).'),
         ('Then decline every line (each row\'s menu -> Decline) so the sale reads Declined;','Then click the red Decline button above the parts list so the sale reads Declined;')],
 154626:[("Check the sale's payment history straight away.","Check the sale's payment history straight away: the Payments line on the Finance-tab document, and top menu Customers -> the customer -> Deposits tab."),
         ('Receive the parts, Create Invoice, and read how the deposit is applied.','Receive the parts (Authorize, then Order and Receive on the row; in the Receive parts dialog type a part number and Cost, then click Receive Parts), click Create Invoice, and read how the deposit is applied.')],
 154627:[('Seed: New Part Sale + add a part with a Core Charge; receive it; return one core, leave another charged.',
          'Seed: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog add two parts, each with Quantity 1, a Vendor and a Core Charge (e.g. $79.99) — click Save & Add Part after the first, Save & Close after the second. Click Authorize, Order both, Receive both (in the Receive parts dialog type a part number and Cost for each, then Receive Parts). Click Return Core on one core row; leave the other core charged.')],
 154628:[],
 154630:[('Record a deposit on the sale so it holds one.','Record a deposit on the sale so it holds one: Finance tab -> Add Deposit -> Deposit Amount (e.g. $50.00), Payment Method (e.g. "Cash") -> Record Deposit.'),
         ("With the deposit held, try to change the sale's customer.","With the deposit held, try to change the sale's customer (the customer card on the left)."),
         ('Try to Delete Part Sale.','Try the menu ( ... ) at the top of the parts list -> Delete Part Sale.'),
         ('Remove the deposit and retry both.','Remove the deposit (top menu Customers -> the customer -> Deposits tab) and retry both.')],
 154631:[('A part sale owned by one location (e.g. Location A) while the user has a different location (Location B) selected in the location switcher. Seed the sale under Location A, then switch the user to Location B.',
          'Two locations exist (click your initials at the top right -> Settings -> Locations). A part sale owned by one location (e.g. Location A) while the user has a different location (Location B) selected: create the sale while Location A is selected, then click your initials at the top right -> Change Location -> pick Location B.')],
 154632:[('Seed it: create a part sale as above, receive its parts so it reaches Complete, then click Create Invoice.',
          'Seed it: create a part sale as above, click Authorize, then Order and Receive its part (in the Receive parts dialog type a part number and Cost, then click Receive Parts) so it reaches Complete, then on the Finance tab click Create Invoice and Make Payment (or close the dialog after paying part of it).')],
 154633:[('Test users: one WITHOUT Part sales -> Create & Edit; one WITHOUT Invoicing & payments -> Create & Edit (set under Settings -> Staff / Roles).',
          'Test users: click your initials at the top right -> Settings -> Roles & Permissions -> Create Custom Role -> pick e.g. "Parts Manager" -> Apply; make role "ZZAUTOTEST No part sale edit" (untick Part sales -> Create & Edit) and role "ZZAUTOTEST No invoicing edit" (untick Invoicing & payments -> Create & Edit), each -> Create. Then Settings -> Staff -> on two spare test users\' rows click the edit icon -> set Role -> Save & Close; each logs out and back in. Sign in as an Owner/Admin user to build the sale.')],
 154634:[('Use either: (1) on this test shop, ShopPay turned off; or (2)','Use either: (1) on this test shop, ShopPay turned off (on this QA build no ShopPay switch was found under Settings, so use option 2); or (2)'),
         ('untick the Customer Portal permission;','untick Customer portal (under Page Access);')],
 154635:[('Know whether this build\'s Customer Portal takes part sale deposits: the release notes for this build say so, or ask the QA lead. The expected results cover both answers.',
          'Know whether this build\'s Customer Portal takes part sale deposits: the release notes for this build say so, or ask the QA lead. The expected results cover both answers. Open the deposit dialog: Finance tab -> Add Deposit (the dialog is titled Create Deposit).')],
 154636:[('Seed: New Part Sale + add a part (e.g. total $543.43); Finance tab -> Add Deposit -> Record Deposit for more than the total (e.g. $600.00). Optionally, reduce the total afterwards by returning a core.',
          'Seed: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog enter Description "Water Pump", Quantity 1, Vendor = a test vendor, Sell Price $517.55 -> Save & Close (with GST 5% the total is $543.43); Finance tab -> Add Deposit -> Deposit Amount $600.00, Payment Method "Cash" -> Record Deposit. Then click Authorize, Order and Receive the part (in the Receive parts dialog type a part number and Cost, then Receive Parts). Optionally add a Core Charge and Return Core to drop the total.'),
         ('Create Invoice and read the invoice state','On the Finance tab click Create Invoice and read the invoice state')],
 154641:[(' Numeric-accuracy case (Rule 116).',' Numeric-accuracy case.'),
         ('Seed: New Part Sale + Add Part so the sale totals about $543.43; Finance tab -> Add Deposit -> Record Deposit $600.00. Compute 600.00 - 543.43 by hand.',
          'Seed: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog enter Description "Water Pump", Quantity 1, Vendor = a test vendor, Sell Price $517.55 -> Save & Close (with GST 5% the total is $543.43); Finance tab -> Add Deposit -> Deposit Amount $600.00, Payment Method "Cash" -> Record Deposit. Click Authorize, Order and Receive the part (in the Receive parts dialog type a part number and Cost, then Receive Parts). Compute 600.00 - 543.43 by hand.'),
         ('Create Invoice.','on the Finance tab click Create Invoice.')],
 154594:[('A part sale started BEFORE the release with a core (if none exists on the build, use an existing pre-release sale that carries a core), and a NEW part sale seeded now with a core (Add Part + Core Charge, left Quoted).',
          'A part sale started BEFORE the release with a core: in top menu Parts -> Part Sales open the oldest sales (created before the Founder Mode release reached this build, e.g. dated Sep 30, 2026 or earlier; ask the QA lead for the release date if unsure) and pick one whose parts list shows a "Core for ..." row. A NEW part sale seeded now with a core: New Part Sale (pick the customer, Save), then in the Add Part dialog Description "Water Pump", Quantity 1, Vendor = a test vendor, Sell Price $517.55, Core Charge $79.99 -> Save & Close; do not Authorize or Order it.'),
         ('Also have a sale you can split, and two part sales you can move a line between.','Also have a sale you can split and two part sales you can move a line between (any two new sales built the same way for the same customer).'),
         ('Split the new sale and check','Tick the part line on the new sale and use the menu ( ... ) above the parts list -> Split Part Sale (the new sale opens straight away), and check'),
         ('Move the line to another part sale (bulk menu -> Move Part)','Move the line to another part sale (tick it, menu ( ... ) above the parts list -> Move Part -> pick the Part Sale -> Move)')],
 154595:[('On the part sale, open the bulk menu and the row menu on the part line and look for a way to move the part onto a service work order.',
          'On the part sale, tick the part line and open the menu ( ... ) above the parts list -> Move Part, and the part row\'s own menu ( ... ), and look for a way to move the part onto a service work order.')],
 154596:[],
 154597:[('On the first invoiced sale (no payment), reverse the invoice','On the first invoiced sale (no payment), reverse the invoice'),
         ("Before invoicing, take a deposit for its full total: read the Total on the Finance tab (e.g. $627.42), then Add Deposit for that amount and Record Deposit.",
          "Before invoicing, take a deposit for its full total: read the Total on the Finance tab (e.g. $627.42), then click Add Deposit, enter that Deposit Amount and a Payment Method (e.g. \"Cash\") and click Record Deposit."),
         ('Click Create Invoice on the second sale.','On the Finance tab click Create Invoice on the second sale.'),
         ("In that sale's payment history, reverse the payment that applied the deposit, then read the deposit's status on the sale.",
          "Reverse the payment that applied the deposit (top menu Customers -> the customer -> Payments tab -> that payment's trash icon -> Reverse), then read the deposit's status on the sale (customer -> Deposits tab)."),
         ('A second part sale built the same way (new sale, core line, Order, Receive) but NOT returned.','A second part sale built the same way (new sale, core line, Authorize, Order, Receive) but NOT returned.')],
 154598:[('Download or email the PDF, run a batch print, and open the Customer Portal copy and a reprint; check each shows the same rendering.',
          'Download (download icon) or email (envelope icon) the PDF on the Finance tab, run a batch print, and open the Customer Portal copy (click your initials at the top right -> Customer Portal) and a reprint (print icon); check each shows the same rendering.')],
 154600:[('↳ Open Part Sales from the main menu and start a New Part Sale; select the customer (e.g. "4 Star Truck Repair").','↳ Top menu Parts -> Part Sales -> New Part Sale; pick the Customer (e.g. "4 Star Truck Repair") and click Save.'),
         ('↳ On the Parts tab, click Add Part; set the Description (e.g. "Water Pump") and the Sell Price to a test amount (e.g. $517.55).','↳ In the Add Part dialog (it opens by itself on an empty sale) enter Description (e.g. "Water Pump"), Quantity 1, Vendor = a test vendor and Sell Price (e.g. $517.55).'),
         ('↳ In the Core column of that row, enter a Core Charge greater than 0 (e.g. $79.99), then save the row.','↳ In the same dialog enter a Core Charge greater than 0 (e.g. $79.99), then click Save & Close; a "Core for ..." row appears beneath the part.'),
         ('↳ Order the part, then Receive it (special-order) or Pick it (inventory), so Return Core becomes available.','↳ Click Authorize, Order the part, then Receive it (in the Receive parts dialog type a part number and Cost, then Receive Parts) so Return Core becomes available on the core row.'),
         ('Add a per-item fee or discount to the core row (Fees & Discounts on the core row) while it is charged, e.g. a flat $5 fee.','Add a per-item fee or discount while the core is charged, e.g. a flat $5 fee: open the row menu ( ... ) -> Add Part Fee / Discount (if the core row has no menu while charged, record that and use its part row\'s menu).'),
         ('Cancel Return (row menu -> Cancel Return -> Put Back)','Cancel Return (core row menu ( ... ) -> Cancel Return -> Put Back in the Confirmation dialog)')],
 154601:[('In that row\'s Actions column click Order. The row now shows Awaiting. Do not receive it yet.','x')],  # handled by shared + check
 154589:[("On the grid, open the returned core row's menu ( ... ) and choose Cancel Return.","On the grid, open the returned core row's menu ( ... ) and choose Cancel Return (a Confirmation dialog opens).")],
 154586:[('Click Create Invoice and note','On the Finance tab click Create Invoice and note')],
 236959:[('For comparison, a work order for the same customer with a taxable $100.00 part: Work Orders -> New Work Order, select the customer, add a line with a part at Sell Price $100.00, tax 8.25%.',
          'For comparison, a work order for the same customer with a taxable $100.00 part: top menu Work Orders -> New Work Order, select the customer, add a line with a part at Sell Price $100.00, tax 8.25%.'),
         ('Open Customers, open the customer, and on the customer overview open the Part Sales tab.','Open top menu Customers, open the customer, and on the customer page open the Part Sales tab (it shows a count, e.g. "Part Sales (4)").')],
 236961:[('read the deposit in the payment history.','read the deposit in the payment history (the Payments line on the Finance-tab document, and top menu Customers -> the customer -> Deposits tab).'),
         ('For the comparison step, a service work order for the same customer: Work Orders -> New Work Order, select the customer, add a line.','For the comparison step, a service work order for the same customer: top menu Work Orders -> New Work Order, select the customer, add a line.')],
 154640:[],
}
QB_CASES={154596,154629,154640}
PORTAL_CASES={154598,154628,236961}
NA_CASES={154595}
OUTCOMES={154601:'<p><strong>What you should see today</strong> (build v26.40.7-7ffda69, 10/5/2026): in the Receive parts dialog the core row ("Core for Water Pump") shows its part number, Cost, Qty Ordered and Qty Received but no "Charged" tag. (1) If you see exactly that, mark the case Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. (3) If the "Charged" tag and its hover text appear as described above, the change has shipped: mark it Passed and tell the QA lead.</p><p></p>'}
def enc_pairs(pairs): return [(E(a),E(b)) for a,b in pairs]
RE=enc_pairs(R)
out={}; report=[]
for k,c in d.items():
    cid=int(k)
    if cid in HELD: continue
    pre=c['custom_preconds'] or ''; stp=c['custom_steps'] or ''; exp=c['custom_expected'] or ''
    np,ns=pre,stp
    hits=[]
    for a,b in enc_pairs(PER.get(cid,[])):
        if a=='x': continue
        if a in np: np=np.replace(a,b); hits.append('per')
        elif a in ns: ns=ns.replace(a,b); hits.append('per')
        else: report.append(f'C{cid} PER-MISS: {html.unescape(a)[:80]}')
    for a,b in RE:
        if a in np: np=np.replace(a,b); hits.append(html.unescape(a)[:30])
        if a in ns: ns=ns.replace(a,b); hits.append(html.unescape(a)[:30])
    # expected: stamp + marker only
    ne=exp
    ne=re.sub(r'<p>Updated to the 5 October 2026 specification; not yet re-checked against a build\.</p>',STAMP,ne)
    ne=re.sub(r'<p>Last checked against build [^<]+ on [\d/]+\.</p>',STAMP,ne)
    ne=ne.replace('Source-verified 5 October 2026; not yet build-verified.','Source-verified 5 October 2026.')
    if STAMP not in ne:
        ne=re.sub(r'(<p>AUTOMATION:)',STAMP+r'\1',ne,count=1); report.append(f'C{cid} stamp inserted')
    cur=re.findall(r'<p>AUTOMATION:[^<]*</p>',ne)
    if len(cur)!=1: report.append(f'C{cid} MARKER COUNT {len(cur)}')
    qb_dep = cid in QB_CASES or 'QuickBooks Online is connected' in html.unescape(pre)
    portal_now = 'customer portal only exists on staging' in (cur[0] if cur else '')
    if cid in NA_CASES: newm=M_NA
    elif portal_now or cid in PORTAL_CASES: newm=M_PORTAL
    elif qb_dep: newm=M_QB
    else: newm=M_READY
    if cur: ne=ne.replace(cur[0],newm)
    if cid in OUTCOMES: ne=ne.replace('<p><strong>Source — where this behaviour comes from</strong>',OUTCOMES[cid]+'<p><strong>Source — where this behaviour comes from</strong>',1)
    # guard: tester-facing Expected head unchanged
    def head(x): return re.split(r'<p><strong>(What you should see today|Source)',x)[0]
    if head(ne)!=head(exp): report.append(f'C{cid} EXPECTED HEAD CHANGED!')
    if (np,ns,ne)!=(pre,stp,exp):
        out[k]={'custom_preconds':np,'custom_steps':ns,'custom_expected':ne,'_hits':len(hits),'_marker':newm[3:-4],'_by':c['created_by'],'_atm':c['custom_atmstatus']}
json.dump(out,open('/tmp/cln/ps-new.json','w'))
import collections
print('changed',len(out)); print(collections.Counter(v['_marker'] for v in out.values()))
for r in report: print(r)
# leftover old phrases
LEFT=['and confirm. The row now shows','keep the full quantity and confirm','Save the row','the Returned badge','record a payment for the full balance','payment history and reverse it','Administration -&gt;','Create custom role','Edit Staff Member -&gt; Role','Quoted)','signed in as a user with','Settings -&gt; Taxes. If','Settings -&gt; Parts -&gt;','Edit tax rate, pick']
for k,v in out.items():
    t=v['custom_preconds']+v['custom_steps']
    for L in LEFT:
        if L in t: print(f'C{k} LEFTOVER: {L}')
