"""Story 4 — Move Customers (S4-R1 to S4-R24, S4-N1 to S4-N3, S4-E1 to S4-E4, Error Handling), with the permission matrix for Move
Customers (Key Decisions, Permissions; brief point 5) and the two-browser stale-window cases (brief point 6)."""
from ct_lib import C, HOLD, PO_HOLD
from common import *
from po_questions import QN

def mv(key, title, pre, pairs, q, note="", marker=None, start=PAGE, who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S4", title, [who or ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)

def open_move(row): return [(f'Click the "⋯" at the right of the {row} row.', "the menu opens."),
                            ('Click "Move Customers".', f'a window titled "Move Customers from {row.strip(chr(34))}" opens.')]
THREE = ("The shop's own term {Term-A}, due 15 days after the invoice date, is held by exactly three customers, {Customer-A}, {Customer-B} and {Customer-C} (a new term holds only this case's customers), whose names are in that A to Z order, with credit limits of $500.00, $0.00 and $1,000.00.",
         "For example: {Term-A} is ZZAUTOTEST S4 N15, {Customer-A} is ZZAUTOTEST S4 Alpha, {Customer-B} is ZZAUTOTEST S4 Bravo and {Customer-C} is ZZAUTOTEST S4 Charlie.")
def three(key):
    return (THREE[0], THREE[1].replace("ZZAUTOTEST S4", f"ZZAUTOTEST {key}"))
DEF30 = ("Net 30 is the shop's default for new customers.", None)
def only(ph, search):
    return [('Click "Select None".', '"0 selected" (every customer on the term is unticked, including those not in view).'),
            (f"Type {search} in \"Search customers\".", f"only {ph} is listed."), (f"Tick {ph}.", '"1 selected".')]

mv("S4-01", "Move Customers lists the term's customers A to Z, all ticked", [DEF30, three("S4-01")],
   open_move("{Term-A}") + [("Look at the window from top to bottom.",
     'it shows, top to bottom: a "Search customers" box; "Select All" and "Select None" with "3 selected" on the right; a list of {Customer-A}, {Customer-B} and {Customer-C} in that order, each with a ticked checkbox; a "Move To" dropdown reading Net 30, with the hint "Prefilled with your default for new customers." below it; and the buttons "Cancel" and "Move 3 Customers".')],
   ["S4-R1", "S4-R2", "S4-R4", "S4-R7", "UFS-34", "S2-R1 MOVE"])

mv("S4-02", "Moving from COD lists blank-term customers but never Counter Sale",
   [DEFAULT_COD, ("Customer {Customer-A} holds COD, customer {Customer-B} has a blank credit term, and the organization's Counter Sale customer, {Customer-C}, is on COD.",
                  "For example: {Customer-A} is ZZAUTOTEST S4-02 Alpha, {Customer-B} is ZZAUTOTEST S4-02 Blank (imported with an empty term) and {Customer-C} is the built-in Counter Sale customer.")],
   open_move('"COD"') + [("Type the start their names share in \"Search customers\".", "the list narrows to the case's customers."),
     ("Look at the list and at \"Move To\".", 'the list shows {Customer-A} and {Customer-B} (the blank-term customer is listed under COD), never {Customer-C} (search for its name too: it is not there). "Move To" starts empty because COD is the default, and no hint shows.')],
   ["S4-R3", "S4-R7", "T-COUNTER", "S11-R9"])

mv("S4-03", "Moving from Net 30 also lists a customer stored as \"NET 30\"",
   [DEFAULT_COD, ("Customer {Customer-A} holds Net 30 and customer {Customer-B} is stored with the text \"NET 30\" (from an old import).",
                  "For example: {Customer-A} is ZZAUTOTEST S4-03 Alpha and {Customer-B} is ZZAUTOTEST S4-03 Upper.")],
   open_move('"Net 30"') + [("Type the start their names share in \"Search customers\".", "the list shows both {Customer-A} and {Customer-B}, each ticked.")],
   ["S4-R3", "A-SPELL"])

mv("S4-04", "Searching narrows the list, Enter moves nobody, no match says so", [DEF30, three("S4-04")],
   open_move("{Term-A}") + [("Type the last word of {Customer-B}'s name in lower-case letters in \"Search customers\".", "only {Customer-B} is listed (the match ignores capitals)."),
     ("Press Enter.", "nothing is moved: the window stays open and no toast shows."),
     ('Replace the search text with "qqqq".', 'the list area shows "No customers match your search."')],
   ["S4-R5", "UFS-39"])

mv("S4-05", "Select None and Select All act only on the customers the search shows", [DEF30, three("S4-05")],
   open_move("{Term-A}") + [("Type the last word of {Customer-B}'s name in \"Search customers\".", "only {Customer-B} is listed."),
     ('Click "Select None".', '{Customer-B} is unticked and the count reads "2 selected".'), ("Clear the search box.", "all three are listed again: {Customer-A} and {Customer-C} still ticked, {Customer-B} unticked."),
     ('Click "Select None".', 'all three are unticked and the count reads "0 selected".'), ('Click "Select All".', 'all three are ticked and the count reads "3 selected".')],
   ["S4-R6", "S4-R2"])

mv("S4-06", "Move To offers every active term except the source, in page order",
   [DEF30, ("Net 15 is held by at least one customer. Net 50 and the shop's own term {Term-A} are deactivated, every other standard term is active, and the shop's own term {Term-B}, due 10 days after the invoice date, is active. Other shop terms (from other tests) may also be offered.",
            "For example: {Term-A} is ZZAUTOTEST S4-06 Old and {Term-B} is ZZAUTOTEST S4-06 Ten.")],
   open_move('"Net 15"') + [('Open the "Move To" dropdown.', "it offers the active terms in the page order: COD first, Due on Receipt second, then the Net terms by days with {Term-B} after Net 7 and before Net 20, then Net 20, Net 30, Net 45, Net 60, Net 90, Net 120, and Credit Hold last. Net 15 (the source), Net 50 and {Term-A} (inactive) are not offered.")],
   ["S4-R7", "S4-N3", "S1-R5"])

mv("S4-07", "The Move button is disabled with nobody ticked or no term chosen",
   [DEFAULT_COD, ("Customer {Customer-A} holds COD.", "For example: {Customer-A} is ZZAUTOTEST S4-07 Alpha.")],
   open_move('"COD"') + [('Click "Select None".', '"0 selected", and the move button is disabled.'), ("Type {Customer-A}'s name in \"Search customers\".", "only {Customer-A} is listed."),
     ("Tick {Customer-A}.", '"1 selected"; the button reads "Move 1 Customer" and is still disabled because "Move To" is empty (COD is the default).'),
     ('Choose "Net 30" in "Move To".', 'the button "Move 1 Customer" becomes enabled.')],
   ["S4-R8", "S4-R2", "S4-R7"])
mv("S4-08", "Moving three customers to Net 30 keeps their limits and shows a toast",
   [DEFAULT_COD, three("S4-08"), ("Before you start, Net 30's Customers count reads {Count-A} (write it down).", "For example: {Count-A} is 40.")],
   open_move("{Term-A}") + [('Choose "Net 30" in "Move To".', 'no line about credit limits shows.'),
     ('Click "Move 3 Customers".', 'no confirmation opens. The window closes, a green toast shows "3 customers moved to Net 30.", {Term-A}\'s Customers count reads 0 (3 − 3) and Net 30\'s reads {Count-A} + 3 (for example 43).'),
     ("Open {Customer-A}'s customer page.", 'the "Credit term" reads Net 30 and the credit limit is still $500.00.'),
     ("Open {Customer-C}'s customer page.", 'the "Credit term" reads Net 30 and the credit limit is still $1,000.00.')],
   ["S4-R9", "S4-R17", "UFS-40", "GOAL-4", "T-MDVSMC"])

mv("S4-09", "Moving one customer says \"1 customer moved\"",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.", "For example: {Term-A} is ZZAUTOTEST S4-09 N20, {Customer-A} is ZZAUTOTEST S4-09 Solo.")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', 'the button reads "Move 1 Customer".'),
     ('Click "Move 1 Customer".', 'the toast reads "1 customer moved to Net 45."')],
   ["S4-R9", "S4-R2", "UFS-40"])

