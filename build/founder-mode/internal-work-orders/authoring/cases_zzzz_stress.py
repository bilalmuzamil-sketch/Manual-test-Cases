"""Layout stress round (14 Nov 2026). The QA lead's decision of 14 Nov 2026: "Draft all 87 + 4 questions (Recommended)". This module
drafts every case the layout stress gap scan proposes for Internal Work Orders (build/founder-mode/LAYOUT-STRESS-GAP-SCAN-2026-11-13.md,
part I3: I-P01 to I-P33 and I-S01 to I-S17), after lesson L-21 and skill 21 §6d lines 9 and 10. DRAFT ONLY: nothing is in TestRail.

- Typed text (skill 21 §6d line 9): every place gets names the tester creates for the case: a long name with spaces, a long name with no
  spaces (60 characters for a category, the PRD limit S1-R14) and a name with & " ' < >. All three share the word "Plainsview", so one
  search shows them together. Where the place shows one record at a time (a window), two records are used: customer A's name is long
  with spaces AND carries the special characters, customer B's is long with no spaces. The results say what the tester sees: the name
  stays inside its own row, cell, chip, badge or window, covers nothing, every column, button and control stays visible, and the name
  shows exactly as saved. Wrapping versus "..." is never asked (skill 07 §6.0 check g), except where the PRD says it (S9-R2 one line at
  1440 and 1536 pixels; S3-R5 "on the left and never over the logo"), which is quoted and tested exactly.
- State changes (line 10): a screenshot first, then the comparison (the A/R and A/P pattern of 13 Nov 2026, D-90 to D-93 there).
  Six cases are held on two new questions (17 and 18, questions-2026-11-14/sheet_rows.py) because the design's own pictures draw the
  columns moving and no source settles it. Held design cases stay in "Design — how it looks" (sections.json note; QA lead: waiting
  design cases stay there), as build.py's FOLDER logic does.
- I-P16 is split three ways (Board card, Schedule card, Tech View), as the scan's own title says ("split for Schedule card, Tech View")
  and Rule 136 allows: 53 proposals, 55 cases. I-P08 does not exist in the scan. No case is NO_MANUAL: a new organization (a new
  sign-up) is the suite's own precedent for "never turned on" (S1-02, S1-90, D-02, all in TestRail).
Every design case is added to DR.DREFS and to cases_zzz_v13.NEW_DESIGN, so build.py's design-count gate holds."""
import re
from iwo_lib import C, CASES
from common import ON, OFF, NO_ACCT, PHONE, NAME_NOTE
import design_refs as DR
import cases_zzz_v13 as Z13

STRESS_NEW = {}          # key -> scan proposal id (NEW-CASES.md, create script)

# ---- the stress names (examples only; the tester creates them) -------------------------------------------------------------
N_CA = "Plainsview Heavy Truck and Trailer Repair Services of North Dakota"            # 66, spaces
N_CB = "PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota"                    # 59, no spaces
N_CC = 'Plainsview A&B "Fleet" O\'Neil <Parts> & Sons'
N_CW = 'Plainsview Heavy Truck & Trailer "Fleet" O\'Neil <Parts> Repair Services'      # 71, spaces and & " ' < >
N_KA = "Plainsview Company Vehicle and Heavy Equipment Upkeep Region"                   # 60, spaces
N_KB = "PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion"                   # 60, no spaces
N_KC = 'Plainsview "Yard" & O\'Neil <Units> Upkeep'
N_KX = 'Plainsview "Yard", O\'Neil & Sons <Units>'                                     # with a comma, for the file export
N_LA = "Replace front and rear brake chambers, slack adjusters and every air line"
N_LB = "ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine"
N_LC = 'Brakes & "Air" O\'Neil <Kit>'
N_PW = 'Plainsview front brake caliper & "Bracket" O\'Neil <Kit> assembly'
N_PB = "PlainsviewFrontBrakeCaliperAssemblyWithBracketPadsAndHardware"
SPECIAL = "& \" ' < >"

ADM = "Sign in as an Admin (a user with every setting, See Financial Data included)."
W = "Use a desktop browser window 1440 pixels wide at 100% zoom."
QB = "Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled."
AH = "Make sure AccountingHub is enabled for the organization and the test location has no QuickBooks Online connection."
NEWORG = "Use a new organization created on the build (a new sign-up), in which the Internal Work Orders setting has never been switched on."
FIT = ("If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters "
       + SPECIAL + ", leave that character out and write down which.")
FIT_CAT = "The category Name field takes 60 characters at most; if it refuses one of the characters " + SPECIAL + ", leave that character out and write down which."


def cA(extra=""): return f"Have a new customer for this test, customer A{extra}, whose name is long with spaces (for example {N_CA})."
def cB(extra=""): return f"Have a new customer for this test, customer B{extra}, whose name is long with no spaces (for example {N_CB})."
def cC(extra=""): return f"Have a new customer for this test, customer C{extra}, whose name has the characters {SPECIAL} (for example {N_CC})."
def cW(extra=""): return f"Have a new customer for this test, customer A{extra}, whose name is long with spaces and has the characters {SPECIAL} (for example {N_CW})."
def kA(kind, extra=""): return f"Have a new {kind} category for this test, category A{extra}, whose name is 60 characters long with spaces (for example {N_KA})."
def kB(kind, extra=""): return f"Have a new {kind} category for this test, category B{extra}, whose name is 60 characters long with no spaces (for example {N_KB})."
def kC(kind, extra=""): return f"Have a new {kind} category for this test, category C{extra}, whose name has the characters {SPECIAL} (for example {N_KC})."
REQ = ', with "Requires the original work order" ticked'
NOREQ = ', with "Requires the original work order" unticked'

EXACT = f'Each name shows exactly as you typed it: the characters {SPECIAL} show as typed, not as "&amp;" or other codes.'
SHOT = "Take a screenshot of the page."
SAME = "Every column heading is in the same place as in your screenshot: none has moved left or right."
HELD_NOTE = ("The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the "
             "columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.")
STRESS_NOTE = ("The design draws this place with short names only. These results check that its layout holds with long and unusual names; "
               "where the PRD says nothing about the look, the pictures are the source.")


def _pages(boards):
    figs = [DR.BYFILE[b] for b in boards]
    pn = list(dict.fromkeys(f["page_name"] for f in figs))
    return (DR.CANVAS + ": page" + ("s " if len(pn) > 1 else " ") + " / ".join(f'"{p}"' for p in pn) + ", board" + ("s " if len(figs) > 1 else " ")
            + ", ".join(f'"{f["board_title"]}" ({f["page_name"]})' for f in figs) + ".")


def D(key, pid, title, pre, steps, res, q, boards, notes=(), words=(), marker=None, note=""):
    """A design case: References from Design from `boards` (board files), the pictures named in the preconditions, the key registered
    with the design-count gate (cases_zzz_v13.NEW_DESIGN)."""
    pics = [DR.BYFILE[b]["picture"].split("/")[-1] for b in boards]
    DR.DREFS[key] = {"pages": _pages(boards), "pictures": pics, "words": list(words), "notes": list(notes), "boards": list(boards)}
    pl = "Open the attached picture%s %s at 100%% zoom beside the screen." % ("s" if len(pics) > 1 else "", ", ".join(pics))
    C(key, "DESIGN", title, list(pre) + [pl], steps, res, q, marker=marker, note=note)
    Z13.NEW_DESIGN.append(key); STRESS_NEW[key] = pid
    for x in q: DR.SECONDARY.add((key, x if isinstance(x, str) else x[0]))   # never brings these boards to an existing PRD case


def P(key, pid, sec, title, pre, steps, res, q, note=""):
    C(key, sec, title, pre, steps, res, q, note=note); STRESS_NEW[key] = pid


# ---- the two new questions (17, 18) for Milos Vasic: rows of the existing sheet (Rule 131); the sheet text is in questions-2026-11-14/
# (the two rows live in po_questions.py, round 5)

