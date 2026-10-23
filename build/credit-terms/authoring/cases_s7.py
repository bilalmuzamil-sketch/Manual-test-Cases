"""Story 7 — Due dates: the behaviour cases (S7-R6a, S7-R7, S7-R9, S7-R11, S7-N1, S7-E1, S7-E3, S7-E4, Key Decision on the shop's own
terms). Every computed date (S7-R1 to S7-R6b, S7-R8, S7-R10) is in cases_data.py with the arithmetic shown."""
from ct_lib import C, HOLD, PO_HOLD
from common import *
from po_questions import QN

def dd(key, title, pre, pairs, q, note="", marker=None, start=None, who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S7", title, [who or ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)

dd("S7-01", "An invoice keeps its term and due date when the customer's term changes",
   [("Customer {Customer-A} holds Net 30 and has an invoice {Invoice-A} dated Oct 5, 2026, due Nov 4, 2026, showing Terms Net 30.",
     "For example: {Customer-A} is ZZAUTOTEST S7-01 Customer and {Invoice-A} is the invoice of work order S2-15440.")],
   [("Open Edit Customer for {Customer-A}.", "the window opens."), ('Choose "Net 60" in Credit Terms.', "Net 60 is chosen."), ("Click Save.", "the customer is on Net 60."),
    ("Open {Invoice-A}.", "it still shows Terms Net 30 and Due date Nov 4, 2026."),
    ('On the Credit Terms page, click the "⋯" at the right of the "Net 60" row.', "the menu opens."), ('Click "Deactivate".', 'the toast "Net 60 deactivated" shows.'),
    ("Open {Invoice-A} again.", "it still shows Terms Net 30 and Due date Nov 4, 2026."),
    ('On the Inactive tab, click the "⋯" at the right of the "Net 60" row.', "the menu opens."), ('Click "Move Customers".', "the Move Customers window opens."),
    ('Choose "Net 15" in "Move To".', "Net 15 is chosen (untick every customer but {Customer-A} first if others are listed)."), ("Click the move button.", "the move toast shows."),
    ("Open {Invoice-A} again.", "it still shows Terms Net 30 and Due date Nov 4, 2026: the invoice never changed.")],
   ["S7-R7", "KD-LOCK"])

dd("S7-02", "A vendor invoice is due by the vendor's term and recalculated on change",
   [("Vendor {Vendor-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and vendor {Vendor-B} holds Net 30.",
     "For example: {Vendor-A} is ZZAUTOTEST S7-02 Vendor A, {Term-A} is ZZAUTOTEST S7-02 Fourteen and {Vendor-B} is ZZAUTOTEST S7-02 Vendor B."),
    ("A vendor invoice {Vendor-invoice-A} for {Vendor-A}, not yet saved, is open in Parts, Vendors, Vendor Invoices.", "For example: {Vendor-invoice-A} is a new vendor invoice for one part.")],
   [("Set the invoice date to Oct 5, 2026.", "the due date shows Oct 19, 2026 (Oct 5 + 14 days)."), ("Save the vendor invoice.", "it is saved with due date Oct 19, 2026."),
    ("Change the invoice date to Oct 20, 2026.", "the due date is recalculated to Nov 3, 2026 (Oct 20 + 14 days)."), ("Save the vendor invoice.", "it is saved with due date Nov 3, 2026."),
    ("Change the vendor to {Vendor-B}.", "the due date is recalculated to Nov 19, 2026 (Oct 20 + 30 days, Net 30)."), ("Save the vendor invoice.", "the stored due date is Nov 19, 2026.")],
   ["S7-R9", "S7-R1"])

dd("S7-03", "The Vendor Bill Export shows the stored due date, not the vendor's new term",
   [("Vendor {Vendor-A} holds Net 30 and has a vendor invoice {Vendor-invoice-A} dated Oct 5, 2026, stored due Nov 4, 2026.",
     "For example: {Vendor-A} is ZZAUTOTEST S7-03 Vendor and {Vendor-invoice-A} is ZZAUTOTEST S7-03 Bill 1."),
    ("Vendor {Vendor-B} has a vendor invoice {Vendor-invoice-B} with no stored due date (from before the release).", "For example: {Vendor-B} is ZZAUTOTEST S7-03 Old Vendor.")],
   [("Open Edit Vendor for {Vendor-A}.", "the window opens."), ('Choose "Net 60" in Credit Terms.', "Net 60 is chosen."), ("Click Save & Close.", "the vendor is on Net 60."),
    ("Run the Vendor Bill Export for October 2026.", "the export downloads."),
    ("Find {Vendor-invoice-A} and {Vendor-invoice-B} in the export.", "{Vendor-invoice-A}'s due date reads Nov 4, 2026 (stored), not Dec 4, 2026 (what Net 60 would give); {Vendor-invoice-B}'s due date is blank.")],
   ["S7-R11", "S11-R14"])

dd("S7-04", "The same invoice shows the same due date to users in other locations",
   [("You are enrolled at {Location-A} and at {Location-B}, which is in another time zone.", f"For example: {{Location-A}} is {LOC_A} (Edmonton time) and {{Location-B}} is in Auckland."),
    ("Customer {Customer-A} holds the shop's own term {Term-A}, due on day 10 of the following month, and has an invoice {Invoice-A} at {Location-A} dated Oct 5, 2026.",
     "For example: {Customer-A} is ZZAUTOTEST S7-04 Customer and {Term-A} is ZZAUTOTEST S7-04 Tenth."),
    ("A second user, {User-B}, without Settings → Finance, works in {Location-B}.", "For example: {User-B} is ZZAUTOTEST S7-04 Writer on the Service Advisor role.")],
   [("Open {Invoice-A}.", "the due date reads Nov 10, 2026."), ("Switch location to {Location-B}.", "you now work in {Location-B}."), ("Open {Invoice-A} again.", "the due date still reads Nov 10, 2026."),
    ("In {User-B}'s browser, open {Invoice-A}.", "{User-B} also sees Nov 10, 2026 (the term list loads for every user).")],
   ["S7-R6a", "S7-R6", "PERM-LIST"])

dd("S7-05", "A term the app does not recognise is dated exactly as before the release",
   [("Customer {Customer-A} is stored with a credit term text ShopView does not know, {Text-A}, and an invoice {Invoice-A} for it, dated Oct 5, 2026, was created before the release; its due date then, {Date-A}, was written down.",
     "For example: {Customer-A} is ZZAUTOTEST S7-05 Customer, {Text-A} is Prepaid and {Date-A} is Oct 5, 2026."),
    ("Work order {Work-order-1} for {Customer-A} is complete and ready to invoice.", "For example: {Work-order-1} is S2-15441.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Oct 5, 2026.", "the due date reads {Date-A}, the same as before the release."),
    ("Click Create Invoice.", "the invoice is created with due date {Date-A}; no error, no blank.")],
   ["S7-N1", "S10-R4"], marker=HOLD("needs a due date captured on the test site before the release is installed"))

dd("S7-06", "A deactivated term still dates new invoices for customers who keep it",
   [("Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and {Term-A} is deactivated.",
     "For example: {Customer-A} is ZZAUTOTEST S7-06 Customer and {Term-A} is ZZAUTOTEST S7-06 Fourteen."),
    (wo_invoice("{Work-order-1}", "{Customer-A}"), "For example: {Work-order-1} is S2-15442.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Oct 5, 2026.", "the due date reads Oct 19, 2026 (Oct 5 + 14 days)."),
    ("Click Create Invoice.", "the invoice is created; it prints the plain name {Term-A} and the due date Oct 19, 2026.")],
   ["S7-E1", "S5-R8"])

dd("S7-07", "An invoice made after a reversal takes the customer's term at that moment",
   [("Customer {Customer-A} has invoice {Invoice-A} for work order {Work-order-1}, dated Oct 5, 2026, created on Net 30 (due Nov 4, 2026). The customer has since been moved to Net 60.",
     "For example: {Customer-A} is ZZAUTOTEST S7-07 Customer and {Work-order-1} is S2-15443.")],
   [("On {Work-order-1}'s Finance tab, open the invoice's menu.", "the menu shows Reverse."), ("Click Reverse.", "the warning opens."), ("Confirm Reverse.", "the invoice is reversed and Create Invoice shows again."),
    ("Set Invoice Date to Oct 5, 2026.", "the due date reads Dec 4, 2026 (Oct 5 + 60 days)."), ("Click Create Invoice.", "the new invoice shows Terms Net 60 and due Dec 4, 2026; Nov 4, 2026 does not come back.")],
   ["S7-E3"])

dd("S7-08", "Changing the customer on an open work order takes the new customer's term",
   [("Customer {Customer-A} holds Net 30 and customer {Customer-B} holds the shop's own term {Term-A}, due on day 10 of the following month.",
     "For example: {Customer-A} is ZZAUTOTEST S7-08 First, {Customer-B} is ZZAUTOTEST S7-08 Second and {Term-A} is ZZAUTOTEST S7-08 Tenth."),
    (wo_invoice("{Work-order-1}", "{Customer-A}"), "For example: {Work-order-1} is S2-15444.")],
   [("On {Work-order-1}, change the customer to {Customer-B}.", "the work order now shows {Customer-B}."), ("Open the Finance tab.", "the invoice preview shows."),
    ("Set Invoice Date to Oct 5, 2026.", "the due date reads Nov 10, 2026 ({Term-A}, not Net 30's Nov 4)."), ("Click Create Invoice.", "the invoice shows {Term-A} and due Nov 10, 2026.")],
   ["S7-E4"])

dd("S7-09", "A customer on the shop's own term can charge an invoice to account",
   [("Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, with a credit limit of $5,000.00.",
     "For example: {Customer-A} is ZZAUTOTEST S7-09 Customer and {Term-A} is ZZAUTOTEST S7-09 Fourteen."), (wo_invoice("{Work-order-1}", "{Customer-A}"), "For example: {Work-order-1} is S2-15445.")],
   [("Open {Work-order-1}'s Finance tab.", "Create Invoice is enabled (invoicing is not blocked)."), ("Click Create Invoice.", "the invoice is created and the payment window opens."),
    ("Look at the payment methods.", "Charge Account is offered, as for a Net 30 customer."), ("Close the payment window without paying.", "the invoice stays (it is not removed, unlike a COD invoice).")],
   ["KD-OWNNET", "S11-R10", "GOAL-2"])

dd("S7-10", "Changing the invoice date after the customer changed term",
   [("Customer {Customer-A} has invoice {Invoice-A} created on Net 30, dated Oct 5, 2026 (due Nov 4, 2026); the customer has since been moved to Net 60.",
     "For example: {Customer-A} is ZZAUTOTEST S7-10 Customer and {Invoice-A} is the invoice of work order S2-15446.")],
   [("Open {Invoice-A}.", "it shows Terms Net 30, due Nov 4, 2026."), ("Change its invoice date to Oct 10, 2026.", "the due date becomes Nov 9, 2026 (Net 30) or Dec 9, 2026 (Net 60), as the PO answers.")],
   ["S7-R8", "S7-R7"], marker=PO_HOLD(QN["date-change-term"]),
   note=f"S7-R7 says the invoice keeps its term; S7-R8 says a changed date is recalculated from the customer's term. Question {QN['date-change-term']} on Chris Ward's sheet (not sent yet) asks which wins; held until he answers.")