mv("S4-10", "Each moved customer gets a note naming the old term, new term and user",
   [DEFAULT_COD, ("Your user name is {User-A}.", "For example: {Term-A} is ZZAUTOTEST S4-10 N20, {User-A} is ZZAUTOTEST S4-10 Admin."), ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, with a $0.00 limit.", "For example: {Customer-A} is ZZAUTOTEST S4-10 Solo.")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', 'the button reads "Move 1 Customer".'), ('Click "Move 1 Customer".', "the toast shows."),
     ("Open {Customer-A}'s customer page.", "the page opens."), ('Click the "Notes" tab.',
      'a new note, authored by {User-A}, reads "Credit term changed from {Term-A} to Net 45 by {User-A} (Move Customers)." with nothing about the credit limit after it.')],
   ["S4-R11", "S4-R20", "UFS-41", "KD-LOG"])

mv("S4-11", "A customer moved from a blank term reads \"from COD\" in its note",
   [("Due on Receipt is the shop's default for new customers.", None), ("Customer {Customer-A} has a blank credit term (it counts under COD).", "For example: {Customer-A} is ZZAUTOTEST S4-11 Blank."),
    ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S4-11 Admin.")],
   open_move('"COD"') + only("{Customer-A}", "{Customer-A}'s name") + [
     ('Click "Move 1 Customer".', '"Move To" was prefilled with Due on Receipt; the toast "1 customer moved to Due on Receipt." shows.'),
     ("Open {Customer-A}'s customer page.", "the page opens."), ('Click the "Notes" tab.', 'the note reads "Credit term changed from COD to Due on Receipt by {User-A} (Move Customers)."')],
   ["S4-R11", "S1-R12"])
mv("S4-12", "Moving to COD warns about limits and asks first, Cancel keeps choices", [DEF30, three("S4-12")],
   open_move("{Term-A}") + [('Choose "COD" in "Move To".', 'the line "Their credit limit will be set to $0." shows below "Move To".'),
     ('Click "Move 3 Customers".', 'a confirmation opens titled "Set 3 customers\' credit limit to $0?" with the message "This can\'t be undone. Their current limits are kept in each customer\'s note, and the Credit Terms Log records the move." and the buttons "Cancel" and a red "Set Limits To $0 And Move".'),
     ('Click "Cancel".', 'the confirmation closes and the Move Customers window is back with all three ticked and "Move To" still COD. Nobody was moved.')],
   ["S4-R10", "S4-R14", "S4-R15", "UFS-35", "UFS-36", "KD-MOVEZERO"])

mv("S4-13", "Moving to COD sets limits to $0 and keeps the old limit in the note",
   [DEF30, three("S4-13"), ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S4-13 Admin.")],
   open_move("{Term-A}") + [('Choose "COD" in "Move To".', 'the $0 line shows.'), ('Click "Move 3 Customers".', "the confirmation opens."),
     ('Click "Set Limits To $0 And Move".', 'the window closes and the toast "3 customers moved to COD." shows.'),
     ("Open {Customer-A}'s Notes tab.", 'the note reads "Credit term changed from {Term-A} to COD by {User-A} (Move Customers). Credit limit $500.00 → $0." and the customer\'s credit limit is now $0.00.'),
     ("Open {Customer-B}'s Notes tab.", 'the note reads "Credit term changed from {Term-A} to COD by {User-A} (Move Customers)." with no credit-limit part (its limit was already $0.00).'),
     ("Open {Customer-C}'s Notes tab.", 'the note ends "Credit limit $1,000.00 → $0." and the limit is $0.00.')],
   ["S4-R16", "S4-R20", "S4-E3", "KD-MOVEZERO", "UFS-41", ("Jira SV-11673 acceptance criterion", "Given a customer with a $500 limit moved to COD, then its limit is $0 and its note reads \"Credit term changed from {old term} to COD by {user name} (Move Customers). Credit limit $500.00 → $0.\" (S4-R11, S4-R16, S4-R20).")])

mv("S4-14", "Customers moved to Credit Hold get a $0 limit and cannot be invoiced",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held only by customer {Customer-A}, with a $500.00 limit, and work order {Work-order-1} for {Customer-A} is complete and ready to invoice.",
                  "For example: {Term-A} is ZZAUTOTEST S4-14 N20, {Customer-A} is ZZAUTOTEST S4-14 Hold and {Work-order-1} is S2-15440.")],
   open_move("{Term-A}") + [('Choose "Credit Hold" in "Move To".', 'the line "Their credit limit will be set to $0." shows.'),
     ('Click "Move 1 Customer".', 'a confirmation titled "Set 1 customer\'s credit limit to $0?" opens.'), ('Click "Set Limits To $0 And Move".', 'the toast "1 customer moved to Credit Hold." shows.'),
     ("Open {Customer-A}'s customer page.", 'the "Credit term" reads Credit Hold and the credit limit reads $0.00.'),
     ("Open {Work-order-1}'s Finance tab.", "no invoice can be created for {Customer-A}: the existing Credit Hold notice shows and Create Invoice is disabled.")],
   ["S4-E2", "S4-R14", "S4-R16", "S9-E2"])

