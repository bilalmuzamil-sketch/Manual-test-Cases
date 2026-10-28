"""Tester read-through, 26 Oct 2026 (build/tester-readthrough-2026-10-26/WORKER-BRIEF.md).
QA lead, 26 Oct 2026: "The purpose of editing the test case is to make sure that the preconditions/steps/and expected behavior are related
and the one who is running the test cases as a manual QA tester may understand the test scenario." and "Make sure that your work does not
bite me". Every case was read as a tester who has never seen the feature; this module holds the fixes, applied to the TestRail form after
pattern.py (ct_lib.render). The exact quotes, their From lines, References from Design and the AUTOMATION line are never touched here; the
only quote added is listed in ADD_Q (check 3: a control the tester can see, backed by a PRD sentence).

Checks (brief): 1 clear setup (say what to create, a changed record is created for the test, setup order) · 2 no vague words · 3 a
"nothing happens" check proves its trigger ran · 4 one action per step, no repeats · 5 every precondition related, every result visible ·
6 understandable · 7 no "mark this test Blocked" line (fifteenth amendment; pattern.py no longer writes it) · 8 enrolment (A/R and A/P only).
"""
import re

# ---------------------------------------------------------------- precondition bullets, by exact text (every case that has it)
# old bullet -> (new bullets, checks, why)
NEWTERM = "Create a new term of the shop's own for this test, term A, "
PRE_MAP = {
 # check 1: a record the case changes or relies on is created for the test, in setup order, in the product's words
 "Make sure at least one term is deactivated, term A.":
   (["Make sure at least one term is deactivated; call it term A."], "6", "the record name read as part of the sentence"),
 "Make sure the shop's own terms A, B and C are held by exactly 1, 2 and 3 customers (new terms hold only this case's customers).":
   (["Create three new terms of the shop's own for this test: term A held by exactly 1 customer, term B by 2 and term C by 3."], "1,6",
    "said what to create; removed the internal wording \"this case's customers\""),
 "Make sure the shop's own terms A and B are held by exactly 1 and 2 vendors (new terms hold only this case's vendors).":
   (["Create two new terms of the shop's own for this test: term A held by exactly 1 vendor and term B by 2."], "1,6",
    "said what to create; removed the internal wording \"this case's vendors\""),
 "Make sure the shop's own term A, due 14 days after the invoice date, is the default for new customers.":
   (["Have the shop's own active term A, due 14 days after the invoice date, set as the default for new customers."], "1", "said what to have and set"),
 "Make sure the shop's own term A, due 14 days after the invoice date, is held by no customer and no vendor (it is new).":
   ([NEWTERM + "due 14 days after the invoice date, held by no customer and no vendor."], "1", "said what to create"),
 "Make sure the shop's own term A has a 31-character name, due 14 days after the invoice date, and is the default for new customers.":
   (["Have the shop's own active term A with a 31-character name, due 14 days after the invoice date, set as the default for new customers."], "1", "said what to have and set"),
 "Make sure the shop's own term A, due 14 days after the invoice date, is the default and is held by 2 customers.":
   (["Have the shop's own active term A, due 14 days after the invoice date, held by 2 customers and set as the default for new customers."], "1", "said what to have and set"),
 "Make sure the shop created two terms of its own: term A, due 14 days after the invoice date, and term B, due on the 10th of the following month. It has no other terms of its own.":
   (["Have exactly two terms of the shop's own and no others: term A, due 14 days after the invoice date, and term B, due on the 10th of the following month."], "1,6", "one plain sentence"),
 "Make sure the shop's own term A, due 14 days after the invoice date, is held by no customer and no vendor today, but one invoice was created with it (its customer was later moved to another term), so the term is still in use.":
   ([NEWTERM + "due 14 days after the invoice date.",
     "Create a customer for this test on term A, and create one invoice for that customer.",
     "Then change that customer's credit term to Net 30, so term A is held by no customer or vendor but is still in use by the invoice."],
    "1", "setup in the order a tester does it"),
 "Have the shop's own active term A (made for this test), due 14 days after the invoice date, held by no customer and no vendor today, but by five invoices created while their customer was on it (the customer was then moved to Net 30).":
   ([NEWTERM + "due 14 days after the invoice date.",
     "Create a customer for this test on term A, and create five invoices for that customer.",
     "Then change that customer's credit term to Net 30, so term A is held by no customer or vendor, only by the five invoices."],
    "1", "setup in the order a tester does it"),
 "Make sure the shop has its own term A (made for this test), due 14 days after the invoice date, deactivated and held by no customer, vendor or invoice.":
   ([NEWTERM + "due 14 days after the invoice date, held by no customer, vendor or invoice, and then deactivate it."], "1", "said what to create"),
 "Make sure the shop has its own term A (made for this test), due on day 10 of the following month, deactivated and still held by one customer.":
   ([NEWTERM + "due on day 10 of the following month, put one customer on it, and then deactivate it."], "1", "said what to create, in setup order"),
 "Make sure customer A (made for this test) holds COD, with a credit limit of $0.00.":
   (["Create customer A for this test, on COD with a credit limit of $0.00."], "1", "said what to create"),
 "Make sure Net 30 is held by customer A (made for this test) and by vendor A (made for this test).":
   (["Create customer A and vendor A for this test, both on Net 30."], "1", "said what to create"),
 "Make sure customer A (made for this test) holds COD.":
   (["Create customer A for this test, on COD."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test) has a 31-character name, due 14 days after the invoice date, and is unused.":
   ([NEWTERM + "with a 31-character name, due 14 days after the invoice date, held by no customer, vendor or invoice."], "1,2",
    "said what to create; \"unused\" made concrete"),
 "Choose a new name for it, term B (made for this test), that no term has.":
   (["Choose a new name for term A that no term has; call the new name term B."], "6", "a name is chosen, not made"),
 "Choose a new name for term B (made for this test), that no term has.":
   (["Choose a new name for term A that no term has; call the new name term B."], "6", "a name is chosen, not made"),
 "Choose a new name for term B (made for this test) that no term has.":
   (["Choose a new name for term A that no term has; call the new name term B."], "6", "a name is chosen, not made"),
 "Choose a new name for term B (made for this test).":
   (["Choose a new name for term A that no term has; call the new name term B."], "1,6", "a name is chosen, not made; it must be new"),
 "Choose a new name for term B (made for this test), also 31 characters.":
   (["Choose a new 31-character name for term A that no term has; call the new name term B."], "1,6", "a name is chosen, not made"),
 "Choose a new name for term A (made for this test) that no term has.":
   (["Choose a name that no term has for the new term, term A."], "6", "a name is chosen, not made"),
 "Choose a new name for term A (made for this test).":
   (["Choose a name that no term has for the new term, term A."], "1,6", "a name is chosen, not made; it must be new"),
 "Make sure the shop's own term B, due on day 5 of the following month, is deactivated.":
   (["Have the shop's own term B, due on day 5 of the following month, deactivated."], "1", "said what to have"),
 "Choose names for term A and term B that read like Net terms but are not standard terms.":
   (["Choose names for term A and term B that no term has and that start with \"Net\" and a number but are not a standard term (not Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90 or Net 120)."],
    "2", "\"read like Net terms\" made concrete"),
 "Make sure the shop's own term A, due 15 days after the invoice date, is held by exactly three customers, customer A, customer B and customer C (a new term holds only this case's customers), whose names are in that A to Z order, with credit limits of $500.00, $0.00 and $1,000.00.":
   ([NEWTERM + "due 15 days after the invoice date.",
     "Create customer A, customer B and customer C for this test on term A, with names in that A to Z order and credit limits of $500.00, $0.00 and $1,000.00."],
    "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure the shop's own term A (made for this test), due 15 days after the invoice date, is held by exactly three customers, customer A, customer B and customer C (a new term holds only this case's customers), whose names are in that A to Z order, with credit limits of $500.00, $0.00 and $1,000.00.":
   ([NEWTERM + "due 15 days after the invoice date.",
     "Create customer A, customer B and customer C for this test on term A, with names in that A to Z order and credit limits of $500.00, $0.00 and $1,000.00."],
    "1,4,6", "said what to create; removed \"this case's customers\"; the separate repeated create line is merged into it"),
 "Create customer A, customer B and customer C just for this test, so no earlier test's changes affect them.":
   ([], "4", "repeated the line above (now merged into it)"),
 "Make sure the shop's own term A, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers); one of them is customer B, the last word of whose name is in neither of the other two names.":
   ([NEWTERM + "due 15 days after the invoice date.",
     "Create three customers for this test on term A; one of them is customer B, and the last word of customer B's name is in neither of the other two names."],
    "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure Net 15 is held by at least one customer. Net 50 and the shop's own term A are deactivated, every other standard term is active, and the shop's own term B, due 10 days after the invoice date, is active. Other terms of the shop may also be offered.":
   (["Make sure at least one customer holds Net 15.", "Make sure Net 50 is deactivated and every other standard term is active.",
     "Have the shop's own term A, deactivated.", "Have the shop's own active term B, due 10 days after the invoice date.",
     "Other terms of the shop may also be offered; check only the order of the named terms."], "1,6", "one bullet held four set-ups; split"),
 "Make sure the shop's own term A (made for this test), due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers): customer A with a credit limit of $500.00, customer C with a credit limit of $1,000.00, and one more customer.":
   ([NEWTERM + "due 15 days after the invoice date.",
     "Create three customers for this test on term A: customer A with a credit limit of $500.00, customer C with a credit limit of $1,000.00, and one more."],
    "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create one customer for this test on term A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer, customer A (made for this test), with a $0.00 limit.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, with a credit limit of $0.00."], "1", "said what to create"),
 "Make sure customer A (made for this test) has a blank credit term (it counts under COD).":
   (["Have customer A, from before the release, whose credit term is blank (it counts under COD)."], "1",
    "a blank term can only come from before the release (an import or a new customer gets the default)"),
 "Make sure the shop's own term A (made for this test), due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers), with credit limits of $500.00, $0.00 and $1,000.00.":
   ([NEWTERM + "due 15 days after the invoice date.",
     "Create three customers for this test on term A, with credit limits of $500.00, $0.00 and $1,000.00."], "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held only by customer A (made for this test), with a $500.00 limit, and work order 1 (made for this test) for customer A is complete and ready to invoice.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, with a credit limit of $500.00.",
     "Create work order 1 for customer A, complete and ready to invoice."], "1", "said what to create, in setup order"),
 "Make sure COD is held by customer A (made for this test), with a $0.00 limit.":
   (["Create customer A for this test, on COD with a credit limit of $0.00."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers): customer A, customer C and one more customer.":
   ([NEWTERM + "due 15 days after the invoice date.", "Create three customers for this test on term A: customer A, customer C and one more."],
    "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure customer A has a phone number, an address and a sales representative set. Customer D (made for this test) holds Net 20.":
   (["Give customer A a phone number, an address and a sales representative.", "Create customer D for this test, on Net 20."], "1", "two set-ups in one bullet; split"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer, customer A (made for this test), whose record has no address (a detail Edit Customer requires).":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, with no address on its record (a detail Edit Customer requires)."],
    "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly two customers made for this test, one of them customer A.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create two customers for this test on term A, one of them customer A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer, customer A (made for this test), with a $500.00 limit.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, with a credit limit of $500.00."], "1", "said what to create"),
 "Make sure the shop's own term A, due 15 days after the invoice date, is held by exactly three customers made for this test (a new term holds only this case's customers), one of them customer B.":
   ([NEWTERM + "due 15 days after the invoice date.", "Create three customers for this test on term A, one of them customer B."], "1,6", "said what to create; removed \"this case's customers\""),
 "Make sure the shop's own term A has a 31-character name and is held by customer A, whose name is more than 60 characters long. Its other own term B also has a 31-character name.":
   (["Have the shop's own active term A with a 31-character name.", "Have the shop's own active term B, also with a 31-character name.",
     "Create customer A for this test on term A, with a name more than 60 characters long."], "1,6", "three set-ups in one bullet; split"),
 "Make sure the shop's own term A (made for this test), due 14 days after the invoice date, is deactivated and held by one customer, customer A (made for this test), and by no vendor or invoice.":
   ([NEWTERM + "due 14 days after the invoice date.", "Create customer A for this test on term A (no vendor or invoice uses term A).",
     "Then deactivate term A."], "1", "said what to create, in setup order"),
 "Make sure customer A (made for this test) holds Credit Hold, with a $0.00 limit (other customers may hold Credit Hold too).":
   (["Create customer A for this test, on Credit Hold with a credit limit of $0.00 (other customers may hold Credit Hold too)."], "1", "said what to create"),
 "Sign in as a user on a custom role that has only Settings → Finance (no Customers → Create & Edit, no View and Manage AP/AR Data) (and whatever it needs to reach Settings), and nothing else that matters here.":
   (["Sign in as a user whose custom role has the Settings page with \"Finance\" on, the \"Customers\" row's \"Create & Edit\" off and the \"View and Manage AP/AR Data\" toggle off."],
    "2", "\"whatever it needs\" and \"nothing else that matters here\" replaced by the exact toggles"),
 "Sign in as a user on a custom role that has Settings → Finance and Customers → Create & Edit, but not View and Manage AP/AR Data (and whatever it needs to reach Settings), and nothing else that matters here.":
   (["Sign in as a user whose custom role has the Settings page with \"Finance\" on, the \"Customers\" row's \"Create & Edit\" on and the \"View and Manage AP/AR Data\" toggle off."],
    "2", "\"whatever it needs\" and \"nothing else that matters here\" replaced by the exact toggles"),
 "Sign in as a user on a custom role that has Settings → Finance and View and Manage AP/AR Data, but not Customers → Create & Edit (and whatever it needs to reach Settings), and nothing else that matters here.":
   (["Sign in as a user whose custom role has the Settings page with \"Finance\" on, the \"View and Manage AP/AR Data\" toggle on and the \"Customers\" row's \"Create & Edit\" off."],
    "2", "\"whatever it needs\" and \"nothing else that matters here\" replaced by the exact toggles"),
 "Sign in as a user on a custom role that has Settings → Finance, Customers → Create & Edit and View and Manage AP/AR Data (and whatever it needs to reach Settings), and nothing else that matters here.":
   (["Sign in as a user whose custom role has the Settings page with \"Finance\" on, the \"Customers\" row's \"Create & Edit\" on and the \"View and Manage AP/AR Data\" toggle on."],
    "2", "\"whatever it needs\" and \"nothing else that matters here\" replaced by the exact toggles"),
 "Make sure Net 30 is held by at least one customer, and the shop's own term A by none.":
   (["Make sure at least one customer holds Net 30.", "Have the shop's own active term A, held by no customer."], "1", "two set-ups in one bullet; split"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer made for this test.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create one customer for this test on term A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly two customers, customer A and customer B.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A and customer B for this test on term A."], "1,4", "said what to create; the separate repeated create line is merged into it"),
 "Create customer A and customer B just for this test, so no earlier test's changes affect them.":
   ([], "4", "repeated the line above (now merged into it)"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly one customer, customer A (made for this test).":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 60 days after the invoice date, is deactivated and held only by customer A (made for this test).":
   ([NEWTERM + "due 60 days after the invoice date.", "Create customer A for this test on term A.", "Then deactivate term A."], "1", "said what to create, in setup order"),
 "Make sure customer A (made for this test) is stored with the text \"NET 30\" (from an old import).":
   (["Have customer A, from before the release, stored with the credit term text \"NET 30\" (from an old import)."], "1",
    "such a spelling can only come from before the release (an import now saves the term's own spelling)"),
 "Make sure Net 50 is deactivated and every other standard term is active. The shop's own active terms include term A (due 10 days after the invoice date) and term B (due on day 5 of the following month), and its own term C is deactivated. Other terms of the shop may also be offered.":
   (["Make sure Net 50 is deactivated and every other standard term is active.",
     "Have the shop's own active terms A (due 10 days after the invoice date) and B (due on day 5 of the following month).",
     "Have the shop's own term C, deactivated.", "Other terms of the shop may also be offered; check only the order of the named terms."],
    "1,6", "one bullet held four set-ups; split"),
 "Make sure customer A (made for this test) holds Net 60, which is deactivated, and has an invoice A (made for this test) created after Net 60 was deactivated.":
   (["Create customer A for this test, on Net 60.", "Then make sure Net 60 is deactivated.",
     "Create invoice A for customer A (invoice one of customer A's complete work orders) after Net 60 was deactivated."], "1", "setup in the order a tester does it"),
 "Make sure customer A (made for this test) holds Net 60, which is deactivated.":
   (["Create customer A for this test, on Net 60.", "Then make sure Net 60 is deactivated."], "1", "setup in the order a tester does it"),
 "Make sure work order 1 has an estimate and an invoice, for a customer who holds the shop's own term A, which has a 31-character name.":
   (["Have the shop's own term A with a 31-character name.", "Have work order 1, with an estimate and an invoice, for a customer who holds term A."], "1", "setup in the order a tester does it"),
 "Make sure the shop's own term A has a 31-character name and is the default; its own term B also has a 31-character name, is deactivated and is held by customer A.":
   (["Have the shop's own active term A with a 31-character name, set as the default for new customers.",
     "Have the shop's own term B, also with a 31-character name, held by customer A.", "Then make sure term B is deactivated."], "1,6", "three set-ups in one bullet; split"),
 "Make sure customer A (made for this test) holds Net 45 with a credit limit of $900.00.":
   (["Create customer A for this test, on Net 45 with a credit limit of $900.00."], "1", "said what to create"),
 "Make sure the shop's own term A, due 14 days after the invoice date, is the default.":
   (["Have the shop's own active term A, due 14 days after the invoice date, set as the default for new customers."], "1", "said what to have and set"),
 "Make sure the shop's own term A, due 10 days after the invoice date, is the default for new customers. Its own term B, due on day 5 of the following month, is active. Net 50 is deactivated and every other standard term is active. Other terms of the shop may also be offered.":
   (["Have the shop's own active term A, due 10 days after the invoice date, set as the default for new customers.",
     "Have the shop's own active term B, due on day 5 of the following month.", "Make sure Net 50 is deactivated and every other standard term is active.",
     "Other terms of the shop may also be offered; check only the order of the named terms."], "1,6", "one bullet held four set-ups; split"),
 "Make sure vendor A (made for this test) holds Net 60, which is deactivated. Vendor B (made for this test) holds Net 30.":
   (["Create vendor A for this test, on Net 60.", "Then make sure Net 60 is deactivated.", "Create vendor B for this test, on Net 30."], "1", "setup in the order a tester does it"),
 "Make sure vendor A (made for this test) holds COD with a credit limit of $2,000.00.":
   (["Create vendor A for this test, on COD with a credit limit of $2,000.00."], "1", "said what to create"),
 "Make sure the shop's own term A has a 31-character name, is deactivated and is held by vendor A; its own term B also has a 31-character name and is active.":
   (["Have the shop's own term A with a 31-character name, held by vendor A.", "Then make sure term A is deactivated.",
     "Have the shop's own active term B, also with a 31-character name."], "1,6", "three set-ups in one bullet; split"),
 "Make sure customer A (made for this test) holds Net 30 and has an invoice A (made for this test) dated Oct 5, 2026, due Nov 4, 2026, showing Terms Net 30.":
   (["Create customer A for this test, on Net 30.", "Create invoice A for customer A, dated Oct 5, 2026 (due Nov 4, 2026, Terms Net 30)."], "1", "said what to create"),
 "Make sure Invoice A (made for this test), dated Oct 5, 2026, due Nov 4, 2026, showing Terms Net 30, belongs to a customer who holds Net 30.":
   (["Create a customer for this test on Net 30, with invoice A dated Oct 5, 2026 (due Nov 4, 2026, Terms Net 30)."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held only by customer A (made for this test), who has an invoice A (made for this test) dated Oct 5, 2026, due Oct 25, 2026, showing Terms term A.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, with invoice A dated Oct 5, 2026 (due Oct 25, 2026, Terms term A)."],
    "1", "said what to create"),
 "Make sure vendor A (made for this test) holds Net 30 and has a vendor invoice A (made for this test) dated Oct 5, 2026, stored due Nov 4, 2026.":
   (["Create vendor A for this test, on Net 30, with vendor invoice A dated Oct 5, 2026 (stored due date Nov 4, 2026)."], "1", "said what to create"),
 "Make sure Invoice A, dated Oct 5, 2026, at the test location, belongs to a customer who holds one of the shop's own terms, due on day 10 of the following month.":
   (["Have invoice A, dated Oct 5, 2026, at the test location, for a customer who holds one of the shop's own terms, due on day 10 of the following month."], "1", "said what to have"),
 "Make sure a second user, user B, without Settings → Finance, works in location B.":
   (["Have a second user, user B, whose role has no Settings → Finance, signed in at location B in a second browser."], "1",
    "step 4 acts in user B's browser, which the setup never opened"),
 "Make sure work order 1 (made for this test) is complete and ready to invoice (every part received, review done), for a customer who holds the shop's own term A (made for this test), due 14 days after the invoice date.":
   ([NEWTERM + "due 14 days after the invoice date.",
     "Create work order 1 for this test, complete and ready to invoice (every part received, review done), for a customer on term A."],
    "1", "said what to create, in setup order"),
 "Make sure term A is deactivated.": (["Then deactivate term A."], "1", "setup order"),
 "Make sure work order 1 (made for this test) has an invoice dated Oct 5, 2026, created on Net 30 (due Nov 4, 2026); its customer has since been moved to Net 60.":
   (["Create a customer for this test, on Net 30.",
     "Create work order 1 for that customer and invoice it with the invoice date Oct 5, 2026 (due Nov 4, 2026, Terms Net 30).",
     "Then change that customer's credit term to Net 60, so the customer's term now differs from the invoice's."], "1", "setup in the order a tester does it"),
 "Make sure customer B (made for this test) holds the shop's own term A (made for this test), due on day 10 of the following month.":
   ([NEWTERM + "due on day 10 of the following month.", "Create customer B for this test, on term A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 14 days after the invoice date, is not in QuickBooks' Terms list.":
   ([NEWTERM + "due 14 days after the invoice date (it is not yet in QuickBooks' Terms list)."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due on day 10 of the following month, is not in QuickBooks.":
   ([NEWTERM + "due on day 10 of the following month (it is not yet in QuickBooks)."], "1", "said what to create"),
 "Make sure work orders 1 and 2 are complete, both for one customer who holds term A.":
   (["Create work order 1 and work order 2 for this test, both complete, for one customer who holds term A."], "1,4", "said what to create; the separate repeated create line is merged into it"),
 "Create work order 1 and work order 2 just for this test, so no earlier test's changes affect them.":
   ([], "4", "repeated the line above (now merged into it)"),
 "Make sure QuickBooks already has a term named term A (made for this test), set as a standard term due in 20 days. In ShopView, term A is one of the shop's own terms, due 14 days after the invoice date.":
   ([NEWTERM + "due 14 days after the invoice date.", "In QuickBooks, create a term with exactly term A's name, as a standard term due in 20 days."],
    "1", "two set-ups in one bullet; split, in setup order"),
 "Make sure vendor A holds the shop's own term A, due 14 days after the invoice date, not yet in QuickBooks; a vendor invoice A for it, dated Oct 5, 2026, is stored due Oct 19, 2026 and not yet sent.":
   ([NEWTERM + "due 14 days after the invoice date (it is not yet in QuickBooks).", "Create vendor A for this test, on term A.",
     "Create vendor invoice A for vendor A, dated Oct 5, 2026 (stored due date Oct 19, 2026), and do not send it to QuickBooks yet."],
    "1", "three set-ups in one bullet; split, in setup order"),
 "Make sure customer A (made for this test) holds Net 30 and is already in QuickBooks with terms Net 30; work order 1 (made for this test) for it is complete.":
   (["Create customer A for this test, on Net 30, and make sure it is in QuickBooks with terms Net 30.",
     "Create work order 1 for customer A, complete."], "1", "two set-ups in one bullet; split"),
 "Make sure the shop's own term A (made for this test) is already in QuickBooks (an invoice used it).":
   (["Have the shop's own active term A (made for this test), already in QuickBooks' Terms list because an invoice with term A has synced."], "1", "said what to have"),
 "Make sure the shop's own term B (made for this test), due 14 days after the invoice date, is held by nobody and is not in QuickBooks.":
   (["Create a new term of the shop's own for this test, term B, due 14 days after the invoice date, held by nobody (so it is not in QuickBooks)."], "1", "said what to create"),
 "Make sure Invoice A has been sent, for a customer who holds the shop's own term A.":
   (["Have invoice A, already sent, for a customer who holds the shop's own term A."], "1", "said what to have"),
 "Make sure customer A holds Net 30, has a credit limit of $500.00 and unpaid invoices totalling $600.00.":
   (["Have customer A on Net 30, with a credit limit of $500.00 and unpaid invoices totalling $600.00."], "1", "said what to have"),
 "Make sure a customer holds Net 30, has a credit limit of $500.00, unpaid invoices totalling $600.00, an open work order 1 and an open part sale A.":
   (["Have a customer on Net 30, with a credit limit of $500.00, unpaid invoices totalling $600.00, an open work order 1 and an open part sale A."], "1", "said what to have"),
 "Make sure customer A holds Net 30 with a credit limit of $0.00, and customer B holds Net 30 with a blank limit; each has unpaid invoices totalling $600.00 and an open work order, work order 1 and work order 2.":
   (["Have customer A on Net 30, with a credit limit of $0.00, unpaid invoices totalling $600.00 and an open work order 1.",
     "Have customer B on Net 30, with a blank credit limit, unpaid invoices totalling $600.00 and an open work order 2."], "1,6", "two customers in one bullet; split"),
 "Make sure customer A holds COD, keeps a credit limit of $1,000.00 stored from before the release, has unpaid invoices totalling $1,500.00 and an open work order 1.":
   (["Have customer A on COD, still holding a credit limit of $1,000.00 stored from before the release, with unpaid invoices totalling $1,500.00 and an open work order 1."], "1", "said what to have"),
 "Make sure customer A holds Due on Receipt with a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order 1.":
   (["Have customer A on Due on Receipt, with a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order 1."], "1", "said what to have"),
 "Make sure customer A holds Credit Hold, keeps a credit limit of $1,000.00 from before the release, has unpaid invoices totalling $1,500.00 and a complete work order 1.":
   (["Have customer A on Credit Hold, still holding a credit limit of $1,000.00 from before the release, with unpaid invoices totalling $1,500.00 and a complete work order 1."], "1", "said what to have"),
 "Make sure customer A has a blank credit term (stored before the release), a credit limit of $500.00 from before the release and unpaid invoices totalling $600.00.":
   (["Have customer A, from before the release, with a blank credit term, a credit limit of $500.00 and unpaid invoices totalling $600.00."], "1", "said what to have"),
 "Make sure customer A holds one of the shop's own terms, due 14 days after the invoice date, has a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order 1.":
   (["Have customer A on one of the shop's own terms, due 14 days after the invoice date, with a credit limit of $500.00, unpaid invoices totalling $600.00 and an open work order 1."], "1", "said what to have"),
 "Make sure customer A holds Net 30 with a credit limit of $500.00 and unpaid invoices totalling exactly $500.00; customer B holds Net 30 with a $500.00 limit and unpaid invoices totalling $500.01.":
   (["Have customer A on Net 30, with a credit limit of $500.00 and unpaid invoices totalling exactly $500.00.",
     "Have customer B on Net 30, with a credit limit of $500.00 and unpaid invoices totalling $500.01."], "1,6", "two customers in one bullet; split"),
 "Make sure the shop's own term A (made for this test), due 14 days after the invoice date, is the default for new customers.":
   ([NEWTERM + "due 14 days after the invoice date, and make it the default for new customers."], "1", "said what to create and set"),
 "Make sure the shop's own term A (made for this test) is the default for new customers.":
   ([NEWTERM + "due 14 days after the invoice date, and make it the default for new customers."], "1", "said what to create and set"),
 "Make sure customer A holds COD and keeps a credit limit of $1,000.00 stored from before the release.":
   (["Have customer A, from before the release, on COD with a credit limit of $1,000.00 still stored."], "1", "said what to have"),
 "Make sure the organization existed before the release, and its default has never been changed: the Credit Terms Log holds no \"Default changed\" row.":
   (["Use an organization that existed before the release and whose default for new customers nobody has changed since."], "5",
    "the precondition stated the result that step 3 checks"),
 "Make sure work order 1 (made for this test), for a customer on Due on Receipt, and work order 2 (made for this test), for a customer on Net 30, are complete.":
   (["Create work order 1 for this test, complete, for a customer on Due on Receipt.", "Create work order 2 for this test, complete, for a customer on Net 30."],
    "1,6", "two set-ups in one bullet; split"),
 "Make sure customer A holds Net 30 at the test location, whose time zone has daylight saving time, and has a credit memo dated Oct 20, 2026.":
   (["Make sure the test location's time zone has daylight saving time.", "Have customer A on Net 30 at the test location, with a credit memo dated Oct 20, 2026."],
    "1,6", "two set-ups in one bullet; split"),
 "Make sure customer A is stored with the text \"NET 30\".":
   (["Have customer A, from before the release, stored with the credit term text \"NET 30\"."], "1",
    "such a spelling can only come from before the release (an import now saves the term's own spelling)"),
 "Make sure the organization uses AccountingHub; before the case, the Payment Terms list in Accounting Settings was written down.":
   (["Make sure the organization uses AccountingHub.", "Before you start, write down AccountingHub's Payment Terms list (Accounting Settings, Payment Terms)."],
    "1,6", "two set-ups in one bullet; split"),
 "Make sure customer A (made for this test) holds Net 30.":
   (["Create customer A for this test, on Net 30."], "1", "said what to create"),
 "Make sure customer A holds Net 60, which is deactivated, and has an open invoice and an open work order 1, so look for customer A's entry in the report.":
   (["Have customer A on Net 60, with an open invoice and an open work order 1, so customer A is on the report.",
     "Then make sure Net 60 is deactivated."], "1,6", "setup order; the instruction to look moved out of the setup"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly three customers.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create three customers for this test on term A."], "1", "said what to create"),
 "Make sure the log holds rows for several events, including at least one \"Default changed\" row and one row whose Details mention Net 45.":
   (["Make sure the log holds at least one \"Default changed\" row (if it does not, make another term the default and then make the earlier default the default again).",
     "Make sure the log holds at least one row you made whose Details mention Net 45 (if it does not, deactivate Net 45 and then reactivate it)."],
    "1", "said how to get the rows the steps search for, including one made by you (step 5)"),
 "Make sure the shop's own term A (made for this test) has a 31-character name.":
   ([NEWTERM + "with a 31-character name, held by no customer, vendor or invoice."], "1",
    "said what to create; it must be unused or Edit is greyed"),
 "Make sure vendor A (made for this test) holds Net 30.":
   (["Create vendor A for this test, on Net 30."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held only by customer A (made for this test), who is in QuickBooks with terms term A.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create customer A for this test on term A, and make sure it is in QuickBooks with terms term A."],
    "1", "said what to create, in setup order"),
 "Make sure customer A and a vendor were stored with a blank credit term before the release.":
   (["Have customer A and a vendor, both from before the release, with a blank credit term."], "1", "said what to have"),
 "Make sure customer A has an asset, asset A (made for this test).":
   (["Create an asset for customer A for this test, asset A."], "1", "said what to create"),
 # DATA and DESIGN
 "Make sure work orders 1, 2 and 3 are complete and ready to invoice, for three customers who hold the shop's own terms due on day 31, day 30 and day 29 of the following month, in that order.":
   (["Have work order 1, complete and ready to invoice, for a customer on the shop's own term due on day 31 of the following month.",
     "Have work order 2, complete and ready to invoice, for a customer on the shop's own term due on day 30 of the following month.",
     "Have work order 3, complete and ready to invoice, for a customer on the shop's own term due on day 29 of the following month."], "1,6", "three set-ups in one bullet; split"),
 "Make sure work orders 1 and 2 are complete and ready to invoice, for two customers who hold the shop's own terms due on day 28 and day 29 of the following month, in that order.":
   (["Have work order 1, complete and ready to invoice, for a customer on the shop's own term due on day 28 of the following month.",
     "Have work order 2, complete and ready to invoice, for a customer on the shop's own term due on day 29 of the following month."], "1,6", "two set-ups in one bullet; split"),
 "Make sure work order 1, for a customer on the shop's own term due 1 day after the invoice date, and work order 2, for a customer on the shop's own term due 365 days after, are complete and ready to invoice.":
   (["Have work order 1, complete and ready to invoice, for a customer on the shop's own term due 1 day after the invoice date.",
     "Have work order 2, complete and ready to invoice, for a customer on the shop's own term due 365 days after the invoice date."], "1,6", "two set-ups in one bullet; split"),
 "Make sure work order 1, for a customer who holds COD, and work order 2, for a customer who holds Due on Receipt, are complete and ready to invoice.":
   (["Have work order 1, complete and ready to invoice, for a customer on COD.", "Have work order 2, complete and ready to invoice, for a customer on Due on Receipt."],
    "1,6", "two set-ups in one bullet; split"),
 "Make sure the work order belongs to the test location, whose time zone has daylight saving time.":
   (["Make sure the test location's time zone has daylight saving time."], "1,6", "named the setting, not \"the work order\" before it was set up"),
 "Make sure the work order belongs to the test location, which has no time zone set.":
   (["Make sure the test location has no time zone set."], "1,6", "named the setting, not \"the work order\" before it was set up"),
 "Make sure a delivery for vendor A belongs to location B, in a time zone where the date is already one day later than where you work. Run the case at a time of day when the two dates differ.":
   (["Have a delivery for vendor A, not yet received, at location B, a location whose time zone is already one day later than where you work.",
     "Run the case at a time of day when the two dates differ."], "1,6", "two instructions in one bullet; split"),
 "Make sure the shop's own term A (made for this test) is held by no customer.":
   ([NEWTERM + "held by no customer."], "1", "said what to create"),
 "Before you start, write down COD's Customers count (number A) and Vendors count (number B), with them included.":
   (["Before you start, write down COD's Customers count (number A) and Vendors count (number B); they include customer A and that vendor."], "6", "\"with them included\" said plainly"),
 "Make sure vendor A (made for this test) is stored with \"NET 45\" and another vendor holds Net 45 and is inactive.":
   (["Have vendor A, from before the release, stored with the credit term text \"NET 45\".", "Make sure another vendor holds Net 45 and is inactive."],
    "1,6", "such a spelling can only come from before the release (a vendor import now saves the term's own spelling); two set-ups split"),
 "Make sure three of the customers on Net 15 are customer A, customer B and customer C.":
   (["Create customer A, customer B and customer C for this test, all on Net 15."], "1,4", "said what to create; the separate repeated create line is merged into it"),
 "Make sure the shop's own term A, due 20 days after the invoice date, is held by exactly five customers made for this test: customer A, customer B, customer D and two more; only customer B and customer D have \"Fleet\" in their names.":
   ([NEWTERM + "due 20 days after the invoice date.",
     "Create five customers for this test on term A: customer A, customer B, customer D and two more; only customer B and customer D have \"Fleet\" in their names."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 20 days after the invoice date, is held by exactly two customers made for this test.":
   ([NEWTERM + "due 20 days after the invoice date.", "Create two customers for this test on term A."], "1", "said what to create"),
 "Make sure the shop's own term A (made for this test), due 45 days after the invoice date, is held by exactly one customer made for this test.":
   ([NEWTERM + "due 45 days after the invoice date.", "Create one customer for this test on term A."], "1", "said what to create"),
 "Make sure the shop's own term A is held by no customer or vendor today. It was used by three invoices (one paid, one reversed and one open) and by an estimate that was never invoiced; the customer was then moved to Net 30.":
   ([NEWTERM + "due 14 days after the invoice date.",
     "Create a customer for this test on term A, with three invoices on term A (pay one, reverse one, leave one open) and an estimate that is never invoiced.",
     "Then change that customer's credit term to Net 30, so term A is held by no customer or vendor."], "1", "setup in the order a tester does it"),
 "Make sure a customer is on Net 45 with a credit limit of $500.00 and a balance above it.":
   (["Have a customer on Net 45, with a credit limit of $500.00 and unpaid invoices totalling more than $500.00."], "2", "\"a balance above it\" made concrete"),
 "Make sure customer A is on Net 50, and Net 50 is deactivated.":
   (["Have customer A on Net 50.", "Then make sure Net 50 is deactivated."], "1", "setup order"),
 "Make sure vendor A is on Net 50, and Net 50 is deactivated.":
   (["Have vendor A on Net 50.", "Then make sure Net 50 is deactivated."], "1", "setup order"),
 "Make sure customer A (made for this test) is on COD with a $0.00 credit limit and an unpaid balance.":
   (["Create customer A for this test, on COD with a $0.00 credit limit and an unpaid balance."], "1", "said what to create"),
 "Make sure work order 1 is open, for a customer on Net 30 with a credit limit of $500.00 and a balance above it.":
   (["Have an open (not yet invoiced) work order 1 for a customer on Net 30, with a credit limit of $500.00 and unpaid invoices totalling more than $500.00."],
    "2", "\"open\" and \"a balance above it\" made concrete"),
 "Make sure a customer made for this test is on Net 30 with a credit limit of $5,000.00.":
   (["Create a customer for this test, on Net 30 with a credit limit of $5,000.00."], "1", "said what to create"),
 "Make sure work order 1 was invoiced with the invoice date Oct 5, 2026, for a customer who holds term A.":
   (["Have work order 1, invoiced with the invoice date Oct 5, 2026, for a customer who holds term A."], "1", "said what to have"),
 "Make sure a work order was invoiced with the invoice date Oct 28, 2026, for a customer who holds the shop's own term due on day 10 of the following month.":
   (["Have a work order, invoiced with the invoice date Oct 28, 2026, for a customer who holds the shop's own term due on day 10 of the following month."], "1", "said what to have"),
}
# Pattern rules for families of bullets (old regex -> replacement), applied when no exact entry matches
PRE_RX = [
 (re.compile(r"^Make sure work order 1 \(made for this test\) is complete(.*)$"), r"Create work order 1 for this test, complete\1", "1", "said what to create"),
 (re.compile(r"^Make sure work order 1 is complete(.*)$"), r"Have work order 1, complete\1", "1", "said what to have"),
]
BLOCKED_RX = re.compile(r"mark this test Blocked|If you cannot set up any of the above|If any record above is missing", re.I)

# ---------------------------------------------------------------- per-case fixes
# key -> dict(pre_add=[(after_text_or_None, [bullets])], pre_drop=[text], start=..., steps=[...], results=[[...]], res={n: [...]},
#             step={n: text}, note=..., checks="..", why="..")
CASE = {
 "S1-18": dict(res={1: ["It reads term A's name followed directly by a \"Default\" tag (no info or lock icon).",
                        "COD shows its info and lock icons and no \"Default\" tag.", "Term A is the only row with the tag."]},
               checks="6", why="\"the name term A\" read as a literal text"),
 "S1-19": dict(res={1: ["Both cells read \"0\" (not blank, not a dash), right aligned in their columns.",
                        "Net 30's Customers count is right aligned, its last digit lined up with the 0 of the term A row."]},
               checks="5,6", why="\"The count\" did not say which count (the Net 30 row the setup asks for)"),
 "S1-22": dict(pre_replace={"Have the Credit Terms page's web address, copied earlier from an Admin's browser.":
                            ["Have the web addresses of the Credit Terms page and of the Payment Methods page, copied earlier from an Admin's browser."]},
               steps=["Look at the Settings menu.", "Paste the Credit Terms page's web address into the browser's address bar.", "Press Enter.",
                      "Paste the Payment Methods page's web address into the browser's address bar.", "Press Enter."],
               results=[["There is no Finance group (or it has no items), so neither \"Payment Methods\" nor \"Credit Terms\" shows."],
                        ["The address is in the address bar."],
                        ["The Credit Terms page does not show.", "No \"New Credit Term\" button is reachable."],
                        ["The address is in the address bar."],
                        ["The app behaves exactly as in step 3 (the same redirect or not-found page): this user is kept out of Payment Methods the same way as out of Credit Terms."]],
               checks="5", why="the result compared with opening the Payment Methods address, which no step did; the two steps and the address are added"),
 "S1-32": dict(start="Start on the Settings page.", steps=["Look at the Finance group of the Settings menu.", "Open the Customers page.", "Click \"New Customer\"."],
               results=[["\"Credit Terms\" does not show (the role does not have Settings, Finance)."], ["The Customers page opens."],
                        ["New Customer shows the \"Credit Terms\" and \"Credit Limit\" fields (the role has View and Manage AP/AR Data)."]],
               checks="4,5", why="\"Click New Customer\" came straight after opening the Settings menu, where there is no such button; a step opens the Customers page"),
 "S1-33": "S1-32", "S1-34": "S1-32",
 "S2-07": dict(res={1: ["The Inactive tab shows Net 50."]}, checks="6", why="\"the term\" named"),
 "S2-17": dict(res={1: ["The Inactive tab shows term A."]}, checks="6", why="\"the term\" named"),
 "S2-18": dict(res={1: ["The Inactive tab shows term A."]}, checks="6", why="\"the term\" named"),
 "S2-31": dict(pre_add=["Create customer A for this test, on COD."],
               start="Start with your browser showing the Credit Terms page and user B's browser showing Edit Customer for customer A.",
               res={4: ["Customer A is saved on term A."]}, checks="1", why="user B saves a customer onto term A, but the customer was any existing one; it is now created for this test"),
 "S3-26": dict(pre_add=["Create customer A for this test, on COD."],
               start="Start with your browser showing the Credit Terms page and user B's browser showing Edit Customer for customer A.",
               res={5: ["Customer A is saved on term A."]}, checks="1", why="user B saves a customer onto term A, but the customer was any existing one; it is now created for this test"),
 "S3-03": dict(res={5: ["The blue line comes back and now reads \"… An invoice dated date A is due\" followed by the date 15 days after date A (for example Nov 5)."]},
               checks="6", why="the result was hard to read"),
 "S3-24": dict(res={5: ["Term A is created.", "Its Due column reads \"25th of the following month\" (the rule, not the name)."]}, checks="6", why="wording"),
 "S4-02": dict(pre=["Sign in as an Admin at the test location.", "Make sure COD is the shop's default for new customers.",
                    "Have customer B, from before the release, whose credit term is blank.",
                    "Create customer A for this test, on COD, with a name that starts with the same word as customer B's name.",
                    "Use the organization's built-in Counter Sale customer (customer C), which is on COD.",
                    "Start on the Credit Terms page (Settings, then \"Credit Terms\" in the Finance group), Active tab."],
               steps=["Click the \"⋯\" at the right of the \"COD\" row.", "Click \"Move Customers\".",
                      "Type the first word of customer A's and customer B's names in \"Search customers\".", "Replace the search text with customer C's name."],
               results=[["The menu opens."], ["A window titled \"Move Customers from COD\" opens.", "\"Move To\" starts empty because COD is the default, and no hint shows."],
                        ["The list shows customer A and customer B (the blank-term customer is listed under COD)."],
                        ["Customer C (the Counter Sale customer) is not listed."]],
               checks="1,4,6", why="the step typed \"the start their names share\" but no setup said the names share a start; a blank term can only come from before the release; "
                                   "the result held an extra search (now its own step); \"the case's customers\" removed"),
 "S4-03": dict(pre=["Sign in as an Admin at the test location.", "Make sure COD is the shop's default for new customers.",
                    "Have customer B, from before the release, stored with the credit term text \"NET 30\" (from an old import).",
                    "Create customer A for this test, on Net 30, with a name that starts with the same word as customer B's name.",
                    "Start on the Credit Terms page (Settings, then \"Credit Terms\" in the Finance group), Active tab."],
               step={3: "Type the first word of customer A's and customer B's names in \"Search customers\"."},
               checks="1", why="the step typed \"the start their names share\" but no setup said the names share a start; the \"NET 30\" spelling can only come from before the release"),
 "S4-10": dict(res={5: ["Customer A's customer page opens."]}, checks="6", why="\"The page\" named"),
 "S4-16": dict(res={6: ["Customer A's \"Credit term\" reads Net 45.", "Its phone number, address, sales representative and credit limit are the ones set up for it."]},
               checks="2,6", why="\"exactly as before\" said as the values set up; \"The term\" named"),
 "S4-23": dict(res={5: ["The toast reports 2500 (or 2,500) customers moved to Net 30 and term A's Customers count reads 0.",
                        "All of them moved in this one move (a move has no limit on the number of customers)."]},
               checks="2,6", why="\"One move has no customer limit\" said plainly"),
 "S6-02": dict(res={1: ["The \"New Vendor\" window opens.", "Credit Terms reads COD (not Net 30)."]}, checks="6", why="\"It\" named"),
 "S6-03": dict(res={6: ["Credit Terms reads Net 30."]}, checks="6", why="\"It\" named"),
 "S7-01": dict(res={4: ["Invoice A still shows Terms Net 30 and Due date Nov 4, 2026."]}, checks="6", why="\"It\" named"),
 "S7-01b": dict(res={3: ["Invoice A still shows Terms Net 30 (the plain name) and Due date Nov 4, 2026."]}, checks="6", why="\"It\" named"),
 "S7-01c": dict(res={5: ["Invoice A still shows Terms term A and Due date Oct 25, 2026 (Oct 5 + 20 days)."]}, checks="6", why="\"It\" named"),
 "S7-02": dict(pre=["Sign in as an Admin at the test location.",
                    NEWTERM + "due 14 days after the invoice date, so a vendor on it has vendor invoices due 14 days after their date.",
                    "Create vendor A for this test, on term A, so the new vendor invoice starts on term A.", "Create vendor B for this test, on Net 30.",
                    "Start with a new vendor invoice for vendor A open in Parts, Vendors, Vendor Invoices, not yet saved, so its due date follows vendor A's term."],
               res={2: ["The vendor invoice is saved with due date Oct 19, 2026."], 4: ["The vendor invoice is saved with due date Nov 3, 2026."]},
               checks="1,6", why="the starting vendor invoice was described as a state for \"a vendor who holds one of the shop's own terms\"; the term and both vendors are now created first"),
 "S7-06": dict(res={4: ["The printed invoice shows term A's plain name (no \"(Inactive)\") and the due date Oct 19, 2026."]}, checks="6", why="\"It\" named"),
 "S7-09": dict(pre_drop=["Make sure Net 30 is active."], checks="5", why="no step or result needs Net 30 to be active (the result only compares with a Net 30 customer)"),
 "S8-02": dict(steps=["On work order 1's Finance tab, set Invoice Date to Oct 5, 2026.", "Click Create Invoice.",
                      "On work order 2's Finance tab, set Invoice Date to Oct 28, 2026.", "Click Create Invoice.",
                      "Wait until both invoices have synced to QuickBooks.", "In QuickBooks, open the Terms list (Settings, All lists, Terms).",
                      "In QuickBooks, open work order 1's invoice.", "In QuickBooks, open work order 2's invoice."],
               results=[["The Due date reads Nov 10, 2026."], ["The invoice is created."], ["The Due date reads Nov 10, 2026."], ["The invoice is created."],
                        ["Neither invoice is on the QB Unexported report."], ["Term A exists as a date-driven term, due on day 10 of the following month."],
                        ["It reads terms term A and due Nov 10, 2026, matching ShopView."], ["It reads terms term A and due Nov 10, 2026, matching ShopView."]],
               checks="1,4", why="one step opened two invoices; split. The repeated create line merged into the work order line"),
 "S8-04": dict(res={1: ["Vendor invoice A is sent."], 2: ["The bill is for vendor A, due Oct 19, 2026, with terms term A."]}, checks="6", why="\"It\" named"),
 "S8-05": dict(step={4: "In QuickBooks, open customer A."}, res={4: ["Customer A's terms still read Net 30."]}, checks="6", why="wording"),
 "S8-06": dict(pre_add=["Create work order 1 for customer A, complete and ready to invoice, so an invoice for customer A can sync after the move."],
               steps=["Click the \"⋯\" at the right of the term A row.", "Click \"Move Customers\".", "Choose \"Net 45\" in \"Move To\".", "Click \"Move 1 Customer\".",
                      "On work order 1's Finance tab, click Create Invoice.",
                      "Wait until the invoice has synced to QuickBooks (it is no longer on the QB Unexported report).", "In QuickBooks, open customer A."],
               results=[["The menu opens."], ["The \"Move Customers from term A\" window opens."], ["The dropdown shows Net 45."],
                        ["The toast \"1 customer moved to Net 45.\" shows."], ["The invoice is created on Net 45."],
                        ["The invoice is no longer on the QB Unexported report."],
                        ["Customer A's terms still read term A: no customer update was sent, although a newer invoice of customer A has synced."]],
               checks="3", why="\"no customer update was sent\" had nothing proving a sync ran after the move; an invoice of customer A now syncs first (backed by the quoted S8-R6: \"new invoices still carry the right term\")"),
 "S8-07": dict(steps=["Click the \"⋯\" at the right of the term A row.", "Click \"Deactivate\".", "In QuickBooks, open the Terms list (Settings, All lists, Terms).",
                      "Click the \"Inactive\" tab.", "Click the \"⋯\" at the right of the term A row.", "Click \"Reactivate\".", "In QuickBooks, refresh the Terms list."],
               results=[["The menu opens."], ["The toast \"term A deactivated\" shows."], ["Term A is still there, unchanged (active in QuickBooks)."],
                        ["Term A is listed."], ["The menu opens."], ["The term is active again."], ["Term A is unchanged."]],
               checks="4", why="one step switched to the Inactive tab and opened the row menu; split"),
 "S8-08": dict(pre=["Sign in as an Admin at the test location.",
                    "Make sure the test organization is connected to a QuickBooks Online sandbox company, and you can sign in to that company in another tab.",
                    NEWTERM + "due 14 days after the invoice date, and give it to no customer, vendor or invoice.",
                    "Create a second new term of the shop's own for this test, term B, due 20 days after the invoice date (it is not yet in QuickBooks).",
                    "Create work order 1 for this test, complete and ready to invoice, for a customer on term B."],
               steps=["On work order 1's Finance tab, click Create Invoice.",
                      "Wait until the invoice has synced to QuickBooks (it is no longer on the QB Unexported report).",
                      "In QuickBooks, open the Terms list (Settings, All lists, Terms)."],
               results=[["The invoice is created with terms term B."], ["The invoice is no longer on the QB Unexported report."],
                        ["Term B is listed (the sync ran and created the term the invoice used).", "There is no term A."]],
               checks="1,3", why="term A's absence was checked with nothing proving a sync ran: term B, used on an invoice that has synced, must appear (S8-R1, quote added); "
                                 "term A is created for this test and held by nobody (the PRD's Trigger line says a customer on such a term being created in QuickBooks also sends it, so the old \"held by one customer\" could fail for the wrong reason)"),
 "S8-11": dict(res={1: ["AccountingHub's copy of invoice A holds the invoice's due date and not term A's name."],
                    2: ["IBS's copy of invoice A holds the due date and not term A's name."]}, checks="6", why="\"It\" named"),
 "S9-10": dict(res={5: ["The window shows customer B as the customer."]}, checks="6", why="\"the picked customer\" named"),
 "S10-02": dict(res={3: ["Customer B's \"Credit term\" reads \"Net 10\"."], 4: ["Customer C's \"Credit term\" reads \"Net 10\"."]}, checks="6", why="\"It\" named"),
 "S10-03": dict(res={1: ["The import finishes.", "No row is refused because of its credit term.", "The import shows no new error message."], 4: ["Nothing changes."]},
                checks="5", why="a result about the import sat under the step that closes Edit Customer; moved to the import step"),
 "S10-11": dict(res={1: ["The request is accepted and customer A is created."], 2: ["The request is accepted and customer B is created."]},
                checks="5", why="the results spoke of a window closing, but the steps send requests (no window)"),
 "S10-12": dict(res={1: ["The request is accepted and customer A is created."]},
                checks="5", why="the result spoke of a window closing, but the step sends a request (no window)"),
 "S10-16": dict(pre=["Sign in as an Admin at the test location.",
                     "Have the Public API documentation from the developers for the test organization open (the customer requests and the vendor requests)."],
                res={1: ["There is none: an integrator sends a term name and reads back the saved spelling."],
                     2: ["It says a vendor created with no credit term starts on COD (no longer \"net_30\").",
                         "The vendor requests have no other new credit term field or rule."]},
                note="The tester reads the Public API documentation in this case and sends no request.",
                checks="4,5,6", why="the documentation was asked for twice; the API key and request tool are not needed to read it; \"They\" named; the note said a request is sent. "
                                    "28 Oct 2026 (PRD v5 named set): the vendor create request is its own step (v5 S10-R7 changes one vendor default); "
                                    "\"The customer requests are unchanged\" was wrong (the customer requests gain the credit term rules) and is gone; the note no longer says the case is held"),
 "S11-03": dict(pre=["Sign in as an Admin at the test location.", "Make sure Net 30 is the shop's default for new customers.",
                     "Use the organization's built-in Counter Sale customer; this test calls it customer A.",
                     "Make sure at least one other customer holds COD, so Move Customers can open.",
                     "Start on the Credit Terms page (Settings, then \"Credit Terms\" in the Finance group), Active tab."],
                steps=["Click the \"⋯\" at the right of the \"COD\" row.", "Click \"Move Customers\".", "Type customer A's name in \"Search customers\".",
                       "Open customer A's customer page."],
                results=[["The menu opens."], ["A window titled \"Move Customers from COD\" opens."],
                         ["\"No customers match your search.\" shows: the Counter Sale customer is never listed, so it can never be moved."],
                         ["The \"Credit term\" reads COD, although the default is Net 30."]],
                checks="1,2,4", why="step 2 acted on the Credit Terms page right after leaving it for the customer page; the result \"(or greyed if no other customer is on COD)\" left the outcome open, so the setup now makes sure another customer is on COD"),
 "S11-12": dict(res={1: ["The credit memo's due date reads Nov 19, 2026 (Oct 20 + 30 days; the Nov 1 clock change does not move it)."]},
                note="Before the release this screen could show one day less; the later date is the correct one.",
                checks="5", why="two bullets were background, not something the tester sees; moved to the note"),
 "S11-15": dict(res={1: ["The statement has no new screen and shows no credit term name."]}, checks="6", why="\"It\" named"),
 "S11-18": dict(pre_add=["Write down the newest row of the Credit Terms Log before you start."],
                res={7: ["The newest row is still the one you wrote down: no row was written for this change."]},
                checks="2,3", why="\"No row was written\" had nothing to compare with; the newest row is now written down first"),
 "S12-10": dict(res={8: ["The same row now shows the time later by the difference in hours (as clocks at location B read it).",
                         "The date changes too if that shift crosses midnight."]}, checks="6", why="\"the move\" was the time shift"),
 "S12-14": dict(res={4: ["User B's confirmation opens."]}, checks="6", why="whose confirmation"),
 "D-18": dict(steps=["Click \"⋯\" on the Net 7 row.", "Click \"Move Customers\".",
                     "Resize the browser window to 1536 px wide (for example, maximise it on a 1536 x 864 screen at 100% zoom)."],
              results=[["The row menu opens."],
                       ["The \"Move Customers from Net 7\" window opens with \"Move To\" reading COD.",
                        "Two grey lines show under it: \"Prefilled with your default for new customers.\" and \"Their credit limit will be set to $0.\" (as in ct-p2-06-move-to-cod-the-0-line.png)."],
                       ["At 1536 px nothing overlaps, nothing is cut off and nothing needs a sideways scroll.", "The layout described above is unchanged, only wider."]],
              checks="4", why="a step only looked at what the previous step opened; folded into that step's result (Rule 136 5a)"),
 "DATA-13": dict(pre=["Sign in as an Admin at a location in another time zone than Edmonton's.",
                      "Have work order 1 at a location in Edmonton's time zone, complete and ready to invoice (every part received, review done), for a customer who holds the shop's own term due on day 10 of the following month."],
                 checks="1,6", why="\"the work order\" was described before work order 1 was set up; merged"),
 "DATA-17": dict(pre=["Sign in as an Admin at the test location.", "Create vendor A for this test, on Credit Hold, so the new vendor invoice starts on Credit Hold.",
                      "Create vendor B for this test, on Net 45.", "Start with a new vendor invoice for vendor A open in Parts, Vendors, Vendor Invoices, not yet saved, so its due date follows vendor A's term."],
                 checks="1", why="the starting vendor invoice was described as a state for \"a vendor who holds Credit Hold\"; both vendors are now created first"),
 "DATA-20": dict(res={3: ["Customer B is inactive."]}, checks="6", why="\"The customer\" named"),
 "DATA-22": dict(res={1: ["The Net 45 row's Vendors cell reads number A (for example 5): \"NET 45\" counts as Net 45 and the inactive vendor counts."]}, checks="6", why="\"It\" named"),
}
for k, v in list(CASE.items()):
    if isinstance(v, str): CASE[k] = CASE[v]

# check 3: added quotes (a control backed by a PRD sentence). key -> list of PRD codes appended to the case's quotes
ADD_Q = {"S8-08": ["S8-R1"]}

# ---------------------------------------------------------------- generic wording: a result that names no window or page
def _window_name(steps, i):
    s = steps[i]
    if re.search(r'Click "Edit"\.$', s): return 'The "Edit Credit Term" window'
    if re.search(r'click "New Credit Term"\.$', s, re.I): return 'The "New Credit Term" window'
    m = re.search(r"Open Edit (Customer|Vendor) for (customer|vendor) ([A-Z])\.$", s)
    if m: return f"The Edit {m.group(1)} window for {m.group(2)} {m.group(3)}"
    if s == "Open Edit Customer.": return "The Edit Customer window"
    if s == 'Click "Move Customers".' and i > 0:
        m = re.search(r'right of the (?:"([^"]+)"|(term [A-Z])) row', steps[i - 1])
        if m: return f'The "Move Customers from {m.group(1) or m.group(2)}" window'
    return None

def _page_name(step):
    m = re.match(r"^Open (customer [A-Z]'s customer page|the Customers page|the Credit Terms page|vendor [A-Z]'s vendor page)\.$", step)
    return (m.group(1)[0].upper() + m.group(1)[1:]) if m else None

def generic(steps, results):
    out, why = [], []
    for i, r in enumerate(results):
        r = list(r)
        if r and r[0].startswith("The window opens"):
            n = _window_name(steps, i)
            if n: r[0] = n + r[0][len("The window"):]; why.append(i + 1)
        elif r and r[0] == "The page opens.":
            n = _page_name(steps[i])
            if n: r[0] = n + " opens."; why.append(i + 1)
        out.append(r)
    return out, why

# ---------------------------------------------------------------- apply
LOG = {}   # key -> list of (checks, what) for the report
def apply(c, p):
    """c: the authoring case; p: pattern.pattern_case() output (pre without the Blocked line, steps, results, note). Returns the fixed p."""
    k = c["key"]; log = []
    pre = []
    for b in p["pre"]:
        if BLOCKED_RX.search(b): continue
        if b in PRE_MAP:
            new, ch, why = PRE_MAP[b]; pre += new; log.append((ch, f"precondition: {why}")); continue
        for rx, rep, ch, why in PRE_RX:
            if rx.match(b): pre.append(rx.sub(rep, b)); log.append((ch, f"precondition: {why}")); break
        else: pre.append(b)
    steps, results, note = list(p["steps"]), [list(r) for r in p["results"]], p["note"]
    d = CASE.get(k)
    if d:
        if "pre" in d: pre = list(d["pre"])
        for old, new in d.get("pre_replace", {}).items():
            i = pre.index(old); pre[i:i + 1] = new
        for x in d.get("pre_drop", []): pre.remove(x)
        if "pre_add" in d:
            at = next((i for i, b in enumerate(pre) if b.startswith(("Start ", "Use a desktop", "Open the attached"))), len(pre))
            pre[at:at] = d["pre_add"]
        if "start" in d: pre = [b for b in pre if not b.startswith("Start ")] + [d["start"]]
        if "steps" in d: steps = list(d["steps"])
        if "results" in d: results = [list(r) for r in d["results"]]
        for n, s in d.get("step", {}).items(): steps[n - 1] = s
        for n, r in d.get("res", {}).items(): results[n - 1] = list(r)
        if "note" in d: note = d["note"]
        log.append((d["checks"], d["why"]))
    results, gw = generic(steps, results)
    if gw: log.append(("6", "results of step " + ", ".join(map(str, gw)) + " now name the window or page that opens"))
    LOG[k] = log
    return dict(p, pre=pre, steps=steps, results=results, note=note)
