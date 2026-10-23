"""Story 8 — QuickBooks sync - credit terms (S8-R1 to S8-R8, S8-N1, S8-N2, S8-E1, Error Handling). The QuickBooks Online sandbox
connected to the test organization is used to look at what QuickBooks holds (Sales, Settings, All lists, Terms)."""
from ct_lib import C, HOLD
from common import *

QBO = ("The test organization is connected to a QuickBooks Online sandbox company, and you can sign in to that company in another tab.", None)
def qb(key, title, pre, pairs, q, note="", marker=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S8", title, [ADMIN(), QBO] + pre, st, rs, q, note=note, marker=marker)
TERMS = ("In QuickBooks, open the Terms list (Settings, All lists, Terms).", )

qb("S8-01", "A shop's Net term reaches QuickBooks as a standard term on first use",
   [("The shop's own term {Term-A}, due 14 days after the invoice date, is not in QuickBooks' Terms list. Customer {Customer-A} holds {Term-A} and work order {Work-order-1} for it is complete.",
     "For example: {Term-A} is ZZAUTOTEST S8-01 Fourteen, {Customer-A} is ZZAUTOTEST S8-01 Customer and {Work-order-1} is S2-15440.")],
   [("On {Work-order-1}'s Finance tab, set Invoice Date to Oct 5, 2026.", "the Due date reads Oct 19, 2026."), ("Click Create Invoice.", "the invoice is created."),
    ("Wait until the invoice has synced to QuickBooks (it is no longer on the QB Unexported report).", "the invoice has synced."),
    (TERMS[0], "a term named exactly {Term-A} now exists, set as a standard term due in 14 days."),
    ("In QuickBooks, open the invoice.", "its terms read {Term-A} and its due date is Oct 19, 2026, the same as in ShopView.")],
   ["S8-R1", "S8-R2", "S8-R5"])

qb("S8-02", "A day-of-the-following-month term reaches QuickBooks as date-driven",
   [("The shop's own term {Term-A}, due on day 10 of the following month, is not in QuickBooks. Customer {Customer-A} holds it and work orders {Work-order-1} and {Work-order-2} for it are complete.",
     "For example: {Term-A} is ZZAUTOTEST S8-02 Tenth, {Customer-A} is ZZAUTOTEST S8-02 Customer and the work orders are S2-15441 and S2-15442.")],
   [("On {Work-order-1}'s Finance tab, set Invoice Date to Oct 5, 2026.", "the Due date reads Nov 10, 2026."), ("Click Create Invoice.", "the invoice is created."),
    ("On {Work-order-2}'s Finance tab, set Invoice Date to Oct 28, 2026.", "the Due date reads Nov 10, 2026."), ("Click Create Invoice.", "the invoice is created."),
    ("Wait until both invoices have synced to QuickBooks.", "both have synced."), (TERMS[0], "{Term-A} exists as a date-driven term, due on day 10 of the following month."),
    ("In QuickBooks, open each of the two invoices.", "both read terms {Term-A} and due Nov 10, 2026, matching ShopView.")],
   ["S8-R3", "S8-R1"])

qb("S8-03", "A term QuickBooks already has under the same name is used and never changed",
   [("QuickBooks already has a term named {Term-A}, set as a standard term due in 20 days. In ShopView, {Term-A} is one of the shop's own terms, due 14 days after the invoice date. Customer {Customer-A} holds it and work order {Work-order-1} for it is complete.",
     "For example: {Term-A} is ZZAUTOTEST S8-03 Mixed, {Customer-A} is ZZAUTOTEST S8-03 Customer and {Work-order-1} is S2-15443.")],
   [("On {Work-order-1}'s Finance tab, set Invoice Date to Oct 5, 2026.", "the Due date reads Oct 19, 2026 (14 days, ShopView's rule)."), ("Click Create Invoice.", "the invoice is created."),
    ("Wait until the invoice has synced.", "it has synced."), (TERMS[0], "there is still one {Term-A}, still due in 20 days: ShopView did not change it or add a second one."),
    ("In QuickBooks, open the invoice.", "its due date is Oct 19, 2026, the date ShopView sent (only the QuickBooks customer's term may differ).")],
   ["S8-R4", "S8-E1"])

qb("S8-04", "A vendor invoice goes to QuickBooks as a bill with its stored due date",
   [("Vendor {Vendor-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, not yet in QuickBooks; a vendor invoice {Vendor-invoice-A} for it, dated Oct 5, 2026, is stored due Oct 19, 2026 and not yet sent.",
     "For example: {Vendor-A} is ZZAUTOTEST S8-04 Vendor, {Term-A} is ZZAUTOTEST S8-04 Fourteen and {Vendor-invoice-A} is ZZAUTOTEST S8-04 Bill.")],
   [("Send {Vendor-invoice-A} to QuickBooks the way the shop does today.", "it is sent."), ("In QuickBooks, open the bill.", "it is a bill for {Vendor-A}, due Oct 19, 2026, with terms {Term-A}."),
    (TERMS[0], "{Term-A} was created, as a standard term due in 14 days.")],
   ["S8-R5", "S8-R1", "S8-R2", "T-VI"])

qb("S8-05", "Changing a customer's term in Edit Customer does not change QuickBooks",
   [("Customer {Customer-A} holds Net 30 and is already in QuickBooks with terms Net 30; work order {Work-order-1} for it is complete.",
     "For example: {Customer-A} is ZZAUTOTEST S8-05 Customer and {Work-order-1} is S2-15444.")],
   [("Open Edit Customer for {Customer-A}.", "the window opens."), ('Choose "Net 45" in Credit Terms.', "Net 45 is chosen."), ("Click Save.", "the customer is on Net 45."),
    ("In QuickBooks, open the customer {Customer-A}.", "its terms still read Net 30."),
    ("On {Work-order-1}'s Finance tab, click Create Invoice.", "the invoice is created on Net 45."), ("Wait until the invoice has synced.", "it has synced."), ("In QuickBooks, open the invoice.", "the invoice carries Net 45 and its own due date, while the QuickBooks customer still reads Net 30.")],
   ["S8-R6", "OOS-5"])

qb("S8-06", "Move Customers does not change the customer in QuickBooks",
   [("Customer {Customer-A} is the only customer on Net 20 and is in QuickBooks with terms Net 20.", "For example: {Customer-A} is ZZAUTOTEST S8-06 Customer."), PAGE],
   [('Click the "⋯" at the right of the "Net 20" row.', "the menu opens."), ('Click "Move Customers".', "the window opens."), ('Choose "Net 45" in "Move To".', "Net 45 is chosen."),
    ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 45." shows.'), ("In QuickBooks, open the customer {Customer-A}.", "its terms still read Net 20: no customer update was sent.")],
   ["S8-R6", "S4-R12"])

qb("S8-07", "Deactivating, reactivating, editing or deleting a term sends nothing",
   [("The shop's own term {Term-A} is already in QuickBooks (an invoice used it) and its term {Term-B}, held by nobody, is not.",
     "For example: {Term-A} is ZZAUTOTEST S8-07 Used and {Term-B} is ZZAUTOTEST S8-07 Unused."), PAGE],
   [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Deactivate".', 'the toast "{Term-A} deactivated" shows.'),
    (TERMS[0], "{Term-A} is still there, unchanged (active in QuickBooks)."), ('On the Inactive tab, click the "⋯" at the right of the {Term-A} row.', "the menu opens."),
    ('Click "Reactivate".', "the term is active again."), ('Click the "⋯" at the right of the {Term-B} row.', "the menu opens."), ('Click "Edit".', "the window opens."),
    ("Type 21 in the Days box in place of the number there.", "the blue line shows."), ('Click "Save Changes".', "the toast shows."), ('Click the "⋯" at the right of the {Term-B} row.', "the menu opens."),
    ('Click "Delete Credit Term".', "the confirmation opens."), ('Click the red "Delete Credit Term" button.', 'the toast "{Term-B} deleted" shows.'),
    ("In QuickBooks, refresh the Terms list.", "{Term-A} is unchanged and {Term-B} never appeared.")],
   ["S8-R7", "S8-N2"])

qb("S8-08", "A shop term nobody has used on a synced record is never sent",
   [("The shop's own term {Term-A} was created today and is held only by a customer {Customer-A} who has no invoice.",
     "For example: {Term-A} is ZZAUTOTEST S8-08 Fresh and {Customer-A} is ZZAUTOTEST S8-08 Customer (not yet in QuickBooks).")],
   [(TERMS[0], "there is no {Term-A}.")],
   ["S8-N2"])

qb("S8-09", "A QuickBooks refusal lands on the QB Unexported report with the reason",
   [("Customer {Customer-A} holds the shop's own term {Term-A}; its invoice will be refused by QuickBooks for a reason the sandbox gives today, and work order {Work-order-1} for it is complete.",
     "For example: {Customer-A} is ZZAUTOTEST S8-09 Customer with a tax code the sandbox does not accept, {Term-A} is ZZAUTOTEST S8-09 Fourteen and {Work-order-1} is S2-15445.")],
   [("On {Work-order-1}'s Finance tab, click Create Invoice.", "the invoice is created; ShopView work goes on (nothing is blocked)."),
    ("Open the QB Unexported report.", "the invoice is listed with the reason QuickBooks gave."), ("Fix the cause in the sandbox.", "the cause is fixed."),
    ("Resend the invoice from the QB Unexported report.", "it syncs; it leaves the report and appears in QuickBooks with terms {Term-A}.")],
   ["EH-S8"])

C("S8-10", "S8", "Without QuickBooks connected, nothing is sent and terms work the same",
  [ADMIN(), ("The test organization is not connected to QuickBooks.", None), ("Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and work order {Work-order-1} for it is complete.",
                                                                            "For example: {Customer-A} is ZZAUTOTEST S8-10 Customer, {Term-A} is ZZAUTOTEST S8-10 Fourteen and {Work-order-1} is S2-15446.")],
  ["On {Work-order-1}'s Finance tab, set Invoice Date to Oct 5, 2026.", "Click Create Invoice.", "Open the QB Unexported report."],
  ["Step 1: the Due date reads Oct 19, 2026.", "Step 2: the invoice is created with no QuickBooks message.", "Step 3: the report holds nothing for this invoice (nothing was sent)."],
  ["S8-N1"])

C("S8-11", "S8", "AccountingHub and IBS receive the due date only, never the term name",
  [ADMIN(), ("The organization sends invoices to AccountingHub and IBS, and you can see what each received.", None),
   ("Customer {Customer-A} holds the shop's own term {Term-A}, and its invoice {Invoice-A} has been sent.", "For example: {Customer-A} is ZZAUTOTEST S8-11 Customer and {Term-A} is ZZAUTOTEST S8-11 Fourteen.")],
  ["Open what AccountingHub received for {Invoice-A}.", "Open what IBS received for {Invoice-A}."],
  ["Step 1: it holds the invoice's due date and not the name {Term-A}.", "Step 2: it holds the due date and not the name {Term-A}."],
  ["S8-R8", "OOS-14"], marker=HOLD("what AccountingHub and IBS receive cannot be seen in ShopView; needs access to those systems"))

C("S8-12", "S8", "Move Customers sends AccountingHub the same update as Edit Customer",
  [ADMIN(), ("The organization is connected to AccountingHub, and you can see the customer updates it receives.", None),
   ("Net 20 is held by exactly one customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S8-12 Customer."), PAGE],
  ['Click the "⋯" at the right of the "Net 20" row.', 'Click "Move Customers".', 'Choose "Net 45" in "Move To".', 'Click "Move 1 Customer".', "Open the customer update AccountingHub received."],
  ["Step 1: the menu opens.", "Step 2: the window opens.", "Step 3: Net 45 is chosen.", 'Step 4: the toast "1 customer moved to Net 45." shows.',
   "Step 5: AccountingHub received one customer update for {Customer-A}, the same kind an Edit Customer save sends."],
  ["S4-R12"], marker=HOLD("what AccountingHub receives cannot be seen in ShopView; needs access to AccountingHub"))
