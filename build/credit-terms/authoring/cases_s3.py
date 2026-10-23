"""Story 3 — Create or edit a credit term (S3-R1 to S3-R16, S3-N1 to S3-N3, S3-E1, S3-E2, Error Handling)."""
from ct_lib import C, HOLD
from common import *

NEWWIN = ('Click "New Credit Term".', 'the "New Credit Term" window opens.')
TODAY = ("Today's date on the calendar of {Location-A} is {Date-A}.", "For example: {Date-A} is Oct 21.")
def win(key, title, pre, pairs, q, note="", marker=None, start=PAGE):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S3", title, [ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)

win("S3-01", "New Credit Term opens with Name focused and Net X days chosen", [STD_ACTIVE],
    [('Click "New Credit Term".',
      'a window titled "New Credit Term" opens. The cursor is in "Name" (required), with the hint "Up to 31 characters. Prints on invoices and goes to QuickBooks." under it. Below are exactly two options, one chosen at a time: "Due Net X days" with a Days box followed by "days after the invoice date", and "Due day of the following month" with a Day box followed by "of the following month". "Due Net X days" is chosen, both boxes are empty, and the Day box is disabled. The buttons are "Cancel" and "Create Credit Term", and "Create Credit Term" is disabled. There is no option for an early-payment discount.')],
    ["S3-R1", "S3-R2", "S3-R2 NAME", "S3-R2 OPTS", "S3-R3", "S3-R6", "UFS-19", "OOS-3", "T-OWN"])

win("S3-02", "Clicking the disabled Day box chooses it and empties Days", [],
    [NEWWIN, ('Type 14 in the Days box.', 'the Days box reads 14.'),
     ('Click the disabled Day box.', '"Due day of the following month" becomes chosen, the cursor is in the Day box, and the Days box is now disabled and empty.'),
     ('Click the disabled Days box.', '"Due Net X days" becomes chosen again, the cursor is in the Days box (empty, the 14 was not kept), and the Day box is disabled and empty.')],
    ["S3-R3", "S3-R4"])

win("S3-03", "The blue line explains a Net term with today's date as the example", [TODAY, ("{Date-B} is {Date-A} plus 14 days.", "For example: {Date-B} is Nov 4 (Oct 21 + 14 days).")],
    [NEWWIN, ('Type "Net 14 Days" in Name.', "the Name reads Net 14 Days."), ("Type 14 in the Days box.",
      'a blue information line shows below the options: "Net 14 Days means payment is due 14 days after the invoice date. An invoice dated {Date-A} is due {Date-B}." The dates read as a short month and day (for example "Oct 21" and "Nov 4").'),
     ("Replace 14 with 0.", "the blue line disappears while the number is invalid."), ("Replace 0 with 15.", "the blue line comes back, now ending \"is due\" {Date-A} plus 15 days (for example Nov 5).")],
    ["S3-R5", "S3-R5 NET", "UFS-27"])

win("S3-04", "The blue line explains a day-of-the-following-month term", [TODAY, ("{Date-B} is the 10th of the month after {Date-A}.", "For example: {Date-B} is Nov 10.")],
    [NEWWIN, ('Type "10th of next month" in Name.', "the Name reads 10th of next month."), ("Click the Day box.", '"Due day of the following month" is chosen.'),
     ("Type 10 in the Day box.", 'the blue line reads: "10th of next month means payment is due on the 10th of the following month. An invoice dated {Date-A} is due {Date-B}."')],
    ["S3-R5", "S3-R5 DAY", "UFS-28"])

win("S3-05", "With no name typed, the blue line says \"This term\"", [TODAY, ("{Date-B} is {Date-A} plus 30 days.", "For example: {Date-B} is Nov 20 (Oct 21 + 30 days).")],
    [NEWWIN, ("Type 30 in the Days box.", 'the blue line reads: "This term means payment is due 30 days after the invoice date. An invoice dated {Date-A} is due {Date-B}." and no Name error shows.')],
    ["S3-R5 EMPTY", "S3-R10"])

