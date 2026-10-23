"""Story 9 — Over Credit warning (S9-R1 to S9-R4, S9-N1, S9-N2, S9-E1, S9-E2, Error Handling)."""
from ct_lib import C
from common import *

CONF = ('a confirmation opens titled "Confirmation" with the message "Are you sure you want to open a new work order? This customer is over their credit limit." '
        'and the buttons "Create" and "Cancel", worded exactly as before the release.')
NOCONF = "no over-credit confirmation opens; the New Work Order goes straight on as for any customer."
def oc(key, title, cust, ex, pairs, q, note=""):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S9", title, [ADMIN(), (cust, f"For example: {{Customer-A}} is ZZAUTOTEST {key} Customer{ex}."), ("Starting screen: the Work Orders page.", None)], st, rs, q, note=note)
NEWWO = [('Click "New Work Order".', "the New Work Order window opens."), ("Pick {Customer-A} as the customer.", None), ("Confirm the New Work Order window with its create button.", None)]
def wo(res2, res3):
    return [NEWWO[0], (NEWWO[1][0], res2), (NEWWO[2][0], res3)]

oc("S9-01", "A Net 30 customer over a $500 limit still gets the unchanged warning",
   "Customer {Customer-A} holds Net 30, has a credit limit of $500.00 and unpaid invoices totalling $600.00.", "",
   wo("the customer is picked.", CONF), ["S9-R1", "S9-R3", "UFS-52", "EH-S9"])
oc("S9-02", "The Over limit badge shows on the over-limit customer's work order and part sale",
   "Customer {Customer-A} holds Net 30, has a credit limit of $500.00, unpaid invoices totalling $600.00, an open work order {Work-order-1} and an open part sale {Part-sale-A}.",
   ", {Work-order-1} is S2-15440 and {Part-sale-A} is P-1345",
   [("Open {Work-order-1}.", 'the "Over limit" badge shows.'), ("Open {Part-sale-A}.", 'the "Over limit" badge shows.')], ["S9-R2", "S9-R4"])
oc("S9-03", "Opening a part sale never asks the over-credit question",
   "Customer {Customer-A} holds Net 30, has a credit limit of $500.00 and unpaid invoices totalling $600.00.", "",
   [('On Parts, Part Sales, click "New Part Sale".', "the New Part Sale window opens."), ("Pick {Customer-A} as the customer.", "the customer is picked."),
    ("Confirm the window.", 'no over-credit confirmation opens (as before the release); the new part sale shows the "Over limit" badge.')], ["S9-R4", "S9-R2"])
oc("S9-04", "A customer with a $0 or blank limit never gets the warning or badge",
   "Customer {Customer-A} holds Net 30 with a credit limit of $0.00, and customer {Customer-B} holds Net 30 with a blank limit; each has unpaid invoices totalling $600.00 and an open work order, {Work-order-1} and {Work-order-2}.",
   ", {Customer-B} is ZZAUTOTEST S9-04 Blank Limit, {Work-order-1} is S2-15441 and {Work-order-2} is S2-15442",
   wo("the customer is picked.", NOCONF) + [("Open {Work-order-1}.", 'no "Over limit" badge shows.'), ("Open {Work-order-2}.", 'no "Over limit" badge shows ({Customer-B}, blank limit).')],
   ["S9-N1", "GOAL-5", "S11-R8"])
oc("S9-05", "A COD customer with an old limit and a balance gets no warning or badge",
   "Customer {Customer-A} holds COD, keeps a credit limit of $1,000.00 stored from before the release, has unpaid invoices totalling $1,500.00 and an open work order {Work-order-1}.",
   " and {Work-order-1} is S2-15443",
   wo("the customer is picked.", NOCONF) + [("Open {Work-order-1}.", 'no "Over limit" badge shows.')], ["S9-N2", "S11-R8", "GOAL-5"])
oc("S9-06", "A Due on Receipt customer over its limit gets no warning or badge",
   "Customer {Customer-A} holds Due on Receipt with a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order {Work-order-1}.",
   " and {Work-order-1} is S2-15444",
   wo("the customer is picked.", NOCONF) + [("Open {Work-order-1}.", 'no "Over limit" badge shows.')], ["S9-N2", "S11-R8"])
oc("S9-07", "A Credit Hold customer gets no warning but is still blocked from invoicing",
   "Customer {Customer-A} holds Credit Hold, keeps a credit limit of $1,000.00 from before the release, has unpaid invoices totalling $1,500.00 and a complete work order {Work-order-1}.",
   " and {Work-order-1} is S2-15445",
   wo("the customer is picked.", NOCONF) + [("Open {Work-order-1}.", 'no "Over limit" badge shows.'),
                                            ("Open the Finance tab.", "invoicing is still blocked as before the release (the Credit Hold notice shows and Create Invoice is disabled).")],
   ["S9-N2", "S9-E2", "S11-R8"])
oc("S9-08", "A customer with a blank term counts as COD and gets no warning",
   "Customer {Customer-A} has a blank credit term (stored before the release), a credit limit of $500.00 from before the release and unpaid invoices totalling $600.00.", "",
   wo("the customer is picked.", NOCONF), ["S9-N2"])
oc("S9-09", "A customer on the shop's own term over its limit gets the warning and badge",
   "Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, has a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order {Work-order-1}.",
   ", {Term-A} is ZZAUTOTEST S9-09 Fourteen and {Work-order-1} is S2-15446",
   wo("the customer is picked.", CONF) + [("Open {Work-order-1}.", 'the "Over limit" badge shows.')], ["S9-E1", "KD-OWNNET"])
oc("S9-10", "A balance equal to the limit does not warn, one cent over does",
   "Customer {Customer-A} holds Net 30 with a credit limit of $500.00 and unpaid invoices totalling exactly $500.00; customer {Customer-B} holds Net 30 with a $500.00 limit and unpaid invoices totalling $500.01.",
   " and {Customer-B} is ZZAUTOTEST S9-10 One Cent",
   wo("the customer is picked.", NOCONF + " ($500.00 does not exceed $500.00.)") +
   [('Click "New Work Order".', "the New Work Order window opens."), ("Pick {Customer-B} as the customer.", "the customer is picked."),
    ("Confirm the New Work Order window with its create button.", CONF + " ($500.01 exceeds $500.00 by one cent.)")], ["S9-R1"])
