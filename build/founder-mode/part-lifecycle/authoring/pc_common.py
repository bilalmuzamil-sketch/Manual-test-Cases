"""Phase C's own shared strings (27 Oct 2026). Imported by cases_s11, cases_s12, cases_s13 and cases_iv only.
Its three import-time adjustments were merged by the integration step on 27 Oct 2026 and deleted here: the Stories 11-13 NO_MANUAL /
NO_MANUAL_UFS rows are in requirement_map.py; "part request" allowed by pllib.JARGON and the Inventory Value From line naming bug
SV-10380 (pllib.IV_BUG in quotes_block) are in pllib.py."""
import pllib as L

# ---------------------------------------------------------------- shared tester strings (Phase C)
START_PL = "Start on the Part Library page (Parts in the top bar, then Part Library in the left menu)."
START_A = "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."
START_IV = "Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today."
START_IMPORT = "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."
TYPE_A = "Type part A's part number in the Search box."
TYPE_B = "Type part B's part number in the Search box."
ROW_A = "Click the part A row."
ROW_B = "Click the part B row."
PENCIL = "Click the pencil icon beside the entry's name in the Part details panel."
PARTS = "Click Parts in the top bar."
TO_PL = "Click Part Library in the left menu."
TO_INV = "Click Inventory in the left menu."
CLOCK_A = "Click the clock icon (Part History) at the left of the part A row."
TO_B = "Pick location B in the location selector at the top right."
TO_HOME = "Pick the test location in the location selector at the top right."
CANCEL = "Click Cancel."
SAVE = "Click Save."
WAIT5 = "Wait 5 seconds."
ADMIN_THREE = "Sign in as an Admin who can switch between three locations: the test location, location B and location C."
NO_DELETE_B = ("Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & "
               "Inventory → View' and 'Part Library & Inventory → Create & Edit' but not 'Part Library & Inventory → Delete'.")
NEWNUM = "Use a new part number that no part and no Part Library entry has yet."
RESOLVE = "Please try to resolve this."

# quotes used by more than one Phase C module (each checked verbatim by pllib.check)
PO12 = ("PO", "Chris Ward, 14 Oct 2026, answer 12",
        "Board 7.2 is right: the page has no Delete button. Delete sits bottom left in the \"Edit Library Part\" window, opened by the pencil "
        "beside the entry's name (S11-R3). While a part uses the entry, Delete is disabled with the hover text \"Part cannot be deleted. "
        "Please delete related parts first.\" (S11-R3c).")
QA4 = ("PO", "QA lead, 9 Oct 2026, set-up answer 4",
       "Yes after deleting the inventory part from parts -> Inventory you can still locate its catalogue entry from parts catalog")
QA1 = ("PO", "QA lead, 9 Oct 2026, set-up answer 1",
       "Negative bin can be when you order the inventory part on a work order line when the quantity is already ZERO")
PO14_2 = ("PO", "Chris Ward, 14 Oct 2026, answer 2",
          "A special-order result is a part number this location received from a vendor on a special-order line in the last 12 months. "
          "That's a received line with no inventory part, and not a core (S12-R14a). If more than one vendor delivered it, the vendor of "
          "the most recent delivery shows (S12-R14b).")