win("S3-06", "The blue line's example date follows the location you work in",
    [("You are enrolled at {Location-B}, in a time zone where today's date is already {Date-B} while it is still {Date-A} at {Location-A}. Run the case at a time of day when the two dates differ.",
      "For example: {Location-A} is in Edmonton, {Location-B} is in Auckland, {Date-A} is Oct 21 and {Date-B} is Oct 22."), TODAY],
    [NEWWIN, ("Type 14 in the Days box.", 'the blue line reads "… An invoice dated {Date-A} is due …" ({Date-A} plus 14 days).'),
     ('Click "Cancel".', "the window closes."), ("Switch location to {Location-B} with the location switcher.", "the app now works in {Location-B}."),
     NEWWIN, ("Type 14 in the Days box.", 'the blue line now reads "… An invoice dated {Date-B} is due …" ({Date-B} plus 14 days).')],
    ["S3-R16", "S3-R5"])

win("S3-07", "Create Credit Term stays disabled until name and number are valid", [],
    [NEWWIN, ('Type "Net 9" in Name.', '"Create Credit Term" is still disabled (no number yet).'),
     ("Type 9 in the Days box.", '"Create Credit Term" becomes enabled.'), ("Clear the Name.", '"Create Credit Term" is disabled again.')],
    ["S3-R6"])

win("S3-08", "Creating a Net term shows a toast and puts it in every picker",
    [STD_ACTIVE, ("A new name {Term-A} that no term has, and a customer {Customer-A} and a vendor {Vendor-A}.",
                  "For example: {Term-A} is ZZAUTOTEST S3-08 Fourteen, {Customer-A} is ZZAUTOTEST S3-08 Customer and {Vendor-A} is ZZAUTOTEST S3-08 Vendor.")],
    [NEWWIN, ("Type {Term-A} in Name.", "the Name reads {Term-A}."), ("Type 14 in the Days box.", "the blue line shows."),
     ('Click "Create Credit Term".', 'the window closes and a green toast shows "{Term-A} created". {Term-A} appears on the Active tab between Net 7 and Net 15, its Due reads "14 days after the invoice date", and its Customers and Vendors read 0 and 0.'),
     ("Open Edit Customer for {Customer-A} in a new tab.", "Edit Customer opens."), ("Open the Credit Terms dropdown.", "{Term-A} is offered, between Net 7 and Net 15, without reloading anything else."),
     ("Open Edit Vendor for {Vendor-A} in a new tab.", "Edit Vendor opens."), ("Open the Credit Terms dropdown.", "{Term-A} is offered there too, between Net 7 and Net 15.")],
    ["S3-R7", "UFS-17", "EH-S3b", "GOAL-2", "KD-ONELIST", "S1-R5"])

win("S3-09", "Creating a day-of-the-following-month term lists it after the Net terms",
    [STD_ACTIVE, ("A new name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-09 Tenth.")],
    [NEWWIN, ("Type {Term-A} in Name.", "the Name reads {Term-A}."), ("Click the Day box.", '"Due day of the following month" is chosen.'), ("Type 10 in the Day box.", "the blue line shows."),
     ('Click "Create Credit Term".', 'the toast "{Term-A} created" shows; {Term-A} is listed after Net 120 and before Credit Hold, with Due "10th of the following month" and 0 customers and 0 vendors.')],
    ["S3-R7", "S1-R7 DAY"])

win("S3-10", "Clearing the name and leaving the field shows \"Enter a name.\"", [],
    [NEWWIN, ('Type "x" in Name.', "the Name reads x."), ("Delete the x.", "the Name is empty."), ("Click the Days box.", 'the message "Enter a name." shows under Name.'),
     ('Type "Net 9" in Name.', "the message disappears once the name is valid.")],
    ["S3-R9 EMPTY", "UFS-20", "S3-R10", "S3-R9"])

