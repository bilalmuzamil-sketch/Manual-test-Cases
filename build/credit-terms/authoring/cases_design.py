"""Design — how it looks (section DESIGN 91468, Rule 126). 49 "looks as designed" cases (D-01 … D-49 = plan DL-01 … DL-49) and 4 held
design-version cases (D-50 … D-53 = plan DV-01 … DV-04), from build/credit-terms/design-2026-10-23/DESIGN-CASE-PLAN.md (23 Oct 2026).
Each case attaches its design pictures (DREFS, set here through design_refs.R) and compares the screen with them at 1440 px, then checks
nothing overlaps or is cut off at 1536 px. The expected look comes from the PRD where it speaks (quoted) and from the design where it is
silent (the design's own words under References from Design). Where the drawn pictures and the build pictures differ (question 12,
register CT-D05), the case says which picture the attribute is compared with for now and that the attribute depends on question 12.
Written and owned by the design worker."""
from ct_lib import C, prd_line, DESIGN_HOLD
from common import *
from design_refs import DREFS, R, cap, txt

W1440 = ("The browser window is 1440 px wide, at 100% zoom.", "For example: a maximised window on a 1440 x 900 screen.")
TO1536 = ("Resize the browser window to 1536 px wide (for example, maximise it on a 1536 x 864 screen at 100% zoom).",
          "at 1536 px nothing overlaps, nothing is cut off and nothing needs a sideways scroll; the layout described above is unchanged, only wider.")
Q5 = "this attribute depends on question 12 (drawn pictures or build pictures, not answered yet): for now compare it with the picture named here"
M, DF, NT, EM, NC, IN, VE, OC, IV = "Main", "Default", "NewTerm", "Empty", "NewCustomer", "Inactive", "Vendor", "OverCredit", "Invoice"

def PICS(figs):
    names = R(figs)["pictures"]
    if len(names) == 1: return ("The design picture " + names[0] + " is attached to this case; open it at 100% zoom beside the screen.", None)
    return ("The design pictures " + ", ".join(names) + " are attached to this case; open each at 100% zoom beside the screen.", None)

def dz(key, title, pre, pairs, q, figs, words=(), note="", marker=None, who=None, width=True):
    """pairs: [(step, what the tester sees)]. A final 1536-px step is added unless width=False."""
    pairs = list(pairs) + ([TO1536] if width else [])
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    start = [p for p in pre if p[0].startswith("Starting screen:")]
    C(key, "DESIGN", title, [who or ADMIN()] + [p for p in pre if p not in start] + [W1440, PICS(figs)] + start, st, rs, q, note=note, marker=marker)
    DREFS[key] = R(figs, words)

OPEN_PAGE = ('In the Settings menu, click "Credit Terms".', None)
def page_pre(extra=()):
    return list(extra) + [("Starting screen: the Settings page.", None)]

# ============================ A · Credit Terms page and table ============================
dz("D-01", "Design: Credit Terms page and table look as designed",
   page_pre([STD_ACTIVE]),
   [('In the Settings menu, click "Credit Terms".',
     'the page matches the attached picture ct-p1-01-active-tab-one-table.png: in the side menu the Finance group shows "Payment Methods" and, directly below it, "Credit Terms" with a clock icon, in blue because it is open. The title "Credit Terms" is at the top left; at the top right are a square outlined "⋯" button and, right of it, the only blue button on the page, "+ New Credit Term". Below are the "Active" and "Inactive" tabs, then one table (no sections, no card around it) with the headings Name, Due, Customers and Vendors and a last column with no heading. Customers and Vendors counts are right aligned and 0 shows as 0. Every row is one line and ends with a grey "⋯". Only COD, Due on Receipt and Credit Hold show an info (i) icon and a lock icon after the name. The heading style and the font: ' + Q5 + ' (ct-p1-01-active-tab-one-table.png draws small grey headings, the build picture ct-p1-05-row-menu-a-standard-term.png bold black ones).')],
   ["S1-R1", "S1-R2", "S1-R3", "S1-R4", "S1-R10", "S1-R12", "S1-R13", "S1-N3"],
   [(1, 1), (1, 5)], [cap(M, 1, "One table per tab"), cap(M, 1, "The default row carries"), cap(M, 1, "Source: Payment Methods puts its one add button")])

dz("D-02", "Design: Lock and info tooltips on COD look as designed",
   page_pre([STD_ACTIVE]),
   [OPEN_PAGE[:1] + ('the Credit Terms page opens on the Active tab.',),
    ("Hover the lock icon on the COD row.",
     'a dark grey box with white text opens to the right of the icon, over the Due text of the COD row, with no arrow, reading on two lines "Always available." and "COD, Due on Receipt and Credit Hold can\'t be deactivated." (as in ct-p1-01-active-tab-one-table.png).'),
    ("Hover the info icon on the COD row.",
     'the same kind of box opens to the right of the icon reading "Cash on delivery. COD customers can\'t charge to account, so payment is taken when the invoice is created." (as in ct-p1-03-info-tooltip-cod.png).')],
   ["S1-R8 COD", "S1-R9", "UFS-3", "UFS-4"], [(1, 1), (1, 3)],
   [cap(M, 1, "COD, Due on Receipt and Credit Hold are followed by"), cap(M, 3, "\"Cash on delivery.")])