mv("S4-15", "Moving customers off COD leaves their $0 limit as it is",
   [("Due on Receipt is the shop's default for new customers.", None), ("COD is held by customer {Customer-A}, with a $0.00 limit.", "For example: {Customer-A} is ZZAUTOTEST S4-15 Cash.")],
   open_move('"COD"') + only("{Customer-A}", "{Customer-A}'s name") + [('Choose "Net 30" in "Move To".', "no $0 line shows."),
     ('Click "Move 1 Customer".', 'no confirmation opens and the toast "1 customer moved to Net 30." shows.'),
     ("Open Edit Customer for {Customer-A}.", "Credit Terms reads Net 30 and Credit Limit reads $0.00, now editable.")],
   ["S4-E3", "S4-R17", "S5-R5"])
mv("S4-16", "A move changes only the term, and only for ticked customers",
   [DEFAULT_COD, three("S4-16"), ("{Customer-A} has a phone number, an address and a sales representative set. Customer {Customer-D} holds Net 20.",
                                  "For example: {Customer-D} is ZZAUTOTEST S4-16 Delta.")],
   open_move("{Term-A}") + [("Untick {Customer-C}.", '"2 selected".'), ('Choose "Net 45" in "Move To".', 'the button reads "Move 2 Customers".'),
     ('Click "Move 2 Customers".', 'the toast "2 customers moved to Net 45." shows.'),
     ("Open {Customer-A}'s customer page.", "the term is Net 45; the phone number, address, sales representative and credit limit are exactly as before."),
     ("Open {Customer-C}'s customer page.", "{Customer-C} (unticked) is still on {Term-A}, with no new note."),
     ("Open {Customer-D}'s customer page.", "{Customer-D} is still on Net 20, with no new note.")],
   ["S4-R18", "S4-R19"])

