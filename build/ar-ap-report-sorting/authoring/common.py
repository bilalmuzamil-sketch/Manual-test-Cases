"""Shared precondition sentences and report facts (tester text: what must exist, never how to make it; examples on the second line).
Column names are PRD v5 S2-R1's, letter for letter (A/R lower-case second words, A/P capitals)."""
LOC_A, LOC_B, LOC_C = "Staging Heavy Duty - 9919", "Staging Lethbridge - 4310", "a third staging location"

R = {
    "ARS": dict(n="A/R Summary", fam="A/R", party="customer", parties="customers", Party="Customer", Parties="Customers",
                cols=["name", "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total"],
                text=["Location"], dates=[], money=["Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total"],
                past=None, num=None, opened="name", group=None, headline="Total", doc="invoice"),
    "APS": dict(n="A/P Summary", fam="A/P", party="vendor", parties="vendors", Party="Vendor", Parties="Vendors",
                cols=["name", "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total"],
                text=["Location"], dates=[], money=["Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total"],
                past=None, num=None, opened="name", group=None, headline="Total", doc="bill"),
    "ARD": dict(n="A/R Detail", fam="A/R", party="customer", parties="customers", Party="Customer", Parties="Customers",
                cols=["Date", "Location", "Transaction type", "ID", "Customer full name", "Due date", "Amount", "Open balance"],
                text=["Location", "Transaction type", "Customer full name"], dates=["Date", "Due date"], money=["Amount", "Open balance"],
                past=None, num="ID", opened="Customer full name", group="aging bucket", headline="Open balance", doc="invoice"),
    "ARC": dict(n="A/R Collection", fam="A/R", party="customer", parties="customers", Party="Customer", Parties="Customers",
                cols=["Date", "Location", "Transaction type", "ID", "Due date", "Past due", "Amount", "Open balance"],
                text=["Location", "Transaction type"], dates=["Date", "Due date"], money=["Amount", "Open balance"],
                past="Past due", num="ID", opened="Date", group="customer", headline="Open balance", doc="invoice"),
    "APD": dict(n="A/P Detail", fam="A/P", party="vendor", parties="vendors", Party="Vendor", Parties="Vendors",
                cols=["Date", "Location", "Transaction Type", "No.", "Vendor Name", "Due Date", "Past Due", "Amount", "Open Balance"],
                text=["Location", "Transaction Type", "Vendor Name"], dates=["Date", "Due Date"], money=["Amount", "Open Balance"],
                past="Past Due", num="No.", opened="Vendor Name", group="aging bucket", headline="Open Balance", doc="bill"),
    "APU": dict(n="A/P Unpaid Invoices", fam="A/P", party="vendor", parties="vendors", Party="Vendor", Parties="Vendors",
                cols=["Date", "Location", "Transaction Type", "No.", "Vendor Name", "Due Date", "Past Due", "Amount", "Open Balance"],
                text=["Location", "Transaction Type"], dates=["Date", "Due Date"], money=["Amount", "Open Balance"],
                past="Past Due", num="No.", opened="Date", group="vendor", headline="Open Balance", doc="bill"),
}
AR3, AP3 = ["ARS", "ARD", "ARC"], ["APS", "APD", "APU"]
SUMMARY_OF = {"A/R": "ARS", "A/P": "APS"}
DRILL_TO = {"ARS": "ARC", "APS": "APU"}
BUCKETS = ["91 or more days past due", "61-90 days past due", "31-60 days past due", "1-30 days past due", "Current"]

def ADMIN(loc="A"):
    return (f'You are signed in as a user with the "Admin" role, with {{Location-{loc}}} as your current location.',
            f"For example: {{Location-{loc}}} is {LOC_A if loc == 'A' else LOC_B}.")
TWO_LOC = ("The organization has open documents in these reports at two locations, {Location-A} and {Location-B}, and you are enrolled at both; {Location-A}'s name comes first in A to Z order.",
           f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}.")
TWO_LOC_B = ("The organization has open documents in these reports at a second location, {Location-B}, where you are also enrolled.",
             f"For example: {{Location-B}} is {LOC_B}.")
def START(code, extra="", width="1440 px"):
    return f"Starting screen: Reports > Finance > {R[code]['n']} is open in a desktop browser window {width} wide, as opened from the Reports menu{extra}."
def namecol(code):
    """The tester's words for the name column of a Summary (PRD: "the name column")."""
    return f"the {R[code]['party']} name column (the first column)"
def col(code, c):
    return namecol(code) if c == "name" else f'"{c}"'
def inside(code):
    g = R[code]["group"]
    return {"aging bucket": "inside each aging bucket", "customer": "inside each customer group", "vendor": "inside each vendor group", None: "in the list"}[g]
def docs(code):
    return "invoices, credit memos and deposits" if R[code]["fam"] == "A/R" else "bills and vendor credits"
def ex(key, *names):
    """Example names that carry the case key, so every case owns its records (Rule 117 second amendment)."""
    return [f"ZZAUTOTEST {key} {n}" for n in names]
