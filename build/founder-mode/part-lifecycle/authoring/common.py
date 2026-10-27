"""Shared plain precondition bullets and design words for the Parts Lifecycle cases (tester text: what to set up, never how).
Screen words come from PRD v33 and the design canvas boards (Inventory, Active / Inactive tabs, the three-dot actions button, Cycle
count, Deactivate parts, Activate parts, Export, New Inventory Part, Edit Inventory Part, Track quantities and cost of goods, Inventory
Tracking, Add Bin Location, Default, Part History clock icon). The build is not available yet, so every label is checked by the build
verification session."""
import re
import pllib as L

ADMIN = "Sign in as an Admin at the test location."
ADMIN_TWO = "Sign in as an Admin who can switch between two locations: the test location and location B."
START = "Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab."
START_INACTIVE = "Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab."
LIGHT = "Make sure the app is in the Light theme."
NO_COUNT = "Make sure no Cycle count is running on the Inventory list."
GLOBAL = "Make sure the Search box in the top bar is the global search, which lists inventory parts."
TWO_TABS = "Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user."
FILEAPP = "Use a computer that can open the exported file in a spreadsheet program."
WORDS = {3: "three", 4: "four", 5: "five"}
def SHARED(names, n=None):
    """'Give parts A and B part numbers that start with the same text, so one search lists both.' (n: the number of parts named)"""
    k = n or len(re.findall(r"\b[A-Z]\b", names))
    return (f"Give {names} part numbers that start with the same text, so one search lists "
            + ("both." if k == 2 else f"all {WORDS.get(k, k)}."))
MENU = "Click the three-dot actions button (⋮) in the toolbar, to the left of New Inventory Part."
MENU2 = "Click the three-dot actions button (⋮)."
TYPE_SHARED = "Type the shared start of the part numbers in the Search box."
TYPE_SHARED_AGAIN = "Type the shared start of the part numbers in the Search box again."
X = "Click the X at the right end of the dark bar."

# design canvas notes, verbatim (checked by pllib.check against canvas.json)
def note(start):
    for n in L.CANVAS["annotations"]:
        if L.ws(n["text"]).startswith(start): return L.ws(n["text"])
    raise KeyError(start)
