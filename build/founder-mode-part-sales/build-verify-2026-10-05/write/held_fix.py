import json,html,re
E=lambda s: html.escape(s,quote=False)
n=json.load(open('/tmp/cln/ps-held-proposed.json'))
SALE_MENU='the menu ( ... ) just left of Add Part'
BULK_MENU='the menu ( ... ) just right of Add Part'
RECV='in the Receive parts dialog tick the rows, type a part number in each red Part number box (e.g. "ZZ-WP-1", then press Enter), enter the part row\'s Cost (e.g. $400.00) and click Receive Parts'
STD=[('↳ Open Part Sales from the main menu and start a New Part Sale; select the customer (e.g. "4 Star Truck Repair").','↳ Top menu Parts -> Part Sales -> New Part Sale; pick the Customer (e.g. "4 Star Truck Repair") and click Save.'),
 ('↳ On the Parts tab, click Add Part; set the Description (e.g. "Water Pump") and the Sell Price to a test amount (e.g. $517.55).','↳ In the Add Part dialog (it opens by itself on an empty sale) enter Description (e.g. "Water Pump"), Quantity 1, Vendor = a test vendor (e.g. "ZZAUTOTEST Parts Supply"; if none exists: top menu Parts -> Vendors -> New Vendor, Name and Taxes, Save & Close) and Sell Price (e.g. $517.55).'),
 ('↳ In the Core column of that row, enter a Core Charge greater than 0 (e.g. $79.99), then save the row.','↳ In the same dialog enter a Core Charge greater than 0 (e.g. $79.99) and click Save & Close; a "Core for ..." row appears beneath the part.'),
 ('↳ Order the part, then Receive it (special-order) or Pick it (inventory), so Return Core becomes available.','↳ Click Authorize (green button above the parts list), then Order on the part row, then Receive: '+RECV+'. The core row now offers Return Core.'),
 ('↳ Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair").','↳ Top menu Parts -> Part Sales -> New Part Sale; pick the Customer (e.g. "4 Star Truck Repair") and click Save.'),
 ('↳ Parts tab -> Add Part; Description "Water Pump", Sell Price $517.55; in the Core column enter Core Charge $79.99; save.','↳ In the Add Part dialog: Description "Water Pump", Quantity 1, Vendor = a test vendor, Sell Price $517.55, Core Charge $79.99 -> Save & Close. The sale\'s tax must be GST at 5%: Financial Info card -> edit icon (tooltip "Edit tax rate") -> "GST (5%)" -> Save.'),
 ('↳ Order and Receive the part so the core is charged.','↳ Click Authorize, then Order the part and Receive it ('+RECV+') so the core is charged.'),
 (' (Rule 116)',''),
 ('Open Parts -> Returns','Open top menu Parts -> Returns (left sidebar)'),('open Parts -> Returns','open top menu Parts -> Returns (left sidebar)'),
 ('Open the part sale menu (top right ... ) -> Audit Log','Open '+SALE_MENU+' -> Audit Log'),
 ('Open the part sale menu ( ... ) -> Audit Log','Open '+SALE_MENU+' -> Audit Log'),
]
PER={
 154587:[("Read the core row's Status badge afterwards.","Read the core row's Status column afterwards.")],
 154588:[('Return to the grid, open the core row menu and choose Cancel Return -> Put Back','Return to the grid, open the core row menu ( ... ) and choose Cancel Return -> Put Back (in the Confirmation dialog)')],
 154590:[('↳ Sale A: New Part Sale + Add Part with a Core Charge (e.g. $79.99), left at status Quoted (not received).','↳ Sale A: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog enter a Description, Quantity 1, a Vendor and a Core Charge (e.g. $79.99) -> Save & Close. Do not Authorize or Order it (its Status reads Requested).'),
         ('↳ Sale B: the same, but Order then Receive/Pick the part so the core is received and left un-returned.','↳ Sale B: the same, then click Authorize, Order the part and Receive it ('+RECV+'); leave the core un-returned.'),
         ('↳ Sale C: a sale with a received core that you then Create Invoice on (invoiced/paid).','↳ Sale C: built like Sale B, then on the Finance tab click Create Invoice and Make Payment (invoiced and paid).')],
 154592:[('(Inventory -> find the core part)','(top menu Parts -> Inventory (left sidebar) -> search for the core part\'s part number)'),
         ("Open the inventory part's own history, and the Part Sale Log, and see where the return is recorded.","Open the inventory part's own history, and the Part Sale Log ("+SALE_MENU+" -> Audit Log), and see where the return is recorded.")],
 154599:[('↳ Leave the part at status Quoted - do not Receive or Pick it.','↳ Leave the part unordered: do not click Authorize, Order, Receive or Pick (on this build its Status reads Requested).'),
         ('Leave the core on the sale un-received (Quoted), so it is a requested-parts core.','Leave the core on the sale un-received, so it is a requested-parts core.'),
         ('run the sales report;','run the sales report (top menu Reports, e.g. Sales By Customer);')],
 154602:[('Return the core so a Core credit row and a return exist.','Return the core (core row -> Return Core) so a Core credit row and a return exist.'),
         ('On the Part Sales list, read the returns count for this sale','On the Part Sales list (top menu Parts -> Part Sales), read the Returns column for this sale')],
 154604:[('↳ Seed a received core (New Part Sale + Add Part + Core Charge, then Order + Receive) and open it in two sessions.','↳ Seed a received core (top menu Parts -> Part Sales -> New Part Sale; Add Part with Quantity 1, a Vendor and a Core Charge; Authorize, Order, Receive - '+RECV+') and open that sale in two browser sessions.'),
         ('↳ Seed a second sale whose core part has the Vendor field left blank, received.','↳ Seed a second sale whose core part has the Vendor field left blank, received. (On this build the Receive parts dialog shows a "Vendor missing" card for a part with no vendor; receive it as far as the screen allows and record what it asks for.)')],
 154605:[('Return the core so the sale Total drops below the deposit already taken, then Create Invoice and read the invoice outcome.','Return the core (core row -> Return Core) so the sale Total drops below the deposit already taken, then on the Finance tab click Create Invoice and read the invoice outcome.')],
 154606:[('find and click the Edit tax rate control (the pencil).','find and click the edit icon (its tooltip reads "Edit tax rate").'),
         ('Read the picker that opens and the rates it lists.','Read the Taxes list that opens and the rates it lists.')],
 154607:[('Also have an already-invoiced part sale for comparison (seed one and Create Invoice on it).','Also have an already-invoiced part sale for comparison: seed one the same way, click Authorize, then Order and Receive its part ('+RECV+'), then on the Finance tab click Create Invoice.'),
         ('Change the tax rate on the open sale (Financial Info -> Edit tax rate -> Save).','Change the tax rate on the open sale (Financial Info card -> edit icon, tooltip "Edit tax rate" -> pick a rate in Taxes -> Save).'),
         ('check the Sales Tax report for the past period.','check the Sales Tax Collected report (top menu Reports) for the past period.')],
 154609:[('Open the part sale and its top menu ( ... , top right).','Open the part sale (top menu Parts -> Part Sales -> click the sale) and '+SALE_MENU+'.')],
 154610:[('Open the part sale menu ( ... ) and read the items top to bottom.','Open the part sale (top menu Parts -> Part Sales -> click the sale), open '+SALE_MENU+' and read the items top to bottom.'),
         ("compare it to a work order's menu.","compare it to a work order's menu (top menu Work Orders -> click a work order number -> its menu ( ... )).")],
 154612:[('↳ Create a sale from Part Sales -> New Part Sale.','↳ Create a sale from top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save; add a part in the Add Part dialog).'),
         ('↳ On a sale with 2+ lines, select a line and use the bulk menu -> Split Part Sale to produce a new sale.','↳ On a sale with 2+ lines (Add Part: Save & Add Part after the first, Save & Close after the second), tick a line and use '+BULK_MENU+' -> Split Part Sale; the new sale opens straight away.'),
         ('Open the Audit Log of the sale started from the Part Sales screen and read the first entry.','Open the Audit Log of the sale started from the Part Sales screen ('+SALE_MENU+' -> Audit Log) and read the first entry.')],
 154617:[('↳ Customer A with an assigned sales representative (Customers -> edit -> set Sales Representative).','↳ Customer A with an assigned sales representative: top menu Customers -> open the customer -> the edit icon next to its name -> set Sales Representative -> save. (Only staff marked as Sales Representative can be picked: click your initials at the top right -> Settings -> Staff -> edit icon -> turn on Sales Representative -> Save & Close.)'),
         ("A part sale for each, with the sale's own Sales Representative left unset.","A part sale for each (top menu Parts -> Part Sales -> New Part Sale, pick the customer, Save; Add Part with Quantity 1, a Vendor and a Sell Price), with the sale's own Sales Representative left at Unassigned."),
         ("On Customer A's sale (rep unset), invoice it and read the attribution.","On Customer A's sale (rep unset), click Authorize, Order and Receive the part ("+RECV+"), then on the Finance tab click Create Invoice, and read the attribution.")],
 154621:[('Add at least two parts so lines can be selected.','Add at least two parts so lines can be selected (in the Add Part dialog click Save & Add Part after the first, Save & Close after the second).'),
         ('On the Parts grid, select one or more lines to reveal the bulk menu, and read its items.','On the Parts grid, tick one or more lines, then open '+BULK_MENU+' and read its items.'),
         ('Open a row menu and read the Set Status entry.','Open a row menu ( ... ) and read the Set Status entry. (On this build a row menu shows only Add Part Fee / Discount; Set Status is in '+SALE_MENU+' - read it there too and record where you found it.)')],
 154623:[('A service work order for comparison;','A service work order for comparison (top menu Work Orders -> click any work order number);')],
 154639:[('Seed: New Part Sale + Add Part with Sell Price $290.91. Compute 290.91 x 1.05 by hand.','Seed: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog enter Description "Brake Pads", Quantity 1, Sell Price $290.91 -> Save & Close. If the sale already uses GST at 5%, first switch it to another rate. Compute 290.91 x 1.05 by hand.'),
         ('change the tax rate to GST 5% and click Save; read the new Total.','click the edit icon (tooltip "Edit tax rate"), pick "GST (5%)" in Taxes and click Save; read the new Total.')],
 154642:[('A part being added to a part sale, ready to enter a Core Charge in the Core column.','A part sale open on its Parts tab: top menu Parts -> Part Sales -> New Part Sale, pick the customer and click Save (the Add Part dialog opens by itself).'),
         ('On a new part row, enter a Core Charge of $0.00 and try to save; read the server response.','In the Add Part dialog enter a Description, Quantity 1 and a Core Charge of $0.00, click Save & Close and read the message shown.')],
 154878:[('Owner/Admin, fresh login; a part sale created on this build holding a $517.55 part with a $79.99 core, GST 5%, no other lines.',
          'Sign in as an Owner/Admin user (sign out and back in first). A part sale created on this build holding a $517.55 part with a $79.99 core, GST 5%, no other lines: top menu Parts -> Part Sales -> New Part Sale (pick the customer, Save); in the Add Part dialog Description "Water Pump", Quantity 1, Vendor = a test vendor, Sell Price $517.55, Core Charge $79.99 -> Save & Close; tax GST at 5% (Financial Info card -> edit icon, tooltip "Edit tax rate" -> "GST (5%)" -> Save).'),
         ('State A — core Quoted, unreceived:','State A — core not yet ordered (Status reads Requested; do not Authorize yet):'),
         ('State B — part received:','State B — part received (click Authorize, Order, then Receive: '+RECV+'):'),
         ('State C — core returned:','State C — core returned (core row -> Return Core):'),
         ('State D — return cancelled:','State D — return cancelled (core row menu ( ... ) -> Cancel Return -> Put Back):')],
}
miss=[]
for k,v in n.items():
    cid=int(k)
    for a,b in [(E(x),E(y)) for x,y in STD+PER.get(cid,[])]:
        hit=False
        for f in ('custom_preconds','custom_steps'):
            if a in v[f]: v[f]=v[f].replace(a,b); hit=True
        if not hit and (a,b) in [(E(x),E(y)) for x,y in PER.get(cid,[])]: miss.append((cid,html.unescape(a)[:70]))
json.dump(n,open('/tmp/cln/ps-held-final.json','w'))
print('misses:',miss)
for k,v in n.items():
    t=v['custom_preconds']+v['custom_steps']
    for L in ('Quoted','Order the part, then Receive it (special','in the Core column','save the row','bulk menu','Rule 116','server response','(the pencil)'):
        if L in t: print('LEFT',k,L)
