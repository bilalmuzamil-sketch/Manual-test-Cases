import importlib.util
spec=importlib.util.spec_from_file_location("ps_lib","build/founder-mode/part-sales/ps_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
BASE='These are numeric/money-accuracy cases (Rule 116): seed the exact inputs, then read the produced figure back and compare it to the stated exact value to the cent — never eyeball, never accept "a number". Sign in with Part Sales -> Create & Edit; view the document on the Finance tab.'
def src(story,jira): return (f'Epic SV-9667; story {jira}; Part Sales Update v1 PRD (Confluence 867434569), {story}; '
    f'design boards Document_* / Tax_* (exact figures shown on the canvas); read 30 Sep 2026.')
S1=src("Story 1","SV-10262"); S3=src("Story 3","SV-10264"); S8=src("Story 8","SV-10269")

CASES=[
{"anchors":["S1-R13"],"title":"Core charged — the document totals to the exact cent (parts, 5% GST, total)",
 "pre":[BASE,'A post-release part sale with a $517.55 Water Pump carrying a $79.99 core, core charged (not returned).'],
 "steps":['Open the document and read the part row, the Core charge child row, and the Summary.','Compute Parts = 517.55 + 79.99, GST = 5% of that, and Total by hand, then compare to the document.'],
 "results":[
   'The part reads $517.55 and its Core charge child reads $79.99; Parts totals $597.54, GST at 5 percent is $29.88 (597.54 x 0.05 = 29.877, rounded to 29.88) and the sale Total is $627.42.',
   'The core counts toward the parts total, the tax base and the sale total exactly as a received core does.'],
 "source":S1,
 "quotes":[("S1-R13","A $517.55 part carrying a $79.99 core reads $517.55 then $79.99, and totals $597.54 of parts, $29.88 of GST at 5 percent and $627.42")]},
{"anchors":["S1-R11","S1-R6"],"title":"Core returned — the credit is negative to the cent and the totals fall back exactly",
 "pre":[BASE,'The same $517.55 part with a $79.99 core, now returned (a Core credit child row is present).'],
 "steps":['Read the Core charge child ($79.99) and the Core credit child on the document.','Compute Parts, GST and Total by hand after the credit and compare.','Confirm the GST fell by exactly the core\'s own tax.'],
 "results":[
   'The Core credit child prints -$79.99; Parts falls back to $517.55, GST to $25.88 and the Total to $543.43.',
   'The credit equals the core charge exactly including its tax: the GST dropped from $29.88 to $25.88, a fall of $4.00 which is 5 percent of $79.99 (rounded), so returning the core leaves the sale total and tax base where they started before the core was added.'],
 "source":S1,
 "quotes":[("S1-R11","a $79.99 core returned reads -$79.99 ... reads $517.55, then the $79.99, then the -$79.99, and totals $517.55 of parts, $25.88 of GST at 5 percent and $543.43"),
           ("S1-R6","The credit equals the core charge exactly, including its tax, so returning a core leaves the sale total and the tax base where they started")]},
{"anchors":["S3-R3"],"title":"A tax rate change recalculates the total to the exact cent, and the card matches the document",
 "pre":[BASE,'A part sale whose Financial Info card shows Parts $290.91 with GST selectable; the same sale\'s document open.'],
 "steps":['On the Financial Info card, change the tax rate and Save.','Compute the new Total by hand (e.g. 290.91 x 1.05) and compare to the card.','Compare the card Total against the document Total for the same sale.'],
 "results":[
   'Saving recalculates the sale total immediately to the exact figure: Parts $290.91 at GST 5 percent gives a Total of $305.46 (290.91 x 1.05 = 305.4555, rounded to 305.46).',
   'The Total shown on the Financial Info card equals the Total on the customer document for the same sale (parity across the two surfaces).'],
 "source":S3,
 "quotes":[("S3-R3","Saving recalculates the sale total immediately")]},
{"anchors":["S1-R17"],"title":"The Core credit reaches QuickBooks as the exact negative amount and reduces the same revenue",
 "pre":[BASE,'A returned $79.99 core on a part sale invoice that syncs to QuickBooks.'],
 "steps":['Invoice and sync the sale.','In QuickBooks, read the Core credit line\'s unit price and amount and its product/service, class and tax.','Compare the QuickBooks amount against the document\'s -$79.99 Core credit row.'],
 "results":[
   'The Core credit syncs as a negative invoice line with a unit price and amount of -$79.99 on a $79.99 core — the same product-and-service mapping, class and parts tax treatment as the part row above it.',
   'It is a negative line, not a QuickBooks credit memo, so it reduces the same revenue the part row increases; the QuickBooks amount equals the document\'s -$79.99 to the cent (parity).'],
 "source":S1,
 "quotes":[("S1-R17","a unit price and amount of -$79.99 on a $79.99 core, and the same parts tax treatment. It is a negative line on the invoice, not a QuickBooks credit memo, so it reduces the same revenue the part row increases")]},
{"anchors":["S8-E1","S1-E3"],"title":"Deposits above the total settle the invoice to zero and the exact surplus becomes a customer credit",
 "pre":[BASE,'A part sale whose deposits exceed its total — either taken above the total, or where returning a core drops the total below an existing deposit.'],
 "steps":['Take deposits exceeding the total (e.g. a $600.00 deposit on a $543.43 sale), or return a core so the total drops below the deposit.','Invoice the sale and read the invoice state, its balance, and the customer credit produced.','Compute the surplus (deposits - total) by hand and compare.'],
 "results":[
   'When the deposits exceed the total, the invoice is settled to zero and marked Paid (not Partially Paid), and the surplus becomes a customer credit — a $600.00 deposit on a $543.43 sale leaves a $56.57 customer credit.',
   'The same holds when returning a core reduces the total below a deposit already taken: the surplus (deposit minus the new, lower total) becomes a customer credit when the sale is invoiced; no money is lost and nothing is refused.'],
 "source":S8,
 "quotes":[("S8-E1","the invoice is settled to zero, it is marked Paid rather than Partially Paid, and the surplus becomes a customer credit"),
           ("S1-E3","If a deposit has already been taken and returning a core drops the sale total below the deposit, the surplus becomes a customer credit when the sale is invoiced. No money is lost and nothing is refused")]},
{"anchors":["S1-N8"],"title":"A zero-dollar core is impossible — the one core number that must never appear",
 "pre":[BASE,'A part being added with a core charge; attempt a $0.00 core.'],
 "steps":['Try to create or leave a $0.00 core charge and read the server\'s response.','Confirm a part carrying no core charge shows no core row at all, so no $0.00 core prints anywhere.'],
 "results":[
   'A core charge of zero cannot be created or left behind: the server refuses one with "Core Charge must be greater than 0", and a part carrying no core charge has no core row at all, so a $0.00 core can never print.'],
 "source":S1,
 "quotes":[("S1-N8","The server refuses one with “Core Charge must be greater than 0”, and a part carrying no core charge has no core row at all, so a $0.00 core can never print")]},
]
L.run("DATA",CASES)
