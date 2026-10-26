"""Relevance and independence pass (26 Oct 2026). QA lead: "they must make sense and relate to the steps and expected results below" and
"the test cases need to be created in a way that if one test case fails that does not block the other test case."

REPL: per case, an original precondition (exact text, with placeholders) -> its replacement list of (state, example) tuples. It splits the
shared building blocks (three(), ADMIN(), the work-order sentences) where they named records a case never uses: the record is left
unnamed ("a customer who holds Net 30"), or dropped when nothing needs it, or keeps its name with a "so …" reason. Applied by ct_lib.C()
before the case is stored, so the TestRail text and the setup file read the same records. An original that does not match raises an
error (no silent miss).
NOTE_REPL: notes that named another case: the reference is replaced by what to expect (a tester never needs another case)."""

A1 = "You are an Admin user working at {Location-A}."
WO_READY = "Work order {Work-order-1} for {Customer-A} is complete and ready to invoice (every part received, review done)."
THREE = ("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers, {Customer-A}, {Customer-B} and "
         "{Customer-C} (a new term holds only this case's customers), whose names are in that A to Z order, with credit limits of $500.00, $0.00 "
         "and $1,000.00.")
EX_ADMIN = "For example: {Location-A} is Staging Heavy Duty - 9919."

def wo(holds, wo_ex="S2-15440", extra=""):
    """A work order ready to invoice for a customer who is never named again."""
    return (f"Work order {{Work-order-1}} is complete and ready to invoice (every part received, review done), for a customer who holds {holds}{extra}.",
            f"For example: {{Work-order-1}} is {wo_ex}.")

def signed(role_text, ex):
    return (f"You are signed in as a user {role_text}.", f"For example: {ex}.")