win("S3-11", "Opening the window or clicking an option never shows a name error", [],
    [NEWWIN, ("Click the Day box.", "no message shows under Name."), ("Click the Days box.", "still no message under Name."), ('Click the "Due day of the following month" option.', "still no message under Name.")],
    ["S3-R10"])

win("S3-12", "The Name field stops at 31 characters", [("A 32-character text, {Text-A}.", "For example: {Text-A} is ZZAUTOTEST S3-12 Thirty Two Chars (32 characters).")],
    [NEWWIN, ("Type {Text-A} in Name.", "the Name holds only the first 31 characters; the 32nd is not accepted, and no error shows.")],
    ["S3-R9 LONG", "S3-R2 NAME", "KD-RANGE"])

win("S3-13", "A name that is a standard term in other capitals or spacing is refused", [],
    [NEWWIN, ('Type "net 30" in Name.', "the Name reads net 30."), ("Click the Days box.", 'the message "Net 30 is already a standard term. Pick another name." shows under Name, and "Create Credit Term" is disabled.'),
     ('Replace the Name with "Net30".', "the Name reads Net30."), ("Click the Days box.", 'the same message shows: "Net 30 is already a standard term. Pick another name."'),
     ('Replace the Name with "due on receipt".', "the Name reads due on receipt."), ("Click the Days box.", 'the message reads "Due on Receipt is already a standard term. Pick another name."')],
    ["S3-R9 STD", "UFS-22", "S3-R9", "A-SPELL"])

win("S3-14", "A name matching another of the shop's terms is refused, even inactive",
    [own("{Term-A}", "net 14", example="ZZAUTOTEST S3-14 Fourteen"), ("The shop's own term {Term-B}, due on day 5 of the following month, is deactivated.", "For example: {Term-B} is ZZAUTOTEST S3-14 Fifth.")],
    [NEWWIN, ("Type {Term-A} in Name, in capital letters and with two spaces between its words.", "the Name shows what you typed."),
     ("Click the Days box.", 'the message "A term called {Term-A} already exists." shows (with the existing term\'s own spelling), and "Create Credit Term" is disabled.'),
     ("Replace the Name with {Term-B}.", "the Name reads {Term-B}."), ("Click the Days box.", 'the message "A term called {Term-B} already exists." shows, although {Term-B} is inactive.')],
    ["S3-R9 DUP", "UFS-23", "S3-R9"])

win("S3-15", "Days must be a whole number from 1 to 365", [],
    [NEWWIN, ('Type "Net X" in Name.', "the Name reads Net X."), ("Type 0 in the Days box.", 'the message "Enter 1 to 365 days." shows under the Days box.'),
     ("Replace it with 366.", 'the message "Enter 1 to 365 days." shows.'), ("Replace it with 1.5.", 'the message "Enter 1 to 365 days." shows.'),
     ("Replace it with 365.", "the message disappears and the blue line shows."), ("Replace it with 1.", "the message disappears and the blue line shows (1 is valid).")],
    ["S3-R9 DAYS", "UFS-24", "KD-RANGE"])

win("S3-16", "Day must be a whole number from 1 to 31", [],
    [NEWWIN, ('Type "Day X" in Name.', "the Name reads Day X."), ("Click the Day box.", '"Due day of the following month" is chosen.'), ("Type 0 in the Day box.", 'the message "Enter a day from 1 to 31." shows under the Day box.'),
     ("Replace it with 32.", 'the message "Enter a day from 1 to 31." shows.'), ("Replace it with 2.5.", 'the message "Enter a day from 1 to 31." shows.'),
     ("Replace it with 31.", "the message disappears and the blue line shows."), ("Replace it with 1.", "no message, and the blue line shows.")],
    ["S3-R9 DAY", "UFS-25", "KD-RANGE"])

win("S3-17", "Correcting an invalid number clears the error at once", [],
    [NEWWIN, ("Click the Day box.", '"Due day of the following month" is chosen.'), ("Type 0 in the Day box.", 'the message "Enter a day from 1 to 31." shows.'),
     ("Replace the 0 with 25, without leaving the box.", "the message disappears immediately, while the cursor is still in the Day box.")],
    ["S3-R11"])