dz("D-03", "Design: Green success toast looks as designed",
   [("Net 30 is active and is not the default for new customers.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 30 row.', "the row menu opens."),
    ('Click "Make Default for New Customers".', 'the confirmation "Make Net 30 the default?" opens.'),
    ('Click "Make Default".',
     'a green toast opens at the bottom right of the page (as in ct-p1-10-saved.png): a white check-circle icon at the left, the first line "Net 30 is now the default" in bold, the line "New customers start on Net 30." below it, and a "Close" text button at the right.')],
   ["S2-R6", "UFS-12"], [(1, 10), (2, 5)], [cap(M, 10, "Source: DS Toast, success.")])

dz("D-04", "Design: Active and Inactive tabs show counts as designed",
   [("At least one term is deactivated.", None), ("Starting screen: the Settings page.", None)],
   [(OPEN_PAGE[0], 'the page opens on "Active". Each tab shows its label followed by a rounded count pill. The selected tab, "Active", has blue text, a blue line under it and a light-blue pill; "Inactive" has grey text and a light-grey pill (as in ct-p1-01-active-tab-one-table.png).'),
    ('Click the "Inactive" tab.', 'the blue text, blue line and light-blue pill move to "Inactive", and "Active" turns grey with a light-grey pill (as in ct-p4-02-inactive-tab-the-rest.png).')],
   ["S1-R3"], [(1, 1), (4, 2)], [cap(M, 1, "Source: Payment Methods uses native tabs")])

dz("D-05", "Design: A 31-character term name fits on one row",
   [("The shop has its own active term {Term-A} whose name is 31 characters long, due 45 days after the invoice date.",
     "For example: {Term-A} is ZZAUTOTEST D-05 Net45 Fleet Acc (31 characters, as long as the design's Net 45 Fleet Accounts Payable X)."),
   ("Starting screen: the Settings page.", None)],
   [(OPEN_PAGE[0],
     "in the {Term-A} row, {Term-A} reads in full on one line, nothing cut off and no dots at the end, in its place among the 45-day terms (as in ct-p1-12-a-31-character-term-name.png).")],
   ["S1-R15", "S3-R2 NAME"], [(1, 12)], [cap(M, 12, "Rendered from the local build with")],
   note="A narrower window than 1440 px may wrap the name onto a second line; it must never be cut off (the design draws only 1440 px).")

dz("D-06", "Design: Default tag shows after the term name",
   [("Due on Receipt is the default for new customers.", None), ("Starting screen: the Settings page.", None)],
   [(OPEN_PAGE[0],
     'on the Due on Receipt row a light-blue "Default" pill with blue text follows the name, after the info icon and the lock icon, and no other row has the pill (as in ct-p1-01-active-tab-one-table.png).'),
    ('Click "⋯" on the Net 30 row.', "the row menu opens."),
    ('Click "Make Default for New Customers".', "the confirmation opens."),
    ('Click "Make Default".', 'the "Default" pill now follows "Net 30" directly (Net 30 has no icons) and has left Due on Receipt (as in ct-p1-10-saved.png).')],
   ["S1-R11", "S2-R6"], [(1, 1), (1, 10), (4, 1)], [cap(M, 1, "Source: DS Badge, info tone")])

dz("D-09", "Design: Active and Inactive tabs after deactivating every term",
   [("Every term that can be deactivated is deactivated, and Net 30 is the default.", None), ("Starting screen: the Settings page.", None)],
   [(OPEN_PAGE[0], 'the Active tab lists only COD, Due on Receipt, Net 30 (with the "Default" pill) and Credit Hold, in that order (as in ct-p4-01-active-tab-after-deactivating-everything-it-can.png).'),
    ('Click the "Inactive" tab.', "the Inactive tab lists every other term in the same order as the Active tab uses, in the same columns with the same widths (the headings do not move), with no info icon, lock icon or Default pill (as in ct-p4-02-inactive-tab-the-rest.png).")],
   ["S1-E1", "S1-R4", "S1-R14"], [(4, 1), (4, 2)], [cap(EM, 1, "What stays:"), cap(EM, 2, "Every deactivated term")])

dz("D-10", "Design: Empty Inactive tab shows No inactive terms",
   [("No term is deactivated.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "Inactive" tab.', 'the tab\'s count pill reads 0 and the tab shows the grey line "No inactive terms" in place of the table, centred (compare ct-p4-03-a-new-shop-inactive-tab-empty.png).')],
   ["S1-N2", "UFS-2"], [(4, 3)], [cap(EM, 3, "With nothing inactive the table shows one line:"), cap(EM, 3, "No build shot:")],
   note="The design keeps the column headings above the line (question 9, register CT-D02); this case follows the PRD. The design's version is D-51 (held).")

# ============================ B · Row menus and the page menu ============================
dz("D-07", "Design: Row menu of an unused own term looks as designed",
   [own("{Term-A}", "day 25", ", held by no customer, vendor or invoice", "ZZAUTOTEST D-07 Six"), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the {Term-A} row.',
     'a white menu with a shadow opens under the "⋯", as wide as its longest item, listing in this order: "Edit" (pencil icon), "Make Default for New Customers" (circle with a tick), "Move Customers" (person icon) greyed, "Deactivate" (archive box), a thin divider line, and "Delete Credit Term" (bin icon) in red text with a red icon and no red background (as in ct-p1-04-row-menu-your-term-not-used-yet.png).')],
   ["S2-R1", "S2-R1 EDIT", "S2-R1 MD", "S2-R1 MOVE", "S2-R1 DEACT", "S2-R1 DEL", "S4-N2"], [(1, 4)],
   [cap(M, 4, "Rendered from the local build: Net 6"), cap(M, 4, "The menu is as wide as its items.")])

dz("D-35", "Design: Row menu of a standard term looks as designed",
   [("Net 15 is active, is not the default and is held by at least one customer.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 15 row.', 'the menu lists "Make Default for New Customers", "Move Customers" and "Deactivate", with their icons, and no "Edit" or "Delete Credit Term".'),
    ('Hover "Move Customers".', "the row turns light grey (as in ct-p2-01-choose-move-customers.png)."),
    ('Hover "Deactivate".', 'the row turns light grey and a dark grey box opens to the LEFT of the menu reading "Hide from customer and vendor pickers" (as in ct-p1-05-row-menu-a-standard-term.png).')],
   ["S2-R1", "S2-N1", "S2-R3", "UFS-10"], [(1, 5), (2, 1)], [cap(M, 5, "Rendered from the local build: Net 15.")])

dz("D-45", "Design: COD row menu with no customers shows one greyed item",
   [DEFAULT_COD, ("No customer other than the Counter Sale customer is on COD.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the COD row.', 'a narrow menu opens with one item, "Move Customers" (person icon), greyed.'),
    ('Hover "Move Customers".', 'a dark grey box opens to the left of the menu reading "No customers are on this term" (as in ct-p1-06-row-menu-cod-the-default.png).')],
   ["S1-N3", "S2-N2", "S4-N2", "UFS-9"], [(1, 6)], [cap(M, 6, "COD, Due on Receipt and Credit Hold never show Deactivate")])

dz("D-46", "Design: Row menu of an own term in use greys Edit and Delete",
   [("The shop has its own active term {Term-A}, due on day 10 of the following month, held by 1 customer, {Customer-A}, and 2 vendors, {Vendor-A} and {Vendor-B}.",
     "For example: {Term-A} is 10th of next month, {Customer-A} is ZZAUTOTEST D-46 Customer, {Vendor-A} and {Vendor-B} are ZZAUTOTEST D-46 Vendor A and ZZAUTOTEST D-46 Vendor B."),
    ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the {Term-A} row.', '"Edit" is greyed (pale grey text and icon); "Make Default for New Customers", "Move Customers" and "Deactivate" are normal; under the divider "Delete Credit Term" is greyed too (pale grey, no longer red).'),
    ('Hover "Delete Credit Term".', 'a dark grey box opens to the left of the menu, on two lines: "Used by 1 customer and 2 vendors" and "Deactivate it instead to take it out of the pickers." (as in ct-p1-07-row-menu-your-term-in-use.png).')],
   ["S2-R1", "S2-R2", "S2-N5", "UFS-7"], [(1, 7)], [cap(M, 7, "Rendered from the local build: 10th of next month")])

dz("D-47", "Design: Row menu of the default term greys Deactivate",
   [("Net 30 is the default for new customers and is held by at least one customer.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 30 row.', 'the Net 30 row turns light grey and a small menu opens with "Move Customers" and "Deactivate", Deactivate greyed; there is no "Make Default for New Customers".'),
    ('Hover "Deactivate".', 'a dark grey box opens to the left of the menu, on two lines: "This is your default for new customers" and "Pick another default first." (as in ct-p1-08-row-menu-the-current-default.png).')],
   ["S2-N4", "S2-R1", "UFS-8"], [(1, 8)], [cap(M, 8, "Here Net 30 is the default.")])

dz("D-48", "Design: Move Customers greyed without the customer permissions",
   [("Due on Receipt is the default for new customers.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the COD row.', 'the row menu opens: "Make Default for New Customers" is normal and "Move Customers" is greyed.'),
    ('Hover "Move Customers".', 'a dark grey box opens to the left of the menu on one line: "You need Customers → Create & Edit and View and Manage AP/AR Data to move customers." (as in ct-p2-09-without-the-customer-permissions.png).')],
   ["S4-N1", "UFS-37"], [(2, 9)], [cap(DF, 9, "A user with Settings")], who=("You are signed in as {User-A}, working in {Location-A}, and the role of {User-A} has Settings → Finance but not Customers → Create & Edit.",
        "For example: {User-A} is ZZAUTOTEST D-48 Finance only and {Location-A} is Staging Heavy Duty - 9919."))

dz("D-49", "Design: Inactive term menu shows Reactivate first",
   [("Net 7 is deactivated and held by at least one customer.", None), PAGE_INACTIVE],
   [('Click "⋯" on the Net 7 row.', 'the menu lists "Reactivate" (a circular arrow icon) and then "Move Customers"; there is no "Make Default for New Customers".'),
    ('Hover "Reactivate".', 'the row turns light grey and a dark grey box opens to the left of the menu reading "Show in pickers again" (as in ct-p3-05-inactive-tab-reactivate.png).')],
   ["S2-R1", "S2-R1 REACT", "S2-R3", "S2-R10"], [(3, 5)], [cap(NT, 5, "Rendered from the local build: Inactive tab, Net 7.")])

dz("D-08", "Design: Page menu shows Audit Log",
   [("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "⋯" button beside "New Credit Term".', 'a small menu opens under the button with one item, "Audit Log", with no icon, as wide as the item (as in ct-p1-13-page-menu-audit-log.png).')],
   ["S12-R1", "UFS-47"], [(1, 13)], [cap(M, 13, "Rendered from the local build: the page")])

# ============================ C · Dialogs ============================
dz("D-11", "Design: Make Default confirmation looks as designed",
   [("Net 30 is active and is not the default.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 30 row.', "the row menu opens."),
    ('Click "Make Default for New Customers".',
     'a window opens in the middle of the dimmed page (as in ct-p1-09-make-net-30-the-default.png): the title "Make Net 30 the default?" with a close × at the right, a line under the title, the message "New customers start on Net 30. Customers you already have keep their current term.", and at the bottom right "Cancel" (white, grey border) then "Make Default" (blue). The window is narrower and its corners less rounded than the New Credit Term window. The Cancel button\'s style and the × colour: ' + Q5 + ".")],
   ["S2-R5", "UFS-11"], [(1, 9)], [cap(M, 9, "Source: DS Modals, confirm variant.")])

dz("D-12", "Design: Delete Credit Term confirmation looks as designed",
   [own("{Term-A}", "net 9", ", held by no customer, vendor or invoice", "ZZAUTOTEST D-12 Nine"), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the {Term-A} row.', "the row menu opens."),
    ('Click "Delete Credit Term".',
     'a window opens over the dimmed page (as in ct-p1-11-delete-credit-term-confirmation.png): the bold title "Confirmation" with a close × at the right, the message "Are you sure you want to delete this credit term?", and at the bottom right "Cancel" then a red "Delete Credit Term". The Cancel style (grey filled in this build picture) and the blue ×: ' + Q5 + ".")],
   ["S2-R9", "UFS-15"], [(1, 11)], [cap(M, 11, "Rendered from the local build. Title")])

dz("D-13", "Design: New Credit Term window with Net days looks as designed",
   [("Today on the calendar of the location you work in is {Date-A}, and {Date-B} is the date 14 days later.", "For example: {Date-A} is Oct 21 and {Date-B} is Nov 4."),
    ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "New Credit Term".', 'a window titled "New Credit Term" opens with a close × at the right.'),
    ('Type "Net 14 Days" in Name.', 'Name reads "Net 14 Days".'),
    ("Type 14 in the Days box.",
     'the window matches ct-p3-01-new-credit-term-net-x-days.png: the Name box with its floating label and the grey hint "Up to 31 characters. Prints on invoices and goes to QuickBooks." under it; below, two rows with round option buttons: "Due Net X days" (chosen) with the Days box and "days after the invoice date" after it, and "Due day of the following month" with a greyed, empty Day box and pale "of the following month"; under them a light-blue box with an info icon and blue text "Net 14 Days means payment is due 14 days after the invoice date. An invoice dated {Date-A} is due {Date-B}."; at the bottom right "Cancel" (white) and "Create Credit Term" (blue). The Cancel style: ' + Q5 + ".")],
   ["S3-R1", "S3-R2", "S3-R2 NAME", "S3-R2 OPTS", "S3-R3", "S3-R5", "S3-R5 NET", "UFS-19", "UFS-27"], [(3, 1)],
   [cap(NT, 1, "New Credit Term opens this window."), cap(NT, 1, "Only the selected option's box is active"), cap(NT, 1, "Source: DS Modals")],
   note="The two dates show as a short month and day.")

dz("D-14", "Design: New Credit Term window with day of month looks as designed",
   [("Today on the calendar of the location you work in is {Date-A}, and {Date-B} is the 10th of the following month.", "For example: {Date-A} is Oct 21 and {Date-B} is Nov 10."),
    ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "New Credit Term".', 'the "New Credit Term" window opens.'),
    ('Type "10th of next month" in Name.', 'Name reads "10th of next month".'),
    ("Click the greyed Day box.", 'the option "Due day of the following month" becomes chosen, the cursor is in the Day box, and the Days box turns greyed and empty with pale "days after the invoice date".'),
    ("Type 10 in the Day box.",
     'the blue box reads "10th of next month means payment is due on the 10th of the following month. An invoice dated {Date-A} is due {Date-B}." (as in ct-p3-02-new-credit-term-day-of-the-following-month.png).')],
   ["S3-R3", "S3-R4", "S3-R5", "S3-R5 DAY", "UFS-28"], [(3, 2)], [cap(NT, 2, "Day is active with 10;"), cap(NT, 2, "The day field reads")],
   note="The two dates show as a short month and day.")

dz("D-15", "Design: New Credit Term errors show in red under the field",
   [("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "New Credit Term".', 'the "New Credit Term" window opens with no error showing.'),
    ('Type "net 30" in Name.', 'Name reads "net 30".'),
    ("Type 400 in the Days box.",
     'both the Name box and the Days box have a red border and a red label; under Name the red message "Net 30 is already a standard term. Pick another name." and under Days the red message "Enter 1 to 365 days."; "Create Credit Term" is pale blue (disabled) (as in ct-p3-03-validation-errors.png).')],
   ["S3-R9", "S3-R9 STD", "S3-R9 DAYS", "S3-R6", "UFS-22", "UFS-24"], [(3, 3)], [cap(NT, 3, "Names are compared ignoring capitals"), cap(NT, 3, "Create Credit Term stays disabled")],
   note="Whether the blue line shows while only the Name is wrong is question 10 (CT-D03, D-52 held); this case types two wrong values, where design and PRD agree that no blue line shows.")

dz("D-16", "Design: Edit Credit Term window looks as designed",
   [own("{Term-A}", "net 45", ", held by no customer, vendor or invoice", "ZZAUTOTEST D-16 FortyFive"), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the {Term-A} row.', "the row menu opens."),
    ('Click "Edit".', 'a window titled "Edit Credit Term" opens, filled: Name {Term-A} (selected), "Due Net X days" chosen with 45 in the Days box, the Day box empty, the blue explanation line, and at the bottom right "Cancel" and "Save Changes" (blue) (as in ct-p3-04-edit-credit-term.png). The Cancel style and the × colour: ' + Q5 + ".")],
   ["S2-R4", "S3-R1"], [(3, 4)], [cap(NT, 4, "Rendered from the local build: Edit on an unused term")])

dz("D-17", "Design: Move Customers window looks as designed",
   [("Due on Receipt is the default for new customers, not COD.", None),
    ("At least ten customers are on COD, among them {Customer-A} and {Customer-B}.", "For example: {Customer-A} is ZZAUTOTEST D-17 Alpha and {Customer-B} is ZZAUTOTEST D-17 Bravo."),
    ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the COD row.', "the row menu opens."),
    ('Click "Move Customers".',
     'a window titled "Move Customers from COD" opens (as in ct-p2-02-move-customers-from-cod.png). Top to bottom: a "Search customers" box with a magnifier; blue "Select All" and "Select None" at the left and "{n} selected" in grey at the right; a bordered scrolling list, one customer per row with a line between rows, A to Z, every box ticked; the "Move To" box reading "Due on Receipt" with the grey line "Prefilled with your default for new customers." under it; at the bottom right "Cancel" and a blue "Move {n} Customers". The ticked-box style (light blue with a blue tick in the drawn picture, solid blue with a white tick in the build picture ct-p2-06-move-to-cod-the-0-line.png), the Move To box style (outlined with a small arrow, or filled with a solid arrow) and the Cancel style: ' + Q5 + "."),
    ("Untick {Customer-A}.", 'the box of {Customer-A} is empty, the count reads one less and the button reads "Move" with the lower number (as in ct-p2-03-some-customers-unticked.png).')],
   ["S4-R1", "S4-R2", "S4-R4", "S4-R7", "UFS-34", "UFS-49"], [(2, 2), (2, 3), (2, 6)],
   [cap(DF, 2, "Title uses the 18px form-dialog title"), cap(DF, 2, "Source: DS Modals (form body)")],
   note="{n} is the number of customers on COD (the Counter Sale customer is never listed or counted).")

dz("D-37", "Design: Move To dropdown lists the active terms",
   [("Due on Receipt is the default for new customers.", None), ("At least one customer is on COD.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the COD row.', "the row menu opens."),
    ('Click "Move Customers".', 'the "Move Customers from COD" window opens.'),
    ('Click the "Move To" box.', 'a list opens over the customer list: "Due on Receipt" first, highlighted light blue with blue text, then the other active terms in the page\'s order (Net 7, Net 15 …); COD is not in the list and no row carries a "Default" pill (as in ct-p2-04-pick-another-term.png).')],
   ["S4-R7", "S4-N3"], [(2, 4)], [cap(DF, 4, "Any active term can be picked.")])

dz("D-18", "Design: Move To COD shows the $0 line under the hint",
   [DEFAULT_COD, ("At least two customers are on Net 7.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 7 row.', "the row menu opens."),
    ('Click "Move Customers".', 'the "Move Customers from Net 7" window opens with "Move To" reading COD.'),
    ("Look under Move To.", 'two grey lines show under it: "Prefilled with your default for new customers." and "Their credit limit will be set to $0." (as in ct-p2-06-move-to-cod-the-0-line.png).')],
   ["S4-R7", "S4-R10", "UFS-35", "UFS-34"], [(2, 6)], [cap(DF, 6, "Rendered from the local build: moving from Net 7")])

dz("D-19", "Design: The $0 confirmation looks as designed",
   [DEFAULT_COD, ("At least two customers are on Net 7.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "⋯" on the Net 7 row.', "the row menu opens."),
    ('Click "Move Customers".', 'the "Move Customers from Net 7" window opens with "Move To" reading COD.'),
    ('Click "Move {n} Customers".', 'a window opens over the Move window (as in ct-p2-07-confirm-the-0-limits.png): the bold title "Set {n} customers\' credit limit to $0?", the message "This can\'t be undone. Their current limits are kept in each customer\'s note, and the Credit Terms Log records the move.", and "Cancel" then a red "Set Limits To $0 And Move". The Cancel style: ' + Q5 + "."),
    ('Click "Cancel".', "the confirmation closes and the Move window shows the same ticks and Move To as before (as in ct-p2-08-cancel-keeps-the-choices.png).")],
   ["S4-R14", "S4-R15", "UFS-36"], [(2, 7), (2, 8)], [cap(DF, 7, "Rendered from the local build. Title"), cap(DF, 8, "Rendered from the local build after Cancel")],
   note="{n} is the number of customers on Net 7.")

dz("D-20", "Design: Credit Terms Log window looks as designed",
   [("At least three changes were saved on the Credit Terms page, one of them an edit that changed both the name and the days of a term.", None),
    ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "⋯" button beside "New Credit Term".', "the page menu opens."),
    ('Click "Audit Log".', 'a wide window opens (as in ct-p1-14-credit-terms-log.png): the bold title "Credit Terms Log" at the left, a search box with a magnifier in the middle and a close × at the right; a table with the headings Event, User, Details, Date and Time on a light-grey band; the newest change on top; the edit row shows its two Details lines one under the other.')],
   ["S12-R2", "S12-R3", "S12-R8", "S12-R3 EDITED"], [(1, 14)], [cap(M, 14, "Columns Event, User, Details"), cap(M, 14, "Rendered from the local build: the app's shared Audit Log dialog")])

dz("D-21", "Design: Empty Credit Terms Log shows its empty line",
   [("No change has been saved on the Credit Terms page since release.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "⋯" button beside "New Credit Term".', "the page menu opens."),
    ('Click "Audit Log".', 'the log window shows its column headings and, centred under them in grey, "No history here. Yet." (as in ct-p1-15-credit-terms-log-empty.png).')],
   ["S12-E1", "UFS-50"], [(1, 15)], [cap(M, 15, "Rendered from the local build with no log rows")])

dz("D-38", "Design: Credit Terms Log load error looks as designed",
   [("The log cannot be loaded (the setup file says how to make it fail on the test shop).", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "⋯" button beside "New Credit Term".', "the page menu opens."),
    ('Click "Audit Log".', 'the table shows no rows and, in place of the empty line, "Something went wrong loading the Credit Terms Log. Please try again."; a red alert at the bottom right with a warning triangle reads the same sentence with "Close"; the Credit Terms page behind is unchanged (as in ct-p1-16-credit-terms-log-could-not-load.png).')],
   ["UFS-51"], [(1, 16)], [cap(M, 16, "Rendered from the local build with the log request failing."), cap(M, 16, "Differs from the PRD:")],
   note="The picture's caption says the build differs from the PRD; PRD v3 now says exactly what the picture shows (register CT-D08, settled).")

dz("D-25", "Design: Over Credit confirmation looks as it does today",
   [("{Customer-A} is on Net 45 with a credit limit of {Amount-A} and a balance above it.", "For example: {Customer-A} is ZZAUTOTEST D-25 Over, {Amount-A} is $500.00 and the balance is $600.00."),
    ("Starting screen: the customer page of {Customer-A}.", None)],
   [('Click "New Work Order".', 'the "New Work Order" window opens.'),
    ('Click "Save".', 'a window titled "Confirmation" opens over it with the message "Are you sure you want to open a new work order? This customer is over their credit limit." and the buttons "Create" (red) then "Cancel", looking exactly as today\'s picture ct-p8-01-the-over-credit-warning-today.png (Cancel blue filled, blue ×).')],
   ["S9-R1", "S9-R3", "UFS-52"], [(8, 1), (8, 3)], [cap(OC, 1, "The dialog itself does not change."), cap(OC, 3, "Source: CustomerWarningDialog.vue")],
   note="The board's redraw (ct-p8-03) shows a white Cancel; the PRD says the dialog is unchanged, so compare with today's picture (register CT-D06, settled).")

# ============================ D · Customers, vendors, due dates ============================
CUS = ("Starting screen: the Customers page.", None)
dz("D-22", "Design: New Customer shows Credit Terms and Credit Limit side by side",
   [("Due on Receipt is the default for new customers.", None), CUS],
   [('Click "New Customer".', 'the "New Customer" window opens (as in ct-p5-02-new-customer-credit-terms-prefilled-with-the-def.png): after "State/Province" and "Country" comes one row with "Credit Terms" at the left, reading "Due on Receipt", and "Credit Limit" at the right, empty, the two boxes the same width as State/Province and Country above them; the Sales Representative field follows. Compared with today\'s picture ct-p5-01-new-customer-today.png only this row is new.')],
   ["S5-R1", "S5-R2"], [(5, 1), (5, 2)], [cap(NC, 2, "Credit Limit now sits beside it"), cap(NC, 2, "Field order from CustomerDialog.vue")])

dz("D-23", "Design: Credit Terms dropdown on New Customer looks as designed",
   [("Due on Receipt is the default for new customers.", None), CUS],
   [('Click "New Customer".', 'the "New Customer" window opens.'),
    ('Click the "Credit Terms" box.', 'a list as wide as the box opens: text-only rows, COD first, then "Due on Receipt" highlighted light blue with blue text and a light-blue "Default" pill after it, then the other active terms in the page\'s order; no row shows a hover text (as in ct-p5-03-new-customer-the-credit-terms-picker.png).')],
   ["S5-R3", "S1-R5"], [(5, 3)], [cap(NC, 3, "No hover hints on the options"), cap(NC, 3, "Source: DS Menus")])

dz("D-24", "Design: Credit Limit locks at $0.00 for COD on New Customer",
   [("Net 30 is the default for new customers.", None), CUS],
   [('Click "New Customer".', 'the "New Customer" window opens.'),
    ('Choose "COD" in Credit Terms.', 'Credit Limit reads "$ 0.00" in grey on a light-grey, greyed box.'),
    ("Hover Credit Limit.", 'a dark grey box opens under the field reading "COD and Credit Hold customers can\'t charge to account, so they have no credit limit." (as in ct-p5-04-new-customer-cod-picked-limit-locked-at-0.png).')],
   ["S5-R4", "UFS-44"], [(5, 4)], [cap(NC, 4, "Picking COD or Credit Hold sets")])

dz("D-39", "Design: New Customer without AP/AR access has no credit fields",
   [CUS],
   [('Click "New Customer".', 'the window has no Credit Terms and no Credit Limit; the Sales Representative field follows State/Province and Country directly, with no gap left (as in ct-p5-05-new-customer-without-view-and-manage-ap-ar-data.png).')],
   ["S5-N1"], [(5, 5)], [cap(NC, 5, "No Credit Terms and no Credit Limit field.")], who=("You are signed in as {User-A}, working in {Location-A}, and the role of {User-A} can create customers but does not have View and Manage AP/AR Data.",
        "For example: {User-A} is ZZAUTOTEST D-39 No AP and {Location-A} is Staging Heavy Duty - 9919."))

dz("D-26", "Design: Customer card shows a deactivated term as Inactive",
   [("{Customer-A} is on Net 50, and Net 50 is deactivated.", "For example: {Customer-A} is ZZAUTOTEST D-26 Customer."), ("Starting screen: the Customers page.", None)],
   [("Open {Customer-A}.", 'the card at the left shows "Credit term" with "Net 50 (Inactive)" under it, whole and not cut off, in the same place and style as today\'s card (compare ct-p6-02-customer-on-a-deactivated-term.png and today\'s ct-p6-01-customer-page-today.png).')],
   ["S5-R8", "S5-R14"], [(6, 1), (6, 2)], [cap(IN, 2, "The shop deactivated Net 10.")],
   note="Do not compare the credit limit value on the picture: the design's demo card shows $0.00 while its Edit window shows $5,000.00 (register CT-D09).")

dz("D-27", "Design: Edit Customer keeps the inactive term selected",
   [("{Customer-A} is on Net 50 with a credit limit of {Amount-A}, and Net 50 is deactivated.", "For example: {Customer-A} is ZZAUTOTEST D-27 Customer and {Amount-A} is $5,000.00."),
    ("Starting screen: the customer page of {Customer-A}.", None)],
   [("Click the pencil on the customer card.", 'the "Edit Customer" window opens with "Credit Terms" reading "Net 50 (Inactive)" and "Credit Limit" reading {Amount-A}, editable, side by side after State/Province and Country (as in ct-p6-04-edit-customer-keeps-the-inactive-term.png; compare today\'s ct-p6-03-edit-customer-today.png).')],
   ["S5-R7", "S5-R12", "S5-R1"], [(6, 3), (6, 4)], [cap(IN, 4, "Credit Terms stays on")])

dz("D-40", "Design: Credit Limit locks at $0.00 for COD on Edit Customer",
   [("{Customer-A} is on Net 30 with a credit limit of {Amount-A}.", "For example: {Customer-A} is ZZAUTOTEST D-40 Customer and {Amount-A} is $5,000.00."),
    ("Starting screen: the customer page of {Customer-A}.", None)],
   [("Click the pencil on the customer card.", 'the "Edit Customer" window opens.'),
    ('Choose "COD" in Credit Terms.', 'Credit Limit reads "$ 0.00", greyed.'),
    ("Hover Credit Limit.", 'a dark grey box opens under the field reading "COD and Credit Hold customers can\'t charge to account, so they have no credit limit." (as in ct-p6-06-edit-customer-cod-or-credit-hold-locks-the-limit.png).')],
   ["S5-R4", "UFS-44"], [(6, 6)], [cap(IN, 6, "On COD or Credit Hold the Credit Limit is")])

dz("D-28", "Design: Dropdown of a customer on an inactive term lists it last",
   [("{Customer-A} is on Net 50, and Net 50 is deactivated.", "For example: {Customer-A} is ZZAUTOTEST D-28 Customer."), ("Starting screen: the customer page of {Customer-A}.", None)],
   [("Click the pencil on the customer card.", 'the "Edit Customer" window opens.'),
    ('Click the "Credit Terms" box.', 'the list shows the active terms in the page\'s order with no "Net 50" among them, then, last, "Net 50 (Inactive)", selected (highlighted). Compare ct-p6-05-this-customer-s-picker.png for the list and ct-p7-07-edit-vendor-keeps-the-inactive-term.png for the last row (the customer drawing is cut off before that row).')],
   ["S5-R7"], [(6, 5), (7, 7)], [cap(IN, 5, "The active terms, then this customer's own")])

dz("D-41", "Design: Other customers' dropdown leaves out the inactive term",
   [("{Customer-A} is on Net 30, and Net 50 is deactivated.", "For example: {Customer-A} is ZZAUTOTEST D-41 Customer."), ("Starting screen: the customer page of {Customer-A}.", None)],
   [("Click the pencil on the customer card.", 'the "Edit Customer" window opens.'),
    ('Click the "Credit Terms" box.', 'the list shows the active terms only, "Net 30" highlighted, and neither "Net 50" nor "Net 50 (Inactive)" (as in ct-p6-07-any-other-customer-s-picker.png).')],
   ["S5-N2"], [(6, 7)], [cap(IN, 7, "A customer not on Net 10")])

VEN = ("Starting screen: the Vendors page.", None)
dz("D-29", "Design: New Vendor starts on COD with the shop's own terms",
   [own("{Term-A}", "net 10", example="ZZAUTOTEST D-29 Ten"), ("Due on Receipt is the default for new customers.", None), VEN],
   [('Click "New Vendor".', 'the "New Vendor" window opens with "Credit Terms" reading COD and "Credit Limit" reading "$ 0.00", editable, side by side (as in ct-p7-02-new-vendor-starts-on-cod-picker-with-your-terms.png; compare today\'s ct-p7-01-new-vendor-today.png).'),
    ('Click the "Credit Terms" box.', 'the list shows the active terms in the page\'s order with {Term-A} among the Net terms, and no row has a "Default" pill.')],
   ["S6-R1", "S6-R2", "S6-R4"], [(7, 1), (7, 2)], [cap(VE, 2, "A new vendor starts on COD"), cap(VE, 2, "Credit Limit: vendors have a required")])

dz("D-30", "Design: Edit Vendor dropdown looks as designed",
   [("{Vendor-A} is on Net 30.", "For example: {Vendor-A} is ZZAUTOTEST D-30 Vendor."), ("Starting screen: the vendor page of {Vendor-A}.", None)],
   [("Click the pencil on the vendor card.", 'the "Edit Vendor" window opens (compare today\'s ct-p7-03-edit-vendor-today.png).'),
    ('Click the "Credit Terms" box.', 'the list shows text-only rows in the same order as the customer dropdown; "Net 30" is highlighted light blue with a blue tick before the name; no row has a "Default" pill (as in ct-p7-04-edit-vendor-the-picker-with-your-terms.png).')],
   ["S6-R1", "S6-R2"], [(7, 3), (7, 4), (7, 8)], [cap(VE, 4, "The same list and order")])

dz("D-31", "Design: Edit Vendor lists the vendor's inactive term last",
   [("{Vendor-A} is on Net 50, and Net 50 is deactivated.", "For example: {Vendor-A} is ZZAUTOTEST D-31 Vendor."), ("Starting screen: the vendor page of {Vendor-A}.", None)],
   [("Click the pencil on the vendor card.", 'the "Edit Vendor" window opens with "Credit Terms" reading "Net 50 (Inactive)".'),
    ('Click the "Credit Terms" box.', 'the list ends with Net 120, the shop\'s day-of-month terms, Credit Hold, then "Net 50 (Inactive)" last, ticked and highlighted (as in ct-p7-07-edit-vendor-keeps-the-inactive-term.png).')],
   ["S6-R3"], [(7, 7)], [cap(VE, 7, "Credit Terms stays on")])

dz("D-42", "Design: Vendor card shows a deactivated term as Inactive",
   [("{Vendor-A} is on Net 50, and Net 50 is deactivated.", "For example: {Vendor-A} is ZZAUTOTEST D-42 Vendor."), VEN],
   [("Open {Vendor-A}.", 'the vendor card shows "Credit term" with "Net 50 (Inactive)" under it, whole, in the same place and style as today\'s card (compare ct-p7-06-vendor-on-a-deactivated-term.png and today\'s ct-p7-05-vendor-page-today.png).')],
   ["S6-R3", "S6-R6"], [(7, 5), (7, 6)], [cap(VE, 6, "The shop deactivated Net 10.")])

dz("D-32", "Design: Vendor invoice due date for a day-of-month term",
   [own("{Term-A}", "day 10", example="ZZAUTOTEST D-32 Tenth"), ("{Vendor-A} is on {Term-A}.", "For example: {Vendor-A} is ZZAUTOTEST D-32 Vendor."),
    ("{Vendor-A} has a saved vendor invoice, {Vendor-invoice-A}, dated Oct 5, 2026.", "For example: {Vendor-invoice-A} is a vendor invoice for one part."),
    ("Starting screen: the vendor invoices list (Parts, Vendors, Vendor Invoices).", None)],
   [("Open {Vendor-invoice-A}.", 'the Vendor Invoice card shows "Invoice date" Oct 5, 2026 and under it "Due date" Nov 10, 2026, in the same layout as today\'s card (compare ct-p7-10-vendor-on-10th-of-next-month-oct-5-due-nov-10.png and today\'s ct-p7-09-a-vendor-invoice-today-net-60.png; the yellow highlight on the picture is not part of the screen).')],
   ["S7-R2", "S7-R9"], [(7, 9), (7, 10)], [cap(VE, 10, "Same date rule"), cap(VE, 10, "The highlight marks what to check")])

dz("D-43", "Design: Vendor invoice due date for a shop's Net term",
   [own("{Term-A}", "net 10", example="ZZAUTOTEST D-43 Ten"), ("{Vendor-A} is on {Term-A}.", "For example: {Vendor-A} is ZZAUTOTEST D-43 Vendor."),
    ("{Vendor-A} has a saved vendor invoice, {Vendor-invoice-A}, dated Oct 5, 2026.", "For example: {Vendor-invoice-A} is a vendor invoice for one part."),
    ("Starting screen: the vendor invoices list (Parts, Vendors, Vendor Invoices).", None)],
   [("Open {Vendor-invoice-A}.", 'the Vendor Invoice card shows "Invoice date" Oct 5, 2026 and "Due date" Oct 15, 2026 (as in ct-p7-11-vendor-on-net-10-oct-5-due-oct-15.png).')],
   ["S7-R1", "S7-R9"], [(7, 11)], [cap(VE, 11, "A shop's own Net X term")])

dz("D-33", "Design: Invoice shows the day-of-month term and due date",
   [own("{Term-A}", "day 10", example="10th of next month (on a test shop name it ZZAUTOTEST D-33 Tenth)"), ("{Customer-A} is on {Term-A}.", "For example: {Customer-A} is ZZAUTOTEST D-33 Customer."),
    ("Work order {Work-order-1} for {Customer-A} was invoiced with the invoice date Oct 5, 2026.", "For example: {Work-order-1} is S2-17610."),
    ("Starting screen: work order {Work-order-1}.", None)],
   [('Click the "Finance" tab.', 'under "Invoice: INV-{Work-order-1}" the lines read "Invoice date: Oct 5, 2026" and "Due date: Nov 10, 2026"; the reference chips read "Work Order {Work-order-1}", "Customer PO …" and "Terms {Term-A}", the term name whole; the layout is today\'s (compare ct-p9-02-10th-of-next-month-invoice-oct-5-due-nov-10.png and today\'s ct-p9-01-an-invoice-today-net-30.png; the orange outline on the picture is not part of the screen).')],
   ["S7-R2", "S5-R8", "S5-R11"], [(9, 1), (9, 2)], [cap(IV, 2, "Layout and labels unchanged;"), cap(IV, 2, "The screen shows the same document the PDF prints")])

dz("D-44", "Design: Late-month invoice is still due the next month",
   [own("{Term-A}", "day 10", example="ZZAUTOTEST D-44 Tenth"), ("{Customer-A} is on {Term-A}.", "For example: {Customer-A} is ZZAUTOTEST D-44 Customer."),
    ("Work order {Work-order-1} for {Customer-A} was invoiced with the invoice date Oct 28, 2026.", "For example: {Work-order-1} is S2-17655."),
    ("Starting screen: work order {Work-order-1}.", None)],
   [('Click the "Finance" tab.', 'the invoice lines read "Invoice date: Oct 28, 2026" and "Due date: Nov 10, 2026" (as in ct-p9-03-invoice-oct-28-still-due-nov-10.png).')],
   ["S7-R2"], [(9, 3)], [cap(IV, 3, "Always the next month,")])

dz("D-34", "Design: New Work Order for a COD customer shows no warning",
   [("{Customer-A} is on COD with a $0.00 credit limit and an unpaid balance.", "For example: {Customer-A} is ZZAUTOTEST D-34 COD, balance $1,200.00."),
    ("{Customer-A} has an asset, {Asset-A}.", "For example: {Asset-A} is 2019 Kenworth T880."), ("Starting screen: the customer page of {Customer-A}.", None)],
   [('Click "New Work Order".', 'the "New Work Order" window opens with Customer {Customer-A} (as in ct-p8-02-cod-customer-0-limit-owes-1-200-no-warning.png).'),
    ("Choose {Asset-A} in Asset.", "Asset reads {Asset-A}."),
    ('Click "Save".', 'the work order opens; no "Confirmation" window appears.')],
   ["S9-N1", "S9-N2"], [(8, 2)], [cap(OC, 2, "Save opens the work order.")])

dz("D-36", "Design: Over limit badge looks as it does today",
   [("{Customer-A} is on Net 30 with a credit limit of {Amount-A} and a balance above it.", "For example: {Customer-A} is ZZAUTOTEST D-36 Over, {Amount-A} is $500.00."),
    ("Work order {Work-order-1} is open for {Customer-A}.", "For example: {Work-order-1} is S2-17322."), ("Starting screen: the Work Orders page.", None)],
   [("Open work order {Work-order-1}.", 'under the work order number a red "Over Limit" pill shows beside the status badge, the same as today\'s picture ct-p9-01-an-invoice-today-net-30.png.')],
   ["S9-R2", ("Story 9, Form factor", prd_line("Form factor: Mobile-optimized: no new screen; the existing confirmation"))], [(9, 1)],
   [cap(OC, 3, "Part sales show no over-credit confirmation")],
   note='The PRD writes "Over limit"; today\'s badge reads "Over Limit" and the PRD keeps the existing badge (register CT-D07, settled).')

# ============================ E · Held design-version cases (Rule 130.5) ============================
def held(n): return f"{DESIGN_HOLD} (question {n + 7})"
dz("D-50", "Design: Due on Receipt info tooltip reads as designed",
   [("Starting screen: the Credit Terms page, Active tab.", None)],
   [("Hover the info icon on the Due on Receipt row.", 'a dark grey box opens to the right of the icon reading "Payment is due on the invoice date, but you can create the invoice without taking payment." (as in ct-p1-02-info-tooltip-due-on-receipt.png).')],
   ["S1-R8 DOR"], [(1, 2)], [txt(M, 2, "Payment is due on the invoice date, but you can create the invoice without taking payment."), cap(M, 2, "\"Payment is due on the invoice date, but")],
   note="Held: this is the design's wording; the PRD case S1-13 checks the PRD's wording. Released or deleted the day Chris Ward answers question 8 (register CT-D01).", marker=held(1))

dz("D-51", "Design: Empty Inactive tab keeps the column headings",
   [("No term is deactivated.", None), ("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click the "Inactive" tab.', 'the count pill reads 0; the column headings Name, Due, Customers and Vendors stay, and one centred grey row under them reads "No inactive terms", with a line under it (as in ct-p4-03-a-new-shop-inactive-tab-empty.png).')],
   ["S1-N2"], [(4, 3)], [cap(EM, 3, "With nothing inactive the table shows one line:")],
   note="Held: the design's version; D-10 and S1-23 follow the PRD (\"in place of the table\"). Released or deleted when question 9 is answered (register CT-D02).", marker=held(2))

dz("D-52", "Design: No blue line while the name is not allowed",
   [("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "New Credit Term".', 'the "New Credit Term" window opens.'),
    ('Type "net 30" in Name.', 'Name reads "net 30".'),
    ("Type 14 in the Days box.", 'under Name the red message "Net 30 is already a standard term. Pick another name." shows, the Days box has no error, and no blue explanation line shows (design note: "No sentence shows while a field is invalid.").')],
   ["S3-R5"], [(3, 3)], [cap(NT, 3, "Other messages:")],
   note="Held: the design's behaviour; under the PRD the blue line shows because the number is valid (cases S3-03, D-13). Released or deleted when question 10 is answered (register CT-D03).", marker=held(3))

dz("D-53", "Design: Name error shows after clicking in and out",
   [("Starting screen: the Credit Terms page, Active tab.", None)],
   [('Click "New Credit Term".', 'the "New Credit Term" window opens with no error.'),
    ("Click in the Name box.", "the cursor is in the Name box and no error shows."),
    ('Click the "Due day of the following month" option.', 'the Name box turns red with the red message "Enter a name." under it (design note: "Errors show only after a field is touched or Create is pressed").')],
   ["S3-R10"], [(3, 3)], [cap(NT, 3, "Create Credit Term stays disabled")],
   note="Held: one reading of the design's note; the PRD (case S3-11) shows no Name error until the user has typed in it. Released or deleted when question 11 is answered (register CT-D04).", marker=held(4))
