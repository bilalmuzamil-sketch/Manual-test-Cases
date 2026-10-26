"""Story 6 — Vendors (S6-R1 to S6-R6, S6-N1, S6-N2, S6-E1, S6-E2, Error Handling). Vendor imports (S6-E1) are in cases_s10.py."""
from ct_lib import C
from common import *

def vd(key, title, pre, pairs, q, note="", marker=None, start=("Starting screen: Parts, Vendors.", None), who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S6", title, [who or ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)

NEWV = ('Click "New Vendor".', 'the "New Vendor" window opens.')
vd("S6-01", "The vendor Credit Terms dropdown lists active terms, with no Default tag",
   [("The shop's own term {Term-A}, due 10 days after the invoice date, is the default for new customers. Its own term {Term-B}, due on day 5 of the following month, is active. Net 50 is deactivated and every other standard term is active. Other shop terms (from other tests) may also be offered.",
     "For example: {Term-A} is ZZAUTOTEST S6-01 Ten and {Term-B} is ZZAUTOTEST S6-01 Fifth.")],
   [NEWV, ("Open the Credit Terms dropdown.",
     'it lists the active terms in the page order: COD first, Due on Receipt second, then the Net terms by days with {Term-A} after Net 7 and before Net 15, then Net 15 to Net 120 (Net 50 missing), then the day-of-the-following-month terms with {Term-B} among them, and Credit Hold last. No item carries a "Default" tag (not even {Term-A}).')],
   ["S6-R1", "S6-R2", "S6-N2", "S1-R5", "KD-ONELIST", "FO-VENDOR-COD"])

vd("S6-02", "New Vendor starts on COD whatever the customer default is",
   [("Net 30 is the shop's default for new customers.", None), ("A name for the new vendor, {Vendor-A}.", "For example: {Vendor-A} is ZZAUTOTEST S6-02 Vendor.")],
   [NEWV, ("Look at Credit Terms.", "it reads COD (not Net 30)."), ("Type {Vendor-A} in Name.", "the name is typed."), ("Click Save & Close.", "the vendor is saved."),
    ("Open {Vendor-A}'s vendor page.", 'the "Credit term" reads COD.')],
   ["S6-R2", "OOS-1", "FO-VENDOR-COD"])

vd("S6-03", "A vendor on a deactivated term shows it as inactive until another is picked",
   [("Vendor {Vendor-A} holds Net 60, which is deactivated. Vendor {Vendor-B} holds Net 30.", "For example: {Vendor-A} is ZZAUTOTEST S6-03 Vendor A and {Vendor-B} is ZZAUTOTEST S6-03 Vendor B.")],
   [("Open {Vendor-A}'s vendor page.", 'the "Credit term" reads "Net 60 (Inactive)".'), ("Open Edit Vendor.", '"Net 60 (Inactive)" is selected in Credit Terms.'),
    ("Open the Credit Terms dropdown.", '"Net 60 (Inactive)" is listed after the active terms.'), ('Choose "Net 45".', "Net 45 is chosen."), ("Click Save & Close.", "the vendor saves on Net 45."),
    ("Open Edit Vendor for {Vendor-B}.", "it reads Net 30."), ("Open the Credit Terms dropdown.", "Net 60 is not offered to {Vendor-B}.")],
   ["S6-R3", "S6-N2", "T-INACTIVE"], start=None)

vd("S6-04", "Vendor credit limits stay editable on COD and Credit Hold",
   [("Vendor {Vendor-A} holds COD with a credit limit of $2,000.00.", "For example: {Vendor-A} is ZZAUTOTEST S6-04 Vendor.")],
   [("Open Edit Vendor for {Vendor-A}.", "Credit Limit reads $2,000.00 and is editable (no lock, no $0.00)."), ("Replace the limit with 2500.", "the limit reads 2500."),
    ('Choose "Credit Hold" in Credit Terms.', "the limit still reads 2500 and stays editable."), ("Click Save & Close.", "the vendor saves on Credit Hold with a $2,500.00 limit, exactly as before the release.")],
   ["S6-R4", "OOS-9"], start=None)

vd("S6-05", "New Vendor checks the name only after typing or on Save & Close", [],
   [NEWV, ("Click the Credit Terms dropdown without typing a name.", 'no "Name is a required field" message shows.'), ("Press Escape.", "the dropdown closes."),
    ('Type "x" in Name.', "the name reads x."), ("Delete the x.", "the name is empty."), ("Click another field.", 'the message "Name is a required field" shows.'),
    ("Click Save & Close.", "the vendor is not saved and the message still shows; no other new message appears.")],
   ["S6-R5", "S11-R7", "EH-S6"])

vd("S6-06", "Edit Vendor checks the name only after typing or on Save & Close",
   [("Vendor {Vendor-A} exists.", "For example: {Vendor-A} is ZZAUTOTEST S6-06 Vendor.")],
   [("Open Edit Vendor for {Vendor-A}.", "the window opens."), ("Click the Credit Terms dropdown.", "no name message shows."), ("Press Escape.", "the dropdown closes."),
    ("Clear the Name.", "the name is empty."), ("Click another field.", 'the message "Name is a required field" shows.')],
   ["S6-R5", "S11-R7"], start=None)

vd("S6-07", "Long term names wrap in the vendor dropdown and card",
   [("The shop's own term {Term-A} has a 31-character name, is deactivated and is held by vendor {Vendor-A}; its own term {Term-B} also has a 31-character name and is active.",
     "For example: {Term-A} is ZZAUTOTEST S6-07 Long Inactv AA, {Term-B} is ZZAUTOTEST S6-07 Long Active BB and {Vendor-A} is ZZAUTOTEST S6-07 Vendor.")],
   [("Open {Vendor-A}'s vendor page.", 'the card shows the whole of "{Term-A} (Inactive)", wrapping if needed.'), ("Open Edit Vendor.", "the selected value shows the whole name and \"(Inactive)\"."),
    ("Open the Credit Terms dropdown.", "{Term-B} and \"{Term-A} (Inactive)\" show in full; long names wrap, nothing is cut off.")],
   ["S6-R6"], start=None)

vd("S6-08", "Without AP/AR Data access the vendor Credit Terms field stays hidden",
   [("Vendor {Vendor-A} exists.", "For example: {Vendor-A} is ZZAUTOTEST S6-08 Vendor.")],
   [NEWV, ("Look at the fields.", '"Credit Terms" does not show, as today.'), ("Close the window.", "the window closes."), ("Open Edit Vendor for {Vendor-A}.", '"Credit Terms" does not show.')],
   ["S6-N1", "PERM-FIELDS"],
   who=('You are signed in as {User-A}, on a custom role, {Role-A}, with the vendor permissions to create and edit vendors but not View and Manage AP/AR Data.',
        "For example: {User-A} is ZZAUTOTEST S6-08 User and {Role-A} is ZZAUTOTEST S6-08 No APAR."))
