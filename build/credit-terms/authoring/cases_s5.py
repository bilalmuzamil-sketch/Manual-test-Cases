"""Story 5 — New Customer and Edit Customer (S5-R1 to S5-R15, S5-N1 to S5-N4, S5-E1 to S5-E3, Error Handling, Form factor), with the
field permission (Key Decisions, Permissions)."""
from ct_lib import C, HOLD, prd_line
from common import *

def cu(key, title, pre, pairs, q, note="", marker=None, start=("Starting screen: the Customers page.", None), who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S5", title, [who or ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)

NEWC = ('Click "New Customer".', 'the "New Customer" window opens.')
OWN14 = lambda key: own("{Term-A}", "net 14", example=f"ZZAUTOTEST {key} Fourteen")
LOCKTXT = "COD and Credit Hold customers can't charge to account, so they have no credit limit."
FORM5 = ("Story 5, Form factor", prd_line("Form factor: Mobile-optimized: Credit Terms and Credit Limit sit side by side at every width"))

cu("S5-01", "New Customer shows Credit Terms and Credit Limit, prefilled with the default",
   [("The shop's own term {Term-A}, due 14 days after the invoice date, is the default for new customers.", "For example: {Term-A} is ZZAUTOTEST S5-01 Fourteen.")],
   [NEWC, ("Look at the fields.",
     'the window shows a "Credit Terms" dropdown and a "Credit Limit" field side by side, in the same place they sit on Edit Customer. Credit Terms already reads {Term-A}, with a "Default" tag after the name, and Credit Limit is editable.')],
   ["S5-R1", "S5-R2", "S5-R3", "S11-R5", "PERM-FIELDS", "GOAL-3"])

cu("S5-02", "The Credit Terms dropdown lists active terms in page order",
   [DEFAULT_COD, ("Net 50 is deactivated and every other standard term is active. The shop's own active terms include {Term-A} (due 10 days after the invoice date) and {Term-B} (due on day 5 of the following month), and its own term {Term-C} is deactivated. Other shop terms (from other tests) may also be offered.",
                  "For example: {Term-A} is ZZAUTOTEST S5-02 Ten, {Term-B} is ZZAUTOTEST S5-02 Fifth and {Term-C} is ZZAUTOTEST S5-02 Old.")],
   [NEWC, ("Open the Credit Terms dropdown.",
     'it lists the active terms in the page order: COD first (with a "Default" tag), Due on Receipt second, then the Net terms by days with {Term-A} after Net 7 and before Net 15, then Net 15 to Net 120 (Net 50 missing), then the day-of-the-following-month terms with {Term-B} among them, and Credit Hold last, with no "Default" tag. Net 50 and {Term-C} (inactive) are not offered.')],
   ["S5-R3", "S5-N2", "S5-N3", "S1-R5", "KD-ONELIST"])

cu("S5-03", "Choosing COD locks Credit Limit at $0.00 with the reason on hover", [("Net 30 is the shop's default for new customers.", None)],
   [NEWC, ("Type 500 in Credit Limit.", "Credit Limit reads 500."), ('Choose "COD" in Credit Terms.', "Credit Limit changes to $0.00 and is disabled."),
    ("Hover Credit Limit.", f'the hover reads "{LOCKTXT}"')],
   ["S5-R4", "UFS-44", "KD-ZERO"])

cu("S5-04", "Choosing Credit Hold also locks Credit Limit at $0.00", [("Net 30 is the shop's default for new customers.", None)],
   [NEWC, ("Type 750 in Credit Limit.", "Credit Limit reads 750."), ('Choose "Credit Hold" in Credit Terms.', "Credit Limit changes to $0.00 and is disabled."),
    ("Hover Credit Limit.", f'the hover reads "{LOCKTXT}"')],
   ["S5-R4", "KD-ZERO"])

cu("S5-05", "Switching from COD to a Net term unlocks Credit Limit at $0.00", [DEFAULT_COD],
   [NEWC, ("Look at Credit Limit.", "Credit Terms reads COD and Credit Limit shows $0.00, disabled."), ('Choose "Net 30" in Credit Terms.', "Credit Limit becomes editable and still reads $0.00."),
    ("Type 1200 in Credit Limit.", "Credit Limit reads 1200.")],
   ["S5-R5", "S5-R4"])

cu("S5-06", "Saving New Customer creates the customer with the chosen term and limit",
   [DEFAULT_COD, OWN14("S5-06"), ("A name for the new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S5-06 Customer.")],
   [NEWC, ("Type {Customer-A} in Customer Name.", "the name is typed."), ("Choose {Term-A} in Credit Terms.", "{Term-A} is chosen."), ("Type 800 in Credit Limit.", "Credit Limit reads 800."),
    ("Click Save.", "the customer is created."), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads {Term-A} and the credit limit is $800.00. No extra screen was needed to set the term.')],
   ["S5-R6", "GOAL-3"])

cu("S5-07", "New Customer from New Work Order has Credit Terms prefilled too",
   [("Net 30 is the shop's default for new customers.", None), ("A name for the new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S5-07 Customer.")],
   [('Click "New Work Order".', "the New Work Order window opens."), ("Choose to add a new customer from the customer picker.", 'the same "New Customer" window opens, with Credit Terms reading Net 30 (Default) and Credit Limit beside it.'),
    ("Type {Customer-A} in Customer Name.", "the name is typed."), ("Click Save.", "the window closes and {Customer-A} is picked as the work order's customer."), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads Net 30.')],
   ["S5-R15", "S5-R2"], start=("Starting screen: the Work Orders page.", None))

cu("S5-08", "New Customer from New Part Sale has Credit Terms prefilled too",
   [("Due on Receipt is the shop's default for new customers.", None), ("A name for the new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S5-08 Customer.")],
   [('Click "New Part Sale".', "the New Part Sale window opens."), ("Choose to add a new customer from the customer picker.", 'the same "New Customer" window opens, with Credit Terms reading Due on Receipt (Default).'),
    ("Type {Customer-A} in Customer Name.", "the name is typed."), ("Click Save.", "the window closes and {Customer-A} is picked as the part sale's customer."), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads Due on Receipt.')],
   ["S5-R15", "S5-R2"], start=("Starting screen: Parts, Part Sales.", None))

cu("S5-09", "A deactivated term shows as inactive on the customer, plain on invoices",
   [DEFAULT_COD, ("Customer {Customer-A} holds Net 60, which is deactivated, and has an invoice {Invoice-A} created after Net 60 was deactivated.",
                  "For example: {Customer-A} is ZZAUTOTEST S5-09 Customer and {Invoice-A} is the invoice of work order S2-15440.")],
   [("Open {Customer-A}'s customer page.", 'the card\'s "Credit term" reads "Net 60 (Inactive)".'), ("Open Edit Customer.", 'Credit Terms shows "Net 60 (Inactive)" selected.'),
    ("Open the Credit Terms dropdown.", '"Net 60 (Inactive)" is listed after all the active terms (after Credit Hold).'), ("Press Escape.", "the dropdown closes, still on Net 60 (Inactive)."),
    ("Click Save without changing anything.", "the customer saves and stays on Net 60 (Inactive)."), ("Open {Invoice-A}'s printed invoice.", 'the terms read "Net 60", without "(Inactive)".')],
   ["S5-R7", "S5-R8", "S5-R12", "T-INACTIVE", "KD-DEACT", "S7-E1"], start=None)

cu("S5-10", "Once another term is saved, the inactive term is no longer offered",
   [DEFAULT_COD, ("Customer {Customer-A} holds Net 60, which is deactivated.", "For example: {Customer-A} is ZZAUTOTEST S5-10 Customer.")],
   [("Open Edit Customer for {Customer-A}.", '"Net 60 (Inactive)" is selected.'), ('Choose "Net 30" in Credit Terms.', "Net 30 is chosen."), ("Click Save.", "the customer saves on Net 30."),
    ("Open Edit Customer again.", "Credit Terms reads Net 30."), ("Open the Credit Terms dropdown.", '"Net 60" and "Net 60 (Inactive)" are not offered any more.')],
   ["S5-R13", "S5-N2", "S5-R12"], start=None)

cu("S5-11", "New Customer checks the name only after typing or on Save", [],
   [NEWC, ("Click the Credit Terms dropdown without typing a name.", 'no "Customer name is a required field" message shows.'), ("Press Escape.", "the dropdown closes."),
    ("Type \"x\" in Customer Name.", "the name reads x."), ("Delete the x.", "the name is empty."), ("Click the Credit Limit field.", 'the message "Customer name is a required field" shows under the name.'),
    ('Click "Cancel".', "the window closes."), NEWC, ("Click Save without typing anything.", 'the message "Customer name is a required field" shows and the customer is not created.')],
   ["S5-R10", "S11-R6"])

cu("S5-12", "Edit Customer checks the name only after typing or on Save",
   [("Customer {Customer-A} exists.", "For example: {Customer-A} is ZZAUTOTEST S5-12 Customer.")],
   [("Open Edit Customer for {Customer-A}.", "the window opens."), ("Click the Credit Terms dropdown.", "no name message shows."), ("Press Escape.", "the dropdown closes."),
    ("Clear the Customer Name.", "the name is empty."), ("Click the Credit Limit field.", 'the message "Customer name is a required field" shows.'),
    ("Click Save.", "the customer is not saved and the message still shows.")],
   ["S5-R10", "S11-R6"], start=None)

for key, design in [("S5-13", "modern"), ("S5-14", "legacy")]:
    cu(key, f"A 31-character term prints in full on {design} invoices and estimates",
       [(f"The organization uses the {design} invoice design.", None),
        ("Customer {Customer-A} holds the shop's own term {Term-A}, which has a 31-character name. Work order {Work-order-1} for {Customer-A} has an estimate and an invoice.",
         f"For example: {{Term-A}} is ZZAUTOTEST {key} Long Term Name, {{Customer-A}} is ZZAUTOTEST {key} Customer and {{Work-order-1}} is S2-15440.")],
       [("Open the printed estimate of {Work-order-1}.", "the terms show every character of {Term-A}, without clipping or \"...\"."),
        ("Open the printed invoice of {Work-order-1}.", "the terms show every character of {Term-A}, without clipping."),
        ("Open the work order print of {Work-order-1}.", "the work order print does not show the credit term at all.")],
       ["S5-R11"], start=None)

cu("S5-15", "Long term names wrap in the dropdown and on the customer card",
   [("The shop's own term {Term-A} has a 31-character name and is the default; its own term {Term-B} also has a 31-character name, is deactivated and is held by customer {Customer-A}.",
     "For example: {Term-A} is ZZAUTOTEST S5-15 Long Default A, {Term-B} is ZZAUTOTEST S5-15 Long Inactv BB and {Customer-A} is ZZAUTOTEST S5-15 Customer.")],
   [("Open {Customer-A}'s customer page.", 'the card shows the whole of "{Term-B} (Inactive)", wrapping if needed; nothing is cut off.'), ("Open Edit Customer.", "the selected value shows the whole name and \"(Inactive)\"."),
    ("Open the Credit Terms dropdown.", '{Term-A} shows in full followed by its "Default" tag, and "{Term-B} (Inactive)" shows in full; long names wrap.')],
   ["S5-R14"], start=None)

def noap(key):
    return (f'You are signed in as {{User-A}}, on a custom role, {{Role-A}}, that has Customers → Create & Edit but not View and Manage AP/AR Data.',
            f"For example: {{User-A}} is ZZAUTOTEST {key} User and {{Role-A}} is ZZAUTOTEST {key} No APAR.")
cu("S5-16", "Without AP/AR Data access, New and Edit Customer show neither field",
   [("Customer {Customer-A} exists.", "For example: {Customer-A} is ZZAUTOTEST S5-16 Customer.")],
   [NEWC, ("Look at the fields.", 'neither "Credit Terms" nor "Credit Limit" shows; the window looks as it did before the release.'), ('Click "Cancel".', "the window closes."),
    ("Open Edit Customer for {Customer-A}.", 'neither "Credit Terms" nor "Credit Limit" shows (as Edit Customer today).')],
   ["S5-N1", "PERM-FIELDS", "S11-R5", "S11-N2"], who=noap("S5-16"))

for key, dflt, lim, title in [("S5-17", "COD", "a credit limit of $0.00", "A customer created without AP/AR access gets the default COD and $0"),
                              ("S5-18", "Net 30", "no credit limit (blank)", "A customer created without AP/AR access gets the default Net 30")]:
    cu(key, title,
       [(f"{dflt} is the shop's default for new customers.", None), ("A name for the new customer, {Customer-A}.", f"For example: {{Customer-A}} is ZZAUTOTEST {key} Customer."),
        ("An Admin can check the result in a second browser.", None)],
       [NEWC, ("Type {Customer-A} in Customer Name.", "the name is typed."), ("Click Save.", "the customer is created."),
        ("In the Admin's browser, open Edit Customer for {Customer-A}.", f"Credit Terms reads {dflt} and the customer has {lim}.")],
       ["S5-N4", "PERM-IGNORED"], who=noap(key))

cu("S5-19", "Editing a customer without AP/AR access keeps its term and limit",
   [("Customer {Customer-A} holds Net 45 with a credit limit of $900.00.", "For example: {Customer-A} is ZZAUTOTEST S5-19 Customer."), ("An Admin can check the result in a second browser.", None)],
   [("Open Edit Customer for {Customer-A}.", "the window opens without Credit Terms or Credit Limit."), ("Change the phone number.", "the new number is typed."), ("Click Save.", "the customer is saved."),
    ("In the Admin's browser, open Edit Customer for {Customer-A}.", "Credit Terms still reads Net 45 and Credit Limit still reads $900.00.")],
   ["S5-N4", "PERM-IGNORED"], who=noap("S5-19"), start=None)

cu("S5-20", "A user without Settings Finance still gets the default and the shop's terms",
   [("The shop's own term {Term-A}, due 14 days after the invoice date, is the default.", "For example: {Term-A} is ZZAUTOTEST S5-20 Fourteen.")],
   [NEWC, ("Open the Credit Terms dropdown.", '{Term-A} is preselected with its "Default" tag and the shop\'s own terms are offered, although this user cannot open the Credit Terms page.')],
   ["PERM-LIST", "S5-R2"],
   who=('You are signed in as {User-A}, on the out-of-the-box "Service Manager" role (Customers → Create & Edit and View and Manage AP/AR Data, no Settings → Finance).', "For example: {User-A} is ZZAUTOTEST S5-20 User."))

cu("S5-21", "If the default changes while New Customer is open, the form keeps its term",
   [("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S5-21 Second Admin."),
    DEFAULT_COD, ("A name for the new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S5-21 Customer."),
    ("Starting screen: your browser shows the Customers page; {User-B}'s browser shows the Credit Terms page.", None)],
   [NEWC, ("Type {Customer-A} in Customer Name.", "Credit Terms reads COD (Default)."), ('In {User-B}\'s browser, click the "⋯" at the right of the "Net 30" row.', "the menu opens."),
    ('In {User-B}\'s browser, click "Make Default for New Customers".', "the confirmation opens."), ('In {User-B}\'s browser, click "Make Default".', '{User-B} sees "Net 30 is now the default".'),
    ("In your browser, look at Credit Terms.", "it still reads COD (the form keeps the term it showed)."), ("Click Save.", "the customer is created on COD, the term the form showed.")],
   ["S5-E1"], start=None)

cu("S5-22", "A customer stored with unknown term text shows that text in Edit Customer",
   [("Customer {Customer-A} is stored with a credit term text ShopView does not know, {Text-A} (from an old import).", "For example: {Customer-A} is ZZAUTOTEST S5-22 Customer and {Text-A} is Prepaid.")],
   [("Open Edit Customer for {Customer-A}.", "Credit Terms shows {Text-A} selected, without \"(Inactive)\"."), ("Open the Credit Terms dropdown.", "{Text-A} is listed after the active terms.")],
   ["S5-E2"], start=None)

cu("S5-24", "Saving New Customer on a term deactivated meanwhile is refused",
   [("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S5-24 Second Admin."),
    DEFAULT_COD, OWN14("S5-24"), ("A name for the new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S5-24 Customer."),
    ("Starting screen: your browser shows the Customers page; {User-B}'s browser shows the Credit Terms page.", None)],
   [NEWC, ("Type {Customer-A} in Customer Name.", "the name is typed."), ("Choose {Term-A} in Credit Terms.", "{Term-A} is chosen."),
    ('In {User-B}\'s browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('In {User-B}\'s browser, click "Deactivate".', '{User-B} sees "{Term-A} deactivated".'),
    ("In your browser, click Save.", 'the app\'s error alert shows "Pick an active credit term." The New Customer window stays open and the customer is not created.')],
   ["EH-S5a", "UFS-46"], start=None)

cu("S5-26", "On a phone, Credit Terms and Credit Limit stay side by side",
   [DEFAULT_COD, ("You use a phone (or a browser window 390 pixels wide with touch input).", None)],
   [NEWC, ("Look at Credit Terms and Credit Limit.", "they sit side by side on one row, as City / ZIP and State / Country do."),
    ("Tap the locked Credit Limit.", f'the explanation "{LOCKTXT}" shows under the field.'), ("Tap the Credit Limit again.", "the explanation hides.")],
   [FORM5, "S5-R4"])
