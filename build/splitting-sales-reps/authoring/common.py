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

# 22 Oct 2026, one-action-steps pass (QA lead: "Yes, fix all 113 cases"): a step and its result are written as one pair, so every
# step has exactly one "Step N:" result and the numbering can never drift when a bundled step is split.
def SR(*pairs):
    """pairs: (step, result without the "Step N: " prefix). Returns (steps, results)."""
    return [s for s, _ in pairs], [f"Step {i}: {r}" for i, (_, r) in enumerate(pairs, 1)]
# The Sales By Representative report, one action per step (was one bundled step: open, date range, Show Unassigned, Sales Type column).
OPEN_SBR = ("Open Reports > Sales By Representative.", "the Sales By Representative report opens.")
OPEN_SBC = ("Open Reports > Sales By Customer.", "the Sales By Customer report opens.")
TODAY = ("Set the date range to today.", "the report shows today's date range.")
UNASSIGNED_ON = ("Turn Show Unassigned on.", "Show Unassigned is on.")
def SALES_TYPE_ON(result): return ("Turn the Sales Type column on in the column selector.", result)
MENU = ("Open the work order's menu.", "the work order's menu opens.")
CLOSE_LOG = ("Close the log.", "the log closes.")

# 22 Oct 2026, Rule 136 pass ("shorter but runnable"): the invoice rows of Sales By Representative show only once a representative's
# row is expanded (SBR spec v28, Story 6: "the user can expand a rep's row with a chevron to reveal every invoice"), so a case that reads
# an invoice row expands that representative first. State a case does not test (the report open for today, Show Unassigned on, the
# Sales Type column on) is part of the starting screen, not a step.
def SBR_TODAY(extra=""):
    return START("Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide" + extra)
def EXPAND(who, result): return (f"Expand {who}.", result)
EXPAND_UNASSIGNED = lambda result: ('Expand "Unassigned".', result)
EXPAND_ALL = lambda result: ("Click the chevron in the Date column header to expand every row.", result)
CEDIT = START("{Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide")
