"""Story 6 — Search and Sort the Inventory List by Tracking State (SV-10819). Section 20473.
Phase B, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 in the QA lead's pattern (Rule 117 fourteenth and
fifteenth amendments, Rules 134-137); new cases S6-09 and S6-10 for the new code S6-R1a (the tracking words also work in the vendor
return and vendor credit part search; Chris Ward confirmed option A on SV-10819, 23 Oct 2026).

This module also holds the small shared helpers Phase B uses in cases_s6 ... cases_s10 (Phase B may not edit common.py). Phase B's
"No manual case" rows live in requirement_map.py (merged there 27 Oct 2026 by the integration step; the one source)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

WRITTEN = True

# ---------------------------------------------------------------- Phase B shared helpers (tester text)
INACT = "Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab."
SORTZ = "Click the Part Number column header until the arrow sorts it from Z to A."
ZZ = "so a Part Number sort from Z to A lists them at the top of the results"
PH = "Click the clock icon (Part History) at the left of the part A row."
TYPE_A = "Type part A's part number in the Search box."
ROW_A = "Click the part A row."
SAVE = "Click Save."
DEACT_CONF = "Click Deactivate in the confirmation."
ACT_CONF = "Click Activate in the confirmation."
GS_OPEN = "Click the Search box in the top bar."


CHRIS_S6 = ("JIRA", "SV-10819, Chris Ward, 23 Oct 2026",
            "Confirmed: A. Keep the tracking words in the shared search, including the vendor Return and Credit pickers.")
GAP = ("TECH", "§6 Phase 5, Key code changes",
       "Known pre-existing gap, not fixed here: the SQL sorts on p.quantity, while the cell shows the bin-derived available quantity.")
D54 = dict(boards=["5.4"], words=[note("Typing \"not tracked\" in the Inventory search")])

C("S6-01", "S6", "Searching not tracked lists untracked parts and normal matches",
  [ADMIN,
   "Have an untracked part, part A, whose part number, description and tags contain neither the word not nor the word tracked.",
   "Have a tracked part, part B, whose description contains the words NOT TRACKED, so the search also matches it on its description.",
   "Have a tracked part, part C, whose part number, description and tags contain neither word, so the search has a part it must leave out.",
   f"Give parts A, B and C part numbers that start with ZZ, {ZZ}.", START],
  ["Type not tracked in the Search box.", SORTZ, "Replace the search text with Not (capital N).",
   "Replace the search text with TRACKED, with two spaces before it and two spaces after it."],
  [["The list shows the parts the words match."],
   ["Part A is listed, and its Total Qty cell reads \"Not Tracked\".", "Part B is listed: its description matches the words.",
    "Part C is not listed, although parts A and B with the same ZZ start are."],
   ["Parts A and B are listed and part C is not: upper and lower case make no difference."],
   ["Parts A and B are listed and part C is not: the spaces before and after the word make no difference."]],
  ["S6-R1"], design=D54)

C("S6-02", "S6", "Total Qty sort puts untracked parts below tracked parts both ways",
  [ADMIN,
   "Have five parts, part A, part B, part C, part D and part E, each with one bin location that holds a quantity above 0 (no bin below zero), so the sort and the Total Qty cells agree.",
   "Set parts A, B and C as tracked parts, with 5, 5 and 2 on hand.",
   "Set parts D and E as untracked parts, with 1 and 9 on their shelf.",
   "Give parts A, B, C, D and E descriptions that start with the same text and end, in turn, with ALPHA, BRAVO, CHARLIE, XRAY and YANKEE.",
   SHARED("parts A, B, C, D and E", 5), START],
  [TYPE_SHARED, "Click the Total Qty column header.", "Click the Total Qty column header again."],
  [["Parts A, B, C, D and E are listed."],
   ["The Total Qty header shows a sort arrow.",
    "Low to high, the rows read part C (2), part A (5), part B (5), part D, part E; high to low they read part A (5), part B (5), part C (2), part D, part E. One of these two orders shows.",
    "Parts A and B have the same quantity, so part A (ALPHA) comes before part B (BRAVO).",
    "The untracked parts D and E sit below every tracked part, part D (XRAY) before part E (YANKEE), even though part E has 9 on its shelf."],
   ["The arrow turns round and the other of the two orders shows.",
    "Parts D and E are still at the bottom, part D before part E, in this direction too."]],
  ["S6-R3", "S6-R4", "S6-R5", "S6-R6", "S6-R7", GAP], design=D54)

C("S6-03", "S6", "Searching track, no or t never finds a part by its tracking",
  [ADMIN,
   "Have an untracked part, part A, whose part number, description and tags contain no letter t and never the letters no side by side, so none of the searches below can match it by its text.",
   "Have a tracked part, part B, whose description contains TRACKBAR.",
   "Have a tracked part, part C, whose description contains NOZZLE.",
   f"Give parts A, B and C part numbers that start with ZZ, {ZZ}.", START],
  ["Type track in the Search box.", SORTZ, "Replace the search text with no.", "Replace the search text with t."],
  [["The list shows the parts that match track."],
   ["Part B is listed (TRACKBAR matches).", "Part A is not listed, although it is untracked, and part C is not listed."],
   ["Part C is listed (NOZZLE matches).", "Part A is not listed, and part B is not listed."],
   ["Part B is listed (its description has a t).", "Part A is not listed: a single letter never finds a part by its tracking."]],
  ["S6-R2"], design=D54)

C("S6-04", "S6", "With no untracked parts, searching not tracked lists nothing",
  ["Sign in as an Admin at a location that has no untracked part.",
   "Have a tracked part, part A, at that location whose part number, description and tags contain neither the word not nor the word tracked.",
   "Start on that location's Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab."],
  [TYPE_A, "Replace the search text with not tracked."],
  [["Part A is listed: the search works at this location."],
   ["No part is listed, and the list shows its usual empty search result."]],
  ["S6-N1"], design=D54)

C("S6-05", "S6", "Sorting by Avg Cost sorts by cost, whatever the tracking",
  [ADMIN,
   "Have four parts: part A tracked with Avg Cost $7.00, part B untracked with Avg Cost $9.00, part C untracked with Avg Cost $3.00 and part D tracked with Avg Cost $9.00.",
   "Give parts A, B, C and D descriptions that start with the same text and end, in turn, with ALPHA, BRAVO, DELTA and ECHO.",
   SHARED("parts A, B, C and D", 4), START],
  [TYPE_SHARED, "Click the Avg Cost column header.", "Click the Avg Cost column header again."],
  [["Parts A, B, C and D are listed."],
   ["The Avg Cost header shows a sort arrow.",
    "Low to high, the rows read part C ($3.00), part A ($7.00), part B ($9.00), part D ($9.00); high to low they read part B ($9.00), part D ($9.00), part A ($7.00), part C ($3.00). One of these two orders shows.",
    "Parts B and D share $9.00, so part B (BRAVO) comes before part D (ECHO).",
    "The untracked parts B and C sit where their cost puts them, not below the tracked parts."],
   ["The arrow turns round and the other of the two orders shows, with part B still before part D."]],
  ["S6-R8", ("JIRA", "SV-10819 acceptance criteria",
             "Given the list is sorted by Average Cost, when it loads, then it is ordered by cost first and description second, with tracking state playing no part.")],
  design=dict(boards=["4.0"], note="board \"4.0 Before: the Inventory list today\" shows the Avg Cost column header; no board draws this sort."))

C("S6-06", "S6", "With no sort chosen, tracked parts come before untracked parts",
  [ADMIN,
   "Have two tracked parts, part A and part B, with descriptions ending ALPHA and CHARLIE.",
   "Have two untracked parts, part C and part D, with descriptions ending AARDVARK and ZULU.",
   "Give parts A, B, C and D descriptions that start with the same text before those endings.",
   SHARED("parts A, B, C and D", 4),
   "Make sure no column of the Inventory list is sorted: reload the page so no header shows a sort arrow.", START],
  [TYPE_SHARED],
  [["The rows read, top to bottom: part A (ALPHA), part B (CHARLIE), part C (AARDVARK), part D (ZULU).",
    "Part C (AARDVARK) comes first by description, but it still sits after both tracked parts.",
    "No column header shows a sort arrow."]],
  ["S6-R9"], design=dict(boards=["5.7"], note="board \"5.7 Cycle count leaves it out\" shows the untracked row below the tracked rows; no board draws the unsorted order on its own."))

C("S6-07", "S6", "The Supply filter shows an untracked part only under All",
  [ADMIN,
   "Have a tracked part, part A, with 1 on hand, Min 5 and Max 10, so it is under-supplied.",
   "Have a tracked part, part C, with 7 on hand, Min 5 and Max 10, so it is well-supplied.",
   "Have a tracked part, part D, with 12 on hand, Min 5 and Max 10, so it is over-supplied.",
   "Have an untracked part, part B, with 1 on its shelf and a Min 5 and Max 10 saved while it was tracked.",
   SHARED("parts A, B, C and D", 4), START],
  [TYPE_SHARED, "Pick Under-supplied in the Supply filter.", "Pick Well-supplied in the Supply filter.",
   "Pick Over-supplied in the Supply filter.", "Pick All in the Supply filter."],
  [["Parts A, B, C and D are listed."],
   ["Part A is listed (1 is below its Min of 5).", "Part B is not listed, although it also holds 1 against a Min of 5."],
   ["Part C is listed.", "Part B is not listed."],
   ["Part D is listed.", "Part B is not listed."],
   ["Parts A, B, C and D are all listed, part B among them."]],
  ["S6-R10", "OOS-2"], design=dict(boards=["4.0"], note="board \"4.0 Before: the Inventory list today\" shows the Supply filter; no board draws its options with an untracked part."))

C("S6-08", "S6", "Global search shows Not Tracked in place of an untracked part's badge",
  [ADMIN, "Have a tracked part, part A, with 4 on hand.", "Have an untracked part, part B, with 3 on its shelf.",
   SHARED("parts A and B"), GLOBAL],
  [GS_OPEN, "Type the shared start of the part numbers."],
  [["The global search opens."],
   ["Part A's result shows its available badge, \"4 available\".",
    "Part B's result shows \"Not Tracked\" where that badge would be, with no number."]],
  ["UFS-42", "S9-R20", ("PO", "QA lead's answer of 9 Oct 2026, situation 3",
                        "By default new global search is enabled for all the accounts including the QA branches.")],
  stories=[6, 9])

C("S6-09", "S6", "On a vendor return, searching not tracked also lists untracked parts",
  [ADMIN, "Have a vendor, vendor A.",
   "Have an untracked part, part A, with vendor A, whose part number, description and tags contain neither the word not nor the word tracked.",
   "Have a tracked part, part B, with vendor A, whose description contains the word NOTCHED, so the word not also matches it on its description.",
   "Have a tracked part, part C, with vendor A, whose part number, description and tags contain neither word, so the search has a part it must leave out.",
   "Start on the Create Return page (Parts in the top bar, Returns in the left menu, then the button that starts a new return)."],
  ["Pick vendor A in the Vendor field.", "Click the Part Number field.", "Type not."],
  [["Vendor A is shown in the Vendor field."],
   ["The part search under Part Number is ready to type in."],
   ["Part A is listed: the word not finds untracked parts here, as on the Inventory list.",
    "Part B is listed: its description matches the word.",
    "Part C is not listed, although parts A and B from the same vendor are."]],
  ["S6-R1a", "S6-R1", CHRIS_S6], stories=[6, 9],
  design=dict(boards=["6.6"], note="board \"6.6 Vendor return: still offered, tagged\" shows the Create Return page and its Part Number search; no board draws a tracking-word search there."))

C("S6-10", "S6", "On a vendor credit, searching tracked also lists untracked parts",
  [ADMIN, "Have a vendor, vendor A.",
   "Have an untracked part, part A, with vendor A, whose part number, description and tags contain neither the word not nor the word tracked.",
   "Have a tracked part, part C, with vendor A, whose part number, description and tags contain neither word, so the search has a part it must leave out.",
   "Start on vendor A's page (Parts in the top bar, Vendors in the left menu, then the vendor A row)."],
  ["Click the button that starts a new vendor credit.", "Click the Part Number field of the credit's first line.", "Type tracked."],
  [["A new vendor credit for vendor A opens."],
   ["The part search under Part Number is ready to type in."],
   ["Part A is listed: the word tracked finds untracked parts here too.", "Part C is not listed."]],
  ["S6-R1a", "S6-R1", CHRIS_S6], stories=[6, 9],
  design=dict(note="no board draws a vendor credit; the expected results above come from the quotes above."))