win("S3-18", "Extra spaces in a name are removed before it is saved",
    [("A name, {Term-A}, made of two words, that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-18 Two Words.")],
    [NEWWIN, ("Type {Term-A} with two spaces before it, three spaces between two of its words and one space after it.", "the Name shows the extra spaces."),
     ("Type 14 in the Days box.", "the blue line shows."), ('Click "Create Credit Term".', "the toast and the new row show {Term-A} with single spaces and no space before or after it.")],
    ["S3-R12", ("Jira SV-11672 acceptance criterion", "Given the name \"  Net   14 \" is saved, then it saves as \"Net 14\" (S3-R12)")])

win("S3-19", "Editing a term opens it filled and keeps its own name valid",
    [own("{Term-A}", "net 10", ", held by no customer, vendor or invoice", "ZZAUTOTEST S3-19 Net 10")],
    [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."),
     ('Click "Edit".', 'a window titled "Edit Credit Term" opens with the Name {Term-A}, "Due Net X days" chosen and 10 in the Days box; the buttons are "Cancel" and "Save Changes".'),
     ('Click "Save Changes" without changing anything.', 'no "already exists" message shows; the window closes and the toast "{Term-A} saved" shows.')],
    ["S2-R4", "S3-R1", "S3-R13", "S3-N2"])

win("S3-20", "Saving an edit shows the new name and Due text in the row",
    [own("{Term-A}", "net 10", ", held by no customer, vendor or invoice", "ZZAUTOTEST S3-20 Ten"), ("A new name {Term-B} that no term has.", "For example: {Term-B} is ZZAUTOTEST S3-20 Fifteenth.")],
    [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Edit".', 'the "Edit Credit Term" window opens.'),
     ("Replace the Name with {Term-B}.", "the Name reads {Term-B}."), ("Click the Day box.", '"Due day of the following month" is chosen and Days is emptied.'),
     ("Type 15 in the Day box.", "the blue line shows."),
     ('Click "Save Changes".', 'the window closes, the green toast "{Term-B} saved" shows, and the row now reads {Term-B} with Due "15th of the following month", listed after the Net terms.')],
    ["S3-R8", "UFS-18", "EH-S3b"])

win("S3-21", "A double click on Create Credit Term creates one term",
    [("A new name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-21 Fourteen.")],
    [NEWWIN, ("Type {Term-A} in Name.", "the Name reads {Term-A}."), ("Type 14 in the Days box.", "the blue line shows."),
     ('Double-click "Create Credit Term" quickly.', 'the button is disabled while saving; one toast "{Term-A} created" shows, no "already exists" error appears, and {Term-A} is listed once.')],
    ["S3-R14"])

win("S3-22", "Escape or a click outside does not close the window",
    [("A name, {Term-A}.", "For example: {Term-A} is ZZAUTOTEST S3-22 Fourteen.")],
    [NEWWIN, ("Type {Term-A} in Name.", "the Name reads {Term-A}."), ("Type 14 in the Days box.", "the blue line shows."),
     ("Press Escape.", "the window stays open, with {Term-A} and 14 still typed."), ("Click on the page outside the window.", "the window stays open, with everything still typed.")],
    ["S3-R15", "KD-MODAL"])

win("S3-23", "Cancel or the close icon discards the window's contents",
    [("A name, {Term-A}, that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-23 Fourteen.")],
    [NEWWIN, ("Type {Term-A} in Name.", "the Name reads {Term-A}."), ('Click "Cancel".', "the window closes; no toast shows and no {Term-A} row is added."),
     ('Click "New Credit Term".', "the window opens with Name and both boxes empty."), ('Type {Term-A} in Name.', "the Name reads {Term-A}."),
     ("Click the close icon at the top right of the window.", "the window closes without saving; no {Term-A} row is added."),
     ('Click "New Credit Term".', "the window opens empty again.")], ["S3-N3"])

