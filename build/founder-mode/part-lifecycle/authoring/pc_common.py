"""Phase C's own shared strings and three narrow, Phase-C-scoped adjustments (27 Oct 2026). Imported by cases_s11, cases_s12, cases_s13
and cases_iv only. Nothing here changes a Phase A or Phase B case. Each adjustment is also written into
../full-pass-2026-10-27/PHASE-C-REQUESTS.json so the coordinator can move it into pllib.py / requirement_map.py and delete it here.

1. NO_MANUAL / NO_MANUAL_UFS rows for Stories 11-13 (requirement_map.py is not Phase C's to edit): added to the same dicts at import.
2. pllib.JARGON: the screen's own phrase "part request" ("New Part Request", "an open part request", and the PRD message "Part number
   can't be longer than 50 characters while it's on an open part request.", which the feedback-message gate needs word for word) is
   no longer read as the technical word "request". Every other use of "request" is still refused.
3. pllib.quotes_block: an Inventory Value (SV-10380) case quotes no story, so its first From line names bug SV-10380 instead of
   ending in an empty ", ". Only cases in section IV are touched."""
import re
import pllib as L
import requirement_map as RM

# ---------------------------------------------------------------- 1. not manual cases (L-14), Stories 11-13
RM.NO_MANUAL.update({
    "S11-E3": "The public API create is a separate integration with no screen (S11-E3, tech plan §5: POST /api/v1/parts unchanged). "
              "Developers' check.",
    "S13-R19d": "A number or description change made through the public API; no screen sends it. Developers' check (tech plan Phase 6 "
                "OpenApiPartRenameTest). The part dialog's own rules are tested by the Story 13 cases.",
    "S13-N1b": "A core has no row of its own on the Inventory list, in Export or on the Part Library list (S5-E3), so no screen can rename a "
               "core on its own; the refusal comes only from the public API or a request sent outside the screens (Chris Ward on "
               "SV-10826, 23 Oct 2026, Q2). Developers' check.",
    "S13-N8": "The part dialog has no Part Library selector (S13-E1, S13-40 checks it) and the Part Library page edits the entry, not the "
              "part it points at, so a re-point reaches the system only from outside the screens. Developers' check (tech plan Phase 6 "
              "RepointRefusedTest).",
})
RM.NO_MANUAL_UFS.update({
    "UFS-15": "S13-N1b's refusal; see S13-N1b (a core cannot be renamed on its own from any screen).",
    "UFS-17": "S13-N8's refusal; see S13-N8 (no screen points a part at another Part Library entry).",
    "UFS-18": "A server error while saving a part; a manual tester cannot cause one.",
    "UFS-19": "A server error while deleting a part; a manual tester cannot cause one.",
    "UFS-27": "A server error while the part dialog changes a status; a manual tester cannot cause one.",
    "UFS-47": "Its first message, \"Part Library entry not found.\", is tested word for word by S12-07 (S11-E4). No source names a screen "
              "action that shows the \"... for ID: {id}.\" or \"... for part number: {part number}.\" variants (question Q-C1).",
    "UFS-48": "No source names a screen action that starts a part request from a Part Library entry with no category (question Q-C1).",
    "UFS-49": "No source names a screen action that starts a part request from a Part Library entry with a source other than Vendor "
              "(question Q-C1).",
})

# ---------------------------------------------------------------- 2. "part request" is the screen's own phrase
_old = L.JARGON.pattern
if "|request)\\b" in _old:
    L.JARGON = re.compile(_old.replace("|request)\\b", ")\\b|(?<![Pp]art )\\brequest\\b"))

# ---------------------------------------------------------------- 3. the From line of an Inventory Value case names the bug
_quotes_block = L.quotes_block
IV_BUG = "bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; ships with this epic)"
def _qb(c):
    h = _quotes_block(c)
    if c["sec"] == "IV":
        h = h.replace(f"&middot; Epic {L.EPIC}, </p>", f"&middot; Epic {L.EPIC}, {L.e(IV_BUG)}</p>", 1)
    return h
if getattr(L.quotes_block, "__name__", "") != "_qb":
    L.quotes_block = _qb

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