mv("S4-17", "A customer with incomplete details still moves",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, whose record misses details Edit Customer would ask for (for example no address).", "For example: {Term-A} is ZZAUTOTEST S4-17 N20, {Customer-A} is ZZAUTOTEST S4-17 Sparse.")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', "the button is enabled."), ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 45." shows and no error appears.'),
     ("Open {Customer-A}'s customer page.", '"Credit term" reads Net 45.')],
   ["S4-R12"])

mv("S4-18", "A double click on Move moves the customers once",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers, {Customer-A} and {Customer-B}.", "For example: {Term-A} is ZZAUTOTEST S4-18 N20, {Customer-A} is ZZAUTOTEST S4-18 Alpha and {Customer-B} is ZZAUTOTEST S4-18 Bravo.")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', 'the button reads "Move 2 Customers".'), ('Double-click "Move 2 Customers" quickly.', 'the button is disabled while saving; one toast "2 customers moved to Net 45." shows.'),
     ("Open {Customer-A}'s Notes tab.", "there is exactly one new move note."), ('On the Credit Terms page, open the "⋯" page menu.', "the menu opens."), ('Click "Audit Log".', 'exactly one new "Customers moved" row reads "2 customers from {Term-A} to Net 45".')],
   ["S4-R21", "S12-R3 MOVED"])

