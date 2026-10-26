"""Story 2 — Row menu actions (S2-R1 to S2-R12, S2-N1 to S2-N6, S2-E1 to S2-E3, Error Handling). One menu case per term kind and state
(brief point 2): every item, its order, icon, greyed state and exact hover text."""
from ct_lib import C, HOLD, PO_HOLD
from common import *
from po_questions import QN

IC = {"Edit": "pencil", "Make Default for New Customers": "circle check", "Move Customers": "person", "Deactivate": "archive",
      "Reactivate": "rotate", "Delete Credit Term": "trash, in red, below a divider"}
NOCUST = 'Hover "Move Customers".', 'the hover reads "No customers are on this term".'
DEFR = 'the hover reads "This is your default for new customers" with "Pick another default first." below it.'
def used(h): return f'the hover reads "Used by {h}" with "Deactivate it instead to take it out of the pickers." below it.'
HIDE = 'Hover "Deactivate".', 'the hover reads "Hide from customer and vendor pickers".'
SHOW = 'Hover "Reactivate".', 'the hover reads "Show in pickers again".'

def menu(key, title, pre, row, items, hovers, q, start=PAGE, note="", marker=None, tab_click=False):
    """items: list of (label, greyed). hovers: list of (step text, result text)."""
    listing = ", ".join(f'"{l}" ({IC[l]}{", greyed out" if g else ""})' for l, g in items)
    steps = (['Click the "Inactive" tab.'] if tab_click else []) + [f'Click the "⋯" at the right of the {row} row.'] + [h[0] for h in hovers]
    res = (["the Inactive tab shows the term."] if tab_click else []) + \
          [f"the menu shows exactly these items, in this order: {listing}. Nothing else shows."] + [h[1] for h in hovers]
    res = [f"Step {i}: {r}" for i, r in enumerate(res, 1)]
    C(key, "S2", title, [ADMIN()] + pre + [start], steps, res, q, note=note, marker=marker)

menu("S2-01", "COD as the default shows only Move Customers",
     [DEFAULT_COD, ("At least one customer other than the Counter Sale customer holds COD.", None)], '"COD"',
     [("Move Customers", False)], [], ["S2-R1", "S2-R1 MOVE", "S2-N1", "S2-N2", "S2-N4", "S2-R1 MD"])
menu("S2-02", "COD that is not the default can be made the default",
     [("Due on Receipt is the shop's default for new customers.", None), ("At least one customer holds COD.", None)], '"COD"',
     [("Make Default for New Customers", False), ("Move Customers", False)], [], ["S2-R1", "S2-R1 MD", "S2-N1", "S2-N2"])
menu("S2-03", "Due on Receipt shows Make Default and Move Customers only",
     [DEFAULT_COD, ("At least one customer holds Due on Receipt.", None)], '"Due on Receipt"',
     [("Make Default for New Customers", False), ("Move Customers", False)], [], ["S2-R1", "S2-N1", "S2-N2"])
menu("S2-04", "Due on Receipt as the default shows only Move Customers",
     [("Due on Receipt is the shop's default for new customers.", None), ("At least one customer holds Due on Receipt.", None)], '"Due on Receipt"',
     [("Move Customers", False)], [], ["S2-R1", "S2-N2", "S2-N4"])
menu("S2-05", "Credit Hold shows only Move Customers, never Make Default",
     [DEFAULT_COD, ("At least one customer holds Credit Hold.", None)], '"Credit Hold"',
     [("Move Customers", False)], [], ["S2-R1", "S2-N2", "S2-N3", "S4-N3"])
menu("S2-06", "An active standard Net term can be made default, moved or deactivated",
     [DEFAULT_COD, ("Net 45 is active and held by at least one customer.", None)], '"Net 45"',
     [("Make Default for New Customers", False), ("Move Customers", False), ("Deactivate", False)], [HIDE],
     ["S2-R1", "S2-R1 DEACT", "S2-R3", "S2-N1", "KD-NETDEACT", "UFS-10"])
