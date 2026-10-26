"""Story 12 — Credit Terms audit log (S12-R1 to S12-R8, S12-N1 to S12-N3, S12-E1 to S12-E3, Error Handling): one case per event type
with the exact Event and Details text (brief point 10)."""
from ct_lib import C, HOLD, CLEAN_HOLD
from common import *

def lg(key, title, pre, pairs, q, note="", marker=None, who=None, start=PAGE):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S12", title, [who or ADMIN()] + pre + ([start] if start else []), st, rs, q, note=note, marker=marker)
LOG = [('Click the "⋯" page menu beside "New Credit Term".', "the menu opens."), ('Click "Audit Log".', 'the "Credit Terms Log" window opens.')]
def log_then(res): return [LOG[0], (LOG[1][0], res)]
ME = ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S12 Admin.")
def create(name="{Term-A}", n="14"):
    return [('Click "New Credit Term".', "the window opens."), (f"Type {name} in Name.", "the name is typed."), (f"Type {n} in the Days box.", "the blue line shows."),
            ('Click "Create Credit Term".', f'the toast "{name} created" shows.')]
def row_menu(t): return (f'Click the "⋯" at the right of the {t} row.', "the menu opens.")

lg("S12-01", "The page menu holds Audit Log, which opens the Credit Terms Log", [],
   [('Click the "⋯" page menu beside "New Credit Term".', 'the menu holds exactly one item, "Audit Log".'),
    ('Click "Audit Log".', 'a window titled "Credit Terms Log" opens, laid out like the Work Order Log: a search box, then a table with the columns Event, User, Details, Date and Time (no Line column).')],
   ["S12-R1", "S12-R2", "UFS-47", "S12-R3 HEAD", "S1-R2"])

lg("S12-02", "Creating a term writes a \"Credit term created\" row", [ME, ("A new name {Term-A}.", "For example: {Term-A} is ZZAUTOTEST S12-02 Net 14.")],
   create() + log_then('the newest row reads Event "Credit term created", User {User-A}, Details "{Term-A}: 14 days after the invoice date", with today\'s date and the time.'),
   ["S12-R3", "S12-R3 CREATED", "UFS-48", "UFS-49", "KD-LOG"])