mv("S4-19", "A double click on Set Limits To $0 And Move moves once",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, with a $500.00 limit.", "For example: {Term-A} is ZZAUTOTEST S4-19 N20, {Customer-A} is ZZAUTOTEST S4-19 Solo.")],
   open_move("{Term-A}") + [('Choose "COD" in "Move To".', "the $0 line shows."), ('Click "Move 1 Customer".', "the confirmation opens."),
     ('Double-click "Set Limits To $0 And Move" quickly.', 'the button is disabled while saving; one toast "1 customer moved to COD." shows.'), ("Open {Customer-A}'s Notes tab.", "there is exactly one new move note.")],
   ["S4-R21"])

mv("S4-20", "Escape or a click outside keeps the Move window, Cancel closes it", [DEF30, three("S4-20")],
   open_move("{Term-A}") + [("Untick {Customer-B}.", '"2 selected".'), ('Choose "Net 45" in "Move To".', "Net 45 is chosen."), ("Press Escape.", "the window stays open with the same ticks and Net 45."),
     ("Click on the page outside the window.", "the window stays open, unchanged."), ('Click "Cancel".', "the window closes, no toast shows, and the three customers are still on {Term-A}."),
     ('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers".', "the window opens with all three ticked again."),
     ("Click the close icon at the top right of the window.", "the window closes without moving anyone.")],
   ["S4-R22", "KD-MODAL"])

mv("S4-21", "Long customer and term names wrap in the Move window",
   [DEFAULT_COD, ("The shop's own term {Term-A} has a 31-character name and is held by customer {Customer-A}, whose name is more than 60 characters long. Its other own term {Term-B} also has a 31-character name.",
                  "For example: {Term-A} is ZZAUTOTEST S4-21 Long Name TrmA, {Term-B} is ZZAUTOTEST S4-21 Long Name TrmB and {Customer-A} is ZZAUTOTEST S4-21 A Very Long Customer Name For Wrapping Checks Ltd.")],
   open_move("{Term-A}") + [("Look at the window title and the customer row.", "the title shows the whole of {Term-A} and the row shows the whole of {Customer-A}, wrapping onto more lines; nothing is cut off or ends in \"...\"."),
     ('Choose {Term-B} in "Move To".', "the whole of {Term-B} shows in the dropdown, wrapping if needed.")],
   ["S4-R23"])

mv("S4-22", "A term with 2,000 customers lists them all in under a second",
   [DEFAULT_COD, ("The shop's own term {Term-A} is held by exactly 2,000 customers.", "For example: {Term-A} is ZZAUTOTEST S4-22 Bulk and the customers are ZZAUTOTEST S4-22 0001 to ZZAUTOTEST S4-22 2000 (contacts import).")],
   [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers" while watching a stopwatch.', 'the full list shows in under 1 second, with "2000 selected" (or "2,000 selected").'),
    ("Scroll the list to the bottom.", "the list scrolls through every customer, ending with the last one in A to Z order; there are no page buttons and no \"load more\".")],
   ["S4-R13", "A-1500"])

