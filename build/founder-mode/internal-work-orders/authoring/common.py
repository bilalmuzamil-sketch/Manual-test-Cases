"""Shared precondition, step and result phrases for the Internal Work Orders cases (plain words, the screen's own labels).
Labels from PRD v1.0 (Final, 9 Nov 2026). The screen's words used here: Settings > Work Orders; Internal Work Orders (toggle, page,
report); Save settings; Which customers are your own company?; Do this later; Save; Edit Customer; Internal customer; Default internal
category; PO is required; Edit Asset; Internal category; Administration > Service > Internal Work Orders; Internal categories; No Charge
categories; New Internal Category; New No Charge Category; Requires the original work order; Default category; Show archived; Restore;
Archive; New Work Order; Asset Here?; No Charge; Category; Original work order; Original line; Not in ShopView; Convert to No Charge;
Convert to Billable; Change category; Add Work Order Fee / Discount; Change Customer; Finance tab; Create invoice; Close Work Order;
Mark Reviewed; Reopen Work Order; Reverse; Issue Credit; Add Deposit; Send to Portal; Request IBS Approval; Shop supplies; Mark as No
Charge; Mark as Billable; Edit Line; New Line; Edit line; Delete line; Integrations > QuickBooks; ShopView Accounts; Cost of Parts;
Accounting > Account Mappings; Accounting Events; Retry; QB Unexported; Reports; Internal Work Orders report; By work order and line;
By technician; Technician Efficiency; Export Reports; Customer Invoice; Include internal and no-charge work orders."""
ADMIN = "Sign in as an Admin at the test location."
DESK = "Use a desktop browser at least 1440 pixels wide."
PHONE = "Use a phone, or a browser window narrowed to 390 pixels wide, signed in to the same account."
ON = "Make sure the Internal Work Orders setting is on in Settings > Work Orders."
OFF = "Make sure the Internal Work Orders setting is off in Settings > Work Orders."
NO_ACCT = "Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub)."
QB = ("Make sure the test location is connected to QuickBooks Online, with Inventory Asset and Cost of Parts mapped on its ShopView "
      "Accounts page, and that AccountingHub is not enabled.")
QB_ONLY = "Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled."
AH = "Make sure AccountingHub is enabled for the organization and the test location has no QuickBooks Online connection."
QB_VIEW = "Have access to the QuickBooks Online company of the test location, so its journal entries can be read."
REVIEW_OFF = "Make sure Require Review Before Completion is off in Settings > Work Orders."
REVIEW_ON = "Make sure Require Review Before Completion is on in Settings > Work Orders."
NAME_NOTE = ("Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's "
             "name exactly as it is saved; every other word of the message must match exactly.")
# Steps used in many cases
OPEN_WO = "Open work order 1."
FIN = "Open the Finance tab."
MENU = "Open the work order's three-dots menu."
CLOSE_BTN = "Click Close Work Order in the work order header."
CONFIRM_CLOSE = "Click Close Work Order in the confirmation."
CREATE_INV = "Click Create invoice."
RELOAD = "Reload the page."
SAVE = "Click Save."


def cust(label, extra=""):
    return f"Have a new customer for this test, customer {label}{extra}."


def icust(label="A", extra=""):
    return f"Have a new customer for this test, customer {label}, flagged as an Internal customer{extra}."


def _st(status):
    """A bare status name reads "in status Approved"; phrases ("in Estimate", "closed today", "invoiced") stay as written."""
    return f"in status {status}" if status[:1].isupper() and not status.startswith("In status") else status


def wo(n=1, c="A", status="in Estimate", extra=""):
    return f"Have a new work order for this test, work order {n}, for customer {c}, {_st(status)}{extra}."


def ncwo(n=1, c="A", cat="Goodwill", status="in Estimate", extra=""):
    return f"Have a new No Charge work order for this test, work order {n}, for customer {c}, category {cat}, {_st(status)}{extra}."


def iwo(n=1, c="A", status="in Estimate", extra=""):
    return f"Have a new internal work order for this test, work order {n}, for internal customer {c}, {_st(status)}{extra}."


def role(what):
    return f"Sign in as a user whose role {what}, at the test location."


STOCK_PART = "one approved line with one stock part picked from inventory at a cost of $40.00 each, quantity 2"
LABOR_2H = "one approved labor line of 2.0 hours"