# =============================================== TYPED TEXT (36 proposals, 38 cases) ===============================================
D("D-94", "I-P01", "Design: Long and unusual customer names stay inside their turn-on chips",
  [ADM, W, NEWORG, cA(), cB(), cC(), FIT],
  ["Open Settings > Work Orders.", "Switch the \"Internal Work Orders\" toggle on.", "Pick customer A in the customer picker.",
   "Pick customer B in the customer picker.", "Pick customer C in the customer picker."],
  [["The toggle \"Internal Work Orders\" is off."], ["The window \"Which customers are your own company?\" opens."],
   ["A chip with customer A's name and a remove control shows in the picker.", "The chip stays inside the picker field and the window; its remove control is visible."],
   ["A chip with customer B's name shows; the long name with no spaces stays inside the picker field and does not run past the window's edge.",
    "Both chips show their remove control."],
   ["A chip with customer C's name shows.", EXACT,
    "The hint \"Pick up to 50 customers here. Flag more from Edit Customer.\", the line \"You can change this any time: Customers > Edit Customer > Internal customer.\" and the buttons \"Do this later\" and \"Save\" are all visible; no chip covers them."]],
  ["S1-R2"], ["flow0-1b"], notes=[STRESS_NOTE])

D("D-95", "I-P02", "Design: Make internal window with long customer names keeps both buttons visible",
  [ADM, W, ON, cW(), cB(), "Have a new work order for this test, work order 1, for customer A, in Estimate, so the Make internal window opens.",
   "Have a new work order for this test, work order 2, for customer B, in Estimate, so the Make internal window opens.", FIT],
  ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Tick the \"Internal customer\" checkbox.", "Click Save.",
   "Click \"Keep billable\".", "Open customer B's page.", "Click Edit Customer on customer B's page.", "Tick the \"Internal customer\" checkbox.", "Click Save."],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The select \"Default internal category\" appears under the checkbox."],
   ["A window opens that reads \"[n] open work orders for [customer A's name] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept.\"",
    "Customer A's name shows in full, exactly as saved, and stays inside the window.", EXACT,
    "Work order 1's row (number, location, unit, status) is visible under the text.", "The buttons \"Keep billable\" and \"Make internal\" are visible; no text covers them."],
   ["The window closes."], ["Customer B's page opens."], ["The Edit Customer window opens."], ["The select \"Default internal category\" appears under the checkbox."],
   ["The window names customer B in full; the long name with no spaces stays inside the window and does not run past its edge.",
    "Work order 2's row and the buttons \"Keep billable\" and \"Make internal\" are visible."]],
  ["S1-R11", "S1-R7"], ["flow0-7"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-96", "I-P03", "Design: Remove the Internal flag window stays readable with long names",
  [ADM, W, ON, cW(", flagged as an Internal customer"), cB(", flagged as an Internal customer"),
   "Have a new internal work order for this test, work order 1, for internal customer A, in Estimate, so the window shows its full body.",
   "Have a new internal work order for this test, work order 2, for internal customer B, in Estimate, so the window shows its full body.", FIT],
  ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Untick the \"Internal customer\" checkbox.", "Click Cancel in the Remove the Internal flag window.",
   "Click Cancel in the Edit Customer window.", "Open customer B's page.", "Click Edit Customer on customer B's page.", "Untick the \"Internal customer\" checkbox."],
  [["Customer A's page opens."], ["The Edit Customer window opens."],
   ["A window \"Remove the Internal flag from [customer A's name]?\" opens with the body \"[n] open internal work orders for [customer A's name] stay internal and close without an invoice. New work orders for [customer A's name] will be billable.\"",
    "Customer A's name shows in full in the title and the body and stays inside the window.", EXACT,
    "The buttons Cancel and \"Remove flag\" are visible; no text covers them."],
   ["The window closes and \"Internal customer\" is still ticked."], ["The Edit Customer window closes."], ["Customer B's page opens."], ["The Edit Customer window opens."],
   ["The window names customer B in full in the title and the body; the long name with no spaces stays inside the window and does not run past its edge.",
    "The buttons Cancel and \"Remove flag\" are visible."]],
  ["S1-R12", "S1-R6"], ["flow0-8"], notes=[STRESS_NOTE], note=NAME_NOTE)

FLAG3 = [cA(", flagged as an Internal customer"), cB(", flagged as an Internal customer"), cC(", flagged as an Internal customer")]
D("D-97", "I-P04", "Design: Internal badge stays beside long names in the Customers list",
  [ADM, W, ON] + FLAG3 + [FIT],
  ["Open Customers.", "Type \"Plainsview\" in the customers search."],
  [["The Customers list opens."],
   ["The rows of customer A, customer B and customer C show.", "Each name stays inside its own cell, with the \"Internal\" badge right after it; no badge is pushed out of the row or covered.",
    "Customer B's name with no spaces does not run over the next column.", EXACT, "Every column heading of the list is visible on screen without scrolling sideways."]],
  ["S1-R8"], ["flow0-4"], notes=[STRESS_NOTE])

D("D-98", "I-P05", "Design: Internal badge stays visible beside a long name in the customer header",
  [ADM, W, ON] + FLAG3 + [FIT],
  ["Open customer A's page.", "Open customer B's page.", "Open customer C's page."],
  [["The header shows customer A's name in full with the \"Internal\" badge after it; the name stays inside the header and covers neither the badge nor the header's buttons."],
   ["The header shows customer B's name with the badge visible; the long name with no spaces does not run past the header's edge or over its buttons."],
   ["The header shows customer C's name with the badge.", EXACT]],
  ["S1-R8"], ["flow0-5"], notes=[STRESS_NOTE])

D("D-99", "I-P06", "Design: Internal badge stays visible on the phone customer card with a long name",
  [ADM, PHONE, ON] + FLAG3 + [FIT],
  ["Open Customers.", "Type \"Plainsview\" in the customers search."],
  [["The customers list shows as cards."],
   ["The cards of customer A, customer B and customer C show.", "Each name stays inside its own card with the \"Internal\" badge visible; no name runs past the card's edge or over the next card.",
    EXACT, "Nothing on the page needs sideways scrolling."]],
  ["S1-R8"], ["flow0-4"], notes=["The design draws the desktop Customers list only; the phone card is not drawn. The results check the card's own edges.", STRESS_NOTE])

D("D-100", "I-P07", "Design: Long category and customer names stay inside the categories tables",
  [ADM, W, ON, QB, kA("Internal"), kB("Internal"), kC("Internal"),
   cA(", flagged as an Internal customer, whose Default internal category is category A"), cB(", flagged as an Internal customer, whose Default internal category is category B"),
   "Have three new No Charge categories for this test, category D, category E and category F, named like categories A, B and C.", FIT_CAT, FIT],
  ["Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab."],
  [["The Internal categories tab shows the rows of category A, category B and category C.",
    "Each category name stays inside the Category cell; none runs over the QuickBooks expense account column.",
    "Customer A's and customer B's names stay inside the \"Internal customers\" cell of their category's row; none runs over the Work orders column.",
    "On every row the QuickBooks expense account (\"Not set\" with its warning icon), the Work orders count and the three-dots menu are visible.", EXACT],
   ["The No Charge categories tab shows the rows of category D, category E and category F, each name inside the Category cell.",
    "On every row the QuickBooks expense account, Original work order (\"Required\" or \"Not asked\"), Work orders and the three-dots menu are visible.", EXACT]],
  ["S1-R13", "S1-R14"], ["flow0-2a", "flow0-2b"], notes=[STRESS_NOTE])

D("D-101", "I-P09", "Design: Long archived category names read in full with (archived)",
  [ADM, W, ON, kB("Internal", ", archived after it was set on customer A"),
   f"Have a new Internal category for this test, category C, whose name has the characters {SPECIAL} (for example {N_KC}), archived after it was set on customer B.",
   "Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category B.",
   "Have a new customer for this test, customer B, flagged as an Internal customer, whose Default internal category is category C.", FIT_CAT],
  ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Click Cancel.", "Open customer B's page.", "Click Edit Customer on customer B's page.",
   "Click Cancel.", "Open Administration > Service > Internal Work Orders.", "Click the \"Show archived\" link under the table."],
  [["Customer A's page opens."],
   ["\"Default internal category\" shows \"[category B's name] (archived)\"; the long name with no spaces and \"(archived)\" stay inside the select box.",
    "The hint \"Archived. Pick an active category.\" is visible under it and covers no other field."],
   ["The window closes."], ["Customer B's page opens."],
   ["\"Default internal category\" shows \"[category C's name] (archived)\" inside the select box, with the hint under it.", EXACT],
   ["The window closes."], ["The Internal categories tab opens."],
   ["The archived categories show, category B and category C among them, each name inside its Category cell, each with Restore visible."]],
  ["S1-R16", "S1-R13"], ["flow0-11", "flow0-2a"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-102", "I-P10a", "Design: Long category names fit the Default internal category select",
  [ADM, W, ON, kA("Internal"), kB("Internal"), kC("Internal"), "Have a new customer for this test, customer A, not flagged.", FIT_CAT],
  ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Tick the \"Internal customer\" checkbox.", "Open the \"Default internal category\" select.",
   "Pick category B.", "Open the \"Default internal category\" select.", "Pick category C."],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["The select \"Default internal category\" appears under the checkbox."],
   ["The list shows category A, category B and category C, each name inside its own row; no name runs over the next row or out of the list."],
   ["The select box shows category B's name; it stays inside the box and covers neither the helper under it nor the window's edge.",
    "The helper \"Used by every new internal work order for this customer unless the asset has its own category.\" is visible."],
   ["The list opens again."], ["The select box shows category C's name.", EXACT]],
  ["S1-R7"], ["flow0-11"], notes=[STRESS_NOTE])