mv("S4-23", "A term with more than 2,000 customers still lists them all",
   [DEFAULT_COD, ("The shop's own term {Term-A} is held by 2,500 customers.", "For example: {Term-A} is ZZAUTOTEST S4-23 Bulk and the customers are ZZAUTOTEST S4-23 0001 to ZZAUTOTEST S4-23 2500.")],
   open_move("{Term-A}") + [("Scroll the list to the bottom.", "every customer is listed, the last in A to Z order at the bottom, with no paging; the count reads 2500 (or 2,500) selected."),
     ('Choose "Net 30" in "Move To".', 'the button reads "Move 2500 Customers" (or with a comma).'), ('Click the move button.', 'the toast reports 2500 (or 2,500) customers moved to Net 30 and {Term-A}\'s Customers count reads 0. One move has no customer limit.')],
   ["S4-R24"])

mv("S4-24", "Emptying a deactivated term with Move lets it be deleted",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 14 days after the invoice date, is deactivated and held by one customer, {Customer-A}, and by no vendor or invoice.",
                  "For example: {Term-A} is ZZAUTOTEST S4-24 Old and {Customer-A} is ZZAUTOTEST S4-24 Customer.")],
   [('Click the "Inactive" tab.', "{Term-A} is listed."), ('Click the "⋯" at the right of the {Term-A} row.', 'the menu shows "Reactivate", "Move Customers" and a greyed "Delete Credit Term".'),
    ('Click "Move Customers".', 'the window "Move Customers from {Term-A}" opens with {Customer-A} ticked.'), ('Choose "Net 30" in "Move To".', "Net 30 is chosen."),
    ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 30." shows and {Term-A}\'s Customers count reads 0.'),
    ('Click the "⋯" at the right of the {Term-A} row.', '"Delete Credit Term" is now available (not greyed).'), ('Click "Delete Credit Term".', "the confirmation opens."),
    ('Click the red "Delete Credit Term" button.', 'the toast "{Term-A} deleted" shows and the row is gone.')],
   ["S4-N3", "S4-E4"])

mv("S4-25", "Credit Hold customers can be moved off Credit Hold",
   [DEFAULT_COD, ("Customer {Customer-A} holds Credit Hold, with a $0.00 limit (other customers may hold Credit Hold too).", "For example: {Customer-A} is ZZAUTOTEST S4-25 Held.")],
   open_move('"Credit Hold"') + only("{Customer-A}", "{Customer-A}'s name") + [('Choose "Net 30" in "Move To".', "no $0 line shows."),
     ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 30." shows; every other Credit Hold customer stays on Credit Hold.'),
     ("Open Edit Customer for {Customer-A}.", "Credit Terms reads Net 30 and Credit Limit is $0.00, editable.")],
   ["S4-N3", "S4-E3"])

def role(key, perms):
    return (f'You are signed in as {{User-A}}, on a custom role, {{Role-A}}, that has {perms} (and whatever it needs to reach Settings), and nothing else that matters here.',
            f"For example: {{User-A}} is ZZAUTOTEST {key} User and {{Role-A}} is ZZAUTOTEST {key} Role.")