REPL = {
 "S1-21": {"You are enrolled at two locations, {Location-A} and {Location-B}.":
             [("You are also enrolled at a second location, {Location-B}.", "For example: {Location-B} is Staging Lethbridge - 4310.")]},
 "S1-22": {"You are signed in as {User-A}, whose role has every Settings page except Finance.":
             [signed("whose role has every Settings page except Finance", "the user is ZZAUTOTEST S1-22 User, on a custom role ZZAUTOTEST S1-22 No Finance")]},
 "S1-26": {"The shop's own term {Term-A}, due 14 days after the invoice date, is held by no customer and no vendor today, but one invoice, {Invoice-A}, was created with it (its customer was later moved to another term).":
             [("The shop's own term {Term-A}, due 14 days after the invoice date, is held by no customer and no vendor today, but one invoice was created with it (its customer was later moved to another term), so the term is still in use.",
               "For example: {Term-A} is ZZAUTOTEST S1-26 Fourteen and the invoice is the invoice of work order S2-15440.")]},
 "S2-10": {"The shop has its own active term {Term-A}, due 14 days after the invoice date, held by one customer, {Customer-A}, and by no vendor or invoice.":
             [("The shop has its own active term {Term-A}, due 14 days after the invoice date, held by exactly one customer and by no vendor or invoice.",
               "For example: {Term-A} is ZZAUTOTEST S2-10 Fourteen, held by ZZAUTOTEST S2-10 Customer.")]},
 "S2-11": {"The shop has its own active term {Term-A}, due on day 10 of the following month, held by two vendors, {Vendor-A} and {Vendor-B}, and by no customer or invoice.":
             [("The shop has its own active term {Term-A}, due on day 10 of the following month, held by exactly two vendors and by no customer or invoice.",
               "For example: {Term-A} is ZZAUTOTEST S2-11 Tenth, held by ZZAUTOTEST S2-11 Vendor A and ZZAUTOTEST S2-11 Vendor B.")]},
 "S3-06": {"You are enrolled at {Location-B}, in a time zone where today's date is already {Date-B} while it is still {Date-A} at {Location-A}. Run the case at a time of day when the two dates differ.":
             [("You are also enrolled at {Location-B}, in a time zone where today's date is already one day later than where you work now. Run the case at a time of day when the two dates differ.",
               "For example: you work in Edmonton and {Location-B} is in Auckland.")],
           "Today's date on the calendar of {Location-A} is {Date-A}.":
             [("Today's date on the calendar of {Location-A} is {Date-A}.", "For example: {Date-A} is Oct 21."),
              ("Today's date on the calendar of {Location-B} is {Date-B}.", "For example: {Date-B} is Oct 22.")]},
 "S4-04": {THREE: [("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers); one of them is {Customer-B}, the last word of whose name is in neither of the other two names.",
                    "For example: {Term-A} is ZZAUTOTEST S4-04 N15 and the customers are ZZAUTOTEST S4-04 Alpha, ZZAUTOTEST S4-04 Bravo ({Customer-B}) and ZZAUTOTEST S4-04 Charlie.")]},
 "S4-08": {THREE: [("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers): {Customer-A} with a credit limit of $500.00, {Customer-C} with a credit limit of $1,000.00, and one more customer.",
                    "For example: {Term-A} is ZZAUTOTEST S4-08 N15, {Customer-A} is ZZAUTOTEST S4-08 Alpha, {Customer-C} is ZZAUTOTEST S4-08 Charlie and the third is ZZAUTOTEST S4-08 Bravo.")]},
 "S4-09": {"The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.":
             [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer.", "For example: {Term-A} is ZZAUTOTEST S4-09 N20, held by ZZAUTOTEST S4-09 Solo.")]},
 "S4-12": {THREE: [("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers), with credit limits of $500.00, $0.00 and $1,000.00.",
                    "For example: {Term-A} is ZZAUTOTEST S4-12 N15, held by ZZAUTOTEST S4-12 Alpha, Bravo and Charlie.")]},
 "S4-16": {THREE: [("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers): {Customer-A}, {Customer-C} and one more customer.",
                    "For example: {Term-A} is ZZAUTOTEST S4-16 N15, {Customer-A} is ZZAUTOTEST S4-16 Alpha, {Customer-C} is ZZAUTOTEST S4-16 Charlie and the third is ZZAUTOTEST S4-16 Bravo.")]},
 "S4-18": {"The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers, {Customer-A} and {Customer-B}.":
             [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers made for this test, one of them {Customer-A}.",
               "For example: {Term-A} is ZZAUTOTEST S4-18 N20, {Customer-A} is ZZAUTOTEST S4-18 Alpha and the other is ZZAUTOTEST S4-18 Bravo.")]},
 "S4-20": {THREE: [("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers), one of them {Customer-B}.",
                    "For example: {Term-A} is ZZAUTOTEST S4-20 N15 and the customers are ZZAUTOTEST S4-20 Alpha, ZZAUTOTEST S4-20 Bravo ({Customer-B}) and ZZAUTOTEST S4-20 Charlie.")]},
 "S4-36": {"Your user name is {User-A}.": []},
 "S5-13": {"Customer {Customer-A} holds the shop's own term {Term-A}, which has a 31-character name. Work order {Work-order-1} for {Customer-A} has an estimate and an invoice.":
             [("Work order {Work-order-1} has an estimate and an invoice, for a customer who holds the shop's own term {Term-A}, which has a 31-character name.",
               "For example: {Term-A} is ZZAUTOTEST S5-13 Long Term Name and {Work-order-1} is S2-15440.")]},
 "S5-14": {"Customer {Customer-A} holds the shop's own term {Term-A}, which has a 31-character name. Work order {Work-order-1} for {Customer-A} has an estimate and an invoice.":
             [("Work order {Work-order-1} has an estimate and an invoice, for a customer who holds the shop's own term {Term-A}, which has a 31-character name.",
               "For example: {Term-A} is ZZAUTOTEST S5-14 Long Term Name and {Work-order-1} is S2-15440.")]},
 "S5-20": {'You are signed in as {User-A}, on the out-of-the-box "Service Manager" role (Customers → Create & Edit and View and Manage AP/AR Data, no Settings → Finance).':
             [signed('on the out-of-the-box "Service Manager" role (Customers → Create & Edit and View and Manage AP/AR Data, no Settings → Finance)', "the user is ZZAUTOTEST S5-20 User")]},
 "S7-01b": {"Customer {Customer-A} holds Net 30 and has an invoice {Invoice-A} dated Oct 5, 2026, due Nov 4, 2026, showing Terms Net 30.":
             [("Invoice {Invoice-A}, dated Oct 5, 2026, due Nov 4, 2026, showing Terms Net 30, belongs to a customer who holds Net 30.",
               "For example: {Invoice-A} is the invoice of work order S2-15440 for ZZAUTOTEST S7-01b Customer.")]},
 "S7-02": {"Vendor {Vendor-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and vendor {Vendor-B} holds Net 30.":
             [("Vendor {Vendor-B} holds Net 30.", "For example: {Vendor-B} is ZZAUTOTEST S7-02 Vendor B.")],
           "A vendor invoice {Vendor-invoice-A} for {Vendor-A}, not yet saved, is open in Parts, Vendors, Vendor Invoices.":
             [("A new vendor invoice, not yet saved, is open in Parts, Vendors, Vendor Invoices, for a vendor who holds one of the shop's own terms, due 14 days after the invoice date.",
               "For example: the vendor is ZZAUTOTEST S7-02 Vendor A on ZZAUTOTEST S7-02 Fourteen.")]},
 "S7-04": {"You are enrolled at {Location-A} and at {Location-B}, which is in another time zone.":
             [("You are also enrolled at {Location-B}, which is in another time zone.", "For example: you work in Edmonton and {Location-B} is in Auckland.")],
           "Customer {Customer-A} holds the shop's own term {Term-A}, due on day 10 of the following month, and has an invoice {Invoice-A} at {Location-A} dated Oct 5, 2026.":
             [("Invoice {Invoice-A}, dated Oct 5, 2026, at {Location-A}, belongs to a customer who holds one of the shop's own terms, due on day 10 of the following month.",
               "For example: the customer is ZZAUTOTEST S7-04 Customer on ZZAUTOTEST S7-04 Tenth.")]},
 "S7-05": {'On production, customer {Customer-A} is stored with a credit term text ShopView does not know, {Text-A}, and an invoice {Invoice-A} for it, dated Oct 5, 2026, was created before the release reached production; its due date then, {Date-A}, was written down (with a screenshot).':
             [('On production, a customer is stored with a credit term text ShopView does not know, {Text-A}, and an invoice for it, dated Oct 5, 2026, was created before the release reached production.',
               "For example: the customer is ZZAUTOTEST S7-05 Customer and {Text-A} is Prepaid."),
              ("You have that invoice's due date from before the release written down ({Date-A}), with a screenshot.", "For example: {Date-A} is Oct 5, 2026.")],
           "Work order {Work-order-1} for {Customer-A} is complete and ready to invoice.":
             [("Work order {Work-order-1}, for the same customer, is complete and ready to invoice.", "For example: {Work-order-1} is S2-15441.")]},
 "S7-06": {"Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and {Term-A} is deactivated.": [],
           WO_READY: [("Work order {Work-order-1} is complete and ready to invoice (every part received, review done), for a customer who holds the shop's own term {Term-A}, due 14 days after the invoice date.",
                       "For example: {Work-order-1} is S2-15442 and {Term-A} is ZZAUTOTEST S7-06 Fourteen."),
                      ("{Term-A} is deactivated.", None)]},
 "S7-07": {"Customer {Customer-A} has invoice {Invoice-A} for work order {Work-order-1}, dated Oct 5, 2026, created on Net 30 (due Nov 4, 2026). The customer has since been moved to Net 60.":
             [("Work order {Work-order-1} has an invoice dated Oct 5, 2026, created on Net 30 (due Nov 4, 2026); its customer has since been moved to Net 60.",
               "For example: {Work-order-1} is S2-15443 for ZZAUTOTEST S7-07 Customer.")]},
 "S7-08": {"Customer {Customer-A} holds Net 30 and customer {Customer-B} holds the shop's own term {Term-A}, due on day 10 of the following month.":
             [("Customer {Customer-B} holds the shop's own term {Term-A}, due on day 10 of the following month.", "For example: {Customer-B} is ZZAUTOTEST S7-08 Second and {Term-A} is ZZAUTOTEST S7-08 Tenth.")],
           WO_READY: [wo("Net 30", "S2-15444")]},
 "S7-09": {"Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, with a credit limit of $5,000.00.": [],
           WO_READY: [wo("one of the shop's own terms, due 14 days after the invoice date", "S2-15445", ", with a credit limit of $5,000.00")]},
 "S7-10": {"Customer {Customer-A} has invoice {Invoice-A} created on Net 30, dated Oct 5, 2026 (due Nov 4, 2026); the customer has since been moved to Net 60.":
             [("Create invoice {Invoice-A} for this test, for a customer on Net 30, dated Oct 5, 2026 (due Nov 4, 2026); then move that customer to Net 60.",
               "For example: {Invoice-A} is the invoice of work order S2-15446 for ZZAUTOTEST S7-10 Customer.")]},
 "S8-01": {"The shop's own term {Term-A}, due 14 days after the invoice date, is not in QuickBooks' Terms list. Customer {Customer-A} holds {Term-A} and work order {Work-order-1} for it is complete.":
             [("The shop's own term {Term-A}, due 14 days after the invoice date, is not in QuickBooks' Terms list.", "For example: {Term-A} is ZZAUTOTEST S8-01 Fourteen."),
              ("Work order {Work-order-1} is complete, for a customer who holds {Term-A}.", "For example: {Work-order-1} is S2-15440.")]},
 "S8-02": {"The shop's own term {Term-A}, due on day 10 of the following month, is not in QuickBooks. Customer {Customer-A} holds it and work orders {Work-order-1} and {Work-order-2} for it are complete.":
             [("The shop's own term {Term-A}, due on day 10 of the following month, is not in QuickBooks.", "For example: {Term-A} is ZZAUTOTEST S8-02 Tenth."),
              ("Work orders {Work-order-1} and {Work-order-2} are complete, both for one customer who holds {Term-A}.", "For example: the work orders are S2-15441 and S2-15442.")]},
 "S8-03": {"QuickBooks already has a term named {Term-A}, set as a standard term due in 20 days. In ShopView, {Term-A} is one of the shop's own terms, due 14 days after the invoice date. Customer {Customer-A} holds it and work order {Work-order-1} for it is complete.":
             [("QuickBooks already has a term named {Term-A}, set as a standard term due in 20 days. In ShopView, {Term-A} is one of the shop's own terms, due 14 days after the invoice date.",
               "For example: {Term-A} is ZZAUTOTEST S8-03 Mixed."),
              ("Work order {Work-order-1} is complete, for a customer who holds {Term-A}.", "For example: {Work-order-1} is S2-15443.")]},
 "S8-08": {"The shop's own term {Term-A} was created today and is held only by a customer {Customer-A} who has no invoice.":
             [("The shop's own term {Term-A} was created today and is held only by one customer, who has no invoice.", "For example: {Term-A} is ZZAUTOTEST S8-08 Fresh.")]},
 "S8-09": {"Customer {Customer-A} holds the shop's own term {Term-A}; its invoice will be refused by QuickBooks for a reason the sandbox gives today, and work order {Work-order-1} for it is complete.":
             [("Work order {Work-order-1} is complete, for a customer who holds the shop's own term {Term-A} and whose invoice QuickBooks will refuse for a reason the sandbox gives today.",
               "For example: the customer has a tax code the sandbox does not accept, {Term-A} is ZZAUTOTEST S8-09 Fourteen and {Work-order-1} is S2-15445.")]},
 "S8-10": {"Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, and work order {Work-order-1} for it is complete.":
             [("Work order {Work-order-1} is complete, for a customer who holds one of the shop's own terms, due 14 days after the invoice date.", "For example: {Work-order-1} is S2-15446.")]},
 "S8-11": {"Customer {Customer-A} holds the shop's own term {Term-A}, and its invoice {Invoice-A} has been sent.":
             [("Invoice {Invoice-A} has been sent, for a customer who holds the shop's own term {Term-A}.", "For example: {Term-A} is ZZAUTOTEST S8-11 Fourteen.")]},
 "S9-02": {"Customer {Customer-A} holds Net 30, has a credit limit of $500.00, unpaid invoices totalling $600.00, an open work order {Work-order-1} and an open part sale {Part-sale-A}.":
             [("A customer holds Net 30, has a credit limit of $500.00, unpaid invoices totalling $600.00, an open work order {Work-order-1} and an open part sale {Part-sale-A}.",
               "For example: the customer is ZZAUTOTEST S9-02 Customer, {Work-order-1} is S2-15440 and {Part-sale-A} is P-1345.")]},
 "S9-09": {"Customer {Customer-A} holds the shop's own term {Term-A}, due 14 days after the invoice date, has a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order {Work-order-1}.":
             [("Customer {Customer-A} holds one of the shop's own terms, due 14 days after the invoice date, has a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order {Work-order-1}.",
               "For example: {Customer-A} is ZZAUTOTEST S9-09 Customer and {Work-order-1} is S2-15446.")]},
 "S10-02": {'The shop\'s own term {Term-A}, named "Net 10", is active.': [('The shop has its own active term named "Net 10".', None)]},
 "S10-09": {'The shop\'s own term {Term-A} is named "Net 10".': [('The shop has its own active term named "Net 10".', None)]},
 "S10-12": {'The shop\'s own term {Term-A} is named "Net 10".': [('The shop has its own active term named "Net 10".', None)]},
 "S10-13": {'The shop\'s own term {Term-A} is named "Net 10".': [('The shop has its own active term named "Net 10".', None)]},
 "S11-05": {"Customer {Customer-A} holds COD and work order {Work-order-1} for it is complete and ready to invoice.": [wo("COD", "S2-15440")]},
 "S11-06": {"Customers {Customer-A} on Due on Receipt and {Customer-B} on Net 30 each have a complete work order, {Work-order-1} and {Work-order-2}.":
             [("Work order {Work-order-1}, for a customer on Due on Receipt, and work order {Work-order-2}, for a customer on Net 30, are complete.",
               "For example: the work orders are S2-15441 and S2-15442.")]},
 "S11-10": {A1: [], "An organization {Organization-A} created after the release, never changed on the Credit Terms page, and you are its Admin.":
             [("You are signed in as an Admin of an organization created after the release whose Credit Terms page has never been changed.", "For example: the organization is ZZAUTOTEST S11-10 Shop.")]},
 "S11-11": {A1: [], "An organization {Organization-A} that has no settings record yet.":
             [("You are signed in as an Admin of an organization that has no settings record yet.", "For example: a newly migrated test organization.")]},
 "S11-12": {"Customer {Customer-A} holds Net 30 at {Location-A}, whose time zone has daylight saving time, and has a credit memo {Credit-memo-A} dated Oct 20, 2026.":
             [("Customer {Customer-A} holds Net 30 at {Location-A}, whose time zone has daylight saving time, and has a credit memo dated Oct 20, 2026.",
               "For example: {Customer-A} is ZZAUTOTEST S11-12 Customer and the credit memo is CM-3576.")]},
 "S11-20": {"Customer {Customer-A} holds Net 60, which is deactivated, and has an open invoice and an open work order {Work-order-1}.":
             [("Customer {Customer-A} holds Net 60, which is deactivated, and has an open invoice and an open work order {Work-order-1}, so look for customer A's entry in the report.",
               "For example: {Customer-A} is ZZAUTOTEST S11-20 Customer and {Work-order-1} is S2-15447.")]},
 "S12-18": {"You are signed in as {User-A}, whose role has no Settings → Finance.": [signed("whose role has no Settings → Finance", "the user is ZZAUTOTEST S12-18 User")]},
 "DATA-05": {"Customers {Customer-A}, {Customer-B} and {Customer-C} hold the shop's own terms {Term-A} (day 31 of the following month), {Term-B} (day 30) and {Term-C} (day 29).": [],
             "Work orders {Work-order-1}, {Work-order-2} and {Work-order-3}, for {Customer-A}, {Customer-B} and {Customer-C}, are complete and ready to invoice.":
             [("Work orders {Work-order-1}, {Work-order-2} and {Work-order-3} are complete and ready to invoice, for three customers who hold the shop's own terms due on day 31, day 30 and day 29 of the following month, in that order.",
               "For example: {Work-order-1} is S2-15440, {Work-order-2} is S2-15441 and {Work-order-3} is S2-15442.")]},
 "DATA-06b": {"Customers {Customer-A} and {Customer-B} hold the shop's own terms {Term-A} (day 28 of the following month) and {Term-B} (day 29).": [],
              "Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.":
             [("Work orders {Work-order-1} and {Work-order-2} are complete and ready to invoice, for two customers who hold the shop's own terms due on day 28 and day 29 of the following month, in that order.",
               "For example: {Work-order-1} is S2-15440 and {Work-order-2} is S2-15441.")]},
 "DATA-10": {"Customers {Customer-A} and {Customer-B} hold the shop's own terms {Term-A} (due 1 day after the invoice date) and {Term-B} (due 365 days after).": [],
             "Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.":
             [("Work order {Work-order-1}, for a customer on the shop's own term due 1 day after the invoice date, and work order {Work-order-2}, for a customer on the shop's own term due 365 days after, are complete and ready to invoice.",
               "For example: {Work-order-1} is S2-15440 and {Work-order-2} is S2-15441.")]},
 "DATA-13": {A1: [("You are an Admin user working at a location in another time zone than Edmonton's.", "For example: a location in Toronto.")],
             "The work order belongs to {Location-A}, in Edmonton's time zone, and you are working in a location in another time zone, {Location-B}.":
             [("The work order belongs to a location in Edmonton's time zone.", "For example: Staging Heavy Duty - 9919.")]},
 "DATA-16": {"Customer {Customer-A} holds COD and customer {Customer-B} holds Due on Receipt.": [],
             "Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.":
             [("Work order {Work-order-1}, for a customer who holds COD, and work order {Work-order-2}, for a customer who holds Due on Receipt, are complete and ready to invoice.",
               "For example: {Work-order-1} is S2-15440 and {Work-order-2} is S2-15441.")]},
 "DATA-17": {"Vendor {Vendor-A} holds Credit Hold and vendor {Vendor-B} holds Net 45.": [("Vendor {Vendor-B} holds Net 45.", "For example: {Vendor-B} is ZZAUTOTEST DATA-17 Forty Five.")],
             "A new vendor invoice {Vendor-invoice-A} for {Vendor-A} is open, not yet saved.":
             [("A new vendor invoice is open, not yet saved, for a vendor who holds Credit Hold.", "For example: the vendor is ZZAUTOTEST DATA-17 Held.")]},
 "DATA-18": {"You are working in {Location-A}; a delivery for vendor {Vendor-A} belongs to {Location-B}, in a time zone where the date is already one day later. Run the case at a time of day when the two dates differ.":
             [("Vendor {Vendor-A} holds Net 30.", "For example: {Vendor-A} is ZZAUTOTEST DATA-18 Vendor."),
              ("A delivery for vendor {Vendor-A} belongs to {Location-B}, in a time zone where the date is already one day later than where you work. Run the case at a time of day when the two dates differ.",
               "For example: you work in Edmonton and {Location-B} is in Auckland.")]},
 "DATA-20": {'A contacts import file with three new customers: {Customer-B} with the credit term text "NET 30", {Customer-C} with "net30" and {Customer-D} with {Term-A} written in capital letters.':
             [('A contacts import file with three new customers: {Customer-B} with the credit term text "NET 30", one with "net30" and one with {Term-A} written in capital letters.',
               "For example: {Customer-B} is ZZAUTOTEST DATA-20 Bravo and the others ZZAUTOTEST DATA-20 Charlie and Delta.")]},
 "DATA-21": {"Customer {Customer-A} and vendor {Vendor-A} were stored with a blank credit term before the release; COD's Customers count is {Count-A} and Vendors count {Count-B} with them included.":
             [("Customer {Customer-A} and a vendor were stored with a blank credit term before the release.",
               "For example: {Customer-A} is ZZAUTOTEST DATA-21 Blank and the vendor ZZAUTOTEST DATA-21 Blank Vendor."),
              ("Before you start, write down COD's Customers count ({Count-A}) and Vendors count ({Count-B}), with them included.", "For example: {Count-A} is 121 and {Count-B} is 768.")]},
 "DATA-22": {'Net 45 is held by {Count-A} vendors (written down). Vendor {Vendor-A} is stored with "NET 45" and vendor {Vendor-B} holds Net 45 and is inactive; both are in {Count-A}.':
             [('Vendor {Vendor-A} is stored with "NET 45" and another vendor holds Net 45 and is inactive.',
               "For example: {Vendor-A} is ZZAUTOTEST DATA-22 Upper and the inactive vendor ZZAUTOTEST DATA-22 Inactive."),
              ("Before you start, write down how many vendors hold Net 45 ({Count-A}, which includes vendor {Vendor-A} and the inactive vendor).", "For example: {Count-A} is 5.")]},
 "DATA-25": {'The shop\'s own term {Term-A}, due 20 days after the invoice date, is held by exactly five customers: {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D} and {Customer-E}; only {Customer-B} and {Customer-D} have "Fleet" in their names.':
             [('The shop\'s own term {Term-A}, due 20 days after the invoice date, is held by exactly five customers made for this test: {Customer-A}, {Customer-B}, {Customer-D} and two more; only {Customer-B} and {Customer-D} have "Fleet" in their names.',
               "For example: {Term-A} is ZZAUTOTEST DATA-25 N20 and they are ZZAUTOTEST DATA-25 Alpha, Bravo Fleet, Charlie, Delta Fleet and Echo.")]},
 "DATA-26": {"The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers, {Customer-A} and {Customer-B}.":
             [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers made for this test.", "For example: {Term-A} is ZZAUTOTEST DATA-26 N20, held by ZZAUTOTEST DATA-26 Alpha and Bravo.")]},
 "DATA-26b": {"The shop's own term {Term-A}, due 45 days after the invoice date, is held by exactly one customer, {Customer-C}.":
             [("The shop's own term {Term-A}, due 45 days after the invoice date, is held by exactly one customer made for this test.", "For example: {Term-A} is ZZAUTOTEST DATA-26b N45, held by ZZAUTOTEST DATA-26b Charlie.")]},
 "DATA-27": {"The shop's own term {Term-A} is held by no customer or vendor today. It was used by invoices {Invoice-A} (paid), {Invoice-B} (reversed) and {Invoice-C} (open), and by an estimate {Estimate-A} that was never invoiced; the customer was then moved to Net 30.":
             [("The shop's own term {Term-A} is held by no customer or vendor today. It was used by three invoices (one paid, one reversed and one open) and by an estimate that was never invoiced; the customer was then moved to Net 30.",
               "For example: {Term-A} is ZZAUTOTEST DATA-27 Fourteen and the records belong to ZZAUTOTEST DATA-27 Customer.")]},
 "D-46": {"The shop has its own active term {Term-A}, due on day 10 of the following month, held by 1 customer, {Customer-A}, and 2 vendors, {Vendor-A} and {Vendor-B}.":
             [("The shop has its own active term {Term-A}, due on day 10 of the following month, held by exactly 1 customer and 2 vendors.", "For example: {Term-A} is 10th of next month.")]},
 "D-48": {"You are signed in as {User-A}, working in {Location-A}, and the role of {User-A} has Settings → Finance but not Customers → Create & Edit.":
             [signed("whose role has Settings → Finance but not Customers → Create & Edit", "the user is ZZAUTOTEST D-48 Finance only")]},
 "D-39": {"You are signed in as {User-A}, working in {Location-A}, and the role of {User-A} can create customers but does not have View and Manage AP/AR Data.":
             [signed("whose role can create customers but does not have View and Manage AP/AR Data", "the user is ZZAUTOTEST D-39 No AP")]},
 "D-17": {"At least ten customers are on COD, among them {Customer-A} and {Customer-B}.":
             [("At least ten customers are on COD, among them {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST D-17 Alpha.")]},
 "D-32": {"The shop has its own active term {Term-A}, due on day 10 of the following month.": [], "{Vendor-A} is on {Term-A}.": [],
          "{Vendor-A} has a saved vendor invoice, {Vendor-invoice-A}, dated Oct 5, 2026.":
             [("Vendor invoice {Vendor-invoice-A}, dated Oct 5, 2026, is saved for a vendor who holds the shop's own term due on day 10 of the following month.",
               "For example: the vendor is ZZAUTOTEST D-32 Vendor on ZZAUTOTEST D-32 Tenth.")]},
 "D-43": {"The shop has its own active term {Term-A}, due 10 days after the invoice date.": [], "{Vendor-A} is on {Term-A}.": [],
          "{Vendor-A} has a saved vendor invoice, {Vendor-invoice-A}, dated Oct 5, 2026.":
             [("Vendor invoice {Vendor-invoice-A}, dated Oct 5, 2026, is saved for a vendor who holds the shop's own term due 10 days after the invoice date.",
               "For example: the vendor is ZZAUTOTEST D-43 Vendor on ZZAUTOTEST D-43 Ten.")]},
 "D-33": {"{Customer-A} is on {Term-A}.": [],
          "Work order {Work-order-1} for {Customer-A} was invoiced with the invoice date Oct 5, 2026.":
             [("Work order {Work-order-1} was invoiced with the invoice date Oct 5, 2026, for a customer who holds {Term-A}.", "For example: {Work-order-1} is S2-17610.")]},
 "D-44": {"The shop has its own active term {Term-A}, due on day 10 of the following month.": [], "{Customer-A} is on {Term-A}.": [],
          "Work order {Work-order-1} for {Customer-A} was invoiced with the invoice date Oct 28, 2026.":
             [("Work order {Work-order-1} was invoiced with the invoice date Oct 28, 2026, for a customer who holds the shop's own term due on day 10 of the following month.",
               "For example: {Work-order-1} is S2-17655.")]},
 "D-36": {"{Customer-A} is on Net 30 with a credit limit of {Amount-A} and a balance above it.": [],
          "Work order {Work-order-1} is open for {Customer-A}.":
             [("Work order {Work-order-1} is open, for a customer on Net 30 with a credit limit of {Amount-A} and a balance above it.", "For example: {Work-order-1} is S2-17322 and {Amount-A} is $500.00.")]},
}
# The same data-case shape (a work order ready to invoice for a customer on one term), written once: the "Customer {Customer-A} holds …"
# bullet is dropped and the work order names what its customer holds.
DATA_WO = {"DATA-01": "Net 30", "DATA-09": "Net 30", "DATA-11": "Net 30", "DATA-12": "Net 30", "DATA-14": "Net 30",
           "DATA-02": "the shop's own term due 10 days after the invoice date", "DATA-03": "the shop's own term due on day 10 of the following month",
           "DATA-07": "the shop's own term due on day 10 of the following month", "DATA-13": "the shop's own term due on day 10 of the following month",
           "DATA-15": "the shop's own term due on day 10 of the following month", "DATA-04": "the shop's own term due on day 31 of the following month",
           "DATA-06": "the shop's own term due on day 31 of the following month", "DATA-08": "the shop's own term due on day 1 of the following month"}


# Starting on a record's own page: the record is described once, unnamed, and the starting screen says "that customer" / "that vendor".
CP = "Starting screen: the customer page of {Customer-A}."
VP = "Starting screen: the vendor page of {Vendor-A}."
REPL.update({
 "S2-31": {"Customer {Customer-A} holds COD.": [],
           "Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-A}.":
             [("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for a customer who holds COD.", "For example: ZZAUTOTEST S2-31 Customer.")]},
 "S3-26": {"Customer {Customer-A} holds COD.": [],
           "Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-A}.":
             [("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for a customer who holds COD.", "For example: ZZAUTOTEST S3-26 Customer.")]},
 "S4-29": {"The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.":
             [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer made for this test.", "For example: {Term-A} is ZZAUTOTEST S4-29 N20, held by ZZAUTOTEST S4-29 Solo.")]},
 "S7-03": {"Vendor {Vendor-B} has a vendor invoice {Vendor-invoice-B} with no stored due date (from before the release).":
             [("Vendor invoice {Vendor-invoice-B}, for another vendor, has no stored due date (from before the release).", "For example: the vendor is ZZAUTOTEST S7-03 Old Vendor.")]},
 "D-25": {"{Customer-A} is on Net 45 with a credit limit of {Amount-A} and a balance above it.": [("A customer is on Net 45 with a credit limit of {Amount-A} and a balance above it.", "For example: ZZAUTOTEST D-25 Over, {Amount-A} is $500.00 and the balance is $600.00.")],
          CP: [("Starting screen: the customer page of that customer.", None)]},
 "D-27": {"{Customer-A} is on Net 50 with a credit limit of {Amount-A}, and Net 50 is deactivated.": [("A customer is on Net 50 with a credit limit of {Amount-A}.", "For example: ZZAUTOTEST D-27 Customer and {Amount-A} is $5,000.00."), ("Net 50 is deactivated.", None)],
          CP: [("Starting screen: the customer page of that customer.", None)]},
 "D-40": {"{Customer-A} is on Net 30 with a credit limit of {Amount-A}.": [("A customer made for this test is on Net 30 with a credit limit of {Amount-A}.", "For example: ZZAUTOTEST D-40 Customer and {Amount-A} is $5,000.00.")],
          CP: [("Starting screen: the customer page of that customer.", None)]},
 "D-28": {"{Customer-A} is on Net 50, and Net 50 is deactivated.": [("A customer is on Net 50.", "For example: ZZAUTOTEST D-28 Customer."), ("Net 50 is deactivated.", None)],
          CP: [("Starting screen: the customer page of that customer.", None)]},
 "D-41": {"{Customer-A} is on Net 30, and Net 50 is deactivated.": [("A customer is on Net 30.", "For example: ZZAUTOTEST D-41 Customer."), ("Net 50 is deactivated.", None)],
          CP: [("Starting screen: the customer page of that customer.", None)]},
 "D-30": {"{Vendor-A} is on Net 30.": [("A vendor is on Net 30.", "For example: ZZAUTOTEST D-30 Vendor.")], VP: [("Starting screen: the vendor page of that vendor.", None)]},
 "D-31": {"{Vendor-A} is on Net 50, and Net 50 is deactivated.": [("A vendor is on Net 50.", "For example: ZZAUTOTEST D-31 Vendor."), ("Net 50 is deactivated.", None)],
          VP: [("Starting screen: the vendor page of that vendor.", None)]},
})
REPL["S4-17"] = {"The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, whose record misses details Edit Customer would ask for (for example no address).":
    [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, whose record has no address (a detail Edit Customer requires).",
      "For example: {Term-A} is ZZAUTOTEST S4-17 N20 and {Customer-A} is ZZAUTOTEST S4-17 Incomplete.")]}
REPL["DATA-20"] = {"The shop's own term {Term-A} is held by no customer, and Net 30 is held by {Count-B} customers, written down before you start (the Counter Sale customer is never counted).":
    [("The shop's own term {Term-A} (made for this test) is held by no customer.", "For example: {Term-A} is ZZAUTOTEST DATA-20 Fourteen."),
     ("Before you start, write down how many customers hold Net 30 ({Count-B}; the Counter Sale customer is never counted).", "For example: {Count-B} is 40.")],
    **REPL["DATA-20"]}
REPL["S3-08"] = {"A new name {Term-A} that no term has, and a customer {Customer-A} and a vendor {Vendor-A}.":
    [("A new name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-08 Fourteen."),
     ("Customer {Customer-A} and vendor {Vendor-A} exist.", "For example: {Customer-A} is ZZAUTOTEST S3-08 Customer and {Vendor-A} is ZZAUTOTEST S3-08 Vendor.")]}
REPL["D-44"]["Work order {Work-order-1} for {Customer-A} was invoiced with the invoice date Oct 28, 2026."] = [
    ("A work order was invoiced with the invoice date Oct 28, 2026, for a customer who holds the shop's own term due on day 10 of the following month.", "For example: work order S2-17655.")]
REPL["D-44"]["Starting screen: work order {Work-order-1}."] = [("Starting screen: that work order.", None)]

NOTE_REPL = {
 "S12-18": "Such a user cannot reach the page or its menu. This part is for an automated check.",
 "D-10": "The design keeps the column headings above the line (question 9, register CT-D02); this case follows the PRD. The design's version is held separately until the PO answers.",
 "D-15": "Whether the blue line shows while only the Name is wrong is question 10 (CT-D03), held separately; this case types two wrong values, where design and PRD agree that no blue line shows.",
 "D-50": "Held: this is the design's wording; the PRD's wording differs. Released or deleted the day Chris Ward answers question 8 (register CT-D01).",
 "D-51": "Held: the design's version; the PRD says the line shows \"in place of the table\". Released or deleted when question 9 is answered (register CT-D02).",
 "D-52": "Held: the design's behaviour; under the PRD the blue line shows because the number is valid. Released or deleted when question 10 is answered (register CT-D03).",
 "D-53": "Held: one reading of the design's note; under the PRD no Name error shows until the user has typed in it. Released or deleted when question 11 is answered (register CT-D04).",
}
OTHER_TESTS = {  # what to expect in place of "(from other tests)"
 "Other terms of the shop (from other tests) may also be listed; the checks below are about the order of the named rows.":
   "Other terms may also be listed; check only the order of the named rows.",
 " Other shop terms (from other tests) may also be offered.": " Other terms of the shop may also be offered.",
}

import re
def apply(key, pre, note, steps=(), res=()):
    """pre: list of (state, example). Returns the new pre and note."""
    rep = dict(REPL.get(key, {}))
    if key in DATA_WO:
        rep.update({a: [] for a, _ in pre if a.startswith("Customer {Customer-A} holds")})
        rep[WO_READY] = [wo(DATA_WO[key], "S2-15440")]
    # the signed-in user and the custom role keep no name unless a step, a result or another precondition uses it
    later = " ".join(list(steps) + list(res) + [a for a, _ in pre[1:]])
    a0, b0 = pre[0]
    if a0.startswith("You are signed in as {User-A}") and "{User-A}" not in later and a0 not in rep:
        a1 = a0.replace("You are signed in as {User-A}, working in {Location-A}, and the role of {User-A} ", "You are signed in as a user whose role ")
        a1 = a1.replace("{User-A}, on a custom role, {Role-A}, ", "a user on a custom role ").replace("{User-A}, ", "a user ")
        if "{Role-A}" not in later: a1 = a1.replace(", {Role-A},", "")
        b1 = (b0 or "").replace("{User-A} is", "the user is").replace("{Role-A} is", "the role is").replace(" and {Location-A} is Staging Heavy Duty - 9919", "")
        rep[a0] = [(a1, b1 or None)]
    seen = set()
    out = []
    for a, b in pre:
        if a in rep:
            out += list(rep[a]); seen.add(a); continue
        for old, new in OTHER_TESTS.items():
            if old in a: a = a.replace(old, new)
        out.append((a, b))
    missing = set(rep) - seen
    if missing: raise KeyError(f"{key}: relevance replacement does not match any precondition: {sorted(missing)[0][:90]!r}")
    out = independence(key, out, steps, res)
    return out, NOTE_REPL.get(key, note)

# ---------------------------------------------------------------- independence (QA lead, 26 Oct 2026: "if one test case fails that does
# not block the other test case")
SETTINGS = {  # an organization-wide setting the case relies on, stated so an earlier failed test that left it changed cannot break it
 "S4-26": "Net 30 is active and is not the shop's default for new customers.",
 "S4-27": "Net 30 is active and is not the shop's default for new customers.",
 "S4-28": "Net 30 is active and is not the shop's default for new customers.",
}
NO_AUTO_STD = {"S11-04"}   # its precondition is an organization nobody has changed since the release: every standard term is active
CHANGES = re.compile(r'"(?:Deactivate|Reactivate|Delete Credit Term|Make Default|Make Default for New Customers|Move \d+ Customers?|Move \{n\} Customers|'
                     r'Set Limits To \$0 And Move|Create Credit Term|Save Changes|Save & Close|Save|Create)"|\bClick (?:Save|Create Invoice)\b|'
                     r'\bCreate Invoice\b|Reverse|Import the file|Receive the delivery|Resend|status to inactive|Save the vendor invoice|'
                     r'Send a (?:Public API request that (?:creates|updates)|save|move request)|\bclick Save\b')
KINDS = ("Term", "Customer", "Vendor", "Work-order", "Invoice", "Vendor-invoice", "Credit-memo", "Part-sale", "Estimate", "Asset")
FRESH = re.compile(r"\bnew\b|for this test|before the release|Counter Sale|[Oo]n production|built-in|^(?:A name|Names)\b")   # a name the steps use to create the record is new by definition
KW = {"Term": "term", "Customer": "customer", "Vendor": "vendor", "Work-order": "work order", "Invoice": "invoice", "Vendor-invoice": "vendor invoice",
      "Credit-memo": "credit memo", "Part-sale": "part sale", "Estimate": "estimate", "Asset": "asset"}
ALWAYS_FRESH = re.compile(r"before the release|Counter Sale|[Oo]n production|built-in|^(?:A name|Names|Choose)\b")
def is_fresh(bullet, name, kind):
    """True when the bullet says this record is new / made for this test (not merely that something else in the bullet is new)."""
    i = bullet.find(name)
    if i < 0: return bool(ALWAYS_FRESH.search(bullet))
    after = bullet[i + len(name):]
    if after.startswith(" (made for this test)") or bullet.startswith("Create "): return True
    clause = re.split(r"[.;]\s|, and |, but ", bullet[:i])[-1]
    whole = clause + name + re.split(r"[.;]\s|, and |, but ", after)[0]
    if ALWAYS_FRESH.search(whole) or re.match(r"^(?:A name|Names|Choose)\b", bullet): return True
    return bool(re.search(r"\bnew (?:\w+ ){0,2}" + kind + r"s?\b|" + kind + r"s? made for this test", clause + name))
NETS = re.compile(r"(?<![\w-])Net (?:7|15|20|30|45|50|60|90|120)(?![\w\d])")
def _join(xs): return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " and " + xs[-1]
def independence(key, pre, steps, res):
    pre = list(pre)
    states = " ".join(a for a, _ in pre)
    start = next((i for i, (a, _) in enumerate(pre) if a.startswith(("Starting screen", "If any record", "The browser window", "The design picture"))), len(pre))
    add = []
    # (2) every standard Net term a step or result needs is stated as active (unless the preconditions already state its state)
    if key not in NO_AUTO_STD and not re.search(r"standard terms? (?:are|is) active|every other standard term|All twelve", states):
        need = []
        for t in NETS.findall(" ".join(list(steps) + list(res))):
            if t not in need and not re.search(r"(?<![\w-])" + t + r"(?![\d])", states): need.append(t)
        if need: add.append((f"{_join(need)} {'is' if len(need) == 1 else 'are'} active.", None))
    if key in SETTINGS: add.append((SETTINGS[key], None))
    # (1) a record the case changes is made for this test
    if any(CHANGES.search(s) for s in steps):
        fresh = []
        for kind in KINDS:
            for ph in sorted(set(re.findall(r"\{" + kind + r"-[A-Z0-9]\}", " ".join(list(steps) + list(res))))):
                first = next((a for a, _ in pre if ph in a), "")
                if first and not is_fresh(first, ph, KW[kind]): fresh.append(ph)
        rest = []
        for ph in fresh:
            i = next(i for i, (a, _) in enumerate(pre) if ph in a)
            a, b = pre[i]
            m = re.match(r"^(?:Customer|Vendor) (\{[^}]+\})(?: and (?:customer|vendor) (\{[^}]+\}))? exists?(?: on (Net \d+))?(.*)\.$", a)
            if m and ph in (m.group(1), m.group(2)):
                who = _join([x for x in (m.group(1), m.group(2)) if x])
                pre[i] = (f"Create {who} for this test" + (f", on {m.group(3)}" if m.group(3) else "") + m.group(4) + ".", b); continue
            if re.search(re.escape(ph) + r" \(made for this test\)", a) or re.match(r"Create ", a): continue
            j = a.index(ph); before, after = a[:j], a[j + len(ph):]
            in_list = re.search(r"(\}, |\} and |\}, and )$", before) or re.match(r"(?:, | and |, and )\{", after)
            if not in_list:
                pre[i] = (before + ph + " (made for this test)" + after, b)
            else:
                rest.append(ph)
        if rest:
            add.append((f"Create {_join(rest)} just for this test, so no earlier test's changes affect {'it' if len(rest) == 1 else 'them'}.", None))
    return pre[:start] + add + pre[start:]