win("S3-24", "A name that reads like a Net term may carry a different rule",
    [("Names {Term-A} and {Term-B} that read like Net terms but are not standard terms.", "For example: {Term-A} is Net 6 and {Term-B} is Net 14.")],
    [NEWWIN, ("Type {Term-A} in Name.", "no message shows under Name."), ("Click the Day box.", '"Due day of the following month" is chosen.'), ("Type 25 in the Day box.", "the blue line shows."),
     ('Click "Create Credit Term".', 'the term {Term-A} is created; its Due column reads "25th of the following month" (the rule, not the name).'),
     NEWWIN, ("Type {Term-B} in Name.", "no message shows under Name."), ("Type 14 in the Days box.", "the blue line shows."),
     ('Click "Create Credit Term".', 'the toast "{Term-B} created" shows.')],
    ["S3-E1", "KD-NAMES"])

TWO = ("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S3 Second Admin.")
win("S3-25", "Creating a name another user just created is refused, window stays",
    [TWO, ("A new name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST S3-25 Fourteen."), ("Starting screen: the Credit Terms page is open in both browsers.", None)],
    [('In your browser, click "New Credit Term".', "the window opens."), ("In your browser, type {Term-A} in Name.", "the Name reads {Term-A}."), ("In your browser, type 14 in the Days box.", "the blue line shows."),
     ("In {User-B}'s browser, click \"New Credit Term\".", "{User-B}'s window opens."), ("In {User-B}'s browser, type {Term-A} in Name.", "the Name reads {Term-A}."),
     ("In {User-B}'s browser, type 20 in the Days box.", "the blue line shows."), ('In {User-B}\'s browser, click "Create Credit Term".', '{User-B} sees "{Term-A} created".'),
     ('In your browser, click "Create Credit Term".', 'the app\'s error alert shows "A term called {Term-A} already exists." Your window stays open with {Term-A} and 14 still typed.')],
    ["S3-E2", "EH-S3a"], start=None)

win("S3-26", "Saving an edit after another user put a customer on the term is refused",
    [TWO, own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S3-26 Fourteen"),
     ("Customer {Customer-A} holds COD.", "For example: {Customer-A} is ZZAUTOTEST S3-26 Customer."),
     ("Starting screen: your browser shows the Credit Terms page; {User-B}'s browser shows Edit Customer for {Customer-A}.", None)],
    [('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Edit".', 'the "Edit Credit Term" window opens.'),
     ("Replace 14 with 21 in the Days box.", "the blue line shows 21 days."), ("In {User-B}'s browser, set Credit Terms to {Term-A}.", "{Term-A} is selected."),
     ("In {User-B}'s browser, click Save.", "the customer is saved on {Term-A}."),
     ('In your browser, click "Save Changes".', 'the app\'s error alert shows "Used by 1 customer. Deactivate it instead to take it out of the pickers." The window stays open with 21 still typed, and the row still reads 14 days.')],
    ["EH-S3a", "KD-LOCK", "OOS-6"], start=None)

win("S3-27", "A name longer than 31 characters is refused by the server", [],
    [("Send a create request with a 32-character name by a means other than the window (the window stops at 31).",
      'the request is refused with "Use 31 characters or fewer." and no term is created.')],
    ["S3-R9 LONG", "UFS-21", "EH-S3a"],
    marker=HOLD("the Name field stops at 31 characters, so only a request sent outside the window can reach this refusal"),
    note="A manual tester cannot reach this (case S3-12 checks the field stops at 31). It is for an automated check.")

win("S3-28", "A create request with no option chosen is refused", [],
    [("Send a create request with a name and no option by a means other than the window (the window always has one chosen).",
      'the request is refused with "Pick Due Net X days or Due day of the following month." and no term is created.')],
    ["UFS-26", "EH-S3a"],
    marker=HOLD("the window always has one option chosen, so only a request sent outside the window can reach this refusal"),
    note="A manual tester cannot reach this. It is for an automated check.")