GREY = 'the hover reads "You need Customers → Create & Edit and View and Manage AP/AR Data to move customers."'
for key, perms, title in [("S4-26", "only Settings → Finance (no Customers → Create & Edit, no View and Manage AP/AR Data)", "With only Settings Finance, Move Customers is greyed with the reason"),
                          ("S4-27", "Settings → Finance and Customers → Create & Edit, but not View and Manage AP/AR Data", "Without AP/AR Data access, Move Customers is greyed"),
                          ("S4-28", "Settings → Finance and View and Manage AP/AR Data, but not Customers → Create & Edit", "Without Customers Create & Edit, Move Customers is greyed")]:
    mv(key, title, [("Net 30 is held by at least one customer, and the shop's own term {Term-A} by none.", f"For example: {{Term-A}} is ZZAUTOTEST {key} Fourteen.")],
       [('Click the "⋯" at the right of the "Net 30" row.', 'the menu shows "Move Customers" greyed out, while "Make Default for New Customers" and "Deactivate" are available.'),
        ('Hover "Move Customers".', GREY), ('Click "Move Customers".', "nothing happens; no window opens."),
        ("Press Escape.", "the menu closes."), ('Click the "⋯" at the right of the {Term-A} row.', '"Move Customers" is greyed here too.'), ('Hover "Move Customers".', GREY + " (the permission reason, not the no-customers reason).")],
       ["S4-N1", "UFS-37", "PERM-MOVE", "KD-MOVEGATE", "S2-R1 MOVE", "PERM-PAGE"], who=role(key, perms))

mv("S4-29", "With all three permissions a custom role can move customers",
   [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.", "For example: {Term-A} is ZZAUTOTEST S4-29 N20, {Customer-A} is ZZAUTOTEST S4-29 Solo.")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', "the button is enabled."), ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 45." shows.')],
   ["PERM-MOVE", "KD-MOVEGATE", "S4-R9"], who=role("S4-29", "Settings → Finance, Customers → Create & Edit and View and Manage AP/AR Data"))

mv("S4-30", "A move sent without all three permissions is refused by the server",
   [("Net 20 is held by at least one customer.", None)],
   [("Send a move request for Net 20's customers by a means other than the page, as a user who has Settings → Finance but not View and Manage AP/AR Data.", "the request is refused and no customer changes term.")],
   ["S4-N1"], who=role("S4-30", "Settings → Finance and Customers → Create & Edit, but not View and Manage AP/AR Data"),
   marker=HOLD("the page greys Move Customers for this user, and changing a role signs the user out, so only a request sent outside the page can reach this refusal"),
   note="A manual tester cannot reach this: S4-26 to S4-28 check the page greys the item; an old open window does not help, because changing the user's role signs them out. It is for an automated check.")

TWO = ("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S4 Second Admin.")
mv("S4-31", "A ticked customer another user moved meanwhile is left alone",
   [TWO, DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers, {Customer-A} and {Customer-B}.", "For example: {Term-A} is ZZAUTOTEST S4-31 N20, {Customer-A} is ZZAUTOTEST S4-31 Alpha and {Customer-B} is ZZAUTOTEST S4-31 Bravo."),
    ("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-B}.", None)],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', 'the button reads "Move 2 Customers".'), ("In {User-B}'s browser, set Credit Terms to Net 60.", "Net 60 is selected."),
     ("In {User-B}'s browser, click Save.", "{Customer-B} is saved on Net 60."), ('In your browser, click "Move 2 Customers".', 'the toast reads "1 customer moved to Net 45." (only {Customer-A} is counted).'),
     ("Open {Customer-B}'s customer page.", "{Customer-B} is on Net 60 (left alone), with no move note."),
     ('On the Credit Terms page, open the "⋯" page menu.', "the menu opens."), ('Click "Audit Log".', 'the new "Customers moved" row reads "1 customer from {Term-A} to Net 45".')],
   ["S4-E1", "S12-E3"], start=None)

mv("S4-32", "If every ticked customer left the term meanwhile, the move is refused",
   [TWO, DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.", "For example: {Term-A} is ZZAUTOTEST S4-32 N20, {Customer-A} is ZZAUTOTEST S4-32 Solo."),
    ("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-A}.", None)],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', 'the button reads "Move 1 Customer".'), ("In {User-B}'s browser, set Credit Terms to Net 60.", "Net 60 is selected."),
     ("In {User-B}'s browser, click Save.", "{Customer-A} is saved on Net 60."), ('In your browser, click "Move 1 Customer".', 'the app\'s error alert shows "Pick at least one customer to move." and the window stays open.')],
   ["EH-S4a", "UFS-42"], start=None)

