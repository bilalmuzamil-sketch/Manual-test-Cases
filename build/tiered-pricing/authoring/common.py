"""Shared precondition, step and record phrases for the Tiered Pricing cases (plain words, the screens' own labels).
Labels from PRD v37 and the design (1794631438-539a): Settings › Pricing; Tiers, Matrices, Fixed Rules tabs; New Tier; Create Tier; Cancel;
Pricing and Customers tabs; Set Rule; Undo; Archive; Reactivate; Delete; Audit Log; Remove Customers; Close; New Matrix; Create Matrix;
Edit; Save; Work Order Matrix; Part Sale Matrix; Separate Part Sale pricing; Turn Off; Duplicate; Add Range; Change All; Keep Editing;
Discard Changes; Price Part Simulator; Settings › Categories; Edit Customer; Work Order Tier; Part Sales Tier; Manage Customers."""
ADMIN = "Sign in as an Admin whose role has 'Settings — Parts' and 'See Financial Data'."
ADMIN_CUST = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — View' and "
              "'Customers — Create & Edit'.")
ADMIN_WO = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — Create & Edit', "
            "'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'.")
DESK = "Use a desktop browser window at least 1440 pixels wide, at 100% zoom."
W1440 = "Use a desktop browser window exactly 1440 pixels wide, at 100% zoom."
STAGING = "Use the staging site, where the Tiered Pricing release is deployed on top of data from before the release."
NEW_NAME = "with a name no other tier uses"
STRESS_SP = ("a long name with spaces that no other record of that kind has, at least 50 characters "
             "(for example Northern Alberta Heavy Equipment Fleet Pricing Plan)")
STRESS_NO = ("a long name with no spaces, at least 50 characters "
             "(for example NorthernAlbertaHeavyEquipmentFleetPricingPlanTier)")
STRESS_SPECIAL = "a name with the characters & \" ' < > in it (for example A&B \"Fleet\" O'Neil <Tier>)"

# steps
TIERS = "Click the Tiers tab on Settings › Pricing."
MATRICES = "Click the Matrices tab on Settings › Pricing."
CATEGORIES = "Open Settings › Categories."
RELOAD = "Reload the page."
SAVE = "Click Save."
EDIT = "Click Edit."


def tier(lab, extra="", archived=False):
    return f"Have a new {'archived ' if archived else ''}tier for this test, tier {lab}, {NEW_NAME}{extra}."


def matrix(lab, extra=""):
    return f"Have a new matrix for this test, matrix {lab}{extra}."


def category(lab, extra=""):
    return f"Have a new category for this test, category {lab}{extra}."


def customer(lab, extra=""):
    return f"Have a new customer for this test, customer {lab}{extra}."


def open_tier(lab): return f"Click tier {lab}'s row on the Tiers list."
def open_matrix(lab): return f"Click matrix {lab}'s name on the Matrices list."