menu("S2-07", "An inactive standard Net term shows Reactivate before Move Customers",
     [DEFAULT_COD, ("Net 50 is deactivated and at least one customer holds it.", None)], '"Net 50"',
     [("Reactivate", False), ("Move Customers", False)], [SHOW], ["S2-R1", "S2-R1 REACT", "S2-R3", "S2-R10", "S2-N1"],
     start=PAGE, tab_click=True)
menu("S2-08", "A standard Net term that is the default cannot be deactivated",
     [("Net 30 is the shop's default for new customers and is held by at least one customer.", None)], '"Net 30"',
     [("Move Customers", False), ("Deactivate", True)], [('Hover "Deactivate".', DEFR)],
     ["S2-R1", "S2-N4", "KD-DEFAULT", "UFS-8"])
menu("S2-09", "An unused term of the shop's own shows every item, Delete last in red",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-09 Fourteen")], "{Term-A}",
     [("Edit", False), ("Make Default for New Customers", False), ("Move Customers", True), ("Deactivate", False), ("Delete Credit Term", False)],
     [NOCUST, HIDE], ["S2-R1", "S2-R1 HEAD", "S2-R1 EDIT", "S2-R1 DEL", "S4-N2", "KD-LOCK", "UFS-9"])
menu("S2-10", "A shop term held by a customer blocks Edit and Delete",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", held by one customer, {Customer-A}, and by no vendor or invoice", "ZZAUTOTEST S2-10 Fourteen and {Customer-A} is ZZAUTOTEST S2-10 Customer")],
     "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", False), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Edit".', used("1 customer")), ('Hover "Delete Credit Term".', used("1 customer"))],
     ["S2-R1", "S2-R2", "S2-N5", "UFS-7", "KD-LOCK"])
menu("S2-11", "A shop term held only by vendors blocks Edit and has no customers to move",
     [DEFAULT_COD, own("{Term-A}", "day 10", ", held by two vendors, {Vendor-A} and {Vendor-B}, and by no customer or invoice", "ZZAUTOTEST S2-11 Tenth, {Vendor-A} is ZZAUTOTEST S2-11 Vendor A and {Vendor-B} is ZZAUTOTEST S2-11 Vendor B")],
     "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", True), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Edit".', used("2 vendors")), NOCUST, ('Hover "Delete Credit Term".', used("2 vendors"))],
     ["S2-R2", "S2-N5", "S6-E2", "T-INUSE"])
menu("S2-12", "A shop term held only by invoices says how many invoices",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer and no vendor today, but by five invoices created while their customer was on it (the customer was then moved to Net 30)", "ZZAUTOTEST S2-12 Fourteen")],
     "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", True), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Edit".', used("5 invoices")), NOCUST, ('Hover "Delete Credit Term".', used("5 invoices"))],
     ["S2-R2", "S1-E2", "T-INUSE"])
menu("S2-13", "The holders text names customers, vendors and invoices with counts",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", held by 12 customers and 3 vendors, and by 40 invoices", "ZZAUTOTEST S2-13 Fourteen")], "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", False), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Edit".', used("12 customers, 3 vendors and 40 invoices"))],
     ["S2-R2", "S2-N5", "S2-R1 EDIT"])
menu("S2-14", "The holders text uses the singular for one of each kind",
     [DEFAULT_COD, own("{Term-A}", "day 5", ", held by exactly 1 customer, 1 vendor and 1 invoice", "ZZAUTOTEST S2-14 Fifth")], "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", False), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Delete Credit Term".', used("1 customer, 1 vendor and 1 invoice"))],
     ["S2-R2", "S2-R1 DEL"])
menu("S2-15", "A shop term held by one customer and two vendors names only those two",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", held by 1 customer and 2 vendors and by no invoice", "ZZAUTOTEST S2-15 Fourteen")], "{Term-A}",
     [("Edit", True), ("Make Default for New Customers", False), ("Move Customers", False), ("Deactivate", False), ("Delete Credit Term", True)],
     [('Hover "Edit".', used("1 customer and 2 vendors"))], ["S2-R2"])