mv("S4-33", "If the Move To term was deactivated meanwhile, the move is refused",
   [TWO, DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}.", "For example: {Term-A} is ZZAUTOTEST S4-33 N20, {Customer-A} is ZZAUTOTEST S4-33 Solo."),
    ("Starting screen: the Credit Terms page is open in both browsers.", None)],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', "Net 45 is chosen."), ("In {User-B}'s browser, click the \"⋯\" at the right of the \"Net 45\" row.", "{User-B}'s menu opens."),
     ('In {User-B}\'s browser, click "Deactivate".', '{User-B} sees "Net 45 deactivated".'),
     ('In your browser, click "Move 1 Customer".', 'the app\'s error alert shows "Pick an active term other than {Term-A}." and the window stays open; {Customer-A} is still on {Term-A}.')],
   ["EH-S4b", "UFS-43"], start=None)

mv("S4-34", "If a move fails partway, nobody is changed",
   [DEFAULT_COD, three("S4-34")],
   open_move("{Term-A}") + [('Choose "Net 45" in "Move To".', "Net 45 is chosen."),
     ('Click "Move 3 Customers" while the move cannot complete.', 'the app\'s error alert shows "Couldn\'t move the customers. Nothing was changed. Please try again." The window stays open and all three customers are still on {Term-A} with no note.')],
   ["EH-S4c", "UFS-38"],
   marker=HOLD("a manual tester cannot make a move fail partway"), note="A manual tester cannot force a failure in the middle of a move; this is for an automated check or a developer-made failure.")

mv("S4-35", "Moving off a deactivated term: how the note names the old term",
   [DEFAULT_COD, ("The shop's own term {Term-A}, due 60 days after the invoice date, is deactivated and held only by customer {Customer-A}.", "For example: {Term-A} is ZZAUTOTEST S4-35 N60 and {Customer-A} is ZZAUTOTEST S4-35 Solo."),
    ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S4-35 Admin.")],
   [('Click the "Inactive" tab.', "{Term-A} is listed."), ('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers".', 'the window "Move Customers from {Term-A}" opens with {Customer-A} ticked.'),
    ('Choose "Net 30" in "Move To".', "the dropdown shows Net 30."), ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 30." shows.'),
    ("Open {Customer-A}'s customer page.", "the page opens."), ('Click the "Notes" tab.', 'the note reads "Credit term changed from {Term-A} to Net 30 by {User-A} (Move Customers)." — or with "{Term-A} (Inactive)", as the PO answers (see the note).')],
   ["S4-R11", "S4-N3"], marker=PO_HOLD(QN["move-note-inactive"]),
   note=f"The PRD does not say whether a deactivated term is named plainly or with \"(Inactive)\" in the note and the log. Question {QN['move-note-inactive']} on Chris Ward's sheet (shared with him 23 Oct 2026) asks; this case is held until he answers.")

mv("S4-36", "Moving a customer stored as \"NET 30\": how the note names the old term",
   [DEFAULT_COD, ("Customer {Customer-A} is stored with the text \"NET 30\" (from an old import).", "For example: {Customer-A} is ZZAUTOTEST S4-36 Upper."),
    ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S4-36 Admin.")],
   open_move('"Net 30"') + only("{Customer-A}", "{Customer-A}'s name") + [('Choose "Net 45" in "Move To".', "Net 45 is chosen."),
     ('Click "Move 1 Customer".', 'the toast "1 customer moved to Net 45." shows.'), ("Open {Customer-A}'s customer page.", "the page opens."),
     ('Click the "Notes" tab.', 'the note reads "Credit term changed from Net 30 to Net 45 …" or "from NET 30 …", as the PO answers.')],
   ["S4-R11", "S11-E2"], marker=PO_HOLD(QN["move-note-spelling"]),
   note=f"Question {QN['move-note-spelling']} on Chris Ward's sheet (shared with him 23 Oct 2026) asks which spelling the note uses; held until he answers.")
