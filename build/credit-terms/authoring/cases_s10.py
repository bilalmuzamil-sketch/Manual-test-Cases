"""Story 10 — Imports and Public API (S10-R1 to S10-R8, S10-N1, S10-N2, S10-E1 to S10-E3, Error Handling; Key Decision "Imports and the
Public API stay lenient"; S6-E1 vendor imports). Contacts and vendor imports run through Settings, Data Import (UI). The Public API cases
send a request with an API key and a request tool (Rule 4: this section's title must include "API")."""
from ct_lib import C, HOLD
from common import *

def im(key, title, pre, pairs, q, note="", marker=None, api=False):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S10", title, [ADMIN()] + pre, st, rs, q, note=note, marker=marker, api=api)
IMP = ("Import the file through Settings, Data Import, Contacts.", "the import finishes; no row is refused because of its credit term.")
VIMP = ("Import the file through Settings, Data Import, Vendors.", "the import finishes; no row is refused because of its credit term.")

im("S10-01", "A customer imported with a blank credit term gets the shop's default",
   [("The shop's own term {Term-A}, due 14 days after the invoice date, is the default for new customers.", "For example: {Term-A} is ZZAUTOTEST S10-01 Fourteen."),
    ("A contacts import file with one new customer, {Customer-A}, whose credit term cell is empty.", "For example: {Customer-A} is ZZAUTOTEST S10-01 Customer.")],
   [IMP, ("Open {Customer-A}'s customer page.", 'the "Credit term" reads {Term-A}.')], ["S10-R1", "KD-LENIENT", "GOAL-1"])

im("S10-02", "Imported term text in any capitals or spacing saves in the term's spelling",
   [("The shop's own term {Term-A}, named \"Net 10\", is active.", "For example: {Term-A} is Net 10."),
    ("A contacts import file with three new customers: {Customer-A} with the credit term \"net 10\", {Customer-B} with \"NET10\" and {Customer-C} with \"Net 10\".",
     "For example: they are ZZAUTOTEST S10-02 Alpha, Bravo and Charlie.")],
   [IMP, ("Open {Customer-A}'s customer page.", 'the "Credit term" reads "Net 10" (the term\'s own spelling).'), ("Open {Customer-B}'s customer page.", 'it reads "Net 10".'),
    ("Open {Customer-C}'s customer page.", 'it reads "Net 10".')], ["S10-R3", "KD-LENIENT", "A-SPELL"])

im("S10-03", "Imported term text that matches no term is saved as sent",
   [("A contacts import file with one new customer, {Customer-A}, whose credit term is {Text-A}, a text that matches no term.", "For example: {Customer-A} is ZZAUTOTEST S10-03 Customer and {Text-A} is Prepaid.")],
   [IMP, ("Open {Customer-A}'s customer page.", 'the "Credit term" reads {Text-A} exactly as sent.'), ("Open Edit Customer.", "{Text-A} shows selected after the active terms, without \"(Inactive)\"."),
    ("Close Edit Customer without saving.", "nothing changes; the import showed no new error message.")], ["S10-R4", "S10-N1", "KD-LENIENT", "S5-E2", "EH-S10"])

im("S10-04", "An imported name matching a deactivated term is saved as that term",
   [("Net 60 is deactivated.", None), ("A contacts import file with one new customer, {Customer-A}, whose credit term is \"net 60\".", "For example: {Customer-A} is ZZAUTOTEST S10-04 Customer.")],
   [IMP, ("Open {Customer-A}'s customer page.", 'the "Credit term" reads "Net 60 (Inactive)".')], ["S10-E1", "KD-LENIENT", "S5-R8"])

im("S10-05", "A new customer imported on COD or Credit Hold gets a $0 limit",
   [("A contacts import file with three new customers: {Customer-A} on COD with a credit limit of 500, {Customer-B} on Credit Hold with a credit limit of 750, and {Customer-C} on Net 30 with a credit limit of 900.",
     "For example: they are ZZAUTOTEST S10-05 Cash, ZZAUTOTEST S10-05 Hold and ZZAUTOTEST S10-05 Net.")],
   [IMP, ("Open Edit Customer for {Customer-A}.", "Credit Limit shows $0.00, disabled (the 500 in the file was not kept)."), ("Close it without saving.", "the window closes."),
    ("Open Edit Customer for {Customer-B}.", "Credit Limit shows $0.00, disabled."), ("Close it without saving.", "the window closes."),
    ("Open Edit Customer for {Customer-C}.", "Credit Limit shows $900.00, as sent (a Net term's limit is handled as before the release).")],
   ["S10-R6", "S10-E2", "KD-ZERO"])

