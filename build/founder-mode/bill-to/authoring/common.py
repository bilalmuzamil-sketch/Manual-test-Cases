"""Shared precondition, step and result phrases for the Bill To cases (plain words, the screen's own labels).
Labels from PRD v0.5 and, for the screen's own words only, the design captions (design-2026-11-09/files/project/*.dc.html, read only):
Customers; New Customer; Edit Customer; Save; Cancel; Delete; Bill Invoices To; This customer; (this customer); Change; Pays for; Close;
Address 1; Address 2; Add Address 2; Remove Address 2; Credit Terms; Credit Limit; Sales Representative; IBS; Contacts; Assets;
Customer card; Authorizer; Bill To; No authorizer; Change Customer (two arrows at the top right of the customer card); Finance tab;
Create Invoice; Add Deposit; Create Deposit; Submit Deposit; Deposits tab; Go To Invoice; Open Deposits; Change Bill To; Credit Hold;
Over Limit; Customer PO; PO is required; Invoices tab; Service For; New Payment; New Customer Payment; Make Payment; Reverse; Issue Credit;
Delete Customer; Remove As Default Bill To; Remove as default Bill To; Remove; Confirmation; Work Order Log; Bill To changed;
Work Orders tab; Customer: All customers; Status; Search customers; Imported; New Work Order; New Part Sale; Split Work Order;
Split Part Sale."""
ADMIN = "Sign in as an Admin at the test location."
DESK = "Use a desktop browser at least 1440 pixels wide."
NAME_NOTE = ("Words in square brackets in a message stand for the value they name, such as customer B's name exactly as it is saved; "
             "every other word of the message must match exactly.")
OPEN_WO = "Open work order 1."
OPEN_PS = "Open part sale 1."
EXPAND = "Expand the Customer card."
CLICK_BT = "Click the Bill To field."
HOVER_BT = "Hover over the Bill To field."
RELOAD = "Reload the page."
FIN = "Open the Finance tab."
CREATE_INV = "Click Create Invoice."
SAVE = "Click Save."


def cust(label, extra=""):
    return f"Have a new customer for this test, customer {label}{extra}."


def wo(n=1, c="A", status="in Estimate", bill=None, extra=""):
    bt = "that bills itself" if bill is None else f"billed to customer {bill}"
    return f"Have a new work order for this test, work order {n}, for customer {c}, {status.rstrip(',')}, {bt}{extra}."


def ps(n=1, c="A", status="open", bill=None, extra=""):
    bt = "that bills itself" if bill is None else f"billed to customer {bill}"
    return f"Have a new part sale for this test, part sale {n}, for customer {c}, {status.rstrip(',')}, {bt}{extra}."


def role(what):
    return f"Sign in as a user whose role {what}, at the test location."


def bt_reads(x):
    return f"The Customer card's \"Bill To\" field reads customer {x}'s name."


BT_SELF = 'The Customer card shows a "Bill To" field under Authorizer, reading "This customer".'
M1_ONE = ("This work order has a {amt} deposit from [customer {c}'s name]. Reverse it, change the Bill To, then take the deposit again "
          "under the new Bill To.")
M1_MANY = ("This work order has {amt} in deposits from [customer {c}'s name]. Reverse them, change the Bill To, then take the deposits "
           "again under the new Bill To.")
M2 = "Cannot invoice. The Bill To customer, [customer {c}'s name], is on Credit Hold"
M4 = "Invoiced. Reverse the invoice to change who's billed."
CS_PICK = "Counter Sale can't be the Bill To for another customer."
CS_SAVE = "Counter Sale always bills itself."
