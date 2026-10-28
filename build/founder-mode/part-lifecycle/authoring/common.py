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

# ---------------------------------------------------------------- 28 Oct 2026 named set: Chris Ward's answers 13-27 (27 Oct 2026)
# verbatim from ../full-pass-2026-10-27/ANSWERS-13-27-2026-10-27.md (pllib.check proves each one word for word)
from pllib import PO27
A13B = PO27(13, "(b) No. Global search never lists a core, active or inactive, tracked or not, the same as today (S9-R18a).")
A15 = PO27(15, "No. Delete stays disabled until the page is reloaded (S11-E5). Note that an open part request or a part return using the entry "
               "also keeps Delete disabled, not only an inventory part (S11-R3c).")
A16 = PO27(16, "(a) Tracked. The import has no tracking column, and it never changes an existing part's tracking. (b) Yes, the \"name\" column "
               "is the part's description (S7-N11).")
A17 = PO27(17, "Settings. The path is Settings → Parts → Bin Locations (S5-E2). Roles & Permissions is also under Settings (S12-R6).")
A19 = PO27(19, "(a) Yes, the X stays. It's part of the standard dialog. (b) Yes, it does exactly what Cancel does: nothing changes, and from the "
               "part window you return with your picked status kept. Esc and clicking outside don't close it (S10-R11a).")
A20 = PO27(20, "Yes, the board 7.2 note is out of date. Follow the page: the detail page has no Delete. Delete is in the \"Edit Library Part\" "
               "window (S11-R3).")
A21 = PO27(21, "(a) It wraps onto more lines, as on board 2.6. The full entry always shows and is never cut short (S10-R21).")
A22A = PO27(22, "(a) No. Without Vendor Order Management, Parts → Returns is hidden and refused.")
A22B = PO27(22, "(b) Not on screen: without Create & Edit, the Create Return button doesn't show. Today the Create Return page still opens if its "
                "address is typed directly. That's a gap in production now, which this feature doesn't change.")
A22C = PO27(22, "(c) Not through normal screens. Vendor Order Management → Create & Edit, which is what shows Create Return, also gives part "
                "search access, so every role that can start a return can search parts. To see the S9-N3 error, use a role with Vendor Order "
                "Management → View only and none of the other settings that give part search access (Part Library & Inventory → View, Part "
                "Sales → Create & Edit, work order pick parts, Settings Parts, See financial data). Then type the Create Return address "
                "directly and search for a part.")
A23 = PO27(23, "\"AB-100 already exists at this location.\" (S7-N3), or the inactive version (S7-N4) if the AB-100 here is inactive. The "
               "\"{location}\" wording shows only for a clash at another location that stocks the part, or for a rename made on the Part "
               "Library page (S13-N1a).")
A24 = PO27(24, "Only these show through normal screen use: \"This Part Library entry is in use and cannot be deleted.\", \"Part Library entry "
               "not found.\" (save an entry deleted in another tab, S11-E4), and \"Part Library entry not found for ID: {id}.\" (open the "
               "address of a deleted entry).")
A26 = PO27(26, "It depends on the line. A part already received onto a work order or part sale line keeps the number it was added with. A part "
               "request not yet received or returned takes the new number (S13-R19e).")
A27 = PO27(27, "Changing a user's role logs that user out on their next action, with \"Session expired, please log in again.\" Until then the "
               "old controls stay on screen. After logging back in, they follow the new role.")
A27R = PO27(27, "For S8-N1 to S8-N3, use a role without Part Library & Inventory Create & Edit, Vendor Order Management Create & Edit, Part "
                "Sales Delete, Settings Parts or See financial data.")
BINS = "Bin Locations (Settings, then Parts, then Bin Locations)"