im("S10-06", "An import update with a blank term cell keeps the stored term",
   [("Customer {Customer-A} exists on Net 45.", "For example: {Customer-A} is ZZAUTOTEST S10-06 Customer."),
    ("A contacts import file that updates {Customer-A} (same customer) with a new phone number and an empty credit term cell.", None)],
   [IMP, ("Open {Customer-A}'s customer page.", 'the phone number is updated and the "Credit term" still reads Net 45.')], ["S10-E3"])

im("S10-07", "An import update onto COD saves a $0 limit and the row is not refused",
   [("Customer {Customer-A} exists on Net 30 with a credit limit of $800.00.", "For example: {Customer-A} is ZZAUTOTEST S10-07 Customer."),
    ("A contacts import file that updates {Customer-A} with the credit term \"COD\" and the credit limit 800.", None)],
   [IMP, ("Open Edit Customer for {Customer-A}.", "Credit Terms reads COD and Credit Limit shows $0.00, disabled.")], ["S10-R8", "S10-N1"])

im("S10-08", "An import update of an old COD customer clears its stored limit",
   [("Customer {Customer-A} holds COD and keeps a credit limit of $1,000.00 stored from before the release.", "For example: {Customer-A} is ZZAUTOTEST S10-08 Customer."),
    ("A contacts import file that updates {Customer-A} with a new phone number, the credit term \"COD\" and an empty credit limit cell.", None)],
   [IMP, ("Open Edit Customer for {Customer-A}.", "Credit Limit shows $0.00, disabled; the stored $1,000.00 is gone because the import updated the customer.")],
   ["KD-ZERO2", "S10-E2", "S10-R8"])

im("S10-09", "Vendors imported with a blank term start on COD, not the default",
   [("Net 30 is the shop's default for new customers.", None), ("The shop's own term {Term-A} is named \"Net 10\".", "For example: {Term-A} is Net 10."),
    ("A vendor import file with two new vendors: {Vendor-A} with an empty credit term cell and {Vendor-B} with the credit term \"NET10\".",
     "For example: {Vendor-A} is ZZAUTOTEST S10-09 Blank and {Vendor-B} is ZZAUTOTEST S10-09 Upper.")],
   [VIMP, ("Open {Vendor-A}'s vendor page.", 'the "Credit term" reads COD (not Net 30).'), ("Open {Vendor-B}'s vendor page.", 'the "Credit term" reads "Net 10" (the term\'s spelling).')],
   ["S10-N2", "S6-E1", "S10-R3"])

im("S10-10", "A vendor import update with a blank term cell keeps the stored term",
   [("Vendor {Vendor-A} exists on Net 60.", "For example: {Vendor-A} is ZZAUTOTEST S10-10 Vendor."), ("A vendor import file that updates {Vendor-A} with a new phone number and an empty credit term cell.", None)],
   [VIMP, ("Open {Vendor-A}'s vendor page.", 'the phone number is updated and the "Credit term" still reads Net 60.')], ["S10-E3"])

# ---- Public API (the tester sends a request; Rule 4) -------------------------------------------------------------------------
APIHOLD = HOLD("the Public API request (address and field names) is not in our sources yet (no tech plan); the steps say what to send but not the exact request")
KEY = ("You have a valid Public API key for the test organization and a request tool (for example Postman).", None)
def api(key, title, pre, pairs, q):
    im(key, title, [KEY] + pre, pairs, q, marker=APIHOLD, api=True,
       note="The tester sends a Public API request in this case. The exact request is added once the API documentation or tech plan is shared; until then the case is held.")

