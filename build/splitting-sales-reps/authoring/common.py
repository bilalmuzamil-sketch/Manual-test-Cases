"""Shared precondition sentences (tester text: what must exist, never how to make it; examples on the second line)."""
ADMIN = ('You are signed in as a user with the "Admin" role at {Location-A}.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
REPS2 = ('Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}.',
         "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.")
REPS3 = ('Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}.',
         "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.")
CUST = ("Customer {Customer-A} has no sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet.")
def WO(state='its card shows one "Sales Representative" field reading "Unassigned"', n=1):
    inv = "invoiced" in state.replace("not invoiced", "")
    lines = "" if ("labor line" in state or inv) else "it has one approved labor line and one part, and "
    return (f"Work order {{Work-order-{n}}} for {{Customer-A}} {'exists' if inv else 'is open and not invoiced'}; {lines}{state}.",
            f"For example: {{Work-order-{n}}} is S2-{40000 + n}.")
def START(where="{Work-order-1} is open in a desktop browser at least 1024 px wide"):
    return f"Starting screen: {where}."
WO_START = START()
DESK = "a desktop browser at least 1024 px wide"
