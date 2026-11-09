"""What must not change (Rule 96, skill 17): the invariants a tester can see. Every "as today" / "unchanged" sentence and every visible
Out of Scope item that no story case already proves gets a case here (the others are named in REPORT.md's invariant table with the story
case that proves them). The quote is the PRD's own "unchanged" / "as today" sentence."""
from bt_lib import C
from common import *

S = "INV"
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer")

C("INV-01", S, "The truck and its history stay with the customer when someone else pays",
  [ADMIN, cust("A", ", with one asset, asset 1"), B, wo(1, "A", "invoiced", "B", ", on asset 1")],
  ["Open customer A's Assets.", "Open customer B's Assets.", "Open asset 1's Work Orders tab from customer A's page."],
  [["Asset 1 is listed under customer A."], ["Asset 1 is not listed under customer B: the truck did not move."],
   ["Work order 1 is listed in asset 1's history."]],
  ["CORE-2", "GOAL-2", "T-CUST", "KD-SPLIT"])
C("INV-02", S, "A tax-exempt payer is still charged tax on a taxable customer's job",
  [ADMIN, cust("A", ", taxable at the test location's 5% tax"), cust("B", ", the payer, set as tax exempt in its Taxes settings"),
   wo(1, "A", "in Complete, ready to invoice, with one part sold at $100.00,", "B")],
  [OPEN_WO, FIN, CREATE_INV],
  [["Work order 1 opens for customer A."], ["The estimate shows Parts $100.00, tax $5.00 and Total $105.00."],
   ["The invoice shows tax $5.00 and Total $105.00: tax follows customer A, not customer B, the tax-exempt payer."]],
  ["KD-TAX", "S7-R3"])
C("INV-03", S, "Estimate emails still go to the customer's contacts",
  [ADMIN, cust("A", ", with contact A1, whose email address you can read"), cust("B", ", the payer, with contact B1, whose email address you can read"),
   wo(1, "A", "in Estimate", "B", ", with one line")],
  [OPEN_WO, "Send the estimate for approval by email."],
  [["Work order 1 opens for customer A."],
   ["The estimate email and approval link go to contact A1, as today.", "Contact B1, customer B's contact, is not offered or ticked as a recipient."]],
  ["OOS-12"])
C("INV-04", S, "A standalone credit stays on one customer as today",
  [ADMIN, A, B, wo(1, "A", "in Estimate", "B", ", so customer A has work billed to someone else")],
  ["Open customer A's page.", "Add a $15.00 goodwill credit with no invoice.", "Open customer B's page."],
  [["Customer A's page opens."], ["The $15.00 credit shows on customer A only."], ["Customer B shows no $15.00 credit."]],
  ["OOS-07"])
C("INV-05", S, "The Work Orders list, Board View and Tech View show no Bill To",
  [ADMIN, A, B, wo(1, "A", "in Approved", "B")],
  ["Open the Work Orders list.", "Open Board View.", "Open Tech View."],
  [["Work order 1 is listed with customer A as its customer.", 'No "Bill To" column or label shows: customer B is not named.'],
   ["Work order 1's card shows customer A.", 'No "Bill To" shows on the card.'], ["No \"Bill To\" shows anywhere on Tech View."]],
  ["OOS-09"])
C("INV-06", S, "An imported historical invoice has no Bill To and is unchanged",
  [ADMIN, A, "Have one historical invoice for customer A imported for this test through Data Import, Invoices."],
  ["Open customer A's Invoices tab.", "Open the imported invoice."],
  [["The imported invoice is listed for customer A.", 'No "Service For" column shows.'],
   ["The imported invoice names customer A only.", 'It shows no Bill To other than customer A and no "SERVICE FOR" band.']],
  ["OOS-08"])
C("INV-07", S, "New Work Order picks up a saved default without any new field",
  [ADMIN, B, cust("A", ", whose Bill Invoices To is saved as customer B, with one asset, asset 1"), "Start on the Work Orders page."],
  ["Click New Work Order.", "Pick customer A.", "Pick asset 1.", "Save the new work order.", EXPAND, "Click Change Customer (the two arrows at the top right of the Customer card)."],
  [["The New Work Order window opens with the same fields as before the release."], ["Customer A is picked."], ["Asset 1 is picked."],
   ["The new work order opens for customer A."], [bt_reads("B"), "The Bill To is changed here, on the Customer card, never in New Work Order."],
   ["The customer picker opens: Change Customer is still on the Customer card."]],
  ["OOS-04", "KD-DEF"])
C("INV-08", S, "A shop that never picks a payer sees today's invoice and totals",
  [ADMIN, cust("A", ", that bills itself"), wo(1, "A", "in Complete, ready to invoice, with one part sold at $100.00 at the test location's 5% tax,")],
  [OPEN_WO, FIN, CREATE_INV, "Open the new invoice's PDF.", "Open customer A's Invoices tab."],
  [["Work order 1 opens for customer A."], ["The estimate shows Total $105.00 ($100.00 + 5% tax $5.00)."], ["The invoice is created for $105.00."],
   ["The Bill To block names customer A.", 'No "SERVICE FOR" band prints.'],
   ["The invoice is listed with Total $105.00.", 'No "Service For" column shows.']],
  ["GOAL-4", "KD-SHOW", "CORE-8", "S8-N1", "S10-N1"])