api("S10-11", "A customer created through the API without a term gets the default",
    [("The shop's own term {Term-A} is the default for new customers.", "For example: {Term-A} is ZZAUTOTEST S10-11 Fourteen."),
     ("Names for two new customers, {Customer-A} and {Customer-B}.", "For example: ZZAUTOTEST S10-11 None and ZZAUTOTEST S10-11 Blank.")],
    [("Send a Public API request that creates {Customer-A} with no credit term at all.", "the customer is created."),
     ("Send a Public API request that creates {Customer-B} with an empty credit term.", "the customer is created."),
     ("Open {Customer-A}'s customer page.", 'the "Credit term" reads {Term-A}.'), ("Open {Customer-B}'s customer page.", 'the "Credit term" reads {Term-A}.')],
    ["S10-R2", "KD-LENIENT"])
api("S10-12", "An API term in other capitals saves and reads back in the term's spelling",
    [("The shop's own term {Term-A} is named \"Net 10\".", "For example: {Term-A} is Net 10."), ("A name for a new customer, {Customer-A}.", "For example: ZZAUTOTEST S10-12 Customer.")],
    [("Send a Public API request that creates {Customer-A} with the credit term \"net 10\".", "the customer is created."),
     ("Send a Public API request that reads {Customer-A}.", 'the credit term comes back as "Net 10" (the saved spelling).'), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads "Net 10".')],
    ["S10-R3", "S10-R7"])
api("S10-13", "Updating a term through the API matches spelling, or saves unknown text",
    [("The shop's own term {Term-A} is named \"Net 10\".", "For example: {Term-A} is Net 10."), ("Customer {Customer-A} exists on Net 30.", "For example: ZZAUTOTEST S10-13 Customer.")],
    [("Send a Public API request that updates {Customer-A}'s credit term to \"NET10\".", "the request succeeds."), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads "Net 10".'),
     ("Send a Public API request that updates {Customer-A}'s credit term to \"Prepaid\".", "the request succeeds (it is not refused)."), ("Reload {Customer-A}'s customer page.", 'the "Credit term" reads "Prepaid" exactly as sent.')],
    ["S10-R5", "S10-R4", "S10-N1"])
api("S10-14", "A customer created or updated through the API on COD gets a $0 limit",
    [("Names for a new customer, {Customer-A}; customer {Customer-B} exists on Net 30 with a $600.00 limit.", "For example: ZZAUTOTEST S10-14 New and ZZAUTOTEST S10-14 Existing.")],
    [("Send a Public API request that creates {Customer-A} with the credit term \"COD\" and the credit limit 500.", "the customer is created (the request is not refused)."),
     ("Open Edit Customer for {Customer-A}.", "Credit Limit shows $0.00, disabled."), ("Close it without saving.", "the window closes."),
     ("Send a Public API request that updates {Customer-B} with the credit term \"Credit Hold\" and the credit limit 600.", "the request succeeds."),
     ("Open Edit Customer for {Customer-B}.", "Credit Terms reads Credit Hold and Credit Limit shows $0.00, disabled.")],
    ["S10-R8", "S10-N1", "KD-ZERO"])
api("S10-15", "An API update with neither term nor limit keeps the stored limit",
    [("Customer {Customer-A} holds COD and keeps a credit limit of $1,000.00 stored from before the release.", "For example: ZZAUTOTEST S10-15 Customer.")],
    [("Send a Public API request that updates only {Customer-A}'s phone number.", "the request succeeds."),
     ("Send a Public API request that reads {Customer-A}.", "the credit limit still reads 1,000.00 (neither a term nor a limit was sent)."),
     ("Send a Public API request that updates {Customer-A} with the credit term \"COD\".", "the request succeeds."), ("Send a Public API request that reads {Customer-A}.", "the credit limit now reads 0.")],
    ["S10-R8", "KD-ZERO2", "S10-E2"])
api("S10-16", "The Public API has no way to list terms or the default",
    [("The Public API documentation for the test organization is open.", None)],
    [("Look for a request that lists the shop's credit terms or its default.", "there is none: an integrator sends a term name and reads back the saved spelling."),
     ("Look at the vendor requests.", "they are unchanged from before the release (no new credit term fields or rules).")],
    ["S10-R7"])