menu("S2-16", "The default shop term blocks Deactivate and Delete with the default reason",
     [own("{Term-A}", "net 14", ", the shop's default for new customers, held by no customer, vendor or invoice", "ZZAUTOTEST S2-16 Fourteen")], "{Term-A}",
     [("Edit", False), ("Move Customers", True), ("Deactivate", True), ("Delete Credit Term", True)],
     [('Hover "Deactivate".', DEFR), ('Hover "Delete Credit Term".', DEFR)],
     ["S2-R1", "S2-N4", "KD-DEFAULT", "UFS-8"])
menu("S2-17", "An inactive unused shop term can be reactivated or deleted",
     [DEFAULT_COD, own("{Term-A}", "net 14", ", deactivated and held by no customer, vendor or invoice", "ZZAUTOTEST S2-17 Fourteen")], "{Term-A}",
     [("Reactivate", False), ("Move Customers", True), ("Delete Credit Term", False)], [SHOW],
     ["S2-R1", "S2-R1 REACT", "S2-R10", "S3-N2"], tab_click=True)
menu("S2-18", "An inactive shop term still held by a customer blocks Delete",
     [DEFAULT_COD, own("{Term-A}", "day 10", ", deactivated and still held by one customer", "ZZAUTOTEST S2-18 Tenth")], "{Term-A}",
     [("Reactivate", False), ("Move Customers", False), ("Delete Credit Term", True)], [('Hover "Delete Credit Term".', used("1 customer"))],
     ["S2-R1", "S2-R10", "S4-N3", "S3-N2"], tab_click=True)

C("S2-19", "S2", "Clicking or pressing Enter on a blocked item does nothing",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", ", held by one customer", "ZZAUTOTEST S2-19 Fourteen"), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click the greyed "Edit".', 'Press the Down arrow key until "Delete Credit Term" is highlighted.', "Press Enter."],
  ["Step 1: the menu opens with \"Edit\" and \"Delete Credit Term\" greyed.", "Step 2: nothing happens: no window opens and the menu stays open.",
   'Step 3: "Delete Credit Term" is highlighted.', "Step 4: nothing happens: no confirmation opens and the menu stays open."],
  ["S2-N6", "S2-R1"])

C("S2-20", "S2", "Make Default asks first and says customers keep their term",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S2-20 Fourteen"), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Make Default for New Customers".', 'Click "Cancel".'],
  ["Step 1: the menu opens.",
   'Step 2: a confirmation opens titled "Make {Term-A} the default?" with the message "New customers start on {Term-A}. Customers you already have keep their current term." and the buttons "Cancel" and "Make Default".',
   'Step 3: the confirmation closes; the "Default" tag stays on COD and no toast shows.'],
  ["S2-R5", "UFS-11", "KD-CONFIRM"])

C("S2-21", "S2", "Make Default moves the tag and changes no existing customer",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S2-21 Fourteen"),
   ("Customer {Customer-A} holds COD, with a credit limit of $0.00.", "For example: {Customer-A} is ZZAUTOTEST S2-21 Customer."),
   ("Write down the COD row's Customers count before you start.", None), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Make Default for New Customers".', 'Click "Make Default".', "Open {Customer-A}'s customer page in a new tab."],
  ["Step 1: the menu opens.", "Step 2: the confirmation opens.",
   'Step 3: the confirmation closes, the "Default" tag moves from COD to {Term-A}, and a green toast shows "{Term-A} is now the default" with the line "New customers start on {Term-A}." The COD row\'s Customers count is unchanged.',
   'Step 4: {Customer-A}\'s "Credit term" still reads COD.'],
  ["S2-R6", "UFS-12", "T-MDVSMC", "T-DEFAULT", "KD-NEWONLY", "KD-ANYACTIVE", "GOAL-1"])