D("D-103", "I-P10b", "Design: Long category names fit the Internal category select on Edit Asset",
  [ADM, W, ON, kB("Internal"), kC("Internal"),
   "Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category B, with one asset.", FIT_CAT],
  ["Open customer A's asset.", "Click Edit on the asset's page.", "Open the \"Internal category\" select.", "Pick category C."],
  [["The asset's page opens."],
   ["Under a divider the select \"Internal category\" shows, with the helper ending \"Leave it empty to use the customer's category, [category B's name].\"",
    "Category B's name in the helper shows in full and stays inside the window."],
   ["The list shows category B and category C, each inside its own row."], ["The select box shows category C's name inside the box.", EXACT,
    "The window's Save and Cancel buttons are visible."]],
  ["S1-R15"], ["flow0-11b"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-104", "I-P11", "Design: Long category names keep their own rows in QuickBooks ShopView Accounts",
  [ADM, W, ON, QB, kA("Internal"), kB("Internal"), kC("No Charge"), FIT_CAT],
  ["Open Settings > Integrations > QuickBooks."],
  [["Under \"Internal work orders\" the ShopView Accounts rows of category A and category B show, and under \"No Charge work orders\" the row of category C.",
    "Each row's name stays inside the row's label and covers neither its account picker nor the row below.",
    "Under each of these rows the hint reads \"Not set. Parts cost of [category's name] work orders posts to the ShopView Review account until you pick one.\", with the name in full inside the row.",
    EXACT, "Every row's account picker is visible."]],
  ["S5-R1", "S5-R4"], ["flow0-9", "flow0-10"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-105", "I-P12", "Design: New Work Order tooltip with a long category stays readable",
  [ADM, W, ON, kB("Internal"), kC("Internal"),
   "Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with no spaces (for example " + N_CB + "), with one asset whose Internal category is category B.",
   "Have a new customer for this test, customer B, flagged as an Internal customer, whose name has the characters " + SPECIAL + " (for example " + N_CC + "), with one asset whose Internal category is category C.",
   FIT, "Start on Work Orders."],
  ["Click New Work Order.", "Pick customer A.", "Pick customer A's asset.", "Hover the info icon next to the \"Internal\" badge.", "Pick customer B in the customer field.",
   "Pick customer B's asset.", "Hover the info icon next to the \"Internal\" badge."],
  [["The New Work Order window opens."],
   ["Customer A's name shows in the field with the \"Internal\" badge and the info icon after it; the long name stays inside the field and does not push the badge out of the window."],
   ["The asset is picked."],
   ["The tooltip reads \"Internal customer: no prices, no invoice. Posts to [category B's name], from the asset.\"",
    "The tooltip shows category B's name in full, stays on screen and covers no button of the window."],
   ["Customer B's name shows in the field with the badge and the info icon.", EXACT], ["The asset is picked."],
   ["The tooltip names category C exactly as saved and stays on screen."]],
  ["S2-R1"], ["flow1-2b2"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-106", "I-P13a", "Design: Long names fit the No Charge selects in New Work Order",
  [ADM, W, ON, kB("No Charge", REQ),
   "Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).",
   "Have a new customer for this test, customer A, not flagged, whose name is long with no spaces (for example " + N_CB + "), with one asset.",
   "Have a new invoiced work order for this test, work order 1, for customer A, whose first line, line 1, has a long title with spaces (for example " + N_LA + ") and was worked by technician A.",
   "Have a new invoiced work order for this test, work order 2, for customer A, whose first line has a title with the characters " + SPECIAL + " (for example " + N_LC + ").",
   FIT, FIT_CAT, "Start on Work Orders."],
  ["Click New Work Order.", "Pick customer A.", "Tick \"No Charge\".", "Open the \"Category\" select.", "Pick category B.", "Open the \"Original work order\" select.",
   "Pick work order 1.", "Open the \"Original line\" select.", "Pick line 1."],
  [["The New Work Order window opens."], ["Customer A's name shows in the field inside the window."], ["The required select \"Category\" appears."],
   ["Category B's row shows its name inside the list; it does not run out of the list."],
   ["The select box shows category B's name inside the box.", "The select \"Original work order\" appears under it."],
   ["The rows of work order 1 and work order 2 show number, date and first line, each inside its own row; the long line title does not run over the next row.",
    "Work order 2's first line shows exactly as saved."],
   ["The select box shows work order 1 inside the box.", "The line \"Original technician: [names]\" shows technician A's name in full inside the window."],
   ["Line 1's row shows number, title and technician inside the row."],
   ["The select box shows line 1 inside the box.", "The buttons at the bottom of the window (Cancel and Save) are visible; no select covers them."]],
  ["S2-R2"], ["flow1-2e"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-107", "I-P13b", "Design: Long names fit the Convert to No Charge and Change category selects",
  [ADM, W, ON, NO_ACCT, kB("No Charge", REQ), kC("No Charge", NOREQ),
   "Have a new customer for this test, customer A, not flagged, with one asset.",
   "Have a new invoiced work order for this test, work order 1, for customer A, whose first line has a long title with no spaces (for example " + N_LB + ").",
   "Have a new work order for this test, work order 2, for customer A, billable, not invoiced, with no deposit.",
   "Have a new No Charge work order for this test, work order 3, for customer A, category C, in Estimate.", FIT_CAT],
  ["Open work order 2.", "Click the three-dots menu in the header.", "Click Convert to No Charge.", "Pick category B in Category.", "Open the \"Original work order\" select.",
   "Click Cancel.", "Open work order 3.", "Click the three-dots menu in the header.", "Click Change category."],
  [["Work order 2 opens."], ["The menu opens."], ["The window \"Convert work order [number] to No Charge?\" opens."],
   ["The select box shows category B's name inside the box; it covers neither the window's edge nor the selects that appear under it.",
    "The selects \"Original work order\" and \"Original line\" appear."],
   ["Work order 1's row shows its number, date and first line inside the row; the long title with no spaces does not run out of the list."],
   ["The window closes; work order 2 shows no \"No Charge\" badge."], ["Work order 3 opens."], ["The menu opens."],
   ["The window \"Change category for work order [number]\" opens with category C's name preselected inside the Category box.", EXACT,
    "The buttons Cancel and Save are visible."]],
  ["S2-R5", "S2-R6"], ["flow2-2", "flow2-3c"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-108", "I-P14", "Design: Mark this line window keeps a long line title inside the window",
  [ADM, W, ON, "Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).",
   "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 has a long title with no spaces (for example " + N_LB
   + "), 1.0 h of labor by technician A and one stock part with a cost, and whose line 2 has a title with the characters " + SPECIAL + " (for example " + N_LC + ").", FIT],
  ["Open work order 1.", "Click the three-dots menu of line 1.", "Click Mark as No Charge.", "Click Cancel.", "Click the three-dots menu of line 2.", "Click Mark as No Charge."],
  [["Work order 1 opens."], ["The line menu opens."],
   ["The window \"Mark this line as No Charge?\" opens with the line summary (title, hours, parts, technician, current price).",
    "Line 1's long title and technician A's name show in full and stay inside the window; nothing runs past its edge.",
    "The body, the Category select and the buttons Cancel and \"Mark as No Charge\" are visible; the summary covers none of them."],
   ["The window closes."], ["The line menu opens."], ["The line summary shows line 2's title exactly as saved.", EXACT.replace("Each name shows", "The title shows")]],
  ["S12-R2"], ["flow6-2"], notes=[STRESS_NOTE])

LIST3 = [cA(", flagged as an Internal customer"), cB(), cC(),
         "Have a new internal work order for this test, work order 1, for internal customer A, in Estimate.",
         "Have a new No Charge work order for this test, work order 2, for customer B, category Goodwill, in Estimate.",
         "Have a new work order for this test, work order 3, for customer C, billable, in Estimate.", FIT]
D("D-109", "I-P15", "Design: Work orders list keeps every column visible with long customer names",
  [ADM, W, ON] + LIST3,
  ["Open Work Orders.", "Type \"Plainsview\" in the work orders search.", "Resize the browser window to 1536 pixels wide."],
  [["The work orders list opens."],
   ["The rows of work order 1, work order 2 and work order 3 show.",
    "Each customer name stays inside the Customer cell; customer B's name with no spaces does not run over the next column.",
    "Work order 1 shows the \"Internal\" badge and work order 2 the \"No Charge\" badge; each badge is fully visible and covered by nothing.",
    "Work order 1 and work order 2 show \"No Charge\" in Total Price.", EXACT,
    "Every column heading of the list is on screen without scrolling sideways, Total Price included."],
   ["The same rows show with each name inside its cell, both badges visible and every column heading on screen."]],
  ["S2-R10"], ["flow4-1"], notes=["Difference: register IWO-D35: the design draws the badge after the customer name; the PRD puts it in the status column. The case follows the PRD for where the badge is; either way it must stay visible.", STRESS_NOTE])

CARD2 = [cB(", flagged as an Internal customer"), cC(),
         "Have a new internal work order for this test, work order 1, for internal customer B, with one labor line In Progress.",
         "Have a new No Charge work order for this test, work order 2, for customer C, category Goodwill, with one labor line In Progress.", FIT]
D("D-110", "I-P16a", "Design: Board cards keep the badge with long customer names",
  [ADM, W, ON] + CARD2, ["Open the Board."],
  [["The cards of work order 1 and work order 2 show.", "Each customer name stays inside its own card; customer B's name with no spaces does not run past the card's edge or over the next card.",
    "Work order 1's card shows the \"Internal\" badge and work order 2's the \"No Charge\" badge; neither is pushed out of the card or covered.", EXACT]],
  ["S2-R10"], ["flow4-10"], notes=[STRESS_NOTE])
D("D-111", "I-P16b", "Design: Schedule cards keep the badge with long customer names",
  [ADM, W, ON] + CARD2 + ["Have work order 1 and work order 2 scheduled today for a technician, so their cards show on today's Schedule."], ["Open Schedule."],
  [["The cards of work order 1 and work order 2 show on today's Schedule.", "Each card shows the badge next to the work order number; the badge is not pushed out of the card or covered.",
    "Each customer name stays inside its own card and covers neither the number nor the next card.", EXACT]],
  ["S2-R10"], ["flow4-11"], notes=[STRESS_NOTE])
D("D-112", "I-P16c", "Design: Tech View keeps the badge with long customer names",
  ["Sign in as a technician assigned to the labor lines of work order 1 and work order 2.", W, ON] + CARD2, ["Open Tech View."],
  [["Work order 1 and work order 2 show, each with its badge next to the number.", "Each customer name stays inside its own card or row and covers neither the badge nor the next work order.", EXACT]],
  ["S2-R10"], ["flow4-9"], notes=[STRESS_NOTE])

D("D-113", "I-P17a", "Design: A long category in the No Charge chip keeps the line's columns in place",
  [ADM, W, ON, kB("No Charge", NOREQ), kC("No Charge", NOREQ), "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 has a long title with spaces (for example " + N_LA
   + ") and is marked No Charge under category B, and whose line 2 has a title with the characters " + SPECIAL + " (for example " + N_LC + ") and is marked No Charge under category C.", FIT_CAT],
  ["Open work order 1.", "Resize the browser window to 1536 pixels wide."],
  [["Line 1 shows the chip \"No Charge · [category B's name]\" next to its title, and line 2 the chip \"No Charge · [category C's name]\".",
    "Each title and its chip stay inside the Name/Description cell; neither runs over Actual/Estimate.",
    "On both lines Actual/Estimate, Status, Rate ($0.00), Total ($0.00) and the three-dots menu are visible.", EXACT],
   ["The same: each chip inside the Name/Description cell, every column and the three-dots menus visible."]],
  ["S12-R3"], ["flow6-3", "flow6-4"], notes=[STRESS_NOTE], note=NAME_NOTE)

P("S12-49", "I-P17b", "S12", "Print Work Order prints a long No Charge chip beside its line",
  [ADM, ON, kB("No Charge", NOREQ), kC("No Charge", NOREQ), "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 is marked No Charge under category B and whose line 2 is marked No Charge under category C.", FIT_CAT],
  ["Open work order 1.", "Click the three-dots menu in the header.", "Click Print Work Order."],
  [["Work order 1 opens."], ["The menu opens."],
   ["The printed work order shows the chip \"No Charge · [category B's name]\" next to line 1 and \"No Charge · [category C's name]\" next to line 2.",
    "Each chip shows the category's name in full and stays on the page; it covers no other text of the line.", EXACT]],
  ["S12-E8"], note=NAME_NOTE)

D("D-114", "I-P18", "Design: Posting summary and Close window keep long category names inside",
  [ADM, W, ON, QB, kB("No Charge", REQ + ", with no QuickBooks expense account"), kC("No Charge", NOREQ + ", with no QuickBooks expense account"),
   "Have a new customer for this test, customer A, not flagged.",
   "Have a new No Charge work order for this test, work order 1, for customer A, category B, with no original work order, every line Complete, with one stock part with a cost.",
   "Have a new No Charge work order for this test, work order 2, for customer A, category C, every line Complete, with one stock part with a cost.", FIT_CAT],
  ["Open work order 1.", "Open the Finance tab.", "Click Close Work Order on the Finance tab.", "Click Cancel.", "Open work order 2.", "Open the Finance tab."],
  [["Work order 1 opens."],
   ["The posting summary's Stock parts row carries the note \"No account set for [category B's name]. The entry posts to the ShopView Review account until you set one.\" with a \"Set account\" link.",
    "The note shows category B's name in full and stays inside the posting summary; it covers neither the amount nor the row below."],
   ["A window \"Close work order [number]?\" opens with the warning \"[category B's name] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.\"",
    "The warning stays inside the window; the selects, Cancel and \"Close Work Order\" are visible."],
   ["The window closes; work order 1's header shows no Closed status."], ["Work order 2 opens."],
   ["The Stock parts note names category C exactly as saved, inside the posting summary.", EXACT]],
  ["S3-N4", "S3-R2"], ["flow1-6c", "flow2-4b"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-115", "I-P19", "Design: Cost move window with long part names keeps Cancel and Continue visible",
  [ADM, W, ON, QB, "Have a new customer for this test, customer C, flagged as an Internal customer.", cA(), cB(),
   "Have a new work order for this test, work order 1, for customer A, billable, with one special-order part whose vendor bill is posted, the part's name long with spaces and the characters "
   + SPECIAL + " (for example " + N_PW + ").",
   "Have a new work order for this test, work order 2, for customer B, billable, with one special-order part whose vendor bill is posted, the part's name long with no spaces (for example " + N_PB + ").", FIT],
  ["Open work order 1.", "Click Change Customer on the customer card.", "Pick customer C.", "Click Cancel.", "Open work order 2.", "Click Change Customer on the customer card.", "Pick customer C."],
  [["Work order 1 opens."], ["The customer picker opens."],
   ["The window \"Change where the cost is posted?\" opens with the body \"The vendor bill for [part's name] ($[amount]) was posted to [account]. If you continue, that cost moves to [account] when this work order is closed.\"",
    "The part's name shows in full and stays inside the window.", EXACT.replace("Each name shows", "The part's name shows"),
    "The buttons Cancel and \"Continue\" are visible; the text covers neither."],
   ["The window closes and work order 1 keeps customer A."], ["Work order 2 opens."], ["The customer picker opens."],
   ["The window names work order 2's part in full; the long name with no spaces stays inside the window and does not run past its edge.",
    "The buttons Cancel and \"Continue\" are visible."]],
  ["S2-R8", "UFS-14"], ["flow1-2c"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-116", "I-P20", "Design: System notes with long category and line names stay inside the note",
  [ADM, W, ON, kA("No Charge", NOREQ), kC("No Charge", NOREQ), "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, whose line 1 has a long title with no spaces (for example " + N_LB
   + ") and was marked No Charge under category A with Not in ShopView as original, and whose line 2 has a title with the characters " + SPECIAL + " (for example " + N_LC
   + ") and was marked No Charge under category C.", FIT_CAT],
  ["Open work order 1.", "Click the Notes tab.", "Click the three-dots menu in the header.", "Click Audit Log."],
  [["Work order 1 opens."],
   ["The note \"Line '[line 1's title]' marked No Charge by [user]. Category [category A's name], ...\" shows, author ShopView, with the time.",
    "The long title with no spaces and category A's name stay inside the note; no text runs past its edge or over the next note.",
    "The note for line 2 shows its title and category C exactly as saved.", EXACT],
   ["The menu opens."], ["The Audit Log shows a row for each mark; each row's text stays inside its row and covers neither the next row nor the time."]],
  ["S12-R6", "S2-R18"], ["flow6-5"], notes=[STRESS_NOTE], note=NAME_NOTE)

def DOC(where, stamp="NO CHARGE"):
    return (f"{where} shows, under the masthead line and on the left, the {stamp} stamp with the line \"Category: [category B's name]\"; "
            "the line stays on the left and never runs over the logo.")
D("D-117", "I-P21a", "Design: NO CHARGE document keeps a long category line left, clear of the logo",
  [ADM, W, ON, kB("No Charge", REQ), "Have a shop logo set for the test location, so the masthead shows it.", cW(", not flagged"),
   "Have a new invoiced work order for this test, work order 2, for customer A.",
   "Have a new No Charge work order for this test, work order 1, for customer A, category B, original work order work order 2, closed.", FIT, FIT_CAT],
  ["Open work order 1.", "Open the Finance tab.", "Click Download.", "Open the downloaded PDF.", "Click Print."],
  [["Work order 1 opens."],
   ["The NO CHARGE document shows the NO CHARGE stamp under the masthead line, on the left, with the line \"Category: [category B's name] · Original work order [work order 2's number]\".",
    "The category line stays on the left and never runs over the logo; the long name with no spaces does not run past the document's edge.",
    "Bill to shows customer A's name in full, inside its block.", EXACT],
   ["A PDF file downloads."], [DOC("The PDF"), "Customer A's name shows in full inside the Bill to block."], ["The print preview opens.", DOC("The print preview")]],
  ["S3-R5"], ["flow2-5"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-118", "I-P21b", "Design: INTERNAL document keeps a long category line left, clear of the logo",
  [ADM, W, ON, kB("Internal"), "Have a shop logo set for the test location, so the masthead shows it.",
   cW(", flagged as an Internal customer, with one asset whose Internal category is category B"),
   "Have a new internal work order for this test, work order 1, for internal customer A on that asset, closed.", FIT, FIT_CAT],
  ["Open work order 1.", "Open the Finance tab.", "Click Download.", "Open the downloaded PDF.", "Click Print."],
  [["Work order 1 opens."],
   ["The document shows the INTERNAL stamp under the masthead line, on the left, with the line \"Category: [category B's name]\".",
    "The category line stays on the left and never runs over the logo; the long name with no spaces does not run past the document's edge.",
    "Bill to shows customer A's name in full, inside its block.", EXACT],
   ["A PDF file downloads."], [DOC("The PDF", "INTERNAL"), "Customer A's name shows in full inside the Bill to block."], ["The print preview opens.", DOC("The print preview", "INTERNAL")]],
  ["S3-R5"], ["flow1-8"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-119", "I-P22", "Design: Portal no-charge estimate keeps a long category line inside the page",
  [ADM, W, ON, kB("No Charge", NOREQ), cW(", not flagged, with one asset and a portal contact whose portal login the tester can use"),
   "Have a new work order for this test, work order 1, for customer A, whose estimate was sent to the portal and which was then converted to No Charge with category B.", FIT, FIT_CAT],
  ["Sign in to the customer portal as customer A's contact.", "Open work order 1's estimate in the portal."],
  [["The portal opens."],
   ["The estimate shows the NO CHARGE stamp with the line \"Category: [category B's name]\" under it.",
    "The category line stays inside the page; the long name with no spaces does not run past the page's edge or under other text.",
    "Customer A's name shows exactly as saved.", "No prices show."]],
  ["S2-R4", "S2-R11"], ["flow2-7b"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-120", "I-P23", "Design: Invoice shows a long category under the no-charge line title",
  [ADM, W, ON, kB("No Charge", NOREQ), kC("No Charge", NOREQ), "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, every line Complete, whose line 2 is marked No Charge under category B and whose line 3 is marked No Charge under category C.", FIT_CAT],
  ["Open work order 1.", "Click Create invoice.", "Open the invoice preview on the Finance tab."],
  [["Work order 1 opens."], ["The invoice is created."],
   ["Line 2 shows at $0.00 with category B's name as a line under its title; line 3 at $0.00 with category C's name under its title.",
    "Each category name stays inside the line's description; neither runs over the hours or the $0.00 amounts.", EXACT]],
  ["S12-R7", "UFS-39"], ["flow6-7"], notes=[STRESS_NOTE])

D("D-121", "I-P24", "Design: Missing original work order message with a long line title is readable",
  [ADM, W, ON, "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, every line Complete, whose line 2 has a long title with no spaces (for example " + N_LB
   + ") and is marked No Charge under Comeback with no original work order.",
   "Have a new work order for this test, work order 2, for customer A, billable, every line Complete, whose line 2 has a title with the characters " + SPECIAL + " (for example " + N_LC
   + ") and is marked No Charge under Comeback with no original work order.", FIT],
  ["Open work order 1.", "Click Create invoice.", "Open work order 2.", "Click Create invoice."],
  [["Work order 1 opens."],
   ["Create invoice is refused with the message \"Line '[line 2's title]' needs its original work order (or Not in ShopView) before the invoice.\"",
    "The message shows the long title with no spaces in full and stays on screen; it does not run past the screen's edge.", "Edit Line opens on line 2."],
   ["Work order 2 opens."], ["The message names line 2's title exactly as saved.", EXACT.replace("Each name shows", "The title shows")]],
  ["S12-R9", "UFS-38"], ["flow6-6"], notes=[STRESS_NOTE], note=NAME_NOTE)

RPT3 = [kA("Internal"), kB("No Charge", NOREQ), kC("No Charge", NOREQ),
        "Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A.", cB(),
        "Have a new internal work order for this test, work order 1, for internal customer A, closed this month.",
        "Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month.",
        "Have a new No Charge work order for this test, work order 3, for customer B, category C, closed this month.", FIT_CAT]
D("D-122", "I-P26", "Design: Report summary cards with long category names stay readable",
  [ADM, W, ON] + RPT3, ["Open Reports > Internal Work Orders.", "Set the date range to this month."],
  [["The report opens."],
   ["The summary strip shows a card for category A, category B and category C.",
    "Each card shows its category's name inside the card, with the parts cost, the count and the hours visible; no name runs past the card's edge or over the next card.", EXACT]],
  ["S9-R2"], ["flow4-5"], notes=[STRESS_NOTE])

D("D-123", "I-P27", "Design: Report Category and Original technician filters show long names in rows",
  [ADM, W, ON, kA("No Charge", REQ), kB("No Charge", REQ), kC("No Charge", NOREQ + ", archived after work order 3 below was closed"),
   "Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).",
   "Have a new user for this test, technician B, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).",
   "Have a new customer for this test, customer A.",
   "Have a new invoiced work order for this test, work order 4, for customer A, whose line 1 was worked by technician A and whose line 2 by technician B.",
   "Have a new No Charge work order for this test, work order 1, for customer A, category A, closed this month, with work order 4's line 1 as its original line.",
   "Have a new No Charge work order for this test, work order 2, for customer A, category B, closed this month, with work order 4's line 2 as its original line.",
   "Have a new No Charge work order for this test, work order 3, for customer A, category C, closed this month.", FIT_CAT],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Open the \"Category\" filter.", "Pick category B.", "Open the \"Original technician\" filter."],
  [["The report opens."], ["Rows for work order 1, work order 2 and work order 3 show."],
   ["Category A and category B show as rows, and category C under the Archived heading.", "Each name stays inside its own row; none runs over the next row or out of the list.", EXACT],
   ["The Category filter box shows category B's name inside the box; it covers neither the next filter nor the Export button."],
   ["Technician A and technician B show as rows, each name inside its own row."]],
  ["S9-R2"], ["flow4-5"], notes=[STRESS_NOTE])

D("D-124", "I-P28", "Design: Long technician names stay in their rows on the By technician tab",
  [ADM, W, ON, "Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).",
   "Have a new user for this test, technician B, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).",
   "Have a new user for this test, technician C, a technician whose name has the characters " + SPECIAL + " (for example Ann \"AJ\" O'Neil <Lead> & Co).",
   "Have a new customer for this test, customer A.",
   "Have a new invoiced work order for this test, work order 4, for customer A, with line 1 worked by technician A, line 2 by technician B and line 3 by technician C, each line Complete this month.",
   "Have a new work order for this test, work order 1, for customer A, invoiced this month, whose line 2 was No Charge under Comeback with work order 4's line 1 as its original line.", FIT],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Open the \"By technician\" tab."],
  [["The report opens."], ["Work order 1's line shows."],
   ["Rows for technician A, technician B and technician C show.", "Each name stays inside the technician cell; none runs over Completed lines.",
    "Every column heading (Completed lines, Comeback lines, Warranty lines, Comeback rate, Redo hours, Redo parts cost) is visible.", EXACT]],
  ["S9-R2"], ["flow4-6"], notes=[STRESS_NOTE])

D("D-125", "I-P31", "Design: AccountingHub Held reason with a long category stays in its row",
  [ADM, W, ON, AH, kB("No Charge", NOREQ + ", whose row in Accounting > Account Mappings is left empty"),
   "Have a new customer for this test, customer A.",
   "Have a new No Charge work order for this test, work order 1, for customer A, category B, with one stock part with a cost, closed.", FIT_CAT],
  ["Open Accounting > Accounting Events."],
  [["Work order 1's event shows with the status Held and the reason \"No Charge: [category B's name] row not mapped\".",
    "The reason shows category B's name in full and stays inside its row; it covers neither the next column nor the row below.", "The Retry action is visible."]],
  ["S8-N2", "UFS-22"], ["flow5-4"], notes=[STRESS_NOTE], note=NAME_NOTE)

D("D-126", "I-P32", "Design: QB Unexported row with a long customer name keeps the Internal badge",
  [ADM, W, ON, QB, cB(", flagged as an Internal customer"),
   "Have a new internal work order for this test, work order 1, for internal customer B, with one stock part with a cost, closed with a posting date in a QuickBooks closed period.", FIT],
  ["Open QB Unexported.", "Click the Journal Entries tab."],
  [["QB Unexported opens."],
   ["Work order 1's row shows with customer B's name and the \"Internal\" badge.",
    "The long name with no spaces stays inside its cell and pushes the badge neither out of the row nor over the next column.",
    "Export and Mark as Exported are visible on the row."]],
  ["S7-N3"], ["flow5-1"], notes=[STRESS_NOTE])

D("D-127", "I-P33", "Design: Asset Invoices tab keeps a long customer name and the badge in place",
  [ADM, W, ON, cB(", flagged as an Internal customer, with one asset"),
   "Have a new internal work order for this test, work order 1, for internal customer B on that asset, closed.", FIT],
  ["Open customer B's asset.", "Click the Invoices tab."],
  [["The asset's page opens."],
   ["Work order 1's row shows status Closed, the badge and Total balance \"No Charge\".",
    "Customer B's name stays inside its cell; it covers neither the status nor the badge.", "Every column heading of the tab is visible."]],
  ["S9-R10", "S3-R6"], ["flow1-10b"], notes=[STRESS_NOTE])

RPT_BASE = [kA("Internal"), kB("No Charge", NOREQ),
            "Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).",
            cA(", flagged as an Internal customer, whose Default internal category is category A"), cB(), cC(),
            "Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 was worked by technician A.",
            "Have a new internal work order for this test, work order 1, for internal customer A, closed this month.",
            "Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month, with work order 4's line 1 as its original line.",
            "Have a new work order for this test, work order 3, for customer C, invoiced this month, billable, whose line 2 has a long title with no spaces (for example "
            + N_LB + ") and was No Charge under Goodwill.", FIT, FIT_CAT]
P("S9-49", "I-P25", "S9", "Report keeps work order numbers and dates on one line with long names",
  [ADM, W, ON] + RPT_BASE,
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Resize the browser window to 1536 pixels wide."],
  [["The report opens."],
   ["Rows for work order 1, work order 2 and work order 3's line 2 show.",
    "Every work order number and every Closed / invoiced date sits on one line; no number or date is broken over two lines.",
    "Each long Customer, Category, Line and Original technician value stays inside its own cell and covers no other column.",
    "Work order 1's Original work order and Original technician cells show a dash \"—\".", EXACT],
   ["Every work order number and date still sits on one line; each long value still stays inside its own cell."]],
  ["S9-R2"])

P("S9-50", "I-P29", "S9", "Report PDF and CSV keep long and unusual names whole",
  [ADM, ON] + RPT_BASE,
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Export the report as PDF.", "Open the downloaded PDF.", "Export the report as CSV.",
   "Open the downloaded CSV in a spreadsheet program."],
  [["The report opens."], ["Rows for work order 1, work order 2 and work order 3's line 2 show."], ["A PDF file downloads."],
   ["Both tabs show as sections; each long name shows in full inside its own cell and runs over no other column or off the page.", EXACT],
   ["A CSV file downloads."],
   ["Each customer, category, line title and technician name sits whole in its own cell, exactly as saved; no row is split into extra columns."]],
  ["S9-R2"])

P("S9-51", "I-P30", "S9", "Customer Invoice export keeps a long category with quotes and commas in one cell",
  [ADM, ON,
   f"Have a new Internal category for this test, category A, whose name has a comma, quotes and the characters & ' < > (for example {N_KX}).",
   kB("No Charge", NOREQ),
   "Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A.", cB(),
   "Have a new internal work order for this test, work order 1, for internal customer A, closed today, with one labor line of 1.0 hour.",
   "Have a new work order for this test, work order 2, for customer B, invoiced today, billable, whose line 2 was No Charge under category B.", FIT, FIT_CAT],
  ["Open Export Reports.", "Pick Customer Invoice.", "Tick \"Include internal and no-charge work orders\".", "Export today's file.", "Open the file in a spreadsheet program."],
  [["The Export Reports window opens."], ["Customer Invoice is picked."], ["The option is ticked."], ["The file downloads."],
   ["Work order 1's rows show Classification \"Internal\" and category A's name whole in the Category cell, exactly as saved, comma and quotes included.",
    "Work order 2's no-charge line shows as a $0.00 row with category B's name in its description.",
    "Customer B's name sits whole in its own cell; no row is split into extra columns."]],
  ["S9-R6", "S9-R13"])

# =============================================== STATE CHANGES (17 proposals, 6 held) ===============================================
D("D-128", "I-S01", "Design: Turning Internal Work Orders on adds the hint, the toggles above stay",
  [ADM, W, OFF, "Make sure Internal Work Orders has been switched on in this organization before, so switching it on opens no window."],
  ["Open Settings > Work Orders.", SHOT, "Switch the \"Internal Work Orders\" toggle on.", "Switch the \"Internal Work Orders\" toggle off."],
  [["The toggle \"Internal Work Orders\" is off, with its description and no hint line."], ["You have a picture of the toggles with Internal Work Orders off."],
   ["One hint line with an info icon appears under the toggle's description.",
    "Every toggle above Internal Work Orders (Require Review Before Completion included) is in the same place as in your screenshot.",
    "The rows below the hint move down by the hint's height only; nothing moves left or right."],
   ["The hint line goes away and the page matches your screenshot."]],
  ["S1-R3", "S1-R10"], ["Main", "flow0-2"],
  notes=["The design's two pictures of this page differ only by the inserted hint line and the rows below it."])

D("D-129", "I-S02", "Design: Adding chips in the turn-on window moves nothing above the picker",
  [ADM, W, NEWORG, cA(), cB(), FIT],
  ["Open Settings > Work Orders.", "Switch the \"Internal Work Orders\" toggle on.", "Take a screenshot of the window.", "Pick customer A in the customer picker.",
   "Pick customer B in the customer picker."],
  [["The toggle is off."], ["The window \"Which customers are your own company?\" opens."], ["You have a picture of the window with nothing picked."],
   ["Customer A's chip shows.", "The title, the body and the top of the picker field are in the same place as in your screenshot.",
    "\"Do this later\" and \"Save\" are at the bottom right of the window, in that order, fully visible."],
   ["Customer B's chip shows; if the chips need more room the window grows downward.",
    "The title, the body and the top of the picker field are still in the same place as in your screenshot.",
    "\"Do this later\" and \"Save\" are still at the bottom right of the window, fully visible."]],
  ["S1-R2"], ["flow0-1b"], notes=["The design draws this window in one state only, with one chip."])

D("D-130", "I-S03", "Design: Switching category tabs keeps the title, tabs and columns in place",
  [ADM, W, ON, QB],
  ["Open Administration > Service > Internal Work Orders.", SHOT, "Open the No Charge categories tab.", "Open the Internal categories tab."],
  [["The Internal categories tab is open."], ["You have a picture of the Internal categories tab."],
   ["The title, the intro text and the two tabs are in the same place as in your screenshot.",
    "The four column headings (Category, QuickBooks expense account, Original work order, Work orders) start at the same left-right places as the four headings in your screenshot."],
   ["The page matches your screenshot."]],
  ["S1-R13"], ["flow0-2a", "flow0-2b"],
  notes=["The design's two pictures keep the title, the tabs and the four headings at the same places; only the New button's label is longer."])

D("D-131", "I-S04", "Design: Show archived lists the archived rows without moving the columns",
  [ADM, W, ON, QB, "Have a new Internal category for this test, category A, archived."],
  ["Open Administration > Service > Internal Work Orders.", SHOT, "Click the \"Show archived\" link under the table.", "Click the \"Show active\" link."],
  [["The Internal categories tab is open with a \"Show archived\" link, followed by the number of archived categories, under the table."], ["You have a picture of the active categories."],
   ["The table lists the archived categories, category A among them, each with Restore.", SAME], ["The active categories show again.", SAME]],
  ["S1-R13", "S1-R16"], ["flow0-2a"])

D("D-132", "I-S05", "Design: Ticking Internal customer adds the select without moving the fields",
  [ADM, W, ON, "Have a new customer for this test, customer A, not flagged."],
  ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Take a screenshot of the window.", "Tick the \"Internal customer\" checkbox.", "Click Cancel."],
  [["Customer A's page opens."], ["The Edit Customer window opens."], ["You have a picture of the window."],
   ["The select \"Default internal category\" appears under the checkbox.",
    "Every field above the select, and the checkbox itself, is in the same place as in your screenshot.", "The window's buttons are visible at its bottom."],
   ["The window closes; customer A's header shows no \"Internal\" badge after the name."]],
  ["S1-R7"], ["flow0-11"])

D("D-133", "I-S06", "Design: Ticking No Charge adds the category fields below, nothing above moves",
  [ADM, W, ON, "Have a new customer for this test, customer A, not flagged, with one asset.",
   "Have a new invoiced work order for this test, work order 1, for customer A, so Warranty has an original to offer.", "Start on Work Orders."],
  ["Click New Work Order.", "Pick customer A.", "Take a screenshot of the window.", "Tick \"No Charge\".", "Pick Warranty in Category.", "Click Cancel."],
  [["The New Work Order window opens."], ["Customer A is picked."], ["You have a picture of the window."],
   ["The select \"Category\" appears under \"No Charge\".", "Every field above \"No Charge\" is in the same place as in your screenshot."],
   ["The select \"Original work order\" appears under Category, offering work order 1.", "Every field above \"No Charge\" is still in the same place as in your screenshot.",
    "Cancel and Save are visible at the bottom of the window."],
   ["The window closes and no work order is created."]],
  ["S2-R2"], ["flow1-2a", "flow1-2e"],
  notes=["The design's two pictures are identical above the inserted fields; the window grows downward."])

D("D-134", "I-S11", "Design: Closing and reopening keeps the lines table headings in place",
  [ADM, W, ON, NO_ACCT, "Have a new customer for this test, customer A, flagged as an Internal customer.",
   "Have a new internal work order for this test, work order 1, for internal customer A, with two lines, every line Complete."],
  ["Open work order 1.", SHOT, "Open the Finance tab.", "Click Close Work Order on the Finance tab.", "Open the Lines tab.", "Open the Finance tab.",
   "Click the three-dots menu on the Finance tab.", "Click Reopen Work Order.", "Click Reopen Work Order in the window.", "Open the Lines tab."],
  [["Work order 1 opens on the Lines tab."], ["You have a picture of the lines table."], ["The Finance tab opens."], ["Work order 1 is Closed."],
   ["The lines table shows.", SAME], ["The Finance tab opens."], ["The menu offers Reopen Work Order."], ["The window \"Reopen work order [number]?\" opens."],
   ["Work order 1 is Complete again."], ["The lines table shows.", SAME]],
  ["S3-R6", "S4-R2"], ["flow1-5", "flow3-1", "flow3-3"],
  notes=["The design's pictures of this work order Complete, Closed and Complete again keep every lines table heading at the same place.",
         "Difference: register IWO-D17: the design still draws Rate and Total on an internal work order; the PRD hides them. The case compares only the headings shown."],
  note=NAME_NOTE)

RPT2 = ["Have a new customer for this test, customer A, flagged as an Internal customer.", "Have a new customer for this test, customer B.",
        "Have a new internal work order for this test, work order 1, for internal customer A, closed this month.",
        "Have a new No Charge work order for this test, work order 2, for customer B, category Goodwill, closed this month."]
D("D-135", "I-S12", "Design: Switching report tabs keeps the filters, cards and tabs in place",
  [ADM, W, ON] + RPT2,
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", SHOT, "Click the \"By technician\" tab.", "Click the \"By work order and line\" tab."],
  [["The report opens."], ["Work order 1 and work order 2 show."], ["You have a picture of the report on \"By work order and line\"."],
   ["The title, the filters, the summary cards and the two tabs are in the same place as in your screenshot."], ["The page matches your screenshot."]],
  ["S9-R2"], ["flow4-5", "flow4-6"], notes=["The design's two pictures differ above the table only in which tab is selected."])

D("D-136", "I-S13", "Design: Changing a report filter keeps the filters and tabs in place",
  [ADM, W, ON] + RPT2,
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", SHOT, "Pick Internal in the \"Classification\" filter.", "Pick All in the \"Classification\" filter."],
  [["The report opens."], ["Work order 1 and work order 2 show."], ["You have a picture of the report."],
   ["Only work order 1 shows.", "The title, every filter box, the top of the summary strip and the two tabs are in the same place as in your screenshot."],
   ["Both work orders show again; the filters and tabs are still in the same place as in your screenshot."]],
  ["S9-R2"], ["flow4-5"], notes=["This case checks the filters, the summary strip and the tabs; the design draws the report in one filter state."])

D("D-137", "I-S16", "Design: Opening a three-dots menu leaves the lines table headings in place",
  [ADM, W, ON, "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with two lines."],
  ["Open work order 1.", SHOT, "Click the three-dots menu of line 2.", "Click an empty part of the page.", "Click the three-dots menu in the header."],
  [["Work order 1 opens on the Lines tab."], ["You have a picture of the lines table."],
   ["The line menu opens over the rows below, with \"Mark as No Charge\" between Edit line and Delete line.", SAME, "No row moves down to make room for the menu."],
   ["The menu closes."], ["The work order menu opens over the page.", SAME]],
  ["S12-R1", "S2-R5"], ["flow6-1"], notes=["The design draws the line menu floating over the rows."])

D("D-138", "I-S17", "Design: Turning the setting off keeps the categories table columns in place",
  [ADM, W, ON, QB],
  ["Open Administration > Service > Internal Work Orders.", SHOT, "Open Settings > Work Orders.", "Switch the \"Internal Work Orders\" toggle off.", "Click Save settings.",
   "Open Administration > Service > Internal Work Orders."],
  [["The Internal categories tab is open."], ["You have a picture of the categories page."], ["The Work Orders settings open."], ["The toggle is off."], ["The settings are saved."],
   ["The notice \"Internal Work Orders is off. Turn it on in Settings > Work Orders.\" shows at the top.",
    "The tabs and the table move down by the notice's height only; every column heading starts at the same left-right place as in your screenshot.",
    "The lists stay editable: the row menus still offer Edit."]],
  ["S1-R13", "S1-R10"], ["flow0-2a", "flow0-2e"],
  notes=["The design's two pictures keep the four headings at the same left-right places; the notice pushes the page down.",
         "Difference: register IWO-D07: the design greys the tables while the setting is off; the PRD keeps the lists editable. The case follows the PRD."])

# ---- held on question 17 (columns when the rows change) ----
UNIQ = "starts with a word that no other customer in the organization uses"
WOL = [f"Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces and {UNIQ} (for example Quillmont Heavy Truck and Trailer Repair Services of North Dakota).",
       "Have a new customer for this test, customer B, whose name starts with the same word as customer A's and is long with no spaces (for example QuillmontHeavyTruckTrailerRepairServicesLimitedNorthDakota).",
       "Have a new internal work order for this test, work order 1, for internal customer A, in Estimate.",
       "Have a new work order for this test, work order 2, for customer B, billable, in Estimate.", FIT]
SEARCH = "Type the first word of customer A's name in the work orders search."
D("D-139", "I-S07", "Design: Work orders list columns keep their place when Classification changes",
  [ADM, W, ON] + WOL,
  ["Open Work Orders.", SEARCH, SHOT, "Click the Classification chip.", "Pick Internal.", "Click the Classification chip.", "Pick No Charge."],
  [["The work orders list opens."], ["Work order 1 and work order 2 show."], ["You have a picture of the list with both rows."],
   ["The chip offers All, Billable, Internal and No Charge."], ["Only work order 1 shows.", SAME], ["The chip's values show."], ["No row shows.", SAME]],
  ["S2-R14"], ["flow4-1", "flow4-2", "flow4-3"],
  notes=["The design draws the headings 1 to 4 pixels apart for Internal and up to 214 pixels apart when no row is left (Customer, Unit #, Asset, Lead Technician, Lines, Total price); the PO is asked (question 17)."],
  marker="PO:columns-when-rows-change", note=HELD_NOTE)

D("D-140", "I-S08", "Design: Work orders list columns keep their place on the All tab with Closed",
  [ADM, W, ON] + WOL + ["Have a new internal work order for this test, work order 3, for internal customer A, closed."],
  ["Open Work Orders.", SEARCH, SHOT, "Click the All tab.", "Pick Closed in the Status chip."],
  [["The work orders list opens."], ["Work order 1 and work order 2 show."], ["You have a picture of the list."],
   ["Work order 1, work order 2 and work order 3 show.", SAME], ["Only work order 3 shows, with its badge.", SAME]],
  ["S2-R10"], ["flow4-1", "flow1-9"],
  notes=["The design draws Unit #, Asset and Lead Technician 9 to 42 pixels apart between these two states; the PO is asked (question 17)."],
  marker="PO:columns-when-rows-change", note=HELD_NOTE)

D("D-141", "I-S14", "Design: Report table headings keep their place when the rows change",
  [ADM, W, ON] + RPT_BASE + ["Have enough other closed internal work orders this month for the report table to need scrolling (for example 40), made for this test."],
  ["Open Reports > Internal Work Orders.", "Set the date range to this month.", SHOT, "Pick Internal in the \"Classification\" filter.", "Pick All in the \"Classification\" filter.",
   "Scroll down to the totals row at the end of the table.", "Scroll back to the top of the table."],
  [["The report opens."], ["The rows show, with work order 1, work order 2 and work order 3's line 2 among them."], ["You have a picture of the table's headings."],
   ["Only internal work orders show.", SAME], ["Every row type shows again.", SAME], ["The totals row shows under the last row; the values of the last rows line up with the totals row's columns."], ["The headings show again.", SAME]],
  ["S9-R2"], ["flow4-5"],
  notes=["The design draws one state of this table; its columns are sized to their content and its cells wrap, so the rows decide the widths. The design library says tables in the product scroll (no pages). The PO is asked (question 17)."],
  marker="PO:columns-when-rows-change", note=HELD_NOTE)

D("D-142", "I-S15", "Design: Technician Efficiency columns keep their place when the chip changes",
  [ADM, W, ON, "Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).",
   "Have a new customer for this test, customer A, flagged as an Internal customer.", "Have a new customer for this test, customer B.",
   "Have a new internal work order for this test, work order 1, for internal customer A, closed this month, on which technician A clocked 2.0 hours.",
   "Have a new work order for this test, work order 2, for customer B, invoiced this month, billable, on which technician A clocked 1.0 hour."],
  ["Open Reports > Technician Efficiency.", "Set the date range to this month.", SHOT, "Click the Internal work orders chip.", "Pick Only internal.", "Click the Internal work orders chip.",
   "Pick Hide."],
  [["The report opens with the chip on Show all."], ["Technician A's row shows the hours of work order 1 and work order 2."], ["You have a picture of the report."],
   ["The chip offers Hide, Only internal and Show all."], ["Technician A's row shows only work order 1's hours.", SAME], ["The chip's values show."],
   ["Technician A's row shows only work order 2's hours.", SAME]],
  ["S9-R3"], ["flow4-4"], notes=["The design draws one state of this report; the PO is asked (question 17)."],
  marker="PO:columns-when-rows-change", note=HELD_NOTE)

# ---- held on question 18 (lines table when a line or the work order becomes No Charge) ----
D("D-143", "I-S09", "Design: Lines table columns keep their place when a line is marked No Charge",
  [ADM, W, ON, NO_ACCT, "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with two lines, each with 1.0 h of labor and one stock part with a cost."],
  ["Open work order 1.", SHOT, "Click the three-dots menu of line 2.", "Click Mark as No Charge.", "Pick Goodwill in Category.", "Click \"Mark as No Charge\" in the window.",
   "Click the three-dots menu of line 2.", "Click Mark as Billable.", "Click \"Mark as Billable\" in the window."],
  [["Work order 1 opens on the Lines tab."], ["You have a picture of the lines table."], ["The line menu opens."], ["The window \"Mark this line as No Charge?\" opens."],
   ["Goodwill is picked."],
   ["Line 2 shows the chip \"No Charge · Goodwill\" and $0.00.", "Line 2 still has its three-dots menu.", SAME],
   ["The menu offers \"Change category\" and \"Mark as Billable\"."], ["The confirmation \"Mark line as billable?\" opens."],
   ["The chip is gone and line 2 shows a price again.", SAME]],
  ["S12-R3", "S12-R5"], ["flow6-1", "flow6-3", "flow6-4"],
  notes=["The design draws Actual/Estimate and Status about 40 pixels further right once the line carries its chip (boards 01 and 04), and board 03 drops the three-dots column. The menu is settled by the PRD; the column places are asked (question 18)."],
  marker="PO:lines-columns-no-charge", note=HELD_NOTE)

D("D-144", "I-S10", "Design: Lines table columns keep their place when the work order is converted",
  [ADM, W, ON, NO_ACCT, "Have a new customer for this test, customer A, not flagged.",
   "Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with no deposit, with two lines, each with 1.0 h of labor and one stock part with a cost."],
  ["Open work order 1.", SHOT, "Click the three-dots menu in the header.", "Click Convert to No Charge.", "Pick Goodwill in Category.", "Click \"Convert to No Charge\" in the window.",
   "Click the three-dots menu in the header.", "Click Convert to Billable.", "Click \"Convert to Billable\" in the window."],
  [["Work order 1 opens on the Lines tab."], ["You have a picture of the lines table."], ["The menu opens."], ["The window \"Convert work order [number] to No Charge?\" opens."],
   ["Goodwill is picked."],
   ["Work order 1 shows the \"No Charge\" badge.", "The Rate, Margin and Total columns are hidden.",
    "The Name/Description, Actual/Estimate and Status headings are in the same place as in your screenshot."],
   ["The menu offers \"Change category\" and \"Convert to Billable\"."], ["The window \"Convert work order [number] to billable?\" opens."],
   ["The badge is gone and the Rate and Total columns show again.", SAME]],
  ["S2-R4", "S2-R5", "S2-R6"], ["flow2-1", "flow2-3"],
  notes=["The design moves the Rate heading about 52 pixels after Convert and keeps Rate and Total with empty cells (register IWO-D17, settled by the PRD: they are hidden). The places of the other columns are asked (question 18)."],
  marker="PO:lines-columns-no-charge", note=NAME_NOTE + " " + HELD_NOTE)