lg("S12-03", "Renaming a term logs only the name change",
   [own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S12-03 Old"), ("A new name {Term-B}.", "For example: {Term-B} is ZZAUTOTEST S12-03 New.")],
   [row_menu("{Term-A}"), ('Click "Edit".', "the window opens."), ("Replace the Name with {Term-B}.", "the name is typed."), ('Click "Save Changes".', 'the toast "{Term-B} saved" shows.')]
   + log_then('the newest row reads Event "Credit term edited" and Details "Name: {Term-A} → {Term-B}", with nothing about Due.'),
   ["S12-R3 EDITED"])

lg("S12-04", "Changing a term's days logs only the Due change",
   [own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S12-04 Term")],
   [row_menu("{Term-A}"), ('Click "Edit".', "the window opens."), ("Replace 14 with 21 in the Days box.", "the blue line shows 21 days."), ('Click "Save Changes".', "the toast shows.")]
   + log_then('the newest row reads "Credit term edited" with Details "Due: 14 days after the invoice date → 21 days after the invoice date", with nothing about the name.'),
   ["S12-R3 EDITED"])

lg("S12-05", "Changing both name and rule logs both parts",
   [own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S12-05 Old"), ("A new name {Term-B}.", "For example: {Term-B} is ZZAUTOTEST S12-05 New.")],
   [row_menu("{Term-A}"), ('Click "Edit".', "the window opens."), ("Replace the Name with {Term-B}.", "the name is typed."), ("Click the Day box.", "the day option is chosen."),
    ("Type 10 in the Day box.", "the blue line shows."), ('Click "Save Changes".', "the toast shows.")]
   + log_then('the newest row reads "Credit term edited" with Details "Name: {Term-A} → {Term-B}" and "Due: 14 days after the invoice date → 10th of the following month".'),
   ["S12-R3 EDITED"])

lg("S12-06", "Deactivating and reactivating a term each write a row", [("Net 45 is active.", None)],
   [row_menu('"Net 45"'), ('Click "Deactivate".', 'the toast "Net 45 deactivated" shows.'), ('Click the "Inactive" tab.', "Net 45 is listed."), row_menu('"Net 45"'),
    ('Click "Reactivate".', 'the toast "Net 45 reactivated" shows.')]
   + log_then('the two newest rows read, newest first: "Credit term reactivated" / "Net 45: 45 days after the invoice date", then "Credit term deactivated" / "Net 45: 45 days after the invoice date".'),
   ["S12-R3 DEACT", "S12-R3 REACT", "S12-R2"])

lg("S12-07", "Deleting a term writes a row and its earlier rows stay",
   [("A new name {Term-A}.", "For example: {Term-A} is ZZAUTOTEST S12-07 Short Lived.")],
   create() + [row_menu("{Term-A}"), ('Click "Delete Credit Term".', "the confirmation opens."), ('Click the red "Delete Credit Term" button.', 'the toast "{Term-A} deleted" shows.')]
   + log_then('the newest row reads "Credit term deleted" / "{Term-A}: 14 days after the invoice date", and the earlier "Credit term created" row for {Term-A} is still there below it.'),
   ["S12-R3 DEL", "S12-E2"])

lg("S12-08", "Changing the default writes a \"Default changed\" row",
   [DEFAULT_COD, own("{Term-A}", "net 14", example="ZZAUTOTEST S12-08 Net 14")],
   [row_menu("{Term-A}"), ('Click "Make Default for New Customers".', "the confirmation opens."), ('Click "Make Default".', "the toast shows.")]
   + log_then('the newest row reads Event "Default changed" and Details "COD → {Term-A}".'),
   ["S12-R3 DEF", ("Jira SV-11681 acceptance criterion", "Given the default changes from COD to Net 14, then a row reads \"Default changed\" / \"COD → Net 14\" (S12-R3).")])

lg("S12-09", "Moving customers to a Net term writes a row with no limit line",
   [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly three customers.", "For example: {Term-A} is ZZAUTOTEST S12-09 N20 and its customers are ZZAUTOTEST S12-09 Alpha, Bravo and Charlie.")],
   [row_menu('{Term-A}'), ('Click "Move Customers".', "the window opens with 3 selected."), ('Choose "Net 45" in "Move To".', "Net 45 is chosen."), ('Click "Move 3 Customers".', "the toast shows.")]
   + log_then('the newest row reads Event "Customers moved" and Details "3 customers from {Term-A} to Net 45", with no credit-limit line.'),
   ["S12-R3 MOVED", "KD-LOG"])

lg("S12-10", "Log rows show the user, and date and time in your location's calendar",
   [ME, ("You are enrolled at {Location-B}, in a time zone {Hours-A} hours apart from {Location-A}.", "For example: {Location-B} is in Toronto and {Hours-A} is 2 (Edmonton to Toronto)."),
    ("Net 50 is active.", None)],
   [row_menu('"Net 50"'), ('Click "Deactivate".', "the toast shows."), LOG[0], (LOG[1][0], "the newest row shows User {User-A} and the date and time of the change as clocks at {Location-A} read them."),
    ("Close the log.", "the log closes."), ("Switch location to {Location-B}.", "the page reloads."), LOG[0], (LOG[1][0], "the same row now shows the time {Hours-A} hours later (as clocks at {Location-B} read it), and the date changes too if the move crosses midnight.")],
   ["S12-R4", "S12-R6"])

lg("S12-11", "Searching the log matches Event, User or Details, ignoring capitals",
   [ME, ("The log holds rows for several events, including at least one \"Default changed\" row and one row whose Details mention Net 45.", None)],
   LOG + [('Type "default changed" in the search box.', 'only "Default changed" rows remain.'), ('Replace the text with "NET 45".', "only rows whose Event, User or Details contain Net 45 remain."),
          ("Replace the text with your user name in lower-case letters.", "only rows whose User is {User-A} remain.")],
   ["S12-R5"])

lg("S12-12", "Log rows cannot be edited or deleted", [("The log holds at least one row.", None)],
   LOG + [("Look at a row and its cells.", "there is no edit, delete or menu control on any row."), ("Click a Details cell.", "the text cannot be changed.")],
   ["S12-R6"])

T13 = lambda k: own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", f"ZZAUTOTEST {k} Net 14")
NEWEST = ("Write down the newest row of the log before you start.", None)
lg("S12-13", "Cancelling a delete writes no log row", [T13("S12-13"), NEWEST],
   [row_menu("{Term-A}"), ('Click "Delete Credit Term".', "the confirmation opens."), ('Click "Cancel".', "it closes.")]
   + log_then("the newest row is still the one you wrote down."), ["S12-R7"])
lg("S12-13b", "Cancelling Make Default writes no log row", [T13("S12-13b"), NEWEST],
   [row_menu("{Term-A}"), ('Click "Make Default for New Customers".', "the confirmation opens."), ('Click "Cancel".', "it closes.")]
   + log_then("the newest row is still the one you wrote down."), ["S12-R7"])
lg("S12-13c", "Saving an edit with no change writes no log row", [T13("S12-13c"), NEWEST],
   [row_menu("{Term-A}"), ('Click "Edit".', "the window opens."), ('Click "Save Changes" without changing anything.', "the window closes.")]
   + log_then("the newest row is still the one you wrote down: an action that changes nothing writes no row."), ["S12-R7"])
lg("S12-14", "A refused action writes no row",
   [("You and a second user, {User-B}, are both signed in with the \"Admin\" role, in two separate browsers.", "For example: {User-B} is ZZAUTOTEST S12-14 Second Admin."),
    own("{Term-A}", "net 14", ", held by no customer, vendor or invoice", "ZZAUTOTEST S12-14 Net 14"),
    ("Starting screen: the Credit Terms page is open in both browsers.", None)],
   [('In your browser, click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Delete Credit Term".', "the confirmation opens."),
    ('In {User-B}\'s browser, click the "⋯" at the right of the {Term-A} row.', "{User-B}'s menu opens."), ('In {User-B}\'s browser, click "Make Default for New Customers".', "the confirmation opens."),
    ('In {User-B}\'s browser, click "Make Default".', '{User-B} sees "{Term-A} is now the default".'),
    ('In your browser, click the red "Delete Credit Term" button.', 'the alert "This is your default for new customers. Pick another default first." shows.'), ('Click "Cancel".', "the confirmation closes."),
    LOG[0], (LOG[1][0], 'the newest row is {User-B}\'s "Default changed"; there is no "Credit term deleted" row.')],
   ["S12-R7"], start=None)

lg("S12-15", "Long names in the log wrap and are never cut off",
   [("The shop's own term {Term-A} has a 31-character name.", "For example: {Term-A} is ZZAUTOTEST S12-15 Long Name 012."), ("A new name {Term-B}, also 31 characters.", "For example: {Term-B} is ZZAUTOTEST S12-15 Long Name 456.")],
   [row_menu("{Term-A}"), ('Click "Edit".', "the window opens."), ("Replace the Name with {Term-B}.", "the name is typed."), ('Click "Save Changes".', "the toast shows.")]
   + log_then('the Details "Name: {Term-A} → {Term-B}" shows both names in full, wrapping onto more lines; nothing is cut off.'),
   ["S12-R8"])

lg("S12-16", "An untouched log on release day shows its empty state", [("The organization existed before the release and nobody has used the Credit Terms page since.", None)],
   LOG[:1] + [(LOG[1][0], 'the table has no rows and shows "No history here. Yet." (changes from before the release are not in the log).')],
   ["S12-E1", "S12-N2", "UFS-50"], marker=CLEAN_HOLD)

lg("S12-17", "Changing a vendor's term in Edit Vendor writes nothing to the log",
   [("Vendor {Vendor-A} holds Net 30.", "For example: {Vendor-A} is ZZAUTOTEST S12-17 Vendor."), ("Write down the newest row of the log before you start.", None)],
   [("Open Edit Vendor for {Vendor-A}.", "the window opens."), ('Choose "Net 45".', "Net 45 is chosen."), ("Click Save & Close.", "the vendor is on Net 45."),
    ("Open the Credit Terms page.", "the page opens.")] + log_then("the newest row is still the one you wrote down."),
   ["S12-N3"], start=None)