C("S2-22", "S2", "Deactivate acts at once and moves the term to the Inactive tab",
  [ADMIN(), DEFAULT_COD, ("Net 45 is active (customers and vendors may hold it).", None), ("Before you start, the Active tab's count reads {Count-A} and the Inactive tab's {Count-B} (write them down).", "For example: {Count-A} is 14 and {Count-B} is 2."), PAGE],
  ['Click the "⋯" at the right of the "Net 45" row.', 'Click "Deactivate".', 'Click the "Inactive" tab.'],
  ["Step 1: the menu opens.",
   'Step 2: no confirmation opens. The Net 45 row leaves the Active tab, the Active count reads {Count-A} − 1 and the Inactive count {Count-B} + 1 (for example 13 and 3), and a green toast shows "Net 45 deactivated".',
   "Step 3: Net 45 is listed on the Inactive tab in its usual place."],
  ["S2-R7", "UFS-13", "KD-CONFIRM", "KD-NETDEACT"])

C("S2-23", "S2", "Deactivating Net 30 keeps every customer on it, shown as inactive",
  [ADMIN(), DEFAULT_COD, ("Net 30 is held by customer {Customer-A} and by vendor {Vendor-A}.", "For example: {Customer-A} is ZZAUTOTEST S2-23 Customer and {Vendor-A} is ZZAUTOTEST S2-23 Vendor."), PAGE],
  ['Click the "⋯" at the right of the "Net 30" row.', 'Click "Deactivate".', "Open {Customer-A}'s customer page.", "Open Edit Customer.", "Open {Vendor-A}'s vendor page."],
  ["Step 1: the menu opens; \"Deactivate\" is available (not greyed) although Net 30 is in use.",
   'Step 2: the toast "Net 30 deactivated" shows.',
   'Step 3: the customer card\'s "Credit term" reads "Net 30 (Inactive)".',
   'Step 4: the Credit Terms dropdown shows "Net 30 (Inactive)" selected.',
   'Step 5: the vendor card\'s "Credit term" reads "Net 30 (Inactive)".'],
  ["S2-E3", "S2-R7", "S2-N5", "KD-DEACT", "T-INACTIVE"])

C("S2-24", "S2", "Reactivate brings a term back to Active and to the pickers",
  [ADMIN(), DEFAULT_COD, ("Net 50 is deactivated.", None), ("Customer {Customer-A} holds COD.", "For example: {Customer-A} is ZZAUTOTEST S2-24 Customer."), PAGE_INACTIVE],
  ['Click the "⋯" at the right of the "Net 50" row.', 'Click "Reactivate".', 'Click the "Active" tab.', "Open Edit Customer for {Customer-A} in a new tab.", "Open the Credit Terms dropdown."],
  ["Step 1: the menu opens.",
   'Step 2: no confirmation opens. Net 50 leaves the Inactive tab, both tab counts update, and a green toast shows "Net 50 reactivated".',
   "Step 3: Net 50 is back on the Active tab between Net 45 and Net 60.", "Step 4: Edit Customer opens.",
   "Step 5: Net 50 is offered again, between Net 45 and Net 60."],
  ["S2-R8", "UFS-14", "KD-DEACT"])

C("S2-25", "S2", "Delete asks for confirmation and removes an unused term",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-25 Fourteen"), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Delete Credit Term".', 'Click "Cancel".', 'Click the "⋯" at the right of the {Term-A} row.', 'Click "Delete Credit Term".', 'Click the red "Delete Credit Term" button.'],
  ["Step 1: the menu opens.",
   'Step 2: a confirmation opens titled "Confirmation" with the message "Are you sure you want to delete this credit term?" and the buttons "Cancel" and a red "Delete Credit Term".',
   "Step 3: the confirmation closes and {Term-A} is still listed.", "Step 4: the menu opens.", "Step 5: the confirmation opens again.",
   'Step 6: the confirmation closes, {Term-A} is removed from the page, the Active count goes down by 1, and a green toast shows "{Term-A} deleted".'],
  ["S2-R9", "UFS-15", "UFS-16", "KD-CONFIRM", "KD-LOCK"])

C("S2-26", "S2", "A double click on Make Default saves once",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S2-26 Fourteen"), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Make Default for New Customers".', 'Double-click "Make Default" quickly.', 'Open the "⋯" page menu.', 'Click "Audit Log".'],
  ["Step 1: the menu opens.", "Step 2: the confirmation opens.",
   'Step 3: the button turns disabled while saving; exactly one toast "{Term-A} is now the default" shows.',
   'Step 4: the page menu opens.', 'Step 5: the Credit Terms Log holds exactly one new "Default changed" row, "COD → {Term-A}".'],
  ["S2-R11", "S12-R3 DEF"])

