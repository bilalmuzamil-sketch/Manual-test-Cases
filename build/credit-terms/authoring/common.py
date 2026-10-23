"""Shared precondition sentences (tester text: what must exist, never how to make it; examples on the second line).
Screen words come from PRD v3 and today's screens (customer card "Credit term", Edit Customer "Credit Terms", Settings Finance group
"Payment Methods", Roles & Permissions); the build is not available yet, so every label is checked by the build verification session."""
LOC_A, LOC_B = "Staging Heavy Duty - 9919", "Staging Lethbridge - 4310"

def ex(key, *names):
    """Example names that carry the case key, so every case owns its records."""
    return [f"ZZAUTOTEST {key} {n}" for n in names]

def ADMIN(loc="A"):
    return (f'You are signed in as a user with the "Admin" role, working in {{Location-{loc}}}.',
            f"For example: {{Location-{loc}}} is {LOC_A if loc == 'A' else LOC_B}.")

PAGE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group) is open on the Active tab.', None)
PAGE_INACTIVE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group) is open on the Inactive tab.', None)
STD_ACTIVE = ("All twelve standard terms are active and COD is the default for new customers.", None)
DEFAULT_COD = ("COD is the shop's default for new customers.", None)

def own(ph, rule, extra="", example=None):
    """One of the shop's own terms. rule: 'net N' or 'day N'."""
    kind, n = rule.split()
    r = f"due {n} day{'s' if n != '1' else ''} after the invoice date" if kind == "net" else f"due on day {n} of the following month"
    return (f"The shop has its own active term {ph}, {r}{extra}.", f"For example: {ph} is {example}." if example else None)

def wo_invoice(ph_wo, ph_cust, extra=""):
    return f"Work order {ph_wo} for {ph_cust} is complete and ready to invoice (every part received, review done){extra}."

ORD = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 10: "10th", 11: "11th", 12: "12th", 13: "13th", 15: "15th", 21: "21st", 22: "22nd",
       23: "23rd", 25: "25th", 28: "28th", 29: "29th", 30: "30th", 31: "31st"}
