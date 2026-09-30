import importlib.util
spec=importlib.util.spec_from_file_location("ps_lib","build/founder-mode/part-sales/ps_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ROLE='You are signed in as a user with the Part Sales -> Create & Edit permission, on the build under test. These are numeric/money-accuracy cases (Rule 116): seed the exact inputs, read the produced figure back and compare it to the cent - never eyeball.'
CUST='A customer to sell to exists; if none does, create one via Customers -> New Customer (e.g. "4 Star Truck Repair").'
def src(story,jira): return (f'Epic SV-9667; story {jira}; Part Sales Update v1 PRD (Confluence 867434569), {story}; '
    f'design boards Document_*/Tax_* (exact figures shown on the canvas); read 30 Sep 2026.')
S1=src("Story 1","SV-10262"); S3=src("Story 3","SV-10264"); S8=src("Story 8","SV-10269")
SEED_CORE=['A post-release part sale with a $517.55 part carrying a $79.99 core, core charged. Seed it:',
   '↳ Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair").',
   '↳ Parts tab -> Add Part; Description "Water Pump", Sell Price $517.55; in the Core column enter Core Charge $79.99; save.',
   '↳ Order and Receive the part so the core is charged.']

CASES=[
{"anchors":["S1-R13"],"title":"Charged core: document totals to the exact cent",
 "pre":[ROLE,CUST]+SEED_CORE+['Compute Parts = 517.55 + 79.99, GST = 5% of Parts, and Total by hand before reading the build.'],
 "steps":['Open the Finance tab document and read the part row, the Core charge child row, and the Summary.',
   'Compare each figure to your hand calculation.'],
 "results":[
   'The part reads $517.55 and its "Core charge" child reads $79.99.',
   'The Summary reads Parts $597.54, GST (5%) $29.88 and Total $627.42 (517.55 + 79.99 = 597.54; 597.54 x 5% = 29.877 -> 29.88; total 627.42) - the core counts toward the parts total, tax base and sale total.'],
 "source":S1,
 "quotes":[("S1-R13","A $517.55 part carrying a $79.99 core reads $517.55 then $79.99, and totals $597.54 of parts, $29.88 of GST at 5 percent and $627.42")]},
{"anchors":["S1-R11","S1-R6"],"title":"Returned core: credit is exact and totals fall back",
 "pre":[ROLE,CUST]+SEED_CORE+['Return the core (core row Actions -> Return Core) so a Core credit row is present. Compute the post-return totals by hand.'],
 "steps":['Open the Finance tab document and read the Core charge child, the Core credit child and the Summary.',
   'Confirm the GST fell by exactly the core\'s own tax (compare against the charged-core figures).'],
 "results":[
   'The "Core credit" child prints -$79.99; the Summary reads Parts $517.55, GST (5%) $25.88 and Total $543.43.',
   'The GST dropped from $29.88 to $25.88 - a fall of $4.00, which is 5% of $79.99 (rounded) - proving the credit carries its own tax, so the sale total and tax base return exactly to where they were before the core was added.'],
 "source":S1,
 "quotes":[("S1-R11","a $79.99 core returned reads -$79.99 ... reads $517.55, then the $79.99, then the -$79.99, and totals $517.55 of parts, $25.88 of GST at 5 percent and $543.43"),
           ("S1-R6","The credit equals the core charge exactly, including its tax, so returning a core leaves the sale total and the tax base where they started")]},
{"anchors":["S3-R3"],"title":"Tax change recalculates to the exact cent; card matches document",
 "pre":[ROLE,CUST,'A part sale whose Financial Info card shows Parts $290.91. Seed: New Part Sale + Add Part with Sell Price $290.91. Compute 290.91 x 1.05 by hand.'],
 "steps":['On the Financial Info card, change the tax rate to GST 5% and click Save; read the new Total.',
   'Open the same sale\'s Finance-tab document and read its Total.',
   'Compare both to your hand calculation.'],
 "results":[
   'The card Total recalculates immediately to $305.46 (290.91 x 1.05 = 305.4555 -> 305.46).',
   'The Total on the Financial Info card equals the Total on the customer document for the same sale (parity across the two surfaces).'],
 "source":S3,
 "quotes":[("S3-R3","Saving recalculates the sale total immediately")]},
{"anchors":["S1-R17"],"title":"Core credit reaches QuickBooks as the exact negative amount",
 "pre":[ROLE,CUST]+SEED_CORE+['QuickBooks connected with the one-time consent given. Return the core, then Create Invoice and let it sync.'],
 "steps":['In QuickBooks, open the synced invoice and read the Core credit line\'s unit price, amount, product/service, class and tax.',
   'Compare the QuickBooks amount to the document\'s -$79.99 Core credit row.'],
 "results":[
   'The Core credit is a negative invoice line with unit price and amount -$79.99, using the same product/service mapping, class and parts tax as the part row above it.',
   'It is a negative line (not a credit memo), so it reduces the same revenue the part row increases; the QuickBooks amount equals the document\'s -$79.99 to the cent.'],
 "source":S1,
 "quotes":[("S1-R17","a unit price and amount of -$79.99 on a $79.99 core, and the same parts tax treatment. It is a negative line on the invoice, not a QuickBooks credit memo, so it reduces the same revenue the part row increases")]},
{"anchors":["S8-E1","S1-E3"],"title":"Deposit above total leaves the exact customer credit",
 "pre":['You are signed in with Part Sales -> Create & Edit and Invoicing & Payments -> Create & Edit, on the build under test. Numeric-accuracy case (Rule 116).',CUST,
   'A part sale whose deposit exceeds its total. Seed: New Part Sale + Add Part so the sale totals about $543.43; Finance tab -> Add Deposit -> Record Deposit $600.00. Compute 600.00 - 543.43 by hand.'],
 "steps":['With the $600.00 deposit on the $543.43 sale (or after returning a core drops the total below the deposit), Create Invoice.',
   'Read the invoice state, its balance, and the customer credit produced; compare the surplus to your hand calculation.'],
 "results":[
   'The invoice is settled to zero and marked Paid (not Partially Paid), and the surplus becomes a customer credit of $56.57 (600.00 - 543.43).',
   'The same holds when returning a core reduces the total below a deposit already taken: the surplus (deposit minus the new lower total) becomes a customer credit; no money is lost and nothing is refused.'],
 "source":S8,
 "quotes":[("S8-E1","the invoice is settled to zero, it is marked Paid rather than Partially Paid, and the surplus becomes a customer credit"),
           ("S1-E3","If a deposit has already been taken and returning a core drops the sale total below the deposit, the surplus becomes a customer credit when the sale is invoiced. No money is lost and nothing is refused")]},
{"anchors":["S1-N8"],"title":"A zero-dollar core is impossible",
 "pre":[ROLE,CUST,'A part being added to a part sale, ready to enter a Core Charge in the Core column.'],
 "steps":['On a new part row, enter a Core Charge of $0.00 and try to save; read the server response.',
   'Confirm a part with no Core Charge shows no core row at all.'],
 "results":[
   'A $0.00 core is refused with "Core Charge must be greater than 0"; a part with no Core Charge has no core row at all, so a $0.00 core can never print anywhere.'],
 "source":S1,
 "quotes":[("S1-N8","The server refuses one with “Core Charge must be greater than 0”, and a part carrying no core charge has no core row at all, so a $0.00 core can never print")]},
]
L.update_by_anchors("DATA",CASES)