C("S2-27", "S2", "A double click on Delete Credit Term deletes once",
  [ADMIN(), DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-27 Fourteen"), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Delete Credit Term".', 'Double-click the red "Delete Credit Term" button quickly.'],
  ["Step 1: the menu opens.", "Step 2: the confirmation opens.",
   'Step 3: the button turns disabled while deleting; one toast "{Term-A} deleted" shows and no error alert (such as "Credit term not found.") appears.'],
  ["S2-R11"])

C("S2-28", "S2", "A long term name shows in full in the toast",
  [ADMIN(), DEFAULT_COD, ("The shop's own term {Term-A} has a 31-character name, due 14 days after the invoice date, and is unused.",
                          "For example: {Term-A} is ZZAUTOTEST S2-28 Long Name 0123 (31 characters)."), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Deactivate".'],
  ["Step 1: the menu opens.", 'Step 2: the toast reads "{Term-A} deactivated" with every character of the name; a long line wraps and nothing is cut off or replaced by "...".'],
  ["S2-R12"])

C("S2-29", "S2", "Renaming the unused default term keeps it the default",
  [ADMIN(), own("{Term-A}", "net 14", ", the shop's default for new customers and held by no customer, vendor or invoice", "ZZAUTOTEST S2-29 Fourteen"),
   ("A new name for it, {Term-B}, that no term has.", "For example: {Term-B} is ZZAUTOTEST S2-29 Two Weeks."), PAGE],
  ['Click the "⋯" at the right of the {Term-A} row.', 'Click "Edit".', "Replace the Name with {Term-B}.", 'Click "Save Changes".'],
  ['Step 1: the menu opens and "Edit" is available.', 'Step 2: the "Edit Credit Term" window opens.', "Step 3: the Name reads {Term-B}.",
   'Step 4: the window closes, the toast "{Term-B} saved" shows, and the row now reads {Term-B} with the "Default" tag still on it.'],
  ["S2-E1", "S2-R4"])

TWO = [("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S2 Second Admin.")]
def B_MD(t):
    return ([f'In {{User-B}}\'s browser, click the "⋯" at the right of the {t} row.', f'In {{User-B}}\'s browser, click "Make Default for New Customers".', 'In {User-B}\'s browser, click "Make Default".'],
            ["{User-B}'s menu opens.", "{User-B}'s confirmation opens.", f'{{User-B}} sees the toast "{t} is now the default".'])
def B_DEACT(t):
    return ([f'In {{User-B}}\'s browser, click the "⋯" at the right of the {t} row.', 'In {User-B}\'s browser, click "Deactivate".'],
            ["{User-B}'s menu opens.", f'{{User-B}} sees the toast "{t} deactivated".'])
def B_DEL(t):
    return ([f'In {{User-B}}\'s browser, click the "⋯" at the right of the {t} row.', 'In {User-B}\'s browser, click "Delete Credit Term".', 'In {User-B}\'s browser, click the red "Delete Credit Term" button.'],
            ["{User-B}'s menu opens.", "{User-B}'s confirmation opens.", f'{{User-B}} sees the toast "{t} deleted".'])
def seq(*parts):
    st, rs = [], []
    for a, b in parts: st += a; rs += b
    return st, [f"Step {i}: {r}" for i, r in enumerate(rs, 1)]
def mine(step, res): return ([step], [res])

BOTH = ("Starting screen: the Credit Terms page is open on the Active tab in both browsers.", None)
st, rs = seq(B_MD("{Term-A}"), mine('In your browser, without reloading, click the "⋯" at the right of the {Term-A} row.', 'your menu still shows "Deactivate" available (your page has not reloaded).'),
             mine('Click "Deactivate".', 'the app\'s error alert shows "This is your default for new customers. Pick another default first." and {Term-A} stays on the Active tab.'))
C("S2-30", "S2", "Deactivating a term another user just made the default is refused",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S2-30 Fourteen"), BOTH], st, rs, ["S2-E2", "EH-S2", "UFS-30"])

st, rs = seq(mine('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), mine('Click "Delete Credit Term".', "the delete confirmation opens."),
             mine("In {User-B}'s browser, set Credit Terms to {Term-A}.", "{Term-A} is selected in {User-B}'s Edit Customer."),
             mine("In {User-B}'s browser, click Save.", "the customer is saved on {Term-A}."),
             mine('In your browser, click the red "Delete Credit Term" button.', 'the app\'s error alert shows "Used by 1 customer. Deactivate it instead to take it out of the pickers." The confirmation stays open and {Term-A} is not deleted.'))
C("S2-31", "S2", "Deleting a term another user just put a customer on is refused",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-31 Fourteen"),
   ("Customer {Customer-A} holds COD.", "For example: {Customer-A} is ZZAUTOTEST S2-31 Customer."),
   ("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-A}.", None)],
  st, rs, ["EH-S2", "S2-E2", "UFS-29"])

st, rs = seq(mine('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), mine('Click "Delete Credit Term".', "the delete confirmation opens."),
             B_MD("{Term-A}"), mine('In your browser, click the red "Delete Credit Term" button.', 'the app\'s error alert shows "This is your default for new customers. Pick another default first." The confirmation stays open and {Term-A} is not deleted.'))
C("S2-32", "S2", "Deleting a term another user just made the default is refused",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-32 Fourteen"), BOTH], st, rs, ["EH-S2", "S2-E2", "UFS-30"])

st, rs = seq(mine('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), mine('Click "Make Default for New Customers".', "the Make Default confirmation opens."),
             B_DEACT("{Term-A}"), mine('In your browser, click "Make Default".', 'the app\'s error alert shows "Pick an active term other than Credit Hold." The Default tag stays on COD.'))
C("S2-33", "S2", "Making a term the default after another user deactivated it is refused",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S2-33 Fourteen"), BOTH], st, rs, ["EH-S2", "UFS-32", "KD-ANYACTIVE"])

st, rs = seq(mine('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), mine('Click "Delete Credit Term".', "the delete confirmation opens."),
             B_DEL("{Term-A}"), mine('In your browser, click the red "Delete Credit Term" button.', 'the app\'s error alert shows "Credit term not found." and the confirmation stays open.'))
C("S2-34", "S2", "Deleting a term another user already deleted says it was not found",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-34 Fourteen"), BOTH], st, rs, ["EH-S2", "UFS-33"])

st, rs = seq(([f'In {{User-B}}\'s browser, click the "⋯" at the right of the {{Term-A}} row.', 'In {User-B}\'s browser, click "Edit".', "In {User-B}'s browser, replace the Name with {Term-B}.", 'In {User-B}\'s browser, click "Save Changes".'],
               ["{User-B}'s menu opens.", '{User-B}\'s "Edit Credit Term" window opens.', "the Name reads {Term-B}.", '{User-B} sees the toast "{Term-B} saved".']),
             mine('In your browser, without reloading, click the "⋯" at the right of the {Term-A} row.', "your menu opens."),
             mine('Click "Make Default for New Customers".', "the confirmation opens."),
             mine('Click "Make Default".', "the save is refused with the reason the PO gives (see the note); the page keeps its state."))
C("S2-36", "S2", "Acting on a term another user renamed after the page loaded",
  [ADMIN()] + TWO + [DEFAULT_COD, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S2-36 Fourteen"),
   ("A new name, {Term-B}, that no term has.", "For example: {Term-B} is ZZAUTOTEST S2-36 Renamed."), BOTH],
  st, rs, ["S2-E2"], marker=PO_HOLD(QN["changed-meanwhile-msg"]),
  note=f"The PRD says a change by another user is refused \"with the reason in S2 Error Handling\", but none of those texts covers a rename. Question {QN['changed-meanwhile-msg']} on Chris Ward's sheet (shared with him 23 Oct 2026) asks; this case is held until he answers.")
